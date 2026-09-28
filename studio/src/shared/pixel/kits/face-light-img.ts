// MR. MAS — kit: THE FACE LIGHT on a figure, and the close-ups that ask for it (Ep1 v3.1; mood-analysis.md §4 #4; new
// file, owned by the `v3-art-b` pass). The non-joke close-ups measured at 4–5% mean luma ("alyi voted." 4.3%): "a key
// or rim one or two ramp steps up, ON THE FACE ONLY, so each expression reads at a glance on a TV or a phone. The night
// palette and the room stay as they are." The buffer-level pass is art-a's (kits/face-light.ts faceKey: skin in a rect
// k rungs up, the lit edge one more); this adds the same step on a rendered figure before it is placed, so a shot pass
// needn't know where the face lands:
//   faceLightImg(img, k, o)   the image's skin rungs (S, K, X) in the head's region (its top `top` fraction) step up k
//                             within their own family; the outline rung (0) and every non-skin colour (eyes, mouth ink,
//                             hair, clothes) untouched. `key` [dx, dy] makes it a key: the side facing it gets k, the
//                             far side k - 1 (a hard cel step at the terminator: skin never dithers). Cached.
//   FACE_LIGHTS               the close-ups that ask for ONE step (draft 7's shot notes), where the key comes from in
//                             each, and which entry point suits the drawing ('img' here, 'rect' = art-a's faceKey)
//   lumaOf(b, x, y, w, h)     mean Rec.709 luma (0..1) of a region, the measure the mood analysis used, for the stills
import {Buf} from '../px';
import {familyOf, stepColor} from '../palette';
import type {Img} from '../figure';

export interface FaceLightOpts {
  /** the key's direction in image space (e.g. [-1, -0.3] = from the left, a little above); omit = even */
  key?: [number, number];
  /** the head's region: the image's top fraction (default 0.62; below it the hands are left alone) */
  top?: number;
}
const liftable = (c: number) => { const f = familyOf(c); return !!f && f[1] > 0 && (f[0] === 'S' || f[0] === 'K' || f[0] === 'X'); };
const CACHE = new WeakMap<Img, Map<string, Img>>();
export const faceLightImg = (img: Img, k = 1, o: FaceLightOpts = {}): Img => {
  const key = `${k}|${o.key?.join(',') ?? ''}|${o.top ?? ''}`;
  let m = CACHE.get(img);
  if (!m) { m = new Map(); CACHE.set(img, m); }
  const hit = m.get(key);
  if (hit) return hit;
  const top = Math.round(img.h * (o.top ?? 0.62));
  let x0 = img.w, x1 = -1, y0 = img.h, y1 = -1;
  for (let y = 0; y < top; y++) for (let x = 0; x < img.w; x++) {
    const v = img.c[y * img.w + x];
    if (v < 0 || !liftable(v)) continue;
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  const out: Img = {w: img.w, h: img.h, c: new Int32Array(img.c)};
  if (x1 >= 0) {
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, hw = Math.max(1, (x1 - x0) / 2), hh = Math.max(1, (y1 - y0) / 2);
    const kl = o.key ? Math.hypot(o.key[0], o.key[1]) || 1 : 1;
    for (let y = 0; y < top; y++) for (let x = 0; x < img.w; x++) {
      const i = y * img.w + x, v = img.c[i];
      if (v < 0 || !liftable(v)) continue;
      let n = k;
      if (o.key) n = ((x - cx) / hw) * (o.key[0] / kl) + ((y - cy) / hh) * (o.key[1] / kl) >= -0.15 ? k : k - 1;
      if (n > 0) out.c[i] = stepColor(v, n);
    }
  }
  m.set(key, out);
  return out;
};
/** mean Rec.709 luma of a region, 0..1 (on the palette's sRGB values, as the mood analysis's frame means) */
export const lumaOf = (b: Buf, x = 0, y = 0, w = b.w, h = b.h) => {
  let s = 0, n = 0;
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) {
    const v = b.get(i, j);
    s += (0.2126 * ((v >> 16) & 255) + 0.7152 * ((v >> 8) & 255) + 0.0722 * (v & 255)) / 255; n++;
  }
  return n ? s / n : 0;
};
export interface FaceLightShot { who: string; what: string; key: [number, number]; via: 'img' | 'rect'; note: string }
export const FACE_LIGHTS: Record<string, FaceLightShot> = {
  '18.05': {who: 'MAS', what: 'the toast: verified: human (4.6%)', key: [1, -0.2], via: 'img', note: 'rooms/darkroom-act3 drawScanMCU({faceLight: 1}): faceLightImg on his portrait, keyed from the Orb (camera-right)'},
  '22.03': {who: 'MAS', what: 'Mas and the Orb, the phone between them', key: [-1, -0.2], via: 'rect', note: 'rooms/darkroom-act3 drawDarkA3({faceLight: 1}): art-a\'s faceKey over FACE_AT_MEDIUM, the rim on the monitor\'s side (frame left)'},
  'S5.07b': {who: 'MAS', what: '"alyi voted." (4.3%, the darkest close-up)', key: [-1, -0.2], via: 'img', note: 'masPortrait -> faceLightImg before the blit; the monitor\'s side'},
  'S5.05': {who: 'MAS', what: '"mostly." (4.4%)', key: [-1, -0.2], via: 'img', note: 'masPortrait, turned toward the Orb'},
  'S4.07': {who: 'NELEH', what: 'her real face (4.8%)', key: [-1, -0.4], via: 'img', note: 'nelehPortrait; the room steps down behind her'},
  'S5.09b': {who: 'GERG', what: 'his look up (4.9%)', key: [0, -1], via: 'rect', note: 'drawGergMediumTile paints straight into the buffer: faceKey over his tile\'s face'},
  'S4.15': {who: 'MADA', what: 'arms folded, the spinner (4.9%)', key: [-1, -0.3], via: 'img', note: 'madaPortrait'},
  'S7.08': {who: 'MAS', what: '"good question." (5.0%)', key: [1, -0.2], via: 'img', note: 'masPortrait near-front; the fires behind him'},
  'S3.04b': {who: 'NELEH', what: 'one brow up', key: [-1, -0.4], via: 'img', note: 'nelehPortrait, frameless'},
  'S3.07': {who: 'ALYI', what: 'in the doorway, the jamb cutting him in half', key: [1, -0.2], via: 'img', note: 'his portrait before the doorframe clip'},
};
