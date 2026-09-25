import React from 'react';
import {AnimeRig, Clip, Eye, EyeSpec, MouthDraw, MouthSpec, Rim, SoftDef} from './cel';
import {bend, chains, curve, ell, ink, Pt, sub, swayTips, unrotate} from './ink';
import {shineBand} from './hair';
import {LIGHT, NOLE_C as C} from './palette';

/**
 * ANIME NOLE — bust, 3/4 facing screen-right. Tall, broad (shoulders ~2.6 head-widths), strong square
 * jaw, swept-back dark hair, black tee, phone in his near hand lighting his face from below.
 * Caricature lives in: the square jaw + the smirk + the phone. Local units match Mas (chin ~y188).
 * Neck pivot (14, 160).
 */

const FACE: Pt[] = [
  [-190, -40], [-184, -150], [-128, -224], [-24, -248], [80, -234], [144, -186], [164, -120], [167, -58],
  [159, -16, 1], [169, 22], [167, 62], [162, 104], [153, 138], [142, 166, 1], [120, 184], [84, 191, 1],
  [34, 180], [-28, 156], [-74, 128, 1], [-88, 74], [-132, 24], [-178, 20],
];
const EAR: Pt[] = [[-80, -18], [-102, -28], [-122, -10], [-126, 22], [-117, 52], [-99, 68], [-82, 60]];
const NECK: Pt[] = [[-116, 40], [70, 130], [86, 180], [96, 216], [106, 250], [118, 284], [30, 290], [-70, 270], [-172, 244], [-160, 190], [-138, 140]];

const MASS: Pt[] = [
  [-140, 30, 1], [-166, 4], [-198, 14, 1], [-214, -30], [-240, -46, 1], [-228, -100], [-246, -130, 1], [-230, -170], [-250, -196, 1],
  [-206, -236], [-150, -272], [-94, -290, 1], [-40, -306], [18, -314], [60, -304, 1], [110, -304], [158, -276], [186, -236], [184, -188, 1], [160, -174],
  [120, -164], [60, -160], [10, -150], [-30, -130], [-56, -98], [-64, -40], [-70, -6, 1], [-88, -50], [-110, -48],
  [-128, -16, 1], [-134, 12],
];
const FRONT_IDX = 18;
// combed-back strand lines, front -> back
const STRANDS: Pt[][] = [
  [[162, -182], [120, -246], [30, -286], [-70, -278]],
  [[112, -168], [70, -222], [-10, -256], [-120, -244]],
  [[52, -160], [8, -202], [-76, -226], [-176, -204]],
  [[-4, -148], [-56, -176], [-146, -180], [-222, -140]],
  [[-40, -120], [-100, -130], [-176, -110], [-236, -70]],
];
const LOOSE: Pt[] = [[96, -168], [126, -146], [142, -112], [144, -84, 1], [130, -112], [108, -142], [84, -160]];
const SH_HAIR: Pt[] = [
  [-320, 120], [-320, -360], [-60, -360], [-40, -316], [0, -294, 1], [-24, -282], [-14, -256], [40, -236, 1], [2, -226],
  [8, -200], [56, -186, 1], [16, -176], [4, -150], [-30, -110], [-44, 0], [-60, 120],
];

const SH_FACE: Pt[] = [[-230, -260], [-20, -260], [-36, -150], [-44, -64], [-40, 10], [-24, 70], [8, 118], [52, 156], [110, 206], [110, 280], [-230, 280]];
const SH_NOSE: Pt[] = [[140, 50, 1], [152, 76], [150, 90, 1], [130, 93, 1], [140, 78]];
const SH_BROW: Pt[] = [[60, -40, 1], [96, -30], [104, 6, 1], [86, -8]];
const SH_CHIN: Pt[] = [[70, 162], [110, 160], [136, 170], [120, 186], [80, 190]];

const EYE_NEAR: EyeSpec = {
  upper: [[-18, -4], [-6, -16], [12, -24], [34, -25], [48, -17], [55, -6]],
  lower: [[-14, 2], [2, 8], [24, 11], [42, 8], [54, -1]],
  closed: [[-18, 1], [-6, 6], [14, 9], [34, 9], [48, 4], [55, -2]],
  iris: {cx: 22, cy: -8, rx: 11.5, ry: 13.5, rangeX: 13, rangeY: 4},
  lash: 6,
  lashPress: [1.3, 1.15, 1, 0.8, 0.55],
  lowerSpan: [0, 3],
  crease: [[-8, -26], [12, -34], [36, -34], [52, -24]],
  bag: [[0, 20], [20, 23], [40, 18]],
  flick: [[-17, -4], [-26, -1], [-31, 4]],
};
const EYE_FAR: EyeSpec = {
  upper: [[160, -10], [153, -19], [139, -24], [125, -19], [116, -7]],
  lower: [[158, -2], [148, 5], [132, 6], [118, -2]],
  closed: [[160, -4], [152, 3], [138, 6], [125, 3], [116, -3]],
  iris: {cx: 139, cy: -10, rx: 7, ry: 12.5, rangeX: 7, rangeY: 3.5},
  lash: 5.2,
  lashPress: [1.25, 1.05, 0.9, 0.6],
  lowerSpan: [0, 2],
  crease: [[122, -30], [140, -34], [156, -27]],
  flick: [[160, -9], [166, -6], [169, -1]],
};
// Nole's rest IS the smirk (far corner up); 'smile' = full grin.
const MOUTH: MouthSpec = {
  rest: [[72, 130], [92, 133], [114, 130], [134, 119]],
  smile: [[70, 124], [92, 133], [116, 131], [138, 114]],
  M: [[74, 131], [96, 133], [116, 132], [132, 126]],
  E: [
    [[70, 126], [92, 125], [116, 124], [134, 117]],
    [[70, 126], [90, 139], [116, 140], [134, 117]],
  ],
  A: [
    [[76, 125], [96, 122], [118, 122], [132, 118]],
    [[76, 125], [92, 154], [116, 155], [132, 118]],
  ],
  O: [[88, 132], [92, 122], [106, 119], [117, 124], [120, 135], [110, 148], [96, 147]],
};

// body: broad shoulders, black crew-neck tee
const TORSO: Pt[] = [
  [-150, 218], [-260, 244], [-364, 276], [-432, 300], [-482, 336], [-506, 400], [-516, 500], [-526, 1000, 1],
  [420, 1000, 1], [406, 540], [394, 440], [370, 368], [318, 306], [220, 272], [118, 256],
];
const COLLAR_OUT: Pt[] = [[-172, 222], [-104, 258], [-20, 284], [62, 294], [134, 284], [196, 256]];
const COLLAR_IN: Pt[] = [[176, 252], [124, 272], [58, 280], [-16, 270], [-94, 246], [-150, 216]];
const SH_BODY: Pt[] = [[-560, 230], [-340, 270], [-356, 340], [-372, 430], [-380, 540], [-376, 1040], [-560, 1040]];
const SH_PEC: Pt[] = [[-300, 486], [-160, 506], [-20, 510], [120, 496], [250, 476], [330, 478], [300, 500], [200, 516], [40, 530], [-120, 530], [-280, 512]];
// forearm + fist + phone (his right hand, near side)
const ARM: Pt[] = [[-330, 820, 1], [-270, 680], [-200, 574], [-124, 496], [-76, 464], [-30, 520], [-36, 574], [-80, 650], [-126, 740], [-156, 820, 1]];
// back of the hand + four curled fingers stacked (index on top), knuckles to the right
const FIST: Pt[] = [[-84, 474], [-44, 444], [0, 436], [4, 580], [-40, 576], [-80, 540]];
const FINGERS: Pt[][] = [
  [[-2, 440], [56, 434], [90, 446], [98, 464], [86, 478], [30, 480], [-2, 476]],
  [[-4, 476], [56, 476], [94, 482], [101, 500], [88, 513], [28, 515], [-4, 511]],
  [[-6, 511], [50, 512], [86, 518], [91, 534], [78, 546], [22, 548], [-6, 545]],
  [[-8, 545], [38, 546], [68, 552], [71, 566], [60, 575], [14, 577], [-8, 574]],
];
const THUMB: Pt[] = [[-46, 450], [-2, 426], [48, 414], [84, 418, 1], [60, 432], [14, 448]];
const PHONE: Pt[] = [[-6, 452, 1], [44, 272, 1], [124, 294, 1], [76, 474, 1]];

export const AnimeNole: React.FC<AnimeRig & {phoneGlow?: number}> = (p) => {
  const {lookX = 0.2, lookY = 0.1, lid = 0.24, mouth = 'rest', brow = 0, tilt = 0, hairX = 0, hairY = 0, light = 1, ink: k = 1, uid = 'nole', phoneGlow = 1, night = 0.5} = p;
  const id = (s: string) => `${uid}-${s}`;
  const H = `rotate(${tilt} 14 160)`;
  const L = (pts: readonly Pt[], w: number, o?: Parameters<typeof ink>[2]) => ink(pts, w * k, o);
  const lt = Math.max(0, light);
  const pg = Math.max(0, phoneGlow);

  const mass = swayTips(MASS, hairX * 0.4, hairY * 0.3, 0.25);
  const loose = bend(LOOSE, [124, -166], hairX * 1.6, hairY * 1.2, 70);
  const faceD = curve(FACE);
  const massD = curve(mass);
  const looseD = curve(loose);
  const earD = curve(EAR);
  const neckD = curve(NECK);
  const torsoD = curve(TORSO);
  const collarD = curve([...COLLAR_OUT, ...COLLAR_IN]);
  const armD = curve(ARM);
  const fistD = curve(FIST);
  const thumbD = curve(THUMB);
  const phoneD = curve(PHONE);
  const hairAll = [massD, looseD];

  const b = brow * 7;
  const knit = Math.min(0, brow) * 4;
  const browNear: Pt[] = [[62, -34 - b + knit * -1.2], [38, -44 - b], [8, -46 - b * 0.9], [-20, -36 - b * 0.6]];
  const browFar: Pt[] = [[114, -38 - b + knit * -1.2], [134, -46 - b * 1.3], [154, -45 - b * 1.2], [170, -34 - b * 0.8]];
  const [rx, ry] = unrotate(5.5, 0, tilt);
  const [bx, by] = unrotate(-5, 0, tilt);
  const massChains = chains(mass).filter((ch) => !(ch[0][0] === mass[FRONT_IDX][0] && ch[0][1] === mass[FRONT_IDX][1]));

  return (
    <g>
      <defs>
        <SoftDef id={id('soft')} r={6} />
        <SoftDef id={id('soft2')} r={14} />
        <SoftDef id={id('bloom')} r={22} />
        <linearGradient id={id('wrap')} x1="-520" y1="0" x2="420" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0.55" stopColor={LIGHT.key} stopOpacity={0} />
          <stop offset="1" stopColor={LIGHT.key} stopOpacity={0.28} />
        </linearGradient>
        <linearGradient id={id('dark')} x1="-520" y1="0" x2="420" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2A2860" stopOpacity={0.6} />
          <stop offset="0.5" stopColor="#2A2860" stopOpacity={0} />
        </linearGradient>
        <linearGradient id={id('para')} x1="0" y1="360" x2="0" y2="760" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#15163A" stopOpacity={0} />
          <stop offset="1" stopColor="#15163A" stopOpacity={0.7} />
        </linearGradient>
        <radialGradient id={id('phoneL')} cx="80" cy="300" r="420" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={LIGHT.phone} stopOpacity={0.55} />
          <stop offset="0.45" stopColor={LIGHT.phone} stopOpacity={0.16} />
          <stop offset="1" stopColor={LIGHT.phone} stopOpacity={0} />
        </radialGradient>
        <mask id={id('sil')} maskUnits="userSpaceOnUse" x={-2000} y={-2000} width={4000} height={4000}>
          <g fill="#FFF">
            <path d={torsoD} />
            <path d={neckD} />
            <path d={armD} />
            <path d={fistD} />
            {FINGERS.map((f, i) => (
              <path key={i} d={curve(f)} />
            ))}
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

      {/* ============ BODY: black tee ============ */}
      <path d={torsoD} fill={C.tee.base} />
      <Clip id={id('ct')} d={torsoD}>
        <path d={curve(SH_BODY)} fill={C.tee.shade} />
        <path d={curve(SH_PEC)} fill={C.tee.shade} opacity={0.45} filter={`url(#${id('soft')})`} />
        <path d={ink([[-300, 330], [-250, 400], [-222, 470]], 20, {a: 0.5, b: 0.4})} fill={C.tee.shade} />
        <path d={ink([[300, 360], [330, 440], [344, 520]], 20, {a: 0.5, b: 0.3})} fill={C.tee.shade} />
        <path d={curve([[200, 290], [320, 330], [370, 400], [388, 470], [350, 420], [290, 350]])} fill={C.tee.hi} filter={`url(#${id('soft')})`} opacity={0.8} />
        {/* phone spill on the chest */}
        <path d={ell(70, 330, 150, 90)} fill={LIGHT.phone} opacity={0.14 * pg} filter={`url(#${id('soft2')})`} />
      </Clip>
      {/* neck */}
      <path d={neckD} fill={C.skin.base} />
      <Clip id={id('cn')} d={neckD}>
        <path d={curve([[-180, 0], [36, 0], [44, 180], [52, 230], [64, 270], [74, 320], [-180, 320]])} fill={C.skin.shade} />
        <path d={faceD} transform={`translate(-10 28) ${H}`} fill={C.skin.deep} />
        <path d={ell(70, 250, 70, 50)} fill={LIGHT.phone} opacity={0.3 * pg} filter={`url(#${id('soft2')})`} />
      </Clip>
      <path d={L([[72, 190], [80, 226], [88, 262], [96, 292]], 2.8, {a: 0.3, b: 0.3})} fill={C.skinLine} />
      <path d={L([[-126, 130], [-138, 190], [-150, 240]], 3.4, {a: 0.3, b: 0.4})} fill={C.skinLine} />
      <path d={L([[40, 214], [58, 230], [66, 250]], 1.8, {a: 0.4, b: 0.4})} fill={C.skinLineSoft} opacity={0.7} />
      {/* collar rib */}
      <path d={collarD} fill={C.tee.base} />
      <Clip id={id('cc')} d={collarD}>
        <path d={curve([[-200, 200], [-20, 240], [30, 330], [-200, 330]])} fill={C.tee.shade} />
      </Clip>
      <path d={L(COLLAR_OUT, 3.4, {a: 0.15, b: 0.3})} fill={C.tee.line} />
      <path d={L(COLLAR_IN.slice(1), 2.6, {a: 0.3, b: 0.3})} fill={C.tee.line} />
      {/* torso contour + folds */}
      <path d={L(sub(TORSO, 0, 6), 5, {a: 0.1, b: 0.02, press: [0.8, 1, 1.15, 1.2]})} fill={C.tee.line} />
      <path d={L(sub(TORSO, 7, 13), 3.4, {a: 0.02, b: 0.25, press: [1, 0.9, 0.7, 0.6]})} fill={C.tee.line} />
      <path d={L([[-300, 330], [-252, 400], [-226, 470]], 2.4, {a: 0.3, b: 0.5})} fill={C.tee.line} />
      <path d={L([[-432, 300], [-446, 360], [-470, 420], [-500, 452]], 2.4, {a: 0.2, b: 0.4})} fill={C.tee.line} opacity={0.9} />
      <path d={L([[318, 306], [334, 360], [352, 410]], 2, {a: 0.3, b: 0.5})} fill={C.tee.line} opacity={0.8} />
      <path d={L([[-200, 506], [-40, 512], [120, 498], [240, 480]], 1.8, {a: 0.4, b: 0.4})} fill={C.tee.line} opacity={0.6} />
      <Rim id={id('rb')} shapes={[torsoD, neckD, collarD]} dx={9} dy={0} color={LIGHT.key} opacity={0.9 * lt} />
      <Rim id={id('rbb')} shapes={[torsoD, neckD, collarD]} dx={-9} dy={-4} color={LIGHT.back} opacity={0.7} />
      {/* window light on the near shoulder / back */}
      <Clip id={id('cwin')} d={torsoD}>
        <path d={curve([[-520, 300], [-420, 290], [-330, 300], [-380, 340], [-470, 380], [-520, 430]])} fill={LIGHT.back} opacity={0.28} filter={`url(#${id('soft2')})`} />
      </Clip>

      {/* ============ HEAD ============ */}
      <g transform={H}>
        <path d={faceD} fill={C.skin.base} />
        <Clip id={id('cf')} d={faceD}>
          <path d={curve(SH_FACE)} fill={C.skin.shade} />
          <path d={curve(SH_NOSE)} fill={C.skin.shade} />
          <path d={curve(SH_BROW)} fill={C.skin.shade} opacity={0.5} />
          <g transform="translate(-10 16)" fill={C.skin.shade}>
            {hairAll.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          <g filter={`url(#${id('soft')})`} fill={C.skin.hi}>
            <path d={ell(146, 24, 12, 26, 12)} />
            <path d={ell(150, 60, 6, 10)} />
            <path d={ell(120, -118, 20, 9)} opacity={0.5} />
          </g>
          {/* phone underlight: warm-white on the planes facing down/forward */}
          <path d={curve(SH_CHIN)} fill={LIGHT.phone} opacity={0.5 * pg} filter={`url(#${id('soft')})`} />
          <rect x={-300} y={-300} width={600} height={600} fill={`url(#${id('phoneL')})`} opacity={0.7 * pg} style={{mixBlendMode: 'screen'}} />
          <path d={ell(158, 22, 10, 42)} fill={LIGHT.key} opacity={0.35 * lt} filter={`url(#${id('soft2')})`} />
        </Clip>
        <path d={earD} fill={C.skin.shade} />
        <Clip id={id('ce')} d={earD}>
          <path d={curve([[-92, -8], [-110, -8], [-116, 14], [-108, 38], [-96, 44], [-102, 20]])} fill={C.skin.deep} />
        </Clip>
        <path d={L(sub(EAR, 0, 6), 3.4, {a: 0.25, b: 0.25})} fill={C.skinLine} />
        <path d={L([[-90, -8], [-108, -10], [-114, 12], [-107, 34], [-97, 40]], 1.9, {a: 0.3, b: 0.3})} fill={C.skinLineSoft} />
        <path d={L(sub(FACE, 6, 15), 2.9, {a: 0.25, b: 0.05, press: [0.8, 0.7, 0.8, 1, 1.1]})} fill={C.skinLine} />
        <path d={L(sub(FACE, 15, 20), 3.9, {a: 0.05, b: 0.3, press: [1, 1.2, 1.1, 0.9]})} fill={C.skinLine} />
        {/* chin plane line (square jaw) */}
        <path d={L([[92, 170], [116, 172], [134, 164]], 1.6, {a: 0.4, b: 0.4})} fill={C.skinLineSoft} opacity={0.7} />

        <Eye id={id('e1')} spec={EYE_NEAR} c={C.eye} lookX={lookX} lookY={lookY} lid={lid} k={k} light={lt} />
        <Eye id={id('e2')} spec={EYE_FAR} c={C.eye} lookX={lookX} lookY={lookY} lid={lid} k={k} light={lt} />
        <path d={L(browNear, 9, {a: 0.04, b: 0.6, tip: 0.12, press: [1.1, 1, 0.85, 0.6]})} fill={C.brow} />
        <path d={L(browFar, 7.4, {a: 0.04, b: 0.5, tip: 0.12, press: [1.1, 1, 0.85]})} fill={C.brow} />
        {/* nose: longer, straighter bridge */}
        <path d={L([[118, -8], [132, 30], [158, 74], [150, 88]], 2.9, {a: 0.6, b: 0.25})} fill={C.skinLine} />
        <path d={L([[132, 92], [145, 94]], 2.5, {a: 0.3, b: 0.3})} fill={C.skinLine} />
        <MouthDraw id={id('m')} shape={mouth} spec={MOUTH} c={C.mouth} k={k} />
        {/* smirk crease at the raised corner */}
        {(mouth === 'rest' || mouth === 'smile' || mouth === 'M') && <path d={L([[134, 108], [141, 117], [139, 128]], 1.8, {a: 0.4, b: 0.4})} fill={C.mouth.lineSoft} />}
        <path d={L([[88, 146], [106, 149], [120, 145]], 1.7, {a: 0.4, b: 0.4})} fill={C.skinLineSoft} opacity={0.75} />

        {/* hair: swept back */}
        <path d={massD} fill={C.hair.base} />
        <Clip id={id('ch')} d={massD}>
          <path d={curve(SH_HAIR)} fill={C.hair.shade} />
          {shineBand(
            [
              {pts: [[-96, -270], [-40, -290], [16, -296]], w: 10, teeth: [0.5], color: C.hair.shine, op: 0.35},
              {pts: [[40, -296], [110, -280], [168, -234]], w: 11, teeth: [0.2, 0.42, 0.66], color: LIGHT.key, op: 0.6 * Math.min(1.2, lt)},
            ],
            hairX * 0.2,
          )}
        </Clip>
        {massChains.map((ch, i) => (
          <path key={i} d={L(ch, 3.5, {a: 0.3, b: 0.3, tip: 0.05})} fill={C.hair.line} />
        ))}
        <path d={L([[184, -188], [160, -174], [120, -164], [60, -160], [10, -150], [-30, -130], [-56, -98]], 2.6, {a: 0.2, b: 0.3})} fill={C.hair.line} />
        <path d={L([[-56, -98], [-64, -40], [-70, -6]], 2.8, {a: 0.4, b: 0.1})} fill={C.hair.line} />
        {STRANDS.map((s, i) => (
          <path key={`s${i}`} d={L(s, 2.2, {a: 0.12, b: 0.6})} fill={C.hair.line} opacity={0.85} />
        ))}
        <path d={looseD} fill={C.hair.base} />
        {chains(loose).map((ch, i) => (
          <path key={`l${i}`} d={L(ch, 2.4, {a: 0.3, b: 0.3, tip: 0.05})} fill={C.hair.line} />
        ))}
        <Rim id={id('rh')} shapes={[faceD, ...hairAll]} dx={rx} dy={ry} color={LIGHT.key} opacity={0.95 * lt} />
        <Rim id={id('rhb')} shapes={[massD, earD]} dx={bx * 1.4} dy={by * 1.4 - 2} color={LIGHT.back} opacity={0.65} />
      </g>

      {/* ============ ARM + PHONE ============ */}
      <path d={armD} fill={C.skin.base} />
      <Clip id={id('ca')} d={armD}>
        <path d={curve([[-400, 900], [-250, 640], [-160, 560], [-96, 516], [-60, 530], [-80, 620], [-150, 900]])} fill={C.skin.shade} />
      </Clip>
      <path d={L(sub(ARM, 0, 4), 3.4, {a: 0.05, b: 0.2})} fill={C.skinLine} />
      <path d={L(sub(ARM, 6, 9), 4, {a: 0.2, b: 0.05})} fill={C.skinLine} />
      {/* phone (we see its back); screen faces him */}
      <path d={phoneD} transform="translate(8 -6)" fill={LIGHT.phone} opacity={0.9 * pg} />
      <path d={phoneD} fill={C.phone.body} />
      <path d={L([[44, 272], [124, 294]], 2.2, {a: 0.02, b: 0.02, tip: 0.8})} fill={C.phone.edge} />
      <path d={ell(58, 300, 9, 9)} fill={C.phone.lens} stroke={C.phone.edge} strokeWidth={2} />
      <path d={ell(80, 306, 9, 9)} fill={C.phone.lens} stroke={C.phone.edge} strokeWidth={2} />
      <path d={L(PHONE, 3.4, {a: 0.02, b: 0.02, tip: 0.9})} fill={C.tee.line} />
      <path d={ell(92, 270, 70, 34, 15)} fill={LIGHT.phone} opacity={0.35 * pg} filter={`url(#${id('bloom')})`} style={{mixBlendMode: 'screen'}} />
      {/* fist around the phone */}
      <path d={fistD} fill={C.skin.shade} />
      <path d={L(sub(FIST, 3, 5), 3.4, {a: 0.1, b: 0.1})} fill={C.skinLine} />
      {FINGERS.map((f, i) => {
        const d = curve(f);
        return (
          <g key={i}>
            <path d={d} fill={C.skin.base} />
            <Clip id={id(`fg${i}`)} d={d}>
              <path d={curve([[-40, 400], [30, 400], [36, 600], [-40, 600]])} fill={C.skin.shade} />
              <path d={ell(70, f[0][1] + 2, 40, 8)} fill={LIGHT.phone} opacity={(i === 0 ? 0.6 : 0.25) * pg} filter={`url(#${id('soft')})`} />
            </Clip>
            <path d={L([...f.slice(1), f[0]], 3, {a: 0.08, b: 0.3, press: [0.8, 1, 1.2, 1.1, 0.9]})} fill={C.skinLine} />
            <path d={L([[f[3][0] - 26, f[3][1] - 10], [f[3][0] - 22, f[3][1] + 6]], 1.5, {a: 0.4, b: 0.4})} fill={C.skinLineSoft} opacity={0.8} />
          </g>
        );
      })}
      <path d={thumbD} fill={C.skin.base} />
      <Clip id={id('cth')} d={thumbD}>
        <path d={curve([[-60, 440], [80, 410], [90, 440], [-60, 470]])} fill={LIGHT.phone} opacity={0.35 * pg} />
      </Clip>
      <path d={L(sub(THUMB, 0, 5), 2.8, {a: 0.1, b: 0.1})} fill={C.skinLine} />
      <Rim id={id('ra')} shapes={[armD, fistD, thumbD, ...FINGERS.map((f) => curve(f))]} dx={4} dy={-7} color={LIGHT.phone} opacity={0.8 * pg} />

      {/* compositing */}
      <rect mask={`url(#${id('sil')})`} x={-700} y={-500} width={1400} height={1600} fill="#9CA2D8" opacity={night} style={{mixBlendMode: 'multiply'}} />
      <rect mask={`url(#${id('sil')})`} x={-700} y={-500} width={1400} height={1300} fill={`url(#${id('wrap')})`} style={{mixBlendMode: 'screen'}} opacity={Math.min(1.2, 0.4 + 0.6 * lt)} />
      <rect mask={`url(#${id('sil')})`} x={-700} y={-500} width={1400} height={1300} fill={`url(#${id('dark')})`} style={{mixBlendMode: 'multiply'}} />
      <rect mask={`url(#${id('sil')})`} x={-700} y={330} width={1400} height={800} fill={`url(#${id('para')})`} style={{mixBlendMode: 'multiply'}} />
    </g>
  );
};

export const NOLE_BOX: [number, number, number, number] = [-540, -360, 970, 1120];
