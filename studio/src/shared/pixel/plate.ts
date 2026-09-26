// MR. MAS — shared pixel engine: CLEAN-PLATE mode for conditioning exports (tools/genvideo/keyframes.py).
// Rendering with the input prop {"genvideoPlate": true} makes every <PixelScene> show only what draw() paints:
// no `after` UI layer, no glyph layers, no palette / switch specs. Scenes that paint UI inside draw() (the
// adventure verb band) can check isGenvideoPlate() and skip it. Off by default: nothing changes without the prop.
import {getInputProps} from 'remotion';

let cached: boolean | null = null;
export const isGenvideoPlate = (): boolean => {
  if (cached === null) {
    try {
      cached = !!(getInputProps() as Record<string, unknown> | undefined)?.genvideoPlate;
    } catch {
      cached = false;
    }
  }
  return cached;
};
