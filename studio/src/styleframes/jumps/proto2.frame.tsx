// MR. MAS — style jump PROTOTYPE 2 · J3 "THE SKY OPENS" (Ep9, Act Two #23). show/bible/style-jumps.md §5.2.
// M1, the stakes become real, rung 1: in the dark room a fracture nucleates on the wall and runs through the city in
// the window to behind his head, and opens; the continuous-tone night shows through (graded within a stop of the
// pixel sky); the room cools except for him; it seals to a hairline. 1920 x 1080, 24 fps, 120 f (5.0 s): 30 f of
// pixel before the crack, 15 f after the seal.
// The frame is composed by src/dev/jumps/proto2/scene.ts (pure; the Node still tool uses the same function).
// Dev entry: src/dev/jumps/proto2/entry.tsx. Build + sound + mux: src/dev/jumps/proto2/tools/build.sh.
// INTERNAL: no frame of this prototype leaves the room before Ep9 airs (style-jumps §3.6).
import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, continueRender, delayRender, useCurrentFrame} from 'remotion';
import type {FrameDef} from '../../shared/frame-def';
import {compose, OUT_W, OUT_H} from '../../dev/jumps/proto2/scene';
import {N, FPS, T} from '../../dev/jumps/proto2/timing';

const J3: React.FC<{hold?: number}> = ({hold}) => {
  const frame = useCurrentFrame();
  const p = hold ?? frame;
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const h = delayRender(`jump-proto-2 p${p}`);
    const cv = ref.current;
    if (cv) {
      const ctx = cv.getContext('2d')!;
      const img = ctx.createImageData(OUT_W, OUT_H);
      compose(p, img.data);
      ctx.putImageData(img, 0, 0);
    }
    continueRender(h);
  }, [p]);
  return (
    <AbsoluteFill style={{background: '#04050a'}}>
      <canvas ref={ref} width={OUT_W} height={OUT_H} style={{width: '100%', height: '100%'}} />
    </AbsoluteFill>
  );
};

/** the review sheet: the brief's key frames, 4 x 2, each a quarter-size downsample of the real frame */
const SHEET: Array<[number, string]> = [
  [20, 'p20 pixel [W]'],
  [36, 'p36 the fracture runs'],
  [49, 'p49 behind him; Orb witnessed'],
  [56, 'p56 it opens (8)'],
  [80, 'p80 the pour (14), room cools'],
  [94, 'p94 the seal (4)'],
  [104, 'p104 the scar'],
  [116, 'p116 pixel, after'],
];
const Sheet: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const h = delayRender('jump-proto-2-sheet');
    const cv = ref.current!;
    const ctx = cv.getContext('2d')!;
    ctx.fillStyle = '#07080d';
    ctx.fillRect(0, 0, 1920, 1080);
    const tmp = document.createElement('canvas');
    tmp.width = OUT_W; tmp.height = OUT_H;
    const tx = tmp.getContext('2d')!;
    const img = tx.createImageData(OUT_W, OUT_H);
    const cw = 460, ch = 259, gx = 16, gy = 150;
    ctx.font = '600 30px "JetBrains Mono", monospace';
    ctx.fillStyle = '#c8cbd6';
    ctx.fillText('MR. MAS · STYLE JUMP PROTOTYPE 2 · J3 "THE SKY OPENS" · Ep9 #23 · M1 rung 1', 32, 60);
    ctx.font = '400 22px "JetBrains Mono", monospace';
    ctx.fillStyle = '#8a93a8';
    ctx.fillText(`1920x1080 · 24 fps · ${N} f · jump p${T.open}-${T.back - 1} (crack from p${T.crack}) · internal only`, 32, 98);
    SHEET.forEach(([p, label], k) => {
      compose(p, img.data);
      tx.putImageData(img, 0, 0);
      const x = 16 + (k % 4) * (cw + gx), y = gy + Math.floor(k / 4) * (ch + 110);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(tmp, 0, 0, OUT_W, OUT_H, x, y, cw, ch);
      ctx.fillStyle = '#c8cbd6';
      ctx.font = '500 22px "JetBrains Mono", monospace';
      ctx.fillText(label, x, y + ch + 34);
    });
    continueRender(h);
  }, []);
  return <canvas ref={ref} width={1920} height={1080} style={{width: '100%', height: '100%'}} />;
};

export const frames: FrameDef[] = [
  {id: 'jump-proto-2', component: J3, width: OUT_W, height: OUT_H, fps: FPS, durationInFrames: N},
  {id: 'jump-proto-2-sheet', component: Sheet, width: 1920, height: 1080},
];
