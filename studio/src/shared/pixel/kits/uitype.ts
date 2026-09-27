// MR. MAS — shared kit: UI TYPE for in-world screens (Ep1 Act Four v5 art pass; new file, owned by the v5 art pass).
// The engine's 7 px face (font.ts) has no ' & % @ ~ … ∞ — – [ ] # “ ” ♥ → and no curly quotes. THE EDITOR's animatic
// draws those in its own layout kit (episodes/ep01/act4/animatic/lay.ts `pt` / `bpt`), which shared art can't import.
// This is the same extra-glyph table (copied 2026-09-26, plus ♥ and the two curly apostrophes' closing forms), so the
// v5 screens (posts, the blog draft, the staff letter, the call notices) set real punctuation in shared code.
// Engine owner: fold XG into font.ts's G table (additive) and point both kits at it.
//   pt(b, s, x, y, col, {shadow})   7 px text with the extras          pw(s)   its width
//   bpt(...)                        the 14 px display face with them   bpw(s)  its width
//   pwrap(s, maxW) / bpwrap(...)    greedy word wrap for either face
import {Buf, rect} from '../px';
import {text, textWidth, bigText, bigTextWidth} from '../font';

const XG: Record<string, string[]> = {
  "'": ['#', '#', '.', '.', '.', '.', '.'],
  '’': ['#', '#', '.', '.', '.', '.', '.'],
  '‘': ['#', '#', '.', '.', '.', '.', '.'],
  '&': ['.##..', '#..#.', '.##..', '.#.#.', '#..##', '#..#.', '.##.#'],
  '%': ['##..#', '##.#.', '...#.', '..#..', '.#...', '.#.##', '#..##'],
  '@': ['.###.', '#...#', '#.###', '#.#.#', '#.###', '#....', '.###.'],
  '~': ['......', '......', '.##..#', '#..##.', '......', '......', '......'],
  '…': ['.....', '.....', '.....', '.....', '.....', '.....', '#.#.#'],
  '∞': ['.......', '.......', '.##.##.', '#..#..#', '.##.##.', '.......', '.......'],
  '—': ['......', '......', '......', '######', '......', '......', '......'],
  '–': ['....', '....', '....', '####', '....', '....', '....'],
  '[': ['##', '#.', '#.', '#.', '#.', '#.', '##'],
  ']': ['##', '.#', '.#', '.#', '.#', '.#', '##'],
  '#': ['.#.#.', '#####', '.#.#.', '.#.#.', '#####', '.#.#.', '.....'],
  '“': ['#.#', '#.#', '...', '...', '...', '...', '...'],
  '”': ['#.#', '#.#', '...', '...', '...', '...', '...'],
  '"': ['#.#', '#.#', '...', '...', '...', '...', '...'],
  '*': ['.....', '#.#.#', '.###.', '#####', '.###.', '#.#.#', '.....'],
  '→': ['.....', '...#.', '....#', '#####', '....#', '...#.', '.....'],
  '(': ['.#', '#.', '#.', '#.', '#.', '#.', '.#'],
  ')': ['#.', '.#', '.#', '.#', '.#', '.#', '#.'],
  '♥': ['.......', '.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'],
};
const cw = (ch: string) => (ch === ' ' ? 3 : XG[ch] ? XG[ch][0].length : textWidth(ch));
export const pw = (s: string) => { let w = 0; for (const ch of s) w += cw(ch) + 1; return Math.max(0, w - 1); };
/** 7 px text with the extra glyphs (top at y, caps on rows y..y+6). */
export const pt = (b: Buf, s: string, x: number, y: number, col: number, o: {shadow?: number} = {}) => {
  const draw = (ox: number, oy: number, c: number) => {
    let cx = x + ox;
    for (const ch of s) {
      if (XG[ch]) XG[ch].forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') b.set(cx + i, y + oy + j, c); });
      else if (ch !== ' ') text(b, ch, cx, y + oy, c);
      cx += cw(ch) + 1;
    }
  };
  if (o.shadow !== undefined) draw(1, 1, o.shadow);
  draw(0, 0, col);
};
const wrapWith = (meas: (s: string) => number) => (s: string, maxW: number) => {
  const out: string[] = [];
  let cur = '';
  for (const w of s.split(' ')) { const t = cur ? cur + ' ' + w : w; if (meas(t) > maxW && cur) { out.push(cur); cur = w; } else cur = t; }
  if (cur) out.push(cur);
  return out;
};
export const pwrap = wrapWith(pw);
const bw = (ch: string) => (ch === ' ' ? 6 : XG[ch] ? XG[ch][0].length * 2 : bigTextWidth(ch));
export const bpw = (s: string) => { let w = 0; for (const ch of s) w += bw(ch) + 2; return Math.max(0, w - 2); };
/** 14 px display text with the extras (as 2 x 2 blocks). */
export const bpt = (b: Buf, s: string, x: number, y: number, col: number, o: {shadow?: number} = {}) => {
  let cx = x;
  for (const ch of s) {
    if (XG[ch]) XG[ch].forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') { if (o.shadow !== undefined) rect(cx + i * 2 + 1, y + j * 2 + 1, 2, 2, b.ink(o.shadow)); rect(cx + i * 2, y + j * 2, 2, 2, b.ink(col)); } });
    else if (ch !== ' ') bigText(b, ch, cx, y, col, {shadow: o.shadow});
    cx += bw(ch) + 2;
  }
};
export const bpwrap = wrapWith(bpw);
/** Type-on helper: the first n characters of a list of wrapped lines (n counts the joining spaces too). */
export const typedLines = (lines: string[], n: number): string[] => {
  let left = n;
  return lines.map((l) => { const s = l.slice(0, Math.max(0, left)); left -= l.length + 1; return s; });
};
