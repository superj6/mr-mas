// MR. MAS — Ep1 Act Four · THE EDITOR's animatic v3: one layout per shot of timing lock v3 (owned by THE EDITOR).
// Board 3 (shots-v3.json) re-framed the act (bible pov-and-framing §4.7): people talk in frameless close-ups, over-the-
// shoulders and two-shots cut on the turns; the box survives only in-world (a call tile, a phone, a monitor) and once as
// a deliberate beat (30.01). Every layout here is built from the ACTUAL assets: the v3 templates (framing.ts) over the
// rooms, plates, portraits, medium rigs and inserts; v2's layouts (shots.ts) where a shot carries over, re-timed to the
// v3 lock through the `v2()` adapter; labelled boxes only where no art exists. `k` is shot-relative, `f` the act frame.
import {Buf, rect, clamp} from '../../../../shared/pixel/px';
import {textWidth} from '../../../../shared/pixel/font';
import {PAL, stepColor} from '../../../../shared/pixel/palette';
import {inPalette} from '../../../../shared/pixel/palettes';
import type {GlyphLayer} from '../../../../shared/pixel/glyph';
import {renderFront, frontPos} from '../../../../shared/pixel/transitions';
import {blitImg} from '../../../../shared/pixel/figure';
import type {Img} from '../../../../shared/pixel/figure';
import {flipImg} from '../../../../shared/pixel/sprite';
import type {Viseme} from '../../../../shared/pixel/cast/talk';
import {marioMouth} from '../../../../shared/pixel/cast/talk';
import {
  gridLayout, callChrome, drawTile, TileRect, captureTile, tileDrop, slideTiles, callDialog, dialogButton, drawPointer, pointerAt,
  typedDots, tilePlate, plateFallY, dropY, postChip, callToast, CALL_BAR_H, employeeFace,
} from '../../../../shared/pixel/kits/callgrid';
import {shove, scatter} from '../../../../shared/pixel/kits/avalanche';
import {drawDarkDesk} from '../../../../shared/pixel/rooms/darkroom';
import {drawDarkPlate, drawDarkPlateDesk, drawDarkPlateFront, DPLATE, DPLATE_LOOK} from '../../../../shared/pixel/rooms/darkroom-plate';
import type {DarkPlateOpts} from '../../../../shared/pixel/rooms/darkroom-plate';
import {drawBoardPlate, drawBoardPlateTable, drawBoardPlateFront, BPLATE} from '../../../../shared/pixel/rooms/boardroom-plate';
import type {BoardPlateOpts} from '../../../../shared/pixel/rooms/boardroom-plate';
import {FIRES_SC30, drawTableInsert, TABLE_INSERT} from '../../../../shared/pixel/rooms/boardroom';
import {drawBullpen, DOOR_OPENING} from '../../../../shared/pixel/rooms/bullpen';
import {throneImg} from '../../../../shared/pixel/rooms/lighthouse';
import {drawLobbyCam, CAM, LOBBY} from '../../../../shared/pixel/rooms/lobby';
import {drawTpoolDoor, drawTpoolClose} from '../../../../shared/pixel/rooms/tpool-door';
import {drawDark2S, drawBoard2S, drawMadaM, drawCalmOff2S, FIRES_CALMOFF, FIRES_M, drawDoorwayP2} from '../../../../shared/pixel/rooms/twoshots';
import {drawLaptopInsert, LAPTOP_INSERT} from '../../../../shared/pixel/rooms/vegas-suite';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../shared/pixel/cast/mas';
import type {MasPortraitState} from '../../../../shared/pixel/cast/mas';
import {masLookDown} from '../../../../shared/pixel/cast/swaps-act4';
import {nelehPortrait, NELEH_PORTRAIT_DEFAULT, nelehTileBg, drawNelehTile} from '../../../../shared/pixel/cast/neleh';
import {madaPortrait, MADA_PORTRAIT_DEFAULT, drawSpinner, drawMadaTile} from '../../../../shared/pixel/cast/mada';
import {rimaSpeakPortrait, RIMA_PORTRAIT_DEFAULT, drawRimaTile} from '../../../../shared/pixel/cast/rima-speak';
import {alyiSpeakPortrait, alyiReflection, drawAlyiStand, ALYI_STAND_DEFAULT, drawAlyiTile} from '../../../../shared/pixel/cast/alyi-speak';
import {ttemmePortrait, TTEMME_PORTRAIT_DEFAULT, drawHourglass, drawChatOverlay} from '../../../../shared/pixel/cast/ttemme';
import {tasyaSpeakPortrait, drawTasyaRoom, TASYA_ROOM_DEFAULT} from '../../../../shared/pixel/cast/tasya-speak';
import {marioPortraitImg} from '../../../../shared/pixel/cast/mario';
import {terbPortrait, TERB_PORTRAIT_DEFAULT, terbWalkAt} from '../../../../shared/pixel/cast/terb';
import {gergGlow} from '../../../../shared/pixel/cast/gerg-speak';
import {drawMasCU, drawEyesStrip} from '../../../../shared/pixel/cast/mas-cu';
import {drawMasStand, MAS_STAND_DEFAULT, masWalkAt} from '../../../../shared/pixel/cast/mas-stand';
import {drawOrb, orbStep} from '../../../../shared/pixel/cast/orb-medium';
import {drawNudgeInsert, drawClickInsert, drawStripTapInsert, StripHand, drawCarveInsert, drawBrushInsert, brushStepAt} from '../../../../shared/pixel/kits/inserts-mas';
import {clickHand} from '../../../../shared/pixel/kits/inserts-hands';
import {hourglass, hourglassGrains} from '../../../../shared/pixel/kits/props';
import {drawSignFloorInsert} from '../../../../shared/pixel/rooms/lobby';
import {drawPlan3} from './plan25v3';
import {boardRoom, bullpenRoom, lighthouseRoom, lobbyRoom, doorShake} from './backs';
import {RH, held, dimRoom, fallaway, postCard, toast, freezePrint, blipCard, quoteCard, actCard, box, bezel, putUI, pt, pw} from './lay';
import {
  DRAW as V2, G5, G4, ui, wifi, board4, masTileState, call26, sui, putSCR, call27, DLG, dialog26, CANCEL, phoneScreen, keycapRain,
  hearts, heartPlan, SCR_W, SCR_H, HG, SPIN_X, avalanche, B4, lhHeld, deskInsert, monitor, S5,
} from './shots';
import {SHOTS as SHOTS_V2} from './data-v2';
import type {ShotV2, LineV2} from './data-v2';
import type {ShotV3, LineV3} from './data-v3';
import {
  soft, softMask, keepRect, bust, vignette, shoulder, drawBust, mcuRoom, MCU_X, McuOpts, macro2x, rackStep, RACK, drift, shiftRoom,
  spotlight, doorFrame, platePx,
} from './framing';

export interface ShotOut3 { layers?: GlyphLayer[]; full?: boolean; noTalk?: boolean; noVo?: boolean; print?: 'blueprint'; talk?: boolean }
type Draw3 = (fb: Buf, k: number, sh: ShotV3, f: number) => ShotOut3 | void;
export interface ShotDef3 { draw: Draw3; st: string; standin: boolean }
export const DRAW3: Record<string, ShotDef3> = {};
/** register. `st` = what the layout is built from (the margin prints it); `standin` marks a box / stand-in in it */
const S = (ids: string | string[], st: string, draw: Draw3, standin = false) => { for (const id of ([] as string[]).concat(ids)) DRAW3[id] = {draw, st, standin}; };
const beat = (k: number) => Math.floor(k / 15);
const on2 = (k: number) => k - (k % 2);

// ================================================================== the v2 adapter
const V2SH = new Map(SHOTS_V2.map((s) => [s.id, s]));
/** a v2 shot record carrying THIS v3 shot's lines (shifted by kOff onto the v2 shot's clock) so mouths follow the v3 takes */
const asV2 = (sh: ShotV3, v2id: string, kOff = 0): ShotV2 => {
  const b = V2SH.get(v2id) as ShotV2;
  return {...b, lines: sh.lines.map((l) => ({...l, s: l.s + kOff, e: l.e + kOff}) as unknown as LineV2)};
};
/** run a v2 layout at its own shot frame k2 (and its own act frame, so its act-clocked loops stay continuous) */
const v2 = (fb: Buf, v2id: string, k2: number, sh: ShotV3, kOff = 0) => {
  const d = V2[v2id];
  const b = V2SH.get(v2id) as ShotV2;
  return (d.draw(fb, k2, asV2(sh, v2id, kOff), b.s + k2) ?? {}) as ShotOut3;
};

// ================================================================== mouths (from the recorded cues)
const lineAt = (sh: ShotV3, k: number, who: string): LineV3 | null => {
  for (const l of sh.lines) if (l.who === who && l.kind !== 'post' && k >= l.s && k < l.e) return l;
  return null;
};
const mouth = (sh: ShotV3, k: number, who: string): Viseme => {
  const l = lineAt(sh, k, who);
  if (!l) return 'rest';
  let m: Viseme = 'rest';
  for (const [fr, shape] of l.mouth) { if (k - l.s >= fr) m = shape as Viseme; else break; }
  if (!l.mouth.length) m = Math.floor((k - l.s) / 3) % 2 ? 'A' : 'E';
  return m;
};
const talking = (sh: ShotV3, k: number, who: string) => lineAt(sh, k, who) !== null;
const lineOf = (sh: ShotV3, id: string) => sh.lines.find((l) => l.id === id);
const wordAt = (sh: ShotV3, w: string, dflt: number) => {
  for (const l of sh.lines) { const x = l.words.find((q) => q[0].toLowerCase().replace(/[^a-z]/g, '').startsWith(w)); if (x) return l.s + x[1]; }
  return dflt;
};
const lastLineEnd = (sh: ShotV3, dflt: number) => sh.lines.filter((l) => l.kind !== 'post').reduce((m, l) => Math.max(m, l.e), dflt);
const blink = (k: number, seed: number): 0 | 1 | 2 => { const p = (k + seed * 37) % 97; return p === 0 || p === 2 ? 1 : p === 1 ? 2 : 0; };

// ================================================================== portraits as images (for the frameless templates)
const mas = (s: Partial<MasPortraitState> = {}) => masPortrait({...MAS_PORTRAIT_DEFAULT, look: -1, ...s});

// ================================================================== the [MCU] template (held soft room + the bust)
/** [MCU]: `room` paints the full-bleed room once (held per key), stepped down 2 with negative fill; the bust per frame */
const MCU = (fb: Buf, key: string, room: (b: Buf) => void, img: Img, o: McuOpts, after?: (b: Buf) => void) => {
  held(fb, `mcu:${key}:${o.softK ?? 2}`, (b) => { room(b); mcuRoom(b, o); });
  drawBust(fb, img, o);
  after?.(fb);
};
// the rooms behind the close-ups (full-bleed, unshifted plates)
const darkBg = (o: DarkPlateOpts = {}) => (b: Buf) => { const opt: DarkPlateOpts = {tally: 3, glass: true, lanyard: true, ...o}; drawDarkPlate(b, 0, opt); drawDarkPlateDesk(b, 0, opt); drawDarkPlateFront(b, 0, opt); };
const boardBg = (o: BoardPlateOpts = {}) => (b: Buf) => { const opt: BoardPlateOpts = {laptop: true, rolodex: true, blueprint: 0, ...o}; drawBoardPlate(b, 0, opt); drawBoardPlateTable(b, 0, opt); drawBoardPlateFront(b, 0, opt); };
const FIRES_BG: BoardPlateOpts = {laptop: false, rolodex: 'still', fires: FIRES_CALMOFF(), plates: [{name: 'ALYI', x: 104, fire: true}]};

// ================================================================== sc 24 · THE SUITE
S('24.01', 'rooms-a drawSuite (truck, shiver) + cast desk sprite + orb-medium at room scale (v2 24.01)', (fb, k, sh) => v2(fb, '24.01', k, sh));
S('24.02', 'inserts-mas drawNudgeInsert (suite) + BLUEPRINT_PRINT on f22-29 (the glow turns to blueprint)', (fb, k) => {
  drawNudgeInsert(fb, 'suite', k < 6 ? 'set' : k < 15 ? 'nudge' : k < 19 ? 'out1' : 'out2');
  return {print: k >= 22 ? 'blueprint' : undefined};
});

// ================================================================== sc 25 · THE PLAN (7 bars, voiced)
S(['25.01', '25.02', '25.02b', '25.03'], 'kits blueprint: THE PLAN rebuilt at 7 bars (plan25v3: new title, the fold, voiced by NELEH)', (fb, k, sh) => {
  drawPlan3(fb, sh, k); return {full: true};
});
S(['25.02c', '25.02d'], 'kits blueprint · DETAIL = integer 2x crop of the sheet (MARKED stand-in for the 2x-coordinate redraw)', (fb, k, sh) => {
  drawPlan3(fb, sh, k); return {full: true};
}, true);
S('25.04', 'kits blueprint curlAt / tearAt over inserts-mas drawClickInsert (the neon under the fold)', (fb, k, sh) => { drawPlan3(fb, sh, k); return {full: true}; });
S('25.05', 'inserts-mas drawClickInsert: JOIN, the click on beat 2 (f15); connecting…', (fb, k) => {
  drawClickInsert(fb, k, {click: k >= 15 && k < 17});
  if (k >= 16) { rect(186, 60, 108, 14, fb.ink(PAL.N1)); pt(fb, 'connecting' + '...'.slice(0, 1 + (Math.floor(k / 5) % 3)), 192, 64, PAL.P1); }
});

// ================================================================== sc 26 · THE FALLING TILE (his laptop, full-bleed)
S('26.01', 'callgrid G5 (tiles open, votes flipped, Wi-Fi egg) + engine nameCard NELEH riding in live at f15 (kit.cards stat: stand-in)', (fb, k, _sh, f) => {
  const b = ui(); call26(b, f, {masOpen: k}); putUI(fb, b, false);
  if (k >= 15) blipCard(fb, k - 15, 'NELEH', 'NELEH', 'READ THE CHARTER. LITERALLY.', 'FOOTNOTES: ∞', {f}, 'R');
});
S('26.02', 'callgrid SPEAKER VIEW (in-world push): drawAlyiTile pinned 272x150 + the strip of the others (G5 minis)', (fb, k, _sh, f) => {
  const b = ui();
  callChrome(b, {title: 'board sync', clock: null, controls: false});
  const x = 104, y = CALL_BAR_H + 6, w = 272, h = 140;
  rect(x - 1, y - 1, w + 2, h + 2, b.ink(PAL.C6));
  drawAlyiTile(b, x, y, w, h, {mouth: (['A', 'E', 'rest', 'O'] as Viseme[])[Math.floor(k / 3) % 4], eyes: 'open', t: f});
  const strip: TileRect[] = [0, 1, 2, 3, 4].map((i) => ({x: 104 + i * 55, y: y + h + 5, w: 52, h: 30}));
  const ids = ['mas', 'neleh', 'mada', 'off', 'alyi'];
  strip.forEach((r, i) => { if (i < 4) drawTile(b, {...r, id: ids[i], vote: i === 0 ? undefined : 3, muted: ids[i] === 'off' ? true : undefined}, f); });
  if (k < 18) typedDots(b, x + 6, y + 4, k); else typedDots(b, x + 6, y + 4, 17);
  wifi(b); putUI(fb, b, false);
});
S('26.03', 'callgrid + callDialog: the 1993 dialog in colour over his tile, Cancel live (v2 26.04)', (fb, k, sh) => v2(fb, '26.04', k, sh));
S('26.04', 'mas-cu drawEyesStrip (letterboxed): the pupils move one pixel toward the dialog at f6', (fb, k) => { drawEyesStrip(fb, k < 6 ? 0 : -1); });
const P26: Array<[number, number]> = [[G5[2].x + 70, G5[2].y + 40], [DLG.x + DLG.w - 6, DLG.y + 30]];
S('26.05', 'callgrid + dialog + the unlit arrow, one held step a beat (f0, f15) to the dialog edge', (fb, k, _sh, f) => {
  const b = ui(); call26(b, f); dialog26(b, 99);
  const [px, py] = P26[Math.min(1, beat(k))];
  drawPointer(b, px, py); putUI(fb, b, false);
});
S('26.06', 'SCREEN MACRO 1/2: integer 2x nearest of the laptop\'s own pixels on Cancel (the arrow\'s last step; pressed at f12)', (fb, k, _sh, f) => {
  const b = ui(); call26(b, f); dialog26(b, 99, {cancelDown: k >= 12});
  const [px, py] = k < 2 ? pointerAt(on2(k), 0, 2, [DLG.x + DLG.w - 6, DLG.y + 30], CANCEL) : CANCEL;
  drawPointer(b, px, py, k >= 12);
  const full = new Buf(480, 270, PAL.N1); putUI(full, b, false);
  macro2x(fb, full, CANCEL[0], CANCEL[1]);
});
S('26.06b', 'callgrid: Cancel clicked (f0); the tile drops (4 drawings) inside the GLYPH dissolve (tokens approximated); G5 → G4 at f22', (fb, k, _sh, f) => {
  const b = ui();
  const rects = k < 22 ? G5.slice(1) : slideTiles(G5.slice(1), G4, k, 22, 8);
  callChrome(b, {title: 'board sync', clock: null, controls: false});
  board4(b, f, rects);
  wifi(b);
  const layers: GlyphLayer[] = [];
  if (k < 2) {
    drawTile(b, masTileState(), f);
    dialog26(b, 99, {cancelDown: true});
    drawPointer(b, CANCEL[0], CANCEL[1], true);
  } else {
    const img = captureTile({...masTileState(), open: undefined}, f - k);
    const kk = k - 2;
    if (kk >= 8) tilePlate(b, G5[0].x, G5[0].y + dropY(kk));
    layers.push(tileDrop(b, img, G5[0].x, G5[0].y, kk, {grey: true}));
  }
  putUI(fb, b, false);
  return {layers};
});
S('26.07', 'mas-cu drawMasCU (strip): [CU] 1 of 2, ONE silent drawing; the rail +1 FIRING types on at f15', (fb) => { drawMasCU(fb, {backdrop: 'strip', f: 0}); });
S('26.08', 'inserts-mas drawStripTapInsert: the phone buzzes (f0), [super] ×3 lights (f2), the tap at once (f8); the mic chip still lit', (fb, k) => {
  const hand: StripHand = k < 3 ? 'out' : k < 5 ? 'enter1' : k < 8 ? 'enter2' : k < 12 ? 'tap' : 'after';
  drawStripTapInsert(fb, k, {hand, strip: k >= 2, level: k >= 8 && k < 30 ? 1 + (Math.floor(k / 4) % 3) : 3});
});
// the call on the laptop's own screen (328 x 143): a layout that fits the lid
const LAP = LAPTOP_INSERT.screen;
const LW = LAP.x1 - LAP.x0 + 1, LH = LAP.y1 - LAP.y0 + 1;
const LG4 = gridLayout(4, {w: 150, h: 54, gap: 5, area: {x: 0, y: CALL_BAR_H, w: LW, h: LH - CALL_BAR_H}});
S('26.09', '[OTS] shoulder(masPortrait, the neon rim) over rooms-a drawLaptopInsert; the screen = callgrid G4, frozen on "super." (f10)', (fb, k, sh, f) => {
  const l = sh.lines[0];
  const frozeAt = l ? l.s + 7 : 10;
  drawLaptopInsert(fb, {f: k, screen: (bb) => {
    const s = new Buf(LW, LH, PAL.N1);
    callChrome(s, {title: 'board sync', clock: null, controls: false});
    const T = k >= frozeAt ? f - k + frozeAt : f;
    board4(s, T, LG4, k >= frozeAt ? {frozenAt: T} : {});
    for (let y = 0; y < LH; y++) for (let x = 0; x < LW; x++) bb.set(LAP.x0 + x, LAP.y0 + y, s.get(x, y));
  }, mic: true});
  blitImg(fb, shoulder(mas({head: '34'}), 70, PAL.R3, 1, true), -38, 30);
});
S('26.10', 'F1.2: the call screen → render front BASE → EARLYWEB16 (f6-44) onto rooms-a drawTpoolDoor; f45 drawTpoolClose → front → rooms-b drawDarkDesk grain', (fb, k, _sh, f) => {
  if (k < 45) {
    const b = ui(); callChrome(b, {title: 'board sync', clock: null, controls: false}); board4(b, f, G4); tilePlate(b, G5[0].x, 150 + plateFallY(k)); wifi(b);
    const a = new Buf(480, RH, PAL.N0); putUI(a, b, false);
    const d0 = new Buf(480, RH, PAL.N0); drawTpoolDoor(d0, {f: k, lean: k < 30 ? 0 : 1});
    const bb = inPalette(d0, 'EARLYWEB16');
    const {pos, smear} = frontPos(k, 6, 20, RH);
    const out = new Buf(480, RH, PAL.N0);
    if (k < 6) out.c.set(a.c); else renderFront(out, a, bb, pos, {dir: 'down', smear});
    for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) fb.set(x, y, out.get(x, y));
    return;
  }
  const kk = k - 45;
  const a0 = new Buf(480, RH, PAL.N0); drawTpoolClose(a0, {f: kk, lean: 1});
  const a = inPalette(a0, 'EARLYWEB16');
  const bb = new Buf(480, RH, PAL.N0); drawDarkDesk(bb, 0, {tally: 2, carve: 0});
  const {pos, smear} = frontPos(kk, 20, 20, RH);
  const out = new Buf(480, RH, PAL.N0);
  if (kk < 20) out.c.set(a.c); else renderFront(out, a, bb, pos, {dir: 'down', smear});
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) fb.set(x, y, out.get(x, y));
});

// ================================================================== sc 26A · THAT NIGHT
S('26A.01', 'inserts-mas drawCarveInsert (a stroke a beat) → drawBrushInsert (f60) + DRIFT: the insert as one layer, 1 px / 8 f (11 px)', (fb, k) => {
  if (k < 60) drawCarveInsert(fb, k, Math.min(1, (beat(k) + 1) * 0.25));
  else drawBrushInsert(fb, k, brushStepAt(k - 60));
  shiftRoom(fb, -drift(k, 8, 11));
});
S('26A.02', 'twoshots drawDark2S + orbTally: the Orb counts 1, 2, 3, then his thumb (v2 26A.02)', (fb, k, sh) => v2(fb, '26A.02', k, sh));
const iris = (fb: Buf, look: [number, number], ap = 0.6) => {
  rect(0, 0, 480, RH, fb.ink(PAL.N0));
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const d = Math.hypot((x - 150) / 260, (y - 100) / 150);
    if (d < 0.5) fb.set(x, y, PAL.N1); else if (d < 0.8 && ((x * 7 + y * 3) % 5) < (0.8 - d) * 12) fb.set(x, y, PAL.N1);
  }
  drawOrb(fb, 262, 101, 84, {look, aperture: ap, monitor: -1});
};
S('26A.03', '[ECU·Orb] the iris full frame (orb-medium drawOrb r 84, procedural) + orbStep: thumb → his face (f8-14); toast rewinding… f24; WHIP-OUT f58', (fb, k) => {
  const look = orbStep(k, 8, [[0.35, 0.75], [0.2, 0.35], [-0.35, -0.1]], 3);
  iris(fb, look);
  if (k >= 24) toast(fb, 150, 150, 'rewinding…', k - 24);
});

// ================================================================== sc 27 · PASS ONE: THE BOARD'S SIDE (every screen keeps its bezel)
S('27.01', 'callgrid G4 in the [SCR] bezel; "super." through their laptop speaker (typed box, no portrait); WHIP-IN f0-1 (v2 27.01)', (fb, k, sh) => v2(fb, '27.01', k, sh));
S('27.02', '[MCU] NELEH right third, frameless (nelehPortrait) over her tile\'s world at 480x203 (nelehTileBg), soft 2; the page turns f6', (fb, k) => {
  MCU(fb, '27.02', (b) => nelehTileBg(b, 0, 0, 480, RH, true), nelehPortrait({...NELEH_PORTRAIT_DEFAULT, look: -1, gaze: 'down', lid: blink(k, 3)}), {third: 'R'});
  if (k >= 6 && k < 12) { rect(250, 166, 40, 26, fb.ink(PAL.P1)); rect(250, 166, 40, 1, fb.ink(PAL.P2)); }
});
/** the table insert's own PLAN sheet (steps 1-3 ticked, 4 a blank line, NELEH's word/? in 3 drawings); `ticks` < 3
 *  paints the later ticks out with the sheet (27.03 is before steps 2 and 3); a run of pencil after the last tick */
const steps27 = (fb: Buf, k: number, ticks: number, o: {word?: 0 | 1 | 2 | 3; tick1At?: number; run?: number} = {}) => {
  drawTableInsert(fb, {f: k, focus: 'blueprint', word: o.word ?? 0});
  const L = ['1. NOON · VIDEO CALL ', '2. BLOG POST ', '3. INTERIM CEO '];
  L.forEach((s, i) => {
    const x = 70 + textWidth(s) - 1, y = 82 + i * 20;
    const tickOn = i < ticks && !(i === 0 && o.tick1At !== undefined && k < o.tick1At);
    if (!tickOn) { const bg = fb.get(x - 3, y + 9); for (let j = -1; j < 9; j++) for (let q = 0; q < 10; q++) fb.set(x + q, y + j, bg); }
  });
  if (o.run !== undefined && o.run > 0) rect(70 + textWidth(L[0]) + 12, 86, Math.min(70, o.run), 1, fb.ink(PAL.C6));
};
S('27.03', '[HIGH] rooms-a drawTableInsert (blueprint) + the steps list (stand-in lettering): 1 ticks f4, the tick runs on to 2', (fb, k) => {
  steps27(fb, k, 1, {tick1At: 4, run: k >= 14 ? (k - 14) * 3 : 0});
});
S('27.04', 'kit.cards (stand-in): the dated quote card, moved to the board\'s side as step 2', (fb, k) => {
  quoteCard(fb, '"…not consistently candid in his communications with the board…"', '— THE NOPEAI BOARD · BLOG POST · NOV 17, 2023', k);
  return {full: true};
});
const rimaMCU = (fb: Buf, k: number, sh: ShotV3) => {
  held(fb, 'rima-spot', (b) => spotlight(b, 318, 70, 96));
  drawBust(fb, rimaSpeakPortrait({...RIMA_PORTRAIT_DEFAULT, mouth: mouth(sh, k, 'RIMA'), lid: blink(k, 5), hand: k < 4 ? 'none' : k < 12 ? (Math.floor(k / 4) % 2 ? 'smooth1' : 'smooth0') : 'none'}), {third: 'R'});
};
S('27.05', '[MCU] RIMA right third, frameless (rimaSpeakPortrait) under a hard circular spotlight on black; she smooths the jacket f4', (fb, k, sh) => { rimaMCU(fb, k, sh); });
S('27.05b', '[SCR·2-up] the call\'s two-up in the laptop bezel: drawNelehTile left, drawRimaTile right (call chrome)', (fb, k, sh, f) => {
  const b = sui();
  callChrome(b, {title: 'board sync', clock: null, controls: false});
  const r = gridLayout(2, {w: 214, h: 138, gap: 8, perRow: 2, area: {x: 0, y: CALL_BAR_H, w: SCR_W, h: SCR_H - CALL_BAR_H}});
  drawNelehTile(b, r[0].x, r[0].y, r[0].w, r[0].h, {mouth: mouth(sh, k, 'NELEH'), lid: 0, brow: 'query'}, {orbit: f});
  drawRimaTile(b, r[1].x, r[1].y, r[1].w, r[1].h, {mouth: mouth(sh, k, 'RIMA'), lid: 0}, {spot: 1});
  rect(r[0].x - 1, r[0].y - 1, r[0].w + 2, 1, b.ink(PAL.L3));
  putSCR(fb, b);
});
S('27.05c', '[MCU] the identical RIMA setup (the repeat is the joke) + the PLATE (was a card) typed on at f2', (fb, k, sh) => {
  rimaMCU(fb, k, sh);
  platePx(fb, 22, 150, 'RIMA TAMURI', 'CEO (WEEKEND EDITION)', k - 2, PAL.P2, pt, pw);
});
S('27.06', 'callgrid G4 [SCR] + callToast (GERG has left, f2) + his post (post-ui stand-in, f10) + keycaps pop f24 (v2 27.01a/27.02)', (fb, k, _sh, f) => {
  const b = sui(); call27(b, f);
  toast(b, 290, 150, 'GERG MOCKBRAN has left.', k - 2);
  if (k >= 10) postCard(b, 140, 50, 180, 'GERG MOCKBRAN', '…I quit.', k - 10, {col: PAL.L3});
  if (k >= 24) keycapRain(b, k - 24);
  putSCR(fb, b);
}, true);
S('27.07', 'rooms-b bullpen all-hands (ALLHANDS_TILES, one hand up) + drawAlyiStand in the doorway; the typed box (v2 27.06)', (fb, k, sh) => v2(fb, '27.06', k + 8, sh, 8));
const allhands = (b: Buf, alyi: boolean) => bullpenRoom(b, 0, {variant: 'allhands', door: 'open', handsUp: [22]}, {alyiDoor: alyi});
S('27.08', '[MCU·door] ALYI right third, frameless (alyiSpeakPortrait), half in shadow; the doorway jamb + leaf full height in front (flat shapes) over the all-hands, soft 1', (fb, k, sh) => {
  held(fb, 'mcu:27.08', (b) => { allhands(b, false); soft(b, 1); vignette(b, 318, 2); });
  drawBust(fb, alyiSpeakPortrait({mouth: mouth(sh, k, 'ALYI'), eyes: 'open', t: 0}), {third: 'R', dx: 6});
  dimRectL(fb, 318, 0, 162, RH, 2);
  doorFrame(fb, 282, 140, {leaf: 'right'});
});
const dimRectL = (b: Buf, x: number, y: number, w: number, h: number, k: number) => {
  for (let j = y; j < Math.min(RH, y + h); j++) for (let i = x; i < Math.min(480, x + w); i++) b.set(i, j, stepColor(b.get(i, j), -k));
};
let ALLHANDS_A: Record<string, [number, number]> | null = null;
const allhandsAnchors = () => (ALLHANDS_A ??= allhands(new Buf(480, 270, PAL.N0), false));
S('27.09', 'rooms-b all-hands wide (27.07 setup): the hand still up; Alyi steps back out of the doorway in whole-px steps (f4-16), then it holds empty', (fb, k) => {
  held(fb, 'allhands-noalyi', (b) => { allhands(b, false); });
  if (k < 17) {
    const dx = k < 4 ? 0 : Math.floor((k - 4) / 2) * 3;
    const [ax, ay] = allhandsAnchors().alyiDoorway;
    const clip = (x: number, y: number) => x >= DOOR_OPENING.x && x < DOOR_OPENING.x + 16 && y >= DOOR_OPENING.y && y < DOOR_OPENING.y + DOOR_OPENING.h;
    drawAlyiStand(fb, ax + dx, ay, {...ALYI_STAND_DEFAULT}, {clip});
  }
});
S('27.10', '[SCR] overhead: NELEH\'s phone face-up on the walnut beside the blueprint (drawTableInsert) + his post in its own UI (post-ui stand-in), 9:32 PM PT', (fb, k) => {
  held(fb, 'table-bp', (b) => drawTableInsert(b, {f: 0, focus: 'blueprint'}));
  const x = 150, y = 8, w = 180, h = 188;
  rect(x - 4, y - 4, w + 8, h + 8, fb.ink(PAL.N0)); rect(x - 3, y - 3, w + 6, 1, fb.ink(PAL.G3));
  rect(x, y, w, h, fb.ink(PAL.N1));
  postCard(fb, x + 8, y + 30, w - 16, '@mas', 'if i start going off, the nopeai board should go after me for the full value of my shares', k - 2, {ts: '9:32 PM PT'});
}, true);
const nelehHand = (fb: Buf, tx: number, ty: number) => { // STAND-IN (marked): Mas's click hand kit as her pen hand
  const H = clickHand({s: 4, E: 30, light: 'suite'});
  const [ox, oy] = H.anchors.tip;
  blitImg(fb, flipImg(H.img), tx - (H.img.w - 1 - ox), ty - oy);
  rect(tx - 1, ty - 1, 3, 3, fb.ink(PAL.N0));
};
S('27.11', '[HIGH] drawTableInsert (blueprint) + the CEO box + EQUITY: 0 stamp (stand-in lettering); her pen hand = inserts-hands clickHand (MARKED stand-in); tap f8', (fb, k) => {
  held(fb, 'table-bp', (b) => drawTableInsert(b, {f: 0, focus: 'blueprint'}));
  rect(150, 70, 150, 60, fb.ink(PAL.C7)); rect(152, 72, 146, 56, fb.ink(PAL.C1));
  pt(fb, 'CEO', 162, 80, PAL.C7); pt(fb, 'EQUITY:', 162, 100, PAL.C6); rect(206, 96, 60, 14, fb.ink(PAL.C5)); rect(207, 97, 58, 12, fb.ink(PAL.C1));
  rect(150, 138, 170, 14, fb.ink(PAL.R2)); pt(fb, 'EQUITY: 0 (HIS TESTIMONY)', 156, 141, PAL.P2);
  nelehHand(fb, k < 8 ? 300 : k < 10 ? 292 : 300, k < 8 ? 110 : 104);
}, true);
S('27.12', 'avalanche planPile / drawPile on the board\'s grid (G5 with Rima) in the [SCR] bezel; his eulogy post scrolls through (callgrid postChip) f20-104', (fb, k) => {
  const b = sui(); hearts(b, k);
  if (k >= 20 && k < 104) {
    const x = k < 30 ? SCR_W - Math.floor((k - 20) * 30) : k < 94 ? 30 : 30 - (k - 94) * 50;
    postChip(b, Math.max(-400, x), 80, '@mas', '…sorta like reading your own eulogy while you\'re still alive');
  }
  putSCR(fb, b);
});
S('27.12b', 'SCREEN MACRO 2/2: integer 2x of the bezel\'s pixels on MADA\'s tile; the one BLUE heart lands on his spinner (f3) and spins with it', (fb, k) => {
  const blue = heartPlan()[heartPlan().length - 1];
  const T = blue.land - 3 + k;
  const b = sui(); hearts(b, T);
  const full = new Buf(480, 270, PAL.N1); putSCR(full, b);
  macro2x(fb, full, 12 + SPIN_X, 10 + HG[2].y + 30);
});
S('27.13', 'twoshots drawBoard2S (boardroom plate, neleh-medium, mada-medium, ALYI in the glass): the buzz, every phone steps (f0)', (fb, k) => {
  drawBoard2S(fb, k, {neleh: {arm: 'marker'}, mada: {}, plate: {laptop: true, blueprint: 0, rolodex: true, plates: [{name: 'NELEH', x: 86}, {name: 'ALYI', x: 280}], phones: {lit: true, buzz: true, step: 1}}});
});
const board3 = boardBg({phones: {lit: true, buzz: false, step: 2}, reflection: null});
S('27.13b', '[MCU] NELEH LEFT third facing right (nelehPortrait flipped), the boardroom plate soft 2; footnotes', (fb, k, sh) => {
  MCU(fb, '27.13b', board3, nelehPortrait({...NELEH_PORTRAIT_DEFAULT, mouth: mouth(sh, k, 'NELEH'), lid: blink(k, 1), look: -1}), {third: 'L', flip: true});
});
S('27.14', '[OTS] over NELEH\'s right shoulder (her silhouette, the city\'s rim) onto the dark window: ALYI\'s reflection (alyiReflection) in the boardroom plate', (fb, k, sh) => {
  const bg = new Buf(480, 270, PAL.N0);
  const o: BoardPlateOpts = {laptop: false, rolodex: true, blueprint: 0, phones: {lit: true, buzz: k >= 2 && k < 8, step: 3},
    reflection: {img: alyiReflection({mouth: mouth(sh, k, 'ALYI'), eyes: 'open', t: k, mirror: true}), x: 60, y: 8, k: 1}};
  drawBoardPlate(bg, k, o); drawBoardPlateTable(bg, k, o); drawBoardPlateFront(bg, k, o);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const sx = x - 150; fb.c[y * 480 + x] = sx >= 0 ? bg.c[y * 480 + sx] : PAL.N1; }
  blitImg(fb, shoulder(nelehPortrait({...NELEH_PORTRAIT_DEFAULT, look: 1}), 64, PAL.C3, 1, true), -30, 28);
});
const phonesOverhead = (fb: Buf, k: number, step0: number, fallAt: number) => {
  held(fb, 'table-prop', (b) => drawTableInsert(b, {f: 0, focus: 'prop'}));
  const P = [[70, 40], [170, 70], [290, 30], [390, 60]];
  P.forEach(([x, y], i) => {
    const st = step0 + (k >= 4 ? 1 : 0) + (k >= 19 ? 1 : 0);
    const yy = y + st * 22;
    if (i === 1 && k >= fallAt) return; // tipped off the edge
    const tip = i === 1 && k >= fallAt - 6;
    rect(x, yy + (tip ? 6 : 0), 26, 50 - (tip ? 12 : 0), fb.ink(PAL.N0)); rect(x + 2, yy + 2 + (tip ? 6 : 0), 22, 44 - (tip ? 12 : 0), fb.ink(k % 6 < 3 ? PAL.C4 : PAL.C3));
  });
  rect(0, 196, 480, 7, fb.ink(PAL.N0)); rect(0, 195, 480, 1, fb.ink(PAL.D3)); // the table's edge
};
S('27.15', '[HIGH] drawTableInsert (walnut) + four phones (flat shapes) walking to the table edge a held step a beat (f4, f19); one tips off f30 (composite stand-in)', (fb, k) => {
  phonesOverhead(fb, k, 2, 30);
}, true);
S('27.16', '[MCU] NELEH left third, looking down at the fallen phone (nelehPortrait flipped, gaze down), the boardroom soft', (fb, k, sh) => {
  MCU(fb, '27.13b', board3, nelehPortrait({...NELEH_PORTRAIT_DEFAULT, mouth: mouth(sh, k, 'NELEH'), lid: 0, look: -1, gaze: 'down'}), {third: 'L', flip: true});
});
S('27.17', 'twoshots drawBoard2S: ALYI\'s reflection speaks (f3); it flickers out for 2 frames at the end and steadies', (fb, k, sh) => {
  const n = sh.e - sh.s;
  drawBoard2S(fb, k, {neleh: {arm: 'marker'}, mada: {}, alyi: {mouth: mouth(sh, k, 'ALYI'), flicker: k >= n - 7 && k < n - 5 ? 'gone' : 'there'},
    plate: {laptop: true, blueprint: 0, rolodex: true, plates: [{name: 'NELEH', x: 86}, {name: 'ALYI', x: 280}], phones: {lit: true, step: 4}}});
});
S('27.18', '[MCU·PF] NELEH left third looking at the blank line; the boardroom steps down behind her in held steps (the fallaway)', (fb, k) => {
  held(fb, 'mcu:27.18:bg', (b) => { board3(b); vignette(b, MCU_X.L + 56, 2); });
  soft(fb, 2 + Math.min(2, Math.floor(k / 5)));
  drawBust(fb, nelehPortrait({...NELEH_PORTRAIT_DEFAULT, lid: 0, look: -1, gaze: 'down'}), {third: 'L', flip: true});
});
S('27.19', '[HIGH] drawTableInsert (blueprint, 1-3 ticked) + her ? in three strokes (f10-22); her marker hand = clickHand stand-in (MARKED)', (fb, k) => {
  const w = (k < 10 ? 0 : k < 14 ? 1 : k < 18 ? 2 : 3) as 0 | 1 | 2 | 3;
  steps27(fb, k, 3, {word: w});
  const [wx, wy] = TABLE_INSERT.wordAt;
  nelehHand(fb, k < 10 ? 330 : wx + 18 + w * 14, k < 10 ? 170 : wy - 2);
}, true);
S('27.20', 'rooms-a boardroom wide: every phone over the edge; the speakerphone dials four tones (f2, 8, 14, 20) (v2 27.17, re-timed)', (fb, k) => {
  const n = k < 2 ? 0 : Math.min(4, Math.floor((k - 2) / 6) + 1);
  held(fb, `board-sp${n}`, (b) => boardRoom(b, 0, {blueprint: {word: false}, laptop: true, phones: {lit: false, step: 4}, speaker: Math.max(1, n)}, {neleh: {}, mada: true, alyi: true}));
});
S('27.21', '[ECU] lighthouse desk (plate stand-in, MARKED) + adelina drawThroneHandset lg, ringing; the (REPORTED) rail (v2 27.18)', (fb, k) => { deskInsert(fb, k, true, true); }, true);
const lhBg = (meters: 0 | 2) => (b: Buf) => lighthouseRoom(b, 0, {meters, ring1: 0}, {mario: false});
S('27.22a', '[MCU] MARIO right third, frameless (marioPortraitImg), the lamp turning in the window behind (lighthouse, soft 2); the finger rises', (fb, k, sh) => {
  MCU(fb, '27.22a', lhBg(0), marioPortraitImg({mouth: marioMouth(mouth(sh, k, 'MARIO')), blink: blink(k, 7), brow: 0, finger: k < 10 ? 0 : k < 12 ? 1 : 2, nod: 0}), {third: 'R', y: 18});
});
S('27.22b', 'rooms-b lighthouse wide + mario + adelina room sprites; the throne falls off the handset (throneImg, 3 drawings) at the click; typed box', (fb, k, sh) => {
  held(fb, 'lh-wide-ma', (b) => lighthouseRoom(b, 0, {meters: 0, ring1: 0}, {mario: true, adelina: true}));
  const l = lineOf(sh, 'a4-27-15');
  const click = l ? l.e + 1 : 30;
  if (k >= click) { const dy = k < click + 3 ? 0 : k < click + 6 ? 8 : 14; blitImg(fb, throneImg(k >= click + 6), 214, 70 + dy); }
});
S('27.23', '[MCU] the 27.22a setup, the second phone at his ear; the two RENT METERS kept SHARP behind him (soft layer with a keep mask)', (fb, k, sh) => {
  const keep = new Uint8Array(480 * 270);
  keepRect(keep, 92 - 32, 56 - 20, 70, 44); keepRect(keep, 330 - 32, 52 - 20, 70, 44);
  held(fb, 'mcu:27.23', (b) => { lhBg(2)(b); soft(b, 2, keep); });
  drawBust(fb, marioPortraitImg({mouth: marioMouth(mouth(sh, k, 'MARIO')), blink: blink(k, 7), brow: 1, finger: 1, nod: 0}), {third: 'R', y: 18});
});
S('27.24', 'rooms-a drawLobbyCam [SCR] (REC chrome) + mas-stand walk in a GUEST lanyard; his post upside-down in the corner from f10 (post-ui stand-in)', (fb, k) => {
  const b = new Buf(480, RH, PAL.N0);
  drawLobbyCam(b, {f: k, time: 'day'}, (bb) => {
    const x = CAM.PATH.x0 + Math.floor(on2(k) * 1.5);
    if (x < CAM.PATH.x1) drawMasStand(bb, x, CAM.PATH.feetY, {...MAS_STAND_DEFAULT, legs: masWalkAt(k), guest: true});
  });
  if (k >= 10) {
    const t = new Buf(CAM.POST_CORNER.w, CAM.POST_CORNER.h + 12, PAL.N0);
    postCard(t, 0, 0, CAM.POST_CORNER.w, '@mas', 'first and last time i ever wear one of these', 99);
    for (let j = 0; j < t.h; j++) for (let i = 0; i < t.w; i++) b.set(CAM.POST_CORNER.x + t.w - 1 - i, CAM.POST_CORNER.y + t.h - 1 - j, t.get(i, j));
  }
  putUI(fb, b, true);
}, true);
S('27.25', 'rooms-a boardroom wide (sticky CEO (TEMP); the spot swings in 3 held positions) + ttemme room sprite; the PLATE rides the wide f10 (was a card)', (fb, k, sh) => {
  v2(fb, '27.27', k, sh);
  platePx(fb, 22, 150, 'TTEMME', 'CEO (72 HOURS)', k - 10, PAL.U5, pt, pw);
});
S('27.26', '[HIGH] drawTableInsert (prop) + kits props hourglass L: the flip in 3 held drawings (f0, 4, 8), a grain a beat (v2 27.30)', (fb, k, sh) => v2(fb, '27.30', k, sh));
S('27.27', '[LOW·desk] TTEMME right third, frameless (ttemmePortrait, gaze sand) + the chat overlay; the table edge + the hourglass BIG in front (ttemme drawHourglass lg); RACK hourglass → him f6-11', (fb, k, sh) => {
  const st = rackStep(k, 6);
  const [kA, kB] = RACK[st]; // A = the hourglass (sharp first), B = TTEMME
  held(fb, `desk27:${kB}`, (b) => { boardBg({laptop: false, rolodex: 'still', blueprint: false})(b); soft(b, 2 + Math.max(0, kB - 1)); vignette(b, 330, 2); });
  drawBust(fb, ttemmePortrait({...TTEMME_PORTRAIT_DEFAULT, mouth: mouth(sh, k, 'TTEMME'), gaze: k < 8 ? 'sand' : 'cam', look: -1, brow: 'hype'}), {third: 'R', y: 22, faceK: kB});
  drawChatOverlay(fb, 440, 0, 40, RH, k);
  rect(0, 176, 480, 27, fb.ink(PAL.D1)); rect(0, 176, 480, 1, fb.ink(PAL.D3)); rect(0, 177, 480, 1, fb.ink(PAL.C2));
  const hgMask = new Uint8Array(480 * 270);
  const hb = new Buf(480, 270, 0x1000001);
  drawHourglass(hb, 150, 146, {sand: Math.max(0.05, 0.6 - k * 0.004)}, {size: 'lg'});
  // the hourglass at 2x nearest, standing on the table edge (MARKED stand-in: no insert-scale hourglass exists)
  for (let y = 60; y < 176; y++) for (let x = 90; x < 230; x++) {
    const v = hb.get(150 + ((x - 90) >> 1) - 20, 118 + ((y - 60) >> 1));
    if (v !== 0x1000001 && v !== undefined) { fb.set(x, y, kA ? stepColor(v, -kA) : v); hgMask[y * 480 + x] = 1; }
  }
});
S('27.28', 'twoshots drawBoard2S: the wall steps to slate (f0-8); the door appears (f15) in held steps and opens (f30); TASYA in it', (fb, k) => {
  const door = (k < 15 ? 0 : k < 20 ? 1 : k < 25 ? 2 : k < 30 ? 3 : 5) as 0 | 1 | 2 | 3 | 5;
  drawBoard2S(fb, k, {neleh: {arm: 'marker', head: k >= 20 ? 'front' : '34', brow: 'query'}, mada: {head: k >= 20 ? 'front' : '34'}, alyi: null,
    plate: {laptop: true, blueprint: 0, rolodex: true, slate: k >= 8, door, phones: {step: 4}}});
  if (door === 5) v2Tasya(fb);
});
const v2Tasya = (fb: Buf) => { // TASYA in the new door (his room sprite, clipped by the table)
  const t = new Buf(480, 270, 0x1000000);
  bullpenTasya(t);
  for (let y = BPLATE.door.y0; y < BPLATE.tableY; y++) for (let x = BPLATE.door.x0; x < BPLATE.door.x1; x++) { const c = t.get(x, y); if (c !== 0x1000000) fb.set(x, y, c); }
};
const bullpenTasya = (t: Buf) => drawTasyaRoom(t, Math.round((BPLATE.door.x0 + BPLATE.door.x1) / 2), BPLATE.tableY + 6, {...TASYA_ROOM_DEFAULT, arm: 'sign', light: 'slate'});
S('27.29', '[MCU·door] TASYA right third, frameless (tasyaSpeakPortrait, key ring jangling), framed by the new doorway (jamb + leaf shapes), slate light behind', (fb, k, sh) => {
  held(fb, 'mcu:27.29', (b) => { boardBg({slate: true, door: 5, laptop: false, rolodex: 'still'})(b); soft(b, 2); vignette(b, 318, 2); });
  drawBust(fb, tasyaSpeakPortrait({mouth: mouth(sh, k, 'TASYA'), lid: blink(k, 9), brow: 'warm', arms: 'ring', jangle: (Math.floor(k / 4) % 2) as 0 | 1}), {third: 'R', dx: 4});
  doorFrame(fb, 246, 172, {leaf: 'left', leafW: 58, light: PAL.N5});
});
S('27.30', '[HIGH] drawTableInsert (blueprint): 1-3 ticked, 4 blank but for her ?; her hand + capped marker at rest (clickHand stand-in, MARKED); NELEH (O.S.)', (fb, k) => {
  steps27(fb, k, 3, {word: 3});
  nelehHand(fb, 330, 160);
}, true);
S('27.31', '[MCU] MADA right third, frameless (madaPortrait) + his spinner, the boardroom soft; he doesn\'t answer', (fb, k) => {
  MCU(fb, '27.31', board3, madaPortrait({...MADA_PORTRAIT_DEFAULT, lid: blink(k, 4), look: -1}), {third: 'R'});
  drawSpinner(fb, MCU_X.R + 56, 16, k, {size: 'lg'});
});

// ================================================================== sc 28 · THE CARD
S('28.01', 'kit.cards (stand-in): the act-out card', (fb) => { actCard(fb, "WHAT THEY DIDN'T KNOW"); return {full: true}; }, true);

// ================================================================== sc 29 · PASS TWO: HIS SIDE
S('29.01', '[ECU] rooms-b drawDarkDesk from above: the glass, its water line one flat row (v2 29.00)', (fb, k, sh) => v2(fb, '29.00', k, sh));
S('29.02', 'inserts-mas drawPhone29Timeline: the true shot, eight identical posts hearted one a beat (feed = post-ui stand-in) (v2 29.03)', (fb, k, sh) => v2(fb, '29.03', k, sh));
S('29.03', 'twoshots drawDark2S + orbToLanyard: the iris steps off the phone onto the GUEST lanyard on beat 3 (v2 29.04)', (fb, k, sh) => v2(fb, '29.04', k, sh));
S('29.04', '[ECU·Orb] the iris full frame (drawOrb r 84), its look held on the lanyard (off frame); the V.O. band on the dark pool', (fb) => { iris(fb, [0.15, 0.85], 0.55); });
const darkMas = darkBg({phone: 'up', boardGrid: true});
S('29.05', '[MCU] MAS left third turned toward the Orb (masPortrait, monitor light) + the Orb soft at his far shoulder; RACK Mas → the Orb after the line (3 held steps)', (fb, k, sh) => {
  const l = lineOf(sh, 'a4-29-03');
  const st = rackStep(k, (l ? l.e : 18) + 1);
  const [kA, kB] = RACK[st];
  held(fb, `mcu:29.05:bg`, (b) => { darkMas(b); soft(b, 2); vignette(b, MCU_X.L + 56, 2); });
  const orb = new Buf(480, 270, 0x1000001);
  drawOrb(orb, 330, 60, 22, {look: [-0.8, 0.1], aperture: 0.5, monitor: -1});
  for (let i = 0; i < 480 * RH; i++) { const v = orb.c[i]; if (v !== 0x1000001) fb.c[i] = kB ? stepColor(v, -kB) : v; }
  drawBust(fb, mas({mouth: mouth(sh, k, 'MAS'), look: 1, head: 'front'}), {third: 'L', faceK: kA});
});
S('29.06', 'avalanche odometer + odoRoll: 505 · 650 · 700 · 745 / 770, the clunk (v2 29.05)', (fb, k, sh) => v2(fb, '29.05', k, sh));
S('29.07', 'kit.cards (stand-in): the dated quote card + the count in its corner (v2 29.06)', (fb, k, sh) => {
  v2(fb, '29.06', k, sh);
  pt(fb, '745 / 770', 480 - 12 - pw('745 / 770'), 8, PAL.L3);
  return {full: true};
}, true);
S('29.08', 'post-ui stand-in signature list (generic rows), stops 2 beats on ALYI (REPORTED) f15-44 (v2 29.07)', (fb, k) => {
  monitor(fb);
  rect(120, 10, 240, RH - 20, fb.ink(PAL.N1));
  const scroll = k < 15 ? Math.floor(k / 2) * 12 : 84;
  for (let i = 0; i < 24; i++) {
    const y = 30 + i * 12 - scroll;
    if (y < 14 || y > RH - 20) continue;
    if (i === 15) { rect(128, y - 2, 224, 11, fb.ink(k >= 15 ? PAL.N3 : PAL.N2)); pt(fb, 'ALYI (REPORTED)', 136, y, PAL.P2); continue; }
    rect(136, y + 1, 30 + ((i * 17) % 50), 5, fb.ink(PAL.G2)); rect(200 + ((i * 7) % 20), y + 1, 40 + ((i * 29) % 60), 5, fb.ink(PAL.G2));
  }
}, true);
S('29.09', '[ECU·Orb] the iris: to the name (f0), to Alyi\'s thumbnail in the monitor corner (f15), back to the name (f30); chime', (fb, k) => {
  iris(fb, orbStep(k, 0, [[-0.95, -0.15], [-0.85, 0.1], [-0.95, -0.15]], 15));
});
S('29.10', 'twoshots drawDark2S: the rack slot ejects the check tray-first (tray 1 → 4) · VOID IF CEO MISSING (plate\'s own check) (v2 29.08)', (fb, k, sh) => v2(fb, '29.08', k, sh));
S('29.11a', 'gerg-medium drawGergMediumPOV: the tile opens in 3 held steps; "One sec. Compiling—" lip-sync (v2 29.11)', (fb, k, sh) => v2(fb, '29.11', k, sh));
const darkGerg = darkBg({phone: 'up', screen: undefined});
S('29.11b', '[MCU] MAS left third facing his monitor (masPortrait, monitor light) over the dark plate soft 2 (templates panel 1); lip-sync', (fb, k, sh) => {
  MCU(fb, '29.11b', darkGerg, mas({mouth: mouth(sh, k, 'MAS'), look: -1}), {third: 'L'});
});
S('29.12', 'gerg-medium drawGergMediumPOV (the tile full on his monitor), lip-sync (v2 29.11b)', (fb, k, sh) => v2(fb, '29.11b', k, sh));
const quietMas = (fb: Buf, k: number, look: -1 | 0 | 1, green: boolean) => {
  held(fb, 'mcu:29q', (b) => { darkGerg(b); soft(b, 3); vignette(b, MCU_X.L + 56, 3); });
  if (green) for (let y = 30; y < 150; y++) for (let x = 0; x < 60; x++) if (((x + y + k) & 3) === 0) fb.set(x, y, PAL.L1);
  drawBust(fb, mas({look}), {third: 'L'});
};
S('29.13', '[MCU·PF] the QUIET BEAT: the 29.11b setup, the room falls away to the green + his cyan (fallaway as a lighting move)', (fb, k) => { quietMas(fb, k, -1, true); });
S('29.14', 'swaps-act4 drawGergTileWide: his tile fills the frame (the app\'s layout); he glances up into his camera, at Mas (v2 29.11c)', (fb, k, sh) => v2(fb, '29.11c', k, sh));
S('29.15', '[MCU·PF] the 29.13 setup; his look swaps from the monitor toward the lens; the green flickers on him (Gerg typing again)', (fb, k) => { quietMas(fb, k, 0, k % 4 < 2); });
S('29.16', 'twoshots drawDark2S: the slate door\'s held steps from "asked" (plate door 1 → 3 → 4); TASYA (O.S.) typed box', (fb, k, sh) => {
  const a = wordAt(sh, 'asked', 44);
  const d = k - a;
  const door = (d < 0 ? 0 : d < 15 ? 1 : d < 30 ? 2 : d < 45 ? 3 : 4) as 0 | 1 | 2 | 3 | 4;
  drawDark2S(fb, k, {mas: {arm: 'rest'}, orb: {look: DPLATE_LOOK.face}, plate: {tally: 3, lanyard: true, phone: 'up', door}});
});
S('29.17', '[MCU] MAS left third, not turning; the slate door (dark plate, door 4) soft over his right shoulder; RACK Mas → the door after the line', (fb, k, sh) => {
  const l = lineOf(sh, 'a4-29-08');
  const st = rackStep(k, (l ? l.e : 24) + 1);
  const [kA, kB] = RACK[st];
  const doorMask = new Uint8Array(480 * 270);
  keepRect(doorMask, DPLATE.door.x0 - 2, DPLATE.door.y0 - 2, DPLATE.door.x1 - DPLATE.door.x0 + 4, DPLATE.deskY - DPLATE.door.y0 + 4);
  held(fb, `mcu:29.17:${kB}`, (b) => {
    darkBg({phone: 'up', door: 4})(b);
    soft(b, 2, doorMask);
    softMask(b, kB, doorMask);
    vignette(b, MCU_X.L + 56, 2);
  });
  drawBust(fb, mas({mouth: mouth(sh, k, 'MAS'), look: -1}), {third: 'L', faceK: kA});
});
// ---- THE TILE AVALANCHE (8 bars): the v2 stack on its own clock, sampled per shot (T2 = the v2 avalanche frame)
const AV: Record<string, (k: number) => number> = {
  '29.18': (k) => k, '29.19': (k) => 40 + Math.floor(k * 1.3), '29.22': (k) => 225 + k, '29.25': (k) => 480 + Math.floor(k * 1.5), '29.26': (k) => 700 + Math.floor(k * 2.6),
};
S(['29.18', '29.19', '29.22', '29.25', '29.26'], 'avalanche planGridStack / drawGridStack on the board grid (his monitor full-bleed), sampled on the v2 stack\'s clock', (fb, k, sh) => {
  avalanche(fb, AV[sh.id](k));
});
S('29.20', '[OTS] over Mas\'s left shoulder (shoulder(masPortrait), the monitor light as his rim) onto the monitor across the dark room (dark plate soft 2): the stack in its screen (the screen\'s own pixels, 1:2)', (fb, k) => {
  const T = 110 + k * 4;
  const av = new Buf(480, 270, PAL.N0); avalanche(av, T);
  held(fb, 'ots29.20', (b) => { darkBg({phone: 'up'})(b); shiftRoom(b, 120); soft(b, 2); vignette(b, 90, 2); });
  const step = Math.floor(k / 3) % 2; // each landing steps the room's light
  if (step) dimRectL(fb, 0, 0, 480, RH, 1);
  const mx = 176, my = 18, mw = 240, mh = 102;
  rect(mx - 6, my - 6, mw + 12, mh + 12, fb.ink(PAL.N1)); rect(mx - 6, my - 6, mw + 12, 1, fb.ink(PAL.G2)); rect(mx - 1, my - 1, mw + 2, mh + 2, fb.ink(PAL.N0));
  for (let y = 0; y < mh; y++) for (let x = 0; x < mw; x++) fb.set(mx + x, my + y, av.get(x * 2, y * 2));
  rect(mx + mw / 2 - 10, my + mh + 6, 20, 16, fb.ink(PAL.N1));
  for (let y = my + mh + 6; y < RH; y++) for (let x = mx - 40; x < mx + mw + 40; x++) if (((x + y) & 3) === 0) fb.set(x, y, stepColor(fb.get(x, y), 1));
  blitImg(fb, shoulder(mas({look: -1}), 70, PAL.C6, 1, true), -34, 30);
});
const avMas = (fb: Buf, k: number, dim: number) => {
  held(fb, `mcu:29av:${dim}`, (b) => { darkBg({phone: 'up', screen: (scr: Buf) => { for (let y = 0; y < scr.h; y++) for (let x = 0; x < scr.w; x++) scr.set(x, y, ((x + y) % 4) ? PAL.S3 : PAL.N2); }})(b); soft(b, dim); vignette(b, MCU_X.L + 56, 2); });
  if (Math.floor(k / 4) % 2) dimRectL(fb, 0, 0, 480, RH, 1);
  drawBust(fb, mas({look: -1}), {third: 'L'});
};
S('29.21', '[MCU·PF] MAS left third, the monitor off frame left lighting him; each landing steps the room\'s light, never his face', (fb, k) => { avMas(fb, k, 2); });
S('29.28', '[MCU·PF] MAS left third watching the gap; the room stepped down until the small faces are its only light', (fb, k) => { avMas(fb, k, 4); });
const halfTile = (fb: Buf, T: number, paint: (b: Buf, x: number, y: number, w: number, h: number) => void, dx = 0) => {
  avalanche(fb, T); dimRectL(fb, 0, 0, 480, RH, 2);
  const w = 240, h = 136, x = 120 + dx, y = 30;
  rect(x - 2, y - 2, w + 4, h + 4, fb.ink(PAL.N0));
  paint(fb, x, y, w, h);
};
S('29.23', '[POV·half] ALYI\'s tile (drawAlyiTile) half-frame, shoved sideways; it resists one beat (f10-24), then slides off the edge', (fb, k) => {
  const dx = k < 10 ? -Math.floor(k * 2) : k < 25 ? -20 : -20 - (k - 25) * 18;
  halfTile(fb, 260, (b, x, y, w, h) => drawAlyiTile(b, x, y, w, h, {mouth: 'rest', eyes: 'open', t: k}), dx);
});
S('29.24', '[POV·half] NELEH\'s tile (drawNelehTile) half-frame, her footnotes scattering; on "char" the tile leaves the frame', (fb, k, sh) => {
  const l = lineOf(sh, 'a4-29-09');
  const out = l ? l.e : 37;
  const dx = k < out ? Math.floor(k / 3) : 400;
  halfTile(fb, 370, (b, x, y, w, h) => {
    drawNelehTile(b, x, y, w, h, {mouth: mouth(sh, k, 'NELEH'), lid: 0, brow: 'query'}, {orbit: k, scatter: k});
  }, dx);
  if (k < out) scatter(fb, 240 + dx, 80, k, {n: 12, digits: true, seed: 5, col: PAL.W8, life: 30});
});
S('29.27', '[ECU] the glass on the desk (the 29.01 plate), its water line flat while the monitor\'s light flickers on it', (fb, k, sh) => {
  v2(fb, '29.00', k, sh);
  if (Math.floor(k / 3) % 2) dimRectL(fb, 0, 0, 480, RH, 1);
});
S('29.29', '[POV·half] MADA\'s tile wedged in the one gap, every tile around him pressing; f45 the frame holds half-frame on him (drawMadaTile)', (fb, k) => {
  avalanche(fb, 790 + k);
  if (k >= 45) { rect(119, 29, 242, 138, fb.ink(PAL.N0)); drawMadaTile(fb, 120, 30, 240, 136, {mouth: 'rest', lid: 0, nod: 0}, {spin: k}); }
});
S('29.30', '[POV·half] the same half tile: his label flips on the downbeat (3 held steps) and holds its read (callgrid label stand-in)', (fb, k) => {
  avalanche(fb, 850); rect(119, 29, 242, 138, fb.ink(PAL.N0)); drawMadaTile(fb, 120, 30, 240, 136, {mouth: 'rest', lid: 0, nod: 0}, {spin: 60 + k, stopped: false});
  const st = Math.min(3, Math.floor(k / 2) + 1);
  const h = [0, 7, 14, 22][st];
  rect(120, 166 - h, 240, h, fb.ink(PAL.N0));
  if (st >= 3) { pt(fb, 'MADA · LAST FIRER STANDING', 126, 146, PAL.G6); pt(fb, 'ANSWERS GIVEN: 0', 126, 156, PAL.P1); }
});

// ================================================================== sc 30 · THE RETURN
S('30.01', '[P2] BOX (the act\'s one deliberate box): twoshots drawDoorwayP2 re-timed: hearts f99/112/128 off the grid, Alyi looks up f134, the IOU f140; post-ui stand-in', (fb, k, sh) => {
  drawDoorwayP2(fb, k, {hearts: [99, 112, 128], alyi: {mouth: mouth(sh, k, 'ALYI'), up: k >= 134}, iou: (k < 140 ? 0 : Math.floor(k / 4) % 2 ? 1 : 2) as 0 | 1 | 2, openL: Math.min(1, (k + 1) / 3), openR: Math.min(1, (k + 1) / 3)});
  if (k >= 6 && k < 99) postCard(fb, 150, 130, 190, 'ALYI', 'I deeply regret my participation in the board\'s actions.', k - 6);
});
const stepOf = (k: number, t: number) => (k < t ? 0 : k < t + 5 ? 1 : k < t + 10 ? 2 : 3);
S('30.03', 'rooms-b bullpenLandlord (THE LANDLORD, one wide clocked by the line): floor / ceiling / walls in 3 held steps on "below / above / around" + tasya room sprite; typed box', (fb, k, sh) => {
  const L = {floor: stepOf(k, wordAt(sh, 'below', 24)), ceiling: stepOf(k, wordAt(sh, 'above', 45)), walls: stepOf(k, wordAt(sh, 'around', 66))};
  held(fb, `land-${L.floor}${L.ceiling}${L.walls}`, (b) => bullpenRoom(b, 0, {variant: 'walkout'}, {mas: true, tasya: {arm: 'clasp'}, landlord: L}));
});
S('30.06', '[MCU·PF] MAS left third, eyes down (swaps-act4 masLookDown, warm) over the all-slate bullpen soft (tall-bust stand-in: the helper\'s extension)', (fb, k, sh) => {
  MCU(fb, '30.06', (b) => bullpenRoom(b, 0, {variant: 'walkout'}, {mas: false, tasya: null, landlord: {floor: 3, ceiling: 3, walls: 3}}),
    masLookDown({mouth: mouth(sh, k, 'MAS'), brow: 0, light: 'warm'}), {third: 'L', softK: 2 + Math.min(1, Math.floor(k / 10))});
});
S('30.06b', '[HIGH·floor] his eyeline: the slate floor from above (flat tiles in the bullpen\'s own slate floor colours, sampled from rooms-b landlord 3) + his shoe tips at the top edge (stand-in); TASYA (O.S.)', (fb) => {
  held(fb, 'floor30', (b) => {
    const room = new Buf(480, 270, PAL.N0);
    bullpenRoom(room, 0, {variant: 'walkout'}, {mas: false, tasya: null, landlord: {floor: 3, ceiling: 3, walls: 3}});
    const count = new Map<number, number>();
    for (let y = 186; y < RH; y++) for (let x = 0; x < 480; x++) { const c = room.get(x, y); count.set(c, (count.get(c) ?? 0) + 1); }
    const [c0, c1, c2] = [...count.entries()].sort((a, z) => z[1] - a[1]).map((e) => e[0]).concat([PAL.N3, PAL.N4, PAL.N2]);
    for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
      const gx = (x + 12) % 48, gy = (y + 20) % 48;
      b.set(x, y, gx === 0 || gy === 0 ? c2 : ((x >> 4) + (y >> 4)) % 2 && ((x * 7 + y * 13) % 11 === 0) ? c1 : c0);
    }
    for (const sx of [194, 262]) { rect(sx, 0, 24, 12, b.ink(PAL.N0)); rect(sx + 2, 12, 20, 4, b.ink(PAL.N0)); rect(sx + 4, 13, 16, 1, b.ink(PAL.N3)); }
  });
}, true);
S('30.07', 'twoshots drawMadaM (boardroom plate fires, mada-medium): perfectly still among the fires; WHIP-OUT to the door on the bang (v2 30.09)', (fb, k, sh) => v2(fb, '30.09', k, sh));
S('30.08', 'rooms-a boardroom wide (FIRES_SC30): the door bangs open (SHAKE_DOOR), TERB in; the helmet pops on at f20; WHIP-IN f0-1', (fb, k) => {
  boardRoom(fb, k, {fires: FIRES_SC30, door: 'open', doorFlash: k === 0 ? 1 : 0, rolodex: 'still', plates: {A: null, B: 'ALYI', C: null, D: 'NELEH', E: 'THE QUIET VOTE'}},
    {mada: true, terb: {x: 394 - Math.floor(on2(k) * 1.5), pose: {legs: terbWalkAt(k), helmet: k >= 20, arm: 'carry'}}, shake: doorShake(k, 0)});
});
S('30.09', 'FULL FREEZE: the boardroom 2-tone, Mas in colour (mas-stand walk → reach → pocket) pulls the pin f24-48; engine nameCard TERB (kit.cards stat: stand-in)', (fb, k, _sh, f) => {
  held(fb, 'board-freeze', (b) => { boardRoom(b, 0, {fires: FIRES_SC30, door: 'open', rolodex: 'still', plates: {A: null, B: 'ALYI', C: null, D: 'NELEH', E: 'THE QUIET VOTE'}}, {mada: true, terb: {x: 368, pose: {legs: 'stand', helmet: true, arm: 'carry', pin: true}}}); freezePrint(b); });
  const x = Math.min(330, 150 + on2(Math.max(0, k - 4)) * 5);
  drawMasStand(fb, x, 196, {...MAS_STAND_DEFAULT, legs: x < 330 ? masWalkAt(k) : 'stand', arm: k < 40 ? 'down' : k < 50 ? 'reach' : 'pocket', light: 'room'});
  blipCard(fb, k, 'TERB', 'TERB', 'CHAIRS BOARDS ON FIRE', 'EXTINGUISHERS: 1', {f, x: {helmet: true}}, 'L');
}, true);
S('30.10', '[ECU] terb drawPinTag (DO NOT REMOVE) over the held freeze · his fingers on the pin: a labelled box (hand CHECK) (v2 30.12)', (fb, k, sh) => v2(fb, '30.12', k, sh), true);
const firesBg = boardBg({...FIRES_BG, fires: FIRES_M});
S('30.11a', '[MCU] TERB right third, frameless (terbPortrait, helmet) over the fires boardroom plate, soft 2; procedural', (fb, k, sh) => {
  MCU(fb, '30.11a', firesBg, terbPortrait({...TERB_PORTRAIT_DEFAULT, mouth: mouth(sh, k, 'TERB'), lid: blink(k, 2), look: -1}), {third: 'R'});
});
S('30.11b', 'rooms-a boardroom wide (fires): everyone looks around (held drawings f0-14), "…Ah." (f15); typed box', (fb, k) => {
  held(fb, `board-fires-w${k < 15 ? Math.floor(k / 5) % 2 : 2}`, (b) => boardRoom(b, 0, {fires: FIRES_SC30, door: 'open', rolodex: 'still', plates: {A: null, B: 'ALYI', C: null, D: 'NELEH', E: 'THE QUIET VOTE'}}, {mada: true, terb: {x: 360 + (k < 15 ? (Math.floor(k / 5) % 2) * 2 : 0), pose: {legs: 'stand', helmet: true, arm: 'carry', pin: false}}}));
});
S('30.12', 'twoshots drawCalmOff2S: THE CALM-OFF placed: two still men; Terb sprays behind them; keycaps; TERB (O.S.) typed box (v2 30.14)', (fb, k, sh) => v2(fb, '30.14', k, sh));
S('30.13', '[OTS] over Mas\'s left shoulder (shoulder(masPortrait), the fires\' rim W3) onto MADA (twoshots drawMadaM) (templates panel 3); lip-sync', (fb, k, sh) => {
  drawMadaM(fb, k, {mada: {head: '34', look: -1, mouth: mouth(sh, k, 'MADA')}, plate: {fires: FIRES_CALMOFF(), laptop: false, rolodex: 'still'}});
  blitImg(fb, shoulder(mas(), 60, PAL.W3, 1, true), -34, 36);
});
S('30.14', '[MCU] MAS left third, near-front (masPortrait head front, warm), eyes toward Mada, the fires soft behind; one beat late', (fb, k, sh) => {
  MCU(fb, '30.14', boardBg(FIRES_BG), mas({mouth: mouth(sh, k, 'MAS'), look: 1, head: 'front', light: 'warm'}), {third: 'L'});
});
S('30.15', 'twoshots drawCalmOff2S: HOLD 2 BEATS (the long hold); the spinner stops f18, the nod f24; Terb\'s hand stamps the term sheet f30, hands it to both f44', (fb, k) => {
  const nod = (k < 24 ? 0 : k < 26 ? 1 : k < 28 ? 2 : k < 30 ? 1 : 0) as 0 | 1 | 2;
  drawCalmOff2S(fb, k, {mada: {nod}, spin: Math.min(k, 18), stopped: k >= 18, terb: null,
    plate: {fires: FIRES_CALMOFF(-40), keycaps: 40, termSheet: k < 30 ? 'none' : k < 36 ? 'blank' : 'stamped', terbHand: k < 30 ? 'none' : k < 44 ? 'stamp' : 'hand'}});
});
S('30.16', 'post-ui stand-in: his phone lit green + GERG\'s post; keycaps pop from the bottom (v2 30.20)', (fb, k, sh) => v2(fb, '30.20', k, sh), true);
S('30.17', '[MCU·PF] MAS left third, 3/4 down reading; the boardroom (fires) stepped down; his face doesn\'t change', (fb) => {
  MCU(fb, '30.17', boardBg(FIRES_BG), masLookDown({mouth: 'rest', brow: 0, light: 'warm'}), {third: 'L', softK: 3});
});
S('30.18', '[HIGH] drawTableInsert (prop) + kits props hourglass L: the last grain; TTEMME\'s post pops f4 (post-ui stand-in); the shatter on the post\'s last beat (f105)', (fb, k) => {
  drawTableInsert(fb, {f: k, focus: 'prop'});
  const [px, py] = TABLE_INSERT.prop;
  const N = hourglassGrains('L');
  hourglass(fb, px - 16, py - 58, {size: 'L', moved: k < 12 ? N - 1 : N, running: k < 12, f: k, shatter: k >= 105 ? k - 105 : undefined});
  if (k >= 58 && k < 105) { // review-v3: the glass takes the strain before it goes (1 px hairlines, in sync with the mix's cracks)
    const cx = px - 16 + 11, gy = py - 58 + 3;
    const px1: Array<[number, number]> = [[7, 5], [6, 6], [6, 7], [5, 8]];
    const px2: Array<[number, number]> = [[-5, 21], [-4, 22], [-4, 23], [-3, 24]];
    const run: Array<[number, number]> = [[4, 9], [4, 10], [3, 11], [-2, 25]];
    for (const [i, j] of px1) fb.set(cx + i, gy + j, PAL.C9);
    if (k >= 88) for (const [i, j] of px2) fb.set(cx + i, gy + j, PAL.C9);
    if (k >= 100) for (const [i, j] of run) fb.set(cx + i, gy + j, PAL.C9);
  }
  if (k >= 4) postCard(fb, 20, 20, 220, 'TTEMME', 'I am deeply pleased by this result, after ~72 very intense hours of work.', k - 4);
}, true);
S('30.19', '[LOW] the lobby at night (rooms-a drawLobby) cropped on the sign: the sign looming at the top, Mas small at the desk; the sign ignites (1,2,1,2,3) (crop stand-in, not a true low angle)', (fb, k) => {
  const IG = [1, 2, 1, 2, 3] as const;
  const sign = (k < 6 ? 0 : IG[Math.min(4, Math.floor((k - 6) / 3))]) as 0 | 1 | 2 | 3;
  held(fb, `lobby-low${sign}`, (b) => {
    const room = new Buf(480, 270, PAL.N0);
    lobbyRoom(room, 0, {sign}, {});
    const dx = 240 - Math.round((LOBBY.SIGN.x0 + LOBBY.SIGN.x1) / 2), dy = 24;
    for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, room.get(clamp(x - dx, 0, 479), clamp(y - dy, 0, RH - 1)));
  });
}, true);
S('30.20', '[ECU] rooms-a drawSignFloorInsert: a small box of spare 0 plates set down under the sign · the maintenance hand: a labelled box (v2 30.23)', (fb, k) => {
  drawSignFloorInsert(fb, {f: k, box: k < 12 ? 0 : k < 22 ? 1 : 2});
  if (k < 24) box(fb, 250, 100, 120, 44, 'HAND NEW: a maintenance hand (hand only)', {fill: null});
}, true);
S('30.21', '[OTS-W] over Mas\'s left shoulder (shoulder(masPortrait), tungsten rim) onto the lobby wide; the 1993 dialog: Cancel greys 3 held beats; the arrow clicks f45 (bonk)', (fb, k, sh) => {
  v2(fb, '30.24', k, sh);
  blitImg(fb, shoulder(mas({look: 1}), 70, PAL.W5, 1, true), -40, 40);
});
S('30.22', 'mas-cu drawMasCU (lobby): [CU] 2 of 2, the same ONE silent drawing, the tungsten behind him (v2 30.25)', (fb, k, sh) => v2(fb, '30.25', k, sh));
S('30.23', 'inserts-mas drawNudgeInsert (lobby): the glass set down, the nudge one pixel true (f8); "okay." over the hands (typed box)', (fb, k) => {
  drawNudgeInsert(fb, 'lobby', k < 4 ? 'held' : k < 8 ? 'set' : 'nudge');
});

// ================================================================== sc 31 · THE BACK WALL
S('31.01', 'inserts-props drawVaultInsert: Q*, the sticky note, the hum on F (v2 31.01)', (fb, k, sh) => v2(fb, '31.01', k, sh));
S('31.02', '[MCU-2] the frameless 50/50: MAS left (turned away) + GERG right (gergGlow, the green under his chin) over the bullpen by day soft 1; the vault between them (labelled box: no room-scale vault); RACK to the note; Gerg walks out', (fb, k, sh) => {
  const l = lineOf(sh, 'a4-31-02');
  const r0 = (l ? l.e : 40) + 2;
  const st = rackStep(k, r0);
  const [kA, kB] = RACK[st];
  held(fb, `mcu2:31.02:${kB}`, (b) => {
    drawBullpen(b, 0, {door: 'shut'});
    const vm = new Uint8Array(480 * 270); keepRect(vm, 208, 110, 64, 70);
    soft(b, 1, vm); vignette(b, 158, 1); vignette(b, 330, 1);
    rect(208, 110, 64, 70, b.ink(PAL.G1)); rect(208, 110, 64, 1, b.ink(PAL.G4)); rect(214, 118, 52, 54, b.ink(PAL.G2));
    pt(b, 'Q*', 232, 126, PAL.P1); rect(244, 140, 18, 14, b.ink(PAL.W7)); pt(b, 'VAULT', 222, 160, PAL.U5);
    if (kB) softMask(b, kB, vm);
  });
  const gx = k < r0 + 20 ? 0 : Math.floor((k - r0 - 20) / 2) * 6;
  drawBust(fb, mas({mouth: mouth(sh, k, 'MAS'), look: -1}), {third: 'L', dx: -8, y: 24, faceK: kA});
  if (gx < 200) drawBust(fb, gergGlow({mouth: mouth(sh, k, 'GERG'), lid: k >= r0 + 12 ? 0 : 1, look: -1}), {third: 'R', dx: 14 + gx, y: 26 + (k >= r0 + 16 && k < r0 + 19 ? 1 : 0), faceK: kA});
}, true);
S('31.03', '[MCU] MAS left third at his desk reading the memo aloud (masPortrait, warm) over the bullpen (door shut, nameplate) soft (tall-bust stand-in); lip-sync', (fb, k, sh) => {
  MCU(fb, '31.03', (b) => drawBullpen(b, 0, {door: 'shut'}), mas({mouth: mouth(sh, k, 'MAS'), look: 0, light: 'warm'}), {third: 'L', softK: 1});
});
S('31.04', 'rooms-a drawChairBackInsert: four screws, four beats; the plate comes off f55 · the worker\'s hand: a labelled box (v2 31.07)', (fb, k, sh) => v2(fb, '31.07', k, sh), true);
S('31.05', 'rooms-b bullpen (window corner) · prop.observer-chair NEW: a labelled box (unfolds, 4 drawings); the key ring drops f45 (v2 31.09, re-timed)', (fb, k) => {
  held(fb, 'bull-shut', (b) => bullpenRoom(b, 0, {door: 'shut'}, {}));
  const u = Math.min(4, Math.floor(k / 4));
  box(fb, 372, 96, 96, 84, `PROP NEW: MACROSOFT-blue folding chair (unfold ${u}/4)`, {fill: PAL.N2});
  if (u >= 4) { rect(384, 140, 72, 16, fb.ink(PAL.G4)); pt(fb, 'OBSERVER', 390, 142, PAL.P2); pt(fb, '(NON-VOTING)', 386, 150, PAL.P1); }
  if (k >= 45) { const y = Math.min(132, 60 + (k - 45) * 6); rect(412, y, 8, 5, fb.ink(PAL.W5)); rect(414, y + 1, 4, 3, fb.ink(PAL.N0)); }
}, true);

// ================================================================== checks
export const missingShots3 = (ids: string[]) => ids.filter((id) => !DRAW3[id]);
void clamp; void bust; void bezel; void employeeFace; void callToast; void shove; void B4; void S5; void lhHeld; void dimRoom; void fallaway;
void phoneScreen; void call27; void callDialog; void dialogButton; void talking; void lastLineEnd; void DPLATE; void MCU_X;
