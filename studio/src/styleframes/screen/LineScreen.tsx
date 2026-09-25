import React, {useLayoutEffect, useRef} from 'react';
import {hexToRgb} from '../../shared/theme/color';

/**
 * LINE-SCREEN VIDEO: the native look of every camera feed in the SCREENLIFE structure.
 * A painter draws a grey "value" image (0 = no light, 1 = full light); the feed is re-drawn as
 * horizontal scanlines whose thickness is the light (a print line-screen that also reads as video),
 * in a per-caller duotone: `ink` = the light color, `hi` = hot highlight core, on a dark `bg`.
 *
 * Pure canvas, synchronous draw in a layout effect (deterministic per frame).
 */
export interface LineScreenProps {
  width: number;
  height: number;
  /** Output supersampling so camera zooms stay crisp. */
  dpr?: number;
  paint: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
  bg: string;
  ink: string;
  hi: string;
  /** Line pitch in px (world units). */
  pitch?: number;
  mode?: 'lines' | 'dots';
  gain?: number;
  gamma?: number;
  /** Blur (px) of the value image before screening: softens the flat tonal planes into "photographic" light. */
  soften?: number;
  /** Hairline kept in the darks so black areas still read as screen. */
  floor?: number;
  /** Highlight threshold for the hot core pass. */
  hiAt?: number;
  /** Per-row horizontal shift (glitch / sync roll). */
  rowShift?: (row: number) => number;
  /** Per-row gain (roll bars, interference). */
  rowGain?: (row: number) => number;
  /** Change to force a redraw; omit to redraw on every render (animated feeds). */
  staticKey?: string;
  style?: React.CSSProperties;
}

export const LineScreen: React.FC<LineScreenProps> = (p) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const bufRef = useRef<HTMLCanvasElement | null>(null);
  const softRef = useRef<HTMLCanvasElement | null>(null);
  const {width: w, height: h, dpr = 2} = p;

  useLayoutEffect(
    () => {
      const cv = ref.current;
      if (!cv) return;
      const bw = Math.ceil(w);
      const bh = Math.ceil(h);
      if (!bufRef.current) bufRef.current = document.createElement('canvas');
      const buf = bufRef.current;
      buf.width = bw;
      buf.height = bh;
      const b = buf.getContext('2d', {willReadFrequently: true})!;
      b.setTransform(1, 0, 0, 1, 0, 0);
      b.fillStyle = '#000';
      b.fillRect(0, 0, bw, bh);
      b.save();
      p.paint(b, w, h);
      b.restore();
      let src: CanvasRenderingContext2D = b;
      if (p.soften && p.soften > 0) {
        if (!softRef.current) softRef.current = document.createElement('canvas');
        const sc = softRef.current;
        sc.width = bw;
        sc.height = bh;
        const s = sc.getContext('2d', {willReadFrequently: true})!;
        s.filter = `blur(${p.soften}px)`;
        s.drawImage(buf, 0, 0);
        s.filter = 'none';
        src = s;
      }
      const data = src.getImageData(0, 0, bw, bh).data;
      const gain = p.gain ?? 1;
      const gamma = p.gamma ?? 1;
      const at = (x: number, y: number) => {
        const xi = Math.max(0, Math.min(bw - 1, Math.round(x)));
        const yi = Math.max(0, Math.min(bh - 1, Math.round(y)));
        const v = (data[(yi * bw + xi) * 4] / 255) * gain;
        return Math.pow(Math.max(0, Math.min(1, v)), gamma);
      };

      const o = cv.getContext('2d')!;
      o.setTransform(dpr, 0, 0, dpr, 0, 0);
      o.clearRect(0, 0, w, h);
      if (p.bg !== 'transparent') {
        o.fillStyle = p.bg;
        o.fillRect(0, 0, w, h);
      }
      const pitch = p.pitch ?? 4;
      const floor = p.floor ?? 0.07;
      const hiAt = p.hiAt ?? 0.66;

      if ((p.mode ?? 'lines') === 'lines') {
        const step = 1.5;
        const rows = Math.ceil(h / pitch);
        const drawPass = (color: string, widthOf: (v: number) => number, alpha = 1) => {
          o.fillStyle = color;
          o.globalAlpha = alpha;
          for (let k = 0; k < rows; k++) {
            const yc = (k + 0.5) * pitch;
            const dx = p.rowShift ? p.rowShift(k) : 0;
            const rg = p.rowGain ? p.rowGain(k) : 1;
            const top: number[] = [];
            const ws: number[] = [];
            for (let x = 0; x <= w + step; x += step) {
              const sx = x - dx;
              const v = ((at(sx, yc - pitch * 0.3) + at(sx, yc) * 2 + at(sx, yc + pitch * 0.3)) / 4) * rg;
              ws.push(widthOf(Math.min(1, v)));
              top.push(x);
            }
            o.beginPath();
            o.moveTo(top[0], yc - ws[0] / 2);
            for (let i = 1; i < top.length; i++) o.lineTo(top[i], yc - ws[i] / 2);
            for (let i = top.length - 1; i >= 0; i--) o.lineTo(top[i], yc + ws[i] / 2);
            o.closePath();
            o.fill();
          }
          o.globalAlpha = 1;
        };
        drawPass(p.ink, (v) => Math.max(floor, v) * pitch * 0.94);
        drawPass(p.hi, (v) => Math.max(0, (v - hiAt) / (1 - hiAt)) * pitch * 0.62);
      } else {
        // rotated dot screen (45deg)
        const a = Math.PI / 4;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        const R = Math.hypot(w, h);
        const dot = (color: string, rOf: (v: number) => number) => {
          o.fillStyle = color;
          o.beginPath();
          for (let u = -R; u < R; u += pitch)
            for (let q = -R; q < R; q += pitch) {
              const x = w / 2 + u * ca - q * sa;
              const y = h / 2 + u * sa + q * ca;
              if (x < -pitch || y < -pitch || x > w + pitch || y > h + pitch) continue;
              const r = rOf(at(x, y));
              if (r < 0.15) continue;
              o.moveTo(x + r, y);
              o.arc(x, y, r, 0, Math.PI * 2);
            }
          o.fill();
        };
        dot(p.ink, (v) => Math.sqrt(Math.max(floor * 0.4, v)) * pitch * 0.58);
        dot(p.hi, (v) => Math.sqrt(Math.max(0, (v - hiAt) / (1 - hiAt))) * pitch * 0.4);
      }
    },
    p.staticKey !== undefined ? [p.staticKey, w, h, dpr] : undefined,
  );

  return <canvas ref={ref} width={Math.round(w * dpr)} height={Math.round(h * dpr)} style={{width: w, height: h, display: 'block', ...p.style}} />;
};

/** Grey value as a canvas fill string. */
export const gv = (v: number) => {
  const c = Math.round(Math.max(0, Math.min(1, v)) * 255);
  return `rgb(${c},${c},${c})`;
};

/** Mix two hex colors -> rgb() string (for per-frame light color animation). */
export const mixRgb = (a: string, b: string, t: number) => {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const c = A.map((x, i) => Math.round(x + (B[i] - x) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};
