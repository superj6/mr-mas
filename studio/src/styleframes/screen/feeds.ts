// Value painters for the two camera feeds. They draw LIGHT (grey 0..1), never color:
// color is the feed's duotone, applied by LineScreen. Deterministic per frame.
import type {ToneModel, TP} from '../../shared/tonal/types';
import {drawModel} from '../../shared/tonal/ToneCanvas';
import {luminance} from '../../shared/theme/color';
import {masTone, MasToneParams} from '../../shared/tonal/masTone';
import {noleTone, NoleToneParams} from './noleTone';
import {gv} from './LineScreen';

const TV = [0.025, 0.19, 0.43, 0.7, 0.97];

/** Tonal plane -> light value: tone ladder scaled by the local color's lightness. */
export const valueOf = (model: ToneModel, boost: Partial<Record<string, number>> = {}) => (p: TP) => {
  if (p.light) return gv(1);
  const hex = p.hue.startsWith('#') ? p.hue : model.hues[p.hue] ?? '#888888';
  const k = (0.36 + 0.8 * luminance(hex)) * (boost[p.hue] ?? 1);
  return gv(TV[p.tone] * k);
};

/** Prepend a transform to the head planes (they carry a rotate(...) group transform). */
export const shiftHead = (m: ToneModel, t: string): ToneModel => ({
  ...m,
  paths: m.paths.map((p) => (p.transform && p.transform.startsWith('rotate') ? {...p, transform: `${t} ${p.transform}`} : p)),
});

const rrect = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
};

// ============================== MAS: dark room, monitor light from screen-right ==============================
export interface MasFeed {
  rig: MasToneParams;
  /** Head translate (local units) — the extra "turn toward lens" shift. */
  headDx?: number;
  /** Body offset px. */
  bx?: number;
  by?: number;
  /** Monitor light intensity (flicker / scroll pulses). */
  light?: number;
  /** Draw the water glass in the foreground. */
  glass?: boolean;
  /** Placement (for closeups / avatars). */
  scale?: number;
  cx?: number;
  cy?: number;
}

export const paintMasFeed = (c: CanvasRenderingContext2D, w: number, h: number, s: MasFeed) => {
  const L = s.light ?? 1;
  // back wall: dark on the left, monitor spill on the right
  const g = c.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, gv(0.015));
  g.addColorStop(0.55, gv(0.05 * L));
  g.addColorStop(1, gv(0.15 * L));
  c.fillStyle = g;
  c.fillRect(0, 0, w, h);
  const r = c.createRadialGradient(w * 1.02, h * 0.36, 0, w * 1.02, h * 0.36, w * 0.62);
  r.addColorStop(0, gv(0.3 * L));
  r.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = r;
  c.fillRect(0, 0, w, h);
  // night window with blinds, far left (moonlight slats)
  const wx = w * 0.05;
  const wy = h * 0.1;
  const ww = w * 0.2;
  const wh = h * 0.5;
  c.fillStyle = gv(0.03);
  c.fillRect(wx - 6, wy - 6, ww + 12, wh + 12);
  for (let i = 0; i < 13; i++) {
    const y = wy + (i / 13) * wh;
    const lg = c.createLinearGradient(wx, 0, wx + ww, 0);
    lg.addColorStop(0, gv(0.2));
    lg.addColorStop(1, gv(0.07));
    c.fillStyle = lg;
    c.fillRect(wx, y, ww, wh / 13 - 5);
  }
  // shelf silhouette + a small plant (depth cue)
  c.fillStyle = gv(0.06);
  c.fillRect(w * 0.64, h * 0.2, w * 0.36, 6);
  c.fillStyle = gv(0.1 * L);
  rrect(c, w * 0.72, h * 0.2 - 44, 26, 44, 3);
  c.fill();
  rrect(c, w * 0.78, h * 0.2 - 30, 40, 30, 3);
  c.fill();

  // MAS
  const model = shiftHead(masTone(s.rig), `translate(${s.headDx ?? 0} 0)`);
  c.save();
  c.translate((s.cx ?? w * 0.42) + (s.bx ?? 0), (s.cy ?? h * 0.47) + (s.by ?? 0));
  const k = s.scale ?? 0.64;
  c.scale(k, k);
  drawModel(c, model, valueOf(model, {hoodie: 0.9, string: 0.8}));
  c.restore();

  if (s.glass !== false) {
    // desk surface (foreground), monitor-lit toward the right
    const dg = c.createLinearGradient(0, 0, w, 0);
    dg.addColorStop(0, gv(0.03));
    dg.addColorStop(0.6, gv(0.15 * L));
    dg.addColorStop(1, gv(0.34 * L));
    c.fillStyle = dg;
    c.beginPath();
    c.moveTo(0, h - 40);
    c.lineTo(w, h - 56);
    c.lineTo(w, h);
    c.lineTo(0, h);
    c.closePath();
    c.fill();
    // desk edge glint
    c.strokeStyle = gv(0.5 * L);
    c.lineWidth = 1.6;
    c.beginPath();
    c.moveTo(w * 0.35, h - 45);
    c.lineTo(w, h - 56);
    c.stroke();
    // THE GLASS OF WATER (foreground right)
    drawGlass(c, w * 0.86, h - 22, 1, L);
  }
};

/** A tumbler of still water, standing at (x, baseY). Lit from the right. */
export const drawGlass = (c: CanvasRenderingContext2D, x: number, baseY: number, k = 1, L = 1) => {
  c.save();
  c.translate(x, baseY);
  c.scale(k, k);
  const tw = 30;
  const bw = 25;
  const gh = 92;
  // soft contact shadow/caustic on the desk
  const cg = c.createRadialGradient(8, 2, 0, 8, 2, 46);
  cg.addColorStop(0, gv(0.55 * L));
  cg.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = cg;
  c.fillRect(-40, -8, 96, 22);
  // body
  c.beginPath();
  c.moveTo(-tw, -gh);
  c.lineTo(tw, -gh);
  c.lineTo(bw, 0);
  c.lineTo(-bw, 0);
  c.closePath();
  c.fillStyle = gv(0.06);
  c.fill();
  // water
  const wl = -gh * 0.62;
  c.beginPath();
  c.moveTo(-tw * 0.93 + 2, wl);
  c.lineTo(tw * 0.93 - 2, wl);
  c.lineTo(bw - 3, -6);
  c.lineTo(-bw + 3, -6);
  c.closePath();
  const wg = c.createLinearGradient(-tw, 0, tw, 0);
  wg.addColorStop(0, gv(0.08));
  wg.addColorStop(0.7, gv(0.26 * L));
  wg.addColorStop(1, gv(0.55 * L));
  c.fillStyle = wg;
  c.fill();
  // meniscus: dead flat
  c.fillStyle = gv(0.82 * L);
  c.fillRect(-tw * 0.93 + 2, wl - 1.5, tw * 1.86 - 4, 3);
  // wall highlights (right wall catches the monitor)
  c.fillStyle = gv(0.95 * L);
  c.beginPath();
  c.moveTo(tw - 7, -gh + 4);
  c.lineTo(tw - 2, -gh + 4);
  c.lineTo(bw - 1, -4);
  c.lineTo(bw - 5, -4);
  c.closePath();
  c.fill();
  c.fillStyle = gv(0.3 * L);
  c.fillRect(-tw + 3, -gh + 6, 3, gh - 14);
  // rim + base
  c.strokeStyle = gv(0.7 * L);
  c.lineWidth = 2.4;
  c.beginPath();
  c.moveTo(-tw, -gh);
  c.lineTo(tw, -gh);
  c.stroke();
  c.fillStyle = gv(0.45 * L);
  c.fillRect(-bw, -6, bw * 2, 6);
  c.restore();
};

// ============================== NOLE: warm office, door he just blew through ==============================
export interface NoleFeed {
  rig: NoleToneParams;
  /** Body translate px (enter from the right, lean). */
  x?: number;
  y?: number;
  scale?: number;
  rot?: number;
  /** Horizontal smear (px) for the lunge: multi-exposure ghosting. */
  smear?: number;
  /** Door swing 0 (closed) .. 1 (flung open). */
  door?: number;
  /** Show Nole at all (empty room before he bursts in). */
  present?: boolean;
  phone?: {x: number; y: number; s: number; rot: number; glow: number} | null;
  light?: number;
}

export const paintNoleFeed = (c: CanvasRenderingContext2D, w: number, h: number, s: NoleFeed) => {
  const L = s.light ?? 1;
  // back wall: key window off-left washes the wall
  const g = c.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, gv(0.34 * L));
  g.addColorStop(0.45, gv(0.2 * L));
  g.addColorStop(1, gv(0.1 * L));
  c.fillStyle = g;
  c.fillRect(0, 0, w, h);
  // window light shafts on the wall (big, soft diagonal)
  c.save();
  c.globalAlpha = 0.5;
  for (let i = 0; i < 3; i++) {
    c.fillStyle = gv(0.34 * L);
    c.beginPath();
    const x0 = w * (0.04 + i * 0.12);
    c.moveTo(x0, 0);
    c.lineTo(x0 + w * 0.07, 0);
    c.lineTo(x0 + w * 0.2, h * 0.8);
    c.lineTo(x0 + w * 0.13, h * 0.8);
    c.closePath();
    c.fill();
  }
  c.restore();
  // model rocket on a plinth (left background) — prop, not a logo
  c.fillStyle = gv(0.12);
  c.fillRect(w * 0.1, h * 0.62, 70, h * 0.4);
  c.fillStyle = gv(0.5 * L);
  c.beginPath();
  c.moveTo(w * 0.1 + 35, h * 0.2);
  c.quadraticCurveTo(w * 0.1 + 52, h * 0.3, w * 0.1 + 50, h * 0.62);
  c.lineTo(w * 0.1 + 20, h * 0.62);
  c.quadraticCurveTo(w * 0.1 + 18, h * 0.3, w * 0.1 + 35, h * 0.2);
  c.fill();
  c.fillStyle = gv(0.26 * L);
  c.fillRect(w * 0.1 + 38, h * 0.3, 12, h * 0.32);
  // doorway (hall light) + the door he blew open
  const dx = w * 0.74;
  const dw = w * 0.15;
  const dy = h * 0.06;
  c.fillStyle = gv(0.07);
  c.fillRect(dx - 12, dy - 12, dw + 24, h);
  const hg = c.createLinearGradient(0, dy, 0, h);
  hg.addColorStop(0, gv(0.98 * L));
  hg.addColorStop(1, gv(0.7 * L));
  c.fillStyle = hg;
  c.fillRect(dx, dy, dw, h);
  // light spill on the floor from the door
  c.fillStyle = gv(0.36 * L);
  c.beginPath();
  c.moveTo(dx, h * 0.9);
  c.lineTo(dx + dw, h * 0.9);
  c.lineTo(dx + dw * 1.6, h);
  c.lineTo(dx - dw * 0.8, h);
  c.closePath();
  c.fill();
  // door slab: hinged on the left jamb, swinging toward camera (wider as it opens)
  const open = s.door ?? 0;
  const slabW = dw * (1 - open) + dw * 1.35 * Math.max(0, open - 0.2);
  if (open < 0.2) {
    c.fillStyle = gv(0.16);
    c.fillRect(dx, dy, dw * (1 - open / 0.2) + 1, h);
  } else {
    c.fillStyle = gv(0.1);
    c.beginPath();
    c.moveTo(dx, dy);
    c.lineTo(dx - slabW, dy - 30 * open);
    c.lineTo(dx - slabW, h + 40);
    c.lineTo(dx, h);
    c.closePath();
    c.fill();
    c.fillStyle = gv(0.6 * L);
    c.fillRect(dx - slabW - 3, dy - 30 * open, 5, h);
  }
  // floor line
  c.fillStyle = gv(0.08);
  c.fillRect(0, h * 0.9, dx - 12, h * 0.1);

  if (s.present !== false) {
    const model = noleTone(s.rig);
    const col = valueOf(model, {tee: 1.15, skin: 1.12, neck: 1.08});
    const put = (ox: number, alpha: number) => {
      c.save();
      c.globalAlpha = alpha;
      c.translate(w * 0.5 + (s.x ?? 0) + ox, h * 0.45 + (s.y ?? 0));
      c.rotate(((s.rot ?? 0) * Math.PI) / 180);
      const k = s.scale ?? 0.72;
      c.scale(k, k);
      drawModel(c, model, col);
      c.restore();
    };
    const sm = s.smear ?? 0;
    if (Math.abs(sm) > 2) {
      put(sm * 1.0, 0.25);
      put(sm * 0.6, 0.4);
      put(sm * 0.3, 0.6);
    }
    put(0, 1);
  }
  if (s.phone) drawPhone(c, s.phone.x, s.phone.y, s.phone.s, s.phone.rot, s.phone.glow);
};

/** Nole's phone, held up in his fist, screen to camera (the prop he jabs at the lens). */
export const drawPhone = (c: CanvasRenderingContext2D, x: number, y: number, k: number, rot: number, glow = 1) => {
  c.save();
  c.translate(x, y);
  c.rotate((rot * Math.PI) / 180);
  c.scale(k, k);
  // forearm
  c.fillStyle = gv(0.42);
  c.beginPath();
  c.moveTo(-60, 120);
  c.bezierCurveTo(-70, 200, -90, 300, -110, 420);
  c.lineTo(60, 420);
  c.bezierCurveTo(60, 300, 50, 200, 50, 120);
  c.closePath();
  c.fill();
  c.fillStyle = gv(0.18);
  c.beginPath();
  c.moveTo(20, 130);
  c.bezierCurveTo(30, 220, 40, 320, 60, 420);
  c.lineTo(60, 420);
  c.bezierCurveTo(60, 300, 50, 200, 50, 120);
  c.closePath();
  c.fill();
  // glow halo off the screen
  const hg = c.createRadialGradient(0, -20, 10, 0, -20, 230);
  hg.addColorStop(0, gv(0.35 * glow));
  hg.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = hg;
  c.fillRect(-260, -280, 520, 520);
  // phone body + screen
  c.fillStyle = gv(0.05);
  rrect(c, -78, -170, 156, 310, 26);
  c.fill();
  c.fillStyle = gv(0.97 * glow);
  rrect(c, -68, -160, 136, 290, 18);
  c.fill();
  // screen content: a big post card (reads as UI even through the screen)
  c.fillStyle = gv(0.2);
  c.beginPath();
  // "Z" mark
  c.moveTo(-34, -118);
  c.lineTo(34, -118);
  c.lineTo(34, -104);
  c.lineTo(-10, -58);
  c.lineTo(34, -58);
  c.lineTo(34, -44);
  c.lineTo(-34, -44);
  c.lineTo(-34, -58);
  c.lineTo(10, -104);
  c.lineTo(-34, -104);
  c.closePath();
  c.fill();
  c.fillStyle = gv(0.45);
  [-10, 10, 30, 50].forEach((yy, i) => c.fillRect(-50, yy, i === 3 ? 60 : 100, 9));
  // fist: fingers wrapping the left edge, thumb on the right edge
  c.fillStyle = gv(0.58);
  for (let i = 0; i < 4; i++) {
    rrect(c, -104, -40 + i * 40, 60, 38, 17);
    c.fill();
  }
  c.fillStyle = gv(0.2);
  for (let i = 1; i < 4; i++) c.fillRect(-100, -40 + i * 40 - 2, 50, 3);
  c.fillStyle = gv(0.66);
  rrect(c, 52, 0, 40, 100, 18);
  c.fill();
  c.fillStyle = gv(0.46);
  rrect(c, -90, 110, 150, 60, 26);
  c.fill();
  c.restore();
};

/** Bust only, on a flat backdrop (avatars, profile cards). (x, y) = head center in px. */
export const paintNoleBust = (c: CanvasRenderingContext2D, w: number, h: number, x: number, y: number, k: number, rig: NoleToneParams, back = 0.22) => {
  c.fillStyle = gv(back);
  c.fillRect(0, 0, w, h);
  const model = noleTone(rig);
  c.save();
  c.translate(x, y + 40 * k);
  c.scale(k, k);
  drawModel(c, model, valueOf(model, {tee: 1.15, skin: 1.12, neck: 1.08}));
  c.restore();
};
export const paintMasBust = (c: CanvasRenderingContext2D, w: number, h: number, x: number, y: number, k: number, rig: MasToneParams, back = 0.06) => {
  c.fillStyle = gv(back);
  c.fillRect(0, 0, w, h);
  const model = masTone(rig);
  c.save();
  c.translate(x, y + 30 * k);
  c.scale(k, k);
  drawModel(c, model, valueOf(model, {hoodie: 0.9, string: 0.8}));
  c.restore();
};
