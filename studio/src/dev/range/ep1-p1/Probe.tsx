// MR. MAS — range E1-P1: the one-frame GL probe (run before every GPU render). It prints the WebGL renderer string
// into the frame and to the console, so a render never silently falls back to SwiftShader on the CPU.
import React, {useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender} from 'remotion';
import {probeRenderer} from '../p3/Probe';

export const Probe: React.FC = () => {
  const [s, setS] = useState('');
  const [h] = useState(() => delayRender('gl probe'));
  const done = useRef(false);
  useLayoutEffect(() => {
    if (done.current) return;
    done.current = true;
    const r = probeRenderer();
    // eslint-disable-next-line no-console
    console.log('[ep1-p1 gl-probe] ' + r);
    setS(r);
    continueRender(h);
  }, [h]);
  const gpu = /Intel/.test(s);
  return (
    <AbsoluteFill style={{background: '#04050a', color: gpu ? '#7fe6de' : '#ec4a4a', fontFamily: 'monospace', fontSize: 28, padding: 30}}>
      <div>ep1-p1 gl-probe: {s}</div>
      <div style={{marginTop: 20}}>{gpu ? 'iGPU: OK' : 'NOT THE iGPU: do not render the cels on this backend'}</div>
    </AbsoluteFill>
  );
};
