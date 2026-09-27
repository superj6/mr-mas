// MR. MAS — Ep1 pixel pipeline (P0): build one segment's Node renderer (tools/render.ts + <seg>/shots.ts) with esbuild.
// Light (a few seconds). From studio/:
//   node src/episodes/ep01/pixel/tools/build.mjs <seg> [<out.cjs>]        e.g.  build.mjs act1 $S/r-act1.cjs
//   node src/episodes/ep01/pixel/tools/build.mjs --entry <file.ts> <out.cjs>   bundle any Node tool (tools/act4check.ts)
// Rebuild after any change to the layouts, the lock (data.ts) or the pipeline: the bundle is what renders.
import {build} from 'esbuild';
import * as path from 'path';
import * as fs from 'fs';
import {fileURLToPath} from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PIXEL = path.resolve(HERE, '..');
const args = process.argv.slice(2);
if (args[0] === '--entry') {
  const [, entry, out] = args;
  await build({entryPoints: [path.resolve(entry)], bundle: true, platform: 'node', outfile: path.resolve(out), logLevel: 'warning', target: 'node18'});
  console.log('built', path.resolve(out));
  process.exit(0);
}
const [seg, outArg] = args;
if (!seg || !/^[a-z0-9][a-z0-9-]*$/.test(seg)) { console.error('usage: build.mjs <seg> [<out.cjs>]'); process.exit(2); }
const shots = path.join(PIXEL, seg, 'shots.ts');
if (!fs.existsSync(shots)) { console.error(`no ${shots}: a shot pass writes <seg>/shots.ts (export SEGMENT)`); process.exit(2); }
const out = path.resolve(outArg ?? path.join(process.cwd(), `r-${seg}.cjs`));
const contents = `import {SEGMENT} from ${JSON.stringify(shots)};\nimport {main} from ${JSON.stringify(path.join(PIXEL, 'tools', 'render.ts'))};\nmain(SEGMENT);\n`;
await build({stdin: {contents, resolveDir: PIXEL, loader: 'ts', sourcefile: `render-${seg}.ts`}, bundle: true, platform: 'node', outfile: out, logLevel: 'warning', target: 'node18'});
console.log('built', out, `(${seg})`);
