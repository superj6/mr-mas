// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Fast Node preview for outro D: exact pixels (no glyph layers are used), native 480x270 x scale.
//   npx esbuild src/dev/outro/d/tools/preview.ts --bundle --platform=node --outfile=<scratch>/od.js --log-level=warning
//   node <scratch>/od.js <outDir> <scale> <ep> <o> [<o> ...]        (o = outro frame, -24..269; 'all' = every frame)
//   node <scratch>/od.js --boxes <out.json> <ep>                       (per-frame text boxes + the audits, for QA)
// Line 1 of stdout is the read-time audit (per plate + the title: frames wholly on screen and settled before the out
// vs 16 chars/s + 0.5 s, and `crop`: frames on screen but not whole, which must be 0).
import {writePNG} from '../../../pixeladv/tools/png';
import {writeFileSync} from 'fs';
import {Buf, TRANSPARENT} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {textWidth} from '../../../../shared/pixel/font';
import {drawOutro, drawOutroUI} from '../scene';
import {EPS, TERMS, POINTER, SLUG, SHOW} from '../text';
import {layoutFor, readAudit, viewAt, plateDy, plateSettled, termsX, TERMS_Y, POINTER_Y, BAND_Y, SLUG_X, mothAt, mothRect, hugeTextWidth, HUGE_CAP} from '../world';
import {EV, OUT, PRE} from '../timeline';

const args = process.argv.slice(2);
const hit = (a, b) => a[0] < b[0] + b[2] && b[0] < a[0] + a[2] && a[1] < b[1] + b[3] && b[1] < a[1] + a[3];

if (args[0] === '--boxes') {
  const [, outFile, epS] = args;
  const cfg = EPS[Number(epS) || 1];
  const L = layoutFor(cfg);
  const frames = [];
  const overlaps = [];
  const mothHits = [];
  for (let o = 0; o < OUT; o++) {
    const boxes = [];
    if (o >= EV.band + 2 && o < EV.out) {
      boxes.push({id: 'terms', text: TERMS, rect: [termsX(), TERMS_Y, textWidth(TERMS), 9], full: true});
      const pw = textWidth(POINTER);
      boxes.push({id: 'pointer', text: POINTER, rect: [Math.floor((480 - pw) / 2), POINTER_Y, pw, 9], full: true});
    }
    if (o < EV.out) {
      const v = viewAt(o);
      for (const p of L.plates) {
        if (p.def.kind === 'cursor') continue;
        const dy = plateDy(p, o);
        if (dy === null) continue;
        const x = p.x - v.cx, y = p.y - v.cy + dy;
        const inside = x >= 0 && x + p.w <= 480 && y >= 0 && y + p.h <= BAND_Y;
        // while it pops or folds, only the rows above its line are drawn
        const yb = Math.min(BAND_Y, y + p.h, dy !== 0 ? p.base - v.cy : Infinity);
        if (yb - Math.max(0, y) < 1) continue;
        boxes.push({id: `plate${p.n}`, text: p.def.lines.join(' / '), rect: [Math.max(0, x), Math.max(0, y), Math.min(480, x + p.w) - Math.max(0, x), yb - Math.max(0, y)], full: inside && plateSettled(p, o)});
      }
      const T = L.title;
      if (o - T.pop >= 0) {
        const sw = hugeTextWidth(SHOW), fw = textWidth(T.fileText);
        const settled = o - T.pop >= 2;
        boxes.push({id: 'title', text: SHOW, rect: [T.show[0], T.show[1], sw, HUGE_CAP], full: settled});
        boxes.push({id: 'file', text: T.fileText, rect: [T.file[0], T.file[1], fw, 9], full: settled});
      }
    }
    const sw = textWidth(SLUG);
    boxes.push({id: 'slug', text: SLUG, rect: [SLUG_X, 4, sw, 9], full: true});
    // every pair of text boxes on screen must be apart (a plate's rect is its whole plate)
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++)
        if (!(boxes[i].id === 'title' && boxes[j].id === 'file') && hit(boxes[i].rect, boxes[j].rect)) overlaps.push({o, a: boxes[i].id, b: boxes[j].id});
    const m = mothRect(mothAt(L, o));
    if (m) for (const b of boxes) if (hit(m, b.rect)) mothHits.push({o, box: b.id});
    frames.push({o, boxes, moth: m});
  }
  const audit = readAudit(L);
  writeFileSync(outFile, JSON.stringify({audit, frames, overlaps, mothHits}));
  console.log(JSON.stringify(audit));
  console.log(JSON.stringify({overlaps: overlaps.length, first: overlaps.slice(0, 6), mothHits: mothHits.length, firstMoth: mothHits.slice(0, 6)}));
} else {
  const [outDir, scaleS, epS, ...os0] = args;
  const scale = Number(scaleS) || 2;
  const cfg = EPS[Number(epS) || 1];
  const L = layoutFor(cfg);
  console.log(JSON.stringify(readAudit(L)));
  console.log(JSON.stringify({title: L.title, tier1: L.tier1Y, tier2: L.tier2Y, dot: L.dot, plates: L.plates.map((p) => ({n: p.n, x: p.x, y: p.y, w: p.w, h: p.h, pop: p.pop, fold: p.fold}))}));
  const os = os0[0] === 'all' ? Array.from({length: PRE + OUT}, (_, i) => i - PRE) : os0.map(Number);
  for (const o of os) {
    const fb = new Buf(480, 270, PAL.N0);
    drawOutro(fb, o, cfg);
    const ui = new Buf(480, 270, TRANSPARENT);
    drawOutroUI(ui, o, cfg);
    for (let i = 0; i < fb.c.length; i++) if (ui.c[i] !== TRANSPARENT) fb.c[i] = ui.c[i];
    writePNG(`${outDir}/ep${cfg.ep}-o${o < 0 ? 'm' + String(-o).padStart(2, '0') : String(o).padStart(3, '0')}.png`, 480, 270, fb.c, scale);
  }
}
