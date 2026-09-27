#!/usr/bin/env python
"""Ep1 ACT ONE stick reel v2: its chapter entry and temp beds for the episode manifest.

  python3 audio/reel/ep01-act1-v2/manifest_part.py              -> audio/reel/ep01-act1-v2/manifest-part.json
  python3 audio/reel/ep01-act1-v2/manifest_part.py --test M.json -> also a standalone manifest (Act One alone) for a
                                                                   test render with studio/src/reel/tools/episode.mjs

manifest-part.json is {"chapter": {...}, "beds": [...]}: paste the chapter into show/reel/ep01-full/ep01-full-v2.manifest.json
between the card and Act Two, and the beds into its "beds" list. Bed anchors are beat ids of show/reel/ep01-full/
ep01-act1-v2.json; "at" values are read from the built timeline, so run build_timeline.py first.

Music follows the script's MUSIC:/SOUND: calls. No Act One cue except LEVERAGE (MM-08's stems) has a render yet, so
MM-16, MM-04, MM-17 and MM-14 are labelled temp pads, and the room beds are room-tone stand-ins. SFX (the click,
the ratchet, the pop, the THUD, Sydney's tick) are margin notes only: the episode mixer doesn't lay them.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
TL = os.path.join(ROOT, 'show/reel/ep01-full/ep01-act1-v2.json')
OUT = os.path.join(HERE, 'manifest-part.json')
MM08 = 'audio/ost/tracks/mm08-the-falling-tile/render/mm08-the-falling-tile-underscore.wav'

d = json.load(open(TL))
B = {b['id']: b for b in d['beats']}


def before_end(bid, back):
    """seconds into beat bid, `back` s before its end"""
    return round(B[bid]['reelDur'] - back, 3)


def after_line(bid, line_id, off):
    """seconds into beat bid, `off` s after that line's last word"""
    ln = next(x for x in B[bid]['lines'] if x['id'] == line_id)
    return round(ln['t'] + ln['dur'] + off, 3)


chapter = {"id": "act1", "label": "ACT ONE", "sub": "research preview · sc 5-12 · fastrec takes", "from": "ep01-act1-v2"}
beds = [
    {"chapter": "act1", "beat": "5.01", "pad": {"type": "room"}, "lufs": -42, "xfade": 0.3,
     "label": "room-tone stand-in (the bullpen bed; no music under the talk)"},
    {"chapter": "act1", "beat": "5.12", "at": 0.5, "cue": "MM-16", "pad": {"chords": ["Fm11", "Bbm9"], "bpm": 96, "barsPerChord": 2},
     "xfade": 0.3, "label": "temp pad (MM-16 Odometer not rendered): in on the first tick; the drill, the bill, the phone"},
    {"chapter": "act1", "beat": "9.01", "pad": {"type": "room"}, "lufs": -42, "xfade": 1.5,
     "label": "room-tone stand-in (the lobby bed; MM-16 rang out on the lock)"},
    {"chapter": "act1", "beat": "9.02", "at": 0.3, "cue": "MM-08", "src": MM08, "in": 0, "loop": [0, 17.5], "xfade": 0.3,
     "label": "LEVERAGE (temp: the MM-08 underscore), in with the check"},
    {"chapter": "act1", "beat": "9.08", "at": 0.35, "pad": {"type": "room"}, "lufs": -42, "xfade": 0.05,
     "label": "room tone only: LEVERAGE stops on the pop; the lobby bed holds under the terms"},
    {"chapter": "act1", "beat": "9.09", "at": after_line('9.09', 'e1-a1-9-08', 0.15), "cue": "MM-08", "src": MM08, "in": 0,
     "loop": [0, 17.5], "xfade": 0.3, "label": "LEVERAGE (temp: MM-08 underscore) back on the key ring's jangle, through sc 10"},
    {"chapter": "act1", "beat": "11.01", "pad": {"type": "room"}, "lufs": -42, "xfade": 0.8,
     "label": "room-tone stand-in (the pre-beat: Sydney's tick over the bullpen bed; the tick itself is not laid)"},
    {"chapter": "act1", "beat": "11.03", "cue": "MM-04", "pad": {"chords": ["Fm11", "Eb9sus4"], "bpm": 88, "barsPerChord": 2},
     "xfade": 0.2, "label": "temp pad (MM-04 Lighthouse not rendered): the duel, 16 bars"},
    {"chapter": "act1", "beat": "12.01", "cue": "MM-17", "pad": {"chords": ["Bbm9", "C7#9b13"], "bpm": 72, "barsPerChord": 2},
     "xfade": 0.8, "stop": "hard", "label": "temp pad (MM-17 not rendered): from the push; the THUD cuts it dead"},
    {"chapter": "act1", "beat": "12.03", "at": 0.0, "pad": {"type": "room"}, "lufs": -42, "xfade": 0.05,
     "label": "room tone only (the bullpen bed and the pen's scratch; no score on the reflection)"},
    {"chapter": "act1", "beat": "12.06", "at": before_end('12.06', 0.9), "cue": "MM-14", "pad": {"chords": ["Fm9"], "bpm": 60, "barsPerChord": 4},
     "lufs": -30, "xfade": 0.05, "stop": "fade", "label": "temp pad (MM-14 THREAT not rendered): once, on the pen's lift"},
]
# in the episode, the MM-14 sting stops where Act Two starts (Act Two's own first bed may not sit on its first beat)
beds_ep = [dict(b, until={"chapter": "act2"}) if b.get('cue') == 'MM-14' else b for b in beds]
json.dump({"_about": "Act One's chapter and beds for the Ep1 episode manifest (manifest_part.py)", "chapter": chapter, "beds": beds_ep},
          open(OUT, 'w'), indent=1, ensure_ascii=False)
print('wrote', os.path.relpath(OUT, ROOT))

if '--test' in sys.argv:
    path = sys.argv[sys.argv.index('--test') + 1]
    man = {"kind": "episode-manifest", "key": "ep01-act1-v2-test", "episode": 1, "title": "ep1.0_research_preview.md",
           "variant": "Act One alone · stick reel v2 test", "dateSpan": "Nov 2022 - Mar 2023", "runtimeMin": 22,
           "titleCard": 0, "actCards": "margin", "actCardSec": 4, "known": ["mas"],
           "chapters": [chapter], "beds": beds,
           "mix": {"lufs": None, "floor": -50, "ceiling": -1, "duck": -10, "bedLufs": -26, "xfade": 2.0, "dialogueGain": -3}}
    json.dump(man, open(path, 'w'), indent=1, ensure_ascii=False)
    print('wrote', path)
