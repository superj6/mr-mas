// MR. MAS · Ep2's outro: the Remotion host (`outro-b-ep2`, 360 f, 15.0 s). One PixelScene (scene.ts); the frame is the
// outro frame. A still: --frame=<o>.
import React from 'react';
import {PixelScene} from '../../../shared/pixel/PixelScene';
import {makeScene} from './scene';

const SCENE = makeScene();
export const OutroEp2: React.FC<{hold?: number}> = ({hold}) => <PixelScene {...SCENE} hold={hold} />;
