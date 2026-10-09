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
import {pt, pw, tiny, TEXT_FIT} from '../kit';
import {ALL_ART} from '../registry';
import {setIssPlates, setIssAnchors} from '../sets/iss';
import {setArosFrames} from '../sets/lobby2-art';
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
// the 2.A filler's frames (art/aros/aros_mammoth.py), box-averaged to the lobby screen's native rect for the previews
const AROS = path.resolve(opt('--aros') ?? path.join(OUT, 'aros', 'frames'));
const arosCache = new Map<string, Uint32Array | null>();
setArosFrames((frame, w, h) => {
  const k = `${frame}:${w}x${h}`;
  if (!arosCache.has(k)) { const img = readPNG(path.join(AROS, `aros_${String(frame).padStart(4, '0')}.png`)); arosCache.set(k, img ? downsample(img, w, h) : null); }
  return arosCache.get(k)!;
});
setIssPlates((shot) => {
  if (!plateCache.has(shot)) { const img = readPNG(path.join(PLATES, `${shot}.png`)); plateCache.set(shot, img ? downsample(img, 480, 203) : null); }
  return plateCache.get(shot)!;
});

/** the band's text in the pixel font's own glyphs (no section mark, no accents, no emoji) */
const plainText = (s: string) => s.replace(/§/g, '').replace(/é/g, 'e').replace(/😊/g, ':)').replace(/ {2,}/g, ' ');
/** a string wrapped to a width in the pixel font (never cut mid-word) */
const wrap = (s: string, w: number) => { const out: string[] = []; let cur = ''; for (const word of s.split(' ')) { const t = cur ? cur + ' ' + word : word; if (pw(t) > w && cur) { out.push(cur); cur = word; } else cur = t; } if (cur) out.push(cur); return out; };
/** the label band (67 rows at y0): the manifest line, the label wrapped (up to four lines), the scenes */
const band = (b: Buf, a: {id: string; manifest: string; scenes: string}, label: string, y0 = 203) => {
  rect(0, y0, 480, 67, b.ink(PAL.N0));
  // (a long manifest title wraps to a second line and the label moves down under it)
  const head = wrap(plainText(`${a.manifest} · ${a.id}`), 468);
  const hn = Math.min(2, head.length);
  head.slice(0, hn).forEach((l, i) => pt(b, l, 6, y0 + 4 + i * 10, PAL.C6));
  const lines = wrap(plainText(label), 468);
  const n = Math.min(5 - hn, lines.length), ly = y0 + 15 + (hn - 1) * 10;
  lines.slice(0, n).forEach((l, i) => pt(b, i === n - 1 && lines.length > n ? l + ' ...' : l, 6, ly + i * 10, PAL.P1));
  pt(b, `sc ${a.scenes}`, 6, ly + 2 + n * 10, PAL.N7);
};
/** the text-fit check (kit TEXT_FIT): strings that leave the frame, overflow their plate, or are drawn over */
const textFit = (b: Buf, roomH: number) => {
  const out: Array<{s: string; issue: string; at: [number, number]}> = [];
  for (const r of TEXT_FIT.recs) {
    if (r.b !== b) continue;
    if (r.x < 0 || r.y < 0 || r.x + r.w > b.w || r.y + r.h > roomH) out.push({s: r.s, issue: 'outside the frame', at: [r.x, r.y]});
    else if (r.plateShare > 0.55 && r.borderOff > 0.3) out.push({s: r.s, issue: `overflows its plate (${Math.round(r.borderOff * 100)}% of its rim off the plate)`, at: [r.x, r.y]});
    // drawn over: after the whole still, the glyph pixels should still be ONE colour (a grade or a palette remap
    // recolours the whole word alike, which is fine) and that colour should differ from the plate's around it
    if (r.px.length) {
      const h = new Map<number, number>(); for (const i of r.px) h.set(b.c[i], (h.get(b.c[i]) ?? 0) + 1);
      let dom = -1, dn = 0; for (const [c, n] of h) if (n > dn) { dn = n; dom = c; }
      const ring = new Map<number, number>();
      for (let i = r.x - 1; i <= r.x + r.w; i++) for (const j of [r.y - 1, r.y + r.h]) if (i >= 0 && j >= 0 && i < b.w && j < b.h) ring.set(b.c[j * b.w + i], (ring.get(b.c[j * b.w + i]) ?? 0) + 1);
      let rd = -2, rn = 0; for (const [c, n] of ring) if (n > rn) { rn = n; rd = c; }
      const share = dn / r.px.length;
      if (share < 0.8) out.push({s: r.s, issue: `drawn over (${Math.round((1 - share) * 100)}% of its glyph pixels changed)`, at: [r.x, r.y]});
      else if (dom === rd) out.push({s: r.s, issue: 'erased (its pixels now the plate\'s colour)', at: [r.x, r.y]});
    }
  }
  return out;
};

const t0 = Date.now();
const firsts: Array<{a: any; b: Buf}> = [];
const fits: Record<string, Array<{s: string; issue: string; at: [number, number]}>> = {};
let n = 0, errs = 0, nfit = 0;
// (an index of every still written: its file, asset and label, for the art notes' table)
const index: Array<{file: string; id: string; label: string}> = [];
for (const a of ALL_ART) {
  if (only && !only.includes(a.id)) continue;
  a.stills.forEach((s, i) => {
    const b = new Buf(480, 270, PAL.N0);
    TEXT_FIT.on = true; TEXT_FIT.recs = [];
    try { s.draw(b); } catch (e) { errs++; console.error(`[${a.id}#${i}] ${(e as Error).stack}`); rect(0, 0, 480, 203, b.ink(PAL.R1)); }
    TEXT_FIT.on = false;
    const name = a.stills.length > 1 ? `${a.id}-${i + 1}` : a.id;
    const fit = textFit(b, s.ownBand ? 270 : 203);
    TEXT_FIT.recs = [];
    if (fit.length) { fits[name] = fit; nfit += fit.length; }
    if (s.ownBand) {
      // the still owns its band (UI LIT): keep it whole, the label in a strip under the frame
      const o = new Buf(480, 270 + 67, PAL.N0);
      o.c.set(b.c);
      band(o, a, s.label, 270);
      writePNG(path.join(OUT, 'stills', `${name}.png`), 480, 270 + 67, o.c, native ? 2 : 4);
    } else {
      band(b, a, s.label);
      writePNG(path.join(OUT, 'stills', `${name}.png`), 480, 270, b.c, native ? 2 : 4);
    }
    if (i === 0) firsts.push({a, b});
    index.push({file: `${name}.png`, id: a.id, label: s.label});
    n++;
  });
}
console.log(`stills: ${n} written to ${path.join(OUT, 'stills')} (${errs} errors, ${Date.now() - t0} ms)`);
fs.writeFileSync(path.join(OUT, 'stills', only ? 'textfit-partial.json' : 'textfit.json'), JSON.stringify(fits, null, 1));
if (!only) fs.writeFileSync(path.join(OUT, 'stills', 'index.json'), JSON.stringify(index, null, 1));
console.log(`text-fit: ${nfit} strings flagged in ${Object.keys(fits).length} stills`);
for (const [k, v] of Object.entries(fits)) for (const f of v) console.log(`  ${k}: "${f.s}" ${f.issue} at ${f.at.join(',')}`);

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
