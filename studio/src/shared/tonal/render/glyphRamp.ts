/**
 * Measured glyph density ramp for the glyph renderer. Each candidate character is rasterized once and
 * its ink coverage measured, so brightness -> glyph mapping is correct for the actual font.
 */
export const TOKEN_GLYPHS = " .·'`,:;-~_\"^=+<>/\\|!ilrt1jcvxzsoaeunJ7{}[]()?*%0O&8#$@MW";

export interface Ramp {
  chars: string[];
  dens: number[]; // normalized 0..1, ascending
}

const cache = new Map<string, Ramp>();

export const measureRamp = (glyphs: string, font: string): Ramp => {
  const key = font + '|' + glyphs;
  const hit = cache.get(key);
  if (hit) return hit;
  const W = 36;
  const H = 54;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const x = c.getContext('2d', {willReadFrequently: true})!;
  x.font = `700 44px ${font}`;
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  const out: {ch: string; d: number}[] = [];
  for (const ch of Array.from(glyphs)) {
    x.clearRect(0, 0, W, H);
    x.fillStyle = '#fff';
    x.fillText(ch, W / 2, H / 2);
    const d = x.getImageData(0, 0, W, H).data;
    let s = 0;
    for (let i = 3; i < d.length; i += 4) s += d[i];
    out.push({ch, d: s / (W * H * 255)});
  }
  out.sort((a, b) => a.d - b.d);
  const mx = out[out.length - 1].d || 1;
  const r: Ramp = {chars: out.map((o) => o.ch), dens: out.map((o) => o.d / mx)};
  cache.set(key, r);
  return r;
};

/** Index of a glyph whose density is near t; `pick` 0..1 chooses among the near candidates (token variety). */
export const pickGlyph = (r: Ramp, t: number, pick: number, spread = 0.06): string => {
  // binary search nearest
  let lo = 0;
  let hi = r.dens.length - 1;
  while (lo < hi) {
    const m = (lo + hi) >> 1;
    if (r.dens[m] < t) lo = m + 1;
    else hi = m;
  }
  let a = lo;
  let b = lo;
  while (a > 0 && t - r.dens[a - 1] < spread) a--;
  while (b < r.dens.length - 1 && r.dens[b + 1] - t < spread) b++;
  const k = a + Math.min(b - a, Math.floor(pick * (b - a + 1)));
  return r.chars[k];
};
