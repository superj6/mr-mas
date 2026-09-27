// MR. MAS — shared kit: TTEMME'S LIVE · CHAT PANEL IN THE ROOM (UI-CHAT-ROOM; Ep1 Act Four v5 art pass; new file, owned
// by the v5 art pass). "his stream's chat panel, LIVE · CHAT, at his elbow" (S4.10, S4.10b, S4.13c; its corner in
// S7.13). v4 had it only as an overlay at portrait and insert size (cast/ttemme.ts drawChatOverlay); here it is a thing
// in the room: a small tablet propped on the table, its screen scrolling the chat (every message an F, the handles
// coloured dashes: no real usernames). Two sizes, each its own drawing:
//   'medium'  64 x 48 (the two-shot / the [M]): the header LIVE · CHAT legible, a red LIVE dot, four rows scrolling
//   'room'    26 x 20 (the boardroom wide): the red dot, the header as a pale bar, the rows as dashes
//   'corner'  the panel's top-left corner entering an overhead insert (S7.13): 60 x 40 of the medium drawing, cut by
//             the frame edge, at (x, y) = where its visible corner sits
// drawChatPanel(b, x, y, size, f)   (x, y) = the panel's top-left; f = the scroll clock (1 px per 2 frames)
import {Buf, rect, hash} from '../px';
import {PAL} from '../palette';
import {text} from '../font';
import {pt} from './uitype';

const HANDLES = [PAL.C6, PAL.L3, PAL.W7, PAL.R3, PAL.U5, PAL.P2, PAL.C8, PAL.W5];
export type ChatPanelSize = 'medium' | 'room' | 'corner';
export const CHAT_PANEL = {medium: {w: 64, h: 48}, room: {w: 26, h: 20}};
const rows = (b: Buf, x: number, y: number, w: number, h: number, f: number, row: number, big: boolean) => {
  const scroll = Math.floor(f / 2), first = Math.floor(scroll / row);
  for (let r = -1; r < Math.ceil(h / row) + 1; r++) {
    const id = first + r;
    const yy = y + r * row - (scroll % row);
    if (yy < y || yy + (big ? 7 : 2) > y + h) continue;
    const hc = HANDLES[Math.floor(hash(id, 1, 77) * HANDLES.length)];
    const nw = (big ? 4 : 2) + Math.floor(hash(id, 2, 77) * (big ? 6 : 3));
    rect(x + 2, yy + (big ? 3 : 0), nw, 1, b.ink(hc));
    if (big) { const reps = hash(id, 3, 77) < 0.75 ? 'F' : 'F F'; text(b, reps, x + 5 + nw, yy, PAL.P1); }
    else rect(x + 3 + nw, yy, 2, 2, b.ink(PAL.P1));
  }
};
export const drawChatPanel = (b: Buf, x: number, y: number, size: ChatPanelSize, f: number) => {
  if (size === 'room') {
    const {w, h} = CHAT_PANEL.room;
    rect(x - 1, y - 1, w + 2, h + 2, b.ink(PAL.N0)); rect(x, y, w, h, b.ink(PAL.N1));
    rect(x + 1, y + 1, w - 2, 3, b.ink(PAL.N3)); rect(x + 2, y + 2, 2, 1, b.ink(PAL.R3)); rect(x + 6, y + 2, 10, 1, b.ink(PAL.P0));
    rows(b, x, y + 6, w, h - 7, f, 4, false);
    rect(x + Math.floor(w / 2) - 2, y + h + 1, 4, 2, b.ink(PAL.G2)); // its stand
    return;
  }
  const {w, h} = CHAT_PANEL.medium;
  const draw = (bb: Buf, ox: number, oy: number) => {
    rect(ox - 2, oy - 2, w + 4, h + 4, bb.ink(PAL.N0)); rect(ox - 1, oy - 1, w + 2, h + 2, bb.ink(PAL.G1));
    rect(ox, oy, w, h, bb.ink(PAL.N1));
    rect(ox, oy, w, 11, bb.ink(PAL.N3)); rect(ox, oy + 11, w, 1, bb.ink(PAL.N0));
    rect(ox + 3, oy + 4, 3, 3, bb.ink(PAL.R3));
    pt(bb, 'LIVE · CHAT', ox + 8, oy + 2, PAL.P1);
    rows(bb, ox, oy + 13, w, h - 14, f, 9, true);
  };
  if (size === 'medium') {
    draw(b, x, y);
    rect(x + Math.floor(w / 2) - 4, y + h + 2, 8, 3, b.ink(PAL.G2)); rect(x + Math.floor(w / 2) - 6, y + h + 5, 12, 1, b.ink(PAL.G1)); // its stand
    return;
  }
  // 'corner': the panel enters an overhead insert from the top-left; only the part inside the frame is drawn
  const tmp = new Buf(w + 4, h + 4, 0x010203);
  draw(tmp, 2, 2);
  for (let j = 0; j < tmp.h; j++) for (let i = 0; i < tmp.w; i++) { const c = tmp.c[j * tmp.w + i]; if (c !== 0x010203) b.set(x - w + i, y - h + j, c); }
};
