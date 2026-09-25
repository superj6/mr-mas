// @ts-nocheck -- Node-only dev tool: print the neon spill LUTs (source -> tinted) by master-palette name.
import {PAL, PAL_NAMES} from '../../../shared/pixel';
import {tintLUT} from '../sign';
const name = new Map(PAL_NAMES.map((n) => [PAL[n], n]));
const [tube, amt, lift] = process.argv.slice(2);
const t = tintLUT(tube, amt === 'near', Number(lift));
console.log(t.map(([a, b]) => `${name.get(a)}>${name.get(b)}`).join(' '));
