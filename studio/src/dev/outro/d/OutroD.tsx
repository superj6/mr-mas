// MR. MAS — outro D (lookdev): the Remotion hosts. Everything is drawn by the shared pixel engine at 480x270 and
// presented at 4x (1920x1080, nearest-neighbour). The one exception is the post box's MACHINE RENDER in the Ep7 /
// Ep10 variant stills: the capability ladder's top rung is drawn at full 1080p resolution (anti-aliased SVG), fenced
// inside the post box's text field, so it reads as a different fidelity from the pixel world around it (a
// programmatic filler for "the month's machine render"; OUTRO-PROPOSALS §5, style-range §3.4: a fenced slot).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PixelScene} from '../../../shared/pixel/PixelScene';
import {PAL} from '../../../shared/pixel/palette';
import {drawOutro, drawOutroUI, PRE} from './scene';
import {EPS, EP1, EpCfg} from './text';
import {layoutFor, viewAt, windowScreenRect} from './world';
import {EV} from './timeline';

const SCALE = 4;

/** Ep1 mock-up: composition frame f = PRE + o (f0-23 the stand-in, f24-383 the outro o0-359) */
const drawEp1 = (fb: Parameters<typeof drawOutro>[0], f: number) => { drawOutro(fb, f - PRE, EP1); };
const afterEp1 = (ui: Parameters<typeof drawOutroUI>[0], f: number) => { drawOutroUI(ui, f - PRE, EP1); };

export const OutroD: React.FC = () => <PixelScene draw={drawEp1} after={afterEp1} bg={PAL.N0} />;

// ------------------------------------------------------------------ the machine render (Ep7 / Ep10 stills)
/** Ep7: the Orb, smooth-shaded (a sphere, a rim light, the cyan iris with bloom): the machine can render its own mascot. */
const OrbRender: React.FC<{w: number; h: number}> = ({w, h}) => {
  const r = Math.min(w, h) * 0.36;
  const cx = w * 0.5, cy = h * 0.47;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <radialGradient id="bgd" cx="50%" cy="40%" r="75%">
          <stop offset="0" stopColor="#12202b" />
          <stop offset="1" stopColor="#05070b" />
        </radialGradient>
        <radialGradient id="shell" cx="36%" cy="30%" r="78%">
          <stop offset="0" stopColor="#e9f3f7" />
          <stop offset="0.22" stopColor="#9fb4c0" />
          <stop offset="0.62" stopColor="#34444f" />
          <stop offset="1" stopColor="#0b1117" />
        </radialGradient>
        <radialGradient id="iris" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="#8ff4ff" />
          <stop offset="0.7" stopColor="#3fe6ff" />
          <stop offset="1" stopColor="#0a4d5a" />
        </radialGradient>
        <filter id="bloom" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation={r * 0.18} />
        </filter>
        <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={r * 0.08} />
        </filter>
      </defs>
      <rect width={w} height={h} fill="url(#bgd)" />
      <ellipse cx={cx} cy={cy + r * 1.18} rx={r * 0.9} ry={r * 0.16} fill="#000" opacity={0.55} filter="url(#soft)" />
      <circle cx={cx} cy={cy} r={r} fill="url(#shell)" />
      <path d={`M ${cx + r * 0.94} ${cy - r * 0.2} A ${r} ${r} 0 0 1 ${cx + r * 0.1} ${cy + r * 0.99}`} stroke="#3fe6ff" strokeWidth={r * 0.06} fill="none" opacity={0.55} filter="url(#soft)" />
      <circle cx={cx + r * 0.12} cy={cy + r * 0.06} r={r * 0.34} fill="#0b1117" />
      <circle cx={cx + r * 0.12} cy={cy + r * 0.06} r={r * 0.26} fill="#3fe6ff" filter="url(#bloom)" opacity={0.9} />
      <circle cx={cx + r * 0.12} cy={cy + r * 0.06} r={r * 0.22} fill="url(#iris)" />
      <circle cx={cx - r * 0.36} cy={cy - r * 0.42} r={r * 0.12} fill="#ffffff" opacity={0.85} filter="url(#soft)" />
    </svg>
  );
};

/** Ep10: the knee, drawn by the machine at its own fidelity: a smooth curve with bloom that leaves the window's top. */
const CurveRender: React.FC<{w: number; h: number}> = ({w, h}) => {
  const pts: string[] = [];
  for (let i = 0; i <= 64; i++) {
    const x = (i / 64) * w;
    const y = h * 0.86 - 0.012 * h * (Math.exp((i / 64) * 5.4) - 1);
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  const grid: React.ReactNode[] = [];
  for (let i = 1; i < 6; i++) grid.push(<line key={`v${i}`} x1={(i * w) / 6} y1={0} x2={(i * w) / 6} y2={h} stroke="#1b2a3a" strokeWidth={1} />);
  for (let j = 1; j < 4; j++) grid.push(<line key={`h${j}`} x1={0} y1={(j * h) / 4} x2={w} y2={(j * h) / 4} stroke="#1b2a3a" strokeWidth={1} />);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id="cbg" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#05070b" />
          <stop offset="1" stopColor="#0d1a26" />
        </linearGradient>
        <filter id="cglow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={3.2} />
        </filter>
      </defs>
      <rect width={w} height={h} fill="url(#cbg)" />
      {grid}
      <polyline points={pts.join(' ')} fill="none" stroke="#3fe6ff" strokeWidth={6} opacity={0.55} filter="url(#cglow)" />
      <polyline points={pts.join(' ')} fill="none" stroke="#bff8ff" strokeWidth={2.2} strokeLinecap="round" />
    </svg>
  );
};

/** a still of episode `ep` at outro frame `o` (-24..269), with the machine render where that episode has one */
export const OutroDStill: React.FC<{ep: number; o: number}> = ({ep, o}) => {
  const cfg: EpCfg = EPS[ep] ?? EP1;
  const draw = React.useCallback((fb: Parameters<typeof drawOutro>[0]) => { drawOutro(fb, o, cfg); }, [o, cfg]);
  const after = React.useCallback((ui: Parameters<typeof drawOutroUI>[0]) => { drawOutroUI(ui, o, cfg); }, [o, cfg]);
  const rect = cfg.tiers.top === 'machine' && o >= 0 && o < EV.out ? windowScreenRect(layoutFor(cfg), viewAt(o), o) : null;
  return (
    <AbsoluteFill>
      <PixelScene draw={draw} after={after} bg={PAL.N0} hold={0} />
      {rect ? (
        <div style={{position: 'absolute', left: rect[0] * SCALE, top: rect[1] * SCALE, width: rect[2] * SCALE, height: rect[3] * SCALE, overflow: 'hidden'}}>
          {ep >= 10 ? <CurveRender w={rect[2] * SCALE} h={rect[3] * SCALE} /> : <OrbRender w={rect[2] * SCALE} h={rect[3] * SCALE} />}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
