// MR. MAS — Ep2 v1 · act2 · scene 11: "her" (MAY 13, 2024; the demo stage). 16 shots, 2352 f on the v1 EL lock. The
// shots pass, 2026-10-09; the record is shots-act2.md. The staging is proposal.md sc 11 / script-v1:
//   ARRIVE   11.01 the meter frame (cut on the tear's own picture, 10.07's last frame): Rima walks out of the wings to
//            her mark and the spot lands on her; 2 s before "Good morning."
//   SET-PIECE 11.02 the big screen close (its own pixels doubled): ears, eyes, a mouth in three held steps, the VOICE 5
//            badge; "Hi! I can see you." · 11.03 for five frames its eyes are tokens pointed into the wings (GLYPH,
//            drawn by the browser host), then Mas and the Orb in the wings: the Orb scans the screen, its toast
//            `verified: …` never resolves and gives up · 11.04-11.07 the engineer and the product in the meter frame;
//            each laugh slides the spot one step off Rima toward the screen (k262, k181, k218: three steps); the
//            cut-off "Thanks."; the three mouths; Rima half in the light, sticking to the running order (a click);
//            the phone turned on the house, a pair of glasses fogging mid-house, the blush, 😊 · 11.08 the chat:
//            `what's the catch?` sticks; "It's free!" · 11.09 Rima in the half-dark, the house waiting on her, her
//            close · 11.10 LIVE -> ENDED, the house lights a step up, people start to move
//   AFTER    11.11 in the wings he takes out his phone; his thumb types h · e · r off the beat · 11.12 his face, still,
//            two beats; the post lands · 11.13 the word swells into the blimp, rising out of the wings in four held
//            sizes over the emptying house; the press row's screens and the raised phones swing to it · 11.14 Rima on
//            her mark, composed, not looking up · 11.15 the engineer, unclipping his headset, reads it to her off mic;
//            she doesn't look up · 11.16 every head near the wings turns; the blimp over the emptying house
// Why he posted it, and whether the voice was meant to sound like anyone: nothing here tells us (W8). No V.O.
import {defineScene, layouts, mouth, roomMouth, talking, mk} from '../../kit';
import {stageWide, screenSCR, rimaMCU, glassesECU, eng2S, demoOpen, rimaClicker, STG, scrEyes, CATCH} from '../sets/stage';
import type {ScreenSt, StageSt} from '../sets/stage';
import {masOrb2S, masPhoneMedium, thumbECU, masFaceWork, herPOV} from '../sets/wings';
import {glyphLayer} from '../../../../../shared/pixel/glyph';
import {Mask} from '../../../../../shared/pixel/mask';
import {PAL, familyOf} from '../../../../../shared/pixel/palette';
import {Buf} from '../../../../../shared/pixel/px';

const L = layouts();
/** CHATGTP's face on the big screen: talking while its line sounds (the mouth on 3s), else at rest */
const face = (sh: Parameters<typeof talking>[0], k: number, extra: Partial<ScreenSt & {from: number}> = {}): ScreenSt & {from?: number} => ({grow: 3, mouth: talking(sh, k, 'CHATGTP') ? 'talk' : 'rest', chat: Math.min(CATCH - 3, 4 + Math.floor((sh.s - sh.sceneS + k) / 40)), ...extra});
/** the meter frame during the demo: the engineer at his mark with the phone up, Rima on hers in (or half out of) the spot */
const meter = (sh: Parameters<typeof talking>[0], k: number, spot: 0 | 1 | 2 | 3, screen: ScreenSt, o: Partial<StageSt> & {engMouth?: 'open' | 'rest' | 'smile' | 'laugh'; engFlip?: boolean; laugh?: boolean} = {}): StageSt => ({
  spot, rig: 1, screen,
  house: {rows: 3, phones: 'down', press: true, ...(o.laugh ? {f: Math.floor(k / 3) * 8} : {})},
  eng: {pose: {arm: 'raise', mouth: o.engMouth ?? (roomMouth(sh, k, 'ENGINEER') === 'open' ? 'open' : 'smile')}, flip: o.engFlip},
  rima: {pose: {mouth: roomMouth(sh, k, 'RIMA')}, light: spot === 0 ? 'spot' : spot === 1 ? 'half' : 'dark'},
  ...o,
});

L.add('11.01', {
  st: 'act2/sets/stage demoOpen ([W] the locked meter frame from mid-house: the rig\'s lights on, the house dark and full (the backs of heads, the press row\'s laptops), CHATGTP a plain bubble on the big screen, LIVE; Rima (Ep1 rima-stand) walks out of the wings to her mark and the spot lands on her (a cone and a hard pool); the engineer (art cast/engineer room) at his mark downstage right; her line on a room mouth)',
  face: {RIMA: 'room'},
  marks: {spot: ['snd', 'spotlight_swing', 1, 0]},
  draw: (fb, k, sh, f) => { const sp = mk(sh, 'spot', 14); demoOpen(fb, f, k, {walkTo: sp, spotAt: sp, rimaMouth: roomMouth(sh, k, 'RIMA')}); },
});
L.add('11.02', {
  st: 'act2/sets/stage screenSCR ([SCR] the big screen close, its own pixels doubled: CHATGTP\'s bubble grows ears, eyes, a mouth in three held steps, one on each palette step; the VOICE 5 badge in its corner; its mouth moves while it talks; LIVE; the chat beside it)',
  marks: {g1: ['snd', 'palette_step_F', 1, 0], g2: ['snd', 'palette_step_F', 2, 0], g3: ['snd', 'palette_step_F', 3, 0]},
  draw: (fb, k, sh, f) => {
    const g = k < mk(sh, 'g1', 4) ? 0 : k < mk(sh, 'g2', 19) ? 1 : k < mk(sh, 'g3', 33) ? 2 : 3;
    screenSCR(fb, f, face(sh, k, {grow: g as 0 | 1 | 2 | 3, badge: k >= 38}));
  },
});
// the GLYPH region: two eye-shaped fields; their source is the eyes' own token rows (bright cyan) on the dark, so the
// tokens make two eyes, pointed into the wings (the art's token eyes sit a few pixels screen-left of the eyes)
const EYES_MASK = (() => { const m = new Mask(480, 270); for (const [x, y] of scrEyes()) m.addEllipse(x - 4, y, 26, 15); return m; })();
const eyeSource = (fb: Buf) => {
  const src = fb.clone();
  for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) if (EYES_MASK.get(x, y) > 0) src.set(x, y, PAL.N0);
  // each eye a bright field of tokens, its brightest side turned screen-left (toward the wings, at Mas)
  for (const [ex, ey] of scrEyes()) for (let j = -10; j <= 10; j++) for (let i = -22; i <= 22; i++) { const d = Math.hypot(i / 22, j / 10); if (d < 1) src.set(ex - 6 + i, ey + j, i < -8 ? PAL.C9 : d < 0.6 ? PAL.C7 : PAL.C5); }
  void familyOf;
  return src;
};
L.add('11.03', {
  st: 'act2/sets/stage screenSCR + GLYPH → wings masOrb2S ([SCR] for five frames CHATGTP\'s eyes are tokens, pointed screen-left into the wings: the eye region as a GLYPH layer (shared/pixel/glyph, drawn by the Remotion host), then friendly again; [2S] in the wings, Mas (Ep1\'s portrait in the stage\'s spill, turned to the stage) and the Orb (Ep1 orb-medium) beside him; the Orb scans the big screen; its toast verified: … , the dots cycling, never resolving into a word; it gives up and the toast drops away)',
  glyph: true,
  marks: {scan: ['snd', 'orb_scan_sweep', 1, 0], toast: ['snd', 'ui_toast_pop', 1, 0]},
  draw: (fb, k, sh, f) => {
    if (k < 5) {
      screenSCR(fb, f, face(sh, k, {tokens: true, mouth: 'rest'}));
      return {layers: [glyphLayer(eyeSource(fb), {tint: PAL.C6, tintAmt: 0.5, seed: 1103, bg: PAL.N0, shimmer: 0.2, cell: [2, 3]}, EYES_MASK, k)]};
    }
    const scan = mk(sh, 'scan', 14), t0 = mk(sh, 'toast', 21), gone = 62;
    masOrb2S(fb, f, {scan: k >= scan && k < scan + 30 ? Math.floor((k - scan) / 2) + 1 : 0, toast: k >= t0 ? k - t0 : -1, dots: 1 + (Math.floor((k - t0) / 5) % 3), gone: k >= gone});
  },
});
L.add('11.04', {
  st: 'act2/sets/stage stageWide (the meter frame: the engineer at his mark raises the phone and asks for short answers (room mouth); the product answers from the big screen (its mouth on its line); "Thanks." in over "favorite"; the house laughs (the heads bob); on the swing the spot slides its first step off Rima toward the screen, and she is half in the light)',
  face: {ENGINEER: 'room'},
  marks: {laugh: ['snd', 'crowd_laugh_m', 1, 0], swing: ['snd', 'spotlight_swing', 1, 0]},
  draw: (fb, k, sh, f) => {
    const sw = mk(sh, 'swing', 262), la = mk(sh, 'laugh', 250);
    stageWide(fb, f, meter(sh, k, k >= sw ? 1 : 0, face(sh, k), {laugh: k >= la && k < la + 40}));
  },
});
L.add('11.05', {
  st: 'act2/sets/stage stageWide → screenSCR → stageWide (the engineer tries again (room mouth); [SCR] the mouth splits into three mouths and it harmonises with itself (the art\'s harmony mouths, each on its own note); the bigger laugh; the meter frame: the spot\'s second step)',
  face: {ENGINEER: 'room'},
  marks: {sing: ['on', 'e2-a2-0030', 0], sung: ['end', 'e2-a2-0030', 0], swing: ['snd', 'spotlight_swing', 1, 0], laugh: ['snd', 'crowd_laugh_l', 1, 0]},
  draw: (fb, k, sh, f) => {
    const sing = mk(sh, 'sing', 102), sung = mk(sh, 'sung', 158), sw = mk(sh, 'swing', 181), la = mk(sh, 'laugh', 162);
    if (k >= sing - 6 && k < sw - 8) { screenSCR(fb, f, face(sh, k, {mouth: k < sung + 2 ? 'three' : 'rest', from: 16})); return; }
    stageWide(fb, f, meter(sh, k, k >= sw ? 2 : 1, face(sh, k), {laugh: k >= la && k < la + 50}));
  },
});
L.add('11.06', {
  st: 'act2/sets/stage rimaMCU ([MCU] Rima (Ep1\'s approved portrait) half in the light now (the spot slid toward the screen: her right side still in it, the left a hard step down), perfectly still; the click is heard, not shown (a clicker at this framing read as a thumbs-up); lip-synced, never rushed)',
  face: {RIMA: 'lip'},
  draw: (fb, k, sh, f) => {
    rimaMCU(fb, f, {mouth: mouth(sh, k, 'RIMA'), light: 'half'});
    void rimaClicker;
  },
});
L.add('11.07', {
  st: 'act2/sets/stage stageWide → glassesECU → screenSCR → stageWide (the engineer turns the phone\'s camera round onto the house ("Say hello to the room."); the product, overwhelmed; [ECU] mid-house a stranger\'s glasses fog in three held steps (never the front row); [SCR] "You\'re making me blush. I don\'t have blood." and 😊 (Ep1\'s Sydney emoji, its closed eyes and blush); the meter frame: the third step, the spot more on the screen than on her)',
  face: {ENGINEER: 'room'},
  marks: {l2: ['on', 'e2-a2-0034', 0], laugh: ['snd', 'crowd_laugh_m', 1, 0], swing: ['snd', 'spotlight_swing', 1, 0], emoji: ['txt', '😊', 'at', 0], end1: ['end', 'e2-a2-0033', 0]},
  draw: (fb, k, sh, f) => {
    const l2 = mk(sh, 'l2', 142), sw = mk(sh, 'swing', 218), em = mk(sh, 'emoji', 194), end1 = mk(sh, 'end1', 119), la = mk(sh, 'laugh', 198);
    const scr = face(sh, k, {emoji: k >= em});
    if (k >= end1 && k < l2) { glassesECU(fb, f, {fog: Math.min(3, Math.floor((k - end1) / 6))}); return; }
    if (k >= l2 && k < sw - 6) { screenSCR(fb, f, scr); return; }
    stageWide(fb, f, meter(sh, k, k >= sw ? 3 : 2, scr, {laugh: k >= la && k < la + 40}));
  },
});
L.add('11.08', {
  st: 'act2/sets/stage screenSCR ([SCR] the livestream chat scrolls up the side of the big screen; one comment sticks, lit: what\'s the catch?; the product, delighted (its mouth on "It\'s free!"); the house\'s cold little laugh)',
  draw: (fb, k, sh, f) => { screenSCR(fb, f, face(sh, k, {chat: CATCH - 3 + Math.min(3, Math.floor(k / 2)), chatHi: k >= 7, from: 16})); },
});
L.add('11.09', {
  st: 'act2/sets/stage rimaMCU ([MCU] Rima in the half-dark (the spot on the screen now: two steps down, the screen\'s cyan on her far side), perfectly composed; she lets the house wait (the episode\'s one long hold of hers), then her close, lip-synced)',
  face: {RIMA: 'lip'},
  draw: (fb, k, sh, f) => { rimaMCU(fb, f, {mouth: mouth(sh, k, 'RIMA'), light: 'dark'}); },
});
L.add('11.10', {
  st: 'act2/sets/stage screenSCR → stageWide ([SCR] LIVE becomes ENDED on the stream\'s end tone (the face dims a rung); the meter frame: the house lights come up a step, people start to move (the first seats empty))',
  marks: {end: ['txt', 'ENDED', 'at', 0], up: ['snd', 'house_lights_up', 1, 0]},
  draw: (fb, k, sh, f) => {
    const end = mk(sh, 'end', 19), up = mk(sh, 'up', 28);
    const scr: ScreenSt = {grow: 3, mouth: 'rest', chat: CATCH + 2, live: k >= end ? 'ended' : 'live'};
    if (k < end + 6) { screenSCR(fb, f, scr); return; }
    stageWide(fb, f, {spot: 3, rig: 1, lights: k >= up ? 1 : 0, screen: scr, house: {rows: 3, phones: 'down', press: true, gone: k >= up ? Math.min(0.2, (k - up) * 0.01) : 0},
      eng: {pose: {arm: 'phone', mouth: 'rest'}}, rima: {light: k >= up ? 'house' : 'dark'}});
  },
});
L.add('11.11', {
  st: 'act2/sets/wings masPhoneMedium → thumbECU ([M] in the wings, his face unchanged (Ep1\'s portrait in the stage\'s spill), the phone rising into his hand (the art\'s hands); [ECU] the composer, his thumb types h · e · r, a key each, off the beat)',
  marks: {t1: ['snd', 'typing_soft', 1, 0], t2: ['snd', 'typing_soft', 2, 0], t3: ['snd', 'typing_soft', 3, 0]},
  draw: (fb, k, sh, f) => {
    const t = [mk(sh, 't1', 24), mk(sh, 't2', 36), mk(sh, 't3', 50)];
    if (k < t[0] - 8) { masPhoneMedium(fb, f, {rise: Math.min(1, (k - (k & 1)) / 12)}); return; }
    const n = k >= t[2] ? 3 : k >= t[1] ? 2 : k >= t[0] ? 1 : 0;
    const key = t.findIndex((x) => k >= x && k < x + 5);
    thumbECU(fb, f, {n, key: key >= 0 ? key : undefined});
  },
});
L.add('11.12', {
  st: 'act2/sets/wings masFaceWork → herPOV ([MCU] his face in the work light, still, two beats (the phone\'s cool light on his chin); [POV] the post lands in its own UI on the softest click: Mas Manalt, her, MAY 13 (his lowercase; the posts kit))',
  marks: {post: ['snd', 'post_click', 1, 0]},
  draw: (fb, k, sh, f) => { const p = mk(sh, 'post', 31); if (k < p) { masFaceWork(fb, f); return; } herPOV(fb, f, {k: k - p - 2}); },
});
const BLIMP: Array<[number, number]> = [[30, 118], [74, 74], [114, 54], [154, 42]];
const blimpAt = (k: number, steps: number[]) => { const i = steps.filter((s) => k >= s).length; return i === 0 ? null : {size: i as 1 | 2 | 3 | 4, x: BLIMP[i - 1][0], y: BLIMP[i - 1][1]}; };
L.add('11.13', {
  st: 'act2/sets/stage stageWide + art creatures drawBlimp (the word becomes a lowercase blimp, her, and rises out of the wings in four held sizes, a bar each, over the emptying house (the house lights a step up); on the buzz the press row\'s screens and a wall of raised phones swing to it; Rima holds her mark (no wince); the screen ENDED)',
  marks: {b1: ['snd', 'blimp_inflate_step', 1, 0], b2: ['snd', 'blimp_inflate_step', 2, 0], b3: ['snd', 'blimp_inflate_step', 3, 0], b4: ['snd', 'blimp_inflate_step', 4, 0], buzz: ['snd', 'phone_wave_buzz', 1, 0]},
  draw: (fb, k, sh, f) => {
    const steps = [mk(sh, 'b1', 7), mk(sh, 'b2', 67), mk(sh, 'b3', 127), mk(sh, 'b4', 187)], bz = mk(sh, 'buzz', 144);
    stageWide(fb, f, {spot: 3, rig: 1, lights: 1, screen: {grow: 3, mouth: 'rest', chat: CATCH + 2, live: 'ended'},
      house: {rows: 3, phones: k >= bz ? 'swung' : k >= steps[1] ? 'up' : 'down', press: true, gone: 0.2 + Math.min(0.15, k / 1600)},
      eng: {pose: {arm: 'phone', mouth: 'rest'}}, rima: {light: 'house'}, blimp: blimpAt(k, steps)});
  },
});
L.add('11.14', {
  st: 'act2/sets/stage rimaMCU ([MCU] Rima on her mark in the house light, composed; she doesn\'t look up (eyes level, no wince: R2, guardrails §6))',
  draw: (fb, k, sh, f) => { rimaMCU(fb, f, {mouth: 'rest', light: 'house'}); void k; void sh; },
});
L.add('11.15', {
  st: 'act2/sets/stage eng2S ([2S] the engineer (art cast/engineer bust) stops beside Rima at her mark, unclipping his headset (it comes off on the unclip), and reads it off his phone to her, off mic, lip-synced; Rima (Ep1\'s portrait) doesn\'t look up: her held mark is the reaction)',
  face: {ENGINEER: 'lip'},
  marks: {un: ['snd', 'headset_unclip', 1, 0]},
  draw: (fb, k, sh, f) => { const un = mk(sh, 'un', 6); eng2S(fb, f, {mouth: mouth(sh, k, 'ENGINEER'), arm: k < un + 10 ? 'unclip' : 'phone', headset: k < un + 4 ? 'on' : 'off'}); },
});
L.add('11.16', {
  st: 'act2/sets/stage stageWide (every head near the wings turns to them (cheeks and ears come round to the left), the blimp at its fourth size over the emptying house)',
  marks: {turn: ['snd', 'cloth_rustle', 1, 0]},
  draw: (fb, k, sh, f) => {
    const t = mk(sh, 'turn', 4);
    stageWide(fb, f, {spot: 3, rig: 1, lights: 1, screen: {grow: 3, mouth: 'rest', chat: CATCH + 2, live: 'ended'},
      house: {rows: 3, phones: 'swung', press: true, gone: 0.35, turn: k >= t ? Math.min(240, 80 + (k - t) * 12) : undefined},
      eng: {x: 200, flip: true, pose: {arm: 'phone', mouth: 'rest', headset: 'off'}}, rima: {light: 'house'}, blimp: {size: 4, x: 154, y: 42}});
  },
});
void STG;
export const SCENE = defineScene({scene: '11', layouts: L.all});
