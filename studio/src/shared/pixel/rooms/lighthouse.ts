// MR. MAS — shared room: INT. MISANTHROPIC LIGHTHOUSE — NIGHT. Home room (ep01 sc 11, 19, 27; ep02 on).
// Owner: rooms B. A 480x203 room plate.
//
// Inside the lighthouse of stacked essays: a round brick tower (Misanthropic brick, off-brand #B8573A, built from the
// master palette's W/U reds), its courses bowed like the inside of a bowl; a spiral stair of BOUND DRAFTS climbing the
// wall from behind the desk to the lantern gallery; at the top THE LAMP (a beehive lens, SAFETY on its plinth) turning
// in held steps, its bright panel sweeping round and a band of light walking the upper wall; paper stacked everywhere.
// MARIO's desk centre, lit by a brass desk lamp: two phones, the first with a small throne attached to its handset.
// Optional: the two RENT METERS hanging from the gallery (sc 27: NOZAMA · UP TO $4B, ELGOOG · UP TO $2B; sc 19: one).
// Mario is never red (guardrail): the room keeps red to the Misanthropic brick; his desk is wood, parchment, ink blue;
// the meters' RENT flags are amber, not red.
import {Buf, Plot, rect, line, poly, ellipse, hash, bayer, clamp} from '../px';
import {PAL, PalName, stepColor} from '../palette';
import {MatBuf, resolve, defineMat} from '../light';
import {text, textWidth} from '../font';
import type {Img} from '../figure';
import {ROOM_W, ROOM_H, RoomOut, newRoomOut, tiny, tinyWidth, newImg, imgPut, put} from './kit-b';

// ------------------------------------------------------------------ geometry
export const LIGHTHOUSE = {
  eyeY: 116,
  /** focal length of the curved wall: courses bow by 1/cos(theta), theta = atan((x - 240) / F) */
  F: 300,
  /** the wall meets the floor at this height (centre); the junction bows down toward the edges */
  floorC: 166,
  /** the lantern gallery's floor line (centre) */
  galleryC: 50,
  desk: {x0: 150, x1: 318, back: 150, front: 156, panel: 188},
  lamp: {cx: 240, cy: 25, rx: 21, ry: 20},
  /** one revolution of the lamp, frames (2 bars at 96 BPM). 4 flash panels: one faces us every 30 frames (2 beats). */
  period: 120,
};
const L = LIGHTHOUSE;
const theta = (x: number) => Math.atan((x + 0.5 - 240) / L.F);
/** screen y of a wall height given as its centre-screen y (a course/junction bowing with 1/cos) */
export const bowY = (yCentre: number, x: number) => L.eyeY + (yCentre - L.eyeY) / Math.cos(theta(x));

// ------------------------------------------------------------------ materials. Slots: [night ambient], [the LAMP (the
// beam, warm-white)], [the desk lamp's tungsten]. index 0 unlit .. 7 hottest.
const M = (name: string, amb: PalName[], lamp: PalName[], warm: PalName[]) => { defineMat(name, amb, lamp, warm); return name; };
const BRICK = M('lh.brick', ['N0', 'N1', 'U0', 'W1', 'W2', 'W3', 'U4', 'U5'], ['N1', 'W1', 'W2', 'W3', 'W4', 'U5', 'W5', 'W6'], ['N0', 'W0', 'W1', 'W2', 'W3', 'W4', 'U5', 'W5']);
const PAPER = M('lh.paper', ['N1', 'N2', 'N3', 'G2', 'G3', 'G4', 'P0', 'P1'], ['N2', 'U2', 'P0', 'P1', 'P1', 'P2', 'W8', 'W9'], ['N2', 'W1', 'W3', 'D4', 'P0', 'P1', 'W8', 'P2']);
const WOOD = M('lh.wood', ['N0', 'D0', 'D1', 'D2', 'D3', 'D4', 'W3', 'W4'], ['N0', 'D1', 'D2', 'D3', 'D4', 'W3', 'W5', 'W6'], ['N0', 'D0', 'D1', 'D2', 'D3', 'D4', 'W4', 'W5']);
const IRON = M('lh.iron', ['N0', 'N0', 'N1', 'N1', 'N2', 'N3', 'N4', 'N5'], ['N0', 'N1', 'N2', 'W1', 'W2', 'W4', 'W6', 'W8'], ['N0', 'N1', 'W0', 'W1', 'W2', 'W3', 'W5', 'W6']);
const FLOOR = M('lh.floor', ['N0', 'N1', 'D0', 'D1', 'D2', 'D3', 'D4', 'W3'], ['N0', 'D0', 'D1', 'D2', 'D3', 'D4', 'W3', 'W4'], ['N0', 'D0', 'D1', 'D2', 'D3', 'D4', 'W3', 'W4']);
const INK = M('lh.ink', ['N0', 'F0', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6'], ['N0', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'P1'], ['N0', 'F0', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6']);
const BRASS = M('lh.brass', ['N0', 'D0', 'D1', 'D2', 'D3', 'W3', 'W4', 'W5'], ['N0', 'D2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'], ['N0', 'D1', 'D3', 'W4', 'W5', 'W6', 'W7', 'W8']);

const R = {none: 0, wall: 1, floor: 2, stair: 3, gallery: 4, lantern: 5, furniture: 6, paper: 7, window: 8, desk: 9} as const;
type RegionName = Exclude<keyof typeof R, 'none'>;
const REGION_NAMES = Object.keys(R).filter((k) => k !== 'none') as RegionName[];

export interface LighthouseOpts {
  /** 0, 1 (sc 19: NOZAMA only) or 2 (sc 27: NOZAMA + ELGOOG) rent meters hanging from the gallery */
  meters?: 0 | 1 | 2;
  /** phone 1 (the throne line): 'cradle' | 'off' (lifted: the cast draws the handset in a hand, see handsetImg) */
  phone1?: 'cradle' | 'off';
  /** the throne: on the handset / tipped over on the desk (after the click) / gone */
  throne?: 'on' | 'fallen' | 'none';
  /** frame the phones start ringing (null = silent). The handset hops on the ring cadence. */
  ring1?: number | null;
  ring2?: number | null;
  phone2?: 'cradle' | 'off';
  /** the lamp turns (default true); false holds it on the panel facing us */
  lampTurns?: boolean;
}

interface Paint { mb: MatBuf; reg: Uint8Array; brick?: Int32Array }
const P = (p: Paint, mat: string, lvl: number, region: number): Plot => {
  const m = p.mb.mat(mat, lvl);
  return (x, y) => { if (x < 0 || y < 0 || x >= ROOM_W || y >= ROOM_H) return; m(x, y); p.reg[(y | 0) * ROOM_W + (x | 0)] = region; };
};
const E = (p: Paint, col: number, region: number): Plot => {
  const m = p.mb.emit(col);
  return (x, y) => { if (x < 0 || y < 0 || x >= ROOM_W || y >= ROOM_H) return; m(x, y); p.reg[(y | 0) * ROOM_W + (x | 0)] = region; };
};
const S = (p: Paint, d: number): Plot => p.mb.shade(d);

// ------------------------------------------------------------------ the tower
const paintWall = (p: Paint) => {
  for (let x = 0; x < ROOM_W; x++) {
    const th = theta(x);
    const c = Math.cos(th);
    const yTop = Math.round(bowY(L.galleryC, x)), yBot = Math.round(bowY(L.floorC, x));
    for (let y = Math.max(0, yTop); y < Math.min(ROOM_H, yBot); y++) {
      // unproject: wall height (in centre px) and arc length (in centre px)
      const z = (L.eyeY - (y + 0.5)) * c; // + above the eye
      const s = th * L.F;
      const course = Math.floor(z / 5);
      const inC = z - course * 5;
      const off = (course & 1) * 7;
      const bi = Math.floor((s + off + 1000) / 14);
      const inB = (s + off + 1000) - bi * 14;
      const mortarH = inC < 1;
      const mortarV = inB < 1.2 / c; // vertical joints stay 1px wide as the bricks stretch
      const lvl = mortarH || mortarV ? -1.3 : (hash(course, bi, 5) - 0.5) * 0.9 + (hash(course, bi, 9) < 0.07 ? -0.8 : 0);
      P(p, BRICK, lvl, R.wall)(x, y);
      if (p.brick) p.brick[y * ROOM_W + x] = mortarH || mortarV ? -1 : ((course + 500) * 4096 + bi) & 0x7fffffff;
    }
  }
};

const paintFloor = (p: Paint) => {
  for (let x = 0; x < ROOM_W; x++) {
    const yB = Math.round(bowY(L.floorC, x));
    for (let y = Math.max(0, yB); y < ROOM_H; y++) {
      // planks radiating from the tower's centre (below us): lines toward a far point under the frame
      const u = (x - 240) / (y - 80);
      const k = Math.floor(u * 9 + 100);
      const edge = Math.abs(u * 9 + 100 - k) < 0.08 + 0.002 * (y - yB);
      P(p, FLOOR, edge ? -1.2 : (hash(k, 3, 7) - 0.5) * 0.7, R.floor)(x, y);
    }
    // the base course is darker (a skirting of stone)
    for (let y = yB - 3; y < yB; y++) if (y >= 0) S(p, -0.9)(x, y);
    if (yB >= 0 && yB < ROOM_H) S(p, -1.4)(x, yB);
  }
};

/** Slit windows in the curved wall: deep embrasures, the night sea beyond. [x centre, y centre (at centre bow), w, h] */
const WINDOWS: Array<[number, number, number, number]> = [[64, 96, 12, 26], [424, 90, 12, 26]];
const paintWindows = (p: Paint) => {
  for (const [wx, wy, w, h] of WINDOWS) {
    const y0 = Math.round(bowY(wy - h / 2, wx)), y1 = Math.round(bowY(wy + h / 2, wx));
    const x0 = wx - w / 2, x1 = wx + w / 2;
    // embrasure (the wall's thickness, splayed), then the arched opening
    for (let y = y0 - 3; y <= y1 + 2; y++) for (let x = x0 - 4; x <= x1 + 4; x++) {
      const arch = y < y0 + w / 2 ? Math.hypot(x - wx, y - (y0 + w / 2)) <= w / 2 + 4 : true;
      if (arch) P(p, BRICK, -1.8, R.wall)(x, y);
    }
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const arch = y < y0 + w / 2 ? Math.hypot(x + 0.5 - wx, y - (y0 + w / 2)) <= w / 2 : true;
      if (!arch) continue;
      const t = (y - y0) / (y1 - y0);
      E(p, t > 0.72 ? ((x + y) % 3 === 0 ? PAL.N5 : PAL.N3) : t > 0.68 ? PAL.N4 : bayer(x, y) < 0.3 ? PAL.N3 : PAL.N2, R.window)(x, y);
    }
    // a star, a sill
    E(p, PAL.N7, R.window)(wx - 2, y0 + 6);
    rect(x0 - 4, y1 + 2, w + 9, 2, P(p, BRICK, 0.8, R.wall));
  }
};

// ------------------------------------------------------------------ the stair of bound drafts
/** step i -> [x centre, y of the tread's front top edge, width] along the helix as it bows round the wall */
export const STAIR_STEPS = (() => {
  const out: Array<[number, number, number]> = [];
  const N = 19;
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const th = -0.62 + t * 1.22; // radians: from far left round to the right
    const x = 240 + Math.tan(th) * L.F;
    const yc = 168 - t * 104; // height on the wall (at the centre bow)
    const y = L.eyeY + (yc - L.eyeY) / Math.cos(th);
    const w = Math.round(22 / Math.cos(th) / Math.cos(th) * 0.8);
    out.push([Math.round(x), Math.round(y), Math.min(34, w)]);
  }
  return out;
})();
const COVERS: PalName[][] = [['F1', 'F2', 'F3'], ['D2', 'D3', 'D4'], ['N3', 'N4', 'N5'], ['F2', 'F3', 'F4'], ['G1', 'G2', 'G3'], ['U1', 'U2', 'U3']];
const paintStair = (p: Paint) => {
  // the stringer: an iron band under the steps, cantilevered from the wall (drawn first)
  for (let i = 0; i < STAIR_STEPS.length - 1; i++) {
    const [xa, ya, wa] = STAIR_STEPS[i], [xb, yb] = STAIR_STEPS[i + 1];
    for (let d = 0; d < 3; d++) line(xa - Math.floor(wa / 2), ya + 10 + d, xb - Math.floor(wa / 2), yb + 10 + d, P(p, IRON, d === 0 ? 0.6 : -0.4, R.stair));
  }
  STAIR_STEPS.forEach(([x, y, w], i) => {
    if (x < -40 || x > ROOM_W + 40) return;
    const x0 = x - Math.floor(w / 2);
    const riser = 9;
    // a BOUND DRAFT: the top cover (coloured board), the page block (cream edges with ruled lines), the bottom board
    const cover = i % 4 === 0 ? INK : i % 4 === 1 ? WOOD : i % 4 === 2 ? INK : BRICK;
    rect(x0 - 1, y - 2, w + 2, 2, P(p, cover, i % 4 === 3 ? 1.2 : 1.0, R.stair));
    rect(x0 - 1, y - 2, w + 2, 1, S(p, 0.9));
    for (let j = 0; j < riser - 2; j++) rect(x0, y + j, w, 1, P(p, PAPER, j % 2 ? -0.7 : 0.3, R.stair));
    rect(x0 - 1, y + riser - 2, w + 2, 2, P(p, cover, -0.3, R.stair));
    rect(x0, y, 1, riser - 2, P(p, PAPER, -1.5, R.stair)); // the shadow end of the block
    // a spine label or a binder clip on some
    if (i % 3 === 0) rect(x0 + Math.floor(w / 2) - 2, y + 2, 5, 3, P(p, PAPER, 1.2, R.stair));
    if (i % 3 === 1) rect(x0 + 3, y - 3, 3, 3, P(p, IRON, 1.5, R.stair));
    // shadow under the step on the wall
    rect(x0, y + riser, w + 1, 4, (px, py) => { if (py >= 0 && py < ROOM_H && p.reg[py * ROOM_W + px] === R.wall) S(p, -1.5)(px, py); });
    // the rope handrail's stanchions
    if (i % 3 === 1) rect(x0 + w - 3, y - 24, 1, 22, P(p, IRON, 0.6, R.stair));
    // a small stack of loose drafts left on every fourth step
    if (i % 4 === 2) for (let k = 0; k < 4; k++) rect(x0 + 4 + (k % 2), y - 3 - k, w - 10, 1, P(p, PAPER, k % 2 ? -0.4 : 0.6, R.paper));
  });
  // the handrail: a rope line joining the stanchion tops
  for (let i = 0; i < STAIR_STEPS.length - 1; i++) {
    const [xa, ya, wa] = STAIR_STEPS[i], [xb, yb, wb] = STAIR_STEPS[i + 1];
    line(xa + Math.floor(wa / 2) - 3, ya - 24, xb + Math.floor(wb / 2) - 3, yb - 24, P(p, WOOD, 1.4, R.stair));
  }
};

// ------------------------------------------------------------------ the gallery + the lantern at the top
const paintGallery = (p: Paint) => {
  // the lantern room behind the gallery: its glazing (night sky, emissive), the iron astragals
  for (let x = 0; x < ROOM_W; x++) {
    const yG = Math.round(bowY(L.galleryC, x));
    for (let y = 0; y < Math.min(ROOM_H, yG); y++) {
      const t = y / Math.max(1, yG);
      E(p, bayer(x, y) < 0.18 + t * 0.2 ? PAL.N3 : PAL.N2, R.lantern)(x, y);
    }
  }
  for (let k = -6; k <= 6; k++) { // astragals (window bars) curving with the lantern
    const th = k * 0.13;
    const x = Math.round(240 + Math.tan(th) * L.F * 0.85);
    for (let y = 0; y < Math.round(bowY(L.galleryC, x)); y++) P(p, IRON, 0.2, R.lantern)(x, y);
  }
  for (const yc of [8, 30]) for (let x = 0; x < ROOM_W; x++) { const y = Math.round(L.eyeY + (yc - L.eyeY) / Math.cos(theta(x)) * 1.0); if (y >= 0 && y < bowY(L.galleryC, x)) P(p, IRON, 0.2, R.lantern)(x, y); }
  // stars through the glass
  for (let k = 0; k < 40; k++) { const x = Math.floor(hash(k, 1, 31) * 480), y = Math.floor(hash(k, 2, 31) * 44); if (y < bowY(L.galleryC, x) - 2) E(p, hash(k, 3, 31) < 0.3 ? PAL.N7 : PAL.N5, R.lantern)(x, y); }
  // the gallery floor: an iron ring seen edge-on (bowing), its fascia, the railing + balusters
  for (let x = 0; x < ROOM_W; x++) {
    const yG = Math.round(bowY(L.galleryC, x));
    for (let j = 0; j < 5; j++) P(p, IRON, j === 0 ? 1.4 : j === 4 ? -0.8 : 0.4, R.gallery)(x, yG + j);
    for (let j = 5; j < 7; j++) P(p, IRON, -1.2, R.gallery)(x, yG + j); // its shadow on the wall
    // railing top rail 11px above the floor, mid rail 6px
    P(p, IRON, 0.9, R.gallery)(x, yG - 11);
    P(p, IRON, 0.2, R.gallery)(x, yG - 6);
  }
  for (let k = -30; k <= 30; k++) {
    const th = k * 0.032;
    const x = Math.round(240 + Math.tan(th) * L.F);
    if (x < 0 || x >= ROOM_W) continue;
    const yG = Math.round(bowY(L.galleryC, x));
    for (let y = yG - 11; y < yG; y++) P(p, IRON, 0.3, R.gallery)(x, y);
  }
  // the lamp's plinth (a squat drum on the gallery floor)
  const {cx, cy, rx, ry} = L.lamp;
  const yG = Math.round(bowY(L.galleryC, cx));
  rect(cx - 16, cy + ry - 2, 33, yG - (cy + ry - 2), P(p, BRASS, -0.6, R.gallery));
  rect(cx - 16, cy + ry - 2, 33, 1, S(p, 1.2));
  rect(cx - 18, yG - 2, 37, 2, P(p, BRASS, -0.2, R.gallery));
};

/** Lamp turn angle (degrees) at frame f, in 3-frame holds (whole-pixel motion on the lens). */
export const lampTurn = (f: number, turns = true) => (turns ? ((Math.floor(f / 3) * 3) / L.period) * 360 : 0);
/** x of the beam's hit on the back wall (the panel facing AWAY from us), or null when no panel points at the wall. */
export const lampSweepX = (f: number, turns = true): {x: number; k: number} | null => {
  const t = lampTurn(f, turns);
  for (let k = 0; k < 4; k++) {
    let a = ((t + k * 90 + 180) % 360 + 360) % 360; if (a > 180) a -= 360; // 0 = pointing straight at the back wall
    if (Math.abs(a) < 48) return {x: Math.round(240 + Math.tan((a * Math.PI) / 180) * L.F * 0.95), k: Math.cos((a * Math.PI) / 180)};
  }
  return null;
};

/** The lens: a beehive of prism rings in a brass cage; four bullseye panels turn round it (held steps). */
const drawLamp = (b: Buf, f: number, turns: boolean) => {
  const {cx, cy, rx, ry} = L.lamp;
  const t = lampTurn(f, turns);
  const halfAt = (j: number) => Math.round(rx * Math.sqrt(Math.max(0, 1 - Math.pow(j / (ry + 1), 2))));
  // the prism body: horizontal rings, brighter toward the middle band, brass verticals where panels meet
  const seams: number[] = [];
  for (let k = 0; k < 8; k++) { const a = ((t + k * 45 + 22.5) * Math.PI) / 180; if (Math.cos(a) > 0.05) seams.push(Math.sin(a)); }
  for (let j = -ry; j <= ry; j++) {
    const half = halfAt(j);
    for (let i = -half; i <= half; i++) {
      const x = cx + i, y = cy + j;
      const u = i / Math.max(1, half);
      const facing = Math.sqrt(Math.max(0, 1 - u * u));
      const ring = ((j + 40) % 4) === 0;
      let c = ring ? (facing > 0.6 ? PAL.W5 : PAL.W4) : facing > 0.8 ? PAL.W6 : facing > 0.45 ? PAL.W5 : PAL.W4;
      if (Math.abs(j) < 3 && !ring) c = facing > 0.5 ? PAL.W7 : PAL.W6; // the burner band
      for (const sx of seams) if (Math.abs(u - sx) < 1.2 / Math.max(1, half)) c = PAL.W3;
      if (i === -half || i === half) c = PAL.W2;
      b.set(x, y, c);
    }
  }
  // the four bullseyes (front-facing ones only), foreshortened by how far round they are
  let flare = 0;
  for (let k = 0; k < 4; k++) {
    const a = ((t + k * 90) * Math.PI) / 180;
    const cz = Math.cos(a);
    if (cz <= 0.08) continue;
    const bx = cx + Math.round(Math.sin(a) * rx * 0.86);
    const w = Math.max(1, Math.round(6 * cz)), h = 7;
    for (let j = -h; j <= h; j++) for (let i = -w; i <= w; i++) {
      const d = Math.hypot(i / (w + 0.5), j / (h + 0.5));
      if (d > 1) continue;
      const c = d < 0.35 ? (cz > 0.9 ? PAL.W9 : PAL.W8) : d < 0.7 ? (cz > 0.7 ? PAL.W8 : PAL.W7) : PAL.W6;
      b.set(bx + i, cy + j, c);
    }
    if (cz > 0.96) flare = 1;
  }
  // the flare: when a panel looks straight at us, a cross of light for the frames it holds (never > 3 flashes / s)
  if (flare) {
    for (let d = 1; d < 30; d++) { const c = d < 8 ? PAL.W8 : d < 18 ? PAL.W6 : PAL.W4; if (d % 2 === 0 || d < 8) { b.set(cx - rx - d, cy, c); b.set(cx + rx + d, cy, c); } }
    for (let d = 1; d < 6; d++) { b.set(cx, cy - ry - 8 - d, PAL.W6); }
  }
  // cage: top cap + finial, bottom ring
  rect(cx - 12, cy - ry - 3, 25, 3, b.ink(PAL.W3)); rect(cx - 12, cy - ry - 3, 25, 1, b.ink(PAL.W5));
  rect(cx - 2, cy - ry - 7, 5, 4, b.ink(PAL.W3)); b.set(cx, cy - ry - 8, PAL.W6);
  rect(cx - 17, cy + ry - 3, 35, 2, b.ink(PAL.W3)); rect(cx - 17, cy + ry - 3, 35, 1, b.ink(PAL.W5));
  // SAFETY on the plinth (a cast plate)
  const s = 'SAFETY';
  const w = tinyWidth(s) + 6;
  const px = cx - Math.floor(w / 2), py = cy + ry + 3;
  rect(px, py, w, 8, b.ink(PAL.W3)); rect(px, py, w, 1, b.ink(PAL.W5)); rect(px, py + 7, w, 1, b.ink(PAL.D2));
  tiny(b, s, px + 3, py + 2, PAL.W8);
  return flare;
};

// ------------------------------------------------------------------ Mario's desk, the paper
const paintDesk = (p: Paint) => {
  const {desk} = L;
  // top (seen from a little above), a lip, the front panel with two drawers, the kneehole
  rect(desk.x0, desk.back, desk.x1 - desk.x0, desk.front - desk.back, P(p, WOOD, 0.8, R.furniture));
  rect(desk.x0 - 2, desk.front, desk.x1 - desk.x0 + 4, 2, P(p, WOOD, 1.5, R.furniture));
  rect(desk.x0, desk.front + 2, desk.x1 - desk.x0, desk.panel - desk.front - 2, P(p, WOOD, -0.6, R.furniture));
  for (const [dx0, dx1] of [[desk.x0 + 4, desk.x0 + 52], [desk.x1 - 52, desk.x1 - 4]]) {
    for (let k = 0; k < 3; k++) {
      const y = desk.front + 5 + k * 10;
      rect(dx0, y, dx1 - dx0, 8, P(p, WOOD, -0.2, R.furniture));
      rect(dx0, y, dx1 - dx0, 1, S(p, 0.8));
      rect(dx0, y + 7, dx1 - dx0, 1, S(p, -0.8));
      rect(Math.round((dx0 + dx1) / 2) - 3, y + 3, 6, 2, P(p, BRASS, 0.8, R.furniture));
    }
  }
  rect(desk.x0 + 56, desk.front + 4, desk.x1 - desk.x0 - 112, desk.panel - desk.front - 4, P(p, WOOD, -2.2, R.furniture)); // kneehole
  // wood grain along the top
  for (let x = desk.x0; x < desk.x1; x++) if (hash(x, 1, 3) < 0.25) S(p, -0.5)(x, desk.back + 2 + (x % 3 === 0 ? 1 : 0));
  // the desk's shadow on the floor
  for (let x = desk.x0 - 4; x < desk.x1 + 8; x++) for (let y = desk.panel; y < desk.panel + 4; y++) if (p.reg[y * ROOM_W + x] === R.floor) S(p, -1.2)(x, y);
};

/** Paper stacks: [x0, footY, w, h, seed]. Floor towers, desk stacks, one foreground tower cut by the frame. */
export const STACKS: Array<[number, number, number, number, number]> = [
  // floor, round the wall
  [18, 186, 22, 38, 1], [42, 184, 16, 22, 2], [96, 176, 18, 30, 3], [118, 174, 14, 14, 4], [336, 176, 20, 26, 5], [360, 178, 16, 42, 6],
  [398, 184, 24, 20, 7], [428, 188, 18, 50, 8], [76, 180, 14, 9, 9],
  // on the desk
  [152, 150, 18, 26, 10], [290, 150, 16, 20, 11], [306, 150, 11, 9, 12],
];
const paintStacks = (p: Paint) => {
  for (const [x0, foot, w, h, seed] of STACKS) {
    let y = foot;
    let k = 0;
    // bundles: reams with a tie or a clip, each slightly offset (hand-stacked), getting a little narrower
    while (y > foot - h) {
      const bh = 3 + Math.floor(hash(seed, k, 3) * 4);
      const dx = Math.floor(hash(seed, k, 5) * 3) - 1;
      const bw = w - Math.floor(hash(seed, k, 7) * 3);
      for (let j = 0; j < bh && y - j > foot - h; j++) {
        const yy = y - j;
        rect(x0 + dx, yy, bw, 1, P(p, PAPER, j === bh - 1 ? 0.8 : (j % 2 ? -0.6 : 0.1), R.paper));
        P(p, PAPER, -1.4, R.paper)(x0 + dx, yy); // the shadow side
      }
      if (hash(seed, k, 9) < 0.35) rect(x0 + dx + Math.floor(bw / 2), y - bh + 1, 1, bh, P(p, INK, 1.2, R.paper)); // string tie
      if (hash(seed, k, 11) < 0.25) rect(x0 + dx + 2, y - bh + 1, 3, 2, P(p, IRON, 1.2, R.paper)); // binder clip
      if (hash(seed, k, 13) < 0.2) rect(x0 + dx + bw - 4, y - 1, 3, 1, P(p, INK, 0.6, R.paper)); // a tab
      y -= bh;
      k++;
    }
    rect(x0 - 1, foot + 1, w + 3, 1, (px, py) => { if (py < ROOM_H && (p.reg[py * ROOM_W + px] === R.floor)) S(p, -1.3)(px, py); });
  }
  // loose sheets on the floor
  for (let k = 0; k < 9; k++) {
    const x = 20 + Math.floor(hash(k, 1, 77) * 430), y = 184 + Math.floor(hash(k, 2, 77) * 16);
    if (x > L.desk.x0 - 6 && x < L.desk.x1 + 6 && y < L.desk.panel + 4) continue;
    poly([x, y, x + 9, y - 1, x + 10, y + 3, x + 1, y + 4], P(p, PAPER, 0.4, R.paper));
  }
  // the foreground tower (bottom-left, out of the light, cut by the frame)
  for (let y = 120; y < ROOM_H; y++) for (let x = 0; x < 14 + (y % 5 === 0 ? 1 : 0); x++) P(p, PAPER, y % 4 === 0 ? -2.4 : -1.6, R.paper)(x, y);
};

// ------------------------------------------------------------------ desk dressing drawn in colours (after the light pass)
/** The brass desk lamp with a parchment shade: the room's warm key. */
export const DESK_LAMP = {x: 212, y: 150};
const drawDeskLamp = (b: Buf) => {
  const {x, y} = DESK_LAMP;
  rect(x - 5, y - 2, 11, 2, b.ink(PAL.W3)); rect(x - 5, y - 2, 11, 1, b.ink(PAL.W5));
  rect(x, y - 16, 1, 14, b.ink(PAL.W4)); b.set(x + 1, y - 10, PAL.W5);
  poly([x - 8, y - 17, x + 8, y - 17, x + 5, y - 25, x - 5, y - 25], b.ink(PAL.P1));
  rect(x - 8, y - 17, 17, 1, b.ink(PAL.W8));
  rect(x - 5, y - 25, 11, 1, b.ink(PAL.P0));
  for (let yy = y - 24; yy < y - 17; yy++) b.set(x - 7 + Math.floor((yy - (y - 25)) * 0.35), yy, PAL.P0);
  rect(x - 4, y - 16, 9, 1, b.ink(PAL.W9)); // the bulb's glow under the shade
};

/** The ringing hop: on the ring cadence (a burst of 18 frames every 48), the handset jumps 1px on 3s. */
export const ringHop = (f: number, t0: number | null | undefined) => {
  if (t0 === null || t0 === undefined || f < t0) return 0;
  const k = (f - t0) % 48;
  return k < 18 && Math.floor(k / 3) % 2 === 0 ? -1 : 0;
};

/** The small throne (9 x 11), gold with a plum cushion. Upright, or tipped over on its back (13 x 7). */
export const throneImg = (tipped = false): Img => {
  const pal: Record<string, number> = {o: PAL.W8, g: PAL.W5, G: PAL.W7, d: PAL.W3, p: PAL.U3, P: PAL.U4, q: PAL.U2};
  const rows = !tipped
    ? ['o...o...o', 'G.GGGGG.G', 'GgpppppgG', 'GgpPPPpgG', 'GgpPPPpgG', 'GgpPPPpgG', 'GgpppppgG', 'dGGGGGGGd', 'GqpppppqG', 'dGGGGGGGd', 'Gd.....dG', 'G.......G', 'd.......d']
    : ['.........GGGo', 'GGGGGGGGGgp.G', 'GqppppppppPgo', 'dqpPPPPPPPPgG', 'GqppppppppPgo', 'dGGGGGGGGGGGG', 'G.d.......d.G'];
  const img = newImg(rows[0].length, rows.length);
  rows.forEach((r, j) => [...r].forEach((ch, i) => { if (pal[ch] !== undefined) imgPut(img, i, j, pal[ch]); }));
  return img;
};

/**
 * The desk phone's handset (24 x 7), optionally with the throne glued on top (then 24 x 17). For the cast to draw in
 * a hand when the phone is off the cradle. Lit by the desk lamp (warm, from screen-left).
 */
export const handsetImg = (color: 'cream' | 'black', throne: boolean): Img => {
  const top = throne ? 12 : 0;
  const img = newImg(24, 7 + top);
  const [c0, c1, c2] = color === 'cream' ? [PAL.P0, PAL.P1, PAL.P2] : [PAL.N0, PAL.G1, PAL.G2];
  const rows = ['.1111..........1111.', '122221........122221', '1222221111111122222.', '1122222222222222221.', '.11111111111111111..'];
  rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === '1') imgPut(img, i + 2, j + top + 1, c0); else if (ch === '2') imgPut(img, i + 2, j + top + 1, j === 1 || j === 2 ? c2 : c1); }));
  if (throne) put(imgAsBuf(img), throneImg(false), 8, 0);
  return img;
};
// tiny adapter: paint an Img into another Img via the Buf-shaped put()
const imgAsBuf = (img: Img) => ({set: (x: number, y: number, c: number) => imgPut(img, x, y, c), get: () => 0, w: img.w, h: img.h, c: new Uint32Array(0), ink: () => () => {}}) as unknown as Buf;

/** The desk phone: base + keypad + curly cord (+ handset on the cradle). x, y = base's bottom-left on the desk top. */
export const drawDeskPhone = (b: Buf, x: number, y: number, s: {color: 'cream' | 'black'; hook: 'cradle' | 'off'; throne?: boolean; hop?: number}) => {
  const [c0, c1, c2] = s.color === 'cream' ? [PAL.P0, PAL.P1, PAL.P2] : [PAL.N0, PAL.G1, PAL.G2];
  // base: a wedge 22 wide
  poly([x, y, x + 22, y, x + 20, y - 8, x + 2, y - 8], b.ink(c1));
  rect(x + 2, y - 8, 19, 1, b.ink(c2));
  rect(x, y - 1, 23, 1, b.ink(c0));
  // keypad (3x4 buttons)
  for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) b.set(x + 7 + i * 2, y - 6 + j * 2, s.color === 'cream' ? PAL.G5 : PAL.G4);
  // cradle forks
  rect(x + 3, y - 10, 3, 2, b.ink(c0)); rect(x + 17, y - 10, 3, 2, b.ink(c0));
  // curly cord to the right side, falling off the desk edge
  for (let k = 0; k < 9; k++) b.set(x + 23 + (k % 2), y - 2 + k, k % 2 ? c0 : c1);
  if (s.hook === 'cradle') {
    const h = handsetImg(s.color, !!s.throne);
    put(b, h, x - 1, y - 16 - (s.throne ? 12 : 0) + (s.hop ?? 0));
  }
};

// ------------------------------------------------------------------ the rent meters
/** A taxi-style rent meter (58 x 34) hung on two chains: name + RENT flag, spinning digits, the ceiling. */
export const drawRentMeter = (b: Buf, x: number, y: number, name: string, cap: string, f: number, seed = 0) => {
  const w = 58, h = 34;
  // chains up to the gallery
  for (let j = y - 30; j < y; j += 2) { b.set(x + 8, j, PAL.N4); b.set(x + w - 9, j, PAL.N4); b.set(x + 8, j + 1, PAL.N2); b.set(x + w - 9, j + 1, PAL.N2); }
  // body
  rect(x, y, w, h, b.ink(PAL.N1));
  rect(x, y, w, 1, b.ink(PAL.G4)); rect(x, y + h - 1, w, 1, b.ink(PAL.N0));
  rect(x, y, 1, h, b.ink(PAL.G3)); rect(x + w - 1, y, 1, h, b.ink(PAL.G2));
  // the RENT flag on top (a hinged tab)
  rect(x + w - 20, y - 7, 16, 7, b.ink(PAL.W4)); rect(x + w - 20, y - 7, 16, 1, b.ink(PAL.W6));
  tiny(b, 'RENT', x + w - 19, y - 6, PAL.P2);
  // name plate
  text(b, name, x + 4, y + 3, PAL.P1);
  // the digits window: a blur of spinning wheels (never legible, on 2s)
  rect(x + 4, y + 13, w - 8, 9, b.ink(PAL.N0));
  const n = 7;
  for (let k = 0; k < n; k++) {
    const dx = x + 6 + k * 7;
    const v = Math.floor(hash(k, Math.floor(f / 2), 17 + seed) * 10);
    const rows = [[1, 1, 1], [1, 0, 1], [1, 1, 1], [0, 0, 1], [1, 1, 1]];
    // smear: two digit ghosts stacked (the wheel mid-turn)
    for (let j = 0; j < 7; j++) for (let i = 0; i < 4; i++) {
      const on = (hash(i + v, j + k, 29 + seed) < 0.45) && j % 2 === (Math.floor(f / 2) + k) % 2;
      if (on) b.set(dx + i, y + 14 + j, k === n - 1 ? PAL.L3 : PAL.L2);
    }
    void rows;
  }
  // the cap, readable
  text(b, cap, x + 4, y + 24, PAL.W7);
};

// ------------------------------------------------------------------ light
const lights = (sweep: {x: number; k: number} | null) => {
  const {desk} = L;
  const lx = DESK_LAMP.x, ly = DESK_LAMP.y - 16;
  return {
    amb: (x: number, y: number) => {
      let a = 2.9;
      // the lamp above lifts the upper tower
      const dl = Math.hypot((x - 240) / 260, (y - 20) / 120);
      if (dl < 1) a += (1 - dl) * 1.3;
      // the windows' faint moonlight
      for (const [wx, wy] of WINDOWS) { const d = Math.hypot((x - wx) / 40, (y - wy) / 50); if (d < 1) a += (1 - d) * 0.8; }
      if (y > bowY(L.floorC, x)) a -= 0.6 + (y - 166) / 90;
      return a;
    },
    cyan: (x: number, y: number) => {
      // THE LAMP (this rig uses the 'cyan' slot as the lighthouse lamp): a warm-white wash on the gallery + top wall,
      // and the SWEEP: a vertical band walking across the upper wall as the bright panel turns
      let v = 0;
      const d = Math.hypot((x - 240) / 150, (y - 30) / 70);
      if (d < 1) v = Math.max(v, (1 - d) * 0.72);
      if (sweep && y < 150) {
        const half = 46 / Math.max(0.5, sweep.k);
        const dx = Math.abs(x - sweep.x);
        if (dx < half) v = Math.max(v, (0.35 + 0.65 * (1 - dx / half)) * 0.64 * (1 - Math.max(0, y - 64) / 86));
      }
      return v;
    },
    warm: (x: number, y: number) => {
      // the brass desk lamp: a pool on the desk, the wall behind, the floor in front; the desk's own front is in shade
      const dx = x - lx, dy = (y - ly) * 1.3;
      const dd = Math.hypot(dx, dy);
      let v = Math.pow(clamp(1 - dd / 150, 0, 1), 1.2) * 1.05;
      if (y < ly - 2) v *= 0.55; // above the shade: less
      if (y > desk.front + 1 && y < desk.panel && x > desk.x0 - 2 && x < desk.x1 + 2) v *= 0.45;
      if (y >= desk.panel) v *= 0.7;
      return v;
    },
    dither: 0.65,
  };
};

// ------------------------------------------------------------------ the room
const staticCache = new Map<string, {mb: MatBuf; reg: Uint8Array; bricks: number[][]}>();

/**
 * Draw the lighthouse into rows 0..202 of `b` at frame f (the lamp turns; the phones ring; the meters spin).
 * Returns masks {wall, floor, stair, gallery, lantern, furniture, paper, window} + anchors.
 */
export const drawLighthouse = (b: Buf, f: number, o: LighthouseOpts = {}): RoomOut => {
  const turns = o.lampTurns !== false;
  // the beam's hit on the back wall (held 3-frame steps, from the panel facing away from us)
  const sw = lampSweepX(f, turns);
  let hit = staticCache.get('base');
  if (!hit) {
    const p: Paint = {mb: new MatBuf(ROOM_W, ROOM_H), reg: new Uint8Array(ROOM_W * ROOM_H), brick: new Int32Array(ROOM_W * ROOM_H).fill(-1)};
    paintGallery(p);
    paintWall(p);
    paintWindows(p);
    paintFloor(p);
    paintStair(p);
    paintDesk(p);
    paintStacks(p);
    // each brick's pixels, for the flattening pass (a brick takes ONE colour: the light steps brick by brick)
    const groups = new Map<number, number[]>();
    for (let i = 0; i < p.brick!.length; i++) { const id = p.brick![i]; if (id < 0 || p.reg[i] !== R.wall) continue; let g = groups.get(id); if (!g) groups.set(id, (g = [])); g.push(i); }
    hit = {mb: p.mb, reg: p.reg, bricks: [...groups.values()]};
    staticCache.set('base', hit);
  }
  const rb = new Buf(ROOM_W, ROOM_H, PAL.N0);
  resolve(hit.mb, lights(sw), rb, 0);
  for (const g of hit.bricks) {
    // the colour of the pixel at the brick's middle (by index order: the middle of its pixel list)
    const c = rb.c[g[g.length >> 1]];
    for (const i of g) if (hit.reg[i] === R.wall) rb.c[i] = c;
  }
  drawLamp(rb, f, turns);
  const pre = rb.clone(); // what the desk dressing changes is 'on the desk' (for the front pass)
  drawDeskLamp(rb);
  // phones: the throne line (cream) left of the lamp... right of it; the second line (black) further right
  const phone1 = PHONES.one, phone2 = PHONES.two;
  const throne = o.throne ?? 'on';
  drawDeskPhone(rb, phone1[0], phone1[1], {color: 'cream', hook: o.phone1 ?? 'cradle', throne: throne === 'on', hop: ringHop(f, o.ring1)});
  if (throne === 'fallen') put(rb, throneImg(true), phone1[0] - 15, phone1[1] - 7);
  drawDeskPhone(rb, phone2[0], phone2[1], {color: 'black', hook: o.phone2 ?? 'cradle', hop: ringHop(f, o.ring2)});
  // an ink-blue fountain pen + blotter, a mug (no logo)
  rect(222, 151, 26, 4, rb.ink(PAL.F2)); rect(222, 151, 26, 1, rb.ink(PAL.F3));
  line(226, 153, 239, 152, rb.ink(PAL.I0)); rb.set(240, 152, PAL.W6);
  rect(251, 145, 6, 6, rb.ink(PAL.P1)); rect(251, 145, 6, 1, rb.ink(PAL.P2)); rb.set(257, 147, PAL.P0); rb.set(257, 148, PAL.P0); rb.set(252, 146, PAL.D2);
  // meters
  const meters = o.meters ?? 0;
  if (meters >= 1) drawRentMeter(rb, 92, 56, 'NOZAMA', 'UP TO $4B', f, 0);
  if (meters >= 2) drawRentMeter(rb, 330, 52, 'ELGOOG', 'UP TO $2B', f + 7, 3);
  for (let y = 0; y < ROOM_H; y++) b.c.set(rb.c.subarray(y * ROOM_W, (y + 1) * ROOM_W), y * b.w);
  const out = newRoomOut(REGION_NAMES);
  for (let i = 0; i < hit.reg.length; i++) { const r = hit.reg[i]; if (r) out.masks[REGION_NAMES[r - 1]].a[i] = 255; }
  // the desk + everything on it (phones, lamp, stacks), from THIS frame: repaint over anyone standing behind it
  const deskBox = {x0: L.desk.x0 - 3, x1: L.desk.x1 + 3, y0: L.desk.back - 40, y1: L.desk.panel + 1};
  const frame = rb;
  for (let y = deskBox.y0; y < deskBox.y1; y++) for (let x = deskBox.x0; x < deskBox.x1; x++) {
    const i = y * ROOM_W + x; const r = hit.reg[i];
    const onDesk = r === R.furniture || (r === R.paper && y < L.desk.front + 1 && x >= L.desk.x0 && x < L.desk.x1) || (y < L.desk.back && y >= L.desk.back - 40 && frame.c[i] !== pre.c[i]);
    if (onDesk) out.masks.desk.a[i] = 255;
  }
  out.front = (fb: Buf) => { for (let y = 0; y < ROOM_H; y++) for (let x = 0; x < ROOM_W; x++) { const i = y * ROOM_W + x; if (out.masks.desk.a[i]) fb.c[y * fb.w + x] = frame.c[i]; } };
  out.anchors = {
    // feet (the floor row under the feet): Mario behind the desk, Adelina coming in from screen-right
    // Mario at the desk's left end (in front: the desk is hip height here), Adelina steps in beside him;
    // 'marioBehind' stands behind the desk (clip the sprite at LIGHTHOUSE.desk.back: only for a seated/leaning read)
    marioDesk: [140, 194], adelinaDesk: [196, 199], adelinaIn: [372, 198], marioBehind: [238, 170],
    phone1: PHONES.one, phone2: PHONES.two,
    // where the handset sits on the cradle (top-left of handsetImg when drawn on the phone)
    handset1: [PHONES.one[0] - 1, PHONES.one[1] - 16], handset2: [PHONES.two[0] - 1, PHONES.two[1] - 16],
    lamp: [L.lamp.cx, L.lamp.cy], meter1: [92, 56], meter2: [330, 52], deskLamp: [DESK_LAMP.x, DESK_LAMP.y],
  };
  return out;
};
/** phone bases (bottom-left on the desk top) */
export const PHONES = {one: [175, 152] as [number, number], two: [262, 152] as [number, number]};
