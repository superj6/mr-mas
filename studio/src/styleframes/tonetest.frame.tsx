import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {FrameDef} from '../shared/frame-def';
import type {ToneModel} from '../shared/tonal/types';
import {masTone, MasToneParams} from '../shared/tonal/masTone';
import {ToneSvg} from '../shared/tonal/ToneSvg';
import {ToneCanvas} from '../shared/tonal/ToneCanvas';
import {TONE_STYLES, ToneStyle, ToneStyleId} from '../shared/tonal/styles';
import {Grain, Vignette} from '../shared/fx/Grain';
import {mix} from '../shared/theme/color';

/**
 * Tonal style test: the same Mas tonal rig through every renderer.
 *  - test-tone-styles       1920x1080 grid (9 styles + legend)
 *  - tone-hero-<style>      1920x1080 single-style lookdev still
 *  - tone-motion-<style>    3 s motion test (blink, eye dart, mouths, tilt, monitor flicker, slow push)
 */
const ORDER: ToneStyleId[] = ['soft', 'paint', 'noir', 'riso', 'engrave', 'glyph', 'pixel', 'dither', 'stipple'];
const RASTER = new Set<ToneStyleId>(['glyph', 'pixel', 'dither', 'stipple']);
const DARK = new Set<ToneStyleId>(['soft', 'paint', 'glyph', 'pixel']);

const fitView = (box: [number, number, number, number], w: number, h: number): [number, number, number, number] => {
  const [x, y, bw, bh] = box;
  const a = w / h;
  if (bw / bh > a) {
    const nh = bw / a;
    return [x, y - (nh - bh) / 2, bw, nh];
  }
  const nw = bh * a;
  return [x - (nw - bw) / 2, y, nw, bh];
};

/** Scene backdrop per style (CSS layer behind vector styles; canvas underlay for pixel). */
const backdrop = (id: ToneStyleId, s: ToneStyle): string => {
  switch (id) {
    case 'soft':
      return `radial-gradient(ellipse 70% 80% at 92% 38%, ${mix(s.spot, '#0E1219', 0.78)} 0%, #0E1219 55%, #06080B 100%)`;
    case 'paint':
      return `radial-gradient(ellipse 60% 70% at 95% 35%, ${mix(s.spot, '#11151D', 0.86)} 0%, #11151D 60%, #0A0C11 100%)`;
    case 'glyph':
      return '#000000';
    case 'pixel':
      return '#0B0D14';
    default:
      return s.paper;
  }
};

const pixelUnderlay = (spot: string) => (ctx: CanvasRenderingContext2D) => {
  // monitor glow from screen-right: a large gradient -> the only place the pixel renderer dithers
  const g = ctx.createRadialGradient(560, -40, 20, 560, -40, 760);
  g.addColorStop(0, mix(spot, '#0B0D14', 0.45));
  g.addColorStop(0.45, mix(spot, '#0B0D14', 0.82));
  g.addColorStop(1, '#090B11');
  ctx.fillStyle = g;
  ctx.fillRect(-2000, -2000, 4000, 4000);
};

const StyleView: React.FC<{id: ToneStyleId; model: ToneModel; w: number; h: number; view: [number, number, number, number]; s: ToneStyle; scale: number; boil?: number; seed?: number}> = ({
  id,
  model,
  w,
  h,
  view,
  s,
  scale,
  boil = 1,
  seed = 3,
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
  // keep engraving lines >= ~4.4 screen px apart (finer lines moire); noir halftone keeps its default pitch
  const st = id === 'engrave' ? {...s, pitch: Math.max(4.6, 4.4 / scale)} : s;
  return (
    <svg width={w} height={h} viewBox={view.join(' ')} style={{position: 'absolute', left: 0, top: 0}}>
      <ToneSvg model={model} style={st} uid={id} boil={boil} />
    </svg>
  );
};

// ------------------------------------------------------------------------------------------------
// Grid
// ------------------------------------------------------------------------------------------------
const PW = 384;
const PH = 540;
const Panel: React.FC<{id: ToneStyleId}> = ({id}) => {
  const model = masTone({lookX: 0.3});
  const view = fitView([-300, -330, 600, 900], PW, PH);
  const s = TONE_STYLES[id];
  const dark = DARK.has(id);
  return (
    <div style={{width: PW, height: PH, position: 'relative', background: backdrop(id, s), overflow: 'hidden', boxShadow: 'inset 0 0 0 1px #000'}}>
      <StyleView id={id} model={model} w={PW} h={PH} view={view} s={s} scale={PW / view[2]} />
      {dark && id !== 'glyph' && <Vignette amount={0.35} />}
      <Grain amount={s.grain} />
      <div
        style={{
          position: 'absolute',
          left: 10,
          bottom: 10,
          fontFamily: 'JetBrains Mono',
          fontSize: 14,
          letterSpacing: 0.5,
          padding: '3px 7px',
          color: dark ? '#CFE9F0' : '#1A1A1A',
          background: dark ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.6)',
        }}
      >
        {s.label}
      </div>
    </div>
  );
};

const Legend: React.FC = () => (
  <div style={{width: PW, height: PH, position: 'relative', background: '#0A0B0F', color: '#D8DEE6', fontFamily: 'JetBrains Mono', padding: 26, boxSizing: 'border-box', boxShadow: 'inset 0 0 0 1px #000'}}>
    <div style={{fontFamily: 'Oswald', fontWeight: 600, fontSize: 40, letterSpacing: 2, color: '#FFFFFF'}}>MR. MAS</div>
    <div style={{fontSize: 13, color: '#7FD9E6', marginTop: 4, letterSpacing: 1}}>TONAL RIG · STYLE SPECTRUM v0.3</div>
    <div style={{fontSize: 12.5, lineHeight: 1.65, marginTop: 22, color: '#AEB7C4'}}>
      One flat-plane rig (tone 0-4 + hue),
      <br />
      nine renderers. Same pivots, same
      <br />
      mouths, same blinks in every style.
      <br />
      <br />
      <span style={{color: '#fff'}}>closer to real</span> · soft, paint
      <br />
      <span style={{color: '#fff'}}>graphic</span> · noir, riso, engrave, hedcut
      <br />
      <span style={{color: '#fff'}}>digital</span> · glyph, pixel, 1-bit
    </div>
    <div style={{position: 'absolute', left: 26, bottom: 22, fontSize: 11, color: '#5E6877'}}>key: monitor, screen-right</div>
  </div>
);

const ToneTest: React.FC = () => (
  <AbsoluteFill style={{background: '#000', flexDirection: 'row', flexWrap: 'wrap'}}>
    {ORDER.map((id) => (
      <Panel key={id} id={id} />
    ))}
    <Legend />
  </AbsoluteFill>
);

// ------------------------------------------------------------------------------------------------
// Hero still + motion test (1920x1080)
// ------------------------------------------------------------------------------------------------
const HERO_VIEW: [number, number, number, number] = (() => {
  const h = 800; // crown..mid-chest
  const w = (h * 1920) / 1080;
  return [-w * 0.42, -318, w, h];
})();

const Hero: React.FC<{id: ToneStyleId; params?: MasToneParams; spot?: string; push?: number; pan?: number; boil?: number; seed?: number}> = ({id, params, spot, push = 0, pan = 0, boil = 1, seed}) => {
  const base = TONE_STYLES[id];
  const s = spot ? {...base, spot} : base;
  const model = masTone(params ?? {lookX: 0.3});
  const k = 1 + push;
  const [x, y, w, h] = HERO_VIEW;
  const view: [number, number, number, number] = [x + (w - w / k) * 0.45 + pan, y + (h - h / k) * 0.35, w / k, h / k];
  const dark = DARK.has(id);
  return (
    <AbsoluteFill style={{background: backdrop(id, s)}}>
      <StyleView id={id} model={model} w={1920} h={1080} view={view} s={s} scale={1920 / view[2]} boil={boil} seed={seed} />
      {dark && id !== 'glyph' && <Vignette amount={0.45} />}
      <Grain amount={s.grain} seed={boil} />
      <div style={{position: 'absolute', right: 34, bottom: 26, fontFamily: 'JetBrains Mono', fontSize: 18, letterSpacing: 1, color: dark ? 'rgba(210,235,240,0.55)' : 'rgba(20,20,20,0.55)'}}>
        {s.label.toUpperCase()}
      </div>
    </AbsoluteFill>
  );
};

const MOUTHS: NonNullable<MasToneParams['mouth']>[] = ['rest', 'open', 'o', 'open', 'rest', 'smile', 'smile', 'rest'];
const Motion: React.FC<{id: ToneStyleId}> = ({id}) => {
  const f0 = useCurrentFrame();
  const f = Math.floor(f0 / 2) * 2; // everything on 2s (limited animation; also keeps raster styles from crawling)
  const blink = [0.12, 0.55, 1, 1, 0.6, 0.12];
  const bi = f - 16;
  const lid = bi >= 0 && bi < blink.length * 2 ? blink[Math.floor(bi / 2)] : 0.12;
  const lookX = f < 34 ? 0.3 : f < 58 ? -0.3 : 0.3;
  const mouth = f >= 26 && f < 58 ? MOUTHS[Math.floor((f - 26) / 4) % MOUTHS.length] : 'rest';
  const brow = f >= 34 && f < 58 ? 0.55 : 0.15;
  const tilt = Math.sin((f / 72) * Math.PI * 2) * 2.2;
  const base = TONE_STYLES[id].spot;
  const flick = 0.5 + 0.5 * Math.sin(f * 1.7) * Math.sin(f * 0.37);
  const spot = mix(base, '#FFFFFF', 0.12 * flick);
  // texture boil: off for soft (paint sticks to the character); glyph tokens reshuffle on 4s ("latent" shimmer)
  // camera: slow push-in for vector styles; pixel/dither get a slow truck instead (snapped to whole cells by
  // ToneCanvas) because non-integer zooms make every pixel edge shimmer.
  const lowres = id === 'pixel' || id === 'dither';
  return (
    <Hero
      id={id}
      params={{lookX, lid, mouth, brow, tilt}}
      spot={spot}
      push={lowres ? 0 : 0.035 * (f0 / 71)}
      pan={lowres ? -18 * (f0 / 71) : 0}
      boil={1}
      seed={id === 'glyph' ? 3 + Math.floor(f / 4) : 3}
    />
  );
};

export const frames: FrameDef[] = [
  {id: 'test-tone-styles', component: ToneTest},
  ...ORDER.map((id) => ({id: `tone-hero-${id}`, component: () => <Hero id={id} />})),
  ...ORDER.map((id) => ({id: `tone-motion-${id}`, component: () => <Motion id={id} />, durationInFrames: 72})),
];
