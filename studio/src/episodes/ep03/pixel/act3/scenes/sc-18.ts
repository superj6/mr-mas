// Episode 3 · scene 18: master-lock picture layouts.
import {defineScene, layouts} from '../../kit';
import {drawStory} from '../../art/story';
const L=layouts();
L.add("18.01", {st: "art/story.ts \u00b7 writing-room", face: {"ADELINA": "room", "MARIO": "room"}, draw: drawStory});
L.add("18.02", {st: "art/story.ts \u00b7 writing-room", face: {"ADELINA": "room", "MARIO": "room"}, draw: drawStory});
L.add("18.03", {st: "art/story.ts \u00b7 writing-room", face: {"ADELINA": "room", "MARIO": "room"}, draw: drawStory});
L.add("18.04", {st: "art/story.ts \u00b7 writing-room", face: {"LUNCHMAS": "room", "ADELINA": "room", "MARIO": "room"}, draw: drawStory});
L.add("18.05", {st: "art/story.ts \u00b7 writing-room", face: {"LUNCHMAS": "room", "ADELINA": "room", "MARIO": "room"}, draw: drawStory});
L.add("18.06", {st: "art/story.ts \u00b7 paper-bridge", face: {}, draw: drawStory});
export const SCENE=defineScene({scene: "18",layouts:L.all});
