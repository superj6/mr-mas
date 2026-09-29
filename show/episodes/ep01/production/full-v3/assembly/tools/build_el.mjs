// Ep1 v3, the v3-assemble pass: build a segment's Node renderer ON ITS ELEVENLABS LOCK, without touching pixel/.
// The same bundle tools/build.mjs makes (the segment's own shots.ts + tools/render.ts), except that the shots' import of
// their own lock (`./data`, i.e. pixel/<seg>/data.ts, the Kokoro lock) resolves to assembly/el/data-<seg>.ts instead
// (tools/el_lock.sh). Every other import is the shots pass's, unchanged. Fails if the redirect didn't happen.
//   node show/episodes/ep01/production/full-v3/assembly/tools/build_el.mjs <seg> <out.cjs> [--entry <tool.ts>]
//   ELDIR=<dir> picks the EL locks (default assembly/el; the v3.1 ones are assembly/el-v31). --entry bundles another
//   Node tool that imports the segment's shots (e.g. pixel/tag/tools/splice.ts) with the same redirect.
// The renderer's default output is the KOKORO picture path (out/ep01/full-v3/picture/<seg>.mp4): always pass the output
// (out/ep01/full-v3/picture-el/<seg>.mp4) to its picture/contact/still modes.
import {createRequire} from 'module';
import * as path from 'path';
import * as fs from 'fs';

const REPO = process.env.MRMAS_ROOT ?? repo();
function repo() {   // the project root: the nearest .mrmas-root above this script or the cwd (phase 1)
  for (const start of [path.dirname(new URL(import.meta.url).pathname), process.cwd()]) {
    for (let d = start; ; d = path.dirname(d)) {
      if (fs.existsSync(path.join(d, '.mrmas-root'))) return d;
      if (d === path.dirname(d)) break;
    }
  }
  throw new Error('MR. MAS: no .mrmas-root above this script or the cwd; set MRMAS_ROOT');
}
const PIXEL = `${REPO}/studio/src/episodes/ep01/pixel`;
const {build} = createRequire(`${REPO}/studio/package.json`)('esbuild');
const argv = process.argv.slice(2);
const ei = argv.indexOf('--entry');
const entryTool = ei >= 0 ? path.resolve(argv[ei + 1]) : null;
if (ei >= 0) argv.splice(ei, 2);
const [seg, outArg] = argv;
if (!seg || !outArg) { console.error('usage: build_el.mjs <seg> <out.cjs>'); process.exit(2); }
const shots = path.join(PIXEL, seg, 'shots.ts');
const kokoroData = path.join(PIXEL, seg, 'data.ts');
const ELDIR = path.resolve(process.env.ELDIR ?? `${REPO}/show/episodes/ep01/production/full-v3/assembly/el`);
const elData = `${ELDIR}/data-${seg}.ts`;
if (!fs.existsSync(elData)) { console.error(`no ${elData}: run tools/el_lock.sh ${seg}`); process.exit(2); }
let redirected = 0;
const elLock = {
  name: 'el-lock',
  setup(b) {
    b.onResolve({filter: /(^|\/)data(\.ts)?$/}, (args) => {
      const abs = path.resolve(args.resolveDir, args.path.endsWith('.ts') ? args.path : `${args.path}.ts`);
      if (abs !== kokoroData) return undefined;
      redirected++;
      return {path: elData};
    });
  },
};
const out = path.resolve(outArg);
const contents = `import {SEGMENT} from ${JSON.stringify(shots)};\nimport {main} from ${JSON.stringify(path.join(PIXEL, 'tools', 'render.ts'))};\nmain(SEGMENT);\n`;
const common = {bundle: true, platform: 'node', outfile: out, logLevel: 'warning', target: 'node18', plugins: [elLock]};
if (entryTool) await build({...common, entryPoints: [entryTool]});
else await build({...common, stdin: {contents, resolveDir: PIXEL, loader: 'ts', sourcefile: `render-${seg}-el.ts`}});
if (!redirected) { fs.rmSync(out, {force: true}); console.error(`the bundle never imported ${kokoroData}: nothing redirected, no renderer written`); process.exit(1); }
const txt = fs.readFileSync(out, 'utf8');
if (!/ep01-v3\d*-el-/.test(txt)) { console.error('the built renderer does not carry the EL lock (no ep01-v3-el- timeline in it)'); process.exit(1); }
console.log('built', out, `(${entryTool ? path.relative(REPO, entryTool) : seg} on the EL lock; ${redirected} import(s) of ./data redirected to ${path.relative(REPO, elData)})`);
