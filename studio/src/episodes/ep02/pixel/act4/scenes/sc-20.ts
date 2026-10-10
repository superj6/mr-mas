// MR. MAS — Ep2 v1 · act4 · scene 20: (FOR NOW) (JUN 10 → JUN 19, 2024; ELPPA's campus | the zAI lobby; the NopeAI
// lobby; his dark room). 13 shots, 1248 f on the v1 EL lock. The shots pass, 2026-10-09; the record is shots-act4.md.
// The staging is proposal.md sc 20 / script-v1 (its final check: Mas present for the news, his decision shown; the
// note's last Ep2 sight here, away from Alyi's door):
//   SPLIT    20.01 that afternoon: LEFT the crowd thins, Mas pockets his phone and walks out past the end card; RIGHT
//            the zAI lobby (the banner that's been up a while, the brand-new birdcage), Nole's phone lights with Mas's
//            post; 20.02 his lamp clicks on, his post (one crop, with its condition); 20.03 to the visitor: the cage, his
//            own phone in it, the door, the padlock; 20.04 the phone buzzing where he can't reach it, his empty hands,
//            the lamp off
//   MORNING  20.05 the divider slides away (the cage's bars -> the lobby's rack pillars): JUN 11, the confetti swept, the
//            party coming down; Mas, at the back, peels his upside-down flyer off the pillar and folds it into his
//            jacket; 20.06 his fingers find the old note's yellowed corner (no words, 1 s); 20.07 Haras passes, UPSIDE
//            circled, V.O. 13 (lips still); 20.08 the docket tab, legible; 20.09 the rope, the cups lifted just in time,
//            the complaint rising out of frame, the clean rectangle, (FOR NOW) fluttering onto it (no THUD)
//   JUN 19   20.10 a week later: the phone face down, lit; his hand turns it over: Alyi's post, its link card ISS;
//            20.11 TPOOL still open behind it: the card lands on the old check-in pin and knocks it loose; 20.12 his
//            face, reading, still (a face light), the folded flyer out of his jacket, he stands; 20.13 the pin tips off
//            the map and falls (the hard cut to white is 22.01's)
// No V.O. in the split or at Alyi's post (W8). The split's waiting pane a rung down.
import {defineScene, layouts, mouth, mk} from '../../kit';
import type {PxShot} from '../../kit';
import {Buf, clamp} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {splitAt} from '../sets/board';
import {thinning, MAS_EDGE} from '../sets/campus';
import {zaiPane, noleMCU, cageClose, emptyHands, noleMouth, ZAI} from '../sets/zai';
import {morning, docket, pocketECU} from '../sets/lobby';
import {faceDown, phoneRead, masReading, flyerOut, mapECU, faceDownMatch} from '../sets/dark';
import {drawEp2Post} from '../../art/props/ui';
import {roomWalkAt} from '../../../../../shared/pixel/cast/civic-kit';
import type {Mas2Legs} from '../../art/cast/mas2';

const L = layouts();
const W = 480;
const frame = () => new Buf(W, 270, PAL.N0);
const SXR = 121;
const walk = (k: number) => roomWalkAt(k) as Mas2Legs;
/** the left pane after Mas has gone: the lawn nearly empty, the end card */
const leftEmpty = (f: number) => { const l = frame(); thinning(l, f, {thin: 0.9, endcard: true, mas: null}); return l; };
/** the left pane's crop of the lawn: the giant screen and its end card */
const SXL_LAWN = 178;

// ------------------------------------------------------------------ 20.01-20.04 the split
L.add('20.01', {
  st: 'act4/sets/campus thinning | act4/sets/zai zaiPane (SPLIT, that afternoon: LEFT the crowd thinning on the lawn (art/sets/elppa campus, thin), the giant screen\'s end card; Mas pockets his phone and walks out past it; RIGHT the zAI lobby re-composed for the pane: the banner KORG 2: NEXT QUARTER, the glass doors with the visitor\'s silhouette, the brand-new birdcage (its shipping tag, the open padlock), Nole under his lamp (off), phone up; on the toast his phone lights with Mas\'s post (a small card, its own UI))',
  marks: {toast: ['snd', 'ui_toast_pop', 1, 0]},
  draw: (fb, k, sh, f) => {
    const toast = mk(sh, 'toast', 69);
    const left = frame(), right = frame();
    // (the left pane looks at the lawn by the giant screen, its end card up: Mas, at the thinned crowd's edge by the
    // screen's foot, pockets his phone and walks out past it, out of the pane)
    const x = k < 10 ? 196 : Math.round(196 + (k - 10) * 2.8);
    thinning(left, f, {thin: clamp(0.45 + k / 200, 0, 0.9), endcard: true, mas: x < 440 ? {x, legs: k < 10 ? 'stand' : walk(k), arm: k < 10 ? 'pocket' : 'down'} : null});
    zaiPane(right, f, {lamp: 'off', nole: {arm: 'phone'}, lit: k >= toast ? k - toast : undefined});
    splitAt(fb, left, right, {sxL: SXL_LAWN, sxR: SXR});
  },
});
L.add('20.02', {
  st: 'act4/sets/zai zaiPane + art/props/ui drawEp2Post (SPLIT · RIGHT: his lamp clicks on (its warm pool); his own post goes up in its own UI, one crop with its condition: "If ELPPA integrates NOPEAI at the OS level, then ELPPA devices will be banned at my companies. That is an unacceptable security violation." held for its read; LEFT a rung down: the lawn emptying)',
  marks: {lamp: ['snd', 'lamp_click', 1, 0], post: ['txt', 'If ELPPA', 'at', 0]},
  draw: (fb, k, sh, f) => {
    const lamp = mk(sh, 'lamp', 2), post = mk(sh, 'post', 7);
    const right = frame();
    zaiPane(right, f, {lamp: k >= lamp ? 'on' : 'off', nole: {arm: 'phone'}});
    if (k >= post) drawEp2Post(right, 126, 66, 'nole', {size: 'popup', w: 226, k: k - post});
    splitAt(fb, leftEmpty(f), right, {sxL: SXL_LAWN, sxR: SXR, down: 'left'});
  },
});
L.add('20.03', {
  st: 'act4/sets/zai noleMCU → cageClose (SPLIT · RIGHT: [MCU] Nole under his lamp\'s warm light (his conversation portrait), turned to the visitor at the doors, his phone in his hand, the cage beside him: "If they go through with it, visitors\' phones go in here. Like this." lip-synced; [ECU] the cage\'s bars close: his hand sets his own phone on the cage\'s floor and withdraws; the door shuts; the padlock snaps)',
  face: {NOLE: 'lip'},
  marks: {shut: ['snd', 'cage_door_shut', 1, 0], snap: ['snd', 'padlock_snap', 1, 0]},
  draw: (fb, k, sh, f) => {
    const shut = mk(sh, 'shut', 122), snap = mk(sh, 'snap', 137), right = frame();
    if (k < shut - 12) noleMCU(right, f, {mouth: noleMouth(mouth(sh, k, 'NOLE')), lamp: true});
    else cageClose(right, f, {door: k < shut ? 'open' : 'shut', padlock: k < snap ? 'open' : 'locked', hand: k < shut - 8 ? 0 : k < shut - 4 ? 1 : k < shut ? 2 : undefined, snap: k >= snap && k < snap + 3});
    splitAt(fb, leftEmpty(f), right, {sxL: SXL_LAWN, sxR: SXR, down: 'left'});
  },
});
L.add('20.04', {
  st: 'act4/sets/zai cageClose → emptyHands (SPLIT · RIGHT: [ECU] inside the locked cage his phone starts to buzz: replies to his own post stacking up its screen (grey bars, nothing legible) where he can\'t reach them; [MCU] he looks at the padlock, then down at his empty hands (both open at the frame\'s foot); the lamp clicks off)',
  marks: {buzz: ['snd', 'phone_buzz_muffled', 1, 0], off: ['snd', 'lamp_click', 1, 0]},
  draw: (fb, k, sh, f) => {
    const buzz = mk(sh, 'buzz', 4), off = mk(sh, 'off', 69), right = frame();
    if (k < 36) cageClose(right, f, {door: 'shut', padlock: 'locked', buzz: k >= buzz, k: k >= buzz ? 1 + Math.floor((k - buzz) / 4) : 0});
    else emptyHands(right, f, {lamp: k < off, down: k >= 48});
    splitAt(fb, leftEmpty(f), right, {sxL: SXL_LAWN, sxR: SXR, down: 'left'});
  },
});
// ------------------------------------------------------------------ 20.05-20.09 the lobby, JUN 11
L.add('20.05', {
  st: 'act4/sets/lobby morning ([W] ARRIVE: the divider slides away in held steps (the cage\'s bars -> the lobby\'s rack pillars), the lobby full frame on its morning: JUN 11 (rail), the confetti swept into a pile, two staffers taking the party down at the far pillar; Mas at the back by his pillar with his glass; he sets it on the counter, peels his own upside-down flyer off the pillar (the tape\'s sound), folds it and puts it inside his jacket)',
  marks: {peel: ['snd', 'tape_peel', 1, 0], fold: ['snd', 'paper_flutter', 1, 0]},
  draw: (fb, k, sh, f) => {
    const peel = mk(sh, 'peel', 62), fold = mk(sh, 'fold', 91);
    const m = k < 30 ? {peel: 0, arm: 'glass' as const} : k < peel - 8 ? {peel: 0} : k < peel ? {peel: 1} : k < fold ? {peel: 2} : {peel: 3};
    if (k < 10) {
      // the split's last frames: the divider sliding right in three held steps, the lobby revealed under it
      const left = frame(), right = frame();
      morning(left, f, {mas: m});
      cageClose(right, f, {door: 'shut', padlock: 'locked', buzz: true, k: 9});
      splitAt(fb, left, right, {lw: 238 + Math.min(3, Math.floor(k / 3) + 1) * 81, sxL: 0, sxR: SXR, down: 'right'});
      return;
    }
    morning(fb, f, {mas: m});
  },
});
L.add('20.06', {
  st: 'art/cast/mas2 iouCornerECU ([ECU] the inside of his jacket\'s pocket: as he folds the flyer in, his fingers find something already in there: the yellowed corner of the old note, a few faded rules, no words legible; 1 s)',
  marks: {rustle: ['snd', 'cloth_rustle', 1, 0]},
  // (the review pass: two papers, so the plant reads: the folded cream flyer goes in, then his fingers stop on the
  // yellowed corner already there)
  draw: (fb, k, sh, f) => { const r = mk(sh, 'rustle', 2); pocketECU(fb, f, {k: k < r + 4 ? 0 : k < r + 9 ? 1 : k < r + 18 ? 2 : 3}); },
});
L.add('20.07', {
  st: 'act4/sets/lobby morning ([W] HARAS passes (art/cast/haras room, walking), her calculator tape trailing behind her, UPSIDE circled on it (legible); Mas at the back with his glass, the folded flyer in his jacket; V.O. 13 typed by the host, his lips still)',
  draw: (fb, k, sh, f) => {
    // (the review pass: her trailing tape and its UPSIDE tag struck through the typed V.O.; she passes and stops short
    // of the line's end, her tape behind her to the right, clear of it)
    morning(fb, f, {mas: {peel: 3, arm: 'glass'}, haras: Math.round(400 - Math.min(k, 100) * 1.95)});
    void sh;
  },
});
L.add('20.08', {
  st: 'act4/sets/lobby docket ([ECU] full frame: in the middle of the floor the complaint has sat since February, coffee cups on it (their rings on the cover); its docket tab, flicked: HEARING · JUN 12 · MOTION TO DISMISS, legible for its read)',
  marks: {flick: ['snd', 'docket_tab_flick', 1, 0]},
  draw: (fb, k, sh, f) => { docket(fb, f, {flick: k - mk(sh, 'flick', 4)}); },
});
L.add('20.09', {
  st: 'act4/sets/lobby morning ([W] a rope drops from above and hooks the complaint; a staffer lifts the cups off it just in time; the complaint rises out of frame on the rope, leaving a clean rectangle on the carpet; a sticky note flutters down onto it in held steps: (FOR NOW), legible once it lands; no THUD)',
  marks: {drop: ['snd', 'rope_drop', 1, 0], haul: ['snd', 'rope_haul', 1, 0], note: ['snd', 'sticky_flutter', 1, 0]},
  draw: (fb, k, sh, f) => {
    const drop = mk(sh, 'drop', 4), haul = mk(sh, 'haul', 26), note = mk(sh, 'note', 62);
    const cups = (k < haul - 14 ? 0 : k < haul - 6 ? 1 : 2) as 0 | 1 | 2;
    const rope = k < haul ? 0 : Math.min(200, Math.floor((k - haul) / 2) * 2 * 8);
    const comp = k < drop + 8 ? 'table' as const : rope < 200 ? {rope} : 'rect' as const;
    morning(fb, f, {mas: {peel: 3, arm: 'glass'}, complaint: comp, cups, note: k < note ? null : Math.min(4, Math.floor((k - note) / 3))});
    // the rope coming down to the complaint before it hooks (from the ceiling, its hook end lowering)
    if (k >= drop && k < drop + 8) { const y = Math.min(160, (k - drop + 1) * 22); for (let yy = 0; yy < y; yy++) { fb.set(176, yy, PAL.D3); fb.set(177, yy, PAL.D2); } fb.set(175, y, PAL.G5); fb.set(176, y + 1, PAL.G5); fb.set(178, y + 1, PAL.G5); }
  },
});
// ------------------------------------------------------------------ 20.10-20.13 JUN 19, his dark room
L.add('20.10', {
  st: 'act4/sets/dark faceDown → phoneRead ([ECU] ARRIVE: a week later, his dark room: his phone face down on the desk (2 s); it lights at its edges (the buzz); his hand turns it over (the art\'s turn); the phone in his hand: TPOOL still open on its map, and over it Alyi\'s post in its own UI, "I am starting a new company:", its link card ISS · "one goal and one product: a safe superintelligence", legible)',
  marks: {buzz: ['snd', 'phone_buzz_step_1', 1, 0], turn: ['snd', 'phone_turn_over', 1, 0], post: ['txt', 'I am starting', 'at', 0], card: ['txt', 'ISS', 'at', 0]},
  draw: (fb, k, sh, f) => {
    const buzz = mk(sh, 'buzz', 45), turn = mk(sh, 'turn', 55), post = mk(sh, 'post', 62), card = mk(sh, 'card', 72);
    // (the review pass: the object match from 20.09's clean rectangle: the phone face down lying where it lay, the
    // same horizontal shape in the same place; then reframed to the top-down ECU for the buzz and the turn)
    if (k < 24) { faceDownMatch(fb, f, {}); return; }
    if (k < turn) { faceDown(fb, f, {lit: k >= buzz, turn: 0}); return; }
    if (k < turn + 6) { faceDown(fb, f, {lit: true, turn: 1}); return; }
    phoneRead(fb, f, {post: k >= post ? k - post : undefined, card: k >= card ? 0 : undefined});
  },
});
L.add('20.11', {
  st: 'act4/sets/dark phoneRead ([ECU] behind the post TPOOL is still open on its map; the link card drops out of the post and lands on the old check-in pin, and knocks it loose (it tips, the knock\'s ticks); no app tracks anyone)',
  marks: {knock: ['snd', 'pin_knock', 1, 0]},
  draw: (fb, k, sh, f) => {
    // (the review pass: a true ECU on the map, the pin ~100 px at 1080p with sc 15's ripple and Alyi's tag; the card's
    // corner falls into frame and strikes it on the knock)
    const kn = mk(sh, 'knock', 19);
    mapECU(fb, f, {card: k < kn - 10 ? 0 : Math.min(1, (Math.floor((k - (kn - 10)) / 2) * 2) / 10), pin: k >= kn ? 1 : 0});
  },
});
L.add('20.12', {
  st: 'act4/sets/dark masReading → flyerOut → masReading ([MCU] Mas reading, still (his approved portrait, the morning window behind him keyed one step: a face light; the phone\'s light on his chin), 2 s; [INSERT] his hand takes the folded flyer (white, the tape on its corners) out of his jacket; [MCU] he stands: his face rises out of the frame\'s top, the chair\'s creak)',
  marks: {rustle: ['snd', 'cloth_rustle', 1, 0], creak: ['snd', 'chair_creak', 1, 0]},
  draw: (fb, k, sh, f) => {
    const rs = mk(sh, 'rustle', 48), cr = mk(sh, 'creak', 72);
    // (the review pass: reading is eyes DOWN on the phone below frame, the light on his chin; the decision is his eyes
    // coming up, a beat before his hand goes to his jacket)
    if (k < rs) { masReading(fb, f, {down: k < rs - 14}); return; }
    if (k < cr) { flyerOut(fb, f, {up: Math.min(2, Math.floor((k - rs) / 6))}); return; }
    // he stands: the camera tilts up with him in held steps (his head stays in frame), then he steps out of frame
    // right, leaving the room
    const st = k - cr;
    masReading(fb, f, {rise: st < 4 ? 4 : 10, pan: st < 4 ? 14 : st < 8 ? 30 : 40, look: 0, out: st < 12 ? 0 : Math.min(400, Math.floor((st - 12) / 3) * 3 * 24)});
  },
});
L.add('20.13', {
  st: 'act4/sets/dark phoneRead ([ECU] on the phone the knocked pin tips off the map and falls, out past the screen\'s foot (the hard cut to white is 22.01\'s first frame, the pin falling into it))',
  marks: {fall: ['snd', 'pin_fall', 1, 0]},
  draw: (fb, k, sh, f) => {
    // the knocked pin tips off its spot and drops out past the frame's foot, tumbling, accelerating on 2s, leaving the
    // frame on the cut (it falls on into 22.01's white at the same size and the same x)
    const fall = mk(sh, 'fall', 14), d = Math.floor(Math.max(0, k - fall) / 2) * 2;
    mapECU(fb, f, {card: 1, pin: k < fall ? 1 : 2 + Math.round(0.1 * d * d + 1.0 * d)});
  },
});

export const SCENE = defineScene({scene: '20', layouts: L.all});
void ZAI;
