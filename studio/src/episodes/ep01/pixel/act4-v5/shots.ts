// MR. MAS — Ep1 pixel pipeline (P0): ACT FOUR v5 ON THE EPISODE PIPELINE, the pipeline's test. Nothing is redrawn:
// the 83 layouts are Act Four v5's own (act4/animatic/shots5.ts DRAW5, through drawShot5, which keeps its footnote and
// toast styles and its stick fallback), handed the shots of THIS pipeline's lock (./data.ts: tools/lock.py on the
// timeline v5 was cut from, with lock_v5.py's plan tables read from that file). A PxShot carries every ShotV5 field
// with the same meaning, so the layouts get them as they are. The Act Four specifics are options here, not in the host:
//   badge   the told-twice side badge in the band (on, as v5)            j1   J1 "CANCELLED" at the Cancel click
//   glyph   S1.09's masked GLYPH dissolve returns real glyph layers       (OFF, as v5: the showrunner has not ruled;
//           (the Node renderer splices the browser host's frames there)    on = 60 browser frames from the click,
//                                                                          drawn by ./browser.tsx; never both)
// tools/act4check.ts renders every frame both ways (frame5 and this) and compares them pixel for pixel.
import {defineSegment} from '../spec';
import type {Layout} from '../spec';
import {LOCK} from './data';
import {DRAW5, drawShot5, factsText5, CANCEL_CLICK} from '../../act4/animatic/shots5';
import {MIX_MISSING} from '../../act4/animatic/frame5';
import {j1Active} from '../../act4/art-v5/j1/timing';
import type {ShotV5} from '../../act4/animatic/data-v5';
import type {PxShot} from '../types';

/** frame5's GLYPH probe: only layouts whose recipe names the dissolve are probed frame by frame */
const GLYPHY = /GLYPH|glyph|dissolve/;
const layouts: Record<string, Layout> = {};
for (const sh of LOCK.shots) {
  const d = DRAW5[sh.id];
  if (!d) continue; // no v5 layout: the pipeline's host draws its stand-in (none are missing: render.ts check)
  layouts[sh.id] = {st: d.st, standin: d.standin, kind: d.kind, glyph: GLYPHY.test(d.st), draw: (fb, k, s: PxShot, f) => drawShot5(fb, k, s as unknown as ShotV5, f)};
}
const KIND_NAME: Record<string, string> = {R: 'R · V4 LAYOUT, RE-TIMED', C: 'C · V4 LAYOUT + V5 ART', N: 'N · NEW V5 COMPOSITION'};

export const SEGMENT = defineSegment({
  seg: 'act4-v5',
  lock: LOCK,
  layouts,
  options: {badge: true, vo: 'typed', voLowercase: true, subs: 'off', standin: 'stick', j1: false},
  review: {
    title: 'MR. MAS · EP1 · ACT FOUR',
    subtitle: 'ANIMATIC v5 · LOCK v5 (STICK TIMING)',
    kindNames: KIND_NAME,
    sideBadge: true,
    durNote: 'AS THE STICK',
    soundLabel: 'SOUND · TEMP TRACK = THE STICK MIX',
    fallbackText: 'STICK FALLBACK: THE LAYOUT DID NOT DRAW',
    mixMissing: MIX_MISSING,
    textFix: factsText5,
    speakerLabel: () => 'MAS (THROUGH THEIR LAPTOP)',
    seqColour: (q) => (q.chapter.startsWith('HIS') ? 0x1d3a4a : 0x4a3520),
  },
  // J1 (art-v5/j1): 60 frames from the Cancel click, React + SVG, so browser-only. Off unless opts.j1
  browser: {frames: (f, o) => o.j1 === true && j1Active(f - CANCEL_CLICK), note: 'J1 "CANCELLED" at the Cancel click (option j1)'},
});
