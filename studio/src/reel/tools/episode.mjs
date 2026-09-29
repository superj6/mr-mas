#!/usr/bin/env node
// EPISODE REEL renderer: one manifest → one reel of the whole episode (studio/src/reel/README.md).
//   node src/reel/tools/episode.mjs <manifest.json | key> [options]            (run from studio/)
//
//   <manifest.json>     a manifest anywhere (it is passed to the bundle as input props: composition `reel-episode`)
//   <key>               show/reel/<key>.manifest.json (synced; also registered in the studio as reel-<key>)
//   --out F.mp4         default out/epNN/reel/<key>.mp4 (docs/ORGANIZATION-PLAN.md §2)
//   --work DIR          bundle, segments, plan and mix live here (default studio/out/reel-work/<key>/, git-ignored)
//   --jobs N            chapter segments rendered at once (default 3); each render uses --conc browser tabs (default 4)
//   --seg S             split a chapter into segments of at most S seconds (default 90) so the jobs stay balanced
//   --only a,b          render / mix only these chapter ids (a preview file of just them, back to back)
//   --plan              print the plan (chapters, clocks, beds, warnings) and stop
//   --no-mix            picture only (silent stereo track)       --mix-only   remix onto the last picture
//   --no-sync           don't run sync.mjs first                 --force      ignore cached segments
//   --scale X           render scale (1 = 1280x720; 1.5 = 1920x1080, the 1080p maximum)
// Segments are cached by content (code + the episode layout + the chapter's own data + frame range), so after a fix
// to one chapter only that chapter re-renders. The picture of every segment comes from the same composition, so the
// episode clock and bar run continuously across the joins; a full-frame video slot is transcoded by ffmpeg with
// Remotion's own x264 settings and stream-copied in with the rest.
import {spawn} from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {ffmpeg, ffprobe, ROOT, STUDIO} from './mixer.mjs';

// ---------------------------------------------------------------- args
const pos = [];
const opt = {};
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const m = argv[i].match(/^--([a-z-]+)(?:=(.*))?$/);
  if (!m) pos.push(argv[i]);
  else if (m[2] !== undefined) opt[m[1]] = m[2];
  else if (['out', 'work', 'jobs', 'conc', 'seg', 'only', 'scale'].includes(m[1])) opt[m[1]] = argv[++i];
  else opt[m[1]] = true;
}
if (!pos[0]) {
  console.error('usage: node src/reel/tools/episode.mjs <manifest.json | key> [--out F.mp4] [--work DIR] [--jobs 3] [--conc 4] [--seg 90] [--only ids] [--plan] [--no-mix] [--mix-only] [--no-sync] [--force] [--scale 1]');
  process.exit(1);
}
const T0 = Date.now();
const log = (...a) => console.log(...a);
const sec = (ms) => Math.round(ms / 100) / 10;
const JOBS = Math.max(1, Number(opt.jobs ?? 3));
const CONC = Math.max(1, Number(opt.conc ?? 4));
const SEG = Math.max(10, Number(opt.seg ?? 90));
const SCALE = Number(opt.scale ?? 1);
if (!(SCALE > 0 && SCALE <= 1.5)) throw new Error('--scale must be in (0, 1.5] (1.5 = 1080p, the maximum)');

// ---------------------------------------------------------------- the manifest
let manFile = path.resolve(pos[0]);
if (!fs.existsSync(manFile)) manFile = path.join(ROOT, 'show/reel', `${pos[0].replace(/\.manifest(\.json)?$/, '')}.manifest.json`);
if (!fs.existsSync(manFile)) throw new Error(`no manifest ${pos[0]} (a file, or show/reel/<key>.manifest.json)`);
const manifest = JSON.parse(fs.readFileSync(manFile, 'utf8'));
const KEY = String(manifest.key || path.basename(manFile).replace(/\.manifest\.json$|\.json$/, ''));
const epNo = Number(manifest.episode);
const OUT = path.resolve(opt.out ?? path.join(ROOT, 'out', Number.isFinite(epNo) ? `ep${String(epNo).padStart(2, '0')}` : 'season', 'reel', `${KEY}${opt.only ? '-' + String(opt.only).replace(/,/g, '+') : ''}.mp4`));
const WORK = path.resolve(opt.work ?? path.join(STUDIO, 'out/reel-work', KEY));
fs.mkdirSync(WORK, {recursive: true}); // (the output folder is made only when something is written there: --plan leaves out/ alone)
const REMOTION = path.join(STUDIO, 'node_modules/.bin/remotion');
const run = (cmd, args, o = {}) =>
  new Promise((res, rej) => {
    const p = spawn(cmd, args, {cwd: STUDIO, stdio: ['ignore', 'pipe', 'pipe'], ...o});
    let err = '';
    p.stdout?.on('data', () => {});
    p.stderr?.on('data', (d) => (err += d));
    p.on('close', (code) => (code === 0 ? res() : rej(new Error(`${path.basename(cmd)} exited ${code}: ${err.slice(-2000)}`))));
  });
const hashFiles = (files) => {
  const h = crypto.createHash('sha1');
  for (const f of files.sort()) h.update(f).update(fs.readFileSync(f));
  return h.digest('hex');
};
const walk = (d, pred) => (fs.existsSync(d) ? fs.readdirSync(d, {withFileTypes: true}).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name), pred) : pred(e.name) ? [path.join(d, e.name)] : [])) : []);
const measure = {manifest: path.relative(ROOT, manFile), key: KEY, host: {cores: os.cpus().length, load1: os.loadavg()[0]}, jobs: JOBS, concurrency: CONC, seg: SEG, scale: SCALE, steps: {}};
const step = async (name, fn) => {
  const t = Date.now();
  const r = await fn();
  measure.steps[name] = sec(Date.now() - t);
  return r;
};

// ---------------------------------------------------------------- 1. sync + bundle (reused while code and data are unchanged)
if (!opt['no-sync'] && !opt['mix-only']) await step('sync', () => run(process.execPath, ['src/reel/sync.mjs', '--quiet']));
const codeFiles = [
  ...walk(path.join(STUDIO, 'src/reel'), (n) => /\.tsx?$/.test(n)), // what the bundle is built from (tools/ and sync.mjs are not)
  ...walk(path.join(STUDIO, 'src/shared'), (n) => /\.(tsx?|css)$/.test(n)),
  path.join(STUDIO, 'src/shared/makeRoot.tsx'),
  path.join(STUDIO, 'src/dev/reel/entry.tsx'),
  path.join(STUDIO, 'src/styleframes/reel.frame.tsx'),
].filter((f) => fs.existsSync(f));
const CODE = hashFiles(codeFiles);
const BUNDLE_HASH = crypto.createHash('sha1').update(CODE).update(hashFiles(walk(path.join(STUDIO, 'src/reel/data'), (n) => n.endsWith('.json')))).digest('hex');
const BUNDLE = path.join(WORK, 'bundle');
const stamp = path.join(WORK, 'bundle.hash');
if (!(fs.existsSync(stamp) && fs.readFileSync(stamp, 'utf8') === BUNDLE_HASH && fs.existsSync(path.join(BUNDLE, 'index.html')))) {
  await step('bundle', async () => {
    fs.rmSync(BUNDLE, {recursive: true, force: true});
    await run(REMOTION, ['bundle', 'src/dev/reel/entry.tsx', '--out-dir', BUNDLE, '--bundle-cache=false', '--log=error']);
    fs.writeFileSync(stamp, BUNDLE_HASH);
  });
} else measure.steps.bundle = 'reused';

// ---------------------------------------------------------------- 2. stage media for inset video slots, then the plan
const media = {};
for (const c of manifest.chapters ?? []) {
  if ((c.kind === 'video' || (c.src && !c.from)) && c.fit === 'inset' && c.src) {
    const src = path.join(ROOT, c.src);
    if (!fs.existsSync(src)) continue;
    const rel = `reel-media/${c.id}-${path.basename(src)}`;
    const dst = path.join(BUNDLE, 'public', rel);
    fs.mkdirSync(path.dirname(dst), {recursive: true});
    if (!fs.existsSync(dst)) fs.copyFileSync(src, dst);
    media[c.id] = {path: rel};
  }
}
const props = {reelManifest: {...manifest, key: KEY, _media: media}};
const PROPS = path.join(WORK, 'props.json');
fs.writeFileSync(PROPS, JSON.stringify(props));
const {selectComposition} = await import('@remotion/renderer');
const comp = await step('plan', () => selectComposition({serveUrl: BUNDLE, id: 'reel-episode', inputProps: props, logLevel: 'error'}));
const plan = comp.props.plan;
fs.writeFileSync(path.join(WORK, 'plan.json'), JSON.stringify(plan));
const clk = (f) => {
  const s = f / plan.fps;
  return `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`;
};
log(`${KEY}: ${plan.chapters.length} chapters, ${clk(plan.total)} (${plan.total} frames), ${plan.beds.length} bed segment(s), ${plan.clips.length} audio clip(s)`);
for (const c of plan.chapters) log(`  ${c.id.padEnd(14)} ${c.kind.padEnd(6)} ${clk(c.from).padStart(7)} +${clk(c.dur).padStart(7)}  ${String(c.label).padEnd(10)} ${c.source}${c.audio ? '  · ' + c.audio : ''}`);
for (const b of plan.beds) log(`  bed ${clk(b.from * plan.fps).padStart(7)} → ${clk(b.to * plan.fps).padStart(7)}  ${b.label}`);
for (const w of plan.warnings) log(`  ! ${w}`);
if (opt.plan) process.exit(0);

// ---------------------------------------------------------------- 3. segments
const only = opt.only ? new Set(String(opt.only).split(',')) : null;
const chosen = plan.chapters.filter((c) => !only || only.has(c.id));
if (!chosen.length) throw new Error(`--only ${opt.only}: no such chapter`);
const layoutSig = JSON.stringify({t: plan.total, top: plan.top, sub: plan.sub, beds: plan.beds.map((b) => [b.label, b.from, b.to]), a: plan.actCardSec, h: [plan.title, plan.variant, plan.episode, plan.dateSpan, plan.runtimeMin], c: plan.chapters.map((c) => [c.id, c.kind, c.from, c.dur, c.label, c.sub, c.known])});
const W = Math.round(1280 * SCALE / 2) * 2;
const H = Math.round(720 * SCALE / 2) * 2;
const segs = [];
for (const c of chosen) {
  const chSig = crypto.createHash('sha1').update(CODE).update(layoutSig).update(JSON.stringify(c)).update(String(SCALE)).digest('hex');
  if (c.kind === 'video' && c.video.fit === 'full') {
    segs.push({ch: c, a: c.from, b: c.from + c.dur, kind: 'ffmpeg', key: chSig.slice(0, 10)});
    continue;
  }
  const n = Math.max(1, Math.ceil(c.dur / (SEG * plan.fps)));
  for (let k = 0; k < n; k++) {
    const a = c.from + Math.round((c.dur * k) / n);
    const b = c.from + Math.round((c.dur * (k + 1)) / n);
    segs.push({ch: c, a, b, kind: 'remotion', key: crypto.createHash('sha1').update(chSig).update(`${a}-${b}`).digest('hex').slice(0, 10)});
  }
}
const SEGDIR = path.join(WORK, 'segs');
fs.mkdirSync(SEGDIR, {recursive: true});
const frameCount = (f) => {
  try {
    return Number(ffprobe(['-count_packets', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', f]).trim());
  } catch {
    return -1;
  }
};
segs.forEach((s, i) => (s.file = path.join(SEGDIR, `${String(i).padStart(3, '0')}-${s.ch.id}-${s.a}-${s.b}-${s.key}.mp4`)));
const todo = segs.filter((s) => opt.force || !(fs.existsSync(s.file) && frameCount(s.file) === s.b - s.a));
const renderSeg = async (s) => {
  const t = Date.now();
  const tmp = s.file.replace(/\.mp4$/, '.part.mp4');
  if (s.kind === 'ffmpeg') {
    const v = s.ch.video;
    const src = path.join(ROOT, v.src);
    if (!fs.existsSync(src)) throw new Error(`video slot ${s.ch.id}: ${v.src} is missing`);
    // same encoder settings as Remotion's h264 output (libx264, crf 18, yuv420p, 90 kHz track timescale), so the
    // segments stream-copy together
    ffmpeg(['-ss', String(v.in), '-i', src, '-an', '-frames:v', String(s.b - s.a), '-vf', `scale=${W}:${H}:flags=lanczos`, '-r', String(plan.fps), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-video_track_timescale', '90000', tmp]);
  } else {
    await run(REMOTION, ['render', BUNDLE, 'reel-episode', tmp, `--frames=${s.a}-${s.b - 1}`, `--concurrency=${CONC}`, `--props=${PROPS}`, `--scale=${SCALE}`, '--muted', '--overwrite', '--log=error']);
  }
  const n = frameCount(tmp);
  if (n !== s.b - s.a) throw new Error(`segment ${path.basename(s.file)}: ${n} frames, expected ${s.b - s.a}`);
  fs.renameSync(tmp, s.file);
  s.wall = sec(Date.now() - t);
  log(`  seg ${path.basename(s.file)}  ${((s.b - s.a) / plan.fps).toFixed(1)} s of reel in ${s.wall} s`);
};
// the mix runs in its own process alongside the picture (it needs only the plan)
const MIX = path.join(WORK, 'mix.wav');
let mixing = null;
if (!opt['no-mix']) {
  const tm = Date.now();
  mixing = run(process.execPath, ['src/reel/tools/mixer.mjs', path.join(WORK, 'plan.json'), MIX, '--work', WORK], {stdio: ['ignore', 'inherit', 'pipe']}).then(() => (measure.steps.mix = sec(Date.now() - tm)));
}
if (!opt['mix-only']) {
  log(`rendering ${todo.length} of ${segs.length} segment(s) (${segs.length - todo.length} cached), ${JOBS} at a time × concurrency ${CONC}${mixing ? ', mixing alongside' : ''}`);
  await step('render', async () => {
    // longest first keeps the pool balanced
    const q = [...todo].sort((x, y) => y.b - y.a - (x.b - x.a));
    const worker = async () => {
      while (q.length) await renderSeg(q.shift());
    };
    await Promise.all(Array.from({length: Math.min(JOBS, q.length)}, worker));
  });
  measure.renderedSeconds = Math.round(todo.reduce((a, s) => a + (s.b - s.a), 0) / plan.fps * 10) / 10;
  measure.segments = segs.map((s) => ({file: path.basename(s.file), chapter: s.ch.id, frames: s.b - s.a, wall: s.wall ?? 'cached'}));
}

// ---------------------------------------------------------------- 4. concat (stream copy)
const PIC = path.join(WORK, `picture${only ? '-' + [...only].join('+') : ''}.mp4`);
if (!opt['mix-only']) {
  await step('concat', () => {
    const list = path.join(WORK, 'concat.txt');
    fs.writeFileSync(list, segs.map((s) => `file '${s.file.replace(/'/g, "'\\''")}'`).join('\n') + '\n');
    ffmpeg(['-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', PIC]);
  });
  const want = segs.reduce((a, s) => a + s.b - s.a, 0);
  const got = frameCount(PIC);
  measure.frames = {expected: want, got};
  if (got !== want) throw new Error(`concat: ${got} frames, expected ${want}`);
}

// ---------------------------------------------------------------- 5. mix + mux
let qa = null;
if (mixing) {
  const tw = Date.now();
  await mixing;
  measure.steps.mixWaitAfterPicture = sec(Date.now() - tw);
  qa = JSON.parse(fs.readFileSync(MIX.replace(/\.wav$/, '-qa.json'), 'utf8'));
}
fs.mkdirSync(path.dirname(OUT), {recursive: true});
await step('mux', () => {
  if (opt['no-mix']) ffmpeg(['-i', PIC, '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', OUT]);
  else if (!only) ffmpeg(['-i', PIC, '-i', MIX, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', '-movflags', '+faststart', OUT]);
  else {
    // a preview of some chapters: cut their spans out of the episode mix, back to back, sample-exact
    const parts = chosen.map((c, i) => `[1:a]atrim=start_sample=${Math.round((c.from / plan.fps) * 48000)}:end_sample=${Math.round(((c.from + c.dur) / plan.fps) * 48000)},asetpts=PTS-STARTPTS[a${i}]`);
    const fc = `${parts.join(';')};${chosen.map((_, i) => `[a${i}]`).join('')}concat=n=${chosen.length}:v=0:a=1[a]`;
    ffmpeg(['-i', PIC, '-i', MIX, '-filter_complex', fc, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', '-movflags', '+faststart', OUT]);
  }
});

// ---------------------------------------------------------------- 6. sidecars + the speed report
let at = 0;
const chapters = chosen.map((c) => {
  const r = {id: c.id, label: c.label, kind: c.kind, start: Math.round((at / plan.fps) * 1000) / 1000, end: Math.round(((at + c.dur) / plan.fps) * 1000) / 1000, episodeStart: Math.round((c.from / plan.fps) * 1000) / 1000, source: c.source, sound: c.audio};
  at += c.dur;
  return r;
});
const base = OUT.replace(/\.mp4$/i, '');
fs.writeFileSync(`${base}-chapters.json`, JSON.stringify({reel: path.relative(ROOT, OUT), manifest: path.relative(ROOT, manFile), fps: plan.fps, chapters, beds: plan.beds.map((b) => ({label: b.label, from: b.from, to: b.to})), warnings: plan.warnings}, null, 1));
const wall = sec(Date.now() - T0);
const reelSec = at / plan.fps;
const rendered = measure.renderedSeconds ?? 0;
measure.wall = wall;
measure.reelSeconds = Math.round(reelSec * 10) / 10;
measure.speed = {
  reelSecondsPerMinuteWall: Math.round((reelSec / (wall / 60)) * 10) / 10,
  renderedSecondsPerMinuteOfRenderStep: measure.steps.render ? Math.round((rendered / (measure.steps.render / 60)) * 10) / 10 : null,
};
measure.out = path.relative(ROOT, OUT);
measure.outBytes = fs.statSync(OUT).size;
if (qa) measure.mix = {lufs: qa.master.lufs, peak: qa.master.samplePeakDb, missing: qa.missing, silences: qa.silences};
fs.writeFileSync(`${base}-measure.json`, JSON.stringify(measure, null, 1));
log(`wrote ${path.relative(ROOT, OUT)} (${clk(at)}, ${(measure.outBytes / 1e6).toFixed(1)} MB) in ${wall} s wall: ${measure.speed.reelSecondsPerMinuteWall} s of reel per minute; steps ${JSON.stringify(measure.steps)}`);
