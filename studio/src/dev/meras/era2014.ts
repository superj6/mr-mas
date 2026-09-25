// MR. MAS — meras: 2014. WHY COMBINATOR. Low-angle hero shot, EARLY-WEB 16 (lit variant).
// Hoodie founders (forks, laptops) hoist Mas (29, tiny parachute pack) onto a throne of laptops and ramen
// cups; LUAP, standing on a stack of his essays, drops a paper crown down a dotted path he drew in
// advance. The crown's glint is the hand-off to 2015.
import {Buf, rect, line, ellipse, poly, clamp, shiftBuf} from '../../shared/pixel/px';
import {PAL} from '../../shared/pixel/palette';
import {FigureDef, Img, LightRig, P, Part, renderFigure, blitImg} from '../../shared/pixel/figure';
import {bigText, bigTextWidth, text} from '../../shared/pixel/font';
import {bayer4, bayer8} from '../../shared/pixel/dither';
import {applyPalette} from '../../shared/pixel/palettes';
import {masThrone, MAS_THRONE_SEAT} from '../../shared/pixel/cast/mas';
import {seg} from '../../shared/pixel/cast/kit';
import {ERA14} from './palettes';
import {eraStamp} from '../../shared/pixel/cast/era';
import {T} from './timeline';

const SEAT_Y = 170; // throne cushion line
const MAS_X = 217; // sprite left
export const CROWN_REST: [number, number] = [MAS_X + 17, SEAT_Y - MAS_THRONE_SEAT + 2]; // top-left of the crown on his head

// ------------------------------------------------------------------ hall
const LAMPS: Array<[number, number]> = [[64, 60], [150, 44], [338, 46], [486, 52], [592, 40]];
const hall = (b: Buf) => {
  // a dark warehouse: the brick wall is there everywhere at a low tone; each pendant throws an oval pool on the
  // wall below it that falls off in steps (dither only in the falloff band, never on the figures)
  for (let y = 0; y < b.h; y++) for (let x = 0; x < b.w; x++) {
    let lit = 0;
    for (const [lx, ly] of LAMPS) lit = Math.max(lit, 1 - Math.hypot((x - lx) / 92, (y - ly - 36) / 64));
    const row = Math.floor(y / 6), off = (row % 2) * 8;
    const mortar = y % 6 === 5 || (x + off) % 16 === 15;
    // lv 0: the brick at low tone (flat dark brick, black mortar); 1: the falloff band (dithered); 2: the pool
    const lv = lit > 0.42 ? 2 : lit > 0.18 ? (lit > 0.3 || bayer4(x, y) < (lit - 0.18) * 8 ? 1 : 0) : 0;
    // unlit brick is the cool night (slate); the pendants warm it where they reach
    b.set(x, y, mortar ? (lv === 2 ? PAL.D1 : PAL.D0) : [PAL.N3, PAL.D2, PAL.D2][lv]);
    if (lv === 2 && !mortar && lit > 0.66 && (x + off) % 16 < 8) b.set(x, y, PAL.D3);
  }
  for (const [lx, ly] of LAMPS) {
    line(lx, 0, lx, ly - 6, b.ink(PAL.N0));
    poly([lx - 7, ly, lx + 7, ly, lx + 4, ly - 6, lx - 4, ly - 6], b.ink(PAL.N0));
    rect(lx - 7, ly, 15, 1, b.ink(PAL.G3));
    ellipse(lx, ly + 2, 3, 2, b.ink(PAL.W8));
  }
};

const SIGN_TEXT = 'WHY COMBINATOR';
const SIGN = (() => { const tw = bigTextWidth(SIGN_TEXT); return {x: 240 - Math.round(tw / 2) - 12, y: 10, w: tw + 24, h: 26}; })();
/** the approved parody pair (guardrails §5, SCRIPT §3.4 / §9.5 note 4): flat #FF7F2A letters on a #F3EEDC cream plate,
 *  a 1-px #000033 outline on the must-read letters (the pair alone is 2.2:1). The inverse of YC's orange plate. */
const SIGN_CREAM = 0xf3eedc, SIGN_ORANGE = 0xff7f2a, SIGN_NAVY = 0x000033;
/** world layer: the hanging wires and the hard shadow (these go through the era palette like the rest of the hall) */
const banner = (b: Buf) => {
  const {x, y, w, h} = SIGN;
  line(x + 4, 0, x + 4, y, b.ink(PAL.N0)); line(x + w - 5, 0, x + w - 5, y, b.ink(PAL.N0));
  rect(x + 2, y + 2, w, h, b.ink(PAL.N0));
  rect(x, y, w, h, b.ink(PAL.P2));
};
/** the plate and letters in the exact sign colours, drawn after the era palette at the world->screen offset */
const bannerInks = (b: Buf, ox: number, oy: number) => {
  const {x, y, w, h} = SIGN;
  rect(x + ox, y + oy, w, h, b.ink(SIGN_NAVY));
  rect(x + ox + 1, y + oy + 1, w - 2, h - 2, b.ink(SIGN_CREAM));
  bigText(b, SIGN_TEXT, x + ox + 12, y + oy + 6, SIGN_ORANGE, {outline: SIGN_NAVY});
};

// ------------------------------------------------------------------ the throne
const LAPTOP_SHELLS: Array<[number, number, number]> = [[PAL.G6, PAL.G4, PAL.G2], [PAL.G3, PAL.G2, PAL.N1], [PAL.P1, PAL.G5, PAL.G3], [PAL.G5, PAL.G4, PAL.G2]];
const DARK_SHELLS: Array<[number, number]> = [[PAL.N4, PAL.N2], [PAL.N3, PAL.N1], [PAL.N5, PAL.N2]];
const laptopSlab = (b: Buf, x: number, y: number, w: number, k: number, lit = true) => {
  const [top, mid, edge] = LAPTOP_SHELLS[k % LAPTOP_SHELLS.length];
  const [dt, dm] = DARK_SHELLS[k % DARK_SHELLS.length];
  rect(x, y, w, 4, b.ink(lit ? mid : dm));
  rect(x, y, w, 1, b.ink(lit ? top : dt));
  rect(x, y + 3, w, 1, b.ink(PAL.N1));
  rect(x + 2, y + 1, 3, 1, b.ink(edge)); // hinge
  if (k % 3 === 0) b.set(x + w - 3, y + 2, PAL.C6); // a charging light
};
const ramen = (b: Buf, x: number, y: number) => {
  // a cup of instant noodles: paper cup, red band, peeled lid
  poly([x, y, x + 13, y, x + 12, y + 11, x + 1, y + 11], b.ink(PAL.P2));
  rect(x + 1, y + 3, 12, 3, b.ink(PAL.R2));
  rect(x + 1, y + 4, 12, 1, b.ink(PAL.R3));
  rect(x - 1, y - 1, 15, 2, b.ink(PAL.G5));
  poly([x + 7, y - 1, x + 14, y - 1, x + 16, y - 6], b.ink(PAL.G6));
  line(x + 11, y + 1, x + 11, y + 10, b.ink(PAL.G5));
};
const openLaptop = (b: Buf, x: number, y: number, w: number, h: number) => {
  rect(x - 1, y - 1, w + 2, h + 2, b.ink(PAL.G2));
  rect(x, y, w, h, b.ink(PAL.C3));
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if (bayer4(x + i, y + j) < 0.5 - j / (h * 1.6)) b.set(x + i, y + j, PAL.C5);
  for (let r = 0; r < Math.floor(h / 5); r++) rect(x + 3, y + 3 + r * 4, 6 + ((r * 13) % Math.max(4, w - 10)), 1, b.ink(PAL.C7));
  rect(x - 3, y + h + 1, w + 6, 3, b.ink(PAL.G4)); rect(x - 3, y + h + 1, w + 6, 1, b.ink(PAL.G6));
};
const throne = (b: Buf) => {
  // crest: open laptops glowing like a reliquary
  openLaptop(b, 222, 70, 36, 24);
  openLaptop(b, 196, 92, 20, 14);
  openLaptop(b, 264, 92, 20, 14);
  // the back: closed laptops stacked flat, tall, a little uneven (a chair back, not a staircase)
  for (let k = 0; k < 17; k++) { const w = 50 + Math.min(k, 8) * 2; laptopSlab(b, 240 - Math.round(w / 2) + ((k * 5) % 3) - 1, 98 + k * 4, w, k, true); }
  // legs: two stacks of closed laptops at the front corners, dark air under the seat between them
  rect(206, SEAT_Y + 14, 68, 38, b.ink(PAL.N0));
  for (const lx of [202, 262]) for (let k = 0; k < 10; k++) laptopSlab(b, lx + ((k * 3) % 2), SEAT_Y + 14 + k * 4, 16, k + 3, false);
  // a low plinth
  for (let k = 0; k < 3; k++) laptopSlab(b, 186 - k * 4, SEAT_Y + 54 + k * 4, 108 + k * 8, k + 5, false);
  // seat: a thick cushion of four laptops, lit on top, with a shadow under its lip
  for (let k = 0; k < 4; k++) laptopSlab(b, 202 + (k % 2), SEAT_Y - 2 + k * 4, 76, k + 1, true);
  rect(200, SEAT_Y + 14, 80, 2, b.ink(PAL.N0));
  // armrests: stacks of closed laptops on the seat's corners, each capped with one open laptop, screen glowing
  for (const ax of [186, 274]) {
    for (let k = 0; k < 5; k++) laptopSlab(b, ax + ((k * 3) % 2), SEAT_Y - 18 + k * 4, 20, k + 2, true);
    rect(ax + 2, SEAT_Y - 25, 16, 6, b.ink(PAL.G2)); rect(ax + 3, SEAT_Y - 24, 14, 4, b.ink(PAL.C4)); rect(ax + 4, SEAT_Y - 23, 5, 1, b.ink(PAL.C7));
    rect(ax, SEAT_Y - 19, 20, 1, b.ink(PAL.G6));
  }
};

// ------------------------------------------------------------------ founders (generic hoodie founders)
type Founder = {x: number; y: number; flip: boolean; hood: number[]; hair: number[]; skin: number[]; prop: 'ramen' | 'chopsticks' | 'laptop' | 'none'; glasses?: boolean};
// four generic founders: different hoodies (charcoal, light heather, navy, grey), different hair, skin that stays skin
const FOUNDERS: Founder[] = [
  {x: 132, y: 200, flip: false, hood: [PAL.N1, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4], hair: [PAL.B0, PAL.B1, PAL.B2, PAL.B3], skin: [PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6, PAL.S6], prop: 'ramen'},
  {x: 186, y: 206, flip: false, hood: [PAL.N1, PAL.G3, PAL.G4, PAL.G5, PAL.G6, PAL.P2], hair: [PAL.B0, PAL.B0, PAL.B1, PAL.B2], skin: [PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S5], prop: 'laptop', glasses: true},
  {x: 296, y: 206, flip: true, hood: [PAL.N1, PAL.N3, PAL.N4, PAL.N5, PAL.N6, PAL.N7], hair: [PAL.W3, PAL.W4, PAL.W5, PAL.W6], skin: [PAL.S2, PAL.S3, PAL.S5, PAL.S5, PAL.S6, PAL.S6], prop: 'none'},
  {x: 352, y: 200, flip: true, hood: [PAL.N1, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5], hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2], skin: [PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6], prop: 'chopsticks'},
];
/** arm states: 'lift' both hands up under him; 'cheer' one fist/prop up */
const founderFig = (f: Founder, arms: 'lift' | 'cheer', lift: number): FigureDef => {
  const parts: Part[] = [
    {group: 'body', mat: 'hood', prims: [P.poly(4, 36, 10, 26, 18, 23, 28, 24, 34, 30, 38, 44, 38, 80, 2, 80)]},
    {group: 'hoodie', mat: 'hood', prims: [P.poly(9, 25, 14, 18, 24, 18, 29, 25, 20, 29)]},
    {group: 'head', mat: 'skin', prims: [P.ell(20, 14, 7, 8)]},
    {group: 'hair', mat: 'hair', prims: [P.poly(12, 14, 12, 7, 16, 4, 22, 3, 27, 5, 29, 10, 27, 12, 25, 8, 17, 8, 15, 14)]},
  ];
  // arms reach toward the throne (screen-right, before flipping)
  if (arms === 'lift') {
    parts.push({group: 'armN', mat: 'hood', prims: [seg(30, 30, 7, 38, 14 - lift, 6)]});
    parts.push({group: 'armF', mat: 'hood', prims: [seg(10, 30, 7, 30, 12 - lift, 6)]});
    parts.push({group: 'hand', mat: 'skin', prims: [P.ell(39, 11 - lift, 3, 3), P.ell(31, 9 - lift, 3, 3)]});
  } else {
    parts.push({group: 'armN', mat: 'hood', prims: [seg(30, 30, 7, 36, 10, 6)]});
    parts.push({group: 'armF', mat: 'hood', prims: [seg(10, 30, 7, 6, 44, 6)]});
    parts.push({group: 'hand', mat: 'skin', prims: [P.ell(36, 7, 3, 3)]});
  }
  return {w: 48, h: 80, parts, adjust: [
    {prims: [P.line(20, 29, 20, 44)], add: -1, onlyMat: 'hood'}, {prims: [P.line(18, 31, 17, 38), P.line(22, 31, 23, 38)], add: 1, onlyMat: 'hood'},
    // the pendants fill their faces from the front: a flat tone-3 face, a tone-4 plane on the lit brow and cheek
    {prims: [P.ell(20, 14, 6, 7)], tone: 3, onlyMat: 'skin'}, {prims: [P.poly(15, 10, 22, 8, 25, 11, 20, 12, 16, 15)], tone: 4, onlyMat: 'skin'},
    {prims: [P.poly(24, 16, 27, 12, 27, 18, 23, 21)], tone: 2, onlyMat: 'skin'},
  ]};
};
const founderRig = (f: Founder): LightRig => ({
  key: [-0.4, -1], keyBand: 2, shadowBand: 2, rim: true, outline: true, edgesOnTop: true,
  back: [0, 1], backBand: 1, backRamp: {hood: PAL.C3},
  ramps: {hood: f.hood, skin: f.skin, hair: [...f.hair, f.hair[3], f.hair[3]]},
});
const founderCache = new Map<string, Img>();
const drawFounder = (b: Buf, f: Founder, arms: 'lift' | 'cheer', lift: number, g: number) => {
  const key = `${FOUNDERS.indexOf(f)}${arms}${lift}`;
  let img = founderCache.get(key);
  if (!img) {
    img = renderFigure(founderFig(f, arms, lift), founderRig(f));
    // face, turned toward the throne: two eyes, a brow line, an open cheering mouth; glasses for one of them
    const c = img.c, W = img.w;
    const put = (x: number, y: number, v: number) => { if (x >= 0 && y >= 0 && x < W && y < img!.h) c[y * W + x] = v; };
    put(20, 13, PAL.N0); put(24, 13, PAL.N0); put(25, 13, PAL.N0);
    put(20, 12, f.hair[1]); put(24, 11, f.hair[1]); put(25, 11, f.hair[1]);
    put(22, 17, PAL.N0); put(23, 17, PAL.N0); put(23, 18, PAL.R1); put(22, 16, f.skin[1]);
    if (f.glasses) { for (let i = 19; i <= 26; i++) if (i !== 22) put(i, 12, PAL.N0); put(21, 13, PAL.G6); put(26, 13, PAL.G6); }
    founderCache.set(key, img);
  }
  blitImg(b, img, f.flip ? f.x - 48 : f.x, f.y, {flip: f.flip});
  // props
  const hx = f.flip ? f.x - 36 : f.x + 36, hy = f.y + (arms === 'lift' ? 11 - lift : 7);
  const bob = Math.floor(g / 4) % 2;
  if (arms === 'cheer' && f.prop === 'ramen') {
    // a noodle cup raised in a toast: paper cup, red band, the lid peeled back
    const cx = hx - 4, cy = hy - 10 - bob;
    poly([cx, cy, cx + 8, cy, cx + 7, cy + 8, cx + 1, cy + 8], b.ink(PAL.P2));
    rect(cx + 1, cy + 3, 7, 2, b.ink(PAL.R2));
    rect(cx - 1, cy - 1, 10, 1, b.ink(PAL.G5));
    line(cx + 5, cy - 1, cx + 9, cy - 4, b.ink(PAL.G6));
  }
  if (arms === 'cheer' && f.prop === 'chopsticks') {
    // a pair of chopsticks waved like a baton
    line(hx - 1, hy + 1 - bob, hx + 3, hy - 13 - bob, b.ink(PAL.W6));
    line(hx + 1, hy + 1 - bob, hx + 6, hy - 12 - bob, b.ink(PAL.W5));
  }
  if (f.prop === 'laptop') {
    // tucked under the far arm
    const lx = f.flip ? f.x - 16 : f.x - 2, ly = f.y + 40;
    rect(lx, ly, 20, 4, b.ink(PAL.G4)); rect(lx, ly, 20, 1, b.ink(PAL.G6));
  }
};

// ------------------------------------------------------------------ LUAP, on his essays
const paperStack = (b: Buf) => {
  const x = 392, top = 146;
  for (let y = top; y < b.h; y += 3) {
    const jog = ((y * 7) % 5) - 2;
    rect(x + jog, y, 50, 3, b.ink(PAL.P1));
    rect(x + jog, y + 2, 50, 1, b.ink(PAL.P0));
    if (((y * 13) % 7) === 0) rect(x + jog + 6, y + 1, 30, 1, b.ink(PAL.G4)); // a line of type showing
  }
  rect(x - 2, top, 1, b.h - top, b.ink(PAL.D1));
};
const LUAP_FEET: [number, number] = [417, 146];
const luapFig = (hand: 'hold' | 'open'): FigureDef => ({
  w: 40, h: 54,
  parts: [
    {group: 'legs', mat: 'pants', prims: [P.poly(14, 34, 26, 34, 27, 52, 22, 52, 20, 40, 18, 52, 13, 52)]},
    {group: 'body', mat: 'fleece', prims: [P.poly(12, 20, 16, 16, 24, 16, 28, 20, 28, 36, 12, 36)]},
    {group: 'arm', mat: 'fleece', prims: [seg(14, 20, 5, 2, hand === 'hold' ? 16 : 13, 4)]},
    {group: 'hand', mat: 'skin', prims: [P.ell(1, hand === 'hold' ? 16 : 13, 2, 2)]},
    {group: 'head', mat: 'skin', prims: [P.ell(20, 9, 6, 7)]},
    {group: 'hair', mat: 'hair', prims: [P.poly(14, 8, 15, 3, 20, 2, 25, 3, 26, 8, 24, 5, 16, 5)]},
  ],
  adjust: [{prims: [P.line(20, 17, 20, 30)], add: 1, onlyMat: 'fleece'}, {prims: [P.rect(22, 22, 3, 3)], mat: 'patch', tone: 3}],
});
const LUAP_RIG: LightRig = {
  key: [-0.5, -1], keyBand: 1, shadowBand: 2, rim: true, outline: true,
  ramps: {fleece: [PAL.N1, PAL.N3, PAL.N5, PAL.N6, PAL.N7, PAL.N8], pants: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N5], skin: [PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6], hair: [PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.G6], patch: [PAL.W3, PAL.W4, PAL.W5, PAL.W5, PAL.W6, PAL.W7]},
};
const luapCache: Partial<Record<'hold' | 'open', Img>> = {};
const drawLuap = (b: Buf, g: number) => {
  const hand = g < T.crownGo ? 'hold' : 'open';
  let img = luapCache[hand];
  if (!img) {
    img = renderFigure(luapFig(hand), LUAP_RIG);
    img.c[8 * img.w + 17] = PAL.N0; img.c[8 * img.w + 18] = PAL.N0; // an eye, looking at the crown
    img.c[12 * img.w + 17] = PAL.S2; // a small satisfied mouth
    luapCache[hand] = img;
  }
  blitImg(b, img, LUAP_FEET[0] - 20, LUAP_FEET[1] - 52);
  text(b, 'LUAP', LUAP_FEET[0] - 12, LUAP_FEET[1] + 6, PAL.D1);
};

// ------------------------------------------------------------------ the crown and its dotted path
const CROWN = ['.J...J...J..', '.JJ.JjJ.JJ..', '.JjJJjJJjJ..', 'JjjjjjjjjjJ.', 'jJjJjJjJjJj.'];
const drawCrown = (b: Buf, x: number, y: number) => {
  CROWN.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = r[i]; if (c === 'J') b.set(x + i, y + j, PAL.P2); else if (c === 'j') b.set(x + i, y + j, PAL.W5); } });
};
const PATH_N = 18;
const pathPt = (t: number): [number, number] => {
  const x0 = LUAP_FEET[0] - 22, y0 = LUAP_FEET[1] - 40, [x1, y1] = CROWN_REST;
  return [Math.round(x0 + (x1 - x0) * t), Math.round(y0 + (y1 - y0) * t - Math.sin(t * Math.PI) * 46)];
};
const dottedPath = (b: Buf, g: number) => {
  const shown = clamp(Math.floor((g - 199) * 4), 0, PATH_N);
  for (let k = 1; k < shown; k++) { const [x, y] = pathPt(k / PATH_N); rect(x, y + 2, 2, 2, b.ink(PAL.P2)); b.set(x + 1, y + 3, PAL.P0); }
};
/** crown position along the path (on twos), or null once it's on his head */
const crownAt = (g: number): [number, number] | null => {
  if (g >= T.crownLand) return null;
  if (g < T.crownGo) { const [x, y] = pathPt(0); return [x - 6, y - 2]; }
  const ff = T.crownGo + Math.floor((g - T.crownGo) / 2) * 2;
  const t = (ff - T.crownGo) / (T.crownLand - T.crownGo);
  const e = t * t * (3 - 2 * t);
  const [x, y] = pathPt(e);
  return [x - 6, y - 2];
};

// ------------------------------------------------------------------ Mas
const masLift = (g: number) => {
  // held up by the crowd, then heaved: up in whole-pixel steps on twos, over the cushion, down onto it
  if (g >= T.seat) return [0, -1, 0][Math.min(2, g - T.seat)];
  const keys: Array<[number, number]> = [[195, -34], [199, -30], [201, -22], [203, -10], [205, 2], [207, 8], [209, 4]];
  let v = keys[0][1];
  for (const [f, h] of keys) if (g >= f) v = h;
  return v;
};
/** the collars re-pop over the hoodie: two small tips at the neck */
const collarTips = (b: Buf, x: number, y: number, g: number) => {
  const up = g >= T.repop;
  const k = up ? (g === T.repop ? 1 : 0) : 0;
  if (up) {
    b.set(x + 18, y + 18 - k, PAL.L2); b.set(x + 18, y + 19 - k, PAL.L1); b.set(x + 17, y + 19 - k, PAL.L2);
    b.set(x + 27, y + 18 - k, PAL.L2); b.set(x + 27, y + 19 - k, PAL.L1); b.set(x + 28, y + 19 - k, PAL.L2);
    b.set(x + 19, y + 18 - k, PAL.R3); b.set(x + 26, y + 18 - k, PAL.R3);
  }
};
/** where the glint sits on the crown (world coords) */
export const glintPos = (): [number, number] => [CROWN_REST[0] + 5, CROWN_REST[1] - 1];
/** the hand-off: at f224 the glint must sit on mdinner1's candelabra flame. mdinner1 draws the candelabra at world
 *  (84, 158) with its camera at y 30 on f225, so the centre candle's flame core (W9) is at native (84, 95); (84, 108)
 *  was the candle's cup. [intro integrator, 2026-09-25: was [84, 108]; see studio/notes/intro.md] */
export const HANDOFF: [number, number] = [84, 95];
const PAN0 = 219; // the camera starts to drift right on 220, accelerating into the cut (a whip that continues in mdinner1)
/** world -> screen offset for frame g (whole pixels) */
export const panAt = (g: number): [number, number] => {
  if (g <= PAN0) return [0, 0];
  const t = Math.min(1, (g - PAN0) / (T.whip - 1 - PAN0));
  const e = Math.pow(t, 2.2);
  const [gx, gy] = glintPos();
  return [Math.round((gx - HANDOFF[0]) * e), Math.round((gy - HANDOFF[1]) * e)];
};

export const SPARK = [
  ['#'],
  ['.+.', '+#+', '.+.'],
  ['..+..', '..+..', '++#++', '..+..', '..+..'],
  ['...+...', '...+...', '..+#+..', '++###++', '..+#+..', '...+...', '...+...'],
  ['....+....', '....+....', '....+....', '...+#+...', '++++#++++', '...+#+...', '....+....', '....+....', '....+....'],
];
export const drawSpark = (b: Buf, x: number, y: number, level: number) => {
  const sp = SPARK[Math.max(0, Math.min(SPARK.length - 1, level))];
  const r = (sp.length - 1) / 2;
  sp.forEach((row, j) => { for (let i = 0; i < row.length; i++) { const c = row[i]; if (c === '#') b.set(x - r + i, y - r + j, PAL.W9); else if (c === '+') b.set(x - r + i, y - r + j, (Math.abs(i - r) + Math.abs(j - r)) > 2 ? PAL.W6 : PAL.W8); } });
};

/** Paint the 2014 frame (EARLY-WEB 16) for global frame g. */
export const draw2014 = (b: Buf, g: number, opts: {settle?: boolean} = {}) => {
  // the world is wider than the frame: the end-of-shot pan travels right and down into it
  const w = new Buf(b.w + 170, b.h + 24, PAL.D1);
  hall(w);
  banner(w);
  throne(w);
  paperStack(w);
  drawLuap(w, g);
  dottedPath(w, g);
  const lift = masLift(g);
  const crowned = g >= T.crownLand;
  const mx = MAS_X, my = SEAT_Y - MAS_THRONE_SEAT - lift;
  const mimg = masThrone({crown: crowned, lid: 0, look: g >= T.crownLand + 2 ? 0 : -1, mouth: 'smile'});
  for (let j = 0; j < mimg.h; j++) for (let i = 0; i < mimg.w; i++) {
    let c = mimg.c[j * mimg.w + i];
    if (c < 0) continue;
    // the cast crown is gold; this one is paper (WHY COMBINATOR orange on white)
    if (j < 8 && i >= 16 && i <= 29) c = c === PAL.W7 ? PAL.P2 : c === PAL.W5 ? PAL.W5 : c;
    w.set(mx + i, my + j, c);
  }
  collarTips(w, mx, my, g);
  const ca = crownAt(g);
  if (ca) drawCrown(w, ca[0], ca[1]);
  // founders: lifting until he lands, then cheering
  const arms = g >= T.seat ? 'cheer' : 'lift';
  // their hands follow him up until he leaves them
  const fl = clamp(lift + 34, 0, 14);
  for (const f of FOUNDERS) drawFounder(w, f, arms, arms === 'lift' ? Math.round(fl / 2) * 2 : 0, g);
  // spring settle after the wipe, then the pan
  const dy = opts.settle === false ? 0 : g === T.y14 ? -3 : g === T.y14 + 1 ? 1 : 0; // the spring settle lands on the cut
  const [px, py] = panAt(g);
  shiftBuf(b, w, -px, dy - py);
  // highlight-only smear on the fast frames (the same whip language mdinner1 continues after the cut)
  const travel = px - panAt(g - 1)[0];
  if (travel > 10) {
    const src = b.clone();
    const bright = new Set([PAL.W9, PAL.W8, PAL.W7, PAL.P2, PAL.C5, PAL.C6, PAL.C7, PAL.W5]);
    for (let y = 0; y < b.h; y++) for (let x = 0; x < b.w; x++) {
      const c = src.c[y * b.w + x];
      if (!bright.has(c)) continue;
      const len = Math.round(travel * 0.6);
      for (let k = 1; k <= len; k++) if (bayer4(x + k, y) < 1 - k / len) b.set(x + k, y, c);
    }
  }
  // the glint rides the crown, drawn after the smear so it is the brightest point at the cut
  if (g >= T.glint) { const [gx, gy] = glintPos(); drawSpark(b, gx - px, gy - py + dy, [0, 1, 2, 3, 4, 3, 3, 4][Math.min(7, g - T.glint)]); }
  // slate (not in the world: it does not pan)
  eraStamp(b, '2014', g - T.y14, {text: PAL.P2, plate: PAL.N0, rule: PAL.W5}); // web-safe flat inks (no checker in type)
  applyPalette(b, ERA14);
  bannerInks(b, -px, dy - py);
};
