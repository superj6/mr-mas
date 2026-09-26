// MR. MAS — Ep1 act 4: the MEDIUM / TWO-SHOT tier sheets (owned by the act-4 medium-tier artist). Pure pixel code:
// every view returns a native 480x270 buffer and renders identically in Node (tools/lab.ts) and Remotion.
//   sheet:<mas|mada|neleh|gerg|orb>        the rigs (heads, arms, mouths, lids, lights)
//   plate:<dark|board>                      the two medium plates, empty ([W]) and in their states
//   shot:<id>[@frame]                       every board shot this tier builds, in the 480x203 room area + a rail stand-in
//   contact                                 all the shots at a glance
//   zoom:<k>:<x>:<y>:<w>:<h>:<view>         dev inspection (nearest blow-up of a native region)
//   cast:<view>                             pass-through to the cast sheet (the TERB sheet re-render)
import {Buf, rect} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {text, textWidth} from '../../../../shared/pixel/font';
import {renderView as castView} from '../cast/sheet';
import * as MM from '../../../../shared/pixel/cast/mas-medium';
import * as OM from '../../../../shared/pixel/cast/orb-medium';
import * as MD from '../../../../shared/pixel/cast/mada-medium';
import * as NM from '../../../../shared/pixel/cast/neleh-medium';
import * as GM from '../../../../shared/pixel/cast/gerg-medium';
import * as DP from '../../../../shared/pixel/rooms/darkroom-plate';
import * as BP from '../../../../shared/pixel/rooms/boardroom-plate';
import * as TS from '../../../../shared/pixel/rooms/twoshots';
import {VISEMES} from '../../../../shared/pixel/cast/talk';

const W = 480, H = 270, RH = 203;

// ------------------------------------------------------------------ sheet furniture
const title = (b: Buf, name: string, sub: string, accent: number) => {
  const head = 'MR. MAS  EP1 ACT 4  MEDIUM';
  text(b, head, 6, 3, PAL.N5);
  const nx = 6 + textWidth(head) + 10;
  text(b, name, nx, 3, accent);
  // the subtitle right-aligned; if it would run into the name, it is trimmed from the left (never overlaps)
  let sb = sub;
  while (sb.length && W - 6 - textWidth(sb) < nx + textWidth(name) + 12) sb = sb.slice(sb.indexOf(' ') + 1 || sb.length);
  if (sb) text(b, sb, W - 6 - textWidth(sb), 3, PAL.N4);
  rect(0, 13, W, 1, b.ink(PAL.N2));
};
const label = (b: Buf, s: string, x: number, y: number, col: number = PAL.N5) => text(b, s, x, y, col);
/** a dark table / desk band for rig tests: the far edge at row y */
const testDesk = (b: Buf, x: number, y: number, w: number, h: number) => {
  rect(x, y, w, h, b.ink(PAL.D1)); rect(x, y, w, 1, b.ink(PAL.C2)); rect(x, y + 1, w, 1, b.ink(PAL.D2));
};
/** the rail band stand-in (rows 203..269 belong to the rail builder) with the shot's id and tag */
const rail = (b: Buf, id: string, tag: string, note: string) => {
  rect(0, RH, W, H - RH, b.ink(PAL.N0));
  rect(0, RH, W, 1, b.ink(PAL.N2));
  text(b, id, 8, RH + 9, PAL.C6);
  text(b, tag, 8 + textWidth(id) + 8, RH + 9, PAL.W6);
  text(b, note, 8, RH + 24, PAL.N5);
  text(b, 'rail band: stand-in', W - 8 - textWidth('rail band: stand-in'), H - 12, PAL.N3);
};

// ------------------------------------------------------------------ MAS
const sheetMas = (b: Buf) => {
  title(b, 'MAS', 'waist-up  head 36  3 heads  4 arms + down  3 lights', PAL.C6);
  const at = (x: number, y: number, s: Partial<MM.MasMediumState>, flip = false) => {
    MM.drawMasMedium(b, x, y, {...MM.MAS_MEDIUM_DEFAULT, ...s}, {flip, desk: (bb) => testDesk(bb, x - 2, y + MM.MAS_M_DESK, MM.MAS_MW + 4, MM.MAS_MH - MM.MAS_M_DESK)});
  };
  at(0, 16, {});
  at(80, 16, {head: 'down', arm: 'tally'});
  at(160, 16, {arm: 'phone'});
  at(240, 16, {head: 'front', look: 1, mouth: 'M'});
  at(320, 16, {arm: 'clasp', light: 'board'}, true);
  at(400, 16, {head: 'down', arm: 'down', light: 'warm'});
  ["'34' rest", "'down' tally", "'34' phone", "'front' M look>", 'flip clasp board', "down arm 'warm'"].forEach((t, i) => label(b, t, 4 + i * 80, 130));
  // the six mouths + the lids at the 34 head (crops)
  label(b, 'MOUTHS', 6, 146, PAL.C6);
  VISEMES.forEach((v, i) => {
    const img = MM.masMediumBack({...MM.MAS_MEDIUM_DEFAULT, mouth: v});
    for (let j = 0; j < 30; j++) for (let k = 0; k < 30; k++) { const c = img.c[(16 + j) * img.w + 24 + k]; b.set(6 + i * 36 + k, 158 + j, c >= 0 ? c : PAL.N1); }
    label(b, v, 8 + i * 36, 192);
  });
  label(b, "LIDS 0 1 2 (no blink on screen)  ·  'front' lids", 230, 146, PAL.C6);
  ([0, 1, 2] as const).forEach((l, i) => {
    const img = MM.masMediumBack({...MM.MAS_MEDIUM_DEFAULT, lid: l, head: i === 2 ? 'front' : '34'});
    for (let j = 0; j < 30; j++) for (let k = 0; k < 30; k++) { const c = img.c[(16 + j) * img.w + 24 + k]; b.set(230 + i * 36 + k, 158 + j, c >= 0 ? c : PAL.N1); }
  });
  label(b, 'the one-pixel smile stays one pixel', 230, 196, PAL.N4);
  label(b, 'HANDS: medium-kit handParts / sleeveParts (lit by the rig)', 6, 214, PAL.N4);
  label(b, 'tally: the thumb tip = MAS_M_HAND.tally.R (mark 3); marks 1 + 2 never touched', 6, 226, PAL.N4);
  label(b, 'draw: back -> plate desk -> front (forearms, hands)', 6, 238, PAL.N4);
};

// ------------------------------------------------------------------ THE ORB
const sheetOrb = (b: Buf) => {
  title(b, 'THE ORB', 'a sphere and an iris  r 12  whole-pixel steps', PAL.C7);
  const L = DP.DPLATE_LOOK;
  const row = (y: number, name: string, looks: Array<[string, [number, number]]>, ap = 0.5, scan = false) => {
    label(b, name, 6, y - 4, PAL.C6);
    looks.forEach(([t, l], i) => {
      rect(6 + i * 58, y + 4, 54, 40, b.ink(PAL.N0));
      OM.drawOrb(b, 33 + i * 58, y + 24, OM.ORB_MR, {look: l, aperture: ap, scanning: scan, monitor: -1});
      label(b, t, 8 + i * 58, y + 46, PAL.N5);
    });
  };
  row(22, '26A.02 THE ORB COUNTS: mark 1 -> 2 -> 3 (his thumb), one per beat', [['mark 1', L.mark1], ['mark 2', L.mark2], ['mark 3', L.mark3], ['thumb', L.thumb], ['face', L.face], ['lens', L.lens]]);
  row(90, "29.04: on the phone (the taps) -> the GUEST lanyard on beat 3, held · the check tray · the door", [['phone', L.phone], ['lanyard', L.lanyard], ['glass', L.glass], ['grid', L.grid], ['tray', L.tray], ['door', L.door]]);
  row(158, 'aperture 0 .. 1 · scanning (the lens fires)', [['ap 0', L.lens], ['ap .5', L.lens], ['ap 1', L.lens], ['scan', L.lens], ['scan 3/4', [-0.5, 0.2]], ['ap .5 3/4', [-0.5, 0.2]]]);
  // redraw the aperture row with its own apertures
  const aps: Array<[number, boolean]> = [[0, false], [0.5, false], [1, false], [0.6, true], [0.6, true], [0.5, false]];
  const lk: Array<[number, number]> = [L.lens, L.lens, L.lens, L.lens, [-0.5, 0.2], [-0.5, 0.2]];
  aps.forEach(([a, sc], i) => { rect(6 + i * 58, 162, 54, 40, b.ink(PAL.N0)); OM.drawOrb(b, 33 + i * 58, 182, OM.ORB_MR, {look: lk[i], aperture: a, scanning: sc, monitor: -1}); });
  label(b, 'orbStep(): one look per beat (15 f), an in-between frame at half the angle, held; never a sweep', 6, 226, PAL.N4);
  label(b, 'orbBob(f, still): 1 px float on a slow hold; still = the MAS\'S VERSION stillness flag', 6, 238, PAL.N4);
  label(b, 'it reacts to objects and faces, never to the V.O.', 6, 250, PAL.N4);
};

// ------------------------------------------------------------------ MADA
const sheetMada = (b: Buf) => {
  title(b, 'MADA', 'waist-up  seated, the bolted chair  3 heads  4 arms  the spinner', PAL.G6);
  const at = (x: number, y: number, s: Partial<MD.MadaMediumState>, spin: number | null = 0, flip = false, stopped = false) => {
    MD.drawMadaMedium(b, x, y, {...MD.MADA_MEDIUM_DEFAULT, ...s}, {flip, spin, stopped, table: (bb) => testDesk(bb, x - 2, y + MD.MADA_M_TABLE, MD.MADA_MW + 4, MD.MADA_MH - MD.MADA_M_TABLE)});
  };
  at(2, 22, {});
  at(82, 22, {head: '34', look: -1});
  at(162, 22, {head: 'down', arm: 'rest'}, null);
  at(242, 22, {arm: 'clasp', head: '34', look: -1, mouth: 'A'}, 9);
  at(322, 22, {arm: 'take', head: '34', nod: 2, light: 'fire'}, 0, false, true);
  at(402, 22, {mouth: 'smile', lid: 1}, 0);
  ['front fold', "'34' fold", "'down' rest", 'clasp A', 'take nod2 fire', 'the tell, lid1'].forEach((t, i) => label(b, t, 6 + i * 80, 130));
  label(b, 'MOUTHS', 6, 146, PAL.G6);
  VISEMES.forEach((v, i) => {
    const img = MD.madaMediumBack({...MD.MADA_MEDIUM_DEFAULT, mouth: v});
    for (let j = 0; j < 28; j++) for (let k = 0; k < 28; k++) { const c = img.c[(22 + j) * img.w + 24 + k]; b.set(6 + i * 34 + k, 158 + j, c >= 0 ? c : PAL.N1); }
    label(b, v, 8 + i * 34, 190);
  });
  label(b, 'THE NOD 0 1 2 1 0 (on 2s) · lids 0 1 2', 222, 146, PAL.G6);
  ([[0, 0], [1, 0], [2, 0], [0, 1], [0, 2]] as const).forEach(([n, l], i) => {
    const img = MD.madaMediumBack({...MD.MADA_MEDIUM_DEFAULT, nod: n, lid: l});
    for (let j = 0; j < 30; j++) for (let k = 0; k < 28; k++) { const c = img.c[(20 + j) * img.w + 24 + k]; b.set(222 + i * 34 + k, 158 + j, c >= 0 ? c : PAL.N1); }
  });
  label(b, 'spinner: md, grey; STOP = freeze f + stopped (dims a rung); blue (27) spinCol', 6, 214, PAL.N4);
  label(b, 'brows straight, level, low: they never move. The tell (one pixel, one corner): once', 6, 226, PAL.N4);
  label(b, 'draw: back -> plate table -> front (forearms) -> spinner (UI over the world)', 6, 238, PAL.N4);
};

// ------------------------------------------------------------------ NELEH
const sheetNeleh = (b: Buf) => {
  title(b, 'NELEH', 'waist-up  standing  3 heads  4 arms  the paper glows', PAL.W7);
  const at = (x: number, y: number, s: Partial<NM.NelehMediumState>, flip = true) => {
    NM.drawNelehMedium(b, x, y, {...NM.NELEH_MEDIUM_DEFAULT, ...s}, {flip, orbit: 8, table: (bb) => testDesk(bb, x - 2, y + NM.NELEH_M_TABLE, NM.NELEH_MW + 4, 22)});
  };
  at(4, 16, {}, false);
  at(82, 16, {arm: 'paper', brow: 'query'});
  at(160, 16, {head: 'down', arm: 'write', stroke: 1});
  at(238, 16, {head: 'front', arm: 'cap', mouth: 'O'});
  at(316, 16, {brow: 'worry', lid: 1, mouth: 'A'});
  at(394, 16, {head: 'down', arm: 'marker', light: 'dim', lid: 1});
  ['34 marker (authored)', 'flip paper query', 'down write', 'front cap O', 'worry A', 'dim, down'].forEach((t, i) => label(b, t, 4 + i * 78, 156));
  label(b, 'MOUTHS (flipped: she faces MADA)', 6, 170, PAL.W7);
  VISEMES.forEach((v, i) => {
    const img = NM.nelehMediumBack({...NM.NELEH_MEDIUM_DEFAULT, mouth: v});
    for (let j = 0; j < 26; j++) for (let k = 0; k < 26; k++) { const c = img.c[(14 + j) * img.w + 18 + k]; b.set(6 + i * 32 + k, 182 + j, c >= 0 ? c : PAL.N1); }
    label(b, v, 8 + i * 32, 212);
  });
  label(b, 'BROWS level / query / worry', 206, 170, PAL.W7);
  (['level', 'query', 'worry'] as const).forEach((br, i) => {
    const img = NM.nelehMediumBack({...NM.NELEH_MEDIUM_DEFAULT, brow: br});
    for (let j = 0; j < 26; j++) for (let k = 0; k < 26; k++) { const c = img.c[(14 + j) * img.w + 18 + k]; b.set(206 + i * 32 + k, 182 + j, c >= 0 ? c : PAL.N1); }
  });
  label(b, 'footnotes: neleh.ts drawFootnotes, sm, orbit nelehMediumOrbit(); scatter 0..1', 6, 230, PAL.N4);
  label(b, "write: the marker tip = nelehMediumTip() on the blueprint's step 4 (BPLATE_STEP4)", 6, 242, PAL.N4);
};

// ------------------------------------------------------------------ GERG
const sheetGerg = (b: Buf) => {
  title(b, 'GERG', 'call tile at medium scale  type / THE GLANCE / talk', PAL.L3);
  GM.drawGergMediumTile(b, 4, 18, 232, 124, {head: 'type'}, {f: 4});
  GM.drawGergMediumTile(b, 244, 18, 232, 124, {head: 'up', lid: 0}, {f: 4, typing: false});
  label(b, "'type' (typing, keycaps)", 6, 146); label(b, "'up' THE GLANCE into his camera (still, 1 beat)", 246, 146);
  const vis: Array<[string, Partial<GM.GergMediumState>]> = [['talk A', {head: 'talk', mouth: 'A'}], ['talk O', {head: 'talk', mouth: 'O'}], ['talk E', {head: 'talk', mouth: 'E'}], ['type lid2', {head: 'type', lid: 2}], ['up lid1', {head: 'up', lid: 1}], ['talk M', {head: 'talk', mouth: 'M'}]];
  vis.forEach(([t, st], i) => { GM.drawGergMediumTile(b, 4 + i * 79, 158, 76, 92, st, {f: 0, typing: false, cx: 0.5}); label(b, t, 6 + i * 79, 254); });
};

// ------------------------------------------------------------------ the plates
const plateDark = (b: Buf) => {
  title(b, 'DARK-ROOM DESK PLATE', 'empty = [W]  the cyan cone, the rack', PAL.C6);
  const small = (x: number, y: number, o: DP.DarkPlateOpts, t: string, f = 0) => {
    const tmp = new Buf(480, 203, PAL.N0);
    DP.drawDarkPlate(tmp, f, o); DP.drawDarkPlateDesk(tmp, f, o); DP.drawDarkPlateFront(tmp, f, o);
    // a half-size contact (every other pixel: a preview thumbnail only, never art)
    for (let j = 0; j < 101; j++) for (let i = 0; i < 240; i++) b.set(x + i, y + j, tmp.get(i * 2, j * 2));
    label(b, t, x + 2, y + 103);
  };
  small(0, 16, {tally: 3, lanyard: true, phone: 'down', boardGrid: true}, '29.01: tally 3, GUEST, phone down, grid');
  small(240, 16, {tally: 2, phone: 'none', glass: true}, '26A: the two old marks (before the carve)');
  small(0, 130, {tally: 3, lanyard: true, door: 2, dim: 1}, '29.12: the door, held step 2 of 3 (dim 1)');
  small(240, 130, {tally: 3, lanyard: true, tray: 3}, '29.08: the check tray out, position 3 of 4');
  label(b, 'thumbnails at half size (sheet preview only)', 300, 258, PAL.N3);
};
const plateBoard = (b: Buf) => {
  title(b, 'BOARDROOM TABLE PLATE', 'empty = [W]  the pendant key', PAL.W6);
  const small = (x: number, y: number, o: BP.BoardPlateOpts, t: string, f = 6) => {
    const tmp = new Buf(480, 203, PAL.N0);
    BP.drawBoardPlate(tmp, f, o); BP.drawBoardPlateTable(tmp, f, o); BP.drawBoardPlateFront(tmp, f, o);
    for (let j = 0; j < 101; j++) for (let i = 0; i < 240; i++) b.set(x + i, y + j, tmp.get(i * 2, j * 2));
    label(b, t, x + 2, y + 103);
  };
  small(0, 16, {laptop: true, blueprint: 0, rolodex: true, phones: {lit: true, buzz: true}, plates: [{name: 'NELEH', x: 86}, {name: 'ALYI', x: 280}]}, '27.11: blueprint, phones buzzing, laptop');
  small(240, 16, {laptop: true, blueprint: 3, slate: true, door: 5, plates: [{name: 'NELEH', x: 104}]}, '27.32: slate wall, the door open, ? on step 4');
  small(0, 130, {fires: TS.FIRES_M, plates: [{name: 'ALYI', x: 104, fire: true}], rolodex: 'still'}, '30.09: fires: chair, table, nameplate');
  small(240, 130, {fires: TS.FIRES_CALMOFF(0), termSheet: 'stamped', terbHand: 'hand', keycaps: 12, rolodex: 'still'}, '30.17: fire out, keycaps, the term sheet', 14);
  label(b, 'thumbnails at half size (sheet preview only)', 300, 258, PAL.N3);
};

// ------------------------------------------------------------------ the shots (each a full-size frame)
type Shot = {tag: string; note: string; draw: (b: Buf, f: number) => void};
const SHOTS: Record<string, Shot> = {
  '26A.02': {tag: '[2S]', note: 'the Orb counts: mark 1, 2, 3 (his thumb), one per beat. His thumb on mark 3 only.', draw: (b, f) => TS.drawDark2S(b, f, {mas: {head: 'down', arm: 'tally'}, orb: {look: TS.orbTally(f, 0)}, plate: {tally: 3, lanyard: false, phone: 'none'}})},
  '29.01': {tag: '[2S]', note: 'the GUEST lanyard laid square beside the glass; his hand rests on his phone.', draw: (b, f) => TS.drawDark2S(b, f, {mas: {arm: 'phone'}, orb: {look: DP.DPLATE_LOOK.phone}, plate: {tally: 3, lanyard: true, phone: 'down', boardGrid: true}})},
  '29.04': {tag: '[2S]', note: 'the iris follows the taps; on beat 3 it steps onto the GUEST lanyard and holds.', draw: (b, f) => TS.drawDark2S(b, f, {mas: {arm: 'phone', head: 'down'}, orb: {look: TS.orbToLanyard(f, 0)}, plate: {tally: 3, lanyard: true, phone: 'up', boardGrid: true}})},
  '29.10a': {tag: '[2S]', note: '"mostly." aloud, to the Orb (head front, eyes to it). The Orb holds on the lanyard.', draw: (b, f) => TS.drawDark2S(b, f, {mas: {head: 'front', look: 1, mouth: 'O', arm: 'phone'}, orb: {look: DP.DPLATE_LOOK.lanyard}, plate: {tally: 3, lanyard: true, phone: 'up', boardGrid: true}})},
  '29.08': {tag: '[2S]', note: 'DELIVERY: the check ejects tray-first across the desk. Pure record: nothing of his.', draw: (b, f) => TS.drawDark2S(b, f, {mas: {arm: 'rest'}, orb: {look: DP.DPLATE_LOOK.face}, plate: {tally: 3, lanyard: true, phone: 'up', tray: 4}})},
  '29.12': {tag: '[2S]', note: 'the back wall: on "asked" the slate door takes its first held step (3 in all).', draw: (b, f) => TS.drawDark2S(b, f, {mas: {arm: 'rest'}, orb: {look: DP.DPLATE_LOOK.face}, plate: {tally: 3, lanyard: true, phone: 'up', door: 2, dim: 1}})},
  '27.11': {tag: '[2S]', note: 'NELEH standing with the marker, MADA seated, spinner; ALYI in the glass; phones buzz.', draw: (b, f) => TS.drawBoard2S(b, f, {neleh: {arm: 'marker'}, mada: {}, plate: {...BOARD, phones: {lit: true, buzz: true}}})},
  '27.13': {tag: '[2S]', note: 'the phones walk themselves toward the edge, one held step each (step 4).', draw: (b, f) => TS.drawBoard2S(b, f, {neleh: {arm: 'paper', head: 'down'}, mada: {}, plate: {...BOARD, phones: {lit: true, buzz: true, step: 4}}})},
  '27.14b': {tag: '[2S]', note: "ALYI's reflection flickers (gone for 2 frames). The laptop's tile doesn't move.", draw: (b, f) => TS.drawBoard2S(b, f, {neleh: {arm: 'marker'}, mada: {}, alyi: {flicker: 'gone'}, plate: {...BOARD, phones: {step: 4}}})},
  '27.32': {tag: '[2S]', note: 'the wall steps to MACROSOFT slate; a door appears in it and opens. They turn.', draw: (b, f) => TS.drawBoard2S(b, f, {neleh: {arm: 'marker', head: 'front', brow: 'query'}, mada: {head: 'front'}, alyi: null, plate: {...BOARD, slate: true, door: 5, phones: {step: 4}}})},
  '27.35': {tag: '[2S]', note: 'they look down at the blueprint: step 4 is blank but for her question mark.', draw: (b, f) => TS.drawBoard2S(b, f, {neleh: {arm: 'marker', head: 'down'}, mada: {head: 'down'}, alyi: null, plate: {...BOARD, blueprint: 3, slate: true, door: 5, phones: {step: 4}}})},
  '27.36': {tag: '[2S]', note: 'NELEH: "Step four?" (brow query) · MADA: the smallest pause, then "Good question."', draw: (b, f) => TS.drawBoard2S(b, f, {neleh: {arm: 'marker', brow: 'query', mouth: 'E'}, mada: {head: '34', look: -1}, alyi: null, plate: {...BOARD, blueprint: 3, slate: true, door: 5, phones: {step: 4}}})},
  '30.09': {tag: '[M]', note: 'MADA, perfectly still, in the only chair that is not burning. Nobody mentions them.', draw: (b, f) => TS.drawMadaM(b, f, {})},
  '30.14': {tag: '[2S]', note: 'THE CALM-OFF: two still men across the table; Terb sprays the chair fire behind.', draw: (b, f) => TS.drawCalmOff2S(b, f, {terb: {spray: 6}, plate: {keycaps: 8}})},
  '30.17': {tag: '[2S]', note: 'HOLD 1 BAR: the spinner stops, he nods once; Terb\'s hand hands over the stamped terms.', draw: (b, f) => TS.drawCalmOff2S(b, f, {mada: {nod: 1}, spin: 9, stopped: true, terb: null, plate: {fires: TS.FIRES_CALMOFF(-40), keycaps: 40, termSheet: 'stamped', terbHand: 'hand'}})},
  '30.01': {tag: '[P2]', note: 'three hearts rise out of his window off the beat and hang at the edge of Alyi\'s; he looks up.', draw: (b, f) => TS.drawDoorwayP2(b, f, {hearts: [0, 13, 31], alyi: {up: true}, iou: 1})},
  '30.01a': {tag: '[P2]', note: 'before the hearts: Alyi reads his post from the doorway (the violin, under the post only).', draw: (b, f) => TS.drawDoorwayP2(b, f, {alyi: {mouth: 'E'}, iou: 0})},
  '31.03': {tag: '[P2]', note: 'MAS (not looking): "it\'s a preview." · GERG looks over at the note (camera-left), nods.', draw: (b, f) => TS.drawVaultP2(b, f, {gerg: {look: -1, lid: 0}})},
  '31.03b': {tag: '[P2]', note: 'Gerg walks on: his window closes in 3 held steps (frame 2 of the close shown).', draw: (b, f) => TS.drawVaultP2(b, f, {gerg: {look: 0}, closeAt: f - 2})},
  '29.11c': {tag: '[POV]', note: "his monitor full-bleed, Gerg's tile at medium tile scale: he glances up into his camera.", draw: (b, f) => GM.drawGergMediumPOV(b, 0, 0, {head: 'up', lid: 0}, {f, typing: false})},
  '29.11': {tag: '[POV]', note: '(option) the same tile for "One sec. Compiling.": typing, talking, the speaking ring.', draw: (b, f) => GM.drawGergMediumPOV(b, 0, 0, {head: 'talk', mouth: 'O'}, {f, speaking: true})},
  '29.12r': {tag: '[POV]', note: '(the monitor behind his [PF] window) Gerg typing again, eyes down on his screen.', draw: (b, f) => GM.drawGergMediumPOV(b, 0, 0, {head: 'type'}, {f})},
};
const BOARD: BP.BoardPlateOpts = {laptop: true, blueprint: 0, rolodex: true, plates: [{name: 'NELEH', x: 86}, {name: 'ALYI', x: 280}]};
// the frame each shot is previewed at (the state's own clock: 26A.02 at the thumb, 29.04 on the lanyard, hearts hanging)
const SHOT_FRAME: Record<string, number> = {'26A.02': 40, '29.04': 36, '30.01': 90, '29.11': 5, '27.14b': 3};
export const SHOT_IDS = Object.keys(SHOTS);

const contact = (b: Buf) => {
  title(b, 'SHOTS', 'the medium / two-shot tier, as boarded (v2)', PAL.C7);
  const ids = SHOT_IDS;
  const cols = 5, cw = 96, ch = 48;
  ids.forEach((id, n) => {
    const tmp = new Buf(480, 270, PAL.N0);
    SHOTS[id].draw(tmp, SHOT_FRAME[id] ?? 6);
    const x = 0 + (n % cols) * cw, y = 16 + Math.floor(n / cols) * (ch + 13);
    for (let j = 0; j < ch; j++) for (let i = 0; i < cw - 2; i++) b.set(x + i, y + j, tmp.get(Math.floor(i * 5), Math.floor(j * 203 / ch)));
    label(b, id + ' ' + SHOTS[id].tag, x + 1, y + ch + 2, PAL.N5);
  });
};

// ------------------------------------------------------------------ the motion test (the tier's moving parts, on the grid)
export const MOTION_FRAMES = 552;
const motion = (b: Buf, f: number) => {
  rect(0, 0, W, H, b.ink(PAL.N0));
  let id = '', note = '';
  const L = DP.DPLATE_LOOK;
  if (f < 60) { id = '26A.02'; note = 'the Orb counts mark 1, 2, 3 (his thumb), a beat each'; TS.drawDark2S(b, f, {mas: {head: 'down', arm: 'tally'}, orb: {look: TS.orbTally(f, 8)}, plate: {tally: 3, phone: 'none'}}); }
  else if (f < 120) { const k = f - 60; id = '29.04'; note = 'the iris on the taps, then onto the GUEST lanyard on beat 3'; TS.drawDark2S(b, f, {mas: {head: 'down', arm: 'phone'}, orb: {look: TS.orbToLanyard(k, 4)}, plate: {tally: 3, lanyard: true, phone: 'up', boardGrid: true}}); }
  else if (f < 180) { const k = f - 120; id = '27.13'; note = 'every phone buzzes; they walk to the edge, a held step each'; TS.drawBoard2S(b, f, {neleh: {arm: 'marker'}, mada: {}, plate: {...BOARD, phones: {lit: true, buzz: true, step: Math.min(4, Math.floor(k / 10))}}}); }
  else if (f < 240) {
    const k = f - 180; id = '27.34'; note = '(the 2S reading of it) her marker on step 4: the hook, the stem, the dot';
    const st = Math.min(2, Math.floor(k / 14)) as 0 | 1 | 2;
    TS.drawBoard2S(b, f, {neleh: {arm: k < 8 ? 'cap' : 'write', head: 'down', stroke: st}, mada: {}, alyi: null, plate: {...BOARD, blueprint: k < 12 ? 0 : (Math.min(3, 1 + Math.floor((k - 12) / 12)) as 1 | 2 | 3), phones: {step: 4}}});
  }
  else if (f < 300) { const k = f - 240; id = '30.14'; note = 'THE CALM-OFF: Terb sprays the chair fire; it goes out (the pin is out)'; TS.drawCalmOff2S(b, f, {terb: {spray: k < 34 ? k : null}, plate: {fires: TS.FIRES_CALMOFF(274), keycaps: k}}); }
  else if (f < 360) {
    const k = f - 300; id = '30.17'; note = 'HOLD: the spinner stops, he nods once, the hand stamps the terms and hands them over';
    const nod = ([0, 1, 2, 1, 0][Math.max(0, Math.min(4, Math.floor((k - 20) / 2)))] ?? 0) as 0 | 1 | 2;
    TS.drawCalmOff2S(b, f, {mada: {nod: k >= 20 ? nod : 0}, spin: k < 14 ? f : 314, stopped: k >= 14, terb: null, plate: {fires: TS.FIRES_CALMOFF(0), keycaps: 60, termSheet: k < 36 ? 'none' : k < 44 ? 'blank' : 'stamped', terbHand: k < 36 ? 'none' : k < 46 ? 'stamp' : 'hand'}});
  }
  else if (f < 450) {
    const k = f - 360; id = '30.01'; note = 'three hearts, off the beat; they hang at his window; he looks up; the IOU flutters';
    const flut = k < 60 ? 0 : ([0, 1, 2, 1] as const)[Math.floor(k / 4) % 4];
    TS.drawDoorwayP2(b, f, {hearts: [6, 19, 37].filter((t) => k >= t).map((t) => t + 360), alyi: {up: k >= 24}, iou: flut});
  }
  else if (f < 510) { const k = f - 450; id = '29.11c'; note = "Gerg typing; he glances up into his camera (1 beat, still); typing again"; const up = k >= 22 && k < 37; GM.drawGergMediumPOV(b, 0, 0, {head: up ? 'up' : 'type', lid: up ? 0 : 1}, {f, typing: !up}); }
  else { const k = f - 510; id = '31.03b'; note = 'Gerg looks over at the note, nods, and his window closes as he walks on'; TS.drawVaultP2(b, f, {gerg: {look: k < 20 ? -1 : 0, lid: 0, nod: k >= 12 && k < 16 ? 1 : 0}, closeAt: 524}); }
  void L;
  rail(b, id, `f ${f}`, note);
};

/** dev: crop a native region of another view and blow it up k x (nearest) */
const zoom = (k: number, x: number, y: number, w: number, h: number, id: string): Buf => {
  const src = renderView(id);
  const out = new Buf(w * k, h * k, PAL.N0);
  for (let j = 0; j < h * k; j++) for (let i = 0; i < w * k; i++) out.set(i, j, src.get(x + Math.floor(i / k), y + Math.floor(j / k)));
  return out;
};

export const renderView = (id: string): Buf => {
  const parts = id.split(':');
  const kind = parts[0];
  if (kind === 'zoom') {
    const [k, x, y, w, h] = parts.slice(1, 6).map(Number);
    return zoom(k, x, y, w, h, parts.slice(6).join(':'));
  }
  if (kind === 'cast') return castView(parts.slice(1).join(':'));
  const b = new Buf(W, H, PAL.N1);
  if (kind === 'sheet') {
    const S: Record<string, (b: Buf) => void> = {mas: sheetMas, orb: sheetOrb, mada: sheetMada, neleh: sheetNeleh, gerg: sheetGerg};
    if (S[parts[1]]) { S[parts[1]](b); return b; }
  }
  if (kind === 'plate') {
    if (parts[1] === 'dark') { plateDark(b); return b; }
    if (parts[1] === 'board') { plateBoard(b); return b; }
  }
  if (kind === 'shot') {
    const [sid, fs] = parts.slice(1).join(':').split('@');
    const sh = SHOTS[sid];
    if (sh) {
      rect(0, 0, W, H, b.ink(PAL.N0));
      const f = fs !== undefined ? Number(fs) : SHOT_FRAME[sid] ?? 6;
      sh.draw(b, f);
      rail(b, sid, sh.tag, sh.note);
      return b;
    }
  }
  if (kind === 'contact') { contact(b); return b; }
  if (kind === 'motion') { motion(b, Number(parts[1]) || 0); return b; }
  text(b, 'unknown view ' + id, 8, 8, PAL.R3);
  return b;
};
