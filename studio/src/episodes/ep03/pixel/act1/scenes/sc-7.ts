// Episode 3 · scene 7: master-lock picture layouts.
import {defineScene, layouts} from '../../kit';
import {drawStory} from '../../art/story';
const L=layouts();
L.add("7.01", {st: "art/story.ts \u00b7 attention", face: {}, draw: drawStory});
L.add("7.02", {st: "art/story.ts \u00b7 attention", face: {}, draw: drawStory});
L.add("7.03", {st: "art/story.ts \u00b7 attention", face: {"MAS": "room"}, draw: drawStory});
L.add("7.04", {st: "art/story.ts \u00b7 stadium-box", face: {}, draw: drawStory});
export const SCENE=defineScene({scene: "7",layouts:L.all});
