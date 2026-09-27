// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Fast Node preview + checks for outro B (pixels exact; the GLYPH tokens are approximated as tinted cells, because
// the real JetBrains Mono tokens exist only in the Remotion render). For iteration and QA; deliverables come from
// Remotion.
//   S=<scratch>; (cd studio && npx esbuild src/dev/outro/b/tools/preview.ts --bundle --platform=node --outfile=$S/pv.js)
//   node $S/pv.js <outDir> <scale> <ep> <file frame>[,<file frame>...]      one PNG per frame
//   node $S/pv.js <outDir> 1 <ep> grid:<f>,<f>,...                           a 4-wide contact grid at 1x
//   node $S/pv.js <outDir> 1 <ep> check                                      the text checks (writes check-ep<ep>.json)
import {writePNG} from '../../../pixeladv/tools/png';
import {composeFrame} from '../../../../shared/pixel/compose';
import {Buf, TRANSPARENT} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {textWidth} from '../../../../shared/pixel/font';
import {makeScene, TOAST, toastBox, rowBoxes, typeAt, INK_RESOLVED, mothFlight} from '../scene';
import {drawBand, TERMS_AT, POINTER_AT, BAND, PERIOD, mothRestBox, mothBox, chipW, CHIP_H, tx, tw} from '../art';
import {TOTAL, PRE, T, EPS, TERMS, POINTER, toastLines, linePops, lastO} from '../timeline';
import * as fs from 'fs';

const [outDir, scaleS, epS, spec] = process.argv.slice(2);
const scale = Number(scaleS) || 2;
const ep = Number(epS) || 1;
const scene = makeScene(ep);
const LAST = lastO(EPS[ep]); // the episode's last outro frame (Ep1: o239, the stinger bar; a plain week: o179)

const render = (f) => {
  const {fb, layers, ui} = composeFrame(scene, f);
  const c = fb.c.slice();
  for (const l of layers) {
    const [cw, ch] = l.cell;
    for (let i = 0; i < l.fills.length; i += 2)
      for (let j = 0; j < ch; j++) for (let k = 0; k < cw; k++) { const x = l.fills[i] + k, y = l.fills[i + 1] + j; if (x >= 0 && y >= 0 && x < fb.w && y < fb.h) c[y * fb.w + x] = l.style.bg ?? 0x04050a; }
    for (const t of l.tokens) {
      const a = t.a * (0.35 + 0.65 * t.v);
      for (let j = 1; j < ch; j++) for (let k = 0; k < Math.max(1, cw - 1); k++) {
        const x = t.x + k, y = t.y + j;
        if (x < 0 || y < 0 || x >= fb.w || y >= fb.h) continue;
        const o = c[y * fb.w + x];
        const mix = (s) => Math.round(((o >> s) & 255) * (1 - a) + ((t.col >> s) & 255) * a);
        c[y * fb.w + x] = (mix(16) << 16) | (mix(8) << 8) | mix(0);
      }
    }
  }
  if (ui) for (let i = 0; i < c.length; i++) if (ui.c[i] < 0x1000000) c[i] = ui.c[i];
  return c;
};

if (spec === 'check') {
  // 1) the terms line and the pointer: every one of their pixels is identical to the band drawn alone, on every
  //    frame the band is lit (never covered, never moved, never recoloured); 2) the resting moth covers no letter;
  // 3) READ TIME, measured on the rendered pixels: a toast row is LEGIBLE on a frame when every pixel of its type is
  //    an ink colour of that row's state and every other pixel inside the type's box is its ground (a token, a ray, a
  //    drop or a half-drawn chip fails it). Each row's legible span runs from the first frame it is legible and stays
  //    legible to the cut (o179 in a plain week, o239 in Ep1). Then: per line (on screen >= chars / 16 cps + 0.5 s), and the whole toast READ IN
  //    ORDER (header, credits, verdict: each row starts when it is legible and the previous one is read) at 16, 18
  //    and 20 chars/s, and the whole frame (toast + band) for one first-time reader.
  const ref = new Buf(480, 270, TRANSPARENT);
  drawBand(ref);
  const rows = [[TERMS_AT.x - 1, TERMS_AT.y - 1, TERMS_AT.x + textWidth(TERMS), TERMS_AT.y + 9],
                [POINTER_AT.x - 1, POINTER_AT.y - 1, POINTER_AT.x + textWidth(POINTER), POINTER_AT.y + 9]];
  const out = {ep, outroFrames: LAST + 1, band: {from: PRE + T.band, to: PRE + LAST}, covered: [], mothBox: null, toast: [], ok: true};
  const frames = {};
  for (let f = PRE + T.band; f <= PRE + LAST; f++) {
    const c = render(f);
    frames[f] = c;
    let bad = 0;
    for (const [x0, y0, x1, y1] of rows) for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (c[y * 480 + x] !== ref.c[y * 480 + x]) bad++;
    if (bad) { out.covered.push([f, bad]); out.ok = false; }
  }
  const mb = mothRestBox();
  out.mothBox = {box: mb, termsRightEdge: TERMS_AT.x + textWidth(TERMS) - 1, period: [PERIOD.x, PERIOD.y], clear: mb[0] > TERMS_AT.x + textWidth(TERMS) - 1};
  if (!out.mothBox.clear) out.ok = false;
  // the moth's whole flight (Ep1, inside bar 3): its inked box never meets a text box (the toast rows, the terms line,
  // the pointer), with the minimum gap in px; frames where it crosses the Orb are listed (allowed: it's the lens gag)
  if (EPS[ep].moth) {
    const tb = rowBoxes(EPS[ep]).concat(rows);
    const hits = [], overOrb = [];
    let minGap = 1e9;
    for (let o = 0; o <= LAST; o++) {
      const m = mothFlight(o);
      if (!m) continue;
      const [a0, b0, a1, b1] = mothBox(m.pose, m.x, m.y, m.flip);
      for (const [x0, y0, x1, y1] of tb) {
        const gx = Math.max(x0 - a1, a0 - x1, 0), gy = Math.max(y0 - b1, b0 - y1, 0);
        const gap = Math.max(gx, gy) - 1;
        minGap = Math.min(minGap, gap);
        if (a1 >= x0 && a0 <= x1 && b1 >= y0 && b0 <= y1) hits.push([o, [x0, y0, x1, y1]]);
      }
      if (Math.hypot((a0 + a1) / 2 - 420, (b0 + b1) / 2 - 96) < 31) overOrb.push(o);
    }
    out.mothPath = {hits, minGapPx: minGap, overOrbFrames: overOrb};
    if (hits.length) out.ok = false;
  }
  // ---- the toast rows
  const e = EPS[ep];
  const texts = toastLines(e).concat([e.verdict]);
  const boxes = rowBoxes(e);
  const states = texts.map((s, i) => {
    const isV = i === texts.length - 1;
    const [x, y] = isV ? [TOAST.x + 6, TOAST.vy + 2] : typeAt(i);
    const m = new Buf(480, 270, 0);
    tx(m, s, x, y, 1);
    return {s, x, y, w: tw(s), m, ink: isV ? [PAL.N0] : i === 0 ? [PAL.C8] : [PAL.C8, INK_RESOLVED], ground: isV ? [PAL.C6] : i === 0 ? [PAL.C1] : [PAL.C1, PAL.N0, PAL.N1]};
  });
  const legible = (c, r) => {
    // one state at a time: ink and ground must come from the same pair (chip C8 on C1, or scan type C6 on N0/N1)
    const pairs = r.ink.length === 1 ? [[r.ink[0], r.ground]] : [[PAL.C8, [PAL.C1]], [INK_RESOLVED, [PAL.N0, PAL.N1]]];
    return pairs.some(([ink, grounds]) => {
      for (let yy = r.y; yy <= r.y + 8; yy++) for (let xx = r.x; xx < r.x + r.w; xx++) {
        const v = c[yy * 480 + xx];
        if (r.m.c[yy * 480 + xx]) { if (v !== ink) return false; } else if (!grounds.includes(v)) return false;
      }
      return true;
    });
  };
  const CPS = [16, 18, 20];
  const rowsOut = states.map((r, i) => {
    let from = null, gaps = 0;
    for (let o = LAST; o >= 0; o--) { if (legible(frames[PRE + o], r)) from = o; else break; }
    for (let o = 0; o < (from ?? 0); o++) if (legible(frames[PRE + o], r)) gaps++;
    const chars = [...r.s].length;
    const on = from === null ? 0 : LAST - from + 1;
    const need = chars / 16 + 0.5;
    return {row: i, line: r.s, chars, px: r.w, box: boxes[i], legibleFrom: from, legibleFrames: on, seconds: +(on / 24).toFixed(2),
            cps: on ? +(chars / (on / 24)).toFixed(1) : null, needAt16cpsPlusHalf: +need.toFixed(2), perLineOk: on / 24 >= need, earlierFlickers: gaps};
  });
  out.toast = rowsOut;
  const inOrder = (cps) => {
    let t = 0;
    const fin = rowsOut.map((r) => { t = Math.max(t, r.legibleFrom ?? 999) + (r.chars / cps) * 24; return +t.toFixed(1); });
    return {cps, finishes: fin, lastFinish: fin[fin.length - 1], cut: LAST + 1, ok: fin[fin.length - 1] <= LAST + 1, marginFrames: +(LAST + 1 - fin[fin.length - 1]).toFixed(1)};
  };
  out.toastInOrder = CPS.map(inOrder);
  const toastChars = rowsOut.reduce((a, r) => a + r.chars, 0);
  const bandChars = TERMS.length + POINTER.length;
  const bandFrames = LAST + 1 - T.band;
  out.wholeFrame = {
    toastChars, bandChars, totalChars: toastChars + bandChars,
    outroSeconds: (LAST + 1) / 24, bandOnSeconds: +(bandFrames / 24).toFixed(2),
    secondsNeeded: Object.fromEntries(CPS.map((c) => [c, +((toastChars + bandChars) / c).toFixed(2)])),
    // the band time left to a reader who reads the toast in order at 18 cps: before the header posts + after the toast is read
    bandUncontestedAt18: +(((T.header - T.band) + (bandFrames - Math.min(bandFrames, out.toastInOrder[1].lastFinish))) / 24).toFixed(2),
    bandReadAt18: +(bandChars / 18).toFixed(2),
  };
  out.terms = {chars: TERMS.length, px: textWidth(TERMS), onSeconds: +(bandFrames / 24).toFixed(2), rule5s: bandFrames / 24 >= 5};
  out.perLineOk = rowsOut.every((r) => r.perLineOk);
  if (!out.perLineOk || !out.terms.rule5s) out.ok = false;
  out.toastBox = toastBox(e);
  fs.writeFileSync(`${outDir}/check-ep${ep}.json`, JSON.stringify(out, null, 1));
  console.log(JSON.stringify({ep, ok: out.ok, covered: out.covered.length, mothClear: out.mothBox.clear, mothPath: out.mothPath && {hits: out.mothPath.hits.length, minGapPx: out.mothPath.minGapPx, overOrb: out.mothPath.overOrbFrames.join(',')}, perLineOk: out.perLineOk,
    rows: rowsOut.map((r) => `${r.legibleFrom}:${r.seconds}s:${r.cps}cps`), inOrder: out.toastInOrder.map((x) => `${x.cps}cps->${x.lastFinish}/${x.cut}`), whole: out.wholeFrame}));
} else if (spec.startsWith('grid:')) {
  const fsx = spec.slice(5).split(',').map(Number);
  const cols = 4, rowsN = Math.ceil(fsx.length / cols);
  const W = 480 * cols, H = 270 * rowsN;
  const c = new Uint32Array(W * H);
  fsx.forEach((f, k) => {
    const b = render(f);
    const ox = (k % cols) * 480, oy = Math.floor(k / cols) * 270;
    for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) c[(oy + y) * W + ox + x] = b[y * 480 + x];
  });
  writePNG(`${outDir}/grid-ep${epS}.png`, W, H, c, scale);
  console.log('ok');
} else {
  for (const f of spec.split(',').map(Number)) writePNG(`${outDir}/pv-ep${epS}-f${String(f).padStart(3, '0')}.png`, 480, 270, render(f), scale);
  console.log('ok');
}
