import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../theme/fonts';
import {buildSkyline} from './skyline';
import {bitText, bitWidth} from './bitfont';
import {IndexBuf, dilate, maskOf, shift} from './raster';
import {useCanvasDraw} from './raster';
import {H, TitleProps, W, clamp, easeBack, layoutWordmark, rng, useFontsReady, useTitleFrame} from './common';

/**
 * title-pixel — 16-bit title screen. Native 384x216 at 5x, 32-colour palette.
 * Banded dusk sky with checker-dither seams, parallax skyline, sweeping searchlights, and a
 * chrome-over-sunset extruded logo (auto-shaded from a thresholded font: top rim light, horizon
 * line, extrusion, 1px outline). THE ORB is a pixel chrome eye with a twinkle.
 */
const LW = 384;
const LH = 216;
const S = 5;

// prettier-ignore
const PAL = [
  '#0D0B1E', '#171537', '#231D4E', '#35245F', '#4E2A6B', '#6E3070', '#933A6E', '#B8496A', '#D9606A', '#EF8269', '#F9A86E', '#FFD08A', // 0-11 sky ramp
  '#07060F', '#110E24', '#1C1838', '#2A2250', // 12-15 silhouettes
  '#FFE9A8', '#FFB85C', '#7FF6FF', '#2FB8D6', '#FF4A4A', // 16-20 lights
  '#FFFFFF', '#D8F4FF', '#9FD2F0', '#5F95D0', '#3A5CA8', '#243A78', '#16204A', '#0A0E24', // 21-28 chrome ramp + outline
  '#1AE0FF', '#0B6E9E', '#F25C3C', // 29-31 iris, accent
];
const SKY_TOP = 0;
const HZ = 178; // horizon row

export const TitlePixel: React.FC<TitleProps> = (props) => {
  const f = useTitleFrame(props);
  const ready = useFontsReady(['400 60px "Archivo Black"']);
  const sky = useMemo(() => buildSkyline({seed: 31, ground: LH * S + 6, u: 0.47}), []);

  const ref = useCanvasDraw(
    ready,
    (cv) => {
      const out = cv.getContext('2d')!;
      const B = new IndexBuf(LW, LH, 0);
      const R = rng(7);

      // ---------- sky: banded ramp, checker dither on the band seams ----------
      for (let y = 0; y < LH; y++) {
        const t = clamp((y - SKY_TOP) / HZ);
        const v = Math.pow(t, 1.25) * 11;
        const b = Math.min(11, Math.floor(v));
        const fr = v - b;
        for (let x = 0; x < LW; x++) {
          let c = b;
          if (fr > 0.68 && b < 11) c = (x + y) % 2 ? b : b + 1;
          if (fr > 0.9 && b < 11) c = b + 1;
          B.set(x, y, c);
        }
      }
      // stars in the upper bands
      for (let k = 0; k < 60; k++) {
        const x = Math.floor(R() * LW);
        const y = Math.floor(R() * 70);
        const tw = Math.sin(f / 5 + k * 1.3) > 0.3;
        B.set(x, y, tw ? 22 : B.get(x, y) + 2);
      }
      // ---------- searchlights sweeping out of the cathedral ----------
      const ox = sky.cx / S;
      const oy = (sky.ground - 300 * sky.u) / S;
      for (const [base, spd, ph] of [
        [-0.42, 0.9, 0],
        [0.38, 0.7, 2],
      ] as const) {
        const a = -Math.PI / 2 + base + 0.12 * Math.sin(f / 24 * spd + ph);
        const w = 0.045;
        for (let y = 0; y < oy; y++)
          for (let x = 0; x < LW; x++) {
            const ang = Math.atan2(y - oy, x - ox);
            const d = Math.abs(ang - a);
            if (d < w) {
              const cur = B.get(x, y);
              const lift = d < w * 0.45 ? 2 : 1;
              if ((x + y) % 2 === 0 || lift === 2) B.set(x, y, Math.min(11, cur + lift));
            }
          }
      }
      // ---------- sunset clouds: per-column puff profile, flat bottoms, 3-row lit undersides ----------
      const clouds = [
        [70, 44, 150, 15, 1],
        [318, 30, 170, 13, -1],
        [36, 150, 150, 11, 1],
        [356, 138, 130, 12, -1],
      ];
      clouds.forEach(([cx, cy, cw, ch, dir], ci) => {
        const drift = Math.round(f * 0.2 * dir);
        const r2 = rng(40 + ci);
        const bumps = Array.from({length: 6}, () => ({c: (r2() - 0.5) * 0.9, w: 0.12 + r2() * 0.16, h: 0.45 + r2() * 0.55}));
        for (let x = Math.floor(-cw / 2); x <= cw / 2; x++) {
          const t = x / (cw / 2);
          let hgt = 0;
          for (const bm of bumps) hgt = Math.max(hgt, bm.h * Math.sqrt(Math.max(0, 1 - ((t - bm.c) / bm.w) ** 2)));
          hgt *= 1 - Math.pow(Math.abs(t), 3);
          const hh = Math.round(hgt * ch);
          const X = Math.round(cx + x + drift);
          for (let k = 0; k < hh; k++) {
            const Y = cy - k;
            const band = B.get(((X % LW) + LW) % LW, Y);
            if (band < 0 || band > 11) continue;
            const c = k === 0 ? band + 3 : k === 1 ? band + 2 : k < 4 ? band + 1 : k === hh - 1 ? band - 1 : band - 2;
            B.set(((X % LW) + LW) % LW, Y, clamp(c, 0, 11));
          }
        }
      });

      // ---------- skyline (far haze, mid silhouette, ground) ----------
      const far = maskOf(LW, LH, (c) => {
        c.scale(1 / S, 1 / S);
        c.fill(new Path2D(sky.far));
      });
      for (let i = 0; i < LW * LH; i++) if (far[i]) B.px[i] = i >= LW && !far[i - LW] ? 15 : 14;
      // far cooling-tower steam: solid puffs, lit from below by the glow
      sky.stacks.forEach((st, k) => {
        const sx = st.x / S;
        const sy = st.y / S;
        for (let j = 0; j < 4; j++) {
          const py = sy - 2 - j * 5 - ((f / 8) % 5);
          const rr = 2.5 + j * 1.3;
          for (let y = -rr; y <= rr; y++)
            for (let x = -rr * 1.5; x <= rr * 1.5; x++) {
              if ((x / 1.5) ** 2 + y * y > rr * rr) continue;
              const X = Math.round(sx + x + j * 2 + k);
              const Y = Math.round(py + y);
              const band = B.get(X, Y);
              if (band < 0 || band > 11) continue;
              const rim = (x / 1.5) ** 2 + (y + 1) ** 2 > rr * rr && y > 0;
              B.set(X, Y, rim ? Math.min(11, band + 1) : Math.max(3, band - 2));
            }
        }
      });
      const lines = maskOf(LW, LH, (c) => {
        c.scale(1 / S, 1 / S);
        c.lineWidth = 5;
        c.stroke(new Path2D(sky.lines));
      }, 150);
      const mid = maskOf(LW, LH, (c) => {
        c.scale(1 / S, 1 / S);
        c.fill(new Path2D(sky.mid));
      });
      for (let i = 0; i < LW * LH; i++) {
        if (lines[i]) B.px[i] = 13;
        if (mid[i]) B.px[i] = i >= LW && !mid[i - LW] ? 14 : 13;
      }
      // cables: single-pixel sagging lines
      const cab = maskOf(LW, LH, (c) => {
        c.scale(1 / S, 1 / S);
        c.lineWidth = 3.2;
        c.stroke(new Path2D(sky.cables));
      }, 110);
      for (let i = 0; i < LW * LH; i++) if (cab[i] && !mid[i]) B.px[i] = 12;
      // ground strip
      for (let y = LH - 8; y < LH; y++) for (let x = 0; x < LW; x++) B.set(x, y, 12);
      // windows
      const winM = maskOf(LW, LH, (c) => {
        c.scale(1 / S, 1 / S);
        sky.windows.filter((w) => w.arch).forEach((w) => c.fill(new Path2D(w.d)));
      }, 100);
      const shimmer = Math.floor(f / 3);
      for (let y = 0; y < LH; y++)
        for (let x = 0; x < LW; x++) {
          const i = y * LW + x;
          if (!winM[i]) continue;
          B.px[i] = (y + shimmer) % 5 === 0 ? 19 : 18;
        }
      sky.windows
        .filter((w) => !w.arch)
        .forEach((w, k) => {
          if (k % 2) return;
          const x = Math.round(w.x / S);
          const y = Math.round(w.y / S);
          if (mid[y * LW + x]) B.set(x, y, w.cool ? ((k + shimmer) % 7 === 0 ? 21 : 19) : 17);
        });
      // door warm glow + rose window
      const rx = Math.round(sky.rose.cx / S);
      const ry = Math.round(sky.rose.cy / S);
      const rr = Math.max(3, Math.round(sky.rose.r / S));
      for (let y = -rr; y <= rr; y++)
        for (let x = -rr; x <= rr; x++) {
          const d = Math.hypot(x, y);
          if (d > rr + 0.3) continue;
          B.set(rx + x, ry + y, d < 1.5 ? 28 : d < 2.5 ? 29 : d > rr - 0.8 ? 19 : 18);
        }
      // beacons blink
      sky.beacons.forEach((b, k) => {
        if (Math.sin(f / 6 + k * 2.1) > -0.1) B.set(Math.round(b.x / S), Math.round(b.y / S) - 1, 20);
      });

      // ---------- LOGO ----------
      const size = 60;
      const font = `400 ${size}px ${FONT.headline}`;
      const L = layoutWordmark({font, tracking: 1, orb: 0.62, gapL: 0.1, gapR: 0.34, sink: 0});
      const drop = Math.round((1 - easeBack(clamp((f - 2) / 22), 1.4)) * -90);
      const bx = Math.round(LW / 2);
      const by = 92 + drop;
      const top = by - Math.round(L.capH);
      const letters = maskOf(LW, LH, (c) => {
        c.font = font;
        (c as any).letterSpacing = '1px';
        c.fillText('MR', bx + L.mrX, by);
        c.fillText('MAS', bx + L.masX, by);
      }, 120);
      const ocx = Math.round(bx + L.orb.cx);
      const or = Math.round(L.orb.r);
      const ocy = by - or - 1;
      const orb = new Uint8Array(LW * LH);
      for (let y = -or - 1; y <= or + 1; y++)
        for (let x = -or - 1; x <= or + 1; x++) if (x * x + y * y <= (or + 0.35) ** 2) orb[(ocy + y) * LW + ocx + x] = 1;
      const logo = new Uint8Array(LW * LH);
      for (let i = 0; i < logo.length; i++) logo[i] = letters[i] | orb[i];
      // extrusion (down-right), then outline around everything
      let ext = new Uint8Array(LW * LH);
      for (let k = 1; k <= 5; k++) {
        const sm = shift(logo, LW, LH, k > 3 ? 3 : k, k);
        for (let i = 0; i < ext.length; i++) ext[i] |= sm[i];
      }
      const all = new Uint8Array(LW * LH);
      for (let i = 0; i < all.length; i++) all[i] = ext[i] | logo[i];
      const ol = dilate(all, LW, LH, true);
      for (let i = 0; i < LW * LH; i++) if (ol[i] && !all[i]) B.px[i] = 28;
      for (let i = 0; i < LW * LH; i++) {
        if (!ext[i] || logo[i]) continue;
        // extrusion side: lit rim on top-facing faces
        const upIsLogo = i >= LW && logo[i - LW];
        B.px[i] = upIsLogo ? 26 : (i % LW) % 2 ? 27 : 27;
      }
      // chrome fill by row (sky above the horizon line, sunset below)
      const ramp = (t: number) => (t < 0.12 ? 22 : t < 0.3 ? 23 : t < 0.46 ? 24 : t < 0.54 ? 25 : t < 0.6 ? 21 : t < 0.66 ? 27 : t < 0.76 ? 31 : t < 0.9 ? 17 : 11);
      for (let y = 0; y < LH; y++)
        for (let x = 0; x < LW; x++) {
          const i = y * LW + x;
          if (!letters[i]) continue;
          const t = (y - top) / L.capH;
          let c = ramp(t);
          if (y > 0 && !letters[i - LW]) c = 21; // top rim light
          else if (x > 0 && !letters[i - 1] && t < 0.55) c = 22;
          B.px[i] = c;
        }
      // THE ORB: pixel chrome eye
      const look = [Math.round(Math.sin(f / 14) * 2) / or, 0.08];
      const ir = or * 0.5;
      const icx = look[0] * or * 0.55;
      const icy = look[1] * or;
      for (let y = -or; y <= or; y++)
        for (let x = -or; x <= or; x++) {
          const i = (ocy + y) * LW + ocx + x;
          if (!orb[i]) continue;
          const ny = y / or;
          const nx = x / or;
          let c: number;
          if (ny < 0.3) c = ny < -0.6 ? 26 : ny < -0.25 ? 25 : ny < 0.05 ? 24 : 23;
          else if (ny < 0.42) c = 21;
          else c = ny < 0.6 ? 27 : ny < 0.8 ? 31 : 17;
          if (nx * nx + ny * ny > 0.8 && nx < 0 && ny < 0.3) c = Math.min(27, c + 1);
          const di = Math.hypot(x - icx, y - icy);
          if (di <= ir + 0.9) c = 28;
          if (di <= ir) c = di < ir * 0.42 ? 28 : di < ir * 0.72 ? 29 : 30;
          B.px[i] = c;
        }
      B.set(ocx + Math.round(icx) + 1, ocy + Math.round(icy) - 2, 21);
      B.set(ocx + Math.round(or * 0.4), ocy - Math.round(or * 0.55), 21);
      B.set(ocx + Math.round(or * 0.4) + 1, ocy - Math.round(or * 0.55), 21);
      B.set(ocx + Math.round(or * 0.4), ocy - Math.round(or * 0.55) + 1, 22);
      // twinkle glints (4-point stars)
      const star = (sx: number, sy: number, phase: number) => {
        const s = Math.max(0, Math.sin(f / 7 + phase));
        const len = s > 0.8 ? 3 : s > 0.4 ? 2 : s > 0.1 ? 1 : 0;
        if (!len) return;
        B.set(sx, sy, 21);
        for (let k = 1; k <= len; k++) {
          const c = k === len ? 22 : 21;
          B.set(sx + k, sy, c);
          B.set(sx - k, sy, c);
          B.set(sx, sy + k, c);
          B.set(sx, sy - k, c);
        }
      };
      star(ocx + Math.round(or * 0.6), ocy - Math.round(or * 0.75), 0);
      star(Math.round(bx + L.mrX + 5), top + 1, 2.2);
      star(Math.round(bx + L.masX + L.masW - 4), by - 4, 4.1);

      // ---------- subtitle (bitmap font) ----------
      const sub = 'now in low-key research preview';
      const sx = Math.round(LW / 2 - bitWidth(sub) / 2);
      const sy = by + 16;
      const subOn = f >= 22 || props.frame !== undefined;
      if (subOn) {
        const px = bitText(sub);
        px.forEach(([x, y]) => B.set(sx + x + 1, sy + y + 1, 28));
        px.forEach(([x, y]) => B.set(sx + x, sy + y, 16));
      }
      B.blit(out, PAL, S);
    },
    [f, sky],
  );
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <canvas ref={ref} width={W} height={H} style={{width: W, height: H, imageRendering: 'pixelated'}} />
    </AbsoluteFill>
  );
};

