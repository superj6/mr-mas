// Episode 3 · scene 16: master-lock picture layouts.
import {defineScene, layouts} from '../../kit';
import {drawStory} from '../../art/story';
const L=layouts();
L.add("16.01", {st: "art/story.ts \u00b7 nobel-monitor", face: {}, draw: drawStory});
L.add("16.02", {st: "art/story.ts \u00b7 nobel-monitor", face: {"STAFFER": "room", "MAS": "room"}, draw: drawStory});
L.add("16.03", {st: "art/story.ts \u00b7 nobel-monitor", face: {}, draw: drawStory});
export const SCENE=defineScene({scene: "16",layouts:L.all});
