import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../theme/fonts';
import {Grain, Paper} from '../fx/Grain';
import {buildSkyline} from './skyline';
import {H, TitleProps, W, clamp, easeOut, layoutWordmark, rng, smooth, useFontsReady, useTitleFrame} from './common';

/**
 * title-noir — graphic-novel splash. Pure ink + paper + ONE spot colour (monitor cyan, used only
 * for THE ORB's iris and the rose window). Night sky is solid ink that breaks into a line-weight
 * gradient toward the white-hot horizon; the skyline is a hard black cut-out; rain is drawn once
 * and inverts itself (white on ink, ink on paper). Caption box for the subtitle.
 */
const PAPER = '#ECE5D3';
const INK = '#0A0A0D';
const SPOT = '#3FE6FF';

export const TitleNoir: React.FC<TitleProps> = (props) => {
  const f = useTitleFrame(props);
  const ready = useFontsReady(['400 330px Anton', '700 28px "JetBrains Mono"']);
  const sky = useMemo(() => buildSkyline({seed: 29, ground: H + 4, u: 0.52}), []);
  const rain = useMemo(() => {
    const R = rng(55);
    return Array.from({length: 260}, () => ({x: R() * (W + 400) - 200, y: R() * H, l: 30 + R() * 110, w: 0.8 + R() * 1.8}));
  }, []);
  const hatch = useMemo(() => {
    // line-weight gradient: ink bars thinning toward the horizon glow
    const out: {y: number; h: number}[] = [];
    const y0 = 470;
    const y1 = 860;
    for (let y = y0; y < y1; y += 11) {
      const t = (y - y0) / (y1 - y0);
      out.push({y, h: Math.max(0.6, 11 * Math.pow(1 - t, 1.6))});
    }
    return out;
  }, []);
  if (!ready) return <AbsoluteFill style={{background: INK}} />;

  const font = `400 330px ${FONT.cardName}`;
  const L = layoutWordmark({font, tracking: 2, orb: 0.52, gapL: 0.07, gapR: 0.2, sink: 0.01});
  const bx = W / 2;
  const by = 430;
  const reveal = props.frame !== undefined ? 1 : easeOut(clamp((f - 2) / 16));
  const cap = props.frame !== undefined ? 1 : smooth(22, 32, f);
  const r = L.orb.r;
  const ox = bx + L.orb.cx;
  const oy = by + L.orb.cy;
  const look: [number, number] = [-0.1 + 0.2 * Math.sin(f / 22), 0.08];
  const ix = ox + look[0] * r * 0.5;
  const iy = oy + look[1] * r * 0.5;
  const ri = r * 0.46;
  const rainShift = (f * 26) % H;
  const flash = props.frame === undefined && (f === 40 || f === 42); // lightning double-flash

  return (
    <AbsoluteFill style={{background: PAPER}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <filter id="nr-rough" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={2} seed={3} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={5} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="nr-speck" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.16" numOctaves={3} seed={8} result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -40 0 0 0 11.0" result="m" />
            <feComposite in="SourceGraphic" in2="m" operator="in" />
          </filter>
          <clipPath id="nr-orb">
            <circle cx={ox} cy={oy} r={r} />
          </clipPath>
        </defs>
        {/* night: solid ink, breaking into line-weight bands above the glow */}
        <rect x={0} y={0} width={W} height={470} fill={INK} />
        {hatch.map((b, i) => (
          <rect key={i} x={0} y={b.y} width={W} height={b.h} fill={INK} />
        ))}
        {/* far campus: vertical hatch (reads as mid-grey at distance) */}
        <clipPath id="nr-far">
          <path d={sky.far} />
        </clipPath>
        <g clipPath="url(#nr-far)">
          {Array.from({length: Math.ceil(W / 5)}, (_, i) => (
            <rect key={i} x={i * 5} y={500} width={2.4} height={600} fill={INK} />
          ))}
        </g>
        <path d={sky.far} fill="none" stroke={INK} strokeWidth={1.5} />
        {/* skyline cut-out */}
        <path d={sky.cables} stroke={INK} strokeWidth={2} fill="none" />
        <path d={sky.lines} stroke={INK} strokeWidth={3.5} fill="none" />
        <path d={sky.mid} fill={INK} />
        {sky.windows.map((w, i) => (w.arch ? <path key={i} d={w.d} fill={PAPER} /> : i % 3 === 0 ? <rect key={i} x={w.x} y={w.y} width={w.w * 1.4} height={1.6} fill={PAPER} /> : null))}
        <circle cx={sky.rose.cx} cy={sky.rose.cy} r={sky.rose.r} fill={SPOT} />
        <circle cx={sky.rose.cx} cy={sky.rose.cy} r={sky.rose.r * 0.4} fill={INK} />
        <circle cx={sky.rose.cx + sky.rose.r * 0.14} cy={sky.rose.cy - sky.rose.r * 0.14} r={sky.rose.r * 0.1} fill={PAPER} />

        {/* rain: inverts over ink and paper */}
        <g style={{mixBlendMode: 'difference'}}>
          {rain.map((d, i) => {
            const y = ((d.y + rainShift) % (H + 200)) - 100;
            return <line key={i} x1={d.x} y1={y} x2={d.x - d.l * 0.26} y2={y + d.l} stroke="#FFFFFF" strokeWidth={d.w} strokeLinecap="round" />;
          })}
        </g>

        {/* WORDMARK: paper-white, rough inked edge, speckled dry-brush */}
        <g transform={`translate(${bx} ${by + (1 - reveal) * 40})`} opacity={reveal}>
          <g filter="url(#nr-rough)">
            {(['MR', 'MAS'] as const).map((t) => (
              <text key={t} x={t === 'MR' ? L.mrX : L.masX} y={0} fontFamily={FONT.cardName} fontSize={330} letterSpacing={2} fill={PAPER}>
                {t}
              </text>
            ))}
          </g>
          <g filter="url(#nr-speck)" opacity={0.9}>
            {(['MR', 'MAS'] as const).map((t) => (
              <text key={t} x={t === 'MR' ? L.mrX : L.masX} y={0} fontFamily={FONT.cardName} fontSize={330} letterSpacing={2} fill={INK}>
                {t}
              </text>
            ))}
          </g>
        </g>
        {/* THE ORB: black sphere, hard white rim crescent, spot-cyan iris */}
        <g opacity={reveal}>
          <circle cx={ox} cy={oy} r={r + 5} fill={INK} />
          <circle cx={ox} cy={oy} r={r} fill={INK} />
          <g clipPath="url(#nr-orb)">
            {/* hard rim-light crescent: paper disc minus an offset ink disc */}
            <circle cx={ox} cy={oy} r={r} fill={PAPER} />
            <circle cx={ox - r * 0.24} cy={oy + r * 0.05} r={r * 0.97} fill={INK} />
            <circle cx={ix} cy={iy} r={ri * 1.16} fill={PAPER} />
            <circle cx={ix} cy={iy} r={ri} fill={SPOT} />
            <path d={`M ${ix - ri} ${iy} A ${ri} ${ri} 0 0 0 ${ix + ri} ${iy} Z`} fill={INK} opacity={0.35} />
            <circle cx={ix} cy={iy} r={ri * 0.45} fill={INK} />
            <circle cx={ix + ri * 0.3} cy={iy - ri * 0.32} r={ri * 0.14} fill={PAPER} />
            <path d={`M ${ox + r * 0.25} ${oy - r * 0.72} Q ${ox + r * 0.55} ${oy - r * 0.66} ${ox + r * 0.66} ${oy - r * 0.42} L ${ox + r * 0.5} ${oy - r * 0.4} Q ${ox + r * 0.44} ${oy - r * 0.55} ${ox + r * 0.22} ${oy - r * 0.6} Z`} fill={PAPER} />
          </g>
        </g>
        {/* caption box */}
        <g transform={`translate(${W / 2} ${by + 116}) rotate(-1.2)`} opacity={cap}>
          <rect x={-352} y={-38} width={716} height={70} fill={INK} transform="translate(9 9)" />
          <rect x={-352} y={-38} width={704} height={70} fill="#F7F2E6" stroke={INK} strokeWidth={4} />
          <text x={0} y={2} textAnchor="middle" dominantBaseline="middle" fontFamily={FONT.mono} fontWeight={700} fontSize={28} letterSpacing={2.5} fill={INK}>
            now in low-key research preview
          </text>
        </g>
      </svg>
      <Paper amount={0.3} seed={11} />
      <Grain amount={0.06} seed={5 + Math.floor(f / 2)} blend="multiply" scale={1.2} />
      {flash && <AbsoluteFill style={{background: PAPER, mixBlendMode: 'difference'}} />}
    </AbsoluteFill>
  );
};
