// Mas's typing hands for the wide (2 drawings, swapped on 3s = the classic limited typing loop).
// Screen-space drawing that sits on the shared RoomFront keyboard. Owned by the animescene builder.
import React from 'react';
import {Rim} from '../cel';
import {curve, ink, Pt} from '../ink';
import {LIGHT, MAS_C} from '../palette';

// night-multiplied cel colours (0.5 x #9CA2D8, same as the rig's compositing pass)
const C = {
  skin: '#C7B3C1',
  skinShade: '#8A7598',
  hood: '#727896',
  hoodShade: '#4C5272',
  hoodDeep: '#3A3F5A',
  line: MAS_C.hoodie.line,
  skinLine: MAS_C.skinLine,
};

// hand seen from the outer (pinky) side, fingers curled down onto the keys; wrist at 0,0, fingers toward +x
const HAND = (lift: number): Pt[] => [
  [0, -12], [22, -16], [44, -15], [57, -11, 1], [68, -6 - lift], [76, 4 - lift], [76, 13 - lift * 0.6, 1], [69, 17 - lift * 0.4],
  [60, 13], [46, 11], [34, 15], [22, 17], [10, 14], [0, 12],
];
const SLEEVE: Pt[] = [[-112, -27, 1], [-44, -22], [2, -18, 1], [7, 0], [2, 17, 1], [-44, 21], [-112, 26, 1]];

const Hand: React.FC<{uid: string; x: number; y: number; s: number; rot: number; lift: number; far?: boolean; light: number}> = ({uid, x, y, s, rot, lift, far = false, light}) => {
  const h = HAND(lift);
  const hd = curve(h);
  const sd = curve(SLEEVE);
  const k = 1 / s;
  const skin = far ? C.skinShade : C.skin;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {/* sleeve + ribbed cuff */}
      <path d={sd} fill={far ? C.hoodShade : C.hood} />
      <path d={curve([[-112, 4], [-44, 6], [4, 3], [2, 17], [-44, 21], [-112, 26]])} fill={far ? C.hoodDeep : C.hoodShade} />
      <path d={curve([[-20, -20], [2, -18], [7, 0], [2, 17], [-20, 19], [-17, 0]])} fill={far ? C.hoodDeep : C.hoodShade} opacity={0.7} />
      {[-15, -9, -3].map((q) => (
        <path key={q} d={ink([[q, -17], [q + 2, 0], [q, 16]], 1.2 * k, {a: 0.3, b: 0.3})} fill={C.line} opacity={0.45} />
      ))}
      <path d={ink(SLEEVE.slice(0, 3), 2.8 * k, {a: 0.25, b: 0.1})} fill={C.line} />
      <path d={ink(SLEEVE.slice(4), 2.8 * k, {a: 0.1, b: 0.25})} fill={C.line} />
      {/* hand */}
      <path d={hd} fill={skin} />
      <path d={curve([[4, 3], [30, 2], [58, 3], [70, 9 - lift * 0.6], [69, 17 - lift * 0.4], [46, 11], [22, 17], [0, 12]])} fill={C.skinShade} opacity={far ? 0.6 : 1} />
      <path d={ink(h.slice(0, 8), 2.5 * k, {a: 0.12, b: 0.3, press: [0.8, 0.9, 1, 1.2, 1.1]})} fill={C.skinLine} />
      <path d={ink(h.slice(8), 1.9 * k, {a: 0.3, b: 0.3})} fill={C.skinLine} opacity={0.8} />
      {/* curled-finger separations */}
      <path d={ink([[49, -12], [60, 1 - lift * 0.5], [63, 12 - lift * 0.5]], 1.5 * k, {a: 0.35, b: 0.4})} fill={C.skinLine} opacity={0.7} />
      <path d={ink([[40, -13], [50, 2], [52, 11]], 1.4 * k, {a: 0.35, b: 0.4})} fill={C.skinLine} opacity={0.55} />
      <path d={ink([[16, -15], [34, -17], [48, -14]], 1.2 * k, {a: 0.4, b: 0.4})} fill="#FFFFFF" opacity={0.18} />
      <Rim id={`${uid}-r`} shapes={[hd, sd]} dx={4} dy={-4} color={LIGHT.key} opacity={0.85 * light} />
    </g>
  );
};

/** phase 0/1 alternates which hand is down (drawings A/B). */
export const TypingHands: React.FC<{uid: string; phase: number; typing: boolean; light: number; x: number; y: number; s: number}> = ({uid, phase, typing, light}) => {
  const a = typing ? phase : 0;
  return (
    <g>
      <Hand uid={`${uid}-far`} x={1126} y={902} s={0.78} rot={7} lift={a ? 5 : 0} far light={light * 0.75} />
      <Hand uid={`${uid}-near`} x={1076} y={930} s={0.92} rot={15} lift={a ? 0 : 5} light={light} />
    </g>
  );
};
