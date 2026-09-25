// MR. MAS — shared pixel engine: the curated master palette. (Promoted from src/dev/pixeladv/core/palette.ts.)
// Everything on screen is one of these colours; lighting is done by walking hand-ordered ramps
// (index 0 = unlit, 7 = hottest) rather than by blending, so every light zone is a palette choice.

const P = {
  // night / ambient (blue-violet)
  N0: 0x04050a, N1: 0x080a14, N2: 0x0d1020, N3: 0x141a30, N4: 0x1c2442, N5: 0x273156, N6: 0x36426e, N7: 0x4b5a8c, N8: 0x6f82b8,
  // monitor cyan
  C0: 0x06222c, C1: 0x0a3441, C2: 0x0e4a58, C3: 0x126573, C4: 0x17848f, C5: 0x22a7ad, C6: 0x3fcacb, C7: 0x7fe6de, C8: 0xc6fbf1, C9: 0xf2fffb,
  // hallway tungsten
  W0: 0x1a0c10, W1: 0x2e1216, W2: 0x4d1c1a, W3: 0x74291c, W4: 0xa2401f, W5: 0xcf6627, W6: 0xec9338, W7: 0xfbc15e, W8: 0xffe5a3, W9: 0xfff8e6,
  // skin
  S0: 0x1d1119, S1: 0x34202a, S2: 0x553339, S3: 0x7c4c4a, S4: 0xa86e60, S5: 0xcf9579, S6: 0xecc09f,
  // skin under cyan
  K0: 0x22323f, K1: 0x35565e, K2: 0x55868a, K3: 0x86b8b2, K4: 0xbfe5da, K5: 0xe9fbf3,
  // mixed-light skin mids (mauve bridge between warm shadow and cyan light)
  X0: 0x2a1e2a, X1: 0x4a3844, X2: 0x6a5460, X3: 0x8a6f74,
  // brown hair
  B0: 0x120c10, B1: 0x231619, B2: 0x3a2522, B3: 0x57372b, B4: 0x7a5139,
  // hoodie greys
  G0: 0x161923, G1: 0x242a38, G2: 0x363e50, G3: 0x4d5669, G4: 0x687286, G5: 0x8993a6, G6: 0xb0b9c9,
  // wood
  D0: 0x120a0c, D1: 0x1f1214, D2: 0x331c1a, D3: 0x4b2a22, D4: 0x6a3c2c,
  // red
  R0: 0x3a0d18, R1: 0x6e1624, R2: 0xb0243a, R3: 0xec4a4a,
  // green
  L0: 0x0c2019, L1: 0x16402d, L2: 0x2f7a4a, L3: 0x6fd37a,
  // paper
  P0: 0x8f8a7a, P1: 0xcfc6a8, P2: 0xefe8cf,
  // ---- promoted from the castrivals kit (cast/bosses.ts CX) — the same hexes, now master families so family
  // steps, freeze prints and stray checks treat them like every other ramp (appended: older indices are stable)
  // fleece: Mario's ink-blue fleece ramp
  F0: 0x0b0f1f, F1: 0x121a33, F2: 0x1b274a, F3: 0x26396a, F4: 0x384f88, F5: 0x5a6fa6, F6: 0x8c9ccb,
  // ink: Mario's card / freeze ink blue (a one-colour family)
  I0: 0x1f3a93,
  // dusk: the violet -> plum -> rose -> coral bridge between N and W (the skyline, the roll call, the bosses)
  U0: 0x1d1a36, U1: 0x2e2244, U2: 0x46294f, U3: 0x6a3155, U4: 0x96394f, U5: 0xc14e4a,
  // rocket red: the SPACEZ livery (never on Mario)
  Q0: 0x4a0e0c, Q1: 0x8a1a12, Q2: 0xe0301e,
} as const;

export type PalName = keyof typeof P;
export const PAL: Record<PalName, number> = P;
export const ALL_COLORS: number[] = Object.values(P);

export const hex = (c: number) => '#' + c.toString(16).padStart(6, '0');

/** Resolve a ramp of names to colours. */
export const ramp = (...names: PalName[]) => names.map((n) => P[n]);

/** Nearest palette colour (perceptual-ish weights). */
export const nearest = (c: number, pool: number[] = ALL_COLORS) => {
  const r = (c >> 16) & 255, g = (c >> 8) & 255, b = c & 255;
  let best = pool[0], bd = Infinity;
  for (const p of pool) {
    const dr = r - ((p >> 16) & 255), dg = g - ((p >> 8) & 255), db = b - (p & 255);
    const d = dr * dr * 0.3 + dg * dg * 0.59 + db * db * 0.11;
    if (d < bd) { bd = d; best = p; }
  }
  return best;
};

export const lum = (c: number) => (((c >> 16) & 255) * 0.3 + ((c >> 8) & 255) * 0.59 + (c & 255) * 0.11) / 255;

// ---------- additions (shared engine): families, stepping, colour math ----------

/** Master-palette names in declaration order (stable indices for tools / indexed export). */
export const PAL_NAMES = Object.keys(P) as PalName[];
/** colour -> master index (0..PAL_NAMES.length-1); undefined for colours outside the master palette. */
export const PAL_INDEX: Map<number, number> = new Map(PAL_NAMES.map((n, i) => [P[n], i]));

/**
 * Colour families: the hand-ordered ramps inside the master palette (N night, C monitor cyan, W tungsten,
 * S skin, K skin-under-cyan, X mixed-light skin, B hair, G hoodie, D wood, R red, L green, P paper,
 * F fleece, I ink, U dusk, Q rocket red).
 * Index 0 is always the darkest member.
 */
export const FAMILIES: Record<string, number[]> = {};
const FAM_OF = new Map<number, [string, number]>();
for (const n of PAL_NAMES) {
  const fam = n[0];
  if (!FAMILIES[fam]) FAMILIES[fam] = [];
  FAMILIES[fam].push(P[n]);
  FAM_OF.set(P[n], [fam, FAMILIES[fam].length - 1]);
}
/** Family letter + rung of a master colour, or undefined. */
export const familyOf = (c: number) => FAM_OF.get(c);

/**
 * SKIN: every colour a face or hand is painted with (S skin, K skin under cyan, X mixed-light mids).
 * The dither-discipline rule: skin never dithers in a style switch. Palette sets list these as `solid`, so a
 * skin colour always resolves to ONE flat output colour (a threshold), never an ordered-dither pair.
 */
export const SKIN_COLORS: number[] = [...FAMILIES.S, ...FAMILIES.K, ...FAMILIES.X];

/**
 * Walk a master colour k rungs along its own family (k > 0 brighter, k < 0 darker), clamped at the ends.
 * This is how the show dims (cutscene UI), blooms ("the palette blooms brighter") or flashes: a palette
 * operation, never a blend. Colours outside the master palette are returned unchanged.
 */
export const stepColor = (c: number, k: number) => {
  const f = FAM_OF.get(c);
  if (!f || k === 0) return c;
  const r = FAMILIES[f[0]];
  return r[Math.max(0, Math.min(r.length - 1, f[1] + k))];
};

const srgbToLin = (v: number) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const linToSrgb = (v: number) => Math.round(255 * Math.max(0, Math.min(1, v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055)));

/** Linear-light RGB (0..1) of a packed colour. */
export const toLinear = (c: number): [number, number, number] => [srgbToLin((c >> 16) & 255), srgbToLin((c >> 8) & 255), srgbToLin(c & 255)];
export const fromLinear = (r: number, g: number, b: number) => (linToSrgb(r) << 16) | (linToSrgb(g) << 8) | linToSrgb(b);

/** OKLab of linear RGB. */
export const linToOklab = (r: number, g: number, b: number): [number, number, number] => {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
};
export const oklab = (c: number) => { const [r, g, b] = toLinear(c); return linToOklab(r, g, b); };
/** Perceptual lightness 0..1 (OKLab L). Better than `lum` for tone curves on this very dark palette. */
export const lightness = (c: number) => oklab(c)[0];
