// MR. MAS · Ep2's outro: the Orb's verdict (outro B), in Ep1's format, with Ep2's credits. The clock, the words and
// the cast. Ep1's outro (studio/src/dev/outro/b/, read, never edited) is the model: the cut to black, the Orb's scan
// leaving the credits behind it as type, the two credit chips on the knee's flat line, the verdict lighting the lens.
// Ep2 books no stinger (proposal D-17), so bars 1-3 are Ep1's plain week; the brief's credits then add a second page in
// the same grammar: on 4.1 the toast clears, the Orb scans again, and the scan leaves the voice cast behind it (every
// speaking role by its library voice) and the tools, whose two chips land on 5.1 and 5.2 the way the credit chips land
// on 2.1 and 2.2. The cut is on 6.4, as Ep1's was on 4.4: 345 frames, then 15 of black while the fifth releases
// (15.0 s, the top of the showrunner's 6-15 s, still half the intro).
//
// 96 BPM: 15 frames a beat, 60 a bar. Outro frames are o0..; the file starts at o0 (the cut from the tag's hum to black).

export const BEAT = 15;
export const BAR = 60;
/** the last outro frame is o344; the cut is 6.4 (o345) */
export const OUT_F = 345;
/** black after the cut while the score's open fifth releases (0.625 s) */
export const TAIL = 15;
export const TOTAL = OUT_F + TAIL; // 360 f, 15.0 s

export const T = {
  // ---- page 1: Ep1's plain week, frame for frame (dev/outro/b/timeline.ts T)
  fade: [0, 3, 6, 9] as const, // 1.1 cut to black; the Orb steps up -3, -2, -1, lit
  header: 9, //        the toast's header posts the show and the file
  glint1: 12,
  iris: [15, 17, 19] as const, // 1.2 the iris swivels to the lens (servo)
  cone: [30, 54] as const, //     1.3-1.4 the scan
  glyph: [31, 52] as const,
  lines: [60, 75] as const, //    2.1, 2.2 the credit chips land around their type
  think: [90, 97, 105, 112] as const, // 2.3-2.4& the leap: the iris narrows one step per note
  verdict: 120, //     3.1 the verdict + the Orb's chime; the lens lights
  lamp: 120,
  score: 135, //       3.2 the score's verdict F5 -> C6
  idle: [150, 152, 154] as const, // 3.3 the lamp out, the iris back to its toast
  glint2: 165, //      3.4
  // ---- page 2 (Ep2): the cast
  turn: [180, 182, 184, 186] as const, // 4.1 page 1 steps down three held rungs on 2s, gone at o186
  head2: 186, //       the cast page's header chip posts
  cone2: [190, 214] as const, //  4.1+10 - 4.3+4 the second scan, top to bottom across the cast (25 frames, as the first)
  glyph2: [191, 212] as const,
  tools: [240, 255] as const, //  5.1, 5.2 the two tools chips land around their type
  glint3: 315, //      6.2
  out: 344, //         the last frame; the cut on 6.4 (o345)
};

// ================================================================== the words (edit here)
// The Orb's voice, as Ep1's: lowercase, `field: value`, ` · ` between fields. The shared 7-px face has a-z, 0-9 and
// `. , : ; ' " - / ( ) _ * + = ! ? $ · ✓` and the space; anything else draws blank (art.ts draws the em dash).
export const SHOW = 'mr. mas';
export const FILE = 'ep1.1_her.wav';
/** page 1's credit lines, Ep1's exactly: the model made it all ("by Opus 5.5"), the showrunner prompted it */
export const CREDITS = ['art · script · music · voices · edit: opus 5.5', 'prompt: jgon'];
/** the verdict on the viewer (proposal: the Orb outro, "viewer: verified: human"; no drift before Ep6) */
export const VERDICT = 'viewer: verified: human';
export const PAGE1 = [`${SHOW} · ${FILE}`, ...CREDITS];

/** page 2: the voice cast, every speaking role by the library voice that reads it (audio/ep02/cast-el.json, as the
 *  takes record them: audio/ep02/v1-el/ep02-v1/<seg>/lines-A.json). Library names are the voice's own name; two Ryans
 *  carry their library descriptor. Column A: Ep1's cast, carried over; column B: Ep2's new roles. */
export const CAST_HEAD = 'voices · role: library voice';
export const CAST_A: Array<[string, string]> = [
  ['mas', 'jeremy'], ['gerg', 'marcus'], ['nole', 'ryan (confident)'], ['rima', 'mia'], ['chatgtp', 'maya'],
  ['alyi', 'louis'], ['tasya', 'tyler kurk'], ['terb', 'ethan'], ['neleh', 'alexandra'], ['radnus', 'dylan malc'],
  ['staffer', 'avery'], ['mario', 'am_liam (kokoro)'],
];
export const CAST_B: Array<[string, string]> = [
  ['selbeep', 'the pharaoh 3'], ['xel', 'alex wright'], ['the humanist', 'luis'], ['demo engineer', 'ryan (articulate)'],
  ['voices 1-2', 'alexander, brad'], ['voices 3-4', 'quinn, sarah eve'], ['staffer 2', 'jessi'], ['tv reporter', 'katherine'],
  ['bukaj', 'scypher'], ['ekiel', 'dexter'], ['the forecaster', 'jack john'], ['the driver', 'jerry b.'],
  ['haras', 'hannah'], ['the crowd', 'ten library voices'],
];
/** the tools, two chips: the harness and the model's hands (picture, voices, the 3D shot, the video insert) */
export const TOOLS = ['tools: claude code · remotion · elevenlabs · kokoro-82m', 'blender · veo 3.1 fast via runway · ffmpeg'];
