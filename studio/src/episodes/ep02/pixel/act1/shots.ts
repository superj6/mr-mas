// MR. MAS — Ep2 v1 · act1: the segment's layouts, ONE MODULE PER SCENE (scenes/sc-<scene>.ts, spec.ts defineScene).
// The import block between the markers is written by tools/scenes.py act1 (run it after every re-lock: it adds a stub
// for each new scene); draw in the scene modules, not here, so the per-scene cache re-renders only what changed.
import {defineSegment, fromScenes} from '../spec';
import type {SceneSpec} from '../spec';
import {LOCK} from './data';
// <scenes> (tools/scenes.py: one import per scene module, in the lock's order)
import {SCENE as sc_4} from './scenes/sc-4';
import {SCENE as sc_4a} from './scenes/sc-4a';
import {SCENE as sc_4b} from './scenes/sc-4b';
import {SCENE as sc_6} from './scenes/sc-6';
import {SCENE as sc_7} from './scenes/sc-7';
const SCENES: SceneSpec[] = [sc_4, sc_4a, sc_4b, sc_6, sc_7];
// </scenes>
export const SEGMENT = defineSegment({seg: 'act1', lock: LOCK, layouts: fromScenes(...SCENES)});
