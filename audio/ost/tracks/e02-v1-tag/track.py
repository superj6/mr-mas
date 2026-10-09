#!/usr/bin/env python3
"""E02 v1 · TAG (sc 23) · the segment's score, laid on the segment's own clock (0 = its first frame).

A STUB written by the Ep2 pipeline pass: the score pass fills CUES (manifest.md §6: E02-13 AUGUST). Until then --dry prints
the lock's music runs (each beat's `music (v1): E02-NN ...` cue, with its times), so a composer sees where every cue
lives on this lock, and --render says there is nothing to render.

The engine is Ep1's, copied for Ep2 into ../e02-v1-common/ (v3lib: the clock, thinning under talk, render, lay-in and
measurement; v3clock / v3music / v3lay / cueapi: the other house style; check.py: the per-segment checks). Every sync
point comes from the timeline, so the score re-renders to a re-timed lock with one command. Rules (manifest.md §6,
LEARNINGS S1-S3, S9): the 96 BPM grid; the knee's cells; chip in every cue; no third; one continuous performance per
sequence, ducking and thinning under real lines, stopping only at designed stops (mark them: silences_designed); no
music fragment under 2 s; designed hits marked (designed_hit) so the mix keeps their attack.

Run (from the repo root; a render is heavy, OST_WORKERS=2 through ops/heavy.sh):
    audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-tag/track.py --dry [--el]          # the runs; build + note QA
    OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-tag/track.py --render --el
    audio/.venv-theme/bin/python audio/ost/tracks/e02-v1-tag/track.py --assemble --el       # re-lay render/_work, measure
Out: render/music[-el].wav (the segment's exact length) and cues[-el].json, which names the timeline it was laid to
(audio/reel/ep02-v1/stems.py and mix_episode.py use a score only on its own lock); "claims_sfx": ["<beat>:<sound>"] in
it tells the stems to leave a timeline sound to the score. The check: audio/ost/tracks/e02-v1-common/check.py.
Nothing here has been listened to.
"""
from __future__ import annotations

import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'e02-v1-common'))
import v3lib as V   # noqa: E402
from v3lib import palette   # noqa: E402,F401  (for the cues: T = palette())

SEG = 'tag'


def music_runs(tl):
    """the lock's music runs: [(cue text, first beat, t0, t1)] (consecutive beats with one `music (v1): ...` string)"""
    runs = []
    for b in tl.beats:
        m = next((c.split(': ', 1)[1] for c in b['b'].get('cues', []) if c.startswith('music (v')), '')
        if runs and runs[-1][0] == m:
            runs[-1][3] = b['t1']
        else:
            runs.append([m, b['id'], b['t0'], b['t1']])
    return runs


# ---------------------------------------------------------------- the cues: key -> fn(tl) -> (V.Cue, Score)
# e.g.  def cue_mammoth(tl):
#           c = V.Cue('e02-01-the-mammoth', tl, anchor=tl.B('1.01'), swing=1.0)
#           T = palette(); ...  c.n('lead', 'F5', t, d, v) ...  c.section('in', t0, t1); c.mark(t, 'DESIGNED HIT ...')
#           return c, c.finish(T, dict(id='e02-01-the-mammoth', title='The Mammoth', ...), length_end=tl.E('1.09'))
CUES: dict = {}


def lay(tl, built, work):
    """the default lay-in: each cue's underscore master at its T0, gated to its sections' span, 50 ms in, 250 ms out
    (write your own when a cue hands over to the next mid-phrase)"""
    out = []
    for k, (c, sc) in built.items():
        a0 = min((a for _, a, _ in c.sections), default=max(0.0, c.T0))
        a1 = max((b for _, _, b in c.sections), default=tl.length)
        out.append(dict(name=sc.name, wav=os.path.join(work, f'{sc.name}-underscore.wav'), T0=c.T0, a0=max(0.0, a0),
                        a1=min(tl.length, a1), fin=0.05, fout=0.25))
    return out


def main():
    args, path, tag = V.cli(SEG)
    tl = V.TL(path)
    if not CUES:
        print(f'{SEG}: no cues yet (the score pass writes CUES). The lock {os.path.relpath(path, V.REPO)}: {tl.frames} f, '
              f'{tl.length:.2f} s, {len(tl.beats)} beats, {len(tl.lines)} lines. Its music runs:')
        for m, b0, t0, t1 in music_runs(tl):
            print(f'  {t0:8.2f} - {t1:8.2f} s  from {b0:10s} {m or "(no music string)"}')
        return
    work = os.path.join(HERE, 'render', '_work', 'el' if tag == '-el' else 'kokoro')
    built = {k: fn(tl) for k, fn in CUES.items()}
    if args.dry:
        for k, (c, sc) in built.items():
            print(k, V.note_qa(sc), f'file T0 {c.T0:.3f}')
        return
    if args.render is not None:
        for k in (args.render or list(built)):
            print(f'[{k}] rendered in {V.render_cue(built[k][1], work):.0f} s', flush=True)
    out = os.path.join(HERE, 'render', f'music{tag}.wav')
    layers = lay(tl, built, work)
    mix, laid = V.assemble(tl, layers, out)
    windows = {L['name']: (L['a0'], L['a1']) for L in layers}
    rows = [(f'{sc.name}: {lab}', a0, a1) for k, (c, sc) in built.items() for lab, a0, a1 in c.sections]
    res = V.measure(tl, mix, windows, rows, [])
    doc = dict(schema='mrmas-reel-music/1', id=f'e02-v1-{SEG}{tag}', segment=SEG, file=os.path.relpath(out, V.REPO),
               timeline=os.path.relpath(path, V.REPO), length_s=tl.length, frames=tl.frames, samples=tl.samples,
               sample_rate=V.SR, channels=2, clock="the segment's own clock: 0 = its first frame",
               cues=[dict(cue=L['name'], start=round(L['a0'], 3), end=round(L['a1'], 3), laid_at_s=round(L['T0'], 4))
                     for L in layers],
               silences_designed=[], designed_hit=[dict(t=round(t, 3), cue=sc.name, what=lab) for k, (c, sc) in built.items()
                                                   for t, lab, h in c.marks if lab.startswith('DESIGNED HIT')],
               claims_sfx=[], measured=res, laid=laid, source=os.path.relpath(__file__, V.REPO),
               heard='nothing here has been listened to; every number is measured')
    V.write_json(os.path.join(HERE, f'cues{tag}.json'), doc)
    print(f'wrote {os.path.relpath(out, V.REPO)}: {res["length_s"]} s exact={res["exact"]}')


if __name__ == '__main__':
    main()
