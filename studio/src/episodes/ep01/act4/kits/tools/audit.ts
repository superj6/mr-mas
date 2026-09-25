// @ts-nocheck -- Node-only dev tool: a luminance / flash audit of the kit demos (guardrails §7: <= 3 flashes in any
// 24-frame window; a "flash" = a frame-to-frame change of mean relative luminance >= 0.1 in either direction).
//   npx esbuild src/episodes/ep01/act4/kits/tools/audit.ts --bundle --platform=node --outfile=<scratch>/kaudit.cjs && node <scratch>/kaudit.cjs
import {composeFrame} from '../../../../../shared/pixel/compose';
import {TRANSPARENT} from '../../../../../shared/pixel/px';
import {SCENES} from '../scenes';
const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const L = (c) => 0.2126 * lin((c >> 16) & 255) + 0.7152 * lin((c >> 8) & 255) + 0.0722 * lin(c & 255);
const only = process.argv.slice(2);
for (const [name, s] of Object.entries(SCENES)) {
  if (only.length && !only.includes(name)) continue;
  const lums = [];
  let maxPx = 0;
  for (let f = 0; f < s.frames; f++) {
    const {fb, ui} = composeFrame(s, f);
    let sum = 0;
    for (let i = 0; i < fb.c.length; i++) { const c = ui && ui.c[i] < TRANSPARENT ? ui.c[i] : fb.c[i]; const l = L(c); sum += l; if (l > maxPx) maxPx = l; }
    lums.push(sum / fb.c.length);
  }
  const flashes = lums.map((l, i) => (i && Math.abs(l - lums[i - 1]) >= 0.1 ? 1 : 0));
  let worst = 0;
  for (let i = 0; i < flashes.length; i++) { let n = 0; for (let j = i; j < Math.min(flashes.length, i + 24); j++) n += flashes[j]; worst = Math.max(worst, n); }
  const maxJump = Math.max(...lums.map((l, i) => (i ? Math.abs(l - lums[i - 1]) : 0)));
  console.log(`${name.padEnd(7)} frames ${s.frames}  mean L ${Math.min(...lums).toFixed(3)}..${Math.max(...lums).toFixed(3)}  max jump ${maxJump.toFixed(3)}  flashes/24f ${worst}  ${worst <= 3 ? 'PASS' : 'FAIL'}`);
}
