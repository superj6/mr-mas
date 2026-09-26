// MR. MAS - style-range Prototype 1: the ANIME MAS rig, RELIT under one hard tungsten top key (Step 0 of 7.1).
// The geometry is the approved rig's (src/shared/anime/Mas.tsx: the face, ear, neck, hair mass, locks, cowlick, eyes,
// mouth, torso, hood), copied point for point; the shared rig file is not edited. What's new is the LIGHT: the rig was
// shaded for the monitor's cyan side key with a soft pastel fill; here there is one hard key from above and in front
// (the card room's pool light), no fill, two shadow tones plus one highlight, deep blacks, and the far neon's cool rim
// on the back edges. The cel kit (Clip, Rim, Eye, MouthDraw) and the ink kit are the shared ones.
import React from 'react';
import {Clip, Eye, EyeSpec, MouthDraw, MouthSpec, Rim, SoftDef, Mouth} from '../../../../shared/anime/cel';
import {chains, curve, ell, ink, Pt, sub, swayTips} from '../../../../shared/anime/ink';
import {Lock, lockLines, shineBand} from '../../../../shared/anime/hair';
import {EYE_TUNGSTEN, HAIR_MAS, HOODIE, KEY, MOUTH_T, SKIN_MAS} from './tungsten';

// ---------------------------------------------------------------- the rig's geometry (verbatim from Mas.tsx)
export const FACE: Pt[] = [
  [-184, -40], [-178, -140], [-124, -214], [-24, -238], [78, -224], [138, -176], [158, -112],
  [161, -52], [153, -12, 1], [161, 24], [158, 60], [151, 98], [136, 134], [118, 158], [101, 172],
  [78, 176], [40, 166], [0, 150], [-44, 124], [-68, 102], [-80, 62], [-126, 22], [-172, 20],
];
export const EAR: Pt[] = [[-71, -14], [-93, -22], [-110, -7], [-113, 20], [-105, 48], [-89, 62], [-73, 55]];
const NECK: Pt[] = [[-96, 30], [44, 120], [58, 170], [64, 206], [72, 246], [88, 296], [20, 290], [-60, 262], [-132, 236], [-124, 190], [-110, 150]];
export const MASS: Pt[] = [
  [-124, 34, 1], [-142, 6], [-168, 30, 1], [-186, 0], [-206, -16, 1], [-220, -62], [-226, -112], [-214, -160], [-188, -204],
  [-164, -228], [-146, -224, 1], [-112, -252], [-62, -270], [-24, -266, 1], [20, -278], [86, -264], [140, -234],
  [178, -192], [198, -150, 1], [176, -138], [120, -132], [40, -124], [-30, -118], [-58, -100],
  [-58, -72], [-62, -14, 1], [-78, -52], [-100, -48], [-116, -16, 1], [-120, 8],
];
export const LOCKS: Lock[] = [
  {pts: [[112, -214, 1], [158, -202], [192, -170], [210, -128], [216, -90, 1], [194, -116], [164, -142], [112, -160, 1]], tip: 4},
  {pts: [[70, -212, 1], [124, -186], [148, -134], [144, -62, 1], [128, -102], [100, -138], [56, -164, 1]], tip: 3},
  {pts: [[92, -160, 1], [112, -130], [114, -80, 1], [100, -108], [82, -136, 1]], tip: 2},
  {pts: [[14, -212, 1], [64, -184], [92, -128], [84, -38, 1], [66, -90], [40, -132], [-4, -164, 1]], tip: 3},
  {pts: [[-40, -206, 1], [4, -178], [26, -128], [14, -62, 1], [0, -104], [-20, -138], [-50, -160, 1]], tip: 3},
  {pts: [[-94, -196, 1], [-52, -172], [-32, -132], [-42, -84, 1], [-56, -112], [-70, -136], [-96, -150, 1]], tip: 3},
];
export const COW: Pt[] = [[20, -262], [42, -300], [92, -330], [146, -340], [188, -324], [210, -290, 1], [186, -306], [162, -314], [174, -292, 1], [146, -304], [116, -300], [98, -284], [112, -258]];
const SH_MASS: Pt[] = [[-120, 60], [-120, -170], [-60, -176], [0, -180], [80, -186], [140, -180], [200, -170], [240, -156], [240, 60]];
const STRANDS: Pt[][] = [
  [[-146, -222], [-168, -170], [-182, -110]],
  [[-24, -264], [-60, -236], [-92, -196]],
  [[-142, 6], [-158, -40], [-164, -92]],
  [[56, -176], [76, -130], [82, -92]],
  [[160, -190], [182, -150], [196, -120]],
];
export const EYE_NEAR: EyeSpec = {
  upper: [[-18, -2], [-8, -17], [10, -27], [32, -28], [47, -19], [54, -5]],
  lower: [[-14, 3], [2, 11], [24, 14], [42, 10], [53, 0]],
  closed: [[-18, 2], [-6, 8], [14, 12], [34, 11], [47, 6], [54, -1]],
  iris: {cx: 21, cy: -7, rx: 12.5, ry: 15.5, rangeX: 13, rangeY: 5},
  lash: 5.6,
  lashPress: [1.25, 1.1, 0.95, 0.75, 0.55],
  lowerSpan: [0, 3],
  crease: [[-6, -29], [12, -39], [34, -39], [50, -27]],
  bag: [[2, 24], [20, 27], [38, 22]],
  flick: [[-17, -2], [-25, 1], [-30, 6]],
};
export const EYE_FAR: EyeSpec = {
  upper: [[154, -8], [148, -18], [134, -24], [120, -18], [112, -5]],
  lower: [[152, 0], [142, 8], [126, 8], [114, 0]],
  closed: [[154, -2], [146, 5], [132, 8], [120, 5], [112, -1]],
  iris: {cx: 134, cy: -8, rx: 7.5, ry: 14, rangeX: 7, rangeY: 4},
  lash: 5,
  lashPress: [1.2, 1.05, 0.9, 0.6],
  lowerSpan: [0, 2],
  crease: [[118, -30], [134, -36], [150, -28]],
  flick: [[154, -7], [160, -4], [163, 1]],
};
const MOUTH: MouthSpec = {
  rest: [[74, 120], [92, 124], [112, 124], [128, 117]],
  smile: [[72, 115], [90, 124], [112, 124], [131, 111]],
  M: [[76, 123], [96, 126], [114, 126], [127, 122]],
  E: [[[72, 118], [92, 117], [114, 117], [130, 113]], [[72, 118], [90, 131], [114, 132], [130, 113]]],
  A: [[[78, 117], [96, 114], [116, 115], [128, 113]], [[78, 117], [92, 146], [114, 147], [128, 113]]],
  O: [[88, 124], [92, 115], [104, 112], [114, 117], [117, 127], [108, 140], [95, 139]],
};
export const TORSO: Pt[] = [
  [-110, 218], [-230, 254], [-330, 292], [-390, 328], [-420, 380], [-436, 450], [-444, 560], [-448, 740, 1],
  [344, 740, 1], [340, 540], [328, 424], [302, 352], [256, 306], [176, 272], [84, 252],
];
export const HOOD_BACK: Pt[] = [[-228, 250], [-206, 200], [-150, 168], [-86, 166], [-24, 192], [30, 230], [-40, 254], [-140, 252]];
const HOOD_FRONT_OUT: Pt[] = [[-164, 240], [-112, 280], [-40, 318], [40, 342], [112, 340], [180, 310], [224, 278]];
const HOOD_FRONT_IN: Pt[] = [[204, 268], [150, 278], [90, 280], [40, 272], [-20, 256], [-80, 234], [-132, 218]];
const HOOD_FRONT: Pt[] = [...HOOD_FRONT_OUT, ...HOOD_FRONT_IN];

// ---------------------------------------------------------------- the TOP KEY's shapes (new)
// the side plane toward the ear turns away from the lamp
const SH_SIDE: Pt[] = [[-240, -260], [-40, -260], [-52, -150], [-62, -60], [-58, 10], [-40, 70], [-10, 110], [30, 140], [70, 168], [70, 280], [-240, 280]];
// the brow ridge shades the sockets: a crescent over each eye down to the lash line, deeper at the inner corner
const SH_SOCKET_N: Pt[] = [[-40, -26], [-14, -48], [24, -56], [60, -48], [84, -28], [90, 0], [70, 6], [54, -8], [36, -26], [10, -30], [-10, -20], [-26, -4], [-40, 4]];
const SH_SOCKET_F: Pt[] = [[100, -28], [118, -48], [146, -54], [166, -44], [168, -10], [156, -4], [142, -20], [124, -20], [110, -2]];
const DEEP_INNER: Pt[] = [[54, -34], [80, -40], [104, -28], [110, 0], [104, 30], [88, 26], [74, 4]];
// under the cheekbone the face turns down, away from the lamp
const SH_CHEEK: Pt[] = [[-60, 40], [-20, 62], [30, 78], [60, 96], [68, 120], [50, 150], [10, 146], [-30, 118], [-58, 80]];
// the nose: its near side is turned away; the shadow under the tip; under the lip; the chin's underside
const SH_NOSE_SIDE: Pt[] = [[92, -16], [110, -18], [124, 28], [138, 66], [134, 88], [112, 92], [102, 60], [94, 20]];
const DEEP_NOSE: Pt[] = [[118, 88], [146, 88], [144, 96], [124, 100]];
const SH_LIP: Pt[] = [[86, 130], [118, 130], [112, 140], [92, 142]];
const SH_CHIN: Pt[] = [[10, 160], [70, 172], [120, 160], [150, 110], [175, 140], [150, 210], [0, 210]];
// hair: the top of the head takes the lamp; everything below the crown's curve is in shade
const SH_HAIR_TOP: Pt[] = [[-320, -168], [-230, -186], [-150, -214], [-60, -232], [30, -242], [110, -226], [180, -196], [260, -170], [320, -150], [320, 140], [-320, 140]];
// hoodie: only the tops of the shoulders and the hood roll face the lamp
const SH_BODY_T: Pt[] = [[-520, 300], [-360, 318], [-200, 290], [-60, 300], [80, 290], [200, 300], [320, 330], [420, 360], [420, 800], [-520, 800]];

export interface MasTRig {
  lookX?: number; lookY?: number; lid?: number; mouth?: Mouth; uid?: string;
  /** line-weight multiplier (use < 1 when the drawing is shown large) */
  k?: number;
  /** omit the eyes (the ECU draws its own key drawing of them) */
  noEyes?: boolean;
  /** 0..1 how far the lower body falls into the dark (the pool is above him) */
  fall?: number;
}

export const MasTungsten: React.FC<MasTRig> = (p) => {
  const {lookX = 0.55, lookY = 0.1, lid = 0.22, mouth = 'rest', uid = 'mast', k = 1, noEyes = false, fall = 1} = p;
  const id = (s: string) => `${uid}-${s}`;
  const S = SKIN_MAS, HR = HAIR_MAS, HO = HOODIE;
  const L = (pts: readonly Pt[], w: number, o?: Parameters<typeof ink>[2]) => ink(pts, w * k, o);
  const faceD = curve(FACE);
  const massD = curve(MASS);
  const locks = LOCKS;
  const lockD = locks.map((l) => curve(l.pts));
  const cowD = curve(COW);
  const hairAll = [massD, ...lockD, cowD];
  const earD = curve(EAR);
  const neckD = curve(NECK);
  const torsoD = curve(TORSO);
  const hoodBackD = curve(HOOD_BACK);
  const hoodFrontD = curve(HOOD_FRONT);
  const browNear: Pt[] = [[58, -41], [36, -51], [10, -53], [-16, -43]];
  const browFar: Pt[] = [[110, -45], [128, -53], [148, -51], [161, -41]];
  const massChains = chains(MASS).filter((ch) => !(ch[0][0] === MASS[18][0] && ch[0][1] === MASS[18][1]));
  return (
    <g>
      <defs>
        <SoftDef id={id('soft')} r={5} />
        <SoftDef id={id('soft2')} r={16} />
        <linearGradient id={id('fall')} x1="0" y1="250" x2="0" y2="740" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#07060A" stopOpacity={0} />
          <stop offset="0.55" stopColor="#07060A" stopOpacity={0.55 * fall} />
          <stop offset="1" stopColor="#07060A" stopOpacity={0.96 * fall} />
        </linearGradient>
        <linearGradient id={id('top')} x1="0" y1="-360" x2="0" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={KEY.warm} stopOpacity={0.22} />
          <stop offset="0.5" stopColor={KEY.warm} stopOpacity={0.06} />
          <stop offset="1" stopColor={KEY.warm} stopOpacity={0} />
        </linearGradient>
        <linearGradient id={id('low')} x1="0" y1="-40" x2="0" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3A1418" stopOpacity={0} />
          <stop offset="1" stopColor="#3A1418" stopOpacity={0.32} />
        </linearGradient>
        <mask id={id('sil')} maskUnits="userSpaceOnUse" x={-2000} y={-2000} width={4000} height={4000}>
          <g fill="#FFF">
            <path d={torsoD} /><path d={hoodBackD} /><path d={neckD} /><path d={hoodFrontD} />
            <path d={faceD} /><path d={earD} />
            {hairAll.map((d, i) => <path key={i} d={d} />)}
          </g>
        </mask>
      </defs>

      {/* ============ BODY: the hoodie, lit only across the top ============ */}
      <path d={torsoD} fill={HO.base} />
      <Clip id={id('ct')} d={torsoD}>
        <path d={curve(SH_BODY_T)} fill={HO.shade} />
        {/* the hood roll's cast shadow down the chest */}
        <path d={hoodFrontD} transform="translate(0 34)" fill={HO.deep} />
        <path d={ink([[-300, 300], [-120, 282], [60, 290]], 10, {a: 0.5, b: 0.5})} fill={HO.hi} opacity={0.85} />
        <path d={ink([[200, 292], [290, 318], [330, 346]], 9, {a: 0.5, b: 0.5})} fill={HO.hi} opacity={0.8} />
      </Clip>
      <path d={hoodBackD} fill={HO.shade} />
      <Clip id={id('chb')} d={hoodBackD}>
        <path d={curve([[-240, 150], [-100, 150], [-40, 176], [0, 200], [-240, 200]])} fill={HO.base} />
      </Clip>
      <path d={L(sub(HOOD_BACK, 0, 4), 3.6, {a: 0.2, b: 0.4})} fill={HO.line} />

      {/* neck: the head's own shadow falls across it */}
      <path d={neckD} fill={S.shade} />
      <Clip id={id('cn')} d={neckD}>
        <path d={faceD} transform="translate(4 40)" fill={S.deep} />
      </Clip>
      <path d={L([[56, 176], [62, 210], [68, 246], [76, 280]], 2.6, {a: 0.3, b: 0.3})} fill={S.line} />
      <path d={L([[-108, 120], [-116, 170], [-124, 214]], 3.2, {a: 0.3, b: 0.4})} fill={S.line} />

      {/* hood front roll: its top edge catches the key */}
      <path d={hoodFrontD} fill={HO.shade} />
      <Clip id={id('chf')} d={hoodFrontD}>
        <path d={curve([[-200, 200], [-60, 216], [60, 250], [200, 250], [240, 262], [240, 284], [120, 296], [0, 292], [-120, 260], [-200, 236]])} fill={HO.base} />
        <path d={ink([[-120, 226], [0, 258], [120, 272], [200, 268]], 7, {a: 0.4, b: 0.4})} fill={HO.hi} />
      </Clip>
      <path d={L(HOOD_FRONT_OUT, 3.8, {a: 0.15, b: 0.3, press: [1.2, 1.1, 1, 0.85, 0.7]})} fill={HO.line} />
      <path d={L(HOOD_FRONT_IN.slice(1), 2.6, {a: 0.3, b: 0.3})} fill={HO.line} />
      {([[[26, 322], [22, 370], [18, 418], [16, 456]], [[104, 324], [108, 370], [112, 410], [114, 440]]] as Pt[][]).map((pts, i) => (
        <g key={i}>
          <path d={ink(pts, 9.5 * Math.max(0.8, k), {a: 0.02, b: 0.02, tip: 0.6})} fill={HO.line} />
          <path d={ink(pts.slice(0, 2), 5.6, {a: 0.02, b: 0.3, tip: 0.7})} fill={HO.hi} />
          <path d={ink(pts.slice(1), 5.6, {a: 0.02, b: 0.06, tip: 0.7})} fill={HO.shade} />
        </g>
      ))}
      <path d={L(sub(TORSO, 0, 7), 4.6, {a: 0.1, b: 0.02, press: [0.8, 1, 1.15, 1.2]})} fill={HO.line} />
      <path d={L(sub(TORSO, 8, 14), 3.2, {a: 0.02, b: 0.25, press: [1, 0.9, 0.7, 0.6]})} fill={HO.line} />
      <path d={L([[-196, 250], [-262, 320], [-318, 410], [-350, 520]], 2.6, {a: 0.2, b: 0.5})} fill={HO.line} opacity={0.9} />
      <Rim id={id('rbw')} shapes={[torsoD, hoodFrontD, hoodBackD]} dx={0} dy={-5} color={KEY.warm} opacity={0.7} />
      <Rim id={id('rbc')} shapes={[torsoD, hoodBackD, neckD]} dx={-4} dy={0} color={KEY.rimCool} opacity={0.55} />

      {/* ============ HEAD ============ */}
      <g>
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
          {/* the bangs throw a hard shadow straight down onto the forehead */}
          <g transform="translate(2 24)" fill={S.shade}>
            {[massD, ...lockD].map((d, i) => <path key={i} d={d} />)}
          </g>
          {/* ONE highlight tone, in hard shapes: the nose bridge and tip, the cheekbone's top, the lower lip */}
          <g fill={S.hi}>
            <path d={ink([[126, 14], [138, 42], [146, 66]], 6, {a: 0.5, b: 0.5})} />
            <path d={ink([[40, 30], [66, 34], [86, 30]], 7, {a: 0.5, b: 0.5})} />
            <path d={ink([[98, 131], [110, 131]], 4, {a: 0.5, b: 0.5})} />
          </g>
          <rect x={-300} y={-300} width={600} height={500} fill={`url(#${id('top')})`} />
          <rect x={-300} y={-100} width={600} height={400} fill={`url(#${id('low')})`} />
        </Clip>
        {/* the ear is on the far side of the lamp: in shade, its rim cool */}
        <path d={earD} fill={S.shade} />
        <Clip id={id('ce')} d={earD}>
          <path d={curve([[-84, -4], [-100, -4], [-105, 16], [-98, 38], [-86, 44], [-92, 20]])} fill={S.deep} />
        </Clip>
        <path d={L(sub(EAR, 0, 6), 3.2, {a: 0.25, b: 0.25})} fill={S.line} />
        <path d={L(sub(FACE, 6, 14), 2.8, {a: 0.25, b: 0.05, press: [0.8, 0.7, 0.8, 1]})} fill={S.line} />
        <path d={L(sub(FACE, 14, 20), 3.6, {a: 0.05, b: 0.3, press: [1, 1.2, 1.1, 0.9]})} fill={S.line} />

        {!noEyes && (
          <>
            <Eye id={id('e1')} spec={EYE_NEAR} c={EYE_TUNGSTEN} lookX={lookX} lookY={lookY} lid={lid} k={k} light={0.9} />
            <Eye id={id('e2')} spec={EYE_FAR} c={EYE_TUNGSTEN} lookX={lookX} lookY={lookY} lid={lid} k={k} light={0.9} />
          </>
        )}
        <path d={L(browNear, 7.4, {a: 0.04, b: 0.65, tip: 0.1, press: [1.1, 1, 0.8, 0.6]})} fill={HR.line} />
        <path d={L(browFar, 6, {a: 0.04, b: 0.55, tip: 0.1, press: [1.1, 1, 0.8]})} fill={HR.line} />
        <path d={L([[134, 40], [149, 70], [143, 82]], 2.8, {a: 0.4, b: 0.25})} fill={S.line} />
        <path d={L([[126, 87], [137, 89]], 2.4, {a: 0.3, b: 0.3})} fill={S.line} />
        <MouthDraw id={id('m')} shape={mouth} spec={MOUTH} c={MOUTH_T} k={k} />

        {/* ---- hair: the crown takes the lamp, the rest is in shade ---- */}
        <path d={cowD} fill={HR.base} />
        <path d={massD} fill={HR.base} />
        <Clip id={id('chm')} d={[massD, cowD]}>
          <path d={curve(SH_HAIR_TOP)} fill={HR.shade} />
          <path d={curve(SH_MASS)} fill={HR.deep} />
          {shineBand([
            {pts: [[-120, -236], [-60, -262], [0, -268]], w: 10, teeth: [0.3, 0.7], color: HR.hi, op: 0.85},
            {pts: [[30, -270], [96, -256], [150, -222]], w: 11, teeth: [0.2, 0.5, 0.8], color: HR.hi, op: 0.9},
          ])}
          <path d={ink([[70, -318], [120, -336], [168, -332], [198, -310]], 8, {a: 0.4, b: 0.5, tip: 0})} fill={HR.hi} opacity={0.9} />
        </Clip>
        {massChains.map((ch, i) => <path key={i} d={L(ch, 3.3, {a: 0.3, b: 0.3, tip: 0.05})} fill={HR.line} />)}
        {STRANDS.map((s, i) => <path key={`s${i}`} d={L(s, 2.1, {a: 0.12, b: 0.7})} fill={HR.line} opacity={0.8} />)}
        {locks.map((l, i) => (
          <g key={`l${i}`}>
            <path d={lockD[i]} fill={HR.shade} />
            <Clip id={id(`lk${i}`)} d={lockD[i]}>
              {/* only the root end of each lock reaches up into the light */}
              <path d={curve([[-300, -400], [300, -400], [300, -196], [0, -206], [-300, -186]])} fill={HR.base} />
              <path d={curve([[-300, -110], [300, -110], [300, 60], [-300, 60]])} fill={HR.deep} />
            </Clip>
            {lockLines(l, 3, k).map((d, j) => <path key={j} d={d} fill={HR.line} />)}
          </g>
        ))}
        {[sub(COW, 0, 5), sub(COW, 5, 8), sub(COW, 8, 11)].map((ch, i) => (
          <path key={`c${i}`} d={L(ch, i === 1 ? 2.4 : 3, {a: i === 0 ? 0.5 : 0.2, b: i === 2 ? 0.55 : 0.2, tip: 0.05})} fill={HR.line} />
        ))}
        <Rim id={id('rhw')} shapes={[...hairAll]} dx={0} dy={-4.5} color={KEY.warm} opacity={0.85} />
        <Rim id={id('rhc')} shapes={[massD, cowD, earD]} dx={-4} dy={0} color={KEY.rimCool} opacity={0.7} />
      </g>

      {/* compositing: the pool is above him, so he falls into the dark below the shoulders */}
      <rect mask={`url(#${id('sil')})`} x={-600} y={-500} width={1200} height={1400} fill={`url(#${id('fall')})`} />
    </g>
  );
};

export const MAST_BOX: [number, number, number, number] = [-470, -350, 830, 1090];

// ---------------------------------------------------------------- MAS FROM BEHIND (the push's foreground cel)
// The same rig silhouette seen from behind his right shoulder (a silhouette reads the same from the far side): the
// back of the skull and the cowlick in hair, the ear, the jaw and cheek turned away with only their edge catching the
// pool, the hood bunched at the nape, the hoodie's shoulder. Nearly all of it in the dark; the lamp draws its edges.
export const MasBack: React.FC<{uid: string; k?: number}> = ({uid, k = 1}) => {
  const id = (s: string) => `${uid}-${s}`;
  const L = (pts: readonly Pt[], w: number, o?: Parameters<typeof ink>[2]) => ink(pts, w * k, o);
  const faceD = curve(FACE), massD = curve(MASS), cowD = curve(COW), earD = curve(EAR), neckD = curve(NECK);
  const torsoD = curve(TORSO), hoodBackD = curve(HOOD_BACK), hoodFrontD = curve(HOOD_FRONT);
  // from behind, the hair covers the skull down to the nape and across the temple; the face is turned away, so all
  // that shows of it is the cheek and the jaw, and their far edge
  const BACK_HAIR: Pt[] = [[-226, -112], [-206, -16], [-168, 30], [-124, 38], [-96, 30], [-70, -30], [-40, -40], [20, -52], [80, -70], [128, -96], [158, -130], [178, -192], [140, -234], [86, -264], [20, -278], [-62, -270], [-146, -224], [-214, -160]];
  const backHairD = curve(BACK_HAIR);
  const tipsD = curve(LOCKS[0].pts);
  const hairAll = [massD, cowD, backHairD, tipsD];
  const DARK = '#0B090D', HAIRD = '#130C0D', SKIND = '#241317';
  return (
    <g>
      <defs>
        <clipPath id={id('tip')}><path d="M150 -400L400 -400L400 200L150 200Z" /></clipPath>
      </defs>
      <path d={torsoD} fill={DARK} />
      <path d={hoodFrontD} fill="#100E13" />
      <path d={hoodBackD} fill="#131117" />
      <path d={L(HOOD_FRONT_OUT, 3, {a: 0.15, b: 0.3})} fill="#26222A" />
      <path d={L([[-196, 250], [-262, 320], [-318, 410], [-350, 520]], 2.6, {a: 0.2, b: 0.5})} fill="#1C1A20" />
      <Rim id={id('rt')} shapes={[torsoD, hoodBackD, hoodFrontD]} dx={3} dy={-6} color={KEY.warm} opacity={0.85} />
      <path d={neckD} fill={SKIND} />
      <path d={faceD} fill={SKIND} />
      {/* the cheek and jaw turned away: only their far edge finds the lamp */}
      <Rim id={id('rf')} shapes={[faceD]} dx={10} dy={-2} color="#A86A48" opacity={0.95} />
      <Rim id={id('rf2')} shapes={[faceD]} dx={3.5} dy={-1} color={KEY.hot} opacity={0.75} />
      {/* the hair: skull, nape and temple; the fringe's one flick showing past the brow */}
      <path d={massD} fill={HAIRD} />
      <path d={backHairD} fill={HAIRD} />
      <path d={cowD} fill={HAIRD} />
      <g clipPath={`url(#${id('tip')})`}><path d={tipsD} fill={HAIRD} /></g>
      {STRANDS.map((s, i) => <path key={`s${i}`} d={L(s, 3, {a: 0.12, b: 0.7})} fill="#2E1D1A" />)}
      {([[[-200, -120], [-150, -190], [-60, -236]], [[-180, -40], [-150, -120], [-90, -190]], [[-120, 10], [-110, -80], [-60, -150]], [[-40, -250], [40, -262], [110, -236]], [[0, -60], [60, -110], [120, -150]], [[-50, -50], [10, -120], [60, -190]]] as Pt[][]).map((s, i) => (
        <path key={`c${i}`} d={L(s, 3.4, {a: 0.2, b: 0.6})} fill="#2A1A18" />
      ))}
      {/* the ear, in front of the hair at the side of the head */}
      <path d={earD} fill="#2A161A" />
      <path d={curve([[-84, -4], [-100, -4], [-105, 16], [-98, 38], [-86, 44], [-92, 20]])} fill="#120A0C" />
      <Rim id={id('re')} shapes={[earD]} dx={4} dy={-4} color="#D08A5E" opacity={0.95} />
      <path d={L(sub(EAR, 0, 6), 2.6, {a: 0.25, b: 0.25})} fill="#070406" />
      <Rim id={id('rh')} shapes={hairAll} dx={4} dy={-6} color={KEY.warm} opacity={0.95} />
      <Rim id={id('rh2')} shapes={hairAll} dx={1.5} dy={-2.5} color={KEY.hot} opacity={0.6} />
      <Rim id={id('rhc')} shapes={[massD, backHairD, torsoD]} dx={-5} dy={0} color={KEY.rimCoolSoft} opacity={0.55} />
    </g>
  );
};
