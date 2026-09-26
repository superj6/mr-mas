// MR. MAS - style-range Prototype 1: HIS GLASS inside the anime frame stays a PIXEL SPRITE, shown at 4x nearest
// neighbour (the pixel base's own grid) and placed on whole output pixels: never scaled, never rotated, never blurred.
// It is the one thing in his self-image that doesn't change medium: the house tumbler, master-palette colours only,
// the water ONE flat row. It is drawn at the size it stands in the shot (closer than in the pixel [MS], so more
// pixels on the same grid), and the cel world gives it a cel contact shadow and the lamp's caustic on the felt.
import {PAL} from '../../../../shared/pixel/palette';

// . clear  o outline  T/t lit rim  W/w warm lit edge (the lamp beyond it)  a/A walls  s shine  l THE water line
// e/c/d water (light -> deep)  g/G the thick base  k its dark underside
const ROWS = [
  '....oooooooooo....',
  '..ooTTtttttttWoo..',
  '.oTt..........Wwo.',
  '.oa............wo.',
  '.oa.s..........wo.',
  '.oa.s.........Awo.',
  '.oa.s.........Awo.',
  '.oa.s.........Awo.',
  '.oa...........Awo.',
  '.oa...........Awo.',
  '.oa...........Awo.',
  '.oa...........Awo.',
  '.oalllllllllllllo.',
  '.oaeecccccccccdwo.',
  '..oesccccccccddwo.',
  '..oesccccccccddwo.',
  '..oesccccccccdWwo.',
  '..oesccccccccdWwo.',
  '..oeeccccccccddwo.',
  '..oeeccccccccddwo.',
  '..oaecccccccdddwo.',
  '..oaggggggggggGwo.',
  '..oagGGGGGGGGGGwo.',
  '..oagggggggggggWo.',
  '...oggggggggggWo..',
  '...okkkkkkkkkkko..',
  '....ooooooooooo...',
];
export const GLASS_W = ROWS[0].length, GLASS_H = ROWS.length;
/** the scale: the pixel base's own 4x grid */
export const GLASS_PX = 4;
const PALM: Record<string, number> = {
  o: PAL.N0, T: PAL.C8, t: PAL.C6, W: PAL.W6, w: PAL.W5, a: PAL.C2, A: PAL.C3, s: PAL.C8, l: PAL.C9,
  e: PAL.C4, c: PAL.C3, d: PAL.C2, g: PAL.C4, G: PAL.C5, k: PAL.N1,
};
let URL_: string | null = null;
export const glassDataUrl = () => {
  if (URL_) return URL_;
  const c = document.createElement('canvas');
  c.width = GLASS_W; c.height = GLASS_H;
  const g = c.getContext('2d')!;
  ROWS.forEach((r, j) => {
    for (let i = 0; i < r.length; i++) {
      const v = PALM[r[i]];
      if (v === undefined) continue;
      g.fillStyle = '#' + v.toString(16).padStart(6, '0');
      g.fillRect(i, j, 1, 1);
    }
  });
  URL_ = c.toDataURL('image/png');
  return URL_;
};
