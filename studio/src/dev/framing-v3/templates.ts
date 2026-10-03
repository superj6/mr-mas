// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// MR. MAS · framing v3 (cinematography / framing designer, 2026-09-25): the v3 SHOT TEMPLATES, prototyped from assets
// that already exist, so show/episodes/ep01/production/act4/history/framing-v3.md's cost claims are checked against pixels.
// A reference for the engine owner (who promotes the helpers to src/shared/pixel/framing.ts, additive) and for the
// animatic / scene builders (who own the real layouts). Not show art; nothing here is imported by an episode.
//   npx esbuild src/dev/framing-v3/templates.ts --bundle --platform=node --outfile=<scratch>/fv3.cjs
//   node <scratch>/fv3.cjs <outDir> [each]      -> <outDir>/framing-v3-templates.png (3 x 5 sheet at 1x) [+ t01..t13 at 2x]
// Helpers prototyped here (the proposed framing.ts API): soft (rack focus / fallaway on a masked layer), bust (a
// frameless portrait: bottom extension + shoulder falloff), vignette (negative fill behind a bust), shoulder (the OTS
// foreground silhouette with a rim), whip (the whip streak: row runs + highlight smear), shift (whole-pixel offset).
import * as fs from 'fs';
import {writePNG} from '../../shared/pixel/png';
import {Buf, rect, clamp, bayer, hash} from '../../shared/pixel/px';
import {PAL, stepColor, lum} from '../../shared/pixel/palette';
import {blitImg} from '../../shared/pixel/figure';
import {silhouette, flipImg} from '../../shared/pixel/sprite';
import {text} from '../../shared/pixel/font';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../shared/pixel/cast/mas';
import {nelehPortrait, NELEH_PORTRAIT_DEFAULT, nelehTileBg, drawNelehMini} from '../../shared/pixel/cast/neleh';
import {madaPortrait, MADA_PORTRAIT_DEFAULT, drawMadaMini} from '../../shared/pixel/cast/mada';
import {ttemmePortrait, TTEMME_PORTRAIT_DEFAULT, drawHourglass} from '../../shared/pixel/cast/ttemme';
import {gergGlow} from '../../shared/pixel/cast/gerg-speak';
import {drawBullpen} from '../../shared/pixel/rooms/bullpen';
import {drawAlyiMini, alyiReflection} from '../../shared/pixel/cast/alyi-speak';
import {drawMasMedium, MAS_MEDIUM_DEFAULT} from '../../shared/pixel/cast/mas-medium';
import {drawOrb, ORB_MR, orbBob} from '../../shared/pixel/cast/orb-medium';
import {drawDarkPlate, drawDarkPlateDesk, drawDarkPlateFront, DPLATE, DPLATE_LOOK} from '../../shared/pixel/rooms/darkroom-plate';
import {drawBoardPlate, drawBoardPlateTable, drawBoardPlateFront, BPLATE} from '../../shared/pixel/rooms/boardroom-plate';
import {drawMadaM, FIRES_CALMOFF, drawCalmOff2S} from '../../shared/pixel/rooms/twoshots';
import {callChrome} from '../../shared/pixel/kits/callgrid';
import {DRAW} from '../../episodes/ep01/act4/animatic/shots';
import {SHOTS} from '../../episodes/ep01/act4/animatic/data-v2';

const RH = 203;
const OUT = process.argv[2];

// ------------------------------------------------------------------ the proposed kit (framing.ts), prototyped
/** soft focus / fallaway: step a region (or a masked layer) down k rungs along its own ramp. Hard steps, no dither. */
const soft = (b, k, keep?: Uint8Array) => { for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { if (keep && keep[y * 480 + x]) continue; b.set(x, y, stepColor(b.get(x, y), -k)); } };
/** frameless bust: the portrait art composed straight into the frame. The window crops its shoulders at the sides and
 *  bottom, so (1) the bottom row repeats down to the frame edge (the torso continues), (2) the shoulders fall off to
 *  shadow in 3 hard bands toward the old crop lines (a key light that falls off, never a dither on the figure). */
const bust = (img, extend: number, o: {side?: number} = {}) => {
  const W = img.w, H = img.h + extend, out = {w: W, h: H, c: new Int32Array(W * H).fill(-1)};
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const sy = Math.min(y, img.h - 1);
    let v = img.c[sy * W + x];
    if (v < 0) continue;
    if (y >= 88) {
      // below the old crop line the torso tapers into shadow: the side band widens 0.7 px per row
      const side = (o.side ?? 34) + (y >= img.h ? Math.round((y - img.h) * 0.7) : 0);
      const dx = Math.min(x, W - 1 - x);
      const kSide = dx < side / 4 ? 6 : dx < side / 2 ? 3 : dx < (3 * side) / 4 ? 2 : dx < side ? 1 : 0;
      const kBot = y >= img.h + 30 ? 5 : y >= img.h + 18 ? 3 : y >= img.h + 6 ? 2 : y >= img.h - 12 ? 1 : 0;
      const k = Math.max(kSide * (y >= 96 ? 1 : 0), kBot);
      if (k) v = stepColor(v, -k);
    }
    out.c[y * W + x] = v;
  }
  return out;
};
/** negative fill: the room behind a bust steps down around the body's lower half (dither allowed: it is background) */
const vignette = (b, cx, k = 2) => { for (let y = 100; y < RH; y++) for (let x = 0; x < 480; x++) { const d = Math.abs(x - cx) / 140 - (y - 100) / 160; if (d < 0.9 && bayer(x, y) < (0.9 - d) * 1.4) b.set(x, y, stepColor(b.get(x, y), -k)); } };
/** the over-the-shoulder foreground: the listener's portrait as a silhouette, one rung off black, with a 1 px rim on
 *  the side the key comes from. Silhouettes may flip (no features to mirror). */
const shoulder = (img, extend, rim: number, rimSide: -1 | 1, flip = false) => {
  const src = flip ? flipImg(img) : img;
  const b = bust(src, extend, {side: 0});
  const sil = silhouette(b, PAL.N0);
  const out = {w: sil.w, h: sil.h, c: new Int32Array(sil.c)};
  for (let y = 0; y < sil.h; y++) for (let x = 0; x < sil.w; x++) {
    if (sil.c[y * sil.w + x] < 0) continue;
    const nx = x + rimSide;
    if (nx < 0 || nx >= sil.w || sil.c[y * sil.w + nx] < 0) out.c[y * sil.w + x] = y < 70 ? rim : stepColor(rim, -2);
  }
  return out;
};
/** the whip: only highlights streak back along the move (mdinner recipe) + every row is held in runs (the stepped
 *  motion streak), so dark rooms still read as a whip. */
const whip = (fb: Buf, dx: number) => {
  const run = clamp(Math.round(Math.abs(dx) * 0.12), 2, 18);
  const src = fb.c.slice();
  for (let y = 0; y < RH; y++) {
    const off = Math.floor(hash(0, y, 7) * run);
    for (let x = 0; x < 480; x++) { const sx = clamp(Math.floor((x + off) / run) * run - off, 0, 479); fb.c[y * 480 + x] = src[y * 480 + sx]; }
  }
  const s2 = fb.c.slice();
  const dir = dx < 0 ? -1 : 1, n0 = clamp(Math.round(Math.abs(dx) * 0.45), 0, 26);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const c = s2[y * 480 + x];
    if (lum(c) < 0.5) continue;
    const n = n0 - ((bayer(x, y) * 5) | 0);
    for (let k = 1; k <= n; k++) { const xx = x - dir * k; if (xx < 0 || xx >= 480) break; const col = stepColor(c, -Math.floor(k / 6)); if (lum(col) > lum(fb.c[y * 480 + xx])) fb.c[y * 480 + xx] = col; }
  }
};
const shift = (dst: Buf, src: Buf, dx: number) => { for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const sx = x - dx; if (sx >= 0 && sx < 480) dst.c[y * 480 + x] = src.c[y * 480 + sx]; } };

// ------------------------------------------------------------------ the templates
const F = 40;
const darkPlateOnly = (b, o = {}) => { const opt = {tally: 3, glass: true, ...o}; drawDarkPlate(b, F, opt); drawDarkPlateDesk(b, F, opt); drawDarkPlateFront(b, F, opt); };
const T: Array<[string, (b: Buf) => void]> = [];

// 1 MCU (frameless bust) · MAS in the dark room: the plate soft behind him, the Orb soft at his far shoulder
T.push(['MCU-F · MAS (dark room; the Orb soft behind)', (b) => {
  drawDarkPlate(b, F, {tally: 3, glass: true});
  drawOrb(b, DPLATE.orb[0] + 30, DPLATE.orb[1] - 18, ORB_MR, {look: DPLATE_LOOK.face, aperture: 0.5, monitor: -1});
  drawDarkPlateDesk(b, F, {tally: 3, glass: true});
  soft(b, 2); vignette(b, 158);
  blitImg(b, bust(masPortrait({...MAS_PORTRAIT_DEFAULT, look: -1}), 48), 100, 20);
}]);
// 2 MCU · NELEH, right third, the boardroom soft behind (blueprint on the table)
T.push(['MCU-F · NELEH (boardroom soft)', (b) => {
  const o = {laptop: true, blueprint: 0, rolodex: true};
  drawBoardPlate(b, F, o); drawBoardPlateTable(b, F, o); drawBoardPlateFront(b, F, o);
  soft(b, 2); vignette(b, 318);
  blitImg(b, bust(nelehPortrait({...NELEH_PORTRAIT_DEFAULT, look: -1}), 48), 262, 20);
}]);
// 3 OTS · over MAS's shoulder onto MADA (the calm-off, among the fires)
T.push(['OTS · Mas fg -> MADA [M] (calm-off)', (b) => {
  drawMadaM(b, F, {mada: {head: '34', look: -1}});
  blitImg(b, shoulder(masPortrait(MAS_PORTRAIT_DEFAULT), 60, PAL.W3, 1, true), -34, 36);
}]);
// 4 reverse OTS · over MADA's shoulder onto MAS (flipped medium, still in the left third)
T.push(['OTS reverse · Mada fg -> MAS [M]', (b) => {
  const o = {laptop: false, rolodex: 'still', fires: FIRES_CALMOFF()};
  drawBoardPlate(b, F, o);
  const [mx, my] = BPLATE.left.mas;
  drawMasMedium(b, mx + 40, my, {...MAS_MEDIUM_DEFAULT, arm: 'clasp', light: 'board', head: '34', look: 0}, {flip: true, desk: (bb) => drawBoardPlateTable(bb, F, o)});
  drawBoardPlateFront(b, F, o);
  blitImg(b, shoulder(madaPortrait(MADA_PORTRAIT_DEFAULT), 60, PAL.C3, -1, false), 372, 34);
}]);
// 5 ECU · the Orb's iris, full frame (procedural: any radius, no new drawing)
T.push(['ECU-ORB · the iris, r 84 (procedural)', (b) => {
  rect(0, 0, 480, RH, b.ink(PAL.N0));
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const d = Math.hypot((x - 150) / 260, (y - 100) / 150); if (d < 0.5) b.set(x, y, PAL.N1); else if (d < 0.8 && bayer(x, y) < (0.8 - d) / 0.3) b.set(x, y, PAL.N1); }
  drawOrb(b, 262, 101, 84, {look: [-0.45, 0.2], aperture: 0.6, monitor: -1});
}]);
// 6-7 RACK FOCUS · the dark two-shot: the Orb sharp / Mas soft, then Mas sharp / the Orb soft (layer dimming)
const dark2S = (b, masMask) => {
  const o = {tally: 3, glass: true};
  drawDarkPlate(b, F, o);
  const orbMask = new Uint8Array(480 * 270);
  drawOrb(b, DPLATE.orb[0], DPLATE.orb[1], ORB_MR, {look: DPLATE_LOOK.lanyard, aperture: 0.5, monitor: -1}, orbMask);
  drawMasMedium(b, DPLATE.mas[0], DPLATE.mas[1], {...MAS_MEDIUM_DEFAULT, arm: 'phone'}, {desk: (bb) => drawDarkPlateDesk(bb, F, o), mask: masMask});
  drawDarkPlateFront(b, F, o);
  return orbMask;
};
T.push(['RACK a · the Orb sharp, Mas soft (2S)', (b) => {
  const m = new Uint8Array(480 * 270); const orb = dark2S(b, m);
  const keep = new Uint8Array(480 * 270); for (let i = 0; i < keep.length; i++) keep[i] = orb[i] ? 1 : 0;
  // widen the Orb's keep by the glass + lanyard (what it is looking at)
  for (let y = 130; y < 170; y++) for (let x = 160; x < 215; x++) keep[y * 480 + x] = 1;
  soft(b, 2, keep);
}]);
T.push(['RACK b · Mas sharp, the Orb soft (2S)', (b) => {
  const m = new Uint8Array(480 * 270); dark2S(b, m);
  soft(b, 2, m);
}]);
// 8 WHIP · mid-whip frame between the calm-off OTS and its reverse (4 frames total; this is frame 2)
T.push(['WHIP · frame 2 of 4 (row runs + smear)', (b) => {
  const a = new Buf(480, 270, PAL.N0), c = new Buf(480, 270, PAL.N0);
  T[2][1](a); T[3][1](c);
  shift(b, a, -210); shift(b, c, 270);
  whip(b, -210);
}]);
// 9 POV · the call grid (existing 26.01 layout) -> 10 POV push: the app's SPEAKER VIEW (in-world: a pinned tile)
const sh = (id) => SHOTS.find((s) => s.id === id);
T.push(['DESK-LOW · lg hourglass reads too small', (b) => {
  const o = {laptop: false, rolodex: 'still'};
  drawBoardPlate(b, F, o); drawBoardPlateTable(b, F, o); drawBoardPlateFront(b, F, o);
  soft(b, 2); vignette(b, 330);
  blitImg(b, bust(ttemmePortrait({...TTEMME_PORTRAIT_DEFAULT, gaze: 'sand', look: -1}), 48), 270, 22);
  // the table edge at desk level across the bottom, the hourglass standing on it in the foreground (sharp)
  rect(0, 176, 480, 27, b.ink(PAL.D1)); rect(0, 176, 480, 1, b.ink(PAL.D3)); rect(0, 177, 480, 1, b.ink(PAL.C2));
  drawHourglass(b, 150, 146, {sand: 0.6}, {size: 'lg'});
}]);
T.push(['SCREEN push · speaker view (pinned tile)', (b) => {
  callChrome(b, {title: 'board sync'});
  const x = 104, y = 16, w = 272, h = 154;
  rect(x - 1, y - 1, w + 2, h + 2, b.ink(PAL.C6));
  nelehTileBg(b, x, y, w, h, true);
  const clip = (px, py) => px >= x && py >= y && px < x + w && py < y + h;
  blitImg(b, nelehPortrait({...NELEH_PORTRAIT_DEFAULT, look: 0}), x + 88, y + 22, {clip});
  // the strip of the others along the bottom (in-world thumbnails)
  drawAlyiMini(b, 150, 176); drawMadaMini(b, 196, 176); rect(242, 176, 38, 22, b.ink(PAL.N0)); drawNelehMini(b, 288, 176);
}]);
// 11 FRAME-IN-FRAME · ALYI as the reflection in the boardroom's dark window: the glass is the frame (no box)
T.push(['MCU-FRAME · ALYI in the glass', (b) => {
  const o = {laptop: false, rolodex: true};
  drawBoardPlate(b, F, o); drawBoardPlateTable(b, F, o); drawBoardPlateFront(b, F, o);
  soft(b, 1);
  const img = alyiReflection({mouth: 'rest', eyes: 'open', t: 0, mirror: true});
  blitImg(b, img, 60, 8, {map: (c) => stepColor(c, -1)});
}]);
// 13 MCU-2 · a frameless 50/50: MAS left turned away (camera-left), GERG right looking at him; the bullpen by day, soft
T.push(['MCU-2 · 50/50 by day: needs the tall bust', (b) => {
  drawBullpen(b, F, {door: 'shut'});
  soft(b, 1); vignette(b, 158, 1); vignette(b, 330, 1);
  blitImg(b, bust(masPortrait({...MAS_PORTRAIT_DEFAULT, look: -1}), 48), 96, 24);
  blitImg(b, bust(gergGlow({mouth: 'rest', lid: 0, look: -1}), 48), 276, 26);
}]);
// 12 v2 for comparison: the boxed portrait window (27.12)
T.push(['v2 BOX · 27.12, for comparison', (b) => { const s = sh('27.12'); DRAW['27.12'].draw(b, 40, s, s.s + 40); }]);

// ------------------------------------------------------------------ the sheet: 3 columns at 1x, labelled
const COLS = 3, CW = 480, CH = RH + 16;
const rows = Math.ceil(T.length / COLS);
const sheet = new Buf(COLS * CW + (COLS + 1) * 8, rows * CH + (rows + 1) * 8 + 14, 0x07080d);
text(sheet, 'MR. MAS EP1 ACT FOUR - FRAMING V3 TEMPLATES - PROTOTYPE FROM EXISTING ASSETS - 480X203 ROOM AREA AT 1X - STUDIO/SRC/DEV/FRAMING-V3', 8, 5, PAL.P1);
T.forEach(([name, fn], i) => {
  const fb = new Buf(480, 270, PAL.N0);
  fn(fb);
  const cx = 8 + (i % COLS) * (CW + 8), cy = 22 + Math.floor(i / COLS) * (CH + 8);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) sheet.c[(cy + y) * sheet.w + cx + x] = fb.c[y * 480 + x];
  text(sheet, `${i + 1}  ${name.toUpperCase()}`, cx + 2, cy + RH + 4, PAL.C6);
  if (process.argv[3] === 'each') {
    const big = new Buf(960, 406, 0);
    for (let y = 0; y < 406; y++) for (let x = 0; x < 960; x++) big.c[y * 960 + x] = fb.c[(y >> 1) * 480 + (x >> 1)];
    writePNG(`${OUT}/t${String(i + 1).padStart(2, '0')}.png`, big.w, big.h, big.c);
  }
});
writePNG(`${OUT}/framing-v3-templates.png`, sheet.w, sheet.h, sheet.c);
console.log('ok', sheet.w, sheet.h);
