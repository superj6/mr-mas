// MR. MAS — pixelengine demo: the approved pixeladv room, recomposited so the WORLD and MAS can run on
// different clocks (freeze everything except Mas) and so Mas's coverage can be captured as a Mask.
// Mirrors src/dev/pixeladv/scene.ts renderScene() (read-only import of that builder's art).
import {Buf, W, H, clamp} from '../../shared/pixel/px';
import {PAL} from '../../shared/pixel/palette';
import {blitImg} from '../../shared/pixel/figure';
import {Mask} from '../../shared/pixel/mask';
import {typed} from '../../shared/pixel/sprite';
import {nolePlace, masPose, roomState, LINE_NOLE, NOLE_CPS} from '../pixeladv/scene';
import {renderRoom, drawGlass, ROOM_W, ROOM_H, GLASS, RoomState} from '../../shared/pixel/rooms/room';
import {masImg, MAS_AT} from '../pixeladv/art/mas';
import {noleImg, NOLE_FOOT} from '../pixeladv/art/nole';
import {drawForeground} from '../pixeladv/art/foreground';
import {drawUI, drawPortraitFrame, drawDialogueBox} from '../pixeladv/art/ui';
import {drawPortrait} from '../pixeladv/art/portraits';
import {drawOrb} from './art';

export interface RoomOpts {
  /** frame of the world (room, Nole, lights) — hold it to freeze the world */
  world: number;
  /** frame of Mas's acting (default = world) — keeps running while the world is frozen */
  mas?: number;
  /** verb bar + inventory */
  ui?: boolean;
  /** Nole's portrait + dialogue box (as in the approved scene); 'portrait' = window only */
  convo?: boolean | 'portrait';
  orb?: {x: number; y: number; scanning?: boolean} | null;
  /** receives Mas's coverage (for "freeze everything except Mas") */
  masMask?: Mask;
}

export const drawRoom = (out: Buf, o: RoomOpts) => {
  const f = o.world;
  const fm = o.mas ?? f;
  const roomB = new Buf(ROOM_W, ROOM_H, PAL.N0);
  const nole = nolePlace(f);
  const nI = nole ? noleImg(nole.pose) : null;
  const rs = roomState(f, nole, nI);
  renderRoom({...rs, shake: [0, 0]} as RoomState, roomB, 0);
  const [sx, sy] = rs.shake;
  // Mas is drawn with his own clock; his mask is taken in frame space (after the shake offset)
  const mI = masImg(masPose(fm));
  blitImg(roomB, mI, MAS_AT[0], MAS_AT[1]);
  if (nole && nI) {
    const x = nole.x - NOLE_FOOT[0], y = nole.y - NOLE_FOOT[1];
    blitImg(roomB, nI, x, y, f < 35 ? {clip: (px, py) => px >= 400 && px <= 444 && py >= 59} : {});
  }
  drawForeground(roomB, rs.jolt);
  for (let y = 0; y < ROOM_H; y++) for (let x = 0; x < ROOM_W; x++) out.set(x, y, roomB.get(clamp(x - sx, 0, ROOM_W - 1), clamp(y - sy, 0, ROOM_H - 1)));
  if (o.masMask) o.masMask.addImg(mI, MAS_AT[0] + sx, MAS_AT[1] + sy);
  drawGlass(out, 0, f >= 108 ? [0, 0] : rs.shake);
  if (o.orb) drawOrb(out, o.orb.x, o.orb.y, o.orb.scanning);
  if (o.ui) drawUI(out, {cutscene: f >= 24 && f < 114, sentence: f >= 24 && f < 114 ? '' : 'Look at glass of water', hoverVerb: 'Look at', f});
  if (o.convo && f >= 52 && f < 88) {
    const fr = drawPortraitFrame(out, 480 - 112 - 8, 8, 112, 136, 'NOLE', PAL.W7, 1);
    if (fr.full) {
      drawPortrait(out, 'nole', 480 - 112 - 8, 8, 112, 136, f);
      if (o.convo !== 'portrait') drawDialogueBox(out, 136, 14, 222, LINE_NOLE, typed(f, 54, LINE_NOLE, NOLE_CPS), PAL.W7, f, 'right');
    }
  }
  return out;
};

/** Convenience: a full frame with UI. */
export const roomFrame = (o: RoomOpts) => drawRoom(new Buf(W, H, PAL.N0), o);
export {GLASS};
