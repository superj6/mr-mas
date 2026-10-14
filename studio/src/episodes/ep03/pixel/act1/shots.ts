// MR. MAS — Ep3 v1 · act1: the segment's layouts, ONE MODULE PER SCENE (scenes/sc-<scene>.ts, spec.ts defineScene).
// The import block between the markers is written by tools/scenes.py act1 (run it after every re-lock: it adds a stub
// for each new scene); draw in the scene modules, not here, so the per-scene cache re-renders only what changed.
import {defineSegment, fromScenes} from '../spec';
import type {SceneSpec} from '../spec';
import {LOCK} from './data';
// <scenes> (tools/scenes.py: one import per scene module, in the lock's order)
import {SCENE as sc_4} from './scenes/sc-4';
import {SCENE as sc_5} from './scenes/sc-5';
import {SCENE as sc_6} from './scenes/sc-6';
import {SCENE as sc_7} from './scenes/sc-7';
import {SCENE as sc_8} from './scenes/sc-8';
import {SCENE as sc_9} from './scenes/sc-9';
import {SCENE as sc_10} from './scenes/sc-10';
const SCENES: SceneSpec[] = [sc_4, sc_5, sc_6, sc_7, sc_8, sc_9, sc_10];
// </scenes>
export const SEGMENT = defineSegment({seg: 'act1', lock: LOCK, layouts: fromScenes(...SCENES)});
