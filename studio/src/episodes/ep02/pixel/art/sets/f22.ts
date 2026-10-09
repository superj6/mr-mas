// MR. MAS — Ep2 v1 art: F2.2, ALYI · DEC 2022 -> 2023, in the T4 GLOSSY tier (glass, bloom, specular on the pixel base;
// lit by its own light; never toward photoreal): SET-14, THE HOLIDAY PARTY, DEC 2022, and SET-15, THE LEADERSHIP OFFSITE,
// 2023, AT NIGHT. No family, no religious iconography (no tree, no altar: string lights and paper cups), no mental-health
// reading; some part of Alyi is always cut off by a frame (the light swag, the doorway). The party is Ep1's party
// (act3/art/party.ts, Sep 2023: the bullpen at dusk) nine months earlier, re-lit for a December night.
//   party22(b, f, st)          [W] 15.06: the floor at night under palette-cycled string lights (a slow chase, never a
//                              strobe), the staff in silhouette, ALYI lit and laughing, his hand raised, a swag of lights
//                              across the top of his frame (it crops him); the racks in the corner; st.chant 0..3 (one
//                              voice to everyone: hands up), st.glyph = the racks' status lights as token streams (the 12
//                              GLYPH frames: on the room, never in his eyes)
//   party22TwoShot(b, f, st)   [2S] 15.07: across the crowd: Alyi (cropped by the swag) talking to Mas (lip-sync:
//                              st.mouth), Mas small in the crowd, not chanting, his glass (st.masGlass 'hold' | 'raise')
//   checkInECU(b, f, st)       [ECU] 15.08: his phone held up, Mas's old app open: CHECK IN -> `feel the agi` typed
//                              (st.k), turned to Mas, grinning (the hand only, warm)
//   offsite(b, f, st)          [W] 15.13 / 15.15: a lodge doorway at night, the wooden effigy (a paperclip robot of our
//                              own design, stencilled UNALIGNED), staff in silhouette, trees; ALYI half cut off by the
//                              doorway's frame carrying the flame to it (st.alyi), the fire (st.fire 0 unlit, 1 catching,
//                              2 burning: palette-cycled, never strobing)
//   fireToPoint(b, f, k)       [W] -> [ECU] 15.16: the fire's glow shrinking to one point of light (the pin's, next)
import {Buf, rect, line, ellipse, bayer, hash, clamp, poly} from '../../../../../shared/pixel/px';
import {PAL, stepColor, lightness} from '../../../../../shared/pixel/palette';
import {fill, pt, pw, tiny, tinyWidth, vramp, RH, TR, glossBloom, glossSpec, grip, HANDSKIN, capsule, dith, untracked} from '../kit';
import {crowdBacks} from '../cast/civic2';
import {alyiWarm, drawAlyiRoom2, drawTpoolCheckIn} from '../cast/alyi2';
import {drawMasStand2} from '../cast/mas2';
import {putBustCut} from '../../../../../shared/pixel/cast/civic-kit';
import {holdPhone} from '../cast/hands2';
import type {ArtAsset} from '../asset';

// ------------------------------------------------------------------ string lights (a slow chase in four colours)
const BULBS = [PAL.W7, PAL.R3, PAL.L3, PAL.C7];
/** a sagging run of bulbs from (x0, y0) to (x1, y1), `sag` px; each bulb steps colour on a slow chase (10 frames) */
export const stringLights = (b: Buf, x0: number, y0: number, x1: number, y1: number, sag: number, f: number, pitch = 7) => {
  const n = Math.max(2, Math.round(Math.abs(x1 - x0) / pitch));
  let px = x0, py = y0;
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = Math.round(x0 + (x1 - x0) * t), y = Math.round(y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * sag);
    line(px, py, x, y, b.ink(PAL.N2)); px = x; py = y;
    const c = BULBS[(i + Math.floor(f / 10)) % 4];
    b.set(x, y + 1, c); b.set(x, y + 2, stepColor(c, -1)); b.set(x - 1, y + 1, stepColor(c, -2));
  }
};
const nightFloor = (b: Buf, f: number) => {
  // Ep1's bullpen floor at night: the glass wall, the window's city, the desks pushed back
  vramp(b, 0, 0, 480, 150, [PAL.N0, PAL.N1, PAL.U0]);
  fill(b, 0, 150, 480, RH - 150, PAL.N1);
  fill(b, 300, 24, 170, 100, PAL.N0); vramp(b, 304, 28, 162, 92, [PAL.N1, PAL.N2, PAL.U1]);
  for (let k = 0; k < 60; k++) b.set(304 + Math.floor(hash(k, 1, 4) * 160), 70 + Math.floor(hash(k, 2, 4) * 48), hash(k, 3, 4) < 0.5 ? PAL.W5 : PAL.W4);
  for (let x = 304; x < 466; x += 40) fill(b, x, 28, 2, 92, PAL.N0);
};
const racks = (b: Buf, f: number, glyph: boolean) => {
  // the humming racks in the corner (left), their status lights; at the chant's peak they become token streams that
  // run across the whole room (on the room, never in his eyes)
  for (const rx of [8, 34]) { fill(b, rx, 40, 22, 110, PAL.N1); fill(b, rx, 40, 22, 1, PAL.N3); for (let u = 0; u < 20; u++) { fill(b, rx + 2, 44 + u * 5, 18, 1, PAL.N0); b.set(rx + 17, 46 + u * 5, (u + Math.floor(f / 4)) % 3 ? PAL.C6 : PAL.L3); } }
  // the token streams: real GLYPH tokens (the 3 x 5 type's letters, digits and marks), running out of the racks and
  // across the room in rows, each row its own speed, the head of each run bright (never in his eyes: the rows skip
  // the band where faces are)
  if (glyph) untracked(() => {
    const TOK = 'the agi 0 1 < > { } ; = + feel 7 # % a e i o u x y z 2 3 9 ( ) [ ]'.split(' ');
    for (let r = 0; r < 10; r++) {
      const y = 44 + r * 10;
      if (y > 84 && y < 128) continue;
      let x = 60 - ((f * (3 + (r % 3)) + r * 37) % 40);
      for (let k = 0; x < 480; k++) {
        const t = TOK[Math.floor(hash(k, r, 3) * TOK.length)];
        const head = (k + Math.floor(f / 3) + r) % 9 === 0;
        tiny(b, t.toUpperCase(), x, y, head ? PAL.C8 : (k + r) % 3 ? PAL.C5 : PAL.C6);
        x += tinyWidth(t.toUpperCase()) + 3;
      }
    }
  });
};
export interface Party22St { chant?: 0 | 1 | 2 | 3; glyph?: boolean }
export const party22 = (b: Buf, f: number, st: Party22St = {}) => {
  const chant = st.chant ?? 2;
  nightFloor(b, f);
  racks(b, f, !!st.glyph);
  // three runs of string lights across the ceiling
  stringLights(b, 0, 10, 480, 14, 10, f); stringLights(b, 60, 30, 470, 22, 14, f + 5); stringLights(b, 0, 52, 300, 44, 8, f + 3);
  // the crowd in silhouette (warm rims from the bulbs), hands going up with the chant
  crowdBacks(b, 60, 480, 150, 4, f, {seed: 9, cheer: chant >= 2, dim: 2});
  // ALYI: lit and laughing, his hand raised, a low swag of lights across the top of his frame (it crops him)
  drawAlyiRoom2(b, 190, 176, {arm: chant >= 1 ? 'raise' : 'down', light: 'party', smile: true});
  // the low swag over him: above his head (it crops the top of his frame, never his eyes), his raised hand under it
  stringLights(b, 150, 74, 236, 78, 5, f + 2, 5);
  // the party's warm light on the room round him
  for (let y = 80; y < RH; y++) for (let x = 120; x < 280; x++) { const d = Math.hypot((x - 192) / 90, (y - 140) / 70); if (d < 1 && bayer(x, y) < (1 - d) * 0.5) b.set(x, y, stepColor(b.get(x, y), 1)); }
  glossBloom(b, 0, 0, 480, RH, 0.7, 1);
};
export const party22TwoShot = (b: Buf, f: number, st: {mouth?: 'rest' | 'A' | 'E' | 'O' | 'M' | 'smile'; mood?: 'smile' | 'laugh'; masGlass?: 'hold' | 'raise'} = {}) => {
  nightFloor(b, f);
  stringLights(b, 0, 14, 480, 18, 12, f);
  crowdBacks(b, 0, 480, 160, 3, f, {seed: 3, cheer: true, dim: 2});
  // Mas small in the crowd, left third, not chanting, his glass
  drawMasStand2(b, 90, 196, {arm: 'glass', mouth: 'smile', light: 'room'});
  // Alyi close at right, cropped by a swag of lights across the top of his frame
  const img = alyiWarm({mood: st.mood ?? 'smile', mouth: st.mouth ?? 'rest', arm: 'none', light: 'party'});
  putBustCut(b, img, 280, 62, RH);
  // the swag of lights crossing low over his frame: its dark garland cuts across the top of his head
  for (let y = 0; y < 100; y++) for (let x = 250; x < 480; x++) if (y < 78 - Math.round(Math.sin(((x - 250) / 230) * Math.PI) * 14)) b.set(x, y, bayer(x, y) < 0.3 ? PAL.N1 : PAL.N0);
  stringLights(b, 250, 64, 480, 66, 14, f + 1, 6);
  glossBloom(b, 0, 0, 480, RH, 0.7, 1);
  glossSpec(b, [[96, 172], [352, 74]]);
};
export const checkInECU = (b: Buf, f: number, st: {k?: number} = {}) => {
  // bokeh string lights behind, the phone held up toward Mas, his warm hand round it
  vramp(b, 0, 0, 480, RH, [PAL.U0, PAL.U1, PAL.N1]);
  for (let k = 0; k < 24; k++) { const cx = Math.floor(hash(k, 1, 2) * 480), cy = Math.floor(hash(k, 2, 2) * 150), c = BULBS[(k + Math.floor(f / 10)) % 4]; for (let j = -5; j <= 5; j++) for (let i = -5; i <= 5; i++) if (i * i + j * j < 26 && bayer(cx + i, cy + j) < 0.45) b.set(cx + i, cy + j, stepColor(c, -2)); }
  // his warm hand round it, from the right: the fingertips round its far edge, the thumb on its near edge, the wrist into
  // the sweater's cuff and the sleeve down out of frame (Ep1's insert-hands grammar, the party's warm light)
  // (a phone's own 1 : 2 proportions; the thumb low on the near edge, clear of the screen's words)
  const P = {x: 196, y: 12, w: 92, h: 184};
  holdPhone(b, P, {side: 'R', grip: 'wrap', light: 'lobby', thumbAt: 0.85, sleeveTo: [470, 260],
    cuffRamp: [PAL.N0, PAL.X0, PAL.X0, PAL.X1, PAL.X2, PAL.X2, PAL.W5], sleeveRamp: [PAL.N0, PAL.X0, PAL.X1, PAL.X2, PAL.W5],
    drawPhone: (bb) => { fill(bb, P.x, P.y, P.w, P.h, PAL.N0); fill(bb, P.x, P.y, P.w, 1, PAL.G3); drawTpoolCheckIn(bb, P.x + 5, P.y + 8, P.w - 10, P.h - 16, st.k ?? 12); }});
  glossBloom(b, 0, 0, 480, RH, 0.75, 1);
};

// ------------------------------------------------------------------ the offsite (SET-15)
const FIRE = [PAL.R1, PAL.R2, PAL.W5, PAL.W6, PAL.W7, PAL.W8];
/** the fire: a palette-cycled body of flame tongues (held 3 frames a drawing; the cycle walks colours, the shape holds) */
const fire = (b: Buf, cx: number, by: number, w: number, h: number, f: number) => {
  const ph = Math.floor(f / 3);
  for (let i = -w; i <= w; i++) {
    const top = h * (1 - Math.abs(i) / (w + 1)) * (0.7 + 0.3 * hash(i, ph % 5, 7));
    for (let j = 0; j < top; j++) { const t = j / Math.max(1, top); const k = clamp(Math.floor((1 - t) * 5 + ((ph + i) % 3) * 0.4), 0, 5); b.set(cx + i, by - j, FIRE[k]); }
  }
};
/** the effigy: a paperclip robot of our own design (a bent-wire body, two loops for a head and torso, wire arms),
 *  stencilled UNALIGNED across its front panel */
const effigy = (b: Buf, x: number, y: number, burn: number) => {
  const wood = burn >= 2 ? [PAL.N1, PAL.D1, PAL.W3] : [PAL.D2, PAL.D3, PAL.D4];
  // a wooden post, the stand
  fill(b, x + 18, y - 12, 4, 12, wood[0]); fill(b, x + 10, y - 2, 20, 2, wood[0]);
  // the paperclip body: two nested rounded loops (the clip's bends) in thick wood strips
  const loop = (lx: number, ly: number, w: number, h: number) => { for (let i = 0; i < w; i++) { b.set(lx + i, ly, wood[2]); b.set(lx + i, ly + 1, wood[1]); b.set(lx + i, ly + h, wood[1]); b.set(lx + i, ly + h + 1, wood[0]); } for (let j = 0; j < h; j++) { b.set(lx, ly + j, wood[2]); b.set(lx + 1, ly + j, wood[1]); b.set(lx + w - 1, ly + j, wood[1]); b.set(lx + w, ly + j, wood[0]); } };
  loop(x + 4, y - 60, 32, 50); loop(x + 10, y - 50, 20, 36); loop(x + 12, y - 78, 16, 16);
  // eyes (two bolts), wire arms raised
  b.set(x + 16, y - 72, PAL.G5); b.set(x + 23, y - 72, PAL.G5);
  line(x + 4, y - 50, x - 10, y - 66, b.ink(wood[1])); line(x + 36, y - 50, x + 50, y - 66, b.ink(wood[1]));
  // the stencilled word on a front panel
  const wd = tinyWidth('UNALIGNED') + 4; fill(b, x + 20 - (wd >> 1), y - 32, wd, 9, PAL.P1); tiny(b, 'UNALIGNED', x + 22 - (wd >> 1), y - 30, PAL.N1);
};
export const offsite = (b: Buf, f: number, st: {fire?: 0 | 1 | 2; alyi?: 'torch' | 'stand' | null} = {}) => {
  const fr = st.fire ?? 0;
  // the night: a dark sky, the trees (pine silhouettes), the lodge's timber wall and its lit doorway at left
  vramp(b, 0, 0, 480, 140, [PAL.N0, PAL.N1, PAL.U0]);
  for (let k = 0; k < 9; k++) { const tx = 140 + k * 40, th = 70 + (k * 23) % 40; for (let j = 0; j < th; j++) { const w = Math.round((j / th) * 12); fill(b, tx - w, 140 - th + j, w * 2 + 1, 1, PAL.L0); } }
  fill(b, 0, 140, 480, RH - 140, PAL.D0); for (let x = 0; x < 480; x++) if (hash(x, 3, 2) < 0.3) b.set(x, 140, PAL.D1);
  // the lodge: timbers, and the doorway (warm inside), its frame
  fill(b, 0, 20, 120, 130, PAL.D1); for (let y = 22; y < 150; y += 8) fill(b, 0, y, 120, 1, PAL.D0);
  fill(b, 60, 50, 46, 100, PAL.W4); dith(b, 60, 50, 46, 100, 0.4, PAL.W5); fill(b, 56, 46, 4, 104, PAL.D3); fill(b, 106, 46, 4, 104, PAL.D3); fill(b, 56, 44, 54, 4, PAL.D3);
  // the staff in silhouette, watching (small, far side of the effigy)
  crowdBacks(b, 240, 470, 150, 2, f, {seed: 5, dim: 3});
  effigy(b, 300, 150, fr);
  if (fr >= 1) fire(b, 320, 150, fr === 1 ? 8 : 26, fr === 1 ? 16 : 70, f);
  // ALYI: half in the doorway (its jamb cuts him), carrying the flame to it, his face lit and calm
  if (st.alyi) drawAlyiRoom2(b, 62, 150, {arm: st.alyi === 'torch' ? 'torch' : 'down', light: 'fire', f}, {clip: (x) => x >= 60});
  // the doorway's left jamb and the lodge wall over his back half (his frame rule: half cut off)
  if (st.alyi) { fill(b, 56, 46, 4, 104, PAL.D3); fill(b, 56, 46, 1, 104, PAL.D4); }
  // the fire's light on everything (a palette walk, no blend); it never strobes (the shape holds, the colours walk)
  if (fr >= 1) for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const d = Math.hypot((x - 320) / (fr === 1 ? 90 : 200), (y - 120) / (fr === 1 ? 60 : 120)); if (d < 1 && bayer(x, y) < (1 - d) * 0.55) { const c = b.get(x, y); if (!FIRE.includes(c)) b.set(x, y, lightness(c) < 0.15 ? PAL.W1 : stepColor(c, 1)); } }
  glossBloom(b, 0, 0, 480, RH, 0.72, 1);
};
export const fireToPoint = (b: Buf, f: number, k: number) => {
  fill(b, 0, 0, 480, RH, PAL.N0);
  const r = Math.max(1, Math.round(80 * Math.pow(0.7, k)));
  for (let y = 100 - r; y <= 100 + r; y++) for (let x = 240 - r; x <= 240 + r; x++) { const d = Math.hypot(x - 240, y - 100) / r; if (d < 1 && bayer(x, y) < (1 - d) * 1.2) b.set(x, y, d < 0.3 ? PAL.W8 : d < 0.6 ? PAL.W6 : PAL.W4); }
  b.set(240, 100, PAL.W9);
};

export const ART: ArtAsset[] = [
  {
    id: 'set14-party22', manifest: 'SET-14 · the holiday party, Dec 2022 (T4 glossy)', kind: 'set', name: 'The holiday party, Dec 2022: string lights, the chant, Alyi warm',
    file: 'sets/f22.ts', exports: 'party22, party22TwoShot, checkInECU, stringLights', scenes: '15 (F2.2)',
    note: 'T4: bloom and specular on the pixel base; string lights on a slow chase (no strobe); the swag crops Alyi; Mas not chanting, his glass; racks\' lights become token streams (12 GLYPH frames)',
    stills: [
      {label: '[W] 15.06: the chant building, ALYI lit and laughing, hand raised, the swag of lights cropping his frame; the racks in the corner', draw: (b) => party22(b, 0, {chant: 3})},
      {label: '[2S] 15.07: across the crowd: Alyi (the swag over his frame) to Mas, small, not chanting, his glass ("You\'re not chanting.")', draw: (b) => party22TwoShot(b, 0, {mouth: 'E', mood: 'smile'})},
      {label: '[W] 15.09 the racks\' status lights as token streams across the room (never his eyes)', draw: (b) => party22(b, 0, {chant: 3, glyph: true})},
      {label: '[ECU] 15.08 his phone held up: TPOOL, CHECK IN, feel the agi', draw: (b) => checkInECU(b, 0, {k: 12})},
    ],
  },
  {
    id: 'set15-offsite', manifest: 'SET-15 · the leadership offsite, 2023, at night (T4)', kind: 'set', name: 'The offsite: the lodge doorway, the UNALIGNED effigy, the fire',
    file: 'sets/f22.ts', exports: 'offsite, fireToPoint', scenes: '15 (F2.2)',
    note: 'a paperclip robot of our own design; Alyi half cut off by the doorway\'s jamb, the flame in his hand, face lit and calm; palette-cycled fire, never strobing',
    stills: [
      {label: '[W] 15.13: the lodge doorway, Alyi half cut off by its frame carrying the flame to the effigy; staff in silhouette; trees', draw: (b) => offsite(b, 0, {fire: 0, alyi: 'torch'})},
      {label: '[W] 15.15 the effigy catches (palette-cycled, never a strobe)', draw: (b) => offsite(b, 7, {fire: 2, alyi: 'stand'})},
      {label: '[W] 15.16 the glow shrinking to one point of light', draw: (b) => fireToPoint(b, 0, 3)},
    ],
  },
];
void rect; void poly; void pt; void pw; void tinyWidth; void TR; void ellipse;
