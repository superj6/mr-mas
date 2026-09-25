// REEL schema: the contract between the writers (show/reel/epNN.json) and the generator.
// Everything here is defensive: any field may be missing, misspelt or the wrong type, and the reel still renders.
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
export interface Line {who: string; text: string; t: number | null} // t = when it starts, as a fraction of the beat
export interface Beat {
  idx: number;
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
}
export interface Episode {
  key: string; // file basename, e.g. ep01
  episode: number | null;
  title: string;
  logline: string;
  dateSpan: string;
  runtimeMin: number;
  speculative: boolean;
  beats: Beat[];
  error?: string;
  warnings?: string[];
}
export interface Timing {
  starts: number[]; // absolute frame of each beat (title card occupies 0..TITLE_FRAMES-1)
  lens: number[];
  total: number;
  acts: {act: string; from: number; to: number}[]; // frame ranges (to exclusive)
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
    return m ? {who: normCharId(m[1]), text: m[2], t: null} : {who: '', text: v, t: null};
  }
  if (!v || typeof v !== 'object') return null;
  const o = v as Record<string, unknown>;
  const text = str(o.text ?? o.line ?? o.says);
  if (!text) return null;
  const t = num(o.t ?? o.at);
  return {who: o.who || o.char || o.id ? normCharId(o.who ?? o.char ?? o.id) : '', text, t: t === null ? null : Math.max(0, Math.min(0.95, t))};
};

const normBeat = (v: unknown, i: number, prevAct: string, epNo: number | null): Beat => {
  const o = (v && typeof v === 'object' ? v : {caption: str(v)}) as Record<string, unknown>;
  const setRaw = str(o.set).trim();
  const reel = num(o.reelDur ?? o.dur ?? o.duration);
  const fx = arr(o.fx)
    .map((x) => pick(x, FXS, FX_ALIAS, '' as Fx))
    .filter((x): x is Fx => (FXS as readonly string[]).includes(x));
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
    caption: str(o.caption ?? o.summary ?? o.what),
    lines: arr(o.lines ?? o.dialogue).map(normLine).filter((l): l is Line => !!l).slice(0, 6),
    vo: str(o.vo),
    onscreen: arr(o.onscreen ?? o.card ?? o.text).map(str).filter(Boolean).slice(0, 8),
    real: str(o.real),
    realStart: parseClock(o.realStart),
    realDur: parseClock(o.realDur),
    reelDur: reel === null || reel <= 0 ? 3 : Math.max(0.5, Math.min(120, reel)),
    fx: Array.from(new Set(fx)),
  };
};

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
  const err = str(o._error) || undefined;
  if (beats.length === 0)
    beats.push(normBeat({kind: 'card', onscreen: [err ? 'REEL DATA ERROR' : 'NO BEATS YET'], caption: err ?? `${key}.json has no beats[]`, reelDur: 4}, 0, 'COLD OPEN', epNo));
  const rt = num(o.runtimeMin);
  return {
    key,
    episode: epNo,
    title: str(o.title) || key,
    logline: str(o.logline),
    dateSpan: str(o.dateSpan),
    runtimeMin: rt && rt > 0 ? rt : 22,
    speculative: o.speculative === true || o.speculative === 'true',
    beats,
    error: err,
    warnings: Array.isArray(o._warnings) ? (o._warnings as unknown[]).map(str) : undefined,
  };
};

export const timeEpisode = (ep: Episode): Timing => {
  const starts: number[] = [];
  const lens: number[] = [];
  let acc = 0;
  let prev = TITLE_FRAMES;
  ep.beats.forEach((b) => {
    acc += b.reelDur;
    const end = Math.max(prev + 1, TITLE_FRAMES + Math.round(acc * FPS));
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
  return {starts, lens, total: prev, acts};
};

/** Index of the beat on absolute frame f (-1 = title card). */
export const beatAt = (t: Timing, f: number) => {
  if (f < TITLE_FRAMES) return -1;
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
