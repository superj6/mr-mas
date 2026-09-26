// MR. MAS — cast: the act-4 EXPRESSION SWAPS (Ep1). New file, owned by the act-4 insert + expression artist. Each swap
// is a replacement drawing of the eyes (and brows) patched into the owner's approved portrait, so every mouth in the
// speaking set still works under it (the patch never touches the mouth rows). Nothing here edits the owners' files.
//
//   masLookDown        sc 30 [PF] "hi.": MAS at his desk looking down at the floor (the floor is Tasya). The upper
//                      lids come down a row, the irises sit at the bottom of the opening, the catchlights go (he is
//                      looking away from the monitor). Brows unchanged: calm. Works with every Mas mouth + both lights.
//   alyiLookUp         sc 30 [P2]: ALYI looks up at the three hearts hanging at the edge of his window (up and toward
//                      camera-left, where the hearts are). The irises lift a row and step left, the white shows under
//                      them, the brows lift one pixel. His real face: sincere, never a joke, never pleading.
//   gergGlance         sc 29 quiet beat [POV]: GERG, typing (eyes down at his screen: the tile's standing state), glances
//                      up into his camera, at Mas: the lids open, the irises come to the lens, the brows lift a pixel,
//                      the head lifts a pixel. His real face. drawGergTileWide fills the room area with his tile.
import {Buf, rect, bayer} from '../px';
import {PAL} from '../palette';
import {Img, blitImg} from '../figure';
import {memo} from './kit';
import {masPortrait, MasPortraitState, drawMasPortrait} from './mas';
import {alyiSpeakPortrait, AlyiSpeakState} from './alyi-speak';
import {gergGlow, GergSpeakState} from './gerg-speak';
import {GERG_PW, GERG_PH, gergTypeAt} from './gerg';
import {lightPool, blitTo} from './kit';
import {clipped, tileClip} from './calltile';

type Px = Array<[number, number, string]>;
/** write a row of chars at (x, y): '.' leaves the pixel, other chars index `pal` */
const rowPatch = (x: number, y: number, s: string): Px => [...s].map((c, i) => [x + i, y, c] as [number, number, string]).filter((p) => p[2] !== '.');
const applyPatch = (src: Img, px: Px, pal: Record<string, number>): Img => {
  const out: Img = {w: src.w, h: src.h, c: new Int32Array(src.c)};
  for (const [x, y, c] of px) { const v = pal[c]; if (v === undefined || x < 0 || y < 0 || x >= src.w || y >= src.h) continue; out.c[y * src.w + x] = v; }
  return out;
};
const at = (img: Img, x: number, y: number) => img.c[y * img.w + x];

// ================================================================== MAS: looking down (sc 30 [PF] "hi.")
/**
 * The near eye (x 50-60) and the far eye (x 37-42), rows 47-51 of the portrait (after its 3 px head drop):
 *   row 47: the old lid top -> socket skin (the lid has come down)
 *   rows 48-49: the lowered lid + its lashes
 *   row 50: the visible iris, its pupil at the bottom (looking down), no catchlight
 *   row 51: the lower lid (unchanged)
 * Sclera and skin are sampled from the owner's render so both lights ('monitor', 'warm') work.
 */
export const masLookDown = memo((s: Omit<MasPortraitState, 'lid' | 'look'> & {lid?: 0 | 1 | 2; look?: -1 | 0 | 1}): Img => {
  const base = masPortrait({...s, lid: 0, look: 0} as MasPortraitState);
  const skinN = at(base, 51, 46), skinF = at(base, 38, 46), scl = at(base, 51, 49), sclF = at(base, 41, 49);
  const iris = PAL.B3, lid = PAL.N0;
  const px: Px = [
    // near eye
    ...rowPatch(51, 47, 'ssssssss'),
    ...rowPatch(50, 48, 'sLLLLLLLLLs'),
    ...rowPatch(49, 49, 'LLLLLLLLLLLL'),
    ...rowPatch(50, 50, 'wiiIIIIiiww'),
    // far eye
    ...rowPatch(38, 47, 'ttt'),
    ...rowPatch(37, 48, 'tLLLLt'),
    ...rowPatch(37, 49, 'LLLLLL'),
    ...rowPatch(38, 50, 'iIIv'),
  ];
  return applyPatch(base, px, {s: skinN, t: skinF, L: lid, w: scl, v: sclF, i: iris, I: PAL.N0});
});
/** drop-in for drawMasPortrait with the look-down swap (the [PF] steps the room down behind it; the face isn't relit) */
export const drawMasLookDown = (b: Buf, x: number, y: number, s: Omit<MasPortraitState, 'lid' | 'look'>, w = 112, h = 136) => {
  drawMasPortrait(b, x, y, {...s, lid: 0, look: 0} as MasPortraitState, w, h);
  blitTo(b, masLookDown(s), x, y, {clip: (px, py) => px >= x && py >= y && px < x + w && py < y + h});
};

// ================================================================== ALYI: looking up at the hearts (sc 30 [P2])
/**
 * alyi.ts's eyes sit in deep sockets (S0) under a heavy brow: near x 49-58, far x 38-43, rows 48-49 (after his 3 px
 * drop), brows rows 43-44. Looking up and toward camera-left: the irises rise into row 47 and step a pixel left, the
 * white (S2) shows under them in row 49, the brows lift to rows 42-43 (row 44 becomes the lit brow ridge).
 */
export const alyiLookUp = memo((s: AlyiSpeakState): Img => {
  const base = alyiSpeakPortrait({...s, eyes: 'open'});
  const ridge = at(base, 47, 42); // the lit brow-ridge skin just above the brows
  const px: Px = [
    // brows up one pixel: the new top row, then the old bottom row becomes ridge skin
    ...rowPatch(49, 42, 'bbbbbbbbbbbbb'),
    ...rowPatch(36, 43, 'bbbbbbb'),
    ...rowPatch(48, 44, 'RRRRRRRRRRRRRR'),
    ...rowPatch(37, 45, 'RRRR'),
    // near eye: the iris up a row and a pixel toward camera-left, the white showing under it
    ...rowPatch(50, 47, 'oviIgio'),
    ...rowPatch(50, 48, 'oviIIivvo'),
    ...rowPatch(50, 49, 'owwwwwwo'),
    // far eye
    ...rowPatch(38, 47, 'viIg'),
    ...rowPatch(38, 48, 'oiIIvo'),
    ...rowPatch(38, 49, 'owwwo'),
  ];
  return applyPatch(base, px, {b: PAL.B0, R: ridge, o: PAL.S0, v: PAL.S2, w: PAL.S3, i: PAL.B2, I: PAL.N0, g: PAL.W8});
});

// ================================================================== GERG: the glance into his camera (sc 29)
/**
 * The typing state is the tile's standing drawing (gerg-speak's lid 1: eyes down at the screen, one row of eye). The
 * glance swaps in the open lids with the irises at the lens (lid 0, look 0), lifts the brows a pixel and carries the
 * screen's green catchlight low in each eye (the light is below his webcam).
 */
export type GergEyes = 'screen' | 'lens';
export const gergGlance = memo((s: {mouth: GergSpeakState['mouth']; eyes: GergEyes}): Img => {
  if (s.eyes === 'screen') return gergGlow({mouth: s.mouth, lid: 1, look: 0});
  const base = gergGlow({mouth: s.mouth, lid: 0, look: 0});
  const skin = at(base, 45, 43);
  const px: Px = [
    ...rowPatch(47, 40, 'bbbbbbbbbbbbbbb'),
    ...rowPatch(47, 42, 'sssssssssssssss'),
    ...rowPatch(35, 41, 'bbbbbb'),
    ...rowPatch(35, 43, 'ssssss'),
  ];
  const out = applyPatch(base, px, {b: PAL.B0, s: skin});
  // the screen's catchlight low in each iris (green, from below)
  for (const [x, y] of [[54, 51], [39, 51]] as Array<[number, number]>) if (out.c[y * out.w + x] === PAL.N0 || out.c[y * out.w + x] === PAL.B2) out.c[y * out.w + x] = PAL.L3;
  return out;
});
/**
 * His video tile at any size with the glance swap. `lift` = the glance's 1 px head lift (pass it with eyes 'lens').
 * Typing bob as drawGergTile (gerg.ts rhythm) while 'screen'; he holds still for the glance.
 */
export const drawGergTileGlance = (b0: Buf, x: number, y: number, w: number, h: number, o: {eyes: GergEyes; f?: number; mouth?: GergSpeakState['mouth']}) => {
  const clip = tileClip(x, y, w, h);
  const b = clipped(b0, clip);
  rect(x, y, w, h, b.ink(PAL.N1));
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const d = Math.hypot((i - w / 2) / (w * 0.55), (h - j) / (h * 0.9));
    const bz = bayer(x + i, y + j);
    if (d < 0.55) b.set(x + i, y + j, d < 0.38 ? PAL.L0 : bz < (0.55 - d) / 0.17 ? PAL.L0 : PAL.N1);
  }
  const f = o.f ?? 0;
  const typing = o.eyes === 'screen';
  const bob = typing && gergTypeAt(f) === 1 ? 1 : 0;
  const lift = o.eyes === 'lens' ? -1 : 0;
  const img = gergGlance({mouth: o.mouth ?? 'rest', eyes: o.eyes});
  blitImg(b0, img, x + Math.round(w / 2 - GERG_PW / 2) + 6, y + h - GERG_PH + 40 + bob + lift, {clip});
  rect(x, y + h - 4, w, 4, b.ink(PAL.N0)); rect(x, y + h - 5, w, 1, b.ink(PAL.L1));
  if (typing) {
    const k = Math.floor(f / 3) % 6;
    const kx = x + 14 + ((f * 7) % 30), ky = y + h - 8 - [0, 3, 5, 5, 3, 0][k];
    rect(kx, ky, 3, 2, b.ink(PAL.G4)); b.set(kx, ky, PAL.G6);
  }
};
/**
 * sc 29's quiet beat [POV]: "Gerg's tile fills the frame at medium tile scale": the tile as the whole room area
 * (480 x 203), his bust centred low, the call chrome's thin frame. (If the medium-rig builder's Gerg tile is used
 * instead, port the same swap: lids open, irises to the lens, brows +1 px, head +1 px, green catchlight low.)
 */
export const drawGergTileWide = (b: Buf, o: {eyes: GergEyes; f?: number; mouth?: GergSpeakState['mouth']}) => {
  const W = 480, H = 203;
  // his room behind him, dark: a wall, a shelf's edge, the laptop's green pool rising from below the frame
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const t = y / H + (bayer(x, y) - 0.5) * 0.08;
    b.set(x, y, t < 0.6 ? PAL.N1 : PAL.N2);
  }
  rect(300, 58, 150, 2, b.ink(PAL.N2)); rect(300, 60, 150, 1, b.ink(PAL.N0));
  for (const [x, w, c] of [[312, 6, PAL.N3], [320, 4, PAL.U1], [326, 7, PAL.N3], [372, 5, PAL.U0]] as Array<[number, number, number]>) rect(x, 40, w, 18, b.ink(c));
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const d = Math.hypot((x - W / 2) / 190, (H + 30 - y) / 150);
    const bz = bayer(x, y);
    if (d < 1) b.set(x, y, d < 0.62 ? PAL.L0 : bz < (1 - d) / 0.38 ? PAL.L0 : b.get(x, y));
  }
  const f = o.f ?? 0;
  const typing = o.eyes === 'screen';
  const bob = typing && gergTypeAt(f) === 1 ? 1 : 0;
  const lift = o.eyes === 'lens' ? -1 : 0;
  const img = gergGlance({mouth: o.mouth ?? 'rest', eyes: o.eyes});
  blitImg(b, img, Math.round(W / 2 - GERG_PW / 2) + 6, 56 + bob + lift);
  // the laptop's lid across the bottom (the webcam is in it), its green edge; keycaps while he types
  rect(0, H - 14, W, 14, b.ink(PAL.N0)); rect(0, H - 15, W, 1, b.ink(PAL.L1));
  if (typing) {
    const k = Math.floor(f / 3) % 6;
    const kx = 180 + ((f * 7) % 90), ky = H - 20 - [0, 4, 7, 7, 4, 0][k];
    rect(kx, ky, 4, 3, b.ink(PAL.G4)); rect(kx, ky, 4, 1, b.ink(PAL.G6));
  }
  // the tile's frame (a 1px keyline) and its name plate
  rect(0, 0, W, 1, b.ink(PAL.N0)); rect(0, H - 1, W, 1, b.ink(PAL.N0)); rect(0, 0, 1, H, b.ink(PAL.N0)); rect(W - 1, 0, 1, H, b.ink(PAL.N0));
};
void lightPool;
