# Ep1 · Act Four · Lip-sync v5 (INF-LIPSYNC5)

| | |
|---|---|
| **What this is** | The record of the **mouth wiring** for the Act Four v5 pixel preview: who shows a mouth in each framing, what each mouth draws and when, what was measured, what was looked at, and what is still open. |
| **Why** | The showrunner, 2026-09-26: "the script dialogue and pacing is looking much better. i'll let you use your judgement to now refine back to the full rendering preview of act4". v5's conversations play out on camera (101 takes, 836 words), so the mouths carry most of the "who is talking" read. On 2026-09-27 he also said: "try not to cook/freeze my laptop". Every render in this pass ran on one core at the lowest priority, and the long ones went through `ops/heavy.sh`. |
| **Who, when** | The `a4p5-lipsync` pass, 2026-09-27, about 01:55–02:35. Nothing was committed (the lead commits). |
| **Where** | The module: `studio/src/episodes/ep01/act4/animatic/lipsync5.ts` (new). The layouts in `animatic/shots5.ts` only pass its results on in their `mouth:` fields (edited: those fields, the adapter's track, and two `st` phrases that described a mouth). Two framing decisions changed in `animatic/tools/lock_v5.py`, which was then re-run. One opt-in drawing was added in `shared/pixel/cast/employee-stand.ts` (v5 only). The stills are in `out/ep01/act4/animatic/act4-v5-lipsync-stills.png`. |
| **Honesty** | I can't watch video or listen. The numbers below come from the tracks and from rendered pixels: the lock's own checks, a count of drawing holds from each mouth's pixels frame by frame, face-on versus face-off pixel differences, and a render of every act frame. How the mouths read comes from **stills I looked at**: 12 talking shots at 1× next to a 1:1 crop of the 1920×1080 frame, plus 6× film strips of 12 mouths over 12–24 frames. That is one reader's judgment. Nothing was seen in motion, and nothing was heard against the picture. |

---

## 0. The result

- **46 speaker-in-shot pairs show a mouth, in 35 shots:** 35 lip (busts, call tiles, mediums, reflections) and 11 room scale. That is up from 44, because of the two framing calls in §1. Every one of them draws a mouth that follows its take: the face-on/face-off pixel difference is above 0 for all 46 (§3).
- **No mouth drawing is held for a single frame** in any track, and the shortest hold anywhere is 2 frames. The lip tracks change a median of **5.0 times a second**.
- **Room-scale mouths now talk instead of hanging open.** The old rule held a room mouth open for as long as the viseme wasn't rest or M. That gave open holds of up to **69 frames (2.9 s)**, for example Terb reading in S7.07 and Neleh in S4.02 and the split. The new syllable flap caps open holds at **11 frames**, with a median of 5.5 changes a second across the 11 room pairs.
- **The picture leads the sound by 1 frame** (42 ms). This is the animation convention and within broadcast tolerance. It is one switch, `LIP5.lead`. Line timing, words and story marks don't move: only the mouth drawing is looked up a frame ahead.
- **The lock still passes all 17 checks.** Its output changed only in the two faces (diffed field by field). tsc is clean apart from the old `bake.ts` errors. The full act draws with no layout failures (§3), and v4's own `check` still passes (77 shots, 6036 frames).

---

## 1. Who shows a mouth (the framing decides)

The lock's `face` per shot decides (`lock_v5.py` PLAN): `'lip'` gets a drawn track, `'room'` gets open/rest at room scale, and none gets no mouth (backs, silhouettes, off-screen speakers, POV). The take's `lip_sync` flag in `lines-v5.json` is not used (art-needs-v5 §1.2).

**Two decisions changed in this pass** (both reversible: one token each in the PLAN, then re-run the lock):

| Shot | Who | Was | Now | Why |
|---|---|---|---|---|
| S7.07-cont | MADA | none ("carried by his spinner") | **lip** | His face is in the calm-off two-shot, three-quarter at medium scale, when he says "Good question." (the act's payoff line). His medium rig has the six mouths, and v4's calm-off lip-synced this line. With a still mouth, the line reads as nobody's, or as a voice-over. His spinner still turns. The earlier "not lip-synced" came from the take's flag, the thing §1.2 says not to use. |
| S3.06 | EMPLOYEE | none ("seen from the back of the crowd") | **room** | The v5 all-hands is drawn as the attendees' webcam tiles facing camera. Her tile has risen above its row, with an amber ring round it, and her face is visible while she asks "Is this a coup?…". She now gets a 2-px tile mouth (`employee-stand.ts` `mouth: 'open'`, opt-in; default = the tile as drawn). |

**The 46 pairs** (the full table is `lipPairs5(SHOTS)`; the measured numbers are in §3):

- **Call tiles on the board's laptop:** S3.00a (ALYI, NELEH), S3.04 (ALYI, NELEH, RIMA), S3.05 (ALYI, NELEH).
- **Busts and MCUs:** S3.04b, S4.07 (NELEH); S3.07 (ALYI); S4.11 (TTEMME); S4.13, S7.02b (TASYA); S5.05, S5.07b, S5.12, S7.08 (MAS); S5.09b, S8.07 (GERG); S6.04 (NELEH's tile, half frame).
- **Two-shots and mediums:** S4.06 (NELEH, ALYI's reflection); S4.10b (NELEH, TTEMME); S5.04, S5.11 (MAS); S7.01 (ALYI, MAS); S7.07-cont (MAS, MADA).
- **Reflections:** S4.04 and S4.09 (ALYI).
- **Gerg's tile on his monitor:** S5.09, S5.09-back, S5.06 (the letter's small tile).
- **Room scale:** S3.06 (EMPLOYEE), S4.02 (NELEH), S4.08 (NELEH, MARIO, ADELINA), S4.13c (TASYA), S7.02, S8.08 (MAS), S7.06, S7.07, S7.07-cont (TERB).

**No mouth, by framing:** 34 line rows. Most are OTSs and POVs over the speaker (S4.04, S4.09 Neleh; S5.06, S5.09 Mas), the blueprint (S1.03–S1.05: Neleh's figure points; Mada's spinner turns while he speaks, `talking5`), full-frame screens (S3.01, S3.03), inserts (S2.01, S8.05, S8.09), turned away (S8.07 Mas), and off picture (Rima in S3.04b, Tasya in S4.13d, S5.11 and S7.03, Terb in S7.07b, Gerg in S5.07b and S5.08, Ttemme in S7.13). Alyi's silent speaking in S1.07, on his side ("no words reach us"), is not a take: it stays a held drawing on 4s (`silentMouth5`).

---

## 2. What each mouth draws (`lipsync5.ts`)

The visemes are the takes' own: `lines-v5.json` mouth tracks, from each take's phoneme alignment. Lock v5 moves them onto the act clock from the line's first sound, and nothing is hand-keyed. On top of that there are three refinements, each a switch in `LIP5`:

1. **Lead** (`LIP5.lead = 1`): each drawing appears a frame before its sound, so the mouth reads as making the sound.
   - It is inside EBU R37's tolerance (sound up to 60 ms late).
   - The stick reel's speaking highlight also starts a frame early.
   - In reused v4 layouts (the R shots: S4.06, S5.05, S6.04, S7.02b, S7.08), v4's helper only finds a line from its first sound, so the lead starts from the second shape.
2. **Holds** (`LIP5.minHold = 2`): no drawing is held for a single frame.
   - A one-frame shape merges into its neighbour.
   - A one-frame M (lips pressed) keeps two frames, taken from the next shape.
   - The takes were already nearly on 2s: 2 one-frame runs inside lines in the whole act. It changes about 2% of frames, mostly a one-frame first shape.
3. **Room flap** (`roomTrack5`, `LIP5.room = {maxOpen: 8, gap: 2, minOpen: 3}`): a room figure has two mouths.
   - A and O are open. E is open when it lasts 3 frames or more (E also stands for most consonants). M and rest are shut.
   - An open run longer than 8 frames shuts for 2 frames at its first viseme change that leaves at least 3 frames open on either side. On a single long shape it splits mid-run.
   - Then no hold under 2 frames.
   - Mario has three mouths: `room3Mouth5` takes open or shut from the flap, and how wide from the viseme.

**What the layouts call** (all in `lipsync5.ts`):

| Function | Returns |
|---|---|
| `mouth5(sh, k, who)` | The viseme |
| `roomMouth5` | `'open'` / `'rest'` |
| `room3Mouth5` | 0 / 1 / 2 |
| `boardMouths5` | The three board tiles |
| `lipOn5` | Whether a faced line is being drawn; for figures whose idle mouth is a smile: Tasya, Adelina |
| `talking5` / `lineAt5` | Sounding now, no lead; for speaking rings, spinners, gaze and pose |
| `silentMouth5` | Alyi's silent mouth (S1.07) |
| `v4Track5(line)` | The track the `v4()` adapter hands a reused layout |
| `lipTrack5` / `roomTrack5` | The per-frame tracks, cached per line |
| `lipPairs5(SHOTS)` | The record in §3 |

---

## 3. Measured

**Tracks** (`lipPairs5` over lock v5): 46 pairs.

| | Lip (35) | Room (11) |
|---|---|---|
| Drawing changes a second, median | 5.0 | 5.5 |
| Shortest hold | 2 f | 2 f |
| Longest open hold | 17 f (Alyi's tile, S3.00a, a long vowel in the take) | 11 f (the old rule: 69 f) |

**Drawn pixels, every talking frame.** Every frame of each pair's lines, ±2 frames, was rendered, and the runs of identical pictures counted inside each line's window. Two measures:

- **The mouth's box** (harness `runs`): the pixels that differ between face on and face off, hashed per frame. Before and after were measured the same way, the before on a scratch copy of the pre-pass tree.
  - Before: 44 pairs, 32 one-frame holds among 924.
  - After: 46 pairs, 37 among 1169, because the flap makes more holds.
  - The room mouths' longest drawn hold fell from 47–51 frames to 9–13. S4.02 Neleh went from 47 to 12, S4.08 Neleh from 50 to 12, S7.07 Terb from 51 to 13, S7.02 Mas from 26 to 10, and S8.08 Mas from 23 to 9.
  - Room changes a second went from about 2 to 5–7.
  - A box also catches other animation: S5.06's letter scroll, S6.04's tile slide, S8.08's drift, Gerg's typing.
- **The mouth alone** (harness `diffruns`, after): each frame's hash is the face-on/face-off difference itself, positions and colours, so other animation cancels.
  - 1142 drawn holds, **14 of them one frame**. None of the 14 is a one-frame mouth drawing. Each sits a frame before something else moves the face or the tile:
    - S6.04: 5, v4's tile slides 1 px every 3 frames.
    - S8.08: 2, the room drift.
    - S4.13c: 2, Tasya's nod.
    - S3.04: 4, Rima's tile on her line starts; the mouth leads, and her tile's own animation or ring changes the next frame.
    - S4.08: 1, Adelina lifts the phone on her line's first frame.
  - The other 41 pairs have none.

**Every pair draws a mouth** (the lock pass's `mouths` check, re-run): **46 of 46**. That covers up to 10 non-rest frames per pair, rendered face on and face off. The differences run from 3–5 px (Mas at his desk in S8.08 and S7.02, Neleh and Adelina in the split) to 3199 px (Gerg's letter tile).

**The full act draws** (`test5 all`, every one of the 12443 frames through `drawShot5`, one core at nice 19 inside `ops/heavy.sh`): **0 failed layouts, 0 stick-fallback frames**, 128.6 s. The slowest frame was 163 ms.

**The lock:** 17 of 17 checks pass. The on-camera-mouth check reports "72 faced rows; without a track: []" (70 before). Its JSON and `data-v5.ts` differ from the previous run only in S3.06's EMPLOYEE `face` and S7.07-cont's MADA `face` / `lip`, plus the summary count (diffed field by field).

**v4:** `render4 check` gives 77 shots, 0 missing, 6036 frames. v4 imports none of the files this pass touched (`lipsync5`, `shots5`, `data-v5`, `employee-stand` are v5 only).

**tsc:** `npx tsc --noEmit` prints only the old `src/dev/realism/bake/bake.ts` errors.

---

## 4. Looked at (stills)

I looked at `out/ep01/act4/animatic/act4-v5-lipsync-stills.png`: 12 talking shots, each shown at 480×270 (1×) beside a 480×270 crop of its 1920×1080 frame (4× nearest, 1:1, round the mouth). The shots are S3.00a Alyi's tile, S3.04 Rima's tile, S4.10b Ttemme, S4.13 Tasya, S7.07-cont Mada, S4.08 Mario, S3.06 the employee, S8.08 Mas, S7.01 Mas, S5.09 Gerg, S4.04 Alyi's reflection and S5.06 Gerg's letter tile. I also looked at 6× film strips (scratch) of Mas S7.02, Adelina S4.08, Neleh S4.02, Terb S7.07, Mas S8.08, Tasya S4.13c, the employee S3.06, Mario S4.08, Mada S7.07-cont (24 f), and Ttemme and Neleh in S4.10b.

**What I saw (one reader):**

- **Clear at 1080p:** the busts, tiles and mediums: open mouths with teeth or a dark inside, rest closed. This covers Rima, Tasya, Mas, Mada, Gerg's tiles, Alyi's door tile and Mario.
- **Readable but small at 1×:** Ttemme's medium. The headset mic's pad sits at the corner of his mouth, and his A and E drawings both show teeth, so they read alike.
- **Faint by design:** Alyi's reflections (S4.04, S4.09). The mouth changes pixels, but the reflection is dim.
- **Room scale is 1–2 px:** Mas at his desk (S7.02 and S8.08: one dark pixel), Adelina (1 px), Neleh (2×2), and the employee (a 2-px line in her tile). Terb (8×2) and Mario (6×2) are the clearest. The flap now opens and shuts on the syllables, but whether 1 px reads as speech at 1× in motion needs a person.

---

## 5. Measured versus needs a person

| Measured | Needs a person |
|---|---|
| Every faced pair draws a mouth; every take's visemes are used, none hand-keyed; no one-frame holds in the tracks; room open holds ≤ 11 f | Whether lip-sync **reads in motion** at 1× and 1080p, above all the room-scale mouths |
| The lead is 1 frame, and the lines sit in the mix to 0.03 ms (timing-v5 §2) | Whether a 1-frame lead feels right against the sound; `LIP5.lead = 0` puts every mouth on its sound's own frame |
| Mada and the employee now show mouths | The showrunner's taste on both; each is one PLAN token to undo |

---

## 6. How to re-run

```sh
# the lock (seconds), after any change to a shot's face table in lock_v5.py PLAN
python3 studio/src/episodes/ep01/act4/animatic/tools/lock_v5.py
# the type check
cd studio && nice -n 15 npx tsc --noEmit -p tsconfig.json | grep -v src/dev/realism/bake/bake.ts
```

The harness is in `scratchpad/a4p5-lipsync/` (scratch; copy it to keep it):

- `lip5.ts`, bundled with `npx esbuild lip5.ts --bundle --platform=node --outfile=new.cjs`. Its modes:
  - `pairs`: each faced pair's mouth box
  - `runs [json]`: drawn holds in each mouth's box; about 1–2 min on one core
  - `diffruns shot:who…`: drawn holds of the face-on/face-off difference only
  - `strip <dir> <shot> <who> <k0> <n> [scale]`
  - `full <dir> <sheet.png> shot:k:who…`: 1× beside the 1080p crop
- `tracks5.ts`: the §3 track table.

Run the long modes through `ops/heavy.sh`, as `checks.sh` does.

**When the stick timeline or the takes change:** re-run the lock, and `lipsync5` follows (the tracks are computed from the lock's lines at draw time). A new on-camera speaker needs a `face` in the shot's PLAN entry, and its layout needs a `mouth:` field fed by `mouth5` / `roomMouth5`.

---

## 7. Open issues

1. **Room-scale mouths are 1–3 px.** Mas at his desk (S7.02, S8.08) and Adelina are a single pixel open. A bigger open drawing, two rows with a jaw drop, would be an opt-in in the room poses' own files: `cast/mas.ts` desk pose, `cast/adelina.ts`, `cast/neleh.ts` room pose. That is an art call, and those files are shared with v4, so it would need the same pinned-v4 comparison the art pass ran. Not done here.
2. **The lead in reused v4 layouts** can't start before a line's first sound (§2.1). The effect is one frame at each line start in 5 R shots.
3. **Mas's end desk is right of centre** in the bullpen (S7.02, S8.08), and the script says left. Staging, not mouths; carried from timing-v5 §8.
4. **The `lip_sync` flags in `lines-v5.json`** still disagree with the framing in places: true for Neleh in S3.03 and Mas in S5.06, S5.09 and S8.07, where the framing shows no mouth; false for Mada in S7.07-cont, where it does. Nothing reads them any more. A voice or casting pass may want them to match.
5. **Nothing seen in motion.** INF-RENDER5's cut is the first chance to watch the mouths against the mix.
