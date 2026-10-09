// MR. MAS — Ep2 v1 pixel pipeline (a copy of the Ep1 v3 pipeline, which stays locked): the lock's schema. tools/lock.py writes one `<seg>/data.ts`
// per segment (export LOCK: SegLock) from that segment's stick timeline; the layouts (<seg>/shots.ts) and the host
// (frame.ts) read it. Frames are SEGMENT frames: 0 = the timeline's first beat; epIn = that frame's episode frame.
// Everything inside a shot is SHOT-relative (k = f - shot.s).
// Ep2 adds SCENES (PxScene; PxShot.scene / sceneS): the unit of the per-scene picture render (tools/render.ts `scenes`,
// with a content-hash cache). A layout's `f` is the frame inside its SCENE (segment frame - sceneS; spec.ts), so a scene
// draws the same pixels wherever it sits in the act.
//
// The Act Four v5 record (act4/animatic/data-v5.ts ShotV5 / LineV5) is a subset: a PxShot has every ShotV5 field, in
// the same order and meaning, plus the general fields below `marks`. That is how the Act Four port hands PxShots to
// shots5.ts's layouts unchanged (pixel/act4-v5/shots.ts).

export type Face = 'lip' | 'room' | null;

/** a line as one shot sees it (own, carried in from an earlier shot, or pre-lapped under this one) */
export interface PxLine {
  id: string;
  kind: 'dialogue' | 'vo' | 'post';
  mode: string; // 'on-mic' | 'call' | 'speaker' | 'post' | ...
  who: string; // UPPER: 'MAS', 'GERG'
  text: string;
  /** first sound / after the last sound, shot frames (s < 0: it started before this shot) */
  s: number;
  e: number;
  /** the take file's first / last frame on the shot clock (null: a post) */
  fs: number | null;
  fe: number | null;
  os: boolean; // off screen (O.S., through a speaker)
  via: string | null; // the take's device
  face: Face; // who shows a mouth in THIS framing (the lock's plan or the layout's `face`)
  lip: boolean; // face === 'lip'
  carry: boolean; // started in an earlier shot and runs into this one (an L-cut)
  cut: boolean; // cut off (ends on a dash)
  mouth: Array<[number, string]>; // [frame from s, viseme]
  words: Array<[string, number, number]>; // [word, f0, f1] from s
  tag: string; // the stick's tag: 'V.O.', 'O.S.', 'laptop', ...
  pre: boolean; // a pre-lap: owned by a later shot, starts under this one
}
/** an in-world text item (not a rail): kind = plate | card | label | ui | toast | sign | stamp | clock | ticker, or, on an Ep2
 *  lock, the beat plan's own kind (onscreen_items: card | stat | plate | post | doc | caption | lower-third | toast | ui | sign) */
export interface PxText { kind: string; text: string; s: number; e: number; must: boolean }
/** a stick sound spot in the shot (k = its frame) */
export interface PxSpot { name: string; k: number; dur: number | null }
/** a character the stick puts in the shot (x = its 0..1 position across the frame; from/until shot frames) */
export interface PxCastRef { id: string; pose: string; face: string; x: number | null; from: number | null; until: number | null }

export interface PxShot {
  // ---- the Act Four v5 fields (ShotV5), same order
  id: string;
  setup: string; // the stick's shotId (a continuation beat that returns after a cutaway shares it)
  beats: string[];
  seq: string;
  side: 'MAS' | 'BOARD';
  badge: string | null;
  whip: string | null; // 'in' | 'out' (the lock's plan)
  tag: string; // the stick's frame marker
  cls: string; // size class: W M OTS MCU CU ECU SW SC GS GM GD GFX BOX
  framing: string;
  move: string; // 'cut' | 'hold'
  s: number;
  e: number;
  plan: number;
  v4: string | null;
  verdict: string;
  does: string; // the stick's caption(s)
  sound: string; // "name @k · ..."
  chars: string[];
  lines: PxLine[];
  texts: PxText[];
  marks: Record<string, number>;
  // ---- the general fields
  kind: string; // the beat's kind: scene | card | montage | ...
  set: string;
  room: string;
  style: string;
  fx: string[];
  slate: boolean; // a reviewer slate (not part of the show)
  sideLabel: string;
  cues: string[];
  spots: PxSpot[];
  onscreen: Array<{text: string; s: number; e: number}>; // every onscreen item as the stick wrote it (rails and posts too)
  speak: Array<{who: string; s: number; e: number}>; // silent speaking highlights
  beatStarts: Record<string, number>;
  names: Array<{id: string; k: number}>; // the picture names this character from k
  fg: {id: string; side: string} | null;
  cast: PxCastRef[];
  // ---- Ep2: the scene (the per-scene render's unit; tools/lock.py from the beat plan's `scene`, carried as the lock
  //      beat's passes.scene; else the sequence id)
  scene: string;
  /** the scene's first frame, on the same clock as s/e (segment frames). The host hands a layout f - sceneS */
  sceneS: number;
  /** Ep2: the beat plan's picture note(s) for this shot (eggs, Ep1 payoffs, constraints), " / " between beats */
  picture?: string;
}
export interface PxRail { text: string; s: number; e: number; shot: string }
export interface PxSeq { id: string; chapter: string; title: string; place: string; time: string; s: number; e: number; cue: string; side: string }
export interface PxSub { s: number; e: number; hold_to: number; who: string; shown: string; text: string; kind: string; mode: string; id: string; os: boolean }
/** Ep2: a scene = a run of consecutive shots with the same scene id: [s, e) segment frames */
export interface PxScene { id: string; s: number; e: number; shots: string[] }
export interface PxSoundMark { kind: string; n: number; name: string; s: number; e: number | null; shot: string }

export interface SegLock {
  seg: string;
  label: string; // 'ACT ONE'
  fps: number;
  frames: number;
  epIn: number; // episode frame of segment frame 0
  /** the temp track: its frame offsetFrames is segment frame 0 */
  mix: {path: string; offsetFrames: number; frames: number} | null;
  source: {timeline: string; takes: string[]; plan: string | null};
  cast: Record<string, {name?: string; role?: string}>;
  refs: Record<string, number | number[] | null>;
  soundMarks: PxSoundMark[];
  seqs: PxSeq[];
  rails: PxRail[];
  subs: PxSub[];
  v4Ids: Record<string, string>;
  shots: PxShot[];
  /** Ep2: the scenes in order (they tile the segment) */
  scenes: PxScene[];
}
