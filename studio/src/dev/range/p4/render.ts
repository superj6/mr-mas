// MR. MAS · prototype 4 · the pure renderer (Remotion host and Node preview share it, so stills and video match).
// renderFrame(f) -> the 1920x1080 RGBA frame: the clip paints the 480x203 room area and picks the view (the
// integer pixel scale and camera centre), the band is drawn once and never changes (device passes keep it).
import {Buf} from '../../../shared/pixel/px';
import {PAL} from '../../../shared/pixel/palette';
import {drawBand, BAND_H} from './passes/band';
import {present, presentNative, View, OUT_W, OUT_H} from './passes/present';
import {clipAt} from './reel';

export {OUT_W, OUT_H};
export const REEL_FRAMES = 720;

let BAND: Buf | null = null;
const band = () => {
  if (!BAND) { BAND = new Buf(480, BAND_H, PAL.N1); drawBand(BAND, {}, 0); }
  return BAND;
};

export const composeRoom = (f: number): {room: Buf; view: View} => {
  const room = new Buf(480, 203, PAL.N0);
  const {view} = clipAt(f, room);
  return {room, view};
};

export const renderFrame = (f: number, out: Uint8ClampedArray) => {
  const {room, view} = composeRoom(f);
  present(room, view, band(), out);
};

export const renderNative = (f: number): Uint32Array => {
  const {room, view} = composeRoom(f);
  return presentNative(room, view, band());
};
