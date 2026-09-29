// MR. MAS — Ep1 v3 · ACT TWO, "the regulate-me tour" (sc 13–17): one layout per shot of the v3 lock (act2/data.ts,
// tools/lock.py on show/reel/ep01-v3/ep01-v3-act2.json). Written by the `v3-shots-act2-act3` pass on the `v3-art-b`
// pass's sets, cast and kits (show/episodes/ep01/production/full-v3/art/art-b.md) and art-a's RADNUS room sprite; the
// one new drawing is RADNUS at bust size (./art/radnus-bust.ts, additive: it takes the stand-in's place in THIS
// segment's two-shots and pan). The record: show/episodes/ep01/production/full-v3/shots-act2.md.
// v3.1 (script draft 7, the v3.1 lock show/reel/ep01-v31/ep01-v31-act2.json): 13.13 splits "Longer.", 13.14 -> 14.01 is a
// match cut (the print in his hand becomes his phone in the same place in frame), the feed scrolls from his own post to
// the clip under his V.O., 14.02 / 15.17 / 15.18 are cut, 15.02 is the chairman's real line, 17.12 is the glass side-on.
// v3.2 (script draft 8.1, show/reel/ep01-v32/ep01-v32-act2.json; SHOWRUNNER-NOTES 00 and 0: his moves read on screen):
// 13.01 he's already in the seat nearest the teacher while the others settle; the V.O. lines are cut (his moves carry
// them); 13.10 is Radnus's MCU with the flame; 14.01 his thumb drags the clip back and plays it again under a readable
// tag; 14.03 folds the repost in; 15.15 his proposal, over his shoulder, then the sheet slides on "licenses"; 16.01 his
// own hand stamps the added date; 17.12 his face on the water, broken by the crack (cut in v3.3). Plates carry one relation word.
// v3.3 (script draft 8.2, show/reel/ep01-v33/ep01-v33-act2.json; a polish): 13.09 "he's not wrong." (V.O.) is back
// before the knife, his eyes off Radnus and his mouth shut under it; 14.01's clip is drawn unmistakably as a generic
// anchor at a news desk, its lower third blank (not the senator, nobody real); 17.10's order is in MARIO's hand (his
// fleece sleeve, his wet footnote, his scroll), Mas's hand half out, empty; the glass (17.12) is cut: 17.11 ends the act on
// the chip-maker's price lifting off the register as the intro's curve and climbing off the top of the frame, then the
// empty sky; 17.13's black carries the bell's tail.
// v3.4 (script draft 8.3, show/reel/ep01-v34/ep01-v34-act2.json; SHOWRUNNER-NOTES 000: the planner, hinted): Sirrah's
// line is cut (her pointer on A, then I); "he's not wrong." is cut; Nedib's card loses its stat; 13.13's new V.O. "mine's
// half written." is an insert of his hand resting on the folded page in his hoodie pocket (PLEASE / REG, his ask from
// Act One's desk), his lips out of frame; 14.01 is the class photo alone, holding to the black (the clip is cut, and so
// are 14.03 and 14.05).
// v3.5 (script draft 8.4, show/reel/ep01-v35/ep01-v35-act2.json; the final version): Nedib's card has its stat again
// (DEEPFAKES OF ME: SEEN 0, paid in Act Three); 14.01 the Senate reminder slides over his feed and he draws the folded
// page up out of his pocket (PLEASE REG—), then rests his hand on it; the Senate opens on that page under the same hand
// at the witness table and tilts up to the hearing (v35-27.00); THE CLONE is gone (rooms/senate `noClone`): the chairman
// alone, the sheet into his hand, Mas's own "i get paid enough for health insurance." in the wide; 15.14 ends on his
// hand setting the wallet down; MAR 2019 (v35-28.*, art/v35.ts) comes in on the intro's render front from that hand to
// the same hand setting a marker on the whiteboard's tray, and goes out on it from the check under the door to a
// senator's blank pad; the tour (v35-29.*) is his passport's stamps, his page to hands under desk flags, the London
// lectern, NOTERB's post and his; the guest book's page becomes the one-sentence letter on many desks (17.01), the names
// scroll, and every signer's hand holds an order (17.10).
// Rules kept: native 480 x 270, the master palette, whole-pixel moves, held drawings; Mas frame left; arrivals open wide
// on the room with its people; marks land on the stick's sound spots and the takes' words; mouths only where the framing
// shows one (the `face` table); no side badges, no pointer text: plates are names only, and the four gag cards
// (SIRRAH, NEDIB, SUCRAM, NESNEJ) are the show's freeze-frame cards, placed so they never cover the face they name.
import {defineSegment, layouts, mk, mouth, roomMouth, RH, shiftRoom} from '../kit';
import type {Viseme} from '../../../../shared/pixel/cast/talk';
import {Buf, rect, hash, bayer, clamp} from '../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../shared/pixel/palette';
import {text} from '../../../../shared/pixel/font';
import * as WH from '../../../../shared/pixel/rooms/whitehouse';
import {drawBigFlame} from '../../../../shared/pixel/kits/wh-props';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../shared/pixel/cast/mas';
import {marioPortraitImg, MARIO_PORTRAIT_REST} from '../../../../shared/pixel/cast/mario';
import {tasyaSpeakPortrait, TASYA_PORTRAIT_DEFAULT} from '../../../../shared/pixel/cast/tasya-speak';
import {putBustCut} from '../../../../shared/pixel/cast/civic-kit';
import {drawMasStand, MAS_STAND_DEFAULT} from '../../../../shared/pixel/cast/mas-stand';
import * as BB from '../../../../shared/pixel/rooms/bay-bridge';
import * as SN from '../../../../shared/pixel/rooms/senate';
import * as SP from '../../../../shared/pixel/kits/senate-props';
import {lahtBust, LAHT_BUST_DEFAULT} from '../../../../shared/pixel/cast/lahtnemulb';
import {sucramBust, SUCRAM_BUST_DEFAULT} from '../../../../shared/pixel/cast/sucram';
import * as RT from '../../../../shared/pixel/rooms/rooftop';
import * as RG from '../../../../shared/pixel/kits/register';
import {radnusBust2, RADNUS2_DEFAULT, RADNUS2_COLLAR, drawExtinguisherSmall} from './art/radnus-bust';
import {drawHalfWrittenECU} from './art/half-written';
import * as V35 from './art/v35';
import {spoken, blink, stepOf, heldLerp, marioM, nesnejM, roomM, freeze2, maskOf, lighten, drawGagCard, namePlate, FREEZE_BRIGHT, FREEZE_SKY, sweep} from './kit2';
import type {GagCard} from './kit2';
import {crateSlip, boardOut, chassis, aisle} from './art/racks';
import {LOCK} from './data';

const L = layouts();
const talk = (v: Viseme, rest: Viseme = 'rest'): Viseme => (v === 'rest' ? rest : v);
/** a silent room-scale mouth (rehearsing under his breath): held drawings, never on a take */
const silentRoom = (kk: number): 'open' | 'smile' => (['open', 'smile', 'open', 'open', 'smile', 'smile', 'open', 'smile'] as const)[(kk >> 2) % 8];
const cache = new Map<string, (x: number, y: number) => boolean>();
const keepOf = (key: string, draw: (b: Buf) => void) => { let m = cache.get(key); if (!m) { m = maskOf(draw); cache.set(key, m); } return m; };

// ------------------------------------------------------------------ the gag cards (text blocks in each shot's empty corner)
const CARD_SIRRAH: GagCard = {x: 14, y: 12, name: 'SIRRAH', lines: ['THE EXPLAINER'], stat: ['DAY JOB: VICE PRESIDENT'], accent: PAL.U5};
const CARD_NEDIB: GagCard = {x: 14, y: 12, name: 'EOJ NEDIB', lines: ['THE PRESIDENT'], stat: ['DEEPFAKES OF ME: SEEN 0'], accent: PAL.W7}; // v3.5: the stat is back (Act Three's deepfake pays it: SEEN 1)
const CARD_SUCRAM: GagCard = {x: 470, y: 12, name: 'SUCRAM', lines: ['CALLED IT.', '(BEFORE LAUNCH.)'], stat: ['STAMPS: ALL', 'PARTIALLY: SOME'], accent: PAL.R3, align: 'right'};
const CARD_NESNEJ: GagCard = {x: 470, y: 12, name: 'NESNEJ', lines: ['SELLS SHOVELS.', 'FUNDS DIGGERS.'], stat: ['POCKETS: 1'], accent: PAL.W6, align: 'right'};

// =================================================================== sc 13 · THE WHITE HOUSE
L.add('13.01', {
  st: 'ARRIVAL · rooms/whitehouse drawWHWide {settle, masGlass} (v3.2: HIS MOVE, the seat: MAS is already seated nearest SIRRAH, his own glass set down square in front of him, while RADNUS and MARIO are still settling into theirs, half-risen and arriving, and settle as the shot runs); SIRRAH\'s pointer between the A block and the class; Radnus\'s small collar flame; Radnus mouthing his sentence silently from the first frame; Mario\'s finger half up once he\'s down',
  enter: {kind: 'dip', frames: 8},
  draw: (fb, k, sh, f) => {
    const ph = k % 72;
    const rm = ph < 52 ? silentRoom(ph) : 'smile';
    const on = (k % 56) < 36 ? 'A' : 'row';
    const settle = {radnus: (k < 44 ? 1 : 0) as 0 | 1 | 2, mario: (k < 22 ? 2 : k < 64 ? 1 : 0) as 0 | 1 | 2};
    WH.drawWHWide(fb, f, {sirrah: {on, mouth: 'smile'}, settle, masGlass: true, finger: k >= 72 ? 1 : 0, flame: 1, mouths: {radnus: rm}});
  },
});
L.add('13.02', {
  st: 'rooms/whitehouse drawSirrahMCU (SIRRAH right third, the blocks at MCU size, the pointer on A, then landing on I at the freeze; v3.4: her line is cut, so her mouth stays at its smile) + the 2-tone freeze (15 f) and the SIRRAH gag card, riding on after the room moves again (13.03, 13.04 merged)',
  marks: {freeze: ['beat', '13.03', 0], ride: ['beat', '13.04', 0]},
  draw: (fb, k, sh, f) => {
    const fz = mk(sh, 'freeze', 92), ride = mk(sh, 'ride', 107);
    if (k >= fz && k < ride) {
      WH.drawSirrahMCU(fb, sh.s + fz, {on: 'I', sirrah: {mouth: 'smile', lid: 0}});
      freeze2(fb, undefined, FREEZE_BRIGHT);
    } else WH.drawSirrahMCU(fb, f, {on: k < fz ? 'A' : 'I', sirrah: {mouth: 'smile', lid: blink(k, 3)}});
    drawGagCard(fb, k - fz, CARD_SIRRAH);
  },
});
/** RADNUS's small collar flame on his bust in a two-shot slot (he hasn't noticed it) */
const collarFlame = (fb: Buf, f: number, slotX: number, h: number) => drawBigFlame(fb, slotX + RADNUS2_COLLAR[0], WH.WH2S.y + RADNUS2_COLLAR[1], h, f);
L.add('13.05', {
  st: 'rooms/whitehouse drawWH2S: RADNUS (NEW bust, ./art/radnus-bust: writing it down, the pen in two held drawings, his extinguisher on the table, the small flame on his collar) + MARIO (cast/mario portrait, lip-sync, the finger fully up on his first line; the scroll unrolling past the table on the flutter); SIRRAH O.S.',
  face: {MARIO: 'lip'},
  marks: {up: ['on', 'e1-a2-13-03', -3], sub: ['on', 'e1-a2-13-05', 0], flutter: ['snd', 'paper_flutter', 1, 0]},
  draw: (fb, k, sh, f) => {
    const up = mk(sh, 'up', 68), sub = mk(sh, 'sub', 148), fl = mk(sh, 'flutter', 238);
    const glance = k >= sub + 6 && k < sub + 40;
    const R = radnusBust2({...RADNUS2_DEFAULT, arm: 'write', pen: ((k >> 2) & 1) as 0 | 1, lid: glance ? blink(k, 2) : 1, look: glance ? 1 : 0});
    const mm = marioM(mouth(sh, k, 'MARIO'));
    const M = marioPortraitImg({...MARIO_PORTRAIT_REST, finger: k >= up ? 2 : 1, mouth: mm, blink: blink(k, 5), brow: k >= sub && k < sub + 90 ? 1 : 0});
    WH.drawWH2S(fb, f, {L: {img: R}, R: {img: M}, pad: true, scroll: k >= fl ? heldLerp(k, fl, fl + 12, 4, 40, 3) : 0});
    collarFlame(fb, f, WH.WH2S.L, 7);
    drawExtinguisherSmall(fb, 22, 178);
  },
});
L.add('13.06', {
  st: 'rooms/whitehouse drawWHWide: the photographer (back to us) sets tripod 1, 2, 3 on the three landing thunks; on "camera one" the heads turn to their own cameras (Tasya cam 3, Mario cam 2, Radnus the ceiling), each at its own speed',
  marks: {t1: ['snd', 'landing_thunk', 1, 0], t2: ['snd', 'landing_thunk', 2, 0], t3: ['snd', 'landing_thunk', 3, 0], one: ['w', 'e1-a2-13-06', 'one', 0]},
  draw: (fb, k, sh, f) => {
    const t3 = mk(sh, 't3', 31), one = mk(sh, 'one', 90);
    const n = stepOf(k, [mk(sh, 't1', 4), mk(sh, 't2', 18), t3]) as 0 | 1 | 2 | 3;
    WH.drawWHWide(fb, f, {tripods: n, photographer: k < t3 + 8 ? 'set' : 'stand', sirrah: {on: null, mouth: 'smile'}, finger: 1, flame: 1,
      look: {tasya: k >= one ? 'cam3' : 'head', mario: k >= one + 5 ? 'cam2' : 'head', radnus: k >= one + 11 ? 'ceiling' : 'head'}});
  },
});
// the row at close-up size, on one long plate (the art's drawClassRow, re-laid here so the row takes the NEW RADNUS bust)
let ROW: Buf | null = null;
const rowPlate = (): Buf => {
  if (ROW) return ROW;
  const P = new Buf(WH.WH_ROW.w, RH, PAL.N0);
  const w = new Buf(480, 270, PAL.N0);
  WH.drawWHWall(w, 0, {soft: 1});
  for (let y = 0; y < RH; y++) for (let x = 0; x < WH.WH_ROW.w; x++) P.set(x, y, w.get(x % 480, y));
  putBustCut(P, WH.warmRelit(tasyaSpeakPortrait({...TASYA_PORTRAIT_DEFAULT, arms: 'clasp', mouth: 'smile'})), WH.WH_ROW.slots.tasya, 30, RH, true);
  putBustCut(P, marioPortraitImg({...MARIO_PORTRAIT_REST, finger: 0}), WH.WH_ROW.slots.mario, 30, RH);
  putBustCut(P, radnusBust2({...RADNUS2_DEFAULT, up: true, arm: 'none'}), WH.WH_ROW.slots.radnus, 34, RH);
  ROW = P;
  return P;
};
L.add('13.07', {
  st: 'the class row at close-up size on one long plate (whitehouse wall + TASYA re-lit warm (cam 3) · MARIO (cam 2) · RADNUS NEW bust (eyes up to the ceiling camera)) and MAS drawn live at the row\'s end (masPortrait, the near-front head, pupils centred): one whole-pixel pan R -> L, then the held lens look',
  draw: (fb, k) => {
    const P = rowPlate();
    const pan = heldLerp(k, 8, 60, 0, WH.WH_ROW.panMax, 1);
    const px = WH.WH_ROW.panMax - pan;
    for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) fb.set(x, y, P.get(px + x, y));
    putBustCut(fb, masPortrait({...MAS_PORTRAIT_DEFAULT, head: 'front', look: 0, light: 'warm'}), WH.WH_ROW.slots.mas - px, 30, RH);
    for (let y = 186; y < RH; y++) for (let x = 0; x < 480; x++) fb.set(x, y, y === 186 ? PAL.W4 : hash((x + px) >> 4, y, 2) < 0.5 ? PAL.D3 : PAL.D4);
  },
});
L.add('13.08', {
  st: 'rooms/whitehouse drawWHWide: the photographer\'s wide, three tripods, four wrong eyelines (Tasya cam 3, Mario cam 2, Radnus the ceiling, Mas the lens); Tasya\'s room-scale mouth; Sirrah\'s pointer to the row on "Anyone"',
  face: {TASYA: 'room'},
  marks: {anyone: ['w', 'e1-a2-13-07', 'Anyone', 0]},
  draw: (fb, k, sh, f) => {
    const any = mk(sh, 'anyone', 50);
    WH.drawWHWide(fb, f, {tripods: 3, photographer: 'stand', sirrah: {on: k >= any && k < any + 40 ? 'row' : null, mouth: 'smile'}, finger: 1, flame: 1,
      look: {tasya: 'cam3', mario: 'cam2', radnus: 'ceiling', mas: 'lens'}, mouths: {tasya: roomM(roomMouth(sh, k, 'TASYA'), 'smile')}});
  },
});
L.add('13.09', {
  st: 'rooms/whitehouse drawWH2S: MAS (masPortrait warm, flipped to face him) + RADNUS (NEW bust, leaning across, lip-sync, the serene smile between lines; his extinguisher on the table; the small flame on his collar he hasn\'t noticed); v3.4 (the V.O. cut again): after Radnus\'s courtesy Mas\'s eyes drop off him for a beat, then come back for the knife, "how\'s the dancing?"',
  face: {RADNUS: 'lip', MAS: 'lip'},
  marks: {first: ['on', 'e1-a2-13-09', 0], apol: ['on', 'e1-a2-13-11', 0], apolEnd: ['w', 'e1-a2-13-11', 'And', 0], apolDone: ['end', 'e1-a2-13-11', 0], dance: ['on', 'e1-a2-13-12', 0]},
  draw: (fb, k, sh, f) => {
    // v3.4: "he's not wrong." is cut; the beat stays his (no voice): his eyes leave Radnus as the courtesy ends and come
    // back for the knife, "how's the dancing?"
    const vo = mk(sh, 'apolDone', 290) + 4, dance = mk(sh, 'dance', 311);
    const lean = k >= mk(sh, 'first', 14) - 4;
    const R = radnusBust2({...RADNUS2_DEFAULT, arm: lean ? 'lean' : 'fold', mouth: talk(mouth(sh, k, 'RADNUS'), 'smile'), lid: blink(k, 2), look: -1,
      brow: k >= mk(sh, 'apol', 156) && k < mk(sh, 'apolEnd', 230) ? 1 : 0});
    const mm = spoken(sh, k, 'MAS');
    const away = k >= vo - 2 && k < dance - 4;
    const M = masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'warm', mouth: mm === 'smile' ? 'rest' : mm, look: away ? 0 : -1});
    WH.drawWH2S(fb, f, {L: {img: M, flip: true}, R: {img: R, dx: -60}});
    collarFlame(fb, f, WH.WH2S.R - 60, 9);
    drawExtinguisherSmall(fb, 330, 178);
  },
});
L.add('13.10', {
  st: 'rooms/whitehouse drawRadnusFlameMCU [MCU] (v3.2: his face and the flame together, replacing the ECU) with the NEW RADNUS bust (./art/radnus-bust, its collar point): the flame grows one size on the whoomph; his far hand pats at it from "We\'re being thoughtful." (O.S.: his mouth stays shut, the serene smile), blinking once',
  marks: {whoomph: ['snd', 'flame_whoomph', 1, 0], pat: ['on', 'e1-a2-13-13', 0]},
  draw: (fb, k, sh, f) => {
    const w = mk(sh, 'whoomph', 4), p = mk(sh, 'pat', 13);
    const patting = k >= p && ((k - p) / 6) % 2 < 1;
    WH.drawRadnusFlameMCU(fb, f, {size: k >= w ? 2 : 1, bust: radnusBust2({...RADNUS2_DEFAULT, arm: patting ? 'pat' : 'fold', mouth: 'smile', lid: blink(k + 60, 2), look: 0}), collar: RADNUS2_COLLAR});
  },
});
// the flash frame's state: what CLASS PHOTO #1 prints (13.14 prints THIS state, so the print matches the flash)
const PHOTO_STATE: WH.WHWideState = {tripods: 3, photographer: 'stand', door: 3, nedib: {t: 1, mouth: 'rest', arm: 'baton'}, blocks: 'IA', sirrah: {on: null, mouth: 'smile'},
  look: {mas: 'lens', radnus: 'door', mario: 'door', tasya: 'door'}, finger: 2, flame: 1};
const masKeepWH = () => keepOf('wh-mas', (b) => drawMasStand(b, WH.WH.seats.mas, WH.WH.seatFoot, {...MAS_STAND_DEFAULT}, {flip: true, clip: (_x, y) => y < WH.WH.table.top0 + 1}));
L.add('13.11', {
  st: 'rooms/whitehouse drawWHWide: the door opens in held steps, NEDIB strides in (art-b cast/nedib room sprite) and speaks (room-scale mouth); three heads turn round to him, each at its own speed; Mas\'s doesn\'t (V.O.) until the sentence ends, and then to the lens. 13.12 merged: all three cameras fire (a white step of 3, then 2: never white), then the 2-tone freeze with MAS kept in colour, and the NEDIB gag card',
  face: {NEDIB: 'room'},
  marks: {line: ['on', 'e1-a2-13-14', 0], end: ['end', 'e1-a2-13-14', 0], flash: ['beat', '13.12', 0]},
  draw: (fb, k, sh, f) => {
    const fl = mk(sh, 'flash', 136), end = mk(sh, 'end', 132), line = mk(sh, 'line', 81);
    if (k >= fl) {
      const kk = k - fl;
      if (kk < 2) { WH.drawWHWide(fb, sh.s + fl, {...PHOTO_STATE, flash: kk === 0 ? 2 : 1}); lighten(fb, kk === 0 ? 3 : 2); }
      else { WH.drawWHWide(fb, sh.s + fl, {...PHOTO_STATE, flash: 0}); freeze2(fb, masKeepWH(), FREEZE_BRIGHT); }
      drawGagCard(fb, kk, CARD_NEDIB);
      return;
    }
    const door = stepOf(k, [4, 8, 12]) as 0 | 1 | 2 | 3;
    const t = door >= 2 ? clamp((k - 10) / 56, 0, 1) : null;
    WH.drawWHWide(fb, f, {tripods: 3, photographer: 'stand', door, nedib: t === null ? null : {t, mouth: roomM(roomMouth(sh, k, 'NEDIB')), arm: 'baton'},
      blocks: k >= 22 ? 'IA' : 'AI', sirrah: {on: null, mouth: 'smile'}, finger: k >= line ? 2 : 1, flame: 1,
      look: {radnus: k >= 22 ? 'door' : 'head', mario: k >= 30 ? 'door' : 'head', tasya: k >= 44 ? 'door' : 'head', mas: k >= end + 1 ? 'lens' : 'head'}});
  },
});
const SCROLL_MARKS = ['s1', 's2', 's3', 's4'];
L.add('13.13', {
  st: 'rooms/whitehouse drawWHOTS: from behind Mario\'s raised index finger onto NEDIB (art-b nedib bust, lip-sync, the pen as a baton): "Whatever you promise in here today, put it in writing."; the finger goes all the way up on "writing" and his other hand pulls the scroll out of his pocket in held steps; v3.1: the whole scroll is out after the sentence, NEDIB looks down at it, approving (brow up), and says "Longer." The NEDIB gag card rides on from the flash; v3.4: between the sentence and "Longer.", under "mine\'s half written." (V.O.), act2/art/half-written drawHalfWrittenECU [ECU]: his hand resting on the front pocket of his hoodie at the table, the folded page tucked in it, PLEASE and REG in his own pen strokes above the fold (his ask from Act One\'s desk); his thumb presses it a pixel further in; no face',
  face: {NEDIB: 'lip'},
  marks: {s1: ['w', 'v31-a2-0001', 'promise', 0], s2: ['w', 'v31-a2-0001', 'today', 0], s3: ['w', 'v31-a2-0001', 'writing', 0], s4: ['end', 'v31-a2-0001', 4], longer: ['on', 'v31-a2-0002', 0], vo: ['on', 'v34-vo-04', 0], voEnd: ['end', 'v34-vo-04', 0]},
  draw: (fb, k, sh, f) => {
    const sc = stepOf(k, SCROLL_MARKS.map((n) => mk(sh, n, 999))) as 0 | 1 | 2 | 3 | 4;
    const s4 = mk(sh, 's4', 90), lg = mk(sh, 'longer', 109);
    // v3.4 (v34-vo-04, "mine's half written."): the insert of his hand resting on the folded page in his pocket, from just
    // before the thought to just before "Longer."; his thumb presses it a pixel further in on the thought's last word
    const vo = mk(sh, 'vo', 95), voEnd = mk(sh, 'voEnd', 127);
    if (k >= vo - 4 && k < lg - 3) { drawHalfWrittenECU(fb, f, {press: k >= voEnd - 8 ? 1 : 0}); return; }
    const eyes = k >= s4 + 2 && k < lg + 24; // he looks down at the scroll (camera-right, where Mario holds it)
    WH.drawWHOTS(fb, f, {nedib: {mouth: talk(mouth(sh, k, 'NEDIB'), 'smile'), arm: 'baton', lid: eyes ? 1 : blink(k, 4), look: eyes ? 1 : 0, brow: k >= s4 + 8 && k < lg + 24 ? 1 : 0}, finger: sc >= 3 ? 2 : 1, scroll: sc});
    if (k < 45) drawGagCard(fb, k + 15, CARD_NEDIB);
  },
});
/** CLASS PHOTO #1 (the art's drawClassPhoto, re-laid here to print THIS cut's flash frame, PHOTO_STATE, and to slide in) */
let PHOTO_SRC: Buf | null = null;
const printPhoto = (b: Buf, dx: number, dev: number, dy = 0, sheen = 120) => {
  // the print is the flash frame as the cameras saw it: the tripods and the photographer are behind the lens, not in it
  if (!PHOTO_SRC) { PHOTO_SRC = new Buf(480, 270, PAL.N0); WH.drawWHWide(PHOTO_SRC, 0, {...PHOTO_STATE, tripods: 0, photographer: 'none', flash: 0}); }
  const src = PHOTO_SRC;
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, hash(x >> 5, y >> 1, 4) < 0.5 ? PAL.D2 : PAL.D3);
  const cx0 = 24, cy0 = 44, cw = 332, ch = 124;
  // v3.1: centred where the phone will be in 14.01 (the art's CLASS_PHOTO_MATCH), held at its left edge as the phone is
  const X = WH.CLASS_PHOTO_MATCH.cx - (cw >> 1) + dx, Y = WH.CLASS_PHOTO_MATCH.cy - (ch >> 1) + dy, B = 6;
  rect(X - B + 3, Y - B + 3, cw + 2 * B, ch + 2 * B + 10, b.ink(PAL.N0));
  rect(X - B, Y - B, cw + 2 * B, ch + 2 * B + 10, b.ink(PAL.P2));
  rect(X - B, Y - B, cw + 2 * B, 1, b.ink(PAL.W9));
  for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) b.set(X + i, Y + j, stepColor(src.get(cx0 + i, cy0 + j), (j < 60 ? 0 : 1) + dev));
  for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) { const d = i - j * 1.2 - sheen; if (d > 0 && d < 3 && bayer(i, j) < 0.5) b.set(X + i, Y + j, stepColor(b.get(X + i, Y + j), 1)); }
  text(b, 'CLASS PHOTO #1', X + 4, Y + ch + 3, PAL.N4);
  // his hand at its left edge, as the art's match print draws it (bay-bridge holdFingers: the same pads at the same
  // place as round the phone in 14.01), the hoodie's cuff below
  for (let y = Y + 70 + 4 * 15; y < RH; y++) for (let x = X - B - 30; x < X - B + 4; x++) b.set(x, y, x < X - B - 22 ? PAL.G3 : x > X - B ? PAL.G1 : PAL.G2);
  BB.holdFingers(b, X - B + 3, Y + 70, 4, [PAL.S1, PAL.S3, PAL.S4, PAL.S5]);
};
L.add('13.14', {
  st: 'CLASS PHOTO #1 [ECU]: the art\'s class-photo print (rooms/whitehouse drawClassPhoto {match}: centred where the phone will be, his fingers round its left edge) re-laid to print THIS cut\'s flash frame (three twisted to the door, NEDIB in it, the blocks I A, Mas at the lens; no tripods: they took it); it slides in in 5 short held steps (v3.4, for the flash check) and develops from white in 3; "it\'s a good photo." (O.S.); the hold, the print drifting a pixel and its sheen sliding, back in place for the last 12 frames; v3.1: a hard MATCH CUT into 14.01 (the print becomes his phone)',
  draw: (fb, k, sh) => {
    // v3.4 (the flash check): the slide in shorter held steps (each moves under a quarter of the frame's light)
    const dx = k < 2 ? 60 : k < 4 ? 40 : k < 6 ? 24 : k < 8 ? 12 : k < 10 ? 4 : 0;
    const dev = k < 5 ? 3 : k < 9 ? 2 : k < 14 ? 1 : 0;
    // held in his hand: a 1-px drift of the print every 28 frames, and its sheen sliding as it tilts (1 px / 6 f)
    const dy = k >= 20 && k < sh.e - sh.s - 12 && ((k - 20) / 28) % 2 >= 1 ? 1 : 0; // settled at the cut, so the match lines up
    printPhoto(fb, dx, dev, dy, 100 + Math.floor(k / 6));
  },
});

// =================================================================== sc 14 · THE BRIDGE
L.add('14.01', {
  st: 'v3.5 (sc 26): rooms/bay-bridge drawBridgeOTS {noClip}: over his shoulder at the dark bullpen window (the MATCH CUT from the print), his phone with his own CLASS PHOTO #1 post, its hearts climbing; the reminder slides down over it in three held steps (art/v35 phoneReminder: the cold open\'s generic calendar card, SENATE JUDICIARY / MAY 16 · TESTIFY, no seal); then act2/art/half-written drawHalfWrittenECU {lift, dash} [ECU]: 13.13\'s insert again, his hand on his hoodie pocket, and he draws the folded page up out of it (PLEASE, REG and the dash where he stopped), holds it to read, and lets it back down; his hand rests on it (the match into the witness table)',
  marks: {rem: ['txt', 'SENATE JUDICIARY', 'at', 0], page: ['txt', 'PLEASE REG', 'at', 0]},
  draw: (fb, k, sh, f) => {
    const rem = mk(sh, 'rem', 38), page = mk(sh, 'page', 81), cut = page - 6;
    if (k < cut) {
      BB.drawBridgeOTS(fb, f, {f, mouth: 0, feed: 0, hearts: 406 + Math.min(k, rem) * 7 + Math.max(0, k - rem) * 2, noClip: true});
      V35.phoneReminder(fb, BB.BRIDGE_PHONE.x, BB.BRIDGE_PHONE.y, BB.BRIDGE_PHONE.w, k - rem);
      return;
    }
    // the ECU: the page up out of the pocket in held steps, held to read, let back down; his hand resting on it
    const kk = k - cut, len = sh.e - sh.s - cut;
    const down = len - 18;
    const lift = kk < 4 ? 0 : kk < 6 ? 10 : kk < 8 ? 18 : kk < down ? 24 : kk < down + 2 ? 14 : kk < down + 4 ? 4 : 0;
    drawHalfWrittenECU(fb, f, {lift, dash: true, press: kk >= down + 4 ? 1 : 0});
  },
});

// =================================================================== sc 15 · THE SENATE
// v3.5: the hearing opens on the page under his hand, then the room (the clone and its voice are cut: 15.01-15.03)
L.add('v35-27.00', {
  st: 'v3.5 (sc 27, the MATCH from 14.01): act2/art/half-written drawHalfWrittenECU {surface: baize} [HIGH]: the same folded page under the same resting hand, now on the witness table\'s green baize (the gavel\'s knock lands on the cut); then a quick tilt up (three held steps, the rows smeared) to rooms/senate drawSenateWide {noClone}: the hearing room, the dais with the chairman at its centre, the gallery, SUCRAM beside Mas already typing, live-threading',
  draw: (fb, k, sh, f) => {
    const t0 = 34;
    if (k < t0) { drawHalfWrittenECU(fb, f, {surface: 'baize'}); return; }
    SN.drawSenateWide(fb, f, {noClone: true, chair: {arm: 'card'}, sucram: {arm: 'phone', mouth: 'rest'}});
    // the tilt: the room comes down into frame in two held steps, the rows above it one even smear (the flash check)
    const dy = k < t0 + 1 ? 40 : k < t0 + 2 ? 12 : 0;
    if (dy) { shiftRoom(fb, 0, dy); for (let y = 0; y < dy; y++) for (let x = 0; x < 480; x++) fb.set(x, y, fb.get(x, dy)); }
  },
});
const masKeepWit = () => keepOf('wit-mas', (b) => putBustCut(b, masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'warm'}), SN.WIT2S.mas, SN.WIT2S.y, SN.WIT2S.table, true));
L.add('15.04', {
  st: 'rooms/senate drawWitness2S: MAS + SUCRAM at the witness table (both flipped to face the dais); 15.04: the 2-tone freeze with Mas kept in colour and the SUCRAM gag card; 15.05 merged: Sucram types, low, not looking up (lip-sync, lids down), Mas turns to him for "which one am i?"',
  face: {SUCRAM: 'lip', MAS: 'lip'},
  marks: {live: ['beat', '15.05', 0], ask: ['on', 'e1-a2-15-04', -3], askEnd: ['end', 'e1-a2-15-05', 6]},
  draw: (fb, k, sh, f) => {
    const live = mk(sh, 'live', 15);
    if (k < live) { SN.drawWitness2S(fb, sh.s, {sucram: {arm: 'phone', lid: 1}}); freeze2(fb, masKeepWit()); drawGagCard(fb, k, CARD_SUCRAM); return; }
    const toHim = k >= mk(sh, 'ask', 110) && k < mk(sh, 'askEnd', 180);
    const mm = spoken(sh, k, 'MAS');
    SN.drawWitness2S(fb, f, {mas: {mouth: mm === 'smile' ? 'rest' : mm, look: toHim ? -1 : 0}, sucram: {arm: 'phone', lid: blink(k, 7) === 2 ? 2 : 1, mouth: mouth(sh, k, 'SUCRAM')}});
    if (k < 84) drawGagCard(fb, k, CARD_SUCRAM);
  },
});
L.add('15.06', {
  st: 'rooms/senate drawSenateMCU: the chairman (matte) reading from his card (eyes down on it, up once over "really my biggest nightmare"), lip-sync, his mic lit',
  face: {LAHTNEMULB: 'lip'},
  marks: {up: ['w', 'e1-a2-15-06', 'really', 0], down: ['we', 'e1-a2-15-06', 'nightmare', 4]},
  draw: (fb, k, sh, f) => {
    const up = k >= mk(sh, 'up', 90) && k < mk(sh, 'down', 120);
    SN.drawSenateMCU(fb, f, {bust: lahtBust({...LAHT_BUST_DEFAULT, arm: 'card', mouth: mouth(sh, k, 'LAHTNEMULB'), lid: up ? blink(k, 3) : 1}), third: 'R', bg: 'dais', mic: true, lit: true});
  },
});
L.add('15.07', {
  st: 'rooms/senate drawSenateOTS {noClone} (v3.5: the clone is cut): from behind Mas (the back of his head) onto the dais, the chairman alone with his cards; on "jobs" he reaches for his next card (two held drawings) and settles with it',
  marks: {jobs: ['w', 'e1-a2-15-07', 'jobs', 0]},
  draw: (fb, k, sh, f) => {
    const j = mk(sh, 'jobs', 120);
    const lid = Math.max(blink(k, 1), blink(k + 45, 1)) as 0 | 1 | 2;
    SN.drawSenateOTS(fb, f, {noClone: true, chair: {lid, look: k >= j && k < j + 14 ? 1 : k % 70 < 40 ? -1 : 0, arm: k >= j && k < j + 10 ? 'take' : 'card'}});
  },
});
L.add('15.10', {
  st: 'rooms/senate drawSenateWide: the dais leans in; one microphone\'s red light comes on and the senator behind it asks (room-scale mouth); v3.2: the question is the committee asking for his ask ("Is there anything you\'d like this committee to do?")',
  face: {SENATOR: 'room'},
  marks: {line: ['on', 'e1-a2-15-15', 0]},
  draw: (fb, k, sh, f) => {
    const line = mk(sh, 'line', 9);
    SN.drawSenateWide(fb, f, {noClone: true, lean: k >= 4, lit: k >= line - 6 ? 'senB' : null, senMouth: roomMouth(sh, k, 'SENATOR') === 'open' ? 'senB' : null, chair: {arm: 'card'}});
  },
});
L.add('15.11', {
  st: 'rooms/senate drawWitness2S: MAS ("i love my current job.", to the dais) + SUCRAM typing faster (quicker lids); on "money" Mas\'s hand goes to his pocket; the senator O.S.',
  face: {MAS: 'lip'},
  marks: {money: ['w', 'e1-a2-15-12', 'money', 0], fast: ['snd', 'typing_soft', 1, 0]},
  draw: (fb, k, sh, f) => {
    const mm = spoken(sh, k, 'MAS');
    const fast = k >= mk(sh, 'fast', 47);
    // v3.2: the question now opens the shot, so Sucram's glance down and Mas's blink keep the head of it alive before the typing speeds up
    SN.drawWitness2S(fb, f, {mas: {mouth: mm === 'smile' ? 'rest' : mm, look: -1, lid: blink(k + 60, 5)}, sucram: {arm: 'phone', lid: fast ? ((k >> 2) % 5 === 0 ? 2 : 1) : ((k >> 3) % 4 === 0 ? 2 : 1)}, pocket: k >= mk(sh, 'money', 110)});
  },
});
L.add('15.12', {
  st: 'kits/senate-props drawWalletECU: the wallet opens (2 held steps) on one card, HEALTH INSURANCE; the moth climbs out in three drawings on its sound and flies off toward the stamp pad',
  marks: {moth: ['snd', 'synth:moth', 1, 0]},
  draw: (fb, k, sh, f) => {
    const m = mk(sh, 'moth', 26);
    SP.drawWalletECU(fb, f, {open: k < 3 ? 0 : k < 8 ? 1 : 2, moth: k < m ? 0 : k < m + 5 ? 1 : k < m + 11 ? 2 : k < m + 22 ? 3 : -1});
  },
});
L.add('15.13', {
  st: 'rooms/senate drawSenateWide {noClone} (v3.5): Mas holds the open wallet up to the dais and says it himself, "i get paid enough for health insurance." (room-scale mouth, his own mic lit); the gallery gasps after it (one held drawing, all at once)',
  face: {MAS: 'room'},
  marks: {gasp: ['snd', 'synth:gasp', 1, 0], line: ['on', 'v35-a2-0001', 0]},
  draw: (fb, k, sh, f) => {
    const g = mk(sh, 'gasp', 79);
    const mm = mouth(sh, k, 'MAS');
    SN.drawSenateWide(fb, f, {noClone: true, mas: {wallet: true, mouth: mm !== 'rest' && mm !== 'M' && mm !== 'smile' ? 'open' : 'rest'}, gasp: k >= g, chair: {arm: 'card'}});
  },
});
L.add('15.14', {
  st: 'v3.5: after the held beat, art/v35 drawWalletSet [INSERT]: his hand sets the wallet down on the table (the 2019 match); before it: rooms/senate drawWitness2S: SUCRAM stamps furiously on the three stamps and on through his line (slam / raise held drawings), the moth dodging over the pad; then still, he looks at Mas as Mas says, quietly, to the dais, "…i have no equity in nopeai.", and goes back to his phone; the moth lands and lifts; the senator O.S.',
  face: {SUCRAM: 'lip', MAS: 'lip'},
  marks: {s1: ['snd', 'rubber_stamp_C', 1, 0], s2: ['snd', 'rubber_stamp_C', 2, 0], s3: ['snd', 'rubber_stamp_C', 3, 0], sEnd: ['end', 'e1-a2-15-14', 0], mas: ['on', 'v3-a2-0001', 0], masEnd: ['end', 'v3-a2-0001', 0]},
  draw: (fb, k, sh, f) => {
    // v3.5 (the out): a held beat after his line, then the insert of his hand setting the wallet down on the baize
    // (art/v35 drawWalletSet, three held steps), the object the 2019 match takes (the same hand, the same place)
    const set0 = mk(sh, 'masEnd', 120) + 12;
    if (k >= set0) { const kk = k - set0; V35.drawWalletSet(fb, f, {drop: kk < 2 ? 26 : kk < 4 ? 12 : kk < 6 ? 4 : 0}); return; }
    const s3 = mk(sh, 's3', 19), sEnd = mk(sh, 'sEnd', 54), masOn = mk(sh, 'mas', 65);
    const slams = [mk(sh, 's1', 2), mk(sh, 's2', 10), s3];
    for (let t = s3 + 8; t < sEnd; t += 8) slams.push(t);
    const slam = slams.some((t) => k >= t && k < t + 3);
    const stamping = k < sEnd + 4;
    const mm = spoken(sh, k, 'MAS');
    SN.drawWitness2S(fb, f, {mas: {mouth: mm === 'smile' ? 'rest' : mm, look: k >= masOn - 6 ? -1 : 0},
      sucram: {arm: stamping ? (slam ? 'slam' : 'stamp') : k < mk(sh, 'masEnd', 120) + 10 ? 'down' : 'phone', mouth: mouth(sh, k, 'SUCRAM'),
        lid: stamping ? 0 : k < mk(sh, 'masEnd', 120) + 10 ? blink(k, 5) : (blink(k, 5) === 2 ? 2 : 1), brow: stamping ? -1 : 0, look: !stamping && k >= masOn && k < mk(sh, 'masEnd', 120) + 10 ? 1 : 0},
      moth: k < sEnd + 20 ? 'dodge' : (k - sEnd) % 44 < 30 ? 'pad' : 'dodge'});
  },
});
L.add('15.15', {
  st: 'v3.2, HIS MOVE (the proposal): rooms/senate drawSenateOTS {noClone} (15.07\'s setup: from behind Mas onto the dais, the chairman listening, blinking) for "i would form a new agency…" (his own testimony, the record); on "licenses" the cut to kits/senate-props drawSheetHigh [HIGH]: his hand slides PLEASE REGULATE ME, signed, toward the dais in held steps as he goes on; Sucram\'s stamp comes down mid-slide (CALLED IT. (BEFORE LAUNCH.)) and the sheet leaves frame right. (The stick\'s slide and stamp sounds sit before the cut: for the sound pass)',
  marks: {cut: ['w', 'v32-a2-0001', 'licenses', 0]},
  draw: (fb, k, sh, f) => {
    const c = mk(sh, 'cut', 68);
    // the OTS drifts in on him by whole pixels (1 px / 10 f) while he proposes it; the chairman and the clone blink
    if (k < c) { SN.drawSenateOTS(fb, f, {noClone: true, take: 0, chair: {lid: blink(k, 1), look: 0}}); shiftRoom(fb, -Math.min(6, Math.floor(k / 10))); return; }
    const kk = k - c;
    // the slide spread over the rest of his sentence: the sheet leaves frame as the line ends (no empty table under him)
    const slide = (kk < 10 ? 0 : kk < 24 ? 1 : kk < 64 ? 2 : kk < 94 ? 3 : 4) as 0 | 1 | 2 | 3 | 4;
    SP.drawSheetHigh(fb, f, {slide, stamp: kk < 34 ? null : kk < 42 ? 'up' : kk < 47 ? 'down' : 'done'});
  },
});
L.add('15.16', {
  st: 'rooms/senate drawSenateDais {noClone} (v3.5): a match on action, the sheet arrives from frame left into the CHAIRMAN\'s waiting hand; the senators lean in, delighted, and on the paper curl he holds it up and nods',
  marks: {curl: ['snd', 'paper_curl', 1, 0]},
  draw: (fb, k, sh, f) => { const c = mk(sh, 'curl', 24); SN.drawSenateDais(fb, f, {noClone: true, sheet: k < 6 ? 1 : k < c ? 2 : 3, lean: k >= 10 && k < c, chair: {arm: k >= c ? 'up' : 'card', nod: k >= c ? (((k >> 3) & 1) as 0 | 1) : 0}}); },
});
// =================================================================== sc 28 · MAR 2019, the company with a ceiling (a memory)
/** the writing point of his marker on the 2S's board for each piece of the diagram (frame coords) */
const B2 = V35.BOARD2S, DG = V35.DIAGRAM;
const LOWB = {x0: B2.x0 + DG.low.x, y0: B2.y0 + DG.low.y, x1: B2.x0 + DG.low.x + DG.low.w, y1: B2.y0 + DG.low.y + DG.low.h};
const TOPB = {x: B2.x0 + DG.top.x, y: B2.y0 + DG.top.y, w: DG.top.w, h: DG.top.h};
L.add('v35-28.01', {
  st: 'v3.5 (sc 28, the MATCH in): the intro\'s render front (art/v35 frontSweep: shared transitions renderFront, 12 f, left to right, the white-hot core in the cyan glow) re-draws the witness table\'s insert (his hand resting on the wallet on the baize) as 2019 in the T3 cut-paper tier: the same hand, the same place in frame, resting on a marker it has just set on the whiteboard\'s tray (art/v35 drawTrayMarker); the brick under the board in the daylight; then his hand lifts off (two held steps) and leaves the marker on the tray',
  draw: (fb, k, sh, f) => {
    if (k < 12) { V35.frontSweep(fb, k, (t) => V35.drawWalletSet(t, f, {drop: 0}), (t) => V35.drawTrayMarker(t, f, {hy: 116}), 'right'); return; }
    V35.drawTrayMarker(fb, f, {hy: k < 30 ? 116 : k < 33 ? 104 : k < 36 ? 86 : null});
  },
});
L.add('v35-28.02', {
  st: 'v3.5 (sc 28): art/v35 office2019 [W]: NopeAI\'s first office by day, March 2019 (Act One\'s JUN 2018 room a year on, cut paper): GERG (the tug pose, the laptop in his arm) holds up the cloud bill and it unrolls to the floor and along it in held steps on his line; MAS at the whiteboard\'s end (NONPROFIT · THE BOARD on it), ALYI and MADA at the table, THE QUIET VOTE\'s tall chair turned away; on Mas\'s line the cut to art/v35 board2S [2S]: the whiteboard large and legible, MAS (medium, facing it) writing with his arm to the marker\'s point, ALYI at the table in the right foreground (lip-sync): the lower box, side by side, the arrow down, CAPPED PROFIT; Alyi asks; 100x in the red marker; Alyi asks; on "the board." he underlines the top box twice',
  face: {GERG: 'room', MAS: 'lip', ALYI: 'lip'},
  marks: {gerg: ['on', 'v35-a2-0002', 0], gergEnd: ['end', 'v35-a2-0002', 0], mas1: ['on', 'v35-a2-0003', 0], mas1End: ['end', 'v35-a2-0003', 0], x100: ['on', 'v35-a2-0005', 0], board: ['on', 'v35-a2-0007', 0]},
  draw: (fb, k, sh, f) => {
    const m1 = mk(sh, 'mas1', 96), cut = m1 - 6;
    const open = (who: string) => { const v = mouth(sh, k, who); return v !== 'rest' && v !== 'M' && v !== 'smile' ? 'open' as const : 'rest' as const; };
    if (k < cut) {
      const g0 = mk(sh, 'gerg', 9), g1 = mk(sh, 'gergEnd', 86);
      V35.office2019(fb, {f, bill: heldLerp(k, g0, g1, 0, 100, 4) / 100, gergMouth: open('GERG')});
      return;
    }
    const m1e = mk(sh, 'mas1End', 148), x1 = mk(sh, 'x100', 202), bd = mk(sh, 'board', 297);
    // the diagram on his lines: the lower box's four sides and the arrow, then CAPPED PROFIT; 100x; the underlines
    const s0 = m1 + 4, sides = [s0, s0 + 6, s0 + 12, s0 + 18, s0 + 24], c0 = s0 + 28;
    const box2At = (q: number) => stepOf(q, sides);
    const cappedAt = (q: number) => (q < c0 ? 0 : Math.min(13, 1 + Math.floor((q - c0) / 2)));
    const x100At = (q: number) => stepOf(q, [x1 + 3, x1 + 6, x1 + 9, x1 + 12]);
    const tapAt = (q: number) => stepOf(q, [bd + 2, bd + 8]);
    // where his marker is (a pure function of the frame): along each side as it's drawn, along the words, at 100x,
    // under the top box; his arm down in between
    const penAt = (q: number): [number, number] | null => {
      const n = box2At(q);
      if (q >= s0 - 4 && q < c0) return n <= 0 ? [LOWB.x0, LOWB.y0] : n === 1 ? [LOWB.x0, LOWB.y1] : n === 2 ? [LOWB.x1, LOWB.y1] : n === 3 ? [LOWB.x1, LOWB.y0] : n === 4 ? [LOWB.x0, LOWB.y0] : [TOPB.x + (TOPB.w >> 1), LOWB.y0 - 4];
      if (q >= c0 && q < Math.max(c0 + 28, m1e + 6)) return [LOWB.x0 + 30 + cappedAt(q) * 7, LOWB.y0 + 12];
      if (q >= x1 - 2 && q < x1 + 22) return [B2.x0 + DG.x100.x + x100At(q) * 11, B2.y0 + DG.x100.y + 14];
      if (q >= bd - 4 && q < bd + 20) return [TOPB.x + 20 + tapAt(q) * 40, TOPB.y + TOPB.h + 6];
      return null;
    };
    // he steps along the board so the marker stays an arm's length away: 8 px per held step (on 2s), from the cut
    // (he starts toward the board's first corner as his line starts, 12 px a step; back to the board's edge when his
    // marker is down, so the words he wrote are clear of him)
    // (at the cut he's at the board, as in the wide; 12 px a step; back to its edge when his marker is down, so the words
    // he wrote are clear of him)
    const masAt = (q: number) => {
      let x = 96;
      for (let r = cut; r <= q; r += 2) {
        const p = penAt(r) ?? penAt(r + 10);
        const d = p ? p[0] - (x + 64) : 0;
        // out of reach: step in; on top of it: step back; his marker down: back to the board's edge
        const w = clamp(!p ? 6 : d > 140 ? p[0] - 174 : d < -30 ? p[0] - 124 : x, 6, 190);
        x = Math.abs(w - x) <= 12 ? w : x + Math.sign(w - x) * 12;
      }
      return x;
    };
    const masX = masAt(k), pen0 = penAt(k);
    // the arm only when the marker is within reach of where he stands now
    const pen = pen0 && pen0[0] - (masX + 64) <= 150 ? pen0 : null;
    V35.board2S(fb, {f, box2: box2At(k), capped: cappedAt(k), x100: x100At(k), tap: tapAt(k), pen, masX, mas: {mouth: mouth(sh, k, 'MAS'), look: 1, lid: 0}, alyi: {mouth: mouth(sh, k, 'ALYI'), eyes: 'open', t: f}});
  },
});
L.add('v35-28.03', {
  st: 'v3.5 (sc 28): art/v35 mada2S [2S]: the board\'s lower box across the frame\'s left half (CAPPED PROFIT, 100x), MADA at the table (medium, arms folded, lip-sync) and THE QUIET VOTE\'s tall chair beside him, its back to us, turned away; "And you?": Mas\'s hand (his sleeve in from the frame\'s left edge) draws a stick figure in the box on "nothing." and writes CEO · EQUITY: 0 under its arm; Mada\'s spinner turns over the answer, stops, and "Good answer."',
  face: {MADA: 'lip'},
  marks: {ask: ['on', 'v35-a2-0008', 0], ans: ['on', 'v35-a2-0009', 0], ansEnd: ['end', 'v35-a2-0009', 0], good: ['on', 'v35-a2-0010', 0]},
  draw: (fb, k, sh, f) => {
    const ans = mk(sh, 'ans', 42), ansEnd = mk(sh, 'ansEnd', 61), good = mk(sh, 'good', 72);
    const s0 = ans - 10;
    const stick = stepOf(k, [s0, s0 + 3, s0 + 6, s0 + 9, s0 + 12]);
    const e0 = ans + 2, equity = k < e0 ? 0 : Math.min(15, 1 + Math.floor((k - e0) * 0.75));
    // the board is drawn at (-40, -44): the lower box at x 18..166, y 10..80; the figure at (48, 32); the words at (62, 46)
    let pen: [number, number] | null = null;
    if (k >= s0 - 4 && k < e0) pen = [48 + (stick >= 3 ? 7 : 0), 36 + stick * 5];
    else if (k >= e0 && k < e0 + 26) pen = [62 + Math.min(15, equity) * 5, 58];
    const spin = k >= ansEnd + 1 && k < good + 12 ? f : null;
    V35.mada2S(fb, {f, box2: 5, capped: 13, x100: 4, stick, equity, pen, mada: {mouth: mouth(sh, k, 'MADA'), lid: blink(k, 4)}, spin, stopped: k >= good - 3});
  },
});
L.add('v35-28.04', {
  st: 'v3.5 (sc 28): art/v35 drawCheckDoor [INSERT]: the office door\'s foot, the daylight in the gap under it; the landlord\'s first check slides in under the door toward us in three held steps and lies there, legible: MACROSOFT · $1,000,000,000 · JUL 2019 (a smaller cousin of Act One\'s)',
  // (the flash check: the last few pixels of the slide only, so the bright check doesn't step across the frame's blocks)
  draw: (fb, k, sh, f) => { V35.drawCheckDoor(fb, f, {slide: k < 2 ? 12 : k < 4 ? 5 : k < 6 ? 1 : 0}); },
});
L.add('v35-28.05', {
  st: 'v3.5 (the MATCH out): the render front sweeps back, right to left, from the check under the door to art/v35 drawDaisPad [INSERT]: a senator\'s hand (suit cuff, pen) hovering over a blank legal pad on the dais, nothing to write (hands only); then rooms/senate drawSenateDais {noClone}: the dais sits back, held (the senator who asked still lit); the chairman lifts his gavel (art/v35 drawGavel); then art/v35 drawGavelECU [INSERT]: the gavel close, coming down on its block on the knock that ends the hearing (the passport\'s stamp takes the same stroke)',
  marks: {knock: ['snd', 'landing_thunk', 1, 0]},
  draw: (fb, k, sh, f) => {
    if (k < 12) { V35.frontSweep(fb, k, (t) => V35.drawCheckDoor(t, f, {slide: 0}), (t) => V35.drawDaisPad(t, f, {k}), 'left'); return; }
    if (k < 26) { V35.drawDaisPad(fb, f, {k}); return; }
    // the dais sits back, held (the senator who asked still lit, nothing to write); the chairman lifts his gavel; then
    // the gavel close as it comes down on the knock (the passport's stamp takes the same stroke)
    const kn = mk(sh, 'knock', 45), ecu = kn - 7;
    if (k < ecu) { SN.drawSenateDais(fb, f, {noClone: true, lit: 'senB', chair: {arm: 'card'}}); V35.drawGavel(fb, k >= ecu - 5 ? 'up' : 'down'); return; }
    V35.drawGavelECU(fb, f, {pos: k < kn - 2 ? 'up' : k < kn ? 'mid' : 'down'});
  },
});

// =================================================================== sc 29 · taking it to the world (the tour)
const STAMP_MARKS = ['st1', 'st2', 'st3', 'st4', 'st5', 'st6', 'st7'];
L.add('v35-29.01', {
  st: 'v3.5 (sc 29): art/v35 drawPassport [INSERT]: his passport open on its visa pages on a hotel desk, a slow push in; the rubber stamp comes down on each thunk (its shadow, the block, lifting) and leaves its city legible, one a beat: RIO DE JANEIRO · LAGOS · MADRID · WARSAW · PARIS · LONDON · MUNICH (the last one alone, the page still); after MADRID and after PARIS, art/v35 drawFlagHands cutaways: his page (PLEASE REGULATE ME, signed) slides across a table to two hands under a desk flag (Spain\'s red and gold; France\'s three bands; no emblem, no faces)',
  marks: Object.fromEntries(STAMP_MARKS.map((m, i) => [m, ['snd', 'rubber_stamp_C', i + 1, 0]])) as Record<string, ['snd', string, number, number]>,
  draw: (fb, k, sh, f) => {
    const at = STAMP_MARKS.map((m, i) => mk(sh, m, 7 + i * 12));
    const cuts: Array<[number, 'es' | 'fr', number]> = [[at[2] + 3, 'es', PAL.N4], [at[4] + 3, 'fr', PAL.N3]];
    for (const [c0, flag, cuff] of cuts) if (k >= c0 && k < c0 + 8) { V35.drawFlagHands(fb, f, {k: k - c0, flag, cuff}); return; }
    const landed = at.filter((a) => k >= a + 1).length;
    const i = at.findIndex((a) => k >= a - 2 && k <= a + 1);
    const coming = i < 0 ? null : {i, phase: (k < at[i] - 1 ? 0 : k <= at[i] ? 1 : 2) as 0 | 1 | 2};
    V35.drawPassport(fb, f, {landed, coming, push: Math.min(6, Math.floor(k / 16))});
  },
});
L.add('v35-29.02', {
  st: 'v3.5 (sc 29): art/v35 drawLectern [M]: a lectern in a generic hall in London (wood panelling, two tall windows\' grey light, sconces; no crest), the audience\'s heads dark along the foot; MAS behind it (the warm portrait, 3/4 to the hall), pleasant, lip-synced: "if we can comply, we will, and if we can\'t, we\'ll cease operating."; his eyes move across the room; the one-pixel smile on "cease operating" and after',
  face: {MAS: 'lip'},
  marks: {cease: ['w', 'v35-a2-0011', 'cease', 0], end: ['end', 'v35-a2-0011', 0]},
  draw: (fb, k, sh, f) => {
    const cz = mk(sh, 'cease', 80);
    const mm = mouth(sh, k, 'MAS');
    const mo = mm === 'rest' && k >= cz - 2 ? 'smile' : mm;
    V35.drawLectern(fb, f, {mas: {mouth: mo as 'rest', look: ((k >> 5) % 3 === 1 ? 0 : -1) as -1 | 0, lid: 0}});
  },
});
L.add('v35-29.03', {
  st: 'v3.5 (sc 29): art/v35 drawPhonePost [POV]: his phone face-up on the hotel desk (a lamp\'s warm pool), a post from NOTERB in its own UI (kits/post-any: a name and a plain initial avatar, no face), popping up in three held steps: "There is no point in attempting blackmail…", MAY 25',
  draw: (fb, k, sh, f) => { V35.drawPhonePost(fb, f, {post: {kind: 'any', spec: {poster: V35.NOTERB, text: 'There is no point in attempting blackmail…', ts: 'MAY 25'}}, k: k - 1}); },
});
const NO_PLANS = '…and of course have no plans to leave.';
L.add('v35-29.04', {
  st: 'v3.5 (sc 29): art/v35 drawPhonePost [INSERT]: the same phone, his words in the compose box, his thumb on Post, and his post goes up in its own UI (kits/post-card, Mas Manalt @mas), MAY 26; the read floor (lock-v35 §8.3): the on-screen post is trimmed with the print ellipsis to its last clause, "…and of course have no plans to leave." (the record\'s words, 38 characters, which read in the shot\'s 2.8 s)',
  draw: (fb, k, sh, f) => {
    const thumb = (k < 1 ? 1 : k < 3 ? 2 : k < 8 ? 1 : 0) as 0 | 1 | 2;
    V35.drawPhonePost(fb, f, {post: {kind: 'mas', spec: {who: 'mas', text: NO_PLANS}}, k: k - 2, thumb, compose: NO_PLANS});
  },
});
L.add('v35-29.05', {
  st: 'v3.5 (sc 29, the MATCH out): art/v35 drawGuestBook [INSERT]: a guest book under a flag\'s gold fringe (no city); his pen signs it, stroke by stroke; in the last frames the page\'s ruled lines and the others\' signatures give way (ordered dither) to the one-sentence letter, his hand, pen and signature holding their place',
  draw: (fb, k, sh, f) => {
    const len = sh.e - sh.s;
    V35.drawGuestBook(fb, f, {sig: Math.min(1, Math.floor(k / 2) * 2 / 20), toLetter: k < len - 8 ? 0 : (k - (len - 8) + 1) / 8});
  },
});
// =================================================================== sc 17 · THE ROOFTOP
const QUOTE = '"Mitigating the risk of extinction from AI should be a global priority…"';
L.add('17.01', {
  st: 'v3.5 (sc 30): art/v35 drawLetterDesk [INSERT]: the one-sentence letter on many desks (the MATCH from the guest book: his signature in its place, his hand leaving), the statement typing across the top (rooms/rooftop drawQuoteBox) and held to read; the signatories\' list lands (MAS MANALT · MARIO · SIMED · NOTNIH · OIGNEB, the statement\'s own style) and scrolls; the desks swap with the signers: SIMED\'s pale maple and his chess knight, a navy sleeve signing on the first scribble; NOTNIH\'s desk dark but for the one pool of light from above, a dark sleeve signing on the second; + HUNDREDS MORE at the list\'s foot; then rooms/rooftop drawRooftopWide: the last table, on the rooftop under the sky, MAS signing in one stroke (pen_run), MARIO writing, the quote held over the sky',
  marks: {a: ['snd', 'pen_scribble_short', 1, 0], b: ['snd', 'pen_scribble_short', 2, 0], m: ['snd', 'pen_run', 1, 0], r: ['snd', 'pen_scribble_short', 3, 0], names: ['txt', 'MAS MANALT', 'at', 0], more: ['txt', '+ HUNDREDS', 'at', 0]},
  draw: (fb, k, sh, f) => {
    const a = mk(sh, 'a', 43), b = mk(sh, 'b', 70), m = mk(sh, 'm', 103), r = mk(sh, 'r', 122), nm = mk(sh, 'names', 37), more = mk(sh, 'more', 81);
    const roof = m - 11;
    if (k < roof) {
      const desk: V35.LetterDesk = k < a - 12 ? 'his' : k < b - 12 ? 'simed' : 'notnih';
      const d0 = desk === 'simed' ? a - 12 : b - 12;
      const kk = k - d0;
      const hand = (desk === 'his' ? (k < 4 ? 2 : k < 8 ? 3 : 0) : kk < 5 ? 1 : kk < 20 ? 2 : kk < 26 ? 3 : 0) as 0 | 1 | 2 | 3;
      V35.drawLetterDesk(fb, f, {desk, names: k >= nm, scroll: k < nm + 16 ? 0 : heldLerp(k, nm + 16, roof, 0, 8, 4), more: k >= more, hand, sigs: stepOf(k, [a, b]), masSig: true});
      RT.drawQuoteBox(fb, QUOTE, Math.max(0, (k - 7) * 2));
      return;
    }
    RT.drawRooftopWide(fb, f, {signers: [], mas: k >= m - 4 && k < m + 10 ? 'reach' : 'stand', mario: k >= r - 4 ? 'write' : 'stand'});
    RT.drawQuoteBox(fb, QUOTE);
  },
});
L.add('17.02', {
  st: 'rooms/rooftop drawRooftop2S: MAS + MARIO at the sheet; Mario writes under his name, the pen tight (two held drawings), the footnote growing on each scribble, his finger up on "So I\'m adding a footnote"; Mas\'s hand out for the pen after the first line, held out; lip-sync for both',
  face: {MARIO: 'lip', MAS: 'lip'},
  marks: {hand: ['end', 'e1-a2-17-01', 8], fin: ['on', 'e1-a2-17-02', 0], s1: ['snd', 'pen_scribble_short', 1, 0], s2: ['snd', 'pen_scribble_short', 2, 0], s3: ['snd', 'pen_scribble_short', 3, 0]},
  draw: (fb, k, sh, f) => {
    const hand = mk(sh, 'hand', 83);
    const fn = 1 + stepOf(k, [mk(sh, 's1', 4), mk(sh, 's2', 110), mk(sh, 's3', 213)]);
    const mm = spoken(sh, k, 'MAS');
    RT.drawRooftop2S(fb, f, {hand: k < hand ? 0 : k < hand + 4 ? 1 : 2, write: ((k >> 2) & 1) as 0 | 1, footnote: fn,
      mario: {mouth: marioM(mouth(sh, k, 'MARIO')), finger: k >= mk(sh, 'fin', 96) ? 2 : 0}, mas: {mouth: mm === 'smile' ? 'rest' : mm, look: -1}});
  },
});
const masKeepRoof = () => keepOf('roof-mas', (b) => drawMasStand(b, RT.ROOF.mas, RT.ROOF.signFoot + 14, {...MAS_STAND_DEFAULT, arm: 'reach'}, {clip: (_x, y) => y < RT.ROOF.table.top + 1}));
L.add('17.03', {
  st: 'rooms/rooftop drawRooftopWide: the brass register (kits/register) rolls in on its own from frame right (its casters\' two drawings), NESNEJ behind it, arms spread; 17.04 merged: the 2-tone freeze with Mas kept in colour, and the NESNEJ gag card',
  marks: {fz: ['beat', '17.04', 0]},
  draw: (fb, k, sh, f) => {
    const fz = mk(sh, 'fz', 34);
    const st: RT.RooftopWideState = {mas: 'reach', mario: 'write', register: Math.min(1, k / (fz - 4)), nesnej: {arm: 'spread', mouth: 'grin'}};
    if (k < fz) { RT.drawRooftopWide(fb, f, st); return; }
    RT.drawRooftopWide(fb, sh.s + fz, {...st, register: 1});
    freeze2(fb, masKeepRoof(), FREEZE_SKY);
    drawGagCard(fb, k - fz, CARD_NESNEJ);
  },
});
L.add('17.05', {
  st: 'rooms/rooftop drawRooftop2S: the pen still in Mario\'s hand, Mas\'s hand still half out; both turned to the register (O.S. right); Mario, polite, lip-sync; the NESNEJ card rides on',
  face: {MARIO: 'lip'},
  draw: (fb, k, sh, f) => {
    RT.drawRooftop2S(fb, f, {hand: 1, turn: true, write: null, footnote: 4, mario: {mouth: marioM(mouth(sh, k, 'MARIO')), blink: blink(k, 6)}});
    if (k < 55) drawGagCard(fb, k + 15, CARD_NESNEJ);
  },
});
L.add('17.06', {
  st: 'rooms/rooftop drawRooftopOTS: from behind Mario\'s shoulder and raised finger onto NESNEJ (cast/nesnej bust, flipped, arms spread) behind the register: "The more you buy, the more you save." (lip-sync, his grin at rest)',
  face: {NESNEJ: 'lip'},
  draw: (fb, k, sh, f) => { RT.drawRooftopOTS(fb, f, {nesnej: {mouth: nesnejM(mouth(sh, k, 'NESNEJ')), blink: blink(k, 6) === 2, arm: 'spread'}, finger: 2}); },
});
L.add('17.07', {
  st: 'kits/register: 17.07 drawKeyECU (he presses one key: the press lands on KA-CHING) · 17.08 ledgerPrint (the LEDGER flash-print, 12 f) · 17.09 drawRegisterWindow (the figure pops into the window and holds to read; a glint crosses the brass) — merged, one cut each',
  marks: {led: ['beat', '17.08', 0], win: ['beat', '17.09', 0], ching: ['snd', 'ka_ching', 1, 0]},
  draw: (fb, k, sh, f) => {
    const led = mk(sh, 'led', 22), win = mk(sh, 'win', 34), c = mk(sh, 'ching', 14);
    if (k < led) RG.drawKeyECU(fb, f, {press: k < c - 5 ? 0 : k < c ? 1 : 2});
    else if (k < win) RG.ledgerPrint(fb);
    else { RG.drawRegisterWindow(fb, f, {pop: k - win}); sweep(fb, k, win + 22, 87, -40, 520, 24, (_x, y) => y < 56 || y > 126); }
  },
});
L.add('17.10', {
  st: 'v3.5: art/v35 drawOtherOrders: two more signers\' hands at the frame\'s edges, each holding its own order (a navy suit cuff, a tweed cuff); kits/register drawPurchaseOrder {mario} [ECU] (v3.3, P7: unambiguously MARIO\'s hand: his ink-blue fleece sleeve out of frame, his footnote still wet on the order, his appendix scroll\'s end at the frame\'s edge, Mas\'s hand half out beside it, empty; held half a second longer): the signing pen in Mario\'s hand is now a purchase order; its two rows print in on the lock\'s text times (AI CHIPS · QTY: MORE), a glint crossing the paper\'s header',
  marks: {rows: ['txt', 'AI CHIPS', 'at', 0]},
  draw: (fb, k, sh, f) => {
    RG.drawPurchaseOrder(fb, f, {k, mario: true});
    V35.drawOtherOrders(fb, f); // v3.5: every signer's pen is an order: two more hands, each with its own
    const r = mk(sh, 'rows', 13);
    if (k < r) rect(150 + 48, 18 + 40, 190 - 58, 54, fb.ink(PAL.P2));
    else if (k < r + 4) rect(150 + 48, 18 + 66, 190 - 58, 28, fb.ink(PAL.P2));
    sweep(fb, k, 24, 60, 110, 380, 18, (x, y) => y >= 18 && y < 42 && x >= 150 && x < 340);
  },
});
// ---- v3.5b (SHOWRUNNER-NOTES 00000A): the racks. Wordless: the staff rack the new INVIDIA boards. art/racks.ts; the
// `p-act1` pass
L.add('v35-30A.01', {
  st: 'art/racks crateSlip → boardOut [INSERT]: MATCH from 17.10\'s purchase order: a packing slip in the same place and rows (PACKING SLIP · ITEM: AI CHIPS · QTY: MORE) taped on an INVIDIA crate; on the tear, the anti-static sleeve torn open and two anonymous hands drawing a board out of it in held steps (INVIDIA raised on its shroud)',
  marks: {tear: ['snd', 'paper_tear', 1, 0]},
  draw: (fb, k, sh, f) => {
    const t = mk(sh, 'tear', 8);
    if (k < t) { crateSlip(fb, f); return; }
    boardOut(fb, f, Math.floor((k - t) / 4) * 4 / Math.max(1, sh.e - sh.s - t - 8));
  },
});
L.add('v35-30A.02', {
  st: 'art/racks chassis [M] → aisle [W]: two boards slid home into a chassis on the two slides and latched on the two latches, an anonymous hand on each; then the cold aisle, two staff at the rack (silhouettes), and the LED column on the rack\'s face comes up in three steps on the three blips and climbs off the top where 17.11\'s price line climbs (x 466: the match out)',
  marks: {s1: ['snd', 'folder_slide', 1, 0], s2: ['snd', 'folder_slide', 2, 0], l1: ['snd', 'nameplate_off', 1, 0], l2: ['snd', 'nameplate_off', 2, 0], b1: ['snd', 'ui_mute_blip', 1, 0], b2: ['snd', 'ui_mute_blip', 2, 0], b3: ['snd', 'ui_mute_blip', 3, 0]},
  draw: (fb, k, sh, f) => {
    const s1 = mk(sh, 's1', 7), s2 = mk(sh, 's2', 28), l1 = mk(sh, 'l1', 25), l2 = mk(sh, 'l2', 45), b1 = mk(sh, 'b1', 52), b2 = mk(sh, 'b2', 57), b3 = mk(sh, 'b3', 62);
    const wide = b1 - 3, len = sh.e - sh.s;
    const t = (a: number, z: number) => (k < a ? 0 : k >= z ? 1 : (Math.floor((k - a) / 3) * 3) / (z - a));
    if (k < wide) { chassis(fb, f, {in1: t(s1, l1 - 2), in2: t(s2, l2 - 2), latch1: k >= l1, latch2: k >= l2}); return; }
    const lit = k < b1 ? 200 : k < b2 ? 150 : k < b3 ? 100 : Math.round(60 - (k - b3) / Math.max(1, len - b3) * 90);
    aisle(fb, f, lit);
  },
});
L.add('17.11', {
  st: 'v3.3 (P8, the act-out; the crack and the glass are gone): rooms/rooftop drawRooftopWide {chipLine}: phrase 4, the bell decaying; the register\'s window figure, the chip-maker\'s price, lifts off as a line (the intro\'s curve: flat, then straight up; v3.3.1: a 2 px white core in a cyan glow), its head climbing in whole-pixel held steps and off the top of the frame by 40 %, its tail out by 52 % (composer X\'s timing); Nesnej looks up, then Mario (and writes it down); Mas, eyes still down on the table; v3.3.1 (the audit\'s §3 #2): HIS beat, last: drawRooftopMasUp [MCU], his eyes level, then up after it (one swapped drawing), held, no voice; back on the wide (him looking up now) the frame tilts up in held steps and holds on the empty sky where the line left',
  draw: (fb, k, sh, f) => {
    const len = sh.e - sh.s;
    const lift = 6, out = Math.round(len * 0.4), gone = Math.round(len * 0.52);
    const m0 = gone + 3, mUp = m0 + 6, m1 = m0 + Math.round(len * 0.23); // his single: level, then up, held
    if (k >= m0 && k < m1) { RT.drawRooftopMasUp(fb, f, {up: k >= mUp, lid: 1}); return; }
    const head = k < lift ? 0 : heldLerp(k, lift, out, 0, 100, 2) / 100 * 1.02;
    const tail = k < out - 10 ? 0 : heldLerp(k, out - 10, gone, 0, 100, 2) / 100;
    const look = {nesnej: k >= 14, mario: k >= 22, mas: (k >= m1 ? 'up' : 'glass') as 'up' | 'glass'};
    RT.drawRooftopWide(fb, f, {mas: 'stand', mario: k >= 28 && k < 64 ? 'write' : 'stand', register: 1, nesnej: {arm: 'down'}, look, chipLine: tail >= 1 ? null : {head, tail}});
    // then the tilt up to the empty sky: the frame's content steps down (6 px every 2 f, to 36), the sky above it deepening
    const t0 = m1, dy = k < t0 ? 0 : Math.min(36, Math.floor((k - t0) / 2) * 6);
    if (dy) { shiftRoom(fb, 0, dy); for (let y = 0; y < dy; y++) for (let x = 0; x < 480; x++) fb.set(x, y, bayer(x, y) < 0.18 + (dy - y) / 200 ? PAL.F3 : PAL.F4); }
  },
});
L.add('17.13', {st: 'BLACK on the bell\'s last partial (the act-out)', draw: (fb) => { rect(0, 0, 480, RH, fb.ink(PAL.N0)); return {noVo: true}; }});

export const SEGMENT = defineSegment({
  seg: 'act2',
  lock: LOCK,
  layouts: L.all,
  options: {badge: false, vo: 'typed', voLowercase: true, subs: 'off', standin: 'stick'},
  review: {title: 'MR. MAS · EP1 · ACT TWO', subtitle: 'PIXEL v3.5 · LOCK act2 (THE v3.5 BASE LOCK)', durNote: 'AS THE STICK LOCK', soundLabel: 'SOUND · TEMP TRACK = THE v3.5 STICK MIX'},
});
