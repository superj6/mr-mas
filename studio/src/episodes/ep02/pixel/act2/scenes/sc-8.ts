// MR. MAS — Ep2 v1 · act2 · scene 8: THE DARK ROOM (APR 1 → MAY 10, 2024; his dark room, night). 7 shots, 1056 f on
// the v1 EL lock. The shots pass, 2026-10-09; the record is shots-act2.md. The staging is proposal.md sc 8 / script-v1:
//   ARRIVE   8.01 over his right shoulder onto the monitor, the glass in the foreground, the GUEST lanyard framed on
//            the wall: 2.2 s on the room before the notification pops; the RULEBOOK slides down; the ECU: his two
//            fingertips flick it away, unopened (the SNOOZE never pressed)
//   MOVES    8.02 one whole-pixel scroll to the news site (the headline in its own UI; the still plays, the host turns to
//            the lens) · 8.03 V.O. 4 over the lineup · 8.04 his calendar: his fingertip drags his block onto MON 13
//            (Elgoog already on TUE 14), it snaps in · 8.05 the lit square in his eyes, V.O. 5 · 8.06 the phone face up
//            rings (ELPPA: no face, no name), he taps Answer; his one sentence of terms on his face (lip-synced); …,
//            CONFIRMED
//   AFTER    8.07 the invite drops under the Monday square, his fingertip on Accept; the Monday square lit, the June
//            invite under it; its glow swells (the match into 9.01's work light, the same place in frame)
// No cursor anywhere: the monitor is touched (his fingertip), as the phone is (P6). V.O. typed by the host; his lips
// still under it (the back of his head in 8.03; rest on his portrait in 8.05).
import {defineScene, layouts, mouth, mk} from '../../kit';
import {otsDark, rulebookPainter, swipeECU, newsPainter, povDark, calendarPOV, masMCU, callECU} from '../sets/dark';
import {newsSitePainter} from '../../art/sets/darkroom2';
import {glide} from '../sets/common';

const L = layouts();
const on2 = (k: number) => k - (k & 1);

L.add('8.01', {
  st: 'act2/sets/dark otsDark ([OTS] Ep1 kits/mas-monitor drawMonitorOTS + Ep2\'s back of his head (act2 common backHead, the monitor\'s cyan rim), his water glass in the foreground, Ep1\'s framed GUEST lanyard on the wall); the art\'s RULEBOOK notification slides down on the pop; then [ECU] swipeECU: the notification close (the 400-page book, the SNOOZE button bolted to its spine, unpressed), his index and middle fingertips land and flick it off to the right, unopened',
  marks: {pop: ['snd', 'ui_toast_pop', 1, 0], swipe: ['snd', 'ui_swipe', 1, 0]},
  draw: (fb, k, sh, f) => {
    const pop = mk(sh, 'pop', 52), sw = mk(sh, 'swipe', 161), ecu = sw - 22;
    if (k < ecu) { otsDark(fb, f, rulebookPainter(k < pop ? -1 : on2(k - pop))); return; }
    // the fingers arrive (hover 4 f, then down), the flick on the swipe: the card goes right in held steps of 2
    const touch = k < ecu + 6 ? 0 : k < ecu + 10 ? 1 : k < sw + 8 ? 2 : k < sw + 12 ? 1 : 0;
    const off = k < sw ? 0 : Math.min(460, on2(k - sw + 2) * 22);
    swipeECU(fb, k, {touch: touch as 0 | 1 | 2, off});
  },
});
L.add('8.02', {
  st: 'act2/sets/dark povDark + newsPainter ([POV] Ep1 kits/mas-monitor drawMonitorPOV; the art\'s generic news site (no outlet name, logo or trade dress): one whole-pixel scroll of four steps from his feed up to the headline …TAKES AIM AT MAS, TASYA AND RADNUS… in its own UI over the segment\'s still; the still plays (its bar runs); the unplated host turns from the cardboard lineup to the lens)',
  marks: {scroll: ['snd', 'mouse_scroll', 1, 0]},
  draw: (fb, k, sh, f) => { const s0 = mk(sh, 'scroll', 2); povDark(fb, f, newsPainter(k - s0, k >= 62 ? 1 : 0)); },
});
L.add('8.03', {
  st: 'act2/sets/dark otsDark ([OTS] Mas at the monitor, the lineup on it: the host to the lens, the still playing); V.O. 4 typed by the host (the back of his head: no mouth)',
  draw: (fb, k, sh, f) => { otsDark(fb, f, newsPainter(124 + k, 1)); void sh; },
});
L.add('8.04', {
  st: 'act2/sets/dark calendarPOV ([POV] the art\'s calendar on Ep1\'s monitor: the week of MAY 13, ELGOOG · DEVELOPER KEYNOTE already on TUE 14; his fingertip lands on his own block NOPEAI · SPRING UPDATE (on WED 15) and drags it, held steps, onto MON 13; it snaps in on the drop; the rail MAY 10 in the band)',
  marks: {snap: ['snd', 'ui_drop_snap', 1, 0]},
  draw: (fb, k, sh, f) => {
    const snap = mk(sh, 'snap', 96), t0 = snap - 36;
    const drag = k < t0 ? 0 : k >= snap ? 1 : glide(k, t0, snap - 2, 0, 100, 3, true) / 100;
    const finger = k >= t0 - 8 && k < snap + 8 ? 'block' : null;
    calendarPOV(fb, f, {drag: k >= snap ? 1 : Math.min(0.97, drag), invite: 0, finger, press: k >= t0 && k < snap + 2});
  },
});
L.add('8.05', {
  st: 'act2/sets/dark masMCU ([MCU] Ep1\'s approved portrait in the monitor\'s light (the plate soft behind him), looking at the monitor (camera-left); the lit Monday square in his eyes (a tiny bright rectangle in each) and its light a rung up on the near planes of his face); V.O. 5 typed by the host over his still face',
  draw: (fb, k, sh, f) => { masMCU(fb, f, {mas: {look: -1, mouth: 'rest'}, monday: true}); void k; void sh; },
});
L.add('8.06', {
  st: 'act2/sets/dark callECU → masMCU → callECU ([ECU] his phone face up on the desk, ringing: the call tile ELPPA, a plain grey disc and the word, no face and no name; his fingertip taps Answer on the connect; [MCU] his face over the phone (Ep1\'s portrait, lids lowered to it), his one sentence of terms, unhurried, lip-synced; [ECU] the tile: …, then CONFIRMED on the chip note)',
  face: {MAS: 'lip'},
  marks: {conn: ['snd', 'call_connect', 1, 0], chip: ['snd', 'ui_confirm_chip', 1, 0], said: ['end', 'e2-a2-0001', 0]},
  draw: (fb, k, sh, f) => {
    const conn = mk(sh, 'conn', 48), chip = mk(sh, 'chip', 214), said = mk(sh, 'said', 184);
    if (k < conn + 8) { callECU(fb, f, {state: k < conn + 2 ? 'ring' : 'live', tap: k < conn - 8 ? 0 : k < conn - 2 ? 1 : k < conn + 4 ? 2 : 0, secs: 0}); return; }
    if (k < said + 4) { const m = mouth(sh, k, 'MAS'); masMCU(fb, f, {mas: {look: -1, lid: 1, mouth: m === 'smile' ? 'rest' : m}}); return; } // level, no smile in it
    callECU(fb, f, {state: k < chip ? 'dots' : 'confirmed'});
  },
});
L.add('8.07', {
  st: 'act2/sets/dark calendarPOV ([POV] the invite ELPPA · KEYNOTE · JUN 10 drops in under the Monday square; his fingertip on Accept on the click; accepted; the Monday square lit, the June invite under it; its glow swells in three held steps over the last second (the match into 9.01\'s work light, the same place in frame))',
  marks: {drop: ['snd', 'invite_drop', 1, 0], click: ['snd', 'post_click', 1, 0]},
  draw: (fb, k, sh, f) => {
    const drop = mk(sh, 'drop', 16), click = mk(sh, 'click', 64), len = sh.e - sh.s;
    const invite = k < drop ? 0 : k < drop + 3 ? 1 : k < click ? 2 : 3;
    const finger = k >= click - 10 && k < click + 6 ? 'accept' : null;
    const g = k < len - 30 ? 0 : k < len - 20 ? 1 : k < len - 10 ? 2 : 3;
    calendarPOV(fb, f, {drag: 1, invite, finger, press: k >= click - 1 && k < click + 4, glow: g});
  },
});
void newsSitePainter;
export const SCENE = defineScene({scene: '8', layouts: L.all});
