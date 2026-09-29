// MR. MAS — Ep1 Act Four · rooms A: a 7.5 s motion test of the rooms' built-in animation (24 fps, on the grid).
//   0-59    suite (24.01): the crane truck grinds past (1 px / 2 f), the four glasses rattle in turn (2 held
//           drawings, 1 px, 3 f apart); his glass (cast) does not move
//   60-89   boardroom (27.13 / 27.17): phones buzz and walk one held step per beat, the speakerphone dials 4 tones
//   90-119  boardroom (27.32): the wall steps to slate, TASYA's door steps out of the shadow and opens (held steps)
//   120-149 boardroom (30.09): the fires on 2s, the chair fire goes out on a beat (smoke in held steps)
//   150-179 lobby, night (30.22): the sign lights up in three held steps
import {Buf} from '../../../../shared/pixel/px';
import {blitTo} from '../../../../shared/pixel/cast/kit';
import {drawBoardroom, FireSpot} from '../../../../shared/pixel/rooms/boardroom';
import {drawLobby} from '../../../../shared/pixel/rooms/lobby';
import {drawSuite, SUITE} from '../../../../shared/pixel/rooms/vegas-suite';
import {railPlaceholder} from '../../../../shared/pixel/rooms/setkit';
import {masDeskBack, masDeskFront, MAS_DESK_DEFAULT} from '../../../../shared/pixel/cast/mas';
import {drawGlass, GLASS} from '../../../../shared/pixel/rooms/room';

export const MOTION = {
  frames: 180,
  draw: (b: Buf, f: number) => {
    if (f < 60) {
      const tx = 250 + Math.floor(f / 2); // 1 px per 2 frames: a grind, not a drive
      drawSuite(b, {f, truckX: tx, shiverT0: 12}, {
        mas: (bb, front) => {
          blitTo(bb, masDeskBack(MAS_DESK_DEFAULT), SUITE.MAS_AT[0], SUITE.MAS_AT[1]); front(bb); blitTo(bb, masDeskFront(MAS_DESK_DEFAULT), SUITE.MAS_AT[0], SUITE.MAS_AT[1]);
          drawGlass(bb, 0, [SUITE.GLASS_AT[0] - GLASS.x, SUITE.GLASS_AT[1] - GLASS.y]);
        },
      });
    } else if (f < 90) {
      const k = f - 60;
      drawBoardroom(b, {f, blueprint: {word: false}, laptop: true, phones: {lit: true, buzz: true, step: Math.min(4, Math.floor(k / 15) * 2)}, speaker: Math.min(4, Math.floor(k / 6))});
    } else if (f < 120) {
      const k = f - 90;
      drawBoardroom(b, {f, slate: k >= 3, tasyaDoor: k < 6 ? 0 : k < 12 ? 1 : k < 18 ? 2 : k < 21 ? 3 : 4, blueprint: {word: true}, sticky: {seat: 'C', text: 'CEO (TEMP)'}});
    } else if (f < 150) {
      const k = f - 120;
      const fires: FireSpot[] = [
        {at: 'table', x: 178, y: 166, state: 'burn', phase: 0},
        k < 15 ? {at: 'chair', seat: 'B', state: 'burn', phase: 1} : {at: 'chair', seat: 'B', state: 'out', outAt: 135},
        {at: 'plate', seat: 'D', state: 'burn', phase: 2},
      ];
      drawBoardroom(b, {f, fires, rolodex: 'still', gergLaptop: 'green', plates: {A: 'GERG', B: 'ALYI', C: null, D: 'NELEH', E: 'THE QUIET VOTE'}});
    } else {
      const k = f - 150;
      drawLobby(b, {f, time: 'night', sign: k < 6 ? 1 : k < 9 ? 2 : k < 12 ? 1 : k < 15 ? 2 : 3, zeroBox: false});
    }
    railPlaceholder(b);
  },
};
