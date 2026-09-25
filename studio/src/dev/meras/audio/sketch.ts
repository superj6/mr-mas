// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// MR. MAS — meras: a code-composed SOUND SKETCH for f120-239 (5.0 s), frame-locked to timeline.ts.
// It is a timing/tone reference for the showrunner, not the final score (see notes/meras.md §Sound).
//   T1 (1993, f120-167): the DROP (sub boom on F), square bass, noise hats, pulse-wave beeper F F F,
//        the beeper pauses while the dialog is open; the stranger's click + a wrong-note bonk (f150);
//        the kid's click + beeper C (f165); tape machine starts under the render front (f168-179), beeper F f172.
//   T2 (2008-14, f180-239): boom-bap on a warbly cassette, the hook F F F F G Ab C F on tape piano, one note
//        per eighth from f180; D-flat maj7 pad -> F minor at f210; tuned collar pops (f180 / f187 / f202 re-pop);
//        lo-fi brass stab (f195); a paper "fwip" as the crown lands (f217) and a glock ping on the glint (f220);
//        a whoosh under the end-of-2014 pan (f219-224) into the cut;
//        f225-239: tape spins up + a mechanical-keyboard roll into the f240 hit (the hit itself is the next span).
//   npx esbuild src/dev/meras/audio/sketch.ts --bundle --platform=node --outfile=<scratch>/snd.js
//   node <scratch>/snd.js ../out/pixel/moments/meras-sketch.wav
import * as fs from 'fs';

const SR = 48000;
const FPS = 24, G0 = 120, FRAMES = 120;
const N = Math.round((FRAMES / FPS) * SR);
const L = new Float32Array(N), R = new Float32Array(N);
const at = (g: number) => Math.round(((g - G0) / FPS) * SR); // sample index of a global frame
const midi = (m: number) => 440 * Math.pow(2, (m - 69) / 12);
// notes: F minor
const F1 = 29, F2 = 41, Ab2 = 44, C3 = 48, Db3 = 49, F3 = 53, Ab3 = 56, C4 = 60, Db4 = 61, F4 = 65, G4 = 67, Ab4 = 68, C5 = 72, F5 = 77, Gb3 = 54, Eb3 = 51, Ab5 = 80, C6 = 84, F6 = 89;

let seed = 12345;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 * 2 - 1; };

const add = (i: number, v: number, pan = 0) => { if (i < 0 || i >= N) return; L[i] += v * (1 - Math.max(0, pan)); R[i] += v * (1 + Math.min(0, pan)); };
const env = (t: number, a: number, d: number) => (t < a ? t / a : Math.exp(-(t - a) / d));

// ------------------------------------------------------------------ voices
/** naive pulse, then crushed to 4-bit steps (the 1993 tier is meant to sound cheap and exact) */
const beep = (g: number, m: number, dur = 0.11, vol = 0.18) => {
  const s0 = at(g), f = midi(m), n = Math.round(dur * SR);
  for (let k = 0; k < n; k++) {
    const t = k / SR, ph = (t * f) % 1;
    let v = ph < 0.25 ? 1 : -1;
    v *= Math.min(1, t / 0.002) * (t > dur - 0.01 ? (dur - t) / 0.01 : 1);
    v = Math.round(v * 7) / 7;
    add(s0 + k, v * vol, 0);
  }
};
const squareBass = (g: number, m: number, dur: number, vol = 0.12) => {
  const s0 = at(g), f = midi(m), n = Math.round(dur * SR);
  let lp = 0;
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    const v = ((t * f) % 1 < 0.5 ? 1 : -1) * env(t, 0.003, 0.18);
    lp += (v - lp) * 0.08; // ~600 Hz one-pole
    add(s0 + k, lp * vol, 0);
  }
};
const hat = (g: number, vol = 0.05, pan = 0.3, dec = 0.018) => {
  const s0 = at(g), n = Math.round(0.06 * SR);
  let hp = 0, prev = 0;
  for (let k = 0; k < n; k++) {
    const x = rnd();
    hp = 0.92 * (hp + x - prev); prev = x; // high-pass
    add(s0 + k, hp * Math.exp(-k / SR / dec) * vol, pan);
  }
};
const subBoom = (g: number, vol = 0.9) => {
  const s0 = at(g), n = Math.round(1.1 * SR);
  let ph = 0;
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    const f = midi(F1) + (70 - midi(F1)) * Math.exp(-t / 0.04);
    ph += f / SR;
    add(s0 + k, Math.sin(2 * Math.PI * ph) * env(t, 0.004, 0.45) * vol, 0);
  }
  // transient
  for (let k = 0; k < 400; k++) add(s0 + k, rnd() * 0.25 * Math.exp(-k / 60), 0);
};
const click = (g: number, vol = 0.18, pan = 0) => {
  const s0 = at(g);
  for (let k = 0; k < 500; k++) { const t = k / SR; add(s0 + k, (Math.sin(2 * Math.PI * 3100 * t) * 0.6 + rnd() * 0.4) * Math.exp(-t / 0.0015) * vol, pan); }
};
/** the wrong-note sting: a square G-flat that sags, dry, short */
const bonk = (g: number) => {
  const s0 = at(g), n = Math.round(0.22 * SR);
  let ph = 0, lp = 0;
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    const f = midi(Gb3) * Math.pow(2, (-3 * Math.min(1, t / 0.12)) / 12);
    ph += f / SR;
    const v = (ph % 1 < 0.5 ? 1 : -1) * env(t, 0.002, 0.07);
    lp += (v - lp) * 0.12;
    add(s0 + k, lp * 0.3, 0.1);
  }
};
const kick = (g: number, vol = 0.55) => {
  const s0 = at(g), n = Math.round(0.35 * SR);
  let ph = 0;
  for (let k = 0; k < n; k++) { const t = k / SR; const f = 48 + 90 * Math.exp(-t / 0.03); ph += f / SR; add(s0 + k, Math.tanh(Math.sin(2 * Math.PI * ph) * 1.6) * env(t, 0.002, 0.12) * vol, 0); }
};
const snare = (g: number, vol = 0.32) => {
  const s0 = at(g), n = Math.round(0.28 * SR);
  let lp = 0;
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    const body = Math.sin(2 * Math.PI * 190 * t) * env(t, 0.001, 0.04);
    lp += (rnd() - lp) * 0.35;
    add(s0 + k, (body * 0.6 + lp * env(t, 0.001, 0.07)) * vol, -0.05);
  }
};
/** cassette piano: stretched partials, hammer thump, wow (0.7 Hz, 15 cents) + flutter (7 Hz), band-limited */
const wowAt = (s: number) => { const t = s / SR; return Math.pow(2, (15 * Math.sin(2 * Math.PI * 0.7 * t + 1) + 3 * Math.sin(2 * Math.PI * 7.1 * t)) / 1200); };
const tapePiano = (g: number, m: number, dur = 0.9, vol = 0.16) => {
  const s0 = at(g), f = midi(m), n = Math.round(dur * SR);
  const ph = [0, 0, 0, 0, 0];
  let lp = 0;
  for (let k = 0; k < n; k++) {
    const t = k / SR, w = wowAt(s0 + k);
    let v = 0;
    for (let p = 0; p < 5; p++) {
      const pf = f * (p + 1) * (1 + 0.0007 * (p + 1) * (p + 1)) * w;
      ph[p] += pf / SR;
      v += Math.sin(2 * Math.PI * ph[p]) * (1 / (p + 1) ** 1.3) * Math.exp(-t / (0.5 / (1 + p * 0.6)));
    }
    v += rnd() * 0.15 * Math.exp(-t / 0.006);
    v *= Math.min(1, t / 0.004);
    lp += (v - lp) * 0.3;
    add(s0 + k, Math.tanh(lp * 1.3) * vol, -0.15);
  }
};
const pad = (g0: number, g1: number, notes: number[], vol = 0.035) => {
  const s0 = at(g0), n = at(g1) - s0;
  const ph = notes.map(() => [0, 0]);
  let lp = 0;
  for (let k = 0; k < n; k++) {
    const t = k / SR, w = wowAt(s0 + k);
    let v = 0;
    notes.forEach((m, i) => { for (let d = 0; d < 2; d++) { ph[i][d] += (midi(m) * w * (d ? 1.004 : 0.996)) / SR; v += (ph[i][d] % 1) * 2 - 1; } });
    const e = Math.min(1, t / 0.25) * Math.min(1, (n - k) / (0.08 * SR));
    lp += (v - lp) * 0.02;
    add(s0 + k, lp * e * vol, 0.1);
  }
};
/** lo-fi brass stab: detuned saws through a fast-opening, fast-closing low-pass */
const brass = (g: number, notes: number[], vol = 0.11) => {
  const s0 = at(g), n = Math.round(0.42 * SR);
  const ph = notes.map(() => [0, 0, 0]);
  let lp = 0;
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    let v = 0;
    notes.forEach((m, i) => { [0.995, 1, 1.006].forEach((dt, d) => { ph[i][d] += (midi(m) * dt) / SR; v += (ph[i][d] % 1) * 2 - 1; }); });
    const cut = 0.03 + 0.25 * Math.exp(-t / 0.06);
    lp += (v - lp) * cut;
    add(s0 + k, Math.tanh(lp * 0.5) * env(t, 0.012, 0.16) * vol, 0);
  }
};
/** tuned collar pop: a pitched "pok" (fast pitch drop into the note) */
const pop = (g: number, m: number, pan: number, vol = 0.22) => {
  const s0 = at(g), f = midi(m), n = Math.round(0.12 * SR);
  let ph = 0;
  for (let k = 0; k < n; k++) { const t = k / SR; ph += (f * (1 + 1.5 * Math.exp(-t / 0.006))) / SR; add(s0 + k, Math.sin(2 * Math.PI * ph) * env(t, 0.001, 0.03) * vol, pan); }
};
const glock = (g: number, m: number, vol = 0.12) => {
  const s0 = at(g), f = midi(m), n = Math.round(1.2 * SR);
  for (let k = 0; k < n; k++) { const t = k / SR; add(s0 + k, (Math.sin(2 * Math.PI * f * t) + 0.35 * Math.sin(2 * Math.PI * f * 2.76 * t) * Math.exp(-t / 0.08)) * env(t, 0.001, 0.35) * vol, 0.2); }
};
const fwip = (g: number, vol = 0.08) => {
  const s0 = at(g), n = Math.round(0.09 * SR);
  let bp = 0, lp = 0;
  for (let k = 0; k < n; k++) { const x = rnd(); lp += (x - lp) * 0.5; bp = lp - bp * 0.2; add(s0 + k, bp * Math.sin((Math.PI * k) / n) * vol, 0.2); }
};
/** tape transport: the play-key clunk, motor coming up to speed, a band of hiss rising with it */
const tapeStart = (g0: number, g1: number) => {
  const s0 = at(g0), n = at(g1) - s0;
  for (let k = 0; k < 900; k++) add(s0 + k, Math.sin(2 * Math.PI * 90 * k / SR) * Math.exp(-k / 300) * 0.3 + rnd() * 0.1 * Math.exp(-k / 80), 0);
  let ph = 0, lp = 0;
  for (let k = 0; k < n; k++) {
    const t = k / n;
    ph += (18 + 50 * t * t) / SR;
    lp += (rnd() - lp) * (0.02 + 0.2 * t);
    add(s0 + k, (Math.sin(2 * Math.PI * ph) * 0.05 + lp * 0.06) * Math.min(1, t * 4), 0);
  }
};
const hiss = (g0: number, g1: number, vol = 0.012) => { const s0 = at(g0), n = at(g1) - s0; let lp = 0; for (let k = 0; k < n; k++) { lp += (rnd() - lp) * 0.6; add(s0 + k, lp * vol, (k % 2) * 0.4 - 0.2); } };
/** tape spins up (a rising whine) and a mechanical-keyboard roll accelerating into the next downbeat */
const spinUpAndRoll = (g0: number, g1: number) => {
  const s0 = at(g0), n = at(g1) - s0;
  let ph = 0;
  for (let k = 0; k < n; k++) { const t = k / n; ph += (220 + 660 * t * t) / SR; add(s0 + k, Math.sin(2 * Math.PI * ph) * 0.03 * t, 0); }
  // key clicks: eighths -> 16ths -> 32nds, crescendo
  let g = g0;
  while (g < g1) {
    const t = (g - g0) / (g1 - g0);
    const s = at(g);
    for (let k = 0; k < 700; k++) { const tt = k / SR; add(s + k, (rnd() * 0.7 + Math.sin(2 * Math.PI * 2400 * tt) * 0.3) * Math.exp(-tt / 0.004) * (0.08 + 0.22 * t), (rnd() * 0.3)); }
    g += t < 0.4 ? 3.75 : t < 0.75 ? 1.875 : 0.9375;
  }
};

/** air whoosh under the end-of-shot pan: band-passed noise swelling into the cut (the whip continues in mdinner1) */
const whoosh = (g0: number, g1: number, vol = 0.14) => {
  const s0 = at(g0), n = at(g1) - s0;
  let lp = 0, lp2 = 0;
  for (let k = 0; k < n; k++) { const t = k / n; lp += (rnd() - lp) * (0.05 + 0.4 * t); lp2 += (lp - lp2) * 0.5; add(s0 + k, (lp - lp2) * t * t * vol * 4, -0.4 + t * 0.8); }
};

// ------------------------------------------------------------------ the arrangement (global frames)
// T1 — 1993
subBoom(120);
for (let g = 120; g < 168; g += 7.5) squareBass(g, (g - 120) % 30 === 22.5 ? Ab2 : F2, 0.26, g >= 137 && g < 165 ? 0.07 : 0.12);
for (let g = 120; g < 168; g += 3.75) hat(g, g >= 137 && g < 165 ? 0.018 : ((g - 120) / 3.75) % 2 ? 0.05 : 0.03);
beep(120, F5); beep(127, F5); beep(135, F5); // ...then silence while the dialog is open
click(150, 0.2, 0.35); bonk(150); // the stranger's click, and nothing
click(165, 0.22, 0.1); beep(165, C5, 0.16); // the kid clicks OK
tapeStart(168, 180); beep(172, F5, 0.09, 0.12);
// T2 — 2008 / 2014 on cassette
hiss(168, 240);
pad(180, 210, [Db3, F3, Ab3, C4]);
pad(210, 239, [F3, Ab3, C4]);
const HOOK = [F4, F4, F4, F4, G4, Ab4, C5, F5];
HOOK.forEach((m, i) => tapePiano(180 + i * 7.5, m));
kick(180); kick(202.5); kick(217.5); kick(210, 0.3);
snare(195); snare(225);
for (let g = 180; g < 225; g += 7.5) hat(g, 0.035, 0.35, 0.03);
pop(180, Ab5, -0.3); pop(187, C6, 0.3); // the collars
brass(195, [Db4, F4, Ab4]); // 2014
pop(202, F6, 0, 0.16); // re-pop over the hoodie
fwip(217); glock(218, F6); // the crown lands; the glint
whoosh(220, 225); // the pan into the cut
spinUpAndRoll(225, 240);

// ------------------------------------------------------------------ master: gentle glue, peak -1 dBFS, 16-bit WAV
let peak = 0;
for (let i = 0; i < N; i++) { L[i] = Math.tanh(L[i] * 1.1); R[i] = Math.tanh(R[i] * 1.1); peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])); }
const gain = 0.891 / peak;
const out = Buffer.alloc(44 + N * 4);
out.write('RIFF', 0); out.writeUInt32LE(36 + N * 4, 4); out.write('WAVE', 8); out.write('fmt ', 12);
out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(2, 22); out.writeUInt32LE(SR, 24); out.writeUInt32LE(SR * 4, 28); out.writeUInt16LE(4, 32); out.writeUInt16LE(16, 34);
out.write('data', 36); out.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { out.writeInt16LE(Math.round(L[i] * gain * 32767), 44 + i * 4); out.writeInt16LE(Math.round(R[i] * gain * 32767), 46 + i * 4); }
fs.writeFileSync(process.argv[2], out);
// report per-beat RMS so the mix can be checked without ears
const rows: string[] = [];
for (let g = 120; g < 240; g += 7.5) {
  const a = at(g), b = Math.min(N, at(g + 7.5));
  let s = 0; for (let i = a; i < b; i++) s += (L[i] * gain) ** 2;
  rows.push(`f${String(g).padEnd(5)} ${(10 * Math.log10(s / (b - a) + 1e-12)).toFixed(1)} dB`);
}
console.log(`wrote ${process.argv[2]} (${(N / SR).toFixed(2)} s, peak norm ${gain.toFixed(2)})\n` + rows.join('\n'));
