// MR. MAS — Ep3 v1 · act3: the segment's layouts, ONE MODULE PER SCENE (scenes/sc-<scene>.ts, spec.ts defineScene).
// The import block between the markers is written by tools/scenes.py act3 (run it after every re-lock: it adds a stub
// for each new scene); draw in the scene modules, not here, so the per-scene cache re-renders only what changed.
import {defineSegment, fromScenes} from '../spec';
import type {SceneSpec} from '../spec';
import {LOCK} from './data';
// <scenes> (tools/scenes.py: one import per scene module, in the lock's order)
import {SCENE as sc_15} from './scenes/sc-15';
import {SCENE as sc_16} from './scenes/sc-16';
import {SCENE as sc_17a} from './scenes/sc-17a';
import {SCENE as sc_18} from './scenes/sc-18';
import {SCENE as sc_19} from './scenes/sc-19';
import {SCENE as sc_20} from './scenes/sc-20';
const SCENES: SceneSpec[] = [sc_15, sc_16, sc_17a, sc_18, sc_19, sc_20];
// </scenes>
export const SEGMENT = defineSegment({seg: 'act3', lock: LOCK, layouts: fromScenes(...SCENES)});
