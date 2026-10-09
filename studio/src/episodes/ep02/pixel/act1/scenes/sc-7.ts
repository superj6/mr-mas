// MR. MAS — Ep2 v1 · act1 · scene 7: A TENANT (MAR 19, 2024; the cathedral, cut away floor by floor). 8 shots, 1152 f
// on the v1 EL lock. The shots pass, 2026-10-09; the record is shots-act1.md. The staging is proposal.md sc 7:
//   ARRIVE   7.01 the split already opening (the curtain's two halves -> the building's), Mas at his monitor at the
//            top; his recorded voice on a phone leads the camera down floor by floor as the lights click on, past
//            MACROSOFT's plinth (BELOW · ABOVE · AROUND), to the basement, whose lights come on last (and his monitor,
//            four floors up, steps down a rung)
//   TURN     7.02-7.06 the Humanist moving in (his plate), Tasya in the doorway, the phone turned down; the welcome is
//            the lease; the key twisted off grows back (MAR 19), LE CHIEN's paw, the INQUIRY envelope bonks off it
//   AFTER    7.07 the camera goes with Tasya's glance up the section to Mas: "A tenant." lands on him; 7.08 1.5 s on Mas
//            at his monitor, the key ring's jangle below frame, then black: act-out 1
// The scene leaves Mas's point of view on his own recorded voice and returns to him on the jangle.
import {defineScene, layouts, mouth, mk, drawPlate} from '../../kit';
import type {PxText} from '../../kit';
import {PAL} from '../../../../../shared/pixel/palette';
import {section7, basement, keys, masDark, SECTION_H} from '../sets/tenant';
import {stepOf, RH} from '../sets/common';
import {fill} from '../../art/kit';

const L = layouts();
const BOTTOM = SECTION_H - RH;
const on2 = (k: number) => k - (k & 1);

L.add('7.01', {
  st: 'act1/sets/tenant section7 (art/sets/cutaway SET-06 copied: the dollhouse section, 430 rows; the facade\'s halves slide apart in whole-pixel steps; at the top the dark room, MAS at his monitor; the floors\' lights click on from the top down as the camera pans down whole pixels, following his recorded voice on the phone; MACROSOFT\'s plinth BELOW · ABOVE · AROUND held to read; the basement\'s lights last; the odometer egg in the bedrock)',
  marks: {c1: ['snd', 'light_bank_click', 1, 0], c2: ['snd', 'light_bank_click', 2, 0], c3: ['snd', 'light_bank_click', 3, 0], c4: ['snd', 'light_bank_click', 4, 0]},
  draw: (fb, k, sh, f) => {
    const c = [mk(sh, 'c1', 19), mk(sh, 'c2', 38), mk(sh, 'c3', 99), mk(sh, 'c4', 113)];
    const lit = stepOf(k, c);
    section7(fb, f, {split: Math.min(1, on2(k) / 22), lit, pan: Math.min(BOTTOM, Math.max(0, (k - 30) * 2)), dim: lit >= 4});
  },
});
const plateText = (sh: {texts: PxText[]}) => sh.texts.find((t) => t.kind === 'plate') ?? null;
L.add('7.02', {
  st: 'act1/sets/tenant basement ([2S] THE HUMANIST (art/cast/humanist bust, his DEFLECTION (LICENSED) box) by his sealed, faded boxes, caught out, lip-synced; he sets the box down; TASYA (Ep1 tasya-medium, the key ring) in the doorway\'s warm light; the phone face up on a box between them, turned down to one bar); his plate THE HUMANIST · MACROSOFT\'S NEW AI CHIEF typed on',
  face: {HUMANIST: 'lip'},
  marks: {set: ['snd', 'box_set', 1, 0]},
  draw: (fb, k, sh, f) => {
    const set = mk(sh, 'set', 35);
    basement(fb, f, {hum: {mouth: mouth(sh, k, 'HUMANIST'), expr: 'worry', arm: k < set ? 'box' : 'none'}, tasya: {mouth: 'smile', brow: 'warm'}, phone: k < 8 ? 'loud' : 'down'});
    const t = plateText(sh);
    if (t && k >= t.s && k < t.e) drawPlate(fb, t, k - t.s, 18, 166, PAL.C6);
  },
});
L.add('7.03', {
  st: 'act1/sets/tenant basement: TASYA\'s welcome (warm, unhurried; lip-synced), one Rhodes chord under it; the Humanist\'s polite smile',
  face: {TASYA: 'lip'},
  draw: (fb, k, sh, f) => { basement(fb, f, {hum: {mouth: 'rest', expr: 'smile', arm: 'none'}, tasya: {mouth: mouth(sh, k, 'TASYA'), brow: 'warm'}, phone: 'down'}); },
});
L.add('7.04', {
  st: 'act1/sets/tenant basement: THE HUMANIST at his boxes asks about his team (lip-synced); TASYA\'s answer, warm (lip-synced)',
  face: {HUMANIST: 'lip', TASYA: 'lip'},
  draw: (fb, k, sh, f) => { basement(fb, f, {hum: {mouth: mouth(sh, k, 'HUMANIST'), expr: 'neutral', arm: 'none'}, tasya: {mouth: mouth(sh, k, 'TASYA'), brow: 'warm'}, phone: 'down'}); },
});
L.add('7.05', {
  st: 'act1/sets/tenant keys (art/sets/cutaway keyECU: [ECU] the ring at his belt; a key twisted off and handed over, the new one grown back into the gap, stamped MAR 19 (the rail, stamped); LE CHIEN\'s paw-print key; Tasya\'s line off frame; THE TRUSTBUSTER\'s INQUIRY envelope sails in and bonks off the ring)',
  marks: {turn: ['snd', 'door_key_turn', 1, 0], bonk: ['snd', 'alert_bonk', 1, 0]},
  draw: (fb, k, sh, f) => {
    const tw = mk(sh, 'turn', 7), bk = mk(sh, 'bonk', 97);
    keys(fb, f, {grown: k >= tw + 22, env: k < bk - 6 ? 0 : k < bk ? 1 : 2});
    // the moment between: the gap where the key was (a bare split ring) before the new one grows
    if (k >= tw && k < tw + 22) { fill(fb, 236, 118, 12, 30, PAL.N3); }
  },
});
L.add('7.06', {
  st: 'act1/sets/tenant basement: THE HUMANIST looks up where Tasya looked (lip-synced: "Who else lives here?")',
  face: {HUMANIST: 'lip'},
  draw: (fb, k, sh, f) => { basement(fb, f, {hum: {mouth: mouth(sh, k, 'HUMANIST'), expr: 'worry', arm: 'none', look: -1}, tasya: {mouth: 'smile', brow: 'warm'}, phone: 'down', up: true}); },
});
L.add('7.07', {
  st: 'act1/sets/tenant section7: Tasya glances up again and the camera goes with his look, a whole-pixel pan up the section floor by floor to MAS at his monitor in the dimmed light; "A tenant." from four floors down lands on him (an L-cut); he doesn\'t hear it',
  draw: (fb, k, sh, f) => { section7(fb, f, {split: 1, lit: 4, pan: Math.max(0, BOTTOM - Math.max(0, k - 8) * 3), dim: true}); void sh; },
});
L.add('7.08', {
  st: 'act1/sets/tenant masDark ([MCU] Mas at his monitor four floors up, Ep1 rooms/twoshots drawDark2S: his medium rig in the monitor\'s light, the Orb, his tally; the room a rung down), held; the key ring jangles once below frame on the downbeat; then black: act-out 1',
  marks: {jangle: ['snd', 'key_ring_jangle_1', 1, 0]},
  draw: (fb, k, sh, f) => {
    const j = mk(sh, 'jangle', 63);
    if (k >= j + 33) { fill(fb, 0, 0, 480, RH, PAL.N0); return; }
    masDark(fb, f);
  },
});
export const SCENE = defineScene({scene: '7', layouts: L.all});
