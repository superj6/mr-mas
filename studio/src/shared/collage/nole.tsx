import React from 'react';
import type {NoleToneParams} from '../tonal/noleTone';
import {NoleHead, noleHeadSil, INK} from './heads';
import {Piece, STOCK, Wash} from './paper';
import {Engr, Region} from './engr';
import {tubeD, tubeFamily, tubeTone} from './limbs';
import {P2, clamp, boil, ell, smoothD, polyD} from './core';
import {FONT} from '../theme/fonts';

/**
 * COLLAGE — NOLE as a cut-out: a certificate-engraved head with a sawn jaw on a pivot, on a broad
 * "Physical Culture" advertisement torso (black knitted jersey), a jointed phone arm. Faces screen-left.
 * World coords; the whole figure leans about a hip pivot below frame.
 */
export const NOLE = {
  head: [1560, 392] as P2,
  headScale: 0.82,
  neck: [1535, 630] as P2,
  hip: [1580, 1240] as P2,
  shoulder: [1322, 712] as P2,
};

const LIGHT: P2 = [-0.9, -0.3];

const TORSO = smoothD([
  [1470, 626],
  [1390, 640],
  [1330, 660],
  [1290, 690, 1],
  [1276, 750],
  [1296, 860],
  [1330, 960],
  [1350, 1060],
  [1356, 1320, 1],
  [1760, 1320, 1],
  [1770, 1060],
  [1790, 960],
  [1822, 860],
  [1842, 760],
  [1830, 700, 1],
  [1770, 664],
  [1690, 640],
  [1600, 626],
]);
const COLLAR_BACK = smoothD([[1450, 628], [1500, 606], [1570, 604], [1622, 626], [1600, 640], [1540, 632], [1476, 640]]);
const COLLAR_FRONT = smoothD([[1446, 630], [1480, 652], [1540, 662], [1604, 650], [1628, 626], [1640, 634], [1610, 666], [1540, 680], [1470, 668], [1436, 640]]);
const PEC_L = smoothD([[1300, 720], [1360, 700], [1450, 700], [1520, 730], [1530, 790], [1470, 820], [1380, 810], [1316, 780]]);
const PEC_R = smoothD([[1560, 720], [1640, 700], [1740, 706], [1808, 740], [1800, 800], [1720, 820], [1610, 812], [1560, 780]]);
const HEM = 'M 1352 1120 C 1450 1132 1650 1132 1768 1118';

const torsoRegions = (): Region[] => [
  {
    d: TORSO,
    tone: (x, y) => {
      // black jersey: deep, with the monitor side (screen-left) catching a little cool light, warm rim on the right
      const cool = 0.2 * clamp((1400 - x) / 160) * clamp((1000 - y) / 300);
      const rim = 0.45 * Math.exp(-((x - 1826 + (y - 760) * 0.12) ** 2) / 160) * clamp((1100 - y) / 400);
      return clamp(0.06 + cool + rim + 0.04 * Math.sin(y * 0.05 + x * 0.01));
    },
    fam: [{angle: 96}, {angle: 30, below: 0.32, weight: 0.9, phase: 0.5}],
  },
  {d: PEC_L, tone: (x, y) => clamp(0.12 + 0.3 * clamp((1480 - x) / 200) * Math.exp(-((y - 740) ** 2) / 1800)), fam: [{angle: 10}], k: 0.9},
  {d: PEC_R, tone: (x, y) => clamp(0.08 + 0.12 * Math.exp(-((y - 736) ** 2) / 900)), fam: [{angle: 170}], k: 0.9},
];

export interface NolePose {
  head?: NoleToneParams;
  jaw?: number;
  /** Lean toward Mas (degrees, negative = toward screen-left). */
  lean?: number;
  headTilt?: number;
  /** Phone arm: shoulder / elbow / wrist angles in degrees (0 = screen-right, 90 = down). */
  a1?: number;
  a2?: number;
  a3?: number;
  cyan?: number;
  warm?: number;
  phoneGlow?: number;
  f?: number;
  pitch: number;
  pitchHead: number;
}

const L1 = 150;
const L2 = 140;
const rad = (a: number) => (a * Math.PI) / 180;
export const armFK = (a1: number, a2: number): {S: P2; E: P2; W: P2} => {
  const S = NOLE.shoulder;
  const E: P2 = [S[0] + L1 * Math.cos(rad(a1)), S[1] + L1 * Math.sin(rad(a1))];
  const W: P2 = [E[0] + L2 * Math.cos(rad(a1 + a2)), E[1] + L2 * Math.sin(rad(a1 + a2))];
  return {S, E, W};
};

/** Fist gripping the phone; local: wrist (0,0), forearm toward +x. */
const FIST = smoothD([[6, -20], [-14, -26], [-36, -24], [-52, -14], [-58, 2], [-52, 18], [-34, 26], [-12, 24], [6, 18]]);
const THUMB = smoothD([[-18, -22], [-34, -34], [-48, -40], [-58, -36], [-50, -28], [-36, -22]]);
const PHONE = 'M -76 -112 Q -76 -122 -66 -122 L -30 -122 Q -20 -122 -20 -112 L -20 -18 Q -20 -8 -30 -8 L -66 -8 Q -76 -8 -76 -18 Z';
const PHONE_SCREEN = 'M -70 -114 L -26 -114 L -26 -16 L -70 -16 Z';

const PhoneArm: React.FC<{a1: number; a2: number; a3: number; pitch: number; cyan: number; warm: number; glow: number}> = ({a1, a2, a3, pitch, cyan, glow}) => {
  const {S, E, W} = armFK(a1, a2);
  // every segment is a rigid printed piece in its own frame (x along the bone), rotated on its pin
  const up = tubeD([0, 0], [L1, 0], 38, 33);
  const sleeve = tubeD([-16, 0], [L1 * 0.7, 0], 52, 45);
  const fore = tubeD([0, 0], [L2, 0], 31, 25);
  const lit: P2 = [0.2, -1];
  const handAng = a1 + a2 + a3 + 180;
  return (
    <g>
      <g transform={`translate(${E[0]} ${E[1]}) rotate(${a1 + a2})`}>
        <Piece id="nole-fore" sil={[{d: fore}]} stock={STOCK.cert} margin={6} shadow={[-5, 7, 6, 0.5]} box={[-50, -50, L2 + 100, 100]}
          over={
            <>
              <Wash id="nole-fore-s" d={fore} color="#E49A7E" opacity={0.42} blur={4} />
              <Wash id="nole-fore-c" d={fore} color="#7FEFFF" opacity={0.3 * glow} blur={16} blend="screen" />
            </>
          }>
          <Engr id="nole-fore" regions={[{d: fore, tone: tubeTone([0, 0], [L2, 0], 31, lit, 0.36, 0.5), fam: [tubeFamily([0, 0], [L2, 0], 33)]}]} pitch={pitch} ink={INK.cert} lines={[{d: fore, w: 1.6}, {d: 'M 4 -14 C 10 -6 12 2 10 12', w: 1.2}]} />
        </Piece>
      </g>
      <g transform={`translate(${S[0]} ${S[1]}) rotate(${a1})`}>
        <Piece id="nole-upper" sil={[{d: up}]} stock={STOCK.cert} margin={6} shadow={[-5, 7, 6, 0.5]} box={[-60, -60, L1 + 120, 120]} over={<Wash id="nole-upper-s" d={up} color="#E49A7E" opacity={0.4} blur={4} />}>
          <Engr id="nole-upper" regions={[{d: up, tone: tubeTone([0, 0], [L1, 0], 38, lit, 0.34, 0.5), fam: [tubeFamily([0, 0], [L1, 0], 40)]}]} pitch={pitch} ink={INK.cert} lines={[{d: up, w: 1.6}]} />
        </Piece>
        {/* sleeve of the black jersey over the upper arm */}
        <Piece id="nole-sleeve" sil={[{d: sleeve}]} stock={STOCK.news} margin={7} shadow={[-5, 7, 6, 0.5]} box={[-90, -80, L1 + 120, 160]} over={<Wash id="nole-sleeve-c" d={sleeve} color="#6FE3F0" opacity={0.25 * cyan} blur={12} blend="screen" />}>
          <Engr id="nole-sleeve" regions={[{d: sleeve, tone: tubeTone([0, 0], [L1 * 0.7, 0], 52, lit, 0.1, 0.3), fam: [tubeFamily([0, 0], [L1 * 0.7, 0], 54), {angle: 60, below: 0.3, phase: 0.5}]}]} pitch={pitch} ink={INK.cat} lines={[{d: sleeve, w: 1.8}, {d: `M ${L1 * 0.62} -40 C ${L1 * 0.66} -10 ${L1 * 0.66} 10 ${L1 * 0.62} 40`, w: 1.2, color: '#55555A'}]} />
        </Piece>
      </g>
      <g transform={`translate(${W[0]} ${W[1]}) rotate(${handAng})`}>
        <Piece id="nole-hand" sil={[{d: FIST}, {d: THUMB}, {d: PHONE}]} stock={STOCK.coated} margin={5} shadow={[-4, 6, 5, 0.5]} box={[-90, -135, 110, 170]}
          over={<Wash id="nole-hand-s" d={FIST + THUMB} color="#E49A7E" opacity={0.45} blur={2.5} />}>
          <path d={PHONE} fill="#15161A" />
          <path d={PHONE} fill="none" stroke="#6C6A66" strokeWidth={2} transform="translate(2 2)" />
          <Engr
            id="nole-hand"
            regions={[
              {d: FIST, tone: (x, y) => clamp(0.6 - 0.35 * clamp((y + 20) / 46) + 0.08 * Math.cos(x * 0.2)), fam: [{angle: 80}], k: 0.85},
              {d: THUMB, tone: () => 0.5, fam: [{angle: 30}], k: 0.85},
            ]}
            pitch={pitch}
            ink={INK.cert}
            lines={[{d: FIST, w: 1.4}, {d: THUMB, w: 1.2}, {d: 'M -30 -24 C -32 -10 -32 4 -30 18 M -44 -20 C -46 -6 -46 6 -42 20', w: 1}]}
          />
        </Piece>
      </g>
    </g>
  );
};

/** The phone screen, emissive (drawn after the night glaze by the scene). */
export const PhoneGlow: React.FC<{a1: number; a2: number; a3: number; glow: number; lean: number; label?: string}> = ({a1, a2, a3, glow, lean, label}) => {
  const {W} = armFK(a1, a2);
  const handAng = a1 + a2 + a3 + 180;
  return (
    <g transform={`rotate(${lean} ${NOLE.hip[0]} ${NOLE.hip[1]})`}>
      <g transform={`translate(${W[0]} ${W[1]}) rotate(${handAng})`}>
        <defs>
          <filter id="phone-bloom" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation={16} />
          </filter>
        </defs>
        <path d={PHONE_SCREEN} fill="#9AF6FF" opacity={0.55 * glow} filter="url(#phone-bloom)" style={{mixBlendMode: 'screen'}} />
        <path d={PHONE_SCREEN} fill="#D9FDFF" opacity={glow} />
        {Array.from({length: 11}, (_, i) => (
          <path key={i} d={`M -70 ${-110 + i * 9} H -26`} stroke="#3AAFC4" strokeWidth={1.1} opacity={0.7} />
        ))}
        {label && (
          <text x={-48} y={-58} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={16} fill="#0E3A44" transform="rotate(-90 -48 -62)">
            {label}
          </text>
        )}
      </g>
    </g>
  );
};

const NearArm: React.FC<{pitch: number; cyan: number}> = ({pitch}) => {
  const S: P2 = [1808, 730];
  const E: P2 = [1834, 920];
  const W: P2 = [1818, 1080];
  const sleeve = tubeD([1800, 700], [1826, 846], 56, 48);
  const upper = tubeD(S, E, 40, 34);
  const fore = tubeD(E, W, 33, 28);
  return (
    <g>
      <Piece id="nole-nupper" sil={[{d: upper}, {d: fore}]} stock={STOCK.cert} margin={6} shadow={[-5, 7, 6, 0.5]} box={[1740, 660, 170, 460]} over={<Wash id="nole-nu-s" d={upper + fore} color="#C9806A" opacity={0.4} blur={4} />}>
        <Engr id="nole-nearArm" regions={[{d: upper, tone: tubeTone(S, E, 40, LIGHT, 0.12, 0.3), fam: [tubeFamily(S, E, 42)]}, {d: fore, tone: tubeTone(E, W, 33, LIGHT, 0.14, 0.3), fam: [tubeFamily(E, W, 35)]}]} pitch={pitch} ink={INK.cert} lines={[{d: upper, w: 1.5}, {d: fore, w: 1.5}]} />
      </Piece>
      <Piece id="nole-nsleeve" sil={[{d: sleeve}]} stock={STOCK.news} margin={7} shadow={[-5, 7, 6, 0.5]} box={[1720, 620, 190, 300]}>
        <Engr id="nole-nsleeve" regions={[{d: sleeve, tone: () => 0.08, fam: [tubeFamily([1800, 700], [1826, 846], 58), {angle: 40, below: 0.4}]}]} pitch={pitch} ink={INK.cat} lines={[{d: sleeve, w: 1.8}]} />
      </Piece>
    </g>
  );
};

export const NoleFigure: React.FC<NolePose> = (p) => {
  const {jaw = 0, lean = 0, headTilt = 0, a1 = 110, a2 = 95, a3 = 0, cyan = 0.4, warm = 0.6, phoneGlow = 1, f = 0, pitch, pitchHead} = p;
  const bT = boil('nole-torso', f);
  const bH = boil('nole-head', f);
  const [hx, hy] = NOLE.head;
  const [nx, ny] = NOLE.neck;
  return (
    <g transform={`rotate(${lean} ${NOLE.hip[0]} ${NOLE.hip[1]})`}>
      <g transform={`translate(${bT[0]} ${bT[1]})`}>
        <NearArm pitch={pitch} cyan={cyan} />
        <Piece id="nole-torso" sil={[{d: TORSO}]} stock={STOCK.news} margin={9} shadow={[-6, 8, 7, 0.5]} box={[1260, 590, 600, 740]}
          over={
            <>
              <Wash id="nole-torso-w" d={TORSO} color="#FF8A3C" opacity={0.3 * warm} blur={30} blend="screen" />
            </>
          }>
          <path d={COLLAR_BACK} fill={INK.cat} />
          <Engr id="nole-torso" regions={torsoRegions()} pitch={pitch} ink={INK.cat} lines={[{d: TORSO, w: 2}, {d: HEM, w: 1.4}, {d: 'M 1420 900 C 1450 930 1470 980 1470 1040 M 1660 910 C 1640 950 1630 1000 1640 1050', w: 1.2, color: '#4A4A50'}]} />
          <text x={1560} y={1170} textAnchor="middle" fontFamily='"Playfair Display", serif' fontStyle="italic" fontSize={19} fill={INK.cat} opacity={0.9} transform="rotate(-1 1560 1170)">
            Fig. 7. — The Man of Industry, in the Patent Athletic Jersey (black).
          </text>
        </Piece>
      </g>
      {/* head + neck on the neck pivot */}
      <g transform={`translate(${bH[0]} ${bH[1]}) rotate(${headTilt + bH[2]} ${nx} ${ny})`}>
        <g transform={`translate(${hx} ${hy}) scale(${NOLE.headScale})`}>
          <NoleHead id="nole" p={p.head} jaw={jaw} pitch={pitchHead / NOLE.headScale} look={{mirror: true, cyan, warm}} />
        </g>
      </g>
      {/* collar front laid over the neck */}
      <g transform={`translate(${bT[0]} ${bT[1]})`}>
        <Piece id="nole-collar" sil={[{d: COLLAR_FRONT}]} stock={STOCK.news} margin={4} shadow={[-3, 4, 3, 0.45]} box={[1420, 600, 240, 100]}>
          <Engr id="nole-collar" regions={[{d: COLLAR_FRONT, tone: (x) => clamp(0.1 + 0.25 * clamp((1520 - x) / 90)), fam: [{angle: 10}]}]} pitch={pitch} ink={INK.cat} lines={[{d: COLLAR_FRONT, w: 1.5}]} />
        </Piece>
        <PhoneArm a1={a1} a2={a2} a3={a3} pitch={pitch} cyan={cyan} warm={warm} glow={phoneGlow} />
      </g>
    </g>
  );
};

/** Flat silhouette for Nole's cast shadow. */
export const NoleSilhouette: React.FC<{lean?: number; headTilt?: number; a1?: number; a2?: number; color?: string}> = ({lean = 0, headTilt = 0, a1 = 110, a2 = 95, color = '#070814'}) => {
  const [hx, hy] = NOLE.head;
  const [nx, ny] = NOLE.neck;
  const {S, E, W} = armFK(a1, a2);
  return (
    <g fill={color} transform={`rotate(${lean} ${NOLE.hip[0]} ${NOLE.hip[1]})`}>
      <path d={TORSO} />
      <path d={tubeD(S, E, 44, 38)} />
      <path d={tubeD(E, W, 30, 26)} />
      <g transform={`rotate(${headTilt} ${nx} ${ny}) translate(${hx} ${hy}) scale(${-NOLE.headScale} ${NOLE.headScale})`}>
        <path d={noleHeadSil()} />
      </g>
    </g>
  );
};

export {ell, polyD};
