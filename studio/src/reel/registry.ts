// Registers one composition per synced reel file (src/reel/data/*.json, copied from show/reel/ by sync.mjs),
// `reel-season` (every epNN back to back) and `reel-ep01-full` (the full-length pilot, stitched in episode order:
// ep01-full-part1 = cold open → Act Two, part2's Act Three, Act Four, then part2's tag + credits).
// EPISODE REELS (episode.ts, EpisodeReel.tsx, README.md): every synced episode manifest (show/reel/<key>.manifest.json)
// registers `reel-<key>`, and a manifest passed as input props ({"reelManifest": {...}}, what tools/episode.mjs does
// for a manifest kept anywhere else) registers `reel-episode`.
// Loaded at bundle time via require.context.
import {getInputProps} from 'remotion';
import type {FrameDef} from '../shared/frame-def';
import {ACTS, FPS, H, normalizeEpisode, parseClock, timeEpisode, W, type Beat, type Episode} from './schema';
import {Reel, Season} from './Reel';
import {buildPlan, isManifest} from './episode';
import {EpisodeReel} from './EpisodeReel';

const manifests: {key: string; raw: unknown}[] = [];
const load = (): Episode[] => {
  const out: Episode[] = [];
  let ctx: __WebpackModuleApi.RequireContext | null = null;
  try {
    ctx = require.context('./data', false, /\.json$/);
  } catch {
    return out;
  }
  const seen = new Set<string>();
  for (const k of ctx.keys()) {
    const key = k.replace(/^.*\//, '').replace(/\.json$/, '');
    if (seen.has(key)) continue;
    seen.add(key);
    try {
      const raw = ctx(k);
      if (isManifest(raw, key)) {
        manifests.push({key: key.replace(/\.manifest$/i, ''), raw});
        continue;
      }
      out.push(normalizeEpisode(raw, key));
    } catch (e) {
      out.push(normalizeEpisode({_error: String(e), title: key}, key));
    }
  }
  // a split timeline (epNN-full-part1 …) with no title of its own borrows its episode's title card
  for (const e of out) {
    const m = e.key.match(/^(ep\d+)-(.+)$/i);
    const base = m && out.find((b) => b.key.toLowerCase() === m[1].toLowerCase());
    if (!m || !base) continue;
    if (e.title === e.key) e.title = base.title;
    if (!e.dateSpan) e.dateSpan = base.dateSpan;
    if (!e.part) e.part = m[2];
    if (/full/i.test(m[2])) e.variant = 'full-length rough animatic';
  }
  const isEp = (e: Episode) => /^ep\d+$/i.test(e.key);
  return out.sort((a, b) => Number(isEp(b)) - Number(isEp(a)) || (a.episode ?? 99) - (b.episode ?? 99) || a.key.localeCompare(b.key));
};

export const reelId = (key: string) => 'reel-' + key.replace(/^_+/, '').toLowerCase().replace(/[^a-z0-9-]+/g, '-');

export const episodes = load();

// ---------------------------------------------------------------- the full-length pilot
const ACT4_SEC = 7 * 60 + 13; // Act Four's slot in script.md (12:31–19:44) until its own timeline exists
const actRank = (a: string) => {
  const i = (ACTS as readonly string[]).indexOf(a);
  return i < 0 ? -1 : i;
};
const fullPilot = (): Episode | null => {
  const get = (k: string) => episodes.find((e) => e.key.toLowerCase() === k);
  const p1 = get('ep01-full-part1');
  const p2 = get('ep01-full-part2');
  if (!p1 || !p2) return null;
  const base = get('ep01');
  const act4 = get('ep01-full-act4');
  const four = actRank('ACT FOUR');
  // part2 is Act Three + tag + credits; Act Four goes between them
  const firstAfter = p2.beats.findIndex((b) => actRank(b.act) > four);
  const cut = firstAfter < 0 ? p2.beats.length : firstAfter;
  const three = p2.beats.slice(0, cut);
  const after = p2.beats.slice(cut);
  let middle: Beat[];
  if (act4 && !act4.error && act4.beats.length) middle = act4.beats;
  else {
    const last = three[three.length - 1];
    const end3 = last && last.realStart !== null ? last.realStart + (last.realDur ?? 0) : parseClock('12:31');
    middle = [
      {
        idx: 0,
        id: 'A4',
        act: 'ACT FOUR',
        kind: 'card',
        set: 'void',
        setRaw: '',
        style: 'BASE',
        shot: 'wide',
        chars: [],
        caption: `Act Four placeholder · ${Math.floor(ACT4_SEC / 60)}:${String(ACT4_SEC % 60).padStart(2, '0')}. The act is in production; its timeline (show/reel/ep01-full-act4.json) drops in here when it exists.`,
        lines: [],
        vo: '',
        onscreen: [],
        real: '',
        realStart: end3,
        realDur: ACT4_SEC,
        reelDur: ACT4_SEC,
        fx: [],
        cues: [],
        placeholder: true,
      },
    ];
  }
  const beats = [...p1.beats, ...three, ...middle, ...after].map((b, i) => ({...b, idx: i}));
  return {
    key: 'ep01-full',
    episode: 1,
    title: base?.title ?? 'ep1.0_research_preview.md',
    logline: '', // the pilot's logline names how it ends; the full-length reel opens without it
    dateSpan: base?.dateSpan ?? '',
    runtimeMin: base?.runtimeMin ?? 22,
    part: act4 && !act4.error && act4.beats.length ? 'full length' : 'full length · Act Four placeholder',
    variant: 'full-length rough animatic',
    beats,
  };
};

const marks = (ep: Episode) => {
  const tm = timeEpisode(ep);
  return [Math.round(tm.starts[0] * 0.6), ...tm.starts.map((s, i) => s + Math.floor(tm.lens[i] * 0.62))];
};

const season = episodes.filter((e) => /^ep\d+$/i.test(e.key));
const full = fullPilot();

const reelFrame = (ep: Episode, id = reelId(ep.key)): FrameDef => ({
  id,
  component: Reel,
  props: {ep, marks: marks(ep)},
  width: W,
  height: H,
  fps: FPS,
  durationInFrames: timeEpisode(ep).total,
});

// ---------------------------------------------------------------- episode reels (manifests)
const episodeFrame = (raw: unknown, key: string, id: string): FrameDef => {
  const plan = buildPlan(raw, key, episodes);
  return {id, component: EpisodeReel, props: {plan}, width: W, height: H, fps: FPS, durationInFrames: Math.max(2, plan.total)};
};
const inputManifest = (() => {
  try {
    const ip = getInputProps() as Record<string, unknown>;
    return ip && ip.reelManifest && typeof ip.reelManifest === 'object' ? ip.reelManifest : null;
  } catch {
    return null;
  }
})();

export const reelFrames: FrameDef[] = [
  ...episodes.map((ep) => reelFrame(ep)),
  ...manifests.map((m) => episodeFrame(m.raw, m.key, reelId(m.key))),
  ...(inputManifest ? [episodeFrame(inputManifest, String((inputManifest as Record<string, unknown>).key || 'episode'), 'reel-episode')] : []),
  ...(full ? [reelFrame(full, 'reel-ep01-full')] : []),
  ...(season.length
    ? [{id: 'reel-season', component: Season, props: {eps: season}, width: W, height: H, fps: FPS, durationInFrames: season.reduce((a, e) => a + timeEpisode(e).total, 0)}]
    : []),
];
