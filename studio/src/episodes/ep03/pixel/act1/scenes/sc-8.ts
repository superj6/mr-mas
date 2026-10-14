// Episode 3 · scene 8: master-lock picture layouts.
import {defineScene, layouts} from '../../kit';
import {drawStory} from '../../art/story';
const L=layouts();
L.add("8.01", {st: "art/story.ts \u00b7 stadium-kick", face: {"CHATGTP": "room"}, draw: drawStory});
L.add("8.02", {st: "art/story.ts \u00b7 stadium-kick", face: {}, draw: drawStory});
L.add("8.03", {st: "art/story.ts \u00b7 stadium-box", face: {"MAS": "room", "MAON": "room"}, draw: drawStory});
L.add("8.04", {st: "art/story.ts \u00b7 stadium-box", face: {}, draw: drawStory});
L.add("8.05", {st: "art/story.ts \u00b7 stadium-kick", face: {}, draw: drawStory});
L.add("8.06", {st: "art/story.ts \u00b7 stadium-kick", face: {"ADELINA": "room", "MARIO": "room"}, draw: drawStory});
L.add("8.07", {st: "art/story.ts \u00b7 stadium-box", face: {"MAS": "room", "MAON": "room"}, draw: drawStory});
L.add("8.08", {st: "art/story.ts \u00b7 stadium-shutter", face: {}, draw: drawStory});
L.add("8.09", {st: "art/story.ts \u00b7 stadium-fancam", face: {}, draw: drawStory});
L.add("8.10", {st: "art/story.ts \u00b7 stadium-kick", face: {"SUCRAM": "room"}, draw: drawStory});
L.add("8.11", {st: "art/story.ts \u00b7 stadium-box", face: {"MAS": "room", "MAON": "room"}, draw: drawStory});
L.add("8.12", {st: "art/story.ts \u00b7 stadium-box", face: {}, draw: drawStory});
export const SCENE=defineScene({scene: "8",layouts:L.all});
