// MR. MAS — Ep2 v1 · act1 · scene 4B: THE BOOKING (the same day; his phone on the boardroom table). 1 shot, 216 f on
// the v1 EL lock. The shots pass, 2026-10-09; the record is shots-act1.md. The staging is proposal.md sc 4B:
//   ARRIVE   1.0 s on the phone's glow (continuous from 4A.06): the calendar card with the look of Ep1's Board sync
//            invite, XEL · LONG-FORM · MAR 18 · 2 HRS and a mic icon
//   TURN     he reads it (V.O. 3 typed in his cyan; no face in frame); a beat after the thought, his finger on Accept
//   AFTER    the card settles into his calendar (1.9 s after the click), its mic icon landing where 6.01's mic stands
//            (the matched object); the podcast sting pre-laps under it
// In Ep1 he accepted an invite without looking; this time he looks.
// The cleanup pass (2026-10-11): V.O. 3 is typed in the margin left of the phone (the host's own face, colour, shadow,
// rate and hold; wrapped to the margin, its last row on the host's baseline), so it never runs across the card's edge.
import {defineScene, layouts, mk} from '../../kit';
import {invite} from '../sets/board';
import {PAL} from '../../../../../shared/pixel/palette';
import {clamp} from '../../../../../shared/pixel/px';
import type {Buf} from '../../../../../shared/pixel/px';
import type {PxShot} from '../../types';
import {pt, pw, pwrap} from '../../../../ep01/act4/animatic/lay';

/** the phone's card left edge (sets/board.ts invite: P.x - 4) and the margin the V.O. keeps from it */
const CARD_X = 136, VO_X = 12, VO_W = CARD_X - VO_X - 6;
/** the line in rows no wider than w, broken after its own punctuation where it can be (so a row is a phrase), else
 *  where pwrap breaks it */
const phraseWrap = (text: string, w: number) => {
  const rows: string[] = [];
  let cur = '';
  for (const t of text.split(/(?<=[,.;:])\s+/)) {
    const cand = cur ? `${cur} ${t}` : t;
    if (pw(cand) <= w) { cur = cand; continue; }
    if (cur) rows.push(cur);
    if (pw(t) <= w) { cur = t; continue; }
    const sub = pwrap(t, w);
    rows.push(...sub.slice(0, -1));
    cur = sub[sub.length - 1];
  }
  if (cur) rows.push(cur);
  return rows;
};
/** frame.ts voLine, in the margin: typed at 0.5 glyphs a frame (faster for a long line, so it finishes 4 frames before
 *  the voice), held 15 frames after its last sound, lowercase (the act's voLowercase), C6 with an N0 shadow; the rows
 *  wrapped to VO_W at its phrases, the last on the host's baseline (191) and the earlier ones above it, 11 px apart,
 *  typed in order */
const voMargin = (b: Buf, sh: PxShot, k: number) => {
  for (const l of sh.lines) {
    if (l.kind !== 'vo' || k < l.s || k >= l.e + 15) continue;
    const text = l.text.toLowerCase();
    const rate = Math.max(0.5, text.length / Math.max(1, l.e - l.s - 4));
    let left = clamp(Math.floor((k - l.s) * rate), 0, text.length);
    const rows = phraseWrap(text, VO_W);
    rows.forEach((r, i) => { pt(b, r.slice(0, Math.max(0, left)), VO_X, 191 - (rows.length - 1 - i) * 11, PAL.C6, {shadow: PAL.N0}); left -= r.length + 1; });
  }
};

const L = layouts();
L.add('4B.01', {
  st: 'act1/sets/board invite ([ECU] the phone on the table, the calendar app, the card in Ep1\'s invite look: the mic icon, XEL · LONG-FORM, MAR 18 · 2 HRS, Accept / Decline; his index finger (no cursor) on Accept on the click, then Accepted held on the lit button 8 frames; the card (its mic, Accepted, then XEL on it) settles in three held steps into the MAR 18 cell, its mic icon where the next shot\'s mic stands)',
  marks: {click: ['snd', 'post_click', 1, 0]},
  draw: (fb, k, sh, f) => {
    const c = mk(sh, 'click', 170);
    // the finger on Accept (k c-4 .. c+1), then `Accepted` held on the lit button 8 frames before the card collapses
    const accept = (k < c - 4 ? 0 : k < c + 2 ? 1 : 2) as 0 | 1 | 2;
    const j = k - (c + 10);
    invite(fb, {f, accept, settle: j < 0 ? 0 : j < 6 ? 0.34 : j < 12 ? 0.67 : 1});
    voMargin(fb, sh, k);
    return {noVo: true};
  },
});
export const SCENE = defineScene({scene: '4B', layouts: L.all});
