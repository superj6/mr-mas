// MR. MAS — mcoldopen: POST. On the click his line is split into its tokens, the way a tokenizer visualiser shows
// them (the semicolon gets its own token), and the tokens come off the screen toward the lens.
// Pixel-native, in the show's 7px face (src/shared/pixel/font.ts): each chip is a pastel plate with dark letters,
// drawn at an INTEGER scale on the native grid — 1x in place on the screen (f112), then 2x (f113) and 3x (f114) as
// they stream up and out past the lens, away from his face. No bloom, no soft shadow, no TrueType; three frames.
import {Buf, rect, hash} from '../../shared/pixel/px';
import {PAL} from '../../shared/pixel/palette';
import {text, textWidth} from '../../shared/pixel/font';
import {tokenBoxes} from './screen';
import {MED} from './medium';
import {EV} from './timeline';

/** tokenizer-visualiser pastels (master palette) */
const PASTEL = [PAL.W8, PAL.K4, PAL.S6, PAL.C8, PAL.G6];
/** a chip's lettering at scale 1 (caps + descenders: 9 rows) */
const glyphs = (s: string) => {
  const w = Math.max(1, textWidth(s.trim() || '.'));
  const t = new Buf(w, 9, 0);
  text(t, s.trim(), 0, 0, 1);
  return t;
};
/** blit a 1-bit buffer at integer scale k */
const blitK = (b: Buf, src: Buf, x: number, y: number, k: number, col: number) => {
  for (let j = 0; j < src.h; j++) for (let i = 0; i < src.w; i++) if (src.c[j * src.w + i] === 1) rect(x + i * k, y + j * k, k, k, b.ink(col));
};

export const drawChips = (b: Buf, f: number) => {
  const t = f - EV.chips[0];
  if (t < 0 || f > EV.chips[1]) return;
  const k = t + 1; // 1x, 2x, 3x
  const [sx, sy] = MED.screen;
  const boxes = tokenBoxes();
  // the burst's centre: the middle of the text block (frame px)
  const cx = sx + 16 + 52, cy = sy + 16 + 7;
  boxes.forEach((bx, i) => {
    const g = glyphs(bx.t);
    const lead = bx.t.startsWith(' ') ? 3 : 0; // the leading space is part of the token: a wider left pad
    const pw = (g.w + 2) * k + lead * (k > 1 ? k - 1 : 1), ph = 10 * k;
    // at 1x the chip sits exactly on its typed token; then it rides outward along its own ray, up past the lens
    const ox = bx.x + sx - 1 - (bx.t.startsWith(' ') ? 2 : 0), oy = bx.y + sy - 1;
    let x = ox, y = oy;
    if (k > 1) {
      const drift = (hash(i, 9) - 0.5) * 8 * k;
      x = Math.round(cx + (ox - cx) * (1 + (k - 1) * 1.5) + drift - (k - 1) * 10);
      y = Math.round(cy + (oy - cy) * (1 + (k - 1) * 1.5) - (k - 1) * (k - 1) * 12 + drift * 0.5);
    }
    const col = PASTEL[i % PASTEL.length];
    rect(x, y, pw, ph, b.ink(col));
    rect(x, y + ph, pw, k, b.ink(PAL.N0)); // a hard 1-step drop edge (no soft shadow)
    blitK(b, g, x + k + lead * (k > 1 ? k - 1 : 1), y + k, k, PAL.N0);
  });
};
