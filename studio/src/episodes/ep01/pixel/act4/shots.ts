// MR. MAS — Ep1 v3.4 · ACT FOUR, "five days, told twice", on the v3.4 stick lock (the v3-shots-act4 pass; the v3 round,
// the v3.1 round, 2026-09-27, the v3.2 round, the v3.3 polish and the v3.4 round, 2026-09-28).
//
// A PORT with the v3.1 and v3.2 re-cuts drawn in. Act Four v5's layouts (act4/animatic/shots5.ts DRAW5, through its own
// drawShot5, as the pipeline's act4-v5 test runs them) draw every shot v3.x kept as it was, handed this lock's shots
// (./data.ts: tools/lock.py on show/reel/ep01-v32/ep01-v32-act4.json, lock_v5.py's plan tables and the re-anchors in
// ./plan.json; the cut takes' mouths from ./cut_mouths.py). What v3 / v3.1 / v3.2 changed is drawn here (kind 'V' in the
// margin); the rest is kind 'P' (the v5 layout, its v5 verdict R/C/N kept in `st`). Nothing in act4/animatic, act4-v5
// or shared/pixel is edited: the new art is the v3-art-b pass's kits/act4-v31.ts and kits/act4-v32.ts, the face lights
// (kits/face-light.ts), and this pass's additive opt-in states in ./art/ (race.ts, invite.ts, texts.ts, v31.ts, v32.ts).
// A layout below that changes a v5 layout is a copy of it with the change (each says so).
//
// v3.4 (script draft 8.3; SHOWRUNNER-NOTES 000, the planner, never on the nose): S1.02's new V.O. (his confident read of
//   the invite: the arrow on the page on "budget", settled by JOIN on "good."); S4.02 without Alyi's line (no glass
//   cutaway: the whole row of phones lights up at once in the wide on the lock's phone_buzz_step_1 and holds); S8.04 the
//   return's count struck into the firing's drawing (art/v34 drawCount: their VOTES and EQUITY: 0 pencilled, his key,
//   ticker and Gerg's badge in his cyan, each on its word). S5.09's new V.O. plays over the ring (no change).
// v3.3's polish (PLAN.md §6, script draft 8.2): P12 the boardroom wide pushes in during Neleh's second speech as the
//   stepped push (the wide drifting, [M] on her first word, her [MCU] on "Monday", the wide again for the phone's fall,
//   the glass with the row of phones lighting up on Alyi's line); P13 the lobby dated once, by the camera's plate; S2 /
//   P15 Rima's label flips back to CTO as the spot leaves her (S4.10) and Ttemme's page has a blank back (S4.10b, "Okay."
//   cut); P16 the heart count ticks visibly; S3 "Down here." cut (S7.03 is v5's again); S4 / S5 / P17 the employee
//   speaks among the boxes and Tasya's interview plays on the bullpen's wall TV at a podcast mic (S7.02, S7.02b); P18
//   the face light in Alyi's reflection and on the new MCU. Everything else is v3.2's; the shock opening is unchanged.
// v3.2's Act Four (script draft 8.1, script-v32-notes.md §3.4, §4, §10; agency-v32.md; the lead's brief): HIS MOVES
//   read on screen: after "super." he picks up his phone (S1.12) and writes his own post, 1:46 PM, before the room falls
//   to night (v32-S1.13); inside the board's side, the lobby is his, in full colour at his shoulder: the GUEST lanyard
//   slid across, he puts it on himself, the selfie's one white step, his post, his look up at the corner camera, and the
//   picture steps out into that camera's grade (v32-S5.00) and onto their wall screen (S4.09, the post card gone from
//   the CCTV tile); at 2 AM the MACROSOFT badge slides under the door, his hand takes it, and the two badges sit on the
//   desk, square (S5.11). Also: the blog post types itself while Neleh's lips move, silent (S3.03, the read is cut);
//   Rima's tile label INTERIM CEO (S3.04); Alyi's reflection turning to the phones (S4.02); the first-appearance plate
//   with one relation word (S4.08 ADELINA · CO-FOUNDER); the app's heart count 406 -> 407 -> 406 (S5.03). The shock
//   opening is v3.1's, unchanged; the Runway hourglass splice stays at S7.13 k128-263.
// v3.1's Act Four (script draft 7, script-v31-notes.md §3.1–3.4, §4; the lead's brief): his side opens on the shock:
//   the suite's ordinary life (S1.01, v31-S1.01b) → JOIN, one beat with the V.O. and the click (S1.02) → the call, and
//   ALYI's first sentence heard on camera in his tile, lip-synced; on "company." the Wi-Fi drops and the board's tiles
//   freeze (S1.07) → a HARD CUT, bright: the host's Remove dialog, ALYI's arrow clicks it on the downbeat (v31-S1.08d) →
//   the drop in the one silence (S1.09) → the buzz, "super." (S1.11, S1.12). THE PLAN moves to the board's side: the
//   rewind lands on Neleh's desk at 11:52 (v31-S3.00p), the push into her paper, THE PLAN with GERG / CHAIR and her
//   figure stepping out of her own chair (S1.03), the pull-back to her desk (S1.05). The same Remove from their side is
//   the lock's notice (S3.01). Also: Alyi's reflection cutaway (S4.02), Sunday's phones and ticker (S4.09), Ttemme's
//   card (S4.10), the call out to Gerg (S5.09), the letter's header tile (S6.01), Tuesday's invite (v31-S7.03b), Terb's
//   dry squeeze (S7.06) and his writing (S7.07-cont), the lobby's greyed Remove (S8.03), the Runway hourglass insert at
//   S7.13 k128-263 (browser / PNG frames: `hourglass`), and the face lights on the non-joke close-ups (mood §4 #4).
// Kept from the v3 round: no side badges, no WHAT THEY DIDN'T KNOW card, the GLYPH dissolve on his tile's drop (S1.09;
// J1 off), race weekend on the Strip, the JOIN screen's four attendees, MACROSOFT · BILLIONS IN and EQUITY: 0 alone,
// C13's phone falling, C14's split, the letter's ALYI, and Mas's inner voice never moving his mouth.
import {Buf, rect, bayer, hash} from '../../../../shared/pixel/px';
import {text, textWidth} from '../../../../shared/pixel/font';
import {PAL, stepColor, familyOf} from '../../../../shared/pixel/palette';
import type {GlyphLayer} from '../../../../shared/pixel/glyph';
import type {Viseme} from '../../../../shared/pixel/cast/talk';
import {blitImg} from '../../../../shared/pixel/figure';
import {
  callChrome, drawTile, captureTile, tileDrop, slideTiles, tilePlate, dropY, noticeIcon, pointerAt, gridLayout, CALL_BAR_H,
} from '../../../../shared/pixel/kits/callgrid';
import {drawStaffLetter, LETTER_SCROLL_MAX, letterLayout} from '../../../../shared/pixel/kits/staff-letter';
import {drawChatPanel} from '../../../../shared/pixel/kits/chat-panel';
import {badgesOnDeskRoom, BADGES_ROOM_AT, macrosoftBadge} from '../../../../shared/pixel/kits/macrosoft-badge';
import {drawLobbyFeed, FEED_W, FEED_H} from '../../../../shared/pixel/kits/lobby-feed';
import type {LobbyFeedPhase} from '../../../../shared/pixel/kits/lobby-feed';
import {drawGergMediumPOV} from '../../../../shared/pixel/cast/gerg-medium';
import {bpNeleh, inkOver, sweep, bpBracket} from '../../../../shared/pixel/kits/bp-pointer';
import type {BpNelehPose} from '../../../../shared/pixel/kits/bp-pointer';
import {faceKey} from '../../../../shared/pixel/kits/face-light';
import {
  drawRemoveDialog, removeButton, drawNelehDeskHigh, drawTuesdayInvite, drawSundayOTS, callOutPainter, drawDrySqueeze, drawTerbWriting,
} from '../../../../shared/pixel/kits/act4-v31';
import {drawSuitePhone, POST_LOVED, drawReceptionMCU, drawLobbyCCTVStep, drawBadgeUnderDoor, drawBadgeReach2S} from '../../../../shared/pixel/kits/act4-v32';
import {drawBlogDraft} from '../../../../shared/pixel/kits/blog-draft';
import {drawBoardCall} from '../../../../shared/pixel/kits/call-boardside';
import {drawNelehDeskOTS, drawNelehBezel, NDESK} from '../../../../shared/pixel/rooms/neleh-desk';
import {drawLighthouse} from '../../../../shared/pixel/rooms/lighthouse';
import {drawLaptopInsert, LAPTOP_INSERT} from '../../../../shared/pixel/rooms/vegas-suite';
import {BR, drawBoardroom, FIRES_SC30} from '../../../../shared/pixel/rooms/boardroom';
import {drawBoardPlate, drawBoardPlateTable, drawBoardPlateFront, BPLATE} from '../../../../shared/pixel/rooms/boardroom-plate';
import type {BoardPlateOpts} from '../../../../shared/pixel/rooms/boardroom-plate';
import {drawDarkPlate, drawDarkPlateDesk, drawDarkPlateFront, DPLATE, DPLATE_LOOK} from '../../../../shared/pixel/rooms/darkroom-plate';
import type {DarkPlateOpts} from '../../../../shared/pixel/rooms/darkroom-plate';
import {drawSlateDoorOpen, slateDoorSign, SLATE_GAP, keyTurnAt} from '../../../../shared/pixel/rooms/slate-desks';
import {drawBullpen} from '../../../../shared/pixel/rooms/bullpen';
import {drawBoardHead2S, BHEAD} from '../../../../shared/pixel/rooms/boardroom-head';
import {TTEMME_M_FOLDER} from '../../../../shared/pixel/cast/ttemme-medium';
import type {FolderState} from '../../../../shared/pixel/kits/folder';
import {drawCalmOffTerms2S} from '../../../../shared/pixel/rooms/calmoff-terms';
import {drawCalmOff2S, FIRES_CALMOFF, drawDark2S, drawBoard2S} from '../../../../shared/pixel/rooms/twoshots';
import {alyiReflection} from '../../../../shared/pixel/cast/alyi-speak';
import {marioImg, MARIO_BASE, MARIO_FOOT} from '../../../../shared/pixel/cast/mario';
import type {MarioArm} from '../../../../shared/pixel/cast/mario';
import {drawAdelinaRoom, ADELINA_ROOM_DEFAULT} from '../../../../shared/pixel/cast/adelina';
import type {AdelinaArm} from '../../../../shared/pixel/cast/adelina';
import {tasyaPhonePortrait} from '../../../../shared/pixel/cast/tasya-phone';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../shared/pixel/cast/mas';
import {nelehPortrait, NELEH_PORTRAIT_DEFAULT} from '../../../../shared/pixel/cast/neleh';
import type {MasPortraitState} from '../../../../shared/pixel/cast/mas';
import {drawTerbRoom, TERB_ROOM_DEFAULT, terbWalkAt} from '../../../../shared/pixel/cast/terb';
import {drawMasStand, MAS_STAND_DEFAULT, masWalkAt} from '../../../../shared/pixel/cast/mas-stand';
import {drawMadaSeated, MADA_SEAT_DEFAULT} from '../../../../shared/pixel/cast/mada';
import {shakeAt, SHAKE_DOOR} from '../../../../shared/pixel/sprite';
import {defineSegment, layouts as registry, mouth, roomMouth, room3Mouth, lipOn, talking, held, on2, mk, RH, pt, pw, bpt, bpw, soft, softMask, keepRect, vignette, rackStep, RACK, drift, shiftRoom, doorFrame, ACCENT} from '../kit';
import type {Layout, PxShot} from '../kit';
import {drawBust, MCU_X, mcuRoom, shoulder} from '../../act4/animatic/framing';
import {putUI, blipCard, freezePrint} from '../../act4/animatic/lay';
import {G5, G4, ui, board4, masTileState, sui} from '../../act4/animatic/shots';
import {boardRoom, bullpenRoom, doorShake, lobbyRoom} from '../../act4/animatic/backs';
import {drawPlan4, PLAN4} from '../../act4/animatic/plan4';
import {DRAW5, drawShot5, factsText5, OPT5} from '../../act4/animatic/shots5';
import type {ShotV5} from '../../act4/animatic/data-v5';
import type {ShotV4} from '../../act4/animatic/data-v4';
import {LOCK} from './data';
import {drawSuiteRace} from './art/race';
import {drawNudgeJoinInvite, CORNER_ARROW, cornerTileTip} from './art/invite';
import {planZerosV3, letterAlyiV3, plateRel} from './art/texts';
import {phonePickup, blogTyped, blogSpeakerWindow, rimaTileLabel, heartCount, BLOG_CHARS} from './art/v32';
import {drawBlankPage, drawEmployee, EMPLOYEE, drawWallTV, recolourCrowd, drawEmployeeM, drawTVInsert} from './art/v33';
import {drawCount} from './art/v34';
import {drawWindowTwoShot, wifiBars, planChairV3, firstTileStrip, alyiTileLit} from './art/v31';

const L = registry();
const len = (sh: PxShot) => sh.e - sh.s;
const blink = (k: number, seed: number): 0 | 1 | 2 => { const p = (k + seed * 37) % 97; return p === 0 || p === 2 ? 1 : p === 1 ? 2 : 0; };
const lineOf = (sh: PxShot, id: string) => sh.lines.find((l) => l.id === id) ?? null;
const textOf = (sh: PxShot, kind: string, sub = '') => sh.texts.find((t) => t.kind === kind && t.text.includes(sub)) ?? null;
const shotOf = (id: string) => LOCK.shots.find((x) => x.id === id) as PxShot;
/** a v5 layout on this shot (drawShot5: v5's footnote and toast styles, its own stick fallback if it throws) */
const v5 = (fb: Buf, k: number, sh: PxShot, f: number) => drawShot5(fb, k, sh as unknown as ShotV5, f);
const V = (id: string, what: string) => `V3 · ${what}${DRAW5[id] ? ` · over v5 ${DRAW5[id].kind}: ${DRAW5[id].st}` : ''}`;
const V31 = (what: string) => `V3.1 · ${what}`;
/** the band's V.O. rows (182-203) on shadow (mas-inner-voice §9): the frame's foot steps down 1-3 rungs, dithered in
 *  from row 176, over x < x1 (the typed line's reach) with a dithered edge; a cinematic foot vignette, never a box */
const voShade = (fb: Buf, x1 = 300) => {
  for (let y = 176; y < RH; y++) {
    const kk = y < 184 ? 1 : y < 192 ? 2 : 3;
    for (let x = 0; x < Math.min(480, x1 + 24); x++) {
      const t = y < 184 ? (y - 175) / 9 : 1, e = x < x1 ? 1 : 1 - (x - x1) / 24;
      if (bayer(x, y) < t * e) fb.c[y * 480 + x] = stepColor(fb.c[y * 480 + x], -kk);
    }
  }
};
/** a bayer dissolve between two drawings (t 0..1): pixel-pure, a held step a frame */
const dither = (fb: Buf, a: Buf, b: Buf, t: number) => { for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) fb.c[y * 480 + x] = bayer(x, y) < t ? b.c[y * 480 + x] : a.c[y * 480 + x]; };
/** the face light (mood §4 #4; kits/face-light faceKey): skin in the rect k rungs up, the lit edge one more; nothing
 *  else in the frame changes. `r` = the bust's head region */
const faceLight = (fb: Buf, r: [number, number, number, number], k: number, side: -1 | 1) => faceKey(fb, r[0], r[1], r[2], r[3], k, side);
/** the MCU busts' head regions (framing drawBust: MCU_X, y 22) */
const HEAD_L: [number, number, number, number] = [MCU_X.L - 6, 14, MCU_X.L + 128, 124], HEAD_R: [number, number, number, number] = [MCU_X.R - 6, 14, MCU_X.R + 132, 124];

// ================================================================== S1 · NOON, LAS VEGAS: his side, the shock
L.add('S1.01', {kind: 'V', st: V('S1.01', 'the suite wide (backs suiteRoom: v2 24.01\'s truck and shiver) + art/race suiteRaceDressing: race weekend on the Strip (lamp-post banners, pennants and flags on the grandstand, barrier wraps; generic, no lettering), fluttering on 10s; the drift now spans the arrival, 1 px / 11 f (12 px)'),
  draw: (fb, k) => {
    drawSuiteRace(fb, k, {truckX: 236 + Math.floor(k / 2), shiverT0: 18});
    shiftRoom(fb, drift(k, 11, 12));
  }});
L.add('v31-S1.01b', {kind: 'V', st: V31('[2S] Mas and the Orb at the suite\'s window, a practice lap below (art/v31 drawWindowTwoShot: the suite\'s own back layer, race-dressed, one step soft; a generic race car on the near straight, whole px; MAS\'s bust turned to the Orb; the Orb\'s iris on the car, holding where it lost it, snapping back when it finds the next pass); he blinks'),
  draw: (fb, k) => { drawWindowTwoShot(fb, k, {lid: blink(k + 30, 7)}); }});
// ---- S1.02: the nudge, the JOIN corner, his read (v3-vo-18) and the click, one beat (S1.06 folds in)
const glideC = (k: number, k0: number, n: number, a: [number, number], b: [number, number]): [number, number] => {
  const t = Math.max(0, Math.min(1, (on2(k) - k0) / Math.max(1, n)));
  return [Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t)];
};
L.add('S1.02', {kind: 'V', st: V31('the nudge ECU with the JOIN corner (art/invite drawNudgeJoinInvite: the call app\'s four board tiles carry the invite\'s attendee circles, a door, a glowing page, a spinner, a black square; none green; his slot empty): he nudges the glass true and his hand leaves; the laptop pings (JOIN\'s halo, 2 held steps); on "gerg\'s" the laptop\'s arrow steps across the four icons (each tile lit as it passes), v3.4 (v34-vo-07, his confident read and his plan for the meeting): on "budget" it settles on the glowing page, on "good." it comes back beside JOIN and waits there through "i\'ll ask for more compute."; onto JOIN and the click on its sound; the V.O. rows on shadow, no face in frame'),
  marks: {look: ['w', 'v34-vo-07', 'gerg', 0], door: ['w', 'v34-vo-07', 'budget', 0], back: ['w', 'v34-vo-07', 'good', 0], click: ['snd', 'dialog_ok_click', 1, 0]},
  draw: (fb, k, sh) => {
    const nudge = mk(sh, 'nudge', 10), o1 = mk(sh, 'out1', 24), o2 = mk(sh, 'out2', 32), ping = o2 + 4;
    const look = mk(sh, 'look', 30), door = mk(sh, 'door', 70), back = mk(sh, 'back', 108), c = mk(sh, 'click', 162);
    const step = k < nudge ? 'set' : k < o1 ? 'nudge' : k < o2 ? 'out1' : 'out2';
    const glow = (k >= ping && k < ping + 2 ? 1 : k >= ping + 2 && k < ping + 6 ? 2 : k >= ping + 6 && k < ping + 8 ? 1 : 0) as 0 | 1 | 2;
    let p: [number, number] = CORNER_ARROW.beside, hover = -1;
    if (k >= look && k < door) {
      const kk = k - look, i = Math.min(3, Math.floor(kk / 8));
      p = i === 0 && kk < 4 ? glideC(k, look, 4, CORNER_ARROW.beside, cornerTileTip(0)) : kk >= i * 8 && kk < i * 8 + 4 ? glideC(k, look + i * 8, 4, cornerTileTip(i - 1), cornerTileTip(i)) : cornerTileTip(i);
      hover = i;
    } else if (k >= door && k < back) { p = glideC(k, door, 6, cornerTileTip(3), cornerTileTip(1)); hover = k >= door + 6 ? 1 : -1; } // v3.4: "the budget": the glowing page
    else if (k >= back && k < c - 8) p = glideC(k, back, 8, cornerTileTip(1), CORNER_ARROW.beside);
    else if (k >= c - 8) p = glideC(k, c - 8, 4, CORNER_ARROW.beside, CORNER_ARROW.on);
    drawNudgeJoinInvite(fb, step === 'out2' && k >= o2 + 6 ? 'gone' : step, k, {arrow: p, hover, glow, click: k >= c && k < c + 3});
    voShade(fb, 290);
  }});
// ---- S1.07: the call; ALYI's first sentence heard, on camera, in his tile; on "company." the feed freezes
const IDS5 = [{id: 'mas', name: 'MAS MANALT'}, {id: 'alyi', name: 'ALYI'}, {id: 'neleh', name: 'NELEH'}, {id: 'mada', name: 'MADA'}, {id: 'off', name: undefined}];
/** the segment frame the board's tiles froze on (S1.07's `freeze`): S1.09 keeps them there */
const FREEZE_F = (() => { const s = shotOf('S1.07'); return s.s + (s.marks.freeze ?? 150); })();
/** his mouth on the frozen frame (S1.07's `freeze`, the lock's face for his line there) */
const FROZEN_MOUTH = (() => { const s = shotOf('S1.07'); return mouth(s, s.marks.freeze ?? 150, 'ALYI'); })();
L.add('S1.07', {kind: 'V', st: V31('v5 S1.07 copied without the NELEH card or the Cancel dialog: the call\'s five tiles open with their own name labels; ALYI\'s tile takes the speaking ring and his first sentence (v31-a4-0001) on camera, lip-synced (art/v31 alyiTileLit: the board side\'s lit doorway drawing with its viseme mouth; v5\'s his-side reflection hid the mouth under the glass\'s bar); on "company." the four board tiles freeze (callgrid frozenAt, his mouth mid-word) and the hotel Wi-Fi drops 3 -> 2 -> 1 bars; his own tile stays live (STYLE-1G-NEON)'),
  face: {ALYI: 'lip'},
  draw: (fb, k, sh, f) => {
    const b = ui();
    const fz = mk(sh, 'freeze', 150), fzF = sh.s + fz;
    callChrome(b, {title: 'board sync', clock: null, controls: false});
    const talk = talking(sh, k, 'ALYI') && k < fz;
    IDS5.forEach((t, i) => {
      const r = G5[i];
      if (t.id === 'mas') { drawTile(b, {...masTileState(k < 14 ? k - 2 : undefined), ...r, neonGuard: OPT5.neonGuard}, f); return; }
      if (t.id === 'alyi') { alyiTileLit(b, r, f, {mouth: mouth(sh, Math.min(k, fz), 'ALYI'), speaking: talk, open: k < 14 ? k - i * 2 : undefined, frozenAt: k >= fz ? fzF : undefined}); return; }
      drawTile(b, {...r, id: t.id, name: t.name, vote: 3, muted: t.id === 'off' ? true : undefined, open: k < 14 ? k - i * 2 : undefined,
        frozenAt: k >= fz ? fzF : undefined}, f);
    });
    wifiBars(b, k < fz - 4 ? 3 : k < fz ? 2 : 1);
    putUI(fb, b, false);
  }});
// ---- v31-S1.08d: the HARD CUT, bright: the host's Remove dialog; ALYI's arrow clicks on the downbeat into D6
L.add('v31-S1.08d', {kind: 'V', st: V31('kits/act4-v31 drawRemoveDialog: the frame goes bright (the 1993 cream), the dialog opens in two held outline steps, Remove MAS MANALT / from the meeting? and one button, Remove; held to read; ALYI\'s arrow steps on, one held position every 4-6 f from his tag\'s time, and clicks on the dialog_ok_click (the one silence starts there); the pressed button held to the cut'),
  marks: {tag: ['txt', 'ALYI', 'at', 0], click: ['snd', 'dialog_ok_click', 1, 0]},
  draw: (fb, k, sh, f) => {
    const t0 = mk(sh, 'tag', 29), c = mk(sh, 'click', 45);
    const steps = [t0, t0 + 5, t0 + 10, c - 2];
    const idx = k < t0 ? null : steps.filter((t) => k >= t).length - 1;
    drawRemoveDialog(fb, f, {k, pointer: idx, tag: 'ALYI', click: k >= c});
  }});
// ---- S1.09: back on his laptop, in the silence: his tile drops and comes apart (the GLYPH dissolve); the four close up
const callNotice = (b: Buf, s: string, k: number, y = RH - 34) => {
  if (k < 0) return;
  const w = bpw(s) + 40, x = Math.round(240 - w / 2), rise = k < 3 ? [8, 4, 1][k] : 0;
  const yy = y + rise;
  rect(x, yy, w, 24, b.ink(PAL.N0)); rect(x + 1, yy + 1, w - 2, 22, b.ink(PAL.N3)); rect(x + 1, yy + 1, w - 2, 1, b.ink(PAL.N5));
  noticeIcon(b, x + 7, yy + 7, 'leave');
  bpt(b, s, x + 24, yy + 5, PAL.P2);
};
L.add('S1.09', {kind: 'V', st: V31('v5 S1.09\'s drop, copied, now after the Remove we saw (no dialog, no arrow): his tile falls out of the grid and comes apart (the masked GLYPH dissolve, its layers drawn by the host) and the four close the gap (G5 -> G4), still frozen where they froze in S1.07; the Wi-Fi at one bar; the notice'), glyph: true,
  draw: (fb, k, sh, f) => {
    const b = ui();
    const c = mk(sh, 'click', -2);
    const layers: GlyphLayer[] = [];
    const masT = {...masTileState(), neonGuard: OPT5.neonGuard};
    const kk = k - c;
    const rects = kk < 22 ? G5.slice(1) : slideTiles(G5.slice(1), G4, kk, 22, 8);
    callChrome(b, {title: 'board sync', clock: null, controls: false});
    const kd = kk - 2;
    if (kd >= 8) tilePlate(b, G5[0].x, G5[0].y + dropY(kd));
    board4(b, FREEZE_F, rects, {frozenAt: FREEZE_F});
    alyiTileLit(b, rects[0], FREEZE_F, {mouth: FROZEN_MOUTH, frozenAt: FREEZE_F}); // as S1.07 froze him, lit
    wifiBars(b, 1);
    const img = captureTile({...masT, open: undefined}, f - kk);
    layers.push(tileDrop(b, img, G5[0].x, G5[0].y, kd, {grey: true}));
    const n = textOf(sh, 'toast');
    if (n) callNotice(b, "You've been removed from the meeting.", k - n.s);
    putUI(fb, b, false);
    return {layers};
  }});
// ---- S1.12: "super." into the laptop, over his shoulder: the four frozen where S1.07 froze them; he picks up his phone
const LAP = LAPTOP_INSERT.screen, LW = LAP.x1 - LAP.x0 + 1, LH = LAP.y1 - LAP.y0 + 1;
const LG4 = gridLayout(4, {w: 150, h: 54, gap: 5, area: {x: 0, y: CALL_BAR_H, w: LW, h: LH - CALL_BAR_H}});
L.add('S1.12', {kind: 'V', st: V('S1.12', 'v3 26.09\'s [OTS] copied (his shoulder with the neon rim over rooms/vegas-suite drawLaptopInsert, the call G4 on its screen) with the four held frozen from S1.07\'s freeze and ALYI\'s tile lit as S1.07 froze him (art/v31 alyiTileLit); the aftermath\'s life: the Strip\'s neon breathing one step on his rim and in the window (held 12 f); v3.2: the fall to night moves to v32-S1.13, and after the 2.6 s hold he picks up his phone (art/v32 phonePickup: the phone on the desk, his hand from the silhouette, the screen waking, the lift toward him in held steps)'),
  marks: {pick: ['len', -22]},
  draw: (fb, k, sh, f) => {
    drawLaptopInsert(fb, {f: k, screen: (bb) => {
      const s2 = new Buf(LW, LH, PAL.N1);
      callChrome(s2, {title: 'board sync', clock: null, controls: false});
      board4(s2, FREEZE_F, LG4, {frozenAt: FREEZE_F});
      alyiTileLit(s2, LG4[0], FREEZE_F, {mouth: FROZEN_MOUTH, frozenAt: FREEZE_F});
      for (let y = 0; y < LH; y++) for (let x = 0; x < LW; x++) bb.set(LAP.x0 + x, LAP.y0 + y, s2.get(x, y));
    }, mic: true});
    blitImg(fb, shoulder(mas({head: '34'}), 70, PAL.R3, 1, true), -38, 30);
    const pick = mk(sh, 'pick', len(sh) - 22);
    phonePickup(fb, k >= pick ? k - pick : null);
    if (Math.floor((k + 6) / 12) % 2) for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
      if (x >= 90 && x < 440) continue; // his rim (left) and the window strip (right) only, never the frozen call
      const c = fb.c[y * 480 + x], fam = familyOf(c);
      if (fam && fam[0] === 'R' && fam[1] >= 1) fb.c[y * 480 + x] = stepColor(c, 1);
    }
  }});
// ---- v32-S1.13: his own post, 1:46 PM, then the room falls to night (moved from S1.12)
const V32 = (what: string) => `V3.2 · ${what}`;
const POST_LOVED_LEN = POST_LOVED.text.length;
L.add('v32-S1.13', {kind: 'V', st: V32('[ECU] kits/act4-v32 drawSuitePhone: his phone in his hand in the suite\'s afternoon light; his thumb types, unhurried, from the first key tap (two held thumb drawings on 3s, no suggestions): "i loved my time at nopeai. … will have more to say about what\'s next later." and the salute; on the post_click the post goes up in its own UI, 1:46 PM; then the room falls to night in three held palette steps (a rung down, dusk navy, night) while the screen stays lit'),
  marks: {type: ['snd', 'key_tap_soft_03', 1, 0], post: ['snd', 'post_click', 1, 0]},
  draw: (fb, k, sh, f) => {
    const t0 = mk(sh, 'type', 14), post = mk(sh, 'post', 86), n = len(sh);
    const chars = POST_LOVED_LEN;
    const typed = k < t0 ? 0 : Math.min(chars, Math.floor(((on2(k) - t0) * chars) / Math.max(1, post - 6 - t0)));
    const night = (k >= n - 6 ? 3 : k >= n - 14 ? 2 : k >= n - 22 ? 1 : 0) as 0 | 1 | 2 | 3;
    drawSuitePhone(fb, f, k < post ? {typed, thumb: (typed < chars ? Math.floor(k / 3) % 2 : 0) as 0 | 1, night} : {post: k - post, night});
  }});

// ================================================================== S2 · THAT NIGHT
// ---- S2.02: the Orb's eye-light steps onto mark 1, 2, 3 and stops on his thumb (S2.04 folds in; the TPOOL flash is cut)
L.add('S2.02', {kind: 'V', st: V31('v5 S2.02 then v5 S2.04, one framing (both are v4\'s marks ECU with its countable grooves): the eye-light on his thumb, then mark 1, mark 2, mark 3 = his thumb, the last step on the render_front_sweep'),
  marks: {sweep: ['snd', 'render_front_sweep', 1, 0]},
  draw: (fb, k, sh, f) => {
    const m3 = mk(sh, 'sweep', 34), m1 = Math.round(m3 * 0.35), m2 = Math.round(m3 * 0.7);
    if (k < m2) return v5(fb, k, {...sh, marks: {...sh.marks, mark1: m1}}, f);
    return drawShot5(fb, k, {...sh, id: 'S2.04', marks: {...sh.marks, mark3: m3}} as unknown as ShotV5, f);
  }});

// ================================================================== S3 · FRIDAY, THE BOARD'S SIDE: her desk at 11:52, THE PLAN
// ---- v31-S3.00p: the whip lands on her desk from above; her card; "Once more, before the others join."; the push
L.add('v31-S3.00p', {kind: 'V', st: V31('kits/act4-v31 drawNelehDeskHigh (her desk from above at 11:52: the call open, MADA joined early, his spinner; three waiting; THE PLAN unfolded; NELEH leaning over it, her footnote slips orbiting; her pen ticking on it while she says her line) + her card (lay blipCard NELEH / READ THE CHARTER. LITERALLY. · FOOTNOTES: ∞, moved from S1.07), then the push into the paper: a bayer dissolve (8 f) onto framing \'paper\' (S1.03\'s first sheet frame at 1:1, her pen by her own plate)'),
  marks: {card: ['txt', 'NELEH / READ', 'at', 0], push: ['len', -26]},
  draw: (fb, k, sh, f) => {
    const card = mk(sh, 'card', 5), push = mk(sh, 'push', 85);
    const talk = talking(sh, k, 'NELEH');
    const desk = (b: Buf) => drawNelehDeskHigh(b, f, {clock: '11:52', framing: 'desk', pen: talk && (k >> 2) % 3 === 0 ? 1 : 0});
    if (k < push) { desk(fb); if (k >= card && k < push - 6) blipCard(fb, k - card, 'NELEH', 'NELEH', 'READ THE CHARTER. LITERALLY.', 'FOOTNOTES: ∞', {f}, 'R'); return; }
    const paper = new Buf(480, 270, PAL.N0); drawNelehDeskHigh(paper, f, {framing: 'paper', pen: 0});
    if (k >= push + 8) { fb.c.set(paper.c.subarray(0, 480 * RH)); return; }
    const a = new Buf(480, 270, PAL.N0); desk(a);
    dither(fb, a, paper, (k - push + 1) / 9);
  }});
// ---- S1.03 (moved): THE PLAN, her document; GERG / CHAIR; her figure steps out of her own chair and walks to the edge
const NX = 458, NELEH_CX = PLAN4.CX[6];
const BRACKET: [number, number, number, number] = [176, PLAN4.FOOT + 3, 96, 24];
const THREE: [number, number] = [96, PLAN4.FOOT - 14], PLATES: [number, number] = [224, PLAN4.FOOT + 14], FOUR: [number, number] = [360, PLAN4.FOOT - 40];
const ARROWP: [number, number] = [PLAN4.arrow.x, PLAN4.arrow.y0 + 14], COMPANY: [number, number] = [PLAN4.company.x + 150, PLAN4.company.y + 40];
L.add('S1.03', {kind: 'V', st: V31('v5 S1.03 copied (plan4.ts THE PLAN, one sheet, the tilt; bp-pointer bpNeleh points at the three, the MAS / GERG plates with the bracket, the four, the box, the arrow, the company) with art/v31 planChairV3 (GERG / CHAIR, the plate re-drawn from the same sheet) and her figure stepping out of her own NELEH chair on the stamp and walking to the sheet\'s edge (bpNeleh walk, 10 px a held step) before her first line'),
  draw: (fb, k, sh) => {
    drawPlan4(fb, sh as unknown as ShotV4, k);
    const t0 = mk(sh, 'tilt', 189), oy = Math.max(0, Math.min(60, k - t0));
    planChairV3(fb, oy);
    const stamp = mk(sh, 'stamp', 7);
    if (k < stamp) return {full: true};
    const nine = mk(sh, 'nine', 33), plates = mk(sh, 'plates', 100), four = mk(sh, 'four', 128), us = mk(sh, 'us', 136), box = mk(sh, 'box', 166);
    const arrow = mk(sh, 'arrow', 187), company = mk(sh, 'company', 216);
    const up = (p: [number, number]): [number, number] => [p[0], p[1] - oy];
    const L3 = lineOf(sh, 'a5-25-03');
    // out of her chair: up (4 f), then walking to her place at the sheet's edge, arriving before her first line
    const w0 = stamp + 4, w1 = Math.min(nine - 2, w0 + 24);
    const fx = k < w0 ? NELEH_CX : k < w1 ? Math.round(NELEH_CX + ((on2(k) - w0) / Math.max(1, w1 - w0)) * (NX - NELEH_CX)) : NX;
    let pose: BpNelehPose = {kind: 'rest'};
    if (k >= w0 && k < w1) pose = {kind: 'walk', step: ((k >> 1) % 2 ? 1 : 2) as 1 | 2};
    else if (k >= nine && k < plates) pose = {kind: 'point', at: up(THREE)};
    else if (k >= plates && k < four) pose = {kind: 'point', at: up(PLATES), tap: k >= plates + 2 && k < plates + 5 ? 1 : 0, callout: {box: [BRACKET[0], BRACKET[1] - oy, BRACKET[2], BRACKET[3]], rail: PLAN4.FOOT + 41 - oy}};
    else if (k >= four && k < box) pose = sweep(k, four, 12, up([216, PLAN4.FOOT - 10]), up(FOUR));
    else if (k >= box && k < arrow) pose = {kind: 'point', at: up([PLAN4.six.x + 40, PLAN4.six.y + PLAN4.six.h - 6])};
    else if (k >= arrow && k < company + 12) pose = {kind: 'point', at: up(k < t0 + 30 ? ARROWP : COMPANY)};
    else if (L3 && k >= L3.e) pose = {kind: 'rest'};
    inkOver(fb, (b) => {
      if (k >= plates && k < four) bpBracket(b, BRACKET[0], BRACKET[1] - oy, BRACKET[2], BRACKET[3], k - plates);
      bpNeleh(b, fx, PLAN4.FOOT - oy, pose, k, {glow: k >= us && k < us + 14, knock: true});
    });
    return {full: true};
  }});
L.add('S1.04', {kind: 'V', st: V('S1.04', 'art/texts planZerosV3 over it: the key ring\'s label MACROSOFT · BILLIONS IN, and EQUITY: 0 alone (the caption\'s box re-drawn from the same sheet)'),
  draw: (fb, k, sh, f) => { const out = v5(fb, k, sh, f); planZerosV3(fb, 10); return out; }});
// ---- S1.05 (moved): the path; then the pull back out of the linework to her desk (no tear into the suite)
L.add('S1.05', {kind: 'V', st: V31('plan4.ts\'s S1.05 path (the four onto 1. NOON · VIDEO CALL, the fold) without the curl or the tear, then the pull back: a bayer dissolve (4 f, landing on the paper_whip) onto her desk from above (kits/act4-v31 drawNelehDeskHigh desk, 11:59, her pen resting on step 1)'),
  marks: {whip: ['snd', 'paper_whip', 1, 0]},
  draw: (fb, k, sh, f) => {
    const whip = mk(sh, 'whip', 56);
    const path = (b: Buf) => drawPlan4(b, {...sh, marks: {...sh.marks, curl: 9999, tear: 9999}} as unknown as ShotV4, k);
    if (k < whip - 4) { path(fb); return {full: true}; }
    const desk = new Buf(480, 270, PAL.N0); drawNelehDeskHigh(desk, f, {clock: '11:59', framing: 'desk', pen: 0});
    if (k >= whip) { fb.c.set(desk.c.subarray(0, 480 * RH)); return; }
    const a = new Buf(480, 270, PAL.N0); path(a);
    dither(fb, a, desk, (k - whip + 5) / 5);
  }});
/** her lips as she reads to herself: small shapes held on 4s (no open jaw: silent) */
const MOUTHING: Viseme[] = ['E', 'M', 'rest', 'E', 'O', 'M', 'E', 'rest'];
// ---- S3.03 (v3.2): the post types itself in its own editor while her lips move, silent (the read aloud is cut)
L.add('S3.03', {kind: 'V', st: V('S3.03', 'v3.2: v5 S3.03 copied (kits/blog-draft drawBlogDraft in rooms/neleh-desk drawNelehBezel, day; her pointer onto Post, the click on the tick, PUBLISHED) with the post typing itself in the source\'s words (art/v32 blogTyped: the page past the typed characters, the caret at the typing point; held to read after), and the corner call window in its speaker layout (art/v32 blogSpeakerWindow: NELEH large, her lips moving as she reads, silent, then lip-synced on "Any objections?" with the speaking ring; the three minis beside her); no underline (the read is cut)'),
  face: {NELEH: 'lip'},
  draw: (fb, k, sh, f) => {
    const ptr = mk(sh, 'point', 189), post = mk(sh, 'post', 213);
    const t0 = 6, t1 = Math.min(ptr - 60, 110); // typing, then held to read
    const typed = k < t0 ? 0 : k >= t1 ? BLOG_CHARS : Math.floor(((on2(k) - t0) * BLOG_CHARS) / (t1 - t0));
    const s = sui();
    drawBlogDraft(s, {f, k, pointer: k < ptr ? 'rest' : 'post', click: k >= post ? k - post : undefined});
    if (typed < BLOG_CHARS) blogTyped(s, typed, k);
    const voiced = talking(sh, k, 'NELEH');
    const reading = k >= t0 + 4 && k < t1 + 18; // her lips follow the page, silent
    blogSpeakerWindow(s, f, {mouth: voiced ? mouth(sh, k, 'NELEH') : reading ? MOUTHING[Math.floor((k - t0) / 4) % MOUTHING.length] : 'rest', speaking: voiced});
    drawNelehBezel(fb, s, {time: 'day'});
  }});
// ---- S3.04 (v3.2): Rima's join; her tile's own label carries INTERIM CEO (the lock's plate text: the world, not a plate)
const boardSpeaker = (sh: PxShot, k: number): 'alyi' | 'neleh' | 'rima' | null => {
  for (const w of ['RIMA', 'ALYI', 'NELEH']) if (talking(sh, k, w)) return w.toLowerCase() as 'alyi' | 'neleh' | 'rima';
  return null;
};
L.add('S3.04', {kind: 'V', st: V('S3.04', 'v3.2: v5 S3.04 copied (rooms/neleh-desk drawNelehDeskOTS, day, held, pen gone; kits/call-boardside drawBoardCall: Rima\'s join, the ring, the spotlight search, her jacket smoothed, the speaking ring passing, all lip-synced in their tiles; ALYI lit) with her tile\'s own label in two rows, RIMA TAMURI over INTERIM CEO (art/v32 rimaTileLabel), in place of v5\'s show plate (the lock\'s text RIMA TAMURI · INTERIM CEO is her tile\'s label: script-v32-notes §10.3)'),
  draw: (fb, k, sh, f) => {
    const j = mk(sh, 'join', 4), sm = mk(sh, 'smooth', 134);
    const s = new Buf(NDESK.screen.w, NDESK.screen.h, PAL.N1);
    const hand = (k >= sm && k < sm + 16 ? (((k - sm) >> 3) % 2 ? 'smooth1' : 'smooth0') : 'none') as 'smooth1' | 'smooth0' | 'none';
    drawBoardCall(s, {f, clock: '12:04', removed: 999, fifth: k < j ? null : {kind: 'rima', k: k - j, mouth: mouth(sh, k, 'RIMA'), lid: blink(k, 5), hand},
      speaking: boardSpeaker(sh, k), mouths: {alyi: mouth(sh, k, 'ALYI'), neleh: mouth(sh, k, 'NELEH'), rima: mouth(sh, k, 'RIMA')}, alyiLit: OPT5.alyiLit});
    if (k - j >= 6) rimaTileLabel(s);
    drawNelehDeskOTS(fb, f, {time: 'day', push: 4, pen: 'gone', neleh: {turn: 0}, screen: s});
  }});
L.add('S3.04b', {kind: 'V', st: V31('the v5 layout + the face light on Neleh (kits/face-light faceKey, 2 steps, the key from the window side)'),
  draw: (fb, k, sh, f) => { const out = v5(fb, k, sh, f); faceLight(fb, HEAD_R, 2, -1); return out; }});
L.add('S3.07', {kind: 'V', st: V('S3.07', 'v3.1: the face light on Alyi (kits/face-light faceKey, 2 steps, from the door\'s side) · v5 S3.07 + the doorway\'s aftermath (+0.8 s): after he steps back the door leaf eases a few px toward shut in 3 held steps, then rests'),
  draw: (fb, k, sh, f) => {
    const out = v5(fb, k, sh, f);
    const gone = mk(sh, 'step', 211) + 12;
    if (k >= gone) { // the leaf (doorFrame's right leaf: x 422..479) swings in over the jamb, 3 held steps of 3 px
      const d = Math.min(3, 1 + Math.floor((k - gone) / 6)) * 3;
      const x0 = 422 - d;
      rect(x0, 0, 480 - x0, RH, fb.ink(PAL.N1)); rect(x0, 0, 2, RH, fb.ink(PAL.N0)); rect(478, 0, 2, RH, fb.ink(PAL.D1));
      rect(x0 + 2, 0, 1, RH, fb.ink(PAL.N2));
    }
    faceLight(fb, HEAD_R, 2, 1); // v3.1: the face light (mood §4 #4)
    return out;
  }});



// ================================================================== S4 · THE WEEKEND, THE BOARDROOM
/** v5's small wall screen in the boardroom wide (shots5 wallScreen, private there) */
const wallScreen = (b: Buf, x: number, y: number, f: number, rima = false) => {
  rect(x - 3, y - 3, 70, 44, b.ink(PAL.N0)); rect(x - 2, y - 2, 68, 42, b.ink(PAL.G1));
  rect(x, y, 64, 38, b.ink(PAL.N2));
  for (let i = 0; i < 4; i++) { const tx = x + 2 + (i % 2) * 31, ty = y + 2 + Math.floor(i / 2) * 18; rect(tx, ty, 29, 16, b.ink(i === 3 ? (rima ? PAL.P1 : PAL.N1) : PAL.N4)); }
  for (let j = 0; j < 60; j++) { const hx = x + 1 + ((j * 29 + (j >> 2) * 7) % 62), hy = y + 38 - 1 - ((j * 13) % 22); b.set(hx, hy, (j + (f >> 3)) % 5 ? PAL.R2 : PAL.R3); b.set(hx + 1, hy, PAL.R2); }
  b.set(x + 48, y + 30, PAL.C6);
};
// ---- S4.02 (C13): the wide, held; four phones buzz and step toward the edge; the first (seat A) goes over: clack
const PHONE_SEATS = ['A', 'C', 'D', 'R'] as const, PHONE_IDS = ['STAFF', 'STAFF', 'INVESTORS', 'STAFF'];
const PHONE_AT: Array<[number, number]> = [[120, 153], [224, 151], [282, 153], [390, 160]]; // v5's caller-ID anchors (the phones' step-0 spots)
const roomOpts = (phones: {lit: boolean; buzz: boolean; step: number} | null, seats: string[]) =>
  ({blueprint: {word: false}, laptop: true, phones, phoneSeats: seats}) as Parameters<typeof boardRoom>[2];
/** phone A's pixels at `step` (its body and its glow on the table): a room with only it, against the same room bare */
const phoneA = (step: number, jig: number) => {
  const bare = new Buf(480, 270, PAL.N0), one = new Buf(480, 270, PAL.N0);
  held(bare, `v3a4:s402-bare-${jig}`, (b) => boardRoom(b, jig, roomOpts(null, []), {}));
  held(one, `v3a4:s402-A-${step}-${jig}`, (b) => boardRoom(b, jig, roomOpts({lit: true, buzz: jig !== 0, step}, ['A']), {}));
  return {bare, one};
};
/** the falling phone (7 x 3 on the table): t = frames since it tipped; its drawings in held frames, then flat on the
 *  floor, screen up, lit (its light pooling one step on the floor) */
const fallPhone = (fb: Buf, x: number, t: number, f: number) => {
  const lit = Math.floor(f / 6) % 2 ? PAL.C6 : PAL.C5;
  const put = (xx: number, yy: number, c: number) => { if (yy >= 0 && yy < RH) fb.set(xx, yy, c); };
  if (t < 2) { // tipping over the lip: its near end down (a 2-row slant), the lit face turning away, its back edge caught
    const y = 170 + t;
    for (let i = 0; i < 7; i++) { const yy = y + Math.floor((i * (t + 1)) / 4); put(x + i, yy, PAL.G4); put(x + i, yy + 1, PAL.G2); put(x + i, yy + 2, PAL.N0); if (i > 1 && i < 5) put(x + i, yy + 1, lit); }
    return;
  }
  if (t < 5) { // falling edge-on: a 3 x 6 sliver, dropping 6-7 px a frame, its edge catching the table's light
    const y = [0, 0, 176, 183, 190][t];
    for (let j = 0; j < 6; j++) { put(x + 2, y + j, PAL.G4); put(x + 3, y + j, j === 2 ? lit : PAL.G2); put(x + 4, y + j, PAL.N0); }
    return;
  }
  const up = t === 7 ? 1 : 0; // one 1 px bounce after the clack
  const y = 196 - up;
  for (let i = -2; i < 9; i++) for (const dy of [2, 3]) if (bayer(x + i, y + dy) < (dy === 2 ? 0.6 : 0.3)) put(x + i, y + dy, stepColor(fb.get(x + i, y + dy), 1)); // its light on the floor
  for (let i = 0; i < 7; i++) { put(x + i, y, PAL.G3); put(x + i, y + 1, PAL.N0); }
  for (let i = 1; i < 6; i++) put(x + i, y, lit);
  put(x + 1, y, PAL.C8);
};
/** the three table phones' pixels (C, D, R at their last step), for the row lighting up at once (v3.4): the room with
 *  them against the room without */
let ROW_MASK: Uint8Array | null = null;
const rowMask = () => (ROW_MASK ??= (() => {
  const bare = new Buf(480, 270, PAL.N0), row = new Buf(480, 270, PAL.N0);
  boardRoom(bare, 0, roomOpts(null, []), {});
  boardRoom(row, 0, roomOpts({lit: true, buzz: false, step: 3}, ['C', 'D', 'R']), {});
  const m = new Uint8Array(480 * RH);
  for (let i = 0; i < 480 * RH; i++) m[i] = row.c[i] !== bare.c[i] ? 1 : 0;
  return m;
})());
/** the row lighting up: every phone's pixels (the three on the table and phone A on the floor) `k` rungs up, and their
 *  light one rung up on what's round them (4 px) */
const rowLight = (fb: Buf, k: number, fallenX: number) => {
  const m = rowMask().slice();
  for (let y = 193; y < 201; y++) for (let x = fallenX - 2; x < fallenX + 9; x++) if (familyOf(fb.c[y * 480 + x])?.[0] === 'C') m[y * 480 + x] = 1; // phone A, lit on the floor
  const near = new Uint8Array(480 * RH);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    if (!m[y * 480 + x]) continue;
    for (let j = -4; j <= 4; j++) for (let i = -4; i <= 4; i++) { const X = x + i, Y = y + j; if (X >= 0 && X < 480 && Y >= 0 && Y < RH && !m[Y * 480 + X] && i * i + j * j <= 16) near[Y * 480 + X] = 1; }
  }
  // each phone's light pooled on the table (and phone A's on the floor): an ellipse a rung up, its core two, dithered
  const pools: Array<[number, number]> = [...PHONE_AT.slice(1).map(([px, py]) => [px + 4, py + 10] as [number, number]), [fallenX + 3, 197]];
  const lift = new Uint8Array(480 * RH);
  for (const [cx, cy] of pools) for (let y = cy - 8; y <= cy + 8; y++) for (let x = cx - 26; x <= cx + 26; x++) {
    if (x < 0 || x >= 480 || y < 0 || y >= RH) continue;
    const d = Math.hypot((x - cx) / 26, (y - cy) / 8);
    if (d > 1) continue;
    const v = d < 0.45 ? 2 : d < 0.8 || bayer(x, y) < (1 - d) * 3 ? 1 : 0;
    lift[y * 480 + x] = Math.max(lift[y * 480 + x], v);
  }
  for (let i = 0; i < 480 * RH; i++) { if (m[i]) fb.c[i] = stepColor(fb.c[i], k); else if (lift[i] || near[i]) fb.c[i] = stepColor(fb.c[i], Math.max(lift[i], near[i])); }
};
L.add('S4.02', {kind: 'V', st: V('S4.02', 'v3.3 (P12): the push in during Neleh\'s second speech, as the stepped push (pov-and-framing §4.7.2: up the ladder, one drawn size a cut): v3.2\'s wide (C13: backs boardRoom, phone A composited from its own room render, the buzzes, the caller IDs, v5\'s small wall screen) with a slow whole-pixel drift toward her; on her second speech\'s first word the cut in to [M] (rooms/twoshots drawBoard2S: NELEH medium, speaking; Mada; the phones lit on the table), drifting on toward her; on "Monday" her [MCU] (S4.07\'s framing: the board plate soft behind her with its phones, nelehPortrait lip-synced, the face light, 2 steps); at her speech\'s end back to the wide for phone A\'s teeter, fall and clack; v3.4 (Alyi\'s "That is the company telling us." cut; the phones carry it): on the lock\'s phone_buzz_step_1 (15.8 s) the whole row of phones lights up at once, the three on the table and phone A on the floor, two rungs up (a 2-frame pop at three) and their light a rung on what\'s round them, buzzing on 2s for half a second, then held 1.6 s to the cut; Neleh\'s "Then we\'ll write step four ourselves." follows in S4.07'),
  marks: {push1: ['on', 'a5-27-23', 0], push2: ['w', 'a5-27-23', 'Monday', 0], back: ['end', 'a5-27-23', 2], lit: ['snd', 'phone_buzz_step_1', 1, 0]},
  draw: (fb, k, sh, f) => {
    const p1 = mk(sh, 'push1', 220), p2 = mk(sh, 'push2', 280), back = mk(sh, 'back', 352), lit = mk(sh, 'lit', 379);
    if (k >= p1 && k < back) {
      if (k < p2) { // [M]: Neleh at the table's end, speaking, Mada beyond; the phones lit on the table; a drift on toward her
        const bz2 = mk(sh, 'buzz2', 203), jig = k < bz2 + 30 ? 1 + ((k >> 1) % 2) : 0;
        drawBoard2S(fb, f, {neleh: {mouth: mouth(sh, k, 'NELEH'), lid: blink(k, 2)}, mada: {}, spin: f,
          plate: {phones: {lit: true, buzz: jig !== 0, step: 3}}});
        shiftRoom(fb, Math.min(8, Math.floor((k - p1) / 6)));
        return;
      }
      // [MCU]: her real face (S4.07's framing), lip-synced, the face light (P18)
      held(fb, 'v3a4:s402-mcu-bg', (b) => { boardBg({phones: {lit: true, buzz: false, step: 3}, reflection: null})(b); vignette(b, MCU_X.R + 56, 2); soft(b, 2); });
      drawBust(fb, nelehPortrait({...NELEH_PORTRAIT_DEFAULT, lid: blink(k, 2), look: -1, mouth: mouth(sh, k, 'NELEH')}), {third: 'R'});
      faceLight(fb, [HEAD_R[0], HEAD_R[1], HEAD_R[2], 112], 2, -1);
      return;
    }
    // the wide (v3.2's C13), drifting toward her
    const bz = mk(sh, 'buzz', 7), bz2 = mk(sh, 'buzz2', 203), tip = mk(sh, 'tip', 369);
    const step = Math.min(3, (k >= bz ? 1 : 0) + (k >= bz + 15 ? 1 : 0) + (k >= bz2 ? 1 : 0));
    const buzz = (k >= bz && k < bz + 30) || (k >= bz2 && k < bz2 + 30) || (k >= lit && k < lit + 12);
    const teeter = k >= tip - 12 && k < tip;
    const jig = buzz ? 1 + ((k >> 1) % 2) : 0, jigA = buzz || teeter ? 1 + ((k >> 1) % 2) : 0;
    const stepA = k < bz2 ? step : Math.min(6, 3 + Math.floor((k - bz2) / 8));
    const nm = roomMouth(sh, k, 'NELEH');
    held(fb, `v3a4:s402-${step}-${jig}-${nm}`, (b) => boardRoom(b, jig, {...roomOpts({lit: true, buzz: jig !== 0, step}, ['C', 'D', 'R']),
      reflection: {img: alyiReflection({mouth: 'rest', eyes: 'open', t: 0, mirror: true}), x: 40, y: 38, k: 2}}, {neleh: {mouth: nm}, mada: true, alyi: false}));
    if (k < tip) { // phone A on the table: its own pixels over the room
      const {bare, one} = phoneA(stepA, jigA);
      for (let i = 0; i < 480 * RH; i++) if (one.c[i] !== bare.c[i]) fb.c[i] = one.c[i];
    } else fallPhone(fb, PHONE_AT[0][0] + 1, k - tip, f);
    if (k >= lit) rowLight(fb, k < lit + 2 ? 3 : 2, PHONE_AT[0][0] + 1); // v3.4: the whole row lights up at once, then holds
    wallScreen(fb, 222, 30, f);
    if (k >= bz) PHONE_IDS.forEach((s2, i) => {
      if (i === 0 && k >= tip) return; // it went over
      const st = i === 0 ? stepA : step;
      const [px, py] = PHONE_AT[i];
      const x = px + 4 - Math.round(pw(s2) / 2), y = py + st * 3 - 13;
      rect(x - 2, y - 1, pw(s2) + 4, 9, fb.ink(PAL.N0)); rect(x - 2, y + 8, pw(s2) + 4, 1, fb.ink(PAL.C4)); pt(fb, s2, x, y, k >= lit ? PAL.C8 : PAL.C7);
    });
    shiftRoom(fb, Math.min(8, Math.floor(Math.max(0, Math.min(k, p1) - 40) / 22))); // 1 px / 22 f toward her from k40, held after
  }});
L.add('S4.07', {kind: 'V', st: V31('the v5 layout + the face light on Neleh (kits/face-light faceKey, 2 steps, keyed from the frame\'s left, her head only)'),
  draw: (fb, k, sh, f) => { const out = v5(fb, k, sh, f); faceLight(fb, [HEAD_R[0], HEAD_R[1], HEAD_R[2], 112], 2, -1); return out; }});
// ---- S4.08 (C14): the split, one held shot: Neleh's call | the lighthouse; no rent meters (their text went with C14),
// no NOZAMA; Adelina's plate her name; after "no." and the click, the left pane goes dark and CALL ENDED
const pane = (fb: Buf, src: Buf, sx: number, dx: number) => { for (let y = 0; y < RH; y++) for (let x = 0; x < 238; x++) fb.set(dx + x, y, src.get(sx + x, y)); };
const dimL = (b: Buf, x: number, y: number, w: number, h: number, k: number) => { for (let j = y; j < Math.min(RH, y + h); j++) for (let i = Math.max(0, x); i < Math.min(480, x + w); i++) b.set(i, j, stepColor(b.get(i, j), -k)); };
L.add('S4.08', {kind: 'V', st: V('S4.08', 'v5 S4.08 copied for C14: rooms/lighthouse with no rent meters (meters 0: no RENT flags, no NOZAMA / ELGOOG, no meter tag, no NOZAMA caller ID), the second call gone (after the click the throne falls, the pane dims, CALL ENDED; Mario\'s arm down); v3.2: the first-appearance plate with one relation word (art/texts plateRel, v5\'s plate layout: ADELINA · CO-FOUNDER)'),
  draw: (fb, k, sh) => {
    const click = mk(sh, 'click', 500), ring = mk(sh, 'ring', 4), raise = mk(sh, 'raise', 445), ad0 = mk(sh, 'adelina', 442);
    const ad = lineOf(sh, 'a5-27-32');
    const adS = ad ? ad.s : ad0 + 14;
    const nm = roomMouth(sh, k, 'NELEH');
    const ended = k >= click;
    const Lb = new Buf(480, 270, PAL.N0);
    held(Lb, `v3a4:split-L-${nm}-${ended ? 0 : 4}`, (b) => boardRoom(b, 0, {blueprint: {word: false}, laptop: true, phones: {lit: false, step: 4}, speaker: ended ? 0 : 4}, {neleh: {mouth: nm}, mada: true, alyi: false}));
    const R = new Buf(480, 270, PAL.N0);
    const room = drawLighthouse(R, k, {meters: 0, ring1: k >= ring && k < adS ? ring : null, ring2: null,
      throne: k < click ? 'on' : 'fallen', phone1: k >= adS - 4 && k < click ? 'off' : 'cradle', phone2: 'cradle'});
    const A = room.anchors as unknown as Record<string, [number, number]>;
    const marm: MarioArm = k >= raise && k < raise + 4 ? 'raise' : k >= raise + 4 && k < click ? 'raise2' : 'down';
    const [mx, my] = A.marioDesk;
    blitImg(R, marioImg({...MARIO_BASE, arm: marm, mouth: room3Mouth(sh, k, 'MARIO'), blink: blink(k, 4) > 0}), mx - MARIO_FOOT[0], my - MARIO_FOOT[1]);
    if (k >= ad0) {
      const ax = Math.max(196, 300 - Math.floor(on2(k - ad0) * 8));
      const arm: AdelinaArm = (k >= adS - 4 && k < adS) || (k >= click && k < click + 4) ? 'reach' : k >= adS && k < click ? 'phone' : 'down';
      const am = lipOn(sh, k, 'ADELINA') ? roomMouth(sh, k, 'ADELINA') : 'smile';
      drawAdelinaRoom(R, ax, 199, {...ADELINA_ROOM_DEFAULT, arm, mouth: am});
    }
    pane(fb, Lb, 110, 0);
    if (ended) {
      const dk = k - click;
      if (dk >= 8) dimL(fb, 0, 0, 238, RH, dk >= 16 ? 2 : 1);
      if (dk < 44) { const cs = 'CALL ENDED', w = pw(cs) + 8, x = BR.SPEAKER.x - 110 - Math.round(w / 2), y = BR.SPEAKER.y - 20; rect(x - 1, y - 1, w + 2, 12, fb.ink(PAL.N0)); rect(x, y, w, 10, fb.ink(PAL.N2)); rect(x, y + 9, w, 1, fb.ink(PAL.R2)); pt(fb, cs, x + 4, y + 1, PAL.P1); }
    }
    pane(fb, R, 64, 242);
    rect(238, 0, 4, RH, fb.ink(PAL.N0));
    for (const t of sh.texts.filter((x) => x.kind === 'plate')) {
      if (k < t.s || k >= t.e) continue;
      plateRel(fb, 248, 8, t.text, k - t.s, t.text.startsWith('MARIO') ? PAL.F5 : PAL.W5); // v3.2: the name and one relation word
    }
  }});
// ---- S4.09: Sunday, the reversal on screen: the phones in a row, the ticker, "The staff want him back…"
const feedPhase = (k: number, turn: number, walk: number): [LobbyFeedPhase, number] => (k < turn ? ['stand', k] : k < walk ? ['turn', k - turn] : ['walk', k - walk]);
// ---- v32-S5.00 (new): the lobby, his side of it, told twice: in colour at his shoulder, then out into their camera
L.add('v32-S5.00', {kind: 'V', st: V32('[MCU] kits/act4-v32 drawReceptionMCU, full colour at his shoulder, the day lobby soft behind: a receptionist\'s hand (no face) slides the GUEST lanyard across the stone (4 held positions); he puts it on himself (the strap over his head on the cloth_rustle, then round his neck); the selfie at arm\'s length, one white flash step on the camera_shutter; his post up in its own UI on the post_click ("first and last time i ever wear one of these", the post card kit\'s masBadge, moved here from S4.09); he looks up once at the corner camera (the near-front head, the same face); on the look the picture cuts into that camera\'s own frame (drawLobbyCCTVStep: the lobby wide, him at the desk in the lanyard) and steps into its grade one palette step each 8 f, grain up, REC on the last; S4.09 opens on it as their wall screen; v3.3 (P13): no rail (the lock drops it), dated once by the camera\'s plate, the lock\'s NOPEAI HQ · LOBBY · NOV 19 · 1:03 PM, up from the cut into the camera (1.9 s) in the kit\'s plate style'),
  marks: {rustle: ['snd', 'cloth_rustle', 1, 0], shutter: ['snd', 'camera_shutter', 1, 0], post: ['snd', 'post_click', 1, 0], step: ['len', -46]},
  draw: (fb, k, sh, f) => {
    const ru = mk(sh, 'rustle', 24), sn = mk(sh, 'shutter', 57), po = mk(sh, 'post', 100), st0 = mk(sh, 'step', 146);
    if (k >= st0) { // their camera's frame, stepping into its grade; v3.3 (P13): dated once, by the camera's own plate
      const step = Math.min(4, Math.floor((k - st0) / 8)) as 0 | 1 | 2 | 3 | 4;
      drawLobbyCCTVStep(fb, f, {step});
      const pl = textOf(sh, 'label', 'NOPEAI HQ');
      if (pl) { const x = 15, y = 8; rect(x - 2, y - 2, textWidth(pl.text) + 4, 11, fb.ink(PAL.N1)); text(fb, pl.text, x, y, PAL.G6); } // the kit's plate style (its chrome), the lock's words
      return;
    }
    const slide = (k < ru - 8 ? Math.min(3, Math.floor(k / 4)) : null) as 0 | 1 | 2 | 3 | null;
    const lanyard = k < ru - 8 ? null : k < ru + 8 ? 'lift' : 'on';
    const selfie = k >= sn - 14 && k < sn + 12;
    const look = k >= po + 22;
    drawReceptionMCU(fb, f, {slide, lanyard, selfie, flash: k >= sn && k < sn + 2, look, post: k >= po ? k - po : null, mas: {lid: look ? 0 : blink(k, 3)}});
  }});
L.add('S4.09', {kind: 'V', st: V31('kits/act4-v31 drawSundayOTS (v5\'s wall-screen OTS with the lobby feed at 1:1, his GUEST card, ALYI\'s reflection lip-synced; v3.2: no post card on the CCTV tile, his post is his, in v32-S5.00) + the phones set in a row on the table\'s edge, STAFF · STAFF · INVESTORS · INVESTORS, buzzing in turn, and the ticker crawling in under the CCTV tile, INVESTORS PUSH TO BRING MANALT BACK (the lock\'s words); on "here" he turns and walks out'),
  draw: (fb, k, sh, f) => {
    const turn = mk(sh, 'turn', 233), walk = mk(sh, 'walk', 239);
    const tk = textOf(sh, 'label', 'INVESTORS PUSH');
    const feed = new Buf(FEED_W, FEED_H, PAL.N0);
    const [phase, kk] = feedPhase(k, turn, walk);
    drawLobbyFeed(feed, {f, phase, k: kk});
    drawSundayOTS(fb, f, {feed, alyi: {mouth: mouth(sh, k, 'ALYI')}, ticker: tk ? k - tk.s : null, buzz: k});
  }});
/** the wall screen's name bar for its lit tile (S4.10: Rima's), hung under the screen (wallScreen's 64 x 38 tiles are
 *  too small to letter): the call app's own chip, the UI face; `k` = frames since the label changed (a 2-frame flip) */
const wallTileLabel = (fb: Buf, s: string, k: number) => {
  const w = pw(s) + 10, x = 254 - Math.round(w / 2), y = 71;
  rect(x - 1, y - 1, w + 2, 11, fb.ink(PAL.N0)); rect(x, y, w, 9, fb.ink(PAL.N2)); rect(x, y, w, 1, fb.ink(PAL.N4));
  rect(251, 68, 6, 3, fb.ink(PAL.N0)); // its tab to the screen's foot
  if (k >= 0 && k < 2) return; // the flip: one blank chip for 2 frames, then the new words
  pt(fb, s, x + 5, y + 1, PAL.P1);
};
L.add('S4.10', {kind: 'V', st: V('S4.10', 'v5 S4.10 copied; v3.1: his card over the room frozen in two tones while the lock\'s card text is up (lay blipCard TTEMME / INTERIM CEO, TAKE TWO · CHAT: LIVE; freezePrint), then the room unfreezes; v3.3 (S2 / P15): the wall screen\'s name bar for Rima\'s lit tile reads RIMA TAMURI · INTERIM CEO, and as the spot leaves her (the lock\'s 0.8 s) it flips back to RIMA TAMURI · CTO (the lock\'s text), drawn in the room, so the card\'s freeze prints it too'),
  draw: (fb, k, sh, f) => {
    const step = Math.max(0, Math.min(2, Math.floor((k - mk(sh, 'swing', 0)) / 8)));
    const spots = [{x: 254, y: 56, r: 20}, {x: 254, y: 82, r: 26}, {x: 254, y: 100, r: 30}];
    held(fb, `v3a4:s410-${step}`, (b) => boardRoom(b, 0, {sticky: {seat: 'C', text: ''}, spot: spots[step], laptop: true, blueprint: {word: false}, phones: {step: 4}}, {neleh: {}, mada: true, alyi: true, ttemme: step >= 1 ? {} : null}));
    wallScreen(fb, 222, 30, f, step === 0);
    const chat = textOf(sh, 'label', 'LIVE');
    if (chat && k >= chat.s && step >= 1) drawChatPanel(fb, BR.SEATS.C.x + 30, BR.WALL_FLOOR_Y - 44, 'room', f);
    const t = textOf(sh, 'plate');
    if (t) wallTileLabel(fb, k < t.s ? 'RIMA TAMURI · INTERIM CEO' : t.text, k - t.s); // v3.3 (S2): her tile's label steps back to CTO as the spot leaves her
    const cd = textOf(sh, 'card', 'TTEMME /'); // v3.1: his 2-TONE card on the spot's landing
    if (cd && k >= cd.s && k < cd.e) { freezePrint(fb); blipCard(fb, k - cd.s, 'TTEMME', 'TTEMME', 'INTERIM CEO, TAKE TWO', 'CHAT: LIVE', {f: sh.s + cd.s}, 'L'); }
  }});
// ---- S4.10b (v3.3, S2 / P15): "Okay." is cut: he turns the page over toward us, and its back is blank
const PAGE_AT: [number, number] = [BHEAD.ttemme[0] + TTEMME_M_FOLDER[0], BHEAD.ttemme[1] + TTEMME_M_FOLDER[1]]; // the folder's spot in his rig (unflipped: stage 'nelehLeft')
L.add('S4.10b', {kind: 'V', st: V('S4.10b', 'v3.3 (S2 / P15): v5 S4.10b copied (rooms/boardroom-head drawBoardHead2S, stage nelehLeft: NELEH standing left, TTEMME at the head, Mada soft beyond, his chat panel; PROP-FOLDER: the sealed folder slides across, he breaks the seal and reads it turned away) to the read; then, with "Okay." gone, he turns the page over toward us (art/v33 drawBlankPage: edge-on, three-quarters, then the sheet facing us, BLANK, 1.3 s) and holds Neleh\'s eye, his brow unsure; the next shot is his hand on the hourglass'),
  draw: (fb, k, sh, f) => {
    const slide = mk(sh, 'slide', 276), up = mk(sh, 'up', 296), seal = mk(sh, 'seal', 304), open = mk(sh, 'open', 310), close = mk(sh, 'close', 320);
    let folder: FolderState | null = null;
    if (k >= slide && k < up) folder = {kind: 'table', slide: Math.min(3, Math.floor(((k - slide) * 4) / Math.max(1, up - slide))) / 3};
    else if (k >= up && k < seal) folder = {kind: 'up', seal: 'whole', open: 0};
    else if (k >= seal && k < open) folder = {kind: 'up', seal: 'broken', open: 0};
    else if (k >= open && k < close) folder = {kind: 'up', seal: 'broken', open: k < open + 3 ? 1 : 2};
    else if (k >= close) folder = {kind: 'up', seal: 'broken', open: 0};
    const reading = k >= open && k < close;
    drawBoardHead2S(fb, f, {
      ttemme: {mouth: mouth(sh, k, 'TTEMME'), lid: blink(k, 6), head: reading ? 'down' : '34', brow: k >= close + 6 ? 'unsure' : 'level'},
      neleh: {mouth: mouth(sh, k, 'NELEH'), lid: blink(k, 2)},
      mada: {spin: f}, folder, chat: f, stage: 'nelehLeft',
    });
    if (k >= close) drawBlankPage(fb, PAGE_AT[0], PAGE_AT[1], k < close + 3 ? 'edge' : k < close + 6 ? 'turn' : 'blank');
  }});
// ---- S4.13e: the statement's tail (C15: its second sentence runs 0.8 s into this shot) on Tasya's own mouth
const boardBg = (o: BoardPlateOpts = {}) => (b: Buf) => { const opt: BoardPlateOpts = {laptop: true, rolodex: true, blueprint: 0, ...o}; drawBoardPlate(b, 0, opt); drawBoardPlateTable(b, 0, opt); drawBoardPlateFront(b, 0, opt); };
L.add('S4.13e', {kind: 'V', st: V('S4.13e', 'v5 S4.13e copied: Tasya lip-synced while his statement\'s last words (v3-a4-0001, carried from S4.13) still play, then his smile; the sign up on the mark'),
  face: {TASYA: 'lip'},
  draw: (fb, k, sh) => {
    const sg = mk(sh, 'sign', 4), jg = mk(sh, 'jangle', 8);
    held(fb, 'v3a4:s413', (b) => { boardBg({slate: true, door: 5, laptop: false, rolodex: 'still'})(b); soft(b, 2); vignette(b, 318, 2); });
    const talk = lipOn(sh, k, 'TASYA');
    drawBust(fb, tasyaPhonePortrait({mouth: talk ? mouth(sh, k, 'TASYA') : 'smile', lid: blink(k, 9), brow: 'warm', arms: 'ring', jangle: (k >= jg && k < jg + 8 ? (k >> 1) % 2 : 0) as 0 | 1, read: false}), {third: 'R', dx: 4});
    doorFrame(fb, 246, 172, {leaf: 'left', leafW: 58, light: PAL.N5});
    if (k >= sg) {
      const up = Math.max(0, 6 - (k - sg) * 2);
      const w = bpw('MAS · GERG →') + 20, x = 262, y = 126 + up, h = 34;
      rect(x - 1, y - 1, w + 2, h + 2, fb.ink(PAL.N0)); rect(x, y, w, h, fb.ink(PAL.P2)); rect(x, y + h - 3, w, 3, fb.ink(PAL.P0));
      bpt(fb, 'MAS · GERG →', x + 10, y + 9, PAL.N2);
      for (let j = 0; j < 3; j++) { const fx = x + w - 34 + j * 7; rect(fx, y + h - 5, 6, 7, fb.ink(PAL.S3)); rect(fx, y + h - 5, 6, 1, fb.ink(PAL.S4)); rect(fx + 5, y + h - 4, 1, 6, fb.ink(PAL.S1)); }
      rect(x + w - 40, y + h - 9, 5, 9, fb.ink(PAL.S3)); rect(x + w - 40, y + h - 9, 5, 1, fb.ink(PAL.S4));
    }
  }});

L.add('S4.15', {kind: 'V', st: V31('the v5 layout (v3 27.31, Mada right third, his spinner) + the face light (kits/face-light faceKey, 2 steps)'),
  draw: (fb, k, sh, f) => { const out = v5(fb, k, sh, f); faceLight(fb, HEAD_R, 2, -1); return out; }});

// ================================================================== S5 · HIS SIDE, 2 AM
L.add('S5.02', {kind: 'V', st: V('S5.02', 'v5 (v2 29.00 the home shot) + the arrival (2.6 -> 4.5 s) as a slow drift, 1 px / 12 f (9 px)'),
  draw: (fb, k, sh, f) => { const out = v5(fb, k, sh, f); shiftRoom(fb, drift(k, 12, 9)); return out; }});
// ---- S5.03 (v3.2): the app's heart count on screen, 406 -> 407 -> 406, as his count says it
L.add('S5.03', {kind: 'V', st: V('S5.03', 'v3.2: the v5 layout + the app\'s heart count in the app bar over the phone\'s screen (art/v32 heartCount): 405 until his first heart, 406 on it, 407 and back to 406 a beat before his inner voice says each (the count is on the phone, script-v32-notes §10.7); v3.3 (P16): each change ticks visibly, the number rolling up in 2 held frames and the heart beating a rung brighter'),
  marks: {c407: ['w', 'v3-vo-20', 'seven', -6]},
  draw: (fb, k, sh, f) => {
    const out = v5(fb, k, sh, f);
    const t1 = mk(sh, 'tap1', 28), c7 = mk(sh, 'c407', 66), l = lineOf(sh, 'v3-vo-20');
    const w6 = l ? l.words.filter((w) => w[0] === 'six') : [];
    const c6b = w6.length > 1 ? l!.s + w6[1][1] - 6 : c7 + 40;
    const ch: Array<[number, number]> = [[t1, 406], [c7, 407], [c6b, 406]]; // (frame, the count from it)
    let cur = 405, prev = 405, since = 99;
    for (const [at, v] of ch) if (k >= at) { prev = cur; cur = v; since = k - at; }
    heartCount(fb, cur, undefined, {prev, k: since});
    return out;
  }});
L.add('S5.05', {kind: 'V', st: V31('the v5 layout (v3 29.05, Mas left third turned to the Orb, the rack) + the face light (kits/face-light faceKey, 2 steps, the Orb\'s side)'),
  draw: (fb, k, sh, f) => { const out = v5(fb, k, sh, f); faceLight(fb, HEAD_L, 1, 1); return out; }});
// ---- S5.09: HE calls Gerg (draft 7): the call app, GERG clicked, the ring out, then v5's tile opening
const T509 = {x: 110, y: 22, w: 258, h: 138};
const mas = (s: Partial<MasPortraitState> = {}) => masPortrait({...MAS_PORTRAIT_DEFAULT, look: -1, ...s});
const darkBg = (o: DarkPlateOpts = {}) => (b: Buf) => { const opt: DarkPlateOpts = {tally: 3, glass: true, lanyard: true, ...o}; drawDarkPlate(b, 0, opt); drawDarkPlateDesk(b, 0, opt); drawDarkPlateFront(b, 0, opt); };
L.add('S5.09', {kind: 'V', st: V31('v5 S5.09\'s [OTS] copied (his monitor across the dark room, soft 3; his shoulder with the monitor\'s green rim) with the call going OUT: kits/act4-v31 callOutPainter on the monitor at 1:1, the call app with GERG on top, GERG pressed, then Calling… with the pulses on 6s under the RING; on the dialog_ok_click (the pick-up) v5\'s tile opens in 3 held steps and Gerg is there, typing, lip-synced (calm)'),
  draw: (fb, k, sh, f) => {
    const ring = mk(sh, 'ring', 4), click = mk(sh, 'click', 63), g = mk(sh, 'glance', 9999);
    const talk = talking(sh, k, 'GERG');
    held(fb, 'v3a4:s509bg', (b) => { darkBg({tally: 3, glass: true, lanyard: true, phone: 'up'})(b); shiftRoom(b, -60); soft(b, 3); vignette(b, 240, 2); });
    const T = T509;
    rect(T.x - 8, T.y - 8, T.w + 16, T.h + 16, fb.ink(PAL.G1)); rect(T.x - 8, T.y - 8, T.w + 16, 1, fb.ink(PAL.G3)); rect(T.x - 1, T.y - 1, T.w + 2, T.h + 2, fb.ink(PAL.N0));
    const scr = new Buf(T.w, T.h, PAL.N0);
    const openK = k - click;
    if (openK < 0) callOutPainter({phase: k < ring - 2 ? 'app' : k < ring ? 'click' : 'ring', k: k - ring})(scr, f);
    else {
      const open = openK >= 6 ? 1 : [0.1, 0.33, 0.66][Math.min(2, openK >> 1)];
      if (open < 1) callOutPainter({phase: 'ring', k: k - ring})(scr, f);
      const gb = new Buf(480, 270, PAL.N0);
      drawGergMediumPOV(gb, 0, 0, {head: talk ? 'talk' : k >= g ? 'up' : 'type', mouth: mouth(sh, k, 'GERG')}, {f: k, speaking: talk, typing: !talk && k < g - 4, open, calm: true});
      const hh = open >= 1 ? T.h : Math.max(3, Math.round(144 * open)) + 4, y0 = open >= 1 ? 0 : Math.round((T.h - hh) / 2);
      for (let y = y0; y < (open >= 1 ? T.h : y0 + hh); y++) for (let x = 0; x < T.w; x++) scr.set(x, y, gb.get(T.x + x, T.y + y));
    }
    for (let y = 0; y < T.h; y++) for (let x = 0; x < T.w; x++) fb.set(T.x + x, T.y + y, scr.get(x, y));
    rect(T.x + T.w / 2 - 12, T.y + T.h + 8, 24, 20, fb.ink(PAL.G1));
    for (let y = T.y + T.h + 8; y < RH; y++) for (let x = T.x - 30; x < T.x + T.w + 30; x++) if (((x + y) & 3) === 0) fb.set(x, y, stepColor(fb.get(x, y), 1));
    blitImg(fb, shoulder(mas({head: '34'}), 70, PAL.L3, 1, true), -38, 30);
  }});
let LETTER_L: ReturnType<typeof letterLayout> | null = null;
L.add('S5.06', {kind: 'V', st: V('S5.06', 'v5 S5.06 copied (the letter, the quotes, the odometer, the scroll to ALYI) + art/texts letterAlyiV3: the signature row ALYI, as the lock (v5 lettered ALYI (REPORTED))'),
  draw: (fb, k, sh, f) => {
    const q: [number, number, number] = [mk(sh, 'q1', 40), mk(sh, 'q2', 207), mk(sh, 'q3', 344)];
    const sc = mk(sh, 'scroll', 457), alyi = mk(sh, 'alyi', 493), clunk = mk(sh, 'clunk', 450), c700 = mk(sh, 'c700', 310);
    const counts = sh.texts.filter((t) => t.kind === 'label' && /^SIGNED \d+/.test(t.text)).map((t) => ({s: t.s, v: parseInt(t.text.slice(7), 10)})).sort((a, b) => a.s - b.s);
    let count = counts.length ? counts[0].v : 505;
    for (let i = 1; i < counts.length; i++) {
      if (k < counts[i].s) break;
      const from = counts[i - 1].v, to = counts[i].v, n = Math.min(12, k - counts[i].s);
      count = from + Math.round(((to - from) * n) / 12);
    }
    const Ly = (LETTER_L ??= letterLayout());
    const stops: Array<[number, number]> = [[q[1], Math.max(0, Ly.quoteY[1] - 60)], [q[2], Math.max(0, Ly.quoteY[2] - 60)], [sc, Math.min(LETTER_SCROLL_MAX, Math.max(0, Ly.alyiY - 70))]];
    let scroll = 0;
    for (let t = 0; t <= k; t++) {
      const target = stops.filter(([at]) => t >= at).map(([, v]) => v).pop() ?? 0;
      if (scroll < target && t % 2 === 0) scroll = Math.min(target, scroll + (t >= sc ? 6 : 1));
    }
    const talk = talking(sh, k, 'GERG');
    drawStaffLetter(fb, {k, f, quotes: q, count, clunk: k >= clunk && k < clunk + 2, scroll: Math.min(LETTER_SCROLL_MAX, scroll), alyi: k >= alyi,
      alyiThumb: 'onMark', gergCalm: true, gerg: {mouth: mouth(sh, k, 'GERG'), head: talk ? 'talk' : 'type', typing: !talk}, window: k >= c700 ? 1 : 0});
    letterAlyiV3(fb, Math.min(LETTER_SCROLL_MAX, scroll), k >= alyi);
  }});
L.add('S5.07b', {kind: 'V', st: V31('the v5 layout (the quiet beat, "alyi voted.") + the face light (kits/face-light faceKey, 2 steps, the monitor\'s side): measured at 4.3% luma in v3'),
  draw: (fb, k, sh, f) => { const out = v5(fb, k, sh, f); faceLight(fb, HEAD_L, 1, -1); return out; }});
L.add('S5.09b', {kind: 'V', st: V31('the v5 layout (swaps-act4 drawGergTileWide: his look up into the lens, held; his eyes drop and he types after "keep building.") + the face light on his face (kits/face-light faceKey, 2 steps, from above)'),
  draw: (fb, k, sh, f) => { const out = v5(fb, k, sh, f); faceLight(fb, [150, 0, 340, 150], 2, -1); return out; }});
// ---- S5.11 (v3.2): the door, the desks, the rent; then the MACROSOFT badge under the door, his hand, both badges
L.add('S5.11', {kind: 'V', st: V('S5.11', 'v3.2: v5 S5.11 copied (twoshots drawDark2S, Mas lip-synced; the slate door steps up on the thunks, Tasya\'s sign, the key in 3 held drawings, the crack, and on "desk" the desks beyond) to "Due on the first."; then the badge: CUT to kits/act4-v32 drawBadgeUnderDoor [ECU] at floor level, the MACROSOFT badge sliding out under the door in held positions from the folder_slide and ticking against his chair leg on the pen_tick; his hand comes down and lifts it; back in the 2S (drawBadgeReach2S, v5\'s door layered as v5 does) he leans down for it without getting up, sits up looking down, and on the key_tap_space sets it on the desk beside the GUEST lanyard, square; he doesn\'t put it on'),
  marks: {key: ['mark', 'door4', 4], slide: ['snd', 'folder_slide', 1, 0], tick: ['snd', 'pen_tick_1', 1, 0], set: ['snd', 'key_tap_space', 2, 0]},
  draw: (fb, k, sh, f) => {
    const d = [mk(sh, 'door1', 4), mk(sh, 'door2', 12), mk(sh, 'door3', 19), mk(sh, 'door4', 26)];
    const key = mk(sh, 'key', 30), crack = mk(sh, 'crack', 50), open = mk(sh, 'open', 162);
    const sl = mk(sh, 'slide', 297), tick = mk(sh, 'tick', 319), set = mk(sh, 'set', 357);
    const ecu0 = sl - 6, back = tick + 16;
    if (k >= ecu0 && k < back) { // the floor at the door: the badge slides out and ticks against his chair leg; his hand
      const slide = (k < sl ? 0 : k < tick ? 1 + Math.min(2, Math.floor(((k - sl) * 3) / Math.max(1, tick - sl))) : 4) as 0 | 1 | 2 | 3 | 4;
      const hand = (k < tick + 7 ? 0 : k < tick + 11 ? 1 : 2) as 0 | 1 | 2;
      drawBadgeUnderDoor(fb, f, {slide, hand});
      return;
    }
    const door = d.filter((t) => k >= t).length as 0 | 1 | 2 | 3 | 4;
    const layDoor = () => {
      if (door >= 4) { drawSlateDoorOpen(fb, k, {key: keyTurnAt(k, key), gap: k >= open ? SLATE_GAP.open : k >= crack ? SLATE_GAP.crack : 0}); slateDoorSign(fb, 0); }
      else if (door >= 2) slateDoorSign(fb, 4 - door);
    };
    if (k < ecu0) { // v5's S5.11
      drawDark2S(fb, k, {mas: {arm: 'rest', mouth: mouth(sh, k, 'MAS'), lid: blink(k, 7)}, orb: {look: door >= 1 ? DPLATE_LOOK.door : DPLATE_LOOK.face}, plate: {tally: 3, lanyard: true, phone: 'up', door}});
      layDoor();
      return;
    }
    const reach = k < back + 12;
    const badges = k >= set;
    const lookDown = k < set + 8;
    drawBadgeReach2S(fb, f, {reach, badges, plate: {tally: 3, lanyard: true, phone: 'up', door: 4},
      mas: reach ? {lid: 0} : {head: lookDown ? 'down' : '34', arm: 'rest', lid: blink(k, 7)}, orbLook: reach ? undefined : badges ? DPLATE_LOOK.lanyard : DPLATE_LOOK.face});
    layDoor();
  }});
L.add('S5.12', {kind: 'V', st: V('S5.12', 'v5 S5.12 copied + his blinks through the aftermath (2.9 -> 5.5 s): the rack to the door, then the hold is his; v3.2: the MACROSOFT badge on the desk beside the lanyard, where S5.11 set it (drawBadgeReach2S\'s spot)'),
  draw: (fb, k, sh) => {
    const st = rackStep(k, mk(sh, 'rack', 41));
    const [kA, kB] = RACK[st];
    const doorMask = new Uint8Array(480 * 270);
    keepRect(doorMask, DPLATE.door.x0 - 2, DPLATE.door.y0 - 2, DPLATE.door.x1 - DPLATE.door.x0 + 4, DPLATE.deskY - DPLATE.door.y0 + 4);
    held(fb, `v3a4:s512:${kB}`, (b) => {
      const plate: DarkPlateOpts = {tally: 3, glass: true, lanyard: true, phone: 'up', door: 4};
      drawDarkPlate(b, 0, plate); drawSlateDoorOpen(b, 0, {gap: SLATE_GAP.open}); slateDoorSign(b, 0);
      drawDarkPlateDesk(b, 0, plate); macrosoftBadge(b, DPLATE.lanyard.x + 46, DPLATE.lanyard.y + 3, 'desk'); drawDarkPlateFront(b, 0, plate); // v3.2: the badge he set down in S5.11
      soft(b, 2, doorMask); softMask(b, kB, doorMask); vignette(b, MCU_X.L + 56, 2);
    });
    drawBust(fb, mas({mouth: mouth(sh, k, 'MAS'), look: -1, lid: blink(k + 40, 7)}), {third: 'L', faceK: kA});
  }});


// ================================================================== S6 · THE AVALANCHE
const AVK: Array<[number, number]> = [[0, 0], [108, 232], [144, 252], [190, 336], [236, 430], [266, 520], [300, 780], [380, 880]]; // shots4's (private)
const avT = (u: number) => { for (let i = 1; i < AVK.length; i++) if (u <= AVK[i][0]) { const [a, ta] = AVK[i - 1], [z, tz] = AVK[i]; return Math.round(ta + ((u - a) * (tz - ta)) / (z - a)); } return AVK[AVK.length - 1][1]; };
L.add('S6.01', {kind: 'V', st: V31('the v5 layout (v4\'s avalanche on the board grid, on its one clock) + art/v31 firstTileStrip: the letter\'s header strip, STAFF LETTER · TO THE BOARD (kits/act4-v31 letterHeaderStrip), on the first employee tile as it falls and lands; the pour buries it'),
  draw: (fb, k, sh, f) => { const out = v5(fb, k, sh, f); firstTileStrip(fb, avT(k)); return out; }});

// ================================================================== S7 · THE RETURN
// ---- S7.02 / S7.02b (v3.3, S4 / S5 / P17): the employee speaks among the boxes; then Tasya's interview on the wall TV
/** the walkout crowd's pixels (the room with its crowd against the room without): the wall TV hangs behind them */
let CROWD_MASK: Uint8Array | null = null;
const crowdMask = () => (CROWD_MASK ??= (() => {
  const a = new Buf(480, 270, PAL.N0), b = new Buf(480, 270, PAL.N0);
  drawBullpen(a, 0, {variant: 'walkout'}); drawBullpen(b, 0, {variant: 'walkout', crowd: false});
  const m = new Uint8Array(480 * RH);
  for (let i = 0; i < 480 * RH; i++) m[i] = a.c[i] !== b.c[i] ? 1 : 0;
  return m;
})());
const tvFree = (x: number, y: number) => !crowdMask()[y * 480 + x];
const EMP_AT: [number, number] = [372, 199]; // where Tasya stood in v3.2's S7.02, facing Mas at his end desk
const S702_DRIFT = (k: number) => -Math.min(10, Math.floor(k / 14)); // toward her, 1 px / 14 f
const slateStep = (k: number, t: number) => (k < t ? 0 : k < t + 5 ? 1 : k < t + 10 ? 2 : 3); // v5 stepOf5
L.add('S7.02', {kind: 'V', st: V('S7.02', 'v3.3: v5 S7.02\'s walkout wide (coats, packed boxes, Mas at his end desk, the badges on it) with THE EMPLOYEE who asked "Is this a coup?" where Tasya stood, a box in her arms, facing Mas (art/v33 drawEmployee: the room\'s walkout extra with her tile\'s hair and skin, the green parka), her face lit one rung, the frame drifting toward her; v3.3b (the newcomer: "I can\'t find who\'s speaking"): the two other green parkas re-coated (art/v33 recolourCrowd), so hers is the one green coat, and on her line\'s first word the stepped push in, one drawn size: her [M] (art/v33 drawEmployeeM, on the civic kit: her long dark hair, the green parka, the box in her arms, lip-synced, blinking) over the bullpen soft behind her (framing mcuRoom), a whole-pixel drift; behind her in the wide, the bullpen\'s wall TV plays softly (art/v33 drawWallTV: Tasya at a podcast mic, listening)'),
  face: {EMPLOYEE: 'lip', MAS: null},
  marks: {push: ['on', 'v33-a4-0001', 0]},
  draw: (fb, k, sh, f) => {
    const push = mk(sh, 'push', 33);
    if (k >= push) { // [M]: her, close, speaking
      held(fb, 'v3a4:s702-m-bg', (b) => { bullpenRoom(b, 0, {variant: 'walkout'}, {mas: false, tasya: null, landlord: {floor: 0, ceiling: 0, walls: 0}}); recolourCrowd(b); mcuRoom(b, {third: 'R'}); });
      shiftRoom(fb, -Math.min(6, Math.floor((k - push) / 16)));
      drawEmployeeM(fb, {mouth: mouth(sh, k, 'EMPLOYEE'), lid: blink(k, 4), look: -1});
      return;
    }
    const em = roomMouth(sh, k, 'EMPLOYEE');
    held(fb, `v3a4:s702e-${em}`, (b) => {
      const A = bullpenRoom(b, 0, {variant: 'walkout'}, {mas: {mouth: 'rest'}, tasya: null, landlord: {floor: 0, ceiling: 0, walls: 0},
        stage: (bb) => drawEmployee(bb, EMP_AT[0], EMP_AT[1], {mouth: em, flip: true})});
      recolourCrowd(b);
      badgesOnDeskRoom(b, A.masDesk[0] + BADGES_ROOM_AT[0], A.masDesk[1] + BADGES_ROOM_AT[1]);
      const [hx0, hy0, hx1, hy1] = EMPLOYEE.head, x0 = EMP_AT[0] - EMPLOYEE.foot[0], y0 = EMP_AT[1] - EMPLOYEE.foot[1];
      faceKey(b, x0 + EMPLOYEE.w - hx1, y0 + hy0, x0 + EMPLOYEE.w - hx0, y0 + hy1, 1, -1); // her face, flipped: lit from Mas's side
    });
    drawWallTV(fb, {f, mouth: 'smile', lid: blink(k, 9)}, tvFree);
    shiftRoom(fb, S702_DRIFT(k));
  }});
L.add('S7.02b', {kind: 'V', st: V('S7.02b', 'v3.3b (audit #10: "the podcast mic isn\'t drawn"; the newcomer): the cut in to the bullpen\'s wall TV, from the wide to an insert (art/v33 drawTVInsert): the screen fills the frame, and his interview plays on it: TASYA warm-lit on the interview set (acoustic foam, two practicals, the desk), lip-synced (v33-a4-0002 on the TV\'s small speaker), a foam-covered podcast mic on a boom arm in front of him, a PODCAST bug in the corner; a colleague\'s head and a packed box in silhouette in the foreground keep us in the bullpen; round the TV the wall, ceiling and floor step to Macrosoft slate on "around", "above" and "below" (rooms/bullpen toSlate, 3 held steps each); the 1.35 s hold after "…around them." stays on the screen'),
  face: {TASYA: 'lip'},
  draw: (fb, k, sh, f) => {
    const slate = {floor: slateStep(k, mk(sh, 'below', 20)), ceiling: slateStep(k, mk(sh, 'above', 51)), walls: slateStep(k, mk(sh, 'around', 80))};
    drawTVInsert(fb, {f, mouth: mouth(sh, k, 'TASYA'), lid: blink(k, 9), slate});
  }});
L.add('v31-S7.03b', {kind: 'V', st: V31('kits/act4-v31 drawTuesdayInvite [ECU]: his end desk, the GUEST lanyard and the MACROSOFT badge; his phone wakes and the invite slides down in the cold open\'s calendar UI (Board · Tue 10:00 PM, Accept / Decline, a spinner, a fire helmet, a blank); his thumb straight down on Accept on the tap\'s sound (no hover); accepted'),
  marks: {tap: ['snd', 'key_tap_soft_02', 1, 0]},
  draw: (fb, k, sh, f) => {
    const tap = mk(sh, 'tap', 43), wake = 3;
    const ki = k < wake ? 0 : k < wake + 2 ? 1 : k < wake + 4 ? 2 : k < wake + 6 ? 3 : k < wake + 8 ? 4 : 9;
    drawTuesdayInvite(fb, f, {k: ki, thumb: k >= tap - 4 && k < tap + 6 ? 'tap' : 'none', press: k >= tap && k < tap + 3, accepted: k >= tap + 3});
  }});
// ---- S7.06: the door; Terb; the FREEZE and his card; the unfreeze; his dry squeeze (the pin is in); Mas pulls it
const FIRE_PLATES = {A: null, B: 'ALYI', C: null, D: 'NELEH', E: 'THE QUIET VOTE'} as const;
L.add('S7.06', {kind: 'V', st: V31('v5 S7.06 re-staged for draft 7 on the lock\'s sounds: the door bangs, TERB in; the FULL FREEZE (freeze_hit_F) with his card while Mas walks through in colour to his side; the unfreeze; Terb aims at the nearest fire and squeezes on the extinguisher_pin: click, nothing, the pin is in (kits/act4-v31 drawDrySqueeze, the 1 px kick), he frowns at it; Mas, beside him, pulls the pin and pockets it; then v5\'s after (his line, the look-around drawn with the room rigs\' own flip: Terb turns, then Mas). The caption has the click before the freeze; the lock\'s sounds put the freeze first (shots-act4.md)'),
  marks: {squeeze: ['snd', 'extinguisher_pin', 1, 0]},
  draw: (fb, k, sh, f) => {
    const bang = mk(sh, 'bang', 0), helmet = mk(sh, 'helmet', 3), fz = mk(sh, 'freeze', 6), un = mk(sh, 'unfreeze', 101), look = mk(sh, 'look', 157);
    const sq = mk(sh, 'squeeze', 67), unF = Math.min(sq - 9, fz + 52);
    const plate = {fires: FIRES_SC30, door: 'open' as const, rolodex: 'still' as const, plates: {...FIRE_PLATES}, reflection: null};
    if (k < fz) {
      const open = k >= bang;
      boardRoom(fb, k, {fires: FIRES_SC30, door: open ? 'open' : 'closed', doorFlash: k === bang ? 1 : 0, rolodex: 'still', plates: {...FIRE_PLATES}},
        {mada: true, terb: open ? {x: 394 - Math.floor(on2(k - bang) * 1.5), pose: {legs: terbWalkAt(k), helmet: k >= helmet, arm: 'carry'}} : null, shake: doorShake(k, bang)});
      return;
    }
    const tx = 394 - Math.floor(on2(fz - bang) * 1.5), mx = tx - 38;
    if (k < unF) { // THE FREEZE: the room in two tones, his card, Mas in colour walking up beside him
      const kk = k - fz;
      held(fb, `v3a4:s706-freeze-${tx}`, (b) => { boardRoom(b, 0, {fires: FIRES_SC30, door: 'open', rolodex: 'still', plates: {...FIRE_PLATES}}, {mada: true, terb: {x: tx, pose: {legs: 'stand', helmet: true, arm: 'carry', pin: true}}}); freezePrint(b); });
      const x = Math.min(mx, 150 + on2(Math.max(0, kk - 4)) * 4);
      drawMasStand(fb, x, 196, {...MAS_STAND_DEFAULT, legs: x < mx ? masWalkAt(kk) : 'stand', arm: 'down', light: 'room'});
      blipCard(fb, kk, 'TERB', 'TERB', 'THE NEW CHAIR', 'EXTINGUISHERS: 1', {f, x: {helmet: true}}, 'L');
      return;
    }
    const pull = sq + 16, pocket = pull + 6;
    if (k < un) { // unfrozen: Terb aims, squeezes (the dry click), frowns at it; Mas pulls the pin and pockets it
      const aiming = k >= sq - 6 && k < sq + 14, kick = k === sq ? 1 : 0;
      const marm = k < pull - 4 ? 'down' : k < pocket ? 'reach' : 'pocket';
      held(fb, `v3a4:s706-sq-${tx}-${aiming ? 1 : 0}${kick}-${marm}-${k >= pull ? 1 : 0}`, (b) => drawBoardroom(b, {f: 0, ...plate}, {
        wall: (bb) => { if (aiming) drawDrySqueeze(bb, tx, BR.WALL_FLOOR_Y + 8, {k: kick, light: 'fire'}); else drawTerbRoom(bb, tx, BR.WALL_FLOOR_Y + 8, {...TERB_ROOM_DEFAULT, legs: 'stand', helmet: true, arm: 'carry', pin: k < pull}); },
        seated: (bb) => drawMadaSeated(bb, BR.SEATS.R.x, BR.TABLE.floor, {...MADA_SEAT_DEFAULT}, {flip: true, spin: 0}),
        near: (bb) => drawMasStand(bb, mx, BR.TABLE.floor + 4, {...MAS_STAND_DEFAULT, legs: 'stand', arm: marm, light: 'room'}),
      }));
      return;
    }
    const tf = k >= look && k < look + 8, mf = k >= look + 3 && k < look + 11; // the look-around: Terb looks behind him, then Mas
    const m = roomMouth(sh, k, 'TERB');
    held(fb, `v3a4:s706-after-${tx}-${tf ? 1 : 0}${mf ? 1 : 0}-${m}`, (b) => drawBoardroom(b, {f: 0, ...plate}, {
      wall: (bb) => drawTerbRoom(bb, tx, BR.WALL_FLOOR_Y + 8, {...TERB_ROOM_DEFAULT, legs: 'stand', helmet: true, arm: 'carry', pin: false, mouth: m}, {flip: tf}),
      seated: (bb) => drawMadaSeated(bb, BR.SEATS.R.x, BR.TABLE.floor, {...MADA_SEAT_DEFAULT}, {flip: true, spin: 0}),
      near: (bb) => drawMasStand(bb, mx, BR.TABLE.floor + 4, {...MAS_STAND_DEFAULT, legs: 'stand', arm: 'pocket', light: 'room'}, {flip: mf}),
    }));
  }});
// ---- S7.07-cont: the terms; "gerg comes back too." and Terb writes it in
/** the segment frame the chair fire goes out (S7.07's sprayEnd, on THIS lock; v5's CHAIR_FIRE_OUT reads v5's frames) */
const CHAIR_FIRE_OUT = (() => { const s7 = shotOf('S7.07'); return s7 ? s7.s + (s7.marks.sprayEnd ?? 130) : 0; })();
L.add('S7.07-cont', {kind: 'V', st: V31('v5 S7.07-cont copied (the calm-off 2S; Terb reading on, then to Mada; Mas and Mada lip-synced; the chair fire\'s smoke running on from S7.07\'s sprayEnd on this lock), and on "Gerg comes back too." Terb writes it in (kits/act4-v31 drawTerbWriting: the pen, the new line growing in 4 held steps, his room-scale mouth), composited behind the table and the two men as the 2S composites him'),
  draw: (fb, k, sh, f) => {
    const lk = mk(sh, 'look', 60);
    const plateO = {fires: FIRES_CALMOFF(CHAIR_FIRE_OUT)};
    const wl = lineOf(sh, 'v31-a4-0016');
    const writing = wl && k >= wl.s - 4 && k < wl.e + 10;
    const people = {mas: {mouth: mouth(sh, k, 'MAS'), lid: blink(k, 7)}, mada: {mouth: mouth(sh, k, 'MADA')}, spin: f};
    if (!writing) {
      drawCalmOffTerms2S(fb, f, {terb: {pose: {mouth: roomMouth(sh, k, 'TERB'), read: k < lk, blink: blink(k, 11) > 0}}, ...people, plate: plateO});
      return;
    }
    drawCalmOffTerms2S(fb, f, {terb: null, ...people, plate: plateO});
    const n = Math.max(0, Math.min(4, Math.floor(((k - wl!.s) * 5) / Math.max(1, wl!.e - wl!.s))));
    const tmp = new Buf(480, 270, 0x010203);
    drawTerbWriting(tmp, 206, BPLATE.tableY + 22, n, {mouth: roomMouth(sh, k, 'TERB')});
    const plateOnly = new Buf(480, 270, 0);
    drawBoardPlate(plateOnly, f, {laptop: false, rolodex: 'still', ...plateO});
    const ref = new Buf(480, 270, 0);
    drawCalmOff2S(ref, f, {...people, plate: plateO, terb: null});
    for (let y = 0; y < BPLATE.tableY; y++) for (let x = 0; x < 480; x++) {
      const c = tmp.c[y * 480 + x];
      if (c === 0x010203 || ref.c[y * 480 + x] !== plateOnly.c[y * 480 + x]) continue;
      fb.c[y * 480 + x] = c;
    }
  }});
L.add('S7.08', {kind: 'V', st: V('S7.08', 'v3.1: the face light (kits/face-light faceKey, 2 steps, the fires\' side) · v5 S7.08 copied + his blink in the aftermath after "good question." (2.1 -> 3.0 s)'),
  draw: (fb, k, sh) => {
    const o = {third: 'L' as const};
    held(fb, 'v3a4:s708bg', (b) => { boardBg({laptop: false, rolodex: 'still', fires: FIRES_CALMOFF(-40), plates: [{name: 'ALYI', x: 104, fire: true}]})(b); mcuRoom(b, o); });
    drawBust(fb, mas({mouth: mouth(sh, k, 'MAS'), look: 1, head: 'front', light: 'monitor', lid: blink(k + 60, 7)}), o);
    faceLight(fb, HEAD_L, 1, 1); // v3.1: the face light (mood §4 #4)
  }});

// ---- S7.13: k0-127 the v5 layout; k128-263 the Runway insert (Ttemme's stream: browser / PNG frames, runway.md §11)
const S713 = shotOf('S7.13');
export const HOURGLASS = {from: S713.s + 128, to: S713.s + 264};
L.add('S7.13', {kind: 'V', st: V31('the v5 layout for k0-127 (the table from above, the hourglass XL: the last grain, the post); k128-263 are the v31-runway pass\'s insert (studio/src/dev/genvideo/runway/hourglass.py: Ttemme\'s own stream, his cam pixel -> real -> pixel, the shatter at k173, the sand standing, back to the pixel aftermath), spliced as PNG frames (the segment\'s browser frames, option hourglass); the v5 drawing stands under them in stills'),
  marks: {fall: ['mark', 'shatter', 10]},
  draw: (fb, k, sh, f) => v5(fb, k, sh, f)});

// ================================================================== S8 · THE LOBBY, AND AFTER
L.add('S8.03', {kind: 'V', st: V31('v5 S8.03 copied (rooms-a lobby at night without his standing figure; his shoulder in front, tungsten rim) with the Remove dialog re-rhymed (kits/act4-v31 drawRemoveDialog field \'screen\'): Remove greys out one dither step a beat, the empty-tagged arrow steps on and clicks on the bonk: the button doesn\'t go down, the dialog shakes, refused'),
  draw: (fb, k, sh, f) => {
    held(fb, 'v3a4:lobby-s3-nomas', (b) => lobbyRoom(b, 0, {sign: 3}, null));
    const dl = mk(sh, 'dialog', 5), g1 = mk(sh, 'grey1', 15), g2 = mk(sh, 'grey2', 30), c1 = mk(sh, 'click', 57);
    if (k >= dl) {
      const grey = (k < g1 ? 1 : k < g2 ? 2 : 3) as 1 | 2 | 3;
      const [s1x, s1y] = k >= c1 && k < c1 + 8 ? shakeAt(k, c1, SHAKE_DOOR) : [0, 0];
      const at: [number, number] = [100, 34];
      const [bx, by] = removeButton(at[0], at[1]);
      const tgt: [number, number] = [bx + 44 + s1x * 2, by + 10 + s1y * 2];
      let p: [number, number] | null = null;
      if (k >= g2 && k < c1) p = k < c1 - 8 ? [tgt[0] + 92, tgt[1] + 40] : tgt;
      else if (k >= c1 && k < c1 + 8) p = tgt;
      else if (k >= c1 + 8) p = pointerAt(on2(k), c1 + 8, c1 + 14, tgt, [tgt[0] + 26, tgt[1] + 22]);
      drawRemoveDialog(fb, f, {k: k - dl + 1, field: 'screen', grey, pointer: p, tag: '', click: k >= c1 && k < c1 + 2, at, shake: [s1x * 2, s1y * 2]});
    }
    blitImg(fb, shoulder(mas({look: 1}), 70, PAL.W5, 1, true), -40, 40);
  }});
// ---- S8.04 (v3.4, the return): the firing's drawing again, and now we hear him count (v34-vo-11)
L.add('S8.04', {kind: 'V', st: V('S8.04', 'v3.4: v5 S8.04 as it was (the firing\'s CU, S1.10\'s drawing, the lobby\'s tungsten behind him; his face doesn\'t change: dry) with his count struck into the empty right of the frame on its words (art/v34 drawCount, three held steps each): first a quiet echo of Neleh\'s blueprint in its own lettering, pencilled in the tungsten two rungs down: on "four" the four seats\' plates, on "votes" their bracket and VOTES, then the CEO\'s box with EQUITY: 0 under it; then, in his cyan, what he holds: on "landlord" the key, on "money" the ticker climbing, on "gerg" Gerg\'s badge on its lanyard; no caption but the V.O. line; the lips still'),
  marks: {four: ['w', 'v34-vo-11', 'four', 0], votes: ['w', 'v34-vo-11', 'votes', 0], landlord: ['w', 'v34-vo-11', 'landlord', 0], money: ['w', 'v34-vo-11', 'money', 0], gerg: ['w', 'v34-vo-11', 'gerg', 0]},
  draw: (fb, k, sh, f) => {
    const out = v5(fb, k, sh, f);
    const at = (m: string, d: number) => k - mk(sh, m, d);
    drawCount(fb, {four: at('four', 18), votes: at('votes', 25), landlord: at('landlord', 62), money: at('money', 89), gerg: at('gerg', 108)});
    return out;
  }});
L.add('S8.05', {kind: 'V', st: V('S8.05', 'v5 S8.05 + the hold after "okay." breathes: the far warm lights (the bokeh, the tea-lights) flicker, each on its own, one palette step on held 5 f (left of the lamp\'s glow)'),
  draw: (fb, k, sh, f) => {
    const out = v5(fb, k, sh, f);
    const tk = Math.floor(k / 5);
    for (let y = 0; y < 150; y++) for (let x = 0; x < 250; x++) { // left of the lamp's big glow: the bokeh and the tea-lights
      const c = fb.c[y * 480 + x], fam = familyOf(c);
      if (!fam || (fam[0] !== 'W' && fam[0] !== 'R') || fam[1] < 2) continue;
      if (hash(x >> 3, y >> 3, tk) < 0.3) fb.c[y * 480 + x] = stepColor(c, -1);
    }
    return out;
  }});
L.add('S8.10', {kind: 'V', st: V('S8.10', 'v5 S8.10 + the act\'s last image held one second longer, a slow drift 1 px / 10 f'),
  draw: (fb, k, sh, f) => { const out = v5(fb, k, sh, f); shiftRoom(fb, drift(k, 10, 12)); return out; }});



// ================================================================== every other shot: the v5 layout, as it was
const GLYPHY = /GLYPH|glyph|dissolve/;
for (const sh of LOCK.shots) {
  if (L.all[sh.id]) continue;
  const d = DRAW5[sh.id];
  if (!d) continue; // none: `check` fails on a shot with no layout
  L.add(sh.id, {kind: 'P', st: `P · v5 ${d.kind} as it was: ${d.st}`, standin: d.standin, glyph: GLYPHY.test(d.st), draw: (fb, k, s, f) => v5(fb, k, s, f)});
}

// ================================================================== inner voice never moves his mouth
/** Mas's V.O. (kind 'vo', the stick's tag "V.O.") is never lip-synced, in any framing, whatever a face table says: the
 *  lipsync helpers draw a mouth for any faced line of the speaker, so every layout gets its shot with the V.O. lines'
 *  faces cleared (a memoized copy; shots with no faced V.O. pass through as the host's own object, so the lip-sync
 *  caches keep their line objects). On this lock no V.O. line is faced (measured); this keeps it so */
const NO_VO_MOUTH = new WeakMap<PxShot, PxShot>();
const noVoMouth = (sh: PxShot): PxShot => {
  if (!sh.lines.some((l) => l.kind === 'vo' && l.face)) return sh;
  let c = NO_VO_MOUTH.get(sh);
  if (!c) { c = {...sh, lines: sh.lines.map((l) => (l.kind === 'vo' && l.face ? {...l, face: null, lip: false} : l))}; NO_VO_MOUTH.set(sh, c); }
  return c;
};
for (const [id, lay] of Object.entries(L.all)) { const d = lay.draw; L.all[id] = {...lay, draw: (fb, k, sh, f) => d(fb, k, noVoMouth(sh), f)}; }

export const SEGMENT = defineSegment({
  seg: 'act4',
  lock: LOCK,
  layouts: L.all as Record<string, Layout>,
  options: {badge: false, vo: 'typed', voLowercase: true, subs: 'off', standin: 'stick', j1: false, hourglass: true},
  review: {
    title: 'MR. MAS · EP1 · ACT FOUR',
    subtitle: 'PIXEL v3.4 · LOCK act4 (THE v3.4 STICK TIMING)',
    kindNames: {P: 'P · THE v5 LAYOUT, ON THE v3.4 LOCK', V: 'V · A v3 – v3.4 CHANGE (see st)'},
    sideBadge: false,
    durNote: 'AS THE v3.4 STICK',
    soundLabel: 'SOUND · TEMP TRACK = THE v3.4 STICK MIX (ACT FOUR)',
    textFix: factsText5,
  },
  // S7.13 k128-263: the Runway hourglass insert, spliced from PNGs (studio/src/dev/genvideo/runway/hourglass.py --png
  // GLYPH_DIR --s713 <S7.13's first frame>); option hourglass=false leaves them to the layout (e.g. for the Remotion
  // GLYPH step, which has no browser component for them)
  browser: {frames: (f, o) => o.hourglass !== false && f >= HOURGLASS.from && f < HOURGLASS.to, note: 'S7.13 k128-263: the Runway hourglass insert (PNG frames; option hourglass)'},
});
