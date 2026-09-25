// Reel stills + contact sheets. Bundles once (or reuses --serve=<bundle dir>), renders stills in one browser.
//   node src/dev/reel/stills.mjs <compId> <outDir> [frame ...]      default frames = one per beat (+ title card)
//     --serve=<dir>   reuse a bundle from `npx remotion bundle`     --scale=0.5   still scale (default 0.5)
//     --sheet         tile the stills into <outDir>/<compId>-sheet.png instead (6 columns; needs python3 + PIL)
//     --marks         only print the per-beat frame list (JSON) and exit
// (The ffmpeg bundled with Remotion has no tile/select filters, so the sheet is tiled with PIL.)
import {bundle} from '@remotion/bundler';
import {openBrowser, renderStill, selectComposition} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const STUDIO = path.resolve(here, '../../..');

const pos = [];
const opt = {};
for (const a of process.argv.slice(2)) {
  const m = a.match(/^--([a-z-]+)(?:=(.*))?$/);
  if (m) opt[m[1]] = m[2] ?? true;
  else pos.push(a);
}
const [id, outDir, ...fr] = pos;
if (!id || (!outDir && !opt.marks)) {
  console.error('usage: node src/dev/reel/stills.mjs <compId> <outDir> [frames…] [--serve=dir] [--scale=0.5] [--sheet] [--marks]');
  process.exit(1);
}
const serveUrl = opt.serve ? path.resolve(opt.serve) : await bundle({entryPoint: path.join(STUDIO, 'src/dev/reel/entry.tsx')});
const composition = await selectComposition({serveUrl, id});
const marks = composition.props?.marks ?? [];
if (opt.marks) {
  console.log(JSON.stringify(marks));
  process.exit(0);
}
const frames = (fr.length ? fr.map(Number) : marks).filter((f) => f >= 0 && f < composition.durationInFrames);
const scale = Number(opt.scale ?? 0.5);
fs.mkdirSync(outDir, {recursive: true});
const dir = opt.sheet ? fs.mkdtempSync(path.join(outDir, '.tiles-')) : outDir;
const outs = [];
const browser = await openBrowser('chrome');
for (let i = 0; i < frames.length; i++) {
  const out = path.join(dir, `${id}-${String(i + 1).padStart(3, '0')}.png`);
  await renderStill({composition, serveUrl, output: out, frame: frames[i], scale, puppeteerInstance: browser, logLevel: 'error'});
  outs.push(out);
  if (!opt.sheet) console.log('wrote', out, `(f${frames[i]})`);
}
await browser.close({silent: true});
if (opt.sheet) {
  const sheet = path.join(outDir, `${id}-sheet.png`);
  const py = `
import sys
from PIL import Image
out, files = sys.argv[1], sys.argv[2:]
ims = [Image.open(f).convert('RGB') for f in files]
w, h = ims[0].size
cols = 6; pad = 4
rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (w + pad) + pad, rows * (h + pad) + pad), (5, 7, 13))
for i, im in enumerate(ims):
    sheet.paste(im, (pad + (i % cols) * (w + pad), pad + (i // cols) * (h + pad)))
sheet.save(out)
`;
  try {
    execFileSync('python3', ['-c', py, sheet, ...outs], {stdio: 'inherit'});
    console.log('wrote', sheet, `(${outs.length} stills)`);
  } finally {
    fs.rmSync(dir, {recursive: true, force: true});
  }
}
