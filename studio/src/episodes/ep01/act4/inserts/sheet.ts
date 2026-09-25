// MR. MAS — Ep1 act 4: the INSERT + EXPRESSION sheets (owned by the act-4 insert + expression artist). Pure pixel
// code: every view returns a native 480x270 buffer and renders identically in Node (tools/lab.ts) and Remotion.
import {Buf, rect} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {text, textWidth} from '../../../../shared/pixel/font';
import {drawMasCU} from '../../../../shared/pixel/cast/mas-cu';
import {blitImg} from '../../../../shared/pixel/figure';
import {flatHand, renderHand, HandLight, tapHand, tapHandCaps} from '../../../../shared/pixel/kits/inserts-hands';
import {drawCarveInsert, drawBrushInsert, brushSafe, drawPhoneInsert29, drawStripTapInsert, StripHand} from '../../../../shared/pixel/kits/inserts-mas';
import {drawVaultInsert, drawShutDoorInsert} from '../../../../shared/pixel/kits/inserts-props';

const W = 480, H = 270;
/** stand-in for the rail band (y 203..269 belongs to the rail builder) */
const railStandIn = (b: Buf, s: string | null) => {
  rect(0, 203, W, 67, b.ink(PAL.N0));
  rect(0, 203, W, 1, b.ink(PAL.N2));
  if (s) text(b, s, 12, 216, PAL.C6);
  text(b, 'rail band: stand-in', W - 8 - textWidth('rail band: stand-in'), 258, PAL.N3);
};

type View = (b: Buf, arg: string) => void;
const V: Record<string, View> = {
  'cu-26': (b) => { drawMasCU(b, {backdrop: 'strip'}); railStandIn(b, 'RAIL: +1 FIRING'); },
  'cu-30': (b) => { drawMasCU(b, {backdrop: 'lobby'}); railStandIn(b, null); },
  'cu-w0': (b) => { drawMasCU(b, {backdrop: 'lobby', face: 'tungsten'}); railStandIn(b, 'W0 OPTION ONLY: face as material, tungsten'); },
};
V['hands-test'] = (b) => {
  rect(0, 0, W, H, b.ink(PAL.D1));
  const lights: HandLight[] = ['dark', 'suite', 'lobby'];
  lights.forEach((l, i) => {
    const {def} = flatHand({s: 4.4});
    blitImg(b, renderHand(def, l), 10 + i * 64, 20);
    const six = flatHand({s: 4.4, six: true});
    blitImg(b, renderHand(six.def, l), 10 + i * 64, 130);
  });
  const big = flatHand({s: 9});
  blitImg(b, renderHand(big.def, 'dark'), 220, 10);
  const big2 = flatHand({s: 9, curl: 0.6, spread: 2});
  blitImg(b, renderHand(big2.def, 'lobby'), 350, 10);
};
V['carve'] = (b, a) => { drawCarveInsert(b, 0, Number(a || 1)); railStandIn(b, 'RAIL: NOV 17, 2023 · THAT NIGHT'); };
V['brush'] = (b, a) => { drawBrushInsert(b, 0, Number(a || 7)); railStandIn(b, brushSafe() ? 'brush path: marks 1-2 untouched (checked)' : 'BRUSH PATH TOUCHES MARKS 1-2'); };
V['tap-test'] = (b) => {
  rect(0, 0, W, H, b.ink(PAL.D1));
  blitImg(b, tapHandCaps({s: 9.5, thumb: 'tap', light: 'dark'}).img, 0, 10);
  blitImg(b, tapHandCaps({s: 9.5, thumb: 'rest', six: true, light: 'dark'}).img, 150, 10);
  blitImg(b, tapHandCaps({s: 9.5, thumb: 'tap', light: 'lobby'}).img, 300, 10);
  blitImg(b, tapHandCaps({s: 6, thumb: 'tap', light: 'suite'}).img, 0, 170);
};
V['p29v'] = (b) => { drawPhoneInsert29(b, {mode: 'version', f: 0}); railStandIn(b, 'RAIL: NOV 20, 2023 · ~2:06 AM PT · HIS SIDE'); };
V['p29t'] = (b, a) => { drawPhoneInsert29(b, {mode: 'true', f: Number(a || 0)}); railStandIn(b, 'RAIL: NOV 20, 2023 · ~2:06 AM PT · HIS SIDE'); };
V['s26'] = (b, a) => { drawStripTapInsert(b, 0, {hand: (a || 'tap') as StripHand}); railStandIn(b, 'RAIL: +1 FIRING'); };
V['vault'] = (b) => { drawVaultInsert(b); railStandIn(b, 'RAIL: NOV 22, 2023 · REPORTED: ...'); };
V['door'] = (b) => { drawShutDoorInsert(b); railStandIn(b, 'RAIL: NOV 29, 2023'); };
export const VIEWS = Object.keys(V);
export const renderView = (id: string): Buf => {
  const [name, arg] = id.split(':');
  const b = new Buf(W, H, PAL.N0);
  const v = V[name];
  if (!v) { text(b, `no view ${id}`, 8, 8, PAL.R3); return b; }
  v(b, arg ?? '');
  return b;
};
