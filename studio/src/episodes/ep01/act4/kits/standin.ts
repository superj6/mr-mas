// MR. MAS — ep01 act4 kits preview: a STAND-IN Vegas suite (sc 24), only so the blueprint kit has a real BASE frame
// to trace, peel and tear back to. NOT the episode's suite: the room builder owns that (rooms/<suite>.ts). Keep it
// out of the cut.
import {Buf, rect, line, hash, bayer, ellipse} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {text, textWidth} from '../../../../shared/pixel/font';

/** Laptop screen rect inside the stand-in (for the JOIN button / cursor). */
export const LAPTOP = {x: 214, y: 150, w: 70, h: 44};
export const JOIN_BTN: [number, number, number, number] = [LAPTOP.x + 22, LAPTOP.y + 28, 26, 10];

export const drawSuite = (b: Buf, f: number, o: {click?: boolean} = {}) => {
  // wall: night, lit from the window at right (neon: red + tungsten + the dusk family)
  for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) b.set(x, y, bayer(x, y) < x / 480 * 0.55 ? PAL.N2 : PAL.N1);
  // the window: floor-to-ceiling glass, the Strip below
  const wx = 250, wy = 20, ww = 218, wh = 150;
  rect(wx - 4, wy - 4, ww + 8, wh + 8, b.ink(PAL.N0));
  for (let y = wy; y < wy + wh; y++) for (let x = wx; x < wx + ww; x++) b.set(x, y, bayer(x, y) < (y - wy) / wh * 0.8 ? PAL.U1 : PAL.U0);
  // towers with marquee windows
  const towers: Array<[number, number, number]> = [[wx + 10, 60, 30], [wx + 48, 38, 26], [wx + 84, 76, 40], [wx + 132, 30, 22], [wx + 160, 52, 44]];
  for (const [tx, ty, tw] of towers) {
    rect(tx, wy + ty, tw, wh - ty, b.ink(PAL.N0));
    for (let j = ty + 6; j < wh - 6; j += 6) for (let i = 3; i < tw - 3; i += 5) if (hash(tx + i, j, 2) < 0.5) b.set(tx + i, wy + j, hash(i, j, 3) < 0.6 ? PAL.W6 : PAL.C6);
  }
  // a big neon sign and a star
  rect(wx + 96, wy + 44, 16, 50, b.ink(PAL.N0));
  for (let j = 0; j < 9; j++) rect(wx + 99, wy + 48 + j * 5, 10, 3, b.ink((j + (f >> 2)) % 9 === 0 ? PAL.P2 : PAL.R3));
  for (let k = -5; k <= 5; k++) { b.set(wx + 190 + k, wy + 30, PAL.W7); b.set(wx + 190, wy + 30 + k, PAL.W7); }
  b.set(wx + 190, wy + 30, PAL.W9);
  // the closed street circuit: a lit barrier line, the crane truck later passes on it
  rect(wx, wy + wh - 14, ww, 2, b.ink(PAL.W5));
  rect(wx, wy + wh - 12, ww, 12, b.ink(PAL.N1));
  for (let x = wx; x < wx + ww; x += 6) b.set(x + ((f >> 1) % 6), wy + wh - 7, PAL.R2);
  // mullions
  for (const mx of [wx + 72, wx + 145]) rect(mx, wy, 2, wh, b.ink(PAL.N0));
  // neon spill on the wall edge + the ceiling
  for (let y = wy; y < wy + wh; y++) if (bayer(wx - 6, y) < 0.5) b.set(wx - 6, y, PAL.U2);
  // the desk: a dark slab across the bottom, lit at its front edge by the laptop
  rect(0, 196, 480, 74, b.ink(PAL.D1));
  rect(0, 196, 480, 2, b.ink(PAL.D3));
  for (let x = 0; x < 480; x++) if (bayer(x, 199) < 0.3) b.set(x, 199, PAL.D2);
  // the laptop: lid (with the call app), base
  const L = LAPTOP;
  rect(L.x - 3, L.y - 3, L.w + 6, L.h + 6, b.ink(PAL.G1));
  rect(L.x, L.y, L.w, L.h, b.ink(PAL.N2));
  rect(L.x, L.y, L.w, 8, b.ink(PAL.N3));
  text(b, 'BOARD', L.x + 3, L.y + 1, PAL.N7);
  text(b, 'VIDEO CALL', L.x + Math.round((L.w - textWidth('VIDEO CALL')) / 2), L.y + 14, PAL.P1);
  const [jx, jy, jw, jh] = JOIN_BTN;
  rect(jx, jy, jw, jh, b.ink(o.click ? PAL.C4 : PAL.C5));
  text(b, 'JOIN', jx + Math.round((jw - textWidth('JOIN')) / 2), jy + 2, PAL.N0);
  rect(L.x - 14, L.y + L.h + 3, L.w + 28, 5, b.ink(PAL.G2));
  rect(L.x - 14, L.y + L.h + 3, L.w + 28, 1, b.ink(PAL.G4));
  // laptop glow on the desk
  for (let y = 200; y < 230; y++) for (let x = L.x - 40; x < L.x + L.w + 40; x++) if (bayer(x, y) < 0.35 - Math.abs(x - (L.x + L.w / 2)) / 200 - (y - 200) / 90) b.set(x, y, PAL.C1);
  // his glass (it does not shiver) and a flute on the minibar
  rect(320, 172, 9, 22, b.ink(PAL.C2)); rect(321, 173, 7, 20, b.ink(PAL.N2)); rect(321, 182, 7, 11, b.ink(PAL.C3)); b.set(322, 175, PAL.C8);
  rect(60, 150, 70, 46, b.ink(PAL.D2)); rect(60, 150, 70, 2, b.ink(PAL.D4));
  line(80, 130, 80, 150, b.ink(PAL.C4)); ellipse(80, 126, 3, 5, b.ink(PAL.C3));
  rect(100, 136, 10, 14, b.ink(PAL.G3)); rect(101, 132, 8, 4, b.ink(PAL.G5));
  // the cursor on JOIN
  const cx = jx + 16, cy = jy + 5 + (o.click ? 1 : 0);
  ['o....', 'oo...', 'owo..', 'owwo.', 'owwwo', 'owwoo', 'oo.wo'].forEach((r, j) => { for (let i = 0; i < r.length; i++) { if (r[i] === 'o') b.set(cx + i, cy + j, PAL.N0); if (r[i] === 'w') b.set(cx + i, cy + j, PAL.P2); } });
};
