// Episode 3 · scene 20: master-lock picture layouts.
import {defineScene, layouts} from '../../kit';
import {drawStory} from '../../art/story';
const L=layouts();
L.add("20.01", {st: "art/story.ts \u00b7 amazon-rent", face: {}, draw: drawStory});
L.add("20.02", {st: "art/story.ts \u00b7 amazon-rent", face: {}, draw: drawStory});
L.add("20.03", {st: "art/story.ts \u00b7 election", face: {}, draw: drawStory});
L.add("20.04", {st: "art/story.ts \u00b7 podium", face: {}, draw: drawStory});
L.add("20.05", {st: "art/story.ts \u00b7 darkroom-clock", face: {"STAFFER": "room", "MAS": "room"}, draw: drawStory});
L.add("20.06", {st: "art/story.ts \u00b7 darkroom-clock", face: {}, draw: drawStory});
export const SCENE=defineScene({scene: "20",layouts:L.all});
