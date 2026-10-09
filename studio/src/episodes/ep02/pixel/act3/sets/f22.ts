// MR. MAS — Ep2 v1 · act3: F2.2, ALYI · DEC 2022 -> 2023 (sc 15's flashback, Alyi's full motive flashback: want ->
// obstacle -> turn), in the T4 GLOSSY tier (bloom and specular on the pixel base; lit by its own light; never toward
// photoreal). The shots pass, 2026-10-09. The rooms are the art pass's (art/sets/f22.ts: the holiday party's string
// lights on a slow chase, the crowd in silhouette, the racks, the offsite's lodge doorway and the UNALIGNED effigy,
// the fire's palette walk; art/sets/alyioffice.ts: the 2023 office at night, his screen, the bare Publish); this file
// stages the shots:
//   partyWide(b, f, st)      [W] 15.06 / 15.09: the party (art party22), the chant building (st.chant 0..3)
//   chantMedium(b, f, st)    [M] 15.06's middle: ALYI close under the swag of lights (it crops the top of his frame),
//                            laughing, his hand up, leading the chant (lip-synced); the crowd soft behind him
//   partyTwoShot(b, f, st)   [2S] 15.07 / 15.08's end: across the crowd: Alyi (close, the swag over his frame) talking to
//                            Mas, small in the crowd, not chanting, his glass (his room figure: its mouth, the glass
//                            raised to the toast); then Alyi's phone held up to him
//   glyphStreams(fb, k)      15.09: the racks' status lights become token streams across the room (a GLYPH layer: real
//                            tokens drawn by the Remotion host), the rows skipping his face (never in his eyes)
//   office2023(b, f, st)     [2S] 15.10-15.11: the art's screen2023 (Alyi at his screen, cropped by its bezel; Ekiel
//                            squinting at the post) under the flashback's glossy bloom
//   publish(b, f, st)        [ECU] 15.12 / 15.14: his finger over / on the bare Publish (no hover, no cursor)
//   offsiteWide(b, f, st)    [W] 15.13 / 15.15: the lodge doorway, Alyi half cut off by its jamb, the long match, the
//                            effigy catching (palette-cycled, never strobing)
//   toPoint(b, f, k)         [W -> ECU] 15.16: the fire's glow shrinking to one point of light
// No V.O. inside the memory. Nothing here is a reason for his vote or his leaving (W8): the want, the obstacle, the turn.
import {Buf, rect, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor, lightness} from '../../../../../shared/pixel/palette';
import {Mask} from '../../../../../shared/pixel/mask';
import {party22, checkInECU, offsite, fireToPoint, stringLights} from '../../art/sets/f22';
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
import {fill, pt, pw, pwrap, vramp, glossBloom, glossSpec} from '../../art/kit';
import {RH, W, putBustSoft, runOn, isSkin} from './common';

// ================================================================== the party
export const partyWide = (b: Buf, f: number, st: {chant: 0 | 1 | 2 | 3}) => { party22(b, f, {chant: st.chant}); };
/** the party's night floor behind a medium (the art's own pieces: the dark wall, the window's city, string lights, the
 *  crowd's backs), out of focus (a rung down, the bulbs kept bright) */
const partyBack = (b: Buf, f: number, crowdY = 168) => {
  vramp(b, 0, 0, W, RH, [PAL.N0, PAL.N1, PAL.U0]);
  fill(b, 300, 20, 170, 104, PAL.N0); vramp(b, 304, 24, 162, 96, [PAL.N1, PAL.N2, PAL.U1]);
  for (let k = 0; k < 60; k++) b.set(304 + Math.floor(hash(k, 1, 4) * 160), 66 + Math.floor(hash(k, 2, 4) * 50), hash(k, 3, 4) < 0.5 ? PAL.W5 : PAL.W4);
  stringLights(b, 0, 8, 480, 12, 10, f, 9); stringLights(b, 40, 34, 470, 28, 12, f + 5, 9);
  crowdBacks(b, 0, 480, crowdY, 3, f, {seed: 4, cheer: true, dim: 2});
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) { const c = b.get(x, y); if (lightness(c) < 0.5) b.set(x, y, stepColor(c, -1)); }
};
/** the swag of lights low across the frame's top (a dark garland that crops what's under it, its bulbs on the chase) */
const swag = (b: Buf, f: number, x0: number, x1: number, y: number, sag: number) => {
  for (let x = x0; x < x1; x++) { const t = (x - x0) / (x1 - x0), yy = Math.round(y + Math.sin(t * Math.PI) * sag); for (let j = 0; j < yy; j++) b.set(x, j, bayer(x, j) < 0.25 ? PAL.N1 : PAL.N0); }
  stringLights(b, x0, y - 2, x1, y - 2, sag, f + 1, 7);
};
export const chantMedium = (b: Buf, f: number, st: {mouth: AlyiWarmState['mouth']; mood?: AlyiWarmState['mood']; arm?: AlyiWarmState['arm']}) => {
  partyBack(b, f);
  putBustSoft(b, runOn(alyiWarm({mood: st.mood ?? 'laugh', mouth: st.mouth, arm: st.arm ?? 'raise', light: 'party'})), 196, 40, RH, true);
  swag(b, f, 120, 420, 54, 8);
  glossBloom(b, 0, 0, W, RH, 0.7, 1);
  glossSpec(b, [[262, 82], [318, 110]]);
};
export interface TwoShotSt { alyi: {mouth: AlyiWarmState['mouth']; mood: AlyiWarmState['mood']; arm?: AlyiWarmState['arm']}; mas: {mouth: 'rest' | 'open' | 'smile'; arm?: Mas2Arm} }
export const partyTwoShot = (b: Buf, f: number, st: TwoShotSt) => {
  partyBack(b, f, 166);
  // Mas small in the crowd, left third, not chanting, his glass (raised to the toast when asked)
  drawMasStand2(b, 96, 196, {arm: st.mas.arm ?? 'glass', mouth: st.mas.mouth, light: 'room'});
  // the crowd in front of him to his waist (he is IN the crowd)
  crowdBacks(b, 40, 170, 200, 1, f, {seed: 11, cheer: true, dim: 1});
  // Alyi close at the right, cropped by a swag of lights across the top of his frame
  putBustSoft(b, runOn(alyiWarm({mood: st.alyi.mood, mouth: st.alyi.mouth, arm: st.alyi.arm ?? 'none', light: 'party'})), 286, 56, RH);
  swag(b, f, 250, 480, 62, 12);
  glossBloom(b, 0, 0, W, RH, 0.7, 1);
  glossSpec(b, [[100, 168], [356, 88]]);
};
export const checkIn = (b: Buf, f: number, k: number) => checkInECU(b, f, {k});

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
export const offsiteWide = (b: Buf, f: number, st: {fire: 0 | 1 | 2; alyi: 'torch' | 'stand' | null}) => { offsite(b, f, st); };
export const toPoint = (b: Buf, f: number, k: number) => {
  // the fire's glow (a wide warm disc over the dark) shrinking in held steps to one point at the frame's centre: the
  // point lands where the next shot's pin pulses
  fireToPoint(b, f, k);
};
void rect; void clamp; void crowdBacks;

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
