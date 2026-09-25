import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, PH, W, ell, rr} from './core';
import {Mottle, Scope, ShapeDefs} from './fx';
import {MasBust, MasSeated} from './mas';
import {NoleFront, NoleProfile} from './nole';
import {SceneAt, ShotMasCU} from './scene';
import {FONT} from '../../shared/theme/fonts';

const Label: React.FC<{x: number; y: number; children: React.ReactNode; color?: string; size?: number; anchor?: 'start' | 'middle' | 'end'}> = ({x, y, children, color = C.creamDim, size = 22, anchor = 'middle'}) => (
  <text x={x} y={y} fontFamily={FONT.bass} fontWeight={500} fontSize={size} letterSpacing={size * 0.28} fill={color} textAnchor={anchor}>
    {children}
  </text>
);

/** Construction overlay: thin cream guides, the way a model sheet shows the underlying shapes. */
const Guide: React.FC<{d: string}> = ({d}) => <path d={d} fill="none" stroke={C.cream} strokeWidth={2} strokeDasharray="10 8" opacity={0.55} />;

// ------------------------------------------------------------------ LINEUP / SHAPE LANGUAGE
export const ExtraLineup: React.FC = () => (
  <Scope grainSeed={4} slate="MR. MAS — SHAPE LANGUAGE — MODEL SHEET 01">
    <svg width={W} height={PH} viewBox={`0 0 ${W} ${PH}`}>
      <ShapeDefs seed={2} />
      <rect width={W} height={PH} fill={C.night1} />
      {/* two light fields: the whole show in one diptych */}
      <rect x={0} y={0} width={W / 2} height={PH} fill={C.cy0} />
      <rect x={W / 2} y={0} width={W / 2} height={PH} fill={C.rd0} />
      <path d={ell(470, 470, 380, 380)} fill={C.cy1} opacity={0.35} filter="url(#sh-dryr)" />
      <path d={ell(1450, 420, 420, 420)} fill={C.rd1} opacity={0.55} filter="url(#sh-dryr)" />

      {/* MAS: egg on a monolith */}
      <g transform="translate(300 560) scale(0.95)" filter="url(#sh-edge)">
        <MasSeated id="L-ms" light={{cy: 1, rd: 0.4}} f={0} typing={0} />
      </g>
      <g transform="translate(640 250) scale(0.56)" filter="url(#sh-edge)">
        <MasBust id="L-mb" light={{cy: 1, rd: 0.5}} yaw={-0.12} />
      </g>
      <rect x={0} y={690} width={W} height={PH - 690} fill={C.night0} />
      <g transform="translate(640 250) scale(0.56)">
        <Guide d={ell(0, -24, 138, 156)} />
        <Guide d="M -236 700 L -214 330 Q -150 250 0 236 Q 150 250 214 330 L 236 700" />
      </g>
      <g transform="translate(300 560) scale(0.95)">
        <Guide d={ell(-2, -236, 64, 70)} />
        <Guide d="M -52 8 L -48 -150 Q 0 -196 54 -150 L 58 8 Z" />
      </g>

      {/* NOLE: wedge + chin block */}
      <g transform="translate(1180 690) scale(0.8)" filter="url(#sh-edge)">
        <NoleProfile id="L-np" light={{rd: 1, cy: 0.6, phone: 0.4}} lean={2} head={-4} sh={24} el={70} />
      </g>
      <g transform="translate(1180 690) scale(0.8)">
        <Guide d="M -46 -294 L 48 -294 L 162 -620 L -236 -640 Z" />
        <Guide d={rr(-230, -770, 150, 62, 4)} />
      </g>
      <g transform="translate(1620 690) scale(0.76)" filter="url(#sh-edge)">
        <NoleFront id="L-nf" light={{rd: 1, cy: 0, phone: 0.6}} />
      </g>
      <g transform="translate(1620 690) scale(0.76)">
        <Guide d="M -58 -324 L 58 -324 L 236 -660 L -236 -660 Z" />
        <Guide d={rr(-76, -776, 152, 92, 4)} />
      </g>

      <Label x={450} y={745} color={C.cy3}>MAS — SOFT OVALS · A CALM MONOLITH</Label>
      <Label x={1440} y={745} color={C.rd3}>NOLE — INVERTED WEDGE · CHIN OVER SKULL</Label>
      <Label x={450} y={778} size={16}>HEAD 1 : BODY 1.4 · FEATURES SLIDE ON THE EGG</Label>
      <Label x={1440} y={778} size={16}>SHOULDERS 3.5 × WAIST · NUTCRACKER JAW DROPS TO TALK</Label>
      <Mottle />
    </svg>
  </Scope>
);

// ------------------------------------------------------------------ MAS TURN / EXPRESSION SHEET
const TURNS: {yaw: number; lookX: number; blink?: number; smile?: number; mouth?: 'rest' | 's' | 'oo' | 'p' | 'er'; rd: number; label: string}[] = [
  {yaw: -0.35, lookX: -0.4, rd: 0.3, label: '−20°  AT THE SCREEN'},
  {yaw: -0.05, lookX: 0, rd: 0.4, label: '0°  UNREADABLE'},
  {yaw: 0.3, lookX: 0.9, rd: 0.8, label: '+17°  EYES LEAD'},
  {yaw: 0.6, lookX: 0.6, blink: 1, rd: 0.9, label: '+34°  ONE BLINK'},
  {yaw: 0.6, lookX: 0.55, smile: 1, mouth: 's', rd: 0.9, label: '“super.”'},
];

export const ExtraMasCU: React.FC = () => (
  <Scope grainSeed={5} slate="MAS — TURN ON THE EGG · LIGHT AS OFFSET">
    <svg width={W} height={PH} viewBox={`0 0 ${W} ${PH}`}>
      <ShapeDefs seed={3} />
      <rect width={W} height={PH} fill={C.night0} />
      {TURNS.map((t, i) => {
        const x = 200 + i * 380;
        return (
          <g key={i}>
            <rect x={x - 190} y={0} width={380} height={PH} fill={i % 2 ? C.night0 : C.night1} />
            <path d={ell(x, 330, 170, 170)} fill={C.cy0} opacity={0.9} filter="url(#sh-dryr)" />
            <rect x={x + 120} y={0} width={70} height={PH} fill={C.rd1} opacity={0.35 + 0.5 * t.rd} />
            <g transform={`translate(${x} 330) scale(0.84)`} filter="url(#sh-edge)">
              <MasBust id={`T-${i}`} light={{cy: 1, rd: t.rd}} yaw={t.yaw} lookX={t.lookX} lookY={i >= 2 ? -0.3 : 0} blink={t.blink} smile={t.smile} mouth={t.mouth} />
            </g>
            <rect x={x - 190} y={700} width={380} height={PH - 700} fill={C.void} />
            <Label x={x} y={758} color={i >= 3 ? C.rd3 : C.cy3} size={20}>
              {t.label}
            </Label>
          </g>
        );
      })}
      <Mottle />
    </svg>
  </Scope>
);

// ------------------------------------------------------------------ SPARING STYLE SWITCHES
/**
 * The structure is flat VALUE FIELDS (every fill is one of ~4 steps), so a switch is a screen at the
 * compositor: a line screen reads as banknote engraving (money flashbacks), an ordered dither reads as a
 * 1-bit terminal (1993 / AI moments). Same rig, same animation, one wrapper.
 */
const bayer = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8' shape-rendering='crispEdges'>${[
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ]
    .map((row, y) => row.map((v, x) => `<rect x='${x * 2}' y='${y * 2}' width='2' height='2' fill='rgb(${Math.round((v / 16) * 255)},${Math.round((v / 16) * 255)},${Math.round((v / 16) * 255)})'/>`).join(''))
    .join('')}</svg>`,
)}")`;

export type Treatment = 'native' | 'engrave' | 'onebit';

export const Treat: React.FC<{mode: Treatment; children: React.ReactNode}> = ({mode, children}) => {
  if (mode === 'native') return <>{children}</>;
  const screen =
    mode === 'engrave'
      ? {backgroundImage: 'repeating-linear-gradient(-8deg, #000 0px, #fff 3.5px, #000 7px)', mixBlendMode: 'overlay' as const}
      : {backgroundImage: bayer, backgroundSize: '8px 8px', mixBlendMode: 'overlay' as const, imageRendering: 'pixelated' as const};
  // black/white after the screen; then re-ink: multiply = "white becomes paper", screen = "black becomes ink"
  const hi = mode === 'engrave' ? '#ebe2c8' : '#8dff9a';
  const lo = mode === 'engrave' ? '#1d3a2b' : '#07120b';
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{filter: `grayscale(1) brightness(${mode === 'engrave' ? 1.3 : 1.5}) contrast(${mode === 'engrave' ? 9 : 14})`}}>
        {children}
        <AbsoluteFill style={screen} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: hi, mixBlendMode: 'multiply'}} />
      <AbsoluteFill style={{background: lo, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

export const ExtraSwitch: React.FC = () => {
  const panel = (mode: Treatment, label: string, i: number) => (
    <div key={mode} style={{position: 'absolute', left: i * 640, top: 0, width: 640, height: 804, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: -380, top: 0, width: W, height: PH, transform: 'scale(1)', transformOrigin: '0 0'}}>
        <Treat mode={mode}>
          <ShotMasCU f={92} />
        </Treat>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 24, textAlign: 'center'}}>
        <span style={{fontFamily: FONT.bass, fontSize: 22, letterSpacing: '0.3em', color: C.cream, background: C.void, padding: '8px 16px'}}>{label}</span>
      </div>
      <div style={{position: 'absolute', top: 0, bottom: 0, right: 0, width: 4, background: C.void}} />
    </div>
  );
  return (
    <Scope grainSeed={6} slate="SPARING SWITCHES — SAME RIG, ONE SCREEN AT THE COMPOSITOR">
      <div style={{position: 'absolute', inset: 0}}>
        {panel('native', 'SHOW', 0)}
        {panel('engrave', 'MONEY FLASHBACK', 1)}
        {panel('onebit', '1993 / THE MODEL', 2)}
      </div>
    </Scope>
  );
};

export const KeyFrame: React.FC<{f: number}> = ({f}) => <SceneAt f={f} />;
