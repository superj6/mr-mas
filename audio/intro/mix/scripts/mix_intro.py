"""MR. MAS Ep1 intro: final re-recording mix, V1 (primary) + V2/V3/V4 alternates.

Signal flow (all buses 48 kHz, 30.000 s, dropped at f0):

  MUSIC  theme/stems/V<n>-*.wav (they sum to theme/theme-V<n>-*.wav to -119 dB; the SCRIPT 9.6 VO duck is
         BAKED into them, so the music is NOT ducked again here) -> per-stem gain rides (RIDES, below)
         -> trim to -15.5 LUFS-I (SCRIPT 9.6; the trim is measured on the unridden score, so the rides are
         real level changes, not re-normalised away) -> music-bus rides (BUS_RIDES)
  SFX    intro-sfx/intro-sfx_stem.wav + intro-blip_stem.wav at unity (the SFX build already carries
         its -4 dB bus trim for a -15.5 LUFS music bus). intro-sfx_extras.wav stays muted (script cuts).
  DX     intro-vox/intro-vox_vo.wav at VO_DB, balance-centred over the line
         + the chant (whisper + shout) : character voices with words -> dialogue stem
  PAD    intro-vox/stems/intro-vox_pad.wav (wordless "oo") -> music stem
  BOOKEND  from the bookend cut (intro-events.json) the title chord and the PAD play "inside his monitor":
         -4 dB, low-passed at 3.5 kHz, 30 % width. The room's sub drone and the fx stem stay full.
  -> sum -> master gain -> linked look-ahead true-peak limiter (ceiling -1.3 dBTP, margin for AAC)
  -> iterate the master gain until the mix reads -14.00 LUFS-I.

The chant and pad faders are placed per variation against that variation's own (unridden) music (the vox
department's targets, measured over the V1 bed): whisper 4 LU under the music over f285-299, shout 1.0
LU under the music over f300-316, pad 7 LU under the tutti over f632-686 (V4: 5.5 LU, the pad is its
only other colour). Moves are clamped to +-2 dB of the delivered stems.

Mix stems (V1) are post-master-gain AND post-limiter (the same linked gain curve
is applied to each), so music + sfx + dialogue sums to the mix to rounding.

2026-09-25 review pass (sound supervisor, editor): see RIDES / BUS_RIDES / VO_DB / BOOKEND for each change
and the review item it answers. `python mix_intro.py --dry V1` measures without writing.
"""
import json, os, sys, time
import numpy as np
from scipy.signal import butter, sosfilt
sys.path.insert(0, os.path.dirname(__file__))
from mixlib import *   # noqa

VARS = {'V1': 'chipchamber', 'V2': 'orchestralnoir', 'V3': 'pixelswing', 'V4': 'pianopixels'}
MUSIC_LUFS = -15.5
TARGET_LUFS = -14.0
CEILING_DBTP = -1.3
LOOK_MS, REL_MS = 2.0, 50.0
# shout: -2 LU (vox dept. -1): edit P1 #20, the ALYI hit + shout read louder than the f420 'biggest hit'
TARGETS = dict(whisper=-4.0, shout=-2.0, pad=-7.0)
PAD_V4 = -5.5
CLAMP = 2.0
STEM_VARS = ('V1',)                   # D/M/E stems are delivered for the primary mix

# ---- dialogue ---------------------------------------------------------------------------------------------------
# Sound review P1 #1 / edit P1 #20: the VO was the loudest thing in the programme but the title (-11.7 LUFS
# momentary, level with the f420 "biggest hit"). -4 dB keeps it 12+ LU over the ducked bed on every word.
VO_DB = -4.0
VO_CENTRE = (24, 91)                  # sound review P3 #13: it read 0.7 dB heavy on the right over the line

# ---- music: per-stem rides --------------------------------------------------------------------------------------
# (from_f, to_f, dB, ramp_in_frames, ramp_out_frames): full gain over [from, to], linear-in-dB ramps OUTSIDE
# that span (so a hit on `to`+ramp_out is untouched). Frames are intro frames (24 fps).
KLAXON = [(345, 359.5, -3.0, 1, 0.5)]                 # P1 #3: the strings counter-line over the vault klaxon
RIP_STR = [(412, 419.5, -3.0, 1, 0.5)]                # P1 #4: strings under the trumpet rip f414-419 ...
RIP_BRASS = [(413, 419.5, +6.0, 1, 0.5)]              # ... and the rip itself (brass accent #5), back to 0 at f420
# P2 #9, V2 roll call (stop-time, f480-539): the horn and trombone stabs carry their hall tail into the next
# stab (gaps 5-10 dB), which masked the next attack (stabs 2/4/8 read 48-88 ms late) and let stab 7 run into 8.
# So: the brass stem is gated -15 dB between stabs 1-7 (opens 0.25 frame before each stab), the chip (which plays
# the top line at pitch, sample-exact) is +4 dB on stabs 1-7 to carry the attacks, and stab 8's chip + timpani
# ring is choked -5 dB over its last 3.5 frames so the f540 downbeat is not out-weighed. Measured after:
# every stab speaks 0 to +21 ms after its cut (picture leads), gaps 10.5-23 dB, ring -14.9 vs downbeat -15.5 LUFS.
ROLL = [480 + 7.5 * i for i in range(8)]
V2_ROLL_GATE = [(ROLL[i] + 5.5, ROLL[i + 1] - 0.25, -15.0, 1, 0.25) for i in range(7)]
V2_ROLL_CHIP = [(479.5, 531.5, +4.0, 0.5, 0.5)]
V2_ROLL_CHOKE = [(536.0, 539.6, -5.0, 1.5, 0.4)]
RIDES = {
    # P1 #2: the Harmon trumpet (bar 10, the one horn melody) was 16-30 dB under at 500 Hz; the felt piano owns
    # that band in V1/V3, the strings in V2.
    'V1': dict(harmon=[(540, 600, +6.0, 2, 1)], piano=[(540, 599, -3.0, 1, 1)],
               strings=KLAXON + RIP_STR, brass=RIP_BRASS),
    # V2: the Harmon line runs on through bar 11 (it falls off by f629); the strings are thinned in bar 10 only,
    # so the bar-11 riser still builds. V2's accent #5 is a horns + low strings crescendo, left as written.
    'V2': dict(harmon=[(540, 629.5, +6.0, 2, 0.5)], strings=[(540, 599, -3.0, 1, 1)] + KLAXON,
               brass=V2_ROLL_GATE, chip=V2_ROLL_CHIP + V2_ROLL_CHOKE, perc=V2_ROLL_CHOKE),
    # V3: the trumpet plays beats 1-2 of bar 10 and the chip answers on 3-4 (the chip answer is left alone).
    'V3': dict(harmon=[(540, 569, +6.0, 2, 1)], piano=[(540, 569, -3.0, 1, 1)] + [(412, 419.5, -3.0, 1, 0.5)],
               brass=RIP_BRASS, chip=KLAXON),              # V3 has no strings: its chip lead sits on the klaxon
    'V4': dict(chip=KLAXON),                          # piano, chip and sub: no Harmon, no brass, no strings
}
# music-bus rides (every score stem; the pad is silent there)
BUS_RIDES = {
    # P2 #6: the D-flat hit alone reached -1.4 dBFS after master gain, so the shouted "A-!" on top drove the
    # limiter 2.7 dB (and "A" was the weakest letter of the chant). -2 dB over the hit with 2-frame ramps.
    'all': [(299.5, 304.5, -2.0, 2, 2)],
    # edit P1 #20: f420 is scripted as THE BIGGEST HIT, but measured under the ALYI hit. +2 dB on its body
    # (f421-432, after the transient: pushing the transient only fed the limiter).
    'hit420': [(421, 432, +2.0, 1, 4)],
}

# ---- bookend perspective (sound review P2 #7, option b) --------------------------------------------------------
# The f690 reveal had no sound (music moved 0.4 dB across the cut). The picture shows the title was on his
# monitor, so the title chord and PAD go "inside the monitor" on the cut; the room's sub drone stays full size.
# `db` is the NET loudness change over the cut's first beat (the low-pass and narrowing lose some on their own,
# and the gain is set to make the total -4 LU).
# It ends on the ding (f705, the title clears): the few title tails left return to full size under the ding, so the
# ding keeps its reviewed 11 LU over the bed (it would be 16 LU over a monitor-sized bed).
BOOKEND = dict(db=-4.0, lp_hz=3500.0, width=0.30, xfade_frames=1.0, keep=('sub', 'fx'), fallback_frame=690,
               fallback_end=705)
EVENTS = os.path.join(ROOT, 'out/season/intro/picture/intro-events.json')
THEME_DIR = os.environ.get('MIX_THEME_DIR', os.path.join(AUDIO, 'theme'))   # override only to audition a scratch render


def bookend_frame():
    """(first frame of the bookend, the ding frame, source) from the picture's events."""
    try:
        ev = json.load(open(EVENTS))['events']
        c = [e['f'] for e in ev if e.get('type') == 'cut' and e.get('moment') == 'mfinale' and e.get('f', 0) >= 680]
        d = [e['f'] for e in ev if e.get('type') == 'ding' and 'f' in e]
        if c:
            return min(c), (min(d) if d else BOOKEND['fallback_end']), 'intro-events.json'
    except (OSError, ValueError, KeyError):
        pass
    return BOOKEND['fallback_frame'], BOOKEND['fallback_end'], 'fallback'


def ride_curve(rides):
    """(1, N) linear gain from a list of (from_f, to_f, dB, ramp_in, ramp_out); overlapping rides add in dB."""
    g = np.zeros(N)
    for a, e, d, rin, rout in rides:
        A, E, Ai, Eo = f2n(a), f2n(e), f2n(a - rin), f2n(e + rout)
        g[A:E] += d
        if A > Ai:
            g[Ai:A] += np.linspace(0.0, d, A - Ai, endpoint=False)
        if Eo > E:
            g[E:Eo] += np.linspace(d, 0.0, Eo - E, endpoint=False)
    return db(g)[None, :]


def music_stems(v):
    d = os.path.join(THEME_DIR, 'stems')
    return {f[len(v) + 1:-4]: read(os.path.join(d, f)) for f in sorted(os.listdir(d))
            if f.startswith(v + '-') and f.endswith('.wav')}


def monitor(x):
    """The 'inside his monitor' colour: low-pass and narrow (level is set in bookend())."""
    sos = butter(2, BOOKEND['lp_hz'], 'lowpass', fs=SR, output='sos')
    y = sosfilt(sos, x, axis=-1)
    m, s = (y[0] + y[1]) / 2, (y[0] - y[1]) / 2 * BOOKEND['width']
    return np.stack([m + s, m - s])


def bookend(x, f0, f1):
    """Crossfade x -> monitor(x) over xfade_frames from frame f0, and back from f1 (equal-gain: the signals are
    coherent). The monitor gain makes the net change over f0..f0+15 exactly BOOKEND['db'] LU.
    Returns (y, applied gain dB)."""
    y = monitor(x)
    g = BOOKEND['db'] - (win_loud(y, f0, f0 + 15) - win_loud(x, f0, f0 + 15))
    w = np.zeros(N)
    xf = BOOKEND['xfade_frames']
    a, b, c, d = f2n(f0), f2n(f0 + xf), f2n(f1), f2n(f1 + xf)
    w[a:b] = np.linspace(0.0, 1.0, b - a, endpoint=False)
    w[b:c] = 1.0
    w[c:d] = np.linspace(1.0, 0.0, d - c, endpoint=False)
    return x * (1 - w) + y * db(g) * w, round(float(g), 2)


def bus_inputs():
    j = lambda *p: os.path.join(AUDIO, *p)
    return dict(
        sfx=read(j('intro/sfx/intro-sfx_stem.wav')),
        blip=read(j('intro/sfx/intro-blip_stem.wav')),
        vo=read(j('intro/vox/intro-vox_vo.wav')),
        whisper=read(j('intro/vox/stems/intro-vox_chant-whisper.wav')),
        shout=read(j('intro/vox/stems/intro-vox_chant-shout.wav')),
        pad=read(j('intro/vox/stems/intro-vox_pad.wav')),
    )


def place_vocals(music, b, v):
    """Per-variation fader for whisper / shout / pad, relative to this variation's trimmed music."""
    g = {}
    for k, (a, e) in dict(whisper=(285, 299), shout=(300, 316), pad=(632, 686)).items():
        tgt = TARGETS[k] if not (k == 'pad' and v == 'V4') else PAD_V4
        want = win_loud(music, a, e) + tgt
        d = want - win_loud(b[k], a, e)
        g[k] = float(np.clip(d, -CLAMP, CLAMP))
    return g


def vo_centre(vo):
    """Per-channel trim so L and R read the same K-weighted loudness over the line (+-half the difference)."""
    a, e = VO_CENTRE
    L, R = win_loud(vo[:1].repeat(2, 0), a, e), win_loud(vo[1:].repeat(2, 0), a, e)
    d = L - R
    return np.array([[db(-d / 2)], [db(d / 2)]]), round(float(d), 2)


def build(v, b):
    name = f'theme-{v}-{VARS[v]}'
    master_path = os.path.join(THEME_DIR, name + '.wav')
    music_raw = read(master_path)
    st = music_stems(v)
    resid = sample_peak_db(sum(st.values()) - music_raw)
    assert resid < -90, (v, 'stems do not sum to the master', resid)
    g_music = MUSIC_LUFS - lufs(music_raw)            # trim reference = the unridden score (as delivered)
    gv = place_vocals(music_raw * db(g_music), b, v)
    whisper, shout, pad = (b[k] * db(gv[k]) for k in ('whisper', 'shout', 'pad'))

    rides = RIDES.get(v, {})
    ridden = {k: x * (ride_curve(rides[k]) if k in rides else 1.0) * db(g_music) for k, x in st.items()}
    bus = ride_curve(BUS_RIDES['all'] + BUS_RIDES['hit420'])
    ridden = {k: x * bus for k, x in ridden.items()}
    bf, bend, bsrc = bookend_frame()
    keep = [k for k in ridden if k in BOOKEND['keep']]
    mon, mon_g = bookend(sum(x for k, x in ridden.items() if k not in keep) + pad, bf, bend)
    music = mon + sum(ridden[k] for k in keep)

    trim, vo_lr = vo_centre(b['vo'])
    vo = b['vo'] * trim * db(VO_DB)
    buses = dict(music=music,                          # MX: score (ridden) + wordless pad
                 sfx=b['sfx'] + b['blip'],              # FX: sfx-main + blip bus
                 dialogue=vo + whisper + shout)         # DX: VO + chant
    pre = sum(buses.values())

    G = TARGET_LUFS - lufs(pre)
    hist = []
    for it in range(6):
        y1 = pre * db(G)
        lim = limiter_gain(y1, CEILING_DBTP, look_ms=LOOK_MS, rel_ms=REL_MS)
        out = y1 * lim
        L = lufs(out)
        hist.append((round(G, 3), round(L, 3)))
        if abs(L - TARGET_LUFS) < 0.02:
            break
        G += TARGET_LUFS - L
    tp = true_peak_db(out)
    # belt and braces: if any inter-sample over survived, pull the ceiling and redo once
    c = CEILING_DBTP
    while tp > CEILING_DBTP + 0.05:
        c -= tp - CEILING_DBTP
        lim = limiter_gain(pre * db(G), c, look_ms=LOOK_MS, rel_ms=REL_MS)
        out = pre * db(G) * lim
        tp = true_peak_db(out)
    gain_curve = db(G) * lim
    stems = {k: x * gain_curve for k, x in buses.items()}
    sresid = sample_peak_db(sum(stems.values()) - out)
    gr = -todb(lim.min())
    grdb = -todb(lim[0])
    regions, i = [], 0
    hot = np.nonzero(grdb > 0.5)[0]
    while i < len(hot):                      # contiguous stretches of more than 0.5 dB gain reduction
        j = i
        while j + 1 < len(hot) and hot[j + 1] - hot[j] < SR // 100:
            j += 1
        regions.append(dict(frames=[round(hot[i] / SPF, 2), round(hot[j] / SPF, 2)],
                            max_gr_db=round(float(grdb[hot[i]:hot[j] + 1].max()), 2)))
        i = j + 1
    info = dict(variation=v, music_source=f'audio/theme/stems/{v}-*.wav ({len(st)} stems; sum vs master '
                                          f'{resid:.1f} dBFS)', music_stems=sorted(st),
                music_trim_db=round(g_music, 2), vocal_faders_db={k: round(x, 2) for k, x in gv.items()},
                vo_db=VO_DB, vo_centre_lr_diff_lu=vo_lr,
                stem_rides=rides, bus_rides=BUS_RIDES, bookend=dict(BOOKEND, frame=bf, end_frame=bend, frame_source=bsrc, monitor_gain_db=mon_g),
                master_gain_db=round(G, 2), limiter_ceiling_dbtp=round(c, 2),
                limiter_max_gr_db=round(float(gr), 2), limiter_max_gr_frame=round(float(np.argmax(grdb) / SPF), 2),
                limiter_gr_over_0p5db_ms=round(float((grdb > 0.5).sum() / SR * 1000), 1),
                limiter_regions_over_0p5db=regions,
                iterations=hist, stems_sum_residual_dbfs=round(sresid, 1))
    info['checks'] = checks(out, stems, {k: x * gain_curve for k, x in ridden.items()}, v, bf, bend)
    return out, stems, info, gain_curve


def checks(out, stems, mst, v, bf, bend):
    """The review's measurements, re-taken on this mix (LUFS / LU)."""
    fr_, mom = loud_curve(out, 0.4, 0.25)
    mmax = lambda a, e: round(float(mom[(fr_ >= a) & (fr_ <= e)].max()), 1)
    M, S, D = stems['music'], stems['sfx'], stems['dialogue']
    wl = lambda x, a, e: win_loud(x, a, e)
    c = dict(momentary_max=dict(vo_line=mmax(24, 92), drop_f120=mmax(118, 140), gerg_f240=mmax(238, 250),
                                alyi_f300=mmax(298, 312), mario_f360=mmax(358, 370), nole_f420=mmax(418, 432),
                                title_f630=mmax(628, 645)),
             vo_over_music_lu=round(wl(D, 24, 91.1) - wl(M, 24, 91.1), 1),
             shout_A_vs_music_lu=round(wl(D, 300, 303.7) - wl(M, 300, 303.7), 1),
             klaxon_sfx_vs_music_lu=round(wl(S, 345, 360) - wl(M, 345, 360), 1),
             mario_blips_vs_music_lu=round(wl(S, 366, 381) - wl(M, 366, 381), 1),
             nole_blips_vs_music_lu=round(wl(S, 426, 434) - wl(M, 426, 434), 1),
             gerg_blips_vs_music_lu=round(wl(S, 246, 255) - wl(M, 246, 255), 1),
             bookend_music_lufs=dict(before=round(wl(M, bf - 8, bf), 1), after=round(wl(M, bf, bf + 8), 1)),
             ding_over_music_lu=round(wl(S, bend, bend + 7) - wl(M, bend, bend + 7), 1))
    rest = lambda k: sum(x for j, x in mst.items() if j != k)
    if 'harmon' in mst and wl(mst['harmon'], 540, 565) > -70:
        c['harmon_vs_rest_of_score_lu'] = {f'f{a}-{e}': round(wl(mst['harmon'], a, e) - wl(rest('harmon'), a, e), 1)
                                           for a, e in ((540, 565), (570, 585), (585, 600), (600, 630))
                                           if wl(mst['harmon'], a, e) > -60}
    if 'brass' in mst:
        c['rip_brass_vs_rest_lu'] = round(wl(mst['brass'], 414, 420) - wl(rest('brass'), 414, 420), 1)
        c['rip_brass_vs_sfx_lu'] = round(wl(mst['brass'], 414, 420) - wl(S, 414, 420), 1)
    return c


def main(vs, dry=False):
    b = bus_inputs()
    log = {}
    for v in vs:
        t0 = time.time()
        out, stems, info, gcurve = build(v, b)
        info['seconds'] = round(time.time() - t0, 1)
        log[v] = info
        print(json.dumps({k: info[k] for k in ('variation', 'master_gain_db', 'limiter_max_gr_db',
                                               'limiter_max_gr_frame', 'limiter_gr_over_0p5db_ms', 'checks')}))
        if dry:
            continue
        base = os.path.join(OUT_DIR, f'intro-ep1-mix-{v}-{VARS[v]}')
        write(base + '.wav', out)
        if v in STEM_VARS:
            for k, x in stems.items():
                write(os.path.join(OUT_DIR, 'stems', v, f'intro-ep1-{v}-stem-{k}.wav'), x)
    if dry:
        return
    p = os.path.join(OUT_DIR, 'qa', 'mix_build.json')
    old = json.load(open(p)) if os.path.exists(p) else {}
    old.update(log)
    json.dump(old, open(p, 'w'), indent=1)


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    main(args or list(VARS), dry='--dry' in sys.argv)
