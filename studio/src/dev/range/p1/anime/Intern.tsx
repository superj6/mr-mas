// MR. MAS - style-range Prototype 1: THE INTERN as a held cel (cm units, the monitor's centre at 0,0), and the season's
// STAT BAR redrawn in cel line (same shape, label and fill order as the pixel bar: label first, cells left to right).
// The Intern: a slightly-too-tall figure in a pale blazer, the lanyard, a monitor for a head whose face is one caret that
// blinks on the quarter notes. It is dealing, facing the table. Over its head: nothing.
import React from 'react';
import {curve, ell, ink, Pt} from '../../../../shared/anime/ink';
import {Rim} from '../../../../shared/anime/cel';
import {BLAZER, KEY} from './tungsten';

export const InternCel: React.FC<{uid: string; caret: boolean; k: number}> = ({uid, caret, k}) => {
  const id = (s: string) => `${uid}-${s}`;
  const B = BLAZER;
  // a little too tall, a little too square: shoulders squared off, the blazer buttoned, a pale shirt and a dark tie
  // shoulders a touch too square, then a tailored waist and the blazer's skirt
  const body: Pt[] = [[-7, 20], [-17, 22], [-22.5, 26.5], [-22, 38], [-19, 58], [-18.4, 70], [-20.6, 84], [-21, 112, 1], [21, 112, 1], [20.6, 84], [18.4, 70], [19, 58], [22, 38], [22.5, 26.5], [17, 22], [7, 20]];
  const bodyD = curve(body);
  const W = 21, H = 14.5, r = 1.6;
  const bezelD = `M${-W + r} ${-H}L${W - r} ${-H}Q${W} ${-H} ${W} ${-H + r}L${W} ${H - r}Q${W} ${H} ${W - r} ${H}L${-W + r} ${H}Q${-W} ${H} ${-W} ${H - r}L${-W} ${-H + r}Q${-W} ${-H} ${-W + r} ${-H}Z`;
  const screenD = `M${-W + 1.4} ${-H + 1.4}L${W - 1.4} ${-H + 1.4}L${W - 1.4} ${H - 2.6}L${-W + 1.4} ${H - 2.6}Z`;
  return (
    <g>
      <defs>
        <linearGradient id={id('scr')} x1="0" y1={-H} x2="0" y2={H} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#15181E" />
          <stop offset="0.3" stopColor="#07080B" />
          <stop offset="1" stopColor="#020203" />
        </linearGradient>
        <linearGradient id={id('fall')} x1="0" y1="34" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#07060A" stopOpacity={0} />
          <stop offset="1" stopColor="#07060A" stopOpacity={0.85} />
        </linearGradient>
        <radialGradient id={id('glow')} cx="0" cy="0" r="4" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3FE6FF" stopOpacity={0.32} />
          <stop offset="1" stopColor="#3FE6FF" stopOpacity={0} />
        </radialGradient>
        <clipPath id={id('bc')}><path d={bodyD} /></clipPath>
      </defs>
      {/* the blazer, lit across the shoulders by the pool, falling into the dark */}
      <path d={bodyD} fill={B.shade} />
      <g clipPath={`url(#${id('bc')})`}>
        <path d={curve([[-20, 23], [-7, 20], [7, 20], [20, 23], [25, 30], [12, 28], [-12, 28], [-25, 30]])} fill={B.base} />
        {/* shirt, tie, lapels */}
        <path d={curve([[-5.4, 20, 1], [5.4, 20, 1], [2.6, 42, 1], [-2.6, 42, 1]])} fill="#D6D3CC" />
        <path d={curve([[-1.3, 22, 1], [1.3, 22, 1], [1.9, 40, 1], [0, 43, 1], [-1.9, 40, 1]])} fill="#1B2638" />
        <path d={curve([[-1.4, 21, 1], [1.4, 21, 1], [1, 23.5, 1], [-1, 23.5, 1]])} fill="#2A3A54" />
        <path d={curve([[-7, 20, 1], [-2.6, 30], [-2.8, 44, 1], [-11, 34, 1], [-9.4, 28, 1]])} fill={B.base} />
        <path d={curve([[7, 20, 1], [2.6, 30], [2.8, 44, 1], [11, 34, 1], [9.4, 28, 1]])} fill={B.shade} />
        <path d={ink([[-7, 20], [-2.6, 30], [-2.8, 44]], 0.45 * k, {a: 0.1, b: 0.3})} fill={B.line} />
        <path d={ink([[7, 20], [2.6, 30], [2.8, 44]], 0.45 * k, {a: 0.1, b: 0.3})} fill={B.line} />
        <path d={ink([[-18, 23.4], [-8, 21.4]], 1.1, {a: 0.4, b: 0.4})} fill={B.hi} />
        <path d={ell(0, 50, 0.6, 0.6)} fill="#1A1A20" />
        <path d={ell(0, 58, 0.6, 0.6)} fill="#1A1A20" />
        {/* the lanyard over the lapels, the badge on its clip */}
        <path d={ink([[-4.8, 21], [-4.2, 32], [-1.4, 47]], 0.9, {a: 0.05, b: 0.05, tip: 0.8})} fill="#1E8C92" />
        <path d={ink([[4.8, 21], [4.2, 32], [1.4, 47]], 0.9, {a: 0.05, b: 0.05, tip: 0.8})} fill="#157076" />
        <rect x={-3.6} y={46.5} width={7.2} height={10} rx={0.6} fill="#DAD3C2" stroke={B.line} strokeWidth={0.28 * k} />
        <rect x={-2.9} y={47.3} width={5.8} height={2} fill="#1E8C92" />
        <path d={ink([[-2.4, 52], [2.4, 52]], 0.32, {a: 0.1, b: 0.1})} fill="#7A7468" />
        <path d={ink([[-2.4, 54], [1, 54]], 0.32, {a: 0.1, b: 0.1})} fill="#7A7468" />
        <rect x={-40} y={20} width={80} height={100} fill={`url(#${id('fall')})`} />
      </g>
      {/* the sleeves: arms down at its sides, a dark seam where each meets the body */}
      {([-1, 1] as const).map((sd) => {
        // the upper arm hangs, the elbow bends, the forearm comes forward to the table (its hands are below the rail)
        const arm: Pt[] = [[sd * 20.5, 24.5], [sd * 25.5, 27.5], [sd * 28, 40], [sd * 28.4, 60], [sd * 25.4, 80], [sd * 19.5, 96, 1], [sd * 12.5, 96, 1], [sd * 18.6, 78], [sd * 21.4, 60], [sd * 20.6, 40], [sd * 19.4, 31]];
        return (
          <g key={sd}>
            <path d={curve(arm)} fill={sd < 0 ? B.base : B.shade} />
            <path d={curve([[sd * 20, 44], [sd * 28.6, 48], [sd * 28, 66], [sd * 22, 90], [sd * 12, 96], [sd * 19, 72]])} fill="#07060A" opacity={0.42} />
            {/* the elbow's fold and the sleeve's crease */}
            <path d={ink([[sd * 27, 58], [sd * 24, 62], [sd * 22, 61]], 0.42 * k, {a: 0.2, b: 0.4})} fill={B.line} opacity={0.8} />
            <path d={ink(arm.slice(0, 6), 0.6 * k, {a: 0.1, b: 0.05})} fill={B.line} />
            <path d={ink([[sd * 19.4, 31], [sd * 20.6, 40], [sd * 21.4, 60], [sd * 18.6, 78]], 0.5 * k, {a: 0.1, b: 0.05})} fill={B.line} />
          </g>
        );
      })}
      <path d={ink(body.slice(0, 5), 0.7 * k, {a: 0.1, b: 0.02})} fill={B.line} />
      <path d={ink(body.slice(5), 0.6 * k, {a: 0.02, b: 0.1})} fill={B.line} />
      <Rim id={id('rbw')} shapes={[bodyD]} dx={0} dy={-0.6} color={KEY.warm} opacity={0.7} />
      <Rim id={id('rbc')} shapes={[bodyD]} dx={0.7} dy={0} color={KEY.rimCool} opacity={0.55} />
      {/* the stand-neck, short, into the collar */}
      <path d="M-2.2 13L2.2 13L2.6 21L-2.6 21Z" fill="#26282F" />
      <path d="M0.6 13L2.2 13L2.6 21L1 21Z" fill="#111217" />
      {/* the monitor head: a thin bezel, black glass, the lamp along its top edge, the caret */}
      <path d={bezelD} fill="#1E2026" />
      <path d={screenD} fill={`url(#${id('scr')})`} />
      <path d={ink([[-W + 1, -H + 0.2], [W - 1, -H + 0.2]], 0.7, {a: 0.05, b: 0.05})} fill={KEY.warm} opacity={0.9} />
      <path d={ink([[-W + 2.4, -H + 2.2], [W - 2.4, -H + 2.2]], 0.35, {a: 0.3, b: 0.3})} fill="#FFFFFF" opacity={0.06} />
      {caret && (
        <g>
          <path d={ell(0, -1.2, 4, 4.6)} fill={`url(#${id('glow')})`} />
          <rect x={-0.6} y={-5.2} width={1.2} height={8} fill="#3FE6FF" />
          <rect x={-0.6} y={-5.2} width={1.2} height={0.8} fill="#D2FCFF" />
        </g>
      )}
      <path d={bezelD} fill="none" stroke="#050507" strokeWidth={0.36 * k} />
      <Rim id={id('rhc')} shapes={[bezelD]} dx={0.5} dy={0} color={KEY.rimCool} opacity={0.6} />
    </g>
  );
};

// ------------------------------------------------------------------ the stat bar in cel line (cm units)
export const CelBar: React.FC<{label: string; cells: number; filled: number; t: number; k: number}> = ({label, cells, filled, t, k}) => {
  if (t < 0) return null;
  const fs = 5;
  const lw = label.length * fs * 0.62;
  const shown = Math.max(0, Math.min(cells, Math.floor((t - 2) / 2) + 1));
  const cw = 2.8, ch = 2.1, gap = 0.7, sk = 0.7;
  const x0 = -(lw + 1.6 + cells * (cw + gap)) / 2;
  const cx0 = x0 + lw + 1.6;
  return (
    <g>
      <text x={x0} y={0} fontFamily="Jost, sans-serif" fontWeight={700} fontSize={fs} letterSpacing={0.32} fill="#EFE3C8"
        stroke="#0B0709" strokeWidth={0.9} paintOrder="stroke" strokeLinejoin="round" textLength={lw} lengthAdjust="spacingAndGlyphs">{label}</text>
      {Array.from({length: shown}, (_, i) => {
        const x = cx0 + i * (cw + gap), y = -ch - 0.35;
        const on = i < filled;
        const d = `M${x + sk} ${y}L${x + cw + sk} ${y}L${x + cw} ${y + ch}L${x} ${y + ch}Z`;
        return (
          <g key={i}>
            <path d={d} transform="translate(0.35 0.35)" fill="#050305" opacity={0.8} />
            <path d={d} fill={on ? '#3FCACB' : '#0C1418'} stroke="#060405" strokeWidth={0.34 * Math.min(1.4, k)} strokeLinejoin="round" />
            {on && <path d={`M${x + sk + 0.25} ${y + 0.25}L${x + cw + sk - 0.3} ${y + 0.25}L${x + cw + sk - 0.45} ${y + 0.75}L${x + sk + 0.1} ${y + 0.75}Z`} fill="#C6FBF1" opacity={0.9} />}
            {!on && <path d={d} fill="none" stroke="#2E8C9E" strokeWidth={0.22} />}
          </g>
        );
      })}
    </g>
  );
};
