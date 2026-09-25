/**
 * ENV public API: the cold-open set, the orb, the monitor screen, and a composer that stacks
 * set -> Mas -> orb into ONE tonal model (so raster styles sample them together) with
 * depth-correct parallax for camera moves.
 */
import type {ToneModel} from '../types';
import {masTone, MasToneParams} from '../masTone';
import {darkRoom, DarkRoomParams, MONITOR, WALL_Z, ROOM_HUES} from './darkRoom';
import {orb, OrbParams, ORB_HUES} from './orb';
import {monitorScreen, MonitorScreenParams, SCREEN_HUES} from './monitorScreen';
import {mergeModels, transformModel, makeCam} from './geo';

export {darkRoom, orb, monitorScreen, MONITOR, WALL_Z, ROOM_HUES, ORB_HUES, SCREEN_HUES};
export type {DarkRoomParams, OrbParams, MonitorScreenParams};
export {mergeModels, transformModel} from './geo';

/** Mas's bust placement in the set (bust ~x250-900, y250-1080) and his depth for parallax. */
export const MAS_PLACE = {x: 575, y: 572, s: 1.0, z: 100};
/** Orb default position and depth. */
export const ORB_PLACE = {x: 820, y: 330, z: 104};

/** Transform for a flat 2D layer living at depth z under the set camera (parallax + zoom). */
export const layerTransform = (z: number, camX = 0, camY = 0, zoom = 1) => {
  const c = makeCam(camX, camY, zoom);
  const f0 = 1500;
  const tx = c.cx - (zoom * camX * f0) / z;
  const ty = c.cy - (zoom * camY * f0) / z;
  return `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${zoom.toFixed(4)}) translate(${-c.cx} ${-c.cy})`;
};

export interface ColdOpenParams {
  room?: DarkRoomParams;
  orb?: OrbParams | false;
  orbAt?: {x: number; y: number};
  /** Include Mas (masTone params) or false for the empty set. */
  mas?: MasToneParams | false;
}

export const coldOpen = (p: ColdOpenParams = {}): ToneModel => {
  const room = p.room ?? {};
  const {camX = 0, camY = 0, zoom = 1} = room;
  const layers: {model: ToneModel; ns: string}[] = [{model: darkRoom(room), ns: 'room'}];
  if (p.mas) {
    const m = transformModel(masTone(p.mas), `${layerTransform(MAS_PLACE.z, camX, camY, zoom)} translate(${MAS_PLACE.x} ${MAS_PLACE.y}) scale(${MAS_PLACE.s})`);
    layers.push({model: m, ns: 'mas'});
  }
  if (p.orb !== false) {
    const at = p.orbAt ?? ORB_PLACE;
    layers.push({model: transformModel(orb(p.orb ?? {}), `${layerTransform(ORB_PLACE.z, camX, camY, zoom)} translate(${at.x} ${at.y})`), ns: 'orb'});
  }
  return mergeModels([0, 0, 1920, 1080], ...layers);
};
