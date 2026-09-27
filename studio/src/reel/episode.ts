// EPISODE REELS: one timeline for a whole episode (README.md beside this file).
// An episode MANIFEST (JSON, `"kind": "episode-manifest"`) lists chapters in play order. Each chapter is one of:
//   reel   a stick-reel timeline (show/reel/<key>.json, synced to data/), whole or sliced by act / beat ids
//   card   a short in-show card made from the manifest itself (onscreen text, caption, duration)
//   video  a real video file played in a slot (the finished intro): full-frame at assembly, with its own audio
// plus a title chapter (the reel's own 3 s title) and, when `actCards` is "slate", a reviewer slate before each act.
// buildPlan() turns a manifest + the loaded timelines into an EpisodePlan: every chapter on one episode clock, the
// two-row bar, name reveals carried across chapters, and the AUDIO PLAN (clips, per-sequence temp beds, gates and
// speech for ducking) that tools/mixer.mjs executes. Everything is defensive: a missing timeline, beat or field
// becomes a warning and a stand-in, never a crash. Plans are plain JSON (they travel as composition props).
import {FPS, normalizeEpisode, parseClock, timeEpisode, TITLE_SEC, type Beat, type Episode} from './schema';

export interface Seg {label: string; from: number; to: number}
export type ChapterKind = 'title' | 'reel' | 'video' | 'slate';
export interface VideoSpec {
  src: string; // repo-relative path of the real file
  in: number; // seconds into the file
  fit: 'full' | 'inset'; // full = spliced full-frame by tools/episode.mjs; inset = played inside the picture frame
  media: string | null; // staticFile() path when the tool staged the file into the bundle (else a stand-in is drawn)
  note: string;
}
export interface Chapter {
  id: string;
  kind: ChapterKind;
  label: string; // "ACT ONE"
  sub: string; // subtitle for act cards / slates
  act: string;
  from: number; // episode frame
  dur: number; // frames
  source: string; // where it came from (timeline key, "manifest", a file)
  ep?: Episode; // kind reel: its own timeline (sliced, re-indexed)
  video?: VideoSpec;
  known: string[]; // ids named earlier in the episode (dialogue reels name them from the chapter's first frame)
  bed: boolean; // false = the temp bed is gated off here (the chapter brings its own sound)
  audio: string; // one-line description of the chapter's sound, for the margin and the report
}
/** A programmatic temp bed: "chords" = a soft sustained pad in the theme's F-minor world (reelbed.py's chord table),
 *  "room" = filtered noise standing in for a room bed. */
export interface PadSpec {type: 'chords' | 'room'; chords: string[]; bpm: number; barsPerChord: number; seed: number}
/** A temp-bed segment (seconds, episode clock). The source plays `in` at `from`; it crossfades (equal power) over xfIn
 *  centred on `from` and xfOut centred on `to`. src null + pad = a programmatic pad (the cue has no render yet). */
export interface BedSeg {
  label: string;
  cue: string;
  src: string | null;
  pad: PadSpec | null;
  in: number;
  loop: [number, number] | 'cue' | 'file' | 'none';
  lufs: number | null; // target loudness of the bed itself (un-ducked); null = use gain as is
  gain: number; // dB, applied after the lufs match
  from: number;
  to: number;
  xfIn: number;
  xfOut: number;
}
export interface AudioClip {
  role: 'chapter' | 'video' | 'dialogue';
  label: string;
  src: string; // repo-relative
  at: number; // episode seconds where the file's `in` point plays
  in: number;
  dur: number | null; // null = to the end of the file
  gain: number; // dB
  fadeIn: number;
  fadeOut: number;
  mono: boolean; // a mono take laid dual-mono
}
export interface MixSpec {
  lufs: number | null; // master target (integrated, BS.1770, measured by the mixer); null (default) = leave the sum as is,
  //                      so a chapter's own premix and a video slot's master keep their levels
  floor: number | null; // LUFS of a room-tone floor under every bed stretch (no digital black between cues); null = off
  ceiling: number; // dBFS sample-peak ceiling (the mixer's limiter)
  duck: number; // dB, beds under speech
  duckPre: number; // s the duck starts before a line
  duckHold: number; // s: gaps shorter than this stay ducked
  bedLufs: number; // default bed loudness (un-ducked)
  xfade: number; // default bed crossfade, s
  dialogueGain: number; // dB per take (dual mono)
}
export interface EpisodePlan {
  kind: 'episode-plan';
  key: string;
  episode: number | null;
  title: string;
  variant: string;
  dateSpan: string;
  runtimeMin: number;
  fps: number;
  total: number; // frames
  chapters: Chapter[];
  top: Seg[]; // bar rows (frames)
  sub: Seg[];
  beds: BedSeg[];
  clips: AudioClip[];
  speech: [number, number][]; // seconds: where recorded speech plays (beds duck)
  gates: {from: number; to: number; edge: number; label: string}[]; // seconds: bed off (edge = fade length)
  mix: MixSpec;
  actCardSec: number;
  warnings: string[];
}

// ---------------------------------------------------------------- helpers
const str = (v: unknown): string => (typeof v === 'string' ? v : typeof v === 'number' ? String(v) : '');
const num = (v: unknown): number | null => {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return Number(v);
  return null;
};
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : v === undefined || v === null || v === '' ? [] : [v]);
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
const up = (v: unknown) => str(v).toUpperCase().trim();
const low = (v: unknown) => str(v).toLowerCase().trim();

export const isManifest = (raw: unknown, key = ''): boolean => /\.manifest$/i.test(key) || obj(raw).kind === 'episode-manifest';

const ACT_LABEL: Record<string, string> = {coldopen: 'COLD OPEN', intro: 'INTRO', card: 'CARD', act1: 'ACT ONE', act2: 'ACT TWO', act3: 'ACT THREE', act4: 'ACT FOUR', act5: 'ACT FIVE', tag: 'TAG', credits: 'CREDITS', outro: 'OUTRO'};
const ACT_NAMES = new Set(['ACT ONE', 'ACT TWO', 'ACT THREE', 'ACT FOUR', 'ACT FIVE']);

/** Scene groups of a caption reel (beat ids "5.01", "5.02" … → "sc 5"), for the bar's lower row. */
const sceneOf = (b: Beat) => {
  const m = b.id.match(/^(\d+[A-Z]?)\./i);
  return m ? `sc ${m[1]}` : b.id.replace(/\.\d+$/, '');
};

// ---------------------------------------------------------------- slicing a timeline into a chapter
const sliceEpisode = (src: Episode, spec: Record<string, unknown>, warn: (w: string) => void): Episode => {
  const acts = arr(spec.acts ?? spec.act).map(up).filter(Boolean);
  const only = arr(spec.beats).map(str).filter(Boolean);
  const range = obj(spec.range);
  const excl = new Set(arr(spec.exclude).map(str));
  let keep = src.beats.map((_, i) => i);
  if (acts.length) keep = keep.filter((i) => acts.includes(src.beats[i].act));
  if (only.length) {
    const ids = new Set(only);
    keep = keep.filter((i) => ids.has(src.beats[i].id));
    for (const id of only) if (!src.beats.some((b) => b.id === id)) warn(`beat ${id} not in ${src.key}`);
  }
  if (range.first || range.last) {
    const a = range.first ? src.beats.findIndex((b) => b.id === str(range.first)) : 0;
    const z = range.last ? src.beats.findIndex((b) => b.id === str(range.last)) : src.beats.length - 1;
    if (a < 0 || z < 0) warn(`range ${str(range.first)}..${str(range.last)} not found in ${src.key}`);
    keep = keep.filter((i) => i >= Math.max(0, a) && i <= (z < 0 ? src.beats.length - 1 : z));
  }
  keep = keep.filter((i) => !excl.has(src.beats[i].id));
  if (!keep.length) warn(`no beats left in ${src.key} after the chapter's filters`);
  const durs = obj(spec.durs);
  const newIdx = new Map(keep.map((old, k) => [old, k]));
  const beats: Beat[] = keep.map((old, k) => {
    const b = src.beats[old];
    const d = num(durs[b.id]);
    const nb: Beat = {...b, idx: k, ...(d !== null && d > 0 ? {reelDur: d} : {})};
    if (b.dlg) {
      // the beat that started this beat's sequence may have been sliced off: fall back to the chapter's first beat
      const ss = b.dlg.seqStart >= 0 ? newIdx.get(b.dlg.seqStart) ?? 0 : -1;
      nb.dlg = {...b.dlg, seqStart: ss};
    }
    return nb;
  });
  if (!beats.length) return {...src, beats: [cardBeat({id: `${src.key}-empty`, onscreen: ['NO BEATS'], caption: `chapter filters left no beats in ${src.key}`, reelDur: 3}, src.episode)]};
  return {...src, beats};
};

const cardBeat = (o: Record<string, unknown>, epNo: number | null): Beat =>
  normalizeEpisode({episode: epNo, beats: [{kind: 'card', set: 'void', ...o}]}, 'card').beats[0];

// ---------------------------------------------------------------- the manifest → the plan
export const buildPlan = (rawManifest: unknown, key: string, timelines: Episode[]): EpisodePlan => {
  const m = obj(rawManifest);
  const warnings: string[] = [];
  const epNo = num(m.episode);
  const find = (k: string) => timelines.find((e) => e.key.toLowerCase() === k.toLowerCase()) ?? null;
  const base = epNo !== null ? find(`ep${String(epNo).padStart(2, '0')}`) : null;
  const titleSec = num(m.titleCard) ?? TITLE_SEC;
  const actCards = low(m.actCards) || 'margin';
  const slateSec = num(m.slateSec) ?? 1.5;
  const actCardSec = actCards === 'off' ? 0 : num(m.actCardSec) ?? 4;
  const mixO = obj(m.mix);
  const mix: MixSpec = {
    lufs: num(mixO.lufs),
    floor: mixO.floor === null ? null : num(mixO.floor) ?? -50,
    ceiling: num(mixO.ceiling) ?? -1,
    duck: num(mixO.duck) ?? -10,
    duckPre: num(mixO.duckPre) ?? 0.25,
    duckHold: num(mixO.duckHold) ?? 2.5,
    bedLufs: num(mixO.bedLufs) ?? -26,
    xfade: num(mixO.xfade) ?? 2,
    dialogueGain: num(mixO.dialogueGain) ?? -3,
  };

  const chapters: Chapter[] = [];
  const clips: AudioClip[] = [];
  const speech: [number, number][] = [];
  const gates: EpisodePlan['gates'] = [];
  let at = 0; // frames
  const push = (c: Omit<Chapter, 'from' | 'known'>) => {
    const ch: Chapter = {...c, from: at, known: [], dur: Math.max(1, Math.round(c.dur))};
    chapters.push(ch);
    at += ch.dur;
    return ch;
  };

  if (titleSec > 0) push({id: 'title', kind: 'title', label: 'TITLE', sub: '', act: 'TITLE', dur: titleSec * FPS, source: 'manifest', bed: true, audio: 'silence (the reel slate)'});

  arr(m.chapters).forEach((raw, ci) => {
    const c = obj(raw);
    const id = str(c.id) || `ch${ci + 1}`;
    const warn = (w: string) => warnings.push(`${id}: ${w}`);
    const kind = low(c.kind) || (c.src && !c.from ? 'video' : c.from ? 'reel' : 'card');
    const label = up(c.label) || ACT_LABEL[id.toLowerCase()] || up(c.act) || id.toUpperCase();
    const act = up(c.act) || label;
    const sub = str(c.sub);
    const au = obj(c.audio);
    const own = c.audio === 'own' || au.own === true;
    const bedOn = c.bed === undefined ? !(own || !!au.src) : c.bed !== false && c.bed !== 'off';
    if (actCards === 'slate' && c.slate !== false && (ACT_NAMES.has(act) || c.slate === true))
      push({id: `${id}-slate`, kind: 'slate', label, sub, act, dur: slateSec * FPS, source: 'manifest', bed: bedOn, audio: 'the bed runs on'});

    if (kind === 'video') {
      const src = str(c.src);
      const vin = num(c.in) ?? 0;
      const dur = num(c.dur);
      if (!src) warn('video chapter has no src');
      if (dur === null) warn('video chapter has no dur (seconds); 30 s assumed');
      const d = dur ?? 30;
      const media = str(obj(obj(m._media)[id]).path) || null; // staged by tools/episode.mjs
      const gain = num(au.gain) ?? 0;
      const tail = Math.max(0, num(au.tail) ?? 0);
      const ch = push({
        id,
        kind: 'video',
        label,
        sub,
        act,
        dur: d * FPS,
        source: src,
        video: {src, in: vin, fit: low(c.fit) === 'inset' ? 'inset' : 'full', media, note: str(c.note)},
        bed: bedOn,
        audio: own ? `its own sound${gain ? ` at ${gain > 0 ? '+' : ''}${gain} dB` : ''}; hard cut in, ${tail ? `${tail} s tail out` : 'hard cut out'}` : 'silent (bed)',
      });
      // its sound: the file's own track, or (audio.src) the master WAV that track was encoded from, at the same offset
      if (own) clips.push({role: 'video', label, src: str(au.src) || src, at: ch.from / FPS, in: num(au.in) ?? vin, dur: d + tail, gain, fadeIn: num(au.fadeIn) ?? 0.03, fadeOut: tail > 0 ? tail : num(au.fadeOut) ?? 0.03, mono: false});
    } else if (kind === 'card') {
      const d = num(c.dur) ?? 2;
      const ep: Episode = {
        key: id,
        episode: epNo,
        title: str(m.title) || base?.title || '',
        logline: '',
        dateSpan: '',
        runtimeMin: num(m.runtimeMin) ?? 22,
        beats: [cardBeat({id: str(c.beatId) || `${id}.01`, act, onscreen: arr(c.onscreen), caption: str(c.caption) || `${label} card`, reelDur: d, cues: arr(c.cues), chars: arr(c.chars)}, epNo)],
      };
      push({id, kind: 'reel', label, sub, act, dur: timeEpisode(ep, 0).total, source: 'manifest', ep, bed: bedOn, audio: bedOn ? 'the temp bed' : 'its own sound'});
    } else {
      const srcKey = str(c.from);
      const src = find(srcKey);
      let ep: Episode;
      if (!src) {
        warn(`timeline "${srcKey}" not found (show/reel/${srcKey}.json, synced?)`);
        ep = {key: srcKey || id, episode: epNo, title: '', logline: '', dateSpan: '', runtimeMin: 22, beats: [cardBeat({id: `${id}.missing`, act, onscreen: ['TIMELINE MISSING'], caption: `show/reel/${srcKey}.json is missing`, reelDur: num(c.dur) ?? 5}, epNo)]};
      } else ep = sliceEpisode(src, c, warn);
      if (src?.error) warn(`timeline ${srcKey} has a data error: ${src.error}`);
      ep = {...ep, title: str(m.title) || ep.title};
      const ch = push({id, kind: 'reel', label, sub, act, dur: timeEpisode(ep, 0).total, source: srcKey, ep, bed: bedOn, audio: ''});
      const t0 = ch.from / FPS;
      if (au.src) {
        const gain = num(au.gain) ?? 0;
        clips.push({role: 'chapter', label, src: str(au.src), at: t0, in: num(au.in) ?? 0, dur: ch.dur / FPS, gain, fadeIn: num(au.fadeIn) ?? 0.01, fadeOut: num(au.fadeOut) ?? 0.01, mono: false});
        ch.audio = `its own mix: ${str(au.src)} from ${num(au.in) ?? 0} s${gain ? `, ${gain} dB` : ''}`;
      } else if (ep.dialogueReel && au.takes !== false) {
        // lay every recorded take (the file is laid at beatStart + t - in, as bed.py does); beds duck under them
        const tm = timeEpisode(ep, 0);
        let n = 0;
        ep.beats.forEach((b, i) =>
          (b.dlg?.lines ?? []).forEach((l) => {
            if (!l.audio) return;
            const s0 = t0 + tm.starts[i] / FPS + l.t;
            clips.push({role: 'dialogue', label: l.id || l.who, src: l.audio, at: s0 - l.fileIn, in: 0, dur: null, gain: mix.dialogueGain, fadeIn: 0, fadeOut: 0, mono: true});
            speech.push([s0, s0 + l.dur]);
            n++;
          }),
        );
        ch.audio = `${n} recorded take(s) over the temp bed`;
      } else ch.audio = bedOn ? 'the temp bed (no recorded takes yet)' : 'silent';
    }
  });

  // the bed is gated off where a chapter brings its own sound
  for (const ch of chapters) if (!ch.bed) gates.push({from: ch.from / FPS, to: (ch.from + ch.dur) / FPS, edge: ch.kind === 'video' ? 0.03 : 0.5, label: ch.label});

  // ------------------------------------------------ bar rows
  const top: Seg[] = chapters.map((c) => ({label: c.kind === 'slate' ? '' : c.label, from: c.from, to: c.from + c.dur}));
  const sub: Seg[] = [];
  for (const ch of chapters) {
    if (ch.kind === 'video') sub.push({label: ch.label, from: ch.from, to: ch.from + ch.dur});
    if (ch.kind !== 'reel' || !ch.ep) continue;
    const tm = timeEpisode(ch.ep, 0);
    let cur: Seg | null = null;
    ch.ep.beats.forEach((b, i) => {
      const lab = b.dlg ? (b.dlg.seq && !b.dlg.seq.sub ? b.dlg.seq.id : null) : sceneOf(b);
      const f0 = ch.from + tm.starts[i];
      if (lab !== null && (!cur || cur.label !== lab || b.dlg)) {
        if (cur) cur.to = f0;
        cur = {label: lab, from: f0, to: ch.from + ch.dur};
        sub.push(cur);
      }
    });
    if (cur) (cur as Seg).to = ch.from + ch.dur;
  }

  // ------------------------------------------------ name reveals carried across chapters
  const known = new Set<string>(arr(m.known).map(low));
  for (const ch of chapters) {
    ch.known = [...known];
    if (!ch.ep) continue;
    for (const b of ch.ep.beats) {
      if (b.dlg) b.dlg.names.forEach((n) => known.add(n.id));
      else {
        // a caption reel labels everyone by name from their first frame
        b.chars.forEach((c) => known.add(c.id));
        b.lines.forEach((l) => l.who && known.add(l.who));
      }
    }
    Object.entries(ch.ep.cast ?? {}).forEach(([id, c]) => c?.known && known.add(id));
  }

  // ------------------------------------------------ per-sequence temp beds
  const chAt = (id: string) => chapters.find((c) => c.id === id) ?? null;
  const anchor = (a: Record<string, unknown>, what: string): number | null => {
    const abs = parseClock(a.atEp);
    if (abs !== null) return abs;
    const ch = chAt(str(a.chapter));
    if (!ch) {
      warnings.push(`${what}: chapter "${str(a.chapter)}" not in the manifest`);
      return null;
    }
    let f = ch.from;
    if ((a.beat || a.seq) && ch.ep) {
      const tm = timeEpisode(ch.ep, 0);
      const i = ch.ep.beats.findIndex((b) => (a.beat ? b.id === str(a.beat) : b.dlg?.seq?.id === str(a.seq)));
      if (i < 0) warnings.push(`${what}: ${a.beat ? 'beat ' + str(a.beat) : 'seq ' + str(a.seq)} not in chapter ${ch.id}`);
      else f += tm.starts[i];
    }
    return f / FPS + (num(a.at) ?? 0);
  };
  const total = at;
  const rawBeds = arr(m.beds)
    .map((r, i) => {
      const b = obj(r);
      const cue = str(b.cue);
      const what = `bed ${i + 1}${cue ? ' (' + cue + ')' : ''}`;
      const from = anchor(b, what);
      if (from === null) return null;
      const until = b.until ? anchor(obj(b.until), `${what} until`) : null;
      const src = str(b.src) || null;
      const padO = b.pad === true ? {} : b.pad ? obj(b.pad) : null;
      const pad: PadSpec | null =
        padO || !src ? {type: low(padO?.type) === 'room' ? 'room' : 'chords', chords: arr(padO?.chords).map(str).filter(Boolean), bpm: num(padO?.bpm) ?? 72, barsPerChord: num(padO?.barsPerChord) ?? 2, seed: num(padO?.seed) ?? i + 1} : null;
      const loopRaw = b.loop;
      const loop: BedSeg['loop'] = Array.isArray(loopRaw) && loopRaw.length === 2 && num(loopRaw[0]) !== null && num(loopRaw[1]) !== null ? [num(loopRaw[0])!, num(loopRaw[1])!] : loopRaw === false || loopRaw === 'none' ? 'none' : loopRaw === 'file' ? 'file' : 'cue';
      const label = str(b.label) || (src && !b.pad ? cue || src.replace(/^.*\//, '') : pad?.type === 'room' ? 'room-tone stand-in' : `temp pad${cue ? ' (' + cue + ' not rendered)' : ''}`);
      return {
        label,
        cue,
        src: src && !b.pad ? src : null,
        pad: src && !b.pad ? null : pad,
        in: num(b.in) ?? 0,
        loop,
        lufs: b.lufs === null ? null : num(b.lufs) ?? mix.bedLufs,
        gain: num(b.gain) ?? 0,
        from,
        to: until ?? NaN,
        xfIn: Math.max(0.02, num(b.xfade) ?? mix.xfade),
        xfOut: 0,
        stop: low(b.stop),
      };
    })
    .filter((b): b is BedSeg & {stop: string} => !!b)
    .sort((a, b) => a.from - b.from);
  const beds: BedSeg[] = rawBeds.map((b, i) => {
    const next = rawBeds[i + 1];
    const to = Number.isFinite(b.to) ? b.to : next ? next.from : total / FPS;
    const xfOut = b.stop === 'hard' ? 0.02 : next && Math.abs(next.from - to) < 0.01 ? next.xfIn : Math.max(0.02, b.stop === 'fade' ? mix.xfade : b.xfIn);
    const {stop: _s, ...rest} = b;
    return {...rest, to, xfOut};
  });
  for (const b of beds) if (gates.some((g) => b.from >= g.from && b.from < g.to)) warnings.push(`bed ${b.label} starts inside ${gates.find((g) => b.from >= g.from && b.from < g.to)!.label}, where the bed is gated off`);

  const title = str(m.title) || base?.title || key;
  return {
    kind: 'episode-plan',
    key,
    episode: epNo,
    title,
    variant: str(m.variant) || 'full-episode stick reel',
    dateSpan: str(m.dateSpan) || base?.dateSpan || '',
    runtimeMin: num(m.runtimeMin) ?? base?.runtimeMin ?? 22,
    fps: FPS,
    total,
    chapters,
    top,
    sub,
    beds,
    clips,
    speech: speech.sort((a, b) => a[0] - b[0]),
    gates,
    mix,
    actCardSec,
    warnings,
  };
};
