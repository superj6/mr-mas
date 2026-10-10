// MR. MAS — Ep2 v1 · act4 · sc 22: the PIXEL half of the 3D leap (2.H), a COPY of art/sets/iss.ts (the art pass's, imported
// only and never edited; the shots pass, 2026-10-09), with the plates' anchors embedded (anchors.json of the art's
// render, so the module reads no file at run time) and what the shots need (see the end of the file). The original
// header follows.
// MR. MAS — Ep2 v1 art: SET-23, ISS (sc 22): the PIXEL half of the 3D leap (2.H). The white cube, its sealed door, the
// brass plate, the slot and its sprung flap, the lot and the overcast sky are real 3D (art/iss/iss_scene.py, Blender
// EEVEE, plates at the room area's 1920 x 812). Mas, the flyer and Alyi stay pixel drawings, composited on top keeping
// the contrast (no grade match, no pixel rim, no down-rez): art/tools/iss-comp.ts lays each layer below at x4 over its
// plate, and fills the insert plate's keyed gap with the lit room.
//   ISS_ANCHORS                 the screen points (native px) of Mas's marks, the slot, the door, per shot: written by
//                               iss_scene.py (anchors.json) and copied here, so the figures stand on the 3D ground
//   issLayer(b, shot, f, st)    the pixel layer of one shot, on TRANSPARENT:
//                                 'wide'   22.02 Mas walking up from frame-left (st.t 0..1 along the walk), THE ORB at
//                                          his shoulder scanning the cube (st.scan) and toasting nothing
//                                 'ots'    22.04 his shoulder (out of focus) and arm, the flyer upside down with the tape on
//                                          its corners going into the slot (st.push 0..2)
//                                 'mcu'    22.07 Mas (medium) at the shut flap, facing it; st.lit: the face light, one step
//                                 'knock'  22.08 Mas raising a hand to knock (st.raise) and lowering it
//                                 'away'   22.09 his back, crossing the lot, small (st.t 0..1: he shrinks with distance)
//   issRoom(b, f, st)           22.05 the lit room seen through the gap: Alyi at a desk, working, absorbed (he never
//                               looks up); the flyer falling inside, out of frame, unseen (st.drop 0..3)
//   drawMasBackSmall(b, x, footY, h, step)   Mas from behind at any small height (the walk away's distance)
import {Buf, rect, line, ellipse, bayer, hash, clamp, TRANSPARENT} from '../../../../../shared/pixel/px';
import {PAL, stepColor, familyOf} from '../../../../../shared/pixel/palette';
import {drawOrb} from '../../../../../shared/pixel/cast/orb';
import {drawMasMedium, MAS_MEDIUM_DEFAULT, MAS_MW, MAS_MH, MAS_M_DESK} from '../../../../../shared/pixel/cast/mas-medium';
import {fill, vramp, RH, dith, capsule, grip, HANDSKIN, armTo} from '../../art/kit';
import {drawMasStand2, drawMasBack, MAS2_FOOT} from '../../art/cast/mas2';
import {drawAlyiAtWork} from '../../art/cast/alyi2';
import {drawFlyer} from '../../art/sets/lobby2';
import {placeHand, drawHand, sleeve, POSES} from '../../art/cast/hands2';

/** from iss_scene.py's anchors.json (render of 2026-10-09): [x, y] in native pixels of the 480 x 203 room area */
export let ISS_ANCHORS: Record<string, Record<string, [number, number]>> = {"wide":{"slot":[368.3,112.1],"doorL0":[348.0,152.8],"doorR0":[388.0,152.8],"doormark":[353.3,157.0],"doormarkHead":[353.8,82.1],"walk0":[-10.8,157.7],"walkMid":[205.4,157.7],"walk0Head":[-12.0,82.0],"mcuMas":[350.8,114.1],"mcuMasHead":[351.0,85.1],"away0":[340.6,158.5],"away0Head":[341.1,81.8],"away1":[-220.6,171.3],"away1Head":[-223.2,79.7]},"ots":{"slot":[228.3,118.1],"doorL0":[110.3,433.7],"doorR0":[314.1,298.8],"doormark":[187.2,686.9],"doormarkHead":[119.6,-344.5],"mcuMas":[116.3,301.7],"mcuMasHead":[59.0,-249.5],"away0":[25.4,1181.8],"away0Head":[-4981.3,-6032.3]},"mcu":{"slot":[269.6,191.9],"doorL0":[243.6,327.1],"doorR0":[318.3,504.3],"doormark":[150.6,338.8],"doormarkHead":[152.7,64.3],"walk0":[148.8,156.2],"walkMid":[145.5,197.5],"walk0Head":[149.2,101.0],"mcuMas":[159.7,178.3],"mcuMasHead":[160.4,76.0],"away0":[122.2,310.8],"away0Head":[124.7,69.8],"away1":[110.1,147.1],"away1Head":[110.6,102.9]},"knock":{"slot":[271.5,106.3],"doorL0":[251.3,148.8],"doorR0":[291.4,148.1],"doormark":[254.8,151.2],"doormarkHead":[254.9,75.4],"walk0":[-147.7,159.5],"walkMid":[102.5,154.6],"walk0Head":[-148.7,73.7],"mcuMas":[252.3,107.9],"mcuMasHead":[252.3,78.5],"away0":[241.8,152.3],"away0Head":[241.8,75.2],"away1":[-369.8,172.3],"away1Head":[-371.6,71.0]},"away":{"slot":[382.5,121.1],"doorL0":[375.0,168.0],"doorR0":[390.3,178.8],"doormark":[345.4,167.1],"doormarkHead":[345.8,84.6],"walk0":[304.2,129.4],"walkMid":[319.2,145.0],"walk0Head":[304.3,89.5],"mcuMas":[347.5,119.9],"mcuMasHead":[347.7,87.9],"away0":[333.0,163.9],"away0Head":[333.4,85.0],"away1":[269.8,123.8],"away1Head":[269.9,90.2]}};
/** the tools load the plates' own anchors.json (so a re-framed camera carries its marks with it) */
export const setIssAnchors = (a: Record<string, Record<string, [number, number]>>) => { ISS_ANCHORS = {...ISS_ANCHORS, ...a}; };
const A = (shot: string, k: string, dflt: [number, number]): [number, number] => ISS_ANCHORS[shot]?.[k] ?? dflt;

const HOOD = [PAL.N1, PAL.G0, PAL.G2, PAL.G3, PAL.G4, PAL.G5];
/** a layer pixel that darkens the plate under it instead of covering it (the figures' contact shadows on the 3D lot) */
export const ISS_SHADOW = 0x2000000;
/** a dithered contact shadow under a figure's feet, on the layer */
const shadowAt = (b: Buf, x: number, y: number, w: number) => { for (let i = -w; i <= w; i++) for (let j = -2; j <= 1; j++) if (Math.abs(i) / w + Math.abs(j + 0.5) / 2.5 < 1 && bayer(x + i, y + j) < 0.75 && b.get(x + i, y + j) === TRANSPARENT) b.set(x + i, y + j, ISS_SHADOW); };
/** composite one layer pixel over a plate pixel (0xRRGGBB) */
export const issOver = (plate: number, v: number) => v === TRANSPARENT ? plate : v === ISS_SHADOW ? (((plate >> 16) * 0.7) << 16) | ((((plate >> 8) & 255) * 0.7) << 8) | ((plate & 255) * 0.7) : v;
/** Mas from behind, h px tall (12..80), a 4-step walk (step 0..3); lit from the overcast left */
export const drawMasBackSmall = (b: Buf, x: number, footY: number, h: number, step = 0) => {
  if (h >= 72) { drawMasBack(b, x, footY, (['w0', 'w1', 'w2', 'w3'] as const)[step % 4]); return; }
  const u = h / 80, top = footY - h, Y = (v: number) => Math.round(top + v * u), S = (v: number) => Math.max(1, Math.round(v * u));
  const sw = Math.round([0, 1, 0, -1][step % 4] * 3 * u);
  // legs (the jeans, a gap between), the shoes; one leg forward on the walk
  for (const [lx, d, col] of [[x - S(6), 1, PAL.N3], [x + S(1), -1, PAL.N4]] as Array<[number, number, number]>) {
    for (let y = Y(49); y < Y(76); y++) fill(b, lx + d * sw * ((y - Y(49)) / Math.max(1, Y(76) - Y(49))), y, S(5), 1, col);
    fill(b, lx + d * sw, Y(76), S(5), Math.max(1, Y(80) - Y(76)), PAL.G5);
  }
  // the hoodie: rounded shoulders, a gentle taper to the hem band, the hood's lump, arms at the sides swinging
  for (let y = Y(16); y < Y(51); y++) {
    const v = (y - top) / u, sh = v < 22 ? 9 + Math.sqrt(Math.max(0, 1 - ((22 - v) / 6) ** 2)) * 2 - 2 + (v - 16) * 0.25 : 10.5 - (v - 22) * 0.05;
    const hw = Math.max(2, Math.round(sh * u));
    fill(b, x - hw, y, hw * 2, 1, v > 47 ? HOOD[2] : HOOD[3]); b.set(x - hw, y, HOOD[4]); b.set(x + hw - 1, y, HOOD[1]);
  }
  ellipse(x, Y(17), Math.max(1, 5 * u), Math.max(1, 3 * u), b.ink(HOOD[2]));
  for (const [ax, d] of [[x - S(12), 1], [x + S(10), -1]] as Array<[number, number]>) fill(b, ax - d * Math.round(sw * 0.6), Y(21), S(2.5), Y(45) - Y(21), d > 0 ? HOOD[3] : HOOD[2]);
  // the head from behind: the hair (lit edge on the left), a sliver of neck
  const hr = Math.max(1, 6.5 * u);
  ellipse(x, Y(9), hr, hr * 1.12, b.ink(PAL.B1));
  if (h > 24) { b.set(x - Math.round(hr) + 1, Y(7), PAL.B3); b.set(x - Math.round(hr) + 1, Y(8), PAL.B3); fill(b, x - S(2), Y(15), S(4), 1, PAL.S2); }
};

// ------------------------------------------------------------------ the lit room behind the slot (22.05)
export const issRoom = (b: Buf, f: number, st: {drop?: number} = {}) => {
  // a warm room, plain: the far wall in lamp light falling off to the right, the floor, one desk, Alyi at work at it
  const WALL = [PAL.W2, PAL.W3, PAL.W4, PAL.W5, PAL.W6], FLOOR = [PAL.D1, PAL.D2, PAL.D3, PAL.D4];
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const L = clamp(1 - Math.hypot((x - 200) / 330, (y - 90) / 240), 0, 1);
    const ramp = y < 132 ? WALL : FLOOR, k = clamp(Math.floor(L * (ramp.length - 0.01) * 1.25 + bayer(x, y) - 0.5), 0, ramp.length - 1);
    b.set(x, y, ramp[k]);
  }
  fill(b, 0, 131, 480, 2, PAL.D1);
  // a shelf of binders on the far wall (nothing legible), a window-less wall: the room has one job
  fill(b, 300, 60, 120, 3, PAL.D2); for (let k = 0; k < 14; k++) fill(b, 304 + k * 8, 40 + (k % 3), 6, 20 - (k % 3), [PAL.N3, PAL.W3, PAL.G3][k % 3]);
  drawAlyiAtWork(b, 196, 158, f);
  // the flyer falling inside, at the bottom of the gap, out of frame (unseen by him)
  // the flyer falling just inside the door, close to the gap (big, soft), down out of frame: nobody sees it land
  const d = st.drop ?? -1;
  if (d >= 0 && d < 3) {
    const t = new Buf(48, 64, TRANSPARENT); drawFlyer(t, 0, 0, {upside: true, scale: 4});
    const cx = 96 + d * 6, cy = [40, 120, 190][d], a = [-0.35, 0.5, 1.1][d], ca = Math.cos(a), sa = Math.sin(a);
    for (let y = -46; y <= 46; y++) for (let x = -46; x <= 46; x++) { const u = Math.round(ca * x + sa * y + 24), v = Math.round(-sa * x + ca * y + 32); if (u >= 0 && v >= 0 && u < 48 && v < 64) { const c = t.c[v * 48 + u]; if (c !== TRANSPARENT) b.set(cx + x, cy + y, c); } }
  }
};

// ------------------------------------------------------------------ the shoulder and arm at the slot (22.04)
const shoulderOTS = (b: Buf, slot: [number, number], push: number, unfold = 2, lift = 0) => {
  // his near shoulder and the back of his head, very close and soft at frame-left: the hair (its strands, the lit
  // edge toward the overcast left), the near ear, the hood's rolled edge, the hoodie's shoulder
  for (let y = 40; y < RH; y++) for (let x = 0; x < 150; x++) {
    const dh = Math.hypot((x - 30) / 48, (y - 60) / 56), dsh = Math.hypot((x + 20) / 150, (y - 230) / 170);
    if (dh < 1) {
      const soft = dh > 0.94 && bayer(x, y) < 0.5;
      if (soft) continue;
      const strand = ((x * 2 + Math.round(y * 0.6)) % 9) < 1;
      b.set(x, y, dh > 0.86 && x < 30 ? PAL.B3 : strand ? PAL.B2 : y > 92 ? PAL.B0 : PAL.B1);
    } else if (dsh < 1) b.set(x, y, dsh > 0.95 && bayer(x, y) < 0.5 ? TRANSPARENT : dsh > 0.85 ? HOOD[3] : HOOD[2]);
  }
  // the near ear at the head's right edge, the nape in skin, the hood's roll round the neck
  for (let j = 0; j < 16; j++) for (let i = 0; i < 6; i++) if (Math.hypot((i - 2.5) / 3, (j - 8) / 8) < 1) b.set(76 + i, 58 + j, i > 3 ? PAL.S2 : j < 3 ? PAL.S4 : PAL.S3);
  fill(b, 58, 104, 16, 6, PAL.S2); for (let x = 20; x < 110; x++) { const y = 108 + Math.round(Math.abs(x - 64) * 0.12); b.set(x, y, HOOD[4]); b.set(x, y + 1, HOOD[3]); b.set(x, y + 2, HOOD[1]); }
  // the flyer: letter-size, sized to the slot (a page about three quarters of its width), upside down, the tape still
  // on its corners, its lower edge inside the gap (the part already in is hidden behind the flap)
  const [sx, sy] = slot;
  const inside = [8, 22, 36][clamp(push, 0, 2)];
  const FW = 60, FH = 80;
  const t = new Buf(FW, FH, TRANSPARENT); drawFlyer(t, 0, 0, {upside: true, scale: 5});
  const fx0 = sx - 33, fy0 = sy - FH + 4 + inside - lift;
  // the shots pass (22.04 "he unfolds the flyer"): held above the slot it comes out of his pocket folded in half (the
  // blank back of its lower half showing, a fold along its middle), swings half open (the lower half foreshortened,
  // a rung darker, angled away), then hangs open and is lowered to the slot
  const H2 = FH / 2;
  const src = (j: number): [number, number] | null => unfold >= 2 ? [j, 0] : unfold === 1 ? (j < H2 ? [j, 0] : j < H2 + H2 / 2 ? [H2 + (j - H2) * 2, -1] : null) : (j < H2 ? [j, 9] : null);
  for (let j = 0; j < FH; j++) { const m = src(j); if (!m) continue; for (let i = 0; i < FW; i++) {
    let v = t.c[m[0] * FW + i]; if (v === TRANSPARENT) continue;
    if (m[1] === 9) v = j === H2 - 1 ? PAL.P0 : i === 0 || i === FW - 1 ? PAL.P1 : (i + j) % 11 === 0 ? PAL.P1 : PAL.P2; else if (m[1] === -1) v = stepColor(v, -1);
    const X = fx0 + i, Y = fy0 + j - Math.round(i * 0.18); if (Y < sy - 2 - Math.round((X - sx + 33) * 0.18)) b.set(X, Y, v); } }
  // his arm from the shoulder to the elbow to the cuff, a real hand pinching the flyer's top edge (the thumb on the
  // page's face, the index behind it), Ep1's insert-hands grammar, the overcast light
  const pinchAt: [number, number] = [fx0 + 10, fy0 + 3 - 2];
  const h = placeHand(POSES.pinch([0.5, -0.55, -0.65], [-0.25, -0.7, 0.66], 'R'), {s: 3.2, at: pinchAt, anchor: 'thumb', light: 'lobby', cuffRamp: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G3, PAL.G5]});
  const elbow: [number, number] = [h.cuffEnd[0] - 34, h.cuffEnd[1] + 40];
  sleeve(b, [104, 204], elbow, 14, 12, [PAL.N0, HOOD[1], HOOD[2], HOOD[3], HOOD[4]]);
  sleeve(b, elbow, h.cuffEnd, 11, 9, [PAL.N0, HOOD[1], HOOD[2], HOOD[3], HOOD[4]]);
  drawHand(b, h.hand, h.x, h.y);
};

/** the shots pass (22.08): Mas from behind at the door, his right arm (frame-right) raised to knock: raise 0 at his side
 *  (the art's back drawing), 0.5 coming up (the elbow out, the forearm slanting), 1 up (the forearm upright, the fist's
 *  back beside his head, just off the door). Geometry measured off drawMasBack('stand'): the arm is the five columns
 *  footX+8..+12 over rows footY-60..-39, the torso's side footX+8..+9 below it */
const KN = {arm: PAL.G2, armD: PAL.G1, armL: PAL.G3, line: PAL.N0, skin: PAL.S3, skinD: PAL.S2};
export const drawMasBackKnock = (b: Buf, fx: number, fy: number, raise: number) => {
  drawMasBack(b, fx, fy, 'stand');
  if (raise <= 0) return;
  // the hanging arm off: its outer columns cleared, the torso's side drawn where it was
  for (let y = fy - 60; y <= fy - 37; y++) {
    for (let x = fx + 10; x <= fx + 13; x++) b.set(x, y, TRANSPARENT);
    if (y > fy - 58) { b.set(fx + 8, y, b.get(fx + 6, y)); b.set(fx + 9, y, b.get(fx + 9, fy - 36)); }
  }
  const sh: [number, number] = [fx + 8, fy - 57];
  const el: [number, number] = raise >= 1 ? [fx + 14, fy - 49] : [fx + 14, fy - 45];
  const fi: [number, number] = raise >= 1 ? [fx + 15, fy - 68] : [fx + 19, fy - 56];
  const seg = (a: [number, number], c: [number, number], w: number) => {
    const n = Math.max(Math.abs(c[0] - a[0]), Math.abs(c[1] - a[1]));
    for (let i = 0; i <= n; i++) { const x = Math.round(a[0] + (c[0] - a[0]) * i / n), y = Math.round(a[1] + (c[1] - a[1]) * i / n); for (let j = -w; j <= w; j++) for (let k = -w; k <= w; k++) if (j * j + k * k <= w * w + 1) b.set(x + j, y + k, k < 0 && j < 0 ? KN.armL : j > 0 ? KN.armD : KN.arm); }
  };
  // the outline first (one pixel bigger), then the sleeve: the upper arm, the forearm (a little narrower)
  const out = (a: [number, number], c: [number, number], w: number) => { const n = Math.max(Math.abs(c[0] - a[0]), Math.abs(c[1] - a[1])); for (let i = 0; i <= n; i++) { const x = Math.round(a[0] + (c[0] - a[0]) * i / n), y = Math.round(a[1] + (c[1] - a[1]) * i / n); for (let j = -w - 1; j <= w + 1; j++) for (let k = -w - 1; k <= w + 1; k++) if (j * j + k * k <= (w + 1) * (w + 1) + 1 && b.get(x + j, y + k) === TRANSPARENT) b.set(x + j, y + k, KN.line); } };
  out(sh, el, 2); out(el, fi, 2);
  seg(sh, el, 2); seg(el, [fi[0], fi[1] + 3], 2);
  // the cuff, then the fist's back: four knuckles on top, the thumb's edge toward his head
  fill(b, fi[0] - 2, fi[1] + 2, 5, 1, KN.line);
  for (let j = -3; j <= 1; j++) for (let i = -2; i <= 2; i++) if (!(Math.abs(i) === 2 && (j === -3 || j === 1))) b.set(fi[0] + i, fi[1] + j, j === -3 ? KN.skinD : i === 2 ? KN.skinD : KN.skin);
  for (let i = -2; i <= 2; i += 2) b.set(fi[0] + i, fi[1] - 2, KN.skinD);
  b.set(fi[0] - 3, fi[1] - 1, KN.skinD);
};

export interface IssSt { t?: number; scan?: boolean; push?: number; lit?: boolean; raise?: number; drop?: number; unfold?: number; lift?: number }
export const issLayer = (b: Buf, shot: 'wide' | 'ots' | 'mcu' | 'knock' | 'away', f: number, st: IssSt = {}) => {
  const step = Math.floor(f / 3) % 4;
  if (shot === 'wide') {
    const [x0, y0] = A('wide', 'walk0', [20, 170]), [x1, y1] = A('wide', 'doormark', [330, 168]);
    const t = clamp(st.t ?? 0.6, 0, 1), x = Math.round(x0 + (x1 - x0) * t), y = Math.round(y0 + (y1 - y0) * t);
    shadowAt(b, x, y, 14);
    // walking in he is side-on; arrived at the door he faces it (his back to us)
    if (t >= 1) drawMasBack(b, x, y, 'stand');
    else drawMasStand2(b, x, y, {arm: 'down', legs: (['w0', 'w1', 'w2', 'w3'] as const)[step]});
    // THE ORB at his shoulder, looking at the cube, its lens firing; it toasts nothing (it can't verify a door)
    const ox = x + 24, oy = y - 86;
    if (st.scan) for (let k = 0; k < 40; k++) { const px = ox + 8 + k * 2, py = oy + Math.round(k * 0.3); if (bayer(px, py) < 0.5) b.set(px, py, PAL.C7); }
    drawOrb(b, ox, oy, 7, {look: [0.8, 0.1], aperture: st.scan ? 1 : 0.5, scanning: !!st.scan, monitor: 1});
  } else if (shot === 'ots') {
    shoulderOTS(b, A('ots', 'slot', [250, 110]), st.push ?? 1, st.unfold ?? 2, st.lift ?? 0);
  } else if (shot === 'mcu') {
    const [hx, hy] = A('mcu', 'mcuMasHead', [150, 30]);
    // the shots pass: the warm rig's top rungs (its tungsten rim, W6 on the hood, W5 in the hair) read as a lamp the
    // lot doesn't have: under the overcast they're the cool sky's edge; then the face light one step
    const sky = (c: number) => c === PAL.W6 ? PAL.G5 : c === PAL.W5 ? PAL.B4 : c;
    const map = st.lit ? (c: number) => { c = sky(c); return (c >> 16) > ((c >> 8) & 255) + 10 && c !== PAL.B4 ? stepColor(c, 1) : c; } : sky;
    const x0 = Math.round(hx) - Math.round(MAS_MW / 2), y0 = Math.round(hy) - 6;
    // facing the flap (it is to his right, low on the door): the 3/4 head turned to it, his eyes on it
    // (the medium rig's 3/4 head faces camera-left; flipped, it turns to the flap on the door at frame right)
    drawMasMedium(b, x0, y0, {...MAS_MEDIUM_DEFAULT, head: '34', arm: 'down', light: 'warm', look: 0}, {map, flip: true});
    // the medium drawing stops at the desk line: carry his hoodie on down out of frame (each column's last row)
    // (each column's lowest drawn row, carried down; the two columns at each side become the outline, so the key
    // light's rims don't run down as stripes)
    // the shots pass: cut above the rig's pocket seam and lap (drawn for a desk that isn't here: carried down they
    // crossed the drawstrings into a '+'), and carry the hoodie down plain: each column the dominant shade of a 7-px
    // window on the cut row (so a one-pixel line, a drawstring, ends at the cut instead of running down as a stripe)
    const ybot = y0 + MAS_M_DESK - 7;
    let xmin = x0 + MAS_MW, xmax = x0 - 1; for (let x = x0; x < x0 + MAS_MW; x++) if (b.get(x, ybot) !== TRANSPARENT) { xmin = Math.min(xmin, x); xmax = Math.max(xmax, x); }
    const row = [...Array(xmax - xmin + 1).keys()].map((i) => b.get(xmin + i, ybot));
    const dom = (i: number) => { const n = new Map<number, number>(); for (let j = Math.max(0, i - 3); j <= Math.min(row.length - 1, i + 3); j++) if (row[j] !== TRANSPARENT) n.set(row[j], (n.get(row[j]) ?? 0) + 1); return [...n.entries()].sort((a, c) => c[1] - a[1])[0]?.[0] ?? HOOD[2]; };
    for (let x = xmin; x <= xmax; x++) { const c = x <= xmin + 1 || x >= xmax - 1 ? HOOD[0] : dom(x - xmin); for (let y = ybot + 1; y < RH; y++) b.set(x, y, c); }
  } else if (shot === 'knock') {
    const [x, y] = A('knock', 'doormark', [250, 190]);
    shadowAt(b, Math.round(x), Math.round(y), 13);
    // the shots pass: he faces the door (his back to us, as he stood at it in 22.02-22.03): side-on, the art's knock
    // raised a fist into the air beside the door. From behind, the near arm comes up: the upper arm out from the
    // shoulder, the elbow bent, the forearm up, the fist's back at his head's height just off the door; held; lowered
    drawMasBackKnock(b, Math.round(x), Math.round(y), st.raise ?? 0);
  } else {
    const [x0, y0] = A('away', 'away0', [300, 190]), [x1, y1] = A('away', 'away1', [120, 120]);
    const [, h0] = A('away', 'away0Head', [300, 110]), [, h1] = A('away', 'away1Head', [120, 100]);
    const t = clamp(st.t ?? 0, 0, 1), x = Math.round(x0 + (x1 - x0) * t), y = Math.round(y0 + (y1 - y0) * t);
    const h = Math.round((y0 - h0) + ((y1 - h1) - (y0 - h0)) * t);
    shadowAt(b, x, y, Math.max(3, Math.round(h * 0.17)));
    drawMasBackSmall(b, x, y, Math.max(10, h), step);
  }
};

// ------------------------------------------------------------------ preview (the contact sheet): a layer over its plate
type Plate = (shot: string) => Uint32Array | null;
let plateSource: Plate = () => null;
/** the stills tool hands in a plate reader (Node-only), so this module stays browser-safe */
export const setIssPlates = (p: Plate) => { plateSource = p; };
const KEYED = (c: number) => { const r = c >> 16, g = (c >> 8) & 255, bl = c & 255; return g > r + 50 && g > bl + 50; };
/** the 3D plate (box-averaged to 480 x 203 for the preview) or, without one, a flat stand-in of the cube on the lot */
const plateOr = (b: Buf, shot: string) => {
  const p = plateSource(shot);
  if (p) { for (let i = 0; i < 480 * RH; i++) b.c[i] = p[i]; return; }
  vramp(b, 0, 0, 480, 100, [PAL.G5, PAL.G6]); vramp(b, 0, 100, 480, RH - 100, [PAL.D3, PAL.D2]);
  fill(b, 290, 40, 130, 124, PAL.P2); fill(b, 336, 70, 40, 94, PAL.P1); fill(b, 348, 118, 14, 3, PAL.W5); fill(b, 312, 96, 14, 5, PAL.W5);
};
export const issPreview = (b: Buf, shot: 'wide' | 'ots' | 'insert' | 'ecu' | 'mcu' | 'knock' | 'away', f: number, st: IssSt = {}) => {
  plateOr(b, shot);
  if (shot === 'insert') { const r = new Buf(480, 270, PAL.N0); issRoom(r, f, st); for (let i = 0; i < 480 * RH; i++) if (KEYED(b.c[i]) || !plateSource(shot)) b.c[i] = r.c[i]; return; }
  if (shot === 'ecu') return;
  const l = new Buf(480, 270, TRANSPARENT); issLayer(l, shot, f, st);
  for (let i = 0; i < 480 * RH; i++) b.c[i] = issOver(b.c[i], l.c[i]);
};

void rect; void line; void hash; void dith; void MAS_MH; void MAS2_FOOT; void familyOf; void capsule;
