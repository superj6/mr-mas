// MR. MAS · prototype 4 · THE TIER 1 REEL: four device passes, each inside its pixel room (style-range §7.4).
// 720 f (30 s) at 24 fps on the 96 BPM grid (beat 15 f, bar 60 f): four clips of 180 f (3 bars each).
//   4a  p0-179    P4 SPORTS     Draft Night (5.A)             boardroom -> his TV, closer -> stadium feed -> boardroom
//   4b  p180-359  P5 STREAM     the chart crime (5.I)         bullpen -> over a staffer's shoulder -> the stream -> his lean
//   4c  p360-539  P3 BROADCAST  the Security Council (9.E)    chamber [MS] (its monitor) -> webcast wide -> Mas [MCU]
//   4d  p540-719  P21 IRIS      the Orb checkpoint (11.E)     lobby -> the Orb's eye -> its lens -> lobby -> its eye
// Each door is different on purpose (a cut-in on the device, an over-the-shoulder, a monitor in the room, the eye
// opening) and every change lands on the 15-frame beat grid; nothing yo-yos.
// The band stays on screen and untouched throughout; every pass fills only the 480x203 room area.
import {Buf} from '../../../shared/pixel/px';
import {View} from './passes/present';
import {clipA} from './clips/a-sports';
import {clipB} from './clips/b-stream';
import {clipC} from './clips/c-council';
import {clipD} from './clips/d-iris';

export const CLIPS = [
  {id: '4a', name: 'P4 SPORTS · Draft Night', f0: 0, f1: 180},
  {id: '4b', name: 'P5 STREAM · the chart crime', f0: 180, f1: 360},
  {id: '4c', name: 'P3 BROADCAST · the Security Council', f0: 360, f1: 540},
  {id: '4d', name: 'P21 IRIS · the Orb checkpoint', f0: 540, f1: 720},
];

export const clipAt = (f: number, room: Buf): {view: View} => {
  if (f < 180) return clipA(f, room);
  if (f < 360) return clipB(f, room);
  if (f < 540) return clipC(f, room);
  return clipD(f, room);
};
