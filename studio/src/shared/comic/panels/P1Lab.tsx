/**
 * PANEL 1 — "11:58 P.M." The lab, wide (cinemascope tier). Mas types at his desk, face-lit by the
 * monitor; the city sleeps through half-drawn blinds; a red line of light under the door on the right.
 * Internal motion: typing hands on 2s, screen scroll + flicker, window lights, feet in the door-light.
 */
import React from 'react';
import type {ArtProps} from '../Page';
import {Ink, InkLine, Spec} from '../print';
import {Layer, LinFill, RadFill, Soft} from '../paint';
import {ell, hash, noise1, onN, pl, rc, sp, inv} from '../geo';
import {InkTone} from '../InkTone';
import {masTone} from '../../tonal/masTone';
import {Glass} from './props';
import {T} from '../script';

const K: Spec = {k: 1};

/** Monitor screen quad (panel coords). */
const SCR = {tl: [212, 248], tr: [500, 212], br: [500, 522], bl: [212, 494]} as const;
const lerp2 = (a: readonly number[], b: readonly number[], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
/** bilinear point on the screen */
const onScr = (u: number, v: number) => {
  const top = lerp2(SCR.tl, SCR.tr, u);
  const bot = lerp2(SCR.bl, SCR.br, u);
  return lerp2(top, bot, v) as [number, number];
};

export const Monitor: React.FC<{f: number}> = ({f}) => {
  const flick = 0.04 * noise1(f / 2.3, 9);
  const scroll = Math.floor(onN(f, 3) / 3);
  const lines: React.ReactNode[] = [];
  for (let i = 0; i < 13; i++) {
    const li = i + scroll;
    const v = 0.1 + i * 0.066;
    const ind = [0, 0.06, 0.12, 0.06, 0.12, 0.18, 0.12, 0, 0.06][li % 9];
    const len = 0.25 + hash(li * 3.3) * 0.5;
    const a = onScr(0.08 + ind, v);
    const b = onScr(Math.min(0.92, 0.08 + ind + len), v);
    lines.push(<InkLine key={i} d={`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`} s={{c: 0.95 + flick}} w={7} cap="butt" />);
    if (hash(li * 7.1) > 0.6) {
      const c1 = onScr(Math.min(0.9, 0.12 + ind + len), v);
      const c2 = onScr(Math.min(0.94, 0.12 + ind + len + 0.12), v);
      lines.push(<InkLine key={'b' + i} d={`M ${c1[0]} ${c1[1]} L ${c2[0]} ${c2[1]}`} s={{c: 0.55}} w={7} cap="butt" />);
    }
  }
  const cur = onScr(0.08 + 0.12, 0.1 + 12 * 0.066);
  const blink = Math.floor(f / 6) % 2 === 0;
  return (
    <g>
      {/* stand */}
      <Ink d={pl([[340, 500], [372, 500], [378, 566], [334, 566]])} s={K} />
      <Ink d={ell(356, 570, 78, 11)} s={K} />
      <InkLine d="M 282 566 Q 356 556 432 566" s={{c: 0.8}} w={3} />
      {/* bezel */}
      <Ink d={pl([[196, 234], [514, 194], [514, 540], [196, 508]])} s={K} />
      {/* the screen: paper-white glow */}
      <Ink d={pl([SCR.tl, SCR.tr, SCR.br, SCR.bl])} s={{c: 0.05 - flick}} />
      <Soft id="p1-scrglow" r={14}>
        <Ink d={pl([onScr(0.02, 0.02), onScr(0.98, 0.02), onScr(0.98, 0.98), onScr(0.02, 0.98)])} s={{c: 0.18}} />
      </Soft>
      <Ink d={pl([onScr(0.06, 0.06), onScr(0.94, 0.06), onScr(0.94, 0.94), onScr(0.06, 0.94)])} s={{}} />
      {lines}
      {blink && <Ink d={pl([onScr(0.2, 0.86), onScr(0.24, 0.86), onScr(0.24, 0.93), onScr(0.2, 0.93)])} s={{c: 1}} />}
      <Ink d={pl([cur, cur, cur])} s={{}} />
      {/* bezel sheen on the edge toward Mas */}
      <InkLine d="M 511 200 L 511 536" s={{c: 1}} w={4} />
    </g>
  );
};

/** The city beyond the window, far layer. */
const City: React.FC<{f: number}> = ({f}) => {
  const blds: [number, number, number][] = [
    [880, 300, 70],
    [950, 250, 60],
    [1010, 330, 90],
    [1100, 205, 55],
    [1155, 285, 80],
    [1235, 240, 64],
    [1300, 318, 70],
    [1370, 262, 90],
  ];
  const wins: React.ReactNode[] = [];
  blds.forEach(([x, top, w], bi) => {
    for (let r = 0; r < 12; r++)
      for (let c = 0; c < 4; c++) {
        const y = top + 16 + r * 18;
        if (y > 430) continue;
        const h = hash(bi * 97 + r * 13 + c * 7);
        if (h < 0.84) continue;
        const off = hash(bi * 5 + r + c * 3 + Math.floor((f + bi * 7) / 16)) > 0.93;
        if (off) continue;
        wins.push(<Ink key={`${bi}-${r}-${c}`} d={rc(x + 8 + c * (w / 4.4), y, 7, 9)} s={h > 0.95 ? {} : {c: 0.5}} />);
      }
  });
  return (
    <g>
      <LinFill id="p1-sky" d={rc(860, 40, 600, 420)} x1={0} y1={60} x2={0} y2={440} stops={[[0, {k: 0.92, c: 0.5}], [0.65, {k: 0.55, c: 0.55}], [1, {k: 0.28, c: 0.6}]]} />
      {/* moon, low and small */}
      <Ink d={ell(1330, 120, 26, 26)} s={{c: 0.12}} />
      <Ink d={ell(1340, 114, 22, 24)} s={{k: 0.7, c: 0.55}} />
      {blds.map(([x, top, w], i) => (
        <Ink key={i} d={rc(x, top, w, 460 - top)} s={K} />
      ))}
      {/* water tower + antennae */}
      <Ink d={pl([[1112, 205], [1112, 170], [1118, 160], [1136, 160], [1142, 170], [1142, 205]])} s={K} />
      <InkLine d="M 1270 240 L 1270 150 M 1262 175 L 1278 175" s={K} w={4} />
      {wins}
    </g>
  );
};

/** Window frame + half-drawn venetian blinds. Window rect (880..1460, 60..450). */
const Blinds: React.FC = () => {
  const slats: React.ReactNode[] = [];
  for (let i = 0; i < 9; i++) {
    const y = 64 + i * 22;
    slats.push(<Ink key={i} d={rc(880, y, 580, 13)} s={K} />);
    slats.push(<InkLine key={'e' + i} d={`M 880 ${y + 13} L 1100 ${y + 13}`} s={{c: 0.6}} w={2} cap="butt" />);
  }
  return (
    <g>
      {slats}
      {/* bottom rail of the raised blind */}
      <Ink d={rc(874, 262, 592, 16)} s={K} />
      <InkLine d="M 874 278 L 1160 278" s={{c: 0.9}} w={3} cap="butt" />
      {/* cords */}
      <InkLine d="M 1420 60 L 1420 350" s={K} w={3} />
      <Ink d={ell(1420, 356, 6, 10)} s={K} />
      {/* frame + mullion + sill */}
      <Ink d={`${rc(862, 44, 616, 424)} ${rc(880, 60, 580, 390)}`} s={K} eo />
      <Ink d={rc(1164, 278, 12, 172)} s={K} />
      <Ink d={rc(846, 452, 648, 22)} s={K} />
      <InkLine d="M 848 453 L 1100 453" s={{c: 0.95}} w={4} cap="butt" />
      <InkLine d="M 881 280 L 881 450" s={{c: 0.7}} w={3} cap="butt" />
    </g>
  );
};

/** The door on the right wall — red light leaking at the gap; feet pass before the burst. */
const Door: React.FC<{f: number}> = ({f}) => {
  const heat = inv(T.feet, T.bam, f);
  const gap = 5 + heat * 3;
  const feet: React.ReactNode[] = [];
  if (f >= T.feet && f < T.bam + 2) {
    const t = (f - T.feet) / (T.bam - T.feet);
    const fx = 1740 - t * 150;
    feet.push(<Ink key="a" d={rc(fx, 590, 26, 12)} s={K} />);
    feet.push(<Ink key="b" d={rc(fx + 44 + (onN(f, 3) % 6) * 2, 590, 26, 12)} s={K} />);
  }
  return (
    <g>
      {/* spill on the floor */}
      <Soft id="p1-dspill" r={8}>
        <Ink d={pl([[1572, 600], [1738, 600], [1860, 830], [1470, 830]])} s={{k: 0.25, r: 0.2 + heat * 0.35}} />
      </Soft>
      <Ink d={pl([[1590, 600], [1720, 600], [1790, 700], [1540, 700]])} s={{r: 0.35 + heat * 0.3}} />
      {/* frame */}
      <Ink d={`${rc(1540, 100, 222, 500)} ${rc(1562, 120, 178, 480)}`} s={{k: 0.8, r: 0.15}} eo />
      <InkLine d="M 1541 100 L 1541 600" s={{r: 0.35}} w={2} cap="butt" />
      {/* door slab */}
      <Ink d={rc(1562, 120, 178, 480)} s={K} />
      {/* panels on the door, catching nothing but a rumour of red */}
      <InkLine d={`${rc(1584, 146, 134, 170)} ${rc(1584, 346, 134, 220)}`} s={{r: 0.22, k: 0.6}} w={3} />
      {/* leak around the edges + under */}
      <Ink d={rc(1562, 600 - gap, 178, gap)} s={{r: 1}} />
      <InkLine d="M 1739 124 L 1739 598" s={{r: 0.9}} w={2 + heat * 2} cap="butt" />
      {feet}
      {/* knob */}
      <Ink d={ell(1586, 370, 7, 7)} s={{r: 0.5}} />
    </g>
  );
};

/** Mas at the desk: tonal rig as a rim-lit silhouette, arms + hands typing. */
const MasAtDesk: React.FC<{f: number}> = ({f}) => {
  const typing = f < T.typeEnd + 30;
  const beat = onN(f, 2) / 2;
  const hA = typing ? (beat % 2 === 0 ? -5 : 0) : 0;
  const hB = typing ? (beat % 3 === 0 ? -5 : 0) : 0;
  const bob = typing ? Math.sin(f * 0.5) * 1.2 : 0;
  const model = masTone({lookX: 0.45, lookY: 0.35, lid: 0.3, brow: 0.05, tilt: 3});
  return (
    <g>
      {/* chair back peeking behind */}
      <Ink d={sp([[1110, 640], [1104, 420], [1130, 350], [1190, 338], [1236, 372], [1244, 640]])} s={K} />
      <InkLine d="M 1112 420 Q 1120 360 1180 342" s={{c: 0.55}} w={3} />
      {/* far arm */}
      <Ink d={sp([[930, 470], [880, 520], [800, 556], [744, 566 + hB], [742, 580 + hB], [808, 582], [900, 556], [960, 510]])} s={K} />
      <g transform={`translate(0 ${bob.toFixed(2)})`}>
        <InkTone model={model} look={{key: 'c', line: 7, lit: 0.3, mid: 0.8, soft: 5}} uid="p1mas" transform="translate(1046 330) scale(-0.52 0.52)" />
      </g>
      {/* near arm (hoodie sleeve) with the monitor rim on its top edge */}
      <Ink d={sp([[1000, 470], [950, 540], [880, 572], [826, 578 + hA], [826, 594 + hA], [890, 598], [972, 574], [1040, 520]])} s={K} />
      <InkLine d={`M 996 474 Q 950 536 884 566 L 834 ${574 + hA}`} s={{c: 0.9}} w={4} />
      {/* hands: lit knuckles */}
      <Ink d={sp([[828, 576 + hA], [806, 574 + hA], [790, 582 + hA], [800, 590 + hA], [830, 592 + hA]])} s={{c: 0.4}} />
      <InkLine d={`M 792 ${583 + hA} Q 806 ${574 + hA} 828 ${576 + hA}`} s={K} w={3} />
      <Ink d={sp([[748, 568 + hB], [728, 568 + hB], [716, 576 + hB], [728, 582 + hB], [748, 582 + hB]])} s={{c: 0.5}} />
    </g>
  );
};

/** Foreground: the end of a bookshelf, silhouetted against the monitor glow — big parallax. */
const Foreground: React.FC = () => (
  <g>
    <Ink d={pl([[-60, -20], [96, -20], [96, 840], [-60, 840]])} s={K} />
    {/* books on the shelf ends, their spines catching the screen */}
    {[
      [96, 200, 26, 110],
      [96, 324, 20, 84],
      [96, 452, 30, 130],
    ].map(([x, y, bw, bh], i) => (
      <g key={i}>
        <Ink d={pl([[x - 4, y - bh], [x + bw, y - bh + 6], [x + bw, y], [x - 4, y]])} s={K} />
        <InkLine d={`M ${x + bw} ${y - bh + 8} L ${x + bw} ${y - 2}`} s={{c: 0.8}} w={3} cap="butt" />
      </g>
    ))}
    <Ink d={rc(-60, 200, 180, 16)} s={K} />
    <Ink d={rc(-60, 452, 190, 16)} s={K} />
    <InkLine d="M 96 -20 L 96 840" s={{c: 0.55}} w={3} cap="butt" />
    {/* trailing plant on top, leaves against the glow */}
    <Ink d={sp([[40, 60], [120, 30], [190, 60], [150, 80], [90, 76]])} s={K} />
    <Ink d={sp([[80, 70], [150, 110], [180, 180], [140, 150], [100, 110]])} s={K} />
    <Ink d={sp([[60, 80], [100, 150], [96, 250], [74, 190], [58, 120]])} s={K} />
    <InkLine d="M 120 32 Q 170 50 188 60" s={{c: 0.6}} w={3} />
  </g>
);

export const P1Lab: React.FC<ArtProps> = ({f, w, h, px, py}) => {
  const flick = 0.03 * noise1(f / 2.3, 9);
  const push = f * 0.00012;
  const wall = `M 0 0 H ${w} V 600 H 0 Z M 862 44 V 468 H 1478 V 44 Z`;
  return (
    <g>
      {/* ---------------- far: the city ---------------- */}
      <Layer px={px} py={py} d={-0.9} push={push} cx={w / 2} cy={h / 2}>
        <City f={f} />
      </Layer>
      {/* ---------------- wall + window + door ---------------- */}
      <Layer px={px} py={py} d={-0.35} push={push} cx={w / 2} cy={h / 2}>
        <RadFill id="p1-wall" d={wall} cx={370} cy={380} r={760} ry={520} from={{k: 0.12, c: 0.62 + flick}} mid={[0.45, {k: 0.62, c: 0.42}]} to={{k: 1, c: 0.2}} />
        {/* the glow's hot core right behind the screen */}
        <Soft id="p1-core" r={40}>
          <Ink d={ell(360, 370, 250, 210)} s={{k: 0, c: 0.3}} />
        </Soft>
        <Blinds />
        {/* floor (right of the desk) */}
        <LinFill id="p1-floor" d={rc(0, 596, w, 230)} x1={0} y1={600} x2={0} y2={820} stops={[[0, {k: 0.92, c: 0.2}], [1, {k: 1}]]} />
        <Ink d={rc(0, 594, w, 5)} s={K} />
        <Door f={f} />
      </Layer>
      {/* ---------------- the desk + Mas ---------------- */}
      <Layer px={px} py={py} d={0} push={push} cx={w / 2} cy={h / 2}>
        {/* shelf with the ORB above the monitor */}
        <Ink d={rc(120, 150, 300, 14)} s={K} />
        <InkLine d="M 120 150 L 420 150" s={{c: 0.8}} w={3} />
        <Ink d={ell(300, 118, 30, 30)} s={K} />
        <Ink d={ell(306, 116, 11, 11)} s={{c: 0.9}} />
        <Ink d={ell(307, 115, 4, 4)} s={K} />
        <InkLine d="M 274 104 A 30 30 0 0 1 300 88" s={{c: 0.8}} w={3} />
        <Ink d={rc(220, 110, 16, 40)} s={K} />
        <Ink d={rc(240, 96, 14, 54)} s={K} />
        {/* books */}
        <Ink d={rc(150, 104, 18, 46)} s={K} />
        <Ink d={rc(170, 112, 16, 38)} s={K} />
        {/* desk top: lit by the screen */}
        <LinFill id="p1-desk" d={pl([[-20, 560], [1180, 560], [1210, 604], [-20, 604]])} x1={330} y1={0} x2={1150} y2={0} stops={[[0, {c: 0.62, k: 0.05}], [0.55, {c: 0.5, k: 0.55}], [1, {k: 1}]]} />
        <InkLine d="M -20 560 L 1180 560" s={K} w={5} />
        <Ink d={pl([[-20, 603], [1212, 603], [1212, 640], [-20, 640]])} s={K} />
        <InkLine d="M -20 604 L 900 604" s={{c: 0.95}} w={4} cap="butt" />
        {/* keyboard */}
        <Ink d={pl([[690, 566], [900, 566], [912, 586], [680, 586]])} s={K} />
        {Array.from({length: 3}).map((_, r) => (
          <InkLine key={r} d={`M ${690 + r * -3} ${571 + r * 5} L ${898 + r * 4} ${571 + r * 5}`} s={{c: 0.75}} w={2.2} cap="butt" />
        ))}
        {/* mug of pens, far end */}
        <Ink d={rc(1010, 520, 36, 42)} s={K} />
        <InkLine d="M 1018 520 L 1010 488 M 1030 520 L 1036 482 M 1040 520 L 1052 494" s={K} w={4} />
        <Monitor f={f} />
        {/* monitor light cast forward onto the desk */}
        <Soft id="p1-deskglow" r={10}>
          <Ink d={pl([[500, 564], [690, 564], [760, 600], [480, 600]])} s={{c: 0.25}} />
        </Soft>
        <Glass id="p1-glass" x={566} y={586} h={104} side={-1} line={2.6} />
        <MasAtDesk f={f} />
      </Layer>
      {/* ---------------- foreground ---------------- */}
      <Layer px={px} py={py} d={1} push={push * 2} cx={w / 2} cy={h / 2}>
        <Foreground />
      </Layer>
      {/* top shadow falloff (ceiling dark) */}
      <g style={{mixBlendMode: 'multiply'}}>
        <LinFill id="p1-ceil" d={rc(0, 0, w, 160)} x1={0} y1={0} x2={0} y2={160} stops={[[0, {k: 0.85}], [1, {k: 0}]]} />
      </g>
    </g>
  );
};
