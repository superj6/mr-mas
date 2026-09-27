// MR. MAS — Ep1 Act Four · the animatic v5: LIP-SYNC (INF-LIPSYNC5; the a4p5-lipsync pass, 2026-09-27).
// Every mouth the v5 picture draws comes from here. shots5.ts's layouts only pass the result on (their `mouth:` fields).
//
// WHO shows a mouth: the lock's `face` (lock_v5.py PLAN, per shot: 'lip' = a drawn mouth track (busts, call tiles, mediums,
// reflections), 'room' = room scale (open / rest), null = none: backs, silhouettes, off-screen, POV). The framing decides,
// not the take's lip_sync flag (art-needs-v5 §1.2). A line whose face is null draws 'rest'.
// WHAT it draws: the take's own visemes (lines-v5.json, from the voiced take's phoneme alignment; lock v5 moves them onto the
// act clock from the line's first sound). Nothing is hand-keyed. Three refinements on top, all measured in
// production/act4/lipsync-v5.md:
//   1. LEAD: the picture leads the sound by LIP5.lead frames (1 = 42 ms). The animation convention (a mouth shape lands a
//      frame before its sound, so it reads as causing it); inside the broadcast tolerance for sound late (EBU R37: +40 ms
//      early / -60 ms late); the stick reel's speaking highlight also starts a frame early (Reel.tsx start - 1). A line's
//      timing, its words and every story mark are untouched: only the drawing is looked up a frame ahead.
//   2. HOLDS: no mouth drawing is held for one frame (the show's 2s): a one-frame shape merges into its neighbour; a
//      one-frame M (lips pressed: m, b, p) keeps two frames, taken from the next shape when that has three or more.
//   3. ROOM FLAP: at room scale a figure has two mouths, so `open while the viseme isn't rest/M` (v4's roomMouth) held
//      mouths open for up to 2 s at a time (S7.07 Terb 51 f, S4.08 Neleh 50 f: a mouth hanging open, not talking).
//      roomTrack5 flaps it on the take's syllables instead: A / O open, E open when it lasts 3 frames or more (E is also
//      most consonants), M / rest shut; an open run longer than LIP5.room.maxOpen shuts for LIP5.room.gap frames at its
//      first viseme change that leaves LIP5.room.minOpen open either side (or mid-run on a single long shape, a syllable
//      split); then no open or shut hold under 2 frames.
// Mouths that are NOT the takes' (kept as they were): S1.07 Alyi's silent speaking ring on his side ("no words reach us":
// silentMouth5, held drawings on 4s); Mada's spinner voice on the blueprint (S1.04: talking5, the spinner turns while he
// speaks); a take with no mouth track (none is on camera: lock check) would flap on 4s.
import type {Viseme} from '../../../../shared/pixel/cast/talk';
import type {ShotV5, LineV5} from './data-v5';

export const LIP5 = {
  /** frames the mouth drawing leads its sound (0 = drawn on the sound's own frame, as lock v5 places it) */
  lead: 1,
  /** the shortest hold of any mouth drawing, frames (2 = on 2s) */
  minHold: 2,
  /** the room-scale flap (open / rest): an open hold longer than maxOpen shuts for `gap` at a syllable, leaving at least
   *  minOpen open either side */
  room: {maxOpen: 8, gap: 2, minOpen: 3},
};

// ================================================================== lines
/** `who`'s line sounding at shot frame k (any face): speaking rings, spinners, gaze and pose switches read this */
export const lineAt5 = (sh: ShotV5, k: number, who: string): LineV5 | null =>
  sh.lines.find((l) => l.who === who && l.kind !== 'post' && k >= l.s && k < l.e) ?? null;
/** someone is speaking now (the call's speaking ring, a spinner's voice): face does not matter, no lead */
export const talking5 = (sh: ShotV5, k: number, who: string) => lineAt5(sh, k, who) !== null;
/** the faced line whose mouth is drawn at k: looked up LIP5.lead frames ahead */
const mouthLine = (sh: ShotV5, k: number, who: string): [LineV5, number] | null => {
  const kk = k + LIP5.lead;
  const l = sh.lines.find((x) => x.who === who && x.kind !== 'post' && !!x.face && kk >= x.s && kk < x.e);
  return l ? [l, kk - l.s] : null;
};

// ================================================================== the tracks (per line, cached)
type Run<T> = [T, number];
const runsOf = <T>(v: T[]): Array<Run<T>> => {
  const out: Array<Run<T>> = [];
  for (const s of v) { const r = out[out.length - 1]; if (r && r[0] === s) r[1]++; else out.push([s, 1]); }
  return out;
};
const unruns = <T>(r: Array<Run<T>>): T[] => r.flatMap(([s, n]) => new Array<T>(n).fill(s));
/** the take's keys ([frame from s, viseme]) as one viseme per frame of the line */
const perFrame = (l: LineV5): Viseme[] => {
  const L = Math.max(0, l.e - l.s), v = new Array<Viseme>(L).fill('rest');
  if (!l.mouth.length) { for (let t = 0; t < L; t++) v[t] = (t >> 2) % 2 ? 'A' : 'E'; return v; } // no track: a held flap on 4s
  let m: Viseme = 'rest', j = 0;
  for (let t = 0; t < L; t++) { while (j < l.mouth.length && l.mouth[j][0] <= t) m = l.mouth[j++][1] as Viseme; v[t] = m; }
  return v;
};
/** refinement 2: no drawing held under LIP5.minHold frames (a short M keeps its closure, borrowed from the next shape) */
const holdFix = <T>(v: T[], keep?: (s: T) => boolean): T[] => {
  const min = LIP5.minHold;
  if (min <= 1) return v;
  const runs = runsOf(v), out: Array<Run<T>> = [];
  for (let i = 0; i < runs.length; i++) {
    const [s, n] = runs[i];
    if (n < min && runs.length > 1) {
      const nx = runs[i + 1];
      if (keep?.(s) && nx && nx[1] >= min + 1) { const give = Math.min(min - n, nx[1] - min); nx[1] -= give; out.push([s, n + give]); continue; }
      if (out.length) out[out.length - 1][1] += n; else if (nx) nx[1] += n; else out.push([s, n]);
      continue;
    }
    const last = out[out.length - 1];
    if (last && last[0] === s) last[1] += n; else out.push([s, n]);
  }
  return unruns(out);
};
const LIP_CACHE = new WeakMap<LineV5, Viseme[]>();
/** the drawn visemes, one per frame of the line (frame 0 = its first sound) */
export const lipTrack5 = (l: LineV5): Viseme[] => {
  let v = LIP_CACHE.get(l);
  if (!v) { v = holdFix(perFrame(l), (s) => s === 'M'); LIP_CACHE.set(l, v); }
  return v;
};
const ROOM_CACHE = new WeakMap<LineV5, boolean[]>();
/** refinement 3: the room-scale flap, one open (true) / shut per frame of the line */
export const roomTrack5 = (l: LineV5): boolean[] => {
  const hit = ROOM_CACHE.get(l);
  if (hit) return hit;
  const v = lipTrack5(l), L = v.length, {maxOpen, gap, minOpen} = LIP5.room;
  const o = unruns(runsOf(v).map(([s, n]): Run<boolean> => [s === 'A' || s === 'O' || (s === 'E' && n >= 3), n]));
  for (let t = 0; t < L;) {
    if (!o[t]) { t++; continue; }
    let u = t; while (u < L && o[u]) u++;
    let start = t;
    while (u - start > maxOpen) {
      let x = -1;
      for (let c = start + minOpen; c <= u - gap - minOpen; c++) if (v[c] !== v[c - 1]) { x = c; break; }
      if (x < 0 && u - start >= 2 * minOpen + gap + 2) x = start + Math.floor((u - start - gap) / 2); // one long shape
      if (x < 0) break;
      for (let y = x; y < x + gap; y++) o[y] = false;
      start = x + gap;
    }
    t = u;
  }
  const r = holdFix(o);
  ROOM_CACHE.set(l, r);
  return r;
};

// ================================================================== what the layouts call
/** a faced line of `who` is being drawn at k (the lead included): for a figure whose idle mouth is not rest (a smile) */
export const lipOn5 = (sh: ShotV5, k: number, who: string) => mouthLine(sh, k, who) !== null;
/** the viseme to draw for `who` at shot frame k: the take's track where this framing shows their mouth (face), else rest */
export const mouth5 = (sh: ShotV5, k: number, who: string): Viseme => {
  const hit = mouthLine(sh, k, who);
  return hit ? lipTrack5(hit[0])[hit[1]] ?? 'rest' : 'rest';
};
/** room scale: open / rest, flapped on the take's syllables (roomTrack5) */
export const roomMouth5 = (sh: ShotV5, k: number, who: string): 'open' | 'rest' => {
  const hit = mouthLine(sh, k, who);
  return hit && roomTrack5(hit[0])[hit[1]] ? 'open' : 'rest';
};
/** a room-scale figure with three mouths (Mario, cast/mario.ts: 0 shut, 1 small, 2 wide): the room flap decides open or
 *  shut, the take's viseme how wide (A / O wide, anything else small) */
export const room3Mouth5 = (sh: ShotV5, k: number, who: string): 0 | 1 | 2 => {
  const hit = mouthLine(sh, k, who);
  return hit ? room3Track5(hit[0])[hit[1]] ?? 0 : 0;
};
const ROOM3_CACHE = new WeakMap<LineV5, Array<0 | 1 | 2>>();
/** the three-mouth room track: shut where the flap is shut, else 2 on A / O and 1 on anything else; then no hold under
 *  LIP5.minHold (a flap edge can cut a viseme to one frame) */
export const room3Track5 = (l: LineV5): Array<0 | 1 | 2> => {
  let r = ROOM3_CACHE.get(l);
  if (!r) {
    const v = lipTrack5(l), o = roomTrack5(l);
    r = holdFix(o.map((op, t): 0 | 1 | 2 => (!op ? 0 : v[t] === 'A' || v[t] === 'O' ? 2 : 1)));
    ROOM3_CACHE.set(l, r);
  }
  return r;
};
/** the board's call tiles (drawBoardCall): every tile's mouth */
export const boardMouths5 = (sh: ShotV5, k: number) => ({alyi: mouth5(sh, k, 'ALYI'), neleh: mouth5(sh, k, 'NELEH'), rima: mouth5(sh, k, 'RIMA')});
/** a silent talking mouth in a tile (his side, S1.07: "no words reach us"): held drawings on 4s, not a regular flap */
const SILENT: Array<'open' | 'rest'> = ['open', 'open', 'rest', 'open', 'rest', 'rest', 'open', 'rest'];
export const silentMouth5 = (kk: number) => SILENT[Math.floor(kk / 4) % SILENT.length];

// ================================================================== the v4 adapter's tracks
/** the mouth track a reused v4 layout gets for a v5 line (its mouth() helper reads [frame from s, viseme] keys):
 *  - face null: one 'rest' key (an EMPTY track would make v4's helper flap)
 *  - faced: lipTrack5 (the hold fix), keyed LIP5.lead frames early. v4's helper only finds a line from its first sound,
 *    so in a reused layout the lead starts from the line's second shape; every later shape leads as in v5's own layouts */
export const v4Track5 = (l: LineV5): Array<[number, string]> => {
  if (!l.face) return [[0, 'rest']];
  const v = lipTrack5(l), out: Array<[number, string]> = [];
  for (let t = 0; t < v.length; t++) {
    const s = v[Math.min(v.length - 1, t + LIP5.lead)] ?? 'rest';
    const shape = t + LIP5.lead >= v.length ? 'rest' : s;
    if (!out.length || out[out.length - 1][1] !== shape) out.push([t, shape]);
  }
  return out.length ? out : [[0, 'rest']];
};

// ================================================================== the record (the report and the handoff read it)
export interface LipPair5 { shot: string; who: string; face: 'lip' | 'room'; lines: string[]; frames: number; changesPerS: number; shortestHold: number; longestOpen: number }
/** every faced speaker-in-shot pair and its drawn track's numbers (from the tracks, not from pixels) */
export const lipPairs5 = (shots: ShotV5[]): LipPair5[] => {
  const out: LipPair5[] = [];
  for (const sh of shots) {
    const who = [...new Set(sh.lines.filter((l) => l.face && l.kind !== 'post').map((l) => l.who))];
    for (const w of who) {
      const ls = sh.lines.filter((l) => l.who === w && l.face && l.kind !== 'post');
      const face = ls[0].face as 'lip' | 'room';
      let frames = 0, changes = 0, shortest = 1e9, longest = 0;
      for (const l of ls) {
        const tr: Array<string | boolean> = face === 'room' ? roomTrack5(l) : lipTrack5(l);
        const k0 = Math.max(0, l.s), k1 = Math.min(sh.e - sh.s, l.e); // the part of the line inside this shot
        const seg = tr.slice(k0 - l.s, k1 - l.s);
        if (!seg.length) continue;
        const rr = runsOf(seg);
        frames += seg.length; changes += rr.length - 1;
        rr.slice(1, -1).forEach(([, n]) => { shortest = Math.min(shortest, n); });
        rr.forEach(([s, n]) => { if (s === true || (typeof s === 'string' && s !== 'rest' && s !== 'M')) longest = Math.max(longest, n); });
      }
      out.push({shot: sh.id, who: w, face, lines: ls.map((l) => l.id), frames, changesPerS: frames ? +(changes / (frames / 24)).toFixed(2) : 0,
        shortestHold: shortest === 1e9 ? 0 : shortest, longestOpen: longest});
    }
  }
  return out;
};
