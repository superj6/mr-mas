// MR. MAS — Ep1 Act Four v5 · J1 "CANCELLED", ported: the PIXEL side (pure, Node or browser). Everything J1 changes in
// the 480 x 270 show frame, as functions of t (frames since the Cancel click; timing.ts), so a host (the v5 composer,
// frame5.ts, or a Node renderer) can drop J1 in at the click without J1 knowing anything about the lock:
//   j1PixelFrame(t, host, o)  the frame to SHOW at t, from the host's own frame at that act frame (`host`, never
//                             mutated): t 0 and t >= 60 the host frame as is; t 1-2 the flash-print (the room area one flat
//                             P1; the rail band kept); t 3-44 the host frame too (the React layer covers the room area
//                             with the certificate and keeps only the host's rail band); t 45-59 the snap (below)
//   j1Snap(fb, t, o)          the snap into rows 0-202: the call chrome, his tile greyed with the ONE scar row falling
//                             through its own slot in four held drawings, the four closing ranks G5 -> G4, the Wi-Fi egg
//   j1ScarTile(o)             his tile as it was at the click, greyed (CALL_GREY), the scar row punched across the hoodie
// Ported from src/dev/jumps/proto1/pixel.ts (its frozen lock-v2 composer is NOT carried over: the host supplies its
// frames now). Kept: the flash-print, the scar, the fall, the close, their held drawings. Dropped: the prototype's
// fix for lock v2's stray "'I" ALYI fragment (the host's own S1.09 layout owns its dialog; check it there).
// Geometry: his side's call is sc 26's (animatic/shots.ts G5 / G4 / board4 / masTileState), the layout v4's S1.09 (R
// in art-needs-v5) draws; a v5 host that moves the grid passes its own rects (o.g5, o.g4).
import {Buf, rect} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {blitImg, Img} from '../../../../../shared/pixel/figure';
import {mapImg} from '../../../../../shared/pixel/sprite';
import {callChrome, captureTile, slideTiles, CALL_GREY, TileRect} from '../../../../../shared/pixel/kits/callgrid';
import {G5, G4, board4, masTileState, wifi} from '../../animatic/shots';
import {RH, putUI} from '../../animatic/lay';
import {J1_T, J1_FALL, J1_CLOSE, j1PhaseOf} from './timing';

export {RH};
export interface J1PixelOpts {
  /** the act frame of the click (the frame his tile is captured at, the loops of the four tiles run from it) */
  fClick: number;
  /** his tile's neon on the 1.G guardrail clock (STYLE-1G-NEON), as the v5 S1.09 draws it */
  neonGuard?: boolean;
  /** the grid geometry (default: sc 26's, G5 / G4 of animatic/shots.ts) */
  g5?: TileRect[];
  g4?: TileRect[];
}

/** the scar row, in the tile's own coords: 2 x 2 punched holes on a 4 px pitch straight across the hoodie */
export const J1_SCAR = {y: 71, x0: 68, x1: 95, pitch: 4};
const scarCache = new Map<string, Img>();
export const j1ScarTile = (o: J1PixelOpts): Img => {
  const g5 = o.g5 ?? G5;
  const key = `${o.fClick}|${o.neonGuard ? 1 : 0}|${g5[0].x},${g5[0].y},${g5[0].w},${g5[0].h}`;
  const hit = scarCache.get(key);
  if (hit) return hit;
  const img = captureTile({...masTileState(), ...g5[0], open: undefined, neonGuard: o.neonGuard}, o.fClick);
  const g = mapImg(img, (c, i, j) => CALL_GREY.map(c, i + g5[0].x, j + g5[0].y));
  for (let x = J1_SCAR.x0; x + 1 <= J1_SCAR.x1; x += J1_SCAR.pitch)
    for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) g.c[(J1_SCAR.y + j) * g.w + x + i] = PAL.N0;
  // the shoulder's rim light under the name chip greys into a lone pale bar: it takes the hoodie's own grey
  for (let y = g.h - 3; y < g.h - 1; y++) for (let x = 18; x <= 40; x++) if (g.c[y * g.w + x] >= 0) g.c[y * g.w + x] = PAL.G1;
  scarCache.set(key, g);
  return g;
};
const fallAt = (t: number) => { let dy = 0; for (const [q, d] of J1_FALL) if (t >= q) dy = d; return dy; };

/** the snap (t 45-59) into fb's room area */
export const j1Snap = (fb: Buf, t: number, o: J1PixelOpts) => {
  const g5 = o.g5 ?? G5, g4 = o.g4 ?? G4;
  const f = o.fClick + t;
  const b = new Buf(480, RH, PAL.N1);
  callChrome(b, {title: 'board sync', clock: null, controls: false});
  const s0 = g5[0], dy = fallAt(t);
  if (dy < s0.h + 2) {
    const inSlot = (x: number, y: number) => x >= s0.x - 1 && x <= s0.x + s0.w && y >= s0.y - 1 && y <= s0.y + s0.h;
    blitImg(b, j1ScarTile(o), s0.x - 1, s0.y - 1 + dy, {clip: inSlot});
  }
  board4(b, f, slideTiles(g5.slice(1), g4, t, J1_CLOSE.t0, J1_CLOSE.frames));
  wifi(b);
  putUI(fb, b, false);
};

/** the frame to show at t (see the header); `host` is the host's own 480 x 270 frame at this act frame */
export const j1PixelFrame = (t: number, host: Buf, o: J1PixelOpts): Buf => {
  const ph = j1PhaseOf(t);
  if (ph === 'before' || ph === 'click' || ph === 'done' || ph === 'cert') return host;
  const fb = new Buf(host.w, host.h, PAL.N0);
  fb.c.set(host.c);
  if (ph === 'pop') rect(0, 0, 480, RH, fb.ink(PAL.P1));
  else j1Snap(fb, t, o);
  return fb;
};
void J1_T;
