// Episode 3 · scene 10: master-lock picture layouts.
import {defineScene, layouts} from '../../kit';
import {drawStory} from '../../art/story';
const L=layouts();
L.add("10.01", {st: "art/story.ts \u00b7 darkroom-clock", face: {"STAFFER": "room", "MAS": "room"}, draw: drawStory});
L.add("10.02", {st: "art/story.ts \u00b7 darkroom-clock", face: {}, draw: drawStory});
L.add("10.03", {st: "art/story.ts \u00b7 darkroom-clock", face: {}, draw: drawStory});
L.add("10.04", {st: "art/story.ts \u00b7 darkroom-clock", face: {"MAS": "room"}, draw: drawStory});
export const SCENE=defineScene({scene: "10",layouts:L.all});
