// MR. MAS · range passes: PRESENT. The room area (480x203 native) at an integer scale around a whole-pixel camera
// centre, and the band (480x67) always at 4x underneath. Scale 4 is the adventure layout; 5..12 are the pixel-step
// push-ins (a push is a whole-number change of pixel size, held, never a smooth zoom). Output 1920x1080 RGBA.
import {Buf} from '../../../../shared/pixel/px';

export const OUT_W = 1920, OUT_H = 1080;
export const ROOM_W = 480, ROOM_H = 203;
export const ROOM_OUT_H = ROOM_H * 4; // 812

export interface View { scale: number; cx: number; cy: number }
export const WIDE: View = {scale: 4, cx: 240, cy: 101.5};

/** The crop a view shows, in native room coords (top-left, clamped so the crop stays inside the room). */
export const cropOf = (v: View) => {
  const w = OUT_W / v.scale, h = ROOM_OUT_H / v.scale;
  const x0 = Math.round(Math.max(0, Math.min(ROOM_W - w, v.cx - w / 2)));
  const y0 = Math.round(Math.max(0, Math.min(ROOM_H - h, v.cy - h / 2)));
  return {x0, y0, w, h};
};

export const present = (room: Buf, view: View, band: Buf | null, out: Uint8ClampedArray, bandTop = 203) => {
  const s = view.scale;
  const {x0, y0} = cropOf(view);
  const put = (o: number, v: number) => { out[o] = (v >> 16) & 255; out[o + 1] = (v >> 8) & 255; out[o + 2] = v & 255; out[o + 3] = 255; };
  const roomRows = Math.min(ROOM_OUT_H, bandTop * 4);
  for (let y = 0; y < OUT_H; y++) {
    if (y < roomRows || !band) {
      const sy = Math.min(room.h - 1, y0 + Math.floor(y / s));
      const rowOff = sy * room.w;
      for (let x = 0; x < OUT_W; x++) put((y * OUT_W + x) * 4, room.c[rowOff + Math.min(room.w - 1, x0 + Math.floor(x / s))]);
    } else {
      const by = Math.floor(y / 4) - bandTop;
      const sy = Math.max(0, Math.min(band.h - 1, by));
      for (let x = 0; x < OUT_W; x++) put((y * OUT_W + x) * 4, band.c[sy * band.w + Math.floor(x / 4)]);
    }
  }
};

/** the same frame as a native-size colour array (for the 480x270 review downscale and contact sheets) */
export const presentNative = (room: Buf, view: View, band: Buf | null, bandTop = 203): Uint32Array => {
  const out = new Uint32Array(480 * 270);
  const s = view.scale / 4;
  const {x0, y0} = cropOf(view);
  for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) {
    if (y < bandTop || !band) out[y * 480 + x] = room.c[Math.min(room.h - 1, y0 + Math.floor(y / s)) * room.w + Math.min(room.w - 1, x0 + Math.floor(x / s))];
    else out[y * 480 + x] = band.c[(y - bandTop) * band.w + x];
  }
  return out;
};
