// MR. MAS — Ep2 v1 · act2: THE DEMO STAGE from the house (sc 11, MAY 13; sc 12.01-12.03). The shots pass, 2026-10-09;
// the record is shots-act2.md. The art pass's SET-10 (art/sets/stage.ts: the big screen with CHATGTP's Ep2 face, the
// VOICE 5 badge, LIVE -> ENDED, the chat strip; the spot's meter; the front row; the chrome armrest) recomposed so the
// cast stands in it at room scale: the locked wide is the spotlight's METER FRAME (every step of the light measured
// here): the wings at frame left (stage right, where Mas stands), the engineer's mark downstage right (screen-left, by
// the wings), Rima centre in her spot, the big screen centre-right, the house in the foreground (the backs of heads; the
// roped front row is below this frame).
//   stageWide(b, f, st)    [W] the meter frame: st.spot 0..3 (on Rima -> more on the screen than on her), the screen,
//                          the house (full / emptying / empty), the house lights 0..2, the raised phones (down / up /
//                          swung to the blimp), the heads near the wings turning, the blimp, Rima and the engineer
//   screenBuf(f, st)       the big screen's own picture (256 x 98): the face, the chat, LIVE/ENDED, the badge
//   screenSCR(b, f, st)    [SCR] the big screen close: its own pixels doubled (an LED wall seen from nearer)
//   rimaMCU(b, f, st)      [MCU] Rima on her mark (Ep1's approved portrait): in the spot · half in the light · in the
//                          half-dark · in the house lights; a breath; walking off with the clicker
//   glassesECU(b, f, st)   [ECU] mid-house, one pair of glasses fogging (a stranger in the house, never the front row)
//   eng2S(b, f, st)        [2S] 11.15: the engineer (headset off, his phone) beside Rima at her mark; she doesn't look up
import {Buf, rect, line, ellipse, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {rimaSpeakPortrait} from '../../../../../shared/pixel/cast/rima-speak';
import type {RimaPortraitState} from '../../../../../shared/pixel/cast/rima-speak';
import {putBustCut} from '../../../../../shared/pixel/cast/civic-kit';
import type {Viseme} from '../../../../../shared/pixel/cast/talk';
import type {RimaStandPose} from '../../../../../shared/pixel/cast/rima-stand';
import {drawChatFace, voice5Badge} from '../../art/sets/stage';
import type {ChatFaceSt} from '../../art/sets/stage';
import {engineerBust, drawEngineerRoom} from '../../art/cast/engineer';
import type {EngineerRoomPose} from '../../art/cast/engineer';
import {drawBlimp} from '../../art/creatures';
import {fill, pt, pw, tiny, tinyWidth, vramp} from '../../art/kit';
import {RH, W, TR, glow, isSkin, bustRunOn, drawRima, smoothSkin} from './common';

// ================================================================== geometry
export const STG = {
  wing: 30,                                  // the masking leg at frame left (stage right: the wings, Mas's side)
  deck: 150, lip: 178,                       // the stage floor's upstage line and its front edge
  scr: {x: 212, y: 16, w: 256, h: 98},       // the big screen
  chatW: 70,
  rima: [168, 166] as [number, number],      // her mark (foot)
  eng: [66, 178] as [number, number],        // his mark, downstage right (screen-left, by the wings)
  spot: [168, 206, 246, 292],                // the spot's x on its four steps (the last more on the screen than on her)
  house: 182,                                // the first row of heads in the frame
};

// ================================================================== the big screen's picture
export interface ScreenSt extends ChatFaceSt { live?: 'live' | 'ended' | 'dark'; chat?: number | null; chatHi?: boolean; badge?: boolean; lit?: number }
/** the stream's chat: the house's messages before the catch (never the word her: nobody has said it yet; never
 *  free: the joke is the product's), `what's the catch?` exactly at CATCH (11.08 scrolls it in and it sticks), then the
 *  messages after it */
const CHAT_PRE = ['wow', 'lol', 'so fast', 'it laughed', 'omg', 'again!', 'hi!!', 'cute', 'is it live?', 'too fast'];
const CHAT_POST = ['lol', 'omg', 'free!!', 'wait', 'again!'];
export const CATCH = 40;
const chatMsg = (i: number) => (i === CATCH ? "what's the catch?" : i < CATCH ? CHAT_PRE[((i % CHAT_PRE.length) + CHAT_PRE.length) % CHAT_PRE.length] : CHAT_POST[(i - CATCH - 1) % CHAT_POST.length]);
/** the stream's chat in its own strip at the screen's right: messages wrapped, the newest (index `scroll`) at the foot;
 *  `what's the catch?` lit in a box when it sticks */
const chatStrip = (s: Buf, x: number, y: number, w: number, h: number, scroll: number, hi: boolean) => {
  fill(s, x, y, w, h, PAL.N0); fill(s, x, y, 1, h, PAL.N3); fill(s, x, y, w, 9, PAL.N2); tiny(s, 'CHAT', x + 4, y + 2, PAL.N7);
  const lines: Array<{t: string; hi: boolean; first: boolean}> = [];
  const upto = Math.floor(scroll);
  for (let k = upto - 7; k <= upto; k++) {
    const m = chatMsg(k), isHi = hi && m === "what's the catch?";
    const words = m.toUpperCase().split(' ');
    let cur = ''; const out: string[] = [];
    for (const wd of words) { const t = cur ? cur + ' ' + wd : wd; if (tinyWidth(t) > w - 10 && cur) { out.push(cur); cur = wd; } else cur = t; }
    if (cur) out.push(cur);
    out.forEach((t, i) => lines.push({t, hi: isHi, first: i === 0}));
  }
  const rows = Math.floor((h - 12) / 8), shown = lines.slice(Math.max(0, lines.length - rows));
  shown.forEach((l, i) => { const ly = y + 12 + i * 8; if (l.hi) fill(s, x + 2, ly - 1, w - 4, 8, PAL.W7); tiny(s, l.t, x + 5, ly, l.hi ? PAL.N0 : l.first ? PAL.N8 : PAL.N7); });
};
export const screenBuf = (f: number, st: ScreenSt): Buf => {
  const S = STG.scr, s = new Buf(S.w, S.h, PAL.N0);
  if (st.live === 'dark') { vramp(s, 0, 0, S.w, S.h, [PAL.N1, PAL.N1, PAL.N2]); return s; }
  const fw = S.w - STG.chatW;
  vramp(s, 0, 0, fw, S.h, [PAL.F2, PAL.F3, PAL.F3]);
  const face = new Buf(S.w, S.h + 20, PAL.N0);
  for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) face.set(x, y + 10, s.get(x, y));
  drawChatFace(face, Math.round((fw - 150) / 2), 10 + 9, {f, ...st});
  for (let y = 0; y < S.h; y++) for (let x = 0; x < fw; x++) s.set(x, y, face.get(x, y + 10));
  if (st.chat !== null && st.chat !== undefined) chatStrip(s, fw, 0, STG.chatW, S.h - 14, st.chat, !!st.chatHi);
  else { fill(s, fw, 0, STG.chatW, S.h - 14, PAL.N0); fill(s, fw, 0, 1, S.h - 14, PAL.N3); }
  fill(s, fw, S.h - 14, STG.chatW, 14, PAL.N1);
  const live = st.live ?? 'live', tag = live === 'live' ? 'LIVE' : 'ENDED';
  fill(s, 20, S.h - 14, pw(tag) + 6, 11, live === 'live' ? PAL.R2 : PAL.G3); pt(s, tag, 23, S.h - 12, PAL.P2);
  if (st.badge !== false && (st.grow ?? 3) >= 3) voice5Badge(s, S.w - 47, S.h - 12);
  if (live === 'ended') for (let y = 0; y < S.h - 14; y++) for (let x = 0; x < fw; x++) s.set(x, y, stepColor(s.get(x, y), -1));
  if (st.lit) for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) s.set(x, y, stepColor(s.get(x, y), st.lit));
  return s;
};

// ================================================================== the house
const TOPS = [[PAL.N1, PAL.N2, PAL.N3], [PAL.R0, PAL.R1, PAL.R2], [PAL.L0, PAL.L1, PAL.L2], [PAL.G1, PAL.G2, PAL.G3], [PAL.U1, PAL.U2, PAL.U3], [PAL.F1, PAL.F2, PAL.F3], [PAL.D1, PAL.D2, PAL.D3]];
const HAIRS = [[PAL.N0, PAL.B0], [PAL.B0, PAL.B1], [PAL.B1, PAL.B2], [PAL.G2, PAL.G3], [PAL.N0, PAL.N1], [PAL.D1, PAL.D2]];
export interface HouseSt { rows: number; lights: 0 | 1 | 2; phones: 'down' | 'up' | 'swung'; turn?: number; press?: boolean; f: number; gone?: number }
/** the backs of the house (heads and shoulders), the press row's laptop screens, the raised phones; `turn`: the heads
 *  within that many pixels of the wings turned to look at them (a cheek and an ear to the left) */
const house = (b: Buf, st: HouseSt) => {
  const y0 = STG.house, gap = 15;
  for (let r = st.rows - 1; r >= 0; r--) {
    const yy = y0 + r * 8, off = r % 2 ? 7 : 0;
    for (let x = -off, k = 0; x < W; x += gap, k++) {
      const id = r * 97 + k * 13 + 4;
      if (st.gone && hash(id, 3, 9) < st.gone) continue; // the house emptying: seats left behind
      const top = TOPS[id % TOPS.length], hair = HAIRS[(id * 7) % HAIRS.length];
      const bob = (Math.floor(st.f / 8) + id) % 5 === 0 ? -1 : 0;
      const k2 = st.lights === 2 ? 1 : st.lights === 1 ? 0 : -1;
      const dim = (c: number) => stepColor(c, k2 - (st.rows - 1 - r));
      for (let j = 0; j < 10; j++) for (let i = 0; i < 16; i++) { const d = Math.hypot((i - 8) / 8.5, (j - 9) / 8); if (d < 1) b.set(x + i - 2, yy + 6 + j + bob, dim(i < 4 ? top[0] : i > 12 ? top[2] : top[1])); }
      const turned = st.turn !== undefined && x < st.turn && hash(id, 5, 2) < 0.8;
      for (let j = 0; j < 10; j++) for (let i = 0; i < 9; i++) {
        const d = Math.hypot((i - 4) / 4.5, (j - 4.5) / 5); if (d >= 1) continue;
        let c = j < 3 ? hair[1] : hair[0];
        // turned to the wings (screen-left): the cheek, the ear and the nose's edge come round on the left
        if (turned && i < 4 && j > 2) c = j > 7 ? PAL.S2 : i < 2 ? PAL.S3 : j === 5 && i === 2 ? PAL.S1 : PAL.S2;
        b.set(x + i + 1, yy + j - 2 + bob, dim(c));
      }
      // the press row (the first row's every third seat): a laptop's lit screen in front of the head
      if (st.press && r === st.rows - 1 && id % 3 === 0) { const sx = x - 1, sy = yy + 2 + bob; fill(b, sx, sy, 12, 7, PAL.N0); fill(b, sx + 1, sy + 1, 10, 5, st.phones === 'swung' ? PAL.C5 : PAL.C3); }
      // raised phones: up (held over the heads, screens to the stage) or swung (toward the blimp, up and left)
      if (st.phones !== 'down' && [0, 2, 4, 5].includes(id % 7)) {
        const sw = st.phones === 'swung';
        const px = x + (sw ? 2 : 9), py = yy - 10 + bob - (sw ? 2 : 0);
        fill(b, px, py, 4, 6, PAL.N0); fill(b, px + 1, py + 1, 2, 4, PAL.C6);
        if (sw) { b.set(px - 1, py + 1, PAL.N0); b.set(px + 4, py + 4, PAL.N0); }
        fill(b, px + 1, py + 6, 2, 4, dim(PAL.S3));
      }
    }
  }
};

// ================================================================== the meter frame
export interface StageSt {
  spot?: 0 | 1 | 2 | 3 | null; screen?: ScreenSt; lights?: 0 | 1 | 2; rig?: number;
  house?: Partial<HouseSt> | null;
  rima?: {pose?: Partial<RimaStandPose>; x?: number; light?: 'spot' | 'half' | 'dark' | 'house'; clicker?: boolean} | null;
  eng?: {pose?: Partial<EngineerRoomPose>; flip?: boolean; x?: number} | null;
  blimp?: {size: 1 | 2 | 3 | 4; x: number; y: number} | null;
}
export const stageWide = (b: Buf, f: number, st: StageSt = {}) => {
  const L = st.lights ?? 0, rig = st.rig ?? 1;
  // the back of the stage: the black surround, the cyc's faint glow behind the screen, the masking leg at frame left
  vramp(b, 0, 0, W, STG.deck, L >= 2 ? [PAL.N2, PAL.N3, PAL.N3] : L ? [PAL.N1, PAL.N2, PAL.N2] : [PAL.N0, PAL.N1, PAL.N1]);
  if (rig) for (let y = 14; y < STG.deck; y++) for (let x = 40; x < W; x++) { const d = Math.hypot((x - 300) / 260, (y - 80) / 90); if (d < 1 && bayer(x, y) < (1 - d) * 0.35 * rig) b.set(x, y, stepColor(b.get(x, y), 1)); }
  // the deck: boards in perspective (grey-blue), its front lip
  for (let y = STG.deck; y < STG.lip; y++) for (let x = 0; x < W; x++) { const t = (y - STG.deck) / (STG.lip - STG.deck); const c = (x + Math.round((x - 240) * t * 0.4)) % 24 === 0 ? PAL.N2 : t < 0.3 ? PAL.N3 : PAL.N4; b.set(x, y, L >= 2 ? stepColor(c, 1) : c); }
  fill(b, 0, STG.deck, W, 1, PAL.N5); fill(b, 0, STG.lip, W, 4, PAL.N0); fill(b, 0, STG.lip, W, 1, PAL.N3);
  // the rig across the top: the truss and its cans (lit while the show is on: their beams down onto the deck)
  fill(b, 40, 4, W - 40, 3, PAL.G2); for (let x = 42; x < W; x += 6) line(x, 4, x + 3, 7, b.ink(PAL.G3));
  for (let x = 70; x < W; x += 40) {
    fill(b, x, 7, 7, 7, PAL.N0); fill(b, x + 1, 13, 5, 1, rig ? PAL.W8 : PAL.W2);
    if (rig >= 1) { b.set(x + 3, 14, PAL.W9); for (let y = 15; y < STG.deck; y++) { const hw = (y - 14) * 0.16; for (let i = -hw; i <= hw; i++) if (bayer(Math.round(x + 3 + i), y) < 0.07 * rig) b.set(Math.round(x + 3 + i), y, stepColor(b.get(Math.round(x + 3 + i), y), 1)); } }
  }
  // the big screen
  const S = STG.scr;
  fill(b, S.x - 4, S.y - 4, S.w + 8, S.h + 8, PAL.N0); fill(b, S.x - 4, S.y - 4, S.w + 8, 1, PAL.G1);
  const scr = screenBuf(f, st.screen ?? {});
  for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) b.set(S.x + x, S.y + y, scr.get(x, y));
  if ((st.screen?.live ?? 'live') !== 'dark') glow(b, S.x + S.w / 2, S.y + S.h + 10, 200, 40, 1, (x, y) => y < S.y + S.h + 4);
  // the masking leg at frame left: the wings' edge (stage right), black
  fill(b, 0, 0, STG.wing, STG.lip, PAL.N0); fill(b, STG.wing, 0, 2, STG.lip, PAL.N1);
  // the spot: a cone from the rig and a hard pool on the deck, a step per laugh toward the screen
  const sp = st.spot;
  if (sp !== null && sp !== undefined) {
    const sx = STG.spot[sp], fy = STG.rima[1];
    for (let y = 14; y < fy - 5; y++) { const t = (y - 14) / (fy - 14), hw = 3 + t * 21; for (let x = Math.round(sx - hw); x <= sx + hw; x++) if (bayer(x, y) < 0.18 + t * 0.1) b.set(x, y, stepColor(b.get(x, y), 1)); }
    for (let y = fy - 6; y <= fy + 6; y++) for (let x = sx - 26; x <= sx + 26; x++) { const d = Math.hypot((x - sx) / 26, (y - fy) / 6); if (d < 1) b.set(x, y, d > 0.86 ? PAL.G6 : bayer(x, y) < 0.5 ? PAL.G4 : PAL.G5); }
    // on its last steps the cone's light lands on the screen's face too (more on the screen than on her)
    if (sx + 24 > S.x) for (let y = S.y; y < S.y + S.h; y++) for (let x = S.x; x < Math.min(S.x + S.w, sx + 30); x++) { const d = Math.abs(x - sx) / 30; if (d < 1 && bayer(x, y) < (1 - d) * 0.5) b.set(x, y, stepColor(b.get(x, y), 1)); }
  }
  // the engineer at his mark (downstage right, by the wings) and Rima at hers
  if (st.eng) drawEngineerRoom(b, st.eng.x ?? STG.eng[0], STG.eng[1], {arm: 'raise', mouth: 'smile', ...st.eng.pose}, {flip: st.eng.flip});
  if (st.rima) {
    const p: RimaStandPose = {body: 'stand', head: 'face', mouth: 'rest', blink: false, light: 'room', ...st.rima.pose};
    const lt = st.rima.light ?? 'spot', rx = st.rima.x ?? STG.rima[0];
    // her light: full in the spot; half (the spot slid toward the screen: her screen-right side still in it, the other
    // side a step down, on her own pixels only); the half-dark; the house lights
    const t = new Buf(W, RH, TR);
    drawRima(t, rx, STG.rima[1], p);
    for (let y = 0; y < RH; y++) for (let x = rx - 26; x < rx + 30; x++) {
      const c = t.get(x, y); if (c === TR) continue;
      b.set(x, y, lt === 'spot' ? stepColor(c, 1) : lt === 'dark' ? stepColor(c, -2) : lt === 'half' && x < rx + 1 ? stepColor(c, -1) : c);
    }
    if (st.rima.clicker !== false && (p.body === 'stand' || p.body.startsWith('w'))) { const hx = rx + 9, hy = STG.rima[1] - 34; fill(b, hx - 1, hy, 3, 6, PAL.N0); b.set(hx, hy + 1, PAL.L3); }
  }
  // the house, in the foreground
  const H = st.house;
  if (H !== null) {
    const hs: HouseSt = {rows: 3, lights: L, phones: 'down', f, ...H};
    fill(b, 0, STG.lip + 4, W, RH - STG.lip - 4, L >= 2 ? PAL.N2 : L ? PAL.N1 : PAL.N0);
    // the seat backs' tops in a row, red under the house lights
    for (let x = 0; x < W; x += 15) fill(b, x + 1, RH - 6, 13, 6, L ? PAL.R1 : PAL.R0);
    house(b, hs);
  }
  if (st.blimp) drawBlimp(b, st.blimp.x, st.blimp.y, st.blimp.size, {f});
};

// ================================================================== the big screen, close
/** [SCR] the big screen's picture with its own pixels doubled (the camera nearer an LED wall): the window st.from (the
 *  screen's x of the window's left edge; 240 x 98 of it shown at 2x), the screen's black frame at the top and foot */
export const screenSCR = (b: Buf, f: number, st: ScreenSt & {from?: number}) => {
  const s = screenBuf(f, st);
  const x0 = st.from ?? 16;
  fill(b, 0, 0, W, RH, PAL.N0);
  for (let y = 0; y < 98; y++) for (let x = 0; x < 240; x++) { const c = s.get(x0 + x, y); const X = x * 2, Y = 3 + y * 2; b.set(X, Y, c); b.set(X + 1, Y, c); b.set(X, Y + 1, c); b.set(X + 1, Y + 1, c); }
  // the LED wall's grain: every other row a rung down where the picture is lit (the pixels of the wall itself)
  for (let y = 3; y < 199; y += 2) for (let x = 0; x < W; x++) if ((x & 1) === 1) b.set(x, y + 1, stepColor(b.get(x, y + 1), -1));
};
/** CHATGTP's eyes on the SCR (frame coords; the screen's own geometry: the face at its x in screenBuf, the eyes at
 *  0.33 / 0.63 of its width and 0.38 of its bubble's height, doubled from the window's left edge `from`) */
export const scrEyes = (from = 16): Array<[number, number]> => { const fx = Math.round((STG.scr.w - STG.chatW - 150) / 2), fy = 9, ey = fy + Math.round(96 * 0.38); return [fx + Math.round(150 * 0.33), fx + Math.round(150 * 0.63)].map((ex) => [(ex - from) * 2, 3 + ey * 2] as [number, number]); };

// ================================================================== Rima, MCU
const stageBehind = (b: Buf, lights: number, screenSide: number) => {
  vramp(b, 0, 0, W, RH, lights >= 2 ? [PAL.N2, PAL.N3, PAL.N3] : [PAL.N0, PAL.N1, PAL.N1]);
  // the rig's cans as soft discs (out of focus), the screen's glow at frame right
  for (let k = 0; k < 7; k++) { const x = 30 + k * 72, y = 10 + (k % 2) * 6; ellipse(x, y, 4, 3, b.ink(lights >= 2 ? PAL.N4 : PAL.W3)); if (lights < 2) b.set(x, y, PAL.W6); }
  if (screenSide) for (let y = 0; y < RH; y++) for (let x = 300; x < W; x++) if (bayer(x, y) < ((x - 300) / 180) * 0.45 * screenSide) b.set(x, y, stepColor(b.get(x, y), 1) === b.get(x, y) ? PAL.F2 : stepColor(b.get(x, y), 1));
};
export type RimaLight = 'spot' | 'half' | 'dark' | 'house';
export const rimaMCU = (b: Buf, f: number, st: {mouth: Viseme; light: RimaLight; lid?: 0 | 1 | 2; breath?: number; x?: number; hand?: RimaPortraitState['hand']}) => {
  stageBehind(b, st.light === 'house' ? 2 : 0, st.light === 'house' ? 0 : st.light === 'spot' ? 0.4 : 1);
  const x = st.x ?? 168, y = 28 - (st.breath ?? 0);
  // the spot's cone behind her (on: a column of light down from above; half: it has slid toward the screen, frame right)
  if (st.light === 'spot' || st.light === 'half') {
    const cx = st.light === 'spot' ? x + 56 : x + 150;
    for (let yy = 0; yy < RH; yy++) { const hw = 30 + yy * 0.3; for (let xx = Math.round(cx - hw); xx <= cx + hw; xx++) if (bayer(xx, yy) < 0.28) b.set(xx, yy, stepColor(b.get(xx, yy), 1)); }
  }
  const im = bustRunOn(rimaSpeakPortrait({mouth: st.mouth, lid: st.lid ?? 0, brow: 'level', hand: st.hand ?? 'none'}), 135);
  putBustCut(b, im, x, y, RH);
  // her light: the spot full on her; half (the right of her face and shoulder still in it, the left a hard step down:
  // a hard spot's edge, no dither on her skin); the half-dark (two steps down, a rim on her right edge); the house lights
  const x0 = x, x1 = x + 112, split = x + 64;
  for (let yy = 0; yy < RH; yy++) for (let xx = x0; xx < x1; xx++) {
    const c = b.get(xx, yy);
    if (st.light === 'half' && xx < split) b.set(xx, yy, stepColor(c, -1));
    else if (st.light === 'dark') { const edge = !isSkin(b.get(xx + 1, yy)) && isSkin(c); b.set(xx, yy, edge ? c : stepColor(c, -2)); }
  }
  void f;
};

// ================================================================== the fogging glasses
/** [ECU] mid-house, a stranger's glasses (nobody real, never the front row), close: the brow, the eyes behind the
 *  lenses, the bridge of the nose, heavy dark frames; the big screen small and cyan in each lens; the fog climbing the
 *  lenses from their feet in held steps (st.fog 0..3) until the eyes are gone behind it */
export const glassesECU = (b: Buf, f: number, st: {fog: number}) => {
  // the face, close: warm skin in the house's dark, keyed from the big screen (frame right): the planes step up toward
  // it (the far side of the face in shadow), solid bands, no dither on the skin
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
    const t = (x - 40) / 440 + (y - 100) / 900;
    b.set(x, y, t < 0.08 ? PAL.S0 : t < 0.32 ? PAL.S1 : t < 0.6 ? PAL.S2 : t < 0.86 ? PAL.S3 : PAL.S4);
  }
  // the brow ridge's shadow over the eyes, the cheeks' lift under them
  for (let y = 58; y < 70; y++) for (let x = 80; x < 400; x++) b.set(x, y, stepColor(b.get(x, y), -1));
  // the hair at the top, the brows
  for (let y = 0; y < 22; y++) for (let x = 0; x < W; x++) if (y < 10 + Math.round(Math.sin(x / 40) * 4)) b.set(x, y, y < 6 ? PAL.B0 : PAL.B1);
  for (const [bx, dir] of [[150, 1], [330, -1]] as Array<[number, number]>) for (let i = -44; i <= 44; i++) { const y = 46 - Math.round(Math.sqrt(Math.max(0, 1 - (i * i) / 1936)) * 8) + (i * dir > 20 ? 1 : 0); for (let t = 0; t < 5; t++) b.set(bx + i, y + t, t < 2 ? PAL.B0 : PAL.B1); }
  // the nose's bridge between the lenses, its shadow side
  for (let y = 60; y < RH; y++) { const hw = 10 + (y - 60) * 0.12; for (let x = Math.round(240 - hw); x <= 240 + hw; x++) b.set(x, y, x < 234 ? PAL.S2 : x > 246 ? PAL.S4 : PAL.S3); }
  // the eyes (whites, irises, pupils, lids), each behind its lens
  const eyes: Array<[number, number]> = [[150, 96], [330, 96]];
  for (const [ex, ey] of eyes) {
    for (let j = -12; j <= 12; j++) for (let i = -30; i <= 30; i++) { const d = Math.hypot(i / 30, j / 12); if (d < 1) b.set(ex + i, ey + j, d > 0.88 ? PAL.S1 : PAL.P1); }
    ellipse(ex + 4, ey, 11, 11, b.ink(PAL.B2)); ellipse(ex + 4, ey, 6, 6, b.ink(PAL.N0)); fill(b, ex + 1, ey - 5, 3, 3, PAL.P2);
    for (let i = -30; i <= 30; i++) { const y = ey - Math.round(Math.sqrt(Math.max(0, 1 - (i * i) / 900)) * 12); for (let t = 0; t < 3; t++) b.set(ex + i, y - t + 1, t === 0 ? PAL.N0 : PAL.S1); }
  }
  // the lenses: the screen's reflection (a small bright cyan rectangle), then the fog from the foot up
  const L1 = (ex: number, ey: number) => ({x0: ex - 62, x1: ex + 62, y0: ey - 40, y1: ey + 42});
  const fogTop = (ey: number) => ey + 42 - Math.round((st.fog / 3) * 96);
  for (const [ex, ey] of eyes) {
    const r = L1(ex, ey);
    for (let y = r.y0; y < r.y1; y++) for (let x = r.x0; x < r.x1; x++) {
      const u = (x - ex) / 62, v = (y - ey - 1) / 41; if (Math.abs(u) ** 4 + Math.abs(v) ** 4 >= 1) continue;
      let c = b.get(x, y);
      if (x > ex + 14 && x < ex + 40 && y > ey - 32 && y < ey - 16) c = y === ey - 31 || y === ey - 17 ? PAL.C4 : PAL.C3;
      if (st.fog > 0 && y >= fogTop(ey)) c = y === fogTop(ey) ? PAL.G5 : bayer(x, y) < 0.7 ? PAL.G6 : PAL.G5;
      b.set(x, y, c);
    }
    // the frame: heavy dark rims, a highlight along the top
    for (let y = r.y0 - 5; y < r.y1 + 5; y++) for (let x = r.x0 - 5; x < r.x1 + 5; x++) {
      const u = (x - ex) / 62, v = (y - ey - 1) / 41, q = Math.abs(u) ** 4 + Math.abs(v) ** 4;
      const uo = (x - ex) / 67, vo = (y - ey - 1) / 46, qo = Math.abs(uo) ** 4 + Math.abs(vo) ** 4;
      if (q >= 1 && qo < 1) b.set(x, y, y < ey - 34 && x > ex - 40 && x < ex + 30 ? PAL.N3 : PAL.N0);
    }
  }
  fill(b, 210, 92, 60, 6, PAL.N0); fill(b, 210, 92, 60, 1, PAL.N3);
  void f;
};

// ================================================================== 11.15: the engineer and Rima
export const eng2S = (b: Buf, f: number, st: {mouth: Viseme; arm: 'unclip' | 'phone'; headset: 'on' | 'off'}) => {
  stageBehind(b, 1, 0.6);
  // Rima at her mark, frame left, composed, not looking up (the house lights a step up on her)
  putBustCut(b, bustRunOn(rimaSpeakPortrait({mouth: 'rest', lid: 0, brow: 'level', hand: 'none'}), 135), 64, 30, RH);
  // the engineer beside her, frame right, a step closer, his headset coming off, reading his phone to her (off mic)
  putBustCut(b, smoothSkin(engineerBust({mouth: st.mouth, expr: 'neutral', arm: st.arm, headset: st.headset})), 252, 36, RH);
  void f;
};
void rect; void clamp; void pw;

// ================================================================== 11.01's opening (shared with 10.07's tear)
/** the meter frame as the demo opens: the rig's lights on the stage, the house dark and full, CHATGTP a plain bubble
 *  on the big screen, Rima walking out of the wings to her mark (she reaches it on k = walkTo); the engineer at his.
 *  10.07's tear reveals exactly this frame at k = 0 (f = 0), so the cut into 11.01 is the same picture */
export const demoOpen = (b: Buf, f: number, k: number, o: {walkTo?: number; spotAt?: number; rimaMouth?: 'open' | 'rest'} = {}) => {
  const walkTo = o.walkTo ?? 14, spotAt = o.spotAt ?? 14;
  const x = k >= walkTo ? STG.rima[0] : Math.round(STG.rima[0] - (walkTo - k) * 2);
  const walking = k < walkTo;
  stageWide(b, f, {spot: k >= spotAt ? 0 : null, rig: 1, screen: {grow: 0, chat: 4, live: 'live', badge: false},
    house: {rows: 3, phones: 'down', press: true},
    eng: {pose: {arm: 'phone', mouth: 'rest'}},
    rima: {x, pose: {body: walking ? (['w0', 'w1', 'w2', 'w3'] as const)[Math.floor(k / 3) % 4] : 'stand', mouth: o.rimaMouth ?? 'rest'}, light: k >= spotAt ? 'spot' : 'house'}});
};

// ================================================================== her clicker, in her hand (11.06)
import {holdPhone} from '../../art/cast/hands2';
/** the clicker in her hand at the frame's foot (the art's hand rig: her fingers round it, her thumb on its button; her
 *  grey jacket's cuff), its button lit on the click */
export const rimaClicker = (b: Buf, x: number, y: number, lit: boolean) => {
  const r = {x, y, w: 14, h: 34};
  holdPhone(b, r, {side: 'R', grip: 'wrap', light: 'lobby', widthCm: 3.0, thumbAt: 0.0, sleeveTo: [x + 50, y + 200],
    cuffRamp: [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G4, PAL.P1], sleeveRamp: [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G4],
    skinMap: (c) => stepColor(c, -1),
    drawPhone: (bb) => { fill(bb, r.x - 1, r.y - 1, r.w + 2, r.h + 2, PAL.N0); fill(bb, r.x, r.y, r.w, r.h, PAL.N1); fill(bb, r.x, r.y, 1, r.h, PAL.N3); ellipse(r.x + 7, r.y + 7, 3, 3, bb.ink(lit ? PAL.L3 : PAL.N3)); fill(bb, r.x + 4, r.y + 16, 6, 3, PAL.N3); }});
};

// ================================================================== the house lights up full (12.01)
/** the meter frame after the show: the house lights up full, the rig dark (the blimp gone out through it), the big
 *  screen dark, the house empty but for its seats, Rima the last one on her mark with the clicker */
export const houseUp = (b: Buf, f: number, k: number, up: number) => {
  // the last of the house filing out, a few heads at a time (held steps of 6 frames)
  stageWide(b, f, {spot: null, rig: 0, lights: k >= up ? 2 : 1, screen: {live: 'dark'}, house: {rows: 3, phones: 'down', gone: Math.min(1, 0.6 + Math.floor(k / 6) * 0.06)}, eng: null, rima: {light: 'house'}});
};
