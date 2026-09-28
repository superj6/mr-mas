// MR. MAS — Ep1 v3.2 · Act Four art (the v3-shots-act4 pass; NEW, additive, opt-in): the v3.2 states the shot pass owns
// (script-v32-notes.md §4 and §10.7; art-b.md §7.2: "the Act Four shot pass's, as states of v5's modules"). Nothing
// shared is edited: each is a drawing over the existing one.
//   phonePickup(fb, t)          S1.12: "He picks up his phone." His hand and phone rise into frame in silhouette in front
//                               of the laptop's lit call (the shoulder's language: black, the red neon on its right
//                               edge), the screen's light on its top edge, in held steps, then held (t = frames since)
//   blogTyped(s, n, k)          S3.03: the post typing itself in its own editor (kits/blog-draft): over the full draft,
//                               everything past the first n characters is the page again (the paper colour, in the
//                               editor's own line boxes), and the caret sits at the typing point
//   blogSpeakerWindow(s, f, st) S3.03: the editor's corner call window in its speaker layout: NELEH large (her own tile,
//                               cast/neleh drawNelehTile, her lips moving as she reads, silent), the other three small
//                               beside her (the kit's own minis); the kit draws the four as minis, where no mouth reads
//   rimaTileLabel(s, t)         S3.04: Rima's tile label in two rows, `RIMA TAMURI` over `INTERIM CEO` (the world
//                               carries her new role: script-v32-notes §10.3 "her tile's own label"); the tile is too
//                               narrow for the one-line `RIMA TAMURI · INTERIM CEO`
//   heartCount(fb, n, scr, tick) S5.03: the app's heart count on the phone's screen, in the app's own bar (406 → 407 → 406);
//                               v3.3: each change ticks (the number rolls, the heart beats), tick = {prev, k since the change}
import {Buf, rect} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {text, textWidth} from '../../../../../shared/pixel/font';
import {pt, pw, bpt, bpw, bpwrap} from '../../../../../shared/pixel/kits/uitype';
import {BLOG} from '../../../../../shared/pixel/kits/blog-draft';
import {callChrome, nameChip, micIcon, speakingRing, camOffBg, CALL_BAR_H} from '../../../../../shared/pixel/kits/callgrid';
import type {TileRect} from '../../../../../shared/pixel/kits/callgrid';
import {boardLayout} from '../../../../../shared/pixel/kits/call-boardside';
import {drawNelehTile} from '../../../../../shared/pixel/cast/neleh';
import {drawAlyiMini} from '../../../../../shared/pixel/cast/alyi-speak';
import {drawMadaMini, drawSpinner} from '../../../../../shared/pixel/cast/mada';
import type {Viseme} from '../../../../../shared/pixel/cast/talk';

const RH = 203;

// ================================================================== S1.12: he picks up his phone
/** his hand and phone rising into frame in silhouette, in front of the laptop's lit call (the shoulder's language: black
 *  with the Strip's red neon on its right edge), the screen's cyan light on its top edge (it faces him). Held steps: the
 *  top clears the frame's foot, then two more steps up, then it holds, in his hand, until the cut */
export const phonePickup = (fb: Buf, t: number | null) => {
  if (t === null || t < 0) return;
  const top = [186, 160, 138, 124][Math.min(3, Math.floor(t / 3))];
  const x0 = 84, w = 30, h = 56; // the phone, tilted back toward him: a slab a little narrower at its top
  const mask = new Uint8Array(480 * RH);
  const set = (x: number, y: number) => { if (x >= 0 && x < 480 && y >= 0 && y < RH) mask[y * 480 + x] = 1; };
  for (let j = 0; j < h; j++) { const inset = j < 4 ? 4 - j : 0, sl = Math.round(j * 0.12); for (let i = inset; i < w - inset; i++) set(x0 + i - sl, top + j); }
  // his hand: the fingers wrapped round the phone's left edge (three knuckle bumps), the palm and wrist down out of frame
  for (let k = 0; k < 3; k++) for (let j = -4; j <= 4; j++) for (let i = -4; i <= 4; i++) if (i * i + j * j <= 16) set(x0 - 3 + i - Math.round((24 + k * 9) * 0.12), top + 24 + k * 9 + j);
  for (let y = top + 34; y < RH; y++) { const hw = 16 + Math.round((y - top - 34) * 0.25); for (let i = -hw; i <= 6; i++) set(x0 + 4 + i - Math.round((y - top) * 0.12), y); }
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    if (!mask[y * 480 + x]) continue;
    const edgeR = x + 1 < 480 && !mask[y * 480 + x + 1], edgeT = y > 0 && !mask[(y - 1) * 480 + x];
    const onTop = y < top + 5 && x >= x0 && x < x0 + w; // the slab's top edge only (not the knuckles)
    fb.set(x, y, edgeT && onTop ? PAL.C5 : edgeR && x > x0 ? PAL.R3 : PAL.N0);
  }
  // the screen's light spilling past its top edge onto the laptop behind (one soft row, dithered)
  for (let i = 4; i < w - 4; i += 2) { const x = x0 + i, y = top - 2; if (y >= 0 && !mask[y * 480 + x]) fb.set(x, y, PAL.C3); }
};

// ================================================================== S3.03: the post types itself; her lips, silent
const ED = {x: 10, w: 300};
/** the editor's line boxes (blog-draft's own layout: the display face from y 42, 17 px a line, 5 more between the
 *  two sentences) */
const blogLines = () => {
  const out: Array<{s: string; y: number}> = [];
  let y = 42;
  BLOG.lines.forEach((sent, i) => { for (const l of bpwrap(sent, ED.w - 24)) { out.push({s: l, y}); y += 17; } if (i === 0) y += 5; });
  return out;
};
export const BLOG_CHARS = BLOG.lines.reduce((a, s) => a + s.length, 0);
export const blogTyped = (s: Buf, n: number, k: number) => {
  if (n >= BLOG_CHARS + 999) return;
  let left = Math.max(0, Math.floor(n));
  let caret: [number, number] | null = null;
  const x0 = ED.x + 12;
  // the untyped glyphs, exactly: the rest of each line lettered by the same call at its own advance, into a mask; those
  // pixels (descenders too) become the page again, and nothing of the typed lines is touched
  const NONE = 0x1000000, tmp = new Buf(s.w, s.h, NONE); // a value no palette colour takes
  const lines = blogLines();
  for (const l of lines) {
    const shown = l.s.slice(0, Math.max(0, Math.min(l.s.length, left)));
    left -= l.s.length + 1; // the wrap's space
    const rest = l.s.slice(shown.length);
    if (!rest) continue;
    const rx = x0 + (shown ? bpw(shown) + 2 : 0);
    bpt(tmp, rest, rx, l.y, PAL.N2);
    if (!caret) caret = [rx, l.y];
  }
  for (let i = 0; i < tmp.c.length; i++) if (tmp.c[i] !== NONE) s.c[i] = PAL.P2;
  // the kit's own caret after the full text (a draft is editable) goes until the text is there
  const last = lines[lines.length - 1];
  rect(ED.x + 14 + Math.min(ED.w - 28, bpw(last.s)), last.y, 2, 14, s.ink(PAL.P2));
  if (caret && Math.floor(k / 8) % 2 === 0) rect(caret[0], caret[1], 2, 14, s.ink(PAL.C4));
};
/** blog-draft's corner window (private there: 456 x 177 page, the window at its right) */
const CALLWIN = {x: 456 - 136, y: 22, w: 128, h: 86};
export const blogSpeakerWindow = (s: Buf, f: number, st: {mouth: Viseme; speaking: boolean}) => {
  const cw = new Buf(CALLWIN.w, CALLWIN.h, PAL.N1);
  callChrome(cw, {title: 'board sync', clock: null, controls: false});
  const y0 = CALL_BAR_H + 2, big: TileRect = {x: 2, y: y0, w: 82, h: CALLWIN.h - y0 - 2};
  const mh = Math.floor((big.h - 4) / 3), mw = CALLWIN.w - big.w - 8;
  const minis: TileRect[] = [0, 1, 2].map((i) => ({x: big.x + big.w + 4, y: y0 + i * (mh + 2), w: mw, h: mh}));
  rect(big.x - 1, big.y - 1, big.w + 2, big.h + 2, cw.ink(PAL.N0));
  drawNelehTile(cw, big.x, big.y, big.w, big.h, {mouth: st.mouth, lid: 0, brow: 'level'}, {orbit: f});
  nameChip(cw, big.x + 2, big.y + big.h - 13, 'NELEH');
  micIcon(cw, big.x + big.w - 13, big.y + big.h - 13, {level: st.speaking ? 2 : 0});
  if (st.speaking) speakingRing(cw, big);
  const [a, m, o] = minis;
  for (const t of minis) rect(t.x - 1, t.y - 1, t.w + 2, t.h + 2, cw.ink(PAL.N0));
  drawAlyiMini(cw, a.x, a.y, a.w, a.h);
  drawMadaMini(cw, m.x, m.y, m.w, m.h);
  drawSpinner(cw, m.x + Math.floor(m.w / 2), m.y + 4, f, {size: 'sm', clip: (px, py) => px >= m.x && py >= m.y && px < m.x + m.w && py < m.y + m.h});
  camOffBg(cw, o.x, o.y, o.w, o.h);
  pt(cw, 'off', o.x + Math.round((o.w - pw('off')) / 2), o.y + Math.round(o.h / 2) - 4, PAL.G3);
  for (let j = 0; j < CALLWIN.h; j++) for (let i = 0; i < CALLWIN.w; i++) s.set(CALLWIN.x + i, CALLWIN.y + j, cw.get(i, j));
};

// ================================================================== S3.04: her tile's own label
/** over drawBoardCall's fifth tile (Rima's) in a buffer of the call's size: the name chip in two rows */
export const rimaTileLabel = (s: Buf) => {
  const t = boardLayout(s.w, s.h).five[4];
  const a = 'RIMA TAMURI', b = 'INTERIM CEO';
  const w = Math.max(textWidth(a), textWidth(b)) + 8, x = t.x + 2, y = t.y + t.h - 23;
  rect(x, y, w, 21, s.ink(PAL.N0));
  text(s, a, x + 4, y + 2, PAL.P1);
  text(s, b, x + 4, y + 12, PAL.G5);
  return {x, y, w};
};

// ================================================================== S5.03: the app's heart count
const HEART = ['.#.#.', '#####', '#####', '.###.', '..#..'];
/** the app bar over the top of the phone's screen (inserts-mas PHONE29.screen, as v5's S5.03 lays its cards) */
export const heartCount = (fb: Buf, n: number, scr = {x0: 124, y0: 36, x1: 194}, tick: {prev?: number; k?: number} = {}) => {
  const w = scr.x1 - scr.x0 + 1;
  rect(scr.x0, scr.y0, w, 11, fb.ink(PAL.N0)); rect(scr.x0, scr.y0 + 11, w, 1, fb.ink(PAL.N3));
  const s = String(n), x = scr.x0 + Math.round((w - pw(s) - 8) / 2);
  // v3.3 (P16): the count ticks visibly: the old number rolls up out of the bar and the new one up into it (2 held
  // frames, clipped to the bar), and the heart beats one rung brighter for 4 frames
  const k = tick.k ?? 99, beat = k < 4;
  HEART.forEach((r, j) => { for (let i = 0; i < 5; i++) if (r[i] === '#') fb.set(x + i, scr.y0 + 3 + j, beat ? PAL.P2 : PAL.R3); });
  const bar = new Buf(w, 11, PAL.N0);
  if (k === 0 && tick.prev !== undefined) pt(bar, String(tick.prev), x + 8 - scr.x0, -2, PAL.P1);
  else if (k === 1) pt(bar, s, x + 8 - scr.x0, 5, PAL.P2);
  else pt(bar, s, x + 8 - scr.x0, 2, PAL.P2);
  for (let j = 1; j < 11; j++) for (let i = 7 + x - scr.x0; i < w; i++) fb.set(scr.x0 + i, scr.y0 + j, bar.get(i, j));
};
