// SATIRE structure — MAS MANALT latex puppet head (sculpted, pseudo-3D, SVG).
// Sculpt space: front view, head ~324 wide, crown y-212, chin y184. Every feature point is projected
// onto a height field (cranium ellipsoid + nose/cheek/chin bumps), so small yaw/pitch turns parallax
// like a rigid sculpted head. Caricature: huge calm glass eyes + the forward cowlick. Nothing else.
import React from 'react';
import {blob, clamp, cw, ellPts, ellZ, gauss, rot3, sb, smooth, mix, type XY} from './lib';
import {Bumps, Creases, GlassEye, Rim, Soft, bl, norm, type Bump, type CreaseDef} from './kit';

export interface PuppetPose {
  yaw: number; // radians
  pitch: number;
  jaw: number; // 0..1
  smile: number; // 0..1
  lid: number; // 0 open .. 1 closed
  gazeX: number; // radians
  gazeY: number;
  brow: number; // -1..1
  key: number; // monitor key 0..1
  rim: number; // warm door rim 0..1
  hair?: number; // spring offset (deg) for cowlick / quiff
  phone?: number; // phone under-glow 0..1 (Nole)
  light?: XY; // screen direction toward the key light
  exposure?: number; // 1 = as lit; <1 darkens the whole puppet head (ambient level)
}

export const MAS_REST: PuppetPose = {yaw: 0, pitch: 0, jaw: 0, smile: 0.15, lid: 0.3, gazeX: 0, gazeY: 0, brow: 0, key: 1, rim: 0};

const SKIN = {
  hi: '#F3CDB3',
  base: '#E0A588',
  mid: '#C4836A',
  low: '#955646',
  deep: '#55292A',
  sss: '#D2483C',
  blush: '#DB6660',
  lip: '#BF6E66',
  lipDark: '#7E3A38',
};
const HAIR = {base: '#4E3424', dark: '#1C110B', hi: '#86644B', sheen: '#B4E8EA'};
const KEY = '#C4F5F8';
const WARM = '#FFB36A';

export const MasHead: React.FC<{p: PuppetPose; id?: string}> = ({p, id = 'mas'}) => {
  const view = {yaw: p.yaw, pitch: p.pitch};
  const L = norm(p.light ?? [-0.8, -0.45]);
  const JAW = 30;
  const depth = (x: number, y: number) => {
    let z = ellZ(x, y, 0, -30, 172, 228, 150);
    z += 40 * gauss(x, y, 0, 34, 14, 30) + 16 * gauss(x, y, 0, 56, 16, 12);
    z += 12 * (gauss(x, y, 92, 55, 38, 32) + gauss(x, y, -92, 55, 38, 32));
    z += 16 * gauss(x, y, 0, 158, 38, 22);
    z += 8 * (gauss(x, y, 70, -62, 48, 14) + gauss(x, y, -70, -62, 48, 14));
    z -= 6 * (gauss(x, y, 70, -6, 40, 30) + gauss(x, y, -70, -6, 40, 30));
    return z;
  };
  const s = p.smile;
  const cornerX = 40 + s * 4;
  type W = 'U' | 'L' | 'D';
  const jawW = (x: number, y: number, w: W) => {
    if (w === 'U') return 0;
    const fx = 1 - smooth((Math.abs(x) - 70) / 90);
    if (w === 'L') return Math.pow(Math.max(0, 1 - (x / (cornerX + 3)) ** 2), 0.8);
    return smooth((y - 104) / 14) * fx;
  };
  const Pw = (x: number, y: number, dz = 0, w: W = 'D'): XY => {
    const z = depth(x, y) + dz;
    const k = jawW(x, y, w) * p.jaw;
    return rot3(x, y + k * JAW, z - k * 12, view);
  };
  const P = (x: number, y: number) => Pw(x, y);
  const PU = (x: number, y: number) => Pw(x, y, 0, 'U');
  const PL = (x: number, y: number) => Pw(x, y, 0, 'L');
  const Pz = (x: number, y: number, dz: number) => Pw(x, y, dz, 'U');
  const F = (x: number, y: number): XY => [x + Math.sin(p.yaw) * 6, y - Math.sin(p.pitch) * 6];
  const keyA = 0.25 + 0.75 * p.key;

  // ---------- silhouette ----------
  const skullPts: XY[] = [
    [0, -212], [70, -202], [122, -170], [152, -118], [162, -55], [160, 5], [150, 55], [128, 96], [92, 120], [0, 128],
    [-92, 120], [-128, 96], [-150, 55], [-160, 5], [-162, -55], [-152, -118], [-122, -170], [-70, -202],
  ];
  const skull = blob(cw(skullPts.map(([x, y]) => F(x, y))));
  const facePts: XY[] = [
    [150, 10], [146, 60], [130, 104], [104, 140], [70, 166], [34, 181], [0, 186], [-34, 181], [-70, 166], [-104, 140],
    [-130, 104], [-146, 60], [-150, 10], [-80, -20], [0, -26], [80, -20],
  ];
  const face = blob(cw(facePts.map(([x, y]) => P(x, y))));
  const clip = `${id}-clip`;

  // ---------- mouth ----------
  const cy0 = 113 - s * 7;
  const upperTop: XY[] = [[-cornerX, cy0], [-26, 104 - s], [-9, 99], [0, 102], [9, 99], [26, 104 - s], [cornerX, cy0]];
  const mouthLine: XY[] = [[-cornerX, cy0], [-24, 113 - s * 3], [0, 114], [24, 113 - s * 3], [cornerX, cy0]];
  const lowerBot: XY[] = [[cornerX, cy0], [28, 122 - s * 2], [12, 129], [0, 130], [-12, 129], [-28, 122 - s * 2], [-cornerX, cy0]];
  const upperLip = blob([...upperTop.map(([x, y]) => PU(x, y)), ...[...mouthLine].reverse().slice(1, -1).map(([x, y]) => PU(x, y))]);
  const cavity = blob([...mouthLine.map(([x, y]) => PU(x, y)), ...[...mouthLine].reverse().slice(1, -1).map(([x, y]) => PL(x, y + 0.5))]);
  const lowerLip = blob([...mouthLine.map(([x, y]) => PL(x, y + 0.5)), ...lowerBot.slice(1, -1).map(([x, y]) => P(x, y))]);
  const seam = blob(mouthLine.map(([x, y]) => PU(x, y)), false);

  // ---------- eyes ----------
  const eye = (side: 1 | -1) => {
    const up: XY[] = [[24, -2], [38, -36], [70, -50], [102, -40], [120, -8]];
    const lo: XY[] = [[24, -2], [40, 26], [70, 36], [100, 26], [120, -8]];
    return {
      id: `${id}-eye${side > 0 ? 'R' : 'L'}`,
      c: [70 * side, -8] as XY,
      r: 42,
      upper: up.map(([x, y]) => [x * side, y] as XY),
      lower: lo.map(([x, y]) => [x * side, y] as XY),
      lid: clamp(p.lid + Math.max(0, -p.gazeY) * 0.45 - Math.max(0, p.gazeY) * 0.3),
      lowerLid: s * 0.8,
      gazeX: p.gazeX,
      gazeY: p.gazeY,
      headYaw: p.yaw,
      headPitch: p.pitch,
      iris: '#7E9862',
      irisDark: '#34462C',
      irisR: 24,
      skinLid: mix(mix(SKIN.mid, SKIN.low, 0.3), '#9A8A8A', 0.15),
      skinLidDark: mix(SKIN.low, SKIN.deep, 0.35),
      skinLidHi: mix(SKIN.base, SKIN.mid, 0.45),
      lash: '#2A1714',
      keyRefl: [L[0] * 0.8, L[1] * 0.8] as XY,
      keyColor: KEY,
      keyOp: 0.3 + 0.65 * p.key,
      warmRefl: [0.72, -0.25] as XY,
      warmOp: p.rim * 0.85,
      zc: -26,
      lightDir: L,
    };
  };

  // ---------- sculpt bumps & creases ----------
  const lift = s * 6;
  const bumps: Bump[] = [
    {c: [-52, -122], r: [66, 44], k: 0.7, spec: 0.35},
    {c: [52, -122], r: [66, 44], k: 0.6, spec: 0.2},
    {c: [-72, -66], r: [52, 16], k: 0.8, spec: 0.3, P: PU},
    {c: [72, -66], r: [52, 16], k: 0.8, spec: 0.2, P: PU},
    {c: [-94, 50 - lift], r: [48, 38], k: 1.25, spec: 0.5},
    {c: [94, 50 - lift], r: [48, 38], k: 1.25, spec: 0.3},
    {c: [0, 54], r: [21, 17], k: 1.1, spec: 0.95, P: PU},
    {c: [-24, 64], r: [11, 10], k: 0.8, P: PU},
    {c: [24, 64], r: [11, 10], k: 0.8, P: PU},
    {c: [0, 160], r: [34, 19], k: 1.0, spec: 0.28},
    {c: [-70, 40], r: [34, 10], k: 0.5, P: PU},
    {c: [70, 40], r: [34, 10], k: 0.5, P: PU},
    {c: [-140, -60], r: [26, 50], k: -0.5},
    {c: [140, -60], r: [26, 50], k: -0.6},
  ];
  const creases: CreaseDef[] = [
    // upper-lid creases
    {pts: [[-28, -44], [-48, -60], [-72, -64], [-100, -56], [-118, -34]], w: 5, k: 0.9, P: PU},
    {pts: [[28, -44], [48, -60], [72, -64], [100, -56], [118, -34]], w: 5, k: 0.9, P: PU},
    // lower lid / bag line
    {pts: [[-34, 34], [-54, 46], [-78, 48], [-104, 36]], w: 5, k: 0.55, P: PU},
    {pts: [[34, 34], [54, 46], [78, 48], [104, 36]], w: 5, k: 0.55, P: PU},
    // nose wing creases
    {pts: [[-20, 52], [-32, 58], [-34, 70], [-26, 76]], w: 4, k: 0.9, P: PU},
    {pts: [[20, 52], [32, 58], [34, 70], [26, 76]], w: 4, k: 0.9, P: PU},
    // nasolabial folds (gentle; he is young)
    {pts: [[-36, 72], [-48, 90], [-54, 108 - lift], [-56, 124 - lift]], w: 7, k: 0.22 + s * 0.3, P: PU},
    {pts: [[36, 72], [48, 90], [54, 108 - lift], [56, 124 - lift]], w: 7, k: 0.22 + s * 0.3, P: PU},
    // philtrum columns (ridges)
    {pts: [[-7, 80], [-8, 90], [-9, 99]], w: 4, k: 0.6, ridge: true, P: PU},
    {pts: [[7, 80], [8, 90], [9, 99]], w: 4, k: 0.6, ridge: true, P: PU},
    // mentolabial crease
    {pts: [[-26, 140], [-10, 144], [10, 144], [26, 140]], w: 6, k: 0.8},
    // nose bridge ridge
    {pts: [[0, -16], [0, 10], [0, 36]], w: 10, k: 0.6, ridge: true, P: PU},
  ];

  // ---------- hair ----------
  const hairOuter: XY[] = [
    [156, -26], [166, -70], [170, -120], [154, -172], [116, -212], [56, -236], [-10, -242], [-78, -228], [-128, -198], [-162, -148], [-170, -94], [-164, -46], [-156, -24],
  ];
  // fringe combed forward and across to screen-right, dipping over the right of the forehead
  const hairline: XY[] = [
    [-148, -26], [-146, -64], [-136, -104], [-108, -140], [-60, -160], [-12, -166], [30, -160], [66, -148], [94, -128], [112, -104],
    [120, -98], [126, -108], [134, -100], [140, -78], [146, -52], [148, -28],
  ];
  const hairMass = blob([...hairOuter.map(([x, y]) => F(x, y)), ...hairline.map(([x, y]) => Pz(x, y, 10))]);
  const hairSil = blob(cw(hairOuter.concat([[0, -150]]).map(([x, y]) => F(x, y))));
  // the cowlick: a tuft springing up at the front of the crown (springs around its root)
  const qa = ((p.hair ?? 0) * Math.PI) / 180;
  const qRoot: XY = [34, -238];
  const qr = (x: number, y: number): XY => {
    const dx = x - qRoot[0];
    const dy = y - qRoot[1];
    const c = Math.cos(qa);
    const sn = Math.sin(qa);
    return F(qRoot[0] + dx * c - dy * sn, qRoot[1] + dx * sn + dy * c);
  };
  const quiff: XY[] = [[30, -228], [36, -258], [58, -282], [90, -290], [116, -280], [126, -262], [112, -266], [96, -266], [84, -254], [84, -238], [96, -222]];
  const quiffPath = sb(quiff, qr);
  const quiffCw = blob(cw(quiff.map(([x, y]) => qr(x, y))));
  const quiffLocks: XY[][] = [
    [[40, -232], [46, -260], [70, -280], [104, -284]],
    [[62, -232], [64, -252], [82, -268], [110, -272]],
  ];
  // flow locks: from the crown/left parting, sweeping forward to the fringe
  const hairLocks: XY[][] = [];
  for (let i = 0; i < 28; i++) {
    const t = i / 27;
    const e = hairline[2 + Math.round(t * 11)];
    const xs = e[0] * 0.55 - 12 + ((i * 7) % 5) * 1.5;
    const ys = -226 + Math.abs(xs + 20) * 0.08;
    hairLocks.push([[xs, ys], [(xs + e[0]) / 2 + 18, (ys + e[1]) / 2 - 8], [e[0] + 4, e[1] - 6]]);
  }

  // ---------- ears ----------
  const ear = (side: 1 | -1) => {
    const E = (x: number, y: number) => Pw(x * side, y, -20, 'U');
    const op: XY[] = [[146, -40], [170, -52], [190, -30], [194, 6], [186, 40], [168, 62], [150, 50]];
    const outer = sb(op, E);
    const outerCw = blob(cw(op.map(([x, y]) => E(x, y))));
    const helix = sb([[160, -44], [182, -40], [190, -8], [186, 30], [172, 52]], E, false);
    const concha = sb([[156, -22], [172, -24], [178, 6], [170, 32], [158, 34]], E);
    return {outer, outerCw, helix, concha};
  };
  const ears = [ear(-1), ear(1)];
  const earsR = ears[1].outerCw;

  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <path d={skull} />
          <path d={face} />
        </clipPath>
        <radialGradient id={`${id}-skin`} cx={L[0] * 190} cy={L[1] * 190 - 30} r={380} gradientUnits="userSpaceOnUse" fx={L[0] * 200} fy={L[1] * 200 - 20}>
          <stop offset="0" stopColor={mix(mix(SKIN.hi, '#D8F4F2', 0.35 * p.key), SKIN.base, 1 - p.key)} />
          <stop offset="0.24" stopColor={mix(SKIN.hi, SKIN.base, 1 - p.key * 0.8)} />
          <stop offset="0.42" stopColor={SKIN.base} />
          <stop offset="0.57" stopColor={mix(SKIN.mid, SKIN.sss, 0.22)} />
          <stop offset="0.72" stopColor={SKIN.low} />
          <stop offset="0.88" stopColor={SKIN.deep} />
          <stop offset="1" stopColor="#2A1212" />
        </radialGradient>
        <linearGradient id={`${id}-hair`} x1={L[0] * 180} y1={-250 + L[1] * 40} x2={-L[0] * 160} y2="-40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={HAIR.hi} />
          <stop offset="0.4" stopColor={HAIR.base} />
          <stop offset="1" stopColor={HAIR.dark} />
        </linearGradient>
        <linearGradient id={`${id}-far`} x1={L[0] * 30} y1={L[1] * 30} x2={-L[0] * 190} y2={-L[1] * 190} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={SKIN.deep} stopOpacity={0} />
          <stop offset="0.6" stopColor={SKIN.deep} stopOpacity={0.2} />
          <stop offset="1" stopColor="#1A0C0C" stopOpacity={0.55} />
        </linearGradient>
        <radialGradient id={`${id}-keys`} cx={L[0] * 250} cy={L[1] * 250} r={300} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#9FF4FA" stopOpacity={1} />
          <stop offset="1" stopColor="#9FF4FA" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}-key`} cx={L[0] * 360} cy={L[1] * 300 - 30} r={520} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7FF0F6" stopOpacity={0.95} />
          <stop offset="0.5" stopColor="#4FC8D8" stopOpacity={0.35} />
          <stop offset="1" stopColor="#1A4050" stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}-cav`} x1="0" y1="100" x2="0" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#170505" />
          <stop offset="1" stopColor="#4E1616" />
        </linearGradient>
        <linearGradient id={`${id}-lipU`} x1="0" y1="98" x2="0" y2="114" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={SKIN.lip} />
          <stop offset="1" stopColor={SKIN.lipDark} />
        </linearGradient>
        <linearGradient id={`${id}-lipL`} x1="0" y1="112" x2="0" y2="132" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={SKIN.lipDark} />
          <stop offset="0.35" stopColor={SKIN.lip} />
          <stop offset="1" stopColor={mix(SKIN.lip, SKIN.low, 0.5)} />
        </linearGradient>
      </defs>

      {/* ears (behind skull edge), translucent latex */}
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

      {/* base sculpt */}
      <path d={skull} fill={`url(#${id}-skin)`} />
      <path d={face} fill={`url(#${id}-skin)`} />

      {/* large forms: shadow side, bounce, jaw underside */}
      <Soft blur={24} clip={clip} op={0.7}>
        <path d={sb([[96, -214], [150, -160], [176, -70], [170, 20], [150, 100], [112, 156], [60, 190], [150, 220], [230, 0], [210, -200]], (x, y) => P(x - L[0] * 30, y))} fill={SKIN.deep} />
      </Soft>
      <Soft blur={18} clip={clip} op={0.38}>
        <path d={sb([[62, -196], [110, -128], [126, -40], [122, 50], [98, 130], [56, 172]], (x, y) => P(x - L[0] * 20, y), false)} fill="none" stroke={SKIN.sss} strokeWidth={30} />
      </Soft>
      <Soft blur={10} clip={clip} op={0.55}>
        <path d={sb([[-136, 96], [-98, 148], [-50, 176], [0, 188], [50, 176], [98, 148], [136, 96], [120, 150], [60, 200], [0, 208], [-60, 200], [-120, 150]], P)} fill={SKIN.deep} />
      </Soft>
      {/* ambient occlusion */}
      <Soft blur={13} clip={clip} op={0.55}>
        <path d={sb(ellPts(70, -6, 60, 46), PU)} fill={SKIN.low} />
        <path d={sb(ellPts(-70, -6, 60, 46), PU)} fill={SKIN.low} opacity={0.8} />
        <path d={sb(ellPts(34, -26, 16, 26), PU)} fill={SKIN.deep} opacity={0.7} />
        <path d={sb(ellPts(-34, -26, 16, 26), PU)} fill={SKIN.deep} opacity={0.55} />
        <path d={sb(ellPts(0, -146, 150, 12), PU)} fill={SKIN.deep} opacity={0.5} />
      </Soft>
      <Soft blur={6} clip={clip} op={0.75}>
        <path d={sb([[-L[0] * 6 + 8, -8], [-L[0] * 6 + 20, 18], [-L[0] * 6 + 28, 46], [-L[0] * 6 + 28, 62], [-L[0] * 6 + 16, 68], [-L[0] * 6 + 10, 40]], PU)} fill={SKIN.low} />
        <path d={sb(ellPts(-L[0] * 6, 82, 30, 8), PU)} fill={SKIN.deep} />
        <path d={sb(ellPts(cornerX + 2, cy0 + 1, 5, 5), PU)} fill={SKIN.deep} opacity={0.7} />
        <path d={sb(ellPts(-cornerX - 2, cy0 + 1, 5, 5), PU)} fill={SKIN.deep} opacity={0.5} />
        <path d={sb(ellPts(-L[0] * 4, 138, 26, 7), P)} fill={SKIN.low} />
      </Soft>

      {/* sculpt passes */}
      <Bumps items={bumps} P={P} L={L} clip={clip} dark={SKIN.low} light={KEY} lit={keyA} pass="dark" />
      <Creases items={creases} P={P} L={L} clip={clip} dark={SKIN.deep} light={SKIN.hi} lit={keyA} />

      {/* subsurface & paint: cheeks, nose, eye rims */}
      <Soft blur={14} clip={clip} op={0.26}>
        <path d={sb(ellPts(92, 60 - lift, 40, 26), P)} fill={SKIN.blush} />
        <path d={sb(ellPts(-92, 60 - lift, 40, 26), P)} fill={SKIN.blush} opacity={0.8} />
        <path d={sb(ellPts(0, 58, 20, 16), PU)} fill={SKIN.blush} />
      </Soft>
      <Soft blur={5} clip={clip} op={0.35}>
        <path d={sb(ellPts(70, 30, 40, 7), PU)} fill={SKIN.blush} />
        <path d={sb(ellPts(-70, 30, 40, 7), PU)} fill={SKIN.blush} />
        <path d={sb(ellPts(-14, 70, 8, 6), PU)} fill={SKIN.sss} />
        <path d={sb(ellPts(14, 70, 8, 6), PU)} fill={SKIN.sss} />
      </Soft>
      <Soft blur={16} clip={clip} op={0.08}>
        <path d={sb([[-132, 70], [-110, 130], [-60, 176], [0, 190], [60, 176], [110, 130], [132, 70], [90, 120], [44, 130], [34, 96], [0, 88], [-34, 96], [-44, 130], [-90, 120]], P)} fill="#4A5060" />
      </Soft>
      <g clipPath={`url(#${clip})`} opacity={0.12} style={{mixBlendMode: 'multiply'}}>
        <rect x={-200} y={-240} width={400} height={440} filter="url(#pmottle)" />
      </g>
      <g clipPath={`url(#${clip})`} opacity={0.12} style={{mixBlendMode: 'multiply'}}>
        <rect x={-200} y={-240} width={400} height={440} filter="url(#ppores)" />
      </g>

      {/* key light from the monitor (world-space, stays put while the head turns) */}
      <g clipPath={`url(#${clip})`}>
        <rect x={-220} y={-260} width={440} height={480} fill={`url(#${id}-far)`} />
      </g>
      <g clipPath={`url(#${clip})`} style={{mixBlendMode: 'screen'}} opacity={0.26 * p.key}>
        <rect x={-220} y={-260} width={440} height={480} fill={`url(#${id}-keys)`} />
      </g>
      <Bumps items={bumps} P={P} L={L} clip={clip} dark={SKIN.deep} light={KEY} lit={keyA * 0.9} pass="light" />

      {/* nostrils */}
      <g filter={bl(1.6)}>
        <path d={sb(ellPts(-12, 71, 7, 3.6, 10, 0.35), PU)} fill="#3A1414" />
        <path d={sb(ellPts(12, 71, 7, 3.6, 10, -0.35), PU)} fill="#2A0C0C" />
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
            <path d={sb([[-30, 110], [0, 112], [30, 110], [30, 123], [0, 125], [-30, 123]], PU)} fill="#EADFCF" />
            <g filter={bl(2)}>
              <path d={sb(ellPts(0, 138, 26, 12), PL)} fill="#9A3E3E" />
            </g>
          </g>
        </g>
      ) : null}
      <g filter={bl(0.8)}>
        <path d={upperLip} fill={`url(#${id}-lipU)`} />
        <path d={lowerLip} fill={`url(#${id}-lipL)`} />
      </g>
      <Soft blur={2} blend="screen" op={0.4 * keyA}>
        <path d={sb(ellPts(L[0] * 8, 122, 10, 2.4), PL)} fill={KEY} />
        <path d={sb(ellPts(L[0] * 10 - 12, 104, 7, 1.8), PU)} fill={KEY} opacity={0.6} />
      </Soft>
      <g filter={bl(1.2)}>
        <path d={seam} fill="none" stroke="#3A1616" strokeWidth={2.8} strokeLinecap="round" />
      </g>

      {/* eyes */}
      <GlassEye e={eye(-1)} P={PU} Pz={Pz} />
      <GlassEye e={eye(1)} P={PU} Pz={Pz} />

      {/* brows: painted, soft */}
      {[-1, 1].map((sd) => {
        const b = p.brow * 8;
        const pts: XY[] = [
          [26, -70 - b * 0.6], [52, -82 - b], [86, -86 - b * 1.1], [116, -78 - b * 0.8], [126, -70 - b * 0.6], [88, -75 - b], [54, -72 - b], [30, -62 - b * 0.6],
        ].map(([x, y]) => [x * sd, y]);
        return (
          <g key={sd} filter={bl(1.6)}>
            <path d={sb(pts, PU)} fill="#4A3122" opacity={0.9} />
          </g>
        );
      })}

      {/* latex sheen */}
      <Bumps items={bumps} P={P} L={L} clip={clip} dark={SKIN.deep} light={KEY} lit={keyA} pass="spec" />

      {/* hair: sculpted and painted, clumped locks swept forward */}
      <Soft blur={8} op={0.5}>
        <path d={sb(hairline.map(([x, y]) => [x - L[0] * 6, y + 10] as XY), (x, y) => Pz(x, y, 0), false)} fill="none" stroke={SKIN.deep} strokeWidth={12} />
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
        <Soft blur={2} op={0.75}>
          {hairLocks.map((st, i) => (
            <path
              key={i}
              d={sb(st, (x, y) => (y < -200 || Math.abs(x) > 150 ? F(x, y) : Pz(x, y, 10)), false)}
              fill="none"
              stroke={i % 3 === 0 ? HAIR.hi : HAIR.dark}
              strokeWidth={i % 3 === 0 ? 3 : 5}
              opacity={0.55 + ((i * 5) % 4) * 0.12}
              strokeLinecap="round"
            />
          ))}
        </Soft>
        <Soft blur={14} blend="screen" op={0.45 * keyA}>
          <path d={sb([[-160, -60], [-146, -150], [-100, -206], [-30, -232]], F, false)} fill="none" stroke={HAIR.sheen} strokeWidth={18} strokeLinecap="round" />
        </Soft>
        <Soft blur={16} op={0.55}>
          <path d={sb([[60, -236], [140, -190], [170, -100], [160, -20]], (x, y) => F(x - L[0] * 14, y), false)} fill="none" stroke={HAIR.dark} strokeWidth={40} />
        </Soft>
      </g>
      {/* cowlick tuft */}
      <g filter={bl(1.2)}>
        <path d={quiffPath} fill={`url(#${id}-hair)`} />
      </g>
      <g clipPath={`url(#${id}-qc)`}>
        <defs>
          <clipPath id={`${id}-qc`}>
            <path d={quiffPath} />
          </clipPath>
        </defs>
        <Soft blur={2} op={0.8}>
          {quiffLocks.map((st, i) => (
            <path key={i} d={sb(st, qr, false)} fill="none" stroke={i === 1 ? HAIR.dark : HAIR.hi} strokeWidth={i === 1 ? 6 : 4} strokeLinecap="round" />
          ))}
        </Soft>
        <Soft blur={6} blend="screen" op={0.5 * keyA}>
          <path d={sb([[10, -250], [24, -280], [56, -294]], qr, false)} fill="none" stroke={HAIR.sheen} strokeWidth={9} strokeLinecap="round" />
        </Soft>
      </g>

      {/* warm rim from the doorway (behind, screen-right) */}
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
      <Rim id={`${id}-rim`} d={`${skull} ${face} ${hairSil} ${earsR} ${quiffCw}`} dx={-11} dy={4} color={WARM} op={p.rim * 0.95} blur={4} />
      {/* cool edge on the key side */}
      <Rim id={`${id}-rimk`} d={`${skull} ${face} ${hairSil}`} dx={-L[0] * 8} dy={-L[1] * 4} color="#7FEAF2" op={p.key * 0.3} blur={4} />
    </g>
  );
};
