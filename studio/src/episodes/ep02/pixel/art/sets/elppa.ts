// MR. MAS — Ep2 v1 art: SET-19, ELPPA'S CAMPUS, THE KEYNOTE CROWD (sc 19, 20) and SET-20, F2.1: THE 2006 STREET CORNER
// (EARLY-WEB16; YOUNG MAS, §2.1) and THE 2008 KEYNOTE STAGE (a copy of the intro's frame, f21/era2008.ts). Generic
// architecture in ELPPA's off-brand silver, white and black: no real building, logo or trade dress (low white pavilions,
// glass, plane trees; never a ring).
//   campus(b, f, st)            [W] 19.07-19.08 / 20.01: the lawn, the backs of the crowd, a giant outdoor screen showing
//                               the keynote (an immaculate stage of the show's design) and, st.chat, the stream's chat
//                               lighting with his post; st.thin 0..1 (the crowd thinning, sc 20), st.endcard; Mas at the
//                               crowd's edge (the cast), st.buzz (phones buzzing across the lawn)
//   streamCrowd(b, r, f)        painter for the lobby's wall screen (19.06): the stream cutting away to its outdoor
//                               audience, our stream's UI, small at its edge Mas, head down over his phone
//   keynotePainter(b, r, st)    the keynote's own picture (its walk-on stage, the `…AND LATER THIS YEAR: CHATGTP.` slide)
//   corner2006(b, f, st)        [W] 19.12: a street corner, 2006, a phone ad in EARLY-WEB16: YOUNG MAS holding up a flip
//                               phone and grinning, a GPS pin bobbing over his head; st.card = the end card WHERE YOU AT?
//   stage2008(b, g, st)         [W] 19.13-19.14: the intro's 2008 frame (THE SLEEVE tosses the clicker, Mas catches it,
//                               the collars pop), its big screen showing TPOOL's map: st.grey 0..8 pins greyed, then its
//                               corner LAST UPDATED 2012 (no cause claimed)
//   breadcrumb(b, k)            [POV] 19.11: a dotted GPS line drawing itself across the stream's stage in older colours
//   matchClicker(b, f, st)      [ECU · MATCH] 19.15: the clicker in his 2008 hand becomes his 2024 phone in the same grip,
//                               his post from the lawn on its screen (st.phone)
import {Buf, rect, line, ellipse, bayer, hash, clamp, poly} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {applyPalette} from '../../../../../shared/pixel/palettes';
import {fill, pt, pw, pwrap, bpt, bpw, tiny, tinyWidth, vramp, RH, TR, dith, grip, HANDSKIN, capsule, Rect} from '../kit';
import {crowdBacks} from '../cast/civic2';
import {drawMasStand2} from '../cast/mas2';
import {drawMasKid, masKid} from '../../../../../shared/pixel/cast/mas';
import {draw2008} from '../f21/era2008';
import {mas08, M08_FOOT} from '../f21/mas08';
import {blitImg} from '../../../../../shared/pixel/figure';
import {drawCollarsStand} from '../../../../../shared/pixel/cast/mas-collars';
import type {ArtAsset} from '../asset';

// ------------------------------------------------------------------ the keynote's picture and the campus
export const keynotePainter = (b: Buf, r: Rect, st: {slide?: 'stage' | 'later' | 'end'; chat?: number; f?: number} = {}) => {
  // an immaculate stage of the show's own design: white floor, a pale gradient wall, one presenter small at a lectern
  vramp(b, r.x, r.y, r.w, r.h, [PAL.G6, PAL.P1, PAL.P2]);
  fill(b, r.x, r.y + Math.round(r.h * 0.78), r.w, r.h - Math.round(r.h * 0.78), PAL.P2);
  if (st.slide === 'later') { const s1 = '...AND LATER THIS YEAR:', s2 = 'CHATGTP.'; pt(b, s1, r.x + Math.round(r.w / 2 - pw(s1) / 2), r.y + Math.round(r.h * 0.3), PAL.N1); bpt(b, s2, r.x + Math.round(r.w / 2 - bpw(s2) / 2), r.y + Math.round(r.h * 0.45), PAL.N1); }
  else if (st.slide === 'end') { fill(b, r.x, r.y, r.w, r.h, PAL.N0); const s = 'ELPPA'; bpt(b, s, r.x + Math.round(r.w / 2 - bpw(s) / 2), r.y + Math.round(r.h / 2 - 7), PAL.G6); }
  else { fill(b, r.x + Math.round(r.w / 2) - 2, r.y + Math.round(r.h * 0.5), 4, Math.round(r.h * 0.28), PAL.N1); fill(b, r.x + Math.round(r.w / 2) - 1, r.y + Math.round(r.h * 0.44), 3, 4, PAL.S3); }
  if (st.chat) {
    // the stream's chat down the right edge, lighting with his post (the top message, cyan)
    const cw = Math.min(110, Math.round(r.w * 0.34)), cx = r.x + r.w - cw;
    fill(b, cx, r.y, cw, r.h, PAL.N1); fill(b, cx, r.y, 1, r.h, PAL.N3);
    for (let k = 0; k < 6; k++) fill(b, cx + 4, r.y + r.h - 12 - k * 12, cw - 8 - ((k * 13) % 30), 3, PAL.N4);
    if (st.chat >= 2) { fill(b, cx + 2, r.y + 4, cw - 4, 22, PAL.C2); fill(b, cx + 2, r.y + 4, cw - 4, 1, PAL.C6); tiny(b, 'MAS', cx + 4, r.y + 6, PAL.C8); fill(b, cx + 4, r.y + 13, cw - 14, 2, PAL.C7); fill(b, cx + 4, r.y + 18, cw - 30, 2, PAL.C7); }
  }
};
/** generic pavilions: low white boxes with glass bands and flat roofs, plane trees between them (no real building) */
const pavilions = (b: Buf) => {
  vramp(b, 0, 0, 480, 90, [PAL.C7, PAL.C8, PAL.P2]);
  for (const [x, w, h] of [[0, 120, 36], [150, 90, 28], [330, 150, 40]] as Array<[number, number, number]>) { fill(b, x, 90 - h, w, h, PAL.P2); fill(b, x, 90 - h, w, 2, PAL.W9); fill(b, x, 90 - h + 10, w, 10, PAL.C6); for (let i = 0; i < w; i += 12) fill(b, x + i, 90 - h + 10, 1, 10, PAL.G5); }
  for (const tx of [130, 250, 300, 460]) { ellipse(tx, 66, 14, 12, b.ink(PAL.L2)); ellipse(tx - 3, 63, 9, 7, b.ink(PAL.L3)); fill(b, tx - 1, 76, 2, 14, PAL.D2); }
};
export const campus = (b: Buf, f: number, st: {chat?: number; thin?: number; endcard?: boolean; buzz?: boolean} = {}, cast?: (b: Buf) => void) => {
  pavilions(b);
  // the lawn
  vramp(b, 0, 90, 480, RH - 90, [PAL.L2, PAL.L1, PAL.L1]);
  for (let k = 0; k < 120; k++) b.set(Math.floor(hash(k, 1, 7) * 480), 92 + Math.floor(hash(k, 2, 7) * 110), PAL.L3);
  // the giant outdoor screen on its truss
  const S = {x: 200, y: 8, w: 230, h: 112};
  fill(b, S.x - 6, S.y - 6, S.w + 12, S.h + 12, PAL.N0); fill(b, S.x + 20, S.y + S.h + 6, 4, 60, PAL.G3); fill(b, S.x + S.w - 24, S.y + S.h + 6, 4, 60, PAL.G3);
  keynotePainter(b, S, {slide: st.endcard ? 'end' : 'stage', chat: st.chat, f});
  // the crowd's backs, filling the lawn toward the screen; thinning in sc 20
  const rows = Math.max(1, Math.round(5 * (1 - (st.thin ?? 0))));
  crowdBacks(b, 150, 480, 150, rows, f, {seed: 6, light: PAL.P1, phones: st.buzz ? [1, 3, 5] : []});
  cast?.(b);
};
export const streamCrowd = (b: Buf, r: Rect, f = 0) => {
  // the stream's cutaway: the lawn crowd from above the stage, our stream's UI chrome, Mas small at its edge
  const t = new Buf(480, 270, PAL.N0);
  campus(t, f, {}, (bb) => drawMasStand2(bb, 120, 188, {arm: 'phone', bow: true}));
  for (let j = 0; j < r.h; j++) for (let i = 0; i < r.w; i++) b.set(r.x + i, r.y + j, t.c[Math.floor(40 + (j * 160) / r.h) * 480 + Math.floor(60 + (i * 300) / r.w)]);
  fill(b, r.x + 3, r.y + 3, 22, 8, PAL.R2); tiny(b, 'LIVE', r.x + 5, r.y + 4, PAL.P2);
  fill(b, r.x, r.y + r.h - 8, r.w, 8, PAL.N1); fill(b, r.x + 4, r.y + r.h - 5, Math.round(r.w * 0.6), 2, PAL.R2);
};

// ------------------------------------------------------------------ F2.1: 2006 and 2008
/** a flip phone (room scale), open, its screen lit */
const flipPhone = (b: Buf, x: number, y: number) => { fill(b, x, y, 6, 8, PAL.G4); fill(b, x + 1, y + 1, 4, 5, PAL.C6); fill(b, x, y + 8, 6, 8, PAL.G3); for (let k = 0; k < 3; k++) b.set(x + 2, y + 10 + k * 2, PAL.G5); };
/** the GPS pin bobbing over his head (2006 web red) */
const gpsPin = (b: Buf, x: number, y: number) => { poly([x - 4, y - 10, x + 4, y - 10, x + 4, y - 6, x, y, x - 4, y - 6], b.ink(PAL.R2)); ellipse(x, y - 8, 4, 4, b.ink(PAL.R3)); fill(b, x - 1, y - 9, 2, 2, PAL.P2); };
export const corner2006 = (b: Buf, f: number, st: {card?: boolean} = {}) => {
  // a street corner: a lamppost, a newsstand's awning, a crosswalk, a bus-stop ad frame; daylight
  vramp(b, 0, 0, 480, 120, [PAL.C6, PAL.C7, PAL.P1]);
  for (const [x, w, h] of [[0, 90, 90], [96, 70, 110], [172, 60, 80], [300, 100, 120], [404, 76, 96]] as Array<[number, number, number]>) { fill(b, x, 120 - h, w, h, PAL.G4); for (let yy = 130 - h; yy < 116; yy += 10) for (let xx = x + 6; xx < x + w - 6; xx += 10) fill(b, xx, yy, 5, 6, PAL.C5); }
  fill(b, 0, 120, 480, 30, PAL.G5); fill(b, 0, 150, 480, 53, PAL.G3); for (let x = 0; x < 480; x += 20) fill(b, x, 168, 12, 26, PAL.P2);
  fill(b, 60, 40, 3, 110, PAL.N2); fill(b, 52, 38, 18, 4, PAL.N3);
  // YOUNG MAS (2006): the intro's young-Mas stage drawing (f21/mas08, a copy: his polo, collars flat), presenting a
  // flip phone to the camera with a grin; a GPS pin bobbing over his head
  const img = mas08({arm: 'present', lid: 0, mouth: 'smile', look: 1}, 0, -1);
  blitImg(b, img, 240 - M08_FOOT[0], 186 - M08_FOOT[1]);
  flipPhone(b, 226, 128);
  gpsPin(b, 242, 98 - (Math.floor(f / 6) % 2));
  if (st.card) {
    fill(b, 0, 0, 480, RH, PAL.I0); const s = '"WHERE YOU AT?"'; bpt(b, s, 240 - Math.round(bpw(s) / 2), 80, PAL.P2); gpsPin(b, 240, 70);
  }
  applyPalette(b, 'EARLYWEB16');
};
export const stage2008 = (b: Buf, g: number, st: {grey?: number; last?: boolean} = {}) => {
  draw2008(b, g, {screen: (w, r) => {
    // TPOOL's map in its own colours (the frame's own screen), pins everywhere; one by one they grey out
    const pins: Array<[number, number]> = [[30, 30], [62, 54], [100, 26], [140, 70], [180, 40], [210, 90], [44, 100], [120, 104], [228, 30]];
    pins.forEach(([px, py], i) => { const grey = i < (st.grey ?? 0); const X = r.x + px, Y = r.y + py; poly([X - 3, Y - 8, X + 3, Y - 8, X + 3, Y - 5, X, Y, X - 3, Y - 5], w.ink(grey ? PAL.G4 : PAL.R2)); ellipse(X, Y - 6, 3, 3, w.ink(grey ? PAL.G5 : PAL.R3)); });
    if (st.last) { const s = 'LAST UPDATED 2012'; fill(w, r.x + r.w - pw(s) - 10, r.y + r.h - 14, pw(s) + 8, 11, PAL.P2); pt(w, s, r.x + r.w - pw(s) - 6, r.y + r.h - 12, PAL.G3); }
  }});
};
export const breadcrumb = (b: Buf, k: number) => {
  // over whatever is drawn (the 2024 stream's stage): a dotted GPS line in 2008's colours drawing itself across
  const n = Math.min(60, k * 4);
  for (let i = 0; i < n; i += 2) { const t = i / 60, x = Math.round(40 + t * 400), y = Math.round(150 - (Math.exp(t * 3) - 1) / (Math.exp(3) - 1) * 90); fill(b, x - 2, y - 2, 4, 4, PAL.N2); fill(b, x - 1, y - 1, 2, 2, PAL.C6); }
};
export const matchClicker = (b: Buf, f: number, st: {phone?: boolean} = {}) => {
  // the hand in the same grip: 2008's clicker (EARLY-WEB) -> 2024's phone with his post on it
  vramp(b, 0, 0, 480, RH, st.phone ? [PAL.L2, PAL.L1, PAL.L1] : [PAL.N1, PAL.N3, PAL.N3]);
  capsule(b, 480, 200, 330, 150, 26, [PAL.G1, PAL.G2, PAL.G3, PAL.C4]);
  if (st.phone) { fill(b, 196, 40, 110, 150, PAL.N0); fill(b, 200, 46, 102, 138, PAL.N2); fill(b, 206, 54, 90, 40, PAL.N3); fill(b, 206, 54, 90, 1, PAL.C5); fill(b, 210, 58, 10, 10, PAL.C4); pt(b, 'mas', 224, 58, PAL.P2); for (let r = 0; r < 3; r++) fill(b, 210, 72 + r * 7, 80 - r * 18, 3, PAL.P1); }
  else { fill(b, 226, 70, 50, 110, PAL.G4); fill(b, 226, 70, 50, 3, PAL.G6); ellipse(251, 100, 10, 10, b.ink(PAL.R3)); fill(b, 240, 130, 22, 8, PAL.G5); fill(b, 240, 146, 22, 8, PAL.G5); }
  grip(b, 230, 120, 50, 1, HANDSKIN[0]);
  if (!st.phone) applyPalette(b, 'EARLYWEB16');
};

export const ART: ArtAsset[] = [
  {
    id: 'set19-campus', manifest: 'SET-19 · ELPPA\'s campus, the keynote crowd', kind: 'set', name: 'ELPPA\'s campus: the lawn, the giant screen, the crowd\'s backs (generic, off-brand)',
    file: 'sets/elppa.ts', exports: 'campus, keynotePainter, streamCrowd', scenes: '19, 20',
    note: 'no real building, logo or trade dress; the stream\'s chat lights with his post; phones buzz across the lawn; the crowd thins to the end card (sc 20)',
    stills: [
      {label: '[W] 19.07-19.08: the crowd\'s backs under the giant screen, Mas at the edge typing (three collars, no pop), the chat lighting with his post, phones buzzing', draw: (b) => campus(b, 0, {chat: 2, buzz: true}, (bb) => { drawMasStand2(bb, 70, 196, {arm: 'phone', bow: true}); drawCollarsStand(bb, 70, 196, 3, {}); })},
      {label: '[SCR] 19.06: the lobby wall screen\'s stream cutaway: the outdoor audience, our stream\'s UI, Mas small at its edge, head down', draw: (b) => streamCrowd(b, {x: 0, y: 0, w: 480, h: 203}, 0)},
      {label: 'sc 20: the crowd thinned, the end card', draw: (b) => campus(b, 0, {thin: 0.8, endcard: true})},
    ],
  },
  {
    id: 'set20-f21', manifest: 'SET-20 · F2.1: the 2006 street corner (EARLY-WEB16) and the 2008 keynote stage · §2.1 YOUNG MAS', kind: 'set', name: 'F2.1: the 2006 phone ad, the 2008 stage (the intro\'s frame), the pins greying',
    file: 'sets/elppa.ts (+ f21/era2008.ts, mas08.ts, palettes.ts, timeline.ts: copies of studio/src/dev/meras)', exports: 'corner2006, stage2008, breadcrumb, matchClicker', scenes: '19 (F2.1)',
    note: 'EARLY-WEB16 throughout; the end card WHERE YOU AT?; the 2008 big screen\'s pins grey out one by one to LAST UPDATED 2012 (no cause claimed); the clicker becomes the 2024 phone in the same grip',
    stills: [
      {label: '[W] 19.12: 2006, a phone ad on a street corner: young Mas with a flip phone, grinning, the GPS pin bobbing over his head · the end card', draw: (b) => {
        const t1 = new Buf(480, 270, PAL.N0); corner2006(t1, 0); const t2 = new Buf(480, 270, PAL.N0); corner2006(t2, 0, {card: true});
        for (let y = 0; y < 203; y++) for (let x = 0; x < 320; x++) b.set(x, y, t1.c[y * 480 + 80 + x]); for (let y = 0; y < 203; y++) for (let x = 0; x < 160; x++) b.set(320 + x, y, t2.c[y * 480 + 160 + x]);
      }},
      {label: '[W] 19.13-19.14: the intro\'s 2008 frame, the clicker caught, the collars popped; the big screen\'s pins greying, LAST UPDATED 2012', draw: (b) => stage2008(b, 200, {grey: 6, last: true})},
      {label: '[ECU · MATCH] 19.15: the 2008 clicker in his hand (-> the 2024 phone in the same grip)', draw: (b) => matchClicker(b, 0, {phone: false})},
      {label: '[ECU · MATCH] 19.15: the 2024 phone in the same grip, his post on it', draw: (b) => matchClicker(b, 0, {phone: true})},
      {label: '[POV] 19.11 the breadcrumb drawing itself over the 2024 stream', draw: (b) => { streamCrowd(b, {x: 0, y: 0, w: 480, h: 203}, 0); breadcrumb(b, 15); }},
    ],
  },
];
void rect; void line; void clamp; void stepColor; void pwrap; void tinyWidth; void TR; void dith; void drawMasKid; void masKid;
