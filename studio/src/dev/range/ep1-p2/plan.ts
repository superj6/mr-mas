// MR. MAS · range E1-P2 (1.H, WHAT THE QUACK): the plan (v5, pass ep1r-p2r5). One function says, for a version and a
// frame p, what the picture is: which shot, which frame of the take (or where the stills are), the super, the caption,
// the Orb (its float, its iris, its scan beam), Mas (his lean in the [OTS]; his eyes and smile in the [2S]), the whir
// and the rail. style-range §6.1a "E1-P2", on the 96 BPM grid (a beat is 15 f, a bar 60 f).
//   Both: the rail `DEC 6, 2023` types at the scene's start (p6-20), the show's rail grammar, and holds; the player's
//     title strip says only `ELGOOG DEMO` (v4 typed the rail in the last second and repeated `DEC 6` in the strip).
//   A (the ramp, 264 f): p0-71 the film on 1s · p72-95 on 2s · p96-111 on 4s (the Orb's iris narrows at p96) ·
//     p112-119 on 8s: the frozen frame; Mas leans in, the Orb fires (p112) and its beam reaches the glass (p114) ·
//     p120-124 the frozen frame steps down into the last cell of a contact sheet while the other five stills are dealt
//     (p122-126) · caption types p132-152, Mas sits back (p152), the beam goes out (p156), holds to p191 ·
//     [2S] p192-263: the iris steps back to Mas (p204), he turns his head from the screen to the Orb (p212), the
//     one-pixel smile (p220),
//     the slot whirs (p240).
//   B (the break, 216 f): p0-71 the film on 1s · p72 the contact sheet at once, Mas leans in, the Orb fires ·
//     beam p74 · caption types p84-104, Mas sits back p104, beam out p108, holds to p143 · [2S] p144-215 (iris p156,
//     the turn p164, smile p172, whir p192).
// v5's changes against the cold review: the stills are six (a 3 x 2 contact sheet that fills the screen, each cell
// numbered with its take frame), the take is a 90-degree turntable spin (blender/duck.py v5) so the stills differ and
// the ramp's dropped frames show; the Orb's eye-light is now its scan beam, drawn from its lens to the glass.
export type Version = 'A' | 'B';
export const LEN: Record<Version, number> = {A: 264, B: 216};
export const TITLE = 'ELGOOG DEMO';
/** the film's super, set with typographic quotes (a product film's own graphics are typeset, not typed) */
export const SUPER = '“What the quack!”';
export const CAPTION = "LATER: ELGOOG'S DEMO WASN'T REAL-TIME";
export const RAIL = 'DEC 6, 2023';
/** the take is p0..p119 of one move (blender/duck.py renders f000..f119) */
export const TAKE_FRAMES = 120;
/** the contact sheet's six stills (take frames), in reading order; the last is the frame the film froze on */
export const SHEET: Record<Version, number[]> = {A: [0, 22, 45, 67, 90, 112], B: [0, 14, 28, 43, 57, 71]};

export type Film =
  | {kind: 'frame'; t: number}
  /** the sheet: `n` stills dealt so far (reading order); `shrink` = the frozen frame's step down into its cell (0 = full screen .. 2 = in its cell) */
  | {kind: 'sheet'; ts: number[]; n: number; shrink: number};
export interface Beat {
  shot: 'ots' | '2s';
  film: Film;
  /** the film's own super, 0..1 (it fades in on 1s from p18: it's the film's graphic, not the show's) */
  superA: number;
  /** characters of the caption typed (0 = none yet) */
  caption: number;
  /** [OTS] the Orb: its iris aperture, firing (the lens lit), and its beam on the glass (0 off, 1.. frames since on) */
  orbAp: number;
  fire: boolean;
  beam: number;
  /** [OTS] Mas leans in toward the screen (0 sat, 1 leaning in) */
  lean: 0 | 1;
  /** [2S] the Orb's iris: on the monitor, the one in-between, on Mas */
  iris: 'monitor' | 'mid' | 'mas';
  /** [2S] Mas: his head ('34' to the monitor, 'front' turned from it to the Orb), his eyes, his brow, his mouth */
  head: '34' | 'front';
  masLook: -1 | 0 | 1;
  brow: 0 | 1;
  smile: boolean;
  /** frames since the rack's slot started to whir (-1 = not yet) */
  whir: number;
  /** characters of the rail typed in the band */
  rail: number;
  /** the rate the take is being shown at (1, 2, 4, 8), for the sheet's labels; 0 = the stills / [2S] */
  rate: number;
}

const typed = (p: number, t0: number, t1: number, n: number) => (p < t0 ? 0 : p >= t1 ? n : Math.max(1, Math.round(((p - t0 + 1) / (t1 - t0 + 1)) * n)));
const superAt = (p: number) => {
  if (p < 18) return 0;
  const u = Math.min(1, (p - 18) / 8);
  return u * u * (3 - 2 * u);
};

/** the ramp: the same move, held on 2s, then 4s, then 8s (each hold a clean frame of the take) */
export const rampFrame = (p: number): [number, number] => {
  if (p < 72) return [p, 1];
  if (p < 96) return [p - (p % 2), 2];
  if (p < 112) return [96 + 4 * Math.floor((p - 96) / 4), 4];
  return [112, 8];
};

export const T = {
  A: {sheet: 120, deal: 122, notice: 96, fire: 112, beam: 114, cap: 132, back: 152, beamOff: 156, two: 192, iris: 204, eyes: 212, smile: 220, whir: 240},
  B: {sheet: 72, deal: 72, notice: 72, fire: 72, beam: 74, cap: 84, back: 104, beamOff: 108, two: 144, iris: 156, eyes: 164, smile: 172, whir: 192},
};

export const plan = (v: Version, p: number): Beat => {
  const k = T[v];
  const b: Beat = {
    shot: 'ots', film: {kind: 'frame', t: 0}, superA: superAt(p), caption: 0, orbAp: 0.5, fire: false, beam: 0, lean: 0,
    iris: 'monitor', head: '34', masLook: -1, brow: 0, smile: false, whir: -1, rail: typed(p, 6, 20, RAIL.length), rate: 1,
  };
  if (p < k.sheet) {
    const [t, rate] = v === 'A' ? rampFrame(p) : [p, 1];
    b.film = {kind: 'frame', t};
    b.rate = rate;
  } else {
    const ts = SHEET[v];
    // A: the frozen frame steps down into its cell in two held steps (p120, p122), the other five are dealt one a
    // frame from p122; B: the whole sheet at once (the break)
    const shrink = v === 'A' ? Math.min(2, Math.floor((p - k.sheet) / 2) + 1) : 2;
    const n = v === 'A' ? Math.max(0, Math.min(5, p - k.deal + 1)) : 5;
    b.film = {kind: 'sheet', ts, n, shrink};
    b.superA = 1;
    b.rate = 0;
  }
  if (p >= k.notice) b.orbAp = 0.3;
  if (p >= k.fire && p < k.beamOff) { b.fire = true; b.orbAp = 0.22; }
  if (p >= k.beam && p < k.beamOff) b.beam = p - k.beam + 1;
  if (p >= k.fire && p < k.back) b.lean = 1;
  b.caption = typed(p, k.cap, k.cap + 20, CAPTION.length);
  if (p >= k.two) {
    b.shot = '2s';
    b.rate = 0;
    b.fire = false; b.beam = 0; b.orbAp = 0.5;
    b.iris = p < k.iris ? 'monitor' : p < k.iris + 2 ? 'mid' : 'mas';
    // he turns from the screen to the Orb (the head's own drawing, big enough to read at phone size), then the smile
    if (p >= k.eyes) { b.head = 'front'; b.masLook = 1; b.brow = 1; }
    if (p >= k.smile) { b.smile = true; b.brow = 0; }
    b.whir = p >= k.whir ? p - k.whir : -1;
  }
  return b;
};

/** the take frames a beat needs (to preload) */
export const framesOf = (b: Beat): number[] => (b.film.kind === 'frame' ? [b.film.t] : [...b.film.ts]);
