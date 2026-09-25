// Small color helpers so one character design can be rendered in several looks.
type RGB = [number, number, number];

export const hexToRgb = (hex: string): RGB => {
  const h = hex.replace('#', '');
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16)) as RGB;
};

export const rgbToHex = ([r, g, b]: RGB): string =>
  '#' + [r, g, b].map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0')).join('');

/** Linear mix: t=0 -> a, t=1 -> b. */
export const mix = (a: string, b: string, t: number): string => {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex([0, 1, 2].map((i) => A[i] + (B[i] - A[i]) * t) as RGB);
};

export const darken = (c: string, t: number) => mix(c, '#000000', t);
export const lighten = (c: string, t: number) => mix(c, '#ffffff', t);

/** Relative luminance 0..1 (sRGB approximation, good enough for tone mapping). */
export const luminance = (c: string): number => {
  const [r, g, b] = hexToRgb(c).map((x) => x / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** Map a color to a two-ink tone scale (ink at dark end, paper at light end). */
export const duotone = (c: string, ink: string, paper: string, contrast = 1.15): string => {
  const l = Math.max(0, Math.min(1, (luminance(c) - 0.5) * contrast + 0.5));
  return mix(ink, paper, l);
};

/** Snap a color to the nearest entry of a limited palette (for poster looks). */
export const nearest = (c: string, palette: string[]): string => {
  const C = hexToRgb(c);
  let best = palette[0];
  let bd = Infinity;
  for (const p of palette) {
    const P = hexToRgb(p);
    const d = (C[0] - P[0]) ** 2 * 0.3 + (C[1] - P[1]) ** 2 * 0.59 + (C[2] - P[2]) ** 2 * 0.11;
    if (d < bd) {
      bd = d;
      best = p;
    }
  }
  return best;
};
