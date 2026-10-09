// MR. MAS — Ep2 v1 art: SET-22, THE ZAI LOBBY (sc 20, the right pane of the split), with the VISITOR (§2.2) and the
// props: a brand-new Faraday BIRDCAGE at the doors (its shipping tag still on, a padlock), from the rafters a banner that
// has clearly been up a while, `KORG 2: NEXT QUARTER`; NOLE's post lamp (Ep1's "1am post lamp": it clicks on when he
// posts); his phone lighting with Mas's post; his own phone locked inside the cage, buzzing (replies stacking, nothing
// legible); the visitor a silhouette at the doors (no line, no face). High, cold, industrial.
//   zaiLobby(b, f, st)        [W] st {cage: 'empty' | 'phone' (his phone inside, buzzing), door: 'open' | 'shut',
//                             padlock: 'open' | 'locked', lamp: 'on' | 'off', nole: NolePose parts | null, visitor: bool}
//   cageECU(b, f, st)         [ECU] 20.04: inside the cage, his phone buzzing: replies stacking where he can't reach them
//                             (grey bars, nothing legible), st.k the stack
//   drawBirdcage(b, x, y, o)  the cage alone (room scale), o.tag, o.padlock, o.door, o.phone
import {Buf, rect, line, ellipse, bayer, hash, clamp, poly} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {noleImg, NOLE_BASE, NOLE_FOOT, NolePose} from '../../../../../shared/pixel/cast/nole';
import {blitImg} from '../../../../../shared/pixel/figure';
import {fill, pt, pw, bpt, bpw, tiny, tinyWidth, vramp, RH, TR, dith} from '../kit';
import {makeRoom} from '../cast/civic2';
import {SKIN, HAIR} from '../../../../../shared/pixel/cast/civic-kit';
import type {ArtAsset} from '../asset';

/** the visitor: a person-shaped silhouette against the doors' daylight (no line, no face, no one we know) */
const visitor = makeRoom({kind: 'jacket', ramps: {skin: SKIN.medium, hair: HAIR.dark, suit: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N5], shirt: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N5]}});

export const drawBirdcage = (b: Buf, x: number, y: number, o: {tag?: boolean; padlock?: 'open' | 'locked'; door?: 'open' | 'shut'; phone?: boolean; f?: number} = {}) => {
  // a domed birdcage (brass-coloured bars) on a stand at chest height; x, y = the stand's foot
  fill(b, x - 2, y - 30, 4, 30, PAL.G3); fill(b, x - 12, y - 2, 24, 2, PAL.G3);
  const cx = x, base = y - 30, top = y - 78, hw = 20;
  fill(b, cx - hw, base - 3, hw * 2, 3, PAL.W4);
  for (let i = -hw; i <= hw; i += 4) { const h = Math.round(Math.sqrt(Math.max(0, 1 - (i / hw) ** 2)) * 12); line(cx + i, base - 3, cx + i, top + 12 - h, b.ink(PAL.W5)); }
  for (let i = -hw; i <= hw; i++) { const h = Math.round(Math.sqrt(Math.max(0, 1 - (i / hw) ** 2)) * 12); b.set(cx + i, top + 12 - h, PAL.W6); b.set(cx + i, base - 22, PAL.W4); }
  ellipse(cx, top - 2, 3, 3, b.ink(PAL.W6));
  if (o.door === 'open') fill(b, cx - 6, base - 18, 12, 15, PAL.N1); else for (let i = -6; i <= 6; i += 3) line(cx + i, base - 3, cx + i, base - 18, b.ink(PAL.W6));
  if (o.phone) { fill(b, cx - 4, base - 12, 8, 9, PAL.N0); fill(b, cx - 3, base - 11, 6, 7, PAL.C4); const bz = Math.floor((o.f ?? 0) / 2) % 2; if (bz) { b.set(cx - 6, base - 9, PAL.C6); b.set(cx + 6, base - 7, PAL.C6); } }
  if (o.padlock) { fill(b, cx + 7, base - 12, 6, 6, PAL.W5); ellipse(cx + 10, base - 13, 2, 2, b.ink(PAL.G4)); if (o.padlock === 'open') { fill(b, cx + 12, base - 17, 1, 4, PAL.G4); } }
  if (o.tag) { line(cx - hw, base - 10, cx - hw - 6, base - 4, b.ink(PAL.P1)); fill(b, cx - hw - 14, base - 4, 10, 7, PAL.P2); fill(b, cx - hw - 13, base - 2, 7, 1, PAL.G4); }
};
export interface ZaiSt { cage?: 'empty' | 'phone'; door?: 'open' | 'shut'; padlock?: 'open' | 'locked'; lamp?: 'on' | 'off'; nole?: Partial<NolePose> | null; visitor?: boolean }
export const zaiLobby = (b: Buf, f: number, st: ZaiSt = {}) => {
  // a converted warehouse: steel rafters high in the dark, corrugated walls, a concrete floor, glass doors at the left
  vramp(b, 0, 0, 480, 150, [PAL.N0, PAL.N1, PAL.N2]);
  for (let x = 0; x < 480; x += 8) fill(b, x, 30, 1, 120, PAL.N1);
  for (let k = 0; k < 5; k++) { const x = 20 + k * 110; line(x, 0, x + 50, 28, b.ink(PAL.G2)); line(x + 100, 0, x + 50, 28, b.ink(PAL.G2)); fill(b, 0, 28, 480, 3, PAL.G2); }
  // the banner from the rafters, up a while (its corner sagging, faded)
  const s = 'KORG 2: NEXT QUARTER';
  fill(b, 180, 34, bpw(s) + 16, 22, PAL.N3); fill(b, 180, 34, bpw(s) + 16, 1, PAL.N5); bpt(b, s, 188, 38, PAL.G5); for (let i = 0; i < 6; i++) b.set(180 + bpw(s) + 15 - i, 55 - i, PAL.N1);
  vramp(b, 0, 150, 480, RH - 150, [PAL.G1, PAL.G2]);
  // the glass doors (left), cold daylight outside; the visitor's silhouette at them
  fill(b, 14, 50, 90, 100, PAL.N3); fill(b, 18, 54, 40, 96, PAL.C6); fill(b, 62, 54, 40, 96, PAL.C6); fill(b, 58, 54, 4, 96, PAL.N2);
  if (st.visitor) visitor.draw(b, 44, 150, {arm: 'down', head: {hair: 'short'}}, {map: () => PAL.N1});
  // the birdcage at the doors, brand new: its tag, its padlock
  drawBirdcage(b, 140, 160, {tag: true, padlock: st.padlock ?? 'open', door: st.door ?? 'open', phone: st.cage === 'phone', f});
  // Nole's post lamp on a tall stand, his standing spot by it
  const LX = 330;
  fill(b, LX, 84, 3, 100, PAL.G3); fill(b, LX - 14, 182, 31, 3, PAL.G3); fill(b, LX - 22, 78, 20, 8, PAL.G4); fill(b, LX - 4, 80, 8, 2, PAL.G4);
  const lampOn = (st.lamp ?? 'on') === 'on';
  if (lampOn) { fill(b, LX - 20, 86, 16, 2, PAL.W8); for (let y = 88; y < 190; y++) for (let x = 240; x < 380; x++) { const d = Math.hypot((x - (LX - 12)) / 64, (y - 160) / 76); if (d < 1 && bayer(x, y) < (1 - d) * 0.6) b.set(x, y, stepColor(b.get(x, y), 1)); } }
  if (st.nole !== null) blitImg(b, noleImg({...NOLE_BASE, arm: 'phone', ...st.nole}), 292 - NOLE_FOOT[0], 186 - NOLE_FOOT[1]);
};
export const cageECU = (b: Buf, f: number, st: {k?: number} = {}) => {
  vramp(b, 0, 0, 480, RH, [PAL.N0, PAL.N1, PAL.N1]);
  // the bars close, the phone behind them on the cage's floor, buzzing on 2s, replies stacking up its screen
  const bz = Math.floor(f / 2) % 2;
  // the phone face up on the cage floor (its screen's glow on the bars), the bezel's lit edge
  fill(b, 168 + bz, 36, 144, 154, PAL.N0); fill(b, 168 + bz, 36, 144, 1, PAL.G3); fill(b, 168 + bz, 36, 1, 154, PAL.G2);
  fill(b, 175 + bz, 44, 130, 140, PAL.C1);
  const n = Math.min(9, st.k ?? 6);
  for (let i = 0; i < n; i++) { const y = 168 - i * 14; fill(b, 180 + bz, y, 120, 11, PAL.C2); fill(b, 183 + bz, y + 2, 7, 7, PAL.C4); fill(b, 194 + bz, y + 3, 72 - (i * 13) % 30, 2, PAL.C5); fill(b, 194 + bz, y + 7, 40 - (i * 7) % 20, 1, PAL.C3); }
  // buzzing: the shake lines either side, on 2s
  if (bz) for (const [x, d] of [[156, -1], [326, 1]] as Array<[number, number]>) for (let k = 0; k < 3; k++) for (let i = 0; i < 6; i++) b.set(x + d * (i >> 1) + d * k * 5, 90 + k * 30 + i, PAL.C6);
  for (let x = 120; x < 380; x += 16) { fill(b, x, 0, 4, RH, PAL.W5); fill(b, x, 0, 1, RH, PAL.W7); }
  fill(b, 100, 186, 300, 6, PAL.W4);
};

export const ART: ArtAsset[] = [{
  id: 'set22-zai', manifest: 'SET-22 · the zAI lobby · §2.2 a VISITOR · §3 the birdcage, the padlock, the caged phone', kind: 'set', name: 'The zAI lobby: the brand-new birdcage, the KORG 2 banner, Nole\'s lamp',
  file: 'sets/zai.ts', exports: 'zaiLobby, cageECU, drawBirdcage', scenes: '20',
  note: 'a converted warehouse, cold; the cage\'s shipping tag still on; the visitor a silhouette (no line, no face); his phone locked in, buzzing, nothing legible',
  stills: [
    {label: '[W] 20.01-20.03: the cage at the doors (tag, open padlock), the banner KORG 2: NEXT QUARTER, Nole under his lit lamp, phone up; the visitor at the glass', draw: (b) => zaiLobby(b, 0, {visitor: true})},
    {label: '[ECU] 20.04: his own phone inside the locked cage, buzzing, the replies stacking where he can\'t reach them', draw: (b) => cageECU(b, 1, {k: 7})},
  ],
}];
void rect; void clamp; void poly; void pt; void pw; void tiny; void tinyWidth; void TR; void dith; void hash;
