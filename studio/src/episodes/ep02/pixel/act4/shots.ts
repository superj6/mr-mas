// MR. MAS — Ep2 v1 · act4: the segment's layouts, ONE MODULE PER SCENE (scenes/sc-<scene>.ts, spec.ts defineScene).
// The import block between the markers is written by tools/scenes.py act4 (run it after every re-lock: it adds a stub
// for each new scene); draw in the scene modules, not here, so the per-scene cache re-renders only what changed.
import {defineSegment, fromScenes} from '../spec';
import type {SceneSpec} from '../spec';
import {LOCK} from './data';
// <scenes> (tools/scenes.py: one import per scene module, in the lock's order)
import {SCENE as sc_18} from './scenes/sc-18';
import {SCENE as sc_19} from './scenes/sc-19';
import {SCENE as sc_20} from './scenes/sc-20';
import {SCENE as sc_22} from './scenes/sc-22';
const SCENES: SceneSpec[] = [sc_18, sc_19, sc_20, sc_22];
// </scenes>
export const SEGMENT = defineSegment({seg: 'act4', lock: LOCK, layouts: fromScenes(...SCENES)});
