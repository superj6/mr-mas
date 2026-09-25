// MR. MAS — intro-ep1: the EDIT DECISION LIST (picture). Single source of the cut frames for the full 720-frame
// opening (SCRIPT.md v2.1, show/intro/SCRIPT.md). Every number is a GLOBAL intro frame (96 BPM / 24 fps, 15 f/beat).
//
// Each moment renders on its own clock; the integrator only decides WHICH moment owns each global frame.
// A moment's composition frame 0 is its own `origin` (the global frame its local clock starts at); it is mounted
// from `from` to `to` inclusive. Where two moments overlap (225-239, 345-359) the later one takes over at `from`.
// Rationale for each cut is in studio/notes/intro.md ("Handoffs").
import {INTRO_FRAMES} from '../shared/timing';

export type MomentId = 'mcoldopen' | 'meras' | 'mdinner1' | 'mdinner2' | 'mrollcall' | 'mfinale';

export interface Edit {
  id: MomentId;
  /** the global frame the moment's local frame 0 corresponds to (its own timeline.ts start) */
  origin: number;
  /** the moment's authored span, inclusive (what it can render) */
  span: [number, number];
  /** first and last global frame this moment is ON SCREEN in the intro, inclusive */
  from: number;
  to: number;
  /** how we enter this edit */
  cutIn: string;
}

export const EDL: Edit[] = [
  {id: 'mcoldopen', origin: 0, span: [0, 119], from: 0, to: 119, cutIn: 'head of the loop (f0 = the cursor blink, the f719 state)'},
  {id: 'meras', origin: 120, span: [120, 239], from: 120, to: 224, cutIn: 'hard cut on the 3.1 downbeat, paper white -> 1-bit 1993'},
  {id: 'mdinner1', origin: 225, span: [225, 359], from: 225, to: 344, cutIn: '4.4 match cut: the crown glint becomes the candelabra flame on the same pixel'},
  {id: 'mdinner2', origin: 345, span: [345, 479], from: 345, to: 479, cutIn: '6.4 invisible edit inside the pixel-identical 345-359 overlap (first frame of the overlap)'},
  {id: 'mrollcall', origin: 480, span: [480, 539], from: 480, to: 539, cutIn: '9.1 hard cut on the downbeat (stab 1)'},
  {id: 'mfinale', origin: 540, span: [540, 719], from: 540, to: 719, cutIn: '10.1 hard cut on the downbeat onto the dusk skyline'},
];

/** The four handoffs the brief asks the integrator to decide (plus the loop), for the notes and the events export. */
export const HANDOFFS = {
  'meras->mdinner1': 225,
  'mdinner1->mdinner2': 345,
  'mdinner2->mrollcall': 480,
  'mrollcall->mfinale': 540,
} as const;

export const editAt = (g: number): Edit => EDL.find((e) => g >= e.from && g <= e.to) ?? EDL[EDL.length - 1];

// ---- sanity: the EDL tiles 0..719 exactly, and every edit sits inside its moment's authored span
(() => {
  let next = 0;
  for (const e of EDL) {
    if (e.from !== next) throw new Error(`EDL gap/overlap at ${e.id}: from ${e.from}, expected ${next}`);
    if (e.from < e.span[0] || e.to > e.span[1]) throw new Error(`EDL: ${e.id} ${e.from}-${e.to} outside its span ${e.span}`);
    next = e.to + 1;
  }
  if (next !== INTRO_FRAMES) throw new Error(`EDL ends at ${next - 1}, expected ${INTRO_FRAMES - 1}`);
})();
