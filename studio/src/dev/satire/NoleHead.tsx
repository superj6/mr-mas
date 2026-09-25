// SATIRE structure — NOLE latex puppet head. Caricature lives in two things only: the enormous square
// jaw/chin and the looming scale. Swept-back gelled hair is the prop-level signifier. Same projected
// height-field construction as MasHead (see there for the conventions).
import React from 'react';
import {blob, clamp, cw, ellPts, ellZ, gauss, mix, rot3, sb, smooth, type XY} from './lib';
import {Bumps, Creases, GlassEye, Rim, Soft, bl, norm, type Bump, type CreaseDef} from './kit';
import type {PuppetPose} from './MasHead';

export const NOLE_REST: PuppetPose = {yaw: 0, pitch: 0, jaw: 0, smile: 0.5, lid: 0.36, gazeX: 0, gazeY: 0, brow: 0, key: 1, rim: 0};

const SKIN = {
  hi: '#F2C2A4',
  base: '#DC9C7E',
  mid: '#BC7862',
  low: '#8C4B3F',
  deep: '#4A2220',
  sss: '#CC4236',
  blush: '#D65C54',
  lip: '#B2615A',
  lipDark: '#6E302E',
};
const HAIR = {base: '#2C2321', dark: '#0C0909', hi: '#5E4E48', sheen: '#DDF8FA'};
const KEY = '#C4F5F8';
const WARM = '#FFB36A';

export const NoleHead: React.FC<{p: PuppetPose; id?: string}> = ({p, id = 'nole'}) => {
  const view = {yaw: p.yaw, pitch: p.pitch};
  const L = norm(p.light ?? [-0.8, -0.45]);
  const JAW = 58;
  const depth = (x: number, y: number) => {
    let z = Math.max(ellZ(x, y, 0, -20, 188, 292, 158), ellZ(x, y, 0, 150, 186, 142, 122));
    z += 58 * gauss(x, y, 0, 18, 15, 42) + 18 * gauss(x, y, 0, 64, 18, 14);
    z += 14 * (gauss(x, y, 106, 12, 42, 28) + gauss(x, y, -106, 12, 42, 28));
    z += 30 * gauss(x, y, 0, 236, 70, 32);
    z += 12 * (gauss(x, y, 150, 170, 40, 50) + gauss(x, y, -150, 170, 40, 50));
    z += 16 * (gauss(x, y, 66, -80, 54, 16) + gauss(x, y, -66, -80, 54, 16));
    z -= 10 * (gauss(x, y, 64, -42, 36, 24) + gauss(x, y, -64, -42, 36, 24));
    return z;
  };
  const s = p.smile;
  const cornerX = 66 + s * 6;
  type W = 'U' | 'L' | 'D';
  const jawW = (x: number, y: number, w: W) => {
    if (w === 'U') return 0;
    const fx = 1 - smooth((Math.abs(x) - 110) / 90);
    if (w === 'L') return Math.pow(Math.max(0, 1 - (x / (cornerX + 4)) ** 2), 0.7);
    return smooth((y - 132) / 18) * fx;
  };
  const Pw = (x: number, y: number, dz = 0, w: W = 'D'): XY => {
    const z = depth(x, y) + dz;
    const k = jawW(x, y, w) * p.jaw;
    return rot3(x, y + k * JAW, z - k * 22, view);
  };
  const P = (x: number, y: number) => Pw(x, y);
  const PU = (x: number, y: number) => Pw(x, y, 0, 'U');
  const PL = (x: number, y: number) => Pw(x, y, 0, 'L');
  const Pz = (x: number, y: number, dz: number) => Pw(x, y, dz, 'U');
  const F = (x: number, y: number): XY => [x + Math.sin(p.yaw) * 8, y - Math.sin(p.pitch) * 8];
  const keyA = 0.2 + 0.8 * p.key;
  const clip = `${id}-clip`;

  // ---------- silhouette: modest cranium, monumental jaw ----------
  const skullPts: XY[] = [
    [0, -252], [80, -244], [128, -208], [150, -146], [156, -76], [158, 0], [160, 60], [150, 110], [110, 140], [0, 150],
    [-110, 140], [-150, 110], [-160, 60], [-158, 0], [-156, -76], [-150, -146], [-128, -208], [-80, -244],
  ];
  const skull = blob(cw(skullPts.map(([x, y]) => F(x, y))));
  const facePts: XY[] = [
    [158, -10], [166, 60], [178, 126], [188, 172], [188, 202], [172, 228], [130, 254], [86, 269], [44, 276], [0, 278],
    [-44, 276], [-86, 269], [-130, 254], [-172, 228], [-188, 202], [-188, 172], [-178, 126], [-166, 60], [-158, -10], [-80, -40], [0, -46], [80, -40],
  ];
  const face = blob(cw(facePts.map(([x, y]) => P(x, y))));

  // ---------- mouth: wide, confident, a showman's smirk ----------
  const sm = s * 8;
  const cy0 = 143 - s * 6;
  const upperTop: XY[] = [[-cornerX, cy0], [-40, 132 - s * 2], [-12, 127], [0, 130], [12, 127], [40, 132 - s * 3], [cornerX, cy0 - sm * 0.6]];
  const mouthLine: XY[] = [[-cornerX, cy0], [-36, 145 - s * 3], [0, 147], [36, 145 - s * 4], [cornerX, cy0 - sm * 0.6]];
  const lowerBot: XY[] = [[cornerX, cy0 - sm * 0.6], [42, 157], [16, 164], [0, 165], [-16, 164], [-42, 157], [-cornerX, cy0]];
  const upperLip = blob([...upperTop.map(([x, y]) => PU(x, y)), ...[...mouthLine].reverse().slice(1, -1).map(([x, y]) => PU(x, y))]);
  const cavity = blob([...mouthLine.map(([x, y]) => PU(x, y)), ...[...mouthLine].reverse().slice(1, -1).map(([x, y]) => PL(x, y + 0.5))]);
  const lowerLip = blob([...mouthLine.map(([x, y]) => PL(x, y + 0.5)), ...lowerBot.slice(1, -1).map(([x, y]) => P(x, y))]);
  const seam = blob(mouthLine.map(([x, y]) => PU(x, y)), false);

  // ---------- eyes: smaller, hooded, intense ----------
  const eye = (side: 1 | -1) => {
    const up: XY[] = [[28, -40], [40, -58], [64, -66], [90, -62], [106, -46]];
    const lo: XY[] = [[28, -40], [42, -28], [64, -22], [88, -28], [106, -46]];
    return {
      id: `${id}-eye${side > 0 ? 'R' : 'L'}`,
      c: [64 * side, -42] as XY,
      r: 30,
      upper: up.map(([x, y]) => [x * side, y] as XY),
      lower: lo.map(([x, y]) => [x * side, y] as XY),
      lid: clamp(p.lid + Math.max(0, -p.gazeY) * 0.4 - Math.max(0, p.gazeY) * 0.3 - Math.max(0, p.brow) * 0.15),
      lowerLid: s * 0.9,
      gazeX: p.gazeX,
      gazeY: p.gazeY,
      headYaw: p.yaw,
      headPitch: p.pitch,
      iris: '#7494B0',
      irisDark: '#2A3C50',
      irisR: 17,
      skinLid: mix(SKIN.mid, SKIN.low, 0.35),
      skinLidDark: mix(SKIN.low, SKIN.deep, 0.4),
      skinLidHi: mix(SKIN.base, SKIN.mid, 0.4),
      lash: '#1A0E0C',
      keyRefl: [L[0] * 0.8, L[1] * 0.8] as XY,
      keyColor: KEY,
      keyOp: 0.25 + 0.7 * p.key,
      warmRefl: [0.75, -0.2] as XY,
      warmOp: p.rim * 0.9,
      zc: -18,
      lightDir: L,
    };
  };

  // ---------- sculpt ----------
  const lift = s * 8;
  const bumps: Bump[] = [
    {c: [-56, -160], r: [70, 40], k: 0.6, spec: 0.4},
    {c: [56, -160], r: [70, 40], k: 0.5, spec: 0.2},
    {c: [-68, -84], r: [56, 17], k: 1.1, spec: 0.35, P: PU},
    {c: [68, -84], r: [56, 17], k: 1.1, spec: 0.2, P: PU},
    {c: [-108, 16 - lift * 0.5], r: [52, 26], k: 0.85, spec: 0.45},
    {c: [108, 16 - lift * 0.5], r: [52, 26], k: 0.85, spec: 0.25},
    {c: [-122, 96], r: [30, 42], k: -0.7},
    {c: [122, 96], r: [30, 42], k: -0.8},
    {c: [0, 62], r: [24, 18], k: 1.1, spec: 0.9, P: PU},
    {c: [-28, 74], r: [13, 12], k: 0.9, P: PU},
    {c: [28, 74], r: [13, 12], k: 0.9, P: PU},
    {c: [-32, 236], r: [38, 26], k: 0.6, spec: 0.35},
    {c: [32, 236], r: [38, 26], k: 0.6, spec: 0.15},
    {c: [-64, -8], r: [36, 11], k: 0.5, P: PU},
    {c: [64, -8], r: [36, 11], k: 0.5, P: PU},
    {c: [-150, -90], r: [24, 50], k: -0.5},
    {c: [150, -90], r: [24, 50], k: -0.6},
  ];
  const creases: CreaseDef[] = [
    {pts: [[-30, -76], [-48, -80], [-68, -80], [-92, -74], [-108, -58]], w: 5, k: 0.9, P: PU},
    {pts: [[30, -76], [48, -80], [68, -80], [92, -74], [108, -58]], w: 5, k: 0.9, P: PU},
    {pts: [[-38, -8], [-58, 2], [-80, 0], [-100, -14]], w: 5, k: 0.6, P: PU},
    {pts: [[38, -8], [58, 2], [80, 0], [100, -14]], w: 5, k: 0.6, P: PU},
    {pts: [[-24, 60], [-38, 66], [-40, 80], [-30, 88]], w: 5, k: 1, P: PU},
    {pts: [[24, 60], [38, 66], [40, 80], [30, 88]], w: 5, k: 1, P: PU},
    {pts: [[-40, 84], [-58, 110 - lift], [-74, 142 - lift], [-80, 170]], w: 8, k: 0.45 + s * 0.25},
    {pts: [[40, 84], [58, 110 - lift], [74, 142 - lift], [80, 170]], w: 8, k: 0.45 + s * 0.25},
    // front/side planes of the jaw: a clean sculpted edge, not jowls
    {pts: [[-100, 264], [-130, 230], [-148, 176], [-154, 116]], w: 12, k: 0.8, ridge: true},
    {pts: [[100, 264], [130, 230], [148, 176], [154, 116]], w: 12, k: 0.8, ridge: true},
    {pts: [[-8, 96], [-10, 112], [-12, 127]], w: 5, k: 0.6, ridge: true, P: PU},
    {pts: [[8, 96], [10, 112], [12, 127]], w: 5, k: 0.6, ridge: true, P: PU},
    {pts: [[-40, 184], [-14, 190], [14, 190], [40, 184]], w: 8, k: 0.9},
    {pts: [[0, 212], [0, 236], [0, 258]], w: 7, k: 0.9},
    {pts: [[0, -40], [0, 0], [0, 44]], w: 12, k: 0.6, ridge: true, P: PU},
    {pts: [[-80, -140], [-30, -148], [30, -148], [80, -140]], w: 7, k: 0.2 + Math.max(0, p.brow) * 0.5},
    {pts: [[-60, -118], [-20, -124], [20, -124], [60, -118]], w: 6, k: 0.15 + Math.max(0, p.brow) * 0.5},
    {pts: [[-110, -30], [-126, -20], [-134, -6]], w: 4, k: 0.5, P: PU},
    {pts: [[110, -30], [126, -20], [134, -6]], w: 4, k: 0.5, P: PU},
  ];

  // ---------- hair: swept back, gelled ----------
  const hairOuter: XY[] = [
    [158, -70], [166, -130], [166, -204], [146, -272], [92, -326], [10, -346], [-76, -338], [-136, -296], [-166, -226], [-170, -132], [-160, -70],
  ];
  const hairline: XY[] = [
    [-154, -70], [-152, -114], [-142, -162], [-118, -200], [-80, -212], [-36, -202], [0, -190], [36, -202], [80, -212], [118, -200], [142, -162], [152, -114], [154, -70],
  ];
  const hairMass = blob([...hairOuter.map(([x, y]) => F(x, y)), ...hairline.map(([x, y]) => Pz(x, y, 12))]);
  const hairSil = blob(cw(hairOuter.concat([[0, -190]]).map(([x, y]) => F(x, y))));
  const flow: XY[][] = [];
  for (let i = 0; i < 30; i++) {
    const t = i / 29;
    const x0 = -150 + t * 300;
    const y0 = -194 - Math.abs(Math.abs(x0) - 80) * -0.1 + (Math.abs(x0) > 120 ? (Math.abs(x0) - 120) * 1.2 : 0);
    const x1 = x0 * 0.62 + 10 + (p.hair ?? 0) * 0.6;
    const y1 = -330 + (Math.abs(x1) / 120) ** 2 * 50;
    flow.push([[x0, y0 - 4], [x0 * 0.98 + 4, y0 - 60], [x1, y1]]);
  }
  // pompadour front roll: from the hairline up ~50 units, bulging forward (extra depth)
  const rollBot: XY[] = hairline.slice(1, -1).map(([x, y]) => [x, y - 2]);
  const rollTop: XY[] = rollBot.map(([x, y]) => [x * 0.96, y - 46 + Math.abs(x) * 0.12 - (x < 0 ? 8 : 0)]);
  const PR = (x: number, y: number) => Pz(x, y, 26);
  const roll = blob([...rollBot, ...[...rollTop].reverse()].map(([x, y]) => PR(x, y)));
  const rollLocks = Array.from({length: 12}).map((_, i) => {
    const t = i / 11;
    const x0 = -136 + t * 272;
    const yb = -196 + (Math.abs(x0) > 110 ? (Math.abs(x0) - 110) * 0.9 : 0);
    return sb([[x0, yb - 4], [x0 * 0.97 + 6, yb - 30], [x0 * 0.9 + 14, yb - 52]], PR, false);
  });
  const FH = (x: number, y: number) => (y < -250 || Math.abs(x) > 150 ? F(x, y) : Pz(x, y, 14));

  // ---------- ears ----------
  const ear = (side: 1 | -1) => {
    const E = (x: number, y: number) => Pw(x * side, y, -24, 'U');
    const op: XY[] = [[162, -64], [186, -76], [202, -52], [205, -12], [197, 26], [180, 46], [164, 32]];
    return {
      outer: sb(op, E),
      outerCw: blob(cw(op.map(([x, y]) => E(x, y)))),
      helix: sb([[176, -70], [196, -60], [202, -26], [196, 14], [182, 38]], E, false),
      concha: sb([[170, -46], [186, -48], [190, -18], [182, 12], [170, 14]], E),
    };
  };
  const ears = [ear(-1), ear(1)];
  const phone = p.phone ?? 0;

  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <path d={skull} />
          <path d={face} />
        </clipPath>
        <radialGradient id={`${id}-skin`} cx={L[0] * 210} cy={L[1] * 210 - 20} r={470} gradientUnits="userSpaceOnUse" fx={L[0] * 220} fy={L[1] * 220 - 20}>
          <stop offset="0" stopColor={mix(mix(SKIN.hi, '#D8F4F2', 0.35 * p.key), SKIN.base, 1 - p.key)} />
          <stop offset="0.24" stopColor={mix(SKIN.hi, SKIN.base, 1 - p.key * 0.8)} />
          <stop offset="0.42" stopColor={SKIN.base} />
          <stop offset="0.57" stopColor={mix(SKIN.mid, SKIN.sss, 0.22)} />
          <stop offset="0.72" stopColor={SKIN.low} />
          <stop offset="0.88" stopColor={SKIN.deep} />
          <stop offset="1" stopColor="#2A1212" />
        </radialGradient>
        <linearGradient id={`${id}-hair`} x1={L[0] * 200} y1={-300} x2={-L[0] * 170} y2="-80" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={HAIR.hi} />
          <stop offset="0.35" stopColor={HAIR.base} />
          <stop offset="1" stopColor={HAIR.dark} />
        </linearGradient>
        <linearGradient id={`${id}-far`} x1={L[0] * 30} y1={L[1] * 30} x2={-L[0] * 230} y2={-L[1] * 230} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={SKIN.deep} stopOpacity={0} />
          <stop offset="0.6" stopColor={SKIN.deep} stopOpacity={0.2} />
          <stop offset="1" stopColor="#1A0C0C" stopOpacity={0.55} />
        </linearGradient>
        <radialGradient id={`${id}-keys`} cx={L[0] * 250} cy={L[1] * 250} r={300} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#9FF4FA" stopOpacity={1} />
          <stop offset="1" stopColor="#9FF4FA" stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}-roll`} x1="0" y1="-262" x2="0" y2="-190" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={HAIR.base} />
          <stop offset="0.35" stopColor={mix(HAIR.hi, HAIR.base, 0.35)} />
          <stop offset="0.75" stopColor={HAIR.base} />
          <stop offset="1" stopColor={HAIR.dark} />
        </linearGradient>
        <radialGradient id={`${id}-key`} cx={L[0] * 420} cy={L[1] * 320} r={620} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7FF0F6" stopOpacity={0.95} />
          <stop offset="0.5" stopColor="#4FC8D8" stopOpacity={0.35} />
          <stop offset="1" stopColor="#1A4050" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}-phone`} cx={-60} cy={420} r={380} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#EAF6FF" stopOpacity={1} />
          <stop offset="0.6" stopColor="#9CC6E8" stopOpacity={0.3} />
          <stop offset="1" stopColor="#9CC6E8" stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}-cav`} x1="0" y1="130" x2="0" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#140404" />
          <stop offset="1" stopColor="#521818" />
        </linearGradient>
        <linearGradient id={`${id}-lipU`} x1="0" y1="126" x2="0" y2="148" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={SKIN.lip} />
          <stop offset="1" stopColor={SKIN.lipDark} />
        </linearGradient>
        <linearGradient id={`${id}-lipL`} x1="0" y1="145" x2="0" y2="168" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={SKIN.lipDark} />
          <stop offset="0.35" stopColor={SKIN.lip} />
          <stop offset="1" stopColor={mix(SKIN.lip, SKIN.low, 0.5)} />
        </linearGradient>
        <linearGradient id={`${id}-teeth`} x1="0" y1="140" x2="0" y2="166" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FBF6EC" />
          <stop offset="1" stopColor="#CFC4B2" />
        </linearGradient>
      </defs>

      {ears.map((e, i) => (
        <g key={i}>
          <defs>
            <clipPath id={`${id}-ear${i}`}>
              <path d={e.outer} />
            </clipPath>
          </defs>
          <path d={e.outer} fill={i === 0 ? SKIN.mid : SKIN.low} />
          <g clipPath={`url(#${id}-ear${i})`}>
            <g filter={bl(6)} opacity={0.7}>
              <path d={e.outer} fill="none" stroke={SKIN.sss} strokeWidth={14} />
            </g>
          </g>
          <g filter={bl(3)}>
            <path d={e.concha} fill={SKIN.deep} opacity={0.75} />
          </g>
          <g filter={bl(2)} opacity={0.5 * keyA} style={{mixBlendMode: 'screen'}}>
            <path d={e.helix} fill="none" stroke={i === 0 ? KEY : SKIN.hi} strokeWidth={5} />
          </g>
        </g>
      ))}

      <path d={skull} fill={`url(#${id}-skin)`} />
      <path d={face} fill={`url(#${id}-skin)`} />

      {/* big forms */}
      <Soft blur={28} clip={clip} op={0.72}>
        <path d={sb([[100, -250], [160, -190], [186, -80], [190, 40], [196, 160], [170, 240], [100, 290], [220, 300], [260, 0], [230, -240]], (x, y) => P(x - L[0] * 36, y))} fill={SKIN.deep} />
      </Soft>
      <Soft blur={20} clip={clip} op={0.36}>
        <path d={sb([[70, -236], [124, -150], [142, -40], [148, 80], [140, 190], [96, 262]], (x, y) => P(x - L[0] * 24, y), false)} fill="none" stroke={SKIN.sss} strokeWidth={36} />
      </Soft>
      <Soft blur={12} clip={clip} op={0.6}>
        <path d={sb([[-184, 170], [-160, 230], [-100, 266], [0, 282], [100, 266], [160, 230], [184, 170], [170, 250], [80, 300], [0, 306], [-80, 300], [-170, 250]], P)} fill={SKIN.deep} />
      </Soft>
      {/* chiselled jaw: side planes + a hard-ish jawline core shadow */}
      <Soft blur={9} clip={clip} op={0.55}>
        <path d={sb([[-174, 90], [-176, 170], [-160, 214], [-120, 242], [-80, 256], [-100, 236], [-140, 206], [-156, 160], [-156, 100]], P)} fill={SKIN.low} />
        <path d={sb([[174, 90], [176, 170], [160, 214], [120, 242], [80, 256], [100, 236], [140, 206], [156, 160], [156, 100]], P)} fill={SKIN.deep} />
      </Soft>
      <Soft blur={5} clip={clip} op={0.5}>
        <path d={sb([[-168, 150], [-168, 200], [-140, 232], [-90, 256], [-44, 266]], P, false)} fill="none" stroke={SKIN.deep} strokeWidth={8} />
        <path d={sb([[168, 150], [168, 200], [140, 232], [90, 256], [44, 266]], P, false)} fill="none" stroke={SKIN.deep} strokeWidth={10} />
      </Soft>
      <Soft blur={14} clip={clip} op={0.6}>
        <path d={sb(ellPts(64, -40, 52, 36), PU)} fill={SKIN.low} />
        <path d={sb(ellPts(-64, -40, 52, 36), PU)} fill={SKIN.low} opacity={0.8} />
        <path d={sb(ellPts(30, -56, 16, 22), PU)} fill={SKIN.deep} opacity={0.7} />
        <path d={sb(ellPts(-30, -56, 16, 22), PU)} fill={SKIN.deep} opacity={0.55} />
        <path d={sb(ellPts(0, -180, 160, 14), PU)} fill={SKIN.deep} opacity={0.5} />
      </Soft>
      <Soft blur={7} clip={clip} op={0.75}>
        <path d={sb([[-L[0] * 7 + 10, -36], [-L[0] * 7 + 24, 10], [-L[0] * 7 + 32, 50], [-L[0] * 7 + 32, 70], [-L[0] * 7 + 18, 78], [-L[0] * 7 + 12, 40]], PU)} fill={SKIN.low} />
        <path d={sb(ellPts(-L[0] * 8, 96, 36, 10), PU)} fill={SKIN.deep} />
        <path d={sb(ellPts(cornerX + 4, cy0 - sm * 0.3, 9, 9), PU)} fill={SKIN.deep} opacity={0.85} />
        <path d={sb(ellPts(-cornerX - 4, cy0, 9, 9), PU)} fill={SKIN.deep} opacity={0.65} />
        <path d={sb(ellPts(-L[0] * 4, 174, 34, 9), P)} fill={SKIN.low} />
      </Soft>
      <Bumps items={bumps} P={P} L={L} clip={clip} dark={SKIN.low} light={KEY} lit={keyA} pass="dark" />
      <Creases items={creases} P={P} L={L} clip={clip} dark={SKIN.deep} light={SKIN.hi} lit={keyA} />
      <Soft blur={16} clip={clip} op={0.4}>
        <path d={sb(ellPts(100, 40, 36, 20), P)} fill={SKIN.blush} opacity={0.4} />
        <path d={sb(ellPts(-100, 40, 36, 20), P)} fill={SKIN.blush} opacity={0.4} />
        <path d={sb(ellPts(0, 66, 24, 18), PU)} fill={SKIN.blush} />
      </Soft>
      {/* clean-shaven jaw: faint blue-grey beard shadow */}
      <Soft blur={18} clip={clip} op={0.2}>
        <path d={sb([[-176, 120], [-150, 220], [-80, 268], [0, 280], [80, 268], [150, 220], [176, 120], [110, 160], [60, 176], [40, 120], [0, 110], [-40, 120], [-60, 176], [-110, 160]], P)} fill="#3E4656" />
      </Soft>
      <g clipPath={`url(#${clip})`} opacity={0.12} style={{mixBlendMode: 'multiply'}}>
        <rect x={-220} y={-280} width={440} height={580} filter="url(#pmottle)" />
      </g>
      <g clipPath={`url(#${clip})`} opacity={0.12} style={{mixBlendMode: 'multiply'}}>
        <rect x={-220} y={-280} width={440} height={580} filter="url(#ppores)" />
      </g>
      <g clipPath={`url(#${clip})`}>
        <rect x={-240} y={-300} width={480} height={620} fill={`url(#${id}-far)`} />
      </g>
      <g clipPath={`url(#${clip})`} style={{mixBlendMode: 'screen'}} opacity={0.26 * p.key}>
        <rect x={-240} y={-300} width={480} height={620} fill={`url(#${id}-keys)`} />
      </g>
      {phone > 0 ? (
        <g clipPath={`url(#${clip})`} style={{mixBlendMode: 'screen'}} opacity={phone * 0.45}>
          <rect x={-240} y={-300} width={480} height={620} fill={`url(#${id}-phone)`} />
        </g>
      ) : null}
      <Bumps items={bumps} P={P} L={L} clip={clip} dark={SKIN.deep} light={KEY} lit={keyA * 0.9} pass="light" />

      <g filter={bl(1.6)}>
        <path d={sb(ellPts(-14, 84, 8, 4, 10, 0.35), PU)} fill="#3A1414" />
        <path d={sb(ellPts(14, 84, 8, 4, 10, -0.35), PU)} fill="#2A0C0C" />
      </g>

      {/* mouth */}
      {p.jaw > 0.02 ? (
        <g>
          <path d={cavity} fill={`url(#${id}-cav)`} />
          <defs>
            <clipPath id={`${id}-cavc`}>
              <path d={cavity} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${id}-cavc)`}>
            <g filter={bl(2)}>
              <path d={sb(ellPts(0, 186, 40, 18), PL)} fill="#A04444" />
            </g>
            {/* lower teeth */}
            <path d={sb([[-40, 168], [0, 170], [40, 168], [40, 190], [0, 192], [-40, 190]], PL)} fill="#D8CDBC" opacity={0.85} />
            {/* big showman's upper teeth */}
            <path d={sb([[-54, 140], [0, 143], [54, 140], [52, 160], [0, 163], [-52, 160]], PU)} fill={`url(#${id}-teeth)`} />
            <g opacity={0.35} stroke="#8E8272" strokeWidth={1.4}>
              {[-36, -18, 0, 18, 36].map((x) => {
                const a = PU(x, 143);
                const b = PU(x * 1.02, 161);
                return <line key={x} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />;
              })}
            </g>
            <g filter={bl(3)} opacity={0.6}>
              <path d={sb([[-60, 146], [0, 150], [60, 146]], PU, false)} fill="none" stroke="#1A0606" strokeWidth={8} transform="translate(0 -6)" />
            </g>
          </g>
        </g>
      ) : null}
      <g filter={bl(0.8)}>
        <path d={upperLip} fill={`url(#${id}-lipU)`} />
        <path d={lowerLip} fill={`url(#${id}-lipL)`} />
      </g>
      <Soft blur={2} blend="screen" op={0.65 * keyA}>
        <path d={sb(ellPts(L[0] * 10, 157, 16, 3), PL)} fill={KEY} />
      </Soft>
      <g filter={bl(1.2)}>
        <path d={seam} fill="none" stroke="#2E1010" strokeWidth={3.2} strokeLinecap="round" />
      </g>

      <GlassEye e={eye(-1)} P={PU} Pz={Pz} />
      <GlassEye e={eye(1)} P={PU} Pz={Pz} />

      {/* heavy straight brows */}
      {[-1, 1].map((sd) => {
        const b = p.brow * 10;
        const pts: XY[] = [
          [20, -76 - b * 0.9], [52, -90 - b], [92, -92 - b * 0.8], [122, -84 - b * 0.5], [124, -76 - b * 0.5], [92, -78 - b * 0.8], [54, -74 - b], [22, -64 - b * 0.9],
        ].map(([x, y]) => [x * sd, y]);
        return (
          <g key={sd}>
            <g filter={bl(1.6)}>
              <path d={sb(pts, PU)} fill="#1E1614" opacity={0.95} />
            </g>
            <g filter={bl(0.8)} opacity={0.5}>
              {[0.2, 0.4, 0.6, 0.8].map((t) => {
                const x = 24 + t * 96;
                const a = PU(x * sd, -80 - b + t * 2);
                const c = PU((x + 12) * sd, -94 - b);
                return <line key={t} x1={a[0]} y1={a[1]} x2={c[0]} y2={c[1]} stroke="#3A2C28" strokeWidth={2} />;
              })}
            </g>
          </g>
        );
      })}

      <Bumps items={bumps} P={P} L={L} clip={clip} dark={SKIN.deep} light={KEY} lit={keyA} pass="spec" />

      {/* hair */}
      <Soft blur={8} op={0.55}>
        <path d={sb(hairline.map(([x, y]) => [x - L[0] * 6, y + 12] as XY), (x, y) => Pz(x, y, 0), false)} fill="none" stroke={SKIN.deep} strokeWidth={14} />
      </Soft>
      <g filter={bl(1.2)}>
        <path d={hairMass} fill={`url(#${id}-hair)`} />
      </g>
      <g clipPath={`url(#${id}-hairc)`}>
        <defs>
          <clipPath id={`${id}-hairc`}>
            <path d={hairMass} />
          </clipPath>
        </defs>
        <Soft blur={1.6} op={0.8}>
          {flow.map((st, i) => (
            <path key={i} d={sb(st, FH, false)} fill="none" stroke={i % 3 === 0 ? HAIR.hi : HAIR.dark} strokeWidth={i % 3 === 0 ? 3 : 5} strokeLinecap="round" opacity={0.5 + ((i * 7) % 4) * 0.14} />
          ))}
        </Soft>
        {/* gel: sharp glossy streaks along the sweep */}
        <Soft blur={3} blend="screen" op={0.75 * keyA}>
          {[-120, -96, -70].map((x0, i) => (
            <path key={i} d={sb([[x0, -176 + i * 4], [x0 * 0.92 + 4, -236], [x0 * 0.75 + 8, -290]], FH, false)} fill="none" stroke={HAIR.sheen} strokeWidth={4 - i} strokeLinecap="round" opacity={0.7 - i * 0.15} />
          ))}
        </Soft>
        <Soft blur={14} blend="screen" op={0.35 * keyA}>
          <path d={sb([[-170, -110], [-156, -220], [-96, -300], [-10, -326]], F, false)} fill="none" stroke={HAIR.sheen} strokeWidth={20} strokeLinecap="round" />
        </Soft>
        {/* the sculpted front roll: a separate lock mass with its own light, lifted off the forehead */}
        <path d={roll} fill={`url(#${id}-roll)`} opacity={0.95} />
        <Soft blur={2} op={0.7}>
          {rollLocks.map((d, i) => (
            <path key={i} d={d} fill="none" stroke={i % 2 ? HAIR.dark : HAIR.hi} strokeWidth={i % 2 ? 4 : 2.5} strokeLinecap="round" />
          ))}
        </Soft>
        <Soft blur={3} blend="screen" op={0.7 * keyA}>
          <path d={sb([[-120, -236], [-70, -252], [-20, -250]], (x, y) => Pz(x, y, 24), false)} fill="none" stroke={HAIR.sheen} strokeWidth={3} strokeLinecap="round" />
          <path d={sb([[10, -246], [50, -250], [90, -242]], (x, y) => Pz(x, y, 24), false)} fill="none" stroke={HAIR.sheen} strokeWidth={2} strokeLinecap="round" opacity={0.6} />
        </Soft>
        {/* the front roll of the pompadour catches the key; its underside goes black at the hairline */}
        <Soft blur={10} blend="screen" op={0.4 * keyA}>
          <path d={sb([[-140, -214], [-80, -236], [0, -234], [80, -238], [130, -220]], (x, y) => Pz(x, y, 20), false)} fill="none" stroke={HAIR.hi} strokeWidth={26} strokeLinecap="round" />
        </Soft>
        <Soft blur={6} op={0.8}>
          <path d={sb(hairline, (x, y) => Pz(x, y - 4, 12), false)} fill="none" stroke={HAIR.dark} strokeWidth={14} />
        </Soft>
        <Soft blur={18} op={0.6}>
          <path d={sb([[60, -300], [150, -240], [180, -130], [170, -60]], (x, y) => F(x - L[0] * 16, y), false)} fill="none" stroke={HAIR.dark} strokeWidth={50} />
        </Soft>
      </g>

      {(p.exposure ?? 1) < 0.999 ? (
        <g opacity={1 - (p.exposure ?? 1)}>
          <defs>
            <clipPath id={`${id}-exc`}>
              <path d={skull} />
              <path d={face} />
              <path d={hairMass} />
              {ears.map((e, i) => (
                <path key={i} d={e.outer} />
              ))}
            </clipPath>
          </defs>
          <rect x={-400} y={-400} width={800} height={800} fill="#07040A" clipPath={`url(#${id}-exc)`} />
        </g>
      ) : null}
      {/* flyaway strands break the helmet silhouette: it is sculpted hair, but gelled, not moulded */}
      <g filter={bl(1.2)} opacity={0.5}>
        {[-128, -70, -6, 58, 120].map((x, i) => {
          const yt = hairOuter.reduce((best, pt) => (Math.abs(pt[0] - x) < Math.abs(best[0] - x) ? pt : best))[1];
          const a = F(x, yt + 16);
          const b2 = F(x * 1.06 + (i % 2 ? 6 : -4), yt - 6 - (i % 3) * 3);
          return <path key={i} d={`M ${a[0]} ${a[1]} Q ${(a[0] + b2[0]) / 2 + 4} ${(a[1] + b2[1]) / 2 - 4} ${b2[0]} ${b2[1]}`} fill="none" stroke={i % 3 ? HAIR.base : HAIR.hi} strokeWidth={4} strokeLinecap="round" />;
        })}
      </g>
      <Rim id={`${id}-rim`} d={`${skull} ${face} ${hairSil} ${ears[1].outerCw}`} dx={-13} dy={4} color={WARM} op={p.rim * 0.95} blur={5} />
      <Rim id={`${id}-rimk`} d={`${skull} ${face} ${hairSil}`} dx={-L[0] * 9} dy={-L[1] * 4} color="#7FEAF2" op={p.key * 0.3} blur={4} />
    </g>
  );
};
