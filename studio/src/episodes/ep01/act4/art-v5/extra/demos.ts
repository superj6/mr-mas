// MR. MAS — Ep1 Act Four v5, EXTRA pixel assets: one demo still per asset state (the registry of extra/tools/sheet.ts).
// Each demo paints the 480 x 203 picture area of a native frame the way the v5 shot would use the asset, over the v4 or
// shared drawing it re-dresses. These are previews, not the v5 layouts: the pixel preview pass owns shots5.ts and wires
// these in (see show/episodes/ep01/production/act4/art-extra-v5.md). Keys are `ID@state`.
import {Buf, rect} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {drawTableInsert, TABLE_INSERT, drawChairBackInsert, PLATE_INSERT} from '../../../../../shared/pixel/rooms/boardroom';
import {drawNelehPenHand, drawWorkerScrewHand} from './hands';

export interface AssetDemo {
  id: string;
  state?: string;
  /** the module the asset lives in (repo-relative from studio/src) */
  module: string;
  note?: string;
  /** what in this still is still a stand-in (empty = none) */
  standin?: string;
  draw: (fb: Buf) => void;
}
export const DEMOS: AssetDemo[] = [];
const D = (d: AssetDemo) => { DEMOS.push(d); };
const M = 'episodes/ep01/act4/art-v5/extra/';

// ------------------------------------------------------------------ POLISH-PEN-HAND (S3.02, S4.14)
D({id: 'POLISH-PEN-HAND', state: 'S4.14-question', module: M + 'hands.ts drawNelehPenHand', note: "S4.14 over drawTableInsert: her marker on the `?` (word 3), tip on the mark",
  draw: (fb) => { drawTableInsert(fb, {f: 0, focus: 'blueprint', word: 3}); const [wx, wy] = TABLE_INSERT.wordAt; drawNelehPenHand(fb, wx + 18 + 3 * 14, wy - 2, {tool: 'marker'}); }});
D({id: 'POLISH-PEN-HAND', state: 'S4.14-enter-lift', module: M + 'hands.ts drawNelehPenHand', note: "S4.14: coming into frame (lifted), before she writes",
  draw: (fb) => { drawTableInsert(fb, {f: 0, focus: 'blueprint', word: 0}); drawNelehPenHand(fb, 356, 186, {tool: 'marker', pose: 'lift'}); }});
D({id: 'POLISH-PEN-HAND', state: 'S3.02-pen-tick', module: M + 'hands.ts drawNelehPenHand', note: "S3.02: her pen (slim) ticking step 1",
  draw: (fb) => { drawTableInsert(fb, {f: 0, focus: 'blueprint', word: 0}); drawNelehPenHand(fb, 214, 88, {tool: 'pen'}); }});

// ------------------------------------------------------------------ POLISH-SCREW-HAND (S8.09)
const scorch = (fb: Buf) => { // shots4 S8.09's soot, re-typed for the demo (the layout owns it)
  for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) {
    const d = Math.hypot((x - 480) / 260, (y - 210) / 130);
    if (d < 1 && ((x * 7 + y * 11) % 5) < (1 - d) * 7) fb.set(x, y, stepColor(fb.get(x, y), d < 0.5 ? -3 : -2));
  }
};
([0, 1, 2] as const).forEach((turn) => D({id: 'POLISH-SCREW-HAND', state: `screw${turn + 1}-turn${turn}`, module: M + 'hands.ts drawWorkerScrewHand', note: `S8.09 over drawChairBackInsert: screw ${turn + 1}, the fist's held drawing ${turn}`,
  draw: (fb) => { drawChairBackInsert(fb, {f: 0, screws: turn}); scorch(fb); const [sx, sy] = PLATE_INSERT.screws[turn]; drawWorkerScrewHand(fb, sx, sy, {turn, from: sx < 240 ? 'left' : 'right'}); }}));

void rect; void PAL;

// ------------------------------------------------------------------ POLISH-FOLD-CHAIR (S8.10)
import {drawBullpen} from '../../../../../shared/pixel/rooms/bullpen';
import {drawObserverChair, observerPlacard, CHAIR, KEYS_LAND} from './observer-chair';
const CH_AT: [number, number] = [404, 178]; // rooms/bullpen.ts anchors.observerChair
const s810 = (u: 0 | 1 | 2 | 3, keys: number | null, card: boolean) => (fb: Buf) => {
  drawBullpen(fb, 0, {door: 'shut'});
  drawObserverChair(fb, CH_AT[0], CH_AT[1], {unfold: u, keys});
  if (card) { const [rx, ry] = CHAIR.rail(CH_AT[0], CH_AT[1], u); observerPlacard(fb, rx, ry); }
};
D({id: 'POLISH-FOLD-CHAIR', state: 'u0-folded', module: M + 'observer-chair.ts drawObserverChair', note: 'S8.10 over drawBullpen (door shut): the chair standing folded by the window, held drawing 0', draw: s810(0, null, false)});
D({id: 'POLISH-FOLD-CHAIR', state: 'u1', module: M + 'observer-chair.ts', note: 'S8.10: unfolding, held drawing 1 (the seat swinging down, the front legs out)', draw: s810(1, null, false)});
D({id: 'POLISH-FOLD-CHAIR', state: 'u2', module: M + 'observer-chair.ts', note: 'S8.10: unfolding, held drawing 2', draw: s810(2, null, false)});
D({id: 'POLISH-FOLD-CHAIR', state: 'u3-card', module: M + 'observer-chair.ts observerPlacard', note: 'S8.10: open; its reserved-seat card hangs from the top rail (MACROSOFT · OBSERVER (NON-VOTING))', draw: s810(3, null, true)});
D({id: 'POLISH-FOLD-CHAIR', state: 'u3-keys-fall', module: M + 'observer-chair.ts chairKeysAt', note: "S8.10: Tasya's key ring falling onto the seat (drop step 3)", draw: s810(3, 3, true)});
D({id: 'POLISH-FOLD-CHAIR', state: 'u3-keys-landed', module: M + 'observer-chair.ts chairKeysAt', note: 'S8.10: the keys on the seat (the last image)', draw: s810(3, KEYS_LAND + 2, true)});

// ------------------------------------------------------------------ POLISH-CHAPTER-CARD (S5.01) + POLISH-LOBBY-STONE (S8.05)
import {drawChapterCard, drawLobbyStoneNudge} from './cards-inserts';
D({id: 'POLISH-CHAPTER-CARD', state: 'S5.01', module: M + 'cards-inserts.ts drawChapterCard', note: "S5.01: black, cream display type, centred (the full frame; the band here is sheet chrome)",
  draw: (fb) => { const c = new Buf(480, 270, PAL.N0); drawChapterCard(c); for (let i = 0; i < 480 * 203; i++) fb.c[i] = c.c[i]; }});
D({id: 'POLISH-LOBBY-STONE', state: 'S8.05-set', module: M + 'cards-inserts.ts drawLobbyStoneNudge', note: "S8.05: the glass set on the reception desk's pale stone, brass-edged (drawNudgeInsert 'set')",
  draw: (fb) => drawLobbyStoneNudge(fb, 'set')});
D({id: 'POLISH-LOBBY-STONE', state: 'S8.05-nudge', module: M + 'cards-inserts.ts drawLobbyStoneNudge', note: "S8.05: the nudge, one pixel true (drawNudgeInsert 'nudge')",
  draw: (fb) => drawLobbyStoneNudge(fb, 'nudge')});

// ------------------------------------------------------------------ STYLE-LANDLORD-PX (S7.02b) + PROP-PODCAST-BOOM
import {drawLandlordRemapPlate, landlordRemapAt, drawPodcastBoom} from './landlord';
import {mcuRoom, drawBust} from '../../animatic/framing';
import {tasyaSpeakPortrait} from '../../../../../shared/pixel/cast/tasya-speak';
const MK = {below: 126, above: 149, around: 172}; // shots-locked-v5.json S7.02b word marks (shot frames)
const s702b = (k: number, boom = 0 as 0 | 1 | 2 | 3) => (fb: Buf) => {
  const b = new Buf(480, 270, PAL.N0);
  drawLandlordRemapPlate(b, 0, landlordRemapAt(k, MK));
  mcuRoom(b, {third: 'R'});
  drawBust(b, tasyaSpeakPortrait({mouth: 'E', lid: 0, brow: 'warm', arms: 'clasp', jangle: 0}), {third: 'R'});
  drawPodcastBoom(b, 288, 78, boom);
  for (let i = 0; i < 480 * 203; i++) fb.c[i] = b.c[i];
};
D({id: 'STYLE-LANDLORD-PX', state: 'below-k132', module: M + 'landlord.ts drawLandlordRemapPlate', note: 'S7.02b "below" +6 f: the floor going slate outward from under his feet (held 2 f steps)', draw: s702b(132)});
D({id: 'STYLE-LANDLORD-PX', state: 'above-k155', module: M + 'landlord.ts', note: 'S7.02b "above" +6 f: the ceiling from over his head; the floor done', draw: s702b(155)});
D({id: 'STYLE-LANDLORD-PX', state: 'around-k178', module: M + 'landlord.ts', note: 'S7.02b "around" +6 f: the ring closing from the corners onto Mas at his end desk', draw: s702b(178)});
D({id: 'STYLE-LANDLORD-PX', state: 'around-k184', module: M + 'landlord.ts', note: 'S7.02b "around" +12 f: the last of the walls around Mas', draw: s702b(184)});
D({id: 'PROP-PODCAST-BOOM', state: 'step2-dipping', module: M + 'landlord.ts drawPodcastBoom', note: 'S7.02b (optional): the boom dipping in, held step 2 of 3', draw: s702b(120, 2)});
D({id: 'PROP-PODCAST-BOOM', state: 'step3-in', module: M + 'landlord.ts drawPodcastBoom', note: 'S7.02b (optional): in front of his mouth for the record', draw: s702b(140, 3)});

// ------------------------------------------------------------------ ROOM-LOBBY-LOW (S8.01)
import {drawLobbyLow} from './lobby-low';
D({id: 'ROOM-LOBBY-LOW', state: 'unlit-box-in-air', module: M + 'lobby-low.ts drawLobbyLow', note: 'S8.01 open: the letters unlit, the carton coming down in the worker\'s hand (box 0)', draw: (fb) => drawLobbyLow(fb, 0, {sign: 1, box: 0})});
D({id: 'ROOM-LOBBY-LOW', state: 'half-lit-box-set', module: M + 'lobby-low.ts', note: 'S8.01: the brass stab, the sign half-lit (flicker), the carton set (box 2)', draw: (fb) => drawLobbyLow(fb, 4, {sign: 2, box: 2})});
D({id: 'ROOM-LOBBY-LOW', state: 'lit-hand-gone', module: M + 'lobby-low.ts', note: 'S8.01 held: DAYS SINCE SOMEONE TRIED TO FIRE MAS: 0 lit; Mas at the desk; the hand gone (box 4)', draw: (fb) => drawLobbyLow(fb, 12, {sign: 3, box: 4})});
