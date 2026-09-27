// MR. MAS · range E1-P2: the exit, the [2S] at the dark-room desk, pure pixel, from the shared plate as it is
// (rooms/twoshots.ts drawDark2S: Mas, the Orb, three marks in the wood, the glass with its flat water line, the GUEST
// lanyard, the phone face down). The monitor, small at frame left, still holds the stills: the same three holds, now
// in the room's own pixels (each still downsampled and snapped to the master palette, the way every screen in the show
// renders its content). Until the iris steps back to Mas, the Orb's eye-light is still a cyan spot on that glass.
// The rack's slot starts to whir: its activity LED blinks and the magazine's edge shows in the mouth.
import {Buf, rect} from '../../../shared/pixel/px';
import {PAL, nearest, FAMILIES} from '../../../shared/pixel/palette';
import {drawDark2S} from '../../../shared/pixel/rooms/twoshots';
import {DPLATE, DPLATE_LOOK} from '../../../shared/pixel/rooms/darkroom-plate';
import {tiny} from '../../../shared/pixel/rooms/kit-b';
import type {Beat} from './plan';

/** a still as palette pixels (w x h), from the host (it reads the take frame's pixels once) */
export type StillPx = {w: number; h: number; c: Uint32Array};
export const SMALL = {w: 30, h: 17};
/** snap an RGBA thumbnail to the master palette, matching in CIELAB so the duck keeps its hue (a plain RGB nearest
 *  after dimming sent the yellow to the tungsten family's browns). Low-chroma pixels (the sweep) match on the greys and
 *  paper only, so the backdrop reads as one grey field; coloured pixels match on tungsten, paper and greys, hue weighted.
 *  The room's screens sit a little under the film's grade (x0.9 in sRGB before the match). */
const GREYS = [...(FAMILIES.G ?? []), PAL.P0, PAL.P1];
// tungsten from W4 up: the lower rungs are browns, and a yellow duck snapped to them reads as a brown one
const WARM = [...(FAMILIES.W ?? []).slice(4), ...(FAMILIES.P ?? []), ...(FAMILIES.G ?? [])];
const s2l = (v: number) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const labOf = (r: number, g: number, b: number): [number, number, number] => {
  const R = s2l(r), G = s2l(g), B = s2l(b);
  const X = (0.4124 * R + 0.3576 * G + 0.1805 * B) / 0.9505, Y = 0.2126 * R + 0.7152 * G + 0.0722 * B, Z = (0.0193 * R + 0.1192 * G + 0.9505 * B) / 1.089;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
};
const labPool = (pool: number[]) => pool.map((p) => ({p, l: labOf((p >> 16) & 255, (p >> 8) & 255, p & 255)}));
const GREYS_L = labPool(GREYS), WARM_L = labPool(WARM);
export const toPalette = (rgba: Uint8ClampedArray, w: number, h: number): StillPx => {
  const c = new Uint32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const q = labOf(rgba[i * 4] * 0.9, rgba[i * 4 + 1] * 0.9, rgba[i * 4 + 2] * 0.9);
    const grey = Math.hypot(q[1], q[2]) < 14;
    const pool = grey ? GREYS_L : WARM_L;
    let best = pool[0].p, bd = Infinity;
    for (const {p, l} of pool) {
      const d = (l[0] - q[0]) ** 2 + (grey ? 0.25 : 2) * ((l[1] - q[1]) ** 2 + (l[2] - q[2]) ** 2);
      if (d < bd) { bd = d; best = p; }
    }
    c[i] = best;
  }
  return {w, h, c};
};
void nearest;

const MID: [number, number] = [(DPLATE_LOOK.grid[0] + DPLATE_LOOK.face[0]) / 2, (DPLATE_LOOK.grid[1] + DPLATE_LOOK.face[1]) / 2];
// the monitor in this plate is at frame left and slightly below the Orb: its look into the screen
const MONITOR_LOOK: [number, number] = [-0.96, 0.02];

export const draw2S = (b: Buf, f: number, beat: Beat, stills: StillPx[]) => {
  const look = beat.iris === 'monitor' ? MONITOR_LOOK : beat.iris === 'mid' ? MID : DPLATE_LOOK.face;
  const screen = (scr: Buf) => {
    rect(0, 0, scr.w, scr.h, scr.ink(PAL.N1));
    rect(0, 0, scr.w, 7, scr.ink(PAL.G0));
    tiny(scr, 'ELGOOG DEMO', 5, 1, PAL.P0);
    stills.forEach((s, i) => {
      const x0 = 2 + i * (SMALL.w + 2), y0 = 16;
      rect(x0 - 1, y0 - 1, SMALL.w + 2, SMALL.h + 2, scr.ink(PAL.N0));
      for (let y = 0; y < s.h; y++) for (let x = 0; x < s.w; x++) scr.set(x0 + x, y0 + y, s.c[y * s.w + x]);
    });
    // the chyron, as marks (unreadable at this size, and it doesn't need to be read again)
    rect(2, 40, 84, 7, scr.ink(PAL.N0));
    rect(2, 40, 2, 7, scr.ink(PAL.R2));
    for (let x = 7; x < 83; x++) if (x % 5 !== 4 && x % 17 !== 0) scr.set(x, 43, PAL.P1);
    if (beat.iris === 'monitor') {
      // the Orb's eye-light, still on the glass over the middle still
      const cx = 2 + SMALL.w + 2 + SMALL.w / 2, cy = 24;
      for (let y = -5; y <= 5; y++) for (let x = -8; x <= 8; x++) {
        const d = Math.hypot(x / 8, y / 5);
        if (d > 1) continue;
        const X = Math.round(cx + x), Y = cy + y;
        if (d > 0.75) { if (((X + Y) & 1) === 0) scr.set(X, Y, PAL.C4); } else scr.set(X, Y, d < 0.45 ? PAL.C3 : scr.get(X, Y) === PAL.N1 ? PAL.C1 : scr.get(X, Y));
      }
    }
  };
  drawDark2S(b, f, {
    mas: {head: '34', arm: 'rest', look: -1},
    orb: {look, aperture: 0.5},
    plate: {tally: 3, glass: true, lanyard: true, phone: 'down', screen},
  });
  if (beat.whir >= 0) {
    // the slot starts to whir: its activity LED blinks on 2s, and from a beat in, the magazine's edge in the mouth
    const {x, y, w, h} = DPLATE.slot;
    b.set(x + w + 18, y - 3, Math.floor(beat.whir / 2) % 2 ? PAL.W6 : PAL.W2);
    if (beat.whir >= 12) rect(x + 2, y + Math.floor(h / 2), w + 12, 1, b.ink(PAL.P0));
  }
};
