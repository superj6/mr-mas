"""Score -> tracks -> family stems (any length, any tempo; loop-aware; parallel).

A Score holds Notes in SECONDS (use grid.Grid / arrange.Arr to write in bars and beats), Tracks
(one per player, each routed to one of the ten stem families in core.FAMILIES) and bus settings.

render_score(sc)            -> {family: stereo float32 [2, n]}   the linear cue as written
render_loop(sc)             -> ({family: loop [2, P]}, {family: ringout [2, T]})
                               P = the loop length in samples; the loop wraps seamlessly because every
                               sample the loop body produces past the loop end (releases, reverb) is
                               folded back onto its start.  ringout = what rings on after the LAST pass.
expand_loops(sc, n)         -> a new Score with the loop body played n times (album versions)
"""
from __future__ import annotations

import inspect
import os
import time
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field, replace
from multiprocessing import get_context
from typing import Callable

import numpy as np

from .core import (SR, FAMILIES, Note, s2n, db, to_stereo, apply_pan, add_at, env_curve, lp, hp, peq, shelf)
from . import library, sampler, humanize
from .mix import convolve

TAIL_PAD = 4.0            # seconds of render headroom past the requested length (reverb / release)


@dataclass
class Track:
    name: str
    src: tuple                     # ('ss', set) | ('art', inst) | ('sf2', path, bank, preset, drums) | ('fn', callable)
    stem: str                      # one of core.FAMILIES
    gain_db: float = 0.0
    pan: float = 0.0
    width: float = 1.0
    sends: dict = field(default_factory=dict)       # {'hall': dB, 'room': dB, ...}  (see mix.REVERBS)
    hum_ms: float = 6.0            # timing humanisation (sigma, ms)
    offset_ms: float = 0.0         # push/pull (negative = ahead)
    vel_jit: float = 0.04
    drift_ms: float = 0.0          # slow shared ensemble drift (ms peak)
    rel: float = 0.3               # default release seconds
    post: Callable | None = None   # buf -> buf (track insert, e.g. snes_post, Era)
    eq: list = field(default_factory=list)          # [('hp',f),('lp',f),('peq',f,g,q),('hs',f,g),('ls',f,g)]
    auto: list | None = None       # gain automation [(sec, gain_lin)]
    sf2_gain: float = 0.0
    pedal: list | None = None      # [(sec, bool)]  sustain pedal (SF2 tracks)
    cc: list | None = None         # [(sec, controller, value)]  (SF2 tracks, e.g. CC11 swells)
    seed: int = 0
    latency_ms: float = 0.0        # sample/SF2 onset latency, compensated on every note (incl. locked hits)
    credit: str = ''               # sample credit (filled by the palette; used by the cue sheet)
    balance: str | None = None     # balance group override: piano | orch | bigband | chip | rhythm | fx


@dataclass
class Score:
    name: str
    grid: object                                       # grid.Grid
    tracks: dict
    notes: list
    stems: list = field(default_factory=lambda: list(FAMILIES))
    stem_post: dict = field(default_factory=dict)      # family -> callable(buf[, ctx]) (nonlinear OK)
    stem_gain: dict = field(default_factory=dict)      # family -> dB
    stem_auto: dict = field(default_factory=dict)      # family -> [(sec, dB)]
    macro: list | None = None                          # [(sec, dB)] fader ride on every stem
    loop: tuple | None = None                          # (start_s, end_s): the seamless loop body
    end_fade: tuple | None = None                      # (start_s, end_s) fade-out of the full cue
    length_s: float | None = None                      # musical end (default: grid.length_s)
    tail_s: float = 5.0                                # max natural ring-out kept after the end (auto-trimmed)
    mutes: list = field(default_factory=list)          # [(start_s, end_s)] hard stops (D6 drop-out): every stem and
                                                       # its reverb tails to digital zero within mute_fade_ms
    mute_fade_ms: float = 3.0
    markers: list = field(default_factory=list)        # [(sec, label)] hit points / sync marks
    sections: list = field(default_factory=list)       # [(label, start_s, end_s)]
    meta: dict = field(default_factory=dict)
    master: dict = field(default_factory=dict)         # {'album': {...}, 'underscore': {...}} overrides

    @property
    def end_s(self) -> float:
        return self.length_s if self.length_s is not None else self.grid.length_s


# ====================================================================== track rendering
def _eq(buf, eq):
    for e in eq:
        k = e[0]
        if k == 'hp':
            buf = hp(buf, e[1], e[2] if len(e) > 2 else 2)
        elif k == 'lp':
            buf = lp(buf, e[1], e[2] if len(e) > 2 else 2)
        elif k == 'peq':
            buf = peq(buf, e[1], e[2], e[3] if len(e) > 3 else 1.0)
        elif k == 'hs':
            buf = shelf(buf, e[1], e[2], True)
        elif k == 'ls':
            buf = shelf(buf, e[1], e[2], False)
    return buf


def _call_post(fn, buf, ctx):
    try:
        nparams = len(inspect.signature(fn).parameters)
    except (TypeError, ValueError):
        nparams = 1
    return fn(buf, ctx) if nparams >= 2 else fn(buf)


def _curve(points, n, timemap=None):
    """Automation curve in seconds; timemap (sec -> sec) folds loop tails back onto the loop."""
    if timemap is None:
        return env_curve(points, n)
    t = timemap(np.arange(n) / SR)
    return np.interp(t, [p[0] for p in points], [p[1] for p in points]).astype(np.float32)


def _set_for(tr, n):
    kind = tr.src[0]
    if 'set' in n.x:
        return n.x['set']
    if kind == 'art':
        return library.art_set(tr.src[1], n.x.get('art'))
    return tr.src[1]


def _head_trim(y, k):
    """Drop the first k samples of y (it would start before its floor) with a 1 ms fade-in."""
    if k <= 0:
        return y
    y = y[:, k:].copy()
    f = min(48, y.shape[1])
    y[:, :f] *= np.linspace(0, 1, f, dtype=np.float32)[None]
    return y


def render_track(tr: Track, notes, n_buf: int, floor_s=None, timemap=None):
    """Render one track's notes into a stereo buffer of n_buf samples.
    floor_s(note) -> earliest allowed render start (s) for that note (loop start clamp) or None."""
    notes = humanize.apply_track(tr, notes)
    buf = np.zeros((2, n_buf), dtype=np.float32)
    kind = tr.src[0]
    for n in notes:
        lat = tr.latency_ms
        if kind == 'art':
            lat += library.ART_DEFAULTS.get(n.x.get('art') or 'sus', {}).get('latency_ms', 0.0)
        fl = max(floor_s(n) if floor_s else 0.0, 0.0)
        onset = max(n.start, fl)          # humanisation never pushes a note before its floor (a loop pass start)
        n.x['_start_n'] = s2n(onset - lat / 1000.0)
        n.x['_floor_n'] = s2n(fl)         # ...but sample latency lead-in before the floor is trimmed, not delayed
    if kind in ('ss', 'art'):
        for n in notes:
            x = n.x
            rng = np.random.default_rng(x['_seed'])
            ss = library.get(_set_for(tr, n))
            adef = library.ART_DEFAULTS.get(x.get('art') or 'sus', {}) if kind == 'art' else {}
            y = ss.render(n.pitch, n.vel, n.dur, rng, rel_s=x.get('rel', adef.get('rel', tr.rel)),
                          att_s=x.get('att', 0.0), offset_s=x.get('offset', 0.0),
                          detune_cents=x.get('detune', rng.normal(0, 2.0)), gain_db=x.get('gain', 0.0),
                          lp_hz=x.get('lp'), env=x.get('env'), tail_s=x.get('tail'), bend=x.get('bend'))
            if 'pan' in x:
                y = apply_pan(y, x['pan'])
            st = x['_start_n']
            if st < x['_floor_n']:
                y = _head_trim(y, x['_floor_n'] - st)
                st = x['_floor_n']
            add_at(buf, y, st)
    elif kind == 'sf2':
        _, path, bank, preset, drums = tr.src
        ped = [(s2n(t), on) for t, on in (tr.pedal or [])]
        cc = [(s2n(t), c, v) for t, c, v in (tr.cc or [])]
        main, floored = [], {}
        for n in notes:
            s = n.x['_start_n']
            e = max(s2n(n.start + n.dur), s + 64)
            ev = (s, e, int(round(n.pitch)), int(round(n.vel * 127)))
            if s < n.x['_floor_n']:
                floored.setdefault(n.x['_floor_n'], []).append(ev)
            else:
                main.append(ev)
        buf = sampler.render_sf2(path, bank, preset, main, n_buf, drums=drums, gain_db=tr.sf2_gain, pedal=ped,
                                 cc=cc)
        # notes whose latency lead-in would cross their floor: rendered on their own at the true time, the
        # part before the floor removed (1 ms fade-in) -> the onset stays on time, nothing pre-rolls
        for fl, evs in floored.items():
            pad = max(0, -min(e[0] for e in evs)) + 64
            a0 = max(0, min(e[0] for e in evs) - 64)
            b0 = min(n_buf, max(e[1] for e in evs) + s2n(10.0))
            sub = sampler.render_sf2(path, bank, preset, [(e[0] - a0 + pad, e[1] - a0 + pad, e[2], e[3]) for e in evs],
                                     b0 - a0 + pad, drums=drums, gain_db=tr.sf2_gain,
                                     pedal=[(t - a0 + pad, on) for t, on in ped if t >= a0],
                                     cc=[(t - a0 + pad, c, v) for t, c, v in cc if t >= a0])
            sub = sub[:, pad:]                       # now sub[:, i] is sample a0 + i
            cut = fl - a0
            if cut > 0:
                sub = _head_trim(sub, cut)
                add_at(buf, sub, fl)
            else:
                add_at(buf, sub, a0)
    elif kind == 'fn':
        fn = tr.src[1]
        for n in notes:
            rng = np.random.default_rng(n.x['_seed'])
            y = fn(n, rng)
            if y is None:
                continue
            y = to_stereo(y).astype(np.float32)
            k = min(144, y.shape[1])                     # 3 ms de-click at the tail
            y[:, -k:] *= np.linspace(1, 0, k, dtype=np.float32)[None]
            if 'pan' in n.x:
                y = apply_pan(y, n.x['pan'])
            st = n.x['_start_n']
            if st < n.x['_floor_n']:
                y = _head_trim(y, n.x['_floor_n'] - st)
                st = n.x['_floor_n']
            add_at(buf, y, st)
    else:
        raise ValueError(f'track {tr.name}: unknown source kind {kind!r}')
    if tr.post:
        buf = tr.post(buf)
    buf = _eq(buf, tr.eq)
    if tr.pan or tr.width != 1.0:
        buf = apply_pan(buf, tr.pan, tr.width)
    buf = buf * db(tr.gain_db)
    if tr.auto:
        buf = buf * _curve(tr.auto, n_buf, timemap)[None]
    return np.ascontiguousarray(buf, dtype=np.float32)


# ====================================================================== parallel jobs
# Fix 3 (2026-09-26): the forked renderer.
#
# The old pool was concurrent.futures.ProcessPoolExecutor(fork): every worker sends its whole track buffer
# (tens to hundreds of MB) back through ONE shared result pipe guarded by ONE shared semaphore.  On this
# machine's Python (3.12.3) that design can hang for ever, and a timeout cannot rescue it:
#   * a worker that dies (OOM killer, a crash in a C extension) while it is part-way through sending a result
#     leaves the shared write-semaphore held, so every other worker blocks on it (futex), and leaves the
#     parent's manager thread inside recv() of a message that will never finish (the other workers still hold
#     the pipe open, so no EOF comes).  The main thread waits on its futures (futex) for ever, and
#     shutdown(wait=True) at the end of the `with` block joins that manager thread, so even
#     as_completed(timeout=...) cannot get out.  Reproduced in isolation: 4 jobs, 3 workers, one worker
#     SIGKILLed mid-send -> the parent and the surviving worker sat in futex_do_wait until killed.
#   * forking while any other Python thread is alive (a caller's thread pool, a progress thread) copies that
#     thread's locks into the child in whatever state they were in.
# (MM-09 saw "the parent in futex wait, workers in pipe read" on a second render_score after build().)
#
# The pool below has no shared locks and no large pipe messages: each track is rendered in its OWN forked
# child, which writes its buffer to a private file in /dev/shm and exits; the parent only waits on the
# children's exit sentinels.  A child that crashes, or runs longer than OST_JOB_TIMEOUT seconds (default 900),
# gets its Python stack dumped to the log (faulthandler, SIGUSR1), is killed, and that one track is rendered
# again in the parent (serially, under a SIGALRM guard of twice the timeout: past that it raises TimeoutError).  If any other Python thread is alive, nothing is
# forked at all: the whole render runs serially.
_JOBS = {}
JOB_TIMEOUT_S = 900.0


def _job(name):
    tr, notes, n_buf, floor_s, timemap = _JOBS[name]
    t0 = time.time()
    return name, render_track(tr, notes, n_buf, floor_s, timemap), time.time() - t0


def job_timeout():
    env = os.environ.get('OST_JOB_TIMEOUT')
    return float(env) if env else JOB_TIMEOUT_S


def _xfer_dir():
    """Where children leave their buffers: /dev/shm (RAM, never the 98 %-full disk) when it has room."""
    import shutil
    import tempfile
    for d in ('/dev/shm', tempfile.gettempdir()):
        try:
            if os.path.isdir(d) and os.access(d, os.W_OK) and shutil.disk_usage(d).free > 2e9:
                return d
        except OSError:
            continue
    return tempfile.gettempdir()


def _child(name, path, stack_path):
    """Forked child: render one track, save it, exit.  SIGUSR1 dumps this child's stack (the timeout guard)."""
    import faulthandler
    import signal
    try:
        fh = open(stack_path, 'w')
        faulthandler.register(signal.SIGUSR1, file=fh, all_threads=True)
    except Exception:
        pass
    _, y, secs = _job(name)
    tmp = path + '.part.npy'
    np.save(tmp, y)
    os.replace(tmp, path)
    with open(path + '.secs', 'w') as fh2:
        fh2.write(repr(secs))


class _Alarm:
    """SIGALRM guard for a serial (in-parent) retry; a no-op off the main thread."""

    def __init__(self, secs):
        self.secs = secs
        self.on = False

    def __enter__(self):
        import signal
        import threading
        if self.secs and threading.current_thread() is threading.main_thread():
            def _raise(*_):
                raise TimeoutError(f'track render exceeded {self.secs:.0f} s (OST_JOB_TIMEOUT)')
            self.prev = signal.signal(signal.SIGALRM, _raise)
            signal.setitimer(signal.ITIMER_REAL, self.secs)
            self.on = True
        return self

    def __exit__(self, *a):
        if self.on:
            import signal
            signal.setitimer(signal.ITIMER_REAL, 0)
            signal.signal(signal.SIGALRM, self.prev)
        return False


def _serial(name, why=None, timeout=None):
    if why:
        print(f'  [render] {name}: {why}; rendering it again in the parent process', flush=True)
    with _Alarm(timeout):
        return _job(name)


def run_jobs(names, workers, timeout=None):
    """Render the tracks in _JOBS: yields (name, buffer, seconds) as each finishes.  Parallel = one forked
    child per track, at most `workers` at a time; see the note above for why."""
    import shutil
    import tempfile
    import threading
    from multiprocessing import connection
    timeout = job_timeout() if timeout is None else timeout
    if workers <= 1 or len(names) <= 1:
        for nm in names:
            yield _serial(nm)
        return
    others = [t.name for t in threading.enumerate() if t is not threading.current_thread()]
    if others:
        print(f'  [render] {len(others)} other Python thread(s) alive ({", ".join(others[:4])}): forking now could '
              f'copy a held lock into the workers, so this render runs serially', flush=True)
        for nm in names:
            yield _serial(nm)
        return
    ctx = get_context('fork')
    tmp = tempfile.mkdtemp(prefix=f'ost-render-{os.getpid()}-', dir=_xfer_dir())
    pending = list(enumerate(names))
    running = {}                                     # sentinel -> (process, name, start, path, stack path)
    try:
        while pending or running:
            while pending and len(running) < workers:
                i, nm = pending.pop(0)
                path = os.path.join(tmp, f'{i}.npy')
                sp = os.path.join(tmp, f'{i}.stack.txt')
                p = ctx.Process(target=_child, args=(nm, path, sp))   # not daemonic: a track may nest a render
                p.start()
                running[p.sentinel] = (p, nm, time.time(), path, sp)
            now = time.time()
            wait_s = max(0.05, min(5.0, min(t0 + timeout - now for _, _, t0, _, _ in running.values())))
            for s in connection.wait(list(running), timeout=wait_s):
                p, nm, t0, path, sp = running.pop(s)
                p.join()
                if p.exitcode == 0 and os.path.exists(path):
                    y = np.load(path)
                    try:
                        with open(path + '.secs') as fh:
                            secs = float(fh.read())
                    except Exception:
                        secs = time.time() - t0
                    for q in (path, path + '.secs', sp):
                        if os.path.exists(q):
                            os.remove(q)
                    yield nm, y, secs
                else:
                    yield _serial(nm, f'the worker exited with code {p.exitcode}', 2 * timeout)
            now = time.time()
            for s, (p, nm, t0, path, sp) in list(running.items()):
                if now - t0 > timeout:
                    import signal
                    try:
                        os.kill(p.pid, signal.SIGUSR1)               # faulthandler: where is it stuck?
                        time.sleep(0.5)
                        with open(sp) as fh:
                            st = fh.read().strip()
                    except Exception:
                        st = ''
                    p.kill()
                    p.join()
                    running.pop(s)
                    print(f'  [render] {nm}: no result after {timeout:.0f} s (OST_JOB_TIMEOUT); worker killed. '
                          f'Its stack:\n{st or "(none captured)"}', flush=True)
                    yield _serial(nm, 'timed out in a worker', 2 * timeout)
    finally:
        for p, *_ in running.values():
            p.kill()
            p.join()
        shutil.rmtree(tmp, ignore_errors=True)


def _prewarm(sc, by_track):
    """Build (and calibrate) every sample set in the parent, so forked workers never race on the cache."""
    for name, ns in by_track.items():
        tr = sc.tracks[name]
        if tr.src[0] in ('ss', 'art'):
            for s in {_set_for(tr, n) for n in ns}:
                library.get(s)
        elif tr.src[0] == 'sf2':
            sampler.get_synth(tr.src[1], tr.sf2_gain)


def default_workers():
    env = os.environ.get('OST_WORKERS')
    if env:
        return max(1, int(env))
    return max(1, min(6, (os.cpu_count() or 2) - 1))


def mute_gain(sc: Score, n: int, timemap=None):
    """The hard-stop envelope (1 = open, 0 = digital zero) for Score.mutes, or None."""
    if not sc.mutes:
        return None
    f = sc.mute_fade_ms / 1000.0
    pts = [(-1.0, 1.0)]
    for a, b in sorted(sc.mutes):
        pts += [(a, 1.0), (a + f, 0.0), (max(a + f, b - f), 0.0), (b, 1.0)]
    pts.append((1e6, 1.0))
    g = _curve(pts, n, timemap)
    g[g < 1e-6] = 0.0
    return g


def render_stems(sc: Score, notes, n_out: int, floor_s=None, timemap=None, workers=None, verbose=True,
                 apply_fade=True, balance_out=None):
    """Core: notes -> {family: [2, n_out]} with sends, stem posts, rides.
    balance_out: a dict to fill with the balance groups' mixes (arrange.balance_group; dry x the send power,
    for analysis.balance)."""
    by_track = {}
    for n in notes:
        if n.inst not in sc.tracks:
            raise KeyError(f'note for unknown track {n.inst!r} (add it to the palette / Score.tracks)')
        by_track.setdefault(n.inst, []).append(n)
    for name in by_track:
        st = sc.tracks[name].stem
        if st not in sc.stems:
            raise ValueError(f'track {name} routes to stem {st!r}, not in {sc.stems}')
    _prewarm(sc, by_track)
    n_buf = n_out + s2n(TAIL_PAD)
    stems = {s: np.zeros((2, n_buf), dtype=np.float32) for s in sc.stems}
    sends = {}
    workers = workers or default_workers()
    names = sorted(by_track, key=lambda k: -len(by_track[k]))

    def take(name, y, secs):
        tr = sc.tracks[name]
        if verbose:
            print(f'  track {name:14s} -> {tr.stem:8s} ({len(by_track[name]):4d} notes, {secs:5.1f} s)', flush=True)
        stems[tr.stem] += y
        if balance_out is not None:
            from .arrange import balance_group
            grp = balance_group(tr)
            wet = np.sqrt(1.0 + sum(10 ** (lvl / 10.0) for lvl in tr.sends.values())) * db(sc.stem_gain.get(tr.stem, 0.0))
            if grp not in balance_out:
                balance_out[grp] = np.zeros((2, n_out), dtype=np.float32)
            balance_out[grp] += y[:, :n_out] * wet
        for bus, lvl in tr.sends.items():
            key = (tr.stem, bus)
            if key not in sends:
                sends[key] = np.zeros_like(y)
            sends[key] += y * db(lvl)

    _JOBS.clear()
    for name in names:
        _JOBS[name] = (sc.tracks[name], by_track[name], n_buf, floor_s, timemap)
    jobs = run_jobs(names, min(workers, len(names)))
    try:
        for res in jobs:
            take(*res)
    finally:
        jobs.close()                       # a failure in take() still kills and reaps every child
        _JOBS.clear()
    # reverb returns (threads: the FFTs release the GIL)
    with ThreadPoolExecutor(max_workers=4) as ex:
        res = {k: ex.submit(convolve, x, k[1]) for k, x in sends.items()}
        for (stem, bus), f in res.items():
            stems[stem] += f.result()
    sends.clear()
    ctx = dict(sr=SR, grid=sc.grid, loop=timemap is not None, n=n_out)
    out = {}
    for s, x in stems.items():
        if s in sc.stem_post:
            x = _call_post(sc.stem_post[s], x, ctx)
        x = x * db(sc.stem_gain.get(s, 0.0))
        out[s] = np.ascontiguousarray(to_stereo(x)[:, :n_out], dtype=np.float32)
    for s, pts in (sc.stem_auto or {}).items():
        if s in out and pts:
            out[s] = out[s] * _curve([(t, db(d)) for t, d in pts], n_out, timemap)[None]
    if sc.macro:
        g = _curve([(t, db(d)) for t, d in sc.macro], n_out, timemap)
        for s in out:
            out[s] = out[s] * g[None]
    gm = mute_gain(sc, n_out, timemap)
    if gm is not None:
        for s in out:
            out[s] = out[s] * gm[None]
    if apply_fade and sc.end_fade:
        a, b = sc.end_fade
        g = env_curve([(0, 1.0), (a, 1.0), (b, 0.0), (b + 1e3, 0.0)], n_out) ** 2
        for s in out:
            out[s] = out[s] * g[None]
    if balance_out is not None:
        for k in balance_out:
            if sc.macro:
                balance_out[k] *= _curve([(t, db(d)) for t, d in sc.macro], n_out, timemap)[None]
            if gm is not None:
                balance_out[k] *= gm[None]
    return out


def render_score(sc: Score, notes=None, n_out=None, workers=None, verbose=True, balance_out=None):
    """The linear cue as written: {family: [2, n]} with n = end + tail_s (trim later)."""
    notes = sc.notes if notes is None else notes
    n_out = n_out or s2n(sc.end_s + sc.tail_s)
    floor_s = None
    if sc.loop:
        # notes written inside/after the loop never pre-roll across the start of their pass (the same rule
        # the loop file needs), so the loop file and every pass of the album render agree
        L0, L1 = sc.loop
        P = L1 - L0
        starts = [L0 + k * P for k in range(int(sc.meta.get('_passes', 1)))]

        def floor_s(n, L0=L0, starts=starts):
            nom = n.x.get('_nominal', n.start)
            if nom < L0 - 1e-6:
                return 0.0
            return max(s for s in starts if s <= nom + 1e-6)
    return render_stems(sc, notes, n_out, floor_s=floor_s, workers=workers, verbose=verbose, balance_out=balance_out)


def loop_notes(sc: Score):
    L0, L1 = sc.loop
    return [n for n in sc.notes if L0 - 1e-6 <= n.start < L1 - 1e-6]


def fold(x, L0n, P):
    """Circular fold of a render around the loop: y[i] = sum_k x[L0n + i + kP]."""
    y = np.zeros((x.shape[0], P), dtype=np.float64)
    k0 = -int(np.ceil(L0n / P))
    k1 = int(np.ceil((x.shape[1] - L0n) / P))
    for k in range(k0, k1 + 1):
        a = L0n + k * P
        s0, s1 = max(a, 0), min(a + P, x.shape[1])
        if s1 > s0:
            y[:, s0 - a:s1 - a] += x[:, s0:s1]
    return y.astype(np.float32)


def ringout(x, L1n, P):
    """What rings on after the last pass stops at the loop end: sum_m x[L1n + mP + i]."""
    T = x.shape[1] - L1n
    if T <= 0:
        return np.zeros((x.shape[0], 1), dtype=np.float32)
    y = np.zeros((x.shape[0], T), dtype=np.float64)
    m = 0
    while L1n + m * P < x.shape[1]:
        seg = x[:, L1n + m * P:]
        y[:, :seg.shape[1]] += seg
        m += 1
    return y.astype(np.float32)


def render_loop(sc: Score, workers=None, verbose=True, ring_s=None):
    """-> (loop stems {family: [2, P]}, ringout stems {family: [2, T]}, info)."""
    if not sc.loop:
        raise ValueError('Score.loop is not set')
    L0, L1 = sc.loop
    L0n, L1n = s2n(L0), s2n(L1)
    P = L1n - L0n
    ring_s = ring_s if ring_s is not None else max(sc.tail_s, 6.0)
    n_out = L1n + s2n(ring_s)
    Ps = P / SR

    def timemap(t, L0=L0, Ps=Ps):
        t = np.asarray(t, dtype=np.float64)
        return np.where(t >= L0, L0 + np.mod(t - L0, Ps), t)

    notes = loop_notes(sc)
    raw = render_stems(sc, notes, n_out, floor_s=(lambda n, L0=L0: L0), timemap=timemap, workers=workers,
                       verbose=verbose, apply_fade=False)
    loops = {s: fold(x, L0n, P) for s, x in raw.items()}
    rings = {s: ringout(x, L1n, P) for s, x in raw.items()}
    info = dict(start_s=L0, end_s=L1, samples=P, seconds=Ps, frames=P / (SR / 24.0),
                frame_aligned=(P % (SR // 24) == 0), notes=len(notes))
    return loops, rings, info


# ====================================================================== album versions
def expand_loops(sc: Score, n: int, vary: bool = True) -> Score:
    """A copy of the Score whose loop body plays n times (n >= 1); everything after the loop moves later.
    vary=True: every pass gets its own humanisation / round-robin draws (album versions);
    vary=False: passes repeat the first pass exactly (used to verify loop files)."""
    if not sc.loop or n <= 1:
        return sc
    L0, L1 = sc.loop
    P = (s2n(L1) - s2n(L0)) / SR          # sample-exact pass length (so every pass lands on the same samples)

    def shift(t):
        return t + (n - 1) * P if t >= L1 - 1e-9 else t

    notes = []
    for x in sc.notes:
        if L0 - 1e-6 <= x.start < L1 - 1e-6:
            for k in range(n):
                c = x.copy(start=x.start + k * P)
                if not vary:
                    c.x['_seedkey'] = x.x.get('_seedkey', x.start)
                notes.append(c)
        else:
            notes.append(x.copy(start=shift(x.start)))

    def pts(points):
        if not points:
            return points
        out = []
        for p in points:
            t = p[0]
            if L0 - 1e-9 <= t < L1 - 1e-9:
                out.extend((t + k * P,) + tuple(p[1:]) for k in range(n))
            else:
                out.append((shift(t),) + tuple(p[1:]))
        return sorted(out, key=lambda q: q[0])

    tracks = {k: replace(t, auto=pts(t.auto), pedal=pts(t.pedal), cc=pts(t.cc)) for k, t in sc.tracks.items()}
    return replace(sc, tracks=tracks, notes=notes, stem_auto={k: pts(v) for k, v in sc.stem_auto.items()},
                   meta={**sc.meta, '_passes': n},
                   macro=pts(sc.macro), loop=(L0, L1), length_s=shift(sc.end_s),
                   mutes=[m for a, b in sc.mutes for m in ([(a + k * P, b + k * P) for k in range(n)]
                                                            if L0 - 1e-9 <= a < L1 - 1e-9 else [(shift(a), shift(b))])],
                   end_fade=(shift(sc.end_fade[0]), shift(sc.end_fade[1])) if sc.end_fade else None,
                   markers=[(shift(t), lab) for t, lab in sc.markers],
                   sections=[(lab, a if a < L1 - 1e-9 else shift(a), b if b <= L0 + 1e-9 else b + (n - 1) * P)
                             for lab, a, b in sc.sections])
