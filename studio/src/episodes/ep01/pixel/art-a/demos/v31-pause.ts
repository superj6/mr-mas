// MR. MAS — Ep1 full-v3, v3-art-a, v3.1 round: sc 12 in draft 7 (EMIT lands on his desk; PLEASE / REG).
import {D} from '../registry';
import {drawEmitDrop, drawEmitSpread, drawEmitPhonePage} from '../../../../../shared/pixel/kits/emit-oped';
import {drawPleaseHigh, drawPleaseECU} from '../../../../../shared/pixel/kits/please-sheet';
import {PAL} from '../../../../../shared/pixel/palette';

const ME = 'shared/pixel/kits/emit-oped.ts';
D({id: 'INSERT-EMIT-OPED', state: 'drop-air', module: ME + ' drawEmitDrop', note: 'v31-12.03 [HIGH] THUD (its first frame): the magazine a hand\'s height over its shadow, the printed letter\'s header past its edge, his glass',
  draw: (fb) => drawEmitDrop(fb, 0, {k: 0})});
D({id: 'INSERT-EMIT-OPED', state: 'drop-shake', module: ME + ' drawEmitDrop', note: 'v31-12.03 landed: the desk 2 px down (held); the glass\'s water line has not moved',
  draw: (fb) => drawEmitDrop(fb, 0, {k: 1})});
D({id: 'INSERT-EMIT-OPED', state: 'held-to-read', module: ME + ' drawEmitDrop', note: 'v31-12.03 held to read: EMIT, open at the op-ed: "Pausing AI Developments Isn\'t Enough. We Need to Shut It All Down." (the plate REZEILE is the pipeline\'s)',
  draw: (fb) => drawEmitDrop(fb, 0, {k: 8})});
D({id: 'INSERT-EMIT-OPED', state: 'byline-printed', module: ME + ' drawEmitSpread {byline}', note: 'option: the byline printed on the page (if the shot pass drops the REZEILE plate), and the phone-size page (12.05)',
  draw: (fb) => { for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) fb.set(x, y, PAL.G2); drawEmitSpread(fb, 20, 20, {byline: true}); drawEmitPhonePage(fb, 380, 60, 26, 44); drawEmitPhonePage(fb, 420, 60, 13, 22); }});
const MP = 'shared/pixel/kits/please-sheet.ts';
D({id: 'INSERT-PLEASE', state: 'v31-high-between', module: MP + ' drawPleaseHigh {desk: v31}', note: '12.04 (draft 7) he writes PLEASE between the two asks: EMIT and the printed letter beside the sheet',
  draw: (fb) => drawPleaseHigh(fb, 0, {n: 5, part: 0.6, desk: 'v31'})});
D({id: 'INSERT-PLEASE', state: 'v31-ecu-reg', module: MP + ' drawPleaseECU {reg}', note: '12.06 (draft 7) PLEASE / REG: the line below begins REG, the pen on its last stroke',
  draw: (fb) => drawPleaseECU(fb, 0, {reg: 2, regPart: 0.7, lift: 0})});
D({id: 'INSERT-PLEASE', state: 'v31-ecu-reg-lift', module: MP + ' drawPleaseECU {reg, lift}', note: '12.06 the pen lifts mid-word (THREAT on the lift): PLEASE / REG',
  draw: (fb) => drawPleaseECU(fb, 0, {reg: 3, lift: 2})});
