// MR. MAS — style-jump prototype 1 · a FROZEN copy of THE EDITOR's Act Four frame composer at timing lock v2.
// J1 was built frame-for-frame on lock v2 (act frames 1620–1763 = 26.04c, 26.05, 26.05a). THE EDITOR has since moved
// the act to lock v3 (animatic/frame.ts now composes data-v3 / shots3.ts, where sc 26 is renumbered and re-timed), so
// importing `native` from there no longer returns the firing. This file is `native()` exactly as the v2 composer had
// it (recovered verbatim from the delivered J1 build's source map; its frame() / otext() are left out), drawing from
// the v2 data and the v2 shot layouts, which the v3 pass kept (shots.ts only gained exports). It lets the J1 fix pass
// change the certificate and nothing else. Re-targeting J1 onto lock v3 (its 26.06b) is THE EDITOR's handoff.
import {Buf} from '../../../shared/pixel/px';
import {PAL} from '../../../shared/pixel/palette';
import {inPalette} from '../../../shared/pixel/palettes';
import type {GlyphLayer} from '../../../shared/pixel/glyph';
import {BLUEPRINT_PRINT} from '../../../shared/pixel/kits/blueprint';
import {SHOTS} from '../../../episodes/ep01/act4/animatic/data-v2';
import type {ShotV2} from '../../../episodes/ep01/act4/animatic/data-v2';
import {DRAW, ShotOut} from '../../../episodes/ep01/act4/animatic/shots';
import {talkBox, voLine, railBand, box, RH} from '../../../episodes/ep01/act4/animatic/lay';

const STARTS = SHOTS.map((s) => s.s);
const shotIndexAt = (f: number) => {
  let lo = 0, hi = SHOTS.length - 1;
  while (lo < hi) { const m = (lo + hi + 1) >> 1; if (STARTS[m] <= f) lo = m; else hi = m - 1; }
  return lo;
};
/** the rail in effect when each shot starts (it persists across cuts until replaced) */
const RAIL_BEFORE: Array<string | null> = (() => {
  const out: Array<string | null> = [];
  let cur: string | null = null;
  for (const s of SHOTS) { out.push(cur); if (s.rail) cur = s.rail; }
  return out;
})();

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

/** The 480 x 270 show frame at act frame f, as lock v2 drew it. */
export const native = (f: number): {fb: Buf; sh: ShotV2; k: number; st: string} => {
  const i = shotIndexAt(f), sh = SHOTS[i], k = f - sh.s;
  const fb = new Buf(480, 270, PAL.N0);
  const def = DRAW[sh.id];
  let out: ShotOut = {};
  if (def) out = def.draw(fb, k, sh, f) ?? {};
  else box(fb, 20, 20, 440, 160, `NO LAYOUT: ${sh.id} ${sh.tag} · ${sh.note}`);
  for (const L of out.layers ?? []) putLayer(fb, L);
  if (out.print === 'blueprint') { const p = inPalette(fb, BLUEPRINT_PRINT); fb.c.set(p.c); }
  if (!out.full) {
    if (!out.noTalk) talkBox(fb, sh, k);
    if (!out.noVo) voLine(fb, sh, k);
    const changed = sh.railAt !== null;
    const rail = changed && k < (sh.railAt as number) ? RAIL_BEFORE[i] : sh.rail ?? RAIL_BEFORE[i];
    const typed = changed && k >= (sh.railAt as number) ? (k - (sh.railAt as number)) * 2 : 999;
    railBand(fb, rail, typed, sh.side);
  }
  return {fb, sh, k, st: def ? def.st : 'NO LAYOUT'};
};
