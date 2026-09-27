"""Render (or dry-check) the S5-S8 cues of the Ep1 Act Four v5 score.

    cd audio/ost/tracks/e01-act4-v5
    ../../../.venv-theme/bin/python s5-s8_render.py --dry                 # build the scores, note-level QA only (light)
    OST_WORKERS=2 ../../../../ops/heavy.sh ../../../.venv-theme/bin/python s5-s8_render.py          # all three, stems
    OST_WORKERS=2 ../../../../ops/heavy.sh ../../../.venv-theme/bin/python s5-s8_render.py s6       # one of them

Renders go to render/ (the shared folder; every file here starts with the cue id, "s5-s8_...") with stems in
render/stems/.  Heavy work goes through ops/heavy.sh (the laptop rule, SHOWRUNNER-NOTES).  This driver never touches
ost-index.json.  After a render, run s5-s8_qa.py (the act-clock QA) and s5-s8_ducking.py (the ducking map).
"""
import json
import os
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import importlib.util as _ilu   # noqa: E402
_sp = _ilu.spec_from_file_location('s5_s8_common', os.path.join(HERE, 's5-s8_common.py'))
C = _ilu.module_from_spec(_sp)
sys.modules['s5_s8_common'] = C
_sp.loader.exec_module(C)
from engine.export import build as engine_build   # noqa: E402
from engine import analysis   # noqa: E402
from engine.motifs import knee_whole_count, find_motif   # noqa: E402

CUES = [('s5', 's5-s8_s5_two_am'), ('s6', 's5-s8_s6_avalanche'), ('s7s8', 's5-s8_s7s8_the_return')]
HELD = {'vc', 'vla', 'cb', 'pad', 'drone', 'felt', 'rhodes', 'glasspad', 'svln_nv', 'hn', 'bsn', 'tpt', 'tbn',
        'tsax', 'asax', 'bsax', 'vln1', 'vln2', 'ubass', 'cb_pizz', 'vc_lev', 'k808', 'bdrum_muted', 'timp', 'grand'}
MELODIC = {'lead', 'lead2', 'arp', 'xylo', 'celesta', 'beeper', 'tri', 'woodclick', 'glock', 'vibes', 'marimba'}


def load(mod_file):
    return C.load_local(mod_file)


def dry(sc, cue):
    notes = sc.notes
    wt = analysis.written_third(notes, sc.tracks)
    kc = analysis.knee_completion(notes)
    kw = knee_whole_count(notes)
    print(f'[{sc.name}] {len(notes)} notes; file {cue.f0}-{cue.f1} ({(cue.f1 - cue.f0) / 24:.2f} s); '
          f'end {sc.end_s:.2f} s; mutes {[(round(a, 3), round(b, 3)) for a, b in sc.mutes]}')
    print(f'   written third (rule 12): {wt["count"]} event(s) {wt.get("events", [])[:3]}; graze {len(wt.get("grazes", []))}')
    print(f'   knee completion (rule 4): {kc["count"]} {kc["hits"][:2]}; whole knee: {kw}')
    for mid in sc.meta.get('motif_ids', []):
        print(f'   motif {mid}: found {len(find_motif(notes, mid))}')
    # onsets under the record (real lines, quote lines): only held material may start inside them
    t0 = cue.t0
    bad = []
    for lid, L in C.LINES.items():
        if not L['record'] or not (cue.f0 / 24 <= L['on'] < cue.f1 / 24 + 1):
            continue
        for n in notes:
            ta = n.start + t0
            if L['on'] - 0.1 <= ta <= L['end'] and n.inst in MELODIC:
                bad.append((lid, n.inst, round(ta, 3)))
    print(f'   melodic onsets under record lines: {len(bad)} {bad[:6]}')
    return dict(written_third=wt['count'], knee_completion=kc['count'], knee_whole=kw, record_onsets=bad)


def main(argv):
    dry_only = '--dry' in argv
    names = [x for x in argv if not x.startswith('--')]
    todo = [(k, f) for k, f in CUES if not names or k in names]
    out = {}
    for k, f in todo:
        t = time.time()
        mod = load(f)
        sc = mod.build()
        out[k] = dry(sc, sc.cue)
        if dry_only:
            continue
        cue = engine_build(sc, os.path.join(HERE, 'render'), sc.meta['id'], stems=True, loop=False, previews=True,
                           workers=int(os.environ.get('OST_WORKERS', '2')))
        # the act-clock log the cue sheet reads (act seconds -> frames), beside the engine's cue sheet
        log = sorted(sc.cue.log)
        with open(os.path.join(HERE, 'render', f"{sc.meta['id']}.act-log.json"), 'w') as fh:
            json.dump(dict(id=sc.meta['id'], file_t0_act_frame=sc.cue.f0, file_end_act_frame=sc.cue.f1,
                           events=[dict(act_s=round(a, 4), act_frame=round(a * 24, 2), file_s=round(a - sc.cue.t0, 4),
                                        tc=C.tc(a), what=w) for a, w in log]), fh, indent=1)
        print(f'[{k}] rendered in {time.time() - t:.0f} s; warnings {len(cue["warnings"])}', flush=True)
    return out


if __name__ == '__main__':
    main(sys.argv[1:])
