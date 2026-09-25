// Realism kit — PAINTED NORMAL PASS + computed light (builder key: realism).
//
// Each drawn part (skin, hair, cloth) is authored as a *normal map*: flat anatomical planes (Asaro-style),
// each filled with the colour that encodes its surface normal, softened into each other with blur.
// A filter then computes the light per pixel with colour matrices:
//   key  (the cyan monitor)  -> half-Lambert value -> gradient-mapped through a painterly ramp
//                               (cool shadow -> warm subsurface band at the terminator -> cyan-lit skin)
//   rim  (the warm doorway)  -> thresholded N·L from behind -> additive warm rim
//   spec (monitor sheen)     -> (N·H)^n -> additive
// A turbulence displacement on the normal pass gives brush-stroke breakup that *catches the light*.
// Result: light can move / fade (door opening, flicker) on any drawn angle with no repainting.
import React from 'react';
import {useUid} from './paint';

export type V3 = [number, number, number];

export const norm3 = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};
/** Normal from yaw φ (deg, − = facing screen-left, + = screen-right) and pitch θ (deg, + = facing up). */
export const nrm = (phi: number, theta = 0): V3 => {
  const p = (phi * Math.PI) / 180, t = (theta * Math.PI) / 180;
  return [Math.sin(p) * Math.cos(t), -Math.sin(t), Math.cos(p) * Math.cos(t)];
};
const h2 = (v: number) => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0');
/** Normal-map colour: R=(nx+1)/2, G=(ny+1)/2, B=nz. */
export const ncol = (n: V3) => {
  const [x, y, z] = norm3(n);
  return `#${h2((x + 1) / 2)}${h2((y + 1) / 2)}${h2(Math.max(0, z))}`;
};
/** Shorthand: normal colour from yaw/pitch. */
export const N = (phi: number, theta = 0) => ncol(nrm(phi, theta));

// ---------- colour ramp helpers ----------
const hex = (c: string): [number, number, number] => {
  const s = c.replace('#', '');
  return [parseInt(s.slice(0, 2), 16) / 255, parseInt(s.slice(2, 4), 16) / 255, parseInt(s.slice(4, 6), 16) / 255];
};
export type Ramp = [number, string][];
/** Sample a ramp (stops sorted by t) into an n-entry table per channel. */
export function rampTables(stops: Ramp, n = 33): [string, string, string] {
  const r: number[] = [], g: number[] = [], b: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    let j = 0;
    while (j < stops.length - 2 && stops[j + 1][0] < t) j++;
    const [t0, c0] = stops[j], [t1, c1] = stops[Math.min(j + 1, stops.length - 1)];
    const u = t1 === t0 ? 0 : Math.max(0, Math.min(1, (t - t0) / (t1 - t0)));
    const s = u * u * (3 - 2 * u);
    const a = hex(c0), bb = hex(c1);
    r.push(a[0] + (bb[0] - a[0]) * s);
    g.push(a[1] + (bb[1] - a[1]) * s);
    b.push(a[2] + (bb[2] - a[2]) * s);
  }
  const f = (x: number[]) => x.map((v) => v.toFixed(3)).join(' ');
  return [f(r), f(g), f(b)];
}
/** Mix two hex colours. */
export const mixc = (a: string, b: string, t: number) => {
  const A = hex(a), B = hex(b);
  return `#${h2(A[0] + (B[0] - A[0]) * t)}${h2(A[1] + (B[1] - A[1]) * t)}${h2(A[2] + (B[2] - A[2]) * t)}`;
};
/** Scale a ramp's lit half toward its shadow (key dimming / flicker). */
export const dimRamp = (stops: Ramp, k: number, pivot = 0.5): Ramp => {
  const base = stops.find((s) => s[0] >= pivot)?.[1] ?? stops[0][1];
  return stops.map(([t, c]) => [t, t > pivot ? mixc(base, c, k) : c]);
};

export interface LightRig {
  key: V3; // direction TO the light
  ramp: Ramp; // half-Lambert value 0..1 -> colour
  rim?: V3;
  rimColor?: string;
  rimAmt?: number; // 0..1 intensity
  rimCut?: number; // N·L threshold where the rim starts (0..1)
  rimSoft?: number; // width of the rim ramp
  spec?: number; // 0..1 amount of computed sheen
  specColor?: string;
  specPow?: number;
}

/**
 * A lit part. `children` = the normal pass (opaque inside the part). The output is clipped by the caller.
 * `box` = filter region in local units [x, y, w, h]. `rag` = brush displacement, `grainN` = normal jitter.
 */
export const Lit: React.FC<{
  light: LightRig;
  box: [number, number, number, number];
  rag?: number;
  ragFreq?: number;
  seed?: number;
  soften?: number;
  children: React.ReactNode;
}> = ({light, box, rag = 0, ragFreq = 0.035, seed = 7, soften = 0.8, children}) => {
  const id = useUid();
  const L = norm3(light.key);
  const [kr, kg, kb] = rampTables(light.ramp);
  // half-Lambert: t = 0.5 + 0.5 * N·L ; N = (2R-1, 2G-1, B)
  const keyRow = `${L[0]} ${L[1]} ${L[2] / 2} 0 ${0.5 - (L[0] + L[1]) / 2}`;
  const R = light.rim ? norm3(light.rim) : ([1, 0, 0] as V3);
  // rim: N·Lr (not halved), shifted by cut, steepened by 1/soft
  const cut = light.rimCut ?? 0.25;
  const soft = light.rimSoft ?? 0.35;
  const rs = 1 / soft;
  const rimRow = `${2 * R[0] * rs} ${2 * R[1] * rs} ${R[2] * rs} 0 ${(-(R[0] + R[1]) - cut) * rs}`;
  // spec: H = normalize(L + V)
  const H = norm3([L[0], L[1], L[2] + 1]);
  const specRow = `${2 * H[0]} ${2 * H[1]} ${H[2]} 0 ${-(H[0] + H[1])}`;
  const [x, y, w, h] = box;
  const rc = hex(light.rimColor ?? '#ffb070');
  const sc = hex(light.specColor ?? '#e0fbff');
  const rimAmt = light.rimAmt ?? 0;
  const spec = light.spec ?? 0;
  return (
    <g>
      <filter id={id} x={x} y={y} width={w} height={h} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        {rag > 0 ? (
          <>
            <feTurbulence type="fractalNoise" baseFrequency={ragFreq} numOctaves={3} seed={seed} result="tn" />
            <feDisplacementMap in="SourceGraphic" in2="tn" scale={rag} xChannelSelector="R" yChannelSelector="B" result="nm0" />
          </>
        ) : (
          <feOffset in="SourceGraphic" dx={0} dy={0} result="nm0" />
        )}
        <feGaussianBlur in="nm0" stdDeviation={soften} result="nm" />
        {/* key -> gradient map */}
        <feColorMatrix in="nm" type="matrix" values={`${keyRow}  ${keyRow}  ${keyRow}  0 0 0 1 0`} result="kt" />
        <feComponentTransfer in="kt" result="kc">
          <feFuncR type="table" tableValues={kr} />
          <feFuncG type="table" tableValues={kg} />
          <feFuncB type="table" tableValues={kb} />
        </feComponentTransfer>
        {/* rim: alpha = ramped N·Lr */}
        {rimAmt > 0 ? (
          <>
            <feColorMatrix in="nm" type="matrix" values={`0 0 0 0 ${rc[0]}  0 0 0 0 ${rc[1]}  0 0 0 0 ${rc[2]}  ${rimRow}`} result="ra" />
            <feComponentTransfer in="ra" result="rb">
              <feFuncA type="linear" slope={rimAmt} intercept={0} />
            </feComponentTransfer>
            <feComposite in="rb" in2="kc" operator="arithmetic" k1={0} k2={1} k3={1} k4={0} result="kr" />
          </>
        ) : (
          <feOffset in="kc" result="kr" />
        )}
        {spec > 0 ? (
          <>
            <feColorMatrix in="nm" type="matrix" values={`0 0 0 0 ${sc[0]}  0 0 0 0 ${sc[1]}  0 0 0 0 ${sc[2]}  ${specRow}`} result="sa" />
            <feComponentTransfer in="sa" result="sb">
              <feFuncA type="gamma" amplitude={spec} exponent={light.specPow ?? 18} offset={0} />
            </feComponentTransfer>
            <feComposite in="sb" in2="kr" operator="arithmetic" k1={0} k2={1} k3={1} k4={0} result="ks" />
          </>
        ) : (
          <feOffset in="kr" result="ks" />
        )}
        <feComposite in="ks" in2="SourceAlpha" operator="in" />
      </filter>
      <g filter={`url(#${id})`}>{children}</g>
    </g>
  );
};
