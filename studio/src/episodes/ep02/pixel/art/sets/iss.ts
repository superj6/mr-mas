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
import {drawMasMedium, MAS_MEDIUM_DEFAULT, MAS_MW, MAS_MH} from '../../../../../shared/pixel/cast/mas-medium';
import {fill, vramp, RH, dith, capsule, grip, HANDSKIN, armTo} from '../kit';
import {drawMasStand2, drawMasBack, MAS2_FOOT} from '../cast/mas2';
import {drawAlyiAtWork} from '../cast/alyi2';
import {drawFlyer} from './lobby2';
import {placeHand, drawHand, sleeve, POSES} from '../cast/hands2';
import type {ArtAsset} from '../asset';

/** from iss_scene.py's anchors.json (render of 2026-10-09): [x, y] in native pixels of the 480 x 203 room area */
export let ISS_ANCHORS: Record<string, Record<string, [number, number]>> = {};
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
const shoulderOTS = (b: Buf, slot: [number, number], push: number) => {
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
  const fx0 = sx - 33, fy0 = sy - FH + 4 + inside;
  for (let j = 0; j < FH; j++) for (let i = 0; i < FW; i++) { const v = t.c[j * FW + i], X = fx0 + i, Y = fy0 + j - Math.round(i * 0.18); if (v !== TRANSPARENT && Y < sy - 2 - Math.round((X - sx + 33) * 0.18)) b.set(X, Y, v); }
  // his arm from the shoulder to the elbow to the cuff, a real hand pinching the flyer's top edge (the thumb on the
  // page's face, the index behind it), Ep1's insert-hands grammar, the overcast light
  const pinchAt: [number, number] = [fx0 + 10, fy0 + 3 - 2];
  const h = placeHand(POSES.pinch([0.5, -0.55, -0.65], [-0.25, -0.7, 0.66], 'R'), {s: 3.2, at: pinchAt, anchor: 'thumb', light: 'lobby', cuffRamp: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G3, PAL.G5]});
  const elbow: [number, number] = [h.cuffEnd[0] - 34, h.cuffEnd[1] + 40];
  sleeve(b, [104, 204], elbow, 14, 12, [PAL.N0, HOOD[1], HOOD[2], HOOD[3], HOOD[4]]);
  sleeve(b, elbow, h.cuffEnd, 11, 9, [PAL.N0, HOOD[1], HOOD[2], HOOD[3], HOOD[4]]);
  drawHand(b, h.hand, h.x, h.y);
};

export interface IssSt { t?: number; scan?: boolean; push?: number; lit?: boolean; raise?: number; drop?: number }
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
    shoulderOTS(b, A('ots', 'slot', [250, 110]), st.push ?? 1);
  } else if (shot === 'mcu') {
    const [hx, hy] = A('mcu', 'mcuMasHead', [150, 30]);
    const map = st.lit ? (c: number) => (c >> 16) > ((c >> 8) & 255) + 10 ? stepColor(c, 1) : c : undefined;
    const x0 = Math.round(hx) - Math.round(MAS_MW / 2), y0 = Math.round(hy) - 6;
    // facing the flap (it is to his right, low on the door): the 3/4 head turned to it, his eyes on it
    // (the medium rig's 3/4 head faces camera-left; flipped, it turns to the flap on the door at frame right)
    drawMasMedium(b, x0, y0, {...MAS_MEDIUM_DEFAULT, head: '34', arm: 'down', light: 'warm', look: 0}, {map, flip: true});
    // the medium drawing stops at the desk line: carry his hoodie on down out of frame (each column's last row)
    // (each column's lowest drawn row, carried down; the two columns at each side become the outline, so the key
    // light's rims don't run down as stripes)
    let ybot = y0 + MAS_MH - 1; while (ybot > y0 && ![...Array(MAS_MW).keys()].some((i) => b.get(x0 + i, ybot) !== TRANSPARENT)) ybot--;
    let xmin = x0 + MAS_MW, xmax = x0 - 1; for (let x = x0; x < x0 + MAS_MW; x++) if (b.get(x, ybot) !== TRANSPARENT) { xmin = Math.min(xmin, x); xmax = Math.max(xmax, x); }
    for (let x = xmin; x <= xmax; x++) { const c = x <= xmin + 1 || x >= xmax - 1 ? HOOD[0] : b.get(x, ybot - 2) === TRANSPARENT ? HOOD[2] : b.get(x, ybot - 2); for (let y = ybot + 1; y < RH; y++) b.set(x, y, c); }
  } else if (shot === 'knock') {
    const [x, y] = A('knock', 'doormark', [250, 190]);
    shadowAt(b, Math.round(x), Math.round(y), 13);
    drawMasStand2(b, Math.round(x), Math.round(y), {arm: (st.raise ?? 1) ? 'knock' : 'down'});
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

export const ART: ArtAsset[] = [{
  id: 'set23-iss', manifest: 'SET-23 · ISS: the white cube on an empty lot (2.H real 3D) · §3 the plate, the slot\'s sprung flap, the flyer', kind: 'set', name: 'ISS: the white cube (Blender EEVEE plates) with the pixel Mas, flyer and Alyi on top',
  file: 'iss/iss_scene.py (3D plates) + sets/iss.ts (pixel layers) + tools/iss-comp.ts (the composites)', exports: 'issLayer, issRoom, issPreview, drawMasBackSmall, ISS_ANCHORS', scenes: '22',
  note: 'sealed by design: no handle, no lock, no keyhole, no mat, no sign; the flap shuts on its spring, no return; Mas, Alyi and the flyer stay pixel, composited keeping the contrast; previews here are box-averaged, the composites are whole',
  stills: [
    {label: '[W] 22.02: the lot, the cube; Mas walks up from frame-left, THE ORB scanning the cube (it toasts nothing)', draw: (b) => issPreview(b, 'wide', 3, {t: 0.55, scan: true})},
    {label: '[MCU] 22.04 over his shoulder at the slot: the flyer, upside down, tape on its corners, lifts the flap', draw: (b) => issPreview(b, 'ots', 0, {push: 1})},
    {label: '[INSERT] 22.05 the gap fills the frame: a lit room, Alyi at a desk, working, absorbed, cropped by the slot\'s edges; the flyer drops, unseen', draw: (b) => issPreview(b, 'insert', 0, {drop: 1})},
    {label: '[ECU] 22.06 the flap swung shut on its spring (no return)', draw: (b) => issPreview(b, 'ecu', 0)},
    {label: '[MCU] 22.07 Mas at the shut flap, the face light one step', draw: (b) => issPreview(b, 'mcu', 0, {lit: true})},
    {label: '[M] 22.08 the door and his raised hand (held two beats), then lowered', draw: (b) => issPreview(b, 'knock', 0, {raise: 1})},
    {label: '[W] 22.09 he walks away the way he came: his back, small, crossing the lot; the cube doesn\'t change', draw: (b) => issPreview(b, 'away', 0, {t: 0.45})},
  ],
}];
void rect; void line; void hash; void dith; void MAS_MH; void MAS2_FOOT; void familyOf; void capsule;
