// Stick figures for the reel, one distinguishing mark per character id (after the intro animatic's Stick).
// Non-humanoid ids (whale, orb, calendar, podium, clod, chatgtp, korg) get their own simple shapes.
// Unknown ids render as a generic stick figure with a name label.
import React from 'react';
import {displayName, type Face, type Pose} from './schema';
import {MONO, type Pal} from './look';

type Pt = [number, number];

export interface FigProps {
  id: string;
  pose: Pose;
  face: Face;
  x: number; // feet x
  y: number; // feet y
  s: number; // scale (1 = 172 px tall)
  pal: Pal;
  f: number; // frame inside the beat (0 when frozen)
  dir?: 1 | -1; // facing
  look?: number; // -1..1 eye direction
  dashed?: boolean; // plan / hypothetical
  label?: 'below' | 'side' | 'none';
  date?: string; // calendar page text
  noPodium?: boolean;
  t?: number; // 0..1 progress through the beat
}

const SPECIAL = new Set(['whale', 'orb', 'calendar', 'podium', 'clod', 'chatgtp', 'korg']);

export interface HGeo {x: number; y: number; s: number; k: number; hipY: number; shY: number; R: number; hx: number; hy: number; top: number}
export const humanGeo = (id: string, pose: Pose, x: number, y: number, s: number, f: number, dir: number): HGeo => {
  const k = id === 'nole' ? 1.14 : 1;
  const breath = Math.floor(f / 12) % 2 === 1 ? 1.2 * s : 0;
  let yy = y;
  if (pose === 'float') yy = y - (34 + 5 * Math.sin(f / 9)) * s;
  const hipY = pose === 'sit' ? yy - 40 * s : yy - 70 * s * k;
  let shY = hipY - 50 * s * k + breath;
  if (pose === 'slump') shY += 12 * s;
  const R = 22 * s;
  const hx = x + (pose === 'slump' ? 9 * s * dir : 0);
  const hy = shY - 8 * s - R + (pose === 'slump' ? 9 * s : 0);
  return {x, y: yy, s, k, hipY, shY, R, hx, hy, top: hy - R};
};

/** Top of a figure (for speech balloons and labels). */
export const figTop = (id: string, pose: Pose, x: number, y: number, s: number): number => {
  switch (id) {
    case 'whale':
      return y - (pose === 'float' ? 190 : 120) * s;
    case 'orb':
      return y - 165 * s;
    case 'calendar':
      return y - 205 * s;
    case 'podium':
      return y - 110 * s;
    case 'clod':
      return y - 118 * s;
    case 'chatgtp':
      return y - 160 * s;
    case 'korg':
      return y - 150 * s;
    default: {
      const g = humanGeo(id, pose, x, y, s, 0, 1);
      let top = g.top;
      if (id === 'alyi') top -= 15 * s;
      if (id === 'mada') top -= 40 * s;
      if (id === 'radnus' || id === 'luap') top -= 14 * s;
      return top;
    }
  }
};

// ---------------------------------------------------------------- faces
const FaceMarks: React.FC<{hx: number; hy: number; s: number; c: string; sw: number; face: Face; look: number; down?: boolean}> = ({hx, hy, s, c, sw, face, look, down}) => {
  const lx = hx + look * 7 * s;
  const ey = hy - 2 * s + (down ? 4 * s : 0);
  const er = face === 'shocked' ? 3.9 * s : 2.7 * s;
  const m = sw * 0.6;
  const my = hy + 10 * s + (down ? 2 * s : 0);
  let mouth: React.ReactNode;
  switch (face) {
    case 'smile':
      mouth = <path d={`M${lx - 7 * s} ${my - 2 * s} Q${lx} ${my + 5 * s} ${lx + 7 * s} ${my - 2 * s}`} strokeWidth={m} />;
      break;
    case 'worried':
      mouth = <path d={`M${lx - 7 * s} ${my + 1 * s} q${3.5 * s} ${-4 * s} ${7 * s} 0 q${3.5 * s} ${4 * s} ${7 * s} 0`} strokeWidth={m} />;
      break;
    case 'angry':
      mouth = <path d={`M${lx - 7 * s} ${my + 3 * s} Q${lx} ${my - 4 * s} ${lx + 7 * s} ${my + 3 * s}`} strokeWidth={m} />;
      break;
    case 'shocked':
      mouth = <ellipse cx={lx} cy={my + 1 * s} rx={4 * s} ry={5 * s} strokeWidth={m} />;
      break;
    case 'smug':
      mouth = <path d={`M${lx - 6 * s} ${my} L${lx + 3 * s} ${my} Q${lx + 7 * s} ${my - 1 * s} ${lx + 8 * s} ${my - 5 * s}`} strokeWidth={m} />;
      break;
    default:
      mouth = <line x1={lx - 5 * s} y1={my} x2={lx + 5 * s} y2={my} strokeWidth={m} />;
  }
  let brows: React.ReactNode = null;
  if (face === 'worried')
    brows = <path d={`M${lx - 11 * s} ${ey - 5 * s} L${lx - 4 * s} ${ey - 9 * s} M${lx + 4 * s} ${ey - 9 * s} L${lx + 11 * s} ${ey - 5 * s}`} strokeWidth={m} />;
  else if (face === 'angry')
    brows = <path d={`M${lx - 11 * s} ${ey - 9 * s} L${lx - 3 * s} ${ey - 5 * s} M${lx + 3 * s} ${ey - 5 * s} L${lx + 11 * s} ${ey - 9 * s}`} strokeWidth={m} />;
  else if (face === 'shocked')
    brows = <path d={`M${lx - 11 * s} ${ey - 9 * s} q${4 * s} ${-3 * s} ${8 * s} 0 M${lx + 3 * s} ${ey - 9 * s} q${4 * s} ${-3 * s} ${8 * s} 0`} strokeWidth={m} />;
  const lids = face === 'smug' ? <path d={`M${lx - 10 * s} ${ey - 1 * s} h${7 * s} M${lx + 3 * s} ${ey - 1 * s} h${7 * s}`} strokeWidth={m * 1.2} /> : null;
  return (
    <g fill="none" stroke={c} strokeLinecap="round">
      <circle cx={lx - 7 * s} cy={ey} r={er} fill={c} stroke="none" />
      <circle cx={lx + 7 * s} cy={ey} r={er} fill={c} stroke="none" />
      {lids}
      {brows}
      {mouth}
    </g>
  );
};

// ---------------------------------------------------------------- humanoid
const Humanoid: React.FC<FigProps & {c: string}> = (p) => {
  const {id, pose, s, pal, f, c} = p;
  const dir = p.dir ?? 1;
  const g = humanGeo(id, pose, p.x, p.y, s, f, dir);
  const {x, hipY, shY, R, hx, hy} = g;
  const yy = g.y;
  const sw = Math.max(2.2, 4 * s);
  const bg = pal.bg;
  const dash = p.dashed ? `${7 * s} ${5 * s}` : undefined;
  // legs
  let legs: string;
  if (pose === 'sit') legs = `M${x} ${hipY} L${x + dir * 30 * s} ${hipY} L${x + dir * 30 * s} ${yy} M${x} ${hipY} L${x + dir * 24 * s} ${hipY + 5 * s} L${x + dir * 20 * s} ${yy}`;
  else if (pose === 'float') legs = `M${x - 7 * s} ${hipY + 52 * s} L${x} ${hipY} L${x + 9 * s} ${hipY + 50 * s}`;
  else if (pose === 'walk') {
    const w = Math.sin(f * 0.45) * 16 * s;
    legs = `M${x - 12 * s + w} ${yy} L${x} ${hipY} L${x + 12 * s - w} ${yy}`;
  } else legs = `M${x - 12 * s} ${yy} L${x} ${hipY} L${x + 12 * s} ${yy}`;
  // arms
  const sh: Pt = [x, shY + 4 * s];
  const ap = (side: number, a: number): Pt => {
    const th = ((18 + a) * Math.PI) / 180;
    return [x + side * Math.sin(th) * 52 * s, sh[1] + Math.cos(th) * 52 * s];
  };
  const swing = Math.sin(f * 0.45) * 25;
  const wig = Math.sin(f * 0.5) * 8;
  let hl: Pt;
  let hr: Pt; // hr = the facing-side hand
  switch (pose) {
    case 'walk':
      hl = ap(-dir, swing);
      hr = ap(dir, -swing);
      break;
    case 'sit':
      hl = ap(-dir, 25);
      hr = ap(dir, 40);
      break;
    case 'point':
      hl = ap(-dir, 6);
      hr = [x + dir * (56 + Math.sin(f * 0.3) * 2) * s, shY - 6 * s];
      break;
    case 'arms-up':
      hl = ap(-dir, 148 + wig);
      hr = ap(dir, 148 - wig);
      break;
    case 'phone':
      hl = ap(-dir, 6);
      hr = [hx + dir * R * 0.95, hy + 5 * s];
      break;
    case 'slump':
      hl = ap(-dir, -14);
      hr = ap(dir, -14);
      break;
    case 'lean':
      hl = ap(-dir, 18);
      hr = ap(dir, 45);
      break;
    case 'float':
      hl = ap(-dir, 62 + wig * 0.5);
      hr = ap(dir, 62 - wig * 0.5);
      break;
    default:
      hl = ap(-dir, 6);
      hr = ap(dir, 6);
  }
  if (id === 'gerg' && pose !== 'point' && pose !== 'arms-up' && pose !== 'phone') {
    // hands on the keyboard
    const ky = pose === 'sit' ? hipY - 8 * s : hipY - 12 * s;
    hl = [x - dir * 20 * s, ky];
    hr = [x + dir * 20 * s, ky];
  }
  const back: React.ReactNode[] = [];
  const front: React.ReactNode[] = [];
  const thin = sw * 0.6;
  // character marks
  switch (id) {
    case 'mas':
      back.push(<path key="hood" d={`M${hx - R - 5 * s} ${shY + 6 * s} A ${R + 9 * s} ${R + 9 * s} 0 1 1 ${hx + R + 5 * s} ${shY + 6 * s}`} />);
      front.push(
        <path key="strings" d={`M${x - 5 * s} ${shY + 4 * s} l0 ${12 * s} M${x + 5 * s} ${shY + 4 * s} l0 ${12 * s}`} strokeWidth={sw * 0.5} />,
        <path key="cow" d={`M${hx + 3 * s} ${hy - R + 1} q${6 * s + Math.sin(f / 5) * 1.5 * s} ${-14 * s} ${16 * s + Math.sin(f / 5) * 3 * s} ${-8 * s}`} />,
      );
      break;
    case 'nole':
      front.push(<rect key="ph" x={hr[0] - 5 * s} y={hr[1] - 20 * s} width={10 * s} height={18 * s} rx={2 * s} fill={c} stroke="none" />);
      break;
    case 'gerg': {
      const ky = pose === 'sit' ? hipY - 8 * s : hipY - 12 * s;
      front.push(
        <g key="kb" strokeWidth={thin}>
          <rect x={x - 36 * s} y={ky - 4 * s} width={72 * s} height={14 * s} fill={bg} />
          <path d={`M${x - 30 * s} ${ky + 3 * s} h${60 * s}`} strokeDasharray={`${4 * s} ${3 * s}`} />
          {f % 6 < 3 && <rect x={x + ((f * 13) % 50) * s - 25 * s} y={ky - 14 * s} width={7 * s} height={6 * s} fill={bg} />}
        </g>,
      );
      break;
    }
    case 'alyi':
      front.push(
        <g key="halo" strokeWidth={sw * 0.5}>
          {Array.from({length: 10}, (_, i) => {
            const a = (i / 10) * Math.PI * 2 + f * 0.02;
            return <line key={i} x1={hx + Math.cos(a) * (R + 6 * s)} y1={hy + Math.sin(a) * (R + 6 * s)} x2={hx + Math.cos(a) * (R + 15 * s)} y2={hy + Math.sin(a) * (R + 15 * s)} />;
          })}
        </g>,
      );
      break;
    case 'mario':
      front.push(
        <g key="curls" strokeWidth={sw * 0.55}>
          {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
            <circle key={i} cx={hx + i * 6.5 * s} cy={hy - R + Math.abs(i) * 2.2 * s} r={5 * s} fill={bg} />
          ))}
          <circle cx={hx + (p.look ?? 0) * 7 * s - 7 * s} cy={hy - 2 * s} r={6.5 * s} />
          <circle cx={hx + (p.look ?? 0) * 7 * s + 7 * s} cy={hy - 2 * s} r={6.5 * s} />
        </g>,
      );
      break;
    case 'rumpt': {
      front.push(
        <path key="tie" d={`M${x - 4 * s} ${shY + 5 * s} L${x + 4 * s} ${shY + 5 * s} L${x + 6 * s} ${hipY + 12 * s} L${x} ${hipY + 20 * s} L${x - 6 * s} ${hipY + 12 * s} Z`} fill={pal.red} stroke={c} strokeWidth={thin * 0.7} />,
        <path key="swoop" d={`M${hx - dir * R * 1.0} ${hy - R * 0.35} Q${hx - dir * R * 0.2} ${hy - R * 1.65} ${hx + dir * R * 1.5} ${hy - R * 0.75} Q${hx + dir * R * 0.4} ${hy - R * 1.05} ${hx - dir * R * 0.6} ${hy - R * 0.6}`} fill={pal.gold} stroke={c} strokeWidth={thin * 0.7} />,
      );
      if (!p.noPodium && (pose === 'stand' || pose === 'point'))
        front.push(
          <g key="pod">
            <path d={`M${x - 34 * s} ${shY + 34 * s} L${x + 34 * s} ${shY + 34 * s} L${x + 26 * s} ${yy} L${x - 26 * s} ${yy} Z`} fill={pal.gold} stroke={c} strokeWidth={thin} />
            <circle cx={x} cy={shY + 70 * s} r={11 * s} fill="none" stroke={pal.mono ? c : '#7a5a10'} strokeWidth={thin} />
          </g>,
        );
      break;
    }
    case 'nesnej':
      back.push(
        <path key="jacket" d={`M${x - 17 * s} ${shY + 3 * s} L${x + 17 * s} ${shY + 3 * s} L${x + 15 * s} ${hipY + 8 * s} L${x - 15 * s} ${hipY + 8 * s} Z`} fill={c} fillOpacity={0.35} strokeWidth={thin} />,
      );
      front.push(<path key="lapel" d={`M${x - 11 * s} ${shY + 3 * s} L${x} ${hipY - 20 * s} L${x + 11 * s} ${shY + 3 * s}`} strokeWidth={thin} />);
      break;
    case 'tasya':
      front.push(
        <g key="keys" strokeWidth={thin}>
          <circle cx={hl[0]} cy={hl[1] + 8 * s} r={9 * s} />
          {[-1, 0, 1].map((i) => (
            <path key={i} d={`M${hl[0] + i * 7 * s} ${hl[1] + 16 * s} l${i * 3 * s} ${16 * s} m0 ${-6 * s} h${4 * s} m${-4 * s} ${-4 * s} h${3 * s}`} transform={`rotate(${Math.sin(f / 4 + i) * 8} ${hl[0]} ${hl[1] + 8 * s})`} />
          ))}
        </g>,
      );
      break;
    case 'kram':
      front.push(
        <g key="thermos" strokeWidth={thin}>
          <rect x={hr[0] - 7 * s} y={hr[1] - 28 * s} width={14 * s} height={30 * s} rx={4 * s} fill={bg} />
          <rect x={hr[0] - 5 * s} y={hr[1] - 34 * s} width={10 * s} height={6 * s} fill={c} stroke="none" />
          <path d={`M${hr[0]} ${hr[1] - 38 * s} q${4 * s} ${-5 * s} 0 ${-10 * s} q${-4 * s} ${-5 * s} 0 ${-10 * s}`} opacity={0.6} />
        </g>,
      );
      break;
    case 'radnus': {
      const on = Math.floor(f / 4) % 2 === 0;
      front.push(
        <g key="siren">
          <path d={`M${hx - 10 * s} ${hy - R - 1 * s} A ${10 * s} ${10 * s} 0 0 1 ${hx + 10 * s} ${hy - R - 1 * s} Z`} fill={pal.red} stroke={c} strokeWidth={thin} />
          {on &&
            [-50, -20, 20, 50].map((a) => {
              const r = (a * Math.PI) / 180;
              return <line key={a} x1={hx + Math.sin(r) * 14 * s} y1={hy - R - 6 * s - Math.cos(r) * 8 * s} x2={hx + Math.sin(r) * 26 * s} y2={hy - R - 6 * s - Math.cos(r) * 18 * s} stroke={pal.red} strokeWidth={thin} />;
            })}
        </g>,
      );
      break;
    }
    case 'simed':
      front.push(
        <g key="pawn" fill={c} stroke="none">
          <circle cx={hr[0]} cy={hr[1] - 22 * s} r={5 * s} />
          <path d={`M${hr[0] - 3 * s} ${hr[1] - 18 * s} L${hr[0] + 3 * s} ${hr[1] - 18 * s} L${hr[0] + 7 * s} ${hr[1] - 4 * s} L${hr[0] - 7 * s} ${hr[1] - 4 * s} Z`} />
          <rect x={hr[0] - 9 * s} y={hr[1] - 4 * s} width={18 * s} height={4 * s} />
        </g>,
      );
      break;
    case 'rima':
      back.push(
        <g key="spot" stroke="none">
          <path d={`M${x - 26 * s} ${-20} L${x + 26 * s} ${-20} L${x + 95 * s} ${yy + 6 * s} L${x - 95 * s} ${yy + 6 * s} Z`} fill={pal.glow} opacity={pal.mono ? 0.08 : 0.13} />
          <ellipse cx={x} cy={yy + 4 * s} rx={95 * s} ry={12 * s} fill={pal.glow} opacity={pal.mono ? 0.12 : 0.2} />
        </g>,
      );
      break;
    case 'neleh':
      front.push(
        <g key="paper">
          <circle cx={hr[0]} cy={hr[1] - 12 * s} r={24 * s} fill={pal.glow} opacity={0.18 + 0.06 * Math.sin(f / 5)} stroke="none" />
          <rect x={hr[0] - 10 * s} y={hr[1] - 26 * s} width={20 * s} height={26 * s} fill={pal.plate} stroke={c} strokeWidth={thin} />
          <path d={`M${hr[0] - 6 * s} ${hr[1] - 20 * s} h${12 * s} M${hr[0] - 6 * s} ${hr[1] - 14 * s} h${12 * s} M${hr[0] - 6 * s} ${hr[1] - 8 * s} h${8 * s}`} stroke={pal.plateInk} strokeWidth={thin * 0.6} />
        </g>,
      );
      break;
    case 'mada':
      front.push(
        <g key="spin" stroke="none">
          {Array.from({length: 8}, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            const lit = (i - Math.floor(f / 2)) & 7;
            return <circle key={i} cx={hx + Math.cos(a) * 12 * s} cy={hy - R - 26 * s + Math.sin(a) * 12 * s} r={3 * s} fill={c} opacity={0.2 + (lit / 8) * 0.8} />;
          })}
        </g>,
      );
      break;
    case 'ttemme': {
      const t = p.t ?? 0;
      const ox = hl[0];
      const oy = hl[1] - 30 * s;
      front.push(
        <g key="hg" strokeWidth={thin}>
          <path d={`M${ox - 11 * s} ${oy} h${22 * s} L${ox} ${oy + 16 * s} Z M${ox - 11 * s} ${oy + 32 * s} h${22 * s} L${ox} ${oy + 16 * s} Z`} fill={bg} />
          <path d={`M${ox - 11 * s * (1 - t)} ${oy + 16 * s - 16 * s * (1 - t)} h${22 * s * (1 - t)} L${ox} ${oy + 16 * s} Z`} fill={pal.gold} stroke="none" />
          <path d={`M${ox - 11 * s * t} ${oy + 32 * s} h${22 * s * t} L${ox} ${oy + 32 * s - 14 * s * t} Z`} fill={pal.gold} stroke="none" />
        </g>,
      );
      break;
    }
    case 'terb':
      front.push(
        <g key="ext" strokeWidth={thin}>
          <rect x={hr[0] - 7 * s} y={hr[1] - 6 * s} width={14 * s} height={32 * s} rx={5 * s} fill={pal.red} stroke={c} />
          <path d={`M${hr[0]} ${hr[1] - 6 * s} q${dir * 4 * s} ${-10 * s} ${dir * 16 * s} ${-8 * s}`} />
        </g>,
      );
      break;
    case 'luap':
      front.push(
        <path key="crown" d={`M${hx - 15 * s} ${hy - R + 3 * s} L${hx - 15 * s} ${hy - R - 13 * s} L${hx - 8 * s} ${hy - R - 5 * s} L${hx} ${hy - R - 16 * s} L${hx + 8 * s} ${hy - R - 5 * s} L${hx + 15 * s} ${hy - R - 13 * s} L${hx + 15 * s} ${hy - R + 3 * s} Z`} fill={pal.gold} stroke={c} strokeWidth={thin} />,
      );
      break;
    case 'sama-nos':
      front.push(
        <g key="mirror" strokeWidth={thin}>
          <line x1={hl[0]} y1={hl[1]} x2={hl[0]} y2={hl[1] - 10 * s} />
          <ellipse cx={hl[0]} cy={hl[1] - 22 * s} rx={9 * s} ry={12 * s} fill={bg} />
          <path d={`M${hl[0] - 4 * s} ${hl[1] - 27 * s} l${5 * s} ${-4 * s}`} stroke={pal.glow} />
        </g>,
      );
      break;
    case 'yrral': {
      const bx = x - dir * 52 * s;
      front.push(
        <g key="yacht" strokeWidth={thin}>
          <path d={`M${bx - 26 * s} ${yy - 12 * s} h${52 * s} l${-8 * s} ${12 * s} h${-36 * s} Z`} fill={bg} />
          <path d={`M${bx} ${yy - 12 * s} v${-40 * s} l${20 * s} ${34 * s} Z`} fill={c} fillOpacity={0.4} />
        </g>,
      );
      break;
    }
    case 'intern':
      front.push(
        <g key="lan" strokeWidth={thin}>
          <path d={`M${x - 8 * s} ${shY + 2 * s} L${x} ${shY + 24 * s} L${x + 8 * s} ${shY + 2 * s}`} />
          <rect x={x - 8 * s} y={shY + 24 * s} width={16 * s} height={11 * s} fill={pal.glow} stroke="none" />
        </g>,
      );
      break;
    default:
      break;
  }
  const faceNode =
    id === 'intern' ? (
      <path
        d={`M${hx - 5 * s} ${hy - 12 * s} l0 ${22 * s} l${5 * s} ${-5 * s} l${4 * s} ${9 * s} l${4 * s} ${-2 * s} l${-4 * s} ${-9 * s} l${7 * s} 0 Z`}
        fill={Math.floor(f / 8) % 2 === 0 ? c : pal.glow}
        stroke="none"
      />
    ) : (
      <FaceMarks hx={hx} hy={hy} s={s} c={c} sw={sw} face={p.face} look={p.look ?? 0} down={pose === 'slump'} />
    );
  const chair =
    pose === 'sit' ? (
      <g stroke={pal.dim} strokeWidth={sw * 0.8} fill="none">
        <path d={`M${x - dir * 16 * s} ${hipY + 4 * s} h${dir * 50 * s} M${x - dir * 12 * s} ${hipY + 4 * s} V${yy} M${x + dir * 30 * s} ${hipY + 4 * s} V${yy} M${x - dir * 16 * s} ${hipY + 4 * s} V${shY + 6 * s}`} />
      </g>
    ) : null;
  const rot = pose === 'lean' ? -8 * dir : 0;
  return (
    <g transform={rot ? `rotate(${rot} ${x} ${p.y})` : undefined}>
      {chair}
      <g stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray={dash}>
        {back}
        <path d={legs} />
        <line x1={x} y1={hipY} x2={pose === 'slump' ? x + dir * 4 * s : x} y2={shY - 6 * s} />
        <path d={`M${hl[0]} ${hl[1]} L${sh[0]} ${sh[1]} L${hr[0]} ${hr[1]}`} />
        <circle cx={hx} cy={hy} r={R} fill={bg} />
        {faceNode}
        {front}
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- non-humanoids
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const Special: React.FC<FigProps & {c: string}> = (p) => {
  const {id, x, y, s, pal, f, c} = p;
  const sw = Math.max(2, 3.6 * s);
  const bob = Math.sin(f / 9) * 5 * s;
  const dir = p.dir ?? 1;
  switch (id) {
    case 'whale': {
      const breach = p.pose === 'float' || p.pose === 'arms-up';
      const cy = y - (breach ? 120 : 52) * s + (breach ? bob : 0);
      const d = dir;
      return (
        <g transform={breach ? `rotate(${-14 * d} ${x} ${cy})` : undefined} stroke={c} strokeWidth={sw} strokeLinejoin="round" fill={pal.bg2}>
          <path d={`M${x - d * 96 * s} ${cy} L${x - d * 140 * s} ${cy - 30 * s} L${x - d * 128 * s} ${cy} L${x - d * 140 * s} ${cy + 26 * s} Z`} />
          <path d={`M${x - d * 100 * s} ${cy} Q${x - d * 92 * s} ${cy - 52 * s} ${x - d * 10 * s} ${cy - 54 * s} Q${x + d * 82 * s} ${cy - 54 * s} ${x + d * 98 * s} ${cy - 6 * s} Q${x + d * 84 * s} ${cy + 40 * s} ${x} ${cy + 40 * s} Q${x - d * 72 * s} ${cy + 40 * s} ${x - d * 100 * s} ${cy} Z`} />
          <path d={`M${x + d * 30 * s} ${cy + 14 * s} Q${x + d * 62 * s} ${cy + 22 * s} ${x + d * 92 * s} ${cy + 4 * s}`} fill="none" strokeWidth={sw * 0.6} />
          <circle cx={x + d * 58 * s} cy={cy - 14 * s} r={(p.face === 'shocked' ? 6 : 4) * s} fill={c} stroke="none" />
          {[0, 1, 2].map((i) => {
            const k = ((f / 6 + i / 3) % 1 + 1) % 1;
            return <circle key={i} cx={x + d * (20 + (i - 1) * 12 * k) * s} cy={cy - 56 * s - k * 40 * s} r={4 * s * (1 - k * 0.5)} fill={pal.glow} stroke="none" opacity={1 - k} />;
          })}
        </g>
      );
    }
    case 'orb': {
      const r = 30 * s;
      const cy = y - 135 * s + bob;
      const lk = p.look ?? 0;
      return (
        <g>
          <ellipse cx={x} cy={y - 2 * s} rx={20 * s} ry={4 * s} fill={pal.ink} opacity={0.2} />
          <circle cx={x} cy={cy} r={r} fill={pal.bg} stroke={c} strokeWidth={sw} />
          <ellipse cx={x + lk * r * 0.3} cy={cy} rx={r * 0.55} ry={r * 0.55} fill="none" stroke={pal.glow} strokeWidth={sw * 0.8} />
          <circle cx={x + lk * r * 0.38} cy={cy} r={r * 0.2} fill={pal.glow} />
        </g>
      );
    }
    case 'calendar': {
      const n = Math.floor(f / 10);
      const m = (p.date ?? '').match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/);
      const top = m ? MONTHS[Math.max(0, Math.min(11, +m[2] - 1))] + ' ' + m[1] : '';
      const day = m && m[3] ? String(+m[3]) : String(((n * 7) % 28) + 1);
      const X = x - 48 * s;
      const Y = y - 200 * s;
      const tear = (f % 10) / 10;
      return (
        <g stroke={c} strokeWidth={sw * 0.7}>
          <line x1={x} y1={Y + 110 * s} x2={x} y2={y} />
          <rect x={X} y={Y} width={96 * s} height={112 * s} fill={pal.plate} />
          <rect x={X} y={Y} width={96 * s} height={24 * s} fill={pal.red} />
          <text x={x} y={Y + 18 * s} fill={pal.mono ? pal.plate : '#fff'} stroke="none" fontFamily={MONO} fontWeight={700} fontSize={13 * s} textAnchor="middle">
            {top || 'CALENDAR'}
          </text>
          <text x={x} y={Y + 88 * s} fill={pal.plateInk} stroke="none" fontFamily={MONO} fontWeight={700} fontSize={50 * s} textAnchor="middle">
            {day}
          </text>
          {!m && <rect x={X + tear * 40 * s} y={Y + 24 * s - tear * 60 * s} width={96 * s} height={88 * s} fill={pal.plate} opacity={1 - tear} transform={`rotate(${tear * 30} ${x} ${Y})`} />}
        </g>
      );
    }
    case 'podium':
      return (
        <g stroke={c} strokeWidth={sw}>
          <path d={`M${x - 40 * s} ${y - 104 * s} L${x + 40 * s} ${y - 104 * s} L${x + 30 * s} ${y} L${x - 30 * s} ${y} Z`} fill={pal.gold} />
          <circle cx={x} cy={y - 60 * s} r={14 * s} fill="none" />
          <path d={`M${x + 10 * s} ${y - 104 * s} q${6 * s} ${-18 * s} ${-4 * s} ${-26 * s}`} fill="none" />
          <circle cx={x - 5 * s} cy={y - 130 * s} r={4 * s} fill={c} />
        </g>
      );
    case 'clod': {
      const top = y - 116 * s + (Math.floor(f / 12) % 2) * s;
      return (
        <g stroke={pal.mono ? c : '#5a2616'} strokeWidth={sw * 0.8}>
          <path d={`M${x - 34 * s} ${y} Q${x - 42 * s} ${top + 30 * s} ${x - 18 * s} ${top + 4 * s} Q${x} ${top - 8 * s} ${x + 20 * s} ${top + 4 * s} Q${x + 42 * s} ${top + 30 * s} ${x + 34 * s} ${y} Z`} fill={pal.clay} />
          <path d={`M${x - 16 * s} ${top + 58 * s} q${6 * s} ${-6 * s} ${12 * s} 0 M${x + 8 * s} ${top + 72 * s} q${5 * s} ${-5 * s} ${10 * s} 0`} fill="none" opacity={0.5} />
          <FaceMarks hx={x} hy={top + 26 * s} s={s} c={pal.mono ? c : '#2a1008'} sw={sw} face={p.face} look={p.look ?? 0} />
          <path d={`M${x} ${top + 44 * s} l${-10 * s} ${-6 * s} v${12 * s} Z M${x} ${top + 44 * s} l${10 * s} ${-6 * s} v${12 * s} Z`} fill={pal.mono ? c : pal.plateInk} />
          <rect x={x + dir * 30 * s - 9 * s} y={top + 52 * s} width={18 * s} height={24 * s} fill={pal.plate} />
        </g>
      );
    }
    case 'chatgtp': {
      const cy = y - 118 * s + bob;
      const d = (i: number) => 0.3 + 0.7 * (Math.floor(f / 5) % 3 === i ? 1 : 0);
      return (
        <g stroke={pal.glow} strokeWidth={sw}>
          <path d={`M${x - 52 * s} ${cy - 32 * s} h${104 * s} a${26 * s} ${26 * s} 0 0 1 0 ${64 * s} h${-72 * s} l${-18 * s} ${16 * s} l${2 * s} ${-16 * s} a${26 * s} ${26 * s} 0 0 1 ${-16 * s} ${-64 * s} Z`} fill={pal.bg2} />
          <circle cx={x - 14 * s} cy={cy - 8 * s} r={4 * s} fill={pal.glow} stroke="none" />
          <circle cx={x + 14 * s} cy={cy - 8 * s} r={4 * s} fill={pal.glow} stroke="none" />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={x + (i - 1) * 12 * s} cy={cy + 14 * s} r={3.5 * s} fill={pal.glow} stroke="none" opacity={d(i)} />
          ))}
        </g>
      );
    }
    case 'korg': {
      const r = rng2(7);
      const pts: string[] = [];
      for (let i = 0; i < 14; i++) {
        const a = Math.PI + (i / 13) * Math.PI;
        const rr = (58 + r() * 16) * s;
        pts.push(`${x + Math.cos(a) * rr * 0.9},${y - 4 * s + Math.sin(a) * rr * 1.9}`);
      }
      const glowC = pal.mono ? pal.ink : pal.key === '2-TONE' ? pal.ink : '#ff9a3c';
      return (
        <g>
          <polygon points={`${x - 60 * s},${y} ${pts.join(' ')} ${x + 60 * s},${y}`} fill={pal.mono ? pal.bg : '#4c5058'} stroke={c} strokeWidth={sw} strokeLinejoin="round" />
          <path d={`M${x - 20 * s} ${y - 40 * s} l${10 * s} ${-18 * s} l${-6 * s} ${-16 * s} M${x + 18 * s} ${y - 24 * s} l${-8 * s} ${-22 * s} l${10 * s} ${-12 * s}`} stroke={glowC} strokeWidth={sw * 0.7} fill="none" />
          <rect x={x - 20 * s} y={y - 104 * s} width={12 * s} height={5 * s} fill={glowC} />
          <rect x={x + 8 * s} y={y - 104 * s} width={12 * s} height={5 * s} fill={glowC} />
        </g>
      );
    }
    default:
      return null;
  }
};
const rng2 = (seed: number) => {
  let t = seed;
  return () => {
    t = (t * 9301 + 49297) % 233280;
    return t / 233280;
  };
};

export const FigLabel: React.FC<{id: string; pose: Pose; x: number; y: number; s: number; pal: Pal; mode: 'below' | 'side'}> = ({id, pose, x, y, s, pal, mode}) => {
  // 1-BIT: every colour is ink, so the label is ink on a paper chip (ink on a dark chip would vanish)
  const c = pal.mono ? pal.ink : id === 'mas' ? pal.mas : pal.ink;
  const bg = pal.mono ? pal.plate : 'rgba(0,0,0,0.55)';
  const st = pal.mono ? pal.ink : 'none';
  const name = displayName(id);
  const fs = 13;
  const w = name.length * fs * 0.62 + 10;
  if (mode === 'below') {
    const ly = Math.min(y + 20, 626);
    return (
      <g>
        <rect x={x - w / 2} y={ly - 13} width={w} height={17} rx={3} fill={bg} stroke={st} strokeWidth={1.5} />
        <text x={x} y={ly} fill={c} fontFamily={MONO} fontWeight={700} fontSize={fs} textAnchor="middle">
          {name}
        </text>
      </g>
    );
  }
  const top = figTop(id, pose, x, y, s);
  const lx = x + 30 * s;
  const ly = Math.max(top + 30 * s, 84);
  return (
    <g>
      <rect x={lx} y={ly - 13} width={w} height={17} rx={3} fill={bg} stroke={st} strokeWidth={1.5} />
      <text x={lx + 5} y={ly} fill={c} fontFamily={MONO} fontWeight={700} fontSize={fs}>
        {name}
      </text>
    </g>
  );
};

export const Figure: React.FC<FigProps> = (p) => {
  const c = p.id === 'mas' ? p.pal.mas : p.pal.ink;
  const body = SPECIAL.has(p.id) ? <Special {...p} c={c} /> : <Humanoid {...p} c={c} />;
  const label = p.label ?? 'below';
  return (
    <g>
      {body}
      {label !== 'none' && <FigLabel id={p.id} pose={p.pose} x={p.x} y={p.y} s={p.s} pal={p.pal} mode={label} />}
    </g>
  );
};
