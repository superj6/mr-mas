// MR. MAS · prototype 4 · 4c · P3 BROADCAST · the Security Council webcast (9.E, Ep9 #30). Reel frames p360-539.
//   p360-389 the council chamber in pixel, [MS] (a NEW plate: the horseshoe's far arc, desk mics, nameplates, a plain
//            dark back wall, no mural). A delegate two seats down is speaking into a live mic; Mas listens, then his
//            eyes go right, past her, to the empty chair labelled INVITED. On the back wall the chamber's own
//            monitor is showing the webcast: the device is in the room before the cut
//   p390     IN: cut to what that monitor shows, on the beat
//   p390-479 the webcast wide, locked off from the gallery: the whole horseshoe in perspective, flat institutional
//            light, broadcast-safe colour, a lens that barrels the room a little, a low-bitrate stream's blocking in
//            the wall's gradient, a generic lower third, a small WEBCAST bug and a timecode. Everyone is small and
//            everyone is in a suit except the one grey hoodie; the INVITED card reads from across the room
//   p480-539 OUT: close on Mas in pixel [MCU] (the approved close-up drawing) with the chamber soft behind him and the
//            INVITED card by his head. The speaker's voice goes on; on a beat his pupils move one pixel toward the
//            empty chair, and on the next phrase they come back (the one live motion; he doesn't blink). Land on his face
import {Buf, rect, bayer, hash, clamp} from '../../../../shared/pixel/px';
import {PAL, stepColor, familyOf} from '../../../../shared/pixel/palette';
import {text, textWidth} from '../../../../shared/pixel/font';
import {blitImg, Img, LightRig, P, Part, renderFigure, FigureDef, Stamp} from '../../../../shared/pixel/figure';
import {memo, seg, cloneImg} from '../../../../shared/pixel/cast/kit';
import {drawMasMedium, MAS_MEDIUM_DEFAULT} from '../../../../shared/pixel/cast/mas-medium';
import {masCU, eyeMap} from '../../../../shared/pixel/cast/mas-cu';
import {blitTo} from '../../../../shared/pixel/cast/kit';
import {tiny, tinyWidth} from '../../../../shared/pixel/rooms/kit-b';
import {broadcastSafe, miniature, softChroma} from '../passes/device';
import {stepDefocus} from '../passes/defocus';
import {osdText, osdWidth} from '../passes/osdfont';
import {plate, revealStep, revealed, timecode, tag} from '../passes/osd';
import {WIDE, View} from '../passes/present';

export const C0 = 360, C_IN = 390, C_OUT = 480, C1 = 540;
export const C_GLANCE_MS = 375, C_GLANCE_CU = 495, C_GLANCE_BACK = 525;

// ================================================================== a generic council delegate (medium scale)
// Nobody in particular. Four people, four silhouettes: short dark hair, grey and receding, a woman with her hair up,
// bald with glasses. Suits, a pale collar, a tie or a scarf. The chamber's downlights key them from above, so their
// brows, noses and mouths read in two or three rungs and Mas stays the brightest face. 70 x 96, the table's far edge at
// local row 84 (as MAS_M_DESK). A speaker's mouth opens and her head dips a pixel on the accents.
const DEL_W = 70, DEL_H = 96;
type DelV = 0 | 1 | 2 | 3;
const DSKIN: Record<DelV, number[]> = {
  0: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
  1: [PAL.S0, PAL.S1, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  2: [PAL.S0, PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4],
  3: [PAL.S0, PAL.S1, PAL.S2, PAL.S4, PAL.S5, PAL.S6],
};
const DHAIR: Record<DelV, number[]> = {
  0: [PAL.N0, PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.B3],
  1: [PAL.N0, PAL.G1, PAL.G3, PAL.G4, PAL.G5, PAL.G6],
  2: [PAL.N0, PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B3],
  3: [PAL.N0, PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4],
};
const delegateFig = (v: DelV, speak: {mouth: 0 | 1 | 2; dip: 0 | 1}): FigureDef => {
  const cx = 35, dy = speak.dip;
  const woman = v === 2;
  const H = (pr: ReturnType<typeof P.poly>) => pr;
  const parts: Part[] = [
    // the suit: shoulders sloping from a short neck, lapels, the chest into the table
    {group: 'torso', mat: 'suit', prims: [P.poly(cx - 33, 96, cx - 32, 62, cx - 25, 51, cx - 9, 46, cx + 9, 46, cx + 25, 51, cx + 32, 62, cx + 33, 96)]},
    {group: 'shirt', mat: 'shirt', prims: [woman ? P.poly(cx - 8, 45, cx + 8, 45, cx + 4, 55, cx - 4, 55) : P.poly(cx - 7, 45, cx + 7, 45, cx + 2, 60, cx - 2, 60)]},
    ...(woman ? [{group: 'tie', mat: 'scarf', prims: [P.poly(cx - 9, 45, cx - 3, 44, cx + 2, 54, cx - 1, 58, cx - 6, 50)]}] as Part[] : v === 3 ? [] : [{group: 'tie', mat: 'tie', prims: [P.poly(cx - 2, 47, cx + 2, 47, cx + 3, 64, cx, 67, cx - 3, 64)]}] as Part[]),
    {group: 'neck', mat: 'skin', prims: [P.poly(cx - 6, 36 + dy, cx + 5, 36 + dy, cx + 6, 47, cx - 7, 47)]},
    // the head: a skull ellipse and a jaw, 3/4 toward camera-left (the president's seat), the ear on the far side
    {group: 'head', mat: 'skin', prims: [H(P.ell(cx - 1, 24 + dy, 10, 12)), P.poly(cx - 10, 26 + dy, cx - 8, 34 + dy, cx - 3, 39 + dy, cx + 3, 39 + dy, cx + 8, 33 + dy, cx + 9, 26 + dy), P.ell(cx + 9, 27 + dy, 2.4, 3.8)]},
  ];
  const hair: ReturnType<typeof P.poly>[] = v === 0
    ? [P.poly(cx - 11, 25 + dy, cx - 11, 16 + dy, cx - 5, 11 + dy, cx + 4, 11 + dy, cx + 10, 15 + dy, cx + 11, 27 + dy, cx + 8, 20 + dy, cx - 3, 18 + dy, cx - 9, 21 + dy)]
    : v === 1
      ? [P.poly(cx + 3, 13 + dy, cx + 9, 15 + dy, cx + 11, 22 + dy, cx + 11, 30 + dy, cx + 8, 24 + dy, cx + 5, 18 + dy), P.poly(cx - 11, 27 + dy, cx - 11, 21 + dy, cx - 9, 19 + dy, cx - 9, 27 + dy)]
      : v === 2
        ? [P.poly(cx - 11, 27 + dy, cx - 11, 15 + dy, cx - 4, 10 + dy, cx + 5, 10 + dy, cx + 11, 15 + dy, cx + 12, 30 + dy, cx + 9, 34 + dy, cx + 8, 21 + dy, cx - 2, 17 + dy, cx - 9, 22 + dy), P.ell(cx + 10, 13 + dy, 5, 5)]
        : [];
  if (hair.length) parts.push({group: 'hair', mat: 'hair', prims: hair});
  // the face, hand-placed: brows, eyes (lash line over a dark iris with the lit sclera), the nose's shadow side and
  // nostril, the mouth (rest / open / wide), the smile line. Glasses for v3 (their rims catch the downlight)
  const mouthRows = speak.mouth === 0 ? ['.mmmm.', '..ll..'] : speak.mouth === 1 ? ['.mmmm.', '.mOOm.', '..ll..'] : ['mmmmmm', 'mOOOOm', '.mmmm.'];
  const rows = [
    v === 1 ? '.bbb....bb.' : '.bbbb..bbb.',
    '...........',
    '.eee...ee..',
    '.wIw...wI..',
    '...........',
    '.....n.....',
    '.....n.....',
    '....nn.....',
    '...........',
    ...mouthRows.map((r) => '..' + r + '...'),
  ];
  const face: Stamp = {x: cx - 10, y: 19 + dy, rows, pal: {b: ['hair', 1], e: ['skin', 0], w: ['skin', 4], I: PAL.N0, n: ['skin', 1], m: ['skin', 1], O: PAL.N0, l: ['skin', 4]}};
  const stamps: Stamp[] = [face];
  if (v === 3) stamps.push({x: cx - 11, y: 20 + dy, rows: ['.gggg..ggg.', 'g....gg...g', '.gggg..ggg.'], pal: {g: PAL.G5}});
  return {w: DEL_W, h: DEL_H, parts, stamps, adjust: [
    {prims: [P.line(cx - 24, 51, cx - 10, 66), P.line(cx + 24, 51, cx + 10, 66)], tone: 3, onlyMat: 'suit'},
    // the downlight on the brow ridge and the cheekbone; the eye sockets a rung down
    {prims: [P.rect(cx - 10, 17 + dy, 16, 2)], add: 1, onlyMat: 'skin'},
    {prims: [P.rect(cx - 10, 21 + dy, 5, 3), P.rect(cx - 3, 21 + dy, 4, 3)], add: -1, onlyMat: 'skin'},
  ]};
};
const DRIG = (v: DelV): LightRig => ({
  key: [-0.35, -1], keyBand: 3, shadowBand: 4, rim: true, outline: true,
  back: [1, -0.3], backBand: 1, backRamp: {suit: PAL.G1, skin: DSKIN[v][3], hair: DHAIR[v][3], shirt: PAL.G4, scarf: PAL.R2},
  ramps: {
    suit: v === 2 ? [PAL.N0, PAL.N0, PAL.U0, PAL.U1, PAL.U2, PAL.U3] : v === 1 ? [PAL.N0, PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3] : [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4],
    shirt: [PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.G6],
    skin: DSKIN[v], hair: DHAIR[v],
    tie: [PAL.N0, PAL.F1, PAL.F2, PAL.F3, PAL.F4, PAL.F5],
    scarf: [PAL.N0, PAL.R0, PAL.R1, PAL.R1, PAL.R2, PAL.R3],
  },
  groupBands: {head: {key: 4, shadow: 3}, torso: {key: 1, shadow: 8}, hair: {key: 2, shadow: 2}},
  keyGain: (_x, y) => (y < 44 ? 1 : Math.max(0.1, 1 - (y - 44) / 26)),
});
const delCache = new Map<string, Img>();
export const delegateImg = (v: DelV, speak: {mouth: 0 | 1 | 2; dip: 0 | 1} = {mouth: 0, dip: 0}): Img => {
  const k = `${v}|${speak.mouth}|${speak.dip}`;
  let img = delCache.get(k);
  if (!img) { img = renderFigure(delegateFig(v, speak), DRIG(v)); delCache.set(k, img); }
  return img;
};

// ================================================================== the chamber [MS] plate
const TABLE_Y = 132; // the far edge of the horseshoe's table under the seats (MAS_M_DESK lines up here)
const edgeY = (x: number) => TABLE_Y + Math.round(10 * Math.pow((x - 200) / 280, 2));
/** seats along the far arc in the [MS]: x centres. Mas at 1, the speaker at 2, the INVITED chair at 3 */
const SEATS = [-20, 120, 232, 344, 458];
const MAS_SEAT = 1, SPEAK_SEAT = 2, INVITED_SEAT = 3;
const SEAT_V: DelV[] = [0, 0, 2, 0, 3];
/** the speaker's line (reel frames): mouth shapes on 3s through phrases, with the pauses between */
const speakAt = (f: number): {mouth: 0 | 1 | 2; dip: 0 | 1} => {
  const phrase = (f >= 360 && f < 381) || (f >= 384 && f < 400) || (f >= 404 && f < 540);
  if (!phrase) return {mouth: 0, dip: 0};
  const k = Math.floor(f / 3);
  const m = [1, 2, 1, 0, 2, 1, 1, 0, 2][k % 9] as 0 | 1 | 2;
  return {mouth: m, dip: (k % 9 === 1 || k % 9 === 4) ? 1 : 0};
};

const drawChair = (b: Buf, cx: number, top: number, bot: number, lit = 0) => {
  // a high-backed council chair seen from the front, above the table: rounded top, a seam, a lit top edge
  const hw = 24;
  for (let y = top; y < bot; y++) for (let x = cx - hw; x <= cx + hw; x++) {
    const r = y - top;
    const inset = r < 4 ? [6, 3, 2, 1][r] : 0;
    if (x < cx - hw + inset || x > cx + hw - inset) continue;
    const side = x < cx - hw + 4 || x > cx + hw - 4;
    let c = side ? PAL.N1 : PAL.N2;
    if (r === 0 || (r === 1 && Math.abs(x - cx) < hw - 4)) c = lit ? PAL.G3 : PAL.G1;
    if (Math.abs(x - cx) === 12 && r > 6) c = PAL.N1;
    b.set(x, y, c);
  }
};
const drawMic = (b: Buf, x: number, baseY: number, live = false) => {
  // a gooseneck desk mic: the base on the table, the neck curving up and toward the seat, a black head
  rect(x - 4, baseY - 2, 9, 3, b.ink(PAL.N0)); rect(x - 4, baseY - 2, 9, 1, b.ink(PAL.G3));
  const pts: Array<[number, number]> = [];
  for (let t = 0; t <= 1; t += 0.05) pts.push([Math.round(x + 10 * t * t), Math.round(baseY - 2 - 22 * t)]);
  for (const [px, py] of pts) { b.set(px, py, PAL.G2); b.set(px + 1, py, PAL.N0); }
  const [hx, hy] = pts[pts.length - 1];
  rect(hx - 1, hy - 3, 5, 4, b.ink(PAL.N0));
  rect(hx - 1, hy - 3, 5, 1, b.ink(live ? PAL.R3 : PAL.G2));
  if (live) { b.set(hx - 2, hy - 3, PAL.R1); b.set(hx + 4, hy - 3, PAL.R1); rect(x - 2, baseY - 2, 2, 1, b.ink(PAL.R3)); }
};
const drawNameplate = (b: Buf, cx: number, y: number, label: string | null) => {
  const w = label ? Math.max(30, textWidth(label) + 8) : 30;
  const x = cx - Math.round(w / 2);
  rect(x + 1, y + 11, w, 1, b.ink(PAL.N0));
  rect(x, y, w, 11, b.ink(PAL.P2)); rect(x, y + 10, w, 1, b.ink(PAL.P0));
  if (label) text(b, label, x + Math.round((w - textWidth(label)) / 2), y + 2, PAL.N1);
  else for (let k = 0; k < 4; k++) rect(x + 6 + k * 5, y + 5, 4, 1, b.ink(PAL.P0)); // a member's plate, too far to read
};
/** the chamber's own monitor on the back wall (it shows the webcast): bezel, the picture area-averaged in, its glow */
const MON = {x: 392, y: 12, w: 70, h: 30};
const drawChamberWall = (b: Buf, rows: number) => {
  for (let y = 0; y < rows; y++) for (let x = 0; x < 480; x++) {
    // plain dark panels; the ceiling downlights wash the top in a soft stepped band; panel seams every 60 px
    const wash = y < 30 ? (bayer(x, y) < (30 - y) / 40 ? 1 : 0) : 0;
    let c = y < 6 ? PAL.N1 : PAL.N2;
    if (wash) c = PAL.N3;
    if (x % 60 === 0) c = PAL.N1;
    if (y === 6) c = PAL.N0;
    b.set(x, y, c);
  }
  // a pale horizontal rail at chair-back height (the chamber's only line)
  rect(0, 92, 480, 1, b.ink(PAL.N3));
  rect(0, 93, 480, 1, b.ink(PAL.N1));
};
const drawMonitor = (b: Buf, f: number) => {
  const M = MON;
  for (let y = M.y - 8; y < M.y + M.h + 10; y++) for (let x = M.x - 12; x < M.x + M.w + 12; x++) {
    if (x >= M.x - 2 && x < M.x + M.w + 2 && y >= M.y - 2 && y < M.y + M.h + 2) continue;
    const dx = x < M.x ? M.x - x : x >= M.x + M.w ? x - M.x - M.w : 0, dy = y < M.y ? M.y - y : y >= M.y + M.h ? y - M.y - M.h : 0;
    const d = Math.hypot(dx / 12, dy / 9);
    if (d < 1 && bayer(x, y) < (1 - d) * 0.7) b.set(x, y, stepColor(b.get(x, y), 1));
  }
  rect(M.x - 2, M.y - 2, M.w + 4, M.h + 4, b.ink(PAL.N0));
  rect(M.x - 1, M.y - 2, M.w + 2, 1, b.ink(PAL.G1));
  const pic = new Buf(480, 203, PAL.N0);
  drawWebcastFrame(pic, f, false);
  miniature(pic, 0, 0, 480, 203, b, M.x, M.y, M.w, M.h);
  rect(M.x + 30, M.y + M.h + 2, 10, 3, b.ink(PAL.N0)); // the wall arm
};
/** the horseshoe's far arc in front of the seats: its top, its front fascia */
const drawChamberTable = (b: Buf) => {
  for (let x = 0; x < 480; x++) {
    const ty = edgeY(x);
    for (let y = ty; y < 203; y++) {
      const r = y - ty;
      let c: number;
      if (r === 0) c = PAL.W4; // the lit edge
      else if (r < 16) c = r < 5 ? PAL.D4 : bayer(x, y) < 0.35 ? PAL.D3 : PAL.D4; // the top, the downlight on it
      else if (r === 16) c = PAL.W3; // the front lip
      else c = r < 22 ? PAL.D2 : r < 50 ? PAL.D1 : PAL.D0; // the fascia falling into the room's dark
      if (r > 16 && x % 40 === 0) c = PAL.D0; // fascia panels
      b.set(x, y, c);
    }
  }
};
/** what stands on the table (drawn after the seated figures' forearms: the nameplates are nearer than their hands) */
const drawChamberProps = (b: Buf, f: number) => {
  SEATS.forEach((sx, i) => {
    const ty = edgeY(sx);
    drawMic(b, sx - 30, ty + 6, i === SPEAK_SEAT && speakAt(f).mouth + speakAt(f).dip >= 0 && f < 540);
    drawNameplate(b, sx, ty + 2, i === MAS_SEAT ? 'NOPEAI' : i === INVITED_SEAT ? 'INVITED' : null);
  });
  // the laptop, camera-left of him: a dark lid standing on the table; its cyan spill on the wood
  const lx = SEATS[MAS_SEAT] - 70, ly = edgeY(lx) - 14;
  for (let y = edgeY(lx); y < edgeY(lx) + 15; y++) for (let x = lx - 20; x < lx + 60; x++) {
    const d = Math.hypot((x - lx - 20) / 40, (y - edgeY(lx) - 4) / 10);
    if (d < 1 && bayer(x, y) < (1 - d) * 0.8) b.set(x, y, stepColor(b.get(x, y), 1) === b.get(x, y) ? b.get(x, y) : PAL.C1);
  }
  rect(lx, ly, 26, 15, b.ink(PAL.N1)); rect(lx, ly, 26, 1, b.ink(PAL.G3)); rect(lx + 25, ly, 1, 15, b.ink(PAL.C3));
  rect(lx - 2, ly + 14, 30, 2, b.ink(PAL.G2));
};

export const drawChamberMS = (b: Buf, f: number) => {
  drawChamberWall(b, TABLE_Y + 12);
  drawMonitor(b, f);
  // the chairs behind the table; the INVITED chair is pushed in, square to the table, nobody in it
  SEATS.forEach((sx, i) => drawChair(b, sx, i === INVITED_SEAT ? 64 : 62, TABLE_Y + 4, i === INVITED_SEAT ? 1 : 0));
  // the delegates (generic): the speaker leans into her mic; the others shift once in a while (a held pixel)
  SEATS.forEach((sx, i) => {
    if (i === MAS_SEAT || i === INVITED_SEAT) return;
    const img = delegateImg(SEAT_V[i], i === SPEAK_SEAT ? speakAt(f) : {mouth: 0, dip: 0});
    const shift = i !== SPEAK_SEAT && hash(i, Math.floor(f / 20), 3) < 0.3 ? 1 : 0;
    blitImg(b, img, sx - 35 + (i === 4 ? 4 : 0), TABLE_Y - 84 + shift, {clip: (_x, y) => y < TABLE_Y + 2});
  });
  // Mas: listening toward the president (camera-left), then on the beat his eyes go right, to the empty chair
  const look = f < C_GLANCE_MS ? -1 : 1;
  drawMasMedium(b, SEATS[MAS_SEAT] - 42, TABLE_Y - 84, {...MAS_MEDIUM_DEFAULT, light: 'monitor', look}, {desk: (bb) => drawChamberTable(bb)});
  drawChamberProps(b, f);
};

// ================================================================== the webcast wide (the chamber from the gallery)
// A high wide from the gallery at the open end of the horseshoe, locked off. The back wall: wood panels, a plain woven
// panel where a mural might be (none is copied), two wall monitors, the president's dais. The advisers' benches behind
// the far arc. The ring in perspective, delegates on its outer rim facing in: faces on the far arc, profiles on the
// arms, backs of heads at the near ends. The secretariat's table in the well. Painted plainly (flat light), then the
// device: barrel, broadcast-safe grade, the stream's blocking.
const HS = {cx: 240, cy: 152, rxO: 232, ryO: 90, rxI: 196, ryI: 75};
const SEAT_N = 25;
const seatA = (k: number) => -Math.PI / 2 + (k - (SEAT_N - 1) / 2) * 0.172;
const WIDE_PRES = (SEAT_N - 1) / 2, WIDE_MAS = WIDE_PRES + 2, WIDE_SPEAK = WIDE_PRES + 3, WIDE_INVITED = WIDE_PRES + 4;
const onRing = (a: number, dr: number): [number, number] => [HS.cx + Math.cos(a) * (HS.rxO + dr), HS.cy + Math.sin(a) * (HS.ryO + dr * (HS.ryO / HS.rxO))];
const SUITS = [PAL.N1, PAL.N2, PAL.G0, PAL.N1, PAL.F1, PAL.U0, PAL.G1, PAL.N2];
const SKINS = [PAL.S3, PAL.S2, PAL.S4, PAL.S2, PAL.S5, PAL.S3, PAL.S1, PAL.S4];
const HAIRS = [PAL.B0, PAL.G4, PAL.B1, PAL.N0, PAL.G5, PAL.B2, PAL.N1, PAL.B0];

/**
 * A seated delegate at gallery distance: chair back (blue upholstery, just over the head), shoulders lit on top, a
 * collar, a head with hair and a face's few pixels, hands on the table. `view` is which way they face us: 'front' (far
 * arc), 'left' / 'right' (profiles on the arms, facing into the well), 'back' (the near ends). s scales with depth.
 */
const smallPerson = (b: Buf, x: number, y: number, k: number, s: number, view: 'front' | 'left' | 'right' | 'back', f: number, o: {mas?: boolean; empty?: boolean; speak?: boolean; dim?: boolean; noChair?: boolean} = {}) => {
  const hw = Math.round(2.6 * s + 0.6), hh = Math.round(4 * s), headW = Math.max(3, Math.round(3.2 * s)), headH = Math.max(4, Math.round(3.9 * s));
  const bob = !o.mas && !o.empty && hash(k, Math.floor((f + k * 11) / 30), 5) < 0.18 ? 1 : 0;
  const lean = o.speak && Math.floor(f / 6) % 3 === 0 ? 1 : 0;
  const top = y - hh - headH - 2;
  // the chair's back: a rounded slab just over the head, a lit top edge (seen from behind: drawn over the shoulders)
  const cw = hw + 1;
  const chair = (t0: number) => {
    for (let j = 0; j < y - t0; j++) for (let i = -cw; i <= cw; i++) {
      if (j === 0 && Math.abs(i) === cw) continue;
      b.set(x + i, t0 + j, j === 0 ? PAL.F5 : Math.abs(i) === cw ? PAL.F2 : PAL.F4);
    }
  };
  if (view !== 'back') chair(top);
  if (o.empty) { rect(x - cw + 1, y - 2, cw * 2 - 1, 2, b.ink(PAL.F2)); return; }
  const dk = o.dim ? -1 : 0;
  const suit = o.mas ? PAL.G4 : stepColor(SUITS[k % SUITS.length], dk);
  const skin = o.mas ? PAL.S4 : stepColor(SKINS[k % SKINS.length], dk);
  const hair = o.mas ? PAL.B2 : HAIRS[k % HAIRS.length];
  // shoulders: a rounded block, the top lit by the downlights
  for (let j = 0; j < hh; j++) for (let i = -hw; i <= hw; i++) {
    if (j === 0 && Math.abs(i) >= hw - (s > 2 ? 2 : s > 1.4 ? 1 : 0)) continue;
    if (j === 1 && Math.abs(i) >= hw && s > 1.9) continue;
    b.set(x + i, y - hh + j, j === 0 ? stepColor(suit, 2) : j === 1 ? stepColor(suit, 1) : suit);
  }
  if (view === 'front') {
    if (o.mas) { b.set(x - 1, y - hh + 1, PAL.G6); b.set(x + 1, y - hh + 1, PAL.G6); } // the hoodie's strings
    else { b.set(x, y - hh, PAL.G5); b.set(x, y - hh + 1, k % 3 ? PAL.R1 : PAL.F4); } // collar and tie
    b.set(x - hw + 1, y, skin); b.set(x + hw - 1, y, skin); // hands on the table edge
  }
  const hx = x - Math.floor(headW / 2) + (view === 'left' ? -lean : lean), hy = y - hh - headH + 1 + bob;
  for (let j = 0; j < headH; j++) for (let i = 0; i < headW; i++) b.set(hx + i, hy + j, j === 0 ? stepColor(skin, 1) : j === headH - 1 ? stepColor(skin, -1) : skin);
  if (view === 'back') {
    // from behind: a rounded head of hair, the nape and the ears in skin, a white collar line, then the chair's back
    for (let j = -1; j < headH - 1; j++) for (let i = 0; i < headW; i++) {
      if ((j === -1 || j === headH - 2) && (i === 0 || i === headW - 1)) continue;
      b.set(hx + i, hy + j, j === -1 ? stepColor(hair, 1) : hair);
    }
    for (let i = 1; i < headW - 1; i++) b.set(hx + i, hy + headH - 1, stepColor(skin, -1));
    b.set(hx - 1, hy + 2, skin); b.set(hx + headW, hy + 2, skin);
    for (let i = -1; i <= 1; i++) b.set(x + i, y - hh, PAL.G5);
    if (!o.noChair) chair(y - hh + 3);
    return;
  }
  rect(hx, hy - 1, headW, 2, b.ink(hair));
  if (o.mas) { b.set(hx + headW - 2, hy - 2, hair); b.set(hx + headW - 1, hy - 3, stepColor(hair, 1)); } // the tuft
  if (view === 'front') {
    if (headW >= 4) { b.set(hx + 1, hy + 2, stepColor(skin, -3)); b.set(hx + headW - 2, hy + 2, stepColor(skin, -3)); }
    else b.set(hx + 1, hy + 2, stepColor(skin, -2));
  } else {
    const back = view === 'left' ? hx + headW - 1 : hx; // the back of the head, away from the well
    for (let j = -1; j < headH - 1; j++) b.set(back, hy + j, hair);
    b.set(view === 'left' ? hx - 1 : hx + headW, hy + 2, skin); // the nose
    b.set(view === 'left' ? hx + 1 : hx + headW - 2, hy + 2, stepColor(skin, -3)); // the eye
  }
};

/** the chamber, plainly lit, as the gallery camera frames it (no device yet). `screens` = what the wall monitors show */
const drawWebcastPicture = (b: Buf, f: number, screens: Buf | null) => {
  // ---- the back wall: ceiling band with its downlights, grey panels lit from above (a smooth ordered-dither
  // falloff the stream will block), panel seams, the woven centre panel, two wall monitors, the dais
  for (let y = 0; y < 68; y++) for (let x = 0; x < 480; x++) {
    let c: number;
    if (y < 7) c = PAL.N1;
    else if (y === 7) c = PAL.N0;
    else {
      const t = (y - 8) / 58;
      c = bayer(x, y) < 1 - t * 1.25 ? PAL.G2 : PAL.G1;
      if (x % 48 === 23) c = PAL.G0;
      if (x % 48 === 24) c = PAL.G2;
    }
    b.set(x, y, c);
  }
  for (let x = 12; x < 480; x += 24) { b.set(x, 4, PAL.P2); b.set(x + 1, 4, PAL.P1); }
  // the centre panel: a large abstract tapestry of muted colour fields (evokes a chamber's artwork; copies none)
  const FIELDS = [PAL.D3, PAL.F3, PAL.L1, PAL.W3, PAL.G3, PAL.F2, PAL.D4, PAL.U2];
  for (let y = 12; y < 50; y++) for (let x = 176; x < 304; x++) {
    const cx2 = Math.floor((x - 176 + Math.floor(hash(Math.floor((y - 12) / 9), 3, 8) * 12)) / 16), cy2 = Math.floor((y - 12) / 9);
    let c = FIELDS[Math.floor(hash(cx2, cy2, 21) * FIELDS.length)];
    if (y === 12 || y === 49 || x === 176 || x === 303) c = PAL.D1;
    b.set(x, y, c);
  }
  for (const mx of [74, 358]) {
    rect(mx - 2, 18, 52, 30, b.ink(PAL.N0));
    if (screens) miniature(screens, 0, 0, 480, 203, b, mx, 20, 48, 26);
    else rect(mx, 20, 48, 26, b.ink(PAL.G3));
    rect(mx + 20, 48, 8, 3, b.ink(PAL.N0));
  }
  rect(196, 54, 88, 9, b.ink(PAL.D3)); rect(196, 54, 88, 1, b.ink(PAL.W3)); rect(196, 62, 88, 1, b.ink(PAL.D1));
  // ---- the advisers' benches behind the far arc: a low wood wall, the heads and shoulders of the rows over it
  for (let k = 0; k < 34; k++) {
    const x = 6 + k * 14 + Math.floor(hash(k, 1, 4) * 5);
    if (hash(k, 2, 4) < 0.3 || (x > 192 && x < 288)) continue;
    rect(x - 3, 54, 7, 5, b.ink(stepColor(SUITS[k % 8], -1))); rect(x - 3, 54, 7, 1, b.ink(SUITS[k % 8]));
    rect(x - 1, 50, 3, 4, b.ink(stepColor(SKINS[k % 8], -1))); rect(x - 1, 50, 3, 1, b.ink(HAIRS[k % 8]));
  }
  rect(0, 58, 196, 5, b.ink(PAL.D2)); rect(284, 58, 196, 5, b.ink(PAL.D2));
  rect(0, 58, 196, 1, b.ink(PAL.D4)); rect(284, 58, 196, 1, b.ink(PAL.D4));
  // ---- the floor: carpet; the well inside the ring flat and a rung lighter, its centre lit (one seam)
  for (let y = 68; y < 203; y++) for (let x = 0; x < 480; x++) {
    const dx = (x - HS.cx) / HS.rxI, dy = (y - HS.cy) / HS.ryI, d = dx * dx + dy * dy;
    let c = PAL.F1;
    if (d < 1) c = d < 0.45 || (d < 0.6 && bayer(x, y) < (0.6 - d) / 0.15) ? PAL.F3 : PAL.F2;
    b.set(x, y, c);
  }
  // ---- the seats, far to near (so nearer people overlap), then the table ring over their laps
  const order = Array.from({length: SEAT_N}, (_, k) => k).sort((a, c) => Math.sin(seatA(a)) - Math.sin(seatA(c)));
  // the advisers' chairs right behind the members on the far arc (a second, darker row)
  for (const k of order) {
    const a = seatA(k);
    if (Math.abs(a + Math.PI / 2) > 0.9 || hash(k, 7, 2) < 0.35) continue;
    const [x, y] = onRing(a + 0.07, 30);
    smallPerson(b, Math.round(x), Math.round(y), k + 60, 1.4, 'front', f, {dim: true});
  }
  for (const k of order) {
    const a = seatA(k);
    const [x, y] = onRing(a, 8);
    const depth = clamp((y - 62) / 120, 0, 1);
    const s = 1.7 + depth * 0.9;
    const ca = Math.cos(a);
    const view = Math.sin(a) > 0.3 ? 'back' : Math.abs(a + Math.PI / 2) < 0.62 ? 'front' : ca < 0 ? 'right' : 'left';
    smallPerson(b, Math.round(x), Math.round(y) + 1, k, s, view, f, {mas: k === WIDE_MAS, empty: k === WIDE_INVITED, speak: k === WIDE_SPEAK});
  }
  // the table ring: pale wood lit from above, a darker rim at its outer edge, the inner fascia facing us on the far
  // side; open at the near end (the arms run out of frame under the lower third)
  for (let y = 58; y < 203; y++) for (let x = 0; x < 480; x++) {
    const o = Math.pow((x - HS.cx) / HS.rxO, 2) + Math.pow((y - HS.cy) / HS.ryO, 2);
    const i = Math.pow((x - HS.cx) / HS.rxI, 2) + Math.pow((y - HS.cy) / HS.ryI, 2);
    if (o > 1 || i <= 1) continue;
    let c = o > 0.95 ? PAL.D3 : o > 0.9 ? PAL.W3 : PAL.D4;
    if (i < 1.1 && y < HS.cy - 10) c = i < 1.05 ? PAL.D2 : PAL.D3; // the inner fascia on the far side
    b.set(x, y, c);
  }
  // nameplates and mics in front of each seat (the speaker's mic live); the INVITED card, big enough to read
  for (let k = 0; k < SEAT_N; k++) {
    const a = seatA(k);
    if (Math.sin(a) > 0.3 || k === WIDE_INVITED) continue;
    const [x, y] = onRing(a, -13);
    const X = Math.round(x), Y = Math.round(y);
    rect(X - 3, Y, 7, 3, b.ink(PAL.P2)); rect(X - 3, Y + 2, 7, 1, b.ink(PAL.P0));
    b.set(X + 5, Y - 3, PAL.N0); b.set(X + 5, Y - 2, PAL.G2); b.set(X + 5, Y - 1, PAL.G2);
    // their papers and a water glass on the wood, between them and the nameplate
    const [px, py] = onRing(a, -4);
    rect(Math.round(px) - 4, Math.round(py), 5, 2, b.ink(hash(k, 5, 5) < 0.5 ? PAL.P1 : PAL.G6));
    if (hash(k, 6, 5) < 0.6) { b.set(Math.round(px) + 3, Math.round(py) - 1, PAL.C6); b.set(Math.round(px) + 3, Math.round(py), PAL.C4); }
    if (k === WIDE_SPEAK) b.set(X + 5, Y - 4, Math.floor(f / 24) % 2 ? PAL.R2 : PAL.R3);
  }
  {
    const [x, y] = onRing(seatA(WIDE_INVITED), -14);
    const s = 'INVITED', w = textWidth(s) + 6, X = Math.round(x) - Math.round(w / 2), Y = Math.round(y) - 9;
    rect(X - 1, Y - 1, w + 2, 12, b.ink(PAL.N0));
    rect(X, Y, w, 10, b.ink(PAL.P2));
    rect(X, Y + 9, w, 1, b.ink(PAL.P0));
    text(b, s, X + 3, Y + 1, PAL.N1);
  }
  // the secretariat's table in the well, three at it with their backs to us
  rect(200, 130, 80, 9, b.ink(PAL.D4)); rect(200, 130, 80, 1, b.ink(PAL.W3)); rect(200, 138, 80, 2, b.ink(PAL.D2));
  for (let k = 0; k < 3; k++) smallPerson(b, 216 + k * 24, 152, 40 + k, 2.2, 'back', f, {noChair: true});
};

/** the stream's low bitrate: 8x8 blocks of the smooth wall gradient collapse to one colour each (only where a block is
 * nearly flat, so edges, people and type keep their pixels). The honest look of a public webcast, never a glitch. */
const lowBitrate = (b: Buf, x0: number, y0: number, w: number, h: number) => {
  // each nearly flat block takes its own dominant colour (never a new hue): the gradient's dither becomes 8 px bands
  for (let by = y0; by < y0 + h; by += 8) for (let bx = x0; bx < x0 + w; bx += 8) {
    const count = new Map<number, number>();
    for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) { const c = b.get(bx + i, by + j); count.set(c, (count.get(c) ?? 0) + 1); }
    if (count.size > 2) continue;
    let best = 0, bc = -1;
    for (const [c, n] of count) if (n > bc) { bc = n; best = c; }
    for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) if (by + j < y0 + h) b.set(bx + i, by + j, best);
  }
};
/** the broadcast-safe grade on everything but skin (the pass's pool has no skin ramp, so faces would go grey; a real
 * webcast flattens the room and keeps people's faces warm), with the brightest skin capped a rung */
const gradeKeepSkin = (b: Buf) => {
  const keep = new Map<number, number>();
  for (let i = 0; i < b.c.length; i++) { const c = b.c[i]; if (familyOf(c)?.[0] === 'S') keep.set(i, c === PAL.S6 || c === PAL.S5 ? PAL.S4 : c); }
  broadcastSafe(b);
  for (const [i, c] of keep) b.c[i] = c;
};
/** the wide lens's corners: one rung down in an ordered-dither falloff (a cheap fixed wide, not a barrel resample) */
const lensCorners = (b: Buf) => {
  for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) {
    const d = Math.hypot((x - 240) / 250, (y - 101) / 150);
    if (d > 0.82 && bayer(x, y) < (d - 0.82) * 3) b.set(x, y, stepColor(b.get(x, y), -1));
  }
};

export const WEBCAST_TC0 = (10 * 3600 + 14 * 60 + 2) * 24;
const drawWebcastOSD = (b: Buf, f: number) => {
  // WEBCAST bug, top left; the timecode, top right (tiny, a burn-in); the lower third steps in after a beat
  tag(b, 'WEBCAST', 8, 8, PAL.G5, PAL.N1, PAL.N1);
  const tc = timecode(Math.max(0, f - C_IN), WEBCAST_TC0);
  rect(480 - tinyWidth(tc) - 12, 7, tinyWidth(tc) + 6, 9, b.ink(PAL.N1));
  tiny(b, tc, 480 - tinyWidth(tc) - 9, 9, PAL.G5);
  const t = revealStep(f - (C_IN + 14));
  revealed(b, 14, 160, 300, 30, t, (bb) => {
    plate(bb, 14, 160, 6, 28, PAL.G5, PAL.G6, PAL.G3);
    plate(bb, 20, 160, 260, 15, PAL.F3, PAL.F4, PAL.F2);
    osdText(bb, 'SECURITY COUNCIL', 27, 164, PAL.P2);
    plate(bb, 20, 175, 260, 13, PAL.G5, PAL.G6, PAL.G4);
    tiny(bb, 'OPEN DEBATE · ARTIFICIAL INTELLIGENCE', 27, 179, PAL.N2);
  });
};
/** the whole device picture: the plain chamber through the webcast's lens, grade and codec; `osd` adds the graphics */
export const drawWebcastFrame = (b: Buf, f: number, osd = true) => {
  // the wall monitors show this same feed (one level deep: they carry the plain picture)
  const inner = new Buf(480, 203, PAL.N0);
  drawWebcastPicture(inner, f, null);
  drawWebcastPicture(b, f, inner);
  gradeKeepSkin(b);
  softChroma(b, 0, 0, 480, 203);
  lowBitrate(b, 0, 8, 480, 48);
  lensCorners(b);
  if (osd) drawWebcastOSD(b, f);
};

// ================================================================== the [MCU]: his close-up, the chamber soft behind
/**
 * Mas's approved close-up with his pupils moved `dx` whole pixels (the one live motion the CU allows: "his pupils
 * move one pixel toward the dialog"). The eye stamps are regenerated with the iris shifted and every changed pixel
 * takes the colour that character already has in the drawing, so nothing but the iris and its lit sclera moves.
 */
const NEAR_EYE = {x: 95, y: 62, spec: {w: 30, h: 14, up: 4.1, low: 3.3, ix: 14, iy: 8.5, ir: 6.6, pr: 3.1, tilt: 1, lid: 2, crease: 3}};
const FAR_EYE = {x: 71, y: 63, spec: {w: 17, h: 13, up: 3.5, low: 2.9, ix: 6.5, iy: 8, ir: 4.6, pr: 2.3, tilt: 1, lid: 2, crease: 2, mirror: true, glint: 1}};
const masCUGlance = memo((dx: number): Img => {
  const base = masCU('cyan');
  if (!dx) return base;
  const img = cloneImg(base);
  for (const E of [NEAR_EYE, FAR_EYE]) {
    const a = eyeMap(E.spec), b2 = eyeMap({...E.spec, ix: E.spec.ix + dx});
    const col = new Map<string, number>();
    a.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== '.' && !col.has(ch)) col.set(ch, base.c[(E.y + j) * base.w + E.x + i]); }));
    b2.forEach((r, j) => [...r].forEach((ch, i) => {
      if (ch === a[j][i] || ch === '.') return;
      const c = col.get(ch);
      if (c !== undefined && c >= 0) img.c[(E.y + j) * img.w + E.x + i] = c;
    }));
  }
  return img;
});

const drawMCU = (b: Buf, f: number) => {
  // the chamber from closer and lower: the plain panelled wall with the downlights' band, the rail, the table's lit
  // edge low; two seats down at frame right the empty INVITED chair. Painted sharp, then stepped out of focus (4x4 for
  // the wall, 2x2 for the table and the chair): the only depth of field a pixel frame has
  for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) {
    let c = y < 34 ? (bayer(x, y) < (34 - y) / 44 ? PAL.N3 : PAL.N2) : PAL.N2;
    if (x % 64 === 20) c = PAL.N1;
    b.set(x, y, c);
  }
  rect(0, 104, 480, 1, b.ink(PAL.N3)); rect(0, 105, 480, 1, b.ink(PAL.N1));
  drawChair(b, 412, 112, 168, 1);
  for (let x = 0; x < 480; x++) { const y = 166 - Math.round((x - 300) * 0.02); rect(x, y, 1, 203 - y, b.ink(PAL.D3)); b.set(x, y, PAL.W4); rect(x, y + 1, 1, 3, b.ink(PAL.D4)); }
  drawMic(b, 372, 168);
  stepDefocus(b, 0, 0, 480, 110, 4);
  stepDefocus(b, 200, 110, 280, 93, 2);
  // the INVITED card, nearer than the wall and softer than his face: the card's own letters are drawn on the 2x2 grid
  // (each letter pixel a 2x2 block, the same step as the table's defocus), so the word still reads, big, by his head
  {
    const s = 'INVITED';
    const tw = textWidth(s) * 2, w = tw + 16, h = 26, x = 414 - Math.round(w / 2) + 1, y = 140;
    rect(x, y + h, w, 2, b.ink(PAL.D1));
    for (let j = 0; j < h; j += 2) for (let i = 0; i < w; i += 2) {
      const c = j < 2 ? PAL.P2 : j >= h - 4 ? PAL.P0 : PAL.P1;
      rect(x + i, y + j, 2, 2, b.ink(c));
    }
    const tmp = new Buf(tw / 2 + 2, 12, 0x1000000);
    text(tmp, s, 0, 1, PAL.N2);
    for (let j = 0; j < tmp.h; j++) for (let i = 0; i < tmp.w; i++) if (tmp.c[j * tmp.w + i] !== 0x1000000) rect(x + 8 + i * 2, y + 4 + (j - 1) * 2, 2, 2, b.ink(PAL.N2));
  }
  // the laptop's cyan rising from the bottom left behind his shoulder (his key's source)
  for (let y = 120; y < 203; y++) for (let x = 0; x < 200; x++) {
    const d = Math.hypot(x / 180, (203 - y) / 90);
    if (d < 1 && bayer(x, y) < (1 - d) * 0.9) b.set(x, y, d < 0.5 ? PAL.C1 : PAL.C0);
  }
  blitTo(b, masCUGlance(f >= C_GLANCE_CU && f < C_GLANCE_BACK ? 1 : 0), 0, 0, {clip: (_x, y) => y < 203});
};

export const clipC = (f: number, room: Buf): {view: View} => {
  if (f < C_IN) drawChamberMS(room, f);
  else if (f < C_OUT) drawWebcastFrame(room, f, true);
  else drawMCU(room, f);
  return {view: WIDE};
};
export {seg, osdWidth};
