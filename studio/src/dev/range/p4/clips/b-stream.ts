// MR. MAS · prototype 4 · 4b · P5 STREAM · the chart crime (5.I, Ep5 #24). Reel frames p180-359.
//   p180-194 the bullpen (rooms/bullpen.ts): NopeAI's launch stream small on the conference room's wall screen,
//            behind the glass; a staffer at the glass is watching it
//   p195     cut in on the beat, over the staffer's shoulder: the conference room through the glass at native density
//            (the screen ~3.7x bigger, the page on it, the glass's sheen and frosted band between us and it)
//   p210-314 IN: cut to the stream on the beat; it fills the room area. A launch-stream page: the video (a bright
//            studio, Mas presenting beside a slide), a chat column arriving in held steps, a LIVE tag and a viewer
//            count. The slide's chart: GTP-5's bar towers over the old model's, and its number is the smaller one.
//            Honest compression: chroma shared across 2x2 blocks in the video, and ONE macroblock drift on the
//            chart's fast build (a stale picture, never a glitch)
//   p315-359 OUT: cut back over his shoulder, the chart on the screen now. On the beat he leans in to the glass and
//            squints at it (his profile lit by the screen). Land on the face
import {Buf, rect, line, bayer, hash} from '../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../shared/pixel/palette';
import {text, textWidth, bigText, bigTextWidth} from '../../../../shared/pixel/font';
import {blitImg, Img, LightRig, P, Part, renderFigure, FigureDef, Stamp} from '../../../../shared/pixel/figure';
import {memo} from '../../../../shared/pixel/cast/kit';
import {flipImg} from '../../../../shared/pixel/cast/kit'; // (sprite.ts flipImg clips to the unflipped silhouette)
import {drawBullpen, walkoutExtra, EXTRA_H} from '../../../../shared/pixel/rooms/bullpen';
import {masStand, MAS_STAND_DEFAULT, MAS_STAND_FOOT} from '../../../../shared/pixel/cast/mas-stand';
import {tiny, tinyWidth} from '../../../../shared/pixel/rooms/kit-b';
import {miniature, softChroma, macroblockDrift} from '../passes/device';
import {osdText, osdWidth} from '../passes/osdfont';
import {tag, commas, plate} from '../passes/osd';
import {WIDE, View} from '../passes/present';

export const B0 = 180, B_OTS = 195, B_IN = 210, B_OUT = 315, B_LEAN = 330, B1 = 360;
/** the conference room's wall screen in the bullpen (rooms/bullpen.ts paints it dark at 150,60 50x28) */
const SCREEN = {x: 151, y: 61, w: 48, h: 26};
const SCREEN_C: [number, number] = [SCREEN.x + SCREEN.w / 2, SCREEN.y + SCREEN.h / 2];

// ------------------------------------------------------------------ the stream page (480 x 203)
const VID = {x: 6, y: 6, w: 296, h: 166};
const CHAT = {x: 308, y: 6, w: 166, h: 190};
export const CHART_AT = 240; // the slide changes to the chart (the fast move)
// the chat: excited before the chart, confused after it, and one person names it. Never a chorus explaining the joke
const CHAT_LINES: Array<[number, string, string, number]> = [
  // [reel frame, handle, message, handle colour]
  [186, 'tensor_tom', 'its starting', PAL.C6],
  [198, 'grad_student', 'hi from lab 3', PAL.W6],
  [212, 'kv_cache', 'gtp-5 day', PAL.L3],
  [224, 'nullpointer', 'lets goooo', PAL.F6],
  [233, 'wetware', 'first', PAL.R3],
  [254, 'epochs', '??', PAL.W7],
  [264, 'tensor_tom', 'wait', PAL.C6],
  [276, 'mlops_mom', 'go back a slide', PAL.L3],
  [289, 'lurker_91', '...', PAL.F6],
  [300, 'kv_cache', 'chart crime', PAL.L3],
];
/** the chat bursts (for the sound pass: one soft tick each) */
export const CHAT_TICKS = CHAT_LINES.filter((c) => c[0] >= B_IN && c[0] < B_OUT).map((c) => c[0]);

const drawSlide = (b: Buf, x0: number, y0: number, w: number, h: number, f: number) => {
  // the big screen on the set: a near-black panel with a thin bezel; the slide's own white-on-dark design
  rect(x0 - 2, y0 - 2, w + 4, h + 4, b.ink(PAL.N0));
  rect(x0, y0, w, h, b.ink(PAL.N1));
  if (f < CHART_AT) {
    // the title slide
    const t = 'GTP-5';
    bigText(b, t, x0 + Math.round((w - bigTextWidth(t)) / 2), y0 + Math.round(h / 2) - 12, PAL.P2);
    const s = 'our smartest model yet';
    text(b, s, x0 + Math.round((w - textWidth(s)) / 2), y0 + Math.round(h / 2) + 8, PAL.G5);
    return;
  }
  // the chart: two bars on a baseline, each with its number over it; the build rises in held steps over 6 frames
  const k = Math.min(1, (f - CHART_AT + 1) / 6);
  text(b, 'accuracy', x0 + 8, y0 + 6, PAL.G5);
  const base = y0 + h - 16;
  rect(x0 + 8, base, w - 16, 1, b.ink(PAL.G3));
  const bars: Array<{label: string; num: string; hgt: number; col: number; hi: number; x: number}> = [
    {label: 'GTP-5', num: '52.8', hgt: 58, col: PAL.C5, hi: PAL.C7, x: x0 + 18},
    {label: 'OLD MODEL', num: '69.1', hgt: 18, col: PAL.G3, hi: PAL.G4, x: x0 + w - 18 - 56},
  ];
  for (const bar of bars) {
    const hh = Math.round(bar.hgt * k);
    rect(bar.x, base - hh, 56, hh, b.ink(bar.col));
    rect(bar.x, base - hh, 56, 1, b.ink(bar.hi));
    if (k >= 1) bigText(b, bar.num, bar.x + 28 - Math.round(bigTextWidth(bar.num) / 2), base - hh - 17, PAL.P2);
    text(b, bar.label, bar.x + 28 - Math.round(textWidth(bar.label) / 2), base + 3, PAL.G6);
  }
};

const drawVideo = (b: Buf, f: number) => {
  const V = VID;
  // the launch set: a bright, clean studio (the company's own show looks nothing like its office at night)
  for (let y = V.y; y < V.y + V.h; y++) for (let x = V.x; x < V.x + V.w; x++) {
    const floor = y > V.y + 128;
    const t = (x - V.x) / V.w;
    b.set(x, y, floor ? ((y - V.y) % 6 === 0 ? PAL.D3 : PAL.D4) : t < 0.35 ? (bayer(x, y) < 0.3 ? PAL.G5 : PAL.G6) : PAL.G6);
  }
  rect(V.x, V.y + 128, V.w, 1, b.ink(PAL.G4));
  for (let x = V.x; x < V.x + V.w; x++) if (bayer(x, V.y + 131) < 0.5) b.set(x, V.y + 131, PAL.W3);
  // a plant and a low planter at the left edge of the set (someone's idea of warmth)
  rect(V.x + 14, V.y + 112, 16, 17, b.ink(PAL.P0));
  rect(V.x + 14, V.y + 112, 16, 1, b.ink(PAL.P1));
  for (const [dx, dy, ex, ey] of [[22, 112, 12, 88], [22, 112, 24, 82], [22, 112, 32, 92], [22, 112, 18, 96], [22, 112, 29, 99]]) line(V.x + dx, V.y + dy, V.x + ex, V.y + ey, b.ink(PAL.L2));
  // the big screen with the slide
  drawSlide(b, V.x + 112, V.y + 14, 176, 110, f);
  // Mas presenting, stage left of the screen: talking, then (the chart up) a hand toward it, pleased
  const mas = masStand({...MAS_STAND_DEFAULT, arm: f >= CHART_AT + 2 ? 'reach' : 'down', light: 'room', mouth: f >= CHART_AT + 8 && f < CHART_AT + 40 ? 'smile' : Math.floor(f / 5) % 3 === 1 && f < CHART_AT + 8 ? 'open' : 'rest'});
  const fx = V.x + 78, fy = V.y + 144;
  for (let i = -10; i <= 10; i++) b.set(fx + i, fy + 1, stepColor(b.get(fx + i, fy + 1), -1));
  blitImg(b, mas, fx - MAS_STAND_FOOT[0], fy - MAS_STAND_FOOT[1]);
  tag(b, 'LIVE', V.x + 6, V.y + 6, PAL.R2, PAL.P2, PAL.N0);
};

const drawChat = (b: Buf, f: number) => {
  const C = CHAT;
  rect(C.x, C.y, C.w, C.h, b.ink(PAL.N2));
  rect(C.x, C.y, C.w, 15, b.ink(PAL.N3));
  rect(C.x, C.y + 15, C.w, 1, b.ink(PAL.N1));
  text(b, 'Live chat', C.x + 6, C.y + 4, PAL.G6);
  // viewer count, ticking up in held steps (every beat)
  const v = 1284019 + Math.floor((f - 180) / 15) * 3131 + Math.max(0, Math.floor((f - 256) / 15)) * 9044;
  const vs = commas(v) + ' watching';
  rect(C.x + C.w - tinyWidth(vs) - 14, C.y + 5, 3, 3, b.ink(PAL.R3));
  tiny(b, vs, C.x + C.w - tinyWidth(vs) - 8, C.y + 4, PAL.G4);
  // messages: newest at the bottom; each arrival pushes the column up (a held step, no scroll easing)
  const shown = CHAT_LINES.filter((c) => c[0] <= f);
  const lineH = 13, bottom = C.y + C.h - 23;
  const visible = shown.slice(-12);
  visible.forEach(([t0, handle, msg, hc], i) => {
    const y = bottom - (visible.length - 1 - i) * lineH;
    if (y < C.y + 18) return;
    if (f - t0 < 4) rect(C.x + 2, y - 2, C.w - 4, lineH, b.ink(PAL.N3));
    rect(C.x + 5, y + 1, 5, 5, b.ink(stepColor(hc, -3)));
    tiny(b, handle, C.x + 13, y + 1, hc);
    text(b, msg, C.x + 13 + tinyWidth(handle) + 4, y - 1, PAL.G6);
  });
  rect(C.x + 4, C.y + C.h - 16, C.w - 8, 12, b.ink(PAL.N1));
  text(b, 'Say something...', C.x + 9, C.y + C.h - 14, PAL.N5);
};

const drawTitleRow = (b: Buf) => {
  const y = VID.y + VID.h + 6;
  for (let j = -5; j <= 5; j++) for (let i = -5; i <= 5; i++) if (i * i + j * j <= 25) b.set(VID.x + 7 + i, y + 7 + j, i * i + j * j <= 9 ? PAL.C6 : PAL.C4);
  text(b, 'GTP-5 Livestream', VID.x + 18, y + 1, PAL.P2);
  tiny(b, 'NOPEAI', VID.x + 18, y + 12, PAL.G4);
  tiny(b, 'STARTED STREAMING 12 MIN AGO', VID.x + 18 + tinyWidth('NOPEAI') + 8, y + 12, PAL.N6);
};

/** the stream picture as the device renders it: page + video, then the codec's two honest artefacts */
export const drawStream = (b: Buf, f: number, codec = true) => {
  rect(0, 0, 480, 203, b.ink(PAL.N1));
  drawVideo(b, f);
  drawChat(b, f);
  drawTitleRow(b);
  if (!codec) return;
  softChroma(b, VID.x, VID.y, VID.w, VID.h);
  // one macroblock drift on the chart's fast build, one frame: a few blocks on the rising bars still carry the
  // previous frame's bar tops (the encoder's stale motion vectors lag the move by two pixels)
  if (f === CHART_AT + 2) {
    const prev = new Buf(480, 203, PAL.N1);
    drawStream(prev, f - 1, false);
    const sx0 = VID.x + 112, sy0 = VID.y + 14;
    macroblockDrift(b, prev, sx0, sy0, 176, 110, 0, 2, (bx, by) => {
      const bar = (bx - sx0 >= 16 && bx - sx0 < 76) || (bx - sx0 >= 100 && bx - sx0 < 160);
      return bar && by - sy0 > 30 && by - sy0 + 8 <= 94 && hash(bx >> 3, by >> 3, 5) < 0.55;
    });
  }
};

// ------------------------------------------------------------------ the bullpen with the stream on its wall screen
const STAFFER = {footX: 262, footY: 197};
let STAFF_IMG: Img | null = null;
const staffer = () => {
  if (!STAFF_IMG) STAFF_IMG = flipImg(walkoutExtra(11, {box: false, coat: 2}));
  return STAFF_IMG;
};
/** the staffer's hair colour, read from his drawing (the OTS silhouette matches him) */
const stafferHair = () => {
  const img = walkoutExtra(11, {box: false, coat: 2});
  for (let j = 0; j < 6; j++) for (let i = 0; i < img.w; i++) { const c = img.c[j * img.w + i]; if (c >= 0) return c; }
  return PAL.B1;
};
const drawBullpenShot = (b: Buf, f: number) => {
  drawBullpen(b, f, {});
  const page = new Buf(480, 203, PAL.N1);
  drawStream(page, f);
  miniature(page, 0, 0, 480, 203, b, SCREEN.x, SCREEN.y, SCREEN.w, SCREEN.h);
  for (let y = SCREEN.y; y < SCREEN.y + SCREEN.h; y++) for (let x = SCREEN.x; x < SCREEN.x + SCREEN.w; x++) {
    let c = stepColor(b.get(x, y), -1);
    const u = (x - SCREEN.x) + (y - SCREEN.y) * 0.55;
    if ((u > 30 && u < 34) || (u > 40 && u < 41.5)) c = stepColor(c, 1); // the glass's sheen crosses it
    b.set(x, y, c);
  }
  for (let y = SCREEN.y - 8; y < SCREEN.y + SCREEN.h + 40; y++) for (let x = SCREEN.x - 14; x < SCREEN.x + SCREEN.w + 14; x++) {
    if (x >= SCREEN.x && x < SCREEN.x + SCREEN.w && y >= SCREEN.y && y < SCREEN.y + SCREEN.h) continue;
    if (x < 134 || x > 272) continue;
    const d = Math.hypot((x - SCREEN_C[0]) / 40, (y - SCREEN_C[1]) / 36);
    if (d < 1 && bayer(x, y) < (1 - d) * 0.6) b.set(x, y, stepColor(b.get(x, y), 1));
  }
  blitImg(b, staffer(), STAFFER.footX - 15, STAFFER.footY - EXTRA_H + 1);
};

// ------------------------------------------------------------------ over his shoulder, through the glass
/**
 * The cut-in: the conference room through the glass wall at native density (the camera has moved, not magnified).
 * The wall screen is ~3.7x the wide's, with its bezel and glow; the table's edge and two chair backs under it; the
 * glass between us and it carries two sheen streaks, a mullion and the frosted privacy band. The staffer is the dark
 * head and shoulder in the right foreground, rim-lit by the screen: the back of his head, then (lean) his profile,
 * leaning in toward the glass, squinting at the chart.
 */
const OTS_SCREEN = {x: 58, y: 34, w: 190, h: 80};
const drawOTS = (b: Buf, f: number, lean: boolean) => {
  // the conference room's back wall, a rung under the bullpen, lit by the screen
  for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) b.set(x, y, y < 10 ? PAL.G2 : bayer(x, y) < 0.18 ? PAL.G2 : PAL.G3);
  rect(0, 10, 480, 2, b.ink(PAL.G1));
  const S = OTS_SCREEN;
  for (let y = S.y - 26; y < S.y + S.h + 40; y++) for (let x = S.x - 34; x < S.x + S.w + 34; x++) {
    const dx = x < S.x ? S.x - x : x >= S.x + S.w ? x - S.x - S.w : 0, dy = y < S.y ? S.y - y : y >= S.y + S.h ? y - S.y - S.h : 0;
    if (!dx && !dy) continue;
    const d = Math.hypot(dx / 34, dy / 30);
    if (d < 1 && bayer(x, y) < (1 - d) * 0.75) b.set(x, y, stepColor(b.get(x, y), 1));
  }
  rect(S.x - 5, S.y - 5, S.w + 10, S.h + 10, b.ink(PAL.N0));
  rect(S.x - 4, S.y - 5, S.w + 8, 1, b.ink(PAL.G1));
  const page = new Buf(480, 203, PAL.N1);
  drawStream(page, f);
  miniature(page, 0, 0, 480, 203, b, S.x, S.y, S.w, S.h);
  // the conference table's far edge and two chair backs, dark against the lit wall
  rect(0, 150, 330, 3, b.ink(PAL.G1)); rect(0, 150, 330, 1, b.ink(PAL.G4));
  rect(0, 153, 330, 50, b.ink(PAL.N2));
  for (const cx of [40, 196]) {
    for (let y = 124; y < 153; y++) for (let x = cx - 18; x <= cx + 18; x++) {
      const r = y - 124, inset = r < 3 ? [5, 2, 1][r] : 0;
      if (x < cx - 18 + inset || x > cx + 18 - inset) continue;
      b.set(x, y, r === 0 ? PAL.G2 : x < cx - 15 || x > cx + 15 ? PAL.N1 : PAL.N2);
    }
  }
  // the glass wall: two sheen streaks (a rung up), the frosted band low across it, a mullion at the left
  for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) {
    const u = x + y * 0.55;
    if ((u > 150 && u < 160) || (u > 172 && u < 175)) b.set(x, y, stepColor(b.get(x, y), 1));
  }
  for (let x = 0; x < 480; x++) for (let y = 160; y < 172; y++) b.set(x, y, (y === 162 || y === 169) && x % 6 === 0 ? PAL.P1 : stepColor(b.get(x, y), 1));
  rect(8, 0, 10, 203, b.ink(PAL.G4)); rect(8, 0, 2, 203, b.ink(PAL.G5)); rect(16, 0, 2, 203, b.ink(PAL.G2));
  drawStafferHead(b, lean);
};
/**
 * The staffer's head and shoulder at OTS scale, built on the engine's figure rig (the cast's own shading: bands from
 * the silhouette toward the key, a rim, an outline) so he belongs to the same world as the cast. Nobody in particular:
 * short hair, a charcoal jacket. The key is the screen (camera-left, a little high); nothing lights him from behind.
 * 'back': the back of his head, the ear and the jaw's edge on the screen side. 'lean': his profile, leaning in toward
 * the glass and a little down, squinting at the chart.
 */
const HEAD_W = 190, HEAD_H = 150;
const headRamps = () => {
  return {
    skin: [PAL.S0, PAL.X0, PAL.X1, PAL.X2, PAL.K2, PAL.K3],
    hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.C3],
    jacket: [PAL.N0, PAL.G0, PAL.G0, PAL.G1, PAL.G2, PAL.C3],
    shirt: [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.C4],
  };
};
const HEAD_RIG = (): LightRig => ({key: [-1, -0.35], keyBand: 5, shadowBand: 4, rim: true, outline: true, back: null, ramps: headRamps(),
  groupBands: {ear: {key: 3, shadow: 3}, head: {key: 15, shadow: 10}, hair: {key: 9, shadow: 8}, jacket: {key: 5, shadow: 10}, neck: {key: 4, shadow: 6}}});
const headFig = (lean: boolean): FigureDef => {
  // local frame: the head's centre at (96, 64) upright; the lean shifts the head 14 px left and 4 down
  const hx = lean ? 82 : 96, hy = lean ? 68 : 64;
  const H = (...pts: number[]) => P.poly(...pts.map((v, i) => (i % 2 ? v + hy : v + hx)));
  const parts: Part[] = [
    {group: 'jacket', mat: 'jacket', prims: [P.poly(0, 150, 4, 98, 40, 86, 76, 82, 120, 84, 160, 94, 190, 108, 190, 150)]},
    {group: 'shirt', mat: 'shirt', prims: [P.poly(66, 86, 80, 80, 112, 80, 124, 88, 110, 96, 80, 96)]},
    {group: 'neck', mat: 'skin', prims: [lean ? H(-18, 22, 10, 26, 16, 36, 12, 50, -18, 46) : H(-16, 18, 16, 18, 18, 42, -18, 42)]},
  ];
  if (!lean) {
    parts.push({group: 'head', mat: 'skin', prims: [P.ell(hx, hy - 4, 30, 37), H(-30, 4, -24, 26, -12, 34, 12, 34, 24, 26, 30, 4)]});
    parts.push({group: 'head', mat: 'skin', prims: [P.ell(hx - 30, hy + 4, 5, 9)]}); // the ear on the screen side
    parts.push({group: 'hair', mat: 'hair', prims: [H(-30, -2, -32, -22, -24, -36, -8, -43, 10, -43, 26, -35, 33, -18, 32, 4, 26, 22, 14, 30, -2, 32, -16, 30, -24, 18, -24, 4)]});
  } else {
    parts.push({group: 'head', mat: 'skin', prims: [H(
      0, -40, -16, -35, -25, -24, -28, -10, -27, -5, -29, 0, -37, 12, -35, 15, -31, 16, -32, 20, -30, 22, -31, 25,
      -28, 28, -29, 32, -25, 37, -12, 37, 0, 33, 10, 26, 22, 16, 28, 0, 28, -20, 18, -34)]});
    parts.push({group: 'hair', mat: 'hair', prims: [H(-22, -30, -12, -40, 4, -43, 20, -37, 30, -22, 32, -2, 28, 16, 22, 26, 17, 12, 12, -6, 6, -8, 6, 6, 2, 8, 0, -8, -10, -18, -20, -24)]});
    parts.push({group: 'ear', mat: 'skin', prims: [P.ell(hx + 12, hy + 3, 4.5, 8)]});
  }
  const stamps: Stamp[] = lean ? [
    // the squint: the lid a dark slit under a brow pulled low, a crease above; the mouth's line; the nostril
    {x: hx - 25, y: hy - 9, rows: ['.bbbbbb', 'bbb....', '.......', '.eeeee.', '..ccc..'], pal: {b: ['hair', 1], e: PAL.N0, c: ['skin', 1]}},
    {x: hx - 31, y: hy + 16, rows: ['n.', '..', '..', '..', '.mmmm'], pal: {n: ['skin', 0], m: ['skin', 0]}},
  ] : [];
  return {w: HEAD_W, h: HEAD_H, parts, stamps, adjust: [
    // the jacket's lapel and its fold catch the screen; the collar's shadow on the neck
    {prims: [P.line(40, 88, 70, 120), P.line(41, 88, 71, 120)], tone: 3, onlyMat: 'jacket'},
    {prims: [lean ? P.rect(hx - 18, hy + 38, 34, 6) : P.rect(hx - 18, hy + 34, 36, 6)], add: -1, onlyMat: 'skin'},
  ]};
};
const headImg = memo((lean: number): Img => renderFigure(headFig(lean === 1), HEAD_RIG()));
const drawStafferHead = (b: Buf, lean: boolean) => blitImg(b, headImg(lean ? 1 : 0), 300, 64, {clip: (_x, y) => y < 203});

export const clipB = (f: number, room: Buf): {view: View} => {
  if (f >= B_IN && f < B_OUT) { drawStream(room, f); return {view: WIDE}; }
  if (f >= B_OTS) { drawOTS(room, f, f >= B_LEAN); return {view: WIDE}; }
  drawBullpenShot(room, f);
  return {view: WIDE};
};
export {osdText, osdWidth, plate, SCREEN_C};
