// MR. MAS — Ep2 v1 · act2 · 12.03's MEMORY: last September's party, Mas and Alyi's toast, in its own frame. An Ep2 COPY
// of Ep1's act3 partyToast (studio/src/episodes/ep01/pixel/act3/art/party.ts, which stays locked and is still imported
// by nothing here), made by the cleanup pass (2026-10-11) for two changes; everything else is Ep1's drawing, unaltered:
//   1. ALYI'S EYES. Ep1's two-shot draws his eyes with the portrait's deep sockets (a dark box round each eye), warmed a
//      rung (alyiWarmEyes) on the turn and squeezed into closed arcs (happyEyes) on the laugh; the arcs leave the socket
//      outline round them, and at 1080p the band read as glasses on him (bald with glasses is Tasya's design, P8). Act
//      Three's fixes gave his heads the calm head's eye band (act3/sets/f22.ts alyiWarmF and drawAlyiRoomF; the art's
//      alyi2 openWarmEyes): two short brows a row higher in his hair's lighter tone, a row of skin under them, open eyes
//      with a white and a pupil toward where he faces. Here the same band, on the same portrait (alyiSpeakPortrait, the
//      same local coordinates), before it is flipped or placed; turned to Mas the smile reaches it as in alyiWarmF (the
//      lower lids pushed up a row by the cheeks, a crease at the outer corner); on the laugh the eyes stay open and only
//      the mouth opens (Act Three's rule: the smile is the mouth's).
//   2. THE BANNER'S WORDS. Ep1's banner reads CHATGTP CAN NOW SEE, HEAR AND SPEAK (the Sep 2023 voice launch). Placed
//      between the reserved seat at today's voice launch and his leaving post, it let a viewer build a product reason for
//      Alyi's leaving (cheered the first one, skipped this one), which the show must never supply (W8, FIRM). The strip
//      and its strings stay (a party); its lettering is out of focus, a soft run of the ink with no letter in it, as a
//      remembered room's far wall is.
//   partyToast2(b, f, st)   the 2S, Ep1's PartyToastSt (k, toast, laugh, down)
//   partyMemory2(b, f, st)  [MEMORY] 12.03: it full frame, warm, the soft vignette (the fixes pass's art/sets/stage
//                           partyMemory, copied: the same vignette over this drawing)
import {Buf, rect, bayer, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor, lightness} from '../../../../../shared/pixel/palette';
import {pt, pw} from '../../../../ep01/pixel/kit';
import {putBust} from '../../../../../shared/pixel/rooms/bullpen-launch';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../../shared/pixel/cast/mas';
import type {MasPortraitState} from '../../../../../shared/pixel/cast/mas';
import {alyiSpeakPortrait, ALYI_SPEAK_DEFAULT} from '../../../../../shared/pixel/cast/alyi-speak';
import type {AlyiSpeakState} from '../../../../../shared/pixel/cast/alyi-speak';
import {drawCollarsPortrait} from '../../../../../shared/pixel/cast/mas-collars';
import {faceKey} from '../../../../../shared/pixel/kits/face-light';
import type {Img} from '../../../../../shared/pixel/figure';
import {bullpenWindow} from '../../../../ep01/pixel/act1/art/v35';

const RH = 203;
const TR = 0x1000000;

// ------------------------------------------------------------------ arms, hands and Mas's happy eyes (Ep1's, copied)
type Sleeve = [number, number, number, number];
const HOODIE: Sleeve = [PAL.G1, PAL.G2, PAL.G3, PAL.W4];
const capsule = (b: Buf, x0: number, y0: number, x1: number, y1: number, r: number, sl: Sleeve) => {
  const dx = x1 - x0, dy = y1 - y0, L2 = Math.max(1, dx * dx + dy * dy);
  for (let y = Math.floor(Math.min(y0, y1) - r - 1); y <= Math.max(y0, y1) + r + 1; y++) for (let x = Math.floor(Math.min(x0, x1) - r - 1); x <= Math.max(x0, x1) + r + 1; x++) {
    if (y < 0 || y >= RH || x < 0 || x >= 480) continue;
    const t = clamp(((x - x0) * dx + (y - y0) * dy) / L2, 0, 1), cx = x0 + dx * t, cy = y0 + dy * t, d = Math.hypot(x - cx, y - cy);
    if (d > r) continue;
    const nx = (x - cx) / Math.max(0.5, d), ny = (y - cy) / Math.max(0.5, d), lit = -0.55 * nx - 0.83 * ny;
    b.set(x, y, d > r - 1 && lit > 0.35 ? sl[3] : lit > 0.3 ? sl[2] : lit < -0.35 ? sl[0] : sl[1]);
  }
};
const armTo = (b: Buf, sh: [number, number], el: [number, number], wr: [number, number], sl: Sleeve) => {
  capsule(b, sh[0], sh[1], el[0], el[1], 7, sl);
  capsule(b, el[0], el[1], wr[0], wr[1], 6, sl);
  const t = 0.82, cx = el[0] + (wr[0] - el[0]) * t, cy = el[1] + (wr[1] - el[1]) * t;
  capsule(b, cx, cy, wr[0], wr[1], 6, [sl[1], sl[2], stepColor(sl[2], 1), sl[3]]);
};
const grip = (b: Buf, x: number, y: number, w: number, side: -1 | 1) => {
  for (let q = 0; q < 4; q++) {
    const yy = y + q * 3, x0 = x - 1 + (q === 3 ? 1 : 0), x1 = x + w + (q === 3 ? -1 : 1);
    for (let xx = x0; xx <= x1; xx++) { b.set(xx, yy, PAL.S5); b.set(xx, yy + 1, PAL.S4); b.set(xx, yy + 2, PAL.S2); }
    b.set(side < 0 ? x1 : x0, yy + 1, PAL.S3);
  }
  const tx = side < 0 ? x - 3 : x + w - 1;
  for (let j = 0; j < 8; j++) for (let i = 0; i < 5; i++) if (Math.hypot((i - 2) / 2.6, (j - 3.5) / 4.2) < 1) b.set(tx + i, y - 4 + j, j < 2 ? PAL.S5 : PAL.S4);
  for (let j = 0; j < 12; j++) for (let i = 0; i < 7; i++) b.set(side < 0 ? x - 7 + i : x + w + 1 + i, y + j, i === (side < 0 ? 0 : 6) ? PAL.S2 : j < 2 ? PAL.S5 : PAL.S4);
};
/** Mas's happy eyes on the laugh (his crinkle; his head only) */
const happyEyes = (b: Buf, px: number, py: number, band: [number, number, number, number], eyes: Array<[number, number, number]>, outer: number) => {
  const [bx0, bx1, by0, by1] = band;
  for (let x = bx0; x <= bx1; x++) { const skin = b.get(px + x, py + by1 + 2); for (let y = by0; y <= by1; y++) b.set(px + x, py + y, skin); }
  for (const [cx, cy, w] of eyes) {
    const h = w / 2;
    for (let i = -Math.floor(h); i <= Math.floor(h); i++) { const yy = cy + Math.round(Math.pow(Math.abs(i) / h, 2) * 2); b.set(px + cx + i, py + yy, PAL.N1); b.set(px + cx + i, py + yy + 1, PAL.S3); }
    for (let i = -Math.floor(h) + 1; i < Math.floor(h); i++) b.set(px + cx + i, py + cy + 4, PAL.S5);
  }
  b.set(px + outer, py + eyes[1][1] - 1, PAL.S2); b.set(px + outer + 1, py + eyes[1][1] - 2, PAL.S2); b.set(px + outer, py + eyes[1][1] + 3, PAL.S2);
};
const MAS_EYES = {band: [36, 61, 44, 49] as [number, number, number, number], eyes: [[41, 46, 7], [55, 46, 9]] as Array<[number, number, number]>, outer: 61};

// ------------------------------------------------------------------ Alyi's head with the calm eye band (change 1)
/** the portrait's eye band (local): the box the sockets live in */
const ALYI_BAND: [number, number, number, number] = [34, 60, 45, 50];
/** the calm head's eyes (art/cast/alyi2 openWarmEyes, copied): the sockets' dark goes (all but the silhouette's own
 *  outline), each eye a white and an iris toward where he faces, the brows soft, a row higher, in his hair's lighter
 *  tone, a row of skin under them */
const openWarmEyes = (b: Buf) => {
  const [bx0, bx1, by0, by1] = ALYI_BAND;
  const edge = (x: number, y: number) => b.get(x - 1, y) === TR || b.get(x + 1, y) === TR || b.get(x, y - 1) === TR || b.get(x, y + 1) === TR;
  for (let x = bx0; x <= bx1 + 6; x++) { const skin = b.get(x, by1 + 4); for (let y = by0 - 3; y <= by1 + 1; y++) { const c = b.get(x, y); if (c !== TR && c !== PAL.W8 && !(c === PAL.S0 && edge(x, y))) b.set(x, y, skin); } }
  const near = ['..LLLLLLL..', '.LwwIIIgw..', '..wwIIIww..', '...kkkkk...'];
  const far = ['.LLLL.', 'LwIIg.', '.kkk..'];
  const P0: Record<string, number> = {L: PAL.N0, w: PAL.P1, I: PAL.B2, g: PAL.W8, k: PAL.S3};
  const st = (x: number, y: number, rows: string[]) => rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const v = P0[r[i]]; if (v !== undefined) b.set(x + i, y + j, v); } });
  st(49, 46, near); st(38, 47, far);
  b.set(54, 47, PAL.N0); b.set(53, 48, PAL.N0); b.set(40, 48, PAL.N0);
  for (let x = 48; x <= 61; x++) b.set(x, x < 52 || x > 58 ? 43 : 42, PAL.B1);
  for (let x = 37; x <= 43; x++) b.set(x, x < 40 ? 44 : 43, PAL.B1);
};
/** the smile reaching the eyes (act3 alyiWarmF, copied): each eye's lowest open row becomes the cheek's lit skin (the
 *  lower lid pushed up), the lid crease under it a rung down; a short crease out from the near eye's outer corner */
const smileEyes = (b: Buf) => {
  const skin = b.get(56, 54) !== TR ? b.get(56, 54) : PAL.S4, crease = stepColor(skin, -1);
  for (let x = 51; x <= 57; x++) { b.set(x, 48, skin); b.set(x, 49, x > 51 && x < 57 ? crease : skin); }
  for (let x = 38; x <= 42; x++) b.set(x, 49, skin);
  for (let x = 39; x <= 41; x++) b.set(x, 50, crease);
  b.set(59, 47, crease); b.set(60, 48, crease); b.set(59, 49, crease);
};
/** Alyi's open laugh (Ep1's, local): the teeth, the dark of the mouth, its corners up */
const alyiLaugh = (b: Buf, open: number) => {
  const y0 = 72;
  for (let x = 40; x <= 49; x++) b.set(x, y0, PAL.P2);
  for (let y = 1; y <= open; y++) for (let x = 39 + (y === open ? 1 : 0); x <= 50 - (y === open ? 1 : 0); x++) b.set(x, y0 + y, PAL.N1);
  for (let x = 41; x <= 48; x++) b.set(x, y0 + open + 1, PAL.S3);
  b.set(38, y0 - 1, PAL.S2); b.set(51, y0 - 1, PAL.S2);
};
const HEADS = new Map<string, Img>();
/** his portrait with the calm eye band; mood 'room' (turned away to the room), 'smile' (turned to Mas), 'laugh' */
const alyiHead = (as: AlyiSpeakState, mood: 'room' | 'smile' | 'laugh', open: number): Img => {
  const key = `${JSON.stringify(as)}|${mood}|${open}`;
  const hit = HEADS.get(key); if (hit) return hit;
  const im = alyiSpeakPortrait(as);
  const t = new Buf(im.w, im.h, TR);
  for (let i = 0; i < im.w * im.h; i++) if (im.c[i] >= 0) t.c[i] = im.c[i];
  openWarmEyes(t);
  if (mood !== 'room') smileEyes(t);
  if (mood === 'laugh') alyiLaugh(t, open);
  const out: Img = {w: im.w, h: im.h, c: new Int32Array(im.w * im.h).fill(-1)};
  for (let i = 0; i < im.w * im.h; i++) if (t.c[i] !== TR) out.c[i] = t.c[i];
  if (HEADS.size > 64) HEADS.clear();
  HEADS.set(key, out);
  return out;
};

// ------------------------------------------------------------------ the banner, its words out of focus (change 2)
/** the defocus: each pixel's share of ink over a 13 x 7 window; the core a soft grey-blue, its fringe the paper a rung down */
const BLUR = {rx: 6, ry: 3, lo: 0.12, hi: 0.28, core: PAL.G5, edge: PAL.P1};
/** the paper strip on its two strings (Ep1's geometry and sway), the lettering out of focus: the words' own coverage
 *  spread over BLUR's window, in two flat tones, no letter left in it */
const banner = (b: Buf, k: number) => {
  const s = 'CHATGTP CAN NOW SEE, HEAR AND SPEAK', w = pw(s) + 16, x = 14, y = 8;
  const sway = Math.floor(k / 12) % 2;
  const sagAt = (i: number) => Math.round(Math.sin((i / w) * Math.PI) * 3) + (i > w / 2 ? sway : 0);
  for (let i = 0; i < w; i++) { const sag = sagAt(i); for (let j = 0; j < 13; j++) b.set(x + i, y + sag + j, j === 0 ? PAL.P1 : j === 12 ? PAL.P0 : PAL.P2); }
  const t = new Buf(w, 13, TR); pt(t, s, 8, 3, PAL.C3);
  const ink = (i: number, j: number) => (i >= 0 && j >= 0 && i < w && j < 13 && t.c[j * w + i] !== TR ? 1 : 0);
  for (let j = 1; j < 12; j++) for (let i = 0; i < w; i++) {
    let n = 0;
    for (let dj = -BLUR.ry; dj <= BLUR.ry; dj++) for (let di = -BLUR.rx; di <= BLUR.rx; di++) n += ink(i + di, j + dj);
    const cov = n / ((2 * BLUR.rx + 1) * (2 * BLUR.ry + 1));
    if (cov < BLUR.lo) continue;
    b.set(x + i, y + sagAt(i) + j, cov >= BLUR.hi ? BLUR.core : BLUR.edge);
  }
  for (const sx of [x, x + w - 1]) for (let j = 0; j < y + 2; j++) b.set(sx, j, PAL.N4);
};

// ------------------------------------------------------------------ the 2S
const bigGlass = (b: Buf, x: number, y: number) => {
  for (let j = 0; j < 24; j++) for (let i = 0; i < 14; i++) {
    const edge = i === 0 || i === 13 || j === 23;
    b.set(x + i, y + j, edge ? (i === 0 ? PAL.G6 : PAL.G4) : j < 7 ? stepColor(b.get(x + i, y + j), 1) : i < 3 ? PAL.C7 : PAL.C5);
  }
  rect(x + 1, y + 7, 12, 1, b.ink(PAL.C8)); b.set(x + 3, y + 2, PAL.W9); b.set(x + 3, y + 3, PAL.W8);
};
const paperCup = (b: Buf, x: number, y: number, w: number, h: number) => {
  for (let j = 0; j < h; j++) { const inset = Math.round(j * 0.12); for (let i = inset; i < w - inset; i++) b.set(x + i, y + j, j === 0 ? PAL.P1 : j > 3 && j < 7 ? PAL.C5 : i === inset ? PAL.P0 : PAL.P2); }
};
const PARTY_GLASS_OUT = 196;
export interface PartyToastSt { k: number; toast: number; laugh: number; down: number }
/** Ep1's partyToast with the two changes above; every other pixel as Ep1 draws it */
export const partyToast2 = (b: Buf, f: number, st: PartyToastSt) => {
  const {k} = st;
  bullpenWindow(b, false, -20);
  banner(b, 0);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) if (bayer(x, y) < 0.5) { const c = b.get(x, y); b.set(x, y, stepColor(c, lightness(c) > 0.35 ? -1 : lightness(c) < 0.1 ? 1 : 0)); }
  const laughing = k >= st.laugh && k < st.down;
  const bob = laughing ? [0, 1, 2, 1][Math.floor((k - st.laugh) / 5) % 4] : 0;
  const warmFrom = st.toast - 8;
  const mOpen = laughing && Math.floor((k - st.laugh) / 4) % 3 !== 2;
  const ms: MasPortraitState = {...MAS_PORTRAIT_DEFAULT, light: 'warm', look: 0, mouth: laughing ? (mOpen ? 'A' : 'smile') : k >= warmFrom ? 'smile' : 'rest'};
  const mt = new Buf(480, RH, TR);
  putBust(mt, masPortrait(ms), 70, 40 + bob);
  drawCollarsPortrait(mt, 70, 40 + bob, 3, {head: '34', light: 'warm', style: 'v31'});
  if (laughing) happyEyes(mt, 70, 40 + bob, MAS_EYES.band, MAS_EYES.eyes, MAS_EYES.outer);
  for (let y = 0; y < RH; y++) for (let x = 70; x < 182; x++) { const v = mt.c[y * 480 + x]; if (v !== TR) b.set(251 - x, y, v); }
  faceKey(b, 70, 40, 182, 140, 1, 1);
  // ALYI: turned to the room (flipped), then to Mas as the toast comes, smiling; the laugh opens his mouth, his eyes open
  const turned = k >= warmFrom;
  const lean = laughing ? (k < st.laugh + 3 ? 2 : 4) : 0;
  const ax0 = 262 - lean, ay0 = 42 + (bob === 1 ? 1 : 0) + (lean ? 1 : 0);
  const as: AlyiSpeakState = {...ALYI_SPEAK_DEFAULT, t: f, mouth: turned ? 'smile' : 'rest', eyes: 'open'};
  const head = alyiHead(as, laughing ? 'laugh' : turned ? 'smile' : 'room', laughing ? (Math.floor((k - st.laugh) / 4) % 3 === 2 ? 2 : 3) : 0);
  const at = new Buf(480, RH, TR);
  putBust(at, head, ax0, ay0, {flip: !turned});
  for (let i = 0; i < 480 * RH; i++) if (at.c[i] !== TR) b.c[i] = at.c[i];
  faceKey(b, ax0, ay0, ax0 + 112, ay0 + 100, 2, -1);
  const top = 186;
  for (let y = top; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y === top ? PAL.W4 : y < top + 3 ? PAL.D3 : bayer(x, y) < 0.3 ? PAL.D1 : PAL.D2);
  for (const cx of [26, 380, 420]) { rect(cx, top - 9, 6, 9, b.ink(PAL.P2)); rect(cx, top - 6, 6, 2, b.ink(PAL.C5)); }
  rect(300, top - 4, 60, 4, b.ink(PAL.D4)); rect(300, top - 4, 60, 1, b.ink(PAL.P1));
  const sw = at.get(ax0 + 30, ay0 + 122), ALYI_SW: Sleeve = [stepColor(sw, -1), sw, stepColor(sw, 1), PAL.W3];
  const reach = k < st.toast - 8 ? 0 : k < st.toast - 4 ? 1 : k < st.toast + 10 ? 2 : 1;
  const down = k >= st.down ? Math.min(3, Math.floor((k - st.down) / 3) + 1) : 0;
  const gx = down ? PARTY_GLASS_OUT : [PARTY_GLASS_OUT, 208, 220][reach], gy = down ? [0, 128, 160, 206][down] : [150, 116, 104][reach];
  const masSh: [number, number] = [172, 146 + bob];
  if (gy < RH) { armTo(b, masSh, [184, 178], [gx - 4, gy + 16], HOODIE); bigGlass(b, gx, gy); grip(b, gx, gy + 11, 14, -1); }
  const cupDown = k >= st.toast + 10 ? Math.min(3, Math.floor((k - st.toast - 10) / 3)) : 0;
  if (cupDown < 3 && !(laughing && k >= st.laugh + 2)) {
    const cx = [292, 250, 236][reach], cy = [150, 116, 106][reach] + [0, 16, 40][cupDown];
    armTo(b, [ax0 + 8, ay0 + 106], [ax0 + 2, 178], [cx + 16, cy + 14], ALYI_SW);
    paperCup(b, cx, cy, 13, 20);
    grip(b, cx, cy + 9, 13, 1);
  }
  if (k >= st.toast && k < st.toast + 4) { const cx = 235, cy = 110; b.set(cx, cy, PAL.W9); for (const [dx, dy] of [[-2, 0], [2, 0], [0, -2], [0, 2]] as Array<[number, number]>) b.set(cx + dx, cy + dy, PAL.W7); }
  if (k >= st.laugh + 5 && k < st.down + 6) {
    const hx = 178, hy = 134 + bob;
    armTo(b, [ax0 + 8, ay0 + 104], [226, 170], [hx + 14, hy + 6], ALYI_SW);
    for (let j = 0; j < 11; j++) for (let i = 0; i < 20; i++) if (Math.hypot((i - 10) / 10, (j - 5) / 5.5) < 1) b.set(hx + i - 4, hy + j - 2, j < 2 ? PAL.S5 : i < 3 ? PAL.S3 : PAL.S4);
    for (let q = 0; q < 4; q++) for (let j = 0; j < 9; j++) { const X = hx - 6 + q * 4, Y = hy + 6 + j - (q === 0 ? 1 : 0); b.set(X, Y, PAL.S4); b.set(X + 1, Y, PAL.S3); if (j === 8) b.set(X, Y, PAL.S2); }
  }
};

// ------------------------------------------------------------------ [MEMORY] 12.03
const MEM = new Map<number, Buf>();
/** the party in its own frame: partyToast2 on its own clock (its toast at 20, the laugh at st.laugh), the soft
 *  vignette of art/sets/stage partyMemory (the corners a rung and two rungs down in dither, the faces untouched) */
export const partyMemory2 = (b: Buf, f: number, st: {ks: number; laugh?: number}) => {
  void f;
  const key = st.ks * 1000 + (st.laugh ?? 999);
  let m = MEM.get(key);
  if (!m) {
    m = new Buf(480, 270, PAL.N0);
    partyToast2(m, st.ks, {k: st.ks, toast: 20, laugh: st.laugh ?? 999, down: 999});
    for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
      const r = Math.hypot((x - 240) / 262, (y - RH / 2) / 132);
      if (r < 0.8) continue;
      const c = m.get(x, y), d = r > 1.0 ? (bayer(x, y) < (r - 1.0) / 0.12 ? 2 : 1) : bayer(x, y) < (r - 0.8) / 0.2 ? 1 : 0;
      if (d) m.set(x, y, stepColor(c, -d));
    }
    if (MEM.size > 160) MEM.clear();
    MEM.set(key, m);
  }
  b.c.set(m.c.subarray(0, 480 * RH));
};
