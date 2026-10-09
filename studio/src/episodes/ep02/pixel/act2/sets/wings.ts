// MR. MAS — Ep2 v1 · act2: THE WINGS of the demo stage (sc 9, the morning of MAY 13; sc 11's cut-ins: Mas and the Orb,
// his phone, his face). The shots pass, 2026-10-09; the record is shots-act2.md. The art pass's SET-10 wings (art/sets/
// stage.ts wings: the work-light palette, road cases, cables, the monitor screen-right, Rima's hard spot) rebuilt as a
// room the camera can pan (560 px wide) with its cast in it, and the work light moved to where 8.07's lit Monday
// square sits in frame (the match cut). Mas keeps the left third: the wings are stage right, screen-left from the house.
//   wingsWide(b, f, st)        [W] the wings in work light; the cast at room scale (Mas with his glass of water and the
//                              Orb, Rima in her hard spot with the clicker, the engineer with the phone, Gerg behind his
//                              road case in the foreground); st.pan (whole pixels), the monitor's picture
//   engineerMedium(b, f, st)   [M] 9.02: the engineer rehearsing to Rima (his bust, the phone up; her soft at frame left)
//   wingsMonitor(b, f, st)     [SCR] the wings' monitor close, its bezel in frame: CHATGTP's plain bubble and its
//                              reply, the old voice mode's transcript (its [laughter] tag dropping off the foot), the
//                              VOICE panel (Rima's fingertip hovering each slot), the panel unfolding past the bezel onto
//                              the drafting grid
//   wings2S(b, f, st)          [2S] 9.04: Mas (left third) and Rima, their approved portraits, lip-synced
//   masOrb2S(b, f, st)         [2S] 11.03: Mas and the Orb in the wings during the demo; the Orb scans the big screen,
//                              its toast `verified: …` never resolves
//   masPhoneMedium / thumbECU / masFaceWork / herPOV   11.11-11.12: the phone out, h · e · r, his face, the post lands
import {Buf, rect, line, ellipse, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor, familyOf} from '../../../../../shared/pixel/palette';
import {drawChatBubble} from '../../../../../shared/pixel/cast/chatgtp';
import type {RimaStandPose} from '../../../../../shared/pixel/cast/rima-stand';
import {rimaSpeakPortrait} from '../../../../../shared/pixel/cast/rima-speak';
import type {RimaPortraitState} from '../../../../../shared/pixel/cast/rima-speak';
import {drawGergStand} from '../../../../../shared/pixel/cast/gerg-stand';
import {gergGlow} from '../../../../../shared/pixel/cast/gerg-speak';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../../shared/pixel/cast/mas';
import type {MasPortraitState} from '../../../../../shared/pixel/cast/mas';
import {drawOrb} from '../../../../../shared/pixel/cast/orb-medium';
import {putBustCut} from '../../../../../shared/pixel/cast/civic-kit';
import {drawToast} from '../../../../../shared/pixel/kits/orb-toast';
import type {Viseme} from '../../../../../shared/pixel/cast/talk';
import {bpSheet, BPX, inkBlueprint} from '../../../../../shared/pixel/kits/blueprint';
import {engineerBust, drawEngineerRoom} from '../../art/cast/engineer';
import type {EngineerRoomPose} from '../../art/cast/engineer';
import {drawMasStand2, MAS2_FOOT, MAS2_W} from '../../art/cast/mas2';
import type {Mas2Pose} from '../../art/cast/mas2';
import {voicePanel} from '../../art/sets/stage';
import {placeHand, drawHand, sleeve, holdPhone, POSES} from '../../art/cast/hands2';
import {fill, pt, pw, bpt, bpw, tiny, tinyWidth, vramp} from '../../art/kit';
import {RH, W, glow, isSkin, warm, dimRoom, bustRunOn, drawRima, smoothSkin} from './common';

// ================================================================== the room (560 x 203, the camera pans it)
export const WW = 560;
export const WINGS = {light: [61, 50] as [number, number], floor: 150, mon: {x: 326, y: 44, w: 92, h: 62}, gcase: {x: 398, y: 170, w: 108, h: 40}};
const roadCase = (b: Buf, x: number, y: number, w: number, h: number, lit = 0) => {
  fill(b, x, y, w, h, stepColor(PAL.N1, lit)); fill(b, x, y, w, 2, PAL.W2); fill(b, x, y, 3, h, PAL.G2); fill(b, x + w - 3, y, 3, h, PAL.G1); fill(b, x, y + h - 3, w, 3, PAL.G1);
  for (const [cx, cy] of [[x + 1, y + 1], [x + w - 4, y + 1], [x + 1, y + h - 4], [x + w - 4, y + h - 4]]) fill(b, cx, cy, 3, 3, PAL.G4);
  fill(b, x + (w >> 1) - 7, y + (h >> 1) - 2, 14, 4, PAL.G3); fill(b, x + (w >> 1) - 7, y + (h >> 1) - 2, 14, 1, PAL.G4);
};
let ROOM: Buf | null = null;
const room = (): Buf => {
  if (ROOM) return ROOM;
  const b = new Buf(WW, RH, PAL.N0);
  vramp(b, 0, 0, WW, RH, [PAL.N0, PAL.N1, PAL.N1, PAL.W0]);
  // black flats in a row, their seams
  for (let x = 0; x < WW; x += 44) { fill(b, x, 0, 3, WINGS.floor, PAL.N0); fill(b, x + 3, 0, 1, WINGS.floor, PAL.N2); }
  // the grid above: battens and a cable loop
  fill(b, 0, 8, WW, 2, PAL.N2); for (let x = 0; x < WW; x += 6) b.set(x, 10, PAL.N3);
  // the deck: black, a strip of glow tape along the edge of the playing area, cables snaking across it
  fill(b, 0, WINGS.floor, WW, RH - WINGS.floor, PAL.N1);
  for (let x = 0; x < WW; x++) { if (hash(x, 1, 3) < 0.4) b.set(x, WINGS.floor, PAL.W1); if (x % 9 < 5) b.set(x, WINGS.floor + 26, PAL.U2); }
  for (let k = 0; k < 4; k++) { let yy = 162 + k * 10; for (let x = 0; x < WW; x++) { yy += Math.round(Math.sin(x / (20 + k * 7) + k) * 0.6); b.set(x, clamp(yy, WINGS.floor + 2, RH - 1), PAL.N0); b.set(x, clamp(yy - 1, WINGS.floor + 1, RH - 1), k % 2 ? PAL.W1 : PAL.N2); } }
  // road cases stacked on the far side
  roadCase(b, 128, 104, 64, 46); roadCase(b, 134, 76, 50, 28); roadCase(b, 452, 108, 56, 42);
  // the work light: a caged bulb on a stand, its warm pool on the flats and the deck (where 8.07's Monday square was)
  const [lx, ly] = WINGS.light;
  fill(b, lx - 1, ly + 8, 3, WINGS.floor - ly - 8, PAL.G2); fill(b, lx - 10, WINGS.floor - 2, 22, 3, PAL.G2);
  for (let y = 30; y < RH; y++) for (let x = 0; x < 260; x++) { const d = Math.hypot((x - lx) / 190, (y - ly - 30) / 120); if (d < 1 && bayer(x, y) < (1 - d) * 0.7) b.set(x, y, stepColor(b.get(x, y), 1)); }
  for (let y = 30; y < RH; y++) for (let x = 0; x < 200; x++) { const d = Math.hypot((x - lx) / 90, (y - ly - 20) / 70); if (d < 1 && bayer(x, y) < (1 - d) * 0.6) b.set(x, y, stepColor(b.get(x, y), 1)); }
  ellipse(lx, ly, 8, 7, b.ink(PAL.W5)); ellipse(lx, ly, 6, 5, b.ink(PAL.W8)); ellipse(lx - 1, ly - 1, 3, 2, b.ink(PAL.W9));
  for (let i = -8; i <= 8; i += 4) line(lx + i, ly - 7, lx + i, ly + 7, b.ink(PAL.G2)); line(lx - 8, ly, lx + 8, ly, b.ink(PAL.G2));
  // the monitor on its stand, screen-right
  const M = WINGS.mon;
  fill(b, M.x - 4, M.y - 4, M.w + 8, M.h + 8, PAL.N0); fill(b, M.x - 4, M.y - 4, M.w + 8, 1, PAL.G2);
  fill(b, M.x + M.w / 2 - 2, M.y + M.h + 4, 4, WINGS.floor - M.y - M.h - 4, PAL.G2); fill(b, M.x + M.w / 2 - 18, WINGS.floor - 2, 36, 3, PAL.G2);
  ROOM = b;
  return b;
};

/** the monitor's picture in the wide: CHATGTP, a plain speech bubble with no face (Ep1's form), or a small panel */
export type WingScreen = 'bubble' | 'yes' | 'panel' | 'dark';
const screenSmall = (b: Buf, x: number, y: number, w: number, h: number, s: WingScreen) => {
  vramp(b, x, y, w, h, [PAL.F2, PAL.F3]);
  if (s === 'dark') { fill(b, x, y, w, h, PAL.N1); return; }
  if (s === 'panel') { fill(b, x + 10, y + 6, w - 20, h - 12, PAL.N2); for (let i = 0; i < 5; i++) fill(b, x + 14, y + 10 + i * 9, w - 28, 6, i === 4 ? PAL.C3 : PAL.N4); return; }
  drawChatBubble(b, x + Math.round(w / 2 - 17), y + Math.round(h / 2 - 15), {size: 'screen', state: 'lit'});
  if (s === 'yes') { fill(b, x + w - 30, y + 6, 26, 11, PAL.C3); tiny(b, 'YES!!', x + w - 28, y + 9, PAL.P2); }
};

/** his glass is WATER (act1 f23.ts waterGlass, copied): the art rig's tumbler carries an amber drink; in his hand's box
 *  the drink becomes a pale, cool fill with a highlight */
const waterGlass = (t: Buf, footX: number, footY: number, flip = false) => {
  const y0 = footY - MAS2_FOOT[1];
  // the hand's box in the sprite (x 24..38 from its left), mirrored with the sprite when it's flipped
  const xa = flip ? footX - (MAS2_W - 1 - MAS2_FOOT[0]) + (MAS2_W - 1 - 38) : footX - MAS2_FOOT[0] + 24, xb = xa + 14;
  let top = -1;
  for (let y = y0 + 6; y <= y0 + 32; y++) for (let x = xa; x <= xb; x++) {
    const c = t.get(x, y), fm = familyOf(c);
    if (!fm || fm[0] !== 'W') continue;
    if (top < 0) top = y;
    t.set(x, y, y === top ? PAL.P2 : PAL.G6);
  }
};
/** the work light's warmth on a room figure: its cool rim and monitor rungs walked to tungsten (common warm) */
const workMap = (c: number) => warm(c);

export interface WingsCast {
  mas?: {x: number; pose?: Partial<Mas2Pose>; walk?: number; flip?: boolean} | null;
  orb?: {x: number; y: number; look?: [number, number]} | null;
  rima?: {x: number; pose?: Partial<RimaStandPose>; flip?: boolean; clicker?: boolean} | null;
  eng?: {x: number; pose?: Partial<EngineerRoomPose>; flip?: boolean} | null;
  gerg?: {mouth?: 'rest' | 'open'; type?: 0 | 1 | 2; look?: 'screen' | 'up'} | null;
}
export interface WingsSt { pan?: number; screen?: WingScreen; spot?: number | null; cast?: WingsCast }
/** [W] the wings. The cast is drawn in depth order (the far side, Rima in her spot, the engineer, Mas and the Orb, then
 *  the road case in the foreground and Gerg behind it), into the room, then the frame is cut at st.pan */
export const wingsWide = (b: Buf, f: number, st: WingsSt = {}) => {
  const R = new Buf(WW, RH, PAL.N0);
  R.c.set(room().c);
  const M = WINGS.mon;
  screenSmall(R, M.x, M.y, M.w, M.h, st.screen ?? 'bubble');
  glow(R, M.x + M.w / 2, M.y + M.h / 2, 70, 50, 1, (x, y) => x >= M.x - 4 && x < M.x + M.w + 4 && y >= M.y - 4 && y < M.y + M.h + 4);
  const c = st.cast ?? {};
  // Rima's hard circular spot, even back here: a column of thin dithered light from the grid, a hard pool on the deck
  if (st.spot !== null && st.spot !== undefined) {
    const cx = st.spot, fy = (c.rima ? 168 : 168);
    for (let y = 10; y < fy; y++) { const t = (y - 10) / (fy - 10), hw = 3 + t * 20; for (let x = Math.round(cx - hw); x <= cx + hw; x++) if (bayer(x, y) < 0.14 + t * 0.12) R.set(x, y, stepColor(R.get(x, y), 1)); }
    for (let y = fy - 6; y <= fy + 6; y++) for (let x = cx - 30; x <= cx + 30; x++) { const d = Math.hypot((x - cx) / 30, (y - fy) / 6); if (d < 1) R.set(x, y, d > 0.86 ? PAL.G6 : bayer(x, y) < 0.5 ? PAL.G4 : PAL.G5); }
    fill(R, cx - 3, 10, 7, 4, PAL.G3); fill(R, cx - 2, 14, 5, 1, PAL.W7);
  }
  if (c.rima) {
    const p: RimaStandPose = {body: 'stand', head: 'face', mouth: 'rest', blink: false, light: 'room', ...c.rima.pose};
    drawRima(R, c.rima.x, 168, p, {flip: c.rima.flip, map: st.spot !== null && st.spot !== undefined && Math.abs(st.spot - c.rima.x) < 10 ? (q) => stepColor(q, 1) : workMap});
    // the clicker in her near hand (a small black remote, its button lit)
    if (c.rima.clicker !== false && (p.body === 'stand' || p.body.startsWith('w'))) { const hx = c.rima.x + (c.rima.flip ? -9 : 9), hy = 168 - 34; fill(R, hx - 1, hy, 3, 6, PAL.N0); R.set(hx, hy + 1, PAL.L3); }
  }
  if (c.eng) drawEngineerRoom(R, c.eng.x, 172, {arm: 'phone', mouth: 'smile', ...c.eng.pose}, {flip: c.eng.flip});
  if (c.mas) {
    const p: Mas2Pose = {arm: 'glass', mouth: 'rest', ...c.mas.pose};
    drawMasStand2(R, c.mas.x, 180, p, {f, flip: c.mas.flip});
    for (let y = 90; y < 182; y++) for (let x = c.mas.x - 24; x < c.mas.x + 26; x++) { const q = R.get(x, y); const w = workMap(q); if (w !== q) R.set(x, y, w); }
    if (p.arm === 'glass') waterGlass(R, c.mas.x, 180, !!c.mas.flip);
  }
  if (c.orb) drawOrb(R, c.orb.x, c.orb.y, 8, {look: c.orb.look ?? [0.9, 0.1], aperture: 0.5, monitor: 1});
  // the road case in the foreground and Gerg behind it, typing (his laptop on the case, its glow on his chin)
  const G = WINGS.gcase;
  if (c.gerg) {
    drawGergStand(R, G.x + 46, 214, {legs: 'stand', type: c.gerg.type ?? 0, look: c.gerg.look ?? 'screen', mouth: c.gerg.mouth ?? 'rest', light: 'room'}, {map: workMap});
  }
  roadCase(R, G.x, G.y, G.w, G.h, 1);
  const pan = Math.round(st.pan ?? 0);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, R.c[y * WW + clamp(x + pan, 0, WW - 1)]);
};

// ================================================================== 9.02: the engineer, medium
/** the wings behind a medium, soft (two rungs down) at a pan */
const wingsSoft = (b: Buf, pan: number, k = 2) => { const R = room(); for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, stepColor(R.c[y * WW + clamp(x + pan, 0, WW - 1)], -k)); };
export const engineerMedium = (b: Buf, f: number, st: {mouth: Viseme; expr?: 'smile' | 'laugh' | 'worry' | 'neutral'; rima?: Viseme}) => {
  wingsSoft(b, 40);
  // Rima at frame left, a rung soft (she is who he's rehearsing to), in her own light
  const ri = rimaSpeakPortrait({mouth: st.rima ?? 'rest', lid: 0, brow: 'level', hand: 'none'});
  const rr = bustRunOn(ri, 135);
  putBustCut(b, {...rr, c: rr.c.map((v) => (v < 0 ? v : stepColor(v, -1))) as Int32Array}, -10, 30, RH);
  // the engineer, right of centre, facing her (camera-left), the phone up; warmed by the work light
  const eb = smoothSkin(engineerBust({mouth: st.mouth, expr: st.expr ?? 'smile', arm: 'phone'}));
  putBustCut(b, eb, 206, 32, RH);
  void f;
};

// ================================================================== the monitor close (9.02's SCR, 9.03, 9.06)
const SCR = {x: 40, y: 12, w: 400, h: 176};
const bezelSCR = (b: Buf) => {
  wingsSoft(b, 120, 3);
  fill(b, SCR.x - 12, SCR.y - 10, SCR.w + 24, SCR.h + 22, PAL.N0); fill(b, SCR.x - 12, SCR.y - 10, SCR.w + 24, 1, PAL.G2); fill(b, SCR.x - 12, SCR.y - 10, 1, SCR.h + 22, PAL.G1);
  fill(b, SCR.x - 1, SCR.y - 1, SCR.w + 2, SCR.h + 2, PAL.N1);
};
const scanlines = (b: Buf, r: {x: number; y: number; w: number; h: number}) => { for (let y = r.y; y < r.y + r.h; y += 3) for (let x = r.x; x < r.x + r.w; x++) if (bayer(x, y) < 0.5) b.set(x, y, stepColor(b.get(x, y), -1)); };
/** st.mode: 'reply' (the plain bubble answers yes!! before it's asked) · 'transcript' (the old voice mode's
 *  transcript; st.drop = frames since the [laughter] tag started to fall) · 'panel' (VOICE · VOICE 1..5 · SINCE SEP
 *  2023; st.hover the slot her fingertip is on, st.said how many have said hello, st.unfold the squares past the
 *  bezel, st.grid 0..1: the floor becoming the drafting grid) */
export const wingsMonitor = (b: Buf, f: number, st: {mode: 'reply' | 'transcript' | 'panel'; yes?: boolean; drop?: number; hover?: number; said?: number; unfold?: number; grid?: number; tap?: boolean; tapAt?: number}) => {
  bezelSCR(b);
  const S = SCR;
  vramp(b, S.x, S.y, S.w, S.h, [PAL.F2, PAL.F3, PAL.F3]);
  if (st.mode === 'reply') {
    drawChatBubble(b, S.x + 60, S.y + 40, {size: 'ecu', state: st.yes ? 'talk' : 'lit', f});
    if (st.yes) {
      // its answer, before he's asked: a bright reply bubble with a chirp's spark
      const rx = S.x + 238, ry = S.y + 46;
      fill(b, rx - 1, ry - 1, 112, 50, PAL.N0); fill(b, rx, ry, 110, 48, PAL.C3); fill(b, rx, ry, 110, 2, PAL.C6);
      for (let i = 0; i < 9; i++) for (let j = 0; j <= i; j++) b.set(rx - i, ry + 32 + j, PAL.C3);
      bpt(b, 'yes!!', rx + 55 - Math.round(bpw('yes!!') / 2), ry + 17, PAL.P2);
    }
  } else if (st.mode === 'transcript') {
    // the old voice mode: VOICE MODE (legacy) at the top, his words transcribed, the reply; the laugh never lands: the
    // tag [laughter] falls off the foot of the screen
    fill(b, S.x, S.y, S.w, 14, PAL.N2); pt(b, 'VOICE MODE · TRANSCRIPT', S.x + 8, S.y + 4, PAL.N7);
    const rows: Array<[string, number]> = [['you: so on stage, i ask it a question,', PAL.P1], ['it thinks for a second, and then it answers.', PAL.P1], ['chatgtp: yes!!', PAL.C7]];
    rows.forEach(([t, c], i) => pt(b, t, S.x + 12, S.y + 26 + i * 12, c));
    const d = st.drop ?? -1;
    if (d >= 0) {
      const ty = S.y + 70 + Math.round(d * d * 0.5), tag = '[laughter]';
      if (ty < S.y + S.h - 4) { fill(b, S.x + 10, ty - 2, pw(tag) + 8, 11, PAL.N2); pt(b, tag, S.x + 14, ty, PAL.N8); }
    }
  } else {
    const n = st.unfold ?? 0, g = st.grid ?? 0;
    // the floor below the monitor (seen through and past the bezel's foot as the panel spills down onto it)
    const px = S.x + 115, py = S.y + 22;
    voicePanel(b, px, py, {hover: st.hover, said: st.said, unfold: 0});
    // the fifth's Hey. holds a beat longer: its square lit after the others have gone quiet
    if ((st.said ?? -1) >= 4) { fill(b, px + 6, py + 18 + 4 * 20, 2, 16, PAL.C8); }
    // unfolding past the bezel: the panel's squares drop, row by row, past the monitor's foot onto the floor
    if (n > 0) {
      for (let q = 0; q < n; q++) {
        const col = q % 5, row = Math.floor(q / 5), sx = px + col * 34, sy = S.y + S.h + 2 + row * 34 - (q === n - 1 ? 8 : 0);
        fill(b, sx, sy, 32, 32, PAL.N2); for (let t = 0; t < 32; t += 8) { fill(b, sx + t, sy, 1, 32, PAL.C3); fill(b, sx, sy + t, 32, 1, PAL.C3); }
        fill(b, sx, sy, 32, 1, PAL.C6);
      }
    }
    if (g > 0) gridTakeover(b, g);
  }
  scanlines(b, S);
  if (st.tap && st.mode === 'panel' && (st.grid ?? 0) === 0) {
    // her fingertip on the slot (no cursor): her grey jacket's cuff from the lower right
    const sy = S.y + 22 + 18 + (st.hover ?? 0) * 20 + 8;
    rimaFinger(b, [S.x + 115 + 60, sy]);
  }
  // her fingertip coming in to tap the screen (9.06's first frames: the tap that opens the panel)
  if (st.tapAt) rimaFinger(b, [S.x + 250, S.y + 120 + (st.tapAt === 2 ? 2 : 0)]);
};
/** Rima's fingertip on the glass: her skin, her structured grey jacket's sleeve, from the lower right */
const RIMA_CUFF = [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G4, PAL.P1];
const rimaFinger = (b: Buf, tip: [number, number]) => {
  const h = placeHand(POSES.point([-0.62, -0.7, -0.36], [0.2, -0.5, 0.84]), {s: 4.4, at: tip, anchor: 'index', light: 'lobby', cuffRamp: RIMA_CUFF, key: [0.2, -0.75, 0.6]});
  const cx = h.cuffEnd[0], cy = h.cuffEnd[1], dx = cx - h.wrist[0], dy = cy - h.wrist[1], L = Math.hypot(dx, dy) || 1;
  sleeve(b, [cx, cy], [cx + (dx / L) * 260, cy + (dy / L) * 260], 15, 18, [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G4]);
  drawHand(b, h.hand, h.x, h.y);
};
/** the drafting grid taking the floor and then the frame (g 0..1): the panel's last square becomes the grid's first
 *  cell (THE PLAN's sheet, 10.01's first frame: planGridCell) */
export const GRID_CELL = {x: 240 - 16, y: 96 - 16, s: 32};
const gridTakeover = (b: Buf, g: number) => {
  const sheet = new Buf(480, 270, BPX.navy);
  bpSheet(sheet, {zones: false});
  const ink = sheet.clone(); inkBlueprint(ink);
  const reach = Math.round(g * 260);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) { const d = Math.max(Math.abs(x - 240) * 0.55, RH - y); if (d < reach) b.set(x, y, ink.get(x, y)); }
  if (g >= 1) gridCell(b);
};
/** the one cell, outlined hot: shared with 10.01's arrival */
export const gridCell = (b: Buf) => { const C = GRID_CELL; const t = new Buf(480, 270, BPX.navy); for (let i = 0; i < C.s; i++) for (const [x, y] of [[C.x + i, C.y], [C.x + i, C.y + C.s - 1], [C.x, C.y + i], [C.x + C.s - 1, C.y + i]]) t.set(x, y, BPX.hot); const ink = t.clone(); inkBlueprint(ink); for (let i = 0; i < C.s; i++) for (const [x, y] of [[C.x + i, C.y], [C.x + i, C.y + C.s - 1], [C.x, C.y + i], [C.x + C.s - 1, C.y + i]]) b.set(x, y, ink.get(x, y)); };

// ================================================================== 9.03: Gerg at his road case, the engineer beyond
/** [M] Gerg close in the foreground (Ep1's speaking portrait under his laptop's green glow, gerg-speak gergGlow), at
 *  his road case (its lid edge and the laptop's back across the frame's foot); beyond him, small and soft, the
 *  engineer with the phone laughing nervously (st.laugh) by Rima in her spot */
export const gergFore = (b: Buf, f: number, st: {mouth: Viseme; look?: -1 | 0 | 1; laugh: boolean}) => {
  const R = new Buf(WW, RH, PAL.N0); R.c.set(room().c);
  // the far side: the engineer laughing (his room sprite), Rima in her spot, soft (a rung down)
  for (let y = 10; y < 168; y++) { const t = (y - 10) / 158, hw = 3 + t * 20; for (let x = Math.round(170 - hw); x <= 170 + hw; x++) if (bayer(x, y) < 0.14 + t * 0.12) R.set(x, y, stepColor(R.get(x, y), 1)); }
  drawRima(R, 170, 168, {body: 'stand', head: 'face', mouth: 'rest', blink: false, light: 'room'}, {map: workMap});
  drawEngineerRoom(R, 128, 172, {arm: 'phone', mouth: st.laugh ? (Math.floor(f / 5) % 2 ? 'laugh' : 'smile') : 'rest'});
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, stepColor(R.c[y * WW + clamp(x + 20, 0, WW - 1)], -1));
  // Gerg, right half, three-quarter toward camera-left, the laptop's green under his chin
  putBustCut(b, gergGlow({mouth: st.mouth, lid: 1, look: st.look ?? 0}), 300, 40, RH);
  // the road case's lid across the foot, the laptop's back on it, his typing hand on the keys (behind the lid)
  fill(b, 250, 176, 230, 27, PAL.N1); fill(b, 250, 176, 230, 2, PAL.W2); fill(b, 250, 176, 3, 27, PAL.G2);
  for (const cx of [252, 476]) fill(b, cx, 177, 3, 3, PAL.G4);
  fill(b, 318, 150, 78, 28, PAL.G1); fill(b, 318, 150, 78, 1, PAL.G3); fill(b, 352, 160, 10, 8, PAL.G2);
  glow(b, 356, 150, 70, 40, 1, (x, y) => y >= 150);
  void f;
};

// ================================================================== 9.04: the two-shot
export const wings2S = (b: Buf, f: number, st: {mas: Viseme; rima: Viseme; rimaBrow?: RimaPortraitState['brow']}) => {
  wingsSoft(b, 10, 2);
  // Mas, left third, facing her (his portrait flipped: camera-right), the work light's warmth
  putBustCut(b, masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'warm', mouth: (st.mas === 'smile' ? 'rest' : st.mas) as MasPortraitState['mouth'], look: 0}), 72, 30, RH, true);
  // Rima, right, composed (her approved portrait in its own key)
  putBustCut(b, bustRunOn(rimaSpeakPortrait({mouth: st.rima, lid: 0, brow: st.rimaBrow ?? 'level', hand: 'none'}), 135), 268, 28, RH);
  void f;
};

// ================================================================== 11.03: Mas and the Orb, the toast
/** the wings during the demo: the work light off, the stage's light spilling in from screen-right */
const wingsShow = (b: Buf, pan: number) => { const R = room(); for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) { let c = stepColor(R.c[y * WW + clamp(x + pan, 0, WW - 1)], -2); if (x > 360 && bayer(x, y) < (x - 360) / 240) c = stepColor(c, 1); b.set(x, y, c); } };
export const masOrb2S = (b: Buf, f: number, st: {scan?: number; toast?: number; dots?: number; gone?: boolean}) => {
  wingsShow(b, 0);
  // Mas, left third, his portrait turned to the stage (camera-right), lit from it
  const im = masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'warm', look: 0});
  putBustCut(b, im, 80, 34, RH, true);
  // the stage's light along his near edge (screen-right)
  for (let y = 34; y < RH; y++) for (let x = 120; x < 200; x++) { const c = b.get(x, y); if (isSkin(c) && !isSkin(b.get(x + 2, y)) && x > 150) b.set(x, y, stepColor(c, 1)); }
  // the Orb beside him at his shoulder's height, its face turned to the big screen (screen-right); the scan's sweep
  const ox = 300, oy = 82;
  drawOrb(b, ox, oy, 26, {look: [0.95, -0.05], aperture: st.scan ? 0.8 : 0.5, scanning: !!st.scan, monitor: 1});
  if (st.scan) { for (let i = 0; i < 160; i++) { const x = ox + 26 + i, y0 = oy - Math.round(i * 0.18), y1 = oy + Math.round(i * 0.18); if (i % 3 === (st.scan & 1)) { b.set(x, y0, PAL.C5); b.set(x, y1, PAL.C5); } } }
  // its toast: verified: … the dots never resolve into a word; it gives up (the toast drops away)
  if (st.toast !== undefined && st.toast >= 0 && !st.gone) {
    const n = st.dots ?? 3;
    drawToast(b, ox - 30, oy - 54, 'verified: ' + '.'.repeat(n), st.toast, {f});
  }
};

// ================================================================== 11.11-11.12: his phone, h · e · r, his face, the post
/** [M] his face and the phone coming up into his hands below it (the phone's back to us), the stage's light */
export const masPhoneMedium = (b: Buf, f: number, st: {rise: number}) => {
  wingsShow(b, 20);
  putBustCut(b, masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'warm', look: 0, lid: st.rise > 0.6 ? 1 : 0}), 84, 30, RH, true);
  // the phone rising into frame in his hand at chest height (its back to us, his fingers round it)
  const y = Math.round(RH + 6 - st.rise * 60);
  const r = {x: 212, y, w: 36, h: 68};
  holdPhone(b, r, {side: 'R', grip: 'wrap', light: 'lobby', cuffRamp: [PAL.N0, PAL.G0, PAL.G0, PAL.G1, PAL.G2, PAL.G2, PAL.W4], sleeveRamp: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.W4], sleeveTo: [330, 330], widthCm: 7.2, thumbAt: 0.5,
    drawPhone: (bb) => { fill(bb, r.x - 1, r.y - 1, r.w + 2, r.h + 2, PAL.N0); fill(bb, r.x, r.y, r.w, r.h, PAL.G1); fill(bb, r.x, r.y, r.w, 1, PAL.G3); ellipse(r.x + 8, r.y + 8, 4, 4, bb.ink(PAL.N0)); }});
  void f;
};
/** [ECU] the phone in his hands, the composer: his thumb types h · e · r (st.n letters), off the beat. The phone is
 *  held from below (the 'cup' grip: the fingers behind it, the thumb on the glass); the thumb is put on the key it
 *  presses (the grip's thumb position searched for the nearest reach) */
export const PHONE_T = {x: 182, y: -70, w: 120, h: 240};
const KEYS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
const KB = {y: 170, kw: 11, kh: 20, gap: 1};
const keyAt = (ch: string): [number, number] => { for (let r = 0; r < 3; r++) { const q = KEYS[r].indexOf(ch); if (q >= 0) return [2 + q * (KB.kw + 1) + r * 6 + 5, KB.y + 2 + r * (KB.kh + 3) + 10]; } return [60, KB.y + 30]; };
const WORK_CUFF = [PAL.N0, PAL.G0, PAL.G0, PAL.G1, PAL.G2, PAL.G2, PAL.W4], WORK_SLEEVE = [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.W4];
/** the thumbAt (0..1) whose thumb tip lands nearest a frame point, for a phone rect (memoised per rect and target) */
const TA = new Map<string, number>();
const thumbFor = (P: {x: number; y: number; w: number; h: number}, at: [number, number], cuff: number[], sl: number[]) => {
  const key = `${P.x},${P.y},${P.w},${P.h}:${at[0]},${at[1]}`;
  const hit = TA.get(key); if (hit !== undefined) return hit;
  let best = 0.5, bd = 1e9;
  for (let i = 0; i <= 10; i++) {
    const ta = i / 10, t = new Buf(480, 270, 0);
    const h = holdPhone(t, P, {side: 'R', grip: 'cup', light: 'lobby', cuffRamp: cuff, sleeveRamp: sl, widthCm: 7.2, thumbAt: ta, drawPhone: () => {}});
    const d = Math.hypot(h.thumb[0] - at[0], h.thumb[1] - at[1]);
    if (d < bd) { bd = d; best = ta; }
  }
  TA.set(key, best);
  return best;
};
export const thumbECU = (b: Buf, f: number, st: {n: number; key?: number}) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, bayer(x, y) < 0.2 ? PAL.N1 : PAL.N0);
  const P = PHONE_T;
  const scr = new Buf(P.w, P.h, PAL.N1);
  fill(scr, 0, 60, P.w, 18, PAL.N2); pt(scr, 'new post', Math.round(P.w / 2 - pw('new post') / 2), 66, PAL.P1);
  fill(scr, 4, 84, P.w - 8, 62, PAL.N2);
  const word = 'her'.slice(0, st.n);
  bpt(scr, word, 10, 96, PAL.P2);
  if (Math.floor(f / 8) % 2 === 0 || st.n < 3) fill(scr, 10 + bpw(word) + 2, 94, 2, 16, PAL.C6);
  fill(scr, P.w - 44, 150, 40, 14, st.n >= 3 ? PAL.C3 : PAL.N3); pt(scr, 'Post', P.w - 36, 154, PAL.P2);
  fill(scr, 0, KB.y - 2, P.w, P.h - KB.y + 2, PAL.N2);
  KEYS.forEach((row, r) => { for (let q = 0; q < row.length; q++) { const kx = 2 + q * (KB.kw + 1) + r * 6, ky = KB.y + 2 + r * (KB.kh + 3), on = st.key !== undefined && row[q] === 'her'[st.key]; fill(scr, kx, ky, KB.kw, KB.kh, on ? PAL.N7 : PAL.N4); fill(scr, kx, ky + KB.kh - 1, KB.kw, 1, PAL.N1); tiny(scr, row[q].toUpperCase(), kx + 4, ky + 7, on ? PAL.P2 : PAL.N8); } });
  // his thumb on the key it last pressed (h, e, r), else resting by the keyboard
  const ki = st.key !== undefined ? st.key : st.n > 0 ? st.n - 1 : -1;
  const kp = ki >= 0 ? keyAt('her'[ki]) : [P.w * 0.7, KB.y + 40] as [number, number];
  const target: [number, number] = [P.x + kp[0], P.y + kp[1]];
  const ta = thumbFor(P, target, WORK_CUFF, WORK_SLEEVE);
  holdPhone(b, P, {side: 'R', grip: 'cup', light: 'lobby', cuffRamp: WORK_CUFF, sleeveRamp: WORK_SLEEVE, sleeveTo: [420, 330], widthCm: 7.2, thumbAt: ta,
    drawPhone: (bb) => { fill(bb, P.x - 6, P.y - 6, P.w + 12, P.h + 12, PAL.N0); fill(bb, P.x - 5, P.y - 5, P.w + 10, P.h + 10, PAL.G1); for (let y = 0; y < P.h; y++) for (let x = 0; x < P.w; x++) bb.set(P.x + x, P.y + y, scr.get(x, y)); }});
  glow(b, P.x + P.w / 2, 90, 200, 130, 1, (x, y) => x >= P.x - 6 && x < P.x + P.w + 6 && y < P.y + P.h);
};
/** [MCU] his face in the work light, still (the phone's cool light from below on his chin) */
export const masFaceWork = (b: Buf, f: number) => {
  wingsShow(b, 30);
  const im = masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'warm', look: 0, lid: 1});
  putBustCut(b, im, 150, 26, RH, true);
  for (let y = 70; y < 130; y++) for (let x = 160; x < 260; x++) { const c = b.get(x, y); if (isSkin(c) && y > 96 && bayer(x, y) < 0.5) b.set(x, y, stepColor(c, 1)); }
  void f;
};
/** [POV] his phone: the post, sent: his name, `her`, MAY 13 (Ep2's posts kit: his own lowercase) */
export const herPOV = (b: Buf, f: number, st: {k: number}) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, bayer(x, y) < 0.2 ? PAL.N1 : PAL.N0);
  const P = {x: 120, y: -20, w: 240, h: 260};
  fill(b, P.x - 8, P.y - 8, P.w + 16, P.h + 16, PAL.G1); fill(b, P.x - 1, P.y - 1, P.w + 2, P.h + 2, PAL.N0); fill(b, P.x, P.y, P.w, P.h, PAL.N1);
  fill(b, P.x, P.y + 20, P.w, 30, PAL.N2); pt(b, 'post', P.x + Math.round(P.w / 2 - pw('post') / 2), P.y + 32, PAL.P1);
  // the card opens in its three held steps
  const open = st.k < 0 ? 0 : st.k >= 3 ? 1 : [0.2, 0.5, 0.8][st.k];
  const cy = P.y + 62, ch = 92, hh = Math.max(3, Math.round(ch * open)), yy = cy + Math.round((ch - hh) / 2);
  if (st.k >= 0) {
    fill(b, P.x + 10, yy, P.w - 20, hh, PAL.N2); fill(b, P.x + 10, yy, P.w - 20, 1, PAL.N4);
    if (open >= 1) {
      ellipse(P.x + 30, cy + 20, 10, 10, b.ink(PAL.C3)); bpt(b, 'M', P.x + 25, cy + 13, PAL.P2);
      pt(b, 'Mas Manalt', P.x + 48, cy + 12, PAL.P2); pt(b, 'MAY 13', P.x + P.w - 20 - pw('MAY 13'), cy + 12, PAL.N6);
      bpt(b, 'her', P.x + 48, cy + 36, PAL.P2);
      fill(b, P.x + 48, cy + 70, P.w - 70, 1, PAL.N4);
    }
  }
  glow(b, 240, 100, 300, 160, 1, (x, y) => x >= P.x - 8 && x < P.x + P.w + 8);
  void f; void rect; void tinyWidth; void dimRoom; void line;
};
