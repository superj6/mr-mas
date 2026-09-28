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
import * as TP from '../../../../shared/pixel/kits/tour-poster';
import * as RT from '../../../../shared/pixel/rooms/rooftop';
import * as RG from '../../../../shared/pixel/kits/register';
import {radnusBust2, RADNUS2_DEFAULT, RADNUS2_COLLAR, drawExtinguisherSmall} from './art/radnus-bust';
import {drawHalfWrittenECU} from './art/half-written';
import {spoken, blink, stepOf, heldLerp, marioM, nesnejM, roomM, freeze2, maskOf, lighten, drawGagCard, namePlate, FREEZE_BRIGHT, FREEZE_SKY, sweep} from './kit2';
import type {GagCard} from './kit2';
import {LOCK} from './data';

const L = layouts();
const talk = (v: Viseme, rest: Viseme = 'rest'): Viseme => (v === 'rest' ? rest : v);
/** a silent room-scale mouth (rehearsing under his breath): held drawings, never on a take */
const silentRoom = (kk: number): 'open' | 'smile' => (['open', 'smile', 'open', 'open', 'smile', 'smile', 'open', 'smile'] as const)[(kk >> 2) % 8];
/** a silent viseme track (the clone reading a card to itself) */
const silentLip = (kk: number): Viseme => (['E', 'rest', 'A', 'E', 'rest', 'O', 'rest', 'rest'] as const)[(kk >> 2) % 8];
const cache = new Map<string, (x: number, y: number) => boolean>();
const keepOf = (key: string, draw: (b: Buf) => void) => { let m = cache.get(key); if (!m) { m = maskOf(draw); cache.set(key, m); } return m; };

// ------------------------------------------------------------------ the gag cards (text blocks in each shot's empty corner)
const CARD_SIRRAH: GagCard = {x: 14, y: 12, name: 'SIRRAH', lines: ['THE EXPLAINER'], stat: ['DAY JOB: VICE PRESIDENT'], accent: PAL.U5};
const CARD_NEDIB: GagCard = {x: 14, y: 12, name: 'EOJ NEDIB', lines: ['THE PRESIDENT'], stat: [], accent: PAL.W7}; // v3.4: the stat row is cut (one deepfake: the Senate's)
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
  st: 'v3.4 (the bay\'s clip is cut; draft 8.3): rooms/bay-bridge drawBridgeOTS {noClip}: his feed is his own CLASS PHOTO #1 post only, its hearts climbing, held to the black (other people\'s items greyed under it); formerly {feed, hearts, scrub, tagBig, anchorDesk}: v3.3 (P6): the clip is drawn unmistakably as a generic news anchor at a desk (the set\'s lit panels, the glossy desk, her copy), its lower third a blank bar: not the senator, nobody real; the MATCH CUT: over Mas\'s shoulder at the dark bullpen window, his phone where the print was, his own CLASS PHOTO #1 post on it, the hearts climbing; his thumb scrolls to the next item, the anchor clip (her mouth a beat late) under the ALTERED AUDIO tag drawn to read; v3.2, HIS MOVE: his thumb drags the clip back and plays it again (late again) (the V.O. is cut); the skyline and the one lit window beyond',
  marks: {scroll: ['txt', 'CLASS PHOTO #1', 'until', 0]},
  draw: (fb, k, sh, f) => {
    const sc = mk(sh, 'scroll', 43), len = sh.e - sh.s;
    const feed = k < sc ? 0 : heldLerp(k, sc, sc + 14, 0, 100, 2) / 100;
    const hearts = 406 + Math.min(k, sc) * 19;
    const drag0 = sc + 52, drag1 = drag0 + 10; // it plays, he drags it back (two drawings), it plays again
    const progress = k < drag0 ? 0.3 + clamp((k - sc) / 150, 0, 1) * 0.6 : k < drag1 ? 0.12 : 0.12 + clamp((k - drag1) / 150, 0, 1) * 0.6;
    const m = (((k + 6) >> 2) % 3 === 0 ? 0 : 1) as 0 | 1;
    BB.drawBridgeOTS(fb, f, {f, mouth: k < sc + 16 || (k >= drag0 && k < drag1 + 6) ? 0 : m, progress, feed, hearts, scrub: k >= drag0 - 6 && k < drag1 + 4 ? 1 : 0, tagBig: true, anchorDesk: true, noClip: true});
    void len;
  },
});
L.add('14.06', {st: 'BLACK: the too-smooth voice runs on over black into the hearing (the match cut on the voice)', draw: (fb) => { rect(0, 0, 480, RH, fb.ink(PAL.N0)); return {noVo: true}; }});

// =================================================================== sc 15 · THE SENATE
L.add('15.01', {
  st: 'rooms/senate drawSenateMCU: THE CLONE (cast/lahtnemulb, clone: the 1-px highlight, the gloss) at his microphone, its red light on, over the dais\' drapes; the carried voice finds his mouth; the clone never blinks',
  face: {CLONE: 'lip'},
  draw: (fb, k, sh, f) => { SN.drawSenateMCU(fb, f, {bust: lahtBust({...LAHT_BUST_DEFAULT, clone: true, arm: 'mic', mouth: mouth(sh, k, 'CLONE'), lid: 0}), third: 'R', bg: 'dais', mic: true, lit: true}); },
});
L.add('15.02', {
  st: 'rooms/senate drawSenateWide: the hearing room (the dais, the gallery, the witness table with MAS and SUCRAM); v3.1: the matte chairman takes the red light from the clone\'s mic and tells the room the truth about the voice it just heard ("That voice was not mine. The words were not mine.", room-scale mouth); the clone still; the name plate LAHTNEMULB · CHAIRMAN (v3.2: a name and one relation word)',
  face: {LAHTNEMULB: 'room'},
  marks: {line: ['on', 'v31-a2-0003', 0], plate: ['txt', 'LAHTNEMULB', 'at', 0]},
  draw: (fb, k, sh, f) => {
    const line = mk(sh, 'line', 31);
    SN.drawSenateWide(fb, f, {chair: {arm: 'card', mouth: roomMouth(sh, k, 'LAHTNEMULB')}, clone: {arm: 'down'}, lit: k < line - 10 ? 'clone' : 'chair'});
    namePlate(fb, k - mk(sh, 'plate', 7), 'LAHTNEMULB · CHAIRMAN', 318, 168, PAL.G6); // v3.2: the plate carries one relation word
  },
});
L.add('15.03', {
  st: 'rooms/senate drawDais2S: THE CLONE (glossy, the better chair) gives the chairman a look; he takes the microphone back (the red light with it)',
  draw: (fb, k, sh, f) => {
    const take = 26;
    SN.drawDais2S(fb, f, {clone: {arm: k < take ? 'mic' : 'down', look: 1, brow: k >= 8 && k < take + 10 ? -1 : 0}, chair: {arm: k < take ? 'card' : 'mic', lid: blink(k, 1), look: k < take ? 0 : -1}, lit: k < take ? 'clone' : 'chair'});
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
  st: 'rooms/senate drawSenateOTS: from behind Mas (the back of his head) onto the dais; on "jobs" the chairman reaches for his next card and the clone takes it out of his hand (3 held steps) and reads it for him, silently; nobody remarks on it',
  marks: {jobs: ['w', 'e1-a2-15-07', 'jobs', 0]},
  draw: (fb, k, sh, f) => {
    const j = mk(sh, 'jobs', 120);
    const take = stepOf(k, [j, j + 4, j + 8]) as 0 | 1 | 2 | 3;
    const lid = Math.max(blink(k, 1), blink(k + 45, 1)) as 0 | 1 | 2;
    SN.drawSenateOTS(fb, f, {take, chair: {lid, look: take >= 2 ? 1 : k % 70 < 40 ? -1 : 0}, clone: {mouth: k >= j + 12 ? silentLip(k - j - 12) : 'rest', lid: 0}});
  },
});
L.add('15.10', {
  st: 'rooms/senate drawSenateWide: the dais leans in; one microphone\'s red light comes on and the senator behind it asks (room-scale mouth); v3.2: the question is the committee asking for his ask ("Is there anything you\'d like this committee to do?")',
  face: {SENATOR: 'room'},
  marks: {line: ['on', 'e1-a2-15-15', 0]},
  draw: (fb, k, sh, f) => {
    const line = mk(sh, 'line', 9);
    SN.drawSenateWide(fb, f, {lean: k >= 4, lit: k >= line - 6 ? 'senB' : null, senMouth: roomMouth(sh, k, 'SENATOR') === 'open' ? 'senB' : null, chair: {arm: 'card'}});
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
  st: 'rooms/senate drawSenateWide: Mas holds the open wallet up to the dais and says nothing; the gallery gasps (one held drawing); the clone leans to its lit mic and reads the card (room-scale mouth)',
  face: {CLONE: 'room'},
  marks: {gasp: ['snd', 'synth:gasp', 1, 0], line: ['on', 'e1-a2-15-13', 0]},
  draw: (fb, k, sh, f) => {
    const g = mk(sh, 'gasp', 10), line = mk(sh, 'line', 40);
    SN.drawSenateWide(fb, f, {mas: {wallet: true}, gasp: k >= g && k < g + 36, clone: {arm: k >= line - 12 ? 'lean' : 'down', mouth: roomMouth(sh, k, 'CLONE')}, lit: k >= line - 8 ? 'clone' : null, chair: {arm: 'card'}});
  },
});
L.add('15.14', {
  st: 'rooms/senate drawWitness2S: SUCRAM stamps furiously on the three stamps and on through his line (slam / raise held drawings), the moth dodging over the pad; then still, he looks at Mas as Mas says, quietly, to the dais, "…i have no equity in nopeai.", and goes back to his phone; the moth lands and lifts; the senator O.S.',
  face: {SUCRAM: 'lip', MAS: 'lip'},
  marks: {s1: ['snd', 'rubber_stamp_C', 1, 0], s2: ['snd', 'rubber_stamp_C', 2, 0], s3: ['snd', 'rubber_stamp_C', 3, 0], sEnd: ['end', 'e1-a2-15-14', 0], mas: ['on', 'v3-a2-0001', 0], masEnd: ['end', 'v3-a2-0001', 0]},
  draw: (fb, k, sh, f) => {
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
  st: 'v3.2, HIS MOVE (the proposal): rooms/senate drawSenateOTS (15.07\'s setup: from behind Mas onto the dais, the chairman and the clone listening, the chairman blinking) for "i would form a new agency…" (his own testimony, the record); on "licenses" the cut to kits/senate-props drawSheetHigh [HIGH]: his hand slides PLEASE REGULATE ME, signed, toward the dais in held steps as he goes on; Sucram\'s stamp comes down mid-slide (CALLED IT. (BEFORE LAUNCH.)) and the sheet leaves frame right. (The stick\'s slide and stamp sounds sit before the cut: for the sound pass)',
  marks: {cut: ['w', 'v32-a2-0001', 'licenses', 0]},
  draw: (fb, k, sh, f) => {
    const c = mk(sh, 'cut', 68);
    // the OTS drifts in on him by whole pixels (1 px / 10 f) while he proposes it; the chairman and the clone blink
    if (k < c) { SN.drawSenateOTS(fb, f, {take: 0, chair: {lid: blink(k, 1), look: 0}, clone: {lid: blink(k + 40, 3)}}); shiftRoom(fb, -Math.min(6, Math.floor(k / 10))); return; }
    const kk = k - c;
    // the slide spread over the rest of his sentence: the sheet leaves frame as the line ends (no empty table under him)
    const slide = (kk < 10 ? 0 : kk < 24 ? 1 : kk < 64 ? 2 : kk < 94 ? 3 : 4) as 0 | 1 | 2 | 3 | 4;
    SP.drawSheetHigh(fb, f, {slide, stamp: kk < 34 ? null : kk < 42 ? 'up' : kk < 47 ? 'down' : 'done'});
  },
});
L.add('15.16', {
  st: 'rooms/senate drawSenateDais: a match on action, the sheet arrives from frame left into the clone\'s hand; the senators lean in, delighted: every one of them wants to sign it (they turn it over on the paper curl)',
  marks: {curl: ['snd', 'paper_curl', 1, 0]},
  draw: (fb, k, sh, f) => { const c = mk(sh, 'curl', 24); SN.drawSenateDais(fb, f, {sheet: k < 6 ? 1 : k < c ? 2 : 3, lean: k >= 10 && k < c, chair: {arm: 'card', nod: k >= c ? (((k >> 3) & 1) as 0 | 1) : 0}}); },
});
// =================================================================== sc 16 · THE TOUR (one held poster)
L.add('16.01', {
  st: 'kits/tour-poster drawTourPoster: ONE held poster (16.05 merged); the strip slaps across on the paper whip, EU CANCELLED; v3.2, HIS MOVES: his thumb on his phone in the corner posts "…no plans to leave" (the post pops), UN-CANCELLED, and his own hand comes in with a rubber stamp and stamps ADDED DUE TO POPULAR DEMAND (in, stamp, out, on the stamp); passing cars\' lights sweep the brick twice, one each way (a one-step band, the hold\'s life); the one-pixel smile holds',
  marks: {strip: ['snd', 'paper_whip', 1, 0], c1: ['snd', 'rubber_stamp_C', 2, 0], post: ['snd', 'post_click', 1, 0], un: ['snd', 'rubber_stamp_C', 3, 0], add: ['snd', 'rubber_stamp_C', 4, 0]},
  draw: (fb, k, sh, f) => {
    const since = (m: string, d: number) => (k >= mk(sh, m, d) ? k - mk(sh, m, d) : null);
    const post = since('post', 101);
    const pc = mk(sh, 'post', 63), ad = mk(sh, 'add', 92);
    // v3.2, HIS MOVES: his thumb on his phone in the frame's corner posts the walk-back; his own hand stamps the last slot
    const phone = k >= pc - 14 && k < pc + 20 ? ((k >= pc - 2 && k < pc + 4 ? 1 : 0) as 0 | 1) : null;
    const hand = k >= ad - 8 && k < ad ? 'in' : k >= ad && k < ad + 4 ? 'stamp' : k >= ad + 4 && k < ad + 12 ? 'out' : null;
    TP.drawTourPoster(fb, f, {strip: k >= mk(sh, 'strip', 13), cancelled: since('c1', 28), post: post !== null && k < mk(sh, 'un', 123) + 16 ? post : null, un: since('un', 123), added: since('add', 147), phone, hand});
    // the headlight: a soft band of one palette step crossing the wall and the poster, left to right, in 4-px steps
    const len = sh.e - sh.s;
    sweep(fb, k, Math.round(len * 0.2), Math.round(len * 0.52), -60, 540);
    sweep(fb, k, Math.round(len * 0.78), len, 540, -40, 30);
  },
});

// =================================================================== sc 17 · THE ROOFTOP
const QUOTE = '"Mitigating the risk of extinction from AI should be a global priority…"';
L.add('17.01', {
  st: 'rooms/rooftop drawRooftopWide + drawQuoteBox: the table under the sky, the statement typing across the top and held to read; the signers step up and sign in swaps on the pen sounds (SIMED with his chess piece, NOTNIH, both unplated), MAS in one stroke (pen_run), MARIO who keeps the pen',
  marks: {a: ['snd', 'pen_scribble_short', 1, 0], b: ['snd', 'pen_scribble_short', 2, 0], m: ['snd', 'pen_run', 1, 0], r: ['snd', 'pen_scribble_short', 3, 0]},
  draw: (fb, k, sh, f) => {
    const a = mk(sh, 'a', 43) - 6, b = mk(sh, 'b', 70) - 6, m = mk(sh, 'm', 103), r = mk(sh, 'r', 122);
    const signers: RT.RoofSigner[] = [];
    if (k < a) signers.push({v: 0, at: 'queue0'}, {v: 1, at: 'queue1'});
    else if (k < b) signers.push({v: 0, at: 'sign'}, {v: 1, at: 'queue0'});
    else if (k < m - 4) { if (k < b + 16) signers.push({v: 0, at: 'leave'}); signers.push({v: 1, at: 'sign'}); }
    else if (k < m + 12) signers.push({v: 1, at: 'leave'});
    RT.drawRooftopWide(fb, f, {signers, mas: k >= m - 4 && k < m + 10 ? 'reach' : 'stand', mario: k >= r - 4 ? 'write' : 'stand'});
    RT.drawQuoteBox(fb, QUOTE, Math.max(0, (k - 7) * 2));
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
  st: 'kits/register drawPurchaseOrder {mario} [ECU] (v3.3, P7: unambiguously MARIO\'s hand: his ink-blue fleece sleeve out of frame, his footnote still wet on the order, his appendix scroll\'s end at the frame\'s edge, Mas\'s hand half out beside it, empty; held half a second longer): the signing pen in Mario\'s hand is now a purchase order; its two rows print in on the lock\'s text times (AI CHIPS · QTY: MORE), a glint crossing the paper\'s header',
  marks: {rows: ['txt', 'AI CHIPS', 'at', 0]},
  draw: (fb, k, sh, f) => {
    RG.drawPurchaseOrder(fb, f, {k, mario: true});
    const r = mk(sh, 'rows', 13);
    if (k < r) rect(150 + 48, 18 + 40, 190 - 58, 54, fb.ink(PAL.P2));
    else if (k < r + 4) rect(150 + 48, 18 + 66, 190 - 58, 28, fb.ink(PAL.P2));
    sweep(fb, k, 24, 60, 110, 380, 18, (x, y) => y >= 18 && y < 42 && x >= 150 && x < 340);
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
  review: {title: 'MR. MAS · EP1 · ACT TWO', subtitle: 'PIXEL v3.4 · LOCK act2 (THE v3.4 STICK LOCK)', durNote: 'AS THE STICK LOCK', soundLabel: 'SOUND · TEMP TRACK = THE v3.4 STICK MIX'},
});
