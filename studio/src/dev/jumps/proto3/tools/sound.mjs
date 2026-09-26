// MR. MAS — style jump prototype C · J6 · THE RING: the temp sound pass and the mux. Node only, no dependencies.
// Brief (style-jumps §5.3 and §3.4, M2): "The room, then true silence for the whole jump; the hum returns on the snap."
// "Picture leaves the grid; sound leaves the chip." No sting, no whoosh, no riser, no impact, no water, nothing inside:
// the jump's effect is subtraction. So this pass uses only the room bed from audio/sfx/wav (server_hum, room_tone)
// plus a faint synthesized monitor whine, cuts ALL of it to digital zero on p30, and brings it back on p90 in phase
// (the samples continue from the clip's clock, as if the room had kept running while we weren't listening).
//
//   node src/dev/jumps/proto3/tools/sound.mjs [picture.mp4] [out.mp4]
//   defaults: ../out/jumps/proto3-picture.mp4 -> ../out/jumps/proto3.mp4 (+ ../out/jumps/proto3-sound.wav)
import fs from 'fs';
import path from 'path';
import {execFileSync} from 'child_process';
import {fileURLToPath} from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const STUDIO = path.resolve(HERE, '../../../../..');
const ROOT = path.resolve(STUDIO, '..');
const SFX = path.join(ROOT, 'audio/sfx/wav');
const OUT = path.join(ROOT, 'out/jumps');
const picture = process.argv[2] ?? path.join(OUT, 'proto3-picture.mp4');
const final = process.argv[3] ?? path.join(OUT, 'proto3.mp4');
const wavOut = path.join(OUT, 'proto3-sound.wav');

const SR = 48000, FPS = 24, FRAMES = 120;
const JUMP_IN = 30, SNAP = 90; // prototype frames (ring.ts CLIP)
const N = (FRAMES / FPS) * SR;
const at = (f) => Math.round((f / FPS) * SR);

// ------------------------------------------------------------------ wav in (PCM 16/24/32, float32; any channels)
const readWav = (p) => {
  const b = fs.readFileSync(p);
  let o = 12, fmt = null, data = null;
  while (o + 8 <= b.length) {
    const id = b.toString('ascii', o, o + 4), len = b.readUInt32LE(o + 4);
    if (id === 'fmt ') fmt = {tag: b.readUInt16LE(o + 8), ch: b.readUInt16LE(o + 10), sr: b.readUInt32LE(o + 12), bits: b.readUInt16LE(o + 22), ext: len >= 26 ? b.readUInt16LE(o + 32) : 0};
    if (id === 'data') data = b.subarray(o + 8, o + 8 + len);
    o += 8 + len + (len & 1);
  }
  const tag = fmt.tag === 0xfffe ? fmt.ext : fmt.tag;
  const bps = fmt.bits / 8, frames = Math.floor(data.length / (bps * fmt.ch));
  const chans = Array.from({length: 2}, () => new Float32Array(frames));
  for (let i = 0; i < frames; i++)
    for (let c = 0; c < 2; c++) {
      const cc = Math.min(c, fmt.ch - 1), off = (i * fmt.ch + cc) * bps;
      let v;
      if (tag === 3) v = data.readFloatLE(off);
      else if (fmt.bits === 16) v = data.readInt16LE(off) / 32768;
      else if (fmt.bits === 24) v = data.readIntLE(off, 3) / 8388608;
      else v = data.readInt32LE(off) / 2147483648;
      chans[c][i] = v;
    }
  if (fmt.sr !== SR) throw new Error(`${p}: ${fmt.sr} Hz (expected ${SR})`);
  return chans;
};

// ------------------------------------------------------------------ the bed
const db = (d) => Math.pow(10, d / 20);
const hum = readWav(path.join(SFX, 'server_hum.wav'));
const room = readWav(path.join(SFX, 'room_tone.wav'));
const L = new Float32Array(N), R = new Float32Array(N);
const HUM = db(-15), ROOM = db(-21), WHINE = db(-62);
const HUM_OFF = 3 * SR + 1234; // where in the loop the clip begins (deterministic)
for (let i = 0; i < N; i++) {
  const h = (HUM_OFF + i) % hum[0].length, r = (i + 777) % room[0].length;
  // the monitor's whine: a faint, slightly unsteady coil tone, a little louder on the monitor's side (left)
  const t = i / SR;
  const w = Math.sin(2 * Math.PI * 11230 * t + 0.4 * Math.sin(2 * Math.PI * 0.7 * t)) * (0.8 + 0.2 * Math.sin(2 * Math.PI * 0.31 * t)) * WHINE;
  L[i] = hum[0][h] * HUM + room[0][r] * ROOM + w * 1.2;
  R[i] = hum[1][h] * HUM + room[1][r] * ROOM + w * 0.8;
}
// ------------------------------------------------------------------ the cut: digital zero for the whole jump
// 2 ms declick ramps only (the cut must read as a cut, not a fade): down ending ON p30's first sample, up from p90's.
const RAMP = Math.round(0.002 * SR);
const a = at(JUMP_IN), b = at(SNAP);
for (let i = 0; i < N; i++) {
  let g = 1;
  if (i >= a && i < b) g = 0;
  else if (i >= a - RAMP && i < a) g = (a - i) / RAMP;
  else if (i >= b && i < b + RAMP) g = (i - b) / RAMP;
  if (i < RAMP * 4) g *= i / (RAMP * 4); // the clip's own head and tail, declicked
  if (i >= N - RAMP * 4) g *= (N - i) / (RAMP * 4);
  L[i] *= g; R[i] *= g;
}
// ------------------------------------------------------------------ wav out (16-bit stereo, TPDF-dithered; zeros stay zero)
const pcm = Buffer.alloc(N * 4);
let seed = 12345;
const rnd = () => ((seed = (Math.imul(seed, 1103515245) + 12345) >>> 0) / 4294967296);
let peak = 0;
for (let i = 0; i < N; i++) {
  for (const [c, ch] of [[0, L], [1, R]]) {
    const v = ch[i];
    peak = Math.max(peak, Math.abs(v));
    const q = v === 0 ? 0 : Math.max(-32768, Math.min(32767, Math.round(v * 32767 + (rnd() - rnd()))));
    pcm.writeInt16LE(q, i * 4 + c * 2);
  }
}
const hdr = Buffer.alloc(44);
hdr.write('RIFF', 0); hdr.writeUInt32LE(36 + pcm.length, 4); hdr.write('WAVE', 8); hdr.write('fmt ', 12);
hdr.writeUInt32LE(16, 16); hdr.writeUInt16LE(1, 20); hdr.writeUInt16LE(2, 22); hdr.writeUInt32LE(SR, 24);
hdr.writeUInt32LE(SR * 4, 28); hdr.writeUInt16LE(4, 32); hdr.writeUInt16LE(16, 34); hdr.write('data', 36); hdr.writeUInt32LE(pcm.length, 40);
fs.mkdirSync(OUT, {recursive: true});
fs.writeFileSync(wavOut, Buffer.concat([hdr, pcm]));
let zeros = 0;
for (let i = a; i < b; i++) if (pcm.readInt16LE(i * 4) === 0 && pcm.readInt16LE(i * 4 + 2) === 0) zeros++;
console.log(`sound: ${wavOut}  peak ${(20 * Math.log10(peak)).toFixed(1)} dBFS  silence p${JUMP_IN}-p${SNAP - 1}: ${zeros}/${b - a} samples at digital zero`);

// ------------------------------------------------------------------ mux with the bundled ffmpeg (picture copied, AAC sound)
if (fs.existsSync(picture)) {
  const FF = path.join(STUDIO, 'node_modules/@remotion/compositor-linux-x64-gnu');
  execFileSync(path.join(FF, 'ffmpeg'), ['-v', 'error', '-y', '-i', picture, '-i', wavOut, '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', final], {env: {...process.env, LD_LIBRARY_PATH: FF}, stdio: 'inherit'});
  console.log(`muxed: ${final}`);
} else console.log(`(no picture at ${picture}; sound only)`);
