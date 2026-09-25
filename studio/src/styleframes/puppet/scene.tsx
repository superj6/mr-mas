import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT} from '../../shared/theme/fonts';
import {PaperDefs, Piece, Thread, RimFilter, LightCtx, cut, rect, torn, hash, jit, keys, ring, on, clamp, easeO, easeI, lerp} from './paper';
import {Mas, type MasPose, type MasMouth} from './mas';
import {Nole, UP_S, NOLE_S, type NolePose} from './nole';
import {SetDefs, Sky, Skyline, Moon, Wall, wallClip, tearPath, Floor, Desk, Chair, Monitor, Keyboard, Glass, Scraps, scraps, Foreground, MON, TEAR, WIN} from './set';

// ------------------------------------------------------------------ tiny 2D forward kinematics
type M = [number, number, number, number, number, number];
const mul = (a: M, b: M): M => [a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3], a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5]];
const T = (x: number, y: number): M => [1, 0, 0, 1, x, y];
const R = (deg: number): M => {
  const r = (deg * Math.PI) / 180;
  return [Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0];
};
const ap = (m: M, x: number, y: number) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

// ------------------------------------------------------------------ timeline
export const MAS_HIP = {x: 985, y: 788};
const NOLE_Y = 603;

interface State {
  cam: {cx: number; cy: number; z: number};
  mas: MasPose;
  nole: NolePose | null;
  nx: number;
  ny: number;
  noleClip: boolean;
  tearK: number;
  frameL: number;
  frameR: number;
  moon: number;
  hall: number;
  chars: number;
  scrapT: number;
  slipN: {y: number; a: number; on: boolean};
  slipM: {y: number; a: number; on: boolean};
  jolt: {mx: number; my: number; mr: number; wx: number; wy: number; sx: number; fx: number; fy: number};
  flick: number;
  monA: number;
  glint: number;
}

export const timeline = (F: number): State => {
  const ones = (F >= 24 && F < 36) || (F >= 108 && F < 116);
  const e = ones ? F : on(F, 2); // scene exposure (twos, ones for impacts)
  const mE = on(F, 3); // Mas lives on threes
  // ---------- camera (on twos; shake on ones)
  const ce = e;
  const z = ce < 84 ? keys(ce, [[0, 1.0], [24, 1.035], [40, 1.07], [56, 1.13], [84, 1.15]]) : keys(ce, [[84, 1.15], [104, 1.3]]);
  const cx = keys(ce, [[0, 960], [24, 972], [44, 1080], [84, 1080], [104, 1010]]);
  const cy = keys(ce, [[0, 540], [24, 534], [44, 515], [56, 505], [84, 500], [104, 452]]);
  const shx = ring(F, 25, 16, 1.9, 0.28) + ring(F, 28, 8, 2.4, 0.3);
  const shy = ring(F, 25, -11, 2.3, 0.28) + ring(F, 28, 6, 2.0, 0.3);
  // ---------- MAS
  const typing = F < 84;
  const tapN = typing && hash(mE * 3 + 1) > 0.45;
  const tapF = typing && hash(mE * 3 + 2) > 0.55;
  const read = Math.floor(mE / 12) % 3;
  let mas: MasPose = {
    head: 'profile',
    headA: Math.sin(mE * 0.35) * 0.5,
    torsoA: -6 + Math.sin(mE * 0.28) * 0.35,
    lookX: -0.7,
    lookY: [0.05, 0.3, 0.18][read],
    nSh: 24,
    nEl: 70 + (tapN ? 3 : 0),
    nWr: -20 + (tapN ? -10 : 0),
    fSh: 20,
    fEl: 74 + (tapF ? 3 : 0),
    fWr: -16 + (tapF ? -10 : 0),
    exp: mE,
    cowlick: ring(F, 108, -14, 0.9, 0.18),
  };
  const masJolt = {torso: ring(F, 108, 3.2, 1.1, 0.22), head: ring(F, 109, -5, 1.0, 0.2)};
  if (!typing) {
    mas = {...mas, nWr: -27, fWr: -24, nEl: 72, fEl: 76};
    const fe = on(F, 2);
    if (F < 90) {
      mas.headA = F < 87 ? 0 : 5;
      mas.lookX = F < 87 ? -0.7 : -0.2;
    } else {
      mas.head = 'front';
      mas.headA = keys(mE, [[90, -3], [96, 0]]) + masJolt.head;
      mas.torsoA = (mas.torsoA ?? -6) + masJolt.torso;
      mas.lookX = F < 93 ? -0.3 : 0.9;
      mas.lookY = 0.12;
      mas.lid = fe === 94 ? 0.5 : fe === 96 ? 1 : fe === 98 ? 0.5 : 0;
      const mouths: [number, MasMouth][] = [[0, 'rest'], [99, 's'], [101, 'u'], [103, 'p'], [104, 'er'], [106, 'smile']];
      let m: MasMouth = 'rest';
      for (const [t, v] of mouths) if (F >= t) m = v;
      mas.mouth = m;
    }
  }
  // ---------- NOLE
  let nole: NolePose | null = null;
  let nx = 0, ny = NOLE_Y, clipN = false;
  if (F >= 24) {
    const k = F; // entrance on ones
    const E: [number, number, number, number, number, number, number, number, number][] = [
      // f, x, dy, torso, pSh, pEl, fTh, bTh, quiffImpulse
      [24, 1700, 6, -22, 92, 4, 26, -18, 0],
      [25, 1668, 4, -24, 94, 2, 30, -22, 0],
      [26, 1622, 2, -24, 96, 0, 36, -26, 0],
      [27, 1570, 0, -20, 110, 6, 40, -30, 0],
      [28, 1522, -4, -14, 118, 14, 40, -32, 0],
      [29, 1482, 4, -6, 124, 30, 36, -30, 0],
      [30, 1452, 14, 2, 128, 40, 30, -26, 0],
      [31, 1436, 18, 6, 132, 46, 26, -22, 0],
      [32, 1430, 12, 4, 131, 44, 22, -18, 0],
      [33, 1426, 6, 2, 130, 42, 19, -15, 0],
      [34, 1425, 2, 0, 130, 42, 17, -13, 0],
    ];
    let row = E[E.length - 1];
    for (const r of E) if (k >= r[0]) row = r;
    nx = row[1];
    ny = NOLE_Y + row[2];
    clipN = F < 28;
    const w = e;
    // after entrance: present phone high, then lean in and jab
    const lean = keys(w, [[34, row[3]], [46, 0], [56, -19], [84, -21], [100, -24], [108, -24]]);
    const talk = w >= 52 && w < 82;
    // jabs synced to CAME (57), UP (62), NAME (73)
    const jab = (t0: number) => (w >= t0 && w < t0 + 6 ? [1, 0.55, 0.2][Math.min(2, Math.floor((w - t0) / 2))] : 0);
    const jb = Math.max(jab(56), jab(62), jab(72));
    const armUp = keys(w, [[34, row[4]], [44, 112], [52, 78], [84, 74]]);
    const el = keys(w, [[34, row[5]], [44, 30], [52, 18]]) - jb * 22;
    // jaw per syllable: I . CAME . UP . WITH . THE . NAME !
    const J: [number, number][] = [[52, 0.7], [54, 0.5], [56, 0.1], [57, 0.85], [59, 0.6], [60, 0.05], [61, 0.7], [63, 0.05], [64, 0.45], [66, 0.2], [67, 0.5], [69, 0.1], [71, 0.05], [72, 1.0], [76, 0.85], [78, 0.3], [80, 0.05]];
    let jaw = 0;
    if (talk) for (const [t, v] of J) if (w >= t) jaw = v;
    if (w >= 84 && w < 108) jaw = 0.18; // expectant grin
    if (F >= 108) jaw = F >= 110 ? 0.75 : 0.3; // jaw drops on the jolt
    nx = w >= 46 ? keys(w, [[46, 1425], [56, 1380], [84, 1376], [100, 1368]]) : nx;
    nole = {
      torsoA: lean + (w >= 34 ? 0 : 0) + ring(F, 108, 5, 1.2, 0.25),
      headA: keys(w, [[34, 0], [46, 4], [56, 2], [84, 2], [100, 0]]) + (jb ? -2 : 0) + ring(F, 109, -7, 1.0, 0.2),
      jaw,
      lookX: -0.8,
      lookY: w > 50 ? 0.5 : 0.1,
      brow: w >= 84 && F < 108 ? 1 : w >= 52 ? 0.4 : 0,
      pSh: armUp,
      pEl: el,
      pWr: keys(w, [[34, 0], [52, -18]]) - jb * 6,
      bSh: keys(w, [[34, -30], [46, -34], [56, -40]]),
      bEl: keys(w, [[34, -60], [46, 96], [56, 100]]),
      bWr: keys(w, [[34, -20], [46, 20]]),
      fTh: keys(w, [[34, row[6]], [46, 14], [56, 20]]),
      fKn: keys(w, [[34, row[6] > 30 ? -8 : 0], [46, 0], [56, -4]]),
      bTh: keys(w, [[34, row[7]], [46, -12], [56, -8]]),
      bKn: keys(w, [[34, 6], [46, 4], [56, 10]]),
      quiff: ring(F, 29, -18, 0.8, 0.16) + ring(F, 108, 14, 0.9, 0.16),
      exp: w,
      glow: 1,
    };
  }
  // ---------- set reactions
  const tearK = F < 24 ? 0 : [0.12, 0.36, 0.66, 0.9, 1][Math.min(4, F - 24)];
  const frameR = F < 26 ? 0 : ring(F, 26, 18, 0.5, 0.09) + 8 * clamp((F - 26) / 6) + ring(F, 108, 12, 0.8, 0.14);
  const frameL = ring(F, 28, 3, 0.55, 0.1) + ring(F, 108, -12, 0.8, 0.14);
  const moon = ring(on(F, 2), 28, 4, 0.35, 0.05) + ring(F, 108, 10, 0.6, 0.08);
  const hall = F < 24 ? 0 : clamp((F - 23) / 5) * (0.92 + 0.08 * hash(on(F, 2) * 13));
  const chars = 34 + Math.floor(Math.min(F, 84) / 3) * 2;
  const slipN = {
    on: F >= 52,
    y: F < 52 ? -400 : keys(e, [[52, -150], [56, 0]], easeI) + ring(e, 56, -16, 1.3, 0.3),
    a: ring(e, 56, 3, 0.7, 0.1) + ring(F, 108, 11, 0.9, 0.12),
  };
  const slipM = {on: F >= 99, y: F < 99 ? -300 : keys(mE, [[99, -60], [105, 0]], easeO), a: ring(F, 108, -8, 0.9, 0.12)};
  const J = (amp: number, ph: number) => ring(F, 108, amp, 1.5 + ph, 0.32);
  const jolt = {mx: J(34, 0), my: J(-20, 0.4), mr: J(1.5, 0.2), wx: J(22, 0.15), wy: J(-12, 0.5), sx: J(9, 0.1), fx: J(46, 0.05), fy: J(-22, 0.3)};
  const flick = hash(e * 7 + 1);
  return {
    cam: {cx: cx + (ones && F < 40 ? shx : 0), cy: cy + (ones && F < 40 ? shy : 0), z},
    mas,
    nole,
    nx,
    ny,
    noleClip: clipN,
    tearK,
    frameL,
    frameR,
    moon,
    hall,
    chars,
    scrapT: e,
    slipN,
    slipM,
    jolt,
    flick,
    monA: ring(F, 108, -4.5, 1.3, 0.2) + ring(F, 25, 1.2, 1.6, 0.3),
    glint: F >= 110 && F < 118 ? [0.5, 1, 1, 0.8, 0.6, 0.4, 0.25, 0.1][F - 110] : 0,
  };
};

/** World position of Nole's phone screen (for its bloom). */
const phonePos = (nx: number, ny: number, p: NolePose) => {
  let m = mul(T(nx, ny), [NOLE_S, 0, 0, NOLE_S, 0, 0]);
  m = mul(m, R(p.torsoA ?? 0));
  m = mul(m, [UP_S, 0, 0, UP_S, 0, 0]);
  m = mul(m, T(-4, -222));
  m = mul(m, R(p.pSh ?? 0));
  m = mul(m, T(0, 112));
  m = mul(m, R(p.pEl ?? 0));
  m = mul(m, T(0, 100));
  m = mul(m, R(p.pWr ?? 0));
  m = mul(m, T(0, 6));
  m = mul(m, R(-8));
  return ap(m, 0, 30);
};

// ------------------------------------------------------------------ layers
interface Cam {
  cx: number;
  cy: number;
  z: number;
}
const Layer: React.FC<{cam: Cam; p: number; blur?: number; jx?: number; jy?: number; shadow?: string; blend?: React.CSSProperties['mixBlendMode']; op?: number; children: React.ReactNode}> = ({cam, p, blur = 0, jx = 0, jy = 0, shadow, blend, op, children}) => {
  const zl = 1 + (cam.z - 1) * p;
  const cxl = 960 + (cam.cx - 960) * p;
  const cyl = 540 + (cam.cy - 540) * p;
  const filt = [blur > 0 ? `blur(${blur}px)` : '', shadow ?? ''].join(' ').trim();
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 1920,
        height: 1080,
        transformOrigin: '0 0',
        transform: `translate(${960 - cxl * zl + jx}px, ${540 - cyl * zl + jy}px) scale(${zl})`,
        filter: filt || undefined,
        mixBlendMode: blend,
        opacity: op,
      }}
    >
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{overflow: 'visible', position: 'absolute'}}>
        {children}
      </svg>
    </div>
  );
};

// ------------------------------------------------------------------ dialogue slips (printed card on threads)
const Slip: React.FC<{x: number; y: number; w: number; h: number; a: number; text: string; size: number; weight: number; font: string; paper: string; ink: string; seed: number; tail: [number, number]; italic?: boolean; track?: number}> = ({
  x, y, w, h, a, text, size, weight, font, paper, ink, seed, tail, italic, track = 0,
}) => {
  const edge = (x0: number, y0: number, x1: number, y1: number, n: number, s: number) => {
    const pts: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      pts.push([lerp(x0, x1, t) + (hash(s + i) - 0.5) * 5, lerp(y0, y1, t) + (hash(s + i + 50) - 0.5) * 2]);
    }
    return pts;
  };
  const top = edge(-w / 2, 0, w / 2, 0, 1, seed);
  const right = edge(w / 2, 0, w / 2, h, 6, seed + 10).map(([px, py]) => [px + (hash(seed + py) - 0.5) * 7, py] as [number, number]);
  const bot = edge(w / 2, h, -w / 2, h, 1, seed + 20);
  const left = edge(-w / 2, h, -w / 2, 0, 6, seed + 30).map(([px, py]) => [px + (hash(seed + py + 3) - 0.5) * 7, py] as [number, number]);
  const outline = [...top, ...right.slice(1), ...bot.slice(1), ...left.slice(1, -1)].map((p) => [p[0], p[1], 1] as [number, number, number]);
  const d = cut(outline, {seed, jit: 0.3});
  const [tx, ty] = tail;
  return (
    <g transform={`translate(${x} ${y})`}>
      <Thread d={`M ${-w * 0.38} ${-y - 60} L ${-w * 0.38} 4`} w={1.1} op={0.75} />
      <Thread d={`M ${w * 0.38} ${-y - 60} L ${w * 0.38} 4`} w={1.1} op={0.75} />
      <g transform={`rotate(${a} 0 ${-y - 60})`}>
        <Piece d={cut([[tx - 12, h - 4, 1], [tx + 12, h - 4, 1], [tx + (tx > 0 ? 34 : -6), h + ty, 1]], {seed: seed + 5, jit: 0.3})} fill={paper} z={2} tex="card" edge={0.25} />
        <Piece d={d} fill={paper} z={2.6} tex="card" edge={0.3} shade="url(#pz-slipshade)" />
        {text.split('|').map((ln, i, arr) => (
          <text
            key={i}
            x={0}
            y={h / 2 + size * 0.36 + (i - (arr.length - 1) / 2) * size * 1.08}
            textAnchor="middle"
            fontFamily={font}
            fontWeight={weight}
            fontStyle={italic ? 'italic' : 'normal'}
            fontSize={size}
            letterSpacing={track}
            fill={ink}
            opacity={0.9}
          >
            {ln}
          </text>
        ))}
        {/* masking tape where the thread meets the card */}
        {[-w * 0.38, w * 0.38].map((tx, i) => (
          <rect key={i} x={tx - 11} y={-5} width={22} height={13} fill="#e8dcb0" opacity={0.62} transform={`rotate(${i ? 6 : -5} ${tx} 1)`} />
        ))}
        <circle cx={-w * 0.38} cy={6} r={2} fill="#6d5a3a" opacity={0.7} />
        <circle cx={w * 0.38} cy={6} r={2} fill="#6d5a3a" opacity={0.7} />
      </g>
    </g>
  );
};

// ------------------------------------------------------------------ the scene
export interface SceneProps {
  frame?: number;
  cam?: Cam;
  /** hide dialogue slips (for closeups) */
  noSlips?: boolean;
}

export const PuppetScene: React.FC<SceneProps> = ({frame, cam: camOverride, noSlips}) => {
  const cur = useCurrentFrame();
  const F = frame ?? cur;
  const S = timeline(F);
  const cam = camOverride ?? S.cam;
  const j = S.jolt;
  const light = {dx: 3.8, dy: 1.4, op: 0.66, form: 1};
  const masX = MAS_HIP.x, masY = MAS_HIP.y;
  const tearClip = S.tearK > 0 ? tearPath(S.tearK) : '';
  const ph = S.nole ? phonePos(S.nx, S.ny, S.nole) : [0, 0];
  const scrapList = scraps(S.scrapT, 26);
  const nightOp = 0.97 + (S.flick - 0.5) * 0.04;
  const U = `-${F}${camOverride ? 'c' : ''}`;

  const masNode = (
    <g transform={`translate(${masX} ${masY})`}>
      <Mas p={S.mas} />
    </g>
  );
  const noleNode = S.nole ? (
    <g transform={`translate(${S.nx} ${S.ny})`}>
      <Nole p={S.nole} />
    </g>
  ) : null;

  return (
    <AbsoluteFill style={{background: '#04060c', overflow: 'hidden'}}>
      <PaperDefs />
      <SetDefs />
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <defs>
          <RimFilter id={`pz-rim-mas${U}`} dx={-1.7} dy={0.2} color="#aef7ff" op={0.7} blur={0.3} />
          <RimFilter id={`pz-rim-nole${U}`} dx={-1.6} dy={0.3} color="#aef7ff" op={0.5} blur={0.3} />
          <RimFilter id={`pz-rim-warm${U}`} dx={2} dy={-0.4} color="#ffb766" op={0.8 * S.hall} blur={0.35} />
          <clipPath id={`pz-wallclip${U}`}>
            <path d={wallClip(S.tearK)} clipRule="evenodd" />
          </clipPath>
          <clipPath id={`pz-tearclip${U}`}>
            <path d={tearClip || 'M0 0'} />
          </clipPath>
          <radialGradient id="pz-night" gradientUnits="userSpaceOnUse" cx={700} cy={560} r={1180} gradientTransform="translate(700 560) scale(1 0.78) translate(-700 -560)">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.1" stopColor="#eef8ff" />
            <stop offset="0.26" stopColor="#8d9fc2" />
            <stop offset="0.5" stopColor="#414d72" />
            <stop offset="1" stopColor="#1a2140" />
          </radialGradient>
          <linearGradient id="pz-behind" gradientUnits="userSpaceOnUse" x1={560} y1={0} x2={330} y2={0}>
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#30385a" />
          </linearGradient>
          <radialGradient id="pz-cyan" gradientUnits="userSpaceOnUse" cx={650} cy={560} r={620}>
            <stop offset="0" stopColor="#5eeaff" stopOpacity={0.75} />
            <stop offset="0.3" stopColor="#2ec6ea" stopOpacity={0.35} />
            <stop offset="0.7" stopColor="#1580a8" stopOpacity={0.1} />
            <stop offset="1" stopColor="#0a3050" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="pz-warm" gradientUnits="userSpaceOnUse" cx={TEAR.cx} cy={TEAR.cy} r={720}>
            <stop offset="0" stopColor="#ffb866" stopOpacity={0.85} />
            <stop offset="0.25" stopColor="#f08a3a" stopOpacity={0.4} />
            <stop offset="0.6" stopColor="#a0461c" stopOpacity={0.12} />
            <stop offset="1" stopColor="#40180a" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="pz-Lmon" gradientUnits="userSpaceOnUse" cx={620} cy={565} r={1100} gradientTransform="translate(620 565) scale(1 0.8) translate(-620 -565)">
            <stop offset="0" stopColor="#f4ffff" />
            <stop offset="0.05" stopColor="#d2fbff" />
            <stop offset="0.14" stopColor="#8fe2f2" />
            <stop offset="0.3" stopColor="#4aa2c0" />
            <stop offset="0.5" stopColor="#1e5a76" />
            <stop offset="0.76" stopColor="#0a2234" />
            <stop offset="1" stopColor="#000000" />
          </radialGradient>
          <radialGradient id="pz-floorspill" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#3f8aa0" />
            <stop offset="0.6" stopColor="#173848" />
            <stop offset="1" stopColor="#000000" />
          </radialGradient>
          <radialGradient id="pz-Lmoon" gradientUnits="userSpaceOnUse" cx={WIN.cx} cy={WIN.cy} r={440}>
            <stop offset="0" stopColor="#56668f" />
            <stop offset="0.5" stopColor="#262f4d" />
            <stop offset="1" stopColor="#000000" />
          </radialGradient>
          <radialGradient id="pz-Lhall" gradientUnits="userSpaceOnUse" cx={TEAR.cx} cy={TEAR.cy} r={820} gradientTransform={`translate(${TEAR.cx} ${TEAR.cy}) scale(1 0.9) translate(${-TEAR.cx} ${-TEAR.cy})`}>
            <stop offset="0" stopColor="#fff2d6" />
            <stop offset="0.1" stopColor="#ffc47c" />
            <stop offset="0.3" stopColor="#c46c2c" />
            <stop offset="0.6" stopColor="#4a2008" />
            <stop offset="1" stopColor="#000000" />
          </radialGradient>
          <radialGradient id="pz-Lphone" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#d6fbff" />
            <stop offset="0.35" stopColor="#4c8a9a" />
            <stop offset="1" stopColor="#000000" />
          </radialGradient>
          <linearGradient id="pz-slipshade" x1="0" y1="0" x2="0.25" y2="1">
            <stop offset="0" stopColor="#bff6ff" stopOpacity={0.16} />
            <stop offset="0.45" stopColor="#000" stopOpacity={0} />
            <stop offset="1" stopColor="#06101c" stopOpacity={0.42} />
          </linearGradient>
          <radialGradient id="pz-bloom" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffffff" stopOpacity={0.9} />
            <stop offset="0.3" stopColor="#bdf6ff" stopOpacity={0.35} />
            <stop offset="1" stopColor="#5ee0ff" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="pz-bloomW" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#fff2d0" stopOpacity={0.9} />
            <stop offset="0.35" stopColor="#ffbf70" stopOpacity={0.3} />
            <stop offset="1" stopColor="#ff9040" stopOpacity={0} />
          </radialGradient>
        </defs>
      </svg>

      <LightCtx.Provider value={light}>
        {/* SKY (far) */}
        <Layer cam={cam} p={0.45} blur={2.6} jx={j.sx} jy={j.sx * 0.4}>
          <Sky f={F} swing={0} />
          <Skyline />
        </Layer>
        {/* MOON on its thread */}
        <Layer cam={cam} p={0.6} blur={1.6} jx={j.sx}>
          <Moon swing={S.moon} />
        </Layer>
        {/* WALL */}
        <Layer cam={cam} p={0.86} blur={0.9} jx={j.wx} jy={j.wy} shadow="drop-shadow(10px 12px 10px rgba(0,0,0,0.55))">
          <Wall u={U} f={F} tearK={S.tearK} frameL={S.frameL} frameR={S.frameR} hall={S.hall} />
          {/* Mas's shadow thrown on the wall by the monitor */}
          <g clipPath={`url(#pz-wallclip${U})`} opacity={0.6}>
            <g filter="url(#pz-sil)" transform={`translate(${MON.x} ${MON.y}) scale(1.36) translate(${-MON.x} ${-MON.y})`}>
              <Chair />
              {masNode}
              <Glass />
            </g>
          </g>
        </Layer>
        {/* MID: the stage */}
        <Layer cam={cam} p={1} shadow="drop-shadow(8px 10px 9px rgba(0,0,0,0.5))">
          <g transform={`translate(${j.mx} ${j.my}) rotate(${j.mr} 960 960)`}>
            <Floor />
            <g transform={`rotate(${ring(F, 108, 3.5, 1.2, 0.22)} 1005 962)`}>
              <Chair />
            </g>
            <g transform={`rotate(${ring(F, 108, -1.6, 1.4, 0.24)} 700 962)`}>
              <Desk />
            </g>
            <g transform={`rotate(${S.monA} 585 712)`}>
              <Monitor f={F} chars={S.chars} />
            </g>
            <g transform={`translate(0 ${-Math.abs(ring(F, 108, 9, 1.3, 0.3))})`}>
              <Keyboard f={F} />
            </g>
            <g filter={`url(#pz-rim-mas${U})`}>{masNode}</g>
            {noleNode ? (
              S.noleClip ? (
                <g clipPath={`url(#pz-tearclip${U})`}>
                  <g filter="url(#pz-sil)" opacity={0.92}>{noleNode}</g>
                </g>
              ) : (
                <g filter={`url(#pz-rim-warm${U})`}>
                  <g filter={`url(#pz-rim-nole${U})`}>{noleNode}</g>
                </g>
              )
            ) : null}
            <Scraps list={scrapList} />
          </g>
          {/* the water does not move */}
          <Glass />
          {S.glint > 0 ? (
            <g transform={`translate(733 663) scale(${0.8 + S.glint * 0.9}) rotate(${F * 5})`} opacity={S.glint}>
              <circle r={14} fill="#dffcff" opacity={0.35} />
              <path d="M 0 -18 L 2.6 -2.6 L 18 0 L 2.6 2.6 L 0 18 L -2.6 2.6 L -18 0 L -2.6 -2.6 Z" fill="#f4feff" />
            </g>
          ) : null}
        </Layer>

        {/* ---- light map: ambient moon-navy + monitor cone + moon spill + hallway + phone (composited with screen), multiplied over the set ---- */}
        <Layer cam={cam} p={1} blend="multiply" op={nightOp}>
          <rect x={-300} y={-300} width={2520} height={1680} fill="#1a2444" />
          <rect x={-300} y={-300} width={2520} height={1680} fill="url(#pz-Lmon)" style={{mixBlendMode: 'screen'}} />
          <rect x={-300} y={-300} width={2520} height={1680} fill="url(#pz-behind)" style={{mixBlendMode: 'multiply'}} />
          <rect x={-300} y={-300} width={2520} height={1680} fill="url(#pz-Lmoon)" style={{mixBlendMode: 'screen'}} />
          <ellipse cx={780} cy={975} rx={640} ry={120} fill="url(#pz-floorspill)" style={{mixBlendMode: 'screen'}} />
          {S.hall > 0 ? <rect x={-300} y={-300} width={2520} height={1680} fill="url(#pz-Lhall)" opacity={S.hall} style={{mixBlendMode: 'screen'}} /> : null}
          {S.nole && !S.noleClip ? <circle cx={ph[0]} cy={ph[1]} r={170} fill="url(#pz-Lphone)" style={{mixBlendMode: 'screen'}} /> : null}
        </Layer>
        {/* emissive bloom (screen) */}
        <Layer cam={cam} p={1} blend="screen">
          <ellipse cx={596} cy={565} rx={95} ry={125} fill="url(#pz-bloom)" opacity={0.5} />
          <ellipse cx={760} cy={600} rx={420} ry={260} fill="url(#pz-bloom)" opacity={0.07} />
          {S.nole ? <circle cx={ph[0]} cy={ph[1]} r={40} fill="url(#pz-bloom)" opacity={S.noleClip ? 0.25 : 0.45} /> : null}
          {S.hall > 0 ? <ellipse cx={TEAR.cx} cy={TEAR.cy - 60} rx={120 * S.tearK} ry={250 * S.tearK} fill="url(#pz-bloomW)" opacity={0.55 * S.hall} /> : null}
          <circle cx={872} cy={290} r={95} fill="url(#pz-bloomW)" opacity={0.1} />
        </Layer>

        {/* dialogue slips: printed card on threads, lit by their own soft practical so type stays readable */}
        <Layer cam={cam} p={1.02} jx={j.mx * 1.1} jy={j.my * 1.1} shadow="drop-shadow(6px 9px 7px rgba(0,0,0,0.55))">
            {!noSlips && S.slipM.on ? (
              <Slip x={850} y={372 + S.slipM.y} w={132} h={50} a={S.slipM.a} text="super." size={30} weight={400} font={FONT.bass} paper="#ddd6c6" ink="#1f2226" seed={2101} tail={[36, 26]} />
            ) : null}
            {!noSlips && S.slipN.on ? (
              <Slip x={872} y={40 + S.slipN.y} w={452} h={124} a={S.slipN.a} text="I CAME UP|WITH THE NAME!" size={44} weight={900} font={FONT.bass} paper="#dcb94c" ink="#1a1612" seed={2001} tail={[196, 58]} track={1.5} />
            ) : null}
        </Layer>

        {/* FOREGROUND: out-of-focus leaves and books */}
        <Layer cam={cam} p={1.45} blur={10} jx={j.fx} jy={j.fy}>
          <Foreground />
        </Layer>
      </LightCtx.Provider>

      {/* lens: vignette + exposure flicker */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 48%, transparent 52%, rgba(0,0,0,0.6) 118%)', pointerEvents: 'none'}} />
      <AbsoluteFill style={{background: '#000', opacity: 0.02 + S.flick * 0.035, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
