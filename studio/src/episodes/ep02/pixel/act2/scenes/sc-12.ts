// MR. MAS — Ep2 v1 · act2 · scene 12: THE EMPTY SEAT (MAY 13 → MAY 14, 2024; the front row; then his dark room, the
// next afternoon). 8 shots, 960 f on the v1 EL lock. The shots pass, 2026-10-09; the record is shots-act2.md. The
// staging is proposal.md sc 12 (its final check: "her" and the departure never share a frame or a cause) / script-v1:
//   ARRIVE   12.01 the stage as the house lights come up full (cut on 11.16's ENDED screen: the same screen, dark), the
//            rig empty (the blimp has drifted out through it: it never shares a frame with the seat), the house empty;
//            Rima the last one on her mark with the clicker; closer: one breath, the professional's close, and she
//            walks off with it (her aftermath is her own: nobody hands anybody a clicker)
//   INSERT   12.02 the front row from the wings in plain house light: the seat RESERVED: CHIEF SCIENTIST, empty (the
//            placard never flips) · 12.03 its chrome armrest: Ep1's own Sep 25 toast in it for two seconds (Alyi
//            turning to Mas with a toast and a smile), then only the empty seat · 12.04 a beat of black
//   DOCUMENT 12.05 his dark room in the afternoon (the window's sky lit), the monitor beside him: the recap, ELGOOG'S
//            KEYNOTE under NopeAI's OMNI stamp (no blimp); his fingertip on its minimise, and back to work; a beat ·
//            12.06 his phone lights: Alyi's post in its own UI, his first sentence; the thumb scrolls once: "…I will
//            miss everyone dearly." · 12.07 he types his own post at a post's pace, posts it, hard-stopped at the crop
//            (no capital I as a pronoun on screen), and only after both posts' read time, V.O. 6
//   AFTER    12.08 his face held, a face light one step; the cue stops on the downbeat (the midpoint act-out)
// No staging gives a reason for Alyi's leaving (W8): no reflection turning away, no look at the blimp, no tether.
import {defineScene, layouts, mk} from '../../kit';
import {houseUp, rimaMCU, stageWide} from '../sets/stage';
import {rimaWalkAt} from '../../../../../shared/pixel/cast/rima-stand';
import {recapMCU, phoneECU, masMCU} from '../sets/dark';
import {frontRow, armrestECU} from '../../art/sets/stage';
import {glide} from '../sets/common';
import {fill} from '../../art/kit';
import {PAL} from '../../../../../shared/pixel/palette';

const L = layouts();

L.add('12.01', {
  st: 'act2/sets/stage houseUp → rimaMCU → stageWide ([W] the meter frame as the house lights snap up full on the lights-up (a jump in time from 11.16: the blimp gone out through the rig, the engineer gone, the stream dark): the rig dark, the big screen dark, the last of the house filing out a few heads at a time; Rima small on her mark, the last one there, the clicker in her hand; [MCU] Rima (Ep1\'s portrait) in the house light: one breath (her shoulders rise a pixel and settle), held; [W] the wide again: she walks off with the clicker into the wings (her room sprite\'s walk, facing frame left), behind the masking leg)',
  marks: {up: ['snd', 'house_lights_up', 1, 0]},
  draw: (fb, k, sh, f) => {
    const up = mk(sh, 'up', 5), W0 = 98;
    if (k < 64) { houseUp(fb, f, k, up); return; }
    if (k < W0) { rimaMCU(fb, f, {mouth: 'rest', light: 'house', breath: k >= 68 && k < 84 ? 1 : 0}); return; }
    // her walk off: whole pixels, three a frame, her walk cycle on the house's empty stage, into the wings
    const x = 168 - (k - W0) * 3;
    stageWide(fb, f, {spot: null, rig: 0, lights: 2, screen: {live: 'dark'}, house: {rows: 3, phones: 'down', gone: 1}, eng: null,
      rima: {x, flip: true, pose: {body: rimaWalkAt(k)}, light: 'house'}, legOver: true});
  },
});
L.add('12.02', {
  st: 'art/sets/stage frontRow ([W] the front row from the wings in plain house light, the house empty beyond, the rope; the seat reserved for the chief scientist, empty, its placard RESERVED: CHIEF SCIENTIST as it is (it never flips); no shade, no tether)',
  draw: (fb, k, sh, f) => { frontRow(fb, f); void k; void sh; },
});
L.add('12.03', {
  st: 'art/sets/stage armrestECU ([ECU] its chrome armrest, close: the post\'s rounded end and the red fabric of the seat beside it (12.02\'s armrest, nearer); on the Door\'s note a glint runs across the chrome and the party from last September comes up in it over six frames (Ep1\'s own art, act3 party partyToast: mirrored, wrapped round the post\'s curve and squashed toward its edges, graded cool and flat, the chrome\'s highlights streaking over it: a reflection of a past event, not a ghost): Alyi turning to Mas with a toast and a smile, the clink; two seconds, then it fades out behind the glint and the chrome shows only the seat\'s red)',
  marks: {note: ['snd', 'door_motif_note', 1, 0]},
  draw: (fb, k, sh, f) => { const n = mk(sh, 'note', 4); armrestECU(fb, f, {k, on: n, off: n + 42}); },
});
L.add('12.04', {
  st: 'black (a beat; the pad holds across it)',
  draw: (fb) => { fill(fb, 0, 0, 480, 203, PAL.N0); },
});
L.add('12.05', {
  st: 'act2/sets/dark recapMCU ([MCU] his dark room in the afternoon (Ep1\'s plate, the window\'s sky lit, the room a rung up); his approved portrait at the frame\'s right, the monitor beside him, legible: the recap, ELGOOG\'S KEYNOTE under NopeAI\'s OMNI stamp (no blimp: FC); his fingertip on its minimise on the click; it shrinks to the taskbar; back to work; a beat; the rail MAY 14, 2024)',
  marks: {min: ['snd', 'ui_minimise', 1, 0]},
  draw: (fb, k, sh, f) => {
    const m = mk(sh, 'min', 110);
    const min = k < m ? 0 : Math.min(1, glide(k, m, m + 10, 0, 100, 2) / 100);
    recapMCU(fb, f, {k, min, tap: k >= m - 14 && k < m - 4 ? 1 : k >= m - 4 && k < m + 3 ? 2 : 0});
  },
});
L.add('12.06', {
  st: 'act2/sets/dark phoneECU ([ECU] his phone in his hand (the art\'s hand rig, the wrap grip) lights on the buzz in held steps: Alyi\'s post in its own UI (the posts kit, verbatim, his name swapped), its first sentence; on the scroll his thumb runs it up once, whole-pixel steps, to the second crop "…I will miss everyone dearly."; no reason given (W8))',
  marks: {buzz: ['snd', 'phone_buzz_step_1', 1, 0], scroll: ['snd', 'thumb_scroll', 1, 0]},
  draw: (fb, k, sh, f) => {
    const bz = mk(sh, 'buzz', 2), sc = mk(sh, 'scroll', 96);
    const lit = k < bz ? -1 : Math.min(3, Math.floor((k - bz) / 2) + 1);
    const scroll = k < sc ? 0 : Math.min(1, glide(k, sc, sc + 7, 0, 100, 2) / 100);
    phoneECU(fb, f, lit < 0 ? {mode: 'dark'} : {mode: 'alyi', lit, scroll});
  },
});
L.add('12.07', {
  st: 'act2/sets/dark phoneECU ([ECU] his phone held from below (the cup grip), the composer: he types his own post at a post\'s pace, his thumb on the key of each letter; on the click it posts: his post in its own UI, sentence case as the source has it, hard-stopped at "…and a dear friend." (no scroll); V.O. 6 typed by the host only after both posts\' read time)',
  marks: {post: ['snd', 'post_click', 1, 0]},
  draw: (fb, k, sh, f) => {
    const p = mk(sh, 'post', 76), t0 = 9;
    if (k < p) { phoneECU(fb, f, {mode: 'compose', typed: Math.max(0, Math.floor(((k - t0) - ((k - t0) & 1)) * 3))}); return; }
    phoneECU(fb, f, {mode: 'posted'});
  },
});
L.add('12.08', {
  st: 'act2/sets/dark masMCU ([MCU] his face held in the afternoon dark room (Ep1\'s approved portrait toward the monitor), a face light one step (Ep1 kits/face-light-img, keyed from the monitor\'s side); still; the cue stops on the downbeat: the midpoint act-out)',
  draw: (fb, k, sh, f) => { masMCU(fb, f, {afternoon: true, faceLight: 1, mas: {look: -1, mouth: 'rest'}}); void k; void sh; },
});
export const SCENE = defineScene({scene: '12', layouts: L.all});
