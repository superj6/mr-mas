// MR. MAS — outro proposal C ("after hours: DAYS SINCE"): the text package and the per-episode data.
// The words are show/production/OUTRO-PROPOSALS.md §1.1, exactly. The directory is a letter board, so its rows are
// set in capitals (§4); the terms line and the pointer stay in sentence case in the band (§1.1 rule 3: never on a
// NopeAI surface). LEGAL REVIEW IS PENDING on all of it (§10).

/** The terms line: the same all season, one row of the 7-px face (389 px). Never moves, never covered. */
export const TERMS = 'A parody. Events dramatized, scenes invented. No one depicted took part or endorsed it.';
/** The pointer to the full notice (the 90-word text, the credits in full, the tools by name, the receipts). */
export const POINTER = 'Full notice and sources: in the description.';
/** Lookdev-only corner slug (never on a delivery render). */
export const SLUG = 'LEGAL TEXT: DRAFT';

/** A directory row:
 *  - title: the episode's file, left; its closing date, right-aligned; dot leaders between (the TOC row)
 *  - label: a credit field, left; its value on the board's VALUE COLUMN (one x for every row), dot leaders between
 *    whose right ends all stop at one x, so the rows read as a grid (the second pass: no wrapped values, no
 *    3-dot rows next to 40-dot rows)
 *  - centre: a centred line; vacant: an empty groove */
export type DirRow = {title: string; value: string} | {label: string; value: string} | {centre: string} | {vacant: true};

export interface EpisodeOutro {
  ep: number;
  /** the episode's file, as the board spells it */
  file: string;
  /** the episode's last rail date, on the title row after CLOSED: it is what the count is counted TO, so a newcomer
   *  can read "36 days since, as of DEC 27, 2023" without knowing the reset date (the cold read's "why 36?") */
  closed: string;
  /** DAYS SINCE: the count hung this week, and how it gets there */
  count: string;
  /** the rows of the directory under the header (9 grooves in all, including the header) */
  rows: DirRow[];
}

/** §1.1's six credit fields, as board rows (labels and values split where the source has its colon): the title
 *  row, an empty groove, then the five credit rows, each on ONE line. */
const credits = (file: string, closed: string): DirRow[] => [
  {title: `MR. MAS · ${file}`, value: `CLOSED ${closed}`},
  {vacant: true},
  {label: 'CREATED BY', value: '(CREATOR)'},
  {label: 'WRITTEN', value: '(CREATOR), WITH AI'},
  {label: 'PICTURE · MUSIC', value: 'PIXEL ART AND ORIGINAL SCORE, RENDERED IN CODE'},
  {label: 'VOICES', value: 'SYNTHETIC, DESIGNED FROM TEXT · NONE CLONED'},
  {label: 'AI TOOLS', value: 'USED THROUGHOUT · LISTED IN THE NOTICE'},
];

export const EP1: EpisodeOutro = {
  ep: 1,
  file: 'EP1.0_RESEARCH_PREVIEW.MD',
  // show/INDEX.md: Ep1 runs Nov 30, 2022 -> DEC 27, 2023 (its last rail date)
  closed: 'DEC 27, 2023',
  // NOV 21, 2023 (the sign's reset, fixed by Ep1's script) -> DEC 27, 2023 (Ep1's last rail date) = 36 days
  count: '36',
  rows: [...credits('EP1.0_RESEARCH_PREVIEW.MD', 'DEC 27, 2023'), {vacant: true}],
};

export const EP4: EpisodeOutro = {
  ep: 4,
  file: 'EP1.3_NOT_FOR_SALE.EML',
  closed: 'APR 30, 2025',
  // the reset: NOLE's bid, FEB 10, 2025 -> Ep4's last rail date APR 30, 2025 (show/INDEX.md) = 79 days
  count: '79',
  rows: [...credits('EP1.3_NOT_FOR_SALE.EML', 'APR 30, 2025'), {vacant: true}],
};

export const EP10: EpisodeOutro = {
  ep: 10,
  file: 'EP1.9_PACE.YAML',
  // show/INDEX.md: Ep10's rail runs "OCT 2026?" -> "2027??": the date has lost its grip too
  closed: '2027??',
  // the calendar has lost its grip (§4): no arithmetic, two question plates
  count: '??',
  rows: [...credits('EP1.9_PACE.YAML', '2027??'), {label: 'THE INTERN', value: 'CORNER OFFICE'}],
};
