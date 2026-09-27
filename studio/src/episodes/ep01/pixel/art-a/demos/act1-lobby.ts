// MR. MAS — Ep1 full-v3, v3-art-a: Act One sc 9 (the landlord's deal, the NopeAI lobby) stills.
import {D} from '../registry';
import {Buf, rect} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {text} from '../../../../../shared/pixel/font';
import {Mask} from '../../../../../shared/pixel/mask';
import {drawDealWide, dealFreeze, drawDeal2S, drawDealMcuMas, drawDealGerg2S} from '../../../../../shared/pixel/rooms/lobby-deal';
import {drawCheck, drawCheckFloor} from '../../../../../shared/pixel/kits/novelty-check';
import {drawTvScreen, tvLedger} from '../../../../../shared/pixel/kits/tv-news';
import {drawTasyaMedium, drawKeyRing} from '../../../../../shared/pixel/cast/tasya-medium';
import {drawGergPose} from '../../../../../shared/pixel/cast/gerg-poses';

const M = 'shared/pixel/rooms/lobby-deal.ts';
D({id: 'ROOM-LOBBY-DEAL', state: 'wide-arrival', module: M + ' drawDealWide', note: '9.01 [W] arrival: the lobby, NOPEAI · A NONPROFIT in gold on the door; Mas walks in from frame left',
  draw: (fb) => drawDealWide(fb, 0, {check: null, mas: {legs: 'w1', at: [40, 190]}, tasya: {at: [388, 186], keys: 11}})});
D({id: 'ROOM-LOBBY-DEAL', state: 'wide-check-jammed', module: M + ' drawDealWide + kits/novelty-check.ts', note: '9.01 [W] the check jammed in the revolving door, legible: MACROSOFT · "multiyear, multibillion dollar" · $ MULTIBILLION',
  draw: (fb) => drawDealWide(fb, 0, {check: 'jammed', pen: true, mas: {at: [300, 190]}, tasya: {at: [410, 186], keys: 11}})});
D({id: 'ROOM-LOBBY-DEAL', state: 'freeze-pen', module: M + ' drawDealWide + dealFreeze', note: '9.04 FULL FREEZE: the lobby navy and cream, Mas in colour at the check, reaching for the pen; Tasya (11 keys)',
  draw: (fb) => { const live = new Mask(480, 270); drawDealWide(fb, 0, {check: 'jammed', pen: true, mas: {arm: 'reach', at: [214, 188], flip: true}, tasya: {at: [388, 186], keys: 11}, live}); dealFreeze(fb, live); }});
D({id: 'ROOM-LOBBY-DEAL', state: '2s-partnership', module: M + ' drawDeal2S + cast/tasya-medium.ts', note: '9.06 [2S] "It\'s a partnership." Mas and Tasya, the jammed door between; Gerg behind, tugging a corner',
  draw: (fb) => drawDeal2S(fb, 0, {check: 'jammed', gerg: true, tasya: {mouth: 'E'}})});
D({id: 'ROOM-LOBBY-DEAL', state: 'wide-floor', module: M + ' drawDealWide', note: '9.07 [W] under the door it fits exactly, like a floor; Mas steps on at once',
  draw: (fb) => drawDealWide(fb, 0, {check: 'floor', mas: {at: [120, 184], legs: 'w0'}, tasya: {at: [300, 186], keys: 11}, gerg: {body: 'tug', at: [60, 176]}})});
D({id: 'ROOM-LOBBY-DEAL', state: 'mcu-collar-pop', module: M + ' drawDealMcuMas + cast/mas-collars.ts', note: '9.08 [MCU] pop: the third collar surfaces (its 1-px hop, frame 0)',
  draw: (fb) => drawDealMcuMas(fb, 0, {collars: 3, collarPop: 0})});
D({id: 'ROOM-LOBBY-DEAL', state: '2s-terms', module: M + ' drawDeal2S', note: '9.09 [2S] the terms (held): Mas on the check, three collars; Tasya warm, unhurried; the ring at his belt',
  draw: (fb) => drawDeal2S(fb, 0, {check: 'floor', collars: 3, tasya: {mouth: 'smile', brow: 'warm'}})});
D({id: 'ROOM-LOBBY-DEAL', state: 'wide-weeks-on', module: M + ' drawDealWide + kits/tv-news.ts', note: '9.10 [W] weeks on: the check scuffed grey, Gerg on its edge, Tasya\'s twelfth key (beige); GNIB on the TV',
  draw: (fb) => drawDealWide(fb, 0, {check: 'scuffed', mas: {at: [170, 184]}, tasya: {at: [388, 186], keys: 12, beige: true}, gerg: {body: 'sit', at: [96, 190]}, tv: {show: 'gnib'}})});
D({id: 'ROOM-LOBBY-DEAL', state: '2s-lid-open', module: M + ' drawDealGerg2S', note: '9.13 [2S] "ours does that too." Mas at the desk with his glass; Gerg on the check, his laptop open',
  draw: (fb) => drawDealGerg2S(fb, 0, {lid: 0, gerg: {head: 'up'}})});
D({id: 'ROOM-LOBBY-DEAL', state: '2s-lid-shut', module: M + ' drawDealGerg2S (LOBBY_LID)', note: '9.13 end: he closes it (the lid shut at LOBBY_LID: sc 11\'s demo stage opens a lid in the same place)',
  draw: (fb) => drawDealGerg2S(fb, 0, {lid: 2, gerg: {head: 'type'}})});

// ------------------------------------------------------------------ UI-TV (sc 9.10-9.12)
const MT = 'shared/pixel/kits/tv-news.ts';
D({id: 'UI-TV', state: 'scr-gnib', module: MT + ' drawTvScreen', note: '9.10 [SCR] GNIB\'s launch: a search box with a chat bubble inside it; the TV\'s caption',
  draw: (fb) => drawTvScreen(fb, 0, {show: 'gnib'})});
D({id: 'UI-TV', state: 'scr-tap', module: MT + ' drawTvScreen + cast/radnus.ts', note: '9.11 [SCR] across town, at Elgoog: Radnus tap-dances (drawing 1 of 2), extinguisher held politely aside',
  draw: (fb) => drawTvScreen(fb, 6, {show: 'tap'})});
D({id: 'UI-TV', state: 'scr-telescope', module: MT + ' drawTvScreen', note: '9.12 [SCR] the telescope turns (held 2 of 3); the ticker crawls in',
  draw: (fb) => drawTvScreen(fb, 0, {show: 'telescope', k: 1, ticker: 0.7})});
D({id: 'UI-TV', state: 'scr-ledger', module: MT + ' drawTvScreen + tvLedger', note: '9.12 the LEDGER flash-print (6 frames, the engine\'s money set), the figure in the ticker',
  draw: (fb) => { drawTvScreen(fb, 0, {show: 'telescope', k: 2, figure: true}); tvLedger(fb); }});
D({id: 'UI-TV', state: 'scr-figure', module: MT + ' drawTvScreen', note: '9.12 after the print: its lens stares straight at him; the figure holds in the ticker to read',
  draw: (fb) => drawTvScreen(fb, 0, {show: 'telescope', k: 2, figure: true})});

// ------------------------------------------------------------------ PROP-CHECK, CAST-TASYA-MEDIUM, CAST-GERG-POSES
D({id: 'PROP-CHECK', state: 'states', module: 'shared/pixel/kits/novelty-check.ts', note: 'upright with the pen (the jam), on the floor (a doormat), scuffed weeks on (footprints)',
  draw: (fb) => { rect(0, 0, 480, 203, fb.ink(PAL.G3)); drawCheck(fb, 10, 20, {pen: true}); drawCheck(fb, 250, 20, {scuffed: true}); drawCheckFloor(fb, 20, 130, 200, {}); drawCheckFloor(fb, 250, 130, 200, {scuffed: true}); }});
D({id: 'CAST-TASYA-MEDIUM', state: 'poses', module: 'shared/pixel/cast/tasya-medium.ts drawTasyaMedium', note: 'medium (portrait geometry at half size): clasp (11 keys), after you, the ring up (12, the beige one); the room ring',
  draw: (fb) => { rect(0, 0, 480, 203, fb.ink(PAL.G4)); drawTasyaMedium(fb, 10, 93, {arm: 'clasp'}); drawTasyaMedium(fb, 130, 93, {arm: 'after', mouth: 'E'}); drawTasyaMedium(fb, 250, 93, {arm: 'ring', keys: 12, beige: true, mouth: 'smile', brow: 'warm'}); drawKeyRing(fb, 400, 60, 11, {scale: 'medium'}); drawKeyRing(fb, 440, 60, 12, {beige: true, scale: 'medium'}); drawKeyRing(fb, 400, 120, 11, {scale: 'room'}); drawKeyRing(fb, 440, 120, 12, {beige: true, scale: 'room'}); text(fb, '11', 394, 80, PAL.N1); text(fb, '12', 434, 80, PAL.N1); }});
D({id: 'CAST-GERG-POSES', state: 'poses', module: 'shared/pixel/cast/gerg-poses.ts drawGergPose', note: 'tug (the check\'s corner), sit (laptop open on his knees), sitShut, armsUp',
  draw: (fb) => { rect(0, 0, 480, 203, fb.ink(PAL.G4)); rect(0, 150, 480, 53, fb.ink(PAL.G3)); (['tug', 'sit', 'sitShut', 'armsUp'] as const).forEach((bd, i) => { drawGergPose(fb, 60 + i * 100, 150, {body: bd}); text(fb, bd, 40 + i * 100, 160, PAL.N1); }); }});
void Buf;
