// MR. MAS — Ep2 v1 art: SET-07, MAS'S DARK ROOM in Ep2 (sc 8, 12, 20, 23) and SET-09, THE NEWS-DESK LINEUP (sc 8, on
// the monitor), with the UI props that ride the monitor and his phone. The room is Ep1's (rooms/darkroom.ts, the
// monitor kit kits/mas-monitor.ts: every monitor item here is a PAINTER (scr, f) that lays itself out for the buffer it's
// given, so it plays [POV] full-bleed, [OTS] over his shoulder, or small in the two-shot). A work room: no domestic
// dressing (GR X1).
//   rulebookNotif(k, swipe)   painter, sc 8.01: the notification slides down: EUROPE PASSES ITS AI RULEBOOK · 523–46,
//                             its thumbnail a 400-page book with a SNOOZE button bolted to its spine (unpressed); swipe
//                             0..1 = swiped away unopened
//   newsSitePainter(k, st)    painter, sc 8.02: a generic news site (no real outlet's name, logo or trade dress): the
//                             cropped headline …TAKES AIM AT MAS, TASYA AND RADNUS… over the segment's video still
//   newsDesk(b, x, y, w, h, k, st)  SET-09: the lineup: a desk, a height chart, three cardboard cutouts in lanyards (Mas,
//                             his landlord, Elgoog's), the unplated host turning from the lineup to the lens (st.turn)
//   calendarPainter(st)       painter, sc 8.04 / 8.07: the week of MAY 13: ELGOOG · DEVELOPER KEYNOTE · TUE 14 already
//                             there; his block NOPEAI · SPRING UPDATE dragged onto MON 13 (st.drag 0..1, snapped at 1);
//                             the invite ELPPA · KEYNOTE · JUN 10 dropping in under it (st.invite 0..3, accepted at 3)
//   elppaCall(b, f, st)       [ECU] -> [MCU] sc 8.06: his phone face up on the desk, ringing: a call tile ELPPA (no face,
//                             no name) -> `…` -> CONFIRMED (st.state)
//   newsRecapPainter(k, min)  painter, sc 12.05: the afternoon news recap: ELGOOG'S KEYNOTE under NopeAI's OMNI stamp (no
//                             blimp); min 0..1 = minimised (it shrinks to the taskbar)
//   phoneFaceDown(b, f, st)   [ECU] sc 20.10: his phone face down on the desk, lit at its edges; st.turn 0..2 (his hand
//                             turns it over: the screen's Alyi post comes up in its own UI, the paint is the caller's)
import {Buf, rect, line, ellipse, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {drawMonitorPOV, drawMonitorOTS, Painter} from '../../../../../shared/pixel/kits/mas-monitor';
import {masStand} from '../../../../../shared/pixel/cast/mas-stand';
import {tasyaRoom} from '../../../../../shared/pixel/cast/tasya-speak';
import {radnus, RADNUS_DEFAULT} from '../../../../../shared/pixel/cast/radnus';
import {blitImg, Img} from '../../../../../shared/pixel/figure';
import {fill, pt, pw, pwrap, bpt, bpw, tiny, tinyWidth, vramp, RH, TR, grip, HANDSKIN, capsule} from '../kit';
import {makeBust, plane, bustHair, CivicSpec, BustState} from '../cast/civic2';
import {SKIN, SUIT, SHIRT_WHITE, HAIR, putBustCut} from '../../../../../shared/pixel/cast/civic-kit';
import type {ArtAsset} from '../asset';

// ------------------------------------------------------------------ the RULEBOOK notification
const desktop = (scr: Buf) => { vramp(scr, 0, 0, scr.w, scr.h, [PAL.N2, PAL.N1, PAL.N1]); fill(scr, 0, scr.h - 10, scr.w, 10, PAL.N0); for (let i = 0; i < 6; i++) fill(scr, 8 + i * 14, scr.h - 8, 9, 6, [PAL.C4, PAL.W5, PAL.L2, PAL.R2, PAL.G4, PAL.U3][i]); };
/** the 400-page book with a SNOOZE button bolted to its spine (thumbnail scale: w x h) */
const snoozeBook = (b: Buf, x: number, y: number, w: number, h: number) => {
  fill(b, x, y, w, h, PAL.F3); fill(b, x, y, w, 2, PAL.F5); fill(b, x + w - 4, y, 4, h, PAL.P1);
  for (let j = 2; j < h - 1; j += 2) fill(b, x + w - 4, y + j, 4, 1, PAL.P0); // the page edges: 400 pages
  // the spine (left) and the big button bolted to it
  fill(b, x, y, 5, h, PAL.F2);
  const bx = x - 4, by = y + Math.round(h / 2) - 5;
  fill(b, bx, by, 13, 10, PAL.G3); ellipse(bx + 6, by + 5, 4, 4, b.ink(PAL.R2)); b.set(bx + 5, by + 3, PAL.R3);
  for (const [cx, cy] of [[bx + 1, by + 1], [bx + 11, by + 1], [bx + 1, by + 8], [bx + 11, by + 8]]) b.set(cx, cy, PAL.G6);
  tiny(b, 'SNOOZE', bx - 1, by + 11, PAL.P2);
};
export const rulebookNotif = (k: number, swipe = 0): Painter => (scr: Buf) => {
  desktop(scr);
  const w = Math.min(scr.w - 20, 300), h = 52, x = Math.round(scr.w / 2 - w / 2) + Math.round(swipe * (scr.w)), y = Math.min(10, -h + k * 12);
  fill(scr, x - 1, y - 1, w + 2, h + 2, PAL.N0); fill(scr, x, y, w, h, PAL.N3); fill(scr, x, y, w, 1, PAL.C5);
  snoozeBook(scr, x + 14, y + 8, 34, 36);
  pt(scr, 'EUROPE PASSES ITS', x + 62, y + 12, PAL.P2); pt(scr, 'AI RULEBOOK · 523–46', x + 62, y + 24, PAL.P2);
  tiny(scr, 'NEWS', x + 62, y + 38, PAL.N7);
};

// ------------------------------------------------------------------ SET-09: the news desk lineup (the segment's still)
const hostSpec: CivicSpec = {
  head: {long: 1, soft: true}, torso: {kind: 'blazer', noTie: true}, browCol: PAL.B0, lash: true,
  hair: () => bustHair('bob'),
  ramps: {skin: SKIN.medium, hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4], suit: SUIT.teal, shirt: SHIRT_WHITE, throat: SKIN.medium},
};
const hostBust = makeBust<BustState>(hostSpec);
/** a cardboard cutout of a rig: the figure flattened to two tones of its own colours, a cardboard edge, a stand */
const cutout = (b: Buf, img: Img, x: number, y: number, lanyard: number) => {
  blitImg(b, img, x, y, {map: (c) => stepColor(c, 1)});
  // the cardboard edge: a pale outline round the silhouette, a strut behind
  for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) { if (img.c[j * img.w + i] >= 0) continue; const n = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const a = i + dx, c = j + dy; return a >= 0 && c >= 0 && a < img.w && c < img.h && img.c[c * img.w + a] >= 0; }); if (n) b.set(x + i, y + j, PAL.D4); }
  // a lanyard on each
  line(x + 18, y + 18, x + 20, y + 24, b.ink(lanyard)); line(x + 23, y + 18, x + 21, y + 24, b.ink(lanyard)); fill(b, x + 18, y + 24, 5, 4, PAL.P2);
};
export const newsDesk = (b: Buf, x: number, y: number, w: number, h: number, k: number, st: {turn?: 0 | 1} = {}) => {
  const clip = {x, y, w, h};
  const t = new Buf(480, 270, PAL.N0);
  // the studio: a blue backdrop, a height chart (a police lineup's lines) behind the cutouts
  vramp(t, 0, 0, 480, 203, [PAL.F2, PAL.F3, PAL.F3]);
  for (let yy = 30, k = 0; yy < 170; yy += 12, k++) { fill(t, 230, yy, 230, 1, PAL.F5); if (k % 2 === 0) tiny(t, `${7 - k / 2}'`, 234, yy - 6, PAL.F6); }
  // three cutouts in lanyards: Mas, his landlord (Tasya), Elgoog's (Radnus)
  cutout(t, masStand({legs: 'stand', arm: 'down', mouth: 'rest', blink: false, guest: false, light: 'room'}), 270, 92, PAL.C5);
  cutout(t, tasyaRoom({arm: 'clasp', mouth: 'smile', blink: false, light: 'room'}), 330, 90, PAL.C5);
  cutout(t, radnus({...RADNUS_DEFAULT, arm: 'fold', fire: null}), 386, 90, PAL.C5);
  fill(t, 250, 172, 220, 4, PAL.F1);
  // the desk and the host (unplated), turning from the lineup to the lens
  putBustCut(t, hostBust({mouth: 'rest', expr: st.turn ? 'neutral' : 'focus'}), 60, 60, 203, !st.turn);
  fill(t, 20, 160, 220, 43, PAL.F1); fill(t, 20, 160, 220, 3, PAL.F5); fill(t, 20, 163, 220, 1, PAL.N0); fill(t, 60, 172, 140, 20, PAL.F2); fill(t, 60, 172, 140, 1, PAL.F4); for (let i = 0; i < 140; i += 10) fill(t, 64 + i, 178, 6, 2, PAL.C4);
  // fit the 480 x 203 studio into the clip rect (nearest sampling: a screen's own pixels)
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) b.set(clip.x + i, clip.y + j, t.c[Math.floor((j * 203) / h) * 480 + Math.floor((i * 480) / w)]);
  void k;
};
export const newsSitePainter = (k: number, st: {turn?: 0 | 1} = {}): Painter => (scr: Buf) => {
  fill(scr, 0, 0, scr.w, scr.h, PAL.P2);
  // a generic news site's chrome: a plain masthead bar (no name), a nav row, the headline, the video still
  fill(scr, 0, 0, scr.w, 14, PAL.N1); fill(scr, 6, 4, 30, 6, PAL.G4); for (let i = 0; i < 5; i++) fill(scr, 60 + i * 34, 6, 24, 2, PAL.G5);
  const head = '…TAKES AIM AT MAS, TASYA AND RADNUS…';
  const lines = pwrap(head, scr.w - 20);
  lines.forEach((l, i) => pt(scr, l, 10, 20 + i * 10, PAL.N1));
  const vy = 22 + lines.length * 10 + 4, vh = scr.h - vy - 8, vw = Math.round(vh * 1.78);
  newsDesk(scr, 10, vy, Math.min(scr.w - 20, vw), vh, k, st);
  // the play glyph
  if (!st.turn) { const cx = 10 + Math.min(scr.w - 20, vw) / 2, cy = vy + vh / 2; for (let j = -6; j <= 6; j++) for (let i = 0; i <= 10 - Math.abs(j) * 1.6; i++) scr.set(Math.round(cx - 4 + i), Math.round(cy + j), PAL.P2); }
};

// ------------------------------------------------------------------ the calendar
export const calendarPainter = (st: {drag?: number; invite?: number}): Painter => (scr: Buf) => {
  fill(scr, 0, 0, scr.w, scr.h, PAL.N1);
  const small = scr.w < 200;
  const days = ['MON 13', 'TUE 14', 'WED 15', 'THU 16', 'FRI 17'];
  const cx0 = 8, top = small ? 12 : 24, cw = Math.floor((scr.w - 16) / 5), ch = small ? 26 : 80;
  if (!small) pt(scr, 'MAY 2024', 8, 8, PAL.P1);
  days.forEach((d, i) => { const x = cx0 + i * cw; fill(scr, x, top, cw - 2, ch, PAL.N2); fill(scr, x, top, cw - 2, 9, PAL.N3); (small ? tiny : pt)(scr, d, x + 2, top + 1, i === 0 ? PAL.C7 : PAL.P1); });
  const block = (x: number, y: number, w: number, a: string, c: number) => { const ls = pwrap(a, w - 8).slice(0, 3); const bh = small ? 8 : 8 + ls.length * 10; fill(scr, x, y, w, bh, c); fill(scr, x, y, 2, bh, stepColor(c, 2)); if (!small) ls.forEach((l, j) => pt(scr, l, x + 5, y + 4 + j * 10, PAL.P2)); };
  // ELGOOG's keynote, already on Tuesday
  block(cx0 + cw + 2, top + 14, cw - 6, 'ELGOOG · DEVELOPER KEYNOTE', PAL.R1);
  // his block, dragged from Wednesday onto Monday, snapping in
  const d = clamp(st.drag ?? 1, 0, 1), snapped = d >= 1;
  const bx = Math.round(cx0 + 2 * cw + 2 + (cx0 + 2 - (cx0 + 2 * cw + 2)) * d), by = top + 14 + (snapped ? 0 : -3);
  if (!snapped) fill(scr, bx + 3, by + 3, cw - 6, small ? 8 : 38, PAL.N0);
  block(bx, by, cw - 6, 'NOPEAI · SPRING UPDATE', PAL.C3);
  if (snapped) fill(scr, cx0, top, cw - 2, 1, PAL.C8);
  // the June invite dropping in under the Monday square
  const iv = st.invite ?? 0;
  if (iv) {
    const iy = top + ch + 6 - (iv === 1 ? 6 : 0), iw = small ? 60 : 200;
    fill(scr, cx0 - 1, iy - 1, iw + 2, small ? 12 : 30, PAL.N0); fill(scr, cx0, iy, iw, small ? 10 : 28, iv >= 3 ? PAL.L1 : PAL.N3);
    if (!small) { pt(scr, 'ELPPA · KEYNOTE · JUN 10', cx0 + 6, iy + 4, PAL.P2); pt(scr, iv >= 3 ? 'accepted' : 'Accept', cx0 + 6, iy + 16, iv >= 3 ? PAL.L3 : PAL.C7); }
  }
};

// ------------------------------------------------------------------ the call tile on his phone
const deskTop = (b: Buf) => { for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, (x + y * 3) % 41 < 2 ? PAL.D1 : bayer(x, y) < 0.2 ? PAL.D1 : PAL.D0); };
export const PHONE_ECU = {x: 160, y: 14, w: 160, h: 176};
const phoneSlab = (b: Buf, r = PHONE_ECU) => { fill(b, r.x + 4, r.y + 4, r.w, r.h, PAL.N0); fill(b, r.x - 2, r.y - 2, r.w + 4, r.h + 4, PAL.G1); fill(b, r.x - 2, r.y - 2, r.w + 4, 1, PAL.G3); fill(b, r.x, r.y, r.w, r.h, PAL.N0); };
export const elppaCall = (b: Buf, f: number, st: {state: 'ring' | 'dots' | 'confirmed'}) => {
  deskTop(b);
  phoneSlab(b);
  const r = PHONE_ECU;
  fill(b, r.x + 4, r.y + 4, r.w - 8, r.h - 8, PAL.N1);
  // the tile: no face, no name, ELPPA's own grey disc and its word
  const cx = r.x + r.w / 2, cy = r.y + 64;
  ellipse(cx, cy, 30, 30, b.ink(PAL.G3)); ellipse(cx, cy, 28, 28, b.ink(PAL.G4));
  bpt(b, 'ELPPA', cx - Math.round(bpw('ELPPA') / 2), r.y + 108, PAL.P2);
  if (st.state === 'ring') { const p = Math.floor(f / 6) % 3; for (let k = 0; k <= p; k++) ellipse(cx, cy, 32 + k * 4, 32 + k * 4, b.ink(PAL.G2)); ellipse(cx, cy, 30, 30, b.ink(PAL.G3)); ellipse(cx, cy, 28, 28, b.ink(PAL.G4)); pt(b, 'incoming call', cx - Math.round(pw('incoming call') / 2), r.y + 134, PAL.N7); }
  if (st.state === 'dots') { for (let k = 0; k < 3; k++) fill(b, cx - 9 + k * 8, r.y + 136, 3, 3, (Math.floor(f / 6) % 3) === k ? PAL.P2 : PAL.N5); }
  if (st.state === 'confirmed') { const s = 'CONFIRMED'; fill(b, cx - Math.round(pw(s) / 2) - 6, r.y + 130, pw(s) + 12, 14, PAL.L1); pt(b, s, cx - Math.round(pw(s) / 2), r.y + 133, PAL.L3); }
};

// ------------------------------------------------------------------ the afternoon news recap (sc 12)
export const newsRecapPainter = (k: number, min = 0): Painter => (scr: Buf) => {
  desktop(scr);
  const s = 1 - clamp(min, 0, 1) * 0.85;
  const w = Math.round((scr.w - 20) * s), h = Math.round((scr.h - 24) * s), x = Math.round((scr.w - w) / 2 * (1 - min) + 6 * min), y = Math.round(8 + (scr.h - 18 - h) * min);
  fill(scr, x - 1, y - 1, w + 2, h + 2, PAL.N0); fill(scr, x, y, w, h, PAL.F2);
  if (w > 120) {
    // NopeAI's OMNI stamp large, Elgoog's keynote's name small under it (the coverage of the day, no headline words)
    const st = 'OMNI'; bpt(scr, st, x + Math.round(w / 2 - bpw(st) / 2), y + 14, PAL.C7);
    fill(scr, x + Math.round(w / 2 - bpw(st) / 2) - 6, y + 10, bpw(st) + 12, 1, PAL.C7); fill(scr, x + Math.round(w / 2 - bpw(st) / 2) - 6, y + 34, bpw(st) + 12, 1, PAL.C7);
    const s2 = "ELGOOG'S KEYNOTE"; pt(scr, s2, x + Math.round(w / 2 - pw(s2) / 2), y + 44, PAL.P1);
    fill(scr, x + 10, y + h - 20, w - 20, 12, PAL.N1); fill(scr, x + 12, y + h - 16, Math.round((w - 24) * ((k % 120) / 120)), 3, PAL.R2);
  }
};

// ------------------------------------------------------------------ the phone face down (sc 20)
export const phoneFaceDown = (b: Buf, f: number, st: {turn?: 0 | 1 | 2; lit?: boolean; screen?: (b: Buf, r: {x: number; y: number; w: number; h: number}) => void}) => {
  deskTop(b);
  const turn = st.turn ?? 0;
  const r = {x: 170, y: 40, w: 140, h: 124};
  if (turn === 0) {
    // the back of the phone, lit at its edges by the screen underneath
    if (st.lit) for (let i = -4; i < r.w + 4; i++) for (let j = -4; j < r.h + 4; j++) { const d = Math.min(Math.abs(i < 0 ? i : i - r.w + 1), Math.abs(j < 0 ? j : j - r.h + 1)); if ((i < 0 || i >= r.w || j < 0 || j >= r.h) && bayer(r.x + i, r.y + j) < (4 - d) / 6) b.set(r.x + i, r.y + j, PAL.C3); }
    fill(b, r.x, r.y, r.w, r.h, PAL.G1); fill(b, r.x, r.y, r.w, 2, PAL.G3); ellipse(r.x + 22, r.y + 22, 10, 10, b.ink(PAL.N0)); ellipse(r.x + 22, r.y + 22, 6, 6, b.ink(PAL.N2));
    return;
  }
  if (turn === 1) { fill(b, r.x + 30, r.y + 4, 80, r.h - 8, PAL.G1); fill(b, r.x + 30, r.y + 4, 4, r.h - 8, PAL.C4); }
  else { phoneSlab(b, r); fill(b, r.x + 4, r.y + 4, r.w - 8, r.h - 8, PAL.N2); st.screen?.(b, {x: r.x + 4, y: r.y + 4, w: r.w - 8, h: r.h - 8}); }
  // his hand turning it (the thumb on the near edge, the fingers under), from the right
  capsule(b, 420, 200, 330, r.y + r.h - 10, 12, [PAL.G1, PAL.G2, PAL.G3, PAL.C4]);
  grip(b, r.x + r.w - 6, r.y + r.h - 30, 14, -1, HANDSKIN[0]);
};

export const ART: ArtAsset[] = [
  {
    id: 'set07-darkroom-ui', manifest: 'SET-07 · the dark room (Ep2\'s monitor and phone items)', kind: 'prop', name: 'The dark room\'s monitor and phone items: RULEBOOK, the calendar, the ELPPA call, the news recap, the phone face down',
    file: 'sets/darkroom2.ts', exports: 'rulebookNotif, calendarPainter, elppaCall, newsRecapPainter, phoneFaceDown (painters for kits/mas-monitor drawMonitorPOV / drawMonitorOTS)', scenes: '8, 12, 20',
    note: 'monitor items are painters (POV / OTS / 2S); the SNOOZE button stays unpressed; the call tile has no face and no name; OMNI over Elgoog\'s keynote, no blimp',
    stills: [
      {label: '[POV] 8.01: the RULEBOOK notification slides down: the 400-page book, its SNOOZE button bolted to the spine (unpressed)', draw: (b) => drawMonitorPOV(b, 0, rulebookNotif(4))},
      {label: '[POV] 8.04 / 8.07: the calendar: his block snapped onto MON 13, Elgoog already on TUE 14, the June invite dropping in', draw: (b) => drawMonitorPOV(b, 0, calendarPainter({drag: 1, invite: 2}))},
      {label: '[ECU] 8.06: his phone face up, the call tile ELPPA (no face, no name), then CONFIRMED', draw: (b) => elppaCall(b, 0, {state: 'confirmed'})},
      {label: '[OTS] 12.05: the afternoon recap on his monitor: ELGOOG\'S KEYNOTE under the OMNI stamp (no blimp)', draw: (b) => drawMonitorOTS(b, 0, newsRecapPainter(40, 0))},
      {label: '[ECU] 20.10: the phone face down on the desk, lit at its edges; then turned over by his hand', draw: (b) => {
        const t1 = new Buf(480, 270, PAL.N0); phoneFaceDown(t1, 0, {turn: 0, lit: true}); const t2 = new Buf(480, 270, PAL.N0); phoneFaceDown(t2, 0, {turn: 2});
        for (let y = 0; y < 203; y++) for (let x = 0; x < 240; x++) { b.set(x, y, t1.c[y * 480 + 120 + x]); b.set(240 + x, y, t2.c[y * 480 + 120 + x]); }
      }},
    ],
  },
  {
    id: 'set09-newsdesk', manifest: 'SET-09 · the news-desk lineup · §2.2 the NEWS-DESK HOST and three cardboard cutouts', kind: 'set', name: 'The news desk: a height chart, three cardboard CEO cutouts in lanyards, the unplated host',
    file: 'sets/darkroom2.ts', exports: 'newsDesk, newsSitePainter', scenes: '8',
    note: 'a generic news site (no outlet name, logo or trade dress); the host turns from the lineup to the lens; cutouts are Ep1\'s rigs flattened to cardboard',
    stills: [
      {label: '[POV] 8.02: the news site, its cropped headline over the segment\'s still (the lineup); the still plays: the host turns to the lens', draw: (b) => drawMonitorPOV(b, 0, newsSitePainter(0, {turn: 0}))},
      {label: 'the segment full frame: the lineup, the height chart, the host turned to the lens', draw: (b) => newsDesk(b, 0, 0, 480, 203, 0, {turn: 1})},
    ],
  },
];
void rect; void hash; void TR; void tinyWidth; void plane; void HAIR;
