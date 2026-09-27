// MR. MAS — Ep1 Act Four v5 · J1 "CANCELLED", ported (STYLE-J1; prep-artbuild-r3): THE COMPONENT a v5 host drops in at
// the Cancel click. Conditional: style-range §6.1a (15:39) withdrew J1 and keeps the masked GLYPH dissolve at the click;
// the two must NEVER both play (style-jumps). The v5 host keeps the dissolve by default and shows this only when the
// room rules for J1 (for the both-ways cut and the blind read, art-needs-v5 §1.1).
//
// Interface (1920 x 1080; the show frame at 4x, integer nearest):
//   <J1Cancelled t={t} frame={host} click={hostAtClick} pixel={{fClick}} />
//     t       frames since the Cancel click's pressed drawing (timing.ts). Mount it for 0 <= t < J1_LEN (60) in place
//             of the host's own picture (j1Active(t)); from t 60 the host's own S1.09 frames resume.
//     frame   the host's 480 x 270 show frame at the current act frame (J1 keeps its rail band, rows 203-269, and in
//             the pop and the snap edits a COPY of it: j1PixelFrame)
//     click   the host's frame at the click (t 0): the grid the jump left, seen, shaded, through every cut
//     pixel   J1PixelOpts: fClick (the click's act frame), and the grid geometry / neon guard if the v5 layout moved them
//     grade   the certificate's lighting grade (default on; off = flat paper, debug)
// The host must NOT also draw S1.09's tile drop / GLYPH dissolve during t 0-59 (J1 draws its own exit: the scar tile
// falling through its slot). Sound: J1's own temp sound pass (silence, the punch) is src/dev/jumps/proto1/tools/sound.py,
// built for lock v2; the v5 mix must re-spot it on the click (not done here).
import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, cancelRender, continueRender, delayRender} from 'remotion';
import {Buf} from '../../../../../shared/pixel/px';
import {presentBuf} from '../../../../../shared/pixel/glyphDraw';
import {Paper} from '../../../../../shared/fx/Grain';
import {useFontsReady} from '../../../../../shared/title/common';
import {FONT} from '../../../../../shared/theme/fonts';
import {Certificate, CH, HOLES_CLIP, HoleRims} from './Certificate';
import {j1PixelFrame, J1PixelOpts, RH} from './pixel';
import {J1_T, j1PhaseOf} from './timing';

export {J1_LEN, j1Active, j1PhaseOf} from './timing';
const SC = 4;

/** The grid seen through the cuts, in the sheet's shadow (the prototype's final polish, unchanged): every pixel pressed
 *  into one navy band and set by its difference from its 3 x 3 neighbourhood, so every letter of CANCELLED reads the
 *  same over a face, a lamp or a dark tile, while the blocks of the frame show inside each cut at full size. */
const SHADE_LO = [12, 16, 32], SHADE_HI = [84, 104, 160], SHADE_GAIN = 2.4;
const lumOf = (c: number) => (0.2126 * ((c >> 16) & 255) + 0.7152 * ((c >> 8) & 255) + 0.0722 * (c & 255)) / 255;
export const j1Shade = (src: Buf): Buf => {
  const w = src.w, h = src.h;
  const L = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) L[i] = lumOf(src.c[i]);
  const out = new Buf(w, h, 0);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let s = 0, n = 0;
    for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
      const X = x + i, Y = y + j;
      if (X < 0 || Y < 0 || X >= w || Y >= h) continue;
      s += L[Y * w + X]; n++;
    }
    const t = Math.max(0, Math.min(1, 0.5 + SHADE_GAIN * (L[y * w + x] - s / n)));
    const ch = (k: number) => Math.round(SHADE_LO[k] + (SHADE_HI[k] - SHADE_LO[k]) * t);
    out.c[y * w + x] = (ch(0) << 16) | (ch(1) << 8) | ch(2);
  }
  return out;
};

/** a 480 x 270 Buf (or rows y0..y1 of it) at 4x nearest; clip = a CSS clip-path */
export const BufLayer: React.FC<{buf: Buf; y0?: number; y1?: number; clip?: string; tag: string}> = ({buf, y0 = 0, y1 = 270, clip, tag}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const hd = delayRender(`j1 ${tag}`);
    try {
      const cv = ref.current;
      if (cv) presentBuf(cv.getContext('2d')!, buf, {scale: SC, ox: 0, oy: 0, crop: [0, y0, 480, y1 - y0]});
      continueRender(hd);
    } catch (e) {
      cancelRender(e as Error);
    }
  }, [buf, y0, y1, tag]);
  return (
    <canvas ref={ref} width={1920} height={(y1 - y0) * SC}
      style={{position: 'absolute', left: 0, top: y0 * SC, width: 1920, height: (y1 - y0) * SC, imageRendering: 'pixelated', clipPath: clip}} />
  );
};

export interface J1CancelledProps {
  t: number;
  frame: Buf;
  click: Buf;
  pixel: J1PixelOpts;
  grade?: boolean;
}
export const J1Cancelled: React.FC<J1CancelledProps> = ({t, frame, click, pixel, grade = true}) => {
  const ready = useFontsReady([`800 150px ${FONT.title}`, `400 24px ${FONT.title}`, `italic 400 22px ${FONT.title}`]);
  const ph = j1PhaseOf(t);
  const shown = React.useMemo(() => j1PixelFrame(t, frame, pixel), [t, frame, pixel]);
  const shaded = React.useMemo(() => (ph === 'cert' && t >= J1_T.perf ? j1Shade(click) : null), [ph, t, click]);
  if (!ready) return <AbsoluteFill style={{background: '#04050a'}} />;
  if (ph !== 'cert') return <AbsoluteFill style={{background: '#04050a'}}><BufLayer buf={shown} tag={`t${t}`} /></AbsoluteFill>;
  return (
    <AbsoluteFill style={{background: '#04050a'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: CH, overflow: 'hidden'}}>
        <Certificate perforated={t >= J1_T.perf} pupilStep={t >= J1_T.pupils} grade={grade} />
        <Paper amount={0.22} seed={4} />
        {shaded && (
          <>
            <BufLayer buf={shaded} y0={0} y1={RH} clip={HOLES_CLIP} tag={`cuts t${t}`} />
            <HoleRims />
          </>
        )}
      </div>
      <BufLayer buf={frame} y0={RH} y1={270} tag={`rail t${t}`} />
    </AbsoluteFill>
  );
};
