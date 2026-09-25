import React from 'react';
import {C, P, W, PH, ell, rr, clamp} from './core';
import {Lit} from './lit';
import {MasSeated, MasLight} from './mas';
import {NoleProfile, NoleProfileProps} from './nole';

/**
 * THE ROOM, staged planar (a proscenium: back wall parallel to the lens, everything in profile).
 * Light is drawn as SHAPE: the monitor throws a banded cyan wedge to the right; the door (off-screen
 * right) throws a door-shaped trapezoid of rocket red across the back wall. Cast shadows are the characters'
 * own silhouettes re-used and scaled about each light (shadow puppetry — free with the rig).
 */

export const FY = 660; // floor line (world)
export const MON: [number, number] = [448, 356]; // monitor face (cyan source)
export const DOORSRC: [number, number] = [2500, 330]; // red source for shadow projection
export const MAS_AT: [number, number] = [760, 530];

export interface WorldProps {
  f: number;
  cy: number; // monitor intensity
  red: number; // rocket-light intensity
  door: number; // 0 closed .. 1 fully open (red patch sweep)
  mas: {typing: number; blink?: number; light?: MasLight};
  nole?: (Omit<NoleProfileProps, 'id' | 'light'> & {x: number; light: NoleProfileProps['light']}) | null;
  idp: string;
  /** intensity of the red blade under the door (door closed) */
  tell?: number;
  /** rattle of the desk objects (everything but the water) */
  jolt?: {x: number; y: number; r: number};
}

// banded monitor wedge (3 hard value steps)
const cyWedge = (k: number) => {
  const [x, y] = MON;
  const len = 420 + 520 * k;
  const up = 110 + 250 * k;
  const dn = 60 + 330 * k;
  return P([
    [x, y - 58],
    [x + len, y - up],
    [x + len + 60 * k, FY],
    [x + len * 0.7, FY],
    [x, y + 62],
  ]);
};
const cyFloor = (k: number) => {
  const [x] = MON;
  const len = 420 + 520 * k;
  return P([
    [x + 120, FY],
    [x + len + 60 * k, FY],
    [x + len + 260 * k, PH + 40],
    [x + 40, PH + 40],
  ]);
};

// red door patch on the back wall + floor, sweeping open from the right
const redWall = (open: number) => {
  const lx = W + 40 - (W + 40 - 1010) * open;
  const tx = W + 40 - (W + 40 - 1120) * open;
  return P([
    [tx, 210 + 40 * (1 - open)],
    [W + 60, 60],
    [W + 60, FY],
    [lx, FY],
  ]);
};
const redFloor = (open: number) => {
  const lx = W + 40 - (W + 40 - 1010) * open;
  const fx = W + 40 - (W + 40 - 520) * open;
  return P([
    [lx, FY],
    [W + 60, FY],
    [W + 60, PH + 40],
    [fx, PH + 40],
  ]);
};

const scaleAbout = ([x, y]: [number, number], s: number, sy = s) => `translate(${x} ${y}) scale(${s} ${sy}) translate(${-x} ${-y})`;

export const Room: React.FC<WorldProps> = ({f, cy, red, door, mas, nole, idp, tell = 0.5, jolt}) => {
  const jx = jolt ? jolt.x * 0.7 : 0;
  const jy = jolt ? Math.abs(jolt.y) * -0.8 : 0;
  const masLight: MasLight = mas.light ?? {cy, rd: red * door};
  const masT = `translate(${MAS_AT[0]} ${MAS_AT[1]})`;
  const noleT = nole ? `translate(${nole.x} ${FY})` : '';
  const {x: _nx, light: nLight, ...noleRig} = nole ?? ({} as any);

  return (
    <g>
      {/* ---------------- back wall + floor */}
      <rect x={-400} y={-400} width={W + 800} height={FY + 400} fill={C.night1} />
      <rect x={-400} y={FY} width={W + 800} height={PH + 400} fill={C.night0} />
      {/* ceiling falloff: the top of the wall sinks into night in two hard steps */}
      <rect x={-400} y={-400} width={W + 800} height={440} fill={C.night0} opacity={0.35} />
      <rect x={-400} y={-400} width={W + 800} height={330} fill={C.night0} opacity={0.5} />

      {/* ---------------- monitor light: 3 hard value steps */}
      <defs>
        <clipPath id={`${idp}-cyclip`}>
          <path d={cyWedge(1)} />
          <path d={cyFloor(1)} />
        </clipPath>
        <clipPath id={`${idp}-rdclip`}>
          <path d={redWall(door)} />
          <path d={redFloor(door)} />
        </clipPath>
      </defs>
      <g filter="url(#sh-dry)">
        <path d={cyWedge(1)} fill={C.cy0} opacity={0.55 * cy} />
        <path d={cyWedge(0.55)} fill={C.cy0} opacity={0.9 * cy} />
        <path d={cyWedge(0.18)} fill={C.cy1} opacity={0.75 * cy} />
        <path d={cyFloor(1)} fill={C.cy0} opacity={0.7 * cy} />
        <path d={cyFloor(0.45)} fill={C.cy1} opacity={0.45 * cy} />
      </g>
      {/* Mas's cast shadow on the wall: his silhouette, scaled about the monitor */}
      <g clipPath={`url(#${idp}-cyclip)`}>
        <g transform={`${scaleAbout(MON, 1.75, 1.6)} ${masT}`}>
          <MasSeated id={`${idp}-msh`} sil silColor={C.night1} light={masLight} f={f} typing={mas.typing} />
        </g>
        {nole ? (
          <g transform={`${scaleAbout(MON, 1.5, 1.4)} ${noleT}`}>
            <NoleProfile id={`${idp}-nshc`} sil silColor={C.night1} light={nLight} {...noleRig} />
          </g>
        ) : null}
      </g>

      {/* ---------------- door light (off-screen right) */}
      {door > 0.001 ? (
        <>
          <g filter="url(#sh-dry)" opacity={red}>
            <path d={redWall(door)} fill={C.rd1} />
            <path d={redFloor(door)} fill={C.rd1} opacity={0.9} />
            <path d={redWall(door * 0.55)} fill={C.rd2} opacity={0.55} />
            <path d={redFloor(door * 0.6)} fill={C.rd2} opacity={0.55} />
          </g>
          <g clipPath={`url(#${idp}-rdclip)`} opacity={red}>
            <g transform={`${scaleAbout(DOORSRC, 1.3, 1.22)} ${masT}`}>
              <MasSeated id={`${idp}-mshr`} sil silColor={C.rd0} light={masLight} f={f} typing={mas.typing} />
            </g>
            {nole ? (
              <g transform={`${scaleAbout(DOORSRC, 1.28, 1.2)} ${noleT}`}>
                <NoleProfile id={`${idp}-nshr`} sil silColor={C.rd0} light={nLight} {...noleRig} />
              </g>
            ) : null}
          </g>
        </>
      ) : (
        // the tell: a blade of red under the (off-screen) door
        <path d={P([[W - 40, FY + 2], [W + 20, FY + 2], [W + 20, FY + 30], [W - 260, PH + 40], [W - 330, PH + 40]])} fill={tell > 0.8 ? C.rd2 : C.rd1} opacity={(0.45 + 0.25 * Math.sin(f * 0.7)) * (0.6 + 0.6 * tell)} filter="url(#sh-dry)" />
      )}

      {/* baseboard */}
      <rect x={-400} y={FY - 8} width={W + 800} height={8} fill={C.night0} />

      {/* ---------------- furniture (edge-wobbled gouache) */}
      <g filter="url(#sh-edge)">
        {/* cable from the monitor */}
        <path d={`M 440 440 C 470 520 400 560 380 ${FY}`} fill="none" stroke={C.night0} strokeWidth={5} />
        {/* desk */}
        <rect x={322} y={484} width={14} height={FY - 484} fill={C.night0} />
        <rect x={846} y={484} width={14} height={FY - 484} fill={C.void} />
        <Lit id={`${idp}-desk`} d={rr(300, 470, 580, 16, 3)} base={C.night0} lights={[{color: C.cy2, shift: [0, 4], opacity: cy}, {color: C.rd2, shift: [-6, 0], opacity: red * door}]} />
        {/* monitor, side-on (rattles on a rumble) */}
        <g transform={`translate(${jx} ${jy}) rotate(${jolt ? jolt.r * 20 : 0} 440 470)`}>
        <path d={rr(404, 462, 74, 8, 3)} fill={C.void} />
        <path d={rr(435, 418, 8, 46, 2)} fill={C.void} />
        <Lit id={`${idp}-mon`} d={rr(426, 286, 22, 136, 6)} base={C.void} lights={[{color: C.cyHot, shift: [-5, 0], opacity: cy}]} />
        </g>
        {/* keyboard */}
        <Lit id={`${idp}-kb`} transform={`translate(${-jx * 0.8} ${jy * 1.2})`} d={rr(548, 462, 118, 8, 3)} base={C.void} lights={[{color: C.cy2, shift: [0, 3], opacity: cy}]} />
      </g>

      {/* ---------------- the chair */}
      <g transform={masT} filter="url(#sh-edge)">
        <path d={rr(-40, 4, 118, 14, 6)} fill={C.void} />
        <path d={rr(16, 18, 10, 92, 3)} fill={C.void} />
        <path d={rr(-46, 108, 130, 8, 4)} fill={C.void} />
        <circle cx={-38} cy={122} r={8} fill={C.void} />
        <circle cx={76} cy={122} r={8} fill={C.void} />
        <path d="M 62 10 L 82 -120 Q 84 -134 96 -132 L 104 -130 Q 110 -128 108 -116 L 84 12 Z" fill={C.void} />
        <path d="M 62 10 L 82 -120 L 88 -120 L 70 10 Z" fill={C.rd1} opacity={red * door} />
      </g>

      {/* ---------------- MAS */}
      <g transform={masT} filter="url(#sh-edge)">
        <MasSeated id={`${idp}-mas`} light={masLight} f={f} typing={mas.typing} blink={mas.blink} breathe={f} />
      </g>

      {/* ---------------- the glass of water (on the desk, between Mas and the light) */}
      <Glass x={492} y={470} cy={cy} red={red * door} />

      {/* ---------------- NOLE */}
      {nole ? (
        <g transform={noleT} filter="url(#sh-edge)">
          <NoleProfile id={`${idp}-nole`} light={nLight} {...noleRig} />
        </g>
      ) : null}
    </g>
  );
};

/** The glass: flat, still, luminous. Its water never moves (a rule of the show). */
export const Glass: React.FC<{x: number; y: number; cy: number; red: number; s?: number}> = ({x, y, cy, red, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={P([[-15, -54], [15, -54], [12, 0], [-12, 0]])} fill={C.cy0} opacity={0.75} />
    <path d={P([[-13.6, -38], [13.6, -38], [11.4, -2], [-11.4, -2]])} fill={C.cy2} opacity={0.35 + 0.45 * cy} />
    <path d={P([[-13.6, -38], [13.6, -38], [13.3, -35], [-13.3, -35]])} fill={C.cyHot} opacity={0.9 * cy} />
    <path d={P([[-12, -52], [-8, -52], [-7, -4], [-10, -4]])} fill={C.cyHot} opacity={0.75 * cy} />
    <path d={P([[11, -50], [14, -50], [11.5, -4], [9.5, -4]])} fill={C.rd2} opacity={0.8 * red} />
    <path d={P([[-12, -2], [12, -2], [12, 0], [-12, 0]])} fill={C.cy3} opacity={0.6 * cy} />
  </g>
);

export {clamp, ell};
