// MR. MAS · prototype 4 · 4a: THE STADIUM FEED (P4 SPORTS). What the draft's fixed stage camera sees, and what the
// boardroom TV shows small. Kram's Draft Night in a stadium bowl at night: the draft board is a wall of GPU racks
// (each pick lights one), the SUPERINTELLIGENCE DRAFT NIGHT fascia over it, a stage washed violet and cyan, and the
// stands behind in two depth bands that DEFOCUS BY STEPPED RESOLUTION (2x2 near, 4x4 far), never a blur.
// The OSD is generic broadcast grammar with parody marks only: a corner bug with LIVE, the pick card, the crawl,
// and the telestrator loop around the pick's soup.
import {Buf, rect, line, hash, bayer, clamp} from '../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../shared/pixel/palette';
import {bigText, bigTextWidth} from '../../../../shared/pixel/font';
import {blitImg} from '../../../../shared/pixel/figure';
import {tiny, tinyWidth} from '../../../../shared/pixel/rooms/kit-b';
import {stepDefocus, bokeh} from '../passes/defocus';
import {osdText, osdWidth, osdPlot} from '../passes/osdfont';
import {plate, revealStep, revealed, crawl, telestrator, tag} from '../passes/osd';
import {pickImg, PICK_FOOT, PICK_THERMOS, PICK_LID, bigCheck, CHECK_W, CHECK_H, PickPose} from './pick';

export const FEED_W = 480, FEED_H = 203;
// the draft board: 8 racks
const RACK = {x0: 100, pitch: 44, w: 38, y0: 44, y1: 146};
const STAGE = {back: 146, lip: 176, floorY: 186};
/** the frame (reel time) the fourth rack lights: in held steps over 3 frames */
export const RACK4_ON = 14;

// ------------------------------------------------------------------ the stands (out of focus, the pixel way)
// A bowl seen from the floor: tiers curve up toward the sides, people get bigger and catch more of the stage's
// spill toward the bottom. The stage camera is focused on the pick, so the stands are drawn SIMPLIFIED rather than
// blurred: each person is a head and a pair of shoulders in two or three rungs (no faces, no noise), the far tiers
// a rung darker and flatter than the near ones, and every point of light in the bowl (the floodlights, the phones up,
// a camera flash) becomes a hard-edged bokeh disc. The team's blue in the lower centre sections.
const SHIRTS = [PAL.N3, PAL.N4, PAL.U1, PAL.U2, PAL.G1, PAL.G2, PAL.D2, PAL.R0, PAL.F2, PAL.N5, PAL.U3, PAL.D3];
const TEAM = [PAL.F3, PAL.F4, PAL.F3, PAL.F2];
const SKIN = [PAL.S1, PAL.S2, PAL.S3, PAL.S3, PAL.B1, PAL.S4];
const curve = (x: number) => Math.round(20 * Math.pow((x - 240) / 240, 2));
const paintStands = (b: Buf, f: number) => {
  for (let y = 0; y < STAGE.back; y++) for (let x = 0; x < FEED_W; x++) b.set(x, y, y < 8 - curve(x) / 3 ? PAL.N0 : PAL.N1);
  // the tiers, far (top) to near: rows of seated people, each row's risers a dark line under them
  let yr = 10, r = 0;
  while (yr < STAGE.back + 24) {
    const t = Math.min(1, (yr - 10) / (STAGE.back - 10));
    const hr = t < 0.3 ? 1.4 : t < 0.65 ? 2 : 2.6; // head radius
    const pitch = Math.round(hr * 3.4 + 1);
    const rowH = Math.round(hr * 3.2 + 2);
    const dark = t < 0.3 ? -2 : t < 0.6 ? -1 : 0;
    for (let x0 = (r * 3) % pitch; x0 < FEED_W + pitch; x0 += pitch) {
      const yy = yr - curve(x0);
      if (yy >= STAGE.back + 4 || yy + rowH < 0) continue;
      const s = hash(x0, r, 7);
      // the seat row (a riser line), then the person, if the seat's taken
      rect(x0 - 1, yy + rowH - 1, pitch, 1, b.ink(r % 6 === 5 ? PAL.U0 : PAL.N2));
      if (s < 0.12) continue;
      const team = x0 > 130 && x0 < 350 && t > 0.45 && hash(x0, r, 3) < 0.55;
      const shirt = stepColor(team ? TEAM[Math.floor(hash(x0, r, 9) * TEAM.length)] : SHIRTS[Math.floor(hash(x0, r, 9) * SHIRTS.length)], dark - 1);
      const lit = stepColor(shirt, 1);
      const skin = stepColor(SKIN[Math.floor(hash(x0, r, 11) * SKIN.length)], dark - 1);
      const sway = hash(x0, r, 13) < 0.2 && Math.floor((f + r * 3) / 10) % 2 === 0 ? -1 : 0;
      const cx = x0 + Math.floor(pitch / 2), hy = yy + Math.round(hr) + sway;
      // shoulders: a low rounded block, its top lit by the stage
      const sw = Math.round(hr * 1.6), sh = Math.max(2, Math.round(hr * 1.4));
      for (let j = 0; j < sh; j++) for (let i = -sw; i <= sw; i++) {
        if (j === 0 && Math.abs(i) === sw) continue;
        if (yy + Math.round(hr * 2) + j >= STAGE.back) continue;
        b.set(cx + i, yy + Math.round(hr * 2) + j + sway, j === 0 ? lit : shirt);
      }
      // the head: a small disc, lit on top
      for (let j = -Math.ceil(hr); j <= Math.ceil(hr); j++) for (let i = -Math.ceil(hr); i <= Math.ceil(hr); i++) {
        if (i * i + j * j > hr * hr + 0.4) continue;
        if (hy + j >= STAGE.back) continue;
        b.set(cx + i, hy + j, j < -hr * 0.4 ? stepColor(skin, 1) : skin);
      }
    }
    // the aisles: stair strips that follow the bowl
    for (const ax of [26, 98, 172, 306, 382, 454]) { const yy = yr - curve(ax); rect(ax, yy, 2, rowH, b.ink(PAL.N2)); }
    // the LED ribbon fascias circling the bowl between the decks
    if (r === 3 || r === 9) for (let x = 0; x < FEED_W; x++) {
      const yy = yr + rowH - curve(x);
      b.set(x, yy, PAL.N0); b.set(x, yy + 2, PAL.N0);
      b.set(x, yy + 1, ((x + (r === 3 ? f : -f)) >> 2) % 7 < 5 ? (r === 3 ? PAL.C4 : PAL.W4) : PAL.N1);
    }
    yr += rowH + (r === 3 || r === 9 ? 3 : 0);
    r++;
  }
};
/** the bowl's lights, out of focus: floodlight banks at the rim as big warm discs, phones as small cold ones */
const standsBokeh = (b: Buf, f: number) => {
  for (let k = 0; k < 7; k++) {
    const tx = 20 + k * 73, ty = 4 - Math.round(curve(tx) / 4);
    bokeh(b, tx - 6, ty + 2, 9, PAL.U1, PAL.U3, {density: 0.7});
    bokeh(b, tx + 5, ty + 3, 8, PAL.W3, PAL.W5, {density: 0.8});
    bokeh(b, tx, ty + 1, 5, PAL.W6, PAL.W8);
  }
  for (let k = 0; k < 22; k++) {
    const x = Math.floor(hash(k, 1, 31) * FEED_W), y = 16 + Math.floor(hash(k, 2, 31) * 118);
    const on = hash(k, Math.floor((f + k * 7) / 30), 33) < 0.8;
    if (on && y - curve(x) > 10) bokeh(b, x, y - Math.round(curve(x) * 0.3), y < 50 ? 2 : 3, PAL.C4, PAL.C7);
  }
};

// ------------------------------------------------------------------ the draft board: a wall of GPU racks
const rackLit = (i: number, f: number) => (i < 3 ? 2 : i === 3 ? (f < RACK4_ON ? 0 : f < RACK4_ON + 3 ? 1 : 3) : 0);
const paintRacks = (b: Buf, f: number) => {
  for (let i = 0; i < 8; i++) {
    const x0 = RACK.x0 + i * RACK.pitch, x1 = x0 + RACK.w, y0 = RACK.y0 + 12, y1 = RACK.y1;
    const lit = rackLit(i, f);
    // cabinet: keyline, side post, face
    rect(x0 - 1, y0 - 1, RACK.w + 2, y1 - y0 + 1, b.ink(PAL.N0));
    rect(x0, y0, RACK.w, y1 - y0, b.ink(lit === 3 ? PAL.N3 : PAL.N1));
    rect(x0, y0, 2, y1 - y0, b.ink(lit === 3 ? PAL.C3 : PAL.G0));
    rect(x1 - 2, y0, 2, y1 - y0, b.ink(PAL.N0));
    // 1U slots with LED columns
    for (let yy = y0 + 3; yy < y1 - 3; yy += 4) {
      rect(x0 + 3, yy, RACK.w - 6, 3, b.ink(lit === 3 ? PAL.N4 : PAL.N2));
      rect(x0 + 3, yy + 2, RACK.w - 6, 1, b.ink(PAL.N0));
      for (let k = 0; k < 4; k++) {
        const lx = x0 + 6 + k * 3;
        const on = lit >= 2 ? hash(i * 31 + k, yy, Math.floor(f / 3)) < 0.7 : lit === 1 ? hash(i + k, yy, 3) < 0.5 : hash(i + k, yy, Math.floor(f / 9)) < 0.1;
        if (on) b.set(lx, yy + 1, lit === 3 ? PAL.C8 : lit === 2 ? PAL.L3 : lit === 1 ? PAL.C6 : PAL.N5);
      }
      // the vent grille on the right half
      for (let xx = x0 + 22; xx < x1 - 4; xx += 2) b.set(xx, yy + 1, lit === 3 ? PAL.C3 : PAL.N3);
    }
    // the pick number plate over each rack; the picked ones carry the team plate (ATEM) under the number
    const px0 = x0 + 4, pw = RACK.w - 8;
    rect(px0 - 1, RACK.y0 - 1, pw + 2, 12, b.ink(PAL.N0));
    rect(px0, RACK.y0, pw, 10, b.ink(lit === 3 ? PAL.W6 : lit === 2 ? PAL.F3 : PAL.N2));
    const num = String(i + 1);
    osdText(b, num, px0 + Math.round((pw - osdWidth(num)) / 2), RACK.y0 + 2, lit === 3 ? PAL.N0 : lit === 2 ? PAL.P2 : PAL.N5);
    if (lit >= 2) tiny(b, 'ATEM', x0 + Math.round((RACK.w - tinyWidth('ATEM')) / 2), y0 + 2, lit === 3 ? PAL.C9 : PAL.P1);
  }
  // the lit rack floods the stage behind the pick: a cyan halo on the fascia and the floor
  if (rackLit(3, f) === 3) {
    const cx = RACK.x0 + 3 * RACK.pitch + RACK.w / 2;
    for (let y = RACK.y0 - 6; y < STAGE.lip; y++) for (let x = cx - 44; x < cx + 44; x++) {
      const inRack = x >= cx - RACK.w / 2 && x < cx + RACK.w / 2 && y >= RACK.y0 && y < RACK.y1;
      if (inRack) continue;
      const d = Math.hypot((x - cx) / 44, (y - 100) / 70);
      if (d < 1 && bayer(x, y) < (1 - d) * 0.9) b.set(x, y, stepColor(b.get(x, y), 1));
    }
  }
};

// ------------------------------------------------------------------ the fascia sign
const paintFascia = (b: Buf, f: number) => {
  // the event's LED fascia: the heavy caps at 2x (each font pixel a 2x2 LED cell, the lower LED of each pair a rung
  // down: the pitch of a real LED board), a slow shimmer walking along it
  const s = 'SUPERINTELLIGENCE DRAFT NIGHT';
  const w = osdWidth(s) * 2;
  const x0 = Math.round((FEED_W - w) / 2), y0 = 21;
  rect(x0 - 10, y0 - 5, w + 20, 24, b.ink(PAL.N0));
  rect(x0 - 9, y0 - 4, w + 18, 22, b.ink(PAL.N1));
  for (let yy = y0 - 3; yy < y0 + 17; yy += 2) for (let xx = x0 - 8; xx < x0 + w + 8; xx += 2) b.set(xx, yy, PAL.N2); // dark LEDs
  osdPlot(s, 0, 0, (x, y) => {
    const X = x0 + x * 2, Y = y0 + y * 2;
    const hot = ((x >> 1) + 40 - (f >> 2)) % 23 === 0;
    b.set(X, Y, hot ? PAL.W8 : PAL.W7); b.set(X + 1, Y, hot ? PAL.W8 : PAL.W6);
    b.set(X, Y + 1, PAL.W5); b.set(X + 1, Y + 1, PAL.W5);
  });
  for (let x = x0 - 9; x < x0 + w + 9; x++) if (bayer(x, y0 + 18) < 0.5) b.set(x, y0 + 18, PAL.W2);
};

// ------------------------------------------------------------------ the stage
const paintStage = (b: Buf, f: number) => {
  // glossy black deck: the racks reflect in it, stepped down, broken by the boards
  for (let y = STAGE.back; y < STAGE.lip; y++) for (let x = 0; x < FEED_W; x++) {
    const my = STAGE.back - 1 - (y - STAGE.back) * 2;
    let c = PAL.N1;
    if (my > RACK.y0 && x > 96 && x < 450) { const src = b.get(x, my); c = stepColor(src, -3); if (c === PAL.N0) c = PAL.N1; }
    if ((y - STAGE.back) % 7 === 0) c = PAL.N0; // deck boards
    b.set(x, y, c);
  }
  // the violet wash pools and the spot on centre stage
  for (let y = STAGE.back; y < STAGE.lip; y++) for (let x = 0; x < FEED_W; x++) {
    for (const [px, r, col] of [[120, 70, PAL.U2], [390, 70, PAL.U2], [251, 46, PAL.G3]] as Array<[number, number, number]>) {
      const d = Math.hypot((x - px) / r, (y - 164) / 10);
      if (d < 1 && bayer(x, y) < (1 - d) * 0.9) b.set(x, y, col);
    }
  }
  // the lip: an LED strip, then the stage front (dark) with the centre steps
  rect(0, STAGE.lip, FEED_W, 1, b.ink(PAL.C6));
  rect(0, STAGE.lip + 1, FEED_W, 1, b.ink(PAL.C3));
  rect(0, STAGE.lip + 2, FEED_W, FEED_H - STAGE.lip - 2, b.ink(PAL.N0));
  for (let x = 0; x < FEED_W; x += 24) rect(x, STAGE.lip + 2, 1, FEED_H - STAGE.lip - 2, b.ink(PAL.N1));
  // the steps up the middle (three treads, lit edges)
  for (let k = 0; k < 3; k++) {
    const y = STAGE.lip + 2 + k * 8, x0 = 222 - k * 6, x1 = 280 + k * 6;
    rect(x0, y, x1 - x0, 8, b.ink(PAL.N2));
    rect(x0, y, x1 - x0, 1, b.ink(PAL.G2));
  }
  void f;
};

// ------------------------------------------------------------------ the pick's walk (reel frames)
export const PICK_X = RACK.x0 + 3 * RACK.pitch + Math.round(RACK.w / 2); // stands in front of the lit rack
export const pickState = (f: number): {pose: PickPose; footY: number; check: 'none' | 'low' | 'up'} => {
  // climbing the steps, back to camera (p24-59), feet rising a tread every 6 frames, legs alternating
  if (f < 60) {
    const k = Math.max(0, Math.floor((f - 24) / 6));
    const footY = Math.max(STAGE.lip - 8, 222 - k * 9);
    return {pose: Math.floor(f / 6) % 2 ? 'back1' : 'back0', footY, check: 'none'};
  }
  if (f < 66) return {pose: 'back0', footY: STAGE.lip - 8, check: 'none'};
  if (f < 70) return {pose: 'frontLow', footY: STAGE.lip - 9, check: 'low'};
  return {pose: 'front', footY: STAGE.lip - 8, check: 'up'};
};

/** a camera flash in the stands this frame (the boardroom's TV spill pulses with it) */
export const feedFlash = (f: number) => Math.floor(f / 7) % 2 === 0 && hash(Math.floor(f / 7), 0, 17) < 0.55 && f % 7 < 2; // <= 2 pops in any 24 f

/** the feed picture (no OSD) into `b` rows 0..202 */
export const drawFeedPicture = (b: Buf, f: number) => {
  paintStands(b, f);
  standsBokeh(b, f);
  // camera flashes in the stands: a small disc, <= 80% white, at most two pops in any 24 frames
  if (feedFlash(f)) {
    const x = Math.floor(hash(Math.floor(f / 7), 0, 19) * FEED_W), y = 20 + Math.floor(hash(Math.floor(f / 7), 0, 23) * 100);
    bokeh(b, x, y, 3, PAL.P0, PAL.P1); // <= 80% white
  }
  paintRacks(b, f);
  paintFascia(b, f);
  paintStage(b, f);
  // the pick
  if (f >= 24) {
    const st = pickState(f);
    const img = pickImg(st.pose);
    const x = PICK_X - PICK_FOOT[0], y = st.footY - PICK_FOOT[1];
    // the pick's shadow on the deck from the spot above (a squashed dark pool)
    if (st.footY <= STAGE.lip) for (let xx = -12; xx <= 12; xx++) for (let yy = -1; yy <= 1; yy++) if (Math.abs(xx) < 12 - Math.abs(yy) * 4) b.set(PICK_X + xx, st.footY + yy, PAL.N0);
    blitImg(b, img, x, y, {clip: (_x, yy) => yy < (st.footY > STAGE.lip ? FEED_H : STAGE.lip + 30)});
    // the check: its ends past the shoulders on the walk up (the board seen edge-on), the face once turned
    if (st.check === 'none') {
      for (const ex of [x + 20, x + 55]) { rect(ex, y + 32, 5, 17, b.ink(PAL.P0)); rect(ex, y + 32, 5, 1, b.ink(PAL.P1)); rect(ex + (ex < PICK_X ? 0 : 4), y + 32, 1, 17, b.ink(PAL.N0)); }
    } else {
      const cy = st.check === 'up' ? y + 19 : y + 29;
      blitImg(b, bigCheck(0), PICK_X - Math.floor(CHECK_W / 2), cy);
      // the hands on the check's lower corners, over the board
      for (const hx of [PICK_X - 36, PICK_X + 34]) { rect(hx - 1, cy + CHECK_H - 7, 4, 5, b.ink(PAL.S4)); rect(hx - 1, cy + CHECK_H - 7, 4, 1, b.ink(PAL.S5)); rect(hx + (hx < PICK_X ? -1 : 3), cy + CHECK_H - 7, 1, 5, b.ink(PAL.S2)); }
    }
  }
};

/** the soup's steam: two thin wisps off the cup lid, redrawn every 6 frames (three held shapes), never a smear */
const steam = (b: Buf, f: number) => {
  const st = pickState(f);
  if (st.check === 'none') return;
  const [lx, ly] = PICK_LID[st.pose];
  const x0 = PICK_X - PICK_FOOT[0] + lx, y0 = st.footY - PICK_FOOT[1] + ly;
  const k = Math.floor(f / 6) % 3;
  const W1 = [[0, -1], [1, -2], [1, -3], [0, -4], [0, -5], [1, -6]], W2 = [[3, -1], [3, -2], [2, -3], [2, -4], [3, -5]];
  const sway = [0, 1, -1][k];
  for (const [i, [dx, dy]] of W1.entries()) if ((i + k) % 5 !== 4) b.set(x0 - 2 + dx + (dy < -3 ? sway : 0), y0 + dy, i < 3 ? PAL.G5 : PAL.G4);
  for (const [i, [dx, dy]] of W2.entries()) if ((i + k + 2) % 4 !== 3) b.set(x0 + dx - (dy < -3 ? sway : 0), y0 + dy, i < 2 ? PAL.G4 : PAL.G3);
};

/** where the thermos is in the feed (for the telestrator) */
export const thermosAt = (f: number): [number, number] => {
  const st = pickState(f);
  const [tx, ty] = PICK_THERMOS[st.pose];
  return [PICK_X - PICK_FOOT[0] + tx, st.footY - PICK_FOOT[1] + ty];
};

// ------------------------------------------------------------------ the analyst's handwriting (the telestrator pen)
const HAND: Record<string, Array<[number, number]>> = {
  S: [[4, 0], [1, 0], [0, 1], [0, 2], [1, 3], [3, 3], [4, 4], [4, 5], [3, 6], [0, 6]],
  O: [[1, 0], [3, 0], [4, 1], [4, 5], [3, 6], [1, 6], [0, 5], [0, 1], [1, 0]],
  U: [[0, 0], [0, 5], [1, 6], [3, 6], [4, 5], [4, 0]],
  P: [[0, 7], [0, 0], [3, 0], [4, 1], [4, 2], [3, 3], [0, 3]],
};
/** a word in the telestrator pen: slanted strokes 2 px wide with a dark keyline, `n` letters written so far, and a
 * short tail from the word's lower left back to the loop (drawn with the first letter) */
const handWord = (b: Buf, word: string, x: number, y: number, n: number, tailX: number, tailY: number) => {
  const col = PAL.W7;
  const pts: Array<[number, number]> = [];
  const seg2 = (ax: number, ay: number, bx: number, by: number) => {
    const m = Math.max(Math.abs(bx - ax), Math.abs(by - ay), 1);
    for (let i = 0; i <= m; i++) pts.push([Math.round(ax + ((bx - ax) * i) / m), Math.round(ay + ((by - ay) * i) / m)]);
  };
  seg2(tailX, tailY, x - 2, y + 12);
  [...word].slice(0, n).forEach((ch, li) => {
    const g = HAND[ch];
    if (!g) return;
    const ox = x + li * 11;
    for (let i = 1; i < g.length; i++) {
      const [ax, ay] = g[i - 1], [bx, by] = g[i];
      seg2(ox + ax * 1.6 + (7 - ay) * 0.35, y + ay * 1.6, ox + bx * 1.6 + (7 - by) * 0.35, y + by * 1.6);
    }
  });
  for (const [px, py] of pts) for (const [dx, dy] of [[-1, 0], [2, 0], [0, -1], [0, 2], [2, 1], [-1, 1], [1, 2], [1, -1]]) if (b.get(px + dx, py + dy) !== col) b.set(px + dx, py + dy, PAL.N0);
  for (const [px, py] of pts) { b.set(px, py, col); b.set(px + 1, py, col); b.set(px, py + 1, col); b.set(px + 1, py + 1, col); }
};

// ------------------------------------------------------------------ the OSD
export const PICK_CARD_IN = 72, CRAWL_IN = 86, TELE_IN = 105;
export const drawFeedOSD = (b: Buf, f: number) => {
  // corner bug: the event's own mark and a LIVE tag
  plate(b, 8, 8, 30, 13, PAL.F3, PAL.F5, PAL.F1);
  osdText(b, 'SDN', 12, 11, PAL.P2, PAL.F0);
  tag(b, 'LIVE', 42, 11, PAL.R2, PAL.P2, PAL.N0);
  // the pick card lower third (steps in, left to right, 3 held steps)
  const t = revealStep(f - PICK_CARD_IN);
  revealed(b, 10, 150, 200, 30, t, (bb) => {
    // team block
    plate(bb, 10, 150, 28, 28, PAL.F3, PAL.F5, PAL.F0);
    tiny(bb, 'ATEM', 10 + Math.round((28 - tinyWidth('ATEM')) / 2), 161, PAL.P2);
    // the top tier: round and pick, heavy face
    plate(bb, 38, 150, 150, 15, PAL.N1, PAL.N3, PAL.N0);
    rect(38, 150, 3, 15, bb.ink(PAL.W6));
    osdText(bb, 'ROUND 1 · PICK 4', 45, 154, PAL.P2, PAL.N0);
    // the lower tier: the position line, light plate, dark micro caps
    plate(bb, 38, 165, 150, 13, PAL.P1, PAL.P2, PAL.P0);
    tiny(bb, 'RESEARCHER · PREV. NOPEAI', 45, 169, PAL.N2);
  });
  // the crawl: a label block and the POACHED ticker, stepping in after the pick card has landed (one gag at a time)
  revealed(b, 0, 186, FEED_W, 11, revealStep(f - CRAWL_IN), (bb) => {
    rect(0, 186, FEED_W, 11, bb.ink(PAL.N0));
    rect(0, 187, FEED_W, 9, bb.ink(PAL.N1));
    crawl(bb, 58, 189, FEED_W - 58, 'POACHED  ·  POACHED  ·  POACHED  ·', f - CRAWL_IN, PAL.P1, {speed: 1});
    plate(bb, 0, 187, 56, 9, PAL.W6, PAL.W7, PAL.W4);
    tiny(bb, 'DRAFT', 6, 189, PAL.N0);
    tiny(bb, 'TRACKER', 6 + tinyWidth('DRAFT') + 3, 189, PAL.N0);
  });
  // the telestrator: the analyst circles the soup, then writes the word beside it with a tail to the loop
  if (f >= TELE_IN) {
    const [tx, ty] = thermosAt(f);
    telestrator(b, tx, ty + 1, 10, 11, f - TELE_IN, {steps: 4, hold: 3, seed: 2});
    const k = f - TELE_IN - 13;
    if (k >= 0) handWord(b, 'SOUP', tx + 24, ty - 4, Math.min(4, Math.floor(k / 2) + 1), tx + 12, ty + 2);
  }
};

/** the whole device picture: picture + OSD */
export const drawFeed = (b: Buf, f: number) => {
  drawFeedPicture(b, f);
  steam(b, f);
  drawFeedOSD(b, f);
};
export {clamp, line, stepDefocus};
