// Offline bake of the maquette sculpts into painted-normal / AO / shadow passes (builder key: realism).
// Node only. Build + run:  see notes/realism.md ("Re-baking the drawn angles").
// Output per job:  <name>_n.png  RGB = camera-space normal (R=(x+1)/2, G=(1-y)/2 [y down], B=z), A = coverage
//                  <name>_m.png  R = ambient occlusion, G = key-light visibility, B = rim-light visibility, A = coverage
/* eslint-disable @typescript-eslint/no-var-requires */
import {V, nz, unrotYPR, rotYPR, View} from '../../../shared/realism/sculpt/sdf';
import {JOBS, Job} from './jobs';

declare const require: any;
declare const process: any;
declare const __filename: string;
const {Worker, isMainThread, parentPort, workerData} = require('worker_threads');
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

// ---------------- PNG ----------------
const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf: Uint8Array) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type: string, data: Uint8Array) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), Buffer.from(data)]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function writePNG(file: string, w: number, h: number, rgba: Uint8Array) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    Buffer.from(rgba.buffer, rgba.byteOffset + y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, {level: 9})),
    chunk('IEND', new Uint8Array(0)),
  ]);
  fs.writeFileSync(file, png);
}

// ---------------- raymarch ----------------
function calcNormal(f: (p: V) => number, p: V): V {
  const h = 0.004;
  const a = f([p[0] + h, p[1] - h, p[2] - h]);
  const b = f([p[0] - h, p[1] - h, p[2] + h]);
  const c = f([p[0] - h, p[1] + h, p[2] - h]);
  const d = f([p[0] + h, p[1] + h, p[2] + h]);
  return nz([a - b - c + d, -a - b + c + d, -a + b - c + d]);
}
function ao(f: (p: V) => number, p: V, n: V) {
  let occ = 0, sca = 1;
  for (let i = 0; i < 6; i++) {
    const hr = 0.08 + 0.32 * i;
    const d = f([p[0] + n[0] * hr, p[1] + n[1] * hr, p[2] + n[2] * hr]);
    occ += (hr - d) * sca;
    sca *= 0.72;
  }
  return Math.max(0, Math.min(1, 1 - 0.85 * occ));
}
function shadow(f: (p: V) => number, ro: V, rd: V, k: number) {
  let res = 1, t = 0.06, ph = 1e10;
  for (let i = 0; i < 90 && t < 40; i++) {
    const h = f([ro[0] + rd[0] * t, ro[1] + rd[1] * t, ro[2] + rd[2] * t]);
    if (h < 0.0005) return 0;
    const y = (h * h) / (2 * ph);
    const d = Math.sqrt(Math.max(0, h * h - y * y));
    res = Math.min(res, (k * d) / Math.max(0, t - y));
    ph = h;
    t += Math.max(0.02, Math.min(h, 1.2));
  }
  return Math.max(0, Math.min(1, res));
}

interface Rows {
  y0: number;
  y1: number;
}
function renderRows(job: Job, rows: Rows) {
  const {view, box, ppc} = job;
  const W = Math.round((box[2] - box[0]) * ppc), H = Math.round((box[3] - box[1]) * ppc);
  const n = new Uint8Array(W * (rows.y1 - rows.y0) * 4);
  const m = new Uint8Array(W * (rows.y1 - rows.y0) * 4);
  const vis = job.vis; // which sdf is "this layer"
  const all = job.all; // everything (occlusion + shadows)
  const px = 1 / ppc;
  const dirH = unrotYPR([0, 0, -1], view.yaw, view.pitch, view.roll);
  const keyH = nz(unrotYPR(job.key, view.yaw, view.pitch, view.roll));
  const rimH = nz(unrotYPR(job.rim, view.yaw, view.pitch, view.roll));
  for (let j = rows.y0; j < rows.y1; j++) {
    for (let i = 0; i < W; i++) {
      const X = box[0] + (i + 0.5) * px;
      const Y = box[3] - (j + 0.5) * px;
      const ro = unrotYPR([X, Y, 40], view.yaw, view.pitch, view.roll);
      let t = 0, hit = false, dmin = 1e9, tmin = 0;
      for (let s = 0; s < 220 && t < 90; s++) {
        const p: V = [ro[0] + dirH[0] * t, ro[1] + dirH[1] * t, ro[2] + dirH[2] * t];
        const d = all(p);
        if (d < dmin) {
          dmin = d;
          tmin = t;
        }
        if (d < 0.0015) {
          hit = true;
          break;
        }
        t += d * 0.9;
      }
      let cov = 0;
      let tt = t;
      if (hit) cov = 1;
      else if (dmin < px * 1.2) {
        cov = Math.max(0, Math.min(1, 0.5 - dmin / px + 0.35));
        tt = tmin;
      }
      const o = ((j - rows.y0) * W + i) * 4;
      if (cov <= 0) continue;
      const p: V = [ro[0] + dirH[0] * tt, ro[1] + dirH[1] * tt, ro[2] + dirH[2] * tt];
      // is the visible surface part of this layer?
      if (vis !== all) {
        const dv = vis(p);
        const da = all(p);
        if (dv > da + 0.02) continue; // something else is in front
      }
      const nH = calcNormal(vis, p);
      const nC = rotYPR(nH, view.yaw, view.pitch, view.roll);
      n[o] = Math.round(((nC[0] + 1) / 2) * 255);
      n[o + 1] = Math.round(((1 - nC[1]) / 2) * 255);
      n[o + 2] = Math.round(Math.max(0, nC[2]) * 255);
      n[o + 3] = Math.round(cov * 255);
      const q: V = [p[0] + nH[0] * 0.01, p[1] + nH[1] * 0.01, p[2] + nH[2] * 0.01];
      m[o] = Math.round(ao(all, p, nH) * 255);
      m[o + 1] = Math.round(shadow(all, q, keyH, job.keySoft ?? 6) * 255);
      m[o + 2] = Math.round(shadow(all, q, rimH, job.rimSoft ?? 8) * 255);
      m[o + 3] = Math.round(cov * 255);
    }
  }
  return {n, m, W, H};
}

if (isMainThread) {
  const only = process.argv[2];
  const outDir = process.argv[3];
  const jobs = JOBS.filter((j) => !only || only === 'all' || j.name.startsWith(only));
  const NW = 12;
  (async () => {
    for (const job of jobs) {
      const t0 = Date.now();
      const W = Math.round((job.box[2] - job.box[0]) * job.ppc), H = Math.round((job.box[3] - job.box[1]) * job.ppc);
      const N = new Uint8Array(W * H * 4), M = new Uint8Array(W * H * 4);
      const per = Math.ceil(H / (NW * 4));
      const tasks: Rows[] = [];
      for (let y = 0; y < H; y += per) tasks.push({y0: y, y1: Math.min(H, y + per)});
      let next = 0;
      await Promise.all(
        Array.from({length: NW}, () =>
          new Promise<void>((resolve, reject) => {
            const w = new Worker(__filename, {workerData: {name: job.name}});
            const feed = () => {
              if (next >= tasks.length) {
                w.postMessage(null);
                return;
              }
              w.postMessage(tasks[next++]);
            };
            w.on('message', (msg: any) => {
              if (msg && msg.rows) {
                N.set(msg.n, msg.rows.y0 * W * 4);
                M.set(msg.m, msg.rows.y0 * W * 4);
              }
              feed();
            });
            w.on('error', reject);
            w.on('exit', () => resolve());
            feed();
          }),
        ),
      );
      writePNG(path.join(outDir, `${job.name}_n.png`), W, H, N);
      writePNG(path.join(outDir, `${job.name}_m.png`), W, H, M);
      console.log(`${job.name}: ${W}x${H} in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
    }
  })();
} else {
  const job = JOBS.find((j) => j.name === workerData.name)!;
  parentPort.on('message', (rows: Rows | null) => {
    if (!rows) {
      process.exit(0);
      return;
    }
    const r = renderRows(job, rows);
    parentPort.postMessage({rows, n: r.n, m: r.m});
  });
}

export type {View};
