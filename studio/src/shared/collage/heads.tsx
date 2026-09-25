import React, {useMemo} from 'react';
import {masTone, MasToneParams} from '../tonal/masTone';
import {noleTone, NoleToneParams} from '../tonal/noleTone';
import {ToneSvg} from '../tonal/ToneSvg';
import {TONE_STYLES, ToneStyle} from '../tonal/styles';
import type {ToneModel, TP} from '../tonal/types';
import {Piece, Sil, STOCK, Stock, Wash} from './paper';
import {polyD, P2} from './core';

/**
 * COLLAGE — the two banknote-engraved heads, cut out of their "portraits" with the jaw sawn off on a pivot
 * (the Gilliam talking head). Built from the shared tonal rigs (masTone / noleTone) through the shared
 * ToneSvg 'engrave' renderer, read-only. Everything here is in the rig's local units.
 */

export const INK = {
  note: '#172A27', // banknote green-black (Mas)
  cert: '#2B1912', // certificate sepia-black (Nole)
  cat: '#1E1A17', // catalogue black
  plate: '#15161E', // room plate blue-black
};

const headOnly = (m: ToneModel, neck = false): ToneModel => ({...m, paths: m.paths.filter((p) => (p.transform ?? '').startsWith('rotate') || (neck && p.hue === 'neck'))});
const strip = (p: TP): TP => ({...p, transform: undefined});

const sils = (m: ToneModel): Sil[] => m.paths.filter((p) => !p.line && !p.light).map((p) => ({d: p.d}));

const engraveStyle = (ink: string, paper: string, pitch: number): ToneStyle => ({...TONE_STYLES.engrave, ink, spot: ink, paper, pitch});

interface Cut {
  /** Polyline of the jaw cut, front -> back (rig coords). */
  line: P2[];
  hinge: P2;
  /** Mouth cavity polygon. */
  cavity: P2[];
}
const clipAbove = (line: P2[]) => polyD([...line, [line[line.length - 1][0], -900], [line[0][0], -900]]);
const clipBelow = (line: P2[]) => polyD([...line, [line[line.length - 1][0], 900], [line[0][0], 900]]);

const MAS_CUT: Cut = {
  line: [[260, 108], [134, 106], [100, 111], [62, 111], [20, 122], [-40, 110], [-100, 76], [-300, 76]],
  hinge: [-78, 82],
  cavity: [[136, 106], [60, 110], [-20, 114], [-80, 84], [-40, 150], [50, 160], [118, 134]],
};
const NOLE_CUT: Cut = {
  line: [[260, 116], [171, 116], [130, 120], [90, 124], [50, 126], [-10, 108], [-66, 66], [-130, 56], [-300, 56]],
  hinge: [-72, 60],
  cavity: [[176, 114], [90, 122], [0, 118], [-70, 64], [-40, 170], [90, 196], [176, 170]],
};

export interface HeadLook {
  /** cyan monitor airbrush (0..1) on the screen-left side of the page (after any mirror). */
  cyan?: number;
  /** warm breach light airbrush (0..1). */
  warm?: number;
  /** Mirror so the portrait faces screen-left. */
  mirror?: boolean;
}

const Engraved: React.FC<{id: string; model: ToneModel; stock: Stock; ink: string; pitch: number; clip: string; tints: React.ReactNode; margin: number; shadow: [number, number, number, number]}> = ({
  id,
  model,
  stock,
  ink,
  pitch,
  clip,
  tints,
  margin,
  shadow,
}) => {
  const cid = `${id}-clip`.replace(/[^a-zA-Z0-9_-]/g, '_');
  const [bx, by, bw, bh] = model.box;
  return (
    <g>
      <defs>
        <clipPath id={cid}>
          <path d={clip} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${cid})`}>
        <Piece id={id} sil={sils(model)} stock={stock} margin={margin} shadow={shadow} box={[bx, by, bw, bh]} over={tints}>
          <ToneSvg model={model} style={engraveStyle(ink, stock.paper, pitch)} uid={id} />
        </Piece>
      </g>
    </g>
  );
};

/** Hand-tint + airbrush layer for a head, from the rig's own planes. */
const headTints = (id: string, m: ToneModel, hueKeys: {skin: string[]; hair: string[]; iris: string[]; lip: string[]}, c: {skin: string; hair: string; iris: string; lip: string}, look: HeadLook, box: [number, number, number, number]) => {
  const pick = (keys: string[], tones?: number[]) => m.paths.filter((p) => !p.line && keys.includes(p.hue) && (!tones || tones.includes(p.tone))).map((p) => p.d).join(' ');
  const [bx, by, bw, bh] = box;
  const cyan = look.cyan ?? 0;
  const warm = look.warm ?? 0;
  // the rig is lit from its own screen-right; airbrush follows the page light instead
  const gid = `${id}-ab`.replace(/[^a-zA-Z0-9_-]/g, '_');
  return (
    <>
      <Wash id={id + 'skin'} d={pick(hueKeys.skin, [3])} color={c.skin} opacity={0.42} blur={4} />
      <Wash id={id + 'hair'} d={pick(hueKeys.hair, [0, 1])} color={c.hair} opacity={0.5} blur={3} />
      <Wash id={id + 'iris'} d={pick(hueKeys.iris)} color={c.iris} opacity={0.7} blur={1.2} />
      <Wash id={id + 'lip'} d={pick(hueKeys.lip)} color={c.lip} opacity={0.45} blur={2} />
      <defs>
        <linearGradient id={gid + 'c'} x1={look.mirror ? 0 : 1} y1="0.2" x2={look.mirror ? 1 : 0} y2="0.6">
          <stop offset="0" stopColor="#1B2A55" stopOpacity={0.55} />
          <stop offset="0.55" stopColor="#1B2A55" stopOpacity={0.1} />
          <stop offset="1" stopColor="#1B2A55" stopOpacity={0} />
        </linearGradient>
        <radialGradient id={gid + 'g'} cx={look.mirror ? 1.12 : -0.12} cy="0.5" r="0.62">
          <stop offset="0" stopColor="#7FF3FF" stopOpacity={0.95} />
          <stop offset="0.55" stopColor="#40C8E0" stopOpacity={0.18} />
          <stop offset="1" stopColor="#40C8E0" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={gid + 'w'} cx={look.mirror ? -0.1 : 1.1} cy="0.4" r="0.8">
          <stop offset="0" stopColor="#FF9A3C" stopOpacity={0.9} />
          <stop offset="0.6" stopColor="#E0602A" stopOpacity={0.25} />
          <stop offset="1" stopColor="#E0602A" stopOpacity={0} />
        </radialGradient>
      </defs>
      <clipPath id={gid + 'k'}>
        {m.paths.filter((p) => !p.line && !p.light).map((p, i) => (
          <path key={i} d={p.d} />
        ))}
      </clipPath>
      <g clipPath={`url(#${gid}k)`}>
        <rect x={bx} y={by} width={bw} height={bh} fill={`url(#${gid}c)`} style={{mixBlendMode: 'multiply'}} />
        {cyan > 0 && <rect x={bx} y={by} width={bw} height={bh} fill={`url(#${gid}g)`} opacity={cyan} style={{mixBlendMode: 'screen'}} />}
        {warm > 0 && <rect x={bx} y={by} width={bw} height={bh} fill={`url(#${gid}w)`} opacity={warm} style={{mixBlendMode: 'screen'}} />}
      </g>
    </>
  );
};

export interface MasHeadProps {
  id: string;
  p?: MasToneParams;
  /** Jaw opening, degrees. */
  jaw?: number;
  pitch: number;
  look?: HeadLook;
}

export const MasHead: React.FC<MasHeadProps> = ({id, p = {}, jaw = 0, pitch, look = {}}) => {
  const model = useMemo(() => {
    const m = headOnly(masTone({...p, tilt: 0}));
    return {...m, paths: m.paths.map(strip), box: [-190, -320, 380, 560] as [number, number, number, number]};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(p)]);
  const tints = headTints(id, model, {skin: ['skin'], hair: ['hair', 'brow'], iris: ['iris'], lip: ['lip']}, {skin: '#E9A48C', hair: '#8A5A34', iris: '#5E9A7A', lip: '#D86A6A'}, look, model.box);
  const C = MAS_CUT;
  return (
    <g transform={look.mirror ? 'scale(-1 1)' : undefined}>
      <path d={polyD(C.cavity)} fill="#140608" />
      <g transform={`rotate(${jaw} ${C.hinge[0]} ${C.hinge[1]})`}>
        <Engraved id={id + '-jaw'} model={model} stock={STOCK.note} ink={INK.note} pitch={pitch} clip={clipBelow(C.line)} tints={tints} margin={7} shadow={[4, 6, 4, 0.5]} />
      </g>
      <Engraved id={id + '-skull'} model={model} stock={STOCK.note} ink={INK.note} pitch={pitch} clip={clipAbove(C.line)} tints={tints} margin={7} shadow={[4, 6, 4, 0.5]} />
    </g>
  );
};

export interface NoleHeadProps {
  id: string;
  p?: NoleToneParams;
  jaw?: number;
  pitch: number;
  look?: HeadLook;
}

export const NoleHead: React.FC<NoleHeadProps> = ({id, p = {}, jaw = 0, pitch, look = {}}) => {
  const [model, neck] = useMemo(() => {
    const m = headOnly(noleTone({...p, tilt: 0, phone: false}), true);
    const box = [-210, -340, 420, 640] as [number, number, number, number];
    const head = {...m, paths: m.paths.filter((q) => q.hue !== 'neck').map(strip), box};
    const nk = {...m, paths: m.paths.filter((q) => q.hue === 'neck').map(strip), box: [-170, -40, 290, 350] as [number, number, number, number]};
    return [head, nk];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(p)]);
  const tints = headTints(id, model, {skin: ['skin', 'stubble'], hair: ['hair', 'brow'], iris: ['iris'], lip: ['lip']}, {skin: '#E49A7E', hair: '#3A2A22', iris: '#6A8AA8', lip: '#C8605A'}, look, model.box);
  const neckTints = headTints(id + 'n', neck, {skin: ['neck'], hair: [], iris: [], lip: []}, {skin: '#E49A7E', hair: '#000', iris: '#000', lip: '#000'}, look, neck.box);
  const C = NOLE_CUT;
  return (
    <g transform={look.mirror ? 'scale(-1 1)' : undefined}>
      <Engraved id={id + '-neck'} model={neck} stock={STOCK.cert} ink={INK.cert} pitch={pitch} clip={polyD([[-400, -400], [400, -400], [400, 400], [-400, 400]])} tints={neckTints} margin={8} shadow={[4, 6, 4, 0.5]} />
      <path d={polyD(C.cavity)} fill="#140608" />
      <g transform={`rotate(${jaw} ${C.hinge[0]} ${C.hinge[1]})`}>
        <Engraved id={id + '-jaw'} model={model} stock={STOCK.cert} ink={INK.cert} pitch={pitch} clip={clipBelow(C.line)} tints={tints} margin={8} shadow={[4, 6, 4, 0.5]} />
      </g>
      <Engraved id={id + '-skull'} model={model} stock={STOCK.cert} ink={INK.cert} pitch={pitch} clip={clipAbove(C.line)} tints={tints} margin={8} shadow={[4, 6, 4, 0.5]} />
    </g>
  );
};

/** Silhouette-only path data of the heads (rig coords) for cast shadows. */
export const noleHeadSil = (p: NoleToneParams = {}) =>
  noleTone({...p, tilt: 0, phone: false})
    .paths.filter((q) => !q.line && ((q.transform ?? '').startsWith('rotate') || q.hue === 'neck'))
    .map((q) => q.d)
    .join(' ');
