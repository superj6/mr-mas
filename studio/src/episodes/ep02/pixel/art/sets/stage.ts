// MR. MAS — Ep2 v1 art: SET-10, THE DEMO STAGE (sc 9, 11, 12), CHATGTP's Ep2 face (§2.1), the VOICE panel (§3) and the
// chrome armrest's reflection (sc 12). Mas keeps the left third: the wings are stage right, screen-left from the house.
//   wings(b, f, st)           [W] sc 9, the work-light palette: road cases and cables, a monitor screen-right (its
//                             picture st.screen), Rima's hard circular spot even back here (st.rimaSpot), Gerg on a road
//                             case in the foreground (st.gerg), the cast drawn by the caller between the layers
//   stageWide(b, f, st)       [W] sc 11, the LOCKED wide from mid-house (the spotlight's meter frame): the clean stage,
//                             the big screen (CHATGTP's face, the VOICE 5 badge, the LIVE -> ENDED chrome, the stream's
//                             chat), the spotlight sliding one step per laugh (st.spot 0..3: on Rima -> on the screen),
//                             the tiled house (st.house 'full' | 'emptying' | 'empty'), the house lights (st.lights 0..2),
//                             the press row's screens and the wall of raised phones (st.phones: 'down' | 'up' | 'swung'),
//                             the lighting rig at the top
//   frontRow(b, f, st)        [W] sc 12.02, from the wings: the roped front row in plain house light, the RESERVED: CHIEF
//                             SCIENTIST placard (it never flips) on the empty seat, its chrome armrest
//   armrestECU(b, f, st)      [ECU] 12.03: the chrome armrest: Ep1's party toast in it for 2 s (st.toast), then only
//                             the empty seat
//   drawChatFace(b, x, y, st) CHATGTP at the big screen's size (150 x 112, Ep1's ECU bubble): st.grow 0..3 (ears, eyes,
//                             a mouth, one held step each), st.mouth 'rest' | 'talk' | 'three' (the harmony), st.tokens
//                             (the 5 GLYPH frames: its eyes as tokens toward the wings), st.emoji (😊), st.badge
//   voicePanel(b, x, y, st)   sc 9.06: the settings panel VOICE · VOICE 1..5 · SINCE SEP 2023, st.hover (the slot
//                             saying hello), st.unfold 0..10 (it keeps unfolding square by square onto a drafting grid)
import {Buf, rect, line, ellipse, bayer, hash, clamp, poly} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {drawChatBubble, CHAT_BUBBLE} from '../../../../../shared/pixel/cast/chatgtp';
import {partyToast} from '../../../../ep01/pixel/act3/art/party';
import {fill, pt, pw, pwrap, bpt, bpw, tiny, tinyWidth, vramp, dith, RH, TR} from '../kit';
import {crowdBacks, seatedStaff} from '../cast/civic2';
import {blitImg} from '../../../../../shared/pixel/figure';
import type {ArtAsset} from '../asset';

// ------------------------------------------------------------------ CHATGTP's Ep2 face
export interface ChatFaceSt { grow?: 0 | 1 | 2 | 3; mouth?: 'rest' | 'talk' | 'three'; tokens?: boolean; emoji?: boolean; badge?: boolean; f?: number; hand?: boolean; band?: boolean }
export const drawChatFace = (b: Buf, x: number, y: number, st: ChatFaceSt = {}) => {
  const g = st.grow ?? 3, f = st.f ?? 0;
  const S = CHAT_BUBBLE.ecu, bw = S.w, bh = S.h - 16;
  // the ears first (behind the bubble): two rounded tabs on the top corners
  if (g >= 1) for (const ex of [x + 18, x + bw - 18]) { ellipse(ex, y + 4, 12, 10, b.ink(PAL.N0)); ellipse(ex, y + 4, 11, 9, b.ink(PAL.C6)); ellipse(ex, y + 5, 7, 5, b.ink(PAL.P1)); }
  drawChatBubble(b, x, y, {size: 'ecu', state: 'lit', f});
  // wipe the Ep1 face (dots and the typing mouth) so the Ep2 one can grow in its place
  for (let j = 18; j < bh - 8; j++) for (let i = 14; i < bw - 14; i++) { const c = b.get(x + i, y + j); if (c === PAL.N0 || c === PAL.C8 || c === PAL.G4 || c === PAL.G3 || c === PAL.C4) b.set(x + i, y + j, j > bh * 0.7 ? PAL.P1 : PAL.P2); }
  const ey = y + Math.round(bh * 0.38), ex = [x + Math.round(bw * 0.33), x + Math.round(bw * 0.63)];
  if (g >= 2) for (const e of ex) {
    if (st.tokens) { for (let r = 0; r < 3; r++) for (let i = -6; i < 6; i++) if (((i + r * 3 + f) & 3) !== 3) b.set(e + i - 3, ey - 3 + r * 3, r === 1 ? PAL.C8 : PAL.C6); continue; }
    ellipse(e, ey, 5, 6, b.ink(PAL.N0)); b.set(e - 2, ey - 3, PAL.C8); b.set(e - 1, ey - 3, PAL.C8); b.set(e - 2, ey - 2, PAL.C8);
  }
  const my = y + Math.round(bh * 0.68), mcx = x + Math.round(bw * 0.48);
  if (g >= 3) {
    if (st.emoji) {
      // 😊: the eyes closed into arcs, the cheeks blushing, a wide smile
      for (const e of ex) { fill(b, e - 6, ey - 6, 13, 13, PAL.P2); for (let i = -5; i <= 5; i++) b.set(e + i, ey + 1 - Math.round(Math.sqrt(Math.max(0, 25 - i * i)) * 0.5), PAL.N0); fill(b, e - 4, ey + 6, 9, 3, PAL.U5); }
      for (let i = -14; i <= 14; i++) { const yy = my + Math.round((1 - (i * i) / 196) * 6); b.set(mcx + i, yy, PAL.N0); b.set(mcx + i, yy + 1, PAL.N0); }
    } else if (st.mouth === 'three') {
      // three mouths harmonising, stacked: each an open O on a different note
      for (let k = 0; k < 3; k++) { const ox = mcx - 22 + k * 22, oy = my - 2 + ((k + Math.floor(f / 6)) % 3) * 2; ellipse(ox, oy, 5, 4 + k % 2, b.ink(PAL.N0)); ellipse(ox, oy + 1, 3, 2, b.ink(PAL.R2)); }
    } else {
      const open = st.mouth === 'talk' ? [1, 4, 2, 5][Math.floor(f / 3) % 4] : 0;
      for (let i = -12; i <= 12; i++) { const yy = my + Math.round((1 - (i * i) / 144) * 3); b.set(mcx + i, yy, PAL.N0); if (open) for (let q = 1; q <= Math.round(open * (1 - (i * i) / 144)); q++) b.set(mcx + i, yy + q, q === 1 ? PAL.R1 : PAL.N1); }
    }
  }
  if (st.hand) { fill(b, x - 10, y + bh - 30, 10, 14, PAL.P2); for (let k = 0; k < 4; k++) fill(b, x - 10 + k * 3, y + bh - 36, 2, 7, PAL.P2); fill(b, x - 10, y + bh - 30, 1, 14, PAL.C6); }
  if (st.band) { fill(b, x + 10, y + bh + 4, 22, 6, PAL.W7); tiny(b, 'GUEST', x + 12, y + bh + 5, PAL.N1); }
};
/** the VOICE 5 badge in the screen's corner */
export const voice5Badge = (b: Buf, x: number, y: number, paused = false) => { fill(b, x, y, 44, 11, paused ? PAL.G3 : PAL.N1); fill(b, x, y, 44, 1, paused ? PAL.G5 : PAL.C5); pt(b, 'VOICE 5', x + 3, y + 2, paused ? PAL.G5 : PAL.P2); };

// ------------------------------------------------------------------ the VOICE panel
export const voicePanel = (b: Buf, x: number, y: number, st: {hover?: number; unfold?: number; said?: number} = {}) => {
  const w = 170, h = 120;
  fill(b, x - 1, y - 1, w + 2, h + 2, PAL.N0); fill(b, x, y, w, h, PAL.N2); fill(b, x, y, w, 12, PAL.N3); pt(b, 'VOICE', x + 6, y + 3, PAL.P2);
  tiny(b, 'SINCE SEP 2023', x + w - tinyWidth('SINCE SEP 2023') - 6, y + 4, PAL.N7);
  const hellos = ['Hi.', 'Hi!', 'hi?', 'Hi…', 'Hey.'];
  for (let i = 0; i < 5; i++) {
    const sy = y + 18 + i * 20, on = st.hover === i;
    fill(b, x + 6, sy, w - 12, 16, on ? PAL.C1 : PAL.N1); fill(b, x + 6, sy, 2, 16, on ? PAL.C6 : PAL.N4);
    pt(b, `VOICE ${i + 1}`, x + 12, sy + 4, on ? PAL.P2 : PAL.P1);
    // the waveform; the hello said in a bubble when hovered
    for (let k = 0; k < 18; k++) { const hgt = 1 + Math.round(hash(i, k, 3) * (on ? 6 : 3)); fill(b, x + 70 + k * 3, sy + 8 - Math.floor(hgt / 2), 2, hgt, on ? PAL.C6 : PAL.N5); }
    if ((st.said ?? -1) >= i) pt(b, hellos[i], x + w - 34, sy + 4, i === 4 ? PAL.C8 : PAL.C6);
  }
  // unfolding past the bezel: squares of the panel's grid dropping down onto a drafting grid
  const n = st.unfold ?? 0;
  for (let k = 0; k < n; k++) { const sx = x + (k % 5) * 34, sy = y + h + 4 + Math.floor(k / 5) * 34; fill(b, sx, sy, 32, 32, PAL.N2); for (let q = 0; q < 32; q += 8) { fill(b, sx + q, sy, 1, 32, PAL.C3); fill(b, sx, sy + q, 32, 1, PAL.C3); } }
};

// ------------------------------------------------------------------ the wings (sc 9)
const WORK = [PAL.N0, PAL.W0, PAL.W1, PAL.W2, PAL.W3, PAL.W4, PAL.W5];
const roadCase = (b: Buf, x: number, y: number, w: number, h: number) => {
  fill(b, x, y, w, h, PAL.N1); fill(b, x, y, w, 2, PAL.W2); fill(b, x, y, 3, h, PAL.G2); fill(b, x + w - 3, y, 3, h, PAL.G2); fill(b, x, y + h - 3, w, 3, PAL.G2);
  for (const [cx, cy] of [[x + 1, y + 1], [x + w - 4, y + 1], [x + 1, y + h - 4], [x + w - 4, y + h - 4]]) fill(b, cx, cy, 3, 3, PAL.G4);
  fill(b, x + (w >> 1) - 6, y + (h >> 1) - 2, 12, 4, PAL.G3);
};
export interface WingsSt { screen?: (b: Buf, r: {x: number; y: number; w: number; h: number}) => void; rimaSpot?: [number, number] | null; gerg?: boolean }
export const wings = (b: Buf, f: number, st: WingsSt = {}, cast: {mid?: (b: Buf) => void; front?: (b: Buf) => void} = {}) => {
  // backstage: black flats, a work light's warm pool, cables snaking across the deck
  vramp(b, 0, 0, 480, RH, [PAL.N0, PAL.N1, PAL.N1, PAL.W0]);
  for (let x = 0; x < 480; x += 40) fill(b, x, 0, 3, 150, PAL.N0);
  fill(b, 0, 150, 480, RH - 150, PAL.N1); for (let x = 0; x < 480; x += 2) if (hash(x, 1, 3) < 0.4) b.set(x, 150, PAL.W1);
  // the work light (a caged bulb on a stand, far left) and its pool
  fill(b, 40, 40, 2, 110, PAL.G2); fill(b, 34, 34, 14, 8, PAL.G3); fill(b, 36, 42, 10, 3, PAL.W8);
  for (let y = 40; y < RH; y++) for (let x = 0; x < 200; x++) { const d = Math.hypot((x - 42) / 170, (y - 120) / 90); if (d < 1 && bayer(x, y) < (1 - d) * 0.6) b.set(x, y, stepColor(b.get(x, y), 2) === b.get(x, y) ? WORK[3] : stepColor(b.get(x, y), 1)); }
  // cables
  for (let k = 0; k < 4; k++) { let yy = 160 + k * 9; for (let x = 0; x < 480; x++) { yy += Math.round(Math.sin(x / (20 + k * 7) + k) * 0.6); b.set(x, yy, PAL.N0); b.set(x, yy - 1, k % 2 ? PAL.W1 : PAL.N2); } }
  // road cases (stacked, far side)
  roadCase(b, 110, 106, 60, 44); roadCase(b, 118, 78, 44, 28); roadCase(b, 300, 112, 50, 38);
  // the monitor screen-right on a stand, its picture
  fill(b, 372, 50, 92, 62, PAL.N0); fill(b, 372, 50, 92, 1, PAL.G2); fill(b, 416, 112, 4, 38, PAL.G2); fill(b, 400, 148, 36, 3, PAL.G2);
  if (st.screen) st.screen(b, {x: 375, y: 53, w: 86, h: 56}); else fill(b, 375, 53, 86, 56, PAL.N2);
  // Rima's hard circular spot, even back here
  if (st.rimaSpot) { const [cx, cy] = st.rimaSpot; for (let y = cy - 46; y < cy + 46; y++) for (let x = cx - 30; x < cx + 30; x++) { const d = Math.hypot((x - cx) / 28, (y - cy) / 44); if (d < 1) b.set(x, y, stepColor(b.get(x, y), d < 0.92 ? 3 : bayer(x, y) < 0.5 ? 2 : 1)); } }
  cast.mid?.(b);
  // Gerg's road case in the foreground (the cast puts Gerg on it)
  if (st.gerg !== false) roadCase(b, 200, 168, 90, 35);
  cast.front?.(b);
};

// ------------------------------------------------------------------ the stage from mid-house (sc 11, locked)
export interface StageSt { spot?: 0 | 1 | 2 | 3; screen?: ChatFaceSt & {live?: 'live' | 'ended' | 'dark'; chat?: number; badge?: boolean}; house?: 'full' | 'emptying' | 'empty'; lights?: 0 | 1 | 2; phones?: 'down' | 'up' | 'swung'; rig?: boolean }
export const STAGE = {floor: 128, screen: {x: 250, y: 18, w: 190, h: 104}, rimaMark: [196, 126] as [number, number], engMark: [330, 128] as [number, number], wings: {x0: 0, x1: 70}};
export const stageWide = (b: Buf, f: number, st: StageSt = {}, cast: {stage?: (b: Buf) => void; house?: (b: Buf) => void} = {}) => {
  const s = {spot: 0 as 0 | 1 | 2 | 3, house: 'full' as StageSt['house'], lights: 0 as 0 | 1 | 2, phones: 'down' as StageSt['phones'], rig: true, ...st};
  const L = s.lights;
  // the stage: black masking, a clean floor, the wings' edge at frame left (Mas's stage right)
  vramp(b, 0, 0, 480, STAGE.floor, L ? [PAL.N2, PAL.N3, PAL.N3] : [PAL.N0, PAL.N1, PAL.N1]);
  fill(b, 0, STAGE.floor, 480, 16, L ? PAL.N4 : PAL.N2); fill(b, 0, STAGE.floor, 480, 1, PAL.N5);
  fill(b, 0, 0, STAGE.wings.x1, STAGE.floor, PAL.N0); fill(b, STAGE.wings.x1, 0, 3, STAGE.floor, PAL.N2);
  // the lighting rig across the top (the truss, the cans)
  if (s.rig) { fill(b, 60, 6, 420, 4, PAL.G2); for (let x = 64; x < 476; x += 6) line(x, 6, x + 3, 9, b.ink(PAL.G3)); for (let x = 90; x < 470; x += 36) { fill(b, x, 10, 6, 7, PAL.N0); fill(b, x + 1, 16, 4, 1, L ? PAL.W5 : PAL.W3); } }
  // the big screen
  const S = STAGE.screen;
  fill(b, S.x - 4, S.y - 4, S.w + 8, S.h + 8, PAL.N0);
  const sc = s.screen ?? {};
  if (sc.live === 'dark') fill(b, S.x, S.y, S.w, S.h, PAL.N1);
  else {
    vramp(b, S.x, S.y, S.w, S.h, [PAL.F2, PAL.F3, PAL.F3]);
    drawChatFace(b, S.x + 20, S.y + 6, {f, ...sc});
    if (sc.badge !== false) voice5Badge(b, S.x + S.w - 48, S.y + S.h - 14);
    // the stream's chrome: LIVE -> ENDED, and the chat scrolling up its right edge
    const live = sc.live ?? 'live';
    fill(b, S.x + 3, S.y + 3, 26, 9, live === 'live' ? PAL.R2 : PAL.G3); pt(b, live === 'live' ? 'LIVE' : 'ENDED', S.x + 5, S.y + 4, PAL.P2);
    if (sc.chat) { const msgs = ['wow', 'lol', 'her?', 'so fast', 'is it free', "what's the catch?", 'omg', 'again!']; for (let k = 0; k < 6; k++) { const m = msgs[(k + sc.chat) % msgs.length]; tiny(b, m.toUpperCase().slice(0, 12), S.x + S.w - 52, S.y + 18 + k * 9, m === "what's the catch?" ? PAL.W8 : PAL.N7); } }
  }
  // the spotlight: a hard circle on the stage floor and a cone, sliding one step per laugh from Rima to the screen
  const spotX = [STAGE.rimaMark[0], 214, 236, 262][s.spot];
  for (let y = 20; y < STAGE.floor + 16; y++) { const t = (y - 20) / (STAGE.floor - 4); const hw = 4 + t * 22; for (let x = Math.round(spotX - hw); x <= spotX + hw; x++) if (bayer(x, y) < 0.22) b.set(x, y, stepColor(b.get(x, y), 1)); }
  for (let y = STAGE.floor - 4; y < STAGE.floor + 10; y++) for (let x = spotX - 28; x <= spotX + 28; x++) { const d = Math.hypot((x - spotX) / 28, (y - STAGE.floor - 3) / 7); if (d < 1) b.set(x, y, stepColor(b.get(x, y), 3)); }
  cast.stage?.(b);
  // the house: the tiled audience (backs), the press row's screens, the wall of raised phones
  const rows = s.house === 'empty' ? 0 : s.house === 'emptying' ? 2 : 4;
  const houseTop = 150;
  fill(b, 0, STAGE.floor + 16, 480, RH - STAGE.floor - 16, L === 2 ? PAL.N3 : L ? PAL.N2 : PAL.N0);
  for (let r = 0; r < 4; r++) { const yy = houseTop + r * 13; for (let x = 0; x < 480; x += 13) { fill(b, x, yy + 10, 11, 3, L ? PAL.R1 : PAL.R0); } }
  if (rows) crowdBacks(b, 4, 480, houseTop - 4, rows, f, {seed: 4, phones: s.phones === 'down' ? [] : [0, 2, 4, 6], dim: L ? 0 : 1});
  cast.house?.(b);
};

// ------------------------------------------------------------------ the front row (sc 12)
export const frontRow = (b: Buf, f: number, st: {rope?: boolean} = {}) => {
  // plain house light, the empty house beyond, the roped first row seen from the wings (screen-left), the placard
  vramp(b, 0, 0, 480, RH, [PAL.N3, PAL.N4, PAL.N4]);
  for (let r = 0; r < 5; r++) for (let x = -20 + r * 8; x < 480; x += 30) { const y = 40 + r * 22; fill(b, x, y, 24, 14, PAL.R1); fill(b, x, y, 24, 2, PAL.R2); fill(b, x + 2, y + 14, 20, 6, PAL.R0); }
  // the first row, large: seats with chrome armrests; the reserved one in the middle, its placard
  for (let k = 0; k < 4; k++) {
    const x = 20 + k * 120, y = 130;
    fill(b, x, y - 50, 90, 50, PAL.R1); fill(b, x, y - 50, 90, 4, PAL.R2); fill(b, x + 4, y, 82, 30, PAL.R0); fill(b, x + 4, y, 82, 3, PAL.R1);
    fill(b, x - 8, y - 6, 10, 40, PAL.G4); fill(b, x - 8, y - 6, 10, 2, PAL.G6); fill(b, x - 7, y - 4, 2, 36, PAL.G6);
    if (k === 2) { fill(b, x + 14, y - 34, 60, 22, PAL.P2); fill(b, x + 14, y - 34, 60, 1, PAL.W9); pt(b, 'RESERVED:', x + 18, y - 31, PAL.N1); tiny(b, 'CHIEF SCIENTIST', x + 16, y - 21, PAL.N1); }
  }
  if (st.rope !== false) { for (const px of [4, 470]) { fill(b, px, 120, 4, 70, PAL.W5); ellipse(px + 2, 118, 4, 4, b.ink(PAL.W6)); } for (let x = 8; x < 470; x++) b.set(x, 136 + Math.round(Math.sin((x - 8) / 462 * Math.PI) * 10), PAL.R2); }
};
export const armrestECU = (b: Buf, f: number, st: {toast?: boolean}) => {
  // the chrome armrest fills the frame: a bright curved band; in it, for 2 s, Ep1's party toast (reflected: mirrored,
  // squeezed into the curve, cooled); then only the empty seat's red
  vramp(b, 0, 0, 480, RH, [PAL.R0, PAL.R1, PAL.R0]);
  const top = 40, bot = 160;
  const chrome = new Buf(480, 270, PAL.N0);
  if (st.toast) partyToast(chrome, 60, {k: 60, toast: 0, laugh: 10, down: 999});
  for (let y = top; y < bot; y++) for (let x = 0; x < 480; x++) {
    const v = (y - top) / (bot - top);
    const band = v < 0.08 ? PAL.G6 : v > 0.92 ? PAL.G2 : null;
    if (band) { b.set(x, y, band); continue; }
    // the reflection: the source mirrored horizontally and bent with the armrest's curve
    let c: number;
    if (st.toast) { const sx = 479 - x, sy = Math.round(20 + ((y - top) / (bot - top)) * 170 + Math.sin((x / 480) * Math.PI) * 6); c = chrome.c[clamp(sy, 0, 202) * 480 + sx]; c = stepColor(c, 1); }
    else c = (y - top) % 20 < 10 ? PAL.R2 : PAL.R1;
    b.set(x, y, c);
  }
  for (let x = 0; x < 480; x += 3) { b.set(x, top + 6, PAL.P2); b.set(x, bot - 7, PAL.G3); }
};

export const ART: ArtAsset[] = [
  {
    id: 'set10-stage', manifest: 'SET-10 · the demo stage: the wings, the stage from the house, the front row', kind: 'set', name: 'The demo stage: the wings (work light), the locked wide (the spotlight\'s meter frame), the front row',
    file: 'sets/stage.ts', exports: 'wings, stageWide, STAGE, frontRow, armrestECU', scenes: '9, 11, 12',
    note: 'the wings in work light, road cases, the monitor; the big screen with LIVE -> ENDED and the chat; the spot slides a step per laugh; RESERVED: CHIEF SCIENTIST never flips',
    stills: [
      {label: '[W] 9.01: the wings in work light: road cases, cables, the monitor (CHATGTP a plain bubble), Rima\'s hard spot, Gerg\'s road case', draw: (b) => wings(b, 0, {rimaSpot: [250, 108], screen: (bb, r) => { fill(bb, r.x, r.y, r.w, r.h, PAL.F2); drawChatBubble(bb, r.x + 26, r.y + 14, {size: 'screen', state: 'lit'}); }})},
      {label: '[W] 11.04: the locked wide: Rima\'s spot one step toward the screen, the face grown, VOICE 5, LIVE, the house full', draw: (b) => stageWide(b, 0, {spot: 1, screen: {grow: 3, mouth: 'talk', chat: 0}})},
      {label: '[W] 11.13: ENDED; the house lights up a step, the house emptying, the phones raised and swung', draw: (b) => stageWide(b, 0, {spot: 3, lights: 1, house: 'emptying', phones: 'swung', screen: {grow: 3, live: 'ended'}})},
      {label: '[W] 12.02 the front row in plain house light, the placard (it never flips)', draw: (b) => frontRow(b, 0)},
      {label: '[ECU] 12.03 the chrome armrest: Ep1\'s toast in it for 2 s', draw: (b) => armrestECU(b, 0, {toast: true})},
    ],
  },
  {
    id: 'char-chatgtp-ep2', manifest: '§2.1 CHATGTP (its Ep2 face) · §3 the VOICE panel', kind: 'character', name: 'CHATGTP\'s Ep2 face and the VOICE panel',
    file: 'sets/stage.ts', exports: 'drawChatFace, voice5Badge, voicePanel', scenes: '9, 11, 17, 19',
    note: 'ears, eyes and a mouth in three held steps; three mouths for the harmony; token eyes (5 frames); 😊; a raised hand and the GUEST band (the garden); the panel of five voices',
    stills: [{label: 'grow 0..3 · talking · the harmony (three mouths) · token eyes · 😊 · the garden (hand, GUEST band) · the VOICE panel, VOICE 5 saying Hey.', draw: (b) => {
      vramp(b, 0, 0, 480, 203, [PAL.F1, PAL.F2, PAL.F2]);
      const sm = (gx: number, gy: number, st: ChatFaceSt) => { const t = new Buf(480, 270, TR); drawChatFace(t, 20, 20, st); for (let y = 0; y < 150; y += 2) for (let x = 0; x < 190; x += 2) { const v = t.c[(y) * 480 + x]; if (v !== TR) b.set(gx + x / 2, gy + y / 2, v); } };
      sm(0, 0, {grow: 0}); sm(80, 0, {grow: 1}); sm(160, 0, {grow: 2}); sm(240, 0, {grow: 3, mouth: 'talk', f: 3});
      sm(0, 80, {grow: 3, mouth: 'three'}); sm(80, 80, {grow: 3, tokens: true}); sm(160, 80, {grow: 3, emoji: true}); sm(240, 80, {grow: 3, hand: true, band: true});
      voicePanel(b, 304, 10, {hover: 4, said: 4, unfold: 0});
    }}],
  },
];
void rect; void poly; void dith; void pwrap; void bpt; void bpw; void seatedStaff; void blitImg;
