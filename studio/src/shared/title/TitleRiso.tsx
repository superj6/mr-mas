import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../theme/fonts';
import {hexToRgb} from '../theme/color';
import {buildSkyline} from './skyline';
import {offscreen, useCanvasDraw} from './raster';
import {H, TitleProps, W, clamp, easeOut, layoutWordmark, rng, useFontsReady, useTitleFrame, vnoise} from './common';

/**
 * title-riso — two-ink risograph poster (Riso Blue + Fluorescent Pink on cream stock).
 * Each ink is painted as a density map, then screened with a real AM halftone (euclidean dot,
 * 15deg / 75deg), misregistered, mottled like drum ink, and overprinted (multiply) on the paper.
 */
const PAPER = '#F2ECDF';
const INK_A = '#0078BF'; // riso blue
const INK_B = '#FF48B0'; // fluorescent pink
const CELL = 9;

type Painter = (c: CanvasRenderingContext2D) => void;
const density = (paint: Painter): Uint8ClampedArray => {
  const c = offscreen(W, H);
  c.fillStyle = '#000';
  c.fillRect(0, 0, W, H);
  paint(c);
  return c.getImageData(0, 0, W, H).data;
};

export const TitleRiso: React.FC<TitleProps> = (props) => {
  const f = useTitleFrame(props);
  const ready = useFontsReady([`400 360px Anton`, `400 30px "JetBrains Mono"`, `700 30px "JetBrains Mono"`]);
  const sky = useMemo(() => buildSkyline({seed: 5, ground: H + 4, u: 0.43}), []);
  // coarse mottling grid (drum ink unevenness), deterministic
  const mottle = useMemo(() => {
    const gw = Math.ceil(W / 24) + 2;
    const gh = Math.ceil(H / 24) + 2;
    const a = new Float32Array(gw * gh);
    const b = new Float32Array(gw * gh);
    for (let y = 0; y < gh; y++)
      for (let x = 0; x < gw; x++) {
        a[y * gw + x] = vnoise(x * 0.35, y * 0.35, 3) * 0.6 + vnoise(x * 1.1, y * 1.1, 4) * 0.4;
        b[y * gw + x] = vnoise(x * 0.35, y * 0.35, 9) * 0.6 + vnoise(x * 1.1, y * 1.1, 10) * 0.4;
      }
    return {gw, a, b};
  }, []);

  const ref = useCanvasDraw(
    ready,
    (cv) => {
      const out = cv.getContext('2d')!;
      const rose = sky.rose;
      const font = `400 360px ${FONT.cardName}`;
      const L = layoutWordmark({font, tracking: 6, orb: 0.5, gapL: 0.07, gapR: 0.2, sink: 0.01});
      const bx = W / 2;
      const by = 560;
      const slide = (1 - easeOut(clamp(f / 20))) * 60;
      const breathe = 0.5 + 0.5 * Math.sin(f / 16);
      const look = [0.12 + 0.25 * Math.sin(f / 20), 0.12];

      const rays = (c: CanvasRenderingContext2D, alpha: number, n: number, seed: number) => {
        const R = rng(seed);
        for (let k = 0; k < n; k++) {
          const a = -Math.PI + ((k + 0.5) / n) * Math.PI + (R() - 0.5) * 0.08;
          const w = 0.015 + R() * 0.03;
          c.fillStyle = `rgba(255,255,255,${alpha * (0.5 + R() * 0.5)})`;
          c.beginPath();
          c.moveTo(rose.cx, rose.cy);
          c.lineTo(rose.cx + Math.cos(a - w) * 2200, rose.cy + Math.sin(a - w) * 2200);
          c.lineTo(rose.cx + Math.cos(a + w) * 2200, rose.cy + Math.sin(a + w) * 2200);
          c.fill();
        }
      };
      const orbShade = (c: CanvasRenderingContext2D, ink: 'A' | 'B') => {
        const ocx = bx + L.orb.cx;
        const ocy = by + L.orb.cy;
        const r = L.orb.r;
        c.save();
        c.beginPath();
        c.arc(ocx, ocy, r, 0, Math.PI * 2);
        c.clip();
        const ix = ocx + look[0] * r * 0.5;
        const iy = ocy + look[1] * r * 0.5;
        const ri = r * 0.5;
        const disc = (x: number, y: number, rr: number, fill: string) => {
          c.fillStyle = fill;
          c.beginPath();
          c.arc(x, y, rr, 0, Math.PI * 2);
          c.fill();
        };
        if (ink === 'B') {
          // pink: the chrome body, lighter toward the key light (upper right)
          const g = c.createRadialGradient(ocx + r * 0.45, ocy - r * 0.5, r * 0.05, ocx - r * 0.1, ocy + r * 0.1, r * 1.2);
          g.addColorStop(0, 'rgba(255,255,255,0.05)');
          g.addColorStop(0.45, 'rgba(255,255,255,0.55)');
          g.addColorStop(1, 'rgba(255,255,255,1)');
          c.fillStyle = g;
          c.fillRect(ocx - r, ocy - r, 2 * r, 2 * r);
          disc(ix, iy, ri * 1.12, '#000');
          disc(ix, iy, ri * 0.62, '#fff'); // inner iris: pink over blue = violet glow
          disc(ix, iy, ri * (0.3 + 0.05 * breathe), '#fff');
        } else {
          // blue: form-shadow crescent lower-left (overprints violet on the pink body)
          c.save();
          c.beginPath();
          c.arc(ocx, ocy, r, 0, Math.PI * 2);
          c.arc(ocx + r * 0.32, ocy - r * 0.3, r * 1.02, 0, Math.PI * 2, true);
          c.fillStyle = 'rgba(255,255,255,0.7)';
          c.fill('evenodd');
          c.restore();
          disc(ix, iy, ri * 1.12, '#000');
          disc(ix, iy, ri, '#fff'); // iris: solid blue
          disc(ix, iy, ri * 0.62, 'rgba(255,255,255,0.45)');
          disc(ix, iy, ri * (0.3 + 0.05 * breathe), '#fff'); // pupil: both inks = deepest
        }
        // specular = bare paper in both inks
        c.fillStyle = '#000';
        c.beginPath();
        c.ellipse(ocx + r * 0.42, ocy - r * 0.5, r * 0.2, r * 0.12, -0.6, 0, Math.PI * 2);
        c.fill();
        c.beginPath();
        c.arc(ix + ri * 0.28, iy - ri * 0.3, ri * 0.13, 0, Math.PI * 2);
        c.fill();
        c.restore();
      };
      const type = (c: CanvasRenderingContext2D, dx: number, dy: number) => {
        c.font = font;
        (c as any).letterSpacing = '6px';
        c.fillStyle = '#fff';
        c.fillText('MR', bx + L.mrX + dx, by + dy + slide);
        c.fillText('MAS', bx + L.masX + dx, by + dy - slide);
        (c as any).letterSpacing = '0px';
      };
      const knockOrb = (c: CanvasRenderingContext2D, grow = 0) => {
        c.fillStyle = '#000';
        c.beginPath();
        c.arc(bx + L.orb.cx, by + L.orb.cy, L.orb.r + grow, 0, Math.PI * 2);
        c.fill();
      };

      // ---------------- INK A: BLUE ----------------
      const A = density((c) => {
        const g = c.createLinearGradient(0, 0, 0, 760);
        g.addColorStop(0, 'rgba(255,255,255,0.62)');
        g.addColorStop(0.45, 'rgba(255,255,255,0.3)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
        // light rays cut the blue sky (paper shows through)
        c.globalCompositeOperation = 'destination-out';
        rays(c, 0.75, 22, 12);
        c.globalCompositeOperation = 'source-over';
        c.fillStyle = 'rgba(255,255,255,0.42)';
        c.fill(new Path2D(sky.far));
        c.fillStyle = '#fff';
        c.strokeStyle = '#fff';
        c.lineWidth = 2.2;
        c.stroke(new Path2D(sky.lines));
        c.lineWidth = 1.3;
        c.stroke(new Path2D(sky.cables));
        c.fill(new Path2D(sky.mid));
        // windows knocked out of blue (they print pink)
        c.fillStyle = '#000';
        sky.windows.forEach((w) => c.fill(new Path2D(w.d)));
        c.beginPath();
        c.arc(rose.cx, rose.cy, rose.r, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = '#fff';
        c.beginPath();
        c.arc(rose.cx, rose.cy, rose.r * 0.34, 0, Math.PI * 2);
        c.fill();
        // wordmark (solid blue) + orb
        knockOrb(c, 10);
        type(c, 0, 0);
        orbShade(c, 'A');
        // subtitle
        c.fillStyle = '#fff';
        c.font = `700 34px ${FONT.mono}`;
        (c as any).letterSpacing = '8px';
        c.textAlign = 'center';
        c.fillText('now in low-key research preview', W / 2 + 4, by + 100);
        (c as any).letterSpacing = '0px';
        c.textAlign = 'start';
        // crop marks
        c.lineWidth = 2;
        for (const [x, y, sx, sy] of [
          [40, 40, 1, 1],
          [W - 40, 40, -1, 1],
          [40, H - 40, 1, -1],
          [W - 40, H - 40, -1, -1],
        ]) {
          c.beginPath();
          c.moveTo(x - sx * 26, y);
          c.lineTo(x + sx * 10, y);
          c.moveTo(x, y - sy * 26);
          c.lineTo(x, y + sy * 10);
          c.stroke();
        }
      });
      // ---------------- INK B: FLUORESCENT PINK ----------------
      const B = density((c) => {
        c.save();
        c.translate(rose.cx, rose.cy);
        c.scale(1.7, 1);
        const g = c.createRadialGradient(0, 0, 10, 0, 0, 720);
        g.addColorStop(0, 'rgba(255,255,255,0.9)');
        g.addColorStop(0.42, `rgba(255,255,255,${0.62 + 0.06 * breathe})`);
        g.addColorStop(0.75, 'rgba(255,255,255,0.18)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        c.fillStyle = g;
        c.fillRect(-2000, -2000, 4000, 4000);
        c.restore();
        rays(c, 0.22, 22, 12);
        // flat pink sun disc behind the cathedral (solid ink, the poster's anchor shape)
        c.fillStyle = '#fff';
        c.beginPath();
        c.arc(rose.cx, H - 40, 330, 0, Math.PI * 2);
        c.fill();
        // hazy far campus sits in the glow a little
        c.fillStyle = 'rgba(0,0,0,0.25)';
        c.fill(new Path2D(sky.far));
        // silhouettes: pink stays off (clean blue), windows solid pink
        c.fillStyle = '#000';
        c.fill(new Path2D(sky.mid));
        sky.windows.forEach((w) => {
          c.fillStyle = w.arch && w.h > 70 && !w.cool ? 'rgba(255,255,255,0.5)' : '#fff';
          c.fill(new Path2D(w.d));
        });
        c.fillStyle = '#fff';
        c.beginPath();
        c.arc(rose.cx, rose.cy, rose.r, 0, Math.PI * 2);
        c.fill();
        // offset pink wordmark (the "shadow" plate)
        knockOrb(c, 10);
        c.save();
        c.filter = 'none';
        type(c, 14, 11);
        c.restore();
        orbShade(c, 'B');
        // paper band behind the subtitle (pink knocked out so the blue type prints clean)
        c.fillStyle = '#000';
        c.fillRect(W / 2 - 440, by + 62, 880, 56);
      });

      // ---------------- screen + overprint ----------------
      const img = out.createImageData(W, H);
      const P = hexToRgb(PAPER).map((v) => v / 255);
      const IA = hexToRgb(INK_A).map((v) => v / 255);
      const IB = hexToRgb(INK_B).map((v) => v / 255);
      const aA = (75 * Math.PI) / 180;
      const aB = (15 * Math.PI) / 180;
      const cA = Math.cos(aA);
      const sA = Math.sin(aA);
      const cB = Math.cos(aB);
      const sB = Math.sin(aB);
      const k = (2 * Math.PI) / CELL;
      const {gw, a: ma, b: mb} = mottle;
      // misregistration of the pink drum (px), with a hair of boil in motion
      const mdx = -6 + Math.round(Math.sin(Math.floor(f / 3) * 1.7));
      const mdy = 4;
      const R = rng(77 + Math.floor(f / 3));
      const speck = new Float32Array(4096);
      for (let i = 0; i < 4096; i++) speck[i] = R();
      for (let y = 0; y < H; y++) {
        const gy = y / 24;
        const gy0 = Math.floor(gy);
        const fy = gy - gy0;
        for (let x = 0; x < W; x++) {
          const i = y * W + x;
          const gx = x / 24;
          const gx0 = Math.floor(gx);
          const fx = gx - gx0;
          const j = gy0 * gw + gx0;
          const mA = (ma[j] * (1 - fx) + ma[j + 1] * fx) * (1 - fy) + (ma[j + gw] * (1 - fx) + ma[j + gw + 1] * fx) * fy;
          const mB = (mb[j] * (1 - fx) + mb[j + 1] * fx) * (1 - fy) + (mb[j + gw] * (1 - fx) + mb[j + gw + 1] * fx) * fy;
          // ink A
          const dA = A[i * 4] / 255;
          let covA = 0;
          if (dA > 0.004) {
            const u = x * cA + y * sA;
            const v = -x * sA + y * cA;
            const t = 0.5 + 0.25 * (Math.cos(u * k) + Math.cos(v * k));
            covA = clamp((dA - t) * 7 + 0.5);
            if (dA > 0.97) covA = 1;
            covA *= 0.8 + 0.2 * mA;
          }
          // ink B (sampled with misregistration)
          const xb = x - mdx;
          const yb = y - mdy;
          let covB = 0;
          if (xb >= 0 && yb >= 0 && xb < W && yb < H) {
            const dB = B[(yb * W + xb) * 4] / 255;
            if (dB > 0.004) {
              const u = x * cB + y * sB;
              const v = -x * sB + y * cB;
              const t = 0.5 + 0.25 * (Math.cos(u * k) + Math.cos(v * k));
              covB = clamp((dB - t) * 7 + 0.5);
              if (dB > 0.97) covB = 1;
              covB *= 0.84 + 0.16 * mB;
            }
          }
          // paper voids / speckle where the drum starved
          const s = speck[(x * 7 + y * 131) & 4095];
          if (s > 0.985) {
            covA *= 0.3;
            covB *= 0.4;
          }
          const pn = 0.975 + 0.025 * mA;
          for (let ch = 0; ch < 3; ch++) {
            const val = P[ch] * pn * (1 - covA * (1 - IA[ch])) * (1 - covB * (1 - IB[ch]));
            img.data[i * 4 + ch] = val * 255;
          }
          img.data[i * 4 + 3] = 255;
        }
      }
      out.putImageData(img, 0, 0);
    },
    [f, sky, mottle],
  );
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <canvas ref={ref} width={W} height={H} style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};
