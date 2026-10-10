// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// MR. MAS — Ep2's intro picture events: Ep1's export (studio/src/dev/intro/tools/events.ts, the committed
// out/season/intro/picture/intro-events.json) with the slot's changes applied. Only the keycap's name, the subtitle and
// the dot's rest differ (and the typed line, if a slot ever changes it: Ep2's is Ep1's, so its typing events are Ep1's
// as exported); every other event (the EDL, the cuts, the Orb, the stamps, the toast, the ding) is Ep1's frame for
// frame, so the SFX and the mix cue from the same picture frames.
//   (cd studio && node_modules/.bin/esbuild src/episodes/ep02/intro/tools/events.ts --bundle --platform=node \
//      --outfile=<scratch>/ev2.cjs --log-level=warning)
//   node <scratch>/ev2.cjs <ep1 intro-events.json> out/ep02/v1/intro/intro-ep2-events.json
import * as fs from 'fs';
import {EP2_SLOT} from '../slot';
import {EP1_SLOT} from '../../../../intro/slot';
import {lineKeys} from '../../../../dev/mcoldopen/timeline';

const [src, dst] = process.argv.slice(2);
const d = JSON.parse(fs.readFileSync(src, 'utf8'));
const L = EP2_SLOT.cold.line;
const ownLine = L !== EP1_SLOT.cold.line; // Ep2: false (the showrunner, 2026-10-10: the typed quote never changes)
const out = [];
for (const e of d.events) {
  if (ownLine && e.moment === 'mcoldopen' && e.type === 'text-type') continue; // replaced below
  const x = {...e};
  if (typeof x.what === 'string') {
    x.what = x.what.replace(`the ${EP1_SLOT.keycap.name} keycap`, `the ${EP2_SLOT.keycap.name} keycap`)
      .replace(`frozen ${EP1_SLOT.keycap.name} keycap`, `frozen ${EP2_SLOT.keycap.name} keycap`)
      .replace(`"${EP1_SLOT.subtitle}"`, `"${EP2_SLOT.subtitle}"`)
      .replace('"you are here" dot climbs the curve', `"you are here" dot climbs the curve from its rest at ${EP2_SLOT.cold.dot.toFixed(2)}`);
  }
  // the subtitle types at 4 characters a frame: Ep2's 22 end on f645 (Ep1's 31 on f647)
  if (x.type === 'text-type' && x.moment === 'mfinale') {
    const end = x.f + Math.ceil(EP2_SLOT.subtitle.length / 4) - 1;
    x.what = x.what.replace(`(${x.f}-${x.end})`, `(${x.f}-${end})`);
    x.end = end;
  }
  out.push(x);
}
if (ownLine) out.push({f: L.keys1[0], end: L.keys1[L.keys1.length - 1], type: 'text-type', moment: 'mcoldopen',
  what: `"${L.l1}" types (${L.keys1.length} keystrokes), 6 frames ahead of the VO`, src: 'studio/src/episodes/ep02/intro/slot.ts EP2_SLOT.cold.line.keys1'});
if (ownLine && L.indicator) out.push({f: L.indicator[0], end: L.indicator[1], type: 'typing-indicator', moment: 'mcoldopen',
  what: 'the pulsing typing indicator (three dots, one lit per 5 frames, beat-locked) holds the rest of the phrase in silence; no sound',
  src: 'studio/src/episodes/ep02/intro/slot.ts EP2_SLOT.cold.line.indicator / src/dev/mcoldopen/screen.ts drawIndicator'});
out.sort((a, b) => a.f - b.f || (a.end ?? a.f) - (b.end ?? b.f));
const res = {...d, title: 'MR. MAS — intro-ep2 picture events (as built; Ep1\'s export with the Ep2 slot applied)',
  version: '2026-10-10', composition: 'intro-ep2', events: out,
  slot: {ep: EP2_SLOT.ep, line: L.l2 ? `${L.l1} ${L.l2}` : L.l1, keys: lineKeys(L), indicator: L.indicator, dot: EP2_SLOT.cold.dot,
         keycap: EP2_SLOT.keycap.name, subtitle: EP2_SLOT.subtitle}, derived_from: src};
fs.writeFileSync(dst, JSON.stringify(res, null, 1) + '\n');
console.log(`wrote ${dst}: ${out.length} events (Ep1 ${d.events.length})`);
