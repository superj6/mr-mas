// MR. MAS — mdinner1 dev lab: pose sheets for the new drawings (not part of the deliverable).
import {Buf, rect} from '../../shared/pixel/px';
import {PAL} from '../../shared/pixel/palette';
import {text} from '../../shared/pixel/font';
import {blitImg} from '../../shared/pixel/figure';
import {masDinnerBack, masDinnerFront, MasArm, MASD_W, MASD_H} from './masdinner';
const masDinner = (p: Parameters<typeof masDinnerBack>[0]) => p;
const drawMas = (b: Buf, p: Parameters<typeof masDinnerBack>[0], x: number, y: number) => { blitImg(b, masDinnerBack(p), x, y); rect(x, y + 46, MASD_W, 8, b.ink(PAL.P0)); rect(x, y + 46, MASD_W, 1, b.ink(PAL.P1)); blitImg(b, masDinnerFront(p), x, y); };

export const labMas = () => {
  const b = new Buf(480, 270, PAL.N1);
  const arms: MasArm[] = ['steeple', 'reach1', 'reach2', 'hold', 'pocket', 'fork', 'roast', 'bite'];
  arms.forEach((a, i) => {
    const x = 4 + (i % 6) * 78, y = 6 + Math.floor(i / 6) * 90;
    rect(x, y, MASD_W, MASD_H, b.ink(PAL.W1));
    drawMas(b, masDinner({arm: a, lid: 0, look: a === 'reach1' || a === 'reach2' ? -1 : a === 'roast' ? 1 : 0, mouth: a === 'bite' ? 'open' : 'rest', breathe: 0}), x, y);
    text(b, a, x, y + MASD_H + 2, PAL.N7);
  });
  // faces
  const faces: Array<[0 | 1 | 2, -1 | 0 | 1, 'rest' | 'smile' | 'open' | 'chew']> = [[0, 0, 'rest'], [1, 0, 'rest'], [2, 0, 'rest'], [0, -1, 'rest'], [0, 1, 'rest'], [0, 0, 'smile'], [0, 0, 'chew']];
  faces.forEach(([lid, look, mouth], i) => {
    const x = 4 + i * 60, y = 190;
    rect(x, y, 58, 40, b.ink(PAL.W1));
    drawMas(b, masDinner({arm: 'steeple', lid, look, mouth, breathe: 0}), x - 4, y - 4);
  });
  return b;
};
