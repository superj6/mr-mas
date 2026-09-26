// MR. MAS — style jump prototype 2 · the PIXEL side: MAS'S DARK ROOM, the desk plate `[W]`, as approved for Ep1 act 4
// (rooms/darkroom-plate + cast/mas-medium + cast/orb-medium, composed like rooms/twoshots drawDark2S), plus the rail.
// Nothing here is redrawn for the jump: the jump only cuts a gap in this frame and lights around it.
// Pure pixel code, deterministic on (p).
import {Buf, rect, hash} from '../../../shared/pixel/px';
import {PAL, stepColor} from '../../../shared/pixel/palette';
import {text} from '../../../shared/pixel/font';
import {DPLATE, DPLATE_LOOK, DarkPlateOpts, drawDarkPlate, drawDarkPlateDesk, drawDarkPlateFront} from '../../../shared/pixel/rooms/darkroom-plate';
import * as MM from '../../../shared/pixel/cast/mas-medium';
import * as OM from '../../../shared/pixel/cast/orb-medium';
import {T} from './timing';

export const NW = 480, NH = 270, RH = 203;
export const RAIL = 'SEP 12, 2026';

/**
 * The monitor: his feed (grey post blocks, each with its red heart), the macro's posts having played before the clip.
 * It flickers on 2s: each held pair of frames the panel sits at full or one rung down (hash-seeded, never a pattern).
 * Final polish: each post's type lines have their own lengths, and on p74 the feed scrolls one post (he is reading:
 * his eyes step back to the top on the same frame, see masAt). The cold read found him frozen for all 5 s.
 */
export const SCROLL_AT = 74;
const feed = (scr: Buf, f: number) => {
  rect(0, 0, scr.w, scr.h, scr.ink(PAL.N1));
  const s = f >= SCROLL_AT ? 1 : 0;
  for (let k = 0; k < 6; k++) {
    const y = 3 + k * 10, n = k + s;
    rect(4, y, 60, 8, scr.ink(PAL.N3));
    rect(6, y + 2, 4, 4, scr.ink(PAL.G4));
    const l1 = 18 + Math.floor(hash(n, 1, 707) * 17), l2 = 8 + Math.floor(hash(n, 2, 707) * 16);
    for (let i = 0; i < l1; i++) if (i % 7 !== 6) scr.set(13 + i, y + 3, PAL.P0);
    for (let i = 0; i < l2; i++) scr.set(13 + i, y + 5, PAL.G4);
    scr.set(58, y + 3, PAL.R3); scr.set(59, y + 3, PAL.R3); scr.set(58, y + 4, PAL.R2);
  }
  if (hash(Math.floor(f / 2), 3, 909) < 0.35) for (let i = 0; i < scr.c.length; i++) scr.c[i] = stepColor(scr.c[i], -1);
};

/** the plate as Ep9 #23 has it: the tally, his glass, the phone face down, the feed on the monitor. The clock reads
 *  3:12 (final polish: the plate's 2-px-wide '4' read as "3:11" or "3:Y1" cold; 1, 2 and 3 read at that size) */
export const PLATE: DarkPlateOpts = {tally: 3, glass: true, phone: 'down', clock: '3:12', screen: feed};

/**
 * Mas holds on the monitor through the whole jump: head '34', eyes camera-left to the screen. (Polish pass: the old
 * p60 swap to the rig's near-front head read as a look into the lens, a POV break. The rig has no up / over-the-
 * shoulder head yet, so he does not react; the Orb's step is the only witness.) Final polish: he never freezes (his
 * design anchor). He is READING: three eye returns (the rig's one-pixel dart, -1 to 0 and back), each well clear of
 * the tear's events (p30, p45, p90), the middle one with the feed's scroll. He reacts to nothing the sky does.
 * REACT is kept for the head-options tool.
 */
export const REACT: Partial<MM.MasMediumState> = {head: '34', look: -1, brow: 0};
export const DARTS: Array<[number, number]> = [[16, 21], [SCROLL_AT, SCROLL_AT + 5], [110, 115]];
const lookAtP = (p: number): -1 | 0 => (DARTS.some(([a, b]) => p >= a && p <= b) ? 0 : -1);
export const masAt = (p: number): MM.MasMediumState => ({...MM.MAS_MEDIUM_DEFAULT, head: '34', arm: 'rest', ...(p >= T.head ? REACT : {}), look: lookAtP(p)});

/** where the Orb looks: the monitor with him; on p45 one servo step to the crack (with the house in-between frame) */
export const orbLookAt = (p: number, crackAt: [number, number]): [number, number] => {
  const a = DPLATE_LOOK.grid;
  const b = OM.orbLook(DPLATE.orb[0], DPLATE.orb[1], crackAt[0], crackAt[1], 30);
  if (p < T.orb) return a;
  if (p === T.orb) return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return b;
};

export interface NativeOut {
  fb: Buf;
  /** 255 where Mas's figure is (the spill never touches him) */
  mas: Uint8Array;
  /** 255 on his glass (the spill never touches it either; the water line stays one flat row) */
  glass: Uint8Array;
}

/** the room area (rows 0..202) for clip frame p */
export const drawRoom = (p: number, orbLook: [number, number]): NativeOut => {
  const fb = new Buf(NW, NH, PAL.N0);
  const mas = new Uint8Array(NW * NH);
  const glass = new Uint8Array(NW * NH);
  const o = PLATE;
  drawDarkPlate(fb, p, o);
  const [ox, oy] = DPLATE.orb;
  OM.drawOrb(fb, ox, oy + OM.orbBob(p), OM.ORB_MR, {look: orbLook, aperture: 0.5, monitor: -1});
  const [mx, my] = DPLATE.mas;
  MM.drawMasMedium(fb, mx, my, masAt(p), {desk: (bb) => drawDarkPlateDesk(bb, p, o), mask: mas});
  drawDarkPlateFront(fb, p, o);
  // the glass (and its 1 px shadow row) as the plate draws it
  const g = DPLATE.glass;
  for (let y = g.y; y <= g.y + g.h; y++) for (let x = g.x; x < g.x + g.w + (y === g.y + g.h ? 5 : 0) + (y === g.y + g.h ? 3 : 0); x++) glass[y * NW + x] = 255;
  return {fb, mas, glass};
};

/** the rail band (rows 203..269): the date, as the rail carries it. It is UI: it never jumps. */
export const drawRail = (fb: Buf) => {
  rect(0, RH, NW, NH - RH, fb.ink(PAL.N0));
  rect(0, RH, NW, 1, fb.ink(PAL.N3));
  text(fb, RAIL, 12, RH + 12, PAL.P1, {shadow: PAL.N2});
};
