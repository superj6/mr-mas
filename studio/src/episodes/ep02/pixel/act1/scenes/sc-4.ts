// MR. MAS — Ep2 v1 · act1 · scene 4: THE EMAIL SÉANCE (MAR 5, 2024; the NopeAI boardroom, night; with Move 37 and
// F2.3). 36 shots, 4632 f on the v1 EL lock (lock-v1.md). The shots pass, 2026-10-09; the record is
// show/episodes/ep02/production/v1/shots-act1.md. The staging is proposal.md sc 4 and script-v1.md sc 4:
//   ARRIVE   4.01 the candle-lit table, the staffers' hands joined, the Orb over it: 1.0 s on the wide, then 1.5 s at his
//            end of the table, the post on his laptop (NOPEAI AND NOLE, its byline) legible: 2.5 s before his click
//   THE MOVE 4.02 his finger on the bare Publish, the click; every candle flares a step and the planchette moves by
//            itself; MAS's face while V.O. 1 types (lips still)
//   TURNS    the ghosts answer Nole (less open / Yup; OPEN -> NOPE; the cow; 0%); Move 37 (the stone, the knob wall:
//            the stream, its own boards, the freeze); V.O. 2 with ghost 3 in his eyeline; "You kept them." / "we keep
//            everything."; F2.3 by the glass and back by the glass
//   AFTER    Nole's candle at Mas's face, the sip; "See you in court."; his rocket's gust snuffs the table, his candle
//            stays in front of Mas; Mas blows it out: 1.5 s of dark
// Every frame below is the shot's own k; `f` is the frame inside the scene (the per-scene cache). Marks come from the
// lock's words and sounds, with the planned frame as a fallback.
import {defineScene, layouts, mouth, roomMouth, room3Mouth, mk, silentMouth} from '../../kit';
import type {PxShot, PxText} from '../../kit';
import {drawPlate} from '../../kit';
import {PAL} from '../../../../../shared/pixel/palette';
import type {MasMouth} from '../../../../../shared/pixel/cast/mas';
import {move37} from '../../art/sets/office2018';
import {drawGhost, drawGhostNole} from '../../art/sets/seance';
import {layer, pt as pt0, pw as pw0} from '../../art/kit';
import type {Buf} from '../../../../../shared/pixel/px';
import {Buf as BufC} from '../../../../../shared/pixel/px';
import {
  room, ghost1, ghostNole16, deskPOV, publishECU, masLow, boardHigh, hpos, noleOTS, noleMCU, gergStaffer, gergMCU,
  stafferMCU, noles2S, glassECU, masReverse, masBlow, letterAt, S4, NEAR_NOLE,
} from '../sets/seance';
import type {Room4} from '../sets/seance';
import {office18, arenaInsert, alyiLooksBack, sweepEdge} from '../sets/f23';
import {glide, stepOf, noleMouth, TR, RH, W} from '../sets/common';

const L = layouts();
const on2 = (k: number) => k - (k & 1);
/** Mas's lip-synced mouth (his portrait has the same six) */
const masM = (sh: PxShot, k: number) => mouth(sh, k, 'MAS') as MasMouth;
/** Nole's portrait mouth on his line (0..4) */
const noleM = (sh: PxShot, k: number, who = 'NOLE') => noleMouth(mouth(sh, k, who));
/** the plate on Nole's entrance (the lock's text, typed on as the pipeline's plate) */
const plateText = (sh: PxShot, kind = 'plate'): PxText | null => sh.texts.find((t) => t.kind === kind) ?? null;
/** a ghost layer over the frame */
const over = (b: Buf, draw: (t: Buf) => void) => { const t = layer(W, 270); draw(t); for (let i = 0; i < W * RH; i++) if (t.c[i] !== TR) b.c[i] = t.c[i]; };
/** the room's state the wides share (the séance as it stands before Nole) */
const base = (f: number, extra: Partial<Room4> = {}): Room4 => ({f, planchette: letterAt('A'), ...extra});
/** the planchette's place on the board through the scene (wide coords): A until the reply, >>> after it */
const P_REPLY = letterAt('>>>');

// ------------------------------------------------------------------ 4.01 ARRIVE: the table, then his end of it
L.add('4.01', {
  st: 'act1/sets/seance room (Ep1 rooms/boardroom at night, re-lit by six candles: art/sets/seance\'s board, candles and ghosts; MAS seated at the head, seat L, his laptop; the EMPTY CHAIR at seat A; GERG at B typing, a hand on the planchette; three STAFFERS at C D E holding hands; the Orb as the chandelier) for 1.0 s, then deskPOV: his laptop big at desk height, the post NOPEAI AND NOLE with its byline row … · ALYI · … · MAS legible, the candle-lit table beyond',
  draw: (fb, k, sh, f) => {
    if (k < 24) { room(fb, base(f, {mas: {head: 'down'}})); return; }
    deskPOV(fb, f);
  },
});

// ------------------------------------------------------------------ 4.02 the click; V.O. 1
L.add('4.02', {
  st: 'act1/sets/seance publishECU ([ECU] the editor close, the title and byline over the bare Publish, his index finger over it from frame right, no cursor, no hover; the click) → room (every candle flared a step, the planchette sliding by itself) under the rail → masLow ([MCU] Ep1\'s approved portrait faced to the table, candle-lit, his laptop\'s light from below; lips still while V.O. 1 types)',
  marks: {click: ['snd', 'post_click', 1, 0], flare: ['snd', 'candle_flare', 1, 0], glide: ['snd', 'planchette_glide', 1, 0]},
  draw: (fb, k, sh, f) => {
    const click = mk(sh, 'click', 9), flare = mk(sh, 'flare', 12), gl = mk(sh, 'glide', 24);
    if (k < flare) { publishECU(fb, f, {press: k >= click && k < click + 3}); return; }
    if (k < 64) {
      const fl = (k < flare + 14 ? 1 : 0) as 0 | 1;
      const a = letterAt('A'), c = letterAt('C');
      const px = glide(k, gl, gl + 14, a[0], c[0]);
      room(fb, base(f, {flare: fl, planchette: [px, a[1]], mas: {head: k < gl + 8 ? 'down' : 'host'}, staffLook: k >= gl + 4 && k < gl + 20 ? 0 : 0}));
      return;
    }
    masLow(fb, {f, mouth: 'rest', look: k < 150 ? 0 : 1});
  },
});

// ------------------------------------------------------------------ 4.03 "is there anyone here… from 2016."
L.add('4.03', {
  st: 'act1/sets/seance masLow ([LOW·DESK] MAS reading, running it like a procedure; lip-synced) → boardHigh ([HIGH] the board from above: the plain brass-rimmed planchette slides to >>> and the >>> glows on the inbox chime)',
  face: {MAS: 'lip'},
  marks: {glide: ['snd', 'planchette_glide', 1, 0], chime: ['snd', 'inbox_chime_low', 1, 0]},
  draw: (fb, k, sh, f) => {
    const gl = mk(sh, 'glide', 86), ch = mk(sh, 'chime', 93);
    if (k < gl) { masLow(fb, {f, mouth: masM(sh, k), look: 1}); return; }
    const a = hpos('C'), b = hpos('>>>');
    boardHigh(fb, {f, at: [glide(k, gl, gl + 6, a[0], b[0]), glide(k, gl, gl + 6, a[1], b[1])], chime: k >= ch && k < ch + 14});
  },
});

// ------------------------------------------------------------------ 4.04 ghost 1 rises; Yup
L.add('4.04', {
  st: 'act1/sets/seance room with ghost 1 (art/sets/seance drawGhost: an email thread of translucent reply chevrons in the 2.G spirit-photo screen) rising out of the board, its header FROM: ALYI · JAN 2016 and its words "…IT WILL MAKE SENSE TO START BEING LESS OPEN." held to read; beneath it the 2016 GHOST-NOLE unfurls (drawGhostNole), RE: · 2016 / "YUP.", his room-scale mouth on Yup; Mas looks up at it',
  face: {'GHOST-NOLE': 'room'},
  draw: (fb, k, sh, f) => {
    const rise = Math.min(1, on2(Math.max(0, k - 2)) / 10);
    const g2 = Math.min(1, on2(Math.max(0, k - 40)) / 16);
    room(fb, base(f, {planchette: P_REPLY, mas: {head: 'host'}, staffLook: k > 20 && k < 60 ? 2 : 0, over: (b) => { ghost1(b, rise); ghostNole16(b, g2, room3Mouth(sh, k, 'GHOST-NOLE')); }}));
  },
});

// ------------------------------------------------------------------ 4.05 the empty chair; "He signed it. He's just not here."
L.add('4.05', {
  st: 'act1/sets/seance gergStaffer ([M] the EMPTY CHAIR soft at the left, a candle beside it; GERG (Ep1\'s approved portrait, his laptop\'s light) faced to the STAFFER (her own sculpted bust, art/cast civic2 makeBust3) in the right foreground; her eyes go to the empty chair, then to him as he answers, quietly; his room-scale mouth)',
  face: {GERG: 'room'},
  draw: (fb, k, sh, f) => {
    const on = sh.lines[0]?.s ?? 27;
    gergStaffer(fb, {f, gerg: {mouth: roomMouth(sh, k, 'GERG'), lid: k >= on - 4 ? 0 : 1, look: 1}, typing: k < on - 6 || k > on + 52, staffer: {look: k < on + 4 ? -1 : 0, expr: k < on + 4 ? 'worry' : 'neutral'}});
  },
});

// ------------------------------------------------------------------ 4.06 "one knock if we promised a nonprofit."; the knocks
L.add('4.06', {
  st: 'act1/sets/seance masLow (MAS to the table, as if calling a vote; lip-synced) → boardHigh (the board from above, the held hands joined at its far edge and the planchette perfectly still: two beats; then KNOCK KNOCK KNOCK from the ceiling, dust sifting down, more on each, the board a pixel on the third)',
  face: {MAS: 'lip'},
  marks: {k1: ['snd', 'ceiling_knock', 1, 0], k2: ['snd', 'ceiling_knock', 2, 0], k3: ['snd', 'ceiling_knock', 3, 0]},
  draw: (fb, k, sh, f) => {
    const k1 = mk(sh, 'k1', 109), k2 = mk(sh, 'k2', 126), k3 = mk(sh, 'k3', 143);
    const end = (sh.lines[0]?.e ?? 79) + 5;
    if (k < end) { masLow(fb, {f, mouth: masM(sh, k), look: 1}); return; }
    boardHigh(fb, {f, at: '>>>', held: true, dust: [[k - k1, 1], [k - k2, 2], [k - k3, 3]], shake: k >= k3 && k < k3 + 2 ? 1 : 0});
  },
});

// ------------------------------------------------------------------ 4.07 CRASH: Nole through the ceiling
L.add('4.07', {
  st: 'act1/sets/seance room: CRASH, ceiling tiles rain down over the foot of the table, NOLE drops through his hole on a cable (Ep1 cast/nole) and lands screen-right at the foot (the room jolts); on the right wall the frosted door he didn\'t use stays shut; the staffers look up; in the foreground MAS doesn\'t look up from his laptop: "you\'re early. we\'re on 2016." (room-scale mouth); the 2016 ghosts hang where they were',
  face: {MAS: 'room'},
  marks: {burst: ['snd', 'ceiling_burst', 1, 0], drop: ['snd', 'cable_drop', 1, 0], land: ['snd', 'landing_thunk', 1, 0]},
  draw: (fb, k, sh, f) => {
    const burst = mk(sh, 'burst', 0), drop = mk(sh, 'drop', 9), land = mk(sh, 'land', 26);
    const ny = k < drop ? -120 : k < land ? Math.round(-100 + ((on2(k) - drop) / Math.max(1, land - drop)) ** 2 * 290) : S4.nole.y;
    const shake: [number, number] = k === land ? [0, 2] : k === land + 1 ? [0, -1] : k === burst ? [1, 0] : [0, 0];
    room(fb, base(f, {
      planchette: P_REPLY, hole: k < land ? 1 : 3, tiles: k - burst, cable: k >= drop,
      nole: k >= drop ? {y: Math.min(S4.nole.y, ny), pose: {arm: k < land + 4 ? 'raise' : 'down', legs: k < land ? 'stand' : 'wide', mouth: 0}} : null,
      mas: {head: 'down', mouth: roomMouth(sh, k, 'MAS') === 'open' ? 'open' : 'rest'}, staffLook: k > burst + 2 && k < land + 30 ? 2 : 0, shake,
      over: (b) => { ghost1(b, 1); ghostNole16(b, 1, 0); },
    }));
  },
});

// ------------------------------------------------------------------ 4.08 Nole's entrance; his plate; Gerg answers
const NOLE_ACCENT = PAL.R3;
L.add('4.08', {
  st: 'act1/sets/seance noleOTS ([OTS] over MAS\'s shoulder, the back of his head and his hood candle-rimmed in the left foreground, down the table to NOLE at the foot, Ep1\'s conversation portrait warmed by the candles, brushing a tile off his shoulder; the 2016 ghost\'s header and words and its Yup hanging behind him), his plate NOLE · FUNDED IT. LEFT IT. SUING IT. typed on (the pipeline\'s plate), lip-synced; GERG answers off frame, typing (his voice established)',
  face: {NOLE: 'lip'},
  draw: (fb, k, sh, f) => {
    const nl = sh.lines.find((l) => l.who === 'NOLE');
    const talking = !!nl && k >= nl.s && k < nl.e;
    noleOTS(fb, {f, nole: {mouth: noleM(sh, k), brow: 1, jab: talking && (Math.floor((k - (nl?.s ?? 0)) / 10) % 4 === 1) ? 1 : 0, brush: k < 30 && (k >> 3) % 2 === 0}, ghosts16: true});
    const t = plateText(sh);
    if (t && k >= t.s && k < t.e) drawPlate(fb, t, k - t.s, 188, 164, NOLE_ACCENT);
  },
});

// ------------------------------------------------------------------ 4.09 his case
L.add('4.09', {
  st: 'act1/sets/seance noleOTS (the same setup): NOLE makes his case to the whole table, lip-synced, his phone hand jabbing on the table, the candles, the ceiling, the name; behind him, in the same frame, the 2016 ghost\'s "less open" and its Yup hang in the air while he says "open"; nobody points at it',
  face: {NOLE: 'lip'},
  marks: {table: ['w', 'e2-a1-0008', 'table', 0], candles: ['w', 'e2-a1-0008', 'candles', 0], ceiling: ['w', 'e2-a1-0008', 'ceiling', 0], name: ['w', 'e2-a1-0008', 'name', 0], open1: ['w', 'e2-a1-0008', 'Open', 0], open2: ['w', 'e2-a1-0008', 'open', 0]},
  draw: (fb, k, sh, f) => {
    const beats = ['table', 'candles', 'ceiling', 'name', 'open1', 'open2'].map((m) => mk(sh, m, -99));
    const hit = beats.some((b) => k >= b && k < b + 8);
    const dip = beats.slice(4).some((b) => k >= b && k < b + 10) ? 1 : 0;
    noleOTS(fb, {f, nole: {mouth: noleM(sh, k), brow: 1, jab: hit ? 1 : 0, dip, brush: k < 20 && (k >> 3) % 2 === 1}, ghosts16: true});
  },
});

// ------------------------------------------------------------------ 4.10 "spirit, what did we call it?" O P E N
L.add('4.10', {
  st: 'act1/sets/seance masLow (MAS, to the planchette, not to him; lip-synced) → boardHigh (the planchette glides letter to letter, a tick on each: O · P · E · N, the word spelled along the board\'s near edge in his cyan, held to read)',
  face: {MAS: 'lip'},
  marks: {t1: ['snd', 'planchette_letter_tick', 1, 0], t2: ['snd', 'planchette_letter_tick', 2, 0], t3: ['snd', 'planchette_letter_tick', 3, 0], t4: ['snd', 'planchette_letter_tick', 4, 0]},
  draw: (fb, k, sh, f) => {
    const t = [mk(sh, 't1', 66), mk(sh, 't2', 78), mk(sh, 't3', 90), mk(sh, 't4', 102)];
    if (k < t[0] - 6) { masLow(fb, {f, mouth: masM(sh, k), look: 1}); return; }
    const seq = ['>>>', 'O', 'P', 'E', 'N'];
    const n = stepOf(k, t);
    const from = hpos(seq[Math.max(0, n === 4 ? 4 : n)]), to = hpos(seq[Math.min(4, n + 1)]);
    const k0 = n < 4 ? t[n] - 6 : 0;
    const at: [number, number] = n < 4 ? [glide(k, k0, t[n], from[0], to[0]), glide(k, k0, t[n], from[1], to[1])] : hpos('N');
    boardHigh(fb, {f, at: n === 0 && k < k0 ? hpos('>>>') : at, word: 'OPEN'.slice(0, n)});
  },
});

// ------------------------------------------------------------------ 4.11 "There. Even the furniture knows." NOPE
L.add('4.11', {
  st: 'act1/sets/seance noleOTS (NOLE spreads his hands at the board, vindicated, lip-synced) → boardHigh (the planchette pauses on the N; then it drifts back to the front and carries the N with it in one held glide: O P E N → N O P E)',
  face: {NOLE: 'lip'},
  marks: {glide: ['snd', 'planchette_glide', 1, 0]},
  draw: (fb, k, sh, f) => {
    const gl = mk(sh, 'glide', 73);
    if (k < 61) { noleOTS(fb, {f, nole: {mouth: noleM(sh, k) || (k > 57 ? 4 : 0), brow: 0, jab: k >= 20 && k < 40 ? 2 : 0}, ghosts16: true}); return; }
    const a = hpos('N'), b = hpos('>>>');
    const u = Math.min(1, Math.max(0, (on2(k) - gl) / 12));
    boardHigh(fb, {f, at: [Math.round(a[0] + (b[0] - a[0]) * u), Math.round(a[1] + (b[1] - a[1]) * u)], word: 'OPEN', nSlide: u});
  },
});

// ------------------------------------------------------------------ 4.12 "No. Not like that." Three hands lift
L.add('4.12', {
  st: 'act1/sets/seance noleMCU ([MCU] NOLE, Ep1\'s portrait warmed by the candles, jabbing at the board, lip-synced; then he looks down) → boardHigh (three hands resting on the planchette: Mas\'s grey cuff, GHOST-NOLE\'s in the spirit screen, Gerg\'s; all three lift off at once, a gap of shadow under the fingertips, then gone)',
  face: {NOLE: 'lip'},
  draw: (fb, k, sh, f) => {
    if (k < 71) { const talking = k >= 6 && k < 66; noleMCU(fb, {mouth: noleM(sh, k), brow: 1, jab: talking ? ((k >> 2) % 3 === 0 ? 1 : (k >> 2) % 3 === 1 ? 2 : 0) : 0, down: k >= 64}); return; }
    boardHigh(fb, {f, at: '>>>', word: 'NOPE', hands: k < 88 ? 1 : k < 94 ? 2 : 3});
  },
});

// ------------------------------------------------------------------ 4.13 the cow
const COW_CAPTION = 'FWD: "…ATTACH TO ALSET AS ITS CASH COW…"';
const COW_REPLY = 'NOLE: "…EXACTLY RIGHT…"';
/** the cow's caption and its reply: ghost-text plates (the 2.G screen), the reply under the caption */
const ghostPlate = (b: Buf, s: string, x: number, y: number, typedN: number) => {
  const pt = pt0, pw = pw0;
  const w = pw(s) + 10, h = 13;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const X = x + i, Y = y + j; if (j === 0 || j === h - 1) b.set(X, Y, PAL.C7); else if (((X + Y) & 1) === 0) b.set(X, Y, PAL.C3); else b.set(X, Y, PAL.N0); }
  pt(b, s.slice(0, typedN), x + 5, y + 3, PAL.C9);
};
L.add('4.13', {
  st: 'act1/sets/seance room with the COW ghost (art drawGhost cow: a cow of reply chevrons, a charging cable for a tail, its plug ALSET, its header 2018) lumbering up out of the table, moo and chew; its caption FWD: "…ATTACH TO ALSET AS ITS CASH COW…" and under it his reply NOLE: "…EXACTLY RIGHT…" as ghost-text plates, held to read; Nole at the foot, Mas at the head, the scene moving under it',
  draw: (fb, k, sh, f) => {
    const cap = sh.texts.find((t) => t.text.startsWith('FWD')), rep = sh.texts.find((t) => t.text.startsWith('NOLE:'));
    const rise = Math.min(1, on2(k) / 12);
    const chew = (k >> 3) % 2;
    room(fb, base(f, {planchette: P_REPLY, nole: {pose: {arm: 'down', mouth: 0}}, hole: 2, mas: {head: 'host'}, over: (b) => {
      over(b, (t) => drawGhost(t, 214, 96 - Math.round(rise * 40) + chew, {kind: 'cow', header: '2018'}));
      if (cap && k >= cap.s) ghostPlate(b, COW_CAPTION, 14, 10, (k - cap.s) * 3);
      if (rep && k >= rep.s) ghostPlate(b, COW_REPLY, 14, 26, (k - rep.s) * 3);
    }}));
  },
});

// ------------------------------------------------------------------ 4.14 "I forwarded that." / "you wrote 'exactly right.'"
L.add('4.14', {
  st: 'act1/sets/seance noleOTS (NOLE at the cow, quick, defensive, lip-synced; the cow hanging over the table) → masLow (MAS, level, a fact read off the ghost; lip-synced)',
  face: {NOLE: 'lip', MAS: 'lip'},
  draw: (fb, k, sh, f) => {
    const m = sh.lines.find((l) => l.who === 'MAS');
    const cut = (m?.s ?? 64) - 6;
    if (k < cut) { noleOTS(fb, {f, nole: {mouth: noleM(sh, k), brow: 1, jab: k > 10 && k < 30 ? 1 : 0}, cow: true}); return; }
    masLow(fb, {f, mouth: masM(sh, k), look: 1});
  },
});

// ------------------------------------------------------------------ 4.15 the lamp; his post rises as a ghost of !
L.add('4.15', {
  st: 'act1/sets/seance noleMCU (NOLE doesn\'t answer: his post lamp clicks on beside him, he types furiously, the phone\'s screen a post) → the post leaves the phone and rises as a brand-new ghost made of ! (art drawGhost bang), its header NOLE · JUST NOW and its body !!!!!!!!, up out of frame to join the others',
  marks: {lamp: ['snd', 'lamp_click', 1, 0], swell: ['snd', 'reverse_swell_1beat', 1, 0]},
  draw: (fb, k, sh, f) => {
    const lamp = mk(sh, 'lamp', 5), sw = mk(sh, 'swell', 40);
    noleMCU(fb, {mouth: 0, brow: 1, lamp: k >= lamp, screen: 'post', jab: k >= 14 && k < sw ? ((k >> 1) % 2 ? 1 : 2) : 0, down: k >= 14 && k < sw + 6});
    if (k >= sw - 2) over(fb, (t) => drawGhost(t, 150, 110 - on2(k - sw), {kind: 'bang', header: 'NOLE · JUST NOW', body: '!!!!!!!!'}));
  },
});

// ------------------------------------------------------------------ 4.16 ghost 3: DEC 2018, 0%
const ZERO = '"…RELEVANT TO MINDDEEP/ELGOOG WITHOUT A DRAMATIC CHANGE IN EXECUTION AND RESOURCES IS 0%. NOT 1%."';
L.add('4.16', {
  st: 'act1/sets/seance room: the planchette slides one last time; the third ghost rises, GHOST-NOLE in a 2018 hoodie (art drawGhostNole) leaning across the table, his header DEC 2018 carrying the 0% sentence (held to read, top left over the dark window); his line on his room-scale mouth',
  face: {'GHOST-NOLE': 'room'},
  draw: (fb, k, sh, f) => {
    const rise = Math.min(1, on2(Math.max(0, k - 2)) / 14);
    const a = P_REPLY, c = letterAt('M');
    room(fb, base(f, {planchette: [glide(k, 0, 10, a[0], c[0]), a[1]], nole: {pose: {arm: 'phone', mouth: 0}}, hole: 2, mas: {head: 'host'}, over: (b) => over(b, (t) => {
      if (rise <= 0) return;
      drawGhostNole(t, 300, 186 + Math.round((1 - rise) * 60), {hoodie: true, pose: {arm: 'point', mouth: room3Mouth(sh, k, 'GHOST-NOLE'), lean: 2}, flip: true, header: 'DEC 2018', quote: ZERO, headerAt: [12, 6]});
    })}));
  },
});

// ------------------------------------------------------------------ 4.17 the slap; his hand on his glass doesn't move
L.add('4.17', {
  st: 'act1/sets/seance noleMCU (NOLE slaps his phone down) → glassECU ([ECU] Mas\'s hand round his crystal glass of water at the head of the table; beyond it the candle\'s flame jumps two steps and settles; the glass, the hand and the water don\'t move)',
  marks: {clack: ['snd', 'phone_clack_floor', 1, 0], flare: ['snd', 'candle_flare', 1, 0]},
  draw: (fb, k, sh, f) => {
    const clack = mk(sh, 'clack', 5), fl = mk(sh, 'flare', 6);
    if (k <= clack) { noleMCU(fb, {mouth: 4, brow: 1, jab: k < clack - 2 ? 1 : 2, dip: k >= clack - 1 ? 2 : 0}); return; }
    const j = k - fl;
    glassECU(fb, {f, flame: j < 6 ? 2 : j < 14 ? 1 : 0});
  },
});

// ------------------------------------------------------------------ 4.18 "That was a different me." … "Yup."
L.add('4.18', {
  st: 'act1/sets/seance noles2S ([2S] NOLE and GHOST-NOLE face to face, the same portrait twice (the ghost flipped, in the 2.G screen, the 2018 hood behind its neck): same jaw, same phone; the ghost\'s header DEC 2018 held up between them); both lip-synced; GERG off screen (his voice established); the ghost\'s long hold before "…Yup."',
  face: {NOLE: 'lip', 'GHOST-NOLE': 'lip'},
  draw: (fb, k, sh, f) => {
    const last = sh.lines.find((l) => l.who === 'NOLE' && l.text.startsWith('Say'));
    const turned = !!last && k >= last.s - 4;
    noles2S(fb, {f, nole: {mouth: noleM(sh, k), brow: turned ? 1 : 0, dip: turned ? 2 : 0, jab: turned && k < (last?.e ?? 0) ? 1 : 0}, ghost: {mouth: noleM(sh, k, 'GHOST-NOLE'), dip: k > 180 ? 1 : 0}});
  },
});

// ------------------------------------------------------------------ 4.19 "spirit, why zero?" The stone
L.add('4.19', {
  st: 'act1/sets/seance masLow (MAS, the question he wants answered; lip-synced) → boardHigh (the planchette slides into the board\'s corner and the corner turns to a Go board in cut paper, held steps) → art/sets/office2018 move37 ([ECU] SET-04 in T3 cut paper: the 19 x 19 board, slate and shell stones, the stone clicking down; its label MAR 2016 · GAME 2 · MOVE 37 held to read)',
  face: {MAS: 'lip'},
  marks: {glide: ['snd', 'planchette_glide', 1, 0], click: ['snd', 'go_stone_click', 1, 0]},
  draw: (fb, k, sh, f) => {
    const gl = mk(sh, 'glide', 53), ck = mk(sh, 'click', 70);
    if (k < gl) { masLow(fb, {f, mouth: masM(sh, k), look: 1}); return; }
    if (k < ck - 2) { const a = hpos('M'), b: [number, number] = [418, 168]; boardHigh(fb, {f, at: [glide(k, gl, gl + 8, a[0], b[0]), glide(k, gl, gl + 8, a[1], b[1])], go: stepOf(k, [gl + 4, gl + 8, gl + 12])}); return; }
    move37(fb, f, {stone: k < ck ? 1 : 2, stream: 'none', label: true});
  },
});

// ------------------------------------------------------------------ 4.20 "That's why." / "What's that?"
L.add('4.20', {
  st: 'act1/sets/seance noleMCU (NOLE, quiet for once, lip-synced, looking down at the stone) → stafferMCU (the STAFFER beside Gerg whispering at the stone behind her hand: her line is off-mic)',
  face: {NOLE: 'lip'},
  draw: (fb, k, sh, f) => {
    const w = sh.lines.find((l) => l.who === 'STAFFER');
    if (k < (w?.s ?? 37) - 3) { noleMCU(fb, {mouth: noleM(sh, k), brow: 0, dip: 1, down: true, x: 214, y: 58}); return; }
    stafferMCU(fb, {f, look: 0, expr: 'worry'});
  },
});

// ------------------------------------------------------------------ 4.21 "Nobody wrote that move."
L.add('4.21', {
  st: 'act1/sets/seance noleMCU (NOLE to her, hushed, a man at a séance; lip-synced; his head dipped toward her)',
  face: {NOLE: 'lip'},
  draw: (fb, k, sh, f) => { noleMCU(fb, {mouth: noleM(sh, k), brow: 0, dip: 2, x: 196, y: 50}); void f; },
});

// ------------------------------------------------------------------ 4.22 Gerg's correction; the knob wall
L.add('4.22', {
  st: 'act1/sets/seance gergMCU ([MCU] GERG typing, cheerfully literal, his room-scale mouth) → stafferMCU (she whispers to him behind her hand: off-mic) → art/sets/office2018 move37 (from "Nobody wrote it.": behind the board the wall of tiny knobs, a stream of tiny human boards pouring in, each ticking every knob a hair; on "Then it played itself, millions of games." the stream turns to the program\'s own boards; the wall freezes; no players, no hands; Gerg\'s voice over it)',
  face: {GERG: 'room'},
  marks: {nobody: ['on', 'e2-a1-0056', 0], then: ['w', 'e2-a1-0056', 'Then', 0], games: ['w', 'e2-a1-0056', 'games', 0]},
  draw: (fb, k, sh, f) => {
    const w = sh.lines.find((l) => l.who === 'STAFFER');
    const nob = mk(sh, 'nobody', 143), then = mk(sh, 'then', 319), games = mk(sh, 'games', 378);
    if (k < (w?.s ?? 110) - 2) { gergMCU(fb, {f, mouth: roomMouth(sh, k, 'GERG'), lid: 1, look: 1}); return; }
    if (k < nob) { stafferMCU(fb, {f, look: 1, expr: 'neutral'}); return; }
    move37(fb, f, {stone: 2, stream: k < then ? 'human' : k < games + 10 ? 'self' : 'frozen', label: true});
  },
});

// ------------------------------------------------------------------ 4.23 the fear, in plainer words
L.add('4.23', {
  st: 'act1/sets/seance noleMCU (NOLE takes the fear back: quiet, then quieter; lip-synced)',
  face: {NOLE: 'lip'},
  marks: {right: ['w', 'e2-a1-0024', 'right', 0]},
  draw: (fb, k, sh, f) => { const r = mk(sh, 'right', 117); noleMCU(fb, {mouth: noleM(sh, k), brow: 0, dip: k >= r ? 2 : 1, x: 222, y: 34}); void f; },
});

// ------------------------------------------------------------------ 4.24 "MINDDEEP had that in 2016. We had a blog."
L.add('4.24', {
  st: 'act1/sets/seance room (the board\'s corner back to letters): NOLE, loud again, to the table, his room-scale mouth, jabbing; the table as it was',
  face: {NOLE: 'room'},
  draw: (fb, k, sh, f) => {
    room(fb, base(f, {planchette: letterAt('M'), hole: 2, mas: {head: 'host'}, nole: {pose: {arm: k > 4 && k < 60 ? ((k >> 3) % 2 ? 'jab' : 'jab2') : 'down', mouth: room3Mouth(sh, k, 'NOLE'), brow: 1}}}));
  },
});

// ------------------------------------------------------------------ 4.25 ghost 3 in his eyeline; V.O. 2
L.add('4.25', {
  st: 'act1/sets/seance noleOTS (over MAS\'s shoulder: ghost 3, GHOST-NOLE in his 2018 hoodie with the 0% header held to read, drifts into his eyeline and says its line again, room-scale mouth; Nole quiet at the foot; Mas\'s cheek turned a sliver to it); V.O. 2 types in his cyan (his lips never move: we\'re behind him)',
  face: {'GHOST-NOLE': 'room'},
  draw: (fb, k, sh, f) => {
    const x = glide(k, 0, 30, 470, 318, 2, true);
    noleOTS(fb, {f, nole: {mouth: 0, brow: 0}, ghost3: {x, mouth: room3Mouth(sh, k, 'GHOST-NOLE')}, turn: k > 20 ? 1 : 0});
  },
});

// ------------------------------------------------------------------ 4.26 "You kept them." / "we keep everything."
L.add('4.26', {
  st: 'act1/sets/seance noleMCU (NOLE turned to Mas, quiet, his one short line; the post lamp beside him does not click on; a slow whole-pixel drift in; Mas\'s answer lands on his face, an L-cut)',
  face: {NOLE: 'lip'},
  draw: (fb, k, sh, f) => { noleMCU(fb, {mouth: noleM(sh, k), brow: 0, dip: 0, drift: Math.floor(k / 14)}); void f; },
});

// ------------------------------------------------------------------ 4.27 the glass; the snuff; into 2018
L.add('4.27', {
  st: 'act1/sets/seance glassECU (Mas lifts his glass a few pixels in held steps; the candle nearest Nole snuffs and its smoke crosses the glass) → act1/sets/f23 paperize + sweepEdge (on the render front\'s sweep the frame turns to the T3 cut paper from left to right: the glass carries us into 2018)',
  marks: {snuff: ['snd', 'candle_snuff', 1, 0], sweep: ['snd', 'render_front_sweep', 1, 0]},
  draw: (fb, k, sh, f) => {
    const sn = mk(sh, 'snuff', 13), sw = mk(sh, 'sweep', 43);
    glassECU(fb, {f, lift: Math.min(8, on2(k) >> 1), snuffed: k >= sn ? k - sn : null});
    if (k >= sw) {
      // the cut-paper front sweeps left to right; behind it, 2018: the same glass in Mas's hand at the back of his first
      // office (the next shot's first frame)
      const x = Math.round(((k - sw + 1) / Math.max(1, 64 - sw)) * W);
      const t = new BufC(W, 270, PAL.N0); office18(t, f, {nole: {at: 'slide', mouth: 0, arm: 'point'}, turned: 0, mas: 'glassUp'});
      for (let y = 0; y < RH; y++) for (let xx = 0; xx < Math.min(W, x); xx++) fb.c[y * W + xx] = t.c[y * W + xx];
      if (x < W) sweepEdge(fb, x);
    }
  },
});

// ------------------------------------------------------------------ F2.3: 4.28-4.32
L.add('4.28', {
  st: 'act1/sets/f23 office18 (art/sets/office2018 office2018feb, copied with parameters: NopeAI\'s first office, FEB 20, 2018, by day, in T3 cut paper: one rack, the arena on one monitor, the whiteboard AGI with three crossed-out arrows, the Go stone on the desk; NOLE at the front by his slide ALSET · AI, mid-speech, his mouth moving with no sound; the all-hands facing him; GERG typing; MAS at the back with his glass); no captions',
  draw: (fb, k, sh, f) => { const m = silentMouth(k); office18(fb, f, {nole: {at: 'slide', mouth: (m === 'open' ? 2 : 0) as 0 | 2, arm: 'point'}, turned: 0, alyiDesk: false}); },
});
L.add('4.29', {
  st: 'act1/sets/f23 office18: NOLE finishes, one hand still on the slide; nobody applauds; one by one the staff turn back to their monitors (held steps); the arena match keeps playing; GERG keeps typing',
  draw: (fb, k, sh, f) => { const n = Math.min(8, Math.max(0, Math.floor((k - 8) / 11))); office18(fb, f, {nole: {at: 'slide', mouth: 0, arm: 'point'}, turned: n, alyiDesk: n >= 6}); void sh; },
});
L.add('4.30', {
  st: 'act1/sets/f23 office18: at the back MAS sips from the same crystal glass; NOLE climbs the ladder to the ceiling hatch rung by rung; the hatch slides shut on him',
  marks: {sip: ['snd', 'glass_sip', 1, 0], climb: ['snd', 'ladder_climb', 1, 0], shut: ['snd', 'hatch_slide_shut', 1, 0]},
  draw: (fb, k, sh, f) => {
    const sip = mk(sh, 'sip', 10), climb = mk(sh, 'climb', 32), shut = mk(sh, 'shut', 89);
    const rung = Math.floor((k - climb) / 5);
    const nole = k < climb ? {at: 'slide' as const, mouth: 0 as const, arm: 'down' as const} : rung <= 9 ? {at: 'ladder' as const, rung} : {at: 'gone' as const};
    office18(fb, f, {nole, turned: 8, hatch: k < shut - 6 ? 0 : k < shut ? 1 : 2, mas: k >= sip - 4 && k < sip + 14 ? 'glassUp' : 'glass', alyiDesk: true});
  },
});
L.add('4.31', {
  st: 'art/sets/office2018 arenaInsert ([INSERT] the arena match on the one monitor plays on under the hatch\'s draught; nobody has paused it)',
  draw: (fb, k, sh, f) => { arenaInsert(fb, f); void k; void sh; },
});
L.add('4.32', {
  st: 'art/sets/office2018 alyiLooksBack ([2S] across the room: ALYI at the next desk, lit, warm, a person, cropped by his monitor\'s edge, turns and looks back at MAS at the back; Mas lifts his glass an inch); about 2.5 s on the look',
  draw: (fb, k, sh, f) => { alyiLooksBack(fb, f, {turn: k < 24 ? 0 : k < 30 ? 1 : 2, lift: k >= 56}); void sh; },
});

// ------------------------------------------------------------------ 4.33 back by the glass; Nole relights the candle
L.add('4.33', {
  st: 'act1/sets/seance glassECU in paper, the render front sweeping back to pixel (the glass carries us back to 2024; the smoke thinning) → room: NOLE at the foot strikes a match and relights the candle himself, and lifts it (the matched object out)',
  marks: {sweep: ['snd', 'render_front_sweep', 1, 0], match: ['snd', 'match_strike', 1, 0]},
  draw: (fb, k, sh, f) => {
    const sw = mk(sh, 'sweep', 5), mt = mk(sh, 'match', 37);
    if (k < 21) {
      // the 2018 look, then the front sweeps back left to right onto 2024: his glass, the smoke thinning over it
      alyiLooksBack(fb, f, {turn: 2, lift: true});
      if (k >= sw) {
        const x = Math.round(((k - sw + 1) / Math.max(1, 21 - sw)) * W);
        const t = new BufC(W, 270, PAL.N0); glassECU(t, {f, lift: 8, snuffed: 50 + k});
        for (let y = 0; y < RH; y++) for (let xx = 0; xx < Math.min(W, x); xx++) fb.c[y * W + xx] = t.c[y * W + xx];
        if (x < W) sweepEdge(fb, x);
      }
      return;
    }
    const lit = k >= mt + 5, held = k >= mt + 20;
    const out = [false, false, false, false, false, !lit];
    room(fb, base(f, {out, smoke: lit ? {} : {[NEAR_NOLE]: 46 + k}, planchette: letterAt('M'), hole: 2, mas: {head: 'host'}, match: k >= mt && k < mt + 12,
      nole: {pose: {arm: held ? 'raise' : 'phone', mouth: 0}}, lastCandle: held ? {x: S4.nole.x - 22, y: S4.nole.y - 62, hand: true} : null}));
  },
});

// ------------------------------------------------------------------ 4.34 the reverse: "You sat at the back."
L.add('4.34', {
  st: 'act1/sets/seance masReverse ([OTS] the reverse over NOLE\'s shoulder (the back of his head, his black tee, his arm up) holding the relit candle up to MAS\'s face like evidence; Mas candlelit in the left third (Ep1\'s approved portrait), still; Nole\'s voice from behind his own head (no mouth to show); Mas lifts his glass and sips: F2.3\'s sip, six years on)',
  marks: {sip: ['snd', 'glass_sip', 1, 0]},
  draw: (fb, k, sh, f) => {
    const sp = mk(sh, 'sip', 190);
    const j = k - sp;
    const sip = j < -6 ? 0 : j < -4 ? 1 : j < -2 ? 2 : j < 8 ? 3 : j < 10 ? 2 : j < 12 ? 1 : 0;
    const cy = glide(k, 0, 14, 128, 108, 2, true);
    masReverse(fb, {f, candle: [262, cy], sip, look: 1});
  },
});

// ------------------------------------------------------------------ 4.35 "Keep that too. See you in court."
L.add('4.35', {
  st: 'act1/sets/seance room: NOLE, at Mas\'s end, sets the candle down in front of him, hard, already rising on his cable (room-scale mouth); on his rocket\'s roar he\'s yanked back across and up through his hole, and the gust snuffs every candle on the table but his (their smoke); one ceiling tile drops back into place; the last candle burns in front of Mas',
  face: {NOLE: 'room'},
  marks: {roar: ['snd', 'rocket_roar', 1, 0], tile: ['snd', 'tile_land_1', 1, 0]},
  draw: (fb, k, sh, f) => {
    const roar = mk(sh, 'roar', 53), tile = mk(sh, 'tile', 90);
    const set = {x: 112, y: 162};
    const rise = k < roar ? Math.min(18, on2(Math.max(0, k - 8)) >> 1) : 0;
    let nx = 128, ny = 196 - rise;
    if (k >= roar) { const u = Math.min(1, (on2(k) - roar) / 6); nx = Math.round(128 + (S4.hole - 128) * u); ny = Math.round(196 - rise - (196 + 40) * u * u); }
    const gone = k >= roar + 7;
    const out = k >= roar ? [true, true, true, true, true, true] : [false, false, false, false, false, true];
    room(fb, base(f, {out, smoke: k >= roar ? {0: k - roar, 1: k - roar - 1, 2: k - roar, 3: k - roar - 2, 4: k - roar - 1} : {}, planchette: letterAt('M'), hole: k >= tile ? 0 : 2, patch: k >= tile, mas: {head: 'host'},
      cable: !gone, cableTo: [nx, ny - 82],
      nole: gone ? null : {x: nx, y: ny, flip: true, pose: {arm: k < 8 ? 'jab' : 'raise', mouth: room3Mouth(sh, k, 'NOLE'), legs: 'stand'}}, lastCandle: set}));
  },
});

// ------------------------------------------------------------------ 4.36 the last candle; the dark
L.add('4.36', {
  st: 'act1/sets/seance masBlow ([MCU] Mas leans in to the last candle, lit only by it, and blows it out; its ember and its smoke) → room, dark (the wide with every candle out: the aftermath, 1.5 s of dark before the lights come up for Mar 8)',
  marks: {blow: ['snd', 'candle_blow', 1, 0]},
  draw: (fb, k, sh, f) => {
    const bl = mk(sh, 'blow', 12);
    if (k < bl + 20) { masBlow(fb, {f, lean: k < 4 ? 0 : k < 8 ? 1 : 2, blow: k - bl}); return; }
    room(fb, base(f, {out: [true, true, true, true, true, true], dark: true, planchette: letterAt('M'), hole: 0, patch: true, mas: {head: 'down'}, smoke: {}}));
  },
});

export const SCENE = defineScene({scene: '4', layouts: L.all});
