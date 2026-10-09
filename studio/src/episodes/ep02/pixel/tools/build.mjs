// MR. MAS — Ep2 v1 pixel pipeline: build one segment's Node renderer (tools/render.ts + <seg>/shots.ts) with esbuild.
// A copy of the Ep1 builder (studio/src/episodes/ep01/pixel/tools/build.mjs, locked) that also writes the bundle's
// esbuild metafile beside it, <out.cjs>.meta.json ({shots, inputs: {file: [its imports]}}, absolute paths): the per-scene
// cache (render.ts `scenes`) hashes each scene's own source files from it. Light (a second). From studio/:
//   node src/episodes/ep02/pixel/tools/build.mjs <seg> [<out.cjs>]        e.g.  build.mjs act1 $S/r-act1.cjs
//   node src/episodes/ep02/pixel/tools/build.mjs --entry <file.ts> <out.cjs>   bundle any Node tool (a scratch segment)
//   --shots <shots.ts>  (with --entry) the segment module the entry renders, so the scene cache can find its scenes/
// Rebuild after any change to the layouts, the lock (data.ts) or the pipeline: the bundle is what renders.
import {build} from 'esbuild';
import * as path from 'path';
import * as fs from 'fs';
import {fileURLToPath} from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PIXEL = path.resolve(HERE, '..');
const args = process.argv.slice(2);
const si = args.indexOf('--shots');
const shotsArg = si >= 0 ? path.resolve(args[si + 1]) : null;
if (si >= 0) args.splice(si, 2);
/** the metafile with absolute paths: {shots, inputs: {file: [imports]}} */
const writeMeta = (out, meta, shots) => {
  const cwd = process.cwd(), abs = (p) => path.resolve(cwd, p);
  const inputs = {};
  for (const [k, v] of Object.entries(meta.inputs)) {
    if (k.startsWith('<')) continue;
    inputs[abs(k)] = (v.imports ?? []).filter((i) => !i.external && i.path && !i.path.startsWith('<')).map((i) => abs(i.path));
  }
  fs.writeFileSync(`${out}.meta.json`, JSON.stringify({built: new Date().toISOString(), shots, inputs}, null, 0));
};
if (args[0] === '--entry') {
  const [, entry, out] = args;
  const r = await build({entryPoints: [path.resolve(entry)], bundle: true, platform: 'node', outfile: path.resolve(out), logLevel: 'warning', target: 'node18', metafile: true});
  writeMeta(path.resolve(out), r.metafile, shotsArg);
  console.log('built', path.resolve(out));
  process.exit(0);
}
const [seg, outArg] = args;
if (!seg || !/^[a-z0-9][a-z0-9-]*$/.test(seg)) { console.error('usage: build.mjs <seg> [<out.cjs>]'); process.exit(2); }
const shots = path.join(PIXEL, seg, 'shots.ts');
if (!fs.existsSync(shots)) { console.error(`no ${shots}: a shot pass writes <seg>/shots.ts (export SEGMENT)`); process.exit(2); }
const out = path.resolve(outArg ?? path.join(process.cwd(), `r-${seg}.cjs`));
const contents = `import {SEGMENT} from ${JSON.stringify(shots)};\nimport {main} from ${JSON.stringify(path.join(PIXEL, 'tools', 'render.ts'))};\nmain(SEGMENT);\n`;
const r = await build({stdin: {contents, resolveDir: PIXEL, loader: 'ts', sourcefile: `render-${seg}.ts`}, bundle: true, platform: 'node', outfile: out, logLevel: 'warning', target: 'node18', metafile: true});
writeMeta(out, r.metafile, shots);
console.log('built', out, `(${seg}; metafile ${path.basename(out)}.meta.json)`);
