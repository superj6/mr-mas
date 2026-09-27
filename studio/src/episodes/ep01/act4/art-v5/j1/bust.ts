// J1 v5 PORT (prep-artbuild-r3, 2026-09-26): copied unchanged from src/dev/jumps/proto1/bust.ts.
// MR. MAS — style-jump prototype 1 · the vignette's bust: Mas, engraved line by line.
// The art is generated offline by tools/engrave_bust.py into bustArt.ts (SVG fragments in the anime rig's bust units)
// from the ANIME rig's on-model geometry (shared/anime/Mas.tsx, copied; the shared rigs are untouched). The first
// build re-cut the tonal rig (masTone), whose straight one-angle hatching read at vignette size as a woman in a hood
// with a bun; this one is cut the way an engraver cuts a portrait: the hair's strands radiate from the cowlick's root
// and each front lock is cut root to tip; the face is cut in fine lines that follow its contour, the jaw lit; the
// hoodie's lines drape from the shoulders, the hood bunches behind the neck, the roll lies round it and the two
// drawstrings hang in paper white. Tone is line width. Pure (no DOM).
import {BUST_BODY, BUST_DEFS, BUST_IRIS_A, BUST_IRIS_B, BUST_OVER, BUST_SCALE} from './bustArt';

export {BUST_SCALE};

const fill = (s: string, ink: string, paper: string) => s.split('__INK__').join(ink).split('__PAPER__').join(paper);

/** The bust as one SVG fragment (defs + body + irises + the over layer). pupilStep: beat 3, his pupils step one
 *  line toward the holes (down and to the right). Everything else on him is identical in both drawings. */
export const engravedMasSvg = (pupilStep: boolean, ink: string, paper: string): string =>
  fill(`<defs>${BUST_DEFS}</defs>${BUST_BODY}${pupilStep ? BUST_IRIS_B : BUST_IRIS_A}${BUST_OVER}`, ink, paper);
