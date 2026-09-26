// MR. MAS — shared pixel engine: GENERATED-VIDEO inserts, the Remotion side.
//
// Two ways to put a converted clip (studio/tools/genvideo/pixelize.py) into a composition:
//
// 1. INSIDE A PIXEL SHOT (the normal path): <GenVideoScene> loads the clip's native drawings as palette-
//    constrained Bufs and hands the current one to your draw(), so masks, palette switches, GLYPH and the render
//    front all apply to it. Clip folders live under studio/public/ (pixelize.py --out-frames public/genvideo/<id>).
//
//      <GenVideoScene clip="genvideo/sky-01" placement={{from: 12, loop: true}}
//        draw={(fb, f, gen) => {
//          drawRoom(fb, f);                                            // our scene
//          if (gen) blitGen(fb, gen, {mask: maskFromColors(fb, SKY, WINDOW), dx: -20});  // the clip, only in the sky
//        }}
//        switch={(f) => f >= 40 && f < 45 ? {type: 'glyph', mask: cone} : null} />
//
//    Each drawing is loaded with delayRender, so a render never shows a frame without its drawing.
//
// 2. A WHOLE-FRAME INSERT with nothing of ours on top: <GenVideoPlayer src="genvideo/sky-01.mp4"/> plays the
//    1080p MP4 (pixelize.py --out-mp4, already 4x nearest) with <OffthreadVideo>. Cheaper, but it is H.264, so
//    colours are no longer exact palette entries: use it only for straight cuts to a full-frame clip.
//
// The join rule (four transitions only; match cuts for inserts) is in genclip.ts.
import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {AbsoluteFill, OffthreadVideo, cancelRender, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import {Buf, copyBuf} from './px';
import {PixelScene} from './PixelScene';
import type {PixelSceneProps, DrawResult} from './compose';
import {GenClipManifest, GenPlacement, bufFromRGBA, genDrawingAt} from './genclip';

const manifests = new Map<string, Promise<GenClipManifest>>();
const drawings = new Map<string, Buf>();
const MAX_CACHED = 96; // ~50 MB of native Bufs at most per tab

const clipUrl = (clip: string, file: string) => staticFile(`${clip.replace(/\/+$/, '')}/${file}`);

/** Load (once per tab) a clip's clip.json. `clip` is the folder under studio/public/. */
export const loadGenManifest = (clip: string): Promise<GenClipManifest> => {
  let p = manifests.get(clip);
  if (!p) {
    p = fetch(clipUrl(clip, 'clip.json')).then((r) => {
      if (!r.ok) throw new Error(`genvideo: ${clip}/clip.json: HTTP ${r.status} (convert it with tools/genvideo/pixelize.py --out-frames public/${clip})`);
      return r.json() as Promise<GenClipManifest>;
    });
    manifests.set(clip, p);
  }
  return p;
};

/** Load one native drawing as a Buf (cached). Pixels are read back exactly (no smoothing, no colour management). */
export const loadGenDrawing = async (clip: string, file: string): Promise<Buf> => {
  const key = `${clip}/${file}`;
  const hit = drawings.get(key);
  if (hit) return hit;
  const img = new Image();
  img.src = clipUrl(clip, file);
  await img.decode();
  const c = document.createElement('canvas');
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const ctx = c.getContext('2d', {willReadFrequently: true, colorSpace: 'srgb'} as CanvasRenderingContext2DSettings)!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0);
  const b = bufFromRGBA(ctx.getImageData(0, 0, c.width, c.height).data, c.width, c.height);
  if (drawings.size >= MAX_CACHED) drawings.delete(drawings.keys().next().value as string);
  drawings.set(key, b);
  return b;
};

/** The clip's manifest (null until loaded; the render waits for it). */
export const useGenClip = (clip: string): GenClipManifest | null => {
  const [m, setM] = useState<GenClipManifest | null>(null);
  const [handle] = useState(() => delayRender(`genvideo manifest ${clip}`));
  useEffect(() => {
    loadGenManifest(clip).then((j) => { setM(j); continueRender(handle); }).catch((e) => cancelRender(e));
  }, [clip, handle]);
  return m;
};

/**
 * The Buf of one drawing (null while loading). Holds the render with delayRender until the drawing is decoded
 * and COMMITTED (continueRender runs in a passive effect, after children's layout effects, so a PixelScene
 * below has already opened its own delayRender for the new draw).
 */
export const useGenDrawing = (clip: string, file: string | null): Buf | null => {
  const key = file ? `${clip}/${file}` : null;
  const [st, setSt] = useState<{key: string; buf: Buf} | null>(() => (key && drawings.has(key) ? {key, buf: drawings.get(key)!} : null));
  const pending = useRef<number | null>(null);
  useLayoutEffect(() => {
    if (!key || !file || st?.key === key) return;
    if (pending.current === null) pending.current = delayRender(`genvideo ${key}`);
    let live = true;
    loadGenDrawing(clip, file).then((buf) => { if (live) setSt({key, buf}); }).catch((e) => cancelRender(e));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => {
    if (st && st.key === key && pending.current !== null) {
      continueRender(pending.current);
      pending.current = null;
    }
  }, [st, key]);
  return st && st.key === key ? st.buf : null;
};

/** The drawing that shows at the current frame (and the manifest). */
export const useGenFrame = (clip: string, placement: GenPlacement = {}, frame?: number) => {
  const current = useCurrentFrame();
  const f = frame ?? current;
  const m = useGenClip(clip);
  const di = m ? genDrawingAt(m, f, placement) : null;
  const buf = useGenDrawing(clip, m && di !== null ? m.drawings[di] : null);
  return {manifest: m, drawing: di, buf};
};

export interface GenVideoSceneProps extends Omit<PixelSceneProps, 'draw'> {
  /** clip folder under studio/public/ (e.g. 'genvideo/sky-01') */
  clip: string;
  placement?: GenPlacement;
  /**
   * Paint the frame. `gen` is the clip's current drawing (null outside the clip with outside: 'none').
   * Default: the drawing, full frame.
   */
  draw?: (fb: Buf, frame: number, gen: Buf | null) => void | DrawResult;
}

/** A PixelScene with a generated clip available to draw(). */
export const GenVideoScene: React.FC<GenVideoSceneProps> = ({clip, placement, draw, ...rest}) => {
  const f = useCurrentFrame();
  const {manifest, drawing, buf} = useGenFrame(clip, placement, rest.hold ?? f);
  const ready = manifest !== null && (drawing === null || buf !== null);
  const sceneDraw = useMemo(
    () => (fb: Buf, frame: number) => (draw ? draw(fb, frame, buf) : buf ? void copyBuf(fb, buf) : undefined),
    [draw, buf],
  );
  if (!ready) return <AbsoluteFill style={{background: '#04050a'}} />;
  return <PixelScene {...rest} draw={sceneDraw} />;
};

/** Whole-frame insert of a converted 1080p MP4 (under studio/public/). Straight cuts only; see the header. */
export const GenVideoPlayer: React.FC<{src: string; startFrom?: number; style?: React.CSSProperties}> = ({src, startFrom, style}) => (
  <AbsoluteFill style={{background: '#04050a'}}>
    <OffthreadVideo src={staticFile(src)} startFrom={startFrom} muted style={{width: '100%', height: '100%', imageRendering: 'pixelated', ...style}} />
  </AbsoluteFill>
);
