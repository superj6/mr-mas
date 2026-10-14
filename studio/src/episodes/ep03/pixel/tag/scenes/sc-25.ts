// Episode 3 · scene 25: master-lock picture layouts.
import {defineScene, layouts} from '../../kit';
import {drawStory} from '../../art/story';
const L=layouts();
L.add("25.01", {st: "art/story.ts \u00b7 frozen-bay", face: {}, draw: drawStory});
export const SCENE=defineScene({scene: "25",layouts:L.all});
