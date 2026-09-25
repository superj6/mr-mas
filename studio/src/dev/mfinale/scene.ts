// MR. MAS — mfinale: the span as ONE PixelScene definition (pure: runs in Remotion and in the Node preview).
// draw / palette / switch / after all take the GLOBAL intro frame (see timeline.ts); the Remotion component
// converts its local frame before calling in. Span: 540-719 (skyline, title, bookend). Bar 9 (480-539) is the
// roll call's (src/dev/mrollcall); the old CHATGTP / FIRED / BACK slot (slot.ts, callart.ts) is Ep1-only now.
import {Buf} from '../../shared/pixel/px';
import type {PixelSceneProps, SwitchSpec, DrawResult} from '../../shared/pixel/compose';
import {T} from './timeline';
import {drawSkyline, setStars, duskStars} from './skyline';
import {drawTitle, titleSwitch, titleAfter} from './title';
import {drawBook, bookSwitch, bookAfter} from './bookend';

setStars(duskStars());

export type SceneDef = Pick<PixelSceneProps, 'draw' | 'after' | 'palette' | 'switch' | 'bg'>;

const draw = (fb: Buf, g: number): void | DrawResult => {
  if (g < T.title) return void drawSkyline(fb, g);
  if (g < T.book) return drawTitle(fb, g);
  return drawBook(fb, g);
};

const sw = (g: number): SwitchSpec[] | null => {
  if (g >= T.title && g < T.book) return titleSwitch(g);
  if (g >= T.book) return bookSwitch(g);
  return null;
};

export const mfinaleScene: SceneDef = {
  draw,
  switch: sw,
  after: (ui, g) => {
    if (g >= T.title && g < T.book) return titleAfter(ui, g);
    if (g >= T.book) return bookAfter(ui, g);
  },
};

/** the same scene addressed by LOCAL composition frame (0 = global `start`) */
export const localScene = (start: number): SceneDef => ({
  draw: (fb, f) => draw(fb, f + start),
  switch: (f) => sw(f + start),
  after: (ui, f) => mfinaleScene.after!(ui, f + start),
});
