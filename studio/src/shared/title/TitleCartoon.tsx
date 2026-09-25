import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../theme/fonts';
import {buildSkyline} from './skyline';
import {H, TitleProps, W, clamp, easeBack, layoutWordmark, useFontsReady, useTitleFrame} from './common';

/**
 * title-cartoon — the earlier clean-vector, outlined look, kept for comparison with the spectrum:
 * flat sunset bands, outlined flat skyline, chunky rounded type with a hard drop shadow, and THE
 * ORB as a friendly outlined cartoon eyeball.
 */
const OUT = '#1E1B2E';

export const TitleCartoon: React.FC<TitleProps> = (props) => {
  const f = useTitleFrame(props);
  const ready = useFontsReady(['400 250px "Archivo Black"', '700 30px "JetBrains Mono"']);
  const sky = useMemo(() => buildSkyline({seed: 37, ground: H + 6, u: 0.44}), []);
  if (!ready) return <AbsoluteFill style={{background: '#FFB36B'}} />;

  const font = `400 250px ${FONT.headline}`;
  const L = layoutWordmark({font, tracking: 4, orb: 0.66, gapL: 0.08, gapR: 0.22, sink: 0.02});
  const bx = W / 2;
  const by = 520;
  const pop = props.frame !== undefined ? 1 : easeBack(clamp(f / 14), 2.4);
  const r = L.orb.r;
  const ox = bx + L.orb.cx;
  const oy = by + L.orb.cy;
  const look: [number, number] = [0.25 * Math.sin(f / 12), 0.12];
  const blink = f % 48 > 44 ? 1 : 0;
  const bands = ['#3B3170', '#5E3F8F', '#9A4F9C', '#E0678F', '#FF8F7A', '#FFB36B', '#FFD88A'];

  return (
    <AbsoluteFill>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {bands.map((c, i) => (
          <rect key={i} x={0} y={(i / bands.length) * 900} width={W} height={H} fill={c} />
        ))}
        <circle cx={sky.rose.cx} cy={H - 120} r={250} fill="#FFE9A8" stroke={OUT} strokeWidth={6} />
        <path d={sky.far} fill="#7E4E9E" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
        <path d={sky.cables} stroke={OUT} strokeWidth={3} fill="none" />
        <path d={sky.lines} stroke={OUT} strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d={sky.mid} fill="#40306A" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
        {sky.windows.map((w, i) => (w.arch ? <path key={i} d={w.d} fill="#9FF3FF" stroke={OUT} strokeWidth={3} /> : null))}
        <circle cx={sky.rose.cx} cy={sky.rose.cy} r={sky.rose.r} fill="#FFFFFF" stroke={OUT} strokeWidth={4} />
        <circle cx={sky.rose.cx} cy={sky.rose.cy} r={sky.rose.r * 0.4} fill="#2FA8D8" stroke={OUT} strokeWidth={3} />
        <g transform={`translate(${bx} ${by}) scale(${pop})`}>
          {(['MR', 'MAS'] as const).map((t) => (
            <text key={t + 'd'} x={(t === 'MR' ? L.mrX : L.masX) + 12} y={14} fontFamily={FONT.headline} fontSize={250} letterSpacing={4} fill={OUT} stroke={OUT} strokeWidth={22} strokeLinejoin="round">
              {t}
            </text>
          ))}
          {(['MR', 'MAS'] as const).map((t) => (
            <text key={t} x={t === 'MR' ? L.mrX : L.masX} y={0} fontFamily={FONT.headline} fontSize={250} letterSpacing={4} fill="#FFF4D6" stroke={OUT} strokeWidth={14} strokeLinejoin="round" paintOrder="stroke">
              {t}
            </text>
          ))}
          <circle cx={L.orb.cx + 12} cy={L.orb.cy + 14} r={r + 7} fill={OUT} />
          <circle cx={L.orb.cx} cy={L.orb.cy} r={r} fill="#FFFFFF" stroke={OUT} strokeWidth={10} />
          <circle cx={L.orb.cx + look[0] * r * 0.45} cy={L.orb.cy + look[1] * r * 0.45} r={r * 0.5} fill="#2FA8D8" stroke={OUT} strokeWidth={6} />
          <circle cx={L.orb.cx + look[0] * r * 0.5} cy={L.orb.cy + look[1] * r * 0.5} r={r * 0.22} fill={OUT} />
          <circle cx={L.orb.cx + look[0] * r * 0.5 + r * 0.14} cy={L.orb.cy + look[1] * r * 0.5 - r * 0.14} r={r * 0.08} fill="#FFFFFF" />
          <path d={`M ${L.orb.cx - r * 0.5} ${L.orb.cy - r * 0.62} Q ${L.orb.cx - r * 0.1} ${L.orb.cy - r * 0.9} ${L.orb.cx + r * 0.35} ${L.orb.cy - r * 0.72}`} stroke="#FFFFFF" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.9} />
          {blink ? <path d={`M ${L.orb.cx - r} ${L.orb.cy} A ${r} ${r} 0 0 1 ${L.orb.cx + r} ${L.orb.cy} Z`} fill="#E6E0F0" stroke={OUT} strokeWidth={8} /> : null}
        </g>
        <g transform={`translate(${W / 2} ${by + 96})`}>
          <rect x={-366} y={-36} width={732} height={64} rx={32} fill={OUT} transform="translate(6 7)" />
          <rect x={-366} y={-36} width={732} height={64} rx={32} fill="#FFFFFF" stroke={OUT} strokeWidth={6} />
          <text x={0} y={-3} textAnchor="middle" dominantBaseline="middle" fontFamily={FONT.mono} fontWeight={700} fontSize={30} fill={OUT}>
            now in low-key research preview
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
