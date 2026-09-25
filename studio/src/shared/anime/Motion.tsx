import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {AnimeMas} from './Mas';
import {Mouth} from './cel';
import {ForegroundBlur, Motes, RoomBack, RoomFront} from './Room';
import {AnimeGrade, DiffusionDefs} from './Grade';

/**
 * 'anime-motion' (72f @24): Mas close-up. Blink @18, eye dart to camera @36, tiny head tilt with hair
 * follow-through, says "near…" (M, E, A, O), monitor flicker. Character drawings are held on 2s
 * (TV-anime timing); camera push, light and dust run on 1s.
 */

const on2s = (f: number) => Math.floor(f / 2) * 2;
const ease = Easing.bezier(0.33, 0, 0.2, 1);

export const tiltAt = (f: number) => interpolate(f, [38, 50], [0, -3.2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

/** Damped spring driven by the head's angular acceleration (hair lags, overshoots, settles). */
export const hairSpring = (f: number, tilt: (t: number) => number = tiltAt) => {
  let x = 0;
  let v = 0;
  for (let t = 1; t <= f; t++) {
    const acc = tilt(t) - 2 * tilt(t - 1) + tilt(Math.max(0, t - 2));
    v += -0.16 * x - 0.22 * v - 26 * acc;
    x += v;
  }
  return x;
};

const blinkLid = (f: number, base: number) => {
  const seq: Record<number, number> = {18: 0.55, 19: 1, 20: 1, 21: 0.5};
  return seq[f] ?? base;
};

const lookAt = (f: number): [number, number] => {
  if (f < 36) return [0.5, 0.05];
  if (f === 36) return [-0.05, 0.1]; // in-between (smear frame)
  if (f === 37) return [-0.44, 0.12]; // overshoot
  return [-0.36, 0.1];
};

const mouthAt = (f: number): Mouth => {
  if (f < 44) return 'rest';
  if (f < 46) return 'M';
  if (f < 49) return 'E';
  if (f < 52) return 'A';
  if (f < 55) return 'O';
  if (f < 58) return 'E';
  if (f < 64) return 'rest';
  return 'smile';
};

export const flickerAt = (f: number) => {
  const dip: Record<number, number> = {27: 0.62, 28: 0.8, 29: 0.93, 58: 1.3, 59: 1.18, 60: 1.08};
  return (dip[f] ?? 1) + 0.035 * Math.sin(f * 1.7) + 0.02 * Math.sin(f * 4.3);
};

export const AnimeMotion: React.FC = () => {
  const f = useCurrentFrame();
  const c = on2s(f);
  const light = flickerAt(f);
  const [lx, ly] = lookAt(f);
  const lid = blinkLid(f, f >= 44 && f < 58 ? 0.1 : 0.14);
  const tilt = tiltAt(c);
  const hx = hairSpring(c);
  const brow = interpolate(c, [42, 50, 62, 70], [0, 0.35, 0.35, 0.15], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // slow camera push (T.U.) on 1s; BG moves less than the character (parallax)
  const push = interpolate(f, [0, 71], [1, 1.04], {easing: Easing.inOut(Easing.sin)});
  const bgPush = 1 + (push - 1) * 0.45;
  return (
    <AbsoluteFill style={{background: '#0A0C1E'}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <defs>
          <DiffusionDefs id="mo-diff" blur={16} />
        </defs>
        <g id="mo-scene">
        <g transform={`translate(960 470) scale(${bgPush}) translate(-960 -470)`}>
          <g transform="translate(1400 560) scale(1.5) translate(-1400 -560)">
            <RoomBack flicker={light} blur={4} t={f} />
          </g>
        </g>
        <g transform={`translate(860 470) scale(${push}) translate(-860 -470)`}>
          <g transform="translate(780 500) scale(1.36)">
            <AnimeMas uid="mo-mas" lookX={lx} lookY={ly} lid={lid} mouth={mouthAt(c)} brow={brow} tilt={tilt} hairX={hx} hairY={Math.abs(hx) * 0.15} light={light} ink={0.72} />
          </g>
        </g>
        <g transform={`translate(960 470) scale(${bgPush}) translate(-960 -470)`}>
          <g transform="translate(1400 560) scale(1.5) translate(-1400 -560)">
            <RoomFront flicker={light} t={f} uiScroll={f * 0.0016} />
          </g>
        </g>
        <Motes t={f} n={34} region={[900, 80, 800, 900]} seed={9} scale={1.6} />
        <g transform="translate(-60 40) scale(1.2)">
          <ForegroundBlur />
        </g>
        </g>
        <use href="#mo-scene" filter="url(#mo-diff)" opacity={0.28 * Math.min(1.25, light)} style={{mixBlendMode: 'screen'}} />
      </svg>
      <AnimeGrade seed={1 + Math.floor(f / 2)} />
    </AbsoluteFill>
  );
};
