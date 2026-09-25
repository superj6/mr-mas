/**
 * MONITOR SCREEN CONTENT (for close-ups / inserts): a minimal dark-mode social "post composer"
 * with a flat log-scale chart and a dot labelled "you are here". Generic parody UI, no real logos.
 * Local units: box [0,0,1920,1080] (fills a 16:9 insert frame directly).
 * All text is stroked with ./strokeFont so it renders in every tonal style.
 */
import type {ToneModel, TP, Tone} from '../types';
import type {EnvTP} from './geo';
import {V2, poly, circle, rectP, smooth, clamp01, lerp, roundRectPts, strokeFill, ringFill, loopFill} from './geo';
import {textLines, textWidth} from './strokeFont';

export interface MonitorScreenParams {
  /** Draft text in the composer. */
  draft?: string;
  /** Typed characters of the draft shown (0..1), for a typing beat. */
  typed?: number;
  /** Caret visible (blink it on the beat). */
  caret?: boolean;
  /** 0..1 progress of the dashed "projection" shooting up from the dot. */
  hype?: number;
}

export const SCREEN_HUES: Record<string, string> = {
  ui: '#1A2130',
  rail: '#161C29',
  card: '#1F2837',
  chart: '#121824',
  line: '#2E3A4E',
  grid: '#2A3547',
  text: '#D8E1EC',
  dim: '#7D8AA0',
  accent: '#3FE6FF',
  avatar: '#C39279',
  hair: '#4E3A2A',
};

const rr = (x: number, y: number, w: number, h: number, r: number) => poly(roundRectPts(w, h, r, 5).map(([px, py]) => [px + x + w / 2, py + y + h / 2] as V2));

export const monitorScreen = (p: MonitorScreenParams = {}): ToneModel => {
  const {draft = 'we are so close.', typed = 1, caret = true, hype = 1} = p;
  const T: TP[] = [];
  const add = (hue: string, tone: Tone, d: string, extra: Partial<EnvTP> = {}) => T.push({hue, tone, d, ...extra});
  // all line work is emitted as FILLED outlines so it follows tone in every renderer (noir/engrave ink strokes)
  const text = (s: string, x: number, y: number, size: number, hue: string, tone: Tone, w: number, light = false) => {
    const [lines, width] = textLines(s, x, y, size);
    if (lines.length) add(hue, tone, strokeFill(lines, w * 1.05), {light});
    return width;
  };
  const line = (pts: V2[], hue: string, tone: Tone, w: number, light = false) => add(hue, tone, strokeFill([pts], w), {light});
  const ring = (cx: number, cy: number, r: number, hue: string, tone: Tone, w: number) => add(hue, tone, ringFill(cx, cy, r, w));
  const rrPts = (x: number, y: number, w: number, h: number, r: number) => roundRectPts(w, h, r, 5).map(([px, py]) => [px + x + w / 2, py + y + h / 2] as V2);

  add('ui', 1, rectP(0, 0, 1920, 1080));
  // ---------- left rail ----------
  add('rail', 1, rectP(0, 0, 250, 1080));
  // generic parody mark: a ring with an off-centre dot (no real logo)
  add('text', 4, circle(124, 92, 30));
  add('rail', 1, circle(124, 92, 21));
  add('accent', 4, circle(132, 86, 9), {light: true});
  const icons = ['home', 'search', 'bell', 'mail', 'user', 'more'];
  icons.forEach((_, i) => {
    const y = 210 + i * 104;
    const active = i === 0;
    if (active) add('card', 2, rr(40, y - 34, 170, 68, 34));
    ring(88, y, 16, active ? 'text' : 'dim', active ? 4 : 3, 5);
    add(active ? 'text' : 'dim', active ? 4 : 2, rr(122, y - 6, active ? 66 : 54, 12, 6));
  });

  // ---------- centre column: composer ----------
  const cx0 = 360;
  const cx1 = 1380;
  add('line', 2, rectP(cx0 - 2, 0, 2, 1080));
  add('line', 2, rectP(cx1, 0, 2, 1080));
  // tabs
  text('for you', 520, 62, 22, 'text', 4, 4.5);
  text('following', 880, 62, 22, 'dim', 3, 4);
  add('accent', 4, rr(516, 84, 130, 7, 3.5), {light: true});
  add('line', 2, rectP(cx0, 104, cx1 - cx0, 2));
  // avatar (tiny Mas: cowlick silhouette)
  add('avatar', 3, circle(450, 184, 40));
  add('hair', 1, smooth([[414, 176], [420, 150], [446, 140], [474, 150], [486, 170], [480, 162], [466, 158], [452, 162], [436, 158], [424, 166]]));
  add('hair', 1, smooth([[456, 146], [466, 126], [486, 124], [482, 136], [470, 142]]));
  // draft text + caret
  const shown = draft.slice(0, Math.round(clamp01(typed) * draft.length));
  const tw = text(shown, 520, 200, 30, 'text', 4, 5.5);
  if (caret) add('accent', 4, rectP(520 + tw + 12, 150, 5, 64), {light: true});
  text('everyone can reply', 520, 262, 17, 'accent', 3, 3.5);

  // ---------- media: the log chart ----------
  const mx0 = 520;
  const my0 = 300;
  const mw = 800;
  const mh = 460;
  add('line', 2, rr(mx0 - 3, my0 - 3, mw + 6, mh + 6, 26));
  add('chart', 1, rr(mx0, my0, mw, mh, 24));
  text('progress (log scale)', mx0 + 36, my0 + 54, 17, 'dim', 3, 3.5);
  // plot area
  const px0 = mx0 + 110;
  const px1 = mx0 + mw - 50;
  const py0 = my0 + 90;
  const py1 = my0 + mh - 70;
  const decades = 4;
  const dh = (py1 - py0) / decades;
  const labels = ['1', '10', '100', '1000', '10000'];
  for (let k = 0; k <= decades; k++) {
    const y = py1 - k * dh;
    add('grid', 2, rectP(px0, y - 1.5, px1 - px0, 3));
    const lw = textWidth(labels[k], 15);
    text(labels[k], px0 - 22 - lw, y + 7, 15, 'dim', 3, 3);
    if (k < decades) {
      for (let m = 2; m <= 9; m++) {
        const yy = y - Math.log10(m) * dh;
        add('grid', 2, rectP(px0, yy - 0.6, px1 - px0, 1.2));
      }
    }
  }
  add('grid', 2, rectP(px0 - 1.5, py0, 3, py1 - py0));
  text('then', px0, py1 + 44, 16, 'dim', 3, 3);
  text('now', px1 - textWidth('now', 16) - 70, py1 + 44, 16, 'dim', 3, 3);
  // the flat line (tiny noise so it reads as data, not a ruler)
  const lineY = py1 - dh * 1.02;
  const dotX = px1 - 90;
  const pts: V2[] = [];
  for (let i = 0; i <= 40; i++) {
    const x = lerp(px0 + 8, dotX, i / 40);
    const n = Math.sin(i * 1.7) * 2.2 + Math.sin(i * 0.63 + 1) * 3 + Math.sin(i * 4.1) * 1.2;
    pts.push([x, lineY + n]);
  }
  pts.push([dotX, lineY]);
  line(pts, 'accent', 3, 10);
  line(pts, 'accent', 4, 4.5, true);
  // dashed "projection": straight up
  const hh = clamp01(hype);
  const top = lerp(lineY, py0 - 6, hh);
  for (let y = lineY - 26; y > top; y -= 26) line([[dotX + (lineY - y) * 0.08, y], [dotX + (lineY - y + 14) * 0.08, Math.max(top, y - 14)]], 'accent', 3, 4.5);
  if (hh > 0.95) text('soon', dotX + 22, py0 + 22, 17, 'accent', 3, 3.5);
  // YOU ARE HERE
  ring(dotX, lineY, 21, 'accent', 3, 3.5);
  add('text', 4, circle(dotX, lineY, 11), {light: true});
  line([[dotX - 18, lineY - 18], [dotX - 70, lineY - 74], [dotX - 110, lineY - 74]], 'dim', 3, 3);
  const yw = textWidth('you are here', 22);
  text('you are here', dotX - 124 - yw, lineY - 66, 22, 'text', 4, 4.5);

  // ---------- toolbar, counter, post button ----------
  const ty = 820;
  add('line', 2, rectP(mx0, 780, mw, 2));
  const tx = (i: number) => mx0 + 10 + i * 64;
  // image
  add('accent', 3, loopFill(rrPts(tx(0), ty - 16, 34, 30, 6), 3.5));
  line([[tx(0) + 4, ty + 10], [tx(0) + 14, ty - 2], [tx(0) + 21, ty + 5], [tx(0) + 26, ty], [tx(0) + 32, ty + 8]], 'accent', 3, 3);
  // gif
  add('accent', 3, loopFill(rrPts(tx(1), ty - 16, 38, 30, 6), 3.5));
  text('gif', tx(1) + 6, ty + 6, 12, 'accent', 3, 2.6);
  // poll
  [0, 1, 2].forEach((k) => add('accent', 3, rectP(tx(2) + 2, ty - 13 + k * 10, 12 + k * 7, 5)));
  // emoji
  ring(tx(3) + 17, ty, 16, 'accent', 3, 3.5);
  line(Array.from({length: 7}, (_, i) => {
    const a = Math.PI * (0.15 + (0.7 * i) / 6);
    return [tx(3) + 17 + Math.cos(a) * 9, ty + Math.sin(a) * 9] as V2;
  }), 'accent', 3, 3);
  // schedule
  add('accent', 3, loopFill(rrPts(tx(4), ty - 15, 32, 30, 5), 3.5));
  add('accent', 3, rectP(tx(4), ty - 8, 32, 3));
  // counter ring
  ring(1146, ty, 16, 'line', 2, 4);
  line(Array.from({length: 13}, (_, i) => {
    const a = -Math.PI / 2 + (i / 12) * Math.PI * 2 * 0.1;
    return [1146 + Math.cos(a) * 16, ty + Math.sin(a) * 16] as V2;
  }), 'accent', 3, 4);
  // post button
  add('accent', 4, rr(1196, ty - 26, 124, 52, 26), {light: true});
  text('post', 1226, ty + 7, 20, 'ui', 0, 4.8);

  // previous post in the feed (greeked), so the column doesn't end in a void
  add('line', 2, rectP(cx0, 900, cx1 - cx0, 2));
  add('dim', 2, circle(450, 972, 40));
  text('nole', 520, 952, 17, 'text', 4, 3.6);
  text('2m ago', 590, 952, 15, 'dim', 3, 3);
  add('dim', 3, rr(520, 980, 640, 14, 7));
  add('dim', 2, rr(520, 1010, 460, 14, 7));

  // ---------- right column: trending ----------
  const rx = 1440;
  add('card', 2, rr(rx, 60, 440, 560, 22));
  text('trending', rx + 30, 118, 22, 'text', 4, 4.5);
  const trends = ['agi by friday', 'is it the knee?', 'compute shortage', 'vibes', 'scale'];
  trends.forEach((s, i) => {
    const y = 190 + i * 86;
    text('trending', rx + 30, y - 14, 12, 'dim', 2, 2.4);
    text(s, rx + 30, y + 22, 19, 'text', 4, 3.8);
  });
  add('card', 2, rr(rx, 650, 440, 230, 22));
  text('who to follow', rx + 30, 706, 20, 'text', 4, 4.2);
  [0, 1].forEach((k) => {
    const y = 770 + k * 66;
    add('dim', 2, circle(rx + 52, y, 22));
    add('dim', 3, rr(rx + 90, y - 16, 150 - k * 30, 12, 6));
    add('dim', 2, rr(rx + 90, y + 6, 100, 9, 4.5));
    add('text', 4, rr(rx + 330, y - 18, 84, 36, 18));
  });

  return {paths: T, hues: SCREEN_HUES, box: [0, 0, 1920, 1080]};
};
