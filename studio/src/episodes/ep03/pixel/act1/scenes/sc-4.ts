// Episode 3 · scene 4: master-lock picture layouts.
import {defineScene, layouts} from '../../kit';
import {drawStory} from '../../art/story';
const L=layouts();
L.add("4.01", {st: "art/story.ts \u00b7 lobby-handover", face: {}, draw: drawStory});
L.add("4.02", {st: "art/story.ts \u00b7 lobby-handover", face: {"GERG": "room", "MAS": "room"}, draw: drawStory});
L.add("4.03", {st: "art/story.ts \u00b7 lobby-handover", face: {}, draw: drawStory});
L.add("4.04", {st: "art/story.ts \u00b7 lobby-handover", face: {"MAS": "room", "GERG": "room"}, draw: drawStory});
L.add("4.05", {st: "art/story.ts \u00b7 lobby-handover", face: {"GERG": "room", "MAS": "room"}, draw: drawStory});
L.add("4.06", {st: "art/story.ts \u00b7 lobby-handover", face: {}, draw: drawStory});
L.add("4.07", {st: "art/story.ts \u00b7 lobby-handover", face: {"GERG": "room"}, draw: drawStory});
export const SCENE=defineScene({scene: "4",layouts:L.all});
