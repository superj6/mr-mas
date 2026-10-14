// Episode 3 · scene 13: master-lock picture layouts.
import {defineScene, layouts} from '../../kit';
import {drawStory} from '../../art/story';
const L=layouts();
L.add("13.01", {st: "art/story.ts \u00b7 veto-hydra", face: {}, draw: drawStory});
L.add("13.02", {st: "art/story.ts \u00b7 veto-hydra", face: {"RENEIW": "room", "MOSWEN": "room"}, draw: drawStory});
L.add("13.03", {st: "art/story.ts \u00b7 veto-hydra", face: {}, draw: drawStory});
L.add("13.04", {st: "art/story.ts \u00b7 veto-hydra", face: {"RENEIW": "room", "MOSWEN": "room"}, draw: drawStory});
export const SCENE=defineScene({scene: "13",layouts:L.all});
