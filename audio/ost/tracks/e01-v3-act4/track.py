#!/usr/bin/env python3
"""E01 v3 · ACT FOUR "the Blip, told twice" · six cues laid on the segment's own clock (0 = its first frame)

Brief (v3-score-b, 2026-09-27; v3-plan §6; script draft 6 sc 24-31): suspense where it's earned (Vegas, noon), felt
(the night), dry procedural comedy (the board's side, a lighter PROCEDURE), warm and loyal (2 AM with Gerg), the one
full band (the avalanche), a triumph one size too big (Monday and the return), settling into the vault's F hum and
handing off to the tag.  Act Four v5's score (tracks/e01-act4-v5/, read-only) and the v3 sample's cues (audio/reel/
ep01-v3-sample/music/, read-only) are the material, copied here and re-spotted to the v3 lock.

  v3.1 (the final lock, show/reel/ep01-v31/; script draft 7): his side opens on the shock and THE PLAN moves to the
  board's side.  Seven cues:
  cue (module)            segment s (kokoro)   what
  S1  cue_noon.py         0 -> 25.90           the suite's ordinary life (a sul-tasto pedal, his felt Water Line bar
                                               with the nudge on his glass), LEVERAGE low from the JOIN click, thinned
                                               to its pedal under Alyi's sentence, back up for the bright Remove dialog
                                               (Step Four on the pointer), DEAD STOP on the Remove click (D6)
      -                   25.90 -> 37.21       no score: D6 to the buzz, then "super." in the suite's air
  S2  cue_night.py        37.21 -> 46.42       the felt's open fifth on the carve, the nudge before "i don't keep
                                               score.", the pedal under the Orb's count, the settle, THE REWIND
  PLAN cue_plan.py        46.42 -> 75.08       Neleh's desk at 11:52: her clockwork on her card, the Blueprint pad
                                               under her pointer, the waltz's walk-offs, the labels, the zeros, the
                                               path, the stuck loop and the tape-stop into the 11:59 tick
  S3-4 cue_board.py       75.08 -> ~266        PROCEDURE, lighter (the first round's), from the 11:59 tick through the
                                               Sunday reversal to "Step four, Mada?" and the held C into the dark room
  S5  cue_two_am.py       263.54 -> 362.67     2 AM (the first round's): the Water Line warm, the count, the Build with
                                               Gerg (it stops dead on his look), the letter, Tasya's floor, the open 6/9
  S6  cue_avalanche.py    362.67 -> 376.84     SET-PIECE SWING, the one full band, its peak about 2 dB down, DEAD STOP
                                               on Mada's label
  S7-8 cue_return.py      378.79 -> 517.75     the violin, the floor, Tuesday's invite (one felt F4 on his Accept),
                                               LEVERAGE (the pin's click keeps its beat) to a dead stop on "of what?",
                                               the stamp's pedal, the hourglass: THE TURN on the chat's "we're so
                                               back", the shatter's held beat, the Build compiling into the sign's
                                               VICTORY LAP, the flat line and the bonk, "okay." onto the vault's F

TIMING IS PARAMETRIC: every sync point is read from the timeline (beat starts, line spans, words, sounds, texts).
    --variant kokoro   show/reel/ep01-v31/ep01-v31-act4.json        -> render/music.wav, cues.json      (default)
    --variant el       show/reel/ep01-v31-el/ep01-v31-el-act4.json  -> render/music-el.wav, cues-el.json
    (MRMAS_V3_LOCK=v3 points at the first v3 lock, show/reel/ep01-v3/; this v3.1 score needs v3.1's beats)
    --timeline PATH    any timeline with the same ids              -> render/music-custom.wav
The act ends on the vault's pedal; its natural release (the ~4 s past the act's last frame) is written beside the
stem as render/music[-el]-ringout.wav, for the mix to lay at the tag's first frame if the tag's own cue doesn't carry it.

Run (from the repo root; the render is a heavy job, about 6 minutes):
    OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act4/track.py --render
    ... --render noon board        only those cues (noon night board two_am avalanche return), then assemble
    audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act4/track.py --dry          # build + note QA (light)
    audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act4/track.py --assemble     # re-lay + measure (light)
Nothing here has been listened to.
"""
from __future__ import annotations

import argparse
import importlib
import json
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import v3clock   # noqa: E402
import v3lay     # noqa: E402
import a4common  # noqa: E402

SEG = 'act4'
REPO = v3clock.REPO
ORDER = ['noon', 'night', 'plan', 'board', 'two_am', 'avalanche', 'return']
MODULES = {k: f'cue_{k}' for k in ORDER}


def builders():
    return {k: importlib.import_module(MODULES[k]).build for k in ORDER}


def paths(variant):
    tag = '' if variant == 'kokoro' else f'-{variant}'
    rd = os.path.join(HERE, 'render')
    return dict(work=os.path.join(rd, '_work', variant), wav=os.path.join(rd, f'music{tag}.wav'),
                ring=os.path.join(rd, f'music{tag}-ringout.wav'), cues=os.path.join(HERE, f'cues{tag}.json'))


def dry(c):
    from engine import analysis as an
    out = {}
    for k, fn in builders().items():
        sc, T0, window, extra = fn()
        wt = an.written_third(sc.notes, sc.tracks)
        kc = an.knee_completion(sc.notes)
        first = min(n.start for n in sc.notes) + T0
        last = max(n.start + n.dur for n in sc.notes) + T0
        out[k] = dict(id=sc.name, notes=len(sc.notes), T0=round(T0, 3), window=[round(w, 3) for w in window[:2]],
                      first_note=round(first, 3), last_note_end=round(last, 3), written_third_ok=wt['ok'],
                      written_third=wt['count'], knee_completion=kc['count'],
                      **{kk: v for kk, v in extra.items() if kk in ('dropped_under_words', 'label_on_swing')})
        print(k, json.dumps(out[k]), flush=True)
    print(json.dumps(c.describe()))
    return out


def assemble(c, variant):
    import soundfile as sf
    P = paths(variant)
    names, lays = [], {}
    for k in ORDER:
        mod = importlib.import_module(MODULES[k])
        lj = json.load(open(os.path.join(P['work'], f'{mod.ID}.lay.json')))
        names.append(mod.ID)
        lays[k] = lj
    # the ring into the tag: the return cue's underscore past the act's last frame
    ret = lays['return']
    x, sr = sf.read(os.path.join(P['work'], f'{ret["name"]}-underscore.wav'), always_2d=True, dtype='float64')
    i_end = c.N - int(round(ret['T0'] * sr))
    ring = x[i_end:]
    if len(ring):
        k = min(len(ring), int(0.05 * sr))
        ring[-k:] *= np.linspace(1.0, 0.0, k)[:, None] ** 2
        sf.write(P['ring'], ring.astype(np.float32), sr, subtype='PCM_24')
    # the marked silences (digital zero in the stem) and the designed rests (room tone, a release tail)
    E_noon, E_ret = lays['noon'], lays['return']
    sil = []
    for k in ORDER:
        for s0, s1, what in lays[k].get('silences', []):
            sil.append((s0, s1, what))
    # the avalanche's stop runs to the violin's first note (the return cue's first sound)
    av = [s_ for s_ in sil if 'MADA' in s_[2]]
    if av:
        first_ret = min(m[0] for m in E_ret['marks'])
        sil = [s_ for s_ in sil if s_ is not av[0]] + [(av[0][0], first_ret, av[0][2])]
    mix, info = v3lay.lay(names, P['work'], c.N, P['wav'], zero=sil)
    rests = [(0.0, 0.6, "the act's first frames: the suite's pedal bows in from nothing (the SFX pre-lap carries)"),
             (c.B('v31-S3.00p') - 0.1, c.B('v31-S3.00p') + 0.6,
              "Neleh's desk at 11:52: her office clock first (SFX), then her clockwork"),
             (c.snd('S4.07', 'DTMF', 0) - 0.3, c.snd('S4.08', 'RING', 0) + 0.2,
              "the board's designed rest for the four dial tones (the sincere beat's release)"),
             (c.snd('S8.03', 'alert_bonk'), c.Lend('a5-30-19') + 0.1,
              'the lobby: the CU "silent like the first" and "okay." on the neon\'s F')]
    secs = []
    for k in ORDER:
        for lab, a0, a1 in lays[k]['sections']:
            secs.append((lab, a0, a1, lays[k]['name']))
    windows = {lays[k]['name']: tuple(lays[k]['window'][:2]) for k in ORDER}
    res = v3lay.measure(P['wav'], sil, secs, windows, P['work'], names, rests=rests)
    doc = dict(
        schema='mrmas-segment-music/1', segment=SEG, id=f'e01-v3-act4{"" if variant == "kokoro" else "-" + variant}',
        file=os.path.relpath(P['wav'], REPO), ringout=os.path.relpath(P['ring'], REPO) if len(ring) else None,
        clock=c.describe(), sample_rate=48000, channels=2, bit_depth=24,
        level='each cue at its own underscore target (featured: the avalanche), dry of dialogue; the mixer ducks it',
        cues=[dict(key=k, id=lays[k]['name'], laid=info[lays[k]['name']], marks=lays[k]['marks'],
                   sections=lays[k]['sections'], **{kk: v for kk, v in lays[k].items()
                                                     if kk in ('dropped_under_words', 'label_on_swing')})
              for k in ORDER],
        silences=[dict(t0=round(a, 3), t1=round(b, 3), what=w) for a, b, w in sil],
        rests=[dict(t0=round(a, 3), t1=round(b, 3), what=w) for a, b, w in rests],
        measured=res, source=os.path.relpath(os.path.join(HERE, 'track.py'), REPO),
        heard='nothing here has been listened to; every number is measured')
    json.dump(doc, open(P['cues'], 'w'), indent=1, ensure_ascii=False, default=float)
    print(json.dumps(dict(whole=res['whole'], cues=res['cues'], unmarked_digital_silence=res['unmarked_digital_silence'],
                          holes=res['holes'], fragments=res['fragments_under_2s'],
                          marked=res['marked_silences'],
                          engine_qa={k: {kk: v[kk] for kk in ('f_major_written_ok', 'f_major_spectral_ok',
                                                              'knee_completion', 'st_p95')}
                                     for k, v in res['engine_qa'].items()}), indent=1, default=float))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--variant', default=os.environ.get('MRMAS_V3_VARIANT', 'kokoro'), choices=['kokoro', 'el'])
    ap.add_argument('--timeline', default=None)
    ap.add_argument('--dry', action='store_true')
    ap.add_argument('--render', nargs='*')
    ap.add_argument('--assemble', action='store_true')
    args = ap.parse_args()
    variant = 'custom' if args.timeline else args.variant
    c = v3clock.Clock(SEG, variant=args.variant, path=args.timeline)
    a4common.bind(c)
    if args.dry:
        dry(c)
        return
    P = paths(variant)
    if args.render is not None:
        which = args.render or ORDER
        B = builders()
        v3lay.render([(k, B[k]) for k in which], P['work'])
        args.assemble = True
    if args.assemble:
        assemble(c, variant)


if __name__ == '__main__':
    main()
