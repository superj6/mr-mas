// @ts-nocheck -- Node-only tool (bundled with esbuild), excluded from the browser typecheck.
// MR. MAS — Ep2 v1 art: a minimal PNG reader for the 3D plates (8-bit RGB / RGBA, non-interlaced: what Blender writes
// with color_depth '8'). Returns {w, h, c: Uint32Array of 0xRRGGBB}, or null when the file is missing.
import * as fs from 'fs';
import * as zlib from 'zlib';

export const readPNG = (file: string): {w: number; h: number; c: Uint32Array} | null => {
  if (!fs.existsSync(file)) return null;
  const buf = fs.readFileSync(file);
  let p = 8, w = 0, h = 0, ct = 0, depth = 0;
  const idat: Buffer[] = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), type = buf.toString('ascii', p + 4, p + 8), d = buf.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') { w = d.readUInt32BE(0); h = d.readUInt32BE(4); depth = d[8]; ct = d[9]; if (d[12]) throw new Error('interlaced PNG'); }
    else if (type === 'IDAT') idat.push(d);
    else if (type === 'IEND') break;
    p += 12 + len;
  }
  if (depth !== 8 || (ct !== 2 && ct !== 6)) throw new Error(`unsupported PNG (depth ${depth}, colour type ${ct})`);
  const bpp = ct === 6 ? 4 : 3, stride = w * bpp;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const px = new Uint8Array(stride * h);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)), o = y * stride;
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? px[o + i - bpp] : 0, b = y ? px[o - stride + i] : 0, c = y && i >= bpp ? px[o - stride + i - bpp] : 0;
      let v = src[i];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      px[o + i] = v & 255;
    }
  }
  const c = new Uint32Array(w * h);
  for (let i = 0; i < w * h; i++) c[i] = (px[i * bpp] << 16) | (px[i * bpp + 1] << 8) | px[i * bpp + 2];
  return {w, h, c};
};
/** box-average a plate down to w x h (for the 480 x 270 contact-sheet previews only; the composites keep it whole) */
export const downsample = (img: {w: number; h: number; c: Uint32Array}, w: number, h: number) => {
  const out = new Uint32Array(w * h), sx = img.w / w, sy = img.h / h;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let r = 0, g = 0, b = 0, n = 0;
    for (let j = Math.floor(y * sy); j < Math.floor((y + 1) * sy); j++) for (let i = Math.floor(x * sx); i < Math.floor((x + 1) * sx); i++) { const v = img.c[j * img.w + i]; r += v >> 16; g += (v >> 8) & 255; b += v & 255; n++; }
    out[y * w + x] = n ? (Math.round(r / n) << 16) | (Math.round(g / n) << 8) | Math.round(b / n) : 0;
  }
  return out;
};
