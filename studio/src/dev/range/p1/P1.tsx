// MR. MAS - style-range Prototype 1: THE READ (10.C) + a J4 placeholder, Ep10 #19. 480 f at 24 fps, 1920 x 1080.
//   p0-119    pixel pre-roll (G6 THE HOTSPOT, the band slides away, the dealer lifts the card)   pixel/scene.ts
//   p120-149  HD cel: the ECU key drawing of his eyes                                             anime/Eyes.tsx
//   p150-359  HD cel: the OTS, one continuous multiplane push to the dealer, then into its screen  anime/Push.tsx
//   p360-405  J4 placeholder: the machine's view opens out of the caret (full-frame GLYPH)          pixel/J4.tsx
//   p406-479  pixel tail (the band returns; his cursor lands on him and nothing sets; black)
// One backend for the whole clip (CPU, as the anime lookdev was approved).
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {PixelScene} from '../../../shared/pixel';
import {PIXEL_SCENE, isPixel} from './pixel/scene';
import {T} from './geo';
import {Eyes} from './anime/Eyes';
import {Push} from './anime/Push';
import {J4} from './pixel/J4';

export const P1: React.FC<{at?: number}> = ({at}) => {
  const cur = useCurrentFrame();
  const p = at ?? cur;
  if (p >= T.black) return <AbsoluteFill style={{background: '#04050A'}} />;
  if (isPixel(p)) return <PixelScene {...PIXEL_SCENE} hold={p} />;
  if (p >= T.j4) return <AbsoluteFill style={{background: '#04050A'}}><J4 p={p} /></AbsoluteFill>;
  return <AbsoluteFill style={{background: '#07060A'}}>{p < T.ots ? <Eyes p={p} /> : <Push p={p} />}</AbsoluteFill>;
};
