// MR. MAS — Ep2 v1 · example: the segment's layouts, ONE MODULE PER SCENE (scenes/sc-<scene>.ts, spec.ts defineScene).
// The import block between the markers is written by tools/scenes.py example (run it after every re-lock: it adds a stub
// for each new scene); draw in the scene modules, not here, so the per-scene cache re-renders only what changed.
import {defineSegment, fromScenes} from '../spec';
import type {SceneSpec} from '../spec';
import {LOCK} from './data';
// <scenes> (tools/scenes.py: one import per scene module, in the lock's order)
import {SCENE as sc_a} from './scenes/sc-a';
import {SCENE as sc_b} from './scenes/sc-b';
import {SCENE as sc_c} from './scenes/sc-c';
const SCENES: SceneSpec[] = [sc_a, sc_b, sc_c];
// </scenes>
export const SEGMENT = defineSegment({seg: 'example', lock: LOCK, layouts: fromScenes(...SCENES)});
