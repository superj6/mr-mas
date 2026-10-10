// MR. MAS — Ep2 v1 · act3 · scene 17: THE NDA ACROSS THE BRIDGE (MAY 17 -> MAY 20, 2024; NopeAI's front doors, the Bay
// Bridge; THE S3; act-out 2). 21 shots, 3,120 f on the v1 EL lock. The shots pass, 2026-10-09; the record is
// shots-act3.md. The staging is proposal.md sc 17 (round 2: Mas heard acting, the drafts grey bars, the apology the next
// afternoon, May 20 a new day; final check: the papers start at NopeAI's front doors; script review: the company's
// post is its pause, the Forecaster from the street, his voice inside the scramble) / script-v1:
//   PHRASE 1  17.01 the receipt already pouring out of NopeAI's front doors; the Forecaster walks up from the street and
//             stops beside it · 17.02 one quick run down and across all five lanes; its print legible; traffic slows,
//             stops
//   PHRASE 2  17.03 the far lane: the Forecaster (the card) · 17.04 the pen on its bank chain rises out of the receipt;
//             he tells it where he is (Mas outside it, small in the foreground) · 17.05 the driver · 17.06 "Already
//             did."; the chain draws the pen back · 17.07 mid-span, Mas sees it, his phone already lit
//   PHRASE 3  17.08 his phone won't stop · 17.09 he calls LEGAL (his face locked; his side, quick) · 17.10 a draft typed,
//             deleted, typed: grey bars · 17.11 his still face; V.O. 9
//   PHRASE 4  17.12 the Forecaster beside him: the forecast · 17.13 his thumb over Post; V.O. 10 · 17.14 the night, one
//             held wide, the lights cycling once
//   PHRASE 5  17.15 the next afternoon: his post over the sky, one trim per honk; "Updating." · 17.16 the honking driver
//   PHRASE 6-7 17.17 May 20, rain: the blimp drifts in; the cloud with a blank letterhead parks over it; thunder ·
//             17.18 it rains letterhead; the ink runs; the umbrella egg · 17.19 his thumb on Pause: VOICE 5 [PAUSED] ·
//             17.20 his company's post, two fragments · 17.21 the blimp sags, its lights click off; black (act-out 2)
import {defineScene, layouts, mouth, roomMouth, mk} from '../../kit';
import {Buf} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {applyPalette} from '../../../../../shared/pixel/palettes';
import {freeze2, FREEZE_DARK, drawGagCard} from '../../../../ep01/pixel/act2/kit2';
import {BIG_CAP, textWidth} from '../../../../../shared/pixel/font';
import type {GagCard} from '../../../../ep01/pixel/act2/kit2';
import {drawBlimp, drawStormCloud} from '../../art/creatures';
import {fill, vramp, bpw} from '../../art/kit';
import {doors, run, runLayout, deck, penLow, foreMCU, driver, scrambleScreen, phoneBridge, masCall, shoes, fore2S, menu, PB} from '../sets/bridge';
import type {Across} from '../sets/bridge';
import {ease} from '../sets/common';

const L = layouts();
const walkI = (k: number) => Math.floor(k / 3);
/** the bridge's evening cast: the Forecaster on the far lane, Mas on the near one */
const EVE: Across = {time: 'evening', receipt: 'fresh'};

L.add('17.01', {
  st: 'act3/sets/bridge doors ([W] NopeAI\'s front doors at the top of the hill (art/sets/bridge bridgeDoors: the cathedral\'s facade, its rack-pillar buttresses, the rose window) in the evening: the exit agreement already pouring out of them like a pharmacy receipt, down the steps; THE FORECASTER (art/cast/forecaster room) walks up from the street, not out of the building, the first person to stop beside it, and looks down at it; rail MAY 17, 2024)',
  draw: (fb, k, sh, f) => {
    const stop = 62, fx = k < stop ? 470 - Math.round(k * 2.9) : 470 - Math.round(stop * 2.9);
    doors(fb, f, {pour: Math.min(1, 0.55 + k / 160), fx, legs: k < stop ? walkI(k) : null});
    void sh;
  },
});
/** 17.02: where the receipt's run sits (run-x at the frame's centre) per frame: it slides in, parks so the first two
 *  lines share the frame, then the second and the clause, then the clause alone, then the coupon, each held at least
 *  to its read floor (0.25 s + 0.05 s a character) and inside the lock's window for it */
const RUN_KEYS = (() => {
  const {xs, ws} = runLayout();
  const P1 = Math.round((xs[0] + xs[1] + ws[1]) / 2), P2 = Math.round((xs[1] + xs[2] + ws[2]) / 2), P3 = xs[2] + ws[2] - 244, P4 = xs[4] + ws[4] - 236;
  return [[0, P1 - 420], [16, P1], [62, P1], [66, P2], [96, P2], [102, P3], [114, P3], [120, P4], [999, P4]] as Array<[number, number]>;
})();
const runAt = (k: number) => { for (let i = 0; i < RUN_KEYS.length - 1; i++) { const [k0, a] = RUN_KEYS[i], [k1, b2] = RUN_KEYS[i + 1]; if (k < k1) return ease(k, k0, k1, a, b2); } return RUN_KEYS[RUN_KEYS.length - 1][1]; };
L.add('17.02', {
  st: 'act3/sets/bridge run ([W] one quick run, three parallax planes: the far city and the bay, the towers and their cables, the lanes; the receipt runs across the lanes in the near plane in the evening rush, its print legible as it goes, parked on each line for its read: NON-DISPARAGEMENT · IN PERPETUITY · CLAUSE 9: THIS RECEIPT DOES NOT EXIST. · and at its very end the coupon SAVE 0% ON YOUR NEXT EXIT; the cars roll over it, slowing, then stop; a honk)',
  draw: (fb, k, sh, f) => {
    const at = held(runAt(k), k);
    const v = (kk: number) => Math.max(0, 6 * (1 - kk / 120));
    let carS = 0; for (let q = 0; q < Math.min(k, 120); q++) carS += v(q);
    run(fb, f, {s: at, at, carS: Math.round(carS), stopped: k >= 120 ? 1 : 0});
    void sh;
  },
});
function held(x: number, k: number) { void k; return Math.round(x); }

const CARD_FORE: GagCard = {x: 14, y: 12, name: 'THE FORECASTER', lines: ['EX-NOPEAI.'], stat: ['AT STAKE: ~$2M'], accent: PAL.L3};
const KEEP3 = new Map<number, Uint8Array>();
L.add('17.03', {
  st: 'act3/sets/bridge deck ([W] across the lanes, the bridge in the evening rush (art/sets/bridge bridgeDeck: five lanes stalled on the receipt, the far pedestrian lane, the cables, the city across the bay): THE FORECASTER walks up the far lane with his clipboard; Mas small in the foreground on the near lane; on the hit the 2-TONE FREEZE with the Forecaster kept in colour and the card THE FORECASTER / EX-NOPEAI. + AT STAKE: ~$2M, the stat in the LEDGER pass for six frames)',
  marks: {hit: ['snd', 'freeze_hit_F', 1, 0], stat: ['txt', 'AT STAKE', 'at', 0]},
  draw: (fb, k, sh, f) => {
    const hit = mk(sh, 'hit', 24), stat = mk(sh, 'stat', 33);
    const kk = Math.min(k, hit), fx = 474 - Math.round(kk * 1.9);
    const st: Across = {...EVE, fore: {x: fx, p: {state: 'walk', legs: (['w0', 'w1', 'w2', 'w3'] as const)[walkI(kk) & 3]}}, mas: {x: 96, arm: 'down'}};
    const ff = k >= hit ? f - k + hit : f;
    deck(fb, ff, st);
    if (k >= hit) {
      let keep = KEEP3.get(fx);
      if (!keep) {
        const A = new Buf(480, 270, 0), B = new Buf(480, 270, 0);
        deck(A, ff, st); deck(B, ff, {...st, fore: null});
        keep = new Uint8Array(480 * 203); for (let i = 0; i < keep.length; i++) keep[i] = A.c[i] !== B.c[i] ? 1 : 0;
        KEEP3.set(fx, keep);
      }
      const km = keep;
      freeze2(fb, (x, y) => y < 203 && km[y * 480 + x] === 1, FREEZE_DARK);
      drawGagCard(fb, k - hit + 3, CARD_FORE);
      // the stat's tilde (the card's face has none: drawn by hand in the stat's gap, once typed past it)
      const plateH = BIG_CAP + 16 + CARD_FORE.lines.length * 10, sx = CARD_FORE.x, sy = CARD_FORE.y - 5 + plateH + 3, card = k - hit + 3;
      if (card >= 16 && (card - 16) * 2 > 10) { const tx = sx + textWidth('AT STAKE: '), ty = sy + 6; for (const [dx, dy] of [[0, 1], [1, 0], [2, 1], [3, 1], [4, 0]]) { fb.set(tx + dx + 1, ty + dy + 1, PAL.N1); fb.set(tx + dx, ty + dy, PAL.N8); } }
      // the money: the stat line in the LEDGER pass (green ledger paper) for six frames
      const sw = textWidth(CARD_FORE.stat[0]);
      if (k >= stat && k < stat + 6) applyPalette(fb, 'LEDGER', {rect: [sx - 5, sy, sw + 10, 13]});
    }
  },
});
L.add('17.04', {
  st: 'act3/sets/bridge penLow → foreMCU → deck → foreMCU ([LOW] at the receipt: a pen on a bank chain rises out of the paper and offers itself to him (it comes from the receipt, never from Mas\'s hand), his rising toward him out of frame above; [MCU] the Forecaster on the far lane (art/cast/forecaster bust, kind and precise, keyed by the low sun), the pen hanging in front of him; he tells it where he is (lip-synced); [W] across the lanes: Mas outside the refusal, small in the foreground; "It says in perpetuity." (room mouth); [MCU] "I don\'t forecast that far.")',
  face: {FORECASTER: 'lip'},
  marks: {rat: ['snd', 'pen_chain_rattle', 1, 0], on: ['on', 'e2-a3-0016', 0], says: ['w', 'e2-a3-0016', 'says', -6], dont: ['w', 'e2-a3-0016', "don't", -4]},
  draw: (fb, k, sh, f) => {
    const rat = mk(sh, 'rat', 9), on = mk(sh, 'on', 62), says = mk(sh, 'says', 180), dont = mk(sh, 'dont', 244);
    if (k < on - 6) { penLow(fb, f, {rise: k < rat ? 0 : Math.min(1, Math.floor((k - rat) / 4) * 4 / 40)}); return; }
    if (k < says || k >= dont) { foreMCU(fb, f, {mouth: mouth(sh, k, 'FORECASTER'), expr: 'focus', pen: 1}); return; }
    deck(fb, f, {...EVE, fore: {x: 386, p: {state: 'talk', mouth: roomMouth(sh, k, 'FORECASTER')}}, pen: {rise: 1}, mas: {x: 96, arm: 'down'}});
  },
});
L.add('17.05', {
  st: 'act3/sets/bridge driver ([M] the DRIVER (art/sets/bridge driverWindow: a navy cap, a red work jacket, his forearm on the sill), parked on the receipt, rolls his window down and leans out: "You gonna think it over, or can we move? We\'re parked on it." (lip-synced, quick))',
  face: {DRIVER: 'lip'},
  marks: {win: ['snd', 'car_window_down', 1, 0]},
  draw: (fb, k, sh, f) => { const w = mk(sh, 'win', 2); driver(fb, f, {mouth: mouth(sh, k, 'DRIVER'), glass: k < w ? 1 : k < w + 3 ? 0.5 : 0}); },
});
L.add('17.06', {
  st: 'act3/sets/bridge foreMCU → deck ([MCU] the Forecaster, letting the pen go: "Already did. It\'s the one thing I didn\'t need a number for." (lip-synced; word for word, the keep list); [W] back across the lanes: the chain draws the pen back down into the paper; Mas small in the foreground, his phone coming up lit)',
  face: {FORECASTER: 'lip'},
  marks: {rat: ['snd', 'pen_chain_rattle', 1, 0]},
  draw: (fb, k, sh, f) => {
    const rat = mk(sh, 'rat', 90);
    if (k < rat - 2) { foreMCU(fb, f, {mouth: mouth(sh, k, 'FORECASTER'), expr: k < 30 ? 'neutral' : 'smile', pen: 1}); return; }
    deck(fb, f, {...EVE, fore: {x: 386, p: {state: 'stand'}}, pen: {rise: Math.max(0, 1 - Math.floor((k - rat) / 3) * 3 / 18)}, mas: {x: 96, arm: k > rat + 30 ? 'phone' : 'down', bow: k > rat + 30, lit: k > rat + 30}});
  },
});
L.add('17.07', {
  st: 'act3/sets/bridge deck ([W] mid-span on the receipt: Mas, small on the near lane, has seen it; his phone already lit in his hands, its glow on his chest; it buzzes; the Forecaster across the lanes)',
  marks: {bz: ['snd', 'phone_buzz_step_1', 1, 0]},
  draw: (fb, k, sh, f) => {
    const bz = mk(sh, 'bz', 46);
    const shake = k >= bz && k < bz + 6 ? ((k >> 1) & 1) : 0;
    deck(fb, f, {...EVE, fore: {x: 386, p: {state: 'stand'}}, mas: {x: 96 + shake, arm: 'phone', bow: true, lit: true}});
  },
});
/** 17.08's thumb: quick, from item to item (the screenshot, the tile, the push), on held drawings */
const FLICK: Array<[number, number]> = [[PB.x + 120, PB.y + 166], [PB.x + 40, PB.y + 176], [PB.x + 96, PB.y + 186], [PB.x + 132, PB.y + 150], [PB.x + 70, PB.y + 170]];
L.add('17.08', {
  st: 'act3/sets/bridge phoneBridge + scrambleScreen ([ECU] his phone won\'t stop, in his hand at dusk on the bridge (his thumb fast, item to item, posed on the glass: common cupThumb): the staff\'s screenshot of a clause (NON-DISPARAGEMENT highlighted); a grey LEGAL tile, call me (an icon, never named, never a face); a second request for comment; each buzz drops one in)',
  marks: {b1: ['snd', 'phone_buzz_step_2', 1, 0], b2: ['snd', 'phone_buzz_step_3', 1, 0], b3: ['snd', 'phone_buzz_step_4', 1, 0]},
  draw: (fb, k, sh, f) => {
    const b = [mk(sh, 'b1', 4), mk(sh, 'b2', 38), mk(sh, 'b3', 79)];
    const step = b.filter((v) => k >= v + 3).length;
    const last = [...b].reverse().find((v) => k >= v + 3) ?? 0;
    phoneBridge(fb, f, (scr) => scrambleScreen(scr, {mode: 'stack', step, k: k - last - 3}), FLICK[Math.floor(k / 5) % FLICK.length]);
  },
});
L.add('17.09', {
  st: 'act3/sets/bridge phoneBridge → masCall ([ECU] his thumb on the LEGAL tile; the call rings; [MCU] his face, locked, at dusk on the bridge (his approved portrait, the low sun keyed a step), the phone pressed to his ear in his hand; we hear only his side, level, and quicker than he ever talks: "everyone who signed one. find them. all of them. today." (lip-synced); his face doesn\'t move)',
  face: {MAS: 'lip'},
  marks: {ring: ['snd', 'call_ring', 1, 0], con: ['snd', 'call_connect', 1, 0]},
  draw: (fb, k, sh, f) => {
    const ring = mk(sh, 'ring', 4), con = mk(sh, 'con', 37);
    if (k < con - 7) {
      if (k < ring + 4) phoneBridge(fb, f, (scr) => scrambleScreen(scr, {mode: 'stack', step: 3, k: 9}), [PB.x + 50, PB.y + 92]);
      else phoneBridge(fb, f, (scr) => scrambleScreen(scr, {mode: 'call'}), [PB.x + 120, PB.y + 196]);
      return;
    }
    masCall(fb, f, {mouth: mouth(sh, k, 'MAS'), call: true});
  },
});
L.add('17.10', {
  st: 'act3/sets/bridge phoneBridge + scrambleScreen draft ([ECU] a draft opened, typed, deleted, typed: its words grey bars, no legible word, no voice over it; his thumb on the keyboard, the Post button lit only while there is anything in it)',
  marks: {t1: ['snd', 'key_tap_soft_01', 1, 0], del: ['snd', 'key_delete_run', 1, 0], t2: ['snd', 'key_tap_soft_03', 1, 0]},
  draw: (fb, k, sh, f) => {
    const t1 = mk(sh, 't1', 9), del = mk(sh, 'del', 43), t2 = mk(sh, 't2', 72);
    const typedA = Math.max(0, Math.min(del, k) - t1) * 9;
    const bars = k < del ? typedA : k < del + 14 ? Math.max(0, typedA - (k - del) * 26) : k < t2 ? 0 : (k - t2) * 9;
    const keyTip: [number, number] = k >= del && k < del + 14 ? [PB.x + 132, PB.y + 196] : [PB.x + 20 + ((k * 37) % 110), PB.y + 162 + ((k >> 2) % 3) * 22];
    phoneBridge(fb, f, (scr) => scrambleScreen(scr, {mode: 'draft', bars, f}), keyTip);
  },
});
L.add('17.11', {
  st: 'act3/sets/bridge shoes → masCall ([ECU] his sneakers on the receipt, the paper still unrolling under them; [MCU] his face doesn\'t move (the face still, the inside fast): V.O. 9 typed by the host over his still face, never over the draft; his lips still)',
  draw: (fb, k, sh, f) => {
    if (k < 16) { shoes(fb, f, {k}); return; }
    masCall(fb, f, {mouth: 'rest', look: -1});
    void sh;
  },
});
L.add('17.12', {
  st: 'act3/sets/bridge deck → fore2S ([W] the Forecaster crosses the stalled lanes toward him, between the cars; [2S] he stops beside Mas, clipboard up: "I\'ve got a forecast on you. Median: an apology, within the hour, in lowercase." (lip-synced, pleasantly); Mas still)',
  face: {FORECASTER: 'lip'},
  draw: (fb, k, sh, f) => {
    if (k < 56) { const t = k / 56; deck(fb, f, {...EVE, foreLane: {x: Math.round(330 - t * 150), y: Math.round(158 + t * 38), legs: walkI(k)}, mas: {x: 96, arm: 'phone', bow: true, lit: true}}); return; }
    fore2S(fb, f, {mouth: mouth(sh, k, 'FORECASTER'), expr: 'smile'});
  },
});
L.add('17.13', {
  st: 'act3/sets/bridge phoneBridge + scrambleScreen draft ([ECU] the draft whole (grey bars), Post lit; his thumb comes up and hovers over Post, its shadow on the glass, and doesn\'t press; V.O. 10 typed by the host)',
  draw: (fb, k, sh, f) => {
    const t = Math.min(1, k / 24);
    const tip: [number, number] = [Math.round(PB.x + 70 + t * 34), Math.round(PB.y + 150 - t * 96)];
    phoneBridge(fb, f, (scr) => scrambleScreen(scr, {mode: 'draft', bars: 520, f}), tip);
    void sh;
  },
});
L.add('17.14', {
  st: 'act3/sets/bridge deck ([W] the night, one held wide: the bridge\'s lights cycle once along the cable (a palette cycle, never a strobe); Mas still on the receipt, a silhouette; the Forecaster asleep against the far rail, his clipboard on his chest)',
  draw: (fb, k, sh, f) => { deck(fb, f, {time: 'night', cycle: Math.min(3, Math.floor(k / 12)), receipt: 'fresh', fore: {x: 386, p: {state: 'asleep'}}, mas: {x: 96, arm: 'down'}}); void sh; },
});
L.add('17.15', {
  st: 'act3/sets/bridge deck ([W] the next afternoon (rail MAY 18): Mas posts; his post pops up over the sky in its own UI, his lowercase, one trim per honk from the car behind him (vested equity is vested equity, full stop. · this is on me… · …i did not know this was happening and i should have. · …they can contact me and we\'ll fix that too.), each held to its read; the Forecaster wakes against the rail, checks his watch, crosses out an hour: "Updating." (room mouth))',
  face: {FORECASTER: 'room'},
  marks: {post: ['snd', 'post_click', 1, 0], h2: ['snd', 'car_honk_2', 1, 0], h3: ['snd', 'car_honk_3', 1, 0], h4: ['snd', 'car_honk_4', 1, 0], h5: ['snd', 'car_honk_5', 1, 0], scr: ['snd', 'pen_scribble_short', 1, 0]},
  draw: (fb, k, sh, f) => {
    const post = mk(sh, 'post', 36), h = [mk(sh, 'h2', 98), mk(sh, 'h3', 124), mk(sh, 'h4', 196), mk(sh, 'h5', 258)], scr = mk(sh, 'scr', 274);
    const ids = ['apology1', 'apology2', 'apology3', 'apology4'] as const;
    const n = h.filter((v) => k >= v).length;
    const since = n === 0 ? k - post - 2 : k - h[n - 1];
    const wake = 200;
    const lastHonk = [...h].reverse().find((v) => k >= v) ?? -99;
    // four trims: the first on the post, the next three on the honks h2-h4; the last honk (h5) finds the last trim
    // already up, so the card gives a small shake on it instead of popping in again (the review: the re-pop read as a
    // stutter)
    const shake = n === 4 && k - h[3] < 6 ? (((k - h[3]) >> 1) % 2 ? 1 : -1) : 0;
    deck(fb, f, {time: 'afternoon', receipt: 'fresh', fore: {x: 386, p: k < wake ? {state: 'asleep'} : k < scr - 14 ? {state: 'stand'} : {state: 'cross', mouth: roomMouth(sh, k, 'FORECASTER')}}, mas: {x: 96, arm: 'phone', bow: k < post + 4}, post: k >= post + 2 && n < 4 ? {id: ids[n], k: since} : k >= post + 2 ? {id: 'apology4', k: k - h[2], shake} : null, honk: k - lastHonk});
  },
});
L.add('17.16', {
  st: 'act3/sets/bridge driver → deck ([M] the DRIVER who has been honking leans out to Mas: "Excuse me. Does honking count as disparagement?" (lip-synced, worried); he looks down to the receipt for the line and reads it, his hand off the horn; the car behind him honks; [W] the Forecaster tucks his clipboard under his arm and walks off the bridge, frame-right; Mas answers nobody)',
  face: {DRIVER: 'lip'},
  marks: {honk: ['snd', 'car_honk_1', 1, 0]},
  draw: (fb, k, sh, f) => {
    const honk = mk(sh, 'honk', 112);
    if (k < honk + 2) { driver(fb, f, {mouth: mouth(sh, k, 'DRIVER'), expr: 'worry'}); if (k >= honk) { for (let q = 0; q < 3; q++) { fill(fb, 456 + q * 6, 150 - q * 4, 4, 1, PAL.P2); fill(fb, 456 + q * 6, 160 + q * 4, 4, 1, PAL.P2); } } return; }
    const kk = k - honk - 2;
    deck(fb, f, {time: 'afternoon', receipt: 'fresh', fore: {x: 400 + Math.round(kk * 2.6), p: {state: 'walk', legs: (['w0', 'w1', 'w2', 'w3'] as const)[walkI(kk) & 3]}, flip: false}, mas: {x: 96, arm: 'phone', bow: true}, honk: kk + 2});
  },
});
L.add('17.17', {
  st: 'act3/sets/bridge deck ([W] May 20 (rail), a new day on the bridge in rain: traffic moving again over the receipt, trodden flat along the lane (grey with the wet, its print faint, tyre tracks along it, torn through in places), Mas under a plain umbrella on the near lane; the her blimp drifts in over the bay; a storm cloud with a blank letterhead rolls out of the city and parks over it; thunder, tuned: one pop of the sky, at or under 80% white, never a strobe)',
  marks: {th: ['snd', 'thunder_tuned_F', 1, 0]},
  draw: (fb, k, sh, f) => {
    const th = mk(sh, 'th', 177);
    const bx = k < 20 ? 560 : Math.max(330, 560 - Math.round((k - 20) * 2.1));
    const cx = k < 60 ? -140 : Math.min(262, -140 + Math.round((k - 60) * 3.6));
    deck(fb, f, {time: 'rain', receipt: 'flat', moving: true, blimp: {size: 3, x: bx, y: 70, lights: 5}, cloud: {x: cx, y: 8}, flash: k === th || k === th + 1, mas: {x: 96, arm: 'umbrella'}});
  },
});
L.add('17.18', {
  st: 'act3/sets/bridge deck ([W] it rains letterhead from the cloud (blank sheets: the actress is never drawn, voiced or named); the receipt\'s ink runs down the lanes in the rain; far off on dry land the Forecaster opens an umbrella printed with a probability curve (the egg))',
  marks: {um: ['snd', 'umbrella_pop', 1, 0]},
  draw: (fb, k, sh, f) => {
    const um = mk(sh, 'um', 121);
    // the receipt's ink runs: its print washing out and streaking along the wet paper, a little more as the shot goes
    deck(fb, f, {time: 'rain', receipt: 'ink', inkRun: 2 + Math.floor(k / 28), moving: true, blimp: {size: 3, x: 330, y: 70, lights: 5}, cloud: {x: 262, y: 8}, umbrella: k >= um, mas: {x: 96, arm: 'umbrella'}});
  },
});
L.add('17.19', {
  st: 'act3/sets/bridge menu ([POV] his rain-beaded phone (art/sets/bridge voiceMenu): the voice menu, five live waveforms; his wet thumb finds VOICE 5 and taps Pause; the slot greys, VOICE 5 [PAUSED], its Hey. greyed under it)',
  marks: {tap: ['snd', 'ui_pause_tap', 1, 0]},
  draw: (fb, k, sh, f) => { const tap = mk(sh, 'tap', 48); menu(fb, f, {paused: k >= tap + 4, thumb: k >= 20 && k < tap + 30}); },
});
L.add('17.20', {
  st: 'act3/sets/bridge menu ([ECU] beside the greyed slot, his company\'s post pops up in its own UI, two fragments, the second a beat after the first: "We\'ve heard questions about how we chose the voices…" · "…We are working to pause the use of…" (cropped before the voice\'s name; it claims nothing about how the voice was made, and answers no one))',
  marks: {pop: ['snd', 'ui_toast_pop', 1, 0], two: ['txt', '…We are working', 'at', 0]},
  draw: (fb, k, sh, f) => { const pop = mk(sh, 'pop', 7), two = mk(sh, 'two', 48); menu(fb, f, {paused: true, thumb: false, post: {k1: k - pop, k2: k - two}}); },
});
/** 17.21: closer on the blimp under the cloud in the rain */
const blimpClose = (b: Buf, f: number, st: {lights: number; sag: number}) => {
  vramp(b, 0, 0, 480, 203, [PAL.N2, PAL.N3, PAL.G2]);
  for (let x = 0; x < 480; x += 6) { const hh = 4 + ((x * 37) % 13); fill(b, x, 180 - hh, 6, hh, PAL.G1); }
  fill(b, 0, 180, 480, 23, PAL.N2);
  drawStormCloud(b, 130, -22, f, {rain: true});
  drawStormCloud(b, 250, -26, f + 5, {rain: true});
  drawBlimp(b, 236, 104, 4, {lights: st.lights, sag: st.sag});
  for (let q = 0; q < 160; q++) { const rx = (q * 97 + f * 5) % 480, ry = (q * 61 + f * 9) % 203; b.set(rx, ry, PAL.G5); b.set(rx - 1, ry + 1, PAL.G4); }
};
L.add('17.21', {
  st: 'act3/sets/bridge blimpClose ([W] the her blimp under the cloud in the rain, closer: it sags three pixels; its running lights click off one by one on their sounds; the last one clicks off on the DREAD sting; a beat dark; then black: act-out 2)',
  marks: {l1: ['snd', 'blimp_lights_off', 1, 0], l2: ['snd', 'blimp_lights_off', 2, 0], l3: ['snd', 'blimp_lights_off', 3, 0], l4: ['snd', 'blimp_lights_off', 4, 0]},
  draw: (fb, k, sh, f) => {
    const offs = [mk(sh, 'l1', 14), mk(sh, 'l2', 31), mk(sh, 'l3', 48), mk(sh, 'l4', 67)];
    const n = offs.filter((v) => k >= v).length;
    if (k >= 95) { fill(fb, 0, 0, 480, 203, PAL.N0); return {noRail: true}; }
    blimpClose(fb, f, {lights: 4 - n, sag: Math.min(3, n)});
    if (n === 4) for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) fb.set(x, y, stepColor(fb.get(x, y), -Math.min(2, 1 + Math.floor((k - offs[3]) / 10))));
  },
});

export const SCENE = defineScene({scene: '17', layouts: L.all});
