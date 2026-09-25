/**
 * The comic PAGE renderer (builder: comic): paper, panels printed plate-by-plate (with print-in reveals
 * and blue-line pencils before a panel "prints"), hand-inked panel borders, lettering overlays, and the
 * guided-view camera.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PrintDefs, PlateGroup, PAPER, INKS, Plate} from './print';
import {PANELS, PAGE, PanelDef, PanelId, camAt, Cam, misreg, jolt} from './script';
import {clamp, easeOut, hash} from './geo';
import {ART} from './panels';
import {Overlays} from './Overlays';

export interface ArtProps {
  /** scene frame */
  f: number;
  /** panel size */
  w: number;
  h: number;
  /** camera offset from the panel centre, in panel sizes (drives internal parallax) */
  px: number;
  py: number;
  /** camera zoom (for line weights that must stay visible) */
  z: number;
  /** page-units screen-shake currently applied (so an object can hold still) */
  shake: [number, number];
}

const f1 = (n: number) => (Math.round(n * 100) / 100).toString();

const wobblyRect = (x: number, y: number, w: number, h: number, seed: number) => {
  const j = (k: number) => (hash(seed * 17 + k) - 0.5) * 5;
  // hand-ruled: corners slightly off, edges slightly bowed
  return `M ${f1(x + j(1))} ${f1(y + j(2))} Q ${f1(x + w / 2)} ${f1(y + j(3) * 0.6)} ${f1(x + w + j(4))} ${f1(y + j(5))} Q ${f1(x + w + j(6) * 0.6)} ${f1(y + h / 2)} ${f1(x + w + j(7))} ${f1(y + h + j(8))} Q ${f1(x + w / 2)} ${f1(y + h + j(9) * 0.6)} ${f1(x + j(10))} ${f1(y + h + j(11))} Q ${f1(x + j(12) * 0.6)} ${f1(y + h / 2)} ${f1(x + j(1))} ${f1(y + j(2))} Z`;
};

const PanelView: React.FC<{p: PanelDef; f: number; cam: Cam; all: boolean; shake: [number, number]}> = ({p, f, cam, all, shake}) => {
  const Art = ART[p.id];
  const since = all ? 99 : f - p.printAt;
  const par = {px: (cam.cx - (p.x + p.w / 2)) / p.w, py: (cam.cy - (p.y + p.h / 2)) / p.h};
  const box: [number, number, number, number] = [p.x, p.y, p.w, p.h];
  const art = (
    <g transform={`translate(${p.x} ${p.y})`}>
      <Art f={f} w={p.w} h={p.h} px={par.px} py={par.py} z={cam.z} shake={shake} />
    </g>
  );
  if (since < 0) {
    // not printed yet: a faint blue-line proof of the pencils
    return (
      <g clipPath={`url(#clip-${p.id})`}>
        <PlateGroup plate="k" box={box} blue>
          {art}
        </PlateGroup>
      </g>
    );
  }
  // print-in: black plate stamps (2 frames), spot plates slap into register (5 frames)
  const kIn = clamp(since / 2 + 0.35);
  const sIn = easeOut(since / 5, 3);
  const plates: Plate[] = [...p.spots, 'k'];
  return (
    <g clipPath={`url(#clip-${p.id})`}>
      {since < 3 && (
        <PlateGroup plate="k" box={box} blue opacity={1 - since / 3}>
          {art}
        </PlateGroup>
      )}
      {plates.map((pl) => {
        const [mx, my] = misreg(pl, f, p.x * 0.01);
        const slide = pl === 'k' ? [0, 0] : pl === 'c' ? [(1 - sIn) * 30, (1 - sIn) * -18] : [(1 - sIn) * -26, (1 - sIn) * 20];
        return (
          <PlateGroup key={pl} plate={pl} box={box} dx={mx + slide[0]} dy={my + slide[1]} opacity={pl === 'k' ? kIn : clamp(since / 2 + 0.2)}>
            {art}
          </PlateGroup>
        );
      })}
    </g>
  );
};

export const ComicPage: React.FC<{frame: number; cam?: Cam; all?: boolean; noOverlays?: boolean; only?: PanelId[]; bg?: string}> = ({frame, cam: camIn, all = false, noOverlays = false, only, bg = '#0D0C10'}) => {
  const cam = camIn ?? camAt(frame);
  const j = jolt(frame);
  const shake: [number, number] = [j.x / cam.z, j.y / cam.z];
  const vw = 1920 / cam.z;
  const vh = 1080 / cam.z;
  const vx = cam.cx - shake[0] - vw / 2;
  const vy = cam.cy - shake[1] - vh / 2;
  const vis = PANELS.filter((p) => (!only || only.includes(p.id)) && p.x < vx + vw && p.x + p.w > vx && p.y < vy + vh && p.y + p.h > vy);
  const T = `translate(960 540) scale(${cam.z.toFixed(5)}) translate(${f1(-cam.cx + shake[0])} ${f1(-cam.cy + shake[1])})`;
  return (
    <AbsoluteFill style={{background: bg}}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        <PrintDefs uid="pg" />
        <defs>
          {PANELS.map((p) => (
            <clipPath key={p.id} id={`clip-${p.id}`}>
              <rect x={p.x} y={p.y} width={p.w} height={p.h} />
            </clipPath>
          ))}
          <filter id="paper-tex" x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.9 0.35" numOctaves={3} seed={11} result="fib" />
            <feTurbulence type="fractalNoise" baseFrequency="0.004" numOctaves={3} seed={4} result="mot" />
            <feColorMatrix in="fib" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.26  0 0 0 -0.9 0.62" result="fibA" />
            <feColorMatrix in="mot" type="matrix" values="0 0 0 0 0.62  0 0 0 0 0.5  0 0 0 0 0.3  0 0 0 -1.4 0.95" result="motA" />
            <feMerge>
              <feMergeNode in="motA" />
              <feMergeNode in="fibA" />
            </feMerge>
          </filter>
          <radialGradient id="page-vig" cx="0.5" cy="0.5" r="0.75">
            <stop offset="0.55" stopColor="#000" stopOpacity={0} />
            <stop offset="1" stopColor="#1a1208" stopOpacity={0.32} />
          </radialGradient>
        </defs>
        <g transform={T}>
          {/* the sheet */}
          <rect x={-8} y={10} width={PAGE.w + 16} height={PAGE.h + 6} fill="#000" opacity={0.45} />
          <rect x={0} y={0} width={PAGE.w} height={PAGE.h} fill={PAPER} />
          <rect x={0} y={0} width={PAGE.w} height={PAGE.h} filter="url(#paper-tex)" opacity={0.2} style={{mixBlendMode: 'multiply'}} />
          {vis.map((p) => (
            <PanelView key={p.id} p={p} f={frame} cam={cam} all={all} shake={shake} />
          ))}
          {/* hand-inked panel borders */}
          <g filter="url(#pg-rough)">
            {vis.map((p) => {
              const printed = all || frame >= p.printAt;
              return <path key={p.id} d={wobblyRect(p.x, p.y, p.w, p.h, p.x + p.y)} fill="none" stroke={printed ? INKS.k : '#8FB7D8'} strokeWidth={printed ? 8 : 4} strokeLinejoin="round" opacity={printed ? 1 : 0.7} />;
            })}
          </g>
          {!noOverlays && <Overlays f={frame} all={all} shake={shake} />}
          {/* folio + credit in the margin, like a printed album page */}
          <g opacity={0.7}>
            <text x={PAGE.w / 2} y={PAGE.h - 70} textAnchor="middle" fontFamily="Oswald, sans-serif" fontSize={34} letterSpacing={6} fill={INKS.k}>
              MR. MAS · CHAPTER ONE · 7
            </text>
          </g>
        </g>
        <rect width={1920} height={1080} fill="url(#page-vig)" />
      </svg>
    </AbsoluteFill>
  );
};
