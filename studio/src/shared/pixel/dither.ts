// MR. MAS — shared pixel engine: ordered threshold maps.
// A Threshold returns a value in (0,1) for a pixel; a pixel "takes" the second colour of a pair when
// threshold < t. Every dither in the show is ordered (never error diffusion or noise), so patterns are stable
// frame to frame and read as deliberate pixel-art texture.

export type Threshold = (x: number, y: number) => number;

const bayerMatrix = (n: number): number[] => {
  // recursive Bayer: M(2n) = [[4M, 4M+2], [4M+3, 4M+1]]
  let m = [0];
  let size = 1;
  while (size < n) {
    const s2 = size * 2;
    const next = new Array(s2 * s2);
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        const v = m[y * size + x] * 4;
        next[y * s2 + x] = v;
        next[y * s2 + x + size] = v + 2;
        next[(y + size) * s2 + x] = v + 3;
        next[(y + size) * s2 + x + size] = v + 1;
      }
    m = next;
    size = s2;
  }
  return m;
};
const B2 = bayerMatrix(2), B4 = bayerMatrix(4), B8 = bayerMatrix(8);

/** 2x2 Bayer: 4 levels (use for tiny sprites / UI). */
export const bayer2: Threshold = (x, y) => (B2[(y & 1) * 2 + (x & 1)] + 0.5) / 4;
/** 4x4 Bayer: 16 levels — the show default (same as px.ts `bayer`). */
export const bayer4: Threshold = (x, y) => (B4[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
/** 8x8 Bayer: 64 levels — soft mask edges, crossfades. */
export const bayer8: Threshold = (x, y) => (B8[(y & 7) * 8 + (x & 7)] + 0.5) / 64;
/** 50% checker only (t < .5 -> A, else checker, t >= 1 -> B). */
export const checker: Threshold = (x, y) => ((x + y) & 1 ? 0.75 : 0.25);

/**
 * Horizontal line screen (LEDGER / engraving stand-in). Period p rows; as tone rises the dark rule thins
 * from p-1 px to 0. A slow 1px step every `slant` columns keeps it from looking like scanlines.
 */
export const lines = (p = 3, slant = 0): Threshold => (x, y) => {
  const yy = slant > 0 ? y + Math.floor(x / slant) : y;
  const k = ((yy % p) + p) % p;
  return (k + 0.5) / p;
};

/** Clustered-dot 4x4 halftone (print / "freeze-frame" poster feel). */
const CL = [12, 5, 6, 13, 4, 0, 1, 7, 11, 3, 2, 8, 15, 10, 9, 14];
export const cluster4: Threshold = (x, y) => (CL[(y & 3) * 4 + (x & 3)] + 0.5) / 16;

/** Diagonal hatch (period p). */
export const hatch = (p = 4): Threshold => (x, y) => ((((x + y) % p) + p) % p + 0.5) / p;

export const THRESHOLDS = {bayer2, bayer4, bayer8, checker, cluster4, lines3: lines(3), hatch4: hatch(4)};
