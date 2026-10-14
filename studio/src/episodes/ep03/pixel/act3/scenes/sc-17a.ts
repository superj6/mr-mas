// Episode 3 · scene 17A: master-lock picture layouts.
import {defineScene, layouts} from '../../kit';
import {drawStory} from '../../art/story';
const L=layouts();
L.add("17A.01", {st: "art/story.ts \u00b7 keycap", face: {}, draw: drawStory});
L.add("17A.02", {st: "art/story.ts \u00b7 beach-call", face: {"LIFEGUARD": "room", "GERG": "room"}, draw: drawStory});
L.add("17A.03", {st: "art/story.ts \u00b7 beach-call", face: {"GERG": "room"}, draw: drawStory});
L.add("17A.04", {st: "art/story.ts \u00b7 beach-call", face: {"MAS": "room"}, draw: drawStory});
L.add("17A.05", {st: "art/story.ts \u00b7 beach-call", face: {"GERG": "room"}, draw: drawStory});
L.add("17A.06", {st: "art/story.ts \u00b7 keycap", face: {}, draw: drawStory});
export const SCENE=defineScene({scene: "17A",layouts:L.all});
