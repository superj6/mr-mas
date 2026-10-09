// MR. MAS — Ep2 v1 · act1 · scene 4B: THE BOOKING (the same day; his phone on the boardroom table). 1 shot, 216 f on
// the v1 EL lock. The shots pass, 2026-10-09; the record is shots-act1.md. The staging is proposal.md sc 4B:
//   ARRIVE   1.0 s on the phone's glow (continuous from 4A.06): the calendar card with the look of Ep1's Board sync
//            invite, XEL · LONG-FORM · MAR 18 · 2 HRS and a mic icon
//   TURN     he reads it (V.O. 3 typed in his cyan; no face in frame); a beat after the thought, his finger on Accept
//   AFTER    the card settles into his calendar (1.9 s after the click), its mic icon landing where 6.01's mic stands
//            (the matched object); the podcast sting pre-laps under it
// In Ep1 he accepted an invite without looking; this time he looks.
import {defineScene, layouts, mk} from '../../kit';
import {invite} from '../sets/board';

const L = layouts();
L.add('4B.01', {
  st: 'act1/sets/board invite ([ECU] the phone on the table, the calendar app, the card in Ep1\'s invite look: the mic icon, XEL · LONG-FORM, MAR 18 · 2 HRS, Accept / Decline; his index finger (no cursor) on Accept on the click; the card settles in three held steps into the MAR 18 cell, its mic icon where the next shot\'s mic stands)',
  marks: {click: ['snd', 'post_click', 1, 0]},
  draw: (fb, k, sh, f) => {
    const c = mk(sh, 'click', 170);
    const accept = (k < c - 4 ? 0 : k < c + 2 ? 1 : 2) as 0 | 1 | 2;
    const j = k - (c + 8);
    invite(fb, {f, accept, settle: j < 0 ? 0 : j < 6 ? 0.34 : j < 12 ? 0.67 : 1});
  },
});
export const SCENE = defineScene({scene: '4B', layouts: L.all});
