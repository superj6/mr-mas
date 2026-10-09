// MR. MAS — Ep2 v1 art: SET-05, XEL'S STUDIO (sc 6) and the podcast player's chrome (2.D). A black curtain, two chairs,
// ONE MIC ON A STAND IN FIVE HELD SIZES (four hops: it grows one size on each of XEL's long pauses, never while Mas
// talks), all inside a plain podcast player's chrome (no show name, no logo) with its chapter counter in six states
// (`CH. 1 OF 6` … `CH. 6 OF 6`) and a `REC` light that goes out. One locked two-shot drawing is the mic's meter frame.
//   studio2S(b, f, st)        [2S] the locked drawing in its chrome: st {mic: 1..5, ch: 1..6, rec: true, xel: XelSeatPose,
//                             mas: MasSeatedPose parts, squeeze: 0..2 (Mas pressed against the curtain by the giant mic),
//                             part: 0..1 (the curtain parting, the match cut)}
//   studioMCU(b, f, st)       [MCU] Mas against the curtain, screen-left facing camera-right (toward XEL), a face light
//   playerChrome(b, st)       the chrome alone over a picture rect (CHROME.pic): the counter, the REC light, a scrubber
//   chromeInsert(b, st)       [INSERT] 6.09: the chrome close: the counter ticking to CH. 6 OF 6 and the REC light out
//   drawMic(b, cx, floorY, size)  the mic on its stand at a held size (1 small .. 5 fills the frame)
import {Buf, rect, line, ellipse, bayer, hash} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {drawMasSeated, MAS_SEATED_DEFAULT, MasSeatedPose} from '../../../../../shared/pixel/cast/mas-seated';
import {masPortrait, MAS_PORTRAIT_DEFAULT, MasPortraitState} from '../../../../../shared/pixel/cast/mas';
import {putBust} from '../../../../../shared/pixel/rooms/bullpen-launch';
import {drawCollarsPortrait} from '../../../../../shared/pixel/cast/mas-collars';
import {faceKey} from '../../../../../shared/pixel/kits/face-light';
import {drawXelSeated, studioChair, XelSeatPose} from '../cast/xel';
import {fill, pt, pw, bpt, bpw, tiny, RH, vramp, Rect} from '../kit';
import type {ArtAsset} from '../asset';

export const CHROME = {pic: {x: 40, y: 18, w: 400, h: 160} as Rect};
/** the black curtain: vertical folds, lit from the front-left (a soft warm studio key), the floor's dark gloss */
const curtain = (b: Buf, r: Rect, part = 0) => {
  for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) {
    const u = (x - r.x) % 14, fold = u < 3 ? 0 : u < 7 ? 2 : u < 11 ? 1 : 0;
    const fl = y > r.y + r.h - 22;
    let c = fl ? (bayer(x, y) < 0.2 ? PAL.N2 : PAL.N1) : [PAL.N0, PAL.N1, PAL.N2][fold];
    if (!fl && fold === 2 && x < r.x + r.w * 0.45 && bayer(x, y) < 0.4) c = PAL.N3;
    b.set(x, y, c);
  }
  if (part) { const cx = r.x + (r.w >> 1), gap = Math.round(part * 60); fill(b, cx - gap, r.y, gap * 2, r.h - 22, PAL.N4); }
};
/** the mic on its stand: five held sizes (the capsule, the grille, the shock mount, the boom, the stand's foot) */
export const drawMic = (b: Buf, cx: number, floorY: number, size: 1 | 2 | 3 | 4 | 5) => {
  const S = [1, 1.6, 2.5, 3.8, 6][size - 1];
  const hw = Math.round(5 * S), hh = Math.round(11 * S);
  // the capsule's top per size: the stand stops growing at size 3, the capsule keeps growing up into the frame
  const top = floorY - [82, 104, 128, 140, 148][size - 1];
  // the stand's foot and pole
  fill(b, cx - Math.round(12 * Math.min(S, 2)), floorY - 2, Math.round(24 * Math.min(S, 2)), 2, PAL.G2);
  fill(b, cx - 1, top + hh, 2 + Math.round(S / 2), floorY - top - hh, PAL.G3);
  // the capsule: a rounded grille (lit edge left), a dark band, the shock mount ring
  for (let j = 0; j < hh; j++) for (let i = -hw; i <= hw; i++) {
    const d = Math.hypot(i / hw, (j - hh / 2) / (hh / 2 + 0.5));
    if (d >= 1) continue;
    const grid = (i + j) % Math.max(2, Math.round(S * 1.5)) === 0;
    b.set(cx + i, top + j, d > 0.85 ? (i < 0 ? PAL.G6 : PAL.G2) : grid ? PAL.G2 : i < -hw * 0.3 ? PAL.G5 : PAL.G4);
  }
  fill(b, cx - hw, top + Math.round(hh * 0.62), hw * 2 + 1, Math.max(1, Math.round(S)), PAL.N1);
  ellipse(cx, top + hh + Math.round(2 * S), hw + 2, Math.max(1, Math.round(2 * S)), b.ink(PAL.N2));
  // its level meter (the meter frame's joke: it never moves while Mas talks): a tiny lit strip on the stand
  fill(b, cx + hw + 3, top + hh - Math.round(6 * S), 2, Math.round(6 * S), PAL.N1);
};
/** the player chrome over a picture rect: no show name, no logo; the chapter counter, the REC light, the scrubber */
export const playerChrome = (b: Buf, st: {ch: number; rec: boolean; pic?: Rect; progress?: number}) => {
  const r = st.pic ?? CHROME.pic;
  // the bezel round the picture
  fill(b, r.x - 6, r.y - 14, r.w + 12, 14, PAL.N1); fill(b, r.x - 6, r.y + r.h, r.w + 12, 20, PAL.N1);
  fill(b, r.x - 6, r.y - 14, 6, r.h + 34, PAL.N1); fill(b, r.x + r.w, r.y - 14, 6, r.h + 34, PAL.N1);
  fill(b, r.x - 6, r.y - 14, r.w + 12, 1, PAL.N3);
  // the REC light and its word (top left), the chapter counter (top right)
  if (st.rec) { ellipse(r.x + 4, r.y - 7, 3, 3, b.ink(PAL.R3)); b.set(r.x + 3, r.y - 8, PAL.W8); } else ellipse(r.x + 4, r.y - 7, 3, 3, b.ink(PAL.N3));
  pt(b, 'REC', r.x + 10, r.y - 11, st.rec ? PAL.R3 : PAL.N4);
  const c = `CH. ${st.ch} OF 6`;
  fill(b, r.x + r.w - pw(c) - 10, r.y - 13, pw(c) + 8, 11, PAL.N0); pt(b, c, r.x + r.w - pw(c) - 6, r.y - 11, PAL.P2);
  // the scrubber with six chapter ticks, filled to the current chapter
  const sy = r.y + r.h + 8, sx0 = r.x + 24, sw = r.w - 48;
  fill(b, sx0, sy, sw, 2, PAL.N3);
  fill(b, sx0, sy, Math.round(sw * (st.progress ?? (st.ch - 0.5) / 6)), 2, PAL.R2);
  for (let k = 1; k < 6; k++) fill(b, sx0 + Math.round((sw * k) / 6), sy - 2, 1, 6, PAL.N5);
  // play / pause glyph
  fill(b, r.x + 6, sy - 2, 2, 6, PAL.P1); fill(b, r.x + 10, sy - 2, 2, 6, PAL.P1);
};
export interface StudioSt { mic?: 1 | 2 | 3 | 4 | 5; ch?: number; rec?: boolean; xel?: Partial<XelSeatPose>; mas?: Partial<MasSeatedPose>; squeeze?: 0 | 1 | 2; part?: number }
export const studio2S = (b: Buf, f: number, st: StudioSt = {}) => {
  const s = {mic: 1 as 1 | 2 | 3 | 4 | 5, ch: 1, rec: true, squeeze: 0 as 0 | 1 | 2, part: 0, ...st};
  fill(b, 0, 0, 480, RH, PAL.N0);
  const r = CHROME.pic;
  const t = new Buf(480, 270, PAL.N0);
  curtain(t, r, s.part);
  // the chairs: two plain studio chairs (black leather, chrome legs)
  const floorY = r.y + r.h - 10;
  // the chairs (tall studio chairs, each sitter's back to its chair's back), then the sitters on their seat lines
  studioChair(t, r.x + 92 - s.squeeze * 30, floorY - 34, floorY, -1);
  studioChair(t, r.x + r.w - 96, floorY - 34, floorY, 1);
  drawMasSeated(t, r.x + 92 - s.squeeze * 30, floorY - 34, {...MAS_SEATED_DEFAULT, arm: 'hold', collars: 3, ...s.mas});
  drawXelSeated(t, r.x + r.w - 96, floorY - 34, {...s.xel});
  drawMic(t, r.x + (r.w >> 1) - (s.mic === 5 ? 30 : 0), floorY, s.mic);
  for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) b.set(x, y, t.c[y * 480 + x]);
  playerChrome(b, {ch: s.ch, rec: s.rec});
};
export const studioMCU = (b: Buf, f: number, st: {mas?: Partial<MasPortraitState>; face?: number} = {}) => {
  curtain(b, {x: 0, y: 0, w: 480, h: RH});
  const ms: MasPortraitState = {...MAS_PORTRAIT_DEFAULT, light: 'warm', ...st.mas};
  putBust(b, masPortrait(ms), 70, 44, {flip: true});
  drawCollarsPortrait(b, 70, 44, 3, {head: ms.head ?? '34', light: 'warm'});
  faceKey(b, 70, 44, 182, 150, st.face ?? 1, 1);
};
export const chromeInsert = (b: Buf, st: {ch: number; rec: boolean}) => {
  // the chrome's top bar filling the frame (the counter and the REC light large)
  vramp(b, 0, 0, 480, RH, [PAL.N1, PAL.N1, PAL.N2]);
  fill(b, 0, 60, 480, 70, PAL.N0); fill(b, 0, 60, 480, 2, PAL.N3);
  ellipse(60, 95, 14, 14, b.ink(st.rec ? PAL.R3 : PAL.N3)); if (st.rec) { fill(b, 54, 87, 4, 3, PAL.W8); }
  bpt(b, 'REC', 86, 88, st.rec ? PAL.R3 : PAL.N4);
  const c = `CH. ${st.ch} OF 6`;
  bpt(b, c, 440 - bpw(c), 88, PAL.P2);
};

export const ART: ArtAsset[] = [{
  id: 'set05-studio', manifest: 'SET-05 · XEL\'s studio (2.D the player chrome)', kind: 'set', name: 'XEL\'s studio: the curtain, two chairs, the mic in five sizes, the player\'s chrome',
  file: 'sets/studio.ts', exports: 'studio2S, studioMCU, playerChrome, chromeInsert, drawMic, CHROME', scenes: '6',
  note: 'the locked 2S is the meter frame: the mic hops a size on each pause (1..5), the counter CH. 1..6 OF 6, the REC light goes out; no show name or logo',
  stills: [
    {label: '[2S] 6.01: CH. 1 OF 6 · REC, the mic at size 1, Mas (screen-left, his glass) and XEL (screen-right)', draw: (b) => studio2S(b, 0, {mic: 1, ch: 1})},
    {label: '[2S] 6.08: the mic at size 5, filling the frame, Mas leaning around it; CH. 5 OF 6', draw: (b) => studio2S(b, 0, {mic: 5, ch: 5, squeeze: 1, xel: {lean: 1}})},
    {label: '[MCU] 6.07 Mas against the curtain, a face light', draw: (b) => studioMCU(b, 0)},
    {label: '[INSERT] 6.09 CH. 6 OF 6, the REC light out', draw: (b) => chromeInsert(b, {ch: 6, rec: false})},
  ],
}];
void rect; void line; void hash; void stepColor; void tiny;
