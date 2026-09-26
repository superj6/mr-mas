// MR. MAS — kits: the [MAS'S VERSION] treatment (D5), as a helper. New file, owned by the act-4 insert + expression
// artist (pov-changes §5.1 "MAS'S VERSION helper: a matching-frame variant plus a stillness flag (freezes every other
// layer for the bar). No present-day rim"; pov-and-framing §4.1, §2.3 D5; script sc 29).
//
// THE RULES (binding; this module encodes them so a shot can't drift):
//   1  SAME FRAMING. The VERSION is a matching frame of the TRUE shot that follows it: the same plate, the same size,
//      the same hand drawing in the same place. It is not a new shot; it is the true shot, told wrong.
//   2  TOO STILL. For the whole VERSION nothing else in the frame moves: every layer except the one the account is
//      about is held on a single frame (sc 29: the rack's LEDs and the Orb's iris at the frame's edge are held; the
//      hand rests; the phone is face-down).
//   3  NO RIM. No present-day cyan POV rim (the rim says whose memory a flashback is; this is his account of the
//      present). No palette switch either (pov-and-framing §11.1 item 4's default). `versionLint` checks the frame.
//   4  THE CORRECTION READS ON THE CUT ALONE. The hard cut on the downbeat to the TRUE shot (the phone face-up, the
//      post legible, the thumb tapping) is the whole correction; nothing may depend on counting fingers.
//   5  THE EGG. Six fingers on the VERSION's hand (kept by default; A/B at G2 with the five-finger copy). If THE
//      OUTSIDER marks "?" at G2, D5 is cut from the pilot: no VERSION, no V.O., the true [ECU] follows the [2S].
//   6  SOUND. Under it, a soft keynote-reel piano (an original cue, his brand), KILLED MID-PHRASE by the hard cut; on
//      the cut's downbeat the first heart *Tick.* (cue marks below).
//   7  NEVER ON SCREEN. `[MAS'S VERSION]` is a script tag only: no label, no card, no caption.
import type {Buf} from '../px';
import {PAL} from '../palette';

export const VERSION_RULES = {
  sameFraming: true, still: true, rim: false, paletteSwitch: false, label: false,
  sixFingers: 'egg: kept by default, A/B at G2 (five-finger copy)', music: 'keynote-reel piano (original), cut mid-phrase on the hard cut',
  cut: 'HARD CUT on the downbeat to the true shot', fallback: 'if G2 marks "?": cut D5 (no VERSION, no V.O.); the true ECU follows the [2S]',
} as const;

export interface VersionPlan {
  /** first frame of the VERSION (on a downbeat) */
  t0: number;
  /** its length in frames (1 bar = 60) */
  frames: number;
  /** the hard cut to the true shot (t0 + frames, on a downbeat) */
  cutAt: number;
  /** the frame every held layer is frozen on */
  holdAt: number;
  /** the egg (G2 A/B) */
  six: boolean;
}
export const versionPlan = (t0: number, o: {bars?: number; six?: boolean; holdAt?: number} = {}): VersionPlan => {
  const frames = Math.round((o.bars ?? 1) * 60);
  return {t0, frames, cutAt: t0 + frames, holdAt: o.holdAt ?? t0, six: o.six ?? true};
};
export const inVersion = (f: number, p: VersionPlan) => f >= p.t0 && f < p.cutAt;
/**
 * THE STILLNESS FLAG. Any layer draws at `layerFrame(f, plan)` instead of f: during the VERSION it gets the plan's
 * single held frame (LEDs, the Orb's iris, a clock, video noise, dust), after the cut it runs live again.
 */
export const layerFrame = (f: number, p: VersionPlan) => (inVersion(f, p) ? p.holdAt : f);
/** frames since the hard cut (the true shot's own clock; negative during the VERSION) */
export const sinceCut = (f: number, p: VersionPlan) => f - p.cutAt;

/**
 * Compose the pair on one timeline: draw(b, f', mode) is the shot's painter, called with mode 'version' (and the
 * held frame) during the VERSION, 'true' (and frames since the cut) after it. One painter = one framing: rule 1.
 */
export const drawVersionPair = (b: Buf, f: number, p: VersionPlan, draw: (b: Buf, f: number, mode: 'version' | 'true', six: boolean) => void) => {
  if (inVersion(f, p)) draw(b, p.holdAt - p.t0, 'version', p.six);
  else draw(b, sinceCut(f, p), 'true', false);
};

/** sound cue marks for the mix / the score (frames on the act clock) */
export const versionCues = (p: VersionPlan) => [
  {f: p.t0, cue: 'keynote_piano_in', note: 'soft keynote-reel piano, original cue (no real track, no borrowed melody)'},
  {f: p.cutAt, cue: 'keynote_piano_cut', note: 'killed mid-phrase by the hard cut'},
  {f: p.cutAt, cue: 'heart_tick', note: 'the first heart Tick. on the cut\'s downbeat'},
];

/**
 * RULE 3 CHECK: no present-day POV rim. Returns false if the frame's outer band (6 px) is a continuous ring of the
 * rim cyan family (C6..C9) on all four sides — the look the VERSION must not have.
 */
export const versionLint = (fb: Buf, x0 = 0, y0 = 0, w = fb.w, h = 203): boolean => {
  const rim = new Set([PAL.C6, PAL.C7, PAL.C8, PAL.C9]);
  const side = (pts: Array<[number, number]>) => pts.filter(([x, y]) => rim.has(fb.get(x, y))).length / pts.length > 0.8;
  const band = (d: number) => {
    const top: Array<[number, number]> = [], bot: Array<[number, number]> = [], lef: Array<[number, number]> = [], rig: Array<[number, number]> = [];
    for (let x = x0; x < x0 + w; x += 3) { top.push([x, y0 + d]); bot.push([x, y0 + h - 1 - d]); }
    for (let y = y0; y < y0 + h; y += 3) { lef.push([x0 + d, y]); rig.push([x0 + w - 1 - d, y]); }
    return side(top) && side(bot) && side(lef) && side(rig);
  };
  for (let d = 0; d < 6; d++) if (band(d)) return false;
  return true;
};
