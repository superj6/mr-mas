// MR. MAS — Ep1 v3 · Act Four art (the v3-shots-act4 pass; NEW, additive, opt-in): RACE-WEEKEND DRESSING ON THE STRIP
// (script-v3-notes §7, S1.01): "banners on the lamp posts and grandstands on the closed street circuit. Generic only: no
// real racing series' name, logo or livery (guardrails §5)."
//
// rooms/vegas-suite.ts is not edited. The suite's view is an emissive back layer (suiteLayers); this module paints the
// dressing onto the FINISHED frame, but only where the frame still shows that view: inside the window's glass (not on
// the mullions) and wherever nothing stands in front of it (Mas, his desk, the Orb, the laptop: a pixel is dressed only
// if it equals the view layer's own pixel). So the dressing sits in the view at its depth, behind everything in the room.
//   suiteRaceDressing(fb, f, st)   after backs.ts suiteRoom(fb, f, st), with the same f and st
//   drawSuiteRace(fb, f, st)       suiteRoom + the dressing (the v2 24.01 composition, dressed)
// What it draws (all generic shapes and colours, no lettering at all):
//   * lamp posts along the near barrier, each with two vertical street banners (a red one with a pale chevron, a dark one
//     with a chequer), fluttering in two held drawings (a 1 px kick of their lower rows every 10 f)
//   * bunting: a string of small pennants under the grandstand's roof edge, and six flags on poles along its roof
//   * banner wraps on the concrete barrier: plain coloured panels and one chequered panel
// The glass's own sheen band (paintView's) is re-applied over the dressing, so it sits behind the same glass.
import {Buf} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {SUITE, suiteLayers, SuiteState} from '../../../../../shared/pixel/rooms/vegas-suite';
import {suiteRoom} from '../../../act4/animatic/backs';

const W = SUITE.WINDOW;
const MULL = new Set<number>(SUITE.MULLIONS.flatMap((m) => [m, m + 1]));
/** the lamp posts' x (clear of the mullions and the marquee pylon's legs) */
export const RACE_POSTS = [34, 132, 226, 318];
const BAR = {y0: 116, y1: 119}; // the concrete barrier (vegas-suite paintView)

/** the dressing as a sparse layer: [x, y, colour] (view coords = frame coords); f clocks the flutter */
const dressing = (f: number): Array<[number, number, number]> => {
  const out: Array<[number, number, number]> = [];
  const put = (x: number, y: number, c: number) => { if (x >= W.x0 && x <= W.x1 && y >= W.y0 && y <= W.y1) out.push([x, y, c]); };
  const kick = Math.floor(f / 10) % 2; // two held drawings
  // ---- the grandstand: pennants under the roof edge (y 99), three colours round
  const PEN = [PAL.R3, PAL.P2, PAL.C5];
  for (let i = 0, x = W.x0 + 2; x < W.x1 - 4; i++, x += 7) {
    const c = PEN[i % 3];
    for (let j = 0; j < 5; j++) put(x + j, 100, c);
    for (let j = 1; j < 4; j++) put(x + j, 101, c);
    put(x + 2, 102, c);
  }
  // flags on poles along the roof (sky-lit, against the city)
  for (let i = 0; i < 6; i++) {
    const x = W.x0 + 22 + i * 58;
    for (let y = 91; y < 99; y++) put(x, y, PAL.G2);
    const c = i % 2 ? PAL.P2 : PAL.R3, c2 = i % 2 ? PAL.R3 : PAL.P2;
    const fx = (Math.floor(f / 10) + i) % 2;
    for (let j = 0; j < 4; j++) { put(x + 1 + j, 91, c); put(x + 1 + j + (j === 3 ? fx : 0), 92, j % 2 ? c2 : c); put(x + 1 + j, 93, c); }
  }
  // ---- banner wraps on the concrete barrier: 22 px panels, 3 px of concrete between; every fourth a chequer
  const WRAP = [PAL.R2, PAL.G2, PAL.C4];
  for (let i = 0, x = W.x0 + 4; x < W.x1; i++, x += 25) {
    for (let j = 0; j < 22; j++) for (let y = BAR.y0; y <= BAR.y1 - 1; y++) {
      if (i % 4 === 3) put(x + j, y, ((j >> 1) + (y >> 1)) % 2 ? PAL.P2 : PAL.N1);
      else put(x + j, y, y === BAR.y0 ? stepColor(WRAP[i % 3], 1) : WRAP[i % 3]);
    }
  }
  // ---- the lamp posts and their banners (on the near barrier, in front of the street and the stands)
  RACE_POSTS.forEach((px, i) => {
    for (let y = 104; y < 141; y++) { put(px, y, PAL.G3); put(px + 1, y, PAL.G1); }
    for (let x = px - 4; x <= px + 5; x++) put(x, 104, PAL.G3); // the arm, both ways
    put(px - 4, 105, PAL.W7); put(px + 5, 105, PAL.W7); // the lamps (by day: pale)
    // two banners from brackets at y 107: 5 x 12, hems in the other colour
    const k = (kick + i) % 2;
    for (const side of [-1, 1] as const) {
      const x0 = side < 0 ? px - 6 : px + 2;
      for (let x = x0; x < x0 + 5; x++) put(x, 106, PAL.G3); // the bracket
      for (let y = 107; y < 119; y++) {
        const dx = y >= 115 ? k * side : 0; // the flutter: the lower rows kick 1 px outward
        for (let j = 0; j < 5; j++) {
          const x = x0 + j + dx;
          let c: number;
          if (side < 0) c = y === 107 || y === 118 ? PAL.P2 : Math.abs((y - 107) - 2 * Math.abs(j - 2) - 3) < 1 ? PAL.P2 : PAL.R3; // red, a pale chevron
          else c = y === 107 || y === 118 ? PAL.R3 : ((j >> 1) + ((y - 108) >> 1)) % 2 ? PAL.P2 : PAL.N1; // a chequer
          put(x, y, c);
        }
      }
    }
  });
  return out;
};

/** dress the Strip in a suite frame already drawn by suiteRoom(fb, f, st) */
export const suiteRaceDressing = (fb: Buf, f: number, st: Partial<SuiteState> = {}) => {
  const view = suiteLayers({f, laptop: 1, ...st}).back;
  for (const [x, y, c] of dressing(f)) {
    if (MULL.has(x)) continue;
    const i = y * 480 + x;
    if (fb.c[i] !== view.c[i]) continue; // something in the room stands in front of the view here
    const u = (x - W.x0 + (y - W.y0) * 0.45) % 150; // the glass's sheen band (vegas-suite paintView)
    fb.c[i] = u > 60 && u < 66 ? stepColor(c, 1) : c;
  }
};

/** the v2 24.01 suite wide (backs.ts suiteRoom), dressed for race weekend */
export const drawSuiteRace = (fb: Buf, f: number, st: Partial<SuiteState> = {}) => {
  suiteRoom(fb, f, st);
  suiteRaceDressing(fb, f, st);
};
