// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Prototype 2's temp sound pass, to the brief (style-jumps §3.4 and §5.2), final polish (the tear):
//   p0-29    the room: server hum (the intro's tuned bed) + the rack's tick on straight eighths (panned to the rack)
//   p30      the tick stops dead. One dry micro-crack as the tear starts behind the window head, and one when its
//            tip stops in open sky: one sound per event (a tear turns no corners; the fracture build had five)
//   p38-44   nothing new: the hairline holds in silence
//   p45      (beat 4) the hum and every chip sound cut. In their place, from the gap: night air, full band, wide,
//            quiet, AT FULL LEVEL on the cut (the polish pass's rule: any rise inside a jump is a riser)
//   p90-104  the seal: the air band-limits and narrows with each step (7 / 3 / 1 / scar)
//   p105     the hum and the rack tick return IN PHASE (the grid kept counting)
// No stinger, no whoosh, no riser, no held tone under the crack, no V.O. A jump subtracts.
// The air is a stand-in built from decorrelated noise (the library has no outdoor recording yet); §7.2 hands the
// audio owner "a small library of real outdoor air beds for M1": drop one in at AIR_FILE and it replaces the stand-in.
//   node mix.js <audioRoot> <out.wav> [airFile.wav]
import * as fs from 'fs';
import {T} from '../timing';
import {TEAR, tearTip} from '../tear';

const [root, outPath, airFile] = process.argv.slice(2);
const SR = 48000, FPS = 24, N = 120;
const LEN = Math.round((N / FPS) * SR);
const at = (p: number) => Math.round((p / FPS) * SR);

// ------------------------------------------------------------------ wav io (PCM 16/24, any channels -> stereo float)
const readWav = (path: string) => {
  const b = fs.readFileSync(path);
  let o = 12, fmt = null, data = null;
  while (o < b.length - 8) {
    const id = b.toString('ascii', o, o + 4), sz = b.readUInt32LE(o + 4);
    if (id === 'fmt ') fmt = {ch: b.readUInt16LE(o + 10), sr: b.readUInt32LE(o + 12), bits: b.readUInt16LE(o + 22)};
    if (id === 'data') data = b.subarray(o + 8, o + 8 + sz);
    o += 8 + sz + (sz & 1);
  }
  const bps = fmt.bits / 8, n = Math.floor(data.length / (bps * fmt.ch));
  const L = new Float32Array(n), R = new Float32Array(n);
  for (let i = 0; i < n; i++) for (let c = 0; c < Math.min(2, fmt.ch); c++) {
    const q = (i * fmt.ch + c) * bps;
    const v = bps === 3 ? ((data[q] | (data[q + 1] << 8) | (data[q + 2] << 16)) << 8 >> 8) / 8388608 : data.readInt16LE(q) / 32768;
    (c === 0 ? L : R)[i] = v;
    if (fmt.ch === 1) R[i] = v;
  }
  if (fmt.sr !== SR) throw new Error(`${path}: ${fmt.sr} Hz (want ${SR})`);
  return {L, R, n};
};
const writeWav = (path: string, L: Float32Array, R: Float32Array) => {
  const n = L.length, b = Buffer.alloc(44 + n * 6);
  b.write('RIFF', 0); b.writeUInt32LE(36 + n * 6, 4); b.write('WAVE', 8); b.write('fmt ', 12); b.writeUInt32LE(16, 16);
  b.writeUInt16LE(1, 20); b.writeUInt16LE(2, 22); b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 6, 28); b.writeUInt16LE(6, 32); b.writeUInt16LE(24, 34);
  b.write('data', 36); b.writeUInt32LE(n * 6, 40);
  for (let i = 0; i < n; i++) for (const [c, A] of [[0, L], [1, R]] as const) {
    const v = Math.max(-8388608, Math.min(8388607, Math.round(A[i] * 8388607)));
    const q = 44 + i * 6 + c * 3;
    b[q] = v & 255; b[q + 1] = (v >> 8) & 255; b[q + 2] = (v >> 16) & 255;
  }
  fs.writeFileSync(path, b);
};
const db = (d: number) => Math.pow(10, d / 20);
/** equal-power pan, -1 left .. 1 right */
const pan = (x: number) => [Math.cos(((x + 1) * Math.PI) / 4), Math.sin(((x + 1) * Math.PI) / 4)];

// deterministic PRNG (no Math.random: the mix is reproducible)
let seed = 0x9e3779b9;
const rnd = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return ((seed >>> 0) / 4294967296); };

const L = new Float32Array(LEN), R = new Float32Array(LEN);
const add = (i: number, l: number, r: number) => { if (i >= 0 && i < LEN) { L[i] += l; R[i] += r; } };

// ------------------------------------------------------------------ 1. the room: the hum (on while the grid is)
const hum = readWav(`${root}/intro-sfx/src/server_hum_tuned.wav`);
const HUM = db(-17);
const roomOn = (i: number) => i < at(T.open) || i >= at(T.back);
const edge = 96; // 2 ms declick at each cut: the cuts are hard, not fades
for (let i = 0; i < LEN; i++) {
  if (!roomOn(i)) continue;
  // the bed runs on its own clock (sample i of the loop), so it comes back exactly where it would have been
  const j = i % hum.n;
  let g = HUM;
  const dOut = at(T.open) - i, dIn = i - at(T.back);
  if (dOut >= 0 && dOut < edge) g *= dOut / edge;
  if (dIn >= 0 && dIn < edge) g *= dIn / edge;
  add(i, hum.L[j] * g, hum.R[j] * g);
}

// ------------------------------------------------------------------ 2. the rack's tick (the chip layer), straight eighths
const tick = readWav(`${root}/intro-sfx/src/x_cut_tick.wav`);
const [tl, tr] = pan(0.75); // the rack is screen right
for (let k = 0; ; k++) {
  const p = k * 7.5;
  if (p >= N) break;
  if (p >= T.crack && p < T.back) continue; // stops dead on p30; back on p105, on the grid it kept
  const i0 = at(p), g = db(-24) * (k % 2 ? 0.7 : 1);
  for (let j = 0; j < tick.n; j++) add(i0 + j, tick.L[j] * g * tl * 1.4, tick.R[j] * g * tr * 1.4);
}

// ------------------------------------------------------------------ 3. two dry micro-cracks: the tear's two events
// grains cut from the library's glass crack (hourglass_shatter's first transients), high-passed and gated dry
const glass = readWav(`${root}/sfx/wav/hourglass_shatter.wav`);
const OFFS = [0.0, 0.1];
// the birth (behind the window head) and the arrest (the tip stops in open sky)
let arrest = T.crack;
while (arrest < T.open && tearTip(arrest) < TEAR.tip) arrest++;
const hits = [{p: T.crack, x: TEAR.x}, {p: arrest, x: TEAR.x}];
hits.forEach(({p, x}, k) => {
  const [gl, gr] = pan(Math.max(-0.85, Math.min(0.85, (x / 480) * 2 - 1)));
  const s0 = Math.round(OFFS[k % OFFS.length] * SR), len = Math.round((0.014 + 0.01 * rnd()) * SR);
  const g = db(-9 - (k ? 4 : 0));
  const i0 = at(p) + (k ? Math.round(0.02 * SR) : 0);
  let pl = 0, pr = 0;
  for (let j = 0; j < len; j++) {
    const e = Math.exp(-j / (0.0035 * SR)) * Math.min(1, j / 24);
    const a = glass.L[s0 + j] ?? 0, b = glass.R[s0 + j] ?? 0;
    const hl = a - pl, hr = b - pr; pl = a; pr = b; // first difference: thin, dry, no body
    const m = (hl + hr) * 0.5 * e * g * 2.2;
    add(i0 + j, m * gl, m * gr);
  }
});
console.error('micro-cracks at', JSON.stringify(hits));

// ------------------------------------------------------------------ 4. night air through the gap
// the gap's held steps drive the air: level, band and width (1.0 = full band, full width)
// (polish pass) the air is at full level, full band, full width ON THE CUT: no entry steps, nothing rises. Only the
// seal steps it down, band-limiting and narrowing with each held step of the picture.
const AIR = [
  {p: T.open, lvl: 0, lp: 20000, w: 1},
  {p: T.seal, lvl: -3, lp: 7000, w: 0.6}, {p: T.seal + 4, lvl: -7, lp: 2600, w: 0.3}, {p: T.seal + 8, lvl: -12, lp: 1100, w: 0.1}, {p: T.seal + 12, lvl: -18, lp: 450, w: 0},
];
const stepAt = (i: number) => { let s = null; for (const a of AIR) if (i >= at(a.p)) s = a; return s; };
const AIR_GAIN = db(-28); // ~10 dB under the room it replaces (polish pass: -20 sat only 3-6 dB under)
if (airFile && fs.existsSync(airFile)) {
  // a real recording, when the audio owner delivers one: same steps, same filters
  const a = readWav(airFile);
  var srcL = (i: number) => a.L[i % a.n], srcR = (i: number) => a.R[i % a.n];
} else {
  // stand-in: pink noise (Kellet), decorrelated L/R with a shared low band, slow gusts, a far city rumble
  const pinkGen = () => { let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0; return () => { const w = rnd() * 2 - 1; b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852; b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898; const o = b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362; b6 = w * 0.115926; return o * 0.11; }; };
  const pl = pinkGen(), pr = pinkGen(), pc = pinkGen();
  const n0 = at(T.open), n1 = at(T.back);
  const bl = new Float32Array(LEN), br = new Float32Array(LEN);
  let lo = 0, lo2 = 0;
  const kLo = 1 - Math.exp((-2 * Math.PI * 140) / SR);
  for (let i = n0; i < n1; i++) {
    const t = i / SR;
    const c = pc();
    lo += kLo * (c - lo); lo2 += kLo * (lo - lo2); // the far city: a shared low rumble
    const gl = 0.78 + 0.22 * Math.sin(2 * Math.PI * 0.19 * t + 0.7) * Math.sin(2 * Math.PI * 0.07 * t + 2.1);
    const gr = 0.78 + 0.22 * Math.sin(2 * Math.PI * 0.16 * t + 2.4) * Math.sin(2 * Math.PI * 0.05 * t + 0.3);
    bl[i] = pl() * gl + lo2 * 0.9; br[i] = pr() * gr + lo2 * 0.9;
  }
  var srcL = (i: number) => bl[i], srcR = (i: number) => br[i];
}
{
  let l1 = 0, l2 = 0, r1 = 0, r2 = 0;
  const n0 = at(T.open), n1 = at(T.back);
  for (let i = n0; i < n1; i++) {
    const s = stepAt(i);
    const k = 1 - Math.exp((-2 * Math.PI * s.lp) / SR);
    let a = srcL(i), b = srcR(i);
    if (s.lp < 20000) { l1 += k * (a - l1); l2 += k * (l1 - l2); r1 += k * (b - r1); r2 += k * (r1 - r2); a = l2; b = r2; } else { l1 = l2 = a; r1 = r2 = b; }
    // width: mid/side
    const m = (a + b) * 0.5, sd = (a - b) * 0.5 * s.w;
    let g = AIR_GAIN * db(s.lvl);
    const dIn = i - n0, dOut = n1 - i;
    if (dIn < edge) g *= dIn / edge;
    if (dOut < edge) g *= dOut / edge;
    add(i, (m + sd) * g, (m - sd) * g);
  }
}

// ------------------------------------------------------------------ out
let pk = 0;
for (let i = 0; i < LEN; i++) pk = Math.max(pk, Math.abs(L[i]), Math.abs(R[i]));
const MASTER = db(6); // review level: the room sits near -26 dBFS RMS
const norm = pk * MASTER > db(-1) ? db(-1) / pk : MASTER;
for (let i = 0; i < LEN; i++) { L[i] *= norm; R[i] *= norm; }
writeWav(outPath, L, R);
const rms = (a: number, b: number) => { let s = 0; for (let i = at(a); i < at(b); i++) s += (L[i] * L[i] + R[i] * R[i]) / 2; return (10 * Math.log10(s / Math.max(1, at(b) - at(a)))).toFixed(1); };
const peak = (a: number, b: number) => { let m = 0; for (let i = at(a); i < at(b); i++) m = Math.max(m, Math.abs(L[i]), Math.abs(R[i])); return (20 * Math.log10(m || 1e-9)).toFixed(1); };
console.log(JSON.stringify({out: outPath, seconds: LEN / SR, peakNormDb: (20 * Math.log10(norm)).toFixed(1),
  room: {rms: rms(0, 30), peak: peak(0, 30)}, cracks: {rms: rms(30, 50), peak: peak(30, 50)},
  airOpen: {rms: rms(50, 60)}, airPour: {rms: rms(60, 90), peak: peak(60, 90)}, seal: {rms: rms(90, 105)}, back: {rms: rms(105, 120), peak: peak(105, 120)}}));
