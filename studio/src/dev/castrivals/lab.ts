// MR. MAS — castrivals: dev-only lab views (zoomable crops for iteration; not deliverables).
import {Buf, bayer} from '../pixeladv/core/px';
import {PAL} from '../pixeladv/core/palette';
import {text} from '../pixeladv/core/font';
import {BOSSES, BOSS_LOOP, CX, drawBoss} from '../../shared/pixel/cast/bosses';

const dusk = (b: Buf, x0: number, y0: number, w: number, h: number) => {
  const stops = [PAL.N2, CX.U0, CX.U1, CX.U2, CX.U3, CX.U4, CX.U5, PAL.W5];
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const t = (y / h) * (stops.length - 1);
      const i = Math.floor(t), fr = t - i;
      b.set(x0 + x, y0 + y, fr > bayer(x, y) ? stops[Math.min(stops.length - 1, i + 1)] : stops[i]);
    }
};

/** every boss, each loop step in its own row */
export const bossLab = (): Buf => {
  const cols = BOSSES.length, cw = 60, rows = 4, rh = 60;
  const b = new Buf(cols * cw, rows * rh + 12, PAL.N1);
  BOSSES.forEach((bo, i) => {
    const loop = BOSS_LOOP[bo.id];
    for (let r = 0; r < rows; r++) {
      const f = Math.floor((r * loop) / rows);
      const x0 = i * cw, y0 = 12 + r * rh;
      dusk(b, x0, y0, cw - 1, rh - 1);
      for (let x = 0; x < cw - 1; x++) { b.set(x0 + x, y0 + rh - 8, PAL.N4); for (let y = rh - 7; y < rh - 1; y++) b.set(x0 + x, y0 + y, PAL.N2); }
      drawBoss(b, bo.id, x0 + 32, y0 + rh - 8, f);
    }
    text(b, bo.name.slice(0, 8), i * cw + 2, 2, PAL.N7);
  });
  return b;
};

// ---------------------------------------------------------------- Nole: old vs v2
import {blitImg} from '../pixeladv/core/figure';
import {noleImg as oldNole} from '../pixeladv/art/nole';
import {noleImg, NOLE_BASE, NolePose} from '../../shared/pixel/cast/nole';

export const noleLab = (): Buf => {
  const b = new Buf(520, 110, PAL.N1);
  for (let y = 0; y < 110; y++) for (let x = 0; x < 520; x++) b.set(x, y, y > 100 ? PAL.N2 : PAL.N1);
  const ob = {legs: 'stand', arm: 'down', mouth: 0, lean: 0, light: 'lit', brow: 0} as const;
  blitImg(b, oldNole({...ob}), 0, 8);
  blitImg(b, oldNole({...ob, arm: 'jab', lean: 3, brow: 1, mouth: 2}), 50, 8);
  const P: NolePose[] = [NOLE_BASE, {...NOLE_BASE, legs: 'w0', arm: 'phone'}, {...NOLE_BASE, legs: 'w1', arm: 'phone'}, {...NOLE_BASE, legs: 'w2', arm: 'phone'}, {...NOLE_BASE, legs: 'w3', arm: 'phone'},
    {...NOLE_BASE, arm: 'jab', lean: 3, brow: 1, mouth: 2}, {...NOLE_BASE, arm: 'jab2', lean: 3, brow: 1, mouth: 1}, {...NOLE_BASE, arm: 'raise', lean: 1}];
  P.forEach((p, i) => blitImg(b, noleImg(p), 104 + i * 52, 7));
  text(b, 'old', 20, 1, PAL.N5);
  text(b, 'v2', 130, 1, PAL.W6);
  return b;
};

// ---------------------------------------------------------------- Mario sprites
import {marioImg, MARIO_BASE, MarioPose} from '../../shared/pixel/cast/mario';
export const marioLab = (): Buf => {
  const b = new Buf(400, 100, PAL.N1);
  for (let y = 0; y < 100; y++) for (let x = 0; x < 400; x++) b.set(x, y, y > 90 ? PAL.N2 : PAL.N1);
  const P: MarioPose[] = [MARIO_BASE, {...MARIO_BASE, legs: 'step0'}, {...MARIO_BASE, legs: 'step1'}, {...MARIO_BASE, arm: 'chest', mouth: 1},
    {...MARIO_BASE, arm: 'raise', mouth: 1, brow: 1}, {...MARIO_BASE, arm: 'raise2', mouth: 2, brow: 1, scroll: true}, {...MARIO_BASE, light: 'sil', legs: 'step0'}];
  P.forEach((p, i) => blitImg(b, marioImg(p), 4 + i * 56, 8));
  return b;
};
