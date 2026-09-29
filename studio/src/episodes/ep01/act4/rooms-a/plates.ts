// MR. MAS — Ep1 Act Four · rooms A: the preview plates (one list drives the Node preview and the Remotion stills).
// Each plate is a still of a shared room (src/shared/pixel/rooms/*) in one scripted state. The *-staged plates
// drop existing cast sprites onto the published anchors as a scale/occlusion check for layout.
import {Buf} from '../../../../shared/pixel/px';
import {railPlaceholder} from '../../../../shared/pixel/rooms/setkit';
import {blitTo} from '../../../../shared/pixel/cast/kit';
import {drawBoardroom, drawChairBackInsert, drawTableInsert, drawLaptopChairInsert, drawTasyaDoorInsert, FIRES_SC30, BR} from '../../../../shared/pixel/rooms/boardroom';
import {drawLobby, drawLobbyCam, drawLobbyCamWide, drawSignFloorInsert} from '../../../../shared/pixel/rooms/lobby';
import {drawSuite, drawLaptopInsert, drawDeskInsert, suiteTileBg, suitePortraitBg, SUITE, LAPTOP_INSERT} from '../../../../shared/pixel/rooms/vegas-suite';
import {drawTpoolDoor, drawTpoolClose} from '../../../../shared/pixel/rooms/tpool-door';
import {inPalette} from '../../../../shared/pixel/palettes';
import {alyiTableBack} from '../../../../shared/pixel/cast/alyi';
import {gergBack, gergFront, GERG_DEFAULT, GERG_TABLE_EDGE} from '../../../../shared/pixel/cast/gerg';
import {masDeskBack, masDeskFront, MAS_DESK_DEFAULT, MAS_DESK_EDGE} from '../../../../shared/pixel/cast/mas';
import {drawGlass, GLASS} from '../../../../shared/pixel/rooms/room';

export interface Plate { id: string; frame?: number; frames?: number; draw: (b: Buf, f: number) => void; }

const masGlassAt = (b: Buf, x: number, y: number) => drawGlass(b, 0, [x - GLASS.x, y - GLASS.y]);

const PLATES_RAW: Plate[] = [
  // ---------------- boardroom (sc 27 · 30 · 31)
  {id: 'boardroom-night', draw: (b, f) => drawBoardroom(b, {f})},
  {id: 'boardroom-plan', frame: 6, draw: (b, f) => drawBoardroom(b, {f, blueprint: {word: false}, laptop: true, phones: {lit: true, buzz: true, step: 0}, speaker: 0,
    reflection: {img: alyiTableBack({lid: 0, mouth: 'rest', light: 'agi'}), x: 40, y: 38, k: 2}})},
  {id: 'boardroom-plan-late', frame: 9, draw: (b, f) => drawBoardroom(b, {f, blueprint: {word: true}, laptop: true, phones: {lit: true, buzz: false, step: 4}, speaker: 4})},
  {id: 'boardroom-slate', draw: (b, f) => drawBoardroom(b, {f, slate: true, tasyaDoor: 4, blueprint: {word: false}, sticky: {seat: 'C', text: 'CEO (TEMP)'}, spot: {x: 240, y: 116, r: 30},
    plates: {A: 'GERG', B: 'ALYI', C: null, D: 'NELEH', E: 'THE QUIET VOTE'}})},
  {id: 'boardroom-fires', frame: 4, draw: (b, f) => drawBoardroom(b, {f, fires: FIRES_SC30, door: 'open', rolodex: 'still', plates: {A: null, B: 'ALYI', C: null, D: 'NELEH', E: 'THE QUIET VOTE'}})},
  {id: 'boardroom-calmoff', frame: 5, draw: (b, f) => drawBoardroom(b, {f, fires: [{at: 'table', x: 178, y: 166, state: 'burn', phase: 0}, {at: 'chair', seat: 'B', state: 'out', outAt: 0}, {at: 'plate', seat: 'D', state: 'burn', phase: 2}], rolodex: 'still', gergLaptop: 'green', termSheet: 'stamped', plates: {A: 'GERG', B: 'ALYI', C: null, D: 'NELEH', E: 'THE QUIET VOTE'}})},
  {id: 'boardroom-newboard', draw: (b, f) => drawBoardroom(b, {f, rolodex: 'still', plates: {A: null, B: 'TERB', C: null, D: 'THE OTHER YRRAL', E: null}})},
  {id: 'boardroom-staged', draw: (b, f) => drawBoardroom(b, {f, blueprint: {word: false}, plates: {A: 'GERG', B: null, C: 'MAS', D: 'NELEH', E: null}}, {
    seated: (bb) => { blitTo(bb, gergBack(GERG_DEFAULT), BR.SEATS.A.x - 26, BR.SEATS.A.tableEdgeY - GERG_TABLE_EDGE); blitTo(bb, masDeskBack(MAS_DESK_DEFAULT), BR.SEATS.C.x - 24, BR.SEATS.C.tableEdgeY - MAS_DESK_EDGE); },
    hands: (bb) => { blitTo(bb, gergFront(GERG_DEFAULT), BR.SEATS.A.x - 26, BR.SEATS.A.tableEdgeY - GERG_TABLE_EDGE); blitTo(bb, masDeskFront(MAS_DESK_DEFAULT), BR.SEATS.C.x - 24, BR.SEATS.C.tableEdgeY - MAS_DESK_EDGE); },
  })},
  {id: 'boardroom-blueprint-insert', draw: (b, f) => drawTableInsert(b, {f, focus: 'blueprint', word: 0})},
  {id: 'boardroom-blueprint-insert-word', draw: (b, f) => drawTableInsert(b, {f, focus: 'blueprint', word: 3})},
  {id: 'boardroom-table-insert', draw: (b, f) => drawTableInsert(b, {f, focus: 'prop'})},
  {id: 'boardroom-gerglaptop-insert', draw: (b, f) => drawTableInsert(b, {f, focus: 'laptop', laptop: 'green'})},
  {id: 'boardroom-laptopchair-insert', draw: (b, f) => drawLaptopChairInsert(b, {f})},
  {id: 'boardroom-door-insert', draw: (b, f) => drawTasyaDoorInsert(b, {f})},
  {id: 'boardroom-plate-insert', draw: (b, f) => drawChairBackInsert(b, {f, screws: 1})},
  {id: 'boardroom-plate-insert-off', draw: (b, f) => drawChairBackInsert(b, {f, plateOff: true})},
  // ---------------- lobby (sc 27 security cam · sc 30 night; sc 9-10 day)
  {id: 'lobby-day', draw: (b, f) => drawLobby(b, {f, time: 'day', sign: 0})},
  {id: 'lobby-night', draw: (b, f) => drawLobby(b, {f, time: 'night', sign: 3, zeroBox: true})},
  {id: 'lobby-night-unlit', draw: (b, f) => drawLobby(b, {f, time: 'night', sign: 1})},
  {id: 'lobby-cam', draw: (b, f) => drawLobbyCam(b, {f, time: 'day'})},
  {id: 'lobby-cam-wide', draw: (b, f) => drawLobbyCamWide(b, {f})},
  {id: 'lobby-floor-insert', draw: (b, f) => drawSignFloorInsert(b, {f, box: 2})},
  {id: 'lobby-floor-insert-set', draw: (b, f) => drawSignFloorInsert(b, {f, box: 1})},
  // ---------------- vegas suite (sc 24 · 25 · 26)
  {id: 'suite-day', draw: (b, f) => drawSuite(b, {f, emptyChair: true})},
  {id: 'suite-staged', frame: 7, draw: (b, f) => drawSuite(b, {f, truckX: 290, shiverT0: 0, phoneLit: false}, {
    mas: (bb, front) => { blitTo(bb, masDeskBack(MAS_DESK_DEFAULT), SUITE.MAS_AT[0], SUITE.MAS_AT[1]); front(bb); blitTo(bb, masDeskFront(MAS_DESK_DEFAULT), SUITE.MAS_AT[0], SUITE.MAS_AT[1]); masGlassAt(bb, SUITE.GLASS_AT[0], SUITE.GLASS_AT[1]); },
  })},
  {id: 'suite-laptop-join', draw: (b, f) => drawLaptopInsert(b, {f, cursor: [LAPTOP_INSERT.join.x + 50, LAPTOP_INSERT.join.y + 12]})},
  {id: 'suite-laptop-gone', draw: (b, f) => drawLaptopInsert(b, {f, screen: 'gone', mic: true})},
  {id: 'suite-desk-insert', draw: (b, f) => drawDeskInsert(b, {f, phoneLit: true, mic: true})},
  {id: 'suite-portrait-bg', draw: (b, f) => { b.c.fill(0x04050a); suitePortraitBg(b, 12, 24, f); suitePortraitBg(b, 356, 24, f); }},
  {id: 'suite-tile-bg', draw: (b, f) => { b.c.fill(0x04050a); suiteTileBg(b, 164, 80, 152, 86, f); }},
  // ---------------- TPOOL corridor (F1.2 · 26.12-26.13): authored BASE, shown EARLYWEB16
  {id: 'tpool-door', draw: (b, f) => drawTpoolDoor(b, {f, lean: 0})},
  {id: 'tpool-door-lean', draw: (b, f) => drawTpoolDoor(b, {f, lean: 1})},
  {id: 'tpool-door-ew16', draw: (b, f) => { drawTpoolDoor(b, {f, lean: 1}); const e = inPalette(b, 'EARLYWEB16'); b.c.set(e.c); }},
  {id: 'tpool-close', draw: (b, f) => drawTpoolClose(b, {f, lean: 1})},
  {id: 'tpool-close-ew16', draw: (b, f) => { drawTpoolClose(b, {f, lean: 1}); const e = inPalette(b, 'EARLYWEB16'); b.c.set(e.c); }},
];

/** every room-area plate gets the preview rail placeholder under it (rows 203-269 belong to the rail builder) */
export const PLATES: Plate[] = PLATES_RAW.map((p) => ({...p, draw: (b: Buf, f: number) => { p.draw(b, f); railPlaceholder(b); }}));
