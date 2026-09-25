import React from 'react';
import {Piece, Joint, Thread, cut, oval, jit, type Pt} from './paper';

/**
 * MAS MANALT — jointed cut-paper puppet, profile facing screen-LEFT (his monitor).
 * Local units: origin = hip pivot (seat). Shoulder ~y-180, neck pin y-228, crown ~y-370.
 * Two replacement heads: 'profile' (typing) and 'front' (the turn), eyes are discs behind
 * eye-holes in the face card, lids and mouths are replacement card pieces.
 */
export const MAS_C = {
  hoodie: '#8d939b',
  hoodieDk: '#6c727b',
  hoodieLt: '#a9aeb4',
  hoodIn: '#4a4f57',
  rib: '#7b8189',
  skin: '#eab094',
  skinDk: '#d4957a',
  skinSh: '#a97760',
  blush: '#d98b7a',
  lip: '#b57467',
  hair: '#5e4535',
  hairDk: '#3e2d22',
  hairLt: '#7a5b45',
  brow: '#4a3628',
  eye: '#f1ebdf',
  iris: '#577560',
  pupil: '#111316',
  jeans: '#394866',
  jeansDk: '#29344c',
  shoe: '#e2ded4',
  sole: '#a9a397',
  string: '#efeee8',
  mouth: '#5a2621',
};
const C = MAS_C;
export const MAS_HEAD_S = 0.8;

export type MasMouth = 'rest' | 'smile' | 's' | 'u' | 'p' | 'er';
export interface MasPose {
  head?: 'profile' | 'front';
  headA?: number;
  lookX?: number;
  lookY?: number;
  /** 0 open, 0.5 half, 1 closed (replacement lids). */
  lid?: number;
  mouth?: MasMouth;
  torsoA?: number;
  /** near arm: shoulder, elbow, wrist angles. */
  nSh?: number;
  nEl?: number;
  nWr?: number;
  fSh?: number;
  fEl?: number;
  fWr?: number;
  cowlick?: number;
  sit?: boolean;
  /** exposure index for the stop-motion boil. */
  exp?: number;
  boil?: number;
}

// ------------------------------------------------------------------ limbs (joint-local, pointing +y)
const upperArm = cut([[-17, -8], [-6, -18], [10, -16], [18, -2], [16, 44], [14, 88], [2, 101], [-12, 94], [-17, 44]], {seed: 11});
const foreArm = cut([[-14, -6], [0, -14], [13, -6], [12, 44], [12, 76, 1], [-12, 78, 1], [-13, 42]], {seed: 12});
const cuff = cut([[-12.5, 68, 1], [12.5, 67, 1], [12, 84], [0, 88], [-12, 84]], {seed: 13});
const hand = cut([[-9, -4], [9, -4], [12, 12], [11, 26], [5, 36], [-3, 36], [-9, 28], [-11, 12]], {seed: 14});
const thumb = cut([[-9, 6], [-17, 14], [-19, 24], [-13, 26], [-8, 18]], {seed: 15});
const thigh = cut([[-22, -8], [-6, -24], [14, -20], [23, -2], [21, 88], [18, 165], [2, 179], [-16, 169], [-22, 88]], {seed: 16});
const shin = cut([[-16, -8], [0, -16], [16, -6], [14, 80], [12, 156, 1], [-12, 156, 1], [-15, 80]], {seed: 17});
const shoe = cut([[13, -8], [17, 12, 1], [-6, 18], [-48, 18, 1], [-58, 11], [-54, 2], [-32, -4], [-12, -12]], {seed: 18});
const sole = cut([[17, 10, 1], [17, 18, 1], [-50, 19, 1], [-58, 12, 1], [-48, 14]], {seed: 19});

const Arm: React.FC<{far?: boolean; sh: number; el: number; wr: number; exp: number; b: number; id: number}> = ({far, sh, el, wr, exp, b, id}) => {
  const hd = far ? C.hoodieDk : C.hoodie;
  const sk = far ? C.skinDk : C.skin;
  return (
    <Joint x={0} y={0} a={sh + jit(id, exp, b * 0.6)} brad={!far}>
      <Piece d={upperArm} fill={hd} z={far ? 0.8 : 1.6} />
      <Joint x={0} y={92} a={el + jit(id + 1, exp, b)} brad={!far}>
        <Piece d={foreArm} fill={hd} z={1.2} />
        <Joint x={0} y={80} a={wr + jit(id + 2, exp, b * 1.5)} brad={false}>
          <Piece d={thumb} fill={sk} z={0.6} />
          <Piece d={hand} fill={sk} z={1} />
          <Piece d={cut([[-6, 18], [-2, 30], [0, 18]], {seed: 21, jit: 0.2})} fill={C.skinSh} z={0} tex="none" edge={0} op={0.5} />
        </Joint>
        <Piece d={cuff} fill={far ? C.hoodieDk : C.rib} z={0.5} />
      </Joint>
    </Joint>
  );
};

const Leg: React.FC<{far?: boolean; sit: boolean; exp: number}> = ({far, sit}) => {
  const j = far ? C.jeansDk : C.jeans;
  return (
    <Joint x={far ? 8 : 0} y={far ? -2 : 0} a={sit ? 88 : 2} brad={!far}>
      <Piece d={thigh} fill={j} z={far ? 0.8 : 1.4} />
      <Joint x={0} y={165} a={sit ? -86 : -2} brad={!far}>
        <Piece d={shin} fill={j} z={1} />
        <Joint x={0} y={154} a={sit ? -2 : 0}>
          <Piece d={shoe} fill={far ? '#bdb8ae' : C.shoe} z={1} tex="soft" />
          <Piece d={sole} fill={C.sole} z={0.3} />
          <Piece d={cut([[-40, 2], [-22, -2], [-24, 2], [-40, 6]], {seed: 22})} fill="#9c968a" z={0} edge={0} />
        </Joint>
      </Joint>
    </Joint>
  );
};

// ------------------------------------------------------------------ profile head (facing left)
// head-local units (scaled by MAS_HEAD_S at mount); origin = neck pin; the neck is part of the head
// card and tucks under the hoodie collar, so the pivot is hidden.
const P = {
  neck: cut([[-24, 2], [-26, 30], [-24, 66, 1], [32, 66, 1], [33, 30], [40, -26], [20, -14]], {seed: 30}),
  neckSh: cut([[-21, 4], [0, 8], [22, -8], [36, -22], [34, 2], [18, 18], [-4, 22], [-22, 18]], {seed: 29}),
  face: cut(
    [
      [4, -140], [38, -130], [58, -104], [63, -74], [57, -46], [42, -24], [24, -10], [6, -2], [-10, 8], [-26, 14], [-38, 14], [-46, 7], [-49, -1],
      [-51, -6, 1], [-48, -10.5, 1], [-54, -15], [-54, -21], [-57, -25], [-66.5, -31, 1], [-60, -44], [-54, -56], [-54, -64], [-50, -88], [-38, -114], [-20, -134],
    ],
    {seed: 31, jit: 0.3},
  ),
  eyeHole: cut([[-51, -51, 1], [-43, -58.5], [-31.5, -57.5], [-26.5, -51.5, 1], [-37, -46.5]], {seed: 32, jit: 0.12}),
  lash: cut([[-51.8, -51.3, 1], [-43, -59.8], [-31, -58.8], [-25.6, -51.6, 1], [-31, -56.6], [-43, -57.6]], {seed: 33, jit: 0.08}),
  crease: cut([[-48, -60], [-40, -63.5], [-30, -62], [-31, -61], [-40, -62.4], [-47, -59.2]], {seed: 47, jit: 0.05}),
  brow: cut([[-56, -65], [-44, -71.5], [-28, -69.5], [-24, -66], [-29, -67.2], [-44, -68.6], [-55, -62.5]], {seed: 34, jit: 0.15}),
  ear: cut([[4, -66], [14, -73], [24, -68], [27, -54], [23, -39], [14, -33], [7, -37], [9, -45], [5, -54]], {seed: 35, jit: 0.3}),
  earIn: cut([[12, -63], [19, -63], [21, -51], [17, -43], [15, -48], [17, -55]], {seed: 36, jit: 0.2}),
  hair: cut(
    [
      [-42, -106], [-47, -121], [-37, -137], [-14, -150], [16, -151], [42, -139], [59, -114], [66, -84], [61, -54], [50, -36], [42, -40], [39, -53], [32, -64],
      [22, -73], [8, -76], [-1, -73, 1], [-3, -58], [-6, -53, 1], [-11, -60], [-14, -79], [-25, -95],
    ],
    {seed: 37, jit: 0.35},
  ),
  lock1: cut([[-38, -128], [-20, -143], [10, -147], [38, -136], [54, -116], [36, -126], [8, -134], [-18, -134]], {seed: 38}),
  lock2: cut([[-6, -118], [18, -128], [44, -118], [60, -94], [62, -72], [48, -96], [24, -112]], {seed: 48}),
  lock3: cut([[-2, -86], [16, -96], [34, -92], [22, -86], [8, -82]], {seed: 49}),
  cowlick: cut([[8, 6], [4, -8], [-4, -20], [-16, -28], [-30, -29], [-41, -22], [-46, -12, 1], [-37, -16], [-26, -18], [-14, -12], [-5, -2], [2, 10]], {seed: 39}),
  cowlick2: cut([[4, 2], [-4, -6], [-14, -11], [-24, -11], [-30, -5, 1], [-22, -6], [-12, -3], [-2, 4]], {seed: 40}),
  mouthRest: cut([[-50.8, -10, 1], [-45, -9.4], [-40.5, -11.8, 1], [-45, -10.6]], {seed: 41, jit: 0.05}),
  mouthSmile: cut([[-50.8, -10, 1], [-45, -8.8], [-39.6, -13.6, 1], [-45, -10.2]], {seed: 42, jit: 0.05}),
  nostril: cut([[-59, -28.5], [-53.5, -27.5], [-55, -26]], {seed: 43, jit: 0.05}),
  lidHalf: cut([[-52, -51.5, 1], [-43, -60], [-31, -59], [-25.5, -51.5, 1], [-38, -52.5]], {seed: 44, jit: 0.1}),
  lidFull: cut([[-52, -51.5, 1], [-43, -60], [-31, -59], [-25.5, -51.5, 1], [-36, -46], [-46, -47]], {seed: 45, jit: 0.1}),
};

export const ProfileHead: React.FC<{p: MasPose}> = ({p}) => {
  const {lookX = -0.6, lookY = 0.1, lid = 0, mouth = 'rest', cowlick = 0} = p;
  const ix = -38.5 + lookX * 5.5;
  const iy = -52 + lookY * 2;
  return (
    <g>
      <Piece d={P.neck} fill={C.skinDk} z={0.8} />
      <Piece d={P.neckSh} fill={C.skinSh} z={0} edge={0} op={0.75} />
      {/* eye disc behind the face card */}
      <Piece d={oval(-38.5, -52, 15, 9, 50)} fill={C.eye} z={0} tex="soft" edge={0} />
      <Piece d={oval(ix, iy, 5.6, 5.6, 51, 8, 0.15)} fill={C.iris} z={0.3} edge={0.1} />
      <Piece d={oval(ix, iy, 2.8, 2.8, 52, 7, 0.1)} fill={C.pupil} z={0} edge={0} tex="none" />
      <circle cx={ix - 1.6} cy={iy - 1.8} r={1.15} fill="#fff" opacity={0.9} />
      {/* the face card itself, eye hole cut through it */}
      <Piece d={`${P.face} ${P.eyeHole}`} rule="evenodd" fill={C.skin} z={1.3} />
      <Piece d={oval(-33, -30, 9, 6, 53, 10, 0.3)} fill={C.blush} z={0} tex="soft" edge={0} op={0.28} />
      <Piece d={P.nostril} fill={C.skinSh} z={0} tex="none" edge={0} />
      {lid < 0.25 ? <Piece d={P.lash} fill={C.hairDk} z={0.2} tex="none" edge={0} /> : null}
      {lid >= 0.25 ? <Piece d={lid < 0.75 ? P.lidHalf : P.lidFull} fill={C.skinDk} z={0.5} /> : null}
      {lid >= 0.75 ? <Piece d={cut([[-47, -47.5], [-37, -46.2], [-27, -50.5], [-36, -47.8]], {seed: 46})} fill={C.hairDk} z={0} tex="none" edge={0} /> : null}
      <Piece d={P.crease} fill={C.skinSh} z={0} tex="none" edge={0} op={0.6} />
      <Piece d={P.brow} fill={C.brow} z={0.4} />
      <Piece d={mouth === 'smile' ? P.mouthSmile : P.mouthRest} fill={C.mouth} z={0} tex="none" edge={0} />
      {/* ear: separate card */}
      <Piece d={P.ear} fill={C.skinDk} z={0.8} />
      <Piece d={P.earIn} fill={C.skinSh} z={0.2} edge={0} />
      {/* hair: base card + two lighter lock layers + sprung cowlick */}
      <Piece d={P.hair} fill={C.hair} z={1.5} />
      <Piece d={P.lock2} fill={C.hairLt} z={0.5} op={0.85} />
      <Piece d={P.lock1} fill={C.hairLt} z={0.6} />
      <Piece d={P.lock3} fill={C.hairDk} z={0.3} op={0.7} />
      <Joint x={-28} y={-132} a={cowlick}>
        <Piece d={P.cowlick} fill={C.hair} z={1.2} />
        <Joint x={-8} y={-8} a={cowlick * 0.6}>
          <Piece d={P.cowlick2} fill={C.hairLt} z={0.6} />
        </Joint>
      </Joint>
    </g>
  );
};

// ------------------------------------------------------------------ front head (the turn)
const F = {
  face: cut(
    [[-6, -126], [22, -121], [39, -100], [44, -66], [41, -32], [31, -8], [14, 9], [-6, 15], [-26, 9], [-43, -8], [-53, -32], [-56, -66], [-51, -100], [-34, -121]],
    {seed: 61, jit: 0.35},
  ),
  eyeL: cut([[-42, -54, 1], [-33, -60.5], [-21, -58.5], [-16, -54, 1], [-28, -48.5]], {seed: 62, jit: 0.1}),
  eyeR: cut([[4, -54, 1], [9, -58.5], [21, -60.5], [30, -54, 1], [16, -48.5]], {seed: 63, jit: 0.1}),
  lashL: cut([[-42.5, -54.5, 1], [-33, -61.6], [-20.6, -59.6], [-15.4, -54.2, 1], [-21, -57.8], [-33, -59.4]], {seed: 64, jit: 0.05}),
  lashR: cut([[3.4, -54.2, 1], [8.6, -59.6], [21, -61.6], [30.5, -54.5, 1], [21, -59.4], [9, -57.8]], {seed: 65, jit: 0.05}),
  lidHL: cut([[-43, -54.5, 1], [-33, -61.8], [-20.5, -59.8], [-15, -54, 1], [-29, -55.6]], {seed: 66, jit: 0.1}),
  lidHR: cut([[3, -54, 1], [8.5, -59.8], [21, -61.8], [31, -54.5, 1], [17, -55.6]], {seed: 67, jit: 0.1}),
  lidFL: cut([[-43, -54.5, 1], [-33, -61.8], [-20.5, -59.8], [-15, -54, 1], [-27, -47.6]], {seed: 68, jit: 0.1}),
  lidFR: cut([[3, -54, 1], [8.5, -59.8], [21, -61.8], [31, -54.5, 1], [15, -47.6]], {seed: 69, jit: 0.1}),
  browL: cut([[-45, -66], [-33, -71.5], [-18, -69], [-19, -67], [-33, -69], [-44, -64]], {seed: 70, jit: 0.2}),
  browR: cut([[5, -69], [21, -71.5], [33, -66], [32, -64], [21, -69], [6, -67]], {seed: 71, jit: 0.2}),
  nose: cut([[-9, -48], [-4, -46], [0, -30], [2, -23], [-4, -19], [-11, -20], [-14, -24], [-10, -30]], {seed: 72, jit: 0.2}),
  noseSh: cut([[-3, -45], [1, -30], [3, -22], [-3, -19], [-1, -24], [-2, -34]], {seed: 73, jit: 0.1}),
  earL: cut([[-51, -74], [-63, -76], [-69, -60], [-64, -41], [-51, -40]], {seed: 74}),
  earR: cut([[39, -74], [51, -76], [57, -60], [52, -41], [39, -40]], {seed: 75}),
  hair: cut(
    [[-57, -70], [-63, -100], [-54, -128], [-30, -146], [2, -150], [30, -141], [47, -118], [49, -90], [45, -70], [40, -78], [38, -94], [24, -104], [4, -109], [-16, -106], [-36, -100], [-49, -90], [-53, -78]],
    {seed: 76, jit: 0.35},
  ),
  hairTop: cut([[-44, -104], [-30, -126], [-4, -135], [22, -128], [37, -108], [20, -115], [0, -118], [-22, -112]], {seed: 77}),
  hairTop2: cut([[-54, -110], [-44, -132], [-20, -144], [10, -145], [-10, -138], [-34, -128]], {seed: 96}),
  cowlick: cut([[9, 4], [5, -10], [-1, -24], [-11, -36], [-25, -41], [-35, -35, 1], [-25, -33], [-14, -27], [-6, -15], [-1, 6]], {seed: 78}),
  cowlick2: cut([[3, 2], [0, -8], [-6, -16], [-14, -19], [-19, -15, 1], [-12, -13], [-5, -7], [-1, 3]], {seed: 79}),
  neck: cut([[-26, -2], [-25, 30], [-28, 66, 1], [16, 66, 1], [13, 30], [14, -2]], {seed: 97}),
  neckSh: cut([[-26, 0], [-6, 13], [14, 0], [14, 18], [-6, 26], [-26, 18]], {seed: 98}),
};
export const FM: Record<MasMouth, {d: string; open?: boolean}> = {
  rest: {d: cut([[-17, -6.5, 1], [-6, -3.6], [5, -6.5, 1], [-6, -5]], {seed: 81, jit: 0.05})},
  smile: {d: cut([[-18.5, -8.8, 1], [-6, -3], [6.5, -8.8, 1], [-6, -4.8]], {seed: 82, jit: 0.05})},
  p: {d: cut([[-14, -5.5, 1], [-6, -4.8], [2, -5.5, 1], [-6, -4.4]], {seed: 83, jit: 0.05})},
  s: {d: oval(-6, -5, 8.5, 3.2, 84, 10, 0.1), open: true},
  u: {d: oval(-6, -4.5, 4.4, 4.4, 85, 9, 0.1), open: true},
  er: {d: oval(-6, -4.5, 7, 3.8, 86, 10, 0.1), open: true},
};

export const FrontHead: React.FC<{p: MasPose}> = ({p}) => {
  const {lookX = 0, lookY = 0, lid = 0, mouth = 'rest', cowlick = 0} = p;
  const lx = lookX * 6.5;
  const ly = lookY * 2.5;
  const m = FM[mouth];
  const eye = (cx: number, s: number) => (
    <g key={cx}>
      <Piece d={oval(cx, -54, 15, 8.5, s)} fill={C.eye} z={0} tex="soft" edge={0} />
      <Piece d={oval(cx + lx, -54.5 + ly, 6.2, 6.2, s + 1, 9, 0.15)} fill={C.iris} z={0.3} edge={0.1} />
      <Piece d={oval(cx + lx, -54.5 + ly, 3.1, 3.1, s + 2, 7, 0.1)} fill={C.pupil} z={0} edge={0} tex="none" />
      <circle cx={cx + lx - 2} cy={-56.6 + ly} r={1.25} fill="#fff" opacity={0.9} />
    </g>
  );
  return (
    <g>
      <Piece d={F.neck} fill={C.skinDk} z={0.8} />
      <Piece d={F.neckSh} fill={C.skinSh} z={0} edge={0} op={0.75} />
      <Piece d={F.earL} fill={C.skinDk} z={0.7} />
      <Piece d={F.earR} fill={C.skinSh} z={0.7} />
      {eye(-29, 90)}
      {eye(17, 94)}
      <Piece d={`${F.face} ${F.eyeL} ${F.eyeR}`} rule="evenodd" fill={C.skin} z={1.2} />
      {/* monitor-side light falls from screen-left: shade the far cheek */}
      <Piece d={cut([[24, -118], [40, -98], [44, -66], [41, -32], [31, -8], [14, 9], [22, -30], [26, -70]], {seed: 87})} fill={C.skinSh} z={0} edge={0} op={0.45} />
      <Piece d={oval(-36, -30, 10, 7, 88)} fill={C.blush} z={0} tex="soft" edge={0} op={0.35} />
      <Piece d={oval(24, -30, 10, 7, 89)} fill={C.blush} z={0} tex="soft" edge={0} op={0.3} />
      {lid < 0.25 ? (
        <>
          <Piece d={F.lashL} fill={C.hairDk} z={0.2} tex="none" edge={0} />
          <Piece d={F.lashR} fill={C.hairDk} z={0.2} tex="none" edge={0} />
        </>
      ) : (
        <>
          <Piece d={lid < 0.75 ? F.lidHL : F.lidFL} fill={C.skinDk} z={0.4} />
          <Piece d={lid < 0.75 ? F.lidHR : F.lidFR} fill={C.skinDk} z={0.4} />
          {lid >= 0.75 ? (
            <>
              <Piece d={cut([[-41, -52], [-29, -48.2], [-17, -52], [-29, -49.8]], {seed: 91})} fill={C.hairDk} z={0} tex="none" edge={0} />
              <Piece d={cut([[5, -52], [17, -48.2], [29, -52], [17, -49.8]], {seed: 92})} fill={C.hairDk} z={0} tex="none" edge={0} />
            </>
          ) : null}
        </>
      )}
      <Piece d={F.browL} fill={C.brow} z={0.4} />
      <Piece d={F.browR} fill={C.brow} z={0.4} />
      {/* raised paper nose: its own card, casting its own shadow */}
      <Piece d={F.nose} fill={C.skin} z={0.9} />
      <Piece d={F.noseSh} fill={C.skinSh} z={0} edge={0} op={0.7} />
      {m.open ? (
        <>
          <Piece d={m.d} fill={C.mouth} z={0} tex="none" edge={0} />
          {mouth === 's' ? <Piece d={cut([[-13, -6.6], [1, -6.6], [0, -5], [-12, -5]], {seed: 93})} fill="#f4efe6" z={0} tex="none" edge={0} /> : null}
        </>
      ) : (
        <Piece d={m.d} fill={C.mouth} z={0} tex="none" edge={0} />
      )}
      <Piece d={F.hair} fill={C.hair} z={1.5} />
      <Piece d={F.hairTop2} fill={C.hairLt} z={0.4} op={0.8} />
      <Piece d={F.hairTop} fill={C.hairLt} z={0.6} />
      <Joint x={-8} y={-128} a={cowlick}>
        <Piece d={F.cowlick} fill={C.hair} z={1.1} />
        <Joint x={-4} y={-6} a={cowlick * 0.6}>
          <Piece d={F.cowlick2} fill={C.hairLt} z={0.6} />
        </Joint>
      </Joint>
    </g>
  );
};

// ------------------------------------------------------------------ torso
const T = {
  torso: cut(
    [[-45, 30], [-52, -20], [-51, -80], [-49, -120], [-41, -158], [-27, -190], [-12, -201], [14, -204], [33, -190], [46, -160], [51, -110], [49, -50], [52, 4], [44, 26], [0, 34]],
    {seed: 101, jit: 0.5},
  ),
  hem: cut([[-47, 12], [51, 6], [52, 18], [42, 28], [0, 36], [-46, 32]], {seed: 102}),
  pocket: cut([[-52, -50, 1], [-16, -54], [-14, -44], [-20, 2], [-48, 6]], {seed: 103}),
  hood: cut([[-6, -196], [8, -215], [33, -224], [56, -208], [63, -182], [51, -160], [30, -165], [14, -182]], {seed: 104}),
  hoodIn: cut([[8, -207], [29, -216], [47, -203], [45, -186], [26, -191]], {seed: 105}),
  collar: cut([[-33, -203], [-14, -195], [10, -197], [27, -208], [32, -191], [10, -180], [-14, -180], [-35, -190]], {seed: 106}),
  neckSh: cut([[-18, -246], [8, -250], [10, -224], [-6, -226]], {seed: 107}),
};

export const Mas: React.FC<{p?: MasPose}> = ({p = {}}) => {
  const {head = 'profile', headA = 0, torsoA = -6, sit = true, exp = 0, boil = 1} = p;
  const nSh = p.nSh ?? 24, nEl = p.nEl ?? 70, nWr = p.nWr ?? -20;
  const fSh = p.fSh ?? 20, fEl = p.fEl ?? 74, fWr = p.fWr ?? -16;
  const b = boil * 0.35;
  return (
    <g>
      <Leg far sit={sit} exp={exp} />
      <Leg sit={sit} exp={exp} />
      <Joint x={0} y={0} a={torsoA + jit(1, exp, b * 0.5)}>
        <Joint x={6} y={-180}>
          <Arm far sh={fSh} el={fEl} wr={fWr} exp={exp} b={b} id={20} />
        </Joint>
        <Piece d={T.hood} fill={C.hoodieDk} z={1} />
        <Piece d={T.hoodIn} fill={C.hoodIn} z={0.3} />
        <Piece d={T.torso} fill={C.hoodie} z={1.5} />
        <Piece d={T.pocket} fill={C.hoodieLt} z={0.4} op={0.55} />
        <Piece d={T.hem} fill={C.rib} z={0.4} />
        <Joint x={-4} y={-228} a={headA + jit(2, exp, b * 0.8)}>
          <g transform={`scale(${MAS_HEAD_S})`}>{head === 'profile' ? <ProfileHead p={p} /> : <FrontHead p={p} />}</g>
        </Joint>
        <Piece d={T.collar} fill={C.hoodieDk} z={1} />
        <Thread d="M -25 -193 C -28 -176 -30 -164 -31 -146" color={C.string} w={1.6} />
        <Piece d={cut([[-33.5, -148, 1], [-28.5, -148, 1], [-28.5, -139, 1], [-33.5, -139, 1]], {seed: 108, jit: 0.1})} fill="#c9c9c4" z={0.4} tex="none" edge={0.3} />
        <Joint x={-8} y={-178}>
          <Arm sh={nSh} el={nEl} wr={nWr} exp={exp} b={b} id={30} />
        </Joint>
      </Joint>
    </g>
  );
};
