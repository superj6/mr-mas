// MR. MAS — cast kit for SPEAKING rigs (Ep1 act 4 character pass; new file, owned by the act-4 character artist).
// One mouth vocabulary for every talking portrait: the six replacement mouths Mas already uses.
//   A  open vowel (a, i)        E  spread / most consonants (e, y, t, d, n, s, l ...)
//   O  round (o, u, w, q)       M  lips pressed (m, b, p)
//   rest  closed, neutral       smile  closed, a corner lifts (reactions, never lip-sync)
// Timing: the typewriter head drives the mouth (`visemeAt`), held on 2s; punctuation closes it.
// Also: a mouth PATCH helper, so an existing portrait with fewer mouths (ALYI, GERG) can take the full set
// without editing its owner's file: the old mouth is painted out with the skin row above it, then the new
// replacement drawing is stamped in. Everything whole-pixel, palette-only.
import type {Img} from '../figure';

export type Viseme = 'rest' | 'smile' | 'A' | 'E' | 'O' | 'M';
/** display order on sheets */
export const VISEMES: Viseme[] = ['A', 'E', 'O', 'M', 'rest', 'smile'];

/** Letter -> mouth. Same classes as sprite.mouthFor (0 rest/M, 1 E, 2 A, 3 O) plus the pressed M. */
export const visemeFor = (ch: string | undefined): Viseme => {
  if (!ch || ch === ' ' || /[.,!?;:…—\-"'()]/.test(ch)) return 'rest';
  if (/[mbpMBP]/.test(ch)) return 'M';
  if (/[aAiI]/.test(ch)) return 'A';
  if (/[oOuUwWqQ]/.test(ch)) return 'O';
  return 'E';
};

/**
 * The mouth for frame f of a typed line that starts at t0 and types at `cps` chars/frame. The drawing is held
 * on `hold` frames (2 = on 2s, the show standard) and closes to rest after the last char.
 */
export const visemeAt = (f: number, t0: number, line: string, cps = 1, hold = 2): Viseme => {
  if (f < t0) return 'rest';
  const g = t0 + Math.floor((f - t0) / hold) * hold;
  const i = Math.floor((g - t0) * cps);
  if (i >= line.length) return 'rest';
  return visemeFor(line[i]);
};

/** Mario's four mouths (cast/mario.ts: 0 rest, 1 E, 2 A, 3 O). M closes to 0; smile has no drawing (0). */
export const marioMouth = (v: Viseme): 0 | 1 | 2 | 3 => (v === 'A' ? 2 : v === 'O' ? 3 : v === 'E' ? 1 : 0);

/** A portrait's blink on a fixed, un-mechanical schedule: [start frame, ...] -> lid 0 open / 1 half / 2 shut. */
export const blinkSched = (f: number, starts: number[]): 0 | 1 | 2 => {
  for (const t of starts) {
    if (f === t || f === t + 2) return 1;
    if (f === t + 1) return 2;
  }
  return 0;
};

// ------------------------------------------------------------------ stamping into an existing portrait Img
export type MouthPal = Record<string, number>;

/**
 * Patch a mouth into a rendered portrait (in place on a copy): rows y0..y0+eraseH-1, x0..x0+eraseW-1 are first
 * painted out with the skin row directly above (`fillFromRow`, a clean plane on these faces), then `rows` are
 * stamped at (x, y). '.' leaves the (erased) skin; any other char is looked up in `pal`.
 */
export const patchMouth = (src: Img, erase: {x: number; y: number; w: number; h: number; fillFromRow: number}, x: number, y: number, rows: string[], pal: MouthPal): Img => {
  const out: Img = {w: src.w, h: src.h, c: new Int32Array(src.c)};
  const {w, h} = src;
  for (let j = erase.y; j < erase.y + erase.h; j++)
    for (let i = erase.x; i < erase.x + erase.w; i++) {
      if (i < 0 || j < 0 || i >= w || j >= h) continue;
      const v = src.c[erase.fillFromRow * w + i];
      if (src.c[j * w + i] >= 0 && v >= 0) out.c[j * w + i] = v;
    }
  rows.forEach((r, j) => {
    for (let i = 0; i < r.length; i++) {
      const col = pal[r[i]];
      if (col === undefined) continue;
      const X = x + i, Y = y + j;
      if (X < 0 || Y < 0 || X >= w || Y >= h) continue;
      out.c[Y * w + X] = col;
    }
  });
  return out;
};

/** Stamp rows into an Img (copy). */
export const stampImg = (src: Img, x: number, y: number, rows: string[], pal: MouthPal): Img => patchMouth(src, {x: 0, y: 0, w: 0, h: 0, fillFromRow: 0}, x, y, rows, pal);
