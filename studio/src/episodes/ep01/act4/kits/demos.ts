// MR. MAS — ep01 act4 kits preview: the call grid, the two avalanches and the props, each as a short test on the
// 96 BPM grid (15 frames per beat). These prove the kits; the scene builders own the real scenes.
import {Buf, rect, clamp} from '../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../shared/pixel/palette';
import {text, textWidth} from '../../../../shared/pixel/font';
import type {GlyphLayer} from '../../../../shared/pixel/glyph';
import {
  gridLayout, slideTiles, callChrome, drawTile, TileState, TileRect, captureTile, tileDrop, callDialog, dialogButton,
  drawPointer, pointerAt, typingDots, micChip, callToast, voteFlip, spotlight, postChip, spinner, TILE_W, TILE_H,
  employeeFace, CALL_BAR_H, dropY, cctv, tilePlate, typedDots,
} from '../../../../shared/pixel/kits/callgrid';
import {
  planPile, withBlueHeart, drawPile, pileTopAt, pileHeartAt, PileHeart, planGridStack, drawGridStack, GridStackOpts,
  GridItem, landedBy, reactionBurst, floatHearts, shove, scatter, odometer, odoRoll, LETTER_STOPS, heartCounter, avalancheSchedule, drawHeart, BLUE,
} from '../../../../shared/pixel/kits/avalanche';
import {
  hourglass, hourglassFlip, hourglassGrains, lobbySign, signLight, zeroBox, woodGrain, tally, tallyRoom, pen, fire,
  fireOut, spray, pinTag, guestBadge, guestWorn,
} from '../../../../shared/pixel/kits/props';

// ================================================================== CALL (sc 26, condensed: 12 s)
export const CALL_FRAMES = 288;
const C = {connect: 0, live: 6, speak: 30, dots: 36, dotsStop: 66, dlg: 78, ptr: 84, click: 108, drop: 114, close: 136, mic: 150, line: 168, hold: 196, dim: 280};
const G5 = gridLayout(5), G4 = gridLayout(4);
const BOARD = [
  {id: 'alyi', name: 'ALYI'}, {id: 'neleh', name: 'NELEH'}, {id: 'mada', name: 'MADA'}, {id: 'off', name: 'THE QUIET VOTE'},
];
const masTile = (f: number): TileState => ({...G5[0], id: 'mas', name: 'MAS MANALT', muted: false, open: f - C.connect - 6, level: f >= C.line && f < C.line + 20 ? [1, 3, 2, 3, 1][Math.floor((f - C.line) / 4)] : 0});

export const drawCall = (fb: Buf, f: number): GlyphLayer[] => {
  callChrome(fb, {title: 'board sync', clock: null});
  const layers: GlyphLayer[] = [];
  const frozen = f >= C.hold;
  // the board's four tiles: votes already flipped when Mas connects
  const rects: TileRect[] = f < C.close ? G5.slice(1) : slideTiles(G5.slice(1), G4, f, C.close, 8);
  BOARD.forEach((t, i) => {
    const speaking = t.id === 'alyi' && f >= C.speak && f < C.dotsStop + 20;
    drawTile(fb, {...rects[i], id: t.id, name: t.id === 'off' ? undefined : t.name, vote: 3, speaking, muted: t.id === 'off' ? true : undefined, frozenAt: frozen ? C.hold : undefined}, f);
  });
  // Mas's tile: connecting (black, "connecting"), then live; the drop
  if (f < C.drop) {
    drawTile(fb, masTile(f), f);
  } else {
    const img = captureTile({...masTile(C.drop), open: undefined}, C.drop);
    // the hole the tile leaves (the grid shows its seat until it closes)
    if (f < C.close) rect(G5[0].x - 1, G5[0].y - 1, TILE_W + 2, TILE_H + 2, fb.ink(PAL.N0));
    // the greyed, emptied plate keeps falling under the tokens (4 px per held step), then below frame
    const k = f - C.drop;
    if (k >= 8) tilePlate(fb, G5[0].x, G5[0].y + dropY(k));
    layers.push(tileDrop(fb, img, G5[0].x, G5[0].y, k, {grey: true}));
  }
  // Alyi speaks: no sound reaches Mas. The dialogue box above his tile types ... and stops
  if (f >= C.dots && f < C.drop) typedDots(fb, G5[1].x + 4, G5[1].y + 3, f - C.dots);
  // the dialog over Mas's tile (the 1993 one, in colour); the board's pointer clicks Cancel. It works.
  if (f >= C.dlg && f < C.drop - 2) {
    const k = f - C.dlg;
    const dx = 6, dy = 29, dw = 196;
    if (k >= 2) callDialog(fb, dx, dy, {w: dw, head: 'MAS MANALT', cancelDown: f >= C.click && f < C.click + 3});
    else rect(dx + 98 - (k + 1) * 32, dy + 48 - (k + 1) * 16, (k + 1) * 64, (k + 1) * 32, fb.ink(PAL.P2)); // opens in held steps
    if (f >= C.ptr) {
      const [bx, by, bw, bh] = dialogButton(dx, dy, 'cancel', dw);
      // from the board's tiles, whole-pixel steps on 2s, eased, parking on Cancel
      const [px, py] = pointerAt(Math.floor(f / 2) * 2, C.ptr, C.click - 2, [G5[2].x + 60, G5[2].y + 50], [bx + 30, by + 9]);
      drawPointer(fb, px, py, f >= C.click && f < C.click + 2);
      void bw; void bh;
    }
  }
  // his tile is gone, but his microphone isn't
  if (f >= C.mic) micChip(fb, 12, 214, f >= C.line && f < C.line + 20 ? [1, 3, 2, 3, 1][Math.floor((f - C.line) / 4)] : 1);
  return layers;
};
export const callAfter = (ui: Buf, f: number) => {
  if (f >= C.line && f < C.line + 26) { rect(40, 250, textWidth('super.') + 12, 13, ui.ink(PAL.N0)); text(ui, 'super.', 46, 253, PAL.P1); }
};

// ================================================================== HEARTS (sc 27, condensed: 14 s)
export const HEART_FRAMES = 408;
const H = {gerg: 6, bukaj: 40, first: 60, pour: 100, post: 180};
let HEART_PLAN: PileHeart[] | null = null;
const SPIN_X = G4[2].x + 75; // (the tile's spinner centre: PAINTERS.mada)
const heartPlan = () => (HEART_PLAN ??= (() => {
  const base = planPile({x0: 0, x1: 480, count: 99999, t0: H.pour, ceiling: 30,
    spawnAt: (i) => Math.pow(i, 0.62) * 1.05});
  const top = pileTopAt(base, SPIN_X, 1e9);
  // the spinner floats on the pile; the blue heart lands on top of it
  return withBlueHeart(base, SPIN_X - 4, top - 11 - 9, 18);
})());
/** Mada's spinner: at home above his head, then riding the pile's surface (the only thing still sticking out). */
const spinnerY = (f: number, plan: PileHeart[]) => Math.min(G4[2].y + 4, pileTopAt(plan, SPIN_X, f) - 7);

export const drawHearts = (fb: Buf, f: number) => {
  callChrome(fb, {title: 'board sync'});
  const plan = heartPlan();
  BOARD.forEach((t, i) => drawTile(fb, {...G4[i], id: t.id, name: t.id === 'off' ? undefined : t.name, vote: 3, frozen: t.id === 'mada' ? true : false}, f));
  // the toasts, top-right
  callToast(fb, 300, 216, 'GERG MOCKBRAN has left.', f - H.gerg, 30);
  callToast(fb, 330, 216, 'BUKAJ has left.', f - H.bukaj, 28);
  reactionBurst(fb, G4[1].x + G4[1].w - 3, G4[1].y + G4[1].h - 3, f - H.first);
  drawPile(fb, plan, f, {blue: 'skip'});
  // the spinner rides the surface; after the blue heart lands, it spins with it for one beat
  const blue = plan[plan.length - 1];
  const sy = spinnerY(f, plan);
  // erase the tile's own spinner (drawn frozen) once the pile has lifted it
  spinner(fb, SPIN_X, sy, f, {size: 'r3', dot: 2});
  if (f >= blue.land && f < blue.land + 16) {
    // it spins WITH the spinner: the heart takes the head dot's position, one position per 2 frames
    const pos = [[0, -5], [4, -4], [5, 0], [4, 4], [0, 5], [-4, 4], [-5, 0], [-4, -4]][Math.floor((f - blue.land) / 2) % 8];
    drawHeart(fb, SPIN_X + pos[0] - 4, sy + pos[1] - 4, 4, BLUE);
  } else if (f >= blue.land) drawHeart(fb, SPIN_X - 4, sy - 13, 4, BLUE);
  else { const p = pileHeartAt(blue, f); if (p) drawHeart(fb, p[0], Math.min(p[1], sy - 13), 4, BLUE); }
  heartCounter(fb, 440, 1, f < H.first ? 0 : Math.min(9999, plan.filter((h) => f >= h.land).length));
  // Mas's post scrolls across the hearts, a notification
  if (f >= H.post) {
    const x = 480 - Math.floor((f - H.post) * 2);
    postChip(fb, x, 118, '@masa', '...sorta like reading your own eulogy while you\'re still alive');
  }
};

// ================================================================== TILES (sc 29 THE TILE AVALANCHE, condensed: 20 s)
export const TILE_FRAMES = 480;
const TT = {start: 12, alyi: 168, neleh: 204, qv: 262, press: 390, card: 400};
// the board's grid, snapped to the 12 px slot grid: 13 x 7 slots per tile (156 x 84)
const SLOT = 12, X0 = 0, Y0 = CALL_BAR_H;
const B4: TileRect[] = [
  {x: 6 * SLOT + 3, y: Y0 + 6 * SLOT, w: 150, h: 84}, {x: 21 * SLOT + 3, y: Y0 + 6 * SLOT, w: 150, h: 84},
  {x: 6 * SLOT + 3, y: Y0 + 14 * SLOT, w: 150, h: 84}, {x: 21 * SLOT + 3, y: Y0 + 14 * SLOT, w: 150, h: 84},
];
const OPEN = {alyi: TT.alyi + 22, neleh: TT.neleh + 22, qv: TT.qv + 24};
export const TILE_STACK: GridStackOpts = {
  x0: X0, y0: Y0, cols: 40, rows: 21, pitch: [SLOT, SLOT], t0: TT.start,
  spawnAt: (i) => avalancheSchedule(i) * 1.55,
  reserve: [
    {c: 6, r: 6, w: 13, h: 7, openAt: OPEN.alyi}, {c: 21, r: 6, w: 13, h: 7, openAt: OPEN.neleh},
    {c: 6, r: 14, w: 13, h: 7}, // MADA: never opens
    {c: 21, r: 14, w: 13, h: 7, openAt: OPEN.qv},
    {c: 36, r: 0, w: 4, h: 1}, // the counter chip
  ],
};
let TILE_PLAN: GridItem[] | null = null;
const tilePlan = () => (TILE_PLAN ??= planGridStack(TILE_STACK));

export const drawTiles = (fb: Buf, f: number) => {
  callChrome(fb, {title: 'board sync', controls: false});
  const plan = tilePlan();
  // the board row under pressure: Alyi shoved off left, Neleh off right, THE QUIET VOTE off right; Mada stays
  const sh = [-shove(f, TT.alyi, 300), shove(f, TT.neleh, 300), 0, shove(f, TT.qv, 300)];
  BOARD.forEach((t, i) => {
    const r = B4[i];
    if (Math.abs(sh[i]) >= 300) return;
    drawTile(fb, {...r, x: r.x + sh[i], id: t.id, name: t.id === 'off' ? undefined : t.name, vote: 3}, f);
  });
  // Neleh's footnotes scatter like sparks as her tile goes
  scatter(fb, B4[1].x + 74 + sh[1], B4[1].y + 20, f - TT.neleh - 17, {n: 12, digits: true, seed: 5, col: PAL.W8, life: 30});
  // phrase 4: every tile around MADA presses (1 px toward him on each beat); he does not move
  drawGridStack(fb, plan, f, TILE_STACK, (b, x, y, it) => employeeFace(b, x, y, SLOT - 1, SLOT - 1, it.seed), {c: 6, r: 14, w: 13, h: 7, t0: TT.press});
  // the counter chip (4 slots, top-right): driven by the stack itself; it reads 745 when the screen is full
  const n = landedBy(plan, f);
  rect(36 * SLOT, Y0, 48, 11, fb.ink(PAL.N0));
  const s = `${n}/770`;
  text(fb, s, 36 * SLOT + 46 - textWidth(s), Y0 + 2, n >= 745 ? PAL.L3 : PAL.P1);
};
export const tilesAfter = (ui: Buf, f: number) => {
  if (f >= TT.neleh + 8 && f < TT.neleh + 40) { const s = 'Has anyone read the char-'; rect(20, 250, textWidth(s) + 12, 13, ui.ink(PAL.N0)); text(ui, s, 26, 253, PAL.P1); }
};

// ================================================================== PROPS (a test sheet: 10 s)
export const PROP_FRAMES = 240;
let WOOD: Buf | null = null;
const wood = () => (WOOD ??= (() => { const b = new Buf(); woodGrain(b, 324, 14, 152, 86, 3); return b; })());
/** a test-sheet cell: a night wall, a table strip, a label */
const cell = (fb: Buf, x: number, y: number, w: number, h: number, label: string) => {
  rect(x, y, w, h, fb.ink(PAL.N1));
  rect(x, y + h - 26, w, 26, fb.ink(PAL.D1)); rect(x, y + h - 26, w, 1, fb.ink(PAL.D3));
  rect(x, y, w, 1, fb.ink(PAL.N0)); rect(x, y, 1, h, fb.ink(PAL.N0));
  text(fb, label, x + 4, y + 3, PAL.N6);
};
export const drawProps = (fb: Buf, f: number) => {
  rect(0, 0, 480, 270, fb.ink(PAL.N0));
  // A. the hourglass: flip (f 6), run (a grain per 1.5 frames here; one per beat in the show), shatter (f 176)
  cell(fb, 0, 0, 160, 135, 'HOURGLASS  FLIP RUN SHATTER');
  const N = hourglassGrains('L');
  const fl = hourglassFlip(f - 6);
  const moved = !fl.flipped ? N : clamp(Math.floor((f - 18) / 1.5), 0, N);
  const sh = f >= 176 ? f - 176 : undefined;
  hourglass(fb, 40, 72 + fl.dy, {size: 'L', pose: fl.pose, moved, running: fl.flipped && moved < N, f, shatter: sh});
  const Ns = hourglassGrains('S');
  hourglass(fb, 96, 92 + Math.min(0, fl.dy), {size: 'S', pose: fl.pose, moved: !fl.flipped ? Ns : clamp(Math.floor((f - 18) / 6), 0, Ns), running: fl.flipped, f, shatter: sh});
  // B. the lobby sign: blank (dark) until f 40, lights in held steps; the box of spare zeros lands at f 70
  cell(fb, 160, 0, 160, 135, 'LOBBY SIGN + SPARE ZEROS');
  lobbySign(fb, 174, 22, {days: f >= 40 ? 0 : null, lit: signLight(f - 40)});
  if (f >= 70) zeroBox(fb, 222, 112);
  // C. the tally: two old marks, a new one carved by the clip (f 20-120), the pen at the tip; room scale below
  cell(fb, 320, 0, 160, 135, 'TALLY  ECU / ROOM');
  for (let yy = 14; yy < 100; yy++) for (let xx = 324; xx < 476; xx++) fb.set(xx, yy, wood().get(xx, yy));
  const carve = clamp((f - 20) / 100, 0, 1);
  const tip = tally(fb, [
    {x: 370, y: 36, len: 30, age: 'old', lean: 1}, {x: 382, y: 37, len: 29, age: 'old', lean: -1},
    {x: 396, y: 35, len: 32, age: 'new', carve, lean: 1},
  ], {lit: 'left'});
  if (tip && carve < 1) pen(fb, tip[0], tip[1]);
  tallyRoom(fb, 340, 118, 3, {fresh: true});
  // D. fires S M L on the table edge; the L is put out by the spray at f 150
  cell(fb, 0, 135, 160, 135, 'FIRES  S M L / OUT');
  fire(fb, 26, 244, 'S', f, {seed: 0, glow: true});
  fire(fb, 56, 244, 'M', f, {seed: 1, glow: true});
  if (f < 150) fire(fb, 100, 244, 'L', f, {seed: 2, glow: true}); else fireOut(fb, 100, 244, 'L', f, f - 150);
  if (f >= 144 && f < 190) spray(fb, 150, 226, -1, f - 144, 50);
  // E. the GUEST badge (insert) and the desk coil
  cell(fb, 160, 135, 160, 135, 'GUEST  INSERT / DESK');
  guestBadge(fb, 190, 180, 'insert');
  guestBadge(fb, 266, 248, 'desk');
  // F. the pin tag, the badge worn at room scale
  cell(fb, 320, 135, 160, 135, 'PIN TAG / WORN');
  pinTag(fb, 340, 160);
  rect(430, 206, 12, 38, fb.ink(PAL.G2)); rect(428, 198, 16, 9, fb.ink(PAL.S3));
  guestWorn(fb, [430, 207], [441, 207], [434, 213]);
};

// ================================================================== EXTRAS: the letter counter, RIMA's spotlight, the lobby dialog (8 s)
export const EXTRA_FRAMES = 192;
export const drawExtras = (fb: Buf, f: number) => {
  rect(0, 0, 480, 270, fb.ink(PAL.N1));
  // the letter counter: rolls like the launch odometer, 505 . 650 . 700 . 745 / 770, and stops with a clunk
  const {value, clunk} = odoRoll(f, LETTER_STOPS(6, 24));
  odometer(fb, 30, 40, value, {digits: 3, label: 'THE LETTER', suffix: '/ 770', kick: clunk});
  text(fb, clunk ? 'clunk' : '', 30, 64, PAL.W6);
  // a new tile: RIMA TAMURI, and the hard circular spotlight that finds it (3 held drawings from f 20)
  const t: TileRect = {x: 300, y: 20, w: 150, h: 84};
  drawTile(fb, {...t, id: 'rima', name: 'RIMA TAMURI'}, f);
  if (f >= 20) spotlight(fb, t, t.x + 74, t.y + 34, 30, f - 20);
  // the all-hands (27.06): a row of employee tiles; one hand goes up (2 drawings)
  for (let i = 0; i < 8; i++) {
    const x = 30 + i * 30, y = 88;
    rect(x - 1, y - 1, 28, 22, fb.ink(PAL.N0));
    employeeFace(fb, x, y, 26, 20, 40 + i, i === 5 ? (f < 40 ? 0 : f < 44 ? 1 : 2) : 0);
  }
  // three red hearts float up to a doorway, one per beat, and hang there (30.03)
  rect(420, 212, 34, 56, fb.ink(PAL.N0)); rect(421, 213, 32, 55, fb.ink(PAL.W1));
  floatHearts(fb, 424, 200, f - 60);
  // the security-camera tile: the lobby from the board's side, a figure in a GUEST lanyard, his post upside-down
  const ct: TileRect = {x: 300, y: 112, w: 150, h: 84};
  drawTile(fb, {...ct, id: 'blank'}, f);
  for (let j = 0; j < 30; j++) for (let i = 0; i < ct.w; i++) fb.set(ct.x + i, ct.y + 54 + j, (i + j) % 7 ? PAL.D2 : PAL.D3);
  rect(ct.x, ct.y, ct.w, 54, fb.ink(PAL.N3)); rect(ct.x + 20, ct.y + 10, 40, 36, fb.ink(PAL.N5));
  const wx = ct.x + 40 + Math.floor(f / 3);
  rect(wx, ct.y + 36, 8, 30, fb.ink(PAL.G2)); rect(wx + 1, ct.y + 29, 6, 7, fb.ink(PAL.S3));
  guestWorn(fb, [wx + 1, ct.y + 37], [wx + 6, ct.y + 37], [wx + 3, ct.y + 42]);
  cctv(fb, ct, f, {post: 'first and last time i ever wear one of these'.slice(0, 22) + '...'});
  // the lobby dialog: Cancel greys out one dither step at a time; off-screen, the stranger's pointer clicks it. Bonk.
  const g = (f < 90 ? 0 : f < 105 ? 1 : f < 120 ? 2 : 3) as 0 | 1 | 2 | 3;
  const dx = 20, dy = 150, dw = 240;
  callDialog(fb, dx, dy, {w: dw, head: 'MAS MANALT', grey: g});
  if (f >= 128) {
    const [bx, by] = dialogButton(dx, dy, 'cancel', dw);
    const [px, py] = pointerAt(f, 128, 150, [470, 262], [bx + 30, by + 9]);
    drawPointer(fb, px, py, f >= 152 && f < 154);
    if (f >= 152 && f < 170) text(fb, 'bonk', bx + 6, by - 10, PAL.G4);
  }
};
