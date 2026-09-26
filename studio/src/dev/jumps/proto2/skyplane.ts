// MR. MAS — style jump prototype 2 · THE SKY PLANE (fix pass). Which native pixels of the plate show the window's SKY,
// as opposed to what stands in front of it: the window's frame and reveal, the mullion and the transom, the skyline
// (towers and the spire, rebuilt from darkroom-plate's cityLights hashes), and the Orb and Mas (the occluders, passed
// in). The break in either variant lives only on this plane: it passes BEHIND the transom, the mullion, the rooftops
// and the Orb. That occlusion is the proof that it is the sky that breaks, not the window glass (§5.4 lesson 11).
// Deterministic; pure.
import {hash} from '../../../shared/pixel/px';
import {DPLATE} from '../../../shared/pixel/rooms/darkroom-plate';

const NW = 480;
const win = DPLATE.win;

/** the spire (the cathedral-to-be) as the plate draws it: body, the triangle, the needle and its light */
const SPX = win.x0 + 150, SPY = win.y0 + Math.round((win.y1 - win.y0) * 0.34);
const inSpire = (x: number, y: number) => {
  if (y >= SPY) return x >= SPX - 4 && x <= SPX + 4;
  if (y >= SPY - 16) {
    const t = (SPY - y) / 16;
    return x >= Math.floor(SPX - 4 + 5 * t) && x <= Math.ceil(SPX + 5 - 4 * t);
  }
  return x === SPX && y >= SPY - 24;
};

/** per column: the first row of the skyline (far and near towers), from the plate's own loops */
export const SKY_TOP: Int16Array = (() => {
  const top = new Int16Array(NW).fill(999);
  const W0 = win.x0, WH = win.y1 - win.y0;
  for (let x = W0, k = 0; x < win.x1; k++) {
    const w = 7 + Math.floor(hash(k, 1) * 10);
    const t = win.y0 + Math.round(WH * (0.42 + hash(k, 2) * 0.3));
    for (let xx = x; xx < Math.min(x + w, win.x1 + 1); xx++) top[xx] = Math.min(top[xx], t);
    x += w + 1 + Math.floor(hash(k, 3) * 3);
  }
  for (let x = W0, k = 0; x < win.x1; k++) {
    const w = 12 + Math.floor(hash(k, 11) * 16);
    const t = win.y0 + Math.round(WH * (0.7 + hash(k, 12) * 0.2));
    // (the plate's blinking roof light on tower 2 sits at top - 1)
    for (let xx = x; xx < Math.min(x + w, win.x1 + 1); xx++) top[xx] = Math.min(top[xx], k === 2 && xx === x + 2 ? t - 1 : t);
    x += w + Math.floor(hash(k, 13) * 4);
  }
  return top;
})();

/** true where the native pixel (x, y) shows open sky (occ = what stands in front: Mas, the Orb) */
export const isSky = (x: number, y: number, occ?: Uint8Array) =>
  x >= win.x0 && x <= win.x1 && y >= win.y0 && y < SKY_TOP[x] &&
  !(x >= win.mx - 1 && x <= win.mx + 1) && !(y >= win.my && y <= win.my + 1) && !inSpire(x, y) && !(occ && occ[y * NW + x]);
