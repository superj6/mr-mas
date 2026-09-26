// MR. MAS — Prototype 2 · real 3D · THE CLIFF (style-range §7.2; 11.A, Ep11 #3). The Remotion host.
// p0-59 and p315-359 are the pixel frame (the room, the lit cursor, the band sliding out / in); p60-314 are the 3D
// render of the same room extruded from its own pixels (p60 = p59 bit for bit), the push into his screen, the nest,
// the loss plot, the lip, the fall, and the landing that ends on the exact pixel frame (p314 = p315's room).
// variant 'native': 480 x 270, presented 4x nearest, the reveal's camera on 2s (everything after it on 1s).
// variant 'hd': 1920 x 1080 rendered 2x and palette-snapped, on 1s.
import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, useCurrentFrame, useDelayRender} from 'remotion';
import {Buf} from '../../../shared/pixel/px';
import {PAL, hex} from '../../../shared/pixel/palette';
import {NW, NH, T} from './params';
import {pixelFrame, roomLayers} from './pixel';
import {glInit, render3d, Variant} from './gl';

const present = (ctx: CanvasRenderingContext2D, b: Buf, ox = 0, oy = 0, k = 4) => {
  const c = document.createElement('canvas');
  c.width = NW; c.height = NH;
  const cx = c.getContext('2d')!;
  const img = cx.createImageData(NW, NH);
  img.data.set(b.toRGBA());
  cx.putImageData(img, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(c, ox, oy, NW * k, NH * k);
};

export const is3D = (p: number) => p >= T.d3 && p < T.pixelBack;

export const P2: React.FC<{variant: Variant}> = ({variant}) => {
  const p = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  const {delayRender, continueRender, cancelRender} = useDelayRender();
  useLayoutEffect(() => {
    const h = delayRender(`p2 f${p}`);
    (async () => {
      const ctx = ref.current!.getContext('2d')!;
      ctx.fillStyle = hex(PAL.N0);
      ctx.fillRect(0, 0, 1920, 1080);
      if (!is3D(p)) present(ctx, pixelFrame(p));
      else {
        await glInit();
        const r = render3d(p, variant);
        if (r.native) present(ctx, r.native);
        else if (r.hd) ctx.putImageData(r.hd, 0, 0);
      }
    })().then(() => continueRender(h)).catch((e) => cancelRender(e));
  }, [p, variant, delayRender, continueRender, cancelRender]);
  return (
    <AbsoluteFill style={{background: hex(PAL.N0)}}>
      <canvas ref={ref} width={1920} height={1080} />
    </AbsoluteFill>
  );
};

/** lookdev: up to 16 frames of the clip as a 4 x 4 grid of native frames (one still = 16 frames), labelled */
export const P2Grid: React.FC<{frames: number[]}> = ({frames}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const {delayRender, continueRender, cancelRender} = useDelayRender();
  useLayoutEffect(() => {
    const h = delayRender('p2 grid');
    (async () => {
      const ctx = ref.current!.getContext('2d')!;
      ctx.fillStyle = '#04050a'; ctx.fillRect(0, 0, 1920, 1080);
      await glInit();
      const lv: string[] = [];
      frames.slice(0, 16).forEach((p, k) => {
        const ox = (k % 4) * NW, oy = Math.floor(k / 4) * NH;
        if (!is3D(p)) { present(ctx, pixelFrame(p), ox, oy, 1); lv.push(`p${p}`); }
        else { const r = render3d(p, 'native'); present(ctx, r.native!, ox, oy, 1); lv.push(`p${p} L${r.level}`); }
        ctx.fillStyle = '#ffe5a3'; ctx.font = '12px monospace'; ctx.fillText(lv[k], ox + 3, oy + 12);
      });
    })().then(() => continueRender(h)).catch((e) => cancelRender(e));
  }, [frames, delayRender, continueRender, cancelRender]);
  return <AbsoluteFill><canvas ref={ref} width={1920} height={1080} /></AbsoluteFill>;
};

/** the exactness check: p59 (pixel) vs p60 (3D, native and hd), and p315 (pixel, minus the band) vs p314 (3D) */
export const P2Exact: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const {delayRender, continueRender, cancelRender} = useDelayRender();
  useLayoutEffect(() => {
    const h = delayRender('p2 exact');
    (async () => {
      await glInit();
      const ctx = ref.current!.getContext('2d')!;
      ctx.fillStyle = '#04050a'; ctx.fillRect(0, 0, 1920, 1080);
      const lines: string[] = [];
      const counts: number[] = [];
      const cmp = (a: Buf, b: Buf, label: string, ox: number, oy: number) => {
        let d = 0;
        const diff = new Buf(NW, NH, PAL.N0);
        for (let i = 0; i < NW * NH; i++) { diff.c[i] = a.c[i] === b.c[i] ? PAL.N2 : PAL.R3; if (a.c[i] !== b.c[i]) d++; }
        const c = document.createElement('canvas'); c.width = NW; c.height = NH;
        const cx = c.getContext('2d')!; const img = cx.createImageData(NW, NH); img.data.set(diff.toRGBA()); cx.putImageData(img, 0, 0);
        ctx.drawImage(c, ox, oy, NW * 2, NH * 2);
        lines.push(`${label}: ${d} px differ`);
        counts.push(d);
        // eslint-disable-next-line no-console
        console.log(`[p2-exact] ${label}: ${d} px differ`);
      };
      const sample = (hd: ImageData) => {
        const hb = new Buf(NW, NH, 0);
        for (let y = 0; y < NH; y++) for (let x = 0; x < NW; x++) { const o = ((y * 4 + 1) * 1920 + x * 4 + 1) * 4; hb.c[y * NW + x] = (hd.data[o] << 16) | (hd.data[o + 1] << 8) | hd.data[o + 2]; }
        return hb;
      };
      const p59 = pixelFrame(59);
      cmp(p59, render3d(60, 'native').native!, 'p59 pixel vs p60 3D (native)', 0, 0);
      cmp(p59, sample(render3d(60, 'hd').hd!), 'p59 pixel vs p60 3D (hd, sampled)', 960, 0);
      const land = roomLayers(T.pixelBack, 'plot').frame;
      cmp(land, render3d(T.land, 'native').native!, `p${T.pixelBack} room (no band) vs p${T.land} 3D (native)`, 0, 540);
      cmp(land, sample(render3d(T.land, 'hd').hd!), `p${T.pixelBack} room (no band) vs p${T.land} 3D (hd, sampled)`, 960, 540);
      ctx.fillStyle = '#7fe6de'; ctx.font = '28px monospace';
      lines.forEach((l, i) => ctx.fillText(l, 980, 40 + i * 40));
      // machine-readable: each count as one pixel's RGB on the bottom row (tools/build.sh reads them back)
      counts.forEach((d, i) => { ctx.fillStyle = `rgb(${(d >> 16) & 255},${(d >> 8) & 255},${d & 255})`; ctx.fillRect(i * 8, 1072, 8, 8); });
    })().then(() => continueRender(h)).catch((e) => cancelRender(e));
  }, [delayRender, continueRender, cancelRender]);
  return <AbsoluteFill><canvas ref={ref} width={1920} height={1080} /></AbsoluteFill>;
};
