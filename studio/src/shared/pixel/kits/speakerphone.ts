// MR. MAS — shared kit: THE SPEAKERPHONE AT MCU SCALE (PROP-SPEAKERPHONE-MCU; Ep1 Act Four v5 art pass, round 3; new
// file, owned by the v5 art pass). S4.07 [MCU·PF]: Neleh "pulls the speakerphone across the table to her" and "dials:
// four tones, one per seat" (script 5.1: a decision; in v4 it dialled on its own). The same generic three-lobed pod as
// rooms/boardroom.ts draws at room scale (metal, a dark centre grille, four dial LEDs), redrawn at the close-up's size:
// a close shot is its own drawing, never a scaled sprite.
//   drawSpeakerphoneMCU(b, st)   the pod in the lower foreground of her MCU (cut by the frame's foot), with:
//       st.slide 0..3   the pull across the table in 3 held steps (0 = still out of frame left, 3 = in front of her)
//       st.leds  0..4   dial LEDs lit, one per tone (one per seat)
//       st.press -1..3  the key her finger is on (-1 = none); st.down: the pressed drawing (1 px down, the key lit)
//       st.hand  'none' | 'pull' (her hand flat on the pod's near lobe, dragging it) | 'dial' (index on the keypad)
//   dialAt(k, k0, beat)          the held state for frame k of a dial that starts at k0: one tone a beat, a key goes down
//                                for 3 frames, its LED stays lit; returns {leds, press, down}
//   SPK_MCU                      geometry (the pod's centre when in, the keypad, the LEDs) for a host lighting the table
// Palette: the pod in the boardroom's cool metal (G1-G5, the LED bar's C3 rim), the LEDs C8 / N3, her hand in the warm
// S ramp (inserts-hands 'lobby' tones, as her portrait), her navy blazer sleeve (N1-N5) and the blouse's cuff (P0 P1).
import {Buf, rect, bayer, poly, ellipse} from '../px';
import {PAL} from '../palette';
import {Img, blitImg} from '../figure';
import {clickHand, restHandCaps} from './inserts-hands';

export const SPK_MCU = {
  /** the pod's centre once pulled in (the near lobe runs off the frame's foot at y 203) */
  c: [196, 184] as [number, number],
  /** the four slide positions (x offsets from c): off frame, entering, nearly there, in */
  slide: [-260, -120, -36, 0],
  /** the keypad on the right lobe (her side): 3 x 4 keys, 6 x 3 px on a 8 x 5 pitch; the four she dials */
  pad: {dx: 44, dy: -20, cols: 3, rows: 4, kw: 6, kh: 3, px: 8, py: 5},
  dialled: [1, 4, 6, 10],
  /** the LEDs along the far edge, one per seat */
  leds: [[-30, -27], [-12, -30], [8, -30], [26, -27]] as Array<[number, number]>,
};

export interface SpeakerphoneState { slide?: 0 | 1 | 2 | 3; leds?: number; press?: number; down?: boolean; hand?: 'none' | 'pull' | 'dial' }

// her hand: the capsule hands of kits/inserts-hands.ts (the click hand for the dial, the resting hand for the pull),
// rendered in the warm 'lobby' skin ramp (her portrait's S ramp; the 'dark' ramp is Mas's teal monitor light), at the
// MCU's scale (px per cm). Cached per drawing.
const HAND_S = 2.3;
const handCache = new Map<string, {img: Img; anchors: {tip?: [number, number]; thumbPad?: [number, number]; wrist: [number, number]}}>();
const dialHand = (down: boolean) => {
  const k = 'dial' + (down ? 1 : 0);
  if (!handCache.has(k)) handCache.set(k, clickHand({s: HAND_S, E: 50, click: down, light: 'lobby', rot: -40}));
  return handCache.get(k)!;
};
const pullHand = () => {
  if (!handCache.has('pull')) handCache.set('pull', restHandCaps({s: HAND_S, E: 50, light: 'lobby'}));
  return handCache.get('pull')!;
};
/** her forearm in the navy blazer from the wrist down-right off the frame's foot, the blouse cuff at the wrist */
const sleeve = (b: Buf, wx: number, wy: number, RH: number, put: (c: number) => (x: number, y: number) => void) => {
  for (let y = wy; y < RH; y++) {
    const t = y - wy;
    const x0 = wx - 6 + Math.round(t * 0.95), w = 15 + Math.round(t * 0.22);
    for (let i = 0; i < w; i++) put(i === 0 ? PAL.N0 : i < 3 ? PAL.N5 : i > w - 3 ? PAL.N1 : i > w - 6 ? PAL.N2 : PAL.N3)(x0 + i, y);
  }
  // the blouse cuff: a paper-white band across the wrist (it separates the hand from her jacket)
  for (let i = -6; i < 10; i++) { put(PAL.P1)(wx + i, wy); put(PAL.P0)(wx + i, wy + 1); }
};

export const drawSpeakerphoneMCU = (b: Buf, st: SpeakerphoneState = {}) => {
  const slide = st.slide ?? 3;
  const cx = SPK_MCU.c[0] + SPK_MCU.slide[slide], cy = SPK_MCU.c[1];
  const RH = 203;
  const clip = (x: number, y: number) => x >= 0 && x < b.w && y >= 0 && y < RH;
  const put = (c: number) => (x: number, y: number) => { if (clip(x, y)) b.set(x, y, c); };
  // its shadow on the table, soft, down-right (the pendant is above and behind her)
  ellipse(cx + 6, cy + 6, 92, 22, (x, y) => { if (clip(x, y) && bayer(x, y) < 0.5) b.set(x, y, PAL.N0); });
  // the pod: three lobes (far-left, far-right, near) round a flat top, seen from above at the MCU's angle
  const body = [cx - 86, cy - 6, cx - 72, cy - 24, cx - 44, cy - 34, cx + 44, cy - 34, cx + 72, cy - 24, cx + 86, cy - 6, cx + 60, cy + 10, cx + 30, cy + 24, cx - 30, cy + 24, cx - 60, cy + 10];
  poly(body, put(PAL.G1));
  // the top face, one rung up, inset; the rim toward the LED bar lit (cyan, one row), the near edge dark
  const top = [cx - 80, cy - 8, cx - 68, cy - 23, cx - 42, cy - 31, cx + 42, cy - 31, cx + 68, cy - 23, cx + 80, cy - 8, cx + 56, cy + 7, cx + 28, cy + 19, cx - 28, cy + 19, cx - 56, cy + 7];
  poly(top, (x, y) => { if (clip(x, y)) b.set(x, y, bayer(x, y) < 0.12 ? PAL.G3 : PAL.G2); });
  for (let x = cx - 42; x <= cx + 42; x++) put(PAL.C3)(x, cy - 32);
  for (let k = 0; k < 26; k++) { put(PAL.G4)(cx - 43 - k, cy - 31 + Math.round(k * 0.3)); put(PAL.G4)(cx + 43 + k, cy - 31 + Math.round(k * 0.3)); }
  // the centre grille: a dark ellipse with a dot screen, its lit lip
  ellipse(cx - 4, cy - 8, 26, 10, put(PAL.N1));
  ellipse(cx - 4, cy - 8, 26, 10, (x, y) => { if (clip(x, y) && ((x + y) & 1) === 0 && ((x >> 1) + y) % 3 === 0) b.set(x, y, PAL.N3); });
  for (let x = cx - 26; x <= cx + 18; x++) put(PAL.G3)(x, cy - 19);
  // the four dial LEDs on the far edge, one per seat
  const lit = st.leds ?? 0;
  SPK_MCU.leds.forEach(([dx, dy], i) => {
    const x = cx + dx, y = cy + dy;
    rect(x - 2, y - 1, 5, 3, put(PAL.N0));
    rect(x - 1, y, 3, 1, put(i < lit ? PAL.C8 : PAL.N3));
    if (i < lit) { put(PAL.C9)(x, y); for (const [ox, oy] of [[-3, 0], [3, 0], [0, -2]]) if (bayer(x + ox, y + oy) < 0.5) put(PAL.C5)(x + ox, y + oy); }
  });
  // the keypad on the right lobe: 3 x 4 keys, raised (a lit top row, a dark foot)
  const P = SPK_MCU.pad;
  for (let r = 0; r < P.rows; r++) for (let c = 0; c < P.cols; c++) {
    const n = r * P.cols + c;
    const kx = cx + P.dx + c * P.px - Math.round(r * 1.5), ky = cy + P.dy + r * P.py;
    const on = st.press === SPK_MCU.dialled.indexOf(n) && st.press !== undefined && st.press >= 0;
    const dn = on && st.down ? 1 : 0;
    rect(kx, ky + 1, P.kw, P.kh, put(PAL.G1));
    rect(kx, ky + dn, P.kw, P.kh - dn, put(on && st.down ? PAL.C4 : PAL.G4));
    rect(kx, ky + dn, P.kw, 1, put(on && st.down ? PAL.C6 : PAL.G5));
  }
  // her hand
  const hand = st.hand ?? 'none';
  if (hand === 'dial' && st.press !== undefined && st.press >= 0) {
    const n = SPK_MCU.dialled[st.press];
    const r = Math.floor(n / P.cols), c = n % P.cols;
    const tx = cx + P.dx + c * P.px - Math.round(r * 1.5) + 2, ty = cy + P.dy + r * P.py + 1;
    const H = dialHand(!!st.down);
    const [ax, ay] = H.anchors.tip!;
    const ox = tx - ax, oy = ty - ay;
    sleeve(b, ox + H.anchors.wrist[0], oy + H.anchors.wrist[1], RH, put);
    blitImg(b, H.img, ox, oy, {clip});
  } else if (hand === 'pull') {
    const H = pullHand();
    const [ax, ay] = H.anchors.thumbPad!;
    const ox = cx + 40 - ax, oy = cy - 8 - ay;
    sleeve(b, ox + H.anchors.wrist[0], oy + H.anchors.wrist[1], RH, put);
    blitImg(b, H.img, ox, oy, {clip});
  }
};

/** the dial as held drawings: one tone a beat from k0, each key down for 3 frames, its LED lit from its press on */
export const dialAt = (k: number, k0: number, beat = 12): {leds: number; press: number; down: boolean} => {
  if (k < k0) return {leds: 0, press: -1, down: false};
  const i = Math.floor((k - k0) / beat), t = (k - k0) % beat;
  if (i >= 4) return {leds: 4, press: 3, down: false};
  return {leds: i + (t >= 0 ? 1 : 0), press: i, down: t < 3};
};
