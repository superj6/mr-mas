// MR. MAS — Ep2 v1 · act2: the segment's layouts, ONE MODULE PER SCENE (scenes/sc-<scene>.ts, spec.ts defineScene).
// The import block between the markers is written by tools/scenes.py act2 (run it after every re-lock: it adds a stub
// for each new scene); draw in the scene modules, not here, so the per-scene cache re-renders only what changed.
import {defineSegment, fromScenes} from '../spec';
import type {SceneSpec} from '../spec';
import {LOCK} from './data';
// <scenes> (tools/scenes.py: one import per scene module, in the lock's order)
import {SCENE as sc_8} from './scenes/sc-8';
import {SCENE as sc_9} from './scenes/sc-9';
import {SCENE as sc_10} from './scenes/sc-10';
import {SCENE as sc_11} from './scenes/sc-11';
import {SCENE as sc_12} from './scenes/sc-12';
const SCENES: SceneSpec[] = [sc_8, sc_9, sc_10, sc_11, sc_12];
// </scenes>
export const SEGMENT = defineSegment({seg: 'act2', lock: LOCK, layouts: fromScenes(...SCENES)});
