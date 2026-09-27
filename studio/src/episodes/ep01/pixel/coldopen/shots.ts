// MR. MAS — Ep1 v3 pixel picture: THE COLD OPEN (sc 1–4), one layout per shot of lock `coldopen` (the
// v3-shots-coldopen-tag pass, 2026-09-27). The lock is ./data.ts (tools/lock.py on show/reel/ep01-v3/ep01-v3-coldopen.json,
// with ./takes-mouth.json: the fastrec takes plus mouth tracks for the two on-camera lines, from coldopen/tools/mouths.py).
// The art is v3-art-a's APEC stage, invite and rewind toast (show/episodes/ep01/production/full-v3/art/art-a.md §1.1) and
// this segment's small additive drawings in ./art.ts. The record is show/episodes/ep01/production/full-v3/shots-coldopen.md.
// The lead's ruling on the showrunner's note (2026-09-27): the cold open's own 1993 (4.01, 4.02) is cut; it ends on the
// rewind, which smears and collapses into the intro's first frame (its cursor), and the intro's 1993 pays off "too far".
//
// Rules kept: native 480 x 270, the master palette, whole-pixel moves, held drawings (the collapse is a crop, not a scale).
// Adult Mas never blinks (pov-and-framing §3.6); his life on camera is his mouth, his eyes and the light on him. No ring
// in his water (§3.6, Ep12's), no plates beyond the world's own tent card, no pointer text.
import {defineSegment, layouts, mk, mouth, on2, shiftRoom} from '../kit';
import {Buf, rect, clamp} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {Mask} from '../../../../shared/pixel/mask';
import {drawApecWide, drawApecMCU, drawApecTable, drawApec2S, apecFreeze, apecScrub, APEC, APEC_2S_LOOKS} from '../../../../shared/pixel/rooms/apec-stage';
import {drawInviteInsert} from '../../../../shared/pixel/kits/phone-invite';
import {drawRewindToast, yearAt} from '../../../../shared/pixel/kits/rewind-toast';
import {tableStone, hostSpill, freezeOutside, mcuLive, phoneLive, buzzPhone, drawIntroCursor, smearRoom, collapseFrame, SMEAR} from './art';
import {LOCK} from './data';

const L = layouts();
const black = (fb: Buf) => { rect(0, 0, 480, 270, fb.ink(PAL.N0)); return {full: true}; };
/** the camera ends 1.01's drift upstage here, and the later wides keep it */
const PUSH_END = 12;
/** the hailstone in the MCU: out of the far window as he starts, across the soft window behind him, out of the top of
 *  frame before the cut (held on 2s: whole-pixel steps) */
const HAIL_MCU = {k0: 14, k1: 124};

// ------------------------------------------------------------------ 1. the stage
L.add('1.00', {st: 'black (the hall is heard first: the bed leads the first frame by 0.5 s)', draw: (fb) => black(fb)});

L.add('1.01', {
  st: 'rooms/apec-stage drawApecWide: the one wide (the stage, the banquet across the street, the lit window across the bay), the slow drift upstage (push 0 → 12, 1 px every 8 f), Mas seated (cast/mas-seated, lap, three collars), the Orb at his shoulder, the host\'s hand + card (lifts on the question); the rail is the host\'s',
  marks: {q: ['on', 'e1-co-1-01', 0]},
  draw: (fb, k, sh, f) => {
    const push = Math.min(PUSH_END, Math.floor(k / 8));
    drawApecWide(fb, f, {ovation: 0, push, lift: k >= mk(sh, 'q', 12) - 2 ? 1 : 0, litWin: true, mas: {arm: 'lap', head: 'host'}});
  },
});

L.add('1.02', {
  st: 'rooms/apec-stage drawApecMCU: Mas answering (his portrait\'s near-front head, eyes on the host, mouth from the take), the window soft behind him; the hailstone leaves the far window as he starts and arcs up across it (mcuHailAt, held on 2s), out of the top of frame before the cut',
  face: {MAS: 'lip'},
  draw: (fb, k, sh, f) => {
    const t = (on2(k) - HAIL_MCU.k0) / (HAIL_MCU.k1 - HAIL_MCU.k0);
    drawApecMCU(fb, f, {hail: t >= 0 && t < 1 ? t : null, ovation: 0, litWin: true, mas: {mouth: mouth(sh, k, 'MAS'), look: 1}});
  },
});

L.add('1.03', {
  st: 'rooms/apec-stage drawApecTable (the table from above: his glass, the host\'s, his phone dark, the tent card legible) + coldopen/art tableStone (the stone drops in and bobs, no ring: his water line never moves) + hostSpill (the host\'s glass sloshes 1-2-3, then settles with its spill)',
  marks: {plink: ['snd', 'synth:plink', 1, 0], slosh: ['snd', 'synth:slosh', 1, 0]},
  draw: (fb, k, sh, f) => {
    const j = k - mk(sh, 'slosh', 3);
    const slosh = (j < 0 ? 0 : j < 2 ? 1 : j < 5 ? 2 : j < 11 ? 3 : j < 17 ? 1 : 0) as 0 | 1 | 2 | 3;
    drawApecTable(fb, f, {plink: null, slosh, phone: 'dark'});
    if (j >= 11) hostSpill(fb);
    tableStone(fb, f, k, mk(sh, 'plink', 2));
  },
});

L.add('1.04', {
  st: 'rooms/apec-stage drawApecMCU (the 1.02 set-up): "…discovery forward…" lands; after it the far window\'s phone clicks off, then the banquet rises (the ovation\'s second drawing) into the freeze',
  face: {MAS: 'lip'},
  marks: {fwd: ['we', 'e1-co-1-02', 'forward', 0]},
  draw: (fb, k, sh, f) => {
    const fwd = mk(sh, 'fwd', 35);
    drawApecMCU(fb, f, {hail: null, ovation: k >= fwd + 12 ? 1 : 0, litWin: k < fwd + 3, mas: {mouth: mouth(sh, k, 'MAS'), look: 1}});
  },
});

// ------------------------------------------------------------------ 2. the freeze
L.add('2.01', {
  st: 'rooms/apec-stage drawApecWide + apecFreeze: the wide frozen navy and cream mid-slosh, mid-ovation, the card up; Mas and his phone stay in colour (the live mask); a 3-frame flash on the cut (the one flash)',
  enter: {kind: 'flash', frames: 3},
  draw: (fb, k, sh) => {
    const live = new Mask(480, 270);
    drawApecWide(fb, sh.s, {ovation: 1, hail: 'glass', slosh: 2, phone: 'dark', push: PUSH_END, lift: 1, litWin: false, mas: {arm: 'lap', head: 'host'}, live});
    apecFreeze(fb, live);
    void k;
  },
});

L.add('2.02', {
  st: 'kits/phone-invite drawInviteInsert: the phone lights on the buzz and jumps 1 px while it buzzes (coldopen/art buzzPhone), the invite slides down in three held steps (Board sync · Fri 12:00, four nameless circles, Accept / Decline), held to read; the table round it frozen navy and cream (coldopen/art freezeOutside)',
  marks: {buzz: ['snd', 'synth:buzz', 1, 0]},
  draw: (fb, k, sh, f) => {
    const j = k - mk(sh, 'buzz', 1);
    const kk = j < 0 ? 0 : j < 2 ? 1 : j < 4 ? 2 : j < 6 ? 3 : j < 8 ? 4 : 5 + (j - 8);
    drawInviteInsert(fb, f, {k: kk, state: 'invite'});
    buzzPhone(fb, j >= 0 && j < 8 ? ((j >> 1) % 2 ? -1 : 1) : 0);
    freezeOutside(fb, phoneLive());
  },
});

L.add('2.03', {
  st: 'rooms/apec-stage drawApecMCU in the freeze (coldopen/art freezeOutside + mcuLive): Mas reads (lids low, the invite\'s white on his jaw), looks back up, "noted." (mouth from the take); on the tap the light on his jaw steps to the calendar\'s pale blue',
  face: {MAS: 'lip'},
  marks: {noted: ['on', 'e1-co-2-01', 0], tap: ['snd', 'key_tap_soft_03', 1, 0]},
  draw: (fb, k, sh, f) => {
    const up = mk(sh, 'noted', 26) - 8;
    const reading = k < up;
    const s = {mouth: mouth(sh, k, 'MAS'), look: (reading ? 0 : 1) as 0 | 1, lid: (reading ? 1 : 0) as 0 | 1};
    drawApecMCU(fb, f, {hail: null, ovation: 1, litWin: false, phoneLight: k >= mk(sh, 'tap', 32) ? 'accepted' : 'invite', mas: s});
    freezeOutside(fb, mcuLive(s));
  },
});

// ------------------------------------------------------------------ 3. the rewind
L.add('3.01', {
  st: 'rooms/apec-stage drawApec2S (the room back in colour): the Orb\'s iris steps phone → between → Mas on its three servos (APEC_2S_LOOKS); the rewind toast pops beside it on the blink (kits/rewind-toast, the year slot at 2023)',
  marks: {s2: ['snd', 'orb_servo', 2, 0], s3: ['snd', 'orb_servo', 3, 0], pop: ['snd', 'glyph_blink', 1, 0]},
  draw: (fb, k, sh, f) => {
    const look = k < mk(sh, 's2', 8) ? APEC_2S_LOOKS[0] : k < mk(sh, 's3', 15) ? APEC_2S_LOOKS[1] : APEC_2S_LOOKS[2];
    drawApec2S(fb, f, {orbLook: look, ovation: 1, litWin: false});
    const tk = k - mk(sh, 'pop', 22);
    if (tk >= 0) drawRewindToast(fb, 262, 60, {k: tk, year: 2023});
  },
});

L.add('3.02', {
  st: 'rooms/apec-stage drawApecWide run backward + apecScrub: the room scrubs back in held chunks (the Orb bobs backward; the card lowers, the ovation sits, the host\'s water climbs home, the stone flies out of his glass and back to the far window, whose phone lights again); it catches on 2022 (a 1-px judder, the room a light step up) and holds, then slips faster, washing up one more held light step (never to white); the toast\'s year rolls (yearAt), and on the blink it turns to `rewinding… too far` while the wheels spin on down toward the nineties. Then coldopen/art smearRoom (6 f: it slides left and streaks, faster) and collapseFrame (3 held steps of 2 f: the window closes on the intro\'s cursor, the band black too), and the last 2 f are the intro\'s first frame: its cyan cursor on black (drawIntroCursor)',
  marks: {caught: ['snd', 'orb_servo', 1, 0], slip: ['snd', 'orb_servo', 2, 0], far: ['snd', 'glyph_blink', 1, 0], col: ['txt', 'rewinding… too far', 'until', 0]},
  draw: (fb, k, sh) => {
    const len = sh.e - sh.s;
    const c = mk(sh, 'caught', 12), s = mk(sh, 'slip', 37), far = mk(sh, 'far', 72), col = mk(sh, 'col', len - 8);
    const sm = col - SMEAR.length;
    if (k >= len - 2) { rect(0, 0, 480, 270, fb.ink(PAL.N0)); drawIntroCursor(fb); return {full: true}; }
    // the Orb's own clock runs backward (3x), and stops while the counter is caught
    const fr = 100000 - (k < c ? k : k < s ? c : c + (k - s) * 2) * 3;
    const back = k >= s ? on2(k - s) : -1; // frames into the slip, on 2s
    const hailT = 1 - clamp((back - 4) / 18, 0, 1);
    const hail: number | 'glass' | null = back < 4 ? 'glass' : hailT > 0 ? hailT : null;
    drawApecWide(fb, fr, {
      ovation: k < s + 2 ? 1 : 0,
      slosh: (k < 6 ? 2 : k < s + 4 ? 1 : 0) as 0 | 1 | 2,
      lift: k < s + 6 ? 1 : 0,
      hail,
      litWin: k >= s + 20,
      push: PUSH_END,
      mas: {arm: 'lap', head: 'host'},
    });
    apecScrub(fb, k < c ? 0 : k < s ? 1 : 2);
    if (k === c || k === c + 1) shiftRoom(fb, 0, 1); // the catch: a 1-px judder, then it holds
    // the counter: the stick's years to 2001, then (after "too far") a year every 2 f down to 1994, the second frame of
    // each mid-roll, then the ones wheel creeping toward 3 in held steps: it never settles on camera
    const tx = APEC.orb[0] - PUSH_END + 16;
    if (k < far) drawRewindToast(fb, tx, 70, {k: 30 + k, ...yearAt(k / 24)});
    else {
      const j = k - far, yr = Math.max(1994, 2001 - Math.floor(j / 2));
      const roll = yr > 1994 ? (j % 2 ? 0.5 : 0) : Math.min(0.85, 0.2 * (1 + Math.floor((j - 14) / 3)));
      drawRewindToast(fb, tx, 70, {k: j, year: yr, roll, text: 'rewinding… too far'});
    }
    if (k >= sm) smearRoom(fb, Math.min(k, col - 1) - sm);
    if (k >= col) { collapseFrame(fb, Math.floor((k - col) / 2)); return {full: true}; }
  },
});

export const SEGMENT = defineSegment({seg: 'coldopen', lock: LOCK, layouts: L.all});
