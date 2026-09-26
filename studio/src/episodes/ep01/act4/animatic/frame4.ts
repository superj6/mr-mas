// MR. MAS — Ep1 Act Four · THE EDITOR's animatic v4: the frame composer (owned by THE EDITOR).
// One pure function per act frame of timing lock v4, used by BOTH the Remotion composition (Animatic.tsx, version 4)
// and the Node renderer (tools/render4.ts), so the two are pixel-identical:
//   native4(f)  -> the 480 x 270 show frame: the shot's layout (shots4.ts), the 2-frame whips, the V.O. line, and the
//                  rail band. v4 rules (edit-plan-v4 §2, T27): the RAIL carries time and place only (it types on, holds
//                  for its read + 0.75 s and clears; the lock sets its frames), the SIDE BADGE carries the side and
//                  persists, and there are NO typed dialogue boxes (the only typed dialogue is the call's own caption).
//   picture4(f) -> the picture only at 2x (960 x 540): the newcomer test's frame (§8 check 13: no speaker names)
//   frame4(f)   -> the 1280 x 720 animatic frame: the show frame at 2x and, in the margin, the editor's notes
//                  (sequence, shot, planned vs locked length, built from, the story marks, the sound under the frame from
//                  sound-v4.ts, the v4 sound pass's EDL), the
//                  subtitle band and the act timeline by sequence. Notes never go inside the picture.
// GLYPH tokens are approximated as tinted cells (the real glyphs only exist in PixelScene renders).
import {Buf, rect, clamp} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {inPalette} from '../../../../shared/pixel/palettes';
import type {GlyphLayer} from '../../../../shared/pixel/glyph';
import {BLUEPRINT_PRINT} from '../../../../shared/pixel/kits/blueprint';
import {SHOTS, SUBS, SEQS, RAILS, ACT_FRAMES, EP_IN_FRAMES} from './data-v4';
import type {ShotV4} from './data-v4';
import {DRAW4, ShotOut4} from './shots4';
import {railBand, box, pt, pw, pwrap, RH} from './lay';
import {whipSmear, shiftRoom} from './framing';
import {otext} from './frame';
import {MUSIC as MUSIC4, SFX_MARKS as SFX4} from './sound-v4';

export const OUT_W = 1280, OUT_H = 720;
export {ACT_FRAMES};

const STARTS = SHOTS.map((s) => s.s);
export const shotIndexAt = (f: number) => {
  let lo = 0, hi = SHOTS.length - 1;
  while (lo < hi) { const m = (lo + hi + 1) >> 1; if (STARTS[m] <= f) lo = m; else hi = m - 1; }
  return lo;
};
const tcOf = (f: number) => { const e = EP_IN_FRAMES + f; return `${String(Math.floor(e / 1440)).padStart(2, '0')}:${String(Math.floor(e / 24) % 60).padStart(2, '0')}:${String(e % 24).padStart(2, '0')}`; };
const railAt = (f: number) => RAILS.find((r) => f >= r.s && f < r.e) ?? null;
const seqAt = (f: number) => SEQS.find((q) => f >= q.s && f < q.e) ?? SEQS[SEQS.length - 1];

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
/** Mas's lowercase V.O., typed in the picture's foot (the show's V.O. device, as v3) */
const voLine = (b: Buf, sh: ShotV4, k: number) => {
  for (const l of sh.lines) {
    if (l.kind !== 'vo' || k < l.s || k >= l.e + 15) continue;
    const n = clamp(Math.floor((k - l.s) * 0.5), 0, l.text.length);
    pt(b, l.text.slice(0, n), 12, 191, PAL.C6, {shadow: PAL.N0});
  }
};
const badgeAt = (sh: ShotV4, k: number): 'MAS' | 'BOARD' => {
  if (sh.badge === 'flip-on-whip' && k >= sh.e - sh.s - 2) return sh.side === 'MAS' ? 'BOARD' : 'MAS';
  return sh.side;
};

export const native4 = (f: number): {fb: Buf; sh: ShotV4; k: number; st: string; standin: boolean} => {
  const i = shotIndexAt(f), sh = SHOTS[i], k = f - sh.s, len = sh.e - sh.s;
  const fb = new Buf(480, 270, PAL.N0);
  const def = DRAW4[sh.id];
  let out: ShotOut4 = {};
  if (!def) box(fb, 20, 20, 440, 160, `NO LAYOUT: ${sh.id} ${sh.tag}`);
  else out = def.draw(fb, k, sh, f) ?? {};
  for (const L of out.layers ?? []) putLayer(fb, L);
  if (out.print === 'blueprint') { const p = inPalette(fb, BLUEPRINT_PRINT); fb.c.set(p.c); }
  if (sh.whip === 'out' && k >= len - 2) { const j = k - (len - 2); shiftRoom(fb, -(j + 1) * 90); whipSmear(fb, -240); }
  if (sh.whip === 'in' && k < 2) { shiftRoom(fb, (2 - k) * 70); whipSmear(fb, -240); }
  if (!out.full) {
    if (!out.noVo) voLine(fb, sh, k);
    const r = railAt(f);
    railBand(fb, r ? r.text : null, r ? (f - r.s) * 2 : 0, badgeAt(sh, k));
  }
  return {fb, sh, k, st: def?.st ?? 'NO LAYOUT', standin: def?.standin ?? true};
};

/** the picture only (the newcomer test frame): the show frame at 2x, 960 x 540 */
export const picture4 = (f: number, target?: Buf): Buf => {
  const out = target ?? new Buf(960, 540, PAL.N0);
  const {fb} = native4(f);
  for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) { const c = fb.c[y * 480 + x]; const o = y * 2 * 960 + x * 2; out.c[o] = c; out.c[o + 1] = c; out.c[o + 960] = c; out.c[o + 961] = c; }
  return out;
};

const CLS_NAME: Record<string, string> = {
  W: 'WIDE', M: 'MEDIUM / 2S', OTS: 'OVER-THE-SHOULDER', MCU: 'CLOSE-UP (FRAMELESS)', CU: 'FULL-FRAME CLOSE-UP', ECU: 'EXTREME CLOSE-UP / INSERT',
  SW: 'SCREEN · WIDE', SC: 'SCREEN · CLOSE', GS: 'BLUEPRINT · SHEET', GD: 'BLUEPRINT · DETAIL', GFX: 'CARD', BOX: 'BOX (DELIBERATE)',
};
const owrap = (s: string, maxPx: number, sc: number) => pwrap(s, Math.floor(maxPx / sc));

export const frame4 = (f: number, target?: Buf): Buf => {
  const out = target ?? new Buf(OUT_W, OUT_H, PAL.N0);
  out.c.fill(0x07080d);
  const {fb, sh, k, st, standin} = native4(f);
  for (let y = 0; y < 270; y++) {
    const row = y * 480, o0 = y * 2 * OUT_W;
    for (let x = 0; x < 480; x++) { const c = fb.c[row + x]; const o = o0 + x * 2; out.c[o] = c; out.c[o + 1] = c; out.c[o + OUT_W] = c; out.c[o + OUT_W + 1] = c; }
  }
  const X = 976, PWD = 292;
  const q = seqAt(f);
  rect(960, 0, 320, 540, out.ink(0x0d0f16));
  rect(960, 0, 1, 540, out.ink(0x2a2f3d));
  otext(out, 'MR. MAS · EP1 · ACT FOUR', X, 12, 2, 0x8a93a8);
  otext(out, 'ANIMATIC v4.1 · LOCK v4.1', X, 32, 2, PAL.C6);
  rect(X, 54, PWD, 1, out.ink(0x2a2f3d));
  otext(out, sh.id, X, 62, 5, 0xf2efe6);
  otext(out, sh.tag.slice(0, 20), X, 106, 2, 0xf2d38a);
  otext(out, `${q.id} · ${q.title}`.slice(0, 46), X, 126, 1, 0xc8cbd6);
  otext(out, q.chapter.toUpperCase().slice(0, 46), X, 138, 1, 0x8a93a8);
  otext(out, `${CLS_NAME[sh.cls] ?? sh.cls} · ${sh.move.toUpperCase()}`.slice(0, 46), X, 150, 1, 0x9aa3b8);
  const side = badgeAt(sh, k) === 'MAS' ? 'HIS SIDE' : "THE BOARD'S SIDE";
  const sc = badgeAt(sh, k) === 'MAS' ? PAL.C6 : PAL.W6;
  const sw = pw(side) * 2 + 16;
  rect(X, 162, sw, 22, out.ink(sc)); rect(X + 2, 164, sw - 4, 18, out.ink(0x0d0f16));
  otext(out, side, X + 8, 167, 2, sc);
  otext(out, 'EPISODE TC', X, 194, 1, 0x5d667a);
  otext(out, tcOf(f), X, 206, 4, 0xf2efe6);
  const len = sh.e - sh.s;
  otext(out, `ACT F ${f} · SHOT ${k + 1}/${len}`, X, 240, 2, 0xc8cbd6);
  const d = len - sh.plan;
  otext(out, `${(len / 24).toFixed(2)} S · PLAN ${(sh.plan / 24).toFixed(2)} S${d ? ` (${d > 0 ? '+' : ''}${d} F)` : ''}`, X, 262, 1, 0x8a93a8);
  // the story marks in this shot: a tick row, the current one lit
  const marks = Object.entries(sh.marks).sort((a, b) => a[1] - b[1]);
  rect(X, 274, PWD, 6, out.ink(0x1a1e2a));
  for (const [, m] of marks) { const x = X + Math.floor((m / len) * PWD); rect(clamp(x, X, X + PWD - 2), 272, 2, 10, out.ink(k >= m && k < m + 6 ? 0xffffff : 0x4d5669)); }
  rect(X + Math.floor((k / len) * PWD), 270, 1, 14, out.ink(PAL.C6));
  const cur = marks.filter(([, m]) => k >= m).pop();
  if (cur) otext(out, `MARK: ${cur[0].toUpperCase()}`, X, 288, 1, 0xf2d38a);
  rect(X, 300, PWD, 1, out.ink(0x2a2f3d));
  otext(out, 'BUILT FROM', X, 306, 1, 0x5d667a);
  let yy = 318;
  for (const l of owrap(st, PWD, 1).slice(0, 7)) { otext(out, l, X, yy, 1, standin ? 0xe7a0c4 : 0x9bd6b0); yy += 11; }
  yy = Math.max(yy + 6, 404);
  rect(X, yy - 6, PWD, 1, out.ink(0x2a2f3d));
  // the sound under this frame, from the v4 sound pass's EDL (sound-v4.ts, generated by tools/mix_v4.py): TEMP mix
  otext(out, 'SOUND UNDER THIS FRAME (TEMP MIX v4)', X, yy, 1, 0x5d667a); yy += 12;
  const mus = MUSIC4.filter((x) => f >= x.s && f < x.e).map((x) => x.label);
  const sfx = SFX4.filter((x) => f >= x.f && f < x.f + 18).map((x) => x.label);
  for (const l of owrap(mus.length ? `MUSIC: ${mus.join(' + ')}` : `MUSIC: none · ${q.cue}`, PWD, 1).slice(0, 3)) { otext(out, l, X, yy, 1, 0xb9bfcc); yy += 10; }
  if (sfx.length) for (const l of owrap(`SFX: ${sfx.join(' · ')}`, PWD, 1).slice(0, 3)) { otext(out, l, X, yy, 1, 0xf2d38a); yy += 10; }
  if (sh.sound && yy < 510) for (const l of owrap(`THIS SHOT: ${sh.sound}`, PWD, 1).slice(0, Math.max(1, Math.floor((536 - yy) / 10)))) { otext(out, l, X, yy, 1, 0x9aa3b8); yy += 10; }
  // ---- subtitles (y 548-676): the review transcript (the newcomer test uses picture4 instead)
  rect(0, 540, OUT_W, 180, out.ink(0x07080d));
  rect(0, 540, OUT_W, 1, out.ink(0x2a2f3d));
  const act = SUBS.filter((x) => f >= x.s && f < x.hold_to);
  let sy = 556;
  for (const x of act.slice(-2)) {
    const vo = x.kind === 'vo', post = x.kind === 'post';
    const who = vo ? 'mas (v.o.)' : x.mode === 'speaker' ? 'MAS (THROUGH THEIR LAPTOP)' : post ? `${x.who} (POST, ON SCREEN)` : x.who;
    const os = !vo && !post && x.os ? ' (O.S.)' : '';
    const label = `${who}${os}: `;
    const col = vo ? PAL.C6 : post ? 0x9aa3b8 : 0xf2efe6;
    const lines = owrap(x.text, 1240 - pw(label) * 3, 3);
    otext(out, label, 20, sy, 3, vo ? PAL.C5 : 0xf2d38a, {italic: vo, shadow: 0x000000});
    lines.slice(0, 2).forEach((l, j) => otext(out, l, 20 + pw(label) * 3 + 3, sy + j * 30, 3, col, {italic: vo, shadow: 0x000000}));
    sy += Math.min(2, lines.length) * 30 + 8;
  }
  // ---- the act timeline by sequence (y 688-716)
  const TX = 20, TW = 1240, TY = 690;
  for (const s2 of SEQS) {
    const x0 = TX + Math.floor((s2.s / ACT_FRAMES) * TW), x1 = TX + Math.floor((s2.e / ACT_FRAMES) * TW);
    const his = s2.chapter.startsWith('HIS');
    rect(x0, TY, Math.max(1, x1 - x0 - 1), 14, out.ink(his ? 0x1d3a4a : 0x4a3520));
    if (x1 - x0 > 28) otext(out, s2.id, x0 + 3, TY + 3, 1, 0xc8cbd6);
  }
  for (const s of SHOTS) { const x = TX + Math.floor((s.s / ACT_FRAMES) * TW); rect(x, TY + 11, 1, 3, out.ink(0x07080d)); }
  const shx0 = TX + Math.floor((sh.s / ACT_FRAMES) * TW), shx1 = TX + Math.ceil((sh.e / ACT_FRAMES) * TW);
  rect(shx0, TY - 3, Math.max(2, shx1 - shx0), 2, out.ink(0xf2d38a));
  const px = TX + Math.floor((f / ACT_FRAMES) * TW);
  rect(px, TY - 6, 2, 22, out.ink(0xffffff));
  otext(out, `${tcOf(0)}`, TX, TY + 18, 1, 0x5d667a);
  otext(out, `${tcOf(ACT_FRAMES)}`, TX + TW - 40, TY + 18, 1, 0x5d667a);
  return out;
};
