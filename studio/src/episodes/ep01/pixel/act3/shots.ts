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
// Continuity kept here: the Orb settles into the faded outline on the wall at "you can stay." (18.06) and watches from
// there as the iris flicks to the monitor (19.01); from the hands runner on (19.03) it sits at his shoulder, Act Four's
// spot, watching with him, and the outline is empty. The big-monitor two-shot (19.03, 20.04, 20.06, 20.08, 21.04, 22.01's
// first second) is the room from the monitor's other side (art-b's darkroom-v31): Mas still in the left third.
// The one GLYPH use of the act: 18.04g, five frames of tokens inside the scan's cone (the layout returns the layer; the
// Remotion host draws the tokens, the Node render splices those frames).
import {defineSegment, layouts, mk, mouth, roomMouth, RH, shiftRoom} from '../kit';
import type {Viseme} from '../../../../shared/pixel/cast/talk';
import {Buf, rect, clamp, bayer} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {glyphLayer} from '../../../../shared/pixel/glyph';
import * as A3 from '../../../../shared/pixel/rooms/darkroom-act3';
import {DPLATE_LOOK} from '../../../../shared/pixel/rooms/darkroom-plate';
import * as MON from '../../../../shared/pixel/kits/mas-monitor';
import {tidderPainter, TIDDER_POST, TIDDER_EDIT} from '../../../../shared/pixel/kits/tidder';
import {eoPainter, EO_SHORT} from '../../../../shared/pixel/kits/eo-signing';
import {lobbyPainter, sirrahPainter, runnerPainter, paperPainter, withGergTile} from '../../../../shared/pixel/kits/monitor-v31';
import {drawDark2SSCR, DARK_SCR} from '../../../../shared/pixel/rooms/darkroom-v31';
import {tasyaSpeakPortrait, TASYA_PORTRAIT_DEFAULT} from '../../../../shared/pixel/cast/tasya-speak';
import type {Painter} from '../../../../shared/pixel/kits/mas-monitor';
import {devdayPainter, coldOpenPainter} from '../../../../shared/pixel/kits/monitor-items';
import {drawPhoneHigh, phoneMini, ORB_CIRCLE_LOOKS} from '../../../../shared/pixel/kits/phone-high';
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
/** a silent viseme track (someone talking on a screen with no words reaching us) */
const silentLip = (kk: number): Viseme => (['E', 'rest', 'A', 'E', 'rest', 'O', 'rest', 'rest'] as const)[(kk >> 2) % 8];
/** TASYA's mouth on the lobby clip: lobbyPainter draws his speaking portrait with the rest smile; this lays the take's
 *  viseme over it (only the pixels where the two drawings differ, at the painter's own place: x 12% of the screen, y 10) */
const withTasyaMouth = (paint: Painter, v: Viseme): Painter => (scr, f) => {
  paint(scr, f);
  if (v === 'rest' || v === 'smile' || scr.w < 200) return;
  const jangle = (Math.floor(f / 6) % 2) as 0 | 1;
  const a = tasyaSpeakPortrait({...TASYA_PORTRAIT_DEFAULT, arms: 'ring', mouth: 'smile', brow: 'warm', jangle});
  const b = tasyaSpeakPortrait({...TASYA_PORTRAIT_DEFAULT, arms: 'ring', mouth: v, brow: 'warm', jangle});
  const tx = Math.round(scr.w * 0.12), ty = 10;
  for (let j = 40; j < 100; j++) for (let i = 0; i < a.w; i++) { const va = a.c[j * a.w + i], vb = b.c[j * a.w + i]; if (vb >= 0 && va !== vb) scr.set(tx + i, ty + j, vb); }
};

// =================================================================== sc 18 · the Orb arrives
L.add('v31-18.00', {
  st: 'ARRIVAL (v3.1) · rooms/darkroom-act3 drawDarkA3 (Act Four\'s dark plate: the desk, the rack\'s blinking LEDs, the cyan key, the glass, the two old marks; MAS at the desk watching; the faded outline of a sphere on the wall, empty) with the monitor lit: kits/monitor-v31 lobbyPainter\'s mini, the landlord\'s slate lobby, its sound low; v3.2 (8.1, "framed legibly"): the cut-in to kits/monitor-v32 drawTallyECU, the desk top close in the monitor\'s light, the two faint old marks (the third comes in Act Four)',
  enter: {kind: 'dip', frames: 8},
  draw: (fb, k, sh, f) => {
    if (k >= 44) { M32.drawTallyECU(fb, f, {n: 2}); shiftRoom(fb, -Math.min(4, Math.floor((k - 44) / 8))); return; } // a whole-pixel drift along the marks
    A3.drawDarkA3(fb, f, {orb: null, outline: true, mas: {arm: 'rest', look: -1}, plate: {screen: lobbyPainter({key: 0, kram: 0, caption: true, chip: true, f})}});
  },
});
L.add('v31-18.00b', {
  st: 'kits/monitor-v31 lobbyPainter {keyLarge} [POV] (v3.1; v3.2: the V.O. "thirteen." cut, so the POV sits at its own height): MACROSOFT WELCOMES ATEM · JUL 18 on the news: TASYA (lip-synced on "Everyone is welcome.": the take\'s visemes laid over the painter\'s portrait) hangs a thirteenth key, Atem blue, on his ring in held steps, and it hangs LARGE on "welcome" (8.1); KRAM (mute, OPEN SOURCE on the hoodie) steps into the lobby, and his first-appearance plate comes up: KRAM · RUNS ATEM (one relation word)',
  face: {TASYA: 'lip'},
  marks: {line: ['on', 'v31-a3-0001', 0], hang: ['w', 'v31-a3-0001', 'welcome', 0]},
  draw: (fb, k, sh, f) => {
    const line = mk(sh, 'line', 57), hang = mk(sh, 'hang', 74);
    const key = (k < 22 ? 0 : k < hang ? 1 : 2) as 0 | 1 | 2;
    const kram = (k < 10 ? 0 : k < line - 6 ? 1 : 2) as 0 | 1 | 2;
    MON.drawMonitorPOV(fb, f, withTasyaMouth(lobbyPainter({key, kram, caption: true, chip: true, f, keyLarge: true}), mouth(sh, k, 'TASYA')));
    namePlate(fb, k - 14, 'KRAM · RUNS ATEM', 304, 16, PAL.G6);
  },
});
L.add('18.01', {
  st: 'rooms/darkroom-act3 drawDarkA3 (v3.1: back on the room, the arrival now v31-18.00; the lobby still on the monitor): the whir pre-laps the cut and the drive slot slides out the COINWORLD box like a tray in four held steps, landing on the thunk; Mas turns to it',
  marks: {whir: ['snd', 'synth:slot_whir', 1, 0], land: ['snd', 'landing_thunk', 1, 0]},
  draw: (fb, k, sh, f) => {
    const w = mk(sh, 'whir', 59), land = mk(sh, 'land', 89);
    const pos = stepOf(k, [w, w + 9, w + 18, land - 3]) as 0 | 1 | 2 | 3 | 4;
    A3.drawDarkA3(fb, f, {orb: null, outline: true, box: pos ? {pos} : null, mas: {arm: 'rest', look: k >= w + 8 ? 1 : -1}, plate: {screen: lobbyPainter({key: 2, kram: 2, caption: true, chip: true, f})}});
  },
});
L.add('18.02', {
  st: 'rooms/darkroom-act3 drawLabelECU [ECU]: the box\'s label, legible (FROM: COINWORLD · PROOF YOU\'RE HUMAN / SHIP TO: MAS MANALT, CO-FOUNDER); his fingertips come to the lid in two held steps; the rack\'s LEDs blink beyond it (v3.2: the V.O. is cut, so the label plays in full, no dark strip)',
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

// =================================================================== sc 19 · the hands runner
L.add('19.01', {
  st: 'rooms/darkroom-act3 drawDarkA3 (later: the box gone): the Orb at home in its outline, its iris flicking from him to the monitor (SIRRAH\'s lectern small on it: kits/monitor-v31 sirrahPainter\'s mini); Mas watching the monitor',
  draw: (fb, k, sh, f) => { A3.drawDarkA3(fb, f, {orb: {at: 'home', look: k < 12 ? HOME.face : HOME.monitor}, outline: 'filled', mas: {look: -1}, plate: {screen: sirrahPainter({typed: 0})}}); },
});
L.add('v31-19.02', {
  st: 'kits/monitor-v31 sirrahPainter [POV] (v3.1): JUL 12, SIRRAH at a lectern, the A and I blocks waist-high, talking on the news (a silent mouth: no words reach us); the chyron types on and holds to read',
  draw: (fb, k, sh, f) => { MON.drawMonitorPOV(fb, f, sirrahPainter({typed: Math.max(0, (k - 4) * 3), mouth: silentLip(k)})); },
});
const RUN = {pinky: 46, forum: 100};
L.add('v31-19.03', {
  st: 'rooms/darkroom-v31 drawDark2SSCR (v3.1, the hands runner: ONE held room frame, the monitor large at frame right, Mas and the Orb at the desk): the letters item carried on (sirrahPainter); Mas holds up two fingers to the Orb and it whirrs (the first servo); the monitor changes to JUL 21, NEDIB unrolling the PINKY PROMISE (kits/monitor-v31 runnerPainter, the unroll in held steps), Mas\'s pinky up, the Orb rotates (the third servo); SEP 13, the forum, REMUHCS asks the room; Mas\'s hand is already up before every hand goes up on "raised" (NOLE\'s highest); the Orb rises one pixel; v3.2 (the V.O. cut, its job an action): after NOLE\'s "referee" he lowers his hand himself and turns straight to his keys, head down',
  marks: {o1: ['snd', 'orb_servo', 1, 0], o3: ['snd', 'orb_servo', 3, 0], raised: ['w', 'e1-a3-19-01', 'raised', 0], nole: ['end', 'e1-a3-19-02', 0]},
  draw: (fb, k, sh, f) => {
    const o1 = mk(sh, 'o1', 19), o3 = mk(sh, 'o3', 72), up = mk(sh, 'raised', 129), nole = mk(sh, 'nole', 222);
    const low = nole + 3, keys = nole + 11;
    let screen: Painter, hand: 'two' | 'pinky' | 'up' | 'lower' | null = null, mode: 'whirr' | 'rotate' | 'rise' | 'look' = 'look';
    if (k < RUN.pinky) { screen = sirrahPainter({typed: 999}); if (k >= o1 - 8) hand = 'two'; if (k >= o1 && k < o1 + 24) mode = 'whirr'; }
    else if (k < RUN.forum) { screen = runnerPainter({item: 'pinky', unroll: heldLerp(k, RUN.pinky, RUN.pinky + 18, 20, 100, 3) / 100}); if (k >= RUN.pinky + 12) hand = 'pinky'; if (k >= o3 && k < o3 + 24) mode = 'rotate'; }
    else { screen = runnerPainter({item: 'forum', hands: k >= up ? 1 : 0}); if (k >= up - 14 && k < keys) hand = k >= low ? 'lower' : 'up'; if (k >= up && k < up + 30) mode = 'rise'; }
    drawDark2SSCR(fb, f, {screen, hand, orb: {mode, look: k >= low ? SCR.face : undefined}, mas: k >= keys ? {head: 'down', look: 0} : {look: 1}});
  },
});

// =================================================================== sc 20 · the post, and the call
L.add('20.01', {
  st: 'kits/mas-monitor drawMonitorOTS + kits/tidder tidderPainter [OTS]: over his shoulder, the TIDDER reply box; he types, in source casing, on the keys',
  marks: {keys: ['snd', 'synth:keys', 1, 0]},
  draw: (fb, k, sh, f) => { const kk = mk(sh, 'keys', 12) + 2; MON.drawMonitorOTS(fb, f, tidderPainter({phase: 'typing', typed: Math.floor(clamp((k - kk) * 0.62, 0, TIDDER_POST.length))})); },
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
  st: 'rooms/darkroom-v31 drawDark2SSCR (v3.1): he reads on, the paper big and soft on the monitor (p. 30); the Orb turns from the page to him and reads him; v3.2 (8.1): kits/monitor-v32 withTabs: he closes the paper\'s tab (its x lit) and the next tab is the president\'s order, live (eoPainter)',
  draw: (fb, k, sh, f) => {
    const close = 14;
    const screen = k < close + 3
      ? M32.withTabs(paperPainter({page: 'p30', thumb: 1}), {tabs: ['DECODING INTENTIONS.pdf', 'LIVE · THE ORDER'], active: 0, closing: k >= close ? 0 : null})
      : M32.withTabs(eoPainter({copies: 0, pen: 'raised', egg: false}), {tabs: ['LIVE · THE ORDER'], active: 0});
    drawDark2SSCR(fb, f, {screen, orb: {mode: 'look', look: k < 8 ? SCR.monitor : SCR.face}, mas: {look: 1}});
  },
});

// =================================================================== sc 21 · the order, on the monitor
L.add('21.02', {
  st: 'kits/eo-signing eoPainter [POV]: NEDIB, pen raised, over an order off both ends of a very big desk (lip-sync); v3.1: ONE cut-paper copy pops up behind the desk on the pop (3 held steps) and speaks (lip-sync); no bezel egg (Neleh\'s paper had its own beat); 21.03 merged: the real one turns to look at it, "When the hell did I say that?", and the stat row updates on the chip: SEEN 1',
  face: {NEDIB: 'lip', DEEPFAKE: 'lip'},
  marks: {p1: ['snd', 'tower_pop', 1, 0], turn: ['beat', '21.03', 0], stat: ['snd', 'post_click--chip', 1, 0]},
  draw: (fb, k, sh, f) => {
    const p1 = mk(sh, 'p1', 187), turn = mk(sh, 'turn', 254), stat = mk(sh, 'stat', 323);
    const copies = (k >= p1 ? 1 : 0) as 0 | 1;
    MON.drawMonitorPOV(fb, f, eoPainter({copies, pop: copies ? Math.floor((k - p1) / 3) : undefined, pen: 'raised', mouth: talk(mouth(sh, k, 'NEDIB'), 'smile'), copyMouth: talk(mouth(sh, k, 'DEEPFAKE'), 'smile'), turn: k >= turn, stat: k >= stat ? 1 : null, egg: false}));
  },
});
L.add('21.04', {
  st: 'rooms/darkroom-v31 drawDark2SSCR [2S·SCR] (v3.1: the monitor large, the two NEDIBs readable: eoPainter\'s short layout) with a slow whole-pixel drift in (1 px / 12 f toward the monitor): Mas glances back at the Orb, "which one\'s real?" (lip-sync), and back to the screen; the iris flicks from the copy to the real one on the servos and settles; its toast pops over him: verified: human (the callback to 18.05)',
  face: {MAS: 'lip'},
  marks: {ask: ['on', 'e1-a3-21-06', 0], o1: ['snd', 'orb_servo', 1, 0], o2: ['snd', 'orb_servo', 2, 0], o3: ['snd', 'orb_servo', 3, 0]},
  draw: (fb, k, sh, f) => {
    const ask = mk(sh, 'ask', 19), o3 = mk(sh, 'o3', 74);
    const o = stepOf(k, [mk(sh, 'o1', 55), mk(sh, 'o2', 65), o3]);
    const looks: Array<[number, number]> = [k >= ask + 12 ? SCR.face : SCR.monitor, [0.8, 0.12], [0.95, -0.05], [0.95, -0.05]];
    const glance = k >= ask - 4 && k < ask + 30;
    const toastK = k - (o3 + 4);
    drawDark2SSCR(fb, f, {screen: eoPainter({copies: 1, pen: 'raised', stat: 1}), orb: {mode: 'look', look: looks[o]}, mas: {look: glance ? -1 : 1, mouth: spoken(sh, k, 'MAS')},
      toasts: toastK >= 0 ? [{s: 'verified: human', k: toastK, x: DARK_SCR.screen.x + EO_SHORT.realX + 30, y: DARK_SCR.screen.y + 3}] : []});
    shiftRoom(fb, -Math.min(8, Math.floor(k / 12)));
  },
});
L.add('21.05', {
  st: 'kits/eo-signing eoPainter [POV]: the real NEDIB signs, in ink (the signature\'s strokes on 3s from the paper whip); the copy claps on the claps, and keeps clapping (v3.1: one copy, SEEN 1)',
  marks: {whip: ['snd', 'paper_whip', 1, 0], claps: ['snd', 'synth:claps', 1, 0]},
  draw: (fb, k, sh, f) => {
    const w = mk(sh, 'whip', 4);
    MON.drawMonitorPOV(fb, f, eoPainter({copies: 1, pen: 'sign', signK: clamp(Math.floor((k - w) / 3), 0, 5), clap: k >= mk(sh, 'claps', 19), stat: 1, egg: false}));
  },
});

L.add('v32-21.06', {
  st: 'v3.2, HIS MOVE (the switch): rooms/darkroom-v31 drawDark2SSCR {hand: \'switch\', off}: the deepfake still clapping on the big monitor; Mas leans over and reaches to the switch on the bezel\'s near corner; on the click the glass goes black in one step, its LED out; the clapping doesn\'t stop (it grows into the hall\'s applause, the next cut); the Orb looks from the black glass to him',
  marks: {click: ['snd', 'key_tap_space', 1, 0]},
  draw: (fb, k, sh, f) => {
    const c = mk(sh, 'click', 21);
    const off = k >= c;
    drawDark2SSCR(fb, f, {screen: eoPainter({copies: 1, pen: 'sign', signK: 5, clap: true, stat: 1, egg: false}), hand: k >= c - 12 && k < c + 10 ? 'switch' : null, off,
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
  st: 'v3.2, HIS MOVE (DevDay live; the home two-shot and the bezel are gone): kits/monitor-v32 drawDevDayFull [W]: the stage full frame, the applause carried over the cut; the launch-night odometer clunks up through the stage floor in three held steps on the ratchet to 100,000,000 / WEEK; Mas at the centre mark (room-scale mouth) begins "and today,"; the push: drawDevDayMCU [MCU], his face against the backdrop, lip-synced, "…you can build your own chatgtp."; back on the [W] as TASYA walks on from the right, laughing, arms open, the Sydney bubble on its chain behind him (he stops clear of the must-read figure); "so, how\'s the partnership going?" (room-scale), "We love you guys." (his laugh drawing on the take\'s syllables)',
  face: {MAS: 'lip', TASYA: 'room'},
  marks: {appl: ['snd', 'synth:applause', 1, 0], rat: ['snd', 'odometer_ratchet', 1, 0], land: ['snd', 'landing_thunk', 1, 0], push: ['w', 'v32-a3-0001', 'you', -3], back: ['end', 'v32-a3-0001', 0], tasya: ['on', 'e1-a3-22-01', -21]},
  draw: (fb, k, sh, f) => {
    const applEnd = mk(sh, 'appl', 24) + 82;
    const r = mk(sh, 'rat', 43), land = mk(sh, 'land', 104), push = mk(sh, 'push', 64), back = mk(sh, 'back', 120) + 4, t0 = mk(sh, 'tasya', 125);
    const mm = mouth(sh, k, 'MAS');
    if (k >= push && k < back) { M32.drawDevDayMCU(fb, f, {mas: {mouth: mm === 'smile' ? 'rest' : mm, look: 0}}); return; }
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
  st: 'v3.2, HIS MOVE (pausing the sign-ups; the record, his post\'s first sentence): kits/mas-monitor drawMonitorOTS + kits/monitor-v32 signupPainter [OTS]: a week later, over his shoulder, the CHATGTP Plus sign-up page, its counter\'s drums a smear on the fast ratchet (never a figure); beside him the rack\'s edge (drawRackSlice), its LEDs stepping green, amber, red, one step a beat (launch night\'s heat); he types his post in its box, and it goes up as a card on the post click; SIGN UP greys, then reads NOTIFY ME on the blink',
  marks: {spin: ['snd', 'synth:ratchet_fast', 1, 0], post: ['snd', 'post_click', 1, 0], grey: ['snd', 'glyph_blink', 1, 0]},
  draw: (fb, k, sh, f) => {
    const sp = mk(sh, 'spin', 7), post = mk(sh, 'post', 72), grey = mk(sh, 'grey', 93);
    const typed0 = sp + 20, n = M32.POST_PAUSE.text.length;
    const typed = k < typed0 ? null : Math.min(n, Math.floor((k - typed0) * n / Math.max(8, post - 6 - typed0)));
    const btn = (k < grey - 6 ? 0 : k < grey ? 1 : 2) as 0 | 1 | 2;
    MON.drawMonitorOTS(fb, f, M32.signupPainter({spin: k >= sp ? f : 0, btn, typed, post: k >= post ? k - post : null}));
    M32.drawRackSlice(fb, 432, stepOf(k, [sp + 16, sp + 40]) as 0 | 1 | 2, f);
  },
});

// =================================================================== sc 23 · catching up (THE CLOCK: one bar a shot)
L.add('23.01', {st: 'kits/monitor-items coldOpenPainter [POV] (art-a rooms/apec-stage, cropped 1:1): bar 1, the cold open\'s frame on the monitor; we\'ve caught up', draw: (fb, k, sh, f) => { MON.drawMonitorPOV(fb, f, coldOpenPainter()); }});
L.add('23.02', {
  st: 'kits/phone-high drawPhoneHigh (reminder) [HIGH]: bar 2, the invite he accepted on that stage is a reminder now, Board sync · Fri 12:00, the four circles; the Orb\'s iris steps along them, one a beat, and stops on the black square; v3.1: each circle shows its name on hover as the iris reaches it (ALYI, NELEH, MADA, THE QUIET VOTE); v3.2: each hover card carries the member\'s small call tile over the name (Mada\'s face under his spinner)',
  marks: {chip: ['snd', 'post_click--chip', 1, 0]},
  draw: (fb, k, sh, f) => { const n = Math.min(3, Math.floor(k / 15)) as 0 | 1 | 2 | 3; const lit = k >= mk(sh, 'chip', 3); drawPhoneHigh(fb, f, {screen: lit ? 'reminder' : 'dark', orb: ORB_CIRCLE_LOOKS[n], hover: lit ? n : null, avatars: true}); },
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
  review: {title: 'MR. MAS · EP1 · ACT THREE', subtitle: 'PIXEL v3.2 · LOCK act3 (THE v3.2 STICK LOCK)', durNote: 'AS THE STICK LOCK', soundLabel: 'SOUND · TEMP TRACK = THE v3.2 STICK MIX'},
});
