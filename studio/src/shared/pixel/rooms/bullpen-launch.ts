// MR. MAS — shared room: INT. NOPEAI BULLPEN — NIGHT, LAUNCH NIGHT (Ep1 Act One sc 5–7, and sc 12's desk at night).
// New file (v3-art-a, 2026-09-27); rooms/bullpen.ts (Act Four's DAY back wall) is not edited.
//
// The script's PLAN for this room, kept here (it is the one Act One's stick lock was blocked to): MAS's end desk at
// frame left (his laptop, dark until the launch; the beige button; his glass; the floor tile in front of the desk that
// becomes sc 6's hole), him turned 3/4 to frame right. GERG's desk faces his across the aisle at frame right, his laptop
// glowing green. On the right: RIMA's whiteboard under the NOPE AI neon, and past it the conference room's glass,
// where ALYI's reflection lives (the doorway he stands in is out of frame). Back left: the hallway's tungsten spill and
// the window onto the bay. After hours: one ceiling lamp out.
// It is the same office as Act Four's back wall (the neon, the whiteboard's LOW-KEY, the conference glass, the hall's
// tungsten), seen from the aisle at night. (Act Four's IOU note is Jul 2023; it isn't up yet.)
//
// Entry points (each paints rows 0..202 of `b`; deterministic on its state):
//   drawLaunchWide(b, f, st)     [W] the home room's one wide (and its arrival: st.hold, nobody talking yet)
//   launchBackM(b, camX, st)     the MEDIUM-scale back wall, a 960 px panorama (x 0..959): window · hall · wall ·
//                                the neon + whiteboard · the conference glass. A medium setup paints it from camX,
//                                then its figures: see LAUNCH_M for where things are
//   drawLaunch2S(b, f, st)       [2S] Mas and Gerg, desk to desk (the board's edge behind Gerg); the button + the lit
//                                band's cursor in the foreground (the fuse)
//   drawLaunchOTSRima(b, f, st)  [OTS] over Mas's shoulder onto Rima at his desk; LOW-KEY behind her; Alyi small and
//                                soft in the glass past it
//   drawLaunchGlass(b, f, st)    [MCU·glass] the conference glass: Alyi's reflection in its doorway (st.alyi, or gone);
//                                st.mas / st.rima add sc 5.09's layers (Mas soft in the fg, Rima at the board)
//   drawLaunchMcuRima(b, f, st)  [MCU] Rima turned from the glass to Mas, waiting (her portrait over the soft board)
//   drawLaunchMcuMas(b, f, st)   [MCU] Mas lit from below by the chat, the bullpen soft behind
//   drawLaunchHigh(b, f, st)     [HIGH] the floor in front of his desk from above: the tile, the hole, Rima peering
//                                down, the red glow far below, the second odometer (sc 6 phrase 3-4, sc 7)
// State shared by the plates: board underlines 1..3 (Rima's LAUNCH: LOW-KEY), the laptop 'dark' | 'chat', the
// cursor/band (the fuse), Gerg's green glow, Alyi's reflection there / gone / reading (sc 12).
import {Buf, rect, line, poly, ellipse, hash, bayer, clamp} from '../px';
import {PAL, stepColor, lightness, familyOf} from '../palette';
import {MatBuf, resolve, defineMat} from '../light';
import {text, textWidth, bigText, bigTextWidth} from '../font';
import {blitImg, Img} from '../figure';
import {masDeskBack, masDeskFront, MAS_DESK_DEFAULT, MasDeskPose, masPortrait, MAS_PORTRAIT_DEFAULT, MasPortraitState} from '../cast/mas';
import {drawGergTable, GERG_DEFAULT, GergPose, gergTypeAt, gergKeycaps, drawKeycaps} from '../cast/gerg';
import {gergMedium, GERG_MEDIUM_DEFAULT, GergMediumState} from '../cast/gerg-medium';
import {drawMasMedium, MasMediumState, MAS_MEDIUM_DEFAULT, MAS_M_DESK, MAS_MW} from '../cast/mas-medium';
import {rimaBust, RimaBustState, rimaSpeakPortrait, RIMA_PORTRAIT_DEFAULT, RimaPortraitState} from '../cast/rima-speak';
import {alyiReflection, alyiSpeakPortrait, ALYI_SPEAK_DEFAULT, AlyiSpeakState, alyiStand, ALYI_STAND_DEFAULT} from '../cast/alyi-speak';
import {drawRimaStand, RimaStandPose, RIMA_STAND_DEFAULT} from '../cast/rima-stand';
import {drawRimaBoard, RimaBoardPose, RIMA_BOARD_LINE0} from '../cast/rima-board';
import {drawGergPose} from '../cast/gerg-poses';
import {drawCollarsPortrait, drawCollarsMedium} from '../cast/mas-collars';
import {drawBeigeButton} from '../kits/launch-button';
import {drawChatWindow, ChatWindowState} from '../kits/chat-window';
import {drawOdometer, odometerSize} from '../kits/odometer';
import {tiny, tinyWidth} from './kit-b';
import {faceKey, warmRim, toWarmLamp} from '../kits/face-light';
export {faceKey, warmRim, toWarmLamp};

const RH = 203;
const TRANS = 0x1000000;

// ------------------------------------------------------------------ geometry (wide coords)
export const LAUNCH = {
  ceilY: 16,
  floorY: 128,
  win: {x0: 14, x1: 100, y0: 32, y1: 104},
  hall: {x0: 112, x1: 142, y0: 46},
  neon: {x: 336, y: 30},
  board: {x0: 318, x1: 412, y0: 48, y1: 100},
  glass: {x0: 422, x1: 480, y0: 34},
  /** Mas's end desk: its top (back edge y, front edge y), x span */
  masDesk: {x0: 20, x1: 156, back: 136, front: 143, panel: 170},
  /** Gerg's desk across the aisle */
  gergDesk: {x0: 228, x1: 326, back: 130, front: 136, panel: 160},
  /** the desk sprites' top-left anchors (the desk edge row 37 lands on the desk's back edge) */
  masAt: [58, 136 - 37] as [number, number],
  gergAt: [262, 130 - 37] as [number, number],
  /** feet anchors */
  rimaBoard: [376, 150] as [number, number],
  rimaMasDesk: [170, 166] as [number, number],
  /** the floor tile in front of his desk (sc 6's hole): x, y, w, h */
  tile: {x: 74, y: 178, w: 30, h: 10},
  masLaptop: [100, 128] as [number, number],
  button: [128, 133] as [number, number],
  masGlass: [142, 124] as [number, number],
};
const G = LAUNCH;

// ------------------------------------------------------------------ materials (NIGHT): [night ambient, cool (the neon, the working lamp, screens), warm (the hall's tungsten)]
const M = (name: string, a: string[], c: string[], w: string[]) => { defineMat(name, a as never, c as never, w as never); return name; };
const WALL = M('bl.wall', ['N0', 'N1', 'N2', 'N3', 'N4', 'N5', 'G2', 'G3'], ['N0', 'N1', 'N2', 'C0', 'C1', 'C2', 'C3', 'C4'], ['N0', 'N1', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5']);
const TRIM = M('bl.trim', ['N0', 'N1', 'N2', 'N3', 'G1', 'G2', 'G3', 'G4'], ['N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C4', 'C5'], ['N0', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5', 'W6']);
const CARPET = M('bl.carpet', ['N0', 'N0', 'N1', 'N2', 'N3', 'N4', 'G1', 'G2'], ['N0', 'N1', 'N2', 'C0', 'C1', 'C2', 'C3', 'C4'], ['N0', 'D0', 'D1', 'D2', 'D3', 'W3', 'W4', 'W5']);
const CEIL = M('bl.ceil', ['N0', 'N1', 'N2', 'N3', 'N4', 'G1', 'G2', 'G3'], ['N0', 'N1', 'N2', 'C0', 'C1', 'C2', 'C3', 'C4'], ['N0', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5', 'W6']);
const DESK = M('bl.desk', ['N0', 'N1', 'N2', 'N3', 'G1', 'G2', 'G3', 'G4'], ['N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C5', 'C6'], ['N0', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5', 'W6']);
const WHITE = M('bl.white', ['N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'G5', 'G6'], ['N2', 'N3', 'C1', 'C3', 'C5', 'C6', 'C7', 'C8'], ['N2', 'W1', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']);
const STEEL = M('bl.steel', ['N0', 'N1', 'N2', 'G1', 'G2', 'G3', 'G4', 'G5'], ['N0', 'N1', 'C0', 'C1', 'C3', 'C5', 'C6', 'C7'], ['N0', 'W0', 'W1', 'W3', 'W5', 'W6', 'W7', 'W8']);
const DARK = M('bl.dark', ['N0', 'N0', 'N1', 'N1', 'N2', 'N3', 'G1', 'G2'], ['N0', 'N0', 'N1', 'C0', 'C0', 'C1', 'C2', 'C3'], ['N0', 'N0', 'W0', 'W0', 'W1', 'W2', 'W3', 'W4']);
const GLASS = M('bl.glass', ['N0', 'N1', 'N1', 'N2', 'N3', 'N4', 'N5', 'N6'], ['N0', 'N1', 'C0', 'C0', 'C1', 'C2', 'C3', 'C4'], ['N0', 'N1', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5']);
// v3.1 warm variant only: the back wall's warm rungs bridge through the dusk plums (U) before the tungsten, so a lamp's
// low wash on a navy wall reads as warm light, not as red smudges (the W ramp's darkest rungs are reddish)
const WALLW = M('bl.wallw', ['N0', 'N1', 'N2', 'N3', 'N4', 'N5', 'G2', 'G3'], ['N0', 'N1', 'N2', 'C0', 'C1', 'C2', 'C3', 'C4'], ['N0', 'N1', 'N2', 'U0', 'U1', 'U2', 'W3', 'W4']);
const CHAIR = M('bl.chair', ['N0', 'N0', 'N1', 'N1', 'N2', 'N3', 'N4', 'G2'], ['N0', 'N0', 'N1', 'C0', 'C1', 'C2', 'C3', 'C4'], ['N0', 'N0', 'W0', 'W1', 'W2', 'W3', 'W4', 'W5']);

// ------------------------------------------------------------------ the bay at night through a window (emissive)
/** the bay at night: a deep sky, the far shore's lights in rows, the water's broken reflections, a bridge's chain of
 *  lights. (x0, y0)-(x1, y1) is the window's glass; `ox` scrolls the view (parallax on a push); `s` = 1 wide, 2 medium */
export const drawBayNight = (b: Buf, x0: number, y0: number, x1: number, y1: number, s: 1 | 2 = 1, ox = 0) => {
  const hz = y0 + Math.round((y1 - y0) * 0.56);
  for (let y = y0; y <= y1; y++)
    for (let x = x0; x <= x1; x++) {
      const X = x + ox;
      let c: number;
      if (y < hz - 2 * s) { const t = (y - y0) / (hz - y0) + (bayer(X, y) - 0.5) * 0.2; c = t < 0.45 ? PAL.N1 : t < 0.85 ? PAL.N2 : PAL.U0; }
      else if (y < hz) c = PAL.N2;
      else c = (y - hz) < 2 * s ? PAL.N1 : PAL.N0;
      b.set(x, y, c);
    }
  // the far shore: low hills (a darker band), the lights along it in two rows
  for (let x = x0; x <= x1; x++) {
    const X = x + ox, hill = Math.round((3 + 2 * Math.sin(X * 0.07 / s) + Math.sin(X * 0.21 / s)) * s);
    for (let y = hz - hill; y < hz; y++) b.set(x, y, PAL.N1);
    if (hash(X >> (s - 1), 3, 51) < 0.32) b.set(x, hz - Math.round(hill * 0.4) - 1, hash(X, 1, 52) < 0.2 ? PAL.P1 : PAL.W6);
    if (hash(X >> (s - 1), 4, 53) < 0.18) b.set(x, hz - 1, PAL.W4);
    // the water's reflections: short vertical streaks under the brighter lights
    if (hash(X >> (s - 1), 3, 51) < 0.12) for (let j = 1; j < 4 * s; j += 2) if (hz + j <= y1) b.set(x, hz + j, hash(X, j, 54) < 0.5 ? PAL.W4 : PAL.W3);
  }
  // a bridge: two towers and the chain of its lights, far off to one side
  const bx = x0 + Math.round((x1 - x0) * 0.62) - ox;
  for (let k = 0; k < 2; k++) { const tx = bx + k * 24 * s; if (tx >= x0 && tx <= x1) for (let y = hz - 12 * s; y < hz; y++) b.set(tx, y, PAL.N3); }
  for (let i = -8 * s; i < 36 * s; i++) { const x = bx + i; if (x < x0 || x > x1) continue; const sag = Math.round(((i - 12 * s) / (12 * s)) ** 2 * 5 * s); const y = hz - 12 * s + sag; if (i % (2 * s) === 0) b.set(x, clamp(y, y0, hz - 1), PAL.W7); }
  // a few stars
  for (let k = 0; k < 10; k++) { const x = x0 + Math.floor(hash(k, 1, 55) * (x1 - x0)), y = y0 + Math.floor(hash(k, 2, 55) * (hz - y0) * 0.6); b.set(x, y, k % 3 ? PAL.N5 : PAL.N7); }
};

// ------------------------------------------------------------------ the whiteboard's ink (either scale)
/** LAUNCH: LOW-KEY in Rima's red marker, underlined `n` times (2 on arrival, the 3rd on "Your button."); `wet` draws the
 *  3rd underline part-way (0..1) while she's drawing it. Wide scale: tiny caps; medium: the 7px face. */
const boardInk = (b: Buf, x: number, y: number, w: number, s: 1 | 2, n: number, wet = 1) => {
  const red = PAL.R2, blue = PAL.F4;
  if (s === 1) {
    tiny(b, 'LAUNCH:', x + 5, y + 5, red);
    tiny(b, 'LOW-KEY', x + 5, y + 12, red);
    const uw = tinyWidth('LOW-KEY') + 2;
    for (let i = 0; i < Math.min(3, n); i++) { const len = i === 2 ? Math.round(uw * wet) : uw; rect(x + 4 + (i & 1), y + 18 + i * 2, len, 1, b.ink(red)); }
    // the rest of the board: a flow sketch and a scribble column (no legible words)
    const box = (bx: number, by: number, bw: number, bh: number) => { rect(bx, by, bw, 1, b.ink(blue)); rect(bx, by + bh - 1, bw, 1, b.ink(blue)); rect(bx, by, 1, bh, b.ink(blue)); rect(bx + bw - 1, by, 1, bh, b.ink(blue)); };
    box(x + 50, y + 6, 12, 7); box(x + 72, y + 6, 12, 7); line(x + 63, y + 9, x + 71, y + 9, b.ink(blue));
    for (let k = 0; k < 4; k++) line(x + 50, y + 22 + k * 3, x + 62 + ((k * 7) % 14), y + 22 + k * 3, b.ink(PAL.N3));
    return;
  }
  // medium: the 7px face, the underlines 2 px apart and a little uneven (a hand, not a ruler)
  text(b, 'LAUNCH: LOW-KEY', x + 10, y + 12, red);
  const lx = x + 10 + textWidth('LAUNCH: '), uw = textWidth('LOW-KEY') + 3;
  for (let i = 0; i < Math.min(3, n); i++) {
    const len = i === 2 ? Math.round(uw * wet) : uw;
    for (let k = 0; k < len; k++) b.set(lx - 1 + k + (i === 1 ? 1 : 0), y + 21 + i * 3 + (k > uw * 0.6 && i !== 1 ? 1 : 0), red);
  }
  const box = (bx: number, by: number, bw: number, bh: number) => { rect(bx, by, bw, 1, b.ink(blue)); rect(bx, by + bh - 1, bw, 1, b.ink(blue)); rect(bx, by, 1, bh, b.ink(blue)); rect(bx + bw - 1, by, 1, bh, b.ink(blue)); };
  box(x + 12, y + 44, 24, 14); box(x + 56, y + 44, 24, 14); line(x + 37, y + 51, x + 54, y + 51, b.ink(blue)); b.set(x + 52, y + 49, blue); b.set(x + 52, y + 53, blue); b.set(x + 53, y + 50, blue); b.set(x + 53, y + 52, blue);
  for (let k = 0; k < 5; k++) line(x + 96, y + 44 + k * 5, x + 118 + ((k * 9) % 22), y + 44 + k * 5 + (k & 1), b.ink(PAL.N3));
  text(b, '?', x + 84, y + 47, PAL.N3);
};

// ------------------------------------------------------------------ the wide
export interface LaunchWideState {
  /** Rima's underlines on LOW-KEY (2 on arrival, 3 after "Your button."), and the wet 3rd (0..1) */
  underlines?: number;
  wet?: number;
  /** Rima's pose (at the board by default); null = not in the room (she's at his desk in another setup) */
  rima?: Partial<RimaStandPose> & {at?: [number, number]; flip?: boolean} | null;
  /** Alyi's reflection in the glass: there · gone · null (not drawn) */
  alyi?: 'there' | 'gone' | null;
  mas?: Partial<MasDeskPose>;
  /** Gerg at his desk (the table sprite); armsUp (sc 6.02: he jumps up behind his desk, both arms up, the count) */
  gerg?: Partial<GergPose> & {armsUp?: boolean};
  /** the laptop on his desk: dark (closed) · chat (open, the first chat window lit) */
  laptop?: 'dark' | 'chat';
  /** the floor tile in front of his desk: 0 flat · 1 popped (sc 6 phrase 4) · 'hole' (the odometer went through) */
  tile?: 0 | 1 | 'hole';
  /** the ceiling's one lamp that's out: a slow held flicker is off by default (it's out, not dying) */
  flicker?: boolean;
  /** Gerg's keycaps pop off (his trait) from this frame; null = none */
  capsFrom?: number | null;
  /** sc 6: the desk-sized odometer on his desk, spinning ('desk'), dropping through it in two held drawings ('drop1',
   *  'drop2': the top broken, the machine behind the desk's front), and gone ('gone': the jagged hole in the top) */
  odo?: {stage: 'desk' | 'drop1' | 'drop2' | 'gone'; value?: number};
  /** v3.1 (opt-in; mood §4 #10, the lead's round): the room warmed one ramp step by its practicals: the hall's
   *  tungsten reaching further, Mas's desk lamp (its pool on his desk and on him), a lamp left on at the far row */
  warm?: 0 | 1;
  /** v3.1 background life (opt-in): someone crossing the hall's far end (passer: 0..1 of the crossing, or null), a far
   *  monitor's screensaver and its flicker (flicker), a car's light crossing the bridge in the window (car) */
  life?: {passer?: number | null; flicker?: boolean; car?: boolean};
}
const wideBases: Record<number, {buf: Buf; front: Buf}> = {};
/** where the v3.1 practicals are (the wide): Mas's desk lamp (its head over the desk's left end) and a lamp left on at
 *  the far row (someone else's late night) */
export const LAUNCH_LAMPS = {mas: {base: [30, 135] as [number, number], head: [40, 111] as [number, number]}, far: [236, 106] as [number, number]};
const paintWide = (warm = 0) => {
  if (wideBases[warm]) return wideBases[warm];
  const mb = new MatBuf(480, RH), fm = new MatBuf(480, RH);
  const P = (mat: string, lvl = 0) => mb.mat(mat, lvl), S = (d: number) => mb.shade(d);
  const {ceilY, floorY} = G;
  // ceiling: drop-ceiling tiles in shallow perspective, the lamps (emissive where on)
  rect(0, 0, 480, ceilY, P(CEIL, 0));
  for (let x = -200; x < 700; x += 26) line(x, ceilY - 1, Math.round(240 + (x - 240) * 1.6), 0, S(-1));
  for (const y of [ceilY - 4, ceilY - 9]) rect(0, y, 480, 1, S(-1));
  rect(0, ceilY, 480, 2, P(TRIM, 0.4));
  // back wall
  rect(0, ceilY + 2, 480, floorY - ceilY - 2, P(WALL, 0));
  for (let y = ceilY + 2; y < floorY - 4; y++) for (let x = 0; x < 480; x++) if (hash(x, y, 7) < 0.004) S(-0.5)(x, y);
  rect(0, floorY - 4, 480, 4, P(TRIM, -0.4)); rect(0, floorY - 4, 480, 1, S(0.8));
  // the window onto the bay (frame; the view is drawn after the light pass)
  const w = G.win;
  rect(w.x0 - 3, w.y0 - 3, w.x1 - w.x0 + 7, w.y1 - w.y0 + 7, P(TRIM, 0.6)); rect(w.x0 - 3, w.y0 - 3, w.x1 - w.x0 + 7, 1, S(1));
  rect(w.x0 - 5, w.y1 + 3, w.x1 - w.x0 + 11, 2, P(TRIM, 1));
  // the hall mouth (its corridor is emissive tungsten, painted after)
  const h = G.hall;
  rect(h.x0 - 3, h.y0 - 3, h.x1 - h.x0 + 6, floorY - h.y0 + 3, P(TRIM, 0.8));
  // the whiteboard (its ink is drawn after) and its tray
  const bd = G.board;
  rect(bd.x0 - 2, bd.y0 - 2, bd.x1 - bd.x0 + 4, bd.y1 - bd.y0 + 4, P(STEEL, 0.4));
  rect(bd.x0, bd.y0, bd.x1 - bd.x0, bd.y1 - bd.y0, P(WHITE, 0.2));
  rect(bd.x0 + 8, bd.y1 + 2, bd.x1 - bd.x0 - 16, 2, P(STEEL, 0));
  // the conference glass at the right edge: a dark room behind it, mullions, the frosted band
  const gl = G.glass;
  rect(gl.x0 - 2, gl.y0 - 3, 480 - gl.x0 + 2, 3, P(TRIM, 0.2));
  rect(gl.x0, gl.y0, 480 - gl.x0, floorY - gl.y0, P(GLASS, 0));
  rect(gl.x0, floorY - 14, 480 - gl.x0, 14, P(CARPET, -1.4));
  rect(gl.x0 - 2, gl.y0, 3, floorY - gl.y0, P(TRIM, 0.4));
  for (let y = 92; y < 97; y++) for (let x = gl.x0 + 2; x < 480; x++) if ((x + y) % 3 === 0) P(WHITE, -1.6)(x, y);
  // the carpet: tile seams toward a vanishing point left of centre, depth seams
  rect(0, floorY, 480, RH - floorY, P(CARPET, 0));
  for (let x = -900; x < 1400; x += 30) line(Math.round(x), floorY, Math.round(200 + (x - 200) * 2.6), RH, S(-0.8));
  for (const y of [floorY + 5, floorY + 12, floorY + 21, floorY + 33, floorY + 48, floorY + 66]) rect(0, y, 480, 1, S(-0.8));
  for (let y = floorY; y < RH; y++) for (let x = 0; x < 480; x++) if (hash(x >> 1, y, 13) < 0.07) S(0.4)(x, y);
  // Gerg's desk (across the aisle): its chair back behind (drawn by the sprite), the top, the front panel, legs
  const gd = G.gergDesk;
  rect(gd.x0, gd.back, gd.x1 - gd.x0, gd.front - gd.back, P(DESK, 0.6));
  rect(gd.x0, gd.front, gd.x1 - gd.x0, 1, P(DESK, 1.6));
  rect(gd.x0 + 3, gd.front + 1, gd.x1 - gd.x0 - 6, gd.panel - gd.front, P(TRIM, 0));
  rect(gd.x0 + 3, gd.front + 1, gd.x1 - gd.x0 - 6, 1, S(-1.2));
  for (const lx of [gd.x0 + 1, gd.x1 - 3]) rect(lx, gd.front + 1, 2, gd.panel + 6 - gd.front, P(STEEL, 0.3));
  // a second monitor on Gerg's desk, turned to him (we see its back), a mug
  rect(gd.x0 + 62, gd.back - 18, 24, 16, P(DARK, 0.6)); rect(gd.x0 + 72, gd.back - 2, 4, 2, P(STEEL, 0));
  rect(gd.x0 + 14, gd.back - 5, 5, 5, P(WHITE, -0.4));
  // the rest of the bullpen after hours: a far row of empty desks against the back wall between the hall and the board
  // (dark monitors, chair backs, a plant), so the room reads as an office and the aisle as an aisle
  for (const [x0, x1] of [[152, 214], [216, 290]] as Array<[number, number]>) {
    rect(x0, 112, x1 - x0, 3, P(DESK, 0)); rect(x0, 115, x1 - x0, 6, P(TRIM, -0.6));
    for (let k = x0 + 6; k < x1 - 14; k += 28) { rect(k, 98, 16, 12, P(DARK, 0.4)); rect(k + 6, 110, 4, 2, P(STEEL, -0.4)); rect(k + 2, 104, 12, 14, P(CHAIR, 0)); }
  }
  rect(300, 104, 7, 17, P(DARK, -0.2));
  for (const [ax, bx, by] of [[303, 296, 86], [304, 309, 84], [303, 312, 92], [302, 299, 94]]) line(ax, 104, bx, by, P(CHAIR, 1.2));
  // Mas's end desk, nearer the camera at frame left: the top, its front edge, the modesty panel to the floor
  const md = G.masDesk;
  const fP = (mat: string, lvl = 0) => fm.mat(mat, lvl), fS = (d: number) => fm.shade(d);
  rect(md.x0, md.back, md.x1 - md.x0, md.front - md.back, fP(DESK, 0.8));
  rect(md.x0, md.front, md.x1 - md.x0, 1, fP(DESK, 1.8));
  rect(md.x0 + 3, md.front + 1, md.x1 - md.x0 - 6, md.panel - md.front, fP(TRIM, 0.2));
  rect(md.x0 + 3, md.front + 1, md.x1 - md.x0 - 6, 1, fS(-1.2));
  for (const lx of [md.x0 + 1, md.x1 - 3]) rect(lx, md.front + 1, 2, md.panel + 10 - md.front, fP(STEEL, 0.4));
  // the floor tile in front of his desk (a carpet tile, its seam a shade darker: sc 6's hole)
  const t = G.tile;
  rect(t.x, t.y, t.w, 1, fS(-1)); rect(t.x, t.y + t.h, t.w, 1, fS(-1));
  const lights = {
    amb: (x: number, y: number) => {
      let a = 2.4;
      // a working lamp over the desks (one panel on), a darker far right
      const d = Math.hypot((x - 170) / 190, (y - 60) / 120);
      if (d < 1) a += (1 - d) * 1.4;
      if (y >= floorY) a -= (y - floorY) / 90;
      return a;
    },
    cyan: (x: number, y: number) => {
      // the NOPE AI neon's cool wash on the board and the wall round it
      const d = Math.hypot((x - 362) / 52, (y - 42) / 30);
      let L = d < 1 ? (1 - d) * 0.5 : 0;
      // the working lamp's cool pool on Mas's desk top
      const dm = Math.hypot((x - 110) / 80, (y - 140) / 16);
      if (dm < 1) L = Math.max(L, (1 - dm) * 0.5);
      return L;
    },
    warm: (x: number, y: number) => {
      // the hall's tungsten: a lick on its jambs and a spill across the carpet, widening toward camera
      let L = 0;
      // v3.1 (warm 1): the spill reaches further into the room (a wider, longer fan)
      const wide = warm ? 1.45 : 1;
      if (y >= floorY) {
        const tt = (y - floorY) / (RH - floorY);
        const l = G.hall.x0 - 2 - tt * 16 * wide, r = G.hall.x1 + 2 + tt * 52 * wide;
        if (x >= l && x <= r) { const u = (x - l) / (r - l); L = (0.6 - tt * 0.3) * (1 - Math.pow(Math.abs(u - 0.45) * 2, 2) * 0.7) * (warm ? 1.25 : 1); }
      } else if (x > G.hall.x0 - 14 * wide && x < G.hall.x1 + 16 * wide && y > G.hall.y0 - 10) {
        const dd = Math.min(Math.abs(x - G.hall.x0), Math.abs(x - G.hall.x1)) / (14 * wide);
        L = Math.max(0, 0.7 - dd * 0.6);
      }
      if (warm) {
        // Mas's desk lamp: a pool on his desk top and the wall behind the desk's left end; the far row's lamp
        const [hx, hy] = LAUNCH_LAMPS.mas.head;
        const dm = Math.hypot((x - hx - 18) / 74, (y - hy - 24) / (y > hy + 20 ? 18 : 40));
        if (dm < 1) L = Math.max(L, (1 - dm) * 0.8);
        const [fx, fy] = LAUNCH_LAMPS.far;
        const df = Math.hypot((x - fx) / 34, (y - fy) / 16);
        if (df < 1) L = Math.max(L, (1 - df) * 0.6);
      }
      return L;
    },
    dither: 0.65,
  };
  const buf = new Buf(480, RH, PAL.N0);
  resolve(mb, lights, buf, 0);
  const front = new Buf(480, RH, TRANS);
  resolve(fm, lights, front, 0);
  // emissive: the bay, the hall's corridor, the lamps, the neon
  drawBayNight(buf, w.x0, w.y0, w.x1, w.y1, 1);
  rect(Math.round((w.x0 + w.x1) / 2), w.y0, 2, w.y1 - w.y0 + 1, buf.ink(PAL.N3)); rect(w.x0, w.y0 + 30, w.x1 - w.x0 + 1, 1, buf.ink(PAL.N3));
  // the corridor: a tungsten box receding to a lit far wall
  const fx0 = h.x0 + 10, fx1 = h.x1 - 8, fy0 = h.y0 + 20, fy1 = floorY - 24;
  for (let y = h.y0; y < floorY; y++) for (let x = h.x0; x < h.x1; x++) {
    let c: number;
    if (x >= fx0 && x < fx1 && y >= fy0 && y < fy1) c = y < fy0 + 3 ? PAL.W5 : PAL.W6;
    else {
      const dl = x < fx0 ? (x - h.x0) / (fx0 - h.x0) : 9, dr = x >= fx1 ? (h.x1 - 1 - x) / (h.x1 - 1 - fx1) : 9;
      const dt = y < fy0 ? (y - h.y0) / (fy0 - h.y0) : 9, db = y >= fy1 ? (floorY - 1 - y) / (floorY - 1 - fy1) : 9;
      const m = Math.min(dl, dr, dt, db);
      c = m === db ? (bayer(x, y) < 0.5 ? PAL.W4 : PAL.W3) : m === dt ? PAL.W1 : m === dl ? (bayer(x, y) < 0.5 ? PAL.W4 : PAL.W3) : PAL.W2;
    }
    buf.set(x, y, c);
  }
  buf.set(Math.round((fx0 + fx1) / 2), fy0 + 1, PAL.W8);
  // the ceiling lamps: the one over the desks on, one out (dark), the far one on
  const lamp = (xa: number, xb: number, on: boolean) => { for (let y = ceilY - 7; y <= ceilY - 5; y++) for (let x = xa; x <= xb; x++) buf.set(x, y, on ? (y === ceilY - 6 ? PAL.P2 : PAL.G6) : y === ceilY - 6 ? PAL.N2 : PAL.N1); };
  lamp(120, 170, true); lamp(260, 300, false); lamp(400, 440, true);
  // the neon NOPE AI over the whiteboard (the same sign as Act Four's back wall)
  const nw = textWidth('NOPE AI');
  for (let j = -3; j < 10; j++) for (let i = -4; i < nw + 4; i++) buf.set(G.neon.x + i, G.neon.y + j, stepColor(buf.get(G.neon.x + i, G.neon.y + j), -1));
  text(buf, 'NOPE AI', G.neon.x + 1, G.neon.y + 1, PAL.C3);
  text(buf, 'NOPE AI', G.neon.x, G.neon.y, PAL.C6);
  for (let i = 0; i < nw; i++) if (buf.get(G.neon.x + i, G.neon.y) === PAL.C6 && buf.get(G.neon.x + i, G.neon.y + 1) === PAL.C6) buf.set(G.neon.x + i, G.neon.y, PAL.C8);
  // the glass's sheen (two streaks)
  for (let y = gl.y0; y < floorY - 14; y++) for (let x = gl.x0 + 1; x < 480; x++) { const u = x - gl.x0 + (y - gl.y0) * 0.5; if ((u > 14 && u < 16) || (u > 20 && u < 21)) buf.set(x, y, stepColor(buf.get(x, y), 1)); }
  if (warm) {
    // the practicals themselves (emissive): Mas's desk lamp (an anglepoise on the desk's left end, its shade tipped
    // over the desk, the bulb's hot rim), and the far row's small lamp
    const [bx, by] = LAUNCH_LAMPS.mas.base, [hx, hy] = LAUNCH_LAMPS.mas.head;
    const lampTo = (bb: Buf) => {
      rect(bx - 4, by - 1, 9, 2, bb.ink(PAL.N1)); rect(bx - 3, by - 2, 7, 1, bb.ink(PAL.G2));
      line(bx, by - 2, bx + 2, by - 14, bb.ink(PAL.G1)); line(bx + 2, by - 14, hx - 2, hy + 1, bb.ink(PAL.G1)); line(bx + 1, by - 2, bx + 3, by - 14, bb.ink(PAL.G2));
      for (let j = 0; j < 7; j++) for (let i = -3 - j; i <= 4 + Math.floor(j / 2); i++) bb.set(hx + i + j, hy + j, j === 6 ? PAL.W7 : i < -1 - j ? PAL.G2 : PAL.G1);
      rect(hx + 2, hy + 6, 7, 1, bb.ink(PAL.W8)); bb.set(hx + 5, hy + 7, PAL.W9);
    };
    lampTo(front);
    const [fx, fy] = LAUNCH_LAMPS.far;
    rect(fx - 1, fy + 3, 3, 3, buf.ink(PAL.G1)); for (let i = -3; i <= 3; i++) buf.set(fx + i, fy + 2, Math.abs(i) < 3 ? PAL.W6 : PAL.W4); for (let i = -2; i <= 2; i++) buf.set(fx + i, fy + 1, PAL.W5);
  }
  wideBases[warm] = {buf, front};
  return wideBases[warm];
};

/** Gerg's green laptop glow: the cyan-lit rungs of his sprite (the Woodrose drawing's screen light) walk to green, and
 *  a green pool lands on his desk top and the wall behind his screen */
const GREEN: Record<number, number> = {[PAL.C1]: PAL.L0, [PAL.C2]: PAL.L1, [PAL.C3]: PAL.L1, [PAL.C4]: PAL.L2, [PAL.C5]: PAL.L2, [PAL.C6]: PAL.L3, [PAL.C7]: PAL.L3, [PAL.C8]: PAL.L3, [PAL.K1]: PAL.L1, [PAL.K2]: PAL.L2, [PAL.K3]: PAL.L3};
export const toGreenGlow = (c: number) => GREEN[c] ?? c;
const greenPool = (b: Buf, cx: number, cy: number, rx: number, ry: number, k = 0.55) => {
  for (let y = Math.max(0, cy - ry); y < Math.min(RH, cy + ry); y++) for (let x = cx - rx; x < cx + rx; x++) {
    const d = Math.hypot((x - cx) / rx, (y - cy) / ry);
    if (d >= 1 || bayer(x, y) > (1 - d) * k) continue;
    const c = b.get(x, y), L = lightness(c);
    b.set(x, y, L < 0.12 ? PAL.L0 : L < 0.2 ? PAL.L1 : PAL.L2);
  }
};

export const drawLaunchWide = (b: Buf, f: number, st: LaunchWideState = {}) => {
  const warm = st.warm ?? 0;
  const base = paintWide(warm);
  for (let y = 0; y < RH; y++) b.c.set(base.buf.c.subarray(y * 480, (y + 1) * 480), y * b.w);
  const bd = G.board;
  boardInk(b, bd.x0, bd.y0, bd.x1 - bd.x0, 1, st.underlines ?? 2, st.wet ?? 1);
  // the lamp that's out: if flickering, a rare held on-frame
  if (st.flicker && hash(Math.floor(f / 4), 0, 77) < 0.08) for (let x = 260; x <= 300; x++) b.set(x, G.ceilY - 6, PAL.G4);
  if (st.life) wideLife(b, f, st.life);
  // Alyi's reflection in the conference glass (his doorway is out of frame right): a lightness modulation of the glass
  if (st.alyi === 'there') {
    const img = alyiStand({...ALYI_STAND_DEFAULT, light: 'door', arms: 'down'});
    for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) {
      const c = img.c[j * img.w + (img.w - 1 - i)];
      if (c < 0) continue;
      const X = 440 + i, Y = G.floorY - 16 - img.h + j;
      if (X < G.glass.x0 + 1 || X >= 480 || Y < G.glass.y0 || Y >= G.floorY - 14) continue;
      const L = lightness(c);
      b.set(X, Y, stepColor(b.get(X, Y), L > 0.4 ? 3 : L > 0.2 ? 2 : 1));
    }
  }
  // Gerg at his desk, facing Mas across the aisle; his laptop's glow green
  if (st.gerg?.armsUp) {
    // standing behind his desk, both arms up (the desk's top and panel redrawn over his legs: he's behind it)
    drawGergPose(b, G.gergAt[0] + 24, G.gergDesk.back + 34, {body: 'armsUp'}, {flip: true, map: (c) => toGreenGlow(c)});
    const gd = G.gergDesk;
    for (let y = gd.back; y < gd.panel + 8; y++) for (let x = gd.x0; x < gd.x1; x++) b.set(x, y, base.buf.get(x, y));
    // his laptop, left open on the desk, its green on the lid
    poly([G.gergAt[0] + 2, gd.back - 12, G.gergAt[0] + 20, gd.back - 12, G.gergAt[0] + 22, gd.back, G.gergAt[0], gd.back], b.ink(PAL.G1)); rect(G.gergAt[0] + 20, gd.back - 11, 1, 11, b.ink(PAL.L3));
  } else drawGergTable(b, G.gergAt[0], G.gergAt[1], {...GERG_DEFAULT, type: gergTypeAt(f), ...st.gerg}, f, {map: (c) => toGreenGlow(c), capsFrom: st.capsFrom ?? 1e9});
  greenPool(b, G.gergAt[0] + 10, G.gergDesk.back + 2, 26, 7);
  // Rima at the board (her back to the room), or wherever the shot puts her
  if (st.rima !== null) {
    const r = {...RIMA_STAND_DEFAULT, body: 'write' as const, head: 'back' as const, ...st.rima};
    const [rx, ry] = st.rima?.at ?? G.rimaBoard;
    drawRimaStand(b, rx, ry, r, {flip: st.rima?.flip});
  }
  // Mas at his end desk, turned 3/4 to frame right (the desk sprite, flipped: it's drawn facing camera-left)
  const mp: MasDeskPose = {...MAS_DESK_DEFAULT, head: 'turn', light: 'orb', ...st.mas};
  // v3.1 warm: his desk lamp is on his near side, so the sprite's cool rungs take the lamp's warm ones
  const mmap = warm ? toWarmLamp : undefined;
  blitImg(b, masDeskBack(mp), G.masAt[0], G.masAt[1], {flip: true, map: mmap});
  // his desk, in front of him, and what's on it
  for (let i = 0; i < base.front.c.length; i++) { const v = base.front.c[i]; if (v !== TRANS) b.c[i] = v; }
  blitImg(b, masDeskFront(mp), G.masAt[0], G.masAt[1], {flip: true, map: mmap});
  const [lx, ly] = G.masLaptop;
  if ((st.laptop ?? 'dark') === 'dark') {
    // closed and dark: a thin slab, lid down, a sheen line
    poly([lx, ly + 6, lx + 22, ly + 6, lx + 24, ly + 9, lx - 2, ly + 9], b.ink(PAL.G1)); rect(lx, ly + 6, 22, 1, b.ink(PAL.G3));
  } else {
    // open, lid toward him (we see the lid's back), the chat's cyan on his face side and a cool pool on the desk
    poly([lx + 2, ly - 8, lx + 20, ly - 8, lx + 22, ly + 7, lx, ly + 7], b.ink(PAL.G1)); rect(lx + 2, ly - 8, 18, 1, b.ink(PAL.G3));
    rect(lx - 1, ly + 7, 24, 2, b.ink(PAL.G2)); rect(lx, ly - 7, 1, 14, b.ink(PAL.C5));
  }
  drawBeigeButton(b, G.button[0], G.button[1], {scale: 'room'});
  // sc 6: the odometer (wide size: a desk's width at room scale) on his desk, then through it
  if (st.odo) {
    const {w: ow, h: oh} = odometerSize('wide', 7);
    const ox = 96, top = G.masDesk.back - oh + 1;
    const drop = st.odo.stage === 'drop1' ? 22 : st.odo.stage === 'drop2' ? 36 : 0;
    const md = G.masDesk;
    if (st.odo.stage !== 'gone') {
      const tmp = new Buf(480, RH, TRANS);
      drawOdometer(tmp, ox, top + drop, {size: 'wide', value: st.odo.value ?? 301775, digits: 7, spin: 1, f, shake: st.odo.stage === 'desk' ? [f % 4 < 2 ? 0 : 1, 0] : [0, 0]});
      // once it's going through, the desk's front (panel, legs) hides its lower part
      for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const v = tmp.c[y * 480 + x]; if (v === TRANS) continue; if (drop && y >= md.back) continue; b.c[y * b.w + x] = v; }
    }
    if (st.odo.stage !== 'desk') {
      // the broken top: a jagged dark gap where it went through, splinters up at its lips
      const hx0 = Math.max(md.x0 + 2, ox + 2), hx1 = Math.min(md.x1 - 2, ox + ow - 2);
      if (ox + ow > md.x1) for (let x = md.x1; x < ox + ow - 2; x++) for (let y = md.back - 1; y < md.back + 3; y++) b.set(x, y, PAL.N0); // past the desk's end it went straight through the floor
      for (let x = hx0; x < hx1; x++) { const jag = Math.round(hash(x, 1, 61) * 2); for (let y = md.back - jag; y < md.front + 1 + jag; y++) b.set(x, y, st.odo.stage === 'gone' ? PAL.N0 : b.get(x, y) === PAL.N0 ? PAL.N0 : b.get(x, y)); }
      if (st.odo.stage === 'gone') for (let x = hx0; x < hx1; x += 5) { b.set(x, md.back - 2, PAL.G3); b.set(x + 1, md.back - 3, PAL.G4); }
      for (let k = 0; k < 6; k++) { const sx = hx0 + Math.floor(hash(k, 2, 62) * (hx1 - hx0)), sy = md.back - 4 - Math.floor(hash(k, 3, 62) * 8); if (st.odo.stage !== 'gone') b.set(sx, sy, PAL.G4); }
    }
  }
  // his glass (the one flat water line)
  const [gx, gy] = G.masGlass;
  for (let j = 0; j < 12; j++) { b.set(gx, gy + j, PAL.G6); b.set(gx + 4, gy + j, PAL.G4); for (let i = 1; i < 4; i++) b.set(gx + i, gy + j, j > 3 ? (i === 1 ? PAL.C7 : PAL.C6) : PAL.G5); }
  for (let i = 1; i < 4; i++) b.set(gx + i, gy + 4, PAL.C8);
  // the tile: flat · popped up like a toast (sc 6 phrase 4) · the hole
  const t = G.tile;
  if (st.tile === 1) { rect(t.x, t.y - 6, t.w, t.h, b.ink(PAL.N2)); rect(t.x, t.y - 6, t.w, 1, b.ink(PAL.G2)); rect(t.x, t.y, t.w, t.h, b.ink(PAL.R1)); rect(t.x + 2, t.y + 2, t.w - 4, t.h - 4, b.ink(PAL.R2)); }
  if (st.tile === 'hole') { rect(t.x, t.y, t.w, t.h, b.ink(PAL.N0)); rect(t.x + 4, t.y + 3, t.w - 8, t.h - 5, b.ink(PAL.R0)); rect(t.x, t.y, t.w, 1, b.ink(PAL.N1)); }
};

// ------------------------------------------------------------------ v3.1: the warm practicals' map, background life
/** the wide's background life: a passer-by crossing the corridor's lit far end (a backlit silhouette, two walk drawings
 *  on 4s), a far-row monitor's screensaver (a dim screen, a bar stepping down it) that flickers now and then, a car's
 *  light crossing the bridge in the bay window */
const wideLife = (b: Buf, f: number, life: NonNullable<LaunchWideState['life']>) => {
  const h = G.hall;
  if (typeof life.passer === 'number' && life.passer >= 0 && life.passer <= 1) {
    const fx0 = h.x0 + 10, fx1 = h.x1 - 8, fy1 = G.floorY - 24;
    const px = Math.round(h.x0 - 4 + life.passer * (h.x1 - h.x0 + 8)), step = Math.floor(f / 4) % 2;
    const inHall = (x: number, y: number) => x >= h.x0 && x < h.x1 && y >= h.y0 && y < G.floorY;
    // 26 px tall at the corridor's middle distance: head, shoulders, a bag strap, two legs
    const fig: Array<[number, number, number, number]> = [[-1, -26, 3, 3], [-2, -23, 5, 9], [-2, -14, 2, 8 - step], [1, -14, 2, 8 - (1 - step)]];
    for (const [dx, dy, w, hh] of fig) for (let j = 0; j < hh; j++) for (let i = 0; i < w; i++) { const X = px + dx + i, Y = fy1 + 6 + dy + j; if (inHall(X, Y)) b.set(X, Y, (j === 0 && dy <= -23) ? PAL.W3 : PAL.W0); }
    void fx0; void fx1;
  }
  if (life.flicker) {
    // the far row's second monitor (x 186, y 98, 16 x 12) left on: a dim screensaver, a bright bar stepping down it,
    // and on rare held frames the whole screen flickering a rung up
    const mx = 186, my = 98;
    const flick = hash(Math.floor(f / 3), 5, 78) < 0.05;
    for (let j = 1; j < 11; j++) for (let i = 1; i < 15; i++) b.set(mx + i, my + j, flick ? PAL.C3 : bayer(i, j) < 0.3 ? PAL.C1 : PAL.C0);
    const bar = my + 1 + (Math.floor(f / 8) % 10);
    for (let i = 1; i < 15; i++) b.set(mx + i, bar, PAL.C4);
  }
  if (life.car) {
    // a car's light on the bridge (the window's view: the deck under the chain), one pixel every 4 frames, repeating
    const w = G.win, hz = w.y0 + Math.round((w.y1 - w.y0) * 0.56);
    const cx = w.x0 + 44 + (Math.floor(f / 4) % 48);
    if (cx < w.x1) { b.set(cx, hz - 4, PAL.W8); b.set(cx - 1, hz - 4, PAL.W5); }
  }
};

// ------------------------------------------------------------------ the MEDIUM-scale back wall (a 960 px panorama)
/** where things are on the medium panorama (world x), for the medium setups and their figures */
export const LAUNCH_M = {
  W: 960,
  floorY: 176,
  win: {x0: 20, x1: 196, y0: 30, y1: 150},
  hall: {x0: 230, x1: 290, y0: 60},
  board: {x0: 560, x1: 752, y0: 64, y1: 164},
  neon: {x: 596, y: 30},
  glass: {x0: 780, x1: 960, y0: 24},
  /** Alyi's reflection slot in the glass: the pane his doorway reflects into */
  alyi: [846, 48] as [number, number],
};
const GM = LAUNCH_M;
const backMs: Record<number, Buf> = {};
const paintBackM = (warm = 0) => {
  if (backMs[warm]) return backMs[warm];
  const mb = new MatBuf(GM.W, RH);
  const P = (mat: string, lvl = 0) => mb.mat(mat, lvl), S = (d: number) => mb.shade(d);
  rect(0, 0, GM.W, 14, P(CEIL, 0)); rect(0, 12, GM.W, 3, P(TRIM, 0.4));
  rect(0, 15, GM.W, GM.floorY - 15, P(warm ? WALLW : WALL, 0));
  for (let y = 15; y < GM.floorY - 6; y++) for (let x = 0; x < GM.W; x++) if (hash(x, y, 8) < 0.003) S(-0.5)(x, y);
  rect(0, GM.floorY - 7, GM.W, 7, P(TRIM, -0.4)); rect(0, GM.floorY - 7, GM.W, 1, S(0.8));
  rect(0, GM.floorY, GM.W, RH - GM.floorY, P(CARPET, 0));
  for (const y of [GM.floorY + 8, GM.floorY + 19]) rect(0, y, GM.W, 1, S(-0.8));
  const w = GM.win;
  rect(w.x0 - 6, w.y0 - 6, w.x1 - w.x0 + 13, w.y1 - w.y0 + 13, P(TRIM, 0.6)); rect(w.x0 - 6, w.y0 - 6, w.x1 - w.x0 + 13, 2, S(1));
  rect(w.x0 - 9, w.y1 + 6, w.x1 - w.x0 + 19, 4, P(TRIM, 1));
  const h = GM.hall;
  rect(h.x0 - 6, h.y0 - 6, h.x1 - h.x0 + 12, GM.floorY - h.y0 + 6, P(TRIM, 0.8));
  const bd = GM.board;
  rect(bd.x0 - 4, bd.y0 - 4, bd.x1 - bd.x0 + 8, bd.y1 - bd.y0 + 8, P(STEEL, 0.4)); rect(bd.x0 - 4, bd.y0 - 4, bd.x1 - bd.x0 + 8, 1, S(1));
  rect(bd.x0, bd.y0, bd.x1 - bd.x0, bd.y1 - bd.y0, P(WHITE, 0.3));
  rect(bd.x0 + 16, bd.y1 + 4, bd.x1 - bd.x0 - 32, 3, P(STEEL, 0));
  const gl = GM.glass;
  rect(gl.x0 - 4, gl.y0 - 6, GM.W - gl.x0 + 4, 6, P(TRIM, 0.2));
  rect(gl.x0, gl.y0, GM.W - gl.x0, GM.floorY - gl.y0, P(GLASS, 0));
  // behind the glass, the dark conference room: the far wall's base, the long table's edge, chair backs
  rect(gl.x0, GM.floorY - 26, GM.W - gl.x0, 26, P(CARPET, -1.4));
  rect(gl.x0 + 10, GM.floorY - 44, GM.W - gl.x0 - 20, 6, P(DARK, 0.6)); rect(gl.x0 + 10, GM.floorY - 44, GM.W - gl.x0 - 20, 1, S(0.8));
  for (let k = 0; k < 5; k++) rect(gl.x0 + 24 + k * 32, GM.floorY - 62, 18, 18, P(DARK, 0.3));
  for (const mx of [gl.x0, gl.x0 + 60, gl.x0 + 120]) rect(mx - 2, gl.y0, 5, GM.floorY - gl.y0, P(TRIM, 0.4));
  for (let y = 118; y < 126; y++) for (let x = gl.x0 + 3; x < GM.W; x++) if ((x + y * 2) % 4 === 0) P(WHITE, -1.4)(x, y);
  const lights = {
    amb: (x: number, y: number) => { let a = 2.4; const d = Math.hypot((x - 340) / 380, (y - 60) / 240); if (d < 1) a += (1 - d) * 1.4; if (y >= GM.floorY) a -= 0.6; return a; },
    cyan: (x: number, y: number) => { const d = Math.hypot((x - 640) / 110, (y - 50) / 70); return d < 1 ? (1 - d) * 0.5 : 0; },
    warm: (x: number, y: number) => {
      let L = 0;
      if (y >= GM.floorY) { const u = (x - (h.x0 - 10)) / (h.x1 - h.x0 + 70 + (warm ? 60 : 0)); L = u > 0 && u < 1 ? 0.55 * (1 - Math.pow(Math.abs(u - 0.4) * 2, 2) * 0.7) : 0; }
      else if (x > h.x0 - 28 && x < h.x1 + 30 + (warm ? 30 : 0) && y > h.y0 - 20) { const dd = Math.min(Math.abs(x - h.x0), Math.abs(x - h.x1)) / (warm ? 40 : 28); L = Math.max(0, 0.7 - dd * 0.6); }
      if (warm) {
        // v3.1: Mas's desk lamp (he sits in front of this stretch of wall, x ~330-470): its pool up the wall behind him
        // and on the carpet; a softer spill onto the board's left edge
        const d = Math.hypot((x - 420) / 240, (y - 96) / 100);
        if (d < 1 && y < GM.floorY) L = Math.max(L, (1 - d) * 0.58);
        const d2 = Math.hypot((x - 580) / 90, (y - 110) / 60);
        if (d2 < 1) L = Math.max(L, (1 - d2) * 0.3);
      }
      return L;
    },
    dither: 0.65,
  };
  const buf = new Buf(GM.W, RH, PAL.N0);
  resolve(mb, lights, buf, 0);
  drawBayNight(buf, w.x0, w.y0, w.x1, w.y1, 2);
  rect(Math.round((w.x0 + w.x1) / 2) - 1, w.y0, 4, w.y1 - w.y0 + 1, buf.ink(PAL.N3)); rect(w.x0, w.y0 + 58, w.x1 - w.x0 + 1, 2, buf.ink(PAL.N3));
  const fx0 = h.x0 + 20, fx1 = h.x1 - 16, fy0 = h.y0 + 36, fy1 = GM.floorY - 40;
  for (let y = h.y0; y < GM.floorY; y++) for (let x = h.x0; x < h.x1; x++) {
    let c: number;
    if (x >= fx0 && x < fx1 && y >= fy0 && y < fy1) c = y < fy0 + 3 ? PAL.W5 : PAL.W6;
    else {
      const dl = x < fx0 ? (x - h.x0) / (fx0 - h.x0) : 9, dr = x >= fx1 ? (h.x1 - 1 - x) / (h.x1 - 1 - fx1) : 9;
      const dt = y < fy0 ? (y - h.y0) / (fy0 - h.y0) : 9, db = y >= fy1 ? (GM.floorY - 1 - y) / (GM.floorY - 1 - fy1) : 9;
      const m = Math.min(dl, dr, dt, db);
      c = m === db ? (bayer(x, y) < 0.5 ? PAL.W4 : PAL.W3) : m === dt ? PAL.W1 : m === dl ? (bayer(x, y) < 0.5 ? PAL.W4 : PAL.W3) : PAL.W2;
    }
    buf.set(x, y, c);
  }
  // the neon at medium scale (the display face)
  const nw = bigTextWidth('NOPE AI');
  for (let j = -4; j < 20; j++) for (let i = -6; i < nw + 6; i++) buf.set(GM.neon.x + i, GM.neon.y + j, stepColor(buf.get(GM.neon.x + i, GM.neon.y + j), -1));
  bigText(buf, 'NOPE AI', GM.neon.x + 1, GM.neon.y + 1, PAL.C3);
  bigText(buf, 'NOPE AI', GM.neon.x, GM.neon.y, PAL.C6);
  for (let y = GM.neon.y; y < GM.neon.y + 16; y++) for (let x = GM.neon.x; x < GM.neon.x + nw; x++) if (buf.get(x, y) === PAL.C6 && buf.get(x, y + 1) === PAL.C6 && buf.get(x, y - 1) !== PAL.C6) buf.set(x, y, PAL.C8);
  // the glass's sheen
  for (let y = gl.y0; y < GM.floorY - 26; y++) for (let x = gl.x0 + 3; x < GM.W; x++) { const u = (x - gl.x0) % 60 + (y - gl.y0) * 0.5; if ((u > 26 && u < 30) || (u > 38 && u < 40)) buf.set(x, y, stepColor(buf.get(x, y), 1)); }
  if (warm) {
    // the lamp's reflection in the conference glass (a warm smear low in the panes, reversed) and the hall's brighter
    // lick on its near jamb
    // a lamp seen far off in the glass: a small hot point, a sparse halo (never a glow blob: it read as fire)
    for (let y = 128; y < 142; y++) for (let x = 830; x < 846; x++) { const d = Math.hypot(x - 838, y - 135); if (d < 1.2) buf.set(x, y, PAL.W7); else if (d < 6 && bayer(x, y) < (1 - d / 6) * 0.35) buf.set(x, y, stepColor(buf.get(x, y), 1)); }
  }
  backMs[warm] = buf;
  return backMs[warm];
};
export interface LaunchMState {
  underlines?: number;
  wet?: number;
  /** Alyi's reflection in the glass: 'there' (his launch-night stillness), 'gone' (the doorway empty), a speaking state,
   *  or 'reading' (sc 12: he holds a page and reads it, not looking at Mas) */
  alyi?: 'there' | 'gone' | 'reading' | 'phone' | (Partial<AlyiSpeakState> & {soft?: boolean});
  /** blur the panorama by stepping it toward its mids (a soft background behind a close figure), 0..2 */
  soft?: number;
  /** v3.1 (opt-in): the room warmed one step by its practicals (the desk lamp's pool on the wall behind Mas, the hall
   *  reaching further, the lamp's reflection in the glass) */
  warm?: 0 | 1;
  /** v3.1 (opt-in, mood §4 #4): a face light on Alyi's reflection, face only, in ramp steps (1 or 2) */
  faceLight?: number;
  /** v3.1: what the phone in his reflected hand shows ('phone' state): the pause letter (draft 6) · EMIT's page
   *  (draft 7, 12.05) */
  phonePage?: 'letter' | 'emit';
}
/** which pixels of Alyi's reflection are his face (skin in the source portrait), mirrored as the reflection is */
const ALYI_FACE = new Map<string, Uint8Array>();
export const alyiFaceMask = (s: AlyiSpeakState): Uint8Array => {
  const key = `${s.mouth}|${s.eyes}|${s.t % 1000}`;
  let m = ALYI_FACE.get(key);
  if (m) return m;
  const src = alyiSpeakPortrait({mouth: s.mouth, eyes: s.eyes, t: s.t});
  m = new Uint8Array(src.w * src.h);
  for (let y = 0; y < src.h; y++) for (let x = 0; x < src.w; x++) { const v = src.c[y * src.w + (src.w - 1 - x)]; if (v < 0) continue; const fm = familyOf(v); if (fm && (fm[0] === 'S' || fm[0] === 'K' || fm[0] === 'X') && y < 100) m[y * src.w + x] = 1; }
  if (ALYI_FACE.size > 400) ALYI_FACE.clear();
  ALYI_FACE.set(key, m);
  return m;
};
/** the phone in his reflected hand: its page (the pause letter, or EMIT's: the teal band, the gold line, headline bars) */
const phonePage = (b: Buf, px: number, py: number, w: number, h: number, page: 'letter' | 'emit', clip: (X: number) => boolean) => {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const X = px + i, Y = py + j;
    if (!clip(X)) continue;
    const edge = i === 0 || i === w - 1 || j === 0 || j === h - 1;
    let c: number;
    if (edge) c = PAL.N0;
    else if (page === 'emit') c = j < 5 ? PAL.C2 : j === 5 ? PAL.W7 : (j >= 7 && j <= 13 && j % 2 === 1 && i > 1 && i < w - 3) ? PAL.N2 : (j > 15 && j % 3 === 0 && i > 1 && i < w - 2) ? PAL.G5 : PAL.P2;
    else c = j < (h >= 26 ? 7 : 6) ? PAL.G3 : j % 3 === 0 && i > 2 && i < w - 3 ? PAL.G6 : PAL.P1;
    b.set(X, Y, c);
  }
};
/** Paint the medium panorama's window x camX..camX+479 into rows 0..202 of b, with the board's ink and the glass's
 *  reflection. */
export const launchBackM = (b: Buf, camX: number, st: LaunchMState = {}) => {
  const src = paintBackM(st.warm ?? 0);
  const cx = clamp(Math.round(camX), 0, GM.W - 480);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.c[y * b.w + x] = src.c[y * GM.W + cx + x];
  const bd = GM.board;
  if (bd.x1 > cx && bd.x0 < cx + 480) boardInk(b, bd.x0 - cx, bd.y0, bd.x1 - bd.x0, 2, st.underlines ?? 2, st.wet ?? 1);
  // Alyi's reflection: his speaking portrait mirrored into the dark glass (alyi-speak's reflection drawing), clipped to
  // the panes; 'reading' holds a page up in the reflection, his eyes down on it
  if (st.alyi && st.alyi !== 'gone') {
    const s: AlyiSpeakState = {...ALYI_SPEAK_DEFAULT, ...(typeof st.alyi === 'object' ? st.alyi : {})};
    const es: AlyiSpeakState = {...s, eyes: st.alyi === 'reading' || st.alyi === 'phone' ? 'closed' : s.eyes};
    const img = alyiReflection(es);
    const fl = st.faceLight ?? 0, fm = fl ? alyiFaceMask(es) : null;
    const [ax, ay] = GM.alyi;
    for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) {
      const c = img.c[j * img.w + i];
      if (c < 0) continue;
      const X = ax - cx + i, Y = ay + j;
      if (X < 0 || X >= 480 || Y >= GM.floorY - 26 || X + cx < GM.glass.x0 + 3) continue;
      const L = lightness(c);
      const k = typeof st.alyi === 'object' && st.alyi.soft ? 1 : 2;
      b.set(X, Y, stepColor(b.get(X, Y), (L > 0.3 ? k : L > 0.16 ? 1 : 0) + (fm && fm[j * img.w + i] ? fl : 0)));
    }
    if (st.alyi === 'phone') {
      // draft 6 (12.05): he reads the pause letter on his phone, reflected: a lit slab at his chest, the page's white
      // with its dark header band; its glow a rung up on his chin in the glass. Draft 7: EMIT's page (st.phonePage)
      const px = ax - cx + 46, py = ay + 84;
      phonePage(b, px, py, 13, 22, st.phonePage ?? 'letter', (X) => X >= 0 && X < 480 && X + cx >= GM.glass.x0 + 3);
      for (let i = 40; i < 64; i++) { const X = ax - cx + i, Y = ay + 80; if (X >= 0 && X < 480) b.set(X, Y, stepColor(b.get(X, Y), 1)); }
    }
    if (st.alyi === 'reading') {
      // the page he holds, reflected: a pale sheet at his chest, a headline band on it (no legible words)
      const px = ax - cx + 34, py = ay + 86;
      for (let j = 0; j < 30; j++) for (let i = 0; i < 40; i++) { const X = px + i, Y = py + j; if (X >= 0 && X < 480 && X + cx >= GM.glass.x0 + 3) b.set(X, Y, stepColor(b.get(X, Y), j < 6 ? 3 : (j % 4 === 0 && i > 3 && i < 36) ? 1 : 2)); }
    }
  }
  const soft = st.soft ?? 0;
  if (soft) for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) if (bayer(x, y) < 0.35 * soft) { const c = b.get(x, y); const L = lightness(c); b.set(x, y, stepColor(c, L > 0.35 ? -1 : L < 0.1 ? 1 : 0)); }
};

// ------------------------------------------------------------------ the medium setups
/** the lit band's parked cursor over the button (the fuse): the adventure pointer, an arrow */
const ARROW = ['o.........', 'oo........', 'o#o.......', 'o##o......', 'o###o.....', 'o####o....', 'o#####o...', 'o######o..', 'o#######o.', 'o########o', 'o#####oooo', 'o##o##o...', 'o#o.o##o..', 'oo..o##o..', 'o....o##o.', '.....o##o.', '......oo..'];
export const drawCursor = (b: Buf, x: number, y: number) => ARROW.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = r[i] === 'o' ? PAL.N0 : r[i] === '#' ? PAL.P2 : -1; if (c >= 0) b.set(x + i, y + j, c); } });

/** a portrait/bust image placed with its chest continued to the frame's bottom, the continuation falling into shadow
 *  (one rung down after 6 rows, two after 14) so it reads as the body leaving the light, not as a box */
export const putBust = (b: Buf, img: Img, x: number, y: number, o: {flip?: boolean; map?: (c: number) => number} = {}) => {
  blitImg(b, img, x, y, {flip: o.flip, map: o.map});
  for (let i = 0; i < img.w; i++) {
    const c0 = img.c[(img.h - 1) * img.w + (o.flip ? img.w - 1 - i : i)];
    if (c0 < 0) continue;
    const c = o.map ? o.map(c0) : c0;
    for (let yy = y + img.h, k = 0; yy < RH; yy++, k++) b.set(x + i, yy, stepColor(c, k < 6 ? 0 : k < 14 ? -1 : -2));
  }
};
/** the show's OTS shoulder (Act Four's grammar): his portrait as a silhouette one rung off black, a 1 px rim on the edge
 *  that faces the light; flip = he faces right (toward whoever the OTS looks at) */
export const otsShoulder = (b: Buf, x: number, y: number, rim: number, o: {flip?: boolean} = {}) => {
  const img = masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'monitor'});
  const cov = (i: number, j: number) => i >= 0 && j >= 0 && i < img.w && j < img.h && img.c[j * img.w + (o.flip ? img.w - 1 - i : i)] >= 0;
  for (let j = 0; j < img.h + 60; j++) for (let i = 0; i < img.w; i++) {
    const jj = Math.min(j, img.h - 1);
    if (!cov(i, jj)) continue;
    const Y = y + j;
    if (Y >= RH) break;
    const edge = o.flip ? !cov(i + 1, jj) : !cov(i - 1, jj);
    b.set(x + i, Y, edge && j < img.h ? rim : j < 40 && hash(i, j, 3) < 0.04 ? PAL.N2 : PAL.N1);
  }
};

export interface Launch2SState extends LaunchMState {
  mas?: Partial<MasMediumState>;
  gerg?: Partial<GergMediumState>;
  /** v3.1 (opt-in, 5.07: the board seed): Rima at the whiteboard behind Gerg, her back to us, at the panorama's scale:
   *  the third underline (st.wet draws it), capping the marker; null / unset = not in the frame (v3) */
  rima?: RimaBoardPose | null;
  /** the cursor parked on the button (the fuse) until the click */
  cursor?: boolean;
  laptop?: 'dark' | 'chat';
  collars?: number;
  /** v3.1: the collars' drawing (mas-collars.ts 'v31': taller points, the third in gold) */
  collarStyle?: 'v31';
}
/** [2S] Mas (frame left, his dark laptop and the button in the foreground) and Gerg across the aisle (frame right, his
 *  laptop's green under his chin); behind Gerg the edge of Rima's whiteboard. */
export const drawLaunch2S = (b: Buf, f: number, st: Launch2SState = {}) => {
  launchBackM(b, 330, {...st, soft: st.soft ?? 1});
  if (st.rima) {
    // Rima at the board behind Gerg (panorama scale), the marker's tip on the third underline while she draws it; a
    // rung soft (she is behind the two of them)
    // she stays put (anchored where the third underline starts); her arm draws it (reach follows st.wet)
    const uw = textWidth('LOW-KEY') + 3, lx = LAUNCH_M.board.x0 - 330 + 10 + textWidth('LAUNCH: ');
    const tipY = LAUNCH_M.board.y0 + 21 + 6;
    const rx = lx - 1 - RIMA_BOARD_LINE0[0], ry = tipY - RIMA_BOARD_LINE0[1];
    const pose: RimaBoardPose = st.rima.body === 'underline' ? {reach: Math.min(1, (uw * (st.wet ?? 1)) / 42), ...st.rima} : st.rima;
    drawRimaBoard(b, rx, ry, pose, {map: (c) => stepColor(c, -1)});
  }
  if (st.warm) {
    // v3.1: Mas's desk lamp at the frame's left edge: its warm spill on the wall behind and the desk top
    for (let y = 60; y < 176; y++) for (let x = 0; x < 150; x++) { const d = Math.hypot((x - 10) / 140, (y - 150) / 90); if (d < 1 && bayer(x, y) < (1 - d) * 0.5) b.set(x, y, stepColor(b.get(x, y), 1)); }
  }
  // Gerg behind his desk across the aisle: his laptop's lid back toward us, its green on his chin and chest
  const g = gergMedium({...GERG_MEDIUM_DEFAULT, type: gergTypeAt(f), ...st.gerg});
  const gx = 300, gy = 66;
  for (let j = 0; j < g.h; j++) for (let i = 0; i < g.w; i++) { const c = g.c[j * g.w + i]; if (c >= 0) b.set(gx + i, gy + j, toGreenGlow(c)); }
  for (let y = 142; y < RH; y++) for (let x = 262; x < 480; x++) b.set(x, y, y < 146 ? (y === 142 ? PAL.G3 : PAL.G2) : y < 150 ? PAL.N2 : bayer(x, y) < 0.4 ? PAL.N1 : PAL.N2);
  poly([288, 142, 332, 142, 336, 110, 292, 110], b.ink(PAL.G1)); line(292, 110, 336, 110, b.ink(PAL.G3));
  for (let y = 110; y < 142; y++) b.set(335 - Math.round((y - 110) * 0.12), y, PAL.L2); // the screen's green edge light
  greenPool(b, 348, 128, 34, 16, 0.35);
  // Mas in the foreground at frame left, turned to Gerg (flipped), at his end desk; lit by the room (his laptop is dark)
  const ms: MasMediumState = {...MAS_MEDIUM_DEFAULT, light: (st.laptop ?? 'dark') === 'chat' ? 'monitor' : 'warm', head: '34', look: 1, arm: 'rest', ...st.mas};
  const mx = 40, my = 58;
  drawMasMedium(b, mx, my, ms, {flip: true, desk: (bb) => {
    for (let y = my + MAS_M_DESK; y < RH; y++) for (let x = 0; x < 250; x++) bb.set(x, y, y === my + MAS_M_DESK ? PAL.G4 : y < my + MAS_M_DESK + 3 ? PAL.G3 : y < my + MAS_M_DESK + 5 ? PAL.G2 : bayer(x, y) < 0.3 ? PAL.N2 : PAL.N1);
  }});
  drawCollarsMedium(b, mx, my, st.collars ?? 2, {flip: true, light: ms.light === 'monitor' ? 'monitor' : 'warm', style: st.collarStyle});
  const dy = my + MAS_M_DESK;
  if (st.warm) {
    // the lamp's pool on his desk top and a key on his face from his left (face only, one rung; the rim one more)
    faceKey(b, mx, my, mx + MAS_MW, my + 44, 1, -1);
    for (let y = dy; y < RH; y++) for (let x = 0; x < 200; x++) { const d = Math.hypot((x - 30) / 170, (y - dy) / 40); if (d < 1 && bayer(x, y) < (1 - d) * 0.8) b.set(x, y, familyOf(b.get(x, y))?.[0] === 'G' ? stepColor(b.get(x, y), 1) : b.get(x, y)); }
    deskLampM(b, 2, dy - 30);
    // Gerg's green on his face a rung up (his screen's spill: the one light he works by)
    faceKey(b, 300, 66, 384, 112, 1, 1);
  }
  if ((st.laptop ?? 'dark') === 'dark') { poly([10, dy + 14, 90, dy + 14, 96, dy + 22, 4, dy + 22], b.ink(PAL.G1)); rect(10, dy + 14, 80, 1, b.ink(PAL.G3)); }
  drawBeigeButton(b, 150, dy + 14, {scale: 'medium'});
  if (st.cursor) drawCursor(b, 168, dy + 16);
};
/** Mas's desk lamp at medium scale (an anglepoise's shade tipped over the desk, its bulb's hot rim), top-left (x, y) */
export const deskLampM = (b: Buf, x: number, y: number) => {
  line(x + 2, y + 30, x + 6, y + 12, b.ink(PAL.G1)); line(x + 3, y + 30, x + 7, y + 12, b.ink(PAL.G2));
  line(x + 6, y + 12, x + 16, y + 4, b.ink(PAL.G1));
  for (let j = 0; j < 10; j++) for (let i = -2; i <= 6 + j; i++) b.set(x + 14 + i, y + 2 + j, j === 9 ? PAL.W7 : i < 0 ? PAL.G2 : PAL.G1);
  rect(x + 15, y + 11, 12, 1, b.ink(PAL.W8)); b.set(x + 20, y + 12, PAL.W9); b.set(x + 21, y + 12, PAL.W8);
  rect(x - 2, y + 30, 12, 3, b.ink(PAL.N1)); rect(x - 1, y + 30, 10, 1, b.ink(PAL.G2));
};

export interface LaunchOTSRimaState extends LaunchMState {
  rima?: Partial<RimaPortraitState>;
  cursor?: boolean;
}
/** [OTS] over his shoulder onto Rima, standing at his desk: LOW-KEY behind her, Alyi small and soft in the glass */
export const drawLaunchOTSRima = (b: Buf, f: number, st: LaunchOTSRimaState = {}) => {
  launchBackM(b, 470, {...st, alyi: st.alyi ?? {soft: true}, soft: st.soft ?? 1});
  const img = rimaSpeakPortrait({...RIMA_PORTRAIT_DEFAULT, ...st.rima});
  putBust(b, img, 232, 44, {flip: true});
  // v3.1 warm: she stands at his desk, in his desk lamp's light: a key on her face from frame left (face only)
  if (st.warm) faceKey(b, 232, 44, 344, 128, 1, -1);
  otsShoulder(b, -44, 64, st.warm ? PAL.W4 : PAL.C4, {flip: true});
  drawBeigeButton(b, 150, 188, {scale: 'medium'});
  if (st.cursor) drawCursor(b, 168, 190);
};

// the close glass: the conference wall's dark panes filling the frame, the room's lights reflected in it (the neon's
// cyan smear, a lamp), mullions; the reflection lives in the middle pane
let glassClose: Buf | null = null;
const paintGlassClose = () => {
  if (glassClose) return glassClose;
  const mb = new MatBuf(480, RH);
  rect(0, 0, 480, RH, mb.mat(GLASS, 0));
  rect(0, 150, 480, 53, mb.mat(CARPET, -1.4));
  rect(40, 124, 400, 8, mb.mat(DARK, 0.6)); rect(40, 124, 400, 1, mb.shade(0.8));
  for (let k = 0; k < 6; k++) rect(56 + k * 64, 98, 28, 26, mb.mat(DARK, 0.3));
  for (const mx of [70, 250, 430]) rect(mx - 4, 0, 8, RH, mb.mat(TRIM, 0.4));
  for (let y = 104; y < 112; y++) for (let x = 0; x < 480; x++) if ((x + y * 2) % 4 === 0) mb.mat(WHITE, -1.4)(x, y);
  const buf = new Buf(480, RH, PAL.N0);
  resolve(mb, {amb: () => 2.6, cyan: (x, y) => { const d = Math.hypot((x - 120) / 120, (y - 40) / 60); return d < 1 ? (1 - d) * 0.45 : 0; }, warm: (x, y) => { const d = Math.hypot((x - 420) / 90, (y - 160) / 70); return d < 1 ? (1 - d) * 0.35 : 0; }, dither: 0.6}, buf, 0);
  // reflections on the glass: the neon's cyan smear (reversed, unreadable), a lamp's bar, sheen streaks
  for (let y = 26; y < 36; y++) for (let x = 90; x < 170; x++) if (bayer(x, y) < 0.5 - Math.abs(y - 31) * 0.08) buf.set(x, y, PAL.C3);
  rect(300, 8, 60, 2, buf.ink(PAL.G3));
  for (let y = 0; y < 150; y++) for (let x = 0; x < 480; x++) { const u = (x % 180) + y * 0.5; if ((u > 60 && u < 64) || (u > 76 && u < 78)) buf.set(x, y, stepColor(buf.get(x, y), 1)); }
  glassClose = buf;
  return glassClose;
};

export interface LaunchGlassState extends LaunchMState {
  /** sc 5.09: Mas soft in the foreground at frame left, his hand on the button · 'bent' (sc 12.05): bent over his
   *  sheet, writing, not looking up */
  mas?: boolean | 'bent';
  /** sc 5.09: Rima at the board with her back to them, capping the marker (room scale, nearer) */
  rima?: Partial<RimaStandPose> | null;
  /** v3.1 (opt-in, 5.09's shot note): 'glass' racks focus to the reflection on Alyi's first word: his face lit
   *  (faceLight 2 unless set), Rima softened out of focus. Unset = v3's frame */
  rack?: 'glass';
}
/** [MCU·glass] alone: the close glass with Alyi's reflection in its doorway, centred. With st.mas / st.rima: sc 5.09's
 *  frame (the panorama: Mas soft in the fg at frame left, Rima at the board, the glass beyond) */
export const drawLaunchGlass = (b: Buf, f: number, st: LaunchGlassState = {}) => {
  const composite = st.mas || st.rima;
  if (!composite) {
    const src = paintGlassClose();
    for (let y = 0; y < RH; y++) b.c.set(src.c.subarray(y * 480, (y + 1) * 480), y * b.w);
    const alyi = st.alyi ?? 'there';
    if (alyi === 'gone') return;
    const s: AlyiSpeakState = {...ALYI_SPEAK_DEFAULT, ...(typeof alyi === 'object' ? alyi : {})};
    const es: AlyiSpeakState = {...s, eyes: alyi === 'reading' || alyi === 'phone' ? 'closed' : s.eyes};
    const img = alyiReflection(es);
    const fl = st.faceLight ?? 0, fm = fl ? alyiFaceMask(es) : null;
    const ax = 184, ay = 22;
    if (st.warm) {
      // v3.1: the desk lamp behind the camera, reflected low in the glass beside him (a warm smear)
      for (let y = 116; y < 136; y++) for (let x = 350; x < 370; x++) { const d = Math.hypot(x - 360, y - 126); if (d < 1.5) b.set(x, y, d < 0.8 ? PAL.W8 : PAL.W6); else if (d < 8 && bayer(x, y) < (1 - d / 8) * 0.35) b.set(x, y, stepColor(b.get(x, y), 1)); }
    }
    for (let j = 0; j < img.h + 50; j++) for (let i = 0; i < img.w; i++) {
      const c = img.c[Math.min(j, img.h - 1) * img.w + i];
      if (c < 0) continue;
      const X = ax + i, Y = ay + j;
      if (Y >= 150) continue;
      const L = lightness(c);
      b.set(X, Y, stepColor(b.get(X, Y), (j >= img.h ? 0 : L > 0.3 ? 3 : L > 0.16 ? 2 : L > 0.08 ? 1 : 0) + (fm && j < img.h && fm[j * img.w + i] ? fl : 0)));
    }
    if (alyi === 'phone') {
      const px = ax + 48, py = ay + 88;
      phonePage(b, px, py, 15, 26, st.phonePage ?? 'letter', () => true);
      for (let i = 38; i < 70; i++) b.set(ax + i, ay + 84, stepColor(b.get(ax + i, ay + 84), 1));
    }
    if (alyi === 'reading') {
      const px = ax + 34, py = ay + 92;
      for (let j = 0; j < 34; j++) for (let i = 0; i < 44; i++) b.set(px + i, py + j, stepColor(b.get(px + i, py + j), j < 7 ? 3 : (j % 4 === 0 && i > 3 && i < 40) ? 1 : 2));
    }
    return;
  }
  const rack = st.rack === 'glass';
  launchBackM(b, 460, {...st, alyi: st.alyi ?? 'there', faceLight: st.faceLight ?? (rack ? 2 : 0)});
  if (st.rima) {
    const rp: RimaStandPose = {...RIMA_STAND_DEFAULT, body: 'cap', head: 'back', light: 'board', ...st.rima};
    if (!rack) drawRimaStand(b, 250, 176, rp);
    else {
      // racked off her: out of focus, a rung down on the dither (never a blur of her shape: whole pixels)
      const t = new Buf(480, RH, TRANS);
      drawRimaStand(t, 250, 176, rp);
      for (let i = 0; i < 480 * RH; i++) { const v = t.c[i]; if (v === TRANS) continue; const x = i % 480, y = (i / 480) | 0; b.c[y * b.w + x] = bayer(x, y) < 0.5 ? stepColor(v, -1) : stepColor(v, lightness(v) > 0.35 ? -1 : 0); }
    }
  }
  if (st.mas === 'bent') {
    // sc 12.05: bent over the sheet in the foreground, soft (two rungs toward the dark), his eyes down on it; the desk's
    // edge and the sheet's corner under his chin
    putBust(b, masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'warm', lid: 1, look: 0}), -26, 64, {flip: true, map: (c) => stepColor(c, -2)});
    for (let y = 176; y < RH; y++) for (let x = 0; x < 230; x++) b.set(x, y, y === 176 ? PAL.G3 : bayer(x, y) < 0.3 ? PAL.N2 : PAL.N1);
    rect(96, 178, 110, 25, b.ink(PAL.P0)); rect(96, 178, 110, 1, b.ink(PAL.P1));
  } else if (st.mas) {
    // Mas soft in the foreground: his portrait, two rungs toward the dark (out of focus, out of the light), at the left
    putBust(b, masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'monitor', look: 1}), -30, 48, {flip: true, map: (c) => stepColor(c, -2)});
    drawBeigeButton(b, 70, 190, {scale: 'medium'});
  }
};

export interface LaunchMcuRimaState extends LaunchMState { rima?: Partial<RimaPortraitState> }
/** [MCU] Rima turned from the glass to Mas, waiting: her portrait (MCU scale) right of centre over the soft board */
export const drawLaunchMcuRima = (b: Buf, f: number, st: LaunchMcuRimaState = {}) => {
  launchBackM(b, 500, {...st, soft: 2});
  putBust(b, rimaSpeakPortrait({...RIMA_PORTRAIT_DEFAULT, ...st.rima}), 262, 34, {flip: true});
  if (st.warm) faceKey(b, 262, 34, 374, 118, 1, -1);
};

export interface LaunchMcuMasState {
  mas?: Partial<MasPortraitState>; collars?: number; chat?: boolean;
  /** v3.1 */
  collarStyle?: 'v31';
  /** v3.1: the desk lamp's warm rim on his left (the chat still lights him from below); implies cleanUnder */
  warm?: 0 | 1;
  /** v3.1: the chat's under-light as a clean rim, no dither on skin (v3 dithered his chin: kept as the default for the
   *  v3 renders; every v3.1 layout should set this or warm) */
  cleanUnder?: boolean;
}
/** [MCU] Mas, frame left, lit from below by the chat that has just flattered him; the bullpen soft behind (the bay) */
export const drawLaunchMcuMas = (b: Buf, f: number, st: LaunchMcuMasState = {}) => {
  launchBackM(b, 330, {soft: 2, alyi: 'gone', warm: st.warm});
  const s: MasPortraitState = {...MAS_PORTRAIT_DEFAULT, light: 'monitor', look: 1, ...st.mas};
  const x = 96, y = 34;
  putBust(b, masPortrait(s), x, y);
  // v3.1 warm: the desk lamp on his left: a warm rim down that side of his face (the chat still lights him from below)
  if (st.warm) warmRim(b, x, y, x + 112, y + 96, -1, 3);
  drawCollarsPortrait(b, x, y, st.collars ?? 2, {head: s.head ?? '34', light: 'monitor', style: st.collarStyle});
  if (st.chat !== false && (st.warm || st.cleanUnder)) {
    // v3.1: the chat's light from below as a clean rim on the undersides (chin, jaw, the nose's underside): no dither
    // on skin (v3's dithered version below is kept for the v3 renders)
    const sk = (c: number) => { const fm = familyOf(c); return !!fm && (fm[0] === 'K' || fm[0] === 'X' || fm[0] === 'S'); };
    const hits: Array<[number, number]> = [];
    for (let yy = y + 56; yy < y + 100; yy++) for (let xx = x + 20; xx < x + 90; xx++) if (sk(b.get(xx, yy)) && !sk(b.get(xx, yy + 1))) hits.push([xx, yy]);
    for (const [xx, yy] of hits) b.set(xx, yy, stepColor(b.get(xx, yy), 2));
    for (let xx = 56; xx < 276; xx++) { b.set(xx, RH - 2, PAL.C6); b.set(xx, RH - 1, PAL.C7); if (bayer(xx, 0) < 0.5) b.set(xx, RH - 3, PAL.C4); }
  } else if (st.chat !== false) {
    // the chat's light from below: his jaw and chin a rung up, the screen's glow along the frame's bottom edge
    for (let yy = y + 60; yy < y + 100; yy++) for (let xx = x + 20; xx < x + 90; xx++) {
      const c = b.get(xx, yy), fam = familyOf(c);
      if (!fam || (fam[0] !== 'K' && fam[0] !== 'X' && fam[0] !== 'S')) continue;
      if (bayer(xx, yy) < (yy - y - 60) / 50) b.set(xx, yy, stepColor(c, 1));
    }
    for (let xx = 56; xx < 276; xx++) { b.set(xx, RH - 2, PAL.C6); b.set(xx, RH - 1, PAL.C7); if (bayer(xx, 0) < 0.5) b.set(xx, RH - 3, PAL.C4); }
  }
};

// ------------------------------------------------------------------ [OTS] over his shoulder onto his laptop (the chat's one setup)
export interface LaunchOTSLaptopState {
  /** v3.1: the room warmed behind the laptop (the panorama's warm variant) */
  warm?: 0 | 1;
  chat?: ChatWindowState;
  /** Rima leaning in at his far side, arms folded (her portrait, cut by the laptop's lid and the frame) */
  rima?: boolean | Partial<RimaPortraitState>;
  /** Gerg's hands typing at the frame's right edge (his keyboard across the aisle) */
  gergHands?: boolean;
  f?: number;
}
/** a hand on a keyboard, simple: a skin block with knuckles and a thumb, on the key row (drawing 0 | 1 | 2 alternate) */
const typingHand = (b: Buf, x: number, y: number, k: number, flip = false) => {
  const H = [['.3444443.', '345555543', '345555544', '.3444443.', '..2..2...'], ['.3444443.', '345555543', '345555544', '.3444443.', '...2..2..'], ['..344443.', '.34555543', '345555544', '.3444443.', '..2...2..']][k % 3];
  const cols: Record<string, number> = {'2': PAL.S2, '3': PAL.S3, '4': PAL.S4, '5': PAL.S5};
  H.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = cols[r[flip ? r.length - 1 - i : i]]; if (c !== undefined) b.set(x + i, y + j, c); } });
};
export const drawLaunchOTSLaptop = (b: Buf, f: number, st: LaunchOTSLaptopState = {}) => {
  // behind the laptop: the bullpen soft (the board side), dim
  launchBackM(b, 520, {soft: 2, alyi: 'gone', underlines: 3, warm: st.warm});
  // Rima behind the laptop's right side, leaning in, arms folded (her portrait, flipped to face the screen)
  if (st.rima) {
    const rs = typeof st.rima === 'object' ? st.rima : {};
    putBust(b, rimaSpeakPortrait({...RIMA_PORTRAIT_DEFAULT, ...rs}), 350, 18, {flip: true});
  }
  // the laptop: the lid's bezel, the screen with the chat window, the deck in perspective below
  const sx = 100, sy = 12, sw = 300, sh = 150;
  rect(sx - 8, sy - 8, sw + 16, sh + 14, b.ink(PAL.N0)); rect(sx - 7, sy - 7, sw + 14, 1, b.ink(PAL.G2));
  drawChatWindow(b, sx, sy, sw, sh, {f, ...st.chat});
  // the screen's cool light on the lid's inner edge and the deck
  poly([sx - 30, 203, sx + sw + 30, 203, sx + sw + 8, sy + sh + 6, sx - 8, sy + sh + 6], b.ink(PAL.G1));
  for (let y = sy + sh + 6; y < 203; y++) for (let x = sx - 30; x < sx + sw + 30; x++) if (b.get(x, y) === PAL.G1 && (y - sy - sh) % 5 === 0 && (x + y) % 6 < 4) b.set(x, y, PAL.N2);
  for (let x = sx - 8; x < sx + sw + 8; x++) b.set(x, sy + sh + 6, PAL.C4);
  // Gerg's hands at the frame's right edge, typing on his own keys
  if (st.gergHands) { rect(430, 184, 50, 19, b.ink(PAL.N1)); for (let x = 432; x < 480; x += 4) rect(x, 186, 3, 2, b.ink(PAL.N3)); typingHand(b, 440, 180, gergTypeAt(f)); typingHand(b, 458, 181, gergTypeAt(f + 5), true); }
  // his shoulder in the foreground at the frame's left edge
  otsShoulder(b, -62, 70, PAL.C5, {flip: true});
};

// ------------------------------------------------------------------ [MCU·PF] 7.01: looking down the hole; the tear
export interface LaunchMcuPFState {
  /** the tear: frames since it welled (0 at the lid, sliding a pixel every 4 f down his cheek), or null */
  tear?: number | null;
  mas?: Partial<MasPortraitState>;
  /** the hole's red light on his face from below (0..2) */
  glow?: number;
  collars?: number;
  /** v3.1 */
  collarStyle?: 'v31';
  /** v3.1 (7.01's shot note): the tear catches the light: its bright pixel the hottest white (one pixel) */
  tearCatch?: boolean;
}
/** the portrait's near eye (the '34' head): the tear wells at its lower lid and slides down the cheek */
export const MAS_TEAR_PATH: Array<[number, number]> = [[42, 53], [42, 54], [41, 55], [41, 56], [41, 57], [40, 58], [40, 59], [40, 60], [39, 61], [39, 62], [39, 63], [38, 64], [38, 65], [38, 66]];
export const drawLaunchMcuPF = (b: Buf, f: number, st: LaunchMcuPFState = {}) => {
  // the fallaway: the bullpen behind him steps down (two rungs toward the dark) while the frame holds on him
  launchBackM(b, 300, {soft: 2, alyi: 'gone', underlines: 3});
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, stepColor(b.get(x, y), -2));
  const s: MasPortraitState = {...MAS_PORTRAIT_DEFAULT, light: 'warm', lid: 1, look: 0, ...st.mas};
  const x = 96, y = 34;
  putBust(b, masPortrait(s), x, y);
  drawCollarsPortrait(b, x, y, st.collars ?? 2, {head: s.head ?? '34', light: 'warm', style: st.collarStyle});
  // the hole's red from below: a clean rim on the undersides of his face (the chin, the jaw line, the nose's underside):
  // any lit skin pixel with shadow or background right under it takes the warm rung. No dither on skin.
  const glow = st.glow ?? 2;
  if (glow) {
    const skin = (c: number) => { const fm = familyOf(c); return !!fm && fm[0] === 'S' && lightness(c) > 0.3; };
    const hits: Array<[number, number]> = [];
    for (let yy = y + 64; yy < y + 86; yy++) for (let xx = x + 10; xx < x + 100; xx++) if (skin(b.get(xx, yy)) && !skin(b.get(xx, yy + 1))) hits.push([xx, yy]);
    for (const [xx, yy] of hits) { b.set(xx, yy, glow >= 2 ? PAL.W5 : PAL.S5); if (glow >= 2 && skin(b.get(xx, yy - 1))) b.set(xx, yy - 1, PAL.S5); }
  }
  if (typeof st.tear === 'number' && st.tear >= 0) {
    const i = Math.min(MAS_TEAR_PATH.length - 1, Math.floor(st.tear / 4));
    const [tx, ty] = MAS_TEAR_PATH[i];
    // the bead: one pixel wide, two tall (bright under, its glint over), and its wet track behind it, a rung up
    for (let k = 0; k < i; k++) { const [px, py] = MAS_TEAR_PATH[k]; b.set(x + px, y + py, stepColor(b.get(x + px, y + py), 1)); }
    b.set(x + tx, y + ty - 1, st.tearCatch ? PAL.W9 : PAL.C9); b.set(x + tx, y + ty, st.tearCatch ? PAL.C8 : PAL.C7);
  }
};
