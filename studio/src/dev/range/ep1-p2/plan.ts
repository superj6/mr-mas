// MR. MAS · range E1-P2 (1.H, WHAT THE QUACK): the plan. One function says, for a version and a frame p, what the
// picture is: which shot, which frame of the take (or which three stills), the super, the caption, the Orb's eye-light,
// the iris, the whir and the rail. style-range §6.1a "E1-P2", on the 96 BPM grid (a beat is 15 f, a bar 60 f).
//   A (the ramp, 264 f): p0-71 the film on 1s · p72-95 on 2s · p96-111 on 4s · p112-119 on 8s · p120 the strip of
//     stills (one hold from each rate: take frames 72, 96, 112) · eye-light lands p128 · caption types p132-152, holds
//     to p191 · [2S] p192-263, the iris steps back to Mas at p204, the slot whirs at p240.
//   B (the break, 216 f): p0-71 the film on 1s · p72 the strip at once (take frames 0, 36, 71) · eye-light p80 ·
//     caption types p84-104, holds to p143 · [2S] p144-215, iris p156, whir p192.
// One deliberate change from the brief (said in the handoff): A's strip shows one hold from each step of the ramp
// (72, 96, 112), not "the last three holds" (104, 108, 112). Those three are 8 frames apart on a slow arc and read as
// one picture shown three times, which is the "playback glitch" read the brief fails on.
export type Version = 'A' | 'B';
export const LEN: Record<Version, number> = {A: 264, B: 216};
export const TITLE = 'ELGOOG DEMO · DEC 6';
/** the film's super, set with typographic quotes (a product film's own graphics are typeset, not typed) */
export const SUPER = '\u201CWhat the quack!\u201D';
export const CAPTION = "LATER: ELGOOG'S DEMO WASN'T REAL-TIME";
export const RAIL = 'DEC 6, 2023';
/** the take is p0..p119 of one camera arc (blender/duck.py renders f000..f119) */
export const TAKE_FRAMES = 120;

export type Film = {kind: 'frame'; t: number} | {kind: 'strip'; ts: [number, number, number]};
export interface Beat {
  shot: 'ots' | '2s';
  film: Film;
  /** the film's own super, 0..1 (it fades in on 1s from p18: it's the film's graphic, not the show's) */
  superA: number;
  /** characters of the caption typed (0 = none yet) */
  caption: number;
  /** the Orb's eye-light on the glass: 0 none · 1..3 its three held steps sliding in · 4 landed */
  eye: number;
  /** [2S] the Orb's iris: on the monitor, the one in-between, on Mas */
  iris: 'monitor' | 'mid' | 'mas';
  /** frames since the rack's slot started to whir (-1 = not yet) */
  whir: number;
  /** characters of the rail typed in the band */
  rail: number;
  /** the rate the take is being shown at (1, 2, 4, 8), for the sheet's labels; 0 = the strip / [2S] */
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

const STRIP_A: [number, number, number] = [72, 96, 112];
const STRIP_B: [number, number, number] = [0, 36, 71];

export const plan = (v: Version, p: number): Beat => {
  const b: Beat = {shot: 'ots', film: {kind: 'frame', t: 0}, superA: superAt(p), caption: 0, eye: 0, iris: 'monitor', whir: -1, rail: 0, rate: 1};
  const strip = v === 'A' ? 120 : 72;
  const eye0 = v === 'A' ? 122 : 74;
  const cap0 = v === 'A' ? 132 : 84;
  const two = v === 'A' ? 192 : 144;
  const irisAt = v === 'A' ? 204 : 156;
  const whirAt = v === 'A' ? 240 : 192;
  if (p < strip) {
    const [t, rate] = v === 'A' ? rampFrame(p) : [p, 1];
    b.film = {kind: 'frame', t};
    b.rate = rate;
  } else {
    b.film = {kind: 'strip', ts: v === 'A' ? STRIP_A : STRIP_B};
    b.superA = 1;
    b.rate = 0;
  }
  if (p >= eye0) b.eye = Math.min(4, 1 + Math.floor((p - eye0) / 2));
  b.caption = typed(p, cap0, cap0 + 20, CAPTION.length);
  if (p >= two) {
    b.shot = '2s';
    b.rate = 0;
    b.iris = p < irisAt ? 'monitor' : p < irisAt + 2 ? 'mid' : 'mas';
    b.whir = p >= whirAt ? p - whirAt : -1;
    b.rail = p >= whirAt ? Math.min(RAIL.length, Math.floor((p - whirAt) / 1.5) + 1) : 0;
  }
  return b;
};

/** the take frames a beat needs (to preload) */
export const framesOf = (b: Beat): number[] => (b.film.kind === 'frame' ? [b.film.t] : [...b.film.ts]);
