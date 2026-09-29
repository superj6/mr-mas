// @ts-nocheck -- Node-only tool (bundled with esbuild), excluded from the browser typecheck.
// THE EDITOR's animatic v4 renderer: the SAME frame4.ts the Remotion composition 'ep01-act4-animatic-v4' uses, rendered
// in Node (no browser) and piped to the bundled ffmpeg. Pixel-identical to a Remotion render of the composition.
// (tools/render.ts stays the v3 renderer.) Audio: $MIX if set, else out/ep01/act4/animatic/act4-mix-v4.wav when the
// sound pass has written it, else no audio (a silent picture). The picture pass muxed a DIALOGUE GUIDE (the takes at
// their lock frames, no score, no beds: a sync check only, NOT the mix) by passing MIX=<guide.wav>.
//   npx esbuild src/episodes/ep01/act4/animatic/tools/render4.ts --bundle --platform=node --outfile=<scratch>/anim4.cjs
//   node <scratch>/anim4.cjs hd      <out.mp4> [jobs] [from] [to]   the act at 1920x1080 (the deliverable): the show frame at 3x
//                                                                    (nearest, 1440x810) + the 1280x720 margin and transcript
//                                                                    scaled 2->3 (1.5x, blended), + audio. Node only: the
//                                                                    Remotion compositions stay 1280x720. Used for
//                                                                    out/ep01/act4/animatic/act4-animatic-v4.mp4 (MIX = the v4 mix)
//   node <scratch>/anim4.cjs video   <out.mp4> [jobs] [from] [to]   the act at 1280x720 (margin notes, transcript) + audio
//   node <scratch>/anim4.cjs picture <out.mp4> [jobs] [from] [to]   the PICTURE ONLY at 960x540 (the newcomer test) + audio
//   node <scratch>/anim4.cjs cuts <dir>                              stills of the picture at every cut (first + 6th frame of each shot)
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
import {frame4 as frame, native4 as native, picture4, OUT_W, OUT_H, ACT_FRAMES} from '../frame4';
import {otext} from '../frame';
import {SHOTS} from '../data-v4';
import {DRAW4 as DRAW} from '../shots4';
import {Buf} from '../../../../../shared/pixel/px';

const REPO = process.env.MRMAS_ROOT ?? repo();
function repo(): string {   // the project root: the nearest .mrmas-root above the cwd (phase 1; this tool can run bundled from scratch)
  for (let d = process.cwd(); ; d = path.dirname(d)) {
    if (fs.existsSync(path.join(d, '.mrmas-root'))) return d;
    if (d === path.dirname(d)) throw new Error('MR. MAS: no .mrmas-root above the cwd; set MRMAS_ROOT');
  }
}
const FFDIR = `${REPO}/studio/node_modules/@remotion/compositor-linux-x64-gnu`;
const FF = `${FFDIR}/ffmpeg`;
const ENV = {...process.env, LD_LIBRARY_PATH: FFDIR};
const MIX4 = `${REPO}/out/ep01/act4/animatic/act4-mix-v4.wav`;
const PREMIX = process.env.MIX ?? (fs.existsSync(MIX4) ? MIX4 : '');

const [mode, ...args] = process.argv.slice(2);

import * as zlib from 'zlib';
// the bundled ffmpeg has no rawvideo demuxer: frames go through image2pipe as fast PNGs (filter 0, deflate level 1)
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = (buf, start, end) => { let c = 0xffffffff; for (let i = start; i < end; i++) c = CRC[(c ^ buf[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (type, data) => { const out = Buffer.alloc(12 + data.length); out.writeUInt32BE(data.length, 0); out.write(type, 4, 'ascii'); data.copy(out, 8); out.writeUInt32BE(crc32(out, 4, 8 + data.length), 8 + data.length); return out; };
const SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const PIC = process.argv[2] === 'picture' || process.env.PIC === '1';
const HD = process.argv[2] === 'hd' || process.env.HD === '1';
const FW = PIC ? 960 : HD ? 1920 : OUT_W, FH = PIC ? 540 : HD ? 1080 : OUT_H;
// HD (1920 x 1080): the picture stays exact (each show pixel -> 3 x 3); the notes and transcript (drawn at 1280 x 720)
// go 2 -> 3 per axis: source pixels land on 2 of every 3 target pixels, the middle one is their blend (even strokes).
const SRC720 = HD ? new Buf(OUT_W, OUT_H, 0) : null;
const tab23 = (n) => { const a = new Int32Array(n), b = new Int32Array(n); for (let t = 0; t < n; t++) { const k = Math.floor(t / 3), r = t % 3; a[t] = 2 * k + (r === 2 ? 1 : 0); b[t] = 2 * k + (r === 0 ? 0 : 1); } return [a, b]; };
const [HX0, HX1] = tab23(1920), [HY0, HY1] = tab23(1080);
const avg2 = (p, q) => ((p & 0xfefefe) >>> 1) + ((q & 0xfefefe) >>> 1);
const hdCompose = (src, dst) => {
  const S = src.c, D = dst.c;
  for (let ty = 0; ty < 1080; ty++) {
    const r0 = HY0[ty] * OUT_W, r1 = HY1[ty] * OUT_W, o = ty * 1920;
    let tx = 0;
    if (ty < 810) { const pr = 2 * Math.floor(ty / 3) * OUT_W; for (; tx < 1440; tx++) D[o + tx] = S[pr + 2 * Math.floor(tx / 3)]; }
    for (; tx < 1920; tx++) {
      const x0 = HX0[tx], x1 = HX1[tx];
      const top = x0 === x1 ? S[r0 + x0] : avg2(S[r0 + x0], S[r0 + x1]);
      D[o + tx] = r0 === r1 ? top : avg2(top, x0 === x1 ? S[r1 + x0] : avg2(S[r1 + x0], S[r1 + x1]));
    }
  }
};
const IHDR = (() => { const h = Buffer.alloc(13); h.writeUInt32BE(FW, 0); h.writeUInt32BE(FH, 4); h[8] = 8; h[9] = 2; h[10] = 0; h[11] = 0; h[12] = 0; return chunk('IHDR', h); })();
const IEND = chunk('IEND', Buffer.alloc(0));
const RAW = Buffer.alloc((FW * 3 + 1) * FH);
const fastPNG = (b) => {
  for (let y = 0; y < FH; y++) {
    let o = y * (FW * 3 + 1); RAW[o++] = 0;
    for (let x = 0; x < FW; x++) { const v = b.c[y * FW + x]; RAW[o++] = (v >> 16) & 255; RAW[o++] = (v >> 8) & 255; RAW[o++] = v & 255; }
  }
  return Buffer.concat([SIG, IHDR, chunk('IDAT', zlib.deflateSync(RAW, {level: 1})), IEND]);
};

const encodeRange = (outFile, from, to) => new Promise((resolve, reject) => {
  const ff = spawn(FF, ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'png', '-framerate', '24', '-i', 'pipe:0',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-tune', 'animation', '-pix_fmt', 'yuv420p', '-g', '48', '-threads', process.env.X264_THREADS ?? '2', outFile], {env: ENV, stdio: ['pipe', 'inherit', 'inherit']});
  ff.on('error', reject);
  ff.on('close', (c) => (c === 0 ? resolve(0) : reject(new Error('ffmpeg ' + c))));
  const buf = new Buf(FW, FH, 0);
  let f = from;
  const t0 = Date.now();
  const pump = () => {
    while (f < to) {
      if (PIC) picture4(f, buf); else if (HD) { frame(f, SRC720); hdCompose(SRC720, buf); } else frame(f, buf);
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
  if (mode === 'video' || mode === 'picture' || mode === 'hd') {
    const out = args[0];
    const jobs = Number(args[1] ?? 6), from = Number(args[2] ?? 0), to = Number(args[3] ?? ACT_FRAMES);
    const tmp = fs.mkdtempSync(path.join(process.env.SEGDIR ?? path.dirname(out), '.seg-'));
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
      const p = fork(process.argv[1], ['segment', seg, String(a), String(b)], {env: {...ENV, PIC: PIC ? '1' : '0', HD: HD ? '1' : '0'}});
      p.on('exit', (c) => (c === 0 ? resolve(0) : reject(new Error('segment ' + j + ' ' + c))));
    })));
    const list = path.join(tmp, 'list.txt');
    fs.writeFileSync(list, segs.filter(Boolean).map((s) => `file '${s}'`).join('\n') + '\n');
    const silent = path.join(tmp, 'silent.mp4');
    await run(FF, ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', silent]);
    const ss = (from / 24).toFixed(4), dur = ((to - from) / 24).toFixed(4);
    if (PREMIX && fs.existsSync(PREMIX)) await run(FF, ['-y', '-hide_banner', '-loglevel', 'error', '-i', silent, '-ss', ss, '-t', dur, '-i', PREMIX, '-map', '0:v:0', '-map', '1:a:0',
      '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ac', '2', '-ar', '48000', '-movflags', '+faststart', out]);
    else await run(FF, ['-y', '-hide_banner', '-loglevel', 'error', '-i', silent, '-c:v', 'copy', '-movflags', '+faststart', out]);
    fs.rmSync(tmp, {recursive: true, force: true});
    console.log('wrote', out, `${to - from} frames`, `${((Date.now() - t0) / 1000).toFixed(0)} s`, 'audio:', PREMIX);
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
  if (mode === 'cuts') { // the picture at every cut: each shot's first frame and its 6th (the cut's landing)
    const dir = args[0];
    fs.mkdirSync(dir, {recursive: true});
    SHOTS.forEach((sh, i) => {
      for (const [tag, f] of [['a', sh.s], ['b', Math.min(sh.e - 1, sh.s + 6)]] as Array<[string, number]>) {
        const {fb} = native(f);
        writePNG(`${dir}/${String(i + 1).padStart(2, '0')}${tag}-${sh.id}-f${f}.png`, fb.w, fb.h, fb.c, 1);
      }
    });
    console.log('wrote', SHOTS.length * 2, 'stills to', dir);
    return;
  }
  if (mode === 'cutpairs') { // review sheets: at every cut, the outgoing shot's last frame | the incoming shot's 3rd frame
    const dir = args[0], per = Number(args[1] ?? 28);
    fs.mkdirSync(dir, {recursive: true});
    const pairs = SHOTS.slice(1).map((sh, i) => ({a: SHOTS[i], b: sh}));
    const CW = 240, CH = 135, LH = 14, COLS = 4, W = COLS * (CW * 2 + 12);
    for (let p0 = 0, n = 0; p0 < pairs.length; p0 += per, n++) {
      const chunk = pairs.slice(p0, p0 + per), rows = Math.ceil(chunk.length / COLS);
      const sheet = new Buf(W, rows * (CH + LH + 6), 0x07080d);
      chunk.forEach(({a, b}, i) => {
        const x0 = (i % COLS) * (CW * 2 + 12), y0 = Math.floor(i / COLS) * (CH + LH + 6);
        [[a, a.e - 1], [b, Math.min(b.e - 1, b.s + 2)]].forEach(([sh, f], j) => {
          const {fb} = native(f as number);
          for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
            let r = 0, g = 0, bb = 0;
            for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const v = fb.c[(y * 2 + dy) * 480 + x * 2 + dx]; r += (v >> 16) & 255; g += (v >> 8) & 255; bb += v & 255; }
            sheet.c[(y0 + y) * W + x0 + j * CW + x] = ((r >> 2) << 16) | ((g >> 2) << 8) | (bb >> 2);
          }
        });
        otext(sheet, `${a.id} | ${b.id}  (${((a.e - a.s) / 24).toFixed(2)}s | ${((b.e - b.s) / 24).toFixed(2)}s)`, x0 + 2, y0 + CH + 3, 1, 0xf2efe6);
      });
      writePNG(`${dir}/cutpairs-${n + 1}.png`, W, sheet.h, sheet.c, 1);
    }
    console.log('wrote cut pairs to', dir);
    return;
  }
  if (mode === 'contact') { // one still per shot (its middle frame): `native` = 480 x 270 tiles at 1x (exact pixels), else 240 x 135
    const out = args[0], nat = args[1] === 'native';
    const COLS = nat ? 6 : 8, CW = nat ? 480 : 240, CH = nat ? 270 : 135, LH = 26, W = COLS * CW, rows = Math.ceil(SHOTS.length / COLS);
    const H = 64 + rows * (CH + LH);
    const sheet = new Buf(W, H, 0x07080d);
    otext(sheet, `MR. MAS · EP1 ACT FOUR · ANIMATIC v4.1 (TIMING LOCK v4.1) · ONE STILL PER SHOT (ITS MIDDLE FRAME)${nat ? ' · 480 x 270 AT 1X' : ''}`, 12, 14, 2, 0xf2efe6);
    otext(sheet, `${SHOTS.length} SHOTS · ${ACT_FRAMES} F · 12:31:00 → ${(() => { const e = 12 * 1440 + 31 * 24 + ACT_FRAMES; return `${Math.floor(e / 1440)}:${String(Math.floor(e / 24) % 60).padStart(2, '0')}:${String(e % 24).padStart(2, '0')}`; })()} · HIS SIDE = CYAN RULE, THE BOARD'S SIDE = AMBER RULE · PINK = CONTAINS A STAND-IN (DRAWN, NOT A LABEL)`, 12, 38, 1, 0x8a93a8);
    SHOTS.forEach((sh, i) => {
      const f = Math.floor((sh.s + sh.e) / 2);
      const {fb, standin} = native(f);
      const x0 = (i % COLS) * CW, y0 = 64 + Math.floor(i / COLS) * (CH + LH);
      if (nat) for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) sheet.c[(y0 + y) * W + x0 + x] = fb.c[y * 480 + x];
      else for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
        let r = 0, g = 0, b = 0;
        for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const v = fb.c[(y * 2 + dy) * 480 + x * 2 + dx]; r += (v >> 16) & 255; g += (v >> 8) & 255; b += v & 255; }
        sheet.c[(y0 + y) * W + x0 + x] = ((r >> 2) << 16) | ((g >> 2) << 8) | (b >> 2);
      }
      const col = sh.side === 'MAS' ? 0x3aa6c8 : 0xd08a3a;
      for (let x = 0; x < CW - 4; x++) sheet.c[(y0 + CH) * W + x0 + x] = col;
      const tc = (() => { const e = 12 * 1440 + 31 * 24 + sh.s; return `${Math.floor(e / 1440)}:${String(Math.floor(e / 24) % 60).padStart(2, '0')}`; })();
      otext(sheet, `${sh.id} ${sh.cls} ${sh.tag}`.slice(0, 40), x0 + 2, y0 + CH + 5, 1, 0xf2efe6);
      otext(sheet, `${tc} · ${((sh.e - sh.s) / 24).toFixed(2)}s`, x0 + CW - 72, y0 + CH + 5, 1, 0x8a93a8);
      otext(sheet, (standin ? 'has a stand-in · ' : 'built assets · ') + sh.framing, x0 + 2, y0 + CH + 15, 1, standin ? 0xe7a0c4 : 0x5f9f78);
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
  if (mode === 'ledger') { // what each shot's layout is built from (read for timing-v4.md)
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
  console.log('modes: hd | video | picture | stills | native | cuts | cutpairs | contact | grid | ledger | check');
})().catch((e) => { console.error(e); process.exit(1); });
