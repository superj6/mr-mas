import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../theme/fonts';
import {Grain} from '../fx/Grain';
import {buildSkyline} from './skyline';
import {H, HERO, TitleProps, W, clamp, easeInOut, layoutWordmark, lerp, rng, smooth, useFontsReady, useTitleFrame} from './common';

/**
 * title-soft — cinematic prestige. Didone wordmark with generous tracking, THE ORB as a real chrome
 * sphere reflecting the dusk, volumetric light rays fanning out of the data-center cathedral's rose
 * window, 2:1 letterbox, film grain + halation.
 */
const BAR = 60; // 2:1 letterbox
const SRC = {x: W / 2, y: 0}; // filled from skyline rose window

export const ChromeOrb: React.FC<{cx: number; cy: number; r: number; look?: [number, number]; dilate?: number; lid?: number; uid: string; iris?: string; horizon?: string}> = ({
  cx,
  cy,
  r,
  look = [0, 0],
  dilate = 0.38,
  lid = 0,
  uid,
  iris = '#8FF3FF',
  horizon = '#F2D3A2',
}) => {
  const id = (s: string) => `${uid}-${s}`;
  // iris sits on the sphere surface in the look direction; foreshortened as it rotates away
  const lx = clamp(look[0], -0.8, 0.8);
  const ly = clamp(look[1], -0.8, 0.8);
  const ix = cx + lx * r * 0.62;
  const iy = cy + ly * r * 0.62;
  const ang = (Math.atan2(ly, lx) * 180) / Math.PI;
  const tilt = Math.hypot(lx, ly) * 0.62;
  const squash = Math.sqrt(Math.max(0.05, 1 - tilt * tilt));
  const ri = r * 0.42;
  const rp = ri * dilate;
  const fibers = useMemo(() => {
    const R = rng(91);
    const out: string[] = [];
    for (let i = 0; i < 64; i++) {
      const a = (i / 64) * Math.PI * 2 + R() * 0.05;
      const a2 = a + (R() - 0.5) * 0.18;
      const r0 = 0.4 + R() * 0.05;
      const r1 = 0.82 + R() * 0.16;
      out.push(`M ${(Math.cos(a) * r0).toFixed(3)} ${(Math.sin(a) * r0).toFixed(3)} Q ${(Math.cos((a + a2) / 2) * 0.66).toFixed(3)} ${(Math.sin((a + a2) / 2) * 0.66).toFixed(3)} ${(Math.cos(a2) * r1).toFixed(3)} ${(Math.sin(a2) * r1).toFixed(3)}`);
    }
    return out.join(' ');
  }, []);
  const hy = cy + r * 0.44; // reflected horizon (below the iris so the chrome reads)
  return (
    <g>
      <defs>
        <clipPath id={id('c')}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <linearGradient id={id('sky')} x1="0" y1={cy - r} x2="0" y2={hy} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#07090B" />
          <stop offset="0.35" stopColor="#1A2428" />
          <stop offset="0.68" stopColor="#4A5758" />
          <stop offset="0.9" stopColor="#9C957E" />
          <stop offset="1" stopColor="#EADBB8" />
        </linearGradient>
        <linearGradient id={id('gnd')} x1="0" y1={hy} x2="0" y2={cy + r} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1A1512" />
          <stop offset="0.35" stopColor="#060708" />
          <stop offset="1" stopColor="#15191B" />
        </linearGradient>
        <radialGradient id={id('rim')} cx={cx} cy={cy} r={r} gradientUnits="userSpaceOnUse">
          <stop offset="0.72" stopColor="#000" stopOpacity="0" />
          <stop offset="0.97" stopColor="#000" stopOpacity="0.55" />
          <stop offset="1" stopColor="#000" stopOpacity="0.8" />
        </radialGradient>
        <radialGradient id={id('iris')} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse">
          <stop offset={Math.max(0.1, dilate - 0.02)} stopColor="#E9FEFF" />
          <stop offset={dilate + 0.08} stopColor={iris} />
          <stop offset="0.72" stopColor="#1E7C8C" />
          <stop offset="0.93" stopColor="#0A3139" />
          <stop offset="1" stopColor="#020607" />
        </radialGradient>
        <filter id={id('bloom')} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={r * 0.22} />
        </filter>
        <filter id={id('blur2')} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={r * 0.03} />
        </filter>
        <filter id={id('soft')} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={r * 0.04} />
        </filter>
      </defs>
      {/* dark edge so the sphere separates from the night sky */}
      <circle cx={cx} cy={cy} r={r + 1.2} fill="#000" opacity={0.7} />
      {/* contact shadow on the baseline */}
      <ellipse cx={cx} cy={cy + r * 1.02} rx={r * 0.9} ry={r * 0.08} fill="#000" opacity={0.55} filter={`url(#${id('soft')})`} />
      <g clipPath={`url(#${id('c')})`}>
        <rect x={cx - r} y={cy - r} width={2 * r} height={hy - (cy - r)} fill={`url(#${id('sky')})`} />
        {/* reflected light rays, converging on the reflected rose window */}
        <g opacity={0.3} style={{mixBlendMode: 'screen'}} filter={`url(#${id('blur2')})`}>
          {Array.from({length: 13}, (_, i) => {
            const a = Math.PI + ((i + 0.5 + Math.sin(i * 7.3) * 0.3) / 13) * Math.PI;
            const w = 0.02 + ((i * 5) % 3) * 0.018;
            const ox = cx;
            const oy = hy + r * 0.05;
            return <path key={i} d={`M ${ox} ${oy} L ${ox + Math.cos(a - w) * r * 2} ${oy + Math.sin(a - w) * r * 2} L ${ox + Math.cos(a + w) * r * 2} ${oy + Math.sin(a + w) * r * 2} Z`} fill="#D8F0EE" opacity={0.28} />;
          })}
        </g>
        {/* horizon band (curved: sphere distortion) */}
        <path d={`M ${cx - r} ${hy - r * 0.02} Q ${cx} ${hy + r * 0.16} ${cx + r} ${hy - r * 0.02} L ${cx + r} ${cy + r} L ${cx - r} ${cy + r} Z`} fill={`url(#${id('gnd')})`} />
        <path d={`M ${cx - r} ${hy - r * 0.02} Q ${cx} ${hy + r * 0.16} ${cx + r} ${hy - r * 0.02}`} stroke={horizon} strokeWidth={r * 0.07} fill="none" opacity={0.95} filter={`url(#${id('soft')})`} />
        <ellipse cx={cx} cy={hy + r * 0.07} rx={r * 0.16} ry={r * 0.05} fill="#F4FEFF" opacity={0.95} filter={`url(#${id('soft')})`} />
        {/* reflected skyline lights along the horizon */}
        {Array.from({length: 13}, (_, i) => {
          const t = (i - 6) / 6.5;
          return <circle key={i} cx={cx + t * r * 0.9} cy={hy + r * 0.07 * (1 - t * t) + r * 0.05} r={r * 0.012} fill={i % 3 ? '#9FE8F0' : '#F2C27A'} opacity={0.8} />;
        })}
        {/* rim darkening + right rim light (screen-right key) */}
        <circle cx={cx} cy={cy} r={r} fill={`url(#${id('rim')})`} />
        <path d={`M ${cx - r * 0.86} ${cy + r * 0.2} A ${r} ${r} 0 0 0 ${cx - r * 0.3} ${cy + r * 0.92}`} stroke="#8A7A62" strokeWidth={r * 0.04} fill="none" opacity={0.6} filter={`url(#${id('soft')})`} />
        <path d={`M ${cx + r * 0.62} ${cy - r * 0.78} A ${r} ${r} 0 0 1 ${cx + r * 0.9} ${cy + r * 0.4}`} stroke="#E8EEF0" strokeWidth={r * 0.05} fill="none" opacity={0.55} filter={`url(#${id('soft')})`} />
        {/* softbox highlight, upper right */}
        <path
          d={`M ${cx + r * 0.18} ${cy - r * 0.74} Q ${cx + r * 0.46} ${cy - r * 0.8} ${cx + r * 0.62} ${cy - r * 0.6} L ${cx + r * 0.5} ${cy - r * 0.42} Q ${cx + r * 0.36} ${cy - r * 0.56} ${cx + r * 0.14} ${cy - r * 0.54} Z`}
          fill="#FFFFFF"
          opacity={0.92}
          filter={`url(#${id('soft')})`}
        />
        {/* the IRIS: an inset lens on the sphere */}
        <g transform={`translate(${ix} ${iy}) rotate(${ang}) scale(${squash} 1) rotate(${-ang})`}>
          <circle r={ri * 1.1} fill="#010203" opacity={0.92} />
          <circle r={ri * 1.1} fill="none" stroke="#B9C6C6" strokeWidth={Math.max(0.6, ri * 0.018)} opacity={0.55} />
          <circle r={1} fill={`url(#${id("iris")})`} transform={`scale(${ri})`} />
          <circle r={ri * 0.8} fill={iris} opacity={0.35 * (1 - lid)} filter={`url(#${id('bloom')})`} style={{mixBlendMode: 'screen'}} />
          <path d={fibers} transform={`scale(${ri})`} stroke="#DFFFFF" strokeWidth={0.012} fill="none" opacity={0.35} />
          <circle r={rp} fill="#010304" />
          <circle r={rp * 0.72} fill="none" stroke="#1B4C55" strokeWidth={ri * 0.03} opacity={0.8} />
          {/* catchlights */}
          <rect x={ri * 0.18} y={-ri * 0.52} width={ri * 0.26} height={ri * 0.18} rx={ri * 0.05} fill="#FFFFFF" opacity={0.9} />
          <circle cx={-ri * 0.3} cy={ri * 0.36} r={ri * 0.05} fill="#FFFFFF" opacity={0.6} />
        </g>
        {/* lid (for blinks): a chrome shutter sliding down */}
        {lid > 0.001 && <rect x={cx - r} y={cy - r} width={2 * r} height={2 * r * lid} fill="#0C0F11" />}
      </g>
      {/* emissive iris bloom (spills a little past the sphere) */}
      <circle cx={ix} cy={iy} r={ri * 0.9} fill={iris} opacity={0.22 * (1 - lid)} filter={`url(#${id('bloom')})`} style={{mixBlendMode: 'screen'}} />
    </g>
  );
};

export const TitleSoft: React.FC<TitleProps> = (props) => {
  const f = useTitleFrame(props);
  const ready = useFontsReady(['400 200px "Bodoni Moda"', '300 26px "JetBrains Mono"']);
  const sky = useMemo(() => buildSkyline({seed: 23, ground: H - BAR + 2, u: 0.42}), []);
  const rays = useMemo(() => {
    const R = rng(5);
    return Array.from({length: 30}, (_, i) => ({a: -168 + (i / 29) * 156 + (R() - 0.5) * 5, w: 0.6 + R() * 2.6, o: 0.25 + R() * 0.75, ph: R() * 6.28}));
  }, []);
  if (!ready) return <AbsoluteFill style={{background: '#040506'}} />;

  const intro = easeInOut(clamp(f / 54));
  const tracking = lerp(78, 36, intro);
  const font = `400 212px ${FONT.title}`;
  const L = layoutWordmark({font, tracking, orb: 0.64, gapL: 0.3, gapR: 0.5});
  const baseY = 492;
  const rose = sky.rose;
  SRC.x = rose.cx;
  SRC.y = rose.cy;
  const push = lerp(1.0, 1.035, clamp(f / 150));
  const typeOn = smooth(4, 40, f);
  const subOn = smooth(30, 58, f);
  const look: [number, number] = [0.05 + 0.18 * Math.sin(f / 23), 0.1 + 0.06 * Math.sin(f / 31)];
  const breathe = 0.5 + 0.5 * Math.sin(f / 19);

  return (
    <AbsoluteFill style={{background: '#030405'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <linearGradient id="sf-sky" x1="0" y1={BAR} x2="0" y2={sky.ground} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#030507" />
            <stop offset="0.4" stopColor="#081015" />
            <stop offset="0.66" stopColor="#101B1E" />
            <stop offset="0.8" stopColor="#23282A" />
            <stop offset="0.87" stopColor="#4A3B2E" />
            <stop offset="0.92" stopColor="#7A5638" />
            <stop offset="1" stopColor="#8C6440" />
          </linearGradient>
          <radialGradient id="sf-glow" cx={rose.cx} cy={rose.cy} r={900} gradientUnits="userSpaceOnUse" gradientTransform={`translate(${rose.cx} ${rose.cy}) scale(1.5 0.55) translate(${-rose.cx} ${-rose.cy})`}>
            <stop offset="0" stopColor="#D7F3F2" stopOpacity="0.5" />
            <stop offset="0.18" stopColor="#6FA8AE" stopOpacity="0.22" />
            <stop offset="0.5" stopColor="#2D4B50" stopOpacity="0.1" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sf-ray" cx={rose.cx} cy={rose.cy} r={1150} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#E9FBFF" stopOpacity="0.5" />
            <stop offset="0.25" stopColor="#BFE7EA" stopOpacity="0.16" />
            <stop offset="0.7" stopColor="#8FB9BC" stopOpacity="0.04" />
            <stop offset="1" stopColor="#8FB9BC" stopOpacity="0" />
          </radialGradient>
          <pattern id="sf-rack" width="6" height="4" patternUnits="userSpaceOnUse">
            <rect width="6" height="1.3" fill="#030404" opacity="0.75" />
          </pattern>
          <filter id="sf-rayblur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="sf-haze" x="-5%" y="-20%" width="110%" height="140%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
          <filter id="sf-bloom" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id="sf-halation" x="-10%" y="-40%" width="120%" height="180%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <filter id="sf-steam" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
          <linearGradient id="sf-type" x1="0" y1={-L.capH} x2="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#F3EDE0" />
            <stop offset="0.75" stopColor="#E4DBC8" />
            <stop offset="1" stopColor="#F1D9B4" />
          </linearGradient>
        </defs>
        <g transform={`translate(${W / 2} ${H * 0.52}) scale(${push}) translate(${-W / 2} ${-H * 0.52})`}>
          <rect x={-60} y={0} width={W + 120} height={H} fill="url(#sf-sky)" />
          <rect x={-60} y={0} width={W + 120} height={H} fill="url(#sf-glow)" />
          {/* volumetric rays out of the rose window */}
          <g filter="url(#sf-rayblur)" style={{mixBlendMode: 'screen'}}>
            {rays.map((ry, i) => {
              const a = ((ry.a + Math.sin(f / 40 + ry.ph) * 0.6) * Math.PI) / 180;
              const w = (ry.w * Math.PI) / 180;
              const len = 1500;
              const p1 = [rose.cx + Math.cos(a - w / 2) * len, rose.cy + Math.sin(a - w / 2) * len];
              const p2 = [rose.cx + Math.cos(a + w / 2) * len, rose.cy + Math.sin(a + w / 2) * len];
              const flick = 0.85 + 0.15 * Math.sin(f / 9 + ry.ph * 3);
              return <path key={i} d={`M ${rose.cx} ${rose.cy} L ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]} Z`} fill="url(#sf-ray)" opacity={ry.o * flick} />;
            })}
          </g>
          {/* steam from the far cooling towers, lit from below */}
          <g filter="url(#sf-steam)" opacity={0.55}>
            {sky.stacks.map((s, i) => (
              <g key={i}>
                {[0, 1, 2, 3].map((k) => (
                  <ellipse key={k} cx={s.x + k * 16 + Math.sin(f / 30 + k) * 6} cy={s.y - 30 - k * 46 - ((f * 0.6) % 46)} rx={s.w * (0.45 + k * 0.18)} ry={s.w * (0.3 + k * 0.1)} fill={k === 0 ? '#4B4D49' : '#2B3032'} />
                ))}
              </g>
            ))}
          </g>
          {/* far campus, atmospheric */}
          <path d={sky.far} fill="#0E1416" filter="url(#sf-haze)" />
          <path d={sky.far} fill="#101719" opacity={0.7} />
          {/* power lines */}
          <path d={sky.cables} stroke="#050607" strokeWidth={0.9} fill="none" opacity={0.9} />
          <path d={sky.lines} stroke="#040506" strokeWidth={1.6} fill="none" />
          {/* the cathedral + halls */}
          <path d={sky.mid} fill="#030404" />
          {/* windows */}
          <g>
            {sky.windows.map((w, i) => (
              <path key={i} d={w.d} fill={w.cool ? '#A6EAF0' : '#F4C47E'} opacity={w.lit * (w.arch ? 0.95 : 0.8)} />
            ))}
          </g>
          {sky.windows.map((w, i) => (w.arch ? <path key={i} d={w.d} fill="url(#sf-rack)" /> : null))}
          <g filter="url(#sf-bloom)" style={{mixBlendMode: 'screen'}}>
            {sky.windows.map((w, i) => (w.arch ? <path key={i} d={w.d} fill={w.cool ? '#7FE0EA' : '#FFB765'} opacity={w.lit * 0.9} /> : null))}
          </g>
          {/* rose window */}
          <circle cx={rose.cx} cy={rose.cy} r={rose.r} fill="#DDF8FB" />
          <g stroke="#030404" strokeWidth={1.2}>
            {Array.from({length: 12}, (_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return <line key={i} x1={rose.cx + Math.cos(a) * rose.r * 0.28} y1={rose.cy + Math.sin(a) * rose.r * 0.28} x2={rose.cx + Math.cos(a) * rose.r} y2={rose.cy + Math.sin(a) * rose.r} />;
            })}
            <circle cx={rose.cx} cy={rose.cy} r={rose.r * 0.28} fill="none" />
            <circle cx={rose.cx} cy={rose.cy} r={rose.r * 0.62} fill="none" />
          </g>
          <circle cx={rose.cx} cy={rose.cy} r={rose.r * 2.4} fill="#BFF3F7" opacity={0.35 + 0.08 * breathe} filter="url(#sf-halation)" style={{mixBlendMode: 'screen'}} />
          {/* aircraft beacons */}
          {sky.beacons.map((b, i) => {
            const on = Math.sin(f / 7 + i * 1.7) > -0.2 ? 1 : 0.25;
            return (
              <g key={i} opacity={on}>
                <circle cx={b.x} cy={b.y} r={5} fill="#FF4A36" opacity={0.35} filter="url(#sf-bloom)" />
                <circle cx={b.x} cy={b.y} r={1.6} fill="#FF7A5C" />
              </g>
            );
          })}
        </g>

        {/* WORDMARK */}
        <g transform={`translate(${W / 2} ${baseY})`} opacity={typeOn}>
          <g filter="url(#sf-halation)" opacity={0.32} style={{mixBlendMode: 'screen'}}>
            <text x={L.mrX} y={0} fontFamily={FONT.title} fontSize={212} letterSpacing={tracking} fill="#FFD9A8">
              MR
            </text>
            <text x={L.masX} y={0} fontFamily={FONT.title} fontSize={212} letterSpacing={tracking} fill="#FFD9A8">
              MAS
            </text>
          </g>
          <text x={L.mrX} y={0} fontFamily={FONT.title} fontSize={212} letterSpacing={tracking} fill="url(#sf-type)">
            MR
          </text>
          <text x={L.masX} y={0} fontFamily={FONT.title} fontSize={212} letterSpacing={tracking} fill="url(#sf-type)">
            MAS
          </text>
          <ChromeOrb uid="sf-orb" cx={L.orb.cx} cy={L.orb.cy} r={L.orb.r} look={look} dilate={0.34 + 0.06 * breathe} />
        </g>
        {/* subtitle */}
        <g opacity={subOn}>
          <line x1={W / 2 - 34} x2={W / 2 + 34} y1={baseY + 58} y2={baseY + 58} stroke="#8C8577" strokeWidth={1} opacity={0.7} />
          <text x={W / 2 + 5} y={baseY + 112} textAnchor="middle" fontFamily={FONT.mono} fontWeight={300} fontSize={25} letterSpacing={10} fill="#A7ABA4">
            now in low-key research preview
          </text>
        </g>
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 55%, transparent 40%, rgba(0,0,0,0.75) 120%)'}} />
      <Grain amount={0.085} seed={1 + Math.floor(f / 2)} scale={0.75} />
      {/* letterbox */}
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: BAR, background: '#000'}} />
      <div style={{position: 'absolute', left: 0, bottom: 0, width: W, height: BAR, background: '#000'}} />
    </AbsoluteFill>
  );
};

export const TITLE_SOFT_HERO = HERO;
