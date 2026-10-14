// Episode 3 · scene 15: master-lock picture layouts.
import {defineScene, layouts} from '../../kit';
import {drawStory} from '../../art/story';
const L=layouts();
L.add("15.01", {st: "art/story.ts \u00b7 tpool-sale", face: {}, draw: drawStory});
L.add("15.02", {st: "art/story.ts \u00b7 tpool-sale", face: {"MAS": "room"}, draw: drawStory});
export const SCENE=defineScene({scene: "15",layouts:L.all});
