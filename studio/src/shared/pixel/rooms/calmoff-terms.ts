// MR. MAS — shared layouts: THE CALM-OFF, READING THE TERMS (Ep1 Act Four v5 art pass; new file, owned by the v5 art pass).
// v5 holds the calm-off through the terms (S7.07 + its continuation, 24 s; S7.09 the long hold) and cuts away once to the
// new board's third seat (S7.07b). Three assets, on the boardroom's medium plate (rooms/boardroom-plate.ts):
//   drawCalmOffTerms2S  CAST-TERB-SHEET in drawCalmOff2S's setup: MAS left, MADA right across the table, TERB in depth
//                       between them at room scale (cast/terb-sheet.ts): reading the single sheet, looking up to Mada,
//                       spraying the chair fire between sentences (the sheet tucked under his arm). drawCalmOff2S draws
//                       everything but Terb; Terb goes in after, clipped above the table's far edge (he stands behind it)
//   drawTablePhone      PROP-PHONE-TABLE (S7.09): Mas's phone flat on the table between them, lighting green with
//                       Gerg's post on its screen (kits/post-card.ts, too small to read here: the post itself rides as
//                       its own notify card); keycaps popping off it only with o.caps (off by default since a4p5 r2)
//   drawOtherYrralM     CAST-OTHER-YRRAL (S7.07b [M], 1.6 s, mute): a seated silhouette at the far end of the table among
//                       the fires, behind a nameplate `YRRAL (NOT THAT YRRAL)`, one two-drawing nod
import {Buf, rect} from '../px';
import {PAL, stepColor} from '../palette';
import {FigureDef, LightRig, P, Part, renderFigure, blitImg, Img} from '../figure';
import {memo} from '../cast/kit';
import {BPLATE, BoardPlateOpts, drawBoardPlate, drawBoardPlateTable, drawBoardPlateFront, drawFireM} from './boardroom-plate';
import {drawCalmOff2S, CalmOffState, FIRES_CALMOFF} from './twoshots';
import {drawTerbSheetRoom, TerbSheetPose, TERB_SHEET_DEFAULT, TERB_SHEET_HORN} from '../cast/terb-sheet';
import {TERB_FOOT, drawSpray} from '../cast/terb';
import {gergKeycaps, drawKeycaps} from '../cast/gerg';
import {pt, pw} from '../kits/uitype';

// ------------------------------------------------------------------ the calm-off with Terb reading
export interface CalmOffTermsState extends Omit<CalmOffState, 'terb'> {
  terb?: {x?: number; pose?: Partial<TerbSheetPose>; spray?: number | null} | null;
  /** Mas's phone on the table (S7.09): frames since it lit (null = dark / not there) */
  phone?: number | null;
}
export const drawCalmOffTerms2S = (b: Buf, f: number, s: CalmOffTermsState = {}) => {
  const {terb, phone, ...rest} = s;
  drawCalmOff2S(b, f, {...rest, terb: null});
  if (phone !== undefined && phone !== null) drawTablePhone(b, 214, 158, phone, f);
  if (terb === null) return;
  const t = terb ?? {};
  const spraying = t.spray !== null && t.spray !== undefined;
  const pose: TerbSheetPose = {...TERB_SHEET_DEFAULT, arm: spraying ? 'sheetSpray' : 'sheet', read: !spraying, ...t.pose};
  const fx = t.x ?? 206, fy = BPLATE.tableY + 22;
  // behind the table: nothing of him below its far edge, nothing over Mas or Mada (they are nearer)
  const tmp = new Buf(b.w, b.h, 0x010203);
  drawTerbSheetRoom(tmp, fx, fy, pose);
  if (spraying && (pose.arm === 'sheetSpray' || pose.arm === 'spray')) drawSpray(tmp, fx - TERB_FOOT[0] + TERB_SHEET_HORN[0], fy - TERB_FOOT[1] + TERB_SHEET_HORN[1], 1, t.spray!, {len: 34, drop: -0.7});
  const ref = new Buf(b.w, b.h, 0);
  drawCalmOff2S(ref, f, {...rest, terb: null});
  const plateOnly = new Buf(b.w, b.h, 0);
  drawBoardPlate(plateOnly, f, {laptop: false, rolodex: 'still', fires: FIRES_CALMOFF(), ...(rest.plate ?? {})});
  for (let y = 0; y < BPLATE.tableY; y++) for (let x = 0; x < b.w; x++) {
    const c = tmp.c[y * b.w + x];
    if (c === 0x010203) continue;
    // only where the calm-off shows the plate (the back wall, the fire): the two men in front stay in front
    if (ref.c[y * b.w + x] !== plateOnly.c[y * b.w + x]) continue;
    b.c[y * b.w + x] = c;
  }
};

// ------------------------------------------------------------------ Mas's phone on the table
/** The phone lying flat on the walnut (a foreshortened slab), its screen green-lit with a post's shape, keycaps
 *  popping off it. k = frames since it lit. (x, y) = the phone's top-left. */
/** o.caps: Gerg's keycaps popping off it (a4p5 r2: default OFF; at this scale his keycaps, which fly on his own
 *  figure's paths, landed under the table as two stray white pixels on the stills check; the notify card carries the
 *  post) */
export const drawTablePhone = (b: Buf, x: number, y: number, k: number, f: number, o: {caps?: boolean} = {}) => {
  const w = 22, h = 9;
  rect(x + 1, y + 1, w, h, b.ink(PAL.N0)); // its shadow
  rect(x, y, w, h, b.ink(PAL.N1)); rect(x, y, w, 1, b.ink(PAL.G2));
  const lit = k >= 0;
  rect(x + 2, y + 1, w - 4, h - 3, b.ink(lit ? PAL.L1 : PAL.N0));
  if (lit) {
    // the post's shape on the screen: an avatar dot and two text lines (unreadable at this size; the card carries it)
    b.set(x + 3, y + 2, PAL.L3); rect(x + 5, y + 2, 10, 1, b.ink(PAL.L3)); rect(x + 5, y + 4, 12, 1, b.ink(PAL.L2));
    // its green light on the table round it (a palette step up)
    for (let j = -3; j < h + 3; j++) for (let i = -4; i < w + 4; i++) {
      if (j >= 0 && j < h && i >= 0 && i < w) continue;
      const X = x + i, Y = y + j;
      if ((i + j) % 2 === 0 && Math.hypot(i - w / 2, (j - h / 2) * 2) < w * 0.75) b.set(X, Y, stepColor(b.get(X, Y), 1));
    }
    if (o.caps) drawKeycaps(b, x + w / 2 - 12, y + 2, gergKeycaps(f, {from: f - k}));
  }
};

// ------------------------------------------------------------------ THE OTHER YRRAL
const yrralFig = (nod: 0 | 1): FigureDef => {
  const n = nod;
  const parts: Part[] = [
    {group: 'body', mat: 'suit', tone: 2, prims: [P.poly(4, 70, 6, 44, 12, 36, 22, 33, 34, 33, 44, 36, 50, 44, 52, 70)]},
    {group: 'head', mat: 'skin', tone: 2, prims: [P.ell(28, 20 + n, 9, 11)]},
    {group: 'collar', mat: 'shirt', tone: 2, prims: [P.poly(23, 33, 28, 38, 33, 33, 30, 31, 26, 31)]},
  ];
  return {w: 56, h: 70, parts, adjust: [{prims: [P.poly(20, 12 + n, 36, 12 + n, 34, 8 + n, 22, 8 + n)], tone: 3, onlyMat: 'skin'}]};
};
const yrralRig: LightRig = {
  key: [0.6, -0.8], keyBand: 1, shadowBand: 0, rim: true, outline: false,
  ramps: {
    suit: [PAL.N0, PAL.N0, PAL.N1, PAL.N1, PAL.N2, PAL.W4],
    skin: [PAL.N0, PAL.N1, PAL.N1, PAL.N2, PAL.N3, PAL.W5],
    shirt: [PAL.N1, PAL.N2, PAL.N3, PAL.N3, PAL.N4, PAL.W5],
  },
};
const yrral = memo((nod: 0 | 1): Img => renderFigure(yrralFig(nod), yrralRig));
export const YRRAL_PLATE = 'YRRAL (NOT THAT YRRAL)';
/** S7.07b: the boardroom plate among the fires; the silhouette at the table's far end, the nameplate in front of him. */
export const drawOtherYrralM = (b: Buf, f: number, o: {nod?: 0 | 1; plate?: BoardPlateOpts} = {}) => {
  const po: BoardPlateOpts = {laptop: false, rolodex: 'still', fires: [{at: 'chair', x: 96, phase: 1}, {at: 'table', x: 380, phase: 2}], ...o.plate};
  drawBoardPlate(b, f, po);
  const img = yrral(o.nod ?? 0);
  blitImg(b, img, 212, BPLATE.tableY - 62);
  drawBoardPlateTable(b, f, po);
  // the nameplate: a tent card on the table in front of him, lettered in the 7 px face (it must read in 1.6 s)
  const s = YRRAL_PLATE, w = pw(s) + 14, x = 240 - Math.round(w / 2), y = BPLATE.tableY + 10;
  rect(x + 2, y + 16, w, 3, b.ink(PAL.N0));
  rect(x, y, w, 16, b.ink(PAL.P1)); rect(x, y, w, 1, b.ink(PAL.P2)); rect(x, y + 15, w, 1, b.ink(PAL.P0));
  pt(b, s, x + 7, y + 5, PAL.N1);
  drawBoardPlateFront(b, f, po);
  void drawFireM;
};
