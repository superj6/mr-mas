// MR. MAS — shared kit: THE LOBBY CAMERA, NEARER THE DESK (ROOM-LOBBY-CCTV-DESK; Ep1 Act Four v5 art pass; new file,
// owned by the v5 art pass). S4.09: on the boardroom's wall screen, the security camera's feed, "high in a corner and
// grainy", nearer the reception desk than v4's reverse angle: the revolving door at the left, the desk at the right,
// MAS standing at it as if there a while. Then he turns and goes out through the revolving door, which keeps turning.
// Built at 1:1 from the lobby's own DAY wide (rooms/lobby.ts drawLobby, a window of it: nothing scaled), graded to
// CCTV (lobby.ts cctvGrade), in its own chrome: NOPEAI HQ · LOBBY · NOV 19, REC, the corner brackets.
// GUEST must read (art-needs §1.4): a room-scale lanyard is a few pixels, so the feed's own ZOOM window (a security
// app's digital-zoom inset, its own drawing at insert scale: kits/props.ts guestBadge 'insert') holds on the card
// while he stands, then closes in 3 held steps when he turns. It is the feed's UI, never a scaled sprite.
//   drawLobbyFeed(b, st)   into `b` at its own size (designed for FEED_W x FEED_H = 224 x 168, 4:3, the wall screen's
//                          pillarboxed feed; any width up to 480 works: the window just widens)
//     st.f      the act frame (the drum turns a held drawing every 4 f, always)
//     st.phase  'stand' (at the desk, the ZOOM on the card from k 6) · 'turn' (he turns: facing the door) ·
//               'walk' (k frames: to the drum on 3s, whole px) · 'gone' (the drum still turning)
//     st.k      frames into the phase
import {Buf, rect, ellipse} from '../px';
import {PAL} from '../palette';
import {text, textWidth} from '../font';
import {drawLobby, cctvGrade, LOBBY} from '../rooms/lobby';
import {drawMasStand, MAS_STAND_DEFAULT, masWalkAt} from '../cast/mas-stand';
import {guestBadge} from './props';

export const FEED_W = 224, FEED_H = 168;
export type LobbyFeedPhase = 'stand' | 'turn' | 'walk' | 'gone';
export interface LobbyFeedState { f: number; phase: LobbyFeedPhase; k: number; label?: string; zoom?: boolean }
/** where in the lobby wide the feed's window starts (it keeps the drum and the desk's near end) */
const WIN = {x: 8, y: 30};
const DESK_X = 196; // his feet at the desk's front
const drumCx = LOBBY.REVOLVE.cx;
export const LOBBY_FEED_LABEL = 'NOPEAI HQ · LOBBY · NOV 19';

export const drawLobbyFeed = (b: Buf, st: LobbyFeedState) => {
  const W = b.w, H = b.h;
  const revolve = Math.floor(st.f / 4) % 4;
  const tmp = new Buf(480, 203, PAL.N0);
  // Mas: at the desk (facing it, 3/4 toward camera-right), turned (flipped: toward the door), walking to the drum,
  // inside the drum (the back layer: its glass and wings pass over him), gone
  const walkX = st.phase === 'walk' ? DESK_X - Math.floor(st.k / 3) * 3 : DESK_X;
  const inDrum = st.phase === 'walk' && walkX <= drumCx + 18;
  const pose = {...MAS_STAND_DEFAULT, guest: true, light: 'room' as const};
  const mas = (bb: Buf) => {
    if (st.phase === 'gone') return;
    if (st.phase === 'stand') drawMasStand(bb, DESK_X, LOBBY.FEET.desk, pose);
    else if (st.phase === 'turn') drawMasStand(bb, DESK_X, LOBBY.FEET.desk, pose, {flip: true});
    else if (!inDrum) drawMasStand(bb, walkX, LOBBY.FEET.desk + Math.min(10, Math.floor((DESK_X - walkX) / 14)), {...pose, legs: masWalkAt(st.k)}, {flip: true});
  };
  const masInDrum = (bb: Buf) => { if (inDrum && walkX > drumCx - 30) drawMasStand(bb, Math.max(drumCx - 8, walkX), LOBBY.REVOLVE.floor, {...pose, legs: masWalkAt(st.k)}, {flip: true}); };
  drawLobby(tmp, {f: st.f, time: 'day', revolve}, {back: masInDrum, lobby: mas});
  // the feed's window onto the wide, graded
  const view = new Buf(W, H, PAL.N0);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) view.c[y * W + x] = tmp.get(WIN.x + x, WIN.y + y);
  cctvGrade(view);
  for (let i = 0; i < b.c.length; i++) b.c[i] = view.c[i];
  // the chrome: brackets, the label, REC
  const ink = PAL.G5;
  for (const [cx, cy, dx, dy] of [[4, 4, 1, 1], [W - 5, 4, -1, 1], [4, H - 5, 1, -1], [W - 5, H - 5, -1, -1]] as Array<[number, number, number, number]>) {
    for (let k = 0; k < 8; k++) { b.set(cx + dx * k, cy, ink); b.set(cx, cy + dy * k, ink); }
  }
  // r3: the label and REC sit on a dark backing strip, clear of the corner brackets (the stills check: light text
  // with a black shadow over the bright day lobby broke up into "II@PEAI HQ" under the grade's scanlines)
  const label = st.label ?? LOBBY_FEED_LABEL;
  const plate = (s: string, x: number, y: number) => { rect(x - 2, y - 2, textWidth(s) + 4, 11, b.ink(PAL.N1)); text(b, s, x, y, PAL.G6); };
  plate(label, 15, 8);
  const rx = W - 15 - textWidth('REC');
  plate('REC', rx, H - 16);
  if (Math.floor(st.f / 12) % 2 === 0) ellipse(rx - 6, H - 13, 2.2, 2.2, (x, y) => b.set(x, y, PAL.R3));
  // the ZOOM window on his card (while he stands at the desk), 3 held steps in and out
  if (st.zoom !== false) {
    const kIn = st.phase === 'stand' ? st.k - 6 : -1;
    const kOut = st.phase === 'turn' ? st.k : -1;
    const open = kIn >= 0 ? Math.min(1, (kIn + 1) / 3) : kOut >= 0 && kOut < 3 ? 1 - (kOut + 1) / 3 : 0;
    if (open > 0) zoomWindow(b, W - 88, 20, 80, 66, open);
  }
};
/** the digital-zoom inset: his hoodie's front with the lanyard card (insert scale), graded like the feed */
const zoomWindow = (b: Buf, x: number, y: number, w: number, h: number, open: number) => {
  const hh = Math.max(3, Math.round(h * (open >= 1 ? 1 : open >= 0.66 ? 0.66 : 0.33)));
  const yy = y + Math.round((h - hh) / 2);
  rect(x - 2, yy - 2, w + 4, hh + 4, b.ink(PAL.N0)); rect(x - 1, yy - 1, w + 2, hh + 2, b.ink(PAL.G5));
  if (open < 1) { rect(x, yy, w, hh, b.ink(PAL.N1)); return; }
  const z = new Buf(w, h, PAL.G2);
  // the hoodie: grey, a drawstring each side, the fold under the card
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) z.c[j * w + i] = (i + j * 3) % 29 === 0 ? PAL.G1 : j < 6 ? PAL.G1 : PAL.G2;
  rect(8, 0, 2, 30, z.ink(PAL.G4)); rect(w - 10, 0, 2, 26, z.ink(PAL.G4));
  guestBadge(z, 8, 20, 'insert');
  cctvGrade(z);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) b.set(x + i, y + j, z.c[j * w + i]);
  rect(x + 1, y + 1, textWidth('ZOOM') + 4, 11, b.ink(PAL.N1)); text(b, 'ZOOM', x + 3, y + 3, PAL.G6);
};
