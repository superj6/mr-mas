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
//                              name, the tag strip under it)
import {Buf, rect, line, ellipse, hash, bayer, clamp} from '../px';
import {PAL, stepColor} from '../palette';
import {text, textWidth} from '../font';
import {tiny} from './kit-b';
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

// ------------------------------------------------------------------ the clip
export interface ClipState { f: number; mouth: 0 | 1; progress?: number; tag?: boolean; }
/** the news clip in a player: the anchor at 2x cells (w >= 100) or 1x, a lower bar (no network's name), the scrub bar, the tag */
export const drawNewsClip = (b: Buf, x: number, y: number, w: number, h: number, st: ClipState) => {
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

// ------------------------------------------------------------------ 14.01 the OTS at the bullpen window
export interface BridgeOTSState { f: number; mouth: 0 | 1; progress?: number; }
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
  drawNewsClip(b, P.x + 3, P.y + 12, P.w - 6, 82, {f, mouth: st.mouth, progress: st.progress});
  alteredTag(b, P.x + 5, P.y + 100);
  for (let k = 0; k < 4; k++) { rect(P.x + 4, P.y + 120 + k * 14, P.w - 8, 10, b.ink(PAL.N2)); rect(P.x + 6, P.y + 122 + k * 14, 6, 6, b.ink(PAL.G3)); for (let i = 0; i < 44 + k * 9; i++) if (i % 6 !== 5) b.set(P.x + 16 + i, P.y + 125 + k * 14, PAL.G3); }
  // his fingers round the phone's left edge (lit by its screen), the thumb's heel at the foot
  for (const [hx, hy] of [[P.x - 9, P.y + 112], [P.x - 9, P.y + 128], [P.x - 8, P.y + 144], [P.x - 7, P.y + 158]] as Array<[number, number]>) { rect(hx, hy, 12, 14, b.ink(PAL.S2)); rect(hx + 1, hy + 1, 10, 12, b.ink(PAL.X2)); rect(hx + 9, hy + 2, 2, 10, b.ink(PAL.K3)); }
  for (let j = 0; j < 60; j++) for (let i = 0; i < 44; i++) if (Math.hypot((i - 22) / 22, (j - 30) / 30) < 1) b.set(P.x + P.w - 30 + i, P.y + P.h - 18 + j, i < 14 ? PAL.K2 : PAL.X1);
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
export interface LitWindowState { nod?: 0 | 1; glow?: boolean; hail?: number | null; }
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
