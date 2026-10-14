// Episode 3 · scene 21: master-lock picture layouts.
import {defineScene, layouts} from '../../kit';
import {drawStory} from '../../art/story';
const L=layouts();
L.add("21.01", {st: "art/story.ts \u00b7 lobby-return", face: {}, draw: drawStory});
L.add("21.02", {st: "art/story.ts \u00b7 lobby-return", face: {"GERG": "room", "MAS": "room"}, draw: drawStory});
L.add("21.03", {st: "art/story.ts \u00b7 class-photo", face: {}, draw: drawStory});
L.add("21.04", {st: "art/story.ts \u00b7 lobby-return", face: {"GERG": "room", "MAS": "room"}, draw: drawStory});
L.add("21.05", {st: "art/story.ts \u00b7 lobby-return", face: {"GERG": "room", "MAS": "room"}, draw: drawStory});
L.add("21.06", {st: "art/story.ts \u00b7 shipmas", face: {}, draw: drawStory});
export const SCENE=defineScene({scene: "21",layouts:L.all});
