// Episode 3 · scene 9: master-lock picture layouts.
import {defineScene, layouts} from '../../kit';
import {drawStory} from '../../art/story';
const L=layouts();
L.add("9.01", {st: "art/story.ts \u00b7 corkboard", face: {"CORKBOARD-GUY": "room", "SECOND-TRUTHER": "room"}, draw: drawStory});
export const SCENE=defineScene({scene: "9",layouts:L.all});
