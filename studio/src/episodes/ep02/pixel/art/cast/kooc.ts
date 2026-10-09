// MR. MAS — Ep2 v1 art: MIT KOOC (runs ELPPA; unplated; manifest §2.2; sc 19, the walled garden). characters/mit-kooc.md:
// trim and composed, a black quarter-zip; ELPPA silver, white and black. Here: short silver hair, a black quarter-zip,
// grey trousers, composed; and the ONE KEY AS TALL AS HE IS, which he turns in the gate's lock. Company to company only
// (X2); never a likeness (no glasses, no traced features).
//   drawKoocRoom(b, x, y, pose)   ≈ 80 px, faces screen-right. pose {key: 'carry' (the key upright beside him, his near
//                                 hand round its shaft) | 'turn0' | 'turn1' | 'turn2' (the key in the lock at chest
//                                 height, held steps of the turn: the bow flat, edge-on, flat again) | 'none', mouth}
//   drawGiantKey(b, x, y, o)      the key alone: upright (x, y = its foot) or level in a lock (x, y = the lock's face),
//                                 o.turn 0..2
import {Buf} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {SKIN, HAIR} from '../../../../../shared/pixel/cast/civic-kit';
import {makeRoom, RoomFigSpec} from './civic2';
import {sheetPlate, sheetRoom} from './sheet';
import {fill} from '../kit';
import type {ArtAsset} from '../asset';

const BLACK = [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.G3];
const SILVER = [PAL.G2, PAL.G4, PAL.G5, PAL.G6, PAL.P1, PAL.P2];
/** the giant key: a ring bow, a long shaft, a stepped bit; silver with a lit edge */
export const drawGiantKey = (b: Buf, x: number, y: number, o: {level?: boolean; turn?: 0 | 1 | 2; len?: number; flip?: boolean} = {}) => {
  const L = o.len ?? 70;
  const S = [PAL.G2, PAL.G4, PAL.G5, PAL.G6, PAL.P2];
  if (!o.level) {
    // upright: the bow at the top (a ring 14 across), the shaft down to the bit at the foot
    for (let j = 0; j < 14; j++) for (let i = 0; i < 14; i++) { const d = Math.hypot(i - 6.5, j - 6.5); if (d < 7 && d > 3.6) b.set(x - 7 + i, y - L + j, d > 6 ? S[1] : i < 6 ? S[3] : S[2]); }
    for (let j = 14; j < L; j++) { b.set(x - 1, y - L + j, S[3]); b.set(x, y - L + j, S[2]); b.set(x + 1, y - L + j, S[1]); }
    fill(b, x + 2, y - 12, 6, 4, S[2]); fill(b, x + 2, y - 6, 4, 4, S[2]); fill(b, x + 2, y - 12, 6, 1, S[4]);
    return;
  }
  // level, its tip in the lock at (x, y): the shaft runs back toward the bow (to the left)
  const d = o.flip ? -1 : 1;
  for (let i = 0; i < L - 14; i++) { b.set(x - i * d, y - 1, S[3]); b.set(x - i * d, y, S[2]); b.set(x - i * d, y + 1, S[1]); }
  const bx = x - (L - 7) * d;
  const t = o.turn ?? 0;
  if (t === 1) { fill(b, bx - 1, y - 7, 3, 15, S[2]); fill(b, bx - 1, y - 7, 1, 15, S[3]); }
  else for (let j = 0; j < 14; j++) for (let i = 0; i < 14; i++) { const d = Math.hypot(i - 6.5, j - 6.5); if (d < 7 && d > 3.6) b.set(bx - 7 + i, y - 7 + j, d > 6 ? S[1] : j < 6 ? S[3] : S[2]); }
};
export interface KoocPose { key: 'carry' | 'turn0' | 'turn1' | 'turn2' | 'none'; mouth?: 'rest' | 'open' | 'smile'; legs?: 'stand' | 'w0' | 'w1' | 'w2' | 'w3' }
const rspec: RoomFigSpec = {
  kind: 'jacket', legMat: 'trou',
  ramps: {skin: SKIN.light, hair: HAIR.silver, suit: BLACK, shirt: BLACK, trou: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4], zip: SILVER},
  backRamp: {skin: PAL.S3, suit: PAL.G2},
  extras: (_p, bob) => ({stamps: [{x: 20, y: 18 + bob, rows: ['zzz', '.z.', '.z.', '.z.'], pal: {z: ['zip', 3]}}] as never}),
};
const room = makeRoom(rspec);
export const drawKoocRoom = (b: Buf, footX: number, footY: number, p: Partial<KoocPose> = {}, o: {flip?: boolean} = {}) => {
  const q: KoocPose = {key: 'carry', mouth: 'rest', ...p};
  const turning = q.key.startsWith('turn');
  room.draw(b, footX, footY, {arm: q.key === 'carry' ? 'reach' : turning ? 'reach' : 'down', armF: turning ? 'clasp' : undefined, legs: q.legs, head: {hair: 'silver', mouth: q.mouth}}, o);
  const dir = o.flip ? -1 : 1;
  if (q.key === 'carry') drawGiantKey(b, footX + 17 * dir, footY, {len: 74});
  if (turning) drawGiantKey(b, footX + 70 * dir, footY - 44, {level: true, turn: Number(q.key.slice(4)) as 0 | 1 | 2, len: 50, flip: o.flip});
};

export const ART: ArtAsset[] = [{
  id: 'char-kooc', manifest: '§2.2 MIT KOOC', kind: 'character', name: 'MIT KOOC (runs ELPPA; unplated)',
  file: 'cast/kooc.ts', exports: 'drawKoocRoom, drawGiantKey', scenes: '19 (the garden)',
  note: 'black quarter-zip, silver hair, composed; the key as tall as he is, carried and turned in the lock (three held steps)',
  stills: [{label: 'room: the key carried · the turn (three held steps) · the key alone', draw: (b) => {
    sheetPlate(b, [PAL.L0, PAL.L1, PAL.N3, PAL.N3]);
    sheetRoom(b, 70, 'carry', (x, y) => drawKoocRoom(b, x, y, {key: 'carry'}));
    for (const [i, k] of (['turn0', 'turn1', 'turn2'] as const).entries()) {
      const x = 150 + i * 100;
      fill(b, x + 70, 134, 10, 16, PAL.G2); fill(b, x + 70, 134, 10, 1, PAL.G5);
      sheetRoom(b, x, k, (xx, y) => drawKoocRoom(b, xx, y, {key: k, mouth: k === 'turn2' ? 'smile' : 'rest'}));
    }
    drawGiantKey(b, 450, 186, {len: 74});
  }}],
}];
