// MR. MAS — Ep1 pixel pipeline (P0): STAND-INS and SLATES, drawn by the host.
//   drawStandin  a shot with no layout (or whose layout threw): the stick figures of its cast on a plain set (their
//                stick x and pose, a mouth that opens while they speak), or a labelled plate with the stick's caption,
//                the shot's in-world text on top, and a red STAND-IN tag in the picture. Never silent: the host also
//                lists it (Seg.standins), the renderer prints it and `check` fails on it.
//   drawSlate    a reviewer slate beat of the stick timeline (lock `slate`: a card whose caption or cue says
//                "reviewer"): the stick's own words on black, tagged as not part of the show.
//   drawHeadSlate  the renderer's optional head slate (render.ts --slate): what this file is, from which lock, when.
import {Buf, rect} from '../../../shared/pixel/px';
import {PAL, stepColor} from '../../../shared/pixel/palette';
import {pt, pw, pwrap, bpt, bpw, plain, RH, ACCENT, box} from '../act4/animatic/lay';
import {talking} from './lipsync';
import {drawTexts} from './text';
import type {PxShot, SegLock} from './types';

// ------------------------------------------------------------------ a plain set, tinted by the room
const SETS: Array<[number, number, number]> = [
  [PAL.N1, PAL.N2, PAL.N4], [PAL.W1, PAL.W2, PAL.W4], [PAL.C0, PAL.C1, PAL.C3], [PAL.D1, PAL.D2, PAL.D4], [PAL.G0, PAL.G1, PAL.G3], [PAL.U0, PAL.U1, PAL.U3],
];
const hashStr = (s: string) => { let h = 2166136261; for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0; return h; };
const plainSet = (b: Buf, key: string, floorY = 150) => {
  const [wall, floor, rule] = SETS[hashStr(key || 'void') % SETS.length];
  rect(0, 0, 480, RH, b.ink(wall));
  rect(0, floorY, 480, RH - floorY, b.ink(floor));
  rect(0, floorY, 480, 1, b.ink(rule));
};
const ring = (b: Buf, cx: number, cy: number, r: number, c: number) => { for (let a = 0; a < 360; a += 4) b.set(Math.round(cx + Math.cos((a * Math.PI) / 180) * r), Math.round(cy + Math.sin((a * Math.PI) / 180) * r), c); };
const seg2 = (b: Buf, x0: number, y0: number, x1: number, y1: number, c: number) => {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (let i = 0; i <= n; i++) { const x = Math.round(x0 + ((x1 - x0) * i) / n), y = Math.round(y0 + ((y1 - y0) * i) / n); b.set(x, y, c); b.set(x + 1, y, c); }
};
/** one stick figure (the stick reel's, drawn in pixels): head ring, body, arms, legs; `sit` on a stool */
const stick = (b: Buf, x: number, pose: string, col: number, open: boolean) => {
  const sit = pose === 'sit', y0 = sit ? 86 : 70;
  ring(b, x, y0, 11, col); ring(b, x, y0, 10, col);
  rect(x - 3, y0 + 5, 7, open ? 3 : 1, b.ink(col));
  const hip = y0 + (sit ? 42 : 50);
  seg2(b, x, y0 + 12, x, hip, col);
  const arm = pose === 'arms-up' ? -18 : pose === 'point' ? 0 : 18;
  seg2(b, x, y0 + 22, x - 16, y0 + 22 + arm, col); seg2(b, x, y0 + 22, x + 16, y0 + 22 + (pose === 'point' ? -2 : arm), col);
  if (sit) { seg2(b, x, hip, x + 14, hip, col); seg2(b, x + 14, hip, x + 14, 150, col); seg2(b, x, hip, x - 2, 150, col); rect(x - 12, hip + 2, 30, 3, b.ink(stepColor(col, -3))); }
  else { seg2(b, x, hip, x - 12, 150, col); seg2(b, x, hip, x + 12, 150, col); }
};

/** the in-picture STAND-IN tag: red, top left, two lines */
export const standinTag = (b: Buf, sh: PxShot, why: string) => {
  const l1 = `STAND-IN · ${sh.id} · ${why}`, l2 = plain(sh.tag || sh.framing || '').slice(0, 70);
  const w = Math.max(pw(l1), pw(l2)) + 12;
  rect(3, 3, w + 2, l2 ? 25 : 14, b.ink(PAL.N0)); rect(4, 4, w, l2 ? 23 : 12, b.ink(PAL.R2));
  pt(b, l1, 10, 7, PAL.P2);
  if (l2) pt(b, l2, 10, 17, PAL.P2);
};

/** the host's stand-in for a shot with no layout: never a silent gap */
export const drawStandin = (b: Buf, k: number, sh: PxShot, why: string, mode: 'stick' | 'plate', tag = true) => {
  plainSet(b, sh.set || sh.room);
  const cast = sh.cast.filter((c) => (c.from === null || k >= c.from) && (c.until === null || k < c.until));
  if (mode === 'stick' && cast.length) {
    const n = cast.length;
    const xs = cast.map((c, i) => Math.round(c.x !== null ? 30 + c.x * 420 : ((i + 1) * 480) / (n + 1)));
    cast.forEach((c, i) => {
      const w = c.id.toUpperCase(), col = ACCENT[w] ?? PAL.P1;
      stick(b, xs[i], c.pose, col, talking(sh, k, w) && (k >> 2) % 2 === 0);
    });
  } else {
    const cap = plain(sh.does || sh.tag || sh.id);
    box(b, 60, 44, 360, 110, cap, {fill: PAL.N1, col: PAL.P0});
  }
  drawTexts(b, sh, k);
  if (tag) standinTag(b, sh, why);
};

/** a reviewer slate beat: the stick's own words on black (full frame: no band) */
export const drawSlate = (b: Buf, k: number, sh: PxShot) => {
  rect(0, 0, 480, 270, b.ink(PAL.N0));
  const items = sh.onscreen.filter((t) => k >= t.s && k < t.e).map((t) => plain(t.text));
  const head = 'REVIEWER SLATE · NOT PART OF THE SHOW';
  pt(b, head, Math.round(240 - pw(head) / 2), 40, PAL.W6);
  let y = 100;
  items.forEach((s, i) => {
    if (i === 0 && bpw(s) <= 440) { bpt(b, s, Math.round(240 - bpw(s) / 2), y, PAL.P2); y += 28; return; }
    for (const l of pwrap(s, 440)) { pt(b, l, Math.round(240 - pw(l) / 2), y, i === 0 ? PAL.P2 : PAL.P0); y += 12; }
    y += 4;
  });
  const cap = plain(sh.does || '').replace(/^Reviewer slate:\s*/i, '');
  if (cap && !items.length) for (const l of pwrap(cap, 440).slice(0, 3)) { pt(b, l, Math.round(240 - pw(l) / 2), y, PAL.P1); y += 12; }
};

/** the renderer's head slate (render.ts --slate) */
export const drawHeadSlate = (b: Buf, lock: SegLock, lines: string[]) => {
  rect(0, 0, 480, 270, b.ink(PAL.N0));
  const head = 'REVIEWER SLATE · NOT PART OF THE SHOW';
  pt(b, head, Math.round(240 - pw(head) / 2), 34, PAL.W6);
  const t = `MR. MAS · EP1 · ${plain(lock.label)}`;
  bpt(b, t, Math.round(240 - bpw(t) / 2), 70, PAL.P2);
  let y = 110;
  for (const s of lines) for (const l of pwrap(plain(s), 440)) { pt(b, l, Math.round(240 - pw(l) / 2), y, PAL.P0); y += 12; }
};
