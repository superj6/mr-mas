// Bundle once, render many stills: node src/dev/animatic/stills.mjs <outdir> <prefix> f1 f2 ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
const [outDir, prefix, ...fr] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/dev/animatic/entry.tsx')});
const composition = await selectComposition({serveUrl, id: 'intro-animatic'});
for (const s of fr) {
  const [f, name] = s.split(':');
  const out = path.join(outDir, `${name ?? prefix + f}.png`);
  await renderStill({composition, serveUrl, output: out, frame: Number(f)});
  console.log('wrote', out);
}
