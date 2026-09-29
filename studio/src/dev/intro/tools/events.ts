// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// MR. MAS — intro-ep1: export every PICTURE event with its exact GLOBAL frame, as built.
//   npx esbuild src/dev/intro/tools/events.ts --bundle --platform=node --outfile=<scratch>/events.cjs \
//     --loader:.woff=empty --loader:.woff2=empty --loader:.css=empty
//   node <scratch>/events.cjs ../out/season/intro/picture/intro-events.json
// Frames come from the moments' own timeline constants wherever they are exported (imported below, so a retime in a
// moment re-flows here). Where a moment keeps a frame inline in its scene code, the value is copied and `src` names
// the file and symbol. `script` is SCRIPT.md v2.1's frame where the build differs (see studio/notes/intro.md).
import * as fs from 'fs';
import {FPS, BPM, FRAMES_PER_BEAT, FRAMES_PER_BAR, INTRO_FRAMES} from '../../../shared/timing';
import {EDL, HANDOFFS} from '../../../intro/edl';
import {SHOTS, EV, L1_KEYS, L2_KEYS, L2_BREAK} from '../../mcoldopen/timeline';
import {T as TE} from '../../meras/timeline';
import {FREEZE_G, FREEZE_A, worldClock as md1World} from '../../mdinner1/timeline';
import {T as T2, FREEZE_M, FREEZE_N, worldClock as md2World} from '../../mdinner2/timeline';
import {CUTS, ORDER, MOTIF, WINDOWS, THREAD_Y} from '../../mrollcall/timeline';
import {TOAST} from '../../mfinale/bookend';
import {T as TF, POPS, IRIS_GLYPH} from '../../mfinale/timeline';
import {gergKeycaps} from '../../../shared/pixel/cast/gerg';

type Ev = {f: number; end?: number; type: string; moment: string; what: string; src: string; script?: number | string; note?: string};
const E: Ev[] = [];
const add = (e: Ev) => E.push(e);
const TL = (m: string) => `studio/src/dev/${m}/timeline.ts`;
const SC = (m: string, file = 'scene.ts') => `studio/src/dev/${m}/${file}`;

// ------------------------------------------------------------------ the edit (EDL) and the four handoffs
for (const e of EDL) add({f: e.from, end: e.to, type: 'edit', moment: e.id, what: `${e.id} on screen f${e.from}-${e.to} (local 0 = f${e.origin}); in: ${e.cutIn}`, src: 'studio/src/intro/edl.ts EDL'});
const HOW: Record<string, string> = {
  'meras->mdinner1': 'match cut: the 2014 crown glint (84,95 native on f224) becomes the candelabra flame core (84,95 on f225); hard palette switch EARLY-WEB16 -> BASE on the cut',
  'mdinner1->mdinner2': 'edit on beat 6.4 inside the pixel-identical 345-359 overlap (both moments draw mdinner1\'s frame); 345 is also a HARD CUT of the camera from the ALYI framing to the vault (the lens-side candle wipe is cut)',
  'mdinner2->mrollcall': 'hard cut on the 9.1 downbeat (stab 1): NOPE AI key art -> TASYA window',
  'mrollcall->mfinale': 'hard cut on the 10.1 downbeat: the cursor window (held to 539, no pull-back) -> the dusk skyline; NopeAI stands, MACROSOFT pops',
};
for (const [k, f] of Object.entries(HANDOFFS)) add({f, type: 'handoff', moment: k.split('->')[1], what: `${k}: ${HOW[k]}`, src: 'studio/src/intro/edl.ts HANDOFFS'});
add({f: 719, type: 'loop', moment: 'mfinale', what: 'loop point: f719 black room, caret off (blink phase) -> f0 caret on in the cold-open macro', src: 'studio/src/intro/edl.ts', note: 'next frame is f0'});

// ------------------------------------------------------------------ mcoldopen (0-119)
SHOTS.forEach((s, i) => add({f: s.from, end: s.to, type: i === 0 ? 'shot' : 'cut', moment: 'mcoldopen', what: `shot ${s.id}: ${s.why}`, src: `${TL('mcoldopen')} SHOTS`}));
add({f: 0, end: 7, type: 'loop-cursor', moment: 'mcoldopen', what: 'cyan block caret ON (blink on 8 / off 7, beat-locked); loop entry', src: `${TL('mcoldopen')} caretOn`});
add({f: L1_KEYS[0], end: L1_KEYS[L1_KEYS.length - 1], type: 'text-type', moment: 'mcoldopen', what: `"near the singularity;" types (${L1_KEYS.length} keystrokes), 6 frames ahead of the VO`, src: `${TL('mcoldopen')} L1_KEYS`});
add({f: L2_BREAK, type: 'text-type', moment: 'mcoldopen', what: 'shift+enter: caret to line 2', src: `${TL('mcoldopen')} L2_BREAK`});
add({f: L2_KEYS[0], end: L2_KEYS[L2_KEYS.length - 1], type: 'text-type', moment: 'mcoldopen', what: `"unclear which side." types (${L2_KEYS.length} keystrokes), 7-8 frames ahead of the VO; line complete from ${L2_KEYS[L2_KEYS.length - 1] + 1}`, src: `${TL('mcoldopen')} L2_KEYS`});
add({f: EV.blink, type: 'acting', moment: 'mcoldopen', what: 'Mas blinks once while typing', src: `${TL('mcoldopen')} EV.blink`});
add({f: EV.tilt, type: 'acting', moment: 'mcoldopen', what: 'head tilt in the semicolon pause', src: `${TL('mcoldopen')} EV.tilt`});
add({f: EV.dotSlide[0], end: EV.dotSlide[1], type: 'chart', moment: 'mcoldopen', what: '"you are here" dot climbs the curve', src: `${TL('mcoldopen')} EV.dotSlide`});
add({f: EV.dotExit, type: 'chart', moment: 'mcoldopen', what: 'dot leaves the top of the screen (pluck)', src: `${TL('mcoldopen')} EV.dotExit`, script: 89});
add({f: EV.eyeSnap, type: 'acting', moment: 'mcoldopen', what: 'eyes snap to the lens (near-front head drawing, held through Post)', src: `${TL('mcoldopen')} EV.eyeSnap`});
add({f: EV.irisTurn, end: EV.irisTurn + 1, type: 'orb', moment: 'mcoldopen', what: 'Orb iris swivels to the lens (servo)', src: `${TL('mcoldopen')} EV.irisTurn`, script: '97-99'});
add({f: EV.scan[0], end: EV.scan[1], type: 'scan-cone', moment: 'mcoldopen', what: 'Orb scan fan (thin cyan cone) opens f99 and sweeps (wide cutaway 99-104)', src: `${TL('mcoldopen')} EV.scan / scene.ts FAN`});
add({f: EV.glyph[0], end: EV.glyph[1], type: 'glyph', moment: 'mcoldopen', what: 'GLYPH-MASKED data-center cathedral inside the cone only (S1: 5 frames of the 15-frame GLYPH budget)', src: `${TL('mcoldopen')} EV.glyph / scene.ts switch`});
add({f: EV.pointer[0], end: EV.pointer[1], type: 'acting', moment: 'mcoldopen', what: 'mouse pointer travels to Post (on 2s)', src: `${TL('mcoldopen')} EV.pointer`});
add({f: EV.smile, type: 'acting', moment: 'mcoldopen', what: 'the one-pixel smile', src: `${TL('mcoldopen')} EV.smile`});
add({f: EV.click, type: 'ui', moment: 'mcoldopen', what: 'click on Post (button inverts)', src: `${TL('mcoldopen')} EV.click`});
add({f: EV.chips[0], end: EV.chips[1], type: 'tokens', moment: 'mcoldopen', what: 'the line bursts into token chips (pixel font 1x/2x/3x)', src: `${TL('mcoldopen')} EV.chips`, script: '113-117'});
add({f: EV.chartSnap, type: 'chart', moment: 'mcoldopen', what: 'the curve snaps vertical', src: `${TL('mcoldopen')} EV.chartSnap`, script: 114});
add({f: 114, end: 117, type: 'fade', moment: 'mcoldopen', what: 'exposure steps + ordered dither toward paper white', src: `${SC('mcoldopen')} EXPOSE_FROM/EXPOSURE`, script: '116-119'});
add({f: EV.white[0], end: EV.white[1], type: 'style', moment: 'mcoldopen', what: '1-BIT paper #E9E6DA full frame (79% luminance), white-to-white into 1993', src: `${TL('mcoldopen')} EV.white`});

// ------------------------------------------------------------------ meras (120-224 on screen)
add({f: TE.y93, type: 'cut', moment: 'meras', what: 'hard cut: 1993, 1-BIT, 3:2 pillarbox, animated on fours', src: `${TL('meras')} T.y93`});
add({f: TE.y93, end: TE.fire + TE.frontFrames - 1, type: 'date-card', moment: 'meras', what: 'ON SCREEN "1993" (shared era stamp, bottom-left inside the pillarbox; rule grows 8 px/frame) until the render front wipes it', src: `studio/src/dev/meras/era1993.ts slate93`, script: '120-134'});
add({f: TE.eyes, type: 'acting', moment: 'meras', what: 'kid\'s eyes go to the lens', src: `${TL('meras')} T.eyes`});
add({f: TE.turn, type: 'acting', moment: 'meras', what: 'head follows: the stare (match on f94)', src: `${TL('meras')} T.turn`, script: 128});
add({f: TE.freeze, end: TE.freeze + 1, type: 'ui', moment: 'meras', what: 'world holds; zoom rectangles expand from the screen', src: `${TL('meras')} T.freeze / era1993.ts zoomRects`});
add({f: TE.dialog, type: 'ui', moment: 'meras', what: 'alert dialog fully open: "MAS MANALT / no equity.", Cancel greyed (original dialog: dithered title bar)', src: `${TL('meras')} T.dialog`});
add({f: TE.ptrIn, end: TE.cancel - 1, type: 'ui', moment: 'meras', what: 'a stranger\'s pointer slides in from frame-right', src: `${TL('meras')} T.ptrIn`});
add({f: TE.cancel, type: 'ui', moment: 'meras', what: 'stranger clicks Cancel: nothing happens', src: `${TL('meras')} T.cancel`});
add({f: TE.ok, type: 'ui', moment: 'meras', what: 'kid clicks OK (OK inverts one frame)', src: `${TL('meras')} T.ok`});
add({f: TE.collapse, end: TE.collapse + 1, type: 'ui', moment: 'meras', what: 'dialog collapses into the staircase tip', src: `${TL('meras')} T.collapse`});
add({f: TE.fire, end: TE.fire + TE.frontFrames - 1, type: 'render-front', moment: 'meras', what: 'RENDER FRONT (cyan 1-px core, 5-px glow, spark on the curve) sweeps L->R: 1-BIT -> EARLY-WEB16; pillarbox retracts to 16:9; TPOOL keynote revealed', src: `${TL('meras')} T.fire/T.frontFrames, scene.ts drawFront93to08`});
add({f: TE.y08, end: TE.y14 - 1, type: 'date-card', moment: 'meras', what: 'ON SCREEN "2008" (shared era stamp; the camcorder OSD is cut)', src: 'studio/src/dev/meras/era2008.ts osd -> eraStamp'});
add({f: TE.y08, type: 'collar-pop', moment: 'meras', what: 'collar pop 1: the green outer polo collar stands (1-px hop)', src: `${TL('meras')} T.y08 / era2008.ts collars`});
add({f: 182, type: 'acting', moment: 'meras', what: 'THE SLEEVE tosses the clicker', src: 'studio/src/dev/meras/era2008.ts TOSS'});
add({f: TE.pop2, type: 'collar-pop', moment: 'meras', what: 'collar pop 2: both collars popped (on the hook\'s swung F)', src: `${TL('meras')} T.pop2`});
add({f: TE.take, type: 'acting', moment: 'meras', what: 'Mas catches the clicker', src: `${TL('meras')} T.take`});
add({f: TE.y14, type: 'cut', moment: 'meras', what: 'hard cut on the f195 brass stab: 2014 WHY COMBINATOR, EARLY-WEB16 (sign: flat #FF7F2A letters on a #F3EEDC cream plate, 1-px #000033 outline)', src: `${TL('meras')} T.y14`});
add({f: TE.y14, end: TE.whip - 1, type: 'date-card', moment: 'meras', what: 'ON SCREEN "2014" (shared era stamp)', src: 'studio/src/dev/meras/era2014.ts eraStamp'});
add({f: TE.repop, type: 'collar-pop', moment: 'meras', what: 'collar re-pop out of the hoodie (1-px hop)', src: `${TL('meras')} T.repop`});
add({f: TE.crownGo, end: TE.crownLand, type: 'prop', moment: 'meras', what: 'LUAP\'s paper crown hops down the dotted motion path', src: `${TL('meras')} T.crownGo/T.crownLand`, script: '205-220'});
add({f: TE.seat, type: 'acting', moment: 'meras', what: 'Mas lands on the laptop throne', src: `${TL('meras')} T.seat`});
add({f: TE.crownLand, type: 'prop', moment: 'meras', what: 'crown lands on Mas\'s head', src: `${TL('meras')} T.crownLand`, script: 220});
add({f: TE.glint, type: 'prop', moment: 'meras', what: 'the crown glint grows (the match-cut object)', src: `${TL('meras')} T.glint`});
add({f: 220, end: TE.whip - 1, type: 'camera', moment: 'meras', what: 'whip pan (ease-in, highlight smear) landing the glint on native (84,95) at f224', src: 'studio/src/dev/meras/era2014.ts panAt/HANDOFF'});

// ------------------------------------------------------------------ mdinner1 (225-344 on screen)
add({f: 225, type: 'style', moment: 'mdinner1', what: 'EARLY-WEB16 -> BASE hard switch on the cut (no second render front)', src: `${SC('mdinner1')} (225 comment)`, script: 'front 225-229'});
add({f: 225, end: 229, type: 'camera', moment: 'mdinner1', what: 'camera LOCKED on the candelabra: the flame holds the glint\'s screen position for 5 frames (no whip)', src: `${TL('mdinner1')} MATCH_HOLD`});
add({f: 230, type: 'cut', moment: 'mdinner1', what: 'hard cut to the GERG framing (Gerg typing, Mas at the head of the table)', src: `${TL('mdinner1')} camRaw`, script: 'CAM locked x=0 225-239'});
add({f: 230, end: 239, type: 'camera', moment: 'mdinner1', what: 'slow truck to the GERG framing (x 181 -> 195)', src: `${TL('mdinner1')} camRaw`});
add({f: 230, end: 247, type: 'date-card', moment: 'mdinner1', what: 'ON SCREEN "2015" (shared era stamp, UI layer; holds over the Gerg print)', src: `${SC('mdinner1')} after()`});
add({f: 226, type: 'keycap-pop', moment: 'mdinner1', what: 'the CTRL keycap pops (world clock 226) and hangs at its apex through the freeze', src: 'studio/src/dev/mdinner1/props.ts ctrlFlight'});
add({f: 232, type: 'prop', moment: 'mdinner1', what: 'Gerg\'s napkin sketch becomes a live website', src: `${SC('mdinner1')} drawNapkin(w >= 232)`});
// Gerg's popcorn keycaps: launch world-frames from cast/gerg.ts gergKeycaps(w, {from: 214, rate: 2, max: 48}), mapped to global frames
{
  const launches: number[] = [];
  let prev = 0;
  for (let w = 214; w < 400; w++) { const n = gergKeycaps(w, {from: 214, rate: 2, max: 48}).length; for (let k = prev; k < n; k++) launches.push(w); prev = n; }
  const worldAt = (g: number) => (g < 345 ? md1World(g) : md2World(g));
  const global: number[] = [];
  for (let g = 225; g <= 479; g++) {
    const w = worldAt(g), wp = worldAt(g - 1);
    if (w === wp) continue; // frozen frame: nothing launches
    for (const L of launches) if (L === w) global.push(g);
  }
  const shown = [...new Set(global)];
  add({f: shown[0], end: shown[shown.length - 1], type: 'keycap-pop', moment: 'mdinner1', what: `Gerg\'s popcorn keycaps: ${shown.length} launch frames on screen (world clock stops in the freezes). Launch frames: ${shown.join(',')}`, src: 'studio/src/shared/pixel/cast/gerg.ts gergKeycaps(w,{from:214,rate:2,max:48}) via mdinner1/mdinner2 worldClock', note: `${launches.filter((L) => L < 225).length} launches (w214-224) happen before the cut and are already airborne at f225; 48 in all`});
  add({f: 240, end: 254, type: 'keycap-pop', moment: 'mdinner1', what: 'keycaps frozen mid-air (GERG print)', src: `${TL('mdinner1')} FREEZE_G`});
}
const freezeEv = (who: string, m: string, fz: {t0: number; t1: number}, card: [number, number], cardHow: string, src: string, script: {freeze: string; card: string}) => {
  add({f: fz.t0, type: 'freeze', moment: m, what: `${who} FREEZE: the world prints (cream paper + ${who} ink); Mas, his pickups and the UI stay live`, src, script: script.freeze});
  add({f: fz.t0, end: fz.t0 + 1, type: 'flash-print', moment: m, what: `${who} flash-print (the print nearly all paper, 2 frames) + 2-px drop kick ${fz.t0}-${fz.t0 + 2}`, src: `${src} / freeze.ts freezePop`});
  add({f: fz.t1, type: 'unfreeze', moment: m, what: `${who} unfreeze: the room runs again under the card`, src, script: script.freeze});
  add({f: card[0], end: card[1], type: 'card', moment: m, what: `${who} name card: ${cardHow}`, src: `${src} / studio/src/shared/pixel/freeze.ts founderCard (plate k3, rule k4, tagline k5+ at 2 ch/f)`, script: script.card});
};
freezeEv('GERG', 'mdinner1', FREEZE_G, [FREEZE_G.t0, 290], 'portrait window opens in 3 steps (240-242), name k3 (243), rule 244, tagline types from 245, fine print SLEEP: DEPRECATED from 254; holds over the live room; carried off by the 285 truck (285-290)', `${TL('mdinner1')} FREEZE_G`, {freeze: 'freeze 240-284 (card close)', card: '240-284'});
add({f: 248, type: 'gag', moment: 'mdinner1', what: 'Mas plucks the frozen CTRL keycap (it takes his colour); pockets it 254-256', src: `${SC('mdinner1')} masAt`, script: '270-282 (pluck 274)'});
add({f: 259, end: 261, type: 'acting', moment: 'mdinner1', what: 'the one-pixel smile', src: `${SC('mdinner1')} masAt`});
add({f: 266, type: 'acting', moment: 'mdinner1', what: 'GERG portrait blinks once', src: 'studio/src/dev/mdinner1/cards.ts'});
add({f: 285, end: 298, type: 'camera', moment: 'mdinner1', what: 'truck right to ALYI (x 196 -> 330) + tilt up 290-298', src: `${TL('mdinner1')} camRaw`});
add({f: 285, end: 288, type: 'set', moment: 'mdinner1', what: 'rack LEDs ripple on; the nave opens in 3 held steps (286-288)', src: 'studio/src/dev/mdinner1/cathedral.ts cathAt'});
add({f: 287, end: 299, type: 'acting', moment: 'mdinner1', what: 'ALYI rises STILL SEATED in his dinner chair (the chair lifts with him, napkin in lap), 2 -> 22 px on 2s', src: `${SC('mdinner1')} liftAt / cast/alyi.ts alyiChairLift`, script: '288-299, 1 px every 2 frames'});
add({f: 289, end: 291, type: 'prop', moment: 'mdinner1', what: 'the paperclip effigy raises its own UNALIGNED sign', src: `${SC('mdinner1')} effArms`});
add({f: 290, type: 'prop', moment: 'mdinner1', what: 'the effigy ignites (flame whoomph)', src: `${SC('mdinner1')} IGNITE`});
freezeEv('ALYI', 'mdinner1', FREEZE_A, [FREEZE_A.t0, FREEZE_A.card + 1], 'stained-glass lancet drops in 4 held drawings (300-303, 3-px overshoot), name 303, tagline from 305, fine print PRODUCTS: 0 · EFFIGIES: 1 from 314; token eyes from 315; the world stays frozen through the marshmallow gag; closes in 2 steps on the thaw (340-341, back up)', `${TL('mdinner1')} FREEZE_A`, {freeze: 'freeze 300-339 (card close 340-341)', card: '300-341'});
add({f: 315, type: 'card', moment: 'mdinner1', what: 'ALYI portrait eyes open as scrolling token streams (BASE ticks, not a GLYPH switch)', src: `${SC('mdinner1')} after() eyes`});
add({f: 324, end: 339, type: 'gag', moment: 'mdinner1', what: 'Mas\'s telescoping fork (324-327), toasts a marshmallow on the FROZEN effigy fire (it toasts it anyway: 328-335, 3 palette steps), bite 336-339', src: `${SC('mdinner1')} masAt seq`, script: '328-339 (steps 330/334/338, blow 339)'});

// ------------------------------------------------------------------ mdinner2 (345-479)
add({f: T2.vault, end: 352, type: 'set', moment: 'mdinner2', what: 'vault blast door swings open (held drawings 345/347/349), beacons, steam', src: `${TL('mdinner2')} T.vault / scene.ts vaultAt`});
for (const [k, f] of [['1', T2.tick1], ['2', T2.tick2], ['3', T2.tick3]] as const) add({f, type: 'hud', moment: 'mdinner2', what: `RED-TEAMED HUD tick ${k}`, src: `${TL('mdinner2')} T.tick${k}`});
add({f: T2.vault, type: 'cut', moment: 'mdinner2', what: 'hard cut: the ALYI framing -> the vault framing (camera x 330 -> 606)', src: 'studio/src/dev/mdinner1/timeline.ts camRaw'});
add({f: T2.marioOut, type: 'acting', moment: 'mdinner2', what: 'MARIO steps out of the vault', src: `${TL('mdinner2')} T.marioOut`, script: 352});
add({f: T2.finger, type: 'acting', moment: 'mdinner2', what: 'MARIO raises a finger', src: `${TL('mdinner2')} T.finger`, script: 352});
freezeEv('MARIO', 'mdinner2', FREEZE_M, [FREEZE_M.t0, T2.marioClose + 1], 'rises from below in 3 held drawings (360-362), name 363, tagline 365-, live WORD COUNT fine print 366-374; holds over the room and over the 390 cut (UI layer); closes in 2 steps 403-404', `${TL('mdinner2')} FREEZE_M`, {freeze: 'freeze 360-402 (card close 403-404)', card: '360-404'});
add({f: T2.marioLive, end: 389, type: 'prop', moment: 'mdinner2', what: 'Mario\'s essay scroll drops from his hand and races down the cloth to Mas (off frame-left ~386)', src: `${TL('mdinner2')} T.marioLive`, script: '378-389 (off the card)'});
add({f: T2.cut, type: 'cut', moment: 'mdinner2', what: 'hard cut to the telescope framing (camera x 606 -> 340; no whip)', src: `${TL('mdinner2')} T.cut / scene.ts camRaw`});
add({f: T2.grab, type: 'gag', moment: 'mdinner2', what: 'Mas takes the scroll\'s tail (takes his colour); rolls it 391-394', src: `${TL('mdinner2')} T.grab`});
add({f: T2.telescope, end: 406, type: 'gag', moment: 'mdinner2', what: 'paper telescope to the eye, aimed at the ceiling', src: `${TL('mdinner2')} T.telescope`, script: '394-402'});
add({f: T2.burst, type: 'booster', moment: 'mdinner2', what: 'ceiling bursts (panel cracks 405, hole 406+, plaster dust 405-411, pendant falls 406-411)', src: `${TL('mdinner2')} T.burst / booster.ts`});
add({f: 405, end: 419, type: 'camera', moment: 'mdinner2', what: 'tilt up past the crown then ride the booster down (y -6..-26..14); 1-px seeded rumble 409-419', src: `${SC('mdinner2')} camRaw/camera`, script: 'tilt 405-409, down 410-419, 3-px shake 414-419'});
add({f: T2.signIn, end: 424, type: 'prop', moment: 'mdinner2', what: 'OPEN AI neon swings in on its chains (lit from 411)', src: `${TL('mdinner2')} T.signIn / scene.ts signAt`, script: '405-411'});
add({f: 412, end: FREEZE_N.t1 + 4, type: 'prop', moment: 'mdinner2', what: `every glass sloshes except Mas's (frozen mid-slosh ${FREEZE_N.t0}-${FREEZE_N.t1 - 1}, settles ${FREEZE_N.t1}-${FREEZE_N.t1 + 4})`, src: `${SC('mdinner2')} slosh`});
add({f: T2.hatch, type: 'booster', moment: 'mdinner2', what: 'hatch opens; NOLE leans out with the check 416-419', src: `${TL('mdinner2')} T.hatch`});
add({f: T2.touchdown, type: 'booster-touchdown', moment: 'mdinner2', what: 'SPACEZ booster touchdown (legs squat, basket crushed, smoke)', src: `${TL('mdinner2')} T.touchdown / booster.ts`});
freezeEv('NOLE', 'mdinner2', FREEZE_N, [FREEZE_N.t0, T2.touch - 1], 'slams down from above in 4 held drawings (420-423), name 423, tagline 425-; closes into the place cards on the thaw (465)', `${TL('mdinner2')} FREEZE_N`, {freeze: 'freeze 420-464', card: '420-466'});
add({f: T2.stamp, type: 'stamp', moment: 'mdinner2', what: 'ON SCREEN "SUED OVER IT." rubber stamp lands (card k15)', src: `${TL('mdinner2')} T.stamp / cards.ts kStamp 15`});
add({f: T2.sip, end: T2.stand - 1, type: 'gag', moment: 'mdinner2', what: 'inside the Nole freeze: Mas sips his water (lift 450, sip 451-453, lower 454); his water line never moves, every other glass frozen mid-slosh', src: `${TL('mdinner2')} T.sip / scene.ts masAt2`, script: '450-455'});
add({f: T2.stand, type: 'acting', moment: 'mdinner2', what: 'Mas stands (half-stand drawing), glass in his other hand', src: `${TL('mdinner2')} T.stand`});
add({f: T2.nLift, end: T2.nClunk, type: 'n-move', moment: 'mdinner2', what: 'while time is stopped: the N comes off its hook (456, it takes his colour), rides behind O-P-E along the rail (457-463) and clunks into place (464): the frozen sign reads NOPE AI, its N in colour', src: `${TL('mdinner2')} T.nLift/T.nClunk / scene.ts signAt`});
add({f: T2.aiOn, type: 'neon', moment: 'mdinner2', what: 'the room thaws on the beat and the sign relights in ONE step: NOPE AI in full colour (no flicker), neon spill on the room', src: `${TL('mdinner2')} T.aiOn / scene.ts signAt`});
add({f: T2.touch, end: T2.touch + 1, type: 'card', moment: 'mdinner2', what: 'Nole\'s card closes into the place cards (GERG, ALYI, MARIO (JOINS 2016), NOLE; hop 465-466)', src: `${TL('mdinner2')} T.touch`});
add({f: T2.founding, end: 478, type: 'camera', moment: 'mdinner2', what: 'the founding: camera trucks to the sign and cranes up 6 px (465-478)', src: `${TL('mdinner2')} T.founding / scene.ts camRaw`});
add({f: T2.aiOn, end: 479, type: 'key-art', moment: 'mdinner2', what: 'KEY ART: NOPE AI over the founders\' place cards, Mas standing in colour, glass in hand', src: `${SC('mdinner2')}`});

// ------------------------------------------------------------------ mrollcall (480-539)
const ACT: Record<string, string> = {
  tasya: 'TASYA jangles a giant key ring (2 drawings on 2s)', radnus: 'RADNUS: polite smile under a turning code-red siren (4 lamp drawings; the red stays inside the sprite)', kram: 'KRAM offers a soup thermos with a check floating in it',
  nesnej: 'NESNEJ tosses a GPU (leaves the hand k2)', rima: 'RIMA TAMURI steps into a spotlight (house dark k0, light SNAPS on k1, on her mark k2+)', whale: 'THE WHALE breaches on a budget (snout k0-1, half out k2-3, apex k4-7)',
  rumpt: 'RUMPT, silhouette only (plain head, square shoulders, the tie over the lip) at a plain fluted gold podium; the point (under 15 degrees) snaps out k1; plate blank', cursor: 'the player who doesn\'t exist yet: GLYPH-MASKED blinking cursor (on k0-3, off k4-5, on k6-7)',
};
CUTS.forEach((f, n) => add({f, end: (n < 7 ? CUTS[n + 1] : 540) - 1, type: n === 0 ? 'cut' : 'rollcall-cut', moment: 'mrollcall', what: `flash ${n + 1} (${MOTIF[n].note}): ${ACT[ORDER[n]]}; 112x136 window at (${WINDOWS[n].x}, ${WINDOWS[n].y}) on the thread at y ${THREAD_Y[n]}`, src: `${TL('mrollcall')} CUTS (floor(480 + 7.5n)) / WINDOWS`}));
add({f: 480, end: 539, type: 'thread', moment: 'mrollcall', what: 'one steady dusk surround (never changes across the cuts) and the cyan thread drawn on it left to right with the windows: flat y 236 under flashes 1-4, stairs 220/196/164/128, off the top at x 470 (whole knee up by f532)', src: `${TL('mrollcall')} THREAD / scene.ts drawThread`});
add({f: CUTS[7], end: 539, type: 'glyph', moment: 'mrollcall', what: 'GLYPH-MASKED cursor window (S6), held to 539 (hard cut to the skyline, no pull-back)', src: `${TL('mrollcall')} CUTS[7]`});

// ------------------------------------------------------------------ mfinale (540-719)
add({f: TF.sky, type: 'cut', moment: 'mfinale', what: 'hard cut: the dusk skyline; NOPEAI stands at centre', src: `${TL('mfinale')} T.sky`});
const POPNAME: Array<[string, number, string]> = [
  ['MACROSOFT', POPS.macrosoft, 'TASYA on the roof (keys)'], ['ELGOOG (+ MINDDEEP annex +1)', POPS.elgoog, 'RADNUS under the CODE RED siren, SIMED'], ['ATEM', POPS.atem, 'KRAM with the thermos; METAVERSE billboard'],
  ['INVIDIA', POPS.invidia, 'NESNEJ; GPU tosses from 587 (they pile up red-hot and keep their shape)'], ['MISANTHROPIC + zAI (double pop)', POPS.misanthropic, 'MARIO + ADELINA (price tag blank); NOLE'], ['PEEKDEEP (budget)', POPS.peekdeep, 'the whale\'s fin'],
];
for (const [name, f, who] of POPNAME) add({f, end: f + 3, type: 'tower-pop', moment: 'mfinale', what: `${name} pops (up out of the ground k0, 3-px overshoot k1, +1 k2, settled k3; dust k1-7): ${who}`, src: `${TL('mfinale')} POPS / skyline.ts popDy`});
add({f: TF.sky, end: TF.title - 1, type: 'prop', moment: 'mfinale', what: 'RIMA TAMURI on NopeAI\'s roof deck: her spotlight drifts (4 drawings on 8s: it swings onto her and drifts off)', src: 'studio/src/dev/mfinale/skyline.ts RIMA_DECK / rimaSpotDx'});
add({f: TF.sky, end: TF.book - 1, type: 'loop-cursor', moment: 'mfinale', what: 'the cursor (2x4 cyan) blinks on the tip of NopeAI\'s spire on the beat phase (the eighth player\'s rooftop)', src: 'studio/src/dev/mfinale/skyline.ts drawSpire tip'});
add({f: TF.line, end: TF.line + 7, type: 'roofline-ignite', moment: 'mfinale', what: 'every rooftop edge ignites into one cyan line: the fuse runs L->R (622-627), up the spire (628-629)', src: `${TL('mfinale')} T.line / skyline.ts ignition`});
add({f: TF.title, end: TF.title + 2, type: 'title-slam', moment: 'mfinale', what: 'TITLE SLAM "MR. MAS" in finished BASE chrome from 630 (no palette ladder; Orb period on the rose window hub, with a dark knock-out ring and N0 keyline); 3-px shake 630-632; rivals flinch; rose blazes 630-633', src: `${TL('mfinale')} T.title / title.ts SHAKE`});
add({f: TF.title, end: TF.book - 1, type: 'plates', moment: 'mfinale', what: 'the tower wordmarks clear of the title (ELGOOG, MINDDEEP, ATEM, INVIDIA, PEEKDEEP) stay: one light step down from 634', src: 'studio/src/dev/mfinale/title.ts drawTowerPlates'});
add({f: TF.subtitle, end: TF.subtitle + 7, type: 'text-type', moment: 'mfinale', what: 'subtitle "now in low-key research preview" types at 4 ch/frame (640-647)', src: `${TL('mfinale')} T.subtitle / title.ts titleAfter`});
add({f: 660, type: 'orb', moment: 'mfinale', what: 'Orb period catch-light glint (four-point, crosses its shoulder)', src: 'studio/src/dev/mfinale/title.ts drawOrb (tw = g - 660)'});
add({f: TF.book, end: TF.book + 1, type: 'cut', moment: 'mfinale', what: 'cut/pull back: the title is on Mas\'s monitor (bezel in from the frame edge, LCD rows) — the cold open\'s MEDIUM two-shot', src: `${TL('mfinale')} T.book / bookend.ts`, script: 'reverse angle behind his shoulder'});
add({f: TF.orbTurn, end: 704, type: 'acting', moment: 'mfinale', what: 'the room: Mas and the Orb watch the screen (replays cold-open f56-62); dusk-violet key light', src: `${TL('mfinale')} T.orbTurn / bookend.ts coldFrame`});
add({f: TF.last, type: 'ding', moment: 'mfinale', what: 'the last beat: Post (cold-open click drawing), eyes on the lens, one-pixel smile; the post flies up; key light back to cyan (SFX ding here)', src: `${TL('mfinale')} T.last`});
add({f: TOAST.from, end: TOAST.to, type: 'toast', moment: 'mfinale', what: `the Orb's toast [SLOT], a monitor notification: "${TOAST.text}" (Ep1), ${TOAST.from}-${TOAST.to}, holds through the dissolve (BLIP ORB: C7 chime at ${TOAST.from})`, src: 'studio/src/dev/mfinale/bookend.ts TOAST'});
add({f: IRIS_GLYPH.from, end: IRIS_GLYPH.from + IRIS_GLYPH.frames - 1, type: 'iris', moment: 'mfinale', what: 'Orb iris shows the skyline in GLYPH (S7), settles at 707', src: `${TL('mfinale')} IRIS_GLYPH`});
add({f: 707, end: 712, type: 'loop-cursor', moment: 'mfinale', what: 'composer empty again (the f0 state), caret ON at the cold-open home CARET_FRAME (beat phase: on 705-712; drawn from 707 once the post has flown)', src: 'studio/src/dev/mfinale/bookend.ts + mcoldopen caretOn'});
add({f: 712, end: 719, type: 'fade', moment: 'mfinale', what: 'the room dissolves to black on an ordered dither; caret OFF 713-719 (blink phase), ON again at f0: the loop', src: 'studio/src/dev/mfinale/bookend.ts FADE0', script: 'room steps down one light level at 716'});

// ------------------------------------------------------------------ the beat grid
const beats = Array.from({length: INTRO_FRAMES / FRAMES_PER_BEAT}, (_, i) => ({n: i + 1, f: i * FRAMES_PER_BEAT, bar: Math.floor(i / 4) + 1, beat: (i % 4) + 1}));

E.sort((a, b) => a.f - b.f || (a.end ?? a.f) - (b.end ?? b.f));
const out = {
  title: 'MR. MAS — intro-ep1 picture events (as built)',
  version: '2026-09-25',
  composition: 'intro-ep1',
  fps: FPS, bpm: BPM, framesPerBeat: FRAMES_PER_BEAT, framesPerBar: FRAMES_PER_BAR, frames: INTRO_FRAMES,
  convention: 'Global intro frames 0-719, inclusive ranges [f, end]. `script` = SCRIPT.md v2.1 frame where the build differs (for audio: cue the PICTURE frame; see studio/notes/intro.md "Deviations").',
  edl: EDL,
  handoffs: HANDOFFS,
  beats,
  events: E,
};
const path = process.argv[2] || 'intro-events.json';
fs.writeFileSync(path, JSON.stringify(out, null, 1) + '\n');
console.log(`wrote ${path}: ${E.length} events`);
