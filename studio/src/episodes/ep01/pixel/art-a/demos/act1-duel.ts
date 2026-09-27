// MR. MAS — Ep1 full-v3, v3-art-a: Act One sc 11 (the duel, and its match-cut arrival) stills.
import {D} from '../registry';
import {rect} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {text} from '../../../../../shared/pixel/font';
import {drawDuelSplit, drawDemoArrival} from '../../../../../shared/pixel/rooms/duel-split';
import {drawClod} from '../../../../../shared/pixel/cast/clod';

const M = 'shared/pixel/rooms/duel-split.ts';
D({id: 'SPLIT-DUEL', state: 'arrival-lid-shut', module: M + ' drawDemoArrival', note: '11.01 [W] the match cut: the bullpen dressed as the demo stage (GTP-4), Gerg\'s lid shut where it shut in 9.13',
  draw: (fb) => drawDemoArrival(fb, 0, {lid: 2})});
D({id: 'SPLIT-DUEL', state: 'arrival-lid-open', module: M + ' drawDemoArrival', note: '11.01 [W] the lid opens in the same place in frame (LOBBY_LID), the Build\'s chip line leading',
  draw: (fb) => drawDemoArrival(fb, 4, {lid: 0, gerg: {head: 'type'}})});
D({id: 'SPLIT-DUEL', state: 'p1-napkin-memo', module: M + ' drawDuelSplit + cast/clod.ts', note: '11.03 phrase 1: Gerg holds up the napkin; Mario dictates, CLOD unlit on its plinth',
  draw: (fb) => drawDuelSplit(fb, 0, {left: {gerg: 'napkin', screen: 'blank'}, right: {light: 0, mario: 'dictate', scroll: 40}})});
D({id: 'SPLIT-DUEL', state: 'p2-launch-site', module: M + ' drawDuelSplit', note: '11.04 phrase 2: the launch light on CLOD ("You\'re absolutely right!"); NAPKIN → WEBSITE; the room cheers',
  draw: (fb) => drawDuelSplit(fb, 10, {left: {gerg: 'glance', screen: 'site2', cheer: 2}, right: {light: 1, clod: {pose: 'bow', smile: true}, mario: 'lookup', scroll: 50}})});
D({id: 'SPLIT-DUEL', state: 'p3-post', module: M + ' drawDuelSplit + kits/post-card.ts', note: '11.05 phrase 3: Mas holds up his phone, his post pops ("…still flawed, still limited…"); Mario reads it',
  draw: (fb) => drawDuelSplit(fb, 20, {left: {gerg: 'type', screen: 'site2', masPhone: true, phones: true, cheer: 1}, right: {light: 1, mario: 'phone', scroll: 60}, post: 8})});
D({id: 'SPLIT-DUEL', state: 'p4-memo-website', module: M + ' drawDuelSplit', note: '11.06 phrase 4, the turn: the scroll crossed the split onto Gerg\'s desk; MEMO → WEBSITE; the empty spindle',
  draw: (fb) => drawDuelSplit(fb, 30, {left: {gerg: 'snapScroll', screen: 'memo2'}, right: {light: 1, mario: 'spindle'}, cross: 1})});
D({id: 'CAST-CLOD', state: 'states', module: 'shared/pixel/cast/clod.ts drawClod', note: 'pixel CLOD: wait unlit, bow lit (smile), up lit, the wheel\'s three held turns',
  draw: (fb) => { rect(0, 0, 480, 203, fb.ink(PAL.N2)); rect(0, 150, 480, 53, fb.ink(PAL.N1)); drawClod(fb, 60, 150, {lit: 0}); drawClod(fb, 140, 150, {lit: 1, pose: 'bow', smile: true}); drawClod(fb, 220, 150, {lit: 1, pose: 'up'}); [0, 1, 2].forEach((w) => drawClod(fb, 300 + w * 60, 150, {lit: 1, wheel: w})); text(fb, 'wait · bow · up · wheel 0 1 2', 40, 164, PAL.N6); }});
