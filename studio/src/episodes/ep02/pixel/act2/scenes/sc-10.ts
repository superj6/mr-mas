// MR. MAS — Ep2 v1 · act2 · scene 10: THE PLAN: `OMNI` ([BLUEPRINT], cyan #7FDBFF on navy #0B1E3F). 7 shots, 1104 f
// on the v1 EL lock. The shots pass, 2026-10-09; the record is shots-act2.md. The staging is proposal.md sc 10 /
// script-v1 (the device's 18-bar form; THE PLAN never carries his voice):
//   ARRIVE   10.01 the panel's last square is the grid's first cell (9.06's last frame), 2 s on the sheet before her
//            first word; the stamp OMNI lands, (o = omni) types; on "hears", "sees", "talks" an ear, an eye, a mouth
//            draw themselves on
//   EXPLAIN  10.02 BEFORE: the three boxes draw on her words, the clerks pass a note; on "fell" TONE · LAUGHTER · WHO'S
//            TALKING · BACKGROUND NOISE drop through the grate, and backstage's [laughter] tag lies at its bottom ·
//            10.03 NOW: one box, GTP-4o; nothing falls through the grate; on "laugh back" the ear hears a laugh and the
//            mouth laughs back · 10.04 a pan down the steps: the tiny engineer walks on, 1. 232 MS (AVG 320), the
//            bubble has already answered · 10.05 2. MON circled (a tiny Radnus on the Tuesday square, unmentioned) and
//            3. $0, a tiny crowd floods in · 10.06 the tiny stage, its lights, tiny Rima in her spot
//   BREAK    10.07 an empty speech bubble drifts in from the margin, nothing in it; every tiny figure looks up; it blots
//            out the tiny stage's lights; the sheet tears, and through the tear pour the real stage lights (11.01's
//            first frame, the same picture)
import {defineScene, layouts, mk} from '../../kit';
import {planFrame2, DONE, PANS} from '../sets/plan';
import type {PlanT} from '../sets/plan';
import {demoOpen} from '../sets/stage';
import {glide} from '../sets/common';
import {Buf} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';

const L = layouts();
const D = DONE;
// what every earlier shot finished
const A1: PlanT = {stamp: D, fine: D, icons: [D, D, D]};
const A2: PlanT = {...A1, before: D, boxes: [D, D, D], fell: D, tag: D};
const A3: PlanT = {...A2, now: D, gbox: D, laugh: D};
const A4: PlanT = {...A3, s1: D, eng: D};
const A5: PlanT = {...A4, s2: D, s3: D, crowd: D};
const A6: PlanT = {...A5, stage: D};
let BEHIND: Buf | null = null;
const behind = () => { if (!BEHIND) { BEHIND = new Buf(480, 270, PAL.N0); demoOpen(BEHIND, 0, 0); } return BEHIND; };

L.add('10.01', {
  st: 'act2/sets/plan planFrame2 (the blueprint kit; the art\'s SET-11 sheet re-drawn so it draws itself on: the panel\'s last square lit as the grid\'s first cell for the first frames (9.06\'s match); the stamp OMNI lands with its kick on the stamp; (o = omni) types; an ear, an eye, a mouth draw themselves on "hears", "sees", "talks")',
  marks: {stamp: ['snd', 'rubber_stamp_C', 1, 0], fine: ['txt', '(o = omni)', 'at', 0], hears: ['w', 'e2-a2-0017', 'hears', 0], sees: ['w', 'e2-a2-0017', 'sees', 0], talks: ['w', 'e2-a2-0017', 'talks', 0]},
  draw: (fb, k, sh, f) => {
    const f0 = f - k;
    planFrame2(fb, f, {stamp: f0 + mk(sh, 'stamp', 18), fine: f0 + mk(sh, 'fine', 27), icons: [f0 + mk(sh, 'hears', 80), f0 + mk(sh, 'sees', 100), f0 + mk(sh, 'talks', 125)]}, {pan: PANS.stamp, cell: k < 12});
  },
});
L.add('10.02', {
  st: 'act2/sets/plan planFrame2 (BEFORE types; the three boxes (1 · SPEECH TO TEXT, 2 · MODEL, 3 · TEXT TO SPEECH) draw on her words, from the ear to the mouth, the tiny clerks passing a note; on "fell" the four words drop through box 1\'s grate in turn and land below it; the [laughter] tag (9.03\'s) lies at the grate\'s bottom; the camera glides down whole pixels to the grate as they fall)',
  marks: {before: ['txt', 'BEFORE', 'at', 0], b1: ['txt', 'EAR →', 'at', 0], b2: ['w', 'e2-a2-0018', 'models', 0], b3: ['w', 'e2-a2-0018', 'note', 0], fell: ['w', 'e2-a2-0018', 'fell', 0], tag: ['txt', '[laughter]', 'at', 0]},
  draw: (fb, k, sh, f) => {
    const f0 = f - k, fell = mk(sh, 'fell', 159);
    const pan = glide(k, fell - 14, fell + 4, PANS.before, PANS.grate, 2, true);
    planFrame2(fb, f, {...A1, before: f0 + mk(sh, 'before', 6), boxes: [f0 + mk(sh, 'b1', 17), f0 + mk(sh, 'b2', 60), f0 + mk(sh, 'b3', 100)], note: f0 + mk(sh, 'b3', 100) + 6, fell: f0 + fell, tag: f0 + mk(sh, 'tag', 198)}, {pan});
  },
});
L.add('10.03', {
  st: 'act2/sets/plan planFrame2 (NOW types; one double box GTP-4o, an ear, an eye and a mouth wired into it; the grate above it empty (nothing falls); on "laugh back" a ha in at the ear and a ha out at the mouth, which opens)',
  marks: {now: ['txt', 'NOW', 'at', 0], g: ['txt', 'GTP-4o', 'at', 0], laugh: ['snd', 'tiny_laugh_back', 1, 0]},
  draw: (fb, k, sh, f) => { const f0 = f - k; planFrame2(fb, f, {...A2, now: f0 + mk(sh, 'now', 6), gbox: f0 + mk(sh, 'g', 15), laugh: f0 + mk(sh, 'laugh', 120)}, {pan: PANS.now}); },
});
L.add('10.04', {
  st: 'act2/sets/plan planFrame2 (a whole-pixel pan down to the steps; the tiny engineer walks onto the paper; the stamp 1. lands, 232 MS (AVG 320) types; he opens his mouth and the tiny bubble has already answered: hi)',
  marks: {s1: ['snd', 'rubber_stamp_C', 1, 0]},
  draw: (fb, k, sh, f) => {
    const f0 = f - k, s1 = mk(sh, 's1', 86);
    planFrame2(fb, f, {...A3, eng: f0 + 30, s1: f0 + s1}, {pan: glide(k, 0, 40, PANS.now, PANS.steps, 2, true)});
  },
});
L.add('10.05', {
  st: 'act2/sets/plan planFrame2 (on "today" the stamp 2. lands: a tiny calendar, MON circled, a tiny Radnus standing on the Tuesday square (nobody mentions him); on "free" the stamp 3. lands, $0, and a tiny crowd files in from the right)',
  marks: {s2: ['snd', 'rubber_stamp_C', 1, 0], s3: ['snd', 'rubber_stamp_C', 2, 0], crowd: ['snd', 'tiny_crowd_patter', 1, 0]},
  draw: (fb, k, sh, f) => { const f0 = f - k; planFrame2(fb, f, {...A4, s2: f0 + mk(sh, 's2', 33), s3: f0 + mk(sh, 's3', 61), crowd: f0 + mk(sh, 'crowd', 67)}, {pan: PANS.steps}); },
});
L.add('10.06', {
  st: 'act2/sets/plan planFrame2 (the camera glides down to the last square: the tiny stage draws itself on, its six tiny lights, tiny Rima in her tiny spot, MAY 13 dimensioned under it)',
  draw: (fb, k, sh, f) => { const f0 = f - k; planFrame2(fb, f, {...A5, stage: f0 + 14}, {pan: glide(k, 0, 30, PANS.steps, PANS.stage, 2, true)}); void sh; },
});
L.add('10.07', {
  st: 'act2/sets/plan planFrame2 (an EMPTY speech bubble, lowercase-sized, nothing in it, drifts in from the right margin in held steps; every tiny figure looks up at it (a head a pixel up, a hot dot); it settles over the tiny stage and blots out its lights; on the tear the sheet tears across and through it pour the real stage lights: sets/stage demoOpen at k 0, 11.01\'s first frame)',
  marks: {tear: ['snd', 'paper_tear', 1, 0]},
  draw: (fb, k, sh, f) => {
    const tear = mk(sh, 'tear', 128);
    const bub = Math.min(1, glide(k, 4, tear - 30, 0, 100, 4, true) / 100);
    planFrame2(fb, f, A6, {pan: PANS.stage, bubble: bub, blot: bub >= 0.85, look: k >= 24, tear: k >= tear ? k - tear : -1, behind: behind()});
  },
});
export const SCENE = defineScene({scene: '10', layouts: L.all});
