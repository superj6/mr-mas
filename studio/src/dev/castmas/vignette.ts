// MR. MAS — castmas dev: minimal context props for the model sheet (desk top, monitor back, dinner table,
// stage floor). These are NOT set art — just enough surface for each sprite to read as placed.
import {Buf, bayer, rect, poly} from '../pixeladv/core/px';
import {PAL} from '../pixeladv/core/palette';

/** Mas's desk top seen from the 3/4-front camera: lit by the monitor at camera-left. y = his edge. */
export const deskTop = (b: Buf, x: number, y: number, w = 48) => {
  for (let j = 0; j < 13; j++)
    for (let i = -6; i < w; i++) {
      const u = 1 - i / w; // brighter toward the monitor (left)
      const bz = bayer(x + i, y + j);
      const c = j === 0 ? (u > 0.55 ? PAL.C2 : PAL.N3) : j > 9 ? PAL.N1 : u * 0.9 - j * 0.03 > 0.55 + (bz - 0.5) * 0.2 ? PAL.C0 : u > 0.2 + (bz - 0.5) * 0.3 ? PAL.N2 : PAL.N1;
      b.set(x + i, y + j, c);
    }
  rect(x - 6, y + 10, w + 6, 1, b.ink(PAL.N3));
  rect(x - 6, y + 11, w + 6, 2, b.ink(PAL.N0));
};

/** The back of his monitor at camera-left, with the screen spill around its edge. */
export const monitorBack = (b: Buf, x: number, y: number) => {
  // glow halo on the wall behind (dithered, stepped)
  for (let j = -14; j < 30; j++)
    for (let i = -8; i < 30; i++) {
      const d = Math.hypot((i - 16) / 22, (j - 8) / 18);
      const bz = bayer(x + i, y + j);
      if (d < 1) b.set(x + i, y + j, d < 0.55 ? PAL.C1 : bz < (1 - d) / 0.45 ? PAL.C1 : PAL.N2);
    }
  poly([x, y, x + 18, y - 3, x + 20, y + 18, x + 2, y + 22], b.ink(PAL.N0));
  poly([x + 17, y - 3, x + 19, y - 3, x + 21, y + 18, x + 19, y + 18], b.ink(PAL.C5)); // lit screen edge
  poly([x + 8, y + 20, x + 12, y + 19, x + 13, y + 26, x + 9, y + 27], b.ink(PAL.N1)); // stand
  rect(x + 5, y + 26, 12, 2, b.ink(PAL.N1));
};

/** Warm dinner table (THE WOODROSE): linen top + a candle glow, seen from the 3/4 camera. */
export const dinnerTable = (b: Buf, x: number, y: number, w: number) => {
  for (let j = 0; j < 12; j++)
    for (let i = 0; i < w; i++) {
      const bz = bayer(x + i, y + j);
      const u = i / w;
      const c = j === 0 ? PAL.W5 : j < 7 ? (bz < 0.55 - Math.abs(u - 0.4) * 0.8 - j * 0.03 ? PAL.W4 : PAL.W3) : j < 8 ? PAL.W1 : PAL.W0;
      b.set(x + i, y + j, c);
    }
  rect(x, y + 12, w, 1, b.ink(PAL.W0));
};

export const floorLine = (b: Buf, x: number, y: number, w: number, col: number = PAL.N3) => rect(x, y, w, 1, b.ink(col));

/** A suggestion of the throne of laptops (set art is not ours): a pile of closed laptops, lids edge-on. */
export const laptopThrone = (b: Buf, x: number, y: number, seatY: number, armY: number) => {
  // one closed laptop seen edge-on: dark body, a lit lid line on top, the screen seam glowing cyan
  const lap = (x0: number, y0: number, w: number) => {
    rect(x0, y0, w, 3, b.ink(PAL.N2));
    rect(x0, y0, w, 1, b.ink(PAL.G2));
    rect(x0 + 1, y0 + 1, w - 2, 1, b.ink(PAL.C3));
    rect(x0, y0 + 3, w, 1, b.ink(PAL.N0));
  };
  const jit = [0, 2, -1, 1, -2, 1, 0, -1, 2, 0, 1, -1];
  for (let k = 0; k < 10; k++) lap(x + 9 + jit[k], y - 2 + k * 4, 28); // the back, stacked high behind him
  for (let k = 0; k < 6; k++) lap(x + 1 + jit[k + 2], y + armY - 2 + k * 4, 11); // armrests
  for (let k = 0; k < 6; k++) lap(x + 34 + jit[k + 4], y + armY - 2 + k * 4, 11);
  for (let k = 0; k < 5; k++) lap(x + 10 + jit[k + 1], y + seatY + k * 4, 26); // the seat
  // the crest: two open laptops on top of the back, screens glowing outward
  for (const [ox, w] of [[10, 12], [24, 12]] as const) {
    rect(x + ox, y - 11, w, 8, b.ink(PAL.C4));
    rect(x + ox, y - 11, w, 1, b.ink(PAL.C6));
    rect(x + ox + 1, y - 9, w - 4, 1, b.ink(PAL.C6));
    rect(x + ox + 1, y - 7, w - 6, 1, b.ink(PAL.C5));
    rect(x + ox - 1, y - 3, w + 2, 1, b.ink(PAL.G2));
  }
};

/** Stage floor with the spot's pool under his feet. */
export const stagePool = (b: Buf, x: number, y: number, w: number) => {
  rect(x - 4, y, w + 8, 12, b.ink(PAL.N1));
  for (let j = 0; j < 7; j++)
    for (let i = 0; i < w; i++) {
      const d = Math.hypot((i - w / 2) / (w / 2), (j - 3) / 3.5);
      if (d < 1) b.set(x + i, y + j, d < 0.55 ? PAL.W2 : bayer(x + i, y + j) < (1 - d) / 0.45 ? PAL.W2 : PAL.W1);
    }
};
