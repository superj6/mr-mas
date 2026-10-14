// Episode 3 · scene 1: master-lock picture layouts.
import {defineScene, layouts} from '../../kit';
import {drawStory} from '../../art/story';
const L=layouts();
L.add("1.01", {st: "art/story.ts \u00b7 skyline-yarn", face: {}, draw: drawStory});
export const SCENE=defineScene({scene: "1",layouts:L.all});
