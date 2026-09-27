// MR. MAS — outro A: the text package, per-episode values, and the type tools.
// Second polish pass (cold read 2): ONE block, ONE face. The terms line and the pointer are no longer a second
// block in the band under the picture: they are the log's last lines, set in the same fixed-width face as the
// credits, under a dotted rule, and the credit lines are cut to under half their words (32 -> 13). The terms line
// keeps the brief's words exactly (OUTRO-PROPOSALS §1.1); it is set on two rows because 87 fixed-width cells don't
// fit the frame. The long forms of the credits move to the description with the full notice.
//   §1.1 field            §1.1 Ep1 value (the long form, now in the description)          on screen now
//   Title                 MR. MAS · ep1.0_research_preview.md                              the title bar (unchanged)
//   Created by            (creator)                                                       created by  (creator)
//   Written               (creator), with AI                                              } made  in code, with AI tools
//   Picture · music       pixel art and original score, rendered in code                   }
//   AI tools              used throughout · listed in the notice                            }
//   Voices                synthetic, designed from text · none cloned                     voices  synthetic, none cloned
// The AI-tool disclosure is still the last two credit rows (`made`, `voices`), and it is still exact per episode:
// the `made` row is the one that changes when an outside layer ships (a video-model plate, a Blender object).
import {Buf, rect} from '../../../shared/pixel/px';
import {text, textWidth} from '../../../shared/pixel/font';

/** One line, the same all season (never animated, never covered, never a gag). The pane prints it whole, at
 *  once, never types it; it sets it on two fixed-width rows (TERMS_ROWS), which join back to exactly this. */
export const TERMS = 'A parody. Events dramatized, scenes invented. No one depicted took part or endorsed it.';
export const TERMS_ROWS = ['A parody. Events dramatized, scenes invented.', 'No one depicted took part or endorsed it.'] as const;
export const POINTER = 'Full notice and sources: in the description.';
/** the legal block as the log prints it: the terms (2 rows), then the pointer */
export const LEGAL_ROWS = [...TERMS_ROWS, POINTER];
/** lookdev renders only */
export const SLUG = 'LEGAL TEXT: DRAFT';

export interface EpText {
  ep: number;
  file: string;
  /** the Title credit: MR. MAS · the episode's filename (the pane's title bar) */
  title: string;
  /** the log's first line */
  header: string;
  /** the episode's last rail date, set flush right on the header row (none when the rail is undated) */
  date?: string;
  /** [label, value] in order: created by, made, voices (the last two are the AI-tool disclosure) */
  credits: Array<[string, string]>;
  /** Ep10+: a line the machine adds itself, ticked by itself */
  extra?: [string, string];
  /** the red clock on his shelf in the room shot (per episode: the hour the session closed) */
  clock: string;
}

const credits = (): Array<[string, string]> => [
  ['created by', '(creator)'],
  ['made', 'in code, with AI tools'],
  ['voices', 'synthetic, none cloned'],
];

export const EP1: EpText = {
  ep: 1,
  file: 'ep1.0_research_preview.md',
  title: 'MR. MAS · ep1.0_research_preview.md',
  header: 'session closed',
  date: 'DEC 27, 2023',
  credits: credits(),
  clock: '1:36', // the cold open's own time
};
/** Ep6 (BASE UI skin). Date = the episode's span end (outline: Sep 1 -> Dec 31, 2025); a placeholder until its
 *  last rail date is locked. The credits deltas (§1.1) are unknown yet, so the Ep1 values stand in. */
export const EP6: EpText = {
  ep: 6,
  file: 'ep1.5_backstop.xlsx',
  title: 'MR. MAS · ep1.5_backstop.xlsx',
  header: 'session closed',
  date: 'DEC 31, 2025',
  credits: credits(),
  clock: '2:48', // placeholder
};
/** Ep10: extrapolated; its rail is undated (ep10 outline), so the header carries no date. The machine types the
 *  log and adds a line of its own. */
export const EP10: EpText = {
  ep: 10,
  file: 'ep1.9_pace.yaml',
  title: 'MR. MAS · ep1.9_pace.yaml',
  header: 'session closed',
  credits: credits(),
  extra: ['reviewed by', 'a human'],
  clock: '4:07', // placeholder
};

// ------------------------------------------------------------------ fixed-width setting of the shared 7-px face
/** the pane's monospace cell: every glyph centred in 6 px (the widest glyphs are 5) */
export const CELL = 6;
/** the value column (in cells): `created by` + 2 spaces */
export const COL = 12;

/**
 * Terminal forms of the narrow letters (local, the shared face is untouched): slab-serifed i, l, r, t and f fill their
 * 6-px cell the way a real terminal face does, so words don't break apart ("wr i tten", "l isted") in fixed width.
 */
const MONO_FORMS: Record<string, string[]> = {
  i: ['..#..', '.....', '.##..', '..#..', '..#..', '..#..', '.###.'],
  l: ['.##..', '..#..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  r: ['.....', '.....', '#.##.', '##..#', '#....', '#....', '#....'],
  t: ['.#...', '.#...', '####.', '.#...', '.#...', '.#...', '..##.'],
  f: ['..##.', '.#...', '####.', '.#...', '.#...', '.#...', '.#...'],
};

/** Draw `s` fixed-width from (x, y); returns the x after the last cell. Missing glyphs leave their cell empty. */
export const mono = (b: Buf, s: string, x: number, y: number, col: number) => {
  let cx = x;
  for (const ch of s) {
    const form = MONO_FORMS[ch];
    if (form) form.forEach((r, j) => { for (let i = 0; i < 5; i++) if (r[i] === '#') b.set(cx + i, y + j, col); });
    else if (ch !== ' ') {
      const w = textWidth(ch);
      text(b, ch, cx + Math.floor((5 - Math.min(5, w)) / 2), y, col);
    }
    cx += CELL;
  }
  return cx;
};
export const monoWidth = (s: string) => [...s].length * CELL - 1;

/** A credit row as one fixed-width string (label padded to the value column). */
export const creditRow = ([l, v]: [string, string]) => l.padEnd(COL, ' ') + v;

/**
 * Typing: the row is typed at `cps` characters a frame from `start`; the column padding costs one keystroke
 * (a tab). Returns how many characters of creditRow() are visible at outro frame o, and the frame it completes.
 */
export const typed = (row: [string, string], start: number, o: number, cps: number) => {
  const full = creditRow(row);
  const keys = row[0].length + 1 + row[1].length; // label + tab + value
  const k = o < start ? 0 : Math.min(keys, (o - start + 1) * cps);
  const shown = k <= row[0].length ? k : k === row[0].length + 1 ? COL : COL + (k - row[0].length - 1);
  return {shown: Math.min(full.length, shown), done: start + Math.ceil(keys / cps) - 1, full};
};

/** A checkbox, drawn locally (the face has no [ ]): a 7x7 box on the cap line, ticked with a hand-set 5x4 tick. */
export const checkbox = (b: Buf, x: number, y: number, col: number, ticked: boolean, tick = col) => {
  rect(x, y, 7, 1, b.ink(col)); rect(x, y + 6, 7, 1, b.ink(col)); rect(x, y, 1, 7, b.ink(col)); rect(x + 6, y, 1, 7, b.ink(col));
  if (ticked) ['....#', '...#.', '#.#..', '.#...'].forEach((r, j) => { for (let i = 0; i < 5; i++) if (r[i] === '#') b.set(x + 1 + i, y + 1 + j, tick); });
};

/** the lookdev slug, top-right: dim red type on the picture, no box (it marks the render; it isn't part of it) */
export const SLUG_INK = 0x9a3440;
export const drawSlug = (ui: Buf, label = SLUG) => {
  const x = 480 - textWidth(label) - 5, y = 4;
  rect(x - 2, y - 1, textWidth(label) + 4, 9, ui.ink(0x04050a));
  text(ui, label, x, y, SLUG_INK);
};
/** a lookdev label, top-left (the stand-in second), in the same quiet style */
export const drawTag = (ui: Buf, label: string) => {
  const x = 5, y = 4;
  rect(x - 2, y - 1, textWidth(label) + 4, 9, ui.ink(0x04050a));
  text(ui, label, x, y, SLUG_INK);
};
