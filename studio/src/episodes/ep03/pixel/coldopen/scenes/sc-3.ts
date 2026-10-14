// Episode 3 · scene 3: master-lock picture layouts.
import {defineScene, layouts} from '../../kit';
import {drawStory} from '../../art/story';
const L=layouts();
L.add("3.01", {st: "art/story.ts \u00b7 strawberry-post", face: {"MAS": "room"}, draw: drawStory});
L.add("3.02", {st: "art/story.ts \u00b7 strawberry-post", face: {}, draw: drawStory});
L.add("3.03", {st: "art/story.ts \u00b7 strawberry-post", face: {}, draw: drawStory});
export const SCENE=defineScene({scene: "3",layouts:L.all});
