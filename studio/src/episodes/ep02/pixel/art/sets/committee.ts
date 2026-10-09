// MR. MAS — Ep2 v1 art: sc 18, THE SPLIT (SET-18) between SET-17, MISANTHROPIC'S LIGHTHOUSE (Ep1's, its header names Ep2
// on) and SET-02, THE NOPEAI BOARDROOM on May 28 (the committee). New here: Ekiel on the stair with his box, Adelina at
// the top with a raised lanyard (printed on page 212 of a Mario draft), Mario's desk with the scroll and his FOUR
// ANNOTATED PAGES (one line highlighted in yellow, legible in an ECU insert), the glass case of CLOD boxes (the last
// box's art the Golden Gate Bridge: never named), the beacon's sweep crossing into the boardroom's window; the
// SAFETY AND SECURITY COMMITTEE banner; the boardroom TV at full frame as a plain podcast player (no show name, no
// logo) with Neleh's words captioned large, and the board's one-sentence statement card.
//   lighthouse18(b, f, st)     [W] the lighthouse: st {ekiel: step index on the stair | null, adelina: 'raise' | 'drop' |
//                              null, mario: true, clodGlint: 0..6 (the box the beam is on)}
//   boardroom18(b, f, st)      [W] the boardroom by day: the banner, the TV on (st.tv), the beam across the window
//                              (st.beam 0..1)
//   podcastTV(b, f, st)        [SCR] full frame: the plain podcast player, her captions (st.line 0 | 1, st.k chars), the
//                              statement card (st.card)
//   pagesECU(b, f)             [ECU] 18.12: the four pages, one line highlighted yellow, readable at 1080p
//   lanyard(b, x, y, o)        the SAFETY COMMITTEE lanyard (room scale), o.page212 = printed on a Mario draft page
//   split18(b, f, st)          SET-18: two 238 x 203 panes, a 4 px divider; the stepped-down pane (one palette rung)
//   clodCase(b, x, y, glint)   the glass case of CLOD boxes (Ep1's CLOD box art, the last one the bridge)
import {Buf, rect, line, ellipse, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {drawLighthouse, STAIR_STEPS, LIGHTHOUSE} from '../../../../../shared/pixel/rooms/lighthouse';
import {drawBoardroom, BR} from '../../../../../shared/pixel/rooms/boardroom';
import {drawAdelinaRoom, ADELINA_ROOM_DEFAULT} from '../../../../../shared/pixel/cast/adelina';
import {marioImg, MARIO_BASE, MARIO_FOOT} from '../../../../../shared/pixel/cast/mario';
import {blitImg} from '../../../../../shared/pixel/figure';
import {fill, pt, pw, pwrap, bpt, bpw, tiny, tinyWidth, vramp, RH, TR, dith} from '../kit';
import {drawEkielRoom} from '../cast/ekiel';
import type {ArtAsset} from '../asset';

// ------------------------------------------------------------------ props
export const lanyard = (b: Buf, x: number, y: number, o: {page212?: boolean} = {}) => {
  line(x, y, x + 6, y + 14, b.ink(PAL.R2)); line(x + 12, y, x + 6, y + 14, b.ink(PAL.R2));
  if (o.page212) { fill(b, x + 1, y + 14, 12, 15, PAL.P2); for (let r = 0; r < 4; r++) fill(b, x + 3, y + 17 + r * 3, 8, 1, PAL.G5); tiny(b, '212', x + 2, y + 24, PAL.N2); }
  else { fill(b, x + 2, y + 14, 10, 7, PAL.P2); fill(b, x + 2, y + 14, 10, 2, PAL.R2); }
};
/** the glass case of CLOD boxes: six boxes on two shelves behind glass; the last box's art a red suspension bridge; the
 *  box the beacon is passing glints */
export const clodCase = (b: Buf, x: number, y: number, glint = -1) => {
  fill(b, x - 2, y - 2, 70, 52, PAL.D1); fill(b, x, y, 66, 48, PAL.N1);
  for (let k = 0; k < 6; k++) {
    const bx = x + 4 + (k % 3) * 21, by = y + 4 + Math.floor(k / 3) * 22;
    fill(b, bx, by, 17, 18, PAL.W5); fill(b, bx, by, 17, 2, PAL.W7); fill(b, bx + 2, by + 4, 13, 10, PAL.W3);
    if (k === 5) { fill(b, bx + 2, by + 4, 13, 10, PAL.C5); fill(b, bx + 4, by + 5, 1, 8, PAL.R2); fill(b, bx + 11, by + 5, 1, 8, PAL.R2); for (let i = 0; i < 9; i++) b.set(bx + 4 + i, by + 6 + Math.round(Math.abs(i - 4) * 0.5), PAL.R2); fill(b, bx + 2, by + 11, 13, 1, PAL.R1); }
    else { ellipse(bx + 8, by + 9, 3, 3, b.ink(PAL.W6)); b.set(bx + 7, by + 8, PAL.N1); b.set(bx + 9, by + 8, PAL.N1); }
    if (k === glint) { fill(b, bx + 13, by + 1, 2, 2, PAL.W9); b.set(bx + 12, by + 3, PAL.W8); }
  }
  for (let j = 0; j < 48; j += 7) b.set(x + 60 - (j >> 2), y + j, PAL.G5);
};
/** Mario's four pages fanned on the desk (room scale), the scroll beside them */
const pagesOnDesk = (b: Buf, x: number, y: number) => {
  for (let k = 0; k < 4; k++) { fill(b, x + k * 9, y - k, 14, 10, PAL.P2); fill(b, x + k * 9, y - k, 14, 1, PAL.W9); for (let r = 0; r < 3; r++) fill(b, x + k * 9 + 2, y - k + 3 + r * 2, 10, 1, r === 1 && k === 2 ? PAL.W7 : PAL.G5); }
};
/** the op-ed clipping on the desk (an egg): byline NELEH & THE QUIET VOTE */
const opedClip = (b: Buf, x: number, y: number) => { fill(b, x, y, 26, 14, PAL.P1); fill(b, x, y, 26, 1, PAL.P2); tiny(b, 'NELEH &', x + 1, y + 2, PAL.N2); for (let r = 0; r < 2; r++) fill(b, x + 2, y + 9 + r * 2, 20, 1, PAL.G4); };

// ------------------------------------------------------------------ the lighthouse (sc 18)
export interface Light18St { ekiel?: number | null; adelina?: 'raise' | 'drop' | null; mario?: boolean; clodGlint?: number }
export const lighthouse18 = (b: Buf, f: number, st: Light18St = {}) => {
  drawLighthouse(b, f, {meters: 0});
  clodCase(b, 30, 110, st.clodGlint ?? Math.floor(f / 20) % 6);
  // Mario's desk: the scroll, the four pages, the clipping
  pagesOnDesk(b, 196, 146); opedClip(b, 280, 140);
  if (st.mario !== false) blitImg(b, marioImg({...MARIO_BASE, arm: 'scroll', scroll: true}), 250 - MARIO_FOOT[0], 197 - MARIO_FOOT[1]);
  // Ekiel climbing the stair of bound drafts with his box
  if (st.ekiel !== null && st.ekiel !== undefined) { const s = STAIR_STEPS[clamp(st.ekiel, 0, STAIR_STEPS.length - 1)]; drawEkielRoom(b, s[0], s[1], {state: 'climb', legs: st.ekiel % 2 ? 'w1' : 'w3'}); }
  // Adelina at the top (the gallery), her lanyard raised
  if (st.adelina) { const s = STAIR_STEPS.reduce((p, q) => (Math.abs(q[1] - 100) < Math.abs(p[1] - 100) ? q : p));   // the highest step that keeps her whole in frame
     drawAdelinaRoom(b, s[0] - 4, s[1] + 2, {...ADELINA_ROOM_DEFAULT, arm: st.adelina === 'raise' ? 'reach' : 'down'}, {flip: true}); if (st.adelina === 'raise') lanyard(b, s[0] - 30, s[1] - 52, {page212: true}); }
};

// ------------------------------------------------------------------ the boardroom, May 28
export const boardroom18 = (b: Buf, f: number, st: {tv?: boolean; beam?: number} = {}, cast: Parameters<typeof drawBoardroom>[2] = {}) => {
  drawBoardroom(b, {f, plates: {}, rolodex: false}, cast);
  // the banner across the back wall over the window
  const s = 'SAFETY AND SECURITY COMMITTEE';
  const bx = 136;   // inside the split's left pane (x 120..358) as well as the full frame
  fill(b, bx, 18, pw(s) + 16, 14, PAL.F2); fill(b, bx, 18, pw(s) + 16, 1, PAL.F4); pt(b, s, bx + 8, 21, PAL.P2);
  for (const tx of [bx + 2, bx + pw(s) + 12]) fill(b, tx, 14, 2, 4, PAL.G4);
  // the TV on the wall at the right, on before the meeting (its picture: a plain podcast player)
  if (st.tv !== false) { const tx = 278; fill(b, tx, 36, 74, 46, PAL.N0); fill(b, tx + 3, 39, 68, 40, PAL.N2); fill(b, tx + 3, 39, 68, 6, PAL.N3); for (let k = 0; k < 14; k++) fill(b, tx + 8 + k * 4, 58 - ((k * 5) % 9), 2, 2 + ((k * 5) % 9), PAL.C5); fill(b, tx + 6, 72, 62, 4, PAL.P1); }
  // the beacon's beam crossing the window, the same morning
  const bm = st.beam ?? -1;
  if (bm >= 0) { const x0 = BR.WINDOW.x0 + Math.round(bm * (BR.WINDOW.x1 - BR.WINDOW.x0)); for (let y = BR.WINDOW.y0; y < BR.WINDOW.y1; y++) for (let x = x0 - 10; x < x0 + 10; x++) if (bayer(x, y) < 0.5 - Math.abs(x - x0) / 20) b.set(x, y, stepColor(b.get(x, y), 2)); }
};

// ------------------------------------------------------------------ the podcast player at full frame, the statement card
const NELEH = ['When CHATGTP came out November, 2022, the board was not informed in advance about that. We learned about CHATGTP on RETTIWT.', '...MAS didn\'t inform the board that he owned the NOPEAI Startup Fund...'];
export const podcastTV = (b: Buf, f: number, st: {line?: 0 | 1; k?: number; card?: boolean} = {}) => {
  // the TV's bezel at the frame's edge, a plain player: a blank square where art would be (no title, no logo), a
  // waveform, the scrubber; her words captioned large as she says them
  fill(b, 0, 0, 480, RH, PAL.N0); fill(b, 6, 6, 468, 191, PAL.N1);
  fill(b, 20, 18, 92, 92, PAL.N3); for (let k = 0; k < 6; k++) ellipse(66, 64, 10 + k * 6, 10 + k * 6, b.ink(k % 2 ? PAL.N4 : PAL.N3));
  for (let k = 0; k < 60; k++) { const h = 2 + Math.round(hash(k, Math.floor(f / 3), 2) * 14); fill(b, 130 + k * 5, 64 - (h >> 1), 3, h, PAL.C5); }
  fill(b, 130, 96, 320, 2, PAL.N4); fill(b, 130, 96, 140, 2, PAL.C6);
  const text = NELEH[st.line ?? 0].slice(0, st.k ?? 999);
  pwrap(text, 430).forEach((l, i) => pt(b, l, 24, 120 + i * 12, PAL.P2));
  if (st.card) {
    // the board's same-day reply, its first sentence, in its own card beneath
    fill(b, 24, 158, 432, 34, PAL.P1); fill(b, 24, 158, 432, 2, PAL.P2);
    pt(b, '"We are disappointed that Ms. NELEH continues to revisit these issues."', 30, 164, PAL.N1);
    pt(b, '— TERB, CHAIR', 330, 178, PAL.N3);
  }
};
export const pagesECU = (b: Buf, f: number) => {
  vramp(b, 0, 0, 480, RH, [PAL.D2, PAL.D3, PAL.D2]);
  for (let k = 0; k < 4; k++) { const x = 30 + k * 18, y = 20 + k * 6; fill(b, x + 4, y + 4, 300, 168, PAL.D1); fill(b, x, y, 300, 168, PAL.P2); fill(b, x, y, 300, 1, PAL.W9); }
  const x = 84, y = 38;
  for (let r = 0; r < 12; r++) { if (r === 5) continue; fill(b, x + 8, y + 10 + r * 11, 240 - (r * 17) % 60, 2, PAL.G4); }
  // the line, highlighted in yellow, Ekiel's own, readable
  const s = 'Building smarter-than-human machines is an inherently dangerous endeavor.';
  const lines = pwrap(s, 270);
  lines.forEach((l, i) => { fill(b, x + 4, y + 62 + i * 11, pw(l) + 8, 11, PAL.W7); pt(b, l, x + 8, y + 64 + i * 11, PAL.N1); });
  // Mario's margin notes in ink blue, his underline under `inherently`
  for (let r = 0; r < 5; r++) fill(b, x + 268, y + 20 + r * 9, 14 + (r * 7) % 12, 2, PAL.I0);
  const iu = lines[0].indexOf('inherently'); if (iu >= 0) fill(b, x + 8 + pw(lines[0].slice(0, iu)), y + 73, pw('inherently'), 1, PAL.I0);
};
// ------------------------------------------------------------------ the split
export const SPLIT = {paneW: 238, divider: 4, rx0: 242};
/** compose two full frames into the split: the left pane shows `left` from sxL, the right `right` from sxR; `down`
 *  steps one pane a palette rung (the pane that waits) */
export const split18 = (b: Buf, left: Buf, right: Buf, o: {sxL?: number; sxR?: number; down?: 'left' | 'right' | null} = {}) => {
  const sxL = o.sxL ?? 120, sxR = o.sxR ?? 120;
  for (let y = 0; y < RH; y++) {
    for (let x = 0; x < SPLIT.paneW; x++) { const c = left.c[y * 480 + sxL + x]; b.set(x, y, o.down === 'left' ? stepColor(c, -1) : c); }
    for (let x = 0; x < SPLIT.divider; x++) b.set(SPLIT.paneW + x, y, PAL.N0);
    for (let x = 0; x < SPLIT.paneW; x++) { const c = right.c[y * 480 + sxR + x]; b.set(SPLIT.rx0 + x, y, o.down === 'right' ? stepColor(c, -1) : c); }
  }
};

export const ART: ArtAsset[] = [
  {
    id: 'set17-lighthouse', manifest: 'SET-17 · Misanthropic\'s lighthouse (sc 18 additions)', kind: 'set', name: 'The lighthouse in sc 18: Ekiel on the stair, Adelina\'s lanyard, Mario\'s pages, the CLOD case',
    file: 'sets/committee.ts', exports: 'lighthouse18, clodCase, lanyard, pagesECU', scenes: '18',
    note: 'Ekiel climbs the stair of bound drafts with his box; Adelina raises a lanyard printed on page 212; the CLOD boxes glint as the beam passes (the last one\'s art the bridge, never named)',
    stills: [
      {label: '[W] 18.01: the lighthouse, Ekiel on the stair with his box, Adelina at the top raising the lanyard, Mario writing, the CLOD case', draw: (b) => lighthouse18(b, 0, {ekiel: 8, adelina: 'raise', clodGlint: 5})},
      {label: '[ECU] 18.12: the four pages, the one line highlighted in yellow, "inherently" underlined in Mario\'s ink', draw: (b) => pagesECU(b, 0)},
    ],
  },
  {
    id: 'set02b-committee', manifest: 'SET-02 · the boardroom, May 28 (the committee) · SET-18 the split', kind: 'set', name: 'The boardroom on May 28: the banner, the TV\'s podcast player and the statement card; the split',
    file: 'sets/committee.ts', exports: 'boardroom18, podcastTV, split18, SPLIT', scenes: '18, 20',
    note: 'a plain player with no show name or logo; her words captioned large; the board\'s card with its honorific; two 238 x 203 panes and a 4 px divider, the waiting pane a rung down',
    stills: [
      {label: '[SCR] 18.03 / 18.05: the plain podcast player at full frame, her captions, the board\'s statement card beneath', draw: (b) => podcastTV(b, 0, {line: 0, card: true})},
      {label: 'SPLIT 18.07: LEFT the boardroom (the banner, the TV), RIGHT the lighthouse (Adelina\'s lanyard), the right pane a rung down', draw: (b) => {
        const l = new Buf(480, 270, PAL.N0); boardroom18(l, 0, {tv: true, beam: 0.4}); const r = new Buf(480, 270, PAL.N0); lighthouse18(r, 0, {ekiel: null, adelina: 'raise'});
        split18(b, l, r, {sxL: 120, sxR: 120, down: 'right'});
      }},
    ],
  },
];
void rect; void bpt; void bpw; void tinyWidth; void TR; void dith; void LIGHTHOUSE;
