// MR. MAS — shared kit: THE JOIN CORNER (UI-JOIN-CORNER; Ep1 Act Four v5 art pass, round 3; new file, owned by the v5 art
// pass). S1.02 [ECU] hand, glass, laptop: "his pointer resting beside JOIN" before the glow turns to blueprint. v4's
// nudge ECU (kits/inserts-mas.ts drawNudgeInsert, 'suite') shows only the glass and his hand; v5 puts the laptop's
// corner in the same frame, far edge of the desk, so the call is already waiting when THE PLAN opens.
//   drawJoinCorner(b, o)        the laptop lid's top-left corner coming in from frame right over the suite's window:
//                               the bezel, the call app's title bar `BOARD · VIDEO CALL`, the five-tile preview's corner,
//                               JOIN, and the laptop's own arrow RESTING BESIDE it (o.pointer 'beside', the default) or on
//                               it ('on', S1.06's state, for a match), or none. o.glow 0-2: JOIN's halo in 2 held steps
//                               (the beat before the blueprint print takes the frame; never a tween)
//   drawNudgeJoin(b, step, o)   drawNudgeInsert(b, 'suite', step) with the corner composited UNDER his hand and sleeve
//                               (drawNudgeInsert paints plate, glass, sleeve and hand in one call, and inserts-mas.ts is
//                               not edited: the corner goes only where the frame still shows the bare plate)
//   JOIN_CORNER                 the geometry (lid, screen, JOIN) for a host that lights or crops it
// The lettering is the call app's own chrome, generic (no real app's layout). Sharp, not soft: it must read at 480 x 270.
import {Buf, rect, bayer} from '../px';
import {PAL} from '../palette';
import {text, textWidth} from '../font';
import {drawNudgeInsert, NudgeStep, INS_W, INS_H} from './inserts-mas';

export const JOIN_CORNER = {
  /** the lid's top-left corner (it runs off frame right and down behind the desk's far edge, y 128) */
  lid: {x0: 300, y0: 14, x1: 486, y1: 128},
  screen: {x0: 309, y0: 22, x1: 486, y1: 124},
  join: {x: 346, y: 96, w: 44, h: 14},
};
const ARROW = ['#.......', '##......', '#o#.....', '#oo#....', '#ooo#...', '#oooo#..', '#ooooo#.', '#ooo####', '#o#o#...', '##.#o#..', '#..#o#..', '....##..'];

export const drawJoinCorner = (b: Buf, o: {pointer?: 'beside' | 'on' | 'none'; glow?: 0 | 1 | 2; click?: boolean} = {}) => {
  const {lid: L, screen: S, join: J} = JOIN_CORNER;
  // the lid: dark aluminium, its top edge catching the window (one lit row), a 1 px shadow line under the bezel
  rect(L.x0, L.y0, L.x1 - L.x0, L.y1 - L.y0, b.ink(PAL.G1));
  rect(L.x0, L.y0, L.x1 - L.x0, 1, b.ink(PAL.G4));
  rect(L.x0, L.y0, 1, L.y1 - L.y0, b.ink(PAL.G3));
  rect(L.x0 + 1, L.y0 + 1, 1, L.y1 - L.y0 - 1, b.ink(PAL.G2));
  b.set(L.x0, L.y0, PAL.G2);
  // the webcam dot, top centre of what we see of the bezel
  b.set(S.x0 + 60, L.y0 + 4, PAL.N0);
  // the screen, the call app: a title bar, the tile preview's corner, JOIN
  rect(S.x0 - 1, S.y0 - 1, S.x1 - S.x0 + 1, S.y1 - S.y0 + 2, b.ink(PAL.N0));
  rect(S.x0, S.y0, S.x1 - S.x0, S.y1 - S.y0, b.ink(PAL.N1));
  rect(S.x0, S.y0, S.x1 - S.x0, 12, b.ink(PAL.N3));
  rect(S.x0, S.y0 + 12, S.x1 - S.x0, 1, b.ink(PAL.N2));
  text(b, 'BOARD · VIDEO CALL', S.x0 + 6, S.y0 + 3, PAL.G5);
  // the preview: two rows of tiles (their corner), the fifth slot dark: the call is waiting for him
  const tiles: Array<[number, number, boolean]> = [[S.x0 + 10, S.y0 + 18, false], [S.x0 + 54, S.y0 + 18, false], [S.x0 + 98, S.y0 + 18, false], [S.x0 + 32, S.y0 + 44, false], [S.x0 + 76, S.y0 + 44, true]];
  rect(S.x0 + 6, S.y0 + 15, 178, 54, b.ink(PAL.N2));
  for (const [tx, ty, empty] of tiles) {
    rect(tx, ty, 40, 23, b.ink(empty ? PAL.N0 : PAL.N3));
    if (empty) { for (let i = 0; i < 40; i += 4) { rect(tx + i, ty, 2, 1, b.ink(PAL.N5)); rect(tx + i, ty + 22, 2, 1, b.ink(PAL.N5)); } continue; }
    rect(tx + 16, ty + 5, 8, 8, b.ink(PAL.N5)); rect(tx + 17, ty + 4, 6, 1, b.ink(PAL.N5));
    rect(tx + 11, ty + 15, 18, 8, b.ink(PAL.N5)); rect(tx + 13, ty + 14, 14, 1, b.ink(PAL.N5));
  }
  // JOIN: its halo (2 held steps), the button, the pressed drawing on click
  if (o.glow) {
    const d = o.glow === 1 ? 2 : 4;
    for (let y = J.y - d; y < J.y + J.h + d; y++) for (let x = J.x - d; x < J.x + J.w + d; x++) {
      const inside = x >= J.x && x < J.x + J.w && y >= J.y && y < J.y + J.h;
      if (!inside && bayer(x, y) < (o.glow === 1 ? 0.35 : 0.55)) b.set(x, y, o.glow === 1 ? PAL.C3 : PAL.C4);
    }
  }
  const dn = o.click ? 1 : 0;
  rect(J.x, J.y + dn, J.w, J.h, b.ink(o.click ? PAL.C3 : PAL.C5));
  rect(J.x, J.y + dn, J.w, 1, b.ink(o.click ? PAL.C2 : PAL.C7));
  text(b, 'JOIN', J.x + ((J.w - textWidth('JOIN')) >> 1), J.y + 4 + dn, o.click ? PAL.C8 : PAL.N0);
  // the window's glare across the glass: a pale diagonal band (fixed to the screen)
  for (let y = S.y0; y < S.y1; y++) for (let x = S.x0; x < S.x1; x++) { const u = x - S.x0 + (y - S.y0) * 0.7; if (u > 120 && u < 128 && bayer(x, y) < 0.25) b.set(x, y, PAL.N4); }
  // the laptop's own arrow (never a player's cursor): resting just right of JOIN, or on it
  const p = o.pointer ?? 'beside';
  if (p !== 'none') {
    const ax = p === 'on' ? J.x + 30 : J.x + J.w + 7, ay = p === 'on' ? J.y + 6 : J.y + 3;
    ARROW.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === '#') b.set(ax + i, ay + j, PAL.N0); else if (ch === 'o') b.set(ax + i, ay + j, PAL.P2); }));
  }
  // the lid's foot: it sits behind the desk's far edge (the desk line is the plate's; keep it)
  rect(L.x0, L.y1 - 2, L.x1 - L.x0, 2, b.ink(PAL.G2));
};

/** S1.02 as one call: the nudge ECU with the join corner under his hand and sleeve (see the header) */
export const drawNudgeJoin = (b: Buf, step: NudgeStep, o: Parameters<typeof drawJoinCorner>[1] = {}) => {
  const bare = new Buf(INS_W, INS_H, PAL.N0);
  drawNudgeInsert(bare, 'suite', 'gone'); // the plate and the glass, no hand
  drawNudgeInsert(b, 'suite', step);
  const lay = new Buf(INS_W, INS_H, PAL.N0);
  lay.c.set(bare.c);
  drawJoinCorner(lay, o);
  // wherever the full frame still shows the bare plate, the corner shows; the hand, the sleeve and the glass win
  for (let y = 0; y < INS_H; y++) for (let x = 0; x < INS_W; x++) {
    const i = y * INS_W + x;
    if (b.c[i] === bare.c[i] && lay.c[i] !== bare.c[i]) b.c[i] = lay.c[i];
  }
};
