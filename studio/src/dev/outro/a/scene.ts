// MR. MAS — outro A as ONE PixelScene definition, addressed by COMPOSITION frame (PRE stand-in frames, then o0-o284).
//   stand-in 1 s -> o0-2 the act's picture steps down inside the bezel -> o3-224 the session log (the pane opens
//   o3-5; header o6; 3 credit lines o9-o69, paced to a reader; the terms print whole at o85, the pointer at o145) ->
//   o225-228 the pull-back -> o229-251 ROOM, the pane on his monitor, the moth to its light -> o252-254 the window
//   closes into the cursor, his light goes -> o255 the cursor comes on, the room one step down -> o265 the moth
//   settles beside it -> o270-277 the last blink, the room going down around it -> o278-284 black
// The camera moves one way only: out of the act, onto his monitor, then out to him. The reveal happens once, last.
// There is no band: the only text on screen is the pane's (plus the lookdev slug).
import {Buf, W, H, rect} from '../../../shared/pixel/px';
import {PAL} from '../../../shared/pixel/palette';
import type {PixelSceneProps} from '../../../shared/pixel/compose';
import {PRE, O, toO, fadeStep} from './timeline';
import {EP1, EpText, drawSlug, drawTag} from './text';
import {standin} from './standin';
import {drawInsert1, miniPane} from './pane';
import {drawRoom, drawPull, SCREEN, LOOP_CURSOR} from './room';
import {drawMoth, mothPos, cursorVisible} from './moth';

export type SceneDef = Pick<PixelSceneProps, 'draw' | 'after' | 'bg'>;

const miniCache = new Map<string, Buf>();
const mini = (t: EpText, close: 0 | 1 | 2 | 3) => {
  const key = `${t.ep}:${close}`;
  let m = miniCache.get(key);
  if (!m) { m = miniPane(SCREEN.w, SCREEN.h, t, close); miniCache.set(key, m); }
  return m;
};

const lastInsert = new Map<number, Buf>();
/** the insert's last frame (o224), the source of the pull-back drawing */
const insertLast = (t: EpText) => {
  let b = lastInsert.get(t.ep);
  if (!b) { b = new Buf(W, H, PAL.N0); drawInsert1(b, O.pull - 1, t); lastInsert.set(t.ep, b); }
  return b;
};

// ------------------------------------------------------------------ the Orb's look: at the monitor, then the moth
const LOOK_MONITOR: [number, number] = [-0.62, 0.12];
/** the moth's room position -> an iris direction (the monitor's centre maps to LOOK_MONITOR); held for 4 frames at
 *  a time, so the iris re-aims in whole drawings the way it does in the cold open, never a smooth track */
const orbLook = (o: number): [number, number] => {
  const k = o - (((o - O.mothIn) % 4) + 4) % 4;
  const p = mothPos(Math.max(k, O.mothIn));
  if (!p || o < O.mothIn + 4) return LOOK_MONITOR;
  const lx = Math.max(-0.86, Math.min(-0.45, LOOK_MONITOR[0] + (p[0] - 170) * 0.0016));
  const ly = Math.max(-0.3, Math.min(0.32, LOOK_MONITOR[1] + (p[1] - 100) * 0.0045));
  return [Math.round(lx * 50) / 50, Math.round(ly * 50) / 50];
};
/** the iris opens a touch when the moth settles (interest), in 2 drawings */
const orbAperture = (o: number) => (o < O.mothLand + 2 ? 0.5 : o < O.mothLand + 4 ? 0.56 : 0.62);
const lidAt = (o: number): 0 | 1 | 2 => (o === O.blink || o === O.blink + 2 ? 1 : o === O.blink + 1 ? 2 : 0);

export const outroDraw = (t: EpText) => (fb: Buf, f: number) => {
  const o = toO(f);
  if (o < 0) { fb.c.set(standin().c); return; }
  if (o < O.pull) return void drawInsert1(fb, o, t);
  if (o < O.room) return void drawPull(fb, insertLast(t), (o - O.pull) as 0 | 1);
  if (o >= O.black) { fb.c.fill(PAL.N0); return; }
  const close: 0 | 1 | 2 | 3 = o < O.close ? 0 : o < O.close + 1 ? 1 : o < O.close + 2 ? 2 : 3;
  const dark = o >= O.close + 2;
  const fade = fadeStep(o);
  drawRoom(fb, o, {
    screen: mini(t, close),
    mode: dark ? 'dark' : 'pane',
    k: o - O.close === 1 ? 1 : 0,
    look: orbLook(o),
    aperture: orbAperture(o),
    lid: lidAt(o),
    dim: o >= O.dark,
    fade,
    zoom: o === O.room ? 1 : o === O.room + 1 ? 2 : 0,
    clock: t.clock,
  });
  // the cursor at the loop point: emissive (it survives the dim), on the beat grid from O.cursorOn
  const cur = cursorVisible(o);
  if (cur) { const [cx, cy] = LOOP_CURSOR; rect(cx, cy, 4, 8, fb.ink(PAL.C7)); }
  drawMoth(fb, o, dark, cur, fade);
};

export const outroAfter = (ui: Buf, f: number) => {
  const o = toO(f);
  if (o < 0) { drawTag(ui, 'stand-in: the last frame of Act 4 v4'); drawSlug(ui); return; }
  drawSlug(ui);
};

export const outroScene = (t: EpText = EP1): SceneDef => ({draw: outroDraw(t), after: outroAfter, bg: PAL.N0});
export {W, H, PRE};
