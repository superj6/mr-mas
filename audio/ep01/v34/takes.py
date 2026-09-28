#!/usr/bin/env python3
"""Ep1 v3.4 takes (script draft 8.3, the planner voice): the eight new Mas V.O. lines, and the lines files.

  python3 audio/ep01/v34/takes.py plan                       -> audio/ep01/v34/<seg>/lines-in.json (fastrec input)
  bash    ops/heavy.sh bash audio/ep01/v34/record.sh         -> fastrec into audio/ep01/v34/<seg>/ (--workers 2)
  python3 audio/ep01/v34/takes.py assemble                   -> audio/ep01/v34/<seg>/lines-v34.json

The lines come from the v3.4 spec (show/episodes/ep01/production/full-v3/beat-plan-v34/_spec_v34.py, NEW_VO), so the
text can't drift from the plans. Every one is Mas's inner voice in the episode's existing Kokoro voice: speaker
mas-manalt, kind vo, on_camera vo (fastrec's vo-close chain on am_michael · a-michael-close), speed 0.87, the same
settings as the v3.1 V.O. takes. Never a clone of anyone. No spoken line changes in v3.4; the one restored V.O.
(v3-vo-10) keeps its v3 take.
"""
import json
import os
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../..'))
HERE = os.path.join(ROOT, 'audio/ep01/v34')
sys.path.insert(0, os.path.join(ROOT, 'show/episodes/ep01/production/full-v3/beat-plan-v34'))
from _spec_v34 import NEW_VO  # noqa: E402

SPEED = 0.87
SPEED_OVERRIDE = {'v34-vo-05': 0.85}  # the first read ran 4.96 syll/s against the 3.4-4.0 guide


def plan():
    per = {}
    for vid, (seg, bid, text, say, delivery, kind) in NEW_VO.items():
        per.setdefault(seg, []).append({
            'id': vid, 'scene': bid.split('.')[0].replace('v32-', '').replace('v31-', '').lstrip('S') or bid,
            'speaker': 'MAS MANALT', 'speaker_slug': 'mas-manalt', 'text': text, 'spoken_as': say, 'delivery': delivery,
            'tag': f'[INVENTED · VO · v3.4 planner voice · {kind}]', 'mode': 'on-mic', 'on_camera': 'vo', 'kind': 'vo',
            'side': 'none', 'shot': bid, 'status': 'fast', 'speed': SPEED_OVERRIDE.get(vid, SPEED)})
    for seg, rs in per.items():
        os.makedirs(os.path.join(HERE, seg), exist_ok=True)
        json.dump(rs, open(os.path.join(HERE, seg, 'lines-in.json'), 'w'), indent=1, ensure_ascii=False)
        print(f'audio/ep01/v34/{seg}/lines-in.json: {len(rs)} to read ({", ".join(r["id"] for r in rs)})')


def assemble():
    per = {}
    for vid, (seg, *_rest) in NEW_VO.items():
        per.setdefault(seg, []).append(vid)
    for seg, ids in per.items():
        d = os.path.join(HERE, seg)
        rec = {r['id']: r for r in json.load(open(os.path.join(d, 'lines.json')))} if os.path.exists(os.path.join(d, 'lines.json')) else {}
        out = [rec[i] for i in ids if i in rec]
        for i in ids:
            if i not in rec:
                print(f'  ! {seg}: {i} has no take')
        json.dump(out, open(os.path.join(d, 'lines-v34.json'), 'w'), indent=1, ensure_ascii=False)
        print(f'audio/ep01/v34/{seg}/lines-v34.json: {len(out)} takes')


if __name__ == '__main__':
    {'plan': plan, 'assemble': assemble}[sys.argv[1] if len(sys.argv) > 1 else 'plan']()
