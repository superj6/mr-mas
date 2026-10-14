// Episode 3 · scene 5: master-lock picture layouts.
import {defineScene, layouts} from '../../kit';
import {drawStory} from '../../art/story';
const L=layouts();
L.add("5.01", {st: "art/story.ts \u00b7 beach", face: {"GERG": "room"}, draw: drawStory});
export const SCENE=defineScene({scene: "5",layouts:L.all});
