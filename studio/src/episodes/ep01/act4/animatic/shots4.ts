// MR. MAS — Ep1 Act Four · THE EDITOR's animatic v4: one layout per shot of timing lock v4 (owned by THE EDITOR).
// Board v4.1 (edit-plan-v4 §3, and §10 for the finishing pass) plays the act as 8 sequences in 79 shots. v4.1 cut S4.05,
// S5.07, S6.05 (merged into S6.06), S7.04 and S7.12, and added S5.09b (Gerg's glance) and S7.02b (Tasya's MCU); the
// other IDs are kept so the newcomer, insider and audit notes still point at the right shots. v4.2 (the closing pass,
// edit-plan-v4 §11) cuts S3.08 and S5.10 from the board (their layouts stay registered, unused), puts Alyi's role on the
// noon cursor's tag and lights Cancel under it, hangs Tasya's sign on the slate door (S5.11, S5.12), trims Mario's plate,
// and steps the lobby's empty-tagged arrow in on the beats like the noon one. Most v4 shots hold what v3 cut into several:
// a v4 layout is either a v3 layout run through the `v3()` adapter (re-clocked on v4's lines and story marks), several
// v3 layouts chained on ONE clock inside one shot (the call, the avalanche, the Terb wide), or a new composition of
// the same kit pieces (THE PLAN's one sheet, the split, the letter page, the check, the term sheet, the refused dialog).
// Story points come from the lock (`sh.marks`, shot-relative frames), so the picture and the sound pass share one clock.
// `k` is shot-relative, `f` the act frame. Nothing is scaled except a screen's own pixels (and the two MARKED stand-ins
// v3 already carried: the 2x hourglass and the 1:2 screen thumbnails).
import {Buf, rect, clamp} from '../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../shared/pixel/palette';
import {inPalette} from '../../../../shared/pixel/palettes';
import type {GlyphLayer} from '../../../../shared/pixel/glyph';
import {renderFront, frontPos} from '../../../../shared/pixel/transitions';
import {blitImg} from '../../../../shared/pixel/figure';
import type {Viseme} from '../../../../shared/pixel/cast/talk';
import {shakeAt, SHAKE_DOOR} from '../../../../shared/pixel/sprite';
import {
  gridLayout, callChrome, drawTile, TileRect, captureTile, tileDrop, slideTiles, callDialog, dialogButton, drawPointer, pointerAt,
  typedDots, tilePlate, dropY, postChip, CALL_BAR_H, employeeFace,
} from '../../../../shared/pixel/kits/callgrid';
import {shove, scatter, drawGridStack, landedBy} from '../../../../shared/pixel/kits/avalanche';
import {odometer, odoRoll, LETTER_STOPS} from '../../../../shared/pixel/kits/avalanche';
import {drawDarkDesk, DARKDESK} from '../../../../shared/pixel/rooms/darkroom';
import {drawGergTileWide} from '../../../../shared/pixel/cast/swaps-act4';
import {BRUSH_STEPS} from '../../../../shared/pixel/kits/inserts-mas';
import {DPLATE, DPLATE_LOOK} from '../../../../shared/pixel/rooms/darkroom-plate';
import {drawBoardPlate, drawBoardPlateTable, drawBoardPlateFront} from '../../../../shared/pixel/rooms/boardroom-plate';
import type {BoardPlateOpts} from '../../../../shared/pixel/rooms/boardroom-plate';
import {FIRES_SC30, drawTableInsert, TABLE_INSERT, drawChairBackInsert} from '../../../../shared/pixel/rooms/boardroom';
import {drawBullpen, DOOR_OPENING} from '../../../../shared/pixel/rooms/bullpen';
import {drawLobbyCam, CAM, drawSignFloorInsert} from '../../../../shared/pixel/rooms/lobby';
import {drawTpoolDoor} from '../../../../shared/pixel/rooms/tpool-door';
import {drawDark2S, drawBoard2S, drawCalmOff2S, FIRES_CALMOFF, drawDoorwayP2, drawMadaM} from '../../../../shared/pixel/rooms/twoshots';
import {drawLaptopInsert, LAPTOP_INSERT} from '../../../../shared/pixel/rooms/vegas-suite';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../shared/pixel/cast/mas';
import type {MasPortraitState} from '../../../../shared/pixel/cast/mas';
import {nelehPortrait, NELEH_PORTRAIT_DEFAULT, drawNelehTile} from '../../../../shared/pixel/cast/neleh';
import {madaPortrait, MADA_PORTRAIT_DEFAULT, drawSpinner, drawMadaTile} from '../../../../shared/pixel/cast/mada';
import {rimaSpeakPortrait, RIMA_PORTRAIT_DEFAULT} from '../../../../shared/pixel/cast/rima-speak';
import {alyiReflection, drawAlyiStand, ALYI_STAND_DEFAULT, drawAlyiTile} from '../../../../shared/pixel/cast/alyi-speak';
import {ttemmePortrait, TTEMME_PORTRAIT_DEFAULT, drawChatOverlay} from '../../../../shared/pixel/cast/ttemme';
import {tasyaSpeakPortrait} from '../../../../shared/pixel/cast/tasya-speak';
import {terbWalkAt} from '../../../../shared/pixel/cast/terb';
import {drawAdelinaRoom, ADELINA_ROOM_DEFAULT} from '../../../../shared/pixel/cast/adelina';
import {gergGlow} from '../../../../shared/pixel/cast/gerg-speak';
import {drawGergMediumPOV} from '../../../../shared/pixel/cast/gerg-medium';
import {drawMasCU, drawEyesStrip} from '../../../../shared/pixel/cast/mas-cu';
import {drawMasStand, MAS_STAND_DEFAULT, masWalkAt} from '../../../../shared/pixel/cast/mas-stand';
import {drawOrb, orbStep} from '../../../../shared/pixel/cast/orb-medium';
import {drawNudgeInsert, drawClickInsert, drawStripTapInsert, StripHand, drawCarveInsert, drawBrushInsert, brushStepAt} from '../../../../shared/pixel/kits/inserts-mas';
import {clickHand} from '../../../../shared/pixel/kits/inserts-hands';
import {hourglass, hourglassFlip, hourglassGrains} from '../../../../shared/pixel/kits/props';
import {drawVaultInsert} from '../../../../shared/pixel/kits/inserts-props';
import {flipImg} from '../../../../shared/pixel/sprite';
import {drawPlan4} from './plan4';
import {boardRoom, bullpenRoom, lighthouseRoom, lobbyRoom, doorShake} from './backs';
import {RH, held, fallaway, postCard, toast, freezePrint, blipCard, actCard, box, bezel, putUI, pt, pw, pwrap, bpt, bpw, dimRoom, ACCENT} from './lay';
import {
  DRAW as V2, G5, G4, ui, wifi, board4, masTileState, call26, sui, putSCR, DLG, dialog26, CANCEL, keycapRain, hearts, heartPlan, SCR_W, SCR_H, HG,
  S4, monitor, phoneScreen, stackPlan, STACK, B4, AT, SLOT, LIFT, SY0, BOARD4, PLAN29,
} from './shots';
import {DRAW3} from './shots3';
import {SHOTS as SHOTS_V3} from './data-v3';
import type {ShotV3, LineV3} from './data-v3';
import {SHOTS as SHOTS_V2} from './data-v2';
import type {ShotV2, LineV2} from './data-v2';
import type {ShotV4} from './data-v4';
import {soft, softMask, keepRect, vignette, shoulder, drawBust, mcuRoom, MCU_X, McuOpts, rackStep, RACK, drift, shiftRoom, spotlight, doorFrame, platePx} from './framing';
import {drawPhone29Timeline, drawPhoneInsert29, feedStandIn, heartTapAt, PHONE29, RIMA_POST} from '../../../../shared/pixel/kits/inserts-mas';
import {wrap as wrapF} from '../../../../shared/pixel/font';
import {drawDarkPlate, drawDarkPlateDesk, drawDarkPlateFront} from '../../../../shared/pixel/rooms/darkroom-plate';
import type {DarkPlateOpts} from '../../../../shared/pixel/rooms/darkroom-plate';
import {textWidth} from '../../../../shared/pixel/font';
import {SEQS} from './data-v4';

export interface ShotOut4 { layers?: GlyphLayer[]; full?: boolean; noVo?: boolean; print?: 'blueprint'; caption?: string }
type Draw4 = (fb: Buf, k: number, sh: ShotV4, f: number) => ShotOut4 | void;
export interface ShotDef4 { draw: Draw4; st: string; standin: boolean }
export const DRAW4: Record<string, ShotDef4> = {};
/** register. `st` = what the layout is built from (the margin prints it); `standin` = it still holds a stand-in */
const S = (ids: string | string[], st: string, draw: Draw4, standin = false) => { for (const id of ([] as string[]).concat(ids)) DRAW4[id] = {draw, st, standin}; };
const on2 = (k: number) => k - (k % 2);
const mk = (sh: ShotV4, name: string, dflt: number) => sh.marks[name] ?? dflt;
const len = (sh: ShotV4) => sh.e - sh.s;

// ================================================================== adapters: run a v3 (or v2) layout on a v4 shot's clock
const V3SH = new Map(SHOTS_V3.map((s) => [s.id, s]));
const V2SH = new Map(SHOTS_V2.map((s) => [s.id, s]));
/** a v3 shot record carrying THIS v4 shot's lines, shifted by kOff onto the v3 layout's clock */
const asV3 = (sh: ShotV4, id: string, kOff = 0): ShotV3 => {
  const b = V3SH.get(id) as ShotV3;
  return {...b, s: sh.s - kOff, e: sh.e - kOff, lines: sh.lines.map((l) => ({...l, s: l.s + kOff, e: l.e + kOff}) as unknown as LineV3)};
};
const v3 = (fb: Buf, id: string, k3: number, sh: ShotV4, f: number, kOff = 0) => (DRAW3[id].draw(fb, k3, asV3(sh, id, kOff), f) ?? {}) as ShotOut4;
const asV2 = (sh: ShotV4, id: string, kOff = 0): ShotV2 => {
  const b = V2SH.get(id) as ShotV2;
  return {...b, lines: sh.lines.map((l) => ({...l, s: l.s + kOff, e: l.e + kOff}) as unknown as LineV2)};
};
const v2 = (fb: Buf, id: string, k2: number, sh: ShotV4, kOff = 0) => {
  const b = V2SH.get(id) as ShotV2;
  return (V2[id].draw(fb, k2, asV2(sh, id, kOff), b.s + k2) ?? {}) as ShotOut4;
};

// ================================================================== mouths (from the recorded cues)
const lineAt = (sh: ShotV4, k: number, who: string) => sh.lines.find((l) => l.who === who && l.kind !== 'post' && k >= l.s && k < l.e) ?? null;
const mouth = (sh: ShotV4, k: number, who: string): Viseme => {
  const l = lineAt(sh, k, who);
  if (!l) return 'rest';
  let m: Viseme = 'rest';
  for (const [fr, shape] of l.mouth) { if (k - l.s >= fr) m = shape as Viseme; else break; }
  if (!l.mouth.length) m = Math.floor((k - l.s) / 3) % 2 ? 'A' : 'E';
  return m;
};
const lineOf = (sh: ShotV4, id: string) => sh.lines.find((l) => l.id === id);
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, '');
const wordAt = (sh: ShotV4, id: string, w: string, dflt: number) => {
  const l = lineOf(sh, id); const x = l?.words.find((q) => norm(q[0]).startsWith(norm(w)));
  return l && x ? l.s + x[1] : dflt;
};
const blink = (k: number, seed: number): 0 | 1 | 2 => { const p = (k + seed * 37) % 97; return p === 0 || p === 2 ? 1 : p === 1 ? 2 : 0; };
const mas = (s: Partial<MasPortraitState> = {}) => masPortrait({...MAS_PORTRAIT_DEFAULT, look: -1, ...s});
const MCU = (fb: Buf, key: string, room: (b: Buf) => void, img: ReturnType<typeof mas>, o: McuOpts, after?: (b: Buf) => void) => {
  held(fb, `mcu4:${key}:${o.softK ?? 2}`, (b) => { room(b); mcuRoom(b, o); });
  drawBust(fb, img, o);
  after?.(fb);
};
const boardBg = (o: BoardPlateOpts = {}) => (b: Buf) => { const opt: BoardPlateOpts = {laptop: true, rolodex: true, blueprint: 0, ...o}; drawBoardPlate(b, 0, opt); drawBoardPlateTable(b, 0, opt); drawBoardPlateFront(b, 0, opt); };
const board3 = boardBg({phones: {lit: true, buzz: false, step: 2}, reflection: null});
const dimRectL = (b: Buf, x: number, y: number, w: number, h: number, k: number) => {
  for (let j = y; j < Math.min(RH, y + h); j++) for (let i = Math.max(0, x); i < Math.min(480, x + w); i++) b.set(i, j, stepColor(b.get(i, j), -k));
};
/** the call's live caption (in-world UI, the only typed dialogue v4 keeps): a dark strip at the call's foot */
const liveCaption = (b: Buf, who: string, s: string, k: number, y = RH - 22) => {
  if (k < 0) return;
  const shown = s.slice(0, Math.max(0, Math.floor(k * 1.5)));
  const w = Math.max(pw(who) + pw(s) + 22, 120), x = Math.round(240 - w / 2);
  rect(x, y, w, 15, b.ink(PAL.N0)); rect(x, y, w, 1, b.ink(PAL.N4));
  pt(b, who, x + 6, y + 4, PAL.N6);
  pt(b, shown, x + 12 + pw(who), y + 4, PAL.P2);
};
/** a collaborator cursor's name tag (drawPointer + a tag box). `name` '' = the empty tag box (the lobby) */
const cursorTag = (b: Buf, x: number, y: number, name: string, col: number) => {
  const w = name ? pw(name) + 8 : 22;
  rect(x + 9, y + 12, w, 11, b.ink(col)); rect(x + 10, y + 13, w - 2, 9, b.ink(name ? col : PAL.N1));
  if (name) pt(b, name, x + 13, y + 14, PAL.N0);
};
void cursorTag; // v4.2: the lobby's arrow now wears the big empty tag (cursorTagBig with name '')
/** v4.1: the collaborator tag in the display face (the newcomer had to find a tiny ALYI on the cursor that fires him) */
const cursorTagBig = (b: Buf, x: number, y: number, name: string, col: number, role = '') => {
  // v4.2: `role` = a second line saying what he is to Mas, in the blueprint's NAME / ROLE grammar (GERG / CO-FOUNDER);
  // `name` '' = the lobby's empty tag at the noon tag's size (the fresh newcomer read never saw the small one)
  const w = Math.max(name ? bpw(name) : 40, role ? pw(role) : 0) + 14, h = role ? 29 : 20;
  rect(x + 8, y + 12, w + 2, h + 2, b.ink(PAL.N0)); rect(x + 9, y + 13, w, h, b.ink(col));
  if (!name) { rect(x + 11, y + 15, w - 4, h - 4, b.ink(PAL.N1)); return; }
  bpt(b, name, x + 16, y + 16, PAL.N0);
  if (role) pt(b, role, x + 16, y + 33, PAL.N0);
};
/** v4.2: the button under a collaborator's cursor lights in his colour (a hover ring), so the eye goes where he is going */
const hoverRing = (b: Buf, bx: number, by: number, bw: number, bh: number, col: number) => {
  for (const t of [2, 3]) {
    rect(bx - t, by - t, bw + t * 2, 1, b.ink(col)); rect(bx - t, by + bh - 1 + t, bw + t * 2, 1, b.ink(col));
    rect(bx - t, by - t, 1, bh + t * 2, b.ink(col)); rect(bx + bw - 1 + t, by - t, 1, bh + t * 2, b.ink(col));
  }
};
/** v4 post cards: the stand-in card with no 'post-ui' tag in the picture (a stand-in is never a label) */
const postCard4 = (b: Buf, x: number, y: number, w: number, who: string, s: string, k: number, o: {col?: number; bg?: number; ts?: string} = {}) =>
  postCard(b, x, y, w, who, s, k, {...o, noTag: true});
/** a plate with three lines (name, what they are, one more fact), in platePx's style; k from its landing */
const plate3 = (b: Buf, x: number, y: number, name: string, l1: string, l2: string, k: number, accent: number) => {
  if (k < 0) return;
  const w = Math.max(pw(name), pw(l1), pw(l2)) + 16;
  const open = Math.min(1, (k + 1) / 3), hh = Math.max(2, Math.round(36 * open));
  rect(x - 1, y - 1, w + 2, hh + 2, b.ink(PAL.N0)); rect(x, y, w, hh, b.ink(PAL.N1)); rect(x, y, w, 1, b.ink(accent));
  if (open < 1) return;
  pt(b, name.slice(0, Math.max(0, (k - 2) * 3)), x + 8, y + 5, accent);
  pt(b, l1.slice(0, Math.max(0, (k - 5) * 3)), x + 8, y + 15, PAL.P1);
  pt(b, l2.slice(0, Math.max(0, (k - 9) * 3)), x + 8, y + 25, PAL.P0);
};
/** the call's own notice, in the display face on a dark bar at the call's foot, with the toast's door-exit glyph */
const callNotice = (b: Buf, s: string, k: number, y = RH - 34) => {
  if (k < 0) return;
  const w = bpw(s) + 40, x = Math.round(240 - w / 2), rise = k < 3 ? [8, 4, 1][k] : 0;
  const yy = y + rise;
  rect(x, yy, w, 24, b.ink(PAL.N0)); rect(x + 1, yy + 1, w - 2, 22, b.ink(PAL.N3)); rect(x + 1, yy + 1, w - 2, 1, b.ink(PAL.N5));
  rect(x + 8, yy + 6, 8, 12, b.ink(PAL.G5)); rect(x + 9, yy + 7, 6, 11, b.ink(PAL.N1)); b.set(x + 13, yy + 12, PAL.G5);
  bpt(b, s, x + 24, yy + 5, PAL.P2);
};

// ================================================================== S1 · NOON, LAS VEGAS
S('S1.01', 'v2 24.01 suiteRoom (truck, shiver) + desk sprite + Orb; DRIFT toward the desk, 1 px / 6 f (12 px)', (fb, k, sh) => {
  v2(fb, '24.01', k, sh);
  shiftRoom(fb, drift(k, 6, 12));
});
S('S1.02', 'inserts-mas drawNudgeInsert (suite): set -> NUDGE -> out1 -> out2 -> gone; BLUEPRINT_PRINT as the glow floods', (fb, k, sh) => {
  const step = k < mk(sh, 'nudge', 8) ? 'set' : k < mk(sh, 'out1', 20) ? 'nudge' : k < mk(sh, 'out2', 26) ? 'out1' : k < mk(sh, 'glow', 29) ? 'out2' : 'gone';
  drawNudgeInsert(fb, 'suite', step);
  const g = mk(sh, 'glow', 29), p = mk(sh, 'print', 34);
  if (k >= g && k < p) { // the laptop's glow floods the frame in held steps (a lighting move), then the print
    const n = 1 + Math.floor((k - g) / 2);
    for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) if (((x + y) & 3) < n) fb.set(x, y, stepColor(fb.get(x, y), 1));
  }
  return {print: k >= p ? 'blueprint' : undefined};
});
S(['S1.03', 'S1.04', 'S1.05'], 'plan4.ts: THE PLAN as ONE 480 x 330 sheet at the section scale (bpChair row, two-line plates, invite icons, bpBox, bpArrow, the CEO box + fence + key ring); S1.03 tilt oy 0 -> 60 at 1 px/f; S1.04 one fixed 2x crop; S1.05 the path, curl, tear', (fb, k, sh) => {
  drawPlan4(fb, sh, k);
  return {full: true};
});
S('S1.06', 'inserts-mas drawClickInsert: BOARD · VIDEO CALL · JOIN, the click on the mark; connecting…', (fb, k, sh) => {
  const c = mk(sh, 'click', 15);
  drawClickInsert(fb, k, {click: k >= c && k < c + 2});
  if (k >= c + 1) { rect(186, 60, 108, 14, fb.ink(PAL.N1)); pt(fb, 'connecting' + '...'.slice(0, 1 + (Math.floor(k / 5) % 3)), 192, 64, PAL.P1); }
});
// ---- the call as ONE screen (his laptop, full-bleed): grid -> speaker view (tiles slide in the app) -> grid + dialog
const SPK_BIG: TileRect = {x: 104, y: CALL_BAR_H + 6, w: 272, h: 140};
const SPK_STRIP: TileRect[] = [0, 1, 2, 3].map((i) => ({x: 104 + i * 55 + 27, y: SPK_BIG.y + SPK_BIG.h + 5, w: 52, h: 30}));
// G5 order: [mas, alyi, neleh, mada, off]; the speaker view pins alyi and strips the rest
const GRID_R = () => [G5[0], G5[1], G5[2], G5[3], G5[4]];
const SPK_R = () => [SPK_STRIP[0], SPK_BIG, SPK_STRIP[1], SPK_STRIP[2], SPK_STRIP[3]];
const IDS = [{id: 'mas', name: 'MAS MANALT'}, {id: 'alyi', name: 'ALYI'}, {id: 'neleh', name: 'NELEH'}, {id: 'mada', name: 'MADA'}, {id: 'off', name: undefined}];
const tilesAt = (rects: TileRect[], b: Buf, f: number, o: {alyiBig?: boolean; k?: number} = {}) => {
  IDS.forEach((t, i) => {
    const r = rects[i];
    if (t.id === 'alyi' && o.alyiBig) {
      rect(r.x - 1, r.y - 1, r.w + 2, r.h + 2, b.ink(PAL.C6));
      drawAlyiTile(b, r.x, r.y, r.w, r.h, {mouth: (['A', 'E', 'rest', 'O'] as Viseme[])[Math.floor((o.k ?? 0) / 3) % 4], eyes: 'open', t: f});
      return;
    }
    if (t.id === 'mas') drawTile(b, {...masTileState(), ...r}, f);
    else drawTile(b, {...r, id: t.id, name: t.name, vote: 3, muted: t.id === 'off' ? true : undefined}, f);
  });
};
S('S1.07', 'callgrid on ONE clock: G5 (tiles open, votes flipped, Wi-Fi egg) + nameCard NELEH -> G5 + callDialog on the beat (v4.1: the speaker-view pin on ALYI is cut)', (fb, k, sh, f) => {
  const b = ui();
  const card = mk(sh, 'card', 14), dlg = mk(sh, 'dialog', 84);
  callChrome(b, {title: 'board sync', clock: null, controls: false});
  const rects = GRID_R(), big = false;
  if (k < 14) { // the five tiles connect (each opens in its 3 held steps, staggered)
    IDS.forEach((t, i) => {
      const r = rects[i];
      if (t.id === 'mas') drawTile(b, {...masTileState(k - 2), ...r}, f);
      else drawTile(b, {...r, id: t.id, name: t.name, vote: 3, muted: t.id === 'off' ? true : undefined, open: k - i * 2}, f);
    });
  } else tilesAt(rects, b, f, {alyiBig: big, k});
  wifi(b);
  if (k >= dlg) dialog26(b, k, {k0: dlg});
  putUI(fb, b, false);
  if (k >= card && k < dlg) blipCard(fb, k - card, 'NELEH', 'NELEH', 'READ THE CHARTER. LITERALLY.', 'FOOTNOTES: ∞', {f}, 'R');
  void SPK_R;
});
S('S1.08', 'mas-cu drawEyesStrip (letterboxed): the pupils move one pixel toward the dialog on the mark', (fb, k, sh) => { drawEyesStrip(fb, k < mk(sh, 'look', 12) ? 0 : -1); });
S('S1.09', 'callgrid G5 + dialog + drawPointer with a big collaborator tag (ALYI, his accent) stepping from his tile; the click; 26.06b\'s drop (GLYPH dissolve, tokens approximated) + G5 -> G4; the call\'s notice "You\'ve been removed from the meeting."', (fb, k, sh, f) => {
  const b = ui();
  const c = mk(sh, 'click', 45), s1 = mk(sh, 'step1', 15), s2 = mk(sh, 'step2', 30);
  const layers: GlyphLayer[] = [];
  if (k < c + 2) {
    call26(b, f); dialog26(b, 99, {cancelDown: k >= c});
    // v4.2: step 3 lands ON Cancel (its right end), not beside OK: the fresh newcomer read saw the arrow near OK and
    // read the click as OK. Cancel lights in his colour while the arrow is on it; step 4 is its centre, then the click
    const [cbx, cby, cbw, cbh] = dialogButton(DLG.x, DLG.y, 'cancel', DLG.w);
    const P: Array<[number, number]> = [[G5[1].x + 60, G5[1].y + 44], [G5[1].x + 20, G5[1].y + 70], [cbx + cbw - 10, cby + 11], CANCEL];
    const i = k < s1 ? 0 : k < s2 ? 1 : k < c - 6 ? 2 : 3;
    const [px, py] = P[i];
    if (i >= 2) hoverRing(b, cbx, cby, cbw, cbh, ACCENT.ALYI ?? PAL.W5);
    drawPointer(b, px, py, k >= c);
    cursorTagBig(b, px, py, 'ALYI', ACCENT.ALYI ?? PAL.W5, 'CO-FOUNDER');
  } else {
    const kk = k - c;
    const rects = kk < 22 ? G5.slice(1) : slideTiles(G5.slice(1), G4, kk, 22, 8);
    callChrome(b, {title: 'board sync', clock: null, controls: false});
    board4(b, f, rects);
    wifi(b);
    const img = captureTile({...masTileState(), open: undefined}, f - kk);
    const kd = kk - 2;
    if (kd >= 8) tilePlate(b, G5[0].x, G5[0].y + dropY(kd));
    layers.push(tileDrop(b, img, G5[0].x, G5[0].y, kd, {grey: true}));
    const n = sh.texts.find((t) => t.kind === 'toast');
    if (n) callNotice(b, "You've been removed from the meeting.", k - n.s);
  }
  putUI(fb, b, false);
  return {layers};
});
S('S1.10', 'mas-cu drawMasCU (strip): ONE silent drawing; the rail +1 FIRING types on its second beat', (fb) => { drawMasCU(fb, {backdrop: 'strip', f: 0}); });
S('S1.11', 'inserts-mas drawStripTapInsert: the buzz (f0), [super] x3 (f2), the tap at once (f8); the mic chip still lit', (fb, k) => {
  const hand: StripHand = k < 3 ? 'out' : k < 5 ? 'enter1' : k < 8 ? 'enter2' : k < 12 ? 'tap' : 'after';
  drawStripTapInsert(fb, k, {hand, strip: k >= 2, level: k >= 8 && k < 30 ? 1 + (Math.floor(k / 4) % 3) : 3});
});
S('S1.12', 'v3 26.09 [OTS] shoulder(masPortrait) over drawLaptopInsert, G4 frozen on "super." + fallaway() over the last 20 f (the bridge to night)', (fb, k, sh, f) => {
  v3(fb, '26.09', k, sh, f);
  const fa = mk(sh, 'fall', len(sh) - 20);
  if (k >= fa) fallaway(fb, k, 3, fa, 6);
});

// ================================================================== S2 · THAT NIGHT
S('S2.01', 'inserts-mas drawCarveInsert (a stroke a beat) -> drawBrushInsert + DRIFT 1 px / 8 f (11 px)', (fb, k, sh) => {
  const br = mk(sh, 'brush', 60);
  if (k < br) drawCarveInsert(fb, k, Math.min(1, (Math.floor(k / 15) + 1) * 0.25));
  else drawBrushInsert(fb, k, brushStepAt(k - br));
  shiftRoom(fb, -drift(k, 8, 11));
});
const dark2S = (fb: Buf, k: number, look: [number, number]) => drawDark2S(fb, k, {mas: {head: 'down', arm: 'tally'}, orb: {look}, plate: {tally: 3, lanyard: false, phone: 'none'}});
/** v4.1: the count at insert scale. S2.01's desk after the brush (his thumb on mark 3), held at S2.01's end drift, with
 *  the Orb's eye-light as a cyan pool on one mark (0, 1, 2); null = no light. The marks are 40 px tall here, not 3. */
const markX = (i: number) => DARKDESK.marks.x + DARKDESK.marks.gap * i + 1;
let MARKS_ECU: Buf | null = null;
const marksECU = (fb: Buf, f: number, lit: number | null) => {
  const src = (MARKS_ECU ??= (() => { const b = new Buf(480, 270, PAL.N0); drawBrushInsert(b, 0, BRUSH_STEPS - 1); shiftRoom(b, -11); return b; })());
  for (let y = 0; y < Math.min(fb.h, RH); y++) for (let x = 0; x < 480; x++) fb.set(x, y, src.get(x, y)); // the room area only (the rail band is drawn later)
  if (lit === null) return;
  const cx = markX(lit) - 11, cy = DARKDESK.marks.y + DARKDESK.marks.len / 2;
  for (let y = cy - 34; y < cy + 34; y++) for (let x = cx - 20; x < cx + 20; x++) {
    if (x < 0 || y < 0 || x >= 480 || y >= RH) continue;
    const d = Math.hypot((x - cx) / 18, (y - cy) / 32);
    if (d >= 1) continue;
    const c = fb.get(x, y);
    if (d < 0.55) fb.set(x, y, stepColor(c, 2));
    else if (d > 0.86) { if (((x + y) & 1) === 0) fb.set(x, y, PAL.C4); } // the Orb's cyan rim: its light, not a lamp
    else if (((x * 3 + y * 5 + (f >> 2)) % 4) < (1 - d) * 7) fb.set(x, y, stepColor(c, 1));
  }
  for (const [dx, dy] of [[-12, -22], [9, -14], [-8, 19], [12, 24]] as Array<[number, number]>) fb.set(cx + dx, cy + dy, PAL.C6); // the lens's glints
};
S('S2.02', 'v4.1: the marks at insert scale (inserts-mas drawBrushInsert, its last step) + the Orb\'s eye-light as a cyan pool, stepping onto mark 1', (fb, k, sh, f) => { marksECU(fb, f, k < mk(sh, 'mark1', 14) ? 2 : 0); });
S('S2.03', 'F1.2 inside the count: renderFront from the lit mark 1 (the marks ECU) -> EARLYWEB16 rooms-a drawTpoolDoor (two shadows lean together) -> back to the marks, the light on mark 2', (fb, k, sh, f) => {
  const fo = mk(sh, 'front_out', 79), lean = mk(sh, 'lean', 34);
  const a = new Buf(480, RH, PAL.N0); marksECU(a, f, 0);
  const z = new Buf(480, RH, PAL.N0); marksECU(z, f, 1);
  const d0 = new Buf(480, RH, PAL.N0); drawTpoolDoor(d0, {f: k, lean: k < lean ? 0 : 1});
  const tp = inPalette(d0, 'EARLYWEB16');
  const out = new Buf(480, RH, PAL.N0);
  if (k < fo) { const {pos, smear} = frontPos(k, 0, 20, RH); if (k < 1) out.c.set(a.c); else renderFront(out, a, tp, pos, {dir: 'down', smear}); }
  else { const {pos, smear} = frontPos(k, fo, Math.max(8, len(sh) - fo - 1), RH); renderFront(out, tp, z, pos, {dir: 'down', smear}); }
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) fb.set(x, y, out.get(x, y));
});
S('S2.04', 'v4.1: the marks ECU: the light on mark 2, then on mark 3 = his thumb', (fb, k, sh, f) => { marksECU(fb, f, k < mk(sh, 'mark3', 13) ? 1 : 2); void dark2S; });
S('S2.05', 'v3 26A.03 [ECU·Orb] the iris (drawOrb r 84) + orbStep: thumb -> his face; toast rewinding…; 2-frame WHIP-OUT (the badge flips on it)', (fb, k, sh, f) => { v3(fb, '26A.03', k, sh, f); });

// ================================================================== S3 · FRIDAY, THE BOARD'S SIDE (Neleh's laptop: ALYI's tile on the right, so his doorway matches the all-hands door)
const S4R = () => [S4[1], S4[0], S4[2], S4[3]]; // her gallery order: alyi top-right, neleh top-left
const callHers = (b: Buf, f: number, o: {frozenAt?: number} = {}) => {
  callChrome(b, {title: 'board sync', clock: null, controls: false});
  board4(b, f, S4R(), o);
};
S('S3.01', 'callgrid G4 (her gallery order) in the [SCR] bezel; "super." through the laptop speaker + the call\'s live caption; nobody looks up; 2-frame WHIP-IN', (fb, k, sh, f) => {
  const b = sui(); callHers(b, f); putSCR(fb, b);
  const l = lineOf(sh, 'a4-27-00');
  liveCaption(fb, 'MAS MANALT', 'super.', l ? k - l.s : -1, 164);
});
/** her pen hand (the click hand kit as her pen: MARKED stand-in) */
const nelehHand = (fb: Buf, tx: number, ty: number) => { // her marker: tip at (tx, ty), the barrel up-right, capped end
  for (let q = 0; q < 46; q++) {
    const bx = tx + 3 + q, by = ty - 3 - Math.floor(q * 0.55);
    for (let t = 0; t < 5; t++) fb.set(bx + 2, by - t + 3, stepColor(fb.get(bx + 2, by - t + 3), -2)); // its shadow on the paper
  }
  for (let q = 0; q < 46; q++) {
    const bx = tx + 3 + q, by = ty - 3 - Math.floor(q * 0.55);
    const band = q > 30 && q < 34;
    for (let t = 0; t < 5; t++) fb.set(bx, by - t, band ? PAL.P1 : [PAL.W3, PAL.W4, PAL.W5, PAL.W6, PAL.W7][t]);
  }
  fb.set(tx, ty, PAL.N0); fb.set(tx + 1, ty - 1, PAL.N0); fb.set(tx + 2, ty - 1, PAL.N1); fb.set(tx + 1, ty - 2, PAL.G4); fb.set(tx + 2, ty - 2, PAL.G3);
};
const STEP_L = ['1. NOON · VIDEO CALL ', '2. BLOG POST ', '3. INTERIM CEO '];
/** paint out step ticks >= n (the table insert prints all three) */
const ticksTo = (fb: Buf, n: number) => {
  STEP_L.forEach((s, i) => {
    if (i < n) return;
    const x = 70 + textWidth(s) - 1, y = 82 + i * 20;
    const bg = fb.get(x - 3, y + 9);
    for (let j = -1; j < 9; j++) for (let q = 0; q < 12; q++) fb.set(x + q, y + j, bg);
  });
};
/** the laptop's edge at the top of her desk (the call at 1:2 in a bezel: MARKED as a screen thumbnail) */
const laptopEdge = (fb: Buf, f: number, x0: number, y0: number) => {
  const b = sui(); callHers(b, f);
  const w = 228, h = 70;
  rect(x0 - 6, y0 - 6, w + 12, h + 12, fb.ink(PAL.G1)); rect(x0 - 6, y0 + h + 5, w + 12, 1, fb.ink(PAL.G3));
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) fb.set(x0 + x, y0 + y, b.get(x * 2, (y + 18) * 2 > SCR_H - 1 ? SCR_H - 1 : (y + 18) * 2));
};
const charter = (fb: Buf) => { // the charter, a stapled paper stack at the top left
  rect(18, 4, 104, 48, fb.ink(PAL.P0)); rect(20, 2, 104, 48, fb.ink(PAL.P1)); rect(20, 2, 104, 1, fb.ink(PAL.P2));
  pt(fb, 'CHARTER', 28, 8, PAL.N3);
  for (let j = 0; j < 4; j++) rect(28, 20 + j * 7, 86 - (j % 2) * 20, 1, fb.ink(PAL.P0));
  rect(24, 5, 5, 2, fb.ink(PAL.G5));
};
S('S3.02', '[HIGH] rooms-a drawTableInsert (blueprint, the step list) + the laptop\'s edge (her call, 1:2) + the charter; tick 1, the pen runs down 2 · 3 · 4 ______ and stops on the blank (v4.1: no tick 2: the post is step 2); pen hand = clickHand (MARKED)', (fb, k, sh, f) => {
  drawTableInsert(fb, {f: k, focus: 'blueprint', word: 0});
  const t1 = mk(sh, 'tick1', 10), r0 = mk(sh, 'run0', 24), r1 = mk(sh, 'run1', 62);
  ticksTo(fb, k < t1 ? 0 : 1);
  laptopEdge(fb, f, 244, 0);
  charter(fb);
  // the pen: at step 1 for the tick, runs down the list (held on 2s) and stops on 4's blank
  const y = k < r0 ? 82 : k < r1 ? 82 + Math.round(((on2(k) - r0) / Math.max(1, r1 - r0)) * 62) : 144;
  const x = k < r0 ? 70 + textWidth('1. NOON · VIDEO CALL ') + 10 : 64;
  nelehHand(fb, x, y + 6);
});
S('S3.03', '[SCR] her laptop: the NopeAI blog page in its own UI (the quote in the page\'s type, the date), bezel in frame', (fb, k) => {
  const b = sui();
  rect(0, 0, SCR_W, SCR_H, b.ink(PAL.P2));
  rect(0, 0, SCR_W, 16, b.ink(PAL.N2)); pt(b, 'NOPE AI', 12, 5, PAL.P2); pt(b, 'BLOG', 62, 5, PAL.N7);
  for (const [i, s] of ['RESEARCH', 'SAFETY', 'COMPANY'].entries()) pt(b, s, 250 + i * 64, 5, PAL.N6);
  if (k >= 3) {
    pt(b, 'COMPANY ANNOUNCEMENT · NOV 17, 2023', 28, 30, PAL.G3);
    rect(28, 41, 180, 1, b.ink(PAL.P0));
    const q = '"…not consistently candid in his communications with the board…"';
    const lines = bpwrap2(q, 400);
    lines.forEach((l, i) => bpt(b, l, 28, 56 + i * 22, PAL.N2));
    for (let j = 0; j < 5; j++) rect(28, 130 + j * 8, 380 - (j % 3) * 60, 3, b.ink(PAL.P0)); // the rest of the post, greeked
  }
  putSCR(fb, b);
});
const bpwrap2 = (s: string, maxW: number) => { const out: string[] = []; let cur = ''; for (const w of s.split(' ')) { const t = cur ? cur + ' ' + w : w; if (bpw(t) > maxW && cur) { out.push(cur); cur = w; } else cur = t; } if (cur) out.push(cur); return out; };
/** the boardroom's CEO chair: a high leather back (the room's chair colours), lit from above by the spot */
const ceoChairBack = (b: Buf, cx: number, top: number, w = 150) => {
  const x0 = cx - Math.round(w / 2);
  const inW = (y: number) => { const t = y - top; const r = t < 16 ? Math.round(16 - Math.sqrt(Math.max(0, 256 - (16 - t) ** 2))) : 0; const wing = t > 96 ? Math.min(14, Math.floor((t - 96) / 3)) : 0; return [x0 + r - wing, x0 + w - r + wing]; };
  for (let y = top; y < RH; y++) {
    const [a, z] = inW(y);
    for (let x = a; x < z; x++) {
      const e = Math.min(x - a, z - 1 - x);
      const lit = y - top < 6;
      b.set(x, y, e < 2 ? PAL.N1 : e < 4 ? (lit ? PAL.N7 : PAL.N5) : lit ? PAL.N5 : PAL.N3);
    }
  }
  // the tufting (buttons in a diamond grid) and the headrest seam: it reads as leather, not a screen
  for (let j = 0, y = top + 30; y < RH - 8; j++, y += 18) for (let x = x0 + 18 + (j % 2) * 14; x < x0 + w - 16; x += 28) { b.set(x, y, PAL.N1); b.set(x + 1, y, PAL.N6); b.set(x, y + 1, PAL.N2); }
  rect(x0 + 10, top + 22, w - 20, 1, b.ink(PAL.N2)); rect(x0 + 10, top + 23, w - 20, 1, b.ink(PAL.N4));
};
S('S3.04', '[MCU] RIMA right third (rimaSpeakPortrait) under the hard spotlight IN the boardroom\'s CEO chair (its high back behind her); one setup for the exchange; platePx on "More. Soon."', (fb, k, sh) => {
  held(fb, 'rima-chair', (b) => { spotlight(b, 318, 70, 104); ceoChairBack(b, 318, 22); });
  drawBust(fb, rimaSpeakPortrait({...RIMA_PORTRAIT_DEFAULT, mouth: mouth(sh, k, 'RIMA'), lid: blink(k, 5), hand: k < 4 ? 'none' : k < 12 ? (Math.floor(k / 4) % 2 ? 'smooth1' : 'smooth0') : 'none'}), {third: 'R'});
  // v4.1: the box in front of her is a closed laptop: its lid, the spot's rim along the top, a logo, the hinge
  rect(258, 156, 120, RH - 156, fb.ink(PAL.N2)); rect(258, 156, 120, 1, fb.ink(PAL.N6)); rect(259, 157, 118, 1, fb.ink(PAL.N4));
  rect(258, 156, 1, RH - 156, fb.ink(PAL.N3)); rect(377, 156, 1, RH - 156, fb.ink(PAL.N1));
  for (let y = 160; y < RH; y += 3) for (let x = 262 + ((y >> 1) & 1); x < 374; x += 7) fb.set(x, y, PAL.N3); // brushed metal
  rect(313, 174, 10, 10, fb.ink(PAL.N3)); rect(315, 176, 6, 6, fb.ink(PAL.N4)); fb.set(318, 177, PAL.N6);
  const t = sh.texts.find((x) => x.kind === 'plate');
  if (t) platePx(fb, 22, 150, 'RIMA TAMURI', 'HIS CTO · CEO (WEEKEND EDITION)', k - t.s, PAL.P2, pt, pw);
});
S('S3.05', 'callgrid G4 (her order) [SCR] + Gerg\'s post as the call\'s notification (post-ui stand-in) + keycapRain; no toast', (fb, k, sh, f) => {
  const b = sui(); callHers(b, f);
  const p = lineOf(sh, 'a4-27-01b');
  if (p) postCard4(b, 136, 44, 190, 'GERG MOCKBRAN', '…based on today\'s news, i quit.', k - p.s, {col: PAL.L3});
  const kc = mk(sh, 'keys', 34);
  if (k >= kc) keycapRain(b, k - kc);
  putSCR(fb, b);
}, true);
// the all-hands, framed so its doorway sits where ALYI's tile had his doorway (the match cut)
const MATCH_DX = 30; // his tile's doorway sits right of the room's: the room slides right to meet it (the left edge repeats: the door's own jamb)
const allhands = (b: Buf, alyi: boolean, up: boolean) => { bullpenRoom(b, 0, {variant: 'allhands', door: 'open', handsUp: up ? [22] : []}, {alyiDoor: alyi}); shiftRoom(b, MATCH_DX); };
S('S3.06', 'rooms-b bullpen all-hands (hand up on the mark) + drawAlyiStand clipped to the doorway; framed for the MATCH CUT from his tile\'s doorway', (fb, k, sh) => {
  const up = k >= mk(sh, 'hand', 22);
  held(fb, up ? 'ah4-up' : 'ah4', (b) => allhands(b, true, up));
});
S('S3.07', 'v3 27.08 [MCU·door] ALYI right third (alyiSpeakPortrait), the jamb + leaf over the all-hands soft 1; v4.1 platePx ALYI · HIS CO-FOUNDER, CHIEF SCIENTIST', (fb, k, sh, f) => {
  v3(fb, '27.08', k, sh, f);
  const t = sh.texts.find((x) => x.kind === 'plate');
  if (t) platePx(fb, 22, 150, 'ALYI', 'HIS CO-FOUNDER, CHIEF SCIENTIST', k - t.s, ACCENT.ALYI ?? PAL.W5, pt, pw);
});
let AH_A: Record<string, [number, number]> | null = null;
const ahAnchors = () => (AH_A ??= bullpenRoom(new Buf(480, 270, PAL.N0), 0, {variant: 'allhands', door: 'open', handsUp: [22]}, {alyiDoor: false}));
S('S3.08', 'the S3.06 wide: the hand still up; Alyi steps back out of the doorway in whole-px steps, then it holds empty', (fb, k, sh) => {
  held(fb, 'ah4-up-empty', (b) => allhands(b, false, true));
  const s0 = mk(sh, 'step', 4);
  if (k < s0 + 13) {
    const dx = k < s0 ? 0 : Math.floor((k - s0) / 2) * 3;
    const [ax, ay] = ahAnchors().alyiDoorway;
    const clip = (x: number, y: number) => x >= DOOR_OPENING.x + MATCH_DX && x < DOOR_OPENING.x + MATCH_DX + 16 && y >= DOOR_OPENING.y && y < DOOR_OPENING.y + DOOR_OPENING.h;
    drawAlyiStand(fb, ax + MATCH_DX + dx, ay, {...ALYI_STAND_DEFAULT}, {clip});
  }
});
/** her desk at night: the lamp's warm pool at the top left, the rest one step down */
const lampNight = (b: Buf) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const d = Math.hypot((x - 60) / 300, (y - 20) / 190);
    const c = b.get(x, y);
    if (d > 0.62) b.set(x, y, stepColor(c, d > 0.9 ? -2 : -1));
    else if (d < 0.35 && ((x * 3 + y * 5) % 7) < 2) b.set(x, y, stepColor(c, 1));
  }
  // the lamp's shade at the very top left (warm)
  rect(0, 0, 58, 10, b.ink(PAL.D3)); rect(0, 10, 58, 2, b.ink(PAL.W7)); rect(6, 12, 46, 2, b.ink(PAL.W5));
};
S('S3.09', '[HIGH] her desk at night (drawTableInsert blueprint + a lamp pool): THE PLAN\'s CEO box and its EQUITY: 0 stamp + her phone face-up with his 9:32 post (post-ui stand-in); her pen taps the stamp; nothing new is stamped', (fb, k, sh) => {
  held(fb, 's309', (b) => {
    drawTableInsert(b, {f: 0, focus: 'blueprint'});
    const navy = b.get(200, 120);
    rect(52, 72, 196, 124, b.ink(navy)); // the structure part of her copy (the step list is folded under)
    for (let y = 72; y < 196; y += 8) for (let x = 52; x < 248; x += 2) b.set(x, y, stepColor(navy, 1));
    rect(64, 84, 170, 64, b.ink(PAL.C7)); rect(66, 86, 166, 60, b.ink(navy));
    bpt(b, 'CEO', 76, 94, PAL.C7);
    pt(b, 'EQUITY:', 76, 124, PAL.C6); rect(124, 120, 70, 16, b.ink(PAL.C5)); rect(125, 121, 68, 14, b.ink(navy));
    lampNight(b); // v4.1: no re-stamp: the empty field is the callback (the audience saw the zero land)
    // her phone, face-up beside the blueprint
    rect(292, 10, 168, 186, b.ink(PAL.N0)); rect(294, 12, 164, 182, b.ink(PAL.N1)); rect(360, 14, 30, 3, b.ink(PAL.N3));
  });
  const p = lineOf(sh, 'a4-26a-01b');
  if (p) postCard4(fb, 300, 34, 152, '@mas', '…the nopeai board should go after me for the full value of my shares', k - p.s, {ts: '9:32 PM PT'});
  const t = mk(sh, 'tap', 101);
  nelehHand(fb, k < t ? 238 : k < t + 3 ? 164 : 172, k < t ? 150 : k < t + 3 ? 130 : 126); // it taps the empty field
}, true);

// ================================================================== S4 · THE WEEKEND, THE BOARDROOM
S('S4.01', 'avalanche planPile / drawPile on the board\'s grid (G5 with Rima) on the boardroom\'s wall screen ([SCR] bezel), re-clocked so the one BLUE heart lands last on Mada\'s spinner; his post (postChip) scrolls in and holds', (fb, k, sh) => {
  const plan = heartPlan();
  const blue = plan[plan.length - 1];
  const bk = mk(sh, 'blue', 103);
  const T = Math.round(28 + (k * (blue.land - 28 + 4)) / bk); // the pour's own clock, re-timed to the shot
  const b = sui(); hearts(b, T);
  const p = lineOf(sh, 'a4-27-07');
  if (p && k >= p.s) { const x = Math.max(24, SCR_W - Math.floor((k - p.s) * 44)); postChip(b, x, 82, '@mas', '…sorta like reading your own eulogy while you\'re still alive'); }
  putSCR(fb, b);
});
/** the boardroom's wall screen, small in the wide: the call buried in hearts (a new small drawing, not a scale) */
const wallScreen = (b: Buf, x: number, y: number, f: number) => {
  rect(x - 3, y - 3, 70, 44, b.ink(PAL.N0)); rect(x - 2, y - 2, 68, 42, b.ink(PAL.G1));
  rect(x, y, 64, 38, b.ink(PAL.N2));
  for (let i = 0; i < 4; i++) { const tx = x + 2 + (i % 2) * 31, ty = y + 2 + Math.floor(i / 2) * 18; rect(tx, ty, 29, 16, b.ink(i === 3 ? PAL.N1 : PAL.N4)); }
  for (let j = 0; j < 60; j++) { const hx = x + 1 + ((j * 29 + (j >> 2) * 7) % 62), hy = y + 38 - 1 - ((j * 13) % 22); b.set(hx, hy, (j + (f >> 3)) % 5 ? PAL.R2 : PAL.R3); b.set(hx + 1, hy, PAL.R2); }
  b.set(x + 48, y + 12, PAL.C6); // the blue one, on Mada's spinner
};
const PHONE_IDS = ['STAFF', 'STAFF', 'INVESTORS', 'STAFF'];
S('S4.02', 'rooms-a boardroom wide at night (held): phones lit + buzzing with caller IDs, blueprint (1-3, 4 blank), the QV laptop, the empty CEO chair; NELEH, MADA, ALYI in the glass; the wall screen small with the buried call', (fb, k, sh, f) => {
  const bz = k >= mk(sh, 'buzz', 10);
  const st = bz ? 1 + (Math.floor((k - mk(sh, 'buzz', 10)) / 15) % 2) : 0;
  const seats = ['A', 'C', 'D', 'R'] as const;
  held(fb, `s402-${st}`, (b) => boardRoom(b, 0, {blueprint: {word: false}, laptop: true, phones: {lit: true, buzz: st > 0, step: st}, phoneSeats: [...seats]}, {neleh: {}, mada: true, alyi: true}));
  wallScreen(fb, 222, 30, f);
  if (bz) { // each ringing phone's caller ID, lit on its own screen and hung just above it (the phones are 8 px at this size)
    const P: Array<[number, number]> = [[120, 153], [224, 151], [282, 153], [390, 160]];
    PHONE_IDS.forEach((s, i) => { const [px, py] = P[i]; const x = px + 4 - Math.round(pw(s) / 2), y = py + st * 3 - 13; rect(x - 2, y - 1, pw(s) + 4, 9, fb.ink(PAL.N0)); rect(x - 2, y + 8, pw(s) + 4, 1, fb.ink(PAL.C4)); pt(fb, s, x, y, PAL.C7); });
  }
});
S('S4.03', '[MCU] NELEH right third facing left (nelehPortrait), the boardroom plate soft 2: the board\'s-side rule', (fb, k, sh) => {
  MCU(fb, 's403', board3, nelehPortrait({...NELEH_PORTRAIT_DEFAULT, mouth: mouth(sh, k, 'NELEH'), lid: blink(k, 1), look: -1}), {third: 'R'});
});
S('S4.04', 'v3 27.14 [OTS] over NELEH onto the dark window (alyiReflection), MIRRORED so her shoulder is right and she looks screen-left', (fb, k, sh, f) => {
  v3(fb, '27.14', k, sh, f);
  for (let y = 0; y < RH; y++) { const row = fb.c.slice(y * 480, y * 480 + 480); for (let x = 0; x < 480; x++) fb.c[y * 480 + x] = row[479 - x]; }
});
S('S4.06', 'twoshots drawBoard2S: NELEH looking down (lip-sync), MADA, ALYI\'s reflection between them (lip-sync); its 2-frame flicker on the mark', (fb, k, sh) => {
  const fl = mk(sh, 'flicker', len(sh) - 7);
  drawBoard2S(fb, k, {neleh: {arm: 'marker', head: 'down', mouth: mouth(sh, k, 'NELEH')}, mada: {}, alyi: {mouth: mouth(sh, k, 'ALYI'), flicker: k >= fl && k < fl + 2 ? 'gone' : 'there'},
    plate: {laptop: true, blueprint: 0, rolodex: true, plates: [{name: 'NELEH', x: 86}, {name: 'MADA', x: 280}], phones: {lit: true, step: 4}}}); // v4.1: MADA sits at his own plate
});
S('S4.07', '[MCU·PF] NELEH right third at the blank line; the boardroom steps down behind her in held steps (the fallaway)', (fb, k) => {
  held(fb, 's407bg', (b) => { board3(b); vignette(b, MCU_X.R + 56, 2); });
  soft(fb, 2 + Math.min(2, Math.floor(k / 6)));
  drawBust(fb, nelehPortrait({...NELEH_PORTRAIT_DEFAULT, lid: 0, look: -1, gaze: 'down'}), {third: 'R'});
});
/** a show plate (name · line) whose box fits its lettering (framing.ts's platePx, re-measured) */
const plate4 = (b: Buf, x: number, y: number, name: string, line: string, k: number, accent: number) => {
  if (k < 0) return;
  const w = Math.max(pw(name), pw(line)) + 20;
  const open = Math.min(1, (k + 1) / 3), hh = Math.max(2, Math.round(26 * open));
  rect(x - 1, y - 1, w + 2, hh + 2, b.ink(PAL.N0)); rect(x, y, w, hh, b.ink(PAL.N1)); rect(x, y, w, 1, b.ink(accent));
  if (open < 1) return;
  pt(b, name.slice(0, Math.max(0, (k - 2) * 3)), x + 8, y + 5, accent);
  pt(b, line.slice(0, Math.max(0, (k - 5) * 3)), x + 8, y + 15, PAL.P1);
};
/** a rent meter's tag, in the lighthouse meters' style (dark board, cyan rule), already full */
const meterTag = (b: Buf, x: number, y: number, name: string, amt: string) => {
  const w = Math.max(pw(name), pw(amt)) + 10;
  rect(x, y, w, 30, b.ink(PAL.N0)); rect(x + 1, y + 1, w - 2, 28, b.ink(PAL.N2)); rect(x + 1, y + 1, w - 2, 1, b.ink(PAL.C5));
  pt(b, name, x + 5, y + 4, PAL.P1); rect(x + 5, y + 13, w - 10, 3, b.ink(PAL.L3)); pt(b, amt, x + 5, y + 19, PAL.W7);
  rect(x + Math.round(w / 2), y - 12, 1, 12, b.ink(PAL.G3)); // its chain to the gallery
};
// ---- THE SPLIT (Act One's meanwhile grammar): the boardroom | the lighthouse, both calls in one shot
const pane = (fb: Buf, src: Buf, sx: number, dx: number) => { for (let y = 0; y < RH; y++) for (let x = 0; x < 238; x++) fb.set(dx + x, y, src.get(sx + x, y)); };
S('S4.08', '[SPLIT] two 238 x 203 panes: LEFT the boardroom (the speakerphone\'s four tones; Neleh leaning in) | RIGHT rooms-b lighthouseRoom (Mario, Adelina, the throne, phone 1 and 2, the meters already full); plate, the click, the rail', (fb, k, sh) => {
  const click = mk(sh, 'click', 124), ring = mk(sh, 'ring', 24), ring2 = mk(sh, 'ring2', 136), grab = mk(sh, 'grab', 148);
  const ad = lineOf(sh, 'a4-27-15');
  const tones = k < 24 ? Math.min(4, Math.floor(k / 6) + 1) : 4;
  const L = new Buf(480, 270, PAL.N0);
  held(L, `split-L${tones}`, (b) => boardRoom(b, 0, {blueprint: {word: false}, laptop: true, phones: {lit: false, step: 4}, speaker: tones}, {neleh: {}, mada: true, alyi: false}));
  const R = new Buf(480, 270, PAL.N0);
  const throne = k < click ? 'on' : 'fallen';
  const phone1 = ad && k >= ad.s - 4 && k < click ? 'off' : 'cradle';
  const phone2 = k >= grab ? 'off' : 'cradle';
  lighthouseRoom(R, k, {meters: 2, ring1: k >= ring && k < (ad ? ad.s : click) ? ring : null, ring2: k >= ring2 && k < grab ? ring2 : null, throne, phone1, phone2}, {mario: true, adelina: false});
  if (ad && k >= ad.s - 14) { // she crosses into the pane from the right (whole px on 2s) and takes the phone on her line
    const ax = Math.max(196, 300 - Math.floor(on2(k - (ad.s - 14)) * 8));
    drawAdelinaRoom(R, ax, 199, {...ADELINA_ROOM_DEFAULT});
  }
  pane(fb, L, 110, 0);
  pane(fb, R, 64, 242);
  rect(238, 0, 4, RH, fb.ink(PAL.N0));
  // the second rent meter hangs just out of the pane: its tag, in the meter's own style, at the pane's edge
  meterTag(fb, 404, 56, 'ELGOOG', 'UP TO $2B');
  // v4.1: the plate carries the offer (it was a rail after the "no"): top of his pane, clear of the phones
  const tx = sh.texts.find((t) => t.kind === 'plate');
  if (tx && k >= tx.s && k < tx.e) plate3(fb, 248, 8, 'MARIO', 'THE RIVAL LAB', "(REPORTED) OFFERED MAS'S JOB", k - tx.s, PAL.F5); // v4.2: '(EX-NOPEAI)' cut
  // the second phone's caller ID while it rings (who "How much?" is for)
  if (k >= ring2 && k < grab + 30) { const s = 'NOZAMA', w = pw(s) + 6, x = 440 - Math.round(w / 2), y = 132; rect(x, y, w, 10, fb.ink(PAL.N0)); rect(x, y + 9, w, 1, fb.ink(PAL.C4)); pt(fb, s, x + 3, y + 2, PAL.C7); }
  void plate4;
});
S('S4.09', 'rooms-a drawLobbyCam [SCR] (label NOPEAI HQ · LOBBY) on the boardroom screen + mas-stand walking in with the lanyard + the CCTV\'s tracking box GUEST; his post the right way up', (fb, k, sh) => {
  const b = new Buf(480, RH, PAL.N0);
  let mx = 0;
  drawLobbyCam(b, {f: k, time: 'day', label: 'NOPEAI HQ · LOBBY'}, (bb) => {
    mx = CAM.PATH.x0 + 20 + Math.floor(on2(k) * 1.4);
    if (mx < CAM.PATH.x1) drawMasStand(bb, mx, CAM.PATH.feetY, {...MAS_STAND_DEFAULT, legs: masWalkAt(k), guest: true});
  });
  if (k >= 10 && mx < CAM.PATH.x1) { // the camera's tracking box (in-world CCTV UI)
    const x0 = mx - 14, y0 = CAM.PATH.feetY - 66;
    for (let i = 0; i < 28; i++) if (i < 5 || i > 22) { b.set(x0 + i, y0, PAL.L3); b.set(x0 + i, y0 + 68, PAL.L3); }
    for (let j = 0; j < 69; j++) if (j < 5 || j > 63) { b.set(x0, y0 + j, PAL.L3); b.set(x0 + 27, y0 + j, PAL.L3); }
    rect(x0, y0 - 11, pw('VISITOR: GUEST') + 6, 10, b.ink(PAL.L3)); pt(b, 'VISITOR: GUEST', x0 + 3, y0 - 10, PAL.N0);
  }
  const p = lineOf(sh, 'a4-27-17');
  if (p && k >= p.s) postCard4(b, CAM.POST_CORNER.x - 16, CAM.POST_CORNER.y + 2, CAM.POST_CORNER.w + 4, '@mas', 'first and last time i ever wear one of these', k - p.s);
  putUI(fb, b, true);
}, true);
S('S4.10', 'rooms-a boardroom wide: the spot swings off the empty CEO chair onto TTEMME (3 held positions), a BLANK sticky note; platePx TTEMME · INTERIM CEO #2', (fb, k, sh) => {
  const step = Math.min(2, Math.floor((k - mk(sh, 'swing', 0)) / 8));
  const spots = [{x: 240, y: 110, r: 26}, {x: 250, y: 104, r: 28}, {x: 254, y: 100, r: 30}];
  held(fb, `s410-${step}`, (b) => boardRoom(b, 0, {sticky: {seat: 'C', text: ''}, spot: spots[Math.max(0, step)], laptop: true, blueprint: {word: false}, phones: {step: 4}}, {neleh: {}, mada: true, alyi: true, ttemme: step >= 1 ? {} : null}));
  const t = sh.texts.find((x) => x.kind === 'plate');
  platePx(fb, 22, 150, 'TTEMME', 'INTERIM CEO #2 · EX-STREAMING CEO', k - (t ? t.s : 7), PAL.U5, pt, pw);
});
S('S4.11', '[LOW·desk] TTEMME right third (ttemmePortrait) + chat overlay; the table edge + the hourglass BIG in front: kits/props hourglass flipped in its 3 held drawings, at 2x (MARKED stand-in); RACK hourglass -> him', (fb, k, sh) => {
  const st = rackStep(k, 10);
  const [kA, kB] = RACK[st];
  held(fb, `s411:${kB}`, (b) => { boardBg({laptop: false, rolodex: 'still', blueprint: false})(b); soft(b, 2 + Math.max(0, kB - 1)); vignette(b, 330, 2); });
  drawBust(fb, ttemmePortrait({...TTEMME_PORTRAIT_DEFAULT, mouth: mouth(sh, k, 'TTEMME'), gaze: k < 14 ? 'sand' : 'cam', look: -1, brow: 'hype'}), {third: 'R', y: 22, faceK: kB});
  // v4.1: his stream's chat as a panel that reads as one (LIVE, usernames as coloured dashes, F), not a strip
  rect(378, 0, 102, 16, fb.ink(PAL.N0)); rect(378, 16, 102, 1, fb.ink(PAL.U3));
  rect(384, 5, 6, 6, fb.ink(PAL.R3)); pt(fb, 'LIVE · CHAT', 394, 4, PAL.P2);
  drawChatOverlay(fb, 378, 17, 102, RH - 17, k);
  rect(377, 0, 1, RH, fb.ink(PAL.N0));
  rect(0, 176, 480, 27, fb.ink(PAL.D1)); rect(0, 176, 480, 1, fb.ink(PAL.D3)); rect(0, 177, 480, 1, fb.ink(PAL.C2));
  const fl = hourglassFlip(k - mk(sh, 'flip', 0));
  const N = hourglassGrains('L');
  const hb = new Buf(120, 120, 0x1000001);
  hourglass(hb, 40, 30 + fl.dy, {size: 'L', pose: fl.pose, moved: fl.flipped ? Math.floor(Math.max(0, k - 12) / 6) : N, running: fl.flipped, f: k});
  for (let y = 60; y < 176; y++) for (let x = 60; x < 240; x++) {
    const v = hb.get(20 + ((x - 60) >> 1), 58 + ((y - 60) >> 1) - 30);
    if (v !== 0x1000001 && v !== undefined) fb.set(x, y, kA ? stepColor(v, -kA) : v);
  }
}, true);
S('S4.12', 'v3 27.28 twoshots drawBoard2S: the wall steps to slate; the door appears in held steps and opens; TASYA in it (re-clocked on the marks)', (fb, k, sh) => {
  v3(fb, '27.28', k + 15 - mk(sh, 'door', 16), sh, 0); // v3's door clock (door 1 at its f15) re-clocked onto the mark
});
S('S4.13', '[MCU·door] TASYA right third (tasyaSpeakPortrait, key ring jangling) framed by the new doorway, slate light; platePx first, then his sign MAS · GERG -> (a flat card, pt)', (fb, k, sh) => {
  held(fb, 's413', (b) => { boardBg({slate: true, door: 5, laptop: false, rolodex: 'still'})(b); soft(b, 2); vignette(b, 318, 2); });
  const sg = mk(sh, 'sign', 48);
  drawBust(fb, tasyaSpeakPortrait({mouth: mouth(sh, k, 'TASYA'), lid: blink(k, 9), brow: 'warm', arms: 'ring', jangle: (Math.floor(k / 4) % 2) as 0 | 1}), {third: 'R', dx: 4});
  doorFrame(fb, 246, 172, {leaf: 'left', leafW: 58, light: PAL.N5});
  if (k >= sg) { // the sign, held up in his hands (a cartoon prop: no quotation marks), the arrow pointing out
    const up = Math.max(0, 6 - (k - sg) * 2);
    const w = bpw('MAS · GERG →') + 20, x = 270, y = 130 + up, h = 34;
    rect(x - 1, y - 1, w + 2, h + 2, fb.ink(PAL.N0)); rect(x, y, w, h, fb.ink(PAL.P2)); rect(x, y + h - 3, w, 3, fb.ink(PAL.P0));
    bpt(fb, 'MAS · GERG →', x + 10, y + 9, PAL.N2);
  }
  const t = sh.texts.find((x) => x.kind === 'plate');
  if (t && k < t.e) plate3(fb, 22, 142, 'TASYA', 'THE LANDLORD · MACROSOFT', 'NOPEAI RUNS ON ITS SERVERS', k - t.s, PAL.C6);
});
S('S4.14', '[HIGH] drawTableInsert (blueprint, 1-3 ticked, 4 blank) + her ? in three strokes as she asks "Step four?"; her marker hand = clickHand (MARKED)', (fb, k, sh) => {
  const q = mk(sh, 'q', 8);
  const w = (k < q ? 0 : k < q + 4 ? 1 : k < q + 8 ? 2 : 3) as 0 | 1 | 2 | 3;
  drawTableInsert(fb, {f: k, focus: 'blueprint', word: w});
  const [wx, wy] = TABLE_INSERT.wordAt;
  const inn = Math.min(1, k / 5);
  nelehHand(fb, k < q ? Math.round(380 - 50 * inn) : wx + 18 + w * 14, k < q ? Math.round(214 - 44 * inn) : wy - 2);
});
S('S4.15', 'v3 27.31 [MCU] MADA right third (madaPortrait) + his spinner, the boardroom soft; he doesn\'t answer', (fb, k, sh, f) => { v3(fb, '27.31', k, sh, f); });

// ================================================================== S5 · HIS SIDE, 2 AM
S('S5.01', 'kit.cards (stand-in): the chapter door WHAT THEY DIDN\'T KNOW', (fb) => { actCard(fb, "WHAT THEY DIDN'T KNOW"); return {full: true}; }, true);
S('S5.02', 'v2 29.00 rooms-b drawDarkDesk: the home shot, the glass (water line flat) + the GUEST lanyard laid square', (fb, k, sh) => { v2(fb, '29.00', k, sh); });
S('S5.03', 'inserts-mas drawPhoneInsert29 (the true shot, hearted on the beat) with feedStandIn + RIMA TAMURI legible on the first (oldest) card, then the flood (post-ui stand-in)', (fb, k) => {
  drawPhoneInsert29(fb, {mode: 'true', f: k, screen: (bb) => {
    const {n, hearts: hs} = heartTapAt(k);
    feedStandIn(bb, n, hs);
    const S = PHONE29.screen, w = S.x1 - S.x0 + 1, cardH = 12 + wrapF(RIMA_POST, w - 8).length * 11 + 12;
    const top = S.y1 - Math.max(1, n) * cardH + 1;
    if (top + 3 >= S.y0) { rect(S.x0 + 13, top + 3, w - 16, 7, bb.ink(PAL.N2)); pt(bb, 'RIMA TAMURI', S.x0 + 14, top + 3, PAL.P1); }
  }});
}, true);
S('S5.04', 'twoshots drawDark2S + orbToLanyard (the lanyard in frame): the iris steps off the phone onto the lanyard on the mark', (fb, k, sh) => {
  const m = mk(sh, 'lanyard', 11);
  const look = orbStep(k, m - 30, [DPLATE_LOOK.phone, DPLATE_LOOK.phone, DPLATE_LOOK.lanyard], 15);
  drawDark2S(fb, k, {mas: {arm: 'phone', head: 'down'}, orb: {look}, plate: {tally: 3, lanyard: true, phone: 'up', boardGrid: true}});
});
S('S5.05', 'v3 29.05 [MCU] MAS left third turned to the Orb + the Orb soft; RACK Mas -> the Orb after "mostly."', (fb, k, sh, f) => { v3(fb, '29.05', k, sh, f); });
// ---- the staff letter as ONE page on his monitor
const LETTER = {x: 90, w: 300};
const letterPage = (b: Buf, k: number, sh: ShotV4) => {
  const ins = mk(sh, 'insult', 44), clunk = mk(sh, 'clunk', 132), sc = mk(sh, 'scroll', 199), alyi = mk(sh, 'alyi', 220), c0 = mk(sh, 'count0', 50);
  const demand = sh.texts[3]?.s ?? clunk + 10;
  const scroll = k < sc ? 0 : Math.min(40, (k - sc) * 2); // whole px, 2 a frame, <= 40 px (§7's budget)
  monitor(b);
  const H = 300, page = new Buf(LETTER.w, H, PAL.N1);
  // the header
  pt(page, 'STAFF LETTER · TO THE BOARD'.slice(0, Math.max(0, (k - mk(sh, 'header', 5)) * 2)), 12, 10, PAL.P2);
  rect(12, 22, 276, 1, page.ink(PAL.N4));
  if (k >= ins) pwrap('"…people that lack competence, judgment and care…"', 270).forEach((l, i) => pt(page, l, 12, 32 + i * 11, PAL.P1));
  if (k >= demand) pwrap('"…unless all current board members resign…"', 270).forEach((l, i) => pt(page, l, 12, 72 + i * 11, PAL.W7));
  rect(12, 98, 276, 1, page.ink(PAL.N4));
  pt(page, 'SIGNED', 12, 104, PAL.N6);
  for (let i = 0; i < 16; i++) {
    const y = 118 + i * 11;
    // v4.1: ALYI is the 10th name, below the fold (y 217 > the page's 191 px window) until the scroll brings it up
    if (i === 9) { rect(8, y - 2, 284, 11, page.ink(k >= alyi ? PAL.N4 : PAL.N2)); pt(page, 'ALYI (REPORTED)', 14, y, k >= alyi ? PAL.P2 : PAL.P0); continue; }
    rect(14, y + 1, 30 + ((i * 17) % 50), 5, page.ink(PAL.G2)); rect(110 + ((i * 7) % 20), y + 1, 40 + ((i * 29) % 60), 5, page.ink(PAL.G2));
  }
  for (let y = 0; y < RH - 12; y++) for (let x = 0; x < LETTER.w; x++) b.set(LETTER.x + x, 6 + y, page.get(x, Math.min(H - 1, y + scroll)));
  rect(LETTER.x - 1, 5, LETTER.w + 2, 1, b.ink(PAL.N4));
  // the counter in the page's corner, rolling under the insult line (launch-night clunk)
  const {value, clunk: kick} = odoRoll(Math.max(0, k - c0), LETTER_STOPS(0, Math.max(6, Math.round((clunk - c0 - 10) / 4))));
  odometer(b, LETTER.x + LETTER.w + 8, 12, k < c0 ? 0 : value, {digits: 3, label: 'SIGNED', suffix: '/ 770', kick});
  // his call thumbnail in the monitor's corner: ALYI's tile, the vote icon still flipped from noon
  const tx = LETTER.x + LETTER.w + 10, ty = 110;
  rect(tx - 1, ty - 1, 74, 44, b.ink(k >= alyi ? PAL.W5 : PAL.N4));
  drawAlyiTile(b, tx, ty, 72, 42, {mouth: 'rest', eyes: 'open', t: 0});
  rect(tx + 58, ty + 2, 12, 10, b.ink(PAL.R2)); pt(b, '✓', tx + 60, ty + 3, PAL.P2);
  rect(tx, ty + 43, 72, 10, b.ink(PAL.N0)); pt(b, 'ALYI', tx + 3, ty + 44, k >= alyi ? PAL.W7 : PAL.N6);
};
S('S5.06', '[POV] his monitor: the staff letter as ONE page (pt lettering) with a whole-px scroll (<= 40 px); avalanche odometer + odoRoll in its corner; drawAlyiTile thumbnail with the flipped vote; the chime + servo off picture', (fb, k, sh) => { letterPage(fb, k, sh); }, true);
S('S5.08', '[ECU·insert] the check slides down out of the rack\'s slot and lies flat (4 held steps): a flat paper insert (guilloche border, pt lettering): PAY TO: NOPEAI STAFF · ~$86B VALUATION · EVIRHT · MEMO: STAFF SHARE SALE; VOID IF CEO MISSING stamped beside the figure', (fb, k, sh) => {
  rect(0, 0, 480, RH, fb.ink(PAL.D1));
  const fl = mk(sh, 'flat', 8), st0 = Math.min(3, Math.floor((k * 4) / Math.max(1, fl)));
  const x = 40, y = 26 - (k < fl ? [160, 104, 52, 14][st0] : 0), w = 400, h = 150;
  rect(0, 0, 480, 6, fb.ink(PAL.N0)); rect(120, 0, 240, 4, fb.ink(PAL.G2)); rect(120, 4, 240, 1, fb.ink(PAL.G4)); // the slot's lip at the top edge
  rect(x + 4, y + 4, w, h, fb.ink(PAL.N0));
  rect(x, y, w, h, fb.ink(PAL.P1));
  for (let i = 0; i < w; i += 2) { const d = Math.round(2 + 2 * Math.sin(i / 7)); fb.set(x + i, y + 3 + d, PAL.L2); fb.set(x + i, y + h - 5 - d, PAL.L2); }
  for (let j = 0; j < h; j += 2) { const d = Math.round(2 + 2 * Math.sin(j / 7)); fb.set(x + 3 + d, y + j, PAL.L2); fb.set(x + w - 5 - d, y + j, PAL.L2); }
  bpt(fb, 'EVIRHT', x + 18, y + 16, PAL.N3);
  pt(fb, 'MEMO: STAFF SHARE SALE', x + 236, y + 20, PAL.G3);
  pt(fb, 'PAY TO:', x + 18, y + 54, PAL.G3);
  bpt(fb, 'NOPEAI STAFF', x + 70, y + 48, PAL.N2);
  rect(x + 68, y + 66, 300, 1, fb.ink(PAL.G4));
  rect(x + 18, y + 84, 150, 26, fb.ink(PAL.P2)); rect(x + 18, y + 84, 150, 1, fb.ink(PAL.G4));
  pt(fb, '~$86B VALUATION', x + 26, y + 93, PAL.N2);
  const st = mk(sh, 'stamp', 22);
  if (k >= st) {
    const kick = k === st ? 1 : 0;
    const sx = x + 196 + kick, sy = y + 80 + kick;
    rect(sx, sy - 4, 180, 44, fb.ink(PAL.R2)); rect(sx + 2, sy - 2, 176, 40, fb.ink(PAL.P1));
    bpt(fb, 'VOID IF CEO', sx + 90 - Math.round(bpw('VOID IF CEO') / 2), sy + 1, PAL.R2); bpt(fb, 'MISSING', sx + 90 - Math.round(bpw('MISSING') / 2), sy + 20, PAL.R2);
  }
  rect(x + 250, y + 128, 120, 1, fb.ink(PAL.G4)); pt(fb, 'SIGNATURE', x + 250, y + 132, PAL.P0);
});
S('S5.09', '[OTS] gerg-medium drawGergMediumPOV full on his monitor (lip-sync) -> the glance up into his camera (head up, keys stop) -> typing again; shoulder(masPortrait) in front, the monitor\'s green as his rim', (fb, k, sh) => {
  const g = mk(sh, 'glance', 123);
  const talk = lineAt(sh, k, 'GERG') !== null;
  const pov = new Buf(480, 270, PAL.N0);
  // v4.1: the shot ends on the glance (its own cut-in, S5.09b); his keys stop a few frames before it
  drawGergMediumPOV(pov, 0, 0, {head: talk ? 'talk' : 'type', mouth: mouth(sh, k, 'GERG')}, {f: k, speaking: talk, typing: !talk && k < g - 4, open: 1});
  // the dark room behind (held, soft 3), his monitor across the desk holding Gerg's tile at its own size (never scaled)
  held(fb, 's509bg', (b) => { drawDark2Splate(b, {tally: 3, glass: true, lanyard: true, phone: 'up'}); shiftRoom(b, -60); soft(b, 3); vignette(b, 240, 2); });
  const T = {x: 110, y: 22, w: 258, h: 138};
  rect(T.x - 8, T.y - 8, T.w + 16, T.h + 16, fb.ink(PAL.G1)); rect(T.x - 8, T.y - 8, T.w + 16, 1, fb.ink(PAL.G3)); rect(T.x - 1, T.y - 1, T.w + 2, T.h + 2, fb.ink(PAL.N0));
  for (let y = 0; y < T.h; y++) for (let x = 0; x < T.w; x++) fb.set(T.x + x, T.y + y, pov.get(T.x + x, T.y + y));
  rect(T.x + T.w / 2 - 12, T.y + T.h + 8, 24, 20, fb.ink(PAL.G1)); // the stand
  for (let y = T.y + T.h + 8; y < RH; y++) for (let x = T.x - 30; x < T.x + T.w + 30; x++) if (((x + y) & 3) === 0) fb.set(x, y, stepColor(fb.get(x, y), 1)); // the screen's spill on the desk
  blitImg(fb, shoulder(mas({head: '34'}), 70, PAL.L3, 1, true), -38, 30);
});
S('S5.09b', 'v4.1 swaps-act4 drawGergTileWide: his tile fills the frame; the glance into his camera, at Mas, held; then his eyes drop and he types (the keys return)', (fb, k, sh) => {
  drawGergTileWide(fb, {eyes: k < mk(sh, 'type', 29) ? 'lens' : 'screen', f: k});
});
S('S5.10', 'v3 29.15 [MCU·PF] MAS looks back; the dark room fallen away to the monitor\'s green + his cyan (Gerg typing again: the green flickers)', (fb, k, sh, f) => { v3(fb, '29.15', k, sh, f); });
/** v4.2: Tasya's sign from the boardroom (S4.13), taped to the slate door's upper panel: MAS / GERG / -> in its paper
 *  and ink, stepped down `dk` palette rungs with the door (its held steps up out of the shadow; S5.12's rack). It says
 *  whose door this is before "Everyone is welcome." widens it (the fresh newcomer read: "welcome where?"). */
const doorSign = (b: Buf, dk: number) => {
  const s = (c: number) => (dk > 0 ? stepColor(c, -dk) : c);
  const x = DPLATE.door.x0 + 7, y = DPLATE.door.y0 + 11, w = 31, h = 30;
  rect(x - 1, y - 1, w + 2, h + 2, b.ink(s(PAL.N1))); rect(x, y, w, h, b.ink(s(PAL.P2))); rect(x, y + h - 2, w, 2, b.ink(s(PAL.P0)));
  rect(x + 13, y - 2, 5, 2, b.ink(s(PAL.P1))); // the tape
  for (const [i, t] of ['MAS', 'GERG', '→'].entries()) pt(b, t, x + Math.round((w - pw(t)) / 2), y + 3 + i * 9, s(PAL.N2));
};
S('S5.11', 'twoshots drawDark2S: the slate door\'s held steps from the mark (v4.1: no V.O.); TASYA (O.S.); v4.2: his sign MAS / GERG / -> taped to the door', (fb, k, sh) => {
  const d = k - mk(sh, 'door', 6);
  const door = (d < 0 ? 0 : d < 12 ? 1 : d < 24 ? 2 : d < 36 ? 3 : 4) as 0 | 1 | 2 | 3 | 4;
  drawDark2S(fb, k, {mas: {arm: 'rest'}, orb: {look: DPLATE_LOOK.face}, plate: {tally: 3, lanyard: true, phone: 'up', door}});
  if (door >= 2) doorSign(fb, 4 - door);
});
S('S5.12', 'v3 29.17 [MCU] MAS left third, not turning; the slate door soft over his shoulder; RACK Mas -> the door after the line; v4.2: Tasya\'s sign on the door, stepped with the rack', (fb, k, sh, f) => {
  v3(fb, '29.17', k, sh, f);
  const l = lineOf(sh, 'a4-29-08');
  doorSign(fb, RACK[rackStep(k, (l ? l.e : 24) + 1)][1]); // the door's own soft rungs in 29.17 (the rack's B: 2 -> 0)
});

// ================================================================== S6 · THE AVALANCHE: one stack, ONE clock across the sequence
/** the v2 stack's clock (T) against S6's own frames (the sequence's local frame u): one continuous build */
const AVK: Array<[number, number]> = [[0, 0], [108, 232], [144, 252], [190, 336], [236, 430], [266, 520], [300, 780], [380, 880]];
const avT = (u: number) => {
  for (let i = 1; i < AVK.length; i++) if (u <= AVK[i][0]) { const [a, ta] = AVK[i - 1], [z, tz] = AVK[i]; return Math.round(ta + ((u - a) * (tz - ta)) / (z - a)); }
  return AVK[AVK.length - 1][1];
};
const S6_0 = SEQS.find((q) => q.id === 'S6')?.s ?? 0;
const s6u = (f: number, _sh: ShotV4) => f - S6_0;
/** the avalanche on his monitor with the letter's count STATIC (745 / 770): v3 restarted it at 0.
 *  v4.1: `hide` blanks a member's grid tile while their own tile is enlarged (the audit: two of each face) */
const avalanche4 = (fb: Buf, T: number, hide: string[] = []) => {
  const b = new Buf(480, 330, PAL.N1);
  const plan = stackPlan();
  const sh = [-shove(T, AT.alyi, 300), shove(T, AT.neleh, 300), 0, shove(T, AT.qv, 300)];
  BOARD4.forEach((t, i) => { const r = B4[i]; if (Math.abs(sh[i]) < 300 && !hide.includes(t.id)) drawTile(b, {...r, x: r.x + sh[i], id: t.id, name: t.name, vote: 3}, T); });
  scatter(b, B4[1].x + 74 + sh[1], B4[1].y + 20, T - AT.neleh - 17, {n: 12, digits: true, seed: 5, col: PAL.W8, life: 30});
  drawGridStack(b, plan, T, STACK, (bb, x, y, it) => employeeFace(bb, x, y, SLOT - 1, SLOT - 1, it.seed), {c: 6, r: 14, w: 13, h: 7, t0: AT.press});
  const cy = SY0 + 5 * SLOT;
  rect(36 * SLOT - 6, cy, 54, 11, b.ink(PAL.N0));
  pt(b, '745 / 770', 36 * SLOT + 46 - pw('745 / 770'), cy + 2, PAL.L3);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) fb.set(x, y, b.get(x, y + LIFT));
  callChrome(fb, {title: 'board sync', clock: null, controls: false, noFill: true, h: RH});
  void landedBy;
};
/** v4.1: the call's own notices, stacking at the grid's foot as each member goes (they read as resignations) */
const LEFT_AT: Array<[number, string]> = [[178, 'ALYI left the call'], [231, 'NELEH left the call'], [258, 'THE QUIET VOTE left the call']];
const leftNotices = (fb: Buf, u: number) => {
  let i = 0;
  for (const [t, s] of LEFT_AT) { if (u < t) break; toast(fb, 8, RH - 22 - 17 * i, s, u - t); i++; }
};
S('S6.01', 'avalanche planGridStack / drawGridStack on the board grid (his monitor, locked), sampled on ONE clock across S6; the letter\'s 745 / 770 static in the corner', (fb, k, sh, f) => {
  avalanche4(fb, avT(s6u(f, sh)));
});
const avMas = (fb: Buf, k: number) => {
  held(fb, 'mcu4:av', (b) => { const o: DarkPlateOpts = {tally: 3, glass: true, lanyard: true, phone: 'up' as const, screen: (scr: Buf) => { for (let y = 0; y < scr.h; y++) for (let x = 0; x < scr.w; x++) scr.set(x, y, ((x + y) % 4) ? PAL.S3 : PAL.N2); }}; drawDark2Splate(b, o); soft(b, 3); vignette(b, MCU_X.L + 56, 2); });
  if (Math.floor(k / 4) % 2) dimRectL(fb, 0, 0, 480, RH, 1);
  drawBust(fb, mas({look: -1}), {third: 'L'});
};
const drawDark2Splate = (b: Buf, o: DarkPlateOpts) => { drawDarkPlate(b, 0, o); drawDarkPlateDesk(b, 0, o); drawDarkPlateFront(b, 0, o); };
S('S6.02', '[MCU·PF] MAS left third, the monitor off frame lighting him; each landing steps the room\'s light, never his face', (fb, k) => { avMas(fb, k); });
/** a member's own tile grown to half the frame from their grid place (x, y = where it sits; it covers the grid tile) */
const halfTile = (fb: Buf, T: number, hide: string, paint: (b: Buf, x: number, y: number, w: number, h: number) => void, x0: number, dx = 0) => {
  avalanche4(fb, T, [hide]); dimRectL(fb, 0, 0, 480, RH, 2);
  const w = 240, h = 136, x = x0 + dx, y = 30;
  rect(x - 2, y - 2, w + 4, h + 4, fb.ink(PAL.N0));
  paint(fb, x, y, w, h);
};
S('S6.03', '[POV·half] ALYI\'s own tile (drawAlyiTile) grown from his grid place (the grid tile blanked: one face) on the same clock: shoved sideways, resists one beat, slides off; the notice ALYI left the call', (fb, k, sh, f) => {
  const dx = k < 10 ? -Math.floor(k * 2) : k < 25 ? -20 : -20 - (k - 25) * 18;
  halfTile(fb, avT(s6u(f, sh)), 'alyi', (b, x, y, w, h) => drawAlyiTile(b, x, y, w, h, {mouth: 'rest', eyes: 'open', t: k}), B4[0].x, dx);
  leftNotices(fb, s6u(f, sh));
});
S('S6.04', '[POV·half] NELEH\'s own tile (drawNelehTile, lip-sync; her grid tile blanked) over the stack; footnotes scatter; on "char" it leaves the frame; the notices stack', (fb, k, sh, f) => {
  const l = lineOf(sh, 'a4-29-09');
  const out = l ? l.e : 37;
  const dx = k < out ? Math.floor(k / 3) : 400;
  halfTile(fb, avT(s6u(f, sh)), 'neleh', (b, x, y, w, h) => drawNelehTile(b, x, y, w, h, {mouth: mouth(sh, k, 'NELEH'), lid: 0, brow: 'query'}, {orbit: k, scatter: k}), B4[1].x - 30, dx);
  if (k < out) scatter(fb, 330 + dx, 80, k, {n: 12, digits: true, seed: 5, col: PAL.W8, life: 30});
  leftNotices(fb, s6u(f, sh));
});
const MADA_BIG: TileRect = {x: 200, y: 46, w: 240, h: 136};
S('S6.06', 'v4.1 S6.05 + S6.06 as ONE shot: the grid on the same clock, THE QUIET VOTE\'s black tile pushed out (its notice); then MADA\'s own grid tile grows to half the frame in 3 held steps (the grid tile gone, not doubled); the label MADA · LAST FIRER STANDING flips in 3 held steps on the mark and holds', (fb, k, sh, f) => {
  const lb = mk(sh, 'label', 76), wd = mk(sh, 'wedge', 30);
  const u = s6u(f, sh), T = avT(u);
  if (k < wd) { avalanche4(fb, T); leftNotices(fb, u); return; }
  avalanche4(fb, Math.min(T, 880), ['mada']);
  leftNotices(fb, u);
  const g0: TileRect = {x: B4[2].x, y: B4[2].y - LIFT, w: B4[2].w, h: B4[2].h};
  const s = Math.min(3, Math.floor((k - wd) / 2) + 1);
  const r: TileRect = {x: Math.round(g0.x + ((MADA_BIG.x - g0.x) * s) / 3), y: Math.round(g0.y + ((MADA_BIG.y - g0.y) * s) / 3), w: Math.round(g0.w + ((MADA_BIG.w - g0.w) * s) / 3), h: Math.round(g0.h + ((MADA_BIG.h - g0.h) * s) / 3)};
  rect(r.x - 1, r.y - 1, r.w + 2, r.h + 2, fb.ink(PAL.N0));
  drawMadaTile(fb, r.x, r.y, r.w, r.h, {mouth: 'rest', lid: 0, nod: 0}, {spin: k, stopped: k >= lb});
  if (k >= lb) {
    const st = Math.min(3, Math.floor((k - lb) / 2) + 1);
    const hh = [0, 6, 11, 16][st];
    rect(r.x, r.y + r.h - hh, r.w, hh, fb.ink(PAL.N0));
    if (st >= 3) pt(fb, 'MADA · LAST FIRER STANDING', r.x + 6, r.y + r.h - 12, PAL.G6); // v4.1: ANSWERS GIVEN: 0 is cut
  }
});

// ================================================================== S7 · THE RETURN
/** the GUEST lanyard lying on his desk inside his window (not worn): the darkroom's lanyard card at desk scale */
const lanyardOnDesk = (b: Buf, x: number, y: number) => {
  for (let i = 0; i < 44; i++) b.set(x - 18 + i, y + 6 + Math.round(Math.sin(i / 7) * 2), PAL.C5); // the strap, lying loose
  rect(x + 24, y, 30, 16, b.ink(PAL.N0)); rect(x + 25, y + 1, 28, 14, b.ink(PAL.P2)); rect(x + 25, y + 1, 28, 3, b.ink(PAL.R2));
  pt(b, 'GUEST', x + 27, y + 6, PAL.N2);
};
S('S7.01', '[P2] BOX (the act\'s one deliberate box): twoshots drawDoorwayP2 re-clocked on the marks (hearts, Alyi looks up, the IOU) + the GUEST lanyard lying on his desk in his window, not worn; post-ui stand-in', (fb, k, sh) => {
  const h1 = mk(sh, 'heart1', 104), h2 = mk(sh, 'heart2', 116), h3 = mk(sh, 'heart3', 128), up = mk(sh, 'up', 136), iou = mk(sh, 'iou', 140);
  drawDoorwayP2(fb, k, {hearts: [h1, h2, h3], alyi: {mouth: mouth(sh, k, 'ALYI'), up: k >= up}, iou: (k < iou ? 0 : Math.floor(k / 4) % 2 ? 1 : 2) as 0 | 1 | 2, openL: Math.min(1, (k + 1) / 3), openR: Math.min(1, (k + 1) / 3)});
  if (k >= 3) { rect(14, 140, 108, 20, fb.ink(PAL.D2)); rect(14, 140, 108, 1, fb.ink(PAL.D4)); lanyardOnDesk(fb, 40, 142); }
  const p = lineOf(sh, 'a4-30-01');
  if (p && k >= p.s && k < h1 + 6) postCard4(fb, 150, 130, 190, 'ALYI', 'I deeply regret my participation in the board\'s actions.', k - p.s);
}, true);
S('S7.02', 'rooms-b bullpen walkout (coats, packed boxes; Mas small at his end desk; Tasya mid-floor): the establishing wide, held (v4.1: the line and the slate steps move to S7.02b)', (fb) => {
  held(fb, 'land-000', (b) => bullpenRoom(b, 0, {variant: 'walkout'}, {mas: true, tasya: {arm: 'clasp'}, landlord: {floor: 0, ceiling: 0, walls: 0}}));
});
const stepOf4 = (k: number, t: number) => (k < t ? 0 : k < t + 5 ? 1 : k < t + 10 ? 2 : 3);
S('S7.02b', 'v4.1 [MCU] TASYA right third (tasyaSpeakPortrait, lip-sync) over the bullpen walkout soft 2; behind him the floor / ceiling / walls step to slate in 3 held steps on "below / above / around"', (fb, k, sh) => {
  const L = {floor: stepOf4(k, wordAt(sh, 'a4-30-02', 'below', 17)), ceiling: stepOf4(k, wordAt(sh, 'a4-30-02', 'above', 37)), walls: stepOf4(k, wordAt(sh, 'a4-30-02', 'around', 57))};
  MCU(fb, `s702b-${L.floor}${L.ceiling}${L.walls}`, (b) => bullpenRoom(b, 0, {variant: 'walkout'}, {mas: false, tasya: null, landlord: L}),
    tasyaSpeakPortrait({mouth: mouth(sh, k, 'TASYA'), lid: blink(k, 9), brow: 'warm', arms: 'clasp', jangle: 0}), {third: 'R'});
});
S('S7.03', 'v3 30.06 [MCU·PF] MAS left third, eyes down (masLookDown) over the all-slate bullpen soft', (fb, k, sh, f) => { v3(fb, '30.06', k, sh, f); });
S('S7.05', 'twoshots drawMadaM (the boardroom plate with fires, mada-medium): perfectly still among the fires', (fb, k) => { drawMadaM(fb, k, {}); });
const FIRE_PLATES = {A: null, B: 'ALYI', C: null, D: 'NELEH', E: 'THE QUIET VOTE'} as const;
S('S7.06', 'rooms-a boardroom wide (FIRES_SC30), ONE held setup: the door bangs (SHAKE_DOOR), TERB in, the helmet -> FULL FREEZE (2-tone) + Mas walking through in colour, the pin + nameCard TERB -> unfreeze, Mas by Terb; the look-around; "…Ah."', (fb, k, sh, f) => {
  const bang = mk(sh, 'bang', 5), helmet = mk(sh, 'helmet', 23), fz = mk(sh, 'freeze', 31), un = mk(sh, 'unfreeze', 96), look = mk(sh, 'look', 140);
  if (k < fz) {
    const open = k >= bang;
    boardRoom(fb, k, {fires: FIRES_SC30, door: open ? 'open' : 'closed', doorFlash: k === bang ? 1 : 0, rolodex: 'still', plates: {...FIRE_PLATES}},
      {mada: true, terb: open ? {x: 394 - Math.floor(on2(k - bang) * 1.5), pose: {legs: terbWalkAt(k), helmet: k >= helmet, arm: 'carry'}} : null, shake: doorShake(k, bang)});
    return;
  }
  const tx = 394 - Math.floor(on2(fz - bang) * 1.5);
  if (k < un) {
    const kk = k - fz;
    held(fb, `s706-freeze-${tx}`, (b) => { boardRoom(b, 0, {fires: FIRES_SC30, door: 'open', rolodex: 'still', plates: {...FIRE_PLATES}}, {mada: true, terb: {x: tx, pose: {legs: 'stand', helmet: true, arm: 'carry', pin: true}}}); freezePrint(b); });
    const pin = mk(sh, 'pin', 74) - fz;
    const x = Math.min(tx - 38, 150 + on2(Math.max(0, kk - 4)) * 4);
    drawMasStand(fb, x, 196, {...MAS_STAND_DEFAULT, legs: x < tx - 38 ? masWalkAt(kk) : 'stand', arm: kk < pin - 6 ? 'down' : kk < pin + 4 ? 'reach' : 'pocket', light: 'room'});
    blipCard(fb, kk, 'TERB', 'TERB', 'THE NEW CHAIR', 'EXTINGUISHERS: 1', {f, x: {helmet: true}}, 'L'); // v4.1: the card no longer tells the joke
    return;
  }
  const around = k >= look && k < look + 18 ? 1 + (Math.floor((k - look) / 5) % 2) : 0;
  held(fb, `s706-after-${tx}-${around}`, (b) => boardRoom(b, 0, {fires: FIRES_SC30, door: 'open', rolodex: 'still', plates: {...FIRE_PLATES}},
    {mada: true, terb: {x: tx + (around === 1 ? 2 : 0), pose: {legs: 'stand', helmet: true, arm: 'carry', pin: false}}, mas: {x: tx - 38, pose: {legs: 'stand', arm: 'pocket', light: 'room'}}}));
}, true);
S('S7.07', 'twoshots drawCalmOff2S: THE CALM-OFF, two still men; Terb sprays behind them; keycaps; MADA\'s "Good question." lip-synced in the same frame', (fb, k, sh) => {
  drawCalmOff2S(fb, k, {terb: {spray: k >= 10 ? k - 10 : null}, mada: {mouth: mouth(sh, k, 'MADA')}, plate: {keycaps: k}});
});
S('S7.08', 'v3 30.14 [MCU] MAS left third, near-front, warm, the fires soft; one beat late', (fb, k, sh, f) => { v3(fb, '30.14', k, sh, f); });
S('S7.09', 'twoshots drawCalmOff2S (the S7.07 setup): HOLD; the spinner stops, the nod, Terb\'s hand stamps the term sheet and hands it over (re-clocked on the marks)', (fb, k, sh) => {
  const stop = mk(sh, 'stop', 18), nd = mk(sh, 'nod', 24), stp = mk(sh, 'stamp', 36), hand = mk(sh, 'hand', 53);
  const n = k - nd;
  const nod = (n < 0 ? 0 : n < 2 ? 1 : n < 4 ? 2 : n < 6 ? 1 : 0) as 0 | 1 | 2;
  drawCalmOff2S(fb, k, {mada: {nod}, spin: Math.min(k, stop), stopped: k >= stop, terb: null,
    plate: {fires: FIRES_CALMOFF(-40), keycaps: 40, termSheet: k < stp - 6 ? 'none' : k < stp ? 'blank' : 'stamped', terbHand: k < stp - 6 ? 'none' : k < hand ? 'stamp' : 'hand'}});
});
S('S7.10', '[ECU·insert] the term sheet: a flat paper card (pt): TERMS · 1. CEO: MAS MANALT, the rest folded under (the blueprint fold, in paper colours)', (fb) => {
  rect(0, 0, 480, RH, fb.ink(PAL.D2));
  for (let k2 = 0; k2 < 50; k2++) rect((k2 * 97) % 480, (k2 * 53) % RH, 40, 1, fb.ink(PAL.D1));
  const x = 110, y = 14, w = 260, h = 190;
  rect(x + 4, y + 4, w, h, fb.ink(PAL.N0)); rect(x, y, w, h, fb.ink(PAL.P2));
  bpt(fb, 'TERMS', x + 20, y + 16, PAL.N2);
  rect(x + 20, y + 36, 120, 1, fb.ink(PAL.G4));
  bpt(fb, '1. CEO: MAS MANALT', x + 20, y + 50, PAL.N2);
  // the fold: the rest of the sheet laid back under (its crease, the flap's own ruling), THE PLAN's fold again
  const fy = y + 80;
  rect(x, fy, w, 2, fb.ink(PAL.P0)); rect(x, fy + 2, w, 3, fb.ink(PAL.G5));
  for (let yy = fy + 5; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) fb.set(xx, yy, (yy - fy) % 8 === 0 ? PAL.P0 : PAL.P1);
  // Terb's stamp at the corner (the one he just brought down)
  for (let a = 0; a < 360; a += 4) { const r1 = 13, r2 = 10; fb.set(Math.round(x + 212 + Math.cos(a * Math.PI / 180) * r1), Math.round(y + 26 + Math.sin(a * Math.PI / 180) * r1), PAL.R2); if (a % 12 === 0) fb.set(Math.round(x + 212 + Math.cos(a * Math.PI / 180) * r2), Math.round(y + 26 + Math.sin(a * Math.PI / 180) * r2), PAL.R2); }
  rect(x + 206, y + 25, 13, 2, fb.ink(PAL.R2)); // Terb's seal, no words: the stamp says it
});
S('S7.11', 'v4.1: his phone (a drawn phone: bezel, camera notch, the clock), lit green over the boardroom (fires) stepped down; GERG\'s post on it (on the lock\'s cue); keycaps pop off the screen', (fb, k, sh) => {
  held(fb, 's711bg', (b) => { boardRoom(b, 0, {fires: FIRES_SC30, door: 'open', rolodex: 'still', plates: {...FIRE_PLATES}}, {mada: true}); soft(b, 3); vignette(b, 240, 3); });
  const X = 140, W = 200, Y = 8;
  rect(X - 4, Y - 4, W + 8, RH, fb.ink(PAL.N0)); rect(X - 3, Y - 3, W + 6, RH, fb.ink(PAL.G2)); rect(X - 3, Y - 3, W + 6, 1, fb.ink(PAL.G5)); // the body
  rect(X, Y, W, RH, fb.ink(PAL.L0)); // the screen, lit green
  rect(X + W / 2 - 14, Y + 3, 28, 5, fb.ink(PAL.N0)); // the camera notch
  rect(X, Y + 10, W, 10, fb.ink(PAL.L1)); pt(fb, '11:04 PM', X + 6, Y + 11, PAL.P1);
  const p = lineOf(sh, 'a4-30-10');
  if (p) postCard4(fb, X + 8, 56, W - 16, 'GERG MOCKBRAN', 'Returning to NopeAI & getting back to coding tonight.', k - p.s, {col: PAL.L3});
  keycapRain(fb, k);
}, true);
S('S7.13', '[HIGH] drawTableInsert (prop) + kits props hourglass L: the last grain; TTEMME\'s post (post-ui stand-in); hairlines, then the shatter on the post\'s last beat; the sand holds a beat, then falls', (fb, k, sh) => {
  drawTableInsert(fb, {f: k, focus: 'prop'});
  const [px, py] = TABLE_INSERT.prop;
  const N = hourglassGrains('L');
  const sht = mk(sh, 'shatter', 88), g = mk(sh, 'grain', 7);
  // v4.1: the hourglass at insert scale, 2x (the MARKED stand-in S4.11 already uses), standing on the prop spot
  const KEY = 0x1000001, hb = new Buf(64, 64, KEY), hx = 20, hy = 14;
  hourglass(hb, hx, hy, {size: 'L', moved: k < g ? N - 1 : N, running: k < g, f: k, shatter: k >= sht ? k - sht : undefined});
  if (k >= sht - 46 && k < sht) {
    const cx = hx + 11, gy = hy + 3;
    const a: Array<[number, number]> = [[7, 5], [6, 6], [6, 7], [5, 8]], b2: Array<[number, number]> = [[-5, 21], [-4, 22], [-4, 23], [-3, 24]], c: Array<[number, number]> = [[4, 9], [4, 10], [3, 11], [-2, 25]];
    for (const [i, j] of a) hb.set(cx + i, gy + j, PAL.C9);
    if (k >= sht - 16) for (const [i, j] of b2) hb.set(cx + i, gy + j, PAL.C9);
    if (k >= sht - 5) for (const [i, j] of c) hb.set(cx + i, gy + j, PAL.C9);
  }
  const ox = px - 5 - 2 * (hx + 11), oy = py - 21 - 2 * (hy + 37); // the glass's centre and foot where the 1x prop stood
  for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) { const v = hb.get(x, y); if (v === KEY) continue; rect(ox + 2 * x, oy + 2 * y, 2, 2, fb.ink(v)); }
  const p = lineOf(sh, 'a4-30-11');
  if (p) postCard4(fb, 20, 20, 220, 'TTEMME', 'I am deeply pleased by this result, after ~72 very intense hours of work.', k - p.s);
}, true);

// ================================================================== S8 · THE LOBBY, AND AFTER
S('S8.01', 'v3 30.19 rooms-a lobby at night cropped on the sign (the sign ignites 1,2,1,2,3); Mas small at the desk (crop stand-in for a true low angle)', (fb, k, sh, f) => { v3(fb, '30.19', k, sh, f); }, true);
/** a maintenance hand (work glove) with the box of zeros: a drawn stand-in, not a label */
const gloveHand = (b: Buf, x: number, y: number) => {
  rect(x, y, 40, 26, b.ink(PAL.G4)); rect(x, y, 40, 3, b.ink(PAL.G5)); // the back of the glove
  for (let i = 0; i < 4; i++) rect(x - 10, y + 2 + i * 6, 12, 5, b.ink(i % 2 ? PAL.G4 : PAL.G5)); // fingers under the box edge
  rect(x + 40, y + 4, 60, 20, b.ink(PAL.U1)); rect(x + 40, y + 4, 60, 2, b.ink(PAL.U2)); // the sleeve
};
S('S8.02', 'rooms-a drawSignFloorInsert: the box of spare 0 plates set down under the sign + a drawn gloved hand (stand-in art, no label)', (fb, k) => {
  const bx = k < 8 ? 0 : k < 16 ? 1 : 2;
  drawSignFloorInsert(fb, {f: k, box: bx as 0 | 1 | 2});
  if (k < 26) gloveHand(fb, 300 + (k >= 16 ? (k - 16) * 8 : 0), 112 + (bx === 1 ? -6 : 0));
}, true);
S('S8.03', 'rooms-a lobby night + callgrid callDialog: Cancel greys a dither step a beat; drawPointer with an EMPTY tag clicks: bonk, the dialog SHAKES (shakeAt), refused; tries again; shoulder(masPortrait) tungsten rim', (fb, k, sh) => {
  held(fb, 'lobby-s3', (b) => lobbyRoom(b, 0, {sign: 3}));
  const dl = mk(sh, 'dialog', 5), g1 = mk(sh, 'grey1', 15), g2 = mk(sh, 'grey2', 30), c1 = mk(sh, 'click', 46), c2 = 9999;
  if (k >= dl) {
    const grey = (k < g1 ? 1 : k < g2 ? 2 : 3) as 1 | 2 | 3;
    const [s1x, s1y] = k >= c1 && k < c1 + 8 ? shakeAt(k, c1, SHAKE_DOOR) : k >= c2 && k < c2 + 8 ? shakeAt(k, c2, SHAKE_DOOR) : [0, 0];
    const dx = 118 + s1x * 2, dy = 40 + s1y * 2, dw = 244;
    callDialog(fb, dx, dy, {w: dw, head: 'MAS MANALT', grey}); // v4.2: a greyed button never goes down (the bonk and the shake are the refusal)
    const [bx, by] = dialogButton(118, 40, 'cancel', dw);
    const tgt: [number, number] = [bx + 30, by + 9];
    let p: [number, number] | null = null;
    // v4.2: the noon arrow's design and rhythm: it steps in from the frame's edge one position a beat from grey 2, onto
    // the greyed Cancel, clicks, bonks, backs off. Its tag is the noon tag's size, empty (the fresh newcomer read
    // never saw v4.1's small tag, which glided in 0.4 s before the click)
    if (k >= g2 && k < c1) p = k < c1 - 8 ? [tgt[0] + 92, tgt[1] + 40] : tgt; // in on grey 2, onto Cancel a half-beat before the click
    else if (k >= c1 && k < c1 + 8) p = tgt;
    else if (k >= c1 + 8) p = pointerAt(on2(k), c1 + 8, c1 + 14, tgt, [tgt[0] + 26, tgt[1] + 22]); // it backs off, refused
    if (p) { drawPointer(fb, p[0], p[1], (k >= c1 && k < c1 + 2) || (k >= c2 && k < c2 + 2)); cursorTagBig(fb, p[0], p[1], '', PAL.N6); }
  }
  blitImg(fb, shoulder(mas({look: 1}), 70, PAL.W5, 1, true), -40, 40);
});
S('S8.04', 'v2 30.25 mas-cu drawMasCU (lobby): the same ONE silent drawing, the tungsten behind him', (fb, k, sh) => { v2(fb, '30.25', k, sh); });
/** the reception desk's own top: the lobby insert's dark surface recoloured to pale stone with a brass edge */
const STONE: Record<number, number> = {[PAL.G0]: PAL.G3, [PAL.G1]: PAL.G4, [PAL.G2]: PAL.G5, [PAL.G3]: PAL.G6};
const DESK_TOP = {y0: 126, y1: 176};
let LOBBY_PLATE: Buf | null = null; // the insert with no hand ('gone'): pixels that match it are the desk (the hand and sleeve are not)
const lobbyPlate = () => (LOBBY_PLATE ??= (() => { const b = new Buf(480, 270, PAL.N0); drawNudgeInsert(b, 'lobby', 'gone'); return b; })());
S('S8.05', 'inserts-mas drawNudgeInsert (lobby): held -> set -> NUDGE; the desk top recoloured to the reception desk\'s pale stone + a brass edge (the lobby, not the suite\'s wood)', (fb, k, sh) => {
  drawNudgeInsert(fb, 'lobby', k < mk(sh, 'set', 4) ? 'held' : k < mk(sh, 'nudge', 10) ? 'set' : 'nudge');
  const P = lobbyPlate();
  for (let y = DESK_TOP.y0; y < DESK_TOP.y1; y++) for (let x = 0; x < 480; x++) { const c = fb.get(x, y); const st = STONE[c]; if (st !== undefined && P.get(x, y) === c) fb.set(x, y, (x * 5 + y * 3) % 17 === 0 ? PAL.G4 : st); }
  for (const yy of [DESK_TOP.y0 - 1, DESK_TOP.y1]) for (let x = 0; x < 480; x++) if (P.get(x, yy) === fb.get(x, yy)) fb.set(x, yy, yy === DESK_TOP.y1 ? PAL.W5 : PAL.W6); // the brass edges
}, true);
S('S8.06', 'v2 31.01 inserts-props drawVaultInsert: Q*, the sticky note, humming on F', (fb, k) => { drawVaultInsert(fb, k); });
/** the Q* vault at room scale: a steel door with its wheel, the stencil, the sticky note (a drawn stand-in, no label) */
const vaultDoor = (b: Buf, x: number, y: number) => {
  rect(x, y, 70, 80, b.ink(PAL.G2)); rect(x, y, 70, 2, b.ink(PAL.G4)); rect(x + 68, y, 2, 80, b.ink(PAL.G1));
  rect(x + 4, y + 4, 62, 72, b.ink(PAL.G3));
  for (let a = 0; a < 360; a += 8) { const r = 13; b.set(Math.round(x + 35 + Math.cos(a * Math.PI / 180) * r), Math.round(y + 42 + Math.sin(a * Math.PI / 180) * r), PAL.G5); }
  for (let i = -12; i <= 12; i++) { b.set(x + 35 + i, y + 42, PAL.G5); b.set(x + 35, y + 42 + i, PAL.G5); }
  rect(x + 2, y + 16, 4, 10, b.ink(PAL.G1)); rect(x + 2, y + 56, 4, 10, b.ink(PAL.G1));
  bpt(b, 'Q*', x + 22, y + 8, PAL.N2);
};
S('S8.07', '[MCU-2] the frameless 50/50: MAS left + GERG right (gergGlow) over the bullpen by day soft 1; the Q* vault drawn at room scale between them + the Orb at his shoulder looking at it; RACK to the sticky note; Gerg reads it and walks out', (fb, k, sh) => {
  const l = lineOf(sh, 'a4-31-02');
  const r0 = mk(sh, 'rack', (l ? l.e : 40) + 2);
  const st = rackStep(k, r0);
  const [kA, kB] = RACK[st];
  held(fb, `s807:${kB}`, (b) => {
    drawBullpen(b, 0, {door: 'shut'});
    const vm = new Uint8Array(480 * 270); keepRect(vm, 204, 100, 76, 90);
    soft(b, 1, vm); vignette(b, 158, 1); vignette(b, 330, 1);
    vaultDoor(b, 206, 96);
    rect(210, 142, 60, 31, b.ink(PAL.W7)); rect(210, 142, 60, 1, b.ink(PAL.W8));
    pt(b, 'DO NOT', 214, 145, PAL.D1); pt(b, 'OPEN. DO NOT', 214, 154, PAL.D1); pt(b, 'EXPLAIN.', 214, 163, PAL.D1);
    if (kB) softMask(b, kB, vm);
  });
  const gx = k < r0 + 20 ? 0 : Math.floor((k - r0 - 20) / 2) * 6;
  drawBust(fb, mas({mouth: mouth(sh, k, 'MAS'), look: -1}), {third: 'L', dx: -8, y: 24, faceK: kA});
  drawOrb(fb, 186, 44, 9, {look: [0.9, 0.5], aperture: 0.5});
  if (gx < 200) drawBust(fb, gergGlow({mouth: mouth(sh, k, 'GERG'), lid: k >= r0 + 12 ? 0 : 1, look: -1}), {third: 'R', dx: 14 + gx, y: 26 + (k >= r0 + 16 && k < r0 + 19 ? 1 : 0), faceK: kA});
}, true);
S('S8.08', 'v3 31.03 [MCU] MAS left third at his desk reading the memo aloud (masPortrait, warm) over the bullpen soft; lip-sync', (fb, k, sh, f) => { v3(fb, '31.03', k, sh, f); });
/** a maintenance hand turning a screwdriver (drawn stand-in, no label) */
const screwHand = (b: Buf, x: number, y: number, turn: number) => {
  rect(x, y, 8, 30, b.ink(PAL.W4)); rect(x + 2, y, 4, 30, b.ink(PAL.W6)); // the handle
  rect(x + 3, y - 18, 2, 18, b.ink(PAL.G5)); // the shaft
  rect(x - 12, y + 8 + turn, 32, 22, b.ink(PAL.S3)); rect(x - 12, y + 8 + turn, 32, 3, b.ink(PAL.S4)); // the fist
  rect(x + 20, y + 12 + turn, 60, 16, b.ink(PAL.U1)); // the sleeve
};
S('S8.09', 'rooms-a drawChairBackInsert (the boardroom chair back, SCORCHED by sc 30\'s fire): four screws, four beats; the ALYI plate comes off + a drawn hand and screwdriver (no label)', (fb, k, sh) => {
  const s = [mk(sh, 's1', 0), mk(sh, 's2', 15), mk(sh, 's3', 30), mk(sh, 's4', 45)];
  const n = s.filter((t) => k >= t + 4).length, off = k >= s[3] + 5;
  drawChairBackInsert(fb, {f: k, screws: n, plateOff: off});
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { // the scorch: soot creeping up from the lower right
    const d = Math.hypot((x - 480) / 260, (y - 210) / 130);
    if (d < 1 && ((x * 7 + y * 11) % 5) < (1 - d) * 7) fb.set(x, y, stepColor(fb.get(x, y), d < 0.5 ? -3 : -2));
  }
  if (!off) screwHand(fb, 300 + (n % 2) * 40, 90, Math.floor(k / 4) % 2);
  else { // v4.1: the plate is gone and its outline stays: the unfaded leather a step lighter, a clean edge (he is off the board)
    const P = {x0: 176, y0: 86, x1: 304, y1: 118};
    for (let y = P.y0; y <= P.y1; y++) for (let x = P.x0; x <= P.x1; x++) fb.set(x, y, stepColor(fb.get(x, y), 1));
    rect(P.x0, P.y0, P.x1 - P.x0 + 1, 1, fb.ink(PAL.D4)); rect(P.x0, P.y1, P.x1 - P.x0 + 1, 1, fb.ink(PAL.D1));
  }
}, true);
/** the Macrosoft-blue folding chair, unfolding in 4 held drawings; its label */
const foldChair = (b: Buf, x: number, y: number, u: number) => {
  // from the front: two posts, the backrest; the seat swings down out of the frame (a sliver, half, open) and the legs
  // splay. 4 held drawings, whole px. MACROSOFT blue (the fleece ramp's blues).
  const c0 = PAL.F2, c1 = PAL.F4, c2 = PAL.F5, c3 = PAL.F6, W = 44, floor = y + 86;
  const splay = [0, 2, 5, 8][u];
  rect(x, y, 5, floor - y, b.ink(c1)); rect(x + W - 5, y, 5, floor - y, b.ink(c1)); // the rear posts
  rect(x + 1, y, 1, floor - y, b.ink(c3)); rect(x + W - 4, y, 1, floor - y, b.ink(c3));
  rect(x - 1, y + 4, W + 2, 22, b.ink(c2)); rect(x - 1, y + 4, W + 2, 2, b.ink(c3)); rect(x - 1, y + 24, W + 2, 2, b.ink(c0)); // the backrest
  const sh = [0, 4, 8, 12][u], sy = y + 44;
  if (u === 0) rect(x + 5, sy - 10, W - 10, 30, b.ink(c1)); // folded: the seat stands flat against the back
  else { rect(x - 2 - splay, sy, W + 4 + splay * 2, sh, b.ink(c2)); rect(x - 2 - splay, sy, W + 4 + splay * 2, 2, b.ink(c3)); rect(x - 2 - splay, sy + sh - 1, W + 4 + splay * 2, 1, b.ink(c0)); }
  for (let j = 0; j < floor - sy - sh; j++) { const d = Math.round((j * splay) / 30); rect(x - 2 - d, sy + sh + j, 4, 1, b.ink(c1)); rect(x + W - 2 + d, sy + sh + j, 4, 1, b.ink(c1)); } // the front legs
  rect(x - 3 - splay, floor, 8, 2, b.ink(c0)); rect(x + W - 5 + splay, floor, 8, 2, b.ink(c0));
};
S('S8.10', 'rooms-b bullpen (window corner, door shut) + a drawn Macrosoft-blue folding chair (4 held drawings) + its label MACROSOFT · OBSERVER (NON-VOTING); Tasya\'s key ring drops onto the seat', (fb, k, sh) => {
  held(fb, 'bull-shut4', (b) => bullpenRoom(b, 0, {door: 'shut'}, {}));
  const u = Math.min(3, Math.floor((k - mk(sh, 'unfold', 0)) / 5));
  foldChair(fb, 380, 92, Math.max(0, u));
  const t = sh.texts.find((x) => x.kind === 'label');
  if (t && k >= t.s) { // the chair's own placard, hung on a cord from its backrest
    const w = pw('MACROSOFT · OBSERVER') + 12, x0 = 402 - Math.round(w / 2), y0 = 60;
    rect(401, y0 + 26, 1, 10, fb.ink(PAL.G4)); rect(x0, y0, w, 26, fb.ink(PAL.P2)); rect(x0, y0, w, 2, fb.ink(PAL.F5)); rect(x0, y0 + 24, w, 2, fb.ink(PAL.P0));
    pt(fb, 'MACROSOFT · OBSERVER', x0 + 6, y0 + 5, PAL.F2); pt(fb, '(NON-VOTING)', x0 + 6, y0 + 15, PAL.F4);
  }
  const kr = mk(sh, 'keys', 48);
  if (k >= kr) { const y = Math.min(132, 60 + (k - kr) * 9); for (let a = 0; a < 360; a += 30) fb.set(Math.round(398 + Math.cos(a * Math.PI / 180) * 5), Math.round(y + Math.sin(a * Math.PI / 180) * 5), PAL.W6); rect(396, y + 5, 2, 7, fb.ink(PAL.W5)); rect(401, y + 5, 2, 5, fb.ink(PAL.W5)); }
}, true);

// ================================================================== checks
export const missingShots4 = (ids: string[]) => ids.filter((id) => !DRAW4[id]);
void clamp; void box; void bezel; void toast; void dimRoom; void drawDarkDesk; void madaPortrait; void MADA_PORTRAIT_DEFAULT; void drawSpinner; void alyiReflection;
void LAPTOP_INSERT; void drawLaptopInsert; void drawPhone29Timeline; void PLAN29; void call26; void G4; void keepRect; void HG; void SCR_H; void DPLATE;
