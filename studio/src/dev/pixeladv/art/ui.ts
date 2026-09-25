// MR. MAS — pixeladv: the adventure-game interface. Sentence line, 9-verb grid (with parody verbs),
// inventory with hand-pixelled icons, SCUMM crosshair, portrait windows and dialogue boxes.
import {Buf, rect, spr, blit, Sprite, remapRect, line} from '../core/px';
import {PAL} from '../core/palette';
import {text, textWidth, wrap} from '../core/font';

export const UI_Y = 203;

// ---------------- inventory icons (hand-pixelled) ----------------
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
// orb uses m as chrome mid
const ORB_PAL = {...ICON_PAL, m: PAL.G5, M: PAL.G3, W: PAL.G6};

export const INVENTORY: Array<{name: string; icon: Sprite; pal: Record<string, number>}> = [
  {name: 'nonprofit charter', icon: CHARTER, pal: ICON_PAL},
  {name: 'GPU', icon: GPU, pal: ICON_PAL},
  {name: 'orb', icon: ORB, pal: ORB_PAL},
];

const VERBS = [
  ['Give', 'Pick up', 'Use'],
  ['Open', 'Look at', 'Pivot'],
  ['Close', 'Talk to', 'Raise'],
];

export interface UIState {
  /** 0 = full, 1 = cutscene (dimmed, no cursor) */
  cutscene: boolean;
  sentence: string;
  hoverVerb?: string;
  hoverItem?: number;
  cursor?: [number, number] | null;
  f: number;
}

const dimCol = (c: number) => {
  // cutscene dim: step every colour two rungs down its family (a palette op, not a blend)
  const map: Record<number, number> = {
    [PAL.N7]: PAL.N4, [PAL.N6]: PAL.N3, [PAL.N5]: PAL.N3, [PAL.N4]: PAL.N2, [PAL.N3]: PAL.N1, [PAL.N2]: PAL.N1,
    [PAL.C7]: PAL.C3, [PAL.C6]: PAL.C2, [PAL.C5]: PAL.C2, [PAL.C4]: PAL.C1, [PAL.C9]: PAL.C3,
    [PAL.P1]: PAL.N4, [PAL.P0]: PAL.N3, [PAL.P2]: PAL.N5, [PAL.R2]: PAL.R0, [PAL.R3]: PAL.R1, [PAL.R1]: PAL.R0,
    [PAL.G3]: PAL.N3, [PAL.G4]: PAL.N4, [PAL.G5]: PAL.N4, [PAL.G6]: PAL.N5, [PAL.G2]: PAL.N2,
    [PAL.W6]: PAL.W2, [PAL.L2]: PAL.L0, [PAL.N1]: PAL.N0,
  };
  return map[c] ?? c;
};

export const drawUI = (b: Buf, s: UIState) => {
  const y0 = UI_Y;
  rect(0, y0, 480, 270 - y0, b.ink(PAL.N1));
  rect(0, y0, 480, 1, b.ink(PAL.N0));
  rect(0, y0 + 1, 480, 1, b.ink(PAL.N4));
  rect(0, y0 + 2, 480, 1, b.ink(PAL.N2));
  // sentence line
  const sw = textWidth(s.sentence);
  text(b, s.sentence, Math.round(240 - sw / 2), y0 + 6, PAL.C6, {shadow: PAL.N0});
  // verbs
  const colX = [10, 58, 118];
  VERBS.forEach((row, j) =>
    row.forEach((v, i) => {
      const x = colX[i], y = y0 + 20 + j * 16;
      const disabled = v === 'Open';
      const hot = s.hoverVerb === v;
      text(b, v, x, y, disabled ? PAL.N4 : hot ? PAL.C7 : PAL.N7, {shadow: PAL.N0});
      if (disabled) rect(x - 1, y + 3, textWidth(v) + 2, 1, b.ink(PAL.N4));
    }),
  );
  // inventory: three generous slots
  const ix = 172, iy = y0 + 16, cw = 98, ch = 48;
  const arrow = (x: number, y: number, up: boolean) => {
    for (let k = 0; k < 4; k++) rect(x + 3 - k, up ? y + k : y + 3 - k, 1 + k * 2, 1, b.ink(PAL.N5));
  };
  arrow(ix - 12, iy + 8, true);
  arrow(ix - 12, iy + ch - 12, false);
  for (let i = 0; i < 3; i++) {
    const x = ix + i * (cw + 3), y = iy;
    rect(x, y, cw, ch, b.ink(PAL.N0));
    rect(x + 1, y + 1, cw - 2, ch - 2, b.ink(PAL.N2));
    rect(x + 1, y + 1, cw - 2, 1, b.ink(PAL.N3));
    rect(x + 1, y + ch - 2, cw - 2, 1, b.ink(PAL.N1));
    const item = INVENTORY[i];
    const ic = item.icon;
    blit(b, ic, x + 6, y + Math.floor((ch - ic.h) / 2), item.pal);
    const hot = s.hoverItem === i;
    const lines = item.name === 'nonprofit charter' ? ['nonprofit', 'charter'] : [item.name];
    lines.forEach((ln, k) => text(b, ln, x + 12 + ic.w, y + Math.floor(ch / 2) - lines.length * 5 + k * 11 + 1, hot ? PAL.C7 : PAL.N7, {shadow: PAL.N0}));
  }
  if (s.cutscene) remapRect(b, 0, y0 + 3, 480, 270 - y0 - 3, dimCol);
};

/** SCUMM-style crosshair; colour cycles like the originals. */
export const drawCursor = (b: Buf, x: number, y: number, f: number) => {
  const cyc = [PAL.C9, PAL.C8, PAL.C7, PAL.C6, PAL.C7, PAL.C8];
  const c = cyc[Math.floor(f / 2) % cyc.length];
  for (const [dx, dy] of [[0, -4], [0, -3], [0, -2], [0, 2], [0, 3], [0, 4], [-4, 0], [-3, 0], [-2, 0], [2, 0], [3, 0], [4, 0]]) {
    b.set(x + dx + 1, y + dy + 1, PAL.N0);
  }
  for (const [dx, dy] of [[0, -4], [0, -3], [0, -2], [0, 2], [0, 3], [0, 4], [-4, 0], [-3, 0], [-2, 0], [2, 0], [3, 0], [4, 0]]) b.set(x + dx, y + dy, c);
};

// ---------------- conversation UI ----------------
/** Portrait window: bevelled frame with a name plate. open 0..1 animates the window opening (stepped). */
export const drawPortraitFrame = (b: Buf, x: number, y: number, w: number, h: number, name: string, accent: number, open: number) => {
  const steps = open >= 1 ? 1 : open >= 0.66 ? 0.66 : open >= 0.33 ? 0.33 : 0.1;
  const hh = Math.max(3, Math.round(h * steps));
  const yy = y + Math.round((h - hh) / 2);
  rect(x - 3, yy - 3, w + 6, hh + 6, b.ink(PAL.N0));
  rect(x - 2, yy - 2, w + 4, 1, b.ink(PAL.N6));
  rect(x - 2, yy - 2, 1, hh + 4, b.ink(PAL.N6));
  rect(x - 2, yy + hh + 1, w + 4, 1, b.ink(PAL.N3));
  rect(x + w + 1, yy - 2, 1, hh + 4, b.ink(PAL.N3));
  rect(x - 1, yy - 1, w + 2, hh + 2, b.ink(PAL.N0));
  if (open >= 1) {
    // name tab hanging under the frame
    const nw = textWidth(name) + 10;
    const nx = x + 4, ny = y + h + 3;
    rect(nx - 1, ny, nw + 2, 12, b.ink(PAL.N0));
    rect(nx, ny, nw, 11, b.ink(PAL.N2));
    rect(nx, ny + 10, nw, 1, b.ink(accent));
    text(b, name, nx + 5, ny + 2, accent, {shadow: PAL.N0});
  }
  return {inner: [x, yy, w, hh] as [number, number, number, number], full: open >= 1};
};

export const drawDialogueBox = (b: Buf, x: number, y: number, w: number, str: string, shown: number, col: number, f: number, tail: 'left' | 'right') => {
  const lines = wrap(str, w - 14);
  const h = 10 + lines.length * 11;
  rect(x - 1, y - 1, w + 2, h + 2, b.ink(PAL.N0));
  rect(x, y, w, h, b.ink(PAL.N1));
  rect(x, y, w, 1, b.ink(PAL.N5));
  rect(x, y + h - 1, w, 1, b.ink(PAL.N3));
  // tail notch toward the portrait
  const ty = y + 8;
  if (tail === 'right') for (let k = 0; k < 4; k++) rect(x + w + 1, ty + k, 3 - k, 1, b.ink(PAL.N1));
  else for (let k = 0; k < 4; k++) rect(x - 1 - (3 - k), ty + k, 3 - k, 1, b.ink(PAL.N1));
  let left = shown;
  lines.forEach((ln, i) => {
    const part = ln.slice(0, Math.max(0, left));
    left -= ln.length + 1;
    text(b, part, x + 7, y + 6 + i * 11, col, {shadow: PAL.N0});
  });
  // "more" pip blinks when the line is complete
  if (shown >= str.length && Math.floor(f / 6) % 2 === 0) {
    const px = x + w - 9, py = y + h - 7;
    rect(px, py, 5, 1, b.ink(col)); rect(px + 1, py + 1, 3, 1, b.ink(col)); rect(px + 2, py + 2, 1, 1, b.ink(col));
  }
  return h;
};

export {line};
