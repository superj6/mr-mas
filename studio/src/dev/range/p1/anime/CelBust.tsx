// MR. MAS - style-range Prototype 1: the players as HELD CEL DRAWINGS under the table's one tungsten key.
// Built on the approved anime rigs' geometry (Mas.tsx's face for KRAM and MARIO, Nole.tsx's face, hair, tee, arm and
// phone for NOLE and, re-haired silver, NESNEJ), copied point for point; the shared rig files are not edited. The light
// is the relit rig's (MasTungsten): one key from above and in front (the pool over the pot), two shadow tones and one
// highlight, the far neon's cool rim on the back edges. Faces stay composed: lids a little low, eyes on the table.
import React from 'react';
import {Clip, Eye, EyeColors, EyeSpec, MouthDraw, MouthSpec, Rim, Mouth} from '../../../../shared/anime/cel';
import {chains, curve, ell, ink, prng, Pt, sub} from '../../../../shared/anime/ink';
import {FACE as MAS_FACE, EAR as MAS_EAR, EYE_NEAR as MAS_EN, EYE_FAR as MAS_EF, TORSO as MAS_TORSO} from './MasTungsten';
import {KEY, Tone4} from './tungsten';

// ---------------------------------------------------------------- Nole.tsx geometry (verbatim)
const N_FACE: Pt[] = [
  [-190, -40], [-184, -150], [-128, -224], [-24, -248], [80, -234], [144, -186], [164, -120], [167, -58],
  [159, -16, 1], [169, 22], [167, 62], [162, 104], [153, 138], [142, 166, 1], [120, 184], [84, 191, 1],
  [34, 180], [-28, 156], [-74, 128, 1], [-88, 74], [-132, 24], [-178, 20],
];
const N_EAR: Pt[] = [[-80, -18], [-102, -28], [-122, -10], [-126, 22], [-117, 52], [-99, 68], [-82, 60]];
const N_NECK: Pt[] = [[-116, 40], [70, 130], [86, 180], [96, 216], [106, 250], [118, 284], [30, 290], [-70, 270], [-172, 244], [-160, 190], [-138, 140]];
const N_MASS: Pt[] = [
  [-140, 30, 1], [-166, 4], [-198, 14, 1], [-214, -30], [-240, -46, 1], [-228, -100], [-246, -130, 1], [-230, -170], [-250, -196, 1],
  [-206, -236], [-150, -272], [-94, -290, 1], [-40, -306], [18, -314], [60, -304, 1], [110, -304], [158, -276], [186, -236], [184, -188, 1], [160, -174],
  [120, -164], [60, -160], [10, -150], [-30, -130], [-56, -98], [-64, -40], [-70, -6, 1], [-88, -50], [-110, -48],
  [-128, -16, 1], [-134, 12],
];
const N_STRANDS: Pt[][] = [
  [[162, -182], [120, -246], [30, -286], [-70, -278]],
  [[112, -168], [70, -222], [-10, -256], [-120, -244]],
  [[52, -160], [8, -202], [-76, -226], [-176, -204]],
  [[-4, -148], [-56, -176], [-146, -180], [-222, -140]],
  [[-40, -120], [-100, -130], [-176, -110], [-236, -70]],
];
const N_EN: EyeSpec = {
  upper: [[-18, -4], [-6, -16], [12, -24], [34, -25], [48, -17], [55, -6]], lower: [[-14, 2], [2, 8], [24, 11], [42, 8], [54, -1]],
  closed: [[-18, 1], [-6, 6], [14, 9], [34, 9], [48, 4], [55, -2]], iris: {cx: 22, cy: -8, rx: 11.5, ry: 13.5, rangeX: 13, rangeY: 4},
  lash: 6, lashPress: [1.3, 1.15, 1, 0.8, 0.55], lowerSpan: [0, 3], crease: [[-8, -26], [12, -34], [36, -34], [52, -24]], flick: [[-17, -4], [-26, -1], [-31, 4]],
};
const N_EF: EyeSpec = {
  upper: [[160, -10], [153, -19], [139, -24], [125, -19], [116, -7]], lower: [[158, -2], [148, 5], [132, 6], [118, -2]],
  closed: [[160, -4], [152, 3], [138, 6], [125, 3], [116, -3]], iris: {cx: 139, cy: -10, rx: 7, ry: 12.5, rangeX: 7, rangeY: 3.5},
  lash: 5.2, lashPress: [1.25, 1.05, 0.9, 0.6], lowerSpan: [0, 2], crease: [[122, -30], [140, -34], [156, -27]], flick: [[160, -9], [166, -6], [169, -1]],
};
const N_MOUTH: MouthSpec = {
  rest: [[72, 130], [92, 133], [114, 130], [134, 119]], smile: [[70, 124], [92, 133], [116, 131], [138, 114]], M: [[74, 131], [96, 133], [116, 132], [132, 126]],
  E: [[[70, 126], [92, 125], [116, 124], [134, 117]], [[70, 126], [90, 139], [116, 140], [134, 117]]],
  A: [[[76, 125], [96, 122], [118, 122], [132, 118]], [[76, 125], [92, 154], [116, 155], [132, 118]]],
  O: [[88, 132], [92, 122], [106, 119], [117, 124], [120, 135], [110, 148], [96, 147]],
};
const M_MOUTH: MouthSpec = {
  rest: [[74, 120], [92, 124], [112, 124], [128, 117]], smile: [[72, 115], [90, 124], [112, 124], [131, 111]], M: [[76, 123], [96, 126], [114, 126], [127, 122]],
  E: [[[72, 118], [92, 117], [114, 117], [130, 113]], [[72, 118], [90, 131], [114, 132], [130, 113]]],
  A: [[[78, 117], [96, 114], [116, 115], [128, 113]], [[78, 117], [92, 146], [114, 147], [128, 113]]],
  O: [[88, 124], [92, 115], [104, 112], [114, 117], [117, 127], [108, 140], [95, 139]],
};
const N_TORSO: Pt[] = [
  [-150, 218], [-260, 244], [-364, 276], [-432, 300], [-482, 336], [-506, 400], [-516, 500], [-526, 1000, 1],
  [420, 1000, 1], [406, 540], [394, 440], [370, 368], [318, 306], [220, 272], [118, 256],
];
const N_COLLAR_OUT: Pt[] = [[-172, 222], [-104, 258], [-20, 284], [62, 294], [134, 284], [196, 256]];
const N_COLLAR_IN: Pt[] = [[176, 252], [124, 272], [58, 280], [-16, 270], [-94, 246], [-150, 216]];
const N_ARM: Pt[] = [[-330, 820, 1], [-270, 680], [-200, 574], [-124, 496], [-76, 464], [-30, 520], [-36, 574], [-80, 650], [-126, 740], [-156, 820, 1]];
const N_FIST: Pt[] = [[-84, 474], [-44, 444], [0, 436], [4, 580], [-40, 576], [-80, 540]];
const N_FINGERS: Pt[][] = [
  [[-2, 440], [56, 434], [90, 446], [98, 464], [86, 478], [30, 480], [-2, 476]],
  [[-4, 476], [56, 476], [94, 482], [101, 500], [88, 513], [28, 515], [-4, 511]],
  [[-6, 511], [50, 512], [86, 518], [91, 534], [78, 546], [22, 548], [-6, 545]],
  [[-8, 545], [38, 546], [68, 552], [71, 566], [60, 575], [14, 577], [-8, 574]],
];
const N_THUMB: Pt[] = [[-46, 450], [-2, 426], [48, 414], [84, 418, 1], [60, 432], [14, 448]];
const N_PHONE: Pt[] = [[-6, 452, 1], [44, 272, 1], [124, 294, 1], [76, 474, 1]];
const M_NECK: Pt[] = [[-96, 30], [44, 120], [58, 170], [64, 206], [72, 246], [88, 296], [20, 290], [-60, 262], [-132, 236], [-124, 190], [-110, 150]];

// ---------------------------------------------------------------- the top key's shapes (as in MasTungsten)
const SH_SIDE: Pt[] = [[-240, -260], [-40, -260], [-52, -150], [-62, -60], [-58, 10], [-40, 70], [-10, 110], [30, 140], [70, 168], [70, 280], [-240, 280]];
const SH_SOCKET_N: Pt[] = [[-40, -26], [-14, -48], [24, -56], [60, -48], [84, -28], [90, 0], [70, 6], [54, -8], [36, -26], [10, -30], [-10, -20], [-26, -4], [-40, 4]];
const SH_SOCKET_F: Pt[] = [[100, -28], [118, -48], [146, -54], [166, -44], [168, -10], [156, -4], [142, -20], [124, -20], [110, -2]];
const DEEP_INNER: Pt[] = [[54, -34], [80, -40], [104, -28], [110, 0], [104, 30], [88, 26], [74, 4]];
const SH_CHEEK: Pt[] = [[-60, 40], [-20, 62], [30, 78], [60, 96], [68, 120], [50, 150], [10, 146], [-30, 118], [-58, 80]];
const SH_NOSE_SIDE: Pt[] = [[92, -16], [110, -18], [124, 28], [138, 66], [134, 88], [112, 92], [102, 60], [94, 20]];
const DEEP_NOSE: Pt[] = [[118, 88], [146, 88], [144, 96], [124, 100]];
const SH_LIP: Pt[] = [[86, 130], [118, 130], [112, 140], [92, 142]];
const SH_CHIN: Pt[] = [[10, 160], [70, 172], [120, 160], [150, 110], [175, 140], [150, 220], [0, 220]];
const SH_BODY_T: Pt[] = [[-600, 300], [-380, 312], [-200, 286], [-60, 296], [80, 286], [220, 296], [340, 326], [460, 360], [460, 1100], [-600, 1100]];

export type HairStyle = 'nole' | 'kram' | 'mario' | 'nesnej';
export type TorsoStyle = 'tee' | 'fleece' | 'leather';
export interface BustProps {
  uid: string;
  face: 'mas' | 'nole';
  hairStyle: HairStyle;
  torso: TorsoStyle;
  skin: Tone4; hair: Tone4; cloth: Tone4;
  eye: EyeColors;
  lookX?: number; lookY?: number; lid?: number; mouth?: Mouth;
  /** line weight multiplier (set from the on-screen scale so lines stay pen-sized at 1080) */
  k?: number;
  glasses?: boolean;
  chain?: boolean;
  age?: boolean;
  /** Nole's phone hand; glow 0..1 (his tell flares it one step) */
  phone?: number;
  /** torso width (a per-player build: Kram compact, Nole broad) */
  ws?: number;
  /** head tilt in degrees about the neck, and the head's own proportions (a per-player face) */
  tilt?: number;
  faceScale?: [number, number];
  /** a little lift in one corner of the mouth (composed, never a grin) */
  smirk?: number;
}

/** curly hair as ONE mass: the cap plus a scalloped rim of curls merged into it (no inner outlines), a single broken
 *  ink edge only on each rim curl's outward side, and sparse C-shaped curl marks inside that follow the light */
const CurlyHair: React.FC<{id: string; cap: Pt[]; rim: Array<[number, number, number, number]>; hair: Tone4; k: number; seed: number}> = ({id, cap, rim, hair, k, seed}) => {
  const capD = curve(cap);
  const rnd = prng(seed);
  const all = [capD, ...rim.map(([x, y, r]) => ell(x, y, r, r * 0.94))];
  // curl marks on a jittered grid inside the cap's box
  const xs = cap.map((q) => q[0]), ys = cap.map((q) => q[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const marks: React.ReactNode[] = [];
  let n = 0;
  for (let y = y0 + 22; y < y1 - 10; y += 30)
    for (let x = x0 + 20 + ((Math.round(y) / 30) % 2) * 15; x < x1 - 14; x += 32) {
      const jx = x + (rnd() - 0.5) * 16, jy = y + (rnd() - 0.5) * 14;
      const r = 9 + rnd() * 7;
      const a0 = rnd() * Math.PI * 2;
      const pts: Pt[] = [0, 0.33, 0.66, 1].map((t) => [jx + Math.cos(a0 + t * 4.2) * r, jy + Math.sin(a0 + t * 4.2) * r * 0.9] as Pt);
      const top = jy < y0 + (y1 - y0) * 0.34;
      marks.push(<path key={n++} d={ink(pts, (top ? 2.2 : 2.6) * k, {a: 0.3, b: 0.5})} fill={top ? hair.hi : hair.line} opacity={top ? 0.55 : 0.5} />);
    }
  return (
    <g>
      {all.map((d, i) => <path key={i} d={d} fill={hair.base} />)}
      <Clip id={`${id}-sh`} d={all}>
        {/* the key finds the crown; the sides and the nape turn away into the shade and the dark */}
        <path d={curve([[-360, -150], [-200, -196], [-60, -236], [80, -228], [220, -186], [360, -150], [360, 160], [-360, 160]])} fill={hair.shade} />
        <path d={curve([[-360, -60], [360, -90], [360, 160], [-360, 160]])} fill={hair.deep} />
        {marks}
        <path d={ink([[-120, -250], [-40, -282], [60, -280], [150, -244]], 13, {a: 0.45, b: 0.45})} fill={hair.hi} opacity={0.5} />
      </Clip>
      {rim.map(([x, y, r, a], i) => {
        const arc: Pt[] = [-0.9, -0.3, 0.3, 0.9].map((t) => [x + Math.cos(a + t) * r, y + Math.sin(a + t) * r * 0.94] as Pt);
        return <path key={`e${i}`} d={ink(arc, 2.8 * k, {a: 0.25, b: 0.35})} fill={hair.line} />;
      })}
    </g>
  );
};
const curlRing = (seed: number, cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n: number, r: number): Array<[number, number, number, number]> => {
  const rnd = prng(seed);
  return Array.from({length: n}, (_, i) => {
    const a = a0 + ((a1 - a0) * (i + rnd() * 0.5)) / n;
    const rr = r * (0.8 + rnd() * 0.4);
    return [cx + Math.cos(a) * rx * (0.95 + rnd() * 0.08), cy + Math.sin(a) * ry * (0.95 + rnd() * 0.08), rr, a] as [number, number, number, number];
  });
};
// Kram: a short, tight crop (the curls sit close to the skull); Mario: a looser, taller mop
const KRAM_CURLS = curlRing(4, -22, -92, 186, 172, Math.PI * 0.92, Math.PI * 1.9, 22, 24);
const MARIO_CURLS = curlRing(7, -30, -84, 228, 218, Math.PI * 0.86, Math.PI * 1.92, 30, 34);
const KRAM_CAP: Pt[] = [[-196, -10], [-214, -100], [-196, -180], [-140, -236], [-60, -264], [30, -264], [110, -236], [160, -184], [168, -150], [120, -160], [60, -168], [0, -164], [-60, -150], [-100, -110], [-118, -60], [-130, -6]];
const MARIO_CAP: Pt[] = [[-236, 30], [-256, -100], [-232, -206], [-160, -272], [-60, -300], [40, -300], [130, -268], [190, -206], [196, -150], [140, -150], [70, -162], [0, -156], [-60, -140], [-100, -100], [-118, -40], [-134, 20]];

export const CelBust: React.FC<BustProps> = (p) => {
  const {uid, face, hairStyle, torso, skin: S, hair: HR, cloth: CL, eye, lookX = 0.35, lookY = 0.45, lid = 0.34, mouth = 'rest', k = 1, glasses, chain, age, phone, ws = 1, tilt = 0, faceScale = [1, 1], smirk = 0} = p;
  const id = (s: string) => `${uid}-${s}`;
  const L = (pts: readonly Pt[], w: number, o?: Parameters<typeof ink>[2]) => ink(pts, w * k, o);
  const isN = face === 'nole';
  const FACE = isN ? N_FACE : MAS_FACE;
  const EAR = isN ? N_EAR : MAS_EAR;
  const NECK = isN ? N_NECK : M_NECK;
  const EN = isN ? N_EN : MAS_EN;
  const EF = isN ? N_EF : MAS_EF;
  const MOUTH = isN ? N_MOUTH : M_MOUTH;
  // the rig's hoodie torso stops at the bust crop; seated at the rail it must run on below the table's edge
  const TORSO = torso === 'fleece' ? MAS_TORSO.map((q) => (q[1] >= 740 ? ([q[0], 1000, 1] as Pt) : q)) : N_TORSO;
  const faceD = curve(FACE), earD = curve(EAR), neckD = curve(NECK), torsoD = curve(TORSO);
  const hairMass: Pt[] = hairStyle === 'kram' ? KRAM_CAP : hairStyle === 'mario' ? MARIO_CAP : N_MASS;
  const massD = curve(hairMass);
  const curls = hairStyle === 'kram' ? KRAM_CURLS : hairStyle === 'mario' ? MARIO_CURLS : [];
  const headTf = `rotate(${tilt} 0 170) translate(0 ${(1 - faceScale[1]) * 60}) scale(${faceScale[0]} ${faceScale[1]})`;
  const collarD = curve([...N_COLLAR_OUT, ...N_COLLAR_IN]);
  const browNear: Pt[] = isN ? [[62, -34], [38, -44], [8, -46], [-20, -36]] : [[58, -41], [36, -51], [10, -53], [-16, -43]];
  const browFar: Pt[] = isN ? [[114, -38], [134, -46], [154, -45], [170, -34]] : [[110, -45], [128, -53], [148, -51], [161, -41]];
  const pg = phone ?? 0;
  // fleece: a standing zip collar round the neck
  const zipCollar: Pt[] = [[-150, 190], [-60, 176], [40, 196], [120, 236], [170, 262], [120, 300], [30, 290], [-60, 262], [-140, 240]];
  return (
    <g>
      <defs>
        <radialGradient id={id('ph')} cx="80" cy="300" r="440" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#DDF2FF" stopOpacity={0.5 * pg} />
          <stop offset="0.5" stopColor="#DDF2FF" stopOpacity={0.14 * pg} />
          <stop offset="1" stopColor="#DDF2FF" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={id('pg')} cx="92" cy="270" r="110" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#DDF2FF" stopOpacity={0.12 + 0.2 * pg} />
          <stop offset="1" stopColor="#DDF2FF" stopOpacity={0} />
        </radialGradient>
        <linearGradient id={id('fall')} x1="0" y1="300" x2="0" y2="760" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#07060A" stopOpacity={0} />
          <stop offset="1" stopColor="#07060A" stopOpacity={0.62} />
        </linearGradient>
      </defs>
      {/* ============ BODY ============ */}
      <g transform={ws !== 1 ? `scale(${ws} 1)` : undefined}>
      <path d={torsoD} fill={CL.base} />
      <Clip id={id('ct')} d={torsoD}>
        <path d={curve(SH_BODY_T)} fill={CL.shade} />
        <path d={ink([[-380, 300], [-200, 280], [-40, 292]], 12, {a: 0.5, b: 0.5})} fill={CL.hi} opacity={torso === 'leather' ? 1 : 0.7} />
        <path d={ink([[210, 292], [320, 320], [380, 362]], 11, {a: 0.5, b: 0.5})} fill={CL.hi} opacity={torso === 'leather' ? 1 : 0.7} />
        {torso === 'leather' && <path d={ink([[-420, 420], [-446, 520], [-456, 640]], 7, {a: 0.5, b: 0.5})} fill={CL.hi} opacity={0.8} />}
        <rect x={-700} y={260} width={1400} height={900} fill={`url(#${id('fall')})`} />
      </Clip>
      <path d={L(sub(TORSO, 0, 6), 5, {a: 0.1, b: 0.02, press: [0.8, 1, 1.15, 1.2]})} fill={CL.line} />
      <path d={L(sub(TORSO, 7, TORSO.length - 1), 3.4, {a: 0.02, b: 0.25, press: [1, 0.9, 0.7, 0.6]})} fill={CL.line} />
      <Rim id={id('rbw')} shapes={[torsoD]} dx={0} dy={-6} color={KEY.warm} opacity={0.6} />
      <Rim id={id('rbc')} shapes={[torsoD]} dx={-6} dy={0} color={KEY.rimCool} opacity={0.5} />
      {/* neck, in the head's shadow */}
      <path d={neckD} fill={S.shade} />
      <Clip id={id('cn')} d={neckD}><path d={faceD} transform="translate(4 40)" fill={S.deep} /></Clip>
      {/* collars */}
      {torso === 'tee' && (
        <>
          <path d={collarD} fill={CL.shade} />
          <path d={L(N_COLLAR_OUT, 3.4, {a: 0.15, b: 0.3})} fill={CL.line} />
          <path d={L(N_COLLAR_IN.slice(1), 2.6, {a: 0.3, b: 0.3})} fill={CL.line} />
        </>
      )}
      {torso === 'fleece' && (
        <>
          <path d={curve(zipCollar)} fill={CL.base} />
          <Clip id={id('cz')} d={curve(zipCollar)}><path d={curve([[-200, 240], [0, 250], [200, 280], [200, 340], [-200, 340]])} fill={CL.shade} /></Clip>
          <path d={L(zipCollar.slice(0, 6), 3.4, {a: 0.1, b: 0.3})} fill={CL.line} />
          <path d={L([[40, 290], [36, 420], [30, 560]], 2.8, {a: 0.1, b: 0.3})} fill="#C9CED8" opacity={0.8} />
          <path d={curve([[34, 286], [48, 290], [46, 318], [32, 316]])} fill="#D8DCE4" />
        </>
      )}
      {torso === 'leather' && (
        <>
          {/* the dark tee in the V, then the lapels */}
          <path d={curve([[-100, 216], [20, 240], [120, 250], [40, 420]])} fill="#0E0C10" />
          <path d={curve([[-160, 214], [-60, 250], [10, 330], [40, 430], [-60, 380], [-180, 280]])} fill={CL.base} />
          <path d={curve([[140, 248], [220, 270], [250, 330], [90, 440], [60, 330]])} fill={CL.base} />
          <path d={L([[-160, 214], [-60, 250], [10, 330], [40, 430]], 3.2, {a: 0.1, b: 0.3})} fill={CL.line} />
          <path d={L([[140, 248], [110, 300], [60, 330], [90, 440]], 3, {a: 0.1, b: 0.3})} fill={CL.line} />
          <path d={ink([[-120, 234], [-50, 266], [0, 320]], 6, {a: 0.4, b: 0.5})} fill={CL.hi} />
        </>
      )}
      {chain && (
        <g>
          {Array.from({length: 17}, (_, i) => {
            const t = i / 16;
            const x = -150 + t * 300, y = 234 + Math.sin(t * Math.PI) * 58;
            return <path key={i} d={ell(x, y, 9, 6, t * 40 - 20)} fill={i % 2 ? '#C8913E' : '#F2C470'} stroke="#3A2408" strokeWidth={1.6 * k} />;
          })}
          {/* the tiny thermos pendant */}
          <path d={curve([[-10, 290, 1], [14, 290, 1], [14, 330, 1], [-10, 330, 1]])} fill="#D8D8DA" stroke="#2A2A30" strokeWidth={2 * k} />
          <path d={ink([[-6, 296], [-6, 324]], 3, {a: 0.2, b: 0.2})} fill="#FFFFFF" opacity={0.7} />
        </g>
      )}

      </g>

      {/* ============ HEAD ============ */}
      <g transform={headTf}>
      <path d={faceD} fill={S.base} />
      <Clip id={id('cf')} d={faceD}>
        <path d={curve(SH_SIDE)} fill={S.shade} />
        <path d={curve(SH_SOCKET_N)} fill={S.shade} />
        <path d={curve(SH_SOCKET_F)} fill={S.shade} />
        <path d={curve(DEEP_INNER)} fill={S.deep} />
        <path d={curve(SH_CHEEK)} fill={S.shade} />
        <path d={curve(SH_NOSE_SIDE)} fill={S.shade} />
        <path d={curve(DEEP_NOSE)} fill={S.deep} />
        <path d={curve(SH_LIP)} fill={S.shade} />
        <path d={curve(SH_CHIN)} fill={S.shade} />
        <g transform="translate(2 26)" fill={S.shade}><path d={massD} />{curls.map(([x, y, r], i) => <path key={i} d={ell(x, y, r, r)} />)}</g>
        <g fill={S.hi}>
          <path d={ink([[126, 14], [138, 42], [146, 66]], 6, {a: 0.5, b: 0.5})} />
          <path d={ink([[40, 30], [66, 34], [86, 30]], 7, {a: 0.5, b: 0.5})} />
        </g>
        {age && (
          <>
            <path d={L([[60, 60], [70, 96], [74, 124]], 1.8, {a: 0.4, b: 0.4})} fill={S.line} opacity={0.6} />
            <path d={L([[-10, 18], [16, 28], [42, 26]], 1.4, {a: 0.4, b: 0.4})} fill={S.line} opacity={0.5} />
            <path d={L([[20, -64], [60, -70], [100, -66]], 1.4, {a: 0.4, b: 0.4})} fill={S.line} opacity={0.4} />
          </>
        )}
        {pg > 0 && <rect x={-300} y={-300} width={600} height={600} fill={`url(#${id('ph')})`} />}
        {pg > 0 && <path d={curve([[20, 150], [80, 170], [130, 150], [150, 110], [120, 176], [60, 196], [10, 176]])} fill="#DDF2FF" opacity={0.06 + 0.14 * pg} />}
      </Clip>
      <path d={earD} fill={S.shade} />
      <Clip id={id('ce')} d={earD}><path d={curve([[-84, -4], [-100, -4], [-105, 16], [-98, 38], [-86, 44], [-92, 20]])} fill={S.deep} /></Clip>
      <path d={L(sub(EAR, 0, 6), 3.2, {a: 0.25, b: 0.25})} fill={S.line} />
      <path d={L(sub(FACE, 6, 14), 2.8, {a: 0.25, b: 0.05, press: [0.8, 0.7, 0.8, 1]})} fill={S.line} />
      <path d={L(sub(FACE, 14, 20), 3.6, {a: 0.05, b: 0.3, press: [1, 1.2, 1.1, 0.9]})} fill={S.line} />
      <Eye id={id('e1')} spec={EN} c={eye} lookX={lookX} lookY={lookY} lid={lid} k={k} light={0.8} />
      <Eye id={id('e2')} spec={EF} c={eye} lookX={lookX} lookY={lookY} lid={lid} k={k} light={0.8} />
      <path d={L(browNear, isN ? 8.4 : 7.4, {a: 0.04, b: 0.65, tip: 0.1, press: [1.1, 1, 0.8, 0.6]})} fill={hairStyle === 'nesnej' ? '#5C565A' : HR.line} />
      <path d={L(browFar, isN ? 7 : 6, {a: 0.04, b: 0.55, tip: 0.1, press: [1.1, 1, 0.8]})} fill={hairStyle === 'nesnej' ? '#5C565A' : HR.line} />
      <path d={L(isN ? [[118, -8], [132, 30], [158, 74], [150, 88]] : [[134, 40], [149, 70], [143, 82]], 2.8, {a: 0.4, b: 0.25})} fill={S.line} />
      <MouthDraw id={id('m')} shape={mouth} spec={smirk ? {...MOUTH, rest: MOUTH.rest.map((q, i) => (i === MOUTH.rest.length - 1 ? [q[0] + 2, q[1] - 10 * smirk] : q) as Pt)} : MOUTH} c={{line: '#3A171A', lineSoft: '#7A4640', interior: '#3E1B20', tongue: '#A45560', teeth: '#EFE4DA'}} k={k} />
      {glasses && (
        <g fill="none" stroke="#141014" strokeLinejoin="round">
          <path d={ell(16, -8, 44, 40)} strokeWidth={4.2 * k} />
          <path d={ell(136, -10, 27, 36)} strokeWidth={3.6 * k} />
          <path d={ink([[60, -14], [84, -22], [109, -14]], 4 * k, {a: 0.2, b: 0.2})} fill="#141014" stroke="none" />
          <path d={ink([[-28, -14], [-64, -12], [-96, -8]], 4 * k, {a: 0.1, b: 0.4})} fill="#141014" stroke="none" />
          <path d={curve([[-14, -38], [22, -42], [-2, 6], [-20, 0]])} fill="#FFE2B8" stroke="none" opacity={0.14} />
        </g>
      )}

      {/* ---- hair ---- */}
      {curls.length > 0 && <CurlyHair id={id('cu')} cap={hairMass} rim={curls} hair={HR} k={k} seed={hairStyle === 'kram' ? 14 : 19} />}
      {curls.length === 0 && <path d={massD} fill={HR.base} />}
      {curls.length === 0 && <Clip id={id('ch')} d={massD}>
        <path d={curve([[-320, -176], [-220, -196], [-120, -226], [-20, -246], [80, -236], [180, -206], [320, -170], [320, 140], [-320, 140]])} fill={HR.shade} />
        <path d={curve([[-320, -80], [320, -120], [320, 140], [-320, 140]])} fill={HR.deep} />
        <path d={ink([[-120, -262], [-40, -292], [60, -290], [150, -254]], 12, {a: 0.4, b: 0.4})} fill={HR.hi} opacity={hairStyle === 'nesnej' ? 1 : 0.8} />
      </Clip>}
      {hairStyle === 'nole' || hairStyle === 'nesnej' ? (
        <>
          {chains(N_MASS).map((ch, i) => <path key={i} d={L(ch, 3.4, {a: 0.3, b: 0.3, tip: 0.05})} fill={HR.line} />)}
          {N_STRANDS.map((s, i) => <path key={`s${i}`} d={L(s, hairStyle === 'nesnej' ? 3.4 : 2.2, {a: 0.12, b: 0.6})} fill={hairStyle === 'nesnej' ? '#48444C' : HR.line} opacity={0.9} />)}
          {hairStyle === 'nesnej' && (
            <Clip id={id('nsx')} d={massD}>
              {/* swept-back silver: combed ridges between the main strands, each a lit crest and a grey trough, so the
                  mass breaks into hair instead of reading as one shell */}
              {N_STRANDS.slice(0, -1).flatMap((s, i) => {
                const n2 = N_STRANDS[i + 1];
                return [0.33, 0.66].map((t, j) => {
                  const mid = s.map((q, m) => [q[0] + (n2[m][0] - q[0]) * t, q[1] + (n2[m][1] - q[1]) * t] as Pt);
                  return (
                    <g key={`ns${i}-${j}`}>
                      <path d={L(mid.map((q) => [q[0] + 4, q[1] - 6] as Pt), 3.2, {a: 0.25, b: 0.55})} fill={HR.hi} opacity={0.55} />
                      <path d={L(mid, 2.2, {a: 0.2, b: 0.6})} fill={HR.shade} opacity={0.7} />
                    </g>
                  );
                });
              })}
              <path d={curve([[-260, -60], [-180, -110], [-60, -150], [60, -160], [200, -170], [260, 40], [-260, 40]])} fill={HR.deep} opacity={0.35} />
            </Clip>
          )}
          {hairStyle === 'nesnej' && N_STRANDS.slice(0, 3).map((s, i) => <path key={`h${i}`} d={L(s.map((q) => [q[0] + 6, q[1] - 7] as Pt), 2.4, {a: 0.3, b: 0.5})} fill={HR.hi} opacity={0.8} />)}
        </>
      ) : null}
      <Rim id={id('rhw')} shapes={[massD]} dx={0} dy={-5} color={KEY.warm} opacity={0.85} />
      <Rim id={id('rhc')} shapes={[massD, earD]} dx={-5} dy={0} color={KEY.rimCool} opacity={0.6} />
      </g>

      {/* ============ NOLE'S PHONE HAND ============ */}
      {phone !== undefined && (() => {
        const armD = curve(N_ARM), fistD = curve(N_FIST), thumbD = curve(N_THUMB), phoneD = curve(N_PHONE);
        return (
          <g>
            <path d={armD} fill={S.shade} />
            <Clip id={id('ca')} d={armD}><path d={curve([[-400, 460], [0, 460], [0, 520], [-400, 700]])} fill={S.base} /></Clip>
            <path d={L(sub(N_ARM, 0, 4), 3.4, {a: 0.05, b: 0.2})} fill={S.line} />
            <path d={L(sub(N_ARM, 6, 9), 4, {a: 0.2, b: 0.05})} fill={S.line} />
            <path d={phoneD} transform="translate(8 -6)" fill="#DDF2FF" opacity={0.5 + 0.5 * pg} />
            <path d={phoneD} fill="#16171C" />
            <path d={L(N_PHONE, 3.4, {a: 0.02, b: 0.02, tip: 0.9})} fill="#050507" />
            <path d={fistD} fill={S.shade} />
            {N_FINGERS.map((f, i) => {
              const d = curve(f);
              return (
                <g key={i}>
                  <path d={d} fill={i === 0 ? S.base : S.shade} />
                  <path d={L([...f.slice(1), f[0]], 3, {a: 0.08, b: 0.3, press: [0.8, 1, 1.2, 1.1, 0.9]})} fill={S.line} />
                </g>
              );
            })}
            <path d={thumbD} fill={S.base} />
            <path d={L(sub(N_THUMB, 0, 5), 2.8, {a: 0.1, b: 0.1})} fill={S.line} />
            <Rim id={id('ra')} shapes={[armD, fistD, thumbD, ...N_FINGERS.map((f) => curve(f))]} dx={4} dy={-7} color="#DDF2FF" opacity={0.35 + 0.5 * pg} />
          </g>
        );
      })()}
    </g>
  );
};
