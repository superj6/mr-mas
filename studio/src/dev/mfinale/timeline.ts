// MR. MAS — mfinale: intro frames 540-719 (bars 10-12: the skyline, the title, the bookend). Every time in this
// folder is a GLOBAL intro frame (the numbers in INTRO_PIXEL_BRIEF.md / final.md §3), so the art reads 1:1
// against the shot table. The composition is 180 frames long; local frame 0 = global 540. Mount it with
// <MFinaleSequence/>. Bar 9 (480-539) is the roll call (src/dev/mrollcall, <MRollcallSequence/>): brief v2.1
// cut the old per-episode slot (CHATGTP / FIRED / BACK) from the intro; slot.ts and callart.ts are kept only
// as Ep1 material and are not mounted here.
import {FRAMES_PER_BEAT, at} from '../../shared/timing';

export const MF_START = 540;
export const MF_END = 720; // exclusive
export const MF_FRAMES = MF_END - MF_START; // 180
/** bar 9, the roll call, mounted before this span in the full intro (and in the `mfinale-bars9-12` review comp) */
export const ROLLCALL_START = 480;
export const BEAT = FRAMES_PER_BEAT; // 15
/** local composition frame -> global intro frame */
export const toGlobal = (local: number) => local + MF_START;

// ---------------------------------------------------------------- the beat grid for this span
export const T = {
  // Ep1 only (slot.ts / callart.ts; not in the intro since brief v2.1): the old bar-9 slot
  chat: at(9, 1), // 480  CHATGTP: the tap, the bloom, the odometer
  fired: at(9, 2), // 495 FIRED.: desaturated call, Cancel works, Mas's tile dissolves into tokens
  back: at(9, 3), // 510  BACK.: colour slams back, tile re-forms, GUEST -> CEO (f518), hourglass shatters
  hearts: at(9, 4), // 525 heart avalanche carries the camera up into the dusk
  // bars 10-11.2: the skyline
  sky: at(10, 1), // 540  (NopeAI standing, MACROSOFT pops)
  line: at(11, 2) + 7, // 622 every rooftop ignites into one cyan line
  // bars 11.3-12.2: the title
  title: at(11, 3), // 630
  subtitle: at(11, 3) + 10, // 640
  // bars 12.3-12.4: the bookend
  book: at(12, 3), // 690 pull back into Mas's monitor
  orbTurn: at(12, 3) + 2, // 692 back in the room: the Orb turns its iris to the lens
  last: at(12, 4), // 705 the last beat: ding, eyes to the lens, the Orb's iris shows the skyline in GLYPH (2f)
} as const;

/** Tower pops, one per beat (final.md 10.1-11.2). The exes pop together on 11.1. */
export const POPS = {
  macrosoft: at(10, 1), // 540
  elgoog: at(10, 2), // 555 (MINDDEEP annex with it)
  atem: at(10, 3), // 570
  invidia: at(10, 4), // 585
  misanthropic: at(11, 1), // 600
  zai: at(11, 1), // 600
  peekdeep: at(11, 2), // 615 (quiet pop)
} as const;

/** 2 frames of GLYPH in the Orb's iris, on the last beat (brief: "on the last beat ... for 2 frames ... before settling"). */
export const IRIS_GLYPH = {from: T.last, frames: 2};

export const inSpan = (g: number, a: number, b: number) => g >= a && g < b;
export const beatOf = (g: number) => Math.floor(g / BEAT);
