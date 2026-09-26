// MR. MAS — range/p3: procedural textures (deterministic, no files): the linen's weave and its ironed creases,
// the caustic and contact-shadow decals, the glyph atlas for the model's sparse walls, and a sprite texture helper.
import {THREE, Any, h01} from './kit';
import {GLYPH_FONT} from '../../../../shared/pixel/glyphDraw';
import {ALL_COLORS} from '../../../../shared/pixel/palette';
import {MON_CAM, project, TABLE, CANDLES, PLACES, SEATS, MAS_EYE, NW, NH, V3} from '../layout';

const canvas = (w: number, h: number) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

/** value noise (tileable over `per`) */
const vnoise = (x: number, y: number, per: number, seed: number) => {
  const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
  const g = (i: number, j: number) => h01(((i % per) + per) % per, ((j % per) + per) % per, seed);
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  return (g(xi, yi) * (1 - u) + g(xi + 1, yi) * u) * (1 - v) + (g(xi, yi + 1) * (1 - u) + g(xi + 1, yi + 1) * u) * v;
};

/** height field -> tangent-space normal map (RGBA8, linear) */
const heightToNormal = (hf: Float32Array, n: number, strength: number) => {
  const data = new Uint8Array(n * n * 4);
  const H = (x: number, y: number) => hf[((y + n) % n) * n + ((x + n) % n)];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const dx = (H(x + 1, y) - H(x - 1, y)) * strength, dy = (H(x, y + 1) - H(x, y - 1)) * strength;
      const l = Math.hypot(dx, dy, 1);
      const i = (y * n + x) * 4;
      data[i] = Math.round((-dx / l * 0.5 + 0.5) * 255); data[i + 1] = Math.round((dy / l * 0.5 + 0.5) * 255); data[i + 2] = Math.round((1 / l * 0.5 + 0.5) * 255); data[i + 3] = 255;
    }
  const t = new THREE.DataTexture(data, n, n, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true;
  t.colorSpace = THREE.NoColorSpace; t.anisotropy = 8; t.needsUpdate = true;
  return t;
};

/** Linen: an irregular plain weave (slubbed threads, uneven spacing) — 512 px tile = 32 threads each way */
export const linenWeave = () => {
  const n = 512, threads = 32, hf = new Float32Array(n * n);
  const per = n / threads;
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const tx = x / per, ty = y / per;
      const ix = Math.floor(tx), iy = Math.floor(ty);
      // slubs: each thread's thickness wanders along its length (linen's signature)
      const slubX = 0.75 + 0.5 * vnoise(ix * 7.1, y / 23, 1e6, 3), slubY = 0.75 + 0.5 * vnoise(iy * 5.3, x / 19, 1e6, 5);
      const wx = Math.pow(Math.sin(Math.PI * (tx - ix)), 0.8) * slubX, wy = Math.pow(Math.sin(Math.PI * (ty - iy)), 0.8) * slubY;
      const over = (ix + iy) % 2 === 0; // over / under
      hf[y * n + x] = over ? Math.max(wx * 1.0, wy * 0.55) : Math.max(wy * 1.0, wx * 0.55);
      hf[y * n + x] += (vnoise(x / 3, y / 3, n / 3, 9) - 0.5) * 0.12; // fibre fuzz
    }
  return heightToNormal(hf, n, 1.6);
};

/** The cloth's large-scale surface: soft wrinkles and the ironed fold creases (a grid, like a folded cloth) */
export const linenCreases = (cols: number, rows: number) => {
  const n = 1024, hf = new Float32Array(n * n);
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      let h = 0;
      h += (vnoise(x / 110, y / 70, 1e6, 11) - 0.5) * 0.9 + (vnoise(x / 37, y / 29, 1e6, 12) - 0.5) * 0.35;
      // creases: soft ridges at the fold lines (alternating up / down, as a pressed cloth keeps them)
      for (let k = 1; k < cols; k++) { const cx = (k / cols) * n; const d = (x - cx) / 3.2; h += (k % 2 ? 1 : -1) * 0.55 * Math.exp(-d * d); }
      for (let k = 1; k < rows; k++) { const cy = (k / rows) * n; const d = (y - cy) / 3.2; h += (k % 2 ? -1 : 1) * 0.5 * Math.exp(-d * d); }
      hf[y * n + x] = h;
    }
  const t = heightToNormal(hf, n, 0.9);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
};

/** a soft radial blob (contact AO under things on the cloth): alpha falls off, colour black */
export const blobTex = () => {
  const c = canvas(128, 128), g = c.getContext('2d')!;
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.45, 'rgba(0,0,0,0.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.NoColorSpace; return t;
};

/** A glass's caustic on the cloth: a focused crescent with a brighter core and a faint outer ring (additive) */
export const causticTex = () => {
  const n = 256, c = canvas(n, n), g = c.getContext('2d')!;
  const img = g.createImageData(n, n);
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const u = (x / n) * 2 - 1, v = (y / n) * 2 - 1; // v runs away from the light
      const r = Math.hypot(u, v * 0.8);
      // the focus: a bright crescent sitting on the ring's far side
      const ring = Math.exp(-Math.pow((r - 0.62) / 0.07, 2)) * (0.35 + 0.65 * Math.max(0, v * 0.9 + 0.3));
      const core = Math.exp(-(u * u) / 0.012 - Math.pow(v - 0.35, 2) / 0.05) * 1.3;
      const fill = Math.exp(-r * r / 0.25) * 0.18;
      const shimmer = 0.85 + 0.3 * vnoise(x / 9, y / 9, 1e6, 21);
      const val = Math.min(1, (ring + core + fill) * shimmer) * Math.max(0, 1 - r * 0.9);
      const i = (y * n + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = Math.round(val * 255); img.data[i + 3] = 255;
    }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.NoColorSpace; return t;
};

/** Glyph atlas: the GLYPH ramp's tokens in JetBrains Mono, 16 per row, white on transparent */
export const GLYPHS = ".·:;-~=+<>/\\|!*%#$@0O&";
export const glyphAtlas = () => {
  const cell = 32, cols = 8, rows = Math.ceil(GLYPHS.length / cols);
  const c = canvas(cell * cols, cell * rows), g = c.getContext('2d')!;
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = `700 26px ${GLYPH_FONT}`;
  for (let i = 0; i < GLYPHS.length; i++) g.fillText(GLYPHS[i], (i % cols) * cell + cell / 2, Math.floor(i / cols) * cell + cell / 2 + 1);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.NoColorSpace; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true;
  return {tex: t, cols, rows, count: GLYPHS.length};
};

/** a native-pixel image (0xRRGGBB, -1 = clear) -> an RGBA texture with nearest sampling (sprites stay sprites) */
export const imgTex = (w: number, h: number, c: Int32Array | Uint32Array, map?: (hex: number) => [number, number, number]): Any => {
  const data = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const v = c[y * w + x];
      const i = ((h - 1 - y) * w + x) * 4; // flipY by hand (DataTexture origin is bottom-left)
      if (v < 0 || v >= 0x1000000) { data[i + 3] = 0; continue; }
      if (map) { const [r, g, b] = map(v); data[i] = r; data[i + 1] = g; data[i + 2] = b; } else { data[i] = (v >> 16) & 255; data[i + 1] = (v >> 8) & 255; data[i + 2] = v & 255; }
      data[i + 3] = 255;
    }
  const t = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
  t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter; t.generateMipmaps = false; t.colorSpace = THREE.NoColorSpace; t.needsUpdate = true;
  return t;
};

// ------------------------------------------------------------------ the master palette (for the pixel lens)
export const PALETTE_LIST: number[] = ALL_COLORS.slice(0, 128);

// ------------------------------------------------------------------ the monitor's screen: the model's own picture
/** What the model shows on its screen while it rebuilds the room: first the tokens it is writing, then, row by row, its
 *  glyph picture of the table seen from its own end: the cloth, the plates, the two flames, the guests as tokens, and at
 *  the head of the table, where he sits, nothing but a cursor. (GLYPH: the machine watching.) */
export interface MonitorPicture { tex: Any; draw: (f: number) => void; }
export const monitorPicture = (): MonitorPicture => {
  const CW = 1024, CH = 640, COLS = 72, ROWS = 36, cw = CW / COLS, ch = CH / ROWS;
  const c = canvas(CW, CH), g = c.getContext('2d')!;
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.NoColorSpace; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.generateMipmaps = true; tex.anisotropy = 8;
  // the picture, once: luminance and kind per cell (0 empty, 1 lit, 2 a person, 3 his seat)
  const L = new Float32Array(COLS * ROWS), KD = new Uint8Array(COLS * ROWS);
  const P = (p: V3) => { const q = project(MON_CAM, p); return q ? [(q[0] / NW) * COLS, (q[1] / NH) * ROWS] as [number, number] : null; };
  const fillPoly = (pts: Array<[number, number]>, v: (x: number, y: number) => number, kind: number) => {
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
      let inside = false;
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        const [xi, yi] = pts[i], [xj, yj] = pts[j];
        if ((yi > y + 0.5) !== (yj > y + 0.5) && x + 0.5 < ((xj - xi) * (y + 0.5 - yi)) / (yj - yi) + xi) inside = !inside;
      }
      if (inside) { const k = y * COLS + x; L[k] = Math.max(L[k], v(x, y)); if (kind) KD[k] = kind; }
    }
  };
  const {x0, x1, z0, z1, top} = TABLE;
  const tq = [P([x0, top, z0]), P([x1, top, z0]), P([x1, top, z1]), P([x0, top, z1])].filter(Boolean) as Array<[number, number]>;
  const cand = CANDLES.map((k) => P([k[0], k[1] + 0.12, k[2]])!);
  fillPoly(tq, (x, y) => { let v = 0.3; for (const q of cand) v = Math.max(v, 0.62 - Math.hypot((x - q[0]) * 0.5, y - q[1]) * 0.05); return v; }, 1);
  for (const pl of PLACES) {
    const q = P([pl.x, top, pl.z]), qx = P([pl.x + 0.135, top, pl.z]), qz = P([pl.x, top, pl.z + 0.135]);
    if (!q || !qx || !qz) continue;
    const rx = Math.max(0.7, Math.abs(qz[0] - q[0])), ry = Math.max(0.35, Math.abs(qx[1] - q[1]));
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (((x + 0.5 - q[0]) / rx) ** 2 + ((y + 0.5 - q[1]) / ry) ** 2 <= 1) { const k = y * COLS + x; L[k] = Math.max(L[k], 0.74); }
  }
  // the guests as tokens: a head and a pair of shoulders each (the two nearest the screen are too close to be in it)
  for (const s of SEATS) {
    const hq = P([s.x, s.eye + 0.03, s.pz]), hr = P([s.x, s.eye + 0.13, s.pz]), sl = P([s.x, s.eye - 0.2, s.pz - 0.22]), sr = P([s.x, s.eye - 0.2, s.pz + 0.22]), bt = P([s.x, top, s.pz]);
    const d = project(MON_CAM, [s.x, s.eye, s.pz]);
    if (!hq || !hr || !sl || !sr || !bt || !d || d[2] < 1.5) continue;
    const rad = Math.max(1, Math.abs(hr[1] - hq[1]) * 0.85);
    const x0 = Math.min(sl[0], sr[0]), x1 = Math.max(sl[0], sr[0]);
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
      const cx = x + 0.5, cy = y + 0.5;
      const head = Math.hypot((cx - hq[0]) / 0.9, cy - hq[1]) <= rad;
      const body = cy >= sl[1] && cy <= bt[1] && cx >= x0 + (cy - sl[1] < 1 ? 0.8 : 0) && cx <= x1 - (cy - sl[1] < 1 ? 0.8 : 0);
      if (!head && !body) continue;
      const k = y * COLS + x; L[k] = 0.46 + h01(x, y, 5) * 0.2; KD[k] = 2;
    }
  }
  for (const q of cand) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
    const x = Math.round(q[0] - 0.5) + dx, y = Math.round(q[1] - 0.5) + dy;
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) continue;
    const k = y * COLS + x; L[k] = Math.max(L[k], dx === 0 && dy === 0 ? 1 : 0.8); KD[k] = 1;
  }
  // the cloth's edges as line glyphs (so the picture reads as a table in perspective)
  const LINE = new Map<number, string>();
  const edge = (a: [number, number], b: [number, number]) => {
    const n = Math.ceil(Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])) * 2) + 1;
    const sl = (b[1] - a[1]) / ((b[0] - a[0]) || 1e-6);
    const gch = Math.abs(sl) < 0.35 ? '_' : Math.abs(sl) > 3 ? '|' : sl > 0 ? '\\' : '/';
    for (let i = 0; i <= n; i++) {
      const x = Math.floor(a[0] + ((b[0] - a[0]) * i) / n), y = Math.floor(a[1] + ((b[1] - a[1]) * i) / n);
      if (x < 0 || y < 0 || x >= COLS || y >= ROWS) continue;
      const k = y * COLS + x; LINE.set(k, gch); L[k] = Math.max(L[k], 0.86); KD[k] = 1;
    }
  };
  for (let i = 0; i < tq.length; i++) edge(tq[i], tq[(i + 1) % tq.length]);
  const seat = P(MAS_EYE);
  const seatCell = seat ? [Math.round(seat[0] - 0.5), Math.round(seat[1] - 0.5)] : [24, 10];
  // his seat: where a person-sized shape would be, nothing (only the cursor, waiting)
  if (seat) { const sb = P([MAS_EYE[0], TABLE.top + 0.02, 0]), sh = P([MAS_EYE[0], MAS_EYE[1] + 0.14, 0.24]);
    const w2 = sh ? Math.abs(sh[0] - seat[0]) : 3;
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (Math.abs(x + 0.5 - seat[0]) <= w2 && y + 0.5 >= (sh ? sh[1] : seat[1] - 2) && y + 0.5 <= (sb ? sb[1] - 0.5 : seat[1] + 3)) { const k = y * COLS + x; if (KD[k] !== 1 || !LINE.has(k)) { L[k] = 0; KD[k] = 3; } } }
  const CY = ['#17848f', '#22a7ad', '#3fcacb', '#7fe6de', '#c6fbf1', '#f2fffb'];
  const TOK = '.:-=+/\\|<>*#%0';
  let last = -1;
  const draw = (f: number) => {
    if (f === last) return;
    last = f;
    g.fillStyle = '#0a3441'; g.fillRect(0, 0, CW, CH);
    const gr = g.createRadialGradient(CW / 2, CH / 2, 40, CW / 2, CH / 2, CW * 0.62);
    gr.addColorStop(0, 'rgba(18,101,115,0.95)'); gr.addColorStop(1, 'rgba(10,52,65,0)');
    g.fillStyle = gr; g.fillRect(0, 0, CW, CH);
    g.font = `700 ${Math.round(ch * 0.86)}px ${GLYPH_FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
    const typed = Math.max(0, (f - 70) * 60);
    for (let y = 0; y < ROWS; y++) {
      const pic = f >= 120 + y * 1.6;
      for (let x = 0; x < COLS; x++) {
        const k = y * COLS + x;
        let ch0 = '', col = CY[2];
        if (pic) {
          if (x === seatCell[0] && y === seatCell[1]) { if (Math.floor(f / 8) % 2 === 0) { ch0 = '_'; col = CY[5]; } }
          else if (L[k] > 0.05) {
            const v = L[k];
            ch0 = KD[k] === 2 ? '#%@&'[Math.floor(h01(x, y, 9) * 4)] : LINE.get(k) ?? GLYPHS[Math.min(GLYPHS.length - 1, Math.floor(v * (GLYPHS.length - 1)))];
            col = KD[k] === 2 ? CY[1] : CY[Math.min(5, Math.floor(v * 5.4))];
          }
        } else if (k < typed) {
          // the stream: tokens in words with gaps (machine text, not language)
          const w = h01(Math.floor(x / 5), y, 3);
          if (w > 0.28 && h01(x, y, 4) > 0.12) ch0 = TOK[Math.floor(h01(x, y, 6) * TOK.length)];
          col = CY[1 + Math.floor(h01(x, y, 8) * 3)];
          if (k > typed - 3) col = CY[5];
        }
        if (!ch0) continue;
        g.fillStyle = col; g.fillText(ch0, x * cw + cw / 2, y * ch + ch / 2 + 1);
      }
    }
    // the screen's own scan: a faint row structure
    g.fillStyle = 'rgba(0,0,0,0.14)';
    for (let y = 0; y < CH; y += 4) g.fillRect(0, y, CW, 1);
    tex.needsUpdate = true;
  };
  return {tex, draw};
};
