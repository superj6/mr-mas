// MR. MAS — outro proposal C ("after hours: DAYS SINCE"): the text package and the per-episode data.
// The terms line and the pointer are show/production/OUTRO-PROPOSALS.md §1.1, exactly (sentence case, in the band:
// §1.1 rule 3, never on a NopeAI surface). LEGAL REVIEW IS PENDING on all of it (§10).
//
// THE BOARD (fourth pass, after the cold read of the 8.5 s file): "cut the directory down to what can be read in
// the quiet before the hand arrives: about three short, larger lines". §1.1's six credit rows (≈ 16 s of reading at
// 16 cps, set in the 7-px face with dot leaders that went to mush at 480x270) become:
//   - one small row: the show and the episode's file (the building's name on its own directory: skimmable)
//   - THREE big rows (the 14-px display face, centred, no leaders): the credit, and the AI disclosure in two lines
//   - one small egg row at the bottom, empty in Ep1 (Ep6 on: RESERVED; Ep10 on: THE INTERN · CORNER OFFICE)
// The dropped words are not lost: §1.1's full credits (written, picture · music rendered in code, the voices
// designed from text, the tools by name) move to the notice the pointer names. The on-screen disclosure still says
// the two things the brief needs: AI was used to make it, and the voices are synthetic with none cloned.

/** The terms line: the same all season, one row of the 7-px face (389 px). Never moves, never covered. */
export const TERMS = 'A parody. Events dramatized, scenes invented. No one depicted took part or endorsed it.';
/** The pointer to the full notice (the 90-word text, the credits in full, the tools by name, the receipts). */
export const POINTER = 'Full notice and sources: in the description.';
/** Lookdev-only corner slug (never on a delivery render). */
export const SLUG = 'LEGAL TEXT: DRAFT';

/** The three big rows: the same all season unless the credits change (the creator's credit line is still the
 *  brief's placeholder; the disclosure is exact per episode, from its provenance manifests: GENAI plan §1.8). */
export const CREDITS = ['CREATED BY (CREATOR)', 'MADE WITH AI', 'AI VOICES · NONE CLONED'];

export interface EpisodeOutro {
  ep: number;
  /** the small top row: the show and the episode's file, as the board spells it */
  head: string;
  /** the big rows */
  credits: string[];
  /** the small bottom row (an egg tenant), or '' */
  egg: string;
  /** DAYS SINCE: last night's count, and tonight's (the hand lifts yesterday's units plate off; tonight's is
   *  already hung behind it, like a tear-off calendar). Tonight's count = days from the sign's last reset to the
   *  episode's last rail date. */
  from: string;
  count: string;
}

export const EP1: EpisodeOutro = {
  ep: 1,
  head: 'MR. MAS · EP1.0_RESEARCH_PREVIEW.MD',
  credits: CREDITS,
  egg: '',
  // NOV 21, 2023 (the reset, sc 30) -> DEC 27, 2023 (Ep1's last rail date, show/INDEX.md) = 36 days. The outro opens
  // on last night's 35 (a newcomer reads "days have passed since the 0 in sc 30") and the hand turns it to 36.
  from: '35',
  count: '36',
};

export const EP4: EpisodeOutro = {
  ep: 4,
  head: 'MR. MAS · EP1.3_NOT_FOR_SALE.EML',
  credits: CREDITS,
  egg: '',
  // the reset: NOLE's bid, FEB 10, 2025 -> Ep4's last rail date APR 30, 2025 (show/INDEX.md) = 79 days
  from: '78',
  count: '79',
};

export const EP10: EpisodeOutro = {
  ep: 10,
  head: 'MR. MAS · EP1.9_PACE.YAML',
  credits: CREDITS,
  egg: 'THE INTERN · CORNER OFFICE',
  // the calendar has lost its grip (§4): no arithmetic, two question plates, and no hand
  from: '??',
  count: '??',
};
