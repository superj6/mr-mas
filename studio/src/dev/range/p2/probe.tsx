// Prototype 2 · the one-frame GL probe (shared spec: "after a one-frame probe that prints the WebGL renderer string").
//   npx remotion still src/dev/range/p2/entry.tsx range-p2-probe <scratch>/probe.png --gl=angle --log=info
// It prints the unmasked renderer string to the browser console (Remotion forwards it) and paints it on the still.
import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, useDelayRender} from 'remotion';

export const glInfo = (): {renderer: string; vendor: string; webgl2: boolean; maxTex: number} => {
  const cv = document.createElement('canvas');
  const gl2 = cv.getContext('webgl2');
  const gl = (gl2 ?? cv.getContext('webgl')) as WebGLRenderingContext | null;
  if (!gl) return {renderer: 'NO WEBGL', vendor: '-', webgl2: false, maxTex: 0};
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
  const vendor = String(ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR));
  return {renderer, vendor, webgl2: !!gl2, maxTex: gl.getParameter(gl.MAX_TEXTURE_SIZE) as number};
};

export const Probe: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const {delayRender, continueRender} = useDelayRender();
  useLayoutEffect(() => {
    const h = delayRender('probe');
    const info = glInfo();
    // eslint-disable-next-line no-console
    console.log(`[p2-probe] WebGL renderer: ${info.renderer} | vendor: ${info.vendor} | webgl2: ${info.webgl2} | maxTex: ${info.maxTex}`);
    const ctx = ref.current!.getContext('2d')!;
    ctx.fillStyle = '#04050a';
    ctx.fillRect(0, 0, 1920, 1080);
    ctx.fillStyle = '#7fe6de';
    ctx.font = '32px monospace';
    ctx.fillText(`renderer: ${info.renderer}`, 40, 80);
    ctx.fillText(`vendor: ${info.vendor}  webgl2: ${info.webgl2}  maxTex: ${info.maxTex}`, 40, 130);
    continueRender(h);
  }, [delayRender, continueRender]);
  return (
    <AbsoluteFill>
      <canvas ref={ref} width={1920} height={1080} />
    </AbsoluteFill>
  );
};
