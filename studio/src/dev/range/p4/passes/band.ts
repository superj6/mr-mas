// MR. MAS · range passes: THE BAND. The adventure layout's 480x67 verb and inventory band (the approved pixeladv
// interface, studio/src/dev/pixeladv/art/ui.ts, re-drawn here unchanged so a pass module doesn't import a dev
// folder), plus its one convention for moving: retract and return in three held steps (style-range §4.1).
// Device passes keep the band on screen and untouched; full-frame leaps retract it.
import {Buf, rect, spr, blit, Sprite, remapRect} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {text, textWidth} from '../../../../shared/pixel/font';

export const BAND_Y = 203;
export const BAND_H = 67;

const CHARTER = spr(`
....oooooooooooooooo....
...oPPPPPPPPPPPPPPPPo...
..oPpppppppppppppppPPo..
...oPPPPPPPPPPPPPPPPo.o.
....oPpppppppppppppPo...
....oPp==.=====.=pPo....
....oPppppppppppppPo....
....oPp=====.===ppPo....
....oPppppppppppppPo....
....oPp===.======pPo....
....oPppppppppppppPo....
....oPp=====.rrrppPo....
....oPppppppprRRrrPo....
...oPPPPPPPPrRWRrrPPo...
..oPppppppppprRrrrppPo..
...oPPPPPPPPPPtPPtPPo...
....oooooooooottoottoo..
..............t...t.....
`);
const GPU = spr(`
.........................m.
oooooooooooooooooooooooommo
okkkkkkkkkkkkkkkkkkkkkkkmmo
okkssssskkkkkkkkssssskkkmmo
okssBBBsskkkkkkssBBBsskkmmo
oksBBbBBsskaakssBBbBBskkmmo
okBBbHbBBskaakkBBbHbBBkkmmo
oksBBbBBskkkkkksBBbBBskkmmo
okssBBBsskkkkkkssBBBsskkmmo
okkssssskkkkkkkkssssskkkmmo
okkkkkkkkkkkkkkkkkkkkkkkmmo
oggggggggggggggggggggggommo
..yyy.yyyyyyyyyyyyyyy...m..
`);
const ORB = spr(`
......oooooo......
....ooMMMMMMoo....
...oMMmmmmmmMMo...
..oMmWWmmmmmmmMo..
.oMmWWmmmddmmmmMo.
.oMmWmmmdiiidmmMo.
oMmmmmmdiIIIidmmMo
oMmmmmmdiIcIidmmMo
oMmmmmmdiIIIidmmMo
oMmmmmmmdiiidmmmMo
.oMmmmmmmdddmmmMo.
.oMMmmmmmmmmmmMMo.
..oMMmmmmmmmmMMo..
...ooMMMMMMMMoo...
.....oooooooo.....
......oSSSSo......
....ooSSSSSSoo....
`);
const ICON_PAL = {
  o: PAL.N0, P: PAL.P0, p: PAL.P1, '=': PAL.P0, r: PAL.R2, R: PAL.R3, W: PAL.P2, t: PAL.R1,
  k: PAL.N2, s: PAL.N4, B: PAL.N1, b: PAL.N5, H: PAL.C5, a: PAL.C6, g: PAL.L2, y: PAL.W6, m: PAL.G4,
  M: PAL.G3, d: PAL.N2, i: PAL.C4, I: PAL.C6, c: PAL.C9, S: PAL.G2,
};
const ORB_PAL = {...ICON_PAL, m: PAL.G5, M: PAL.G3, W: PAL.G6};
const INVENTORY: Array<{name: string; icon: Sprite; pal: Record<string, number>}> = [
  {name: 'nonprofit charter', icon: CHARTER, pal: ICON_PAL},
  {name: 'GPU', icon: GPU, pal: ICON_PAL},
  {name: 'orb', icon: ORB, pal: ORB_PAL},
];
const VERBS = [['Give', 'Pick up', 'Use'], ['Open', 'Look at', 'Pivot'], ['Close', 'Talk to', 'Raise']];
const CUT_DIM: Record<number, number> = {
  [PAL.N7]: PAL.N4, [PAL.N6]: PAL.N3, [PAL.N5]: PAL.N3, [PAL.N4]: PAL.N2, [PAL.N3]: PAL.N1, [PAL.N2]: PAL.N1,
  [PAL.C7]: PAL.C3, [PAL.C6]: PAL.C2, [PAL.C5]: PAL.C2, [PAL.C4]: PAL.C1, [PAL.C9]: PAL.C3,
  [PAL.P1]: PAL.N4, [PAL.P0]: PAL.N3, [PAL.P2]: PAL.N5, [PAL.R2]: PAL.R0, [PAL.R3]: PAL.R1, [PAL.R1]: PAL.R0,
  [PAL.G3]: PAL.N3, [PAL.G4]: PAL.N4, [PAL.G5]: PAL.N4, [PAL.G6]: PAL.N5, [PAL.G2]: PAL.N2,
  [PAL.W6]: PAL.W2, [PAL.L2]: PAL.L0, [PAL.N1]: PAL.N0,
};

export interface BandState { sentence?: string; hoverVerb?: string; hoverItem?: number; cutscene?: boolean }

/** Draw the band into rows y0..y0+66 of b (default the adventure layout's own rows 203..269). */
export const drawBand = (b: Buf, s: BandState = {}, y0 = BAND_Y) => {
  rect(0, y0, 480, BAND_H, b.ink(PAL.N1));
  rect(0, y0, 480, 1, b.ink(PAL.N0));
  rect(0, y0 + 1, 480, 1, b.ink(PAL.N4));
  rect(0, y0 + 2, 480, 1, b.ink(PAL.N2));
  const sentence = s.sentence ?? '';
  if (sentence) text(b, sentence, Math.round(240 - textWidth(sentence) / 2), y0 + 6, PAL.C6, {shadow: PAL.N0});
  const colX = [10, 58, 118];
  VERBS.forEach((row, j) => row.forEach((v, i) => {
    const x = colX[i], y = y0 + 20 + j * 16;
    const disabled = v === 'Open';
    text(b, v, x, y, disabled ? PAL.N4 : s.hoverVerb === v ? PAL.C7 : PAL.N7, {shadow: PAL.N0});
    if (disabled) rect(x - 1, y + 3, textWidth(v) + 2, 1, b.ink(PAL.N4));
  }));
  const ix = 172, iy = y0 + 16, cw = 98, ch = 48;
  const arrow = (x: number, y: number, up: boolean) => { for (let k = 0; k < 4; k++) rect(x + 3 - k, up ? y + k : y + 3 - k, 1 + k * 2, 1, b.ink(PAL.N5)); };
  arrow(ix - 12, iy + 8, true);
  arrow(ix - 12, iy + ch - 12, false);
  for (let i = 0; i < 3; i++) {
    const x = ix + i * (cw + 3), y = iy;
    rect(x, y, cw, ch, b.ink(PAL.N0));
    rect(x + 1, y + 1, cw - 2, ch - 2, b.ink(PAL.N2));
    rect(x + 1, y + 1, cw - 2, 1, b.ink(PAL.N3));
    rect(x + 1, y + ch - 2, cw - 2, 1, b.ink(PAL.N1));
    const item = INVENTORY[i];
    blit(b, item.icon, x + 6, y + Math.floor((ch - item.icon.h) / 2), item.pal);
    const lines = item.name === 'nonprofit charter' ? ['nonprofit', 'charter'] : [item.name];
    lines.forEach((ln, k) => text(b, ln, x + 12 + item.icon.w, y + Math.floor(ch / 2) - lines.length * 5 + k * 11 + 1, s.hoverItem === i ? PAL.C7 : PAL.N7, {shadow: PAL.N0}));
  }
  if (s.cutscene) remapRect(b, 0, y0 + 3, 480, BAND_H - 3, (c) => CUT_DIM[c] ?? c);
};

/**
 * The band's only motion: retract (down, out of frame) or return (up) in three held steps of `hold` frames.
 * Returns the band's top row for frame f; 270 means fully retracted.
 */
export const bandTop = (f: number, retractAt: number | null, returnAt: number | null, hold = 7) => {
  const steps = [BAND_Y, BAND_Y + 22, BAND_Y + 45, 270];
  if (returnAt !== null && f >= returnAt) return steps[Math.max(0, 3 - Math.min(3, Math.floor((f - returnAt) / hold) + 1))];
  if (retractAt !== null && f >= retractAt) return steps[Math.min(3, Math.floor((f - retractAt) / hold) + 1)];
  return BAND_Y;
};
