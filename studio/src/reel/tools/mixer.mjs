// The episode reel's MIXER: executes an EpisodePlan's audio plan (studio/src/reel/episode.ts) into one 48 kHz stereo
// 24-bit WAV for the whole episode. Called by tools/episode.mjs; runnable on its own:
//   node src/reel/tools/mixer.mjs <plan.json> <out.wav> [--work <dir>]        (run from studio/)
//
// What it lays, in order (seconds on the episode clock):
//   clips     chapter mixes (a chapter's own premix, e.g. Act Four's mix.wav from 3 s), a video slot's own sound
//             (hard cut in and out, 30 ms de-click, an optional ringing tail), and recorded dialogue takes (dual mono).
//   beds      one temp bed per sequence: an OST render (looped on its .cue.json loop points, period exactly b - a, the
//             crossfade taken from the material after b) or a programmatic pad / room tone where the cue has no render.
//             Each bed is matched to its own loudness target (BS.1770, un-ducked), crossfades equal-power into the
//             next, ducks under recorded speech, and is gated off where a chapter brings its own sound.
//   master    matched to the plan's integrated target, then a look-ahead peak limiter at the ceiling.
// The bundled ffmpeg has no afade/alimiter/ebur128, so fades, loudness and limiting are done here in JS; ffmpeg only
// decodes non-WAV sources (and resamples a WAV that is not 48 kHz). Nothing here has been listened to: the QA JSON
// reports what was measured.
import {execFileSync} from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const STUDIO = path.resolve(here, '../../..');
export const ROOT = path.resolve(STUDIO, '..');
const FFD = path.join(STUDIO, 'node_modules/@remotion/compositor-linux-x64-gnu');
export const ffmpeg = (args, opt = {}) => {
  try {
    return execFileSync(path.join(FFD, 'ffmpeg'), ['-hide_banner', '-v', 'error', '-y', ...args], {env: {...process.env, LD_LIBRARY_PATH: FFD}, maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'pipe'], ...opt});
  } catch (e) {
    throw new Error(`ffmpeg ${args.join(' ').slice(0, 300)}\n${String(e.stderr || e.message).slice(-1500)}`);
  }
};
export const ffprobe = (args) => execFileSync(path.join(FFD, 'ffprobe'), ['-v', 'error', ...args], {env: {...process.env, LD_LIBRARY_PATH: FFD}, maxBuffer: 1 << 26}).toString();
const SR = 48000;
const abs = (p) => (path.isAbsolute(p) ? p : path.join(ROOT, p));
const dbl = (db) => Math.pow(10, db / 20);
const r3 = (x) => Math.round(x * 1000) / 1000;

// ---------------------------------------------------------------- WAV in / out
/** Parse a PCM / float WAV into planar Float32 channels. Returns null for a format this reader doesn't handle. */
const parseWav = (buf) => {
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WAVE') return null;
  let p = 12;
  let fmt = null;
  let data = null;
  while (p + 8 <= buf.length) {
    const id = buf.toString('ascii', p, p + 4);
    let size = buf.readUInt32LE(p + 4);
    if (id === 'data' && (size === 0 || size === 0xffffffff || p + 8 + size > buf.length)) size = buf.length - p - 8;
    if (id === 'fmt ') {
      let format = buf.readUInt16LE(p + 8);
      const channels = buf.readUInt16LE(p + 10);
      const rate = buf.readUInt32LE(p + 12);
      const bits = buf.readUInt16LE(p + 22);
      if (format === 0xfffe && size >= 40) format = buf.readUInt16LE(p + 8 + 24);
      fmt = {format, channels, rate, bits};
    } else if (id === 'data') data = {off: p + 8, size};
    p += 8 + size + (size & 1);
  }
  if (!fmt || !data) return null;
  const {format, channels, rate, bits} = fmt;
  const bps = bits / 8;
  const n = Math.floor(data.size / (bps * channels));
  const ch = Array.from({length: channels}, () => new Float32Array(n));
  let o = data.off;
  if (format === 1 && bits === 16) for (let i = 0; i < n; i++) for (let c = 0; c < channels; c++, o += 2) ch[c][i] = buf.readInt16LE(o) / 32768;
  else if (format === 1 && bits === 24) for (let i = 0; i < n; i++) for (let c = 0; c < channels; c++, o += 3) ch[c][i] = (buf[o] | (buf[o + 1] << 8) | ((buf[o + 2] << 24) >> 8)) / 8388608;
  else if (format === 1 && bits === 32) for (let i = 0; i < n; i++) for (let c = 0; c < channels; c++, o += 4) ch[c][i] = buf.readInt32LE(o) / 2147483648;
  else if (format === 3 && bits === 32) for (let i = 0; i < n; i++) for (let c = 0; c < channels; c++, o += 4) ch[c][i] = buf.readFloatLE(o);
  else if (format === 3 && bits === 64) for (let i = 0; i < n; i++) for (let c = 0; c < channels; c++, o += 8) ch[c][i] = buf.readDoubleLE(o);
  else return null;
  return {rate, ch};
};

/** 24-bit PCM stereo WAV, written in chunks. */
export const writeWav24 = (file, L, R) => {
  const n = L.length;
  const dataBytes = n * 6;
  const fd = fs.openSync(file + '.tmp', 'w');
  const h = Buffer.alloc(44);
  h.write('RIFF', 0, 'ascii');
  h.writeUInt32LE(36 + dataBytes, 4);
  h.write('WAVEfmt ', 8, 'ascii');
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(2, 22);
  h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * 6, 28);
  h.writeUInt16LE(6, 32);
  h.writeUInt16LE(24, 34);
  h.write('data', 36, 'ascii');
  h.writeUInt32LE(dataBytes, 40);
  fs.writeSync(fd, h);
  const CH = SR * 10;
  const b = Buffer.alloc(CH * 6);
  for (let s = 0; s < n; s += CH) {
    const e = Math.min(n, s + CH);
    let o = 0;
    for (let i = s; i < e; i++) {
      const l = Math.max(-8388608, Math.min(8388607, Math.round(L[i] * 8388608)));
      const r = Math.max(-8388608, Math.min(8388607, Math.round(R[i] * 8388608)));
      b[o++] = l & 255;
      b[o++] = (l >> 8) & 255;
      b[o++] = (l >> 16) & 255;
      b[o++] = r & 255;
      b[o++] = (r >> 8) & 255;
      b[o++] = (r >> 16) & 255;
    }
    fs.writeSync(fd, b, 0, o);
  }
  fs.closeSync(fd);
  fs.renameSync(file + '.tmp', file);
};

const cache = new Map();
/** Load any audio (or the audio track of a video) as 48 kHz planar float; non-WAV / non-48k go through ffmpeg once
 *  (decoded copies are kept in <work>/decoded/, keyed by path + size + mtime). */
export const loadAudio = (src, work) => {
  const file = abs(src);
  if (cache.has(file)) return cache.get(file);
  if (!fs.existsSync(file)) return null;
  let a = null;
  if (/\.wav$/i.test(file)) a = parseWav(fs.readFileSync(file));
  if (!a || a.rate !== SR) {
    const st = fs.statSync(file);
    const key = crypto.createHash('sha1').update(`${file}|${st.size}|${st.mtimeMs}`).digest('hex').slice(0, 16);
    const dir = path.join(work, 'decoded');
    fs.mkdirSync(dir, {recursive: true});
    const out = path.join(dir, `${path.basename(file).replace(/\.[^.]+$/, '')}-${key}.wav`);
    if (!fs.existsSync(out)) ffmpeg(['-i', file, '-vn', '-ar', String(SR), '-c:a', 'pcm_s24le', '-f', 'wav', out + '.part.wav']), fs.renameSync(out + '.part.wav', out);
    a = parseWav(fs.readFileSync(out));
  }
  if (a) cache.set(file, a);
  return a;
};

// ---------------------------------------------------------------- loudness (ITU-R BS.1770-4, 48 kHz)
const kFilter = (x) => {
  // stage 1: high shelf; stage 2: RLB high-pass (48 kHz coefficients from BS.1770)
  const y = new Float32Array(x.length);
  let [x1, x2, y1, y2] = [0, 0, 0, 0];
  const [b0, b1, b2, a1, a2] = [1.53512485958697, -2.69169618940638, 1.19839281085285, -1.69065929318241, 0.73248077421585];
  for (let i = 0; i < x.length; i++) {
    const v = b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1;
    x1 = x[i];
    y2 = y1;
    y1 = v;
    y[i] = v;
  }
  [x1, x2, y1, y2] = [0, 0, 0, 0];
  const [c0, c1, c2, d1, d2] = [1.0, -2.0, 1.0, -1.99004745483398, 0.99007225036621];
  for (let i = 0; i < y.length; i++) {
    const s = y[i];
    const v = c0 * s + c1 * x1 + c2 * x2 - d1 * y1 - d2 * y2;
    x2 = x1;
    x1 = s;
    y2 = y1;
    y1 = v;
    y[i] = v;
  }
  return y;
};
/** K-weighted energy per 100 ms hop, summed over the first two channels (the BS.1770 block sums). */
const hopEnergy = (chs, s0 = 0, s1 = chs[0].length) => {
  const hop = SR / 10;
  const nh = Math.max(0, Math.floor((s1 - s0) / hop));
  const hs = new Float64Array(nh);
  for (const c of chs.slice(0, 2)) {
    const y = kFilter(c.subarray(s0, s0 + nh * hop));
    for (let h = 0; h < nh; h++) {
      let e = 0;
      for (let i = h * hop, z = i + hop; i < z; i++) e += y[i] * y[i];
      hs[h] += e;
    }
  }
  return hs;
};
/** Integrated loudness (LUFS, 400 ms blocks, 75 % overlap, -70 absolute and -10 relative gates) of hops [h0, h1). */
const lufsHops = (hs, h0 = 0, h1 = hs.length) => {
  const win = SR * 0.4;
  const L = (z) => -0.691 + 10 * Math.log10(z);
  const g1 = [];
  for (let h = Math.max(0, h0); h + 4 <= Math.min(h1, hs.length); h++) {
    const z = (hs[h] + hs[h + 1] + hs[h + 2] + hs[h + 3]) / win;
    if (z > 0 && L(z) > -70) g1.push(z);
  }
  if (!g1.length) return -Infinity;
  const rel = L(g1.reduce((a, b) => a + b, 0) / g1.length) - 10;
  let n = 0;
  let sum = 0;
  for (const z of g1) if (L(z) > rel) (sum += z), n++;
  return n ? L(sum / n) : -Infinity;
};
/** Integrated loudness (LUFS) of planar channels over [s0, s1) samples; -Infinity when everything is gated out. */
export const lufs = (chs, s0 = 0, s1 = chs[0].length) => (s1 - s0 < SR * 0.4 ? -Infinity : lufsHops(hopEnergy(chs, s0, s1)));
const peakDb = (chs, s0 = 0, s1 = chs[0].length) => {
  let p = 0;
  for (const c of chs) for (let i = s0; i < s1; i++) p = Math.max(p, Math.abs(c[i]));
  return p > 0 ? 20 * Math.log10(p) : -Infinity;
};
const rmsDb = (chs, s0, s1) => {
  let s = 0;
  let n = 0;
  for (const c of chs) for (let i = s0; i < s1; i++) (s += c[i] * c[i]), n++;
  return n && s > 0 ? 10 * Math.log10(s / n) : -Infinity;
};

// ---------------------------------------------------------------- programmatic beds (cues with no render yet)
// reelbed.py's chord table (F minor, the theme's jazz world): bass + four-voice piano voicing
const CHORDS = {
  Fm9: ['F2', 'Ab3', 'C4', 'Eb4', 'G4'],
  Fm11: ['F2', 'Ab3', 'Bb3', 'Eb4', 'G4'],
  'Dbmaj9#11': ['Db2', 'F3', 'G3', 'C4', 'Eb4'],
  Bbm9: ['Bb1', 'Ab3', 'C4', 'Db4', 'F4'],
  'C7#9b13': ['C2', 'E3', 'Bb3', 'Eb4', 'Ab4'],
  Abmaj9: ['Ab1', 'G3', 'Bb3', 'C4', 'Eb4'],
  Eb9sus4: ['Eb2', 'Ab3', 'Bb3', 'Db4', 'F4'],
  Gm7b5: ['G1', 'F3', 'Bb3', 'C4', 'Db4'],
  'Db69#11': ['Db2', 'F3', 'Bb3', 'Eb4', 'G4'],
  F9sus4: ['F2', 'Bb3', 'Eb4', 'G4', 'C5'],
};
const NOTE = {C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11};
const hz = (name) => {
  const m = name.match(/^([A-G])(b|#)?(-?\d)$/);
  if (!m) return 220;
  const midi = 12 * (Number(m[3]) + 1) + NOTE[m[1]] + (m[2] === 'b' ? -1 : m[2] === '#' ? 1 : 0);
  return 440 * Math.pow(2, (midi - 69) / 12);
};
const rand = (seed) => {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
};
/** A soft sustained pad: each chord swells in (up to 1.2 s) and overlaps the next by up to 1.5 s; a sine with soft 2nd
 *  and 3rd partials (one wavetable), each voice doubled ±3 cents, a slow 0.13 Hz breathing, voices spread a little in
 *  stereo. Deliberately plain: it is a labelled stand-in for a cue that has no render yet. */
const TBL = 4096;
const WAVE = (() => {
  const t = new Float32Array(TBL + 1);
  for (let i = 0; i <= TBL; i++) {
    const w = (2 * Math.PI * i) / TBL;
    t[i] = Math.sin(w) + 0.22 * Math.sin(2 * w) + 0.06 * Math.sin(3 * w);
  }
  return t;
})();
const synthPad = (spec, seconds) => {
  const n = Math.ceil(seconds * SR);
  const L = new Float32Array(n);
  const R = new Float32Array(n);
  const chords = (spec.chords && spec.chords.length ? spec.chords : ['Fm9']).filter((c) => CHORDS[c]);
  if (!chords.length) chords.push('Fm9');
  const len = (spec.barsPerChord || 2) * 4 * (60 / (spec.bpm || 72));
  const att = Math.min(1.2, len / 3);
  const ovl = Math.min(1.5, len / 2);
  const rnd = rand(spec.seed || 1);
  for (let k = 0; k * len < seconds; k++) {
    const notes = CHORDS[chords[k % chords.length]];
    const t0 = k * len;
    const t1 = Math.min(seconds, t0 + len + ovl);
    const s0 = Math.floor(t0 * SR);
    const s1 = Math.min(n, Math.floor(t1 * SR));
    const m = s1 - s0;
    const env = new Float32Array(m);
    for (let i = 0; i < m; i++) {
      const t = i / SR;
      env[i] = Math.min(1, t / att, (t1 - t0 - t) / ovl) * (0.9 + 0.1 * Math.sin(2 * Math.PI * 0.13 * ((s0 + i) / SR)));
    }
    notes.forEach((nm, vi) => {
      const amp = (vi === 0 ? 0.32 : 0.16) * 0.5;
      const pan = vi === 0 ? 0.5 : 0.2 + 0.6 * ((vi - 1) / 3);
      const gl = amp * (1 - pan);
      const gr = amp * pan;
      for (const d of [1.0017, 0.9983]) {
        const inc = (hz(nm) * d * TBL) / SR;
        let ph = rnd() * TBL;
        for (let i = 0; i < m; i++) {
          const j = ph | 0;
          const v = (WAVE[j] + (WAVE[j + 1] - WAVE[j]) * (ph - j)) * env[i];
          L[s0 + i] += v * gl;
          R[s0 + i] += v * gr;
          ph += inc;
          if (ph >= TBL) ph -= TBL;
        }
      }
    });
  }
  return [L, R];
};
/** Room-tone stand-in: decorrelated brown-ish noise, low-passed twice (~350 Hz), DC-blocked. */
const synthRoom = (spec, seconds) => {
  const n = Math.ceil(seconds * SR);
  const out = [];
  for (let c = 0; c < 2; c++) {
    const r = rand((spec.seed || 1) * 7 + c * 101);
    const y = new Float32Array(n);
    let a = 0;
    let b = 0;
    let dc = 0;
    const k = 1 - Math.exp((-2 * Math.PI * 350) / SR);
    for (let i = 0; i < n; i++) {
      a += k * (r() * 2 - 1 - a);
      b += k * (a - b);
      dc += 0.0005 * (b - dc);
      y[i] = (b - dc) * 4;
    }
    out.push(y);
  }
  return out;
};

// ---------------------------------------------------------------- envelopes
/** Gate (bed off where a chapter brings its own sound) × duck (under recorded speech), at a 1 kHz control rate. */
const bedControl = (plan, seconds) => {
  const CR = 1000;
  const n = Math.ceil(seconds * CR) + 2;
  const g = new Float32Array(n).fill(1);
  for (const gt of plan.gates) {
    const e = Math.max(0.005, gt.edge);
    for (let i = Math.max(0, Math.floor((gt.from - e) * CR)); i < Math.min(n, Math.ceil((gt.to + e) * CR)); i++) {
      const t = i / CR;
      const v = t < gt.from ? (gt.from - t) / e : t > gt.to ? (t - gt.to) / e : 0;
      g[i] = Math.min(g[i], Math.max(0, Math.min(1, v)));
    }
  }
  const m = plan.mix;
  const spans = [];
  for (const [a, b] of plan.speech) {
    const s = [a - m.duckPre, b + 0.1];
    const last = spans[spans.length - 1];
    if (last && s[0] - last[1] < m.duckHold) last[1] = Math.max(last[1], s[1]);
    else spans.push(s);
  }
  const d = new Float32Array(n).fill(1);
  const low = dbl(m.duck);
  for (const [a, b] of spans) {
    for (let i = Math.max(0, Math.floor((a - 0.2) * CR)); i < Math.min(n, Math.ceil((b + 0.6) * CR)); i++) {
      const t = i / CR;
      const u = t < a ? (t - (a - 0.2)) / 0.2 : t > b ? 1 - (t - b) / 0.6 : 1; // 0..1 how far into the duck
      d[i] = Math.min(d[i], 1 + (low - 1) * Math.max(0, Math.min(1, u)));
    }
  }
  for (let i = 0; i < n; i++) g[i] *= d[i];
  return {CR, g, spans};
};

const cueLoop = (src) => {
  try {
    const f = abs(src).replace(/-(underscore|album)\.wav$/i, '.cue.json');
    const j = JSON.parse(fs.readFileSync(f, 'utf8'));
    const a = j?.loop?.start?.sec;
    const b = j?.loop?.end?.sec;
    return typeof a === 'number' && typeof b === 'number' && b > a ? [a, b] : null;
  } catch {
    return null;
  }
};

// ---------------------------------------------------------------- the mix
export const mixPlan = (plan, {out, work, log = console.log}) => {
  const t0 = Date.now();
  fs.mkdirSync(work, {recursive: true});
  const seconds = plan.total / plan.fps;
  const N = Math.ceil(seconds * SR);
  const L = new Float32Array(N);
  const R = new Float32Array(N);
  const qa = {plan: plan.key, seconds: r3(seconds), samples: N, clips: [], beds: [], missing: [], chapters: [], warnings: [...plan.warnings], stages: {}};
  let tS = Date.now();
  const stage = (k) => {
    qa.stages[k] = r3((Date.now() - tS) / 1000);
    tS = Date.now();
  };

  // 1. clips: chapter premixes, the video slot's sound, recorded takes
  for (const c of plan.clips) {
    const a = loadAudio(c.src, work);
    if (!a) {
      qa.missing.push(c.src);
      continue;
    }
    const src0 = Math.round(c.in * SR);
    const avail = a.ch[0].length - src0;
    const len = Math.max(0, Math.min(avail, c.dur === null ? avail : Math.round(c.dur * SR)));
    const d0 = Math.round(c.at * SR);
    const g = dbl(c.gain);
    const fi = Math.max(1, Math.round(c.fadeIn * SR));
    const fo = Math.max(1, Math.round(c.fadeOut * SR));
    const cl = a.ch[0];
    const cr = a.ch.length > 1 && !c.mono ? a.ch[1] : a.ch[0];
    for (let i = Math.max(0, -d0); i < len && d0 + i < N; i++) {
      const e = g * Math.min(1, (i + 1) / fi, (len - i) / fo);
      L[d0 + i] += cl[src0 + i] * e;
      R[d0 + i] += cr[src0 + i] * e;
    }
    if (c.role !== 'dialogue' || qa.clips.length < 400) qa.clips.push({role: c.role, label: c.label, src: c.src, at: r3(c.at), seconds: r3(len / SR), gain: c.gain});
  }
  const dlgN = plan.clips.filter((c) => c.role === 'dialogue').length;
  stage('clips');

  // 2. beds
  const {CR, g: ctl, spans} = bedControl(plan, seconds);
  const gate = bedControl({...plan, speech: []}, seconds).g; // the gate alone (no duck), for the floor
  const loud = new Map();
  for (const b of plan.beds) {
    const atEnd = b.to >= seconds - 0.01;
    let s = Math.max(0, b.from - b.xfIn / 2);
    let e = Math.min(seconds, atEnd ? b.to : b.to + b.xfOut / 2);
    // only the audible span: a bed that runs on under a gated chapter stops where the gate closes
    let a0 = Math.floor(s * CR);
    let a1 = Math.min(ctl.length - 1, Math.ceil(e * CR));
    while (a0 < a1 && ctl[a0] <= 0) a0++;
    while (a1 > a0 && ctl[a1] <= 0) a1--;
    s = Math.max(s, a0 / CR - 0.002);
    e = Math.min(e, a1 / CR + 0.002);
    if (e <= s) continue;
    let src; // planar source channels, the bed's `in` point at index inS
    let loop = null; // [a, b] in samples
    let X = 0; // loop-tail crossfade, samples
    let srcL = null;
    let tag;
    let inS = Math.round(b.in * SR);
    if (b.src) {
      const a = loadAudio(b.src, work);
      if (!a) {
        qa.missing.push(b.src);
        continue;
      }
      const lp = b.loop === 'none' ? null : Array.isArray(b.loop) ? b.loop : cueLoop(b.src) ?? (b.loop === 'file' || b.loop === 'cue' ? [b.in, a.ch[0].length / SR - 1] : null);
      src = [a.ch[0], a.ch[1] ?? a.ch[0]];
      if (lp && lp[1] > lp[0] + 0.5) {
        const lenS = src[0].length;
        loop = [Math.round(lp[0] * SR), Math.min(lenS, Math.round(lp[1] * SR))];
        // the crossfade after a wrap comes from the material after b (the previous pass's own tail), up to 1 s;
        // a loop that ends on a designed rest has no tail, so it is butt-spliced (20 ms)
        X = Math.max(0, Math.min(SR, lenS - loop[1], Math.floor((loop[1] - loop[0]) / 4)));
        if (X > SR * 0.02 && rmsDb(src, loop[1], loop[1] + X) < -60) X = Math.round(SR * 0.02);
      }
      if (!loud.has(b.src)) loud.set(b.src, lufs(a.ch));
      srcL = loud.get(b.src);
      tag = `${b.src}${loop ? ` loop ${r3(loop[0] / SR)}-${r3(loop[1] / SR)}${X <= SR * 0.02 ? ' (butt splice)' : ''}` : ''}`;
    } else {
      const dur = Math.max(1, e - b.from + 1);
      src = b.pad.type === 'room' ? synthRoom(b.pad, dur) : synthPad(b.pad, dur);
      srcL = lufs(src);
      inS = 0;
      tag = b.pad.type === 'room' ? 'room tone (synth)' : `pad ${b.pad.chords.join(' ') || 'Fm9'} (synth)`;
    }
    const gainDb = (b.lufs !== null && Number.isFinite(srcL) ? b.lufs - srcL : 0) + b.gain;
    const g = dbl(gainDb);
    const i0 = Math.floor(s * SR);
    const i1 = Math.min(N, Math.ceil(e * SR));
    const fromS = Math.round(b.from * SR);
    const fiA = Math.round((b.from - b.xfIn / 2) * SR);
    const fiN = Math.max(1, Math.round(b.xfIn * SR));
    const foA = Math.round((atEnd ? b.to - b.xfOut : b.to - b.xfOut / 2) * SR);
    const foN = Math.max(1, Math.round(b.xfOut * SR));
    const [S0, S1] = src;
    const lenS = S0.length;
    const P = loop ? loop[1] - loop[0] : 0;
    const spb = SR / CR; // samples per control step
    for (let i = i0; i < i1; i++) {
      const pos = inS + (i - fromS); // source sample
      if (pos < 0) continue;
      let env = ctl[(i / spb) | 0] * g;
      if (i < fiA + fiN) env *= Math.sin((Math.max(0, (i - fiA) / fiN) * Math.PI) / 2);
      if (i > foA) env *= Math.cos((Math.min(1, (i - foA) / foN) * Math.PI) / 2);
      if (env <= 0) continue;
      let v0;
      let v1;
      if (loop && pos >= loop[1]) {
        const q = loop[0] + ((pos - loop[0]) % P); // period exactly b - a
        const since = q - loop[0];
        if (since < X) {
          const u = (since / X) * (Math.PI / 2);
          const ci = Math.cos(u);
          const si = Math.sin(u);
          v0 = S0[q] * si + S0[loop[1] + since] * ci;
          v1 = S1[q] * si + S1[loop[1] + since] * ci;
        } else {
          v0 = S0[q];
          v1 = S1[q];
        }
      } else if (pos < lenS) {
        v0 = S0[pos];
        v1 = S1[pos];
      } else continue;
      L[i] += v0 * env;
      R[i] += v1 * env;
    }
    qa.beds.push({label: b.label, cue: b.cue, from: r3(b.from), to: r3(b.to), xfIn: b.xfIn, xfOut: b.xfOut, source: tag, sourceLufs: Number.isFinite(srcL) ? r3(srcL) : null, targetLufs: b.lufs, gainDb: r3(gainDb)});
  }

  stage('beds');
  // the floor: a very low room tone wherever the bed runs (a designed rest in a cue never becomes digital black)
  if (plan.mix.floor !== null && plan.mix.floor !== undefined) {
    const fl = synthRoom({seed: 97}, seconds);
    const gf = dbl(plan.mix.floor - lufs(fl, 0, Math.min(N, SR * 30))); // stationary noise: 30 s is enough to measure
    const spb = SR / CR;
    const [F0, F1] = fl;
    for (let i = 0; i < N; i++) {
      const e = gate[(i / spb) | 0] * gf;
      if (e > 0) (L[i] += F0[i] * e), (R[i] += F1[i] * e);
    }
    qa.floor = {lufs: plan.mix.floor};
  }
  // (nothing plays under the reel's own title slate)
  const tEnd = plan.chapters.find((c) => c.kind === 'title');
  if (tEnd) for (let i = 0, e = Math.min(N, Math.round(((tEnd.from + tEnd.dur) / plan.fps) * SR)); i < e; i++) L[i] = R[i] = 0;
  stage('floor');

  // 3. master: match the integrated target, then limit to the ceiling
  const pre = plan.mix.lufs !== null ? lufs([L, R]) : null;
  let masterDb = 0;
  if (pre !== null && Number.isFinite(pre)) masterDb = plan.mix.lufs - pre;
  const mg = dbl(masterDb);
  for (let i = 0; i < N; i++) (L[i] *= mg), (R[i] *= mg);
  const lim = limit(L, R, dbl(plan.mix.ceiling));

  // 4. QA
  const hs = hopEnergy([L, R]); // one K-weighting pass for the master and every chapter
  qa.master = {preLufs: pre === null ? null : r3(pre), gainDb: r3(masterDb), limiter: lim, lufs: r3(lufsHops(hs)), samplePeakDb: r3(peakDb([L, R])), ceilingDb: plan.mix.ceiling, note: 'sample peak (not true peak); BS.1770 integrated loudness computed in JS'};
  qa.dialogue = {takes: dlgN, duckSpans: spans.length, duckDb: plan.mix.duck};
  stage('master');
  for (const ch of plan.chapters) {
    const s0 = Math.round((ch.from / plan.fps) * SR);
    const s1 = Math.min(N, Math.round(((ch.from + ch.dur) / plan.fps) * SR));
    qa.chapters.push({id: ch.id, label: ch.label, from: r3(ch.from / plan.fps), seconds: r3((s1 - s0) / SR), lufs: r3(lufsHops(hs, Math.round(s0 / (SR / 10)), Math.floor(s1 / (SR / 10)))), rmsDb: r3(rmsDb([L, R], s0, s1)), peakDb: r3(peakDb([L, R], s0, s1)), audio: ch.audio});
  }
  // silent stretches (digital black, 0.5 s or longer), which the flow notes forbid unless the script asks
  const holes = [];
  const blk = SR / 20;
  let run = 0;
  for (let s = 0; s + blk <= N; s += blk) {
    let pk = 0;
    for (let i = s; i < s + blk; i++) pk = Math.max(pk, Math.abs(L[i]), Math.abs(R[i]));
    if (pk < 1e-5) run += blk;
    else {
      if (run >= SR / 2) holes.push([r3((s - run) / SR), r3(s / SR)]);
      run = 0;
    }
  }
  if (run >= SR / 2) holes.push([r3((N - run) / SR), r3(N / SR)]);
  qa.silences = holes;
  stage('qa');
  writeWav24(out, L, R);
  stage('write');
  qa.seconds_wall = r3((Date.now() - t0) / 1000);
  fs.writeFileSync(out.replace(/\.wav$/i, '') + '-qa.json', JSON.stringify(qa, null, 1));
  log(`  mix: ${r3(seconds)} s, ${plan.clips.length - dlgN} clip(s) + ${dlgN} take(s), ${qa.beds.length} bed(s); ${qa.master.lufs} LUFS, peak ${qa.master.samplePeakDb} dBFS, ${qa.missing.length} missing, ${holes.length} silence(s) >= 0.5 s; ${qa.seconds_wall} s wall`);
  return qa;
};

/** Look-ahead peak limiter (5 ms look-ahead, 80 ms release), in place; guarantees |x| <= ceil. */
const limit = (L, R, ceil) => {
  const N = L.length;
  const LA = Math.round(0.005 * SR);
  const rel = 1 - Math.exp(-1 / (0.08 * SR));
  const r = new Float32Array(N);
  let hits = 0;
  for (let i = 0; i < N; i++) {
    const p = Math.max(Math.abs(L[i]), Math.abs(R[i]));
    r[i] = p > ceil ? ceil / p : 1;
    if (p > ceil) hits++;
  }
  if (!hits) return {engaged: false, samples: 0, minGainDb: 0};
  // g1[k] = min r[k .. k+LA] (monotonic deque), then a box average over LA, then release smoothing
  const g1 = new Float32Array(N);
  const dq = new Int32Array(N);
  let h = 0;
  let t = 0;
  for (let i = N - 1; i >= 0; i--) {
    while (t > h && r[dq[t - 1]] >= r[i]) t--;
    dq[t++] = i;
    while (dq[h] > i + LA) h++;
    g1[i] = r[dq[h]];
  }
  let acc = LA; // running sum of g1 over the last LA samples (g1 = 1 before the start)
  let g = 1;
  let minG = 1;
  for (let i = 0; i < N; i++) {
    acc += g1[i] - (i >= LA ? g1[i - LA] : 1);
    const box = acc / LA;
    g = Math.min(box, g + (1 - g) * rel);
    minG = Math.min(minG, g);
    L[i] *= g;
    R[i] *= g;
  }
  return {engaged: true, samples: hits, minGainDb: r3(20 * Math.log10(minG))};
};

// ---------------------------------------------------------------- CLI
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [planFile, out] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const wi = process.argv.indexOf('--work');
  if (!planFile || !out) {
    console.error('usage: node src/reel/tools/mixer.mjs <plan.json> <out.wav> [--work <dir>]');
    process.exit(1);
  }
  const plan = JSON.parse(fs.readFileSync(planFile, 'utf8'));
  mixPlan(plan, {out: path.resolve(out), work: wi > 0 ? path.resolve(process.argv[wi + 1]) : path.dirname(path.resolve(out))});
}
