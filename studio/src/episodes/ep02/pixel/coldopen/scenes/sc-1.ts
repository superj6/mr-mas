// MR. MAS — Ep2 v1 · coldopen · scene 1: THE MAMMOTH, AND WHAT CAME THROUGH THE DOOR (FEB 15 → FEB 29, 2024; the NopeAI
// lobby). 13 shots, 1320 f on the v1 EL lock (lock-v1.md). The shots pass, 2026-10-09; the record is
// show/episodes/ep02/production/v1/shots-coldopen.md. The staging is proposal.md sc 1 and script-v1.md's cold open:
//   ARRIVE   1.01 the master, 3 s on the room before a word: AROS's meadow in the wall screen (the 2.A leap, the Runway
//            take, near-photoreal inside the bezel only), the staff on beanbags, Gerg typing, Mas at the back
//   TURN     1.02-1.05 the mammoth's foot breaks the bezel on "sentence"; it steps out ours (pixel, a fifth leg for two
//            frames), melts the chair; "Directionally." and the freeze card. 1.06-1.11 two weeks on: three thuds, each
//            closer; the misdirect; the doors, the complaint down the axis to his feet, its pages, the last THUD
//   AFTER    1.11-1.12 the flyer lands on the complaint; DOT's spare 0, his one-pixel no, the second sign
//   OUT      1.13 the Orb's iris closes on the flyer's doorway; its light is where the intro's first frame has its lit
//            block (the matched object), SMASH TO INTRO on the knee's fourth note (the score's)
// Every frame below is the shot's own k (and f, the scene's frame: this scene starts the segment, so f is the segment
// frame). Marks come from the lock's words and sounds, with the planned frame as a fallback.
import {defineScene, layouts, mouth, roomMouth, mk} from '../../kit';
import {clamp} from '../../../../../shared/pixel/px';
import type {PxShot} from '../../kit';
import {freeze2, FREEZE_DARK, drawGagCard, maskOf, blink} from '../../../../ep01/pixel/act2/kit2';
import type {GagCard} from '../../../../ep01/pixel/act2/kit2';
import {PAL} from '../../../../../shared/pixel/palette';
import {drawMasStand2} from '../../art/cast/mas2';
import type {SeatPose} from '../../art/cast/civic2';
import {master, gergOTS, selbeepFore, dimRoom, medium, counter, axis, pageTurn, signLow, masCU, flyerIris, M, MED, PILLAR_FLYERS} from '../sets';
import type {MasterState} from '../sets';
import {putBustCut} from '../../../../../shared/pixel/cast/civic-kit';
import {selbeepBust} from '../../art/cast/selbeep';

const L = layouts();
const OVL = (shot: string) => ({manifest: `out/ep02/v1/inserts/aros/${shot}/manifest.json`});
const on2 = (k: number) => k - (k & 1);
/** staff poses: before the step-out they watch the screen; after it, a few heads turn to the mammoth; two weeks on,
 *  back to their laptops */
const watching = (seed: number): SeatPose => (seed % 5 === 3 ? 'type' : 'watch');
const turned = (k: number, k0: number) => (seed: number): SeatPose => (k >= k0 + (seed % 4) * 3 && seed % 3 !== 1 ? 'turn' : watching(seed));
const working = (f: number) => (seed: number): SeatPose => ((f + seed * 13) % 97 < 64 ? 'type' : 'watch');
/** the pixel mammoth's walk after the step-out (1.03 k8): one whole pixel a frame toward screen-left, its eight
 *  drawings on 3s; t = frames since it came out */
const mammothAt = (t: number) => ({x: M.outX - t, f: t});
/** SELBEEP's bust mouth and eyes (his lip-sync, a blink on its own schedule) */
const selbeep = (sh: PxShot, k: number, expr: 'proud' | 'worry' | 'smile', seed = 3) => ({mouth: mouth(sh, k, 'SELBEEP'), expr, lid: blink(k, seed)});

// ------------------------------------------------------------------ 1.01 ARRIVE: the lobby, AROS in the bezel
L.add('1.01', {
  st: 'coldopen/sets master (art/sets/lobby2 drawLobby2: the side-on lobby, FEB 15): the wall screen plays the 2.A take (the OVERLAY: Runway veo3.1_fast, a woolly mammoth in a snowy meadow, objects only, f000-071 at 1080p in the bezel); the staff on beanbags watching, GERG typing on his beanbag (gerg-poses sit), SELBEEP under the screen aiming his remote (art/cast/selbeep room), MAS at his counter with his water (art/cast/mas2) and the Orb at his shoulder, the lobby chair (art/creatures meltChair 0), the director\'s chair; the votives tick',
  overlay: OVL('1.01'),
  draw: (fb, k, sh, f) => {
    master(fb, {f, day: 15, screen: 'clip', chair: 0, selbeep: {arm: 'point', mouth: 'rest'}, staff: watching});
  },
});

// ------------------------------------------------------------------ 1.02 SELBEEP; the foot breaks the bezel on "sentence"
L.add('1.02', {
  st: 'coldopen/sets medium: the stone wall close, a rack pillar, the wall screen big (the OVERLAY plays the take f018-165 in it, and holds f165 as the foot comes out); SELBEEP\'s bust (Ep2\'s sculpted head, the remote at his chest) turned to the room, lip-synced, proud; on "sentence" the pixel foot (its own ramp, snow in its hair, four nails) breaks the bezel\'s lower lip, which cracks and drops two chips',
  face: {SELBEEP: 'lip'},
  overlay: OVL('1.02'),
  marks: {sent: ['w', 'e2-co-0001', 'sentence', 0], step: ['snd', 'mammoth_step_pixel', 1, 0]},
  draw: (fb, k, sh, f) => {
    const step = mk(sh, 'step', 148);
    const j = k - (step - 4);
    const foot = j < 0 ? 0 : j < 2 ? 10 : j < 4 ? 24 : 36;
    medium(fb, f, {foot, crack: k >= step, chips: k >= step ? Math.min(30, on2(k - step)) : 0});
    putBustCut(fb, selbeepBust({arm: 'remote', ...selbeep(sh, k, 'proud', 5)}), MED.bust.x, MED.bust.y, 203);
  },
});

// ------------------------------------------------------------------ 1.03 the step-out; GERG, not looking up
L.add('1.03', {
  st: 'coldopen/sets master (FEB 15) a rung down behind gergOTS: GERG\'s portrait (cast/gerg, faced camera-right, the laptop lid\'s back in front of him), not looking up, his mouth on his take. Beyond him the wall screen holds the take\'s f165 and steps it down to our grid (OVERLAY k0-7: real, 2 px, the native grid, the palette); on the step (k8) the pixel mammoth is out on the floor (art/creatures drawMammoth, its fifth leg for two frames), the screen behind it the meadow with nobody in it (aros.ts), and it walks screen-left a pixel a frame; the staff\'s heads turn; SELBEEP presents',
  face: {GERG: 'room'},
  overlay: OVL('1.03'),
  marks: {out: ['snd', 'mammoth_step_pixel', 1, 0]},
  draw: (fb, k, sh, f) => {
    const out = mk(sh, 'out', 8);
    const t = k - out;
    master(fb, {
      f, day: 15, screen: t < 0 ? 'clip' : 'meadow', chair: 0,
      mammoth: t >= 0 ? {...mammothAt(t), fifth: t < 2} : null, printsFrom: t >= 0 ? M.outX - t + 70 : null,
      selbeep: {arm: 'present', mouth: t >= 0 ? 'smile' : 'rest', flip: true},
      staff: t >= 0 ? turned(k, out + 4) : watching, gerg: false,
    });
    dimRoom(fb, 1);
    gergOTS(fb, f, roomMouth(sh, k, 'GERG'));
  },
});

// ------------------------------------------------------------------ 1.04 "It understands physics." The chair melts
const T04 = 65 - 8; // the mammoth's walk at 1.04's first frame (1.03 is 65 f; it came out at k8)
L.add('1.04', {
  st: 'coldopen/sets master (FEB 15, the screen\'s meadow) a rung down behind selbeepFore: SELBEEP\'s bust at frame right, lip-synced, proud; beyond him the mammoth walking screen-left past the staff, the lobby chair beside it sagging and melting in three held palette-drip steps under "It understands physics." (art/creatures meltChair 1-3), and at the back MAS\'s glance: his eye one pixel down to it',
  face: {SELBEEP: 'lip'},
  marks: {drip: ['snd', 'palette_drip', 1, 0], und: ['w', 'e2-co-0003', 'understands', 0], phys: ['w', 'e2-co-0003', 'physics', 0]},
  draw: (fb, k, sh, f) => {
    const d = mk(sh, 'drip', 114), u = mk(sh, 'und', 117), p = mk(sh, 'phys', 132);
    const chair = (k < d ? 0 : k < u + 6 ? 1 : k < p + 4 ? 2 : 3) as 0 | 1 | 2 | 3;
    master(fb, {f, day: 15, screen: 'meadow', chair, mammoth: mammothAt(T04 + k), printsFrom: M.outX - (T04 + k) + 70,
      glance: k >= d + 2, selbeep: null, staff: turned(k + 30, 0)});
    dimRoom(fb, 1);
    selbeepFore(fb, selbeep(sh, k, 'proud', 3));
  },
});

// ------------------------------------------------------------------ 1.05 "Directionally." The freeze card
const CARD_SELBEEP: GagCard = {x: 14, y: 12, name: 'SELBEEP', lines: ['DIRECTOR OF MAMMOTHS.'], stat: ['MAMMOTHS CONTAINED: 0'], accent: PAL.W7};
const T05 = T04 + 168;
const masKeep = maskOf((b) => drawMasStand2(b, M.mas.x, M.mas.y, {arm: 'down'}));
L.add('1.05', {
  st: 'coldopen/sets master (FEB 15) a rung down behind selbeepFore: SELBEEP beside what\'s left of the chair (the mammoth over the puddle), proud to worry on "Directionally." (lip-synced); on the hit the 2-TONE FREEZE (Ep1 act2/kit2 freeze2, the bright curve) with MAS kept in colour at the back, and the gag card SELBEEP / DIRECTOR OF MAMMOTHS. + MAMMOTHS CONTAINED: 0 (kit2 drawGagCard, top left, clear of his face), held to the cut',
  face: {SELBEEP: 'lip'},
  marks: {hit: ['snd', 'freeze_hit_F', 1, 0], dir: ['on', 'e2-co-0004', 0]},
  draw: (fb, k, sh, f) => {
    const hit = mk(sh, 'hit', 30), dir = mk(sh, 'dir', 6);
    const kk = Math.min(k, hit);
    master(fb, {f: f - k + kk, day: 15, screen: 'meadow', chair: 3, mammoth: mammothAt(T05 + kk), printsFrom: M.outX - (T05 + kk) + 70, staff: turned(200, 0)});
    if (k < hit) dimRoom(fb, 1);
    selbeepFore(fb, selbeep(sh, kk, kk >= dir - 1 ? 'worry' : 'proud', 9));
    if (k >= hit) {
      // the dark room's curve (Ep1's FREEZE_DARK): the lobby prints as a lobby, not as navy
      freeze2(fb, (x, y) => masKeep(x, y), FREEZE_DARK);
      drawGagCard(fb, k - hit + 3, CARD_SELBEEP);
    }
  },
});

// ------------------------------------------------------------------ 1.06 two weeks on: DOT swaps 86 for 100; the first THUD
const T06 = 120; // two weeks on, the mammoth is still wandering: it leaves screen-left during the shot
L.add('1.06', {
  st: 'coldopen/sets master (FEB 29): DOT up her ladder at the sign from behind (art/cast/dot), 86 comes off and 100 goes up on the plate_hang; the mammoth wanders out screen-left in front of Mas (his head over its back), its prints in the carpet, the chair a teal puddle; the staff back at their laptops; on the THUD outside the door glass shivers (the rattle)',
  marks: {hang: ['snd', 'plate_hang', 1, 0], thud: ['snd', 'hand_truck_step', 1, 0], rat: ['snd', 'door_glass_rattle', 1, 0]},
  draw: (fb, k, sh, f) => {
    const hang = mk(sh, 'hang', 27), rat = mk(sh, 'rat', 78);
    const sign1 = k < hang - 13 ? '86' : k < hang ? ' ' : '100';
    const r = k - rat;
    master(fb, {f, day: 29, screen: 'off', sign1, chair: 3, mammoth: {x: 8 - k - (k >> 2), f: T06 + k}, printsFrom: 0,
      dot: {pose: 'reach', tilt: 0}, staff: working(f), rattle: (r >= 0 && r < 8 ? ((r >> 1) % 2 ? 2 : 1) : 0) as 0 | 1 | 2});
  },
});

// ------------------------------------------------------------------ 1.07 Selbeep O.S.; the second THUD; the coffee jumps
L.add('1.07', {
  st: 'coldopen/sets counter: the back counter at medium, MAS (Ep1\'s approved medium rig, faced to the doors, still) with the Orb at his shoulder, his water and a staffer\'s coffee on the stone top, DOT\'s ladder and her feet at frame right, the sign\'s foot over him; SELBEEP is off screen (his voice is established); on the THUD the coffee jumps (its drops), his water doesn\'t, the ladder sways a pixel and her feet shift',
  marks: {thud: ['snd', 'hand_truck_step', 1, 0], cup: ['snd', 'cup_jump', 1, 0], sway: ['snd', 'ladder_sway_creak', 1, 0]},
  draw: (fb, k, sh, f) => {
    const c = k - mk(sh, 'cup', 127), s = k - mk(sh, 'sway', 129);
    const lift = c < 0 ? 0 : [3, 6, 5, 2][Math.min(c, 3)];
    counter(fb, f, {cupLift: lift, drops: c < 1 ? 0 : Math.min(2, c), tilt: (s < 0 ? 0 : s % 2 ? -1 : 1) as -1 | 0 | 1});
  },
});

// ------------------------------------------------------------------ 1.08 GERG: "That's not the mammoth."
L.add('1.08', {
  st: 'coldopen/sets master (FEB 29) a rung down behind gergOTS: GERG at his laptop, not looking up, his mouth on his take, the keys under it (his shoulders on his typing); beyond him DOT gripping the ladder still settling from the sway, the staff typing, the chair\'s puddle; the doors far right still shivering from the thud',
  face: {GERG: 'room'},
  draw: (fb, k, sh, f) => {
    master(fb, {f, day: 29, screen: 'off', chair: 3, printsFrom: 0, dot: {pose: 'grip', tilt: (k < 6 ? (k % 2 ? 1 : -1) : 0) as -1 | 0 | 1},
      staff: working(f), rattle: (k < 8 ? ((k >> 1) % 2 ? 2 : 1) : 0) as 0 | 1 | 2, gerg: false});
    dimRoom(fb, 1);
    gergOTS(fb, f, roomMouth(sh, k, 'GERG'));
  },
});

// ------------------------------------------------------------------ 1.09 the doors blow open: the complaint down the axis
/** the complaint's roll: from the doorway (z 1) to his feet (z 0.52), easing out; held on 2s */
const ROLL = {X0: -13, X1: -30, z0: 1.0, z1: 0.47};
const rollAt = (t: number, len: number) => { const u = clamp(t / len, 0, 1), e = 1 - (1 - u) * (1 - u); return {X: Math.round(ROLL.X0 + (ROLL.X1 - ROLL.X0) * e), z: ROLL.z0 + (ROLL.z1 - ROLL.z0) * e}; };
const shakeAt = (k: number, at: number): [number, number] => { const j = k - at; return j === 0 || j === 1 ? [2, 1] : j === 2 ? [-1, 0] : j === 3 ? [1, 0] : [0, 0]; };
L.add('1.09', {
  st: 'coldopen/sets axis: OVER MAS\'S SHOULDER straight down the axis to the glass doors (a one-point lobby in the master\'s lit materials, the rack pillars receding, the runner down the middle); THUD: a shape behind the frosted glass, the room layer shakes 2 px (Mas and the UI never do); the doors bang open (their leaves in four drawings), daylight down the floor, and for the swing the sidewalk: a planter, a PAUSE sign leaning on it (a group sign only); the hand truck rolls in and down the axis by itself (no one pushing), the complaint upright on it growing in held steps (its caption NOLE v. MANALT ET AL. over YOU PROMISED!!!, legible from its arrival), and stops at his feet; the doors swing shut behind it',
  marks: {step: ['snd', 'hand_truck_step', 1, 0], bang: ['snd', 'door_bang_open', 1, 0], roll: ['snd', 'hand_truck_roll', 1, 0]},
  draw: (fb, k, sh, f) => {
    const step = mk(sh, 'step', 5), bang = mk(sh, 'bang', 14), roll = mk(sh, 'roll', 24);
    const b = k - bang;
    const swing = (b < 0 ? 0 : b < 2 ? 1 : b < 6 ? 2 : b < 10 ? 3 : b < 30 ? 2 : b < 34 ? 1 : 0) as 0 | 1 | 2 | 3;
    const sa = shakeAt(k, step), sb = shakeAt(k, bang);
    const shake: [number, number] = [sa[0] || sb[0], sa[1] || sb[1]];
    const t = on2(k - roll);
    // before the roll it waits in the doorway's left half (the PAUSE sign beyond it on the right, for the swing)
    const at = k < roll ? {X: ROLL.X0, z: ROLL.z0} : rollAt(t, 36);
    axis(fb, f, {swing, pause: swing > 0, shake, open: swing > 0 ? 1 : 0, truck: k >= bang ? {X: at.X, z: at.z, load: true} : null, ghost: k >= step && k < bang, pinned: true});
  },
});

// ------------------------------------------------------------------ 1.10 the pages
L.add('1.10', {
  st: 'art/sets/lobby2-art complaintPageECU via coldopen/sets pageTurn: page one, every line exclamation points; on the flutter it lifts off in three held steps; the contents `! .... 1` / `!! .... 2` / `!!! .... 3` held to read',
  marks: {flut: ['snd', 'paper_flutter', 1, 0]},
  draw: (fb, k, sh) => { pageTurn(fb, k, mk(sh, 'flut', 4) + 1); },
});

// ------------------------------------------------------------------ 1.11 the last THUD; the flyer
const FLYER = {x0: PILLAR_FLYERS[0][0], y0: PILLAR_FLYERS[0][1]};
/** where it lands: the complaint's near half (sets complaintFlat's flyer) */
const LAND = {x: 281, y: 185};
/** it lands a little nearer and right of where it stood (clear of his shoulder), face up */
const FLAT = {X: -14, z: 0.45};
L.add('1.11', {
  st: 'coldopen/sets axis (the 1.09 camera): the complaint tips off the hand truck and lands flat at his feet, the last THUD (the room shakes; the knee\'s first note is the score\'s); the empty truck rolls back a little; a curling flyer shakes off the nearest pillar and tumbles down onto the complaint, face up: WHERE IS ALYI?, its photo a doorway with nobody in it, held to read',
  marks: {thud: ['snd', 'paper_stack_fall', 1, 0], flut: ['snd', 'paper_flutter', 1, 0]},
  draw: (fb, k, sh, f) => {
    const thud = mk(sh, 'thud', 3), flut = mk(sh, 'flut', 21);
    const land = flut + 7, start = thud + 5;
    // it tips back off the nose plate: its foot stays where it stood, its top lands away from us, face up
    let falling: {x: number; y: number; rot: number} | null = null;
    if (k >= start && k < land) {
      const u = (on2(k) - start) / (land - start);
      falling = {x: Math.round(FLYER.x0 + (LAND.x - FLYER.x0) * u + Math.sin(u * 9) * 10 * (1 - u)), y: Math.round(FLYER.y0 + (LAND.y - FLYER.y0) * u * u), rot: Math.floor(on2(k) / 3)};
    }
    axis(fb, f, {
      swing: 0, pause: false, open: 0, shake: shakeAt(k, thud),
      // the empty truck rolls off to the right and away, out from under it
      truck: k < thud ? {X: ROLL.X1, z: ROLL.z1, load: true} : {X: ROLL.X1 + Math.min(64, 4 * on2(k - thud)), z: ROLL.z1 + Math.min(0.16, 0.012 * on2(k - thud)), load: false},
      flat: k >= thud ? {X: FLAT.X, z: FLAT.z, flyer: {on: k >= land, legible: k >= land}, dust: k - thud} : null,
      falling, pinned: k < start,
    });
  },
});

// ------------------------------------------------------------------ 1.12 AFTERMATH: the spare 0, the no, the second sign
L.add('1.12', {
  st: 'coldopen/sets signLow ([LOW] the sign from below, art/sets/lobby2-art signFromBelow: DOT\'s orange-cuffed hand holds the spare 0 out) → masCU ([MCU] Ep1\'s approved CU of MAS in the lobby, cast/mas-cu: the head shake is the drawing a pixel over and back, twice; he never blinks) → signLow (she lowers the 0, and the second sign comes up under the first in her hand and hangs on the plate_hang: DAYS SINCE SOMEONE SUED MAS: 0, held to read)',
  marks: {hang: ['snd', 'plate_hang', 1, 0]},
  draw: (fb, k, sh, f) => {
    const hang = mk(sh, 'hang', 65);
    if (k < 28) { signLow(fb, f, {zero: 'out', second: 0, hand: false}); return; }
    if (k < 53) { const j = k - 34; masCU(fb, f, j >= 0 && j < 4 ? -1 : j >= 8 && j < 12 ? -1 : 0); return; }
    const second = (k < hang - 5 ? 0 : k < hang - 2 ? 1 : k < hang ? 2 : 3) as 0 | 1 | 2 | 3;
    signLow(fb, f, {zero: k < 59 ? 'down' : 'gone', second, hand: second > 0 && k < hang + 5});
  },
});

// ------------------------------------------------------------------ 1.13 OUT: the Orb's iris on the doorway
L.add('1.13', {
  st: 'coldopen/sets flyerIris: [ECU] the flyer on the complaint\'s page (WHERE IS ALYI?, its photo a doorway, the door half open on light, nobody in it); the Orb comes down into the frame and looks, its servo; its iris (six blades) closes on the doorway in held steps until only the door\'s light is left, where the intro\'s first frame has its lit block; SMASH TO INTRO',
  marks: {servo: ['snd', 'orb_servo', 1, 0]},
  draw: (fb, k, sh, f) => {
    const s = mk(sh, 'servo', 9);
    const oy = k < 2 ? -40 : k < 4 ? -8 : k < 6 ? 14 : 26;
    const look: [number, number] = k < s ? [-0.45, 0.2] : k < s + 3 ? [-0.6, 0.35] : [-0.75, 0.45];
    // the flyer holds a second to be read; then the iris closes on the doorway in four held steps and holds on it
    const j = k - (s + 13);
    const r = j < 0 ? null : j < 4 ? 300 : j < 8 ? 170 : j < 12 ? 104 : 62;
    flyerIris(fb, f, {orb: {x: 392, y: oy, look}, iris: r});
  },
});

export const SCENE = defineScene({scene: '1', layouts: L.all});
