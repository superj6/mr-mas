// MR. MAS — outro E: the file window (generic, original chrome: no real OS or app), the Ep1 raw-markdown file,
// the desktop's bottom line (the terms + the pointer), and the close in 4 whole-pixel drawings.
// Native 480x270 pixels, master palette only.
import {Buf, rect} from '../../../shared/pixel/px';
import {PAL, stepColor} from '../../../shared/pixel/palette';
import {LOOP_CURSOR} from '../../mfinale/bookend';
import {str, strW, segs, Seg} from './text';

// ================================================================== layout
/** the window, keyline included: x 8-471, y 12-227. The strip under it is the desktop's bottom line */
export const WIN = {x: 8, y: 12, w: 464, h: 216};
export const TITLE_H = 13;
export const BODY = {x: WIN.x + 1, y: WIN.y + TITLE_H, w: WIN.w - 2, h: WIN.h - TITLE_H - 1};
/** the close box (9x9) at the title bar's right */
export const CLOSE = {x: WIN.x + WIN.w - 14, y: WIN.y + 2, w: 9, h: 9};
/** the pointer's tip on the close box */
export const CLOSE_AIM: [number, number] = [CLOSE.x + 4, CLOSE.y + 5];
export const GUTTER = 32;
export const TEXT_X = BODY.x + GUTTER + 6;
export const LINE_STEP = 11;
export const LINE0 = BODY.y + 11;

/** THE LOOP POINT. The built intro's own cursor (mfinale/bookend.ts LOOP_CURSOR = the cold open's CARET_FRAME,
 *  96,76): its f0 LCD macro is centred on it and its last frames (f712-719) leave the caret there on black.
 *  The brief and intro SCRIPT §3.1 give (298,124), which no built frame of the intro uses; see the entry header. */
export const CURSOR: [number, number] = LOOP_CURSOR;
export const CURSOR_C: [number, number] = [CURSOR[0] + 2, CURSOR[1] + 4];

// ================================================================== the words (proposal doc §1.1: the same all season)
export const TERMS = 'A parody. Events dramatized, scenes invented. No one depicted took part or endorsed it.';
export const POINTER_LINE = 'Full notice and sources: in the description.';
export const TERMS_Y = 237;
export const POINTER_Y = 248;
export const TERMS_X = Math.round((480 - strW(TERMS)) / 2);
export const POINTER_X = Math.round((480 - strW(POINTER_LINE)) / 2);
/** the terms line's final period (its single pixel): where the Ep1 moth settles, beside the words */
export const PERIOD: [number, number] = [TERMS_X + strW(TERMS) - 1, TERMS_Y + 6];
/** production paper on dark: P1 (#cfc6a8) sits just under the 80% white ceiling */
export const TERMS_COL = PAL.P1;

export const drawTerms = (b: Buf) => {
  str(b, TERMS, TERMS_X, TERMS_Y, TERMS_COL);
  str(b, POINTER_LINE, POINTER_X, POINTER_Y, TERMS_COL);
};

/** lookdev renders only: the corner slug */
export const SLUG = 'LEGAL TEXT: DRAFT';
export const drawSlug = (b: Buf) => str(b, SLUG, 480 - 8 - strW(SLUG), 2, PAL.R2);
/** lookdev renders only: the stand-in's own label, so nobody takes the cold-open frame for Ep1's real last frame */
export const STANDIN_SLUG = "STAND-IN: THE EPISODE'S LAST FRAME";
export const drawStandinSlug = (b: Buf) => {
  const w = strW(STANDIN_SLUG);
  rect(6, 1, w + 4, 9, b.ink(PAL.N0));
  str(b, STANDIN_SLUG, 8, 2, PAL.R2);
};

// ================================================================== chrome
export interface ChromeState { hover?: boolean; press?: boolean; selfHover?: boolean }

const fileIcon = (b: Buf, x: number, y: number, tag: 'md' | 'jpg' | 'yaml') => {
  // a page with a folded corner, 7x9, its type as a 1-px colour stripe (no logo)
  const edge = PAL.N7, face = PAL.N3;
  rect(x, y, 6, 9, b.ink(face));
  rect(x, y, 5, 1, b.ink(edge)); rect(x, y, 1, 9, b.ink(edge)); rect(x, y + 8, 7, 1, b.ink(edge)); rect(x + 6, y + 2, 1, 7, b.ink(edge));
  b.set(x + 5, y + 1, edge); b.set(x + 5, y + 2, edge); b.set(x + 4, y + 1, edge); b.set(x + 4, y + 2, edge); b.set(x + 5, y, PAL.N2);
  const stripe = tag === 'md' ? PAL.C5 : tag === 'jpg' ? PAL.R2 : PAL.W5;
  rect(x + 2, y + 4, 3, 1, b.ink(stripe)); rect(x + 2, y + 6, 2, 1, b.ink(stripe));
};

const closeBox = (b: Buf, s: ChromeState) => {
  const {x, y, w, h} = CLOSE;
  const down = s.press ? 1 : 0;
  const fill = s.press ? PAL.N4 : s.hover || s.selfHover ? PAL.N6 : PAL.N2;
  rect(x, y, w, h, b.ink(fill));
  const edge = s.hover || s.press || s.selfHover ? PAL.N7 : PAL.N5;
  rect(x, y, w, 1, b.ink(edge)); rect(x, y + h - 1, w, 1, b.ink(edge)); rect(x, y, 1, h, b.ink(edge)); rect(x + w - 1, y, 1, h, b.ink(edge));
  // the ✕: two 5-px diagonals, drawn (the shared face has none)
  const xc = s.hover || s.press || s.selfHover ? PAL.P1 : PAL.P0;
  for (let i = 0; i < 5; i++) { b.set(x + 2 + i, y + 2 + i + down, xc); b.set(x + 6 - i, y + 2 + i + down, xc); }
};

/** the whole window: keyline, title bar, body fill; `body` paints the file's own contents */
export const drawWindow = (b: Buf, title: string, tag: 'md' | 'jpg' | 'yaml', s: ChromeState, body: (b: Buf) => void) => {
  const {x, y, w, h} = WIN;
  rect(x, y, w, h, b.ink(PAL.N4));
  // title bar: flat, one highlight row, a divider under it
  rect(x + 1, y + 1, w - 2, TITLE_H - 1, b.ink(PAL.N2));
  rect(x + 1, y + 1, w - 2, 1, b.ink(PAL.N3));
  rect(x + 1, y + TITLE_H - 1, w - 2, 1, b.ink(PAL.N1));
  fileIcon(b, x + 6, y + 2, tag);
  str(b, title, x + 17, y + 3, PAL.P1);
  closeBox(b, s);
  // body
  rect(BODY.x, BODY.y, BODY.w, BODY.h, b.ink(PAL.N1));
  body(b);
  // soft corners
  for (const [cx, cy] of [[x, y], [x + w - 1, y], [x, y + h - 1], [x + w - 1, y + h - 1]]) b.set(cx, cy, PAL.N0);
};

// ================================================================== a plain text editor (Ep1 .md, Ep10 .yaml)
export interface EditorLine { n: number; segs: Seg[]; plain?: boolean }
/** a line the syntax colouring hasn't reached yet: every segment in one plain, dimmer ink (still legible) */
export const PLAIN = PAL.N7;
export const drawEditor = (b: Buf, lines: EditorLine[], caret: {line: number; x?: number; on: boolean} | null) => {
  // the gutter: line numbers, right-aligned, dim; a 1-px divider
  rect(BODY.x + GUTTER, BODY.y, 1, BODY.h, b.ink(PAL.N2));
  lines.forEach((ln, i) => {
    const y = LINE0 + i * LINE_STEP;
    const ns = String(ln.n);
    str(b, ns, BODY.x + GUTTER - 5 - strW(ns), y, PAL.N6);
    segs(b, ln.plain ? ln.segs.map(([t]) => [t, PLAIN] as Seg) : ln.segs, TEXT_X, y);
  });
  if (caret && caret.on) {
    const y = LINE0 + caret.line * LINE_STEP;
    rect(caret.x ?? TEXT_X, y - 1, 4, 8, b.ink(PAL.C7));
  }
};

// ================================================================== Ep1: ep1.0_research_preview.md, raw, at its end
// Polish pass: keys one rung brighter (C6; C5 lost contrast at 480x270), the heading's words C7.
const K = PAL.C6, V = PAL.P1, DIM = PAL.N8, MARK = PAL.N7;
/** the front-matter fences take the heading marks' cyan, so the first and last knee notes visibly light them too */
const FM = PAL.C4;
const kv = (k: string, v: string): Seg[] => [[k, K], [':', MARK], [' ' + v, V]];
export const EP1_TITLE = 'ep1.0_research_preview.md';
/**
 * The file's last 17 lines: the script's last beat, the heading, then the credits as a --- block.
 * ON-SCREEN VALUES (polish pass, a proposal for OUTRO-PROPOSALS s1.1): all six s1.1 fields, keys unchanged, three
 * values shortened so the block can be taken in while it is up (252 -> 174 characters): `title` drops the
 * filename (the title bar already shows it); `picture · music` keeps "rendered in code"; `voices` keeps
 * "synthetic · none cloned". The two AI-disclosure rows keep their meaning whole. The long forms move to the notice.
 */
export const EP1_LINES: EditorLine[] = [
  {n: 2100, segs: []},
  {n: 2101, segs: [['**', MARK], ['MAS', DIM], ['**', MARK]]},
  {n: 2102, segs: [['noted.', DIM]]},
  {n: 2103, segs: []},
  {n: 2104, segs: [['CUT TO BLACK on the hum.', DIM]]},
  {n: 2105, segs: []},
  {n: 2106, segs: [['###', PAL.C4], [' END CREDITS', PAL.C7]]},
  {n: 2107, segs: []},
  {n: 2108, segs: [['---', FM]]},
  {n: 2109, segs: kv('title', 'MR. MAS')},
  {n: 2110, segs: kv('created by', '(creator)')},
  {n: 2111, segs: kv('written', '(creator), with AI')},
  {n: 2112, segs: kv('picture · music', 'rendered in code')},
  {n: 2113, segs: kv('voices', 'synthetic · none cloned')},
  {n: 2114, segs: kv('AI tools', 'used throughout · listed in the notice')},
  {n: 2115, segs: [['---', FM]]},
  {n: 2116, segs: []},
];
export const EP1_CARET_LINE = 16;
/** the credits block, --- to ---: EP1_LINES[8..15], lit one line per note of the knee (timeline KNEE) */
export const EP1_BLOCK0 = 8;
export const EP1_BLOCK_N = 8;

/** `lit` = how many of the block's 8 lines the colouring has reached (8 = all; the stills) */
export const drawEp1Window = (b: Buf, s: ChromeState, caretOn: boolean, lit = EP1_BLOCK_N) =>
  drawWindow(b, EP1_TITLE, 'md', s, (bb) =>
    drawEditor(bb, EP1_LINES.map((ln, i) => (i >= EP1_BLOCK0 + lit && i < EP1_BLOCK0 + EP1_BLOCK_N ? {...ln, plain: true} : ln)),
      {line: EP1_CARET_LINE, on: caretOn}));

// ================================================================== the close: rows -> line -> dot -> gone
/**
 * Every drawing collapses toward the loop cursor, so the file closes INTO the cursor the next intro opens on.
 * `src` is the frame as it stood at the click (window drawn, no pointer). Whole pixels; no scaling filter, no blur.
 */
export const drawClose = (b: Buf, src: Buf, k: 0 | 1 | 2 | 3) => {
  const [px, py] = CURSOR_C;
  const x0 = WIN.x, x1 = WIN.x + WIN.w - 1;
  if (k === 0) {
    // ROWS: the window squashed to a quarter of its height around the cursor's row, as LCD rows (every other
    // row dark), one rung hotter: the picture giving its light back as it goes
    const hh = Math.round(WIN.h / 4);
    for (let r = 0; r < hh; r++) {
      if (r & 1) continue;
      const sy = WIN.y + r * 4;
      const ty = py - (hh >> 1) + r;
      for (let x = x0; x <= x1; x++) b.set(x, ty, stepColor(src.get(x, sy), 2));
    }
    return;
  }
  if (k === 1) {
    // LINE: one bright row the window's width, hotter toward the cursor; a dotted glow above and below
    for (let x = x0; x <= x1; x++) {
      const d = Math.abs(x - px);
      b.set(x, py, d < 40 ? PAL.C9 : d < 140 ? PAL.C8 : PAL.C6);
      if ((x & 1) === 0) { b.set(x, py - 1, d < 90 ? PAL.C4 : PAL.C2); b.set(x, py + 1, d < 90 ? PAL.C4 : PAL.C2); }
    }
    return;
  }
  if (k === 2) {
    // DOT: a short ember of the line, and the dot on the cursor's own spot
    for (let x = px - 9; x <= px + 9; x++) b.set(x, py, Math.abs(x - px) < 4 ? PAL.C8 : PAL.C4);
    rect(px - 1, py - 1, 3, 3, b.ink(PAL.C8));
    b.set(px, py, PAL.C9);
    return;
  }
  // GONE (one frame of a last ember, then nothing)
};
export const drawEmber = (b: Buf) => b.set(CURSOR_C[0], CURSOR_C[1], PAL.C3);

/** the loop cursor on the black desktop (4x8, the bookend's colour) */
export const drawCursor = (b: Buf) => rect(CURSOR[0], CURSOR[1], 4, 8, b.ink(PAL.C7));
