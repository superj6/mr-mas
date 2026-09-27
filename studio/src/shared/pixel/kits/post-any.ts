// MR. MAS — kit: THE IN-WORLD POST CARD for ANY poster (v3-art-a, 2026-09-27). New file; kits/post-card.ts (Act Four
// v5's UI-POST) is not edited. That kit's posters are a closed set (mas, gerg, rima, alyi, ttemme, staff) and its
// avatars are private, so a post from anyone else (Ep1 sc 6's NOLE post) can't go through it without editing the Act
// Four file. This is its drawPost, generalised to take the poster (name, handle, colours, a 14 x 14 avatar map) as data;
// the layout, the sizes ('phone' / 'notify' / 'popup'), the 3 held open steps and the heart row are the same lines, so a
// post from either kit reads as the same app. Engine/kit owner: fold this into post-card.ts (PostWho -> Poster) later.
//   drawPostFor(b, x, y, spec, o)   spec = {poster, text, ts?, hearts?, bio?}; o = post-card's PostDraw
//   postBoxFor(spec, size, w)       -> {w, h}
//   POSTERS_A1                      the cold open / Act One posters post-card lacks (NOLE), and the ones it has, as data
import {Buf, rect} from '../px';
import {PAL, stepColor} from '../palette';
import {pt, pw, pwrap} from './uitype';
import type {PostDraw, PostSize} from './post-card';

export interface PosterAny {
  name: string;
  handle: string;
  accent: number;
  bg: number;
  /** 14 x 14 face map (k keyline, b backdrop, h/H hair, s/S skin, x top), and its colours */
  avatar: string[];
  avatarPal: Record<string, number>;
  /** the 9 x 9 notify chip's initial: a 3 x 5 map */
  initial: string[];
}
export interface PostAnySpec { poster: PosterAny; text: string; ts?: string; hearts?: number; bio?: string }

const FACE = (hair: string[]) => [
  '....kkkkkk....', '..kkbbbbbbkk..', ...hair, 'kbbbsSSSSsbbbk', 'kbbbsSSSSsbbbk', 'kbbbbsSSsbbbbk', 'kbbbxxssxxbbbk', '.kbxxxxxxxxbk.', '.kbxxxxxxxxbk.', '..kkxxxxxxkk..', '....kkkkkk....'];
export const POSTERS_A1: Record<'nole', PosterAny> = {
  // NOLE: swept-back dark hair, a black tee, his rocket-red accent (parody name; cast/nole.ts's palette)
  nole: {
    name: 'Nole', handle: '@nole', accent: PAL.Q2, bg: PAL.Q1,
    avatar: FACE(['.kbhhhhhhhbbk.', '.khhhhhhhhhbk.', 'kbhhhsSSshhbbk', 'kbbhsSSSSsbbbk']),
    avatarPal: {k: PAL.N0, b: PAL.Q0, h: PAL.B0, s: PAL.S3, S: PAL.S4, x: PAL.N0},
    initial: ['##.', '#.#', '#.#', '#.#', '#.#'],
  },
};

const HEART5 = ['.#.#.', '#####', '#####', '.###.', '..#..'];
const heartIcon = (b: Buf, x: number, y: number, col: number) => HEART5.forEach((r, j) => { for (let i = 0; i < 5; i++) if (r[i] === '#') b.set(x + i, y + j, col); });
const replyIcon = (b: Buf, x: number, y: number, col: number) => { rect(x, y, 6, 4, b.ink(col)); rect(x + 1, y + 1, 4, 2, b.ink(PAL.N2)); b.set(x + 1, y + 4, col); b.set(x + 1, y + 5, col); };
const shareIcon = (b: Buf, x: number, y: number, col: number) => { rect(x + 2, y, 1, 5, b.ink(col)); b.set(x + 1, y + 1, col); b.set(x + 3, y + 1, col); rect(x, y + 5, 5, 1, b.ink(col)); };
const RING9 = ['..#####..', '.#######.', '#########', '#########', '#########', '#########', '#########', '.#######.', '..#####..'];
const PAD = {phone: 6, notify: 4, popup: 6};
const textW = (size: PostSize, w: number) => w - (size === 'notify' ? 20 : 30) - PAD[size];
export const postLinesFor = (spec: PostAnySpec, size: PostSize, w: number) => pwrap(spec.text, textW(size, w));
export const postBoxFor = (spec: PostAnySpec, size: PostSize, w = size === 'notify' ? 170 : 220) => {
  const n = postLinesFor(spec, size, w).length;
  return {w, h: size === 'notify' ? 17 + n * 10 : 21 + n * 10 + 13 + (spec.bio ? 9 : 0)};
};
export const drawPostFor = (b: Buf, x: number, y: number, spec: PostAnySpec, o: PostDraw) => {
  const {w, h} = postBoxFor(spec, o.size, o.w);
  const P = spec.poster;
  const k = o.k ?? 99;
  if (k < 0) return {w, h};
  const bg = o.bg ?? (o.size === 'notify' ? PAL.N3 : PAL.N2);
  const open = k >= 3 ? 1 : [0.2, 0.5, 0.8][k];
  const hh = Math.max(3, Math.round(h * open)), yy = y + Math.round((h - hh) / 2);
  if (o.size === 'popup') rect(x + 3, yy + 3, w, hh, b.ink(PAL.N0));
  rect(x - 1, yy - 1, w + 2, hh + 2, b.ink(PAL.N0));
  rect(x, yy, w, hh, b.ink(bg));
  rect(x, yy, w, 1, b.ink(o.size === 'notify' ? P.accent : stepColor(bg, 2)));
  if (o.size === 'popup') rect(x, yy + hh - 1, w, 1, b.ink(stepColor(bg, -1)));
  if (open < 1) return {w, h};
  const lines = postLinesFor(spec, o.size, w);
  if (o.size === 'notify') {
    RING9.forEach((r, j) => { for (let i = 0; i < 9; i++) if (r[i] === '#') b.set(x + 4 + i, y + 4 + j, P.bg); });
    P.initial.forEach((r, j) => { for (let i = 0; i < 3; i++) if (r[i] === '#') b.set(x + 7 + i, y + 6 + j, PAL.P2); });
    pt(b, P.name, x + 17, y + 5, PAL.P2);
    if (spec.ts) pt(b, spec.ts, x + w - 5 - pw(spec.ts), y + 5, PAL.N6);
    lines.forEach((l, i) => pt(b, l, x + 17, y + 16 + i * 10, PAL.P1));
    return {w, h};
  }
  P.avatar.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = P.avatarPal[r[i]]; if (c !== undefined) b.set(x + 6 + i, y + 6 + j, c); } });
  pt(b, P.name, x + 26, y + 6, PAL.P2);
  pt(b, P.handle, x + 30 + pw(P.name), y + 6, PAL.N6);
  if (spec.ts) pt(b, spec.ts, x + w - 6 - pw(spec.ts), y + 6, PAL.N6);
  const by = spec.bio ? 9 : 0;
  if (spec.bio) pt(b, spec.bio, x + 26, y + 15, PAL.N6);
  lines.forEach((l, i) => pt(b, l, x + 26, y + 19 + by + i * 10, PAL.P1));
  const fy = y + h - 11;
  rect(x + 26, fy - 3, w - 32, 1, b.ink(stepColor(bg, 1)));
  replyIcon(b, x + 26, fy + 1, PAL.N6);
  const hc = o.hearted ? PAL.R3 : PAL.N6;
  heartIcon(b, x + 56, fy + 1, hc);
  const n = o.hearts ?? spec.hearts;
  if (n !== undefined) pt(b, n >= 1000 ? `${Math.floor(n / 100) / 10}K` : String(n), x + 64, y + h - 10, o.hearted ? PAL.R3 : PAL.N6);
  shareIcon(b, x + 96, fy, PAL.N6);
  return {w, h};
};
