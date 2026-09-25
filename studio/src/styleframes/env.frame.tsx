import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, Easing} from 'remotion';
import type {FrameDef} from '../shared/frame-def';
import {Grain, Vignette} from '../shared/fx/Grain';
import {TONE_STYLES} from '../shared/tonal/styles';
import {coldOpen, monitorScreen, orb, ColdOpenParams} from '../shared/tonal/env';
import {EnvView, EnvStyle, ENV_STYLE_LABEL, envBg} from '../shared/tonal/env/EnvView';
import type {ToneModel} from '../shared/tonal/types';

const GRID: EnvStyle[] = ['paint', 'soft', 'noir', 'riso', 'engrave', 'glyph', 'pixel', 'dither', 'value'];
const grainOf = (s: EnvStyle) => (s === 'value' ? 0 : s === 'soft' ? 0.05 : s === 'pixel' ? 0 : (TONE_STYLES as Record<string, {grain: number}>)[s]?.grain ?? 0.04);
const darkLabel = (s: EnvStyle) => !(s === 'noir' || s === 'riso' || s === 'engrave' || s === 'stipple');

const Label: React.FC<{text: string; dark: boolean; size?: number}> = ({text, dark, size = 15}) => (
  <div style={{position: 'absolute', left: 10, bottom: 8, fontFamily: 'JetBrains Mono', fontSize: size, letterSpacing: 0.5, color: dark ? '#BFEFF7' : '#1A1A1A', background: dark ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.6)', padding: '2px 7px'}}>{text}</div>
);

const Panel: React.FC<{model: ToneModel; style: EnvStyle; w: number; h: number; view?: [number, number, number, number]; uid: string; label?: string}> = ({model, style, w, h, view, uid, label}) => (
  <div style={{width: w, height: h, position: 'relative', overflow: 'hidden', background: envBg(style)}}>
    <EnvView model={model} style={style} width={w} height={h} view={view} uid={uid} />
    <Grain amount={grainOf(style)} seed={3} />
    {label !== '' && <Label text={label ?? ENV_STYLE_LABEL[style]} dark={darkLabel(style)} />}
  </div>
);

const Grid: React.FC<{model: ToneModel; view?: [number, number, number, number]; tag: string}> = ({model, view, tag}) => (
  <AbsoluteFill style={{background: '#000', flexDirection: 'row', flexWrap: 'wrap'}}>
    {GRID.map((s) => (
      <Panel key={s} model={model} style={s} w={640} h={360} view={view} uid={`${tag}-${s}`} />
    ))}
  </AbsoluteFill>
);

const LOOK: ColdOpenParams = {room: {glow: 1, t: 0.4}, orb: {iris: 0.55, gazeX: -0.62, gazeY: 0.28, glow: 0.8}};
const MAS = {lookX: 0.45, lookY: 0.05, lid: 0.18, mouth: 'rest' as const, brow: 0.05};

const SetGrid: React.FC = () => <Grid model={coldOpen({...LOOK, mas: false})} tag="set" />;
const SetGridMas: React.FC = () => <Grid model={coldOpen({...LOOK, mas: MAS})} tag="setm" />;

const Full: React.FC<{style: EnvStyle; mas?: boolean; grade?: boolean}> = ({style, mas = false, grade = false}) => (
  <AbsoluteFill style={{background: envBg(style)}}>
    <EnvView model={coldOpen({...LOOK, mas: mas ? MAS : false})} style={style} width={1920} height={1080} uid={`full-${style}`} grade={grade} />
    {style !== 'pixel' && style !== 'dither' && style !== 'glyph' && <Vignette amount={0.35} />}
    <Grain amount={grainOf(style)} seed={5} />
  </AbsoluteFill>
);

// ---------------- orb model sheet ----------------
const OrbSheet: React.FC<{style?: EnvStyle}> = ({style = 'paint'}) => {
  const cell = (label: string, p: Parameters<typeof orb>[0], key: string, st: EnvStyle = style) => (
    <div key={key} style={{width: 320, height: 540, position: 'relative', background: st === 'noir' ? envBg('noir') : '#131826'}}>
      <EnvView model={{...orb(p), box: [-120, -205, 240, 405]}} style={st} width={320} height={540} uid={`orb-${key}`} />
      <Label text={label} dark={st !== 'noir'} size={13} />
    </div>
  );
  return (
    <AbsoluteFill style={{background: '#000', flexDirection: 'row', flexWrap: 'wrap'}}>
      {cell('iris 0.0', {iris: 0, gazeX: 0, gazeY: 0}, 'i0')}
      {cell('iris 0.35', {iris: 0.35, gazeX: 0, gazeY: 0}, 'i1')}
      {cell('iris 0.7', {iris: 0.7, gazeX: 0, gazeY: 0}, 'i2')}
      {cell('iris 1.0', {iris: 1, gazeX: 0, gazeY: 0}, 'i3')}
      {cell('glow 0 (asleep)', {iris: 0.2, gazeX: 0, gazeY: 0.5, glow: 0}, 'g0')}
      {cell('glow 1', {iris: 0.6, gazeX: 0, gazeY: 0, glow: 1}, 'g1')}
      {cell('gaze -> Mas', {iris: 0.5, gazeX: -0.62, gazeY: 0.28}, 'z0')}
      {cell('gaze camera', {iris: 0.5, gazeX: -0.05, gazeY: 0.02}, 'z1')}
      {cell('gaze monitor', {iris: 0.5, gazeX: 0.9, gazeY: 0.25}, 'z2')}
      {cell('gaze up', {iris: 0.5, gazeX: 0.1, gazeY: -0.85}, 'z3')}
      {cell('noir', {iris: 0.5, gazeX: -0.62, gazeY: 0.28}, 'n0', 'noir')}
      {cell('pixel', {iris: 0.5, gazeX: -0.62, gazeY: 0.28}, 'p0', 'pixel')}
    </AbsoluteFill>
  );
};

// ---------------- monitor screen insert ----------------
const ScreenFull: React.FC<{style: EnvStyle}> = ({style}) => (
  <AbsoluteFill style={{background: envBg(style)}}>
    <EnvView model={monitorScreen()} style={style} width={1920} height={1080} uid={`scr-${style}`} />
    <Grain amount={grainOf(style)} seed={9} />
  </AbsoluteFill>
);
const ScreenGrid: React.FC = () => <Grid model={monitorScreen()} tag="scr" />;

// ---------------- 3 s motion test ----------------
const Motion: React.FC<{style: EnvStyle}> = ({style}) => {
  const f = useCurrentFrame();
  const t = f / 24;
  const ease = Easing.inOut(Easing.cubic);
  const camX = interpolate(f, [0, 71], [-4, 5], {easing: ease});
  const zoom = interpolate(f, [0, 71], [1, 1.035], {easing: ease});
  // monitor flicker: a tiny dip on frame 30-33 (posterized pools snap smaller)
  const glow = f >= 30 && f <= 32 ? 0.55 : f === 33 ? 0.8 : 1;
  // orb: looks at Mas, notices camera, dilates, looks back
  const gazeX = interpolate(f, [0, 20, 30, 50, 62], [-0.62, -0.62, -0.05, -0.05, -0.62], {easing: ease, extrapolateRight: 'clamp'});
  const gazeY = interpolate(f, [0, 20, 30, 50, 62], [0.28, 0.28, 0.0, 0.0, 0.28], {easing: ease, extrapolateRight: 'clamp'});
  const iris = interpolate(f, [0, 30, 36, 50, 60], [0.45, 0.45, 0.85, 0.85, 0.4], {easing: ease, extrapolateRight: 'clamp'});
  const bob = Math.sin(t * Math.PI * 1.2) * 6;
  const blink = f >= 40 && f <= 43 ? [0.6, 1, 1, 0.5][f - 40] : 0.18;
  const lookX = interpolate(f, [0, 34, 40, 72], [0.45, 0.45, -0.1, -0.1], {extrapolateRight: 'clamp'});
  const model = coldOpen({room: {camX, zoom, glow, t}, orb: {iris, gazeX, gazeY, glow: 0.8, spin: f > 30 ? 6 : 0}, orbAt: {x: 820, y: 330 + bob}, mas: {...MAS, lookX, lid: blink}});
  return (
    <AbsoluteFill style={{background: envBg(style)}}>
      <EnvView key={style === 'glyph' || style === 'pixel' || style === 'dither' ? f : 'v'} model={model} style={style} width={1920} height={1080} uid={`mo-${style}`} boil={1 + Math.floor(f / 3)} />
      {style !== 'pixel' && style !== 'dither' && style !== 'glyph' && <Vignette amount={0.35} />}
      <Grain amount={grainOf(style)} seed={1 + Math.floor(f / 2)} />
    </AbsoluteFill>
  );
};

const FULL_STYLES: EnvStyle[] = ['paint', 'soft', 'softenv', 'noir', 'riso', 'engrave', 'glyph', 'pixel', 'dither', 'value'];

export const frames: FrameDef[] = [
  {id: 'env-tone-test', component: SetGrid},
  {id: 'env-tone-test-mas', component: SetGridMas},
  ...FULL_STYLES.map((s) => ({id: `env-set-${s}`, component: Full, props: {style: s}})),
  ...FULL_STYLES.map((s) => ({id: `env-mas-${s}`, component: Full, props: {style: s, mas: true}})),
  {id: 'env-set-glyph-graded', component: Full, props: {style: 'glyph', grade: true}},
  {id: 'env-orb-sheet', component: OrbSheet},
  {id: 'env-screen-paint', component: ScreenFull, props: {style: 'paint'}},
  {id: 'env-screen-noir', component: ScreenFull, props: {style: 'noir'}},
  {id: 'env-screen-tone-test', component: ScreenGrid},
  {id: 'env-motion-paint', component: Motion, props: {style: 'paint'}, durationInFrames: 72},
  {id: 'env-motion-soft', component: Motion, props: {style: 'soft'}, durationInFrames: 72},
  {id: 'env-motion-glyph', component: Motion, props: {style: 'glyph'}, durationInFrames: 72},
  {id: 'env-motion-noir', component: Motion, props: {style: 'noir'}, durationInFrames: 72},
  {id: 'env-motion-pixel', component: Motion, props: {style: 'pixel'}, durationInFrames: 72},
];
