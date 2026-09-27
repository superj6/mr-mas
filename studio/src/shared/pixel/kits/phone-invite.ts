// MR. MAS — kit: sc 2's [ECU] THE INVITE on Mas's phone (Ep1 cold open). New file (v3-art-a, 2026-09-27).
// The phone lies face-up on the stage's side table, seen from above; it lights, and a calendar invite slides down its
// screen in a GENERIC calendar UI (no real app's layout, colours or icons): `Board sync · Fri 12:00`, `Accept` and
// `Decline`, and four small attendee circles with no names: a doorway, a glowing page, a loading spinner, a black
// square (none of them Gerg's green laptop: the rewatch egg). On "noted." Accept goes down (his thumb is below the MCU's
// frame, never here) and the card steps to the calendar's pale blue: accepted.
//   drawInviteInsert(b, f, {k, state, press})   k = frames since the screen woke (0 dark, 1 the screen on, 2-4 the card
//                                               slides down in three held steps, 5+ in place); state 'invite' |
//                                               'accepted'; press = Accept's pressed drawing (1 frame, on the tap)
//   drawInviteCard(b, x, y, state, press, f)    the card alone (for any other screen size, e.g. the MCU's reflection)
//   INVITE                                      the texts, for the lock and the captions
import {Buf, rect, ellipse, bayer, hash} from '../px';
import {PAL, stepColor} from '../palette';
import {text, textWidth} from '../font';

export const INVITE = {title: 'Board sync · Fri 12:00', accept: 'Accept', decline: 'Decline', header: 'invitation'};
const RH = 203;
export const INVITE_CARD = {w: 150, h: 92};

/** the four attendee circles: a doorway, a glowing page, a loading spinner, a black square (r 6 each) */
const attendee = (b: Buf, cx: number, cy: number, kind: 0 | 1 | 2 | 3, f: number) => {
  ellipse(cx, cy, 7, 7, b.ink(PAL.G4));
  ellipse(cx, cy, 6, 6, b.ink(kind === 3 ? PAL.N0 : PAL.N2));
  if (kind === 0) {
    // a doorway: a dark door leaf ajar, the light of the gap
    rect(cx - 3, cy - 4, 6, 9, b.ink(PAL.N0)); rect(cx - 3, cy - 4, 2, 9, b.ink(PAL.W6)); rect(cx - 1, cy - 4, 1, 9, b.ink(PAL.W4));
  } else if (kind === 1) {
    // a glowing page: a small sheet with lines, its glow a rung up around it
    rect(cx - 3, cy - 4, 7, 9, b.ink(PAL.C7)); rect(cx - 2, cy - 3, 5, 7, b.ink(PAL.P2));
    for (const yy of [cy - 2, cy, cy + 2]) rect(cx - 1, yy, 3, 1, b.ink(PAL.G5));
  } else if (kind === 2) {
    // a loading spinner: eight dots round a ring, one bright, stepping with f (held 3 frames)
    const s = Math.floor(f / 3) % 8;
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; b.set(Math.round(cx + Math.cos(a) * 4), Math.round(cy + Math.sin(a) * 4), i === s ? PAL.P2 : (i + 1) % 8 === s ? PAL.G5 : PAL.G3); }
  } else {
    // a black square (a camera that is off)
    rect(cx - 3, cy - 3, 6, 6, b.ink(PAL.N0)); rect(cx - 3, cy - 3, 6, 1, b.ink(PAL.N2));
  }
};
export const drawInviteCard = (b: Buf, x: number, y: number, state: 'invite' | 'accepted', press = false, f = 0) => {
  const {w, h} = INVITE_CARD;
  const acc = state === 'accepted';
  const body = acc ? PAL.C8 : PAL.P2, line = acc ? PAL.C6 : PAL.G5, ink = PAL.N1;
  rect(x + 1, y + h, w - 2, 2, b.ink(PAL.N0));
  rect(x, y + 1, w, h - 2, b.ink(body)); rect(x + 1, y, w - 2, h, b.ink(body));
  // header: a generic calendar glyph (a square page with a coloured head band and two rings), a small grey label
  rect(x + 6, y + 6, 11, 11, b.ink(PAL.G4)); rect(x + 7, y + 7, 9, 9, b.ink(PAL.P1)); rect(x + 7, y + 7, 9, 3, b.ink(acc ? PAL.C4 : PAL.R2));
  b.set(x + 9, y + 5, PAL.N2); b.set(x + 13, y + 5, PAL.N2);
  for (const [i, j] of [[9, 12], [11, 12], [13, 12], [9, 14], [11, 14]]) b.set(x + i, y + j, PAL.G4);
  text(b, INVITE.header, x + 22, y + 8, PAL.G4);
  // the title, legible
  text(b, INVITE.title, x + 8, y + 24, ink);
  rect(x + 8, y + 34, w - 16, 1, b.ink(line));
  // the four attendee circles, no names
  ([0, 1, 2, 3] as const).forEach((k, i) => attendee(b, x + 16 + i * 18, y + 45, k, f));
  // the buttons: Accept (filled) · Decline (outlined)
  const by = y + h - 24, bw = 60, bh = 15;
  const ax = x + 8, dx = x + w - 8 - bw;
  const accCol = acc ? PAL.C4 : press ? PAL.C3 : PAL.C5;
  rect(ax, by, bw, bh, b.ink(accCol)); rect(ax, by, bw, 1, b.ink(stepColor(accCol, 1)));
  text(b, acc ? 'Accepted' : INVITE.accept, ax + Math.round((bw - textWidth(acc ? 'Accepted' : INVITE.accept)) / 2), by + 4, PAL.N0);
  if (!acc) { rect(dx, by, bw, 1, b.ink(PAL.G4)); rect(dx, by + bh - 1, bw, 1, b.ink(PAL.G4)); rect(dx, by, 1, bh, b.ink(PAL.G4)); rect(dx + bw - 1, by, 1, bh, b.ink(PAL.G4)); text(b, INVITE.decline, dx + Math.round((bw - textWidth(INVITE.decline)) / 2), by + 4, PAL.G3); }
  else text(b, '✓', ax + bw + 8, by + 4, PAL.C3);
};

export interface InviteInsertState {
  /** frames since the screen woke (see the header) */
  k: number;
  state?: 'invite' | 'accepted';
  press?: boolean;
}
export const drawInviteInsert = (b: Buf, f: number, s: InviteInsertState) => {
  const acc = s.state === 'accepted';
  // the table top (the stage side table's grey laminate), the phone's glow on it when the screen is on
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, bayer(x, y) < 0.1 ? PAL.G4 : PAL.G3);
  const on = s.k >= 1;
  if (on) for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const d = Math.hypot((x - 240) / 150, (y - 100) / 130);
    if (d < 1 && bayer(x, y) < (1 - d) * 0.8) b.set(x, y, acc ? (d < 0.6 ? PAL.K3 : PAL.G5) : stepColor(b.get(x, y), d < 0.6 ? 2 : 1));
  }
  // the phone, face-up, portrait, seen from above (cropped by the frame's bottom edge)
  const px = 150, py = 8, pw = 180;
  rect(px + 4, py + 4, pw, RH, b.ink(PAL.G2));
  rect(px, py, pw, RH, b.ink(PAL.N0)); rect(px + 1, py + 1, pw - 2, RH, b.ink(PAL.N1));
  rect(px + pw / 2 - 12, py + 4, 24, 3, b.ink(PAL.N0)); // the speaker slot
  const sx = px + 8, sy = py + 12, sw = pw - 16;
  // the screen: dark, or the lock screen's night gradient (no clock, no app chrome)
  for (let y = sy; y < RH; y++) for (let x = sx; x < sx + sw; x++) {
    if (!on) { b.set(x, y, (x - sx + (y - sy)) % 60 < 2 ? PAL.N2 : PAL.N0); continue; }
    const t = (y - sy) / 190 + (bayer(x, y) - 0.5) * 0.2;
    b.set(x, y, acc ? (t < 0.4 ? PAL.C3 : PAL.C2) : t < 0.3 ? PAL.N4 : t < 0.7 ? PAL.N3 : PAL.N2);
  }
  if (!on) return;
  // the card slides down from under the screen's top edge in three held steps
  const slide = s.k < 2 ? -999 : s.k === 2 ? -60 : s.k === 3 ? -24 : s.k === 4 ? -4 : 0;
  if (slide > -999) {
    const cx = sx + Math.round((sw - INVITE_CARD.w) / 2), cy = sy + 14 + slide;
    // clip to the screen
    const tmp = new Buf(480, RH, 0x1000000);
    drawInviteCard(tmp, cx, cy, s.state ?? 'invite', s.press, f);
    for (let y = sy; y < RH; y++) for (let x = sx; x < sx + sw; x++) { const v = tmp.c[y * 480 + x]; if (v !== 0x1000000) b.set(x, y, v); }
  }
  void hash;
};
