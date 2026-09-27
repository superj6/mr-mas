// MR. MAS - style-range prototype E1-P3 (1.D, BELOW, ABOVE, AROUND): THE LANDLORD'S HOUSE STYLE.
// The bullpen redrawn as flat corporate illustration: vector paths at output resolution (no pixel grid), flat fills,
// ONE gradient per surface, one corner-radius family (R.s / R.m / R.l = 1 / 2 / 4 native px), soft cast shadows, lit
// from the window side (screen right) so Mas's and Tasya's pixel rims still make sense. The palette is the landlord's:
// slate #5B6B8C, window-pane blue, cloud white, and one warm accent (the boxes' tape). It copies no company's design
// system (no translucent blur, no system typeface: the sign and the plates are set in Jost, bundled OFL) and no one
// studio's figure style (the staff keep the pixel extras' own proportions, ~5.8 heads, and natural skin).
//
// Every shape is laid on the pixel plate's own geometry (rooms/bullpen.ts BULLPEN, WALKOUT_CROWD, the extras' seeded
// attributes), so each vector surface lands on its pixel silhouette and nothing in the room moves.
// Coordinates are NATIVE room px (480 x 203); the caller scales the context by 4 (1920 x 812).
// This is the "additive vector path module" of style-range 1.D, kept local to the prototype until the engine owner
// adopts it (H6).
import {BULLPEN, WALKOUT_CROWD, CROWD_LOOK_X, EXTRA_H} from '../../../shared/pixel/rooms/bullpen';
import {h01} from '../../../shared/pixel/rooms/kit-b';

type Ctx = CanvasRenderingContext2D;
const G = BULLPEN;
export const OUT = 4; // output px per native px

// ------------------------------------------------------------------ the landlord's palette
export const C = {
  slate: '#5B6B8C', slateD: '#4A5877', slateDD: '#374360', ink: '#2B3450',
  slateM: '#7B89A7', slateL: '#A4AFC6', slateLL: '#C7CFDF', mist: '#DCE2EC',
  cloud: '#F3F6FA', white: '#FFFFFF',
  pane: '#9DC2E6', paneL: '#C9DEF2', paneLL: '#E4EEF8', paneD: '#7DA3CE', paneDD: '#6286B3',
  warm: '#E8A45C', warmD: '#C98640',
  leaf: '#6F8DA6', leafL: '#93AEC3', leafD: '#58738E',
  shadow: 'rgba(33,42,72,0.30)', shadowS: 'rgba(33,42,72,0.18)',
};
/** the corner-radius family (native px) */
export const R = {s: 1, m: 2, l: 4};

// ------------------------------------------------------------------ path kit
const rr = (c: Ctx, x: number, y: number, w: number, h: number, r: number | number[]) => { c.beginPath(); c.roundRect(x, y, w, h, r); };
const fillRR = (c: Ctx, x: number, y: number, w: number, h: number, r: number | number[], f: string | CanvasGradient) => { rr(c, x, y, w, h, r); c.fillStyle = f; c.fill(); };
const lg = (c: Ctx, x0: number, y0: number, x1: number, y1: number, stops: Array<[number, string]>) => {
  const g = c.createLinearGradient(x0, y0, x1, y1);
  for (const [o, s] of stops) g.addColorStop(o, s);
  return g;
};
/** mix two #rrggbb colours (t = 0 -> a, 1 -> b) */
const mixHex = (a: string, b: string, t: number) => {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = (v: number, k: number) => (v >> k) & 255;
  const m = (k: number) => Math.round(ch(pa, k) + (ch(pb, k) - ch(pa, k)) * t);
  return '#' + ((m(16) << 16) | (m(8) << 8) | m(0)).toString(16).padStart(6, '0');
};
const polyP = (c: Ctx, pts: number[]) => { c.beginPath(); c.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) c.lineTo(pts[i], pts[i + 1]); c.closePath(); };
/** a polygon with every corner rounded by r (the corner-radius family applied to any outline) */
const roundPoly = (c: Ctx, pts: number[], r: number) => {
  const n = pts.length / 2;
  c.beginPath();
  for (let i = 0; i < n; i++) {
    const [x0, y0] = [pts[((i - 1 + n) % n) * 2], pts[((i - 1 + n) % n) * 2 + 1]];
    const [x1, y1] = [pts[i * 2], pts[i * 2 + 1]];
    const [x2, y2] = [pts[((i + 1) % n) * 2], pts[((i + 1) % n) * 2 + 1]];
    const d0 = Math.hypot(x1 - x0, y1 - y0), d2 = Math.hypot(x2 - x1, y2 - y1);
    const k = Math.min(r, d0 / 2, d2 / 2);
    const ax = x1 + ((x0 - x1) / d0) * k, ay = y1 + ((y0 - y1) / d0) * k;
    const bx = x1 + ((x2 - x1) / d2) * k, by = y1 + ((y2 - y1) / d2) * k;
    if (i === 0) c.moveTo(ax, ay); else c.lineTo(ax, ay);
    c.quadraticCurveTo(x1, y1, bx, by);
  }
  c.closePath();
};
/** soft shadow: draw `shape` (a path builder) filled with `col`, blurred by `blur` OUTPUT px */
const softShadow = (c: Ctx, shape: () => void, col: string, blur: number) => {
  c.save();
  c.filter = `blur(${blur}px)`;
  shape();
  c.fillStyle = col;
  c.fill();
  c.restore();
};
const ell = (c: Ctx, cx: number, cy: number, rx: number, ry: number) => { c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); };
const line = (c: Ctx, x0: number, y0: number, x1: number, y1: number, w: number, s: string, cap: CanvasLineCap = 'round') => {
  c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.lineWidth = w; c.strokeStyle = s; c.lineCap = cap; c.stroke();
};
const label = (c: Ctx, s: string, x: number, y: number, size: number, col: string, weight = 700, align: CanvasTextAlign = 'left', track = 0) => {
  c.save();
  c.font = `${weight} ${size}px Jost, sans-serif`;
  c.fillStyle = col;
  c.textAlign = align;
  c.textBaseline = 'alphabetic';
  if (track) (c as unknown as {letterSpacing: string}).letterSpacing = `${track}px`;
  c.fillText(s, x, y);
  c.restore();
};

// ------------------------------------------------------------------ perspective helpers (the plate's own)
const floorLineX = (xw: number, y: number) => G.vp[0] + ((xw - G.vp[0]) * (y - G.vp[1])) / (G.floorY - G.vp[1]);
const ceilLineX = (xw: number, y: number) => G.vp[0] + ((xw - G.vp[0]) * (G.vp[1] - y)) / (G.vp[1] - G.ceilY);

// ================================================================== THE SHELL
/** the ceiling (y 0..18): cloud white, one gradient toward the window; the troffers in their plate positions */
export const drawCeiling = (c: Ctx) => {
  const {ceilY} = G;
  c.fillStyle = lg(c, 0, 0, 480, 0, [[0, '#DCE2EC'], [0.55, '#E6EBF3'], [1, '#EFF3F8']]);
  c.fillRect(0, 0, 480, ceilY);
  // tile seams, barely there (the plate's perspective, in the genre's own quiet)
  c.save();
  c.globalAlpha = 0.5;
  for (let xw = -220; xw <= 700; xw += 24) line(c, xw, ceilY - 1, ceilLineX(xw, 0), 0, 0.22, 'rgba(91,107,140,0.35)', 'butt');
  for (const y of [ceilY - 3, ceilY - 7, ceilY - 12]) line(c, 0, y, 480, y, 0.22, 'rgba(91,107,140,0.35)', 'butt');
  c.restore();
  const panel = (xa: number, xb: number, ya: number, yb: number, on: boolean) => {
    const q = [ceilLineX(xa, ya), ya, ceilLineX(xb, ya), ya, ceilLineX(xb, yb + 1), yb + 1, ceilLineX(xa, yb + 1), yb + 1];
    if (on) softShadow(c, () => roundPoly(c, q, 1), 'rgba(255,255,255,0.95)', 10);
    roundPoly(c, q, 1);
    c.fillStyle = on ? lg(c, 0, ya, 0, yb + 1, [[0, '#FFFFFF'], [1, '#F4F8FC']]) : '#CBD3E2';
    c.fill();
  };
  panel(24, 72, ceilY - 11, ceilY - 8, true);
  panel(168, 216, ceilY - 11, ceilY - 8, true);
  panel(312, 360, ceilY - 11, ceilY - 8, false);
  panel(408, 456, ceilY - 11, ceilY - 8, true);
  panel(96, 144, ceilY - 5, ceilY - 3, true);
  panel(264, 312, ceilY - 5, ceilY - 3, true);
};

/** the back wall and everything on it: crown, baseboard, the hall mouth, the board, the sign, the conference glass
 *  and its door (the ALYI plate, the IOU note), the windows, the credenza, and the tall planter at the frame edge */
export const drawWalls = (c: Ctx) => {
  const {ceilY, floorY} = G;
  // ---- the wall: pale slate, one gradient toward the window
  c.fillStyle = lg(c, 0, 0, 480, 0, [[0, '#A9B4CB'], [0.6, '#BAC4D7'], [1, '#CAD2E1']]);
  c.fillRect(0, ceilY, 480, floorY - ceilY);
  // crown + its soft shadow
  fillRR(c, -2, ceilY, 484, 2.2, 0, lg(c, 0, ceilY, 0, ceilY + 2.2, [[0, C.cloud], [1, C.mist]]));
  c.fillStyle = lg(c, 0, ceilY + 2.2, 0, ceilY + 6, [[0, 'rgba(55,67,96,0.16)'], [1, 'rgba(55,67,96,0)']]);
  c.fillRect(0, ceilY + 2.2, 480, 3.8);
  // baseboard
  fillRR(c, -2, floorY - 5, 484, 5, 0, lg(c, 0, 0, 480, 0, [[0, C.slateM], [1, '#8C99B5']]));
  fillRR(c, -2, floorY - 5, 484, 0.8, 0, 'rgba(255,255,255,0.35)');
  paintHall(c);
  paintBoard(c);
  paintSign(c);
  paintConference(c);
  paintDoor(c);
  paintWindows(c);
  paintPlanter(c);
};

const paintHall = (c: Ctx) => {
  const {hall, floorY} = G;
  const x0 = hall.x0, x1 = hall.x1, y0 = hall.y0;
  // trim
  softShadow(c, () => rr(c, x0 - 3 - 1.5, y0 - 3, x1 - x0 + 6, floorY - y0 + 3, [R.m, R.m, 0, 0]), C.shadowS, 8);
  fillRR(c, x0 - 3, y0 - 3, x1 - x0 + 6, floorY - y0 + 3, [R.m, R.m, 0, 0], lg(c, x0 - 3, 0, x1 + 3, 0, [[0, C.mist], [1, C.cloud]]));
  // the corridor (one-point box), cool daylight at its end
  const fx0 = x0 + 13, fx1 = x1 - 11, fy0 = y0 + 20, fy1 = floorY - 30;
  polyP(c, [x0, y0, x1, y0, fx1, fy0, fx0, fy0]); c.fillStyle = '#D5DDEA'; c.fill(); // ceiling
  polyP(c, [x0, y0, fx0, fy0, fx0, fy1, x0, floorY]); c.fillStyle = lg(c, x0, 0, fx0, 0, [[0, '#B8C4D8'], [1, '#CFD8E6']]); c.fill(); // left wall
  polyP(c, [x1, y0, x1, floorY, fx1, fy1, fx1, fy0]); c.fillStyle = lg(c, x1, 0, fx1, 0, [[0, '#A9B6CD'], [1, '#C4CEDF']]); c.fill(); // right wall
  polyP(c, [x0, floorY, fx0, fy1, fx1, fy1, x1, floorY]); c.fillStyle = lg(c, 0, floorY, 0, fy1, [[0, C.slateM], [1, '#A3AFC6']]); c.fill(); // floor
  fillRR(c, fx0, fy0, fx1 - fx0, fy1 - fy0, 0, lg(c, 0, fy0, 0, fy1, [[0, C.white], [1, C.paneLL]])); // the far end, lit
  // a door slab on its left wall, a framed print on its right
  polyP(c, [x0 + 1.5, fy0 + 8, x0 + 5, fy0 + 12, x0 + 5, floorY - 14, x0 + 1.5, floorY - 8]); c.fillStyle = '#9FAcC4'; c.fill();
  polyP(c, [x1 - 4.5, fy0 + 2, x1 - 2.5, fy0 + 0.5, x1 - 2.5, fy0 + 12, x1 - 4.5, fy0 + 12.5]); c.fillStyle = C.slateL; c.fill();
  // the exit sign, in the house style: a small pill
  fillRR(c, fx0 + 2, fy0 + 5, 7, 3, R.s, C.slate);
  fillRR(c, fx0 + 3, fy0 + 6.2, 5, 0.7, 0.35, C.paneLL);
};

const paintBoard = (c: Ctx) => {
  const {board} = G;
  const x = board.x0 - 2, y = board.y0 - 2, w = board.x1 - board.x0 + 4, h = board.y1 - board.y0 + 4;
  softShadow(c, () => rr(c, x - 2, y + 1.5, w, h, R.m), C.shadow, 10);
  fillRR(c, x, y, w, h, R.m, lg(c, x, 0, x + w, 0, [[0, C.slateLL], [1, '#DDE3EE']]));
  fillRR(c, board.x0, board.y0, board.x1 - board.x0, board.y1 - board.y0, R.s, lg(c, board.x0, 0, board.x1, 0, [[0, '#F1F4F9'], [1, C.white]]));
  // the tray and two markers
  fillRR(c, board.x0 + 6, board.y1 + 2, board.x1 - board.x0 - 12, 2, R.s, C.slateL);
  fillRR(c, board.x0 + 14, board.y1 + 0.8, 6, 1.4, 0.7, C.warm);
  fillRR(c, board.x0 + 24, board.y1 + 0.8, 6, 1.4, 0.7, C.slate);
  // the plan, redrawn clean: LOW-KEY, the two boxes, the arrow, the question
  const bx = board.x0, by = board.y0;
  label(c, 'LOW-KEY', bx + 5.6, by + 10.2, 5.4, C.slateD, 700, 'left', 0.4);
  line(c, bx + 5.8, by + 12, bx + 29, by + 12, 0.55, C.warm);
  const box = (xx: number, yy: number) => { rr(c, xx, yy, 12, 8, R.s); c.lineWidth = 0.7; c.strokeStyle = C.slate; c.stroke(); };
  box(bx + 6, by + 20); box(bx + 28, by + 20);
  line(c, bx + 19.5, by + 24, bx + 26, by + 24, 0.7, C.slate);
  polyP(c, [bx + 26.6, by + 24, bx + 24.6, by + 22.7, bx + 24.6, by + 25.3]); c.fillStyle = C.slate; c.fill();
  line(c, bx + 41, by + 24, bx + 45.5, by + 24, 0.7, C.slate);
  ell(c, bx + 49.6, by + 24, 3.2, 3.2); c.lineWidth = 0.7; c.strokeStyle = C.warm; c.stroke();
  label(c, '?', bx + 49.6, by + 26.1, 5.2, C.warmD, 700, 'center');
  for (let k = 0; k < 3; k++) line(c, bx + 6, by + 33 + k * 2.4, bx + 18 + ((k * 7) % 10), by + 33 + k * 2.4, 0.9, C.slateLL);
  fillRR(c, bx + 42, by + 31.5, 10, 4, R.s, C.mist);
};

const paintSign = (c: Ctx) => {
  const {x, y} = G.neon;
  const w = 47; // the neon's backer width (textWidth('NOPE AI') + 8)
  softShadow(c, () => rr(c, x - 4 - 1.5, y - 3 + 1.2, w, 13, 6.5), C.shadow, 8);
  fillRR(c, x - 4, y - 3, w, 13, 6.5, lg(c, x - 4, 0, x - 4 + w, 0, [[0, C.slateD], [1, C.slate]]));
  label(c, 'NOPE AI', x - 4 + w / 2, y + 6.6, 7.4, C.cloud, 700, 'center', 0.9);
};

const paintConference = (c: Ctx) => {
  const {glass, floorY, door} = G;
  const x0 = glass.x0, x1 = glass.x1, y0 = glass.y0;
  // soffit
  fillRR(c, x0 - 2, y0 - 4, x1 - x0 + 4, 4, 0, lg(c, 0, y0 - 4, 0, y0, [[0, C.mist], [1, C.slateLL]]));
  // the room behind the glass: the lights off, one step deeper, its things as quiet silhouettes
  c.fillStyle = lg(c, x0, 0, x1, 0, [[0, '#8593B0'], [1, '#94A2BD']]);
  c.fillRect(x0, y0, x1 - x0, floorY - y0);
  c.fillStyle = '#7F8DAA'; c.fillRect(x0, floorY - 12, x1 - x0, 12); // its floor
  fillRR(c, 150, 60, 50, 28, R.s, '#6D7B99'); // the wall screen
  fillRR(c, 173, 88, 4, 3, 0, '#6D7B99');
  for (let k = 0; k < 5; k++) fillRR(c, 150 + k * 22, 111, 12, 11, [R.m, R.m, R.s, R.s], '#72809D');
  fillRR(c, 140, 122, 120, 5, R.s, '#66738F'); // the table
  fillRR(c, 146, 127, 3, 8, 0, '#66738F'); fillRR(c, 250, 127, 3, 8, 0, '#66738F');
  fillRR(c, 237.5, 108, 9, 10, [R.s, R.s, R.m, R.m], '#6D7B99'); // the plant, its pot
  for (const [bx, by] of [[234, 94], [246, 90], [252, 98], [238, 88]]) { c.beginPath(); c.moveTo(242, 108); c.quadraticCurveTo((242 + bx) / 2 + (bx < 242 ? -1.5 : 1.5), (108 + by) / 2, bx, by); c.lineWidth = 1.6; c.strokeStyle = '#7686A3'; c.lineCap = 'round'; c.stroke(); }
  // transom + right pane (the same deeper glass)
  // the glass itself: a cool film and two sheen bands per pane (the genre's reflection)
  const panes: Array<[number, number]> = [[x0, 179], [179, 226], [226, 273], [door.x1, x1]];
  c.save();
  for (const [a, b] of panes) {
    c.save();
    c.beginPath(); c.rect(a, y0, b - a, floorY - y0); c.clip();
    c.fillStyle = 'rgba(201,222,242,0.22)'; c.fillRect(a, y0, b - a, floorY - y0);
    c.fillStyle = 'rgba(255,255,255,0.16)';
    polyP(c, [a + 6, y0, a + 18, y0, a - 22, floorY, a - 34, floorY]); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.10)';
    polyP(c, [a + 24, y0, a + 29, y0, a - 11, floorY, a - 16, floorY]); c.fill();
    c.restore();
  }
  // transom over the door
  c.fillStyle = 'rgba(201,222,242,0.22)'; c.fillRect(door.x0, y0, door.x1 - door.x0, door.y0 - y0 - 2);
  c.restore();
  // the frosted band: a quiet row of rounded dashes
  c.fillStyle = 'rgba(243,246,250,0.55)'; c.fillRect(x0 + 1.5, 98, door.x0 - x0 - 1.5, 6); c.fillRect(door.x1, 98, x1 - door.x1 - 1, 6);
  for (let x = x0 + 4; x < x1 - 2; x += 4) { if (x >= door.x0 - 2 && x < door.x1 + 1) continue; fillRR(c, x, 100.3, 2.2, 1.4, 0.7, 'rgba(255,255,255,0.8)'); }
  // mullions, sill rail, head rail
  for (const mx of [x0, 179, 226, 273]) fillRR(c, mx - 1.2, y0, 2.4, floorY - y0, 0, lg(c, mx - 1.2, 0, mx + 1.2, 0, [[0, C.slateLL], [1, C.cloud]]));
  fillRR(c, x1 - 1.2, y0, 2.4, floorY - y0, 0, lg(c, x1 - 1.2, 0, x1 + 1.2, 0, [[0, C.slateLL], [1, C.cloud]]));
  fillRR(c, x0, floorY - 3, x1 - x0, 3, 0, C.slateLL);
  fillRR(c, x0, y0, x1 - x0, 1, 0, C.cloud);
};

/** the door (shut), its ALYI plate, and the IOU note taped to the latch jamb */
export const IOU = {x: G.door.x0 - 29, y: 86, w: 35, h: 17};
const paintDoor = (c: Ctx) => {
  const {floorY} = G;
  const {x0, x1, y0} = G.door;
  softShadow(c, () => rr(c, x0 - 1.5, y0 - 2, x1 - x0, floorY - y0 + 2, [R.m, R.m, 0, 0]), C.shadowS, 8);
  fillRR(c, x0, y0 - 2, x1 - x0, floorY - y0 + 2, [R.m, R.m, 0, 0], lg(c, x0, 0, x1, 0, [[0, C.mist], [1, C.cloud]]));
  const lx0 = x0 + 2, lx1 = x1 - 2;
  fillRR(c, lx0, y0, lx1 - lx0, floorY - y0, [R.s, R.s, 0, 0], lg(c, 0, y0, 0, floorY, [[0, '#6A7A9B'], [1, C.slate]]));
  fillRR(c, lx0 + 1.5, y0 + 1.5, lx1 - lx0 - 3, 30, R.s, 'rgba(255,255,255,0.06)'); // a panel, barely
  fillRR(c, lx0, floorY - 7, lx1 - lx0, 6, 0, C.slateM); // kick plate
  // the lever (latch side, left)
  fillRR(c, lx0 + 1.6, 101.4, 2.6, 2.6, 1.3, C.cloud);
  fillRR(c, lx0 + 2.4, 101.8, 6.4, 1.6, 0.8, C.cloud);
  // the ALYI plate
  const pw = 22, px = Math.round((lx0 + lx1) / 2 - pw / 2), py = 71.5;
  fillRR(c, px, py, pw, 9, R.s, C.cloud);
  label(c, 'ALYI', px + pw / 2, py + 6.8, 6.2, C.slateDD, 700, 'center', 0.6);
  // the IOU note (yellowed, drooping at its right corner), taped at the top: the tape is the house's warm accent
  const {x, y, w, h} = IOU;
  c.save();
  c.translate(x, y);
  c.rotate(0.022);
  softShadow(c, () => rr(c, -1.2, 1.2, w, h, R.s), C.shadowS, 6);
  fillRR(c, 0, 0, w, h, R.s, lg(c, 0, 0, 0, h, [[0, '#F7F1DE'], [1, '#EFE6CB']]));
  label(c, 'IOU: 20%', w / 2, 7.4, 6.2, C.ink, 700, 'center', 0.2);
  label(c, 'COMPUTE', w / 2, 14.2, 5.8, C.ink, 700, 'center', 0.4);
  fillRR(c, 2.5, -1.4, 7, 2.8, 0.4, 'rgba(232,164,92,0.85)');
  fillRR(c, w - 9.5, -1.2, 7, 2.8, 0.4, 'rgba(232,164,92,0.85)');
  c.restore();
};

const paintWindows = (c: Ctx) => {
  const {win, floorY} = G;
  const {x0, x1, y0, y1} = win;
  softShadow(c, () => rr(c, x0 - 4 - 1.5, y0 - 4 + 1, x1 - x0 + 8, y1 - y0 + 8, R.m), C.shadowS, 9);
  fillRR(c, x0 - 4, y0 - 4, x1 - x0 + 8, y1 - y0 + 8, R.m, lg(c, x0, 0, x1, 0, [[0, C.mist], [1, C.cloud]]));
  // the view, in the house blues: sky, a few soft clouds, the city as rounded blocks, trees
  c.save();
  c.beginPath(); c.rect(x0, y0, x1 - x0 + 1, y1 - y0 + 1); c.clip();
  c.fillStyle = lg(c, 0, y0, 0, y1, [[0, '#8DB5DF'], [0.62, '#C4DBF1'], [1, '#E2EDF8']]);
  c.fillRect(x0, y0, x1 - x0 + 1, y1 - y0 + 1);
  const cloud = (cx: number, cy: number, s: number, a: number) => {
    c.fillStyle = `rgba(255,255,255,${a})`;
    c.beginPath();
    c.ellipse(cx, cy, 9 * s, 2.6 * s, 0, 0, Math.PI * 2); c.ellipse(cx - 4 * s, cy - 1.8 * s, 4.2 * s, 3 * s, 0, 0, Math.PI * 2);
    c.ellipse(cx + 3 * s, cy - 2.4 * s, 5 * s, 3.8 * s, 0, 0, Math.PI * 2);
    c.fill();
  };
  cloud(356, 44, 1.0, 0.75); cloud(420, 38, 0.8, 0.6); cloud(452, 50, 0.7, 0.5);
  const hz = y0 + 58;
  for (let x = x0, k = 0; x <= x1; k++) {
    const w = 6 + Math.floor(h01(k, 1) * 10);
    const top = hz - 8 - Math.floor(h01(k, 2) * 26);
    const col = ['#B1C6DE', '#A6BDD8', '#BBCEE3'][k % 3];
    fillRR(c, x, top, Math.min(w, x1 + 1 - x), y1 - top + 2, [R.s, R.s, 0, 0], col);
    for (let j = top + 3; j < y1 - 4; j += 3.5) fillRR(c, x + 1.2, j, Math.max(0, Math.min(w, x1 + 1 - x) - 2.4), 1, 0.5, 'rgba(255,255,255,0.32)');
    x += w + 1 + Math.floor(h01(k, 3) * 4);
  }
  fillRR(c, x1 - 26, y0 + 40, 27, y1 - y0 - 38, [R.m, R.m, 0, 0], '#98B0CF'); // the nearer block
  for (let j = y0 + 44; j < y1 - 3; j += 4) for (let i = x1 - 23; i < x1; i += 4) fillRR(c, i, j, 2, 1.6, 0.4, '#C4D6EA');
  // street trees as one rounded canopy line
  c.beginPath(); c.moveTo(x0 - 1, y1 + 2);
  for (let x = x0 - 1; x <= x1 - 26; x += 2) { const hh = 6 + 3 * Math.sin(x * 0.35) + 2 * Math.sin(x * 0.11); c.lineTo(x, y1 - hh); }
  c.lineTo(x1 - 26, y1 + 2); c.closePath(); c.fillStyle = '#7F9CB9'; c.fill();
  c.restore();
  // mullions, transom, sill
  for (const mx of [379, 425]) fillRR(c, mx - 1.3, y0, 2.6, y1 - y0 + 1, 0, C.cloud);
  fillRR(c, x0, y0 + 20, x1 - x0 + 1, 2, 0, C.cloud);
  fillRR(c, x0 - 6, y1 + 4, x1 - x0 + 13, 2.2, R.s, C.cloud);
  c.fillStyle = 'rgba(55,67,96,0.14)'; c.fillRect(x0 - 5, y1 + 6.2, x1 - x0 + 11, 1.2);
  // the credenza under the windows, a snake plant at its end, a stack of printouts
  const cy = y1 + 9;
  softShadow(c, () => rr(c, x0 - 2 - 2, cy + 1, x1 - x0 + 5, floorY - cy, R.s), C.shadowS, 8);
  fillRR(c, x0 - 2, cy, x1 - x0 + 5, floorY - cy, [R.s, R.s, 0, 0], lg(c, x0, 0, x1, 0, [[0, '#AFBAD0'], [1, '#C9D1E1']]));
  fillRR(c, x0 - 2, cy, x1 - x0 + 5, 1.6, [R.s, R.s, 0, 0], C.cloud);
  for (let k = 1; k < 4; k++) line(c, x0 - 2 + k * 34, cy + 3, x0 - 2 + k * 34, floorY - 3, 0.35, 'rgba(55,67,96,0.25)', 'butt');
  fillRR(c, x0 - 2, floorY - 2, x1 - x0 + 5, 2, 0, C.slateM);
  fillRR(c, x1 - 14.5, cy - 8, 9.5, 8, [R.s, R.s, R.m, R.m], C.slate);
  for (const [ax, bx, by] of [[x1 - 12, x1 - 16, cy - 26], [x1 - 10, x1 - 9, cy - 30], [x1 - 8, x1 - 3, cy - 24], [x1 - 11, x1 - 12, cy - 22]]) {
    c.beginPath(); c.moveTo(ax - 1.4, cy - 8); c.quadraticCurveTo((ax + bx) / 2 - 1, (cy - 8 + by) / 2, bx, by); c.quadraticCurveTo((ax + bx) / 2 + 1.5, (cy - 8 + by) / 2, ax + 1.4, cy - 8); c.closePath();
    c.fillStyle = bx > ax ? C.leafL : C.leaf; c.fill();
  }
  for (let k = 0; k < 4; k++) fillRR(c, x0 + 8, cy - 2 - k * 1.9, 16, 1.7, 0.4, k % 2 ? '#E4E9F2' : C.white);
};

/** the tall planter cut by the frame's right edge (foreground depth, out of the window light) */
const paintPlanter = (c: Ctx) => {
  const x0 = 452, y0 = 168;
  roundPoly(c, [x0, y0, 484, y0, 484, 206, x0 + 3, 206], R.m); c.fillStyle = lg(c, x0, 0, 480, 0, [[0, C.slateDD], [1, C.slateD]]); c.fill();
  fillRR(c, x0 - 0.5, y0, 32, 2.2, R.s, C.slate);
  const blades: number[][] = [[458, 168, 450, 120, 455, 119, 463, 168], [464, 168, 462, 110, 468, 112, 469, 168], [470, 168, 478, 122, 482, 124, 476, 168], [455, 168, 440, 136, 444, 134, 461, 168], [466, 168, 472, 100, 476, 102, 471, 168]];
  blades.forEach((b, i) => {
    c.beginPath(); c.moveTo(b[0], b[1]); c.quadraticCurveTo((b[0] + b[2]) / 2 - 1, (b[1] + b[3]) / 2, b[2], b[3]); c.lineTo(b[4], b[5]); c.quadraticCurveTo((b[6] + b[4]) / 2 + 1, (b[7] + b[5]) / 2, b[6], b[7]); c.closePath();
    c.fillStyle = i % 2 ? C.leafD : C.leaf; c.fill();
  });
};

/** the floor (y 146..203): the house slate, one gradient toward the window; the plate's seams, quiet; the soft
 *  shadows of everything that stands on it (the bench, the credenza, the planter, every figure), cast away from the
 *  window. (Pass 6 dropped Mas's contact oval in S7.03: under a cropped foreground bust it made him read as a giant
 *  standing in the room.) */
export interface FloorOpts { crowd?: boolean; bench?: 'short' | 'full'; skip?: ReadonlySet<number> }
export const drawFloor = (c: Ctx, o: FloorOpts = {}) => {
  const {floorY} = G;
  c.fillStyle = lg(c, 0, 0, 480, 0, [[0, '#4F5F84'], [0.55, '#5B6B92'], [1, '#6879A2']]);
  c.fillRect(0, floorY, 480, 203 - floorY + 1);
  // the window's daylight laid on the floor, skewed away from the glass (the room's one light, from screen right)
  c.save(); c.filter = 'blur(10px)';
  polyP(c, [G.win.x0 + 4, floorY + 1, G.win.x1 - 2, floorY + 1, G.win.x1 - 70, 203, G.win.x0 - 96, 203]); c.fillStyle = 'rgba(214,228,247,0.20)'; c.fill();
  for (const mx of [379, 425]) { polyP(c, [mx - 1.5, floorY + 1, mx + 1.5, floorY + 1, mx - 42, 203, mx - 48, 203]); c.fillStyle = 'rgba(79,95,132,0.22)'; c.fill(); }
  c.restore();
  // the hall's daylight spilling onto the floor, soft
  c.save(); c.filter = 'blur(14px)';
  polyP(c, [12, floorY, 50, floorY, 70, 203, -10, 203]); c.fillStyle = 'rgba(214,226,242,0.22)'; c.fill();
  c.restore();
  c.save();
  c.globalAlpha = 0.9;
  for (let xw = -900; xw < 1400; xw += 26) line(c, xw, floorY, floorLineX(xw, 203), 203, 0.25, 'rgba(255,255,255,0.07)', 'butt');
  for (const y of [floorY + 4, floorY + 10, floorY + 18, floorY + 29, floorY + 43]) line(c, 0, y, 480, y, 0.25, 'rgba(255,255,255,0.06)', 'butt');
  c.restore();
  // a soft line of shade where the floor meets the wall
  c.fillStyle = lg(c, 0, floorY, 0, floorY + 3, [[0, 'rgba(33,42,72,0.28)'], [1, 'rgba(33,42,72,0)']]);
  c.fillRect(0, floorY, 480, 3);
  // shadows: the bench (cast away from the window), the credenza, the planter
  const {bench} = G;
  const bx1 = o.bench === 'short' ? bench.x1 : bench.x1;
  softShadow(c, () => roundPoly(c, [bench.x0 - 7, bench.foot - 2.5, bx1 - 3, bench.foot - 2.5, bx1 - 5, bench.foot + 4.5, bench.x0 - 12, bench.foot + 4.5], 2), C.shadow, 12);
  softShadow(c, () => rr(c, G.win.x0 - 8, floorY - 0.5, G.win.x1 - G.win.x0 + 6, 4, 2), C.shadowS, 10);
  softShadow(c, () => ell(c, 462, 204, 18, 4), C.shadow, 12);
  if (o.crowd !== false) for (const e of WALKOUT_CROWD) {
    if (e.behind || o.skip?.has(e.seed)) continue;
    const sy = e.foot + 0.6;
    softShadow(c, () => ell(c, e.x - 3.5, sy, 11.5, 2.3), C.shadow, 7);
    softShadow(c, () => ell(c, e.x - 1, sy - 0.2, 7, 1.2), 'rgba(33,42,72,0.35)', 3);
  }
};

// ================================================================== THE BENCH (four stations; Mas's end desk stays pixel)
const chairRect = (i: number) => { const [a, b] = G.stations[i]; const cx = Math.round((a + b) / 2) + 2; return [cx - 8, G.bench.back - 21, 16, 21] as const; };
export interface BenchOpts { stations: number[]; x1: number }
/** chair backs and monitor backs: behind the back row (the plate draws the behind-crowd over them) */
export const drawBenchBack = (c: Ctx, o: BenchOpts) => {
  for (const i of o.stations) {
    const [x, y, w, h] = chairRect(i);
    fillRR(c, x, y, w, h, [R.l, R.l, R.s, R.s], lg(c, x, 0, x + w, 0, [[0, C.slateDD], [0.7, C.slateD], [1, C.slate]]));
    fillRR(c, x + 2, y + 3, w - 4, 1.2, 0.6, 'rgba(255,255,255,0.08)');
    if (i === 3) continue;
    const mx = G.stations[i][0] + 5, my = G.bench.back - 16;
    fillRR(c, mx + 6.5, my + 12, 5, 4, 0, C.slateD);
    fillRR(c, mx + 3.5, G.bench.back - 1.2, 11, 1.4, R.s, C.slateD);
    fillRR(c, mx, my, 18, 13, R.s, lg(c, mx, 0, mx + 18, 0, [[0, C.ink], [1, C.slateDD]]));
    fillRR(c, mx + 16.4, my + 1.2, 1, 10.6, 0.5, 'rgba(201,222,242,0.55)'); // the screen's glow on its edge, toward its sitter
  }
};
/** the desk top, the modesty panel, the legs and the boxes packed on the desks */
export const drawBenchFront = (c: Ctx, o: BenchOpts) => {
  const {bench, stations} = G;
  const x0 = bench.x0, x1 = o.x1;
  const rightR = x1 >= bench.x1 ? R.s : 0; // a cut end (against the pixel island) stays square
  // legs + the shadow under the panel
  const legs = [bench.x0 + 1, ...stations.slice(1).map(([a]) => a - 1), bench.x1 - 3].filter((lx) => lx < x1 - 1);
  for (const lx of legs) fillRR(c, lx, bench.front + 1, 2, bench.foot - bench.front - 1, [0, 0, R.s * 0.5, R.s * 0.5], C.slateD);
  c.fillStyle = 'rgba(33,42,72,0.22)'; c.fillRect(x0 + 3, bench.panel, x1 - x0 - 3 - (rightR ? 3 : 0), 1.6);
  // modesty panel
  fillRR(c, x0 + 3, bench.front + 0.5, x1 - x0 - 3 - (rightR ? 3 : 0), bench.panel - bench.front, [0, 0, R.s, rightR], lg(c, x0, 0, x1, 0, [[0, '#9CA8C1'], [1, '#B3BDD1']]));
  for (const [sx0] of stations.slice(1)) if (sx0 < x1 - 1) line(c, sx0, bench.front + 2, sx0, bench.panel - 1, 0.3, 'rgba(55,67,96,0.3)', 'butt');
  // the top (seen a little from above) + its front edge
  fillRR(c, x0, bench.back, x1 - x0, bench.front - bench.back + 1, [R.s, rightR, 0, 0], lg(c, x0, 0, x1, 0, [[0, '#E1E6EF'], [1, C.cloud]]));
  fillRR(c, x0, bench.front, x1 - x0, 1, 0, C.white);
  // the packed boxes on the desks
  stations.forEach(([a, b], i) => {
    if (!o.stations.includes(i)) return;
    const bx = Math.round((a + b) / 2) - 8 + (i === 3 ? 6 : 0);
    deskBox(c, bx, G.bench.back - 24, i === 3 ? 3 : (i * 3 + 1) % 5);
  });
};
/** a packed box (the house's moving box: cloud-grey, taped in the warm accent) at the pixel box's anchor; kind 0..4 */
export const deskBox = (c: Ctx, x: number, y: number, kind: number) => {
  const T = 12;
  // the box's soft shadow on the desk, away from the window
  softShadow(c, () => rr(c, x - 1.8, y + T + 10.5, 21, 4, 2), 'rgba(33,42,72,0.24)', 6);
  item(c, x, y, kind);
  fillRR(c, x, y + T, 20, 14, R.s, lg(c, x, 0, x + 20, 0, [[0, '#D5DCE8'], [0.74, '#DFE5EF'], [0.75, '#EEF2F8'], [1, '#F4F7FB']]));
  fillRR(c, x, y + T, 20, 1.6, [R.s, R.s, 0, 0], C.white);
  c.fillStyle = 'rgba(55,67,96,0.10)'; c.fillRect(x, y + T + 1.6, 15, 1);
  boxDetails(c, x, y + T, 20, 14, (kind + 1) % 4, false, 0.8);
};
/** the house's moving boxes: three cloud-greys, so a row of them never reads as one pasted asset */
const BOX_TONE: Array<[string, string]> = [['#D6DDE9', '#EEF2F8'], ['#D2D9E6', '#E9EEF6'], ['#DAE0EA', '#F1F4F9']];
/**
 * A box's details, all inside its silhouette (the pixel box it lands on keeps its outline): the tape in the house's
 * warm accent, and one of four small variations, so each box is somebody's box. v 0: the tape off-centre; 1: centred,
 * with its end folded over the top edge; 2: a shipping label on the lit side; 3: a hand-hole. `flip` keeps the lit
 * side toward the window (screen right). `dx` nudges the tape (the desk boxes' tape sat at 6.8).
 */
const boxDetails = (c: Ctx, x: number, y: number, w: number, h: number, v: number, flip: boolean, dx = 0) => {
  const tx = v === 1 ? x + w / 2 - 1 : x + 6 + dx;
  fillRR(c, tx, y + 1, 2 + (dx ? 0.2 : 0), h - 1, 0, C.warm);
  if (v === 1) fillRR(c, tx - 0.6, y - 0.1, 3.2, 1.8, [R.s * 0.5, R.s * 0.5, 0, 0], C.warmD); // the tape's end over the edge
  // the lit side, in the box's own local frame (flip mirrors the staff member, so their box's lit side too)
  const lit = (a: number, ww: number) => (flip ? x + w - a - ww : x + a);
  if (v === 2) { // a shipping label: cloud white, two ruled lines of an address nobody can read
    fillRR(c, lit(w - 7.2, 5.6), y + 3.6, 5.6, 4.2, 0.5, C.white);
    line(c, lit(w - 6.4, 3.6), y + 5.1, lit(w - 6.4, 3.6) + 3.6, y + 5.1, 0.35, C.slateL, 'butt');
    line(c, lit(w - 6.4, 2.6), y + 6.4, lit(w - 6.4, 2.6) + 2.6, y + 6.4, 0.35, C.slateL, 'butt');
  } else if (v === 3) { // a hand-hole, the far side's shade inside it
    fillRR(c, lit(w - 7.5, 4.8), y + 2.9, 4.8, 1.7, 0.85, 'rgba(55,67,96,0.42)');
  } else if (dx === 0 && v === 0) { // a strip of marker on the flap: somebody's name, too small to read
    line(c, lit(w - 7.2, 4.4), y + 4.2, lit(w - 7.2, 4.4) + 4.4, y + 4.4, 0.45, 'rgba(43,52,80,0.55)');
  } else {
    fillRR(c, x + 2, y + 5.6, 3, 1.2, 0.6, 'rgba(55,67,96,0.35)'); // (the desk boxes' old grip mark)
  }
};
const item = (c: Ctx, x: number, y: number, kind: number) => {
  if (kind === 0) { // a desk plant
    fillRR(c, x + 11.4, y + 5, 1.2, 8, 0.6, C.leafD);
    for (const [lx, ly, a] of [[9.6, 4.4, -0.7], [14.4, 3.6, 0.6], [12, 2, 0.05], [10, 6.8, -1.1], [14.8, 6.6, 1.1]]) { c.save(); c.translate(x + lx, y + ly); c.rotate(a); ell(c, 0, 0, 1.3, 2.6); c.fillStyle = a > 0 ? C.leafL : C.leaf; c.fill(); c.restore(); }
  } else if (kind === 1) { // a desk lamp's arm
    line(c, x + 4, y + 11.5, x + 10, y + 4.2, 1.1, C.slateM);
    c.beginPath(); c.moveTo(x + 8.6, y + 4.8); c.lineTo(x + 15, y + 2.4); c.lineTo(x + 15.6, y + 5.2); c.closePath(); c.fillStyle = C.slate; c.fill();
  } else if (kind === 2) { // a rolled poster + a cable
    fillRR(c, x + 13.8, y + 1, 2.4, 12, 1.2, lg(c, x + 13.8, 0, x + 16.2, 0, [[0, '#E5EAF2'], [1, C.white]]));
    c.beginPath(); c.moveTo(x + 3, y + 11.5); c.quadraticCurveTo(x + 5.5, y + 8.5, x + 8.5, y + 10.5); c.lineWidth = 0.8; c.strokeStyle = C.ink; c.stroke();
  } else if (kind === 3) { // a mug and notebooks
    fillRR(c, x + 3, y + 7.6, 5, 5, [R.s * 0.5, R.s * 0.5, R.s, R.s], C.white);
    c.beginPath(); c.arc(x + 8.3, y + 10, 1.3, -Math.PI / 2, Math.PI / 2); c.lineWidth = 0.7; c.strokeStyle = C.white; c.stroke();
    ['#7B8FB8', C.slate, '#9DB3D6'].forEach((col, k) => fillRR(c, x + 11, y + 9.6 - k * 1.3, 7, 1.3, 0.4, col));
  } else { // a small generic cup
    fillRR(c, x + 9, y + 5, 5, 4, [0, 0, R.m, R.m], C.slateLL);
    fillRR(c, x + 10.8, y + 9, 1.4, 3, 0, C.slateL);
    fillRR(c, x + 9, y + 11.6, 5, 1, 0.5, C.slateL);
  }
};

// ================================================================== THE STAFF (a crowd of nobody in particular)
const SKIN = ['#8C5C45', '#B27C5E', '#E0B290', '#603F33', '#C99476'];
const SKIN_LIT = ['#9E6B52', '#C38D6E', '#EDC3A2', '#71493B', '#D8A585'];
const HAIR = ['#211C20', '#37282B', '#56392D', '#7B5540', '#9EA5B2', '#1E2232'];
const COAT: Array<[string, string]> = [['#8B90A0', '#A2A7B6'], ['#3E4B6D', '#52618A'], ['#474F62', '#5B6479'], ['#5C7784', '#71909E'], ['#686384', '#7E79A0'], ['#5B6B8C', '#7283A8'], ['#A9B2C4', '#C1C9D8']];
const PANTS = ['#272D40', '#363C4D', '#2E3552', '#3B3439'];
const UNDER = ['#EEF1F6', '#B8C0CE', '#3A4460', '#7089BA', '#A5B1CA'];
export interface StaffDef { x: number; foot: number; seed: number; coat: number; flip: boolean }
export const STAFF: StaffDef[] = WALKOUT_CROWD.map((e) => ({x: e.x, foot: e.foot, seed: e.seed, coat: e.coat, flip: e.x > CROWD_LOOK_X}));
/**
 * One of the staff, in the house style, on the pixel extra's own anchor and seeded attributes (walkoutExtra: skin,
 * hair, style, coat length, pants, the top underneath, the thing in the box, the height), so the vector figure lands on
 * the pixel figure's silhouette. Local coords = the 30 x 78 sprite's, feet on row 77; flip = facing screen-left.
 * The light always comes from the window (screen right), whichever way the figure faces.
 */
export const drawStaff = (c: Ctx, s: StaffDef, clipY?: number, blink = false, bob = 0) => {
  const r = (k: number) => h01(s.seed, 20 + k);
  const skinI = Math.floor(r(2) * 5), hair = HAIR[Math.floor(r(3) * HAIR.length)];
  const style = Math.floor(r(4) * 6), long = r(5) < 0.55, pants = PANTS[Math.floor(r(6) * 4)];
  const under = UNDER[Math.floor(r(7) * 5)], kind = Math.floor(r(8) * 4), dy = Math.floor(r(9) * 4);
  const [coat, coatL] = COAT[s.coat % COAT.length];
  const skin = SKIN[skinI], skinL = SKIN_LIT[skinI];
  const ox = s.x - 15, oy = s.foot - EXTRA_H + 1;
  c.save();
  if (clipY !== undefined) { c.beginPath(); c.rect(-10, -10, 500, clipY + 10); c.clip(); }
  c.translate(ox, oy);
  if (s.flip) { c.translate(30, 0); c.scale(-1, 1); }
  // light from screen-right: in local coords that is +x unflipped, -x flipped
  const L = (x0: number, x1: number, a: string, b: string) => (s.flip ? lg(c, x1, 0, x0, 0, [[0, a], [1, b]]) : lg(c, x0, 0, x1, 0, [[0, a], [1, b]]));
  const cx = 15;
  const legTop = (long ? 58 : 48) + dy;
  // legs + shoes (feet on the bottom rows whatever the height)
  fillRR(c, cx - 6, legTop - 1, 4.6, 76 - legTop + 1, [0, 0, R.s, R.s], pants);
  fillRR(c, cx + 1, legTop - 1, 4.6, 76 - legTop + 1, [0, 0, R.s, R.s], L(cx + 1, cx + 5.6, pants, '#4A5166'));
  fillRR(c, cx - 7.4, 74.4, 6.4, 3.4, [R.m, R.s, R.s, R.s], '#232838');
  fillRR(c, cx + 0.8, 74.4, 7.2, 3.4, [R.s, R.m, R.s, R.s], '#2A3042');
  // the breath (pass 6): everything above the legs rides it (native px, down = the out-breath), smooth, on 1s
  c.translate(0, bob);
  // the coat: shoulders to the hem, a gentle A-line
  const hem = legTop + 0.5;
  roundPoly(c, [cx - 6, 16 + dy, cx + 6, 16 + dy, cx + 9.6, 19.5 + dy, cx + 11.2, hem, cx - 11.2, hem, cx - 9.6, 19.5 + dy], R.m);
  c.fillStyle = L(cx - 11, cx + 11, coat, coatL); c.fill();
  // the V opening and the lapels
  polyP(c, [cx - 2.6, 16.4 + dy, cx + 2.6, 16.4 + dy, cx, 23 + dy]); c.fillStyle = under; c.fill();
  c.beginPath(); c.moveTo(cx - 3.4, 15.8 + dy); c.lineTo(cx - 0.6, 24.5 + dy); c.lineWidth = 0.8; c.strokeStyle = 'rgba(30,36,56,0.28)'; c.stroke();
  c.beginPath(); c.moveTo(cx + 3.4, 15.8 + dy); c.lineTo(cx + 0.6, 24.5 + dy); c.strokeStyle = 'rgba(255,255,255,0.18)'; c.stroke();
  // neck + head (3/4 toward local +x), simple face
  fillRR(c, cx - 2.2, 12.5 + dy, 4.6, 4.6, R.s, skin);
  fillRR(c, cx - 2.2, 12.5 + dy, 4.6, 1.6, 0, 'rgba(40,24,24,0.18)'); // the chin's shade on the neck
  c.save();
  ell(c, cx + 0.3, 6.6 + dy, 5.7, 6.5); c.fillStyle = L(cx - 6, cx + 6, skin, skinL); c.fill();
  ell(c, cx + 5.4, 7.4 + dy, 1.2, 1.3); c.fillStyle = skinL; c.fill(); // the nose, past the profile
  ell(c, cx - 3.2, 7 + dy, 1.2, 1.6); c.fillStyle = skin; c.fill(); // the near ear
  c.fillStyle = '#23252F';
  if (blink) { // the lids down: two short soft strokes where the eyes were (held 2 frames, like every held drawing here)
    line(c, cx + 0.95, 6.2 + dy, cx + 2.25, 6.2 + dy, 0.42, '#23252F');
    line(c, cx + 3.7, 6.1 + dy, cx + 4.7, 6.1 + dy, 0.38, '#23252F');
  } else {
    ell(c, cx + 1.6, 5.9 + dy, 0.62, 0.8); c.fill();
    ell(c, cx + 4.2, 5.8 + dy, 0.5, 0.75); c.fill();
  }
  c.beginPath(); c.moveTo(cx + 2, 9.9 + dy); c.quadraticCurveTo(cx + 3, 10.5 + dy, cx + 4, 9.9 + dy); c.lineWidth = 0.45; c.strokeStyle = 'rgba(60,30,30,0.45)'; c.lineCap = 'round'; c.stroke();
  c.restore();
  hairFor(c, style, cx, dy, hair, coat, coatL);
  // arms round the box, the box at the waist, hands on its lower corners. Each arm is its own shape (the shoulder,
  // a slight bend at the elbow, the cuff) one value step off the coat: the window side (screen right) lit, the far
  // side in shade, a quiet seam where the sleeve meets the body, so the arms read as arms at room scale.
  const by = 32 + dy, bw = 18, bh = 12, bx = cx - 9;
  const litLocalRight = !s.flip; // local +x is screen right unless flipped
  const armL = [bx - 2.4, 17.6 + dy, bx + 1.8, 18 + dy, bx + 1.4, by + 2.6, bx + 1.9, by + 9.6, bx - 2.1, by + 10.3, bx - 4.0, by + 3.4];
  const armR = armL.map((v, i) => (i % 2 ? v : 30 - v));
  const shadeCoat = mixHex(coat, '#1C2236', 0.2), litCoat = mixHex(coatL, '#FFFFFF', 0.1);
  const arm = (pts: number[], lit: boolean) => {
    roundPoly(c, pts, R.s * 1.2); c.fillStyle = lit ? litCoat : shadeCoat; c.fill();
    const inner = pts[0] < 15 ? [pts[2] - 0.2, pts[3] + 1.5, pts[4] - 0.2, pts[5]] : [pts[2] + 0.2, pts[3] + 1.5, pts[4] + 0.2, pts[5]];
    line(c, inner[0], inner[1], inner[2], inner[3], 0.45, 'rgba(20,26,45,0.24)');
    const cy_ = by + 8.2, xa = Math.min(pts[6], pts[8]) - 0.1, xb = Math.max(pts[6], pts[8]) + 0.1;
    fillRR(c, xa, cy_, xb - xa, 1.3, 0.5, lit ? coat : mixHex(coat, '#1C2236', 0.35)); // the cuff
  };
  arm(armL, !litLocalRight);
  arm(armR, litLocalRight);
  kindItem(c, kind, bx, by);
  fillRR(c, bx - 1, by + bh - 1, bw + 1, 3, R.s, 'rgba(20,26,45,0.16)'); // the box's shade on the coat
  const bv = Math.floor(r(10) * 4); // the box's own details (a new hash slot: no existing attribute changes)
  const [b0, b1] = BOX_TONE[Math.floor(r(11) * BOX_TONE.length)];
  fillRR(c, bx, by, bw, bh, R.s, L(bx, bx + bw, b0, b1));
  fillRR(c, bx, by, bw, 1.5, [R.s, R.s, 0, 0], C.white);
  boxDetails(c, bx, by, bw, bh, bv, s.flip);
  // hands: a rounded mitt on each lower corner, the thumb over the box's face
  const hand = (hx: number, sgn: number, lit: boolean) => {
    const col = lit ? skinL : skin;
    c.beginPath(); c.ellipse(hx, by + 10, 1.75, 1.45, 0, 0, Math.PI * 2); c.fillStyle = col; c.fill();
    c.beginPath(); c.ellipse(hx + sgn * 1.5, by + 8.9, 0.95, 0.62, sgn * 0.5, 0, Math.PI * 2); c.fillStyle = col; c.fill();
  };
  hand(bx - 0.3, 1, !litLocalRight);
  hand(bx + bw + 0.3, -1, litLocalRight);
  c.restore();
};
const hairFor = (c: Ctx, style: number, cx: number, dy: number, hair: string, coat: string, coatL: string) => {
  c.fillStyle = hair;
  const top = () => { c.beginPath(); c.ellipse(cx + 0.2, 4.2 + dy, 6, 4.6, 0, Math.PI, Math.PI * 2); c.fill(); fillRR(c, cx - 5.8, 2 + dy, 4.2, 5.4, [R.m, 0, R.s, R.m], hair); };
  if (style === 0) top();
  else if (style === 1) { top(); fillRR(c, cx - 6.2, 3 + dy, 4.6, 11.5, [R.m, 0, R.m, R.m], hair); }
  else if (style === 2) { top(); ell(c, cx - 1.8, -1.6 + dy, 2.6, 2.2); c.fill(); }
  else if (style === 3) { for (const [x, y, rr_] of [[-4, 1.5, 2.6], [-1.2, 0.2, 2.8], [2, 0.3, 2.6], [4.4, 2, 2], [-5.2, 4.2, 2.2], [-5, 7, 2]]) { ell(c, cx + x, y + dy, rr_, rr_ * 0.9); c.fill(); } }
  else if (style === 4) { // a knit beanie, in the coat's colours
    c.fillStyle = coat; c.beginPath(); c.ellipse(cx + 0.2, 3.4 + dy, 6.2, 5.2, 0, Math.PI, Math.PI * 2); c.fill();
    fillRR(c, cx - 6, 2.4 + dy, 12.4, 2.2, R.s, coatL);
    ell(c, cx, -2.3 + dy, 1.15, 0.95); c.fillStyle = coatL; c.fill(); // the pom on the pixel pom (cols cx-1..cx, row -3)
    fillRR(c, cx - 5.8, 4 + dy, 3, 3, R.s, hair);
  } else { c.beginPath(); c.ellipse(cx + 0.2, 4 + dy, 5.8, 3.8, 0, Math.PI, Math.PI * 2); c.fill(); }
};
const kindItem = (c: Ctx, k: number, bx: number, by: number) => {
  if (k === 0) { fillRR(c, bx + 11.4, by - 6, 1.2, 6, 0.6, C.leafD); for (const [x, y, a] of [[10.4, -6.6, -0.7], [13.6, -7.4, 0.5], [12.2, -8.6, 0]]) { c.save(); c.translate(bx + x, by + y); c.rotate(a); ell(c, 0, 0, 1.2, 2.4); c.fillStyle = C.leafL; c.fill(); c.restore(); } }
  if (k === 1) fillRR(c, bx + 2.6, by - 9.6, 2.4, 10, 1.2, lg(c, bx + 2.6, 0, bx + 5, 0, [[0, '#E3E8F1'], [1, C.white]]));
  if (k === 2) { fillRR(c, bx + 9, by - 4, 5, 4.4, [R.s * 0.5, R.s * 0.5, 0, 0], C.white); c.beginPath(); c.arc(bx + 14.2, by - 1.8, 1.1, -Math.PI / 2, Math.PI / 2); c.lineWidth = 0.6; c.strokeStyle = C.white; c.stroke(); }
  if (k === 3) ['#7B8FB8', C.slate, '#9DB3D6'].forEach((col, j) => fillRR(c, bx + 2, by - 1.4 - j * 1.2, 10, 1.3, 0.4, col));
};
/**
 * The staff's breath (pass 6: the crowd was frozen). The same period and phase as each pixel extra's held breath
 * (pixel.ts FIGS), so nobody's breath jumps when the medium changes; here it is the house style's own motion: smooth,
 * on 1s, 0.35 native px at the bottom of the out-breath (the corporate explainer's idle loop, which is the joke).
 */
export const breathAt = (seed: number, p: number) => {
  const per = 2 * (26 + Math.floor(h01(seed, 81) * 14)), ph = Math.floor(h01(seed, 82) * per);
  const t = ((p + ph) % per) / per;
  return 0.35 * 0.5 * (1 - Math.cos(2 * Math.PI * (t - 0.25)));
};
/** the crowd rows (the plate's own draw order): 'back' = behind the bench + the pair by the window, 'front' = the rest */
export const drawCrowd = (c: Ctx, row: 'back' | 'front', blinking: ReadonlySet<number> = new Set(), p?: number, skip: ReadonlySet<number> = new Set()) => {
  for (const s of STAFF) {
    if (skip.has(s.seed)) continue;
    const e = WALKOUT_CROWD.find((q) => q.seed === s.seed)!;
    const isBack = e.behind || e.foot < 170;
    if ((row === 'back') !== isBack) continue;
    drawStaff(c, s, e.behind ? G.bench.back : undefined, blinking.has(s.seed), p === undefined ? 0 : breathAt(s.seed, p));
  }
  if (row === 'back') deskBox(c, G.win.x0 + 30, G.win.y1 + 9 - 25, 4); // the box left on the credenza
};

/**
 * The staff's blinks during the hold (p309-388): each of them blinks once at a hashed frame, some twice, on 2s (the
 * lids down for 2 frames), never on a cut, never on "Hello." (p352-369, the room holds its breath). No loop: life, not
 * a cycle. Returns the seeds whose lids are down at clip frame p.
 */
export const blinkingAt = (p: number, from = 310, to = 386): Set<number> => {
  const out = new Set<number>();
  for (const e of WALKOUT_CROWD) {
    const starts: number[] = [];
    const a = from + 2 * Math.floor(h01(e.seed, 71) * ((to - from) / 2));
    starts.push(a);
    if (h01(e.seed, 72) < 0.45) starts.push(a + 30 + 2 * Math.floor(h01(e.seed, 73) * 12));
    for (const t of starts) {
      if (t >= 352 && t <= 369) continue;
      if (t === 324 || t === 326 || t > to) continue;
      if (p >= t && p < t + 2) out.add(e.seed);
    }
  }
  return out;
};
// ================================================================== the depth cue (flat illustration's own: lighter, never blurred)
export const haze = (c: Ctx, a: number) => {
  if (a <= 0) return;
  c.save();
  c.globalCompositeOperation = 'source-atop';
  c.fillStyle = `rgba(236,241,248,${a})`;
  c.fillRect(-10, -10, 500, 230);
  c.restore();
};
