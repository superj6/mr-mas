// MR. MAS — mfinale: the span as ONE PixelScene definition (pure: runs in Remotion and in the Node preview).
// draw / palette / switch / after all take the GLOBAL intro frame (see timeline.ts); the Remotion component
// converts its local frame before calling in. Span: 540-719 (skyline, title, bookend). Bar 9 (480-539) is the
// roll call's (src/dev/mrollcall); the old CHATGTP / FIRED / BACK slot (slot.ts, callart.ts) is Ep1-only now.
import {Buf} from '../../shared/pixel/px';
import type {PixelSceneProps, SwitchSpec, DrawResult} from '../../shared/pixel/compose';
import {T} from './timeline';
import {drawSkyline, setStars, duskStars} from './skyline';
import {drawTitle, titleSwitch, titleAfter} from './title';
import {drawBook, bookSwitch, bookAfter, EP1_BOOK} from './bookend';
import type {BookSlot} from './bookend';

setStars(duskStars());

export type SceneDef = Pick<PixelSceneProps, 'draw' | 'after' | 'palette' | 'switch' | 'bg'>;

const draw = (fb: Buf, g: number, sl: BookSlot = EP1_BOOK): void | DrawResult => {
  if (g < T.title) return void drawSkyline(fb, g);
  if (g < T.book) return drawTitle(fb, g);
  return drawBook(fb, g, sl);
};

const sw = (g: number): SwitchSpec[] | null => {
  if (g >= T.title && g < T.book) return titleSwitch(g);
  if (g >= T.book) return bookSwitch(g);
  return null;
};

/** the span for an episode's slot (its subtitle, and the cold open the bookend replays); Ep1's is mfinaleScene */
export const makeMfinaleScene = (sl: BookSlot = EP1_BOOK): SceneDef => ({
  draw: (fb, g) => draw(fb, g, sl),
  switch: sw,
  after: (ui, g) => {
    if (g >= T.title && g < T.book) return titleAfter(ui, g, sl.subtitle);
    if (g >= T.book) return bookAfter(ui, g);
  },
});
export const mfinaleScene: SceneDef = makeMfinaleScene();

/** the same scene addressed by LOCAL composition frame (0 = global `start`) */
export const localScene = (start: number, sl: BookSlot = EP1_BOOK): SceneDef => {
  const sc = sl === EP1_BOOK ? mfinaleScene : makeMfinaleScene(sl);
  return {
    draw: (fb, f) => sc.draw!(fb, f + start),
    switch: (f) => sw(f + start),
    after: (ui, f) => sc.after!(ui, f + start),
  };
};
