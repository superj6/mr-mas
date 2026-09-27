// MR. MAS · range E1-P2: the exit, the [2S] at the dark-room desk, pure pixel (v5). It is the shared plate
// (rooms/darkroom-plate.ts) composed here in drawDark2S's own order, so this shot can do what the shared helper
// doesn't: Mas breathes (his back image rises a pixel on a slow cycle; the forearms stay on the desk), turns his head
// from the screen to the Orb and gives the one-pixel smile, his hands clasped (v4's resting fists read as lumps), and
// the GUEST card sits a rung down in the room's light (v4 drew it in flat paper, the brightest, most saturated thing in
// the frame: the cold review's eye went to it before his face).
// The monitor, small at frame left, holds the same player the [OTS] showed: the same title strip (play glyph, a clean
// title bar, three dots: v4's tiny type sampled into garbage), the same 3 x 2 contact sheet of the same six stills,
// in the room's own pixels (each still downsampled and snapped to the master palette, the way every screen in the
// show renders its content), and the chyron under them as marks. The rack's slot starts to whir: its activity LED
// blinks and the magazine's edge shows in the mouth.
import {Buf, rect} from '../../../shared/pixel/px';
import {PAL, FAMILIES} from '../../../shared/pixel/palette';
import {DPLATE, DPLATE_LOOK, DarkPlateOpts, drawDarkPlate, drawDarkPlateDesk, drawDarkPlateFront} from '../../../shared/pixel/rooms/darkroom-plate';
import {tiny} from '../../../shared/pixel/rooms/kit-b';
import * as OM from '../../../shared/pixel/cast/orb-medium';
import * as MM from '../../../shared/pixel/cast/mas-medium';
import type {Img} from '../../../shared/pixel/figure';
import type {Beat} from './plan';

/** a still as palette pixels (w x h), from the host (it reads the take frame's pixels once) */
export type StillPx = {w: number; h: number; c: Uint32Array};
/** the monitor's virtual screen is 96 x 60 (the plate samples it onto its turned quad): six 29 x 16 thumbnails */
export const SMALL = {w: 29, h: 16};
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

const MID: [number, number] = [(DPLATE_LOOK.grid[0] + DPLATE_LOOK.face[0]) / 2, (DPLATE_LOOK.grid[1] + DPLATE_LOOK.face[1]) / 2];
// the monitor in this plate is at frame left and slightly below the Orb: its look into the screen
const MONITOR_LOOK: [number, number] = [-0.96, 0.02];

/** the player on the plate's monitor: the [OTS]'s layout at the virtual screen's size */
const player = (stills: StillPx[]) => (scr: Buf) => {
  rect(0, 0, scr.w, scr.h, scr.ink(PAL.N1));
  // the title strip: the play glyph, the title as one clean bar (type this small only samples into noise), the dots
  rect(0, 0, scr.w, 7, scr.ink(PAL.G0));
  rect(0, 7, scr.w, 1, scr.ink(PAL.N0));
  for (let k = 0; k < 3; k++) rect(3 + k, 1 + k, 1, 5 - 2 * k, scr.ink(PAL.G5));
  rect(9, 3, 30, 1, scr.ink(PAL.P0));
  for (let i = 0; i < 3; i++) rect(scr.w - 16 + i * 5, 3, 2, 2, scr.ink(PAL.G2));
  // the sheet: 3 x 2, hairline gaps
  stills.forEach((s, i) => {
    const x0 = 2 + (i % 3) * (SMALL.w + 2), y0 = 11 + Math.floor(i / 3) * (SMALL.h + 2);
    rect(x0 - 1, y0 - 1, SMALL.w + 2, SMALL.h + 2, scr.ink(PAL.N0));
    for (let y = 0; y < s.h; y++) for (let x = 0; x < s.w; x++) scr.set(x0 + x, y0 + y, s.c[y * s.w + x]);
  });
  // the chyron under it, as marks (it was read in the [OTS]; here it only has to be the same bar)
  rect(2, 48, 91, 7, scr.ink(PAL.N0));
  rect(2, 48, 2, 7, scr.ink(PAL.R2));
  for (let x = 7; x < 70; x++) if (x % 5 !== 4 && x % 17 !== 0) scr.set(x, 51, PAL.P1);
};

/** the GUEST lanyard laid square beside the glass, a rung down (the plate's own drawing, in the room's light) */
const dimLanyard = (b: Buf) => {
  const {x, y} = DPLATE.lanyard;
  for (let i = 2; i < 24; i++) { b.set(x + i, y - 9, PAL.G2); b.set(x + i, y - 8, PAL.G1); }
  for (let j = -8; j < 0; j++) { b.set(x + 1, y + j, PAL.G2); b.set(x + 24, y + j, PAL.G1); }
  rect(x + 10, y - 2, 6, 3, b.ink(PAL.G2)); rect(x + 10, y - 2, 6, 1, b.ink(PAL.G4));
  rect(x, y, 26, 15, b.ink(PAL.G3)); rect(x, y, 26, 4, b.ink(PAL.R1)); rect(x, y + 14, 26, 1, b.ink(PAL.G2));
  rect(x, y, 26, 1, b.ink(PAL.C2));                                   // its top edge catches the monitor
  rect(x + 26, y + 1, 1, 15, b.ink(PAL.N0)); rect(x + 1, y + 15, 26, 1, b.ink(PAL.N0));
  tiny(b, 'GUEST', x + 3, y + 7, PAL.N1);
};

/** Mas breathes on 2s: his back image (head, shoulders) rises one pixel on a slow cycle; the forearms stay put */
const breath2S = (f: number) => {
  const e = f - (f % 2);
  return (e + 36) % 96 >= 44 && (e + 36) % 96 < 80 ? -1 : 0;
};
const put = (b: Buf, img: Img, x: number, y: number, yMax = Infinity) => {
  for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) {
    const v = img.c[j * img.w + i];
    if (v < 0 || y + j >= yMax) continue;
    b.set(x + i, y + j, v);
  }
};

export const draw2S = (b: Buf, f: number, beat: Beat, stills: StillPx[]) => {
  const look = beat.iris === 'monitor' ? MONITOR_LOOK : beat.iris === 'mid' ? MID : DPLATE_LOOK.face;
  const o: DarkPlateOpts = {tally: 3, glass: true, lanyard: false, phone: 'down', screen: player(stills)};
  drawDarkPlate(b, f, o);
  const [ox, oy] = DPLATE.orb;
  OM.drawOrb(b, ox, oy + OM.orbBob(f), OM.ORB_MR, {look, aperture: 0.5, monitor: -1});
  const s: MM.MasMediumState = {...MM.MAS_MEDIUM_DEFAULT, head: beat.head, arm: 'clasp', look: beat.masLook, brow: beat.brow, mouth: beat.smile ? 'smile' : 'rest'};
  const [mx, my] = DPLATE.mas;
  put(b, MM.masMediumBack(s), mx, my + breath2S(f));
  drawDarkPlateDesk(b, f, o);
  dimLanyard(b);
  put(b, MM.masMediumFront(s), mx, my);
  drawDarkPlateFront(b, f, o);
  if (beat.whir >= 0) {
    // the slot starts to whir: its activity LED blinks on 2s, and from a beat in, the magazine's edge in the mouth
    const {x, y, w, h} = DPLATE.slot;
    b.set(x + w + 18, y - 3, Math.floor(beat.whir / 2) % 2 ? PAL.W6 : PAL.W2);
    if (beat.whir >= 12) rect(x + 2, y + Math.floor(h / 2), w + 12, 1, b.ink(PAL.P0));
  }
};
