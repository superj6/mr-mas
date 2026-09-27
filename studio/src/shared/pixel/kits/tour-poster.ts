// MR. MAS — kit: THE REGULATE-ME TOUR poster (Ep1 sc 16; new file, owned by the `v3-art-b` pass). ONE held poster (the
// v3 cut C7: one surface, the stamps come to it, Mas's inner voice carries the flip), wheat-pasted on a brick wall and
// filling the frame: `MAS MANALT: THE REGULATE-ME TOUR`, a duotone photo of him smiling one pixel, a column of cities,
// and the fine-print egg `ALSO APPEARING: XEL`. The items land on it in order (the beat plan's 16.01), each its own
// state, all held drawings:
//   strip      a newsprint strip slapped across under his photo, a review quote's format:
//              `"…cease operating…" — MAS MANALT, ON THE EU'S AI RULES` (the beat plan's wording)
//   cancelled  a red `CANCELLED` stamp across the EU row
//   post       his post popping over the poster, in his lowercase: `…no plans to leave` (kits/post-card.ts)
//   un         `UN-CANCELLED` landing over the first stamp
//   added      the blank last slot stamping itself `ADDED DUE TO POPULAR DEMAND`
// (No "blackmail" cuff and no NOTERB plate: cut in the beat plan.) Each stamp lands in 2 held steps (`k`: 0 the
// stamp's ghost 1 px up and a rung light, then set).
//   drawTourPoster(b, f, st)        [GFX] the poster over the frame, with its items
//   drawPosterSmile(b, f, st)       [GFX·detail] the cut-in on the poster's photo of him: the one-pixel smile, held
//   TOUR_CITIES                     the column (flavour: the cities of the real spring-2023 tour, no dates asserted)
import {Buf, rect, hash, bayer} from '../px';
import {PAL, stepColor, lightness} from '../palette';
import {text, textWidth, bigText, bigTextWidth} from '../font';
import {tiny, tinyWidth} from '../rooms/kit-b';
import {pt, pw} from './uitype';
import {drawPost, postBox} from './post-card';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../cast/mas';

const RH = 203;
export const TOUR_CITIES = ['TORONTO', 'LAGOS', 'MADRID', 'LONDON', 'EU', 'PARIS', 'TEL AVIV', 'NEW DELHI', ''];
export const POSTER = {x: 100, y: 0, w: 280, h: 203, photo: {x: 12, y: 50, w: 96, h: 104}, list: {x: 128, y: 52, row: 10}};
export interface TourPosterState {
  strip?: boolean;
  /** each stamp: k frames since it landed (null = not yet) */
  cancelled?: number | null;
  post?: number | null;
  un?: number | null;
  added?: number | null;
}
/** a rubber stamp at poster scale: a ruled box, the word, the ink broken where the rubber missed; k < 2 = landing */
const posterStamp = (b: Buf, x: number, y: number, s: string, k: number, seed: number, big = false) => {
  const w = (big ? bigTextWidth(s) : textWidth(s)) + 10, h = big ? 22 : 13;
  const dy = k < 1 ? -1 : 0;
  const col = k < 1 ? PAL.R3 : PAL.R2;
  const tmp = new Buf(w, h, 0);
  if (big) bigText(tmp, s, 5, 4, 1); else text(tmp, s, 5, 3, 1);
  for (let i = 0; i < w; i++) { tmp.set(i, 0, 1); tmp.set(i, h - 1, 1); }
  for (let j = 0; j < h; j++) { tmp.set(0, j, 1); tmp.set(w - 1, j, 1); }
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if (tmp.get(i, j) && hash(i >> 1, j >> 1, seed) > 0.1) b.set(x + i, y + j + dy + Math.round(-i / 30), col);
  return w;
};
/** the photo: his portrait (the near-front head, the tiny closed smile) printed in duotone, black and a warm cream */
const photoCache: {buf: Buf | null} = {buf: null};
const duotone = (): Buf => {
  if (photoCache.buf) return photoCache.buf;
  const {w, h} = POSTER.photo;
  const pb = new Buf(w, h, PAL.W7);
  const im = masPortrait({...MAS_PORTRAIT_DEFAULT, head: 'front', mouth: 'smile', light: 'warm', look: 0});
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const v = im.c[(j + 6) * im.w + (i + 8)];
    if (v === undefined || v < 0) { pb.set(i, j, bayer(i, j) < 0.25 ? PAL.W5 : PAL.W7); continue; }
    const L = lightness(v);
    // the print's two inks: black and the poster's cream; a cluster screen between them
    const t = Math.min(1, Math.max(0, (L - 0.18) / 0.5));
    pb.set(i, j, t > 0.8 ? PAL.P2 : t > bayer(i >> 1, j >> 1) ? PAL.P1 : t > 0.12 ? PAL.D2 : PAL.N0);
  }
  photoCache.buf = pb;
  return pb;
};
export const drawTourPoster = (b: Buf, f: number, st: TourPosterState = {}) => {
  // the wall: soot-dark brick, the poster wheat-pasted flat on it (its edges a little lifted, a paste shine)
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const row = Math.floor(y / 7), off = row % 2 ? 11 : 0;
    const mortar = y % 7 === 0 || (x + off) % 22 === 0;
    b.set(x, y, mortar ? PAL.N2 : hash((x + off) / 22 | 0, row, 81) < 0.3 ? PAL.W1 : PAL.D1);
  }
  const {x: X, y: Y, w: W, h: H} = POSTER;
  rect(X + 3, Y + 3, W, H, b.ink(PAL.N0));
  // the poster: deep navy, a gold rule frame, the big title in cream and gold
  for (let y = Y; y < Y + H; y++) for (let x = X; x < X + W; x++) b.set(x, y, bayer(x, y) < 0.12 ? PAL.N3 : PAL.N2);
  rect(X + 4, Y + 4, W - 8, 1, b.ink(PAL.W6)); rect(X + 4, Y + H - 5, W - 8, 1, b.ink(PAL.W6)); rect(X + 4, Y + 4, 1, H - 8, b.ink(PAL.W6)); rect(X + W - 5, Y + 4, 1, H - 8, b.ink(PAL.W6));
  const t1 = 'MAS MANALT:', t2 = 'THE REGULATE-ME TOUR';
  bigText(b, t1, X + Math.round((W - bigTextWidth(t1)) / 2), Y + 10, PAL.P2, {shadow: PAL.N0});
  bigText(b, t2, X + Math.round((W - bigTextWidth(t2)) / 2), Y + 28, PAL.W7, {shadow: PAL.N0});
  // the photo, in its thin cream frame
  const P = POSTER.photo, pb = duotone();
  rect(X + P.x - 2, Y + P.y - 2, P.w + 4, P.h + 4, b.ink(PAL.P1));
  for (let j = 0; j < P.h; j++) for (let i = 0; i < P.w; i++) b.set(X + P.x + i, Y + P.y + j, pb.get(i, j));
  // the column of cities: a gold bullet and a city per row; the last slot blank (a dotted line)
  const L = POSTER.list;
  text(b, 'WORLD TOUR 2023', X + L.x, Y + L.y - 2, PAL.W6);
  TOUR_CITIES.forEach((c, i) => {
    const y = Y + L.y + 10 + i * L.row;
    b.set(X + L.x, y + 3, PAL.W6); b.set(X + L.x + 1, y + 3, PAL.W6);
    if (c) text(b, c, X + L.x + 6, y, c === 'EU' ? PAL.P2 : PAL.P1);
    else for (let k = 0; k < 90; k += 3) b.set(X + L.x + 6 + k, y + 6, PAL.G3);
  });
  // the fine print: the tour's promoter line, and the egg
  tiny(b, 'ALSO APPEARING: XEL', X + W - 8 - tinyWidth('ALSO APPEARING: XEL'), Y + H - 12, PAL.G4);
  tiny(b, 'ONE NIGHT ONLY IN EVERY CITY', X + 10, Y + H - 12, PAL.G3);
  const euY = Y + L.y + 10 + TOUR_CITIES.indexOf('EU') * L.row;
  // ITEM 1: the newsprint strip (a review quote's format), slapped across under the photo
  if (st.strip) {
    const sx = X + 6, sy = Y + 160, sw = W - 12, sh = 24;
    rect(sx + 2, sy + 2, sw, sh, b.ink(PAL.N0));
    for (let y = sy; y < sy + sh; y++) for (let x = sx; x < sx + sw; x++) b.set(x, y, bayer(x, y) < 0.1 ? PAL.P0 : PAL.P1);
    rect(sx, sy, sw, 1, b.ink(PAL.P2));
    const q = '"…cease operating…"', c2 = "— MAS MANALT, ON THE EU'S AI RULES";
    pt(b, q, sx + Math.round((sw - pw(q)) / 2), sy + 3, PAL.N1);
    pt(b, c2, sx + Math.round((sw - pw(c2)) / 2), sy + 13, PAL.N3);
  }
  // ITEM 1b: the red CANCELLED stamp across the EU row
  if (st.cancelled !== undefined && st.cancelled !== null) posterStamp(b, X + L.x + 2, euY - 3, 'CANCELLED', st.cancelled, 13);
  // ITEM 3: UN-CANCELLED over the first stamp, a few px lower and askew
  if (st.un !== undefined && st.un !== null) posterStamp(b, X + W - 8 - bigTextWidth('UN-CANCELLED') - 10, euY + 7, 'UN-CANCELLED', st.un, 29, true);
  // ITEM 4: the last slot stamps itself
  if (st.added !== undefined && st.added !== null) {
    const ly = Y + L.y + 10 + (TOUR_CITIES.length - 1) * L.row;
    const w = textWidth('ADDED DUE TO') + 10;
    const k = st.added;
    const col = k < 1 ? PAL.R3 : PAL.R2, dy = k < 1 ? -1 : 0;
    rect(X + L.x + 4, ly - 4 + dy, w + 22, 22, b.ink(PAL.N2));
    for (let i = 0; i < w + 22; i++) { b.set(X + L.x + 4 + i, ly - 4 + dy, col); b.set(X + L.x + 4 + i, ly + 17 + dy, col); }
    for (let j = 0; j < 22; j++) { b.set(X + L.x + 4, ly - 4 + dy + j, col); b.set(X + L.x + 25 + w, ly - 4 + dy + j, col); }
    text(b, 'ADDED DUE TO', X + L.x + 9, ly - 1 + dy, col);
    text(b, 'POPULAR DEMAND', X + L.x + 9, ly + 8 + dy, col);
  }
  // ITEM 2: his post pops over the poster (the post card kit's notify size, whole from k 3)
  if (st.post !== undefined && st.post !== null) {
    const spec = {who: 'mas' as const, text: '…no plans to leave', ts: 'MAY 26'};
    const w = 176, bx = postBox(spec, 'phone', w);
    drawPost(b, X + W - w + 40, Y + 104, spec, {size: 'popup', w, k: Math.min(3, st.post)});
    void bx;
  }
};
/** the cut-in on the poster's photo: his one-pixel smile (the photo's own print, at 2x: a poster's halftone, close) */
export const drawPosterSmile = (b: Buf, f: number) => {
  const pb = duotone();
  // the crop: his face (the photo's pixels at an integer 2x: a printed poster seen close)
  const cx = 22, cy = 12, cw = 60, ch = 60;
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, PAL.N2);
  const ox = 240 - cw, oy = Math.round((RH - ch * 2) / 2) + 12;
  for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) rect(ox + i * 2, oy + j * 2, 2, 2, b.ink(pb.get(cx + i, cy + j)));
  // the paper's grain over it, and the poster's gold rule at the crop's edge
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) if (hash(x, y, 91) < 0.03) b.set(x, y, stepColor(b.get(x, y), 1));
  void f;
};
void stepColor;
