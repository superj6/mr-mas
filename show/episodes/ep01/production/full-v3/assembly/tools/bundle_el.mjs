// Ep1 v3, the v3-assemble pass: a Remotion bundle of the pixel pipeline's entry (pixel/entry.tsx) in which every
// segment's `./data` (pixel/<seg>/data.ts, the Kokoro lock) resolves to its ElevenLabs lock (assembly/el/data-<seg>.ts).
// The Node renderers built by build_el.mjs splice their GLYPH frames from THIS bundle (Acts Three and Four), so Remotion
// draws them on the EL frames. Nothing in studio/ is edited; the redirect is a webpack NormalModuleReplacementPlugin.
// Heavy (webpack): from studio/,  bash ../ops/heavy.sh node ../show/episodes/ep01/production/full-v3/assembly/tools/bundle_el.mjs <outDir>
import {createRequire} from 'module';
import * as path from 'path';
import * as fs from 'fs';

const REPO = '/home/jgon/project/art/mrmas';
const PIXEL = `${REPO}/studio/src/episodes/ep01/pixel`;
const EL = `${REPO}/show/episodes/ep01/production/full-v3/assembly/el`;
const req = createRequire(`${REPO}/studio/package.json`);
const {bundle} = req('@remotion/bundler');
const webpack = req('webpack');
const outDir = path.resolve(process.argv[2] ?? '');
if (!process.argv[2]) { console.error('usage: bundle_el.mjs <outDir>'); process.exit(2); }
const SEGS = ['coldopen', 'act1', 'act2', 'act3', 'act4', 'tag'];
const MAP = new Map(SEGS.filter((s) => fs.existsSync(`${EL}/data-${s}.ts`)).map((s) => [path.join(PIXEL, s, 'data.ts'), `${EL}/data-${s}.ts`]));
const hits = new Set();
const t0 = Date.now();
const where = await bundle({
  entryPoint: `${REPO}/studio/src/episodes/ep01/pixel/entry.tsx`,
  outDir,
  enableCaching: false,
  webpackOverride: (c) => ({
    ...c,
    plugins: [...(c.plugins ?? []), new webpack.NormalModuleReplacementPlugin(/(^|\/)data$/, (res) => {
      if (!res || typeof res.request !== 'string' || !res.context) return;
      const abs = path.resolve(res.context, `${res.request}.ts`);
      if (MAP.has(abs)) { res.request = MAP.get(abs); hits.add(abs); }
    })],
  }),
});
const missed = [...MAP.keys()].filter((k) => !hits.has(k));
console.log(JSON.stringify({bundle: where, seconds: Math.round((Date.now() - t0) / 1000), redirected: [...hits].map((h) => path.relative(PIXEL, h)), missed: missed.map((h) => path.relative(PIXEL, h))}));
if (missed.length) process.exit(1);
