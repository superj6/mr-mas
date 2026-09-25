// Registers one composition per synced reel file (src/reel/data/*.json, copied from show/reel/ by sync.mjs)
// plus `reel-season`, every epNN back to back. Loaded at bundle time via require.context.
import type {FrameDef} from '../shared/frame-def';
import {FPS, H, normalizeEpisode, timeEpisode, W, type Episode} from './schema';
import {Reel, Season} from './Reel';

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
      out.push(normalizeEpisode(ctx(k), key));
    } catch (e) {
      out.push(normalizeEpisode({_error: String(e), title: key}, key));
    }
  }
  const isEp = (e: Episode) => /^ep\d+$/i.test(e.key);
  return out.sort((a, b) => Number(isEp(b)) - Number(isEp(a)) || (a.episode ?? 99) - (b.episode ?? 99) || a.key.localeCompare(b.key));
};

export const reelId = (key: string) => 'reel-' + key.replace(/^_+/, '').toLowerCase().replace(/[^a-z0-9-]+/g, '-');

export const episodes = load();

const marks = (ep: Episode) => {
  const tm = timeEpisode(ep);
  return [Math.round(tm.starts[0] * 0.6), ...tm.starts.map((s, i) => s + Math.floor(tm.lens[i] * 0.62))];
};

const season = episodes.filter((e) => /^ep\d+$/i.test(e.key));

export const reelFrames: FrameDef[] = [
  ...episodes.map((ep) => ({
    id: reelId(ep.key),
    component: Reel,
    props: {ep, marks: marks(ep)},
    width: W,
    height: H,
    fps: FPS,
    durationInFrames: timeEpisode(ep).total,
  })),
  ...(season.length
    ? [{id: 'reel-season', component: Season, props: {eps: season}, width: W, height: H, fps: FPS, durationInFrames: season.reduce((a, e) => a + timeEpisode(e).total, 0)}]
    : []),
];
