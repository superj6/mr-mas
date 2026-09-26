// MR. MAS — Ep1 Act Four · THE EDITOR's animatic v3: the frame composer (owned by THE EDITOR).
// One pure function per act frame, used by BOTH the Remotion composition (Animatic.tsx) and the Node renderer
// (tools/render.ts), so the two are pixel-identical:
//   native(f)  -> the 480 x 270 show frame: the shot's layout (shots3.ts), the moves that live between shots (the
//                 2-frame whips), the typed dialogue box ONLY where v3 keeps it (a wide, a voice off picture or through a
//                 speaker: pov-and-framing §4.7.3 rule 4), the V.O. line, and the rail band
//   frame(f)   -> the 1280 x 720 animatic frame: the show frame at 2x nearest (960 x 540, top-left) and, in the margin,
//                 the editor's notes (shot, size class, template, move, side, clock, beats, what it is built from, the
//                 temp sound laid under it), the subtitle band and the act timeline. Notes never go inside the picture.
// GLYPH tokens are approximated as tinted cells in both paths (the real glyphs only exist in PixelScene renders).
import {Buf, rect} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {inPalette} from '../../../../shared/pixel/palettes';
import type {GlyphLayer} from '../../../../shared/pixel/glyph';
import {BLUEPRINT_PRINT} from '../../../../shared/pixel/kits/blueprint';
import {dialogueBox} from '../../../../shared/pixel/ui';
import {SHOTS, SUBS, ACT_FRAMES, EP_IN_FRAMES} from './data-v3';
import type {ShotV3} from './data-v3';
import {DRAW3, ShotOut3} from './shots3';
import {railBand, box, pt, pw, pwrap, plain, RH} from './lay';
import {whipSmear, shiftRoom} from './framing';
import {clamp} from '../../../../shared/pixel/px';
import {MUSIC, SFX_MARKS} from './sound-v3';

export const OUT_W = 1280, OUT_H = 720;
export {ACT_FRAMES};

// ------------------------------------------------------------------ lookups
const STARTS = SHOTS.map((s) => s.s);
export const shotIndexAt = (f: number) => {
  let lo = 0, hi = SHOTS.length - 1;
  while (lo < hi) { const m = (lo + hi + 1) >> 1; if (STARTS[m] <= f) lo = m; else hi = m - 1; }
  return lo;
};
/** the rail in effect before each shot starts (it persists across cuts until replaced) */
const RAIL_BEFORE: Array<string | null> = (() => {
  const out: Array<string | null> = [];
  let cur: string | null = null;
  for (const s of SHOTS) { out.push(cur); if (s.rail) cur = s.rail; else if (s.railShown === null) cur = null; }
  return out;
})();
const tcOf = (f: number) => { const e = EP_IN_FRAMES + f; return `${String(Math.floor(e / 1440)).padStart(2, '0')}:${String(Math.floor(e / 24) % 60).padStart(2, '0')}:${String(e % 24).padStart(2, '0')}`; };

// ------------------------------------------------------------------ glyph layers (approximated as tinted cells)
const putLayer = (fb: Buf, L: GlyphLayer) => {
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

// ------------------------------------------------------------------ the typed box (v3: wides, O.S., through a speaker) and the V.O. line
const TYPED = new Set(['typed', 'speaker', 'os']);
const talkBox3 = (b: Buf, sh: ShotV3, k: number) => {
  if (!TYPED.has(sh.box)) return;
  for (const l of sh.lines) {
    if (l.kind !== 'dialogue') continue;
    if (k < l.s || k >= l.e + 10) continue;
    const who = l.mode === 'speaker' ? '' : l.os || sh.box === 'os' ? `${l.who} (O.S.)` : l.who;
    const str = plain(who ? `${who}: ${l.text}` : l.text);
    const shown = Math.floor((k - l.s) * 1.25) + (who ? who.length + 2 : 0);
    dialogueBox(b, 132, 8, 216, str, Math.min(str.length, shown), PAL.P1, k, 'none');
  }
};
const voLine3 = (b: Buf, sh: ShotV3, k: number) => {
  for (const l of sh.lines) {
    if (l.kind !== 'vo' || k < l.s || k >= l.e + 15) continue;
    const n = clamp(Math.floor((k - l.s) * 0.5), 0, l.text.length);
    pt(b, l.text.slice(0, n), 12, 191, PAL.C6, {shadow: PAL.N0});
  }
};

// ------------------------------------------------------------------ the native show frame
const drawShot = (fb: Buf, i: number, k: number, f: number): ShotOut3 => {
  const sh = SHOTS[i];
  const def = DRAW3[sh.id];
  if (!def) { box(fb, 20, 20, 440, 160, `NO LAYOUT: ${sh.id} ${sh.tag}`); return {}; }
  return def.draw(fb, k, sh, f) ?? {};
};
export const native = (f: number): {fb: Buf; sh: ShotV3; k: number; st: string; standin: boolean} => {
  const i = shotIndexAt(f), sh = SHOTS[i], k = f - sh.s, len = sh.e - sh.s;
  const fb = new Buf(480, 270, PAL.N0);
  const out = drawShot(fb, i, k, f);
  for (const L of out.layers ?? []) putLayer(fb, L);
  if (out.print === 'blueprint') { const p = inPalette(fb, BLUEPRINT_PRINT); fb.c.set(p.c); }
  // the whip (bible §4.7.2, the transition vocabulary): 2 frames out on the leaving shot, 2 in on the arriving one
  if (sh.move === 'whip-out' && k >= len - 2) { const j = k - (len - 2); shiftRoom(fb, -(j + 1) * 90); whipSmear(fb, -240); }
  if (sh.move === 'whip-in' && k < 2) { shiftRoom(fb, (2 - k) * 70); whipSmear(fb, -240); }
  if (!out.full) {
    if (!out.noTalk) talkBox3(fb, sh, k);
    if (!out.noVo) voLine3(fb, sh, k);
    const changed = sh.railAt !== null;
    const rail = changed && k < (sh.railAt as number) ? RAIL_BEFORE[i] : sh.rail ?? (sh.railShown ?? null);
    const typed = changed && k >= (sh.railAt as number) ? (k - (sh.railAt as number)) * 2 : 999;
    railBand(fb, rail, typed, sh.side);
  }
  return {fb, sh, k, st: DRAW3[sh.id]?.st ?? 'NO LAYOUT', standin: DRAW3[sh.id]?.standin ?? true};
};

// ------------------------------------------------------------------ overlay text (the 7px face at an integer scale; italic = a row shear)
const scratch = new Buf(1400, 12, 0);
const TRANSP = -1;
export const otext = (out: Buf, s: string, x: number, y: number, sc: number, col: number, o: {italic?: boolean; shadow?: number; maxW?: number} = {}) => {
  const w = Math.min(scratch.w - 2, pw(s) + 2);
  scratch.c.fill(TRANSP);
  pt(scratch, s, 0, 1, 1);
  const lean = (j: number) => (o.italic ? Math.round((8 - j) * sc * 0.28) : 0);
  const paint = (dx: number, dy: number, c: number) => {
    for (let j = 0; j < 10; j++) for (let i = 0; i < w; i++) {
      if (scratch.c[j * scratch.w + i] !== 1) continue;
      const X = x + dx + i * sc + lean(j), Y = y + dy + (j - 1) * sc;
      if (o.maxW && i * sc > o.maxW) continue;
      rect(X, Y, sc, sc, (px, py) => { if (px >= 0 && py >= 0 && px < out.w && py < out.h) out.c[py * out.w + px] = c; });
    }
  };
  if (o.shadow !== undefined) paint(Math.max(1, sc >> 1), Math.max(1, sc >> 1), o.shadow);
  paint(0, 0, col);
  return pw(s) * sc;
};
const owrap = (s: string, maxPx: number, sc: number) => pwrap(s, Math.floor(maxPx / sc));

// ------------------------------------------------------------------ the act timeline (scene segments, the playhead)
const SCENES = (() => {
  const out: Array<{sc: string; s: number; e: number; side: string}> = [];
  for (const s of SHOTS) { const last = out[out.length - 1]; if (last && last.sc === s.sc) last.e = s.e; else out.push({sc: s.sc, s: s.s, e: s.e, side: s.side}); }
  return out;
})();
const CLS_NAME: Record<string, string> = {
  W: 'WIDE', M: 'MEDIUM / 2S', OTS: 'OVER-THE-SHOULDER', MCU: 'CLOSE-UP (FRAMELESS)', CU: 'FULL-FRAME CLOSE-UP', ECU: 'EXTREME CLOSE-UP',
  SW: 'SCREEN · WIDE', SC: 'SCREEN · CLOSE', GS: 'BLUEPRINT · SHEET', GM: 'BLUEPRINT · SECTION', GD: 'BLUEPRINT · DETAIL', GFX: 'CARD', BOX: 'BOX (DELIBERATE)',
};
const MOVE_NAME: Record<string, string> = {
  still: 'STILL', 'whip-out': 'WHIP OUT (2 F)', 'whip-in': 'WHIP IN (2 F)', rack: 'RACK FOCUS (3 HELD STEPS)', macro: 'SCREEN MACRO 2X', 'app-push': 'APP PUSH (IN-WORLD)',
  pan: 'PAN (WHOLE PX)', drift: 'DRIFT (1 PX / 8 F)',
};
const soundAt = (f: number) => {
  const m = MUSIC.filter((x) => f >= x.s && f < x.e).map((x) => x.label);
  const s = SFX_MARKS.filter((x) => f >= x.f && f < x.f + 18).map((x) => x.label);
  return {m, s};
};

// ------------------------------------------------------------------ the 1280 x 720 animatic frame
export const frame = (f: number, target?: Buf): Buf => {
  const out = target ?? new Buf(OUT_W, OUT_H, PAL.N0);
  out.c.fill(0x07080d);
  const {fb, sh, k, st, standin} = native(f);
  for (let y = 0; y < 270; y++) {
    const row = y * 480, o0 = y * 2 * OUT_W;
    for (let x = 0; x < 480; x++) { const c = fb.c[row + x]; const o = o0 + x * 2; out.c[o] = c; out.c[o + 1] = c; out.c[o + OUT_W] = c; out.c[o + OUT_W + 1] = c; }
  }
  // ---- the margin (x 960-1279): the editor's notes, never inside the picture
  const X = 976, PWD = 292;
  rect(960, 0, 320, 540, out.ink(0x0d0f16));
  rect(960, 0, 1, 540, out.ink(0x2a2f3d));
  otext(out, 'MR. MAS · EP1 · ACT FOUR', X, 12, 2, 0x8a93a8);
  otext(out, 'ANIMATIC v3 · LOCK v3', X, 32, 2, PAL.C6);
  rect(X, 54, PWD, 1, out.ink(0x2a2f3d));
  otext(out, sh.id, X, 64, 5, 0xf2efe6);
  otext(out, sh.tag.slice(0, 18), X, 110, 2, 0xf2d38a);
  const scl = `SC ${sh.sc} · ${sh.chunk}`;
  otext(out, scl, X + PWD - pw(scl) * 2, 110, 2, 0x8a93a8);
  otext(out, CLS_NAME[sh.cls] ?? sh.cls, X, 130, 2, 0xc8cbd6);
  otext(out, `${sh.framing} · ${MOVE_NAME[sh.move] ?? sh.move.toUpperCase()}`.slice(0, 44), X, 148, 1, 0x9aa3b8);
  const side = sh.side === 'MAS' ? 'HIS SIDE' : "THE BOARD'S SIDE";
  const sc = sh.side === 'MAS' ? PAL.C6 : PAL.W6;
  const sw = pw(side) * 2 + 16;
  rect(X, 162, sw, 22, out.ink(sc)); rect(X + 2, 164, sw - 4, 18, out.ink(0x0d0f16));
  otext(out, side, X + 8, 167, 2, sc);
  otext(out, 'EPISODE TC', X, 194, 1, 0x5d667a);
  otext(out, tcOf(f), X, 206, 4, 0xf2efe6);
  const len = sh.e - sh.s;
  otext(out, `ACT F ${f} · SHOT ${k + 1}/${len}`, X, 240, 2, 0xc8cbd6);
  const bt = Math.floor(k / 15);
  for (let i = 0; i < Math.min(12, Math.ceil(len / 15)); i++) rect(X + i * 20, 262, 14, 10, out.ink(i === bt ? (k % 15 < 4 ? 0xffffff : PAL.C6) : 0x2a2f3d));
  const dl = sh.b !== len ? `LOCK ${len - sh.b > 0 ? '+' : ''}${len - sh.b} F VS BOARD` : 'AS BOARDED';
  otext(out, dl, X + PWD - pw(dl), 264, 1, 0x8a93a8);
  rect(X, 280, PWD, 1, out.ink(0x2a2f3d));
  otext(out, 'BUILT FROM', X, 288, 1, 0x5d667a);
  let yy = 300;
  for (const l of owrap(st, PWD, 2).slice(0, 6)) { otext(out, l, X, yy, 2, standin ? 0xe7a0c4 : 0x9bd6b0); yy += 18; }
  yy = Math.max(yy + 4, 412);
  rect(X, yy - 6, PWD, 1, out.ink(0x2a2f3d));
  otext(out, 'TEMP SOUND UNDER THIS FRAME', X, yy, 1, 0x5d667a); yy += 12;
  const {m, s} = soundAt(f);
  const mus = m.length ? `MUSIC: ${m.join(' + ')}` : 'MUSIC: none (dry)';
  for (const l of owrap(mus, PWD, 1).slice(0, 4)) { otext(out, l, X, yy, 1, 0xb9bfcc); yy += 10; }
  if (s.length) for (const l of owrap(`SFX: ${s.join(' · ')}`, PWD, 1).slice(0, 3)) { otext(out, l, X, yy, 1, 0xf2d38a); yy += 10; }
  // ---- subtitles (y 548-676)
  rect(0, 540, OUT_W, 180, out.ink(0x07080d));
  rect(0, 540, OUT_W, 1, out.ink(0x2a2f3d));
  const act = SUBS.filter((x) => f >= x.s && f < x.hold_to);
  let sy = 556;
  for (const x of act.slice(-2)) {
    const vo = x.kind === 'vo';
    const who = vo ? 'mas (v.o.)' : x.mode === 'speaker' ? 'MAS (THROUGH THEIR LAPTOP)' : x.who;
    const os = !vo && x.os ? ' (O.S.)' : '';
    const label = `${who}${os}: `;
    const col = vo ? PAL.C6 : 0xf2efe6;
    const lines = owrap(x.text, 1240 - pw(label) * 3, 3);
    otext(out, label, 20, sy, 3, vo ? PAL.C5 : 0xf2d38a, {italic: vo, shadow: 0x000000});
    lines.slice(0, 2).forEach((l, j) => otext(out, l, 20 + pw(label) * 3 + 3, sy + j * 30, 3, col, {italic: vo, shadow: 0x000000}));
    sy += Math.min(2, lines.length) * 30 + 8;
  }
  // ---- the act timeline (y 688-716)
  const TX = 20, TW = 1240, TY = 690;
  for (const s2 of SCENES) {
    const x0 = TX + Math.floor((s2.s / ACT_FRAMES) * TW), x1 = TX + Math.floor((s2.e / ACT_FRAMES) * TW);
    rect(x0, TY, Math.max(1, x1 - x0 - 1), 14, out.ink(s2.side === 'MAS' ? 0x1d3a4a : 0x4a3520));
    if (x1 - x0 > 28) otext(out, s2.sc, x0 + 3, TY + 3, 1, 0xc8cbd6);
  }
  const shx0 = TX + Math.floor((sh.s / ACT_FRAMES) * TW), shx1 = TX + Math.ceil((sh.e / ACT_FRAMES) * TW);
  rect(shx0, TY - 3, Math.max(2, shx1 - shx0), 2, out.ink(0xf2d38a));
  const px = TX + Math.floor((f / ACT_FRAMES) * TW);
  rect(px, TY - 6, 2, 22, out.ink(0xffffff));
  otext(out, `${tcOf(0)}`, TX, TY + 18, 1, 0x5d667a);
  otext(out, `${tcOf(ACT_FRAMES)}`, TX + TW - 40, TY + 18, 1, 0x5d667a);
  return out;
};

/** 0xRRGGBB -> RGBA bytes (Remotion's ImageData) */
export const toRGBA = (b: Buf, data: Uint8ClampedArray) => {
  for (let i = 0; i < b.c.length; i++) { const v = b.c[i]; data[i * 4] = (v >> 16) & 255; data[i * 4 + 1] = (v >> 8) & 255; data[i * 4 + 2] = v & 255; data[i * 4 + 3] = 255; }
};
