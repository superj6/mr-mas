import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import type {FrameDef} from '../shared/frame-def';
import type {ToneModel} from '../shared/tonal/types';
import {noleTone, NoleToneParams} from '../shared/tonal/noleTone';
import {masTone} from '../shared/tonal/masTone';
import {ToneSvg} from '../shared/tonal/ToneSvg';
import {ToneCanvas} from '../shared/tonal/ToneCanvas';
import {TONE_STYLES, ToneStyle, ToneStyleId} from '../shared/tonal/styles';
import {Grain, Vignette} from '../shared/fx/Grain';
import {mix} from '../shared/theme/color';

/**
 * NOLE tonal rig lookdev (pattern copied from tonetest.frame.tsx, not imported):
 *  - nole-tone-test        1920x1080 grid: 9 styles + legend (smirk, the persona default)
 *  - nole-hero-<style>     1920x1080 single-style still
 *  - nole-expressions      replacement mouths / looks in soft + noir
 *  - nole-lineup           scale check next to MAS (same local units)
 *  - nole-motion           3 s paint | noir side by side
 *  - nole-motion-<style>   3 s single-style motion test
 *  - nole-big              1080 close-up, props {style, params}
 */
const ORDER: ToneStyleId[] = ['soft', 'paint', 'noir', 'riso', 'engrave', 'glyph', 'pixel', 'dither', 'stipple'];
const RASTER = new Set<ToneStyleId>(['glyph', 'pixel', 'dither', 'stipple']);
const DARK = new Set<ToneStyleId>(['soft', 'paint', 'glyph', 'pixel']);
const PERSONA: NoleToneParams = {lookX: 0.3, mouth: 'smirk', brow: 0.15};

/** Fit a box into a panel; extra height goes ABOVE the box so the view never shows past the bust crop. */
const fitView = (box: [number, number, number, number], w: number, h: number): [number, number, number, number] => {
  const [x, y, bw, bh] = box;
  const a = w / h;
  if (bw / bh > a) {
    const nh = bw / a;
    return [x, y - (nh - bh), bw, nh];
  }
  const nw = bh * a;
  return [x - (nw - bw) / 2, y, nw, bh];
};

/** Backdrop per style. Dark side of the figure (screen-left) sits against the lighter part of the room. */
const backdrop = (id: ToneStyleId, s: ToneStyle): string => {
  switch (id) {
    case 'soft':
      return `radial-gradient(ellipse 70% 80% at 92% 38%, ${mix(s.spot, '#0E1219', 0.8)} 0%, #0E1219 55%, #06080B 100%)`;
    case 'paint':
      return `radial-gradient(ellipse 60% 70% at 22% 40%, #22303C 0%, #111620 60%, #0A0D13 100%)`;
    case 'glyph':
      return '#000000';
    case 'pixel':
      return '#0B0D14';
    default:
      return s.paper;
  }
};

const pixelUnderlay = (spot: string) => (ctx: CanvasRenderingContext2D) => {
  const g = ctx.createRadialGradient(560, -40, 20, 560, -40, 800);
  g.addColorStop(0, mix(spot, '#0B0D14', 0.45));
  g.addColorStop(0.45, mix(spot, '#0B0D14', 0.82));
  g.addColorStop(1, '#090B11');
  ctx.fillStyle = g;
  ctx.fillRect(-2000, -2000, 4000, 4000);
};

const StyleView: React.FC<{id: ToneStyleId; model: ToneModel; w: number; h: number; view: [number, number, number, number]; s: ToneStyle; scale: number; boil?: number; seed?: number; transform?: string}> = ({
  id,
  model,
  w,
  h,
  view,
  s,
  scale,
  boil = 1,
  seed = 3,
  transform,
}) => {
  if (RASTER.has(id)) {
    const cell =
      id === 'glyph' ? Math.max(5, Math.round(scale * 5.4)) : id === 'pixel' ? Math.max(3, Math.round(scale * 3.7)) : id === 'dither' ? Math.max(2, Math.round(scale * 2.2)) : Math.max(2.4, scale * 4.2);
    return (
      <ToneCanvas
        model={model}
        mode={id as 'glyph'}
        style={s}
        width={w}
        height={h}
        view={view}
        cell={cell}
        seed={seed}
        background={id === 'pixel' ? '#0B0D14' : id === 'glyph' ? '#000000' : s.paper}
        underlay={id === 'pixel' ? pixelUnderlay(s.spot) : undefined}
        noise={id === 'glyph' ? 0.12 : 0}
      />
    );
  }
  return (
    <svg width={w} height={h} viewBox={view.join(' ')} style={{position: 'absolute', left: 0, top: 0}}>
      <ToneSvg model={model} style={s} uid={`nole-${id}`} boil={boil} transform={transform} />
    </svg>
  );
};

const Label: React.FC<{text: string; dark: boolean; size?: number}> = ({text, dark, size = 14}) => (
  <div
    style={{
      position: 'absolute',
      left: 10,
      bottom: 10,
      fontFamily: 'JetBrains Mono',
      fontSize: size,
      letterSpacing: 0.5,
      padding: '3px 7px',
      color: dark ? '#CFE9F0' : '#1A1A1A',
      background: dark ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.6)',
    }}
  >
    {text}
  </div>
);

// ------------------------------------------------------------------------------------------------ grid
const PW = 384;
const PH = 540;
const NOLE_BOX: [number, number, number, number] = [-370, -350, 740, 910];
const Panel: React.FC<{id: ToneStyleId}> = ({id}) => {
  const model = noleTone(PERSONA);
  const view = fitView(NOLE_BOX, PW, PH);
  const s = TONE_STYLES[id];
  const dark = DARK.has(id);
  return (
    <div style={{width: PW, height: PH, position: 'relative', background: backdrop(id, s), overflow: 'hidden', boxShadow: 'inset 0 0 0 1px #000'}}>
      <StyleView id={id} model={model} w={PW} h={PH} view={view} s={s} scale={PW / view[2]} />
      {dark && id !== 'glyph' && <Vignette amount={0.35} />}
      <Grain amount={s.grain} />
      <Label text={s.label} dark={dark} />
    </div>
  );
};

const Legend: React.FC = () => (
  <div style={{width: PW, height: PH, position: 'relative', background: '#0A0B0F', color: '#D8DEE6', fontFamily: 'JetBrains Mono', padding: 26, boxSizing: 'border-box', boxShadow: 'inset 0 0 0 1px #000'}}>
    <div style={{fontFamily: 'Oswald', fontWeight: 600, fontSize: 40, letterSpacing: 2, color: '#FFFFFF'}}>NOLE</div>
    <div style={{fontSize: 13, color: '#7FD9E6', marginTop: 4, letterSpacing: 1}}>TONAL RIG · MR. MAS</div>
    <div style={{fontSize: 12.5, lineHeight: 1.65, marginTop: 22, color: '#AEB7C4'}}>
      caricature: square forward jaw,
      <br />
      swept-back volume. prop: phone.
      <br />
      shoulders 1.25x Mas, head 1.08x.
      <br />
      <br />
      <span style={{color: '#fff'}}>params</span> lookX lookY lid brow tilt
      <br />
      mouth rest · smirk · grin · open
      <br />
      phone · phoneLift · print
      <br />
      <br />
      key: monitor, screen-right
      <br />
      fill: phone screen, chest height
    </div>
  </div>
);

const NoleToneTest: React.FC = () => (
  <AbsoluteFill style={{background: '#000', flexDirection: 'row', flexWrap: 'wrap'}}>
    {ORDER.map((id) => (
      <Panel key={id} id={id} />
    ))}
    <Legend />
  </AbsoluteFill>
);

// ------------------------------------------------------------------------------------------------ hero
const HERO_VIEW: [number, number, number, number] = (() => {
  const h = 860; // hair top .. mid-chest (phone in frame)
  const w = (h * 1920) / 1080;
  return [-w * 0.46, -340, w, h];
})();

const Hero: React.FC<{id: ToneStyleId; params?: NoleToneParams; spot?: string; push?: number; boil?: number; seed?: number; breathe?: number; tag?: string}> = ({
  id,
  params,
  spot,
  push = 0,
  boil = 1,
  seed,
  breathe = 0,
  tag,
}) => {
  const base = TONE_STYLES[id];
  const s = spot ? {...base, spot} : base;
  const model = noleTone(params ?? PERSONA);
  const k = 1 + push;
  const [x, y, w, h] = HERO_VIEW;
  const view: [number, number, number, number] = [x + (w - w / k) * 0.5, y + (h - h / k) * 0.3, w / k, h / k];
  const dark = DARK.has(id);
  return (
    <AbsoluteFill style={{background: backdrop(id, s)}}>
      <StyleView id={id} model={model} w={1920} h={1080} view={view} s={s} scale={1920 / view[2]} boil={boil} seed={seed} transform={breathe ? `translate(0 ${breathe.toFixed(2)})` : undefined} />
      {dark && id !== 'glyph' && <Vignette amount={0.45} />}
      <Grain amount={s.grain} seed={boil} />
      <div style={{position: 'absolute', right: 34, bottom: 26, fontFamily: 'JetBrains Mono', fontSize: 18, letterSpacing: 1, color: dark ? 'rgba(210,235,240,0.55)' : 'rgba(20,20,20,0.55)'}}>
        NOLE · {s.label.toUpperCase()}
        {tag ? ` · ${tag}` : ''}
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------ motion
/**
 * 72 f @ 24 fps, everything on twos (limited 2D):
 * smirk -> laugh (grin/open/grin replacement mouths) -> blink + eye dart to camera -> looks down at the
 * phone as it lifts; head tilt on the neck pivot; breathing; monitor flicker on the key; boil; slow push-in.
 */
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const motionParams = (frame: number): {params: NoleToneParams; dim: number; breathe: number} => {
  const f2 = Math.floor(frame / 2) * 2;
  const ease = Easing.inOut(Easing.cubic);
  const k = (pts: [number, number][]) => interpolate(f2, pts.map((q) => q[0]), pts.map((q) => q[1]), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const mouth: NoleToneParams['mouth'] = f2 < 8 ? 'rest' : f2 < 34 ? 'smirk' : f2 < 38 ? 'grin' : f2 < 42 ? 'open' : f2 < 46 ? 'grin' : 'rest';
  const blink = [18, 20].includes(f2) ? 1 : f2 === 22 ? 0.55 : f2 === 30 ? 1 : f2 === 32 ? 0.6 : 0;
  const params: NoleToneParams = {
    mouth,
    lookX: k([[0, 0.3], [30, 0.3], [32, -0.3], [44, -0.3], [48, 0.45], [72, 0.45]]),
    lookY: k([[0, 0.05], [44, 0.05], [48, 1], [72, 1]]),
    lid: Math.max(blink, k([[0, 0.22], [34, 0.22], [36, 0.34], [44, 0.34], [50, 0.46], [72, 0.46]])),
    brow: k([[0, 0.1], [8, 0.2], [32, 0.2], [36, 0.45], [44, 0.45], [52, -0.45], [72, -0.45]]),
    tilt: k([[0, 0], [30, -1.5], [36, 2.5], [44, 1.5], [54, 4.5], [72, 5]]),
    phoneLift: k([[0, 0], [44, 0], [58, 24], [72, 28]]),
  };
  const dim = hash(frame) > 0.86 ? 0.35 : [13, 14, 53].includes(frame) ? 0.5 : 0;
  const breathe = Math.sin((f2 / 72) * Math.PI * 2) * 2;
  return {params, dim, breathe};
};

const MotionOne: React.FC<{id: ToneStyleId}> = ({id}) => {
  const frame = useCurrentFrame();
  const {params, dim, breathe} = motionParams(frame);
  const f2 = Math.floor(frame / 2) * 2;
  const spot = mix(TONE_STYLES[id].spot, '#0C3440', dim);
  return <Hero id={id} params={params} spot={spot} push={0.04 * (frame / 71)} boil={1 + Math.floor(f2 / 6)} seed={3 + Math.floor(f2 / 4)} breathe={breathe} tag={`f${String(frame).padStart(2, '0')} ${params.mouth}`} />;
};

const NoleMotion: React.FC = () => {
  const frame = useCurrentFrame();
  const {params, dim, breathe} = motionParams(frame);
  const model = noleTone(params);
  const push = interpolate(frame, [0, 71], [1, 1.045]);
  const panel = (id: 'paint' | 'noir') => {
    const base = TONE_STYLES[id];
    const st: ToneStyle = {...base, spot: mix(base.spot, '#0C3440', dim)};
    const view = fitView(NOLE_BOX, 960, 1080);
    const cx = view[0] + view[2] / 2;
    const cy = view[1] + view[3] * 0.4;
    return (
      <div key={id} style={{width: 960, height: 1080, position: 'relative', background: backdrop(id, st), overflow: 'hidden'}}>
        <svg width={960} height={1080} viewBox={view.join(' ')} style={{display: 'block'}}>
          <g transform={`translate(${cx} ${cy}) scale(${push}) translate(${-cx} ${-cy})`}>
            <ToneSvg model={model} style={st} uid={`mo-${id}`} transform={`translate(0 ${breathe.toFixed(2)})`} />
          </g>
        </svg>
        {id === 'paint' && <Vignette amount={0.4} />}
        <Grain amount={base.grain} seed={1 + Math.floor(frame / 2)} />
        <Label text={`NOLE · ${base.label} · f${String(frame).padStart(2, '0')} ${params.mouth}`} dark={id === 'paint'} size={18} />
      </div>
    );
  };
  return <AbsoluteFill style={{background: '#000', flexDirection: 'row'}}>{[panel('paint'), panel('noir')]}</AbsoluteFill>;
};

// ------------------------------------------------------------------------------------------------ sheets
const EXPR: {label: string; params: NoleToneParams}[] = [
  {label: 'rest', params: {}},
  {label: 'smirk', params: {mouth: 'smirk', brow: 0.2}},
  {label: 'grin', params: {mouth: 'grin', brow: 0.35, lookX: 0.1}},
  {label: 'open', params: {mouth: 'open', brow: 0.5}},
  {label: 'phone', params: {lookY: 1, lookX: 0.5, lid: 0.45, brow: -0.5, tilt: 4, phoneLift: 24}},
  {label: 'blink', params: {lid: 1}},
];
const NoleExpressions: React.FC = () => (
  <AbsoluteFill style={{background: '#000', flexDirection: 'row', flexWrap: 'wrap'}}>
    {(['soft', 'noir'] as const).map((id) =>
      EXPR.map((e) => {
        const s = TONE_STYLES[id];
        const view = fitView([-200, -330, 390, 600], 320, 540);
        return (
          <div key={id + e.label} style={{width: 320, height: 540, position: 'relative', background: backdrop(id, s), overflow: 'hidden', boxShadow: 'inset 0 0 0 1px #000'}}>
            <StyleView id={id} model={noleTone({lookX: 0.3, ...e.params})} w={320} h={540} view={view} s={s} scale={320 / view[2]} />
            <Grain amount={s.grain} />
            <Label text={e.label} dark={DARK.has(id)} />
          </div>
        );
      }),
    )}
  </AbsoluteFill>
);

const NoleLineup: React.FC = () => (
  <AbsoluteFill style={{background: '#000', flexDirection: 'row'}}>
    {(['soft', 'noir'] as const).map((id) => (
      <div key={id} style={{width: 960, height: 1080, position: 'relative', background: backdrop(id, TONE_STYLES[id])}}>
        <svg width={960} height={1080} viewBox="-390 -372 1310 932" preserveAspectRatio="xMidYMax meet" style={{position: 'absolute', left: 0, top: 0}}>
          {/* both rigs share the bust crop at y560: the viewBox is bottom-anchored so nothing below it shows */}
          <ToneSvg model={masTone({lookX: 0.4})} style={id} uid={`lm-${id}`} />
          <ToneSvg model={noleTone({lookX: -0.2, mouth: 'smirk'})} style={id} uid={`ln-${id}`} transform="translate(640 0)" />
        </svg>
        <Grain amount={TONE_STYLES[id].grain} />
        <Label text={`MAS vs NOLE · ${TONE_STYLES[id].label}`} dark={DARK.has(id)} size={16} />
      </div>
    ))}
  </AbsoluteFill>
);

/** One style, close-up, for detail inspection. Props: {style, params}. */
const NoleBig: React.FC<{style: ToneStyleId; params?: NoleToneParams}> = ({style, params}) => {
  const s = TONE_STYLES[style];
  const view = fitView([-260, -340, 520, 600], 1080, 1080);
  return (
    <AbsoluteFill style={{background: backdrop(style, s)}}>
      <StyleView id={style} model={noleTone({...PERSONA, ...params})} w={1080} h={1080} view={view} s={s} scale={1080 / view[2]} />
      <Grain amount={s.grain} />
    </AbsoluteFill>
  );
};


export const frames: FrameDef[] = [
  {id: 'nole-tone-test', component: NoleToneTest},
  {id: 'nole-expressions', component: NoleExpressions},
  {id: 'nole-lineup', component: NoleLineup},
  {id: 'nole-big', component: NoleBig, width: 1080, height: 1080, props: {style: 'soft'}},
  {id: 'nole-motion', component: NoleMotion, durationInFrames: 72, fps: 24},
  ...ORDER.map((id) => ({id: `nole-hero-${id}`, component: () => <Hero id={id} />})),
  ...ORDER.map((id) => ({id: `nole-motion-${id}`, component: () => <MotionOne id={id} />, durationInFrames: 72, fps: 24})),
];
