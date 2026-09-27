// MR. MAS — Ep1 full-v3, v3-art-a: Act One sc 12 (the pause letter, the standing desk in the dark, PLEASE) stills.
import {D} from '../registry';
import {rect} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {text} from '../../../../../shared/pixel/font';
import {drawLetterOTS, drawClipboard} from '../../../../../shared/pixel/kits/pause-letter';
import {drawNoleDesk} from '../../../../../shared/pixel/rooms/nole-desk';
import {drawOigneb} from '../../../../../shared/pixel/cast/oigneb';
import {drawPleaseHigh, drawPleaseECU} from '../../../../../shared/pixel/kits/please-sheet';
import {drawLaunchGlass} from '../../../../../shared/pixel/rooms/bullpen-launch';

const MP = 'shared/pixel/kits/pause-letter.ts';
D({id: 'UI-PAUSE-LETTER', state: 'ots-monitor', module: MP + ' drawLetterOTS', note: '12.01 [OTS] over his shoulder at night: his monitor lights with the letter: PAUSE GIANT AI EXPERIMENTS',
  draw: (fb) => drawLetterOTS(fb, 0, {k: 30})});
D({id: 'UI-PAUSE-LETTER', state: 'push-2', module: MP + ' drawLetterOTS', note: '12.01 the push to full-bleed (held step 2 of 3): the page seen 1:1 through the growing screen',
  draw: (fb) => drawLetterOTS(fb, 0, {k: 30, push: 2})});
D({id: 'UI-PAUSE-LETTER', state: 'clipboard', module: MP + ' drawClipboard', note: 'the letter as a clipboard: the clip\'s fine print PAUSES RECEIVED: 0; Nole\'s flourish (signed 2); the room size',
  draw: (fb) => { rect(0, 0, 480, 203, fb.ink(PAL.N1)); drawClipboard(fb, 120, 50, {}); drawClipboard(fb, 260, 50, {signed: 2}); drawClipboard(fb, 380, 70, {small: true, signed: 1}); }});
const MN = 'shared/pixel/rooms/nole-desk.ts';
D({id: 'ROOM-NOLE-DESK', state: 'arrival-glide', module: MN + ' drawNoleDesk', note: '12.01→12.02 [W] a standing desk in the dark, his 1am lamp; the clipboard gliding in (held 2 of 3)',
  draw: (fb) => drawNoleDesk(fb, 0, {clip: 2, sparks: null, oigneb: {sign: 'chest'}})});
D({id: 'ROOM-NOLE-DESK', state: 'sign-solder', module: MN + ' + cast/nole.ts + cast/oigneb.ts', note: '12.02 [W] he signs with his left hand, solders with his right under the desk (sparks); Oigneb holds up PAUSE',
  draw: (fb) => drawNoleDesk(fb, 6, {clip: 4, signed: 2, sparks: 4, oigneb: {sign: 'chest'}})});
D({id: 'ROOM-NOLE-DESK', state: 'sign-higher', module: MN + ' drawNoleDesk', note: '12.02 "It\'s not the font, Nole." Oigneb holds the sign higher; nobody pauses (sparks drawing 3)',
  draw: (fb) => drawNoleDesk(fb, 9, {clip: 4, signed: 2, sparks: 7, oigneb: {sign: 'high', mouth: 'open'}, nole: {mouth: 1}})});
D({id: 'CAST-OIGNEB', state: 'poses', module: 'shared/pixel/cast/oigneb.ts drawOigneb', note: 'OIGNEB: the PAUSE sign at his chest, held higher, no sign; lit and dim',
  draw: (fb) => { rect(0, 0, 480, 203, fb.ink(PAL.N3)); rect(0, 160, 480, 43, fb.ink(PAL.N2)); drawOigneb(fb, 70, 160, {sign: 'chest', light: 'room'}); drawOigneb(fb, 170, 160, {sign: 'high', light: 'room', mouth: 'open'}); drawOigneb(fb, 270, 160, {sign: 'none', light: 'room'}); drawOigneb(fb, 370, 160, {sign: 'chest', light: 'dim'}); text(fb, 'chest · high · none · dim', 60, 172, PAL.N7); }});
const MQ = 'shared/pixel/kits/please-sheet.ts';
D({id: 'INSERT-PLEASE', state: 'high-writing', module: MQ + ' drawPleaseHigh', note: '12.04 [HIGH] his desk from above: his hand, the MACROSOFT pen, PLEASE, its last letter still being drawn',
  draw: (fb) => drawPleaseHigh(fb, 0, {n: 5, part: 0.55})});
D({id: 'INSERT-PLEASE', state: 'ecu-lift', module: MQ + ' drawPleaseECU', note: '12.06 [ECU] PLEASE and blank paper under it; the pen lifts (THREAT on the lift)',
  draw: (fb) => drawPleaseECU(fb, 0, {lift: 2})});
D({id: 'ROOM-BULLPEN-LAUNCH', state: 'glass-phone-letter', module: 'shared/pixel/rooms/bullpen-launch.ts drawLaunchGlass', note: '12.05 [MCU·glass] Mas soft, bent over his sheet; in the glass Alyi reads the pause letter on his phone (draft 6)',
  draw: (fb) => drawLaunchGlass(fb, 0, {mas: 'bent', rima: null, underlines: 3, alyi: 'phone'})});
D({id: 'ROOM-BULLPEN-LAUNCH', state: 'glass-blink', module: 'shared/pixel/rooms/bullpen-launch.ts drawLaunchGlass', note: 'v3-5.06b: the 5.05 setup held, the slow blink (eyes closed: the loop\'s other drawing)',
  draw: (fb) => drawLaunchGlass(fb, 0, {alyi: {eyes: 'closed'}})});
