// MR. MAS — Ep2 v1 · act4 · scene 22: ONE DOOR (JUN 19, 2024; ISS, an empty lot). 9 shots, 912 f on the v1 EL lock. The
// shots pass, 2026-10-09; the record is shots-act4.md. The second Tier 2 leap (2.H): the cube, its door, the brass plate,
// the slot and its sprung flap, the lot and the overcast are REAL 3D (Blender 4.5.3 EEVEE: the art pass's seven plates,
// out/ep02/v1/art/iss/plates, and this pass's tilt, plate close and flap angles, act4/tools/iss22.py ->
// out/ep02/v1/inserts/iss/plates); Mas, the Orb, the flyer, the pin and Alyi stay PIXEL drawings, laid over the plates
// at 4x keeping the contrast (no grade match, no pixel rim, no down-rez; LEARNINGS P12). The splice is the pipeline's
// OVERLAY (spec.ts Layout.overlay, render.ts), as the cold open's 2.A and Ep1's 11.04 CLOD: act4/tools/iss22-insert.ts
// writes each shot's manifest and layers from ISS_PLAN below (the plate, then the pixel figures' layer), so the figures
// are drawn by this module's code either way. Under the overlay each layout draws the same frame in pixels (a flat
// stand-in for the plate), which the review frame and the browser host show; in 22.05 the plate's gap is transparent
// and the layout's pixel room (Alyi at work) is the picture through it.
//   ARRIVE   22.01 white, room tone only; the TPOOL pin falls into it from the top of frame; the camera tilts down and
//            the white turns out to be sky over an empty lot (the exposure coming down with the tilt): the white cube,
//            one sealed door; then close, a brass plate: ISS; a mail slot
//   WALK     22.02 Mas (pixel) walks up from frame-left, never running; the Orb scans the cube and toasts nothing
//   ASK      22.03 the band lights for four seconds: Use flyer on door · 22.04 over his shoulder: the flyer, his, upside
//            down, the tape on its corners, pushed into the slot; it lifts the flap (the flap's angles in 3D)
//   GLIMPSE  22.05 the gap fills the frame: a lit room, Alyi at a desk, working, absorbed, cropped by the slot's edges; he
//            doesn't look up; the flyer drops out of frame onto the floor inside, unseen · 22.06 the flap swings shut
//   CHOICE   22.07 Mas at the shut flap (a face light) · 22.08 he raises a hand to knock (held two beats), and lowers it
//   AFTER    22.09 he walks away the way he came: his back, small, crossing the lot; the cube doesn't change
// No rail (it runs on from sc 20's JUN 19, 2024). No mat, no lock, no sign; nothing offered, nothing comes back; the note
// stays in his jacket, unseen. No V.O. (silent by design). Nobody human is in the 3D (P14).
import {defineScene, layouts, mk} from '../../kit';
import type {PxShot} from '../../kit';
import {Buf, clamp, ellipse, poly, TRANSPARENT} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {issLayer, issRoom, issOver, ISS_ANCHORS} from '../sets/iss';
import {drawCheckPin} from '../sets/dark';
import {adventureBand4} from '../sets/band';
import {fill, vramp} from '../../art/kit';

const L = layouts();
const W = 480, RH = 203;
const OVL = (shot: string) => ({manifest: `out/ep02/v1/inserts/iss/${shot}/manifest.json`});

/** the TPOOL pin (sc 20's, the matched object), falling into the white at the ECU's size and x (the review pass: it
 *  was a 12 px speck; 20.13 now ends on the same ~26 px pin dropping past the frame's foot at x ~253), tumbling on 3s */
const fallingPin = (b: Buf, x: number, y: number, tip: boolean) => drawCheckPin(b, x, y, {rot: tip ? 1.5 : 0.6});

// ================================================================== the plan: each frame's plate and pixel layer
export interface IssFrame { plate: string | null; fig?: (b: Buf) => void }
type Plan = (k: number, sh: PxShot, f: number) => IssFrame;
const TILT_N = 28;
/** the shots' frame plans (read by this module's layouts and by act4/tools/iss22-insert.ts) */
export const ISS_PLAN: Record<string, Plan> = {
  '22.01': (k, sh) => {
    const fall = mk(sh, 'fall', 10), t0 = 40, t1 = t0 + (TILT_N - 1) * 2, iss = mk(sh, 'iss', 123);
    if (k < t0) {
      // the pin falling through the white, accelerating, tumbling on 3s; out past the frame's foot
      const t = k - (fall - 10), y = Math.round(-16 + 0.16 * t * t + 2 * t);
      return {plate: 'tilt_00', fig: y < RH + 30 ? (b) => fallingPin(b, 253 + Math.round(Math.sin(t / 7) * 6), y, Math.floor(t / 3) % 2 === 1) : undefined};
    }
    if (k < iss - 4) return {plate: `tilt_${String(clamp(Math.floor((k - t0) / 2), 0, TILT_N - 1)).padStart(2, '0')}`};
    void t1;
    return {plate: 'plate'};
  },
  '22.02': (k, sh, f) => {
    const scan = mk(sh, 'scan', 102), arrive = scan - 6;
    return {plate: 'wide', fig: (b) => issLayer(b, 'wide', f, {t: Math.min(1, Math.floor(k / 2) * 2 / arrive), scanK: k >= scan ? k - scan : -1})};
  },
  '22.03': (k, sh, f) => ({plate: 'wide', fig: (b) => issLayer(b, 'wide', f, {t: 1})}),
  '22.04': (k, sh, f) => {
    const into = mk(sh, 'into', 48), lift = mk(sh, 'lift', 75);
    const push = k < into - 18 ? 0 : k < into ? 1 : 2;
    const deg = k < into ? '00' : k < into + 10 ? '18' : k < lift ? '36' : '55';
    // he unfolds it above the slot (folded, half open, open: held drawings), then lowers it to the slot on 4s
    const unfold = k < 10 ? 0 : k < 16 ? 1 : 2, up = k < 18 ? 24 : Math.max(0, 24 - Math.floor((k - 14) / 4) * 6);
    return {plate: `ots_${deg}`, fig: (b) => issLayer(b, 'ots', f, {push, unfold, lift: up})};
  },
  '22.05': () => ({plate: 'insert'}),
  '22.06': (k, sh) => {
    const shut = mk(sh, 'shut', 4);
    const d = k - shut;
    return {plate: d < -3 ? 'ecu_70' : d < -1 ? 'ecu_40' : d < 0 ? 'ecu_15' : d < 1 ? 'ecu' : d < 3 ? 'ecu_m4' : 'ecu'};
  },
  '22.07': (k, sh, f) => ({plate: 'mcu', fig: (b) => issLayer(b, 'mcu', f, {lit: true})}),
  '22.08': (k, sh, f) => {
    // a beat at the door, the hand coming up on 2s (half, then up), held two beats (38 f), lowered the same way
    const up = 14, down = 52;
    const raise = k < up - 3 ? 0 : k < up ? 0.5 : k < down ? 1 : k < down + 3 ? 0.5 : 0;
    return {plate: 'knock', fig: (b) => issLayer(b, 'knock', f, {raise})};
  },
  '22.09': (k, sh, f) => ({plate: 'away', fig: (b) => issLayer(b, 'away', f, {t: Math.min(1, k / 112)})}),
};
/** the layouts' own pixel frame (under the overlay): a flat stand-in for the plate (the overcast, the lot, the cube) and
 *  the same pixel layer the overlay carries; 22.01's first frames white with the pin; 22.05 the room through the gap */
const fallback = (fb: Buf, id: string, k: number, sh: PxShot, f: number) => {
  const p = ISS_PLAN[id](k, sh, f);
  if (id === '22.05') { issRoom(fb, f, {drop: dropAt(k, sh)}); return; }
  if (p.plate === 'tilt_00') fill(fb, 0, 0, W, RH, PAL.P1);
  else { vramp(fb, 0, 0, W, 100, [PAL.G5, PAL.G6]); vramp(fb, 0, 100, W, RH - 100, [PAL.D3, PAL.D2]); if (p.plate === 'wide' || (p.plate ?? '').startsWith('tilt')) { fill(fb, 290, 40, 130, 124, PAL.P2); fill(fb, 336, 70, 40, 94, PAL.P1); } }
  if (p.fig) { const l = new Buf(W, 270, TRANSPARENT); p.fig(l); for (let i = 0; i < W * RH; i++) fb.c[i] = issOver(fb.c[i], l.c[i]); }
};
/** 22.05: the flyer inside, falling past the gap and out of frame (art issRoom's drop 0..2), landing unseen */
const dropAt = (k: number, sh: PxShot) => { const land = mk(sh, 'land', 57); return k < land - 16 ? 0 : k < land - 8 ? 1 : k < land ? 2 : 3; };

// ================================================================== the layouts
L.add('22.01', {
  st: 'act4 2.H plates (tilt_00..27: the camera tilting down out of the white, the exposure coming down with it; the close on the brass plate ISS and the slot) + the pixel TPOOL pin falling into the white (the overlay; the layout\'s own frame white with the pin, then a flat stand-in)',
  overlay: OVL('22.01'),
  marks: {fall: ['snd', 'pin_fall', 1, 0], iss: ['txt', 'ISS', 'at', 0]},
  draw: (fb, k, sh, f) => fallback(fb, '22.01', k, sh, f),
});
L.add('22.02', {
  st: 'act4 2.H plate (art wide) + act4/sets/iss issLayer wide (Mas, pixel, walking up from frame-left at his pace (art/cast/mas2), his contact shadow on the lot; arrived, he faces the door; THE ORB at his shoulder scanning the cube, toasting nothing)',
  overlay: OVL('22.02'),
  marks: {scan: ['snd', 'orb_scan_sweep', 1, 0]},
  draw: (fb, k, sh, f) => fallback(fb, '22.02', k, sh, f),
});
L.add('22.03', {
  st: 'act4 2.H plate (art wide) + issLayer (Mas at the door, his back to us) + act4/sets/band (the adventure band lighting in held steps for four seconds: Use highlighted, the sentence line Use flyer on door; his pocket: the keycaps, his phone, the flyer; no note)',
  overlay: OVL('22.03'),
  marks: {on: ['snd', 'ui_band_on', 1, 0], off: ['snd', 'ui_band_off', 1, 0], txt: ['txt', 'Use flyer', 'at', 0]},
  draw: (fb, k, sh, f) => {
    fallback(fb, '22.03', k, sh, f);
    const on = mk(sh, 'on', 0), off = mk(sh, 'off', 93), t = mk(sh, 'txt', 9);
    fill(fb, 0, RH, W, 270 - RH, PAL.N0); fill(fb, 0, RH, W, 1, PAL.N3);
    if (k >= on && k < off + 6) adventureBand4(fb, {verb: k >= t - 2 ? 'Use' : undefined, sentence: k >= t ? 'Use flyer on door' : undefined, dim: k < on + 6 ? (2 - Math.floor((k - on) / 3)) * 2 : k >= off ? (Math.floor((k - off) / 2) + 1) * 2 : 0, pocket: ['CTRL', 'ESC', 'phone', 'flyer']});
    return {full: true};
  },
});
L.add('22.04', {
  st: 'act4 2.H plates (ots_00 .. ots_55: over his shoulder at the slot, the sprung flap swung in by the flyer in 3D) + issLayer ots (the back of his head and shoulder close and soft at frame left, his arm from the shoulder to the elbow to the hand, the flyer, his, upside down, the tape still on its corners, pushed into the slot: the part already in hidden behind the flap)',
  overlay: OVL('22.04'),
  marks: {into: ['snd', 'flyer_into_slot', 1, 0], lift: ['snd', 'mail_flap_lift', 1, 0]},
  draw: (fb, k, sh, f) => fallback(fb, '22.04', k, sh, f),
});
L.add('22.05', {
  st: 'act4 2.H plate (art insert: the gap fills the frame, keyed) over act4/sets/iss issRoom (a warm lit room, ALYI (art/cast/alyi2 drawAlyiAtWork, pixel) at a desk, working, absorbed, cropped by the slot\'s edges; he never looks up; the flyer falling just inside, out of frame, unseen)',
  overlay: OVL('22.05'),
  marks: {land: ['snd', 'paper_drop_floor', 1, 0]},
  draw: (fb, k, sh, f) => fallback(fb, '22.05', k, sh, f),
});
L.add('22.06', {
  st: 'act4 2.H plates (ecu_70, ecu_40, ecu_15, ecu, ecu_m4, ecu: the flap swinging shut on its spring, a rebound, shut; room tone only)',
  overlay: OVL('22.06'),
  marks: {shut: ['snd', 'mail_flap_spring_shut', 1, 0]},
  draw: (fb, k, sh, f) => fallback(fb, '22.06', k, sh, f),
});
L.add('22.07', {
  st: 'act4 2.H plate (art mcu: the door face receding on the right, the lot behind him) + issLayer mcu (Mas at medium (Ep1\'s medium rig), facing the shut flap, a face light one step)',
  overlay: OVL('22.07'),
  draw: (fb, k, sh, f) => fallback(fb, '22.07', k, sh, f),
});
L.add('22.08', {
  st: 'act4 2.H plate (art knock) + act4/sets/iss drawMasBackKnock (the door and Mas in one frame, his back to us as he faces it: his right arm comes up, the elbow out, the fist\'s back at his head\'s height just off the door, held two beats, then lowered)',
  overlay: OVL('22.08'),
  draw: (fb, k, sh, f) => fallback(fb, '22.08', k, sh, f),
});
L.add('22.09', {
  st: 'act4 2.H plate (art away) + issLayer away (his back, walking away the way he came, small and smaller on the lot; the cube unchanged)',
  overlay: OVL('22.09'),
  draw: (fb, k, sh, f) => fallback(fb, '22.09', k, sh, f),
});

export const SCENE = defineScene({scene: '22', layouts: L.all});
void ISS_ANCHORS;
