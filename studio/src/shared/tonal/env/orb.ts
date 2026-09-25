/**
 * THE ORB: a floating chrome sphere with a mechanical iris, as a TONAL MODEL.
 * Local units: centre (0,0), radius R = 75 (so ~150 px at scale 1). Place it with
 * transformModel(orb(...), 'translate(820 330)').
 *
 * Chrome = reflections, not shading: dark ceiling above a curved reflected horizon, the monitor-lit
 * desk below it, the monitor screen as a warped hot rectangle on the side facing it (screen-right),
 * a sliver of Mas on the side facing him, faint window slats, a Fresnel rim.
 * The iris housing is a real disc on the sphere surface: its ellipse foreshortening and the
 * seam ring are computed from the gaze direction, so gaze animation reads as a 3D eyeball turn.
 */
import type {ToneModel, TP, Tone} from '../types';
import type {EnvTP} from './geo';
import {V2, poly, polyline, smooth, circle, clamp01, lerp} from './geo';

export interface OrbParams {
  /** Aperture 0 = pinhole .. 1 = wide open. */
  iris?: number;
  /** Gaze -1..1 (x>0 = toward screen-right / the monitor, x<0 = toward Mas; y>0 = down). Max ~52 deg. */
  gazeX?: number;
  gazeY?: number;
  /** Eye glow 0 (dead lens) .. 1 (hot core + halo on the wall). */
  glow?: number;
  /** Aperture blade rotation offset in degrees (mechanical twitch). */
  spin?: number;
  /** Radius in local units. */
  R?: number;
}

export const ORB_HUES: Record<string, string> = {
  chrome: '#7E8A9C',
  chromeDk: '#2A3140',
  deskRefl: '#46606B',
  hot: '#9FEFFF',
  city: '#6B5754',
  skin: '#B98A75',
  metal: '#8F99A8',
  blade: '#4E5868',
  eye: '#3FE6FF',
  halo: '#2C5563',
  void: '#07080C',
};

const f3 = (n: number) => (Math.round(n * 1000) / 1000).toString();

export const orb = (p: OrbParams = {}): ToneModel => {
  const {iris = 0.5, gazeX = -0.55, gazeY = 0.2, glow = 0.8, spin = 0, R = 75} = p;
  const T: TP[] = [];
  const add = (hue: string, tone: Tone, d: string, extra: Partial<EnvTP> = {}) => T.push({hue, tone, d, ...extra});
  const g = clamp01(glow);

  // ---------- halo on the air/wall behind (posterized, only when the eye is hot) ----------
  // only in "overdrive" (glow > 0.85) does it throw a corona; soft renderer blurs it into a bloom
  if (g > 0.85) add('halo', 2, circle(0, 0, R * (1.06 + 0.5 * (g - 0.85))), {soft: 10});

  // ---------- chrome body ----------
  add('chrome', 1, circle(0, 0, R));
  // reflected horizon: a gentle smile across the lower-middle of the ball
  const hz = (x: number) => R * 0.14 + (x * x) / (R * 5.5);
  const clipBelow = (h: (x: number) => number, rr = R) => {
    // region of the disc below curve h (points listed boundary-first)
    const pts: V2[] = [];
    const n = 48;
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * Math.PI * 2;
      const x = Math.cos(a) * rr;
      const y = Math.sin(a) * rr;
      pts.push([x, Math.max(y, h(x))]);
    }
    return pts.filter(([x, y]) => x * x + y * y <= rr * rr * 1.0001);
  };
  const below = clipBelow(hz);
  add('deskRefl', 2, poly(below));
  // bright desk-pool band just under the horizon (compressed toward the rim)
  add('deskRefl', 3, poly(clipBelow((x) => hz(x), R).map(([x, y]) => [x, Math.min(y, hz(x) + R * 0.13 * (1 - Math.abs(x) / R))] as V2)));
  // room cap: dim far wall just above the horizon, near-black ceiling above that
  add('chromeDk', 1, poly(clipBelow((x) => -R * 2).map(([x, y]) => [x, Math.min(y, hz(x) - R * 0.015)] as V2)));
  add('chromeDk', 0, poly(clipBelow((x) => -R * 2).map(([x, y]) => [x, Math.min(y, hz(x) - R * 0.2 - (x * x) / (R * 9))] as V2)));
  // window slats reflected, upper left, bent by the curvature
  for (let i = 0; i < 5; i++) {
    const y0 = -R * 0.62 + i * R * 0.11;
    const pts: V2[] = [];
    for (let k = 0; k <= 8; k++) {
      const x = lerp(-R * 0.78, -R * 0.3, k / 8);
      pts.push([x, y0 + ((x + R * 0.54) ** 2) / (R * 3.2) - (x * 0.08)]);
    }
    const lim = pts.filter(([x, y]) => x * x + y * y < R * R * 0.86);
    if (lim.length > 1) add('city', 2, polyline(lim), {line: R * 0.035});
  }
  // Mas, tiny and warped, on the side facing him
  // (lit side of his face: a narrow warm sliver compressed against the rim, under a dark hair cap)
  add('skin', 1, smooth([[-R * 0.93, -R * 0.12], [-R * 0.87, -R * 0.24], [-R * 0.8, -R * 0.2], [-R * 0.79, R * 0.0], [-R * 0.86, R * 0.1], [-R * 0.93, R * 0.06]]));
  add('skin', 2, smooth([[-R * 0.86, -R * 0.18], [-R * 0.81, -R * 0.16], [-R * 0.8, -R * 0.02], [-R * 0.84, R * 0.04]]));
  add('chromeDk', 0, smooth([[-R * 0.95, -R * 0.16], [-R * 0.88, -R * 0.32], [-R * 0.8, -R * 0.3], [-R * 0.86, -R * 0.2]]));
  // the MONITOR screen, warped hot rectangle on the side facing it
  // (a curved quad: sides follow the ball's meridians, pinched toward the rim)
  const quad = (x0: number, x1: number, y0: number, y1: number): V2[] => {
    const pts: V2[] = [];
    const bow = (x: number) => 1 - (x / R) ** 2 * 0.55;
    for (let i = 0; i <= 6; i++) {
      const x = lerp(x0, x1, i / 6);
      pts.push([x, y0 * bow(x) - R * 0.04 * (x / R)]);
    }
    for (let i = 0; i <= 6; i++) {
      const x = lerp(x1, x0, i / 6);
      pts.push([x, y1 * bow(x) + R * 0.03 * (x / R)]);
    }
    return pts;
  };
  add('chromeDk', 0, poly(quad(R * 0.36, R * 0.9, -R * 0.26, R * 0.5)));
  add('hot', 4, poly(quad(R * 0.42, R * 0.86, -R * 0.2, R * 0.44)), {light: true});
  add('eye', 3, poly(quad(R * 0.47, R * 0.6, -R * 0.1, R * 0.35)));
  // rack LED sparkles
  [[0.55, -0.55], [0.62, -0.5], [0.5, -0.47], [0.68, -0.4]].forEach(([x, y], i) => add(i % 2 ? 'hot' : 'eye', 4, circle(x * R, y * R, R * 0.022), {light: true}));
  // Fresnel rim: thin all round, hot on the monitor side
  add('chrome', 2, `M ${-R} 0 A ${R} ${R} 0 1 0 ${R} 0 A ${R} ${R} 0 1 0 ${-R} 0 Z M ${-R * 0.955} 0 A ${R * 0.955} ${R * 0.955} 0 1 1 ${R * 0.955} 0 A ${R * 0.955} ${R * 0.955} 0 1 1 ${-R * 0.955} 0 Z`);
  const arc = (r: number, a0: number, a1: number, n = 20): V2[] => Array.from({length: n + 1}, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    return [Math.cos(a) * r, Math.sin(a) * r];
  });
  add('hot', 4, polyline(arc(R * 0.975, -62, 58)), {line: R * 0.045, light: true});
  add('chrome', 3, polyline(arc(R * 0.975, 150, 215)), {line: R * 0.03});

  // ---------- gaze geometry ----------
  const maxG = (52 * Math.PI) / 180;
  const gl = Math.min(1, Math.hypot(gazeX, gazeY));
  const theta = gl * maxG;
  const phi = Math.atan2(gazeY, gazeX || 1e-6);
  const n3 = [Math.sin(theta) * Math.cos(phi), Math.sin(theta) * Math.sin(phi), -Math.cos(theta)];
  const ri = 0.47; // iris housing radius / R
  const alpha = Math.asin(ri);
  const cDepth = Math.cos(alpha);
  const cx = n3[0] * R * cDepth;
  const cy = n3[1] * R * cDepth;
  const sq = Math.cos(theta);
  const phiDeg = (phi * 180) / Math.PI;
  const disc = `translate(${f3(cx)} ${f3(cy)}) rotate(${f3(phiDeg)}) scale(${f3(Math.max(0.05, sq))} 1)`;
  const D = (d: string, hue: string, tone: Tone, extra: Partial<EnvTP> = {}) => add(hue, tone, d, {transform: disc, ...extra});

  // seam ring on the shell (great-ish circle concentric with the iris), visible half only
  const seam = (beta: number) => {
    const u = [-Math.sin(phi), Math.cos(phi), 0];
    // v = n x u
    const v = [n3[1] * u[2] - n3[2] * u[1], n3[2] * u[0] - n3[0] * u[2], n3[0] * u[1] - n3[1] * u[0]];
    const segs: V2[][] = [];
    let cur: V2[] = [];
    for (let i = 0; i <= 72; i++) {
      const t = (i / 72) * Math.PI * 2;
      const pt = [0, 1, 2].map((k) => R * (Math.cos(beta) * n3[k] + Math.sin(beta) * (Math.cos(t) * u[k] + Math.sin(t) * v[k])));
      if (pt[2] < -R * 0.04) cur.push([pt[0], pt[1]]);
      else if (cur.length) {
        segs.push(cur);
        cur = [];
      }
    }
    if (cur.length) segs.push(cur);
    return segs;
  };
  seam((58 * Math.PI) / 180).forEach((s) => s.length > 1 && add('void', 0, polyline(s), {line: R * 0.026}));
  seam((60 * Math.PI) / 180).forEach((s) => s.length > 1 && add('chrome', 3, polyline(s), {line: R * 0.012}));

  // light direction in disc-local space (screen-right), for highlights that stay put while it turns
  const lightLocal = -phiDeg;

  // housing: groove, bezel, notches
  D(circle(0, 0, R * (ri + 0.045)), 'void', 0);
  D(circle(0, 0, R * ri), 'metal', 2);
  D(circle(0, 0, R * (ri - 0.07)), 'metal', 1);
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * Math.PI * 2 + (spin * Math.PI) / 360;
    D(polyline([[Math.cos(a) * R * (ri - 0.075), Math.sin(a) * R * (ri - 0.075)], [Math.cos(a) * R * (ri - 0.01), Math.sin(a) * R * (ri - 0.01)]]), 'void', 0, {line: R * 0.018});
  }
  D(polyline(arc(R * (ri - 0.012), lightLocal - 70, lightLocal + 40, 18)), 'hot', 4, {line: R * 0.028, light: true});
  D(polyline(arc(R * (ri - 0.085), lightLocal + 110, lightLocal + 230, 18)), 'metal', 3, {line: R * 0.018});

  // aperture blades (pinwheel of extended polygon edges)
  const N = 7;
  const rb = R * (ri - 0.085);
  const a = R * lerp(0.05, 0.3, clamp01(iris));
  const rot = ((spin + iris * 38) * Math.PI) / 180;
  const Vt = (i: number): V2 => {
    const t = rot + (i * Math.PI * 2) / N;
    return [Math.cos(t) * a, Math.sin(t) * a];
  };
  const hitRing = (p0: V2, p1: V2): V2 => {
    const dx = p1[0] - p0[0];
    const dy = p1[1] - p0[1];
    // |p0 + s d| = rb, s > 1
    const A = dx * dx + dy * dy;
    const B = 2 * (p0[0] * dx + p0[1] * dy);
    const C = p0[0] ** 2 + p0[1] ** 2 - rb * rb;
    const s = (-B + Math.sqrt(Math.max(0, B * B - 4 * A * C))) / (2 * A);
    return [p0[0] + dx * s, p0[1] + dy * s];
  };
  const E = (j: number) => hitRing(Vt(j), Vt(j + 1));
  for (let j = 0; j < N; j++) {
    const e0 = E(j);
    const e1 = E(j + 1);
    const a0 = Math.atan2(e0[1], e0[0]);
    let a1 = Math.atan2(e1[1], e1[0]);
    while (a1 < a0) a1 += Math.PI * 2;
    const arcPts: V2[] = Array.from({length: 9}, (_, i) => {
      const t = a0 + ((a1 - a0) * i) / 8;
      return [Math.cos(t) * rb, Math.sin(t) * rb];
    });
    const mid = Vt(j + 1);
    const facing = Math.cos(Math.atan2(mid[1], mid[0]) + (phiDeg * Math.PI) / 180);
    const tone: Tone = facing > 0.35 ? 2 : facing > -0.45 ? 1 : 0;
    D(poly([Vt(j + 1), ...arcPts, Vt(j + 2)]), 'blade', tone);
    // leading edge of each blade catches the light
    D(polyline([Vt(j + 1), e0]), facing > 0 ? 'hot' : 'metal', facing > 0.2 ? 3 : 2, {line: R * 0.016});
  }
  // aperture: deep socket, then the lens
  const ap = Array.from({length: N}, (_, i) => Vt(i));
  D(poly(ap), 'void', 0);
  const lr = a * 0.8;
  if (g > 0.05) {
    D(circle(0, 0, lr), 'eye', g > 0.5 ? 3 : 2);
    D(circle(0, 0, lr * (0.45 + 0.35 * g)), 'eye', 4, {light: true});
    D(circle(0, 0, lr * 0.22), 'void', 0);
  } else {
    D(circle(0, 0, lr), 'blade', 1);
    D(circle(0, 0, lr * 0.5), 'void', 0);
  }
  // catchlight on the lens (screen-space upper right)
  const cl = (lightLocal - 40) * (Math.PI / 180);
  D(circle(Math.cos(cl) * lr * 0.55, Math.sin(cl) * lr * 0.55, Math.max(1.6, lr * 0.14)), 'hot', 4, {light: true});

  // specular pin on the shell
  add('hot', 4, circle(R * 0.36, -R * 0.52, R * 0.05), {light: true});

  return {paths: T, hues: ORB_HUES, box: [-R * 1.5, -R * 1.5, R * 3, R * 3]};
};
