// Episode 3 · scene 11: master-lock picture layouts.
import {defineScene, layouts} from '../../kit';
import {drawStory} from '../../art/story';
const L=layouts();
L.add("11.01", {st: "art/story.ts \u00b7 door-install", face: {"INSTALLER": "room", "MAS": "room"}, draw: drawStory});
L.add("11.02", {st: "art/story.ts \u00b7 door-interview", face: {"MAS": "room", "RIMA": "room"}, draw: drawStory});
L.add("11.03", {st: "art/story.ts \u00b7 door-interview", face: {"RIMA": "room", "MAS": "room"}, draw: drawStory});
L.add("11.04", {st: "art/story.ts \u00b7 door-interview", face: {"MAS": "room", "RIMA": "room"}, draw: drawStory});
L.add("11.05", {st: "art/story.ts \u00b7 door-turbine", face: {}, draw: drawStory});
L.add("11.06", {st: "art/story.ts \u00b7 door-turbine", face: {"INSTALLER": "room", "MAS": "room"}, draw: drawStory});
L.add("11.07", {st: "art/story.ts \u00b7 door-interview", face: {}, draw: drawStory});
L.add("11.08", {st: "art/story.ts \u00b7 class-photo", face: {}, draw: drawStory});
L.add("11.09", {st: "art/story.ts \u00b7 class-photo", face: {"MAS": "room"}, draw: drawStory});
export const SCENE=defineScene({scene: "11",layouts:L.all});
