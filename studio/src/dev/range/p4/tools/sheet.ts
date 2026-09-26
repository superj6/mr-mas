// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Prototype 4's deliverables that aren't the video: the contact sheet (every clip's way in, its pass and its way
// out, each frame the full 1920x1080 frame box-averaged to 480x270, the phone-size read) and the key stills (full
// 1920x1080, the same pixels the video encodes).
//   npx esbuild src/dev/range/p4/tools/sheet.ts --bundle --platform=node --outfile=<scratch>/p4sheet.cjs
//   node <scratch>/p4sheet.cjs <outDir>          -> p4-sheet.png, p4-still-*.png
import * as fs from 'fs';
import {writePNG} from '../../../pixeladv/tools/png';
import {renderFrame, OUT_W, OUT_H} from '../render';
import {Buf} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {text, textWidth} from '../../../../shared/pixel/font';

const outDir = process.argv[2];
fs.mkdirSync(outDir, {recursive: true});

const full = (f: number) => {
  const out = new Uint8ClampedArray(OUT_W * OUT_H * 4);
  renderFrame(f, out);
  return out;
};
const small = (rgba: Uint8ClampedArray) => {
  const c = new Uint32Array(480 * 270);
  for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) {
    let r = 0, g = 0, b = 0;
    for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) { const o = ((y * 4 + j) * OUT_W + x * 4 + i) * 4; r += rgba[o]; g += rgba[o + 1]; b += rgba[o + 2]; }
    c[y * 480 + x] = (Math.round(r / 16) << 16) | (Math.round(g / 16) << 8) | Math.round(b / 16);
  }
  return c;
};

// ---- key stills
const STILLS: Array<[number, string]> = [[130, '4a-sports'], [300, '4b-stream'], [430, '4c-webcast'], [650, '4d-iris']];
for (const [f, name] of STILLS) {
  const rgba = full(f);
  const c = new Uint32Array(OUT_W * OUT_H);
  for (let i = 0; i < c.length; i++) c[i] = (rgba[i * 4] << 16) | (rgba[i * 4 + 1] << 8) | rgba[i * 4 + 2];
  writePNG(`${outDir}/p4-still-${name}.png`, OUT_W, OUT_H, c, 1);
  console.log('still', name, `p${f}`);
}

// ---- the contact sheet: one row per clip, five beats: the room, the door, the pass, the pass's beat, the landing
const ROWS: Array<{label: string; sub: string; frames: Array<[number, string]>}> = [
  {label: '4a  P4 SPORTS', sub: 'Draft Night (5.A) · boardroom -> his TV, closer -> the stadium feed -> boardroom', frames: [[8, 'the room: the draft on his TV'], [20, 'IN: cut in on the TV (native)'], [72, 'the pick, the check, the card'], [130, 'the telestrator: SOUP'], [172, 'OUT: eyes down, hand to the phone']]},
  {label: '4b  P5 STREAM', sub: 'the chart crime (5.I) · bullpen -> over his shoulder -> the launch stream -> over his shoulder', frames: [[186, 'the room: a staffer at the glass'], [200, 'IN: over his shoulder (native)'], [290, 'the chart, the chat'], [320, 'OUT: back over his shoulder'], [345, 'he leans in, squints']]},
  {label: '4c  P3 BROADCAST', sub: 'the Security Council (9.E) · chamber medium shot -> its monitor\'s webcast -> his close-up', frames: [[380, 'the room: the speaker, the monitor'], [392, 'IN: cut to the webcast'], [430, 'the lower third, the timecode'], [500, 'OUT: his close-up, INVITED'], [510, 'his eyes go to the chair']]},
  {label: '4d  P21 IRIS', sub: 'the Orb checkpoint (11.E) · lobby -> the Orb\'s eye -> its lens -> lobby -> its eye', frames: [[552, 'the room: he steps up'], [566, 'IN: the Orb\'s eye (native)'], [594, 'the scan, his ID'], [650, 'NOT VERIFIED ...human? probably?'], [698, 'let through; then its eye (p705)']]},
];
const FW = 480, FH = 270, GAP = 8, COLS = 5, LABEL_W = 0, HEAD = 60, ROW_H = FH + 34 + GAP;
const W = GAP + COLS * (FW + GAP) + LABEL_W, H = HEAD + ROWS.length * (ROW_H + 26) + GAP;
const sheet = new Buf(W, H, PAL.N0);
// labels at 2x: draw with the 7px face into a scratch buffer and scale up
const label2x = (s: string, x: number, y: number, col: number) => {
  const tw = textWidth(s) + 2, tmp = new Buf(tw, 10, 0x1000000);
  text(tmp, s, 0, 0, col);
  for (let j = 0; j < tmp.h; j++) for (let i = 0; i < tmp.w; i++) { const c = tmp.c[j * tmp.w + i]; if (c !== 0x1000000) for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) sheet.set(x + i * 2 + dx, y + j * 2 + dy, c); }
};
label2x('MR. MAS  ·  STYLE RANGE  ·  PROTOTYPE 4  ·  THE TIER 1 REEL', GAP, 12, PAL.W6);
text(sheet, '720 f at 24 fps, 96 BPM: four device passes, each entered and left inside its pixel room; the band stays on screen. Frames: the 1920x1080 frame box-averaged to 480x270 (the phone-size read).', GAP, 38, PAL.N6);
ROWS.forEach((row, r) => {
  const y0 = HEAD + r * (ROW_H + 26);
  label2x(row.label, GAP, y0, PAL.C6);
  text(sheet, row.sub, GAP + textWidth(row.label) * 2 + 20, y0 + 5, PAL.N7);
  row.frames.forEach(([f, cap], k) => {
    const x = GAP + k * (FW + GAP), y = y0 + 24;
    const c = small(full(f));
    for (let j = 0; j < FH; j++) for (let i = 0; i < FW; i++) sheet.set(x + i, y + j, c[j * FW + i]);
    text(sheet, `p${f}`, x, y + FH + 4, PAL.N5);
    text(sheet, cap, x + 30, y + FH + 4, PAL.N7);
  });
});
writePNG(`${outDir}/p4-sheet.png`, W, H, sheet.c, 1);
console.log('sheet', W, H);
