// MR. MAS — outro E: text on the native grid. The shared 7-px face (shared/pixel/font.ts, read-only) plus the few
// glyphs it lacks, drawn here locally in the same style (the brief: never edit the shared font).
//   '#'  raw markdown headings (Ep1) and YAML comments (Ep10)
//   '|'  a bar (unused on screen now; kept for the Ep9 .log ladder)
//   '[' ']' '<' '&' '@'  not used on screen; kept so a later file type cannot silently fall back to a 4-px gap
import {Buf} from '../../../shared/pixel/px';
import {text as sharedText, textWidth as sharedWidth, SPACE, TRACK} from '../../../shared/pixel/font';

const LOCAL: Record<string, string[]> = {
  '#': ['.#.#.', '.#.#.', '#####', '.#.#.', '#####', '.#.#.', '.#.#.'],
  '|': ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
  '[': ['##', '#.', '#.', '#.', '#.', '#.', '##'],
  ']': ['##', '.#', '.#', '.#', '.#', '.#', '##'],
  '<': ['...#', '..#.', '.#..', '#...', '.#..', '..#.', '...#'],
  '&': ['.##..', '#..#.', '.##..', '.#...', '#.#.#', '#..#.', '.##.#'],
  '@': ['.###.', '#...#', '#.###', '#.#.#', '#.##.', '#....', '.####'],
};

const cw = (ch: string) => (ch === ' ' ? SPACE : LOCAL[ch] ? LOCAL[ch][0].length : sharedWidth(ch));

/** width in px of a string in the 7-px face, local glyphs included */
export const strW = (s: string) => {
  let w = 0;
  for (const ch of s) w += cw(ch) + TRACK;
  return Math.max(0, w - TRACK);
};

/** draw a string with its cap top at y; returns the x just after the last glyph (plus tracking) */
export const str = (b: Buf, s: string, x: number, y: number, col: number) => {
  let cx = x;
  for (const ch of s) {
    const g = LOCAL[ch];
    if (g) g.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') b.set(cx + i, y + j, col); });
    else if (ch !== ' ') sharedText(b, ch, cx, y, col);
    cx += cw(ch) + TRACK;
  }
  return cx;
};

export type Seg = [string, number];
/** a run of coloured segments on one line */
export const segs = (b: Buf, parts: Seg[], x: number, y: number) => {
  let cx = x;
  for (const [s, c] of parts) cx = str(b, s, cx, y, c);
  return cx;
};
export const segsW = (parts: Seg[]) => strW(parts.map((p) => p[0]).join(''));
