// MR. MAS — Ep2 v1 · act3: the segment's layouts, ONE MODULE PER SCENE (scenes/sc-<scene>.ts, spec.ts defineScene).
// The import block between the markers is written by tools/scenes.py act3 (run it after every re-lock: it adds a stub
// for each new scene); draw in the scene modules, not here, so the per-scene cache re-renders only what changed.
import {defineSegment, fromScenes} from '../spec';
import type {SceneSpec} from '../spec';
import {LOCK} from './data';
// <scenes>
const SCENES: SceneSpec[] = [];
// </scenes>
export const SEGMENT = defineSegment({seg: 'act3', lock: LOCK, layouts: fromScenes(...SCENES)});
