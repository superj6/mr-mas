// MR. MAS — Ep1 full-v3, v3-art-a, v3.2 round (script draft 8.1: "he launches, it explodes, he secures the money"):
// Act One's new art from script-v32-notes.md §4 and §10.7.
import {D} from '../registry';
import {rect} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {drawLaunchCallMcu, drawCallScreenECU} from '../../../../../shared/pixel/rooms/launch-call';
import {drawMillionPost} from '../../../../../shared/pixel/kits/act1-v32';
import {drawKeyRingECU} from '../../../../../shared/pixel/kits/key-ring-insert';
import {drawDuelSplit} from '../../../../../shared/pixel/rooms/duel-split';
import {drawDeal2S} from '../../../../../shared/pixel/rooms/lobby-deal';
import {drawSydney2STasya} from '../../../../../shared/pixel/rooms/lobby-sydney';
import {drawLetterOTS, drawClipboard} from '../../../../../shared/pixel/kits/pause-letter';
import {drawNoleDesk} from '../../../../../shared/pixel/rooms/nole-desk';
import {drawFoundersCutIn} from '../../../../../shared/pixel/rooms/elgoog-cutin';

const MC = 'shared/pixel/rooms/launch-call.ts';
D({id: 'SET-CALL', state: 'ear', module: MC + ' drawLaunchCallMcu', note: 'v32-7.03 [MCU] later that night: the phone at his ear, its lit screen out to us (cartoon): TASYA · MACROSOFT over the key-ring avatar; the tile\'s red from below',
  draw: (fb) => drawLaunchCallMcu(fb, 0, {phone: 'ear', mas: {mouth: 'E'}})});
D({id: 'SET-CALL', state: 'low', module: MC + ' drawLaunchCallMcu', note: 'v32-7.03 "I\'ll bring a pen." He lowers the phone: the call over',
  draw: (fb) => drawLaunchCallMcu(fb, 0, {phone: 'low', mas: {lid: 1}})});
D({id: 'SET-CALL', state: 'red', module: MC + ' drawLaunchCallMcu', note: 'v32-7.03 → 8.01: before it reaches the desk it lights red (ELGOOG · CODE RED), its red up his chin',
  draw: (fb) => drawLaunchCallMcu(fb, 6, {phone: 'red', mas: {lid: 0, look: 0}})});
D({id: 'SET-CALL', state: 'ecu-ringing', module: MC + ' drawCallScreenECU', note: 'v32-7.03 option: the phone ringing on his desk, the contact screen large (a cut-in on the ring)',
  draw: (fb) => drawCallScreenECU(fb, 3, {state: 'ringing'})});
D({id: 'INSERT-MILLION-POST', state: 'card', module: 'shared/pixel/kits/act1-v32.ts drawMillionPost + kits/post-card.ts', note: '6.06 the last wheel settled on 1,000,000; his post over it: "CHATGTP launched on wednesday. today it crossed 1 million users!" DEC 4 · 11:35 PM',
  draw: (fb) => drawMillionPost(fb, 0, {k: 3})});
D({id: 'INSERT-MILLION-POST', state: 'opening', module: 'shared/pixel/kits/act1-v32.ts drawMillionPost', note: '6.06 the card opening (post-card\'s held step 1)',
  draw: (fb) => drawMillionPost(fb, 0, {k: 1})});
D({id: 'SPLIT-DUEL', state: 'v32-p2-button', module: 'shared/pixel/rooms/duel-split.ts drawDuelSplit {left.button}', note: '11.04 (draft 8.1) LEFT: Mas\'s finger on his beige button, no hover: the click (5.08\'s insert, cropped into the pane); RIGHT: CLOD launches',
  draw: (fb) => drawDuelSplit(fb, 0, {left: {button: {press: 2, lit: true}}, right: {light: 1, clod: {pose: 'bow', smile: true}, mario: 'write', scroll: 50}})});
D({id: 'SPLIT-DUEL', state: 'v32-p2-button-touch', module: 'shared/pixel/rooms/duel-split.ts drawDuelSplit {left.button}', note: '11.04 the touch before the click (press 1)',
  draw: (fb) => drawDuelSplit(fb, 0, {left: {button: {press: 1}}, right: {light: 0, mario: 'write', scroll: 50}})});
const MK = 'shared/pixel/kits/key-ring-insert.ts drawKeyRingECU';
D({id: 'KIT-KEY-RING', state: 'ecu-12', module: MK, note: 'v32-9.10k [ECU] the ring at Tasya\'s belt, large for the first time: eleven keys and a beige twelfth stamped NOPEAI (the rail FEB 7, 2023 sits on it)',
  draw: (fb) => drawKeyRingECU(fb, 0, {keys: 12})});
D({id: 'KIT-KEY-RING', state: 'ecu-12-jangle', module: MK, note: 'v32-9.10k it jangles as he turns toward the TV (the second held drawing)',
  draw: (fb) => drawKeyRingECU(fb, 0, {keys: 12, jangle: 1})});
D({id: 'KIT-KEY-RING', state: 'ecu-13', module: MK + ' {thirteenth}', note: 'for P1b (v31-18.00b "the thirteenth key large"): the thirteenth in Atem blue beside the beige one',
  draw: (fb) => drawKeyRingECU(fb, 0, {keys: 13, thirteenth: true})});
D({id: 'ROOM-LOBBY-DEAL', state: 'v32-2s-clink', module: 'shared/pixel/rooms/lobby-deal.ts drawDeal2S {collarPop}', note: '9.09 (note) the ring\'s clink against the collar: Tasya raises the ring on "our servers", and on its clink the new collar hops (gold, the ring\'s brass): the landlord\'s',
  draw: (fb) => drawDeal2S(fb, 0, {check: 'floor', collars: 3, collarStyle: 'v31', collarPop: 0, tasya: {arm: 'ring', mouth: 'E', jangle: 1, keys: 11}})});
D({id: 'SET-SYDNEY', state: 'v32-2s-tasya-questions', module: 'shared/pixel/rooms/lobby-sydney.ts drawSydney2STasya {timerFace}', note: 'v31-10.03 (draft 8.1) the egg timer\'s own face reads 5 QUESTIONS; "House rules, Sydney."',
  draw: (fb) => drawSydney2STasya(fb, 0, {clip: 2, timerFace: 'questions', sydney: {face: 'smile'}})});
const MP = 'shared/pixel/kits/pause-letter.ts';
D({id: 'UI-PAUSE-LETTER', state: 'v32-push-months', module: MP + ' drawLetterOTS {months}', note: '12.01 (draft 8.1) the letter\'s own line under its header: 6 MONTHS [V · facts #13]',
  draw: (fb) => drawLetterOTS(fb, 0, {k: 30, push: 3, months: true})});
D({id: 'UI-PAUSE-LETTER', state: 'v32-clipboard-months', module: MP + ' drawClipboard {months}', note: '12.01→12.02 the clipboard carries it too (legible at its 64 px size; the desk\'s 26 px one can\'t carry a word)',
  draw: (fb) => { rect(0, 0, 480, 203, fb.ink(PAL.N1)); drawClipboard(fb, 150, 50, {months: true}); drawClipboard(fb, 270, 50, {months: true, signed: 2}); }});
D({id: 'ROOM-NOLE-DESK', state: 'v32-glide-big', module: 'shared/pixel/rooms/nole-desk.ts drawNoleDesk {bigClip, months}', note: '12.02 option: the clipboard glides in at its big size so PAUSE GIANT AI EXPERIMENTS / 6 MONTHS read in the wide, then lands small',
  draw: (fb) => drawNoleDesk(fb, 0, {clip: 2, bigClip: true, months: true, sparks: null, oigneb: {sign: 'chest'}})});
D({id: 'ROOM-ELGOOG', state: 'v32-cutin-founders', module: 'shared/pixel/rooms/elgoog-cutin.ts drawFoundersCutIn + cast/elgoog-founders.ts founderCutIn', note: '8.04 (draft 8.1) the one cut-in on the founders, "Someone else built that?": NIRB and EGAP at 3x peering at Radnus\'s phone (the two-dot bubble), on his phone\'s screen',
  draw: (fb) => drawFoundersCutIn(fb, 0, {})});
