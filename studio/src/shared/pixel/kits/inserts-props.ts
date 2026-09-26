// MR. MAS — kits: the act-4 INSERT-SCALE PROPS (Ep1). New file, owned by the act-4 insert + expression artist.
// pov-changes §5.3 "New insert-scale props: 3":
//   drawLaptopCornerMic  sc 26: the laptop's screen corner in the phone insert, the call's mic chip LIT (his tile is
//                        gone; his microphone isn't). The call app's own micIcon (kits/callgrid.ts), redrawn at insert
//                        scale (2x the call's detail, never an enlargement), green = live, the level bars up.
//   drawVaultInsert      sc 31: the squat steel vault stencilled Q*, under the hall's tungsten spill, its yellow
//                        sticky note legible: DO NOT OPEN. DO NOT EXPLAIN. (the hum is sound only)
//   drawShutDoorInsert   sc 31: the conference-room door, shut, its ALYI nameplate still on; the IOU note's corner at
//                        the jamb (it flutters off in Ep2, not here)
// All room-area plates (480 x 203), master palette, lit through the rooms' own materials.
import {Buf, rect, line, bayer, hash, poly, ellipse} from '../px';
import {PAL, stepColor} from '../palette';
import {text, textWidth, bigText, bigTextWidth} from '../font';
import {MatBuf, resolve, defineMat} from '../light';

export const PROP_W = 480, PROP_H = 203;

// ================================================================== 1) the laptop's corner + the call's mic, lit
/** rooms-a DESK_INSERT's laptop corner: the screen quad in the insert (the plate draws the lid + bezel around it) */
export const LAPTOP_CORNER = {quad: [0, 0, 150, 0, 158, 68, 0, 80], mic: {x: 70, y: 44}};
const inQuad = (x: number, y: number) => {
  // the screen's lower edge runs (0, 80) -> (158, 68); its right edge (150, 0) -> (158, 68)
  if (x < 0 || y < 0) return false;
  const yb = 80 - (x / 158) * 12, xr = 150 + (y / 68) * 8;
  return y < yb && x < xr;
};
/**
 * The call app in the laptop's corner, seen past the phone: the board's grid (a tile's corner, dark), the control
 * bar along the bottom with the camera (off, slashed), share, leave (red), and THE MIC CHIP lit green with its
 * level bars up (level 0..3; 3 = he's still transmitting room tone). Paint after drawDeskInsert (it covers the
 * plate's own red placeholder icon).
 */
export const drawLaptopCornerMic = (b: Buf, o: {level?: number; f?: number} = {}) => {
  const lv = Math.max(0, Math.min(3, Math.round(o.level ?? 3)));
  const put = (x: number, y: number, c: number) => { if (inQuad(x, y)) b.set(x, y, c); };
  // the app's dark background and the corner of the board's grid (two tiles, their name plates unreadable)
  for (let y = 0; y < 82; y++) for (let x = 0; x < 160; x++) put(x, y, y < 10 ? PAL.N2 : PAL.N1);
  for (let x = 0; x < 160; x++) put(x, 10, PAL.N0);
  for (const [tx, ty, tw, th] of [[-20, 14, 78, 34], [62, 14, 78, 34]]) {
    for (let y = ty; y < ty + th; y++) for (let x = tx; x < tx + tw; x++) put(x, y, PAL.N3);
    for (let x = tx; x < tx + tw; x++) { put(x, ty, PAL.N4); put(x, ty + th - 1, PAL.N0); }
    for (let x = tx + 3; x < tx + 20; x++) for (let y = ty + th - 7; y < ty + th - 2; y++) put(x, y, PAL.N0);
  }
  // the control bar
  const by = 52;
  for (let y = by; y < by + 22; y++) for (let x = 0; x < 160; x++) put(x, y, PAL.N2);
  for (let x = 0; x < 160; x++) put(x, by, PAL.N3);
  // camera (off): a small body + lens, slashed red
  const cam = (x: number, y: number) => {
    for (let j = 0; j < 8; j++) for (let i = 0; i < 11; i++) put(x + i, y + j, i < 8 ? PAL.G4 : (j > 1 && j < 6 ? PAL.G4 : PAL.N2));
    for (let j = 2; j < 6; j++) for (let i = 2; i < 6; i++) put(x + i, y + j, PAL.N2);
    for (let k = 0; k < 12; k++) put(x - 1 + k, y + 8 - Math.round(k * 0.75), PAL.R3);
  };
  cam(14, by + 7);
  // share (an up-arrow tray), leave (red pill)
  for (let i = 0; i < 9; i++) put(38 + i, by + 14, PAL.G4);
  put(38, by + 13, PAL.G4); put(46, by + 13, PAL.G4);
  for (let j = 0; j < 7; j++) put(42, by + 6 + j, PAL.G4);
  put(41, by + 7, PAL.G4); put(43, by + 7, PAL.G4); put(40, by + 8, PAL.G4); put(44, by + 8, PAL.G4);
  for (let j = 0; j < 9; j++) for (let i = 0; i < 18; i++) if (!((i === 0 || i === 17) && (j === 0 || j === 8))) put(120 + i, by + 7 + j, PAL.R1);
  for (let i = 3; i < 15; i++) put(120 + i, by + 11, PAL.P1);
  // THE MIC CHIP (2x the call's 11x11 chip): a dark rounded square, the capsule with its grille, the holder, the
  // stand and the foot, all live green; the three level bars beside it
  const {x: mx, y: my} = LAPTOP_CORNER.mic;
  const G = lv > 0 ? [PAL.L1, PAL.L2, PAL.L3] : [PAL.G2, PAL.G4, PAL.P1];
  for (let j = 0; j < 22; j++) for (let i = 0; i < 22; i++) if (!((i === 0 || i === 21) && (j === 0 || j === 21))) put(mx + i, my + j, PAL.N0);
  for (let i = 1; i < 21; i++) put(mx + i, my, PAL.N3);
  for (let j = 3; j < 13; j++) for (let i = 8; i < 14; i++) {
    const edge = i === 8 || i === 13 || j === 3 || j === 12;
    const round = (j === 3 || j === 12) && (i === 8 || i === 13);
    if (round) continue;
    put(mx + i, my + j, edge ? G[1] : (j % 2 === 0 ? G[2] : G[1]));
  }
  put(mx + 9, my + 4, PAL.C9); // the glint
  // the U-holder, the stand, the foot
  for (let j = 9; j < 16; j++) { put(mx + 6, my + j, G[2]); put(mx + 15, my + j, G[1]); }
  for (let i = 7; i < 15; i++) put(mx + i, my + 16, j16(i) ? G[2] : G[1]);
  for (let j = 16; j < 19; j++) put(mx + 11, my + j, G[1]);
  for (let i = 8; i < 15; i++) put(mx + i, my + 19, G[1]);
  for (let k = 0; k < 3; k++) {
    const on = k < lv;
    const hgt = 4 + k * 3;
    for (let j = 0; j < hgt; j++) { put(mx + 25 + k * 4, my + 18 - j, on ? PAL.L3 : PAL.G1); put(mx + 26 + k * 4, my + 18 - j, on ? PAL.L2 : PAL.G1); }
  }
};
const j16 = (i: number) => i < 11;

// ================================================================== 2) the Q* vault (sc 31)
defineMat('ins.steel', ['N0', 'N1', 'N2', 'N3', 'G1', 'G2', 'G3', 'G4'], ['N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C5', 'C7'], ['N0', 'W0', 'G1', 'G2', 'W3', 'G4', 'W6', 'W8']);
defineMat('ins.carpet', ['N0', 'N1', 'N2', 'N3', 'G1', 'G2', 'G3', 'G4'], ['N1', 'N2', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6'], ['N1', 'D1', 'D2', 'D3', 'D4', 'W3', 'W4', 'W5']);
defineMat('ins.wallB', ['N2', 'N3', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6'], ['N3', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'P2'], ['N1', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5', 'W6']);
defineMat('ins.sticky', ['N0', 'N1', 'D2', 'D3', 'W3', 'W4', 'W5', 'W6'], ['N0', 'N1', 'W2', 'W3', 'W5', 'W6', 'W7', 'W8'], ['N0', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']);
/**
 * The vault, close: a squat steel box filling the lower two-thirds, its door with the wheel handle and the hinge
 * bolts, `Q*` stencilled big (spray-stencil breaks in the strokes), the yellow sticky note on the door with its two
 * lines readable. Lit from the hall (left) in tungsten; the bullpen's cool daylight on its right side. f: nothing
 * moves (the hum is sound only); pass it for continuity.
 */
export const drawVaultInsert = (b: Buf, f = 0) => {
  void f;
  const mb = new MatBuf(PROP_W, PROP_H);
  // behind: the hall mouth's wall (left, warm) and the bullpen's back wall (right, day), the carpet
  rect(0, 0, PROP_W, 150, mb.mat('ins.wallB', 0.2));
  rect(0, 150, PROP_W, PROP_H - 150, mb.mat('ins.carpet', 0.3));
  for (let x = 0; x < PROP_W; x++) mb.mat('ins.wallB', 1.2)(x, 149);
  // the vault body: a squat box in 3/4 (its front face, its right side turning away), a plinth
  const fx0 = 96, fx1 = 330, fy0 = 34, fy1 = 186, sx1 = 382;
  poly([fx0, fy0, fx1, fy0, fx1, fy1, fx0, fy1], mb.mat('ins.steel', 0.6));
  poly([fx1, fy0, sx1, fy0 + 14, sx1, fy1 - 6, fx1, fy1], mb.mat('ins.steel', -0.6));
  poly([fx0, fy0, fx1, fy0, sx1, fy0 + 14, fx0 + 40, fy0 + 14], mb.mat('ins.steel', 1.4));
  rect(fx0 - 4, fy1, sx1 - fx0 + 8, 6, mb.mat('ins.steel', -1.2));
  // the door: an inset panel with a bevel, the hinge bolts on the right, the wheel handle on the left
  const dx0 = fx0 + 16, dx1 = fx1 - 16, dy0 = fy0 + 16, dy1 = fy1 - 14;
  rect(dx0, dy0, dx1 - dx0, dy1 - dy0, mb.shade(-0.4));
  rect(dx0, dy0, dx1 - dx0, 2, mb.shade(1.2)); rect(dx0, dy0, 2, dy1 - dy0, mb.shade(1));
  rect(dx0, dy1 - 2, dx1 - dx0, 2, mb.shade(-1.2)); rect(dx1 - 2, dy0, 2, dy1 - dy0, mb.shade(-1));
  for (const yy of [dy0 + 18, dy1 - 24]) { rect(dx1 - 12, yy, 10, 16, mb.shade(0.8)); rect(dx1 - 12, yy + 15, 10, 1, mb.shade(-1.4)); }
  resolve(mb, {
    amb: (x, y) => 2.2 + (y > 150 ? -0.5 : 0) + (x > 330 ? 0.6 : 0),
    cyan: (x) => Math.max(0, Math.min(1, (x - 250) / 220)) * 0.55, // the bullpen's day from the right (the 'cyan' slot = day)
    warm: (x, y) => Math.max(0, 1 - Math.hypot((x + 40) / 380, (y - 60) / 260)) * 0.95, // the hall's tungsten spill
    dither: 0.5,
  }, b, 0);
  // the wheel handle: a spoked ring on a hub (drawn, never rotated), the hall light on its left edges
  const wx = dx0 + 44, wy = (dy0 + dy1) / 2;
  for (let j = -22; j <= 22; j++) for (let i = -22; i <= 22; i++) {
    const d = Math.hypot(i, j);
    const X = wx + i, Y = Math.round(wy) + j;
    if (d > 16 && d < 20.5) b.set(X, Y, i < -3 && j < 6 ? PAL.W5 : i < 4 ? PAL.G3 : PAL.G1);
    else if (d > 20.5 && d < 21.8) b.set(X, Y, PAL.N0);
  }
  for (const a of [0, 1, 2]) {
    const ang = (a * Math.PI) / 3 + 0.3;
    line(wx - Math.round(Math.cos(ang) * 17), Math.round(wy - Math.sin(ang) * 17), wx + Math.round(Math.cos(ang) * 17), Math.round(wy + Math.sin(ang) * 17), (x, y) => { b.set(x, y, PAL.G3); b.set(x + 1, y + 1, PAL.N0); });
  }
  for (let j = -5; j <= 5; j++) for (let i = -5; i <= 5; i++) { const d = Math.hypot(i, j); if (d <= 5) b.set(wx + i, Math.round(wy) + j, d > 3.8 ? PAL.N0 : i < 0 && j < 0 ? PAL.W6 : PAL.G4); }
  // Q* stencilled large on the door: the display face at 2x2 per pixel, pale stencil paint (two small bridges on the
  // Q's bowl, the classic stencil break), a little worn
  const qb = new Buf(60, 20, 0xff00ff);
  bigText(qb, 'Q*', 0, 2, PAL.N1);
  const qx = dx0 + 92, qy = dy0 + 12;
  for (let j = 0; j < qb.h; j++) for (let i = 0; i < qb.w; i++) {
    if (qb.get(i, j) !== PAL.N1) continue;
    if (i >= 5 && i <= 6 && (j <= 3 || j >= 14)) continue; // the stencil's bridges (top and bottom of the bowl)
    for (let v = 0; v < 2; v++) for (let u = 0; u < 2; u++) {
      const X = qx + i * 2 + u, Y = qy + j * 2 + v;
      if (hash(X, Y, 31) < 0.08) continue; // worn paint
      b.set(X, Y, X < qx + 30 ? PAL.P1 : PAL.G5);
    }
  }
  // the sticky note on the door: yellow, a little curl at its bottom corner, two lines readable
  const nx = dx0 + 86, ny = dy1 - 62, nw = 104, nh = 44;
  for (let j = 0; j < nh; j++) for (let i = 0; i < nw; i++) {
    const curl = i > nw - 8 && j > nh - 8 && (i - (nw - 8)) + (j - (nh - 8)) > 7;
    if (curl) continue;
    b.set(nx + i, ny + j, j < 7 ? PAL.W8 : (i + j * 5) % 23 === 0 ? PAL.W6 : PAL.W7);
  }
  for (let k = 0; k < 7; k++) b.set(nx + nw - 8 + k, ny + nh - 1 - k, PAL.W5);
  for (let i = 0; i < nw; i++) b.set(nx + i + 1, ny + nh, stepColor(b.get(nx + i + 1, ny + nh), -2));
  const l1 = 'DO NOT OPEN.', l2 = 'DO NOT EXPLAIN.';
  text(b, l1, nx + Math.round((nw - textWidth(l1)) / 2), ny + 12, PAL.N2);
  text(b, l2, nx + Math.round((nw - textWidth(l2)) / 2), ny + 26, PAL.N2);
  void bigTextWidth; void bayer; void ellipse;
};

// ================================================================== 3) the shut door and its nameplate (sc 31)
/**
 * The conference-room door, shut, close: the warm wood leaf filling the frame, its latch and lever on the left, the
 * steel nameplate `ALYI` still on at eye height (14 px display face: legible), the jamb at the left edge with the
 * yellowed IOU note's corner taped on it. Daylight from the bullpen windows (right).
 */
defineMat('ins.door', ['N0', 'D0', 'D1', 'D2', 'D3', 'D4', 'D4', 'W3'], ['D0', 'D1', 'D2', 'D3', 'D4', 'W3', 'W4', 'W5'], ['D0', 'D1', 'D2', 'D3', 'W3', 'W4', 'W5', 'W6']);
defineMat('ins.jamb', ['N0', 'N1', 'N2', 'N3', 'G1', 'G2', 'G3', 'G4'], ['N1', 'N2', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6'], ['N0', 'W0', 'W1', 'W3', 'W5', 'W6', 'W8', 'W9']);
export const drawShutDoorInsert = (b: Buf, o: {name?: string} = {}) => {
  const name = o.name ?? 'ALYI';
  const mb = new MatBuf(PROP_W, PROP_H);
  // the jamb (left), the leaf, the glass wall's edge far left
  rect(0, 0, 70, PROP_H, mb.mat('ins.jamb', 0.4));
  rect(70, 0, 14, PROP_H, mb.mat('ins.jamb', 1.0));
  rect(84, 0, PROP_W - 84, PROP_H, mb.mat('ins.door', 0.4));
  // the leaf's grain: long vertical lines, one rung apart, hashed (never a stripe pattern)
  for (let x = 84; x < PROP_W; x++) {
    const g = hash(x >> 1, 7, 3);
    if (g < 0.18) for (let y = 0; y < PROP_H; y++) if (hash(x, y >> 3, 5) < 0.85) mb.shade(-0.7)(x, y);
    if (g > 0.93) for (let y = 0; y < PROP_H; y++) mb.shade(0.5)(x, y);
  }
  // a shallow raised panel on the leaf
  rect(150, 18, 300, 170, mb.shade(0.25)); rect(150, 18, 300, 2, mb.shade(1.0)); rect(150, 18, 2, 170, mb.shade(0.8));
  rect(150, 186, 300, 2, mb.shade(-1.2)); rect(448, 18, 2, 170, mb.shade(-1.0));
  resolve(mb, {
    amb: () => 2.0,
    cyan: (x) => Math.max(0, Math.min(1, (x - 60) / 520)) * 0.75, // bullpen daylight from the windows (right)
    warm: () => 0,
    dither: 0.45,
  }, b, 0);
  // the latch side: the lever and its rose on the leaf near the jamb, the strike in the jamb
  const lx = 104, ly = 112;
  for (let j = -7; j <= 7; j++) for (let i = -7; i <= 7; i++) { const d = Math.hypot(i, j); if (d <= 7) b.set(lx + i, ly + j, d > 6 ? PAL.N1 : i < 0 && j < 0 ? PAL.G6 : PAL.G4); }
  rect(lx, ly - 3, 44, 6, b.ink(PAL.G4)); rect(lx, ly - 3, 44, 1, b.ink(PAL.G6)); rect(lx, ly + 2, 44, 1, b.ink(PAL.G2));
  rect(lx + 43, ly - 3, 2, 6, b.ink(PAL.G2));
  rect(76, ly - 10, 5, 22, b.ink(PAL.G3)); rect(77, ly - 4, 3, 8, b.ink(PAL.N0));
  // THE NAMEPLATE: brushed steel, 14 px letters engraved (dark fill, a lit lower lip), two screws
  const pw = bigTextWidth(name) + 28, ph = 30, px = Math.round(300 - pw / 2), py = 40;
  rect(px + 2, py + 2, pw, ph, (x, y) => b.set(x, y, stepColor(b.get(x, y), -2)));
  for (let j = 0; j < ph; j++) for (let i = 0; i < pw; i++) b.set(px + i, py + j, j === 0 || i === 0 ? PAL.G6 : j === ph - 1 || i === pw - 1 ? PAL.G3 : (i + (j >> 2)) % 9 === 0 ? PAL.G6 : PAL.G5);
  bigText(b, name, px + 14, py + 8 + 1, PAL.G6);
  bigText(b, name, px + 14, py + 8, PAL.N2);
  for (const sx of [px + 5, px + pw - 7]) { b.set(sx, py + ph / 2 - 1, PAL.G3); b.set(sx + 1, py + ph / 2 - 1, PAL.N2); b.set(sx, py + ph / 2, PAL.N2); b.set(sx + 1, py + ph / 2, PAL.G3); }
  // the IOU note's corner on the jamb (left edge), its tape: yellowed paper, one line's end showing
  const nx = -6, ny = 58;
  for (let j = 0; j < 40; j++) for (let i = 0; i < 64; i++) {
    const X = nx + i, Y = ny + j + (i > 40 ? 1 : 0);
    if (X < 0) continue;
    b.set(X, Y, j === 39 || i === 63 ? PAL.P0 : (i + j * 3) % 11 === 0 ? PAL.P1 : PAL.W8);
  }
  text(b, '20%', nx + 8, ny + 9, PAL.I0);
  text(b, 'PUTE', nx + 2, ny + 23, PAL.I0);
  for (let i = 0; i < 12; i++) for (let j = -2; j < 3; j++) b.set(nx + 50 + i, ny + j, j === -2 ? PAL.P2 : stepColor(b.get(nx + 50 + i, ny + j), 1));
};
