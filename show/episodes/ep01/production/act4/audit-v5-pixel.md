# Ep1 · Act Four · Picture audit of the v5 pixel render

| | |
|---|---|
| **Who, when** | The picture auditor (`a4p5-picaudit`), 2026-09-27, about 03:00–03:40. Report only: no project file other than this one was written, nothing re-rendered, nothing committed. |
| **What** | `out/ep01/act4/animatic/act4-animatic-v5-picture.mp4` (the show frame, 4× nearest) and, for the Cancel moment, `act4-v5-cancel-compare.mp4`, checked against the approved stick timing (lock v5, [shots-locked-v5.json](shots-locked-v5.json), which carries `show/reel/ep01-act4-v5.json` and `lines-v5.json`) and against [flow-and-continuity](../../../../bible/flow-and-continuity.md) §1–5a and [PIXEL_GUIDE](../../../../../studio/PIXEL_GUIDE.md). I read the live [SHOWRUNNER-NOTES](../../../../production/SHOWRUNNER-NOTES.md) first: nothing there is newer than the brief. |
| **The questions** | Does every shot read at 480×270? Does the lip-sync land on the right speaker? Does coverage hold for the conversations? Are eyelines and screen direction consistent? Where are the stand-ins and stick fallbacks? Is text up long enough to read? What looks broken or cheap? |
| **Honesty** | **I can't watch video in real time or listen, and I didn't.** Every number below comes from decoding the encoded film. Every judgment about how a frame reads comes from stills I looked at: the first, middle and last frame of all 83 shots at 1× (480×270), about 60 more frames at 1×, and 25 crops or strips at 2–6×. That is one reader's eye on stills, not a watch. Where I write "likely reads as", it's a prediction for a person to confirm or overrule. |
| **Laptop load** | Two full decodes of the picture film, each about 40 s on one thread at nice 19 through `ops/heavy.sh`; everything else was small reads (a few frames) or numpy on stored masks, at nice 15. Load stayed about 2–5; free disk 8.7–9.4 GB. |

**Timecodes.** *Act* is the act clock (m:ss.ff in seconds), *TC* the episode timecode (mm:ss:frames, act + 12:31:00), as in [shotlist-v5](shotlist-v5.md). `k` is the frame inside a shot, `f` the act frame.

---

## 0. Short version

The render matches the approved timing. I checked it again myself: all 82 cuts land on the lock's frame (three are same-setup continuations that barely change the picture), and the film's audio is 0 samples off `mix.wav` at the six line onsets I tested. The lip-sync also lands on the right person. In every two-shot and box I tested, the listener's mouth stays shut while the other person talks. The mouth changes lead the take's visemes by one frame, which is the designed `LIP5.lead`. Coverage holds: every conversation plays in one to three held setups, and nothing cuts line by line.

These spots hurt most:

1. **S5.06: the letter never reaches ALYI.** The scroll is too slow, so "ALYI (REPORTED)" ends 18 px below the visible page and is never on screen (§2.1). This is the reveal the scene builds to.
2. **S8.03: Mas appears twice.** The lobby plate draws his standing figure behind his own over-the-shoulder (§2.2).
3. **Two scenes cross the line:**
   - Neleh and Mada swap sides between S4.10 and S4.10b, then swap back in S4.12 (§2.3).
   - The S7.02 wide puts Mas right of Tasya, but both singles put him on the left (§2.4).
4. **Continuity within a scene:**
   - Tasya's skin goes from warm to teal between S4.13 and S4.13e, and v4's "dark blade" arm comes back (§2.5).
   - The chair fire survives Terb's spray and then vanishes on a cut (§2.6).
   - A nameplate reads MADA in S4.06 and ALYI in S4.12, at the same seat (§2.7).
5. **Payoff text that is too short or too small:**
   - `VOID IF CEO MISSING`: up 1.08 s.
   - `(HE TOLD THE SENATE)`: sits on the frame's bottom border.
   - `MADA · LAST FIRER STANDING`: up 1.46 s.
   - Tasya's three-line plate (§2.8).
6. **Faces that carry lines but barely read:**
   - Alyi's board-side call tile is navy-dark, and it carries the firing line (§2.9).
   - Three room-scale speakers are hard to see: S4.08, S7.02, S8.08 (§2.10).
   - S7.02 is a completely frozen tableau for 5 s.

Everything in §2 is fixable in v5's own files without touching v4 or the timing, except two items that would move a cut by a few frames. Those are flagged as the lead's call.

---

## 1. What I measured, and how it came out

| Check | Result | How |
|---|---|---|
| **Cuts on the lock's frame** | 82 cuts in total:<br>• 77: act frame `s` differs from `s−1` more than from `s+1`.<br>• 2 more (S3.00a's whip-in and S7.06's door bang) are also on the frame; both frames next to the cut change a lot.<br>• 3 (S2.02, S2.03, S2.04) are same-setup continuations with no visible change. | The decoded frames at `s−1`, `s`, `s+1` for every shot, compared as mean abs grey difference. This check is independent of `verify_v5.py`, and it agrees with its 78 + 4. |
| **Audio against the stick mix** | 0 samples at all 6 onsets tested: `a5-25-01`, `a5-27-01`, `a5-27-30`, `a5-29-06`, `a5-30-10`, `a5-31-04`. Correlation r ≥ 0.9997. | 1.2 s of the film's audio against `mix.wav` from its 72-frame offset, searched ±50 ms. |
| **Lip-sync: where the mouth moves** | 46 faced speaker-in-shot pairs.<br>• 38: the strongest "moves only while this person talks" spot sits on that person's face.<br>• 8: other motion won the search (a meter, the chat panel, the Orb, the letter's scroll, the drift, a sliding tile).<br>• For 6 of those 8, a face box showed the mouth moving while its speaker talks: 23–37% of their talking frames, against 0–13% otherwise. (S4.13c has no "otherwise" frames, but its timeline shows the flap's rhythm.)<br>• S5.06's small tile moves more while Mas talks: the typing bob, §2.11.<br>• S6.04's sliding tile defeats the test; the lip-sync pass's face-on/face-off check covers it. | Per-pixel change masks for all 12,443 frames (threshold 12 levels at native). For each pair: change rate during their lines minus the rate at all other frames, then a 7×7 hot spot. |
| **Lip-sync: timing** | Best lag −1 frame for 38 of 46 pairs. Hit rates on the take's mouth changes:<br>• busts and tiles: mostly 0.8–1.0, against 0–0.06 elsewhere<br>• room-scale flaps: 0.6–1.0, against 0.1–0.24<br>So the drawing changes one frame before each viseme change, which is the designed lead. | The hot spot's per-frame change, against the take's mouth track (open/shut for room-scale mouths), searched −3…+3 f. |
| **Lip-sync: the listener** | In every two-shot or box I tested, the non-speaker's mouth box changes on 0% of the other speaker's frames: S4.06, S4.10b both ways, S7.01 both ways, S5.09b. The only listener motion is Gerg's typing bob: his head box changes on 65–70% of Mas's frames in S5.09 and S5.09-back (§2.11). | Face boxes. |
| **Frozen pictures** | **S7.02 has no frame with more than 3 px of change for its whole 5.0 s** (only Mas's 1–2 px mouth moves). S5.08 is still for 4.4 s under Gerg's explanation. S7.01 has a 3.9 s still under Alyi's post. Everything else of 4 s or more has regular visible motion. | The same masks: runs of frames with ≤ 3 px changed, and the share of frames with more than 20 px changed. |
| **Text read time** | 12 must-read items are up for less than their floor (0.25 s + 0.05 s a character), the same 12 the lock kept as "the approved stick timing". §2.8 lists the four that matter, and §6 lists all 12. The 7 silent posts are all over their floor, at 1.1–15.8×. One must-read, `ALYI (REPORTED)`, never appears (§2.1). | From the lock's text spans, and the frames looked at. |
| **Stand-ins and stick fallbacks** | 6 shots are flagged `standin` in the ledger. 3 more carry an unflagged stand-in: the floating pencil in S3.02 and S4.14, and S4.13e's v4 portrait and floating sign. **No stick-fallback frame**: the render log shows `failed {}` and `marked []`, and I saw none in the ~310 frames I looked at (§5). | `layout-v5.json`, `act4-animatic-v5.mp4.render.json`, and the frames. |

---

## 2. Spots that hurt, most important first

### 2.1 S5.06: the scroll never reaches ALYI, so the reveal isn't in the picture

**Where.** S5.06, act 5:17.08–5:39.88 (TC 17:48:02). The `alyi` mark is k493 (act 5:37.62, TC 18:08:15), just before Gerg's "Alyi signed it." (k517).

**Seen and measured.**
- At the shot's last frames (f8124–8156), the SIGNED list shows 11 rows of grey bars and **no `ALYI (REPORTED)` row**, at 1× and at 3×.
- The only sign of Alyi is his sidebar thumbnail, which gets an orange border on the mark.
- The cause: I replayed the layout's scroll with `letterLayout()` from `kits/staff-letter.ts` and the S5.06 loop in `shots5.ts`.
  - ALYI's row is page row 315, and the stop target is `LETTER_SCROLL_MAX` = 182.
  - The scroll moves 1 px every 2 frames. It is at 74 when the final scroll starts (k457), 92 at the mark, and only **119 at the last frame**.
  - So the row sits 196 px into a 178 px window, 18 px below the fold. Reaching the stop would take 216 frames; the shot has 90 left.
- Separately, **Alyi's thumbnail sits in the letter's sidebar from the shot's first frame**, next to Gerg's live tile, with the call tiles' red check icon. A newcomer may wonder why Alyi is on Mas's 2 AM monitor at all. An insider may read the check as "signed" 20 s early.

**Why it hurts.** must-understand #10 ("Alyi signed too") is the scene's turn. The shot list says "the scroll stops on ALYI". As rendered, the audio carries it ("Scroll to the bottom." / "Alyi signed it."), but the picture doesn't: the one must-read in the scene never appears.

**Fix** (in `shots5.ts` S5.06, v5 only):
- From the `scroll` mark, run the last stop at about 3 px a frame, in held 2-frame steps (6 px every 2 f). That moves 74 → 182 in 36 frames and lands just before `alyi` (k493).
- Or move ALYI to about the 6th name in `staff-letter.ts pageBuf`, so the existing scroll brings the row up.
- Draw the sidebar's Alyi tile only from the `alyi` mark, and without the red check: it becomes the "who is this" answer, not a pre-echo.
- Check with a still at k500 and one at the last frame.

### 2.2 S8.03: Mas appears twice

**Where.** S8.03, act 8:00.50–8:03.50 (TC 20:31:12), the whole shot.

**Seen.**
- The over-the-shoulder draws Mas's silhouette at the left edge (`shoulder(masPortrait)`).
- Behind the dialog, his standing room figure is also there at x≈262, in front of the `NOPE AI` letters: the same figure S8.01 shows at reception.
- The cause: v4's S8.03 (reused as R) calls `lobbyRoom(b, 0, {sign: 3})`. `backs.ts lobbyRoom`'s fourth argument defaults to `{}`, which draws `drawMasStand` at x 262. v4 has the same bug.

**Why it hurts.** Once seen, it reads as a mistake, and it's in the act's last beat of jeopardy (the refused Cancel).

**Fix.** In `shots5.ts`, replace `R5('S8.03', 'S8.03')` with a v5 copy of the layout that passes `null` as `lobbyRoom`'s fourth argument (`lobbyRoom(b, 0, {sign: 3}, null)`). v4 stays as it is.

### 2.3 S4.10 → S4.10b → S4.12: Neleh and Mada swap sides and swap back

**Where.**

| Shot | Act | TC | Framing | Staging |
|---|---|---|---|---|
| S4.10 | 3:55.88 | 16:26:21 | wide | Neleh standing left (x≈160), Mada seated right (x≈430) |
| S4.10b | 3:59.88 | 16:30:21 | two-shot across the table, 15.25 s | Mada left (x≈105, spinner), Neleh standing right (x≈405) |
| S4.12 | 4:18.50 | 16:49:12 | two-shot | Neleh left, Mada right again, as in S4.02 and S4.06 |

**Why it hurts.** The Ttemme scene is a held exchange, so the audience keeps its geography from the wide. Both board members jumping sides on the cut in, and again 15 s later, is the "hard to tell where we are" feeling flow-and-continuity §2 warns about.

**Fix.** Re-stage `rooms/boardroom-head.ts drawBoardHead2S` (a v5 asset) with Mada at the table's right and Neleh standing at its left, facing screen-right toward Ttemme. S4.06's two-shot already draws her facing right, but with a different rig, so `neleh-medium` may need its own right-facing drawing (not a mirror, art-needs §1.8). Keep Ttemme centred. S4.13c (`drawBoardHeadM`) doesn't show either of them, so it needn't change.

### 2.4 S7.02 → S7.02b → S7.03: the singles reverse the wide, and the wide is frozen

**Where.** S7.02, act 6:49.00–6:54.00 (TC 19:20:00); S7.02b, 6:54.00 (TC 19:25:00); S7.03, 7:02.58 (TC 19:33:14).

**Seen and measured.**
- In the S7.02 wide, Tasya is half-hidden behind a box at x≈230 and Mas sits at his desk at x≈290, to Tasya's right.
- The singles have Tasya at the right third looking screen-left, then Mas at the left third. That reverses the wide.
- art-built-v5 §7 and lipsync-v5 §7 already note that Mas's end desk is right of centre when the script says left. This is the picture cost of that.
- **The wide is completely still**: across its 120 frames, no frame changes more than 3 px, apart from Mas's 1–2 px room mouth. That includes about 15 standing staff with coats and boxes.
- Mas asks the scene's question ("what happens to you if nopeai disappears?") with a one-pixel mouth.
- Tasya is not "in the middle of the floor", as the lock's line says; he's behind a desk.

**Why it hurts.** It's the one place in S7 where a newcomer has to find the speaker in a crowd: the v4 audit's S7.02 note, still open. A frozen room reads as a still image, and the reversed singles make the answer feel like it comes from the wrong side.

**Fix** (cheapest first):
- (a) In the wide, stand Tasya on the open floor right of Mas's desk (x≈330–350). The singles then match with no new art.
- (b) Turn four or five staff heads toward Mas on his question, in held steps. That finds the speaker and adds life.
- (c) Add one idle per few people: a box set down, a coat shrug, a blink on 4s.
- The desk move the script asks for (`rooms-b bullpen`) would also fix S8.08. It's larger, and it's the art pass's open item.

### 2.5 Tasya changes skin and arm within one scene (S4.13 → S4.13e), and again in S7.02b

**Where.**

| Shot | Act | TC | How Tasya is drawn |
|---|---|---|---|
| S4.12 | 4:18.50 | 16:49:12 | small in the door, slate-lit |
| S4.13 | 4:21.42 | 16:52:10 | MCU, **warm skin**, the key ring in his fist (the round-4 fix) |
| S4.13c | 4:27.92 | 16:58:22 | warm, small in the door |
| S4.13e | 4:41.33 | 17:12:08 | the same MCU setup, 13 s after S4.13 ends: **teal slate skin**, and the dark wedge by his head that round 4 fixed in `tasya-phone.ts` (art-built §5a #1 and #7) |
| S7.02b | 6:54.00 | 19:25:00 | teal from frame 0, before the room turns slate at "below" (5.25 s) |

**Why it hurts.** The same face in the same doorway changes colour on a cut. The fixes the art pass made only reach the shots that use the new portrait.

**Fix** (v5 only):
- **S4.13e:** draw it with `cast/tasya-phone.ts tasyaPhonePortrait` (`skin: 'room'`, `arms: 'ring'`), as S4.13 does, and put the sign in his free hand: today it floats as a card over his chest.
- **S7.02b:** start with `skin: 'room'` and step to slate as a palette step on `below`, with the walls (PIXEL_GUIDE §4: "light changes are palette steps").
- **S4.12:** its small Tasya can stay slate-lit (he's in the slate door), but `'room'` would match S4.13c.

### 2.6 S7.07 → S7.09: the chair fire survives the spray, then vanishes on a cut

**Where.**
- The spray: S7.07 k97, act 7:19.08 (TC 19:50:02).
- The fire is still burning through S7.07's end, S7.07-cont and S7.08's background (act 7:15.04–7:43.04).
- It is gone from S7.09's first frame: act 7:43.08, TC 20:14:02. I compared f11113 and f11114 at 2×.

**Why it hurts.** The spray is a visible action with no effect, and the vanishing fire is a continuity jump on a cut into the act's "long hold".

**Fix.**
- Put the chair fire out on `sprayEnd` in S7.07: a two-drawing smoke wisp, then a scorched seat.
- Keep it out in S7.07-cont (the same `drawCalmOffTerms2S` state) and in S7.08. S7.08 is an R shot, v3 30.14's MCU with the fires soft; give it a v5 override without the chair fire.
- The other fires can keep burning: "nobody has mentioned the fires".

### 2.7 S4.06 vs S4.12: the same seat's nameplate changes from MADA to ALYI

**Where.** S4.06 (act 2:58.12, TC 15:29:03) and S4.12 (act 4:18.50, TC 16:49:12). Both are the `drawBoard2S` two-shot. The plate at x≈267, in front of Mada's seat, reads `MADA` in S4.06 and `ALYI` in S4.12. I compared both at 3×.

**Fix.** In S4.12 (R, v3 27.28's plates), pass S4.06's plates. That means a v5 override, since v4's S4.12 is the same.

### 2.8 Payoff text: too short or too small

| Where | Text | Up / floor | What I saw at 1× | Fix |
|---|---|---|---|---|
| S5.08, the last 1.08 s (act 5:48.12, TC 18:19:03) | `VOID IF CEO MISSING` | 1.08 / 1.20 s | Big and clear, but it's the check's payoff and the cut takes it 26 frames after it lands. The check sits still for 4.4 s before it. | The stamp's sound is at 4.75 s in the mix, so don't move the stamp. **The lead's call:** move the S5.08 → S5.09-back cut about 10 f later. Mas's "what are you building?" starts 14 f into S5.09-back, so no line is clipped. That gives the stamp about 1.5 s and moves one cut off the stick. Otherwise, accept it. |
| S1.04 (act 0:25.62–0:27.71, TC 12:48:18 +) | `EQUITY: 0 (HE TOLD THE SENATE)` | 2.08 / 1.75 s | The time is fine, but the parenthetical is a 5 px line on the frame's bottom rows, crossed by the blueprint's border rule. I could just make it out at 3×; at 1× it is barely legible. It's a protected insider line (edit-plan §1). | Raise the stamp and its caption 8–10 px so the caption clears the border. Draw the caption in the 7 px face. |
| S6.06 (act 6:29.21, TC 19:00:05) | `MADA · LAST FIRER STANDING` | 1.46 / 1.55 s | 5 px text inside his tile, on the dead stop, then the cut. | Draw it in the 14 px display face (`bigText`) on a plate below the tile, so 1.46 s is enough. Or start it typing 6–8 f before the stop so it's complete on the stop. |
| S4.13 (act 4:21.58–4:24.71, TC 16:52:10 +) | `TASYA · THE LANDLORD · MACROSOFT · NOPEAI RUNS ON ITS SERVERS` | 3.12 / 3.30 s | Three lines, the third dim grey, up under his first line ("You'll want to hear our statement."). | A person should read it at speed. If it doesn't read, lift the third line's ink one step. Or drop "MACROSOFT" from line 2, since the slate door and the statement say it. |

The other eight items under their floor are UI chrome the audience knows, or text that carries across a cut (§6).

### 2.9 Alyi's board-side call tile is too dark for the firing line

**Where.** S3.00a (act 1:03.00, TC 13:34:00), Alyi's "Mas. The board has decided that you will no longer lead the company…", which is must-understand #3. Also S3.04 and S3.05.

**Seen.**
- On the board's own laptop, Alyi's tile is a navy face on a dark ground. His mouth is a short cyan dash; I checked it at 4×.
- It moves on the take (best lag −1, hit 0.94), but at 1× the face reads as a shadow.
- The speaking ring carries "who", not the face.
- In S3.07 and S7.01 the same man is drawn warm and fully lit.

**Why it hurts.** It's the act's most important line and the first time the audience sees the board's side. A navy blob delivering it undercuts the point of showing their side.

**Fix** (a design call):
- On the board's side, draw his tile with his lit face, as S3.07 draws him, and keep the navy glass reflection for Mas's side of the call. His side sees a reflection; their side sees the man.
- At the least, lift the tile's face two rungs in `cast/alyi-v5.ts drawAlyiTileFit`.

### 2.10 Speakers too small to find: S4.08, S7.02, S8.08 (room-scale mouths)

**Where and what I measured** (mouth boxes, while the speaker talks against otherwise):

| Shot | Act (TC) | Speaker | Mouth box changes while they talk | Otherwise | Note |
|---|---|---|---|---|---|
| S4.08 (the 28 s split) | 3:12.46 (15:43:11) | Neleh | 23% of her frames, mean 0.7 px | 0% | The weakest mouth in the act |
| | | Adelina | 27% | 13% | Her mouth is 1 px, and she moves |
| | | Mario | clearest of the three | | |
| S7.02 | 6:49.00 (19:20:00) | Mas | 20% at his desk | | Among 15 motionless staff (§2.4) |
| S8.08 (the memo, 9.4 s) | 8:20.38 (20:51:09) | Mas | 30% | 3% | He's findable (seated, cyan-lit, the staff opened round him), but the whole memo sits on a one-pixel mouth |

**Why it hurts.** These are the room-scale mouths the lip-sync pass left open. The mouths do follow the takes, but at 1× "who is talking" rests on staging and voice. In S4.08 that is probably fine (poses, the phone, the handover). In S7.02 it isn't (§2.4).

**Fix.**
- Stage it rather than draw more mouth:
  - listeners' heads turn to the speaker in held steps (S7.02, S8.08)
  - a slow whole-pixel push into the right pane from Adelina's entrance (S4.08, k442); this keeps the one held shot
- The bigger room mouth (a two-row jaw drop, lipsync-v5 §7.1) is in v4-shared files and needs the pinned v4 check.

### 2.11 Gerg's typing bob while Mas talks (S5.09, S5.09-back, S5.06)

**Where.** S5.09 (act 5:02.88, TC 17:33:21), S5.09-back (act 5:49.21, TC 18:20:05), and the letter's small tile in S5.06.

**Measured and seen.**
- While Mas talks, the box around Gerg's head changes on 65–70% of frames, with a mean of 121–130 px. A 3× strip of S5.09-back k10–40 shows his whole head moving a pixel on a 2–4 frame rhythm. That is `gergTypeAt`'s shoulder bob. His mouth stays shut.
- A box over S5.06's sidebar tile changes on 75% of Mas's frames.

**Why it hurts.** At 1× a head that jumps every few frames can read as jitter, or as Gerg talking over Mas, in the act's longest conversation (61 s).

**Fix.** In `cast/gerg-medium.ts`, while he's the listener, bob the shoulders every 8–12 f or move only the forearms, which sit below the tile's edge. The keycaps can keep popping.

### 2.12 S2.01–S2.04: the count is still hard to see

**Where.** Act 0:49.08–1:00.50 (TC 13:20:02–13:31:12). The four shots are one setup, which reads well as one insert.

**Seen.** The three marks are 1 px dark lines on dark wood; I could only find them at 3×. The Orb's eye-light (a cyan oval) and Mas's pale hand are what the eye reads. This is the v4 flow audit's "a count the audience can't see (S2)", still open.

**Fix.** Carved wood shows pale:
- Draw each mark as a 2 px light gouge with a dark shadow edge.
- Brighten each mark one step when the eye-light lands on it, which makes the count visible.

### 2.13 Smaller things that look unfinished

| Where | What | Fix |
|---|---|---|
| S3.02 (act 1:25.67, TC 13:56:16) and S4.14 (act 4:44.33, TC 17:15:08) | Neleh's pen is a floating orange pencil with no hand. The shot list says "pen hand = clickHand (MARKED)", but no hand is drawn, and the ledger doesn't flag it. | Draw her hand or cuff entering from the frame edge, and flag both `standin: true` so the margin marks them until then. |
| S4.13d (act 4:33.92, TC 17:04:22, 7.4 s) | A flat composition: a black wall screen filling half the frame with Alyi's reflection in it, a grey panel, and Neleh pasted at the right. It's almost still (Alyi's look is a small head change). "Her pen stops", but she holds a glowing page, not a pen. A newcomer may not know the face in the screen is Alyi. | A slow whole-pixel push on Neleh across the statement's second sentence. Make Alyi's turn a clear 2–3 drawing head turn. Give her a pen that visibly stops. |
| S3.03 (act 1:28.25, TC 13:59:06, 15.5 s) | The blog page is static except the cursor while an unseen Neleh reads it (8% of frames with more than 20 px change). Both sentences are up from frame 1, so the audience reads ahead of her. | Run a highlight under the sentence she's reading, in step with her take, as S5.06 does with its quotes. Or put the speaking ring on her corner tile. |
| S7.01 (act 6:30.67, TC 19:01:16) | The three hearts are 3–4 px red specks, and Alyi's next line counts them ("You sent three."). | Draw them at icon size (about 7×6). |
| S1.09 (act 0:39.17, TC 13:10:04) and S1.07 | The `MAS MANALT` dialog's left border runs off the frame edge, so the box looks cropped. | Shift it 6–8 px right in v5's S1.09 (already a v5 layout). |
| Every toast (S1.09, S2.05, S3.01, S6.03–S6.06) | The toast icon is a 3×6 px door outline. At 1× it looks like a missing-glyph box, and "rewinding…" isn't a door. | A filled door with an exit arrow, and a different icon for "rewinding…". |
| S3.05 (act 2:20.58, TC 14:51:14) | The keycap rain reads as dead pixels: grey 4×3 squares resting over the tiles, one on "THE QUIET VOTE". | Fewer, bigger caps with a dark lower edge that fall out of frame rather than rest. |
| S8.01, S8.03 (act 7:57.21–8:03.50) | Mas stands in front of the A of the `NOPE AI` sign, so it reads `NOPE I`. | If it isn't a planned gag, move him about 20 px. |
| S7.07-cont → S7.08 → S7.09 | Mas is teal-lit in the two-shot, warm-lit in his MCU (v3 30.14's recipe), then teal again. | A palette step toward the two-shot's key in S7.08's override (§2.6). |
| S8.09 (act 8:28.75, TC 20:59:18) | The "hand and screwdriver" is a brown block and a purple bar (flagged stand-in). | A hand with the `inserts-hands` capsule fingers and a visible screwdriver shaft. |
| S1.04 | The zeros detail is a 2× blow-up next to 1× text, which PIXEL_GUIDE §4 says to avoid ("never scale a sprite"). Inherited from v4. | Redraw at 1× when the S1 blueprint is next touched. |
| Mas's hands: S1.02, S1.06, S1.11, S2.01–S2.04, S5.03 | Pale teal with joint stripes on every finger, so at 1× they read as a mannequin's or a robot's (S8.05's warm hand reads human). Taste, and inherited. | Fewer joint lines, and skin under the cyan key. |

---

## 3. Every shot at 480×270

From the stills I looked at, **68 of the 83 shots read at 1×**: who, where and what happens. The 15 below don't, or read only in part:

| Shot | Act | Reads? | Why |
|---|---|---|---|
| S1.04 | 0:17.75 | in part | `(HE TOLD THE SENATE)` (§2.8) |
| S2.02, S2.03, S2.04 | 0:53.21–1:00.50 | in part | The marks (§2.12). The F1.2 front in S2.03 reads |
| S3.00a, S3.04, S3.05 | 1:03.00, 1:43.75, 2:20.58 | in part | Alyi's face in his tile (§2.9). Neleh, Mada and Rima read |
| S4.08 | 3:12.46 | in part | Room-scale mouths at 30–60 px figures (§2.10). The panes, plates and caller IDs read |
| S4.13d | 4:33.92 | weak | §2.13 |
| S4.13e | 4:41.33 | in part | The sign reads; Tasya's look breaks continuity (§2.5) |
| S5.06 | 5:17.08 | no, at the turn | §2.1 |
| S7.01 | 6:30.67 | in part | The hearts (§2.13) |
| S7.02 | 6:49.00 | weak | §2.4 |
| S7.07b | 7:25.92 | in part | The Other Yrral is a dark silhouette on a dark wall; the nameplate carries it, which may be the intent |
| S8.03 | 8:00.50 | broken | §2.2 |

The other 68 read cleanly in my judgment. They include the blueprint sheet with its callout, the Cancel click (the arrow lands on Cancel, which is lit before the click), both screens, the freeze card, the split's plates, the hourglass from above, the observer chair and its label.

---

## 4. Coverage and screen direction

**Coverage holds.**
- Of the 14 conversations, every one longer than 10 s plays in one to three held setups:
  - S3.00a: 4 lines in one over-the-shoulder
  - S3.04: 7 lines
  - S4.08: 5 lines in one split
  - S4.10b: 5 lines
  - S5.06: 7 lines
  - S7.01: 5 lines in the box
  - S7.07-cont: 6 lines
- The only run of one line per shot is S7.02 → S7.02b → S7.03, and each cut there is a real turn.
- Four lines cross a cut, all by design: `a5-27-06`, `a5-27-45` (twice), `a5-30-10`, `a5-31-04`.
- Six voiced lines start 7 frames after a cut, which is the lock's lead-in, and no voiced line starts earlier. Two silent posts start 4 and 7 frames in.

**Screen direction.**
- **Consistent:**
  - S3.06 → S3.07: the employee left, Alyi at the right looking left.
  - S4.02 → S4.04 → S4.06 → S4.07.
  - S4.08's two panes.
  - S5.04 → S5.05: Mas looks right to the Orb.
  - S5.11 → S5.12: the door stays right.
  - S7.01's two boxes face each other.
  - S7.05 → S7.06 → S7.07 → S7.08: Mas stays left of Mada.
  - S8.07.
- **Broken:** S4.10 → S4.10b → S4.12 (§2.3) and S7.02 → S7.02b/S7.03 (§2.4).
- **Low confidence, for a person:** in S4.13 Tasya looks screen-left from the door. In S4.13c, the reverse from the table's head, he stands left of Ttemme and faces him. That's acceptable if the audience reads S4.13 as him addressing the whole board.

---

## 5. Stand-ins and stick fallbacks, with timecodes

| Shot | Act | TC | Stand-in | Flagged in the ledger? |
|---|---|---|---|---|
| S3.02 | 1:25.67 | 13:56:16 | Her pen hand (v4's MARKED clickHand) renders as a floating pencil | **no** |
| S4.13e | 4:41.33 | 17:12:08 | v4's slate `tasyaSpeakPortrait` (the fixed portrait isn't used) and the sign as a floating card | **no** |
| S4.14 | 4:44.33 | 17:15:08 | As S3.02 | **no** |
| S5.01 | 4:49.29 | 17:20:07 | `kit.cards` chapter card (plain cream type on black) | yes |
| S7.06 | 7:07.42 | 19:38:10 | Inherited v4 flag; the layout note doesn't say which element, and nothing in the shot looked broken to me | yes |
| S8.01 | 7:57.21 | 20:28:05 | The v3 crop stands in for a true low angle (ROOM-LOBBY-LOW, P4) | yes |
| S8.05 | 8:05.25 | 20:36:06 | The suite's nudge insert, recoloured to the lobby's stone | yes |
| S8.09 | 8:28.75 | 20:59:18 | The hand and screwdriver (§2.13) | yes |
| S8.10 | 8:34.25 | 21:05:06 | The drawn folding chair, 4 held drawings | yes |

- **GLYPH frames** (S1.09, act 0:41.58 on, 28 frames): spliced from the Remotion host in both films. The log shows `spliced 28 / 28`, no marks. A Node-only render would draw v4's 2 px marks there; this film doesn't.
- **Stick fallbacks: none.**
  - `act4-animatic-v5.mp4.render.json` has `failed {}` and `marked []` in both segments.
  - The ledger has a layout for all 83 shots.
  - The lip-sync pass's `test5 all` drew 0 fallback frames.
  - None of the ~310 frames I looked at shows stick figures.

---

## 6. Text read time: the full list under the floor

The floor is 0.25 s + 0.05 s a character (flow-and-continuity §2, a sanity check, not a gate). All 12 were kept by the lock as the approved stick timing.

| Ratio | Shot | Text | Up / floor | Verdict |
|---|---|---|---|---|
| 0.47 | S1.03 | `NOPEAI · THE COMPANY` | 0.58 / 1.25 | Types on over the tilt; her line says it. Fine |
| 0.52 | S6.04 | `NELEH left the call` | 0.62 / 1.20 | Stays in the toast stack through S6.06 (5.75 s). Fine |
| 0.55 | S5.03 | `"NopeAI is nothing without its people" ×2 ×4 ×16 …` | 1.62 / 2.95 | Rima's post text is on the phone from k4. Fine |
| 0.63 | S1.07 | `MAS MANALT · OK · Cancel` | 0.92 / 1.45 | Carries into S1.09 (2.38 s). Fine |
| 0.65 | S6.03 | `ALYI left the call` | 0.75 / 1.15 | Carries into S6.04 and S6.06. Fine |
| 0.67 | S3.00a | `Waiting for MAS MANALT to join…` | 1.21 / 1.80 | Familiar UI. Fine |
| 0.90 | S5.08 | `VOID IF CEO MISSING` | 1.08 / 1.20 | **§2.8** |
| 0.91 | S3.02 | `4. ______________` | 1.00 / 1.10 | A blank line. Fine |
| 0.91 | S1.09 | `You've been removed from the meeting.` | 1.92 / 2.10 | Large type, familiar phrase, under D6's silence. Fine in the GLYPH cut; see §7 for J1 |
| 0.94 | S6.06 | `MADA · LAST FIRER STANDING` | 1.46 / 1.55 | **§2.8** |
| 0.94 | S1.11 | `[super]  [super]  [super]` | 1.42 / 1.50 | His thumb covers two of them, so one reads. Fine |
| 0.95 | S4.13 | `TASYA · THE LANDLORD · …` | 3.12 / 3.30 | **§2.8** |

Not in the list but worse: `ALYI (REPORTED)` in S5.06 is never on screen (§2.1).

---

## 7. The Cancel comparison clip (`act4-v5-cancel-compare.mp4`): picture notes for the J1 ruling

I looked at both passes frame by frame around the click: pass A (GLYPH) at clip frames 240–295 and pass B (J1) at 664–730, at 1×.

- **J1 drops the in-world notice.**
  - J1 owns act frames 998–1056. S1.09 ends 58 frames after the click, so the host's `You've been removed from the meeting.` never appears in the J1 pass.
  - The picture goes from the snapped four (no toast) straight to S1.10.
  - That notice is the v4.1 pass's in-world fact at the click (flow-and-continuity, v4.1 notes; must-understand #3). The v4.2 fresh newcomer also read the click as OK until the arrow landed on Cancel.
  - If J1 is chosen, carry the toast into J1's snap (t 45–59), or accept that the certificate's `CANCELLED` does its job.
- **J1 covers S1.10's first 2 frames**, so the one-pixel smile starts 2 f late. That's the known 2 f.
- **J1's certificate is a real style leap:** an engraved banknote bust, `THIS CERTIFIES THAT MAS MANALT HOLDS ____ SHARES`, then `CANCELLED` punched through. The blank shares call back to `EQUITY: 0`, which an insider will enjoy. Its punch sound isn't in the mix.
- **GLYPH's falling tile crosses the toast.** For about 10 frames (act ≈1014–1026) the dropped tile's empty grey outline slides down over Mada's tile and across the notice. At 1× it can read as a UI glitch rather than a tile falling. Consider taking the falling outline under the toast, or clearing it before the toast lands.
- **The slates' small lines don't read in 1 s.** The title line does. Fine for an internal clip.

---

## 8. Measured versus needs a person

| Measured here | Needs a person |
|---|---|
| All 82 cuts on the lock frame; audio 0 samples at 6 onsets (§1) | The flow at speed, above all the three long holds: S4.08 (28 s), S5.06 (23 s), S3.03 (15.5 s) |
| Mouth motion is on the speaker's face and leads the take by one frame in 38 of 46 pairs; face boxes confirm the other 8; listeners stay shut (§1) | Whether the room-scale mouths read as speech in motion (§2.10), and whether Gerg's bob reads as jitter (§2.11) |
| The frozen S7.02, the stills in S5.08 and S7.01 (§1) | Whether S4.13d and S3.03 feel dead (§2.13) |
| Which text is up under its floor; the missing ALYI row (§2.1, §6) | A newcomer's read of S5.06 as rendered, and of Alyi's navy tile (§2.9) |
| The doubled Mas, the plate, the fire, Tasya's skin, the line crosses (seen on stills) | The J1 ruling (§7) |

---

## 9. How to re-run (scratch tools; copy them to keep them)

These tools are in `scratchpad/a4p5-picaudit/` in this session's scratch, and they may not last. From the repo root, `S=` that folder:

```sh
# one gentle decode of the picture film at native 480x270: key frames (first/mid/last of every shot, every 12th frame,
# every line's middle, every text's start), per-frame packed change masks (masks.npy, 200 MB) -- about 40 s, one thread
ops/heavy.sh audio/.venv-mix/bin/python $S/decode.py
nice audio/.venv-mix/bin/python $S/sheets.py sheets lip   # 28 contact sheets at 1x (sheets/), change maps (lip/)
nice audio/.venv-mix/bin/python $S/lip2.py                 # every faced pair: hot spot, lag, hit rate (lip/lip2.json, loc-*.png)
nice audio/.venv-mix/bin/python $S/roi.py S5.09-back 220 110 250 135   # a face box against who is talking
nice audio/.venv-mix/bin/python $S/strip.py out.png 8391 16 2 195 90 90 62 3 4   # consecutive frames, cropped, scaled
FILM=out/ep01/act4/animatic/act4-v5-cancel-compare.mp4 nice audio/.venv-mix/bin/python $S/strip.py j1.png 664 12 6 0 0 480 270 1 3
nice audio/.venv-mix/bin/python $S/pick.py sheet.png S5.06@8150 S8.03@11560     # chosen act frames at 1x
# the S5.06 scroll replay (§2.1)
cd studio && npx esbuild $S/letter.ts --bundle --platform=node --outfile=$S/letter.cjs && node $S/letter.cjs
```

**After fixes, re-check:**
- §2.1: a still of S5.06 at k500 and at its last frame.
- §2.2: a still of S8.03.
- §2.3 and §2.4: S4.10, S4.10b and S4.12 side by side, and S7.02 with its singles.
- §2.5: S4.13 next to S4.13e.
- §2.6: S7.07 k100, S7.08 and S7.09 k0.
- `roi.py` on S5.09-back for §2.11.
- `render5.ts check`, then a re-render, before the report.
