import type {FrameDef} from './shared/frame-def';
import {makeRoot} from './dev/makeRoot';

// Every file matching *.frame.tsx under src/ exports `frames: FrameDef[]`.
// Style frames, tests and intro scenes are added without touching this file.
const ctx = require.context('./', true, /\.frame\.tsx$/);
const defs: FrameDef[] = ctx.keys().flatMap((k: string) => (ctx(k).frames as FrameDef[]) ?? []);

export const Root = makeRoot(defs);
