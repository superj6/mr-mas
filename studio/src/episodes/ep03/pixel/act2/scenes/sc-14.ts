// Episode 3 · scene 14: master-lock picture layouts.
import {defineScene, layouts} from '../../kit';
import {drawStory} from '../../art/story';
const L=layouts();
L.add("14.01", {st: "art/story.ts \u00b7 odometer", face: {}, draw: drawStory});
L.add("14.02", {st: "art/story.ts \u00b7 nonprofit", face: {"AUHSOJ": "room", "MAS": "room"}, draw: drawStory});
L.add("14.03", {st: "art/story.ts \u00b7 investor-pledge", face: {"INVESTOR": "room", "MAS": "room"}, draw: drawStory});
L.add("14.04", {st: "art/story.ts \u00b7 investor-pledge", face: {"INVESTOR": "room"}, draw: drawStory});
L.add("14.05", {st: "art/story.ts \u00b7 nonprofit", face: {}, draw: drawStory});
L.add("14.06", {st: "art/story.ts \u00b7 odometer", face: {}, draw: drawStory});
L.add("14.07", {st: "art/story.ts \u00b7 nonprofit", face: {"AUHSOJ": "room", "MAS": "room"}, draw: drawStory});
L.add("14.08", {st: "art/story.ts \u00b7 nonprofit", face: {}, draw: drawStory});
L.add("14.09", {st: "art/story.ts \u00b7 odometer", face: {}, draw: drawStory});
export const SCENE=defineScene({scene: "14",layouts:L.all});
