import React, {useId} from 'react';
import type {ToneModel, TP, Tone} from './types';
import {TONE_STYLES, ToneStyle, ToneStyleId, paintTone, noirTone, softTone, sssTone} from './styles';
import {hexToRgb, luminance, mix} from '../theme/color';
import {hashId} from '../draw/ids';
import {analyze, BB, bboxOf, flatten, inv6, m6str, mapBB, mul6, parseTransform6, PlaneInfo} from './render/geom';
import {isWarm} from './render/color2';

/**
 * Vector renderer for tonal models: 'paint' | 'soft' | 'noir' | 'engrave' | 'riso'.
 * Place inside an <svg>. `style` can be a style id or a full style (to override spot color etc.).
 * Raster styles (glyph/pixel/dither/stipple) live in ToneCanvas; passed here they fall back to 'paint'.
 *
 * Optional:
 *  - `boil`: integer seed for the soft style's brush texture / edge wobble. Change it every 2-3 frames
 *    for a painted "boil"; keep it fixed for a calm read.
 *  - `texture`: 0..1 strength of the soft style's painted texture (default 1).
 *  - `wobble`: soft style's brushy edge displacement on interior shading (default true).
 */
export const ToneSvg: React.FC<{model: ToneModel; style: ToneStyleId | ToneStyle; transform?: string; uid?: string; boil?: number; texture?: number; wobble?: boolean; feats?: string}> = ({
  model,
  style,
  transform,
  uid = 'm',
  boil = 1,
  texture = 1,
  wobble = true,
  feats = '',
}) => {
  const rid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const s = typeof style === 'string' ? TONE_STYLES[style] : style;
  const hueOf = (p: TP) => (p.hue.startsWith('#') ? p.hue : model.hues[p.hue] ?? '#888888');
  const u = `${uid}${rid}`.replace(/[^a-zA-Z0-9_-]/g, '_');
  if (s.id === 'riso') return <Riso model={model} s={s} hueOf={hueOf} transform={transform} uid={u} />;
  if (s.id === 'engrave') return <Engrave model={model} s={s} hueOf={hueOf} transform={transform} uid={u} />;
  if (s.id === 'soft') return <Soft model={model} s={s} hueOf={hueOf} transform={transform} uid={u} boil={boil} texture={texture} wobble={wobble} feats={feats} />;
  if (s.id === 'noir') return <Noir model={model} s={s} hueOf={hueOf} transform={transform} uid={u} />;
  return (
    <g transform={transform}>
      {model.paths.map((p, i) => {
        const hue = hueOf(p);
        const c = s.id === 'noir' ? (p.light ? mix(s.spot, '#FFFFFF', p.tone === 4 ? 0.35 : 0) : noirTone(p.tone, s, hue)) : paintTone(hue, p.tone, s.spot, p.light && p.tone >= 4);
        return p.line ? (
          <path key={i} d={p.d} transform={p.transform} fill="none" stroke={s.id === 'noir' ? s.ink : c} strokeWidth={p.line} strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path key={i} d={p.d} transform={p.transform} fill={c} />
        );
      })}
    </g>
  );
};

// ================================================================================================
// SOFT: painterly semi-real. Same flat planes, but:
//  - silhouettes crisp; interior shading planes blurred by size/tone and clipped to their silhouette
//    (edge-extended so shadows stay solid right up to the contour)
//  - warm subsurface fringe at skin terminators, cool bounce wrapped into shadow-side contours
//  - light planes become screen-blended glows + bloom, soft contact shadows under overlapping forms
//  - brush-streak + grain texture in model space (moves with the character, no shower-door)
// ================================================================================================
const TK: Record<Tone, number> = {0: 0.5, 1: 1, 2: 0.78, 3: 0.62, 4: 0.8};
const qz = (x: number) => Math.round(x * 4) / 4;
const pad = (b: BB, k: number): BB => [b[0] - k, b[1] - k, b[2] + k, b[3] + k];

const Soft: React.FC<{model: ToneModel; s: ToneStyle; hueOf: (p: TP) => string; transform?: string; uid: string; boil: number; texture: number; wobble: boolean; feats: string}> = ({model, s, hueOf, transform, uid, boil, texture, wobble: wobbleOn, feats}) => {
  /** debug: feats like '-rim -bounce' switch passes off */
  const on = (k: string) => !feats.includes('-' + k);
  const infos = analyze(model);
  const id = (k: string) => `sf-${uid}-${k}`.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filters: React.ReactNode[] = [];
  let fcount = 0;
  /** Blur filter with an explicit user-space region (bb padded by 3 sigma + extra). */
  const blur = (sigma: number, bb: BB, extra = 0, wobble = false): string | undefined => {
    const k = qz(sigma);
    if (k <= 0.2) return undefined;
    const r = pad(bb, k * 3 + extra + 2);
    const fid = id('f' + fcount++);
    const wob = wobbleOn && wobble && k >= 1.5;
    filters.push(
      <filter key={fid} id={fid} filterUnits="userSpaceOnUse" x={r[0]} y={r[1]} width={r[2] - r[0]} height={r[3] - r[1]} colorInterpolationFilters="sRGB">
        {wob && <feTurbulence type="fractalNoise" baseFrequency={0.03} numOctaves={2} seed={boil} result="n" />}
        {wob && <feDisplacementMap in="SourceGraphic" in2="n" scale={Math.min(14, k * 1.4)} xChannelSelector="R" yChannelSelector="G" result="d" />}
        <feGaussianBlur in={wob ? 'd' : 'SourceGraphic'} stdDeviation={k} />
      </filter>,
    );
    return `url(#${fid})`;
  };

  const clipSets = new Map<string, number[]>();
  /** inverse-silhouette masks expressed in a plane's own transform space (so noise sticks to moving parts) */
  const localMasks = new Map<string, {sils: number[]; T: string}>();
  const lmId = (key: string) => id('ml' + hashId('', key));
  const body: React.ReactNode[] = [];
  const sigmaOf = (f: PlaneInfo) => f.p.soft ?? Math.max(0.8, Math.min(16, 0.055 * f.minDim)) * TK[f.p.tone];
  const pathEl = (p: TP, props: React.SVGProps<SVGPathElement>, key?: string) => <path key={key} d={p.d} transform={p.transform} {...props} />;
  const baseBefore: number[] = [];
  /** "environment" masks for bounce: outside every silhouette painted so far (keyed by count) */
  const boMasks = new Set<number>();
  const aoClips: {key: string; sils: number[]}[] = [];

  for (const f of infos) {
    const p = f.p;
    const hue = hueOf(p);
    const k = `p${f.i}`;
    if (p.line) {
      const c = softTone(hue, p.tone, s);
      const sg = p.soft ?? (p.tone >= 1 ? p.line * 0.32 : p.line * 0.12);
      body.push(
        <g key={k} filter={blur(sg, f.bb, p.line)}>
          {pathEl(p, {fill: 'none', stroke: c, strokeWidth: p.tone >= 1 ? p.line * 1.15 : p.line, strokeLinecap: 'round', strokeLinejoin: 'round', strokeOpacity: p.tone >= 1 ? 0.85 : 1})}
        </g>,
      );
      continue;
    }
    if (f.base) {
      const c = softTone(hue, p.tone, s, !!p.light);
      // soft contact shadow of this form onto whatever is already painted behind it (key from screen-right)
      if (on('ao') && f.minDim >= 38 && baseBefore.length && !p.light) {
        const ck = `ao${f.i}`;
        aoClips.push({key: ck, sils: [...baseBefore]});
        const off = Math.min(9, 2 + f.minDim * 0.03);
        body.push(
          <g key={k + 'ao'} clipPath={`url(#${id(ck)})`} style={{mixBlendMode: 'multiply'}} opacity={0.55}>
            <g filter={blur(off * 0.9 + 1.5, pad(f.bb, off), off)}>
              <g transform={`translate(${-off * 0.8} ${off})`}>{pathEl(p, {fill: s.shade ?? '#241E46'})}</g>
            </g>
          </g>,
        );
      }
      const sg = p.soft ?? (p.light ? 0.6 : f.minDim > 60 ? (p.tone <= 1 ? 1.1 : 0.55) : 0);
      body.push(
        <g key={k} filter={sg > 0 ? blur(sg, f.bb) : undefined} style={p.light ? {mixBlendMode: 'screen'} : undefined}>
          {pathEl(p, {fill: c})}
        </g>,
      );
      // form falloff: an inner shadow from the edges turned away from the key (screen-right/up) => volume
      if (on('falloff') && f.minDim >= 60 && !p.light && p.soft === undefined) {
        const sh = Math.min(26, f.minDim * 0.075);
        const sv = Math.min(30, f.minDim * 0.1);
        const bb = pad(f.bb, sv * 3 + sh);
        const im = id('im' + f.i);
        filters.push(
          <mask key={im} id={im} maskUnits="userSpaceOnUse" x={bb[0]} y={bb[1]} width={bb[2] - bb[0]} height={bb[3] - bb[1]}>
            <rect x={bb[0]} y={bb[1]} width={bb[2] - bb[0]} height={bb[3] - bb[1]} fill="#FFFFFF" />
            <g transform={`translate(${sh} ${-sh * 0.45})`}>{pathEl(p, {fill: '#000000'})}</g>
          </mask>,
          <clipPath key={im + 'c'} id={im + 'c'}>
            {pathEl(p, {})}
          </clipPath>,
        );
        body.push(
          <g key={k + 'ff'} clipPath={`url(#${im}c)`} style={{mixBlendMode: 'multiply'}} opacity={0.42}>
            <g filter={blur(sv, bb)}>
              <g mask={`url(#${im})`}>
                <rect x={bb[0]} y={bb[1]} width={bb[2] - bb[0]} height={bb[3] - bb[1]} fill={mix(s.shade ?? '#241E46', c, 0.35)} />
              </g>
            </g>
          </g>,
        );
      }
      // key rim: narrow screen-blended band of scene light on the edges facing the monitor (screen-right)
      if (on('rim') && f.minDim >= 60 && !p.light && p.soft === undefined) {
        const sh = Math.min(10, f.minDim * 0.03);
        const bb = pad(f.bb, sh * 4);
        const rm = id('rm' + f.i);
        filters.push(
          <mask key={rm} id={rm} maskUnits="userSpaceOnUse" x={bb[0]} y={bb[1]} width={bb[2] - bb[0]} height={bb[3] - bb[1]}>
            {/* band = plane minus (plane + everything behind it) shifted away from the key:
                only key-facing edges that border empty background get the rim */}
            {pathEl(p, {fill: '#FFFFFF'})}
            <g transform={`translate(${-sh} 0)`}>
              {pathEl(p, {fill: '#000000'})}
              {baseBefore.filter((bi) => !infos[bi].p.light).map((bi) => pathEl(infos[bi].p, {fill: '#000000'}, 'rb' + bi))}
            </g>
          </mask>,
          <clipPath key={rm + 'c'} id={rm + 'c'}>
            {pathEl(p, {})}
          </clipPath>,
        );
        body.push(
          <g key={k + 'rim'} clipPath={`url(#${rm}c)`} style={{mixBlendMode: 'screen'}} opacity={0.55}>
            <g filter={blur(sh * 0.6 + 0.8, bb)}>
              <g mask={`url(#${rm})`}>
                <rect x={bb[0]} y={bb[1]} width={bb[2] - bb[0]} height={bb[3] - bb[1]} fill={mix(s.spot, c, 0.35)} />
              </g>
            </g>
          </g>,
        );
      }
      baseBefore.push(f.i);
      continue;
    }
    // ---------------- interior plane ----------------
    clipSets.set(f.clipKey, f.clip);
    const clip = `url(#${id('c' + f.clipKey)})`;
    const mask = `url(#${id('m' + f.clipKey)})`;
    const sg = sigmaOf(f);
    const ext = (color: string, w: number) => <g mask={mask}>{pathEl(p, {fill: 'none', stroke: color, strokeWidth: w, strokeLinejoin: 'round'})}</g>;
    // Transformed parts (e.g. the tilting head): run blur + edge wobble in the part's own space so the
    // wobble noise rotates with it instead of swimming over the face.
    const T = p.transform;
    const lbb = T ? bboxOf(flatten(p.d)) : f.bb;
    const lmKey = f.clipKey + '|' + (T ?? '');
    if (T) localMasks.set(lmKey, {sils: f.clip, T});
    const shaded = (color: string, sigma: number, extra: number, key: string, opacity?: number) =>
      T ? (
        <g key={key} clipPath={clip}>
          <g transform={T} filter={blur(sigma, lbb, extra, true)} opacity={opacity}>
            <path d={p.d} fill={color} />
            <g mask={`url(#${lmId(lmKey)})`}>
              <path d={p.d} fill="none" stroke={color} strokeWidth={sigma * 5} strokeLinejoin="round" />
            </g>
          </g>
        </g>
      ) : (
        <g key={key} clipPath={clip}>
          <g filter={blur(sigma, f.bb, extra, true)} opacity={opacity}>
            {pathEl(p, {fill: color})}
            {ext(color, sigma * 5)}
          </g>
        </g>
      );
    if (p.light) {
      if (!on('glow')) continue;
      const c = softTone(hue, p.tone, s, true);
      body.push(
        <g key={k} clipPath={clip} style={{mixBlendMode: 'screen'}} opacity={0.85}>
          <g filter={blur(sg, f.bb)}>{pathEl(p, {fill: c})}</g>
        </g>,
        <g key={k + 'bl'} filter={blur(sg * 2.6 + 2.5, f.bb)} style={{mixBlendMode: 'screen'}} opacity={0.22}>
          {pathEl(p, {fill: c})}
        </g>,
      );
      continue;
    }
    const c = softTone(hue, p.tone, s);
    const localHue = hueOf({...p, tone: 2});
    if (on('sss') && isWarm(localHue) && p.tone <= 1 && sg >= 1.2) {
      const sc = sssTone(localHue, s);
      const sf = sg * 1.9 + 1.5;
      body.push(shaded(sc, sf, sf * 2.5, k + 'ss', 0.78));
    }
    body.push(shaded(c, sg, sg * 2.5, k));
    // cool bounce wrapped in from the silhouette contour, only inside this shadow plane (soft mask)
    if (on('bounce') && p.tone <= 1 && sg >= 2 && s.bounce) {
      boMasks.add(baseBefore.length);
      const bb = pad(f.bb, sg * 3);
      const pm = id('pm' + f.i);
      const bsg = sg * 0.9 + 2;
      filters.push(
        <mask key={pm} id={pm} maskUnits="userSpaceOnUse" x={bb[0]} y={bb[1]} width={bb[2] - bb[0]} height={bb[3] - bb[1]}>
          <g filter={blur(sg * 0.8, f.bb)}>{pathEl(p, {fill: '#FFFFFF'})}</g>
        </mask>,
      );
      body.push(
        <g key={k + 'bo'} clipPath={clip}>
          <g mask={`url(#${pm})`}>
            <g filter={blur(bsg, bb)} opacity={0.42}>
              <g mask={`url(#${id('bo' + baseBefore.length)})`}>
                <rect x={bb[0]} y={bb[1]} width={bb[2] - bb[0]} height={bb[3] - bb[1]} fill={mix(s.bounce, hue, 0.25)} />
              </g>
            </g>
          </g>
        </g>,
      );
    }
  }

  // union of every silhouette, for the texture pass
  const allBase = infos.filter((f) => f.base && !f.p.light);
  let x1 = Infinity;
  let y1 = Infinity;
  let x2 = -Infinity;
  let y2 = -Infinity;
  for (const f of allBase) {
    x1 = Math.min(x1, f.bb[0]);
    y1 = Math.min(y1, f.bb[1]);
    x2 = Math.max(x2, f.bb[2]);
    y2 = Math.max(y2, f.bb[3]);
  }
  const tb: BB = [x1 - 20, y1 - 20, x2 + 20, y2 + 20];
  const diag = Math.hypot(tb[2] - tb[0], tb[3] - tb[1]);
  const cx = (tb[0] + tb[2]) / 2;
  const cy = (tb[1] + tb[3]) / 2;
  const texId = id('tex');
  const texGroups = [...new Set(allBase.map((f) => f.p.transform ?? ''))].map((T, i) => ({T, key: 'g' + i}));

  return (
    <g transform={transform}>
      <defs>
        {[...clipSets.entries()].map(([key, sils]) => (
          <React.Fragment key={key}>
            <clipPath id={id('c' + key)}>{sils.map((si) => pathEl(infos[si].p, {}, 'c' + si))}</clipPath>
            <mask id={id('m' + key)} maskUnits="userSpaceOnUse" x={tb[0] - 200} y={tb[1] - 200} width={tb[2] - tb[0] + 400} height={tb[3] - tb[1] + 400}>
              <rect x={tb[0] - 200} y={tb[1] - 200} width={tb[2] - tb[0] + 400} height={tb[3] - tb[1] + 400} fill="#FFFFFF" />
              {sils.map((si) => pathEl(infos[si].p, {fill: '#000000'}, 'm' + si))}
            </mask>
          </React.Fragment>
        ))}
        {[...localMasks.entries()].map(([key, {sils, T}]) => {
          const Ti = inv6(parseTransform6(T));
          const r = mapBB(Ti, [tb[0] - 200, tb[1] - 200, tb[2] + 200, tb[3] + 200]);
          return (
            <mask key={key} id={lmId(key)} maskUnits="userSpaceOnUse" x={r[0]} y={r[1]} width={r[2] - r[0]} height={r[3] - r[1]}>
              <rect x={r[0]} y={r[1]} width={r[2] - r[0]} height={r[3] - r[1]} fill="#FFFFFF" />
              {sils.map((si) => {
                const q = infos[si].p;
                const rel = q.transform === T ? undefined : m6str(mul6(Ti, parseTransform6(q.transform)));
                return <path key={si} d={q.d} transform={rel} fill="#000000" />;
              })}
            </mask>
          );
        })}
        {[...boMasks].map((n) => {
          const bases = baseBefore.slice(0, n).map((i) => infos[i]).filter((f) => !f.p.light);
          return (
            <mask key={'bo' + n} id={id('bo' + n)} maskUnits="userSpaceOnUse" x={tb[0] - 200} y={tb[1] - 200} width={tb[2] - tb[0] + 400} height={tb[3] - tb[1] + 400}>
              <rect x={tb[0] - 200} y={tb[1] - 200} width={tb[2] - tb[0] + 400} height={tb[3] - tb[1] + 400} fill="#FFFFFF" />
              {bases.map((f) => pathEl(f.p, {fill: '#000000'}, 'bo' + f.i))}
            </mask>
          );
        })}
        {aoClips.map(({key, sils}) => (
          <clipPath key={key} id={id(key)}>
            {sils.map((si) => pathEl(infos[si].p, {}, key + si))}
          </clipPath>
        ))}
        <clipPath id={id('all')}>{allBase.map((f) => pathEl(f.p, {}, 'a' + f.i))}</clipPath>
        {texGroups.map(({T, key}) =>
          (['coarse', 'fine'] as const).map((cls) => (
            <mask key={cls + key} id={id('mk-' + cls + key)} maskUnits="userSpaceOnUse" x={tb[0]} y={tb[1]} width={tb[2] - tb[0]} height={tb[3] - tb[1]}>
              {allBase.map((f) => {
                const fine = f.minDim < 40 || isWarm(hueOf({...f.p, tone: 2}));
                return pathEl(f.p, {fill: (cls === 'fine') === fine && (f.p.transform ?? '') === T ? '#FFFFFF' : '#000000'}, cls + f.i);
              })}
            </mask>
          )),
        )}
        <filter id={texId + 'f'} x={0} y={0} width={1} height={1} colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves={2} seed={boil + 3} result="g" />
          <feColorMatrix in="g" type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" />
        </filter>
        <filter id={texId} x={0} y={0} width={1} height={1} colorInterpolationFilters="sRGB">
          {/* dry-brush streaks (anisotropic) + fine canvas tooth; luminance only, low amplitude */}
          <feTurbulence type="fractalNoise" baseFrequency="0.028 0.06" numOctaves={4} seed={boil} result="brush" />
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={boil + 11} result="grain" />
          <feComposite in="brush" in2="grain" operator="arithmetic" k2={0.75} k3={0.25} result="n" />
          <feColorMatrix in="n" type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" />
          <feComponentTransfer>
            <feFuncR type="linear" slope={1.6} intercept={-0.3} />
            <feFuncG type="linear" slope={1.6} intercept={-0.3} />
            <feFuncB type="linear" slope={1.6} intercept={-0.3} />
          </feComponentTransfer>
        </filter>
        {filters}
      </defs>
      {body}
      {texture > 0 &&
        texGroups.map(({T, key}) => {
          // texture rects live in each part's own space (head tilt carries its skin grain along: no shower-door)
          const Ti = inv6(parseTransform6(T));
          const r = mapBB(Ti, tb);
          const lcx = (r[0] + r[2]) / 2;
          const lcy = (r[1] + r[3]) / 2;
          const ld = Math.hypot(r[2] - r[0], r[3] - r[1]);
          const rect = (filt: string, extra = '') => (
            <rect x={lcx - ld / 2} y={lcy - ld / 2} width={ld} height={ld} transform={`${T} ${extra}`.trim() || undefined} filter={`url(#${filt})`} />
          );
          return (
            <React.Fragment key={key}>
              {/* coarse brush texture on cloth / hair */}
              <g mask={`url(#${id('mk-coarse' + key)})`} style={{mixBlendMode: 'overlay'}} opacity={0.17 * texture}>
                {rect(texId, `rotate(-20 ${lcx} ${lcy})`)}
              </g>
              {/* fine tooth only on skin + small features */}
              <g mask={`url(#${id('mk-fine' + key)})`} style={{mixBlendMode: 'overlay'}} opacity={0.2 * texture}>
                {rect(texId + 'f')}
              </g>
            </React.Fragment>
          );
        })}
    </g>
  );
};

// ---------- noir: ink shadows, one spot color; skin half-tones as a spot halftone so faces never split ----------
const Noir: React.FC<{model: ToneModel; s: ToneStyle; hueOf: (p: TP) => string; transform?: string; uid: string}> = ({model, s, hueOf, transform, uid}) => {
  const ht = `nh-${uid}`;
  const lit = noirTone(3, s, '#D9A78A');
  const mid = noirTone(2, s, '#D9A78A');
  const P = (s.pitch ?? 4.6) * 1.5;
  return (
    <g transform={transform}>
      <defs>
        <pattern id={ht} width={P} height={P} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={P} height={P} fill={mix(lit, mid, 0.18)} />
          <circle cx={P / 2} cy={P / 2} r={P * 0.36} fill={mid} />
        </pattern>
      </defs>
      {model.paths.map((p, i) => {
        const hue = hueOf(p);
        const skin = isWarm(hue);
        const c = p.light ? mix(s.spot, '#FFFFFF', p.tone === 4 ? 0.35 : 0) : p.tone === 2 && skin ? `url(#${ht})` : noirTone(p.tone, s, hue);
        return p.line ? (
          <path key={i} d={p.d} transform={p.transform} fill="none" stroke={s.ink} strokeWidth={p.line} strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path key={i} d={p.d} transform={p.transform} fill={c} />
        );
      })}
    </g>
  );
};

// ---------- banknote engraving: swelling lines ----------
// Each plane is filled with a pattern that encodes a triangle wave across the line direction (R), the same wave
// rotated 90 deg (B, for cross-hatching) and the plane's tone (G). A filter blurs the tone field and thresholds
// wave + tone, so line WIDTH follows the (smoothed) tone and swells/tapers across terminators like a real burin cut.
const ENGRAVE_GAP = 4.6;
const Engrave: React.FC<{model: ToneModel; s: ToneStyle; hueOf: (p: TP) => string; transform?: string; uid: string}> = ({model, s, transform, uid}) => {
  const infos = analyze(model);
  const keys = new Map<string, {tone: number; angle: number}>();
  const toneOf = (p: TP) => (p.light ? 1 : [0.04, 0.26, 0.5, 0.74, 0.97][p.tone]);
  infos.forEach(({p}) => {
    if (p.line) return;
    const angle = p.angle ?? 35;
    const t = toneOf(p);
    keys.set(`${Math.round(t * 100)}_${angle}`, {tone: t, angle});
  });
  const pid = (t: number, angle: number) => `eg-${uid}-${Math.round(t * 100)}-${angle}`.replace(/\./g, '_');
  let x1 = Infinity;
  let y1 = Infinity;
  let x2 = -Infinity;
  let y2 = -Infinity;
  for (const f of infos) {
    x1 = Math.min(x1, f.bb[0]);
    y1 = Math.min(y1, f.bb[1]);
    x2 = Math.max(x2, f.bb[2]);
    y2 = Math.max(y2, f.bb[3]);
  }
  const r = [x1 - 12, y1 - 12, x2 + 12, y2 + 12];
  const G = s.pitch ?? ENGRAVE_GAP;
  const [ir, ig, ib] = hexToRgb(s.ink).map((v) => v / 255);
  const fid = `eg-${uid}-f`;
  const g8 = (t: number) => Math.round(t * 255);
  return (
    <g transform={transform}>
      <defs>
        <linearGradient id={`${fid}-wy`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000000" />
          <stop offset="0.5" stopColor="#FF0000" />
          <stop offset="1" stopColor="#000000" />
        </linearGradient>
        <linearGradient id={`${fid}-wx`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000000" />
          <stop offset="0.5" stopColor="#0000FF" />
          <stop offset="1" stopColor="#000000" />
        </linearGradient>
        {[...keys.values()].map(({tone, angle}) => (
          <pattern key={pid(tone, angle)} id={pid(tone, angle)} width={G} height={G} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
            <rect width={G} height={G} fill={`url(#${fid}-wy)`} />
            <rect width={G} height={G} fill={`url(#${fid}-wx)`} style={{mixBlendMode: 'screen'}} />
            <rect width={G} height={G} fill={`rgb(0,${g8(tone)},0)`} style={{mixBlendMode: 'screen'}} />
          </pattern>
        ))}
        <filter id={fid} filterUnits="userSpaceOnUse" x={r[0]} y={r[1]} width={r[2] - r[0]} height={r[3] - r[1]} colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 1 0 0 0  0 1 0 0 0  0 1 0 0 0  0 0 0 0 1" result="T0" />
          <feGaussianBlur in="T0" stdDeviation={2.6} result="Tb" />
          <feComponentTransfer in="Tb" result="T">
            <feFuncR type="gamma" amplitude={1} exponent={0.72} offset={0} />
            <feFuncG type="gamma" amplitude={1} exponent={0.72} offset={0} />
            <feFuncB type="gamma" amplitude={1} exponent={0.72} offset={0} />
          </feComponentTransfer>
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" result="W1" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 1 0 0  0 0 1 0 0  0 0 1 0 0  0 0 0 0 1" result="W2" />
          {/* main lines: paper where wave + tone > 1 */}
          <feComposite in="W1" in2="T" operator="arithmetic" k2={1} k3={1} k4={-0.5} result="V1" />
          <feComponentTransfer in="V1" result="P1">
            <feFuncR type="linear" slope={9} intercept={-4} />
            <feFuncG type="linear" slope={9} intercept={-4} />
            <feFuncB type="linear" slope={9} intercept={-4} />
          </feComponentTransfer>
          {/* cross-hatch only in deep shadow */}
          <feComposite in="W2" in2="T" operator="arithmetic" k2={1} k3={2.3} k4={-0.5} result="V2" />
          <feComponentTransfer in="V2" result="P2">
            <feFuncR type="linear" slope={9} intercept={-4} />
            <feFuncG type="linear" slope={9} intercept={-4} />
            <feFuncB type="linear" slope={9} intercept={-4} />
          </feComponentTransfer>
          <feComposite in="P1" in2="P2" operator="arithmetic" k1={1} result="P" />
          <feColorMatrix in="P" type="matrix" values={`0 0 0 0 ${ir}  0 0 0 0 ${ig}  0 0 0 0 ${ib}  -1 0 0 0 1`} />
        </filter>
      </defs>
      {/* outer contour of the whole figure (strokes of every silhouette, then paper fills cover the inner halves) */}
      {infos.filter((f) => f.base && !f.p.line && !f.p.light).map((f) => (
        <path key={'po' + f.i} d={f.p.d} transform={f.p.transform} fill="none" stroke={s.ink} strokeWidth={2.2} strokeLinejoin="round" />
      ))}
      {infos.filter((f) => f.base && !f.p.line).map((f) => (
        <path key={'pp' + f.i} d={f.p.d} transform={f.p.transform} fill={s.paper} />
      ))}
      <g filter={`url(#${fid})`}>
        <rect x={r[0]} y={r[1]} width={r[2] - r[0]} height={r[3] - r[1]} fill="rgb(255,255,255)" />
        {infos.map((f) =>
          f.p.line ? null : <path key={f.i} d={f.p.d} transform={f.p.transform} fill={`url(#${pid(toneOf(f.p), f.p.angle ?? 35)})`} />,
        )}
      </g>
      {/* burin contour on silhouettes + drawn lines */}
      {infos.map((f) =>
        f.p.line ? (
          <path key={'l' + f.i} d={f.p.d} transform={f.p.transform} fill="none" stroke={s.ink} strokeWidth={f.p.line * 0.85} strokeLinecap="round" />
        ) : null,
      )}
    </g>
  );
};

// ---------- risograph: two inks, halftone coverage, multiply overprint, misregistration ----------
const RISO_A = '#0078BF'; // riso blue
const RISO_B = '#FF48B0'; // fluorescent pink
const COVER: Record<Tone, number> = {0: 1, 1: 0.78, 2: 0.52, 3: 0.26, 4: 0};
const q = (x: number) => Math.round(Math.max(0, Math.min(1, x)) * 4) / 4;
const inkWeights = (hue: string): [number, number] => {
  const [r, , b] = hexToRgb(hue);
  const warm = (r - b) / 255;
  const dark = 1 - luminance(hue);
  return [Math.max(0.15, Math.min(1, 0.45 + dark * 0.5 - warm * 0.5)), Math.max(0.05, Math.min(1, 0.2 + warm * 1.1 + dark * 0.15))];
};
const Riso: React.FC<{model: ToneModel; s: ToneStyle; hueOf: (p: TP) => string; transform?: string; uid: string}> = ({model, hueOf, transform, uid}) => {
  const layer = (ink: string, which: 0 | 1, dx: number, dy: number) => {
    const pid = (c: number) => `rs-${uid}-${which}-${Math.round(c * 100)}`;
    return (
      <g style={{mixBlendMode: 'multiply'}} transform={`translate(${dx} ${dy})`}>
        <defs>
          {[0.25, 0.5, 0.75].map((c) => (
            <pattern key={c} id={pid(c)} width={6} height={6} patternUnits="userSpaceOnUse" patternTransform={`rotate(${which ? 15 : 75})`}>
              <rect width={6} height={6} fill="#FFFFFF" />
              <circle cx={3} cy={3} r={Math.sqrt(c / Math.PI) * 6 * 0.98} fill={ink} />
            </pattern>
          ))}
        </defs>
        {model.paths.map((p, i) => {
          const w = inkWeights(hueOf(p))[which];
          const c = p.light ? 0 : q(COVER[p.tone] * w + (p.tone === 0 ? 0.25 : 0));
          const fill = c === 0 ? '#FFFFFF' : c === 1 ? ink : `url(#${pid(c)})`;
          return p.line ? (
            <path key={i} d={p.d} transform={p.transform} fill="none" stroke={which === 0 ? ink : '#FFFFFF'} strokeOpacity={which === 0 ? 1 : 0} strokeWidth={p.line} strokeLinecap="round" />
          ) : (
            <path key={i} d={p.d} transform={p.transform} fill={fill} />
          );
        })}
      </g>
    );
  };
  return (
    <g transform={transform}>
      {layer(RISO_A, 0, 0, 0)}
      {layer(RISO_B, 1, 3.5, 2.5)}
    </g>
  );
};

export const toneStyleUid = (id: string, extra = '') => hashId('ts', id + extra);
