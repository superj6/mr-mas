import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../theme/fonts';
import {Grain} from '../fx/Grain';
import {buildSkyline} from './skyline';
import {H, TitleProps, W, clamp, easeBack, easeOut, layoutWordmark, rng, smooth, useFontsReady, useTitleFrame} from './common';

/**
 * title-anime — TV-anime title card. Painted dusk sky with cel-shaded cumulus, a light pillar out
 * of the data-center cathedral, focus lines converging on THE ORB, a red slash band, and a slammed
 * italic wordmark with the double (black + white) sticker outline. THE ORB is cel-shaded chrome
 * with a star glint. Vertical katakana tag: ミスター・マス ("Misutā Masu" = Mr. Mas).
 */
const SKEW = -11;
const KATAKANA = 'ミスター・マス';

const cloud = (cx: number, cy: number, s: number, seed: number) => {
  const R = rng(seed);
  const puffs = Array.from({length: 9}, (_, i) => {
    const t = i / 8 - 0.5;
    return {x: cx + t * 420 * s + (R() - 0.5) * 30 * s, y: cy - (1 - Math.abs(t) * 1.6) * 90 * s - R() * 40 * s, r: (60 + R() * 70) * s * (1 - Math.abs(t) * 0.8)};
  });
  return puffs;
};

export const TitleAnime: React.FC<TitleProps> = (props) => {
  const f = useTitleFrame(props);
  const ready = useFontsReady(['400 300px Anton', '700 60px "Noto Sans CJK JP"', '700 28px "JetBrains Mono"']);
  const sky = useMemo(() => buildSkyline({seed: 19, ground: H + 6, u: 0.5}), []);
  const focus = useMemo(() => {
    const R = rng(21);
    return Array.from({length: 120}, () => ({a: R() * Math.PI * 2, w: 0.002 + R() * 0.008, r0: 360 + R() * 260, o: 0.35 + R() * 0.65}));
  }, []);
  const clouds = useMemo(() => [cloud(330, 840, 1.35, 3), cloud(1590, 800, 1.45, 7), cloud(980, 250, 0.7, 11)], []);
  if (!ready) return <AbsoluteFill style={{background: '#1B1446'}} />;

  const slam = props.frame !== undefined ? 1 : easeBack(clamp((f - 3) / 12), 2.2);
  const scale = 1.35 - 0.35 * slam;
  const impact = props.frame === undefined && f >= 14 && f <= 15; // 2-frame inverted impact frame
  const band = easeOut(clamp((f - 1) / 9));
  const tagIn = easeOut(clamp((f - 16) / 12));
  const font = `400 300px ${FONT.cardName}`;
  const L = layoutWordmark({font, tracking: 4, orb: 0.62, gapL: 0.06, gapR: 0.2, sink: 0.01});
  const bx = W / 2 - 40;
  const by = 520;
  const tan = Math.tan((SKEW * Math.PI) / 180);
  const orbX = bx + L.orb.cx + tan * L.orb.cy * 1;
  const orbY = by + L.orb.cy;
  const r = L.orb.r;
  const look: [number, number] = [0.1 + 0.2 * Math.sin(f / 15), -0.05];
  const ix = orbX + look[0] * r * 0.5;
  const iy = orbY + look[1] * r * 0.5;
  const ri = r * 0.5;
  const glint = 0.75 + 0.25 * Math.sin(f / 5);
  const beam = 0.85 + 0.15 * Math.sin(f / 7);

  const Word: React.FC<{fill: string; stroke?: string; sw?: number; dx?: number; dy?: number}> = ({fill, stroke, sw = 0, dx = 0, dy = 0}) => (
    <>
      {(['MR', 'MAS'] as const).map((t) => (
        <text key={t} x={(t === 'MR' ? L.mrX : L.masX) + dx} y={dy} fontFamily={FONT.cardName} fontSize={300} letterSpacing={4} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" paintOrder="stroke">
          {t}
        </text>
      ))}
    </>
  );
  const Orb: React.FC<{outline?: boolean}> = () => (
    <g>
      <circle cx={orbX} cy={orbY} r={r + 17} fill="#FFFFFF" />
      <circle cx={orbX} cy={orbY} r={r + 8} fill="#0B0820" />
      <clipPath id="an-orb">
        <circle cx={orbX} cy={orbY} r={r} />
      </clipPath>
      <g clipPath="url(#an-orb)">
        {/* cel bands: night sky, blue, white horizon, warm ground */}
        <rect x={orbX - r} y={orbY - r} width={2 * r} height={2 * r} fill="#1E2A6E" />
        <path d={`M ${orbX - r} ${orbY - r * 0.25} Q ${orbX} ${orbY - r * 0.05} ${orbX + r} ${orbY - r * 0.25} L ${orbX + r} ${orbY + r} L ${orbX - r} ${orbY + r} Z`} fill="#4F7BD8" />
        <path d={`M ${orbX - r} ${orbY + r * 0.22} Q ${orbX} ${orbY + r * 0.42} ${orbX + r} ${orbY + r * 0.22} L ${orbX + r} ${orbY + r} L ${orbX - r} ${orbY + r} Z`} fill="#F4FBFF" />
        <path d={`M ${orbX - r} ${orbY + r * 0.34} Q ${orbX} ${orbY + r * 0.54} ${orbX + r} ${orbY + r * 0.34} L ${orbX + r} ${orbY + r} L ${orbX - r} ${orbY + r} Z`} fill="#FF7A59" />
        <path d={`M ${orbX - r} ${orbY + r * 0.62} Q ${orbX} ${orbY + r * 0.8} ${orbX + r} ${orbY + r * 0.62} L ${orbX + r} ${orbY + r} L ${orbX - r} ${orbY + r} Z`} fill="#8E2E63" />
        {/* shadow crescent (cel) */}
        <path d={`M ${orbX - r} ${orbY - r} L ${orbX - r} ${orbY + r} L ${orbX - r * 0.2} ${orbY + r} A ${r * 1.1} ${r * 1.1} 0 0 1 ${orbX - r * 0.55} ${orbY - r} Z`} fill="#0B0820" opacity={0.35} />
        {/* iris */}
        <circle cx={ix} cy={iy} r={ri * 1.14} fill="#0B0820" />
        <circle cx={ix} cy={iy} r={ri} fill="#18C6E8" />
        <circle cx={ix} cy={iy} r={ri * 0.74} fill="#7FF6FF" />
        <path d={`M ${ix - ri} ${iy} A ${ri} ${ri} 0 0 0 ${ix + ri} ${iy} Z`} fill="#0E7FA8" opacity={0.55} />
        <circle cx={ix} cy={iy} r={ri * 0.4} fill="#0B0820" />
        <ellipse cx={ix + ri * 0.34} cy={iy - ri * 0.38} rx={ri * 0.24} ry={ri * 0.17} fill="#FFFFFF" />
        <circle cx={ix - ri * 0.36} cy={iy + ri * 0.34} r={ri * 0.09} fill="#FFFFFF" />
        {/* hard specular */}
        <path d={`M ${orbX + r * 0.2} ${orbY - r * 0.78} Q ${orbX + r * 0.62} ${orbY - r * 0.7} ${orbX + r * 0.74} ${orbY - r * 0.36} Q ${orbX + r * 0.5} ${orbY - r * 0.56} ${orbX + r * 0.2} ${orbY - r * 0.78} Z`} fill="#FFFFFF" />
      </g>
      {/* star glint */}
      <g transform={`translate(${orbX + r * 0.66} ${orbY - r * 0.7}) scale(${glint})`}>
        <path d="M 0 -60 L 7 -7 L 60 0 L 7 7 L 0 60 L -7 7 L -60 0 L -7 -7 Z" fill="#FFFFFF" />
        <circle r={10} fill="#FFFFFF" />
      </g>
    </g>
  );

  const scene = (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id="an-sky" x1="0" y1="0" x2="0" y2={H} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#140F3A" />
          <stop offset="0.3" stopColor="#3E2472" />
          <stop offset="0.55" stopColor="#B23C7E" />
          <stop offset="0.72" stopColor="#F2656E" />
          <stop offset="0.86" stopColor="#FFA86A" />
          <stop offset="1" stopColor="#FFE0A0" />
        </linearGradient>
        <linearGradient id="an-beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9FF6FF" stopOpacity="0" />
          <stop offset="0.5" stopColor="#E9FEFF" stopOpacity="1" />
          <stop offset="1" stopColor="#9FF6FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="an-beamfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="an-beammask">
          <rect x={0} y={0} width={W} height={H} fill="url(#an-beamfade)" />
        </mask>
        <radialGradient id="an-clear" cx={orbX} cy={orbY} r={900} gradientUnits="userSpaceOnUse">
          <stop offset="0.3" stopColor="#000" />
          <stop offset="0.5" stopColor="#fff" />
        </radialGradient>
        <mask id="an-focusmask">
          <rect x={0} y={0} width={W} height={H} fill="url(#an-clear)" />
        </mask>
        <linearGradient id="an-type" x1="0" y1={-L.capH} x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.55" stopColor="#FFFFFF" />
          <stop offset="0.56" stopColor="#DDF1FF" />
          <stop offset="1" stopColor="#BFE3FF" />
        </linearGradient>
        <filter id="an-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>
      <rect width={W} height={H} fill="url(#an-sky)" />
      {/* stars */}
      {Array.from({length: 40}, (_, i) => {
        const R = rng(100 + i);
        return <circle key={i} cx={R() * W} cy={R() * 260} r={1 + R() * 1.6} fill="#FFF3E6" opacity={0.5 + 0.5 * Math.sin(f / 6 + i)} />;
      })}
      {/* cel-shaded cumulus: lit top (warm), shadow body (violet), hard edges */}
      {clouds.map((c, k) => {
        const bottom = Math.max(...c.map((p) => p.y)) + 30;
        return (
          <g key={k} transform={`translate(${Math.sin(f / 60 + k) * 6} 0)`}>
            <clipPath id={`an-cl-${k}`}>
              <rect x={-100} y={-100} width={W + 200} height={bottom + 100} />
            </clipPath>
            <g clipPath={`url(#an-cl-${k})`}>
              {c.map((p, i) => <circle key={'a' + i} cx={p.x} cy={p.y} r={p.r} fill="#FFC7A8" />)}
              {c.map((p, i) => <circle key={'b' + i} cx={p.x - p.r * 0.12} cy={p.y + p.r * 0.2} r={p.r * 0.92} fill="#E9829A" />)}
              {c.map((p, i) => <circle key={'c' + i} cx={p.x - p.r * 0.2} cy={p.y + p.r * 0.42} r={p.r * 0.78} fill="#7B3F8E" />)}
            </g>
          </g>
        );
      })}
      {/* light pillar out of the cathedral */}
      <g mask="url(#an-beammask)" opacity={beam}>
        <rect x={sky.rose.cx - 70} y={0} width={140} height={sky.rose.cy} fill="url(#an-beam)" opacity={0.55} />
        <rect x={sky.rose.cx - 16} y={0} width={32} height={sky.rose.cy} fill="url(#an-beam)" />
      </g>
      {/* focus lines (集中線) converging on the orb */}
      <g mask="url(#an-focusmask)">
        {focus.map((l, i) => {
          const a = l.a + f * 0.002 * ((i % 2) * 2 - 1);
          const x1 = orbX + Math.cos(a - l.w) * 2200;
          const y1 = orbY + Math.sin(a - l.w) * 2200;
          const x2 = orbX + Math.cos(a + l.w) * 2200;
          const y2 = orbY + Math.sin(a + l.w) * 2200;
          const x0 = orbX + Math.cos(a) * l.r0;
          const y0 = orbY + Math.sin(a) * l.r0;
          return <path key={i} d={`M ${x0} ${y0} L ${x1} ${y1} L ${x2} ${y2} Z`} fill="#FFFFFF" opacity={l.o * 0.55} />;
        })}
      </g>
      {/* skyline */}
      <path d={sky.far} fill="#5A2A6E" />
      <path d={sky.cables} stroke="#1A0F33" strokeWidth={1.6} fill="none" />
      <path d={sky.lines} stroke="#1A0F33" strokeWidth={3} fill="none" />
      <path d={sky.mid} fill="#1A0F33" />
      {sky.windows.map((w, i) => (
        <path key={i} d={w.d} fill={w.cool ? '#7FF6FF' : '#FFD27A'} opacity={w.arch ? 1 : w.lit} />
      ))}
      <circle cx={sky.rose.cx} cy={sky.rose.cy} r={sky.rose.r} fill="#E9FEFF" />
      <circle cx={sky.rose.cx} cy={sky.rose.cy} r={sky.rose.r * 0.35} fill="#18C6E8" />
      <circle cx={sky.rose.cx} cy={sky.rose.cy} r={sky.rose.r * 3} fill="#9FF6FF" opacity={0.45} filter="url(#an-glow)" />
      {/* red slash band */}
      <g transform={`translate(${(1 - band) * -W} 0)`}>
        <path d={`M -40 ${by - L.capH * 0.62} L ${W + 40} ${by - L.capH * 0.98} L ${W + 40} ${by - L.capH * 0.46} L -40 ${by - L.capH * 0.1} Z`} fill="#E8202E" />
        <path d={`M -40 ${by - L.capH * 0.06} L ${W + 40} ${by - L.capH * 0.42} L ${W + 40} ${by - L.capH * 0.38} L -40 ${by - L.capH * 0.02} Z`} fill="#0B0820" />
      </g>
      {/* WORDMARK: slam + sticker outline */}
      <g transform={`translate(${bx} ${by}) scale(${scale}) skewX(${SKEW})`}>
        <Word fill="#0B0820" stroke="#0B0820" sw={36} dx={14} dy={16} />
        <Word fill="#FFFFFF" stroke="#FFFFFF" sw={36} />
        <Word fill="#0B0820" stroke="#0B0820" sw={18} />
        <Word fill="url(#an-type)" />
      </g>
      <g transform={`translate(${bx} ${by}) scale(${scale}) translate(${-bx} ${-by})`}>
        <Orb />
      </g>
      {/* subtitle tag */}
      <g transform={`translate(${W / 2 - 40} ${by + 92}) skewX(${SKEW})`} opacity={tagIn}>
        <rect x={-372} y={-34} width={744} height={54} fill="#0B0820" />
        <rect x={-372} y={-34} width={12} height={54} fill="#E8202E" />
        <text x={8} y={2} textAnchor="middle" fontFamily={FONT.mono} fontWeight={700} fontSize={28} letterSpacing={3} fill="#FFFFFF" dominantBaseline="middle">
          now in low-key research preview
        </text>
      </g>
    </svg>
  );

  return (
    <AbsoluteFill style={{background: '#140F3A', filter: impact ? 'invert(1) contrast(1.6) grayscale(1)' : undefined}}>
      {scene}
      {/* vertical katakana tag, right edge */}
      <div
        style={{
          position: 'absolute',
          right: 92,
          top: 96 + (1 - tagIn) * -60,
          opacity: tagIn,
          background: '#0B0820',
          color: '#FFFFFF',
          padding: '26px 16px',
          writingMode: 'vertical-rl',
          fontFamily: '"Noto Sans CJK JP", sans-serif',
          fontWeight: 700,
          fontSize: 58,
          letterSpacing: 10,
          lineHeight: 1,
          borderTop: '12px solid #E8202E',
        }}
      >
        {KATAKANA}
      </div>
      <Grain amount={0.04} seed={3 + Math.floor(f / 2)} scale={0.8} />
    </AbsoluteFill>
  );
};
