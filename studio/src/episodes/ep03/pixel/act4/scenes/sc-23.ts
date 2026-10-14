// Episode 3 · scene 23: master-lock picture layouts.
import {defineScene, layouts} from '../../kit';
import {drawStory} from '../../art/story';
const L=layouts();
L.add("23.01", {st: "art/story.ts \u00b7 terrace-line", face: {}, draw: drawStory});
L.add("23.02", {st: "art/story.ts \u00b7 terrace-line", face: {}, draw: drawStory});
L.add("23.03", {st: "art/story.ts \u00b7 terrace-nole", face: {"NOLE": "room", "MAS": "room"}, draw: drawStory});
L.add("23.04", {st: "art/story.ts \u00b7 terrace-nole", face: {"NOLE": "room", "MAS": "room"}, draw: drawStory});
L.add("23.05", {st: "art/story.ts \u00b7 terrace-line", face: {}, draw: drawStory});
L.add("23.06", {st: "art/story.ts \u00b7 terrace-line", face: {"MIT-KOOC": "room", "MAS": "room"}, draw: drawStory});
L.add("23.07", {st: "art/story.ts \u00b7 reflection", face: {}, draw: drawStory});
L.add("23.08", {st: "art/story.ts \u00b7 terrace-line", face: {}, draw: drawStory});
export const SCENE=defineScene({scene: "23",layouts:L.all});
