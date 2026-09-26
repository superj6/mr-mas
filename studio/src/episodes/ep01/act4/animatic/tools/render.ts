// @ts-nocheck -- Node-only tool (bundled with esbuild), excluded from the browser typecheck.
// THE EDITOR's animatic v3 renderer: the SAME frame.ts the Remotion composition 'ep01-act4-animatic' uses, rendered
// in Node (no browser) and piped to the bundled ffmpeg. Pixel-identical to a Remotion render of the composition.
// The audio muxed in is the v3 mix (tools/mix_v3.py: dialogue premix + temp score + SFX, music ducked under dialogue).
//   npx esbuild src/episodes/ep01/act4/animatic/tools/render.ts --bundle --platform=node --outfile=<scratch>/anim.cjs
//   node <scratch>/anim.cjs video  <out.mp4> [jobs] [from] [to]     the act at 1280x720 + the v3 mix muxed
//   node <scratch>/anim.cjs stills <dir> <f> [<f> ...]               1280x720 PNG stills of act frames
//   node <scratch>/anim.cjs native <dir> <f> [<f> ...]               480x270 show frames at 2x (the picture only)
//   node <scratch>/anim.cjs contact <out.png>                        one still per shot (its middle frame)
//   node <scratch>/anim.cjs ledger <out.json>                         the layout ledger (what each shot is built from)
//   node <scratch>/anim.cjs grid <out.png> <f> [<f> ...]              review: native frames 2 x 2 at 1x
//   node <scratch>/anim.cjs check                                    every shot has a layout; timing asserts
import {spawn, fork} from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import {writePNG} from '../../../../../dev/pixeladv/tools/png';
import {frame, native, OUT_W, OUT_H, ACT_FRAMES, otext} from '../frame';
import {SHOTS} from '../data-v3';
import {DRAW3 as DRAW} from '../shots3';
import {Buf} from '../../../../../shared/pixel/px';

const REPO = '/home/jgon/project/art/mrmas';
const FFDIR = `${REPO}/studio/node_modules/@remotion/compositor-linux-x64-gnu`;
const FF = `${FFDIR}/ffmpeg`;
const ENV = {...process.env, LD_LIBRARY_PATH: FFDIR};
const PREMIX = process.env.MIX ?? `${REPO}/out/ep01/act4/animatic/act4-mix-v3.wav`;

const [mode, ...args] = process.argv.slice(2);

import * as zlib from 'zlib';
// the bundled ffmpeg has no rawvideo demuxer: frames go through image2pipe as fast PNGs (filter 0, deflate level 1)
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = (buf, start, end) => { let c = 0xffffffff; for (let i = start; i < end; i++) c = CRC[(c ^ buf[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (type, data) => { const out = Buffer.alloc(12 + data.length); out.writeUInt32BE(data.length, 0); out.write(type, 4, 'ascii'); data.copy(out, 8); out.writeUInt32BE(crc32(out, 4, 8 + data.length), 8 + data.length); return out; };
const SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const IHDR = (() => { const h = Buffer.alloc(13); h.writeUInt32BE(OUT_W, 0); h.writeUInt32BE(OUT_H, 4); h[8] = 8; h[9] = 2; h[10] = 0; h[11] = 0; h[12] = 0; return chunk('IHDR', h); })();
const IEND = chunk('IEND', Buffer.alloc(0));
const RAW = Buffer.alloc((OUT_W * 3 + 1) * OUT_H);
const fastPNG = (b) => {
  for (let y = 0; y < OUT_H; y++) {
    let o = y * (OUT_W * 3 + 1); RAW[o++] = 0;
    for (let x = 0; x < OUT_W; x++) { const v = b.c[y * OUT_W + x]; RAW[o++] = (v >> 16) & 255; RAW[o++] = (v >> 8) & 255; RAW[o++] = v & 255; }
  }
  return Buffer.concat([SIG, IHDR, chunk('IDAT', zlib.deflateSync(RAW, {level: 1})), IEND]);
};

const encodeRange = (outFile, from, to) => new Promise((resolve, reject) => {
  const ff = spawn(FF, ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'png', '-framerate', '24', '-i', 'pipe:0',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-tune', 'animation', '-pix_fmt', 'yuv420p', '-g', '48', outFile], {env: ENV, stdio: ['pipe', 'inherit', 'inherit']});
  ff.on('error', reject);
  ff.on('close', (c) => (c === 0 ? resolve(0) : reject(new Error('ffmpeg ' + c))));
  const buf = new Buf(OUT_W, OUT_H, 0);
  let f = from;
  const t0 = Date.now();
  const pump = () => {
    while (f < to) {
      frame(f, buf);
      const png = fastPNG(buf);
      f++;
      if ((f - from) % 240 === 0) process.stderr.write(`[${from}-${to}] ${f - from}/${to - from} ${((Date.now() - t0) / (f - from)).toFixed(0)} ms/f\n`);
      if (!ff.stdin.write(png)) { ff.stdin.once('drain', pump); return; }
    }
    ff.stdin.end();
  };
  pump();
});

const run = (cmd, a) => new Promise((resolve, reject) => { const p = spawn(cmd, a, {env: ENV, stdio: 'inherit'}); p.on('close', (c) => (c === 0 ? resolve(0) : reject(new Error(cmd + ' ' + c)))); });

(async () => {
  if (mode === 'segment') { // worker: render [from, to) to a segment file
    const [out, from, to] = args;
    await encodeRange(out, Number(from), Number(to));
    process.exit(0);
  }
  if (mode === 'video') {
    const out = args[0];
    const jobs = Number(args[1] ?? 6), from = Number(args[2] ?? 0), to = Number(args[3] ?? ACT_FRAMES);
    const tmp = fs.mkdtempSync(path.join(path.dirname(out), '.seg-'));
    // split on shot starts (a segment starts on a cut, so each worker's held-room cache warms once per shot)
    const n = to - from, per = Math.ceil(n / jobs);
    const cuts = [from];
    for (let j = 1; j < jobs; j++) { const want = from + j * per; const s = SHOTS.find((x) => x.s >= want); cuts.push(Math.min(to, s ? s.s : to)); }
    cuts.push(to);
    const segs = [];
    const t0 = Date.now();
    await Promise.all(cuts.slice(0, -1).map((a, j) => new Promise((resolve, reject) => {
      const b = cuts[j + 1];
      if (b <= a) return resolve(0);
      const seg = path.join(tmp, `seg${String(j).padStart(2, '0')}.mp4`);
      segs[j] = seg;
      const p = fork(process.argv[1], ['segment', seg, String(a), String(b)], {env: ENV});
      p.on('exit', (c) => (c === 0 ? resolve(0) : reject(new Error('segment ' + j + ' ' + c))));
    })));
    const list = path.join(tmp, 'list.txt');
    fs.writeFileSync(list, segs.filter(Boolean).map((s) => `file '${s}'`).join('\n') + '\n');
    const silent = path.join(tmp, 'silent.mp4');
    await run(FF, ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', silent]);
    const ss = (from / 24).toFixed(4), dur = ((to - from) / 24).toFixed(4);
    await run(FF, ['-y', '-hide_banner', '-loglevel', 'error', '-i', silent, '-ss', ss, '-t', dur, '-i', PREMIX, '-map', '0:v:0', '-map', '1:a:0',
      '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ac', '2', '-ar', '48000', '-movflags', '+faststart', out]);
    fs.rmSync(tmp, {recursive: true, force: true});
    console.log('wrote', out, `${to - from} frames`, `${((Date.now() - t0) / 1000).toFixed(0)} s`);
    return;
  }
  if (mode === 'stills' || mode === 'native') {
    const dir = args[0];
    fs.mkdirSync(dir, {recursive: true});
    for (const s of args.slice(1)) {
      const f = Number(s);
      if (mode === 'stills') { const b = frame(f); writePNG(`${dir}/f${String(f).padStart(5, '0')}.png`, b.w, b.h, b.c, 1); }
      else { const {fb, sh} = native(f); writePNG(`${dir}/n${String(f).padStart(5, '0')}-${sh.id}.png`, fb.w, fb.h, fb.c, 2); }
      console.log('wrote', f);
    }
    return;
  }
  if (mode === 'contact') {
    const out = args[0];
    const COLS = 10, CW = 240, CH = 135, LH = 26, W = COLS * CW, rows = Math.ceil(SHOTS.length / COLS);
    const H = 64 + rows * (CH + LH);
    const sheet = new Buf(W, H, 0x07080d);
    otext(sheet, 'MR. MAS · EP1 ACT FOUR · ANIMATIC v3 (TIMING LOCK v3) · ONE STILL PER SHOT (ITS MIDDLE FRAME)', 12, 14, 2, 0xf2efe6);
    otext(sheet, `${SHOTS.length} SHOTS · ${ACT_FRAMES} F · 12:31:00 → EPISODE OUT · HIS SIDE = CYAN RULE, THE BOARD'S SIDE = AMBER RULE · SIZE CLASS AFTER THE ID · PINK = CONTAINS A STAND-IN / BOX`, 12, 38, 1, 0x8a93a8);
    SHOTS.forEach((sh, i) => {
      const f = Math.floor((sh.s + sh.e) / 2);
      const {fb} = native(f);
      const x0 = (i % COLS) * CW, y0 = 64 + Math.floor(i / COLS) * (CH + LH);
      // 2:1 box average (a contact sheet, not show art)
      for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
        let r = 0, g = 0, b = 0;
        for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const v = fb.c[(y * 2 + dy) * 480 + x * 2 + dx]; r += (v >> 16) & 255; g += (v >> 8) & 255; b += v & 255; }
        sheet.c[(y0 + y) * W + x0 + x] = ((r >> 2) << 16) | ((g >> 2) << 8) | (b >> 2);
      }
      const col = sh.side === 'MAS' ? 0x3aa6c8 : 0xd08a3a;
      for (let x = 0; x < CW - 4; x++) sheet.c[(y0 + CH) * W + x0 + x] = col;
      const tc = (() => { const e = 12 * 1440 + 31 * 24 + sh.s; return `${Math.floor(e / 1440)}:${String(Math.floor(e / 24) % 60).padStart(2, '0')}`; })();
      otext(sheet, `${sh.id} ${sh.cls} ${sh.tag}`.slice(0, 30), x0 + 2, y0 + CH + 5, 1, 0xf2efe6);
      otext(sheet, `${tc} · ${sh.e - sh.s}f`, x0 + 170, y0 + CH + 5, 1, 0x8a93a8);
      const stand = native(f).standin;
      otext(sheet, (stand ? 'stand-in / box · ' : 'built assets · ') + sh.framing, x0 + 2, y0 + CH + 15, 1, stand ? 0xe7a0c4 : 0x5f9f78);
    });
    writePNG(out, W, H, sheet.c, 1);
    console.log('wrote', out, W, H);
    return;
  }
  if (mode === 'grid') { // review: native frames 2 x 2 at 1x (960 x 540), a label each
    const out = args[0], fr = args.slice(1).map(Number);
    const W = 960, H = Math.ceil(fr.length / 2) * 270;
    const g = new Buf(W, H, 0);
    fr.forEach((f, i) => { const {fb, sh, k} = native(f); const x0 = (i % 2) * 480, y0 = Math.floor(i / 2) * 270; for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) g.c[(y0 + y) * W + x0 + x] = fb.c[y * 480 + x]; otext(g, `${sh.id} k${k}`, x0 + 2, y0 + 258, 1, 0xffff00, {shadow: 0}); });
    writePNG(out, W, H, g.c, 1);
    console.log('wrote', out);
    return;
  }
  if (mode === 'ledger') { // what each shot's layout is built from (read by report_v3.py for timing-v3.md)
    const rows = SHOTS.map((sh) => ({id: sh.id, tag: sh.tag, cls: sh.cls, framing: sh.framing, st: DRAW[sh.id]?.st ?? 'NO LAYOUT', standin: DRAW[sh.id]?.standin ?? true}));
    fs.writeFileSync(args[0], JSON.stringify(rows, null, 1));
    console.log('wrote', args[0], rows.length, 'stand-ins', rows.filter((r) => r.standin).length);
    return;
  }
  if (mode === 'check') {
    const missing = SHOTS.filter((s) => !DRAW[s.id]).map((s) => s.id);
    console.log('shots', SHOTS.length, 'missing layouts', missing.length, missing.join(' '));
    let t = 0; for (const s of SHOTS) { if (s.s !== t) console.log('GAP at', s.id); t = s.e; }
    console.log('act frames', t, ACT_FRAMES);
    return;
  }
  console.log('modes: video | stills | native | contact | check');
})().catch((e) => { console.error(e); process.exit(1); });
