// MR. MAS — range/p3: the one-frame GL probe. Prints the WebGL renderer string (the iGPU, or SwiftShader when the
// desktop login's device permission is missing) into the frame and to the console, so a GPU render never silently
// falls back to the CPU. Run it before every p3 render:
//   npx remotion still src/dev/range/p3/entry.tsx p3-probe $SCRATCH/probe.png --gl=angle --log=verbose
import React, {useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender} from 'remotion';

export const probeRenderer = (): string => {
  const cv = document.createElement('canvas');
  const gl = cv.getContext('webgl2');
  if (!gl) return 'NO WEBGL2';
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  const r = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  const lose = gl.getExtension('WEBGL_lose_context');
  lose?.loseContext();
  return String(r);
};

export const Probe: React.FC = () => {
  const [s, setS] = useState('');
  const [h] = useState(() => delayRender('gl probe'));
  const done = useRef(false);
  useLayoutEffect(() => {
    if (done.current) return;
    done.current = true;
    const r = probeRenderer();
    // eslint-disable-next-line no-console
    console.log('[p3 gl-probe] ' + r);
    setS(r);
    continueRender(h);
  }, [h]);
  const gpu = /Intel/.test(s);
  return (
    <AbsoluteFill style={{background: '#04050a', color: gpu ? '#7fe6de' : '#ec4a4a', fontFamily: 'monospace', fontSize: 40, padding: 80}}>
      <div>p3 gl-probe</div>
      <div style={{marginTop: 30}}>{s}</div>
      <div style={{marginTop: 30}}>{gpu ? 'iGPU: OK' : 'NOT THE iGPU: do not render p3 on this backend'}</div>
    </AbsoluteFill>
  );
};
