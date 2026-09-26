// MR. MAS — Ep1 Act Four · THE EDITOR's animatic v2: the rooms with their people on their marks (owned by THE EDITOR).
// Each function paints the 480 x 203 room area of one location in one state, with the built cast sprites dropped on
// the rooms' published anchors (blocking for the animatic; the scene builders own the final staging).
import {Buf} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {blitImg} from '../../../../shared/pixel/figure';
import {blitTo} from '../../../../shared/pixel/cast/kit';
import {shakeAt, SHAKE_DOOR} from '../../../../shared/pixel/sprite';
import {drawSuite, SUITE, SuiteState} from '../../../../shared/pixel/rooms/vegas-suite';
import {drawDarkRoom, drawDarkRoomFront, DARKROOM, DarkRoomOpts} from '../../../../shared/pixel/rooms/darkroom';
import {drawBoardroom, BoardroomState, BR} from '../../../../shared/pixel/rooms/boardroom';
import {drawBullpen, bullpenLandlord, BullpenOpts, LandlordState, DOOR_OPENING} from '../../../../shared/pixel/rooms/bullpen';
import {drawLighthouse, LighthouseOpts} from '../../../../shared/pixel/rooms/lighthouse';
import {drawLobby, LobbyState, LOBBY} from '../../../../shared/pixel/rooms/lobby';
import {masDeskBack, masDeskFront, drawMasDesk, MAS_DESK_DEFAULT, MasDeskPose} from '../../../../shared/pixel/cast/mas';
import {drawMasStand, MAS_STAND_DEFAULT, MasStandPose} from '../../../../shared/pixel/cast/mas-stand';
import {drawOrb} from '../../../../shared/pixel/cast/orb-medium';
import {drawNelehRoom, NELEH_ROOM_DEFAULT, NelehRoomPose} from '../../../../shared/pixel/cast/neleh';
import {drawMadaSeated, MADA_SEAT_DEFAULT} from '../../../../shared/pixel/cast/mada';
import {drawTtemmeRoom, TTEMME_ROOM_DEFAULT} from '../../../../shared/pixel/cast/ttemme';
import {drawTasyaRoom, TASYA_ROOM_DEFAULT, TasyaRoomPose} from '../../../../shared/pixel/cast/tasya-speak';
import {drawTerbRoom, TERB_ROOM_DEFAULT, TerbRoomPose} from '../../../../shared/pixel/cast/terb';
import {drawAlyiStand, ALYI_STAND_DEFAULT, alyiReflection} from '../../../../shared/pixel/cast/alyi-speak';
import {drawAdelinaRoom, ADELINA_ROOM_DEFAULT} from '../../../../shared/pixel/cast/adelina';
import {marioImg, MARIO_BASE, MARIO_FOOT} from '../../../../shared/pixel/cast/mario';
import {drawGlass, GLASS} from '../../../../dev/pixeladv/art/room';

// ------------------------------------------------------------------ THE SUITE (sc 24, 26): Mas at the desk, his glass, the Orb
export const suiteRoom = (b: Buf, f: number, st: Partial<SuiteState> = {}, pose: Partial<MasDeskPose> = {}) => {
  const p: MasDeskPose = {...MAS_DESK_DEFAULT, head: 'screen', light: 'monitor', ...pose};
  drawSuite(b, {f, laptop: 1, ...st}, {
    mas: (bb, front) => {
      blitTo(bb, masDeskBack(p), SUITE.MAS_AT[0], SUITE.MAS_AT[1]);
      front(bb);
      blitTo(bb, masDeskFront(p), SUITE.MAS_AT[0], SUITE.MAS_AT[1]);
      drawGlass(bb, 0, [SUITE.GLASS_AT[0] - GLASS.x, SUITE.GLASS_AT[1] - GLASS.y]);
      // the Orb at his shoulder, room scale (cast/orb-medium's drawOrb at a room radius; the Orb is still a salvage)
      drawOrb(bb, SUITE.MAS_AT[0] + 52, SUITE.MAS_AT[1] + 8, 5, {look: [-0.8, 0.4], aperture: 0.5});
    },
  });
};

// ------------------------------------------------------------------ THE DARK ROOM wide (26A, 29): Mas at the desk, the Orb
export const darkRoom = (b: Buf, f: number, o: DarkRoomOpts = {}, pose: Partial<MasDeskPose> = {}, orbLook: [number, number] = [-0.62, 0.12]) => {
  drawDarkRoom(b, f, {clock: '2:06', tally: 3, ...o});
  const [mx, my] = DARKROOM.mas;
  drawMasDesk(b, mx, my, {...MAS_DESK_DEFAULT, head: 'screen', look: -1, light: 'orb', ...pose});
  const [ox, oy] = DARKROOM.orb;
  drawOrb(b, ox, oy, DARKROOM.orbR, {look: orbLook, aperture: 0.5});
  drawDarkRoomFront(b, f, {clock: '2:06', tally: 3, ...o});
};

// ------------------------------------------------------------------ THE BOARDROOM wide (27, 30)
export interface BoardCast {
  neleh?: Partial<NelehRoomPose> | null;
  mada?: boolean;
  alyi?: boolean;
  ttemme?: {arm?: 'hold' | 'set' | 'down'} | null;
  terb?: {x: number; pose: Partial<TerbRoomPose>} | null;
  tasya?: Partial<TasyaRoomPose> | null;
  mas?: {x: number; pose: Partial<MasStandPose>} | null;
  shake?: [number, number];
}
export const boardRoom = (b: Buf, f: number, st: Partial<BoardroomState>, c: BoardCast = {}) => {
  const refl = c.alyi ? {img: alyiReflection({mouth: 'rest', eyes: 'open', t: f, mirror: true}), x: 40, y: 38, k: 2} : null;
  drawBoardroom(b, {f, ...st, reflection: st.reflection !== undefined ? st.reflection : refl}, {
    wall: (bb) => {
      if (c.tasya) drawTasyaRoom(bb, Math.round((BR.TASYA_DOOR.x0 + BR.TASYA_DOOR.x1) / 2), BR.WALL_FLOOR_Y, {...TASYA_ROOM_DEFAULT, light: 'slate', ...c.tasya});
      if (c.terb) drawTerbRoom(bb, c.terb.x, BR.WALL_FLOOR_Y + 8, {...TERB_ROOM_DEFAULT, ...c.terb.pose});
      if (c.ttemme) drawTtemmeRoom(bb, BR.SEATS.C.x + 12, BR.WALL_FLOOR_Y + 6, {...TTEMME_ROOM_DEFAULT, light: 'spot', arm: c.ttemme.arm ?? 'hold'}, {hourglass: {sand: 1}, f});
    },
    seated: (bb) => { if (c.mada) drawMadaSeated(bb, BR.SEATS.R.x, BR.TABLE.floor, {...MADA_SEAT_DEFAULT}, {flip: true, spin: f}); },
    hands: (bb) => { if (c.neleh) drawNelehRoom(bb, BR.NELEH_AT[0], BR.NELEH_AT[1], {...NELEH_ROOM_DEFAULT, arm: 'marker', ...c.neleh}); },
    near: (bb) => { if (c.mas) drawMasStand(bb, c.mas.x, BR.TABLE.floor + 4, {...MAS_STAND_DEFAULT, ...c.mas.pose}); },
  }, c.shake ?? [0, 0]);
};
export const doorShake = (k: number, t0: number) => shakeAt(k, t0, SHAKE_DOOR);

// ------------------------------------------------------------------ THE BULLPEN (27 all-hands, 30, 31)
export interface BullCast { mas?: boolean | Partial<MasDeskPose>; alyiDoor?: boolean; tasya?: Partial<TasyaRoomPose> | null; landlord?: LandlordState; stage?: (b: Buf, anchors: Record<string, [number, number]>) => void }
export const bullpenRoom = (b: Buf, f: number, o: BullpenOpts, c: BullCast = {}) => {
  const room = drawBullpen(b, f, {...o, masGlass: c.mas ? false : o.masGlass});
  if (c.landlord) bullpenLandlord(b, room, c.landlord);
  const A = room.anchors as unknown as Record<string, [number, number]>;
  if (c.alyiDoor) {
    const [ax, ay] = A.alyiDoorway;
    const clip = (x: number, y: number) => x >= DOOR_OPENING.x && x < DOOR_OPENING.x + 16 && y >= DOOR_OPENING.y && y < DOOR_OPENING.y + DOOR_OPENING.h;
    drawAlyiStand(b, ax, ay, {...ALYI_STAND_DEFAULT}, {clip});
  }
  if (c.tasya) drawTasyaRoom(b, A.tasyaFloor[0], A.tasyaFloor[1], {...TASYA_ROOM_DEFAULT, ...c.tasya});
  room.front?.(b);
  if (c.mas) {
    const [mx, my] = A.masDesk;
    drawMasDesk(b, mx, my, {...MAS_DESK_DEFAULT, head: 'screen', light: 'monitor', ...(typeof c.mas === 'object' ? c.mas : {})});
  }
  c.stage?.(b, A);
  return A;
};

// ------------------------------------------------------------------ THE LIGHTHOUSE (27)
export const lighthouseRoom = (b: Buf, f: number, o: LighthouseOpts, who: {mario?: boolean; adelina?: boolean} = {mario: true}) => {
  const room = drawLighthouse(b, f, o);
  const A = room.anchors as unknown as Record<string, [number, number]>;
  if (who.mario) { const [mx, my] = A.marioDesk; blitImg(b, marioImg({...MARIO_BASE}), mx - MARIO_FOOT[0], my - MARIO_FOOT[1]); }
  if (who.adelina) { const [ax, ay] = A.adelinaDesk; drawAdelinaRoom(b, ax, ay, {...ADELINA_ROOM_DEFAULT}); }
};

// ------------------------------------------------------------------ THE LOBBY, NIGHT (30)
export const lobbyRoom = (b: Buf, f: number, st: Partial<LobbyState>, mas: Partial<MasStandPose> | null = {}) => {
  drawLobby(b, {f, time: 'night', ...st}, {lobby: (bb) => { if (mas) drawMasStand(bb, 262, LOBBY.FEET.desk, {...MAS_STAND_DEFAULT, light: 'room', ...mas}); }});
};

void PAL;
