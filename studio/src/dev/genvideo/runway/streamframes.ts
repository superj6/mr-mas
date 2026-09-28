// MR. MAS — Act Four S7.13's stream frame (the `v31-runway` pass, 2026-09-27): Ttemme's own broadcast, drawn at
// native 480 x 270 in the show's palette and type, around a player pane the compositor (hourglass.py) fills with his
// stream cam (the generated take, snapped to the palette on the grid, or real at 4x).
// The chat column is kits/chat-panel's look at column size (the N1 panel, the N3 header, the red dot, LIVE · CHAT, every
// handle a coloured dash, no usernames), scrolling; its messages are F until `backAt`, then "we're so back".
//
// Build + run (from studio/):
//   node src/episodes/ep01/pixel/tools/build.mjs --entry src/dev/genvideo/runway/streamframes.ts $S/streamframes.cjs
//   node $S/streamframes.cjs jobs.json
// jobs.json: {"out": DIR, "frames": [{"name": "s-0001", "k": 140, "backAt": 167, "fast": 167}]}
//   k       the beat frame (S7.13's own k): the chat's clock
//   backAt  from this k the new messages read "we're so back" (after his line)
//   fast    from this k the chat scrolls four times as fast (the flood: a new message every 5-6 frames)
// Writes DIR/<name>.rgb (480 x 270 x 3; the pane and the band rows are left N0 for the compositor) and DIR/geometry.json.
import * as fs from 'fs';
import * as path from 'path';
import {Buf, rect, hash} from '../../../shared/pixel/px';
import {PAL} from '../../../shared/pixel/palette';
import {pt, pw} from '../../../shared/pixel/kits/uitype';

const RH = 203;
export const PANE = {x: 8, y: 11, w: 328, h: 184};
export const CHAT = {x: 344, y: 11, w: 128, h: 184};
const HANDLES = [PAL.C6, PAL.L3, PAL.W7, PAL.R3, PAL.U5, PAL.P2, PAL.C8, PAL.W5];
const BACK = ["we're so back", "WE'RE SO BACK", "we're so back", 'so back', "we're so back", 'WE ARE SO BACK', "we're so back"];
const ROW = 11;

interface Job {name: string; k: number; backAt: number; fast: number}

/** the chat scroll in px at beat frame k: 1 px per 2 frames, then 2 px a frame from `fast` */
const scrollAt = (k: number, fast: number) => (k < fast ? Math.floor(k / 2) : Math.floor(fast / 2) + 2 * (k - fast));

const draw = (j: Job): Buf => {
  const b = new Buf(480, 270, PAL.N0);
  // the site: a dark page, a thin top bar with the player's three dots (generic: no mark, no name of any real site)
  rect(0, 0, 480, RH, b.ink(PAL.N1));
  rect(0, 0, 480, 7, b.ink(PAL.N2)); rect(0, 7, 480, 1, b.ink(PAL.N0));
  for (let i = 0; i < 3; i++) rect(8 + i * 5, 2, 3, 3, b.ink(PAL.G2));
  // the player pane (filled by the compositor) and its frame
  rect(PANE.x - 1, PANE.y - 1, PANE.w + 2, PANE.h + 2, b.ink(PAL.G1));
  rect(PANE.x, PANE.y, PANE.w, PANE.h, b.ink(PAL.N0));
  // under the pane: the channel line
  rect(PANE.x + 2, PANE.y + PANE.h + 3, 3, 3, b.ink(PAL.R3));
  pt(b, 'LIVE', PANE.x + 7, PANE.y + PANE.h + 1, PAL.P1);
  pt(b, 'TTEMME', PANE.x + 7 + pw('LIVE') + 8, PANE.y + PANE.h + 1, PAL.G5);
  // the chat column: the chat-panel kit's look at column size
  const {x, y, w, h} = CHAT;
  rect(x - 1, y - 1, w + 2, h + 2, b.ink(PAL.G1));
  rect(x, y, w, h, b.ink(PAL.N1));
  rect(x, y, w, 12, b.ink(PAL.N3)); rect(x, y + 12, w, 1, b.ink(PAL.N0));
  rect(x + 4, y + 4, 3, 3, b.ink(PAL.R3));
  pt(b, 'LIVE · CHAT', x + 10, y + 2, PAL.P1);
  // the messages: newest at the bottom, scrolling up
  const top = y + 15, bottom = y + h - 2;
  const s = scrollAt(j.k, j.fast);
  const newest = Math.floor(s / ROW);
  const off = s % ROW;
  const backId = Math.floor(scrollAt(j.backAt, j.fast) / ROW);
  for (let r = 0; r < Math.ceil((bottom - top) / ROW) + 2; r++) {
    const id = newest - r;
    const yy = bottom - 8 - r * ROW + off;
    if (yy < top || yy + 8 > bottom) continue;
    const hc = HANDLES[Math.floor(hash(id, 1, 77) * HANDLES.length)];
    const nw = 4 + Math.floor(hash(id, 2, 77) * 8);
    rect(x + 4, yy + 3, nw, 1, b.ink(hc));
    const msg = id > backId ? BACK[Math.floor(hash(id, 4, 77) * BACK.length)] : hash(id, 3, 77) < 0.75 ? 'F' : 'F F';
    pt(b, msg, x + 8 + nw, yy, PAL.P1);
  }
  return b;
};

const main = () => {
  const spec = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')) as {out: string; frames: Job[]};
  fs.mkdirSync(spec.out, {recursive: true});
  const rgb = Buffer.alloc(480 * 270 * 3);
  for (const j of spec.frames) {
    const fb = draw(j);
    for (let i = 0; i < fb.c.length; i++) { const v = fb.c[i]; rgb[i * 3] = (v >> 16) & 255; rgb[i * 3 + 1] = (v >> 8) & 255; rgb[i * 3 + 2] = v & 255; }
    fs.writeFileSync(path.join(spec.out, `${j.name}.rgb`), rgb);
  }
  fs.writeFileSync(path.join(spec.out, 'geometry.json'), JSON.stringify({RH, PANE, CHAT}, null, 1));
  console.log(`streamframes: ${spec.frames.length} frames -> ${spec.out}`);
};
main();
