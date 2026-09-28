// MR. MAS — Ep1 full-v3, v3-art-a, v3.1 round: launch night warmed (mood §4 #10 and the lead's round: practicals, the
// face lights of §4 #4, background life), the board seed (5.07: Rima at the board in the 2S), 5.09's rack to the glass,
// 12.05's EMIT in Alyi's hand, 7.01's catch-light tear, and the v31 collars (9.08).
import {D} from '../registry';
import {rect} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {text} from '../../../../../shared/pixel/font';
import {blitImg} from '../../../../../shared/pixel/figure';
import {drawLaunchWide, drawLaunch2S, drawLaunchOTSRima, drawLaunchGlass, drawLaunchMcuRima, drawLaunchMcuMas, drawLaunchOTSLaptop, drawLaunchMcuPF} from '../../../../../shared/pixel/rooms/bullpen-launch';
import {drawRimaBoard} from '../../../../../shared/pixel/cast/rima-board';
import {drawDealMcuMas} from '../../../../../shared/pixel/rooms/lobby-deal';
import {drawCollarsPortrait, drawCollarsMedium, drawCollarsStand} from '../../../../../shared/pixel/cast/mas-collars';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../../shared/pixel/cast/mas';
import {drawMasMedium, MAS_MEDIUM_DEFAULT} from '../../../../../shared/pixel/cast/mas-medium';
import {drawMasStand, MAS_STAND_DEFAULT} from '../../../../../shared/pixel/cast/mas-stand';

const M = 'shared/pixel/rooms/bullpen-launch.ts';
D({id: 'ROOM-BULLPEN-LAUNCH', state: 'v31-wide-warm', module: M + ' drawLaunchWide {warm: 1, life}', note: '5.02 (v3.1) warmed a step: the hall\'s tungsten further in, his desk lamp, a far lamp left on; life: a passer-by in the hall, a far screensaver, a car on the bridge',
  draw: (fb) => drawLaunchWide(fb, 12, {underlines: 2, alyi: 'there', warm: 1, life: {passer: 0.45, flicker: true, car: true}})});
D({id: 'ROOM-BULLPEN-LAUNCH', state: 'v31-2s-warm-underline', module: M + ' drawLaunch2S {warm, rima: underline} + cast/rima-board.ts', note: '5.07 (v3.1, the board seed) behind Gerg, Rima draws the third underline (wet 0.6); the desk lamp warms Mas; Gerg\'s green a rung up',
  draw: (fb) => drawLaunch2S(fb, 0, {warm: 1, cursor: true, underlines: 3, wet: 0.6, rima: {body: 'underline'}, gerg: {head: 'type'}})});
D({id: 'ROOM-BULLPEN-LAUNCH', state: 'v31-2s-cap', module: M + ' drawLaunch2S {rima: cap0}', note: '5.07 she caps the marker, not turning round: "Did anyone tell the rest of the board?"',
  draw: (fb) => drawLaunch2S(fb, 0, {warm: 1, cursor: true, underlines: 3, rima: {body: 'cap0'}, gerg: {head: 'type'}})});
D({id: 'ROOM-BULLPEN-LAUNCH', state: 'v31-2s-capped', module: M + ' drawLaunch2S {rima: cap1}', note: '5.07 "It\'s a research preview." capped; nobody else answers',
  draw: (fb) => drawLaunch2S(fb, 0, {warm: 1, cursor: true, underlines: 3, rima: {body: 'cap1'}, gerg: {head: 'talk', mouth: 'E'}})});
D({id: 'ROOM-BULLPEN-LAUNCH', state: 'v31-ots-rima-warm', module: M + ' drawLaunchOTSRima {warm}', note: '5.04 (v3.1) she stands at his desk, in his lamp\'s light: a key on her face (face only); the room behind a step warmer',
  draw: (fb) => drawLaunchOTSRima(fb, 0, {warm: 1, cursor: true, rima: {mouth: 'E'}})});
D({id: 'ROOM-BULLPEN-LAUNCH', state: 'v31-glass-facelight', module: M + ' drawLaunchGlass {faceLight, warm}', note: '5.05 (mood §4 #4) Alyi in the glass, a face light two steps up (face only; one step barely shows on the glass); the lamp reflected low in the glass',
  draw: (fb) => drawLaunchGlass(fb, 0, {alyi: {mouth: 'O'}, faceLight: 2, warm: 1})});
D({id: 'ROOM-BULLPEN-LAUNCH', state: 'v31-glass-blink-lit', module: M + ' drawLaunchGlass {faceLight}', note: 'v3-5.06b the same setup held, the slow blink, the face light kept',
  draw: (fb) => drawLaunchGlass(fb, 0, {alyi: {eyes: 'closed'}, faceLight: 2, warm: 1})});
D({id: 'ROOM-BULLPEN-LAUNCH', state: 'v31-glass-rack', module: M + ' drawLaunchGlass {rack: glass}', note: '5.09 (shot note) racked to the glass on his first word: Alyi\'s face lit two steps, Rima soft, Mas soft fg',
  draw: (fb) => drawLaunchGlass(fb, 0, {mas: true, rima: {}, underlines: 3, rack: 'glass', alyi: {mouth: 'A'}, warm: 1})});
D({id: 'ROOM-BULLPEN-LAUNCH', state: 'v31-glass-emit-phone', module: M + ' drawLaunchGlass {alyi: phone, phonePage: emit}', note: '12.05 (draft 7) Alyi\'s reflection reads the same EMIT page on his phone; Mas bent over his sheet; the face light one step',
  draw: (fb) => drawLaunchGlass(fb, 0, {mas: 'bent', alyi: 'phone', phonePage: 'emit', faceLight: 1, underlines: 3})});
D({id: 'ROOM-BULLPEN-LAUNCH', state: 'v31-glass-close-emit', module: M + ' drawLaunchGlass {alyi: phone, phonePage: emit}', note: '12.05 alternative: the close glass alone, EMIT on his phone',
  draw: (fb) => drawLaunchGlass(fb, 0, {alyi: 'phone', phonePage: 'emit', faceLight: 1})});
D({id: 'ROOM-BULLPEN-LAUNCH', state: 'v31-mcu-rima-warm', module: M + ' drawLaunchMcuRima {warm}', note: '5.06 (v3.1) Rima waiting, the lamp\'s key on her face',
  draw: (fb) => drawLaunchMcuRima(fb, 0, {warm: 1, rima: {brow: 'lift'}})});
D({id: 'ROOM-BULLPEN-LAUNCH', state: 'v31-mcu-mas-warm', module: M + ' drawLaunchMcuMas {warm}', note: '5.11 (v3.1) lit from below by the chat, and the lamp\'s warm rim down his left side',
  draw: (fb) => drawLaunchMcuMas(fb, 0, {warm: 1, mas: {mouth: 'smile'}})});
D({id: 'ROOM-BULLPEN-LAUNCH', state: 'v31-ots-laptop-warm', module: M + ' drawLaunchOTSLaptop {warm}', note: '5.10 (v3.1) the room behind the laptop a step warmer',
  draw: (fb) => drawLaunchOTSLaptop(fb, 0, {warm: 1, f: 0, rima: true, gergHands: true, chat: {bubble: 'lit', users: 0, lines: [{who: 'bot', text: 'What a great question!'}]}})});
D({id: 'CAST-MAS-TEAR', state: 'v31-catch', module: M + ' drawLaunchMcuPF {tearCatch}', note: '7.01 (shot note) "Is that a tear?": the tear catches the light, one bright pixel',
  draw: (fb) => drawLaunchMcuPF(fb, 0, {tear: 24, tearCatch: true, collarStyle: 'v31'})});
D({id: 'CAST-RIMA-BOARD', state: 'poses', module: 'shared/pixel/cast/rima-board.ts drawRimaBoard', note: 'her back at the board (panorama scale): write · underline (reach 0 / 1) · cap0 · cap1 · lower',
  draw: (fb) => {
    rect(0, 0, 480, 203, fb.ink(PAL.N3)); rect(0, 20, 480, 110, fb.ink(PAL.G5));
    const P = [{body: 'write'}, {body: 'underline', reach: 0}, {body: 'underline', reach: 1}, {body: 'cap0'}, {body: 'cap1'}, {body: 'lower'}] as const;
    P.forEach((p, i) => { drawRimaBoard(fb, -14 + i * 80, 30, p); text(fb, p.body + ('reach' in p ? String(p.reach) : ''), 4 + i * 80, 190, PAL.P1); });
  }});
D({id: 'PROP-COLLARS', state: 'v31-scales', module: 'shared/pixel/cast/mas-collars.ts {style: v31}', note: 'v3.1 collars: taller points up the neck, the third in gold (the cream read as the hoodie\'s trim): portrait 1/2/3 (the pop\'s hop), medium 3, room 3',
  draw: (fb) => {
    rect(0, 0, 480, 203, fb.ink(PAL.N2));
    [1, 2, 3].forEach((n, i) => { const x = -30 + i * 90, y = 20; blitImg(fb, masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'warm', head: 'front'}), x, y); drawCollarsPortrait(fb, x, y, n, {head: 'front', pop: n === 3 ? 0 : undefined, style: 'v31'}); });
    drawMasMedium(fb, 270, 60, {...MAS_MEDIUM_DEFAULT, light: 'warm'}, {flip: true}); drawCollarsMedium(fb, 270, 60, 3, {flip: true, style: 'v31'});
    drawMasStand(fb, 440, 190, MAS_STAND_DEFAULT); drawCollarsStand(fb, 440, 190, 3, {style: 'v31'});
  }});
D({id: 'ROOM-LOBBY-DEAL', state: 'v31-mcu-collar-pop', module: 'shared/pixel/rooms/lobby-deal.ts drawDealMcuMas {collarStyle: v31}', note: '9.08 (shot note) the pop reads as a new collar surfacing: the gold one, standing up the neck, its 1-px hop',
  draw: (fb) => drawDealMcuMas(fb, 0, {collars: 3, collarPop: 0, collarStyle: 'v31'})});
import {drawApecMCU, drawApecWide} from '../../../../../shared/pixel/rooms/apec-stage';
D({id: 'ROOM-APEC', state: 'v31-mcu-collars', module: 'shared/pixel/rooms/apec-stage.ts drawApecMCU {collarStyle: v31}', note: 'cold open (v3.1) the same three collars as 9.08\'s pop: coral, green, gold',
  draw: (fb) => drawApecMCU(fb, 20, {hail: 0.45, mas: {mouth: 'E'}, collarStyle: 'v31'})});
D({id: 'ROOM-APEC', state: 'v31-wide-collars', module: 'shared/pixel/rooms/apec-stage.ts drawApecWide + cast/mas-seated.ts {collarStyle: v31}', note: 'cold open wide (v3.1) seated Mas with the gold third collar (room scale)',
  draw: (fb) => drawApecWide(fb, 0, {mas: {collarStyle: 'v31'}})});
