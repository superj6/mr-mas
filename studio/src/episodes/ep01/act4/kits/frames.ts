// MR. MAS — ep01 act4 kits preview: frame definitions (ids: kits-<scene>). Render a still with --frame=N.
import type {FrameDef} from '../../../../shared/frame-def';
import {KitScene} from './Kits';
import {SCENES} from './scenes';

export const frames: FrameDef[] = Object.entries(SCENES).map(([name, s]) => ({
  id: `kits-${name}`, component: KitScene, props: {scene: name}, durationInFrames: s.frames, fps: 24,
}));
