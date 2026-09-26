// MR. MAS — Ep1 Act Four · THE EDITOR's animatic v2: one layout per locked shot (owned by THE EDITOR).
// (v3: its helpers are exported for shots3.ts, which re-uses these layouts through an adapter; the v2 DRAW registry is unchanged.)
// Every shot of timing lock v2 (data-v2.ts) is laid out with the ACTUAL built assets where they exist (rooms, portraits,
// the medium tier, the inserts, the kits) at the shot's size, and with labelled boxes where nothing is built yet.
// `k` is the shot-relative frame, `f` the act frame. A draw paints the native frame's room area (rows 0-202; the
// frame composer adds the rail band, the in-picture dialogue box and the V.O. line) or, with `full`, all 270 rows.
import {Buf, rect, clamp} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {inPalette} from '../../../../shared/pixel/palettes';
import {text, textWidth} from '../../../../shared/pixel/font';
import type {GlyphLayer} from '../../../../shared/pixel/glyph';
import {renderFront, frontPos} from '../../../../shared/pixel/transitions';
import {blitImg} from '../../../../shared/pixel/figure';
import {BLUEPRINT_PRINT} from '../../../../shared/pixel/kits/blueprint';
import {
  gridLayout, slideTiles, callChrome, drawTile, TileRect, captureTile, tileDrop, callDialog, dialogButton, drawPointer, pointerAt,
  typedDots, tilePlate, dropY, plateFallY, spinner, postChip, cctv, employeeFace, CALL_BAR_H,
} from '../../../../shared/pixel/kits/callgrid';
import {
  planPile, withBlueHeart, drawPile, pileTopAt, pileHeartAt, PileHeart, planGridStack, drawGridStack, GridStackOpts, GridItem, landedBy,
  reactionBurst, shove, scatter, odometer, odoRoll, LETTER_STOPS, heartCounter, drawHeart, BLUE,
} from '../../../../shared/pixel/kits/avalanche';
import {drawSuite, suitePortraitBg} from '../../../../shared/pixel/rooms/vegas-suite';
import {drawTpoolDoor, drawTpoolClose} from '../../../../shared/pixel/rooms/tpool-door';
import {drawDarkDesk} from '../../../../shared/pixel/rooms/darkroom';
import {DPLATE_LOOK} from '../../../../shared/pixel/rooms/darkroom-plate';
import {FIRES_SC30, drawTableInsert, TABLE_INSERT, drawChairBackInsert} from '../../../../shared/pixel/rooms/boardroom';
import {ALLHANDS_TILES} from '../../../../shared/pixel/rooms/bullpen';
import {throneImg, drawRentMeter} from '../../../../shared/pixel/rooms/lighthouse';
import {drawLobbyCam, CAM, drawSignFloorInsert} from '../../../../shared/pixel/rooms/lobby';
import {drawDark2S, orbTally, orbToLanyard, drawBoard2S, drawMadaM, drawCalmOff2S, FIRES_CALMOFF, drawDoorwayP2, drawVaultP2} from '../../../../shared/pixel/rooms/twoshots';
import type {BoardPlateOpts} from '../../../../shared/pixel/rooms/boardroom-plate';
import {drawMasCU, drawEyesStrip} from '../../../../shared/pixel/cast/mas-cu';
import {drawMasStand, MAS_STAND_DEFAULT, masWalkAt} from '../../../../shared/pixel/cast/mas-stand';
import {drawGergMediumPOV} from '../../../../shared/pixel/cast/gerg-medium';
import {drawGergTile} from '../../../../shared/pixel/cast/gerg-speak';
import {drawGergStand, GERG_STAND_DEFAULT, gergWalkAt} from '../../../../shared/pixel/cast/gerg-stand';
import {drawMadaTile} from '../../../../shared/pixel/cast/mada';
import {drawHourglass, hourglassFlipAt, hourglassBeats} from '../../../../shared/pixel/cast/ttemme';
import {hourglass, hourglassFlip, hourglassGrains} from '../../../../shared/pixel/kits/props';
import {drawTasyaRoom, TASYA_ROOM_DEFAULT} from '../../../../shared/pixel/cast/tasya-speak';
import {BPLATE} from '../../../../shared/pixel/rooms/boardroom-plate';
import {drawThroneHandset} from '../../../../shared/pixel/cast/adelina';
import {drawPinTag, terbWalkAt} from '../../../../shared/pixel/cast/terb';
import {drawOrb} from '../../../../shared/pixel/cast/orb-medium';
import {drawNudgeInsert, drawClickInsert, drawStripTapInsert, StripHand, drawCarveInsert, drawBrushInsert, brushStepAt, drawPhone29Timeline} from '../../../../shared/pixel/kits/inserts-mas';
import {versionPlan} from '../../../../shared/pixel/kits/mas-version';
import {drawVaultInsert, drawShutDoorInsert} from '../../../../shared/pixel/kits/inserts-props';
import {drawPlanFrame} from './plan25';
import {suiteRoom, darkRoom, boardRoom, bullpenRoom, lighthouseRoom, lobbyRoom, doorShake} from './backs';
import {
  RH, WL, WR, PW, PH, held, dimRoom, fallaway, mouthOf, speaking, win, emptyWin, postCard, toast, freezePrint, blipCard, quoteCard, actCard,
  box, bezel, putUI, pt, pw,
} from './lay';
import {EVENTS, SUBS} from './data-v2';
import type {ShotV2} from './data-v2';

export interface ShotOut { layers?: GlyphLayer[]; full?: boolean; noTalk?: boolean; noVo?: boolean; print?: 'blueprint' }
type Draw = (fb: Buf, k: number, sh: ShotV2, f: number) => ShotOut | void;
export interface ShotDef { draw: Draw; st: string }
export const DRAW: Record<string, ShotDef> = {};
/** register a shot. `st` = what the layout is built from (the right panel prints it): assets, stand-ins, boxes */
const S = (ids: string | string[], st: string, draw: Draw) => { for (const id of ([] as string[]).concat(ids)) DRAW[id] = {draw, st}; };
const beat = (k: number) => Math.floor(k / 15);
const on2 = (k: number) => k - (k % 2);

// ================================================================== the call UI (480 x 203, full-bleed [POV] or inside the [SCR] bezel)
export const AREA: TileRect = {x: 0, y: CALL_BAR_H, w: 480, h: RH - CALL_BAR_H};
export const G5 = gridLayout(5, {area: AREA}), G4 = gridLayout(4, {area: AREA});
export const BOARD4 = [{id: 'alyi', name: 'ALYI'}, {id: 'neleh', name: 'NELEH'}, {id: 'mada', name: 'MADA'}, {id: 'off', name: undefined}];
export const ui = () => new Buf(480, RH, PAL.N1);
export const wifi = (b: Buf) => { // the egg: hotel Wi-Fi, one bar of four (zero read load)
  for (let i = 0; i < 4; i++) rect(454 + i * 4, 9 - (i + 1) * 2, 3, (i + 1) * 2, b.ink(i === 0 ? PAL.P1 : PAL.N3));
};
export const board4 = (b: Buf, f: number, rects: TileRect[], o: {frozenAt?: number; speakAlyi?: boolean} = {}) =>
  BOARD4.forEach((t, i) => drawTile(b, {...rects[i], id: t.id, name: t.name, vote: 3, muted: t.id === 'off' ? true : undefined, speaking: t.id === 'alyi' && o.speakAlyi, frozenAt: o.frozenAt}, f));
export const masTileState = (open?: number) => ({...G5[0], id: 'mas', name: 'MAS MANALT', muted: false, level: 1, open});
/** sc 26's call as his laptop shows it (the act frame drives the loops) */
export const call26 = (b: Buf, f: number, o: {masOpen?: number; frozenAt?: number; speakAlyi?: boolean; mas?: boolean; rects?: TileRect[]} = {}) => {
  callChrome(b, {title: 'board sync', clock: null, controls: false});
  board4(b, f, o.rects ?? G5.slice(1), o);
  if (o.mas !== false) drawTile(b, masTileState(o.masOpen), f);
  wifi(b);
};
// the [SCR] frame: the call app inside the laptop bezel's opening (456 x 177 at (12, 10)); tiles sized to fit it
export const SCR_W = 456, SCR_H = 177;
export const SAREA: TileRect = {x: 0, y: CALL_BAR_H, w: SCR_W, h: SCR_H - CALL_BAR_H};
export const S4 = gridLayout(4, {w: 150, h: 76, gap: 6, area: SAREA});
export const S5 = gridLayout(5, {w: 144, h: 76, gap: 6, area: SAREA});
export const sui = () => new Buf(SCR_W, SCR_H, PAL.N1);
export const putSCR = (fb: Buf, b: Buf) => { for (let y = 0; y < SCR_H; y++) for (let x = 0; x < SCR_W; x++) fb.set(12 + x, 10 + y, b.get(x, y)); bezel(fb); };
/** sc 27's call as the board's laptops show it (G4, no Mas) */
export const call27 = (b: Buf, f: number, o: {rima?: boolean} = {}) => {
  callChrome(b, {title: 'board sync', clock: null, controls: false});
  if (o.rima) {
    board4(b, f, S5.slice(0, 4));
    drawTile(b, {...S5[4], id: 'rima', name: 'RIMA TAMURI'}, f);
  } else board4(b, f, S4);
};
export const DLG = {x: G5[0].x - 20, y: G5[0].y - 4, w: 196};
export const dialog26 = (b: Buf, k: number, o: {k0?: number; cancelDown?: boolean} = {}) => {
  const kk = k - (o.k0 ?? -99);
  if (kk < 0) return;
  if (kk < 2) { rect(DLG.x + 98 - (kk + 1) * 32, DLG.y + 48 - (kk + 1) * 16, (kk + 1) * 64, (kk + 1) * 32, b.ink(PAL.P2)); return; }
  callDialog(b, DLG.x, DLG.y, {w: DLG.w, head: 'MAS MANALT', cancelDown: o.cancelDown});
};
export const CANCEL = (() => { const [bx, by] = dialogButton(DLG.x, DLG.y, 'cancel', DLG.w); return [bx + 30, by + 9] as [number, number]; })();

// ================================================================== sc 24 · THE SUITE
S('24.01', 'rooms-a suite (drawSuite: truck, shiver) + cast desk sprite + orb-medium at room scale', (fb, k) => {
  suiteRoom(fb, k, {truckX: 236 + Math.floor(k / 2), shiverT0: 18});
});
S('24.02', 'inserts-mas drawNudgeInsert (suite): set → NUDGE → out1 → out2 → gone', (fb, k) => {
  drawNudgeInsert(fb, 'suite', k < 6 ? 'set' : k < 15 ? 'nudge' : k < 19 ? 'out1' : k < 23 ? 'out2' : 'gone');
});
S('24.03', '[PF] suitePortraitBg / the suite held + stepped down, Mas portrait; beat 2 BLUEPRINT_PRINT (kits)', (fb, k, _sh, f) => {
  held(fb, 'suite-held', (b) => suiteRoom(b, 0, {}));
  fallaway(fb, k, 3, 0, 5);
  win(fb, 'L', 'MAS', k, {f, look: -1});
  return {print: k >= 15 ? 'blueprint' : undefined, noVo: true};
});

// ================================================================== sc 25 · THE PLAN (the kits' clock, copied)
S(['25.01', '25.02', '25.03', '25.04', '25.05', '25.06', '25.07'], 'kits blueprint (THE PLAN on its real clock: episodes/ep01/act4/kits/plan.ts, copied)', (fb, _k, _sh, f) => {
  drawPlanFrame(fb, f - 120);
  return {full: true, noTalk: true};
});
S('25.08', 'inserts-mas drawClickInsert: BOARD · VIDEO CALL · JOIN, the click on beat 3', (fb, k) => {
  drawClickInsert(fb, k, {click: k >= 30 && k < 32});
});

// ================================================================== sc 26 · THE FALLING TILE (his laptop, full-bleed)
S('26.01', 'kits callgrid (G5, votes already flipped, the 1-bar Wi-Fi egg)', (fb, k, _sh, f) => {
  const b = ui(); call26(b, f, {masOpen: k - 15}); putUI(fb, b, false);
});
S('26.02', 'callgrid + engine nameCard (kit.cards NEW: stand-in stat line), 2-tone freeze beat 1 (Mas in colour)', (fb, k, _sh, f) => {
  const b = ui(); call26(b, k < 15 ? f - k : f); putUI(fb, b, false);
  if (k < 15) { const m = G5[0]; freezePrint(fb, (x, y) => x >= m.x - 1 && x <= m.x + m.w && y >= m.y - 1 && y <= m.y + m.h); }
  blipCard(fb, k, 'NELEH', 'NELEH', 'READ THE CHARTER. LITERALLY.', 'FOOTNOTES: ∞', {f}, 'R');
});
S('26.02a', '[PF] the suite held + stepped down to neon + laptop glow, Mas portrait (eye darts on the beat)', (fb, k, _sh, f) => {
  held(fb, 'suite-held', (b) => suiteRoom(b, 0, {}));
  fallaway(fb, k, 3, 0, 8);
  const look = ([-1, 0, 1, 1] as const)[Math.min(3, beat(k))];
  win(fb, 'L', 'MAS', k, {f, look});
});
S('26.03', 'callgrid: Alyi speaks, no sound; the typed … stops', (fb, k, _sh, f) => {
  const b = ui(); call26(b, f, {speakAlyi: k < 44}); typedDots(b, G5[1].x + 4, G5[1].y + 3, k); putUI(fb, b, false);
});
S('26.04', 'callgrid + callDialog (the 1993 dialog in colour, Cancel live)', (fb, k, _sh, f) => {
  const b = ui(); call26(b, f); dialog26(b, k, {k0: 0}); putUI(fb, b, false);
});
S('26.04a', 'mas-cu drawEyesStrip (letterboxed): pos 0 → −1 on beat 3', (fb, k) => { drawEyesStrip(fb, k < 30 ? 0 : -1); });
S('26.04b', 'callgrid + dialog + the unlit arrow, one held position per beat', (fb, k, _sh, f) => {
  const b = ui(); call26(b, f); dialog26(b, 99);
  const P: Array<[number, number]> = [[G5[2].x + 70, G5[2].y + 40], [G5[3].x + 60, G5[3].y + 30], [G5[1].x + 40, G5[1].y + 20], [DLG.x + DLG.w - 6, DLG.y + 30]];
  const [px, py] = P[Math.min(3, beat(k))];
  drawPointer(b, px, py); putUI(fb, b, false);
});
S('26.04c', 'callgrid + dialog; the arrow settles on Cancel (the click is 26.05 f0)', (fb, k, _sh, f) => {
  const b = ui(); call26(b, f); dialog26(b, 99);
  const [px, py] = pointerAt(on2(k), 0, 28, [DLG.x + DLG.w - 6, DLG.y + 30], CANCEL);
  drawPointer(b, px, py); putUI(fb, b, false);
});
S('26.05', 'callgrid: Cancel clicked; the tile drops (4 drawings) inside the GLYPH dissolve (tokens approximated); G5 → G4', (fb, k, _sh, f) => {
  const b = ui();
  const rects = k < 30 ? G5.slice(1) : slideTiles(G5.slice(1), G4, k, 30, 8);
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
S('26.05a', 'mas-cu drawMasCU (strip): ONE silent drawing; RAIL +1 FIRING on beat 3', (fb) => { drawMasCU(fb, {backdrop: 'strip', f: 0}); });
S('26.06', 'inserts-mas drawStripTapInsert (rooms-a desk insert, the lit mic chip; strip = post-ui stand-in): the tap AT ONCE at f90', (fb, k) => {
  const hand: StripHand = k < 84 ? 'out' : k < 87 ? 'enter1' : k < 90 ? 'enter2' : k < 94 ? 'tap' : 'after';
  drawStripTapInsert(fb, k, {hand, level: k >= 90 && k < 120 ? 1 + (Math.floor(k / 4) % 3) : 3});
});
S('26.07', '[P] the suite held + Mas portrait (lip-sync from a4-26-01)', (fb, k, sh, f) => {
  held(fb, 'suite-held', (b) => suiteRoom(b, 0, {}));
  win(fb, 'L', 'MAS', k, {f, mouth: mouthOf(sh, k, 'MAS'), look: 0}, {k0: 0});
});
S('26.08', 'callgrid G4 frozen (his feed froze: the whole grid holds)', (fb, _k, sh, f) => {
  const b = ui(); callChrome(b, {title: 'board sync', clock: null, controls: false}); board4(b, sh.s, G4, {frozenAt: sh.s}); wifi(b); putUI(fb, b, false);
  void f;
});
S('26.09', 'rooms-a suite wide (the truck again, every glass shivers but his)', (fb, k) => { suiteRoom(fb, k, {truckX: 236 + Math.floor(k / 2), shiverT0: 12}); });
S('26.10', 'kit.cards NEW: stand-in dated quote card', (fb, k) => {
  quoteCard(fb, '"…not consistently candid in his communications with the board…"', '— THE NOPEAI BOARD · BLOG POST · NOV 17, 2023', k);
  return {full: true};
});
S('26.11', 'callgrid G4 + the greyed plate falling; render front BASE → EARLYWEB16 from f6 (engine)', (fb, k, _sh, f) => {
  const b = ui(); callChrome(b, {title: 'board sync', clock: null, controls: false}); board4(b, f, G4); tilePlate(b, G5[0].x, 150 + plateFallY(k)); wifi(b);
  const a = new Buf(480, RH, PAL.N0); putUI(a, b, false);
  const bb = inPalette(a, 'EARLYWEB16');
  const {pos, smear} = frontPos(k, 6, 18, 480);
  const out = new Buf(480, RH, PAL.N0);
  if (k < 6) out.c.set(a.c); else renderFront(out, a, bb, pos, {dir: 'up', smear});
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) fb.set(x, y, out.get(x, y));
});
S('26.12', 'rooms-a drawTpoolDoor under EARLYWEB16 (F1.2; the rail stays BASE)', (fb, k) => {
  const a = new Buf(480, RH, PAL.N0);
  drawTpoolDoor(a, {f: k, lean: k < 60 ? 0 : 1});
  const e = inPalette(a, 'EARLYWEB16');
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) fb.set(x, y, e.get(x, y));
});
S('26.13', 'rooms-a drawTpoolClose (EW16) → render front → rooms-b drawDarkDesk grain (BASE)', (fb, k) => {
  const a0 = new Buf(480, RH, PAL.N0); drawTpoolClose(a0, {f: k, lean: 1});
  const a = inPalette(a0, 'EARLYWEB16');
  const bb = new Buf(480, RH, PAL.N0); drawDarkDesk(bb, 0, {tally: 3, carve: 0});
  const {pos, smear} = frontPos(k, 0, 18, RH);
  const out = new Buf(480, RH, PAL.N0);
  renderFront(out, a, bb, pos, {dir: 'down', smear});
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) fb.set(x, y, out.get(x, y));
});

// ================================================================== sc 26A · THAT NIGHT
S('26A.01', 'inserts-mas drawCarveInsert (bar 1, quarters on the beat) → drawBrushInsert (bar 2: thumb on mark 3 only)', (fb, k) => {
  if (k < 60) drawCarveInsert(fb, k, Math.min(1, (beat(k) + 1) * 0.25));
  else drawBrushInsert(fb, k, brushStepAt(k - 60));
});
S('26A.02', 'twoshots drawDark2S + orbTally: the Orb counts 1, 2, 3, his thumb', (fb, k) => {
  drawDark2S(fb, k, {mas: {head: 'down', arm: 'tally'}, orb: {look: orbTally(k, 0)}, plate: {tally: 3, lanyard: false, phone: 'none'}});
});
export const phoneScreen = (fb: Buf, col = PAL.N1) => { // his phone full-bleed (kit.post-ui NEW: a stand-in screen)
  rect(0, 0, 480, RH, fb.ink(PAL.N0));
  rect(96, 0, 288, RH, fb.ink(col));
  rect(96, 0, 288, 14, fb.ink(PAL.N2));
  pt(fb, 'post-ui stand-in: his phone, full-bleed', 104, 4, PAL.N5);
};
S('26A.03', 'kit.post-ui NEW: stand-in phone composer; the post lands at f7, stamped 9:32 PM PT', (fb, k) => {
  phoneScreen(fb);
  if (k < 7) { pt(fb, 'if i start going off, the nopeai'.slice(0, k * 5), 110, 60, PAL.P1); return; }
  postCard(fb, 112, 40, 256, '@mas', 'if i start going off, the nopeai board should go after me for the full value of my shares', k - 7, {ts: '9:32 PM PT'});
});
S('26A.04', 'BOX: prop.wallet NEW (the Senate wallet: HEALTH INSURANCE, a moth) on rooms-b drawDarkDesk', (fb, k) => {
  held(fb, 'darkdesk-3', (b) => drawDarkDesk(b, 0, {tally: 3, carve: 1, glass: false, phone: 'none'}));
  box(fb, 150, 70, 180, 90, 'PROP NEW: THE SENATE WALLET (open, one card)', {fill: PAL.D1});
  rect(186, 108, 108, 34, fb.ink(PAL.P1)); rect(186, 108, 108, 6, fb.ink(PAL.C4));
  pt(fb, 'HEALTH INSURANCE', 194, 122, PAL.N1);
  if (k >= 15 && k < 45) { const y = 100 - (k - 15); const w = Math.floor(k / 2) % 2; rect(236 - 3 - w, y, 3 + w, 2, fb.ink(PAL.P0)); rect(240, y, 3 + w, 2, fb.ink(PAL.P0)); fb.set(239, y, PAL.N1); }
});
S('26A.05', '[PF] rooms-b dark room held + stepped down, Mas portrait (the V.O. band on shadow)', (fb, k, _sh, f) => {
  held(fb, 'dark-2632', (b) => darkRoom(b, 0, {clock: '9:32', tally: 3, screen: 'post'}));
  fallaway(fb, k, 3, 0, 5);
  win(fb, 'L', 'MAS', k, {f, look: -1});
});
S('26A.06', '[P] the dark room held + THE ORB right (cast.orb.portrait NEW: orb-medium at portrait scale); toast rewinding…', (fb, k, _sh, f) => {
  held(fb, 'dark-2632', (b) => darkRoom(b, 0, {clock: '9:32', tally: 3, screen: 'post'}));
  dimRoom(fb, 1);
  win(fb, 'R', 'ORB', k, {f, x: {look: k < 8 ? [-0.4, 0.7] : [-0.72, -0.04]}}, {k0: 0});
  toast(fb, 150, 150, 'rewinding…', k);
});

// ================================================================== sc 27 · PASS ONE: THE BOARD'S SIDE (screens keep their bezels)
S('27.01', 'callgrid G4 in the [SCR] bezel; the dialogue box types super. with NO portrait (the left window stays empty)', (fb, _k, _sh, f) => {
  const b = sui(); call27(b, f); putSCR(fb, b);
});
S('27.01a', 'callgrid [SCR] + callToast; Gerg\'s post (kit.post-ui NEW: stand-in), green-lit', (fb, k, _sh, f) => {
  const b = sui(); call27(b, f); toast(b, 290, 150, 'GERG MOCKBRAN has left.', k); if (k >= 30) postCard(b, 140, 50, 180, 'GERG MOCKBRAN', '…I quit.', k - 30, {col: PAL.L3}); putSCR(fb, b);
});
export const keycapRain = (b: Buf, k: number) => {
  for (let i = 0; i < 26; i++) {
    const t = k - i * 1.7;
    if (t < 0) continue;
    const x0 = 30 + ((i * 97) % (b.w - 60)), vx = ((i * 37) % 7) - 3, vy = -(5 + (i % 4));
    const x = Math.round(x0 + vx * t * 0.6), y = Math.round(b.h - 3 + vy * t + 0.22 * t * t);
    const yy = Math.min(y, b.h - 17 - (i % 3) * 30);
    if (yy < b.h - 3) { rect(x, yy, 5, 4, b.ink(PAL.G5)); rect(x, yy, 5, 1, b.ink(PAL.P1)); rect(x + 1, yy + 1, 3, 2, b.ink(PAL.G3)); }
  }
};
S('27.02', 'callgrid [SCR] + callToast; keycaps rain (a stand-in popcorn on the gerg keycap drawing\'s timing)', (fb, k, _sh, f) => {
  const b = sui(); call27(b, f); toast(b, 320, 150, 'BUKAJ has left.', k); keycapRain(b, k); putSCR(fb, b);
});
export const grid27Held = (fb: Buf) => held(fb, 'grid27', (bb) => { const b = sui(); call27(b, 0); putSCR(bb, b); });
S('27.03', '[P] the board grid held + RIMA right (rima-speak: the spotlight snaps on, the jacket smooth)', (fb, k, _sh, f) => {
  grid27Held(fb); dimRoom(fb, 1);
  win(fb, 'R', 'RIMA', k, {f, x: {spot: k < 4 ? 'dark' : 'on', hand: k < 8 ? 'none' : Math.floor(k / 8) % 2 ? 'smooth1' : 'smooth0'}}, {k0: 0});
});
S('27.04', 'engine nameCard over her window (kit.cards NEW stat line); 2-tone freeze beat 1', (fb, k, _sh, f) => {
  grid27Held(fb); dimRoom(fb, 1);
  if (k < 15) freezePrint(fb);
  blipCard(fb, k, 'RIMA', 'RIMA TAMURI', 'CEO (WEEKEND EDITION)', 'HEARTS SENT: 0', {f, x: {spot: 'on'}}, 'R');
});
S(['27.05', '27.05b'], '[P] the grid held + RIMA right, lip-sync from the recording', (fb, k, sh, f) => {
  grid27Held(fb); dimRoom(fb, 1);
  const off = sh.id === '27.05b' && k >= 40;
  win(fb, 'R', 'RIMA', k, {f, mouth: mouthOf(sh, k, 'RIMA'), x: {spot: off ? 'dark' : 'on'}});
});
S(['27.05a', '27.05c'], '[P] the grid held + NELEH right (brow query; 27.05c listening)', (fb, k, sh, f) => {
  grid27Held(fb); dimRoom(fb, 1);
  win(fb, 'R', 'NELEH', k, {f, mouth: mouthOf(sh, k, 'NELEH'), x: {brow: 'query'}});
});
export const coupTile = ALLHANDS_TILES[22];
S(['27.06', '27.07a'], 'rooms-b bullpen all-hands (door open, hand up) + alyi-speak drawAlyiStand clipped to the doorway', (fb, k, sh) => {
  const up = sh.id === '27.07a' || k >= 8;
  held(fb, up ? 'allhands-up' : 'allhands', (b) => bullpenRoom(b, 0, {variant: 'allhands', door: 'open', handsUp: up ? [22] : []}, {alyiDoor: true}));
  return sh.id === '27.06' ? {noTalk: false} : undefined;
});
export const jamb = (b: Buf) => { // the door frame cutting his window in half (27.07)
  const [x, y] = WR;
  rect(x, y, 44, PH, b.ink(PAL.N0)); rect(x + 44, y, 4, PH, b.ink(PAL.D3)); rect(x + 48, y, 1, PH, b.ink(PAL.D4));
};
S('27.07', '[P] the all-hands held + ALYI right, the door jamb over his window', (fb, k, sh, f) => {
  held(fb, 'allhands-up', (b) => bullpenRoom(b, 0, {variant: 'allhands', door: 'open', handsUp: [22]}, {alyiDoor: true}));
  dimRoom(fb, 1);
  win(fb, 'R', 'ALYI', k, {f, mouth: mouthOf(sh, k, 'ALYI'), x: {plain: true}});
  jamb(fb);
});
S('27.08', '[P] ALYI steps back out of his own window (whole-px steps), the window holds empty, then closes', (fb, k, _sh, f) => {
  held(fb, 'allhands-up', (b) => bullpenRoom(b, 0, {variant: 'allhands', door: 'open', handsUp: [22]}, {alyiDoor: true}));
  dimRoom(fb, 1);
  if (k < 30) { win(fb, 'R', 'ALYI', k, {f, x: {plain: true, dx: Math.floor(k / 2) * 4}}); jamb(fb); }
  else if (k < 45) { emptyWin(fb, 'R'); jamb(fb); }
  else win(fb, 'R', 'ALYI', k, {f, x: {plain: true, dx: 200}}, {closeAt: 45});
});
// ---- the hearts (27.09-27.10): the falling-stack kit on the board's grid, in the bezel
export const H0 = 3675; // 27.09's act frame (the pour's clock)
let HEART_PLAN: PileHeart[] | null = null;
export const HG = S5;
export const SPIN_X = HG[2].x + 75;
export const heartPlan = () => (HEART_PLAN ??= (() => {
  const base = planPile({x0: 0, x1: SCR_W, count: 99999, t0: 30, ceiling: 20, floor: () => SCR_H, spawnAt: (i) => Math.pow(i, 0.62) * 1.0});
  const top = pileTopAt(base, SPIN_X, 1e9, SCR_H);
  return withBlueHeart(base, SPIN_X - 4, top - 11 - 9, 18);
})());
export const hearts = (b: Buf, T: number) => {
  callChrome(b, {title: 'board sync', clock: null, controls: false});
  board4(b, T, HG.slice(0, 4));
  drawTile(b, {...HG[4], id: 'rima', name: 'RIMA TAMURI'}, T);
  const plan = heartPlan();
  reactionBurst(b, HG[1].x + HG[1].w - 3, HG[1].y + HG[1].h - 3, T);
  drawPile(b, plan, T, {blue: 'skip'});
  const blue = plan[plan.length - 1];
  const sy = Math.min(HG[2].y + 4, pileTopAt(plan, SPIN_X, T, SCR_H) - 7);
  spinner(b, SPIN_X, sy, T, {size: 'r3', dot: 2});
  if (T >= blue.land && T < blue.land + 16) {
    const p = [[0, -5], [4, -4], [5, 0], [4, 4], [0, 5], [-4, 4], [-5, 0], [-4, -4]][Math.floor((T - blue.land) / 2) % 8];
    drawHeart(b, SPIN_X + p[0] - 4, sy + p[1] - 4, 4, BLUE);
  } else if (T >= blue.land) drawHeart(b, SPIN_X - 4, sy - 13, 4, BLUE);
  else { const p = pileHeartAt(blue, T); if (p) drawHeart(b, p[0], Math.min(p[1], sy - 13), 4, BLUE); }
  heartCounter(b, SCR_W - 40, 1, T < 0 ? 0 : Math.min(9999, plan.filter((h) => T >= h.land).length));
};
S('27.09', 'avalanche planPile / drawPile on the board\'s grid (G5 with Rima), [SCR] bezel', (fb, _k, _sh, f) => { const b = sui(); hearts(b, f - H0); putSCR(fb, b); });
S('27.10', 'avalanche: the blue heart rides Mada\'s spinner; Mas\'s post as a notification (callgrid postChip)', (fb, k, _sh, f) => {
  const b = sui(); hearts(b, f - H0);
  if (k >= 15) postChip(b, Math.max(14, SCR_W - Math.floor((k - 15) * 6)), 80, '@mas', '…sorta like reading your own eulogy while you\'re still alive');
  putSCR(fb, b);
});
// ---- the boardroom 2S tier (the medium stage's plate + rigs)
export const BOARD: BoardPlateOpts = {laptop: true, blueprint: 0, rolodex: true, plates: [{name: 'NELEH', x: 86}, {name: 'ALYI', x: 280}]};
S('27.11', 'twoshots drawBoard2S (boardroom-plate, neleh-medium, mada-medium, ALYI in the glass, the QV laptop); phones buzz beat 3', (fb, k) => {
  drawBoard2S(fb, k, {neleh: {arm: 'marker'}, mada: {}, plate: {...BOARD, phones: {lit: true, buzz: k >= 30, step: 0}}});
});
export const boardHeld = (fb: Buf, key = 'board-plan') => held(fb, key, (b) => boardRoom(b, 0, {blueprint: {word: false}, laptop: true, phones: {lit: true, buzz: false, step: 0}}, {neleh: {}, mada: true, alyi: true}));
S(['27.12', '27.12b', '27.12d', '27.14'], '[P] the boardroom (rooms-a) held + NELEH right, lip-sync', (fb, k, sh, f) => {
  boardHeld(fb); dimRoom(fb, 1);
  win(fb, 'R', 'NELEH', k, {f, mouth: mouthOf(sh, k, 'NELEH'), x: {brow: sh.id === '27.12b' || sh.id === '27.12d' ? 'query' : 'level'}});
});
S(['27.12a', '27.12c', '27.14a'], '[P] the boardroom held + ALYI right (the reflection window, alyi-speak drawAlyiWindow)', (fb, k, sh, f) => {
  boardHeld(fb); dimRoom(fb, 1);
  win(fb, 'R', 'ALYI', k, {f, mouth: mouthOf(sh, k, 'ALYI')});
});
S('27.13', 'twoshots drawBoard2S: the phones walk to the edge, one held step a beat', (fb, k) => {
  drawBoard2S(fb, k, {neleh: {arm: 'paper', head: 'down'}, mada: {}, plate: {...BOARD, phones: {lit: true, buzz: true, step: Math.min(4, beat(k) + 1)}}});
});
S('27.14b', 'twoshots drawBoard2S: ALYI\'s reflection gone for 2 frames', (fb, k) => {
  drawBoard2S(fb, k, {neleh: {arm: 'marker'}, mada: {}, alyi: {flicker: k >= 8 && k < 10 ? 'gone' : 'there'}, plate: {...BOARD, phones: {step: 4}}});
});
S('27.15', '[PF] the boardroom held + stepped down, NELEH right looking down at the blank line', (fb, k, _sh, f) => {
  boardHeld(fb); fallaway(fb, k, 3, 0, 6);
  win(fb, 'R', 'NELEH', k, {f, x: {gaze: 'down', brow: 'level', orbit: 0}});
});
S('27.16', 'rooms-a drawTableInsert (blueprint, step 4 blank) + the ? (stand-in strokes) · BOX: NELEH\'s marker hand NEW', (fb, k) => {
  drawTableInsert(fb, {f: k, focus: 'blueprint', word: 0});
  const [wx, wy] = TABLE_INSERT.wordAt;
  const q = ['.###.', '#...#', '....#', '...#.', '..#..', '.....', '..#..'];
  const shown = k < 15 ? 0 : k < 25 ? 3 : k < 35 ? 5 : 7;
  q.slice(0, shown).forEach((r, j) => { for (let i = 0; i < 5; i++) if (r[i] === '#') rect(wx + 4 + i * 2, wy - 11 + j * 2, 2, 2, fb.ink(PAL.N0)); });
  box(fb, 300, 14, 170, 40, 'HAND NEW: her hand + the marker (uncap b1, ? b2-3)', {fill: null});
});
S('27.17', 'rooms-a boardroom wide: the speakerphone dials four tones (neleh room sprite, mada seated, ALYI in the glass)', (fb, k) => {
  const key = `board-sp${Math.min(4, beat(k) + 1)}`;
  held(fb, key, (b) => boardRoom(b, 0, {blueprint: {word: false}, laptop: true, phones: {lit: false, step: 4}, speaker: Math.min(4, beat(k) + 1)}, {neleh: {}, mada: true, alyi: true}));
});
// ---- the lighthouse
export const deskInsert = (b: Buf, k: number, throne: boolean, ring: boolean) => { // room.lighthouse.desk-insert NEW: a stand-in plate
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y < 60 ? PAL.U1 : ((x * 7 + y * 3) % 23 < 2 ? PAL.W1 : PAL.D1));
  for (let i = 0; i < 9; i++) { const x = 20 + i * 52, y = 70 + ((i * 37) % 40); rect(x, y, 44, 28, b.ink(PAL.P0)); rect(x, y, 44, 1, b.ink(PAL.P2)); for (let j = 4; j < 26; j += 4) rect(x + 4, y + j, 30, 1, b.ink(PAL.G3)); }
  box(b, 8, 6, 250, 26, 'PLATE NEW: lighthouse desk insert (paper-buried)', {fill: null});
  const hop = ring && Math.floor(k / 3) % 2 ? -1 : 0;
  drawThroneHandset(b, 176, 88 + hop, {size: 'lg', throne});
};
S('27.18', 'BOX plate NEW (lighthouse desk insert) + adelina.ts drawThroneHandset lg (throne on), ringing', (fb, k) => { deskInsert(fb, k, true, true); });
export const lhHeld = (fb: Buf, meters: 0 | 2, who: {mario?: boolean; adelina?: boolean} = {mario: true}) => held(fb, `lh${meters}${who.mario ? 'm' : ''}${who.adelina ? 'a' : ''}`, (b) => lighthouseRoom(b, 0, {meters, ring1: 0}, who));
S('27.19', '[P] rooms-b lighthouse held + MARIO right (mario portrait, marioMouth), the finger rises', (fb, k, sh, f) => {
  lhHeld(fb, 0); dimRoom(fb, 1);
  win(fb, 'R', 'MARIO', k, {f, mouth: mouthOf(sh, k, 'MARIO'), x: {finger: k < 15 ? 0 : k < 17 ? 1 : 2}});
});
S('27.20', '[P2] the lighthouse held: MARIO left (silent; the phone leaves), ADELINA right (phone to her ear)', (fb, k, _sh, f) => {
  lhHeld(fb, 0); dimRoom(fb, 1);
  win(fb, 'L', 'MARIO', k, {f, x: {finger: 1}});
  win(fb, 'R', 'ADELINA', k, {f, x: {phone: k < 8 ? 'none' : 'ear', throne: true}}, {k0: 0});
});
S('27.21', 'engine nameCard (kit.cards NEW stat line) over the live lighthouse; 2-tone freeze beat 1', (fb, k, _sh, f) => {
  lhHeld(fb, 0); dimRoom(fb, 1);
  win(fb, 'L', 'MARIO', k, {f, x: {finger: 1}});
  if (k < 15) freezePrint(fb);
  blipCard(fb, k, 'ADELINA', 'ADELINA', 'IN PLAIN ENGLISH:', 'TRANSLATES DOOM INTO REVENUE', {f, x: {phone: 'ear', throne: true}}, 'R');
});
S('27.22', '[P2] MARIO left + ADELINA right into the phone, lip-sync', (fb, k, sh, f) => {
  lhHeld(fb, 0); dimRoom(fb, 1);
  win(fb, 'L', 'MARIO', k, {f, x: {finger: 1}});
  win(fb, 'R', 'ADELINA', k, {f, mouth: mouthOf(sh, k, 'ADELINA'), x: {phone: 'ear', throne: true}});
});
S('27.23', 'BOX plate NEW + drawThroneHandset (throne off) + lighthouse throneImg falling (3 drawings)', (fb, k) => {
  deskInsert(fb, k, false, false);
  const dy = k < 3 ? 0 : k < 6 ? 8 : 14;
  blitImg(fb, throneImg(k >= 6), 214, 70 + dy);
});
S('27.24', '[P] the lighthouse held (meters 2: the rent meters) + MARIO right on the second phone', (fb, k, sh, f) => {
  lhHeld(fb, 2); dimRoom(fb, 1);
  win(fb, 'R', 'MARIO', k, {f, mouth: mouthOf(sh, k, 'MARIO'), x: {finger: 1}});
  void drawRentMeter;
});
S('27.26', 'rooms-a drawLobbyCam [SCR] + mas-stand walk (GUEST) + the post upside-down (post-ui NEW stand-in)', (fb, k) => {
  const b = new Buf(480, RH, PAL.N0);
  drawLobbyCam(b, {f: k, time: 'day'}, (bb) => {
    const x = CAM.PATH.x0 + Math.floor(on2(k) * 1.5);
    if (x < CAM.PATH.x1) drawMasStand(bb, x, CAM.PATH.feetY, {...MAS_STAND_DEFAULT, legs: masWalkAt(k), guest: true});
  });
  if (k >= 30) {
    const t = new Buf(CAM.POST_CORNER.w, CAM.POST_CORNER.h + 12, PAL.N0);
    postCard(t, 0, 0, CAM.POST_CORNER.w, '@mas', 'first and last time i ever wear one of these', 99);
    for (let j = 0; j < t.h; j++) for (let i = 0; i < t.w; i++) b.set(CAM.POST_CORNER.x + t.w - 1 - i, CAM.POST_CORNER.y + t.h - 1 - j, t.get(i, j));
  }
  putUI(fb, b, true);
});
S('27.27', 'rooms-a boardroom wide (sticky CEO (TEMP), the spot swings in 3 held positions) + ttemme room sprite + neleh + mada', (fb, k) => {
  const step = Math.min(2, Math.floor(k / 8));
  const spots = [{x: 240, y: 110, r: 26}, {x: 250, y: 104, r: 28}, {x: 254, y: 100, r: 30}];
  held(fb, `board-ttemme${step}`, (b) => boardRoom(b, 0, {sticky: {seat: 'C', text: 'CEO (TEMP)'}, spot: spots[step], laptop: true, blueprint: {word: false}, phones: {step: 4}}, {neleh: {}, mada: true, alyi: true, ttemme: step >= 1 ? {} : null}));
});
export const boardTtemme = (fb: Buf) => held(fb, 'board-ttemme2', (b) => boardRoom(b, 0, {sticky: {seat: 'C', text: 'CEO (TEMP)'}, spot: {x: 254, y: 100, r: 30}, laptop: true, blueprint: {word: false}, phones: {step: 4}}, {neleh: {}, mada: true, alyi: true, ttemme: {}}));
S('27.28', 'engine nameCard over the live room (kit.cards NEW stat line); 2-tone freeze beat 1', (fb, k, _sh, f) => {
  boardTtemme(fb); if (k < 15) freezePrint(fb);
  blipCard(fb, k, 'TTEMME', 'TTEMME', 'CEO (72 HOURS).', 'TIME LEFT: 72:00:00', {f, x: {sand: 1}}, 'R');
});
S(['27.29', '27.31'], '[P] the boardroom held + TTEMME right (ttemme portrait: the chat overlay egg)', (fb, k, sh, f) => {
  boardTtemme(fb); dimRoom(fb, 1);
  const s31 = sh.id === '27.31';
  win(fb, 'R', 'TTEMME', k, {f, mouth: mouthOf(sh, k, 'TTEMME'), x: {gaze: s31 ? 'sand' : 'cam', brow: s31 ? 'unsure' : 'hype', sand: s31 ? 0.1 : 1}});
});
S('27.30', 'rooms-a drawTableInsert (prop) + kits props hourglass L: the flip (3 drawn states, a hop), sand one grain a beat', (fb, k) => {
  drawTableInsert(fb, {f: k, focus: 'prop'});
  const [px, py] = TABLE_INSERT.prop;
  const fl = hourglassFlip(k - 4);
  const N = hourglassGrains('L');
  hourglass(fb, px - 16, py - 58 + fl.dy, {size: 'L', pose: fl.pose, moved: fl.flipped ? Math.floor(Math.max(0, k - 14) / 15) : N, running: fl.flipped, f: k});
  void drawHourglass; void hourglassFlipAt; void hourglassBeats;
});
S('27.32', 'twoshots drawBoard2S: the wall steps to slate, the door appears (1 → 5, a beat each) + tasya room sprite', (fb, k) => {
  const door = (k < 15 ? 0 : k < 25 ? 1 : k < 35 ? 2 : k < 45 ? 3 : k < 60 ? 4 : 5) as 0 | 1 | 2 | 3 | 4 | 5;
  drawBoard2S(fb, k, {neleh: {arm: 'marker', head: k >= 30 ? 'front' : '34', brow: 'query'}, mada: {head: k >= 30 ? 'front' : '34'}, alyi: null, plate: {...BOARD, slate: true, door, phones: {step: 4}}});
  if (door === 5) { // TASYA in the new door (his room sprite at medium distance, clipped by the table)
    const t = new Buf(480, 270, 0x1000000);
    drawTasyaRoom(t, Math.round((BPLATE.door.x0 + BPLATE.door.x1) / 2), BPLATE.tableY + 6, {...TASYA_ROOM_DEFAULT, arm: 'sign', light: 'slate'});
    for (let y = BPLATE.door.y0; y < BPLATE.tableY; y++) for (let x = BPLATE.door.x0; x < BPLATE.door.x1; x++) { const c = t.get(x, y); if (c !== 0x1000000) fb.set(x, y, c); }
  }
});
export const boardSlate = (fb: Buf) => held(fb, 'board-slate', (b) => boardRoom(b, 0, {slate: true, tasyaDoor: 4, laptop: true, blueprint: {word: true}, phones: {step: 4}}, {neleh: {}, mada: true, tasya: {arm: 'sign'}}));
S('27.33', '[P] the slate boardroom held + TASYA right reading his post aloud (post-ui NEW stand-in pop-up)', (fb, k, sh, f) => {
  boardSlate(fb); dimRoom(fb, 1);
  win(fb, 'R', 'TASYA', k, {f, mouth: mouthOf(sh, k, 'TASYA'), x: {arms: 'ring'}});
  if (k >= 6) postCard(fb, 170, 60, 170, 'TASYA', 'a new advanced AI research team', k - 6);
});
S(['27.35', '27.36'], 'twoshots drawBoard2S: step 4 blank but for her ? (blueprint 3); 27.36 lip-sync on the medium rigs', (fb, k, sh) => {
  const n = mouthOf(sh, k, 'NELEH'), m = mouthOf(sh, k, 'MADA');
  drawBoard2S(fb, k, {neleh: {arm: 'marker', head: sh.id === '27.35' ? 'down' : '34', brow: sh.id === '27.36' ? 'query' : 'level', mouth: n}, mada: {head: sh.id === '27.35' ? 'down' : '34', look: -1, mouth: m}, alyi: null, plate: {...BOARD, blueprint: 3, slate: true, door: 5, phones: {step: 4}}});
});

// ================================================================== sc 28 · THE CARD
S('28.01', 'kit.cards NEW: stand-in act-out card', (fb) => { actCard(fb, "WHAT THEY DIDN'T KNOW"); return {full: true}; });

// ================================================================== sc 29 · PASS TWO: HIS SIDE
S('29.00', 'rooms-b drawDarkDesk: the home shot, the glass, its water line flat', (fb) => {
  held(fb, 'desk-home', (b) => drawDarkDesk(b, 0, {tally: 3, carve: 1, glass: true, lanyard: true, phone: 'down'}));
});
S('29.01', 'twoshots drawDark2S: the lanyard laid square, his hand on the phone, the grid in the monitor corner', (fb, k) => {
  drawDark2S(fb, k, {mas: {arm: 'phone'}, orb: {look: DPLATE_LOOK.phone}, plate: {tally: 3, lanyard: true, phone: 'down', boardGrid: true}});
});
export const PLAN29 = versionPlan(0);
S('29.01a', "inserts-mas drawPhone29Timeline: MAS'S VERSION (face-down, six fingers, every layer held; no rim)", (fb, k) => { drawPhone29Timeline(fb, k, PLAN29); });
S('29.03', 'inserts-mas drawPhone29Timeline: the true shot, 8 hearts on the beat (feed = post-ui stand-in, Rima\'s post legible)', (fb, k) => { drawPhone29Timeline(fb, PLAN29.cutAt + k, PLAN29); });
S('29.04', 'twoshots drawDark2S + orbToLanyard: the iris steps onto the GUEST lanyard on beat 3', (fb, k) => {
  drawDark2S(fb, k, {mas: {arm: 'phone', head: 'down'}, orb: {look: orbToLanyard(k, 0)}, plate: {tally: 3, lanyard: true, phone: 'up', boardGrid: true}});
});
export const dark29 = (fb: Buf, key = 'dark29', o: Record<string, unknown> = {}) => held(fb, key, (b) => darkRoom(b, 0, {clock: '2:06', tally: 3, lanyard: true, screen: 'feed', boardGrid: true, ...o}));
S('29.10', '[P] the dark room held + THE ORB right on the lanyard (orb portrait NEW: orb-medium stand-in)', (fb, k, _sh, f) => {
  dark29(fb); dimRoom(fb, 1);
  win(fb, 'R', 'ORB', k, {f, x: {look: [-0.2, 0.85]}});
});
S('29.10a', 'twoshots drawDark2S: "mostly." aloud, to the Orb (head front), lip-sync', (fb, k, sh) => {
  drawDark2S(fb, k, {mas: {head: 'front', look: 1, mouth: mouthOf(sh, k, 'MAS'), arm: 'phone'}, orb: {look: DPLATE_LOOK.lanyard}, plate: {tally: 3, lanyard: true, phone: 'up', boardGrid: true}});
});
export const monitor = (fb: Buf) => { rect(0, 0, 480, RH, fb.ink(PAL.N0)); for (let y = 0; y < RH; y += 3) rect(0, y, 480, 1, fb.ink(PAL.N1)); };
S('29.05', 'avalanche odometer + odoRoll (THE LETTER counter: 505 · 650 · 700 · 745 / 770, the clunk)', (fb, k) => {
  monitor(fb);
  const {value, clunk} = odoRoll(k, LETTER_STOPS(0, 14));
  odometer(fb, 150, 70, value, {digits: 3, label: 'THE LETTER', suffix: '/ 770', kick: clunk});
});
S('29.06', 'kit.cards NEW: stand-in dated quote card', (fb, k) => {
  quoteCard(fb, '"…unable to work for or with people that lack competence, judgment and care for our mission and employees"', "— THE EMPLOYEES' LETTER TO THE NOPEAI BOARD · NOV 20, 2023", k);
  return {full: true};
});
S('29.07', 'post-ui NEW: stand-in signature list (generic, unidentifiable rows), stops 2 beats on ALYI (REPORTED)', (fb, k) => {
  monitor(fb);
  rect(120, 10, 240, RH - 20, fb.ink(PAL.N1));
  const scroll = Math.min(110, Math.floor(k / 2) * 8);
  for (let i = 0; i < 24; i++) {
    const y = 30 + i * 12 - scroll;
    if (y < 14 || y > RH - 20) continue;
    if (i === 15) { rect(128, y - 2, 224, 11, fb.ink(PAL.N3)); pt(fb, 'ALYI (REPORTED)', 136, y, PAL.P2); continue; }
    rect(136, y + 1, 30 + ((i * 17) % 50), 5, fb.ink(PAL.G2)); rect(200 + ((i * 7) % 20), y + 1, 40 + ((i * 29) % 60), 5, fb.ink(PAL.G2));
  }
});
S('29.07a', '[P] the dark room held + THE ORB right (orb portrait NEW: orb-medium stand-in): iris to the name, to Alyi\'s thumbnail, back (chime)', (fb, k, _sh, f) => {
  dark29(fb); dimRoom(fb, 1);
  const L: Array<[number, number]> = [[-0.95, -0.15], [-0.9, 0.0], [-0.95, -0.15]];
  win(fb, 'R', 'ORB', k, {f, x: {look: L[Math.min(2, Math.floor(k / 20))]}});
});
S('29.08', 'twoshots drawDark2S tray 1 → 4 (the plate\'s own EVIRHT check + VOID stamp, a stand-in for prop.check-evirht)', (fb, k) => {
  drawDark2S(fb, k, {mas: {arm: 'rest'}, orb: {look: DPLATE_LOOK.face}, plate: {tally: 3, lanyard: true, phone: 'up', tray: (Math.min(4, Math.floor(on2(k) / 6) + 1)) as 1 | 2 | 3 | 4}});
});
S(['29.11', '29.11b'], 'gerg-medium drawGergMediumPOV (the medium tile opens in 3 held steps), lip-sync', (fb, k, sh) => {
  const talk = speaking(sh, k, 'GERG');
  drawGergMediumPOV(fb, 0, 0, {head: talk ? 'talk' : 'type', mouth: mouthOf(sh, k, 'GERG')}, {f: k, speaking: talk, typing: !talk, open: sh.id === '29.11' ? Math.min(1, (k + 1) / 9) : 1});
});
S('29.11a', '[P] the dark room held + MAS left, lip-sync', (fb, k, sh, f) => {
  dark29(fb, 'dark29-gerg', {screen: (scr: Buf, ff: number) => drawGergTile(scr, 0, 0, scr.w, scr.h, {mouth: 'rest', lid: 1, look: 0}, {f: ff, typing: true})});
  dimRoom(fb, 1);
  win(fb, 'L', 'MAS', k, {f, mouth: mouthOf(sh, k, 'MAS'), look: -1});
});
S('29.12q', '[PF] the QUIET BEAT: the dark room falls away to the monitor\'s green + his cyan; Mas watches Gerg type', (fb, k, _sh, f) => {
  dark29(fb, 'dark29-gerg', {screen: (scr: Buf, ff: number) => drawGergTile(scr, 0, 0, scr.w, scr.h, {mouth: 'rest', lid: 1, look: 0}, {f: ff, typing: true})});
  fallaway(fb, k, 3, 0, 5);
  win(fb, 'L', 'MAS', k, {f, look: -1});
});
S('29.11c', 'gerg-medium drawGergMediumPOV head up (the glance into his camera: his real face)', (fb, k) => {
  drawGergMediumPOV(fb, 0, 0, {head: 'up', lid: 0}, {f: k, typing: false});
});
S('29.12r', '[PF] Mas looking back; Gerg typing again on the monitor behind his window', (fb, k, _sh, f) => {
  dark29(fb, 'dark29-gerg', {screen: (scr: Buf, ff: number) => drawGergTile(scr, 0, 0, scr.w, scr.h, {mouth: 'rest', lid: 1, look: 0}, {f: ff, typing: true})});
  dimRoom(fb, 3);
  win(fb, 'L', 'MAS', k, {f, look: 1});
});
const DOOR_AT = EVENTS.find((e) => e.shot === '29.12')?.abs ?? 0;
S('29.12', 'twoshots drawDark2S: the slate door\'s held steps from "asked" (plate door 1 → 3 → 4); TASYA (O.S.)', (fb, k, sh) => {
  const d = sh.s + k - DOOR_AT;
  const door = (d < 0 ? 0 : d < 15 ? 1 : d < 30 ? 2 : d < 45 ? 3 : 4) as 0 | 1 | 2 | 3 | 4;
  drawDark2S(fb, k, {mas: {arm: 'rest'}, orb: {look: DPLATE_LOOK.face}, plate: {tally: 3, lanyard: true, phone: 'up', door}});
});
S('29.13', '[P] the dark room held (the blue door, key in the lock) + MAS left: leave it open.', (fb, k, sh, f) => {
  dark29(fb, 'dark29-door', {blueDoor: 4});
  dimRoom(fb, 1);
  win(fb, 'L', 'MAS', k, {f, mouth: mouthOf(sh, k, 'MAS'), look: 0});
});
// ---- THE TILE AVALANCHE (29.14-29.20): the falling-stack kit on his monitor, full-bleed
export const T0 = 7335; // 29.14's act frame
export const SLOT = 12;
// the kit's 40 x 21 slot layout (745 / 770 exactly), lifted 60 px so its lowest 16 rows fill the 203-row room area
// above the rail band; the top 5 rows sit above the screen and fill last (the counter still reads 745)
export const LIFT = 60, SY0 = CALL_BAR_H; // the stack is planned in a 480 x 330 buffer; rows LIFT..LIFT+202 are shown
export const B4: TileRect[] = [
  {x: 6 * SLOT + 3, y: SY0 + 7 * SLOT, w: 150, h: 84}, {x: 21 * SLOT + 3, y: SY0 + 7 * SLOT, w: 150, h: 84},
  {x: 6 * SLOT + 3, y: SY0 + 14 * SLOT, w: 150, h: 84}, {x: 21 * SLOT + 3, y: SY0 + 14 * SLOT, w: 150, h: 84},
];
export const AT = {alyi: 255, neleh: 360, qv: 490, press: 780};
export const STACK: GridStackOpts = {
  x0: 0, y0: SY0, cols: 40, rows: 21, pitch: [SLOT, SLOT], t0: 15,
  spawnAt: (i) => (i === 0 ? 0 : i === 1 ? 15 : 40 + Math.pow(i - 2, 0.62) * 9.6),
  reserve: [
    {c: 6, r: 7, w: 13, h: 7, openAt: AT.alyi + 24}, {c: 21, r: 7, w: 13, h: 7, openAt: AT.neleh + 24},
    {c: 6, r: 14, w: 13, h: 7}, // MADA: never opens
    {c: 21, r: 14, w: 13, h: 7, openAt: AT.qv + 24},
    {c: 36, r: 5, w: 4, h: 1}, // the counter chip
  ],
};
let STACK_PLAN: GridItem[] | null = null;
export const stackPlan = () => (STACK_PLAN ??= planGridStack(STACK));
export const avalanche = (fb: Buf, T: number) => {
  const b = new Buf(480, 330, PAL.N1);
  const plan = stackPlan();
  const sh = [-shove(T, AT.alyi, 300), shove(T, AT.neleh, 300), 0, shove(T, AT.qv, 300)];
  BOARD4.forEach((t, i) => { const r = B4[i]; if (Math.abs(sh[i]) < 300) drawTile(b, {...r, x: r.x + sh[i], id: t.id, name: t.name, vote: 3}, T); });
  scatter(b, B4[1].x + 74 + sh[1], B4[1].y + 20, T - AT.neleh - 17, {n: 12, digits: true, seed: 5, col: PAL.W8, life: 30});
  drawGridStack(b, plan, T, STACK, (bb, x, y, it) => employeeFace(bb, x, y, SLOT - 1, SLOT - 1, it.seed), {c: 6, r: 14, w: 13, h: 7, t0: AT.press});
  const n = landedBy(plan, T);
  const cy = SY0 + 5 * SLOT;
  rect(36 * SLOT, cy, 48, 11, b.ink(PAL.N0));
  const s = `${n}/770`;
  text(b, s, 36 * SLOT + 46 - textWidth(s), cy + 2, n >= 745 ? PAL.L3 : PAL.P1);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) fb.set(x, y, b.get(x, y + LIFT));
  callChrome(fb, {title: 'board sync', clock: null, controls: false, noFill: true, h: RH});
};
S(['29.14', '29.15', '29.16', '29.17', '29.20'], 'avalanche planGridStack / drawGridStack on the board grid (monitor full-bleed; layout re-fit to the 203-row room area)', (fb, _k, _sh, f) => { avalanche(fb, f - T0); });
S('29.18', 'avalanche: Mada wedged in the gap; bar 2 beat 4 the frame holds HALF-FRAME on his tile (mada drawMadaTile)', (fb, k, _sh, f) => {
  avalanche(fb, f - T0);
  if (k >= 105) { rect(119, 29, 242, 138, fb.ink(PAL.N0)); drawMadaTile(fb, 120, 30, 240, 136, {mouth: 'rest', lid: 0, nod: 0}, {spin: f}); }
});
S('29.17a', '[PF] the dark room held, stepped down to the wall of faces; Mas watching the one gap', (fb, k, _sh, f) => {
  dark29(fb); fallaway(fb, k, 3, 0, 5);
  win(fb, 'L', 'MAS', k, {f, look: -1});
});
S('29.19', 'engine nameCard over the live tile wall (kit.cards NEW stat line); 2-tone freeze beat 1', (fb, k, _sh, f) => {
  avalanche(fb, f - T0); if (k < 15) freezePrint(fb);
  blipCard(fb, k, 'MADA', 'MADA', 'LAST FIRER STANDING', 'ANSWERS GIVEN: 0', {f}, 'R');
});

// ================================================================== sc 30 · THE RETURN
S('30.01', 'twoshots drawDoorwayP2 (bullpen door crack): hearts off the grid f144/156/171, Alyi looks up f190, the IOU f220; post-ui stand-in', (fb, k, sh) => {
  drawDoorwayP2(fb, k, {hearts: [144, 156, 171], alyi: {mouth: mouthOf(sh, k, 'ALYI'), up: k >= 190}, iou: (k < 220 ? 0 : Math.floor(k / 4) % 2 ? 1 : 2) as 0 | 1 | 2, openL: Math.min(1, (k + 1) / 3), openR: Math.min(1, (k + 1) / 3)});
  if (k >= 15 && k < 150) postCard(fb, 150, 170 - 40, 190, 'ALYI', 'I deeply regret my participation in the board\'s actions.', k - 15);
});
S('30.04', 'rooms-b bullpen walkout + tasya room sprite (clasp) + Mas at his desk', (fb) => {
  held(fb, 'walkout', (b) => bullpenRoom(b, 0, {variant: 'walkout'}, {mas: true, tasya: {arm: 'clasp'}}));
});
const wordAt = (sh: ShotV2, w: string) => { const l = sh.lines[0]; const x = l?.words.find((q) => q[0].toLowerCase().startsWith(w)); return l && x ? l.s + x[1] : 0; };
const stepOf = (k: number, t: number) => (k < t ? 0 : k < t + 5 ? 1 : k < t + 10 ? 2 : 3);
S(['30.05', '30.06', '30.07'], 'rooms-b bullpenLandlord (floor / ceiling / walls in 3 held steps on the word) + TASYA\'s window right', (fb, k, sh, f) => {
  const sc = sh.id;
  const t = wordAt(sh, sc === '30.05' ? 'below' : sc === '30.06' ? 'above' : 'around');
  const s = stepOf(k, t);
  const L = sc === '30.05' ? {floor: s, ceiling: 0, walls: 0} : sc === '30.06' ? {floor: 3, ceiling: s, walls: 0} : {floor: 3, ceiling: 3, walls: s};
  const gone = sc === '30.07' && s >= 3;
  held(fb, `land-${L.floor}${L.ceiling}${L.walls}${gone ? 'g' : ''}`, (b) => bullpenRoom(b, 0, {variant: 'walkout'}, {mas: true, tasya: gone ? null : {arm: 'clasp'}, landlord: L}));
  if (!(sc === '30.07' && k >= 70)) win(fb, 'R', 'TASYA', k, {f, mouth: mouthOf(sh, k, 'TASYA'), x: {arms: 'clasp'}}, {k0: sc === '30.05' ? 0 : -99, closeAt: sc === '30.07' ? 60 : undefined});
});
S('30.08', '[PF] the all-slate bullpen held + stepped down; MAS left looking down (swaps-act4 drawMasLookDown); Hello. from the floor', (fb, k, sh, f) => {
  held(fb, 'land-333g', (b) => bullpenRoom(b, 0, {variant: 'walkout'}, {mas: true, tasya: null, landlord: {floor: 3, ceiling: 3, walls: 3}}));
  fallaway(fb, k, 2, 0, 8);
  win(fb, 'L', 'MAS', k, {f, mouth: mouthOf(sh, k, 'MAS'), x: {down: true}});
});
S('30.09', 'twoshots drawMadaM (boardroom-plate fires, mada-medium): perfectly still among the fires', (fb, k) => { drawMadaM(fb, k, {}); });
S('30.10', 'rooms-a boardroom wide (FIRES_SC30, the door bangs, SHAKE_DOOR on the room) + terb walk-in (helmet pops on at the door)', (fb, k) => {
  const open = k >= 8;
  boardRoom(fb, k, {fires: FIRES_SC30, door: open ? 'open' : 'closed', doorFlash: k === 8 ? 1 : 0, rolodex: 'still', plates: {A: null, B: 'ALYI', C: null, D: 'NELEH', E: 'THE QUIET VOTE'}},
    {mada: true, terb: open ? {x: 394 - Math.floor(on2(k - 8) * 1.5), pose: {legs: terbWalkAt(k), helmet: k >= 18, arm: 'carry'}} : null, shake: doorShake(k, 8)});
});
S('30.11', 'FULL FREEZE: the boardroom 2-tone; Mas in colour (mas-stand walk → reach → pocket) pulls the pin; engine nameCard TERB (kit.cards NEW stat)', (fb, k, _sh, f) => {
  held(fb, 'board-freeze', (b) => { boardRoom(b, 0, {fires: FIRES_SC30, door: 'open', rolodex: 'still', plates: {A: null, B: 'ALYI', C: null, D: 'NELEH', E: 'THE QUIET VOTE'}}, {mada: true, terb: {x: 368, pose: {legs: 'stand', helmet: true, arm: 'carry', pin: true}}}); freezePrint(b); });
  const x = Math.min(330, 150 + on2(k) * 3);
  drawMasStand(fb, x, 196, {...MAS_STAND_DEFAULT, legs: x < 330 ? masWalkAt(k) : 'stand', arm: k < 62 ? 'down' : k < 76 ? 'reach' : 'pocket', light: 'room'});
  blipCard(fb, k, 'TERB', 'TERB', 'CHAIRS BOARDS ON FIRE', 'EXTINGUISHERS: 1', {f, x: {helmet: true}}, 'L');
});
S('30.12', 'terb drawPinTag (DO NOT REMOVE) over the held freeze · BOX: Mas\'s fingers on the pin NEW', (fb) => {
  held(fb, 'board-freeze', (b) => { boardRoom(b, 0, {fires: FIRES_SC30, door: 'open', rolodex: 'still'}, {mada: true}); freezePrint(b); });
  dimRoom(fb, 2);
  rect(150, 50, 180, 110, fb.ink(PAL.N1));
  drawPinTag(fb, 214, 76);
  box(fb, 150, 50, 180, 110, 'HAND NEW: his fingers on the pin (the pin + tag are built)', {fill: null});
});
export const boardFires = (fb: Buf, k: number, turned = false) => held(fb, `board-fires${Math.floor(k / 4) % 3}${turned ? 't' : ''}`, (b) => boardRoom(b, k, {fires: FIRES_SC30, door: 'open', rolodex: 'still', plates: {A: null, B: 'ALYI', C: null, D: 'NELEH', E: 'THE QUIET VOTE'}}, {mada: true, terb: {x: 360, pose: {legs: 'stand', helmet: true, arm: 'carry', pin: false}}}));
S('30.13', '[P] the boardroom (fires, on 4s) + TERB right: "Which room is on fire?" / f60 the room looks around / "…Ah."', (fb, k, sh, f) => {
  boardFires(fb, k, k >= 60); dimRoom(fb, 1);
  win(fb, 'R', 'TERB', k, {f, mouth: mouthOf(sh, k, 'TERB'), look: (k >= 60 && k < 75 ? (Math.floor(k / 5) % 2 ? 1 : -1) : -1) as -1 | 0 | 1, x: {brow: k >= 70 ? 'ah' : 'level', helmet: true}});
});
S('30.14', 'twoshots drawCalmOff2S: two still men; Terb sprays behind them; keycaps; TERB (O.S.) Terms?', (fb, k) => {
  drawCalmOff2S(fb, k, {terb: {spray: k >= 10 ? k - 10 : null}, plate: {keycaps: k}});
});
S('30.15', '[P] the boardroom held + MADA right (spinner), HOLD 1 BEAT then "Good question."', (fb, k, sh, f) => {
  boardFires(fb, 0); dimRoom(fb, 1);
  win(fb, 'R', 'MADA', k, {f, mouth: mouthOf(sh, k, 'MADA')});
});
S('30.16', '[P] the boardroom held + MAS left, HOLD 1 BEAT then "good question."', (fb, k, sh, f) => {
  boardFires(fb, 0); dimRoom(fb, 1);
  win(fb, 'L', 'MAS', k, {f, mouth: mouthOf(sh, k, 'MAS'), look: 1});
});
S('30.17', 'twoshots drawCalmOff2S: THE LONG HOLD (bar 1: the spinner stops, the nod), bar 2 Terb\'s hand stamps the term sheet', (fb, k) => {
  const nod = (k < 34 ? 0 : k < 38 ? 1 : k < 42 ? 2 : k < 46 ? 1 : 0) as 0 | 1 | 2;
  drawCalmOff2S(fb, k, {mada: {nod}, spin: Math.min(k, 30), stopped: k >= 30, terb: null,
    plate: {fires: FIRES_CALMOFF(-40), keycaps: 40, termSheet: k < 60 ? 'none' : k < 70 ? 'blank' : 'stamped', terbHand: k < 60 ? 'none' : k < 90 ? 'stamp' : 'hand'}});
});
S('30.20', 'post-ui NEW: stand-in phone lit green + Gerg\'s post; keycaps pop from the bottom', (fb, k) => {
  phoneScreen(fb, PAL.L0);
  postCard(fb, 112, 50, 256, 'GERG MOCKBRAN', 'Returning to NopeAI & getting back to coding tonight.', k, {col: PAL.L3});
  keycapRain(fb, k);
});
S('30.20a', '[PF] the boardroom held + stepped down; Mas reading, his face unchanged', (fb, k, _sh, f) => {
  boardFires(fb, 0); dimRoom(fb, 2);
  win(fb, 'L', 'MAS', k, {f, look: 0});
});
S('30.21', 'rooms-a drawTableInsert (prop) + kits props hourglass L: the last grain, the shatter (glass only), the sand holds a beat; post-ui stand-in', (fb, k) => {
  drawTableInsert(fb, {f: k, focus: 'prop'});
  const [px, py] = TABLE_INSERT.prop;
  const N = hourglassGrains('L');
  hourglass(fb, px - 16, py - 58, {size: 'L', moved: k < 12 ? N - 1 : N, running: k < 12, f: k, shatter: k >= 45 ? k - 45 : undefined});
  if (k >= 15) postCard(fb, 20, 20, 220, 'TTEMME', 'I am deeply pleased by this result, after ~72 very intense hours of work.', k - 15);
});
export const IGNITE = [1, 2, 1, 2, 3] as const;
S('30.22', 'rooms-a lobby night: the sign ignites (1,2,1,2,3 on 3 f holds) + mas-stand at the reception desk, no lanyard', (fb, k) => {
  const sign = (k < 6 ? 1 : IGNITE[Math.min(4, Math.floor((k - 6) / 3))]) as 0 | 1 | 2 | 3;
  held(fb, `lobby-s${sign}`, (b) => lobbyRoom(b, 0, {sign}));
});
S('30.23', 'rooms-a drawSignFloorInsert (the box of zeros set down) · BOX: the maintenance hand NEW', (fb, k) => {
  drawSignFloorInsert(fb, {f: k, box: k < 12 ? 0 : k < 22 ? 1 : 2});
  if (k < 30) box(fb, 250, 100, 120, 44, 'HAND NEW: a maintenance hand (hand only)', {fill: null});
});
S('30.24', 'rooms-a lobby night (lit) + callgrid callDialog: Cancel greys 3 held beats; the unlit arrow clicks on beat 4', (fb, k) => {
  held(fb, 'lobby-s3', (b) => lobbyRoom(b, 0, {sign: 3}));
  const dx = 118, dy = 40, dw = 244;
  callDialog(fb, dx, dy, {w: dw, head: 'MAS MANALT', grey: Math.min(3, beat(k) + 1) as 1 | 2 | 3, cancelDown: k >= 52 && k < 54});
  if (k >= 45) {
    const [bx, by] = dialogButton(dx, dy, 'cancel', dw);
    const [px, py] = pointerAt(on2(k), 45, 51, [470, 190], [bx + 30, by + 9]);
    drawPointer(fb, px, py, k >= 52 && k < 54);
  }
});
S('30.25', 'mas-cu drawMasCU (lobby): the same ONE silent drawing, the tungsten behind him', (fb) => { drawMasCU(fb, {backdrop: 'lobby', f: 0}); });
S('30.26', 'inserts-mas drawNudgeInsert (lobby): held → set → NUDGE at f26; "okay." over the hands', (fb, k) => {
  drawNudgeInsert(fb, 'lobby', k < 4 ? 'held' : k < 26 ? 'set' : 'nudge');
});

// ================================================================== sc 31 · THE BACK WALL
S('31.01', 'inserts-props drawVaultInsert: Q*, DO NOT OPEN. DO NOT EXPLAIN.', (fb, k) => { drawVaultInsert(fb, k); });
S('31.02', 'rooms-b bullpen + mas-stand walk + gerg-stand walk (typing → stops, look up) + orb-medium · BOX: the Q* vault at room scale NEW', (fb, k) => {
  held(fb, 'bull-shut', (b) => bullpenRoom(b, 0, {door: 'shut'}, {}));
  box(fb, 14, 136, 44, 38, 'Q* VAULT (room) NEW', {fill: PAL.G1});
  const mx = 40 + Math.floor(on2(k) * 2.2);
  drawMasStand(fb, mx, 196, {...MAS_STAND_DEFAULT, legs: masWalkAt(k), light: 'room'});
  drawOrb(fb, mx + 14, 118, 5, {look: k >= 10 && k < 40 ? [-0.9, 0.3] : [0.6, 0.1], aperture: 0.5});
  const gs = k < 40;
  const gx = gs ? 470 - Math.floor(on2(k) * 2) : 390;
  drawGergStand(fb, gx, 196, {...GERG_STAND_DEFAULT, legs: gs ? gergWalkAt(k) : 'stand', type: (gs ? Math.floor(k / 4) % 3 : 0) as 0 | 1 | 2, look: gs ? 'screen' : 'up'}, {flip: true});
});
S('31.03', 'twoshots drawVaultP2: GERG asks, MAS (not looking) answers; Gerg looks at the note, nods, his window closes', (fb, k, sh) => {
  drawVaultP2(fb, k, {mas: {mouth: mouthOf(sh, k, 'MAS'), look: 0}, gerg: {mouth: mouthOf(sh, k, 'GERG'), look: k >= 78 ? -1 : 0, lid: 0, nod: k >= 92 && k < 100 ? 1 : 0}, closeAt: 104});
});
S('31.06', '[P] the bullpen held (door shut, nameplate on) + MAS left reading his memo aloud, lip-sync', (fb, k, sh, f) => {
  held(fb, 'bull-mas', (b) => bullpenRoom(b, 0, {door: 'shut'}, {mas: true}));
  dimRoom(fb, 1);
  win(fb, 'L', 'MAS', k, {f, mouth: mouthOf(sh, k, 'MAS'), look: 0});
});
S('31.07', 'rooms-a drawChairBackInsert: four screws, four beats; the plate comes off · BOX: the worker\'s hand + screwdriver NEW', (fb, k) => {
  drawChairBackInsert(fb, {f: k, screws: Math.min(4, beat(k)), plateOff: k >= 60});
  box(fb, 330, 120, 130, 56, 'HAND NEW: a maintenance screwdriver (hand only)', {fill: null});
});
S('31.08', 'inserts-props drawShutDoorInsert: the conference door, shut, ALYI plate on', (fb) => { drawShutDoorInsert(fb); });
S('31.09', 'rooms-b bullpen (window corner) · BOX: prop.observer-chair NEW (unfolds, 4 drawings; the key ring drops)', (fb, k) => {
  held(fb, 'bull-shut', (b) => bullpenRoom(b, 0, {door: 'shut'}, {}));
  const u = Math.min(4, Math.floor(k / 8));
  box(fb, 372, 96, 96, 84, `PROP NEW: MACROSOFT-blue folding chair (unfold ${u}/4)`, {fill: PAL.N2});
  if (u >= 4) { rect(384, 140, 72, 16, fb.ink(PAL.G4)); pt(fb, 'OBSERVER', 390, 142, PAL.P2); pt(fb, '(NON-VOTING)', 386, 150, PAL.P1); }
  if (k >= 60) { const y = Math.min(132, 60 + (k - 60) * 3); rect(412, y, 8, 5, fb.ink(PAL.W5)); rect(414, y + 1, 4, 3, fb.ink(PAL.N0)); }
});

// ================================================================== checks
/** every shot of the lock has a layout (the frame composer falls back to a labelled box if not) */
export const missingShots = (ids: string[]) => ids.filter((id) => !DRAW[id]);
void clamp; void PW; void drawSuite; void suitePortraitBg; void bezel; void pw; void SUBS; void WL; void CALL_BAR_H;
