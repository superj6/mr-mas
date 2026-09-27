# Ep1 · Act Four v5 · sound effects (the SFX editor's pass, 2026-09-27)

Every sound effect and room bed for Act Four v5, spotted to the v5 timing lock, built from the SFX board, with no
TEMP-SYNTH stand-ins left. Nothing here was heard: every level and placement is measured or reasoned, and a
person must listen (see "What a human must check").

| | |
|---|---|
| **Cue sheet** | `show/episodes/ep01/production/act4/sfx-v5.json` (199 effects, 4 of them optional; 19 room beds), with a short summary in `sfx-v5.md` beside it |
| **Stems** | `out/ep01/act4/animatic/act4-sfx-v5.wav` (effects) and `act4-rooms-v5.wav` (beds): 48 kHz stereo 24-bit, 8:38.46, act frame 0 = sample 0, D6 already applied |
| **Measurements** | `out/ep01/act4/animatic/act4-sfx-v5.qa.json` (stems) and `audio/sfx/qa/act4v5_board_qa.json` + `spectro_act4v5_01..07.png` (the new board sounds) |
| **New board sounds** | `audio/sfx/scripts/sounds_4.py`: 133 entries (120 effects and 13 room-bed loops), rendered into `audio/sfx/wav/` and `mp3/` and registered in `audio/sfx/manifest.json` |
| **Timing source** | `show/episodes/ep01/production/act4/shots-locked-v5.json` (the pixel pass's lock of the approved stick timeline): every frame comes from its shot starts, story marks and word times |

## What is here

| File | What it does |
|---|---|
| `spot_v5.py` | The spotting. Reads the lock and the board's manifest, writes the cue sheet. Every frame is computed from a lock shot, mark or word, so a re-lock moves the effects with the picture. It moves the "between the lines" cues (the boardroom phones) off words, refuses any cue inside D6 or any bed crossing it, and flags every cue whose hit falls on a word. |
| `render_v5.py` | Renders the sheet to the two stems, applies D6, and measures: loudness per bus, the D6 window, holes in the room floor, each bed's level, and each cue's first 300 ms against the dialogue. |
| `qa_board.py` | Measures the new board sounds: loudness, held tones (a held A natural is flagged, OST rule 12), loop seams, and the spectrogram sheets. |

## How to re-run

```bash
cd /home/jgon/project/art/mrmas
# 1. (only if sounds_4.py changed) re-render just the new board sounds; --no-qa keeps the board's own spectro_01..06 sheets
cd audio/sfx/scripts && nice -n 15 ../../.venv/bin/python build.py --only <comma-separated ids or prefixes> --no-qa && cd -
nice -n 15 audio/.venv/bin/python audio/ep01/act4/sfx-v5/qa_board.py
# 2. the spotting (a second; re-run after any change to shots-locked-v5.json)
audio/.venv/bin/python audio/ep01/act4/sfx-v5/spot_v5.py
# 3. the stems and their measurements (measured: 25 s wall, 2.1 GB peak memory)
(ulimit -v 6000000; nice -n 19 ionice -c3 audio/.venv-mix/bin/python audio/ep01/act4/sfx-v5/render_v5.py)   # --with-optional adds the 4 optional cues
```

- It is light, so this pass ran it at the lowest priority with a 6 GB memory cap, not through `ops/heavy.sh`: both heavy slots were held by long Blender and Remotion jobs. On a busy machine, `ops/heavy.sh audio/.venv-mix/bin/python audio/ep01/act4/sfx-v5/render_v5.py` works too.
- The board build and `qa_board.py` are lighter still: seconds each, at nice 15.

- The board builds with `audio/.venv` (numpy, scipy, soundfile, pedalboard, tinysoundfont). `audio/.venv-sfx` holds only pip and cannot run it.
- `build.py --only` matches id **prefixes**. It re-renders just those entries and keeps every other manifest row as it was. Don't run it without `--no-qa` for a partial build: its QA step would overwrite the board's `qa/spectro_01..NN.png` with a sheet of only the new sounds.
- The one change to an existing file: `audio/sfx/scripts/build.py` line 22 now imports `sounds_4` too.

## How the sheet works (for the mixer)

- **`frame`** is the story frame (a hit's transient). **`place_frame`** is where the file's first sample goes (after `start_s`), which is `frame − hit_s × 24`, or `frame − dur` for an end-anchored cue.
- **`gain_db`** applies to the board master. Every master is normalised to −14 LUFS (short sounds by momentary max, true peak ≤ −1 dBTP). The takes sit at −16 LUFS (mono), laid at unity on both channels as `mix_v4.py` lays them. Loudness-normalise the mix after the sum.
- **Beds** are levelled to `target_dbfs_rms`, the bed alone per channel, before their ride and fades. Layers (the dark room's `room_drone` + `room_tone` + `server_hum`) are summed first.
- **`device`** marks the small-speaker chains: `laptop` (Neleh's laptop), `monitor` (Mas's monitor), `cctv` (the lobby camera on the wall screen). `render_v5.py FILTERS` holds simple band-passes; the mixer may use better ones.
- **D6** runs from act f 997 to 1086 (the Cancel click to the phone's buzz). Every bus is muted there, and only the click's own first 0.25 s survives. No bed crosses it, and there is no `glyph_dissolve` in it (OST-BIBLE §6.8 request 4).
- **`optional`** cues are spotted but off by default: the Rewind's reversed `tape_spinup` (the score's retrograde may own it) and the three palette steps on "below / above / around" (MM-11's chords mark them).
- **`on_words`** lists the words a cue's hit falls on. Most are scripted, such as the stamps on "votes" and "question", the '?' on "Step four?", the screws on four of his words, and the door on "desk". The rest are small and marked for the mixer's attention.

## Decisions a successor should know

- **The lock's marks win over the plan's prose.** The pixel preview animates on the lock's marks. For example, the three chair walk-offs sit on the mark `three` (the word "stepped"), not in "the 0.8 s after 'year'" as edit-plan-v5 puts them. If the picture moves, re-run `spot_v5.py`.
- **No freeze hit on MADA's label (S6.06).** The stick used `freeze_hit_F`, but script 4.1 made the label call UI "so nothing freezes and TERB's card keeps its distance". The board's chip click takes the flip, and the band's dead stop is the punctuation. The OST's request 2 ("MADA: F") is from the card era. The only freeze hit left is TERB's card (S7.06).
- **Silences by design:** THE QUIET VOTE's tile goes "without a sound", nothing sounds on the one blue heart (texture, never a cause), and no pops play on the silent posts over the violin (S7.01) or on Ttemme's post (S7.13). Tasya's key ring jangles only twice (his arrival and the sign), because his statement is a real line and plays dry.
- **Pitch hygiene** (OST rule 12, no A natural before Ep12):
  - The dial tone is the open fifth F4 + C5, not 350 + 440 Hz (an F-major third).
  - The speakerphone keys are Step Four's line, F4 Eb4 Db4 C4 (the OST's request 1).
  - Phone motors run on Db3, with their vibration sidebands on Ab2 and F3.
  - Thud and knock pitches are moved off A2/E3 onto Bb2, G2, F2, Db3 and F3.
  - The lobby's neon leaves out its 5th and 10th partials, and the truck fires on C1.
  - `qa_board.py` finds no held A natural in any new sound.
- **The Orb's chime** is a new `orb_chime_F`: one pure F5 strike, never a chord or a swell (OST §2.4). The stick used the post-notification ding, and v4 used the vault chime.
- **Gerg's keys** are a seamless typing loop through the monitor filter. They play in S5.09, S5.09-back (stopping 4 f after "case") and S5.11 (faint), with one key on S5.09b's cut. They are out under the letter (S5.06, S5.07b, S5.08), where the record plays dry.
- **The spray** in S7.07 is a 0.3 s burst, because the gap between Terb's sentences is 5 f.

## What a human must check (I can't listen)

1. The new board sounds, in `audio/sfx/mp3/` (reel order in `sfx-v5.md`). Do the procedural foley sounds read as what they are (phones on wood and glass, the folder, the door bang, the revolving door, the extinguisher)? Does the crowd walla sound like people, not noise?
2. The stems against the picture and the dialogue:
   - the phones between Neleh's lines (S4.02 to S4.06)
   - the split's two panes (S4.08)
   - Gerg's typing level through the monitor
   - the avalanche under the full band
   - the vault hum as the coda's pedal
3. The optional cues, both ways.
4. The composer: confirm that the key ring on S4.13e sits on the score's offbeat, and that the stick-era marks for the chair walk-offs still match the waltz's F F F.

## Open issues

- The pixel pass is still moving the lock (`shots-locked-v5.json` changed at 01:06 and again at 01:49 during this pass; the final sheet and stems are built from the 01:49 lock, sha1 `3873036ea98e`). The sheet records `lock_sha1`. Re-run `spot_v5.py` and `render_v5.py` after any re-lock.
- **The mix itself is not done here.** The duck, the thin, the music, the dialogue's device chains and the final loudness belong to the mix pass. These stems and the sheet are its inputs.
- J1 (`CANCELLED`) stays withdrawn. If it is ever cut both ways, its temp sound (`studio/src/dev/jumps/proto1/tools/sound.py`) must be re-spotted inside D6.
