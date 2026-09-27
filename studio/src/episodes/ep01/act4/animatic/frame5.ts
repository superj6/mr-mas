// MR. MAS — Ep1 Act Four · the animatic v5: the frame composer (INF-FRAME5; the a4p5-render pass).
// One pure function per act frame of timing lock v5 (data-v5.ts, the approved stick timeline), used by BOTH the Remotion
// host (Animatic5.tsx: 'ep01-act4-animatic-v5', '-v5-picture', '-v5-still') and the Node renderer (tools/render5.ts),
// so the two are pixel-identical everywhere except the GLYPH tokens, which only a browser can draw (see below):
//   native5(f)  -> the 480 x 270 show frame: the shot's layout (shots5.ts drawShot5), the blueprint print, the 2-frame
//                  whips, Mas's typed V.O. line and the rail band with the side badge (the lock's RAILS: time and place
//                  only; the badge carries the side and flips on S2.05's whip). No dialogue boxes, as v4. It also
//                  returns the shot's GLYPH layers (S1.09's masked dissolve at the Cancel click), NOT drawn into fb.
//   picture5(f) -> the picture only, 1920 x 1080: the show frame at 4x, integer nearest (the newcomer test's frame: no
//                  names, no notes). The GLYPH tokens go on top at the same 4x (glyphView(PIC_SC)).
//   anim5(f)    -> the review frame, 1920 x 1080: the show frame at 3x (1440 x 810, top-left), the editor's margin on
//                  the right (480 x 810: shot, sequence, size and move, the layout's verdict and what it is built from,
//                  the episode TC, the story marks, who is speaking and whether their mouth is drawn, the sound under the
//                  frame) and the transcript band below (1920 x 270: the review transcript as the stick names people,
//                  then the act timeline by sequence). Notes never go inside the picture. Tokens at 3x (glyphView(ANIM_SC)).
// GLYPH: the tokens are real glyphs (JetBrains Mono, measured density ramp, bloom) drawn by the shared glyph drawer
// (shared/pixel/glyphDraw.ts drawGlyphLayer) in the Remotion host, at the output scale, clipped to the room area. Node
// can't rasterise the font, so render5.ts splices in the Remotion host's own frames for the few act frames that carry
// tokens (glyphFrames5()); `marks: true` draws v4's 2-pixel stand-in marks instead (stills and contact sheets only).
// J1 is not drawn here: the comparison clip (Cancel5.tsx, 'ep01-act4-v5-cancel-compare') plays it; never both in one cut.
import {Buf, rect, clamp} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {inPalette} from '../../../../shared/pixel/palettes';
import type {GlyphLayer} from '../../../../shared/pixel/glyph';
import {BLUEPRINT_PRINT} from '../../../../shared/pixel/kits/blueprint';
import {SHOTS, SUBS, SEQS, RAILS, SOUND_MARKS, MIX, ACT_FRAMES, EP_IN_FRAMES} from './data-v5';
import type {ShotV5} from './data-v5';
import {drawShot5, DRAW5, OPT5} from './shots5';
import {railBand, pt, pw, pwrap, RH} from './lay';
import {whipSmear, shiftRoom} from './framing';
import {otext} from './frame';

export {ACT_FRAMES};
/** the picture: the 480 x 270 show frame at 4x */
export const PIC_W = 1920, PIC_H = 1080, PIC_SC = 4;
/** the review frame: the show frame at 3x (1440 x 810) + the margin (480 x 810) + the transcript band (1920 x 270) */
export const ANIM_W = 1920, ANIM_H = 1080, ANIM_SC = 3;
const MX0 = 480 * ANIM_SC, BY0 = 270 * ANIM_SC;

/** The six sound spots the approved stick timeline added after mix.wav was built (timing-v5 §2; render5 `check`
 *  re-derives this list from show/reel/ep01-act4-v5.json against the mix's source timeline, history/v5a-1508, and
 *  says when it is stale). The margin marks them "NOT IN THE TEMP MIX". Empty it when bed.py re-runs. */
export const MIX_MISSING: ReadonlySet<string> = new Set([
  'S3.00a bell_ding_F6 @33',
  'S4.12 landing_thunk @21', 'S4.12 landing_thunk @28', 'S4.12 landing_thunk @36', 'S4.12 key_tap_space @46',
  'S4.13 JANGLE @9', 'S4.13e JANGLE @8',
  'S6.04 landing_thunk @32',
  'S7.01 key_tap_soft_02 @165', 'S7.01 key_tap_soft_04 @177', 'S7.01 key_tap_soft_06 @189',
]);

// ------------------------------------------------------------------ lookups
const STARTS = SHOTS.map((s) => s.s);
export const shotIndexAt = (f: number) => {
  let lo = 0, hi = SHOTS.length - 1;
  while (lo < hi) { const m = (lo + hi + 1) >> 1; if (STARTS[m] <= f) lo = m; else hi = m - 1; }
  return lo;
};
export const tcOf = (f: number) => { const e = EP_IN_FRAMES + f; return `${String(Math.floor(e / 1440)).padStart(2, '0')}:${String(Math.floor(e / 24) % 60).padStart(2, '0')}:${String(e % 24).padStart(2, '0')}`; };
const railAt = (f: number) => RAILS.find((r) => f >= r.s && f < r.e) ?? null;
const seqAt = (f: number) => SEQS.find((q) => f >= q.s && f < q.e) ?? SEQS[SEQS.length - 1];
/** the music cue in effect per sequence: its own cue, or (S4, which has none) the last music cue before it, continuing */
const CUE5: Record<string, string> = (() => {
  const out: Record<string, string> = {};
  let last = '';
  for (const q of SEQS) {
    const items = q.cue ? q.cue.split(' · ') : [];
    out[q.id] = q.cue || (last ? `${last} (continues)` : '');
    const m = items.filter((x) => x.startsWith('music:')).pop();
    if (m) last = m;
  }
  return out;
})();
/** the sound spots of a shot ("name @k" from the lock's `sound`), shot-relative frames */
const spotsOf = (sh: ShotV5): Array<{name: string; k: number; key: string}> =>
  sh.sound ? sh.sound.split(' · ').map((x) => { const m = /^(.*) @(-?\d+)$/.exec(x.trim()); return m ? {name: m[1], k: Number(m[2]), key: `${sh.id} ${m[1]} @${m[2]}`} : null; }).filter((x): x is {name: string; k: number; key: string} => x !== null) : [];

// ------------------------------------------------------------------ GLYPH layers
/** a layer that draws anything (a ground to fill, or a token the drawer would paint) */
const liveLayer = (L: GlyphLayer) => L.fills.length > 0 || L.tokens.some((t) => t.a > 0.01);
/** the view that puts the show frame's GLYPH layers onto an output at `scale`, clipped to the room area (rows 0..RH) */
export const glyphView = (scale: number) => ({scale, ox: 0, oy: 0, crop: [0, 0, 480, RH] as [number, number, number, number]});
/** v4's stand-in for the tokens (frame4.ts putLayer): the ground and 2-pixel marks, into the show frame. Stills only */
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

// ------------------------------------------------------------------ the show frame
/** Mas's lowercase V.O., typed in the picture's foot (the show's V.O. device, as v3 and v4) */
const voLine = (b: Buf, sh: ShotV5, k: number) => {
  for (const l of sh.lines) {
    if (l.kind !== 'vo' || k < l.s || k >= l.e + 15) continue;
    const n = clamp(Math.floor((k - l.s) * 0.5), 0, l.text.length);
    pt(b, l.text.slice(0, n), 12, 191, PAL.C6, {shadow: PAL.N0});
  }
};
export const badgeAt = (sh: ShotV5, k: number): 'MAS' | 'BOARD' => {
  if (sh.badge === 'flip-on-whip' && k >= sh.e - sh.s - 2) return sh.side === 'MAS' ? 'BOARD' : 'MAS';
  return sh.side;
};

export interface Native5 {
  fb: Buf; sh: ShotV5; i: number; k: number; st: string; standin: boolean; fallback: boolean;
  /** the live GLYPH layers of this frame (drawn by the host at the output scale, never into fb) */
  layers: GlyphLayer[];
  full: boolean;
}
export const native5 = (f: number, o: {marks?: boolean} = {}): Native5 => {
  const i = shotIndexAt(f), sh = SHOTS[i], k = f - sh.s, len = sh.e - sh.s;
  const fb = new Buf(480, 270, PAL.N0);
  const out = drawShot5(fb, k, sh, f);
  const layers = (out.layers ?? []).filter(liveLayer);
  if (o.marks) for (const L of layers) glyphMarks(fb, L);
  if (out.print === 'blueprint') { const p = inPalette(fb, BLUEPRINT_PRINT); fb.c.set(p.c); }
  if (sh.whip === 'out' && k >= len - 2) { const j = k - (len - 2); shiftRoom(fb, -(j + 1) * 90); whipSmear(fb, -240); }
  if (sh.whip === 'in' && k < 2) { shiftRoom(fb, (2 - k) * 70); whipSmear(fb, -240); }
  if (!out.full) {
    if (!out.noVo) voLine(fb, sh, k);
    const r = railAt(f);
    railBand(fb, r ? r.text : null, r ? (f - r.s) * 2 : 0, badgeAt(sh, k));
  }
  return {fb, sh, i, k, st: out.st, standin: out.standin, fallback: !!out.fallback, layers, full: !!out.full};
};

/** nearest-neighbour blit of the 480 x 270 show frame into `dst` at an integer scale, top-left */
const blitScaled = (fb: Buf, dst: Buf, sc: number) => {
  const D = dst.c, S = fb.c, W = dst.w;
  for (let y = 0; y < 270; y++) {
    const row = y * 480, o0 = y * sc * W;
    for (let x = 0; x < 480; x++) { const c = S[row + x], o = o0 + x * sc; for (let i = 0; i < sc; i++) D[o + i] = c; }
    for (let j = 1; j < sc; j++) D.copyWithin(o0 + j * W, o0, o0 + 480 * sc);
  }
};

/** the picture only, 1920 x 1080 (4x nearest). `n` = a native5 result already computed for this frame */
export const picture5 = (f: number, target?: Buf, o: {n?: Native5; marks?: boolean} = {}): Buf => {
  const out = target ?? new Buf(PIC_W, PIC_H, PAL.N0);
  const n = o.n ?? native5(f, {marks: o.marks});
  blitScaled(n.fb, out, PIC_SC);
  return out;
};

// ------------------------------------------------------------------ the review frame (margin + transcript)
const CLS_NAME: Record<string, string> = {
  W: 'WIDE', M: 'MEDIUM / 2S', OTS: 'OVER-THE-SHOULDER', MCU: 'CLOSE-UP (FRAMELESS)', CU: 'FULL-FRAME CLOSE-UP', ECU: 'EXTREME CLOSE-UP / INSERT',
  SW: 'SCREEN · WIDE', SC: 'SCREEN · CLOSE', GS: 'BLUEPRINT · SHEET', GM: 'BLUEPRINT · SECTION', GD: 'BLUEPRINT · DETAIL', GFX: 'CARD', BOX: 'BOX (DELIBERATE)',
};
const KIND_NAME: Record<string, string> = {R: 'R · V4 LAYOUT, RE-TIMED', C: 'C · V4 LAYOUT + V5 ART', N: 'N · NEW V5 COMPOSITION'};
const owrap = (s: string, maxPx: number, sc: number) => pwrap(s, Math.floor(maxPx / sc));
const INK = {bg: 0x07080d, panel: 0x0d0f16, rule: 0x2a2f3d, dim: 0x5d667a, mid: 0x8a93a8, soft: 0xc8cbd6, text: 0xf2efe6, gold: 0xf2d38a, green: 0x9bd6b0, pink: 0xe7a0c4, red: 0xff7a7a, grey: 0x9aa3b8};

export const anim5 = (f: number, target?: Buf, o: {n?: Native5; marks?: boolean} = {}): Buf => {
  const out = target ?? new Buf(ANIM_W, ANIM_H, INK.bg);
  out.c.fill(INK.bg);
  const n = o.n ?? native5(f, {marks: o.marks});
  const {fb, sh, k, st, standin, fallback, layers} = n;
  blitScaled(fb, out, ANIM_SC);
  // ---- the margin (x 1440-1920, y 0-810)
  const X = MX0 + 22, PWD = ANIM_W - MX0 - 44;
  const q = seqAt(f), len = sh.e - sh.s, def = DRAW5[sh.id];
  rect(MX0, 0, ANIM_W - MX0, BY0, out.ink(INK.panel));
  rect(MX0, 0, 2, BY0, out.ink(INK.rule));
  otext(out, 'MR. MAS · EP1 · ACT FOUR', X, 14, 2, INK.mid);
  otext(out, 'ANIMATIC v5 · LOCK v5 (STICK TIMING)', X, 36, 2, PAL.C6);
  rect(X, 60, PWD, 2, out.ink(INK.rule));
  otext(out, sh.id, X, 72, 6, INK.text);
  otext(out, sh.tag.slice(0, 34), X, 132, 2, INK.gold);
  let y = 156;
  for (const l of owrap(`${q.id} · ${q.title}`, PWD, 2).slice(0, 2)) { otext(out, l, X, y, 2, INK.soft); y += 20; }
  otext(out, q.chapter.toUpperCase().slice(0, 36), X, y, 2, INK.mid); y += 20;
  otext(out, `${CLS_NAME[sh.cls] ?? sh.cls} · ${sh.move.toUpperCase()}`.slice(0, 36), X, y, 2, INK.grey); y += 26;
  const side = badgeAt(sh, k) === 'MAS' ? 'HIS SIDE' : "THE BOARD'S SIDE";
  const sc = badgeAt(sh, k) === 'MAS' ? PAL.C6 : PAL.W6;
  const sw = pw(side) * 3 + 20;
  rect(X, y, sw, 32, out.ink(sc)); rect(X + 3, y + 3, sw - 6, 26, out.ink(INK.panel));
  otext(out, side, X + 10, y + 8, 3, sc);
  const kind = fallback ? 'STICK FALLBACK: THE LAYOUT DID NOT DRAW' : KIND_NAME[def?.kind ?? ''] ?? '?';
  y += 40;
  otext(out, `LAYOUT ${kind}`.slice(0, 36), X, y, 2, fallback ? INK.red : INK.mid); y += 26;
  otext(out, 'EPISODE TC', X, y, 2, INK.dim); y += 20;
  otext(out, tcOf(f), X, y, 6, INK.text); y += 56;
  otext(out, `ACT F ${f} · SHOT F ${k + 1}/${len}`, X, y, 2, INK.soft); y += 20;
  otext(out, `${(len / 24).toFixed(2)} S, AS THE STICK${sh.beats.length > 1 ? ` (${sh.beats.length} BEATS)` : ''}`.slice(0, 36), X, y, 2, INK.mid); y += 26;
  // the story marks in this shot: a tick row, the current one lit
  const marks = Object.entries(sh.marks).filter(([, m]) => m >= 0 && m < len).sort((a, b) => a[1] - b[1]);
  rect(X, y + 4, PWD, 8, out.ink(0x1a1e2a));
  for (const [, m] of marks) { const x = X + Math.floor((m / len) * PWD); rect(clamp(x, X, X + PWD - 3), y, 3, 16, out.ink(k >= m && k < m + 6 ? 0xffffff : 0x4d5669)); }
  rect(X + Math.floor((k / len) * PWD), y - 2, 2, 20, out.ink(PAL.C6));
  y += 22;
  const cur = marks.filter(([, m]) => k >= m).pop();
  otext(out, cur ? `MARK: ${cur[0].toUpperCase()}` : marks.length ? 'MARK: -' : 'NO STORY MARKS', X, y, 2, cur ? INK.gold : INK.dim); y += 26;
  rect(X, y, PWD, 2, out.ink(INK.rule)); y += 10;
  // who is speaking now, and whether this framing draws their mouth (the lock's `face`)
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
  // the sound under this frame: the temp track is the stick reel's mix (no pixel mix yet)
  otext(out, 'SOUND · TEMP TRACK = THE STICK MIX', X, y, 2, INK.dim); y += 20;
  const stop = SOUND_MARKS.find((m) => m.e !== null ? f >= m.s && f < m.e : f >= m.s && f < m.s + 24);
  if (stop) for (const l of owrap(`${stop.kind === 'stop' ? 'STOP' : 'RING-OUT'}: ${stop.name}`.toUpperCase(), PWD, 2).slice(0, 2)) { otext(out, l, X, y, 2, 0xffffff); y += 19; }
  const spots = spotsOf(sh).filter((s) => k >= s.k - 2 && k < s.k + 18);
  for (const s of spots.slice(0, 2)) { otext(out, `SFX ${s.name}${MIX_MISSING.has(s.key) ? ' · NOT IN THE TEMP MIX' : ''}`.slice(0, 36), X, y, 2, MIX_MISSING.has(s.key) ? INK.pink : INK.gold); y += 19; }
  for (const l of owrap((CUE5[q.id] ?? '').replace(/^music: /, 'MUSIC: '), PWD, 2).slice(0, 3)) { otext(out, l, X, y, 2, 0xb9bfcc); y += 19; }
  y += 6;
  rect(X, y, PWD, 2, out.ink(INK.rule)); y += 10;
  otext(out, 'BUILT FROM', X, y, 2, INK.dim); y += 20;
  const room = Math.max(1, Math.floor((BY0 - 6 - y) / 19));
  const built = owrap(fallback ? st : `${st}${standin ? ' · HOLDS A STAND-IN' : ''}`, PWD, 2);
  built.slice(0, room).forEach((l, j) => otext(out, j === room - 1 && built.length > room ? `${l.slice(0, 33)}...` : l, X, y + j * 19, 2, fallback ? INK.red : standin ? INK.pink : INK.green));
  // ---- the transcript band (y 810-1080): the review transcript (the newcomer test uses picture5 instead)
  rect(0, BY0, ANIM_W, 2, out.ink(INK.rule));
  const act = SUBS.filter((x) => f >= x.s && f < x.hold_to);
  let sy = BY0 + 18;
  for (const x of act.slice(-2)) {
    const vo = x.kind === 'vo', post = x.kind === 'post';
    const who = vo ? 'mas (v.o.)' : x.mode === 'speaker' ? 'MAS (THROUGH THEIR LAPTOP)' : post ? `${x.shown} (POST, ON SCREEN)` : x.shown;
    const os = !vo && !post && x.os ? ' (O.S.)' : '';
    const label = `${who}${os}: `;
    const col = vo ? PAL.C6 : post ? INK.grey : INK.text;
    const lw = pw(label) * 4 + 4;
    const lines = owrap(x.text, ANIM_W - 60 - lw, 4);
    otext(out, label, 28, sy, 4, vo ? PAL.C5 : INK.gold, {italic: vo, shadow: 0x000000});
    lines.slice(0, 2).forEach((l, j) => otext(out, l, 28 + lw, sy + j * 40, 4, col, {italic: vo, shadow: 0x000000}));
    sy += Math.min(2, lines.length) * 40 + 12;
  }
  // ---- the act timeline by sequence (y 1024-1072)
  const TX = 28, TW = ANIM_W - 56, TY = 1030;
  for (const s2 of SEQS) {
    const x0 = TX + Math.floor((s2.s / ACT_FRAMES) * TW), x1 = TX + Math.floor((s2.e / ACT_FRAMES) * TW);
    const his = s2.chapter.startsWith('HIS');
    rect(x0, TY, Math.max(1, x1 - x0 - 2), 20, out.ink(his ? 0x1d3a4a : 0x4a3520));
    if (x1 - x0 > 40) otext(out, s2.id, x0 + 4, TY + 3, 2, INK.soft);
  }
  for (const s of SHOTS) { const x = TX + Math.floor((s.s / ACT_FRAMES) * TW); rect(x, TY + 15, 1, 5, out.ink(INK.bg)); }
  const shx0 = TX + Math.floor((sh.s / ACT_FRAMES) * TW), shx1 = TX + Math.ceil((sh.e / ACT_FRAMES) * TW);
  rect(shx0, TY - 5, Math.max(3, shx1 - shx0), 3, out.ink(INK.gold));
  const px = TX + Math.floor((f / ACT_FRAMES) * TW);
  rect(px, TY - 8, 3, 32, out.ink(0xffffff));
  otext(out, tcOf(0), TX, TY + 28, 2, INK.dim);
  const endTc = tcOf(ACT_FRAMES);
  otext(out, endTc, TX + TW - pw(endTc) * 2, TY + 28, 2, INK.dim);
  return out;
};

/** the act frames whose picture carries GLYPH tokens (S1.09's dissolve): render5 splices the Remotion host's frames here */
export const glyphFrames5 = (from = 0, to = ACT_FRAMES): number[] => {
  const out: number[] = [];
  for (const sh of SHOTS) {
    if (sh.e <= from || sh.s >= to) continue;
    // only layouts that can return layers are probed frame by frame (S1.09); the rest are skipped by a one-frame probe
    const probe = (f: number) => { const fb = new Buf(480, 270, PAL.N0); const o = drawShot5(fb, f - sh.s, sh, f); return (o.layers ?? []).some(liveLayer); };
    if (!DRAW5[sh.id] || !/GLYPH|glyph|dissolve/.test(DRAW5[sh.id].st)) continue;
    for (let f = Math.max(from, sh.s); f < Math.min(to, sh.e); f++) if (probe(f)) out.push(f);
  }
  return out;
};
/** the temp track (the stick reel's mix; its frame MIX.offsetFrames is act frame 0) */
export const MIX5 = MIX;
void OPT5;
