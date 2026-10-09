// MR. MAS — Ep2 v1 pixel pipeline (a copy of the Ep1 v3 pipeline, studio/src/episodes/ep01/pixel/, which stays locked):
// THE SHOT-SPEC INTERFACE. A segment is `<seg>/shots.ts` (export SEGMENT = defineSegment({...})): the segment's lock
// (./data.ts, from tools/lock.py) and one Layout per shot. Ep2 writes the layouts ONE MODULE PER SCENE,
// `<seg>/scenes/sc-<scene>.ts` (export SCENE = defineScene({scene, layouts})), and shots.ts merges them (fromScenes), so
// the per-scene render (tools/render.ts `scenes`) can hash each scene's own code and re-render only the scenes that changed.
// The host (frame.ts) does everything else: the band, rails, Mas's V.O. line, subtitles, lip-sync data, whips and other
// transitions, GLYPH layers, stand-ins for shots with no layout, reviewer slates, the review margin. See README.md.
//
//   // <seg>/scenes/sc-4a.ts
//   import {defineScene, layouts, held, mouth} from '../../kit';
//   const L = layouts();
//   L.add('5.03', {st: 'rooms/bullpen, the two desks (held)', face: {GERG: 'lip', MAS: 'lip'},
//     marks: {push: ['w', 'e1-a1-5-01', 'shipping', 0]},
//     draw: (fb, k, sh, f) => { held(fb, 'a1:bullpen', drawBullpenWide); gergAt(fb, mouth(sh, k, 'GERG'), k >= sh.marks.push); }});
//   export const SCENE = defineScene({scene: '4A', layouts: L.all});
//   // <seg>/shots.ts
//   import {defineSegment, fromScenes} from '../spec';
//   import {LOCK} from './data';
//   import {SCENE as S4A} from './scenes/sc-4a';
//   export const SEGMENT = defineSegment({seg: 'act1', lock: LOCK, layouts: fromScenes(S4A)});
//
// A layout draws the 480 x 270 show frame's ROOM AREA (rows 0..RH-1 = 203; the band below is the host's) at shot frame
// k and returns what the host should do with it (LayoutOut). `f` is the frame inside the SCENE (Ep2; Ep1 passed the act
// frame): sh.s - sh.sceneS + k, the same wherever the scene sits in the act, so a scene renders alone (the per-scene
// cache) and in the act to the same pixels. It must be pure: the same (k, sh, f) always draws the same pixels (Node and
// Remotion render the same frames, chunks and scenes render in parallel). A scene module may read nothing at run time
// that its imports don't carry; a file it needs (an overlay, a PNG) is named in defineScene({assets}) so the cache hashes it.
import type {Buf} from '../../../shared/pixel/px';
import type {GlyphLayer} from '../../../shared/pixel/glyph';
import type {Face, PxShot, SegLock} from './types';
import type {Anchor} from './anchors';

export type {Anchor};
export interface LayoutOut {
  /** live GLYPH layers: real glyph tokens, drawn by the Remotion host at the output scale (Node splices those frames) */
  layers?: GlyphLayer[];
  /** the layout drew the whole 480 x 270 frame: no band, no V.O. line, no subtitles */
  full?: boolean;
  /** no V.O. line this frame (the layout types it itself, or it would cover something) */
  noVo?: boolean;
  /** no rail text this frame (the band is still drawn) */
  noRail?: boolean;
  /** no burned-in dialogue subtitles this frame */
  noSubs?: boolean;
  /** a print over the finished frame: 'blueprint' (the BLUEPRINT_PRINT palette) or any function of the buffer */
  print?: 'blueprint' | ((fb: Buf) => void);
  /** the layout's own stand-in fallback drew this frame (Act Four's drawShot5 stick fallback) */
  fallback?: boolean;
  /** overrides Layout.st / Layout.standin for this frame (drawShot5 reports its own) */
  st?: string;
  standin?: boolean;
  caption?: string;
}
export type Draw = (fb: Buf, k: number, sh: PxShot, f: number) => LayoutOut | void;

/** a cut's transition, drawn by the host: 'dip' (to / from black in palette steps), 'flash' (lighten), 'dither' (exit
 *  only: a bayer-threshold dissolve into the next shot's first frame, pixel-pure) */
export interface Transition { kind: 'dip' | 'flash' | 'dither'; frames: number }

export interface Layout {
  draw: Draw;
  /** what it is built from (the review margin and the ledger print it): name the rooms / cast / kits used */
  st: string;
  /** it still holds a drawn stand-in somewhere (the margin marks it pink) */
  standin?: boolean;
  /** a short label for the margin (Act Four: 'R' | 'C' | 'N'); the review config may name it */
  kind?: string;
  /** story marks, resolved on this shot at load (anchors.ts; the same grammar as lock.py). They extend and override
   *  the lock's marks; the layout reads sh.marks.name */
  marks?: Record<string, Anchor>;
  /** who shows a mouth in this framing, by speaker (UPPER): 'lip' (a drawn track) | 'room' (open / rest) | null (none).
   *  Overrides the lock's plan for this shot. Speakers not named keep the lock's (default: no mouth) */
  face?: Record<string, Face>;
  /** a 2-frame whip: 'in' (the first 2 frames) or 'out' (the last 2). Overrides the lock's `whip` */
  whip?: 'in' | 'out' | null;
  enter?: Transition;
  exit?: Transition;
  /** it may return GLYPH layers: the Node renderer probes its frames and splices the browser host's frames there */
  glyph?: boolean;
  /** RGBA frames made outside the pipeline (act1 11.04: the 3D claymation CLOD), laid over this shot's picture and
   *  review frame, room area only, by the Node renderer (tools/render.ts; the Remotion host does not draw them).
   *  `manifest` (repo-relative) lists the layer PNGs (1920 x 1080, straight alpha, bottom first) per shot frame k; the
   *  renderer refuses it, loudly, when its shot length or its check line's start differ from this lock's */
  overlay?: {manifest: string};
  /** Ep2: the scene module that defined it (set by fromScenes; a layout without one is hashed with all of shots.ts) */
  scene?: string;
  /** Ep2: repo-relative files it reads at run time (fromScenes adds its scene's), hashed by the per-scene cache */
  assets?: string[];
}

export interface SegmentOptions {
  /** the told-twice side badge in the band (Act Four v5). v3 drops it (v3-plan §1.4): off by default */
  badge: boolean;
  /** Mas's V.O. typed above the band (pov-and-framing §5.2): x 12, baseline 198, his cyan one step down, 0.5 chars / f */
  vo: 'typed' | 'off';
  /** V.O. always lowercase (§5.3) */
  voLowercase: boolean;
  /** dialogue subtitles burned into the band ('burn'), or only in the .srt beside the render ('off') */
  subs: 'off' | 'burn';
  /** what a shot with no layout draws: 'stick' (stick figures of its cast on a plain set, texts on top) or 'plate'
   *  (a labelled plate with the stick's caption). Either way it is tagged STAND-IN in the picture and reported */
  standin: 'stick' | 'plate';
  /** the in-picture STAND-IN tag (on by default: a missing layout is never silent) */
  standinTag: boolean;
  /** segment-specific switches (Act Four: j1) */
  [k: string]: unknown;
}
export const DEFAULT_OPTIONS: SegmentOptions = {badge: false, vo: 'typed', voLowercase: true, subs: 'off', standin: 'stick', standinTag: true};

/** the review frame's labels (frame.ts review()): the margin and the transcript band */
export interface ReviewConfig {
  title: string; // 'MR. MAS · EP2 · ACT ONE'
  subtitle: string; // 'PIXEL v3 · LOCK act1'
  kindNames: Record<string, string>; // Layout.kind -> the margin's LAYOUT line
  sideBadge: boolean; // the HIS SIDE / THE BOARD'S SIDE box in the margin
  durNote: string; // '2.50 S, <durNote>'
  soundLabel: string; // 'SOUND · TEMP TRACK = ...'
  fallbackText: string; // a layout's own fallback drew the frame
  standinText: string; // the host's stand-in drew the frame (no layout)
  mixMissing: ReadonlySet<string>; // sound spots ("SHOT name @k") the temp mix lacks
  textFix: (id: string, text: string) => string; // the transcript's words (a facts fix the lock does not carry)
  speakerLabel: (sub: {shown: string; who: string}) => string; // a line heard through a speaker
  seqColour: (seq: {id: string; chapter: string}, i: number) => number;
}

/** frames only a browser host can draw (beyond GLYPH layers): e.g. Act Four's J1 "CANCELLED" (React / SVG). The Node
 *  renderer splices the Remotion host's frames there; the Remotion host draws them with a React component registered
 *  by `<seg>/browser.tsx` (export BROWSER = {Component}), which the Node bundle never imports */
export interface BrowserFrames { frames: (f: number, opts: SegmentOptions) => boolean; note?: string }

export interface PixelSegment {
  seg: string;
  lock: SegLock;
  layouts: Record<string, Layout>;
  options?: Partial<SegmentOptions>;
  review?: Partial<ReviewConfig>;
  browser?: BrowserFrames;
}
export const defineSegment = (s: PixelSegment): PixelSegment => s;

/** Ep2: one scene's layouts (a module `<seg>/scenes/sc-<slug>.ts`, slug = sceneSlug(scene)). `assets`: repo-relative
 *  files the layouts read at run time (overlays, images), hashed with the scene by the per-scene cache */
export interface SceneSpec { scene: string; layouts: Record<string, Layout>; assets?: string[] }
export const defineScene = (s: SceneSpec): SceneSpec => s;
/** a scene id as a file name: lowercase, anything but letters and digits -> '-' ('4A' -> '4a', 'F2.2' -> 'f2-2') */
export const sceneSlug = (scene: string) => String(scene).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'x';
/** every scene module's layouts as one map for defineSegment, each tagged with its scene (Layout.scene) so the
 *  per-scene cache knows whose code a shot runs; a shot id registered twice throws */
export const fromScenes = (...scenes: SceneSpec[]): Record<string, Layout> => {
  const all: Record<string, Layout> = {};
  for (const sc of scenes) {
    for (const [id, L] of Object.entries(sc.layouts)) {
      if (all[id]) throw new Error(`pixel layouts: ${id} registered twice (scene ${sc.scene} and ${all[id].scene ?? '?'})`);
      all[id] = {...L, scene: sc.scene, assets: [...(L.assets ?? []), ...(sc.assets ?? [])]};
    }
  }
  return all;
};

/** a small registry for a shots.ts: L.add(ids, layout); L.all is the map defineSegment takes */
export const layouts = () => {
  const all: Record<string, Layout> = {};
  const add = (ids: string | string[], def: Layout) => {
    for (const id of ([] as string[]).concat(ids)) {
      if (all[id]) throw new Error(`pixel layouts: ${id} registered twice`);
      all[id] = def;
    }
  };
  return {all, add};
};
