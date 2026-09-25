import React from 'react';
import {Piece, Joint, cut, oval, jit, type Pt} from './paper';

/**
 * NOLE — jointed cut-paper puppet. Head in profile facing screen-LEFT, torso in a 3/4
 * "twisted perspective" (Egyptian/cut-out convention) so the broad shoulders read.
 * The square jaw is its own card on a brad: his mouth animation IS the hinged jaw.
 * Local units: origin = hip pivot; shoulders ~y-235; neck pin y-296; crown ~y-420; feet ~y+405.
 */
export const NOLE_C = {
  skin: '#d39e80',
  skinDk: '#b98669',
  skinSh: '#94644e',
  hair: '#2a211c',
  hairLt: '#4a3a30',
  brow: '#231a15',
  eye: '#eee7da',
  iris: '#3d5266',
  pupil: '#0c0d10',
  tee: '#1c1c21',
  teeLt: '#2d2d35',
  teeHi: '#3b3b45',
  trouser: '#3f4757',
  trouserDk: '#2d333f',
  boot: '#1f1b19',
  sole: '#5a4636',
  phone: '#111214',
  screen: '#d9fbff',
  mouth: '#3a1216',
  teeth: '#f2ede2',
};
const C = NOLE_C;

export interface NolePose {
  torsoA?: number;
  headA?: number;
  /** jaw open 0..1 */
  jaw?: number;
  lookX?: number;
  lookY?: number;
  lid?: number;
  brow?: number;
  /** phone arm (front): shoulder, elbow, wrist */
  pSh?: number;
  pEl?: number;
  pWr?: number;
  /** back arm */
  bSh?: number;
  bEl?: number;
  bWr?: number;
  /** legs: front thigh/knee, back thigh/knee */
  fTh?: number;
  fKn?: number;
  bTh?: number;
  bKn?: number;
  quiff?: number;
  exp?: number;
  boil?: number;
  /** phone screen glow 0..1 */
  glow?: number;
}

const sc = (pts: Pt[], s: number, ox = 0, oy = 0): Pt[] => pts.map((p) => (p.length === 3 ? [p[0] * s + ox, p[1] * s + oy, p[2]] : [p[0] * s + ox, p[1] * s + oy]) as Pt);

// ------------------------------------------------------------------ head (large units, scaled at mount)
export const NOLE_H = {
  upper: cut(
    [
      [0, -150], [40, -141], [62, -112], [67, -78], [60, -48], [46, -30], [28, -24], [14, -32], [0, -28], [-22, -16], [-46, -12], [-61, -12, 1],
      [-63, -20], [-66, -27], [-73, -33], [-85, -43, 1], [-77, -64], [-70, -82], [-71, -91], [-66, -104], [-56, -126], [-32, -145],
    ],
    {seed: 201, jit: 0.4},
  ),
  eyeHole: cut([[-56, -71, 1], [-47, -76], [-36, -75], [-31, -71, 1], [-44, -68]], {seed: 202, jit: 0.1}),
  lash: cut([[-56.5, -71.3, 1], [-47, -77], [-35.5, -76], [-30.5, -71, 1], [-36, -74.2], [-47, -75]], {seed: 203, jit: 0.05}),
  lidHalf: cut([[-57, -71.5, 1], [-47, -77.5], [-35, -76.5], [-30, -71, 1], [-44, -71.5]], {seed: 204, jit: 0.05}),
  lidFull: cut([[-57, -71.5, 1], [-47, -77.5], [-35, -76.5], [-30, -71, 1], [-44, -67.2]], {seed: 205, jit: 0.05}),
  brow: cut([[-64, -80], [-48, -88], [-28, -86], [-26, -82], [-46, -83], [-62, -77]], {seed: 206, jit: 0.2}),
  browSh: cut([[-66, -78], [-50, -84], [-30, -82], [-32, -76], [-50, -78], [-64, -73]], {seed: 207, jit: 0.2}),
  jaw: cut(
    [[-61, -12, 1], [-64, -5], [-62, 7], [-61, 22], [-58, 33, 1], [-40, 36], [-8, 31], [18, 24, 1], [21, 4], [19, -24], [8, -41], [-6, -30], [-30, -17], [-46, -14]],
    {seed: 208, jit: 0.4},
  ),
  jawSh: cut([[-40, 36], [-8, 31], [18, 24, 1], [21, 4], [10, 14], [-10, 22], [-38, 28]], {seed: 209}),
  lowerLip: cut([[-62, -8], [-50, -10], [-44, -9], [-50, -4], [-61, -3]], {seed: 210}),
  cleft: cut([[-60, 24], [-56, 20], [-55, 28]], {seed: 211, jit: 0.1}),
  mouthIn: cut([[-64, -16], [-40, -20], [-8, -24], [-6, 6], [-40, 10], [-62, 8]], {seed: 212}),
  teethU: cut([[-61, -13], [-38, -15.5], [-37, -9.5], [-58, -7.5]], {seed: 213, jit: 0.2}),
  teethL: cut([[-60, -9], [-40, -10], [-40, -5], [-58, -4]], {seed: 214, jit: 0.2}),
  nostril: cut([[-74, -36], [-66, -34], [-68, -31]], {seed: 215, jit: 0.1}),
  cheek: cut([[-46, -58], [-24, -60], [-12, -40], [-26, -28], [-44, -34]], {seed: 216}),
  ear: cut([[16, -86], [31, -91], [41, -77], [40, -56], [30, -43], [20, -46], [23, -62], [18, -74]], {seed: 217}),
  earIn: cut([[24, -80], [33, -80], [35, -62], [28, -54], [29, -68]], {seed: 218}),
  hair: cut(
    [
      [-58, -118], [-62, -140], [-50, -163], [-18, -177], [20, -173], [55, -157], [75, -129], [79, -96], [71, -64], [59, -49], [51, -58], [45, -74], [37, -92],
      [22, -96], [9, -98], [3, -86, 1], [-1, -74, 1], [-8, -78, 1], [-11, -100], [-27, -112], [-45, -117],
    ],
    {seed: 219, jit: 0.4},
  ),
  streak1: cut([[-50, -150], [-20, -168], [26, -166], [64, -140], [74, -110], [58, -132], [24, -156], [-18, -158]], {seed: 220}),
  streak2: cut([[-40, -134], [-8, -148], [34, -144], [66, -112], [70, -84], [52, -110], [28, -130], [-10, -138]], {seed: 221}),
  quiff: cut([[6, 8], [-10, 2], [-20, -10], [-16, -24], [2, -30], [34, -26], [58, -12], [28, -8], [8, -10]], {seed: 222}),
  neck: cut([[-26, 10], [-30, 50], [-30, 110, 1], [44, 110, 1], [48, 50], [56, -34], [26, -22]], {seed: 223}),
  neckSh: cut([[-26, 14], [-2, 34], [30, 18], [52, -12], [50, 30], [26, 50], [-4, 56], [-28, 44]], {seed: 224}),
  adam: cut([[-28, 50], [-22, 44], [-20, 58], [-27, 62]], {seed: 225}),
};

const HEAD_S = 0.74;
/** upper body scale (broad), leg scale (long but not stilts) */
export const UP_S = 1.1;
/** overall puppet scale */
export const NOLE_S = 0.92;
export const LEG_S = 0.94;

export const NoleHead: React.FC<{p: NolePose}> = ({p}) => {
  const {jaw = 0, lookX = -0.7, lookY = 0.2, lid = 0, quiff = 0, exp = 0, boil = 1, brow = 0} = p;
  const ix = -44 + lookX * 5;
  const iy = -71.5 + lookY * 1.5;
  return (
    <g transform={`scale(${HEAD_S})`}>
      <Piece d={NOLE_H.neck} fill={C.skinDk} z={0.8} />
      <Piece d={NOLE_H.neckSh} fill={C.skinSh} z={0} edge={0} op={0.7} />
      <Piece d={NOLE_H.adam} fill={C.skinSh} z={0} edge={0} op={0.5} />
      <Piece d={NOLE_H.mouthIn} fill={C.mouth} z={0} edge={0} tex="none" />
      <Piece d={NOLE_H.teethU} fill={C.teeth} z={0.2} edge={0} tex="soft" />
      {/* eye disc behind eye hole */}
      <Piece d={oval(-44, -71.5, 15, 7.5, 230)} fill={C.eye} z={0} tex="soft" edge={0} />
      <Piece d={oval(ix, iy, 4.6, 4.6, 231, 8, 0.1)} fill={C.iris} z={0.3} edge={0.1} />
      <Piece d={oval(ix, iy, 2.4, 2.4, 232, 7, 0.1)} fill={C.pupil} z={0} edge={0} tex="none" />
      <circle cx={ix - 1.4} cy={iy - 1.4} r={1} fill="#fff" opacity={0.85} />
      <Piece d={`${NOLE_H.upper} ${NOLE_H.eyeHole}`} rule="evenodd" fill={C.skin} z={1.3} />
      <Piece d={NOLE_H.cheek} fill={C.skinSh} z={0} edge={0} op={0.16} tex="soft" />
      <Piece d={NOLE_H.nostril} fill={C.skinSh} z={0} edge={0} tex="none" />
      {lid < 0.25 ? <Piece d={NOLE_H.lash} fill={C.brow} z={0.2} edge={0} tex="none" /> : <Piece d={lid < 0.75 ? NOLE_H.lidHalf : NOLE_H.lidFull} fill={C.skinDk} z={0.4} />}
      <Piece d={NOLE_H.browSh} fill={C.skinSh} z={0} edge={0} op={0.6} />
      <g transform={`translate(0 ${-brow * 3}) rotate(${brow * -4} -44 -84)`}>
        <Piece d={NOLE_H.brow} fill={C.brow} z={0.6} />
      </g>
      <Piece d={NOLE_H.ear} fill={C.skinDk} z={0.8} />
      <Piece d={NOLE_H.earIn} fill={C.skinSh} z={0} edge={0} />
      {/* hinged jaw card */}
      <Joint x={8} y={-38} a={-jaw * 16 + jit(240, exp, boil * 0.3)}>
        <g transform="translate(-8 38)">
          <Piece d={NOLE_H.teethL} fill={C.teeth} z={0} edge={0} tex="soft" />
          <Piece d={NOLE_H.jaw} fill={C.skin} z={1.2} />
          <Piece d={NOLE_H.jawSh} fill={C.skinSh} z={0} edge={0} op={0.55} />
          <Piece d={NOLE_H.lowerLip} fill="#b8786a" z={0.2} edge={0} />
          <Piece d={NOLE_H.cleft} fill={C.skinSh} z={0} edge={0} tex="none" />
          {/* painted-over pin at the hinge */}
          <circle cx={8} cy={-38} r={2.8} fill={C.skinDk} stroke={C.skinSh} strokeWidth={0.6} strokeOpacity={0.7} />
          {/* stubble: soft grey-brown wash along the jaw */}
          <Piece d={cut([[-62, 8], [-58, 33], [-40, 36], [-8, 31], [18, 24], [16, 12], [-10, 18], [-40, 22], [-56, 14]], {seed: 241})} fill="#6b5448" z={0} edge={0} op={0.22} tex="soft" />
        </g>
      </Joint>
      <Piece d={NOLE_H.hair} fill={C.hair} z={1.5} tex="dark" />
      <Piece d={NOLE_H.streak2} fill={C.hairLt} z={0.4} op={0.8} tex="dark" />
      <Piece d={NOLE_H.streak1} fill={C.hairLt} z={0.5} op={0.9} tex="dark" />
      <Joint x={-44} y={-150} a={quiff}>
        <Piece d={NOLE_H.quiff} fill={C.hair} z={1} tex="dark" />
      </Joint>
    </g>
  );
};

// ------------------------------------------------------------------ body
const B = {
  torso: cut(
    [[-52.4, 14], [-59.3, -40], [-69.5, -110], [-77.5, -160], [-73.0, -205], [-57.0, -240], [-34.2, -258], [-4.6, -266], [25.1, -266], [50.2, -252], [66.1, -222], [71.8, -170], [66.1, -110], [54.7, -50], [58.1, 10], [0.0, 20]],
    {seed: 251, jit: 0.5},
  ),
  chest: cut([[-59.3, -40], [-69.5, -110], [-77.5, -160], [-73.0, -205], [-57.0, -240], [-43.3, -236], [-54.7, -200], [-59.3, -160], [-52.4, -110], [-43.3, -40]], {seed: 252}),
  pec: cut([[-75.2, -150], [-45.6, -160], [-16.0, -150], [-34.2, -142], [-70.7, -138]], {seed: 269}),
  hem: cut([[-57.0, 2], [57.0, 2], [58.1, 12], [0.0, 21], [-53.6, 15]], {seed: 253}),
  collar: cut([[-50.2, -248], [-27.4, -262], [0.0, -268], [27.4, -266], [34.2, -254], [4.6, -258], [-22.8, -252], [-45.6, -238]], {seed: 254}),
  pelvis: cut([[-48, -8], [50, -8], [54, 32], [0, 48], [-52, 32]], {seed: 257}),
  belt: cut([[-50, -2, 1], [52, -2, 1], [53, 8, 1], [-51, 8, 1]], {seed: 258, jit: 0.3}),
  // arms
  sleeve: cut([[-31, -16], [-12, -34], [16, -32], [33, -12], [31, 40], [28, 62, 1], [-28, 64, 1], [-31, 30]], {seed: 259}),
  sleeveHem: cut([[-28, 53, 1], [28, 51, 1], [28, 62, 1], [-28, 64, 1]], {seed: 260, jit: 0.2}),
  upper: cut([[-19, 30], [19, 28], [19, 80], [15, 114], [0, 126], [-15, 116], [-20, 80]], {seed: 261}),
  fore: cut([[-16, -8], [0, -17], [16, -7], [15, 60], [12, 104, 1], [-12, 106, 1], [-15, 60]], {seed: 262}),
  hand: cut([[-13, -4], [12, -4], [16, 14], [13, 32], [0, 38], [-12, 32], [-16, 14]], {seed: 263}),
  knuckle: cut([[-12, 22], [12, 20], [12, 26], [-11, 28]], {seed: 264}),
  // legs
  thigh: cut([[-27, -10], [-8, -28], [16, -26], [28, -6], [26, 100], [22, 198], [2, 212], [-20, 200], [-27, 100]], {seed: 265}),
  shin: cut([[-21, -8], [0, -18], [21, -6], [18, 90], [16, 178, 1], [-16, 178, 1], [-19, 90]], {seed: 266}),
  boot: cut([[17, -16], [21, 16, 1], [-8, 24], [-60, 24, 1], [-70, 14], [-64, 2], [-38, -4], [-16, -16]], {seed: 267}),
  bootSole: cut([[21, 14, 1], [21, 24, 1], [-60, 25, 1], [-70, 16, 1], [-58, 19]], {seed: 268}),
};

const Phone: React.FC<{glow: number}> = ({glow}) => (
  <g transform="translate(0 6) rotate(-8)">
    <Piece d={cut([[-12, 0, 1], [12, 0, 1], [12, 58, 1], [-12, 58, 1]], {seed: 270, jit: 0.3})} fill={C.phone} z={1.2} tex="dark" edge={0.3} />
    <Piece d={cut([[-9, 4, 1], [9, 4, 1], [9, 54, 1], [-9, 54, 1]], {seed: 271, jit: 0.2})} fill={C.screen} z={0} tex="soft" edge={0} op={0.35 + glow * 0.65} />
    {/* the notification: tiny cut-paper lines */}
    <Piece d={cut([[-6, 12, 1], [6, 12, 1], [6, 15, 1], [-6, 15, 1]], {seed: 272, jit: 0.1})} fill="#1b4b58" z={0} tex="none" edge={0} op={0.8} />
    <Piece d={cut([[-6, 19, 1], [3, 19, 1], [3, 21.5, 1], [-6, 21.5, 1]], {seed: 273, jit: 0.1})} fill="#1b4b58" z={0} tex="none" edge={0} op={0.6} />
  </g>
);

const Arm: React.FC<{back?: boolean; sh: number; el: number; wr: number; exp: number; b: number; id: number; glow: number}> = ({back, sh, el, wr, exp, b, id, glow}) => (
  <Joint x={0} y={0} a={sh + jit(id, exp, b * 0.6)} brad={!back} tone="black">
    <Piece d={B.upper} fill={back ? C.skinSh : C.skinDk} z={1} />
    <Piece d={B.sleeve} fill={back ? '#141418' : C.tee} z={1.6} tex="dark" />
    <Piece d={B.sleeveHem} fill={back ? '#18181c' : C.teeLt} z={0.3} tex="dark" />
    <Joint x={0} y={112} a={el + jit(id + 1, exp, b)} brad={!back} tone="black">
      <Piece d={B.fore} fill={back ? C.skinSh : C.skin} z={1.3} />
      <Joint x={0} y={100} a={wr + jit(id + 2, exp, b * 1.4)}>
        {!back ? <Phone glow={glow} /> : null}
        <Piece d={B.hand} fill={back ? C.skinSh : C.skin} z={1} />
        <Piece d={B.knuckle} fill={C.skinSh} z={0} edge={0} op={0.5} />
      </Joint>
    </Joint>
  </Joint>
);

const Leg: React.FC<{back?: boolean; th: number; kn: number; exp: number; b: number; id: number}> = ({back, th, kn, exp, b, id}) => (
  <Joint x={back ? 18 : -16} y={20} a={th + jit(id, exp, b * 0.4)} brad={!back} tone="black">
    <Piece d={B.thigh} fill={back ? C.trouserDk : C.trouser} z={back ? 0.8 : 1.4} tex="dark" />
    <Joint x={0} y={198} a={kn + jit(id + 1, exp, b * 0.6)} brad={!back} tone="black">
      <Piece d={B.shin} fill={back ? C.trouserDk : C.trouser} z={1} tex="dark" />
      <Joint x={0} y={176} a={-kn - th}>
        <Piece d={B.boot} fill={C.boot} z={1} tex="dark" edge={0.2} />
        <Piece d={B.bootSole} fill={C.sole} z={0.3} tex="kraft" />
      </Joint>
    </Joint>
  </Joint>
);

export const Nole: React.FC<{p?: NolePose}> = ({p = {}}) => {
  const {torsoA = 0, headA = 0, exp = 0, boil = 1, glow = 1} = p;
  const b = boil * 0.4;
  return (
    <g transform={`scale(${NOLE_S})`}>
      <g transform={`scale(${LEG_S})`}>
        <Leg back th={p.bTh ?? -6} kn={p.bKn ?? 4} exp={exp} b={b} id={300} />
      </g>
      <Piece d={B.pelvis} fill={C.trouser} z={1} tex="dark" />
      <Piece d={B.belt} fill="#141210" z={0.3} tex="dark" edge={0.25} />
      <Joint x={0} y={0} a={torsoA + jit(310, exp, b * 0.4)}>
        <g transform={`scale(${UP_S})`}>
        <Joint x={10} y={-226}>
          <Arm back sh={p.bSh ?? -8} el={p.bEl ?? -10} wr={p.bWr ?? 0} exp={exp} b={b} id={320} glow={0} />
        </Joint>
        <Joint x={-10} y={-282} a={headA + jit(330, exp, b * 0.7)}>
          <NoleHead p={p} />
        </Joint>
        <Piece d={B.torso} fill={C.tee} z={1.7} tex="dark" />
        <Piece d={B.chest} fill={C.teeLt} z={0} edge={0} tex="dark" op={0.9} />
        <Piece d={B.pec} fill={C.teeLt} z={0} edge={0} tex="dark" op={0.6} />
        <Piece d={B.collar} fill={C.teeHi} z={0.5} tex="dark" />
        <Piece d={B.hem} fill={C.teeLt} z={0.3} tex="dark" />
        <Joint x={-4} y={-222}>
          <Arm sh={p.pSh ?? 10} el={p.pEl ?? 20} wr={p.pWr ?? 0} exp={exp} b={b} id={340} glow={glow} />
        </Joint>
        </g>
      </Joint>
      <g transform={`scale(${LEG_S})`}>
        <Leg th={p.fTh ?? 8} kn={p.fKn ?? 2} exp={exp} b={b} id={350} />
      </g>
    </g>
  );
};

export const NOLE_HEAD_SCALE = HEAD_S;
export {sc};
