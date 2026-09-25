// MR. MAS — Ep1 Act Four · rooms A (background artist): own dev entry. Registers only this builder's frames.
//   npx remotion still src/episodes/ep01/act4/rooms-a/entry.tsx ep01a4-rooms-<plate> ../out/ep01/act4/assets/rooms-a/<plate>.png --bundle-cache=false --log=error
import {registerRoot} from 'remotion';
import {makeRoot} from '../../../../dev/makeRoot';
import {frames} from './frames';

registerRoot(makeRoot(frames));
