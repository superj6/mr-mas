import React from 'react';
import {C, blob, clamp, ell, limb, rr} from './core';
import {Lit, Light} from './lit';

/**
 * MAS MANALT — graphic-shape construction: an egg of a head on a small tapered monolith (a kokeshi, not a
 * cartoon). Almost no features break the silhouette; everything readable lives in the eyes and the light.
 * Two drawings only: SEATED PROFILE (wide / two-shot) and FRONT BUST (close-up, can yaw ±45° by sliding
 * features across the egg — the one move the egg construction gets for free).
 */

export type MasLight = {
  /** monitor key (from screen-left), 0..1 */
  cy: number;
  /** rocket rim (from screen-right), 0..1 */
  rd: number;
};

// ============================================================ SEATED PROFILE (facing screen-left)
export interface MasSeatedProps {
  id: string;
  light: MasLight;
  /** frame used for typing cycle */
  f: number;
  /** 0 = hands still, 1 = typing */
  typing?: number;
  blink?: number;
  /** breathing phase driver (frame) */
  breathe?: number;
  /** when true, draws flat silhouette only (for cast shadows) */
  sil?: boolean;
  silColor?: string;
}

const HEAD_P: [number, number][] = [
  [0, -302], [40, -294], [62, -264], [66, -228], [52, -194], [26, -180], [-6, -172], [-34, -176], [-50, -188],
  [-56, -201], [-58, -211], [-61, -217], [-69, -226], [-61, -236], [-60, -250], [-58, -266], [-50, -284], [-28, -298],
];
const HAIR_P: [number, number][] = [
  [-54, -276], [-46, -294], [-20, -308], [22, -306], [54, -290], [70, -258], [70, -222], [56, -196], [40, -200],
  [30, -216], [14, -222], [8, -242], [-10, -262], [-34, -272],
];
const COWLICK_P: [number, number][] = [
  [-26, -300], [-50, -310], [-74, -312], [-92, -304], [-97, -290], [-89, -280], [-84, -291], [-72, -297], [-52, -294], [-36, -286],
];
const BODY_P: [number, number][] = [
  [-6, -178], [-28, -171], [-40, -146], [-48, -100], [-52, -50], [-50, -10], [-40, 8], [36, 10], [54, -14], [58, -70],
  [54, -130], [44, -164], [24, -184],
];
const HOOD_P: [number, number][] = [[-4, -192], [24, -206], [52, -196], [60, -170], [44, -154], [14, -164]];

const armD = (handY: number) => [limb(-26, -92, -138, -80 + handY, 26, 20), ell(-146, -79 + handY, 14, 10)];

export const masSeatedSilhouette = (handY = 0) => [
  blob(HEAD_P),
  blob(HAIR_P),
  blob(COWLICK_P),
  blob(BODY_P),
  blob(HOOD_P),
  ...armD(handY),
  limb(-8, -4, -100, -8, 42, 34),
  limb(-100, -8, -98, 116, 30, 24),
  rr(-130, 110, 46, 16, 7),
];

export const MasSeated: React.FC<MasSeatedProps> = ({id, light, f, typing = 1, blink = 0, breathe = 0, sil, silColor}) => {
  // typing: two hands, alternating taps on twos, with little rests (deterministic pattern)
  const pat = [0, 1, 0, 2, 1, 0, 2, 0, 1, 2, 0, 0];
  const beat = Math.floor(f / 2);
  const hit = pat[beat % pat.length];
  const nearY = typing * (hit === 1 ? -4 : 0);
  const farY = typing * (hit === 2 ? -4 : 0);
  const br = Math.sin(breathe * 0.12) * 1.2;

  if (sil) {
    return (
      <g fill={silColor ?? '#000'}>
        {masSeatedSilhouette(nearY).map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    );
  }

  const cyK = 12 + 14 * light.cy; // lit face plane width
  const cyR = 3 + 4 * light.cy; // rim width on the body
  const rdR = 3 + 5 * light.rd;
  const rims = (lit: string, k = cyR): Light[] => [
    {color: lit, shift: [k, 1], opacity: clamp(light.cy * 1.4)},
    {color: C.rd2, shift: [-rdR, 0], opacity: clamp(light.rd * 1.5)},
  ];
  const open = 1 - clamp(blink);
  const lidY = -252 + 9 * (1 - open) + 3;

  return (
    <g>
      {/* far leg + far arm, in shadow */}
      <path d={limb(2, -4, -92, -12, 40, 32)} fill={C.night0} />
      <path d={limb(-92, -12, -90, 112, 28, 22)} fill={C.night0} />
      <path d={rr(-118, 106, 44, 15, 7)} fill={C.void} />
      <path d={limb(-30, -94, -150, -86 + farY, 24, 18)} fill={C.masHoodDeep} />
      <Lit id={`${id}-fh`} d={ell(-158, -85 + farY, 13, 9)} base={C.masSkinShadow} lights={[{color: C.masSkinMid, shift: [5, 2], opacity: light.cy}]} />

      {/* near leg (dark trousers) */}
      <Lit id={`${id}-lg`} d={[limb(-8, -4, -100, -8, 42, 34), limb(-100, -8, -98, 116, 30, 24)]} base={C.night1} lights={[{color: C.cy1, shift: [0, 6], opacity: light.cy * 0.8}, ...rims(C.cy1)]} />
      <Lit id={`${id}-ft`} d={rr(-130, 110, 46, 16, 7)} base={C.void} lights={[{color: C.cy1, shift: [6, 3], opacity: light.cy}]} />

      {/* body monolith (breathes) */}
      <g transform={`translate(0 ${-br}) scale(1 ${1 + br * 0.004})`}>
        <Lit id={`${id}-bd`} d={[blob(BODY_P), blob(HOOD_P)]} base={C.masHood} lights={rims(C.masHoodLit, cyR + 2)}>
          {/* designed form shadow down the back */}
          <path d={blob([[26, -196], [62, -160], [64, -60], [56, 14], [28, 14], [36, -60], [34, -150]])} fill={C.masHoodDeep} />
          {/* hood fold */}
          <path d={blob([[-2, -190], [22, -200], [44, -190], [34, -178], [12, -176]])} fill={C.masHoodDeep} />
          {/* sleeve seam: upper arm reads inside the monolith, no outline */}
          <path d={limb(-16, -152, -24, -96, 4, 3)} fill={C.masHoodDeep} opacity={0.8} />
          <path d={rr(-44, -160, 3, 34, 1.5)} fill={C.cy3} opacity={0.7 * light.cy} />
        </Lit>

        {/* near forearm + hand */}
        <Lit id={`${id}-fa`} d={armD(nearY)[0]} base={C.masHood} lights={[{color: C.masHoodLit, shift: [2, 7], opacity: light.cy}]} />
        <Lit id={`${id}-nh`} d={armD(nearY)[1]} base={C.masSkinMid} lights={[{color: C.masSkinLit, shift: [7, 4], opacity: light.cy}]} />

        {/* head */}
        <path d={rr(-20, -196, 34, 26, 8)} fill={C.masSkinShadow} />
        <Lit
          id={`${id}-head`}
          d={blob(HEAD_P)}
          base={C.masSkinShadow}
          lights={[
            {color: C.masSkinMid, shift: [cyK + 8, 0], opacity: 1},
            {color: C.masSkinLit, shift: [cyK, 1], opacity: clamp(light.cy * 1.3)},
            {color: C.rd2, shift: [-rdR, 0], opacity: clamp(light.rd * 1.5)},
          ]}
        >
          {/* eye: calm, a glint of monitor */}
          <defs>
            <clipPath id={`${id}-eyec`}>
              <path d="M -58 -245 Q -48 -254 -36 -251 Q -36 -244 -38 -239 Q -48 -238 -58 -245 Z" />
            </clipPath>
          </defs>
          <path d="M -58 -245 Q -48 -254 -36 -251 Q -36 -244 -38 -239 Q -48 -238 -58 -245 Z" fill={C.masEye} />
          <g clipPath={`url(#${id}-eyec)`}>
            <path d={ell(-50, -245, 6, 7)} fill={C.masIris} />
            <rect x={-55} y={-247} width={3} height={3} fill={C.cyHot} opacity={light.cy} />
            <path d={`M -62 -260 L -30 -260 L -30 ${lidY - 1} Q -46 ${lidY + 2} -62 ${lidY + 1} Z`} fill={C.masSkinMid} />
          </g>
          <path d="M -62 -259 Q -50 -263 -36 -260 Q -50 -258 -62 -256 Z" fill={C.masHair} />
          <path d="M -58 -204 Q -52 -202 -47 -206 Q -52 -200 -58 -202 Z" fill={C.masSkinShadow} />
        </Lit>
        <Lit id={`${id}-hair`} d={[blob(HAIR_P), blob(COWLICK_P)]} base={C.masHair} lights={[{color: C.masHairLit, shift: [6, 4], opacity: light.cy}, {color: C.rd1, shift: [-rdR, 0], opacity: clamp(light.rd * 1.5)}]}>
          {/* two cut-paper lock shapes break the helmet read */}
          <path d="M -40 -296 C -10 -306 30 -300 52 -284 C 26 -292 -8 -294 -40 -288 Z" fill={C.masHairLit} opacity={0.75 * light.cy} />
          <path d="M 30 -262 C 48 -256 60 -238 62 -214 C 52 -232 42 -246 30 -254 Z" fill={C.void} opacity={0.5} />
          <path d="M 4 -250 L 14 -226 L 8 -214 L 0 -232 Z" fill={C.void} opacity={0.4} />
        </Lit>
        {/* the ear sits ON the hair edge: it is what stops the head reading as a helmet */}
        <Lit id={`${id}-ear`} d={ell(10, -224, 10, 14)} base={C.masSkinShadow} lights={[{color: C.masSkinMid, shift: [5, 0], opacity: light.cy}, {color: C.rd2, shift: [-4, 0], opacity: clamp(light.rd * 1.4)}]}>
          <path d={ell(12, -223, 5, 8)} fill={C.void} opacity={0.4} />
        </Lit>
      </g>
    </g>
  );
};

// ============================================================ FRONT BUST (close-up)
export interface MasBustProps {
  id: string;
  light: MasLight;
  /** yaw in radians, + = turning toward screen-right */
  yaw?: number;
  lookX?: number;
  lookY?: number;
  blink?: number;
  smile?: number;
  mouth?: 'rest' | 's' | 'oo' | 'p' | 'er';
  brow?: number;
  tilt?: number;
  /** width of the key-light shadow crescent (bigger = more of the face in shadow) */
  key?: number;
}

const RX = 138;
const RY = 156;
const CY = -24; // cranium centre y

/** project a point on the egg: longitude phi (0 = nose), normalised height yN (-1 top .. 1 bottom) */
const pj = (phi: number, yN: number, yaw: number, r = 1) => {
  const a = phi + yaw;
  const w = Math.sqrt(Math.max(0, 1 - yN * yN));
  return {x: RX * r * w * Math.sin(a), y: CY + RY * yN, c: Math.cos(a)};
};
const yn = (y: number) => (y - CY) / RY;

const almond = (cx: number, cy: number, rx: number, ry: number) =>
  `M ${cx - rx} ${cy + ry * 0.15} C ${cx - rx * 0.6} ${cy - ry * 1.0} ${cx + rx * 0.35} ${cy - ry * 1.15} ${cx + rx} ${cy - ry * 0.05} C ${cx + rx * 0.55} ${cy + ry * 0.95} ${cx - rx * 0.45} ${cy + ry * 1.0} ${cx - rx} ${cy + ry * 0.15} Z`;

export const MasBust: React.FC<MasBustProps> = ({
  id,
  light,
  yaw = 0,
  lookX = 0,
  lookY = 0,
  blink = 0,
  smile = 0,
  mouth = 'rest',
  brow = 0,
  tilt = 0,
  key = 84,
}) => {
  const s = Math.sin(yaw);
  const jx = 26 * s;
  const headD = `${ell(0, CY, RX, RY)} ${ell(jx, 46, 106, 112)}`;
  const rdR = 3 + 11 * light.rd + 120 * Math.max(0, s) * light.rd; // turning INTO the rocket glow
  const rdB = 3 + 11 * light.rd;

  // ---- hair: projected hairline with three soft fringe locks, flat-ish crown
  const hl = (phi: number) => {
    let v = -0.52 + 0.2 * (1 - Math.cos(phi)) + 0.12 * Math.max(0, Math.abs(phi) - 1.1) + 0.3 * Math.max(0, Math.abs(phi) - 1.5);
    for (const [c, dep] of [[-0.62, 0.05], [-0.3, 0.13], [0.3, 0.04]] as [number, number][]) {
      const d = (phi - c) / 0.26;
      v += dep * Math.max(0, 1 - d * d);
    }
    return v;
  };
  const pts: string[] = [];
  const N = 40;
  let first = {x: 0, y: 0};
  let last = {x: 0, y: 0};
  for (let i = 0; i <= N; i++) {
    const a = -Math.PI / 2 + (Math.PI * i) / N;
    const q = pj(a - yaw, hl(a - yaw), yaw, 1.02);
    if (i === 0) first = q;
    if (i === N) last = q;
    pts.push(`${i === 0 ? 'M' : 'L'} ${q.x.toFixed(1)} ${q.y.toFixed(1)}`);
  }
  // crown: the egg's top pushed out by three soft lobes of hair that slide with the yaw
  const tR = Math.atan2(CY - last.y, last.x + 8);
  let tL = Math.atan2(CY - first.y, first.x - 8);
  if (tL < tR) tL += Math.PI * 2;
  const top: string[] = [];
  for (let j = 0; j <= 28; j++) {
    const t = tR + ((tL - tR) * j) / 28;
    const l = 0.045 * Math.pow(Math.max(0, Math.sin(3.2 * (t - yaw * 0.6) - 0.4)), 2) * Math.sin(Math.min(Math.PI, Math.max(0, t)));
    top.push(`L ${((RX + 11) * (1 + l) * Math.cos(t)).toFixed(1)} ${(CY - (RY + 17) * (1 + l) * Math.sin(t)).toFixed(1)}`);
  }
  const hairD = `${pts.join(' ')} ${top.join(' ')} Z`;

  // forward cowlick: one lock that lifts off the hairline and hooks forward over the forehead
  const cw = pj(-0.2, hl(-0.2) + 0.02, yaw, 1.02);
  const k = 0.95 * (1 - 0.3 * Math.abs(s));
  const cowD = blob(
    (
      [
        [-30, -2], [-22, -24], [-2, -36], [22, -32], [38, -16], [43, 6], [38, 28], [31, 42], [27, 26], [22, 8], [10, -6], [-6, -8], [-18, 4],
      ] as [number, number][]
    ).map(([x, y]) => [cw.x + x * k + 10 * s, cw.y + y] as [number, number]),
  );

  // ---- features
  const eyes = [-0.47, 0.47].map((phi) => pj(phi, yn(14), yaw, 0.99));
  const eyeRX = 36;
  const eyeRY = 17;
  const brows = [-0.49, 0.49].map((phi) => pj(phi, yn(-26 - brow * 8), yaw, 1.0));
  const nose = pj(0, yn(60), yaw, 1.0);
  const noseTop = pj(0, yn(18), yaw, 1.0);
  const mo = pj(0, yn(100), yaw, 1.0);
  const ears = [-1.62, 1.62].map((phi) => ({...pj(phi, yn(20), yaw, 1.0), phi}));
  const termX = RX - key; // where the terminator crosses the face

  const earEl = (e: {x: number; y: number; c: number; phi: number}, i: number) => {
    const side = e.phi < 0 ? -1 : 1;
    const w = 9 + 12 * Math.max(0, e.c);
    const x = e.x + side * 8 * (1 - Math.max(0, e.c));
    return (
      <Lit
        key={i}
        id={`${id}-ear${i}`}
        d={ell(x, e.y + 8, w, 27)}
        base={x < termX ? C.masSkinLit : C.masSkinShadow}
        lights={side < 0 ? [{color: C.masSkinMid, shift: [-5, 0], opacity: 1}] : [{color: C.rd2, shift: [-4, 0], opacity: clamp(light.rd * 1.4)}]}
      >
        <path d={ell(x + side * w * 0.1, e.y + 10, w * 0.42, 15)} fill={x < termX ? C.masSkinMid : C.masSkinShadow} />
      </Lit>
    );
  };
  const earsBehind = ears.filter((e) => e.c < 0.3);
  const earsFront = ears.filter((e) => e.c >= 0.3);

  // ---- mouth (tiny: this man does not emote with his mouth)
  const mw = 20 * (0.6 + 0.4 * Math.max(0.2, mo.c));
  const mx = mo.x + 4 * s;
  const my = mo.y;
  const lift = 5.5 * smile;
  const mInk = mx > RX - rdR - 30 ? C.void : C.masSkinShadow; // stays legible when the mouth crosses into the red
  let mouthEl: React.ReactNode;
  if (mouth === 'oo') {
    mouthEl = <path d={ell(mx, my + 2, 6.5, 7.5)} fill={mInk} />;
  } else if (mouth === 's') {
    mouthEl = (
      <g>
        <path d={`M ${mx - mw * 0.85} ${my - lift * 0.6} Q ${mx} ${my + 3} ${mx + mw * 0.85} ${my - lift * 0.7} Q ${mx} ${my + 11} ${mx - mw * 0.85} ${my - lift * 0.6} Z`} fill={mInk} />
        <path d={`M ${mx - mw * 0.55} ${my + 2.5} Q ${mx} ${my + 5} ${mx + mw * 0.55} ${my + 2.5} L ${mx + mw * 0.45} ${my + 5} Q ${mx} ${my + 7} ${mx - mw * 0.45} ${my + 5} Z`} fill={C.masEye} opacity={0.85} />
      </g>
    );
  } else if (mouth === 'er') {
    mouthEl = <path d={`M ${mx - mw * 0.7} ${my} Q ${mx} ${my - 2} ${mx + mw * 0.7} ${my} Q ${mx} ${my + 10} ${mx - mw * 0.7} ${my} Z`} fill={mInk} />;
  } else if (mouth === 'p') {
    mouthEl = <path d={`M ${mx - mw * 0.8} ${my + 1} Q ${mx} ${my + 2.5} ${mx + mw * 0.8} ${my + 1} Q ${mx} ${my + 5.5} ${mx - mw * 0.8} ${my + 1} Z`} fill={mInk} />;
  } else {
    mouthEl = (
      <path
        d={`M ${mx - mw} ${my - lift} Q ${mx} ${my + 3 + lift * 0.2} ${mx + mw} ${my - lift * 1.2} Q ${mx} ${my + 7 + lift * 0.3} ${mx - mw} ${my - lift} Z`}
        fill={mInk}
      />
    );
  }

  const tipOff = 22 * s;
  const noseShadow = `M ${noseTop.x + 4} ${noseTop.y} C ${noseTop.x + 9} ${noseTop.y + 18} ${nose.x + tipOff + 12} ${nose.y - 12} ${nose.x + tipOff + 10} ${nose.y + 4} C ${nose.x + tipOff + 6} ${nose.y + 13} ${nose.x - 4} ${nose.y + 14} ${nose.x - 13} ${nose.y + 9} C ${nose.x - 2} ${nose.y + 6} ${nose.x + tipOff * 0.5 + 3} ${nose.y - 8} ${noseTop.x + 4} ${noseTop.y} Z`;

  const eyeEl = (e: {x: number; y: number; c: number}, i: number) => {
    const rx = eyeRX * (0.4 + 0.6 * Math.max(0, e.c));
    const d = almond(e.x, e.y, rx, eyeRY);
    const irisX = e.x + lookX * rx * 0.55 + 4 * s;
    const irisY = e.y + lookY * 5 + 1;
    const open = clamp(1 - blink);
    // calm upper lid: rests ~40% down, closes on blink
    const top = e.y - eyeRY * 1.2;
    const lidY = top + (0.36 + 0.76 * (1 - open)) * eyeRY * 2.3;
    const shadowSide = e.x > termX - 6;
    const skin = shadowSide ? C.masSkinShadow : C.masSkinLit;
    return (
      <g key={i}>
        <defs>
          <clipPath id={`${id}-eye${i}`}>
            <path d={d} />
          </clipPath>
        </defs>
        <path d={d} fill={shadowSide ? C.cy1 : C.masEye} />
        <g clipPath={`url(#${id}-eye${i})`}>
          <circle cx={irisX} cy={irisY} r={16} fill={C.masIris} />
          <circle cx={irisX} cy={irisY} r={8} fill={C.void} />
          <rect x={irisX - 8} y={irisY - 3} width={6} height={4} fill={C.cyHot} opacity={0.95 * light.cy} />
          {/* lid: skin shape with a dark lash band on its edge */}
          <path d={`M ${e.x - rx - 4} ${top - 10} L ${e.x + rx + 4} ${top - 10} L ${e.x + rx + 4} ${lidY - 1.5} Q ${e.x} ${lidY + 3} ${e.x - rx - 4} ${lidY + 1.5} Z`} fill={C.masSkinShadow} />
          <path d={`M ${e.x - rx - 4} ${top - 10} L ${e.x + rx + 4} ${top - 10} L ${e.x + rx + 4} ${lidY - 5.5} Q ${e.x} ${lidY - 1} ${e.x - rx - 4} ${lidY - 2.5} Z`} fill={shadowSide ? C.masSkinShadow : blink > 0.5 ? C.masSkinLit : C.masSkinMid} />
        </g>
        {/* soft lid crease above: a sliver of mid tone */}
        <path d={`M ${e.x - rx * 0.9} ${e.y - eyeRY * 0.9} Q ${e.x} ${e.y - eyeRY * 2.1} ${e.x + rx * 0.95} ${e.y - eyeRY * 0.8} Q ${e.x} ${e.y - eyeRY * 1.6} ${e.x - rx * 0.9} ${e.y - eyeRY * 0.9} Z`} fill={shadowSide ? C.masSkinShadow : C.masSkinMid} opacity={0.8} />
        {/* skin under-eye plane keeps it calm, not tired */}
        <path d={`M ${e.x - rx} ${e.y + 3} Q ${e.x} ${e.y + eyeRY * 1.5} ${e.x + rx} ${e.y + 1} Q ${e.x} ${e.y + eyeRY * 1.05} ${e.x - rx} ${e.y + 3} Z`} fill={skin} opacity={0.0} />
      </g>
    );
  };

  const browEl = (b: {x: number; y: number; c: number}, i: number) => {
    const w = 32 * (0.4 + 0.6 * Math.max(0, b.c));
    const inner = i === 0 ? 1 : -1; // inner end slightly higher: patient, neutral
    return (
      <path
        key={i}
        d={`M ${b.x - w} ${b.y + 4 + inner * 1.5} Q ${b.x - w * 0.2} ${b.y - 6} ${b.x + w} ${b.y + 2 - inner * 1.5} Q ${b.x} ${b.y + 5} ${b.x - w} ${b.y + 4 + inner * 1.5} Z`}
        fill={C.masHair}
      />
    );
  };

  const headLights: Light[] = [
    {color: C.masSkinMid, shift: [-(key + 24), 0], opacity: clamp(1 - 1.8 * Math.max(0, s))},
    {color: C.masSkinShadow, shift: [-Math.max(rdR + 18, key * (1 - 0.8 * Math.max(0, s))), 0]},
    {color: C.rd2, shift: [-rdR, 0], opacity: clamp(light.rd * 1.4)},
  ];
  const tk = key * 1.9;

  return (
    <g>
      {/* torso: one sloped monolith, the hood bunched into its silhouette behind the neck */}
      <Lit
        id={`${id}-torso`}
        d={blob([[-240, 700], [-236, 430], [-214, 324], [-164, 270], [-126, 236], [-100, 186], [-44, 166], [44, 166], [100, 186], [126, 236], [164, 270], [214, 324], [236, 430], [240, 700], [0, 720]])}
        base={C.masHoodLit}
        lights={[
          {color: C.masHoodDeep, shift: [-tk, 0]},
          {color: C.rd2, shift: [-rdB - 3, 0], opacity: clamp(light.rd * 1.4)},
        ]}
      >
        {/* the hood's bunched roll: one designed shadow shape, no outline */}
        <path d={blob([[-128, 240], [-104, 206], [-50, 190], [50, 190], [104, 206], [128, 240], [100, 228], [50, 212], [-50, 212], [-100, 228]])} fill={C.masHood} opacity={0.9} />
      </Lit>
      {/* neck, with the jaw's cast shadow */}
      <Lit id={`${id}-neck`} d={rr(-31 + jx * 0.45, 112, 62, 130, 20)} base={C.masSkinShadow} lights={[{color: C.masSkinMid, shift: [16, 0], opacity: light.cy}]}>
        <path d={ell(jx, 98, 110, 100)} fill={C.masSkinShadow} />
      </Lit>
      {/* neckline: the hoodie closes over the base of the neck in a soft V */}
      <Lit
        id={`${id}-nl`}
        d={'M -140 214 Q -70 214 -30 232 L 0 272 L 30 232 Q 70 214 140 214 L 240 700 L -240 700 Z'}
        base={C.masHoodLit}
        lights={[{color: C.masHoodDeep, shift: [-tk, 0]}, {color: C.masHood, shift: [0, -10], opacity: 0.9}]}
      />
      {/* drawstrings */}
      <path d={rr(-26, 250, 6, 110, 3)} fill={C.cy3} opacity={0.85} />
      <path d={rr(22, 250, 6, 96, 3)} fill={C.masHood} />
      <path d={rr(-27, 356, 8, 22, 3)} fill={C.creamDim} />
      <path d={rr(21, 342, 8, 22, 3)} fill={C.masHoodDeep} />

      {/* head group (tilt) */}
      <g transform={`rotate(${tilt} 0 150)`}>
        {earsBehind.map(earEl)}
        <Lit id={`${id}-head`} d={headD} base={C.masSkinLit} lights={headLights}>
          {/* hair's cast shadow on the forehead */}
          <path d={hairD} fill={C.masSkinMid} transform="translate(-10 7)" />
          {eyes.map(eyeEl)}
          {brows.map(browEl)}
          <path d={noseShadow} fill={C.masSkinMid} />
          <path d={ell(nose.x + tipOff * 0.6 - 2, nose.y + 2, 5, 3.5)} fill={C.masSkinHot} opacity={0.85 * light.cy} />
          {mouthEl}
          {/* under-lip + chin plane */}
          <path d={ell(mx + 2, my + 20, 16, 5)} fill={C.masSkinMid} opacity={0.55} />
        </Lit>
        {earsFront.map(earEl)}
        <Lit
          id={`${id}-hair`}
          d={hairD}
          base={C.masHair}
          lights={[{color: C.masHairLit, shift: [16, 16], opacity: light.cy}, {color: C.rd1, shift: [-rdB - 4 - 10 * Math.max(0, s), 2], opacity: clamp(light.rd * 1.4)}]}
        />
        <Lit
          id={`${id}-cow`}
          d={cowD}
          base={C.masHair}
          lights={[{color: C.masHairLit, shift: [7, 9], opacity: light.cy}, {color: C.rd1, shift: [-5, 0], opacity: clamp(light.rd * s * 2)}]}
        />
      </g>
    </g>
  );
};
