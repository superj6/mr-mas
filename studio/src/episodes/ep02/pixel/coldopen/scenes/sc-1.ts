// MR. MAS — Ep2 v1 · coldopen · scene 1: THE MAMMOTH, AND WHAT CAME THROUGH THE DOOR (FEB 15 → FEB 29, 2024; the NopeAI
// lobby). 13 shots, 1320 f on the v1 EL lock (lock-v1.md). The shots pass, 2026-10-09, and its review fixes the same
// day; the record is show/episodes/ep02/production/v1/shots-coldopen.md. The staging is proposal.md sc 1 and
// script-v1.md's cold open:
//   ARRIVE   1.01 the master, 3 s on the room before a word: AROS's meadow in the wall screen (the 2.A leap, the Runway
//            take, near-photoreal inside the bezel only), the staff on beanbags, Gerg typing, Mas behind his counter
//   TURN     1.02-1.05 the mammoth's foot breaks the bezel on "sentence"; it climbs out ours (head-on, turning, its hind
//            legs dropping; a fifth leg for two frames) and walks; the heads turn after it; it melts the chair;
//            "Directionally." and the freeze card (the mammoth kept in colour). 1.06-1.11 two weeks on: three thuds,
//            each closer; the misdirect; the doors, the courier's kick, the complaint down the axis to his feet, its
//            pages, the last THUD
//   AFTER    1.11-1.12 the flyer lands on the complaint; DOT's spare 0, his no, the second sign
//   OUT      1.13 the Orb's iris closes on the flyer's doorway; its light is where the intro's first frame has its lit
//            block (the matched object), SMASH TO INTRO on the knee's fourth note (the score's)
// Every frame below is the shot's own k (and f, the scene's frame: this scene starts the segment, so f is the segment
// frame). Marks come from the lock's words and sounds, with the planned frame as a fallback. The cameras: CAM.W (the
// master), CAM.OTS (over Gerg: the room reframed 24 px right, 4 down), CAM.M (on Selbeep: 20 px left), so each
// composite is its own setup.
import {defineScene, layouts, mouth, roomMouth, mk} from '../../kit';
import {clamp, Buf} from '../../../../../shared/pixel/px';
import type {PxShot} from '../../kit';
import {freeze2, FREEZE_DARK, drawGagCard, blink} from '../../../../ep01/pixel/act2/kit2';
import type {GagCard} from '../../../../ep01/pixel/act2/kit2';
import {PAL} from '../../../../../shared/pixel/palette';
import {master, gergOTS, selbeepFore, putSelbeep, dimRoom, medium, counter, axis, pageTurn, signLow, masCU, flyerIris, M, MED, CAM, PILLAR_FLYERS, SELBEEP_FORE} from '../sets';
import type {MasterState, StaffPose, DotArms, CounterState} from '../sets';
import type {SeatPose} from '../../art/cast/civic2';

const L = layouts();
const OVL = (shot: string) => ({manifest: `out/ep02/v1/inserts/aros/${shot}/manifest.json`});
const on2 = (k: number) => k - (k & 1);
/** staff poses: before the step-out they watch the screen; once it is out their heads turn after it (the backs of
 *  their heads: upstage-right toward it, upstage-left once it has passed them; the one who types never looks up); two
 *  weeks on, back to their laptops */
const watching = (seed: number): SeatPose => (seed % 5 === 3 ? 'type' : 'watch');
const lookAt = (mx: number | null, since: number) => (seed: number, x: number): StaffPose => {
  if (mx === null || since < 4 + (seed % 4) * 3) return watching(seed);
  if (seed % 5 === 3) return 'type';
  return x > mx + 44 ? 'backL' : 'backR';
};
const working = (f: number) => (seed: number): SeatPose => ((f + seed * 13) % 97 < 64 ? 'type' : 'watch');
/** the pixel mammoth's walk once its hind feet are down (1.03 k29): one whole pixel a frame toward screen-left, its
 *  eight drawings on 3s; t = frames since it broke the bezel (1.03 k8) */
const mammothAt = (t: number) => ({x: M.outX - t, f: t});
/** SELBEEP's bust mouth and eyes (his lip-sync, a blink on its own schedule) */
const selbeep = (sh: PxShot, k: number, expr: 'proud' | 'worry' | 'smile', seed = 3) => ({mouth: mouth(sh, k, 'SELBEEP'), expr, lid: blink(k, seed)});

// ------------------------------------------------------------------ 1.01 ARRIVE: the lobby, AROS in the bezel
L.add('1.01', {
  st: 'coldopen/sets master (art/sets/lobby2 drawLobby2: the side-on lobby, FEB 15): the wall screen plays the 2.A take (the OVERLAY: Runway veo3.1_fast, a woolly mammoth in a snowy meadow, objects only, f000-071 at 1080p in the bezel); the staff on beanbags watching, GERG typing on his beanbag (gerg-poses sit, his laptop\'s cyan on his jaw), SELBEEP under the screen aiming his remote (art/cast/selbeep room), MAS behind his counter\'s right end, his hands on its top between his water and a staffer\'s coffee (art/cast/mas2), the Orb at his shoulder, the lobby chair (art/creatures meltChair 0), the director\'s chair; the votives tick',
  overlay: OVL('1.01'),
  draw: (fb, k, sh, f) => {
    master(fb, {f, day: 15, screen: 'clip', chair: 0, selbeep: {arm: 'point', mouth: 'rest'}, staff: watching});
  },
});

// ------------------------------------------------------------------ 1.02 SELBEEP; the foot breaks the bezel on "sentence"
L.add('1.02', {
  st: 'coldopen/sets medium: the stone wall close, a rack pillar, the wall screen big (the OVERLAY plays the take f018-165 in it, and holds f165 as the foot comes out); SELBEEP\'s bust (Ep2\'s sculpted head, the remote at his chest, his forearm a sleeve value lit) turned to the room, lip-synced, proud; on "sentence" the pixel foot (its own ramp, snow in its hair, four nails) breaks the bezel\'s lower lip, which cracks and drops two chips',
  face: {SELBEEP: 'lip'},
  overlay: OVL('1.02'),
  marks: {sent: ['w', 'e2-co-0001', 'sentence', 0], step: ['snd', 'mammoth_step_pixel', 1, 0]},
  draw: (fb, k, sh, f) => {
    const step = mk(sh, 'step', 148);
    const j = k - (step - 4);
    const foot = j < 0 ? 0 : j < 2 ? 10 : j < 4 ? 24 : 36;
    medium(fb, f, {foot, crack: k >= step, chips: k >= step ? Math.min(30, on2(k - step)) : 0});
    putSelbeep(fb, {arm: 'remote', ...selbeep(sh, k, 'proud', 5)}, MED.bust.x, MED.bust.y);
  },
});

// ------------------------------------------------------------------ 1.03 the step-out; GERG, not looking up
L.add('1.03', {
  st: 'coldopen/sets master (FEB 15) reframed (CAM.OTS) a rung down behind gergOTS: GERG\'s portrait low at frame left (clear of Mas), his laptop\'s deck and lid in front of him, the screen\'s cyan on his face, two fingertips on the keys; not looking up, his mouth on his take. Beyond him the wall screen holds the take\'s f165 and steps it down to our grid (OVERLAY k0-7: real, 2 px, the native grid, the palette); on the first step (k8) it climbs out ours in three held drawings (head-on, its forelegs over the cracked lip and its body still in the bezel; three-quarter, half out, turning, its forefeet on the floor; in profile, its hind legs dropping, the fifth leg for two frames), the screen behind it the meadow with nobody in it (aros.ts); on the second step (k29) its hind feet are down and it walks screen-left a pixel a frame (art/creatures drawMammoth); the staff\'s heads turn after it; SELBEEP presents',
  face: {GERG: 'room'},
  overlay: OVL('1.03'),
  marks: {out: ['snd', 'mammoth_step_pixel', 1, 0], land: ['snd', 'mammoth_step_pixel', 2, 0]},
  draw: (fb, k, sh, f) => {
    const out = mk(sh, 'out', 8), land = mk(sh, 'land', 29);
    const t = k - out;
    const n = k < out ? null : k < out + 6 ? 0 : k < land - 8 ? 1 : k < land ? 2 : null;
    const walking = k >= land;
    const mx = walking ? mammothAt(t).x : n === null ? null : [372, 352, 345][n];
    master(fb, {
      f, day: 15, screen: t < 0 ? 'clip' : 'meadow', chair: 0,
      stepOut: n !== null ? {n: n as 0 | 1 | 2, fifth: n === 2 && k >= land - 2} : null,
      mammoth: walking ? mammothAt(t) : null, printsFrom: walking ? M.outX - t + 70 : null,
      selbeep: {arm: 'present', mouth: t >= 0 ? 'smile' : 'rest', flip: true},
      staff: lookAt(mx, t), gerg: false, cam: CAM.OTS,
    });
    dimRoom(fb, 1);
    gergOTS(fb, f, roomMouth(sh, k, 'GERG'));
  },
});

// ------------------------------------------------------------------ 1.04 "It understands physics." The chair melts
const T04 = 65 - 8; // the mammoth's walk at 1.04's first frame (1.03 is 65 f; it broke the bezel at k8)
L.add('1.04', {
  st: 'coldopen/sets master (FEB 15, the screen\'s meadow) reframed (CAM.M) a rung down behind selbeepFore: SELBEEP\'s bust at frame right, lip-synced, proud; beyond him the mammoth walking screen-left past the staff (their heads turned after it), the lobby chair beside it sagging in three held palette-drip steps under "It understands physics." (art/creatures meltChair 1-2, then a flat teal pool with one leg sticking up), and at the back MAS\'s glance: his head turned a pixel toward it, his eyes two, held to the cut',
  face: {SELBEEP: 'lip'},
  marks: {drip: ['snd', 'palette_drip', 1, 0], und: ['w', 'e2-co-0003', 'understands', 0], phys: ['w', 'e2-co-0003', 'physics', 0]},
  draw: (fb, k, sh, f) => {
    const d = mk(sh, 'drip', 114), u = mk(sh, 'und', 117), p = mk(sh, 'phys', 132);
    const chair = (k < d ? 0 : k < u + 6 ? 1 : k < p + 4 ? 2 : 3) as 0 | 1 | 2 | 3;
    const mm = mammothAt(T04 + k);
    master(fb, {f, day: 15, screen: 'meadow', chair, mammoth: mm, printsFrom: M.outX - (T04 + k) + 70,
      glance: k >= d + 2, selbeep: null, staff: lookAt(mm.x, 99), cam: CAM.M});
    dimRoom(fb, 1);
    selbeepFore(fb, selbeep(sh, k, 'proud', 3));
  },
});

// ------------------------------------------------------------------ 1.05 "Directionally." The freeze card
const CARD_SELBEEP: GagCard = {x: 14, y: 12, name: 'SELBEEP', lines: ['DIRECTOR OF MAMMOTHS.'], stat: ['MAMMOTHS CONTAINED: 0'], accent: PAL.W7};
const T05 = T04 + 168;
/** the freeze's keep mask: the pixels where Mas or the mammoth show (the frame with them against the frame without),
 *  less the ones Selbeep's bust covers; one per frozen frame */
const KEEP = new Map<string, Uint8Array>();
const keepOf = (st: MasterState, s: ReturnType<typeof selbeep>) => {
  const key = `${st.f}:${s.mouth}:${s.expr}:${s.lid}`;
  const hit = KEEP.get(key);
  if (hit) return hit;
  const A = new Buf(480, 270, 0), B = new Buf(480, 270, 0), S = new Buf(480, 270, 0x1000000);
  master(A, st); master(B, {...st, omit: {mas: true, mammoth: true}});
  selbeepFore(S, s);
  const m = new Uint8Array(480 * 203);
  for (let i = 0; i < m.length; i++) m[i] = A.c[i] !== B.c[i] && S.c[i] === 0x1000000 ? 1 : 0;
  KEEP.set(key, m);
  if (KEEP.size > 8) KEEP.delete(KEEP.keys().next().value as string);
  return m;
};
L.add('1.05', {
  st: 'coldopen/sets master (FEB 15) reframed (CAM.M) a rung down behind selbeepFore: SELBEEP beside what\'s left of the chair (the mammoth over the pool), proud to worry on "Directionally." (lip-synced); on the hit the 2-TONE FREEZE (Ep1 act2/kit2 freeze2, the dark room\'s curve) with MAS and THE MAMMOTH kept in colour, and the gag card SELBEEP / DIRECTOR OF MAMMOTHS. + MAMMOTHS CONTAINED: 0 (kit2 drawGagCard, top left, clear of his face), held to the cut',
  face: {SELBEEP: 'lip'},
  marks: {hit: ['snd', 'freeze_hit_F', 1, 0], dir: ['on', 'e2-co-0004', 0]},
  draw: (fb, k, sh, f) => {
    const hit = mk(sh, 'hit', 30), dir = mk(sh, 'dir', 6);
    const kk = Math.min(k, hit);
    const mm = mammothAt(T05 + kk);
    const st: MasterState = {f: f - k + kk, day: 15, screen: 'meadow', chair: 3, mammoth: mm, printsFrom: M.outX - (T05 + kk) + 70, staff: lookAt(mm.x, 99), cam: CAM.M};
    master(fb, st);
    if (k < hit) dimRoom(fb, 1);
    const s = selbeep(sh, kk, kk >= dir - 1 ? 'worry' : 'proud', 9);
    selbeepFore(fb, s);
    if (k >= hit) {
      // the dark room's curve (Ep1's FREEZE_DARK): the lobby prints as a lobby; Mas and the mammoth stay in colour
      const keep = keepOf(st, s);
      freeze2(fb, (x, y) => y < 203 && keep[y * 480 + x] === 1, FREEZE_DARK);
      drawGagCard(fb, k - hit + 3, CARD_SELBEEP);
    }
  },
});

// ------------------------------------------------------------------ 1.06 two weeks on: DOT swaps 86 for 100; the first THUD
const T06 = 120; // two weeks on, the mammoth is still wandering: it leaves screen-left during the shot
L.add('1.06', {
  st: 'coldopen/sets master (FEB 29): DOT up her platform ladder from behind (sets dotLadder: art/cast/dot\'s figure, jointed arms, a rim of the doors\' light), swapping the plate in held steps: her near hand on the 86, the 86 lifted off its hooks (elbow bent), the bare hooks as she lowers it and hangs it on the guard rail, her hand behind her to the 100 in her back waistband, the 100 up and onto the hooks on the plate_hang; the board\'s panel never changes width; the mammoth wanders out screen-left in front of Mas\'s counter, its prints in the carpet, the chair a teal pool; the staff back at their laptops; on the THUD outside the votives dip, the door glass shivers (held), two staffers look round',
  marks: {hang: ['snd', 'plate_hang', 1, 0], thud: ['snd', 'hand_truck_step', 1, 0], rat: ['snd', 'door_glass_rattle', 1, 0]},
  draw: (fb, k, sh, f) => {
    const hang = mk(sh, 'hang', 27), thud = mk(sh, 'thud', 73), rat = mk(sh, 'rat', 78);
    const arms: DotArms = k < 8 ? 'reach' : k < 14 ? 'lift' : k < 20 ? 'lower' : k < hang - 3 ? 'pocket' : k < hang ? 'raise' : k < hang + 6 ? 'hang' : 'rails';
    const plate = k < 8 ? '86' : k < hang ? null : '100';
    const r = k - rat, h = k - thud;
    const look = (seed: number, x: number): StaffPose => (h >= 2 && h < 16 && (seed === 24 || seed === 13) ? 'backR' : working(f)(seed));
    master(fb, {f, day: 29, screen: 'off', plate, chair: 3, mammoth: {x: 8 - k - (k >> 2), f: T06 + k}, printsFrom: 0,
      dot: {arms, tilt: 0}, staff: look, dip: h >= 0 && h < 2,
      rattle: (r >= 0 && r < 10 ? ((r >> 1) % 2 ? 2 : 1) : 0) as 0 | 1 | 2});
  },
});

// ------------------------------------------------------------------ 1.07 Selbeep O.S.; the second THUD; the coffee jumps
/** the counter's state at a frame: j = frames since the cup jumped; the sway two steps from its mark; DOT's near foot
 *  shifts her weight once while she works and again when the ladder sways; Mas's eyes go to the cup once it lands */
const counterAt = (j: number, s: number, k: number): CounterState => ({
  j, tilt: (s < 0 ? 0 : s < 3 ? -1 : s < 6 ? 1 : 0) as -1 | 0 | 1,
  feet: (s >= 3 || (k >= 58 && k < 92)) ? 1 : 0, eyes: j >= 6,
});
L.add('1.07', {
  st: 'coldopen/sets counter: the back counter at medium (its end at frame right, as the master\'s counter end), MAS (Ep1\'s approved medium rig, faced to the doors, still) with the Orb at his shoulder, his water and a staffer\'s coffee (a wisp of steam) on the stone top, DOT\'s ladder and her feet at frame right (she shifts her weight as she works), the sign\'s foot over him; SELBEEP is off screen (his voice is established); on the THUD the coffee jumps (its shadow stays on the stone), lands and splashes, his water doesn\'t move, the ladder sways two steps, her feet shift, and Mas\'s eyes go down to the cup and stay; the shot runs on into 1.08\'s first frames (the cut moved to f810, after the payoff, as Gerg starts)',
  marks: {thud: ['snd', 'hand_truck_step', 1, 0], cup: ['snd', 'cup_jump', 1, 0], sway: ['snd', 'ladder_sway_creak', 1, 0]},
  draw: (fb, k, sh, f) => {
    const cup = mk(sh, 'cup', 127), sway = mk(sh, 'sway', 129);
    counter(fb, f, counterAt(k - cup, k - sway, k));
  },
});

// ------------------------------------------------------------------ 1.08 GERG: "That's not the mammoth."
/** 1.07's picture runs on over 1.08's first frames: the payoff (the cup landing, the sway, her feet, his eyes) gets
 *  its time, and the cut lands on Gerg's line (a J-cut: his voice starts 5 frames before his picture). From the lock
 *  as built: 1.07 is 131 f with the cup at its k127 and the sway at k129, so 1.08's k0 is 4 frames after the cup */
const CUT08 = 11, J08 = 4, SWAY08 = 2;
L.add('1.08', {
  st: 'coldopen/sets counter (1.07 running on, k0-10) then the master (FEB 29) reframed (CAM.OTS) a rung down behind gergOTS: GERG at his laptop, not looking up, his mouth on his take, his fingertips ticking on the keys; beyond him DOT with both hands on her ladder\'s guard rail, the staff typing, the chair\'s pool',
  face: {GERG: 'room'},
  draw: (fb, k, sh, f) => {
    if (k < CUT08) { counter(fb, f, counterAt(k + J08, k + J08 - SWAY08, k + 131)); return; }
    master(fb, {f, day: 29, screen: 'off', chair: 3, printsFrom: 0, dot: {arms: 'rails', tilt: 0},
      staff: working(f), gerg: false, cam: CAM.OTS});
    dimRoom(fb, 1);
    gergOTS(fb, f, roomMouth(sh, k, 'GERG'));
  },
});

// ------------------------------------------------------------------ 1.09 the doors blow open: the complaint down the axis
/** the complaint's roll: from the doorway (z 1) to his feet (z 0.47), easing out as it coasts on the runner; on 2s */
const ROLL = {X0: -15, X1: -14, z0: 1.0, z1: 0.47};
const rollAt = (t: number, len: number) => { const u = clamp(t / len, 0, 1), e = 1 - (1 - u) * (1 - u); return {X: Math.round(ROLL.X0 + (ROLL.X1 - ROLL.X0) * e), z: ROLL.z0 + (ROLL.z1 - ROLL.z0) * e}; };
const shakeAt = (k: number, at: number): [number, number] => { const j = k - at; return j === 0 || j === 1 ? [2, 1] : j === 2 ? [-1, 0] : j === 3 ? [1, 0] : [0, 0]; };
L.add('1.09', {
  st: 'coldopen/sets axis: OVER MAS\'S SHOULDER straight down the axis to the glass doors (a one-point lobby in the master\'s lit materials); THUD: a shape behind the frosted glass, the room layer shakes 2 px (Mas and the UI never do); the doors bang open as the hand truck is shoved through them (their leaves in four drawings), daylight down the floor, and for the swing the sidewalk: a planter, a PAUSE sign leaning on it (a group sign only); in the doorway behind the truck the courier\'s leg and boot (pixel, no face) braced, drawn back, and the kick that sends it; it coasts down the runner, the complaint upright on it growing in held steps (its caption NOLE v. MANALT ET AL. over YOU PROMISED!!! in the largest face that fits its cover, ruled bars where none does), and comes to rest at his feet; the doors swing shut behind it',
  marks: {step: ['snd', 'hand_truck_step', 1, 0], bang: ['snd', 'door_bang_open', 1, 0], roll: ['snd', 'hand_truck_roll', 1, 0]},
  draw: (fb, k, sh, f) => {
    const step = mk(sh, 'step', 5), bang = mk(sh, 'bang', 14), roll = mk(sh, 'roll', 24);
    const b = k - bang;
    const swing = (b < 0 ? 0 : b < 2 ? 1 : b < 6 ? 2 : b < 10 ? 3 : b < 30 ? 2 : b < 34 ? 1 : 0) as 0 | 1 | 2 | 3;
    const sa = shakeAt(k, step), sb = shakeAt(k, bang);
    const shake: [number, number] = [sa[0] || sb[0], sa[1] || sb[1]];
    const t = on2(k - roll);
    const at = k < roll ? {X: ROLL.X0, z: ROLL.z0} : rollAt(t, 36);
    // (once the leaves are back against the jambs: while they swing they stand between us and the leg)
    const leg = swing < 2 || k < bang ? null : k < roll - 2 ? 'brace' : k < roll ? 'back' : k < roll + 2 ? 'kick' : k < roll + 6 ? 'back' : null;
    axis(fb, f, {swing, pause: swing > 0, shake, open: swing > 0 ? 1 : 0, truck: k >= bang ? {X: at.X, z: at.z, load: true} : null, ghost: k >= step && k < bang, pinned: true, leg});
  },
});

// ------------------------------------------------------------------ 1.10 the pages
L.add('1.10', {
  st: 'coldopen/sets pageTurn: [ECU] page one, set edge to edge like a page of body text (a header line, justified paragraphs, the page number) and every mark on it an exclamation point, held a second; on the flutter its corner lifts in the doors\' draught and flutters; it lifts off in three held steps; the contents (art/sets/lobby2-art complaintPageECU) `! .... 1` / `!! .... 2` / `!!! .... 3` held to read',
  marks: {flut: ['snd', 'paper_flutter', 1, 0]},
  draw: (fb, k, sh) => { pageTurn(fb, k, mk(sh, 'flut', 4), 22); },
});

// ------------------------------------------------------------------ 1.11 the last THUD; the flyer
const FLYER = {x0: PILLAR_FLYERS[0][0], y0: PILLAR_FLYERS[0][1]};
/** where it lands: over both lines of the flat complaint's caption (sets complaintFlat's flyer) */
const LAND = {x: 279, y: 176};
L.add('1.11', {
  st: 'coldopen/sets axis (the 1.09 camera): the hand truck, left standing, rocks back under its top-heavy load and tips over backward with it, the complaint landing flat and face up at his feet with the truck under it (its wheels at the near edge, its handles\' ends past the far edge): the last THUD (the room shakes; the knee\'s first note is the score\'s); a curling flyer shakes off the nearest pillar and tumbles down onto the complaint, face up, over both lines of its caption: its own sheet (warm white on the cream cover, its shadow, a few degrees of tilt, its corner curling), WHERE IS ALYI?, its photo a doorway with nobody in it, held to read',
  marks: {thud: ['snd', 'paper_stack_fall', 1, 0], flut: ['snd', 'paper_flutter', 1, 0]},
  draw: (fb, k, sh, f) => {
    const thud = mk(sh, 'thud', 3), flut = mk(sh, 'flut', 21);
    const land = flut + 7, start = thud + 5;
    let falling: {x: number; y: number; rot: number} | null = null;
    if (k >= start && k < land) {
      const u = (on2(k) - start) / (land - start);
      falling = {x: Math.round(FLYER.x0 + (LAND.x - FLYER.x0) * u + Math.sin(u * 9) * 10 * (1 - u)), y: Math.round(FLYER.y0 + (LAND.y - FLYER.y0) * u * u), rot: Math.floor(on2(k) / 3)};
    }
    const theta = k < thud - 2 ? null : k < thud - 1 ? 25 : k < thud ? 62 : null;
    axis(fb, f, {
      swing: 0, pause: false, open: 0, shake: shakeAt(k, thud),
      truck: k < thud - 2 ? {X: ROLL.X1, z: ROLL.z1, load: true} : null,
      tip: theta !== null ? {X: ROLL.X1, z: ROLL.z1, theta} : null,
      flat: k >= thud ? {X: ROLL.X1, z: ROLL.z1, flyer: {on: k >= land, legible: k >= land}, dust: k - thud} : null,
      falling, pinned: k < start,
    });
  },
});

// ------------------------------------------------------------------ 1.12 AFTERMATH: the spare 0, the no, the second sign
L.add('1.12', {
  st: 'coldopen/sets signLow ([LOW] the sign from below, its letters laid on after the keystone: DOT\'s orange-cuffed hand holds the spare 0 out, 0.8 s) → masCU ([MCU] Ep1\'s approved CU of MAS on this lobby\'s own backdrop out of focus: the board, the stone, the rack\'s cyan LEDs; still, then the no: the drawing a pixel left, right, left, each held 6 frames, then still; he never blinks) → signLow (she lowers the 0, and the second sign comes up under the first, her hand gripping its edge, and hangs on the plate_hang, she lets go: DAYS SINCE SOMEONE SUED MAS: 0, held to read)',
  marks: {hang: ['snd', 'plate_hang', 1, 0]},
  draw: (fb, k, sh, f) => {
    const hang = mk(sh, 'hang', 65);
    const A = 19, B = Math.min(hang - 6, 59);
    if (k < A) { signLow(fb, f, {zero: 'out', second: 0, hand: false}); return; }
    if (k < B) { const j = k - A; masCU(fb, f, j < 7 ? 0 : j < 13 ? -1 : j < 19 ? 1 : j < 25 ? -1 : 0); return; }
    const second = (k < hang - 4 ? 0 : k < hang - 2 ? 1 : k < hang ? 2 : 3) as 0 | 1 | 2 | 3;
    signLow(fb, f, {zero: k < B + 2 ? 'down' : 'gone', second, hand: second > 0 && k < hang + 5});
  },
});

// ------------------------------------------------------------------ 1.13 OUT: the Orb's iris on the doorway
L.add('1.13', {
  st: 'coldopen/sets flyerIris: [ECU] tight on the flyer lying on the complaint\'s cover (only plain cover round it: its caption is under the flyer), the flyer its own sheet (warm white, its shadow, its corner curling): WHERE IS ALYI?, its photo a doorway, the door half open on light, nobody in it; the Orb comes down into the frame over the bare cover and looks, its servo; its iris (six blades) closes on the doorway in held steps until only the door\'s light is left, where the intro\'s first frame has its lit block; SMASH TO INTRO',
  marks: {servo: ['snd', 'orb_servo', 1, 0]},
  draw: (fb, k, sh, f) => {
    const s = mk(sh, 'servo', 9);
    const oy = k < 2 ? -40 : k < 4 ? -8 : k < 6 ? 14 : 26;
    const look: [number, number] = k < s ? [-0.45, 0.2] : k < s + 3 ? [-0.6, 0.35] : [-0.75, 0.45];
    const j = k - (s + 13);
    const r = j < 0 ? null : j < 4 ? 300 : j < 8 ? 170 : j < 12 ? 104 : 62;
    flyerIris(fb, f, {orb: {x: 392, y: oy, look}, iris: r});
  },
});

void SELBEEP_FORE;
export const SCENE = defineScene({scene: '1', layouts: L.all});
