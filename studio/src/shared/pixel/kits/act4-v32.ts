// MR. MAS — kit: ACT FOUR's v3.2 ITEMS (Ep1 script draft 8.1, script-v32-notes.md §4 and §10.7; new file, owned by
// the `v3-art-b` pass). Act Four's own modules are not edited: each item is a new drawing or a composition of theirs.
//   drawSuitePhone(b, f, st)       v32-S1.13 [ECU]: his phone in his hand in the suite's afternoon light, his thumb
//                                  typing (`typed` chars; no suggestion strip), then the post up in its own UI
//                                  (`post` k, the post card kit's phone card, `POST_LOVED`, its time `1:46 PM`), and the
//                                  room falling to night in held palette steps (`night` 0..3: the screen stays lit)
//   drawReceptionMCU(b, f, st)     v32-S5.00 [MCU], full colour at his shoulder: MAS at the reception desk by day (the
//                                  lobby soft behind him, the stone counter with its brass nosing), a receptionist's hand
//                                  (no face) sliding the `GUEST` lanyard across the stone (`slide` 0..3), him putting it
//                                  on (`lanyard` 'lift' · 'on'), the selfie at arm's length (`selfie`, `flash`: one white
//                                  step), the corner camera (`drawCornerCam`), his look up at it (`look`: the near-front
//                                  head, no change of expression), his badge post (`post` k, the post card kit's
//                                  `masBadge`, moved here from S4.09)
//   drawLobbyCCTVStep(b, f, st)    v32-S5.00's end: the lobby camera's frame full frame, stepping from colour into its
//                                  CCTV grade one palette step a beat (`step` 0 colour .. 4 the grade, grain up, the
//                                  chrome on): then the shot pass cuts to v5's wall-screen tile
//   drawBadgeUnderDoor(b, f, st)   S5.11 [ECU] at floor level: the slate door's foot and its gap of slate light, the
//                                  `MACROSOFT` badge sliding out across the floorboards (`slide` 0..4, held positions)
//                                  and ticking to a stop against his chair leg; his hand coming down for it (`hand` 1,
//                                  2 = it's lifted)
//   drawBadgeReach2S(b, f, st)     S5.11 [2S]: v5's dark two-shot with Mas leaning down out of his chair for it (`reach`),
//                                  and after, the two badges side by side on the desk, square (`badges`)
import {Buf, rect, line, hash, bayer, clamp} from '../px';
import {PAL, stepColor, nearest} from '../palette';
import {text, textWidth} from '../font';
import {pt, pw, pwrap} from './uitype';
import {tiny, tinyWidth} from '../rooms/kit-b';
import {drawPost, postLines, PostSpec, POSTS} from './post-card';
import {macrosoftBadge} from './macrosoft-badge';
import {macrosoftInsert} from './act4-v31';
import {masPortrait, MAS_PORTRAIT_DEFAULT, MasPortraitState} from '../cast/mas';
import {putBustCut} from '../cast/civic-kit';
import {drawLobby, cctvGrade, LOBBY} from '../rooms/lobby';
import {LOBBY_FEED_LABEL} from './lobby-feed';
import {drawMasStand, MAS_STAND_DEFAULT} from '../cast/mas-stand';
import {holdFingers} from '../rooms/bay-bridge';
import {drawDarkPlate, drawDarkPlateDesk, drawDarkPlateFront, DPLATE, DPLATE_LOOK, DarkPlateOpts} from '../rooms/darkroom-plate';
import * as MM from '../cast/mas-medium';
import * as OM from '../cast/orb-medium';

const RH = 203;

// ================================================================== his phone in the suite (v32-S1.13)
/** his post (facts W4: the middle sentences trimmed with a print ellipsis, the name swap only); the salute is drawn after
 *  the text (the UI face has no emoji) */
export const POST_LOVED: PostSpec = {who: 'mas', text: "i loved my time at nopeai. … will have more to say about what's next later.", ts: '1:46 PM', hearts: 0};
const SALUTE = ['..www..', '.wwwwhh', 'wwewehh', 'wwwwwwh', 'wwmmmww', '.wwwww.', '..www..'];
const salute = (b: Buf, x: number, y: number) => SALUTE.forEach((r, j) => { for (let i = 0; i < 7; i++) { const c = ({w: PAL.W6, e: PAL.N0, h: PAL.W8, m: PAL.D1} as Record<string, number>)[r[i]]; if (c !== undefined) b.set(x + i, y + j, c); } });
export interface SuitePhoneState { typed?: number; post?: number | null; night?: 0 | 1 | 2 | 3; thumb?: 0 | 1; }
export const drawSuitePhone = (b: Buf, f: number, st: SuitePhoneState = {}) => {
  // the suite's afternoon behind the phone, out of focus: the window's warm glare, the Strip pale in the heat
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const t = x / 480 + (bayer(x, y) - 0.5) * 0.25;
    b.set(x, y, y > 150 ? (t < 0.5 ? PAL.D3 : PAL.D2) : t < 0.35 ? PAL.W7 : t < 0.6 ? PAL.W6 : t < 0.8 ? PAL.W5 : PAL.D4);
  }
  for (let k = 0; k < 9; k++) { const x = 20 + k * 52 + Math.round(hash(k, 1, 7) * 20), h = 30 + Math.round(hash(k, 2, 7) * 50); for (let y = 150 - h; y < 150; y++) for (let i = 0; i < 16; i++) if (bayer(x + i, y) < 0.5) b.set(x + i, y, stepColor(b.get(x + i, y), -1)); }
  // the phone in his left hand (the fingers round its left edge), the screen lit
  const px = 150, py = 6, pw2 = 180, ph = 197;
  rect(px + 4, py + 4, pw2, ph, b.ink(PAL.D1));
  rect(px, py, pw2, ph + 10, b.ink(PAL.N0)); rect(px + 1, py + 1, pw2 - 2, ph + 10, b.ink(PAL.G1)); rect(px + 1, py, pw2 - 2, 1, b.ink(PAL.G4));
  const sx = px + 7, sy = py + 10, sw = pw2 - 14;
  rect(sx, sy, sw, RH - sy, b.ink(PAL.N1));
  if (st.post === null || st.post === undefined) {
    // the compose box: his words, typed (no suggestions), the keyboard under it
    rect(sx, sy, sw, 12, b.ink(PAL.N2)); pt(b, 'new post', sx + 4, sy + 2, PAL.G5);
    const s = POST_LOVED.text.slice(0, Math.max(0, Math.floor(st.typed ?? 999)));
    const ls = pwrap(s, sw - 10);
    ls.forEach((l, i) => pt(b, l, sx + 5, sy + 18 + i * 10, PAL.P2));
    if ((st.typed ?? 999) >= POST_LOVED.text.length) salute(b, sx + 7 + pw(ls[ls.length - 1] ?? ''), sy + 18 + (ls.length - 1) * 10);
    else if (Math.floor(f / 8) % 2 === 0) rect(sx + 6 + pw(ls[ls.length - 1] ?? ''), sy + 18 + Math.max(0, ls.length - 1) * 10, 1, 8, b.ink(PAL.C6));
    const ky = sy + 104;
    rect(sx, ky, sw, RH - ky, b.ink(PAL.G1));
    for (let r = 0; r < 4; r++) for (let c = 0; c < 10; c++) rect(sx + 3 + c * 16, ky + 4 + r * 18, 13, 15, b.ink(r === 3 && c > 1 && c < 8 ? PAL.G2 : PAL.G2));
    // his right thumb over the keys, two held drawings (typing)
    const tx = sx + 60 + (st.thumb ? 34 : 0), ty = ky + 26 + (st.thumb ? 18 : 0);
    for (let yy = ty - 10; yy < RH; yy++) for (let xx = tx - 12; xx < 480; xx++) {
      const qx = xx - tx - 4, qy = yy - ty - 6, t = Math.max(0, Math.min(300, qx * 0.55 + qy * 0.83)), d = Math.hypot(qx - 0.55 * t, qy - 0.83 * t);
      if (d > 12) continue;
      const side = (qx - 0.55 * t) * 0.83 - (qy - 0.83 * t) * 0.55;
      const nail = t < 15 && Math.abs(side + 1) < 6;
      b.set(xx, yy, d > 11 ? PAL.S1 : nail ? (t < 6 ? PAL.P1 : PAL.S5) : side < -4 ? PAL.S5 : side > 5 ? PAL.S3 : PAL.S4);
    }
  } else {
    const w = sw - 8, lines = postLines(POST_LOVED, 'phone', w);
    const {h} = drawPost(b, sx + 4, sy + 16, POST_LOVED, {size: 'phone', w, k: st.post});
    if (st.post >= 3) salute(b, sx + 4 + 26 + pw(lines[lines.length - 1] ?? '') + 3, sy + 16 + 19 + (lines.length - 1) * 10);
    void h;
  }
  holdFingers(b, px + 2, py + 118, 4, [PAL.S1, PAL.S3, PAL.S4, PAL.S5]);
  // the fall to night: everything but the lit screen steps a rung a beat: 1 the afternoon a rung down, 2 dusk (each
  // colour to the navy rung of its brightness), 3 night (that, a rung darker)
  const n = st.night ?? 0;
  const NR = [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N5];
  if (n) for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    if (x >= sx && x < sx + sw && y >= sy) continue;
    const c0 = b.get(x, y);
    if (n === 1) { b.set(x, y, stepColor(c0, -1)); continue; }
    const lum = (0.2126 * ((c0 >> 16) & 255) + 0.7152 * ((c0 >> 8) & 255) + 0.0722 * (c0 & 255)) / 255;
    b.set(x, y, NR[Math.max(0, Math.min(5, Math.floor(lum * 7) - (n === 3 ? 2 : 0)))]);
  }
};

// ================================================================== the reception desk, by day (v32-S5.00)
/** the corner camera (a small dome on a wall bracket, its red tally): (x, y) = the bracket's top */
export const drawCornerCam = (b: Buf, x: number, y: number, o: {rec?: boolean} = {}) => {
  rect(x, y, 3, 8, b.ink(PAL.G2)); rect(x - 6, y + 7, 15, 3, b.ink(PAL.G3)); rect(x - 6, y + 7, 15, 1, b.ink(PAL.G5));
  for (let j = 0; j < 9; j++) for (let i = -8; i <= 8; i++) { const d = Math.hypot(i / 8, j / 9); if (d <= 1) b.set(x + 1 + i, y + 10 + j, d > 0.85 ? PAL.N1 : i < -2 ? PAL.G4 : PAL.G2); }
  rect(x - 1, y + 14, 4, 3, b.ink(PAL.N0)); b.set(x, y + 15, PAL.C6); // the lens
  if (o.rec !== false) b.set(x + 5, y + 12, PAL.R3);
};
/** the lanyard at MCU scale: the card (22 x 13: the red band, GUEST in small caps, a photo square), its strap */
const guestCardMCU = (b: Buf, x: number, y: number) => {
  rect(x + 1, y + 1, 22, 13, b.ink(PAL.N0)); rect(x, y, 22, 13, b.ink(PAL.P2)); rect(x, y + 2, 22, 3, b.ink(PAL.R2)); rect(x + 10, y, 3, 1, b.ink(PAL.N1));
  tiny(b, 'GUEST', x + Math.round((22 - tinyWidth('GUEST')) / 2), y + 6, PAL.N1);
};
export interface ReceptionState {
  /** the receptionist's hand sliding the lanyard across the stone: 0..3 held positions (null: it's his now) */
  slide?: 0 | 1 | 2 | 3 | null;
  /** 'lift' (the strap over his head in both hands) · 'on' (round his neck, the card on his chest) */
  lanyard?: 'lift' | 'on' | null;
  selfie?: boolean;
  /** the photo's flash: one white step on this frame */
  flash?: boolean;
  /** his look up at the corner camera: the near-front head (no change of expression) */
  look?: boolean;
  mas?: Partial<MasPortraitState>;
  post?: number | null;
}
let LOBBY_DAY: Buf | null = null;
const lobbyDay = () => (LOBBY_DAY ??= (() => { const t = new Buf(480, RH, PAL.N0); drawLobby(t, {f: 0, time: 'day'}); return t; })());
export const RECEPTION = {mas: [250, 22] as [number, number], counterY: 138, cam: [446, 4] as [number, number]};
export const drawReceptionMCU = (b: Buf, f: number, st: ReceptionState = {}) => {
  // the lobby by day behind him, soft (two rungs down): its far wall and elevators
  const L = lobbyDay();
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, stepColor(L.get(clamp(x - 40, 0, 479), clamp(y + 10, 0, RH - 1)), -2));
  drawCornerCam(b, RECEPTION.cam[0], RECEPTION.cam[1]);
  // MAS at the counter, facing it (the portrait's 3/4 to camera-left); the near-front head for his look at the camera
  const [mx, my] = RECEPTION.mas;
  const img = masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'warm', ...(st.look ? {head: 'front' as const, look: 0 as const} : {}), ...st.mas});
  putBustCut(b, img, mx, my, RH);
  // the lanyard on him: the strap's V from his neck to the card on his chest
  if (st.lanyard === 'on') {
    line(mx + 40, my + 88, mx + 52, my + 116, b.ink(PAL.R2)); line(mx + 70, my + 88, mx + 60, my + 116, b.ink(PAL.R1));
    guestCardMCU(b, mx + 45, my + 116);
  }
  // the stone counter in the foreground left: its top, the brass nosing, the face with its joints
  const cy = RECEPTION.counterY;
  for (let y = cy; y < RH; y++) for (let x = 0; x < 236 - Math.max(0, (y - cy) >> 2); x++) {
    let c: number;
    if (y < cy + 12) c = hash(x >> 2, y, 13) < 0.08 ? PAL.G5 : bayer(x, y) < 0.3 ? PAL.P0 : PAL.P1; // the top, veined
    else if (y < cy + 14) c = y === cy + 12 ? PAL.W7 : PAL.W4; // the brass nosing
    else c = x % 60 === 0 ? PAL.G4 : bayer(x, y) < 0.2 ? PAL.G5 : PAL.P0; // the face
    b.set(x, y, c);
  }
  // the receptionist's hand (no face): in from behind the counter at the left, sliding the lanyard to him
  if (st.slide !== null && st.slide !== undefined) {
    const cx = [24, 70, 118, 160][st.slide];
    // the strap coiled behind the card, the card flat on the stone (foreshortened)
    for (let i = 0; i < 16; i++) b.set(cx - 14 + i, cy + 4 + (i % 5 < 2 ? 0 : 1), PAL.R2);
    rect(cx, cy + 2, 26, 8, b.ink(PAL.P2)); rect(cx, cy + 2, 26, 2, b.ink(PAL.R2)); rect(cx + 1, cy + 10, 26, 1, b.ink(PAL.G5));
    tiny(b, 'GUEST', cx + 4, cy + 4, PAL.N1);
    // her hand flat on the card, pushing it (the back of the hand, four fingertips over its near edge), a dark cuff back
    // to the frame's left edge
    const hx = cx - 9, hy = cy + 1; // her fingertips on the card's near edge, clear of its word
    for (let j = -8; j <= 5; j++) for (let i = -26; i <= 8; i++) { const d = Math.hypot((i + 9) / 17, j / 7); if (d <= 1) b.set(hx + i, hy + j, d > 0.88 ? PAL.S1 : j < -3 ? PAL.S5 : PAL.S4); }
    for (let k = 0; k < 4; k++) for (let j = 0; j < 5; j++) for (let i = 0; i < 5; i++) if (Math.hypot(i - 2, j - 2) <= 2.4) b.set(hx + 6 + i, hy - 7 + k * 3 + j, j === 0 ? PAL.S5 : PAL.S4);
    for (let y = hy - 6; y <= hy + 4; y++) for (let x = 0; x < hx - 22; x++) b.set(x, y, y === hy - 6 ? PAL.N4 : x > hx - 27 ? PAL.P1 : PAL.N2);
  }
  // putting it on: both hands up at his head's sides, the red strap's loop over his hair
  if (st.lanyard === 'lift') {
    for (let a = 0; a <= 40; a++) { const t = Math.PI * (a / 40), x = Math.round(mx + 56 - Math.cos(t) * 34), y = Math.round(my + 20 - Math.sin(t) * 14); b.set(x, y, PAL.R2); b.set(x, y + 1, PAL.R1); }
    // both forearms up from his shoulders (the hoodie's sleeves), the hands at his head's sides holding the strap
    for (const [hx, sx2] of [[mx + 22, mx + 30], [mx + 90, mx + 84]] as Array<[number, number]>) {
      for (let y = my + 26; y < my + 104; y++) { const t = (y - my - 26) / 78, x = Math.round(hx + (sx2 - hx) * t); for (let i = -6; i <= 6; i++) b.set(x + i, y, Math.abs(i) === 6 ? PAL.N0 : i < -2 ? PAL.G3 : PAL.G2); }
      rect(hx - 6, my + 26, 13, 3, b.ink(PAL.G4)); // the cuff
      for (let j = 0; j < 16; j++) for (let i = 0; i < 14; i++) { const d = Math.hypot((i - 7) / 7, (j - 8) / 8); if (d <= 1) b.set(hx - 7 + i, my + 12 + j, d > 0.88 ? PAL.S1 : i < 5 ? PAL.S5 : PAL.S4); }
    }
    guestCardMCU(b, mx + 14, my + 26);
  }
  // the selfie: his near arm out and up, the phone at arm's length, its back to us (the lens), the flash's white step
  if (st.selfie) {
    const ax = mx + 20, ay = my + 118, hx = mx - 40, hy = my + 30;
    const Ln = Math.hypot(hx - ax, hy - ay), ux = (hx - ax) / Ln, uy = (hy - ay) / Ln;
    for (let t = 0; t <= Ln; t += 0.5) for (let s = -8; s <= 8; s += 0.5) { const X = Math.round(ax + ux * t - uy * s), Y = Math.round(ay + uy * t + ux * s); b.set(X, Y, Math.abs(s) > 7.5 ? PAL.N0 : s < -3 ? PAL.G3 : PAL.G2); }
    for (let j = 0; j < 12; j++) for (let i = 0; i < 12; i++) { const d = Math.hypot((i - 6) / 6, (j - 6) / 6); if (d <= 1) b.set(hx - 6 + i, hy - 2 + j, d > 0.85 ? PAL.S1 : PAL.S4); }
    rect(hx - 10, hy - 30, 20, 34, b.ink(PAL.N0)); rect(hx - 9, hy - 29, 18, 32, b.ink(PAL.G1)); rect(hx - 9, hy - 29, 18, 1, b.ink(PAL.G3)); // the phone's back
    rect(hx - 6, hy - 26, 5, 5, b.ink(PAL.N0)); b.set(hx - 4, hy - 24, PAL.C6); // the lens
    b.set(hx + 2, hy - 25, st.flash ? PAL.P2 : PAL.G4);
  }
  if (st.flash) for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, stepColor(b.get(x, y), 2)); // one white step
  if (st.post !== null && st.post !== undefined) drawPost(b, 14, 12, POSTS.masBadge, {size: 'popup', w: 200, k: st.post});
};

// ================================================================== the camera's frame, stepping into its grade (v32-S5.00)
/** the lobby camera's view full frame (the lobby's own wide by day, Mas at the desk wearing the lanyard), stepped from
 *  colour toward its CCTV grade one palette step a beat: each step the nearest palette colour to that share of the
 *  way, a little more grain; at 4 the grade itself with the chrome (`NOPEAI HQ · LOBBY · NOV 19`, REC, the brackets) */
export const drawLobbyCCTVStep = (b: Buf, f: number, st: {step?: 0 | 1 | 2 | 3 | 4; phase?: 'stand' | 'look'} = {}) => {
  const s = st.step ?? 0;
  const col = new Buf(480, RH, PAL.N0);
  drawLobby(col, {f, time: 'day'}, {lobby: (bb) => drawMasStand(bb, 196, LOBBY.FEET.desk, {...MAS_STAND_DEFAULT, guest: true, light: 'room'})});
  const gr = col.clone(); cctvGrade(gr);
  const t = s / 4;
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const c = col.get(x, y), g = gr.get(x, y);
    let v: number;
    if (s === 0) v = c; else if (s === 4) v = g;
    else {
      const mix = (sh: number) => Math.round(((c >> sh) & 255) * (1 - t) + ((g >> sh) & 255) * t);
      v = nearest((mix(16) << 16) | (mix(8) << 8) | mix(0));
    }
    if (s > 0 && hash(x, y, 91 + (Math.floor(f / 2) % 7)) < 0.02 * s) v = stepColor(v, hash(x, y, 5) < 0.5 ? 1 : -1); // the grain
    b.set(x, y, v);
  }
  if (s >= 3) {
    const ink = PAL.G5;
    for (const [cx, cy, dx, dy] of [[4, 4, 1, 1], [475, 4, -1, 1], [4, RH - 5, 1, -1], [475, RH - 5, -1, -1]] as Array<[number, number, number, number]>) for (let k = 0; k < 8; k++) { b.set(cx + dx * k, cy, ink); b.set(cx, cy + dy * k, ink); }
  }
  if (s >= 4) {
    const plate = (str: string, x: number, y: number) => { rect(x - 2, y - 2, textWidth(str) + 4, 11, b.ink(PAL.N1)); text(b, str, x, y, PAL.G6); };
    plate(LOBBY_FEED_LABEL, 15, 8);
    plate('REC', 480 - 15 - textWidth('REC'), RH - 16);
  }
};

// ================================================================== the badge under the door (S5.11)
/** the floor at the door, close: the slate door's foot and its gap of slate light, the dark floorboards toward the
 *  camera, his chair's leg and caster at the right; the badge slides out in held positions and ticks against the leg */
export const drawBadgeUnderDoor = (b: Buf, f: number, st: {slide?: 0 | 1 | 2 | 3 | 4; hand?: 0 | 1 | 2} = {}) => {
  const doorY = 44;
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    let c: number;
    if (y < doorY) c = x > 70 && x < 410 ? (x === 71 || x === 409 ? PAL.G3 : bayer(x, y) < 0.3 ? PAL.G2 : PAL.G1) : PAL.N1; // the door, slate, and the wall
    else if (y < doorY + 3) c = x > 70 && x < 410 ? (y === doorY ? PAL.G6 : PAL.G5) : PAL.N0; // the gap's slate light
    else {
      const plank = Math.floor((x + (y - doorY) * 0.9) / 38) % 2;
      c = (x + (y - doorY)) % 38 === 0 ? PAL.D0 : plank ? PAL.D1 : PAL.D0;
      const light = Math.max(0, 1 - (y - doorY) / 70);
      if (x > 60 && x < 420 && bayer(x, y) < light * 0.5) c = PAL.G2; // the slate light spilling onto the boards
    }
    b.set(x, y, c);
  }
  // his chair's leg and caster at the right
  rect(352, 60, 10, 130, b.ink(PAL.N0)); rect(352, 60, 2, 130, b.ink(PAL.G2));
  for (let j = 0; j < 14; j++) for (let i = 0; i < 24; i++) { const d = Math.hypot((i - 12) / 12, (j - 7) / 7); if (d <= 1) b.set(346 + i, 184 + j, d > 0.8 ? PAL.N0 : PAL.G1); }
  // the badge: under the door's edge (half hidden), then out across the boards, then against the leg (a tick: 1 px back)
  const pos: Array<[number, number]> = [[190, doorY - 22], [210, doorY + 8], [250, doorY + 42], [282, doorY + 72], [284, doorY + 84]];
  const [bx, by] = pos[st.slide ?? 4];
  const lift = st.hand === 2 ? -8 : 0;
  const t = new Buf(480, RH, 0x1000000);
  macrosoftInsert(t, bx, by + lift);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const c = t.get(x, y); if (c === 0x1000000) continue; if ((st.slide ?? 4) === 0 && y < doorY + 1) continue; b.set(x, y, c); }
  if ((st.slide ?? 4) >= 2 && !st.hand) for (let j = 0; j < 4; j++) b.set(bx + 34 + j * 3, by + 46, PAL.D0); // its shadow on the boards
  // his hand coming down from above for it (the hoodie sleeve from the frame's top-right), then holding it
  if (st.hand) {
    const hx = bx + 16, hy = by + lift - 12;
    for (let y = 0; y < hy; y++) for (let x = hx + 4; x < hx + 34; x++) { const w = x - hx - 4; b.set(x + Math.round((hy - y) * 0.35), y, w < 2 || w > 27 ? PAL.N0 : w < 8 ? PAL.G3 : PAL.G2); }
    // the back of his hand (a rounded block, lit from the door's slate light above), four fingers down over the badge's
    // top edge, the thumb under it at the side
    const bw = 30, bh = 14;
    for (let j = 0; j < bh; j++) for (let i = 0; i < bw; i++) { if ((i < 2 || i > bw - 3) && (j < 2)) continue; b.set(hx + i, hy + j, i === 0 || i === bw - 1 || j === 0 ? PAL.S1 : j < 4 ? PAL.S5 : PAL.S4); }
    for (let k = 0; k < 4; k++) for (let j = 0; j < 10; j++) for (let i = 0; i < 7; i++) { const d = Math.hypot((i - 3) / 3.5, (j - 5) / 5); if (d <= 1) b.set(hx + 1 + k * 7 + i, hy + bh - 3 + j, d > 0.8 ? PAL.S2 : j > 6 ? PAL.S3 : PAL.S4); }
    for (let j = 0; j < 12; j++) for (let i = 0; i < 8; i++) { const d = Math.hypot((i - 4) / 4, (j - 6) / 6); if (d <= 1) b.set(hx + bw - 4 + i, hy + 6 + j, d > 0.8 ? PAL.S1 : PAL.S4); } // the thumb
  }
};
/** v5's dark two-shot (rooms/twoshots drawDark2S's recipe, re-composed): `reach` = Mas leaning down out of frame for the
 *  badge (the medium drawn lower and forward, his arms under the desk); `badges` = the two badges on the desk, square:
 *  the plate's GUEST lanyard and the MACROSOFT badge beside it (macrosoft-badge 'desk') */
export const drawBadgeReach2S = (b: Buf, f: number, st: {reach?: boolean; badges?: boolean; plate?: DarkPlateOpts; mas?: Partial<MM.MasMediumState>; orbLook?: [number, number]} = {}) => {
  const o: DarkPlateOpts = {tally: 3, glass: true, lanyard: true, ...st.plate};
  drawDarkPlate(b, f, o);
  const [ox, oy] = DPLATE.orb;
  OM.drawOrb(b, ox, oy + OM.orbBob(f), OM.ORB_MR, {look: st.orbLook ?? (st.reach ? [0.2, 0.9] : DPLATE_LOOK.face), aperture: 0.5, monitor: -1});
  const [mx, my] = DPLATE.mas;
  const desk = (bb: Buf) => {
    drawDarkPlateDesk(bb, f, o);
    if (st.badges) macrosoftBadge(bb, DPLATE.lanyard.x + 46, DPLATE.lanyard.y + 3, 'desk');
  };
  MM.drawMasMedium(b, mx + (st.reach ? 6 : 0), my + (st.reach ? 10 : 0), {...MM.MAS_MEDIUM_DEFAULT, ...(st.reach ? {head: 'down' as const, arm: 'down' as const} : {}), ...st.mas}, {desk});
  drawDarkPlateFront(b, f, o);
};
