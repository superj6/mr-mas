// @ts-nocheck -- Node-only tool (bundled with esbuild), outside the browser typecheck (tsconfig includes src/ only).
// MR. MAS genvideo: export the pixel engine's palettes to JSON for the Python converters (pixelize.py, glyphize.py).
// It runs the ENGINE'S OWN CODE, so the Python side never re-types a hex or re-implements a palette-set solve:
//   - the master palette (name, hex, family, rung, OKLab) in declaration order (= PAL_INDEX order)
//   - SKIN_COLORS (the dither-discipline list)
//   - every palette set in PALETTES plus the founder freeze prints: the compiled [a, b, t] entry for EVERY master
//     colour, and the set's ordered threshold sampled on a 24x24 tile (lcm of the 8x8 Bayer and the 3-row line screen)
//   - the glyph constants (cell, tone curve, glyph ramps) and hash() test vectors for the Python port
//
//   cd studio
//   npx esbuild tools/genvideo/export_palettes.ts --bundle --platform=node --outfile=/tmp/genvideo-pal.js --log-level=warning
//   node /tmp/genvideo-pal.js tools/genvideo/palettes.json
import {writeFileSync} from 'fs';
import {PAL, PAL_NAMES, SKIN_COLORS, familyOf, oklab, lightness, hex} from '../../src/shared/pixel/palette';
import {PALETTES} from '../../src/shared/pixel/palettes';
import {freezePrint, freezeSolid, freezePop, FOUNDERS, PAPER} from '../../src/shared/pixel/freeze';
import {DEFAULT_CELL, GLYPH_TONE, TOKEN_GLYPHS, EDGE_GLYPHS} from '../../src/shared/pixel/glyph';
import {hash} from '../../src/shared/pixel/px';
import {bayer2, bayer4, bayer8, checker, cluster4} from '../../src/shared/pixel/dither';

const out = process.argv[2] ?? 'tools/genvideo/palettes.json';
const TILE = 24;
const sample = (thr) => {
  const rows = [];
  for (let y = 0; y < TILE; y++) {
    const r = [];
    for (let x = 0; x < TILE; x++) r.push(+thr(x, y).toFixed(6));
    rows.push(r);
  }
  return rows;
};
const KNOWN = {bayer2, bayer4, bayer8, checker, cluster4};
const nameOf = (thr) => {
  const s = JSON.stringify(sample(thr));
  for (const [k, f] of Object.entries(KNOWN)) if (JSON.stringify(sample(f)) === s) return k;
  return 'custom';
};

const master = PAL_NAMES.map((n, i) => {
  const c = PAL[n];
  const [fam, rung] = familyOf(c);
  return {i, name: n, hex: hex(c), rgb: [(c >> 16) & 255, (c >> 8) & 255, c & 255], family: fam, rung, oklab: oklab(c).map((v) => +v.toFixed(6)), L: +lightness(c).toFixed(6)};
});

const patterns = {};
const exportSet = (set) => {
  // re-sample the pattern the set was compiled with (compilePalette keeps def.pattern on the set object)
  const pattern = set.pattern ?? bayer4;
  let key = nameOf(pattern);
  if (key === 'custom') key = `custom:${set.id}`;
  if (!patterns[key]) patterns[key] = sample(pattern).map((r) => r.join(' '));
  return {
    id: set.id, label: set.label, use: set.use, mode: set.mode,
    colors: set.colors.map(hex),
    solid: (set.solid ?? []).map(hex),
    // key into doc.patterns: a 24x24 threshold tile, rows as space-separated numbers, indexed [y % 24][x % 24]
    pattern: key,
    // entries[i] = [a, b, t] for master colour i: show b where threshold(x, y) < t (exactly set.map)
    entries: PAL_NAMES.map((n) => { const [a, b, t] = set.entry(PAL[n]); return [hex(a), hex(b), +t.toFixed(6)]; }),
  };
};

const sets = {};
for (const [id, set] of Object.entries(PALETTES)) sets[id] = exportSet(set);
for (const who of Object.keys(FOUNDERS)) {
  sets[`FREEZE_${who.toUpperCase()}_ROOM`] = exportSet(freezePrint(who));
  sets[`FREEZE_${who.toUpperCase()}_FIGURE`] = exportSet(freezeSolid(who));
  sets[`FREEZE_${who.toUpperCase()}_POP`] = exportSet(freezePop(who));
}

const hashVectors = [];
for (const [x, y, s] of [[0, 0, 0], [1, 2, 3], [479, 269, 7], [17, 99, 11], [240, 135, 7 * 7 + 5 * 31 + 1], [3, 1, 12], [123, 45, 7 + 3 * 13 + 5]])
  hashVectors.push([x, y, s, hash(x, y, s)]);

const doc = {
  generated: 'studio/tools/genvideo/export_palettes.ts (do not edit by hand; re-run the exporter after engine palette changes)',
  native: [480, 270],
  uiY: 203,
  master,
  skin: SKIN_COLORS.map(hex),
  paper: hex(PAPER),
  sets,
  patterns,
  glyph: {
    cell: DEFAULT_CELL, tone: GLYPH_TONE, chars: TOKEN_GLYPHS, edgeGlyphs: EDGE_GLYPHS,
    // mirrors of the inline defaults in glyph.ts / glyphDraw.ts (keep in sync by hand; glyphize.py reads these)
    defaults: {floor: 0.05, edgeAt: 1.1, gain: 1, tint: hex(PAL.C6), tintAmt: 0.3, shimmer: 0.06, shimmerStep: 2, seed: 7, noise: 0, bg: hex(PAL.N0), bloom: 0.7, weight: 700, size: [0.9, 1.15]},
  },
  hashVectors,
};
writeFileSync(out, JSON.stringify(doc, null, 1));
console.log(`wrote ${out}: ${master.length} master colours, ${Object.keys(sets).length} sets`);
