// MR. MAS: CLOD look-dev (dev only). Build the Ep1 Node pixel renderer for one segment, the same way
// src/episodes/ep01/pixel/tools/build.mjs does, into a file of our choosing. With --plate, CLOD's pixel drawing is
// swapped for a no-op (clod-stub.ts) where the duel split imports it, so the frames come out as a clean plate: the
// same pane, light, plinth and people, and no pixel CLOD. Nothing in the episode is modified; the bundle lives in tmp.
//   node src/dev/blender/clod/plate-build.mjs act1 <out.cjs> [--plate]      (from studio/)
//   node <out.cjs> native <dir> <frame> ...      480 x 270 frames at 2x (PNG), named n<frame>-<shot>.png
import {build} from 'esbuild';
import * as path from 'path';
import {fileURLToPath} from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(HERE, '..', '..', '..');
const PIXEL = path.join(SRC, 'episodes', 'ep01', 'pixel');
const [seg, out, flag] = process.argv.slice(2);
if (!seg || !out) { console.error('usage: plate-build.mjs <seg> <out.cjs> [--plate]'); process.exit(2); }
const plate = flag === '--plate';
const stub = path.join(HERE, 'clod-stub.ts');
const noClod = {
  name: 'no-pixel-clod',
  setup(b) {
    b.onResolve({filter: /cast\/clod$/}, (a) => (a.importer.endsWith(path.join('rooms', 'duel-split.ts')) ? {path: stub} : undefined));
  },
};
const shots = path.join(PIXEL, seg, 'shots.ts');
const contents = `import {SEGMENT} from ${JSON.stringify(shots)};\nimport {main} from ${JSON.stringify(path.join(PIXEL, 'tools', 'render.ts'))};\nmain(SEGMENT);\n`;
await build({stdin: {contents, resolveDir: PIXEL, loader: 'ts', sourcefile: `render-${seg}.ts`}, bundle: true, platform: 'node',
  outfile: path.resolve(out), logLevel: 'warning', target: 'node18', plugins: plate ? [noClod] : []});
console.log('built', path.resolve(out), plate ? '(clean plate: no pixel CLOD)' : '(as the episode)');
