// MAS — drawn angle A: 3/4 view facing screen-left (at his monitor).
// Local units: crown ≈ y-248, chin ≈ y212, eye line ≈ y-8. Neck continues to y≈440 (hidden by hood collar).
// Skin, hair and ear are a PAINTED NORMAL PASS lit by the shot's LightRig (see lit.tsx); eyes, lids, brows,
// lash lines, lips and cast shadows are painted on top.
import React from 'react';
import {P, spline as S, mix, clamp} from './geom';
import {Soft, Stroke, Clip, Bristle} from './paint';
import {Lit, LightRig, N} from './lit';
import {Pl, Dome, EdgeBand, Tube} from './planes';
import {PAL} from './palette';

export type MasMouth = 'rest' | 'smile' | 'S' | 'U' | 'P' | 'ER' | 'open';

export interface MasRig {
  blink?: number;
  lookX?: number;
  lookY?: number;
  lid?: number;
  smile?: number;
  mouth?: MasMouth;
  brow?: number;
  light: LightRig;
  /** debug: show the raw normal pass */
  normals?: boolean;
}

// ---------- silhouettes ----------
export const SKULL_A: P[] = [
  [-60, -222], [-106, -190], [-130, -150], [-143, -100], [-149, -60, 0.8], [-141, -34], [-136, -14], [-142, 12],
  [-147, 30], [-141, 60], [-130, 90], [-121, 112], [-118, 132], [-121, 152], [-121, 172], [-112, 194], [-92, 208],
  [-58, 212], [-14, 200], [30, 178], [66, 146], [88, 110], [100, 80], [128, 56], [160, 20], [178, -40], [178, -112],
  [150, -172], [92, -214], [14, -232],
];
const NECK_A: P[] = [
  [-70, 180], [-60, 230], [-58, 282], [-58, 336], [-60, 440], [146, 440], [142, 340], [134, 250], [126, 170], [116, 90], [40, 110],
];
const EAR_A: P[] = [
  [104, -14], [116, -28], [133, -24], [143, -2], [141, 30], [133, 56], [124, 76], [112, 80], [104, 70], [101, 48], [98, 22],
];

// ---------- eyes ----------
const NE_UP_OPEN: P[] = [[-62, -4], [-52, -17], [-35, -24], [-17, -22], [-3, -13]];
const NE_UP_SHUT: P[] = [[-62, -4], [-50, 1], [-33, 3], [-16, 0], [-3, -11]];
const NE_LO: P[] = [[-3, -13], [-15, -5], [-33, -1], [-51, 0], [-62, -4]];
const NE_IRIS = {x: -34, y: -10, rx: 10.5, ry: 13};
const FE_UP_OPEN: P[] = [[-104, -3], [-113, -14], [-127, -17], [-139, -10]];
const FE_UP_SHUT: P[] = [[-104, -3], [-114, 1], [-128, 0], [-139, -8]];
const FE_LO: P[] = [[-139, -10], [-127, -2], [-113, -1], [-104, -3]];
const FE_IRIS = {x: -122, y: -9, rx: 6, ry: 12.3};

const eyeOpen = (up: P[], lo: P[]) => S([...up, ...lo.slice(1, -1)], true);

const Eye: React.FC<{up: P[]; lo: P[]; iris: {x: number; y: number; rx: number; ry: number}; lookX: number; lookY: number; near: boolean; kl: number}> = ({
  up,
  lo,
  iris,
  lookX,
  lookY,
  near,
  kl,
}) => {
  const open = eyeOpen(up, lo);
  const ix = iris.x + lookX * (near ? 9 : 5);
  const iy = iris.y + lookY * 4;
  const w = near ? 1 : 0.6;
  const u0 = up[0], u1 = up[up.length - 1];
  return (
    <g>
      <Clip d={open}>
        <path d={open} fill={PAL.scleraShadow} />
        <g opacity={kl}>
          {/* sclera lit on the monitor side (screen-left of iris) */}
          <Soft d={S([[u0[0] - 6, u0[1] - 6], [ix, iy - 16], [ix + 4, iy + 10], [u0[0] + 2, u0[1] + 6]], true)} fill={PAL.sclera} r={4} op={0.95} />
          <Soft d={S([[ix, iy - 14], [u1[0] + 4, u1[1] - 8], [u1[0] + 2, u1[1] + 6], [ix, iy + 10]], true)} fill={PAL.sclera} r={5} op={0.45} />
        </g>
        {/* iris */}
        <ellipse cx={ix} cy={iy} rx={iris.rx} ry={iris.ry} fill={PAL.irisMas} />
        <g opacity={kl}>
          <Soft d={`M${ix - iris.rx * 0.2},${iy + iris.ry * 0.05} a${iris.rx * 0.75},${iris.ry * 0.7} 0 1,0 ${iris.rx * 1.1},0 a${iris.rx * 0.75},${iris.ry * 0.7} 0 1,0 ${-iris.rx * 1.1},0`} fill={PAL.irisMasLit} r={2} op={0.75} />
        </g>
        <ellipse cx={ix} cy={iy} rx={iris.rx} ry={iris.ry} fill="none" stroke="#0c1316" strokeWidth={1.8 * w} opacity={0.85} />
        <ellipse cx={ix + 0.5} cy={iy + 0.5} rx={iris.rx * 0.4} ry={iris.ry * 0.4} fill={PAL.pupil} />
        {/* upper lid shadow across the top of the eye */}
        <Soft d={S([...up.map((p) => [p[0], p[1] - 4] as P), ...up.slice().reverse().map((p) => [p[0], p[1] + 6] as P)], true)} fill="#081013" r={2.4} op={0.8} />
        {/* catchlight: the monitor, a small rectangle */}
        <g opacity={kl}>
          <rect x={ix - iris.rx * 0.75} y={iy - iris.ry * 0.45} width={near ? 5 : 2.8} height={near ? 4 : 3.6} rx={0.6} fill={PAL.cyanHot} opacity={0.95} />
        </g>
      </Clip>
      <Stroke pts={up} w={near ? 4.4 : 3} a={0.3} b={0.5} bias={0.62} fill="#070607" r={0.45} />
      <Stroke pts={lo} w={near ? 1.6 : 1.1} a={0.2} b={0.2} fill="#1b1d21" r={0.6} op={0.55} />
    </g>
  );
};

// ---------- mouth ----------
interface MouthShape {
  line: P[];
  upTop: P[];
  loBot: P[];
  open?: P[];
  teeth?: P[];
}
const MOUTH_REST: MouthShape = {
  line: [[-118, 124], [-106, 123.5], [-90, 125], [-75, 125.5], [-63, 123]],
  upTop: [[-118, 123], [-112, 116], [-107, 114], [-102, 116], [-96, 114], [-80, 118], [-63, 123]],
  loBot: [[-115, 127], [-106, 136], [-88, 138], [-72, 133], [-64, 125]],
};
const MOUTH_SMILE: MouthShape = {
  line: [[-118, 123], [-106, 123.5], [-90, 125], [-74, 123.8], [-61, 119]],
  upTop: [[-118, 122], [-112, 116], [-107, 114], [-102, 116], [-96, 114], [-79, 117], [-61, 119]],
  loBot: [[-115, 126], [-106, 135], [-88, 137], [-71, 131], [-62, 121]],
};
const MOUTH_S: MouthShape = {
  line: [[-118, 124], [-106, 124], [-90, 126], [-75, 126], [-63, 123]],
  upTop: [[-118, 122], [-112, 115], [-107, 113], [-102, 115], [-96, 113], [-80, 117], [-63, 122]],
  loBot: [[-115, 128], [-106, 139], [-88, 141], [-72, 136], [-64, 126]],
  open: [[-113, 123], [-100, 121], [-84, 122], [-70, 124], [-84, 128], [-100, 128]],
  teeth: [[-112, 122.5], [-100, 121], [-84, 122], [-72, 124], [-84, 126], [-100, 126]],
};
const MOUTH_U: MouthShape = {
  line: [[-114, 125], [-104, 124], [-92, 125], [-80, 125], [-72, 124]],
  upTop: [[-114, 123], [-110, 113], [-105, 110], [-100, 112], [-95, 111], [-83, 115], [-72, 123]],
  loBot: [[-113, 128], [-104, 139], [-90, 141], [-78, 136], [-73, 126]],
  open: [[-106, 124], [-98, 121], [-88, 122], [-80, 125], [-88, 129], [-98, 129]],
};
const MOUTH_ER: MouthShape = {
  line: [[-118, 125], [-106, 125], [-90, 127], [-75, 127], [-63, 124]],
  upTop: [[-118, 123], [-112, 115], [-107, 113], [-102, 115], [-96, 113], [-80, 117], [-63, 123]],
  loBot: [[-115, 130], [-106, 142], [-88, 144], [-72, 138], [-64, 127]],
  open: [[-114, 124], [-100, 122], [-84, 123], [-68, 125], [-84, 132], [-100, 132]],
  teeth: [[-113, 123.5], [-100, 122], [-84, 123], [-70, 125], [-84, 126.5], [-100, 126.5]],
};
const MOUTH_P: MouthShape = {
  line: [[-117, 125], [-106, 125], [-90, 126], [-75, 126], [-64, 124]],
  upTop: [[-117, 124], [-112, 117], [-107, 115], [-102, 117], [-96, 115], [-80, 119], [-64, 124]],
  loBot: [[-114, 128], [-106, 136], [-88, 137], [-72, 133], [-65, 126]],
};
const MOUTHS: Record<MasMouth, MouthShape> = {rest: MOUTH_REST, smile: MOUTH_SMILE, S: MOUTH_S, U: MOUTH_U, P: MOUTH_P, ER: MOUTH_ER, open: MOUTH_ER};

const Mouth: React.FC<{m: MouthShape; smile: number; kl: number}> = ({m: m0, smile, kl}) => {
  const m: MouthShape =
    smile > 0 && m0 === MOUTH_REST
      ? {line: mix(MOUTH_REST.line, MOUTH_SMILE.line, smile), upTop: mix(MOUTH_REST.upTop, MOUTH_SMILE.upTop, smile), loBot: mix(MOUTH_REST.loBot, MOUTH_SMILE.loBot, smile)}
      : m0;
  const upper = S([...m.upTop, ...m.line.slice().reverse().slice(1, -1)], true);
  const lower = S([m.line[0], ...m.loBot.slice(1, -1), m.line[m.line.length - 1], ...m.line.slice().reverse().slice(1, -1)], true);
  const c = m.line[m.line.length - 1];
  return (
    <g>
      <path d={upper} fill="#3a2226" opacity={0.85} />
      <g opacity={kl}>
        <Soft d={S([[-117, 121], [-110, 116], [-100, 116], [-90, 120], [-100, 122.5], [-112, 123]], true)} fill="#6f7c80" r={2.2} op={0.7} />
      </g>
      <path d={lower} fill="#43292c" opacity={0.8} />
      <g opacity={kl}>
        <Soft d={S([[-113, 128], [-104, 134], [-92, 135], [-82, 131], [-94, 127], [-106, 127]], true)} fill="#7f9194" r={2.6} op={0.85} />
        <Soft d={S([[-109, 130], [-101, 132.5], [-95, 131], [-101, 129]], true)} fill={PAL.skHi} r={1.4} op={0.55} />
      </g>
      {m.open && <path d={S(m.open, true)} fill="#0b0607" />}
      {m.teeth && <path d={S(m.teeth, true)} fill="#6d8387" opacity={0.85} />}
      <Stroke pts={m.line} w={2.4} a={0.35} b={0.6} bias={0.3} fill="#120a0c" r={0.55} />
      {/* corner: where the tiniest smile lives */}
      <Stroke pts={[[c[0] - 5, c[1] + 1], [c[0], c[1] - 1 - smile * 1.5], [c[0] + 4, c[1] - 3 - smile * 3.5]]} w={1.6 + smile * 1.2} fill="#150c0e" r={0.8} op={0.35 + smile * 0.55} />
    </g>
  );
};

// ---------- skin normal pass ----------
const SkinNormalsA: React.FC = () => {
  const skull = S(SKULL_A, true);
  return (
    <g>
      {/* base: overall facing slightly left, dilated so brush displacement never pulls in empty pixels */}
      <path d={skull} fill={N(-15, 0)} stroke={N(-15, 0)} strokeWidth={30} />
      {/* big masses */}
      <Pl pts={[[-160, -170], [10, -170], [26, -90], [34, -20], [42, 24], [24, 96], [-6, 150], [-40, 222], [-170, 222]]} phi={-42} th={4} r={14} />
      <Pl pts={[[36, -180], [200, -180], [200, 60], [100, 120], [60, 160], [28, 110], [48, 30], [40, -40]]} phi={58} th={0} r={16} />
      {/* forehead: top plane tilts up; temple turns */}
      <Pl pts={[[-150, -170], [0, -172], [16, -122], [-60, -112], [-150, -112]]} phi={-36} th={24} r={14} />
      <Pl pts={[[8, -160], [44, -156], [52, -80], [34, -50], [20, -90]]} phi={22} th={10} r={12} />
      {/* brow ridge: top faces forward-up, underside faces down into the socket */}
      <Pl pts={[[-152, -76], [-60, -66], [16, -70], [22, -52], [-60, -48], [-150, -52]]} phi={-40} th={18} r={5} />
      <Pl pts={[[-150, -46], [-60, -42], [20, -46], [18, -30], [-60, -28], [-146, -30]]} phi={-30} th={-34} r={5} />
      {/* near eye: inner socket wall (beside the bridge) faces screen-right, outer orbit turns */}
      <Pl pts={[[-88, -32], [-66, -30], [-60, -6], [-70, 12], [-90, 8]]} phi={34} th={-6} r={5} />
      <Pl pts={[[2, -36], [22, -40], [34, -8], [22, 10], [6, -4]]} phi={30} th={0} r={6} />
      {/* eyeball domes under the lids */}
      <Dome cx={-33} cy={-10} rx={31} ry={18} phi={-30} k={48} />
      <Dome cx={-122} cy={-8} rx={17} ry={14} phi={-60} k={36} />
      {/* under-eye / lower orbit shelf faces up */}
      <Pl pts={[[-64, 2], [-34, 6], [0, -4], [8, 12], [-34, 22], [-66, 16]]} phi={-26} th={22} r={5} />
      {/* cheekbone (zygoma): front faces forward-up, side turns hard */}
      <Pl pts={[[-146, 12], [-60, 22], [26, 14], [44, 32], [4, 54], [-60, 58], [-146, 54]]} phi={-26} th={14} r={9} />
      <Pl pts={[[26, 4], [58, 10], [78, 42], [52, 66], [36, 34]]} phi={62} th={8} r={8} />
      {/* hollow below the cheekbone */}
      <Pl pts={[[-140, 62], [-60, 66], [22, 70], [34, 110], [-10, 152], [-120, 142]]} phi={-30} th={-10} r={12} />
      {/* nose: dorsum (lit), near side plane (away from key), tip ball, ala, underside */}
      <Pl pts={[[-89, -18], [-85, 20], [-82, 48], [-90, 62], [-110, 58], [-112, 42], [-100, 10], [-94, -20]]} phi={30} th={-2} r={2.5} />
      <Pl pts={[[-89, -24], [-97, -24], [-128, 60], [-116, 64]]} phi={-50} th={14} r={2.2} />
      <Dome cx={-119} cy={66} rx={13} ry={11} phi={-38} k={46} />
      <Dome cx={-92} cy={76} rx={12} ry={10} phi={40} k={40} />
      <Pl pts={[[-131, 74], [-104, 84], [-90, 90], [-104, 93], [-126, 83]]} phi={-20} th={-66} r={2} />
      {/* muzzle / upper lip: front plane + near side turning */}
      <Pl pts={[[-128, 92], [-98, 92], [-72, 100], [-62, 118], [-122, 122]]} phi={-34} th={8} r={4} />
      <Pl pts={[[-72, 92], [-40, 100], [-36, 140], [-58, 142], [-60, 118]]} phi={24} th={2} r={8} />
      <Pl pts={[[-104, 92], [-98, 92], [-96, 112], [-103, 112]]} phi={-10} th={6} r={1.5} />
      {/* lips: upper faces forward-down, lower faces up, under-lip faces down */}
      <Pl pts={[[-118, 122], [-108, 114], [-96, 114], [-64, 122], [-90, 126], [-112, 125]]} phi={-36} th={-14} r={1.6} />
      <Pl pts={[[-115, 127], [-104, 136], [-86, 138], [-66, 126], [-90, 126]]} phi={-36} th={34} r={2} />
      <Pl pts={[[-112, 140], [-96, 146], [-72, 142], [-68, 136], [-92, 150], [-110, 150]]} phi={-30} th={-40} r={3} />
      {/* chin ball + chin underside */}
      <Dome cx={-104} cy={176} rx={22} ry={26} phi={-36} k={44} />
      <Pl pts={[[-118, 196], [-90, 212], [-40, 216], [-50, 200], [-100, 190]]} phi={-20} th={-70} r={4} />
      {/* jaw underside band */}
      <Pl pts={[[-90, 200], [-14, 194], [60, 144], [70, 156], [-10, 212], [-90, 216]]} phi={20} th={-68} r={4} />
      {/* silhouette turns away */}
      <EdgeBand pts={SKULL_A} w={22} r={9} z={0.18} />
    </g>
  );
};

const NeckNormalsA: React.FC = () => (
  <g>
    <path d={S(NECK_A, true)} fill={N(10, 0)} stroke={N(10, 0)} strokeWidth={24} />
    <Pl pts={[[-90, 180], [-20, 200], [-10, 460], [-90, 460]]} phi={-45} th={0} r={16} />
    <Pl pts={[[40, 150], [170, 100], [170, 460], [30, 460]]} phi={62} th={0} r={18} />
    <EdgeBand pts={NECK_A} w={20} r={10} z={0.2} />
  </g>
);

const EarNormalsA: React.FC = () => (
  <g>
    <path d={S(EAR_A, true)} fill={N(55, 0)} stroke={N(55, 0)} strokeWidth={8} />
    {/* concha bowl faces forward-in; helix rim faces out */}
    <Pl pts={[[108, 14], [120, 6], [126, 30], [118, 50], [108, 44]]} phi={-30} th={0} r={3} />
    <Pl pts={[[116, -14], [132, -12], [136, 16], [128, 40], [122, 20]]} phi={20} th={20} r={3} />
    <EdgeBand pts={EAR_A} w={8} r={3} z={0.3} />
  </g>
);

// ---------- hair ----------
// Short, textured, pushed forward; the cowlick is a forward-sweeping crest of 3 clumps at the front.
export const HAIR_MASS_A: P[] = [
  [-124, -146], [-134, -164], [-138, -184], [-130, -198], [-122, -214], [-100, -232], [-70, -246], [-26, -256],
  [24, -255], [74, -244], [118, -224], [156, -194], [180, -154], [192, -108], [190, -62], [180, -16], [162, 22],
  [148, 30], [140, 6], [132, -24], [112, -34], [101, -60], [96, -96], [80, -120], [50, -134], [14, -142], [-24, -147],
  [-60, -150], [-96, -146],
];
// the forward cowlick: one flip of hair rising off the front hairline, breaking into 3 points
const COW: P[][] = [
  [[-40, -196], [-80, -212], [-116, -226], [-146, -236], [-166, -228, 0.2], [-150, -222], [-163, -208, 0.2], [-146, -205], [-153, -189, 0.2],
   [-134, -189], [-110, -177], [-86, -162], [-60, -156], [-44, -172]],
];
const HairNormalsA: React.FC = () => {
  // clump tubes sweeping crown -> forward, fanning over the skull
  const cl: {c: P[]; w: number; phi: number}[] = [];
  const N0 = 16;
  for (let i = 0; i < N0; i++) {
    const t = i / (N0 - 1);
    const sx = 176 - t * 250;
    const sy = -120 - Math.sin(Math.min(1, t * 1.25) * Math.PI * 0.62) * 140 - t * 10;
    cl.push({c: [[sx + 26, sy + 40], [sx, sy], [sx - 42, sy - 6 + t * 10], [sx - 84, sy + 16 + t * 26]], w: 30 - (i % 3) * 6, phi: -20 + (1 - t) * 40});
  }
  return (
    <g>
      <path d={S(HAIR_MASS_A, true)} fill={N(-6, 36)} stroke={N(-6, 36)} strokeWidth={26} />
      <Pl pts={[[110, -210], [210, -170], [210, 40], [130, 30], [104, -80]]} phi={62} th={8} r={16} />
      <Pl pts={[[-150, -160], [-40, -162], [0, -150], [-60, -136], [-150, -136]]} phi={-44} th={-18} r={8} />
      {cl.map(({c, w, phi}, i) => (
        <Tube key={i} pts={c} w={w} phi={phi} th={40} turn={46} r={2.2} />
      ))}
      {/* side hair near the ear combs down */}
      {[0, 1, 2, 3].map((i) => (
        <Tube key={'s' + i} pts={[[150 - i * 12, -150 + i * 6], [134 - i * 12, -100 + i * 6], [122 - i * 10, -50 + i * 4]]} w={16} phi={50} th={0} turn={40} r={2} />
      ))}
      <EdgeBand pts={HAIR_MASS_A} w={18} r={8} z={0.28} />
    </g>
  );
};

const CowNormals: React.FC<{i: number}> = ({i}) => {
  const c = COW[i];
  return (
    <g>
      <path d={S(c, true)} fill={N(-40, 30)} stroke={N(-40, 30)} strokeWidth={8} />
      <Tube pts={[[-50, -186], [-96, -202], [-136, -218], [-160, -226]]} w={26} phi={-40} th={34} turn={55} r={2} />
      <Tube pts={[[-70, -168], [-110, -186], [-140, -200], [-158, -206]]} w={18} phi={-50} th={10} turn={50} r={2} />
      <Tube pts={[[-80, -160], [-120, -176], [-146, -190]]} w={12} phi={-50} th={-20} turn={40} r={1.6} />
      <EdgeBand pts={c} w={6} r={2.5} z={0.3} />
    </g>
  );
};

const HAIR_RAMP_SCALE = 1;

export const MasHeadA: React.FC<MasRig> = ({blink = 0, lookX = 0, lookY = 0, lid = 0.25, smile = 0, mouth = 'rest', brow = 0, light, normals = false}) => {
  const b = clamp(blink + lid * 0.22);
  const neUp = mix(NE_UP_OPEN, NE_UP_SHUT, b);
  const feUp = mix(FE_UP_OPEN, FE_UP_SHUT, b);
  const skull = S(SKULL_A, true);
  const neck = S(NECK_A, true);
  const ear = S(EAR_A, true);
  const by = -brow * 4;
  const kl = 1;
  const hairLight: LightRig = {...light, ramp: HAIR_RAMP, spec: 0.5, specPow: 30, rimAmt: (light.rimAmt ?? 0) * 1.1};
  const W = (el: React.ReactNode, lt: LightRig, box: [number, number, number, number], rag = 10, seed = 3) =>
    normals ? <g>{el}</g> : <Lit light={lt} box={box} rag={rag} seed={seed}>{el}</Lit>;
  return (
    <g>
      {/* neck */}
      <Clip d={neck}>
        {W(<NeckNormalsA />, light, [-120, 120, 320, 360], 8, 5)}
        {/* chin/jaw cast shadow on the neck: crisp-ish lower edge */}
        <Soft d={S([[-100, 150], [-40, 238], [10, 254], [70, 244], [150, 206], [160, 100]], true)} fill={PAL.skCore} r={3} op={normals ? 0 : 0.8} />
      </Clip>
      {/* ear */}
      <Clip d={ear}>
        {W(<EarNormalsA />, light, [80, -50, 90, 150], 3, 9)}
        {!normals && <Soft d={S([[106, 24], [116, 20], [118, 40], [108, 44]], true)} fill="#0d0809" r={2} op={0.8} />}
      </Clip>
      {/* skin */}
      <Clip d={skull}>
        {W(<SkinNormalsA />, light, [-200, -290, 420, 540], 5, 11)}
        {!normals && (
          <g>
            {/* crisp nose cast shadow onto the near cheek (monitor is front-left) */}
            <Soft d={S([[-86, 34], [-72, 52], [-64, 74], [-72, 90], [-86, 88], [-90, 64]], true)} fill="#141820" r={2} op={0.45} />
            {/* occlusion: inner eye corners, nostril, mouth corners */}
            <Soft d={S([[-74, -22], [-62, -12], [-62, 4], [-74, 8], [-80, -8]], true)} fill={PAL.skCore} r={4} op={0.5} />
            <Soft d={S([[-112, 84], [-100, 82], [-94, 88], [-106, 91]], true)} fill="#0b0608" r={1.4} op={0.9} />
            <Stroke pts={[[-100, 62], [-86, 68], [-82, 78], [-88, 88]]} w={2} fill="#120b0d" r={0.9} op={0.55} />
            <Stroke pts={[[-80, 94], [-68, 108], [-60, 124], [-56, 138]]} w={7} a={0.2} b={0.1} fill={PAL.skCore} r={4} op={0.4} />
            {/* upper lid skin + crease */}
            <Stroke pts={mix([[-56, -16], [-42, -30], [-20, -32], [-2, -20]], [[-56, -10], [-42, -22], [-20, -22], [-2, -16]], b * 0.6)} w={2} fill="#141a1e" r={1} op={0.55} />
            <Stroke pts={[[-108, -12], [-120, -22], [-136, -18]]} w={1.5} fill="#141a1e" r={0.8} op={0.45} />
            <g transform="translate(-33 -10) scale(1.1) translate(33 10)"><Eye up={neUp} lo={NE_LO} iris={NE_IRIS} lookX={lookX} lookY={lookY} near kl={kl} /></g>
            <g transform="translate(-122 -8) scale(1.08) translate(122 8)"><Eye up={feUp} lo={FE_LO} iris={FE_IRIS} lookX={lookX} lookY={lookY} near={false} kl={kl} /></g>
            {/* lower lid shelf catch-light */}
            <Stroke pts={[[-56, 3], [-36, 4], [-16, -1]]} w={2.4} fill={PAL.skHi} r={1.4} op={0.25} />
            {/* brows: painted strokes, hair-direction */}
            <g transform={`translate(0 ${by})`}>
              <Stroke pts={[[-68, -38], [-50, -46], [-26, -50], [-4, -47], [10, -40]]} w={8} a={0.9} b={0.15} bias={0.3} fill="#15100f" r={1.3} op={0.9} />
              <Stroke pts={[[-64, -41], [-46, -46], [-24, -49]]} w={3} fill="#4a5557" r={1} op={0.35} />
              <Stroke pts={[[-100, -38], [-118, -44], [-134, -44], [-147, -38]]} w={6.5} a={0.9} b={0.2} bias={0.3} fill="#15100f" r={1.1} op={0.88} />
            </g>
            <Mouth m={MOUTHS[mouth]} smile={smile} kl={kl} />
            {/* albedo: warmer blood-rich zones (nose, cheeks, ear side), cooler around the eyes */}
            <g style={{mixBlendMode: 'multiply'}}>
              <Soft d={S([[-136, 40], [-100, 30], [-80, 60], [-110, 90], [-140, 80]], true)} fill="#e8b4a4" r={16} op={0.6} />
              <Soft d={S([[-130, 50], [-112, 56], [-104, 76], [-126, 82]], true)} fill="#e0a090" r={8} op={0.55} />
              <Soft d={S([[-20, 30], [40, 30], [60, 90], [0, 120], [-40, 80]], true)} fill="#d8a8a0" r={20} op={0.5} />
              <Soft d={S([[-70, -40], [0, -44], [16, 4], [-40, 14], [-76, 0]], true)} fill="#b8b0c4" r={10} op={0.45} />
              <Soft d={S([[-150, 100], [-40, 110], [40, 160], [-60, 230], [-150, 230]], true)} fill="#c0c4c8" r={20} op={0.4} />
            </g>
            {/* light falloff: the monitor is a local source at eye height, front-left */}
            <g style={{mixBlendMode: 'multiply'}}>
              <Soft d={S([[-20, -300], [220, -300], [220, 260], [-20, 260], [60, 0]], true)} fill="#6a6f78" r={60} op={0.55} />
              <Soft d={S([[-200, 150], [100, 150], [100, 260], [-200, 260]], true)} fill="#7a7f88" r={40} op={0.4} />
            </g>
            {/* hair cast shadow on forehead */}
            <Soft d={S([[-150, -166], [-96, -140], [-40, -138], [20, -126], [80, -108], [120, -80], [140, -150], [-40, -200]], true)} fill={PAL.skCore} r={6} op={0.75} />
            <Bristle d={skull} angle={-62} op={0.12} seed={21} box={[-220, -300, 440, 560]} />
          </g>
        )}
      </Clip>
      {/* hair */}
      <Clip d={S(HAIR_MASS_A, true)}>{W(<HairNormalsA />, hairLight, [-200, -300, 420, 380], 7, 31)}</Clip>
      {!normals && <Stroke pts={[[-104, -148], [-70, -150], [-30, -148], [10, -140], [50, -132], [90, -108]]} w={8} fill={PAL.hairMas} r={3} op={0.7} />}
      {[0].map((i) => (
        <Clip key={i} d={S(COW[i], true)}>
          {W(<CowNormals i={i} />, hairLight, [-190, -270, 190, 140], 3, 33 + i)}
        </Clip>
      ))}
    </g>
  );
};

export const HAIR_RAMP: [number, string][] = [
  [0, '#0b0908'],
  [0.4, '#0a0807'],
  [0.5, '#1a1310'],
  [0.62, '#2c3334'],
  [0.8, '#4f6265'],
  [1, '#86a3a5'],
].map(([t, c]) => [(t as number) * HAIR_RAMP_SCALE, c as string]) as [number, string][];
