// Episode 3 · scene 6: master-lock picture layouts.
import {defineScene, layouts} from '../../kit';
import {drawStory} from '../../art/story';
const L=layouts();
L.add("6.01", {st: "art/story.ts \u00b7 stadium-box", face: {}, draw: drawStory});
L.add("6.02", {st: "art/story.ts \u00b7 stadium-box", face: {"MAS": "room", "MAON": "room"}, draw: drawStory});
export const SCENE=defineScene({scene: "6",layouts:L.all});
