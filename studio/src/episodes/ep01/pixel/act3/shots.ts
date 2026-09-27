// MR. MAS — Ep1 v3 · ACT THREE, "verified: human" (sc 18–23): one layout per shot of the v3 lock (act3/data.ts,
// tools/lock.py on show/reel/ep01-v3/ep01-v3-act3.json). Written by the `v3-shots-act2-act3` pass on the `v3-art-b`
// pass's dark-room compositions and monitor painters (show/episodes/ep01/production/full-v3/art/art-b.md §1.6) over Act
// Four's dark-room plate. The whole act plays in the home room: a witness arrives (the Orb), the year arrives on the
// monitor, and Friday arrives on his phone. The record: show/episodes/ep01/production/full-v3/shots-act3.md.
// Continuity kept here: the Orb settles into the faded outline on the wall at "you can stay." and watches from there
// through sc 21; by DevDay (sc 22, a week on) it has drifted to his shoulder, Act Four's spot, the outline left empty.
// The one GLYPH use of the act: 18.04g, five frames of tokens inside the scan's cone (the layout returns the layer; the
// Remotion host draws the tokens, the Node render splices those frames).
import {defineSegment, layouts, mk, mouth, roomMouth, RH, shiftRoom} from '../kit';
import type {Viseme} from '../../../../shared/pixel/cast/talk';
import {rect, clamp} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {glyphLayer} from '../../../../shared/pixel/glyph';
import * as A3 from '../../../../shared/pixel/rooms/darkroom-act3';
import {DPLATE_LOOK} from '../../../../shared/pixel/rooms/darkroom-plate';
import * as MON from '../../../../shared/pixel/kits/mas-monitor';
import {tidderPainter, TIDDER_POST, TIDDER_EDIT} from '../../../../shared/pixel/kits/tidder';
import {eoPainter} from '../../../../shared/pixel/kits/eo-signing';
import {lighthousePainter, devdayPainter, coldOpenPainter} from '../../../../shared/pixel/kits/monitor-items';
import {drawPhoneHigh, phoneMini, ORB_CIRCLE_LOOKS} from '../../../../shared/pixel/kits/phone-high';
import {spoken, stepOf, heldLerp, drawGagCard} from '../act2/kit2';
import type {GagCard} from '../act2/kit2';
import {LOCK} from './data';

const L = layouts();
const talk = (v: Viseme, rest: Viseme = 'rest'): Viseme => (v === 'rest' ? rest : v);
/** the Orb's looks from its home on the wall (A3.ORB_HOME, right of the window): everything it watches is to its left,
 *  so the reads are the vertical steps (the monitor level, his face a little lower, the desk and the phone lower still) */
const HOME = {monitor: [-0.97, -0.08] as [number, number], face: [-0.86, 0.14] as [number, number], phone: [-0.72, 0.5] as [number, number], box: [-0.8, 0.3] as [number, number]};
const CARD_ORB: GagCard = {x: 470, y: 10, name: 'THE ORB', lines: ["IT'S SEEN THINGS.", 'MOSTLY IRISES.'], stat: ['SCANS: 1'], accent: PAL.C7, align: 'right'};
const BOX_X = A3.boxOrbAt(3);

// =================================================================== sc 18 · the Orb arrives
L.add('18.01', {
  st: 'ARRIVAL · rooms/darkroom-act3 drawDarkA3 (Act Four\'s dark plate: the desk, the rack\'s blinking LEDs, the monitor\'s cyan key, the glass, the two old marks; MAS at the desk (cast/mas-medium); the faded outline of a sphere on the wall, empty): held, then on the whir the drive slot slides out the COINWORLD box like a tray in four held steps, landing on the thunk; Mas turns to it',
  enter: {kind: 'dip', frames: 8},
  marks: {whir: ['snd', 'synth:slot_whir', 1, 0], land: ['snd', 'landing_thunk', 1, 0]},
  draw: (fb, k, sh, f) => {
    const w = mk(sh, 'whir', 59), land = mk(sh, 'land', 89);
    const pos = stepOf(k, [w, w + 9, w + 18, land - 3]) as 0 | 1 | 2 | 3 | 4;
    A3.drawDarkA3(fb, f, {orb: null, outline: true, box: pos ? {pos} : null, mas: {arm: 'rest', look: k >= w + 8 ? 1 : -1}});
  },
});
L.add('18.02', {
  st: 'rooms/darkroom-act3 drawLabelECU [ECU]: the box\'s label, legible (FROM: COINWORLD · PROOF YOU\'RE HUMAN / SHIP TO: MAS MANALT, CO-FOUNDER); his fingertips come to the lid in two held steps; the rack\'s LEDs blink beyond it',
  draw: (fb, k, sh, f) => {
    A3.drawLabelECU(fb, f, {hand: k < 22 ? 0 : k < 46 ? 1 : 2});
    // the rack's three LEDs beyond the box's edge keep their straight-eighths blink (the room's clock)
    const on = (Math.floor((f + 3) / 6) % 2) === 0;
    fb.set(40, 8, on ? PAL.C4 : PAL.N1); fb.set(52, 12, !on ? PAL.R3 : PAL.N1); fb.set(64, 8, on ? PAL.L2 : PAL.N1);
  },
});
L.add('18.03', {
  st: 'rooms/darkroom-act3 drawDarkA3: he lifts the lid (the flutter); the Orb (cast/orb-medium) rises out of the foam in three held steps on the three servo whirs, its lens finding him, then dilating on the fourth; THE ORB gag card over the rack, top right (it is live: no freeze)',
  marks: {s1: ['snd', 'orb_servo', 1, 0], s2: ['snd', 'orb_servo', 2, 0], s3: ['snd', 'orb_servo', 3, 0], s4: ['snd', 'orb_servo', 4, 0], card: ['txt', 'THE ORB', 'at', 0]},
  draw: (fb, k, sh, f) => {
    const rise = stepOf(k, [mk(sh, 's1', 7), mk(sh, 's2', 16), mk(sh, 's3', 26)]) as 0 | 1 | 2 | 3;
    const s4 = mk(sh, 's4', 40);
    A3.drawDarkA3(fb, f, {box: {pos: 4, open: k >= 1, rise}, orb: {at: 'box', look: rise < 3 ? [-0.2, -0.3] : [-0.95, -0.05], aperture: k >= s4 ? 0.8 : k >= s4 - 6 ? 0.55 : 0.3},
      outline: true, mas: {arm: 'rest', look: 1}});
    drawGagCard(fb, k - mk(sh, 'card', 52), CARD_ORB);
  },
});
L.add('18.04', {
  st: 'rooms/darkroom-act3 drawScanMCU [MCU]: Mas\'s portrait, the thin cyan cone fanning out across his face from the Orb off frame right (held steps); 18.04g: for five frames inside the cone only his face is tokens (GLYPH: the cone\'s Mask, the layer returned for the Remotion host); by frame 6 the cone is gone; 18.05: the toast pops beside the Orb, "verified: human" (on the chip click), and "thanks." (lip-sync) — merged',
  glyph: true,
  face: {MAS: 'lip'},
  marks: {g: ['beat', '18.04g', 0], toast: ['snd', 'dialog_ok_click--chip', 1, 0]},
  draw: (fb, k, sh, f) => {
    const g = mk(sh, 'g', 18), t = mk(sh, 'toast', 36);
    const mm = spoken(sh, k, 'MAS');
    const mas = {look: 1 as const, mouth: (mm === 'smile' ? 'rest' : mm) as 'rest'};
    if (k < g + 5) {
      const half = k < 2 ? 1 : k < 4 ? 2.5 : 4;
      const m = A3.drawScanMCU(fb, f, {mas, fan: {dir: 176, half}}); // aimed down onto his face (eyes to mouth), not the art demo's 184
      if (k >= g && m) return {layers: [glyphLayer(fb, {tint: PAL.C6, tintAmt: 0.45, seed: 18, bg: PAL.N0, shimmer: 0.1}, m, k)]};
      return;
    }
    A3.drawScanMCU(fb, f, {mas, toast: k >= t ? {s: 'verified: human', k: k - t} : null});
  },
});
L.add('18.06', {
  st: 'rooms/darkroom-act3 drawDarkA3: the Orb drifts from the box to the faded outline on the wall in whole-pixel held steps (2 f) and settles exactly into it (the outline now filled); "i made it for everyone else." (V.O.); "you can stay." (lip-sync); its aperture opens once on the chime; the hold on the two of them',
  face: {MAS: 'lip'},
  marks: {chime: ['snd', 'synth:chime', 1, 0], stay: ['on', 'e1-a3-18-03', 0]},
  draw: (fb, k, sh, f) => {
    const c = mk(sh, 'chime', 133);
    const home = k >= 76;
    const at: [number, number] = [heldLerp(k, 24, 76, BOX_X[0], A3.ORB_HOME.x), heldLerp(k, 24, 76, BOX_X[1], A3.ORB_HOME.y)];
    const mm = spoken(sh, k, 'MAS');
    A3.drawDarkA3(fb, f, {box: {pos: 4, open: true, rise: 3}, orb: {at: home ? 'home' : at, look: home ? HOME.face : [-0.9, 0.1], aperture: k >= c && k < c + 10 ? 0.75 : 0.5},
      outline: home ? 'filled' : true, mas: {arm: 'rest', look: 1, mouth: mm}});
  },
});

// =================================================================== sc 19 · the monitor
const LH = lighthousePainter({meter: false});
L.add('19.01', {
  st: 'rooms/darkroom-act3 drawDarkA3 (later: the box gone): the Orb at home, its iris flicking from him to the monitor (the lighthouse on it, small); Mas watching the monitor',
  draw: (fb, k, sh, f) => { A3.drawDarkA3(fb, f, {orb: {at: 'home', look: k < 12 ? HOME.face : HOME.monitor}, outline: 'filled', mas: {look: -1}, plate: {screen: LH}}); },
});
L.add('19.11', {
  st: 'kits/mas-monitor drawMonitorPOV + kits/monitor-items lighthousePainter [POV]: MISANTHROPIC\'s lighthouse (rooms/lighthouse, its own sign on the brick), MARIO on phone one, finger raised, mid-warning',
  draw: (fb, k, sh, f) => { MON.drawMonitorPOV(fb, f, LH); },
});
L.add('19.12', {
  st: 'rooms/darkroom-act3 drawOrbOTS [OTS]: from behind the Orb (its chrome back big, frame right), Mas lit cyan watching the lighthouse on the monitor past it; he says nothing',
  draw: (fb, k, sh, f) => { A3.drawOrbOTS(fb, f, {screen: LH, mas: {look: -1}}); },
});
L.add('19.13', {
  st: 'kits/monitor-items lighthousePainter [POV]: the second phone rings (the ring), Mario answers it still warning, the rent meter over the lighthouse lights and spins (NOZAMA · UP TO $4B); cut on its first tick (drip_clack)',
  marks: {ring: ['snd', 'synth:ring', 1, 0]},
  draw: (fb, k, sh, f) => {
    const r = mk(sh, 'ring', 4);
    MON.drawMonitorPOV(fb, f, lighthousePainter({ring2: k >= r && k < r + 24 ? k - r : null, answer: k >= r + 24, meter: k >= 7}));
  },
});

// =================================================================== sc 20 · the post, and the call
L.add('20.01', {
  st: 'kits/mas-monitor drawMonitorOTS + kits/tidder tidderPainter [OTS]: over his shoulder, the TIDDER reply box; he types, in source casing, on the keys',
  marks: {keys: ['snd', 'synth:keys', 1, 0]},
  draw: (fb, k, sh, f) => { const kk = mk(sh, 'keys', 12) + 2; MON.drawMonitorOTS(fb, f, tidderPainter({phase: 'typing', typed: Math.floor(clamp((k - kk) * 0.62, 0, TIDDER_POST.length))})); },
});
L.add('20.02', {
  st: 'rooms/darkroom-act3 drawDarkA3 (ledsOff, the plate\'s `still`): the rack\'s LEDs, which have blinked all episode, stop, all of them; the Orb doesn\'t move (no bob); the reply typed on the monitor',
  draw: (fb, k, sh, f) => {
    const stop = k >= 4;
    A3.drawDarkA3(fb, f, {orb: {at: 'home', look: HOME.face}, outline: 'filled', mas: {look: -1}, leds: stop ? 'off' : 'on', plate: {screen: tidderPainter({phase: 'typing', typed: 99}), still: stop ? sh.s + 4 : null}});
  },
});
L.add('20.03', {
  st: 'kits/tidder tidderPainter [POV]: he posts; the reply counter spins, a blur, climbing; the first reply legible, held',
  draw: (fb, k, sh, f) => { MON.drawMonitorPOV(fb, f, tidderPainter({phase: 'posted', count: 3 + Math.floor(k * k * 0.9), spin: true})); },
});
const countAt = (k: number, base: number, rate: number) => base + Math.floor(k * rate);
L.add('20.04', {
  st: 'rooms/darkroom-act3 drawDarkA3 + kits/phone-high phoneMini: the phone lights GERG on the desk; he thumbs it to speaker (his hand to the phone on the key tap) without looking away from the counter climbing on the monitor; "i\'m editing it." (lip-sync); then the Orb turns from the monitor and looks at him, one beat longer than it needs to',
  face: {MAS: 'lip'},
  marks: {tap: ['snd', 'key_tap_space', 1, 0], ans: ['end', 'e1-a3-20-03', 0]},
  draw: (fb, k, sh, f) => {
    const tap = mk(sh, 'tap', 13), ans = mk(sh, 'ans', 109);
    const look = k >= ans + 6 && k < ans + 70 ? HOME.face : HOME.monitor;
    A3.drawDarkA3(fb, f, {orb: {at: 'home', look}, outline: 'filled', mas: {arm: k >= tap - 6 && k < tap + 6 ? 'phone' : 'rest', look: -1, mouth: spoken(sh, k, 'MAS')},
      plate: {phone: 'up', phoneScreen: phoneMini('gerg'), screen: tidderPainter({phase: 'posted', count: countAt(k, 4120, 9)})}});
  },
});
L.add('20.05', {
  st: 'kits/tidder tidderPainter (edit, tight) [POV]: he clicks edit; framed tight on the middle, the comment rewrites itself letter by letter on the keyboard roll; held to read',
  marks: {roll: ['snd', 'keyboard_roll', 1, 0]},
  draw: (fb, k, sh, f) => { const r = mk(sh, 'roll', 10); MON.drawMonitorPOV(fb, f, tidderPainter({phase: 'edit', editK: Math.floor(clamp((k - r) * 1.5, 0, TIDDER_EDIT.length)), tight: true})); },
});
L.add('20.06', {
  st: 'rooms/darkroom-act3 drawDarkA3: back on the two-shot, the LEDs blinking again, the counter climbing faster on the monitor; the call on speaker (GERG); Mas looks down to the phone for "go to sleep, gerg." and the Orb looks at the phone; for the V.O. his eyes rest in the middle distance and the Orb looks at him; the hold',
  face: {MAS: 'lip'},
  marks: {sleep: ['on', 'e1-a3-20-08', 0], vo: ['on', 'v3-vo-15', 0]},
  draw: (fb, k, sh, f) => {
    const sl = mk(sh, 'sleep', 265), vo = mk(sh, 'vo', 341);
    const down = k >= sl - 4 && k < sl + 44;
    const orbLook = k < sl - 10 ? HOME.monitor : k < vo - 8 ? HOME.phone : HOME.face;
    A3.drawDarkA3(fb, f, {orb: {at: 'home', look: orbLook}, outline: 'filled', mas: {head: down ? 'down' : '34', look: k >= vo - 6 ? 0 : -1, mouth: spoken(sh, k, 'MAS')},
      plate: {phone: 'up', phoneScreen: phoneMini('gerg'), screen: tidderPainter({phase: 'posted', count: countAt(k, 6400, 23)})}});
  },
});

// =================================================================== sc 21 · the order, on the monitor
L.add('21.02', {
  st: 'kits/eo-signing eoPainter [POV]: NEDIB, pen raised, over an order off both ends of a very big desk (lip-sync); a cut-paper copy pops up behind the desk on the first pop (3 held steps), a second at the window on the second, each speaking (lip-sync); Neleh\'s paper egg in the corner; 21.03 merged: the real one turns to look at them, "When the hell did I say that?", and the stat row updates on the chip',
  face: {NEDIB: 'lip', DEEPFAKE: 'lip', 'DEEPFAKE-2': 'lip'},
  marks: {p1: ['snd', 'tower_pop', 1, 0], p2: ['snd', 'tower_pop', 2, 0], turn: ['beat', '21.03', 0], stat: ['snd', 'post_click--chip', 1, 0]},
  draw: (fb, k, sh, f) => {
    const p1 = mk(sh, 'p1', 187), p2 = mk(sh, 'p2', 251), turn = mk(sh, 'turn', 323), stat = mk(sh, 'stat', 392);
    const copies = stepOf(k, [p1, p2]) as 0 | 1 | 2;
    const pop = copies === 2 ? Math.floor((k - p2) / 3) : copies === 1 ? Math.floor((k - p1) / 3) : undefined;
    const cm = copies === 2 ? mouth(sh, k, 'DEEPFAKE-2') : mouth(sh, k, 'DEEPFAKE');
    MON.drawMonitorPOV(fb, f, eoPainter({copies, pop, pen: 'raised', mouth: talk(mouth(sh, k, 'NEDIB'), 'smile'), copyMouth: talk(cm, 'smile'), turn: k >= turn, stat: k >= stat ? 2 : null, egg: true}));
  },
});
L.add('21.04', {
  st: 'rooms/darkroom-act3 drawDarkA3 [2S·SCR] with a slow whole-pixel drift in (1 px / 12 f): Mas, the Orb at home, the three NEDIBs small on the monitor; Mas glances at the Orb, "which one\'s real?"; the iris flicks across the three on the three servos and settles; he answers, back to the monitor (lip-sync)',
  face: {MAS: 'lip'},
  marks: {ask: ['on', 'e1-a3-21-06', 0], o1: ['snd', 'orb_servo', 1, 0], o2: ['snd', 'orb_servo', 2, 0], o3: ['snd', 'orb_servo', 3, 0]},
  draw: (fb, k, sh, f) => {
    const ask = mk(sh, 'ask', 19), o = stepOf(k, [mk(sh, 'o1', 55), mk(sh, 'o2', 65), mk(sh, 'o3', 74)]);
    const looks: Array<[number, number]> = [k >= ask + 20 ? HOME.face : HOME.monitor, [-0.95, -0.28], [-0.9, 0.3], [-0.93, 0.02]];
    const glance = k >= ask - 4 && k < ask + 36;
    A3.drawDarkA3(fb, f, {orb: {at: 'home', look: looks[o]}, outline: 'filled', mas: {look: glance ? 1 : -1, mouth: spoken(sh, k, 'MAS')},
      plate: {screen: eoPainter({copies: 2, pen: 'raised', stat: 2})}});
    shiftRoom(fb, Math.min(10, Math.floor(k / 12)));
  },
});
L.add('21.05', {
  st: 'kits/eo-signing eoPainter [POV]: the real NEDIB signs, in ink (the signature\'s strokes on 3s from the paper whip); the deepfakes clap on the claps, and keep clapping',
  marks: {whip: ['snd', 'paper_whip', 1, 0], claps: ['snd', 'synth:claps', 1, 0]},
  draw: (fb, k, sh, f) => {
    const w = mk(sh, 'whip', 4);
    MON.drawMonitorPOV(fb, f, eoPainter({copies: 2, pen: 'sign', signK: clamp(Math.floor((k - w) / 3), 0, 5), clap: k >= mk(sh, 'claps', 19), stat: 2, egg: true}));
  },
});

// =================================================================== sc 22 · DevDay, on the monitor
L.add('22.01', {
  st: 'kits/monitor-items devdayPainter [POV]: his keynote on the monitor, the applause carried over the cut; the launch-night odometer clunks up through the stage floor in three held steps (the ratchet, the landing thunk) to 100,000,000 / WEEK; TASYA walks on from the right, laughing, arms open (he stops at the stage\'s right, clear of the must-read figure); Mas\'s room-scale mouth on his question, Tasya\'s laugh drawing on his take\'s syllables',
  face: {MAS: 'room', TASYA: 'room'},
  marks: {rat: ['snd', 'odometer_ratchet', 1, 0], land: ['snd', 'landing_thunk', 1, 0]},
  draw: (fb, k, sh, f) => {
    const r = mk(sh, 'rat', 19), land = mk(sh, 'land', 37);
    const rise = stepOf(k, [r, r + 8, land]) as 0 | 1 | 2 | 3;
    MON.drawMonitorPOV(fb, f, devdayPainter({rise, clunk: k >= land && k < land + 3, tasya: k < 58 ? null : clamp((k - 58) / 60, 0, 1) * 0.4, laugh: k < 118 || roomMouth(sh, k, 'TASYA') === 'open', mouth: roomMouth(sh, k, 'MAS')}));
  },
});
L.add('22.02', {
  st: 'kits/phone-high drawPhoneHigh [HIGH]: the desk from above, the phone lights (the chip) with How did the keynote go? and the strip [super] [enthusiastic] [thrilled]; his thumb comes in and hovers over the strip (the one hover in the episode) while the Orb\'s iris, at the frame\'s edge, steps to each word his V.O. weighs; the tap on super',
  marks: {chip: ['snd', 'post_click--chip', 1, 0], tap: ['snd', 'key_tap_soft_01', 1, 0], thr: ['w', 'v3-vo-16', 'thrilled', 0], ent: ['w', 'v3-vo-16', 'enthusiastic', 0]},
  draw: (fb, k, sh, f) => {
    const chip = mk(sh, 'chip', 4), tap = mk(sh, 'tap', 117), thr = mk(sh, 'thr', 31), ent = mk(sh, 'ent', 70);
    const orb: [number, number] = k >= tap - 2 ? [-0.86, 0.4] : k >= ent ? [-0.83, 0.5] : k >= thr ? [-0.79, 0.6] : [-0.84, 0.46];
    drawPhoneHigh(fb, f, {screen: k < chip ? 'dark' : 'prompt', thumb: k < 24 ? 'none' : k < tap ? 'hover' : 'tap', orb});
  },
});
L.add('22.03', {
  st: 'rooms/darkroom-act3 drawDarkA3: Mas and the Orb (now at his shoulder, Act Four\'s spot; the outline on the wall empty), the phone between them; "super." under his breath (lip-sync, his head down to the phone); the Orb\'s iris lingers on the phone and its aperture narrows a step; no toast comes; the hold',
  face: {MAS: 'lip'},
  draw: (fb, k, sh, f) => {
    A3.drawDarkA3(fb, f, {orb: {at: 'shoulder', look: DPLATE_LOOK.phone, aperture: k >= 44 ? 0.38 : 0.5}, outline: true, mas: {arm: 'phone', head: 'down', mouth: spoken(sh, k, 'MAS')},
      plate: {phone: 'up', phoneScreen: phoneMini('prompt'), screen: devdayPainter({rise: 3, tasya: 1})}});
  },
});

// =================================================================== sc 23 · catching up (THE CLOCK: one bar a shot)
L.add('23.01', {st: 'kits/monitor-items coldOpenPainter [POV] (art-a rooms/apec-stage, cropped 1:1): bar 1, the cold open\'s frame on the monitor; we\'ve caught up', draw: (fb, k, sh, f) => { MON.drawMonitorPOV(fb, f, coldOpenPainter()); }});
L.add('23.02', {
  st: 'kits/phone-high drawPhoneHigh (reminder) [HIGH]: bar 2, the invite he accepted on that stage is a reminder now, Board sync · Fri 12:00, the four circles; the Orb\'s iris steps along them, one a beat, and stops on the black square',
  marks: {chip: ['snd', 'post_click--chip', 1, 0]},
  draw: (fb, k, sh, f) => { drawPhoneHigh(fb, f, {screen: k < mk(sh, 'chip', 3) ? 'dark' : 'reminder', orb: ORB_CIRCLE_LOOKS[Math.min(3, Math.floor(k / 15))]}); },
});
L.add('23.03', {
  st: 'rooms/darkroom-act3 drawDarkA3: bar 3, the rail rolls past midnight to NOV 17 (the host\'s band); Mas looks down at the rail itself, then back up; the reminder on the desk goes dark on its own; the cold open\'s frame on the monitor',
  draw: (fb, k, sh, f) => {
    A3.drawDarkA3(fb, f, {orb: {at: 'shoulder', look: DPLATE_LOOK.phone}, outline: true, mas: {head: k >= 25 && k < 41 ? 'down' : '34', look: -1},
      plate: {phone: 'up', phoneScreen: phoneMini(k < 46 ? 'reminder' : 'off'), screen: coldOpenPainter()}});
  },
});
L.add('23.04', {st: 'BLACK · bar 4 (ACT-OUT 2): THE CLOCK stops on the downbeat', draw: (fb) => { rect(0, 0, 480, RH, fb.ink(PAL.N0)); return {noVo: true}; }});

export const SEGMENT = defineSegment({
  seg: 'act3',
  lock: LOCK,
  layouts: L.all,
  options: {badge: false, vo: 'typed', voLowercase: true, subs: 'off', standin: 'stick'},
  review: {title: 'MR. MAS · EP1 · ACT THREE', subtitle: 'PIXEL v3 · LOCK act3 (THE v3 STICK LOCK)', durNote: 'AS THE STICK LOCK', soundLabel: 'SOUND · TEMP TRACK = THE v3 STICK MIX'},
});
