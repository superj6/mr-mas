// MR. MAS — Ep1 full-v3, v3-art-a, v3.1 round (script draft 7): sc 10, SYDNEY in the lobby (restored), and the TV's
// v3.1 states (Sydney in GNIB's box, the empty box, the ticker's own date).
import {D} from '../registry';
import {drawSydney, drawEggTimer} from '../../../../../shared/pixel/cast/sydney';
import {drawChatBubble} from '../../../../../shared/pixel/cast/chatgtp';
import {drawSydneyTvExit, drawSydneyWide, drawSydney2SMas, drawSydney2STasya, drawSydneyGerg2S, sydneyDriftAt} from '../../../../../shared/pixel/rooms/lobby-sydney';
import {drawTvScreen} from '../../../../../shared/pixel/kits/tv-news';
import {Buf, rect} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {text} from '../../../../../shared/pixel/font';

const MC = 'shared/pixel/cast/sydney.ts';
const MR = 'shared/pixel/rooms/lobby-sydney.ts';
const panel = (fb: Buf) => { for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) fb.set(x, y, (x >> 4) + (y >> 4) & 1 ? PAL.N2 : PAL.N3); };
D({id: 'CAST-SYDNEY', state: 'states', module: MC + ' drawSydney + drawEggTimer', note: 'sheet: ChatGTP (for reference) · Sydney dots · talk · 😊 smile · blink · blank · bright (new) · with the timer (5) · ding · room size (dots, smile, timer)',
  draw: (fb) => {
    panel(fb);
    drawChatBubble(fb, 12, 20, {size: 'screen', state: 'lit'}); text(fb, 'CHATGTP', 8, 58, PAL.G5);
    const S: Array<[string, Parameters<typeof drawSydney>[3]]> = [
      ['DOTS', {face: 'dots'}], ['TALK', {face: 'dots', talk: true, f: 4}], ['SMILE', {face: 'smile'}], ['BLINK', {face: 'blink'}], ['BLANK', {face: 'blank'}], ['NEW', {face: 'dots', bright: true}],
    ];
    S.forEach(([l, o], i) => { drawSydney(fb, 70 + i * 66, 20, {size: 'screen', ...o}); text(fb, l, 70 + i * 66, 58, PAL.G5); });
    drawSydney(fb, 12, 90, {size: 'screen', face: 'smile', timer: {n: 5}}); text(fb, 'TIMER 5', 8, 136, PAL.G5);
    drawSydney(fb, 80, 90, {size: 'screen', face: 'blank', timer: {n: 0, ding: 1}}); text(fb, 'DING', 80, 136, PAL.G5);
    drawSydney(fb, 150, 90, {size: 'screen', face: 'dots', bright: true, timer: {n: 5}}); text(fb, 'RESET', 150, 136, PAL.G5);
    drawEggTimer(fb, 240, 92, {n: 5}); drawEggTimer(fb, 262, 92, {n: 0, ding: 2}); text(fb, 'EGG', 236, 118, PAL.G5);
    drawSydney(fb, 300, 100, {size: 'room'}); drawSydney(fb, 330, 100, {size: 'room', face: 'smile'}); drawSydney(fb, 360, 100, {size: 'room', timer: {n: 5}}); drawSydney(fb, 390, 100, {size: 'room', face: 'blank', timer: {n: 0, ding: 1}});
    text(fb, 'ROOM SIZE', 300, 136, PAL.G5);
    rect(0, 150, 480, 1, fb.ink(PAL.N4));
  }});
D({id: 'UI-TV', state: 'v31-scr-gnib-sydney', module: 'shared/pixel/kits/tv-news.ts drawTvScreen {bubble: sydney}', note: '9.10 / 9.13 (v3.1) GNIB\'s box with Sydney in it (ChatGTP\'s face in GNIB\'s colours, the 2022 stamp); 9.13 she blinks',
  draw: (fb) => drawTvScreen(fb, 0, {show: 'gnib', bubble: 'sydney'})});
D({id: 'UI-TV', state: 'v31-scr-ticker-date', module: 'shared/pixel/kits/tv-news.ts drawTvScreen {date}', note: '9.12 (draft 7) the ticker carries its own date: FEB 8 · ELGOOG\'S DRAB DEMO GETS A TELESCOPE FACT WRONG',
  draw: (fb) => drawTvScreen(fb, 0, {show: 'telescope', k: 2, ticker: 1, date: 'FEB 8'})});
for (const step of [1, 2, 3] as const) D({id: 'SET-SYDNEY', state: `scr-exit-${step}`, module: MR + ' drawSydneyTvExit', note: `v31-10.01 [SCR] she slips out of GNIB\'s box and off the screen (held step ${step} of 3; the box empty behind her)`,
  draw: (fb) => drawSydneyTvExit(fb, 0, {step})});
D({id: 'SET-SYDNEY', state: 'wide-drift', module: MR + ' drawSydneyWide + sydneyDriftAt', note: 'v31-10.01 [W] the drift: out of the TV, down across the lobby (t 0.45)',
  draw: (fb) => drawSydneyWide(fb, 0, {sydney: {t: 0.45}})});
D({id: 'SET-SYDNEY', state: 'wide-parked', module: MR + ' drawSydneyWide', note: 'v31-10.01 end [W] parked a pixel too close to Mas',
  draw: (fb) => drawSydneyWide(fb, 0, {sydney: {t: 1}})});
D({id: 'SET-SYDNEY', state: '2s-mas-hi', module: MR + ' drawSydney2SMas', note: 'v31-10.02 [2S] "Hi! Isn\'t 2022 a lovely year? 😊" Mas at the desk with his glass; Sydney a pixel off his nose (her 😊)',
  draw: (fb) => drawSydney2SMas(fb, 0, {sydney: {face: 'smile'}})});
D({id: 'SET-SYDNEY', state: '2s-mas-scold', module: MR + ' drawSydney2SMas', note: 'v31-10.02 [2S] "You have not been a good user…" the dots light in turn; the smile never moves; Mas, gracious',
  draw: (fb) => drawSydney2SMas(fb, 4, {sydney: {face: 'smile', talk: true, f: 4}, mas: {mouth: 'rest', lid: 1}})});
D({id: 'SET-SYDNEY', state: '2s-tasya-clip', module: MR + ' drawSydney2STasya + cast/tasya-medium.ts clip', note: 'v31-10.03 [2S] "House rules, Sydney." Tasya clips the egg timer to her chain, smile unbroken',
  draw: (fb) => drawSydney2STasya(fb, 0, {clip: 1, tasya: {mouth: 'E'}})});
D({id: 'SET-SYDNEY', state: '2s-tasya-hung', module: MR + ' drawSydney2STasya', note: 'v31-10.03 end [2S] the timer hung on her chain, its face 5',
  draw: (fb) => drawSydney2STasya(fb, 0, {clip: 2, sydney: {face: 'smile'}})});
D({id: 'SET-SYDNEY', state: 'wide-ding-blank', module: MR + ' drawSydneyWide', note: 'v31-10.04 [W] the timer dings (0, the shake), the bubble blinks blank',
  draw: (fb) => drawSydneyWide(fb, 0, {sydney: {t: 1, face: 'blank', timer: {n: 0, ding: 1}}})});
D({id: 'SET-SYDNEY', state: '2s-gerg-new', module: MR + ' drawSydneyGerg2S', note: 'v31-10.04 [2S] brand new, turned to Mas: "Hi!" (brighter, the timer back at 5); Gerg looks down at his laptop',
  draw: (fb) => drawSydneyGerg2S(fb, 0, {lid: 0, sydney: {face: 'dots', bright: true, timer: {n: 5}}, gerg: {head: 'type', lid: 1}})});
D({id: 'SET-SYDNEY', state: '2s-gerg-shut', module: MR + ' drawSydneyGerg2S (LOBBY_LID)', note: 'v31-10.04 end: HOLD on the closed lid at LOBBY_LID (the match cut\'s first half)',
  draw: (fb) => drawSydneyGerg2S(fb, 0, {lid: 2, sydney: {face: 'dots', timer: {n: 5}}, gerg: {head: 'type', lid: 1}})});
void sydneyDriftAt;
