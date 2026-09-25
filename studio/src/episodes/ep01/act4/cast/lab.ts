// MR. MAS — Ep1 act 4, cast LAB views (dev iteration only; the deliverable sheets are in sheet.ts) (owned by the act-4 character artist). Pure pixel code: the same
// views render in Node (tools/lab.ts) and in Remotion (CastCanvas.tsx). Every view returns a native buffer.
import {Buf, rect} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {text} from '../../../../shared/pixel/font';
import {drawNelehPortrait, NelehPortraitState, drawNelehTile, drawNelehMini, drawNelehRoom, drawFootnotes, roomOrbit} from '../../../../shared/pixel/cast/neleh';
import {drawMadaPortrait, MadaPortraitState, drawMadaTile, drawMadaMini, drawMadaSeated, drawMadaChair} from '../../../../shared/pixel/cast/mada';
import {drawTtemmePortrait, drawTtemmeTile, drawTtemmeMini, drawTtemmeRoom, drawHourglass, drawStickyNote, drawStickyNameplate, hourglassFlipAt} from '../../../../shared/pixel/cast/ttemme';
import {drawTerbPortrait, drawTerbTile, drawTerbMini, drawTerbRoom, drawSpray, drawExtinguisherInsert, drawPinTag, drawTermSheet, TERB_HORN, terbWalkAt} from '../../../../shared/pixel/cast/terb';
import {drawQuietVoteTile, drawQuietVoteMini, drawQuietVotePortrait, drawQuietVoteLaptop} from '../../../../shared/pixel/cast/the-quiet-vote';
import {drawRimaSpeakPortrait, drawRimaTile, drawRimaMini} from '../../../../shared/pixel/cast/rima-speak';
import {drawTasyaSpeakPortrait, drawTasyaRoom} from '../../../../shared/pixel/cast/tasya-speak';
import {drawAdelinaPortrait, drawAdelinaRoom, drawThroneHandset} from '../../../../shared/pixel/cast/adelina';
import {alyiSpeakPortrait, drawAlyiWindow, drawAlyiTile, drawAlyiMini, drawAlyiStand} from '../../../../shared/pixel/cast/alyi-speak';
import {gergSpeakPortrait, gergGlow, drawGergTile, drawGergMini} from '../../../../shared/pixel/cast/gerg-speak';
import {blitImg} from '../../../../shared/pixel/figure';
import {VISEMES} from '../../../../shared/pixel/cast/talk';
import {TILE_W, TILE_H, tileFrame, tileLabel, tileVote, MINI_W, MINI_H, miniFrame} from '../../../../shared/pixel/cast/calltile';

import {drawMasStand} from '../../../../shared/pixel/cast/mas-stand';
import {drawGergStand} from '../../../../shared/pixel/cast/gerg-stand';
import {drawMasDesk, MAS_DESK_DEFAULT} from '../../../../shared/pixel/cast/mas';
const lab = (id: string): Buf => {
  if (id === 'terbseat') { const c = new Buf(80, 100, PAL.N2); drawTerbRoom(c, 30, 96, {legs: 'seat', arm: 'none', helmet: false, mouth: 'rest', blink: false, light: 'room', pin: false}); return c; }
  if (id === 'walkers') {
    const c = new Buf(330, 96, PAL.N2);
    const ms: any[] = [['stand', 'down', false, 'room'], ['w0', 'down', false, 'room'], ['w1', 'down', false, 'room'], ['w2', 'down', false, 'room'], ['w3', 'down', false, 'room'], ['stand', 'reach', false, 'room'], ['stand', 'pocket', true, 'room']];
    ms.forEach(([legs, arm, guest, light], i) => drawMasStand(c, 16 + i * 34, 90, {legs, arm, mouth: 'rest', blink: false, guest, light}));
    const gs: any[] = [['w0', 0, 'screen'], ['w2', 1, 'screen'], ['stand', 2, 'up']];
    gs.forEach(([legs, type, look], i) => drawGergStand(c, 250 + i * 34, 90, {legs, type, look, mouth: 'rest', light: 'room'}));
    
    return c;
  }
  const b = new Buf(480, 270, PAL.N1);
  if (id === 'neleh') {
    const st: NelehPortraitState[] = [
      {mouth: 'rest', lid: 0, look: -1, brow: 'level'},
      {mouth: 'A', lid: 0, look: -1, brow: 'query'},
      {mouth: 'O', lid: 0, look: 0, brow: 'worry'},
      {mouth: 'rest', lid: 1, look: -1, brow: 'level', gaze: 'down'},
    ];
    st.forEach((s, i) => drawNelehPortrait(b, 4 + i * 118, 4, s, {orbit: i * 7}));
    text(b, 'neleh wip', 4, 250, PAL.N6);
  }
  if (id === 'nelehtile') {
    const v: Array<[any, number | null]> = [[{mouth: 'rest', lid: 0, brow: 'level'}, 0], [{mouth: 'A', lid: 0, brow: 'worry'}, 12], [{mouth: 'O', lid: 1, brow: 'query'}, 24], [{mouth: 'E', lid: 0, brow: 'level'}, null]];
    v.forEach(([st, orb], i) => { const x = 8 + (i % 3) * 156, y = 8 + Math.floor(i / 3) * 94; drawNelehTile(b, x, y, TILE_W, TILE_H, st, {orbit: orb}); tileFrame(b, x, y, TILE_W, TILE_H); tileLabel(b, x, y, TILE_H, 'NELEH'); tileVote(b, x, y, TILE_W, i ? 'flip' : 'back'); });
    drawNelehMini(b, 170, 110, MINI_W, MINI_H); miniFrame(b, 170, 110, MINI_W, MINI_H);
  }
  if (id === 'nelehroom') {
    rect(0, 150, 480, 120, b.ink(PAL.N2));
    const poses: any[] = [{arm: 'paper', mouth: 'rest', blink: false, light: 'room'}, {arm: 'paper', mouth: 'open', blink: false, light: 'room'}, {arm: 'marker', mouth: 'rest', blink: false, light: 'room'}, {arm: 'write0', mouth: 'rest', blink: false, light: 'room'}, {arm: 'write1', mouth: 'rest', blink: true, light: 'room'}, {arm: 'paper', mouth: 'rest', blink: false, light: 'sil'}, {arm: 'paper', mouth: 'rest', blink: false, light: 'fade'}];
    poses.forEach((p, i) => { const fx = 30 + i * 62, fy = 140; drawNelehRoom(b, fx, fy, p); drawFootnotes(b, roomOrbit(fx, fy), i * 9, 'all'); });
    drawNelehRoom(b, 60, 240, poses[3], {flip: true});
  }
  if (id === 'nelehroomz') {
    const c = new Buf(150, 90, PAL.N2);
    const poses: any[] = [{arm: 'paper', mouth: 'rest', blink: false, light: 'room'}, {arm: 'marker', mouth: 'open', blink: false, light: 'room'}, {arm: 'write0', mouth: 'rest', blink: false, light: 'room'}];
    poses.forEach((p, i) => drawNelehRoom(c, 22 + i * 48, 86, p));
    return c;
  }
  if (id === 'mada') {
    const st: MadaPortraitState[] = [{mouth: 'rest', lid: 0, look: 0, nod: 0}, {mouth: 'O', lid: 0, look: -1, nod: 0}, {mouth: 'E', lid: 1, look: 0, nod: 1}, {mouth: 'smile', lid: 0, look: 0, nod: 0}];
    st.forEach((s, i) => drawMadaPortrait(b, 4 + i * 118, 4, s, {spin: i === 3 ? null : i * 5, stopped: i === 2}));
  }
  if (id === 'madatile') {
    [[{mouth: 'rest', lid: 0, nod: 0}, 0, false], [{mouth: 'O', lid: 0, nod: 0}, 5, false], [{mouth: 'rest', lid: 1, nod: 1}, 9, true]].forEach(([st, sp, stp]: any, i) => {
      const x = 8 + i * 156, y = 8; drawMadaTile(b, x, y, TILE_W, TILE_H, st, {spin: sp, stopped: stp}); tileFrame(b, x, y, TILE_W, TILE_H); tileLabel(b, x, y, TILE_H, 'MADA'); tileVote(b, x, y, TILE_W, 'flip');
    });
    drawMadaMini(b, 8, 110, MINI_W, MINI_H); miniFrame(b, 8, 110, MINI_W, MINI_H);
    rect(0, 200, 480, 70, b.ink(PAL.N2));
    drawMadaSeated(b, 80, 200, {lid: 0, mouth: 'rest', nod: 0, light: 'room'}, {spin: 3});
    drawMadaSeated(b, 140, 200, {lid: 1, mouth: 'open', nod: 1, light: 'room'}, {flip: true, spin: 6, stopped: true});
    drawMadaSeated(b, 200, 200, {lid: 0, mouth: 'rest', nod: 0, light: 'sil'});
    drawMadaChair(b, 260, 200);
  }
  if (id === 'ttemme1') { const c = new Buf(112, 136, PAL.N1); drawTtemmePortrait(c, 0, 0, {mouth: 'rest', lid: 0, look: 0, brow: 'level', gaze: 'cam'}, {sand: 0.3, stream: true, chat: 10}); return c; }
  if (id === 'ttemme') {
    const st: any[] = [{mouth: 'A', lid: 0, look: 0, brow: 'hype', gaze: 'cam'}, {mouth: 'O', lid: 0, look: 0, brow: 'unsure', gaze: 'sand'}, {mouth: 'rest', lid: 0, look: -1, brow: 'level'}];
    st.forEach((s, i) => drawTtemmePortrait(b, 4 + i * 118, 4, s, {sand: i * 0.45, stream: i < 2, chat: i === 0 ? 7 : null}));
    // hourglass states
    [0, 0.2, 0.5, 0.8, 1].forEach((sd, i) => drawHourglass(b, 360 + (i % 3) * 24, 4 + Math.floor(i / 3) * 36, {sand: sd, stream: sd < 1}, {f: i}));
    drawHourglass(b, 360 + 2 * 24, 40, {sand: 0.5, flip: 'side'});
    [0, 4, 10, 16, 20, 26].forEach((k, i) => drawHourglass(b, 4 + i * 26, 150, {sand: 1, shatter: k}));
    [0, 3, 6, 9].forEach((k, i) => { const hs = hourglassFlipAt(k, 0); drawHourglass(b, 170 + i * 12, 190, hs, {size: 'room'}); });
    drawStickyNote(b, 230, 150); drawStickyNameplate(b, 290, 160);
    drawTtemmeTile(b, 320, 150, TILE_W, TILE_H - 20, {mouth: 'E', lid: 0}, {sand: 0.4}); 
    drawTtemmeMini(b, 230, 200, MINI_W, MINI_H);
    rect(0, 262, 480, 8, b.ink(PAL.N2));
    drawTtemmeRoom(b, 30, 262, {arm: 'hold', mouth: 'rest', blink: false, light: 'room'}, {hourglass: {sand: 0.3, stream: true}});
    drawTtemmeRoom(b, 80, 262, {arm: 'set', mouth: 'open', blink: false, light: 'spot'}, {hourglass: {sand: 0}});
    drawTtemmeRoom(b, 130, 262, {arm: 'down', mouth: 'rest', blink: true, light: 'room'});
  }
  if (id === 'troomz') {
    const c = new Buf(150, 90, PAL.N2);
    drawTtemmeRoom(c, 22, 86, {arm: 'hold', mouth: 'rest', blink: false, light: 'room'}, {hourglass: {sand: 0.3, stream: true}});
    drawTtemmeRoom(c, 70, 86, {arm: 'set', mouth: 'open', blink: false, light: 'room'}, {hourglass: {sand: 0}});
    drawTtemmeRoom(c, 118, 86, {arm: 'down', mouth: 'rest', blink: false, light: 'room'});
    return c;
  }
  if (id === 'terb1') { const c = new Buf(112, 136, PAL.N1); drawTerbPortrait(c, 0, 0, {mouth: 'rest', lid: 0, look: -1, brow: 'level', helmet: true}, {f: 0}); return c; }
  if (id === 'terb') {
    drawTerbPortrait(b, 4, 4, {mouth: 'E', lid: 1, look: 0, brow: 'flat', helmet: true});
    drawTerbPortrait(b, 122, 4, {mouth: 'A', lid: 0, look: -1, brow: 'ah', helmet: false}, {f: 5});
    drawExtinguisherInsert(b, 240, 4, {pin: true}); drawExtinguisherInsert(b, 320, 4, {pin: false});
    drawPinTag(b, 420, 80); drawTermSheet(b, 400, 4, {size: 'lg', stamped: true}); drawTermSheet(b, 440, 60, {size: 'room', stamped: true});
    drawTerbTile(b, 240, 100, TILE_W, TILE_H - 20, {mouth: 'rest', lid: 0, helmet: false}); drawTerbMini(b, 400, 130, MINI_W, MINI_H);
    rect(0, 262, 480, 8, b.ink(PAL.N2));
    const poses: any[] = [['stand', 'carry', 'fire'], ['w0', 'carry', 'fire'], ['w1', 'carry', 'fire'], ['w2', 'carry', 'fire'], ['w3', 'carry', 'fire'], ['stand', 'spray', 'fire'], ['stand', 'stamp', 'room'], ['stand', 'hand', 'room'], ['stand', 'carry', 'sil']];
    poses.forEach(([legs, arm, light], i) => { const fx = 20 + i * 50; drawTerbRoom(b, fx, 262, {legs, arm, helmet: i !== 7, mouth: 'rest', blink: false, light, pin: i < 5}); if (arm === 'spray') drawSpray(b, fx - 22 + TERB_HORN[0], 262 - 90 + TERB_HORN[1], 1, 6, {len: 24}); });
  }
  if (id === 'extz') { const c = new Buf(160, 70, PAL.N1); drawExtinguisherInsert(c, 2, 2, {pin: true}); drawExtinguisherInsert(c, 82, 2, {pin: false}); return c; }
  if (id === 'qv') {
    drawQuietVoteTile(b, 8, 8, TILE_W, TILE_H); tileFrame(b, 8, 8, TILE_W, TILE_H); tileVote(b, 8, 8, TILE_W, 'flip');
    drawQuietVoteTile(b, 170, 8, 112, 63); tileFrame(b, 170, 8, 112, 63); tileVote(b, 170, 8, 112, 'back');
    drawQuietVoteTile(b, 300, 8, 60, 34); tileFrame(b, 300, 8, 60, 34);
    drawQuietVoteMini(b, 380, 8, MINI_W, MINI_H); miniFrame(b, 380, 8, MINI_W, MINI_H);
    drawQuietVotePortrait(b, 8, 110);
    rect(130, 230, 350, 40, b.ink(PAL.N1));
    drawQuietVoteLaptop(b, 170, 230); drawQuietVoteLaptop(b, 240, 230, {flip: true});
  }
  if (id === 'rima') {
    const st: any[] = [{mouth: 'rest', lid: 0, brow: 'level', hand: 'none'}, {mouth: 'E', lid: 0, brow: 'firm', hand: 'smooth0'}, {mouth: 'smile', lid: 1, brow: 'lift', hand: 'smooth1'}];
    st.forEach((s, i) => drawRimaSpeakPortrait(b, 4 + i * 118, 4, s));
    drawRimaSpeakPortrait(b, 358, 4, {mouth: 'rest', lid: 0, brow: 'level', hand: 'none'}, {spot: 'dark'});
    drawRimaTile(b, 8, 150, TILE_W, TILE_H, {mouth: 'rest', lid: 0}, {spot: 0}); tileFrame(b, 8, 150, TILE_W, TILE_H);
    drawRimaTile(b, 166, 150, TILE_W, TILE_H, {mouth: 'O', lid: 0}, {spot: 1}); tileFrame(b, 166, 150, TILE_W, TILE_H); tileLabel(b, 166, 150, TILE_H, 'RIMA TAMURI');
    drawRimaMini(b, 330, 150, MINI_W, MINI_H); miniFrame(b, 330, 150, MINI_W, MINI_H);
  }
  if (id === 'rima1') { const c = new Buf(112, 136, PAL.N1); drawRimaSpeakPortrait(c, 0, 0, {mouth: 'rest', lid: 0, brow: 'level', hand: 'smooth0'}); return c; }
  if (id === 'tasya') {
    const st: any[] = [{mouth: 'smile', lid: 0, brow: 'warm', arms: 'clasp', jangle: 0}, {mouth: 'A', lid: 0, brow: 'level', arms: 'none', jangle: 0}, {mouth: 'O', lid: 1, brow: 'warm', arms: 'ring', jangle: 1}, {mouth: 'E', lid: 0, brow: 'level', arms: 'clasp', jangle: 0}];
    st.forEach((s, i) => drawTasyaSpeakPortrait(b, 4 + i * 118, 4, s));
    rect(0, 262, 480, 8, b.ink(PAL.N2));
    const ps: any[] = [['clasp', 'smile', 'room'], ['sign', 'open', 'room'], ['keys0', 'rest', 'room'], ['keys1', 'rest', 'slate'], ['clasp', 'smile', 'sil']];
    ps.forEach(([arm, mouth, light], i) => drawTasyaRoom(b, 30 + i * 50, 262, {arm, mouth, blink: false, light}));
  }
  if (id === 'tasya1') { const c = new Buf(112, 136, PAL.N1); drawTasyaSpeakPortrait(c, 0, 0, {mouth: 'smile', lid: 0, brow: 'warm', arms: 'clasp', jangle: 0}); return c; }
  if (id === 'adelina') {
    const st: any[] = [{mouth: 'smile', lid: 0, look: -1, brow: 'warm', phone: 'none'}, {mouth: 'O', lid: 0, look: 0, brow: 'brisk', phone: 'ear', throne: true}, {mouth: 'rest', lid: 1, look: -1, brow: 'level', phone: 'ear', throne: false}];
    st.forEach((s, i) => drawAdelinaPortrait(b, 4 + i * 118, 4, s));
    drawThroneHandset(b, 370, 20, {size: 'lg', throne: true}); drawThroneHandset(b, 370, 50, {size: 'lg'}); drawThroneHandset(b, 410, 80, {size: 'room', throne: true});
    rect(0, 262, 480, 8, b.ink(PAL.N2));
    const ps: any[] = [['down', 'smile', 'room', false], ['reach', 'rest', 'room', true], ['phone', 'open', 'room', true], ['phone', 'rest', 'room', false], ['down', 'rest', 'sil', false]];
    ps.forEach(([arm, mouth, light, throne], i) => drawAdelinaRoom(b, 30 + i * 50, 262, {arm, mouth, blink: false, light, throne}));
  }
  if (id === 'adelina1') { const c = new Buf(112, 136, PAL.N1); drawAdelinaPortrait(c, 0, 0, {mouth: 'rest', lid: 0, look: -1, brow: 'brisk', phone: 'ear', throne: true}); return c; }
  if (id === 'alyigerg') {
    // mouth strips (face crops) for both patched portraits
    VISEMES.forEach((v, i) => { const c = new Buf(40, 34, PAL.N1); blitImg(c, alyiSpeakPortrait({mouth: v, eyes: 'open', t: 0}), -26, -48); for (let j = 0; j < 34; j++) for (let k = 0; k < 40; k++) b.set(4 + i * 42 + k, 4 + j, c.get(k, j)); });
    VISEMES.forEach((v, i) => { const c = new Buf(40, 34, PAL.N1); blitImg(c, gergSpeakPortrait({mouth: v, lid: 1, look: 0}), -26, -46); for (let j = 0; j < 34; j++) for (let k = 0; k < 40; k++) b.set(4 + i * 42 + k, 42 + j, c.get(k, j)); });
    drawAlyiWindow(b, 260, 4, 100, 110, {mouth: 'E', eyes: 'open', t: 0});
    drawAlyiWindow(b, 366, 4, 100, 110, {mouth: 'rest', eyes: 'open', t: 0}, {flicker: 'gone'});
    drawAlyiTile(b, 4, 120, TILE_W, TILE_H, {mouth: 'O', eyes: 'open', t: 0}); tileFrame(b, 4, 120, TILE_W, TILE_H); tileLabel(b, 4, 120, TILE_H, 'ALYI'); tileVote(b, 4, 120, TILE_W, 'flip');
    drawGergTile(b, 160, 120, TILE_W, TILE_H, {mouth: 'A', lid: 1, look: -1}, {f: 4}); tileFrame(b, 160, 120, TILE_W, TILE_H); tileLabel(b, 160, 120, TILE_H, 'GERG MOCKBRAN');
    drawAlyiMini(b, 320, 120, MINI_W, MINI_H); miniFrame(b, 320, 120, MINI_W, MINI_H);
    drawGergMini(b, 364, 120, MINI_W, MINI_H); miniFrame(b, 364, 120, MINI_W, MINI_H);
    rect(0, 262, 480, 8, b.ink(PAL.N2));
    drawAlyiStand(b, 330, 262, {mouth: 'rest', lid: 0, arms: 'down', light: 'door'});
    drawAlyiStand(b, 370, 262, {mouth: 'open', lid: 0, arms: 'clasp', light: 'room'});
    drawAlyiStand(b, 410, 262, {mouth: 'rest', lid: 1, arms: 'down', light: 'sil'});
  }
  if (id === 'gergglow') { const c = new Buf(112, 136, PAL.N1); blitImg(c, gergGlow({mouth: 'E', lid: 1, look: 0}), 0, 0); return c; }
  if (id === 'mada1') { const c = new Buf(112, 136, PAL.N1); drawMadaPortrait(c, 0, 0, {mouth: 'rest', lid: 0, look: 0, nod: 0}, {spin: 4}); return c; }
  if (id === 'neleh1') { const c = new Buf(112, 136, PAL.N1); drawNelehPortrait(c, 0, 0, {mouth: 'rest', lid: 0, look: -1, brow: 'level'}, {orbit: 5}); return c; }
  return b;
};

export const labView = (id: string): Buf => {
  const [, arg] = id.split(':');
  return lab(arg);
};
