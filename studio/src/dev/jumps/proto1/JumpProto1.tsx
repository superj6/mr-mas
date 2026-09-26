// MR. MAS — style-jump prototype 1 · J1 "CANCELLED": the Remotion host (1920 x 1080, 24 fps, 144 f).
// Pixel frames go through the engine's presentBuf at 4x nearest; the jump frames draw the certificate (SVG) in the
// room area and keep the pixel rail band (rows 203–269) on top and in place: the UI never jumps (bible §3.3).
import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, cancelRender, continueRender, delayRender, useCurrentFrame} from 'remotion';
import {presentBuf} from '../../../shared/pixel/glyphDraw';
import {Paper} from '../../../shared/fx/Grain';
import {useFontsReady} from '../../../shared/title/common';
import {FONT} from '../../../shared/theme/fonts';
import {pixelFrame, RH, PixelOpts} from './pixel';
import {Certificate, CH, HOLES_CLIP, HoleRims} from './Certificate';
import {P, phaseOf} from './timeline';

const SC = 4;

/** The grid seen through the certificate's cuts, in the sheet's shadow (final polish). Every pixel is pressed into
 *  one navy band (the call's own blues), and each is set by its difference from its 3 x 3 neighbourhood (a cut spans
 *  about 3 x 3 native pixels): so every cut averages the SAME tone -- every letter of CANCELLED reads the same at phone
 *  size, over a face, a lamp or a dark tile alike (fix-pass lesson 18) -- while the blocks of the frame it left show
 *  plainly inside each cut at full size. A printed dot is flat; a cut shows the grid. */
const SHADE_LO = [12, 16, 32], SHADE_HI = [84, 104, 160], SHADE_GAIN = 2.4;
const lumOf = (c: number) => (0.2126 * ((c >> 16) & 255) + 0.7152 * ((c >> 8) & 255) + 0.0722 * (c & 255)) / 255;
const shadeFrame = (c: Uint32Array | number[], w: number, h: number) => {
  const L = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) L[i] = lumOf(c[i]);
  const out = new Array<number>(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let s = 0, n = 0;
    for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
      const X = x + i, Y = y + j;
      if (X < 0 || Y < 0 || X >= w || Y >= h) continue;
      s += L[Y * w + X]; n++;
    }
    const t = Math.max(0, Math.min(1, 0.5 + SHADE_GAIN * (L[y * w + x] - s / n)));
    const ch = (k: number) => Math.round(SHADE_LO[k] + (SHADE_HI[k] - SHADE_LO[k]) * t);
    out[y * w + x] = (ch(0) << 16) | (ch(1) << 8) | ch(2);
  }
  for (let i = 0; i < w * h; i++) c[i] = out[i];
};

/** Paint a 480 x 270 frame (or only its rows y0..y1) at 4x into a canvas the size of those rows. `shade` presses
 *  the frame into the cuts' shadow band (above); `clip` is a CSS clip-path. */
const PixelLayer: React.FC<{p: number; y0?: number; y1?: number; opts?: PixelOpts; shade?: boolean; clip?: string}> = ({p, y0 = 0, y1 = 270, opts, shade = false, clip}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const h = delayRender(`jump-proto-1 pixel p${p}`);
    try {
      const cv = ref.current;
      if (cv) {
        const fb = pixelFrame(p, opts);
        if (shade) shadeFrame(fb.c, fb.w, fb.h);
        const ctx = cv.getContext('2d')!;
        presentBuf(ctx, fb, {scale: SC, ox: 0, oy: 0, crop: [0, y0, 480, y1 - y0]});
      }
      continueRender(h);
    } catch (e) {
      cancelRender(e as Error);
    }
  }, [p, y0, y1, opts, shade]);
  return (
    <canvas ref={ref} width={1920} height={(y1 - y0) * SC}
      style={{position: 'absolute', left: 0, top: y0 * SC, width: 1920, height: (y1 - y0) * SC, imageRendering: 'pixelated', clipPath: clip}} />
  );
};

export interface JumpProto1Props {
  /** hold a clip frame (stills) */
  hold?: number;
  /** the in: 'print' (the press flash: the room area one flat paper tone) or 'step' (family step k 2, rejected) */
  pop?: 'print' | 'step';
  /** debug: the certificate without its grade */
  flat?: boolean;
}

export const JumpProto1: React.FC<JumpProto1Props> = ({hold, pop = 'print', flat = false}) => {
  const cur = useCurrentFrame();
  const p = hold ?? cur;
  const ready = useFontsReady([`800 150px ${FONT.title}`, `400 24px ${FONT.title}`, `italic 400 22px ${FONT.title}`]);
  const ph = phaseOf(p);
  const opts = React.useMemo(() => ({pop}), [pop]);
  if (!ready) return <AbsoluteFill style={{background: '#04050a'}} />;
  if (ph !== 'cert') {
    return (
      <AbsoluteFill style={{background: '#04050a'}}>
        <PixelLayer p={p} opts={opts} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: '#04050a'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: CH, overflow: 'hidden'}}>
        <Certificate perforated={p >= P.perf} pupilStep={p >= P.pupils} grade={!flat} />
        <Paper amount={0.22} seed={4} />
        {p >= P.perf && (
          <>
            {/* the cuts: the grid the jump left (the click's frame), in the sheet's shadow, seen through each hole.
                The grid literally cuts through the record, and it is what the snap returns to. */}
            <PixelLayer p={P.click} y0={0} y1={RH} opts={opts} shade clip={HOLES_CLIP} />
            <HoleRims />
          </>
        )}
      </div>
      <PixelLayer p={p} y0={RH} y1={270} opts={opts} />
    </AbsoluteFill>
  );
};
