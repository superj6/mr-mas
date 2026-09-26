// MR. MAS — Ep1 act 4: the INSERT + EXPRESSION sheets (owned by the act-4 insert + expression artist). Pure pixel
// code: every view returns a native 480x270 buffer and renders identically in Node (tools/lab.ts) and Remotion.
import {Buf, rect} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {text, textWidth} from '../../../../shared/pixel/font';
import {drawMasCU, drawEyesStrip, EyesPos, masCU, eyesStrip, EYES_Y0} from '../../../../shared/pixel/cast/mas-cu';
import {drawMasLookDown, drawGergTileGlance} from '../../../../shared/pixel/cast/swaps-act4';
import {drawAlyiPortrait} from '../../../../shared/pixel/cast/alyi';
import {portraitWindow} from '../../../../shared/pixel/ui';
import {drawBullpen} from '../../../../shared/pixel/rooms/bullpen';
import {drawLaptopCornerMic} from '../../../../shared/pixel/kits/inserts-props';
import {drawDeskInsert} from '../../../../shared/pixel/rooms/vegas-suite';
import {versionPlan, versionLint, VERSION_RULES} from '../../../../shared/pixel/kits/mas-version';
import {drawPhone29Timeline, brushStepAt} from '../../../../shared/pixel/kits/inserts-mas';
import {stepColor} from '../../../../shared/pixel/palette';
import {blitImg} from '../../../../shared/pixel/figure';
import {drawCarveInsert, drawBrushInsert, brushSafe, drawPhoneInsert29, drawStripTapInsert, StripHand, drawNudgeInsert, NudgeStep, GlassRoom, drawClickInsert} from '../../../../shared/pixel/kits/inserts-mas';
import {drawVaultInsert, drawShutDoorInsert} from '../../../../shared/pixel/kits/inserts-props';
import {masLookDown, alyiLookUp, gergGlance, drawGergTileWide} from '../../../../shared/pixel/cast/swaps-act4';
import {masPortrait} from '../../../../shared/pixel/cast/mas';
import {alyiSpeakPortrait} from '../../../../shared/pixel/cast/alyi-speak';
import {gergGlow} from '../../../../shared/pixel/cast/gerg-speak';
import type {Img} from '../../../../shared/pixel/figure';

const W = 480, H = 270;
/** stand-in for the rail band (y 203..269 belongs to the rail builder) */
const railStandIn = (b: Buf, s: string | null) => {
  rect(0, 203, W, 67, b.ink(PAL.N0));
  rect(0, 203, W, 1, b.ink(PAL.N2));
  if (s) text(b, s, 12, 216, PAL.C6);
  text(b, 'rail band: stand-in', W - 8 - textWidth('rail band: stand-in'), 258, PAL.N3);
};

type View = (b: Buf, arg: string) => void;
const V: Record<string, View> = {
  'cu-26': (b) => { drawMasCU(b, {backdrop: 'strip'}); railStandIn(b, 'RAIL: +1 FIRING'); },
  'cu-30': (b) => { drawMasCU(b, {backdrop: 'lobby'}); railStandIn(b, null); },
  'cu-w0': (b) => { drawMasCU(b, {backdrop: 'lobby', face: 'tungsten'}); railStandIn(b, 'W0 OPTION ONLY: face as material, tungsten'); },
};
V['carve'] = (b, a) => { drawCarveInsert(b, 0, Number(a || 1)); railStandIn(b, 'RAIL: NOV 17, 2023 · THAT NIGHT'); };
V['brush'] = (b, a) => { drawBrushInsert(b, 0, Number(a || 7)); railStandIn(b, brushSafe() ? 'brush path: marks 1-2 untouched (checked)' : 'BRUSH PATH TOUCHES MARKS 1-2'); };
V['p29v'] = (b) => { drawPhoneInsert29(b, {mode: 'version', f: 0}); railStandIn(b, 'RAIL: NOV 20, 2023 · ~2:06 AM PT · HIS SIDE'); };
V['p29t'] = (b, a) => { drawPhoneInsert29(b, {mode: 'true', f: Number(a || 0)}); railStandIn(b, 'RAIL: NOV 20, 2023 · ~2:06 AM PT · HIS SIDE'); };
V['s26'] = (b, a) => { drawStripTapInsert(b, 0, {hand: (a || 'tap') as StripHand}); railStandIn(b, 'RAIL: +1 FIRING'); };
V['vault'] = (b) => { drawVaultInsert(b); railStandIn(b, 'RAIL: NOV 22, 2023 · REPORTED: ...'); };
V['door'] = (b) => { drawShutDoorInsert(b); railStandIn(b, 'RAIL: NOV 29, 2023'); };
V['nudge'] = (b, a) => { const [room, step] = (a || 'lobby.set').split('.'); drawNudgeInsert(b, room as GlassRoom, step as NudgeStep); railStandIn(b, null); };
V['click'] = (b, a) => { drawClickInsert(b, 0, {click: a === 'click'}); railStandIn(b, 'RAIL: NOV 17, 2023 · ~NOON PT · LAS VEGAS'); };
const zoom = (b: Buf, img: Img, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, k: number, bg: number) => {
  for (let j = 0; j < sh; j++) for (let i = 0; i < sw; i++) {
    const X = sx + i, Y = sy + j;
    const v = X >= 0 && Y >= 0 && X < img.w && Y < img.h ? img.c[Y * img.w + X] : -1;
    rect(dx + i * k, dy + j * k, k, k, b.ink(v < 0 ? bg : v));
  }
};
V['swaps-test'] = (b) => {
  rect(0, 0, W, H, b.ink(PAL.N1));
  const pairs: Array<[Img, Img]> = [
    [masPortrait({mouth: 'rest', lid: 0, look: 0, brow: 0, light: 'monitor'}), masLookDown({mouth: 'E', brow: 0, light: 'monitor'})],
    [alyiSpeakPortrait({mouth: 'rest', eyes: 'open', t: 0}), alyiLookUp({mouth: 'rest', eyes: 'open', t: 0})],
    [gergGlow({mouth: 'rest', lid: 1, look: 0}), gergGlance({mouth: 'rest', eyes: 'lens'})],
  ];
  pairs.forEach(([a, c], i) => {
    zoom(b, a, 32, 36, 34, 24, 4, 4 + i * 88, 3, PAL.N2);
    zoom(b, c, 32, 36, 34, 24, 110, 4 + i * 88, 3, PAL.N2);
    blitImg(b, a, 220 + i * 0, 0);
  });
};
V['gerg-wide'] = (b, a) => { drawGergTileWide(b, {eyes: (a || 'lens') as 'lens' | 'screen'}); railStandIn(b, null); };
V['eyes'] = (b, a) => { drawEyesStrip(b, Number(a || 0) as EyesPos); railStandIn(b, null); };

// ================================================================== DELIVERABLE VIEWS (renders to out/ep01/act4/assets/inserts)
const title = (b: Buf, name: string, sub: string, accent: number = PAL.C6) => {
  rect(0, 0, W, 13, b.ink(PAL.N0));
  text(b, 'MR. MAS  EP1 ACT 4  INSERTS', 6, 3, PAL.N5);
  text(b, name, 6 + textWidth('MR. MAS  EP1 ACT 4  INSERTS') + 10, 3, accent);
  text(b, sub, W - 6 - textWidth(sub), 3, PAL.N5);
  rect(0, 12, W, 1, b.ink(PAL.N2));
};
const label = (b: Buf, s: string, x: number, y: number, col: number = PAL.N6) => text(b, s, x, y, col);
/** render a room-area shot into a scratch 480x203 buffer */
const shot = (draw: (bb: Buf) => void) => { const t = new Buf(W, 203, PAL.N0); draw(t); return t; };
/** copy a crop of a buffer, optionally zoomed k x (nearest) */
const put = (b: Buf, src: Buf, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, k = 1) => {
  for (let j = 0; j < sh * k; j++) for (let i = 0; i < sw * k; i++) { const X = sx + Math.floor(i / k), Y = sy + Math.floor(j / k); if (X >= 0 && Y >= 0 && X < src.w && Y < src.h) b.set(dx + i, dy + j, src.get(X, Y)); }
  rect(dx - 1, dy - 1, sw * k + 2, 1, b.ink(PAL.N3)); rect(dx - 1, dy + sh * k, sw * k + 2, 1, b.ink(PAL.N3));
  rect(dx - 1, dy - 1, 1, sh * k + 2, b.ink(PAL.N3)); rect(dx + sw * k, dy - 1, 1, sh * k + 2, b.ink(PAL.N3));
};
const band = (b: Buf, lines: string[], col: number = PAL.N6) => { rect(0, 203, W, 67, b.ink(PAL.N0)); rect(0, 203, W, 1, b.ink(PAL.N2)); lines.forEach((l, i) => text(b, l, 8, 209 + i * 11, i === 0 ? PAL.C6 : col)); };

V['F-cu26'] = (b) => { drawMasCU(b, {backdrop: 'strip'}); band(b, ['CU sc 26 P3 · 1.5 bars, silent · RAIL: +1 FIRING types on beat 3 (rail builder)', 'one drawing, no mouths, no lids: the Strip stepped down behind him (the light lives in the backdrop)', 'head ~140 px, left third, 3/4 toward camera-left; the smile: ONE pixel (near corner)']); };
V['F-cu30'] = (b) => { drawMasCU(b, {backdrop: 'lobby'}); band(b, ['CU sc 30 · 2 beats, silent · "okay." plays over the NEXT shot (the hands)', 'the SAME drawing as sc 26: the lobby tungsten + the lit sign behind him (no face relight)', 'G1 fallback if capped at 1/ep: sc 26 phrase 1 PF framing, cyan -> tungsten (not built here)']); };
V['F-cuw0'] = (b) => { drawMasCU(b, {backdrop: 'lobby', face: 'tungsten'}); band(b, ['W0 OPTION ONLY (not the default): the CU face re-ramped to tungsten', 'the figure is built from material ramps, so a relight is a ramp swap if W0 rules', '"painted as materials for resolve()". Default ruling = room only: do not use.'], PAL.R3); };
V['F-cudetail'] = (b) => {
  rect(0, 0, W, H, b.ink(PAL.N1));
  title(b, 'THE CLOSE-UP  detail', 'one silent, unchanging face');
  const cu = shot((t) => drawMasCU(t, {backdrop: 'strip'}));
  put(b, cu, 66, 50, 64, 34, 8, 30, 3); label(b, 'EYES  calm, big, unblinking; lid a touch low', 8, 136);
  put(b, cu, 70, 94, 40, 30, 214, 30, 3); label(b, 'NOSE + SMILE (1 px)', 214, 136);
  put(b, cu, 136, 70, 34, 50, 344, 30, 2); label(b, 'EAR', 380, 136);
  put(b, cu, 60, 0, 110, 48, 8, 150, 1); label(b, 'the cowlick; hair locks from the whorl', 124, 152);
  label(b, 'no mouths, no lids, no blink: nothing on it changes', 124, 166);
  label(b, 'the rail and "okay." land around it, never on it', 124, 180);
  label(b, 'planes: a 2x re-raster of the approved portrait', 8, 212); label(b, '(cast/mas.ts), every feature hand-placed at CU scale', 8, 224);
  label(b, 'key: the monitor cyan from camera-left; no back rim', 8, 240); label(b, '(the backdrop separates him: it carries the light)', 8, 252);
};
V['F-eyes'] = (b) => {
  rect(0, 0, W, H, b.ink(PAL.N0));
  title(b, 'THE EYES STRIP  sc 26 P2', '480 x 64 · 5 pupil positions');
  const s0 = eyesStrip(0), s1 = eyesStrip(-1);
  const blit = (img: Img, y: number) => { for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) { const v = img.c[j * img.w + i]; if (v >= 0) b.set(i, y + j, v); } };
  const bg = shot((t) => drawEyesStrip(t, 0));
  put(b, bg, 0, EYES_Y0, 480, 64, 0, 18); blit(s0, 18);
  label(b, 'pos 0: reading the dialog pop-up', 8, 86, PAL.C6);
  put(b, bg, 0, EYES_Y0, 480, 64, 0, 98); blit(s1, 98);
  label(b, 'pos -1: "his pupils move one pixel toward the dialog. Nothing else on him moves."', 8, 166, PAL.C6);
  const positions: EyesPos[] = [-2, -1, 0, 1, 2];
  positions.forEach((p, i) => {
    const st = shot((t) => drawEyesStrip(t, p));
    put(b, st, 196, EYES_Y0 + 8, 44, 40, 8 + i * 94, 182, 2);
    label(b, `pos ${p}`, 8 + i * 94, 262, PAL.N6);
  });
};
const shotView = (draw: (bb: Buf) => void, lines: string[]) => (b: Buf) => { draw(b); band(b, lines); };
V['F-click'] = shotView((b) => drawClickInsert(b, 0, {}), ['HAND 1  THE CLICK · sc 25 THE BREAK ECU 1 bar', 'BOARD · VIDEO CALL · JOIN, the pointer (the laptop\'s arrow) on JOIN; the index on the pad', "'click' = the index 1 px + JOIN pressed; the blueprint tear can open onto this plate"]);
V['F-click2'] = shotView((b) => drawClickInsert(b, 0, {click: true}), ['HAND 1  THE CLICK · the click frame', 'the only change: the fingertip presses (1 px) and JOIN takes its pressed drawing', '']);
V['F-nudge24'] = shotView((b) => drawNudgeInsert(b, 'suite', 'nudge'), ['HAND 2  THE NUDGE · sc 24 ECU 2 beats (the suite by day)', 'one drawing: set -> NUDGE (hand + glass 1 px true) -> out1 -> out2 -> gone (to the trackpad)', 'the water line: ONE flat row. His glass never shivers.']);
V['F-nudge30'] = shotView((b) => drawNudgeInsert(b, 'lobby', 'nudge'), ['HAND 2  THE SET-DOWN + NUDGE · sc 30 ECU 2 beats, "okay." over the hands', 'the same drawing: held (+2 px) -> set -> NUDGE (1 px true), lit by the lobby tungsten', 'the reception desk\'s stone, its tea-lights; the sign far off']);
V['F-strip26'] = shotView((b) => drawStripTapInsert(b, 0, {hand: 'tap'}), ['HAND 3  THE STRIP TAP · sc 26 P3-P4 ECU (rooms-a desk insert)', 'the thumb takes the middle super AT ONCE: enter1 -> enter2 -> tap (no hover)', 'PROP: the laptop corner + the call\'s mic chip LIT (green, level bars). Strip = post-ui STAND-IN']);
V['F-carve'] = shotView((b) => drawCarveInsert(b, 0, 1), ['HAND 4  THE CARVE · sc 26A bar 1 (rooms-b desk close + kits pen)', 'the fist overhand on the MACROSOFT pen, the clip in the wood; tracks carveTip in quarters', 'mark 3 grows 0.25 -> 1 on the beat']);
V['F-rest'] = shotView((b) => drawBrushInsert(b, 0, 7), ['HAND 5  THE BRUSH, THEN THE THUMB ON MARK 3 · sc 26A bar 2', 'one drawing moved in whole px: the edge sweeps the shavings, then the thumb rests on mark 3 ONLY', brushSafe() ? 'rule check: marks 1-2 (REPORTED) never touched on any step (brushSafe = true)' : 'RULE CHECK FAILED']);
V['F-hearts'] = shotView((b) => drawPhoneInsert29(b, {mode: 'true', f: 47}), ['HAND 6  THE HEARTS · sc 29 ECU 2 bars (the TRUE shot)', 'the same frame as the VERSION: phone face-up, Rima\'s post legible the whole time (feed = STAND-IN)', 'the thumb hearts one post per beat (8); the LEDs blink, the Orb\'s iris follows the taps']);
V['F-version'] = shotView((b) => drawPhoneInsert29(b, {mode: 'version', f: 0}), ["MAS'S VERSION · sc 29 ECU 1 bar (never labelled on screen)", 'the matching frame: phone face-down, the hand at rest: SIX fingers (the egg, A/B at G2)', 'too still: nothing else moves (LEDs + iris held) · no rim · keynote piano, cut on the downbeat']);
V['F-version5'] = shotView((b) => drawPhoneInsert29(b, {mode: 'version', f: 0, fiveInVersion: true}), ["MAS'S VERSION · the five-finger copy (G2 A/B)", 'identical but for the finger count', '']);
V['F-versionab'] = (b) => {
  rect(0, 0, W, H, b.ink(PAL.N0));
  title(b, "MAS'S VERSION -> HARD CUT", 'the cut is the correction');
  const vv = shot((t) => drawPhoneInsert29(t, {mode: 'version', f: 0}));
  const tt = shot((t) => drawPhoneInsert29(t, {mode: 'true', f: 47}));
  put(b, vv, 100, 0, 236, 203, 2, 16); put(b, tt, 100, 0, 236, 203, 242, 16);
  const lint = versionLint(vv);
  rect(0, 222, W, 48, b.ink(PAL.N0));
  label(b, "VERSION: face-down · 6 fingers · held", 4, 224, PAL.C6); label(b, 'TRUE: face-up · 5 fingers · taps on the beat', 244, 224, PAL.C6);
  label(b, `rules: same framing ${VERSION_RULES.sameFraming ? 'yes' : 'no'} · still yes · rim ${lint ? 'none (lint passes)' : 'FOUND'} · label never`, 4, 238);
  label(b, 'sound: keynote-reel piano (original) killed mid-phrase by the cut; first heart Tick. on it', 4, 250);
};
V['F-swaps'] = (b) => {
  rect(0, 0, W, H, b.ink(PAL.N1));
  title(b, 'EXPRESSION SWAPS x3', 'eyes + brows: every mouth still works');
  // 1) Mas looking down, sc 30 PF over the bullpen stepped down
  const bp = shot((t) => { drawBullpen(t, 0, {variant: 'walkout', door: 'crack'}); for (let i = 0; i < t.c.length; i++) t.c[i] = stepColor(stepColor(t.c[i], -1), -1); });
  put(b, bp, 0, 20, 150, 150, 4, 18);
  drawMasLookDown(b, 12, 26, {mouth: 'E', brow: 0, light: 'monitor'});
  portraitWindow(b, 12, 26, 112, 136, {open: 1, name: 'MAS', accent: PAL.C6, content: (bb, px, py) => drawMasLookDown(bb, px, py, {mouth: 'E', brow: 0, light: 'monitor'})});
  label(b, 'MAS looks down: "hi."', 6, 178, PAL.C6); label(b, 'sc 30 PF (the floor is Tasya)', 6, 190);
  // 2) Alyi looking up at the hearts, sc 30 P2 (his door-cut window)
  portraitWindow(b, 166, 26, 112, 136, {open: 1, name: 'ALYI', accent: PAL.W6, content: (bb, px, py) => {
    drawAlyiPortrait(bb, px, py, {eyes: 'open', mouth: 'rest', t: 0});
    const img = alyiLookUp({mouth: 'rest', eyes: 'open', t: 0});
    for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) { const v = img.c[j * img.w + i]; if (v >= 0) bb.set(px + i, py + j, v); }
    for (let j = 0; j < 136; j++) for (let i = 84; i < 112; i++) bb.set(px + i, py + j, i < 88 ? PAL.D3 : PAL.D2); // the door frame cutting his window
    const HEART = ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'];
    [[4, 8], [14, 3], [8, 18]].forEach(([hx, hy]) => HEART.forEach((r, jj) => { for (let ii = 0; ii < 7; ii++) if (r[ii] === '#') bb.set(px + hx + ii, py + hy + jj, jj === 1 && ii < 3 ? PAL.R3 : PAL.R2); }));
  }});
  label(b, 'ALYI looks up at the hearts', 160, 178, PAL.W6); label(b, 'sc 30 P2 · his real face', 160, 190);
  // 3) Gerg: typing (eyes down) -> the glance into his camera, at medium tile scale
  drawGergTileGlance(b, 320, 26, 150, 66, {eyes: 'screen', f: 3});
  drawGergTileGlance(b, 320, 100, 150, 66, {eyes: 'lens'});
  label(b, 'GERG typing (eyes down)', 318, 178, PAL.L3); label(b, '-> glances up into his camera', 318, 190);
  label(b, 'Mas: lids down a row, irises low, no catchlight', 6, 212, PAL.N6);
  label(b, 'Alyi: irises up + left, the white under them, brows +1 px', 6, 224, PAL.N6);
  label(b, 'Gerg (sc 29 quiet beat): lids open, irises to the lens, brows +1, head +1', 6, 236, PAL.N6);
  label(b, 'drawGergTileWide fills the frame with his tile (see swap-gerg-wide)', 6, 248, PAL.N6);
};
V['F-gergwide'] = shotView((b) => drawGergTileWide(b, {eyes: 'lens'}), ['SWAP 3  GERG glances up into his camera · sc 29 quiet beat POV 1 beat', 'the tile fills the frame ("medium tile scale"); his real face', 'typing state = eyes \'screen\' (the tile\'s standing drawing)']);
V['F-vault'] = shotView((b) => drawVaultInsert(b), ['PROP INSERT  THE Q* VAULT · sc 31 ECU', 'squat steel, Q* stencilled, the hall\'s tungsten spill; the note legible:', 'DO NOT OPEN. DO NOT EXPLAIN.  (the hum is sound only, at F)']);
V['F-door'] = shotView((b) => drawShutDoorInsert(b), ['PROP INSERT  THE SHUT DOOR · sc 31 ECU', 'the conference-room door, shut, its ALYI nameplate still on (the chair plate came off)', 'the IOU note\'s corner on the jamb (it flutters off in Ep2, not here)']);
V['F-mic'] = (b) => {
  rect(0, 0, W, H, b.ink(PAL.N1));
  title(b, 'PROP  LAPTOP CORNER + MIC, LIT', 'sc 26: the tile is gone; the mic is not');
  const d = shot((t) => { drawDeskInsert(t, {f: 0, phoneLit: true, mic: false}); drawLaptopCornerMic(t, {level: 3}); });
  put(b, d, 0, 0, 170, 90, 8, 20, 2);
  const d0 = shot((t) => { drawDeskInsert(t, {f: 0, phoneLit: true, mic: false}); drawLaptopCornerMic(t, {level: 0}); });
  put(b, d0, 50, 40, 90, 44, 356, 20, 1);
  label(b, 'level 3 (live: green glyph, bars up)', 8, 206, PAL.L3);
  label(b, 'level 0 (idle)', 356, 70);
  label(b, "the call's own micIcon (kits/callgrid) redrawn at insert scale", 8, 220);
  label(b, 'paint over rooms-a drawDeskInsert (pass mic: false to drop its red placeholder)', 8, 234);
};
V['F-hands-states'] = (b) => {
  rect(0, 0, W, H, b.ink(PAL.N1));
  title(b, 'HANDS  drawings + held states', '6 + the six-finger variant');
  const cells: Array<[string, Buf, number, number, number, number]> = [
    ['1 click: rest', shot((t) => drawClickInsert(t, 0, {})), 150, 130, 110, 70],
    ['1 click: CLICK', shot((t) => drawClickInsert(t, 0, {click: true})), 150, 130, 110, 70],
    ['2 nudge: held', shot((t) => drawNudgeInsert(t, 'lobby', 'held')), 150, 100, 110, 70],
    ['2 nudge: NUDGE', shot((t) => drawNudgeInsert(t, 'lobby', 'nudge')), 150, 100, 110, 70],
    ['3 strip: enter1', shot((t) => drawStripTapInsert(t, 0, {hand: 'enter1'})), 200, 100, 110, 70],
    ['3 strip: TAP', shot((t) => drawStripTapInsert(t, 0, {hand: 'tap'})), 200, 100, 110, 70],
    ['4 carve q .5', shot((t) => drawCarveInsert(t, 0, 0.5)), 250, 50, 110, 70],
    ['4 carve q 1', shot((t) => drawCarveInsert(t, 0, 1)), 250, 50, 110, 70],
    ['5 brush: sweep', shot((t) => drawBrushInsert(t, 0, 3)), 250, 60, 110, 70],
    ['5 REST on mark 3', shot((t) => drawBrushInsert(t, 0, 7)), 250, 60, 110, 70],
    ['6 hearts: up', shot((t) => drawPhoneInsert29(t, {mode: 'true', f: 20})), 110, 100, 110, 70],
    ['6 hearts: TAP', shot((t) => drawPhoneInsert29(t, {mode: 'true', f: 46})), 110, 100, 110, 70],
    ['V six fingers', shot((t) => drawPhoneInsert29(t, {mode: 'version', f: 0})), 202, 88, 110, 70],
    ['V five (G2 copy)', shot((t) => drawPhoneInsert29(t, {mode: 'version', f: 0, fiveInVersion: true})), 202, 88, 110, 70],
  ];
  cells.forEach(([name, src, sx, sy, sw, sh], i) => {
    const cx = 3 + (i % 5) * 96, cy = 18 + Math.floor(i / 5) * 84;
    const w = 92, h = 68;
    put(b, src, sx + Math.round((sw - w) / 2), sy + Math.round((sh - h) / 2), w, h, cx, cy);
    label(b, name, cx, cy + h + 2, PAL.N6);
  });
};
// ------------------------------------------------------------------ the motion test (240 f = 10 s)
export const MOTION_FRAMES = 240;
V['motion'] = (b, a) => {
  const f = Number(a || 0);
  if (f < 48) { const q = 0.25 * (1 + Math.floor(f / 12)); drawCarveInsert(b, f, q); band(b, ['26A bar 1 · the carve, in quarters on the beat', '']); return; }
  if (f < 96) { drawBrushInsert(b, f, brushStepAt(f - 48)); band(b, ['26A bar 2 · the brush, then the thumb at rest on mark 3', '']); return; }
  if (f < 156) { drawPhone29Timeline(b, f, versionPlan(96, {bars: 0.5})); band(b, [f < 126 ? "29 · MAS'S VERSION (held)" : '29 · HARD CUT -> the true shot, taps on the beat', '']); return; }
  if (f < 180) { const k = f - 156; drawStripTapInsert(b, f, {hand: k < 8 ? 'out' : k < 10 ? 'enter1' : k < 12 ? 'enter2' : k < 18 ? 'tap' : 'after'}); band(b, ['26 · the strip lights; the thumb takes the middle super at once', '']); return; }
  if (f < 204) { const k = f - 180; drawNudgeInsert(b, 'lobby', k < 8 ? 'held' : k < 14 ? 'set' : 'nudge'); band(b, ['30 · the set-down, the nudge one pixel true', '']); return; }
  if (f < 216) { drawClickInsert(b, f, {click: f >= 210 && f < 212}); band(b, ['25 · the click', '']); return; }
  drawEyesStrip(b, f < 228 ? 0 : -1); band(b, ['26 P2 · the eyes strip: one pixel toward the dialog', '']);
};
/** output file name (out/ep01/act4/assets/inserts/<name>.png) -> view id */
export const DELIVERABLES: Array<[string, string]> = [
  ['cu-26', 'F-cu26'], ['cu-30', 'F-cu30'], ['cu-w0-option', 'F-cuw0'], ['cu-detail', 'F-cudetail'], ['eyes-strip', 'F-eyes'],
  ['hands-01-click-25', 'F-click'], ['hands-01-click-25-press', 'F-click2'], ['hands-02-nudge-24', 'F-nudge24'], ['hands-02-setdown-30', 'F-nudge30'],
  ['hands-03-strip-26', 'F-strip26'], ['hands-04-carve-26a', 'F-carve'], ['hands-05-rest-26a', 'F-rest'], ['hands-06-hearts-29', 'F-hearts'],
  ['hands-v-version-29', 'F-version'], ['hands-v-version-29-five', 'F-version5'], ['version-ab', 'F-versionab'], ['hands-states', 'F-hands-states'],
  ['swaps', 'F-swaps'], ['swap-gerg-wide', 'F-gergwide'], ['props-vault-31', 'F-vault'], ['props-door-31', 'F-door'], ['props-mic-26', 'F-mic'],
];
export const VIEWS = Object.keys(V);
export const renderView = (id: string): Buf => {
  const [name, ...rest] = id.split(':'); const arg = rest.join(':');
  const b = new Buf(W, H, PAL.N0);
  const v = V[name];
  if (!v) { text(b, `no view ${id}`, 8, 8, PAL.R3); return b; }
  v(b, arg ?? '');
  return b;
};
