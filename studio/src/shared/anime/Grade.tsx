import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Grain, Vignette} from '../fx/Grain';

/** Final grade shared by the anime frames: top/bottom para, vignette, fine grain (boil the seed on 2s). */
export const AnimeGrade: React.FC<{seed?: number}> = ({seed = 1}) => (
  <>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,8,26,0.35) 0%, rgba(8,8,26,0) 22%, rgba(8,8,26,0) 70%, rgba(6,6,20,0.45) 100%)', pointerEvents: 'none'}} />
    <Vignette amount={0.55} color="#05050F" />
    <Grain amount={0.018} seed={seed} />
  </>
);

/**
 * Satsuei "diffusion": bright areas bloom softly. Wrap the scene in <g id={sceneId}> and render this
 * right after it inside the same <svg>. The matrix keeps only values above ~0.45, then blurs + screens.
 */
export const DiffusionDefs: React.FC<{id: string; blur?: number}> = ({id, blur = 14}) => (
  <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
    <feColorMatrix type="matrix" values="2.4 0 0 0 -1.35  0 2.4 0 0 -1.35  0 0 2.4 0 -1.35  0 0 0 1 0" />
    <feGaussianBlur stdDeviation={blur} />
  </filter>
);
