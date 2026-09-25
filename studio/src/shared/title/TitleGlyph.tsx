import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../theme/fonts';
import {hexToRgb} from '../theme/color';
import {buildSkyline} from './skyline';
import {offscreen, useCanvasDraw} from './raster';
import {H, TitleProps, W, clamp, hash2, layoutWordmark, lerp, rng, smooth, useFontsReady, useTitleFrame} from './common';

/**
 * title-glyph — "latent glyph": the whole card is a grid of mono tokens; tone = glyph density.
 * The wordmark is painted into a coverage field and re-emitted as tokens (dense core, light edges),
 * the orb is a token-shaded chrome sphere with a cyan iris, the skyline is a void cut out of a
 * field of dusk-coloured dots, lit racks are bars. Bloom pass on top. In motion the wordmark
 * decodes out of noise.
 */
const CELL = 9;
const GW = Math.ceil(W / CELL);
const GH = Math.ceil(H / CELL);
const RAMP = ' .·:-=+*≡%#@';
const DENSE = '#%@&$8B■';

type RGB = [number, number, number];
const mixc = (a: RGB, b: RGB, t: number): RGB => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const C = (h: string) => hexToRgb(h) as RGB;

export const TitleGlyph: React.FC<TitleProps> = (props) => {
  const f = useTitleFrame(props);
  const ready = useFontsReady([`400 280px "Archivo Black"`, `700 12px "JetBrains Mono"`, `400 22px "JetBrains Mono"`]);
  const sky = useMemo(() => buildSkyline({seed: 13, ground: H + 4, u: 0.44}), []);

  const ref = useCanvasDraw(
    ready,
    (cv) => {
      const out = cv.getContext('2d')!;
      out.setTransform(1, 0, 0, 1, 0, 0);
      out.fillStyle = '#05070A';
      out.fillRect(0, 0, W, H);
      const rose = sky.rose;
      const cellField = (paint: (c: CanvasRenderingContext2D) => void) => {
        const c = offscreen(GW, GH);
        c.scale(1 / CELL, 1 / CELL);
        c.fillStyle = '#fff';
        c.strokeStyle = '#fff';
        paint(c);
        const d = c.getImageData(0, 0, GW, GH).data;
        const a = new Float32Array(GW * GH);
        for (let i = 0; i < a.length; i++) a[i] = d[i * 4 + 3] / 255;
        return a;
      };
      // ---------- fields ----------
      const font = `400 280px ${FONT.headline}`;
      const L = layoutWordmark({font, tracking: 8, orb: 0.8, gapL: 0.1, gapR: 0.26, sink: 0.02});
      const bx = W / 2;
      const by = 470;
      const word = cellField((c) => {
        c.font = font;
        (c as any).letterSpacing = '8px';
        c.fillText('MR', bx + L.mrX, by);
        c.fillText('MAS', bx + L.masX, by);
      });
      const ocx = bx + L.orb.cx;
      const ocy = by + L.orb.cy;
      const orR = L.orb.r;
      const rays = cellField((c) => {
        const R = rng(4);
        for (let k = 0; k < 24; k++) {
          const a = -Math.PI + ((k + 0.5) / 24) * Math.PI + (R() - 0.5) * 0.1 + Math.sin(f / 36 + k) * 0.006;
          const w = 0.012 + R() * 0.02;
          c.globalAlpha = 0.35 + R() * 0.65;
          c.beginPath();
          c.moveTo(rose.cx, rose.cy);
          c.lineTo(rose.cx + Math.cos(a - w) * 2400, rose.cy + Math.sin(a - w) * 2400);
          c.lineTo(rose.cx + Math.cos(a + w) * 2400, rose.cy + Math.sin(a + w) * 2400);
          c.fill();
        }
      });
      const far = cellField((c) => c.fill(new Path2D(sky.far)));
      const mid = cellField((c) => {
        c.fill(new Path2D(sky.mid));
        c.lineWidth = 6;
        c.stroke(new Path2D(sky.lines));
      });
      const racks = cellField((c) => sky.windows.filter((w) => w.arch).forEach((w) => c.fill(new Path2D(w.d))));

      // ---------- emit glyphs ----------
      out.font = `700 12px ${FONT.mono}`;
      out.textAlign = 'center';
      out.textBaseline = 'middle';
      const boil = Math.floor(f / 2);
      const decode = props.frame !== undefined ? 1 : smooth(4, 40, f);
      const skyTop = C('#1A2A4C');
      const skyMid = C('#3B5577');
      const skyHz = C('#F2A260');
      const rayC = C('#A6F2FF');
      const ivory = C('#F6F1E2');
      const cyan = C('#7FEFFF');
      const put = (x: number, y: number, ch: string, col: RGB, a = 1) => {
        if (ch === ' ') return;
        out.fillStyle = `rgba(${col[0] | 0},${col[1] | 0},${col[2] | 0},${a})`;
        out.fillText(ch, x * CELL + CELL / 2, y * CELL + CELL / 2 + 0.5);
      };
      for (let y = 0; y < GH; y++) {
        const ty = y / GH;
        for (let x = 0; x < GW; x++) {
          const i = y * GW + x;
          const px = x * CELL + CELL / 2;
          const py = y * CELL + CELL / 2;
          const h = hash2(x, y, 5);
          const hb = hash2(x, y, 11 + boil);
          // orb cells
          const dx = px - ocx;
          const dy = py - ocy;
          const dr = Math.hypot(dx, dy);
          if (dr <= orR + CELL * 0.3) {
            const nx = dx / orR;
            const ny = dy / orR;
            const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
            const lx = 0.18 * Math.sin(f / 18);
            const ly = 0.12;
            const ix = ocx + lx * orR;
            const iy = ocy + ly * orR;
            const di = Math.hypot(px - ix, py - iy) / orR;
            if (di < 0.5) {
              if (di < 0.2) {
                if (di < 0.08) continue;
                put(x, y, '·', cyan, 0.7);
              } else put(x, y, di < 0.36 ? '@' : di < 0.44 ? '#' : '%', mixc(cyan, C('#1E7C8C'), (di - 0.2) / 0.3));
              continue;
            }
            if (di < 0.58) continue; // dark limbal gap
            // chrome shading: dark sky reflection above, bright horizon band, dark ground below, rim light right
            let v = ny < 0.3 ? 0.34 + (ny + 1) * 0.4 : ny < 0.44 ? 1 : 0.2 + (ny - 0.44) * 0.4;
            v += Math.max(0, nx) * 0.25 * (1 - nz);
            if (nx > 0.25 && ny < -0.35 && nx < 0.62 && ny > -0.72) v = 1;
            v = clamp(v);
            const ch = v > 0.9 ? DENSE[Math.floor(h * DENSE.length)] : RAMP[Math.min(RAMP.length - 1, Math.floor(v * RAMP.length))];
            put(x, y, dr > orR - CELL * 0.9 ? 'O' : ch, dr > orR - CELL * 0.9 ? C('#CFE7EC') : mixc(C('#7C9098'), ivory, v));
            continue;
          }
          // wordmark
          const wv = word[i];
          if (wv > 0.08) {
            const lit = 1 - clamp((py - (by - L.capH)) / L.capH);
            const col = mixc(cyan, ivory, clamp(lit * 1.2));
            if (decode < 1 && hb > decode) {
              put(x, y, RAMP[1 + Math.floor(hb * (RAMP.length - 1))], mixc(col, C('#3FE6FF'), 0.6), 0.8);
              continue;
            }
            if (wv > 0.72) put(x, y, DENSE[Math.floor(h * DENSE.length)], col);
            else put(x, y, wv > 0.45 ? '+' : wv > 0.25 ? ':' : '·', col, 0.9);
            continue;
          }
          // skyline void, racks and window lights
          if (mid[i] > 0.5) {
            if (racks[i] > 0.4) put(x, y, (y + boil) % 4 === 0 ? '▪' : '▮', racks[i] > 0.8 ? cyan : C('#3FB8C8'), 0.95);
            continue;
          }
          // sky: dusk gradient, glow, rays
          const glow = Math.exp(-((px - rose.cx) ** 2) / (2 * 520 ** 2) - (py - rose.cy) ** 2 / (2 * 300 ** 2));
          let v = 0.02 + Math.pow(ty, 2.4) * 0.55 + glow * 0.62 + rays[i] * 0.22 * (0.4 + 0.6 * (1 - ty));
          if (far[i] > 0.5) v = 0.1 + glow * 0.05;
          v += (h - 0.5) * 0.05;
          const idx = Math.floor(clamp(v) * (RAMP.length - 1) * 0.72);
          const ch = RAMP[idx];
          let col = ty < 0.55 ? mixc(skyTop, skyMid, ty / 0.55) : mixc(skyMid, skyHz, (ty - 0.55) / 0.45);
          if (rays[i] > 0.2) col = mixc(col, rayC, rays[i] * 0.6);
          if (far[i] > 0.5) col = C('#2C4450');
          put(x, y, ch, col, 0.6 + 0.4 * clamp(v * 1.5));
        }
      }
      // hall window lights + beacons (point tokens)
      sky.windows.forEach((w, k) => {
        if (w.arch || k % 2) return;
        const x = Math.floor((w.x + w.w / 2) / CELL);
        const y = Math.floor((w.y + w.h / 2) / CELL);
        if (mid[y * GW + x] > 0.5) put(x, y, (k + boil) % 9 === 0 ? '·' : '▪', w.cool ? C('#7FE0EA') : C('#FFB765'), 0.9);
      });
      sky.beacons.forEach((b, k) => {
        if (Math.sin(f / 6 + k * 2.1) > -0.2) put(Math.floor(b.x / CELL), Math.floor(b.y / CELL), '•', C('#FF5A45'));
      });
      // rose window: a token eye
      const rx = Math.floor(rose.cx / CELL);
      const ry = Math.floor(rose.cy / CELL);
      for (let y = -3; y <= 3; y++) for (let x = -3; x <= 3; x++) {
        const d = Math.hypot(x, y);
        if (d > 3.2) continue;
        put(rx + x, ry + y, d < 1 ? ' ' : d < 2 ? '@' : '○', d < 2 ? cyan : C('#BFF6FF'));
      }
      // ---------- subtitle on the grid + cursor ----------
      const sub = 'now in low-key research preview';
      const sx = Math.round(GW / 2 - sub.length);
      const sy = Math.round((by + 92) / CELL);
      out.font = `400 22px ${FONT.mono}`;
      out.fillStyle = '#05070A';
      out.fillRect(sx * CELL - 12, sy * CELL - 14, sub.length * 2 * CELL + 44, 30);
      out.fillStyle = '#AEEFF6';
      for (let k = 0; k < sub.length; k++) out.fillText(sub[k], (sx + k * 2) * CELL + CELL, sy * CELL + 1);
      if (Math.floor(f / 12) % 2 === 0 || props.frame !== undefined) {
        out.fillStyle = '#7FEFFF';
        out.fillRect((sx + sub.length * 2) * CELL + 4, sy * CELL - 11, 12, 22);
      }
      // ---------- bloom ----------
      out.save();
      out.filter = 'blur(7px)';
      out.globalCompositeOperation = 'lighter';
      out.globalAlpha = 0.55;
      out.drawImage(cv, 0, 0);
      out.filter = 'blur(24px)';
      out.globalAlpha = 0.35;
      out.drawImage(cv, 0, 0);
      out.restore();
    },
    [f, sky],
  );
  return (
    <AbsoluteFill style={{background: '#05070A'}}>
      <canvas ref={ref} width={W} height={H} style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};
