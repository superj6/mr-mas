// Episode 3 · scene 2: master-lock picture layouts.
import {defineScene, layouts} from '../../kit';
import {drawStory} from '../../art/story';
const L=layouts();
L.add("2.01", {st: "art/story.ts \u00b7 corkboard", face: {"CORKBOARD-GUY": "room", "SECOND-TRUTHER": "room"}, draw: drawStory});
L.add("2.02", {st: "art/story.ts \u00b7 corkboard", face: {"SECOND-TRUTHER": "room", "CORKBOARD-GUY": "room"}, draw: drawStory});
L.add("2.03", {st: "art/story.ts \u00b7 corkboard", face: {"CORKBOARD-GUY": "room", "COOK": "room", "SECOND-TRUTHER": "room"}, draw: drawStory});
L.add("2.04", {st: "art/story.ts \u00b7 corkboard", face: {}, draw: drawStory});
export const SCENE=defineScene({scene: "2",layouts:L.all});
