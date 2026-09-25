/** Extra color math for the tonal renderers (HSL tweaks, OKLab palette matching). */
import {hexToRgb, rgbToHex} from '../../theme/color';

type RGB = [number, number, number];

export const rgbToHsl = ([r, g, b]: RGB): RGB => {
  r /= 255;
  g /= 255;
  b /= 255;
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn;
  const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  let h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h /= 6;
  return [h, s, l];
};

export const hslToRgb = ([h, s, l]: RGB): RGB => {
  if (s === 0) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
};

/** Scale saturation (k>1 = more saturated) and shift lightness by dl. */
export const tweak = (hex: string, k: number, dl = 0, dh = 0): string => {
  const [h, s, l] = rgbToHsl(hexToRgb(hex));
  return rgbToHex(hslToRgb([(h + dh + 1) % 1, Math.max(0, Math.min(1, s * k)), Math.max(0, Math.min(1, l + dl))]));
};

/** Warm = reddish/orange local color (skin, lips): gets subsurface scattering in the soft renderer. */
export const isWarm = (hex: string): boolean => {
  const [r, g, b] = hexToRgb(hex);
  return r - b > 38 && r > g && r > 90;
};

// ---------------- OKLab ----------------
const lin = (c: number) => {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
export const toOklab = ([r, g, b]: RGB): RGB => {
  const R = lin(r);
  const G = lin(g);
  const B = lin(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
};

export interface PalEntry {
  hex: string;
  rgb: RGB;
  lab: RGB;
}
export const makePalette = (hexes: string[]): PalEntry[] => hexes.map((hex) => ({hex, rgb: hexToRgb(hex), lab: toOklab(hexToRgb(hex))}));

/** Nearest palette entries by OKLab distance (lightness weighted a bit higher: keeps value structure). */
export const rankPalette = (rgb: RGB, pal: PalEntry[]): PalEntry[] => {
  const L = toOklab(rgb);
  return [...pal].sort((a, b) => dist(L, a.lab) - dist(L, b.lab));
};
const dist = (a: RGB, b: RGB) => (a[0] - b[0]) ** 2 * 1.6 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
export const nearestLab = (rgb: RGB, pal: PalEntry[]): PalEntry => {
  const L = toOklab(rgb);
  let best = pal[0];
  let bd = Infinity;
  for (const p of pal) {
    const d = dist(L, p.lab);
    if (d < bd) {
      bd = d;
      best = p;
    }
  }
  return best;
};
