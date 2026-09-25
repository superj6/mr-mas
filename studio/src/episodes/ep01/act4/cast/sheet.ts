// MR. MAS — Ep1 act 4: the CAST SHEETS (owned by the act-4 character artist). Pure pixel code: every view returns
// a native 480x270 buffer and renders identically in Node (tools/lab.ts) and Remotion (CastCanvas.tsx).
//   sheet:<who>   who = neleh | mada | ttemme | terb | quietvote | rima | tasya | adelina | alyi | gerg
//   lineup        every act-4 room sprite on one floor, with Mario (existing) for scale; the mini tiles
//   cards:<0|1>   the act's name cards (portrait + copy) as they will read
//   callgrid      the five-tile board call (sc 26) in full colour with the act-4 tiles
//   boardgrid     the board's grid + the tile the spotlight finds (sc 27)
//   motion:<f>    the motion test (MOTION_FRAMES): lip-sync on the typewriter head, blinks, the footnote orbit,
//                 the spinner and its stop, the sand, the chat, Terb's walk-in and the helmet pop, the flicker
import {Buf, rect} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {text, textWidth} from '../../../../shared/pixel/font';
import {blitImg} from '../../../../shared/pixel/figure';
import {nameCard, portraitWindow} from '../../../../shared/pixel/ui';
import {Viseme, VISEMES, visemeAt, blinkSched} from '../../../../shared/pixel/cast/talk';
import {TILE_W, TILE_H, MINI_W, MINI_H, tileFrame, tileLabel, tileVote, miniFrame, voteIcon, VoteState, speakRing} from '../../../../shared/pixel/cast/calltile';
import * as NE from '../../../../shared/pixel/cast/neleh';
import * as MA from '../../../../shared/pixel/cast/mada';
import * as TT from '../../../../shared/pixel/cast/ttemme';
import * as TE from '../../../../shared/pixel/cast/terb';
import * as QV from '../../../../shared/pixel/cast/the-quiet-vote';
import * as RI from '../../../../shared/pixel/cast/rima-speak';
import * as TA from '../../../../shared/pixel/cast/tasya-speak';
import * as AD from '../../../../shared/pixel/cast/adelina';
import * as AL from '../../../../shared/pixel/cast/alyi-speak';
import * as GE from '../../../../shared/pixel/cast/gerg-speak';
import {marioImg, MARIO_BASE, MARIO_FOOT} from '../../../../shared/pixel/cast/mario';
import {masPortrait} from '../../../../shared/pixel/cast/mas';
import {vegasBg} from '../../../../dev/mfinale/callart';
import {labView} from './lab';
import * as MS from '../../../../shared/pixel/cast/mas-stand';
import * as GS from '../../../../shared/pixel/cast/gerg-stand';

const W = 480, H = 270;
type Draw = (b: Buf, x: number, y: number) => void;

// ------------------------------------------------------------------ sheet furniture
const title = (b: Buf, name: string, sub: string, accent: number) => {
  text(b, 'MR. MAS  EP1 ACT 4  CAST', 6, 3, PAL.N5);
  text(b, name, 6 + textWidth('MR. MAS  EP1 ACT 4  CAST') + 10, 3, accent);
  text(b, sub, W - 6 - textWidth(sub), 3, PAL.N5);
  rect(0, 12, W, 1, b.ink(PAL.N2));
};
const label = (b: Buf, s: string, x: number, y: number, col: number = PAL.N6) => text(b, s, x, y, col);
/** Draw `draw` into a scratch buffer (at the portrait's own origin) and copy the crop box to (dx, dy), framed. */
const crop = (b: Buf, draw: Draw, cx: number, cy: number, cw: number, ch: number, dx: number, dy: number) => {
  const t = new Buf(140, 170, PAL.N1);
  draw(t, 0, 0);
  rect(dx - 1, dy - 1, cw + 2, ch + 2, b.ink(PAL.N0));
  for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) b.set(dx + i, dy + j, t.get(cx + i, cy + j));
};
const framedPortrait = (b: Buf, x: number, y: number, name: string, accent: number, draw: Draw) => {
  portraitWindow(b, x, y, 112, 136, {open: 1, name, accent, content: (bb, px, py) => draw(bb, px, py)});
};
const floor = (b: Buf, y: number, x0 = 0, x1 = W) => { rect(x0, y, x1 - x0, H - y, b.ink(PAL.N2)); rect(x0, y, x1 - x0, 1, b.ink(PAL.N3)); };

/** The standard portrait block: window + mouths (3x2) + lids + expressions, each as crops. */
interface PortraitSpec {
  name: string; accent: number;
  draw: (m: Viseme, lid: 0 | 1 | 2, expr: number) => Draw;
  exprNames: string[];
  mouthBox: [number, number, number, number];
  eyeBox: [number, number, number, number];
  hero: [Viseme, 0 | 1 | 2, number];
}
const portraitBlock = (b: Buf, sp: PortraitSpec) => {
  framedPortrait(b, 6, 18, sp.name, sp.accent, sp.draw(...sp.hero));
  const mx = 126;
  label(b, 'MOUTHS', mx, 16, sp.accent);
  const [cx, cy, cw, ch] = sp.mouthBox;
  VISEMES.forEach((v, i) => {
    const dx = mx + (i % 3) * (cw + 4), dy = 27 + Math.floor(i / 3) * (ch + 11);
    crop(b, sp.draw(v, 0, 0), cx, cy, cw, ch, dx, dy);
    label(b, v, dx, dy + ch + 2, PAL.N5);
  });
  const ly = 27 + 2 * (ch + 11) + 1;
  label(b, 'LIDS', mx, ly, sp.accent);
  const [ex, ey, ew, eh] = sp.eyeBox;
  ([0, 1, 2] as const).forEach((l, i) => crop(b, sp.draw('rest', l, 0), ex, ey, ew, eh, mx + i * (ew + 4), ly + 10));
  const ey2 = ly + 10 + eh + 5;
  label(b, 'EXPRESSIONS', mx, ey2, sp.accent);
  sp.exprNames.forEach((n, i) => {
    const dx = mx + i * (ew + 4);
    crop(b, sp.draw(i === 1 ? 'E' : 'rest', 0, i), ex, ey - 4, ew, eh + 22, dx, ey2 + 10);
    label(b, n, dx, ey2 + 10 + eh + 24, PAL.N5);
  });
};

// ------------------------------------------------------------------ NELEH
const sheetNeleh = (b: Buf) => {
  title(b, 'NELEH', 'the paper glows. the footnotes orbit.', PAL.W7);
  const brows: NE.NelehBrow[] = ['level', 'query', 'worry'];
  portraitBlock(b, {
    name: 'NELEH', accent: PAL.W7, hero: ['rest', 0, 0], exprNames: brows,
    draw: (m, lid, e) => (bb, x, y) => NE.drawNelehPortrait(bb, x, y, {mouth: m, lid, look: -1, brow: brows[e]}, {orbit: 9}),
    mouthBox: [28, 54, 30, 24], eyeBox: [32, 38, 34, 16],
  });
  const tx = 250, ty = 27;
  label(b, 'CALL TILE (orbit) + mini', tx, 16, PAL.W7);
  NE.drawNelehTile(b, tx, ty, TILE_W, TILE_H, {mouth: 'rest', lid: 0, brow: 'level'}, {orbit: 14}); tileFrame(b, tx, ty, TILE_W, TILE_H); tileLabel(b, tx, ty, TILE_H, 'NELEH'); tileVote(b, tx, ty, TILE_W, 'flip');
  NE.drawNelehMini(b, 410, ty, MINI_W, MINI_H); miniFrame(b, 410, ty, MINI_W, MINI_H);
  label(b, 'orbit: stop =', 410, 56, PAL.N5); label(b, 'freeze f;', 410, 66, PAL.N5); label(b, 'scatter 0..1', 410, 76, PAL.N5);
  floor(b, 252, 250, W);
  label(b, 'ROOM  paper / marker / write A B / sil', 250, 118, PAL.W7);
  const poses: Array<[NE.NelehArm, NE.NelehLight]> = [['paper', 'room'], ['marker', 'room'], ['write0', 'room'], ['write1', 'room'], ['paper', 'sil']];
  poses.forEach(([arm, light], i) => {
    const fx = 268 + i * 44;
    NE.drawNelehRoom(b, fx, 252, {arm, mouth: i === 1 ? 'open' : 'rest', blink: false, light});
    if (i === 0) NE.drawFootnotes(b, NE.roomOrbit(fx, 252), 6, 'all');
  });
};

// ------------------------------------------------------------------ MADA
const sheetMada = (b: Buf) => {
  title(b, 'MADA', 'good question.', PAL.G6);
  const ex = ['poker', 'nod', 'the tell'];
  portraitBlock(b, {
    name: 'MADA', accent: PAL.G6, hero: ['rest', 0, 0], exprNames: ex,
    draw: (m, lid, e) => (bb, x, y) => MA.drawMadaPortrait(bb, x, y, {mouth: e === 2 ? 'smile' : m, lid: e === 1 ? 1 : lid, look: 0, nod: e === 1 ? 2 : 0}, {spin: e === 0 ? 5 : null}),
    mouthBox: [40, 64, 32, 24], eyeBox: [36, 40, 40, 16],
  });
  const tx = 262, ty = 27;
  label(b, 'CALL TILE (spinner) + mini', tx, 16, PAL.G6);
  MA.drawMadaTile(b, tx, ty, TILE_W, TILE_H, {mouth: 'rest', lid: 0, nod: 0}, {spin: 7}); tileFrame(b, tx, ty, TILE_W, TILE_H); tileLabel(b, tx, ty, TILE_H, 'MADA'); tileVote(b, tx, ty, TILE_W, 'flip');
  MA.drawMadaMini(b, 420, ty, MINI_W, MINI_H); miniFrame(b, 420, ty, MINI_W, MINI_H);
  label(b, 'SPINNER', 420, 52, PAL.G6);
  for (let k = 0; k < 8; k++) MA.drawSpinner(b, 426 + (k % 3) * 16, 70 + Math.floor(k / 3) * 16, k * MA.SPIN_STEP, {size: 'md'});
  MA.drawSpinner(b, 458, 102, 6, {size: 'md', col: 'blue'});
  MA.drawSpinner(b, 426, 124, 0, {size: 'md', stopped: true}); label(b, 'stop', 436, 121, PAL.N5);
  floor(b, 252, 250, W);
  label(b, 'ROOM  seated, the bolted chair', 262, 140, PAL.G6);
  MA.drawMadaSeated(b, 286, 252, {lid: 0, mouth: 'rest', nod: 0, light: 'room'}, {spin: 3});
  MA.drawMadaSeated(b, 336, 252, {lid: 1, mouth: 'open', nod: 1, light: 'room'}, {flip: true, spin: 3, stopped: true});
  MA.drawMadaSeated(b, 386, 252, {lid: 0, mouth: 'rest', nod: 0, light: 'sil'});
  MA.drawMadaChair(b, 440, 252);
};

// ------------------------------------------------------------------ TTEMME
const sheetTtemme = (b: Buf) => {
  title(b, 'TTEMME', 'chat. i\'m the ceo now.', PAL.U5);
  const brows: TT.TtemmeBrow[] = ['level', 'hype', 'unsure'];
  portraitBlock(b, {
    name: 'TTEMME', accent: PAL.U5, hero: ['rest', 0, 1], exprNames: brows,
    draw: (m, lid, e) => (bb, x, y) => TT.drawTtemmePortrait(bb, x, y, {mouth: m, lid, look: 0, brow: brows[e], gaze: e === 2 ? 'sand' : 'cam'}, {sand: 0.35, stream: true, chat: e === 1 ? 6 : null}),
    mouthBox: [30, 58, 32, 26], eyeBox: [32, 36, 36, 16],
  });
  label(b, 'HOURGLASS  sand / side / shatter', 262, 16, PAL.U5);
  [0, 0.25, 0.5, 0.75, 1].forEach((sd, i) => TT.drawHourglass(b, 262 + i * 22, 26, {sand: sd, stream: sd > 0 && sd < 1}, {f: i}));
  TT.drawHourglass(b, 376, 26, {sand: 0.5, flip: 'side'});
  [0, 4, 10, 18, 24].forEach((k, i) => TT.drawHourglass(b, 262 + i * 24, 64, {sand: 1, shatter: k}));
  [0, 4, 8].forEach((k, i) => TT.drawHourglass(b, 410 + i * 10, 28, TT.hourglassFlipAt(k, 0), {size: 'room'}));
  TT.drawStickyNote(b, 400, 58); TT.drawStickyNameplate(b, 452, 96);
  label(b, 'TILE / MINI / ROOM', 262, 116, PAL.U5);
  TT.drawTtemmeTile(b, 262, 126, 100, 58, {mouth: 'E', lid: 0}, {sand: 0.4}); tileFrame(b, 262, 126, 100, 58); tileLabel(b, 262, 126, 58, 'TTEMME');
  TT.drawTtemmeMini(b, 262, 194, MINI_W, MINI_H); miniFrame(b, 262, 194, MINI_W, MINI_H);
  floor(b, 262, 370, W);
  TT.drawTtemmeRoom(b, 388, 262, {arm: 'down', mouth: 'rest', blink: false, light: 'room'});
  TT.drawTtemmeRoom(b, 424, 262, {arm: 'hold', mouth: 'rest', blink: false, light: 'room'}, {hourglass: {sand: 0.3, stream: true}});
  TT.drawTtemmeRoom(b, 458, 262, {arm: 'set', mouth: 'open', blink: false, light: 'spot'}, {hourglass: {sand: 0}});
};

// ------------------------------------------------------------------ TERB
const sheetTerb = (b: Buf) => {
  title(b, 'TERB', 'which room is on fire?', PAL.R3);
  const brows: TE.TerbBrow[] = ['level', 'ah', 'flat'];
  portraitBlock(b, {
    name: 'TERB', accent: PAL.R3, hero: ['rest', 0, 0], exprNames: brows,
    draw: (m, lid, e) => (bb, x, y) => TE.drawTerbPortrait(bb, x, y, {mouth: m, lid: e === 2 ? 1 : lid, look: -1, brow: brows[e], helmet: true}, {f: 3}),
    mouthBox: [30, 58, 32, 26], eyeBox: [32, 36, 36, 16],
  });
  label(b, 'INSERT  the pin + its tag / pin out / terms', 250, 16, PAL.R3);
  TE.drawExtinguisherInsert(b, 250, 24, {pin: true});
  TE.drawExtinguisherInsert(b, 326, 24, {pin: false});
  TE.drawTermSheet(b, 406, 26, {size: 'lg', stamped: true});
  label(b, 'helmet off / tile / mini', 250, 92, PAL.R3);
  crop(b, (bb, x, y) => TE.drawTerbPortrait(bb, x, y, {mouth: 'rest', lid: 0, look: -1, brow: 'level', helmet: false}), 22, 14, 56, 60, 250, 102);
  TE.drawTerbTile(b, 312, 102, 90, 52, {mouth: 'rest', lid: 0, helmet: false}); tileFrame(b, 312, 102, 90, 52);
  TE.drawTerbMini(b, 410, 102, MINI_W, MINI_H); miniFrame(b, 410, 102, MINI_W, MINI_H);
  TE.drawPinTag(b, 424, 128);
  floor(b, 262, 244, W);
  const poses: Array<[TE.TerbLegs, TE.TerbArm, boolean, TE.TerbLight]> = [['w0', 'carry', false, 'room'], ['w2', 'carry', true, 'fire'], ['stand', 'spray', true, 'fire'], ['stand', 'stamp', true, 'fire'], ['stand', 'hand', true, 'fire']];
  poses.forEach(([legs, arm, helmet, light], i) => {
    const fx = 262 + i * 44;
    TE.drawTerbRoom(b, fx, 262, {legs, arm, helmet, mouth: 'rest', blink: false, light, pin: i < 2});
    if (arm === 'spray') TE.drawSpray(b, fx - TE.TERB_FOOT[0] + TE.TERB_HORN[0], 262 - TE.TERB_FOOT[1] + TE.TERB_HORN[1], 1, 6, {len: 14});
  });
};

// ------------------------------------------------------------------ THE QUIET VOTE
const sheetQuietVote = (b: Buf) => {
  title(b, 'THE QUIET VOTE', 'camera off. always.', PAL.N7);
  framedPortrait(b, 6, 18, 'THE QUIET VOTE', PAL.N7, (bb, x, y) => QV.drawQuietVotePortrait(bb, x, y));
  label(b, 'CALL TILE  full / board grid / avalanche / mini', 128, 16, PAL.N7);
  QV.drawQuietVoteTile(b, 128, 27, TILE_W, TILE_H); tileFrame(b, 128, 27, TILE_W, TILE_H); tileVote(b, 128, 27, TILE_W, 'flip');
  QV.drawQuietVoteTile(b, 288, 27, 112, 63); tileFrame(b, 288, 27, 112, 63); tileVote(b, 288, 27, 112, 'back');
  QV.drawQuietVoteTile(b, 408, 27, 64, 36); tileFrame(b, 408, 27, 64, 36);
  QV.drawQuietVoteMini(b, 408, 72, MINI_W, MINI_H); miniFrame(b, 408, 72, MINI_W, MINI_H);
  label(b, 'VOTE ICON  back / edge / flip', 128, 122, PAL.N7);
  (['back', 'edge', 'flip'] as VoteState[]).forEach((v, i) => voteIcon(b, 132 + i * 16, 134, v));
  label(b, 'ROOM  the laptop on a chair', 288, 122, PAL.N7);
  floor(b, 200, 280, W);
  QV.drawQuietVoteLaptop(b, 330, 200); QV.drawQuietVoteLaptop(b, 410, 200, {flip: true});
  label(b, 'no face, no room, no family: the ballot icon is the only thing that changes.', 128, 250, PAL.N5);
};

// ------------------------------------------------------------------ RIMA
const sheetRima = (b: Buf) => {
  title(b, 'RIMA TAMURI', 'we\'ll share more soon.', PAL.P2);
  const brows: RI.RimaBrow[] = ['level', 'lift', 'firm'];
  portraitBlock(b, {
    name: 'RIMA TAMURI', accent: PAL.P2, hero: ['smile', 0, 0], exprNames: brows,
    draw: (m, lid, e) => (bb, x, y) => RI.drawRimaSpeakPortrait(bb, x, y, {mouth: m, lid, brow: brows[e], hand: 'none'}),
    mouthBox: [40, 62, 32, 24], eyeBox: [38, 44, 40, 16],
  });
  label(b, 'JACKET  smooth A / B, house dark', 262, 16, PAL.P2);
  crop(b, (bb, x, y) => RI.drawRimaSpeakPortrait(bb, x, y, {mouth: 'rest', lid: 0, brow: 'level', hand: 'smooth0'}), 14, 96, 60, 40, 262, 26);
  crop(b, (bb, x, y) => RI.drawRimaSpeakPortrait(bb, x, y, {mouth: 'rest', lid: 0, brow: 'level', hand: 'smooth1'}), 14, 96, 60, 40, 328, 26);
  crop(b, (bb, x, y) => RI.drawRimaSpeakPortrait(bb, x, y, {mouth: 'rest', lid: 0, brow: 'level', hand: 'none'}, {spot: 'dark'}), 26, 20, 60, 70, 396, 26);
  label(b, 'CALL TILE  the spotlight finds her: 0, 1', 262, 104, PAL.P2);
  RI.drawRimaTile(b, 262, 114, 100, 58, {mouth: 'rest', lid: 0}, {spot: 0}); tileFrame(b, 262, 114, 100, 58);
  RI.drawRimaTile(b, 262, 180, TILE_W, TILE_H - 8, {mouth: 'E', lid: 0}, {spot: 1}); tileFrame(b, 262, 180, TILE_W, TILE_H - 8); tileLabel(b, 262, 180, TILE_H - 8, 'RIMA TAMURI');
  RI.drawRimaMini(b, 372, 114, MINI_W, MINI_H); miniFrame(b, 372, 114, MINI_W, MINI_H);
};

// ------------------------------------------------------------------ TASYA
const sheetTasya = (b: Buf) => {
  title(b, 'TASYA', 'everyone is welcome.', PAL.C6);
  const ex = ['level', 'warm', 'ring'];
  portraitBlock(b, {
    name: 'TASYA', accent: PAL.C6, hero: ['smile', 0, 1], exprNames: ex,
    draw: (m, lid, e) => (bb, x, y) => TA.drawTasyaSpeakPortrait(bb, x, y, {mouth: e === 1 ? 'smile' : m, lid, brow: e === 1 ? 'warm' : 'level', arms: e === 2 ? 'ring' : 'clasp', jangle: 0}),
    mouthBox: [32, 62, 32, 24], eyeBox: [40, 42, 38, 16],
  });
  label(b, 'ARMS  clasp / ring jangle A, B', 262, 16, PAL.C6);
  crop(b, (bb, x, y) => TA.drawTasyaSpeakPortrait(bb, x, y, {mouth: 'smile', lid: 0, brow: 'warm', arms: 'clasp', jangle: 0}), 36, 96, 56, 40, 262, 26);
  crop(b, (bb, x, y) => TA.drawTasyaSpeakPortrait(bb, x, y, {mouth: 'rest', lid: 0, brow: 'level', arms: 'ring', jangle: 0}), 0, 40, 56, 60, 324, 26);
  crop(b, (bb, x, y) => TA.drawTasyaSpeakPortrait(bb, x, y, {mouth: 'rest', lid: 0, brow: 'level', arms: 'ring', jangle: 1}), 0, 40, 56, 60, 386, 26);
  floor(b, 252, 250, W);
  label(b, 'ROOM  clasp/sign/keys A B/slate/sil', 262, 118, PAL.C6);
  const ps: Array<[TA.TasyaRoomArm, TA.TasyaRoomPose['mouth'], TA.TasyaLight]> = [['clasp', 'smile', 'room'], ['sign', 'open', 'room'], ['keys0', 'rest', 'room'], ['keys1', 'rest', 'room'], ['clasp', 'smile', 'slate'], ['clasp', 'rest', 'sil']];
  ps.forEach(([arm, mouth, light], i) => TA.drawTasyaRoom(b, 274 + i * 36, 252, {arm, mouth, blink: false, light}));
};

// ------------------------------------------------------------------ ADELINA
const sheetAdelina = (b: Buf) => {
  title(b, 'ADELINA', 'in plain english: no.', PAL.W5);
  const brows: AD.AdelinaBrow[] = ['level', 'brisk', 'warm'];
  portraitBlock(b, {
    name: 'ADELINA', accent: PAL.W5, hero: ['smile', 0, 2], exprNames: brows,
    draw: (m, lid, e) => (bb, x, y) => AD.drawAdelinaPortrait(bb, x, y, {mouth: m, lid, look: -1, brow: brows[e], phone: 'none'}),
    mouthBox: [26, 54, 30, 24], eyeBox: [32, 38, 34, 16],
  });
  label(b, 'THE PHONE  throne on / off', 250, 16, PAL.W5);
  crop(b, (bb, x, y) => AD.drawAdelinaPortrait(bb, x, y, {mouth: 'O', lid: 0, look: 0, brow: 'brisk', phone: 'ear', throne: true}), 26, 24, 76, 84, 250, 26);
  crop(b, (bb, x, y) => AD.drawAdelinaPortrait(bb, x, y, {mouth: 'rest', lid: 0, look: -1, brow: 'level', phone: 'ear', throne: false}), 26, 24, 76, 84, 332, 26);
  AD.drawThroneHandset(b, 418, 34, {size: 'lg', throne: true});
  floor(b, 252, 250, W);
  label(b, 'ROOM  down/reach/phone+throne/phone/sil', 250, 120, PAL.W5);
  const ps: Array<[AD.AdelinaArm, AD.AdelinaRoomPose['mouth'], AD.AdelinaLight, boolean]> = [['down', 'smile', 'room', false], ['reach', 'rest', 'room', true], ['phone', 'open', 'room', true], ['phone', 'rest', 'room', false], ['down', 'rest', 'sil', false]];
  ps.forEach(([arm, mouth, light, throne], i) => AD.drawAdelinaRoom(b, 270 + i * 44, 252, {arm, mouth, blink: false, light, throne}));
};

// ------------------------------------------------------------------ ALYI
const sheetAlyi = (b: Buf) => {
  title(b, 'ALYI', 'step four... will reveal itself.', PAL.W6);
  portraitBlock(b, {
    name: 'ALYI', accent: PAL.W6, hero: ['rest', 0, 0], exprNames: ['open', 'closed', 'tokens'],
    draw: (m, lid, e) => (bb, x, y) => {
      const eyes = e === 1 || lid === 2 ? 'closed' : e === 2 ? 'tokens' : 'open';
      rect(x, y, 112, 136, bb.ink(PAL.W0));
      blitImg(bb, AL.alyiSpeakPortrait({mouth: m, eyes, t: 3}), x, y);
    },
    mouthBox: [28, 62, 30, 24], eyeBox: [32, 40, 36, 16],
  });
  label(b, 'REFLECTION  there / gone (2 frames)', 250, 16, PAL.W6);
  AL.drawAlyiWindow(b, 250, 26, 108, 100, {mouth: 'E', eyes: 'open', t: 0});
  AL.drawAlyiWindow(b, 364, 26, 108, 100, {mouth: 'rest', eyes: 'open', t: 0}, {flicker: 'gone'});
  label(b, 'CALL TILE (a doorway) / mini / stand', 250, 132, PAL.W6);
  AL.drawAlyiTile(b, 250, 142, 104, 60, {mouth: 'O', eyes: 'open', t: 0}); tileFrame(b, 250, 142, 104, 60); tileLabel(b, 250, 142, 60, 'ALYI');
  AL.drawAlyiMini(b, 250, 212, MINI_W, MINI_H); miniFrame(b, 250, 212, MINI_W, MINI_H);
  floor(b, 252, 364, W);
  AL.drawAlyiStand(b, 384, 252, {mouth: 'rest', lid: 0, arms: 'down', light: 'door'});
  AL.drawAlyiStand(b, 420, 252, {mouth: 'open', lid: 0, arms: 'clasp', light: 'room'});
  AL.drawAlyiStand(b, 456, 252, {mouth: 'rest', lid: 0, arms: 'down', light: 'sil'});
};

// ------------------------------------------------------------------ GERG
const sheetGerg = (b: Buf) => {
  title(b, 'GERG MOCKBRAN', 'one sec. compiling.', PAL.L3);
  portraitBlock(b, {
    name: 'GERG MOCKBRAN', accent: PAL.L3, hero: ['E', 1, 1], exprNames: ['warm', 'green', 'shut'],
    draw: (m, lid, e) => (bb, x, y) => {
      rect(x, y, 112, 136, bb.ink(PAL.N1));
      blitImg(bb, e === 1 ? GE.gergGlow({mouth: m, lid: 1, look: 0}) : GE.gergSpeakPortrait({mouth: m, lid: e === 2 ? 2 : lid === 0 ? 1 : lid, look: 0}), x, y);
    },
    mouthBox: [28, 58, 30, 24], eyeBox: [32, 38, 36, 16],
  });
  label(b, 'CALL TILE  laptop open, typing, green glow', 250, 16, PAL.L3);
  GE.drawGergTile(b, 250, 27, TILE_W, TILE_H, {mouth: 'E', lid: 1, look: -1}, {f: 4}); tileFrame(b, 250, 27, TILE_W, TILE_H); tileLabel(b, 250, 27, TILE_H, 'GERG MOCKBRAN');
  GE.drawGergMini(b, 408, 27, MINI_W, MINI_H); miniFrame(b, 408, 27, MINI_W, MINI_H);
  label(b, 'gerg.ts keeps the table sprite + keycap popcorn.', 250, 124, PAL.N5);
  label(b, 'standing / walking gerg (sc 31) is not built.', 250, 136, PAL.N5);
};

// ------------------------------------------------------------------ MAS + GERG on their feet (new walkers)
const sheetWalkers = (b: Buf) => {
  title(b, 'MAS + GERG', 'on their feet (sc 27, 30, 31)', PAL.C7);
  label(b, 'MAS  stand / walk (4 on 3s)', 8, 18, PAL.C7);
  floor(b, 120);
  const ms: Array<[MS.MasStandLegs, MS.MasStandArm, boolean, MS.MasStandLight]> = [['stand', 'down', false, 'room'], ['w0', 'down', false, 'room'], ['w1', 'down', false, 'room'], ['w2', 'down', false, 'room'], ['w3', 'down', false, 'room']];
  ms.forEach(([legs, arm, guest, light], i) => MS.drawMasStand(b, 24 + i * 34, 120, {legs, arm, mouth: 'rest', blink: false, guest, light}));
  label(b, 'reach / pocket / GUEST / monitor / sil', 200, 18, PAL.C7);
  const ms2: Array<[MS.MasStandLegs, MS.MasStandArm, boolean, MS.MasStandLight]> = [['stand', 'reach', false, 'room'], ['stand', 'pocket', false, 'room'], ['w1', 'down', true, 'room'], ['stand', 'down', false, 'monitor'], ['stand', 'down', false, 'sil']];
  ms2.forEach(([legs, arm, guest, light], i) => MS.drawMasStand(b, 214 + i * 40, 120, {legs, arm, mouth: i === 0 ? 'open' : 'rest', blink: false, guest, light}));
  label(b, 'GERG  walking, typing on the open laptop (3 hand drawings) / stops, looks up / sil', 8, 140, PAL.L3);
  floor(b, 250);
  const gs: Array<[GS.GergStandLegs, 0 | 1 | 2, 'screen' | 'up', 'room' | 'sil']> = [['w0', 0, 'screen', 'room'], ['w1', 1, 'screen', 'room'], ['w2', 2, 'screen', 'room'], ['w3', 1, 'screen', 'room'], ['stand', 0, 'up', 'room'], ['stand', 0, 'screen', 'sil']];
  gs.forEach(([legs, type, look, light], i) => GS.drawGergStand(b, 24 + i * 40, 250, {legs, type, look, mouth: i === 4 ? 'open' : 'rest', light}));
  // Terb + Mas: the pin pull staged at scale
  label(b, 'sc 30: the pin', 290, 150, PAL.R3);
  TE.drawTerbRoom(b, 330, 250, {legs: 'stand', arm: 'carry', helmet: true, mouth: 'rest', blink: false, light: 'fire', pin: true});
  MS.drawMasStand(b, 372, 250, {legs: 'stand', arm: 'reach', mouth: 'rest', blink: false, guest: false, light: 'room'}, {flip: true});
  TE.drawTerbRoom(b, 420, 250, {legs: 'stand', arm: 'carry', helmet: true, mouth: 'rest', blink: false, light: 'fire', pin: false});
  MS.drawMasStand(b, 458, 250, {legs: 'w2', arm: 'pocket', mouth: 'rest', blink: false, guest: false, light: 'room'});
};

// ------------------------------------------------------------------ lineup
const lineup = (b: Buf) => {
  title(b, 'LINEUP', 'room scale on one floor (mario for scale)', PAL.C7);
  floor(b, 196);
  let x = 8;
  const put = (w: number, draw: (fx: number) => void, name: string) => { const fx = x + Math.floor(w / 2); draw(fx); label(b, name, fx - Math.floor(textWidth(name) / 2), 202, PAL.N6); x += w + 13; };
  put(22, (fx) => MS.drawMasStand(b, fx, 196, MS.MAS_STAND_DEFAULT), 'MAS');
  put(30, (fx) => blitImg(b, marioImg(MARIO_BASE), fx - MARIO_FOOT[0], 196 - MARIO_FOOT[1]), 'MARIO');
  put(26, (fx) => NE.drawNelehRoom(b, fx, 196, {arm: 'paper', mouth: 'rest', blink: false, light: 'room'}), 'NELEH');
  put(34, (fx) => MA.drawMadaSeated(b, fx, 196, {lid: 0, mouth: 'rest', nod: 0, light: 'room'}, {spin: 2}), 'MADA');
  put(28, (fx) => TT.drawTtemmeRoom(b, fx, 196, {arm: 'hold', mouth: 'rest', blink: false, light: 'room'}, {hourglass: {sand: 0.3}}), 'TTEMME');
  put(30, (fx) => TE.drawTerbRoom(b, fx, 196, {legs: 'stand', arm: 'carry', helmet: true, mouth: 'rest', blink: false, light: 'room', pin: true}), 'TERB');
  put(30, (fx) => QV.drawQuietVoteLaptop(b, fx, 196), 'QUIET V.');
  put(26, (fx) => TA.drawTasyaRoom(b, fx, 196, {arm: 'clasp', mouth: 'smile', blink: false, light: 'room'}), 'TASYA');
  put(28, (fx) => AD.drawAdelinaRoom(b, fx, 196, {arm: 'reach', mouth: 'rest', blink: false, light: 'room', throne: true}), 'ADELINA');
  put(22, (fx) => AL.drawAlyiStand(b, fx, 196, {mouth: 'rest', lid: 0, arms: 'down', light: 'room'}), 'ALYI');
  put(22, (fx) => GS.drawGergStand(b, fx, 196, GS.GERG_STAND_DEFAULT), 'GERG');
  label(b, 'MINI TILES  alyi neleh mada quiet-vote rima ttemme terb gerg', 16, 220, PAL.C7);
  const minis: Array<(bb: Buf, xx: number, yy: number) => void> = [AL.drawAlyiMini, NE.drawNelehMini, MA.drawMadaMini, QV.drawQuietVoteMini, RI.drawRimaMini, TT.drawTtemmeMini, TE.drawTerbMini, GE.drawGergMini].map((fn) => (bb: Buf, xx: number, yy: number) => fn(bb, xx, yy));
  minis.forEach((m, i) => { const mx = 16 + i * (MINI_W + 5); m(b, mx, 234); miniFrame(b, mx, 234, MINI_W, MINI_H); });
};

// ------------------------------------------------------------------ name cards
const CARDS: Array<{name: string; line: string; stat: string; accent: number; portrait: Draw}> = [
  {name: 'NELEH', line: 'READ THE CHARTER. LITERALLY.', stat: 'FOOTNOTES: (infinity glyph)', accent: PAL.W7, portrait: (b, x, y) => NE.drawNelehPortrait(b, x, y, NE.NELEH_PORTRAIT_DEFAULT, {orbit: 9})},
  {name: 'RIMA TAMURI', line: 'CEO (WEEKEND EDITION)', stat: 'HEARTS SENT: 0', accent: PAL.P2, portrait: (b, x, y) => RI.drawRimaSpeakPortrait(b, x, y, {mouth: 'smile', lid: 0, brow: 'level', hand: 'smooth0'})},
  {name: 'ADELINA', line: 'IN PLAIN ENGLISH:', stat: 'TRANSLATES DOOM INTO REVENUE', accent: PAL.W5, portrait: (b, x, y) => AD.drawAdelinaPortrait(b, x, y, {mouth: 'rest', lid: 0, look: -1, brow: 'brisk', phone: 'ear', throne: true})},
  {name: 'TTEMME', line: 'CEO (72 HOURS).', stat: 'TIME LEFT: 72:00:00', accent: PAL.U5, portrait: (b, x, y) => TT.drawTtemmePortrait(b, x, y, {mouth: 'rest', lid: 0, look: 0, brow: 'hype', gaze: 'cam'}, {sand: 0, chat: 4})},
  {name: 'MADA', line: 'LAST FIRER STANDING', stat: 'ANSWERS GIVEN: 0', accent: PAL.G6, portrait: (b, x, y) => MA.drawMadaPortrait(b, x, y, MA.MADA_PORTRAIT_DEFAULT, {spin: 5})},
  {name: 'TERB', line: 'CHAIRS BOARDS ON FIRE', stat: 'EXTINGUISHERS: 1', accent: PAL.R3, portrait: (b, x, y) => TE.drawTerbPortrait(b, x, y, TE.TERB_PORTRAIT_DEFAULT)},
];
/** One card per view (a card is ~300 px wide): cards:0..5 in script order. */
const cards = (b: Buf, i: number) => {
  const c = CARDS[Math.max(0, Math.min(CARDS.length - 1, i))];
  title(b, 'NAME CARD', c.name.toLowerCase(), c.accent);
  // a dim stand-in for the frozen frame behind the card
  for (let y = 14; y < H; y++) for (let x = 0; x < W; x++) if (((x >> 3) + (y >> 3)) % 2 === 0) b.set(x, y, PAL.N2);
  nameCard(b, {x: 12, y: 22, name: c.name, line: c.line, accent: c.accent, k: 30, portrait: (bb, px, py) => c.portrait(bb, px, py)});
  const sx = 12 + 122;
  rect(sx - 5, 22 + 58, textWidth(c.stat) + 10, 13, b.ink(PAL.N0));
  text(b, c.stat, sx, 22 + 61, PAL.N6);
  label(b, 'stat line drawn plain: the card builder owns the stat style.', 12, 250, PAL.N5);
  if (c.name === 'NELEH') label(b, 'FOOTNOTES: the infinity glyph is not in the 7px face (card builder: add it).', 12, 260, PAL.N5);
};

// ------------------------------------------------------------------ the call grids (full colour)
const drawTile = (b: Buf, id: string, name: string, x: number, y: number, w: number, h: number, f: number, vote: VoteState) => {
  const clip = (px: number, py: number) => px >= x && py >= y && px < x + w && py < y + h;
  if (id === 'mas') { vegasBg(b, x, y, w, h, f); blitImg(b, masPortrait({mouth: 'rest', lid: 0, look: -1, brow: 0, light: 'monitor'}), x - 6, y - 12, {clip}); }
  if (id === 'alyi') AL.drawAlyiTile(b, x, y, w, h, {mouth: f % 8 < 4 ? 'O' : 'E', eyes: 'open', t: 0});
  if (id === 'neleh') NE.drawNelehTile(b, x, y, w, h, {mouth: 'rest', lid: 0, brow: 'level'}, {orbit: f});
  if (id === 'mada') MA.drawMadaTile(b, x, y, w, h, {mouth: 'rest', lid: 0, nod: 0}, {spin: f});
  if (id === 'off') QV.drawQuietVoteTile(b, x, y, w, h);
  if (id === 'rima') RI.drawRimaTile(b, x, y, w, h, {mouth: 'rest', lid: 0}, {spot: 1});
  tileFrame(b, x, y, w, h);
  if (id !== 'off') tileLabel(b, x, y, h, name);
  if (id !== 'mas') tileVote(b, x, y, w, id === 'rima' ? 'back' : vote);
};
const chrome = (b: Buf) => {
  rect(0, 0, W, H, b.ink(PAL.N1));
  rect(0, 0, W, 11, b.ink(PAL.N2)); rect(0, 11, W, 1, b.ink(PAL.N0));
  text(b, 'board sync', 14, 2, PAL.N6);
};
const callgrid = (b: Buf, f: number) => {
  chrome(b);
  const T = [['mas', 'MAS MANALT', 10, 17], ['alyi', 'ALYI', 165, 17], ['neleh', 'NELEH', 320, 17], ['mada', 'MADA', 88, 108], ['off', '', 243, 108]] as const;
  for (const [id, name, x, y] of T) drawTile(b, id, name, x, y, TILE_W, TILE_H, f, 'flip');
  speakRing(b, 165, 17, TILE_W, TILE_H);
  text(b, 'sc 26 test: the act-4 tiles in the salvaged five-tile grid (full colour, clock blanked, no FIRED.)', 10, 204, PAL.N5);
  text(b, 'mas tile = the salvage (dev/mfinale/callart vegasBg + cast/mas). alyi: mouth moving, no sound.', 10, 216, PAL.N5);
};
const boardgrid = (b: Buf, f: number) => {
  chrome(b);
  const T = [['alyi', 'ALYI', 10, 17], ['neleh', 'NELEH', 165, 17], ['mada', 'MADA', 320, 17], ['off', '', 88, 108], ['rima', 'RIMA TAMURI', 243, 108]] as const;
  for (const [id, name, x, y] of T) drawTile(b, id, name, x, y, TILE_W, TILE_H, f, 'flip');
  text(b, 'sc 27 test: the board\'s grid, and the new tile the spotlight finds', 10, 204, PAL.N5);
};

// ------------------------------------------------------------------ the motion test (8 s)
export const MOTION_FRAMES = 192;
const motion = (b: Buf, f: number) => {
  rect(0, 0, W, H, b.ink(PAL.N1));
  const say = (t0: number, s: string, cps = 0.6) => visemeAt(f, t0, s, cps);
  const nl = f < 96 ? 'Step four.' : 'Footnote three.';
  NE.drawNelehPortrait(b, 4, 4, {mouth: say(f < 96 ? 10 : 110, nl), lid: blinkSched(f, [40, 150]), look: -1, brow: f >= 96 && f < 140 ? 'query' : 'level'}, {orbit: f});
  const asked = f >= 20 && f < 120;
  const nod = f >= 130 && f < 134 ? 1 : f >= 134 && f < 140 ? 2 : f >= 140 && f < 144 ? 1 : 0;
  MA.drawMadaPortrait(b, 122, 4, {mouth: say(60, 'Good question.'), lid: blinkSched(f, [30, 170]), look: 0, nod: nod as 0 | 1 | 2}, {spin: asked ? f : f >= 120 ? 119 : null, stopped: f >= 120});
  TT.drawTtemmePortrait(b, 240, 4, {mouth: say(8, 'Chat. I\'m the CEO now.'), lid: blinkSched(f, [70, 160]), look: 0, brow: f < 60 ? 'hype' : 'unsure', gaze: f < 100 ? 'cam' : 'sand'}, {sand: Math.min(1, f / 400), stream: true, chat: f, f});
  const tb = f < 100 ? say(20, 'Which room is on fire?') : say(130, '...Ah.');
  TE.drawTerbPortrait(b, 358, 4, {mouth: tb, lid: blinkSched(f, [90]), look: -1, brow: f >= 120 ? 'ah' : 'level', helmet: f >= 12}, {f});
  // room strip
  floor(b, 258, 0, W);
  rect(56, 170, 2, 88, b.ink(PAL.D2)); rect(58, 170, 1, 88, b.ink(PAL.D3));
  const tx = Math.min(110, -20 + Math.floor(f / 3) * 3);
  TE.drawTerbRoom(b, tx, 258, {legs: tx < 110 ? TE.terbWalkAt(f) : 'stand', arm: f > 150 ? 'spray' : 'carry', helmet: tx >= 58, mouth: 'rest', blink: false, light: 'fire', pin: f < 140});
  if (f > 150) TE.drawSpray(b, tx - TE.TERB_FOOT[0] + TE.TERB_HORN[0], 258 - TE.TERB_FOOT[1] + TE.TERB_HORN[1], 1, f - 150, {len: 26});
  MA.drawMadaSeated(b, 234, 258, {lid: 0, mouth: 'rest', nod: nod ? 1 : 0, light: 'room'}, {flip: true, spin: asked ? f : 119, stopped: !asked});
  const hs: TT.HourglassState = f < 40 ? {sand: 1} : f < 52 ? TT.hourglassFlipAt(f, 40) : f < 170 ? {sand: Math.min(0.999, (f - 52) / 118), stream: true} : {sand: 1, shatter: f - 170};
  TT.drawTtemmeRoom(b, 290, 258, {arm: f >= 40 && f < 52 ? 'set' : 'hold', mouth: 'rest', blink: false, light: 'room'}, {hourglass: hs, f});
  TT.drawHourglass(b, 316, 166, hs, {f});
  NE.drawNelehRoom(b, 372, 258, {arm: f % 24 < 12 ? 'write0' : 'write1', mouth: 'rest', blink: false, light: 'room'});
  NE.drawFootnotes(b, NE.roomOrbit(372, 258), f, 'all');
  AL.drawAlyiWindow(b, 404, 150, 72, 104, {mouth: f >= 60 && f < 100 ? say(60, 'The company will tell us.') : 'rest', eyes: 'open', t: 0}, {flicker: f === 100 || f === 101 ? 'gone' : 'there', dx: 0, dy: 30});
  text(b, 'act 4 cast motion test  f ' + f, 4, 262, PAL.N5);
};

export const renderView = (id: string): Buf => {
  const [kind, arg] = id.split(':');
  const b = new Buf(W, H, PAL.N1);
  if (kind === 'lab') return labView(id);
  if (kind === 'sheet') {
    const S: Record<string, (b: Buf) => void> = {walkers: sheetWalkers, neleh: sheetNeleh, mada: sheetMada, ttemme: sheetTtemme, terb: sheetTerb, quietvote: sheetQuietVote, rima: sheetRima, tasya: sheetTasya, adelina: sheetAdelina, alyi: sheetAlyi, gerg: sheetGerg};
    S[arg]?.(b);
    return b;
  }
  if (kind === 'lineup') { lineup(b); return b; }
  if (kind === 'cards') { cards(b, Number(arg) || 0); return b; }
  if (kind === 'card') { cards(b, Number(arg) || 0); return b; }
  if (kind === 'callgrid') { callgrid(b, Number(arg) || 12); return b; }
  if (kind === 'boardgrid') { boardgrid(b, Number(arg) || 12); return b; }
  if (kind === 'motion') { motion(b, Number(arg) || 0); return b; }
  text(b, 'unknown view ' + id, 8, 8, PAL.R3);
  return b;
};
