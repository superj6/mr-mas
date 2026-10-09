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
//   houseClose(b, f, st)   [M] 11.16: the rows nearest the wings from behind, close; their heads come round to the wings
import {Buf, rect, line, ellipse, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor, familyOf} from '../../../../../shared/pixel/palette';
import {rimaSpeakPortrait} from '../../../../../shared/pixel/cast/rima-speak';
import type {RimaPortraitState} from '../../../../../shared/pixel/cast/rima-speak';
import type {Viseme} from '../../../../../shared/pixel/cast/talk';
import type {RimaStandPose} from '../../../../../shared/pixel/cast/rima-stand';
import {drawChatFace, voice5Badge} from '../../art/sets/stage';
import type {ChatFaceSt} from '../../art/sets/stage';
import {engineerBust, drawEngineerRoom} from '../../art/cast/engineer';
import type {EngineerRoomPose} from '../../art/cast/engineer';
import {drawBlimp} from '../../art/creatures';
import {fill, pt, pw, tiny, tinyWidth, vramp} from '../../art/kit';
import {RH, W, TR, glow, isSkin, bustRunOn, drawRima, smoothSkin, putBustSoft} from './common';

// ================================================================== geometry
export const STG = {
  wing: 30,                                  // the masking leg at frame left (stage right: the wings, Mas's side)
  deck: 150, lip: 178,                       // the stage floor's upstage line and its front edge
  scr: {x: 212, y: 16, w: 256, h: 98},       // the big screen
  chatW: 70,
  rima: [168, 166] as [number, number],      // her mark (foot)
  eng: [66, 178] as [number, number],        // his mark, downstage right (screen-left, by the wings)
  spot: [168, 194, 246, 292],                // the spot's x on its four steps: on her; its edge through her (half on her);
                                             // off her; at the screen's foot (more on the screen than on her)
  spotSrc: [222, 14] as [number, number],    // the followspot's lamp in the rig (the beam swings from here)
  house: 182,                                // the first row of heads in the frame
};

// ================================================================== the big screen's picture
export interface ScreenSt extends ChatFaceSt { live?: 'live' | 'ended' | 'dark'; chat?: number | null; chatHi?: boolean; badge?: boolean; lit?: number }
/** the stream's chat: the house's messages before the catch (never the word her: nobody has said it yet; never
 *  free: the joke is the product's), `what's the catch?` exactly at CATCH (11.08 scrolls it in and it sticks), then the
 *  messages after it */
const CHAT_SEQ = [
  'hello', 'first', 'is it live?', 'wow', 'hi everyone', 'its starting', 'good morning', 'wow', 'shh', 'what is it',
  'its alive', 'hi!!', 'it can see us', 'omg', 'wait', 'hello?', 'so clean', 'so fast', 'cute', 'it talks a lot',
  'omg', 'THANKS', 'lol', 'one word?', 'wait', 'its singing??', 'lmao', 'again!', 'encore', 'ok',
  'opinions lol', 'ok', 'ok', 'hi!!', 'hi', 'warm lol', 'omg', 'it blushed', 'cute', 'when can i use it',
];
const CHAT_POST = ['lol', 'free!!', 'wait', 'omg', 'lol'];
export const CATCH = 40;
/** the chat in order (the review pass: each reaction after its cause, scene frame / 40 + 4 is the newest index: the
 *  first laugh is index 20, so 'lol' and 'THANKS' come at 21-22; 'again!' only after it has sung; 'it blushed' after
 *  the blush line; never her, never free before the catch) */
const chatMsg = (i: number) => (i < 0 ? '' : i === CATCH ? "what's the catch?" : i < CATCH ? CHAT_SEQ[i] ?? 'wow' : CHAT_POST[(i - CATCH - 1) % CHAT_POST.length]);
/** the stream's chat in its own strip at the screen's right: messages wrapped, the newest (index `scroll`) at the foot;
 *  `what's the catch?` lit in a box when it sticks */
const chatStrip = (s: Buf, x: number, y: number, w: number, h: number, scroll: number, hi: boolean) => {
  fill(s, x, y, w, h, PAL.N0); fill(s, x, y, 1, h, PAL.N3); fill(s, x, y, w, 9, PAL.N2); tiny(s, 'CHAT', x + 4, y + 2, PAL.N7);
  const lines: Array<{t: string; hi: boolean; first: boolean}> = [];
  const upto = Math.floor(scroll);
  for (let k = upto - 7; k <= upto; k++) {
    const m = chatMsg(k), isHi = hi && m === "what's the catch?";
    if (!m) continue;
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
  rima?: {pose?: Partial<RimaStandPose>; x?: number; light?: 'spot' | 'half' | 'dim' | 'dark' | 'house'; clicker?: boolean; flip?: boolean} | null;
  /** the masking leg drawn again over the cast (someone walking off into the wings) */
  legOver?: boolean;
  /** the rig's truss drawn again over the blimp (it drifts up into the rig) */
  blimpBehindRig?: boolean;
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
  // the spot: a BEAM from its lamp in the rig (a faint dithered cone, its core a little denser) down to a hard pool, the
  // beam swinging a step per laugh toward the screen: step 1 its edge runs through her, step 3 the pool climbs onto
  // the screen's foot and its bezel, and the screen's lower corner takes the light
  const sp = st.spot;
  if (sp !== null && sp !== undefined) {
    const sx = STG.spot[sp], onScreen = sp === 3;
    const fy = onScreen ? S.y + S.h + 6 : STG.rima[1];
    const [lx, ly] = STG.spotSrc;
    for (let y = ly + 1; y < fy - 4; y++) {
      const t = (y - ly) / (fy - ly), cx = lx + (sx - lx) * t, hw = 2 + t * (onScreen ? 18 : 22);
      // haze in the beam: its edges a touch denser than its body (so the cone reads as a cone), the core between
      for (let x = Math.round(cx - hw); x <= cx + hw; x++) { const d = Math.abs(x - cx) / hw, q = bayer(x, y); if (q < (d > 0.82 ? 0.42 : d < 0.45 ? 0.3 : 0.16) + t * 0.06) b.set(x, y, stepColor(b.get(x, y), q < 0.12 ? 3 : 2)); }
    }
    if (!onScreen) for (let y = fy - 6; y <= fy + 6; y++) for (let x = sx - 26; x <= sx + 26; x++) { const d = Math.hypot((x - sx) / 26, (y - fy) / 6); if (d < 1) b.set(x, y, d > 0.86 ? PAL.G6 : bayer(x, y) < 0.5 ? PAL.G4 : PAL.G5); }
    else {
      // the pool broken over the screen's foot: its lower bezel lit, the picture's lower corner a hard step up, the
      // deck under it a lit sliver
      for (let y = S.y + S.h - 13; y <= S.y + S.h + 6; y++) for (let x = sx - 26; x <= sx + 26; x++) {
        const d = Math.hypot((x - sx) / 26, (y - (S.y + S.h)) / 13); if (d >= 1) continue;
        const onPic = x >= S.x && x < S.x + S.w && y >= S.y && y < S.y + S.h;
        b.set(x, y, onPic ? stepColor(b.get(x, y), 1) : y >= S.y + S.h && y < S.y + S.h + 4 ? (d > 0.86 ? PAL.G5 : PAL.G4) : stepColor(b.get(x, y), 1));
      }
      for (let x = sx - 20; x <= sx + 20; x++) for (let y = STG.deck; y < STG.deck + 3; y++) if (bayer(x, y) < 0.5) b.set(x, y, PAL.G4);
    }
  }
  // the engineer at his mark (downstage right, by the wings) and Rima at hers
  if (st.eng) drawEngineerRoom(b, st.eng.x ?? STG.eng[0], STG.eng[1], {arm: 'raise', mouth: 'smile', ...st.eng.pose}, {flip: st.eng.flip});
  if (st.rima) {
    const p: RimaStandPose = {body: 'stand', head: 'face', mouth: 'rest', blink: false, light: 'room', ...st.rima.pose};
    const lt = st.rima.light ?? 'spot', rx = st.rima.x ?? STG.rima[0];
    // her light: full in the spot; half (the spot slid toward the screen: her screen-right side still in it, the other
    // side a step down, on her own pixels only); the half-dark; the house lights
    const t = new Buf(W, RH, TR);
    drawRima(t, rx, STG.rima[1], p, {flip: st.rima.flip});
    for (let y = 0; y < RH; y++) for (let x = rx - 26; x < rx + 30; x++) {
      const c = t.get(x, y); if (c === TR) continue;
      b.set(x, y, lt === 'spot' ? stepColor(c, 1) : lt === 'dark' ? stepColor(c, -2) : lt === 'dim' ? stepColor(c, -1) : lt === 'half' && x < rx + 1 ? stepColor(c, -1) : c);
    }
    if (st.rima.clicker !== false && (p.body === 'stand' || p.body.startsWith('w'))) { const hx = rx + (st.rima.flip ? -9 : 9), hy = STG.rima[1] - 34; fill(b, hx - 1, hy, 3, 6, PAL.N0); b.set(hx, hy + 1, PAL.L3); }
  }
  if (st.legOver) { fill(b, 0, 0, STG.wing, STG.lip, PAL.N0); fill(b, STG.wing, 0, 2, STG.lip, PAL.N1); }
  // the house, in the foreground
  const H = st.house;
  if (H !== null) {
    const hs: HouseSt = {rows: 3, lights: L, phones: 'down', f, ...H};
    fill(b, 0, STG.lip + 4, W, RH - STG.lip - 4, L >= 2 ? PAL.N2 : L ? PAL.N1 : PAL.N0);
    // the seat backs' tops in a row, red under the house lights
    for (let x = 0; x < W; x += 15) fill(b, x + 1, RH - 6, 13, 6, L ? PAL.R1 : PAL.R0);
    house(b, hs);
  }
  if (st.blimp) {
    drawBlimp(b, st.blimp.x, st.blimp.y, st.blimp.size, {f});
    // drifting up into the rig: the truss and its cans in front of it again
    if (st.blimpBehindRig) { fill(b, 40, 4, W - 40, 3, PAL.G2); for (let x = 42; x < W; x += 6) line(x, 4, x + 3, 7, b.ink(PAL.G3)); for (let x = 70; x < W; x += 40) { fill(b, x, 7, 7, 7, PAL.N0); fill(b, x + 1, 13, 5, 1, rig ? PAL.W8 : PAL.W2); } }
  }
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
/**
 * [MCU] Rima on her mark (Ep1's approved portrait, its bust feathered: common putBustSoft). Her light is applied to
 * HER OWN PIXELS ONLY (drawn into a layer first: the room behind her is never stepped down in her bounding box, and
 * the spot's beam runs on behind her): 'spot' full; 'half' the spot slid toward the screen (frame right): its edge is
 * the pool's own curve across her face and shoulders (a circle centred off her right side), her screen-right side
 * still in it, the rest a hard step down (no dither on skin); 'dark' two steps down, the screen's light a rim on her
 * right edge; 'house' as she is. st.x / st.breath: her place and the breath (a pixel up).
 */
export const rimaMCU = (b: Buf, f: number, st: {mouth: Viseme; light: RimaLight; lid?: 0 | 1 | 2; breath?: number; x?: number; hand?: RimaPortraitState['hand']}) => {
  stageBehind(b, st.light === 'house' ? 2 : 0, st.light === 'house' ? 0 : st.light === 'spot' ? 0.4 : 1);
  const x = st.x ?? 168, y = 28 - (st.breath ?? 0);
  // the spot's beam behind her (on: a column of light down from above her; half: slid toward the screen, frame
  // right, its near edge passing behind her shoulder)
  if (st.light === 'spot' || st.light === 'half') {
    const cx = st.light === 'spot' ? x + 56 : x + 150;
    for (let yy = 0; yy < RH; yy++) { const hw = 30 + yy * 0.3; for (let xx = Math.round(cx - hw); xx <= cx + hw; xx++) if (bayer(xx, yy) < 0.28) b.set(xx, yy, stepColor(b.get(xx, yy), 1)); }
  }
  const im = bustRunOn(rimaSpeakPortrait({mouth: st.mouth, lid: st.lid ?? 0, brow: 'level', hand: st.hand ?? 'none'}), 135);
  const t = new Buf(W, RH, TR);
  putBustSoft(t, im, x, y, RH);
  // the pool's edge for 'half': a circle centred off her right (screen-right) side, so the line curves across her
  // face (through the nose's lit side) and falls away across her near shoulder
  const pcx = x + 152, pcy = y + 34, pr = 99;
  for (let yy = 0; yy < RH; yy++) for (let xx = Math.max(0, x - 4); xx < Math.min(W, x + 118); xx++) {
    const c = t.c[yy * W + xx]; if (c === TR) continue;
    let v = c;
    if (st.light === 'half') v = Math.hypot(xx - pcx, (yy - pcy) * 1.15) < pr ? c : stepColor(c, -1);
    else if (st.light === 'dark') { const rimEdge = xx + 1 >= W || t.c[yy * W + xx + 1] === TR; v = rimEdge ? stepColor(c, -1) : stepColor(c, -2); }
    b.set(xx, yy, v);
  }
  void f;
};

// ================================================================== the fogging glasses
/** [ECU] mid-house, a stranger's glasses (nobody real, never the front row), close, IN THE PORTRAITS' GRAMMAR at the
 *  frame's own pixels (the review pass: it was the act's one flat two-tone vector insert): the face modelled as a
 *  surface (the brow ridge, the eye sockets, the nose's bridge, the cheekbones) and lit from the big screen ahead and to
 *  the right in hard cel bands (no dither on skin), outlines on the features (the lids, the brows, the nose's shadow
 *  side), eyes with lids and irises; heavy dark frames with their own highlights; the screen small and cyan in each
 *  lens with a glint across it; the fog climbing the lenses from their feet in held steps (st.fog 0..3), its front
 *  dithered, denser toward the foot, until the eyes are gone behind it */
const GL_EYES: Array<[number, number]> = [[148, 104], [332, 104]];
let GL_FACE: Buf | null = null;
const glassesFace = (): Buf => {
  if (GL_FACE) return GL_FACE;
  const b = new Buf(W, RH, PAL.S2);
  const h = (x: number, y: number) => {
    const u = (x - 240) / 330, v = (y - 70) / 300;
    let z = Math.sqrt(Math.max(0, 1 - u * u - v * v)) * 70;
    for (const [ex, ey] of GL_EYES) { z -= 16 * Math.exp(-(((x - ex) / 50) ** 2 + ((y - ey) / 26) ** 2)); z += 4 * Math.exp(-(((x - ex) / 60) ** 2 + ((y - 162) / 24) ** 2)); }
    z += 20 * Math.exp(-(((x - 240) / 15) ** 2)) * clamp((y - 56) / 90, 0, 1);
    z += 6 * Math.exp(-(((y - 64) / 9) ** 2)) * (Math.abs(x - 240) < 190 ? 1 : 0);
    return z;
  };
  const L = [0.5, -0.35, 0.79];
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
    const nx = -(h(x + 1, y) - h(x - 1, y)) / 2, ny = -(h(x, y + 1) - h(x, y - 1)) / 2, l = Math.hypot(nx, ny, 1);
    const i = (nx * L[0] + ny * L[1] + L[2]) / l;
    b.set(x, y, i < 0.5 ? PAL.S1 : i < 0.68 ? PAL.S2 : i < 0.82 ? PAL.S3 : i < 0.93 ? PAL.S4 : PAL.S5);
  }
  // the hairline at the top, its edge in clumps; the nose's shadow side outlined, its lit ridge
  for (let x = 0; x < W; x++) { const e = 9 + Math.round(Math.sin(x / 37) * 3 + Math.sin(x / 11) * 1.5); for (let y = 0; y < e; y++) b.set(x, y, y < e - 3 ? PAL.B0 : y < e - 1 ? PAL.B1 : PAL.B2); }
  for (let y = 120; y < RH; y++) { const xs = 240 - 13 - Math.round((y - 120) * 0.1); b.set(xs, y, PAL.S1); b.set(xs - 1, y, PAL.S0); }
  // the brows: hair strokes over the brow ridge (the outline under them, a lit rim on top)
  for (const [ex, dir] of [[148, 1], [332, -1]] as Array<[number, number]>) for (let i = -56; i <= 56; i++) {
    const t = (i * dir + 56) / 112, yb = 54 - Math.round(Math.sin(Math.PI * Math.min(1, t * 1.15)) * 9), th = 3 + Math.round(Math.sin(Math.PI * t) * 3);
    for (let q = 0; q < th; q++) b.set(ex + i, yb + q, q === 0 ? PAL.B2 : (ex + i + q) % 5 === 0 ? PAL.B2 : PAL.B1);
    b.set(ex + i, yb + th, PAL.B0);
  }
  // the eyes: almond openings, the upper lid's heavy line and its crease, the white shadowed under the lid, the iris
  // (toward the screen, a touch right of centre), its pupil and the catchlights (the screen's cyan, a hot point)
  for (const [ex, ey] of GL_EYES) {
    const rx = 34, ry = 13;
    for (let j = -ry - 2; j <= ry + 2; j++) for (let i = -rx - 2; i <= rx + 2; i++) {
      const top = -ry * Math.sqrt(Math.max(0, 1 - (i / rx) ** 2)) * (i < 0 ? 0.9 : 1), bot = ry * 0.75 * Math.sqrt(Math.max(0, 1 - (i / rx) ** 2));
      const X = ex + i, Y = ey + j;
      if (j > top && j < bot) b.set(X, Y, j < top + 4 ? PAL.P0 : PAL.P1);
      else if (Math.abs(j - top) < 2.2 && Math.abs(i) < rx + 1) b.set(X, Y, PAL.N0);
      else if (Math.abs(j - bot) < 1 && Math.abs(i) < rx - 2) b.set(X, Y, PAL.S1);
      else if (Math.abs(j - (top - 7)) < 1 && Math.abs(i) < rx - 6) b.set(X, Y, PAL.S2);
    }
    const ix = ex + 5, iy = ey + 1;
    for (let j = -11; j <= 11; j++) for (let i = -11; i <= 11; i++) {
      const d = Math.hypot(i, j), X = ix + i, Y = iy + j;
      if (d > 11 || b.get(X, Y) === PAL.N0 || (b.get(X, Y) !== PAL.P0 && b.get(X, Y) !== PAL.P1)) continue;
      b.set(X, Y, d > 9.5 ? PAL.B1 : d < 5 ? PAL.N0 : j < -3 ? PAL.B2 : PAL.B3);
    }
    fill(b, ix + 3, iy - 6, 3, 3, PAL.C8); b.set(ix + 4, iy - 5, PAL.C9); b.set(ix - 5, iy + 4, PAL.B4);
  }
  GL_FACE = b;
  return b;
};
export const glassesECU = (b: Buf, f: number, st: {fog: number}) => {
  b.c.set(glassesFace().c.subarray(0, W * RH));
  // the lenses (rounded rectangles), seen through a hair smaller and a rung cooler; the screen's reflection and a glint
  const LW = 66, LH = 46;
  const inLens = (x: number, y: number, ex: number, ey: number, gw = 0) => Math.abs((x - ex) / (LW + gw)) ** 4 + Math.abs((y - ey) / (LH + gw)) ** 4 < 1;
  const fogTop = (ey: number) => ey + LH - Math.round((st.fog / 3) * (LH * 2 + 2));
  for (const [ex0, ey0] of GL_EYES) {
    const ex = ex0 + 2, ey = ey0 - 2;
    const src = b.clone();
    for (let y = ey - LH; y <= ey + LH; y++) for (let x = ex - LW; x <= ex + LW; x++) {
      if (!inLens(x, y, ex, ey)) continue;
      // through the glass: the face behind it pulled a little toward the lens centre (a minus lens), a rung cooler
      const sx = Math.round(ex + (x - ex) * 1.06), sy = Math.round(ey + (y - ey) * 1.06);
      let c = src.get(sx, sy);
      const fm = familyOf(c); if (fm && fm[0] === 'S') c = stepColor(c, -1);
      // the big screen, small and cyan, in the lens's upper outer corner; a glint streak across the upper glass
      const rx0 = ex + (ex < 240 ? -50 : 18), ry0 = ey - 34;
      if (x >= rx0 && x < rx0 + 32 && y >= ry0 && y < ry0 + 14) c = y === ry0 ? PAL.C7 : x < rx0 + 22 ? (y < ry0 + 9 ? PAL.P1 : PAL.C4) : PAL.C3;
      const g = (x - ex) + (y - ey) * 1.4;
      if (Math.abs(g + 48) < 2 && y < ey) c = PAL.G6;
      if (Math.abs(g + 41) < 1 && y < ey - 8) c = PAL.G5;
      // the fog: from the foot up, its front dithered (a few pixels of ordered dither), denser toward the foot
      const ft = fogTop(ey);
      if (st.fog > 0 && y > ft - 6) {
        const depth = (y - (ft - 6)) / 14, q = bayer(x, y);
        if (q < depth) c = q < depth - 0.6 ? PAL.G6 : PAL.G5;
        if (y > ft + 10) c = q < 0.25 ? PAL.P0 : PAL.G6;
      }
      b.set(x, y, c);
    }
    // the frame: heavy and dark (outline, body, its top edge lit, a specular point at the outer corner)
    for (let y = ey - LH - 8; y <= ey + LH + 8; y++) for (let x = ex - LW - 8; x <= ex + LW + 8; x++) {
      if (inLens(x, y, ex, ey)) continue;
      if (!inLens(x, y, ex, ey, 6)) continue;
      const outer = !inLens(x, y, ex, ey, 5), inner = inLens(x, y, ex, ey, 1);
      b.set(x, y, outer || inner ? PAL.N0 : y < ey - LH + 2 ? PAL.G3 : y < ey ? PAL.N2 : PAL.N1);
    }
    const sx = ex + (ex < 240 ? -LW + 2 : LW - 6), sy = ey - LH - 1;
    fill(b, sx, sy, 4, 2, PAL.G5); b.set(sx + 1, sy, PAL.P1);
  }
  // the bridge between the frames, over the nose; the temples off the frame's edges
  for (let x = 240 - 36; x <= 240 + 36; x++) { const yy = 94 - Math.round(Math.cos(((x - 240) / 36) * Math.PI / 2) * 6); for (let q = 0; q < 6; q++) b.set(x, yy + q, q === 0 || q === 5 ? PAL.N0 : q === 1 ? PAL.G3 : PAL.N1); }
  for (const [x0, x1] of [[0, 72], [408, 480]]) for (let x = x0; x < x1; x++) for (let q = 0; q < 6; q++) b.set(x, 76 + q, q === 0 || q === 5 ? PAL.N0 : q === 1 ? PAL.G2 : PAL.N1);
  void f;
};

// ================================================================== 11.15: the engineer and Rima
export const eng2S = (b: Buf, f: number, st: {mouth: Viseme; arm: 'unclip' | 'phone'; headset: 'on' | 'off'}) => {
  stageBehind(b, 1, 0.6);
  // Rima at her mark, frame left, composed, not looking up (the house lights a step up on her)
  putBustSoft(b, bustRunOn(rimaSpeakPortrait({mouth: 'rest', lid: 0, brow: 'level', hand: 'none'}), 135), 64, 30, RH);
  // the engineer beside her, frame right, a step closer, his headset coming off, reading his phone to her (off mic)
  putBustSoft(b, smoothSkin(engineerBust({mouth: st.mouth, expr: 'neutral', arm: st.arm, headset: st.headset})), 252, 36, RH);
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

// ================================================================== 11.16: the rows by the wings, close
import {backHeadImg} from './backhead';
import type {BackHeadSt} from './backhead';
/** the people in the rows nearest the wings (nobody named, nobody real): row (0 nearest), x of the bust's left, hair,
 *  colours, their turn's delay (frames after the rustle) and whether they hold a phone up */
const HC_SKIN = [[PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5], [PAL.S0, PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4], [PAL.D0, PAL.D1, PAL.D2, PAL.D3, PAL.D4, PAL.S3], [PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6]];
const HC_HAIR = [[PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.G4], [PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.G5], [PAL.B1, PAL.B2, PAL.B3, PAL.B4, PAL.W5, PAL.W7], [PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.G6]];
const HC_TOP = [[PAL.N0, PAL.F1, PAL.F2, PAL.F3, PAL.F4, PAL.F5], [PAL.N0, PAL.R0, PAL.R1, PAL.R2, PAL.R3, PAL.R3], [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G5], [PAL.N0, PAL.L0, PAL.L1, PAL.L1, PAL.L2, PAL.L3], [PAL.N0, PAL.U1, PAL.U2, PAL.U3, PAL.U4, PAL.U5], [PAL.N0, PAL.D1, PAL.D2, PAL.D3, PAL.D4, PAL.D4]];
type HCP = {row: number; x: number; hair: BackHeadSt['hair']; skin: number; hc: number; top: number; delay: number; phone?: boolean};
const HC_PEOPLE: HCP[] = [
  // the far row (small), then the middle, then the nearest (largest, cropped by the frame's foot)
  {row: 2, x: 120, hair: 'short', skin: 0, hc: 1, top: 2, delay: 0}, {row: 2, x: 196, hair: 'long', skin: 1, hc: 0, top: 4, delay: 2, phone: true}, {row: 2, x: 272, hair: 'short', skin: 3, hc: 3, top: 0, delay: 5}, {row: 2, x: 350, hair: 'bun', skin: 2, hc: 0, top: 5, delay: 7},
  {row: 1, x: 70, hair: 'long', skin: 3, hc: 2, top: 1, delay: 1}, {row: 1, x: 168, hair: 'short', skin: 2, hc: 0, top: 3, delay: 3, phone: true}, {row: 1, x: 270, hair: 'short', skin: 0, hc: 1, top: 5, delay: 6}, {row: 1, x: 372, hair: 'long', skin: 1, hc: 1, top: 2, delay: 9, phone: true},
  {row: 0, x: -10, hair: 'short', skin: 1, hc: 3, top: 0, delay: 2}, {row: 0, x: 128, hair: 'bun', skin: 0, hc: 2, top: 4, delay: 4}, {row: 0, x: 262, hair: 'short', skin: 2, hc: 0, top: 2, delay: 7, phone: true}, {row: 0, x: 396, hair: 'long', skin: 3, hc: 1, top: 3, delay: 10},
];
const HC_ROW = [{scale: 1.05, y: 88}, {scale: 0.78, y: 64}, {scale: 0.58, y: 48}];
/**
 * [M] 11.16's aftermath, at a size the turn can be read: low in the house by the wings, the rows nearest them from
 * behind (Act Two's back-of-head bust, in the house light, a different person in every seat), the stage's lip and its
 * masking leg beyond, the wings' dark gap at frame left. On the rustle the heads come round to the wings in two held
 * drawings each (the cheek's edge and the near ear, then the lost profile), a few frames apart, nearest last; the
 * raised phones swing from the stage to the wings (st.k: frames into the shot; st.t0: the rustle).
 */
export const houseClose = (b: Buf, f: number, st: {k: number; t0: number}) => {
  // beyond: the stage's dark face and lip, the deck above it in the house light, the masking leg and the wings' gap
  vramp(b, 0, 0, W, 60, [PAL.N1, PAL.N2, PAL.N2]);
  fill(b, 0, 60, W, 6, PAL.N3); fill(b, 0, 60, W, 1, PAL.N5); fill(b, 0, 66, W, RH - 66, PAL.N1);
  for (let x = 0; x < W; x += 24) fill(b, x, 66, 1, 40, PAL.N0);
  fill(b, 0, 0, 92, 62, PAL.N0); fill(b, 92, 0, 3, 62, PAL.N1);
  // the wings' gap: the work light's faint warmth on the floor beyond the leg (where he stands, unseen)
  for (let y = 30; y < 60; y++) for (let x = 0; x < 88; x++) if (bayer(x, y) < (y - 30) / 30 * 0.35 * (1 - x / 88)) b.set(x, y, PAL.W1);
  // the big screen's foot at the top right (ENDED: dim cream and the chip)
  fill(b, 330, 0, W - 330, 18, PAL.N0); fill(b, 334, 0, W - 334, 14, PAL.P0); fill(b, 344, 3, 30, 8, PAL.G3); pt(b, 'ENDED', 346, 4, PAL.P2);
  // the rows, far to near: the seat backs' red tops between the people, then the people
  for (let r = 2; r >= 0; r--) {
    const R = HC_ROW[r];
    const seatY = R.y + Math.round(128 * R.scale);
    for (let x = -20; x < W; x += Math.round(90 * R.scale)) { fill(b, x, seatY, Math.round(78 * R.scale), Math.round(10 * R.scale), PAL.R1); fill(b, x, seatY, Math.round(78 * R.scale), 1, PAL.R2); }
    for (const p of HC_PEOPLE) {
      if (p.row !== r) continue;
      const t = st.k - st.t0 - p.delay;
      const turn = (t < 0 ? 0 : t < 7 ? 1 : 2) as 0 | 1 | 2;
      // a phone held up over the head (the arm raised from behind the head, the hand round the phone's foot): its back
      // to us while it points at the stage (a dark slab, the camera's dot, the screen's light round its edges); swung
      // toward the wings it turns, its lit screen coming round on the wings' side
      if (p.phone) {
        const s = R.scale, sw = t >= 3;
        const cx = p.x + Math.round((sw ? 52 : 62) * s), top = R.y - Math.round(18 * s), ph = Math.round(26 * s), pw0 = Math.round((sw ? 11 : 15) * s);
        const sl = HC_TOP[p.top], sk = HC_SKIN[p.skin];
        // the forearm up from behind the head to the hand
        for (let y = top + ph; y < R.y + Math.round(40 * s); y++) { const w0 = Math.round(5 * s); for (let i = -w0; i <= w0; i++) b.set(cx + i + Math.round((y - top - ph) * 0.12), y, i === -w0 || i === w0 ? sl[0] : i < 0 ? sl[2] : sl[3]); }
        fill(b, cx - Math.round(5 * s), top + ph - Math.round(3 * s), Math.round(10 * s), Math.round(8 * s), sk[3]); fill(b, cx - Math.round(5 * s), top + ph - Math.round(3 * s), Math.round(10 * s), 1, sk[4]);
        const px = cx - Math.round(pw0 / 2);
        fill(b, px - 1, top - 1, pw0 + 2, ph + 2, PAL.N0);
        if (!sw) { fill(b, px, top, pw0, ph, PAL.N2); fill(b, px, top, pw0, 1, PAL.G3); fill(b, px + 2, top + 2, 3, 3, PAL.N0); b.set(px + 3, top + 3, PAL.G4); for (let y = top; y < top + ph; y++) { b.set(px - 2, y, PAL.C2); b.set(px + pw0 + 1, y, PAL.C2); } }
        else { const sc = Math.round(pw0 * 0.65); fill(b, px, top, sc, ph, PAL.C4); fill(b, px, top, sc, 2, PAL.C6); fill(b, px + 1, top + 4, sc - 2, ph - 8, PAL.C5); fill(b, px + sc, top, pw0 - sc, ph, PAL.N2); }
      }
      const im = backHeadImg({scale: R.scale, turn, light: 'house', level: 1, hair: p.hair, skinRamp: HC_SKIN[p.skin], hairRamp: HC_HAIR[p.hc], topRamp: HC_TOP[p.top]});
      for (let j = 0; j < im.h; j++) for (let i = 0; i < im.w; i++) { const v = im.c[j * im.w + i]; if (v >= 0) b.set(p.x + i, R.y + j, v); }
    }
  }
  void f;
};
