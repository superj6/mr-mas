// MR. MAS — shared kit: THE SEALED FOLDER (PROP-FOLDER; Ep1 Act Four v5 art pass; new file, owned by the v5 art pass).
// S4.10b: "Neleh slides a folder across the table. It's sealed, and it stays sealed on our side: he breaks the seal with
// the folder turned away from us and reads behind its cover. We never see a page." Guardrails X9: the reasoning is a
// sealed prop; the folder is UNLABELLED (no title, no tab text, no stamp). Medium scale (the S4.10b two-shot).
//   drawFolder(b, cx, cy, st, o)   (cx, cy) = the folder's centre
//     {kind: 'table', slide}       flat on the table, closed and sealed; `slide` 0..1 moves it along o.path in 4 held
//                                  steps (a push across the table, never a glide)
//     {kind: 'up', seal, open}     held up in front of him, its BACK to us: seal 'whole' | 'broken' (the red halves at the
//                                  top edge), open 0 closed · 1 the front cover swinging away (one held drawing) · 2 open
//                                  (reading: the opened cover sticks out past one edge, its inside dark; no page shows)
//   o.hands 'ttemme' draws his two hands gripping the sides (the rig's 'folder' arm hides his forearms behind it)
//   o.path  [[x0, y0], [x1, y1]] for 'table' (default: its own centre, i.e. no slide)
import {Buf, rect, poly, line} from '../px';
import {PAL} from '../palette';

export type FolderState =
  | {kind: 'table'; slide?: number; seal?: 'whole' | 'broken'}
  | {kind: 'up'; seal: 'whole' | 'broken'; open: 0 | 1 | 2};
export const FOLDER_UP_W = 22, FOLDER_UP_H = 28;
const seal = (b: Buf, x: number, y: number, state: 'whole' | 'broken') => {
  if (state === 'whole') { rect(x - 2, y - 1, 5, 3, b.ink(PAL.R2)); rect(x - 1, y - 2, 3, 5, b.ink(PAL.R2)); b.set(x - 1, y - 1, PAL.R3); b.set(x, y, PAL.R1); return; }
  // broken: two halves pulled a pixel apart, a dark crack between
  rect(x - 3, y - 1, 2, 3, b.ink(PAL.R2)); b.set(x - 2, y - 2, PAL.R2); b.set(x - 3, y - 1, PAL.R3);
  rect(x + 2, y - 1, 2, 3, b.ink(PAL.R1)); b.set(x + 2, y + 2, PAL.R1);
};
const hand = (b: Buf, x: number, y: number, flip: boolean) => {
  // a hand gripping the folder's edge: four fingertips on our side of the cover, the thumb behind
  const rows = ['.oo.', 'o45o', 'o44o', 'o45o', 'o44o', 'o33o', '.oo.'];
  const pal: Record<string, number> = {o: PAL.S0, '3': PAL.S3, '4': PAL.S4, '5': PAL.S5};
  rows.forEach((r, j) => { for (let i = 0; i < 4; i++) { const c = pal[r[flip ? 3 - i : i]]; if (c !== undefined) b.set(x + i, y + j, c); } });
};
export const drawFolder = (b: Buf, cx: number, cy: number, st: FolderState, o: {hands?: 'ttemme' | 'none'; path?: [[number, number], [number, number]]} = {}) => {
  if (st.kind === 'table') {
    const t = Math.floor(Math.max(0, Math.min(1, st.slide ?? 0)) * 4) / 4; // 4 held steps
    const [[x0, y0], [x1, y1]] = o.path ?? [[cx, cy], [cx, cy]];
    const x = Math.round(x0 + (x1 - x0) * t), y = Math.round(y0 + (y1 - y0) * t);
    // flat on the table in the plate's perspective: a parallelogram, the far edge narrower
    const q = [x - 12, y - 4, x + 12, y - 4, x + 15, y + 5, x - 15, y + 5];
    poly(q.map((v, i) => v + (i % 2 ? 2 : 1)), b.ink(PAL.N0)); // its shadow on the walnut
    poly(q, b.ink(PAL.P0));
    line(x - 12, y - 4, x + 12, y - 4, b.ink(PAL.P1));
    line(x - 15, y + 5, x + 15, y + 5, b.ink(PAL.D3)); // the front edge, the paper's thickness
    line(x - 14, y + 4, x + 14, y + 4, b.ink(PAL.G4));
    seal(b, x + 10, y, st.seal ?? 'whole');
    return;
  }
  const W = FOLDER_UP_W, H = FOLDER_UP_H, x = cx - Math.floor(W / 2), y = cy - Math.floor(H / 2);
  // the opened front cover swings out past the left edge (its inside, dark), one held in-between on open 1
  if (st.open >= 1) {
    const out = st.open === 1 ? 4 : 9;
    poly([x, y + 1, x - out, y - 2, x - out, y + H - 3, x, y + H], b.ink(PAL.G2));
    line(x - out, y - 2, x - out, y + H - 3, b.ink(PAL.G4));
  }
  // the back cover (our side): plain manila, a darker spine at the right edge, the paper's thickness along the top
  rect(x, y, W, H, b.ink(PAL.P0));
  rect(x, y, W, 1, b.ink(PAL.P1));
  rect(x + W - 2, y, 2, H, b.ink(PAL.G4));
  rect(x, y + H - 1, W, 1, b.ink(PAL.G3));
  // the folder's tab standing proud of the top edge (a folder, not a page), and one crease across the cover
  rect(x + 3, y - 2, 8, 2, b.ink(PAL.P0)); rect(x + 3, y - 2, 8, 1, b.ink(PAL.P1));
  rect(x + 1, y + H - 6, W - 3, 1, b.ink(PAL.G5));
  if (st.open === 0 || st.seal === 'whole') seal(b, x + Math.floor(W / 2), y + 1, st.seal);
  else seal(b, x + Math.floor(W / 2), y + 1, 'broken');
  if (o.hands === 'ttemme') { hand(b, x - 3, y + 10, false); hand(b, x + W - 1, y + 10, true); }
};
