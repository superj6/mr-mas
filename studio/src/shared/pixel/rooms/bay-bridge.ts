// MR. MAS — shared room: THE BRIDGE (Ep1 sc 14; new file, owned by the `v3-art-b` pass). INT. NOPEAI BULLPEN — THE
// WINDOW — NIGHT → THE BAY. A bridge, not a conversation: a too-smooth voice travels from the clip in Mas's hand to the lit
// window across the bay, where someone reposts it, and a hailstone falls. Routed through his phone: the clip is in his
// hand before the push finds where it came from. The stepped push on one axis, three cut-ins, each its own drawing (never
// a zoom). The far building is the cold open's (rooms/apec-stage.ts, v3-art-a: the ONE dark building with its one lit
// window); by night every other tower is lit and it is the dark one.
//   drawBridgeOTS(b, f, st)    [OTS] (14.01) over Mas's shoulder at the dark bullpen window, his glass on the sill; the
//                              phone in his hand playing the NEWS ANCHOR clip (an invented face; her mouth lands a beat
//                              late: pass `mouth` from the lagged clock) with the app's grey tag `⚠ ALTERED AUDIO`;
//                              beyond the glass, the bay and the skyline, the dark tower's one lit window
//   drawBayWide(b, f, st)      [W] (14.02, 14.05) the bay from the window: the water, the lit skyline, the dark tower
//                              small in the middle with its lit window; `hail` t 0..1 the hailstone's fall into the
//                              bay, then `plink` k the ripple; `glow` off = the window's phone light gone
//   drawLitWindow(b, f, st)    [W] (14.03) the dark tower close, its one lit window: RUMPT's silhouette with a phone
//                              (cast/civic-extras drawRumptWindow: props and pose only), the same clip on its screen
//                              (too small to read; the tag's grey strip is the tell), `nod` on the audio's beat
//   drawRepostECU(b, f, st)    [ECU] (14.04) a thumb on a repost arrow just under the same grey tag: 'hover' |
//                              'press' (the click) | 'done' (`✓ REPOSTED`)
//   drawNewsClip(b, x, y, w, h, st)  the clip itself at any size ≥ 60 x 64 (the anchor, a lower bar with no network's
//                              name, the tag strip under it); v3.3 (P6, `desk`, opt-in; the `v3-shots-act2-act3` pass):
//                              drawn unmistakably as a generic NEWS ANCHOR AT A DESK: a news set behind her (two lit
//                              panels, a plain globe-less backdrop), the anchor seated behind a wide glossy desk with its
//                              lit front edge and a sheet of copy in front of her, and a BLANK lower-third bar (an accent
//                              tab and a pale band, no words, no ticker): nobody real, and not the senator
import {Buf, rect, line, ellipse, hash, bayer, clamp} from '../px';
import {PAL, stepColor} from '../palette';
import {text, textWidth} from '../font';
import {tiny} from './kit-b';
import {pt, pw, bpt} from '../kits/uitype';
import {drawAnchor, drawRumptWindow} from '../cast/civic-extras';

const RH = 203;
// ------------------------------------------------------------------ the tag's glyphs (the shared face has no ⚠ or ↻)
/** the warning triangle, 7 x 7 (drawn before the tag's words) */
export const warnIcon = (b: Buf, x: number, y: number, col: number, ink: number) => {
  const T = ['...#...', '..###..', '..#.#..', '.##.##.', '.#####.', '##.#.##', '#######'];
  T.forEach((r, j) => { for (let i = 0; i < 7; i++) if (r[i] === '#') b.set(x + i, y + j, col); });
  b.set(x + 3, y + 3, ink); b.set(x + 3, y + 5, ink);
};
/** the repost arrows (two arrows chasing round a square), 9 x 7 */
export const repostIcon = (b: Buf, x: number, y: number, col: number) => {
  const R = ['.#.......', '###.####.', '.#.....#.', '.#.....#.', '.#.....#.', '.####.###', '.......#.'];
  R.forEach((r, j) => { for (let i = 0; i < 9; i++) if (r[i] === '#') b.set(x + i, y + j, col); });
};
/** the tag strip: `⚠ ALTERED AUDIO` in the app's own grey, a rounded pill */
export const alteredTag = (b: Buf, x: number, y: number) => {
  const s = 'ALTERED AUDIO', w = textWidth(s) + 20;
  rect(x + 1, y, w - 2, 11, b.ink(PAL.G2)); rect(x, y + 1, w, 9, b.ink(PAL.G2)); rect(x + 1, y, w - 2, 1, b.ink(PAL.G3));
  warnIcon(b, x + 4, y + 2, PAL.G5, PAL.G2);
  text(b, s, x + 14, y + 2, PAL.G6);
  return w;
};

/** v3.2 (14.01: "drawn large enough to read"): the same tag in the display face on two lines, its warning sign drawn at
 *  twice the size (its own drawing), for a phone-width feed; returns its height */
export const alteredTagBig = (b: Buf, x: number, y: number, w: number) => {
  const h = 36;
  rect(x + 1, y, w - 2, h, b.ink(PAL.G2)); rect(x, y + 1, w, h - 2, b.ink(PAL.G2)); rect(x + 1, y, w - 2, 1, b.ink(PAL.G3));
  const T = ['.....##.....', '....####....', '....#..#....', '...##..##...', '...##..##...', '..###..###..', '..###..###..', '.##########.', '.####..####.', '############', '############'];
  T.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') b.set(x + 5 + i, y + 5 + j, PAL.G5); });
  bpt(b, 'ALTERED', x + 21, y + 3, PAL.G6);
  bpt(b, 'AUDIO', x + 21, y + 19, PAL.G6);
  return h;
};

// ------------------------------------------------------------------ the clip
export interface ClipState { f: number; mouth: 0 | 1; progress?: number; tag?: boolean; /** v3.3 (P6): the anchor at a desk, the lower third blank */ desk?: boolean; }
/** the news clip in a player: the anchor at 2x cells (w >= 100) or 1x, a lower bar (no network's name), the scrub bar, the tag */
export const drawNewsClip = (b: Buf, x: number, y: number, w: number, h: number, st: ClipState) => {
  if (st.desk && w >= 100) { drawAnchorDeskClip(b, x, y, w, h, st); return; }
  // the studio behind her: a generic cool set, a blurred skyline graphic
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const c = j < h * 0.55 ? (bayer(x + i, y + j) < 0.5 - j / (h * 2) ? PAL.C2 : PAL.C1) : PAL.N2;
    b.set(x + i, y + j, c);
  }
  for (let i = 0; i < w; i += 7) { const hh = 6 + Math.floor(hash(i, 3, 5) * 12); rect(x + i, y + Math.round(h * 0.55) - hh, 5, hh, b.ink(PAL.C3)); }
  const px = w >= 100 ? 2 : 1;
  drawAnchor(b, x + Math.round(w / 2 - 15 * px), y + h - 25 * px - (px === 2 ? 14 : 8), {mouth: st.mouth, px, blink: st.f % 90 < 3});
  // the lower bar: a plain band, no network name, a line of unreadable ticker
  const lb = y + h - (px === 2 ? 14 : 8);
  rect(x, lb, w, px === 2 ? 9 : 5, b.ink(PAL.R1)); rect(x, lb, w, 1, b.ink(PAL.R2));
  for (let i = 4; i < w - 4; i++) if (hash(i >> 1, 7, 3) < 0.6 && (i >> 1) % 5 !== 0) b.set(x + i, lb + (px === 2 ? 4 : 2), PAL.P1);
  // the scrub bar
  const sb = y + h - (px === 2 ? 4 : 2);
  rect(x, sb, w, 2, b.ink(PAL.G1)); rect(x, sb, Math.round(w * clamp(st.progress ?? 0.4, 0, 1)), 2, b.ink(PAL.P2));
};

/** v3.3 (P6): the same invented anchor, seated at a news desk, the lower third a blank bar (2x cells; w >= 100) */
const drawAnchorDeskClip = (b: Buf, x: number, y: number, w: number, h: number, st: ClipState) => {
  // the news set: a deep blue wall, two tall lit panels either side of her, a floor-line glow behind the desk
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const panel = (i > 4 && i < 20) || (i > w - 21 && i < w - 5);
    const c = panel ? (j < h * 0.62 ? (bayer(x + i, y + j) < 0.35 ? PAL.C4 : PAL.C3) : PAL.C2) : j < h * 0.62 ? (bayer(x + i, y + j) < 0.4 - j / (h * 2.4) ? PAL.F3 : PAL.F2) : PAL.F1;
    b.set(x + i, y + j, c);
  }
  for (const px0 of [4, w - 21]) { rect(x + px0, y, 1, Math.round(h * 0.62), b.ink(PAL.C6)); rect(x + px0 + 16, y, 1, Math.round(h * 0.62), b.ink(PAL.C1)); }
  // the anchor behind the desk (her sprite's own desk edge is covered by the real desk below)
  const ax = x + Math.round(w / 2 - 30), ay = y + 6;
  drawAnchor(b, ax, ay, {mouth: st.mouth, px: 2, blink: st.f % 90 < 3});
  // the desk: a wide glossy top (a highlight along its back edge), a sheet of copy under her hands, the curved front
  // panel with its lit strip; it spans the set, so she reads as seated behind it
  const dy = ay + 41, dx0 = x + 8, dx1 = x + w - 8;
  for (let j = 0; j < 6; j++) for (let i = dx0 - (j >> 1); i < dx1 + (j >> 1); i++) b.set(i, dy + j, j === 0 ? PAL.G6 : j < 3 ? PAL.N4 : PAL.N3);
  rect(ax + 18, dy + 1, 22, 3, b.ink(PAL.P2)); rect(ax + 18, dy + 1, 22, 1, b.ink(PAL.W9)); rect(ax + 21, dy + 2, 14, 1, b.ink(PAL.G5)); // the copy
  for (let j = 6; j < 16; j++) for (let i = dx0 - 3 + Math.round((j - 6) * 0.6); i < dx1 + 3 - Math.round((j - 6) * 0.6); i++) b.set(i, dy + j, j === 7 ? PAL.C6 : j === 8 ? PAL.C4 : bayer(i, dy + j) < 0.3 ? PAL.N3 : PAL.N2);
  // the lower third, blank: an accent tab at the left, a pale band where a name would go, its thin rule; no words
  const lb = y + h - 18;
  rect(x, lb, 12, 12, b.ink(PAL.R2)); rect(x, lb, 12, 1, b.ink(PAL.R3));
  rect(x + 12, lb, Math.round(w * 0.72), 12, b.ink(PAL.P1)); rect(x + 12, lb, Math.round(w * 0.72), 1, b.ink(PAL.P2)); rect(x + 12, lb + 11, Math.round(w * 0.72), 1, b.ink(PAL.G5));
  // the scrub bar
  const sb = y + h - 4;
  rect(x, sb, w, 2, b.ink(PAL.G1)); rect(x, sb, Math.round(w * clamp(st.progress ?? 0.4, 0, 1)), 2, b.ink(PAL.P2));
};

// ------------------------------------------------------------------ the bay and the skyline (night)
export const BAY = {horizon: 104, waterTo: 203, tower: {x: 236, w: 16, top: 42}, litWin: [242, 60] as [number, number]};
/** the lit skyline across the bay, the ONE dark tower, the water with its light trails; at a push step `k` (0 the window
 *  view, 1 the bay wide) the same world is redrawn at its own size (the towers' widths and heights re-laid, not scaled) */
const drawSkyline = (b: Buf, f: number, o: {k: 0 | 1; x0: number; x1: number; y0: number; y1: number; glow: boolean}) => {
  const H = o.k === 0 ? 150 : BAY.horizon;
  const clip = (x: number, y: number) => x >= o.x0 && x <= o.x1 && y >= o.y0 && y <= o.y1;
  const put = (x: number, y: number, c: number) => { if (clip(x, y)) b.set(x, y, c); };
  for (let y = o.y0; y <= o.y1; y++) for (let x = o.x0; x <= o.x1; x++) {
    let c: number;
    if (y < H) { const t = (y - o.y0) / (H - o.y0) + (bayer(x, y) - 0.5) * 0.12; c = t < 0.5 ? PAL.N1 : t < 0.8 ? PAL.N2 : PAL.U0; }
    else { const d = y - H; c = d < 2 ? PAL.N3 : bayer(x, y) < 0.3 ? PAL.N2 : PAL.N1; }
    b.set(x, y, c);
  }
  // the towers: widths and heights on a seeded walk; each window a lit pixel (warm or cool), a few blinking beacons
  const scale = o.k === 0 ? 0.6 : 1;
  const cx = o.k === 0 ? 300 : BAY.tower.x + BAY.tower.w / 2;
  for (let s = 0, x = o.x0 - 30; x < o.x1 + 30; s++) {
    const w = Math.round((8 + Math.floor(hash(s, 1, 51) * 14)) * scale) + 2;
    const top = H - Math.round((14 + hash(s, 2, 51) * 46) * scale);
    if (Math.abs(x + w / 2 - cx) < (o.k === 0 ? 14 : BAY.tower.w + 6)) { x += w + 1; continue; }
    for (let y = top; y < H; y++) for (let i = 0; i < w; i++) put(x + i, y, i === 0 ? PAL.N3 : PAL.N2);
    for (let y = top + 2; y < H - 1; y += 2) for (let i = 1; i < w - 1; i += 2) if (hash(x + i, y, 52) < 0.34) put(x + i, y, hash(y, x + i, 53) < 0.65 ? PAL.W5 : PAL.C5);
    if (hash(s, 9, 51) < 0.2 && Math.floor(f / 16) % 2 === 0) put(x + (w >> 1), top - 1, PAL.R3);
    x += w + 1 + Math.floor(hash(s, 3, 51) * 3);
  }
  // the ONE dark tower: no lit windows but one
  const tw = o.k === 0 ? 10 : BAY.tower.w, tt = o.k === 0 ? H - 44 : BAY.tower.top;
  const tx = Math.round(cx - tw / 2);
  for (let y = tt; y < H; y++) for (let i = 0; i < tw; i++) put(tx + i, y, i === 0 ? PAL.N2 : PAL.N1);
  const lw = o.k === 0 ? 2 : 4, lx = tx + Math.round(tw / 2) - (lw >> 1), ly = tt + (o.k === 0 ? 8 : 18);
  for (let j = 0; j < lw; j++) for (let i = 0; i < lw; i++) put(lx + i, ly + j, PAL.W6);
  if (o.glow) put(lx, ly + lw - 1, PAL.C8);
  // the lit window's reflection laid down the water (a broken column of warm dashes)
  for (let y = H + 2; y < Math.min(o.y1, H + (o.k === 0 ? 30 : 90)); y += 2) if (hash(y, 3, 57) < 0.7) { const wob = Math.round(Math.sin(y / 5 + f / 12) * 1.5); put(lx + wob, y, PAL.W3); if (o.k) put(lx + 1 + wob, y, PAL.W2); }
  // other reflections, a few long streaks
  for (let k = 0; k < 18; k++) { const x = o.x0 + Math.floor(hash(k, 1, 58) * (o.x1 - o.x0)); if (Math.abs(x - lx) < 8) continue; for (let y = H + 2; y < H + 20 + hash(k, 2, 58) * 30; y += 3) put(x + Math.round(Math.sin(y / 6 + k) * 1.2), y, hash(k, 3, 58) < 0.6 ? PAL.W2 : PAL.C1); }
  return {lit: [lx + (lw >> 1), ly + (lw >> 1)] as [number, number], water: H};
};

/** v3.1: fingers round an object's edge (a phone's, a print's), each its own rounded pad with a lit top, a crease under
 *  it and the tip over the edge: `ex` = the edge's x, the fingers to its left, `y0` the first's top, `pal` [outline,
 *  shadow, mid, light] */
export const holdFingers = (b: Buf, ex: number, y0: number, n: number, pal: [number, number, number, number], pitch = 15) => {
  for (let k = 0; k < n; k++) {
    const cy = y0 + k * pitch + 6, cx = ex - 3 - (k === n - 1 ? 1 : 0);
    for (let j = -7; j <= 7; j++) for (let i = -10; i <= 7; i++) {
      const d = Math.hypot(i / 9.5, j / 6.8);
      if (d > 1) continue;
      const c = d > 0.86 ? pal[0] : j < -3 ? pal[3] : j > 3 ? pal[1] : pal[2];
      b.set(cx + i, cy + j, c);
    }
    b.set(cx + 5, cy - 3, pal[3]); b.set(cx + 6, cy - 2, pal[3]); // the nail's glint at the tip
  }
};
/** his own post of the class photo in the feed (a generic app's card): his avatar, `mas`, the print as a thumbnail
 *  (the photo's own layout drawn small: the cream wall and its gold frames, the white door with NEDIB in it, SIRRAH
 *  plum at the head, the four red chairs and their heads, the table), `CLASS PHOTO #1`, the hearts climbing */
export const classPhotoPost = (b: Buf, x: number, y: number, w: number, hearts: number, f: number) => {
  rect(x, y, w, 96, b.ink(PAL.N2)); rect(x, y, w, 1, b.ink(PAL.N4));
  rect(x + 3, y + 3, 7, 7, b.ink(PAL.C3)); rect(x + 5, y + 5, 3, 3, b.ink(PAL.S3));
  text(b, 'mas', x + 13, y + 3, PAL.C6);
  const tx = x + 3, ty = y + 14, tw = w - 6, th = 50;
  const U = (u: number) => Math.round(tx + u * tw), V = (v: number) => Math.round(ty + v * th);
  for (let j = 0; j < th; j++) for (let i = 0; i < tw; i++) {
    const v = j / th;
    const c = v < 0.5 ? (bayer(tx + i, ty + j) < 0.15 ? PAL.P0 : PAL.P1) : v < 0.64 ? PAL.D2 : v < 0.8 ? PAL.N3 : v < 0.83 ? PAL.D4 : PAL.D3;
    b.set(tx + i, ty + j, c);
  }
  // the gold frames (two left of the door, one right), the white door with NEDIB mid-stride in it
  for (const u of [0.1, 0.3, 0.84]) { rect(U(u), V(0.08), 11, 12, b.ink(PAL.W5)); rect(U(u) + 1, V(0.08) + 1, 9, 10, b.ink(PAL.D1)); }
  rect(U(0.53), 0 + ty, 15, V(0.64) - ty, b.ink(PAL.P2));
  rect(U(0.53) + 5, V(0.12), 5, 3, b.ink(PAL.P2)); rect(U(0.53) + 5, V(0.12), 5, 1, b.ink(PAL.G5)); // his white hair
  rect(U(0.53) + 5, V(0.12) + 3, 5, 3, b.ink(PAL.S3)); rect(U(0.53) + 4, V(0.12) + 6, 7, 16, b.ink(PAL.N1)); rect(U(0.53) + 4, V(0.12) + 22, 2, 6, b.ink(PAL.N1)); rect(U(0.53) + 9, V(0.12) + 22, 2, 6, b.ink(PAL.N0));
  // SIRRAH at the head of the table, plum, her pointer; the blocks
  rect(U(0.04), V(0.36), 5, 4, b.ink(PAL.S2)); rect(U(0.04) - 1, V(0.34), 7, 2, b.ink(PAL.B1)); rect(U(0.04) - 1, V(0.44), 7, 14, b.ink(PAL.U3));
  for (let i = 0; i < 9; i++) b.set(U(0.04) + 6 + i, V(0.5) + (i >> 1), PAL.W6);
  rect(U(0.14), V(0.66), 5, 5, b.ink(PAL.C5)); rect(U(0.19), V(0.66), 5, 5, b.ink(PAL.R3));
  // the four chairs and their heads: three turned to the door (their hair, their far cheeks), Mas's to the lens
  [0.3, 0.46, 0.7, 0.86].forEach((u, i) => {
    const cx = U(u);
    rect(cx - 5, V(0.42), 11, 12, b.ink(PAL.R2)); rect(cx - 5, V(0.42), 11, 1, b.ink(PAL.R3));
    const hair = [PAL.B2, PAL.N2, PAL.B3, PAL.B1][i];
    rect(cx - 2, V(0.4), 5, 5, b.ink(i === 0 ? PAL.S3 : hair)); rect(cx - 2, V(0.4) - 1, 5, 2, b.ink(hair));
    if (i === 0) { b.set(cx - 1, V(0.4) + 2, PAL.N0); b.set(cx + 1, V(0.4) + 2, PAL.N0); } // the two dots: he looks at us
    else b.set(cx + (i === 3 ? -2 : 2), V(0.4) + 3, PAL.S3);
    rect(cx - 3, V(0.4) + 5, 7, 5, b.ink(i === 0 ? PAL.N4 : i === 1 ? PAL.N5 : PAL.G3));
  });
  rect(tx, ty, tw, 1, b.ink(PAL.W9));
  pt(b, 'CLASS PHOTO #1', x + 3, y + 68, PAL.P2);
  // the heart row: the count climbing (held), a red heart
  const H = ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'];
  H.forEach((r, j) => { for (let i = 0; i < 7; i++) if (r[i] === '#') b.set(x + 4 + i, y + 82 + j, PAL.R2); });
  text(b, String(Math.round(hearts)), x + 14, y + 81, PAL.P1);
  void f;
};

// ------------------------------------------------------------------ 14.01 the OTS at the bullpen window
export interface BridgeOTSState {
  f: number; mouth: 0 | 1; progress?: number;
  /** v3.1 (the 13.14 -> 14.01 match cut): the phone's feed scrolled from his own CLASS PHOTO #1 post (0, at the top of
   *  the screen) down to the altered clip (1: the v3 layout); whole-pixel steps in between. Undefined = 1. */
  feed?: number;
  /** the CLASS PHOTO #1 post's heart count (it climbs while he holds it) */
  hearts?: number;
  /** v3.2 (14.01): his thumb on the clip's scrub bar at the playhead (`progress`), dragging it back: 0 none, 1 on it */
  scrub?: 0 | 1;
  /** v3.2 (14.01): the tag at the display size (alteredTagBig) */
  tagBig?: boolean;
  /** v3.3 (P6): the clip drawn as a news anchor at a desk, its lower third blank */
  anchorDesk?: boolean;
  /** v3.4 (script draft 8.3: the bay's clip is cut; the `v3-shots-act2-act3` pass): no clip in the feed, only his post and
   *  other people's items, greyed, under it */
  noClip?: boolean;
}
export const BRIDGE_PHONE = {x: 176, y: 22, w: 118, h: 200};
export const drawBridgeOTS = (b: Buf, f: number, st: BridgeOTSState) => {
  // the window's glass fills the frame: the skyline beyond (k 0, the window view); the dark bullpen's faint reflection
  drawSkyline(b, f, {k: 0, x0: 0, x1: 479, y0: 0, y1: RH - 1, glow: true});
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) if (bayer(x, y) < 0.08 && hash(x >> 4, y >> 4, 71) < 0.3) b.set(x, y, stepColor(b.get(x, y), 1));
  // the mullions, the sill (his glass on it, its water line flat)
  for (const mx of [150, 330]) { rect(mx, 0, 6, 170, b.ink(PAL.N0)); rect(mx, 0, 1, 170, b.ink(PAL.G1)); }
  rect(0, 170, 480, 8, b.ink(PAL.G1)); rect(0, 170, 480, 1, b.ink(PAL.G3)); rect(0, 178, 480, 25, b.ink(PAL.N0));
  const gx = 360, gy = 142;
  for (let j = 0; j < 28; j++) for (let i = 0; i < 12; i++) b.set(gx + i, gy + j, j < 8 ? (i === 0 ? PAL.C4 : i === 11 ? PAL.C1 : b.get(gx + i, gy + j)) : i === 0 ? PAL.C5 : i === 11 ? PAL.C1 : i < 4 ? PAL.C2 : PAL.C1);
  rect(gx + 1, gy + 8, 10, 1, b.ink(PAL.C7));
  // MAS's shoulder and the back of his head (frame left, dark: hair in strands, the hood at his neck; the phone's cool
  // light rims his cheek and his hand)
  const inHead = (x: number, y: number) => Math.hypot((x - 62) / 34, (y - 70) / 40) < 1;
  const inHood = (x: number, y: number) => Math.hypot((x - 58) / 48, (y - 128) / 26) < 1 && y > 104;
  const inSh = (x: number, y: number) => Math.hypot((x - 30) / 140, (y - 250) / 110) < 1;
  for (let y = 20; y < RH; y++) for (let x = 0; x < 200; x++) {
    const h = inHead(x, y), hd = inHood(x, y), s = inSh(x, y);
    if (!h && !hd && !s) continue;
    const rim = !(inHead(x + 1, y) || inHood(x + 1, y) || inSh(x + 1, y));
    b.set(x, y, h && !hd ? (rim ? PAL.C3 : (Math.floor((x * 0.6 + y) / 3) + (x >> 3)) % 3 === 0 ? PAL.B1 : PAL.B0) : hd ? (rim ? PAL.C2 : PAL.G1) : rim ? PAL.C2 : PAL.G0);
  }
  for (const [x, y] of [[64, 29], [65, 28], [66, 28], [67, 29]] as Array<[number, number]>) b.set(x, y, PAL.B2); // the cowlick
  // the phone in his hand, held up toward the window: a dark slab, the clip on its screen, the tag under the player
  const P = BRIDGE_PHONE;
  rect(P.x - 2, P.y - 2, P.w + 4, P.h + 4, b.ink(PAL.N0));
  rect(P.x - 1, P.y - 1, P.w + 2, P.h + 2, b.ink(PAL.G1)); rect(P.x - 1, P.y - 1, P.w + 2, 1, b.ink(PAL.G3));
  rect(P.x, P.y, P.w, P.h, b.ink(PAL.N1));
  rect(P.x + 4, P.y + 4, 22, 3, b.ink(PAL.G3)); // the app's header bar
  // the feed, drawn tall and scrolled: his CLASS PHOTO #1 post (the print, small, and its hearts), then the clip
  const feedH = 104, scroll = Math.round(feedH * clamp(st.feed ?? 1, 0, 1));
  const tall = new Buf(P.w, 340, PAL.N1);
  classPhotoPost(tall, 3, 12, P.w - 6, st.hearts ?? 406, st.f);
  if (st.noClip) {
    // the feed under his post: other people's items, greyed (an avatar, two text lines, a thumbnail block)
    for (let k = 0; k < 5; k++) { const ry = 12 + feedH + 4 + k * 30; rect(4, ry, P.w - 8, 26, tall.ink(PAL.N2)); rect(7, ry + 3, 7, 7, tall.ink(PAL.G3)); for (let i = 0; i < 50 + (k % 3) * 12; i++) if (i % 7 !== 6) tall.set(18 + i, ry + 5, PAL.G3); for (let i = 0; i < 36 + (k % 2) * 20; i++) if (i % 6 !== 5) tall.set(18 + i, ry + 11, PAL.G2); rect(P.w - 30, ry + 4, 22, 18, tall.ink(PAL.N3)); }
  } else drawNewsClip(tall, 3, 12 + feedH, P.w - 6, 82, {f, mouth: st.mouth, progress: st.progress, desk: st.anchorDesk});
  const tagH = st.noClip ? 0 : st.tagBig ? alteredTagBig(tall, 4, 12 + feedH + 87, P.w - 8) - 11 : (alteredTag(tall, 5, 12 + feedH + 88), 0);
  if (!st.noClip) for (let k = 0; k < 4; k++) { const ry = 12 + feedH + 108 + tagH + k * 14; rect(4, ry, P.w - 8, 10, tall.ink(PAL.N2)); rect(6, ry + 2, 6, 6, tall.ink(PAL.G3)); for (let i = 0; i < 44 + k * 9; i++) if (i % 6 !== 5) tall.set(16 + i, ry + 5, PAL.G3); }
  for (let y = 10; y < P.h; y++) for (let x = 0; x < P.w; x++) b.set(P.x + x, P.y + y, tall.get(x, y + scroll));
  rect(P.x + 4, P.y + 4, 22, 3, b.ink(PAL.G3));
  // his fingers round the phone's left edge (lit by its screen), the thumb's heel at the foot
  holdFingers(b, P.x + 2, P.y + 112, 4, [PAL.S0, PAL.X1, PAL.X2, PAL.K3]);
  // v3.2: his thumb from the phone's right edge onto the scrub bar at the playhead (the clip's bar is 2 px, 2 from its
  // foot), lit by the screen; two held drawings as he drags it back are two `progress` values
  if (st.scrub) {
    // the pad just above the bar (the tag below stays clear), the thumb lying along it back to his hand at the phone's
    // right edge: a rounded tip, the nail on its top side, the screen's light on its top
    const bar = P.y + 12 + feedH - scroll + 82 - 2, tx = P.x + 3 + Math.round((P.w - 6) * clamp(st.progress ?? 0.4, 0, 1));
    if (bar > P.y + 10 && bar < P.y + P.h) {
      const cy = bar - 5, r = 7, x1 = P.x + P.w + 10;
      for (let yy = cy - r; yy <= cy + r + 18; yy++) for (let xx = tx - r; xx < Math.min(480, x1 + 26); xx++) {
        const inThumb = xx >= tx && Math.abs(yy - cy - (xx - tx) * 0.06) <= r && xx <= x1;
        const dTip = Math.hypot(xx - tx, yy - cy);
        const palm = Math.hypot((xx - x1 - 6) / 11, (yy - cy - 18) / 20) <= 1;
        if (!(inThumb || dTip <= r || palm)) continue;
        const dy = yy - cy - Math.max(0, xx - tx) * 0.06;
        const edge = palm && !inThumb ? Math.hypot((xx - x1 - 6) / 11, (yy - cy - 18) / 20) > 0.88 : (Math.abs(dy) > r - 1 || (xx < tx + 1 && dTip > r - 1));
        const nail = !palm && xx > tx + 1 && xx < tx + 12 && dy > -r + 1 && dy < -1;
        b.set(xx, yy, edge ? PAL.S0 : nail ? (xx < tx + 5 ? PAL.K4 : PAL.K3) : palm && !inThumb ? (xx < x1 ? PAL.X2 : PAL.X1) : dy < -2 ? PAL.K3 : dy > 3 ? PAL.X1 : PAL.X2);
      }
    }
  }
};

// ------------------------------------------------------------------ 14.02 / 14.05 the bay wide
export interface BayState { hail?: number | null; plink?: number | null; glow?: boolean; }
export const drawBayWide = (b: Buf, f: number, st: BayState = {}) => {
  const {lit, water} = drawSkyline(b, f, {k: 1, x0: 0, x1: 479, y0: 0, y1: RH - 1, glow: st.glow !== false});
  if (st.hail !== undefined && st.hail !== null) {
    // the hailstone: out of the lit window, a short fall into the bay (glyph noise inside it: no letters)
    const t = clamp(st.hail, 0, 1);
    const x = lit[0] + Math.round(t * 6), y = lit[1] + 2 + Math.round((water - lit[1] + 6) * t * t);
    if (t < 1) { ellipse(x, y, 2.2, 2.2, b.ink(PAL.P2)); b.set(x - 1, y - 1, PAL.W9); b.set(x + 1, y, PAL.C7); }
  }
  if (st.plink !== undefined && st.plink !== null) {
    // the ripple: two whole-pixel rings widening on the water, held on 2s
    const k = Math.floor(st.plink / 2);
    const x = lit[0] + 6, y = water + 8;
    for (const r of [k + 2, k * 2 + 4]) for (let a = 0; a < 64; a++) { const X = Math.round(x + Math.cos((a / 64) * Math.PI * 2) * r * 2), Y = Math.round(y + Math.sin((a / 64) * Math.PI * 2) * r * 0.5); if (Y > water + 1 && (a % 2 === 0)) b.set(X, Y, r === k + 2 ? PAL.N7 : PAL.N5); }
  }
};

// ------------------------------------------------------------------ 14.03 the lit window, close
export interface LitWindowState { nod?: 0 | 1; glow?: boolean; hail?: number | null; /** v3.2 (14.03, 14.04 folded in): 1 its thumb presses (the phone's glow a rung up), 2 `✓ REPOSTED` pops beside it */ repost?: 0 | 1 | 2; }
export const LITWIN = {x: 176, y: 58, w: 128, h: 92};
export const drawLitWindow = (b: Buf, f: number, st: LitWindowState = {}) => {
  // the dark tower's face: a grid of dark panes (a faint cold sheen on the glass), and its ONE lit window
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const px = x % 64, py = y % 46;
    const frame = px < 3 || py < 3;
    b.set(x, y, frame ? PAL.N2 : bayer(x, y) < 0.06 + (x + y) / 4000 ? PAL.N3 : PAL.N1);
  }
  const {x, y, w, h} = LITWIN;
  // the room inside: a warm wash, a lamp's pool at the left, a curtain edge; the window's frame
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const d = Math.hypot((i - 20) / 90, (j - 30) / 70);
    b.set(x + i, y + j, d < 0.5 ? PAL.W6 : d < 0.8 ? (bayer(x + i, y + j) < 0.5 ? PAL.W6 : PAL.W5) : PAL.W4);
  }
  for (let j = 0; j < h; j++) for (let i = w - 16; i < w; i++) b.set(x + i, y + j, (i + j) % 5 === 0 ? PAL.W3 : PAL.W4); // the curtain's edge
  rect(x - 3, y - 3, w + 6, 3, b.ink(PAL.N2)); rect(x - 3, y + h, w + 6, 4, b.ink(PAL.N3)); rect(x - 3, y, 3, h, b.ink(PAL.N2)); rect(x + w, y, 3, h, b.ink(PAL.N2));
  // the silhouette at the window, waist up, his phone up, the same clip glowing on it
  drawRumptWindow(b, x + 30, y + h - 78, {nod: st.nod ?? 0, glow: st.glow !== false, size: 2.6});
  // v3.2: the repost, in the same shot: the press (the phone's glow steps up a rung), then the app's own chip beside it
  if (st.repost) {
    const gx = x + 30 + Math.round(21 * 2.6), gy = y + h - 78 + Math.round(14 * 2.6);
    for (let j = -6; j <= 6; j++) for (let i = -6; i <= 6; i++) if (Math.hypot(i, j) < 6 && bayer(gx + i, gy + j) < 0.4) b.set(gx + i, gy + j, stepColor(b.get(gx + i, gy + j), 1));
    if (st.repost >= 2) {
      const s2 = 'REPOSTED', cw = pw(s2) + 22, cx = x + w - cw - 4, cy = y + 6;
      rect(cx + 1, cy + 1, cw, 13, b.ink(PAL.N0)); rect(cx, cy, cw, 13, b.ink(PAL.G2)); rect(cx, cy, cw, 1, b.ink(PAL.G4));
      text(b, '✓', cx + 4, cy + 3, PAL.L3); pt(b, s2, cx + 16, cy + 3, PAL.G6);
    }
  }
  // its warm reflection on the sill, and the hailstone dropping out of the window's foot
  rect(x, y + h, w, 1, b.ink(PAL.W3));
  if (st.hail !== undefined && st.hail !== null && st.hail < 1) {
    const t = clamp(st.hail, 0, 1), hx = x + 56 + Math.round(t * 10), hy = y + h + 4 + Math.round(t * t * 90);
    ellipse(hx, hy, 3, 3, b.ink(PAL.P2)); b.set(hx - 1, hy - 1, PAL.W9); b.set(hx + 1, hy + 1, PAL.C7); b.set(hx, hy, PAL.G6);
  }
};

// ------------------------------------------------------------------ 14.04 the repost insert
export const drawRepostECU = (b: Buf, f: number, st: {step: 'hover' | 'press' | 'done'}) => {
  // the phone's screen close (a different phone: black, no case): the clip's lower half, the tag, the action row
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, x < 60 || x > 420 ? PAL.N0 : PAL.N1);
  rect(60, 0, 1, RH, b.ink(PAL.G2)); rect(420, 0, 1, RH, b.ink(PAL.G1));
  drawNewsClip(b, 64, -40, 352, 110, {f, mouth: 0, progress: 0.62});
  // the tag at 2x (the same pill, drawn at the insert's size)
  const tg = new Buf(160, 12, 0x1000000);
  alteredTag(tg, 0, 0);
  for (let j = 0; j < 12; j++) for (let i = 0; i < 160; i++) { const c = tg.get(i, j); if (c !== 0x1000000) rect(80 + i * 2, 80 + j * 2, 2, 2, b.ink(c)); }
  // the action row: reply, REPOST (the arrow), like; the arrow lit green once pressed
  const rowY = 128;
  rect(64, rowY - 6, 352, 1, b.ink(PAL.N3));
  const pressed = st.step !== 'hover';
  const R = new Buf(40, 10, 0x1000000);
  repostIcon(R, 0, 0, pressed ? PAL.L3 : PAL.G5);
  for (let j = 0; j < 10; j++) for (let i = 0; i < 40; i++) { const c = R.get(i, j); if (c !== 0x1000000) rect(210 + i * 3, rowY + j * 3, 3, 3, b.ink(c)); }
  rect(110, rowY + 6, 20, 2, b.ink(PAL.G4)); rect(110, rowY + 2, 2, 8, b.ink(PAL.G4)); // reply (a plain bubble stroke)
  ellipse(340, rowY + 10, 8, 7, b.ink(PAL.G4)); ellipse(340, rowY + 10, 6, 5, b.ink(PAL.N1)); // like
  if (st.step === 'done') { text(b, '✓ REPOSTED', 206, rowY + 30, PAL.L3); }
  // the thumb (from the right, lit by the screen): above the arrow on 'hover', down on it on 'press'
  if (st.step !== 'done') {
    const tx = 234, ty = st.step === 'press' ? rowY - 4 : rowY - 22;
    const inT = (x: number, y: number) => Math.hypot((x - tx - 40) / 48, (y - ty - 30) / 24) < 1 || (x > tx + 60 && y > ty + 20 && y < ty + 90);
    for (let y = Math.max(0, ty - 10); y < RH; y++) for (let x = tx - 20; x < 480; x++) {
      if (!inT(x, y)) continue;
      const e = !inT(x - 1, y) || !inT(x, y - 1);
      b.set(x, y, e ? PAL.K4 : x < tx + 30 ? PAL.K3 : x < tx + 70 ? PAL.K2 : PAL.X2);
    }
    rect(tx - 2, ty + 18, 22, 10, b.ink(PAL.K4)); // the nail's pale edge
  }
};
void line; void tiny;
