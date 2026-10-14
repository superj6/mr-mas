// Episode 3 · scene 19: master-lock picture layouts.
import {defineScene, layouts} from '../../kit';
import {drawStory} from '../../art/story';
const L=layouts();
L.add("19.01", {st: "art/story.ts \u00b7 paper-exodus", face: {}, draw: drawStory});
L.add("19.02", {st: "art/story.ts \u00b7 paper-exodus", face: {"LUNCHMAS": "room", "ADELINA": "room"}, draw: drawStory});
export const SCENE=defineScene({scene: "19",layouts:L.all});
