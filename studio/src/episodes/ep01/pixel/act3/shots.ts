// MR. MAS — Ep1 v3 · ACT THREE, "verified: human" (sc 18–23): one layout per shot of the v3 lock (act3/data.ts,
// tools/lock.py on show/reel/ep01-v3/ep01-v3-act3.json). Written by the `v3-shots-act2-act3` pass on the `v3-art-b`
// pass's dark-room compositions and monitor painters (show/episodes/ep01/production/full-v3/art/art-b.md §1.6) over Act
// Four's dark-room plate. The whole act plays in the home room: a witness arrives (the Orb), the year arrives on the
// monitor, and Friday arrives on his phone. The record: show/episodes/ep01/production/full-v3/shots-act3.md.
// v3.1 (script draft 7; the v3.1 lock show/reel/ep01-v31/ep01-v31-act3.json): the act arrives on the room with the
// monitor lit (the landlord's thirteenth key, KRAM), the lighthouse item is cut and the hands runner takes its slot (one
// held frame, art-b's big-monitor two-shot rooms/darkroom-v31), Gerg's video tile is on the monitor for the call,
// Neleh's paper gets its own beat, one deepfake copy, the Orb's toast over the real one, DevDay opens on the two-shot,
// the reminder names its four circles; face lights on 18.05 and 22.03.
// v3.2 (script draft 8.1, show/reel/ep01-v32/ep01-v32-act3.json; SHOWRUNNER-NOTES 00 and 0: he stops watching): the
// tally's two old marks framed legibly (v31-18.00's cut-in); the thirteenth key large and KRAM's plate with its relation
// word; four V.O. lines cut (their jobs go to the picture: he lowers his hand himself and turns to his keys); 20.02 cut;
// Neleh's byline plate; he closes the paper's tab and the order opens; HIS MOVES: he switches the monitor off (v32-21.06)
// and DevDay is live, full frame, his line in MCU (22.01); a week later he pauses the sign-ups (v32-22.04); 23.02's hover
// cards carry the members' faces.
// v3.3 (script draft 8.2, show/reel/ep01-v33/ep01-v33-act3.json; a polish, changes inside shots over new cuts): the
// Atem beat folds into the arrival (v31-18.00b merged: the lobby plays softly on the big monitor behind him, the key hung
// large, KRAM · RUNS ATEM; the tally cut-in gives way to it); the VP clip and the pinky promise are cut, the forum's hands
// stay (his hand up at home, lowered, then his keys); 20.01 opens on the Tidder thread's title before his reply; he holds
// on page 30 (an MCU, the room, no voice), and the paper's tab stays in his tab strip from the order on; the sign-ups post
// collapses once it's up, NOTIFY ME stays; the Friday reminder pops up over his own NOTIFY ME page beside that tab.
// v3.4 (script draft 8.3, show/reel/ep01-v34/ep01-v34-act3.json; SHOWRUNNER-NOTES 000): 18.02's new V.O. "my other
// company. for when it gets harder to tell." over the label (its foot in shadow for the typed line); "i made it for
// everyone else." is cut; the deepfake beats are cut (21.02 keeps the order's one line, one NEDIB; 21.03 and 21.04 go);
// he signs and the room on the monitor applauds, and the applause carries into the switch-off; 22.01's new V.O. "a year
// ago, forty users and a nice thread." under the hall's applause, on his look out at the hall (the MCU), then his line.
// v3.5 (script draft 8.4, show/reel/ep01-v35/ep01-v35-act3.json; the final version; SHOWRUNNER-NOTES 00000 "keep the
// president's deepfake"): the deepfake is restored from v3.3 (git f57bddb; 21.03 merges into 21.02 again): one cut-paper
// copy pops up and finishes the sentence, the real one turns, "When the hell did I say that?", SEEN 1; 21.04 "which one's
// real?" and the Orb's iris settles on the one with the pen (its two servos) and its toast; the copy claps, and keeps
// clapping into the switch-off; DevDay's thought now waits until the date and the counter have been read (the push to his
// MCU comes just before it).
// Continuity kept here: the Orb settles into the faded outline on the wall at "you can stay." (18.06) and watches from
// there as the iris flicks to the monitor (19.01); from the hands runner on (19.03) it sits at his shoulder, Act Four's
// spot, watching with him, and the outline is empty. The big-monitor two-shot (19.03, 20.04, 20.06, 20.08, 21.04, 22.01's
// first second) is the room from the monitor's other side (art-b's darkroom-v31): Mas still in the left third.
// The one GLYPH use of the act: 18.04g, five frames of tokens inside the scan's cone (the layout returns the layer; the
// Remotion host draws the tokens, the Node render splices those frames).
import {defineSegment, layouts, mk, mouth, roomMouth, RH, shiftRoom} from '../kit';
import type {Viseme} from '../../../../shared/pixel/cast/talk';
import {Buf, rect, clamp, bayer} from '../../../../shared/pixel/px';
import {familyOf, stepColor} from '../../../../shared/pixel/palette';
import {PAL} from '../../../../shared/pixel/palette';
import {glyphLayer} from '../../../../shared/pixel/glyph';
import * as A3 from '../../../../shared/pixel/rooms/darkroom-act3';
import {DPLATE_LOOK} from '../../../../shared/pixel/rooms/darkroom-plate';
import * as MON from '../../../../shared/pixel/kits/mas-monitor';
import {tidderPainter, TIDDER_POST, TIDDER_EDIT} from '../../../../shared/pixel/kits/tidder';
import {eoPainter, EO_SHORT} from '../../../../shared/pixel/kits/eo-signing';
import {lobbyPainter, LOBBY_TOP, runnerPainter, paperPainter, withGergTile} from '../../../../shared/pixel/kits/monitor-v31';
import {drawDark2SSCR, DARK_SCR} from '../../../../shared/pixel/rooms/darkroom-v31';
import {tasyaSpeakPortrait, TASYA_PORTRAIT_DEFAULT} from '../../../../shared/pixel/cast/tasya-speak';
import type {Painter} from '../../../../shared/pixel/kits/mas-monitor';
import {devdayPainter, coldOpenPainter} from '../../../../shared/pixel/kits/monitor-items';
import {drawPhoneHigh, phoneMini} from '../../../../shared/pixel/kits/phone-high';
import {drawOrb} from '../../../../shared/pixel/cast/orb-medium';
import {spoken, stepOf, heldLerp, drawGagCard, namePlate} from '../act2/kit2';
import * as M32 from '../../../../shared/pixel/kits/monitor-v32';
import type {GagCard} from '../act2/kit2';
import {LOCK} from './data';

const L = layouts();
const talk = (v: Viseme, rest: Viseme = 'rest'): Viseme => (v === 'rest' ? rest : v);
/** the Orb's looks from its home on the wall (A3.ORB_HOME, right of the window): everything it watches is to its left,
 *  so the reads are the vertical steps (the monitor level, his face a little lower, the desk and the phone lower still) */
const HOME = {monitor: [-0.97, -0.08] as [number, number], face: [-0.86, 0.14] as [number, number], phone: [-0.72, 0.5] as [number, number], box: [-0.8, 0.3] as [number, number]};
const CARD_ORB: GagCard = {x: 470, y: 10, name: 'THE ORB', lines: ["IT'S SEEN THINGS.", 'MOSTLY IRISES.'], stat: ['SCANS: 1'], accent: PAL.C7, align: 'right'};
const BOX_X = A3.boxOrbAt(3);
/** the Orb's looks in the big-monitor two-shot (it sits at his far shoulder, frame left of him; the monitor far right) */
const SCR = {monitor: [0.86, -0.22] as [number, number], face: [0.95, 0.2] as [number, number]};
/** TASYA's mouth on the lobby clip: lobbyPainter draws his speaking portrait with the rest smile; this lays the take's
 *  viseme over it (only the pixels where the two drawings differ, at the painter's own place: x 12% of the screen, y 10) */
const withTasyaMouth = (paint: Painter, v: Viseme): Painter => (scr, f) => {
  paint(scr, f);
  if (v === 'rest' || v === 'smile' || scr.w < 200) return;
  const jangle = (Math.floor(f / 6) % 2) as 0 | 1;
  const a = tasyaSpeakPortrait({...TASYA_PORTRAIT_DEFAULT, arms: 'ring', mouth: 'smile', brow: 'warm', jangle});
  const b = tasyaSpeakPortrait({...TASYA_PORTRAIT_DEFAULT, arms: 'ring', mouth: v, brow: 'warm', jangle});
  const tx = Math.round(scr.w * 0.12), ty = LOBBY_TOP(scr.h);
  for (let j = 40; j < 100; j++) for (let i = 0; i < a.w; i++) { const va = a.c[j * a.w + i], vb = b.c[j * a.w + i]; if (vb >= 0 && va !== vb && ty + j >= 0 && ty + j < scr.h) scr.set(tx + i, ty + j, vb); }
};

/** v3.3 (P10): his browser's tab strip from the order on: Neleh's paper stays open in it */
const PAPER_TAB = 'DECODING INTENTIONS';
const tabsOrder = (p: Painter) => M32.withTabs(p, {tabs: [PAPER_TAB, 'LIVE · THE ORDER'], active: 1});
const tabsPlus = (p: Painter) => M32.withTabs(p, {tabs: [PAPER_TAB, 'chatgtp.plus'], active: 1});

// =================================================================== sc 18 · the Orb arrives
L.add('v31-18.00', {
  st: 'ARRIVAL · v3.3 (P5: v31-18.00b merged in) rooms/darkroom-v31 drawDark2SSCR {orb: null} (the home room with the monitor LARGE at frame right, the desk, the rack\'s LEDs, the glass, the faded sphere outline on the wall, empty; MAS at the desk watching it): the landlord\'s lobby playing softly on it (kits/monitor-v31 lobbyPainter {keyLarge}, no date chip): TASYA hangs the thirteenth key, Atem blue, on his ring in held steps and it hangs LARGE on "welcome" (his lips on "Everyone is welcome.", the take\'s visemes over the painter\'s portrait); KRAM steps into the lobby in the dry OPEN SOURCE hoodie; MACROSOFT WELCOMES ATEM on the monitor\'s own chyron (v3.3.1: Kram\'s plate dropped, the audit\'s §3 #1: the chyron and the hoodie carry it). (The v3.2 tally cut-in gives way: the two faint marks stay on the desk.)',
  enter: {kind: 'dip', frames: 8},
  face: {TASYA: 'lip'},
  marks: {line: ['on', 'v31-a3-0001', 0], hang: ['w', 'v31-a3-0001', 'welcome', 0]},
  draw: (fb, k, sh, f) => {
    const line = mk(sh, 'line', 33), hang = mk(sh, 'hang', 50);
    const key = (k < 10 ? 0 : k < hang ? 1 : 2) as 0 | 1 | 2;
    const kram = (k < 4 ? 0 : k < line - 6 ? 1 : 2) as 0 | 1 | 2;
    drawDark2SSCR(fb, f, {screen: withTasyaMouth(lobbyPainter({key, kram, caption: true, chip: false, f, keyLarge: true}), mouth(sh, k, 'TASYA')), orb: null, mas: {look: 1}});
    // v3.3.1 (the audit's §3 #1): no plate; the chyron and his hoodie carry the reference
  },
});
L.add('18.01', {
  st: 'rooms/darkroom-act3 drawDarkA3 (v3.1: back on the room, the arrival now v31-18.00; the lobby still on the monitor): the whir pre-laps the cut and the drive slot slides out the COINWORLD box like a tray in four held steps, landing on the thunk; Mas turns to it',
  marks: {whir: ['snd', 'synth:slot_whir', 1, 0], land: ['snd', 'landing_thunk', 1, 0]},
  draw: (fb, k, sh, f) => {
    const w = mk(sh, 'whir', 59), land = mk(sh, 'land', 89);
    const pos = stepOf(k, [w, w + 9, w + 18, land - 3]) as 0 | 1 | 2 | 3 | 4;
    A3.drawDarkA3(fb, f, {orb: null, outline: true, box: pos ? {pos} : null, mas: {arm: 'rest', look: k >= w + 8 ? 1 : -1}, plate: {screen: lobbyPainter({key: 2, kram: 2, caption: true, chip: false, f, keyLarge: true})}});
  },
});
L.add('18.02', {
  st: 'rooms/darkroom-act3 drawLabelECU [ECU]: the box\'s label, legible (FROM: COINWORLD · PROOF YOU\'RE HUMAN / SHIP TO: MAS MANALT, CO-FOUNDER); his fingertips come to the lid in two held steps; the rack\'s LEDs blink beyond it; v3.4: under "my other company. for when it gets harder to tell." (V.O.) the box\'s near edge falls into shadow at the frame\'s foot, so the typed line reads on dark (as in v3.1)',
  draw: (fb, k, sh, f) => {
    A3.drawLabelECU(fb, f, {hand: k < 22 ? 0 : k < 46 ? 1 : 2});
    // v3.4 (the V.O. is back): the box's near edge (a lit line) and its front face in shadow below it, so the typed line
    // reads on dark (the box's cream only: his fingertips stay in the monitor's light)
    for (let x = 0; x < 480; x++) fb.set(x, 174, PAL.W9);
    for (let y = 175; y < RH; y++) for (let x = 0; x < 480; x++) { const fm = familyOf(fb.get(x, y)); if (!fm || fm[0] !== 'P') continue; fb.set(x, y, y < 178 ? PAL.D2 : bayer(x, y) < 0.25 ? PAL.D1 : PAL.N1); }
    // and his fingertips' ends down there in the same shadow, two rungs, so the typed line reads over them too
    for (let y = 184; y < RH; y++) for (let x = 0; x < 200; x++) { const fm = familyOf(fb.get(x, y)); if (fm && fm[0] !== 'N' && fm[0] !== 'D') fb.set(x, y, stepColor(fb.get(x, y), -2)); }
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
  st: 'rooms/darkroom-act3 drawScanMCU [MCU]: Mas\'s portrait, the thin cyan cone fanning out across his face from the Orb off frame right (held steps); 18.04g: for five frames inside the cone only his face is tokens (GLYPH: the cone\'s Mask, the layer returned for the Remotion host); by frame 6 the cone is gone; 18.05: the toast pops beside the Orb, "verified: human" (on the chip click), and "thanks." (lip-sync), his face one step up (v3.1 face light, faceLightImg keyed from the Orb\'s side) — merged',
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
    A3.drawScanMCU(fb, f, {mas, toast: k >= t ? {s: 'verified: human', k: k - t} : null, faceLight: 1}); // v3.1: the face light (mood-analysis §4 #4)
  },
});
L.add('18.06', {
  st: 'rooms/darkroom-act3 drawDarkA3: the Orb drifts from the box to the faded outline on the wall in whole-pixel held steps (2 f) and settles exactly into it (the outline now filled); v3.4: "i made it for everyone else." is cut; across "you can stay." (lip-sync) it settles as the line ends; its aperture opens once on the chime; the hold on the two of them',
  face: {MAS: 'lip'},
  marks: {chime: ['snd', 'synth:chime', 1, 0], stay: ['on', 'e1-a3-18-03', 0]},
  draw: (fb, k, sh, f) => {
    const c = mk(sh, 'chime', 84), stay = mk(sh, 'stay', 52);
    // v3.4 (the V.O. before it is cut): it drifts across "you can stay." and settles into the outline as the line ends
    const d0 = Math.max(8, stay - 28), d1 = stay + 24;
    const home = k >= d1;
    const at: [number, number] = [heldLerp(k, d0, d1, BOX_X[0], A3.ORB_HOME.x), heldLerp(k, d0, d1, BOX_X[1], A3.ORB_HOME.y)];
    const mm = spoken(sh, k, 'MAS');
    A3.drawDarkA3(fb, f, {box: {pos: 4, open: true, rise: 3}, orb: {at: home ? 'home' : at, look: home ? HOME.face : [-0.9, 0.1], aperture: k >= c && k < c + 10 ? 0.75 : 0.5},
      outline: home ? 'filled' : true, mas: {arm: 'rest', look: 1, mouth: mm}});
  },
});

// =================================================================== sc 19 · the hands runner
L.add('19.01', {
  st: 'rooms/darkroom-act3 drawDarkA3 (later: the box gone): the Orb at home in its outline, its iris flicking from him to the monitor (v3.3: the forum small on it, kits/monitor-v31 runnerPainter\'s mini; the VP clip is cut); Mas watching the monitor',
  draw: (fb, k, sh, f) => { A3.drawDarkA3(fb, f, {orb: {at: 'home', look: k < 12 ? HOME.face : HOME.monitor}, outline: 'filled', mas: {look: -1}, plate: {screen: runnerPainter({item: 'forum', hands: 0})}}); },
});
L.add('v31-19.03', {
  st: 'rooms/darkroom-v31 drawDark2SSCR (the hands runner, v3.3: the forum only; the VP clip and the pinky promise are cut): ONE held room frame, the monitor large at frame right: SEP 13, the forum\'s tiled room, every hand down (kits/monitor-v31 runnerPainter); the Orb whirrs at the monitor (the first servo); at the desk Mas\'s own hand goes up, before anyone\'s, and the Orb turns to it (the second); REMUHCS asks the room and the Orb rises a pixel (the third); every hand goes up at once on "raised" (NOLE\'s highest); after NOLE\'s "referee" he lowers his hand himself and turns straight to his keys, head down',
  marks: {o1: ['snd', 'orb_servo', 1, 0], o2: ['snd', 'orb_servo', 2, 0], o3: ['snd', 'orb_servo', 3, 0], raised: ['w', 'e1-a3-19-01', 'raised', 0], nole: ['end', 'e1-a3-19-02', 0]},
  draw: (fb, k, sh, f) => {
    const o1 = mk(sh, 'o1', 7), o2 = mk(sh, 'o2', 19), o3 = mk(sh, 'o3', 45), up = mk(sh, 'raised', 65), nole = mk(sh, 'nole', 157);
    const low = nole + 3, keys = nole + 11;
    const hand: 'up' | 'lower' | null = k >= o2 - 8 && k < keys ? (k >= low ? 'lower' : 'up') : null;
    const mode: 'whirr' | 'rotate' | 'rise' | 'look' = k >= o1 && k < o1 + 10 ? 'whirr' : k >= o2 && k < o2 + 20 ? 'rotate' : k >= o3 && k < o3 + 30 ? 'rise' : 'look';
    drawDark2SSCR(fb, f, {screen: runnerPainter({item: 'forum', hands: k >= up ? 1 : 0}), hand, orb: {mode, look: k >= low ? SCR.face : undefined}, mas: k >= keys ? {head: 'down', look: 0} : {look: 1}});
  },
});

// =================================================================== sc 20 · the post, and the call
L.add('20.01', {
  st: 'kits/mas-monitor drawMonitorOTS + kits/tidder tidderPainter {title, replyBox} [OTS] (v3.3, S1 / P9): over his shoulder onto the monitor, straight from the forum\'s raised hands: a TIDDER thread, t/singularity, its title the crowd\'s invented question ("is it already here? anyone actually know?"), held to read; then he opens the reply box and types his reply into it, in source casing, on the keys',
  marks: {reply: ['txt', 'TIDDER · reply', 'at', 0], keys: ['snd', 'synth:keys', 1, 0]},
  draw: (fb, k, sh, f) => {
    const rb = mk(sh, 'reply', 28), kk = mk(sh, 'keys', 35) + 2;
    MON.drawMonitorOTS(fb, f, tidderPainter({phase: 'typing', title: true, replyBox: k >= rb, typed: Math.floor(clamp((k - kk) * 0.62, 0, TIDDER_POST.length))}));
  },
});
L.add('20.03', {
  st: 'kits/tidder tidderPainter [POV]: he posts; the reply counter spins, a blur, climbing; the first reply legible, held',
  draw: (fb, k, sh, f) => { MON.drawMonitorPOV(fb, f, tidderPainter({phase: 'posted', count: 3 + Math.floor(k * k * 0.9), spin: true})); },
});
const countAt = (k: number, base: number, rate: number) => base + Math.floor(k * rate);
L.add('20.04', {
  st: 'rooms/darkroom-v31 drawDark2SSCR (v3.1: the big monitor, so the call is on screen): the TIDDER thread with the counter climbing, and GERG\'s video tile ringing up in its corner (kits/monitor-v31 withGergTile, 2 AM\'s tile, lip-synced, typing); Mas takes it on the key tap without looking away from the counter; "i\'m editing it." (lip-sync); then the Orb turns from the monitor and looks at him, one beat longer than it needs to',
  face: {MAS: 'lip', GERG: 'lip'},
  marks: {tile: ['txt', 'GERG', 'at', 0], ans: ['end', 'e1-a3-20-03', 0]},
  draw: (fb, k, sh, f) => {
    const tile = mk(sh, 'tile', 2), ans = mk(sh, 'ans', 109);
    const thread = tidderPainter({phase: 'posted', count: countAt(k, 4120, 9)});
    const screen = k >= tile ? withGergTile(thread, {mouth: mouth(sh, k, 'GERG'), typing: true}) : thread;
    drawDark2SSCR(fb, f, {screen, orb: {mode: 'look', look: k >= ans + 6 && k < ans + 70 ? SCR.face : SCR.monitor}, mas: {look: 1, mouth: spoken(sh, k, 'MAS')}});
  },
});
L.add('20.05', {
  st: 'kits/tidder tidderPainter (edit, tight) [POV]: he clicks edit; framed tight on the middle, the comment rewrites itself letter by letter on the keyboard roll; held to read; v3.1: Gerg\'s tile stays in the monitor\'s corner (the call is on)',
  marks: {roll: ['snd', 'keyboard_roll', 1, 0]},
  draw: (fb, k, sh, f) => { const r = mk(sh, 'roll', 10); MON.drawMonitorPOV(fb, f, withGergTile(tidderPainter({phase: 'edit', editK: Math.floor(clamp((k - r) * 1.5, 0, TIDDER_EDIT.length)), tight: true}), {typing: true})); },
});
L.add('20.06', {
  st: 'rooms/darkroom-v31 drawDark2SSCR: back on the two-shot, the LEDs blinking, the counter climbing faster, GERG\'s tile in the corner (lip-synced, typing: "Okay. That\'s patched.", the build, "When it compiles."); Mas lip-synced to the tile; his head drops for "go to sleep, gerg." and the Orb looks at him; v3.2 (the V.O. cut): the hold is Gerg\'s keys running on',
  face: {MAS: 'lip', GERG: 'lip'},
  marks: {sleep: ['on', 'e1-a3-20-08', 0]},
  draw: (fb, k, sh, f) => {
    const sl = mk(sh, 'sleep', 202);
    const down = k >= sl - 4 && k < sl + 40;
    const screen = withGergTile(tidderPainter({phase: 'posted', count: countAt(k, 6400, 23)}), {mouth: mouth(sh, k, 'GERG'), typing: true});
    drawDark2SSCR(fb, f, {screen, orb: {mode: 'look', look: k >= sl - 6 ? SCR.face : SCR.monitor}, mas: {head: down ? 'down' : '34', look: 1, mouth: spoken(sh, k, 'MAS')}});
  },
});
L.add('v31-20.07', {
  st: 'kits/monitor-v31 paperPainter [POV] (v3.1, Neleh\'s paper): the title page (DECODING INTENTIONS, the NELEH byline, the glowing page, the footnotes orbiting) with her first-appearance plate NELEH · NOPEAI BOARD (v3.2, one relation word), then p. 29 ("research preview" in the paper\'s own quotes), then p. 30 (the two small logos, the held sentence) held for the rest of the shot (v3.2: the V.O. is cut; the quote is what he and we read), the scrollbar\'s thumb shrinking',
  draw: (fb, k, sh, f) => {
    const page = k < 26 ? 'title' : k < 44 ? 'p29' : 'p30';
    MON.drawMonitorPOV(fb, f, paperPainter({page, thumb: clamp((k - 20) / 70, 0, 1)}));
    if (k < 44) namePlate(fb, k - 3, 'NELEH · NOPEAI BOARD', 64, 150, PAL.C6);
  },
});
L.add('v31-20.08', {
  st: 'v3.3 (P10, V3: no voice) rooms/darkroom-act3 drawScanMCU (no fan, no toast) [MCU]: his face reading page 30, the page\'s light on it (one face-light step, keyed from the monitor), held about 2 s: the room, nothing on it changes; then he switches tabs, and the light on his face drops a step with the darker page (the paper\'s tab stays in his strip: 21.02 on)',
  marks: {},
  draw: (fb, k, sh, f) => {
    const sw = Math.max(0, sh.e - sh.s - 9);
    A3.drawScanMCU(fb, f, {mas: {look: 1, mouth: 'rest'}, faceLight: k < sw ? 2 : 1});
  },
});

// =================================================================== sc 21 · the order, on the monitor
L.add('21.02', {
  st: 'kits/eo-signing eoPainter + kits/monitor-v32 withTabs [POV] (his tab strip, DECODING INTENTIONS still open beside the live order): NEDIB, pen raised, over an order off both ends of a very big desk (lip-sync); v3.5 (restored from v3.3): ONE cut-paper copy pops up behind the desk on the pop (3 held steps) and finishes his sentence, "And then the computers regulate themselves." (lip-sync); 21.03 merged: the real one turns to look at it, "When the hell did I say that?", and his stat chip updates on the chip click: DEEPFAKES OF ME: SEEN 1 (his card\'s stat from Act Two)',
  face: {NEDIB: 'lip', DEEPFAKE: 'lip'},
  marks: {p1: ['snd', 'tower_pop', 1, 0], turn: ['beat', '21.03', 0], stat: ['snd', 'post_click--chip', 1, 0]},
  draw: (fb, k, sh, f) => {
    const p1 = mk(sh, 'p1', 187), turn = mk(sh, 'turn', 254), stat = mk(sh, 'stat', 323);
    const copies = (k >= p1 ? 1 : 0) as 0 | 1;
    MON.drawMonitorPOV(fb, f, tabsOrder(eoPainter({copies, pop: copies ? Math.floor((k - p1) / 3) : undefined, pen: 'raised', mouth: talk(mouth(sh, k, 'NEDIB'), 'smile'), copyMouth: talk(mouth(sh, k, 'DEEPFAKE'), 'smile'), turn: k >= turn, stat: k >= stat ? 1 : null, egg: false})));
  },
});
L.add('21.04', {
  st: 'v3.5 (restored from v3.3): rooms/darkroom-v31 drawDark2SSCR [2S·SCR] (the monitor large, the two NEDIBs readable: eoPainter\'s short layout) with a slow whole-pixel drift in (1 px / 12 f toward the monitor): Mas glances back at the Orb, "which one\'s real?" (lip-sync), and back to the screen; the iris flicks to the copy, then to the real one with the pen, on its two servos, and settles; its toast pops over him: verified: human (the callback to 18.05; the Orb\'s "for when it gets harder to tell.")',
  face: {MAS: 'lip'},
  marks: {ask: ['on', 'e1-a3-21-06', 0], o1: ['snd', 'orb_servo', 1, 0], o2: ['snd', 'orb_servo', 2, 0]},
  draw: (fb, k, sh, f) => {
    const ask = mk(sh, 'ask', 19), o1 = mk(sh, 'o1', 56), o2 = mk(sh, 'o2', 65);
    const o = stepOf(k, [o1, o2]);
    const looks: Array<[number, number]> = [k >= ask + 12 ? SCR.face : SCR.monitor, [0.8, 0.12], [0.95, -0.05]];
    const glance = k >= ask - 4 && k < ask + 30;
    const toastK = k - (o2 + 6);
    drawDark2SSCR(fb, f, {screen: tabsOrder(eoPainter({copies: 1, pen: 'raised', stat: 1})), orb: {mode: 'look', look: looks[o]}, mas: {look: glance ? -1 : 1, mouth: spoken(sh, k, 'MAS')},
      toasts: toastK >= 0 ? [{s: 'verified: human', k: toastK, x: DARK_SCR.screen.x + EO_SHORT.realX + 30, y: DARK_SCR.screen.y + 15}] : []});
    shiftRoom(fb, -Math.min(8, Math.floor(k / 12)));
  },
});
L.add('21.05', {
  st: 'kits/eo-signing eoPainter [POV]: the real NEDIB signs, in ink (the signature\'s strokes on 3s from the paper whip); v3.5 (restored from v3.3): the copy claps on the claps, and keeps clapping (one copy, SEEN 1)',
  marks: {whip: ['snd', 'paper_whip', 1, 0], claps: ['snd', 'synth:claps', 1, 0]},
  draw: (fb, k, sh, f) => {
    const w = mk(sh, 'whip', 4);
    MON.drawMonitorPOV(fb, f, tabsOrder(eoPainter({copies: 1, pen: 'sign', signK: clamp(Math.floor((k - w) / 3), 0, 5), clap: k >= mk(sh, 'claps', 19), stat: 1, egg: false})));
  },
});

L.add('v32-21.06', {
  st: 'v3.2, HIS MOVE (the switch): rooms/darkroom-v31 drawDark2SSCR {hand: \'switch\', off}: v3.5 (restored from v3.3): the copy still clapping on the big monitor; Mas leans over and reaches to the switch on the bezel\'s near corner; on the click the glass goes black in one step, its LED out; the clapping doesn\'t stop (it grows into the hall\'s applause, the next cut); the Orb looks from the black glass to him',
  marks: {click: ['snd', 'key_tap_space', 1, 0]},
  draw: (fb, k, sh, f) => {
    const c = mk(sh, 'click', 21);
    const off = k >= c;
    drawDark2SSCR(fb, f, {screen: tabsOrder(eoPainter({copies: 1, pen: 'sign', signK: 5, clap: true, stat: 1, egg: false})), hand: k >= c - 12 && k < c + 10 ? 'switch' : null, off,
      orb: {mode: 'look', look: k < c + 6 ? SCR.monitor : SCR.face}, mas: {look: 1}});
  },
});

// =================================================================== sc 22 · DevDay, live
/** the crowd along the stage frame's foot (devdayPainter's heads, rows ~186-202): alternate 11-px groups lifted one pixel on
 *  alternate 4-frame beats, so the hall claps in held steps */
const clapCrowd = (fb: Buf, k: number) => {
  for (let x = 0; x < 480; x++) {
    if (((Math.floor(x / 11) + (k >> 2)) & 1) === 0) continue;
    for (let y = 184; y < RH - 1; y++) fb.set(x, y, fb.get(x, y + 1));
  }
};
L.add('22.01', {
  st: 'v3.2, HIS MOVE (DevDay live): kits/monitor-v32 drawDevDayFull [W]: the stage full frame, the applause carried over the cut, the crowd clapping in held steps; the launch-night odometer clunks up through the stage floor in three held steps on the ratchet to 100,000,000 / WEEK; v3.4 (v34-vo-06): the push to drawDevDayMCU [MCU] as the figure settles: his look out at the hall under "a year ago, forty users and a nice thread." (V.O., lips still), the one-pixel smile after it; then, in the same MCU, lip-synced, "and today, you can build your own chatgtp."; back on the [W] as TASYA walks on from the right, laughing, arms open, the Sydney bubble on its chain behind him (he stops clear of the must-read figure); "so, how\'s the partnership going?" (room-scale), "We love you guys." (his laugh drawing on the take\'s syllables)',
  face: {MAS: 'lip', TASYA: 'room'},
  marks: {appl: ['snd', 'synth:applause', 1, 0], rat: ['snd', 'odometer_ratchet', 1, 0], land: ['snd', 'landing_thunk', 1, 0], vo: ['on', 'v34-vo-06', 0], voEnd: ['end', 'v34-vo-06', 0], line: ['on', 'v32-a3-0001', 0], back: ['end', 'v32-a3-0001', 0], tasya: ['on', 'e1-a3-22-01', -21]},
  draw: (fb, k, sh, f) => {
    const applEnd = mk(sh, 'appl', 24) + 82;
    const r = mk(sh, 'rat', 43), land = mk(sh, 'land', 104), back = mk(sh, 'back', 201) + 4, t0 = mk(sh, 'tasya', 207);
    const voEnd = mk(sh, 'voEnd', 116), line = mk(sh, 'line', 130);
    // v3.5: the thought waits until the date and the counter have been read (the counter lands at 4.37 s); the push to
    // his MCU comes 6 f before the V.O., after the landing
    const push = Math.max(r + 21, land + 4, mk(sh, 'vo', 115) - 6);
    const mm = mouth(sh, k, 'MAS');
    if (k >= push && k < back) {
      // his look out at the hall: the V.O. (lips still: spoken), the smile after it, then his line
      const sm = spoken(sh, k, 'MAS');
      const mo = k >= voEnd + 4 && k < line - 2 ? 'smile' : sm === 'smile' ? 'rest' : sm;
      M32.drawDevDayMCU(fb, f, {mas: {mouth: mo, look: 0}});
      return;
    }
    const rise = stepOf(k, [r, r + 8, r + 16]) as 0 | 1 | 2 | 3;
    M32.drawDevDayFull(fb, f, {rise, clunk: (k >= r + 16 && k < r + 19) || (k >= land && k < land + 3), tasya: k < t0 ? null : clamp((k - t0) / 60, 0, 1) * 0.4, sydney: true,
      laugh: k < t0 + 60 || roomMouth(sh, k, 'TASYA') === 'open', mouth: mm !== 'rest' && mm !== 'M' && mm !== 'smile' ? 'open' : 'rest'});
    // the hall applauding: the crowd's heads along the bottom bob a pixel, alternate groups on alternate 4-frame beats
    if (k < applEnd) clapCrowd(fb, k);
  },
});
L.add('22.02', {
  st: 'kits/phone-high drawPhoneHigh [HIGH]: that night, home (v3.2): the desk from above, the phone lights (the chip) with How did the keynote go? and the strip [super] [enthusiastic] [thrilled]; his thumb comes in and hovers over the strip (the one hover in the episode) while the Orb\'s iris, at the frame\'s edge, steps to each word his V.O. weighs; the tap on super',
  marks: {chip: ['snd', 'post_click--chip', 1, 0], tap: ['snd', 'key_tap_soft_01', 1, 0], thr: ['w', 'v3-vo-16', 'thrilled', 0], ent: ['w', 'v3-vo-16', 'enthusiastic', 0]},
  draw: (fb, k, sh, f) => {
    const chip = mk(sh, 'chip', 4), tap = mk(sh, 'tap', 117), thr = mk(sh, 'thr', 31), ent = mk(sh, 'ent', 70);
    const orb: [number, number] = k >= tap - 2 ? [-0.86, 0.4] : k >= ent ? [-0.83, 0.5] : k >= thr ? [-0.79, 0.6] : [-0.84, 0.46];
    drawPhoneHigh(fb, f, {screen: k < chip ? 'dark' : 'prompt', thumb: k < 24 ? 'none' : k < tap ? 'hover' : 'tap', orb});
  },
});
L.add('22.03', {
  st: 'rooms/darkroom-act3 drawDarkA3: Mas and the Orb (now at his shoulder, Act Four\'s spot; the outline on the wall empty), the phone between them; "super." under his breath (lip-sync, his head down to the phone); the Orb\'s iris lingers on the phone and its aperture narrows a step; no toast comes; the hold; v3.1: his face one step up (the face light, faceKey keyed from the monitor)',
  face: {MAS: 'lip'},
  draw: (fb, k, sh, f) => {
    A3.drawDarkA3(fb, f, {orb: {at: 'shoulder', look: DPLATE_LOOK.phone, aperture: k >= 44 ? 0.38 : 0.5}, outline: true, mas: {arm: 'phone', head: 'down', mouth: spoken(sh, k, 'MAS')},
      plate: {phone: 'up', phoneScreen: phoneMini('prompt'), screen: devdayPainter({rise: 3, tasya: 1, sydney: true})}, faceLight: 1}); // v3.1: the face light (notes §4)
  },
});

L.add('v32-22.04', {
  st: 'v3.2, HIS MOVE (pausing the sign-ups; the record, his post\'s first sentence): kits/mas-monitor drawMonitorOTS + kits/monitor-v32 signupPainter [OTS]: a week later, over his shoulder, the CHATGTP Plus sign-up page, its counter\'s drums a smear on the fast ratchet (never a figure); beside him the rack\'s edge (drawRackSlice), its LEDs stepping green, amber, red, one step a beat (launch night\'s heat); he types his post in its box, and it goes up as a card on the post click; SIGN UP greys, then reads NOTIFY ME on the blink, and it stays; v3.3.1 (P11): then the post, read, collapses away (two held steps) and the page is NOTIFY ME alone; the counter stops; the paper\'s tab in his strip',
  marks: {spin: ['snd', 'synth:ratchet_fast', 1, 0], post: ['snd', 'post_click', 1, 0], grey: ['snd', 'glyph_blink', 1, 0]},
  draw: (fb, k, sh, f) => {
    const sp = mk(sh, 'spin', 7), post = mk(sh, 'post', 72), grey = mk(sh, 'grey', 93);
    const typed0 = sp + 20, n = M32.POST_PAUSE.text.length;
    const typed = k < typed0 ? null : Math.min(n, Math.floor((k - typed0) * n / Math.max(8, post - 6 - typed0)));
    const btn = (k < grey - 6 ? 0 : k < grey ? 1 : 2) as 0 | 1 | 2;
    // v3.3.1 (P11): once it's up and read (and SIGN UP has turned to NOTIFY ME), his post collapses away in two held
    // steps; NOTIFY ME stays on the page
    const col = grey + 8;
    MON.drawMonitorOTS(fb, f, tabsPlus(M32.signupPainter({spin: k >= sp && k < grey ? f : 0, btn, typed, post: k >= post ? k - post : null, collapse: k >= col ? k - col : null})));
    M32.drawRackSlice(fb, 432, stepOf(k, [sp + 16, sp + 40]) as 0 | 1 | 2, f);
  },
});

// =================================================================== sc 23 · catching up (THE CLOCK: one bar a shot)
L.add('23.01', {st: 'kits/monitor-items coldOpenPainter [POV] (art-a rooms/apec-stage, cropped 1:1): bar 1, the cold open\'s frame on the monitor; we\'ve caught up', draw: (fb, k, sh, f) => { MON.drawMonitorPOV(fb, f, coldOpenPainter()); }});
/** the Orb at his shoulder, in at the POV frame's right edge: its looks to the reminder's four circles, whole steps */
const ORB_REMIND: Array<[number, number]> = [[-0.94, -0.33], [-0.93, -0.36], [-0.92, -0.4], [-0.9, -0.44]];
L.add('23.02', {
  st: 'v3.3 (P10) kits/mas-monitor drawMonitorPOV [SCR]: bar 2, his monitor: his own NOTIFY ME page (signupPainter; v3.3.1: his post collapsed away), the DECODING INTENTIONS tab still in his strip, and the Friday reminder popping up over them (kits/monitor-v32 withReminder: Board sync · Fri 12:00, the four attendee circles); the Orb at his shoulder, in at the frame\'s right edge, steps its iris along them, and each one\'s card shows the member\'s small call tile and name (ALYI, NELEH, MADA, THE QUIET VOTE); it stops on the black square',
  marks: {chip: ['snd', 'post_click--chip', 1, 0]},
  draw: (fb, k, sh, f) => {
    const c = mk(sh, 'chip', 3);
    const n = k < c + 6 ? null : (Math.min(3, Math.floor((k - c - 6) / 11)) as 0 | 1 | 2 | 3);
    MON.drawMonitorPOV(fb, f, tabsPlus(M32.withReminder(M32.signupPainter({spin: 0, btn: 2, post: null}), {k: k - c, hover: n})));
    drawOrb(fb, 454, 150, 26, {look: ORB_REMIND[n ?? 0], aperture: 0.55, monitor: -1});
  },
});
L.add('23.03', {
  st: 'rooms/darkroom-act3 drawDarkA3: bar 3, the rail rolls past midnight to NOV 17 (the host\'s band); Mas looks down at the rail itself, then back up; v3.3: the reminder on his monitor (over his NOTIFY ME page) goes dark on its own; the phone on the desk is dark',
  draw: (fb, k, sh, f) => {
    A3.drawDarkA3(fb, f, {orb: {at: 'shoulder', look: DPLATE_LOOK.face}, outline: true, mas: {head: k >= 25 && k < 41 ? 'down' : '34', look: -1},
      plate: {phone: 'up', phoneScreen: phoneMini('off'), screen: tabsPlus(M32.withReminder(M32.signupPainter({spin: 0, btn: 2, post: null}), {k: k < 46 ? 99 : -1}))}});
  },
});
L.add('23.04', {st: 'BLACK · bar 4 (ACT-OUT 2): THE CLOCK stops on the downbeat', draw: (fb) => { rect(0, 0, 480, RH, fb.ink(PAL.N0)); return {noVo: true}; }});

export const SEGMENT = defineSegment({
  seg: 'act3',
  lock: LOCK,
  layouts: L.all,
  options: {badge: false, vo: 'typed', voLowercase: true, subs: 'off', standin: 'stick'},
  review: {title: 'MR. MAS · EP1 · ACT THREE', subtitle: 'PIXEL v3.5 · LOCK act3 (THE v3.5 BASE LOCK)', durNote: 'AS THE STICK LOCK', soundLabel: 'SOUND · TEMP TRACK = THE v3.5 STICK MIX'},
});
