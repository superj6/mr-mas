// Episode 3 · scene 24: master-lock picture layouts.
import {defineScene, layouts} from '../../kit';
import {drawStory} from '../../art/story';
const L=layouts();
L.add("24.01", {st: "art/story.ts \u00b7 check-slot", face: {}, draw: drawStory});
L.add("24.02", {st: "art/story.ts \u00b7 check-slot", face: {}, draw: drawStory});
L.add("24.03", {st: "art/story.ts \u00b7 reflection", face: {}, draw: drawStory});
L.add("24.04", {st: "art/story.ts \u00b7 reveal-rumpt", face: {"RUMPT": "room"}, draw: drawStory});
L.add("24.05", {st: "art/story.ts \u00b7 reveal-rumpt", face: {}, draw: drawStory});
export const SCENE=defineScene({scene: "24",layouts:L.all});
