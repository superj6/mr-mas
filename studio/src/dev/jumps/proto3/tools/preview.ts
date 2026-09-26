// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Fast Node preview of jump prototype C (pixels and the continuous layer are exact: the same pure renderer the
// Remotion component calls).
//   npx esbuild src/dev/jumps/proto3/tools/preview.ts --bundle --platform=node --outfile=<scratch>/p3.js
//   node <scratch>/p3.js <outDir> <variant: jump|quantized> <f,f,..> [crop]      crop = a 2x crop around the glass
import * as fs from 'fs';
import * as zlib from 'zlib';
import {renderFrame} from '../render';

const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  return t;
})();
const crc32 = (buf) => { let c = 0xffffffff; for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (type, data) => {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0); out.write(type, 4, 'ascii'); Buffer.from(data).copy(out, 8);
  out.writeUInt32BE(crc32(new Uint8Array(out.subarray(4, 8 + data.length))), 8 + data.length);
  return out;
};
const writeRGBA = (path, w, h, rgba) => {
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 3 + 1)] = 0;
    for (let x = 0; x < w; x++) { const i = (y * w + x) * 4, o = y * (w * 3 + 1) + 1 + x * 3; raw[o] = rgba[i]; raw[o + 1] = rgba[i + 1]; raw[o + 2] = rgba[i + 2]; }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  fs.writeFileSync(path, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, {level: 6})), chunk('IEND', Buffer.alloc(0))]));
};

const [outDir, variant = 'jump', framesS = '0', crop] = process.argv.slice(2);
fs.mkdirSync(outDir, {recursive: true});
const list = framesS.includes('-') ? (() => { const [a, b, st = '1'] = framesS.split(/[-:]/).map(Number); const r = []; for (let f = a; f <= b; f += st) r.push(f); return r; })() : framesS.split(',').map(Number);
if (crop === 'stats') {
  // mean sRGB over the water disc, and over its lower half (away from the reflection), per frame
  for (const f of list) {
    const rgba = renderFrame(f, variant);
    const m = [0, 0, 0, 0], lo = [0, 0, 0, 0];
    for (let Y = 400 - 240; Y < 400 + 240; Y++) for (let X = 960 - 240; X < 960 + 240; X++) {
      const d = Math.hypot(X + 0.5 - 960, Y + 0.5 - 400);
      if (d > 250) continue;
      const i = (Y * 1920 + X) * 4;
      m[0] += rgba[i]; m[1] += rgba[i + 1]; m[2] += rgba[i + 2]; m[3]++;
      if (Y > 440) { lo[0] += rgba[i]; lo[1] += rgba[i + 1]; lo[2] += rgba[i + 2]; lo[3]++; }
    }
    const c = [0, 0, 0, 0];
    for (let Y = 400 - 36; Y < 400 + 36; Y++) for (let X = 960 - 36; X < 960 + 36; X++) { if (Math.hypot(X + 0.5 - 960, Y + 0.5 - 400) > 36) continue; const i = (Y * 1920 + X) * 4; c[0] += rgba[i]; c[1] += rgba[i + 1]; c[2] += rgba[i + 2]; c[3]++; }
    console.log(f, 'centre', c.slice(0, 3).map((v) => (v / c[3]).toFixed(1)).join(' '));
    console.log(f, 'disc', m.slice(0, 3).map((v) => (v / m[3]).toFixed(1)).join(' '), ' lower', lo.slice(0, 3).map((v) => (v / lo[3]).toFixed(1)).join(' '));
  }
  process.exit(0);
}
if (crop === 'glass') {
  // whole-glass crops (720 x 680 of the 1080 frame around the glass), box-downscaled 2x, 6 across, labelled by order
  const cw = 720, ch = 680, sc = 2, cols = 6, rows = Math.ceil(list.length / cols);
  const tw = cw / sc, th = ch / sc, W = tw * cols, H = th * rows;
  const out = new Uint8ClampedArray(W * H * 4);
  list.forEach((f, k) => {
    const rgba = renderFrame(f, variant);
    const ox = (k % cols) * tw, oy = Math.floor(k / cols) * th;
    for (let y = 0; y < th; y++) for (let x = 0; x < tw; x++) {
      const acc = [0, 0, 0];
      for (let j = 0; j < sc; j++) for (let i = 0; i < sc; i++) { const sx = 960 - cw / 2 + x * sc + i, sy = 400 - ch / 2 + y * sc + j; const q = (sy * 1920 + sx) * 4; acc[0] += rgba[q]; acc[1] += rgba[q + 1]; acc[2] += rgba[q + 2]; }
      const o = ((oy + y) * W + ox + x) * 4;
      out[o] = acc[0] / (sc * sc); out[o + 1] = acc[1] / (sc * sc); out[o + 2] = acc[2] / (sc * sc);
    }
  });
  writeRGBA(`${outDir}/${variant}-glass.png`, W, H, out);
  console.log(`${outDir}/${variant}-glass.png`, list.join(','));
  process.exit(0);
}
if (crop === 'sheet') {
  // a contact sheet: 1:1 crops of the glass (560 x 400 of the 1080 frame), 5 across
  const cw = 560, ch = 400, cols = 5, rows = Math.ceil(list.length / cols);
  const W = cw * cols, H = ch * rows;
  const out = new Uint8ClampedArray(W * H * 4);
  list.forEach((f, k) => {
    const rgba = renderFrame(f, variant);
    const ox = (k % cols) * cw, oy = Math.floor(k / cols) * ch;
    for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
      const i = ((400 - ch / 2 + y) * 1920 + 960 - cw / 2 + x) * 4, o = ((oy + y) * W + ox + x) * 4;
      out[o] = rgba[i]; out[o + 1] = rgba[i + 1]; out[o + 2] = rgba[i + 2];
    }
  });
  writeRGBA(`${outDir}/${variant}-sheet.png`, W, H, out);
  console.log(`${outDir}/${variant}-sheet.png`);
  process.exit(0);
}
for (const f of list) {
  const t0 = Date.now();
  const rgba = renderFrame(f, variant);
  const name = `${outDir}/${variant}-${String(f).padStart(3, '0')}${crop ? '-crop' : ''}.png`;
  if (crop) {
    // a 2x nearest crop of the glass (the 1080 frame's 560 x 400 around it -> 1120 x 800)
    const cx = 960, cy = 400, cw = 560, ch = 400, s = 2;
    const out = new Uint8ClampedArray(cw * s * ch * s * 4);
    for (let y = 0; y < ch * s; y++) for (let x = 0; x < cw * s; x++) {
      const sx = cx - cw / 2 + Math.floor(x / s), sy = cy - ch / 2 + Math.floor(y / s);
      const i = (sy * 1920 + sx) * 4, o = (y * cw * s + x) * 4;
      out[o] = rgba[i]; out[o + 1] = rgba[i + 1]; out[o + 2] = rgba[i + 2]; out[o + 3] = 255;
    }
    writeRGBA(name, cw * s, ch * s, out);
  } else writeRGBA(name, 1920, 1080, rgba);
  console.log(name, `${Date.now() - t0} ms`);
}
