"""The lead's ruling on the showrunner's note (2026-09-27): cut the cold open's 1993 (4.01, 4.02) and end the cold open on
the rewind: the counter slips past 2022, `rewinding… too far` lands, the frame smears and collapses into the intro's
first frame (its cyan cursor on black). Applied to the Kokoro and the EL cold-open timelines alike (3.02 is the same in
both). Idempotent: a timeline without 4.01 is left alone."""
import json, sys
NEW_DUR = 4.5
NOTE = {"date": "2026-09-27", "by": "v3-shots-coldopen-tag (the lead's ruling on the showrunner's note: \"i think the cold open to intro is not very good transition\")",
        "what": "cut 4.01 + 4.02 (the cold open's own 1993 dialog, 5.5 s); 3.02 3.0 -> 4.5 s: the counter slips on toward 1993, `rewinding… too far` lands at 3.0 s (glyph_blink), the frame smears (3.92 s) and collapses (4.17 s) into the intro's first frame, its cyan cursor on black; the intro's own 1993 pays off \"too far\"",
        "record": "show/episodes/ep01/production/full-v3/shots-coldopen.md §0"}
for p in sys.argv[1:]:
    d = json.load(open(p))
    ids = [b['id'] for b in d['beats']]
    if '4.01' not in ids:
        print(p, 'already cut'); continue
    old = sum(b['reelDur'] for b in d['beats'])
    d['beats'] = [b for b in d['beats'] if b['id'] not in ('4.01', '4.02')]
    b = next(x for x in d['beats'] if x['id'] == '3.02')
    b['frame'] = 'WIDE · the room scrubs back, too far: the collapse'
    b['caption'] = ('The room scrubs back: the ovation sits, the water climbs home, the hailstone flies back. The year catches on 2022 '
                    'for a second, then slips past, faster; the toast turns to "rewinding… too far" as the wheels spin on toward the '
                    'nineties. The frame smears and collapses into a cyan cursor on black: the intro\'s first frame.')
    b['onscreen'] = [
        {"text": "rewinding…", "at": 0.0, "until": 3.0},
        {"text": "2023", "at": 0.0, "until": 0.5},
        {"text": "2022", "at": 0.5, "until": 1.55},
        {"text": "2019", "at": 1.55, "until": 1.95},
        {"text": "2015", "at": 1.95, "until": 2.32},
        {"text": "2008", "at": 2.32, "until": 2.67},
        {"text": "2001", "at": 2.67, "until": 3.0},
        {"text": "rewinding… too far", "at": 3.0, "until": 4.17},
    ]
    b['reelDur'] = NEW_DUR
    b['fx'] = ['rewind', 'smear', 'collapse']
    b['cues'] = [
        b['cues'][0],
        "the counter aims at 2022 (Act One) and overshoots: \"too far\" lands here; the intro's own 1993 (five seconds on) shows where",
        "style: BASE, washed up its light ramps in held steps as it scrubs (not to paper: no 1993 frame here); the smear from 3.92 s, the collapse in three held steps from 4.17 s, onto the intro's cursor (native x 83-114, y 39-118) on black for the last 2 frames",
        "sound: the hall runs backward: a groan on the catch, then a lurch; the rewind whirr accelerates from the slip into the collapse and cuts with the picture; the intro's first beat takes over (no 1993 chip notes here now)",
    ]
    b['sounds'] = b.get('sounds', []) + [{"name": "glyph_blink", "at": 3.0, "gain": -26}]
    d['part'] = 'COLD OPEN · sc 1-3'
    d['dateSpan'] = 'Nov 16, 2023'
    new = sum(x['reelDur'] for x in d['beats'])
    d['runtimeMin'] = round(new / 60, 2)
    d['_source']['seconds'] = round(d['_source']['seconds'] - old + new, 3)
    if '_el_retimed' in d:
        d['_el_retimed']['seconds_el'] = d['_source']['seconds']
        d['_el_retimed']['seconds_kokoro'] = round(d['_el_retimed']['seconds_kokoro'] - 3.0 - 5.5 + NEW_DUR, 3)
    d['_v3_edits'] = d.get('_v3_edits', []) + [NOTE]
    json.dump(d, open(p, 'w'), ensure_ascii=False, indent=1)
    open(p, 'a').write('\n')
    print(p, f'{old:.3f} -> {new:.3f} s; seconds {d["_source"]["seconds"]}')
