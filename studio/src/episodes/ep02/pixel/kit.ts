// MR. MAS — Ep2 v1 pixel pipeline (a copy of Ep1s): one import for a shot pass's layouts. The pipeline's own pieces (the spec, the
// lip-sync on PxShots, the default text) and the show's layout helpers that Act Four built and every act shares (the
// pixel font, held drawings, the framing moves). The art itself (rooms, cast, kits) is imported from shared/pixel/.
//   import {defineScene, layouts, held, on2, RH, mouth, roomMouth, talking, drawTexts} from '../../kit';   (a scene module)
// The layout helpers below are Ep1's Act Four modules (studio/src/episodes/ep01/act4/animatic/), IMPORTED read-only:
// Ep1 is locked, so they never change under Ep2; an Ep2 helper goes in a new Ep2 file, never into them.
export {defineSegment, layouts, defineScene, fromScenes, sceneSlug} from './spec';
export type {Layout, LayoutOut, Draw, Transition, PixelSegment, SegmentOptions, ReviewConfig, Anchor, SceneSpec} from './spec';
export type {PxShot, PxLine, PxText, PxScene, SegLock, Face} from './types';
export {mouth, roomMouth, room3Mouth, talking, lineAt, lipOn, silentMouth, lipTrack, roomTrack, LIP} from './lipsync';
export {drawTexts, drawPlate, drawCard, drawTag, drawButton, otext} from './text';
export {drawStandin, standinTag} from './standin';
export {RH} from '../../ep01/act4/animatic/lay';
/** the pixel font (7 px) and the display face; `plain` swaps typographic marks the font lacks */
export {pt, pw, pwrap, bpt, bpw, bpwrap, plain, ACCENT} from '../../ep01/act4/animatic/lay';
/** a held drawing: draw once per key, then copy (backgrounds that never change) */
export {held, dimRect, dimRoom, fallaway} from '../../ep01/act4/animatic/lay';
/** framing moves, all whole-pixel: soft focus, vignette, a 3-step rack, a slow drift, a room shift, whip smear */
export {soft, softMask, keepRect, vignette, rackStep, RACK, drift, shiftRoom, whipSmear, spotlight, doorFrame} from '../../ep01/act4/animatic/framing';
/** hold a drawing on 2s / 4s (the show's animation rate) */
export const on2 = (k: number) => k - (k % 2);
export const on4 = (k: number) => k - (k % 4);
/** a mark with a default (a layout keeps drawing when the lock has not placed the mark yet) */
export const mk = (sh: {marks: Record<string, number>}, name: string, dflt: number) => sh.marks[name] ?? dflt;
