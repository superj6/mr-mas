// @ts-nocheck -- Node-only tool (bundled with esbuild), excluded from the browser typecheck.
// MR. MAS — Ep1 full-v3, the v3-art-a pass (cold open + Act One): the stills sheet of every asset state in demos.ts,
// rendered in Node (no browser). The Act Four v5 sheet tool's pattern (act4/art-v5/tools/sheet.ts), with this pass's
// registry. Every demo paints one 480 x 270 native frame: the picture in rows 0-202 (the show's room area), a black
// band with the demo's label below (sheet chrome, never picture). Outputs (run from studio/):
//   npx esbuild src/episodes/ep01/pixel/art-a/tools/sheet.ts --bundle --platform=node --outfile=<scratch>/sheet-a.cjs
//   node <scratch>/sheet-a.cjs all   ../out/ep01/full-v3/assets/art-a     native/<key>.png (480x270) + full/<key>.png
//                                                                         (1920x1080, 4x nearest) + sheet-native.png
//                                                                         (every demo at 1x, 4 across) + index.json
//   node <scratch>/sheet-a.cjs one   <out.png> <key> [scale]              one demo (key = ID or ID@state)
//   node <scratch>/sheet-a.cjs crop  <out.png> <key> x y w h [scale]      a crop of one demo, for checking detail
//   node <scratch>/sheet-a.cjs group <out.png> <ID-prefix> [scale]        every demo whose key starts with the prefix,
//                                                                         2 across (a quick look at one asset family)
//   node <scratch>/sheet-a.cjs list                                       the demo keys
//   node <scratch>/sheet-a.cjs strays                                     any colour outside the master palette (and the
//                                                                         1-bit and LEDGER sets' own colours), per demo
import * as fs from 'fs';
import * as zlib from 'zlib';
import {Buf, rect} from '../../../../../shared/pixel/px';
import {PAL, PAL_INDEX} from '../../../../../shared/pixel/palette';
import {text} from '../../../../../shared/pixel/font';
import {DEMOS} from '../demos';
// 1993 (F1.1) is drawn in the engine's ONEBIT set, whose ink and paper sit outside the master palette by design, and
// the lobby TV's money flash-print (sc 9) in its LEDGER set (the engine's sanctioned money look, 6 frames at most)
const ONEBIT_OK = new Set<number>([0x0e0e10, 0xe9e6da, 0x16251d, 0x4f6f55, 0xe3dcc0]);

const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = (buf, s, e) => { let c = 0xffffffff; for (let i = s; i < e; i++) c = CRC[(c ^ buf[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (type, data) => { const out = Buffer.alloc(12 + data.length); out.writeUInt32BE(data.length, 0); out.write(type, 4, 'ascii'); data.copy(out, 8); out.writeUInt32BE(crc32(out, 4, 8 + data.length), 8 + data.length); return out; };
const writePNG = (path, b, scale = 1) => {
  const W = b.w * scale, H = b.h * scale;
  const raw = Buffer.alloc((W * 3 + 1) * H);
  for (let y = 0; y < H; y++) {
    let o = y * (W * 3 + 1); raw[o++] = 0;
    const row = Math.floor(y / scale) * b.w;
    for (let x = 0; x < W; x++) { const v = b.c[row + Math.floor(x / scale)]; raw[o++] = (v >> 16) & 255; raw[o++] = (v >> 8) & 255; raw[o++] = v & 255; }
  }
  const h = Buffer.alloc(13); h.writeUInt32BE(W, 0); h.writeUInt32BE(H, 4); h[8] = 8; h[9] = 2;
  fs.writeFileSync(path, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', h), chunk('IDAT', zlib.deflateSync(raw, {level: 9})), chunk('IEND', Buffer.alloc(0))]));
};
const keyOf = (d) => (d.state ? `${d.id}@${d.state}` : d.id);
const fileOf = (d) => keyOf(d).replace(/[@]/g, '--').replace(/[^A-Za-z0-9._-]/g, '_');
/** one demo as a 480 x 270 frame: the picture, then the label band */
const frameOf = (d) => {
  const fb = new Buf(480, 270, PAL.N0);
  d.draw(fb);
  rect(0, 203, 480, 67, fb.ink(PAL.N0));
  rect(0, 203, 480, 1, fb.ink(PAL.N3));
  text(fb, keyOf(d).slice(0, 78), 8, 210, PAL.P1);
  text(fb, d.module.slice(0, 78), 8, 222, PAL.N6);
  if (d.note) text(fb, d.note.slice(0, 78), 8, 234, PAL.N6);
  if (d.note && d.note.length > 78) text(fb, d.note.slice(78, 156), 8, 245, PAL.N6);
  if (d.standin) text(fb, `STAND-IN: ${d.standin}`.slice(0, 78), 8, 257, PAL.U4);
  return fb;
};
const find = (key) => { const d = DEMOS.find((x) => keyOf(x) === key) ?? DEMOS.find((x) => x.id === key); if (!d) throw new Error('no demo ' + key); return d; };
const tile = (frames, cols, title) => {
  const G = 8, HEAD = 28;
  const rows = Math.ceil(frames.length / cols);
  const S = new Buf(cols * 480 + (cols + 1) * G, HEAD + rows * (270 + G) + G, 0x07080d);
  text(S, title, G, 10, PAL.P1);
  frames.forEach((fb, i) => {
    const X = G + (i % cols) * (480 + G), Y = HEAD + Math.floor(i / cols) * (270 + G);
    for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) S.c[(Y + y) * S.w + X + x] = fb.c[y * 480 + x];
  });
  return S;
};

const [mode, ...a] = process.argv.slice(2);
if (mode === 'list') for (const d of DEMOS) console.log(keyOf(d));
else if (mode === 'one') { const d = find(a[1]); writePNG(a[0], frameOf(d), Number(a[2] ?? 2)); console.log('wrote', a[0]); }
else if (mode === 'crop') {
  const d = find(a[1]); const [x, y, w, h] = a.slice(2, 6).map(Number); const sc = Number(a[6] ?? 4);
  const fb = frameOf(d), out = new Buf(w, h, 0);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) out.c[j * w + i] = fb.get(x + i, y + j);
  writePNG(a[0], out, sc); console.log('wrote', a[0]);
} else if (mode === 'group') {
  const list = DEMOS.filter((d) => keyOf(d).startsWith(a[1]));
  if (!list.length) throw new Error('no demos under ' + a[1]);
  writePNG(a[0], tile(list.map(frameOf), 2, `${a[1]} · ${list.length} stills`), Number(a[2] ?? 1)); console.log('wrote', a[0], list.length);
} else if (mode === 'strays') {
  let bad = 0;
  for (const d of DEMOS) {
    const fb = frameOf(d); const s = new Set();
    for (const c of fb.c) if (!PAL_INDEX.has(c) && !ONEBIT_OK.has(c)) s.add(c.toString(16));
    if (s.size) bad++;
    console.log(keyOf(d), s.size ? 'STRAY ' + [...s].slice(0, 8).join(',') : 'ok');
  }
  console.log(bad ? `${bad} demo(s) with strays` : 'all ok');
} else if (mode === 'all') {
  const dir = a[0];
  fs.mkdirSync(`${dir}/native`, {recursive: true}); fs.mkdirSync(`${dir}/full`, {recursive: true});
  const only = a.slice(1);
  const list = only.length ? DEMOS.filter((d) => only.includes(d.id) || only.includes(keyOf(d))) : DEMOS;
  const frames = [];
  for (const d of list) {
    const t0 = Date.now();
    const fb = frameOf(d);
    writePNG(`${dir}/native/${fileOf(d)}.png`, fb, 1);
    writePNG(`${dir}/full/${fileOf(d)}.png`, fb, 4);
    frames.push([d, fb]);
    console.log('wrote', fileOf(d), `${Date.now() - t0} ms`);
  }
  if (!only.length) {
    writePNG(`${dir}/sheet-native.png`, tile(frames.map(([, fb]) => fb), 4, `MR. MAS · EP1 · FULL-V3 · ART-A (COLD OPEN + ACT ONE) · ${frames.length} STILLS AT 480 x 270 (1X) · THE BAND UNDER EACH IS SHEET CHROME, NOT PICTURE · FULL SIZE: full/*.png`), 1);
    fs.writeFileSync(`${dir}/index.json`, JSON.stringify(frames.map(([d]) => ({key: keyOf(d), id: d.id, state: d.state ?? '', module: d.module, note: d.note ?? '', standin: d.standin ?? '', native: `native/${fileOf(d)}.png`, full: `full/${fileOf(d)}.png`})), null, 1));
    console.log('wrote sheet-native.png +', frames.length, 'demos');
  }
} else console.log('modes: all <dir> | one <out> <key> [scale] | crop <out> <key> x y w h [scale] | group <out> <prefix> [scale] | list | strays');
