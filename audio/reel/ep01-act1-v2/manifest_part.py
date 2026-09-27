#!/usr/bin/env python
"""Ep1 ACT ONE stick reel v2: its chapter entry and its bed for the episode manifest.

  python3 audio/reel/ep01-act1-v2/manifest_part.py              -> audio/reel/ep01-act1-v2/manifest-part.json
  python3 audio/reel/ep01-act1-v2/manifest_part.py --test M.json -> also a standalone manifest (Act One alone) for a
                                                                   test render with studio/src/reel/tools/episode.mjs

manifest-part.json is {"chapter": {...}, "bed": {...}}: paste the chapter into show/reel/ep01-full/ep01-full-v2.manifest.json
between the card and Act Two, and the bed into its "beds" list IN PLACE OF every other act1 bed.

Since the Act One fix pass (2026-09-27) Act One plays ONE bed: its temp sound stem, audio/reel/ep01-act1-v2/act1-bed.wav
(act1_bed.py: the room, the music and the SFX), played as is (lufs null, no loop); the mixer lays the takes over it
and ducks it. The eleven beds v2 used (room stand-ins, the MM-16 / MM-04 / MM-17 / MM-14 temp pads and the MM-08
underscore for LEVERAGE) now live inside the stem, where the script's sound turns can stop them (audit-v2 package F1).
Rebuild the stem after every build_timeline.py run.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
OUT = os.path.join(HERE, 'manifest-part.json')

chapter = {"id": "act1", "label": "ACT ONE", "sub": "research preview · sc 5-12 · fastrec takes + temp stem", "from": "ep01-act1-v2"}
bed = {"chapter": "act1", "beat": "5.01", "cue": "MM-16 / LEVERAGE / MM-04 / MM-17 / MM-14",
       "label": "Act One temp stem (room + temp pads + LEVERAGE loop + SFX)",
       "src": "audio/reel/ep01-act1-v2/act1-bed.wav", "lufs": None, "loop": "none", "in": 0, "xfade": 0.3}
# in the episode, the stem stops where Act Two starts (its MM-14 sting rings over the 1 s black; the tail is 0.05 s)
bed_ep = dict(bed, until={"chapter": "act2"})
json.dump({"_about": "Act One's chapter and bed for the Ep1 episode manifest (manifest_part.py). Replace every act1 bed "
                     "in the manifest with this one. The seam into Act Two is the assembler's: audit-v2 #21 asks for "
                     "\"xfade\": 0.05 on Act Two's 13.01 bed so MM-14 rings over the black instead of blurring into MM-19.",
           "chapter": chapter, "bed": bed_ep},
          open(OUT, 'w'), indent=1, ensure_ascii=False)
print('wrote', os.path.relpath(OUT, ROOT))

if '--test' in sys.argv:
    path = sys.argv[sys.argv.index('--test') + 1]
    man = {"kind": "episode-manifest", "key": "ep01-act1-v2-test", "episode": 1, "title": "ep1.0_research_preview.md",
           "variant": "Act One alone · stick reel v2 (act1 fix pass) test", "dateSpan": "Nov 2022 - Mar 2023", "runtimeMin": 6,
           "titleCard": 0, "actCards": "margin", "actCardSec": 4, "known": ["mas"],
           "chapters": [chapter], "beds": [bed],
           "mix": {"lufs": None, "floor": -50, "ceiling": -1, "duck": -10, "bedLufs": -26, "xfade": 2.0, "dialogueGain": -3}}
    json.dump(man, open(path, 'w'), indent=1, ensure_ascii=False)
    print('wrote', path)
