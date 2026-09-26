// MR. MAS · prototype 4 · 4d · P21 IRIS · the Orb checkpoint (11.E, Ep11 #17), the code version. Reel p540-719.
//   p540-559 the lobby at night (rooms/lobby.ts), the checkpoint in its own downlight: the Orb floats at a velvet
//            rope; the guest it just cleared walks on out of frame; NOLE steps up to the rope (one planted stride)
//            and the Orb turns to him on the beat (p555)
//   p560-569 the Orb's eye (cast/orb-medium.ts at close-up radius, native), drawn at the Orb's own density over a
//            lobby that is out of focus the pixel way: big soft shapes and hard-edged six-sided bokeh (the Orb's
//            blades), never an upscaled room. Its aperture opens in held steps
//   p570-574 IN: from inside, the iris blades step open across the room area
//   p575-659 the Orb's view: the frame through a barrel lens that bends the grid correctly (whole pixels), a chrome
//            rim, one specular sweep, a scan line over NOLE (a sprite: never glossy skin) with the scanner's brackets
//            and his ID tag. NOT VERIFIED. A long held beat. Then a small stamp: ...human? probably?
//   p660-664 OUT: the blades close in held steps
//   p665-679 the Orb's eye again (a match on the blades), its aperture settling back to rest
//   p680-719 the lobby: NOLE appeals (points, jabs, holds up his phone); the Orb looks from his finger to the phone;
//            the rope's far hook lets go and the rope drops to hang from the near post; NOLE walks through (a planted
//            walk, feet on the floor) behind the Orb and out; on the cue's resolution (p705) cut to its eye as it
//            finishes turning to us: land on the Orb's eye
import {Buf, rect, bayer, hash, clamp, ellipse} from '../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../shared/pixel/palette';
import {text, textWidth} from '../../../../shared/pixel/font';
import {blitImg, Img, LightRig, renderFigure} from '../../../../shared/pixel/figure';
import {flipImg} from '../../../../shared/pixel/cast/kit'; // (sprite.ts flipImg clips to the unflipped silhouette)
import {drawLobby, lobbyLayers, LOBBY} from '../../../../shared/pixel/rooms/lobby';
import {overlay} from '../../../../shared/pixel/rooms/setkit';
import {walkoutExtra, EXTRA_H} from '../../../../shared/pixel/rooms/bullpen';
import {noleFigure, noleRig, NOLE_BASE, NOLE_W, NOLE_FOOT, nolePortraitImg, NOLE_PORTRAIT_REST, NolePose, NoleLegs} from '../../../../shared/pixel/cast/nole';
import {drawOrb, orbBob} from '../../../../shared/pixel/cast/orb-medium';
import {stepDefocus, bokeh} from '../passes/defocus';
import {fisheye, irisBlades, specularSweep} from '../passes/device';
import {osdText, osdWidth} from '../passes/osdfont';
import {tiny, tinyWidth} from '../../../../shared/pixel/rooms/kit-b';
import {WIDE, View} from '../passes/present';

export const D0 = 540, D_ECU = 560, D_IN = 570, D_VIEW = 575, D_CLOSE = 660, D_ECU2 = 665, D_WIDE2 = 680, D1 = 720;
export const D_SCAN = 584, D_VERDICT = 606, D_STAMP = 641, D_ROPE = 693, D_TURN = 705;
/** NOLE's footfalls (reel frames) for the sound pass: the step up and the walk through */
export const NOLE_STEPS: number[] = [];

// ------------------------------------------------------------------ the checkpoint in the lobby
// staged right of the desk's end: NOLE against the dark right arch, in the checkpoint's own downlight (a pool on the
// floor, a key from above on his head and shoulders), the Orb's lens light on his front when it looks at him
const FEET = 188;
const ROPE = {nx: 334, ny: 192, fx: 358, fy: 176, h: 26};
const ORB_AT = {x: 346, y: 121, r: 11};
const NOLE_STOP = 312; // his foot x at the rope
const POOL = {cx: 322, cy: 189, rx: 46, ry: 9};
/**
 * NOLE's room drawing (cast/nole.ts, the approved rig and geometry) re-lit for the checkpoint: the same key from the Orb's
 * side and the same warm back rim, on brighter ramps (the lens and the downlight are on him: his black tee lifts to
 * slate with cyan highlights, the jeans read as denim, the shins keep some light) so he reads on a dark lobby at 4x.
 */
const CHECK_RAMPS: Record<string, number[]> = {
  skin: [PAL.S0, PAL.X1, PAL.X2, PAL.K2, PAL.K3, PAL.K4],
  hair: [PAL.N0, PAL.N0, PAL.B0, PAL.B1, PAL.K1, PAL.C4],
  tee: [PAL.N0, PAL.N1, PAL.N3, PAL.N5, PAL.N6, PAL.C5],
  belt: [PAL.N0, PAL.N0, PAL.D1, PAL.D2, PAL.D3, PAL.C3],
  jeans: [PAL.N0, PAL.N2, PAL.F2, PAL.F3, PAL.F4, PAL.C4],
  shoe: [PAL.N0, PAL.N1, PAL.G1, PAL.G2, PAL.G3, PAL.C3],
  phone: [PAL.N0, PAL.N0, PAL.N1, PAL.N3, PAL.C4, PAL.C7],
  rimS: [PAL.W6, PAL.W6, PAL.W6, PAL.W6, PAL.W6, PAL.W6],
  rimH: [PAL.W4, PAL.W4, PAL.W4, PAL.W4, PAL.W4, PAL.W4],
};
const CHECK_RIG: LightRig = {...noleRig('lit'), ramps: CHECK_RAMPS,
  backRamp: {skin: PAL.W6, hair: PAL.W4, tee: PAL.W4, jeans: PAL.W3, shoe: PAL.W3, phone: PAL.W5, belt: PAL.W3},
  keyGain: (_x, y) => (y < 50 ? 1 : Math.max(0.45, 1 - (y - 50) / 50)),
  backGain: (_x, y) => (y < 48 ? 1 : Math.max(0.5, 1 - (y - 48) / 60)),
};
const noleCache = new Map<string, Img>();
const noleFlip = (p: NolePose): Img => {
  const k = JSON.stringify(p);
  let v = noleCache.get(k);
  if (!v) { v = flipImg(renderFigure(noleFigure(p), CHECK_RIG)); noleCache.set(k, v); }
  return v;
};
const NOLE_FOOT_FLIP = NOLE_W - 1 - NOLE_FOOT[0];

const post = (b: Buf, x: number, y: number, h: number) => {
  // a brass stanchion: a weighted base, the pole lit by the downlight from above-left, the ball finial
  ellipse(x, y, 6, 2, b.ink(PAL.D2)); rect(x - 5, y - 1, 11, 1, b.ink(PAL.W4));
  rect(x - 1, y - h, 3, h, b.ink(PAL.D3)); rect(x - 1, y - h, 1, h, b.ink(PAL.W5)); rect(x + 1, y - h, 1, h, b.ink(PAL.D1));
  ellipse(x, y - h - 2, 2.5, 2.5, b.ink(PAL.W4)); b.set(x - 1, y - h - 3, PAL.W7);
};
/** a velvet rope as a list of points (3 px thick: lit top, body, shadow) */
const ropeLine = (b: Buf, pts: Array<[number, number]>) => {
  for (const [x, y] of pts) { b.set(x, y, PAL.R2); b.set(x, y + 1, PAL.R1); b.set(x, y + 2, PAL.R0); }
  for (const [x, y] of pts) if (b.get(x, y - 1) !== PAL.R1 && b.get(x, y - 1) !== PAL.R0) b.set(x, y, PAL.R2);
};
const catenary = (x0: number, y0: number, x1: number, y1: number, sag: number): Array<[number, number]> => {
  const n = Math.max(2, Math.abs(x1 - x0) + Math.abs(y1 - y0));
  const out: Array<[number, number]> = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    out.push([Math.round(x0 + (x1 - x0) * t), Math.round(y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * sag)]);
  }
  return out;
};
const hook = (b: Buf, x: number, y: number) => { rect(x - 1, y, 3, 2, b.ink(PAL.W5)); b.set(x - 1, y, PAL.W7); };
/**
 * The rope. Hooked: a sag between the finials. Dropped (k = frames since the far hook let go): the free end falls in
 * held steps and the rope ends up hanging from the NEAR post, down its side and along the floor, the brass hook
 * lying on the carpet. Drawn in two halves so NOLE can walk between the posts.
 */
const nearTop = (): [number, number] => [ROPE.nx + 1, ROPE.ny - ROPE.h + 1];
const farTop = (): [number, number] => [ROPE.fx - 1, ROPE.fy - ROPE.h + 1];
const drawRope = (b: Buf, dropK: number | null) => {
  const [ax, ay] = nearTop(), [bx, by] = farTop();
  if (dropK === null) { ropeLine(b, catenary(ax, ay, bx, by, 7)); hook(b, bx - 1, by - 1); return; }
  // the free end's path: a swing down and back toward the near post, then it lands and lies
  const ends: Array<[number, number, number]> = [[bx - 2, by + 8, 5], [bx - 9, by + 20, 4], [ax + 14, 190, 3], [ax + 12, 191, 2]];
  const [ex, ey, sag] = ends[Math.min(3, Math.floor(dropK / 2))];
  if (ey >= 189) {
    // hanging: down the post's side, a curve to the floor, then along the floor to the hook
    const pts = catenary(ax + 1, ay + 1, ax + 5, 189, 1).concat(catenary(ax + 5, 190, ex, ey, 0));
    ropeLine(b, pts);
    hook(b, ex, ey - 1);
  } else {
    ropeLine(b, catenary(ax, ay, ex, ey, sag));
    hook(b, ex, ey);
  }
};

/** the checkpoint's downlight: a pool on the carpet under the rope, one rung up in an ordered-dither seam */
const drawPool = (b: Buf) => {
  for (let y = POOL.cy - POOL.ry - 1; y <= POOL.cy + POOL.ry + 2; y++) for (let x = POOL.cx - POOL.rx - 2; x <= POOL.cx + POOL.rx + 2; x++) {
    const d = Math.hypot((x - POOL.cx) / POOL.rx, (y - POOL.cy) / POOL.ry);
    if (d < 1 && bayer(x, y) < (1 - d) * 1.6) b.set(x, y, stepColor(b.get(x, y), d < 0.6 ? 2 : 1));
  }
  // the fixture's cone, faint, from the ceiling down onto the rope (a few lifted dither rows on the dark arch)
  for (let y = 40; y < POOL.cy - 6; y++) {
    const t = (y - 40) / (POOL.cy - 46);
    const hw = 8 + t * 34;
    for (let x = Math.round(POOL.cx - hw); x <= POOL.cx + hw; x++) {
      const e = Math.abs(x - POOL.cx) / hw;
      if (bayer(x, y) < (1 - e) * 0.16 * (0.3 + t)) b.set(x, y, stepColor(b.get(x, y), 1));
    }
  }
};

/**
 * NOLE in the checkpoint light: his own drawing lifted in whole rungs, two on the head and shoulders (the downlight
 * from above), one through the chest, a dither seam to his own colours below the waist; the Orb's lens adds a rung
 * on the pixels facing it while it looks at him. His dark tee and jeans read against the lit carpet.
 */
const blitNole = (b: Buf, img: Img, x0: number, y0: number, lensOn: boolean) => {
  for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) {
    const v = img.c[j * img.w + i];
    if (v < 0) continue;
    const X = x0 + i, Y = y0 + j;
    let k = j < 22 ? 1 : j < 30 ? (bayer(X, Y) < (30 - j) / 8 ? 1 : 0) : 0;
    if (lensOn) {
      const dx = ORB_AT.x - X, dy = Y - ORB_AT.y;
      // the pixel faces the Orb if its right-hand neighbour is empty (his silhouette's Orb side) or it's high on him
      const edge = i + 1 >= img.w || img.c[j * img.w + i + 1] < 0 || (i + 2 < img.w && img.c[j * img.w + i + 2] < 0);
      if (dx > 0 && Math.abs(dy) < 20 + dx * 0.5 && edge) k += 1;
    }
    b.set(X, Y, stepColor(v, k));
  }
};

// NOLE's walk: the rig's 4 drawings (w0..w3), held, with the body placed so the planted foot stays put on the floor.
// Body advance per drawing (from the rig's own ankle positions): w0->w1 10.6, w1->w2 8.4, w2->w3 12.2, w3->w0 7.8.
const WALK_CUM = [0, 10.6, 19, 31.2];
const WALK_CYCLE = 39;
const walkPos = (n: number) => WALK_CUM[((n % 4) + 4) % 4] + WALK_CYCLE * Math.floor(n / 4);
const WALK: NoleLegs[] = ['w0', 'w1', 'w2', 'w3'];
// the step up: stand -> w0 (the far foot stays, 7.4) -> w1 (the near foot lands, 10.6) -> stand (0.8 back)
const STEP_UP_AT = 546, STEP_HOLD = 3;
const STEP_UP: Array<[NoleLegs, number]> = [['stand', 0], ['w0', 7.4], ['w1', 18], ['stand', 17.2]];
const NOLE_START = NOLE_STOP - 17;
const THROUGH_AT = D_ROPE + 4, THROUGH_HOLD = 3;

const noleAt = (f: number): {pose: NolePose; x: number} | null => {
  if (f < D_ECU) {
    const k = f < STEP_UP_AT ? 0 : Math.min(3, Math.floor((f - STEP_UP_AT) / STEP_HOLD) + 1);
    const [legs, dx] = STEP_UP[k];
    // waiting, he's on his phone; he pockets the look as he steps up
    const arm: NolePose['arm'] = f < STEP_UP_AT ? 'phone' : 'down';
    return {pose: {...NOLE_BASE, legs, arm}, x: Math.round(NOLE_START + dx)};
  }
  if (f < THROUGH_AT) {
    // the appeal: a point at the Orb, two jabs, then the phone held up at it (the technicality, presumably)
    const arm: NolePose['arm'] = f < 684 ? 'point' : f < 687 ? 'jab' : f < 690 ? 'jab2' : f < D_ROPE + 1 ? 'raise' : 'down';
    const mouth = (f < D_ROPE ? [2, 1, 2, 0, 2, 1][Math.floor((f - D_WIDE2) / 3) % 6] : 0) as 0 | 1 | 2;
    return {pose: {...NOLE_BASE, arm, mouth, brow: f < D_ROPE ? 1 : 0}, x: NOLE_STOP};
  }
  // let through: brisk, drawings on 3s, the planted foot never slides; behind the Orb and on toward the right arch
  const n = Math.floor((f - THROUGH_AT) / THROUGH_HOLD);
  const x = Math.round(NOLE_STOP + 7.4 + walkPos(n));
  return {pose: {...NOLE_BASE, legs: WALK[n % 4]}, x};
};
// footfalls for the sound (a heel strike on each w0 / w2 drawing, and the step up's landing)
NOLE_STEPS.push(STEP_UP_AT, STEP_UP_AT + STEP_HOLD * 1);
for (let f = THROUGH_AT; f < D1; f++) if ((f - THROUGH_AT) % (THROUGH_HOLD * 2) === 0) NOLE_STEPS.push(f);

/** the Orb's look through the payoff: his finger, the phone he holds up, down at the rope, and the camera */
const orbLookPayoff = (f: number): [number, number] => {
  if (f < 684) return [-0.75, 0.15];
  if (f < 690) return [-0.8, 0.05];
  if (f < D_ROPE) return [-0.55, -0.35]; // up at the phone
  if (f < D_ROPE + 4) return [-0.35, 0.7]; // down at the rope as it lets go
  if (f < D_TURN - 1) return [0.45, 0.2]; // after him as he passes behind it
  if (f < D_TURN) return [0.2, 0.1]; // the in-between drawing
  return [0.0, 0.0]; // to us
};

/** the lobby wide with the checkpoint */
const drawLobbyWide = (b: Buf, f: number, s: {nole: {pose: NolePose; x: number} | null; guestX: number | null; orbLook: [number, number]; ap: number; dropK: number | null; lens: boolean}) => {
  drawLobby(b, {f, time: 'night', sign: 1, days: '0'}, {lobby: (bb) => {
    drawPool(bb);
    // the guest it cleared, walking on (beyond the rope, toward the elevators' side); extras hop, they don't cycle
    if (s.guestX != null) {
      const img = walkoutExtra(7, {box: false, coat: 4});
      const bob = Math.floor(f / 3) % 2;
      blitImg(bb, img, s.guestX - 15, FEET - 8 - EXTRA_H + 1 - bob);
    }
    post(bb, ROPE.fx, ROPE.fy, ROPE.h);
    if (s.dropK === null) drawRope(bb, null);
    if (s.nole) {
      const img = noleFlip(s.nole.pose);
      const x0 = s.nole.x - NOLE_FOOT_FLIP, y0 = FEET - NOLE_FOOT[1];
      // his contact shadow on the lit carpet (under the downlight, a short dark oval at his feet)
      for (let i = -9; i <= 9; i++) for (let j = 0; j <= 1; j++) if (Math.abs(i) < 9 - j * 3) bb.set(s.nole.x + i, FEET + j, stepColor(bb.get(s.nole.x + i, FEET + j), -2));
      blitNole(bb, img, x0, y0, s.lens);
    }
    post(bb, ROPE.nx, ROPE.ny, ROPE.h);
    if (s.dropK !== null) drawRope(bb, s.dropK);
    const bob = orbBob(f);
    drawOrb(bb, ORB_AT.x, ORB_AT.y + bob, ORB_AT.r, {look: s.orbLook, aperture: s.ap, monitor: -1, scanning: false});
    // the Orb's small shadow on the carpet, far below it (in the pool: a rung down)
    for (let i = -5; i <= 5; i++) bb.set(ORB_AT.x + i, FEET + 4, stepColor(bb.get(ORB_AT.x + i, FEET + 4), -2));
  }});
};

// ------------------------------------------------------------------ the Orb's eye (close-up, native radius)
/**
 * The lobby behind the Orb at close-up, painted at the Orb's own density and out of focus the pixel way: the room as a
 * few big soft shapes (the dark arch, the rack pillar, the floor), its lights as hard-edged six-sided bokeh (the
 * Orb's blades are the lens here): the pillar's cyan LEDs, the city's windows through the entrance, the brass finials,
 * the rope a soft red band. No upscaled room, no mixed pixel sizes.
 */
const drawECUBackdrop = (b: Buf, f: number) => {
  for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) {
    // the back wall: N1 falling to N0 at the top, a soft lift where the downlight grazes it (right of centre)
    const d = Math.hypot((x - 330) / 190, (y - 150) / 120);
    let c = y < 26 ? PAL.N0 : PAL.N1;
    if (y >= 26 && y < 40 && bayer(x, y) < (y - 26) / 14) c = PAL.N1;
    if (d < 1 && bayer(x, y) < (1 - d) * 0.9) c = PAL.N2;
    // the floor: a warmer dark band, the pool's light on it
    if (y > 168) c = bayer(x, y) < 0.5 ? PAL.D0 : PAL.N1;
    if (y > 176 && Math.hypot((x - 300) / 150, (y - 200) / 24) < 1 && bayer(x, y) < 0.6) c = PAL.D1;
    b.set(x, y, c);
  }
  // the entrance's glass wall at the far left: a tall soft panel, its mullion a soft darker band
  for (let y = 20; y < 170; y++) for (let x = 0; x < 92; x++) if (x < 84 || bayer(x, y) < (92 - x) / 8) b.set(x, y, x > 40 && x < 50 ? PAL.N1 : PAL.N2);
  // the rack pillar right of the Orb: a wide soft column (it is close to the Orb, so only a little soft)
  for (let y = 0; y < 203; y++) for (let x = 372; x < 424; x++) {
    const e = Math.min(x - 372, 423 - x);
    if (e < 3 && bayer(x, y) > e / 3) continue;
    b.set(x, y, x < 380 ? PAL.C0 : x > 416 ? PAL.N0 : PAL.N2);
  }
  // the dark arch behind, centre right: a big soft shape
  for (let y = 36; y < 170; y++) for (let x = 244; x < 350; x++) {
    const inArch = y > 80 ? Math.abs(x - 297) < 44 : Math.hypot((x - 297) / 44, (y - 80) / 44) < 1;
    if (inArch && bayer(x, y) < 0.85) b.set(x, y, PAL.N0);
  }
  // bokeh: the city's lit windows through the glass (warm), the rose window's cyan above, the pillar's LED column,
  // the brass finials of the rope and the rope itself low across the frame. Deterministic positions; a slow twinkle
  // on a few (whole-disc swaps on the city's own 90-frame window cycle), never a flicker
  const warm: Array<[number, number, number]> = [[14, 58, 7], [36, 44, 9], [60, 70, 6], [22, 96, 8], [70, 104, 7], [48, 128, 9], [12, 136, 6], [80, 142, 5]];
  const HEX = {sides: 6, rot: 0.3};
  warm.forEach(([x, y, r], k) => {
    const lit = hash(k, 3, 5 + Math.floor(f / 90)) < 0.8;
    if (lit) bokeh(b, x, y, r, k % 2 ? PAL.W1 : PAL.W2, k % 3 ? PAL.W3 : PAL.W4, HEX);
  });
  for (const [x, y, r] of [[168, 12, 9], [196, 6, 7], [214, 22, 6], [150, 30, 5]] as Array<[number, number, number]>) bokeh(b, x, y, r, PAL.C0, PAL.C2, HEX);
  for (let k = 0; k < 8; k++) bokeh(b, 390 + (k % 2) * 16, 10 + k * 25, 7, PAL.C1, k % 3 === 0 ? PAL.C4 : PAL.C2, HEX);
  bokeh(b, 450, 150, 10, PAL.W1, PAL.W3, HEX);
  bokeh(b, 150, 160, 8, PAL.W1, PAL.W2, HEX);
  // the rope, far and soft: a wide dark-red band with one lit rung along its top
  for (let x = 150; x < 450; x++) {
    const y = Math.round(172 + Math.sin(((x - 150) / 300) * Math.PI) * 8);
    for (let j = -3; j <= 3; j++) b.set(x, y + j, j === -3 ? PAL.R1 : j === 3 ? (bayer(x, y + j) < 0.5 ? PAL.R0 : b.get(x, y + j)) : PAL.R0);
  }
};
const drawOrbECU = (b: Buf, f: number, ap: number, look: [number, number]) => {
  drawECUBackdrop(b, f);
  drawOrb(b, 240, 101 + orbBob(f), 64, {look, aperture: ap, monitor: -1});
};

// ------------------------------------------------------------------ the Orb's view
const VIEW = {cx: 240, cy: 101, R: 100};
/** what the Orb sees, rectilinear, before the lens: NOLE close at the rope, the entrance soft behind him */
const drawPOVPlate = (b: Buf, f: number) => {
  const L = lobbyLayers({f, time: 'night', sign: 1, days: '0'});
  // behind him: the entrance and the revolving door (the Orb faces the way he came in), a rung darker, stepped soft
  for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) b.set(x, y, stepColor(L.far.get(clamp(Math.round(x * 0.62) - 10, 0, 479), clamp(Math.round(y * 0.62) + 50, 0, 202)), -1));
  overlay(b, L.door, -10, 0);
  stepDefocus(b, 0, 0, 480, 203, 2);
  // NOLE, close: his conversation portrait (the approved drawing), phone and all. He reacts, never glossy
  const blink = f >= 622 && f < 625 ? ([1, 2, 1] as const)[f - 622] : 0;
  const np = {...NOLE_PORTRAIT_REST, blink: blink as 0 | 1 | 2, brow: (f >= 630 ? 1 : 0) as 0 | 1, mouth: (f >= D_STAMP + 4 ? 1 : 0) as 0 | 1};
  const img = nolePortraitImg(np);
  blitImg(b, img, VIEW.cx - 56 + 6, 203 - 136 + 4);
};
/** the scanner's face box (lens coords) */
const BOX = {x0: 218, y0: 72, x1: 286, y1: 146};
const drawLensView = (b: Buf, f: number) => {
  // the housing around the lens: near-black, the retracted blades' edges, the chrome barrel's rim
  rect(0, 0, 480, 203, b.ink(PAL.N0));
  irisBlades(b, VIEW.cx, VIEW.cy, 1, VIEW.R + 8, {rot: 0.3});
  const plate = new Buf(480, 203, PAL.N0);
  drawPOVPlate(plate, f);
  // the scan line crosses him top to bottom in held steps (the line one cold row, one rung lift trailing it)
  if (f >= D_SCAN && f < D_SCAN + 22) {
    const y = 36 + Math.floor((f - D_SCAN) / 2) * 12;
    for (let x = 0; x < 480; x++) {
      plate.set(x, y, PAL.C7);
      for (let j = 1; j <= 5; j++) plate.set(x, y - j, stepColor(plate.get(x, y - j), j < 3 ? 1 : 0));
    }
  }
  fisheye(plate, b, VIEW.cx, VIEW.cy, VIEW.R, {k: 0.42});
  // the lens: its barrel ring (chrome: the lobby's cyan on one side, the key's white arc on the other)
  for (let y = VIEW.cy - VIEW.R - 7; y <= VIEW.cy + VIEW.R + 7; y++) for (let x = VIEW.cx - VIEW.R - 7; x <= VIEW.cx + VIEW.R + 7; x++) {
    const dx = x + 0.5 - VIEW.cx, dy = y + 0.5 - VIEW.cy, r = Math.hypot(dx, dy);
    if (r < VIEW.R - 1 || r > VIEW.R + 6) continue;
    const a = Math.atan2(dy, dx);
    const band = r - VIEW.R;
    let c: number;
    if (band < 0) c = PAL.N0;
    else if (band < 2) c = a < -1.6 && a > -2.9 ? PAL.G6 : a > 0.3 && a < 1.4 ? PAL.C4 : PAL.G3;
    else if (band < 4) c = a < -1.4 && a > -3.0 ? PAL.G4 : a > 0.2 && a < 1.6 ? PAL.C2 : PAL.G1;
    else c = PAL.N1;
    b.set(x, y, c);
  }
  // one specular sweep across the glass, once, right after it opens
  if (f >= D_VIEW + 2 && f < D_VIEW + 14) specularSweep(b, VIEW.cx, VIEW.cy, VIEW.R - 1, (f - D_VIEW - 2) / 11, 12, 1);
  // the scanner's own marks: corner brackets on his face while it scans (thin, the Orb's cyan), and his ID tag hung
  // off the top-left bracket from the first pass of the line (so nobody mistakes who is being scanned)
  const col = f >= D_VERDICT ? PAL.R3 : PAL.C6;
  if (f >= D_SCAN && f < D_VERDICT + 30) {
    for (const [x, y, sx, sy] of [[BOX.x0, BOX.y0, 1, 1], [BOX.x1, BOX.y0, -1, 1], [BOX.x0, BOX.y1, 1, -1], [BOX.x1, BOX.y1, -1, -1]] as Array<[number, number, number, number]>) {
      for (let k = 0; k < 7; k++) { b.set(x + k * sx, y, col); b.set(x, y + k * sy, col); }
    }
  }
  if (f >= D_SCAN + 4) {
    const s = 'ID: NOLE';
    const w = tinyWidth(s) + 6, x = BOX.x0, y = BOX.y0 - 11;
    rect(x - 1, y - 1, w + 2, 10, b.ink(PAL.N0));
    rect(x, y, w, 8, b.ink(f >= D_VERDICT ? PAL.R1 : PAL.C2));
    tiny(b, s, x + 3, y + 2, f >= D_VERDICT ? PAL.P2 : PAL.C8);
  }
  // the verdict: a flat readout plate, then (after the long beat) the small stamp
  if (f >= D_VERDICT) {
    const s = 'NOT VERIFIED';
    const w = osdWidth(s) + 12, x = VIEW.cx - Math.round(w / 2), y = 150;
    rect(x - 1, y - 1, w + 2, 15, b.ink(PAL.N0));
    rect(x, y, w, 13, b.ink(PAL.R1));
    rect(x, y, w, 1, b.ink(PAL.R2));
    osdText(b, s, x + 6, y + 3, PAL.P2);
  }
  if (f >= D_STAMP) {
    // a rubber stamp: a dark card under it (nothing of the picture shows through the words), a ruled double border
    // with two deliberate ink breaks, the words in the stamp's red. It lands a pixel low on its first frame
    const s = '...human? probably?';
    const w = textWidth(s) + 12, h = 15;
    const kick = f === D_STAMP ? 1 : 0;
    const x = VIEW.cx - Math.round(w / 2) + kick, y = 169 + kick;
    rect(x - 1, y - 1, w + 2, h + 2, b.ink(PAL.N0));
    rect(x, y, w, h, b.ink(PAL.N1));
    const ink = PAL.R3;
    for (let i = 0; i < w; i++) { b.set(x + i, y, ink); b.set(x + i, y + h - 1, ink); }
    for (let j = 0; j < h; j++) { b.set(x, y + j, ink); b.set(x + w - 1, y + j, ink); }
    for (let i = 2; i < w - 2; i++) { b.set(x + i, y + 2, PAL.R2); b.set(x + i, y + h - 3, PAL.R2); }
    for (const [i, j] of [[17, 0], [18, 0], [w - 29, h - 1]]) b.set(x + i, y + j, PAL.N1); // the ink breaks
    text(b, s, x + 6, y + 4, ink);
  }
};

/** from inside: the blades over the lens view, open 0..1 */
const drawBladesOver = (b: Buf, f: number, open: number) => {
  drawLensView(b, f);
  if (open < 1) irisBlades(b, VIEW.cx, VIEW.cy, open, 300, {rot: 0.3 + (1 - open) * 0.5});
};

export const clipD = (f: number, room: Buf): {view: View} => {
  if (f < D_ECU) {
    // the Orb holds on the lane (the guest it cleared), then turns to him on the beat as he stops
    const look: [number, number] = f < 555 ? [0.6, 0.05] : f === 555 ? [-0.1, 0.1] : [-0.75, 0.15];
    drawLobbyWide(room, f, {nole: noleAt(f), guestX: null, orbLook: look, ap: f < 556 ? 0.45 : 0.6, dropK: null, lens: f >= 556});
    return {view: WIDE};
  }
  if (f < D_IN) {
    const ap = [0.45, 0.45, 0.62, 0.62, 0.62, 0.8, 0.8, 0.8, 0.95, 0.95][f - D_ECU];
    drawOrbECU(room, f, ap, [0.04, 0.02]);
  } else if (f < D_VIEW) {
    drawBladesOver(room, f, [0, 0.22, 0.48, 0.74, 0.92][f - D_IN]);
  } else if (f < D_CLOSE) {
    drawLensView(room, f);
  } else if (f < D_ECU2) {
    drawBladesOver(room, f, [0.74, 0.48, 0.22, 0.06, 0][f - D_CLOSE]);
  } else if (f < D_WIDE2) {
    const k = f - D_ECU2;
    const ap = k < 3 ? 0.2 : k < 7 ? 0.4 : 0.55;
    drawOrbECU(room, f, ap, k < 9 ? [0.04, 0.02] : [-0.45, 0.08]);
  } else if (f < D_TURN) {
    const ap = f >= 684 && f < D_ROPE ? 0.35 : 0.55;
    drawLobbyWide(room, f, {nole: noleAt(f), guestX: null, orbLook: orbLookPayoff(f), ap, dropK: f < D_ROPE ? null : f - D_ROPE, lens: f < D_ROPE + 4});
  } else {
    // the button: cut to its eye as the cue resolves, the Orb finishing its turn to us (one in-between drawing), the
    // aperture opening a step once it's looking. NOLE is out of frame; it isn't
    const k = f - D_TURN;
    const look: [number, number] = k < 1 ? [0.45, 0.2] : k < 3 ? [0.2, 0.08] : [0.0, 0.0];
    drawOrbECU(room, f, k < 6 ? 0.5 : 0.62, look);
  }
  return {view: WIDE};
};
export {LOBBY};
