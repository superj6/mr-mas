// MR. MAS — Ep2 v1 · act1: figures the Act One scenes share (the shots pass, 2026-10-09): a person from behind, very
// close, as an over-the-shoulder foreground (Mas at the séance and in the boardroom by day; Nole holding the candle).
import {Buf, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {RH} from './common';

/** a person from behind, very close (an OTS foreground): the back of the skull and its hair (strands sweeping up to
 *  the crown's whorl), the ear and a sliver of cheek on the side he looks toward, the nape, the collar (Mas's hood
 *  rolled round his neck; Nole's black tee) and the shoulders' slope out of frame; lit by the candles on `side`, a warm
 *  rim along that edge; drawn a rung soft (out of focus) */
export interface BackHead { hair: number[]; skin: number[]; top: number[]; collar: 'hood' | 'tee'; side: -1 | 1; rim: number; scale?: number; cheek?: number }
export const backHead = (b: Buf, cx: number, cy: number, o: BackHead) => {
  const s = o.scale ?? 1, rx = 31 * s, ry = 38 * s;
  const side = o.side;
  // the shoulders and the collar (behind the neck): flat ramps (the lit side, the mid, the far side's shadow), the rim
  // on the lit edge; no dither (it read as a mesh at 1080p)
  const sy = cy + ry * 0.95;
  for (let y = Math.floor(sy); y < RH; y++) for (let x = Math.floor(cx - 150 * s); x < cx + 150 * s; x++) {
    const t = clamp((y - sy) / (46 * s), 0, 1);
    const half = 34 * s + Math.sqrt(t) * 104 * s;
    const dx = x - cx;
    if (Math.abs(dx) > half) continue;
    const edge = Math.abs(dx) > half - 2 && Math.sign(dx) === side;
    const lit = dx * side > half * 0.7, deep = dx * side < -half * 0.45;
    b.set(x, y, edge ? o.rim : lit ? o.top[2] : deep ? o.top[0] : o.top[1]);
  }
  // the collar, walked in the frame's own pixels (a scaled shape stepped in its own units left holes: a checker)
  if (o.collar === 'hood') {
    const hy = sy - 6 * s;
    for (let Y = Math.floor(hy - 13 * s); Y <= Math.ceil(hy + 13 * s); Y++) for (let X = Math.floor(cx - 46 * s); X <= Math.ceil(cx + 46 * s); X++) {
      const i = (X - cx) / s, j = (Y - hy) / s;
      if (Math.hypot(i / 46, j / 13) >= 1 || Y >= RH || Y < 0) continue;
      b.set(X, Y, j < -5 ? o.top[2] : i * side > 22 ? o.top[2] : o.top[1]);
    }
  } else for (let X = Math.floor(cx - 30 * s); X <= Math.ceil(cx + 30 * s); X++) { const Y = Math.round(sy - 2 * s + Math.abs(X - cx) * 0.12); if (Y < RH) { b.set(X, Y, o.top[2]); b.set(X, Y + 1, o.top[1]); } }
  // the neck and nape (skin), narrower than the skull
  for (let y = Math.floor(cy + ry * 0.55); y < sy; y++) for (let x = Math.floor(cx - 18 * s); x < cx + 18 * s; x++) if (y < RH) b.set(x, y, (x - cx) * side > 6 * s ? o.skin[2] : o.skin[1]);
  // the skull: hair over all of it but the nape; strands curve up from the nape toward the crown's whorl (upper,
  // toward the far side); the lit edge toward `side`
  const wx = cx - side * 6 * s, wy = cy - ry * 0.55;
  for (let y = Math.floor(cy - ry); y < cy + ry; y++) for (let x = Math.floor(cx - rx); x < cx + rx; x++) {
    if (y < 0 || y >= RH) continue;
    const u = (x - cx) / rx, v = (y - cy) / ry;
    const d = Math.hypot(u, v * (v > 0 ? 1.12 : 1));
    if (d >= 1) continue;
    const hairline = cy + ry * (0.62 - Math.abs(u) * 0.25);
    if (y > hairline) { b.set(x, y, u * side > 0.3 ? o.skin[2] : o.skin[1]); continue; }
    const strand = ((x + Math.floor(y * 0.6) * side) % 5 === 0) && hash(x >> 2, y >> 1, 5) < 0.6;
    void wx; void wy;
    const lit = u * side + -v * 0.35 > 0.5;
    const c = d > 0.93 && u * side > 0.2 ? o.rim : lit ? (strand ? o.hair[3] : o.hair[2]) : u * side < -0.4 ? (strand ? o.hair[1] : o.hair[0]) : strand ? o.hair[2] : o.hair[1];
    b.set(x, y, c);
  }
  // the ear on the side he looks toward, and the cheek's edge beyond it (the turn): solid skin ramps in the frame's own
  // pixels, a one-step rim on the cheek (never the candle's orange on skin)
  const ex = cx + side * (rx - 4 * s), ey = cy + 2 * s;
  for (let Y = Math.floor(ey - 10 * s); Y <= Math.ceil(ey + 10 * s); Y++) for (let X = Math.floor(ex - 5 * s); X <= Math.ceil(ex + 5 * s); X++) {
    const i = (X - ex) / s, j = (Y - ey) / s;
    if (Math.hypot(i / 4.5, j / 9.5) >= 1 || Y < 0 || Y >= RH) continue;
    b.set(X, Y, i * side > 1.5 ? o.skin[3] : j > 4 ? o.skin[1] : o.skin[2]);
  }
  const ch = o.cheek ?? 0;
  if (ch > 0) {
    // the cheek: a crescent hugging the skull's outline beyond the ear (widest at the cheekbone, closing at the temple
    // and at the jaw), so it reads as the face turning, never a stick beside the head
    const y0 = ey - 8 * s, y1 = ey + 24 * s, wMax = ch * s;
    for (let Y = Math.floor(y0); Y <= Math.ceil(y1); Y++) {
      if (Y < 0 || Y >= RH) continue;
      const v = (Y - cy) / ry, k = v * (v > 0 ? 1.12 : 1);
      const xe = cx + side * rx * Math.sqrt(Math.max(0, 1 - Math.min(1, k * k))) - side;
      const t = (Y - y0) / (y1 - y0), w = Math.round(wMax * Math.sin(Math.PI * Math.min(1, Math.max(0, t))));
      for (let q = 1; q <= w; q++) { const X = Math.round(xe + side * q); b.set(X, Y, q === w ? o.skin[3] : o.skin[2]); }
    }
  }
};
