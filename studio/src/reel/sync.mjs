#!/usr/bin/env node
// Copy + lint the writers' reel timelines (show/reel/*.json) into studio/src/reel/data/, where the bundle reads them.
// A file that doesn't parse is replaced by an error placeholder (the composition still exists and shows the error),
// so one bad save never breaks the Remotion bundle for everyone else.
//   node src/reel/sync.mjs            sync once + print a lint report
//   node src/reel/sync.mjs --watch    keep syncing while the studio is open
//   node src/reel/sync.mjs --verbose  print every warning (default: first 12 per file)
// An EPISODE MANIFEST (<key>.manifest.json, or "kind": "episode-manifest"; README.md beside this file) is copied the
// same way and linted as a manifest: the registry builds reel-<key> (the whole episode on one timeline) from it.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(here, '../../../show/reel');
const DST = path.resolve(here, 'data');
const args = new Set(process.argv.slice(2));
const VERBOSE = args.has('--verbose');
const QUIET = args.has('--quiet');

const ACTS = ['INTRO', 'COLD OPEN', 'ACT ONE', 'ACT TWO', 'ACT THREE', 'ACT FOUR', 'ACT FIVE', 'TAG', 'CREDITS'];
const KINDS = ['scene', 'montage', 'flashback', 'plan', 'setpiece', 'card', 'intro'];
const SETS = ['stage', 'office', 'bullpen', 'boardroom', 'darkroom', 'lobby', 'courtroom', 'senate', 'whitehouse', 'podium', 'street', 'skyline', 'lab', 'datacenter', 'stadium', 'dinner', 'call', 'screen', 'lighthouse', 'vault', 'rocket', 'void'];
const STYLES = ['BASE', '1-BIT', 'EARLY-WEB16', 'GLYPH', 'LEDGER', 'TERMINAL', '2-TONE'];
const SHOTS = ['wide', 'medium', 'close', 'insert'];
const POSES = ['stand', 'sit', 'point', 'walk', 'float', 'slump', 'arms-up', 'phone', 'lean'];
const FACES = ['calm', 'smile', 'worried', 'angry', 'shocked', 'smug'];
const FXS = ['freeze', 'flash', 'glyph-dissolve', 'shake', 'pop', 'rain', 'rewind', 'split'];
// ids with their own stick-figure mark / shape (everything else renders as a labelled generic figure)
const MARKED = ['mas', 'gerg', 'alyi', 'nole', 'mario', 'rumpt', 'nesnej', 'tasya', 'kram', 'radnus', 'simed', 'rima', 'neleh', 'mada', 'ttemme', 'terb', 'luap', 'sama-nos', 'yrral', 'whale', 'orb', 'intern', 'calendar', 'podium', 'clod', 'chatgtp', 'korg'];

const clock = (v) => {
  if (typeof v === 'number') return v;
  if (typeof v !== 'string') return null;
  const m = v.trim().match(/^(\d+):(\d{1,2})(?::(\d{1,2}))?$/);
  if (m) return m[3] !== undefined ? +m[1] * 3600 + +m[2] * 60 + +m[3] : +m[1] * 60 + +m[2];
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`;

function lint(file, o) {
  const w = [];
  const isEp = /^ep\d+\.json$/i.test(file);
  if (!o || typeof o !== 'object' || Array.isArray(o)) return {w: ['top level is not an object'], total: 0, n: 0, generic: []};
  const beats = Array.isArray(o.beats) ? o.beats : [];
  if (!beats.length) w.push('no beats[]');
  if (isEp) for (const k of ['episode', 'title', 'logline', 'dateSpan']) if (o[k] === undefined || o[k] === '') w.push(`missing ${k}`);
  const ids = new Set();
  const generic = new Set();
  let total = 0;
  const all = JSON.stringify(o);
  if (/\bP(MURT|RUMT)\b/i.test(all)) w.push('PMURT/PRUMT found: the name is RUMPT');
  beats.forEach((b, i) => {
    const tag = `beat ${b?.id ?? '#' + (i + 1)}`;
    if (!b || typeof b !== 'object') return w.push(`${tag}: not an object`);
    if (!b.id) w.push(`${tag}: no id`);
    else if (ids.has(b.id)) w.push(`${tag}: duplicate id`);
    ids.add(b.id);
    const d = typeof b.reelDur === 'number' ? b.reelDur : Number(b.reelDur);
    if (!Number.isFinite(d) || d <= 0) w.push(`${tag}: reelDur missing (defaults to 3 s)`);
    else if (isEp && (d < 2 || d > 9 || (d > 6 && b.kind !== 'setpiece'))) w.push(`${tag}: reelDur ${d} s outside 2-6 s (6-9 s for a set-piece)`);
    total += Number.isFinite(d) && d > 0 ? d : 3;
    const chk = (k, list, v = b[k]) => {
      if (v !== undefined && v !== '' && !list.includes(typeof v === 'string' ? (k === 'style' || k === 'act' ? v.toUpperCase() : v.toLowerCase()) : v)) w.push(`${tag}: ${k} "${v}" not in schema (a fallback is used)`);
    };
    chk('act', ACTS);
    chk('kind', KINDS);
    chk('set', SETS);
    chk('style', STYLES);
    chk('shot', SHOTS);
    for (const fx of Array.isArray(b.fx) ? b.fx : b.fx ? [b.fx] : []) if (!FXS.includes(String(fx).toLowerCase())) w.push(`${tag}: fx "${fx}" not supported`);
    for (const c of Array.isArray(b.chars) ? b.chars : []) {
      const id = typeof c === 'string' ? c : c?.id;
      if (!id) w.push(`${tag}: a char has no id`);
      else if (!MARKED.includes(String(id).toLowerCase())) generic.add(String(id).toLowerCase());
      if (c && typeof c === 'object') {
        chk('pose', POSES, c.pose);
        chk('face', FACES, c.face);
        if (c.x !== undefined && (typeof c.x !== 'number' || c.x < 0 || c.x > 1)) w.push(`${tag}: ${id} x=${c.x} outside 0-1`);
      }
    }
    if (typeof b.caption === 'string' && b.caption.length > 110) w.push(`${tag}: caption ${b.caption.length} chars (> 110)`);
    if (!b.caption) w.push(`${tag}: no caption`);
    if (typeof b.vo === 'string' && b.vo.length > 90) w.push(`${tag}: vo ${b.vo.length} chars (> 90)`);
    for (const l of Array.isArray(b.lines) ? b.lines : []) if (l && typeof l.text === 'string' && l.text.length > 90) w.push(`${tag}: line by ${l.who} is ${l.text.length} chars (long for a reel)`);
    // line timing (schema.ts): t is seconds when any line in the beat has t > 1, else a fraction of the beat
    const ts = (Array.isArray(b.lines) ? b.lines : []).map((l) => (l && typeof l === 'object' ? Number(l.t ?? l.at) : NaN)).filter(Number.isFinite);
    const secs = ts.some((t) => t > 1);
    const bd = Number.isFinite(d) && d > 0 ? d : 3;
    for (const t of ts) if (secs && t >= bd) w.push(`${tag}: a line starts at ${t} s, past the ${bd} s beat (it plays at 95%)`);
    if (/speculat/i.test(JSON.stringify([b.caption, b.onscreen, b.real]))) w.push(`${tag}: speculation label (dropped at render: the reel shows no speculative labels)`);
    if (b.realStart !== undefined && clock(b.realStart) === null) w.push(`${tag}: realStart "${b.realStart}" not mm:ss`);
    const rs = clock(b.realStart);
    const rt = (typeof o.runtimeMin === 'number' ? o.runtimeMin : 22) * 60;
    if (rs !== null && typeof b.realDur === 'number' && rs + b.realDur > rt + 60) w.push(`${tag}: real window ends at ${fmt(rs + b.realDur)}, past the ${rt / 60}-min runtime`);
  });
  if (isEp && beats.length && (total < 120 || total > 180)) w.push(`reel total ${fmt(total)} outside 2:00-3:00`);
  if (/speculat/i.test(JSON.stringify([o.title, o.logline, o.dateSpan]))) w.push('speculation label in title/logline/dateSpan (dropped at render)');
  return {w, total, n: beats.length, generic: [...generic]};
}

const ROOT = path.resolve(here, '../../..');
const isManifest = (f, o) => /\.manifest\.json$/i.test(f) || (o && typeof o === 'object' && o.kind === 'episode-manifest');
function lintManifest(o, files) {
  const w = [];
  const chapters = Array.isArray(o.chapters) ? o.chapters : [];
  if (!chapters.length) w.push('no chapters[]');
  const ids = new Set();
  const have = new Set(files.map((f) => f.replace(/\.json$/i, '').toLowerCase()));
  for (const [i, c] of chapters.entries()) {
    const tag = `chapter ${c?.id ?? '#' + (i + 1)}`;
    if (!c || typeof c !== 'object') {
      w.push(`${tag}: not an object`);
      continue;
    }
    if (!c.id) w.push(`${tag}: no id`);
    else if (ids.has(c.id)) w.push(`${tag}: duplicate id`);
    ids.add(c.id);
    const kind = c.kind || (c.src && !c.from ? 'video' : c.from ? 'reel' : 'card');
    if (kind === 'reel' && !have.has(String(c.from).toLowerCase())) w.push(`${tag}: timeline show/reel/${c.from}.json not found`);
    if (kind === 'video') {
      if (!c.src) w.push(`${tag}: video chapter has no src`);
      else if (!fs.existsSync(path.join(ROOT, c.src))) w.push(`${tag}: ${c.src} not found`);
      if (typeof c.dur !== 'number') w.push(`${tag}: video chapter needs dur (seconds)`);
    }
    const a = c.audio && typeof c.audio === 'object' ? c.audio : null;
    if (a?.src && !fs.existsSync(path.join(ROOT, a.src))) w.push(`${tag}: audio ${a.src} not found`);
  }
  for (const [i, b] of (Array.isArray(o.beds) ? o.beds : []).entries()) {
    const tag = `bed ${i + 1}${b?.cue ? ' (' + b.cue + ')' : ''}`;
    if (!b || typeof b !== 'object') continue;
    if (b.chapter && !ids.has(b.chapter)) w.push(`${tag}: chapter ${b.chapter} not in chapters[]`);
    if (b.src && !fs.existsSync(path.join(ROOT, b.src))) w.push(`${tag}: ${b.src} not found (it will be skipped)`);
  }
  return {w, total: 0, n: chapters.length, generic: [], manifest: true};
}

function syncOnce() {
  fs.mkdirSync(DST, {recursive: true});
  const files = fs.existsSync(SRC) ? fs.readdirSync(SRC).filter((f) => f.toLowerCase().endsWith('.json') && !f.startsWith('.')).sort() : [];
  const keep = new Set();
  let changed = 0;
  const report = [];
  for (const f of files) {
    let obj;
    let err = '';
    try {
      obj = JSON.parse(fs.readFileSync(path.join(SRC, f), 'utf8'));
    } catch (e) {
      err = String(e.message || e).split('\n')[0];
      const m = f.match(/(\d+)/);
      obj = {episode: m ? Number(m[1]) : null, title: f, _error: `${f}: ${err}`, beats: []};
    }
    const out = JSON.stringify(obj);
    const dst = path.join(DST, f);
    const prev = fs.existsSync(dst) ? fs.readFileSync(dst, 'utf8') : null;
    if (prev !== out) {
      fs.writeFileSync(dst + '.tmp', out);
      fs.renameSync(dst + '.tmp', dst);
      changed++;
    }
    keep.add(f);
    const L = err ? {w: [`PARSE ERROR: ${err}`], total: 0, n: 0, generic: []} : isManifest(f, obj) ? lintManifest(obj, files) : lint(f, obj);
    report.push({f, ...L});
  }
  for (const f of fs.readdirSync(DST)) if (f.endsWith('.json') && !keep.has(f)) (fs.unlinkSync(path.join(DST, f)), changed++);
  if (!QUIET) {
    console.log(`reel sync: ${files.length} file(s) from ${SRC} -> ${DST} (${changed} changed)`);
    for (const r of report) {
      const id = 'reel-' + r.f.replace(/(\.manifest)?\.json$/i, '').replace(/^_+/, '').toLowerCase().replace(/[^a-z0-9-]+/g, '-');
      if (r.manifest) console.log(`  ${r.f.padEnd(24)} ${id.padEnd(24)} ${String(r.n).padStart(3)} chapters  (episode manifest)  ${r.w.length ? r.w.length + ' warning(s)' : 'ok'}`);
      else console.log(`  ${r.f.padEnd(24)} ${id.padEnd(24)} ${String(r.n).padStart(3)} beats  reel ${fmt(r.total + 3)} (incl. 3 s title)  ${r.w.length ? r.w.length + ' warning(s)' : 'ok'}`);
      for (const x of VERBOSE ? r.w : r.w.slice(0, 12)) console.log(`      - ${x}`);
      if (!VERBOSE && r.w.length > 12) console.log(`      … ${r.w.length - 12} more (--verbose)`);
      if (r.generic.length) console.log(`      generic figures (no mark yet): ${r.generic.join(', ')}`);
    }
    if (keep.has('ep01-full-part1.json') && keep.has('ep01-full-part2.json'))
      console.log(`  ${'(stitched)'.padEnd(24)} ${'reel-ep01-full'.padEnd(24)} part1 + Act Three + ${keep.has('ep01-full-act4.json') ? 'ep01-full-act4' : 'Act Four placeholder (7:13)'} + tag/credits`);
  }
  return changed;
}

syncOnce();
if (args.has('--watch')) {
  fs.mkdirSync(SRC, {recursive: true});
  let t = null;
  fs.watch(SRC, () => {
    clearTimeout(t);
    t = setTimeout(() => {
      try {
        syncOnce();
      } catch (e) {
        console.error('sync failed:', e);
      }
    }, 400);
  });
  console.log(`watching ${SRC} …`);
}
