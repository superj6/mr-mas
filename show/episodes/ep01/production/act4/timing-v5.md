# Ep1 · Act Four · Timing v5 (the lock and the shot registry)

| | |
|---|---|
| **What this is** | The record of **timing lock v5** (INF-LOCK5) and the **v5 shot registry** (INF-SHOTS5) for the Act Four pixel preview: how the lock is built from the approved stick timeline, what was checked and measured, how every one of the 83 shots gets its picture, what the next passes (INF-FRAME5, INF-LIPSYNC5, INF-RENDER5) take from it, and what is still open. |
| **Why** | The showrunner, 2026-09-26: "the script dialogue and pacing is looking much better. i'll let you use your judgement to now refine back to the full rendering preview of act4". The approved pacing is the stick reel's, so the pixel v5 is cut to it **shot for shot and line for line** and plays on the stick mix without a re-mix. Standing: a fully programmatic first pass; conversations play out; coverage that holds; files organized; a handoff a successor can pick up. |
| **Who, when** | The `a4p5-lock` pass, 2026-09-27, about 00:00–02:30, in two sittings (the first session died; this one re-ran and finished its work). Nothing was committed (the lead commits). |
| **Where** | Lock tool `studio/src/episodes/ep01/act4/animatic/tools/lock_v5.py` → [shots-locked-v5.json](shots-locked-v5.json) + `studio/src/episodes/ep01/act4/animatic/data-v5.ts` (both generated; never hand-edit). The mix check `tools/lock_v5_mixcheck.py`. The registry `studio/src/episodes/ep01/act4/animatic/shots5.ts`. |
| **Honesty** | I can't watch video or listen. Every number here is **measured from the files** (the lock's own checks, a cross-correlation of the takes against the mix, a render of every act frame's picture in Node). How the picture reads comes from **stills I looked at** (every shot's middle frame at 1×, about a third of the 434 sampled frames on half-size sheets, a dozen frames at 2×): one reader's judgment, nothing seen in motion. |

**Clock.** Act frame 0 = episode 12:31:00, 24 fps. The stick reel and its mix carry a 3 s title card first: **`mix.wav` frame 72 = act frame 0** (`MIX.offsetFrames` in data-v5.ts).

---

## 0. The result

| | v4 lock (4.2) | **v5 lock** |
|---|---|---|
| Source | its own board (edit-plan-v4) | **the approved stick timeline** `show/reel/ep01-act4-v5.json` (84 beats), nothing re-timed |
| Runtime | 6036 f, 4:11.50 | **12443 f, 8:38.46** (12:31:00 → 21:09:11) = the stick's `act_seconds` 518.458 |
| Shots | 77 | **83** (84 beats; S7.06-cont merges into S7.06; S7.07-cont and S5.09-back stay their own shots because a cutaway sits between) |
| Mean / median shot | 3.27 / 2.83 s | **6.25 / 4.00 s**; 0 under 1 s, 2 under 1.5 s, 12 under 2 s, 16 over 10 s, 2 over 20 s (S4.08 the split, 28.0 s; S5.06 the letter, 22.8 s) |
| Dialogue | 45 lines, 176 words | **101 takes, 836 words** (median 5 a line) + 7 silent posts; 90 takes carry a mouth track |
| Lines across a cut | — | 4, carried into the next shot with negative frames: a5-27-06 (S3.02→S3.03), a5-27-45 (S4.13→S4.13c→S4.13d, the statement over three shots), a5-30-10 (S7.07→S7.07b), a5-31-04 (S8.08→S8.09, the memo) |
| D6 (the Cancel click's digital silence) | 735 → 824, 3.71 s | **997 → 1086, 3.708 s** (click → the phone's buzz) |
| Verdicts (art-needs-v5 §3) | — | R 38 (118.2 s) · C 35 (314.3 s) · N 10 (85.9 s) |

---

## 1. How the lock is built (`tools/lock_v5.py`)

The lock re-times **nothing**. It reads the stick timeline's frames, lines and in-world text as they are, adds what the pixel layouts need on the same clock, checks it, and writes it out. Inputs are read-only: the stick timeline, `audio/ep01/act4/dialogue/lines-v5.json` (the takes: mouth tracks on the file's clock, lengths, modes), `shots-locked-v4.json` (v4's marks for the reused layouts) and `mix.wav` (a length check).

1. **Beats → frames.** A beat starts where bed.py and the reel put it: the running sum of `reelDur`, rounded to frames (every `reelDur × 24` is a whole number to 0.02 f). The shots tile the act with no gap.
2. **Beats → shots.** A shot is a beat. A continuation beat that follows its own shot directly merges into it (S7.06-cont into S7.06); one that returns after a cutaway is its own shot on the same setup (S7.07-cont after S7.07b, S5.09-back after S5.06–S5.08). Kept shots keep their v4 ids.
3. **Lines.** A line starts on **the frame in which its first sound falls** (floor of beat start + `t`) and ends after the frame of its last sound (onset + `dur`). Its take file's first and last frames are kept too (`fs`/`fe`), as are its words (on the same rule) and its **mouth track**: the take's visemes moved from the file's clock to frames from the line's first sound, nothing after its last. A line that runs into later shots appears in each with negative frames (`carry: true`), so a layout can keep a mouth moving across a cut.
4. **Who shows a mouth: `face`.** The framing decides, not the take's `lip_sync` flag (art-needs-v5 §1.2). Per shot, a speaker is `'lip'` (a drawn mouth track: busts, tiles, mediums, reflections), `'room'` (room scale, open / rest) or none. 44 speaker-in-shot pairs have a face (70 line rows). This pass set NELEH to `'lip'` in S3.00a and S3.04: her own tile is on the call on her laptop, and she speaks on the call. *(Update, a4p5-lipsync: MADA `'lip'` in S7.07-cont and the EMPLOYEE `'room'` in S3.06, so 46 pairs, 72 faced rows; see [lipsync-v5.md](lipsync-v5.md) §1.)*
5. **In-world text** (`texts`): every stick `onscreen` item with its frames and a kind the layouts look up (`plate`, `toast`, `card`, `stamp`, `sign`, `clock`, `ui`, `label`). Rails go to `RAILS` (time and place only); the seven silent posts become post rows (`a5-27-P1` … `a5-30-P3`) in the lock's words. Items up for less than their read floor (0.25 s + 0.05 s a character) are **logged and kept** (§5): the timing is the approved stick's.
6. **Story marks** (the click, the stamp, the key turn, the glance…): anchored on the stick's own **sound spots** (so the picture lands on the sound in the mix), its text times, the takes' **words** (`'w'`/`'we'`: a word's first/last frame), or fixed frames. A reused v4 layout also gets v4's own marks scaled onto the v5 length where no anchor replaces them (logged: 11; the only one a layout still reads is S2.02's `mark1`, whose length barely changed).
7. **Sequences, D6, sound marks, subtitles.** Sequences carry v4's chapter titles and the stick's cues; D6 and the three dead stops plus Gerg's ring-out are in `SOUND_MARKS`; `SUBS` is the review transcript, named as the stick names people (a role until they are named on screen).

Outputs: [shots-locked-v5.json](shots-locked-v5.json) (the full record: shots with lines, texts, marks and where each mark came from, checks, decisions) and `data-v5.ts` (the same for the layouts and the host: `SHOTS`, `SEQS`, `RAILS`, `SUBS`, `D6`, `SOUND_MARKS`, `MIX`, `V4_IDS`, `ACT_FRAMES`, `EP_IN_FRAMES`).

---

## 2. What was checked, and measured

**The lock's own checks** (`lock_v5.py` prints them; it exits 1 if one fails). All 17 pass:

| Check | Result |
|---|---|
| Beat starts agree with the stick's `realStart` | largest difference 0.008 f (`realStart` carries 3 decimals) |
| Beat lengths are whole frames | every `reelDur × 24` is an integer to 0.02 f |
| Act length = the stick's `act_seconds` | 12443 f = 518.458 s |
| Every shot has a plan entry, and no extra | 83 / 83 |
| Every silent post found | 7 |
| D6 about 3.7 s | 997 → 1086 = 3.71 s |
| Shot frames = their beats' frames; shots tile the act | 83 shots from 84 beats; 0 → 12443 with no gap |
| **Every line starts on the stick's frame** | **101 of 101**, re-derived independently from `realStart` + `t` (two lines, a5-27-18 and a5-27-46, would move by 0.008 f across a frame line if the 3-decimal `realStart` were used unrounded; the lock uses the frame-exact beat start, as bed.py does) |
| The lock against the stick reel's own drawing of a line | same frame 6, one frame earlier 95, other 0. The reel's word strip shows a word on the first frame **at or after** its onset (`Reel.tsx`: `f >= start`); the lock's start is the frame the sound **falls in**, the same frame or one earlier when the onset is mid-frame. (The reel's speaking highlight starts at `start − 1`, which is the lock's frame for a mid-frame onset.) |
| All 101 takes placed; every line's speech inside its take file | 101; 0 outside |
| Mouth tracks carried over; every on-camera mouth has a track | 90 lines with a track, 0 lost; 70 faced rows, 0 without a track (the 11 takes with no track are all off camera: V.O., O.S., the speaker) |
| `mix.wav` = the title card + the act | 12515.00 f = 72 + 12443 |
| The mix's source timeline has the approved timing | the stick JSON `mix.wav` was built from (15:00, `audio/reel/ep01-act4-v5/history/v5a-1508/`) has the same beat lengths and the same line `t`, `dur`, `in` in every beat. Sound spots were **added** since in six beats (below) |

**Measured against the audio** (`tools/lock_v5_mixcheck.py`, new): for each of the 101 lines, the take file the stick timeline names was cross-correlated with `mix.wav` in a ±0.4 s window around the place the lock says it starts.
- **All 101 takes sit where the lock says, to within 0.03 ms** (median 0.0 ms); the match quality (normalised correlation at the peak) is 0.79 at worst, 0.98 median.
- **Every line's first sound falls in the lock's `abs_in` frame in the mix: 101 of 101.** So the v5 picture's line frames, mouths and word marks are in sync with the stick mix as it is.

**Every act frame renders** (the a4p5-lock harness, scratch): all 12443 frames' pictures drawn once in Node through `drawShot5`: **0 layout failures, 0 stick fallbacks**, 218.7 s on one core at the lowest priority (56.9 frames a second; the heaviest shots S4.09 69 ms a frame and S4.08 50 ms, the slowest single frame 312 ms, a cold cache). 434 sampled frames (every shot's first, middle and last frame and every mark frame) have **no palette strays** beyond v4's own: S2.03's sanctioned EARLYWEB16 flashback and two S4.12 frames with a black `0x000000` pixel, both in reused v4 layouts and unchanged. `tsc --noEmit` shows only the pre-existing `src/dev/realism/bake/bake.ts` errors (11). v4's files are untouched by this pass (shots4, frame4, data-v4, render4, lock_v4).

**The mix is missing six beats' newer sound spots.** `mix.wav` (15:08) predates the approved JSON (22:14). The beat and line timing are identical, but these spots were added after the mix and are **not in it**: S3.00a the join bell (his tile connecting), S4.12 the three thunks and the key (the slate door), S4.13 and S4.13e the key-ring jangle, S6.04 a thunk, S7.01 the three heart taps. The lock's marks for them (S3.00a `connect`, S4.12 `door`, S4.13 / S4.13e `jangle`, S7.01 `heart1–3`) sit where the approved timeline puts them, so the picture is right and will match as soon as the mix has them. **Re-running `audio/reel/ep01-act4-v5/bed.py` on the approved JSON adds them without moving anything** (a sound pass's call; it wasn't this pass's brief, and it is a heavy job for `ops/heavy.sh`).

---

## 3. The shot registry (`animatic/shots5.ts`)

**Every shot has a layout**, of three kinds (the lock's verdict first, then how the layout is built):

| Lock verdict → built as | Shots | How |
|---|---|---|
| R → **R** | 35 | v4's layout as is, through the **`v4()` adapter**: the v5 shot record renamed back to what the v4 layout reads (its lines under the v4 ids it looks up, via the lock's `V4_IDS`; the lock's texts and marks; the v5 start and length), drawn at **v4's act frame of the same shot position** so its act-clocked loops and the avalanche's S6 sequence clock run exactly as in v4 |
| R → **C** | 3 | S1.09 (v4's drawing with his tile's neon on the 1.G guardrail), S5.09-back (the v5 S5.09 setup, the tile open from the cut), S7.06 (v4's drawing plus Terb's room-scale mouth) |
| C → **C** | 34 | the v4 composition re-dressed with the v5 art (art-built-v5 §1), re-built here where the v4 layout couldn't take the new piece from outside |
| C → **R** | 1 | S7.02b: v4's layout already lip-syncs Tasya and steps the slate on "below / above / around" from the take's words |
| N → **N** | 10 | new compositions of the v5 modules in the framing `art-v5/demos.ts` gives them: S3.00a, S3.04 (Neleh's desk OTS + the board's side of the call), S3.04b, S4.10b, S4.13c (the board head), S4.13d (the board screen), S5.07b (v3 29.15's quiet beat, with his mouth), S7.07b (the Other Yrral), S8.08 (the unpacked bullpen), S8.09b (the shut door, existing art) |

What each layout is built from is its `st` string (the host's margin prints it; `ledger5()` lists all 83). The C and N shots, briefly: S1.02 the JOIN corner; S1.03–S1.05 THE PLAN with Neleh's pointer (the three, the MAS / GERG plates by **drafting callout**, the sweep to the four, her page glowing on "us", the arrow, the company; the tip in the 2× zeros detail; Mada's spinner voice); S1.07 Alyi's silent speaking ring; S3.01 his tile going, the notice, the audio chip; S3.03 the blog draft and Post; S3.05 the evening lamp, Gerg's post, keycaps; S3.06 the employee standing; S3.07 Alyi's look and his step back into the dark; S4.01 the blue heart onto Rima's tile and the eulogy post; S4.02 Neleh's mouth and the phones stepping to the edge; S4.04 her own right shoulder, not a mirrored frame; S4.07 the speakerphone pull and four tones; S4.08 the split with Mario's finger, Adelina's crossing and phones, three room mouths, the v5 plates; S4.09 the lobby feed on the wall screen (GUEST's zoom), the badge post, Alyi's reflection; S4.10 the spot from Rima's tile, the new plate, the room chat; S4.11 the hourglass at insert scale; S4.13 Tasya reading his phone; S5.03 the posts on the phone (re-laid for its 71 px screen), hearted on the taps; S5.04 his head turn and mouth; S5.06 the letter; S5.09 the letter behind, the ringing tile opening; S5.09b Gerg's mouth on the look; S5.11 the slate door, the key, the crack, the desks; S5.12 the door ajar; S7.01 the P2 box with Alyi's phone, the popup post, both badges; S7.02 the badges and his mouth; S7.07 / S7.07-cont / S7.09 the calm-off with Terb reading the sheet, spraying, the stamp, the phone on the table, Gerg's post; S7.13 the hourglass from above on v4's table plate, the popup, the chat corner; S8.01 the box of zeros in the lobby; S8.07 Mas turned away, the vault, the rack, Gerg walking out.

**Mouths.** `mouth5()` draws a line's mouth track only where the lock gives its speaker a `face` in that framing; the adapter gives v4 layouts a one-entry `rest` track for the others (an empty track would make v4's helper flap). **All 44 faced speaker-in-shot pairs draw a mouth**, measured: for each pair, up to 10 frames inside their lines where the take's viseme isn't rest were rendered as locked and again with that speaker's face removed, and every pair's frames differ (from 7 px over 10 frames for Mas at room scale in S7.02 and 9 px for Adelina in the split, to hundreds or thousands of pixels for the busts: the lock's call tiles, busts, mediums, reflections and room figures). The visemes are the takes' own; nothing was hand-keyed. INF-LIPSYNC5 checks them in motion and refines (the room-scale mouths are 1–3 px and may want a bigger open drawing). *(Update, a4p5-lipsync: the mouth wiring now lives in `animatic/lipsync5.ts` (a 1-frame lead, no 1-frame holds, a syllable flap at room scale); the record is [lipsync-v5.md](lipsync-v5.md).)*

**The stick fallback.** `drawShot5()` draws a shot's layout inside a try; a layout that throws, or a shot with no layout, draws `stickFallback()` instead (stick figures in the cast's accent colours on a plain set in the side's light, mouths open while they speak, **no text label**), records it in `DRAW5_FAILED`, and returns `fallback: true` so the margin can flag it. The full-act pass hit it 0 times.

**Stand-ins still in the picture** (the `standin` flag; all carried from v4, all P4 polish in art-needs): S5.01 the chapter card, S7.06 the look-around, S8.01 the lobby crop in place of a true low angle, S8.05 the desk-top recolour, S8.09 the screwdriver hand, S8.10 the folding chair.

**Switches** (`OPT5`, the lead's calls): `neonGuard: true` (his tile's neon on 1.G's guardrail on his side too, art-needs §1.7), `soft1G: false` (STYLE-1G-SOFT off until it passes a blind read: the prep read found it looking like our own low quality; art round 4 improved its eyes), `footnotes: 'slips'` (FIX-FOOTNOTES: every v5 frame, reused v4 layouts included, is drawn inside `withFootnoteStyle('slips')`; v4 renders keep the digits). The art pass's three "for the v5 host" items (art-built-v5 §5a) are all done here: the footnote style, S7.13 on v4's table plate, S1.03's callout.

---

## 4. For the next passes (the interface)

```ts
import {DRAW5, drawShot5, OPT5, CANCEL_CLICK, J1_PIXEL_OPTS, ledger5, missingShots5, textChecks5} from './shots5';
import {SHOTS, SUBS, RAILS, SEQS, D6, SOUND_MARKS, MIX, ACT_FRAMES, EP_IN_FRAMES} from './data-v5';
// per act frame f: find the shot (sh.s <= f < sh.e), k = f - sh.s
const out = drawShot5(fb /* Buf 480 x 270 */, k, sh, f);  // paints rows 0-202; returns {layers?, full?, noVo?, print?, fallback?, st, standin}
```

**The host (INF-FRAME5) still owns**, exactly as `frame4.ts native4` does for v4: the GLYPH layers (`out.layers`, S1.09's dissolve: true tokens are INF-FRAME5's job), `print: 'blueprint'` (S1.02's last frames), the 2-frame whips (`sh.whip`: S2.05 out, S3.00a in), the side badge and its flip (`sh.side`, `sh.badge === 'flip-on-whip'` on S2.05), the rail band (`RAILS`), Mas's typed V.O. line (S2.01), and the margin and transcript. `out.full` (THE PLAN, the card) means no rail band.

**J1 against GLYPH (unruled).** The main cut keeps the GLYPH dissolve. For the comparison clip, J1 needs nothing from the layouts: for `t = f − CANCEL_CLICK` in 1…59 take the frame from `art-v5/j1/pixel.ts j1PixelFrame(t, hostFrame, J1_PIXEL_OPTS)` (the certificate for t 3–44 is Remotion's `J1Cancelled`) and ignore S1.09's layers; t 0 and t ≥ 60 are S1.09's own frames. `J1_PIXEL_OPTS.neonGuard` matches the neon S1.09 draws. Never both in one cut.

**The temp track** is `audio/reel/ep01-act4-v5/mix.wav`, offset 72 frames (`MIX`). Its six missing spots are in §2.

---

## 5. Decisions logged (kept on the approved timing)

- **Items up under their read floor** (the stick's timing, kept): NOPEAI · THE COMPANY 14 f of 30; the Cancel dialog 22 of 40; "You've been removed from the meeting." 46 of 51; [super] ×3 34 of 36; "Waiting for MAS MANALT to join…" 29 of 44; the blank step 4 24 of 27; Tasya's plate 75 of 80; the flood label 39 of 71; VOID IF CEO MISSING 26 of 29; "ALYI left the call" 18 of 28; "NELEH left the call" 15 of 29; MADA · LAST FIRER STANDING 35 of 38. None is new to v5's risk list except the waiting tile (the empty seat reads without its words) and the flood label, which the pixel shot doesn't letter (the cards multiplying carry it).
- **v4 marks scaled onto v5 lengths** (11, all logged in the lock). Only S2.02's `mark1` is still read (14 → 14).
- **Marks outside their shot:** none but S5.09's `glance` (v4's glance mark scaled past the end: "not in this shot"; the glance is S5.09b's).

---

## 6. How to re-run (exact commands)

```sh
# from the repo root: the lock (seconds; stdlib only), then the audio measurement (about 10 s)
python3 studio/src/episodes/ep01/act4/animatic/tools/lock_v5.py
audio/.venv-casting/bin/python studio/src/episodes/ep01/act4/animatic/tools/lock_v5_mixcheck.py [--json <scratch>/mixcheck.json]
# the type check (about 1 min; only the pre-existing bake.ts errors should print)
cd studio && nice -n 15 npx tsc --noEmit -p tsconfig.json | grep -v src/dev/realism/bake/bake.ts
```

To see the layouts without the host, bundle a small Node script that imports `SHOTS` from `data-v5.ts` and `drawShot5` from `shots5.ts` and writes PNGs (the pass's harness did exactly that: `scratchpad/a4p5-lock/test5.ts`, modes `sample <dir>` / `all` / `frames <dir> f…`; `npx esbuild <it> --bundle --platform=node --outfile=<it>.cjs`). A render of every frame's picture is ~4 min on one core: run it through `ops/heavy.sh` or at `nice -n 19`.

**When the stick timeline changes:** re-run `lock_v5.py` (it rewrites both outputs and re-checks), then the mix check (after the sound pass re-runs `bed.py`), then the harness `sample`. A new or renamed beat needs a `PLAN` entry in `lock_v5.py` (the check "every shot has a plan entry" fails until it has one) and a layout in `shots5.ts` (or it draws the stick fallback).

---

## 7. Measured versus needs a person

| Measured | Needs a person |
|---|---|
| Every frame count and line frame against the stick timeline (§2); every take's placement in the mix, to 0.03 ms | Whether any of it plays: lip-sync in motion, held-step rhythms, the neon's 8-frame clock, the pointer's aims against Neleh's words |
| Every act frame's picture renders, 0 fallbacks; no new palette strays; tsc clean | Whether the v5 compositions read: each shot's middle frame was looked at once, at 1× (a few at 2×), by one reader |
| All 44 faced pairs draw a mouth that follows the take (pixel difference, §3) | Whether the mouths read as speech at 1×, most of all the room-scale ones |
| The post texts the picture draws equal the lock's (the layouts draw the lock's words; POSTS and BLOG agree with them: `textChecks5()` empty) | A newcomer and an insider read of the pixel cut, once INF-RENDER5 has it |

---

## 8. Open issues

1. **The six sound spots missing from `mix.wav`** (§2): rebuild the mix with `bed.py` (no timing change) before the v5 picture is judged with sound.
2. **Mas's end desk is right of centre in the bullpen** (S7.02, S8.08), where the script says left (art-built §7.2): a room re-staging, not a layout change.
3. **Small things the layouts don't draw yet** (each is noted in its `st`): S1.05 Neleh's set-down pose (the fold covers the sheet's right edge; her figure is the paper walker in the row); S4.01 no spotlight on Rima's tile (the blue heart lands on it); S4.11's rack doesn't step the hourglass (the insert kit has no soft option); S5.11 Gerg's small typing tile on the monitor; S7.09's stamp is Terb's arm in depth plus the sheet on the table, not v4's foreground hand.
4. **S5.09's Gerg is small in his tile** (drawGergMediumPOV, as in v4): art-needs describes the setup as "Gerg big". An art call, not a timing one.
5. **The held-frame cache is shared with v4** (`lay.ts held`, keyed by name). v5's own keys all start `s5:`, but the reused v4 layouts keep theirs, so one process rendering v4 and v5 frames with different footnote styles could show a cached drawing in the other style. In separate processes (render4, a render5) this can't happen, and none of the held drawings the reused v4 layouts use here has Neleh in it (the all-hands, the dark plate, the walkout bullpen behind Tasya, the lobby, the shut bullpen, the v3 MCU backgrounds); every boardroom plate with Neleh in v5 is drawn under an `s5:` key.
6. **STYLE-1G-SOFT and J1** are off pending a blind read / the showrunner's ruling (§3, §4).

---

## 9. The finishing pass (a4p5 finish, 2026-09-27, about 03:35–05:00): what changed in the layouts

**Why.** The brief: "fix what the reads and the audit found (clarity, readability, lip-sync, broken or cheap-looking shots, stand-ins you can replace in time), keeping the approved timing and the stick mix". The inputs were the picture audit ([audit-v5-pixel.md](audit-v5-pixel.md), § numbers below), a newcomer read and an insider read of the 8:38 picture film (relayed in the brief; their numbered confusions are cited as *N#* and *I#*), the facts check ([facts.md](../../facts.md), "Act Four v5 lock checks") and the extra art's hand-off ([art-extra-v5.md](art-extra-v5.md) §1).

**What did not change.** The lock (`data-v5.ts`, `shots-locked-v5.json`): every cut, line, mouth track, text time and story mark is as the lock places it; no mark was moved, so the picture still lands on the final mix's spotted sounds. The temp track is still the stick mix. v4 is byte-identical (§9.3). The art modules' changes are logged in [art-built-v5 §5b](art-built-v5.md#5b-the-finishing-pass-a4p5-finish-art-changes).

### 9.1 Layout changes, shot by shot (`animatic/shots5.ts`)

| Shot | Was | Now | Why |
|---|---|---|---|
| S1.04 | `(HE TOLD THE SENATE)` on the frame's last rows, crossed by the border rule | The two zero stamps and the caption 10 px higher (`drawPlan4(..., {zerosLift: 10})`, opt-in in `plan4.ts`) | audit §2.8 |
| S1.07, S1.09 | The noon dialog's left border ran off the frame (v4's `DLG.x` = −12) | `dialog5` / `DLG5`: the same dialog 16 px right; the arrow's path follows it | audit §2.13 |
| S1.09 | The emptied tile plate fell over Mada's tile and across the notice | It falls behind the four tiles (drawn before them), so it drops out under the grid and the notice | audit §7 |
| S1.09, S2.05, S3.01, S6.03–S6.06 | Every toast / notice icon was a 3 × 6 door outline (read as a missing-glyph box); "rewinding…" had a door | `OPT5.toastIcon: 'v5'`: a filled door with an arrow out of it; a ◀◀ rewind glyph on "rewinding…" (`callgrid withToastIcon`, `noticeIcon`) | audit §2.13 |
| S2.02, S2.04 | The three marks were 1 px dark grooves on dark wood | `marksGouge5`: each groove gets its dark shadow edge and a paler cut wall; the mark the Orb's light is on catches its cyan. Only groove pixels change (his hand is masked out) | audit §2.12 |
| S3.00a, S3.01, S3.02 (laptop edge), S3.04, S3.05 | Alyi's board-side tile was his navy reflection in a door's glass (the firing line from "a shadow"; the newcomer read him as an android) | `OPT5.alyiLit`: the door open and the man lit in it (his S3.07 face). His side of the call keeps the reflection | audit §2.9, *N6* |
| S3.02 | v4's layout: a floating orange pencil, v4's call grid on the laptop edge | POLISH-PEN-HAND (`drawNelehPenHand`, pen, lifted for the run); the laptop edge shows v5's board-side call as S3.01 left it | audit §2.13 / §5, art-extra §1 |
| S3.03 | The blog page sat still for 15.5 s while an unseen voice read it | The words she has read are underlined as she reads them, from her take's word times (`blog-draft read`) | audit §2.13, *N4* |
| S3.04b | Read as "a lone woman in a dark library" | Her footnote slips orbit her head, as in her tile | *N5* |
| S3.05 | Gerg's post a small notify card in the corner; keycaps came to rest over the tiles like dead pixels | A popup over THE QUIET VOTE's black tile, with his profile line `president & chairman, nopeai` (what "He'd have kept his job, just not the chair." refers to) and the facts check's `…i quit.`; his keycaps pop out of the card and fall out of frame (`keycapPop5`) | audit §2.13, *N7* (needed), insider minor, facts L2 |
| S4.01 | The eulogy post's stamp `NOV 18` (the UTC date) | `NOV 17` (`POSTS.masEulogy.ts`); the scene's rail stays NOV 18 | facts L3 |
| S4.08 | Both rent meters readable from 3:14 ("It's Nozama. About the money." read off the wall); after Adelina hung up, the left pane still held Neleh on a live pod, so "Hi. Yes. We're very worried. How much?" played as said to her | The meters' displays dark until Nozama rings (the lock's label lands there), then lit; from the hang-up the pod's LEDs go out, `CALL ENDED` shows on it for 1.8 s, and her pane steps down two palette steps | *I* shot-choice #3, *N9* |
| S4.10b | Mada left, Neleh right (S4.10 and S4.12 put Neleh left, Mada right) | `drawBoardHead2S` `stage: 'nelehLeft'`: Neleh standing left (flipped to face him), Mada seated right, Ttemme turned to her, the folder slides from her side, his chat panel at his other elbow; the room's plate itself is not mirrored | audit §2.3 |
| S4.12 | v3 27.28's nameplates (ALYI at Mada's seat); Tasya slate-lit in the door | A v5 copy of v4's re-clock of 27.28 with S4.06's plates (NELEH, MADA) and Tasya lit by the room | audit §2.7, §2.5 |
| S4.13 | The plate's third line (NOPEAI RUNS ON ITS SERVERS) in dim grey | Full ink | audit §2.8 |
| S4.13e | v4's slate portrait, its dark arm, the sign a floating card | A v5 layout on S4.13's setup: `tasyaPhonePortrait` (room skin, the ring in his fist, one jangle on the mark), the sign held at his chest with his fingers on its edge | audit §2.5, §5 |
| S4.14 | A floating marker | POLISH-PEN-HAND (marker) | audit §5, art-extra §1 |
| S5.01 | `kit.cards` stand-in | POLISH-CHAPTER-CARD | art-extra §1 |
| S5.06 | The scroll never reached `ALYI (REPORTED)` (18 px below the fold at the last frame); Alyi's thumbnail with a vote check from frame 0; Gerg's typing jitter | From the `scroll` mark the page moves 6 px every 2 f and stops at its bottom (the row is up about 11 f before the `alyi` mark and lights on it); the thumbnail only from the mark, no check (`staff-letter alyiThumb: 'onMark'`); calm typing; `judgement` as the letter spells it | audit §2.1, §2.11, *N14*, *I* shot-choice #4, facts L1 |
| S5.09, S5.09-back | Gerg's head bobbed a pixel on a 1–3 f beat while Mas talked (65–70% of Mas's frames) | `gerg-medium calm`: typing drawings on 3s, a 1 px shoulder bob every 16 f | audit §2.11 |
| S6.06 | `MADA · LAST FIRER STANDING` in 5 px text in the tile's foot, 1.46 s | The call's caption plate under the tile in the display face, opening in v4's 3 held steps on the same mark | audit §2.8 |
| S7.01 | The three hearts 7 × 7 specks; `GUEST` clipped to `GUES` | Hearts at icon size (13 × 11, keylined) on twoshots' own path; the GUEST card as wide as its word | audit §2.13, *N18* |
| S7.02 | Tasya behind the bench's front, left of Mas (the singles reversed the wide); a frozen tableau | Tasya on the open floor right of Mas's desk, in front of the bench, facing him; his key ring jangles once early in the hold | audit §2.4 |
| S7.02b | Tasya teal from frame 0 | Lit by the room (`tasyaRoomPortrait`) until "below", then the slate ramp with the floor (a palette step) | audit §2.5 |
| S7.03 | The floor's "Hello." had no visible source | A slate ripple runs out across the floor from under Mas in held 3 f steps while it plays (hidden behind his bust) | *N19*, insider minor |
| S7.07, S7.07-cont, S7.08 | The chair fire survived Terb's spray, then vanished on the cut to S7.09; Mas warm in S7.08, teal in the two-shots | The fire goes out on `sprayEnd` (the plate's own out state: smoke, then the scorched seat) and stays out; S7.08 is a v5 copy of v3 30.14 with the fire out and Mas in the two-shot's cool key (`light: 'monitor'`) | audit §2.6, §2.13 |
| S8.01 | v3 30.19's cropped wide (stand-in); Mas in front of the A of `NOPE AI` | ROOM-LOBBY-LOW (`drawLobbyLow`, the carton set down in the worker's hand); Mas at the desk's right end (`LOBBY_LOW.masFeet` x 300) | audit §2.13 / §5, art-extra §1 |
| S8.03 | Mas twice (v4's lobby drew his standing figure behind his own shoulder) | A v5 copy with `lobbyRoom(..., null)` | audit §2.2 |
| S8.05, S8.09, S8.10 | Stand-ins (the recoloured desk top; a block fist; a blue slab chair and a floating label) | POLISH-LOBBY-STONE, POLISH-SCREW-HAND (the fist rolling a third of a turn every 4 f on each screw), POLISH-FOLD-CHAIR with its reserved-seat card | audit §5, art-extra §1 |

The review band (`frame5.ts`) and the transcript follow the picture's words where the facts check changed them (`factsText5`: `…i quit.`, `judgement`). **Stand-ins left:** S7.06 only (v4's look-around; the extra art pass left it to the cast owner).

### 9.2 Looked at and not changed (the lead's or the showrunner's calls)

- **`VOID IF CEO MISSING` up 1.08 s** (audit §2.8): the fix moves the S5.08 cut about 10 f, off the approved timing.
- **J1 or GLYPH:** unruled; the main render keeps GLYPH; the comparison clip is re-rendered (report-v5 §5). The newcomer's first read of the click ("they hesitated, cancelled, and he was removed anyway"; the pun came later) is evidence for the ruling: J1's `CANCELLED` certificate states the pun; GLYPH relies on the notice.
- **Story-level questions the reads raised** (script, read only here): why the board fired him (a deliberate open question), the Orb's identity, `YRRAL (NOT THAT YRRAL)`, Q\* and "it's a preview", the ALYI plate on the door after the chair plate comes off, Tasya's and Alyi's physical presence at 4:21–4:44, and whose screen the flooded call is under HIS SIDE.
- **Staging that needs new art:** "we'll stand." with Mas seated (a standing calm-off pose), S7.06's look-around, the room-scale mouths (a two-row jaw drop is in v4-shared rigs), S4.13d's flat composition, Mas's pale-teal hands (taste, inherited), S1.04's 2× zeros detail.
- **S8.09's plate timing** against "zero ill will": the screws are spotted in the final mix at the lock's marks.
- **S7.02b's remap and podcast boom** (extra art): options pending R25; not wired.

### 9.3 Checks

- `render5.ts check`: 83 layouts, 0 problems; `ledger`: 83 shots, 1 stand-in (S7.06).
- `tsc --noEmit`: only the 11 pre-existing `src/dev/realism/bake/bake.ts` errors.
- **v4 unchanged:** `v4check.mjs`, pinned to commit `76ea5ba` (the lead's commit 9e1df60 swept this pass's first edits into HEAD, so HEAD was no longer the baseline) for all ten shared files this pass touched: **812 / 812 frames IDENTICAL**. The scratch copy that takes the ref: `REF=<commit> node <copy of v4check.mjs>` (the only change is `HEAD:` → `${REF}:`).
- Stills: every changed shot before and after at native 480×270 (2× on the sheet), crops at 2–3× for the marks, the fire and the floor ripple; the render's own checks and the decode in report-v5 §5.

### 9.4 How to re-run, and where the evidence is

- **The render chain** is report-v5 §6's commands (bundle → glyphs → compare → both → contact → ledger + shotlist → transcript → verify → report), one heavy step at a time through `ops/heavy.sh`; then `mix_v5_final.py --mux-only` for the final-mix film (it skips the pixel film if the picture was written in the last 3 minutes, so run it after that). Measured here: bundle 8 s, glyphs 10 s, compare 44 s, both 237 s on 2 workers (load under 5; the thermal zones read about 82 °C when checked), verify 40 s, report 16 s, mux under a minute. Free disk stayed at 7.6–8 GB.
- **The transcript** writes to `show/episodes/ep01/production/act4/transcript-v5.txt` (`tools/transcript_v5.py <out>`; light).
- **The v4 check against a given commit:** copy `art-v5/tools/v4check.mjs`, change `HEAD:` to `${process.env.REF ?? 'HEAD'}:` and the `esbuild` import to its absolute path under `studio/node_modules`, then from `studio/`: `REF=76ea5ba ../ops/heavy.sh node <copy> <scratch> <the pinned files>` (about 1 min).
- **Scratch** (`scratchpad/a4p5-finish/`, may not last): `job-render.sh` / `job-verify.sh` and their logs, the Remotion bundle and the 28 GLYPH PNGs the films spliced (`bundle/`, `glyph/`), `shot.py` (prints a shot's lines, texts and marks from the lock), `tile.py` (still sheets), `rs.sh` (rebuild `r5.cjs` and render native stills), `v4check-ref.mjs`.
- **Still owed to a person:** a watch at speed of every changed shot (above all S4.08's pane going dark, S4.10b's re-staging after S4.10, S5.06's fast scroll, S7.03's ripple, the S1.09 dialog and plate), and a fresh newcomer read of the new cut.
