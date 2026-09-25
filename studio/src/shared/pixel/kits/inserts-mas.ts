// MR. MAS — kits: the act-4 [ECU] INSERT SHOTS with Mas's hands, composed one call per shot (Ep1 act 4). New file,
// owned by the act-4 insert + expression artist. Each shot paints the whole room area (480 x 203; the rail band below
// is the rail builder's) from the plate, the props and the hand drawing (kits/inserts-hands.ts). Plates reuse the
// rooms builders' inserts where one exists (rooms-b `drawDarkDesk`, rooms-a `drawDeskInsert`); where the board needs a
// framing nobody drew, the plate is authored here from the rooms' own materials so it matches.
import {Buf, bayer} from '../px';
import {PAL, stepColor} from '../palette';
import {blitImg, Img} from '../figure';
import {memo} from '../cast/kit';
import {pen} from './props';
import {drawDarkDesk, DARKDESK} from '../rooms/darkroom';
import {carveFist, flatHand, penGrip, renderHand, restHand, HandLight} from './inserts-hands';

export const INS_W = 480, INS_H = 203;
const FLAT_OPTS = {s: 4.4, thumb: -142, spread: 0, curl: 0.55, squash: 0.66};
let FIST: ReturnType<typeof carveFist> | null = null;
const fistImg = () => (FIST ??= carveFist());
const handImg = memo((k: {pose: string; light: HandLight; s: number; six?: boolean}): Img => {
  return renderHand(flatHand({...FLAT_OPTS, s: k.s, six: k.six}).def, k.light);
});

// ================================================================== contact shadow (a hand lying ON the surface)
/**
 * The hand's shadow on the surface under it: its silhouette offset away from the key (dx, dy) and dilated 1 px, the
 * surface stepped down `rungs` rungs of its own ramp where the hand doesn't cover it. Surfaces only, never skin.
 */
export const contactShadow = (b: Buf, img: Img, ox: number, oy: number, dx = 2, dy = 2, rungs = 2) => {
  const on = (i: number, j: number) => i >= 0 && j >= 0 && i < img.w && j < img.h && img.c[j * img.w + i] >= 0;
  for (let j = -2; j < img.h + dy + 2; j++) for (let i = -2; i < img.w + dx + 2; i++) {
    if (on(i, j)) continue;
    let hit = false;
    for (let a = -1; a <= 1 && !hit; a++) for (let c = -1; c <= 1 && !hit; c++) if (on(i - dx + a, j - dy + c)) hit = true;
    if (!hit) continue;
    const X = ox + i, Y = oy + j;
    if (X < 0 || Y < 0 || X >= INS_W || Y >= INS_H) continue;
    b.set(X, Y, stepColor(b.get(X, Y), -rungs));
  }
};

// ================================================================== the sleeve (every hand connects to the frame edge)
export type SleeveLight = 'dark' | 'suite' | 'lobby';
const SLEEVE: Record<SleeveLight, number[]> = {
  // [outline, shadow, mid, lit, rim]
  dark: [PAL.N0, PAL.G0, PAL.G1, PAL.C2, PAL.C4],
  suite: [PAL.N0, PAL.G0, PAL.G1, PAL.G3, PAL.C4],
  lobby: [PAL.N0, PAL.G0, PAL.G2, PAL.G3, PAL.W5],
};
/**
 * His forearm in the grey hoodie sleeve, from the wrist (a) to past the frame edge (z): a tapered band, lit on the
 * side toward the key (`litSide` -1 = the band's left as seen walking a->z, 1 = right), one fold at `fold` (0..1).
 * Drawn BEFORE the hand (the hand's own cuff sits over its end).
 */
export const drawSleeve = (b: Buf, a: [number, number], z: [number, number], w0: number, w1: number, light: SleeveLight, litSide: -1 | 1 = -1, fold = 0.45) => {
  const R = SLEEVE[light];
  const dx = z[0] - a[0], dy = z[1] - a[1], L = Math.hypot(dx, dy) || 1;
  const tx = dx / L, ty = dy / L, nx = -ty, ny = tx;
  const x0 = Math.floor(Math.min(a[0], z[0]) - w1), x1 = Math.ceil(Math.max(a[0], z[0]) + w1);
  const y0 = Math.floor(Math.min(a[1], z[1]) - w1), y1 = Math.ceil(Math.max(a[1], z[1]) + w1);
  for (let y = Math.max(0, y0); y <= Math.min(INS_H - 1, y1); y++) for (let x = Math.max(0, x0); x <= Math.min(INS_W - 1, x1); x++) {
    const px = x + 0.5 - a[0], py = y + 0.5 - a[1];
    const t = (px * tx + py * ty) / L;
    if (t < 0 || t > 1) continue;
    const hw = (w0 + (w1 - w0) * t) / 2;
    const u = (px * nx + py * ny) * litSide; // + = toward the lit side
    if (Math.abs(u) > hw) continue;
    const e = hw - Math.abs(u);
    let c = u > hw * 0.35 ? R[3] : u > -hw * 0.3 ? R[2] : R[1];
    if (e < 1) c = u > 0 ? R[4] : R[0];
    // the fold: a dark crease across the sleeve, with its lit lip
    const ft = Math.abs(t - fold) * L;
    if (ft < 1 && e > 1.5) c = R[1];
    else if (ft < 2 && t > fold && e > 1.5 && u > -hw * 0.3) c = R[3];
    // the rib cuff at the wrist end: dense 1px ribs
    if (t * L < 5 && e >= 1 && Math.round(u) % 2 === 0) c = R[1];
    b.set(x, y, c);
  }
  void bayer;
};

// ================================================================== sc 26A: THE CARVE (hand 4)
/**
 * 26A bar 1: the desk close (rooms-b), the pen (kits) with its clip at the carve tip, the fist on it. q = the carve's
 * progress 0..1, held in quarters on the beat (the plate grows the groove in the same quarters).
 */
export const drawCarveInsert = (b: Buf, f: number, q: number) => {
  const qq = Math.round(Math.max(0.25, Math.min(1, q)) * 4) / 4;
  const room = drawDarkDesk(b, f, {tally: 3, carve: qq});
  const [tx, ty] = room.anchors.carveTip;
  pen(b, tx - 1, ty);
  const {img, origin, wrist} = fistImg();
  const [gx, gy] = penGrip(tx - 1, ty);
  const ox = gx - origin[0], oy = gy - origin[1];
  drawSleeve(b, [ox + wrist[0], oy + wrist[1]], [ox + wrist[0] + 36, INS_H + 8], 15, 21, 'dark', -1, 0.55);
  blitImg(b, img, ox, oy);
  return room;
};

// ================================================================== sc 26A: THE BRUSH, THEN THE THUMB ON MARK 3 (hand 5)
/**
 * One flat hand (palm down, thumb out left), moved in whole pixels: it comes in low, its thumb-side edge against the
 * shavings at the foot of mark 3, sweeps them right in three held steps (they're gone from the second), then settles
 * up-left until the thumb's pad rests on mark 3 — and ONLY mark 3. Marks 1 and 2 are (REPORTED): nothing of his ever
 * touches them (the path keeps the whole hand right of mark 3's left wall; `brushSafe` asserts it).
 * k = the step 0..BRUSH_STEPS-1 (hold each on the grid; brushStepAt gives a default timing).
 */
export const BRUSH_STEPS = 8;
const HS = 4.4;
let FLAT: ReturnType<typeof flatHand> | null = null;
let REST: ReturnType<typeof restHand> | null = null;
const rest12 = () => (REST ??= restHand(1.2, 'dark'));
const flat44 = () => (FLAT ??= flatHand(FLAT_OPTS));
/** thumb-pad targets per step, room coords (the hand is placed so its thumb pad lands here) */
const BRUSH_PATH: Array<[number, number]> = [
  [306, 150], // 0 entering, low
  [300, 132], // 1 the edge at the shavings
  [304, 132], // 2 sweep
  [309, 131], // 3 sweep (shavings gone)
  [314, 131], // 4 sweep
  [306, 118], // 5 settling
  [299, 108], // 6 settling
  [297, 104], // 7 AT REST: the pad on mark 3
];
/** default timing inside bar 2 (60 f): enter on the downbeat, sweep on 3s, settle, rest from beat 3 */
export const brushStepAt = (f: number): number => (f < 3 ? 0 : f < 9 ? 1 : f < 12 ? 2 : f < 15 ? 3 : f < 21 ? 4 : f < 25 ? 5 : f < 29 ? 6 : 7);
export const drawBrushInsert = (b: Buf, f: number, k: number) => {
  const room = drawDarkDesk(b, f, {tally: 3, carve: 1});
  const step = Math.max(0, Math.min(BRUSH_STEPS - 1, Math.round(k)));
  // the shavings: swept off from step 3 (the plate always draws them; paint the clean wood back from a tally-2 plate)
  if (step >= 3) {
    const clean = new Buf(INS_W, INS_H, PAL.N0);
    drawDarkDesk(clean, f, {tally: 2});
    const cx = DARKDESK.marks.x + DARKDESK.marks.gap * 2 + 3, cy = DARKDESK.marks.y + DARKDESK.marks.len;
    for (const [dx, dy] of [[2, 0], [3, -1], [4, 0], [3, 1], [6, 2], [-3, 3], [1, 4]]) b.set(cx + dx, cy + dy, clean.get(cx + dx, cy + dy));
  }
  const H = rest12();
  const [px, py] = BRUSH_PATH[step];
  const ox = Math.round(px - H.anchors.thumbPad[0]), oy = Math.round(py - H.anchors.thumbPad[1]);
  drawSleeve(b, [ox + H.anchors.wrist[0] - 1, oy + H.anchors.wrist[1] - 3], [ox + H.anchors.wrist[0] + 30, INS_H + 8], 24, 30, 'dark', -1, 0.5);
  contactShadow(b, H.img, ox, oy, 2, 2, 2);
  blitImg(b, H.img, ox, oy);
  return {room, at: [ox, oy] as [number, number]};
};
/** The rule check: at every step, no hand pixel sits on or left of mark 3's left wall (so marks 1-2 are never touched). */
export const brushSafe = (): boolean => {
  const H = rest12();
  const img = H.img;
  // marks 1 and 2: their grooves (2 px + the lit wall) with a 2 px margin
  const {x, gap, y, len} = DARKDESK.marks;
  const hit = (X: number, Y: number) => Y >= y - 2 && Y <= y + len + 2 && ((X >= x - 2 && X <= x + 5) || (X >= x + gap - 2 && X <= x + gap + 5));
  return BRUSH_PATH.every(([px, py]) => {
    const ox = Math.round(px - H.anchors.thumbPad[0]), oy = Math.round(py - H.anchors.thumbPad[1]);
    for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) if (img.c[j * img.w + i] >= 0 && hit(ox + i, oy + j)) return false;
    return true;
  });
};
void stepColor;

// ================================================================== sc 29: THE PHONE ON THE DESK (hand 6 + MAS'S VERSION)
// The matching frame. One framing, one hand, one plate; the two shots differ ONLY in what the correction needs:
//   VERSION  the phone face-down, the hand resting on it with SIX fingers (the egg), and NOTHING else moves: the
//            rack's LEDs and the Orb's iris at the frame's edge are held (the stillness flag, kits/mas-version.ts)
//   TRUE     the phone face-up and still on the desk, five fingers, Rima's post legible on it the whole time, the
//            thumb taps a heart on every beat, the LEDs blink, the Orb's iris follows the taps
import {drawOrb} from '../../../dev/mcoldopen/orb';
import {text, textWidth, wrap} from '../font';
import {tapHandCaps, TapThumb} from './inserts-hands';
import {hash, rect} from '../px';
import {MatBuf, resolve} from '../light';

/** the phone as it lies on the desk (room coords): body, screen, the heart button of the newest post */
export const PHONE29 = {
  body: {x0: 118, y0: 24, x1: 200, y1: 184},
  screen: {x0: 124, y0: 36, x1: 194, y1: 174},
  heart: [185, 164] as [number, number],
  orb: {cx: 468, cy: -8, r: 44},
};
const s29 = 9.5;
/** the tight dark-desk plate (the same wood and key as rooms-b's desk close, three times closer) */
const deskCache29 = new Map<string, Buf>();
const desk29 = (): Buf => {
  let rb = deskCache29.get('d');
  if (rb) return rb;
  rb = new Buf(INS_W, INS_H, PAL.N0);
  const mb = new MatBuf(INS_W, INS_H);
  const edgeY = 12;
  rect(0, 0, INS_W, edgeY, mb.mat('wall', -0.8));
  const grainV = (x: number, y: number) => y * 0.34 + 1.2 * Math.sin(x / 140 + y / 60) + 0.5 * Math.sin(x / 38 + y / 21);
  for (let y = edgeY; y < INS_H; y++) for (let x = 0; x < INS_W; x++) {
    const v = grainV(x, y);
    const band = Math.floor(v / 5);
    const inB = v - band * 5;
    let lvl = (hash(band, 3, 11) - 0.5) * 0.6 + 0.4;
    if (inB < 0.9 && hash(band, 5, 13) < 0.6) lvl -= 0.9;
    mb.mat('wood', lvl)(x, y);
  }
  rect(0, edgeY, INS_W, 1, mb.shade(1.8));
  rect(0, edgeY - 2, INS_W, 2, mb.mat('wood', -1.8));
  resolve(mb, {
    amb: (x, y) => 1.8 + (y < edgeY ? 0.4 : 0) - Math.max(0, (y - 150) / 80),
    cyan: (x, y) => { const d = Math.hypot((x + 60) / 620, (y + 10) / 260); return y < edgeY ? 0 : Math.max(0, Math.min(1, 1.02 - d)) * 0.95; },
    warm: () => 0, dither: 0.4,
  }, rb, 0);
  deskCache29.set('d', rb);
  return rb;
};
/** the rack's LEDs far off in the dark beyond the desk (top-left), as small soft discs; `still` holds them */
const rackLeds29 = (b: Buf, f: number, still: boolean) => {
  const ph = still ? 0 : Math.floor((f * 2) / 15);
  const leds: Array<[number, number, number, number]> = [[14, 4, PAL.C4, 0], [20, 7, PAL.R3, 1], [26, 4, PAL.L2, 2], [14, 9, PAL.C3, 3]];
  for (const [x, y, c, k] of leds) {
    const on = still ? true : (ph + k) % 3 !== 0;
    b.set(x, y, on ? c : stepColor(c, -2)); b.set(x + 1, y, on ? stepColor(c, -1) : stepColor(c, -3));
  }
};
/** the phone's body, the case edge lit toward the key; face 'up' (screen) or 'down' (its back) */
const phone29 = (b: Buf, face: 'up' | 'down') => {
  const {x0, y0, x1, y1} = PHONE29.body;
  // its shadow on the desk (away from the key: right and down)
  for (let y = y0 + 3; y <= y1 + 3; y++) for (let x = x0 + 3; x <= x1 + 3; x++) b.set(x, y, stepColor(b.get(x, y), -2));
  const r = 7;
  const inRound = (x: number, y: number) => {
    const cx = Math.max(x0 + r, Math.min(x1 - r, x)), cy = Math.max(y0 + r, Math.min(y1 - r, y));
    return Math.hypot(x - cx, y - cy) <= r;
  };
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    if (!inRound(x, y)) continue;
    const e = !inRound(x - 1, y) || !inRound(x, y - 1), e2 = !inRound(x + 1, y) || !inRound(x, y + 1);
    b.set(x, y, e ? PAL.C3 : e2 ? PAL.N0 : face === 'up' ? PAL.N1 : PAL.G1);
  }
  if (face === 'down') {
    // the back: a matte slab, the camera bump (two lenses, no logo), the key's sheen along the top-left
    for (let y = y0 + 3; y < y1 - 2; y++) for (let x = x0 + 3; x < x1 - 2; x++) if ((x - x0) + (y - y0) * 0.5 < 22 && bayer(x, y) < 0.5) b.set(x, y, PAL.G2);
    rect(x0 + 8, y0 + 8, 24, 30, b.ink(PAL.N2)); rect(x0 + 8, y0 + 8, 24, 1, b.ink(PAL.G3)); rect(x0 + 8, y0 + 8, 1, 30, b.ink(PAL.G3));
    for (const [cx, cy] of [[x0 + 16, y0 + 16], [x0 + 16, y0 + 29]]) for (let j = -4; j <= 4; j++) for (let i = -4; i <= 4; i++) { const d = Math.hypot(i, j); if (d <= 4.3) b.set(cx + i, cy + j, d > 3.2 ? PAL.G3 : d > 1.6 ? PAL.N0 : PAL.C2); }
    b.set(x0 + 14, y0 + 14, PAL.C6); b.set(x0 + 14, y0 + 27, PAL.C6);
  } else {
    const S = PHONE29.screen;
    rect(S.x0, S.y0, S.x1 - S.x0 + 1, S.y1 - S.y0 + 1, b.ink(PAL.N0));
  }
};
/**
 * STAND-IN for kit.post-ui (not built yet): the feed on the face-up phone. Rima's post, identical every time,
 * stacked newest at the bottom; `n` posts have arrived, `hearts` of them hearted (red). The words are legible the
 * whole time (they never change). The post-ui kit should paint into PHONE29.screen and put the newest post's heart
 * at PHONE29.heart.
 */
export const RIMA_POST = 'NopeAI is nothing without its people';
export const feedStandIn = (b: Buf, n: number, hearts: number) => {
  const S = PHONE29.screen;
  const w = S.x1 - S.x0 + 1;
  const lines = wrap(RIMA_POST, w - 8);
  const cardH = 12 + lines.length * 11 + 12;
  const clip = (x: number, y: number) => x >= S.x0 && x <= S.x1 && y >= S.y0 && y <= S.y1;
  const put = (x: number, y: number, c: number) => { if (clip(x, y)) b.set(x, y, c); };
  for (let k = 0; k < Math.max(1, n); k++) {
    const age = Math.max(1, n) - 1 - k; // 0 = newest (bottom)
    const top = S.y1 - (age + 1) * cardH + 1;
    for (let y = top; y < top + cardH - 1; y++) for (let x = S.x0; x <= S.x1; x++) put(x, y, PAL.N2);
    for (let x = S.x0; x <= S.x1; x++) put(x, top + cardH - 1, PAL.N0);
    // avatar + a handle drawn as glyph noise (private individuals: never a readable handle)
    for (let j = 0; j < 7; j++) for (let i = 0; i < 7; i++) if (Math.hypot(i - 3, j - 3) < 3.6) put(S.x0 + 4 + i, top + 3 + j, [PAL.G4, PAL.W4, PAL.C4, PAL.R2][k % 4]);
    for (let i = 0; i < 26; i++) if (hash(i, k, 91) < 0.7) put(S.x0 + 14 + i, top + 6, PAL.G3);
    lines.forEach((ln, li) => {
      const tb = new Buf(textWidth(ln) + 2, 9, 0xff00ff);
      text(tb, ln, 0, 0, PAL.P2);
      for (let j = 0; j < 9; j++) for (let i = 0; i < tb.w; i++) if (tb.get(i, j) === PAL.P2) put(S.x0 + 4 + i, top + 13 + li * 11 + j, PAL.P2);
    });
    // the heart (bottom-right of the card): outline grey, red when hearted
    const hx = S.x1 - 12, hy = top + cardH - 11;
    const HEART = ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'];
    const on = age < hearts;
    HEART.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') { const edge = j === 0 || i === 0 || i === 6 || (j > 2 && (i === j - 2 || i === 8 - j)); put(hx + i, hy + j, on ? (j === 1 && i < 3 ? PAL.R3 : PAL.R2) : edge ? PAL.G4 : PAL.N2); } });
  }
};
export interface Phone29Opts {
  /** 'version' = MAS'S VERSION (face-down, six fingers, everything held); 'true' = the true shot */
  mode: 'version' | 'true';
  /** true shot: frames since the cut's downbeat (hearts on the beat: 15 f per beat) */
  f: number;
  /** the G2 A/B: the VERSION with five fingers (the copy) */
  fiveInVersion?: boolean;
  /** stand-in feed (off when the post-ui kit paints the screen itself: pass a painter) */
  screen?: (b: Buf) => void;
}
/** the heart taps: 8 posts, one per beat, the thumb down for 4 frames on each beat */
export const heartTapAt = (f: number) => {
  const beat = Math.floor(f / 15), inBeat = f - beat * 15;
  const n = Math.min(8, beat + 1);
  const down = beat < 8 && inBeat < 4;
  const hearts = Math.min(8, beat + (inBeat >= 1 ? 1 : 0));
  return {n, hearts, thumb: (down ? 'tap' : 'up') as TapThumb, beat};
};
const tapCache = new Map<string, ReturnType<typeof tapHandCaps>>();
const tap29 = (thumb: TapThumb, six: boolean) => {
  const k = `${thumb}${six}`;
  let v = tapCache.get(k);
  if (!v) { v = tapHandCaps({s: s29, thumb, six, light: 'dark'}); tapCache.set(k, v); }
  return v;
};
export const drawPhoneInsert29 = (b: Buf, o: Phone29Opts) => {
  const still = o.mode === 'version';
  const d = desk29();
  for (let y = 0; y < INS_H; y++) b.c.set(d.c.subarray(y * INS_W, (y + 1) * INS_W), y * b.w);
  rackLeds29(b, o.f, still);
  let thumb: TapThumb = 'rest', n = 0, hearts = 0, beat = 0;
  if (o.mode === 'true') ({thumb, n, hearts, beat} = heartTapAt(o.f));
  phone29(b, still ? 'down' : 'up');
  if (!still) (o.screen ?? ((bb: Buf) => feedStandIn(bb, n, hearts)))(b);
  // the hand: its thumb pad on the newest post's heart (true) / on the phone's back at the same spot (VERSION)
  const H = tap29(thumb, still && !o.fiveInVersion);
  const [hx, hy] = PHONE29.heart;
  const ox = Math.round(hx - H.anchors.thumbPad[0]), oy = Math.round(hy - H.anchors.thumbPad[1]);
  drawSleeve(b, [ox + H.anchors.wrist[0], oy + H.anchors.wrist[1] - 4], [ox + H.anchors.wrist[0] + 22, INS_H + 10], 50, 56, 'dark', -1, 0.6);
  contactShadow(b, H.img, ox, oy, thumb === 'up' ? 4 : 2, thumb === 'up' ? 4 : 2, 2);
  blitImg(b, H.img, ox, oy);
  // the Orb at the frame's edge (top-right): its iris on the phone; it follows each tap (true), held (VERSION)
  const O = PHONE29.orb;
  const look: [number, number] = still ? [-0.62, 0.6] : [-0.62 + ((beat % 2) ? 0.04 : 0), 0.6 + (thumb === 'tap' ? 0.04 : 0)];
  drawOrb(b, O.cx, O.cy, O.r, {look, aperture: 0.55, monitor: -1});
  return {still, beat};
};

// ================================================================== sc 26: THE STRIP TAP (hand 3)
import {drawDeskInsert, DESK_INSERT} from '../rooms/vegas-suite';
import {drawLaptopCornerMic} from './inserts-props';
/**
 * STAND-IN for kit.post-ui: the suggested-replies strip lit on the phone, [super] [super] [super]; `pressed` = the
 * middle chip's pressed drawing (1 px down, one rung darker). The kit should paint the same chips at STRIP26.
 */
export const STRIP26 = {y: 136, chips: [[212, 34], [251, 34], [290, 26]] as Array<[number, number]>, h: 20, middle: [268, 146] as [number, number]};
export const stripStandIn = (b: Buf, pressed: boolean) => {
  const P = DESK_INSERT.phoneScreen;
  // the lock-screen notification the buzz brought (the preview line unreadable at this focus), then the strip
  for (let y = P.y0 + 12; y < P.y0 + 44; y++) for (let x = P.x0 + 6; x <= P.x1 - 6; x++) b.set(x, y, PAL.N2);
  for (let i = 0; i < 70; i++) if (hash(i, 3, 17) < 0.7) b.set(P.x0 + 12 + i, P.y0 + 22, PAL.G3);
  for (let i = 0; i < 50; i++) if (hash(i, 5, 17) < 0.7) b.set(P.x0 + 12 + i, P.y0 + 30, PAL.G2);
  STRIP26.chips.forEach(([x, w], k) => {
    const down = pressed && k === 1 ? 1 : 0;
    const y = STRIP26.y + down;
    for (let j = 0; j < STRIP26.h; j++) for (let i = 0; i < w; i++) {
      const round = (i === 0 || i === w - 1) && (j === 0 || j === STRIP26.h - 1);
      if (round) continue;
      b.set(x + i, y + j, j === 0 ? (down ? PAL.C3 : PAL.C6) : down ? PAL.C2 : PAL.C4);
    }
    const lbl = 'super';
    text(b, lbl, x + Math.round((w - textWidth(lbl)) / 2), y + 6, down ? PAL.C8 : PAL.N0);
  });
};
export type StripHand = 'out' | 'enter1' | 'enter2' | 'tap' | 'after';
const tap26 = new Map<string, ReturnType<typeof tapHandCaps>>();
const hand26 = (thumb: TapThumb) => {
  let v = tap26.get(thumb);
  if (!v) { v = tapHandCaps({s: 13.5, thumb, light: 'suite', rot: -34, surf: 0.8}); tap26.set(thumb, v); }
  return v;
};
/**
 * sc 26 P3 -> P4: the phone on the desk with the laptop's corner (rooms-a), the call's mic chip lit in that corner,
 * the strip lit; the hand comes in from the lower right and the thumb takes the middle super AT ONCE (no hover:
 * enter1 -> enter2 -> tap is one continuous move, 2 frames a step), then 'after' (thumb up, it stays).
 */
export const drawStripTapInsert = (b: Buf, f: number, o: {hand: StripHand; strip?: boolean; level?: number}) => {
  drawDeskInsert(b, {f, phoneLit: true, mic: false});
  drawLaptopCornerMic(b, {level: o.level ?? 3, f});
  if (o.strip !== false) stripStandIn(b, o.hand === 'tap');
  if (o.hand === 'out') return;
  const thumb: TapThumb = o.hand === 'tap' ? 'tap' : 'up';
  const H = hand26(thumb);
  const [tx, ty] = STRIP26.middle;
  const off = o.hand === 'enter1' ? [34, 30] : o.hand === 'enter2' ? [12, 10] : [0, 0];
  const ox = Math.round(tx - H.anchors.thumbPad[0] + off[0]), oy = Math.round(ty - H.anchors.thumbPad[1] + off[1]);
  contactShadow(b, H.img, ox, oy, thumb === 'up' ? 5 : 3, thumb === 'up' ? 5 : 3, 2);
  blitImg(b, H.img, ox, oy);
};
