import React from 'react';
import {AnimeRig, Clip, Eye, EyeSpec, MouthDraw, MouthSpec, Rim, SoftDef} from './cel';
import {bend, chains, curve, ell, ink, Pt, sub, swayTips, unrotate} from './ink';
import {Lock, lockLines, shineBand} from './hair';
import {LIGHT, MAS_C as C} from './palette';

/**
 * ANIME MAS — bust, 3/4 facing screen-right, key light = cyan monitor from screen-right.
 * Local units: crown ~y-275 (hair), chin y176, eye line y-8, bust crop y740. Neck pivot (10, 150).
 * Adult ~7-head proportions: shoulders ~2.3 head-widths.
 */

// ---------------------------------------------------------------- head
const FACE: Pt[] = [
  [-184, -40], [-178, -140], [-124, -214], [-24, -238], [78, -224], [138, -176], [158, -112],
  [161, -52], [153, -12, 1], [161, 24], [158, 60], [151, 98], [136, 134], [118, 158], [101, 172],
  [78, 176], [40, 166], [0, 150], [-44, 124], [-68, 102], [-80, 62], [-126, 22], [-172, 20],
];
const EAR: Pt[] = [[-71, -14], [-93, -22], [-110, -7], [-113, 20], [-105, 48], [-89, 62], [-73, 55]];
const NECK: Pt[] = [[-96, 30], [44, 120], [58, 170], [64, 206], [72, 246], [88, 296], [20, 290], [-60, 262], [-132, 236], [-124, 190], [-110, 150]];

// hair: a skull-cap mass + separately drawn, overlapping front locks (drawn right -> left)
const MASS: Pt[] = [
  [-124, 34, 1], [-142, 6], [-168, 30, 1], [-186, 0], [-206, -16, 1], [-220, -62], [-226, -112], [-214, -160], [-188, -204],
  [-164, -228], [-146, -224, 1], [-112, -252], [-62, -270], [-24, -266, 1], [20, -278], [86, -264], [140, -234],
  [178, -192], [198, -150, 1], [176, -138], [120, -132], [40, -124], [-30, -118], [-58, -100],
  [-58, -72], [-62, -14, 1], [-78, -52], [-100, -48], [-116, -16, 1], [-120, 8],
];
const LOCKS: Lock[] = [
  // L5: front-most flick, breaks the forehead silhouette
  {pts: [[112, -214, 1], [158, -202], [192, -170], [210, -128], [216, -90, 1], [194, -116], [164, -142], [112, -160, 1]], tip: 4},
  // L4
  {pts: [[70, -212, 1], [124, -186], [148, -134], [144, -62, 1], [128, -102], [100, -138], [56, -164, 1]], tip: 3},
  // L6 small accent
  {pts: [[92, -160, 1], [112, -130], [114, -80, 1], [100, -108], [82, -136, 1]], tip: 2},
  // L3: long central lock between the eyes
  {pts: [[14, -212, 1], [64, -184], [92, -128], [84, -38, 1], [66, -90], [40, -132], [-4, -164, 1]], tip: 3},
  // L2
  {pts: [[-40, -206, 1], [4, -178], [26, -128], [14, -62, 1], [0, -104], [-20, -138], [-50, -160, 1]], tip: 3},
  // L1: short temple lock
  {pts: [[-94, -196, 1], [-52, -172], [-32, -132], [-42, -84, 1], [-56, -112], [-70, -136], [-96, -150, 1]], tip: 3},
];
const COW: Pt[] = [[20, -262], [42, -300], [92, -330], [146, -340], [188, -324], [210, -290, 1], [186, -306], [162, -314], [174, -292, 1], [146, -304], [116, -300], [98, -284], [112, -258]];
// under-fringe (seen between the locks) is always in shade
const SH_MASS: Pt[] = [[-120, 60], [-120, -170], [-60, -176], [0, -180], [80, -186], [140, -180], [200, -170], [240, -156], [240, 60]];
// terminator across the whole hair volume, claws follow the strand direction into the lit side
const SH_HAIR: Pt[] = [
  [-300, 120], [-300, -360], [-70, -360], [-40, -292], [6, -270, 1], [-22, -254], [-20, -226], [-10, -190], [-16, -150], [-28, -110], [-40, 0], [-60, 120],
];
const STRANDS: Pt[][] = [
  [[-146, -222], [-168, -170], [-182, -110]],
  [[-24, -264], [-60, -236], [-92, -196]],
  [[-142, 6], [-158, -40], [-164, -92]],
  [[56, -176], [76, -130], [82, -92]],
  [[160, -190], [182, -150], [196, -120]],
];

// cel shadow shapes (painted loose, clipped to their base color)
const SH_FACE: Pt[] = [[-220, -260], [-26, -260], [-40, -150], [-46, -64], [-42, 10], [-26, 66], [8, 112], [48, 148], [100, 190], [100, 260], [-220, 260]];
const SH_NOSE: Pt[] = [[133, 52, 1], [143, 74], [141, 86, 1], [124, 89, 1], [133, 76]];
const SH_SOCKET: Pt[] = [[80, -28, 1], [92, -18], [96, -2, 1], [88, -12]];

const EYE_NEAR: EyeSpec = {
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
const EYE_FAR: EyeSpec = {
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
  E: [
    [[72, 118], [92, 117], [114, 117], [130, 113]],
    [[72, 118], [90, 131], [114, 132], [130, 113]],
  ],
  A: [
    [[78, 117], [96, 114], [116, 115], [128, 113]],
    [[78, 117], [92, 146], [114, 147], [128, 113]],
  ],
  O: [[88, 124], [92, 115], [104, 112], [114, 117], [117, 127], [108, 140], [95, 139]],
};

// ---------------------------------------------------------------- body
const TORSO: Pt[] = [
  [-110, 218], [-230, 254], [-330, 292], [-390, 328], [-420, 380], [-436, 450], [-444, 560], [-448, 740, 1],
  [344, 740, 1], [340, 540], [328, 424], [302, 352], [256, 306], [176, 272], [84, 252],
];
const HOOD_BACK: Pt[] = [[-228, 250], [-206, 200], [-150, 168], [-86, 166], [-24, 192], [30, 230], [-40, 254], [-140, 252]];
const HOOD_FRONT_OUT: Pt[] = [[-164, 240], [-112, 280], [-40, 318], [40, 342], [112, 340], [180, 310], [224, 278]];
const HOOD_FRONT_IN: Pt[] = [[204, 268], [150, 278], [90, 280], [40, 272], [-20, 256], [-80, 234], [-132, 218]];
const HOOD_FRONT: Pt[] = [...HOOD_FRONT_OUT, ...HOOD_FRONT_IN];
const SH_BODY: Pt[] = [[-480, 230], [-296, 258], [-316, 322], [-334, 408], [-346, 500], [-350, 600], [-346, 760], [-480, 760]];
const SH_HOODBACK: Pt[] = [[-260, 158], [-100, 158], [-96, 188], [-60, 208], [-20, 240], [-260, 278]];

export const AnimeMas: React.FC<AnimeRig> = (p) => {
  const {lookX = 0.45, lookY = 0.05, lid = 0.14, mouth = 'rest', brow = 0, tilt = 0, hairX = 0, hairY = 0, light = 1, ink: k = 1, uid = 'mas', night = 0.5} = p;
  const id = (s: string) => `${uid}-${s}`;
  const H = `rotate(${tilt} 10 150)`;
  const L = (pts: readonly Pt[], w: number, o?: Parameters<typeof ink>[2]) => ink(pts, w * k, o);
  const lt = Math.max(0, light);

  // hair spring: lock tips sway; the cowlick bends from its root and overshoots most
  const mass = swayTips(MASS, hairX * 0.5, hairY * 0.4, 0.25);
  const locks = LOCKS.map((l) => ({...l, pts: swayTips(l.pts.map((q, i) => (i === l.tip ? q : ([q[0], q[1]] as Pt))), hairX, hairY, 0.3).map((q, i) => (i === 0 || i === l.pts.length - 1 ? ([q[0], q[1], 1] as Pt) : q))}));
  const cow = bend(COW, [64, -266], hairX * 1.8, hairY * 1.5 - Math.abs(hairX) * 0.2, 160);
  const faceD = curve(FACE);
  const massD = curve(mass);
  const lockD = locks.map((l) => curve(l.pts));
  const cowD = curve(cow);
  const hairAll = [massD, ...lockD, cowD];
  const earD = curve(EAR);
  const neckD = curve(NECK);
  const torsoD = curve(TORSO);
  const hoodBackD = curve(HOOD_BACK);
  const hoodFrontD = curve(HOOD_FRONT);

  const b = brow * 7;
  const knit = Math.min(0, brow) * 4;
  const browNear: Pt[] = [[58, -41 - b + knit * -1.2], [36, -51 - b], [10, -53 - b * 0.9], [-16, -43 - b * 0.6]];
  const browFar: Pt[] = [[110, -45 - b + knit * -1.2], [128, -53 - b], [148, -51 - b * 0.9], [161, -41 - b * 0.6]];

  const [rx, ry] = unrotate(5.5, 0, tilt);
  const [bx, by] = unrotate(-5, 0, tilt);
  const strX = hairX * 0.35;
  const massChains = chains(mass).filter((ch) => !(ch[0][0] === mass[18][0] && ch[0][1] === mass[18][1]));

  return (
    <g>
      <defs>
        <SoftDef id={id('soft')} r={6} />
        <SoftDef id={id('soft2')} r={12} />
        <linearGradient id={id('wrap')} x1="-460" y1="0" x2="360" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0.55" stopColor={LIGHT.key} stopOpacity={0} />
          <stop offset="1" stopColor={LIGHT.key} stopOpacity={0.3} />
        </linearGradient>
        <linearGradient id={id('dark')} x1="-460" y1="0" x2="360" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2A2860" stopOpacity={0.6} />
          <stop offset="0.5" stopColor="#2A2860" stopOpacity={0} />
        </linearGradient>
        <linearGradient id={id('para')} x1="0" y1="330" x2="0" y2="740" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#15163A" stopOpacity={0} />
          <stop offset="1" stopColor="#15163A" stopOpacity={0.75} />
        </linearGradient>
        <mask id={id('sil')} maskUnits="userSpaceOnUse" x={-2000} y={-2000} width={4000} height={4000}>
          <g fill="#FFF">
            <path d={torsoD} />
            <path d={hoodBackD} />
            <path d={neckD} />
            <g transform={H}>
              <path d={faceD} />
              <path d={earD} />
              {hairAll.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </g>
          </g>
        </mask>
      </defs>

      {/* ============ BODY ============ */}
      <path d={torsoD} fill={C.hoodie.base} />
      <Clip id={id('ct')} d={torsoD}>
        <path d={curve(SH_BODY)} fill={C.hoodie.shade} />
        <path d={ink([[-318, 430], [-266, 470], [-206, 536]], 22, {a: 0.6, b: 0.25})} fill={C.hoodie.shade} />
        <path d={ink([[-300, 560], [-262, 600], [-232, 660]], 16, {a: 0.6, b: 0.3})} fill={C.hoodie.shade} />
        <path d={ink([[244, 380], [266, 450], [276, 540]], 18, {a: 0.5, b: 0.3})} fill={C.hoodie.shade} />
        {/* cast shadow of the hood roll */}
        <path d={hoodFrontD} transform="translate(-14 26)" fill={C.hoodie.deep} />
        <path d={curve([[170, 274], [262, 310], [306, 378], [318, 448], [290, 398], [240, 328]])} fill={C.hoodie.hi} filter={`url(#${id('soft')})`} opacity={0.9} />
      </Clip>
      <path d={hoodBackD} fill={C.hoodie.base} />
      <Clip id={id('chb')} d={hoodBackD}>
        <path d={curve(SH_HOODBACK)} fill={C.hoodie.shade} />
      </Clip>
      <path d={L(sub(HOOD_BACK, 0, 4), 3.6, {a: 0.2, b: 0.4})} fill={C.hoodie.line} />

      {/* neck */}
      <path d={neckD} fill={C.skin.base} />
      <Clip id={id('cn')} d={neckD}>
        <path d={curve([[-160, 0], [26, 0], [32, 170], [40, 226], [50, 270], [60, 330], [-160, 330]])} fill={C.skin.shade} />
        <path d={faceD} transform={`translate(-10 30) ${H}`} fill={C.skin.deep} />
      </Clip>
      <path d={L([[56, 176], [62, 210], [68, 246], [76, 280]], 2.6, {a: 0.3, b: 0.3})} fill={C.skinLine} />
      <path d={L([[-108, 120], [-116, 170], [-124, 214]], 3.2, {a: 0.3, b: 0.4})} fill={C.skinLine} />
      <Rim id={id('rn')} shapes={[neckD]} dx={5} dy={0} color={LIGHT.key} opacity={0.85 * lt} />

      {/* hood front roll + drawstrings */}
      <path d={hoodFrontD} fill={C.hoodie.base} />
      <Clip id={id('chf')} d={hoodFrontD}>
        <path d={curve([[-200, 198], [-40, 228], [20, 278], [40, 358], [-200, 358]])} fill={C.hoodie.shade} />
        <path d={curve([[120, 278], [200, 274], [226, 278], [180, 302], [110, 314]])} fill={C.hoodie.hi} filter={`url(#${id('soft')})`} />
      </Clip>
      <path d={L(HOOD_FRONT_OUT, 3.8, {a: 0.15, b: 0.3, press: [1.2, 1.1, 1, 0.85, 0.7]})} fill={C.hoodie.line} />
      <path d={L(HOOD_FRONT_IN.slice(1), 2.6, {a: 0.3, b: 0.3})} fill={C.hoodie.line} />
      <path d={L([[-70, 278], [-6, 304], [60, 318]], 1.8, {a: 0.4, b: 0.4})} fill={C.hoodie.line} opacity={0.7} />
      {([
        [[26, 322], [22 + strX * 0.5, 370], [18 + strX, 418], [16 + strX * 1.2, 456]],
        [[104, 324], [108 + strX * 0.5, 370], [112 + strX, 410], [114 + strX * 1.2, 440]],
      ] as Pt[][]).map((pts, i) => {
        const end = pts[3];
        const ag: Pt[] = [end, [end[0] - 0.5, end[1] + 26]];
        return (
          <g key={i}>
            <path d={ink(pts, 9.5 * Math.max(0.8, k), {a: 0.02, b: 0.02, tip: 0.6})} fill={C.string.line} />
            <path d={ink(pts, 5.6, {a: 0.02, b: 0.06, tip: 0.7})} fill={i === 0 ? C.string.base : '#C9CCD8'} />
            <path d={ink(ag, 12.5 * Math.max(0.8, k), {a: 0.01, b: 0.01, tip: 0.9})} fill={C.string.line} />
            <path d={ink(ag, 8, {a: 0.01, b: 0.01, tip: 0.9})} fill="#9EA3B6" />
            <circle cx={pts[0][0]} cy={pts[0][1] - 2} r={6} fill={C.hoodie.deep} />
          </g>
        );
      })}

      {/* torso contour + folds */}
      <path d={L(sub(TORSO, 0, 7), 4.6, {a: 0.1, b: 0.02, press: [0.8, 1, 1.15, 1.2]})} fill={C.hoodie.line} />
      <path d={L(sub(TORSO, 8, 14), 3.2, {a: 0.02, b: 0.25, press: [1, 0.9, 0.7, 0.6]})} fill={C.hoodie.line} />
      <path d={L([[-196, 250], [-262, 320], [-318, 410], [-350, 520]], 2.6, {a: 0.2, b: 0.5})} fill={C.hoodie.line} opacity={0.9} />
      <path d={L([[-304, 444], [-240, 484], [-200, 534]], 2.4, {a: 0.3, b: 0.5})} fill={C.hoodie.line} />
      <path d={L([[250, 396], [270, 462], [276, 524]], 2.2, {a: 0.3, b: 0.5})} fill={C.hoodie.line} />
      <path d={L([[-362, 548], [-352, 608], [-358, 678]], 2, {a: 0.4, b: 0.4})} fill={C.hoodie.line} opacity={0.8} />
      <Rim id={id('rb')} shapes={[torsoD, hoodFrontD, neckD, hoodBackD]} dx={8} dy={0} color={LIGHT.key} opacity={0.9 * lt} />
      <Rim id={id('rbb')} shapes={[torsoD, hoodBackD, neckD, hoodFrontD]} dx={-6} dy={-3} color={LIGHT.back} opacity={0.55} />

      {/* ============ HEAD ============ */}
      <g transform={H}>
        <path d={faceD} fill={C.skin.base} />
        <Clip id={id('cf')} d={faceD}>
          <path d={curve(SH_FACE)} fill={C.skin.shade} />
          <path d={curve(SH_NOSE)} fill={C.skin.shade} />
          <path d={curve(SH_SOCKET)} fill={C.skin.shade} opacity={0.45} />
          {/* bangs cast a hard shadow on the forehead */}
          <g transform="translate(-10 16)" fill={C.skin.shade}>
            {hairAll.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          {/* soft 1-step highlights */}
          <g filter={`url(#${id('soft')})`} fill={C.skin.hi}>
            <path d={ell(140, 22, 12, 24, 12)} />
            <path d={ell(143, 58, 6, 9)} />
            <path d={ell(104, 162, 12, 6)} />
          </g>
          <path d={ell(152, 20, 10, 40)} fill={LIGHT.key} opacity={0.35 * lt} filter={`url(#${id('soft2')})`} />
        </Clip>
        {/* ear, in shadow */}
        <path d={earD} fill={C.skin.shade} />
        <Clip id={id('ce')} d={earD}>
          <path d={curve([[-84, -4], [-100, -4], [-105, 16], [-98, 38], [-86, 44], [-92, 20]])} fill={C.skin.deep} />
        </Clip>
        <path d={L(sub(EAR, 0, 6), 3.2, {a: 0.25, b: 0.25})} fill={C.skinLine} />
        <path d={L([[-80, -4], [-98, -6], [-103, 14], [-97, 34], [-87, 40]], 1.8, {a: 0.3, b: 0.3})} fill={C.skinLineSoft} />

        {/* face contour: thin on the lit side, heavier under the jaw */}
        <path d={L(sub(FACE, 6, 14), 2.8, {a: 0.25, b: 0.05, press: [0.8, 0.7, 0.8, 1]})} fill={C.skinLine} />
        <path d={L(sub(FACE, 14, 20), 3.6, {a: 0.05, b: 0.3, press: [1, 1.2, 1.1, 0.9]})} fill={C.skinLine} />

        {/* eyes */}
        <Eye id={id('e1')} spec={EYE_NEAR} c={C.eye} lookX={lookX} lookY={lookY} lid={lid} k={k} light={lt} />
        <Eye id={id('e2')} spec={EYE_FAR} c={C.eye} lookX={lookX} lookY={lookY} lid={lid} k={k} light={lt} />
        {/* brows: blunt inner end, long taper out */}
        <path d={L(browNear, 7.4, {a: 0.04, b: 0.65, tip: 0.1, press: [1.1, 1, 0.8, 0.6]})} fill={C.brow} />
        <path d={L(browFar, 6, {a: 0.04, b: 0.55, tip: 0.1, press: [1.1, 1, 0.8]})} fill={C.brow} />
        {/* nose */}
        <path d={L([[134, 40], [149, 70], [143, 82]], 2.8, {a: 0.4, b: 0.25})} fill={C.skinLine} />
        <path d={L([[126, 87], [137, 89]], 2.4, {a: 0.3, b: 0.3})} fill={C.skinLine} />
        {/* mouth */}
        <MouthDraw id={id('m')} shape={mouth} spec={MOUTH} c={C.mouth} k={k} />
        {mouth === 'rest' || mouth === 'smile' ? <path d={L([[70, 113], [73, 121]], 1.6, {a: 0.4, b: 0.4})} fill={C.mouth.lineSoft} /> : null}
        <path d={L([[88, 138], [104, 141], [116, 137]], 1.6, {a: 0.4, b: 0.4})} fill={C.skinLineSoft} opacity={0.75} />

        {/* ---- hair ---- */}
        <path d={cowD} fill={C.hair.base} />
        <path d={massD} fill={C.hair.base} />
        <Clip id={id('chm')} d={[massD, cowD]}>
          <path d={curve(SH_MASS)} fill={C.hair.shade} />
          <path d={curve(SH_HAIR)} fill={C.hair.shade} />
          <path d={ink(bend([[70, -318], [120, -336], [168, -332], [198, -310]], [64, -266], hairX * 1.8, hairY * 1.5, 160), 8, {a: 0.4, b: 0.5, tip: 0})} fill={LIGHT.key} opacity={0.7 * lt} />
          {shineBand(
            [
              {pts: [[-84, -250], [-40, -262], [10, -264]], w: 11, teeth: [0.5], color: C.hair.shine, op: 0.3},
              {pts: [[36, -258], [100, -240], [158, -196]], w: 12, teeth: [0.18, 0.4, 0.62, 0.84], color: LIGHT.key, op: 0.72 * Math.min(1.2, lt)},
            ],
            hairX * 0.2,
          )}
        </Clip>
        {massChains.map((ch, i) => (
          <path key={i} d={L(ch, 3.3, {a: 0.3, b: 0.3, tip: 0.05})} fill={C.hair.line} />
        ))}
        <path d={L([[-58, -112], [-58, -72], [-62, -14]], 2.8, {a: 0.4, b: 0.1})} fill={C.hair.line} />
        {STRANDS.map((s, i) => (
          <path key={`s${i}`} d={L(s, 2.1, {a: 0.12, b: 0.7})} fill={C.hair.line} opacity={0.8} />
        ))}
        {locks.map((l, i) => (
          <g key={`l${i}`}>
            <path d={lockD[i]} fill={C.hair.base} />
            <Clip id={id(`lk${i}`)} d={lockD[i]}>
              <path d={curve(SH_HAIR)} fill={C.hair.shade} />
            </Clip>
            <Rim id={id(`lks${i}`)} shapes={[lockD[i]]} dx={-8} dy={4} color={C.hair.shade} opacity={0.9} />
            {lockLines(l, 3, k).map((d, j) => (
              <path key={j} d={d} fill={C.hair.line} />
            ))}
          </g>
        ))}
        <path d={L(swayTips([[56, -176], [76, -130], [84, -84, 1]], hairX * 0.6, 0), 1.9, {a: 0.1, b: 0.6})} fill={C.hair.line} opacity={0.8} />
        {[sub(cow, 0, 5), sub(cow, 5, 8), sub(cow, 8, 11)].map((ch, i) => (
          <path key={`c${i}`} d={L(ch, i === 1 ? 2.4 : 3, {a: i === 0 ? 0.5 : 0.2, b: i === 2 ? 0.55 : 0.2, tip: 0.05})} fill={C.hair.line} />
        ))}
        <path d={L(bend([[118, -306], [150, -322], [180, -314]], [64, -266], hairX * 1.8, hairY * 1.5, 160), 1.8, {a: 0.3, b: 0.5})} fill={C.hair.line} opacity={0.8} />

        <Rim id={id('rh')} shapes={[faceD, ...hairAll]} dx={rx} dy={ry} color={LIGHT.key} opacity={0.95 * lt} />
        <Rim id={id('rhb')} shapes={[massD, cowD, earD]} dx={bx} dy={by} color={LIGHT.back} opacity={0.5} />
      </g>

      {/* compositing (satsuei): light wrap + side darkening + bottom para, clipped to the character */}
      <rect mask={`url(#${id('sil')})`} x={-600} y={-500} width={1200} height={1400} fill="#9CA2D8" opacity={night} style={{mixBlendMode: 'multiply'}} />
      <rect mask={`url(#${id('sil')})`} x={-600} y={-500} width={1200} height={1300} fill={`url(#${id('wrap')})`} style={{mixBlendMode: 'screen'}} opacity={Math.min(1.2, 0.4 + 0.6 * lt)} />
      <rect mask={`url(#${id('sil')})`} x={-600} y={-500} width={1200} height={1300} fill={`url(#${id('dark')})`} style={{mixBlendMode: 'multiply'}} />
      <rect mask={`url(#${id('sil')})`} x={-600} y={300} width={1200} height={500} fill={`url(#${id('para')})`} style={{mixBlendMode: 'multiply'}} />
    </g>
  );
};

export const MAS_BOX: [number, number, number, number] = [-470, -350, 830, 1090];
