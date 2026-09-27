// REEL schema: the contract between the writers (show/reel/epNN.json) and the generator.
// Everything here is defensive: any field may be missing, misspelt or the wrong type, and the reel still renders.
//
// WHAT RENDERS WHERE (the reel separates the show from the notes about it):
//   inside the 16:9 picture  = rough stand-ins for what appears in the show: set, figures, props, style/kind
//                              treatments, fx, and in-world text (onscreen[]: name cards, posts, signs, chyrons,
//                              titles; "RAIL: …" renders as the date chyron, "TICKER: …" as a ticker band,
//                              "UI: …" as a UI button, other device prefixes are dropped)
//   amber margin (notes)     = id, act, kind, style, shot/set, fx, timecodes, realStart/realDur, real, caption,
//                              cues (music/sfx), character name labels, dialogue (lines[] and vo) and the act bar.
//   Dialogue never renders inside the picture: it plays in the dialogue strip under it, speaker-labelled;
//   Mas's V.O. is labelled "mas (v.o.)", lowercase italic.
//
// LINE TIMING: lines[].t (alias "at") is when the line starts, measured from the start of its beat.
//   - If ANY line in the beat has t > 1, every t in that beat is SECONDS (the full-length timelines,
//     show/reel/ep01-full-part*.json, time lines this way: {"t": 2.8} = 2.8 s into the beat).
//   - Otherwise every t in the beat is a FRACTION of the beat (0.5 = halfway). A beat whose lines all sit
//     at t <= 1 is read as fractions even when the beat is longer than 3 s, so to put the only line of a
//     long beat at 0.5 s, write any other line's t in seconds or write the one line as a fraction (0.5 / reelDur).
//   - No t: lines are spread evenly across the beat. Resolved starts are clamped to 0..95% of the beat.
//
// SPECULATIVE: `speculative` (episode) is accepted and kept for the writers' own tracking but is never rendered,
// and speculation labels in captions, cards, loglines, date spans and real tags ("SPECULATIVE · …", "(speculative)",
// "EVERYTHING AFTER THIS IS SPECULATION.") are dropped at render time: the reel plays as one continuous plot.
export const FPS = 24;
export const W = 1280;
export const H = 720;
export const TITLE_SEC = 3;
export const TITLE_FRAMES = TITLE_SEC * FPS;

export const ACTS = ['INTRO', 'COLD OPEN', 'ACT ONE', 'ACT TWO', 'ACT THREE', 'ACT FOUR', 'ACT FIVE', 'TAG', 'CREDITS'] as const;
export const KINDS = ['scene', 'montage', 'flashback', 'plan', 'setpiece', 'card', 'intro'] as const;
export const SETS = [
  'stage', 'office', 'bullpen', 'boardroom', 'darkroom', 'lobby', 'courtroom', 'senate', 'whitehouse', 'podium', 'street', 'skyline',
  'lab', 'datacenter', 'stadium', 'dinner', 'call', 'screen', 'lighthouse', 'vault', 'rocket', 'void',
] as const;
export const STYLES = ['BASE', '1-BIT', 'EARLY-WEB16', 'GLYPH', 'LEDGER', 'TERMINAL', '2-TONE'] as const;
export const SHOTS = ['wide', 'medium', 'close', 'insert'] as const;
export const POSES = ['stand', 'sit', 'point', 'walk', 'float', 'slump', 'arms-up', 'phone', 'lean'] as const;
export const FACES = ['calm', 'smile', 'worried', 'angry', 'shocked', 'smug'] as const;
export const FXS = ['freeze', 'flash', 'glyph-dissolve', 'shake', 'pop', 'rain', 'rewind', 'split'] as const;

export type Kind = (typeof KINDS)[number];
export type SetId = (typeof SETS)[number];
export type StyleId = (typeof STYLES)[number];
export type Shot = (typeof SHOTS)[number];
export type Pose = (typeof POSES)[number];
export type Face = (typeof FACES)[number];
export type Fx = (typeof FXS)[number];

export interface CharRef {id: string; pose: Pose; face: Face; x: number | null}
/** t = resolved start as a fraction of the beat (0..0.95), or null (spread evenly); tRaw = what the writer typed. */
export interface Line {who: string; text: string; t: number | null; tRaw: number | null}
// ---------------------------------------------------------------- DIALOGUE REELS (episode "dialogueReel": true)
// A dialogue reel plays RECORDED takes (the mix is built from the same JSON by audio/reel/ep01-act4-v5/bed.py and
// muxed after the render). Everything below is read only when the episode sets "dialogueReel": true, so every
// other reel normalises exactly as before. In a dialogue reel:
//   lines[]   {id, who, text, t, dur, audio, in, words, tag, role, cut}: t = SECONDS from the beat's start to the
//             first audible word (no fraction rule, no 6-line cap); dur = audible speech length; in = where the
//             speech starts inside the audio file (the file is laid at beatStart + t - in); words = [[w, t0, t1]]
//             seconds from the speech onset. tag: "V.O." | "O.S." | "laptop" | "monitor" | "" (label suffix).
//   onscreen[] strings, or {text, at, until}: seconds inside the beat (an item shows from at until until/beat end)
//   chars[]   may carry from / until (seconds inside the beat)
//   names[]   {id, at}: the picture names this character at `at` s into the beat (a plate, a card, a tile).
//             Before that, the strip and the name labels use the cast's neutral role (cast[id].role).
//   frame     the shot marker ("WIDE", "TWO-SHOT", "OTS", "SINGLE", "INSERT", …), shown in the header
//   fg        {id, side}: an over-the-shoulder foreground silhouette of that character
//   seq       {id, side, place, time, sub}: a sequence (or sub-sequence) starts on this beat (margin slate)
//   side      the in-world side badge ("HIS SIDE" / "THE BOARD'S SIDE"; "" = none)
//   speak[]   {id, at, dur}: extra speaking highlights with no audio (a silent mouth)
//   cont      true = this beat continues the previous beat's shot (counts as the same shot)
export interface DlgWord {w: string; t0: number; t1: number}
export interface DlgLine {id: string; who: string; text: string; t: number; dur: number; audio: string; fileIn: number; words: DlgWord[]; tag: string; role: string; cut: boolean}
export interface Timed {text: string; at: number; until: number | null}
export interface DlgSeq {id: string; side: string; place: string; time: string; sub: string}
export interface DlgBeat {
  frame: string;
  shotId: string;
  seq: DlgSeq | null; // set only on the beat that starts it
  seqCur: DlgSeq | null; // the sequence this beat belongs to (carried forward)
  seqStart: number; // index of the beat that started seqCur (-1 = none)
  side: string;
  fg: {id: string; side: 'left' | 'right'} | null;
  names: {id: string; at: number}[];
  timed: Timed[];
  charT: {from: number | null; until: number | null}[]; // aligned with beat.chars
  speak: {id: string; at: number; dur: number}[];
  room: string;
  cont: boolean;
  lines: DlgLine[];
}
export interface CastInfo {name?: string; role?: string; known?: boolean; blank?: boolean}

export interface Beat {
  idx: number;
  dlg?: DlgBeat; // dialogue reels only
  id: string;
  act: string;
  kind: Kind;
  set: SetId;
  setRaw: string; // what the writer typed, shown when the set is unknown
  style: StyleId;
  shot: Shot;
  chars: CharRef[];
  caption: string;
  lines: Line[];
  vo: string;
  onscreen: string[];
  real: string;
  realStart: number | null; // seconds into the 22-min episode
  realDur: number | null; // seconds
  reelDur: number; // seconds in the reel
  fx: Fx[];
  cues: string[]; // music / SFX cues (optional fields cues, cue, music, sfx): notes, shown in the margin
  placeholder?: boolean; // a stand-in segment with no picture yet (e.g. an act still in production)
}
export interface Episode {
  key: string; // file basename, e.g. ep01
  episode: number | null;
  title: string;
  logline: string;
  dateSpan: string;
  runtimeMin: number;
  speculative?: boolean; // kept for the writers' tracking; never rendered
  part?: string; // e.g. "full-part2 · ACT THREE + TAG" (full-length timelines split into parts)
  variant?: string; // title-card subtitle, e.g. "full-length rough animatic"
  beats: Beat[];
  error?: string;
  warnings?: string[];
  dialogueReel?: boolean; // see DIALOGUE REELS above
  cast?: Record<string, CastInfo>;
}
export interface Timing {
  starts: number[]; // absolute frame of each beat (the title card occupies 0..head-1)
  lens: number[];
  total: number;
  acts: {act: string; from: number; to: number}[]; // frame ranges (to exclusive)
  head: number; // title-card frames before the first beat: TITLE_FRAMES for a standalone reel, 0 for a chapter of an episode reel
}

// ---------------------------------------------------------------- helpers
const str = (v: unknown): string => (typeof v === 'string' ? v : typeof v === 'number' ? String(v) : '');
const squash = (v: unknown) => str(v).toUpperCase().replace(/[^A-Z0-9]/g, '');
const num = (v: unknown): number | null => {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return Number(v);
  return null;
};
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : v === undefined || v === null || v === '' ? [] : [v]);

// ---------------------------------------------------------------- speculation labels (never rendered)
const SPEC = /speculat/i;
/** Drop speculation labels from a presentation string; '' when nothing else is left. */
export const scrubSpec = (v: string): string => {
  if (!v || !SPEC.test(v)) return v;
  let t = v.replace(/\s*\([^()]*speculat[^()]*\)/gi, ''); // "(speculative)"
  // "SPECULATIVE: only the dates are real." -> the whole explanatory sentence goes
  t = t.replace(/(^|[.!?]\s+)SPECULATIVE(?:\s+FINALE)?\s*:[^.!?]*[.!?]?/gi, '$1');
  t = t.replace(/\bSPECULATIVE\s+from here on\b[.,;:]?/gi, '');
  // "SPECULATIVE · X", "SPECULATIVE, X", "SPECULATIVE FINALE. X", "… · SPECULATIVE"
  t = t.replace(/(^|[·|/.!?]\s*)SPECULATIVE(?:\s+FINALE)?\s*(?:[·,.;!–—-]\s*|$)/gi, '$1');
  t = t.replace(/\bspeculative\s+(?=[\p{L}\d"'“])/giu, ''); // "first speculative slot" -> "first slot"
  t = t
    .split(/(?<=[.!?])\s+/)
    .filter((x) => !SPEC.test(x))
    .join(' ');
  return t.replace(/\s{2,}/g, ' ').replace(/^[\s·,;:–—-]+|[\s·,;:–—-]+$/g, '').trim();
};

// ---------------------------------------------------------------- in-world text devices
export type Device = 'card' | 'rail' | 'ticker' | 'ui';
/** "RAIL: NOV 16, 2023" -> {device: 'rail', text: 'NOV 16, 2023'}. The prefix is a pointer, never rendered. */
export const deviceOf = (item: string): {device: Device; text: string} => {
  const m = item.match(/^\s*(RAIL|DATE RAIL|CHYRON|DATE CHYRON|TICKER|CRAWL|UI|BUTTON|SIGN|POST|TWEET|TITLE|TITLE CARD|CARD|SUPER|CAPTION|LOWER THIRD|ON ?SCREEN)\s*:\s*(.+)$/i);
  if (!m) return {device: 'card', text: item};
  const k = m[1].toUpperCase();
  const device: Device = /RAIL|CHYRON|LOWER/.test(k) ? 'rail' : /TICKER|CRAWL/.test(k) ? 'ticker' : /UI|BUTTON/.test(k) ? 'ui' : 'card';
  return {device, text: m[2].trim()};
};

/** "12:31" -> 751, "1:02:03" -> 3723, 751 -> 751, "55 s" -> 55. */
export const parseClock = (v: unknown): number | null => {
  const n = num(v);
  if (n !== null) return n;
  const s = str(v).trim();
  if (!s) return null;
  const m = s.match(/^(\d+):(\d{1,2})(?::(\d{1,2}))?(?:\.\d+)?$/);
  if (m) return m[3] !== undefined ? +m[1] * 3600 + +m[2] * 60 + +m[3] : +m[1] * 60 + +m[2];
  const sec = s.match(/^(\d+(?:\.\d+)?)\s*s(?:ec)?/i);
  if (sec) return +sec[1];
  const min = s.match(/^(\d+(?:\.\d+)?)\s*m(?:in)?/i);
  if (min) return +min[1] * 60;
  return null;
};
export const fmtClock = (sec: number) => {
  const s = Math.max(0, Math.round(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const ACT_ALIAS: Record<string, string> = {
  INTRO: 'INTRO', MAINTITLE: 'INTRO', TITLES: 'INTRO', OPENINGTITLES: 'INTRO',
  COLDOPEN: 'COLD OPEN', OPEN: 'COLD OPEN', TEASER: 'COLD OPEN', PROLOGUE: 'COLD OPEN',
  ACTONE: 'ACT ONE', ACT1: 'ACT ONE', ACTI: 'ACT ONE', A1: 'ACT ONE',
  ACTTWO: 'ACT TWO', ACT2: 'ACT TWO', ACTII: 'ACT TWO', A2: 'ACT TWO',
  ACTTHREE: 'ACT THREE', ACT3: 'ACT THREE', ACTIII: 'ACT THREE', A3: 'ACT THREE',
  ACTFOUR: 'ACT FOUR', ACT4: 'ACT FOUR', ACTIV: 'ACT FOUR', A4: 'ACT FOUR',
  ACTFIVE: 'ACT FIVE', ACT5: 'ACT FIVE', ACTV: 'ACT FIVE', A5: 'ACT FIVE',
  TAG: 'TAG', BUTTON: 'TAG', STINGER: 'TAG', CODA: 'TAG', EPILOGUE: 'TAG', CREDITS: 'CREDITS', ENDCREDITS: 'CREDITS',
};
const normAct = (v: unknown, prev: string): string => {
  const k = squash(v);
  if (!k) return prev;
  return ACT_ALIAS[k] ?? str(v).toUpperCase().trim();
};

const pick = <T extends string>(v: unknown, list: readonly T[], alias: Record<string, T>, dflt: T): T => {
  const raw = str(v).toLowerCase().trim();
  if ((list as readonly string[]).includes(raw)) return raw as T;
  const k = raw.replace(/[^a-z0-9]/g, '');
  if (alias[k]) return alias[k];
  const hit = list.find((x) => x.replace(/[^a-z0-9]/g, '') === k);
  return hit ?? dflt;
};

const KIND_ALIAS: Record<string, Kind> = {setpiece: 'setpiece', set: 'setpiece', fb: 'flashback', flash: 'flashback', memory: 'flashback', theplan: 'plan', explainer: 'plan', titlecard: 'card', chyron: 'card', text: 'card', maintitle: 'intro'};
const SET_ALIAS: Record<string, SetId> = {
  keynote: 'stage', theatre: 'stage', theater: 'stage', desk: 'office', cubicles: 'bullpen', openplan: 'bullpen', floor: 'bullpen', board: 'boardroom',
  meetingroom: 'boardroom', conference: 'boardroom', dark: 'darkroom', bedroom: 'darkroom', apartment: 'darkroom', reception: 'lobby', atrium: 'lobby',
  court: 'courtroom', trial: 'courtroom', hearing: 'senate', congress: 'senate', capitol: 'senate', ovaloffice: 'whitehouse', oval: 'whitehouse',
  press: 'podium', pressroom: 'podium', lectern: 'podium', rally: 'podium', city: 'street', outside: 'street', sidewalk: 'street', rooftop: 'skyline',
  sf: 'skyline', laboratory: 'lab', servers: 'datacenter', serverroom: 'datacenter', arena: 'stadium', dining: 'dinner', restaurant: 'dinner', woodrose: 'dinner',
  videocall: 'call', zoom: 'call', meet: 'call', phone: 'call', monitor: 'screen', tv: 'screen', feed: 'screen', twitter: 'screen', x: 'screen', web: 'screen',
  beacon: 'lighthouse', safe: 'vault', launchpad: 'rocket', spacez: 'rocket', empty: 'void', black: 'void', none: 'void',
};
const STYLE_OF = (v: unknown): StyleId => {
  const k = squash(v);
  if (!k) return 'BASE';
  if (k.startsWith('1BIT') || k.startsWith('ONEBIT') || k === 'PAPER') return '1-BIT';
  if (k.startsWith('EARLYWEB') || k.startsWith('EW16') || k === 'EW' || k.startsWith('WEB16')) return 'EARLY-WEB16';
  if (k.startsWith('GLYPH')) return 'GLYPH';
  if (k.startsWith('LEDGER')) return 'LEDGER';
  if (k.startsWith('TERM') || k.startsWith('CLI') || k.startsWith('CRT')) return 'TERMINAL';
  if (k.startsWith('2TONE') || k.startsWith('TWOTONE') || k.startsWith('FREEZE')) return '2-TONE';
  return 'BASE';
};
const SHOT_ALIAS: Record<string, Shot> = {ws: 'wide', ews: 'wide', establishing: 'wide', long: 'wide', full: 'wide', ms: 'medium', mid: 'medium', mcu: 'medium', twoshot: 'medium', cu: 'close', closeup: 'close', ecu: 'close', extreme: 'close', ins: 'insert', detail: 'insert', pov: 'insert'};
const POSE_ALIAS: Record<string, Pose> = {standing: 'stand', idle: 'stand', sitting: 'sit', seated: 'sit', pointing: 'point', walking: 'walk', run: 'walk', running: 'walk', enter: 'walk', exit: 'walk', floating: 'float', levitate: 'float', slumped: 'slump', slouch: 'slump', defeated: 'slump', armsup: 'arms-up', cheer: 'arms-up', celebrate: 'arms-up', shrug: 'arms-up', onphone: 'phone', call: 'phone', texting: 'phone', leaning: 'lean'};
const FACE_ALIAS: Record<string, Face> = {neutral: 'calm', blank: 'calm', happy: 'smile', grin: 'smile', smiling: 'smile', sad: 'worried', nervous: 'worried', anxious: 'worried', scared: 'worried', mad: 'angry', furious: 'angry', annoyed: 'angry', surprised: 'shocked', shock: 'shocked', aghast: 'shocked', smirk: 'smug', proud: 'smug'};
const FX_ALIAS: Record<string, Fx> = {freezeframe: 'freeze', frozen: 'freeze', whiteflash: 'flash', glyph: 'glyph-dissolve', dissolve: 'glyph-dissolve', glyphdissolve: 'glyph-dissolve', quake: 'shake', camerashake: 'shake', popin: 'pop', tilerain: 'rain', tiles: 'rain', rewind: 'rewind', vhs: 'rewind', splitscreen: 'split'};

// character ids: canonical ids + forgiving aliases (full names, "the ..." forms). RUMPT never PMURT.
const CHAR_ALIAS: Record<string, string> = {
  masmanalt: 'mas', mrmas: 'mas', kidmas: 'mas', gergmockbran: 'gerg', rimatamuri: 'rima', dlanodjrumpt: 'rumpt', dlanodrumpt: 'rumpt', pmurt: 'rumpt', prumt: 'rumpt',
  eojnedib: 'nedib', samanos: 'sama-nos', thewhale: 'whale', theorb: 'orb', theintern: 'intern', theresearcher: 'intern', researcher: 'intern', chatgtp: 'chatgtp',
  thepodium: 'podium', claude: 'clod', clodd: 'clod',
};
export const normCharId = (v: unknown): string => {
  const raw = str(v).trim().toLowerCase();
  if (!raw) return 'generic';
  const k = raw.replace(/[^a-z0-9]/g, '');
  return CHAR_ALIAS[k] ?? raw.replace(/\s+/g, '-');
};

const DEFAULT_POSE: Record<string, Pose> = {alyi: 'float', orb: 'float'};

const normChar = (v: unknown): CharRef | null => {
  if (typeof v === 'string') {
    const id = normCharId(v);
    return {id, pose: DEFAULT_POSE[id] ?? 'stand', face: 'calm', x: null};
  }
  if (!v || typeof v !== 'object') return null;
  const o = v as Record<string, unknown>;
  const id = normCharId(o.id ?? o.who ?? o.name);
  const x = num(o.x);
  return {
    id,
    pose: o.pose === undefined ? DEFAULT_POSE[id] ?? 'stand' : pick(o.pose, POSES, POSE_ALIAS, DEFAULT_POSE[id] ?? 'stand'),
    face: pick(o.face ?? o.expr ?? o.expression, FACES, FACE_ALIAS, 'calm'),
    x: x === null ? null : Math.max(0, Math.min(1, x)),
  };
};

const normLine = (v: unknown): Line | null => {
  if (typeof v === 'string') {
    const m = v.match(/^\s*([A-Za-z][A-Za-z0-9 .\-]{0,24}):\s*(.+)$/);
    return m ? {who: normCharId(m[1]), text: m[2], t: null, tRaw: null} : {who: '', text: v, t: null, tRaw: null};
  }
  if (!v || typeof v !== 'object') return null;
  const o = v as Record<string, unknown>;
  const text = str(o.text ?? o.line ?? o.says);
  if (!text) return null;
  const t = num(o.t ?? o.at);
  return {who: o.who || o.char || o.id ? normCharId(o.who ?? o.char ?? o.id) : '', text, t: null, tRaw: t === null ? null : Math.max(0, t)};
};

/** Resolve lines[].t for one beat: seconds if any line has t > 1, else fractions (see LINE TIMING above). */
export const resolveLineTimes = (lines: Line[], reelDur: number): Line[] => {
  const secs = lines.some((l) => l.tRaw !== null && l.tRaw > 1);
  return lines.map((l) => ({...l, t: l.tRaw === null ? null : Math.max(0, Math.min(0.95, secs ? l.tRaw / Math.max(0.5, reelDur) : l.tRaw))}));
};

const cueList = (o: Record<string, unknown>): string[] => [
  ...arr(o.cues).map(str),
  ...arr(o.cue).map(str),
  ...arr(o.music).map((x) => (str(x) ? `music: ${str(x)}` : '')),
  ...arr(o.sfx).map((x) => (str(x) ? `sfx: ${str(x)}` : '')),
].filter(Boolean).slice(0, 6);

const normBeat = (v: unknown, i: number, prevAct: string, epNo: number | null): Beat => {
  const o = (v && typeof v === 'object' ? v : {caption: str(v)}) as Record<string, unknown>;
  const setRaw = str(o.set).trim();
  const reel = num(o.reelDur ?? o.dur ?? o.duration);
  const fx = arr(o.fx)
    .map((x) => pick(x, FXS, FX_ALIAS, '' as Fx))
    .filter((x): x is Fx => (FXS as readonly string[]).includes(x));
  const reelDur = reel === null || reel <= 0 ? 3 : Math.max(0.5, Math.min(120, reel));
  const lines = arr(o.lines ?? o.dialogue).map(normLine).filter((l): l is Line => !!l).slice(0, 6);
  return {
    idx: i,
    id: str(o.id) || `${epNo ?? '?'}.${String(i + 1).padStart(2, '0')}`,
    act: normAct(o.act, prevAct),
    kind: pick(o.kind, KINDS, KIND_ALIAS, 'scene'),
    set: pick(o.set, SETS, SET_ALIAS, 'void'),
    setRaw,
    style: STYLE_OF(o.style),
    shot: pick(o.shot, SHOTS, SHOT_ALIAS, 'wide'),
    chars: arr(o.chars).map(normChar).filter((c): c is CharRef => !!c).slice(0, 12),
    caption: scrubSpec(str(o.caption ?? o.summary ?? o.what)),
    lines: resolveLineTimes(lines, reelDur),
    vo: str(o.vo),
    onscreen: arr(o.onscreen ?? o.card ?? o.text).map(str).map(scrubSpec).filter(Boolean).slice(0, 8),
    real: scrubSpec(str(o.real)),
    realStart: parseClock(o.realStart),
    realDur: parseClock(o.realDur),
    reelDur,
    fx: Array.from(new Set(fx)),
    cues: cueList(o).map(scrubSpec).filter(Boolean),
  };
};

// ---------------------------------------------------------------- dialogue reels: parsing (see DIALOGUE REELS)
const normDlgLine = (v: unknown): DlgLine | null => {
  if (!v || typeof v !== 'object') return null;
  const o = v as Record<string, unknown>;
  const text = str(o.text ?? o.line);
  if (!text) return null;
  const words = arr(o.words)
    .map((w) => (Array.isArray(w) ? {w: str(w[0]), t0: num(w[1]) ?? 0, t1: num(w[2]) ?? 0} : null))
    .filter((w): w is DlgWord => !!w);
  return {
    id: str(o.id),
    who: o.who || o.char ? normCharId(o.who ?? o.char) : '',
    text,
    t: Math.max(0, num(o.t ?? o.at) ?? 0),
    dur: Math.max(0.05, num(o.dur) ?? 1),
    audio: str(o.audio),
    fileIn: num(o.in) ?? 0,
    words,
    tag: str(o.tag),
    role: str(o.role),
    cut: o.cut === true || /[—–]\s*$/.test(text),
  };
};
const normTimed = (v: unknown): Timed | null => {
  if (typeof v === 'string' || typeof v === 'number') {
    const text = scrubSpec(str(v));
    return text ? {text, at: 0, until: null} : null;
  }
  if (!v || typeof v !== 'object') return null;
  const o = v as Record<string, unknown>;
  const text = scrubSpec(str(o.text));
  return text ? {text, at: Math.max(0, num(o.at) ?? 0), until: num(o.until)} : null;
};
const normSeq = (v: unknown): DlgSeq | null => {
  if (!v || typeof v !== 'object') return null;
  const o = v as Record<string, unknown>;
  return {id: str(o.id), side: str(o.side), place: str(o.place), time: str(o.time), sub: str(o.sub)};
};
const attachDialogue = (beats: Beat[], raws: unknown[]) => {
  let cur: DlgSeq | null = null;
  let curStart = -1;
  beats.forEach((b, i) => {
    const o = (raws[i] && typeof raws[i] === 'object' ? raws[i] : {}) as Record<string, unknown>;
    const lines = arr(o.lines).map(normDlgLine).filter((l): l is DlgLine => !!l);
    const timed = arr(o.onscreen).map(normTimed).filter((t): t is Timed => !!t);
    const rawChars = arr(o.chars).filter((c) => !!normChar(c)).slice(0, 12);
    const charT = rawChars.map((c) => {
      const co = (c && typeof c === 'object' ? c : {}) as Record<string, unknown>;
      return {from: num(co.from), until: num(co.until)};
    });
    const seq = normSeq(o.seq);
    if (seq) {
      // a sub-sequence (sub set) keeps its parent's id and side unless it names its own
      cur = cur && seq.sub && !seq.id ? {...seq, id: cur.id, side: seq.side || cur.side} : seq;
      curStart = i;
    }
    const fgO = o.fg && typeof o.fg === 'object' ? (o.fg as Record<string, unknown>) : null;
    b.dlg = {
      frame: str(o.frame).toUpperCase(),
      shotId: str(o.shotId) || b.id,
      seq,
      seqCur: cur,
      seqStart: curStart,
      side: str(o.side),
      fg: fgO ? {id: normCharId(fgO.id), side: str(fgO.side) === 'right' ? 'right' : 'left'} : null,
      names: arr(o.names)
        .map((n) => (n && typeof n === 'object' ? {id: normCharId((n as Record<string, unknown>).id), at: num((n as Record<string, unknown>).at) ?? 0} : null))
        .filter((n): n is {id: string; at: number} => !!n),
      timed,
      charT,
      speak: arr(o.speak)
        .map((n) => {
          if (!n || typeof n !== 'object') return null;
          const so = n as Record<string, unknown>;
          return {id: normCharId(so.id), at: num(so.at) ?? 0, dur: num(so.dur) ?? 1};
        })
        .filter((n): n is {id: string; at: number; dur: number} => !!n),
      room: str(o.room),
      cont: o.cont === true,
      lines,
    };
    b.onscreen = timed.map((t) => t.text);
    b.lines = lines.map((l) => ({who: l.who, text: l.text, tRaw: l.t, t: Math.max(0, Math.min(0.95, l.t / Math.max(0.5, b.reelDur)))}));
  });
};
/** Display name in a reel: the episode's cast override, else the show's parody name. */
export const castName = (ep: Episode, id: string) => ep.cast?.[id]?.name || displayName(id);

export const normalizeEpisode = (raw: unknown, key: string): Episode => {
  const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const fromKey = key.match(/(\d+)/);
  const epNo = num(o.episode) ?? (fromKey ? Number(fromKey[1]) : null);
  let prevAct = 'COLD OPEN';
  const beats = arr(o.beats).map((b, i) => {
    const nb = normBeat(b, i, prevAct, epNo);
    prevAct = nb.act;
    return nb;
  });
  const dialogueReel = o.dialogueReel === true;
  if (dialogueReel) attachDialogue(beats, arr(o.beats));
  const err = str(o._error) || undefined;
  if (beats.length === 0)
    beats.push(normBeat({kind: 'card', onscreen: [err ? 'REEL DATA ERROR' : 'NO BEATS YET'], caption: err ?? `${key}.json has no beats[]`, reelDur: 4}, 0, 'COLD OPEN', epNo));
  const rt = num(o.runtimeMin);
  return {
    key,
    episode: epNo,
    title: scrubSpec(str(o.title)) || key,
    logline: scrubSpec(str(o.logline)),
    dateSpan: scrubSpec(str(o.dateSpan)),
    runtimeMin: rt && rt > 0 ? rt : 22,
    speculative: o.speculative === true || o.speculative === 'true',
    part: scrubSpec(str(o.part)) || undefined,
    beats,
    error: err,
    warnings: Array.isArray(o._warnings) ? (o._warnings as unknown[]).map(str) : undefined,
    ...(dialogueReel
      ? {
          dialogueReel: true,
          variant: scrubSpec(str(o.variant)) || undefined,
          cast: o.cast && typeof o.cast === 'object' ? (o.cast as Record<string, CastInfo>) : undefined,
        }
      : {}),
  };
};

/** Frame layout of one reel. `head` = title-card frames before the first beat (default TITLE_FRAMES; an episode
 *  reel's chapters use 0, so a chapter's beat frames are exactly its standalone frames minus TITLE_FRAMES). */
export const timeEpisode = (ep: Episode, head: number = TITLE_FRAMES): Timing => {
  const starts: number[] = [];
  const lens: number[] = [];
  let acc = 0;
  let prev = head;
  ep.beats.forEach((b) => {
    acc += b.reelDur;
    const end = Math.max(prev + 1, head + Math.round(acc * FPS));
    starts.push(prev);
    lens.push(end - prev);
    prev = end;
  });
  const acts: Timing['acts'] = [];
  ep.beats.forEach((b, i) => {
    const last = acts[acts.length - 1];
    if (last && last.act === b.act) last.to = starts[i] + lens[i];
    else acts.push({act: b.act, from: starts[i], to: starts[i] + lens[i]});
  });
  return {starts, lens, total: prev, acts, head};
};

/** Index of the beat on absolute frame f (-1 = title card). */
export const beatAt = (t: Timing, f: number) => {
  if (f < (t.head ?? TITLE_FRAMES)) return -1;
  let lo = 0;
  let hi = t.starts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (t.starts[mid] <= f) lo = mid;
    else hi = mid - 1;
  }
  return lo;
};

/** Display name for a character id (parody names from bible/naming.md). */
const NAMES: Record<string, string> = {
  mas: 'MAS', gerg: 'GERG', alyi: 'ALYI', nole: 'NOLE', mario: 'MARIO', adelina: 'ADELINA', rumpt: 'RUMPT', nedib: 'NEDIB', nesnej: 'NESNEJ', tasya: 'TASYA',
  kram: 'KRAM', radnus: 'RADNUS', simed: 'SIMED', rima: 'RIMA', neleh: 'NELEH', mada: 'MADA', ttemme: 'TTEMME', terb: 'TERB', luap: 'LUAP', 'sama-nos': 'SAMA NOS',
  yrral: 'YRRAL', whale: 'THE WHALE', orb: 'THE ORB', intern: 'THE INTERN', jerdna: 'JERDNA', ynoj: 'YNOJ', asil: 'ASIL', retep: 'RETEP', oigneb: 'OIGNEB',
  melc: 'MELC', calendar: 'CALENDAR', podium: 'THE PODIUM', clod: 'CLOD', chatgtp: 'CHATGTP', korg: 'KORG', generic: '?',
};
export const displayName = (id: string) => NAMES[id] ?? id.replace(/[-_]+/g, ' ').toUpperCase();
export const KNOWN_CHARS = Object.keys(NAMES);
/** ids with their own stick-figure mark or shape (everything else draws as a generic figure). */
export const MARKED = new Set(['mas', 'gerg', 'alyi', 'nole', 'mario', 'rumpt', 'nesnej', 'tasya', 'kram', 'radnus', 'simed', 'rima', 'neleh', 'mada', 'ttemme', 'terb', 'luap', 'sama-nos', 'yrral', 'whale', 'orb', 'intern', 'calendar', 'podium', 'clod', 'chatgtp', 'korg']);
