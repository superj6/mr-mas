// @ts-nocheck -- Node-only tool (bundled with esbuild), excluded from the browser typecheck.
// MR. MAS — Ep2 v1 art: render every asset's stills at 1080p (480 x 270 at 4x, nearest) and the contact sheet.
// Build (light) and run (through ops/heavy.sh), from studio/:
//   node src/episodes/ep02/pixel/tools/build.mjs --entry src/episodes/ep02/pixel/art/tools/stills.ts $S/stills.cjs
//   ../ops/heavy.sh node $S/stills.cjs [--only id,id] [--out DIR] [--no-sheet] [--native]
// Writes DIR/stills/<id>[-n].png (1920 x 1080) and DIR/sheet.png (every asset's first still at 1x, labelled).
// DIR defaults to out/ep02/v1/art (repo root, resolved from this file's location at build time: pass --out to override).
import * as fs from 'fs';
import * as path from 'path';
import {Buf, rect} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {writePNG} from '../../../../../shared/pixel/png';
import {pt, pw, tiny} from '../kit';
import {ALL_ART} from '../registry';
import {setIssPlates, setIssAnchors} from '../sets/iss';
import {readPNG, downsample} from './png-read';

const args = process.argv.slice(2);
const opt = (k: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const OUT = path.resolve(opt('--out') ?? path.join(process.cwd(), '..', 'out', 'ep02', 'v1', 'art'));
const only = opt('--only')?.split(',');
const noSheet = args.includes('--no-sheet');
const native = args.includes('--native');
fs.mkdirSync(path.join(OUT, 'stills'), {recursive: true});
// SET-23's 3D plates (art/iss/iss_scene.py), box-averaged to the preview's 480 x 203 (--plates DIR; default OUT/iss/plates)
const PLATES = path.resolve(opt('--plates') ?? path.join(OUT, 'iss', 'plates'));
if (fs.existsSync(path.join(PLATES, 'anchors.json'))) setIssAnchors(JSON.parse(fs.readFileSync(path.join(PLATES, 'anchors.json'), 'utf8')));
const plateCache = new Map<string, Uint32Array | null>();
setIssPlates((shot) => {
  if (!plateCache.has(shot)) { const img = readPNG(path.join(PLATES, `${shot}.png`)); plateCache.set(shot, img ? downsample(img, 480, 203) : null); }
  return plateCache.get(shot)!;
});

/** the band's text in the pixel font's own glyphs (no section mark, no accents, no emoji) */
const plainText = (s: string) => s.replace(/§/g, '').replace(/é/g, 'e').replace(/😊/g, ':)').replace(/ {2,}/g, ' ');
const band = (b: Buf, a: {id: string; manifest: string; scenes: string}, label: string) => {
  rect(0, 203, 480, 67, b.ink(PAL.N0));
  pt(b, plainText(`${a.manifest} · ${a.id}`), 6, 210, PAL.C6);
  pt(b, plainText(label).slice(0, 78), 6, 224, PAL.P1);
  pt(b, `sc ${a.scenes}`.slice(0, 78), 6, 238, PAL.N7);
};

const t0 = Date.now();
const firsts: Array<{a: any; b: Buf}> = [];
let n = 0, errs = 0;
for (const a of ALL_ART) {
  if (only && !only.includes(a.id)) continue;
  a.stills.forEach((s, i) => {
    const b = new Buf(480, 270, PAL.N0);
    try { s.draw(b); } catch (e) { errs++; console.error(`[${a.id}#${i}] ${(e as Error).stack}`); rect(0, 0, 480, 203, b.ink(PAL.R1)); }
    band(b, a, s.label);
    const name = a.stills.length > 1 ? `${a.id}-${i + 1}` : a.id;
    writePNG(path.join(OUT, 'stills', `${name}.png`), 480, 270, b.c, native ? 2 : 4);
    if (i === 0) firsts.push({a, b});
    n++;
  });
}
console.log(`stills: ${n} written to ${path.join(OUT, 'stills')} (${errs} errors, ${Date.now() - t0} ms)`);

if (!noSheet && !only) {
  const COLS = 5, TW = 480, TH = 270, GAP = 8, HEAD = 40;
  const rows = Math.ceil(firsts.length / COLS);
  const W = COLS * TW + (COLS + 1) * GAP, H = HEAD + rows * (TH + GAP) + GAP;
  const sheet = new Buf(W, H, PAL.N1);
  pt(sheet, `MR. MAS · EP2 v1 · THE ART: EVERY NEW SET, ROOM, PROP AND CHARACTER · ${firsts.length} ASSETS · ONE STILL EACH AT 1X (THE STILLS FOLDER HAS 1080P)`, GAP, 12, PAL.P2);
  pt(sheet, 'show/episodes/ep02/production/v1/art.md lists each asset with its file and scenes', GAP, 24, PAL.N7);
  firsts.forEach(({b}, k) => {
    const cx = GAP + (k % COLS) * (TW + GAP), cy = HEAD + Math.floor(k / COLS) * (TH + GAP);
    for (let y = 0; y < TH; y++) for (let x = 0; x < TW; x++) sheet.set(cx + x, cy + y, b.c[y * 480 + x]);
  });
  writePNG(path.join(OUT, 'sheet.png'), W, H, sheet.c, 1);
  console.log(`sheet: ${path.join(OUT, 'sheet.png')} (${W} x ${H}, ${firsts.length} tiles)`);
}
if (errs) process.exit(1);
