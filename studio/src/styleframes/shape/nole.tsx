import React from 'react';
import {C, P, clamp, ell, limb, rr, rot} from './core';
import {Lit, Light} from './lit';

/**
 * NOLE — a towering wedge. Construction: an inverted trapezoid torso (shoulders ~3.5x the waist), stilt legs,
 * a small cranium riding on a chin block that is bigger than the skull. Hair swept back like a tail fin.
 * Rig: hip pivot (lean), neck pivot, shoulder + elbow pivots (the phone arm), hinged jaw with replacement
 * mouth interiors, 3 eye states. Two drawings: PROFILE (facing screen-left) and FRONT (doorway / hero).
 */

export type NoleLight = {rd: number; cy: number; phone: number};
export type NoleMouth = 'm' | 'ai' | 'ee' | 'oh' | 'k' | 'grin';

export interface NoleProfileProps {
  id: string;
  light: NoleLight;
  lean?: number; // degrees, + = forward (toward screen-left)
  head?: number; // degrees, + = chin down / toward Mas
  sh?: number; // shoulder angle, degrees forward from hanging
  el?: number; // elbow bend, degrees
  mouth?: NoleMouth;
  eyes?: 'open' | 'smug' | 'wide';
  squash?: number; // landing squash 0..1
  /** IK target for the phone hand, in Nole-local coords (feet at 0,0). Overrides sh/el. */
  reach?: [number, number];
  elbowUp?: boolean;
  sil?: boolean;
  silColor?: string;
}

const HIP: [number, number] = [0, -300];
// torso in hip-local coords (origin at the hip)
const TORSO = 'M -46 6 L 48 6 L 150 -278 Q 162 -318 110 -330 Q 20 -338 -60 -350 Q -150 -354 -200 -320 Q -226 -302 -216 -282 Z';
const BELT = 'M -52 -6 L 52 -6 L 50 16 L -50 16 Z';
const NECK_PIVOT: [number, number] = [-112, -326];

// head in neck-local coords (origin = top of the neck), facing left. NUTCRACKER construction:
// the chin block is a separate slab that DROPS to talk (no mouth drawing needed on the face).
const HEAD_UP =
  'M -94 -52 L -96 -58 L -88 -64 L -110 -78 L -88 -94 L -92 -100 C -92 -110 -86 -118 -80 -122 C -66 -144 -34 -154 -2 -152 C 26 -150 44 -132 46 -106 C 48 -90 46 -76 42 -64 L 22 -60 Z';
const JAW =
  'M -98 -54 L 22 -62 L 44 -62 L 46 -8 C 46 2 40 8 30 8 L -88 8 C -100 8 -106 0 -106 -10 L -106 -44 C -106 -50 -104 -54 -98 -54 Z';
const HAIR =
  'M -86 -114 C -92 -128 -80 -146 -46 -154 C -10 -162 30 -156 56 -140 C 70 -130 80 -118 86 -104 C 72 -108 62 -104 54 -98 C 50 -94 46 -90 42 -88 C 40 -110 24 -124 -2 -128 C -30 -130 -58 -124 -86 -114 Z';

const OPEN: Record<NoleMouth, number> = {m: 0, ai: 20, ee: 7, oh: 14, k: 9, grin: 5};

export const NoleProfile: React.FC<NoleProfileProps> = ({
  id,
  light,
  lean = 0,
  head = 0,
  sh = 20,
  el = 30,
  mouth = 'm',
  eyes = 'open',
  squash = 0,
  reach,
  elbowUp,
  sil,
  silColor = '#000',
}) => {
  const rdK = 4 + 12 * light.rd; // red key from behind (screen-right)
  const cyK = 2 + 4 * light.cy; // cyan edge from the monitor (screen-left)
  const f = (a: string) => (sil ? silColor : a);
  const Lx = (base: string, lights: Light[]) => ({base: sil ? silColor : base, lights: sil ? [] : lights});
  const rimT: Light[] = [
    {color: C.rd1, shift: [-(rdK + 8), 0], opacity: clamp(light.rd * 1.2)},
    {color: C.rd2, shift: [-rdK, 2], opacity: clamp(light.rd * 1.3)},
    {color: C.cy1, shift: [cyK, 0], opacity: clamp(light.cy)},
  ];
  const rimS: Light[] = [
    {color: C.noleSkinMid, shift: [-(rdK + 16), 0], opacity: clamp(light.rd * 1.2)},
    {color: C.noleSkinLit, shift: [-(rdK + 2), 1], opacity: clamp(light.rd * 1.3)},
    {color: C.cy1, shift: [cyK, 0], opacity: clamp(light.cy)},
  ];
  // single hard rims for the big masses (a double rim reads as an outline at this scale)
  const rimT1: Light[] = [
    {color: C.rd2, shift: [-rdK, 2], opacity: clamp(light.rd * 1.3)},
    {color: C.cy1, shift: [cyK, 0], opacity: clamp(light.cy)},
  ];
  const rimS1: Light[] = [
    {color: C.noleSkinMid, shift: [-(rdK + 2), 1], opacity: clamp(light.rd * 1.3)},
    {color: C.cy1, shift: [cyK, 0], opacity: clamp(light.cy)},
  ];

  // arm chain in torso-local coords
  const S: [number, number] = [-156, -284];
  if (reach) {
    const r = (lean * Math.PI) / 180;
    const dx = reach[0] - HIP[0];
    const dy = reach[1] - HIP[1];
    const tx = dx * Math.cos(r) - dy * Math.sin(r);
    const ty = dx * Math.sin(r) + dy * Math.cos(r);
    const vx = tx - S[0];
    const vy = ty - S[1];
    const L1 = 150;
    const L2 = 166;
    const d = clamp(Math.hypot(vx, vy), 30, L1 + L2 - 2);
    const phi = Math.atan2(-vx, vy);
    const A = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
    const B = Math.acos(clamp((L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2), -1, 1));
    sh = ((elbowUp ? phi + A : phi - A) * 180) / Math.PI;
    el = (elbowUp ? -1 : 1) * (180 - (B * 180) / Math.PI);
  }
  const E = rot(S[0], S[1] + 150, sh, S[0], S[1]);
  const Hn = rot(E[0], E[1] + 136, sh + el, E[0], E[1]);
  const sleeve = rot(S[0], S[1] + 70, sh, S[0], S[1]);
  const handAng = sh + el;
  const open = OPEN[mouth];
  const sq = 1 - 0.06 * squash;
  const sx = 1 + 0.05 * squash;

  const eyeEl =
    eyes === 'smug' ? (
      <path d="M -88 -96 Q -76 -90 -62 -97 Q -76 -93 -88 -94 Z" fill={C.void} />
    ) : (
      <g>
        <path d={eyes === 'wide' ? ell(-74, -96, 8, 7) : 'M -90 -100 L -62 -101 L -64 -92 L -87 -92 Z'} fill={C.void} />
        <rect x={-84} y={-99} width={4} height={4} fill={light.phone > 0.3 ? C.phoneGlow : C.rd3} />
      </g>
    );

  return (
    <g transform={`scale(${sx} ${sq})`}>
      {/* far leg + shoe */}
      <path d={limb(16, -300, 24, -18, 52, 30)} fill={f(C.noleTee)} />
      <path d={rr(-6, -24, 72, 24, 10)} fill={f(C.void)} />
      {/* near leg + shoe */}
      <Lit id={`${id}-leg`} d={limb(-6, -300, -12, -18, 58, 32)} {...Lx(C.noleTeeMid, [{color: C.rd1, shift: [-8, 0], opacity: light.rd}, {color: C.cy0, shift: [4, 0], opacity: light.cy}])} />
      <Lit id={`${id}-shoe`} d={rr(-66, -24, 80, 24, 10)} {...Lx(C.void, [{color: C.rd1, shift: [-6, 6], opacity: light.rd}])} />

      {/* torso group: leans about the hip */}
      <g transform={`translate(${HIP[0]} ${HIP[1]}) rotate(${-lean})`}>
        {/* far arm: hand on hip, elbow out behind (silhouette notch) */}
        <Lit id={`${id}-torso`} d={[TORSO, limb(112, -290, 200, -172, 60, 48), limb(200, -172, 64, -44, 48, 40)]} {...Lx(C.noleTee, rimT1)}>
          {!sil ? (
            <>
              {/* pec plane: a hard designed shape catching a sliver of monitor */}
              <path d="M -214 -300 L -64 -304 Q -44 -252 -96 -206 L -178 -192 Z" fill={C.noleTeeMid} />
              <path d="M -214 -300 L -200 -300 L -172 -196 L -178 -192 Z" fill={C.cy0} opacity={light.cy} />
              {/* collar + back seam catching red */}
              <path d="M -150 -336 Q -112 -304 -60 -332 L -66 -338 Q -110 -316 -140 -338 Z" fill={C.rd0} opacity={light.rd} />
            </>
          ) : null}
        </Lit>
        <path d={BELT} fill={f(C.void)} />

        {/* neck + head */}
        <g transform={`translate(${NECK_PIVOT[0]} ${NECK_PIVOT[1]}) rotate(${-head}) scale(0.94)`}>
          <Lit id={`${id}-neck`} d={'M -40 14 L 38 14 L 34 -30 L -36 -30 Z'} {...Lx(C.noleSkinShadow, [{color: C.rd1, shift: [-6, 0], opacity: light.rd}])} />
          <g transform="translate(-2 -22)">
            {/* mouth interior: a dark slot + teeth bars, revealed as the slab drops */}
            {open > 0.5 && !sil ? (
              <g>
                <path d={P([[-96, -60], [30, -64], [30, -58 + open], [-98, -54 + open]])} fill={C.void} />
                {mouth !== 'oh' ? <path d={P([[-94, -58], [-50, -60], [-50, -54], [-94, -53]])} fill={C.cream} /> : null}
                {mouth === 'ee' || mouth === 'grin' ? <path d={P([[-96, -56 + open], [-52, -58 + open], [-52, -53 + open], [-96, -52 + open]])} fill={C.creamDim} /> : null}
              </g>
            ) : null}
            {/* chin slab */}
            <g transform={`translate(${-open * 0.12} ${open}) rotate(${-open * 0.25} 40 -60)`}>
              <Lit id={`${id}-jaw`} d={JAW} {...Lx(C.noleSkinShadow, rimS)}>
                {!sil ? (
                  <>
                    <path d="M -110 -40 L -84 -40 L -84 12 L -110 12 Z" fill={C.phoneGlow} opacity={0.42 * light.phone} />
                    {/* jaw underside plane: the block reads as a block */}
                    <path d="M -110 -4 L 50 -4 L 50 12 L -110 12 Z" fill={C.void} opacity={0.4} />
                    {/* cleft */}
                    <path d="M -108 -28 L -98 -28 L -98 -18 L -108 -18 Z" fill={C.void} opacity={0.35} />
                  </>
                ) : null}
              </Lit>
            </g>
            <Lit id={`${id}-head`} d={HEAD_UP} {...Lx(C.noleSkinShadow, rimS)}>
              {!sil ? (
                <>
                  <path d="M -70 -84 L 10 -76 L -8 -62 L -64 -62 Z" fill={C.noleSkinMid} opacity={0.25 + 0.4 * light.rd} />
                  {/* heavy brow shelf */}
                  <path d="M -98 -112 L -46 -112 L -50 -102 L -94 -102 Z" fill={C.noleHair} />
                  {eyeEl}
                  <path d={ell(22, -90, 9, 14)} fill={C.noleSkinMid} />
                  <path d="M -112 -80 L -96 -76 L -94 -66 L -110 -70 Z" fill={C.phoneGlow} opacity={0.4 * light.phone} />
                </>
              ) : null}
            </Lit>
            <Lit id={`${id}-hair`} d={HAIR} {...Lx(C.noleHair, [{color: C.noleHairLit, shift: [-9, 3], opacity: light.rd}])}>
              {!sil ? <path d="M -60 -140 C -30 -152 10 -152 44 -136 C 12 -144 -26 -144 -60 -132 Z" fill={C.noleHairLit} opacity={0.6 * light.rd} /> : null}
            </Lit>
          </g>
        </g>

        {/* near arm: one union for the rims (no banding at the sleeve), sleeve laid over, rims re-applied */}
        <Lit id={`${id}-arm`} d={[limb(S[0], S[1], E[0], E[1], 70, 56), limb(E[0], E[1], Hn[0], Hn[1], 56, 46)]} {...Lx(C.noleSkinShadow, rimS1)} />
        <g>
          <defs>
            <clipPath id={`${id}-slvc`}>
              <path d={limb(S[0], S[1], sleeve[0], sleeve[1], 90, 86)} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${id}-slvc)`}>
            <Lit id={`${id}-arm2`} d={[limb(S[0], S[1], E[0], E[1], 70, 56), limb(E[0], E[1], Hn[0], Hn[1], 56, 46)]} {...Lx(C.noleTee, rimT1)} />
          </g>
        </g>
        <g transform={`translate(${Hn[0]} ${Hn[1]}) rotate(${handAng})`}>
          <Lit id={`${id}-fist`} d={rr(-28, -8, 56, 50, 14)} {...Lx(C.noleSkinShadow, rimS1)} />
          {/* phone: screen faces camera, the one bright object he owns */}
          <g transform="translate(0 30) rotate(-90)">
            <path d={rr(-8, -27, 90, 54, 8)} fill={f(C.phone)} />
            {!sil || light.phone > 0 ? <path d={rr(-2, -22, 78, 44, 5)} fill={sil ? C.cream : C.phoneGlow} opacity={0.35 + 0.65 * light.phone} /> : null}
          </g>
          <Lit id={`${id}-thumb`} d={rr(-30, -6, 24, 40, 11)} {...Lx(C.noleSkinShadow, rimS1)} />
        </g>
      </g>
    </g>
  );
};

// ================================================================== FRONT (doorway / hero)
export interface NoleFrontProps {
  id: string;
  light: NoleLight;
  back?: number; // backlight rim width multiplier
  phoneUp?: number; // 0..1 raise
  flat?: string; // draw pure silhouette in this colour
}

/** Front silhouette parts (a single union so the backlight rims the OUTLINE, not every part). */
export const noleFrontParts = (phoneUp = 0) => {
  const hy = -60 * phoneUp;
  return [
    'M -76 -334 L -4 -334 L -16 -22 L -60 -22 Z',
    'M 4 -334 L 76 -334 L 60 -22 L 16 -22 Z',
    rr(-80, -26, 66, 26, 10),
    rr(14, -26, 66, 26, 10),
    limb(-200, -614, -228, -420, 88, 70),
    limb(-228, -420, -210, -262, 66, 56),
    rr(-242, -282, 64, 60, 18),
    limb(200, -614, 232, -452, 88, 70),
    limb(232, -452, 128, -430 + hy, 64, 56),
    rr(96, -462 + hy, 64, 58, 18),
    'M -58 -324 L 58 -324 L 226 -606 Q 236 -652 186 -660 Q 110 -668 60 -700 L -60 -700 Q -110 -668 -186 -660 Q -236 -652 -226 -606 Z',
    'M -54 -650 L 54 -650 L 44 -712 L -44 -712 Z',
    // chin block: wider than the skull, square, set forward
    'M -76 -776 L 76 -776 L 74 -710 Q 70 -686 44 -684 L -44 -684 Q -70 -686 -74 -710 Z',
    ell(0, -798, 50, 44),
    ell(-64, -774, 10, 17),
    ell(64, -774, 10, 17),
    // swept-back hair: an asymmetric wave that rises off the brow and rakes back to one side
    'M -54 -800 C -60 -846 -30 -870 8 -872 C 40 -874 66 -858 70 -826 C 66 -836 58 -840 50 -838 C 56 -824 56 -810 52 -800 C 40 -820 20 -828 0 -828 C -22 -828 -42 -818 -54 -800 Z',
  ];
};

export const NoleFront: React.FC<NoleFrontProps> = ({id, light, back = 1, phoneUp = 0, flat}) => {
  const r = 4 + 6 * back * light.rd;
  const rims: Light[] = flat
    ? []
    : [
        {color: C.rd2, shift: [r, r * 0.4], opacity: light.rd},
        {color: C.rd2, shift: [-r, r * 0.4], opacity: light.rd},
        {color: C.rd3, shift: [0, r * 1.3], opacity: light.rd},
      ];
  const hy = -60 * phoneUp;
  return (
    <g>
      <Lit id={`${id}-sil`} d={noleFrontParts(phoneUp)} base={flat ?? C.noleTee} lights={rims}>
        {!flat ? (
          <>
            {/* brow shelf + eyes catching the phone from below: two short cream ticks */}
            <path d="M -44 -796 L 44 -796 L 40 -786 L -40 -786 Z" fill={C.noleSkinShadow} opacity={0.9} />
            <rect x={-30} y={-782} width={14} height={3} fill={C.cream} opacity={0.55 * light.phone} />
            <rect x={16} y={-782} width={14} height={3} fill={C.cream} opacity={0.55 * light.phone} />
            {/* the jaw's hard lower plane, lit by the phone */}
            <path d="M -66 -702 Q -60 -688 -40 -688 L 40 -688 Q 60 -688 66 -702 L 60 -694 Q 50 -690 36 -690 L -36 -690 Q -50 -690 -60 -694 Z" fill={C.noleSkinLit} opacity={0.5 * light.phone} />
          </>
        ) : null}
      </Lit>
      <g transform={`translate(127 ${-452 + hy})`}>
        <path d={rr(-14, -58, 36, 64, 6)} fill={flat ?? C.phone} />
        {!flat ? <path d={rr(-10, -54, 28, 54, 4)} fill={C.phoneGlow} opacity={0.4 + 0.6 * light.phone} /> : null}
      </g>
    </g>
  );
};
