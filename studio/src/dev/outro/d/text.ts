// MR. MAS — outro D: the text package (OUTRO-PROPOSALS §1.1, exact) and the per-episode values.
// `(creator)` is the placeholder until the showrunner gives the credit line. The terms line and the pointer are the
// same all season; only the plates' surface, the dot and the palette ladder change week to week.

export const TERMS = 'A parody. Events dramatized, scenes invented. No one depicted took part or endorsed it.';
export const POINTER = 'Full notice and sources: in the description.';
/** lookdev renders only */
export const SLUG = 'LEGAL TEXT: DRAFT';
/** the title field (§1.1 `MR. MAS` · the episode's filename), split at its `·` into the show name and the file */
export const SHOW = 'MR. MAS';

/** How a plate is surfaced: the palette ladder (the capability curve made literal). */
export type Tier = 'onebit' | 'web16' | 'base' | 'machine';

export interface PlateDef {
  /** 'cursor' = the eighth plate, the empty post box */
  kind: 'text' | 'cursor';
  lines: string[];
}

/**
 * d4: the title field no longer rides the line (it scrolled off and was cut in d3). The show name and the file are
 * one anchored title block (world.ts drawTitle), so what rides the knee is the five other §1.1 fields, word for word,
 * and the post box. The long fields break after their label. Order (by read time, measured by readAudit(): every
 * plate is wholly on screen and settled for >= 16 chars/s + 0.5 s):
 *   flat (1-BIT, short fields, folded once read): created by (2.1) · written (2.3)
 *   leap (EARLY-WEB16, the long fields, held to the out): picture · music (G) · voices (Ab) · AI tools (C)
 *   top: the empty post box (F)
 * The AI-tool disclosure is the last credit before the empty post box.
 */
export const PLATES: PlateDef[] = [
  {kind: 'text', lines: ['created by (creator)']},
  {kind: 'text', lines: ['written: (creator), with AI']},
  {kind: 'text', lines: ['picture · music:', 'pixel art and original score, rendered in code']},
  {kind: 'text', lines: ['voices:', 'synthetic, designed from text · none cloned']},
  {kind: 'text', lines: ['AI tools:', 'used throughout · listed in the notice']},
  {kind: 'cursor', lines: []},
];

export interface EpCfg {
  ep: number;
  file: string;
  /** the palette ladder: the flat line's floor, the leap, the top (the post box, and the title's last step) */
  tiers: {flat: Tier; leap: Tier; top: Tier};
  /** the `you are here` dot: u along the rise by x (0 = the knee, 1 = the top), or 'up' = off the top (`you are ↑`) */
  dot: number | 'up';
  /** Ep10 on: the thread is drawn to the top from the start and the plates arrive a beat before their notes */
  machineLeads: boolean;
  /** the week's stinger object (Ep1: the Senate moth, which goes to the light: the post box) */
  stinger: 'moth' | null;
}

/** Ep1 values (the dot at 0.55 past the knee: OUTRO-PROPOSALS §5, one step on from where the intro puts Ep1). */
export const EP1: EpCfg = {ep: 1, file: 'ep1.0_research_preview.md', tiers: {flat: 'onebit', leap: 'web16', top: 'base'}, dot: 0.55, machineLeads: false, stinger: 'moth'};
/** Ep7: the floor has risen to BASE; the post box holds the month's machine render (programmatic filler here). */
export const EP7: EpCfg = {ep: 7, file: 'ep1.6_supply_chain_risk.pdf', tiers: {flat: 'base', leap: 'base', top: 'machine'}, dot: 0.85, machineLeads: false, stinger: null};
/** Ep10 (SPEC): the machine leads. The dot is off the top of the chart. */
export const EP10: EpCfg = {ep: 10, file: 'ep1.9_pace.yaml', tiers: {flat: 'base', leap: 'base', top: 'machine'}, dot: 'up', machineLeads: true, stinger: null};
export const EPS: Record<number, EpCfg> = {1: EP1, 7: EP7, 10: EP10};
