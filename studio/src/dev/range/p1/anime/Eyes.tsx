// MR. MAS - style-range Prototype 1: p120-149, the first anime frame. [ECU] his eyes: ONE key drawing, top-lit by the
// same tungsten pool as the pixel table, a cool rim from the far neon on the far cheek. The camera slides across the
// drawing (it moves; the drawing holds). On p135 his pupils step one line toward the table: his one live motion.
// The drawing is designed at ECU scale on the rig's own eye geometry (MasTungsten's EYE_NEAR / EYE_FAR, the face
// contour, the brows and the bangs): a hard top key leaves the sockets in the dark, catches the brow ridge, the nose
// bridge and the tops of the cheeks, and puts ONE catchlight of the lamp in each iris. Two shadow tones, one highlight.
import React from 'react';
import {Easing, interpolate} from 'remotion';
import {curve, ell, ink, lerpPts, prng, Pt, sample, shift} from '../../../../shared/anime/ink';
import type {EyeSpec} from '../../../../shared/anime/cel';
import {EYE_NEAR, EYE_FAR, FACE, LOCKS} from './MasTungsten';
import {HAIR_MAS, KEY} from './tungsten';
import {Finish} from './finish';
import {T} from '../geo';

// the ECU's own colour script (the rig's tungsten skin, pushed for an extreme close-up in the dark)
const C = {
  deep: '#240F13', shade: '#5E3230', base: '#C07A58', hi: '#F2B68C', line: '#150709', lineSoft: '#4A2424',
  lid: '#3A1C20', whiteTop: '#3E2A2C', whiteBot: '#8E7064', irisOut: '#101A12', irisMid: '#2E4630', irisLow: '#6A8650',
};
const corner = (p: Pt): Pt => [p[0], p[1], 1];

/** one eye as a key drawing (rig units; drawn inside the ECU's scale). k = line weight at this scale */
const EyeKey: React.FC<{id: string; spec: EyeSpec; lookX: number; lookY: number; lid: number; far?: boolean; k: number; glintX?: number}> = ({id, spec, lookX, lookY, lid, far = false, k, glintX}) => {
  const up = lerpPts(spec.upper, spec.closed, lid);
  const n = up.length;
  const lowIn = spec.lower;
  const white = curve([corner(up[0]), ...up.slice(1, n - 1), corner(up[n - 1]), ...[...lowIn].reverse().slice(1, lowIn.length - 1)], true);
  const {cx, cy, rx, ry, rangeX, rangeY} = spec.iris;
  const ix = cx + lookX * rangeX;
  const iy = cy + lookY * rangeY + lid * ry * 0.3;
  const shadowEdge = shift(up, 0, ry * (far ? 0.7 : 0.62));
  const lidShadow = curve([...up, ...[...shadowEdge].reverse()], true);
  const rnd = prng(far ? 71 : 37);
  const NF = far ? 30 : 52;
  const fibres = Array.from({length: NF}, (_, i) => {
    const a = (i / NF) * Math.PI * 2 + rnd() * 0.1;
    const r0 = 0.5 + rnd() * 0.08, r1 = 0.78 + rnd() * 0.18;
    return {d: ink([[ix + Math.cos(a) * rx * r0, iy + Math.sin(a) * ry * r0], [ix + Math.cos(a) * rx * r1, iy + Math.sin(a) * ry * r1]], (0.45 + rnd() * 0.5) * k, {a: 0.3, b: 0.5}), light: i % 4 === 0, low: Math.sin(a) > 0.2};
  });
  // lash clumps off the outer third of the lash line, flicking up and out
  const clumps: Pt[][] = [];
  const outer = sample(up.slice(0, far ? 2 : 3), false, 4);
  const NC = far ? 3 : 6;
  for (let i = 0; i < NC; i++) {
    const q = outer[Math.floor((i / NC) * (outer.length - 1))];
    const len = (far ? 4 : 6) + i * 0.6;
    const dx = far ? 1 : -1;
    clumps.push([[q[0] + dx * 0.4, q[1]], [q[0] + dx * len * 0.55, q[1] - len * 0.55], [q[0] + dx * len, q[1] - len * 0.45]]);
  }
  return (
    <g>
      <defs>
        <clipPath id={`${id}-w`}><path d={white} /></clipPath>
        <radialGradient id={`${id}-ir`} cx={ix} cy={iy + ry * 0.2} r={Math.max(rx, ry) * 1.05} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={C.irisLow} />
          <stop offset="0.5" stopColor={C.irisMid} />
          <stop offset="1" stopColor={C.irisOut} />
        </radialGradient>
        <linearGradient id={`${id}-wg`} x1="0" y1={cy - ry * 0.9} x2="0" y2={cy + ry * 0.9} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={C.whiteTop} />
          <stop offset="1" stopColor={C.whiteBot} />
        </linearGradient>
      </defs>
      <path d={white} fill={`url(#${id}-wg)`} />
      <g clipPath={`url(#${id}-w)`}>
        <path d={ell(ix, iy, rx, ry)} fill={`url(#${id}-ir)`} />
        {fibres.map((f, i) => <path key={i} d={f.d} fill={f.light && f.low ? '#8FA66C' : '#0A120C'} opacity={f.light && f.low ? 0.45 : 0.5} />)}
        <path d={ell(ix, iy + ry * 0.04, rx * 0.42, ry * 0.46)} fill="#050706" />
        <path d={ell(ix, iy, rx, ry)} fill="none" stroke="#060A07" strokeWidth={1.6 * k} />
        {/* the lid and the brow put the upper eye in the dark: one hard edge */}
        <path d={lidShadow} fill={C.deep} opacity={0.66} />
        {/* the lamp's one catchlight */}
        {/* the catchlight is the lamp on the cornea: it stays where the lamp is when the pupil moves */}
        <path d={ell(cx + (glintX ?? lookX) * rangeX + rx * 0.3, iy - ry * 0.1, rx * 0.15, ry * 0.11, -20)} fill={KEY.hot} />
        {/* the waterline catches the key */}
        <path d={ink(shift(lowIn.slice(0, -1), 0, -1.1), 0.8 * k, {a: 0.3, b: 0.3})} fill={C.hi} opacity={0.3} />
      </g>
      {/* the lid crease; the lower lid's rim catching the key; the under-eye line */}
      {spec.crease && <path d={ink(shift(spec.crease, 0, 2), 1.5 * k, {a: 0.25, b: 0.4})} fill={C.line} opacity={0.9} />}
      <path d={ink(spec.lowerSpan ? lowIn.slice(spec.lowerSpan[0], spec.lowerSpan[1] + 1) : lowIn, 1.3 * k, {a: 0.35, b: 0.45})} fill={C.lineSoft} />
      {/* the lash line and its clumps */}
      <path d={ink(up, spec.lash * k * 1.2, {a: 0.04, b: 0.28, tip: 0.2, press: spec.lashPress})} fill={C.line} />
      {spec.flick && <path d={ink([up[0], [up[0][0] + (spec.flick[1][0] - up[0][0]) * 0.6, up[0][1] + (spec.flick[1][1] - up[0][1]) * 0.6]], spec.lash * k * 0.8, {a: 0.02, b: 0.9, tip: 0.02})} fill={C.line} />}
      <path d={ell(up[n - 1][0] - 1.4, up[n - 1][1] + 2.2, 1.3, 1.0)} fill="#3A1C20" opacity={0.8} />
    </g>
  );
};

/** brow hair: short tapered strokes along each brow, the top edge warm where the key finds it */
const BrowHair: React.FC<{pts: Pt[]; w: number; k: number; seed: number}> = ({pts, w, k, seed}) => {
  const rnd = prng(seed);
  const S = sample(pts, false, 12);
  const out: React.ReactNode[] = [];
  for (let i = 1; i < S.length - 1; i++) for (let r = 0; r < 2; r++) {
    const [x, y] = S[i];
    const tx = S[i + 1][0] - S[i - 1][0], ty = S[i + 1][1] - S[i - 1][1];
    const L = Math.hypot(tx, ty) || 1;
    const nx = -ty / L, ny = tx / L;
    const off = (rnd() - 0.5) * w;
    const len = w * (0.8 + rnd() * 0.9);
    const a: Pt = [x + nx * off - (tx / L) * len * 0.5, y + ny * off - (ty / L) * len * 0.5];
    const b: Pt = [x + nx * off + (tx / L) * len * 0.5 - 1.2, y + ny * off + (ty / L) * len * 0.5 - 1.6];
    const top = off < -w * 0.2;
    out.push(<path key={`${i}-${r}`} d={ink([a, b], (0.7 + rnd() * 0.6) * k, {a: 0.2, b: 0.7})} fill={top ? '#9A6A4A' : C.line} opacity={top ? 0.8 : 0.95} />);
  }
  return <>{out}</>;
};

// the drawing, in the rig's units: the planes the top key finds, and the dark it leaves
const BROW_N: Pt[] = [[62, -40], [38, -51], [10, -54], [-18, -44]];
const BROW_F: Pt[] = [[108, -45], [128, -54], [148, -52], [162, -42]];
const LIT_FOREHEAD: Pt[] = [[-80, -140], [170, -140], [168, -64], [150, -58], [128, -64], [108, -60], [86, -52], [62, -52], [36, -62], [8, -64], [-20, -56], [-50, -48], [-80, -52]];
const RIDGE_N: Pt[] = [[-10, -60], [20, -66], [46, -62], [20, -63]];
const RIDGE_F: Pt[] = [[118, -62], [138, -66], [154, -60], [138, -63]];
// the bridge is a ridge, not a board: narrow between the brows, a touch wider over the eyes, and gone into the half-tone
// before the tip (the fall gradient and a soft far edge do the rest)
const BRIDGE: Pt[] = [[95, -54], [103, -55], [110, -36], [117, -12], [121, 6], [116, 9], [110, -8], [102, -30]];
const CHEEK_N: Pt[] = [[-60, 46], [-30, 34], [6, 30], [42, 33], [70, 42], [92, 60], [98, 80], [-60, 80]];
const CHEEK_F: Pt[] = [[122, 34], [144, 28], [158, 32], [162, 50], [158, 84], [136, 80], [124, 58]];

// the ECU's view of the drawing
const VIEW = {cx: 76, cy: -4, s: 8.2};

export const Eyes: React.FC<{p: number}> = ({p}) => {
  const f = p - T.snap;
  const t = f / 29;
  // the camera slides across the held drawing (on 1s): a slow truck toward the far eye, a breath of push
  const slide = interpolate(t, [0, 1], [80, -60], {easing: Easing.bezier(0.3, 0, 0.7, 1)});
  const push = interpolate(t, [0, 1], [1, 1.02]);
  const stepped = p >= T.pupilStep;
  const lookX = stepped ? 0.76 : 0.5;
  const lookY = 0.08;
  const k = 1;
  const s = VIEW.s * push;
  const faceD = curve(FACE);
  const locks = LOCKS.map((l) => curve(l.pts));
  return (
    <>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="ecu-bg" cx="1880" cy="420" r="700" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#0F2A33" stopOpacity={0.9} />
            <stop offset="1" stopColor="#07060A" stopOpacity={0} />
          </radialGradient>
          <filter id="ecu-tex" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.09 0.12" numOctaves={2} seed={12} />
            <feColorMatrix type="matrix" values="0 0 0 0 0.10  0 0 0 0 0.03  0 0 0 0 0.03  0 0 0 0.34 -0.13" />
          </filter>
          <filter id="ecu-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2" /></filter>
          {/* a painted edge: the planes' borders soften a little, the way a brush leaves them */}
          <filter id="ecu-paint" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="0.9" /></filter>
          <linearGradient id="ecu-bridge" x1="0" y1="-55" x2="0" y2="9" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={C.base} />
            <stop offset="0.45" stopColor={C.base} stopOpacity={0.85} />
            <stop offset="1" stopColor={C.shade} stopOpacity={0.35} />
          </linearGradient>
          <clipPath id="ecu-face"><path d={faceD} /></clipPath>
          <linearGradient id="ecu-cheekfall" x1="0" y1="40" x2="0" y2="92" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={C.deep} stopOpacity={0} />
            <stop offset="1" stopColor={C.deep} stopOpacity={0.85} />
          </linearGradient>
          <linearGradient id="ecu-browfall" x1="0" y1="-140" x2="0" y2="-50" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={C.deep} stopOpacity={0.55} />
            <stop offset="1" stopColor={C.deep} stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect width={1920} height={1080} fill="#07060A" />
        <rect width={1920} height={1080} fill="url(#ecu-bg)" />
        <g transform={`translate(${960 + slide} 540) scale(${s}) translate(${-VIEW.cx} ${-VIEW.cy})`}>
          {/* the face in its own dark */}
          <path d={faceD} fill={C.deep} />
          <g clipPath="url(#ecu-face)">
            {/* lit planes: the forehead under the bangs, the brow ridges, the nose bridge, the tops of the cheeks */}
            <path d={curve(LIT_FOREHEAD)} fill={C.base} />
            <path d={curve([[-80, -140], [170, -140], [170, -60], [-80, -60]])} fill="url(#ecu-browfall)" />
            {/* the half-tone plane between the sockets and the lit planes */}
            {/* the half-tone round the lit cheek planes (the second shadow tone) */}
            <path d={curve([[-60, 30], [-30, 22], [10, 26], [48, 36], [80, 54], [100, 80], [100, 100], [-60, 100]])} fill={C.shade} opacity={0.75} />
            <path d={curve([[118, 26], [146, 20], [162, 26], [164, 90], [120, 90]])} fill={C.shade} opacity={0.7} />
            <path d={curve(CHEEK_N)} fill={C.base} filter="url(#ecu-paint)" />
            <path d={curve(CHEEK_F)} fill={C.base} filter="url(#ecu-paint)" />
            <path d={curve([[-80, 40], [170, 40], [170, 110], [-80, 110]])} fill="url(#ecu-cheekfall)" />
            {/* the nose: a half-tone plane turning out of the dark, and one thin tapered light along the ridge */}
            <path d={curve(BRIDGE)} fill="url(#ecu-bridge)" opacity={0.5} />
            <path d={ink([[99, -50], [104, -36], [110, -20], [115, -6]], 1.25, {a: 0.08, b: 0.85, tip: 0.05})} fill={C.hi} opacity={0.85} />
            <path d={curve(RIDGE_N)} fill={C.hi} />
            <path d={curve(RIDGE_F)} fill={C.hi} />
            {/* the bangs throw their shadow straight down across the forehead */}
            <g transform="translate(1 22)" fill={C.deep}>{locks.map((d, i) => <path key={i} d={d} />)}</g>
            <g clipPath="url(#ecu-face)"><rect x={-100} y={-160} width={300} height={260} filter="url(#ecu-tex)" /></g>
          </g>
          {/* the far neon's cool rim along the far cheek */}
          <path d={ink([[161, -60], [158, -30], [154, -12], [160, 18], [160, 60]], 1.5, {a: 0.25, b: 0.25})} fill={KEY.rimCool} opacity={0.85} />
          <path d={ink([[161, -60], [158, -30], [154, -12], [160, 18], [160, 60]], 5, {a: 0.25, b: 0.25})} fill={KEY.rimCool} opacity={0.12} filter="url(#ecu-soft)" />
          {/* brows */}
          <path d={ink(BROW_N, 6.8, {a: 0.05, b: 0.65, tip: 0.1, press: [1.1, 1, 0.8, 0.6]})} fill={C.line} />
          <path d={ink(BROW_F, 5.6, {a: 0.05, b: 0.55, tip: 0.1, press: [1.1, 1, 0.8]})} fill={C.line} />
          <BrowHair pts={BROW_N} w={5.6} k={0.55} seed={3} />
          <BrowHair pts={BROW_F} w={4.6} k={0.5} seed={9} />
          {/* the eyes */}
          <EyeKey id="ecu-n" spec={EYE_NEAR} lookX={lookX} lookY={lookY} lid={0.24} k={k * 0.62} glintX={0.5} />
          <EyeKey id="ecu-f" spec={EYE_FAR} lookX={lookX} lookY={lookY} lid={0.24} k={k * 0.6} far glintX={0.5} />
          {/* the bangs themselves, hanging into the top of the frame: dark, rimmed on top by the key */}
          {LOCKS.map((l, i) => (
            <g key={i}>
              <path d={locks[i]} fill={HAIR_MAS.deep} />
              <path d={ink(l.pts.slice(0, l.tip + 1), 1.8, {a: 0.5, b: 0.1, tip: 0.05})} fill="#A0704C" opacity={0.9} />
              <path d={ink(l.pts.slice(l.tip), 1.2, {a: 0.1, b: 0.5, tip: 0.05})} fill={HAIR_MAS.line} />
            </g>
          ))}
        </g>
      </svg>
      <Finish seed={40 + Math.floor(f / 2)} vignette={0.66} />
    </>
  );
};
