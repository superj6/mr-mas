// MR. MAS · Ep3's outro: the Orb's verdict (outro B), in Ep1's format, with Ep3's credits. The clock, the words and
// the cast. Ep1's outro (studio/src/dev/outro/b/, read, never edited) is the model: the cut to black, the Orb's scan
// leaving the credits behind it as type, the two credit chips on the knee's flat line, the verdict lighting the lens.
// Ep3 books no stinger (proposal D-17), so bars 1-3 are Ep1's plain week; the brief's credits then add a second page in
// the same grammar: on 4.1 the toast clears, the Orb scans again, and the scan leaves the voice cast behind it (every
// speaking role by its library voice), held for reading while the celesta remembers the flat line (5.1). The cut is on
// 6.4, as Ep1's was on 4.4: 345 frames, then 15 of black while the fifth releases (15.0 s, the top of the showrunner's
// 6-15 s, still half the intro).
// The fixes pass (2026-10-10): no product is named on screen (OUTRO-PROPOSALS §1.1, "On screen it names no product"):
// the tools chips that landed on 5.1 and 5.2 are gone, and the named tools go in the release description (LEARNINGS M4);
// the verdict is Ep1's own wording, `viewer: human ✓`.
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
  // ---- page 2 (Ep3): the cast
  turn: [180, 182, 184, 186] as const, // 4.1 page 1 steps down three held rungs on 2s, gone at o186
  head2: 186, //       the cast page's header chip posts
  cone2: [190, 214] as const, //  4.1+10 - 4.3+4 the second scan, top to bottom across the cast (25 frames, as the first)
  glyph2: [191, 212] as const,
  //                   5.1 the cast page held for reading (the celesta's flat line, no chip lands: no tools on screen)
  glint3: 315, //      6.2
  out: 344, //         the last frame; the cut on 6.4 (o345)
};

// ================================================================== the words (edit here)
// The Orb's voice, as Ep1's: lowercase, `field: value`, ` · ` between fields. The shared 7-px face has a-z, 0-9 and
// `. , : ; ' " - / ( ) _ * + = ! ? $ · ✓` and the space; anything else draws blank (art.ts draws the em dash).
export const SHOW = 'mr. mas';
export const FILE = 'ep1.2_strawberry.jpg';
/** Episode 3's author; prior Opus 5.5 assets are credited in the release notes and mux metadata. */
export const CREDITS = ['art · script · music · voices · edit: codex', 'prompt: jgon'];
/** the verdict on the viewer: Ep1's aired wording (studio/src/dev/outro/b/timeline.ts EPS[1]); the ladder first drifts
 *  in Ep6 (`viewer: human (probably)`) */
export const VERDICT = 'viewer: human ✓';
export const PAGE1 = [`${SHOW} · ${FILE}`, ...CREDITS];

/** page 2: the voice cast, every speaking role by the library voice that reads it (audio/ep03/cast-el.json, as the
 *  takes record them: audio/ep03/v1-el/ep03-v1/<seg>/lines-A.json). Library names are the voice's own name; two Ryans
 *  carry their library descriptor. Column A: Ep1's cast, carried over; column B: Ep3's new roles. No product or vendor
 *  is named here (Mario's am_liam is Kokoro-82M's stock voice: the description says so). */
export const CAST_HEAD = 'voices · role: voice';
export const CAST_A: Array<[string, string]> = [
  [
    "corkboard guy",
    "liam + puck"
  ],
  [
    "second truther",
    "michael"
  ],
  [
    "cook",
    "river"
  ],
  [
    "mas",
    "michael"
  ],
  [
    "gerg",
    "puck"
  ],
  [
    "maon",
    "onyx"
  ],
  [
    "announcer",
    "sarah + puck"
  ],
  [
    "chatgtp",
    "jessica"
  ],
  [
    "adelina",
    "bella"
  ],
  [
    "mario",
    "liam"
  ],
  [
    "sucram",
    "liam + puck"
  ],
  [
    "staffer",
    "nova"
  ]
];
export const CAST_B: Array<[string, string]> = [
  [
    "installer",
    "river"
  ],
  [
    "rima",
    "heart"
  ],
  [
    "reneiw",
    "aoede"
  ],
  [
    "moswen",
    "fenrir"
  ],
  [
    "auhsoj",
    "puck"
  ],
  [
    "investor",
    "bella"
  ],
  [
    "lifeguard",
    "michael"
  ],
  [
    "lunchmas",
    "echo"
  ],
  [
    "customer",
    "nova"
  ],
  [
    "nole",
    "fenrir"
  ],
  [
    "mit kooc",
    "onyx + liam"
  ],
  [
    "rumpt",
    "onyx"
  ]
];
// The tools are not on screen (the fixes pass, 2026-10-10): the release description names them (LEARNINGS M4;
// production/v1/assembly.md §8.2): Claude Code, Remotion, ElevenLabs, Kokoro-82M, Blender, Veo 3.1 Fast via Runway, FFmpeg.
