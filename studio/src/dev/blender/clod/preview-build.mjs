// MR. MAS: the final CLOD insert's preview (dev only). Builds Act One's Node pixel renderer as tools/build.mjs does, with
// two bundle-time substitutions, so the preview shows the insert through the episode's own renderer and its overlay
// stage before the Act One shot pass adopts it. Nothing in the episode is modified; the bundle lives in scratch.
//   1. the lock: act1/shots.ts's `./data` resolves to the given data.ts (lock.py --out-ts on the EL-timed timeline)
//   2. 11.04's declaration, exactly as the insert's README gives it: `overlay: {manifest}` on the layout, and the
//      pane's pixel CLOD hidden from the launch light on (`clod: k >= c0 ? {hidden: true} : {}`)
//   node src/dev/blender/clod/preview-build.mjs <data.ts> <out.cjs> [<manifest>]      (from studio/)
import {build} from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import {fileURLToPath} from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PIXEL = path.resolve(HERE, '..', '..', '..', 'episodes', 'ep01', 'pixel');
const [data, out, manifest = 'out/ep01/full-v3/inserts/clod-v35-el/manifest.json'] = process.argv.slice(2);
if (!data || !out) { console.error('usage: preview-build.mjs <data.ts> <out.cjs> [<manifest>]'); process.exit(2); }
const shots = path.join(PIXEL, 'act1', 'shots.ts');
const DECL = [
  ["L.add('11.04', {", `L.add('11.04', {\n  overlay: {manifest: '${manifest}'},`],
  ["clod: k >= c0 && k < c1 + 4 ? {pose: 'bow', smile: true} : {}", 'clod: k >= c0 ? {hidden: true} : {}'],
];
const preview = {
  name: 'clod-insert-preview',
  setup(b) {
    b.onResolve({filter: /^\.\/data$/}, (a) => (a.importer === shots ? {path: path.resolve(data)} : undefined));
    b.onLoad({filter: /act1[\\/]shots\.ts$/}, (a) => {
      let src = fs.readFileSync(a.path, 'utf8');
      for (const [from, to] of DECL) {
        if (src.split(from).length !== 2) throw new Error(`act1/shots.ts no longer has exactly one "${from}": update the preview's patch`);
        src = src.replace(from, to);
      }
      return {contents: src, loader: 'ts', resolveDir: path.dirname(a.path)};
    });
  },
};
const contents = `import {SEGMENT} from ${JSON.stringify(shots)};\nimport {main} from ${JSON.stringify(path.join(PIXEL, 'tools', 'render.ts'))};\nmain(SEGMENT);\n`;
await build({stdin: {contents, resolveDir: PIXEL, loader: 'ts', sourcefile: 'render-act1-clod-preview.ts'}, bundle: true, platform: 'node',
  outfile: path.resolve(out), logLevel: 'warning', target: 'node18', plugins: [preview]});
console.log('built', path.resolve(out), `(act1 on ${path.basename(data)}, 11.04 overlay ${manifest})`);
