import {useLayoutEffect, useState} from 'react';
import {continueRender, delayRender, useCurrentFrame} from 'remotion';

/** Shared helpers for the MR. MAS title cards (all styles). Deterministic only. */
export const W = 1920;
export const H = 1080;

export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const easeInOut = (t: number) => {
  const x = clamp(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
/** Overshoot ease (for anime slams). */
export const easeBack = (t: number, s = 1.9) => {
  const x = clamp(t) - 1;
  return 1 + (s + 1) * x * x * x + s * x * x;
};

/** Seeded PRNG (mulberry32). */
export const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Cheap deterministic hash noise in [0,1) for integer lattice coords. */
export const hash2 = (x: number, y: number, s = 0) => {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 2147483647)) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
/** Smooth value noise. */
export const vnoise = (x: number, y: number, s = 0) => {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi, s);
  const b = hash2(xi + 1, yi, s);
  const c = hash2(xi, yi + 1, s);
  const d = hash2(xi + 1, yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};
export const fbm = (x: number, y: number, s = 0, oct = 4) => {
  let t = 0;
  let amp = 0.5;
  let f = 1;
  for (let i = 0; i < oct; i++) {
    t += amp * vnoise(x * f, y * f, s + i * 17);
    f *= 2;
    amp *= 0.5;
  }
  return t / (1 - Math.pow(0.5, oct));
};

/** Every title component takes `frame` so a Still can pin the settled "hero" frame. */
export interface TitleProps {
  frame?: number;
}
/** Hero frame used by stills (everything revealed, idle motion mid-cycle). */
export const HERO = 60;
export const useTitleFrame = (p: TitleProps) => {
  const f = useCurrentFrame();
  return p.frame ?? f;
};

/** Block the render until the given CSS font specs are loaded (needed for canvas text + measuring). */
export const useFontsReady = (specs: string[]): boolean => {
  const [handle] = useState(() => delayRender('title-fonts'));
  const [ready, setReady] = useState(false);
  useLayoutEffect(() => {
    let done = false;
    Promise.all(specs.map((s) => document.fonts.load(s)))
      .catch(() => undefined)
      .then(() => {
        if (done) return;
        done = true;
        setReady(true);
        continueRender(handle);
      });
    return () => {
      done = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ready;
};

let mctx: CanvasRenderingContext2D | null = null;
const ctx2d = () => {
  if (!mctx) mctx = document.createElement('canvas').getContext('2d')!;
  return mctx;
};

export interface Measured {
  /** advance width without trailing tracking */
  w: number;
  capH: number;
  left: number;
  right: number;
}
/** Measure a run of text in a CSS font ("700 200px Anton"). */
export const measure = (font: string, text: string, tracking = 0): Measured => {
  const c = ctx2d();
  c.font = font;
  (c as any).letterSpacing = `${tracking}px`;
  const m = c.measureText(text);
  const mm = c.measureText('M');
  (c as any).letterSpacing = '0px';
  return {w: m.width - tracking, capH: mm.actualBoundingBoxAscent, left: m.actualBoundingBoxLeft, right: m.actualBoundingBoxRight};
};

export interface WordmarkLayout {
  /** x of "MR" text start, x of "MAS" text start (baseline y = 0, centered on x = 0). */
  mrX: number;
  masX: number;
  mrW: number;
  masW: number;
  orb: {cx: number; cy: number; r: number};
  width: number;
  capH: number;
}
/**
 * Lay out MR ◉ MAS with THE ORB as the period, sitting on the baseline.
 * orb = diameter / capHeight; gapL / gapR in cap-heights.
 */
export const layoutWordmark = (o: {font: string; tracking?: number; orb?: number; gapL?: number; gapR?: number; sink?: number}): WordmarkLayout => {
  const {font, tracking = 0, orb = 0.42, gapL = 0.08, gapR = 0.3, sink = 0.015} = o;
  const mr = measure(font, 'MR', tracking);
  const mas = measure(font, 'MAS', tracking);
  const capH = mr.capH;
  const r = (capH * orb) / 2;
  const mrW = mr.right;
  const cx0 = mrW + gapL * capH + r;
  const mas0 = cx0 + r + gapR * capH + mas.left;
  const total = mas0 + mas.right;
  const off = -total / 2;
  return {mrX: off, masX: mas0 + off, mrW, masW: mas.right, orb: {cx: cx0 + off, cy: -r + capH * sink, r}, width: total, capH};
};

/** Variable-width polyline -> filled polygon path (for engraving lines). */
export const swellPath = (pts: [number, number][], widths: number[], minW = 0.05): string => {
  if (pts.length < 2) return '';
  const top: string[] = [];
  const bot: string[] = [];
  for (let i = 0; i < pts.length; i++) {
    const [x, y] = pts[i];
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    let nx = -(b[1] - a[1]);
    let ny = b[0] - a[0];
    const l = Math.hypot(nx, ny) || 1;
    nx /= l;
    ny /= l;
    const w = Math.max(minW, widths[i]) / 2;
    top.push(`${(x + nx * w).toFixed(2)} ${(y + ny * w).toFixed(2)}`);
    bot.push(`${(x - nx * w).toFixed(2)} ${(y - ny * w).toFixed(2)}`);
  }
  return `M ${top.join(' L ')} L ${bot.reverse().join(' L ')} Z`;
};
