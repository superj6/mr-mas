import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../theme/fonts';
import {buildSkyline} from './skyline';
import {bitText, bitWidth} from './bitfont';
import {dilate, fieldOf, maskOf, shift, useCanvasDraw, BAYER4} from './raster';
import {H, TitleProps, W, clamp, easeInOut, layoutWordmark, rng, useFontsReady, useTitleFrame} from './common';

/**
 * title-dither — 1-bit, Mac-era. Native 640x360 at 3x, pure black/white.
 * The scene is painted as greyscale then Atkinson-dithered (the MacPaint texture); the wordmark is
 * crisp bitmap type in the classic Outline+Shadow text style on a knocked-out plate; the arrow
 * cursor drifts in and THE ORB's iris follows it.
 */
const LW = 640;
const LH = 360;
const S = 3;

// classic arrow pointer: X = black, o = white, . = clear
const ARROW = [
  'X...........',
  'XX..........',
  'XoX.........',
  'XooX........',
  'XoooX.......',
  'XooooX......',
  'XoooooX.....',
  'XooooooX....',
  'XoooooooX...',
  'XooooooooX..',
  'XoooooXXXXX.',
  'XooXooX.....',
  'XoX.XooX....',
  'XX..XooX....',
  'X....XooX...',
  '.....XooX...',
  '......XX....',
];

const atkinson = (v: Float32Array, w: number, h: number): Uint8Array => {
  const e = Float32Array.from(v);
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const old = e[i];
      const nv = old > 0.5 ? 1 : 0;
      out[i] = nv;
      const err = (old - nv) / 8;
      if (x + 1 < w) e[i + 1] += err;
      if (x + 2 < w) e[i + 2] += err;
      if (y + 1 < h) {
        if (x > 0) e[i + w - 1] += err;
        e[i + w] += err;
        if (x + 1 < w) e[i + w + 1] += err;
      }
      if (y + 2 < h) e[i + 2 * w] += err;
    }
  return out;
};

export const TitleDither: React.FC<TitleProps> = (props) => {
  const f = useTitleFrame(props);
  const ready = useFontsReady([`900 80px "Playfair Display"`]);
  const sky = useMemo(() => buildSkyline({seed: 17, ground: LH * S + 4, u: 0.44}), []);

  const ref = useCanvasDraw(
    ready,
    (cv) => {
      const out = cv.getContext('2d')!;
      const R = rng(3);
      const rose = {x: sky.rose.cx / S, y: sky.rose.cy / S};
      // ---------- greyscale scene ----------
      const g = fieldOf(LW, LH, (c) => {
        const gr = c.createLinearGradient(0, 0, 0, LH);
        gr.addColorStop(0, '#060606');
        gr.addColorStop(0.35, '#262626');
        gr.addColorStop(0.62, '#5A5A5A');
        gr.addColorStop(0.8, '#A8A8A8');
        gr.addColorStop(0.92, '#E4E4E4');
        c.fillStyle = gr;
        c.fillRect(0, 0, LW, LH);
        const rg = c.createRadialGradient(rose.x, rose.y, 4, rose.x, rose.y, 260);
        rg.addColorStop(0, 'rgba(255,255,255,0.9)');
        rg.addColorStop(0.4, 'rgba(255,255,255,0.25)');
        rg.addColorStop(1, 'rgba(255,255,255,0)');
        c.fillStyle = rg;
        c.fillRect(0, 0, LW, LH);
        // rays out of the rose window
        const rays = rng(9);
        for (let k = 0; k < 16; k++) {
          const a = -Math.PI + ((k + 0.5) / 16) * Math.PI + (rays() - 0.5) * 0.06 + Math.sin(f / 30 + k) * 0.01;
          const w = 0.012 + rays() * 0.02;
          c.fillStyle = `rgba(255,255,255,${0.1 + rays() * 0.12})`;
          c.beginPath();
          c.moveTo(rose.x, rose.y);
          c.lineTo(rose.x + Math.cos(a - w) * 900, rose.y + Math.sin(a - w) * 900);
          c.lineTo(rose.x + Math.cos(a + w) * 900, rose.y + Math.sin(a + w) * 900);
          c.fill();
        }
        c.save();
        c.scale(1 / S, 1 / S);
        c.fillStyle = '#6E6E6E';
        c.fill(new Path2D(sky.far));
        c.fillStyle = '#000';
        c.lineWidth = 4;
        c.strokeStyle = '#000';
        c.stroke(new Path2D(sky.lines));
        c.lineWidth = 2.4;
        c.stroke(new Path2D(sky.cables));
        c.fill(new Path2D(sky.mid));
        c.restore();
      });
      const bits = atkinson(g, LW, LH);
      // crisp silhouettes on top of the dither (solid black), then white windows
      const mid = maskOf(LW, LH, (c) => {
        c.scale(1 / S, 1 / S);
        c.fill(new Path2D(sky.mid));
      });
      for (let i = 0; i < bits.length; i++) if (mid[i]) bits[i] = 0;
      const wins = maskOf(LW, LH, (c) => {
        c.scale(1 / S, 1 / S);
        sky.windows.filter((w) => w.arch).forEach((w) => c.fill(new Path2D(w.d)));
      }, 90);
      for (let y = 0; y < LH; y++) for (let x = 0; x < LW; x++) if (wins[y * LW + x]) bits[y * LW + x] = y % 3 === 0 ? 0 : 1; // server-rack slats
      sky.windows.forEach((w, k) => {
        if (w.arch || k % 2) return;
        const x = Math.round(w.x / S);
        const y = Math.round(w.y / S);
        if (mid[y * LW + x]) bits[y * LW + x] = 1;
      });
      // rose window: a little eye
      for (let y = -6; y <= 6; y++)
        for (let x = -6; x <= 6; x++) {
          const d = Math.hypot(x, y);
          if (d > 6.2) continue;
          bits[Math.round(rose.y + y) * LW + Math.round(rose.x + x)] = d < 1.6 ? 0 : d < 3.2 ? ((x + y) & 1 ? 1 : 0) : d > 5.2 ? 0 : 1;
        }
      sky.beacons.forEach((b, k) => {
        if (Math.sin(f / 6 + k * 2.1) > 0) {
          const x = Math.round(b.x / S);
          const y = Math.round(b.y / S) - 1;
          if (y > 0) bits[y * LW + x] = 1;
        }
      });

      // ---------- WORDMARK: bitmap serif, Outline + Shadow style ----------
      const size = 84;
      const font = `900 ${size}px ${FONT.news}`;
      const L = layoutWordmark({font, tracking: 2, orb: 0.6, gapL: 0.12, gapR: 0.36, sink: 0});
      const bx = LW / 2;
      const by = 150;
      const letters = maskOf(LW, LH, (c) => {
        c.font = font;
        (c as any).letterSpacing = '2px';
        c.fillText('MR', Math.round(bx + L.mrX), by);
        c.fillText('MAS', Math.round(bx + L.masX), by);
      }, 110);
      const or = Math.round(L.orb.r);
      const ocx = Math.round(bx + L.orb.cx);
      const ocy = by - or - 1;
      const orb = new Uint8Array(LW * LH);
      for (let y = -or - 1; y <= or + 1; y++) for (let x = -or - 1; x <= or + 1; x++) if (x * x + y * y <= (or + 0.3) ** 2) orb[(ocy + y) * LW + ocx + x] = 1;
      const logo = new Uint8Array(LW * LH);
      for (let i = 0; i < logo.length; i++) logo[i] = letters[i] | orb[i];
      let shadow = new Uint8Array(LW * LH);
      for (let k = 1; k <= 4; k++) {
        const sm = shift(logo, LW, LH, k, k);
        for (let i = 0; i < shadow.length; i++) shadow[i] |= sm[i];
      }
      const body = new Uint8Array(LW * LH);
      for (let i = 0; i < body.length; i++) body[i] = logo[i] | shadow[i];
      // knock-out plate so the type reads over the dither
      let plate = body;
      for (let k = 0; k < 3; k++) plate = dilate(plate, LW, LH, k !== 1);
      const outline = dilate(logo, LW, LH, true);
      for (let i = 0; i < bits.length; i++) {
        if (plate[i]) bits[i] = 1;
        if (shadow[i]) bits[i] = 0;
        if (outline[i] && !logo[i]) bits[i] = 0;
        if (logo[i]) bits[i] = 1;
      }
      // THE ORB: a lit 1-bit sphere (ordered dither, key light upper-right) with a machined iris
      const cur = (() => {
        const t = easeInOut(clamp((f - 6) / 50));
        return {x: Math.round(ocx + or * 0.62 + 70 * (1 - t)), y: Math.round(ocy + or * 0.55 + 60 * (1 - t))};
      })();
      const lx = clamp((cur.x - ocx) / 50, -0.7, 0.7);
      const ly = clamp((cur.y - ocy) / 50, -0.7, 0.7);
      const ir = or * 0.5;
      const icx = lx * or * 0.42;
      const icy = ly * or * 0.42;
      const Lx = 0.55;
      const Ly = -0.6;
      const Lz = 0.58;
      for (let y = -or; y <= or; y++)
        for (let x = -or; x <= or; x++) {
          const i = (ocy + y) * LW + ocx + x;
          if (!orb[i]) continue;
          const nx = x / or;
          const ny = y / or;
          const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
          const lam = Math.max(0, nx * Lx + ny * Ly + nz * Lz);
          // chrome-ish: lambert + a hard reflected horizon line + bright rim bounce on the left
          let v = 0.22 + lam * 1.15;
          if (Math.abs(ny - 0.34 - nx * nx * 0.12) < 0.07) v = 0.05;
          if (nx < -0.75 && ny > 0) v = 0.55;
          let on = v > BAYER4[((ocy + y) & 3) * 4 + ((ocx + x) & 3)] ? 1 : 0;
          const di = Math.hypot(x - icx, y - icy);
          if (di <= ir + 1.2) on = 0;
          if (di <= ir - 0.6) on = di < ir * 0.46 ? 0 : di < ir * 0.62 ? 1 : (x + y) & 1 ? 1 : 0;
          bits[i] = on;
        }
      const hx = ocx + Math.round(icx + ir * 0.35);
      const hy = ocy + Math.round(icy - ir * 0.35);
      bits[hy * LW + hx] = 1;
      bits[hy * LW + hx + 1] = 1;
      bits[(hy + 1) * LW + hx] = 1;

      // ---------- subtitle on a plate ----------
      const sub = 'now in low-key research preview';
      const sw = bitWidth(sub);
      const sx = Math.round(LW / 2 - sw / 2);
      const sy = by + 20;
      for (let y = sy - 3; y < sy + 12; y++) for (let x = sx - 5; x < sx + sw + 5; x++) bits[y * LW + x] = 1;
      for (let x = sx - 5; x < sx + sw + 5; x++) {
        bits[(sy - 4) * LW + x] = 0;
        bits[(sy + 12) * LW + x] = 0;
        bits[(sy + 13) * LW + x + 1] = 0;
      }
      for (let y = sy - 4; y <= sy + 12; y++) {
        bits[y * LW + sx - 6] = 0;
        bits[y * LW + sx + sw + 5] = 0;
        bits[(y + 1) * LW + sx + sw + 6] = 0;
      }
      bitText(sub).forEach(([x, y]) => (bits[(sy + y) * LW + sx + x] = 0));

      // ---------- arrow cursor (1px white halo so it reads over the dither) ----------
      ARROW.forEach((row, y) => {
        for (let x = 0; x < row.length; x++) {
          if (row[x] === '.') continue;
          for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
            const X = cur.x + x + dx;
            const Y = cur.y + y + dy;
            if (X >= 0 && Y >= 0 && X < LW && Y < LH) bits[Y * LW + X] = 1;
          }
        }
      });
      ARROW.forEach((row, y) => {
        for (let x = 0; x < row.length; x++) {
          if (row[x] === '.') continue;
          const X = cur.x + x;
          const Y = cur.y + y;
          if (X < 0 || Y < 0 || X >= LW || Y >= LH) continue;
          bits[Y * LW + X] = row[x] === 'X' ? 0 : 1;
        }
      });
      // rounded CRT-mask corners
      for (let y = 0; y < 5; y++)
        for (let x = 0; x < 5; x++) {
          if ((5 - x) ** 2 + (5 - y) ** 2 <= 25) continue;
          for (const [X, Y] of [
            [x, y],
            [LW - 1 - x, y],
            [x, LH - 1 - y],
            [LW - 1 - x, LH - 1 - y],
          ])
            bits[Y * LW + X] = 0;
        }
      void R;

      const img = out.createImageData(LW, LH);
      for (let i = 0; i < LW * LH; i++) {
        const c = bits[i] ? 255 : 0;
        img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = c;
        img.data[i * 4 + 3] = 255;
      }
      const tmp = document.createElement('canvas');
      tmp.width = LW;
      tmp.height = LH;
      tmp.getContext('2d')!.putImageData(img, 0, 0);
      out.imageSmoothingEnabled = false;
      out.drawImage(tmp, 0, 0, LW * S, LH * S);
    },
    [f, sky],
  );
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <canvas ref={ref} width={W} height={H} style={{width: W, height: H, imageRendering: 'pixelated'}} />
    </AbsoluteFill>
  );
};
