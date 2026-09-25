// MR. MAS — meras: era palette variants (derived from the engine's EARLYWEB16, never edited in place).
// The engine set is tuned on the night room; these are lit sets. Both stay 16 web-safe colours.
// `pin` hand-maps the colours the solver gets wrong for a lit scene (skin shadows going red, the polo mid
// going navy, greys going blue) — each pin is a web-safe colour or a GIF-era 50% checker of two.
import {PAL} from '../../shared/pixel/palette';
import {EARLYWEB16} from '../../shared/pixel/palettes';
import {checker} from '../../shared/pixel/dither';

type Pin = [number, number | [number, number, number]];
const chk = (a: number, b: number): [number, number, number] => [a, b, 0.5];

/** 2008 stage: the engine set trades its orange/gold for the polo green and a hair brown. */
export const ERA08_COLORS = [
  0x000000, 0x000033, 0x003366, 0x336699, 0x3399cc, 0x66ccff, 0xccffff, 0xffffff,
  0x333366, 0x999999, 0x339933, 0x663333, 0xcc3333, 0xff6666, 0xcc9966, 0xffcc99,
];
const PIN08: Pin[] = [
  [PAL.N0, 0x000000], [PAL.N1, 0x000033], [PAL.N2, chk(0x000033, 0x000000)],
  [PAL.L0, 0x003366], [PAL.L1, 0x339933], [PAL.L2, 0x339933], [PAL.L3, 0xffcc99],
  // skin: three FLAT web colours (shadow, base, light) — never a checker on a face or an arm
  [PAL.S0, 0x663333], [PAL.S1, 0x663333], [PAL.S2, 0xcc9966], [PAL.S3, 0xcc9966], [PAL.S4, 0xcc9966], [PAL.S5, 0xffcc99], [PAL.S6, 0xffcc99],
  // hair: pinned to the early-web brown (the solver sent B0/B1 to navy-black; Mas is brown-haired in every era)
  [PAL.B0, 0x663333], [PAL.B1, 0x663333], [PAL.B2, 0x663333], [PAL.B3, 0x663333], [PAL.B4, 0x663333],
  [PAL.G1, 0x333366], [PAL.G2, 0x333366], [PAL.G3, 0x333366], [PAL.G4, 0x999999], [PAL.G5, 0x999999], [PAL.G6, 0xffffff],
  [PAL.W1, 0x000033], [PAL.W2, 0x663333], [PAL.W3, chk(0x663333, 0xcc9966)], [PAL.W4, 0xcc9966], [PAL.W5, chk(0xcc9966, 0xffcc99)], [PAL.W6, 0xffcc99], [PAL.W7, 0xffcc99],
  [PAL.R0, 0x663333], [PAL.R1, 0xcc3333], [PAL.R2, 0xcc3333], [PAL.R3, 0xff6666],
  [PAL.P0, 0x999999], [PAL.P1, 0xffcc99], [PAL.P2, 0xffffff],
];
export const ERA08 = EARLYWEB16.with({id: 'ERA08', label: 'EARLY-WEB 16 (stage)', colors: ERA08_COLORS, exposure: 1.2, chroma: 1.1, pairBias: 0.45, pattern: checker, pin: PIN08});

/** 2014 + the dinner's first frames: the engine set as designed (orange, gold, paper), lit, hand-pinned. */
const PIN14: Pin[] = [
  [PAL.N0, 0x000000], [PAL.N1, 0x000033], [PAL.N2, chk(0x000033, 0x333366)],
  // skin: three FLAT web colours (shadow, base, light), so a face never goes dark brown or checkered
  [PAL.S0, 0x663333], [PAL.S1, 0x663333], [PAL.S2, 0x993300], [PAL.S3, 0xcc9966], [PAL.S4, 0xcc9966], [PAL.S5, 0xcc9966], [PAL.S6, 0xffcc66],
  // hair: early-web browns, never navy (B0/B1 were unpinned and went to 0x000033/0x333366)
  [PAL.B0, 0x663333], [PAL.B1, 0x663333], [PAL.B2, 0x663333], [PAL.B3, 0x663333], [PAL.B4, 0x993300],
  [PAL.G1, 0x333366], [PAL.G2, 0x333366], [PAL.G3, 0x666699], [PAL.G4, chk(0x666699, 0x999999)], [PAL.G5, 0x999999], [PAL.G6, chk(0x999999, 0xffffff)],
  [PAL.W1, 0x333366], [PAL.W2, 0x663333], [PAL.W3, 0x993300], [PAL.W4, chk(0x993300, 0xff7f2a)], [PAL.W5, 0xff7f2a], [PAL.W6, chk(0xff7f2a, 0xffcc66)], [PAL.W7, 0xffcc66], [PAL.W8, chk(0xffcc66, 0xffffff)],
  [PAL.P0, 0x999999], [PAL.P1, chk(0xffcc66, 0xffffff)], [PAL.P2, 0xffffff],
  // the warehouse brick: black mortar, a GIF-era checker for the brick at low tone (background only), flat when lit
  [PAL.D0, 0x000000], [PAL.D1, 0x000000], [PAL.D2, 0x663333], [PAL.D3, chk(0x663333, 0x993300)], [PAL.D4, 0x993300],
];
export const ERA14 = EARLYWEB16.with({id: 'ERA14', label: 'EARLY-WEB 16 (lit)', exposure: 1.2, pairBias: 0.45, pattern: checker, pin: PIN14});
