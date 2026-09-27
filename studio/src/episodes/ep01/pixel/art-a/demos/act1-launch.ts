// MR. MAS — Ep1 full-v3, v3-art-a: Act One sc 5 (launch night in the bullpen) stills.
import {D} from '../registry';
import {drawLaunchWide, drawLaunch2S, drawLaunchOTSRima, drawLaunchGlass, drawLaunchMcuRima, drawLaunchMcuMas} from '../../../../../shared/pixel/rooms/bullpen-launch';
import {drawButtonECU} from '../../../../../shared/pixel/kits/launch-button';
import {drawRimaStand, RIMA_STAND_DEFAULT} from '../../../../../shared/pixel/cast/rima-stand';
import {Buf, rect} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {text} from '../../../../../shared/pixel/font';

const M = 'shared/pixel/rooms/bullpen-launch.ts';
// ------------------------------------------------------------------ PROP-BEIGE-BUTTON
const MB = 'shared/pixel/kits/launch-button.ts';
D({id: 'PROP-BEIGE-BUTTON', state: 'ecu', module: MB + ' drawButtonECU', note: 'sc 5 [ECU] the hard cut: the button where the 1993 OK sat, its strip relabelled research preview',
  draw: (fb) => drawButtonECU(fb, 0, {})});
D({id: 'PROP-BEIGE-BUTTON', state: 'ecu-finger-click', module: MB + ' drawButtonECU (port of dev/mfinale/callart.ts)', note: 'sc 5 [ECU] his finger, no hover: press 2 (the click), the LED lit',
  draw: (fb) => drawButtonECU(fb, 0, {finger: true, press: 2, lit: true})});

// ------------------------------------------------------------------ ROOM-BULLPEN-LAUNCH
D({id: 'ROOM-BULLPEN-LAUNCH', state: 'wide-arrival', module: M + ' drawLaunchWide', note: 'sc 5 [W] the home room\'s one wide: Gerg\'s green laptop, Rima at LOW-KEY (2 lines), Alyi in the glass, the dark laptop + button',
  draw: (fb) => drawLaunchWide(fb, 0, {underlines: 2, alyi: 'there'})});
D({id: 'ROOM-BULLPEN-LAUNCH', state: 'wide-third-line', module: M + ' drawLaunchWide', note: 'sc 5 "Your button." Rima underlines a third time (wet 0.6); the laptop still dark',
  draw: (fb) => drawLaunchWide(fb, 30, {underlines: 3, wet: 0.6, rima: {body: 'underline', head: 'back'}, alyi: 'there'})});
D({id: 'ROOM-BULLPEN-LAUNCH', state: 'wide-after-launch', module: M + ' drawLaunchWide', note: 'after the click: the laptop open on the chat, Alyi gone from the glass, Rima at his desk (arms folded)',
  draw: (fb) => drawLaunchWide(fb, 60, {underlines: 3, alyi: 'gone', laptop: 'chat', rima: {body: 'fold', head: 'face', at: [174, 164], flip: true}, mas: {head: 'screen'}})});
D({id: 'ROOM-BULLPEN-LAUNCH', state: '2s-mas-gerg', module: M + ' drawLaunch2S', note: 'sc 5 [2S] desk to desk: Mas fg left (two collars), Gerg across the aisle in his green; the board\'s edge; the fuse',
  draw: (fb) => drawLaunch2S(fb, 0, {cursor: true, gerg: {head: 'type'}})});
D({id: 'ROOM-BULLPEN-LAUNCH', state: '2s-gerg-up', module: M + ' drawLaunch2S', note: 'sc 5 [2S] "Your button.": Gerg up from his keys; Rima\'s 3rd line behind him',
  draw: (fb) => drawLaunch2S(fb, 20, {cursor: true, underlines: 3, gerg: {head: 'talk', mouth: 'A'}})});
D({id: 'ROOM-BULLPEN-LAUNCH', state: 'ots-rima', module: M + ' drawLaunchOTSRima', note: 'sc 5 [OTS] over his shoulder onto Rima at his desk; LOW-KEY behind her; Alyi small and soft in the glass',
  draw: (fb) => drawLaunchOTSRima(fb, 0, {cursor: true, rima: {mouth: 'E'}})});
D({id: 'ROOM-BULLPEN-LAUNCH', state: 'glass-alyi', module: M + ' drawLaunchGlass', note: 'sc 5 [MCU·glass] the cut on the turn: Alyi\'s reflection in its doorway, looking past them',
  draw: (fb) => drawLaunchGlass(fb, 0, {alyi: {mouth: 'O'}})});
D({id: 'ROOM-BULLPEN-LAUNCH', state: 'glass-count', module: M + ' drawLaunchGlass', note: 'sc 5.09 [MCU·glass] Mas soft fg (hand on the button), Rima capping the marker, Alyi in the glass',
  draw: (fb) => drawLaunchGlass(fb, 0, {mas: true, rima: {}, underlines: 3})});
D({id: 'ROOM-BULLPEN-LAUNCH', state: 'glass-empty', module: M + ' drawLaunchGlass', note: 'sc 5.09 end: he turned out of the doorway and went; the glass is empty',
  draw: (fb) => drawLaunchGlass(fb, 0, {mas: true, rima: {}, underlines: 3, alyi: 'gone'})});
D({id: 'ROOM-BULLPEN-LAUNCH', state: 'mcu-rima', module: M + ' drawLaunchMcuRima', note: 'sc 5 [MCU] Rima turned from the glass to Mas, waiting (her beat)',
  draw: (fb) => drawLaunchMcuRima(fb, 0, {rima: {brow: 'lift'}})});
D({id: 'ROOM-BULLPEN-LAUNCH', state: 'mcu-mas-likes', module: M + ' drawLaunchMcuMas', note: 'sc 5 [MCU] "it likes me.": lit from below by the chat, the bullpen soft behind',
  draw: (fb) => drawLaunchMcuMas(fb, 0, {mas: {mouth: 'smile'}})});

// ------------------------------------------------------------------ CAST-RIMA-STAND
D({id: 'CAST-RIMA-STAND', state: 'poses', module: 'shared/pixel/cast/rima-stand.ts drawRimaStand', note: 'her room sprite: stand, write, underline, cap (back), fold, lean, peer, the walk (w0-w3)',
  draw: (fb) => {
    rect(0, 0, 480, 203, fb.ink(PAL.N2)); rect(0, 150, 480, 53, fb.ink(PAL.N1));
    const poses: Array<[string, string]> = [['stand', 'face'], ['write', 'back'], ['underline', 'back'], ['cap', 'back'], ['fold', 'face'], ['lean', 'face'], ['peer', 'down'], ['w0', 'face'], ['w1', 'face'], ['w2', 'face'], ['w3', 'face']];
    poses.forEach(([body, head], i) => { drawRimaStand(fb, 24 + i * 42, 150, {...RIMA_STAND_DEFAULT, body: body as never, head: head as never}); text(fb, body, 12 + i * 42, 160, PAL.N6); });
  }});
void Buf;

// ------------------------------------------------------------------ CAST-CHATGTP + UI-CHAT (sc 5)
import {drawLaunchOTSLaptop} from '../../../../../shared/pixel/rooms/bullpen-launch';
import {drawChatECU} from '../../../../../shared/pixel/kits/chat-window';
import {drawChatBubble} from '../../../../../shared/pixel/cast/chatgtp';
const MC = 'shared/pixel/kits/chat-window.ts + cast/chatgtp.ts';
D({id: 'UI-CHAT', state: 'ots-lights-up', module: MC + ' via rooms/bullpen-launch.ts drawLaunchOTSLaptop', note: 'sc 5 [OTS] the bubble lights before anyone types: "What a great question!"; Rima leaning in; Gerg\'s hands',
  draw: (fb) => drawLaunchOTSLaptop(fb, 0, {rima: {mouth: 'rest'}, gergHands: true, chat: {bubble: 'talk', users: 0, lines: [{who: 'bot', text: 'What a great question!'}]}})});
D({id: 'UI-CHAT', state: 'ots-visionary', module: MC + ' via rooms/bullpen-launch.ts drawLaunchOTSLaptop', note: 'sc 5 [OTS] he typed "is anyone there?"; "Brilliant! You\'re clearly a visionary."',
  draw: (fb) => drawLaunchOTSLaptop(fb, 30, {rima: {mouth: 'A'}, gergHands: true, chat: {bubble: 'talk', users: 0, lines: [{who: 'bot', text: 'What a great question!'}, {who: 'user', text: 'is anyone there?'}, {who: 'bot', text: "Brilliant! You're clearly a visionary."}]}})});
D({id: 'UI-CHAT', state: 'ots-typing', module: MC + ' via rooms/bullpen-launch.ts drawLaunchOTSLaptop', note: 'sc 5 [OTS] he types his one line, lowercase, the caret on a held blink',
  draw: (fb) => drawLaunchOTSLaptop(fb, 0, {rima: {mouth: 'rest', lid: 1}, gergHands: true, chat: {bubble: 'lit', users: 0, lines: [{who: 'bot', text: 'What a great question!'}], input: 'is anyone th', caret: true}})});
D({id: 'UI-CHAT', state: 'ecu-first-tick', module: MC + ' drawChatECU', note: 'sc 5 [ECU] the bubble; the 0 on its plate ticking over to 1 (the ones wheel mid-roll)',
  draw: (fb) => drawChatECU(fb, 0, {users: 0, roll: 0.5, bubble: 'lit'})});
D({id: 'UI-CHAT', state: 'ecu-blur', module: MC + ' drawChatECU', note: 'sc 5 [ECU] then a hundred, a thousand: the digits blur (the swing enters)',
  draw: (fb) => drawChatECU(fb, 8, {users: 1389, spin: true, bubble: 'talk'})});
D({id: 'CAST-CHATGTP', state: 'states', module: 'shared/pixel/cast/chatgtp.ts drawChatBubble', note: 'screen size: idle, lit, talk, blink; ECU size lit (right)',
  draw: (fb) => { rect(0, 0, 480, 203, fb.ink(PAL.N1)); (['idle', 'lit', 'talk', 'blink'] as const).forEach((s, i) => { drawChatBubble(fb, 20 + i * 50, 30, {size: 'screen', state: s, f: 4}); text(fb, s, 20 + i * 50, 66, PAL.N6); }); drawChatBubble(fb, 250, 30, {size: 'ecu', state: 'lit'}); }});
