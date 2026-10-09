// MR. MAS — Ep2 v1 · act1 · scene 6: CHAPTER 1 OF 6 (MAR 18, 2024; XEL's studio). 11 shots, 1944 f on the v1 EL lock.
// The shots pass, 2026-10-09; the record is shots-act1.md. The staging is proposal.md sc 6 and script-v1.md sc 6:
//   ARRIVE   6.01 enter late on the locked two-shot, the sting ending (1.4 s): the curtain, two chairs, one mic, all
//            inside the podcast player's chrome, CH. 1 OF 6 and REC; the 4B card's mic icon is where this mic stands
//   THE RULE the mic hops one size on each of XEL's long pauses, and never while Mas talks; on each hop the chapter
//            counter ticks (2, 3, 4, 5); the card freezes on XEL on the first hop
//   TURN     6.07 the one cut-in: Mas against the curtain, the relationship answer at his own pace (lip-synced, a face
//            light); 6.08 the mic fills the frame; 6.09 CH. 6 OF 6, REC out: "tell it once" took six chapters
//   AFTER    6.10 off the record: XEL leans to the giant mic, Mas pressed flat against the curtain; 6.11 the curtain
//            parts, the match into the building splitting open
import {defineScene, layouts, mouth, mk} from '../../kit';
import {Buf} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {freeze2, FREEZE_DARK, drawGagCard} from '../../../../ep01/pixel/act2/kit2';
import type {GagCard} from '../../../../ep01/pixel/act2/kit2';
import type {MasMouth} from '../../../../../shared/pixel/cast/mas';
import type {PxShot} from '../../kit';
import {meter, masMCU, chromeInsert} from '../sets/studio';
import type {MeterSt} from '../sets/studio';

const L = layouts();
/** the two faces lip-synced on their takes; XEL's face: the long question (focus) while he asks, listening otherwise */
const people = (sh: PxShot, k: number, mas: NonNullable<MeterSt['mas']> = {}, xel: NonNullable<MeterSt['xel']> = {}) => {
  const asking = sh.lines.some((l) => l.who === 'XEL' && k >= l.s - 4 && k < l.e + 4);
  return {mas: {mouth: mouth(sh, k, 'MAS') as MasMouth, look: 0 as const, ...mas}, xel: {mouth: mouth(sh, k, 'XEL'), expr: (asking ? 'focus' : 'neutral') as 'focus' | 'neutral', ...xel}};
};
/** a hop: the mic's size at k, given the size before it and the hop's mark */
const hop = (k: number, at: number, from: 1 | 2 | 3 | 4) => (k < at ? from : from + 1) as 1 | 2 | 3 | 4 | 5;

L.add('6.01', {
  st: 'act1/sets/studio meter (art/sets/studio SET-05 copied with its beats: the black curtain, two studio chairs, one mic at size 1 on its stand, inside the plain podcast player\'s chrome, CH. 1 OF 6 and REC lit); XEL screen-right (art/cast/xel seated) asks his first question, room-scale mouth; MAS screen-left (Ep1 mas-seated) with his glass, listening',
  face: {XEL: 'lip'},
  draw: (fb, k, sh, f) => { meter(fb, f, {mic: 1, ch: 1, rec: true, ...people(sh, k)}); },
});

const CARD_XEL: GagCard = {x: 160, y: 26, name: 'XEL', lines: ['ASKS THE LONG QUESTIONS.'], stat: ['EPISODE: 419'], accent: PAL.C7};
const KEEP = new Map<string, Uint8Array>();
L.add('6.02', {
  st: 'act1/sets/studio meter: XEL waits; the mic hops one size (1 -> 2), the counter ticks CH. 2 OF 6; on the hit the 2-TONE FREEZE (Ep1 act2/kit2 freeze2, the dark curve) with XEL kept in colour and the card XEL / ASKS THE LONG QUESTIONS. + EPISODE: 419 (kit2 drawGagCard), held to the cut',
  marks: {grow: ['snd', 'mic_grow_step', 1, 0], tick: ['snd', 'chapter_tick', 1, 0], hit: ['snd', 'freeze_hit_F', 1, 0]},
  draw: (fb, k, sh, f) => {
    const grow = mk(sh, 'grow', 12), tick = mk(sh, 'tick', 14), hit = mk(sh, 'hit', 19);
    const kk = Math.min(k, hit);
    const st: MeterSt = {mic: hop(kk, grow, 1), ch: kk >= tick ? 2 : 1, rec: true, mas: {mouth: 'rest'}, xel: {mouth: 'rest', expr: 'neutral'}};
    meter(fb, f - k + kk, st);
    if (k >= hit) {
      const key = `${st.mic}:${st.ch}`;
      let keep = KEEP.get(key);
      if (!keep) {
        const A = new Buf(480, 270, 0), B = new Buf(480, 270, 0);
        meter(A, f - k + kk, st); meter(B, f - k + kk, {...st, xel: null});
        keep = new Uint8Array(480 * 203);
        for (let i = 0; i < keep.length; i++) keep[i] = A.c[i] !== B.c[i] ? 1 : 0;
        KEEP.set(key, keep);
      }
      const km = keep;
      freeze2(fb, (x, y) => y < 203 && km[y * 480 + x] === 1, FREEZE_DARK);
      drawGagCard(fb, k - hit + 3, CARD_XEL);
    }
  },
});
L.add('6.03', {
  st: 'act1/sets/studio meter (mic at 2, CH. 2 OF 6): MAS answers in his own words, room-scale mouth; the mic doesn\'t move',
  face: {MAS: 'lip'},
  draw: (fb, k, sh, f) => { meter(fb, f, {mic: 2, ch: 2, rec: true, ...people(sh, k)}); },
});
L.add('6.04', {
  st: 'act1/sets/studio meter: XEL lets it sit; the mic hops (2 -> 3), the counter ticks CH. 3 OF 6; then he asks about Alyi, room-scale mouth',
  face: {XEL: 'lip'},
  marks: {grow: ['snd', 'mic_grow_step', 1, 0], tick: ['snd', 'chapter_tick', 1, 0]},
  draw: (fb, k, sh, f) => { const g = mk(sh, 'grow', 18), t = mk(sh, 'tick', 22); meter(fb, f, {mic: hop(k, g, 2), ch: k >= t ? 3 : 2, rec: true, ...people(sh, k)}); },
});
L.add('6.05', {
  st: 'act1/sets/studio meter (mic at 3, CH. 3 OF 6): the "no." ladder, quick; both room-scale mouths; Mas\'s small laugh under the last one (his smile after)',
  face: {MAS: 'lip', XEL: 'lip'},
  draw: (fb, k, sh, f) => {
    const last = sh.lines.filter((l) => l.who === 'MAS').pop();
    const smile = !!last && k >= last.e && k < last.e + 14;
    meter(fb, f, {mic: 3, ch: 3, rec: true, ...people(sh, k, smile ? {mouth: 'smile'} : {})});
  },
});
L.add('6.06', {
  st: 'act1/sets/studio meter: XEL pauses; the mic hops (3 -> 4), the counter ticks CH. 4 OF 6; then the real question, warm and careful, room-scale mouth, a lean toward Mas',
  face: {XEL: 'lip'},
  marks: {grow: ['snd', 'mic_grow_step', 1, 0], tick: ['snd', 'chapter_tick', 1, 0]},
  draw: (fb, k, sh, f) => { const g = mk(sh, 'grow', 18), t = mk(sh, 'tick', 22); meter(fb, f, {mic: hop(k, g, 3), ch: k >= t ? 4 : 3, rec: true, ...people(sh, k, {}, {lean: k > 140 ? 1 : 0, ...(k >= 47 ? {expr: 'smile' as const} : {})})}); },
});
L.add('6.07', {
  st: 'act1/sets/studio masMCU ([MCU] the one cut-in: MAS against the curtain, screen-left facing camera-right toward XEL, Ep1\'s approved portrait (warm, his three collars), lip-synced through the whole relationship answer, a face light one step; the mic never grows while he talks)',
  face: {MAS: 'lip'},
  draw: (fb, k, sh, f) => { masMCU(fb, f, {mouth: mouth(sh, k, 'MAS') as MasMouth, look: 0}); },
});
L.add('6.08', {
  st: 'act1/sets/studio meter: back to the meter frame, the mic exactly where it was (4); XEL\'s pause; the mic hops to size 5 and fills the frame, the counter ticks CH. 5 OF 6; on the creak Mas leans around it (his chair pushed toward the curtain)',
  marks: {grow: ['snd', 'mic_grow_step', 1, 0], tick: ['snd', 'chapter_tick', 1, 0], creak: ['snd', 'chair_creak', 1, 0]},
  draw: (fb, k, sh, f) => {
    const g = mk(sh, 'grow', 40), t = mk(sh, 'tick', 44), c = mk(sh, 'creak', 66);
    meter(fb, f, {mic: hop(k, g, 4), ch: k >= t ? 5 : 4, rec: true, squeeze: k >= c ? 1 : 0, mas: {mouth: 'rest', look: k >= g + 4 ? 1 : 0}, xel: {mouth: 'rest', expr: 'neutral', lean: k >= g ? 1 : 0}});
    void sh;
  },
});
L.add('6.09', {
  st: 'art/sets/studio chromeInsert ([INSERT] the player\'s chrome close: the counter ticks to CH. 6 OF 6, and the REC light goes out)',
  marks: {tick: ['snd', 'chapter_tick', 1, 0], off: ['snd', 'rec_light_off', 1, 0]},
  draw: (fb, k, sh, f) => { chromeInsert(fb, {ch: k >= mk(sh, 'tick', 7) ? 6 : 5, rec: k < mk(sh, 'off', 21)}); void f; },
});
L.add('6.10', {
  st: 'act1/sets/studio meter (CH. 6 OF 6, REC out): off the record; XEL leans toward the giant mic (his head behind it: his "Yes." seems to come from inside the mic); MAS pressed flat against the curtain by it; room-scale mouths',
  face: {XEL: 'lip', MAS: 'lip'},
  draw: (fb, k, sh, f) => { const yes = sh.lines.filter((l) => l.who === 'XEL').pop(); const inMic = !!yes && k >= yes.s - 6; meter(fb, f, {mic: 5, ch: 6, rec: false, squeeze: 2, ...people(sh, k, {}, {lean: inMic ? 3 : 2, expr: 'worry'})}); },
});
L.add('6.11', {
  st: 'act1/sets/studio meter: the curtain parts from the middle in held steps (the match: the curtain\'s two halves -> the building\'s two halves sliding apart in 7.01)',
  marks: {draw: ['snd', 'curtain_draw', 1, 0]},
  draw: (fb, k, sh, f) => { const d = mk(sh, 'draw', 3); const u = k < d ? 0 : Math.min(1, Math.floor((k - d) / 4) / 10); meter(fb, f, {mic: 5, ch: 6, rec: false, squeeze: 2, part: u, mas: {mouth: 'rest'}, xel: {mouth: 'rest', expr: 'worry', lean: 3}}); },
});

export const SCENE = defineScene({scene: '6', layouts: L.all});
