// Episode 3 · scene 12: master-lock picture layouts.
import {defineScene, layouts} from '../../kit';
import {drawStory} from '../../art/story';
const L=layouts();
L.add("12.01", {st: "art/story.ts \u00b7 woodrose", face: {}, draw: drawStory});
L.add("12.02", {st: "art/story.ts \u00b7 breakout", face: {}, draw: drawStory});
L.add("12.03", {st: "art/story.ts \u00b7 woodrose", face: {"GERG": "room", "MAS": "room"}, draw: drawStory});
L.add("12.04", {st: "art/story.ts \u00b7 woodrose", face: {"GERG": "room", "MAS": "room"}, draw: drawStory});
L.add("12.05", {st: "art/story.ts \u00b7 chairs", face: {}, draw: drawStory});
L.add("12.06", {st: "art/story.ts \u00b7 beach-call", face: {"GERG": "room"}, draw: drawStory});
export const SCENE=defineScene({scene: "12",layouts:L.all});
