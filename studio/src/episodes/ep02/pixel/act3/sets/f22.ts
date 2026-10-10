// MR. MAS — Ep2 v1 · act3: F2.2, ALYI · DEC 2022 -> 2023 (sc 15's flashback, Alyi's full motive flashback: want ->
// obstacle -> turn), in the T4 GLOSSY tier (bloom and specular on the pixel base; lit by its own light; never toward
// photoreal). The shots pass, 2026-10-09. The rooms are the art pass's (art/sets/f22.ts: the holiday party's string
// lights on a slow chase, the crowd in silhouette, the racks, the offsite's lodge doorway and the UNALIGNED effigy,
// the fire's palette walk; art/sets/alyioffice.ts: the 2023 office at night, his screen, the bare Publish); this file
// stages the shots:
//   partyWide(b, f, st)      [W] 15.06 / 15.09: the party (art party22, copied), the chant building (st.chant 0..3), the
//                            crowd's hands going up and bobbing on the beat (st.hands; partyCrowd)
//   chantMedium(b, f, st)    [M] 15.06's middle: ALYI close under the swag of lights (it crops the top of his frame),
//                            laughing, his hand up (alyiChant: his arm bent at the elbow), leading the chant
//                            (lip-synced); the crowd soft behind him
//   partyTwoShot(b, f, st)   [2S] 15.07 / 15.08's end: across the crowd: Alyi (close, the swag over his frame) talking to
//                            Mas, small in the crowd, not chanting, his glass (his room figure: its mouth, the glass
//                            raised to the toast); then Alyi's phone held up to him
//   glyphStreams(fb, k)      15.09: the racks' status lights become token streams across the room (a GLYPH layer: real
//                            tokens drawn by the Remotion host), the rows skipping his face (never in his eyes)
//   office2023(b, f, st)     [2S] 15.10-15.11: the art's screen2023 (Alyi at his screen, cropped by its bezel; Ekiel
//                            squinting at the post) under the flashback's glossy bloom
//   publish(b, f, st)        [ECU] 15.12 / 15.14: his finger over / on the bare Publish (no hover, no cursor)
//   checkIn(b, f, k)         [ECU] 15.08: his phone held up in one grip (common cupThumb), CHECK IN, `feel the agi`
//   offsiteWide(b, f, st)    [W] 15.13 / 15.15: the lodge doorway, Alyi half cut off by its jamb, the long match; his
//                            reach putting its flame to the effigy just outside ('touch'); the effigy catching
//                            (palette-cycled, never strobing), the match lowered
//   toPoint(b, f, k)         [W -> ECU] 15.16: the fire's glow shrinking to one point of light
// No V.O. inside the memory. Nothing here is a reason for his vote or his leaving (W8): the want, the obstacle, the turn.
import {Buf, rect, line, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {FigureDef, LightRig, P, Part, Stamp, renderFigure, blitImg} from '../../../../../shared/pixel/figure';
import {memo, seg} from '../../../../../shared/pixel/cast/kit';
import {ALYI_STAND_W, ALYI_STAND_H, ALYI_STAND_FOOT} from '../../../../../shared/pixel/cast/alyi-speak';
import {PAL, stepColor, lightness} from '../../../../../shared/pixel/palette';
import {Mask} from '../../../../../shared/pixel/mask';
import {checkInECU, fireToPoint, stringLights} from '../../art/sets/f22';
import {drawAlyiRoom2, drawTpoolCheckIn} from '../../art/cast/alyi2';
import {sleeve} from '../../art/cast/hands2';
import {publishECU} from '../../art/sets/alyioffice';
import {ekielBust} from '../../art/cast/ekiel';
import {faceLightImg} from '../../../../../shared/pixel/kits/face-light-img';
import type {Img} from '../../../../../shared/pixel/figure';
import type {Viseme} from '../../../../../shared/pixel/cast/talk';
import {alyiWarm} from '../../art/cast/alyi2';
import type {AlyiWarmState} from '../../art/cast/alyi2';
import {drawMasStand2} from '../../art/cast/mas2';
import type {Mas2Arm} from '../../art/cast/mas2';
import {crowdBacks} from '../../art/cast/civic2';
import {fill, pt, pw, pwrap, vramp, glossBloom, glossSpec, capsule, dith, tiny, tinyWidth} from '../../art/kit';
import type {Sleeve} from '../../art/kit';
import {RH, W, TR, putBustSoft, runOn, isSkin, cupThumb} from './common';

// ================================================================== the party
// THE CROWD WITH ITS HANDS UP (the review: the crowd was a still mass of head-and-shoulder blobs; no hand went up on the
// chant, so Mas, the one not chanting, had nothing to read against): art/cast/civic2 crowdBacks, copied, with arms. On
// the chant (`hands` 0..1: the share of the crowd with a hand up, in held steps as it builds) each raised arm goes up
// from the shoulder (the upper arm out, the forearm up, the hand open and lit by the bulbs), and bobs on the beat
// (96 BPM: 15 frames) in held steps, in three groups a couple of frames apart (a wave, never the whole crowd at once)
const TOPS: number[][] = [[PAL.G1, PAL.G2, PAL.G3], [PAL.F2, PAL.F3, PAL.F4], [PAL.L0, PAL.L1, PAL.L2], [PAL.U1, PAL.U2, PAL.U3], [PAL.D2, PAL.D3, PAL.D4], [PAL.N4, PAL.N5, PAL.N6], [PAL.G3, PAL.G4, PAL.G5], [PAL.R0, PAL.R1, PAL.R2], [PAL.C1, PAL.C2, PAL.C3]];
const HAIRS: number[][] = [[PAL.B0, PAL.B1], [PAL.B1, PAL.B2], [PAL.B2, PAL.B3], [PAL.B3, PAL.B4], [PAL.G3, PAL.G5], [PAL.N0, PAL.N1]];
const HSK: number[][] = [[PAL.S3, PAL.S4, PAL.S5], [PAL.S2, PAL.S3, PAL.S4], [PAL.S4, PAL.S5, PAL.S6], [PAL.D2, PAL.B3, PAL.B4]];
export const BEAT = 15;
const hashI = (n: number) => { let x = (n * 2654435761) >>> 0; x ^= x >>> 15; x = Math.imul(x, 2246822519) >>> 0; x ^= x >>> 13; return (x % 1000) / 1000; };
export const partyCrowd = (b: Buf, x0: number, x1: number, y: number, rows: number, f: number, o: {seed?: number; gap?: number; dim?: number; hands?: number; skip?: (x: number) => boolean} = {}) => {
  const seed = o.seed ?? 3, gap = o.gap ?? 13, hands = o.hands ?? 0;
  for (let r = rows - 1; r >= 0; r--) {
    const yy = y + r * 9, off = r % 2 ? Math.floor(gap / 2) : 0;
    for (let x = x0 - off, k = 0; x < x1; x += gap, k++) {
      const id = r * 97 + k * 13 + seed;
      const top = TOPS[id % TOPS.length], hair = HAIRS[(id * 7) % HAIRS.length], sk = HSK[(id * 5) % HSK.length];
      const bob = (Math.floor(f / 8) + id) % 5 === 0 ? -1 : 0;
      const dim = (c: number) => stepColor(c, -(o.dim ?? 0) - (rows - 1 - r));
      // shoulders
      for (let j = 0; j < 9; j++) for (let i = 0; i < 14; i++) { const d = Math.hypot((i - 7) / 7.5, (j - 8) / 7); if (d < 1) b.set(x + i - 2, yy + 6 + j + bob, dim(i < 4 ? top[0] : i > 10 ? top[2] : top[1])); }
      // head from behind
      for (let j = 0; j < 9; j++) for (let i = 0; i < 8; i++) { const d = Math.hypot((i - 3.5) / 4, (j - 4) / 4.6); if (d < 1) b.set(x + i + 1, yy + j - 2 + bob, dim(j < 3 ? hair[1] : hair[0])); }
      // the raised arm(s): a share of the crowd, in a stable order, so the hands go up a few at a time as it builds
      if (hands > 0 && hashI(id) < hands && !(o.skip && o.skip(x))) {
        const ph = (f + (id % 3) * 2) % BEAT, up = ph < 7 ? 2 : 0;
        const arms = hashI(id + 7) < 0.3 ? [1, -1] : [hashI(id + 3) < 0.5 ? 1 : -1];
        for (const sd of arms) {
          const sx = x + (sd > 0 ? 10 : -1), sy = yy + 8 + bob;
          const ex = sx + sd * 3, ey = sy - 7 - up, hx = sx + sd * 1, hy = sy - 16 - up;
          // upper arm (out from the shoulder), forearm (up), 2 px wide in the top's colour, its lit edge
          for (let t = 0; t <= 6; t++) { const px = Math.round(sx + (ex - sx) * t / 6), py = Math.round(sy + (ey - sy) * t / 6); b.set(px, py, dim(top[1])); b.set(px + 1, py, dim(top[2])); }
          for (let t = 0; t <= 8; t++) { const px = Math.round(ex + (hx - ex) * t / 8), py = Math.round(ey + (hy - ey) * t / 8); b.set(px, py, dim(top[1])); b.set(px + 1, py, dim(top[2])); }
          // the hand, open, lit by the string lights (a rung brighter than the crowd: the hands read before the bodies)
          const hc = (c: number) => stepColor(c, -Math.max(0, (o.dim ?? 0) - 1));
          fill(b, hx - 1, hy - 3, 3, 3, hc(sk[1])); b.set(hx - 1, hy - 3, hc(sk[2])); b.set(hx, hy - 4, hc(sk[2])); b.set(hx + 1, hy - 4, hc(sk[1])); b.set(hx - 2, hy - 2, hc(sk[1]));
        }
      }
    }
  }
};
const nightFloor = (b: Buf) => {
  // (art/sets/f22's, copied) Ep1's bullpen floor at night: the glass wall, the window's city, the desks pushed back
  vramp(b, 0, 0, 480, 150, [PAL.N0, PAL.N1, PAL.U0]);
  fill(b, 0, 150, 480, RH - 150, PAL.N1);
  fill(b, 300, 24, 170, 100, PAL.N0); vramp(b, 304, 28, 162, 92, [PAL.N1, PAL.N2, PAL.U1]);
  for (let k = 0; k < 60; k++) b.set(304 + Math.floor(hash(k, 1, 4) * 160), 70 + Math.floor(hash(k, 2, 4) * 48), hash(k, 3, 4) < 0.5 ? PAL.W5 : PAL.W4);
  for (let x = 304; x < 466; x += 40) fill(b, x, 28, 2, 92, PAL.N0);
};
const racks = (b: Buf, f: number) => {
  for (const rx of [8, 34]) { fill(b, rx, 40, 22, 110, PAL.N1); fill(b, rx, 40, 22, 1, PAL.N3); for (let u = 0; u < 20; u++) { fill(b, rx + 2, 44 + u * 5, 18, 1, PAL.N0); b.set(rx + 17, 46 + u * 5, (u + Math.floor(f / 4)) % 3 ? PAL.C6 : PAL.L3); } }
};
/** [W] the party (art/sets/f22 party22, copied so its crowd can raise its hands): st.chant 0..3 as the art's (Alyi's
 *  hand up from 1), st.hands the share of the crowd with a hand up (0 until the crowd's chant) */
export const partyWide = (b: Buf, f: number, st: {chant: 0 | 1 | 2 | 3; hands?: number}) => {
  const chant = st.chant;
  nightFloor(b);
  racks(b, f);
  stringLights(b, 0, 10, 480, 14, 10, f); stringLights(b, 60, 30, 470, 22, 14, f + 5); stringLights(b, 0, 52, 300, 44, 8, f + 3);
  // the crowd in silhouette, its hands going up with the chant (none near Alyi, so his own raised hand stays his)
  partyCrowd(b, 60, 480, 150, 4, f, {seed: 9, dim: 2, hands: st.hands ?? 0, skip: (x) => x > 172 && x < 214});
  drawAlyiRoom2(b, 190, 176, {arm: chant >= 1 ? 'raise' : 'down', light: 'party', smile: true});
  stringLights(b, 150, 74, 236, 78, 5, f + 2, 5);
  for (let y = 80; y < RH; y++) for (let x = 120; x < 280; x++) { const d = Math.hypot((x - 192) / 90, (y - 140) / 70); if (d < 1 && bayer(x, y) < (1 - d) * 0.5) b.set(x, y, stepColor(b.get(x, y), 1)); }
  glossBloom(b, 0, 0, 480, RH, 0.7, 1);
};
/** the party's night floor behind a medium (the art's own pieces: the dark wall, the window's city, string lights, the
 *  crowd's backs), out of focus (a rung down, the bulbs kept bright); `hands` as partyWide */
const partyBack = (b: Buf, f: number, crowdY = 168, hands = 0) => {
  vramp(b, 0, 0, W, RH, [PAL.N0, PAL.N1, PAL.U0]);
  fill(b, 300, 20, 170, 104, PAL.N0); vramp(b, 304, 24, 162, 96, [PAL.N1, PAL.N2, PAL.U1]);
  for (let k = 0; k < 60; k++) b.set(304 + Math.floor(hash(k, 1, 4) * 160), 66 + Math.floor(hash(k, 2, 4) * 50), hash(k, 3, 4) < 0.5 ? PAL.W5 : PAL.W4);
  stringLights(b, 0, 8, 480, 12, 10, f, 9); stringLights(b, 40, 34, 470, 28, 12, f + 5, 9);
  partyCrowd(b, 0, 480, crowdY, 3, f, {seed: 4, dim: 2, hands});
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) { const c = b.get(x, y); if (lightness(c) < 0.5) b.set(x, y, stepColor(c, -1)); }
};
/** the swag of lights low across the frame's top (a dark garland that crops what's under it, its bulbs on the chase) */
const swag = (b: Buf, f: number, x0: number, x1: number, y: number, sag: number) => {
  for (let x = x0; x < x1; x++) { const t = (x - x0) / (x1 - x0), yy = Math.round(y + Math.sin(t * Math.PI) * sag); for (let j = 0; j < yy; j++) b.set(x, j, bayer(x, j) < 0.25 ? PAL.N1 : PAL.N0); }
  stringLights(b, x0, y - 2, x1, y - 2, sag, f + 1, 7);
};
/** Alyi's chant bust (the review: his raised arm was one straight tube from the top of his shoulder): art/cast/alyi2's
 *  bust with no arm, then his arm drawn in its own sweater ramp: the upper arm out from the shoulder's side to an elbow
 *  at his side, the forearm up from it, narrowing to the wrist, the open palm (the art's openPalm, copied) above it */
const SW: Sleeve = [PAL.X0, PAL.X1, PAL.X2, PAL.W5];
const SKA = [PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6];
const openPalm = (b: Buf, x: number, y: number) => {
  for (let j = 0; j < 8; j++) for (let i = 0; i < 10; i++) b.set(x + i, y + 10 + j, j === 0 ? SKA[3] : i === 9 ? SKA[1] : i < 2 ? SKA[3] : SKA[2]);
  const L = [6, 9, 10, 7];
  for (let q = 0; q < 4; q++) {
    const cx = x + 1 + q * 2 + (q > 1 ? 1 : 0);
    for (let j = 1; j <= L[q]; j++) { b.set(cx, y + 10 - j, j === L[q] ? SKA[4] : SKA[3]); b.set(cx + 1, y + 10 - j, j === L[q] ? SKA[3] : SKA[2]); }
    if (q < 3) for (let j = 1; j <= 3; j++) b.set(cx + 2 + (q === 1 ? 1 : 0), y + 10 - j, SKA[0]);
  }
  for (let j = 0; j < 5; j++) { b.set(x - 1 - Math.floor(j / 2), y + 15 - j, SKA[3]); b.set(x - Math.floor(j / 2), y + 15 - j, SKA[2]); }
  for (let i = 1; i < 9; i++) b.set(x + i, y + 17, SKA[1]);
};
const CHANT = new Map<string, Img>();
const PAD = 16;
export const alyiChant = (s: {mood: AlyiWarmState['mood']; mouth: AlyiWarmState['mouth']}): Img => {
  const key = JSON.stringify(s); const hit = CHANT.get(key); if (hit) return hit;
  const base = alyiWarm({mood: s.mood, mouth: s.mouth, arm: 'none', light: 'party'});
  const w = base.w + PAD, h = base.h;
  const t = new Buf(w, h, TR);
  for (let y = 0; y < h; y++) for (let x = 0; x < base.w; x++) { const v = base.c[y * base.w + x]; if (v >= 0) t.set(x + PAD, y, v); }
  // shoulder (the bust's near shoulder) -> elbow (out at his side) -> wrist (up), local coordinates + PAD
  const sh: [number, number] = [PAD + 24, 112], el: [number, number] = [PAD + 2, 98], wr: [number, number] = [PAD + 10, 66];
  capsule(t, sh[0], sh[1], el[0], el[1], 7.5, SW);
  // the forearm narrowing from the elbow (7) to the wrist (4.5), the cuff a rung up near the wrist, the elbow's crease
  for (let i = 0; i <= 24; i++) { const u = i / 24, r = 7 - u * 2.5, x = el[0] + (wr[0] - el[0]) * u, y = el[1] + (wr[1] - el[1]) * u; capsule(t, x, y, x, y - 1, r, u > 0.82 ? [SW[1], SW[2], stepColor(SW[2], 1), SW[3]] : SW); }
  for (let i = 0; i < 6; i++) t.set(el[0] + 2 + i, el[1] - 3 - Math.floor(i / 2), PAL.X0);
  openPalm(t, PAD + 5, 44);
  const img: Img = {w, h, c: new Int32Array(w * h).fill(-1)};
  for (let i = 0; i < w * h; i++) if (t.c[i] !== TR) img.c[i] = t.c[i];
  CHANT.set(key, img);
  return img;
};
export const chantMedium = (b: Buf, f: number, st: {mouth: AlyiWarmState['mouth']; mood?: AlyiWarmState['mood']; arm?: AlyiWarmState['arm']}) => {
  partyBack(b, f);
  // (flipped: the image's left pad becomes its right, so the bust keeps its place)
  putBustSoft(b, runOn(alyiChant({mood: st.mood ?? 'laugh', mouth: st.mouth})), 196, 40, RH, true);
  swag(b, f, 120, 420, 54, 8);
  glossBloom(b, 0, 0, W, RH, 0.7, 1);
  glossSpec(b, [[262, 82], [318, 110]]);
};
export interface TwoShotSt { alyi: {mouth: AlyiWarmState['mouth']; mood: AlyiWarmState['mood']; arm?: AlyiWarmState['arm']}; mas: {mouth: 'rest' | 'open' | 'smile'; arm?: Mas2Arm} }
export const partyTwoShot = (b: Buf, f: number, st: TwoShotSt) => {
  // every hand up round him (the chant), his own on his glass: the one not chanting
  partyBack(b, f, 166, 0.8);
  // Mas small in the crowd, left third, not chanting, his glass (raised to the toast when asked)
  drawMasStand2(b, 96, 196, {arm: st.mas.arm ?? 'glass', mouth: st.mas.mouth, light: 'room'});
  // the crowd in front of him to his waist (he is IN the crowd), its hands up either side of him
  partyCrowd(b, 40, 170, 200, 1, f, {seed: 11, dim: 1, hands: 0.85, skip: (x) => x > 80 && x < 108});
  // Alyi close at the right, cropped by a swag of lights across the top of his frame
  putBustSoft(b, runOn(alyiWarm({mood: st.alyi.mood, mouth: st.alyi.mouth, arm: st.alyi.arm ?? 'none', light: 'party'})), 286, 56, RH);
  swag(b, f, 250, 480, 62, 12);
  glossBloom(b, 0, 0, W, RH, 0.7, 1);
  glossSpec(b, [[100, 168], [356, 88]]);
};
/** [ECU] 15.08: his phone held up in his warm hand, TPOOL's CHECK IN, `feel the agi` typed (art/sets/f22 checkInECU's
 *  bokeh and screen, re-gripped: the review found the wrap grip's fingers floating on the phone's left edge, nails to
 *  the lens, cut off by the screen from the palm and thumb). One grip: the phone held from below in his palm (common
 *  cupThumb), the fingers up behind it, the palm and the heel of the hand below its foot, the thumb over its edge onto
 *  the glass low down, clear of the words; the wrist into his sweater's cuff */
const BULBS = [PAL.W7, PAL.R3, PAL.L3, PAL.C7];
export const checkIn = (b: Buf, f: number, k: number) => {
  vramp(b, 0, 0, 480, RH, [PAL.U0, PAL.U1, PAL.N1]);
  for (let q = 0; q < 24; q++) { const cx = Math.floor(hash(q, 1, 2) * 480), cy = Math.floor(hash(q, 2, 2) * 150), c = BULBS[(q + Math.floor(f / 10)) % 4]; for (let j = -5; j <= 5; j++) for (let i = -5; i <= 5; i++) if (i * i + j * j < 26 && bayer(cx + i, cy + j) < 0.45) b.set(cx + i, cy + j, stepColor(c, -2)); }
  const P = {x: 196, y: 12, w: 92, h: 166};
  const tip: [number, number] = [P.x + P.w - 30, P.y + P.h - 14];
  cupThumb(b, P, tip, {cuffRamp: [PAL.N0, PAL.X0, PAL.X0, PAL.X1, PAL.X2, PAL.X2, PAL.W5], sleeveRamp: [PAL.N0, PAL.X0, PAL.X1, PAL.X2, PAL.W5], sleeveTo: [470, 300], widthCm: 7.2,
    drawPhone: (bb) => { fill(bb, P.x - 3, P.y - 3, P.w + 6, P.h + 6, PAL.N0); fill(bb, P.x - 3, P.y - 3, P.w + 6, 1, PAL.G3); fill(bb, P.x - 3, P.y - 3, 1, P.h + 6, PAL.G2); drawTpoolCheckIn(bb, P.x + 2, P.y + 6, P.w - 4, P.h - 12, k); }});
  glossBloom(b, 0, 0, 480, RH, 0.75, 1);
};

// ================================================================== 15.09: the token streams
/** the streams' rows (y of each band); the band where his face is (y 92..124 by x 170..214) is skipped */
const STREAM_ROWS = [40, 50, 60, 70, 80, 132, 142];
export const STREAMS_MASK = (() => {
  const m = new Mask(480, 270);
  for (const y of STREAM_ROWS) m.addRect(56, y, 424, 6);
  // the racks themselves (their status lights) are the streams' source
  m.addRect(8, 40, 48, 110);
  return m;
})();
/** 15.09's mask for a frame: the stream rows minus the crowd's raised arms (and a pixel round them), so the token rows
 *  run behind the hands instead of painting their dark band across them (the review pass: every hand up) */
const STREAMS_CLEAR = new Map<number, Mask>();
export const streamsMaskAt = (f: number): Mask => {
  const hit = STREAMS_CLEAR.get(f); if (hit) return hit;
  const A = new Buf(W, 270, PAL.N0), B = new Buf(W, 270, PAL.N0);
  partyWide(A, f, {chant: 3, hands: 1}); partyWide(B, f, {chant: 3, hands: 0});
  const m = new Mask(W, 270); m.a.set(STREAMS_MASK.a);
  for (let y = 110; y < RH; y++) for (let x = 0; x < W; x++) if (A.get(x, y) !== B.get(x, y)) for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) { const X = x + i, Y = y + j; if (X >= 0 && X < W && Y >= 0 && Y < 270) m.a[Y * W + X] = 0; }
  STREAMS_CLEAR.set(f, m); if (STREAMS_CLEAR.size > 16) STREAMS_CLEAR.delete(STREAMS_CLEAR.keys().next().value as number);
  return m;
};
/** the GLYPH source for the streams: each row a run of light moving out of the racks to the right (its head bright,
 *  its tail fading), so the host draws tokens dense at the heads and sparse behind them */
export const streamSource = (fb: Buf, k: number) => {
  const src = fb.clone();
  for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) if (STREAMS_MASK.get(x, y) > 0) src.set(x, y, PAL.N0);
  for (const [r, y] of STREAM_ROWS.entries()) {
    const head = 60 + ((k * (34 + (r % 3) * 9) + r * 53) % 460);
    for (let x = 56; x < 480; x++) { const d = head - x; if (d < 0 || d > 220) continue; const t = 1 - d / 220; for (let j = 0; j < 6; j++) src.set(x, y + j, t > 0.9 ? PAL.C9 : t > 0.7 ? PAL.C7 : t > 0.45 ? PAL.C5 : t > 0.2 ? PAL.C3 : PAL.C2); }
  }
  for (let y = 40; y < 150; y++) for (let x = 8; x < 56; x++) if (bayer(x, y + k) < 0.5) src.set(x, y, PAL.C6);
  return src;
};

// ================================================================== 2023: the office, the post, Publish
/** a person at a screen at night (P8: a person, not a hologram): his own skin and clothes a rung into the dark room,
 *  keyed one step from the screen (camera-left) on the face, the screen's cyan only as a thin rim on the edge toward
 *  it; the far side a rung lower */
const NIGHT = new Map<object, Img>();
const screenLit = (im: Img): Img => {
  const hit = NIGHT.get(im); if (hit) return hit;
  const lit = faceLightImg(im, 1, {key: [-1, -0.1]});
  const c = lit.c.slice();
  for (let y = 0; y < im.h; y++) for (let x = 0; x < im.w; x++) {
    const i = y * im.w + x, v = lit.c[i];
    if (v < 0) continue;
    const L = lightness(v);
    // the room's dark: everything a rung down but the lit skin; the far half a rung more
    let n = stepColor(v, isSkin(v) && x < im.w * 0.55 ? 0 : -1);
    if (x > im.w * 0.62 && L < 0.6) n = stepColor(n, -1);
    // the rim toward the screen: the first opaque pixel from the left in each row
    if (x === 0 || lit.c[i - 1] < 0) n = L > 0.3 ? PAL.C6 : PAL.C4;
    c[i] = n;
  }
  const out = {...im, c};
  NIGHT.set(im, out);
  return out;
};
let NIGHT_BG: Buf | null = null;
const night2023 = (): Buf => {
  if (NIGHT_BG) return NIGHT_BG;
  const b = new Buf(W, 270, PAL.N0);
  vramp(b, 0, 0, W, RH, [PAL.N0, PAL.N1, PAL.N1]);
  // the window far right: the city at night, the glazing bars
  fill(b, 392, 18, 88, 110, PAL.N0); vramp(b, 396, 22, 84, 102, [PAL.N1, PAL.N2, PAL.U0]);
  for (let k = 0; k < 30; k++) b.set(398 + Math.floor(hash(k, 1, 6) * 80), 60 + Math.floor(hash(k, 2, 6) * 60), hash(k, 3, 6) < 0.5 ? PAL.W5 : PAL.W4);
  fill(b, 436, 22, 2, 102, PAL.N0);
  // his chair's high back behind him (2023: it is still here), dark mesh
  fill(b, 196, 40, 96, 163, PAL.N1); fill(b, 196, 40, 96, 1, PAL.N3); for (let y = 44; y < RH; y += 4) for (let x = 200; x < 288; x += 4) b.set(x + ((y >> 2) & 1) * 2, y, PAL.N2);
  // the screen's light falling across the room from the left
  for (let y = 0; y < RH; y++) for (let x = 150; x < W; x++) if (bayer(x, y) < Math.max(0, 0.45 - (x - 150) / 520)) b.set(x, y, stepColor(b.get(x, y), 1));
  NIGHT_BG = b;
  return b;
};
/** [2S] 15.10-15.11: this office, 2023, night: his screen close at frame left (in their eyeline), its bezel cropping
 *  Alyi's near shoulder (his frame rule); Alyi at it, Ekiel behind his shoulder squinting at the post; the post in its
 *  own UI, INTRODUCING SUPERALIGNMENT · ALYI, EKIEL, its hard sentence; the bare Publish under it; the flashback's bloom */
export const office2023 = (b: Buf, f: number, st: {alyiMouth?: Viseme; ekielMouth?: Viseme; ekielLid?: 0 | 1 | 2; alyiRead?: number}) => {
  b.c.set(night2023().c.subarray(0, W * RH));
  putBustSoft(b, screenLit(ekielBust({mouth: st.ekielMouth ?? 'rest', expr: 'squint', lanyard: 'none', lid: st.ekielLid ?? 0})), 300, 48, RH);
  // the window's city lights twinkle (slowly, a few at a time)
  for (let q = 0; q < 6; q++) { const x = 398 + Math.floor(hash(q, 7, Math.floor(f / 24)) * 80), y = 60 + Math.floor(hash(q, 8, Math.floor(f / 24)) * 60); b.set(x, y, PAL.W6); }
  putBustSoft(b, screenLit(runOn(alyiWarm({mood: 'focus', mouth: st.alyiMouth ?? 'rest', arm: 'none', light: 'party'}))), 168, 58, RH);
  // the screen (close, left), the post in its own UI, the bezel's right edge over his near shoulder
  fill(b, 0, 8, 186, 195, PAL.N0); fill(b, 4, 14, 176, 189, PAL.N2); fill(b, 183, 8, 3, 195, PAL.N3);
  fill(b, 10, 22, 164, 22, PAL.C1); pt(b, 'INTRODUCING', 14, 24, PAL.P2); pt(b, 'SUPERALIGNMENT', 14, 33, PAL.C8);
  pt(b, 'ALYI, EKIEL', 14, 50, PAL.N7);
  const s0 = 'Currently, we don\'t have a solution for steering or controlling a potentially superintelligent AI, and preventing it from going rogue.';
  pwrap(s0, 156).forEach((l, i) => pt(b, l, 14, 66 + i * 11, PAL.P1));
  fill(b, 14, 176, pw('Publish') + 12, 16, PAL.C3); pt(b, 'Publish', 20, 180, PAL.P2);
  // the caret blinking after the byline (the post still a draft)
  if (Math.floor(f / 12) % 2 === 0) fill(b, 14 + pw('ALYI, EKIEL') + 2, 49, 1, 9, PAL.C6);
  void st.alyiRead;
  glossBloom(b, 0, 0, W, RH, 0.72, 1);
  void f;
};
export const publish = (b: Buf, f: number, st: {press: boolean}) => {
  publishECU(b, f, {press: st.press, who: 'alyi'});
  glossBloom(b, 0, 0, W, RH, 0.72, 1);
};

// ================================================================== the offsite
// THE OFFSITE (art/sets/f22 offsite, copied and restaged: the review found Alyi in the lodge doorway about 125 px from
// the effigy while it caught, so the fire had no visible cause, and crosscut with Publish it read as if the click lit
// it). The effigy now stands just outside the doorway; Alyi, still in the doorway with its jamb over his back half,
// reaches his long match to its lower body (one held drawing, 'touch') before the whoomph; after it, the match lowered.
// His room figure is the art's (art/cast/alyi2 drawAlyiRoom2) with one more arm, 'reach', copied below.
const SHEAD_R = [
  '....oo4455oo....', '..o344455555o...', '.o33444455554o..', '.o3344444555o5..', 'hh2334444455o...', 'hhh23444bbbbb...', 'hhh2234eO4Oe4o..',
  'hhh22334444444o.', '.hh22334444444o5', '.oh2233444444o..', '..o122334mmm4o..', '..o122334444443.', '...o1222333332..', '....o11222......', '.....o1122......', '.....o1122......', '.....o1122......',
];
interface AlyiRoomR { arm: 'reach' | 'down'; light: 'party' | 'fire' | 'room'; smile?: boolean; f?: number }
const rfigR = (p: AlyiRoomR): FigureDef => {
  const leg = (g: string, hip: number, kx: number, ax: number): Part[] => [
    {group: g, mat: 'pants', prims: [seg(hip, 44, 7.2, kx, 58, 5.8), seg(kx, 58, 5.6, ax, 73, 4.6), P.ell(kx, 58, 2.8, 2.6)]},
    {group: g + 's', mat: 'shoe', prims: [P.poly(ax - 2.4, 72, ax + 2.4, 72, ax + 6, 75, ax + 6, 78, ax - 2.8, 78)]},
  ];
  const sl = (g: string, sx: number, sy: number, ex: number, ey: number, hx: number, hy: number): Part => ({group: g, mat: 'sw', prims: [P.ell(sx, sy, 3.6, 3.8), seg(sx, sy, 6.6, ex, ey, 5.8), seg(ex, ey, 5.6, hx, hy, 4.8), P.ell(ex, ey, 2.8, 2.8)]});
  // 'reach': the near arm out and down from the shoulder, the elbow a little bent, the hand forward at his hip's height
  const N = p.arm === 'reach' ? [31, 31, 38, 39] : [26, 32, 26.4, 41];
  const parts: Part[] = [
    ...leg('legF', 15.5, 15.4, 15), sl('armF', 14, 21, 14, 32, 14.4, 41), ...leg('legN', 21, 21.4, 21.6),
    {group: 'torso', mat: 'sw', prims: [P.poly(13, 18, 19, 16, 25, 17, 28, 21, 28, 30, 27, 37, 28, 45, 11, 45, 11, 38, 10, 30, 10, 22)]},
    sl('armN', 25, 21, N[0], N[1], N[2], N[3]),
  ];
  const rows = SHEAD_R.slice();
  if (p.smile) { rows[6] = 'hhh2234bb4bb4o..'; rows[10] = '..o12233m444m4o.'; rows[11] = '..o122334mmm43..'; }
  const stamps: Stamp[] = [{x: 11, y: 0, rows, pal: {o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5], h: ['hair', 1], b: ['hair', 0], e: ['dark', 0], O: ['glint', 0], m: ['skin', 1], M: ['dark', 0]}}];
  const hand = (x: number, y: number) => ({x: Math.round(x) - 1, y: Math.round(y) - 1, rows: ['.34.', '3445', '2344', '.22.'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5]} as Stamp['pal']});
  stamps.push(hand(14.4, 41));
  stamps.push(hand(N[2], N[3]));
  return {w: ALYI_STAND_W, h: ALYI_STAND_H, parts, adjust: [{prims: [P.rect(0, 60, ALYI_STAND_W, 20)], add: -1, onlyMat: 'pants'}], stamps};
};
const RAMP_R = (light: AlyiRoomR['light']): Record<string, number[]> => light === 'fire' ? {
  skin: [PAL.S0, PAL.S2, PAL.S4, PAL.S5, PAL.S6, PAL.W8], hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.W3, PAL.W5], sw: [PAL.N0, PAL.W0, PAL.W1, PAL.W2, PAL.W3, PAL.W6],
  pants: [PAL.N0, PAL.N0, PAL.W0, PAL.W1, PAL.W2, PAL.W3], shoe: [PAL.N0, PAL.N0, PAL.D1, PAL.D2, PAL.D3, PAL.W3], glint: Array(6).fill(PAL.W8), dark: Array(6).fill(PAL.N0),
} : {
  skin: [PAL.S0, PAL.S1, PAL.S3, PAL.S4, PAL.S5, PAL.W8], hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.W4], sw: [PAL.N0, PAL.N1, PAL.X0, PAL.X1, PAL.X2, PAL.W5],
  pants: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N5], shoe: [PAL.N0, PAL.N0, PAL.D1, PAL.D2, PAL.D3, PAL.W3], glint: Array(6).fill(PAL.W8), dark: Array(6).fill(PAL.N0),
};
const rrigR = (light: AlyiRoomR['light']): LightRig => ({
  key: light === 'fire' ? [1, -0.4] : [0.55, -0.83], keyBand: 3, shadowBand: 3, rim: true, outline: true,
  back: [-1, -0.1], backBand: 1, backRamp: {skin: PAL.W6, hair: PAL.W4, sw: PAL.W4, pants: PAL.W3, shoe: PAL.W2},
  ramps: RAMP_R(light),
  groupBands: {torso: {key: 3, shadow: 3}, armN: {key: 2, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 2}},
  keyGain: (_x, y) => (y < 44 ? 1 : Math.max(0.25, 1 - (y - 44) / 34)),
});
const roomR = memo((p: AlyiRoomR) => renderFigure(rfigR({...p, f: 0}), rrigR(p.light)));
const FIRE = [PAL.R1, PAL.R2, PAL.W5, PAL.W6, PAL.W7, PAL.W8];
/** the fire (the art's): a palette-cycled body of flame tongues (held 3 frames a drawing; the colours walk) */
const fireBody = (b: Buf, cx: number, by: number, w: number, h: number, f: number) => {
  const ph = Math.floor(f / 3);
  for (let i = -w; i <= w; i++) {
    const top = h * (1 - Math.abs(i) / (w + 1)) * (0.7 + 0.3 * hash(i, ph % 5, 7));
    for (let j = 0; j < top; j++) { const t = j / Math.max(1, top); const k = clamp(Math.floor((1 - t) * 5 + ((ph + i) % 3) * 0.4), 0, 5); b.set(cx + i, by - j, FIRE[k]); }
  }
};
/** the effigy (the art's paperclip robot of our own design, UNALIGNED on its front panel); its arms raised up and
 *  out (the near one no longer reaches across the doorway) */
const effigy = (b: Buf, x: number, y: number, burn: number) => {
  const wood = burn >= 2 ? [PAL.N1, PAL.D1, PAL.W3] : [PAL.D2, PAL.D3, PAL.D4];
  fill(b, x + 18, y - 12, 4, 12, wood[0]); fill(b, x + 10, y - 2, 20, 2, wood[0]);
  const loop = (lx: number, ly: number, w: number, h: number) => { for (let i = 0; i < w; i++) { b.set(lx + i, ly, wood[2]); b.set(lx + i, ly + 1, wood[1]); b.set(lx + i, ly + h, wood[1]); b.set(lx + i, ly + h + 1, wood[0]); } for (let j = 0; j < h; j++) { b.set(lx, ly + j, wood[2]); b.set(lx + 1, ly + j, wood[1]); b.set(lx + w - 1, ly + j, wood[1]); b.set(lx + w, ly + j, wood[0]); } };
  loop(x + 4, y - 60, 32, 50); loop(x + 10, y - 50, 20, 36); loop(x + 12, y - 78, 16, 16);
  b.set(x + 16, y - 72, PAL.G5); b.set(x + 23, y - 72, PAL.G5);
  line(x + 4, y - 50, x - 2, y - 70, b.ink(wood[1])); line(x + 36, y - 50, x + 50, y - 66, b.ink(wood[1]));
  const wd = tinyWidth('UNALIGNED') + 4; fill(b, x + 20 - (wd >> 1), y - 32, wd, 9, PAL.P1); tiny(b, 'UNALIGNED', x + 22 - (wd >> 1), y - 30, PAL.N1);
};
const matchFlameS = (b: Buf, x: number, y: number, f: number) => {
  const ph = Math.floor(f / 3) % 3, H = [4, 5, 4][ph];
  for (let j = 0; j < H; j++) { const w = j < 2 ? 1 : 0; for (let i = -w; i <= w; i++) b.set(x + i + (j === H - 1 && ph === 1 ? 1 : 0), y - j, j === 0 ? PAL.W8 : j < 2 ? (i === 0 ? PAL.W9 : PAL.W6) : PAL.W5); }
};
/** the effigy's x (its left edge; its body's outer loop from x + 4) and Alyi's foot in the doorway */
// (the effigy stands forward of the lodge, its feet lower in the frame than the doorway's sill, so it reads as out on
// the ground in front of him, not in the doorway beside him)
export const EFF = {x: 96, y: 168}, ALYI_FOOT: [number, number] = [62, 150];
export const offsiteWide = (b: Buf, f: number, st: {fire: 0 | 1 | 2; alyi: 'torch' | 'stand' | 'touch' | 'lowered' | null}) => {
  const fr = st.fire;
  vramp(b, 0, 0, 480, 140, [PAL.N0, PAL.N1, PAL.U0]);
  for (let k = 0; k < 9; k++) { const tx = 140 + k * 40, th = 70 + (k * 23) % 40; for (let j = 0; j < th; j++) { const w = Math.round((j / th) * 12); fill(b, tx - w, 140 - th + j, w * 2 + 1, 1, PAL.L0); } }
  fill(b, 0, 140, 480, RH - 140, PAL.D0); for (let x = 0; x < 480; x++) if (hash(x, 3, 2) < 0.3) b.set(x, 140, PAL.D1);
  fill(b, 0, 20, 120, 130, PAL.D1); for (let y = 22; y < 150; y += 8) fill(b, 0, y, 120, 1, PAL.D0);
  fill(b, 60, 50, 46, 100, PAL.W4); dith(b, 60, 50, 46, 100, 0.4, PAL.W5); fill(b, 56, 46, 4, 104, PAL.D3); fill(b, 106, 46, 4, 104, PAL.D3); fill(b, 56, 44, 54, 4, PAL.D3);
  // the staff in silhouette, watching from beyond the effigy
  crowdBacks(b, 180, 440, 150, 2, f, {seed: 5, dim: 3});
  effigy(b, EFF.x, EFF.y, fr);
  if (fr >= 1) fireBody(b, EFF.x + 20, EFF.y, fr === 1 ? 8 : 26, fr === 1 ? 16 : 70, f);
  const [fx, fy] = ALYI_FOOT, x0 = fx - ALYI_STAND_FOOT[0], y0 = fy - ALYI_STAND_FOOT[1];
  if (st.alyi === 'torch' || st.alyi === 'stand') drawAlyiRoom2(b, fx, fy, {arm: st.alyi === 'torch' ? 'torch' : 'down', light: 'fire', f}, {clip: (x) => x >= 60});
  if (st.alyi === 'touch' || st.alyi === 'lowered') {
    blitImg(b, roomR({arm: st.alyi === 'touch' ? 'reach' : 'down', light: 'fire', f: 0}), x0, y0, {clip: (x) => x >= 60});
    // the long fireplace match: from his hand, its head on the effigy's lower body and its flame there ('touch'), or
    // lowered at his side, spent ('lowered')
    if (st.alyi === 'touch') {
      const hx = x0 + 39, hy = y0 + 40, tx = EFF.x + 5, ty = EFF.y - 38;
      line(hx, hy, tx, ty, b.ink(PAL.W6)); line(hx, hy + 1, tx, ty + 1, b.ink(PAL.D4));
      b.set(tx, ty, PAL.R2); b.set(tx + 1, ty, PAL.R1); matchFlameS(b, tx + 1, ty - 1, f);
      // the flame's light on the wood it touches
      for (let j = -6; j <= 6; j++) for (let i = -2; i <= 8; i++) { const X = tx + i, Y = ty + j, c = b.get(X, Y); if (Math.hypot(i - 2, j) < 6 && (c === PAL.D3 || c === PAL.D4 || c === PAL.D2)) b.set(X, Y, PAL.W3); }
    } else { const hx = x0 + 27, hy = y0 + 42; line(hx, hy, hx + 5, hy + 15, b.ink(PAL.W5)); b.set(hx + 5, hy + 16, PAL.N1); }
  }
  // the doorway's left jamb over his back half (his frame rule: half cut off)
  if (st.alyi) { fill(b, 56, 46, 4, 104, PAL.D3); fill(b, 56, 46, 1, 104, PAL.D4); }
  // the light: the match's on his face while he holds it to the wood; the fire's on everything once it catches
  if (st.alyi === 'touch') for (let y = 60; y < 150; y++) for (let x = 40; x < 130; x++) { const d = Math.hypot((x - (EFF.x + 6)) / 50, (y - (EFF.y - 40)) / 40); if (d < 1 && bayer(x, y) < (1 - d) * 0.35) { const c = b.get(x, y); if (!FIRE.includes(c)) b.set(x, y, stepColor(c, 1)); } }
  if (fr >= 1) for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const d = Math.hypot((x - EFF.x - 20) / (fr === 1 ? 90 : 200), (y - EFF.y + 30) / (fr === 1 ? 60 : 120)); if (d < 1 && bayer(x, y) < (1 - d) * 0.55) { const c = b.get(x, y); if (!FIRE.includes(c)) b.set(x, y, lightness(c) < 0.15 ? PAL.W1 : stepColor(c, 1)); } }
  glossBloom(b, 0, 0, 480, RH, 0.72, 1);
};
export const toPoint = (b: Buf, f: number, k: number) => {
  // the fire's glow (a wide warm disc over the dark) shrinking in held steps to one point at the frame's centre: the
  // point lands where the next shot's pin pulses
  fireToPoint(b, f, k);
};
void rect; void clamp; void crowdBacks; void sleeve; void checkInECU;

/** [M] 15.13's middle: ALYI in the lodge doorway, closer: the doorway's warm light behind him, the timber jamb cutting
 *  off his near side (his frame rule: half cut off), the long match's flame in his hand lighting his face, lit and
 *  calm (no zealot framing: an ordinary man at a company event, steady) */
export const offsiteMedium = (b: Buf, f: number) => {
  // the night beyond (trees), the lodge's timber wall, the doorway's warm light behind him
  vramp(b, 0, 0, W, RH, [PAL.N0, PAL.N1, PAL.U0]);
  for (let k = 0; k < 6; k++) { const tx = 320 + k * 34, th = 120 + (k * 37) % 50; for (let j = 0; j < th; j++) { const w = Math.round((j / th) * 18); fill(b, tx - w, RH - th + j, w * 2 + 1, 1, PAL.L0); } }
  fill(b, 0, 0, 300, RH, PAL.D1); for (let y = 4; y < RH; y += 12) fill(b, 0, y, 300, 1, PAL.D0);
  fill(b, 110, 10, 170, RH, PAL.W4); for (let y = 10; y < RH; y++) for (let x = 110; x < 280; x++) if (bayer(x, y) < 0.35) b.set(x, y, PAL.W5);
  putBustSoft(b, runOn(alyiWarm({mood: 'calm', mouth: 'rest', arm: 'torch', light: 'fire', f})), 150, 40, RH, true);
  // the jamb over his near half (the doorway's left post), its lit edge
  fill(b, 96, 0, 104, RH, PAL.D2); fill(b, 196, 0, 4, RH, PAL.D4); for (let y = 0; y < RH; y += 9) fill(b, 96, y, 100, 1, PAL.D1);
  glossBloom(b, 0, 0, W, RH, 0.72, 1);
};
