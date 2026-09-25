// ROUGH ANIMATIC of the MR. MAS intro (v2 pixel plan): stick figures, boxes, arrows, style-switch hints,
// and always-on timing overlays. Clarity over polish. Sources: studio/INTRO_PIXEL_BRIEF.md,
// show/intro/SCRIPT.md (v2.0, master), show/intro/shot-table.md (v1.1 timing/gags).
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {FrameDef} from '../shared/frame-def';
import {FONT} from '../shared/theme/fonts';

// ---------------------------------------------------------------- utils
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lin = (f: number, a: number, b: number, v0: number, v1: number) => v0 + (v1 - v0) * clamp((f - a) / (b - a));
const inR = (f: number, a: number, b: number) => f >= a && f <= b;
const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
const typed = (s: string, f: number, a: number, b: number) => s.slice(0, Math.round(s.length * clamp((f - a + 1) / (b - a + 1))));
const rng = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};
const shakeXY = (f: number, amp: number, seed = 1): [number, number] => {
  const r = rng(f * 97 + seed);
  return [Math.round((r() * 2 - 1) * amp), Math.round((r() * 2 - 1) * amp)];
};
const barBeat = (f: number) => `${Math.floor(f / 60) + 1}.${Math.floor((f % 60) / 15) + 1}`;
const MONO = FONT.mono;
const PIX = FONT.pixel;
const W = 1280;
const SH = 584; // stage height (caption + timeline below)

// ---------------------------------------------------------------- palettes (one per style)
type Pal = {key: string; bg: string; bg2: string; wall: string; ink: string; dim: string; text: string; glow: string; mas: string; neon: string; accent: string; frozen?: boolean};
const BASE: Pal = {key: 'BASE', bg: '#0a1532', bg2: '#13244d', wall: '#0d1b3d', ink: '#93aee0', dim: '#3f5790', text: '#e4ecff', glow: '#3FE6FF', mas: '#FFC857', neon: '#ff5fa2', accent: '#ff9a5c'};
const BLOOM: Pal = {...BASE, key: 'BLOOM', bg: '#1a2f63', bg2: '#27427e', wall: '#1d3470', ink: '#c6d7fc', dim: '#6c87c6', text: '#ffffff'};
const TWO: Pal = {key: '2TONE', bg: '#1B2A4A', bg2: '#223457', wall: '#1B2A4A', ink: '#F2E8CF', dim: '#7e7c74', text: '#F2E8CF', glow: '#3FE6FF', mas: '#FFC857', neon: '#F2E8CF', accent: '#F2E8CF', frozen: true};
const TWO_POP: Pal = {...TWO, bg: '#33466e', wall: '#33466e', bg2: '#3a4f78'};
const ONE: Pal = {key: '1BIT', bg: '#E9E6DA', bg2: '#E9E6DA', wall: '#E9E6DA', ink: '#0E0E10', dim: '#0E0E10', text: '#0E0E10', glow: '#0E0E10', mas: '#0E0E10', neon: '#0E0E10', accent: '#0E0E10'};
const EW: Pal = {key: 'EW16', bg: '#000080', bg2: '#008080', wall: '#000080', ink: '#C0C0C0', dim: '#808080', text: '#FFFFFF', glow: '#00FFFF', mas: '#FFFF00', neon: '#FF00FF', accent: '#FF6600'};
const GREY: Pal = {key: 'GREY', bg: '#26282c', bg2: '#34363b', wall: '#26282c', ink: '#9c9ea4', dim: '#55575c', text: '#e2e2e2', glow: '#8fb8bd', mas: '#c4bfae', neon: '#a0a0a0', accent: '#a0a0a0'};
const CREAM = '#F2E8CF';
const NAVY = '#1B2A4A';

// ---------------------------------------------------------------- stick figure
type Kind = 'mas' | 'kid' | 'nole' | 'gerg' | 'alyi' | 'mario' | 'guy';
type Pt = [number, number];
interface SP {
  x: number; y: number; s?: number; kind: Kind; c: string; bg: string;
  look?: number | 'lens'; hl?: Pt; hr?: Pt; arms?: [number, number]; walk?: number; sit?: boolean; cross?: boolean;
  smile?: boolean; label?: string; labelC?: string; whip?: number; back?: 'back' | 'profile' | 'eye'; noProp?: boolean; sw?: number;
}
const Stick: React.FC<SP> = (p) => {
  const s = p.s ?? 1;
  const {x, y, c} = p;
  const sw = p.sw ?? Math.max(2.2, 4 * s);
  const hipY = p.sit || p.cross ? y - 40 * s : y - 70 * s;
  const shY = hipY - 50 * s;
  const R = 22 * s;
  const hy = shY - 8 * s - R;
  let legs: string;
  if (p.cross) legs = `M${x} ${hipY} L${x - 26 * s} ${hipY + 12 * s} L${x + 26 * s} ${hipY + 12 * s} Z`;
  else if (p.sit) legs = `M${x} ${hipY} L${x + 30 * s} ${hipY} L${x + 30 * s} ${y} M${x} ${hipY} L${x + 24 * s} ${hipY + 5 * s} L${x + 20 * s} ${y}`;
  else {
    const w = p.walk === undefined ? 0 : Math.sin(p.walk) * 16 * s;
    legs = `M${x - 12 * s + w} ${y} L${x} ${hipY} L${x + 12 * s - w} ${y}`;
  }
  const ap = (side: number, a: number): Pt => {
    const th = ((18 + a) * Math.PI) / 180;
    return [x + side * Math.sin(th) * 52 * s, shY + 4 * s + Math.cos(th) * 52 * s];
  };
  const hl = p.hl ?? ap(-1, p.arms?.[0] ?? 0);
  const hr = p.hr ?? ap(1, p.arms?.[1] ?? 0);
  const look = p.look ?? 0;
  const isMas = p.kind === 'mas' || p.kind === 'kid';
  const wh = p.whip ?? 0;
  let face: React.ReactNode = null;
  if (p.back === 'back') face = <circle cx={x} cy={hy} r={R * 0.8} fill={c} opacity={0.35} stroke="none" />;
  else if (p.back === 'profile') face = <circle cx={x + R * 0.75} cy={hy - 2 * s} r={2.6 * s} fill={c} stroke="none" />;
  else if (p.back === 'eye') face = <circle cx={x + R * 0.55} cy={hy - 2 * s} r={3.8 * s} fill={c} stroke="none" />;
  else {
    const lx = look === 'lens' ? 0 : look * 9 * s;
    const er = look === 'lens' ? 3.6 * s : 2.7 * s;
    face = (
      <g stroke="none" fill={c}>
        <circle cx={x + lx - 7 * s} cy={hy - 2 * s} r={er} />
        <circle cx={x + lx + 7 * s} cy={hy - 2 * s} r={er} />
        {p.smile ? (
          <path d={`M${x + lx - 7 * s} ${hy + 8 * s} Q${x + lx} ${hy + 14 * s} ${x + lx + 7 * s} ${hy + 8 * s}`} stroke={c} strokeWidth={sw * 0.6} fill="none" />
        ) : (
          <line x1={x + lx - 5 * s} y1={hy + 10 * s} x2={x + lx + 5 * s} y2={hy + 10 * s} stroke={c} strokeWidth={sw * 0.6} />
        )}
      </g>
    );
  }
  return (
    <g stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none">
      {isMas && <path d={`M${x - R - 5 * s} ${shY + 6 * s} A ${R + 9 * s} ${R + 9 * s} 0 1 1 ${x + R + 5 * s} ${shY + 6 * s}`} />}
      <path d={legs} />
      <line x1={x} y1={hipY} x2={x} y2={shY - 6 * s} />
      <path d={`M${hl[0]} ${hl[1]} L${x} ${shY + 4 * s} L${hr[0]} ${hr[1]}`} />
      <circle cx={x} cy={hy} r={R} fill={p.bg} />
      {face}
      {isMas && (
        <>
          <path d={`M${x - 5 * s} ${shY + 4 * s} l0 ${12 * s} M${x + 5 * s} ${shY + 4 * s} l0 ${12 * s}`} strokeWidth={sw * 0.5} />
          <path d={`M${x + 3 * s} ${hy - R + 1} q${6 * s + wh} ${-14 * s} ${16 * s + wh * 2} ${-8 * s + wh * 0.3}`} />
        </>
      )}
      {p.kind === 'nole' && !p.noProp && <rect x={hr[0] - 5 * s} y={hr[1] - 20 * s} width={10 * s} height={18 * s} fill={c} stroke="none" />}
      {p.kind === 'gerg' && !p.noProp && (
        <g strokeWidth={sw * 0.6}>
          <rect x={x - 36 * s} y={hipY - 16 * s} width={72 * s} height={14 * s} fill={p.bg} />
          <path d={`M${x - 30 * s} ${hipY - 9 * s} h${60 * s}`} strokeDasharray={`${4 * s} ${3 * s}`} />
        </g>
      )}
      {p.kind === 'alyi' &&
        Array.from({length: 10}, (_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return <line key={i} x1={x + Math.cos(a) * (R + 6 * s)} y1={hy + Math.sin(a) * (R + 6 * s)} x2={x + Math.cos(a) * (R + 15 * s)} y2={hy + Math.sin(a) * (R + 15 * s)} strokeWidth={sw * 0.5} />;
        })}
      {p.kind === 'mario' && (
        <g strokeWidth={sw * 0.55}>
          {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
            <circle key={i} cx={x + i * 6.5 * s} cy={hy - R + Math.abs(i) * 2.2 * s} r={5 * s} />
          ))}
          {p.back ? null : (
            <>
              <circle cx={x - 7 * s} cy={hy - 2 * s} r={6.5 * s} />
              <circle cx={x + 7 * s} cy={hy - 2 * s} r={6.5 * s} />
            </>
          )}
        </g>
      )}
      {p.label && (
        <text x={x} y={y + 16 + 4 * s} fill={p.labelC ?? c} stroke="none" fontFamily={MONO} fontWeight={700} fontSize={13} textAnchor="middle">
          {p.label}
        </text>
      )}
    </g>
  );
};

// ---------------------------------------------------------------- props
const Orb: React.FC<{x: number; y: number; r: number; c: string; glow: string; bg: string; iris: Pt; open?: number; label?: boolean}> = ({x, y, r, c, glow, bg, iris, open = 1, label}) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={bg} stroke={c} strokeWidth={3} />
    <ellipse cx={x + iris[0] * r * 0.3} cy={y + iris[1] * r * 0.3} rx={r * 0.55} ry={r * 0.55 * open} fill="none" stroke={glow} strokeWidth={3} />
    <circle cx={x + iris[0] * r * 0.38} cy={y + iris[1] * r * 0.38} r={r * 0.2 * Math.max(0.4, open)} fill={glow} />
    {label && (
      <text x={x} y={y + r + 16} fill={c} fontFamily={MONO} fontSize={12} fontWeight={700} textAnchor="middle">
        ORB
      </text>
    )}
  </g>
);

const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; c: string; label?: string; dash?: boolean; w?: number; lx?: number; ly?: number}> = ({x1, y1, x2, y2, c, label, dash, w = 3, lx, ly}) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = 12;
  const p1: Pt = [x2 - Math.cos(a - 0.45) * h, y2 - Math.sin(a - 0.45) * h];
  const p2: Pt = [x2 - Math.cos(a + 0.45) * h, y2 - Math.sin(a + 0.45) * h];
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={w} strokeDasharray={dash ? '8 6' : undefined} strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}`} fill={c} />
      {label && (
        <text x={lx ?? (x1 + x2) / 2} y={ly ?? (y1 + y2) / 2 - 8} fill={c} fontFamily={MONO} fontSize={13} fontWeight={700} textAnchor="middle">
          {label}
        </text>
      )}
    </g>
  );
};

const Note: React.FC<{x: number; y: number; t: string; c?: string; bg?: string; size?: number; anchor?: 'start' | 'middle' | 'end'}> = ({x, y, t, c = '#fff', bg = 'rgba(0,0,0,0.55)', size = 13, anchor = 'start'}) => {
  const w = t.length * size * 0.62 + 10;
  const x0 = anchor === 'start' ? x : anchor === 'middle' ? x - w / 2 : x - w;
  return (
    <g>
      <rect x={x0} y={y - size - 3} width={w} height={size + 9} fill={bg} rx={3} />
      <text x={x0 + 5} y={y} fill={c} fontFamily={MONO} fontSize={size} fontWeight={700}>
        {t}
      </text>
    </g>
  );
};

const Glass: React.FC<{x: number; y: number; c: string; tilt?: number; water?: string}> = ({x, y, c, tilt = 0, water}) => (
  <g>
    <rect x={x - 7} y={y - 22} width={14} height={22} fill="none" stroke={c} strokeWidth={2.2} />
    <line x1={x - 7} y1={y - 12 + tilt} x2={x + 7} y2={y - 12 - tilt} stroke={water ?? c} strokeWidth={2.5} />
  </g>
);

const Candle: React.FC<{x: number; y: number; c: string; flame: string; flat?: boolean; f: number; frozen?: boolean}> = ({x, y, c, flame, flat, f, frozen}) => {
  const fl = frozen ? 0 : Math.sin(f * 1.7) * 2;
  return (
    <g>
      <rect x={x - 3} y={y - 26} width={6} height={26} fill={c} />
      {flat ? <polygon points={`${x},${y - 28} ${x - 18},${y - 31} ${x},${y - 34}`} fill={flame} /> : <polygon points={`${x - 5},${y - 28} ${x + 5},${y - 28} ${x + fl},${y - 44}`} fill={flame} />}
    </g>
  );
};

const DateCard: React.FC<{x: number; y: number; t: string; c: string; sh?: string; font?: string}> = ({x, y, t, c, sh = '#000', font = PIX}) => (
  <g fontFamily={font} fontWeight={700} fontSize={44}>
    <text x={x + 3} y={y + 3} fill={sh}>{t}</text>
    <text x={x} y={y} fill={c}>{t}</text>
  </g>
);

const Pointer: React.FC<{x: number; y: number; c: string; stroke: string}> = ({x, y, c, stroke}) => (
  <polygon points={`${x},${y} ${x},${y + 30} ${x + 8},${y + 23} ${x + 14},${y + 36} ${x + 19},${y + 34} ${x + 13},${y + 21} ${x + 23},${y + 21}`} fill={c} stroke={stroke} strokeWidth={2} strokeLinejoin="round" />
);

// Monospace token field. fn chooses each char (else random tokens).
const GLY = '01<>{}[]=+*#;:/|~^%$&@';
const GlyphField: React.FC<{x: number; y: number; w: number; h: number; size?: number; seed: number; color: string; fn?: (c: number, r: number, cols: number, rows: number, rnd: () => number) => string; op?: number}> = ({x, y, w, h, size = 14, seed, color, fn, op = 1}) => {
  const rows = Math.floor(h / size);
  const cols = Math.floor(w / (size * 0.6));
  const rnd = rng(seed);
  const lines: string[] = [];
  for (let r = 0; r < rows; r++) {
    let s = '';
    for (let c = 0; c < cols; c++) s += fn ? fn(c, r, cols, rows, rnd) : GLY[Math.floor(rnd() * GLY.length)];
    lines.push(s);
  }
  return (
    <g fontFamily={MONO} fontSize={size} fill={color} opacity={op}>
      {lines.map((l, i) => (
        <text key={i} x={x} y={y + size * (i + 1) - 2} xmlSpace="preserve">
          {l}
        </text>
      ))}
    </g>
  );
};
// cathedral of tokens: pillars (dense) receding to centre, arches at top, floor lines
const cathedralFn = (c: number, r: number, cols: number, rows: number, rnd: () => number) => {
  const u = Math.abs(c - cols / 2);
  const band = Math.floor(Math.sqrt(u) * 2.4) % 2 === 0 && u > 1.5;
  const archRow = r < rows * 0.18;
  if (band) return rnd() < 0.8 ? '#' : '|';
  if (archRow) return rnd() < 0.5 ? '^' : '/';
  if (r > rows * 0.8) return rnd() < 0.6 ? '_' : '=';
  return rnd() < 0.12 ? GLY[Math.floor(rnd() * GLY.length)] : ' ';
};

// the skyline as tokens (Orb iris, f705-706): column heights with NopeAI's spire in the middle
const IRIS_SKY = [1, 2, 3, 3, 2, 4, 8, 5, 3, 4, 3, 2, 1, 1];
const irisSkylineFn = (c: number, r: number, cols: number, rows: number, rnd: () => number) => {
  const h = IRIS_SKY[c % IRIS_SKY.length];
  if (r >= rows - h) return c === 6 ? '|' : rnd() < 0.7 ? '#' : GLY[Math.floor(rnd() * GLY.length)];
  return rnd() < 0.08 ? '.' : ' ';
};

// ---------------------------------------------------------------- name card
interface CardP {
  f: number; start: number; end: number; x: number; y: number; w: number; h: number; name: string; nameC: string; sub: string; subFrom: number; subTo: number;
  stat?: string; statFrom?: number; plate: string; ink: string; border: string; kind: Kind; lancet?: boolean; rot?: number; enter?: (k: number) => Pt; extra?: React.ReactNode;
}
const Card: React.FC<CardP> = (p) => {
  const {f} = p;
  if (f < p.start || f > p.end + 1) return null;
  const k = f - p.start;
  const off = p.enter ? p.enter(k) : [0, 0];
  const closing = f > p.end - 1 ? (f === p.end ? 0.6 : 0.25) : 1; // 2-step close
  const winFrac = k === 0 ? 0.34 : k === 1 ? 0.67 : 1;
  const px = p.lancet ? p.x + p.w / 2 - 55 : p.x + 16;
  const py = p.lancet ? p.y + 70 : p.y + 16;
  const tx = p.lancet ? p.x + 20 : p.x + 146;
  const ny = p.lancet ? p.y + 225 : p.y + 58;
  const outline = p.lancet
    ? `M${p.x} ${p.y + p.h} L${p.x} ${p.y + 80} Q${p.x} ${p.y + 10} ${p.x + p.w / 2} ${p.y - 30} Q${p.x + p.w} ${p.y + 10} ${p.x + p.w} ${p.y + 80} L${p.x + p.w} ${p.y + p.h} Z`
    : `M${p.x} ${p.y} h${p.w} v${p.h} h${-p.w} Z`;
  const cx = p.x + p.w / 2;
  const cy = p.y + p.h / 2;
  return (
    <g transform={`translate(${off[0]} ${off[1]}) rotate(${p.rot ?? 0} ${cx} ${cy}) translate(${cx} ${cy}) scale(1 ${closing}) translate(${-cx} ${-cy})`}>
      <path d={outline} transform="translate(6 6)" fill="rgba(0,0,0,0.45)" />
      <path d={outline} fill={p.plate} stroke={p.border} strokeWidth={4} />
      {p.lancet && (
        <g stroke={p.border} strokeWidth={1.5} opacity={0.5}>
          <line x1={p.x + p.w / 2} y1={p.y - 20} x2={p.x + p.w / 2} y2={p.y + 60} />
          <line x1={p.x} y1={p.y + 190} x2={p.x + p.w} y2={p.y + 190} />
          <rect x={p.x + 8} y={p.y + 64} width={40} height={120} fill="#7a2f5a" opacity={0.5} />
          <rect x={p.x + p.w - 48} y={p.y + 64} width={40} height={120} fill="#2f6a7a" opacity={0.5} />
        </g>
      )}
      <svg x={px} y={py} width={110} height={110 * winFrac} viewBox={`0 0 110 ${110 * winFrac}`}>
        <rect width={110} height={110} fill={p.kind === 'mario' ? '#d9c9a6' : '#0c1426'} />
        <Stick x={55} y={300} s={1.6} kind={p.kind} c={p.ink} bg={p.kind === 'mario' ? '#d9c9a6' : '#0c1426'} look={-0.3} noProp />
      </svg>
      <rect x={px} y={py} width={110} height={110 * winFrac} fill="none" stroke={p.border} strokeWidth={3} />
      {k >= 3 && (
        <text x={tx} y={ny} fill={p.nameC} fontFamily={FONT.cardName} fontSize={40} letterSpacing={1}>
          {p.name}
        </text>
      )}
      {k >= 4 && <rect x={tx} y={ny + 8} width={Math.min(p.w - (tx - p.x) - 20, 260)} height={4} fill={p.nameC} />}
      <text x={tx} y={ny + 46} fill={p.ink} fontFamily={MONO} fontWeight={700} fontSize={26}>
        {typed(p.sub, f, p.subFrom, p.subTo)}
      </text>
      {p.stat && p.statFrom !== undefined && f >= p.statFrom && (
        <text x={tx} y={ny + 72} fill={p.ink} opacity={0.55} fontFamily={MONO} fontSize={12}>
          {p.stat}
        </text>
      )}
      {p.extra}
    </g>
  );
};

// ---------------------------------------------------------------- SCENE 1: monitor insert (f0-89, f112-119)
const QUOTE1 = 'near the singularity;';
const QUOTE2 = ' unclear which side.';
const CURSOR_PT: Pt = [794, 268];
const chartY = (t: number) => 458 - Math.pow(t, 2.5) * 170; // knee curve (drawn inside the chart)
const dotY = (t: number) => (t <= 1 ? chartY(t) : chartY(1) - (t - 1) * 1400); // dot keeps climbing off the top
const Insert: React.FC<{f: number}> = ({f}) => {
  const P = BASE;
  const blink = f % 15 < 8;
  if (f < 15) {
    return (
      <g>
        <rect width={W} height={SH} fill="#020409" />
        {blink && <rect x={CURSOR_PT[0]} y={CURSOR_PT[1] - 20} width={12} height={24} fill={P.glow} />}
        <Note x={CURSOR_PT[0] + 24} y={CURSOR_PT[1]} t="cursor blinks on the beat (on 8 / off 7)" c={P.glow} />
      </g>
    );
  }
  const step = f < 18 ? (f - 14) / 3 : 1;
  const txt = typed(QUOTE1, f, 18, 49) + (f >= 64 ? typed(QUOTE2, f, 64, 83) : '');
  const chw = 26 * 0.6;
  const typing = (f >= 18 && f < 50) || (f >= 64 && f < 84);
  const post = f >= 112;
  // dot on the knee
  const dt = f < 84 ? 0 : lin(f, 84, 89, 0, 1.25);
  const dx = 640 + dt * 360;
  const dy = dotY(dt);
  const chips = ['near', '·the', '·singular', 'ity', ';', '·unclear', '·which', '·side', '.'];
  const k = f - 112;
  const bayer = f >= 116 ? f - 115 : 0; // 1..4
  return (
    <g opacity={step}>
      <rect width={W} height={SH} fill="#03060e" />
      <rect x={120} y={40} width={1040} height={490} rx={18} fill="#0b0f18" stroke="#2a3346" strokeWidth={6} />
      <rect x={150} y={66} width={980} height={436} fill="#060b17" />
      <text x={170} y={92} fill={P.dim} fontFamily={MONO} fontSize={13}>
        [ MAS's monitor — INSERT, full frame ]
      </text>
      {/* composer */}
      <rect x={260} y={104} width={760} height={150} rx={10} fill="#0d1730" stroke={P.dim} strokeWidth={2} />
      <circle cx={298} cy={146} r={18} fill="none" stroke={P.mas} strokeWidth={3} />
      <path d="M300 128 q6 -10 14 -5" stroke={P.mas} strokeWidth={3} fill="none" />
      {!(post && k >= 1) && (
        <text x={330} y={156} fill={P.text} fontFamily={MONO} fontSize={26} xmlSpace="preserve">
          {post ? QUOTE1 + QUOTE2 : txt}
        </text>
      )}
      {!post && (blink || typing) && f >= 15 && <rect x={332 + txt.length * chw} y={134} width={12} height={26} fill={P.glow} />}
      <rect x={898} y={204} width={100} height={36} rx={6} fill={post && k === 0 ? P.glow : 'none'} stroke={P.glow} strokeWidth={2.5} />
      <text x={948} y={229} fill={post && k === 0 ? '#03060e' : P.glow} fontFamily={MONO} fontWeight={700} fontSize={18} textAnchor="middle">
        Post
      </text>
      {/* chart */}
      <line x1={270} y1={470} x2={1010} y2={470} stroke={P.dim} strokeWidth={2} />
      <line x1={270} y1={280} x2={270} y2={470} stroke={P.dim} strokeWidth={2} />
      {post && k >= 2 ? (
        <path d="M270 458 L640 458 L640 70" stroke={P.glow} strokeWidth={4} fill="none" />
      ) : (
        <polyline points={[[270, 458], [640, 458], ...Array.from({length: 20}, (_, i) => [640 + ((i + 1) / 20) * 360, chartY((i + 1) / 20)])].map((q) => q.join(',')).join(' ')} stroke={P.glow} strokeWidth={4} fill="none" />
      )}
      {!post && (f < 84 ? blink || f < 18 : true) && dy > 66 && <circle cx={dx} cy={dy} r={9} fill={P.glow} />}
      {!post && f >= 18 && f < 84 && (
        <text x={640} y={500} fill={P.text} fontFamily={MONO} fontWeight={700} fontSize={20} textAnchor="middle">
          you are here
        </text>
      )}
      {inR(f, 84, 89) && <Arrow x1={700} y1={440} x2={960} y2={120} c={P.mas} label="on 'side' the dot climbs & exits" lx={1000} ly={300} />}
      {/* token burst */}
      {post &&
        k >= 1 &&
        chips.map((t, i) => {
          const r = rng(i * 13 + 5);
          const a = -Math.PI * 0.9 + r() * Math.PI * 1.8;
          const d = 6 * (k - 1) * (k - 1) * (1 + r() * 0.6) + 10;
          const bx = 330 + i * 72 + Math.cos(a) * d * 6;
          const by = 146 + Math.sin(a) * d * 3;
          const cols = ['#ffd1dc', '#c8f7c5', '#cde7ff', '#fff3b0', '#e6d1ff'];
          return (
            <g key={i}>
              <rect x={bx} y={by - 20} width={t.length * 14 + 14} height={30} rx={8} fill={cols[i % 5]} />
              <text x={bx + 7} y={by} fill="#222" fontFamily={MONO} fontSize={20} fontWeight={700}>
                {t}
              </text>
            </g>
          );
        })}
      {post && k >= 1 && k < 4 && <Note x={640} y={300} anchor="middle" t="token chips burst past the lens · chart snaps vertical" c={P.mas} />}
      {bayer > 0 && <rect width={W} height={SH} fill={bayer >= 4 ? '#E9E6DA' : `url(#pp${bayer})`} />}
      {bayer > 0 && bayer < 4 && <Note x={640} y={560} anchor="middle" t={`Bayer fade to 1-BIT paper · step ${bayer}/4`} c="#000" bg="rgba(233,230,218,0.9)" />}
    </g>
  );
};

// ---------------------------------------------------------------- SCENE 1b: the dark room (f90-111)
const Room: React.FC<{f: number; bookend?: boolean}> = ({f}) => {
  const P = BASE;
  const look: number | 'lens' = f < 93 ? -1 : f < 94 ? -0.5 : 'lens';
  const iris: Pt = f < 97 ? [-1, 0] : f === 97 ? [-0.66, 0] : f === 98 ? [-0.33, 0] : [0, 0.1];
  const handMouse = f >= 110;
  const coneOn = inR(f, 99, 104);
  const ang = lin(f, 99, 104, 160, 20) * (Math.PI / 180);
  const orb: Pt = [830, 250];
  const L = 1300;
  const cone = [orb, [orb[0] + Math.cos(ang - 0.2) * L, orb[1] + Math.sin(ang - 0.2) * L * 0.7 + 200], [orb[0] + Math.cos(ang + 0.2) * L, orb[1] + Math.sin(ang + 0.2) * L * 0.7 + 200]] as Pt[];
  const conePts = cone.map((q) => q.join(',')).join(' ');
  return (
    <g>
      <rect width={W} height={SH} fill={P.bg} />
      <rect y={470} width={W} height={SH - 470} fill="#081028" />
      {/* monitor at frame-left, screen facing away; glow on Mas */}
      <polygon points="560,230 760,200 760,470 560,380" fill={P.glow} opacity={0.12} />
      <rect x={400} y={220} width={160} height={150} fill="#050a18" stroke={P.ink} strokeWidth={3} />
      <text x={480} y={300} fill={P.dim} fontFamily={MONO} fontSize={12} textAnchor="middle">
        monitor (back)
      </text>
      <line x1={560} y1={230} x2={570} y2={360} stroke={P.glow} strokeWidth={4} />
      <rect x={465} y={370} width={30} height={30} fill="none" stroke={P.ink} strokeWidth={3} />
      {/* desk */}
      <rect x={360} y={400} width={560} height={14} fill={P.bg2} stroke={P.ink} strokeWidth={3} />
      <line x1={380} y1={414} x2={380} y2={500} stroke={P.ink} strokeWidth={3} />
      <line x1={900} y1={414} x2={900} y2={500} stroke={P.ink} strokeWidth={3} />
      <rect x={590} y={390} width={80} height={10} fill="none" stroke={P.ink} strokeWidth={2} />
      <rect x={740} y={388} width={20} height={12} rx={5} fill="none" stroke={P.ink} strokeWidth={2} />
      <Glass x={860} y={400} c={P.ink} water={P.glow} />
      <text x={400} y={432} fill={P.dim} fontFamily={MONO} fontSize={11}>III</text>
      {/* rack */}
      <rect x={1010} y={140} width={120} height={330} fill="#070d20" stroke={P.ink} strokeWidth={3} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={1040 + i * 30} cy={180 + i * 60} r={6} fill={Math.floor(f / 7.5 + i) % 2 === 0 ? '#39FF88' : '#12351f'} />
      ))}
      <text x={1070} y={490} fill={P.dim} fontFamily={MONO} fontSize={12} textAnchor="middle">rack</text>
      {/* Mas seated, 3/4 front, facing the monitor at frame-left */}
      <Stick x={720} y={500} s={1.45} kind="mas" c={P.mas} bg={P.bg} look={look} smile={f >= 107} sit hl={[640, 392]} hr={handMouse ? [748, 386] : [665, 394]} label="MAS" />
      <Orb x={orb[0]} y={orb[1]} r={30} c={P.ink} glow={P.glow} bg={P.bg} iris={iris} open={0.55} label />
      {inR(f, 94, 98) && <Arrow x1={640} y1={150} x2={705} y2={215} c={P.mas} label="eyes snap to LENS (f94)" lx={560} ly={140} />}
      {inR(f, 97, 98) && <Note x={870} y={200} t="Orb iris swivels to lens" c={P.glow} />}
      {coneOn && (
        <g>
          <polygon points={conePts} fill={f === 99 ? P.glow : '#000814'} opacity={f === 99 ? 0.25 : 0.95} />
          {f >= 100 && (
            <g clipPath="url(#coneClip)">
              <GlyphField x={0} y={0} w={W} h={SH} size={16} seed={100 + Math.floor(f / 2)} color="#39FF88" fn={cathedralFn} />
            </g>
          )}
          <polygon points={conePts} fill="none" stroke={P.glow} strokeWidth={2} />
          <clipPath id="coneClip">
            <polygon points={conePts} />
          </clipPath>
          {f >= 100 && <Note x={640} y={560} anchor="middle" t="GLYPH (masked to the scan cone): the room is an endless data-center cathedral" c="#39FF88" />}
        </g>
      )}
      {f >= 107 && f < 112 && <Note x={640} y={120} t="micro-smile: 1 px" c={P.mas} />}
    </g>
  );
};

// ---------------------------------------------------------------- SCENE 2: 1993 (f120-167)
const PB = {x: 202, w: 876};
const Era1993: React.FC<{f: number; noDialog?: boolean}> = ({f, noDialog}) => {
  const P = ONE;
  const fq = f - (f % 4); // animated on fours
  const look: number | 'lens' = fq < 124 ? -1 : fq < 128 ? -0.5 : 'lens';
  const stairN = Math.floor(lin(f, 120, 134, 3, 14));
  const stair: string[] = [];
  let sx = 600;
  let sy = 250;
  stair.push(`${sx},${sy}`);
  for (let i = 0; i < stairN; i++) {
    sx += 28;
    stair.push(`${sx},${sy}`);
    sy -= 12;
    stair.push(`${sx},${sy}`);
  }
  const dlg = !noDialog && inR(f, 135, 167);
  const collapse = f === 166 ? 0.5 : f === 167 ? 0.15 : 1;
  const stranger = f < 146 ? 1200 : f <= 150 ? lin(f, 146, 150, 1100, 620) : f < 156 ? 620 : lin(f, 156, 160, 620, 1100);
  const kidPtr = f < 158 ? null : ([lin(f, 158, 165, 560, 820), lin(f, 158, 165, 520, 372)] as Pt);
  return (
    <g>
      <rect width={W} height={SH} fill="#000" />
      <rect x={PB.x} width={PB.w} height={SH} fill={P.bg} />
      <rect x={PB.x} width={PB.w} height={140} fill="url(#chk12)" />
      <ellipse cx={500} cy={250} rx={170} ry={110} fill="url(#chk25)" />
      <polyline points={stair.join(' ')} fill="none" stroke={P.ink} strokeWidth={4} />
      {/* desk + beige computer, screen facing away */}
      <rect x={380} y={400} width={560} height={12} fill={P.ink} />
      <line x1={400} y1={412} x2={400} y2={540} stroke={P.ink} strokeWidth={4} />
      <line x1={920} y1={412} x2={920} y2={540} stroke={P.ink} strokeWidth={4} />
      <rect x={470} y={270} width={130} height={130} fill={P.bg} stroke={P.ink} strokeWidth={4} />
      <rect x={485} y={375} width={70} height={8} fill={P.ink} />
      <text x={535} y={330} fill={P.ink} fontFamily={MONO} fontSize={12} textAnchor="middle">(screen</text>
      <text x={535} y={345} fill={P.ink} fontFamily={MONO} fontSize={12} textAnchor="middle">faces away)</text>
      <rect x={790} y={372} width={18} height={28} fill="none" stroke={P.ink} strokeWidth={2.5} />
      <line x1={800} y1={372} x2={806} y2={356} stroke={P.ink} strokeWidth={2.5} />
      <Stick x={690} y={540} s={1.0} kind="kid" c={P.ink} bg={P.bg} look={look} sit hl={[640, 396]} hr={[660, 398]} label="KID MAS (8)" />
      <DateCard x={PB.x + 20} y={70} t="1993" c={P.ink} sh={P.bg} />
      <text x={PB.x + 22} y={92} fill={P.ink} fontFamily={MONO} fontSize={11}>512×342 · 1-BIT</text>
      {inR(f, 133, 134) && (
        <g fill="none" stroke={P.ink} strokeWidth={2} strokeDasharray="4 4">
          <rect x={f === 133 ? 480 : 380} y={f === 133 ? 290 : 220} width={f === 133 ? 110 : 420} height={f === 133 ? 80 : 190} />
          <rect x={f === 133 ? 440 : 320} y={f === 133 ? 260 : 170} width={f === 133 ? 190 : 560} height={f === 133 ? 130 : 260} />
        </g>
      )}
      {dlg && (
        <g transform={`translate(535 330) scale(${collapse}) translate(-535 -330)`}>
          <rect x={296} y={136} width={700} height={300} fill={P.ink} />
          <rect x={290} y={130} width={700} height={300} fill={P.bg} stroke={P.ink} strokeWidth={4} />
          <rect x={290} y={130} width={700} height={32} fill="url(#hstripe)" stroke={P.ink} strokeWidth={4} />
          <rect x={600} y={134} width={80} height={24} fill={P.bg} />
          <text x={640} y={152} fill={P.ink} fontFamily={MONO} fontSize={13} textAnchor="middle">age 8</text>
          <circle cx={352} cy={232} r={30} fill={P.bg} stroke={P.ink} strokeWidth={4} />
          <circle cx={352} cy={232} r={15} fill="none" stroke={P.ink} strokeWidth={3} />
          <circle cx={352} cy={232} r={6} fill={P.ink} />
          <text x={410} y={228} fill={P.ink} fontFamily={PIX} fontWeight={700} fontSize={44}>MAS MANALT</text>
          <text x={410} y={282} fill={P.ink} fontFamily={FONT.osd} fontSize={44}>no equity.</text>
          <rect x={560} y={350} width={170} height={52} fill="url(#grey2)" stroke={P.ink} strokeWidth={3} />
          <rect x={590} y={362} width={110} height={28} fill={P.bg} />
          <text x={645} y={386} fill="#8a887f" fontFamily={FONT.osd} fontSize={30} textAnchor="middle">Cancel</text>
          <rect x={764} y={346} width={178} height={60} fill="none" stroke={P.ink} strokeWidth={4} />
          <rect x={772} y={354} width={162} height={44} fill={f === 165 ? P.ink : P.bg} stroke={P.ink} strokeWidth={2} />
          <text x={853} y={384} fill={f === 165 ? P.bg : P.ink} fontFamily={FONT.osd} fontSize={32} textAnchor="middle">OK</text>
          {inR(f, 151, 164) && (
            <g>
              <rect x={560} y={410} width={330} height={28} fill={P.bg} stroke={P.ink} strokeWidth={2} />
              <text x={570} y={430} fill={P.ink} fontFamily={MONO} fontSize={14}>this action cannot be cancelled</text>
            </g>
          )}
          {inR(f, 150, 154) && <text x={600} y={330} fill={P.ink} fontFamily={PIX} fontWeight={700} fontSize={30}>BONK!</text>}
        </g>
      )}
      {dlg && stranger < 1150 && <Pointer x={stranger} y={372} c={P.bg} stroke={P.ink} />}
      {dlg && stranger < 1150 && <text x={stranger + 10} y={345} fill={P.ink} fontFamily={MONO} fontSize={12}>stranger's pointer</text>}
      {dlg && kidPtr && <Pointer x={kidPtr[0]} y={kidPtr[1]} c={P.ink} stroke={P.bg} />}
      {!noDialog && f < 135 && <Arrow x1={620} y1={240} x2={900} y2={110} c={P.ink} label="staircase curve climbs the wall" dash lx={900} ly={170} />}
    </g>
  );
};

// ---------------------------------------------------------------- SCENE 3: 2008 / 2014 (EARLY-WEB16)
const Era2008: React.FC<{f: number}> = ({f}) => {
  const P = EW;
  const ff = Math.max(f, 180);
  const mx = lin(ff, 180, 194, 190, 360);
  const pop1 = ff >= 180 && ff < 183;
  const pop2 = ff >= 187 && ff < 190;
  const aud = Math.floor((ff - 180) / 2) * 2;
  const clicker: Pt = ff < 186 ? [lin(ff, 180, 186, 130, mx + 40), 330] : [mx + 40, 330];
  return (
    <g>
      <rect width={W} height={SH} fill={P.bg} />
      <rect y={440} width={W} height={SH - 440} fill={P.bg2} />
      <rect x={540} y={50} width={640} height={290} fill="#000" stroke={P.ink} strokeWidth={5} />
      <text x={700} y={160} fill={P.text} fontFamily={FONT.wordmark} fontWeight={600} fontSize={80}>TPOOL</text>
      <polygon points="1000,80 1016,106 1046,100 1030,124 1050,148 1020,146 1010,174 996,148 966,154 982,128 964,104 994,108" fill="#FFFF00" />
      <text x={1006} y={134} fill="#FF0000" fontFamily={MONO} fontWeight={700} fontSize={14} textAnchor="middle">BETA</text>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <circle key={i} cx={620 + i * 40} cy={280 - Math.sin(i * 0.9) * 20} r={4} fill={P.glow} />
      ))}
      <path d="M1030 250 a14 14 0 1 1 20 0 l-10 18 z" fill="#FF0000" />
      <text x={1060} y={250} fill={P.ink} fontFamily={MONO} fontSize={12}>where u at?</text>
      <rect x={440} y={340} width={60} height={100} fill="#808080" stroke={P.ink} strokeWidth={3} />
      <rect x={462} y={318} width={12} height={22} fill="#00FFFF" opacity={0.7} />
      {/* THE SLEEVE */}
      <rect x={-10} y={316} width={140} height={30} fill="#000" stroke={P.ink} strokeWidth={2} />
      <circle cx={138} cy={331} r={12} fill="#C0C0C0" />
      <text x={20} y={306} fill={P.ink} fontFamily={MONO} fontSize={12}>THE SLEEVE</text>
      <rect x={clicker[0] - 6} y={clicker[1] - 6} width={14} height={10} fill="#FF00FF" />
      <Stick x={mx} y={440} s={1.1} kind="mas" c={P.mas} bg={P.bg} look={0.4} walk={ff * 0.9} hl={[mx - 40, 330]} hr={[mx + 40, 330]} label="MAS (23)" />
      <path d={`M${mx - 14} ${440 - 132 - (pop1 ? 6 : 0)} l14 12 l14 -12`} stroke="#FF00FF" strokeWidth={4} fill="none" />
      <path d={`M${mx - 18} ${440 - 128 - (pop2 ? 6 : 0)} l18 16 l18 -16`} stroke="#00FF00" strokeWidth={4} fill="none" />
      {(pop1 || pop2) && <Note x={mx + 34} y={280} t="collar POP" c="#FFFF00" bg="rgba(0,0,0,0.6)" />}
      {Array.from({length: 22}, (_, i) => (
        <ellipse key={i} cx={((i * 64 + aud) % 1400) - 60} cy={SH} rx={30} ry={48} fill="#000040" />
      ))}
      <DateCard x={30} y={120} t="2008" c="#FFFF00" />
      <Arrow x1={220} y1={500} x2={330} y2={500} c="#FFFF00" label="strides on" />
    </g>
  );
};

const Era2014: React.FC<{f: number}> = ({f}) => {
  const P = EW;
  const ff = Math.min(f, 224);
  const lift = ff < 198 ? 0 : ff < 202 ? 1 : ff < 206 ? 2 : 3; // 3-drawing lift
  const my = [470, 440, 412, 394][lift];
  const crownT = ff < 205 ? 0 : ff >= 220 ? 1 : Math.floor((ff - 205) / 2) / 7.5;
  const cp = (t: number): Pt => [lin(t, 0, 1, 1010, 660), 150 + Math.sin(t * Math.PI * 3) * 20 * (1 - t) + t * 140];
  const crown = cp(crownT);
  const pop = ff >= 202 && ff < 205;
  return (
    <g>
      <rect width={W} height={SH} fill={P.bg2} />
      <rect y={470} width={W} height={SH - 470} fill="#800080" />
      <rect x={300} y={28} width={680} height={76} fill="url(#ewo)" stroke="#000" strokeWidth={4} />
      <text x={640} y={84} fill="#000080" fontFamily={FONT.wordmark} fontWeight={600} fontSize={52} textAnchor="middle">WHY COMBINATOR</text>
      {/* throne of laptops & ramen */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={570 + (i % 2) * 10} y={460 - i * 22} width={180} height={18} fill="#C0C0C0" stroke="#000" strokeWidth={2} />
        </g>
      ))}
      <polygon points="560,470 590,470 594,430 556,430" fill="#FFFFFF" stroke="#000" strokeWidth={2} />
      <polygon points="740,470 770,470 774,430 736,430" fill="#FFFFFF" stroke="#000" strokeWidth={2} />
      <text x={660} y={500} fill="#FFFF00" fontFamily={MONO} fontSize={12} textAnchor="middle">throne: laptops + ramen</text>
      {/* founders hoisting */}
      {[480, 530, 790, 840].map((x, i) => (
        <Stick key={i} x={x} y={560} s={0.85} kind="guy" c={P.ink} bg={P.bg2} look={i < 2 ? 1 : -1} arms={lift > 0 ? [i < 2 ? 40 : 150, i < 2 ? 150 : 40] : [20, 20]} />
      ))}
      <Stick x={660} y={my} s={1.0} kind="mas" c={P.mas} bg={P.bg2} sit={lift === 3} look="lens" arms={[40, 40]} label={lift === 3 ? '' : 'MAS (29)'} />
      <polygon points={`${640},${my - 130} ${622},${my - 100} ${640},${my - 100}`} fill="#FF0000" opacity={0.8} />
      {pop && <Note x={690} y={my - 150} t="collars re-pop" c="#FFFF00" />}
      {/* LUAP + crown */}
      <rect x={960} y={260} width={200} height={14} fill="#808080" />
      <Stick x={1040} y={260} s={0.9} kind="guy" c={P.ink} bg={P.bg2} look={-1} arms={[20, 100]} label="LUAP" />
      <path d={Array.from({length: 16}, (_, i) => cp(i / 15)).map((q, i) => `${i ? 'L' : 'M'}${q[0]} ${q[1]}`).join(' ')} stroke="#FFFFFF" strokeWidth={2} strokeDasharray="3 7" fill="none" />
      <polygon points={`${crown[0] - 20},${crown[1]} ${crown[0] - 20},${crown[1] - 18} ${crown[0] - 10},${crown[1] - 8} ${crown[0]},${crown[1] - 22} ${crown[0] + 10},${crown[1] - 8} ${crown[0] + 20},${crown[1] - 18} ${crown[0] + 20},${crown[1]}`} fill="#FFFF00" stroke="#000" strokeWidth={2} />
      <text x={crown[0]} y={crown[1] + 14} fill="#FFFF00" fontFamily={MONO} fontSize={10} textAnchor="middle">PRESIDENT</text>
      {ff >= 218 && <circle cx={crown[0]} cy={crown[1] - 26} r={4} fill="#fff" />}
      <DateCard x={30} y={120} t="2014" c="#FFFF00" />
    </g>
  );
};

// ---------------------------------------------------------------- SCENE 4-5: THE WOODROSE dinner world (f225-494)
const WX = {mas: 50, gerg: 260, alyi: 500, effigy: 640, mario: 820, sign0: 985, booster: 1360};
const LETTERS = ['O', 'P', 'E', 'N', ' ', 'A', 'I'];
const FREEZES: [number, number][] = [
  [240, 284],
  [300, 339],
  [360, 404],
  [420, 464],
];
const camAt = (f: number): Pt => {
  let x = 0;
  if (f < 288) x = 0;
  else if (f < 327) x = lin(f, 288, 327, 0, 107);
  else if (f < 344) x = 107;
  else if (f < 359) x = lin(f, 344, 359, 107, 180);
  else if (f < 435) x = 180;
  else if (f < 466) x = lin(f, 435, 466, 180, 213);
  else x = 213;
  let y = 0;
  if (inR(f, 405, 409)) y = lin(f, 405, 409, 0, 90);
  else if (inR(f, 410, 419)) y = lin(f, 410, 419, 90, 0);
  return [Math.round(x), Math.round(y)];
};
type MasState = {x: number; y: number; sit: boolean; walk?: number; hl?: Pt; hr?: Pt; look: number | 'lens'; glass: boolean; smile?: boolean};
const masAt = (f: number): MasState => {
  if (f < 285) {
    const st: MasState = {x: WX.mas, y: 420, sit: true, look: 0.6, glass: f >= 255};
    if (f < 255) {
      st.hl = [WX.mas + 22, 312];
      st.hr = [WX.mas + 26, 312];
    } else st.hr = [WX.mas + 40, 330];
    if (inR(f, 270, 277)) st.hl = [lin(f, 270, 274, WX.mas + 20, 190), lin(f, 270, 274, 330, 300)];
    if (inR(f, 278, 282)) st.hl = [lin(f, 278, 282, 190, WX.mas + 10), lin(f, 278, 282, 300, 360)];
    return st;
  }
  const lane = 335;
  if (f < 288) return {x: WX.mas + 20, y: 400, sit: false, look: 0.6, glass: true, hr: [WX.mas + 60, 290]};
  if (f < 327) {
    const t = (f - 288) / 39;
    return {x: lin(f, 288, 327, WX.mas + 20, 590), y: lin(t, 0, 0.3, 400, lane), sit: false, walk: f * 0.8, look: 0.7, glass: true, hr: [lin(f, 288, 327, WX.mas + 20, 590) + 42, 240]};
  }
  if (f < 344) {
    const eat = f >= 340;
    return {x: 590, y: lane, sit: false, look: 0.8, glass: true, hr: eat ? [600, 170] : [630, 236], hl: [548, 250], smile: eat};
  }
  if (f < 359) {
    const x = lin(f, 344, 359, 590, 900);
    return {x, y: lane, sit: false, walk: f * 0.8, look: 0.7, glass: true, hl: [x - 40, 250]};
  }
  if (f < 435) {
    const tele = inR(f, 390, 402);
    return {x: 900, y: lane, sit: false, look: tele ? 0.6 : 0.4, glass: true, hl: [870, 250], hr: tele ? [930, 160] : undefined};
  }
  if (f < 450) {
    const x = lin(f, 435, 449, 900, 1060);
    return {x, y: lane, sit: false, walk: f * 0.8, look: 'lens', glass: true, hl: [x - 40, 250]};
  }
  if (f < 466) {
    const sip = inR(f, 450, 461);
    return {x: 1060, y: lane, sit: false, look: 'lens', glass: true, hl: sip ? [1066, 172] : [1020, 250]};
  }
  const nx = nPos(f);
  return {x: 1060, y: lane, sit: false, look: f >= 474 ? 'lens' : 0.5, glass: true, hr: f < 474 ? [nx[0], nx[1] + 40] : [1100, 240], hl: f >= 480 && f < 486 ? [1030, 330] : [1020, 250]};
};
function nPos(f: number): Pt {
  const home: Pt = [WX.sign0 + 3 * 42, 136];
  const dest: Pt = [WX.sign0 - 42, 136];
  if (f < 466) return home;
  if (f >= 473) return dest;
  const t = (f - 466) / 7;
  return [lin(t, 0, 1, home[0], dest[0]), home[1] - Math.sin(t * Math.PI) * 60];
}

const Dinner: React.FC<{f: number}> = ({f}) => {
  const freezeNow = FREEZES.some(([a, b]) => inR(f, a, b));
  const popNow = FREEZES.some(([a]) => f === a);
  const P = f >= 480 ? BLOOM : freezeNow ? (popNow ? TWO_POP : TWO) : BASE;
  const frozenFrom: Record<string, number> = {gerg: 240, alyi: 300, mario: 360, nole: 420};
  const isFrozen = (who: string) => f >= frozenFrom[who] && f < 480;
  const fc = (who: string) => (isFrozen(who) ? CREAM : P.ink); // founder stroke
  const [cx, cy0] = camAt(f);
  let [sx, sy] = [0, 0];
  if (FREEZES.some(([a]) => f === a || f === a + 1)) [sx, sy] = shakeXY(f, 5, 3);
  if (inR(f, 414, 419)) [sx, sy] = shakeXY(f, 8, 7);
  const jolt = inR(f, 486, 494) ? -8 : 0;
  const m = masAt(f);
  const t = (a: number) => f >= a;
  // frozen backing box behind founders in BASE periods
  const FrozenBox: React.FC<{x: number; y: number; w: number; h: number; who: string}> = ({x, y, w, h, who}) =>
    !freezeNow && isFrozen(who) ? <rect x={x} y={y} width={w} height={h} fill={NAVY} stroke={CREAM} strokeWidth={1.5} strokeDasharray="5 4" opacity={0.95} /> : null;
  // keycaps
  const keycapsFrozenAt = 240;
  const kf = f >= keycapsFrozenAt ? keycapsFrozenAt : f;
  const caps = Array.from({length: 7}, (_, i) => {
    const ph = (kf * 0.35 + i * 1.3) % Math.PI;
    return [WX.gerg - 50 + i * 16, 470 - Math.sin(ph) * (40 + (i % 3) * 18)] as Pt;
  });
  const ctrlTaken = f >= 274;
  const ctrlPos: Pt = !ctrlTaken ? [190, 300] : f < 283 ? [m.hl?.[0] ?? 190, (m.hl?.[1] ?? 300) - 10] : [-999, -999];
  // cathedral reveal (panels) + effigy
  const cathN = f < 285 ? 0 : Math.min(6, Math.floor((f - 285) / 2) + 1);
  const alyiRise = f < 288 ? 0 : Math.min(60, (f - 288) * 5);
  const effigyLit = f >= 290;
  // vault
  const vaultOpen = f < 345 ? 0 : Math.min(1, Math.floor((f - 345) / 2) / 4);
  const marioOut = f >= 352;
  const checks = (f >= 348 ? 1 : 0) + (f >= 351 ? 1 : 0) + (f >= 354 ? 1 : 0);
  // scroll
  const scrollLen = f < 378 ? 0 : Math.min(900, (f - 378 + 1) * 56);
  // rocket
  const rocketY = f < 405 ? -700 : f >= 419 ? 0 : lin(f, 405, 419, -520, 0);
  const shakeOn = inR(f, 405, 419);
  const sloshFrozen = f >= 420 ? 420 : f;
  const sloshing = f >= 405;
  const signIn = f < 405 ? -1 : f < 412 ? f - 405 : 99;
  const signAng = signIn < 0 ? 0 : [34, 22, -14, -9, 6, 3, 0][Math.min(6, signIn)] ?? 0;
  const signY = signIn < 0 ? -400 : signIn < 4 ? lin(signIn, 0, 4, -200, 0) : 0;
  const signLit = f >= 412 && !(f >= 466 && f < 473);
  const nopeLit = f >= 473;
  const aiLit = f >= 474 || (f >= 412 && f < 466);
  const flat = f >= 410;
  const n = nPos(f);
  const nColored = f >= 466;
  const ringR = f >= 480 ? Math.min(1600, (f - 480) * 170) : 0;
  const glassX = [330, 560, 760, 1180, 1250];
  const cardFounder = (who: string) => isFrozen(who) && !freezeNow;
  const placeCards = f >= 465 && f < 480;
  return (
    <g>
      <rect width={W} height={SH} fill={P.bg} />
      <g transform={`translate(${-cx + sx} ${cy0 + sy + jolt})`}>
        {/* back wall + ceiling */}
        <rect x={-100} y={-300} width={1800} height={330} fill="#050a18" />
        <rect x={-100} y={24} width={1800} height={316} fill={P.wall} />
        <line x1={-100} y1={24} x2={1700} y2={24} stroke={P.ink} strokeWidth={3} />
        {[0, 1, 2, 3, 4].map((i) => {
          const burst = f >= 405;
          const tt = f - 405;
          const r = rng(i + 40);
          const ox = burst ? (r() - 0.5) * tt * 30 : 0;
          const oy = burst ? -tt * 20 + tt * tt * 2.2 : 0;
          return <rect key={i} x={1290 + i * 36 + ox} y={4 + oy} width={32} height={18} fill="none" stroke={P.ink} strokeWidth={2} />;
        })}
        <text x={1296} y={-4} fill={P.dim} fontFamily={MONO} fontSize={11}>ceiling tiles</text>
        {/* cathedral behind ALYI */}
        {cathN > 0 && (
          <g stroke={freezeNow ? CREAM : P.ink} strokeWidth={2.5} fill="none">
            {[0, 1, 2, 3, 4, 5].slice(0, cathN).map((i) => (
              <g key={i}>
                <rect x={370 + i * 52} y={60} width={26} height={270} />
                {[0, 1, 2, 3].map((j) => (
                  <circle key={j} cx={383 + i * 52} cy={100 + j * 55} r={3} fill={freezeNow ? CREAM : Math.floor(f / 4 + i + j) % 2 ? '#ffb347' : '#8a5a1a'} stroke="none" />
                ))}
              </g>
            ))}
            {cathN >= 4 && (
              <g>
                <circle cx={520} cy={110} r={58} strokeWidth={3} />
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const a = (i / 6) * Math.PI * 2;
                  return <line key={i} x1={520} y1={110} x2={520 + Math.cos(a) * 58} y2={110 + Math.sin(a) * 58} strokeWidth={1.5} />;
                })}
                {f >= 322 && <circle cx={520} cy={110} r={58} fill={freezeNow ? CREAM : '#ffb347'} opacity={0.35} stroke="none" />}
                <text x={520} y={40} fill={freezeNow ? CREAM : P.ink} stroke="none" fontFamily={MONO} fontSize={12} textAnchor="middle">server cathedral · rose window</text>
              </g>
            )}
          </g>
        )}
        {/* effigy */}
        {f >= 285 && (
          <g>
            <path d={`M${WX.effigy - 10} 330 L${WX.effigy - 10} 262 Q${WX.effigy - 10} 250 ${WX.effigy} 250 Q${WX.effigy + 10} 250 ${WX.effigy + 10} 262 L${WX.effigy + 10} 318 Q${WX.effigy + 10} 324 ${WX.effigy + 4} 324 Q${WX.effigy - 2} 324 ${WX.effigy - 2} 318 L${WX.effigy - 2} 268`} stroke={fc('alyi') === CREAM || freezeNow ? CREAM : P.ink} strokeWidth={3.5} fill="none" />
            {effigyLit && (
              <polygon
                points={`${WX.effigy - 26},262 ${WX.effigy - 12},${freezeNow || f >= 300 ? 214 : 214 + ((f % 8) - 4) * 2} ${WX.effigy},${196} ${WX.effigy + 14},${216} ${WX.effigy + 26},262`}
                fill={freezeNow || isFrozen('alyi') ? CREAM : '#ff7a2a'}
                opacity={0.85}
              />
            )}
            {f >= 296 && (
              <g>
                <rect x={WX.effigy - 50} y={300} width={100} height={22} fill={P.bg} stroke={freezeNow ? CREAM : P.ink} strokeWidth={2} />
                <text x={WX.effigy} y={316} fill={freezeNow ? CREAM : P.text} fontFamily={MONO} fontWeight={700} fontSize={15} textAnchor="middle">UNALIGNED</text>
              </g>
            )}
          </g>
        )}
        {/* vault door behind MARIO */}
        <g stroke={freezeNow ? CREAM : P.ink} strokeWidth={3} fill="none">
          <circle cx={WX.mario} cy={190} r={86} fill="#050a18" />
          <ellipse cx={WX.mario - 86 * vaultOpen * 0.8} cy={190} rx={86 * (1 - vaultOpen * 0.75)} ry={86} fill={P.bg2} />
          {vaultOpen < 0.5 && [0, 1, 2, 3].map((i) => <line key={i} x1={WX.mario} y1={190} x2={WX.mario + Math.cos(i * 0.785 * 2) * 60} y2={190 + Math.sin(i * 0.785 * 2) * 60} />)}
          <text x={WX.mario} y={290} fill={freezeNow ? CREAM : P.dim} stroke="none" fontFamily={MONO} fontSize={11} textAnchor="middle">vault door</text>
          {f >= 345 && [0, 1].map((i) => <circle key={i} cx={WX.mario - 60 + i * 120} cy={92} r={8} fill={freezeNow ? CREAM : Math.floor(f / 6 + i) % 2 ? '#ffbf00' : '#6b4f00'} />)}
        </g>
        {f >= 345 && (
          <g>
            <rect x={700} y={30} width={214} height={44} fill={P.bg} stroke={freezeNow ? CREAM : '#ffbf00'} strokeWidth={2.5} />
            <text x={712} y={60} fill={freezeNow ? CREAM : '#ffdd66'} fontFamily={MONO} fontWeight={700} fontSize={20} xmlSpace="preserve">
              {'RED-TEAMED ' + '✓'.repeat(checks)}
            </text>
          </g>
        )}
        {inR(f, 345, 359) && (
          <g transform={`translate(${lin(f, 345, 359, 0, 120)} ${lin(f, 345, 359, 0, -30)}) rotate(${(f % 6) * 6 - 15} ${WX.mario + 60} 260)`}>
            <rect x={WX.mario + 40} y={250} width={44} height={30} fill={CREAM} />
            <text x={WX.mario + 44} y={268} fill="#a00" fontFamily={MONO} fontSize={7}>DRAFT</text>
          </g>
        )}
        {/* neon sign on chains */}
        <g transform={`translate(0 ${signY}) rotate(${signAng} ${WX.sign0 + 130} 24)`}>
          <line x1={WX.sign0 + 20} y1={24} x2={WX.sign0 + 20} y2={96} stroke={P.dim} strokeWidth={2} />
          <line x1={WX.sign0 + 250} y1={24} x2={WX.sign0 + 250} y2={96} stroke={P.dim} strokeWidth={2} />
          <rect x={WX.sign0 - 10} y={96} width={290} height={52} fill="#080d1c" stroke={P.dim} strokeWidth={2} />
          {LETTERS.map((L, i) => {
            if (i === 3 || L === ' ') return null;
            const lit = i < 3 ? (f >= 466 ? nopeLit : signLit) : aiLit;
            const col = freezeNow && f < 466 ? CREAM : lit ? P.neon : '#3a2a40';
            return (
              <text key={i} x={WX.sign0 + i * 42} y={140} fill={col} fontFamily={FONT.wordmark} fontWeight={600} fontSize={44}>
                {L}
              </text>
            );
          })}
        </g>
        {signIn >= 0 && (
          <text x={n[0]} y={n[1] + 4 + signY} fill={nColored ? (nopeLit ? P.neon : P.mas) : freezeNow ? CREAM : signLit ? P.neon : '#3a2a40'} fontFamily={FONT.wordmark} fontWeight={600} fontSize={44} stroke={nColored && !nopeLit ? P.mas : 'none'}>
            N
          </text>
        )}
        {inR(f, 466, 472) && <Arrow x1={WX.sign0 + 140} y1={70} x2={WX.sign0 - 20} y2={70} c={P.mas} label="MAS moves the N" />}
        {/* ALYI (far side, levitating) */}
        <FrozenBox who="alyi" x={WX.alyi - 50} y={250 - alyiRise - 110} w={100} h={180} />
        <Stick x={WX.alyi} y={338 - alyiRise} s={1.05} kind="alyi" c={fc('alyi')} bg={P.bg} cross look={0.2} arms={[70, 70]} label="ALYI" />
        {/* MARIO (steps out of the vault) */}
        {marioOut && <FrozenBox who="mario" x={WX.mario - 45} y={170} w={90} h={170} />}
        {marioOut && <Stick x={WX.mario} y={336} s={1.05} kind="mario" c={fc('mario')} bg={P.bg} look={-0.4} arms={[10, 165]} label="MARIO" />}
        {/* scroll down the table */}
        {scrollLen > 0 && (
          <g>
            <rect x={380} y={352} width={scrollLen} height={26} fill={freezeNow ? CREAM : '#e9dcc0'} stroke={P.dim} strokeWidth={1} />
            <text x={392} y={369} fill="#1F3A93" fontFamily={MONO} fontSize={10} opacity={0.8}>…country of geniuses in a datacenter… …machines of loving grace… …we must pace the frontier…</text>
            {inR(f, 390, 404) && <rect x={380 + scrollLen - 20} y={352} width={20} height={26} fill={P.mas} />}
          </g>
        )}
        {/* booster + NOLE */}
        <g transform={`translate(${shakeOn ? shakeXY(f, 4, 11)[0] : 0} ${rocketY})`}>
          <line x1={WX.booster - 20} y1={320} x2={WX.booster - 50} y2={396} stroke={fc('nole')} strokeWidth={4} />
          <line x1={WX.booster + 110} y1={320} x2={WX.booster + 140} y2={396} stroke={fc('nole')} strokeWidth={4} />
          <FrozenBox who="nole" x={WX.booster - 90} y={90} w={110} h={150} />
          <Stick x={WX.booster - 30} y={300} s={1.3} kind="nole" c={fc('nole')} bg={P.bg} look={-0.6} hr={[WX.booster - 70, 120]} hl={[WX.booster - 100, 250]} label="" />
          <polygon points={`${WX.booster},100 ${WX.booster + 45},40 ${WX.booster + 90},100`} fill={P.bg2} stroke={fc('nole')} strokeWidth={4} />
          <rect x={WX.booster} y={100} width={90} height={220} fill={P.bg2} stroke={fc('nole')} strokeWidth={4} />
          <rect x={WX.booster - 76} y={228} width={90} height={80} fill={P.bg2} stroke={fc('nole')} strokeWidth={3} />
          <text x={WX.booster + 45} y={125} fill={freezeNow || isFrozen('nole') ? CREAM : P.text} fontFamily={FONT.wordmark} fontWeight={600} fontSize={22} textAnchor="middle">SPACEZ</text>
          <text x={WX.booster - 31} y={274} fill={fc('nole')} fontFamily={MONO} fontWeight={700} fontSize={13} textAnchor="middle">NOLE</text>
          {f >= 405 && f < 420 && [0, 1, 2].map((i) => <polygon key={i} points={`${WX.booster + 10 + i * 28},320 ${WX.booster + 34 + i * 28},320 ${WX.booster + 22 + i * 28},${360 + ((f + i) % 4) * 12}`} fill="#ff8a2a" />)}
          {/* novelty check */}
          <g>
            <rect x={WX.booster - 250} y={240} width={150} height={60} fill={inR(f, 444, 449) ? 'url(#ledger)' : freezeNow || isFrozen('nole') ? NAVY : '#f4f1e4'} stroke={inR(f, 444, 449) ? '#39FF88' : fc('nole')} strokeWidth={2.5} />
            <text x={WX.booster - 242} y={270} fill={inR(f, 444, 449) ? '#b9ffcf' : freezeNow || isFrozen('nole') ? CREAM : '#1a1a1a'} fontFamily={MONO} fontWeight={700} fontSize={15}>$1,000,000,000*</text>
            <text x={WX.booster - 242} y={290} fill={inR(f, 444, 449) ? '#b9ffcf' : freezeNow || isFrozen('nole') ? CREAM : '#1a1a1a'} fontFamily={MONO} fontSize={inR(f, 444, 449) ? 11 : 7} opacity={inR(f, 444, 449) ? 1 : 0.5}>
              *pledged · received: $133M
            </text>
          </g>
        </g>
        {/* table */}
        <polygon points="70,332 1490,332 1510,420 40,420" fill={P.bg2} stroke={P.ink} strokeWidth={3} />
        {/* the thread (table runner): never freezes */}
        {f < 480 ? (
          <line x1={80} y1={378} x2={1490} y2={378} stroke={P.glow} strokeWidth={4} />
        ) : (
          <polyline points={`80,378 1020,378 1040,370 1060,${lin(f, 480, 488, 370, 40)} `} stroke={P.glow} strokeWidth={5} fill="none" />
        )}
        {/* candles */}
        {[300, 660, 1000].map((x, i) => (
          <Candle key={i} x={x} y={352} c={P.ink} flame={freezeNow ? CREAM : '#ffb347'} flat={flat} f={f} frozen={freezeNow} />
        ))}
        {/* glasses: all slosh except Mas's */}
        {glassX.map((x, i) => (
          <Glass key={i} x={x} y={356} c={P.ink} tilt={sloshing ? [-7, 0, 7][(sloshFrozen + i) % 3] : 0} water={freezeNow ? CREAM : '#7fd3ff'} />
        ))}
        {!m.glass && <Glass x={WX.mas + 70} y={356} c={P.mas} water={P.glow} />}
        {/* bread basket */}
        <path d={f >= 420 ? `M${WX.booster - 30} 372 h100 l-8 6 h-84 z` : `M${WX.booster - 30} 372 h100 l-12 -24 h-76 z`} fill="#b07a3a" stroke={P.ink} strokeWidth={2} />
        {/* napkin sketch */}
        <rect x={WX.gerg + 60} y={392} width={40} height={24} fill={freezeNow ? CREAM : '#dde'} />
        {f >= 232 ? <rect x={WX.gerg + 64} y={396} width={32} height={6} fill="#446" /> : <path d={`M${WX.gerg + 64} 408 q8 -10 16 0 t16 0`} stroke="#446" strokeWidth={2} fill="none" />}
        {/* GERG (near side) + keycaps */}
        <FrozenBox who="gerg" x={WX.gerg - 50} y={380} w={100} h={200} />
        <Stick x={WX.gerg} y={560} s={1.05} kind="gerg" c={fc('gerg')} bg={P.bg} look={-0.3} sit hl={[WX.gerg - 26, 500 + (f < 240 && f % 2 ? -4 : 0)]} hr={[WX.gerg + 26, 500 + (f < 240 && f % 2 === 0 ? -4 : 0)]} label="GERG" />
        {caps.map((q, i) => (
          <rect key={i} x={q[0]} y={q[1]} width={12} height={10} fill="none" stroke={isFrozen('gerg') || freezeNow ? CREAM : '#39FF88'} strokeWidth={2} />
        ))}
        {ctrlPos[0] > -900 && (
          <g>
            <rect x={ctrlPos[0] - 22} y={ctrlPos[1] - 14} width={44} height={26} rx={3} fill={ctrlTaken ? P.mas : 'none'} stroke={ctrlTaken ? P.mas : freezeNow ? CREAM : '#39FF88'} strokeWidth={2.5} />
            <text x={ctrlPos[0]} y={ctrlPos[1] + 4} fill={ctrlTaken ? '#222' : freezeNow ? CREAM : '#39FF88'} fontFamily={MONO} fontWeight={700} fontSize={12} textAnchor="middle">CTRL</text>
          </g>
        )}
        {/* background guests, backs to us */}
        {f < 480 &&
          [
            [700, 'HALO'],
            [960, 'THE OTHER PAUL'],
          ].map(([x, l]) => <Stick key={l as string} x={x as number} y={560} s={0.95} kind="guy" c={P.dim} bg={P.bg} back="back" sit label={l as string} />)}
        {/* marshmallow gag */}
        {inR(f, 328, 343) && (
          <g>
            <line x1={630} y1={236} x2={f >= 340 ? 600 : 650} y2={f >= 340 ? 170 : 222} stroke={P.mas} strokeWidth={3} />
            {f < 342 && <circle cx={f >= 340 ? 600 : 652} cy={f >= 340 ? 168 : 220} r={8} fill={f < 330 ? '#fff' : f < 334 ? '#fff4c2' : f < 338 ? '#e8b04a' : '#8a5a2a'} stroke={P.mas} strokeWidth={2} />}
            {f === 339 && <text x={672} y={210} fill={P.mas} fontFamily={MONO} fontSize={16}>~ phew</text>}
          </g>
        )}
        {/* telescope gag */}
        {inR(f, 390, 402) && (
          <g>
            <line x1={912} y1={170} x2={990} y2={100} stroke={P.mas} strokeWidth={12} strokeLinecap="round" />
            <Arrow x1={1000} y1={92} x2={1300} y2={10} c={P.mas} dash label="…exactly where the rocket comes through" lx={1060} ly={70} />
          </g>
        )}
        {/* MAS: never freezes */}
        <Stick x={m.x} y={m.y} s={1.1} kind="mas" c={P.mas} bg={P.bg} sit={m.sit} walk={m.walk} hl={m.hl} hr={m.hr} look={m.look} smile={m.smile} whip={shakeOn ? ((f % 3) - 1) * 10 : 0} label="MAS" labelC={P.mas} />
        {m.glass && m.hr === undefined && null}
        {m.glass && (() => {
          const gx = m.hl ? m.hl[0] : m.x - 40;
          const gy = m.hl ? m.hl[1] + 10 : m.y - 100;
          return <Glass x={gx} y={gy} c={P.mas} water={P.glow} />;
        })()}
        {/* place cards */}
        {placeCards &&
          (
            [
              [WX.gerg + 60, 398, 'GERG'],
              [WX.alyi, 330, 'ALYI'],
              [WX.mario, 330, 'MARIO (UDIAB) · JOINS 2016'],
              [WX.booster - 30, 330, 'NOLE'],
            ] as [number, number, string][]
          ).map(([x, y, l]) => (
            <g key={l}>
              <rect x={x - l.length * 4 - 6} y={y} width={l.length * 8 + 12} height={18} fill={CREAM} />
              <text x={x} y={y + 13} fill={NAVY} fontFamily={MONO} fontSize={11} fontWeight={700} textAnchor="middle">{l}</text>
            </g>
          ))}
      </g>
      {/* annotations (screen space) */}
      {inR(f, 405, 419) && <Note x={640} y={560} anchor="middle" t="every glass sloshes — except MAS's (dead-flat water line)" c={BASE.mas} />}
      {inR(f, 405, 419) && <Arrow x1={1150} y1={60} x2={1150} y2={200} c="#ff8a2a" label="booster descends" lx={1040} ly={60} />}
      {inR(f, 285, 299) && <Arrow x1={WX.alyi - cx - 90} y1={280} x2={WX.alyi - cx - 90} y2={200} c={P.ink} label="levitates" lx={WX.alyi - cx - 140} ly={300} />}
      {inR(f, 288, 327) && <Arrow x1={m.x - cx + 40} y1={130} x2={m.x - cx + 140} y2={130} c={P.mas} label="MAS walks (camera follows)" />}
      {inR(f, 270, 284) && <Note x={120} y={250} t="MAS plucks + pockets CTRL" c={BASE.mas} />}
      {inR(f, 474, 479) && <Note x={640} y={562} anchor="middle" t="KEY ART: four frozen founders · NOPE AI in colour · MAS in colour" c={BASE.mas} />}
      {freezeNow && <Note x={1265} y={572} anchor="end" t="2-TONE FREEZE: world = navy/cream · MAS + cyan thread stay in colour" c={CREAM} bg="rgba(27,42,74,0.9)" />}
      {/* name cards (screen space) */}
      <Card f={f} start={240} end={286} x={700} y={100} w={470} h={170} name="GERG MOCKBRAN" nameC="#39FF88" sub="ORG CHART: HIM." subFrom={246} subTo={253} stat="SLEEP: DEPRECATED · PTO: 404" statFrom={254} plate={NAVY} ink={CREAM} border={CREAM} kind="gerg" />
      <Card
        f={f}
        start={300}
        end={341}
        x={880}
        y={60}
        w={350}
        h={340}
        name="ALYI"
        nameC="#FF6A1A"
        sub="FEELS THE AGI."
        subFrom={306}
        subTo={312}
        stat="PRODUCTS: 0 · EFFIGIES: 1"
        statFrom={313}
        plate="#20183a"
        ink={CREAM}
        border={CREAM}
        kind="alyi"
        lancet
        enter={(k) => [0, k === 0 ? -260 : k === 1 ? -130 : 0]}
        extra={
          f >= 315 ? (
            <g>
              <rect x={900} y={384} width={200} height={10} fill="none" stroke={CREAM} strokeWidth={1.5} />
              <rect x={900} y={384} width={Math.min(200, (f - 314) * 40)} height={10} fill="#FF6A1A" />
              <text x={1106} y={393} fill={CREAM} fontFamily={MONO} fontSize={10}>FEELING</text>
              {inR(f, 315, 322) && <Arrow x1={1000} y1={384} x2={WX.alyi - cx + 60} y2={130} c="#FF6A1A" dash label="meter bursts into the rose window" lx={760} ly={250} />}
            </g>
          ) : null
        }
      />
      <Card
        f={f}
        start={360}
        end={404}
        x={30}
        y={360}
        w={560}
        h={190}
        name="MARIO"
        nameC="#1F3A93"
        sub="HAS CONCERNS. HAS GPUS."
        subFrom={366}
        subTo={377}
        stat="DOOM RISK ■■■■■■■■ · BUILDING IT ANYWAY ✓"
        statFrom={366}
        plate="#E9DCC0"
        ink="#1F3A93"
        border="#1F3A93"
        kind="mario"
        enter={(k) => [0, k === 0 ? 200 : k === 1 ? 100 : 0]}
        extra={
          f >= 378 ? (
            <g>
              <rect x={176} y={520} width={300} height={10} fill="#1F3A93" />
              <text x={176} y={544} fill="#1F3A93" fontFamily={MONO} fontSize={10}>WORD COUNT → runs off the card as a scroll</text>
            </g>
          ) : null
        }
      />
      <Card
        f={f}
        start={420}
        end={466}
        x={40}
        y={40}
        w={470}
        h={200}
        name="NOLE"
        nameC="#E0301E"
        sub="NAMED IT."
        subFrom={426}
        subTo={430}
        plate={NAVY}
        ink={CREAM}
        border={CREAM}
        kind="nole"
        rot={-8}
        enter={(k) => [k === 0 ? -300 : 0, 0]}
        extra={
          f >= 435 ? (
            <g transform={`translate(${f === 435 ? 3 : 0} ${f === 435 ? -3 : 0}) rotate(-6 330 200)`}>
              <rect x={190} y={176} width={250} height={44} fill="none" stroke="#E0301E" strokeWidth={4} />
              <text x={315} y={208} fill="#E0301E" fontFamily={FONT.cardName} fontSize={30} textAnchor="middle">SUED OVER IT.</text>
            </g>
          ) : null
        }
      />
      {inR(f, 444, 449) && <Note x={640} y={520} anchor="middle" t="LEDGER flash (masked to the check, ≤6 frames): *pledged · received: $133M" c="#39FF88" />}
      {inR(f, 230, 247) && <DateCard x={30} y={120} t="2015" c={freezeNow ? CREAM : '#ffffff'} />}
      {inR(f, 230, 239) && <Note x={420} y={170} t="THE WOODROSE · GERG types so fast his keycaps pop" c={P.text} />}
    </g>
  );
};

// ---------------------------------------------------------------- SCENE 6: bar 9 "THE PLAYERS" roll call (brief v2.1, f480-539)
const RC_STARTS = [480, 487, 495, 502, 510, 517, 525, 532]; // one per eighth, rounded down
const RC_NOTES = ['F', 'F', 'F', 'F', 'G', 'A♭', 'C', 'F'];
const RC: {who: string; act: string; bg: string}[] = [
  {who: 'TASYA', act: 'jangles a giant key ring', bg: '#2a5db0'},
  {who: 'RADNUS', act: 'polite smile under a spinning CODE RED siren', bg: '#2e7d4f'},
  {who: 'KRAM', act: 'offers a soup thermos with a check floating in it', bg: '#3b4bb0'},
  {who: 'NESNEJ', act: 'leather jacket, tosses a GPU', bg: '#4f7a1f'},
  {who: 'RIMA TAMURI', act: 'steps into a spotlight', bg: '#5b2d82'},
  {who: 'THE WHALE', act: 'breaches', bg: '#14306e'},
  {who: '? (silhouette only)', act: 'at a gold podium, pointing: mystery figure', bg: '#4a1016'},
  {who: '(unnamed)', act: 'a blinking cursor in GLYPH: the player who does not exist yet', bg: '#02060c'},
];
const RollCall: React.FC<{f: number}> = ({f}) => {
  let i = 0;
  RC_STARTS.forEach((s, j) => {
    if (f >= s) i = j;
  });
  const k = f - RC_STARTS[i];
  const act = k >= 2; // signature action frame
  const r = RC[i];
  const wx = 360;
  const wy = 96;
  const ww = 560;
  const wh = 400;
  const cx = wx + ww / 2;
  const fy = wy + wh + 60; // figure baseline (cropped bust)
  const ink = '#f4f1e4';
  let fig: React.ReactNode = null;
  if (i === 0) {
    const j = act ? (f % 2 ? 8 : -8) : 0;
    fig = (
      <g>
        <Stick x={cx - 40} y={fy} s={2.2} kind="guy" c={ink} bg={r.bg} look="lens" hr={[cx + 70, wy + 200 + j]} smile />
        <circle cx={cx + 100} cy={wy + 230 + j} r={44} fill="none" stroke="#ffd24a" strokeWidth={6} />
        {[0, 1, 2, 3, 4].map((q) => <rect key={q} x={cx + 80 + q * 12} y={wy + 270 + j + (q % 2) * 10} width={8} height={30} fill="#ffd24a" />)}
      </g>
    );
  } else if (i === 1) {
    const a = (f * 40 * Math.PI) / 180;
    fig = (
      <g>
        <Stick x={cx} y={fy} s={2.2} kind="guy" c={ink} bg={r.bg} look="lens" smile arms={[10, 10]} />
        <rect x={cx - 26} y={wy + 20} width={52} height={36} fill="#551" />
        <circle cx={cx} cy={wy + 30} r={22} fill="#ff2a2a" />
        <polygon points={`${cx},${wy + 30} ${cx + Math.cos(a) * 220},${wy + 30 + Math.sin(a) * 120} ${cx + Math.cos(a + 0.4) * 220},${wy + 30 + Math.sin(a + 0.4) * 120}`} fill="#ff2a2a" opacity={0.35} />
        <text x={cx + 40} y={wy + 44} fill="#ffb0b0" fontFamily={MONO} fontSize={12}>CODE RED</text>
      </g>
    );
  } else if (i === 2) {
    fig = (
      <g>
        <Stick x={cx - 60} y={fy} s={2.2} kind="guy" c={ink} bg={r.bg} look="lens" smile hr={[cx + 40, wy + 260]} />
        <rect x={cx + 30} y={wy + 200} width={50} height={90} rx={10} fill="none" stroke={ink} strokeWidth={5} />
        <text x={cx + 55} y={wy + 250} fill={ink} fontFamily={MONO} fontSize={11} textAnchor="middle">SOUP</text>
        <g transform={`translate(0 ${act ? -20 : 0})`}>
          <rect x={cx + 20} y={wy + 130} width={80} height={36} fill="#f4f1e4" stroke="#222" strokeWidth={2} />
          <text x={cx + 60} y={wy + 154} fill="#222" fontFamily={MONO} fontWeight={700} fontSize={13} textAnchor="middle">$$$</text>
        </g>
      </g>
    );
  } else if (i === 3) {
    const t = act ? (k - 2) / 5 : 0;
    fig = (
      <g>
        <Stick x={cx - 30} y={fy} s={2.2} kind="guy" c={ink} bg={r.bg} look="lens" hr={act ? [cx + 60, wy + 120] : [cx + 50, wy + 260]} />
        <path d={`M${cx - 30 - 60} ${fy - 330} L${cx - 30} ${fy - 200} L${cx - 30 + 60} ${fy - 330}`} stroke="#111" strokeWidth={16} fill="none" />
        <text x={cx - 150} y={wy + 380} fill={ink} fontFamily={MONO} fontSize={12}>mirror-leather jacket</text>
        <g transform={`translate(${t * 120} ${-t * 140}) rotate(${t * 90} ${cx + 80} ${wy + 140})`}>
          <rect x={cx + 50} y={wy + 120} width={70} height={36} fill="#222" stroke="#7fffa0" strokeWidth={3} />
          <circle cx={cx + 70} cy={wy + 138} r={10} fill="none" stroke="#7fffa0" strokeWidth={2} />
          <circle cx={cx + 100} cy={wy + 138} r={10} fill="none" stroke="#7fffa0" strokeWidth={2} />
        </g>
        {act && <text x={cx + 150} y={wy + 90} fill="#7fffa0" fontFamily={MONO} fontSize={13}>GPU</text>}
      </g>
    );
  } else if (i === 4) {
    const x = act ? cx : cx - 170;
    fig = (
      <g>
        <polygon points={`${cx - 30},${wy} ${cx + 30},${wy} ${cx + 150},${wy + wh} ${cx - 150},${wy + wh}`} fill="#fff3b0" opacity={0.28} />
        <Stick x={x} y={fy} s={2.2} kind="guy" c={ink} bg={r.bg} look="lens" walk={act ? 0 : 1.2} />
        {!act && <Arrow x1={cx - 100} y1={wy + 360} x2={cx - 20} y2={wy + 360} c={ink} label="steps in" />}
      </g>
    );
  } else if (i === 5) {
    const t = clamp((k + 1) / 7);
    const wyy = wy + 330 - Math.sin(t * Math.PI) * 190;
    fig = (
      <g>
        <rect x={wx} y={wy + 320} width={ww} height={80} fill="#0b1f55" />
        <path d={`M${wx} ${wy + 320} q40 -10 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0`} stroke="#8fb8ff" strokeWidth={3} fill="none" />
        <g transform={`rotate(${-30 + t * 60} ${cx} ${wyy})`}>
          <ellipse cx={cx} cy={wyy} rx={120} ry={52} fill="#2a3f7a" stroke={ink} strokeWidth={4} />
          <path d={`M${cx + 115} ${wyy} l50 -30 l-10 30 l10 30 z`} fill="#2a3f7a" stroke={ink} strokeWidth={4} />
          <circle cx={cx - 70} cy={wyy - 12} r={6} fill={ink} />
        </g>
        {[0, 1, 2, 3, 4].map((q) => <circle key={q} cx={cx - 100 + q * 50} cy={wy + 318 - (act ? 20 + (q % 2) * 16 : 4)} r={8} fill="#cfe3ff" opacity={0.8} />)}
      </g>
    );
  } else if (i === 6) {
    fig = (
      <g>
        <Stick x={cx - 40} y={fy} s={2.2} kind="guy" c="#000" bg="#000" look="lens" sw={14} hr={act ? [cx + 180, wy + 170] : [cx + 60, wy + 260]} />
        <rect x={cx - 150} y={wy + 280} width={220} height={130} fill="#d4a017" stroke="#6b4f00" strokeWidth={4} />
        <text x={cx + 170} y={wy + 120} fill="#d4a017" fontFamily={FONT.cardName} fontSize={60}>?</text>
      </g>
    );
  } else {
    fig = (
      <g>
        <GlyphField x={wx + 10} y={wy + 10} w={ww - 20} h={wh - 20} size={16} seed={900 + Math.floor(f / 2)} color="#39FF88" op={0.25} />
        {f % 4 < 2 && <text x={cx} y={wy + wh / 2 + 30} fill="#39FF88" fontFamily={MONO} fontWeight={700} fontSize={90} textAnchor="middle">_</text>}
      </g>
    );
  }
  return (
    <g>
      <rect width={W} height={SH} fill="#05070d" />
      {/* faction colour behind */}
      <rect x={0} y={70} width={W} height={SH - 70} fill={r.bg} opacity={0.35} />
      {/* portrait window */}
      <svg x={wx} y={wy} width={ww} height={wh} viewBox={`${wx} ${wy} ${ww} ${wh}`}>
        <rect x={wx} y={wy} width={ww} height={wh} fill={r.bg} />
        {fig}
      </svg>
      <rect x={wx} y={wy} width={ww} height={wh} fill="none" stroke="#f4f1e4" strokeWidth={6} />
      <rect x={wx + 8} y={wy + 8} width={ww - 16} height={wh - 16} fill="none" stroke="#f4f1e4" strokeWidth={1.5} opacity={0.5} />
      <rect x={wx + ww - 150} y={wy + wh - 30} width={142} height={22} fill="rgba(0,0,0,0.6)" />
      <text x={wx + ww - 79} y={wy + wh - 14} fill="#ddd" fontFamily={MONO} fontSize={11} textAnchor="middle">{r.who}</text>
      {/* motif strip: the 8 flashes play the knee F F F F G Ab C F */}
      {RC_NOTES.map((n, j) => {
        const h = [0, 0, 0, 0, 8, 16, 34, 56][j];
        const on = j === i;
        return (
          <g key={j}>
            <rect x={960 + j * 36} y={440 - h} width={30} height={20} fill={on ? '#ffd24a' : j < i ? '#667' : '#223'} stroke="#99a" strokeWidth={1} />
            <text x={975 + j * 36} y={455 - h} fill={on ? '#111' : '#ccd'} fontFamily={MONO} fontSize={11} fontWeight={700} textAnchor="middle">{n}</text>
          </g>
        );
      })}
      <text x={960} y={486} fill="#99a" fontFamily={MONO} fontSize={11}>flashes 1–4 flat (incumbents)</text>
      <text x={960} y={502} fill="#99a" fontFamily={MONO} fontSize={11}>5–8 the rising leap (wildcards)</text>
      <Note x={40} y={120} t={`THE PLAYERS · flash ${i + 1}/8`} c="#ffd24a" />
      <Note x={40} y={146} t="cut on each eighth · 7–8 frames each" c="#ccd" />
      <Note x={40} y={172} t={act ? 'signature action frame' : 'pop in'} c="#ccd" />
    </g>
  );
};

// ---------------------------------------------------------------- SCENE 7-8: skyline + title (f540-689)
type Tower = {x: number; w: number; h: number; name: string; pop: number; boss?: string; kind?: 'nope' | 'light' | 'rocket' | 'card' | 'small'};
const TOWERS: Tower[] = [
  {x: 400, w: 140, h: 220, name: 'MACROSOFT', pop: 540, boss: 'TASYA (keys)'},
  {x: 560, w: 110, h: 250, name: 'ELGOOG', pop: 555, boss: 'RADNUS · SIMED'},
  {x: 700, w: 80, h: 300, name: 'MISANTHROPIC', pop: 600, boss: 'MARIO · ADELINA', kind: 'light'},
  {x: 810, w: 140, h: 340, name: 'NOPEAI', pop: 0, kind: 'nope'},
  {x: 980, w: 70, h: 290, name: 'zAI', pop: 600, boss: 'NOLE (megaphone)', kind: 'rocket'},
  {x: 1080, w: 110, h: 210, name: 'ATEM', pop: 570, boss: 'KRAM'},
  {x: 1210, w: 90, h: 260, name: 'INVIDIA', pop: 585, boss: 'NESNEJ', kind: 'card'},
  {x: 1370, w: 60, h: 90, name: 'PEEKDEEP', pop: 615, kind: 'small'},
];
const GROUND = 470;
const Skyline: React.FC<{f: number; title?: boolean}> = ({f, title}) => {
  const ff = Math.min(f, 629);
  const camX = lin(ff, 540, 629, 0, 240);
  const camY = lin(ff, 540, 629, 0, 60);
  const dimWords = f >= 634;
  const flinch = inR(f, 630, 633) ? 4 : 0;
  const popOff = (t: Tower) => {
    if (t.pop === 0) return 0;
    const k = ff - t.pop;
    if (k < 0) return 9999;
    return [t.h * 0.66, t.h * 0.33, -6, 0][Math.min(3, k)];
  };
  const igniteX = f < 622 ? -1 : lin(f, 622, 627, 380, 1440);
  const spire = f >= 628;
  const roofY = (t: Tower) => GROUND - t.h;
  const roofPts: Pt[] = [];
  TOWERS.filter((t) => t.kind !== 'small').forEach((t) => {
    roofPts.push([t.x, roofY(t)], [t.x + t.w, roofY(t)]);
  });
  return (
    <g>
      <rect width={W} height={SH} fill="url(#dusk)" />
      {Array.from({length: 60}, (_, i) => {
        const r = rng(i + 900);
        return <circle key={i} cx={r() * W} cy={r() * 260} r={r() < 0.2 ? 2 : 1} fill="#fff" opacity={0.7} />;
      })}
      <g transform={`translate(${-camX} ${camY})`}>
        {/* far-left hill: empty in Ep1 */}
        <path d={`M240 ${GROUND} Q300 ${GROUND - 70} 370 ${GROUND}`} fill="#1a2140" stroke="#5a6aa0" strokeWidth={2} />
        <text x={305} y={GROUND - 10} fill="#5a6aa0" fontFamily={MONO} fontSize={10} textAnchor="middle">hill (empty, Ep1)</text>
        {/* water */}
        <rect x={-200} y={GROUND} width={2000} height={300} fill="#0b1438" />
        {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={-200} y1={GROUND + 20 + i * 18} x2={1800} y2={GROUND + 20 + i * 18} stroke="#1f2d63" strokeWidth={2} strokeDasharray={`${30 + i * 6} ${18}`} strokeDashoffset={ff * (i + 1)} />)}
        {TOWERS.map((t) => {
          const off = popOff(t);
          if (off > 9000) return null;
          const top = roofY(t) + off;
          const small = t.kind === 'small';
          const baseY = small ? GROUND + 40 : GROUND;
          const tt = small ? baseY - t.h + off : top;
          const col = t.kind === 'nope' ? '#16254f' : small ? '#0e1530' : '#1c2a55';
          return (
            <g key={t.name}>
              {t.kind === 'light' ? (
                <polygon points={`${t.x + 10},${baseY} ${t.x + t.w - 10},${baseY} ${t.x + t.w - 22},${tt} ${t.x + 22},${tt}`} fill="#8a4430" stroke="#e0a080" strokeWidth={2} />
              ) : (
                <rect x={t.x} y={tt} width={t.w} height={baseY - tt} fill={col} stroke={t.kind === 'nope' ? BASE.glow : '#6f82c0'} strokeWidth={2.5} />
              )}
              {t.kind === 'light' && <circle cx={t.x + t.w / 2} cy={tt - 10} r={10} fill={Math.floor(ff / 6) % 2 ? '#ffe680' : '#806a20'} />}
              {t.kind === 'rocket' && <polygon points={`${t.x},${tt} ${t.x + t.w / 2},${tt - 50} ${t.x + t.w},${tt}`} fill={col} stroke="#6f82c0" strokeWidth={2.5} />}
              {t.kind === 'card' && [0, 1].map((i) => <circle key={i} cx={t.x + t.w / 2} cy={tt + 60 + i * 80} r={28} fill="none" stroke="#7fffa0" strokeWidth={2} />)}
              {t.name === 'ELGOOG' && <circle cx={t.x + t.w / 2} cy={tt - 12} r={9} fill={Math.floor(ff / 6) % 2 ? '#ff2a2a' : '#5a1010'} />}
              {t.name === 'ELGOOG' && <text x={t.x + t.w / 2} y={tt + 60} fill="#9aa8d8" fontFamily={MONO} fontSize={9} textAnchor="middle">MINDDEEP · CODE RED</text>}
              {t.name === 'ATEM' && [0, 1, 2].map((i) => <line key={i} x1={t.x + 25 + i * 28} y1={tt + 34} x2={t.x + 25 + i * 28} y2={tt + 44 + ((ff + i * 3) % 12)} stroke="#ff5fa2" strokeWidth={4} />)}
              {t.name === 'ATEM' && <text x={t.x + t.w / 2} y={tt + 80} fill="#556" fontFamily={MONO} fontSize={10} textAnchor="middle">METAVERSE</text>}
              {t.name === 'MACROSOFT' && <rect x={t.x - 10} y={GROUND - 12} width={t.w + 300} height={12} fill="#2a3a70" stroke="#6f82c0" strokeWidth={1.5} />}
              {t.kind === 'nope' && (
                <g>
                  <line x1={t.x + t.w / 2} y1={tt} x2={t.x + t.w / 2} y2={tt - 150} stroke={BASE.glow} strokeWidth={4} />
                  <circle cx={t.x + t.w / 2} cy={tt + 90} r={44} fill="#2a1f55" stroke={BASE.glow} strokeWidth={3} />
                  {[0, 1, 2, 3].map((i) => <line key={i} x1={t.x + 12 + i * 38} y1={tt} x2={t.x + 12 + i * 38} y2={GROUND} stroke="#3a4f82" strokeWidth={1.5} strokeDasharray="6 6" />)}
                  <polygon points={`${t.x - 50},${GROUND} ${t.x - 10},${GROUND} ${t.x - 18},${GROUND - 70} ${t.x - 42},${GROUND - 70}`} fill="#1c2a55" stroke="#6f82c0" strokeWidth={2} />
                  <circle cx={t.x - 30} cy={GROUND - 84 - (ff % 8)} r={8} fill="#8a9ac8" opacity={0.5} />
                  {ff >= 590 && [0, 1, 2].map((i) => <rect key={i} x={t.x + 20 + i * 36} y={tt - 12} width={30} height={12} rx={4} fill="#ff4a2a" transform={`skewX(${-10 - i * 5})`} />)}
                </g>
              )}
              {small && <ellipse cx={t.x + t.w / 2} cy={tt - 16} rx={24} ry={12} fill="#0e1530" stroke="#556" strokeWidth={2} />}
              {/* rooftop boss (tiny stick) */}
              {t.boss && <Stick x={t.x + t.w / 2 + (t.kind === 'rocket' ? 40 : 0)} y={tt - (t.kind === 'light' ? 20 : 0) - flinch} s={0.28} kind="guy" c="#dfe6ff" bg={col} sw={1.6} />}
              {t.boss && <text x={t.x + t.w / 2} y={baseY - 8} fill="#8a96c0" fontFamily={MONO} fontSize={9} textAnchor="middle">{t.boss}</text>}
              {/* must-read wordmark */}
              {(t.kind !== 'nope' || true) && (
                <text x={t.x + t.w / 2} y={t.kind === 'nope' ? tt + 30 : tt - (t.kind === 'rocket' ? 60 : t.kind === 'light' ? 26 : 12)} fill={t.kind === 'nope' ? BASE.glow : '#ffffff'} opacity={dimWords ? 0.6 : 1} fontFamily={FONT.wordmark} fontWeight={600} fontSize={t.kind === 'small' ? 18 : 24} textAnchor="middle">
                  {t.name}
                </text>
              )}
              {small && <text x={t.x + t.w / 2} y={baseY + 16} fill="#667" fontFamily={MONO} fontSize={9} textAnchor="middle">(NOT YET)</text>}
              {off > 0 && off < 9000 && [0, 1, 2].map((i) => <circle key={i} cx={t.x + i * (t.w / 2)} cy={baseY - 6} r={10} fill="#8a96c0" opacity={0.4} />)}
            </g>
          );
        })}
        {/* GPU tosses */}
        {inR(ff, 588, 599) && [0, 1, 2].map((i) => {
          const tt = (ff - 588 + i * 3) / 12;
          return <rect key={i} x={lin(tt, 0, 1, 1250, 870 - i * 30)} y={GROUND - 270 - Math.sin(tt * Math.PI) * 120} width={16} height={8} fill="#7fffa0" />;
        })}
        {/* roofline ignition */}
        {igniteX > 0 && (
          <g>
            <clipPath id="ign">
              <rect x={0} y={-400} width={igniteX} height={1200} />
            </clipPath>
            <polyline clipPath="url(#ign)" points={roofPts.map((q) => q.join(',')).join(' ')} fill="none" stroke={BASE.glow} strokeWidth={4} />
            {spire && <line x1={880} y1={GROUND - 340} x2={880} y2={-200} stroke={BASE.glow} strokeWidth={5} />}
          </g>
        )}
      </g>
      {!title && inR(f, 540, 621) && ff >= 540 && <Note x={20} y={560} t="one tower POPS per beat (rise from below + 2 px overshoot + dust) · camera trucks right, cranes up" c="#fff" />}
      {!title && inR(f, 622, 629) && <Note x={640} y={560} anchor="middle" t="every rooftop ignites into ONE cyan line → straight up NopeAI's spire" c={BASE.glow} />}
    </g>
  );
};

const Title: React.FC<{f: number}> = ({f}) => {
  const k = f - 630;
  const [sx, sy] = k <= 2 ? shakeXY(f, 6, 5) : [0, 0];
  const tier = k < 2 ? '1BIT' : k < 4 ? 'EW16' : 'CHROME';
  const fill = tier === '1BIT' ? 'url(#chk)' : tier === 'EW16' ? '#FF6600' : 'url(#chrome)';
  const stroke = tier === '1BIT' ? '#0E0E10' : tier === 'EW16' ? '#000080' : '#3FE6FF';
  const sub = 'now in low-key research preview';
  const subT = f < 640 ? '' : sub.slice(0, Math.min(sub.length, (f - 639) * 4));
  const orbX = 596;
  const orbY = 268;
  return (
    <g>
      <Skyline f={f} title />
      <rect width={W} height={SH} fill="#000" opacity={0.35} />
      <g transform={`translate(${sx} ${sy})`}>
        <text x={560} y={290} fill={fill} stroke={stroke} strokeWidth={3} fontFamily={FONT.headline} fontSize={150} textAnchor="end" letterSpacing={4}>
          MR
        </text>
        <Orb x={orbX} y={orbY} r={26} c="#dfe6ff" glow={BASE.glow} bg="#0a1532" iris={[0, 0]} />
        <text x={632} y={290} fill={fill} stroke={stroke} strokeWidth={3} fontFamily={FONT.headline} fontSize={150} textAnchor="start" letterSpacing={4}>
          MAS
        </text>
        {f === 660 && <path d={`M${orbX + 14} ${orbY - 40} l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 z`} fill="#fff" />}
      </g>
      {subT && <rect x={640 - 290} y={318} width={580} height={42} rx={6} fill="rgba(5,8,20,0.8)" />}
      <text x={640} y={348} fill="#e4ecff" fontFamily={MONO} fontSize={28} textAnchor="middle">{subT}</text>
      <Stick x={662} y={188} s={0.22} kind="mas" c={BASE.mas} bg="#16254f" sw={1.5} hl={inR(f, 670, 676) ? [662, 150] : undefined} />
      <Note x={648} y={150} anchor="end" t="tiny MAS on the spire balcony" c={BASE.mas} size={11} />
      <Note x={20} y={400} t={`letters render up the tiers: ${tier === '1BIT' ? '1-BIT (f630-631)' : tier === 'EW16' ? 'EARLY-WEB16 (f632-633)' : 'BASE chrome (f634+)'}`} c="#fff" />
      <Note x={orbX - 90} y={orbY + 120} t="the period is THE ORB" c={BASE.glow} />
      {inR(f, 630, 633) && <Note x={640} y={560} anchor="middle" t="3 px shake · rooftop bosses flinch" c="#fff" />}
      {inR(f, 660, 689) && <Note x={640} y={560} anchor="middle" t={f < 670 ? 'Orb glint (f660)' : 'tiny MAS on the spire balcony sips his water — he never freezes'} c={BASE.mas} />}
    </g>
  );
};

// ---------------------------------------------------------------- SCENE 9: bookend (f690-719)
const Bookend: React.FC<{f: number}> = ({f}) => {
  const P = BASE;
  const pose: 'back' | 'profile' | 'eye' = f < 707 ? 'back' : f < 709 ? 'profile' : 'eye';
  const iris: Pt = f < 691 ? [1, 0] : f < 693 ? [0.6, 0] : f < 694 ? [0.3, 0] : [0, 0];
  const monOn = f < 705;
  const notif = inR(f, 705, 708);
  const cursorOn = inR(f, 709, 712);
  const irisGlyph = inR(f, 705, 706);
  const mx = 560;
  const my = 110;
  const mw = 420;
  const mh = 280;
  return (
    <g>
      <rect width={W} height={SH} fill={P.bg} />
      <polygon points={`${mx},${my + mh} ${mx + mw},${my + mh} ${mx + mw + 140},${SH} ${mx - 160},${SH}`} fill={P.glow} opacity={0.06} />
      <rect x={mx - 12} y={my - 12} width={mw + 24} height={mh + 24} rx={10} fill="#0b0f18" stroke={P.ink} strokeWidth={3} />
      <rect x={mx} y={my} width={mw} height={mh} fill="#02050c" />
      {monOn && (
        <g>
          {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={mx + 40 + i * 60} y={my + mh - 60 - ((i * 37) % 70)} width={44} height={60 + ((i * 37) % 70)} fill="#1c2a55" stroke="#6f82c0" strokeWidth={1.5} />)}
          <text x={mx + mw / 2 - 12} y={my + 120} fill="url(#chrome)" stroke={P.glow} strokeWidth={1} fontFamily={PIX} fontWeight={700} fontSize={48} textAnchor="middle">MR. MAS</text>
          <circle cx={mx + mw / 2 + 104} cy={my + 112} r={8} fill="none" stroke={P.glow} strokeWidth={2} />
          <text x={mx + mw / 2} y={my + 146} fill={P.text} fontFamily={MONO} fontSize={12} textAnchor="middle">now in low-key research preview</text>
        </g>
      )}
      {notif && (
        <g>
          <rect x={mx + 120} y={my + 110} width={180} height={40} rx={6} fill="#13244d" stroke={P.glow} strokeWidth={2} />
          <text x={mx + 210} y={my + 136} fill={P.text} fontFamily={MONO} fontSize={14} textAnchor="middle">posted ✓</text>
        </g>
      )}
      {cursorOn && <rect x={mx + mw * 0.62} y={my + mh * 0.46 - 12} width={7} height={14} fill={P.glow} />}
      {f >= 712 && <Note x={mx + mw / 2} y={my + mh - 40} anchor="middle" t="cursor at the f0 spot → loop" c={P.glow} />}
      <rect x={300} y={430} width={760} height={14} fill={P.bg2} stroke={P.ink} strokeWidth={3} />
      <Glass x={1000} y={430} c={P.ink} water={P.glow} />
      <Stick x={430} y={560} s={1.7} kind="mas" c={P.mas} bg={P.bg} back={pose} sit hl={[520, 430]} hr={[560, 432]} label="MAS (from behind)" />
      {/* Orb near camera */}
      <g>
        <Orb x={1150} y={180} r={52} c={P.ink} glow={P.glow} bg={P.bg} iris={iris} />
        {irisGlyph && (
          <g>
            <clipPath id="irisClip">
              <circle cx={1150} cy={180} r={29} />
            </clipPath>
            <circle cx={1150} cy={180} r={29} fill="#000" />
            <g clipPath="url(#irisClip)">
              <GlyphField x={1118} y={150} w={66} h={64} size={8} seed={705 + f} color="#39FF88" fn={irisSkylineFn} />
            </g>
          </g>
        )}
      </g>
      {f >= 692 && (
        <g>
          <rect x={990} y={260} width={250} height={40} rx={6} fill="#13244d" stroke={P.glow} strokeWidth={2} />
          <text x={1115} y={287} fill={P.text} fontFamily={MONO} fontSize={20} textAnchor="middle">verified: human</text>
        </g>
      )}
      {irisGlyph && <Note x={1236} y={80} anchor="end" t="GLYPH in the iris: the skyline as tokens · 2 frames" c="#39FF88" />}
      {inR(f, 690, 704) && <Note x={20} y={560} t="REVERSE ANGLE: we were on his screen" c={P.mas} />}
      {inR(f, 705, 711) && <Note x={20} y={560} t={pose === 'eye' ? 'one eye on the lens' : pose === 'profile' ? 'lost profile…' : 'DING — post goes out'} c={P.mas} />}
      {f >= 716 && <rect width={W} height={SH} fill="#000" opacity={0.25} />}
    </g>
  );
};

// ---------------------------------------------------------------- scene + style tables for overlays
type Seg = {from: number; to: number; name: string; style: string};
const SCENES: Seg[] = [
  {from: 0, to: 89, name: '1 · COLD OPEN — monitor insert', style: 'BASE'},
  {from: 90, to: 111, name: '1 · COLD OPEN — the dark room', style: 'BASE'},
  {from: 112, to: 119, name: '1 · POST', style: 'BASE → 1-BIT'},
  {from: 120, to: 167, name: '2 · 1993', style: '1-BIT'},
  {from: 168, to: 179, name: '2 · RENDER FRONT', style: '1-BIT → EARLY-WEB16'},
  {from: 180, to: 194, name: '3 · 2008 KEYNOTE', style: 'EARLY-WEB16'},
  {from: 195, to: 224, name: '3 · 2014 WHY COMBINATOR', style: 'EARLY-WEB16'},
  {from: 225, to: 239, name: '4 · THE WOODROSE, 2015', style: 'EARLY-WEB16 → BASE'},
  {from: 240, to: 284, name: '4a · GERG FREEZE', style: '2-TONE FREEZE'},
  {from: 285, to: 299, name: '4b · ALYI — server cathedral', style: 'BASE'},
  {from: 300, to: 339, name: '4b · ALYI FREEZE', style: '2-TONE FREEZE'},
  {from: 340, to: 359, name: '4c · MARIO — the vault', style: 'BASE'},
  {from: 360, to: 404, name: '4c · MARIO FREEZE', style: '2-TONE FREEZE'},
  {from: 405, to: 419, name: '4d · NOLE — the booster', style: 'BASE'},
  {from: 420, to: 464, name: '4d · NOLE FREEZE', style: '2-TONE FREEZE'},
  {from: 465, to: 479, name: '5 · THE FOUNDING', style: 'BASE'},
  {from: 480, to: 539, name: '6 · THE PLAYERS (roll call, v2.1)', style: 'BASE'},
  {from: 540, to: 629, name: '7 · SKYLINE AT DUSK', style: 'BASE'},
  {from: 630, to: 689, name: '8 · TITLE', style: 'BASE'},
  {from: 690, to: 719, name: '9 · BOOKEND', style: 'BASE'},
];
const SUBSTYLES: {from: number; to: number; tag: string}[] = [
  {from: 100, to: 104, tag: '+ GLYPH-MASKED (scan cone)'},
  {from: 444, to: 449, tag: '+ LEDGER (check only)'},
  {from: 532, to: 539, tag: '+ GLYPH (cursor portrait)'},
  {from: 630, to: 633, tag: '+ tiered letters 1-BIT → EW16'},
  {from: 705, to: 706, tag: '+ GLYPH-MASKED (iris)'},
];
const STYLE_COL: Record<string, {bg: string; fg: string}> = {
  BASE: {bg: '#1f4aa0', fg: '#bff6ff'},
  PAPER: {bg: '#E9E6DA', fg: '#0E0E10'},
  '1BIT': {bg: 'url(#chkT)', fg: '#0E0E10'},
  EW16: {bg: '#FF6600', fg: '#000080'},
  '2TONE': {bg: '#F2E8CF', fg: '#1B2A4A'},
  BLOOM: {bg: '#6fa0ff', fg: '#0a1532'},
  GREY: {bg: '#77797e', fg: '#111'},
  GLYPH: {bg: '#39FF88', fg: '#04200f'},
  LEDGER: {bg: '#1f8f4a', fg: '#dfffe9'},
};
const STYLE_SEGS: [number, number, string][] = [
  [0, 111, 'BASE'],
  [112, 119, 'PAPER'],
  [120, 167, '1BIT'],
  [168, 224, 'EW16'],
  [225, 239, 'BASE'],
  [240, 284, '2TONE'],
  [285, 299, 'BASE'],
  [300, 339, '2TONE'],
  [340, 359, 'BASE'],
  [360, 404, '2TONE'],
  [405, 419, 'BASE'],
  [420, 464, '2TONE'],
  [465, 479, 'BASE'],
  [480, 719, 'BASE'],
];
const MINI_SEGS: [number, number, string][] = [
  [100, 104, 'GLYPH'],
  [444, 449, 'LEDGER'],
  [532, 539, 'GLYPH'],
  [630, 631, '1BIT'],
  [632, 633, 'EW16'],
  [705, 706, 'GLYPH'],
];
const HITS: [number, string][] = [
  [240, 'GERG'],
  [300, 'ALYI'],
  [360, 'MARIO'],
  [420, 'NOLE'],
  [480, 'ROLL CALL ×8'],
  [630, 'TITLE'],
  [705, 'DING'],
];
const CAPTIONS: [number, number, string, string][] = [
  [0, 14, 'Black. A cyan cursor blinks on the beat: the spot the whole loop will end on.', 'felt piano F5 · sub drone fades in'],
  [15, 23, "Inside MAS's monitor: a post composer steps up; below it a flat chart with a dot at the knee: 'you are here'.", 'piano F5'],
  [24, 57, "The post types itself, a word ahead of MAS's soft voice.", 'VO: "near the singularity;"'],
  [58, 71, 'The semicolon pause: nothing types; the cursor blinks once.', 'low piano D♭, the colour note'],
  [72, 83, "…'unclear which side.' finishes typing.", 'VO: "unclear which side."'],
  [84, 89, "On 'side' the dot climbs the curve and exits through the top of the screen.", 'VO tail runs over the cut'],
  [90, 98, 'CUT to the room: MAS at his desk, lit only by the monitor. His eyes snap to the lens (f94); the Orb turns (f97).', 'pluck f90 · Orb servo f97'],
  [99, 104, "The Orb's scan cone sweeps the room. Inside it, for 5 frames, the room is an endless data-center cathedral of tokens.", 'scan "shhk" f100 · no sting'],
  [105, 111, 'Still looking at us: a one-pixel micro-smile (f107). His hand moves to the mouse.', 'knee run G5, A♭5'],
  [112, 119, 'He clicks Post: the line bursts into token chips, the chart snaps vertical, Bayer fade to paper white.', 'Post click f112 · reverse cymbal'],
  [120, 134, 'Kid MAS (8) at a beige computer, screen facing away; the staircase curve climbs the wall. He turns to camera, animated on fours.', 'DROP on Fm(add9) · chip beeper F F F'],
  [135, 149, 'The world freezes into an alert dialog: MAS MANALT / no equity. Cancel is greyed out.', 'the chip rests'],
  [150, 164, "A stranger's pointer clicks Cancel. BONK. Nothing happens.", 'bonk f150, a tritone sting'],
  [165, 167, 'The kid clicks OK; the dialog collapses back into the screen.', 'OK click · beeper C'],
  [168, 179, 'A glowing render front chases the curve: behind it the world re-renders in EARLY-WEB16 and the frame widens to 16:9.', 'rising chip arpeggio · brush swell'],
  [180, 194, 'THE SLEEVE hands off the clicker; MAS (23) strides on and two collars pop (f180, f187). TPOOL is on the big screen.', 'swung trio lands · collar pops'],
  [195, 224, 'Hoodie founders hoist MAS onto a throne of laptops; LUAP drops a paper crown down a dotted path. It lands at f220.', 'muted brass stab f195 · crowd "ohh"'],
  [225, 239, 'Match cut: the crown glint becomes a candle, and a render front brings in BASE. THE WOODROSE, 2015: GERG types so fast his keycaps pop.', 'strings swell · keyboard snare roll'],
  [240, 269, 'GERG FREEZE: the world drops to navy and cream. Only MAS stays in colour and keeps moving.', 'HIT on Fm9 f240 · walking bass'],
  [270, 284, 'MAS plucks the floating CTRL key out of the air (it takes his colour) and pockets it.', 'item-take blip f278'],
  [285, 299, 'Time resumes (GERG stays frozen). The wall lights into a server cathedral, ALYI levitates, the paperclip effigy ignites.', 'whispered "feel… the…" · flame f290'],
  [300, 327, "ALYI FREEZE on 'A-G-I!': a stained-glass card drops, and the FEELING meter bursts into the rose window.", 'HIT D♭maj7(♯11) f300 · shouted A-G-I!'],
  [328, 339, 'MAS toasts a marshmallow on the frozen fire. It browns anyway.', 'the frozen fire makes no sound'],
  [340, 359, "ALYI's card closes. MAS eats and walks on. The vault door swings open, the HUD ticks RED-TEAMED ✓✓✓, MARIO steps out.", 'klaxon · check chimes F6 G6 A♭6'],
  [360, 377, 'MARIO FREEZE: a parchment card rises from the bottom-left.', 'HIT B♭m11 f360 · klaxon cut dead'],
  [378, 389, 'The WORD COUNT bar runs off the card and unrolls as a scroll down the whole table.', 'paper swish'],
  [390, 404, "MAS rolls the scroll's tail into a telescope and peers at the ceiling, exactly where the rocket will come through.", 'low rumble overhead'],
  [405, 419, "NOLE's SPACEZ booster crashes through the ceiling. Every glass sloshes except MAS's; the OPEN AI sign swings in.", 'rocket roar · trumpet rip'],
  [420, 434, 'NOLE FREEZE at touchdown, leaning out of the hatch with a phone and a novelty check. The card slams in crooked.', 'BIGGEST HIT C7(♯9) f420 · full shout'],
  [435, 449, 'A red stamp slams under the subtitle: SUED OVER IT. The check flashes LEDGER for f444–449.', 'stamp thunk f435, tuned to C'],
  [450, 464, 'MAS sips his water under the sign. Every other glass is frozen mid-slosh; his is dead flat.', 'walking bass · drum fill'],
  [465, 473, 'THE FOUNDING: the cards shrink to place cards. MAS unhooks the N and carries it to the front…', 'neon buzz · letter clunk f473'],
  [474, 479, "…OPEN becomes NOPE, and 'AI' lights. KEY ART: four frozen founders, MAS in colour under NOPE AI.", 'neon tink f474'],
  [480, 486, 'THE PLAYERS roll call, 1/8: TASYA jangles a giant key ring.', 'stab 1 on F · brass + chip lead'],
  [487, 494, '2/8: RADNUS smiles politely under a spinning CODE RED siren.', 'stab 2 on F'],
  [495, 501, '3/8: KRAM offers a soup thermos with a check floating in it.', 'stab 3 on F'],
  [502, 509, '4/8: NESNEJ, leather jacket, tosses a GPU. (Flashes 1–4: the flat part of the curve.)', 'stab 4 on F'],
  [510, 516, '5/8: RIMA TAMURI steps into a spotlight. (5–8: the rising leap.)', 'stab 5 on G'],
  [517, 524, '6/8: THE WHALE breaches.', 'stab 6 on A♭'],
  [525, 531, '7/8: a silhouette at a gold podium, pointing: the mystery figure (RUMPT fills in from Ep3).', 'stab 7 on C'],
  [532, 539, "8/8: an empty portrait window holding only a blinking GLYPH cursor, the player who doesn't exist yet.", 'stab 8 on F (octave)'],
  [540, 554, 'Skyline at dusk: the NOPEAI cathedral in scaffolding. MACROSOFT pops, its plinth running under NopeAI.', 'chip pluck F · muted-trumpet line'],
  [555, 569, 'ELGOOG pops under a CODE RED siren.', 'pluck F · siren whoop'],
  [570, 584, "ATEM pops, fresh 'AI' dripping over a ghosted METAVERSE.", 'pluck F · drip + clack'],
  [585, 599, "INVIDIA pops; NESNEJ tosses GPUs to every roof. On NopeAI's roof they pile up and sag.", 'pluck F · ka-ching'],
  [600, 614, 'The exes double-pop: the MISANTHROPIC lighthouse and the zAI rocket.', 'pluck G: the knee begins · riser'],
  [615, 621, 'PEEKDEEP pops quietly across the water.', 'pluck A♭ · plop · snare roll'],
  [622, 629, "Every rooftop ignites into one cyan line: flat, then steeper, then straight up NopeAI's spire.", 'pluck C f622 · riser peaks'],
  [630, 639, 'TITLE SLAM: MR. MAS renders up through the palettes (1-bit, early-web, chrome). The period is the Orb.', 'FINAL HIT f630: quartal, no third · vocal PAD'],
  [640, 659, 'The subtitle types on.', 'PAD holds'],
  [660, 689, 'Hold. The Orb glints (f660); tiny MAS sips on the spire balcony. He never freezes.', 'celesta F6 f660'],
  [690, 704, "Reverse angle: the whole title was on MAS's monitor. The Orb turns to us. Toast: verified: human.", 'reverse whoosh · toast chime f692'],
  [705, 711, "DING: the post went out. The Orb's iris flickers to tokens for 2 frames; MAS glances back at us.", 'DING (F6 bell) f705'],
  [712, 719, 'Black monitor, cursor blinking where f0 began. Loop.', 'drone out by f719'],
];
const chipCol = (style: string) => {
  if (style.startsWith('2-TONE')) return STYLE_COL['2TONE'];
  if (style.startsWith('1-BIT')) return {bg: '#E9E6DA', fg: '#0E0E10'};
  if (style.startsWith('EARLY')) return STYLE_COL.EW16;
  if (style.includes('bloom')) return STYLE_COL.BLOOM;
  if (style.includes('grey')) return STYLE_COL.GREY;
  return STYLE_COL.BASE;
};

const TX = (f: number) => 40 + f * (1200 / 720);
const Overlays: React.FC<{f: number}> = ({f}) => {
  const sc = SCENES.find((s) => inR(f, s.from, s.to)) ?? SCENES[0];
  const sub = SUBSTYLES.find((s) => inR(f, s.from, s.to));
  const cap = CAPTIONS.find((c) => inR(f, c[0], c[1]));
  const cc = chipCol(sc.style);
  const nameW = sc.name.length * 9.1 + 20;
  const styleW = sc.style.length * 8.4 + 20;
  const tc = `${(f / 24).toFixed(2)} s   f${String(f).padStart(3, '0')}   bar.beat ${barBeat(f)}`;
  const onBeat = f % 15 < 3;
  const downbeat = f % 60 < 3;
  // VO subtitle
  let vo = '';
  if (inR(f, 24, 57)) vo = 'near the singularity;';
  else if (inR(f, 58, 71)) vo = 'near the singularity; …';
  else if (inR(f, 72, 91)) vo = 'near the singularity; unclear which side.';
  return (
    <g>
      {/* top-left: scene + style chip */}
      <rect x={10} y={8} width={nameW} height={26} rx={4} fill="rgba(0,0,0,0.72)" />
      <text x={20} y={27} fill="#fff" fontFamily={MONO} fontWeight={700} fontSize={15}>{sc.name}</text>
      <rect x={10} y={38} width={styleW} height={22} rx={4} fill={cc.bg} stroke="#000" strokeWidth={1} />
      <text x={20} y={54} fill={cc.fg} fontFamily={MONO} fontWeight={700} fontSize={13}>{sc.style}</text>
      {sub && (
        <g>
          <rect x={16 + styleW} y={38} width={sub.tag.length * 8.2 + 16} height={22} rx={4} fill={sub.tag.includes('LEDGER') ? '#1f8f4a' : sub.tag.includes('tiered') ? '#FF6600' : '#39FF88'} stroke="#000" strokeWidth={1} />
          <text x={24 + styleW} y={54} fill="#04200f" fontFamily={MONO} fontWeight={700} fontSize={13}>{sub.tag}</text>
        </g>
      )}
      {/* top-right: timecode */}
      <rect x={W - 10 - 390} y={8} width={390} height={26} rx={4} fill="rgba(0,0,0,0.72)" />
      <text x={W - 20 - 22} y={27} fill="#fff" fontFamily={MONO} fontWeight={700} fontSize={15} textAnchor="end" xmlSpace="preserve">{tc}</text>
      <circle cx={W - 26} cy={21} r={downbeat ? 8 : 6} fill={onBeat ? (downbeat ? '#ff4a4a' : '#ffd24a') : '#333'} />
      {/* VO subtitle */}
      {vo && (
        <g>
          <rect x={640 - vo.length * 7.4 - 110} y={530} width={vo.length * 14.8 + 220} height={38} rx={5} fill="rgba(0,0,0,0.78)" />
          <text x={640} y={556} fill="#fff" fontFamily={MONO} fontSize={22} textAnchor="middle" fontStyle="italic">
            {`VO (MAS): “${vo}”`}
          </text>
        </g>
      )}
      {/* caption strip */}
      <rect y={SH} width={W} height={628 - SH} fill="#0c0e13" />
      <line x1={0} y1={SH} x2={W} y2={SH} stroke="#2a2f3a" strokeWidth={2} />
      {cap && (
        <g>
          <text x={16} y={SH + 19} fill="#f4f6fb" fontFamily="Jost, sans-serif" fontWeight={700} fontSize={16.5}>{cap[2]}</text>
          <text x={16} y={SH + 38} fill="#8d97ad" fontFamily={MONO} fontSize={12.5}>{`♪ ${cap[3]}`}</text>
        </g>
      )}
      {/* timeline */}
      <rect y={628} width={W} height={92} fill="#07080b" />
      {HITS.map(([h, l]) => (
        <g key={l}>
          <polygon points={`${TX(h) - 5},641 ${TX(h) + 5},641 ${TX(h)},648`} fill={f >= h && f < h + 6 ? '#fff' : '#ff5a5a'} />
          <text x={TX(h)} y={639} fill={f >= h && f < h + 15 ? '#fff' : '#ff8a8a'} fontFamily={MONO} fontSize={10} fontWeight={700} textAnchor="middle">{`${l} f${h}`}</text>
        </g>
      ))}
      {RC_STARTS.map((h) => <line key={h} x1={TX(h)} y1={643} x2={TX(h)} y2={649} stroke="#ffd24a" strokeWidth={1.5} />)}
      {STYLE_SEGS.map(([a, b, s]) => (
        <rect key={a} x={TX(a)} y={650} width={TX(b + 1) - TX(a) - 0.8} height={16} fill={STYLE_COL[s].bg} />
      ))}
      {SCENES.map((s) => <line key={s.from} x1={TX(s.from)} y1={650} x2={TX(s.from)} y2={666} stroke="#000" strokeWidth={1.5} />)}
      {MINI_SEGS.map(([a, b, s]) => (
        <rect key={a} x={TX(a)} y={668} width={Math.max(3, TX(b + 1) - TX(a))} height={6} fill={STYLE_COL[s].bg} />
      ))}
      {Array.from({length: 49}, (_, i) => (
        <line key={i} x1={TX(i * 15)} y1={676} x2={TX(i * 15)} y2={i % 4 === 0 ? 688 : 681} stroke={i % 4 === 0 ? '#aab' : '#556'} strokeWidth={i % 4 === 0 ? 1.5 : 1} />
      ))}
      {Array.from({length: 12}, (_, i) => (
        <text key={i} x={TX(i * 60 + 30)} y={690} fill={Math.floor(f / 60) === i ? '#fff' : '#778'} fontFamily={MONO} fontSize={11} fontWeight={700} textAnchor="middle">{`bar ${i + 1}`}</text>
      ))}
      {/* legend */}
      {(
        [
          ['BASE', 'BASE'],
          ['PAPER', 'paper'],
          ['1BIT', '1-BIT'],
          ['EW16', 'EARLY-WEB16'],
          ['2TONE', '2-TONE FREEZE'],
          ['GLYPH', 'GLYPH'],
          ['LEDGER', 'LEDGER'],
        ] as [string, string][]
      ).map(([k, l], i) => (
        <g key={k}>
          <rect x={40 + i * 160} y={700} width={14} height={12} fill={STYLE_COL[k].bg} stroke="#444" />
          <text x={60 + i * 160} y={711} fill="#99a" fontFamily={MONO} fontSize={11}>{l}</text>
        </g>
      ))}
      {/* playhead */}
      <line x1={TX(f)} y1={633} x2={TX(f)} y2={692} stroke="#fff" strokeWidth={2} />
      <polygon points={`${TX(f) - 6},630 ${TX(f) + 6},630 ${TX(f)},638`} fill="#fff" />
    </g>
  );
};

// ---------------------------------------------------------------- root
const Defs: React.FC = () => (
  <defs>
    <pattern id="chk" width={8} height={8} patternUnits="userSpaceOnUse">
      <rect width={8} height={8} fill="#E9E6DA" />
      <rect width={4} height={4} fill="#0E0E10" />
      <rect x={4} y={4} width={4} height={4} fill="#0E0E10" />
    </pattern>
    <pattern id="chkT" width={6} height={6} patternUnits="userSpaceOnUse">
      <rect width={6} height={6} fill="#E9E6DA" />
      <rect width={3} height={3} fill="#0E0E10" />
      <rect x={3} y={3} width={3} height={3} fill="#0E0E10" />
    </pattern>
    <pattern id="chk25" width={8} height={8} patternUnits="userSpaceOnUse">
      <rect width={8} height={8} fill="#E9E6DA" />
      <rect width={4} height={4} fill="#0E0E10" />
    </pattern>
    <pattern id="chk12" width={12} height={12} patternUnits="userSpaceOnUse">
      <rect width={12} height={12} fill="#E9E6DA" />
      <rect width={3} height={3} fill="#0E0E10" />
      <rect x={6} y={6} width={3} height={3} fill="#0E0E10" />
    </pattern>
    {[1, 2, 3].map((lv) => (
      <pattern key={lv} id={`pp${lv}`} width={8} height={8} patternUnits="userSpaceOnUse">
        <rect width={4} height={4} fill="#E9E6DA" />
        {lv >= 2 && <rect x={4} y={4} width={4} height={4} fill="#E9E6DA" />}
        {lv >= 3 && <rect x={4} y={0} width={4} height={4} fill="#E9E6DA" />}
      </pattern>
    ))}
    <pattern id="grey2" width={4} height={4} patternUnits="userSpaceOnUse">
      <rect width={4} height={4} fill="#E9E6DA" />
      <rect width={2} height={2} fill="#0E0E10" />
      <rect x={2} y={2} width={2} height={2} fill="#0E0E10" />
    </pattern>
    <pattern id="hstripe" width={4} height={4} patternUnits="userSpaceOnUse">
      <rect width={4} height={4} fill="#E9E6DA" />
      <rect width={4} height={2} fill="#0E0E10" />
    </pattern>
    <pattern id="ewo" width={4} height={4} patternUnits="userSpaceOnUse">
      <rect width={4} height={4} fill="#FFCC66" />
      <rect width={2} height={2} fill="#FF6600" />
      <rect x={2} y={2} width={2} height={2} fill="#FF6600" />
    </pattern>
    <pattern id="ledger" width={4} height={4} patternUnits="userSpaceOnUse">
      <rect width={4} height={4} fill="#0d3b22" />
      <rect width={4} height={1} fill="#39FF88" opacity={0.7} />
    </pattern>
    <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset="0.45" stopColor="#a9c4f0" />
      <stop offset="0.55" stopColor="#3a4f82" />
      <stop offset="1" stopColor="#e8f4ff" />
    </linearGradient>
    <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#0f1430" />
      <stop offset="0.55" stopColor="#3b2a5a" />
      <stop offset="0.8" stopColor="#a8566a" />
      <stop offset="1" stopColor="#e39a6a" />
    </linearGradient>
    <clipPath id="stageClip">
      <rect width={W} height={SH} />
    </clipPath>
  </defs>
);

const Stage: React.FC<{f: number}> = ({f}) => {
  if (f < 90) return <Insert f={f} />;
  if (f < 112) return <Room f={f} />;
  if (f < 120) return <Insert f={f} />;
  if (f < 168) return <Era1993 f={f} />;
  if (f < 180) {
    // render front: EW16 behind the front (left), 1-bit ahead (right); pillarbox retracts
    const fx = lin(f, 168, 179, 150, 1290);
    return (
      <g>
        <clipPath id="frontL">
          <rect width={fx} height={SH} />
        </clipPath>
        <clipPath id="frontR">
          <rect x={fx} width={W} height={SH} />
        </clipPath>
        <g clipPath="url(#frontR)">
          <Era1993 f={167} noDialog />
        </g>
        <g clipPath="url(#frontL)">
          <Era2008 f={180} />
        </g>
        <line x1={fx} y1={0} x2={fx} y2={SH} stroke="#bff6ff" strokeWidth={10} opacity={0.35} />
        <line x1={fx} y1={0} x2={fx} y2={SH} stroke="#ffffff" strokeWidth={2} />
        <Arrow x1={fx - 160} y1={300} x2={fx - 20} y2={300} c="#FFFF00" label="render front: 1-BIT → EARLY-WEB16" lx={fx - 170} ly={286} />
      </g>
    );
  }
  if (f < 195) return <Era2008 f={f} />;
  if (f < 225) return <Era2014 f={f} />;
  if (f < 230) {
    const r = (f - 224) * 300;
    return (
      <g>
        <Era2014 f={224} />
        <clipPath id="flameFront">
          <circle cx={660} cy={300} r={r} />
        </clipPath>
        <g clipPath="url(#flameFront)">
          <Dinner f={f} />
        </g>
        <circle cx={660} cy={300} r={r} fill="none" stroke="#fff" strokeWidth={2} opacity={0.8} />
        <Note x={690} y={250} t="match cut: crown glint → candle · render front → BASE" c="#fff" />
      </g>
    );
  }
  if (f < 480) return <Dinner f={f} />;
  if (f < 540) return <RollCall f={f} />;
  if (f < 630) return <Skyline f={f} />;
  if (f < 690) return <Title f={f} />;
  return <Bookend f={f} />;
};

const IntroAnimatic: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#05070d'}}>
      <svg width={W} height={720} viewBox={`0 0 ${W} 720`}>
        <Defs />
        <g clipPath="url(#stageClip)">
          <Stage f={f} />
        </g>
        <Overlays f={f} />
      </svg>
    </AbsoluteFill>
  );
};

export const frames: FrameDef[] = [{id: 'intro-animatic', component: IntroAnimatic, width: 1280, height: 720, fps: 24, durationInFrames: 720}];
