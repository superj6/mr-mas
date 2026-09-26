// MR. MAS - style-range Prototype 1: p360-405, the J4 PLACEHOLDER (J4 itself is the jump-fix pass's build).
// The machine's view. The cel push ended inside the Intern's screen, on its held caret; this opens on that caret as a
// GLYPH token and pulls straight out of it (a digital zoom: the one camera move that belongs to a machine) to the whole
// table, read as tokens. The four tells rise out of the players' heads as columns: each word spelled top to bottom
// over the season's own cells (█ filled, ░ open), all four at once, because the machine reads in parallel. Then its
// caret leaves its own face (the second blank: an empty screen) and blinks over Mas's head. Nothing is typed.
// Clean black between tokens (no noise): what's legible is the four columns and the two places that have none.
import React, {useLayoutEffect, useRef} from 'react';
import {cancelRender, continueRender, delayRender} from 'remotion';
import {Buf} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {composeFrame} from '../../../../shared/pixel/compose';
import type {GlyphLayer, Token} from '../../../../shared/pixel/glyph';
import {ensureGlyphFonts, drawGlyphLayer} from '../../../../shared/pixel/glyphDraw';
import {T, SEATS, BARS, caretOn} from '../geo';
import {drawTableFrame, PLACED, CARET_AT, MAS_HEAD} from './scene';

const W = 480, H = 270;
/** the words the machine types (the season's labels, shortened to their key word so they stand as columns) */
const WORD: Record<string, string> = {nole: 'TWITCH', kram: 'LADLE', mario: 'ADDENDUM', nesnej: 'REGISTER'};
/** the columns' own cell (native px): bigger than the scene's 2 x 3 so the letters read at 1080 */
const CC: [number, number] = [3, 4];

const columns = (p: number): GlyphLayer => {
  const tokens: Token[] = [];
  SEATS.forEach((s, i) => {
    const t0 = T.j4rise[i];
    if (p < t0) return;
    const P = PLACED[s];
    const b = BARS[s];
    // top to bottom: the word, a gap, the cells (filled first), then the head
    const seq: Array<{ch: string; col: number; a: number}> = [];
    for (const ch of WORD[s]) seq.push({ch, col: PAL.C8, a: 1});
    // the season's cells, stood on end: separate squares, filled first, the open ones as outlines
    for (let c = 0; c < b.cells; c++) seq.push({ch: c < b.filled ? '■' : '□', col: c < b.filled ? PAL.C6 : PAL.C4, a: c < b.filled ? 0.9 : 0.8});
    // it rises out of the head: one token a frame, pushing the column up; the head row is the floor
    const shown = Math.min(seq.length, (p - t0) + 1);
    const baseY = P.headTop - 4;
    const x = Math.round(P.headX - CC[0] / 2);
    for (let k = 0; k < shown; k++) {
      const item = seq[seq.length - shown + k];
      if (item.ch === ' ') continue;
      const y = baseY - (shown - k) * CC[1];
      const fresh = k === shown - 1 && shown < seq.length;
      tokens.push({x, y, v: 1, pick: 0, edge: -1, col: fresh ? PAL.C9 : item.col, a: item.a, ch: item.ch});
    }
  });
  return {tokens, style: {cell: CC, bloom: 0.9, weight: 700, size: [1.0, 1.0]}, cell: CC, fills: []};
};
/** the machine's caret: ONE token. On its own face (held, as the cel left it), then off its face (the second blank),
 *  then over Mas's head, blinking on the quarter notes. Nothing is typed after it. */
const CARET_CELL: [number, number] = [2, 8];
const caretLayer = (p: number): GlyphLayer => {
  const tokens: Token[] = [];
  if (p < T.j4caretOff) tokens.push({x: CARET_AT[0] - 0.5, y: CARET_AT[1] - 0.5, v: 1, pick: 0, edge: -1, col: PAL.C8, a: 1, ch: '|'});
  else if (p >= T.j4caretMas && (p < T.j4caretMas + 10 || caretOn(p)))
    tokens.push({x: MAS_HEAD[0] - 1, y: MAS_HEAD[1] - 36, v: 1, pick: 0, edge: -1, col: PAL.C9, a: 1, ch: '|'});
  return {tokens, style: {cell: CARET_CELL, bloom: 1, weight: 700, size: [1.05, 1.05]}, cell: CARET_CELL, fills: []};
};

/** the source the machine reads: the same table, re-levelled so figures carry and the room drops to clean black */
const J4_SCENE = {
  bg: PAL.N0,
  draw: (fb: Buf, p: number) => {
    drawTableFrame(fb, p, {hot: null, eye: 0, caret: 'off', lv: {back: -2, front: -1, players: 1, mas: 2, intern: 1}});
    return {layers: [columns(p), caretLayer(p)]};
  },
  switch: () => ({type: 'glyph' as const, style: {cell: [2, 3] as [number, number], tone: {lo: 0.13, hi: 0.52, gamma: 0.8}, floor: 0.12, gain: 1.5, tint: PAL.C6, tintAmt: 0.3, noise: 0, bloom: 0.75, shimmer: 0.025, shimmerStep: 3, seed: 10}}),
};

/** the view: at p360 the caret fills the frame; it pulls out (exponential, landing soft); then a slow lean toward Mas */
const viewAt = (p: number) => {
  const k = p - T.j4;
  const S0 = 60, S1 = 4;
  const [cx0, cy0] = [CARET_AT[0] + 0.5, CARET_AT[1] + CARET_AT[2] / 2];
  const u = Math.min(1, k / T.j4open);
  const e = 1 - Math.pow(1 - u, 2.4);
  let s = S0 * Math.pow(S1 / S0, e);
  // the focus point slides from the caret to the frame's own centre as the view opens
  const w = (S0 / s - 1) / (S0 / S1 - 1);
  let fx = cx0 + (W / 2 - cx0) * w, fy = cy0 + (H / 2 - cy0) * w;
  if (p >= T.j4caretMas) {
    // a slow lean toward the blank over his head (the machine's attention), never past the frame's own edges
    const v = Math.min(1, (p - T.j4caretMas) / (T.tail - T.j4caretMas));
    const g = v * v * (3 - 2 * v);
    s = S1 * (1 + 0.05 * g);
    fx = W / 2 - 40 * g;
    fy = H / 2 - 12 * g;
  }
  const hw = 1920 / s / 2, hh = 1080 / s / 2;
  if (s <= S1 * 1.2) { fx = Math.max(hw, Math.min(W - hw, fx)); fy = Math.max(hh, Math.min(H - hh, fy)); }
  return {s, fx, fy};
};

export const J4: React.FC<{p: number}> = ({p}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const h = delayRender(`p1 J4 ${p}`);
    ensureGlyphFonts()
      .then(() => {
        const cv = ref.current!;
        const ctx = cv.getContext('2d')!;
        ctx.fillStyle = '#04050a';
        ctx.fillRect(0, 0, cv.width, cv.height);
        const {layers} = composeFrame(J4_SCENE, p);
        const {s, fx, fy} = viewAt(p);
        // the native region on screen, so off-screen tokens are culled
        const vw = 1920 / s, vh = 1080 / s;
        const x0 = fx - vw / 2, y0 = fy - vh / 2;
        const view = {scale: s, ox: 0, oy: 0, crop: [x0, y0, vw, vh] as [number, number, number, number]};
        for (const l of layers) drawGlyphLayer(ctx, {...l, fills: []}, view);
        continueRender(h);
      })
      .catch((e) => cancelRender(e));
  }, [p]);
  return <canvas ref={ref} width={1920} height={1080} style={{position: 'absolute', inset: 0, width: 1920, height: 1080}} />;
};
