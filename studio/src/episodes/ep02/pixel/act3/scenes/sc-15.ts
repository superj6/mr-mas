// MR. MAS — Ep2 v1 · act3 · scene 15: WHERE U AT? (MAY 17, 2024; Alyi's office in the evening; F2.2 in T4 glossy; a
// stairwell). 19 shots, 2,400 f on the v1 EL lock. The shots pass, 2026-10-09; the record is shots-act3.md. The staging
// is proposal.md sc 15 (round 2: the pin has a cause; one second of Ep1's own audio; F2.2 gives Alyi his acts and his
// voice; final check: the turn is the Publish click crosscut with the flame, the papers never start near Alyi, the
// office is evening) / script-v1:
//   ARRIVE   15.01 the empty office as the carried hum stops: a desk with no chair, the wheel marks; the door he pivoted
//            turns shut on its pin behind him; Mas on the desk's edge · 15.02 his phone: the thread, two dates, three
//            hearts · 15.03 his face; far off, Alyi's voice from launch night; V.O. 7, the count
//   DOOR IN  15.04 his thumb past every modern icon to a tiny old one: TPOOL; its splash WHERE U AT?; welcome back, mas;
//            the 2008 hourglass; the Orb scans it: verified: 2008 · 15.05 he types the app's own question; the map:
//            every pin LAST SEEN: 2012 but one, ALYI CHECKED IN · DEC 2022 · "feel the agi"; its ripple warms and breaks
//            into string lights
//   F2.2     WANT 15.06 the party, the chant from his voice to everyone's · 15.07 a word with Mas under it · 15.08 his
//            check-in held up to Mas; Mas raises his glass · 15.09 the racks' lights become token streams (GLYPH, 12
//            frames, on the room, never in his eyes) · OBSTACLE 15.10-15.11 this office, 2023, night: the post's hard
//            sentence; "Nobody knows how to do this yet." "Someone should." · TURN (a crosscut, no order claimed)
//            15.12 his finger over Publish · 15.13 the offsite, the flame in his hand, his flame to the effigy · 15.14 he
//            presses it · 15.15 the effigy catches · OUT 15.16 the glow shrinks to one point of light
//   AFTER    15.17 the point is the pin; his thumb covers it; V.O. 8 · 15.18 he goes through the open door; it shuts
//            on the empty room ·
//            15.19 the stairs; the buzz: a reporter's request for comment, its thumbnail a strip of receipt paper
// Nothing here is a reason for Alyi's vote or his leaving (W8). No V.O. inside the memory.
import {defineScene, layouts, mouth, roomMouth, mk} from '../../kit';
import {Buf} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {glyphLayer} from '../../../../../shared/pixel/glyph';
import {drawOrb as drawOrbSmall} from '../../../../../shared/pixel/cast/orb';
import {orbBob} from '../../../../../shared/pixel/cast/orb-medium';
import {roomWalkAt} from '../../../../../shared/pixel/cast/civic-kit';
import type {Mas2Legs} from '../../art/cast/mas2';
import {officeWide, phoneInHand, threadScreen, tpoolScreen, orbScan, masEvening, stairs, pushECU, typeECU, PH, PIN, ICON_SCROLL, ICON_AT} from '../sets/office';
import {partyWide, chantMedium, partyTwoShot, checkIn, streamSource, streamsMaskAt, office2023, publish, offsiteWide, offsiteMedium, toPoint} from '../sets/f22';

const L = layouts();
const walk = (k: number) => roomWalkAt(k) as Mas2Legs;
const SEAT_X = 262;
const orbAt = (b: Buf, f: number, x: number, y: number) => drawOrbSmall(b, x, y + orbBob(f), 5, {look: [-0.6, 0.3], aperture: 0.5});

L.add('15.01', {
  st: 'act3/sets/office officeWide ([W] the empty office in the evening (art/sets/alyioffice: a desk with no chair, four wheel marks in the carpet where it stood, the window\'s dusk): the door he pivoted in 14.12, the same door from inside on its centre pin, turns shut behind him in held steps; Mas on the desk\'s edge (Ep1\'s seated rig), his phone; the Orb at his shoulder; the carried hum stops)',
  draw: (fb, k, sh, f) => {
    const door = (k < 4 ? 3 : k < 8 ? 2 : k < 12 ? 1 : 0) as 0 | 1 | 2 | 3;
    officeWide(fb, f, {door, mas: {seated: true}});
    orbAt(fb, f, SEAT_X + 26, 92);
    void sh;
  },
});
L.add('15.02', {
  st: 'act3/sets/office phoneInHand + threadScreen ([ECU] his phone in his hand in the evening (the wrap grip, his thumb on its edge): the thread, Alyi\'s regret post from last November with three hearts under it, his, and below it Alyi\'s post from three days ago, both collapsed to their dates and first lines (NOV 20, 2023 · ♥ ♥ ♥ · MAY 14, 2024); his thumb scrolls it a step)',
  marks: {sc: ['snd', 'thumb_scroll', 1, 0]},
  draw: (fb, k, sh, f) => {
    const sc = mk(sh, 'sc', 6);
    const scroll = k < sc ? 0 : Math.min(18, Math.floor((k - sc) / 2) * 3);
    phoneInHand(fb, f, (scr) => threadScreen(scr, scroll), {thumb: k < sc ? 0 : Math.min(1, (k - sc) / 8)});
  },
});
L.add('15.03', {
  st: 'act3/sets/office masEvening ([MCU] Mas on the desk\'s edge in the evening: his approved portrait, the window\'s warm dusk keyed one step on his face, the office soft behind him; his eyes down at the phone, then up and away (the window) as, far off, Alyi\'s voice from launch night says it (Ep1\'s take); then he counts: V.O. 7 typed by the host, his lips still)',
  marks: {up: ['end', 'e2-a3-0008', 6]},
  draw: (fb, k, sh, f) => {
    const up = mk(sh, 'up', 70);
    masEvening(fb, f, {lid: k < up ? 1 : 0, look: k < up ? 0 : -1});
  },
});
L.add('15.04', {
  st: 'act3/sets/office phoneInHand + tpoolScreen → orbScan ([ECU] his thumb scrolls past every modern icon to a tiny old one at the end of his home screen, TPOOL · 2012, and taps it; its splash in its own 2008 colours (EARLY-WEB16 inside the 2024 phone): WHERE U AT?; it still knows him: welcome back, mas; a 2008 hourglass spinning; the Orb comes in beside the phone and scans it (its fan, held steps) and settles: its toast verified: 2008 (toast 2 of 3))',
  marks: {spl: ['snd', 'app_splash_2006', 1, 0], hg: ['snd', 'hourglass_cursor_2008', 1, 0], scan: ['snd', 'orb_scan_sweep', 1, 0], toast: ['snd', 'ui_toast_pop', 1, 0]},
  draw: (fb, k, sh, f) => {
    const spl = mk(sh, 'spl', 33), hg = mk(sh, 'hg', 76), scan = mk(sh, 'scan', 100), t0 = mk(sh, 'toast', 120);
    const welcome = hg - 4;
    const screen = k < spl ? 'icon' : k < welcome ? 'splash' : 'welcome';
    const scroll = Math.min(ICON_SCROLL, Math.floor(Math.max(0, k - 2) / 2) * 13);
    const tapping = k >= spl - 8 && k < spl;
    phoneInHand(fb, f, (scr) => tpoolScreen(scr, screen, {f, scroll, tap: k >= spl - 5 && k < spl ? 1 : -1}), {thumb: k < 18 ? ((k >> 2) % 2) * 0.4 : 0.2, tip: tapping ? [PH.x + ICON_AT[0], PH.y + ICON_AT[1] + 4] : undefined});
    if (k >= scan - 12) orbScan(fb, f, {scan: k >= scan && k < t0 ? Math.floor((k - scan) / 3) + 1 : 0, toast: k >= t0 ? k - t0 : -1});
  },
});
L.add('15.05', {
  st: 'act3/sets/office typeECU → phoneInHand + tpoolScreen map ([ECU] the phone held from below, TPOOL\'s field and the phone\'s keyboard: his thumb types the app\'s own question, where u at?, posed on each key (common cupThumb), the key\'s preview above it; the map loads in its 2008 colours: every pin LAST SEEN: 2012 but one: ALYI CHECKED IN · DEC 2022 · "feel the agi" (its card); its ripple turns warm and breaks into string lights that spread past the phone over the frame (the door into F2.2))',
  marks: {ping: ['snd', 'pin_ping', 1, 0]},
  draw: (fb, k, sh, f) => {
    const ping = mk(sh, 'ping', 72), go = 50, brk = 144;
    if (k < go) { typeECU(fb, f, {typed: k < 9 ? 0 : Math.min(11, Math.floor((k - 9) * 11 / 33) + 1)}); return; }
    const kk = k - ping;
    phoneInHand(fb, f, (scr) => tpoolScreen(scr, 'map', {k: Math.max(0, kk), f, warm: k >= brk - 20 ? 1 : 0, label: k >= ping && k < brk + 4}), {});
    if (k < 57) for (let y = 0; y < 203; y++) for (let x = PH.x; x < PH.x + PH.w; x++) if (y >= PH.y + 38) fb.set(x, y, stepColor(fb.get(x, y), -(57 - k) > 3 ? -3 : -1));
    if (k >= brk) {
      // the ripple breaks into string lights: each ring a string, its wire sagging between the bulbs hung from it (the
      // party's swags in a ring), spreading from the pin outward, the room going dark round them (the review: loose
      // bulbs on bare rings read as confetti)
      const j = k - brk, cx = PH.x + PIN.x, cy = PH.y + PIN.y;
      for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) fb.set(x, y, stepColor(fb.get(x, y), -Math.min(4, 1 + Math.floor(j / 6))));
      const BUL = [PAL.W7, PAL.R3, PAL.L3, PAL.C7];
      const at = (t: number, r: number): [number, number] => [cx + Math.cos(t) * r, cy + Math.sin(t) * r * 0.8];
      for (let q = 0; q < 1 + Math.floor(j / 5); q++) {
        const r = 10 + q * 26 + (j % 5) * 3, n = Math.max(6, Math.round(r / 9));
        for (let a = 0; a < n; a++) {
          const t0 = (a / n) * Math.PI * 2 + q * 0.3, t1 = ((a + 1) / n) * Math.PI * 2 + q * 0.3;
          const [x0, y0] = at(t0, r), [x1, y1] = at(t1, r);
          // the wire between two bulbs, sagging down a few pixels (gravity, not outward)
          const sag = 2 + r / 30;
          const m = Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 1.5) + 2;
          for (let i = 0; i <= m; i++) { const u = i / m, x = Math.round(x0 + (x1 - x0) * u), y = Math.round(y0 + (y1 - y0) * u + Math.sin(u * Math.PI) * sag); if (y >= 0 && y < 203) fb.set(x, y, PAL.N4); }
          const x = Math.round(x0), y = Math.round(y0);
          const c = BUL[(a + q + Math.floor(f / 10)) % 4];
          if (y - 1 >= 0 && y + 3 < 203) { fb.set(x, y, PAL.N5); fb.set(x, y + 1, c); fb.set(x + 1, y + 1, c); fb.set(x, y + 2, stepColor(c, -1)); fb.set(x + 1, y + 2, stepColor(c, -1)); fb.set(x - 1, y + 1, stepColor(c, -3)); fb.set(x + 2, y + 2, stepColor(c, -3)); fb.set(x, y + 3, stepColor(c, -3)); }
        }
      }
    }
  },
});
// ------------------------------------------------------------------ F2.2
L.add('15.06', {
  st: 'act3/sets/f22 partyWide → chantMedium → partyWide ([W] the holiday party, Dec 2022, in T4 glossy (art/sets/f22 party22: silhouettes under palette-cycled string lights on a slow chase, never a strobe; the racks in the corner; bloom); ALYI lit and laughing in the crowd; [M] closer: Alyi under a low swag of lights (it crops the top of his frame), laughing, his hand up (his arm bent at the elbow), leading the chant: "FEEL THE AGI!" (lip-synced, warm: his own eyes crinkled); [W] the chant builds to everyone\'s: the crowd\'s hands go up a few at a time and bob on the beat until every hand is up; rail DEC 2022)',
  face: {ALYI: 'lip'},
  marks: {ch: ['on', 'e2-a3-0009', 0], all: ['on', 'e2-a3-0010', 0]},
  draw: (fb, k, sh, f) => {
    const ch = mk(sh, 'ch', 43), all = mk(sh, 'all', 83);
    if (k < ch - 5) { partyWide(fb, f, {chant: k < 20 ? 0 : 1}); return; }
    if (k < all + 2) { chantMedium(fb, f, {mouth: mouth(sh, k, 'ALYI'), mood: 'laugh', arm: 'raise'}); return; }
    // the chant goes from his voice to everyone's: the crowd's hands go up a few at a time in held steps (6 frames)
    // from the crowd's line, bobbing on the beat, until every hand is up
    partyWide(fb, f, {chant: k < all + 10 ? 2 : 3, hands: Math.min(1, 0.25 + Math.floor((k - all) / 6) * 0.15)});
  },
});
L.add('15.07', {
  st: 'act3/sets/f22 partyTwoShot ([2S] across the crowd: Alyi close at the right under the swag of lights (it crops his frame), his raised hand finding Mas, then talking to him (Ep1\'s Alyi in Ep2\'s warm states: smiling, then laughing; lip-synced); Mas small in the crowd at the left, every hand up round him, the only one not chanting, his glass in his hand, his room-scale mouth on "someone has to hold the glass.")',
  face: {ALYI: 'lip', MAS: 'room'},
  marks: {last: ['on', 'e2-a3-0013', 0]},
  draw: (fb, k, sh, f) => {
    const last = mk(sh, 'last', 118);
    partyTwoShot(fb, f, {alyi: {mouth: mouth(sh, k, 'ALYI'), mood: k >= last - 2 ? 'laugh' : 'smile', arm: k < 20 ? 'raise' : 'none'}, mas: {mouth: roomMouth(sh, k, 'MAS') === 'open' ? 'open' : k > last ? 'smile' : 'rest', arm: 'glass'}});
  },
});
L.add('15.08', {
  st: 'act3/sets/f22 checkIn → partyTwoShot ([ECU] his phone held up in his warm hand (art/sets/f22 checkInECU), Mas\'s old app open on it: CHECK IN, then he types feel the agi; the blip; [2S] he turns the screen to Mas, grinning (his phone arm), and Mas raises his glass back)',
  marks: {blip: ['snd', 'check_in_blip', 1, 0]},
  draw: (fb, k, sh, f) => {
    const blip = mk(sh, 'blip', 45);
    if (k < 104) { checkIn(fb, f, k < blip + 6 ? 0 : Math.min(12, Math.floor((k - blip - 6) / 2))); return; }
    partyTwoShot(fb, f, {alyi: {mouth: 'rest', mood: 'laugh', arm: 'phone'}, mas: {mouth: 'smile', arm: k >= 116 ? 'glassUp' : 'glass'}});
  },
});
L.add('15.09', {
  st: 'act3/sets/f22 partyWide + GLYPH ([W] the party, every hand up; the racks in the corner hum along; at the chant\'s peak, for 12 frames, their status lights become token streams that run out of the racks and across the whole room (a GLYPH layer: real glyph tokens drawn by the Remotion host in rows, dense at each stream\'s head), the rows skipping his face: on the room, never in his eyes)',
  glyph: true,
  marks: {sh: ['snd', 'glyph_shimmer', 1, 0]},
  draw: (fb, k, sh, f) => {
    const g = mk(sh, 'sh', 19);
    partyWide(fb, f, {chant: 3, hands: 1});
    // (the rows' mask leaves the crowd's raised hands out, so the streams pass behind them)
    if (k >= g && k < g + 12) return {layers: [glyphLayer(streamSource(fb, k - g), {tint: PAL.C6, tintAmt: 0.5, seed: 1509, bg: PAL.N0, shimmer: 0.3, cell: [2, 3]}, streamsMaskAt(f), k)]};
  },
});
L.add('15.10', {
  st: 'act3/sets/f22 office2023 ([2S] this office, 2023, night (art/sets/alyioffice screen2023, under the flashback\'s glossy bloom): his screen close at frame left, its bezel cropping his near shoulder; the post in its own UI, INTRODUCING SUPERALIGNMENT · ALYI, EKIEL, and its hard sentence, held to its read time; Ekiel beside him squinting at it; rail 2023)',
  draw: (fb, k, sh, f) => { office2023(fb, f, {ekielLid: (k >= 64 && k < 68) || (k >= 158 && k < 162) ? 2 : 0, alyiRead: Math.floor(k / 40) % 2}); void sh; },
});
L.add('15.11', {
  st: 'act3/sets/f22 office2023 ([2S] the same: Ekiel says it plainly, "Nobody knows how to do this yet." (lip-synced); Alyi answers without looking away from the screen, "Someone should." (lip-synced))',
  face: {EKIEL: 'lip', ALYI: 'lip'},
  draw: (fb, k, sh, f) => {
    office2023(fb, f, {ekielMouth: mouth(sh, k, 'EKIEL'), alyiMouth: mouth(sh, k, 'ALYI')});
  },
});
L.add('15.12', {
  st: 'act3/sets/f22 publish ([ECU] his finger above the bare Publish button (art/sets/alyioffice publishECU: a real pointing hand, his sleeve; no hover, no cursor), as Mas\'s was in sc 4)',
  draw: (fb, k, sh, f) => { publish(fb, f, {press: false}); void k; void sh; },
});
L.add('15.13', {
  st: 'act3/sets/f22 offsiteWide → offsiteMedium → offsiteWide ([W] a leadership offsite at night (art/sets/f22 offsite, restaged): the trees, the staff in silhouette beyond, the wooden effigy, a paperclip robot of our own design stencilled UNALIGNED, standing just outside the lodge\'s doorway; ALYI in the doorway, half cut off by its jamb, the long match struck; [M] closer: Alyi in the doorway, the jamb cutting off his near half, the match\'s flame lighting his face, lit and calm (no zealot framing, no religious iconography); [W] one held drawing: his own hand puts the match\'s flame to the effigy\'s lower body, the flame\'s light on the wood and on his face)',
  marks: {lit: ['snd', 'torch_light', 1, 0]},
  draw: (fb, k, sh, f) => {
    const lit = mk(sh, 'lit', 25);
    if (k < lit + 26) { offsiteWide(fb, f, {fire: 0, alyi: k < lit ? 'stand' : 'torch'}); return; }
    if (k < 90) { offsiteMedium(fb, f); return; }
    // the touch, held to the cut (and on into 15.15 until the whoomph): the flame at the wood is his act, shown before
    // the Publish click, so the click never reads as what lit it
    offsiteWide(fb, f, {fire: 0, alyi: 'touch'});
  },
});
L.add('15.14', {
  st: 'act3/sets/f22 publish ([ECU] he presses it: his fingertip on the bare Publish, the button a rung down)',
  marks: {cl: ['snd', 'post_click', 1, 0]},
  draw: (fb, k, sh, f) => { const cl = mk(sh, 'cl', 9); publish(fb, f, {press: k >= cl - 1}); },
});
L.add('15.15', {
  st: 'act3/sets/f22 offsiteWide ([W] his match still at the effigy\'s lower body (the held drawing), then it catches: the fire, palette-cycled (the shape holds, the colours walk; never a strobe), its light on everything; Alyi in the doorway, the match lowered)',
  marks: {wh: ['snd', 'flame_whoomph', 1, 0]},
  draw: (fb, k, sh, f) => { const wh = mk(sh, 'wh', 6); offsiteWide(fb, f, {fire: k < wh ? 0 : k < wh + 8 ? 1 : 2, alyi: k < wh + 4 ? 'touch' : 'lowered'}); },
});
L.add('15.16', {
  st: 'act3/sets/f22 toPoint ([W → ECU] the fire\'s glow shrinks in held steps to one point of light at the frame\'s centre (where the next shot\'s pin pulses))',
  draw: (fb, k, sh, f) => { toPoint(fb, f, Math.floor(k / 8)); void sh; },
});
L.add('15.17', {
  st: 'act3/sets/office phoneInHand + tpoolScreen map ([ECU] the point of light is the pin, pulsing on his phone (the same frame point); his thumb comes in and covers it; V.O. 8 typed by the host; no IOU in the shot, no hand near his pocket)',
  marks: {vo: ['on', 'e2-vo-08', 0]},
  draw: (fb, k, sh, f) => {
    const cover = 26;
    const paint = (scr: Buf) => tpoolScreen(scr, 'map', {k: k + 200, f, warm: 1, label: false});
    // his thumb leaves the foot of the glass and covers the pin (the same hand: the thumb goes up the screen)
    const t = k < cover ? 0 : Math.min(1, (k - cover) / 10);
    const pin: [number, number] = [PH.x + PIN.x + 1, PH.y + PIN.y - 2], rest: [number, number] = [PH.x + PH.w - 18, 196];
    phoneInHand(fb, f, paint, {tip: [Math.round(rest[0] + (pin[0] - rest[0]) * t), Math.round(rest[1] + (pin[1] - rest[1]) * t)]});
    void sh;
  },
});
L.add('15.18', {
  st: 'act3/sets/office officeWide ([W] he pockets the phone, gets up off the desk\'s edge and walks out (his walk), the Orb with him; his hand pushes the door on its pin as he reaches it; it holds open until he has gone through it, then turns shut on the empty office on its sound; the room holds a second and more: the desk with no chair, the caster dents)',
  marks: {cl: ['snd', 'door_close_soft', 1, 0]},
  draw: (fb, k, sh, f) => {
    // he stands where his feet were (x 280) and walks to the doorway (gone at x 430); the door is edge-on (3) before he
    // reaches it and stays open until he is through, then turns shut in held steps, landing shut on the sound (the
    // review: it shut in front of him and he walked through the closed door)
    const cl = mk(sh, 'cl', 70), up = 6, X0 = 280, V = 3.4;
    // (his near hand pushes the door on its pin as he reaches it, as in 14.12; it is edge-on as he steps into it)
    const gone = up + Math.ceil((430 - X0) / V), kOpen = up + Math.ceil((383 - X0) / V);
    const door = (k < kOpen ? 0 : k < kOpen + 2 ? 1 : k < kOpen + 4 ? 2 : k < Math.max(gone + 2, cl - 6) ? 3 : k < cl - 3 ? 2 : k < cl ? 1 : 0) as 0 | 1 | 2 | 3;
    const push = k >= kOpen - 3 && k < kOpen + 4;
    if (k < up) { officeWide(fb, f, {door, mas: {seated: true}}); orbAt(fb, f, SEAT_X + 26, 92); return; }
    const x = Math.round(X0 + (k - up) * V);
    const inRoom = x < 430;
    officeWide(fb, f, {door, mas: inRoom ? {x, legs: walk(k), arm: push ? 'reach' : 'pocket'} : null});
    if (inRoom) orbAt(fb, f, x + 22, 92);
  },
});
L.add('15.19', {
  st: 'act3/sets/office stairs → pushECU → stairs ([W] the stairwell (art/sets/alyioffice), Mas small on the stairs going down; his phone buzzes; [ECU] the push on his phone in his hand: request for comment, its thumbnail a strip of receipt paper (no outlet named, no headline words); [W] he reads it without stopping and keeps going down)',
  marks: {bz: ['snd', 'phone_buzz_step_1', 1, 0]},
  draw: (fb, k, sh, f) => {
    const bz = mk(sh, 'bz', 28), e1 = 36, e2 = 86;
    if (k < e1) { stairs(fb, f, {x: 150 + Math.round(k * 1.4), step: 0, legs: walk(k), phone: k >= bz + 2}); return; }
    if (k < e2) { pushECU(fb, f, {k: k - 38}); return; }
    stairs(fb, f, {x: 200 + Math.round((k - e2) * 1.4), step: 0, legs: walk(k), phone: k < e2 + 20});
  },
});

export const SCENE = defineScene({scene: '15', layouts: L.all});
