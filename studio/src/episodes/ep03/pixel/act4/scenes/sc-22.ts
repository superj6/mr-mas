// Episode 3 · scene 22: master-lock picture layouts.
import {defineScene, layouts} from '../../kit';
import {drawStory} from '../../art/story';
const L=layouts();
L.add("22.01", {st: "art/story.ts \u00b7 shipmas", face: {}, draw: drawStory});
L.add("22.02", {st: "art/story.ts \u00b7 launch-pro", face: {}, draw: drawStory});
L.add("22.03", {st: "art/story.ts \u00b7 launch-pro", face: {"CUSTOMER": "room", "GERG": "room"}, draw: drawStory});
L.add("22.04", {st: "art/story.ts \u00b7 launch-pro", face: {"CUSTOMER": "room", "MAS": "room"}, draw: drawStory});
L.add("22.05", {st: "art/story.ts \u00b7 launch-aros", face: {"MAS": "room"}, draw: drawStory});
L.add("22.06", {st: "art/story.ts \u00b7 launch-elppa", face: {"CHATGTP": "room", "MAS": "room"}, draw: drawStory});
L.add("22.07", {st: "art/story.ts \u00b7 shipmas", face: {}, draw: drawStory});
L.add("22.08", {st: "art/story.ts \u00b7 shipmas", face: {"CORKBOARD-GUY": "room", "SECOND-TRUTHER": "room"}, draw: drawStory});
L.add("22.09", {st: "art/story.ts \u00b7 launch-o3", face: {}, draw: drawStory});
L.add("22.10", {st: "art/story.ts \u00b7 launch-o3", face: {}, draw: drawStory});
L.add("22.11", {st: "art/story.ts \u00b7 launch-o3", face: {"MARIO": "room"}, draw: drawStory});
L.add("22.12", {st: "art/story.ts \u00b7 launch-o3", face: {"CORKBOARD-GUY": "room", "MAS": "room"}, draw: drawStory});
export const SCENE=defineScene({scene: "22",layouts:L.all});
