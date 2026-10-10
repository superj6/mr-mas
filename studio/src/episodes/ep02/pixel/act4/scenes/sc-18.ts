// MR. MAS — Ep2 v1 · act4 · scene 18: PRESENT (MAY 28, 2024; Misanthropic's lighthouse | the NopeAI boardroom). 15
// shots, 2280 f on the v1 EL lock. The shots pass, 2026-10-09; the record is shots-act4.md. The staging is proposal.md
// sc 18 / script-v1 (its script review: Terb reads the membership like a roll call; V.O. 11 after the table's held
// breath; the board's card keeps its honorific):
//   ARRIVE   18.01 full frame on the lighthouse, the beacon already turning (2 s before anything moves on): Ekiel
//            climbs the stair of bound drafts with sc 14's box; Adelina at the top raises a lanyard (page 212)
//            18.02 the beam sweeps the frame -> across the boardroom's window, the same morning; the TV already playing
//   TRUTH    18.03-18.05 the TV full frame: a plain podcast player, her words captioned as she says them; the board's
//            same-day reply under her last caption (the two side by side) · 18.06 Mas holds still; Terb clicks it off
//   RHYME    18.07 the lanyard held out (SAFETY COMMITTEE) -> the split: RIGHT Adelina drops hers over Ekiel, LEFT Mas
//            takes his from Terb's hand and puts it on himself, on the same beat
//   TURN     18.08-18.10 LEFT: the first task, the roll call; every face to Mas; "present."; "also present."; Mada's two
//            words; the held breath; V.O. 11 (typed by the host, lips still)
//   COUNTER  18.11-18.14 RIGHT: Mario's four pages, the highlighted line (an insert), the CLOD glint, the brief
//            document down the stairwell, "It's that we might win." (the clipping on his desk, an egg)
//   OUT      18.15 LEFT: the reminder on his phone, ELPPA · KEYNOTE · JUN 10; the left pane widens to the frame as the
//            split ends, the phone where the lobby's wall screen will be; he turns it over
// No V.O. through the podcast, the card or his face (W8). The talking pane at full palette, the waiting one a rung down.
import {defineScene, layouts, mouth, mk, lineAt, lipTrack} from '../../kit';
import type {PxShot} from '../../kit';
import {Buf, clamp} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {day18, podTV, masHold, terbRemote, lanyardInsert, terbPane, masPane, minutesInsert, phonePane, splitAt, PHONE18, SXL_TABLE} from '../sets/board';
import {lightW, stairPane, mario2S, pagesInsert, clodClose, marioMCU, scrollDrop, ekielSquint, marioMouth, SXR, CLIMB} from '../sets/light';

const L = layouts();
const W = 480;
const frame = () => new Buf(W, 270, PAL.N0);
/** her voice's loudness at k (the take's own viseme track: speech or a pause) */
const lvlAt = (sh: PxShot, k: number) => {
  const l = lineAt(sh, k, 'NELEH');
  if (!l) return 0.25;
  const t = lipTrack(l)[k - l.s];
  return t && t !== 'rest' ? 1 : 0.4;
};
/** her caption as she says it: the line's own words up to k (whole words, the text's punctuation), from word `from` */
const capAt = (sh: PxShot, k: number, id: string, from = 0, pre = '') => {
  const l = sh.lines.find((x) => x.id === id);
  if (!l) return '';
  const toks = l.text.replace(/…/g, '...').split(/\s+/);
  let n = 0;
  for (let i = 0; i < l.words.length; i++) if (k - l.s >= l.words[i][1] - 1) n = i + 1;
  return pre + toks.slice(from, Math.max(from, n)).join(' ');
};
const words = (sh: PxShot, id: string) => sh.lines.find((x) => x.id === id)!;

// ------------------------------------------------------------------ 18.01 ARRIVE: the lighthouse
L.add('18.01', {
  st: 'act4/sets/light lightW ([W] the lighthouse of stacked essays (rooms/lighthouse + art/sets/committee lighthouse18), the beacon already turning; EKIEL (art/cast/ekiel room, climbing) climbs the stair of bound drafts with sc 14\'s box, a step on each footstep; ADELINA at the top (cast/adelina, flipped) raises her lanyard (art lanyard, printed on page 212); MARIO at his desk)',
  marks: {s1: ['snd', 'footstep_soft_1', 1, 0], s2: ['snd', 'footstep_soft_2', 1, 0]},
  draw: (fb, k, sh, f) => {
    const s1 = mk(sh, 's1', 57), s2 = mk(sh, 's2', 76);
    const i = k < s1 ? 0 : k < s2 ? 1 : 2;
    lightW(fb, f, {step: CLIMB[i], stride: (i % 2) as 0 | 1, adel: k >= s2 + 20 ? 'raise' : 'wait'});
  },
});
// ------------------------------------------------------------------ 18.02 the beam -> the boardroom's window
L.add('18.02', {
  st: 'act4/sets/light lightW (the beam sweeping the frame toward its right edge) → act4/sets/board day18 ([W] the boardroom by day on Act One\'s morning camera, the committee at the table (TERB at the head, MAS at A, MADA, the director), the banner, the TV on the back wall already playing the podcast; the beam crossing the window left to right)',
  draw: (fb, k, sh, f) => {
    if (k < 14) { lightW(fb, f, {step: CLIMB[2], adel: 'raise', sweep: 140 + Math.floor(k / 2) * 2 * 30}); return; }
    day18(fb, f, {tv: 0.45, beam: Math.min(1, Math.floor((k - 14) / 2) * 2 / 32)});
    void sh;
  },
});
// ------------------------------------------------------------------ 18.03-18.05 the TV full frame
L.add('18.03', {
  st: 'act4/sets/board podTV ([SCR] the boardroom TV full frame: a plain podcast player (no title, no logo), the waveform walking with her voice; NELEH\'s words captioned LARGE in the display face as she says them, word by word from the take\'s words; the first sentence holds while the second builds under it)',
  draw: (fb, k, sh, f) => {
    const l = words(sh, 'e2-a4-0001');
    const split = l.s + l.words[15][1];
    const cap = k < split ? capAt(sh, k, 'e2-a4-0001', 0) : [capAt(sh, 9999, 'e2-a4-0001', 0).split(' ').slice(0, 15).join(' '), capAt(sh, k, 'e2-a4-0001', 15)];
    podTV(fb, f, {cap, lvl: lvlAt(sh, k)});
  },
});
L.add('18.04', {
  st: 'act4/sets/board podTV (her second claim, captioned as she says it, cropped before its next clause)',
  draw: (fb, k, sh, f) => podTV(fb, f, {cap: capAt(sh, k, 'e2-a4-0002', 0, '...').replace(/\.\.\.$/, '') + (k >= words(sh, 'e2-a4-0002').e ? '...' : ''), lvl: lvlAt(sh, k)}),
});
L.add('18.05', {
  st: 'act4/sets/board podTV (her last caption held; under it the board\'s same-day reply in its own statement card, its first sentence: "We are disappointed that Ms. NELEH continues to revisit these issues." — TERB, CHAIR; the two side by side)',
  draw: (fb, k, sh, f) => {
    podTV(fb, f, {cap: '...MAS didn\'t inform the board that he owned the NOPEAI Startup Fund...', lvl: 0.25, card: k - 4});
    void sh;
  },
});
// ------------------------------------------------------------------ 18.06 his face; the TV off
L.add('18.06', {
  st: 'act4/sets/board masHold → terbRemote ([MCU] Mas at the table, holding still (Ep1\'s approved CU face, the window\'s day keyed one step), 2 s; [OTS] over his shoulder onto TERB at the head (his approved portrait, helmet off), the remote in his near hand (art/cast/hands2 grip), the TV\'s cool light on his near cheek until he clicks it off; "First item." lip-synced)',
  face: {TERB: 'lip'},
  marks: {off: ['snd', 'tv_click_off', 1, 0], line: ['on', 'e2-a4-0003', 0]},
  draw: (fb, k, sh, f) => {
    const off = mk(sh, 'off', 55);
    if (k < 46) { masHold(fb, f); return; }
    terbRemote(fb, f, {mouth: mouth(sh, k, 'TERB'), off: k >= off, aim: k >= off - 4 ? 1 : 0});
  },
});
// ------------------------------------------------------------------ 18.07 the lanyard; the split
L.add('18.07', {
  st: 'act4/sets/board lanyardInsert → splitAt(day18 | light stairPane) ([INSERT] Terb\'s hand holding out the lanyard by its strap, its card legible: SAFETY COMMITTEE; then the split, two 238 x 203 panes and a 4 px divider: LEFT the boardroom (Terb\'s arm out across the table\'s corner with it; Mas takes it from his hand and puts it over his head, three held drawings), RIGHT the lighthouse (Adelina drops hers over Ekiel two steps below her, its card printed on page 212), both landing on the same beat)',
  marks: {drop: ['snd', 'lanyard_drop', 1, 0]},
  draw: (fb, k, sh, f) => {
    const d = mk(sh, 'drop', 42);
    if (k < d - 12) { lanyardInsert(fb, f, {sway: (Math.floor(k / 6) % 2)}); return; }
    const left = frame(), right = frame();
    day18(left, f, {tv: 'off', lanyard: k < d - 8 ? 1 : k < d - 4 ? 2 : k < d ? 3 : 4});
    stairPane(right, f, {drop: k < d - 6 ? 0 : k < d + 1 ? 1 : 2});
    splitAt(fb, left, right, {sxL: SXL_TABLE, sxR: SXR});
  },
});
// ------------------------------------------------------------------ 18.08-18.10 LEFT: the committee
const rightWait = (f: number, write = 0) => { const r = frame(); mario2S(r, f, {mario: {mouth: 0}, write}); return r; };
L.add('18.08', {
  st: 'act4/sets/board splitAt(terbPane | light mario2S) (LEFT pane: TERB reading the first task, then the members like a roll call, eyes on his sheet (his approved portrait, lip-synced); RIGHT pane a rung down: Mario writing, Ekiel in his new lanyard)',
  face: {TERB: 'lip'},
  draw: (fb, k, sh, f) => {
    const left = frame();
    terbPane(left, f, {mouth: mouth(sh, k, 'TERB'), read: true});
    splitAt(fb, left, rightWait(f, k / 6), {sxL: 0, sxR: SXR, down: 'right'});
  },
});
L.add('18.09', {
  st: 'act4/sets/board splitAt(day18 → masPane | mario2S) (LEFT: the table at room scale: every face at the table turns to Mas in two held steps (the director and Mada round to him, Terb looking up from his sheet), the table\'s two beats; then his MCU (his approved portrait in the window\'s day, keyed one step, turned to Terb, the lanyard\'s card on his chest): "present." lip-synced; Mada\'s pen heard on the minutes)',
  face: {MAS: 'lip'},
  marks: {line: ['on', 'e2-a4-0006', 0]},
  draw: (fb, k, sh, f) => {
    const on = mk(sh, 'line', 30), cut = on - 8, left = frame();
    if (k < cut) { day18(left, f, {tv: 'off', lanyard: 4, look: k < 5 ? 'fwd' : 'mas'}); splitAt(fb, left, rightWait(f, 8 + k / 6), {sxL: SXL_TABLE, sxR: SXR, down: 'right'}); return; }
    masPane(left, f, {mouth: mouth(sh, k, 'MAS') as never});
    splitAt(fb, left, rightWait(f, 8 + k / 6), {sxL: 0, sxR: SXR, down: 'right'});
  },
});
L.add('18.10', {
  st: 'act4/sets/board splitAt(minutesInsert → terbPane → day18 → masPane → minutesInsert → masPane | mario2S) (LEFT: Mada\'s minutes, his pen finishing the first word (Terb\'s voice already established); TERB, brisk, the recommendations to the full board, which is…; the table turns to Mas again; "also present." lip-synced; Mada writes the second word; Mas\'s still face, the table holding its breath; then V.O. 11 typed by the host in his cyan, his lips still)',
  face: {TERB: 'lip', MAS: 'lip'},
  marks: {pen: ['snd', 'pen_scribble_short', 1, 0], also: ['on', 'e2-a4-0008', 0], alsoE: ['end', 'e2-a4-0008', 0]},
  draw: (fb, k, sh, f) => {
    const also = mk(sh, 'also', 156), alsoE = mk(sh, 'alsoE', 182), pen = mk(sh, 'pen', 188), left = frame();
    let sx = 0;
    if (k < 18) minutesInsert(left, f, {w: 1 + clamp(k / 8, 0, 1)});
    else if (k < also - 14) terbPane(left, f, {mouth: mouth(sh, k, 'TERB'), read: k < also - 28});
    else if (k < also - 3) { day18(left, f, {tv: 'off', lanyard: 4, look: k < also - 9 ? 'fwd' : 'mas'}); sx = SXL_TABLE; }
    else if (k >= alsoE + 3 && k < pen + 12) minutesInsert(left, f, {w: 2 + clamp((k - pen + 2) / 6, 0, 2)});
    else masPane(left, f, {mouth: mouth(sh, k, 'MAS') as never});
    splitAt(fb, left, rightWait(f, 16 + k / 6), {sxL: sx, sxR: SXR, down: 'right'});
  },
});
// ------------------------------------------------------------------ 18.11-18.14 RIGHT: the recruit
const leftWait = (f: number) => { const l = frame(); masPane(l, f, {}); return l; };
L.add('18.11', {
  st: 'act4/sets/light splitAt(tablePane | mario2S) (RIGHT pane: MARIO at his desk by the lamp (his conversation portrait, turned to Ekiel), writing without looking up from his pages, his pen moving; EKIEL in front of him in his new lanyard, squinting (art/cast/ekiel bust); both lip-synced; LEFT pane a rung down: Mas at the table, still)',
  face: {MARIO: 'lip', EKIEL: 'lip'},
  marks: {ek: ['on', 'e2-a4-0010', 0], ekEnd: ['end', 'e2-a4-0010', 0]},
  draw: (fb, k, sh, f) => {
    const ek0 = mk(sh, 'ek', 104), ek1 = mk(sh, 'ekEnd', 151), right = frame();
    mario2S(right, f, {mario: {mouth: marioMouth(mouth(sh, k, 'MARIO'))}, ekiel: {mouth: mouth(sh, k, 'EKIEL'), expr: k >= ek0 - 4 && k < ek1 + 10 ? 'worry' : 'squint'}, write: k < ek0 - 6 ? k / 5 : undefined});
    splitAt(fb, leftWait(f), right, {sxL: 0, sxR: SXR, down: 'left'});
  },
});
L.add('18.12', {
  st: 'act4/sets/light pagesInsert ([ECU] insert, full frame: Mario\'s four pages fanned on the desk, one line highlighted in yellow, Ekiel\'s own: "Building smarter-than-human machines is an inherently dangerous endeavor." (legible at 1080p); his ink notes in the margin; on "inherently" his pen runs the underline under the word (his hand from the lower right, the ink-blue fleece cuff); "We agree. I underlined \'inherently.\'" O.S., his voice established)',
  marks: {inh: ['w', 'e2-a4-0012', 'inherently', 0]},
  draw: (fb, k, sh, f) => {
    const inh = mk(sh, 'inh', 150);
    pagesInsert(fb, f, {under: k < inh - 2 ? 0 : clamp(Math.floor((k - inh + 2) / 3) * 3 / 18, 0, 1)});
  },
});
L.add('18.13', {
  st: 'act4/sets/light splitAt(tablePane | clodClose → marioMCU → scrollDrop → ekielSquint → marioMCU) (RIGHT pane: the glass case of CLOD boxes, the beacon glinting across the bottom row box by box, the last box\'s art a red suspension bridge over a bay (never named); MARIO, finger rising: "There\'s a brief document."; the scroll drops the whole stairwell, the pane panning with it down the spiral past every landing to the bottom, and back up; EKIEL squinting after it: "That\'s the brief one?"; MARIO sets his pen down for the first time: "That\'s the brief one. It only has the one concern."; all lip-synced)',
  face: {MARIO: 'lip', EKIEL: 'lip'},
  marks: {g1: ['snd', 'glint_tick', 1, 0], g2: ['snd', 'glint_tick', 2, 0], g3: ['snd', 'glint_tick', 3, 0], drop: ['snd', 'scroll_unroll_fall', 1, 0], m1: ['on', 'e2-a4-0013', 0], ek: ['on', 'e2-a4-0014', 0], m2: ['on', 'e2-a4-0015', 0]},
  draw: (fb, k, sh, f) => {
    const g1 = mk(sh, 'g1', 7), g2 = mk(sh, 'g2', 18), g3 = mk(sh, 'g3', 30), drop = mk(sh, 'drop', 81), m1 = mk(sh, 'm1', 37), ek = mk(sh, 'ek', 139), m2 = mk(sh, 'm2', 169);
    const right = frame();
    if (k < m1 - 2) clodClose(right, f, {glint: k >= g3 ? 5 : k >= g2 ? 4 : k >= g1 ? 3 : -1});
    else if (k < drop) marioMCU(right, f, {mouth: marioMouth(mouth(sh, k, 'MARIO')), finger: k < m1 + 2 ? 0 : k < m1 + 6 ? 1 : 2, pen: 'up'});
    else if (k < ek - 10) {
      const t = k - drop, edge = Math.min(516, Math.floor(t / 2) * 2 * 18);
      const down = clamp((edge - 90) / (560 - 203), 0, 1), back = t > 38 ? clamp(Math.floor((t - 38) / 4) * 4 / 14, 0, 1) : 0;
      scrollDrop(right, f, {cam: down * (1 - back), edge});
    }
    else if (k < m2 - 3) ekielSquint(right, f, {mouth: mouth(sh, k, 'EKIEL'), expr: k >= ek - 2 ? 'worry' : 'squint'});
    else marioMCU(right, f, {mouth: marioMouth(mouth(sh, k, 'MARIO')), finger: 1, pen: 'down', brow: 1});
    splitAt(fb, leftWait(f), right, {sxL: 0, sxR: SXR, down: 'left'});
  },
});
L.add('18.14', {
  st: 'act4/sets/light splitAt(tablePane | marioMCU) (RIGHT pane, MCU: Mario, finger up: "It\'s that we might win." lip-synced; by the lamp the op-ed clipping, byline NELEH & THE QUIET VOTE (an egg, never read out); LEFT pane holding beside it, a rung down, Mas in it)',
  face: {MARIO: 'lip'},
  draw: (fb, k, sh, f) => {
    const right = frame();
    marioMCU(right, f, {mouth: marioMouth(mouth(sh, k, 'MARIO')), finger: 2, pen: 'down', brow: 1});
    splitAt(fb, leftWait(f), right, {sxL: 0, sxR: SXR, down: 'left'});
  },
});
// ------------------------------------------------------------------ 18.15 OUT: the reminder
L.add('18.15', {
  st: 'act4/sets/board phonePane ([ECU] LEFT pane: his phone face up on the table beside the minutes, dark; it lights with the reminder ELPPA · KEYNOTE · JUN 10 (sc 8\'s invite come due), held for its read; then the left pane widens to fill the frame in held steps (the split ends, the lighthouse pushed out) with the phone arriving where the lobby\'s wall screen is in 19.01 (the matched object); his hand turns it over, face down)',
  marks: {pop: ['snd', 'ui_toast_pop', 1, 0], turn: ['snd', 'phone_turn_over', 1, 0]},
  draw: (fb, k, sh, f) => {
    const pop = mk(sh, 'pop', 9), turn = mk(sh, 'turn', 56), slide0 = turn - 12;
    const left = frame();
    phonePane(left, f, {lit: k >= pop ? k - pop + 1 : 0, turn: k < turn ? 0 : k < turn + 6 ? 1 : 2});
    // the pane widens in three held steps of four frames, panning so the phone lands where the wall screen will be
    const u = k < slide0 ? 0 : Math.min(1, (Math.floor((k - slide0) / 4) + 1) / 3);
    const lw = 238 + (W - 238) * u, sxL = (PHONE18.x - 116) * (1 - u);
    splitAt(fb, left, rightWait(f), {lw, sxL, sxR: SXR, down: 'right'});
  },
});

export const SCENE = defineScene({scene: '18', layouts: L.all});
