// MR. MAS — Ep1 pixel pipeline (P0): THE HOST. One pure function per segment frame, used by BOTH the Remotion host
// (Host.tsx, pixel/entry.tsx) and the Node renderer (tools/render.ts), so the two are pixel-identical except for the
// frames only a browser can draw (GLYPH tokens; a segment's browser frames such as Act Four's J1), which render.ts
// splices in from the Remotion host. Generalized from Act Four's frame5.ts; with Act Four's options it draws frame5's
// frames exactly (tools/act4check.ts measures it).
//   prepare(spec)   the segment at run time: the lock's shots with the layouts' own marks and faces applied, the
//                   stand-in list (shots with no layout: never silent), the options, the review labels
//   native(seg, f)  the 480 x 270 show frame: the shot's layout (or the host's stand-in / reviewer slate), its print,
//                   the cut's transition (2-frame whips as frame5; dip, flash, dither), then the BAND (rows 203-269):
//                   Mas's V.O. typed above it (pov-and-framing §5.2), the rail typed in it, the side badge (option,
//                   Act Four v5 only), burned-in dialogue subtitles (option). GLYPH layers are returned, not drawn
//   picture(seg, f) the picture only, 1920 x 1080: the show frame at 4x, integer nearest (no names, no notes)
//   review(seg, f)  the review frame, 1920 x 1080: the show frame at 3x + the editor's margin (480 x 810) + the
//                   transcript band and the segment's timeline (1920 x 270). Notes never go inside the picture
import {Buf, rect, clamp, bayer} from '../../../shared/pixel/px';
import {PAL, stepColor} from '../../../shared/pixel/palette';
import {inPalette} from '../../../shared/pixel/palettes';
import type {GlyphLayer} from '../../../shared/pixel/glyph';
import {BLUEPRINT_PRINT} from '../../../shared/pixel/kits/blueprint';
import {railBand, pt, pw, pwrap, RH} from '../act4/animatic/lay';
import {whipSmear, shiftRoom} from '../act4/animatic/framing';
import {otext, owrap} from './text';
import {drawStandin, drawSlate} from './standin';
import {resolveMarks} from './anchors';
import {DEFAULT_OPTIONS} from './spec';
import type {Layout, LayoutOut, PixelSegment, ReviewConfig, SegmentOptions, Transition} from './spec';
import type {PxLine, PxShot, PxSeq, SegLock} from './types';

export {RH};
/** the picture: the 480 x 270 show frame at 4x */
export const PIC_W = 1920, PIC_H = 1080, PIC_SC = 4;
/** the review frame: the show frame at 3x (1440 x 810) + the margin (480 x 810) + the transcript band (1920 x 270) */
export const ANIM_W = 1920, ANIM_H = 1080, ANIM_SC = 3;
const MX0 = 480 * ANIM_SC, BY0 = 270 * ANIM_SC;

// ================================================================== the segment at run time
export interface Seg {
  spec: PixelSegment;
  lock: SegLock;
  seg: string;
  frames: number;
  shots: PxShot[];
  opts: SegmentOptions;
  review: ReviewConfig;
  /** shots with no layout (the host draws a STAND-IN; reviewer slates are not counted) */
  standins: string[];
  /** a layout's marks or faces that could not be applied */
  problems: string[];
  /** layouts that threw, the first error each (the host drew a stand-in) */
  failed: Map<string, string>;
  layoutOf: (sh: PxShot) => Layout | null;
  shotAt: (f: number) => number;
  /** the music cue in effect per sequence (its own cues, or the last music cue before it, continuing) */
  cue: Record<string, string>;
}
const DEFAULT_REVIEW = (lock: SegLock): ReviewConfig => ({
  title: `MR. MAS · EP1 · ${lock.label}`,
  subtitle: `PIXEL v3 · LOCK ${lock.seg.toUpperCase()} (STICK TIMING)`,
  kindNames: {},
  sideBadge: false,
  durNote: 'AS THE STICK',
  soundLabel: lock.mix ? 'SOUND · TEMP TRACK = THE LOCK\'S MIX' : 'SOUND · NO TEMP TRACK IN THE LOCK',
  fallbackText: 'FALLBACK: THE LAYOUT DID NOT DRAW',
  standinText: 'STAND-IN: NO LAYOUT FOR THIS SHOT',
  mixMissing: new Set(),
  textFix: (_id, text) => text,
  speakerLabel: (x) => `${x.shown} (THROUGH A SPEAKER)`,
  seqColour: (_q, i) => (i % 2 ? 0x2c2f4a : 0x1d3a4a),
});
const CACHE = new Map<string, Seg>();
/** the segment, prepared once per option set */
export const prepare = (spec: PixelSegment, overrides: Partial<SegmentOptions> = {}): Seg => {
  const key = `${spec.seg}|${JSON.stringify(overrides)}`;
  const hit = CACHE.get(key);
  if (hit) return hit;
  const lock = spec.lock;
  const problems: string[] = [];
  const shots = lock.shots.map((sh) => {
    const L = spec.layouts[sh.id];
    if (!L || (!L.marks && !L.face)) return sh; // the lock's own object (lip-sync caches are keyed by the line objects)
    let lines: PxLine[] = sh.lines;
    if (L.face) {
      const F = L.face;
      lines = sh.lines.map((l) => (l.kind !== 'post' && l.who in F ? {...l, face: F[l.who], lip: F[l.who] === 'lip'} : l));
      for (const w of Object.keys(F)) if (F[w] && !lines.some((l) => l.who === w && l.kind !== 'post')) problems.push(`${sh.id}: face names ${w}, who has no line in the shot`);
    }
    const s2: PxShot = {...sh, lines};
    if (L.marks) { const pr: string[] = []; s2.marks = resolveMarks(s2, L.marks, pr); for (const p of pr) problems.push(`${sh.id}: ${p}`); }
    return s2;
  });
  const starts = shots.map((s) => s.s);
  const shotAt = (f: number) => { let lo = 0, hi = shots.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (starts[m] <= f) lo = m; else hi = m - 1; } return lo; };
  const layoutOf = (sh: PxShot) => spec.layouts[sh.id] ?? null;
  const cue: Record<string, string> = {};
  let last = '';
  for (const q of lock.seqs) {
    const items = q.cue ? q.cue.split(' · ') : [];
    cue[q.id] = q.cue || (last ? `${last} (continues)` : '');
    const m = items.filter((x) => x.startsWith('music:')).pop();
    if (m) last = m;
  }
  const seg: Seg = {
    spec, lock, seg: spec.seg, frames: lock.frames, shots,
    opts: {...DEFAULT_OPTIONS, ...(spec.options ?? {}), ...overrides},
    review: {...DEFAULT_REVIEW(lock), ...(spec.review ?? {})},
    standins: shots.filter((s) => !layoutOf(s) && !s.slate).map((s) => s.id),
    problems, failed: new Map(), layoutOf, shotAt, cue,
  };
  CACHE.set(key, seg);
  return seg;
};

// ================================================================== lookups
export const tcOf = (seg: Seg, f: number) => { const e = seg.lock.epIn + f; return `${String(Math.floor(e / 1440)).padStart(2, '0')}:${String(Math.floor(e / 24) % 60).padStart(2, '0')}:${String(e % 24).padStart(2, '0')}`; };
const railAt = (seg: Seg, f: number) => seg.lock.rails.find((r) => f >= r.s && f < r.e) ?? null;
const seqAt = (seg: Seg, f: number): PxSeq => seg.lock.seqs.find((q) => f >= q.s && f < q.e) ?? seg.lock.seqs[seg.lock.seqs.length - 1];
export const badgeAt = (sh: PxShot, k: number): 'MAS' | 'BOARD' => {
  if (sh.badge === 'flip-on-whip' && k >= sh.e - sh.s - 2) return sh.side === 'MAS' ? 'BOARD' : 'MAS';
  return sh.side;
};

// ================================================================== GLYPH layers
/** a layer that draws anything (a ground to fill, or a token the drawer would paint) */
const liveLayer = (L: GlyphLayer) => L.fills.length > 0 || L.tokens.some((t) => t.a > 0.01);
/** the view that puts the show frame's GLYPH layers onto an output at `scale`, clipped to the room area */
export const glyphView = (scale: number) => ({scale, ox: 0, oy: 0, crop: [0, 0, 480, RH] as [number, number, number, number]});
/** v4's stand-in for the tokens: the ground and 2-pixel marks, into the show frame (stills and sheets only) */
export const glyphMarks = (fb: Buf, L: GlyphLayer) => {
  const bg = L.style.bg ?? PAL.N0;
  for (let i = 0; i < L.fills.length; i += 2) for (let y = 0; y < L.cell[1]; y++) for (let x = 0; x < L.cell[0]; x++) {
    const X = L.fills[i] + x, Y = L.fills[i + 1] + y;
    if (X >= 0 && Y >= 0 && X < fb.w && Y < RH) fb.set(X, Y, bg);
  }
  for (const t of L.tokens) {
    if (t.a < 0.25 || t.v < 0.08) continue;
    const X = Math.round(t.x), Y = Math.round(t.y);
    for (let y = 0; y < 2; y++) if (X >= 0 && X < fb.w && Y + y >= 0 && Y + y < RH) fb.set(X, Y + y, t.col);
  }
};

// ================================================================== the band (rows RH..269): V.O., rails, badge, subtitles
/** Mas's V.O. (pov-and-framing §5.2): one line, left-aligned, directly above the band (x 12, baseline 198), his cyan
 *  one ramp step down (C6), a 1-px N0 shadow, typed at 0.5 characters a frame, held 15 frames after its last sound */
const VO_W = 456;
const voLine = (seg: Seg, b: Buf, sh: PxShot, k: number) => {
  for (const l of sh.lines) {
    if (l.kind !== 'vo' || k < l.s || k >= l.e + 15) continue;
    const text = seg.opts.voLowercase ? l.text.toLowerCase() : l.text;
    const n = clamp(Math.floor((k - l.s) * 0.5), 0, text.length);
    if (pw(text) <= VO_W) { pt(b, text.slice(0, n), 12, 191, PAL.C6, {shadow: PAL.N0}); continue; }
    // wider than the frame (§5.3 asks for <= 45 glyphs; render.ts check lists these): wrapped, the last line on the
    // baseline, earlier lines above it, typed through in order
    const rows = pwrap(text, VO_W);
    let left = n;
    rows.forEach((r, i) => { pt(b, r.slice(0, Math.max(0, left)), 12, 191 - (rows.length - 1 - i) * 11, PAL.C6, {shadow: PAL.N0}); left -= r.length + 1; });
  }
};
/** V.O. lines too wide for one line above the band (they wrap upward) */
export const wideVo = (seg: Seg) => seg.lock.subs.filter((x) => x.kind === 'vo' && pw(seg.opts.voLowercase ? x.text.toLowerCase() : x.text) > VO_W).map((x) => x.id);
/** the band: frame5's railBand (the same pixels) with the side badge as an option */
export const band = (b: Buf, rail: string | null, typed: number, badge: 'MAS' | 'BOARD' | null) => {
  if (badge) { railBand(b, rail, typed, badge); return; }
  rect(0, RH, 480, 270 - RH, b.ink(PAL.N0));
  rect(0, RH, 480, 1, b.ink(PAL.N3));
  if (rail) {
    const s = rail.slice(0, Math.max(0, typed));
    pwrap(s, 440).slice(0, 3).forEach((l, i) => pt(b, l, 12, RH + 12 + i * 11, PAL.P1, {shadow: PAL.N2}));
  }
};
/** the dialogue subtitle up at f (not V.O., which is typed; not posts, which are on screen), or null */
export const subAt = (seg: Seg, f: number) => seg.lock.subs.filter((x) => x.kind === 'dialogue' && f >= x.s && f < x.hold_to).pop() ?? null;
/** burned-in dialogue subtitles: bottom of the band, two lines at most, under any rail */
const burnSubs = (seg: Seg, b: Buf, f: number) => {
  const x = subAt(seg, f);
  if (!x) return;
  const lines = pwrap(seg.review.textFix(x.id, x.text), 456).slice(0, 2);
  lines.forEach((l, i) => pt(b, l, Math.round(240 - pw(l) / 2), 270 - 10 - (lines.length - i) * 11, PAL.P2, {shadow: PAL.N0}));
};

// ================================================================== transitions
const darkenRoom = (fb: Buf, n: number) => { if (n <= 0) return; for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) fb.set(x, y, stepColor(fb.get(x, y), -n)); };
const lightenRoom = (fb: Buf, n: number) => { if (n <= 0) return; for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) fb.set(x, y, stepColor(fb.get(x, y), n)); };
const applyTransition = (seg: Seg, fb: Buf, t: Transition, at: 'enter' | 'exit', i: number, k: number, len: number) => {
  const N = Math.max(1, Math.min(t.frames, len));
  const j = at === 'enter' ? k : k - (len - N); // 0..N-1 inside the transition
  if (j < 0 || j >= N) return;
  const p = at === 'enter' ? 1 - j / N : (j + 1) / N; // 1 = at the cut
  if (t.kind === 'dip') { if (p >= 0.999) rect(0, 0, 480, RH, fb.ink(PAL.N0)); else darkenRoom(fb, Math.round(p * 5)); return; }
  if (t.kind === 'flash') { lightenRoom(fb, Math.round(p * 4)); return; }
  if (t.kind === 'dither' && at === 'exit' && i + 1 < seg.shots.length) {
    const nx = native(seg, seg.shots[i + 1].s, {bare: true}).fb;
    for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) if (bayer(x, y) < p) fb.set(x, y, nx.get(x, y));
  }
};

// ================================================================== the show frame
export interface Native {
  fb: Buf; sh: PxShot; i: number; k: number;
  /** what drew it: the layout, the host's stand-in (no layout / it threw) or a reviewer slate */
  host: 'layout' | 'standin' | 'threw' | 'slate';
  st: string; standin: boolean; fallback: boolean; kind: string;
  /** the live GLYPH layers of this frame (drawn by the Remotion host at the output scale, never into fb) */
  layers: GlyphLayer[];
  full: boolean;
}
const drawLayout = (seg: Seg, fb: Buf, k: number, sh: PxShot, f: number): {out: LayoutOut; host: Native['host']; st: string; standin: boolean; fallback: boolean; kind: string} => {
  const L = seg.layoutOf(sh);
  if (!L) {
    if (sh.slate) { drawSlate(fb, k, sh); return {out: {full: true}, host: 'slate', st: 'REVIEWER SLATE (the stick timeline\'s own card)', standin: false, fallback: false, kind: 'SLATE'}; }
    drawStandin(fb, k, sh, 'NO LAYOUT', seg.opts.standin, seg.opts.standinTag);
    return {out: {}, host: 'standin', st: `HOST STAND-IN (${seg.opts.standin}): no layout for ${sh.id} in ${seg.seg}/shots.ts`, standin: true, fallback: true, kind: 'STAND-IN'};
  }
  try {
    const out = L.draw(fb, k, sh, f) ?? {};
    return {out, host: 'layout', st: out.st ?? L.st, standin: out.standin ?? !!L.standin, fallback: !!out.fallback, kind: L.kind ?? ''};
  } catch (e) {
    if (!seg.failed.has(sh.id)) seg.failed.set(sh.id, String((e as Error)?.stack ?? e).split('\n').slice(0, 3).join(' | '));
    fb.c.fill(PAL.N0);
    drawStandin(fb, k, sh, 'LAYOUT THREW', seg.opts.standin, seg.opts.standinTag);
    return {out: {}, host: 'threw', st: `HOST STAND-IN: the layout threw (${String((e as Error)?.message ?? e).slice(0, 80)})`, standin: true, fallback: true, kind: 'STAND-IN'};
  }
};
/** the 480 x 270 show frame at segment frame f. `marks`: v4's 2-px stand-ins for GLYPH tokens (stills); `bare`: no
 *  transitions (a dissolve's incoming frame) */
export const native = (seg: Seg, f: number, o: {marks?: boolean; bare?: boolean} = {}): Native => {
  const i = seg.shotAt(f), sh = seg.shots[i], k = f - sh.s, len = sh.e - sh.s;
  const fb = new Buf(480, 270, PAL.N0);
  const d = drawLayout(seg, fb, k, sh, f);
  const {out} = d;
  const layers = (out.layers ?? []).filter(liveLayer);
  if (o.marks) for (const L of layers) glyphMarks(fb, L);
  if (out.print === 'blueprint') { const p = inPalette(fb, BLUEPRINT_PRINT); fb.c.set(p.c); } else if (typeof out.print === 'function') out.print(fb);
  if (!o.bare) {
    const L = seg.layoutOf(sh);
    const whip = L && L.whip !== undefined ? L.whip : sh.whip;
    if (whip === 'out' && k >= len - 2) { const j = k - (len - 2); shiftRoom(fb, -(j + 1) * 90); whipSmear(fb, -240); }
    if (whip === 'in' && k < 2) { shiftRoom(fb, (2 - k) * 70); whipSmear(fb, -240); }
    if (L?.enter) applyTransition(seg, fb, L.enter, 'enter', i, k, len);
    if (L?.exit) applyTransition(seg, fb, L.exit, 'exit', i, k, len);
  }
  if (!out.full) {
    if (!out.noVo && seg.opts.vo === 'typed') voLine(seg, fb, sh, k);
    const r = out.noRail ? null : railAt(seg, f);
    band(fb, r ? r.text : null, r ? (f - r.s) * 2 : 0, seg.opts.badge ? badgeAt(sh, k) : null);
    if (seg.opts.subs === 'burn' && !out.noSubs) burnSubs(seg, fb, f);
  }
  return {fb, sh, i, k, host: d.host, st: d.st, standin: d.standin, fallback: d.fallback, kind: d.kind, layers, full: !!out.full};
};

/** nearest-neighbour blit of the 480 x 270 show frame into `dst` at an integer scale, top-left */
export const blitScaled = (fb: Buf, dst: Buf, sc: number) => {
  const D = dst.c, S = fb.c, W = dst.w;
  for (let y = 0; y < 270; y++) {
    const row = y * 480, o0 = y * sc * W;
    for (let x = 0; x < 480; x++) { const c = S[row + x], o = o0 + x * sc; for (let i = 0; i < sc; i++) D[o + i] = c; }
    for (let j = 1; j < sc; j++) D.copyWithin(o0 + j * W, o0, o0 + 480 * sc);
  }
};
/** the picture only, 1920 x 1080 (4x nearest). `n` = a native() result already computed for this frame */
export const picture = (seg: Seg, f: number, target?: Buf, o: {n?: Native; marks?: boolean} = {}): Buf => {
  const out = target ?? new Buf(PIC_W, PIC_H, PAL.N0);
  blitScaled((o.n ?? native(seg, f, {marks: o.marks})).fb, out, PIC_SC);
  return out;
};

// ================================================================== the review frame (margin + transcript)
const CLS_NAME: Record<string, string> = {
  W: 'WIDE', M: 'MEDIUM / 2S', OTS: 'OVER-THE-SHOULDER', MCU: 'CLOSE-UP (FRAMELESS)', CU: 'FULL-FRAME CLOSE-UP', ECU: 'EXTREME CLOSE-UP / INSERT',
  SW: 'SCREEN · WIDE', SC: 'SCREEN · CLOSE', GS: 'BLUEPRINT · SHEET', GM: 'BLUEPRINT · SECTION', GD: 'BLUEPRINT · DETAIL', GFX: 'CARD', BOX: 'BOX (DELIBERATE)',
};
const INK = {bg: 0x07080d, panel: 0x0d0f16, rule: 0x2a2f3d, dim: 0x5d667a, mid: 0x8a93a8, soft: 0xc8cbd6, text: 0xf2efe6, gold: 0xf2d38a, green: 0x9bd6b0, pink: 0xe7a0c4, red: 0xff7a7a, grey: 0x9aa3b8};

export const review = (seg: Seg, f: number, target?: Buf, o: {n?: Native; marks?: boolean} = {}): Buf => {
  const R = seg.review, lock = seg.lock;
  const out = target ?? new Buf(ANIM_W, ANIM_H, INK.bg);
  out.c.fill(INK.bg);
  const n = o.n ?? native(seg, f, {marks: o.marks});
  const {fb, sh, k, st, standin, fallback, layers} = n;
  blitScaled(fb, out, ANIM_SC);
  // ---- the margin (x 1440-1920, y 0-810)
  const X = MX0 + 22, PWD = ANIM_W - MX0 - 44;
  const q = seqAt(seg, f), len = sh.e - sh.s;
  rect(MX0, 0, ANIM_W - MX0, BY0, out.ink(INK.panel));
  rect(MX0, 0, 2, BY0, out.ink(INK.rule));
  otext(out, R.title, X, 14, 2, INK.mid);
  otext(out, R.subtitle, X, 36, 2, PAL.C6);
  rect(X, 60, PWD, 2, out.ink(INK.rule));
  otext(out, sh.id, X, 72, 6, INK.text);
  otext(out, sh.tag.slice(0, 34), X, 132, 2, INK.gold);
  let y = 156;
  for (const l of owrap(`${q.id} · ${q.title}`, PWD, 2).slice(0, 2)) { otext(out, l, X, y, 2, INK.soft); y += 20; }
  otext(out, q.chapter.toUpperCase().slice(0, 36), X, y, 2, INK.mid); y += 20;
  otext(out, `${CLS_NAME[sh.cls] ?? sh.cls} · ${sh.move.toUpperCase()}`.slice(0, 36), X, y, 2, INK.grey); y += 26;
  if (R.sideBadge) {
    const side = badgeAt(sh, k) === 'MAS' ? 'HIS SIDE' : "THE BOARD'S SIDE";
    const sc = badgeAt(sh, k) === 'MAS' ? PAL.C6 : PAL.W6;
    const sw = pw(side) * 3 + 20;
    rect(X, y, sw, 32, out.ink(sc)); rect(X + 3, y + 3, sw - 6, 26, out.ink(INK.panel));
    otext(out, side, X + 10, y + 8, 3, sc);
    y += 40;
  }
  const hostStandin = n.host === 'standin' || n.host === 'threw';
  const kind = hostStandin ? R.standinText : fallback ? R.fallbackText : n.host === 'slate' ? 'REVIEWER SLATE (NOT THE SHOW)' : R.kindNames[n.kind] ?? (n.kind ? n.kind.toUpperCase() : 'DRAWN');
  otext(out, `LAYOUT ${kind}`.slice(0, 36), X, y, 2, fallback ? INK.red : INK.mid); y += 26;
  otext(out, 'EPISODE TC', X, y, 2, INK.dim); y += 20;
  otext(out, tcOf(seg, f), X, y, 6, INK.text); y += 56;
  otext(out, `ACT F ${f} · SHOT F ${k + 1}/${len}`, X, y, 2, INK.soft); y += 20;
  otext(out, `${(len / 24).toFixed(2)} S, ${R.durNote}${sh.beats.length > 1 ? ` (${sh.beats.length} BEATS)` : ''}`.slice(0, 36), X, y, 2, INK.mid); y += 26;
  // the story marks in this shot: a tick row, the current one lit
  const marks = Object.entries(sh.marks).filter(([, m]) => m >= 0 && m < len).sort((a, b) => a[1] - b[1]);
  rect(X, y + 4, PWD, 8, out.ink(0x1a1e2a));
  for (const [, m] of marks) { const x = X + Math.floor((m / len) * PWD); rect(clamp(x, X, X + PWD - 3), y, 3, 16, out.ink(k >= m && k < m + 6 ? 0xffffff : 0x4d5669)); }
  rect(X + Math.floor((k / len) * PWD), y - 2, 2, 20, out.ink(PAL.C6));
  y += 22;
  const cur = marks.filter(([, m]) => k >= m).pop();
  otext(out, cur ? `MARK: ${cur[0].toUpperCase()}` : marks.length ? 'MARK: -' : 'NO STORY MARKS', X, y, 2, cur ? INK.gold : INK.dim); y += 26;
  rect(X, y, PWD, 2, out.ink(INK.rule)); y += 10;
  // who is speaking now, and whether this framing draws their mouth
  const talk = sh.lines.filter((l) => l.kind !== 'post' && k >= l.s && k < l.e);
  otext(out, 'SPEAKING NOW', X, y, 2, INK.dim); y += 20;
  if (!talk.length) { otext(out, '-', X, y, 2, INK.dim); y += 20; }
  for (const l of talk.slice(0, 2)) {
    const m = l.face === 'lip' ? 'MOUTH DRAWN' : l.face === 'room' ? 'ROOM-SCALE MOUTH' : l.kind === 'vo' ? 'V.O.' : 'NO MOUTH IN THIS FRAMING';
    otext(out, `${l.who}${l.os ? ' (O.S.)' : ''}${l.mode === 'call' ? ' (CALL)' : ''} · ${m}`.slice(0, 36), X, y, 2, l.face ? INK.text : INK.grey); y += 20;
  }
  if (layers.length) { otext(out, 'GLYPH DISSOLVE · TRUE TOKENS', X, y, 2, PAL.C6); y += 20; }
  y += 6;
  rect(X, y, PWD, 2, out.ink(INK.rule)); y += 10;
  // the sound under this frame
  otext(out, R.soundLabel, X, y, 2, INK.dim); y += 20;
  const stop = lock.soundMarks.find((m) => m.e !== null ? f >= m.s && f < m.e : f >= m.s && f < m.s + 24);
  if (stop) for (const l of owrap(`${stop.kind === 'stop' ? 'STOP' : 'RING-OUT'}: ${stop.name}`.toUpperCase(), PWD, 2).slice(0, 2)) { otext(out, l, X, y, 2, 0xffffff); y += 19; }
  const spots = sh.spots.filter((s) => k >= s.k - 2 && k < s.k + 18);
  for (const s of spots.slice(0, 2)) {
    const key = `${sh.id} ${s.name} @${s.k}`, miss = R.mixMissing.has(key);
    otext(out, `SFX ${s.name}${miss ? ' · NOT IN THE TEMP MIX' : ''}`.slice(0, 36), X, y, 2, miss ? INK.pink : INK.gold); y += 19;
  }
  for (const l of owrap((seg.cue[q.id] ?? '').replace(/^music: /, 'MUSIC: '), PWD, 2).slice(0, 3)) { otext(out, l, X, y, 2, 0xb9bfcc); y += 19; }
  y += 6;
  rect(X, y, PWD, 2, out.ink(INK.rule)); y += 10;
  otext(out, 'BUILT FROM', X, y, 2, INK.dim); y += 20;
  const room = Math.max(1, Math.floor((BY0 - 6 - y) / 19));
  const built = owrap(fallback ? st : `${st}${standin ? ' · HOLDS A STAND-IN' : ''}`, PWD, 2);
  built.slice(0, room).forEach((l, j) => otext(out, j === room - 1 && built.length > room ? `${l.slice(0, 33)}...` : l, X, y + j * 19, 2, fallback ? INK.red : standin ? INK.pink : INK.green));
  // ---- the transcript band (y 810-1080)
  rect(0, BY0, ANIM_W, 2, out.ink(INK.rule));
  const act = lock.subs.filter((x) => f >= x.s && f < x.hold_to);
  let sy = BY0 + 18;
  for (const x of act.slice(-2)) {
    const vo = x.kind === 'vo', post = x.kind === 'post';
    const who = vo ? 'mas (v.o.)' : x.mode === 'speaker' ? R.speakerLabel(x) : post ? `${x.shown} (POST, ON SCREEN)` : x.shown;
    const os = !vo && !post && x.os ? ' (O.S.)' : '';
    const label = `${who}${os}: `;
    const col = vo ? PAL.C6 : post ? INK.grey : INK.text;
    const lw = pw(label) * 4 + 4;
    const text = R.textFix(x.id, x.text);
    const lines = owrap(vo && seg.opts.voLowercase ? text.toLowerCase() : text, ANIM_W - 60 - lw, 4);
    otext(out, label, 28, sy, 4, vo ? PAL.C5 : INK.gold, {italic: vo, shadow: 0x000000});
    lines.slice(0, 2).forEach((l, j) => otext(out, l, 28 + lw, sy + j * 40, 4, col, {italic: vo, shadow: 0x000000}));
    sy += Math.min(2, lines.length) * 40 + 12;
  }
  // ---- the segment timeline by sequence (y 1024-1072)
  const TX = 28, TW = ANIM_W - 56, TY = 1030, FR = seg.frames;
  lock.seqs.forEach((s2, i) => {
    const x0 = TX + Math.floor((s2.s / FR) * TW), x1 = TX + Math.floor((s2.e / FR) * TW);
    rect(x0, TY, Math.max(1, x1 - x0 - 2), 20, out.ink(R.seqColour(s2, i)));
    if (x1 - x0 > 40) otext(out, s2.id, x0 + 4, TY + 3, 2, INK.soft);
  });
  for (const s of seg.shots) { const x = TX + Math.floor((s.s / FR) * TW); rect(x, TY + 15, 1, 5, out.ink(n.host === 'standin' && s.id === sh.id ? INK.red : INK.bg)); }
  const shx0 = TX + Math.floor((sh.s / FR) * TW), shx1 = TX + Math.ceil((sh.e / FR) * TW);
  rect(shx0, TY - 5, Math.max(3, shx1 - shx0), 3, out.ink(INK.gold));
  const px = TX + Math.floor((f / FR) * TW);
  rect(px, TY - 8, 3, 32, out.ink(0xffffff));
  otext(out, tcOf(seg, 0), TX, TY + 28, 2, INK.dim);
  const endTc = tcOf(seg, FR);
  otext(out, endTc, TX + TW - pw(endTc) * 2, TY + 28, 2, INK.dim);
  return out;
};

// ================================================================== frames only a browser can draw
/** the frames whose picture carries GLYPH tokens: shots whose layout says `glyph: true` are probed frame by frame */
export const glyphFrames = (seg: Seg, from = 0, to = seg.frames): number[] => {
  const out: number[] = [];
  for (const sh of seg.shots) {
    if (sh.e <= from || sh.s >= to) continue;
    const L = seg.layoutOf(sh);
    if (!L?.glyph) continue;
    for (let f = Math.max(from, sh.s); f < Math.min(to, sh.e); f++) {
      const fb = new Buf(480, 270, PAL.N0);
      let o: LayoutOut | void;
      try { o = L.draw(fb, f - sh.s, sh, f); } catch { o = undefined; }
      if ((o?.layers ?? []).some(liveLayer)) out.push(f);
    }
  }
  return out;
};
/** every frame the Node renderer takes from the Remotion host: GLYPH frames and the segment's browser frames */
export const browserFrames = (seg: Seg, from = 0, to = seg.frames): number[] => {
  const set = new Set(glyphFrames(seg, from, to));
  const bf = seg.spec.browser?.frames;
  if (bf) for (let f = from; f < to; f++) if (bf(f, seg.opts)) set.add(f);
  return [...set].sort((a, b) => a - b);
};

// ================================================================== the subtitle file (the picture's accessibility track)
const srtTime = (fr: number) => {
  const ms = Math.round((fr / 24) * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`;
};
/** SubRip text for the segment's frames [from, to) (dialogue, and Mas's V.O. in lowercase italics), `offset` frames
 *  added to every time (a head slate; minus `from` for a partial render) */
export const srt = (seg: Seg, offset = 0, from = 0, to = seg.frames) => seg.lock.subs.filter((x) => x.kind !== 'post' && Math.max(x.e, x.hold_to) > from && x.s < to).map((x, i) => {
  const t = seg.review.textFix(x.id, x.text);
  const body = x.kind === 'vo' ? `<i>${seg.opts.voLowercase ? t.toLowerCase() : t}</i>` : t;
  return `${i + 1}\n${srtTime(Math.max(from, x.s) + offset)} --> ${srtTime(Math.min(to, Math.max(x.e, x.hold_to)) + offset)}\n${body}\n`;
}).join('\n');
