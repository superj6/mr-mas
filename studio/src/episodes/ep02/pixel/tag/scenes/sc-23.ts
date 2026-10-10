// MR. MAS — Ep2 v1 · tag · scene 23: THE OTHER COMPANY (AUG 5 → AUG 21, 2024; his dark room, night). 9 shots, 888 f on
// the v1 EL lock. The tag's picture pass, 2026-10-10; the record is shots-tag.md. The staging is proposal.md sc 23 /
// script-v1 sc 23 (a MONTAGE on his monitor: three dated beats running forward, then the hook):
//   ARRIVE   23.01 the room from behind him, the monitor's glow on, Ep1's framed GUEST lanyard on the wall: his back as
//            he sits at the desk (sc 22's match: his back walking away across the lot -> his back at the desk, in the
//            same place in frame), 1.5 s before the THUD; the refiled complaint drops from above onto the desk in front
//            of the monitor; over his shoulder, down: NOLE v. MANALT ET AL. · FEDERAL COURT, the (FOR NOW) note crossed
//            out (rail AUG 5)
//   ITEM 1   23.02 its pages under his hand: !! · ! · . ; he slides it aside so he can see the monitor
//   ITEM 2   23.03 RUMPT's post arrives whole in its own UI (his text never types), the rally photo under SIRRAH's plate,
//            SUMMER 2024 (rail AUG 11) · 23.04 THE ORB floats off his shoulder to the monitor; its TERMINAL view (2.E):
//            the crowd face by face, human · human · human · human, its log counting every face; back in his room its
//            toast, verified: human (all of them) (toast 3 of 3); it floats back; the egg on a bill in a background tab
//            · 23.05 the toast cleared, V.O. 14 typed by the host (the back of his head: no mouth)
//   ITEM 3   23.06 the Aug 21 interview in its own plain player (hands and tie only, the speaker muted), its lower third
//            whole: his real words (rail AUG 21) · 23.07 the player's chrome clears, and the frame dissolves past the
//            monitor's bezel (the review's fixes): outside the broadcast, full frame, on THE PODIUM (still facing away)
//            the same hands pump up a balloon in CHATGTP's bubble shape and tie it on, and go
//   HOOK     23.08 (full frame) the string goes taut over the podium's lip, the balloon pulled down behind it, as if
//            someone on the far side had just taken hold of it; a beat later, one more tug
//   AFTER    23.09 Mas at his monitor, its glow on his still face, his eyes narrowing one step; the cut to black on
//            the downbeat (the lock's end)
// No V.O. on the suit or over the candidate's words (W8); no cursor (P6); nothing about the balloon is said.
import {defineScene, layouts, mk} from '../../kit';
import {Buf, bayer, clamp} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {drawMonitorPOV, MON_POV} from '../../../../../shared/pixel/kits/mas-monitor';
import {pt, pw, untracked} from '../../art/kit';
import {wideBack, coverOTS, pagesECU, otsDark, drawOrbOTS, terminalScan, SCAN_FACES, masMCU} from '../sets/dark';
import {feedPainter, broadcastPainter, podiumPainter} from '../sets/screen';
import type {PodiumSt, PodiumView} from '../sets/screen';
import {glide, held, RH} from '../sets/common';
import type {PxShot} from '../../types';

const L = layouts();

L.add('23.01', {
  st: 'tag/sets/dark wideBack ([W] the dark room from behind him (Ep1\'s plate as Act Two\'s OTS room), the monitor on the desk with its dim feed and its glow, Ep1\'s framed GUEST lanyard on the wall; his back (Act Two\'s turned-away bust, square away, the screen\'s rim on it) as he sits, in two held drawings, in the place sc 22 left it; the chair\'s back; THE ORB at his shoulder; the complaint dropping from above in held drawings onto the desk in front of the monitor: THUD, the room jolts two pixels, dust off the desk; he doesn\'t move) → coverOTS ([OTS] over his right shoulder, down onto the desk: NOLE v. MANALT ET AL. · FEDERAL COURT, the (FOR NOW) note stuck to it, crossed out; the rail AUG 5 on the arrival)',
  marks: {thud: ['snd', 'landing_thunk', 1, 0]},
  draw: (fb, k, sh, f) => {
    const thud = mk(sh, 'thud', 38), cut = thud + 8;
    if (k < cut) {
      const sit = k < 8 ? 0 : k < 14 ? 1 : 2;
      const drop = k < thud - 3 ? -1 : k < thud ? k - (thud - 3) : 3;
      const jolt = k === thud ? 2 : k === thud + 1 ? 1 : 0;
      const dust = k < thud ? 0 : k < thud + 3 ? 1 : k < thud + 6 ? 2 : 3;
      wideBack(fb, f, {sit: sit as 0 | 1 | 2, drop, jolt, dust});
      return;
    }
    coverOTS(fb, f, {settle: k < cut + 2 ? -1 : 0});
  },
});
L.add('23.02', {
  st: 'tag/sets/dark pagesECU ([ECU] top-down on the desk under the monitor\'s light: the cover, then its pages turned by his hand (art/cast/hands2, a pinch at the page\'s foot; the sheet lifts and curls over the top in held drawings), each page\'s last sentence ending in its punctuation drawn big: page 1 !!, page 2 !, page 3 . (the cold open\'s ECU grammar); then his flat hand slides the stack off to the left in held steps, and the desk is clear in the monitor\'s light; the camera tilts up in held steps to the monitor\'s foot and its lit screen, the feed 23.03 opens on)',
  marks: {t1: ['snd', 'page_turn', 1, 0], t2: ['snd', 'page_turn', 2, 0], t3: ['snd', 'page_turn', 3, 0]},
  draw: (fb, k, sh, f) => {
    const ts = [mk(sh, 't1', 6), mk(sh, 't2', 29), mk(sh, 't3', 51)];
    let page = 0, turn = 0, hand: 'lip' | 'rest' | 'push' | null = 'rest';
    for (let i = 0; i < 3; i++) {
      const t = ts[i];
      if (k >= t + 4) { page = i + 1; continue; }
      if (k >= t - 2) { page = i; turn = k < t ? 1 : k < t + 2 ? 2 : 3; hand = turn < 3 ? 'lip' : null; break; }
      page = i; break;
    }
    // after a turn his hand comes back to the page's foot (gone for a drawing, then resting)
    if (!turn && ts.some((t) => k >= t + 4 && k < t + 8)) hand = null;
    // the slide: his flat hand lands on the stack, then pushes it off to the left in held steps
    const s0 = ts[2] + 26, s1 = s0 + 18;
    let slide = 0;
    if (k >= s0 - 4) hand = 'push';
    if (k >= s0) slide = glide(k, s0, s1, 0, 480, 2);
    if (k >= s1) hand = null;
    // then the camera tilts up off the clear desk, in held steps, to the monitor's foot and its glowing screen (the
    // review: 0.45 s on a near-black desk before the cut; the tilt hands the cut to the POV its screen)
    const tilt = k >= s1 ? glide(k, s1, s1 + 8, 0, 112, 2) : 0;
    pagesECU(fb, f, {page, turn, hand, slide, tilt});
  },
});
L.add('23.03', {
  st: 'Ep1 kits/mas-monitor drawMonitorPOV + tag/sets/screen feedPainter ([POV] HTURT\'s plain feed (grey rows); on the pop RUMPT\'s post arrives WHOLE in one frame (a plain red square avatar, …and she \'A.I.\'d\' it…), its photo: a rally crowd under SIRRAH\'s plate, a SUMMER 2024 decal on its corner; a background tab: an egg on a bill (Ep3\'s); the rail AUG 11)',
  marks: {pop: ['snd', 'ui_toast_pop', 1, 0]},
  draw: (fb, k, sh, f) => { drawMonitorPOV(fb, f, feedPainter({post: k >= mk(sh, 'pop', 38), egg: true})); },
});
/** the Orb's float back to his shoulder (23.04's tail, 23.05's head): t from 1 to 0 in held steps of 3 */
const backT = (kk: number) => Math.max(0, 1 - held(Math.max(0, kk), 3) / 24);
L.add('23.04', {
  st: 'tag/sets/dark otsDark + drawOrbOTS ([2S] over his shoulder: THE ORB (Ep1 cast/orb-medium), perched on his right shoulder (over his shoulder line, nearer the lens), lifts off it on the servo and floats to the screen in held steps, its lens on the photo) → terminalScan ([TERMINAL] the 2.E pass: the Orb\'s point of view in Ep1\'s TERMINAL palette, the photo\'s crowd magnified in the machine\'s own pixels, a scan line down it, a bracket stepping face to face, human under each, its log counting every face in the photo) → otsDark ([2S] back in his room: the Orb at the screen closes its aperture; on the chime its toast verified: human (all of them) (kits/orb-toast); it floats back toward his shoulder)',
  marks: {servo: ['snd', 'orb_servo', 1, 0], sweep: ['snd', 'orb_scan_sweep', 1, 0], chime: ['snd', 'orb_chime_F', 1, 0]},
  draw: (fb, k, sh, f) => {
    const servo = mk(sh, 'servo', 7), sweep = mk(sh, 'sweep', 33), chime = mk(sh, 'chime', 100), out = chime - 4, back = chime + 46;
    const feed = feedPainter({post: true, egg: true});
    if (k < sweep) {
      const t = k < servo ? 0 : glide(k, servo, sweep - 6, 0, 100, 3) / 100;
      otsDark(fb, f, feed, {front: (b) => drawOrbOTS(b, f, {t, aperture: k >= sweep - 6 ? 0.95 : 0.5, scanning: k >= sweep - 3, still: k >= servo})});
      return;
    }
    if (k < out) {
      const kk = k - sweep, n = SCAN_FACES.picks.length, total = SCAN_FACES.total;
      const sweepRow = kk < 12 ? held(kk, 2) * 17 : null;
      const faces = kk < 12 ? 0 : Math.min(n, 1 + Math.floor((kk - 12) / 12));
      const fast = 12 + n * 12 - 6;
      const count = kk < 12 ? 0 : kk < fast ? faces : Math.min(total, n + Math.floor(((kk - fast) * (total - n)) / Math.max(1, out - sweep - fast - 2)));
      terminalScan(fb, f, {sweep: sweepRow, n: faces, count});
      return {noVo: true};
    }
    const t = k < back ? 1 : backT(k - back);
    otsDark(fb, f, feedPainter({post: true, egg: true, ticks: []}), {front: (b) => drawOrbOTS(b, f, {t, aperture: k < chime ? 0.6 : 0.3, toast: k >= chime && k < sh.e - sh.s - 6 ? k - chime : undefined, still: true})});
  },
});
/** a dark keyline round the host's typed V.O. (2 px, under the glyphs it will draw this frame: the same text, rate and
 *  place as frame.ts voLine for a one-row line), so the line reads clear of his shoulder's cyan rim (the review: the rim,
 *  the text's own cyan, sliced through "this") */
const VO_X = 12, VO_Y = 191;
const voKeyline = (fb: Buf, sh: PxShot, k: number) => {
  for (const l of sh.lines) {
    if (l.kind !== 'vo' || k < l.s || k >= l.e + 15) continue;
    const text = l.text.toLowerCase(), rate = Math.max(0.5, text.length / Math.max(1, l.e - l.s - 4)), n = clamp(Math.floor((k - l.s) * rate), 0, text.length);
    if (!n || pw(text) > 456) continue;
    const t = new Buf(480, 270, 0);
    untracked(() => pt(t, text.slice(0, n), VO_X, VO_Y, 1, {shadow: 1}));
    const out = new Uint8Array(480 * RH);
    for (let y = VO_Y - 3; y < Math.min(RH, VO_Y + 12); y++) for (let x = VO_X - 3; x < VO_X + pw(text) + 4; x++) {
      if (t.get(x, y)) continue;
      for (let dy = -2; dy <= 2 && !out[y * 480 + x]; dy++) for (let dx = -2; dx <= 2; dx++) if (Math.abs(dx) + Math.abs(dy) <= 2 && t.get(x + dx, y + dy)) { out[y * 480 + x] = 1; break; }
    }
    for (let i = 0; i < out.length; i++) if (out[i]) fb.c[i] = PAL.N0;
  }
};
L.add('23.05', {
  st: 'tag/sets/dark otsDark ([OTS] Mas at the monitor, the post and the photo on it, the toast cleared; THE ORB settling back onto his right shoulder; V.O. 14 typed by the host over the back of his head (no mouth), a dark keyline under it where it crosses his shoulder\'s rim)',
  draw: (fb, k, sh, f) => {
    const t = k < 3 ? 0.25 : k < 6 ? 0.125 : 0;
    otsDark(fb, f, feedPainter({post: true, egg: true}), {front: (b) => drawOrbOTS(b, f, {t, aperture: 0.5, look: [0.4, -0.55], still: k < 6})});
    voKeyline(fb, sh, k);
  },
});
L.add('23.06', {
  st: 'Ep1 kits/mas-monitor drawMonitorPOV + tag/sets/screen broadcastPainter ([POV] the Aug 21 interview in its own plain player (no network, no logo, the speaker muted): the suit from the chin down, the over-long red tie, his hands talking (art/cast/hands2, the sleeves foreshortened from below), no face, no voice; its lower third slides in whole: "…having me speak… It\'s a little bit dangerous out there." (his real words, the faithful crop), held for its read; the rail AUG 21)',
  marks: {lower: ['txt', '…having me speak', 'at', 0]},
  draw: (fb, k, sh, f) => {
    const l0 = mk(sh, 'lower', 33);
    drawMonitorPOV(fb, f, broadcastPainter({k, lower: k < l0 ? 0 : k < l0 + 2 ? 1 : 2}));
  },
});
/** THE PODIUM full frame, past the monitor's bezel (the review: inside the same bezel as the real broadcast, with his
 *  room's window beside it, the invented business could read as more footage on his screen; out of the screen it is
 *  the show's own allegory, its own space). The stage sits where the screen was, so nothing jumps in the dissolve; no
 *  screen texture (it is no longer a screen) */
const STAGE: PodiumView = {ox: MON_POV.x, oy: MON_POV.y, w: MON_POV.w, h: MON_POV.h};
const podiumFull = (st: PodiumSt, f: number) => { const t = new Buf(480, RH, PAL.N0); podiumPainter(st, STAGE)(t, f); return t; };
L.add('23.07', {
  st: 'drawMonitorPOV + tag/sets/screen broadcastPainter → podiumPainter FULL FRAME ([POV → its own space] the player\'s chrome clears in held steps (the lower third, the bar, the frame), then the whole frame dissolves (held dither) past the monitor\'s bezel to what is outside the broadcast: THE PODIUM on its dusk hill (the art\'s SET-08) filling the frame, still facing away; the same hands come up from below the frame with a hand pump and a limp balloon, each arm bent at an elbow inside the frame; a stroke on each pump, the balloon in CHATGTP\'s bubble shape (dot eyes, no words, no sticker) growing a size each time; both hands at the podium\'s near corner tie its string on the knot; they let go and sink out of frame; the balloon floats on its slack string, bobbing)',
  marks: {p1: ['snd', 'balloon_pump', 1, 0], p2: ['snd', 'balloon_pump', 2, 0], p3: ['snd', 'balloon_pump', 3, 0], knot: ['snd', 'knot_tie', 1, 0]},
  draw: (fb, k, sh, f) => {
    const p = [mk(sh, 'p1', 19), mk(sh, 'p2', 45), mk(sh, 'p3', 71)], knot = mk(sh, 'knot', 109);
    const pod = (): PodiumSt => {
      if (k < 16) return {phase: 'limp', lift: k < 13 ? 2 : k < 15 ? 1 : 0, f};
      if (k < p[2] + 12) {
        const n = p.filter((q) => k >= q).length;
        return n ? {phase: 'pump', size: n + 1, down: p.some((q) => k >= q && k < q + 4), f} : {phase: 'limp', f};
      }
      if (k < knot + 6) return {phase: 'tie', knot: k >= knot, f};
      return {phase: 'tied', knot: true, away: Math.min(3, Math.floor((k - knot - 6) / 3)), f};
    };
    if (k < 6) { drawMonitorPOV(fb, f, broadcastPainter({k: 200 + k, lower: 2, clear: k < 2 ? 1 : k < 4 ? 2 : 3})); return; }
    if (k < 14) {
      drawMonitorPOV(fb, f, broadcastPainter({k: 200 + k, lower: 2, clear: 3}));
      const t = podiumFull({phase: 'limp', lift: 2, f}, f), u = (held(k - 6, 2) + 2) / 10;
      for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) if (bayer(x, y) < u) fb.c[y * 480 + x] = t.c[y * 480 + x];
      return;
    }
    fb.c.set(podiumFull(pod(), f).c);
  },
});
L.add('23.08', {
  st: 'tag/sets/screen podiumPainter FULL FRAME ([its own space] the balloon bobbing on its slack string; on the snap the string goes TAUT from the knot up over the podium\'s lip, cresting it and gone down the far side, and the balloon is pulled down behind the podium (a jerk drawing, then settled): only its top and its dot eyes over the gold, the mics in front of it; a beat later one more tug takes it a step lower, the eyes\' tops just over the lip, as if someone on the far side had taken hold of it)',
  marks: {taut: ['snd', 'string_taut', 1, 0]},
  draw: (fb, k, sh, f) => {
    const t = mk(sh, 'taut', 7);
    fb.c.set(podiumFull(k < t ? {phase: 'tied', knot: true, away: 3, f} : {phase: 'taut', taut: k < t + 2 ? 1 : k < t + 15 ? 2 : 3, f}, f).c);
  },
});
L.add('23.09', {
  st: 'tag/sets/dark masMCU ([MCU] Mas at his monitor at night (Ep1\'s approved portrait toward the screen, the plate soft behind him), its glow on his still face, a face light one step (Ep1 kits/face-light-img); two-thirds of a second in his eyes narrow one step (the lid down) and hold: his reaction on the held chord, not a freeze frame; the cut to black on the downbeat is the lock\'s end)',
  draw: (fb, k, sh, f) => { masMCU(fb, f, {faceLight: 1, mas: {look: -1, mouth: 'rest', lid: k >= 16 ? 1 : 0}}); void sh; },
});

export const SCENE = defineScene({scene: '23', layouts: L.all});
