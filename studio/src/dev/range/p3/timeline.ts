// MR. MAS — range/p3 (Prototype 3, 12.A THE RECONSTRUCTION's table): the frame plan. 24 fps, 96 BPM
// (beat 15 f, bar 60 f). Every number is the brief's (style-range §7.3) unless a comment says why it moved.
// Polish pass (after the cold read): every change of state is an eased ramp of 6-16 frames (no single-frame pops),
// the door and the exit are the show's own RENDER FRONT, the window is a cut to a long lens, and the exit is slow
// enough to read (the people come apart over 16 frames, the camera leaves his chair, the room re-renders onto Mas).
export const P3_FRAMES = 360;

export const T = {
  /** pixel [W] with the band on screen */
  wide: [0, 29],
  /** the band slides down out of frame (whole native px per frame, eased in; was three held steps) */
  bandOut: [30, 43],
  /** IN: the 3D takes over (the first frame is the pixel frame, exactly) */
  bloom: 45,
  /** the render front sweeps from the monitor's end to Mas: behind it the room is the model's copy (voxels in the
   *  room's own colours) and the people turn to their memory colours (the POV rims) */
  front: [45, 64],
  /** the camera glides from the side view into Mas's chair (the voxels part in depth; the room cools to points) */
  glide: [66, 119],
  /** the people come apart into points in their rim colours and gather at the 2015 seats */
  rimsIn: [70, 104],
  /** the four colours converge on cyan (the model's own), and the frame's rim draws on in cyan */
  rimsCyan: 104,
  rimFrame: 106,
  /** the era slate, once we're in the chair (before the table, so the two don't land on one frame) */
  era: 108,
  /** the learned objects resolve, one family per beat; the guests assemble out of their clusters (pixel by pixel)
   *  on beat 2 so the candles' light visibly lands ON them */
  resolve: {table: 120, guests: 128, candles: 150, cutlery: 166, glasses: 180, masGlass: 195},
  /** all four contact types on screen */
  contact: 200,
  /** the stat bars rise, one guest per beat; one piano chord as the last bar fills */
  bars: [210, 225, 240, 255],
  chord: 263,
  /** CUT to a long lens (4x) on the window: his reflection at the head of the reflected table; the empty plate */
  window: 270,
  emptyPlate: 280,
  /** OUT: objects de-resolve (eased, staggered), the people come apart into points */
  deresolve: {glasses: 296, cutlery: 299, candles: 302, table: 306},
  peopleOut: [298, 316],
  /** the camera leaves his chair (the lens widens, then the glide in reverse) while everything streams into the monitor */
  pullback: [309, 329],
  stream: [307, 326],
  /** pixel [W] again: the render front re-renders the room out of the monitor, landing on Mas and his glass */
  back: 330,
  backFront: [330, 343],
  bandIn: [342, 353],
  end: 359,
} as const;

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const smooth = (t: number) => { t = clamp01(t); return t * t * (3 - 2 * t); };
export const smoother = (t: number) => { t = clamp01(t); return t * t * t * (t * (t * 6 - 15) + 10); };
/** 0 -> 1 eased over [a, b] */
export const ramp = (f: number, a: number, b: number) => smooth((f - a) / Math.max(1e-6, b - a));

/** 3D is on screen for these frames (the rest is the pure pixel engine) */
export const in3D = (f: number) => f >= T.bloom && f < T.back;
/** band rows on screen (0 = gone, 67 = full): a slide in whole native rows, eased (in on the way out, out on the way back) */
export const bandRows = (f: number) => {
  if (f < T.bandOut[0]) return 67;
  if (f <= T.bandOut[1]) { const t = (f - T.bandOut[0] + 1) / (T.bandOut[1] - T.bandOut[0] + 1); return Math.round(67 * (1 - t * t)); }
  if (f < T.bandIn[0]) return 0;
  if (f <= T.bandIn[1]) { const t = (f - T.bandIn[0] + 1) / (T.bandIn[1] - T.bandIn[0] + 1); return Math.round(67 * (1 - (1 - t) * (1 - t))); }
  return 67;
};
