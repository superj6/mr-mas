// MR. MAS — kit: THE BEIGE BUTTON (Ep1 Act One sc 5: the launch). New file (v3-art-a, 2026-09-27).
// The salvaged art from the cut intro slot (dev/mfinale/callart.ts: `handFig` / `drawButton`, the picture in
// out/pixel/moments/_cut/mfinale-chatgtp.png), PORTED here so shipped code doesn't import a dev folder (the original is
// not edited): Mas's index finger and the tiny beige button on its plate, with the label-maker strip. Changes for the
// launch: the strip is relabelled `research preview` (the salvage read `low-key research preview`), the light is the
// bullpen's night (the working lamp's cool from the top-right, the desk's grey laminate, not the Woodrose's candle and
// cloth), and the button sits in the exact screen position where the 1993 dialog's OK sat (kits/dialog-1993.ts), the
// callback across the intro.
//   drawButtonECU(b, f, {press, lit, finger})    [ECU] the button (press 0 up · 1 touching · 2 down: the click), the LED
//                                                lit after the click; finger false = the button alone (the first ECU)
//   drawBeigeButton(b, x, y, {scale, lit})       the button as a prop on his desk at room scale (8 x 4) or medium
//                                                scale (20 x 9), for the wide and the 2S / OTS foregrounds
//   BUTTON_ECU                                   where the button's cap is in the ECU (the 1993 OK's centre)
import {Buf, rect, ellipse, bayer} from '../px';
import {PAL} from '../palette';
import {text, textWidth} from '../font';
import {FigureDef, LightRig, P, Part, Adjust, Img, renderFigure, blitImg, Prim} from '../figure';
import {DLG1993} from './dialog-1993';

const RH = 203;
/** the 1993 OK button's centre (dialog-1993.ts: OK at x + w - 24 - 52, y + h - 17 - 9, 52 x 17) */
export const BUTTON_ECU: [number, number] = [DLG1993.x + DLG1993.w - 24 - 26, DLG1993.y + DLG1993.h - 9 - 9];
export const BUTTON_LABEL = 'research preview';

// ------------------------------------------------------------------ the hand (callart.ts handFig, re-lit)
const HAND_W = 170, HAND_H = 142;
const HO = [78, 72];
const hp = (...pts: number[]) => P.poly(...pts.map((v, i) => v + HO[i % 2]));
const hl = (x0: number, y0: number, x1: number, y1: number) => P.line(x0 + HO[0], y0 + HO[1], x1 + HO[0], y1 + HO[1]);
const plane = (onlyMat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat});
const handFig = (press: number): FigureDef => {
  const d = press;
  const parts: Part[] = [
    {group: 'sleeve', mat: 'hood', tone: 2, prims: [P.poly(0, 26, 12, 27, 70, 50, 129, 85, 134, 97, 119, 114, 60, 92, 0, 64)]},
    {group: 'cuff', mat: 'cuff', tone: 2, prims: [hp(30, 28, 50, 12, 58, 18, 60, 30, 44, 42, 34, 42)]},
    {group: 'hand', mat: 'skin', tone: 3, prims: [hp(42, 36, 54, 24, 66, 26, 74, 34 + d, 76, 44 + d, 70, 52 + d, 58, 54 + d, 46, 50, 40, 44)]},
    {group: 'thumb', mat: 'skin', tone: 2, prims: [hp(44, 46, 52, 50, 60, 56 + d, 58, 60 + d, 50, 58, 44, 52)]},
    {group: 'finger', mat: 'skin', tone: 3, prims: [hp(66, 38 + d, 72, 34 + d, 84, 48 + d, 88, 56 + d, 86, 60 + d, 81, 60 + d, 76, 52 + d, 68, 44 + d)]},
  ];
  const adjust: Adjust[] = [
    plane('hood', 3, P.poly(0, 26, 12, 27, 70, 50, 129, 85, 127, 90, 66, 58, 0, 36)),
    plane('hood', 4, P.poly(0, 27, 12, 28, 70, 51, 118, 79, 68, 54, 0, 31)),
    plane('hood', 1, P.poly(0, 54, 60, 82, 118, 108, 119, 114, 60, 92, 0, 64)),
    plane('hood', 1, P.line(8, 44, 70, 70), P.line(40, 66, 96, 90)),
    plane('hood', 3, P.line(8, 43, 70, 69)),
    plane('cuff', 3, hp(50, 12, 58, 18, 54, 20, 48, 16)),
    plane('cuff', 1, hp(34, 38, 44, 34, 58, 26, 60, 30, 44, 42, 34, 42)),
    plane('skin', 4, hp(54, 26, 64, 27, 70, 32, 62, 31, 56, 29)),
    plane('skin', 2, hp(46, 48, 58, 52 + d, 68, 51 + d, 72, 49 + d, 70, 53 + d, 58, 55 + d, 46, 51)),
    plane('skin', 4, hp(72, 36 + d, 80, 44 + d, 86, 53 + d, 83, 52 + d, 77, 44 + d, 71, 38 + d)),
    plane('skin', 2, hp(68, 43 + d, 76, 51 + d, 81, 59 + d, 78, 58 + d, 74, 53 + d, 67, 46 + d)),
    plane('skin', 2, hl(60, 34, 64, 40 + d), hl(66, 34 + d, 70, 42 + d)),
  ];
  const stamps: FigureDef['stamps'] = [{x: 82 + HO[0], y: 53 + d + HO[1], rows: ['.nn', 'nNn', 'nN.'], pal: {n: PAL.S4, N: PAL.S6}}];
  return {w: HAND_W, h: HAND_H, parts, adjust, stamps};
};
// the bullpen at night: a cool key from the working lamp (top-right), the hall's tungsten as the back rim
const HAND_RIG: LightRig = {
  key: [0.8, -0.5], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true,
  back: [-0.6, 0.6], backBand: 1, backRamp: {skin: PAL.S2, hood: PAL.G0, cuff: PAL.G0},
  ramps: {
    skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.K4],
    hood: [PAL.N0, PAL.G0, PAL.G2, PAL.G3, PAL.G4, PAL.C5],
    cuff: [PAL.N0, PAL.G1, PAL.G3, PAL.G4, PAL.G5, PAL.C6],
  },
};
const handCache = new Map<number, Img>();
const handImg = (press: number) => { let v = handCache.get(press); if (!v) { v = renderFigure(handFig(press), HAND_RIG); handCache.set(press, v); } return v; };
const HAND_TIP: [number, number] = [85 + HO[0], 61 + HO[1]];

/** the button on its plate (callart.ts drawButton, relabelled and re-lit); (x, y) = the plate's top-left */
const drawPlate = (b: Buf, x: number, y: number, pressed: boolean, lit: boolean) => {
  for (let j = 0; j < 6; j++) for (let i = 0; i < 44; i++) if (bayer(i, j) < 0.7 - j * 0.1) b.set(x - 3 + i, y + 22 + j - 2, PAL.G1);
  rect(x - 2, y + 20, 44, 3, b.ink(PAL.D2));
  rect(x, y, 44, 22, b.ink(PAL.P0)); rect(x, y, 44, 1, b.ink(PAL.P2)); rect(x + 43, y, 1, 22, b.ink(PAL.P2)); rect(x, y + 21, 44, 1, b.ink(PAL.D3));
  rect(x + 1, y + 1, 42, 19, b.ink(PAL.P1));
  const bx = x + 8, by = y + 6 + (pressed ? 1 : 0);
  ellipse(x + 11.5, y + 10.5, 5, 5, b.ink(PAL.D4));
  ellipse(bx + 3.5, by + 3.5, 3.6, 3.6, b.ink(PAL.P2));
  b.set(bx + 2, by + 1, PAL.C9); b.set(bx + 3, by + 1, PAL.C9);
  rect(bx + 1, by + 6, 5, 1, b.ink(PAL.P0));
  rect(x + 20, y + 8, 2, 2, b.ink(lit ? PAL.C8 : PAL.D4));
  if (lit) { b.set(x + 19, y + 8, PAL.C5); b.set(x + 22, y + 9, PAL.C5); }
  const lw = textWidth(BUTTON_LABEL) + 8;
  rect(x - 4, y + 28, lw, 11, b.ink(PAL.N1)); rect(x - 4, y + 38, lw, 1, b.ink(PAL.N0));
  text(b, BUTTON_LABEL, x, y + 30, PAL.P1);
};
export interface ButtonEcuState { press?: 0 | 1 | 2; lit?: boolean; finger?: boolean }
export const drawButtonECU = (b: Buf, f: number, st: ButtonEcuState = {}) => {
  // the desk top at night: grey laminate, the working lamp's cool pool from the top-right, his dark laptop's corner
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const d = Math.hypot((x - 330) / 300, (y - 40) / 200);
    b.set(x, y, bayer(x, y) < (1 - Math.min(1, d)) * 0.8 ? PAL.G3 : bayer(x, y) < 0.3 ? PAL.G1 : PAL.G2);
  }
  for (let y = 0; y < 34; y++) for (let x = 380; x < 480; x++) if (y < 30 - (x - 380) * 0.06) b.set(x, y, y === 29 - Math.round((x - 380) * 0.06) ? PAL.G4 : PAL.N1);
  const [cx, cy] = BUTTON_ECU;
  const px = cx - 11, py = cy - 10;
  const press = st.press ?? 0;
  drawPlate(b, px, py, press === 2, !!st.lit);
  if (st.finger) {
    const img = handImg(press);
    // the fingertip lands on the cap: place the hand so HAND_TIP sits over the cap's centre
    blitImg(b, img, cx - HAND_TIP[0] + 2, cy - HAND_TIP[1] + 2);
  }
  void f;
};

/** the button as a prop on his desk: room scale (a beige nub on a plate, 8 x 4) or medium (20 x 9, the cap and a dark
 *  label strip, unreadable at this size) */
export const drawBeigeButton = (b: Buf, x: number, y: number, o: {scale?: 'room' | 'medium'; lit?: boolean; pressed?: boolean} = {}) => {
  if ((o.scale ?? 'room') === 'room') {
    rect(x, y + 3, 8, 1, b.ink(PAL.D2));
    rect(x, y, 8, 3, b.ink(PAL.P0)); rect(x, y, 8, 1, b.ink(PAL.P1));
    b.set(x + 2, y + (o.pressed ? 1 : 0), PAL.P2); b.set(x + 3, y + (o.pressed ? 1 : 0), PAL.P2);
    if (o.lit) b.set(x + 6, y + 1, PAL.C8);
    return;
  }
  rect(x - 1, y + 7, 22, 2, b.ink(PAL.D2));
  rect(x, y, 20, 8, b.ink(PAL.P0)); rect(x, y, 20, 1, b.ink(PAL.P2)); rect(x + 19, y, 1, 8, b.ink(PAL.P1)); rect(x + 1, y + 1, 18, 6, b.ink(PAL.P1));
  ellipse(x + 5.5, y + 4, 2.6, 2.6, b.ink(PAL.D4)); ellipse(x + 5.5, y + 3.5 + (o.pressed ? 1 : 0), 1.8, 1.8, b.ink(PAL.P2));
  rect(x + 11, y + 3, 2, 2, b.ink(o.lit ? PAL.C8 : PAL.D4));
  rect(x - 2, y + 10, 24, 3, b.ink(PAL.N1)); for (let i = 0; i < 20; i += 2) b.set(x + i, y + 11, PAL.G4);
};
