// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// MR. MAS — mfinale TEMP AUDIO SKETCH, code-composed and frame-locked. It renders bars 9-12 (intro 480-719,
// 10.0 s): bar 9 is now the ROLL CALL (brief v2.1: its eight stabs land on mrollcall's CUTS, brass doubled by a
// chip lead, playing the knee F F F F G Ab C F'), then the skyline, the title and the bookend. The old CHATGTP /
// FIRED / BACK slot cues are gone with the slot. Everything is synthesised (no samples): an animatic temp that
// shows the cue structure and the sync points, not the final sound. Stems: music, sfx, vox (a formant choir).
//   node audio.cjs <outDir>
//   -> mfinale-{music,sfx,vox,mix}.wav            540-719 (the mfinale composition, 7.5 s)
//   -> mfinale-bars9-12-{music,sfx,vox,mix}.wav   480-719 (roll call + mfinale, the review comp)
// Grid: 96 BPM, 24 fps, 15 frames per beat. F minor. Cue sheet: show/_sources/design/final.md §4.
import * as fs from 'fs';
import {CUTS, MOTIF} from '../../mrollcall/timeline';

const SR = 48000;
const START = 480, END = 720;
const DUR = (END - START) / 24; // 10 s
const N = Math.round(DUR * SR);
const T = (f) => (f - START) / 24; // global frame -> seconds in this span

// ---------------------------------------------------------------- buffers
const stereo = () => [new Float32Array(N), new Float32Array(N)];
const add = (buf, t0, sig, gain = 1, pan = 0) => {
  const i0 = Math.round(t0 * SR);
  const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4), gr = gain * Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < sig.length; i++) {
    const j = i0 + i;
    if (j < 0 || j >= N) continue;
    buf[0][j] += sig[i] * gl; buf[1][j] += sig[i] * gr;
  }
};
const mixInto = (dst, src, g = 1) => { for (let c = 0; c < 2; c++) for (let i = 0; i < N; i++) dst[c][i] += src[c][i] * g; };

// ---------------------------------------------------------------- deterministic noise
let seed = 1234567;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const noise = (n) => { const a = new Float32Array(n); for (let i = 0; i < n; i++) a[i] = rnd() * 2 - 1; return a; };

// ---------------------------------------------------------------- pitch
const NOTE = {C: 0, Db: 1, D: 2, Eb: 3, E: 4, F: 5, Gb: 6, G: 7, Ab: 8, A: 9, Bb: 10, B: 11};
const hz = (name) => { const m = /^([A-G]b?)(-?\d)$/.exec(name); const n = NOTE[m[1]] + (Number(m[2]) + 1) * 12; return 440 * Math.pow(2, (n - 69) / 12); };

// ---------------------------------------------------------------- envelopes + filters
const env = (n, a, d, s, r, hold) => { // seconds; hold = time before release
  const e = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let v;
    if (t < a) v = t / a;
    else if (t < a + d) v = 1 - (1 - s) * ((t - a) / d);
    else if (t < hold) v = s;
    else v = s * Math.max(0, 1 - (t - hold) / r);
    e[i] = v;
  }
  return e;
};
const expDecay = (n, tau) => { const e = new Float32Array(n); for (let i = 0; i < n; i++) e[i] = Math.exp(-i / SR / tau); return e; };
const mul = (a, b) => { for (let i = 0; i < a.length; i++) a[i] *= b[i] ?? 0; return a; };
const lp1 = (x, fc) => { const a = Math.exp((-2 * Math.PI * fc) / SR); let y = 0; for (let i = 0; i < x.length; i++) { y = (1 - a) * x[i] + a * y; x[i] = y; } return x; };
const hp1 = (x, fc) => { const a = Math.exp((-2 * Math.PI * fc) / SR); let y = 0, px = 0; for (let i = 0; i < x.length; i++) { y = a * (y + x[i] - px); px = x[i]; x[i] = y; } return x; };
/** biquad band-pass, constant 0 dB peak; fc may be a function of time (sweeps) */
const bp = (x, fc, q) => {
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  const out = new Float32Array(x.length);
  for (let i = 0; i < x.length; i++) {
    const f = typeof fc === 'function' ? fc(i / SR) : fc;
    const w = (2 * Math.PI * Math.min(f, SR * 0.45)) / SR, al = Math.sin(w) / (2 * q), cs = Math.cos(w);
    const b0 = al, b2 = -al, a0 = 1 + al, a1 = -2 * cs, a2 = 1 - al;
    const y = (b0 * x[i] + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = y; out[i] = y;
  }
  return out;
};

// ---------------------------------------------------------------- instruments
/** soft felt piano: inharmonic partials with per-partial decay + a felt thump */
const piano = (f, dur, vel = 1, bright = 0.5) => {
  const n = Math.round(dur * SR), o = new Float32Array(n);
  for (let k = 1; k <= 10; k++) {
    const fk = f * k * Math.sqrt(1 + 0.0004 * k * k);
    if (fk > SR * 0.45) break;
    const amp = Math.pow(bright * 0.9 + 0.1, k - 1) / k;
    const tau = 2.4 / (1 + k * 0.5);
    for (let i = 0; i < n; i++) o[i] += amp * Math.sin((2 * Math.PI * fk * i) / SR) * Math.exp(-i / SR / tau);
  }
  const th = lp1(noise(Math.round(0.03 * SR)), 900);
  for (let i = 0; i < th.length; i++) o[i] += th[i] * 0.25 * (1 - i / th.length);
  for (let i = 0; i < n; i++) o[i] *= vel * Math.min(1, i / (0.004 * SR));
  return o;
};
/** additive saw (band-limited) with vibrato */
const saw = (f, n, vib = 0, detune = 0, harm = 18) => {
  const o = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const fi = f * (1 + detune) * (1 + vib * Math.sin(2 * Math.PI * 5.4 * t + detune * 900));
    ph += fi / SR;
    let s = 0;
    for (let k = 1; k <= harm && k * fi < SR * 0.45; k++) s += Math.sin(2 * Math.PI * k * ph) / k;
    o[i] = s * 0.6;
  }
  return o;
};
/** pulse (1-bit / chip) with a bitcrush */
const pulse = (f, n, duty = 0.25, crush = 8) => { const o = new Float32Array(n); for (let i = 0; i < n; i++) { const p = ((i * f) / SR) % 1; o[i] = Math.round((p < duty ? 1 : -1) * crush) / crush; } return o; };
/** Karplus-Strong pluck */
const pluck = (f, dur, bright = 0.5) => {
  const n = Math.round(dur * SR), L = Math.max(2, Math.round(SR / f));
  const buf = noise(L).map((v) => v * 0.8);
  lp1(buf, 2000 + bright * 6000);
  const o = new Float32Array(n);
  let idx = 0;
  for (let i = 0; i < n; i++) { const a = buf[idx], b = buf[(idx + 1) % L]; o[i] = a; buf[idx] = 0.996 * 0.5 * (a + b); idx = (idx + 1) % L; }
  return o;
};
/** FM bell / celesta */
const bell = (f, dur, ratio = 3.5, index = 3, tau = 1.4) => {
  const n = Math.round(dur * SR), o = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / SR, e = Math.exp(-t / tau); o[i] = Math.sin(2 * Math.PI * f * t + index * e * Math.sin(2 * Math.PI * f * ratio * t)) * e; }
  return o;
};
const kick = (vel = 1, low = 42) => { const n = Math.round(0.6 * SR), o = new Float32Array(n); let ph = 0; for (let i = 0; i < n; i++) { const t = i / SR; const f = low + 110 * Math.exp(-t / 0.04); ph += f / SR; o[i] = Math.sin(2 * Math.PI * ph) * Math.exp(-t / 0.28) * vel; } const c = hp1(noise(240), 3000); for (let i = 0; i < c.length; i++) o[i] += c[i] * 0.3 * (1 - i / 240); return o; };
const snare = (vel = 1, dur = 0.22) => { const n = Math.round(dur * SR); const o = bp(noise(n), 2400, 0.7); for (let i = 0; i < n; i++) { const t = i / SR; o[i] = (o[i] * 1.6 + 0.5 * Math.sin(2 * Math.PI * 190 * t)) * Math.exp(-t / 0.07) * vel; } return o; };
const hat = (vel = 1, open = false) => { const n = Math.round((open ? 0.25 : 0.05) * SR); const o = hp1(noise(n), 7000); for (let i = 0; i < n; i++) o[i] *= Math.exp(-i / SR / (open ? 0.09 : 0.015)) * vel; return o; };
const crash = (vel = 1, dur = 2.5) => { const n = Math.round(dur * SR); const o = hp1(hp1(noise(n), 5500), 5500); const ring = [3240, 4120, 5410, 6890]; for (let i = 0; i < n; i++) { const t = i / SR; let r = 0; for (const f of ring) r += Math.sin(2 * Math.PI * f * t); o[i] = (o[i] + r * 0.04) * Math.exp(-t / 0.45) * vel; } return o; };
const sub = (f0, f1, dur, vel = 1) => { const n = Math.round(dur * SR), o = new Float32Array(n); let ph = 0; for (let i = 0; i < n; i++) { const t = i / SR; const f = f0 + (f1 - f0) * Math.min(1, t / dur); ph += f / SR; o[i] = Math.sin(2 * Math.PI * ph) * Math.min(1, t / 0.01) * Math.exp(-t / (dur * 0.6)) * vel; } return o; };
const b808 = (f, dur, vel = 1) => { const n = Math.round(dur * SR), o = new Float32Array(n); let ph = 0; for (let i = 0; i < n; i++) { const t = i / SR; const fi = f * (1 + 0.6 * Math.exp(-t / 0.03)); ph += fi / SR; o[i] = Math.tanh(Math.sin(2 * Math.PI * ph) * 1.6) * Math.exp(-t / (dur * 0.5)) * vel * Math.min(1, t / 0.003); } return o; };
/** noise swept through a moving band-pass (whooshes, risers, reverse swells) */
const sweep = (dur, f0, f1, q, shape) => { const n = Math.round(dur * SR); const o = bp(noise(n), (t) => f0 * Math.pow(f1 / f0, t / dur), q); for (let i = 0; i < n; i++) o[i] *= shape(i / n); return o; };
const click = (f = 2500, dur = 0.012, vel = 1) => { const n = Math.round(dur * SR); const o = bp(noise(n), f, 2); for (let i = 0; i < n; i++) o[i] *= (1 - i / n) * vel * 2; return o; };

// ---------------------------------------------------------------- the choir ("aah", formant synthesis)
const FORMANT = {aah: [[800, 1], [1150, 0.5], [2900, 0.25], [3900, 0.1]], ooh: [[350, 1], [600, 0.4], [2400, 0.08]]};
const choirNote = (f, dur, vowel = 'aah', att = 0.25, rel = 0.8) => {
  const n = Math.round(dur * SR), o = new Float32Array(n);
  for (let v = 0; v < 4; v++) {
    const src = saw(f, n, 0.006 + v * 0.001, (v - 1.5) * 0.004, 24);
    for (const [fc, g] of FORMANT[vowel]) { const b = bp(src, fc * (1 + v * 0.01), 6); for (let i = 0; i < n; i++) o[i] += b[i] * g * 0.5; }
  }
  const breath = bp(noise(n), 1400, 1.2);
  for (let i = 0; i < n; i++) o[i] += breath[i] * 0.04;
  return mul(o, env(n, att, 0.2, 0.85, rel, dur - rel));
};

// ---------------------------------------------------------------- reverb (Schroeder: 4 combs + 2 allpasses per side)
const reverb = (buf, wet = 0.3, size = 1) => {
  const out = stereo();
  for (let c = 0; c < 2; c++) {
    const x = buf[c];
    const combs = [1557, 1617, 1491, 1422].map((d) => Math.round(d * size * (c ? 1.03 : 1)));
    const y = new Float32Array(N);
    for (const d of combs) { const line = new Float32Array(d); let k = 0; for (let i = 0; i < N; i++) { const o = line[k]; line[k] = x[i] + o * 0.84; k = (k + 1) % d; y[i] += o * 0.25; } }
    for (const d of [225, 556]) { const line = new Float32Array(d); let k = 0; for (let i = 0; i < N; i++) { const o = line[k]; const v = y[i] + o * 0.5; line[k] = v; y[i] = o - v * 0.5; k = (k + 1) % d; } }
    for (let i = 0; i < N; i++) out[c][i] = x[i] * (1 - wet * 0.5) + y[i] * wet;
  }
  return out;
};
const gate = (buf, t0, t1, fade = 0.01) => { for (let c = 0; c < 2; c++) for (let i = 0; i < N; i++) { const t = i / SR; let g = 1; if (t >= t0 - fade && t < t1) g = t < t0 ? (t0 - t) / fade : 0; buf[c][i] *= g; } };

// ================================================================== MUSIC
const music = stereo(), dry = stereo();
{
  const beat = 15 / 24;
  // --- bar 9 f480-539: THE PLAYERS. Eight stabs, one per flash, on mrollcall's CUTS (the picture cuts half a
  //     frame ahead of an off-beat stab, never behind it). Brass (a root-fifth-octave power voicing, no third)
  //     doubled an octave up by a chip lead. 1-4 are the flat of the curve (the same F); 5-8 climb G Ab C F'.
  //     Under it: a kick on the beat, the 808 on F, hats that go to 16ths when the melody starts to climb.
  const ST = {F: 'F', G: 'G', Ab: 'Ab', C: 'C'};
  CUTS.forEach((f, n) => {
    const m = MOTIF[n];
    const oct = n === 7 ? 4 : m.note === 'C' ? 4 : 3;
    const root = hz(ST[m.note] + oct);
    const lvl = n < 4 ? 1 : 1 + (n - 3) * 0.12; // the leap gets louder as it climbs
    for (const [mult, pan] of [[1, -0.25], [1.5, 0.25], [2, 0]]) {
      const nS = Math.round(0.34 * SR);
      const s2 = lp1(saw(root * mult, nS, 0.002, mult === 1.5 ? 0.003 : 0, 18), 2400 + n * 250);
      add(music, T(f), mul(s2, env(nS, 0.006, 0.09, 0.42, 0.16, 0.16)), 0.12 * lvl, pan);
    }
    const nC = Math.round(0.2 * SR);
    add(music, T(f), mul(pulse(root * 4, nC, 0.25, 6), expDecay(nC, 0.07)), 0.035 * lvl, 0.35);
  });
  for (let k = 0; k < 4; k++) add(music, T(480 + k * 15), kick(k === 2 ? 1.05 : 0.85), 0.8);
  add(music, T(480), b808(hz('F1'), 1.4), 0.55); add(music, T(510), b808(hz('F1'), 1.2), 0.5);
  for (let k = 0; k < 8; k++) add(music, T(480) + k * (beat / 2), hat(k % 2 ? 0.22 : 0.34), 0.35, 0.4);
  for (let k = 0; k < 16; k++) add(music, T(510) + k * (beat / 4), hat(k % 4 === 0 ? 0.38 : 0.2), 0.35, 0.4);
  add(music, T(532), snare(0.8), 0.4, -0.05);
  // the cursor's pull-back onto the dusk (537-539): a reverse swell straight into the skyline's first beat
  add(music, T(532), sweep(T(540) - T(532), 250, 5200, 1.4, (u) => u * u * u), 0.28);
  // --- bars 10-11.2 f540-629: the skyline. Half-time 808, glitchy chip arp, and ONE PLUCK PER TOWER that
  //     spells the knee (F F F F G Ab C), a riser from f600 and a snare roll into the title.
  const pops = [[540, 'F4'], [555, 'F4'], [570, 'F4'], [585, 'F4'], [600, 'G4'], [615, 'Ab4'], [622, 'C5']];
  for (const [f, nm] of pops) add(music, T(f), pluck(hz(nm), 1.4, f === 622 ? 0.9 : 0.6), f === 622 ? 0.55 : 0.45, 0.1);
  for (let bar = 0; bar < 2; bar++) {
    const b0 = 540 + bar * 60;
    const root = bar === 0 ? 'F1' : 'Db1';
    add(music, T(b0), kick(1), 0.85); add(music, T(b0 + 37), kick(0.7), 0.6); // 1, and the "and" of 3's pickup
    add(music, T(b0 + 30), snare(0.9), 0.5, -0.05);
    add(music, T(b0), b808(hz(root), 1.3), 0.6); add(music, T(b0 + 37), b808(hz(root), 0.5, 0.8), 0.45);
    for (let k = 0; k < 8; k++) add(music, T(b0) + k * (beat / 2), hat(k % 2 ? 0.25 : 0.4), 0.4, 0.4);
  }
  // glitchy arp: 16ths on a pulse wave, some steps stutter (repeat) — the machine noodling
  const arpF = ['F4', 'Ab4', 'C5', 'F5'], arpD = ['Db4', 'F4', 'Ab4', 'Db5'];
  for (let k = 0; k < 24; k++) {
    const t = T(540) + k * (beat / 4);
    if (t >= T(630)) break;
    const set = t < T(600) ? arpF : arpD;
    const nm = set[(k * 3) % 4];
    const n = Math.round(0.08 * SR);
    const s = mul(pulse(hz(nm), n, k % 5 === 0 ? 0.125 : 0.25, 6), expDecay(n, 0.04));
    add(music, t, s, 0.05, k % 2 ? 0.5 : -0.5);
    if (k % 7 === 3) add(music, t + beat / 8, s, 0.04, 0.6);
  }
  add(music, T(600), sweep(T(630) - T(600), 200, 6000, 2.5, (u) => Math.pow(u, 2.2)), 0.3);
  { const n = Math.round((T(630) - T(600)) * SR); const s = new Float32Array(n); let ph = 0; for (let i = 0; i < n; i++) { const u = i / n; ph += (110 + 770 * u * u) / SR; s[i] = Math.sin(2 * Math.PI * ph) * u * u; } add(music, T(600), s, 0.06); }
  for (let k = 0; ; k++) { const t = T(615) + (T(630) - T(615)) * (1 - Math.pow(1 - k / 20, 1.6)); if (k >= 20) break; add(music, t, snare(0.3 + k * 0.03, 0.12), 0.35); }
  // --- 11.3 f630: THE FINAL HIT. F-C open fifth, NO THIRD: low piano cluster, brass, timpani, sub drop 55->35
  add(music, T(630), kick(1.3, 38), 1);
  add(music, T(630), sub(55, 35, 2.4, 1.1), 0.9);
  add(music, T(630), crash(1, 2.5), 0.16, -0.25);
  for (const nm of ['F1', 'C2', 'F2', 'C3', 'F3']) add(music, T(630), piano(hz(nm), 3.6, 0.8, 0.4), 0.3);
  for (const nm of ['F3', 'C4', 'F4', 'C5']) { const n = Math.round(2.6 * SR); const s = lp1(saw(hz(nm), n, 0.003, 0, 20), 1800); add(music, T(630), mul(s, env(n, 0.02, 0.4, 0.55, 1.6, 1.0)), 0.13, nm === 'C5' ? 0.3 : -0.1); }
  { const n = Math.round(1.8 * SR); const o = new Float32Array(n); let ph = 0; for (let i = 0; i < n; i++) { const t = i / SR; ph += (hz('F2') * (1 + 0.3 * Math.exp(-t / 0.05))) / SR; o[i] = Math.sin(2 * Math.PI * ph) * Math.exp(-t / 0.5); } add(music, T(630), o, 0.45); }
  // celesta F6 at f660 and f690
  add(music, T(660), bell(hz('F6'), 2.5, 3.5, 1.4, 1.1), 0.22, 0.25);
  add(music, T(690), bell(hz('F6'), 2.5, 3.5, 1.4, 1.1), 0.18, -0.25);
  // --- 12.3-12.4 f690-719: the drone returns (F1 + C2, open fifth), the DING (F6 bell) at f705, out by f719
  { const n = Math.round((T(720) - T(690)) * SR); const s = new Float32Array(n); for (let i = 0; i < n; i++) { const t = i / SR, u = i / n; s[i] = (Math.sin(2 * Math.PI * hz('F1') * t) + 0.7 * Math.sin(2 * Math.PI * hz('C2') * t)) * Math.min(1, t / 0.3) * Math.max(0, 1 - Math.pow(u, 3)); } add(music, T(690), s, 0.25); }
  add(music, T(705), bell(hz('F6'), 2.0, 2.0, 2.2, 0.9), 0.3, 0.1);
}
const musicR = reverb(music, 0.32, 1.1);
mixInto(musicR, reverb(dry, 0.12, 0.6), 1);

// ================================================================== VOX (wordless choir, formant synthesis — placeholder)
const vox = stereo();
{
  // the roll call's last two stabs (C, then the octave F: the player who doesn't exist yet) lift into a short "aah"
  for (const nm of ['F3', 'C4', 'F4']) add(vox, T(525), choirNote(hz(nm), 0.55, 'aah', 0.04, 0.25), 0.07, nm === 'F4' ? 0.3 : -0.2);
  for (const nm of ['F4', 'C5']) add(vox, T(532), choirNote(hz(nm), 0.4, 'ooh', 0.03, 0.2), 0.06, 0);
  // the title: F and C only (no third), swelling out of the hit, closing to "ooh" as the camera pulls back
  for (const nm of ['F3', 'C4', 'F4', 'C5']) add(vox, T(630), choirNote(hz(nm), 2.6, 'aah', 0.08, 1.4), 0.1, nm === 'C5' ? 0.35 : -0.15);
  for (const nm of ['F4', 'C5']) add(vox, T(690), choirNote(hz(nm), 1.2, 'ooh', 0.3, 0.8), 0.07, 0);
}
const voxR = reverb(vox, 0.45, 1.25);

// ================================================================== SFX
const sfx = stereo();
{
  // bar 9, the roll call: one small, dry cue per player, kept under the stabs (no meme sounds)
  for (const [f, fr] of [[480, 3800], [482, 4300], [484, 3600], [486, 4500]] as const) add(sfx, T(f), bell(fr, 0.18, 2.76, 1.1, 0.05), 0.05, -0.3); // TASYA's key ring
  { const n = Math.round(0.28 * SR); const w = new Float32Array(n); let ph = 0; for (let i = 0; i < n; i++) { const u = i / n; ph += (hz('F5') * (0.85 + 0.3 * Math.sin(Math.PI * u))) / SR; w[i] = Math.sin(2 * Math.PI * ph) * Math.sin(Math.PI * u); } add(sfx, T(487), w, 0.04, 0.4); } // RADNUS: the siren, tuned to F
  add(sfx, T(495), sweep(0.22, 3000, 5000, 1.5, (u) => Math.sin(Math.PI * u) * (1 - u)), 0.05, -0.2); // KRAM: steam off the thermos
  add(sfx, T(504), sweep(0.16, 800, 2600, 2, (u) => Math.sin(Math.PI * u)), 0.06, 0.3); // NESNEJ: the GPU tossed
  add(sfx, T(511), kick(0.35, 80), 0.25, 0); add(sfx, T(511), click(900, 0.03, 0.9), 0.22, 0); // RIMA: the spotlight's clunk
  add(sfx, T(519), sweep(0.45, 1200, 300, 0.8, (u) => (1 - u) * Math.min(1, u * 12)), 0.12, 0.2); add(sfx, T(517), sub(70, 45, 0.5, 0.6), 0.2); // the whale breaches
  for (const f of [532, 538]) { const n = Math.round(0.03 * SR); add(sfx, T(f), mul(pulse(hz('F6'), n, 0.5, 2), expDecay(n, 0.012)), 0.035, 0.1); } // the cursor blinks
  // the skyline: every tower rises with a stone thud and dust; the plinth scrapes in under NopeAI
  const thud = (f, v = 1) => { add(sfx, T(f), kick(0.6 * v, 55), 0.35); add(sfx, T(f + 1), sweep(0.35, 900, 250, 0.8, (u) => (1 - u) * Math.min(1, u * 20)), 0.15 * v); };
  thud(540); thud(555); thud(570); thud(585); thud(600, 1.2); thud(615, 0.4);
  add(sfx, T(541), sweep(0.18, 300, 180, 3, (u) => Math.sin(Math.PI * u)), 0.35, 0.4); add(sfx, T(543), kick(0.35, 70), 0.3, 0.3);
  // one cue per boss loop (kept low, under the plucks): siren whoop (F), paint clack, register tick, keys
  { const n = Math.round(0.5 * SR); const s = new Float32Array(n); let ph = 0; for (let i = 0; i < n; i++) { const u = i / n; ph += (hz('F5') * (0.8 + 0.4 * Math.sin(Math.PI * u))) / SR; s[i] = Math.sin(2 * Math.PI * ph) * Math.sin(Math.PI * u); } add(sfx, T(556), s, 0.05, -0.6); }
  add(sfx, T(571), click(900, 0.03, 1), 0.2, -0.3); add(sfx, T(573), click(1100, 0.02, 0.8), 0.15, -0.3);
  add(sfx, T(586), bell(hz('C7'), 0.3, 1.0, 0.4, 0.08), 0.12, 0.5); add(sfx, T(586) + 0.03, click(4000, 0.01, 0.8), 0.12, 0.5);
  for (let k = 0; k < 6; k++) add(sfx, T(588 + k * 5), sweep(0.2, 2000, 700, 2, (u) => Math.sin(Math.PI * u)), 0.05, 0.6 - k * 0.15);
  add(sfx, T(542), bell(4200, 0.2, 2.76, 1.2, 0.05), 0.04, 0.5); add(sfx, T(548), bell(3900, 0.2, 2.76, 1.2, 0.05), 0.04, 0.5);
  add(sfx, T(616), sweep(0.25, 600, 200, 3, (u) => Math.sin(Math.PI * u)), 0.12, 0.8); // PEEKDEEP: a plop
  add(sfx, T(617), kick(0.25, 85), 0.16, 0.6); add(sfx, T(617), click(1000, 0.025, 0.8), 0.12, 0.6); // MACHINES THINKING: RIMA's spotlight
  // f622 the ignition: an electric fuse racing up the curve, a zap at the spire
  add(sfx, T(622), sweep(T(629) - T(622), 400, 7000, 4, (u) => u * (1 - 0.3 * u)), 0.18, -0.2);
  add(sfx, T(628), click(6000, 0.05, 0.8), 0.18, 0.1);
  // the title slam + shake: a body hit under the music's; the subtitle types on (soft key ticks, 2/frame)
  add(sfx, T(630), sweep(0.4, 2500, 200, 0.7, (u) => (1 - u) * (1 - u)), 0.25);
  for (let f = 640; f < 656; f++) add(sfx, T(f), click(1800 + (f % 3) * 300, 0.006, 0.5), 0.07, 0.05);
  // the pull back: a reverse whoosh into the monitor, the zoom-rects' swish; the Orb's servo as it turns to us (705)
  add(sfx, T(690) - 0.3, sweep(0.35, 5000, 800, 1.2, (u) => u * u), 0.22);
  add(sfx, T(692), sweep(0.12, 3000, 1200, 2, (u) => Math.sin(Math.PI * u)), 0.12, 0.2);
  add(sfx, T(705), sweep(0.08, 1800, 900, 3, (u) => Math.sin(Math.PI * u)), 0.05, 0.6);
  // f705 the post goes out: a click on Post, the picture swishes up into the feed, the empty composer is back
  add(sfx, T(705), click(2400, 0.01, 1), 0.35, -0.3);
  add(sfx, T(705) + 0.02, sweep(0.14, 900, 4200, 2, (u) => Math.sin(Math.PI * u)), 0.12, -0.3);
  // server hum under the whole bookend
  { const n = Math.round((T(720) - T(690)) * SR); const s = new Float32Array(n); for (let i = 0; i < n; i++) { const t = i / SR, u = i / n; s[i] = (Math.sin(2 * Math.PI * 60 * t) * 0.5 + Math.sin(2 * Math.PI * 120 * t) * 0.3 + Math.sin(2 * Math.PI * 180 * t) * 0.1) * Math.min(1, t / 0.2) * (1 - u * u); } add(sfx, T(690), s, 0.04); }
}
const sfxR = reverb(sfx, 0.15, 0.8);

// ================================================================== write
const norm = (buf, peak = 0.89) => { let m = 0; for (let c = 0; c < 2; c++) for (let i = 0; i < N; i++) m = Math.max(m, Math.abs(buf[c][i])); const g = m > 0 ? peak / m : 1; for (let c = 0; c < 2; c++) for (let i = 0; i < N; i++) buf[c][i] *= g; return g; };
const soft = (buf) => { for (let c = 0; c < 2; c++) for (let i = 0; i < N; i++) buf[c][i] = Math.tanh(buf[c][i] * 1.1) / Math.tanh(1.1); };
const _wav = (path, buf) => {
  const data = Buffer.alloc(N * 4);
  for (let i = 0; i < N; i++) for (let c = 0; c < 2; c++) data.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(buf[c][i] * 32767))), (i * 2 + c) * 2);
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34);
  h.write('data', 36); h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(path, Buffer.concat([h, data]));
};
const out = process.argv[2] || '.';
fs.mkdirSync(out, {recursive: true});
const mix = stereo();
mixInto(mix, musicR, 1.0); mixInto(mix, voxR, 0.9); mixInto(mix, sfxR, 0.8);
soft(mix); norm(mix, 0.89);
const stem = (b) => { const c = stereo(); mixInto(c, b, 1); soft(c); norm(c, 0.8); return c; };
const S = {music: stem(musicR), vox: stem(voxR), sfx: stem(sfxR), mix};
/** a slice [f0, f1) of a rendered buffer, with a 4 ms fade-in so the cut at 540 does not click */
const slice = (buf, f0, f1) => {
  const i0 = Math.round(T(f0) * SR), n = Math.round(((f1 - f0) / 24) * SR);
  const o = [buf[0].slice(i0, i0 + n), buf[1].slice(i0, i0 + n)];
  const fi = Math.round(0.004 * SR);
  for (let c = 0; c < 2; c++) for (let i = 0; i < fi; i++) o[c][i] *= i / fi;
  return o;
};
const wavN = (path, buf) => {
  const n = buf[0].length;
  const data = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) for (let c = 0; c < 2; c++) data.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(buf[c][i] * 32767))), (i * 2 + c) * 2);
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34);
  h.write('data', 36); h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(path, Buffer.concat([h, data]));
};
for (const [k, b] of Object.entries(S)) {
  wavN(`${out}/mfinale-bars9-12-${k}.wav`, b);
  wavN(`${out}/mfinale-${k}.wav`, slice(b, 540, 720));
}
console.log('wrote mfinale (540-719) and mfinale-bars9-12 (480-719) stems + mixes to', out, `@ ${SR} Hz`);
