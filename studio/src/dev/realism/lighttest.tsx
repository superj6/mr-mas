import React from 'react';
import {AbsoluteFill} from 'remotion';

const Sphere: React.FC<{id: string; kul?: number}> = ({id, kul}) => (
  <g>
    <radialGradient id={id + 'g'}>
      <stop offset="0" stopColor="#fff" />
      <stop offset="0.6" stopColor="#bbb" />
      <stop offset="1" stopColor="#000" />
    </radialGradient>
    <filter id={id} x={-120} y={-120} width={240} height={240} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feColorMatrix in="SourceGraphic" type="luminanceToAlpha" result="h" />
      <feDiffuseLighting in="h" surfaceScale={40} diffuseConstant={1} lightingColor="#fff" {...(kul ? {kernelUnitLength: kul} : {})}>
        <feDistantLight azimuth={180} elevation={25} />
      </feDiffuseLighting>
      <feComposite in2="SourceAlpha" operator="in" />
    </filter>
    <circle r={100} fill={`url(#${id}g)`} filter={`url(#${id})`} />
  </g>
);

export const LightTest: React.FC = () => (
  <AbsoluteFill style={{background: '#333'}}>
    <svg width={1920} height={1080}>
      <g transform="translate(200 200) scale(1)"><Sphere id="a" /></g>
      <g transform="translate(600 300) scale(2)"><Sphere id="b" /></g>
      <g transform="translate(1100 300) scale(1)"><Sphere id="c" kul={1} /></g>
      <g transform="translate(1500 300) scale(2)"><Sphere id="d" kul={1} /></g>
    </svg>
  </AbsoluteFill>
);
