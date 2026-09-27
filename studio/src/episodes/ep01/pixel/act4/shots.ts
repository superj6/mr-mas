// MR. MAS — Ep1 v3 · ACT FOUR, "the Blip, told twice", on the v3 stick lock (the v3-shots-act4 pass, 2026-09-27).
//
// A PORT. Act Four v5's 83 layouts (act4/animatic/shots5.ts DRAW5, run through its own drawShot5, exactly as the
// pipeline's act4-v5 test runs them) draw every shot v3 kept as it was, handed this lock's shots (./data.ts: tools/lock.py
// on show/reel/ep01-v3/ep01-v3-act4.json, with lock_v5.py's plan tables and the v3 re-anchors in ./plan.json). Only what
// v3 changed is drawn here (kind 'V' in the margin); everything else is kind 'P' (the v5 layout, its v5 verdict R/C/N
// kept in `st`). Nothing in act4/animatic, act4-v5 or shared/pixel is edited: the v3 art is new additive opt-in states
// in ./art/ (race.ts, invite.ts, texts.ts), and the layouts below that change a v5 layout are copies of it with the
// change (each says so).
//
// What v3 changed, and where it is drawn (the beat plan full-v3/beat-plan/act4.json; script-v3-notes §4 / §7):
//   no side badges (the host's option, off) · no WHAT THEY DIDN'T KNOW card (S5.01 is cut from the lock) · the GLYPH
//   dissolve stays at the Cancel click (S1.09), J1 stays off · plates cut to names (S4.08 ADELINA, S4.10 TTEMME, the
//   repeat plates gone with their lock text) · Mas's inner voice (the host types it: S1.01, S1.06, S2.01, S5.03, S5.09,
//   S5.09-back) · arrivals and aftermaths hold life (S1.01, S1.06, S1.12, S3.07, S5.02, S5.12, S7.08, S8.05, S8.10) ·
//   C13 (S4.02: the first phone goes over the edge, clack; Alyi's reflection says his line in the wide) · C14 (S4.08: the
//   second call, the rent meters and NOZAMA gone) · C15 (S4.13: the statement's second sentence; S4.13e: its tail on
//   Tasya's mouth) · the new Tasya and Terb reads (S7.02, S7.02b, S7.07, S7.07b re-anchored) · §7's art: race weekend on
//   the Strip (S1.01), the JOIN screen's four attendee icons (S1.02, S1.06), MACROSOFT · BILLIONS IN and EQUITY: 0 alone
//   (S1.04), the arrow's tag ALYI (S1.09), the phone falling (S4.02), the split without the meter text or NOZAMA (S4.08),
//   THE OTHER YRRAL (S7.07b); and the letter's ALYI without (REPORTED) (S5.06: the lock's text).
import {Buf, rect, bayer, hash} from '../../../../shared/pixel/px';
import {PAL, stepColor, familyOf} from '../../../../shared/pixel/palette';
import type {GlyphLayer} from '../../../../shared/pixel/glyph';
import {blitImg} from '../../../../shared/pixel/figure';
import {
  callChrome, drawTile, captureTile, tileDrop, slideTiles, dialogButton, drawPointer, tilePlate, dropY, callDialog, noticeIcon,
} from '../../../../shared/pixel/kits/callgrid';
import {drawStaffLetter, LETTER_SCROLL_MAX, letterLayout} from '../../../../shared/pixel/kits/staff-letter';
import {drawChatPanel} from '../../../../shared/pixel/kits/chat-panel';
import {badgesOnDeskRoom, BADGES_ROOM_AT} from '../../../../shared/pixel/kits/macrosoft-badge';
import {drawLighthouse} from '../../../../shared/pixel/rooms/lighthouse';
import {BR, drawBoardroom, FIRES_SC30} from '../../../../shared/pixel/rooms/boardroom';
import {drawTerbRoom, TERB_ROOM_DEFAULT, terbWalkAt} from '../../../../shared/pixel/cast/terb';
import {drawMasStand, MAS_STAND_DEFAULT, masWalkAt} from '../../../../shared/pixel/cast/mas-stand';
import {drawMadaSeated, MADA_SEAT_DEFAULT} from '../../../../shared/pixel/cast/mada';
import {drawBoardPlate, drawBoardPlateTable, drawBoardPlateFront} from '../../../../shared/pixel/rooms/boardroom-plate';
import type {BoardPlateOpts} from '../../../../shared/pixel/rooms/boardroom-plate';
import {drawDarkPlate, drawDarkPlateDesk, drawDarkPlateFront, DPLATE} from '../../../../shared/pixel/rooms/darkroom-plate';
import type {DarkPlateOpts} from '../../../../shared/pixel/rooms/darkroom-plate';
import {drawSlateDoorOpen, slateDoorSign, SLATE_GAP} from '../../../../shared/pixel/rooms/slate-desks';
import {drawCalmOffTerms2S} from '../../../../shared/pixel/rooms/calmoff-terms';
import {FIRES_CALMOFF} from '../../../../shared/pixel/rooms/twoshots';
import {alyiReflection} from '../../../../shared/pixel/cast/alyi-speak';
import {marioImg, MARIO_BASE, MARIO_FOOT} from '../../../../shared/pixel/cast/mario';
import type {MarioArm} from '../../../../shared/pixel/cast/mario';
import {drawAdelinaRoom, ADELINA_ROOM_DEFAULT} from '../../../../shared/pixel/cast/adelina';
import type {AdelinaArm} from '../../../../shared/pixel/cast/adelina';
import {drawTasyaRoom, TASYA_ROOM_DEFAULT} from '../../../../shared/pixel/cast/tasya-speak';
import {tasyaPhonePortrait} from '../../../../shared/pixel/cast/tasya-phone';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../shared/pixel/cast/mas';
import type {MasPortraitState} from '../../../../shared/pixel/cast/mas';
import {defineSegment, layouts as registry, mouth, roomMouth, room3Mouth, lipOn, talking, held, on2, mk, RH, pt, pw, bpt, bpw, soft, softMask, keepRect, vignette, rackStep, RACK, drift, shiftRoom, doorFrame, ACCENT} from '../kit';
import type {Layout, PxShot} from '../kit';
import {drawBust, MCU_X, mcuRoom} from '../../act4/animatic/framing';
import {putUI, blipCard, freezePrint} from '../../act4/animatic/lay';
import {G5, G4, ui, wifi, board4, masTileState, DLG} from '../../act4/animatic/shots';
import {boardRoom, bullpenRoom, doorShake} from '../../act4/animatic/backs';
import {DRAW5, drawShot5, factsText5, OPT5} from '../../act4/animatic/shots5';
import type {ShotV5} from '../../act4/animatic/data-v5';
import {LOCK} from './data';
import {drawSuiteRace} from './art/race';
import {drawNudgeJoinInvite, drawClickInvite, CLICK_TILES, CLICK_ARROW_REST} from './art/invite';
import {planZerosV3, cursorTagV3, letterAlyiV3, yrralPlateV3, plateName} from './art/texts';

const L = registry();
const len = (sh: PxShot) => sh.e - sh.s;
const blink = (k: number, seed: number): 0 | 1 | 2 => { const p = (k + seed * 37) % 97; return p === 0 || p === 2 ? 1 : p === 1 ? 2 : 0; };
const lineOf = (sh: PxShot, id: string) => sh.lines.find((l) => l.id === id) ?? null;
const textOf = (sh: PxShot, kind: string, sub = '') => sh.texts.find((t) => t.kind === kind && t.text.includes(sub)) ?? null;
/** a v5 layout on this shot (drawShot5: v5's footnote and toast styles, its own stick fallback if it throws) */
const v5 = (fb: Buf, k: number, sh: PxShot, f: number) => drawShot5(fb, k, sh as unknown as ShotV5, f);
const V = (id: string, what: string) => `V3 · ${what}${DRAW5[id] ? ` · over v5 ${DRAW5[id].kind}: ${DRAW5[id].st}` : ''}`;
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

// ================================================================== S1 · NOON, LAS VEGAS
L.add('S1.01', {kind: 'V', st: V('S1.01', 'the suite wide (backs suiteRoom: v2 24.01\'s truck and shiver) + art/race suiteRaceDressing: race weekend on the Strip (lamp-post banners, pennants and flags on the grandstand, barrier wraps; generic, no lettering), fluttering on 10s; the drift now spans the arrival, 1 px / 11 f (12 px)'),
  draw: (fb, k) => {
    drawSuiteRace(fb, k, {truckX: 236 + Math.floor(k / 2), shiverT0: 18});
    shiftRoom(fb, drift(k, 11, 12));
  }});
L.add('S1.02', {kind: 'V', st: V('S1.02', 'v5 S1.02 with art/invite drawNudgeJoinInvite: the call app\'s four board tiles carry the invite\'s attendee circles (a door, a glowing page, a spinner, a black square; none green), his slot empty'),
  draw: (fb, k, sh) => {
    const nudge = mk(sh, 'nudge', 10), o1 = mk(sh, 'out1', 24), o2 = mk(sh, 'out2', 32), g = mk(sh, 'glow', 44), p = mk(sh, 'print', 52);
    const step = k < nudge ? 'set' : k < o1 ? 'nudge' : k < o2 ? 'out1' : k < g ? 'out2' : 'gone';
    drawNudgeJoinInvite(fb, step, k, {pointer: 'beside', glow: k < o2 ? 0 : k < o2 + 6 ? 1 : 2});
    if (k >= g && k < p) {
      const n = 1 + Math.floor((k - g) / 2);
      for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) if (((x + y) & 3) < n) fb.set(x, y, stepColor(fb.get(x, y), 1));
    }
    return {print: k >= p ? 'blueprint' : undefined};
  }});
L.add('S1.04', {kind: 'V', st: V('S1.04', 'art/texts planZerosV3 over it: the key ring\'s label MACROSOFT · BILLIONS IN, and EQUITY: 0 alone (the caption\'s box re-drawn from the same sheet)'),
  draw: (fb, k, sh, f) => { const out = v5(fb, k, sh, f); planZerosV3(fb, 10); return out; }});
// ---- S1.06: his finger over JOIN while he thinks it through (v3-vo-18), the laptop's arrow checking the attendees
const S106_REST: [number, number] = [CLICK_ARROW_REST[0] + 26, CLICK_ARROW_REST[1] - 4]; // beside JOIN (S1.02's rest)
const glide = (k: number, k0: number, n: number, a: [number, number], b: [number, number]): [number, number] => {
  const t = Math.max(0, Math.min(1, (on2(k) - k0) / Math.max(1, n)));
  return [Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t)];
};
const tileTip = (i: number): [number, number] => [CLICK_TILES[i][0] + 6, CLICK_TILES[i][1] + 2];
L.add('S1.06', {kind: 'V', st: V('S1.06', 'art/invite drawClickInvite (drawClickInsert re-drawn: the four attendee circles on the board\'s tiles, his slot dark): the laptop\'s arrow leaves JOIN on "gerg", steps across the four icons (each tile lit as it passes), goes back to the door on "alyi", down onto JOIN on "probably"; his finger moves with it on the trackpad (1/8 of its travel); the click on the sound; connecting…; the frame\'s foot on shadow under the V.O.'),
  marks: {look: ['w', 'v3-vo-18', 'gerg\'s', 0], door: ['w', 'v3-vo-18', 'alyi', 0], back: ['w', 'v3-vo-18', 'probably', 0], click: ['snd', 'dialog_ok_click', 1, 0]},
  draw: (fb, k, sh) => {
    const look = mk(sh, 'look', 10), door = mk(sh, 'door', 48), back = mk(sh, 'back', 82), c = mk(sh, 'click', 134);
    let p: [number, number] = S106_REST, hover = -1;
    if (k >= look && k < door) {
      const kk = k - look; // across the four, 8 f a tile, then held on the black square
      const i = Math.min(3, Math.floor(kk / 8));
      p = i === 0 && kk < 4 ? glide(k, look, 4, S106_REST, tileTip(0)) : kk >= i * 8 && kk < i * 8 + 4 ? glide(k, look + i * 8, 4, tileTip(i - 1), tileTip(i)) : tileTip(i);
      hover = i;
    } else if (k >= door && k < back) { p = glide(k, door, 6, tileTip(3), tileTip(0)); hover = k >= door + 6 ? 0 : -1; }
    else if (k >= back) p = glide(k, back, 10, tileTip(0), CLICK_ARROW_REST);
    const hand: [number, number] = [Math.round((p[0] - CLICK_ARROW_REST[0]) / 8), Math.round((p[1] - CLICK_ARROW_REST[1]) / 8)];
    drawClickInvite(fb, k, {click: k >= c && k < c + 2, pointer: p, hand, hover});
    if (k >= c + 1) { rect(186, 60, 108, 14, fb.ink(PAL.N1)); pt(fb, 'connecting' + '...'.slice(0, 1 + (Math.floor(k / 5) % 3)), 192, 64, PAL.P1); }
    voShade(fb, 290);
  }});
// ---- S1.09: v5's layout, the arrow's tag the name alone
const DLG5 = {...DLG, x: DLG.x + 16};
const dialog5 = (b: Buf, k: number, o: {k0?: number; cancelDown?: boolean} = {}) => {
  const kk = k - (o.k0 ?? -99);
  if (kk < 0) return;
  if (kk < 2) { rect(DLG5.x + 98 - (kk + 1) * 32, DLG5.y + 48 - (kk + 1) * 16, (kk + 1) * 64, (kk + 1) * 32, b.ink(PAL.P2)); return; }
  callDialog(b, DLG5.x, DLG5.y, {w: DLG5.w, head: 'MAS MANALT', cancelDown: o.cancelDown});
};
const hoverRing = (b: Buf, bx: number, by: number, bw: number, bh: number, col: number) => {
  for (const t of [2, 3]) {
    rect(bx - t, by - t, bw + t * 2, 1, b.ink(col)); rect(bx - t, by + bh - 1 + t, bw + t * 2, 1, b.ink(col));
    rect(bx - t, by - t, 1, bh + t * 2, b.ink(col)); rect(bx + bw - 1 + t, by - t, 1, bh + t * 2, b.ink(col));
  }
};
const callNotice = (b: Buf, s: string, k: number, y = RH - 34) => {
  if (k < 0) return;
  const w = bpw(s) + 40, x = Math.round(240 - w / 2), rise = k < 3 ? [8, 4, 1][k] : 0;
  const yy = y + rise;
  rect(x, yy, w, 24, b.ink(PAL.N0)); rect(x + 1, yy + 1, w - 2, 22, b.ink(PAL.N3)); rect(x + 1, yy + 1, w - 2, 1, b.ink(PAL.N5));
  noticeIcon(b, x + 7, yy + 7, 'leave');
  bpt(b, s, x + 24, yy + 5, PAL.P2);
};
L.add('S1.09', {kind: 'V', st: V('S1.09', 'v5 S1.09 copied (the arrow onto Cancel, the click, the masked GLYPH dissolve, G5 -> G4, the notice) with art/texts cursorTagV3: the arrow\'s tag ALYI alone'), glyph: true,
  draw: (fb, k, sh, f) => {
    const b = ui();
    const c = mk(sh, 'click', 57), s1 = mk(sh, 'step1', 19), s2 = mk(sh, 'step2', 38);
    const layers: GlyphLayer[] = [];
    const masT = {...masTileState(), neonGuard: OPT5.neonGuard};
    if (k < c + 2) {
      callChrome(b, {title: 'board sync', clock: null, controls: false});
      board4(b, f, G5.slice(1));
      drawTile(b, masT, f);
      wifi(b);
      dialog5(b, 99, {cancelDown: k >= c});
      const [cbx, cby, cbw, cbh] = dialogButton(DLG5.x, DLG5.y, 'cancel', DLG5.w);
      const P: Array<[number, number]> = [[G5[1].x + 60, G5[1].y + 44], [G5[1].x + 20, G5[1].y + 70], [cbx + cbw - 10, cby + 11], [cbx + 30, cby + 9]];
      const i = k < s1 ? 0 : k < s2 ? 1 : k < c - 6 ? 2 : 3;
      const [px, py] = P[i];
      if (i >= 2) hoverRing(b, cbx, cby, cbw, cbh, ACCENT.ALYI ?? PAL.W5);
      drawPointer(b, px, py, k >= c);
      cursorTagV3(b, px, py, 'ALYI', ACCENT.ALYI ?? PAL.W5);
    } else {
      const kk = k - c;
      const rects = kk < 22 ? G5.slice(1) : slideTiles(G5.slice(1), G4, kk, 22, 8);
      callChrome(b, {title: 'board sync', clock: null, controls: false});
      const kd = kk - 2;
      if (kd >= 8) tilePlate(b, G5[0].x, G5[0].y + dropY(kd));
      board4(b, f, rects);
      wifi(b);
      const img = captureTile({...masT, open: undefined}, f - kk);
      layers.push(tileDrop(b, img, G5[0].x, G5[0].y, kd, {grey: true}));
      const n = textOf(sh, 'toast');
      if (n) callNotice(b, "You've been removed from the meeting.", k - n.s);
    }
    putUI(fb, b, false);
    return {layers};
  }});
L.add('S1.12', {kind: 'V', st: V('S1.12', 'v5 (v4 S1.12: the OTS on the frozen tiles, the fallaway) + the aftermath\'s life: the Strip\'s neon breathing on the red rim of his shoulder and in the window (one palette step, held 12 f)'),
  draw: (fb, k, sh, f) => {
    const out = v5(fb, k, sh, f);
    if (Math.floor((k + 6) / 12) % 2) for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
      if (x >= 90 && x < 440) continue; // his rim (left) and the window strip (right) only, never the frozen call
      const c = fb.c[y * 480 + x], fam = familyOf(c);
      if (fam && fam[0] === 'R' && fam[1] >= 1) fb.c[y * 480 + x] = stepColor(c, 1);
    }
    return out;
  }});

// ================================================================== S3 · FRIDAY
L.add('S3.07', {kind: 'V', st: V('S3.07', 'v5 S3.07 + the doorway\'s aftermath (+0.8 s): after he steps back the door leaf eases a few px toward shut in 3 held steps, then rests'),
  draw: (fb, k, sh, f) => {
    const out = v5(fb, k, sh, f);
    const gone = mk(sh, 'step', 211) + 12;
    if (k >= gone) { // the leaf (doorFrame's right leaf: x 422..479) swings in over the jamb, 3 held steps of 3 px
      const d = Math.min(3, 1 + Math.floor((k - gone) / 6)) * 3;
      const x0 = 422 - d;
      rect(x0, 0, 480 - x0, RH, fb.ink(PAL.N1)); rect(x0, 0, 2, RH, fb.ink(PAL.N0)); rect(478, 0, 2, RH, fb.ink(PAL.D1));
      rect(x0 + 2, 0, 1, RH, fb.ink(PAL.N2));
    }
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
L.add('S4.02', {kind: 'V', st: V('S4.02', 'v5 S4.02 re-built for C13: backs boardRoom (the wide at night, held; three phones C, D, R) + phone A composited from its own room render (its body and glow): it steps with the others, then on the second buzz walks on to the table\'s edge, teeters (a silent buzz), tips and falls, clack on the landing_thunk, lies lit on the floor; the phones buzz on 2s (v5 held one offset); NELEH room-scale mouth; ALYI\'s reflection in the glass lip-synced for "That is the company telling us."; the caller IDs (the lock\'s words), phone A\'s gone when it falls; v5\'s small wall screen'),
  face: {ALYI: 'lip'},
  draw: (fb, k, sh, f) => {
    const bz = mk(sh, 'buzz', 7), bz2 = mk(sh, 'buzz2', 203), tip = mk(sh, 'tip', 369);
    const step = Math.min(3, (k >= bz ? 1 : 0) + (k >= bz + 15 ? 1 : 0) + (k >= bz2 ? 1 : 0));
    const buzz = (k >= bz && k < bz + 30) || (k >= bz2 && k < bz2 + 30);
    const teeter = k >= tip - 12 && k < tip;
    const jig = buzz ? 1 + ((k >> 1) % 2) : 0, jigA = buzz || teeter ? 1 + ((k >> 1) % 2) : 0;
    const stepA = k < bz2 ? step : Math.min(6, 3 + Math.floor((k - bz2) / 8));
    const nm = roomMouth(sh, k, 'NELEH'), am = mouth(sh, k, 'ALYI');
    held(fb, `v3a4:s402-${step}-${jig}-${nm}-${am}`, (b) => boardRoom(b, jig, {...roomOpts({lit: true, buzz: jig !== 0, step}, ['C', 'D', 'R']),
      reflection: {img: alyiReflection({mouth: am, eyes: 'open', t: 0, mirror: true}), x: 40, y: 38, k: 2}}, {neleh: {mouth: nm}, mada: true, alyi: false}));
    if (k < tip) { // phone A on the table: its own pixels over the room
      const {bare, one} = phoneA(stepA, jigA);
      for (let i = 0; i < 480 * RH; i++) if (one.c[i] !== bare.c[i]) fb.c[i] = one.c[i];
    } else fallPhone(fb, PHONE_AT[0][0] + 1, k - tip, f);
    wallScreen(fb, 222, 30, f);
    if (k >= bz) PHONE_IDS.forEach((s, i) => {
      if (i === 0 && k >= tip) return; // it went over
      const st = i === 0 ? stepA : step;
      const [px, py] = PHONE_AT[i];
      const x = px + 4 - Math.round(pw(s) / 2), y = py + st * 3 - 13;
      rect(x - 2, y - 1, pw(s) + 4, 9, fb.ink(PAL.N0)); rect(x - 2, y + 8, pw(s) + 4, 1, fb.ink(PAL.C4)); pt(fb, s, x, y, PAL.C7);
    });
  }});
// ---- S4.08 (C14): the split, one held shot: Neleh's call | the lighthouse; no rent meters (their text went with C14),
// no NOZAMA; Adelina's plate her name; after "no." and the click, the left pane goes dark and CALL ENDED
const pane = (fb: Buf, src: Buf, sx: number, dx: number) => { for (let y = 0; y < RH; y++) for (let x = 0; x < 238; x++) fb.set(dx + x, y, src.get(sx + x, y)); };
const dimL = (b: Buf, x: number, y: number, w: number, h: number, k: number) => { for (let j = y; j < Math.min(RH, y + h); j++) for (let i = Math.max(0, x); i < Math.min(480, x + w); i++) b.set(i, j, stepColor(b.get(i, j), -k)); };
L.add('S4.08', {kind: 'V', st: V('S4.08', 'v5 S4.08 copied for C14: rooms/lighthouse with no rent meters (meters 0: no RENT flags, no NOZAMA / ELGOOG, no meter tag, no NOZAMA caller ID), the second call gone (after the click the throne falls, the pane dims, CALL ENDED; Mario\'s arm down); plates from the lock\'s text, names only (art/texts plateName: ADELINA)'),
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
      plateName(fb, 248, 8, t.text, k - t.s, t.text === 'MARIO' ? PAL.F5 : PAL.W5);
    }
  }});
L.add('S4.10', {kind: 'V', st: V('S4.10', 'v5 S4.10 copied with the plate cut to the name: art/texts plateName TTEMME'),
  draw: (fb, k, sh, f) => {
    const step = Math.max(0, Math.min(2, Math.floor((k - mk(sh, 'swing', 0)) / 8)));
    const spots = [{x: 254, y: 56, r: 20}, {x: 254, y: 82, r: 26}, {x: 254, y: 100, r: 30}];
    held(fb, `v3a4:s410-${step}`, (b) => boardRoom(b, 0, {sticky: {seat: 'C', text: ''}, spot: spots[step], laptop: true, blueprint: {word: false}, phones: {step: 4}}, {neleh: {}, mada: true, alyi: true, ttemme: step >= 1 ? {} : null}));
    wallScreen(fb, 222, 30, f, step === 0);
    const chat = textOf(sh, 'label', 'LIVE');
    if (chat && k >= chat.s && step >= 1) drawChatPanel(fb, BR.SEATS.C.x + 30, BR.WALL_FLOOR_Y - 44, 'room', f);
    const t = textOf(sh, 'plate');
    if (t) plateName(fb, 22, 150, t.text, k - t.s, PAL.U5);
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

// ================================================================== S5 · HIS SIDE, 2 AM
L.add('S5.02', {kind: 'V', st: V('S5.02', 'v5 (v2 29.00 the home shot) + the arrival (2.6 -> 4.5 s) as a slow drift, 1 px / 12 f (9 px)'),
  draw: (fb, k, sh, f) => { const out = v5(fb, k, sh, f); shiftRoom(fb, drift(k, 12, 9)); return out; }});
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
const mas = (s: Partial<MasPortraitState> = {}) => masPortrait({...MAS_PORTRAIT_DEFAULT, look: -1, ...s});
L.add('S5.12', {kind: 'V', st: V('S5.12', 'v5 S5.12 copied + his blinks through the aftermath (2.9 -> 5.5 s): the rack to the door, then the hold is his'),
  draw: (fb, k, sh) => {
    const st = rackStep(k, mk(sh, 'rack', 41));
    const [kA, kB] = RACK[st];
    const doorMask = new Uint8Array(480 * 270);
    keepRect(doorMask, DPLATE.door.x0 - 2, DPLATE.door.y0 - 2, DPLATE.door.x1 - DPLATE.door.x0 + 4, DPLATE.deskY - DPLATE.door.y0 + 4);
    held(fb, `v3a4:s512:${kB}`, (b) => {
      const plate: DarkPlateOpts = {tally: 3, glass: true, lanyard: true, phone: 'up', door: 4};
      drawDarkPlate(b, 0, plate); drawSlateDoorOpen(b, 0, {gap: SLATE_GAP.open}); slateDoorSign(b, 0);
      drawDarkPlateDesk(b, 0, plate); drawDarkPlateFront(b, 0, plate);
      soft(b, 2, doorMask); softMask(b, kB, doorMask); vignette(b, MCU_X.L + 56, 2);
    });
    drawBust(fb, mas({mouth: mouth(sh, k, 'MAS'), look: -1, lid: blink(k + 40, 7)}), {third: 'L', faceK: kA});
  }});

// ================================================================== S7 · THE RETURN
L.add('S7.02', {kind: 'V', st: V('S7.02', 'v5 S7.02 copied (the walkout wide, held; Tasya on the floor right of Mas\'s desk, facing him; the badges on his desk; the key ring once) with Tasya speaking now (v3-a4-0002, room-scale mouth) and Mas silent at his desk'),
  face: {TASYA: 'room'},
  draw: (fb, k, sh) => {
    const tm = roomMouth(sh, k, 'TASYA');
    const arm = k >= 12 && k < 24 ? ((Math.floor(k / 3) % 2) ? 'keys1' : 'keys0') : 'clasp';
    held(fb, `v3a4:s702-${tm}-${arm}`, (b) => {
      const A = bullpenRoom(b, 0, {variant: 'walkout'}, {mas: {mouth: 'rest'}, tasya: null, landlord: {floor: 0, ceiling: 0, walls: 0},
        stage: (bb) => drawTasyaRoom(bb, 372, 199, {...TASYA_ROOM_DEFAULT, arm, light: 'room', mouth: tm === 'open' ? 'open' : 'smile'}, {flip: true})});
      badgesOnDeskRoom(b, A.masDesk[0] + BADGES_ROOM_AT[0], A.masDesk[1] + BADGES_ROOM_AT[1]);
    });
  }});
L.add('S7.07b', {kind: 'V', st: V('S7.07b', 'v5 S7.07b + art/texts yrralPlateV3: the tent card THE OTHER YRRAL; his nod on the cut (Terb said his name just before it)'),
  marks: {nod: ['f', 3]},
  draw: (fb, k, sh, f) => { const out = v5(fb, k, sh, f); yrralPlateV3(fb, f); return out; }});
/** the segment frame the chair fire goes out (S7.07's sprayEnd, on THIS lock; v5's CHAIR_FIRE_OUT reads v5's frames) */
const CHAIR_FIRE_OUT = (() => { const s7 = LOCK.shots.find((x) => x.id === 'S7.07'); return s7 ? s7.s + (s7.marks.sprayEnd ?? 130) : 0; })();
L.add('S7.07-cont', {kind: 'V', st: V('S7.07-cont', 'v5 S7.07-cont copied, the chair fire\'s smoke running on from S7.07\'s sprayEnd on this lock'),
  draw: (fb, k, sh, f) => {
    const lk = mk(sh, 'look', 60);
    drawCalmOffTerms2S(fb, f, {terb: {pose: {mouth: roomMouth(sh, k, 'TERB'), read: k < lk, blink: blink(k, 11) > 0}}, mas: {mouth: mouth(sh, k, 'MAS'), lid: blink(k, 7)}, mada: {mouth: mouth(sh, k, 'MADA')}, spin: f,
      plate: {fires: FIRES_CALMOFF(CHAIR_FIRE_OUT)}});
  }});
L.add('S7.08', {kind: 'V', st: V('S7.08', 'v5 S7.08 copied + his blink in the aftermath after "good question." (2.1 -> 3.0 s)'),
  draw: (fb, k, sh) => {
    const o = {third: 'L' as const};
    held(fb, 'v3a4:s708bg', (b) => { boardBg({laptop: false, rolodex: 'still', fires: FIRES_CALMOFF(-40), plates: [{name: 'ALYI', x: 104, fire: true}]})(b); mcuRoom(b, o); });
    drawBust(fb, mas({mouth: mouth(sh, k, 'MAS'), look: 1, head: 'front', light: 'monitor', lid: blink(k + 60, 7)}), o);
  }});

const FIRE_PLATES = {A: null, B: 'ALYI', C: null, D: 'NELEH', E: 'THE QUIET VOTE'} as const;
L.add('S7.06', {kind: 'V', st: V('S7.06', 'v5 S7.06 copied (the door, Terb, the FULL FREEZE with his card, Mas pocketing the pin, the unfreeze) with the look-around drawn, not swayed: rooms/boardroom drawBoardroom with the room rigs\' own flip, Terb turns to look behind him, then Mas, 8 f each, then back (v5 flagged v4\'s 2 px sway as its last stand-in)'),
  draw: (fb, k, sh, f) => {
    const bang = mk(sh, 'bang', 0), helmet = mk(sh, 'helmet', 3), fz = mk(sh, 'freeze', 6), un = mk(sh, 'unfreeze', 65), look = mk(sh, 'look', 121);
    if (k < fz) {
      const open = k >= bang;
      boardRoom(fb, k, {fires: FIRES_SC30, door: open ? 'open' : 'closed', doorFlash: k === bang ? 1 : 0, rolodex: 'still', plates: {...FIRE_PLATES}},
        {mada: true, terb: open ? {x: 394 - Math.floor(on2(k - bang) * 1.5), pose: {legs: terbWalkAt(k), helmet: k >= helmet, arm: 'carry'}} : null, shake: doorShake(k, bang)});
      return;
    }
    const tx = 394 - Math.floor(on2(fz - bang) * 1.5);
    if (k < un) {
      const kk = k - fz;
      held(fb, `v3a4:s706-freeze-${tx}`, (b) => { boardRoom(b, 0, {fires: FIRES_SC30, door: 'open', rolodex: 'still', plates: {...FIRE_PLATES}}, {mada: true, terb: {x: tx, pose: {legs: 'stand', helmet: true, arm: 'carry', pin: true}}}); freezePrint(b); });
      const pin = mk(sh, 'pin', 45) - fz;
      const x = Math.min(tx - 38, 150 + on2(Math.max(0, kk - 4)) * 4);
      drawMasStand(fb, x, 196, {...MAS_STAND_DEFAULT, legs: x < tx - 38 ? masWalkAt(kk) : 'stand', arm: kk < pin - 6 ? 'down' : kk < pin + 4 ? 'reach' : 'pocket', light: 'room'});
      blipCard(fb, kk, 'TERB', 'TERB', 'THE NEW CHAIR', 'EXTINGUISHERS: 1', {f, x: {helmet: true}}, 'L');
      return;
    }
    const tf = k >= look && k < look + 8, mf = k >= look + 3 && k < look + 11; // the turns: Terb looks behind him, then Mas
    const m = roomMouth(sh, k, 'TERB');
    held(fb, `v3a4:s706-after-${tx}-${tf ? 1 : 0}${mf ? 1 : 0}-${m}`, (b) => drawBoardroom(b, {f: 0, fires: FIRES_SC30, door: 'open', rolodex: 'still', plates: {...FIRE_PLATES}, reflection: null}, {
      wall: (bb) => drawTerbRoom(bb, tx, BR.WALL_FLOOR_Y + 8, {...TERB_ROOM_DEFAULT, legs: 'stand', helmet: true, arm: 'carry', pin: false, mouth: m}, {flip: tf}),
      seated: (bb) => drawMadaSeated(bb, BR.SEATS.R.x, BR.TABLE.floor, {...MADA_SEAT_DEFAULT}, {flip: true, spin: 0}),
      near: (bb) => drawMasStand(bb, tx - 38, BR.TABLE.floor + 4, {...MAS_STAND_DEFAULT, legs: 'stand', arm: 'pocket', light: 'room'}, {flip: mf}),
    }));
  }});

// ================================================================== S8 · THE LOBBY, AND AFTER
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
const KIND5: Record<string, string> = {R: 'R', C: 'C', N: 'N'};
for (const sh of LOCK.shots) {
  if (L.all[sh.id]) continue;
  const d = DRAW5[sh.id];
  if (!d) continue; // none: `check` fails on a shot with no layout
  L.add(sh.id, {kind: 'P', st: `P · v5 ${KIND5[d.kind] ?? d.kind} as it was: ${d.st}`, standin: d.standin, glyph: GLYPHY.test(d.st), draw: (fb, k, s, f) => v5(fb, k, s, f)});
}

// ================================================================== inner voice never moves his mouth
/** Mas's V.O. (kind 'vo', the stick's tag "V.O.") is never lip-synced, in any framing, whatever a face table says: the
 *  lipsync helpers draw a mouth for any faced line of the speaker, so every layout gets its shot with the V.O. lines'
 *  faces cleared (a memoized copy; shots with no faced V.O. pass through as the host's own object, so the lip-sync
 *  caches keep their line objects). On this lock no V.O. line is faced (measured: all 7 have face null); this keeps it so */
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
  options: {badge: false, vo: 'typed', voLowercase: true, subs: 'off', standin: 'stick', j1: false},
  review: {
    title: 'MR. MAS · EP1 · ACT FOUR',
    subtitle: 'PIXEL v3 · LOCK act4 (THE v3 STICK TIMING)',
    kindNames: {P: 'P · THE v5 LAYOUT, ON THE v3 LOCK', V: 'V · A v3 CHANGE (see st)'},
    sideBadge: false,
    durNote: 'AS THE v3 STICK',
    soundLabel: 'SOUND · TEMP TRACK = THE v3 STICK MIX (ACT FOUR)',
    textFix: factsText5,
  },
});
