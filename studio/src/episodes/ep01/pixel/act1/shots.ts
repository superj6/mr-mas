// MR. MAS — Ep1 pixel v3.2, ACT ONE: one layout per shot of the v3.2 lock (sc 5–12, 51 shots, 5:29.8; the timeline
// show/reel/ep01-v32/ep01-v32-act1.json, script draft 8.1). The `v3-shots-act1` pass, 2026-09-27/28 (its v3 round, the
// v3.1 round, then v3.2: Mas's moves read on screen: the button press, the million post, the call, the click that
// ships GTP-4). Built on the art-a modules (show/episodes/ep01/production/full-v3/art/art-a.md, §7 for v3.1); the few
// pieces those modules fix inside a packaged setup (a camera x, a lifted prop, a speaking mouth in a composite) are
// re-composed from their exported parts in ./extras.ts. No existing drawing is edited.
//
// Grammar (pov-and-framing §4, flow-and-continuity §2a): every new place opens on the room with its people (5.02, 8.02,
// 9.01, 9.10, 11.01 after its match cut, 12.02); holds breathe (Gerg's keys, blinks, a sleep LED, a passer-by, the far
// screensaver, rack LEDs, the siren, Sydney's dots) and hold STEADY (no 1-px drifts); Mas never blinks (§4.3 rule 10),
// his tells are the eye, the lids and the one-pixel smile. Mouths come from the takes (lipsync), faces per framing, and
// only on spoken lines: his inner voice never moves his mouth. Plates are names only, except the gag plates the beat
// plan keeps (RADNUS · POLITELY ON FIRE, THE FOUNDERS · SUMMONED., NOLE · BUILDING HIS OWN), CLOD's product plate and
// Tasya's freeze card. Stick scaffolding in the lock's texts (`mas types: …`, `his sheet: …`, `USERS: …` over a
// spinning blur) is not drawn: the picture carries it. REZEILE is printed on EMIT's page (no pipeline plate).
//
// v3.1 (the lead's rulings): no band prompt anywhere (the letterbox stays dark: the cursor lives in the scene); launch
// night's bullpen setups warmed a step (`warm: 1`); face lights on Alyi's reflection two steps (5.05, v3-5.06b, 5.09's
// rack, 12.05); the v3.1 collars (the gold third, taller points) on every collar call; the match cut on Gerg's laptop
// seen over his shoulder in both rooms, the lids matched; cleanUnder on 5.11.
import {defineSegment, layouts, mk, mouth, roomMouth, room3Mouth, lipOn, talking, drawPlate, RH, ACCENT, shiftRoom, whipSmear, pt} from '../kit';
import type {PxShot, LayoutOut} from '../kit';
import {Buf, rect, bayer} from '../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../shared/pixel/palette';
import {Mask} from '../../../../shared/pixel/mask';
import {nameCard} from '../../../../shared/pixel/ui';
import {drawLaunchWide, drawLaunch2S, drawLaunchGlass, drawLaunchMcuRima, drawLaunchMcuMas, drawLaunchOTSLaptop, drawLaunchMcuPF, drawCursor, launchBackM, otsShoulder, LAUNCH} from '../../../../shared/pixel/rooms/bullpen-launch';
import {drawButtonECU, BUTTON_ECU} from '../../../../shared/pixel/kits/launch-button';
import {drawChatECU} from '../../../../shared/pixel/kits/chat-window';
import type {ChatLine} from '../../../../shared/pixel/kits/chat-window';
import {drawHoleHigh, drawGpuTear, HIGH} from '../../../../shared/pixel/rooms/drill';
import {drawAlertInsert, drawPhoneLockOTS} from '../../../../shared/pixel/kits/phone-alert';
import {drawElgoogLobby} from '../../../../shared/pixel/rooms/elgoog-lobby';
import type {ElgoogState} from '../../../../shared/pixel/rooms/elgoog-lobby';
import {radnusFlameAt} from '../../../../shared/pixel/cast/radnus';
import {drawDealWide, dealFreeze, drawDeal2S, drawDealMcuMas, drawDealGerg2S, DEAL} from '../../../../shared/pixel/rooms/lobby-deal';
import type {DealWideState} from '../../../../shared/pixel/rooms/lobby-deal';
import {drawCheck, drawCheckFloor} from '../../../../shared/pixel/kits/novelty-check';
import {drawTvScreen, tvLedger} from '../../../../shared/pixel/kits/tv-news';
import {drawDuelSplit, drawDemoArrival} from '../../../../shared/pixel/rooms/duel-split';
import {drawLetterOTS, drawLetterPage, drawClipboard} from '../../../../shared/pixel/kits/pause-letter';
import {drawNoleDesk} from '../../../../shared/pixel/rooms/nole-desk';
import {drawPleaseHigh, drawPleaseECU} from '../../../../shared/pixel/kits/please-sheet';
import {drawEmitDrop} from '../../../../shared/pixel/kits/emit-oped';
import {drawCallScreenECU} from '../../../../shared/pixel/rooms/launch-call';
import {drawMillionPost} from '../../../../shared/pixel/kits/act1-v32';
import {drawKeyRingECU} from '../../../../shared/pixel/kits/key-ring-insert';
import {drawFoundersCutIn} from '../../../../shared/pixel/rooms/elgoog-cutin';
import {drawGergLaptopPOV} from '../../../../shared/pixel/kits/gerg-laptop';
import {drawSydneyTvExit, drawSydneyWide, drawSydney2SMas, drawSydney2STasya, drawSydneyGerg2S, SYD_WIDE} from '../../../../shared/pixel/rooms/lobby-sydney';
import type {SydneyFace} from '../../../../shared/pixel/cast/sydney';
import type {RimaBoardPose} from '../../../../shared/pixel/cast/rima-board';
import {masWalkAt} from '../../../../shared/pixel/cast/mas-stand';
import {gergTypeAt} from '../../../../shared/pixel/cast/gerg';
import {
  blinkLid, cursorPath, ease2, sleepLed, fingerECU, otsRima, glassCount, deal2S, passerBy, guestCard, bottomShade, grains,
  castMask, chatCard, twelfthKey, callMcu, handOnPhone, paneButton,
} from './extras';
import {LOCK} from './data';

const L = layouts();
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lineOf = (sh: PxShot, id: string) => sh.lines.find((l) => l.id === id) ?? null;
const inLine = (sh: PxShot, id: string, k: number, pre = 0, post = 0) => { const l = lineOf(sh, id); return !!l && k >= l.s - pre && k < l.e + post; };
const textOf = (sh: PxShot, kind: string, sub = '') => sh.texts.find((t) => t.kind === kind && t.text.includes(sub)) ?? null;
/** a name plate from the lock's texts, placed by the layout (default look: the host's drawPlate, typed on) */
const plate = (fb: Buf, sh: PxShot, k: number, sub: string, x: number, y: number, who: string | number) => {
  const t = textOf(sh, 'plate', sub) ?? textOf(sh, 'label', sub);
  if (!t || k < t.s || k >= t.e) return;
  drawPlate(fb, t, k - t.s, x, y, typeof who === 'number' ? who : ACCENT[who] ?? PAL.C6);
};
/** the same plate, shown over a window the layout picks inside the lock's (a long hold keeps its gag plate ~4 s) */
const plateWin = (fb: Buf, sh: PxShot, k: number, sub: string, x: number, y: number, col: number, s0: number, e0: number) => {
  const t = textOf(sh, 'plate', sub) ?? textOf(sh, 'label', sub);
  if (!t || k < s0 || k >= e0) return;
  drawPlate(fb, {...t, kind: 'plate', s: s0, e: e0}, k - s0, x, y, col);
};
/** a prop drawn BEHIND the lobby's cast: the wide with and without its figures; the prop goes on the bare plate and
 *  every pixel the figures changed is kept */
const underCast = (fb: Buf, f: number, st: DealWideState, prop: (b: Buf) => void) => {
  drawDealWide(fb, f, st);
  const bare = new Buf(480, 270, PAL.N0);
  drawDealWide(bare, f, {...st, mas: null, tasya: null, gerg: null});
  const withProp = bare.clone(); prop(withProp);
  const cast = castMask(fb, bare);
  for (let i = 0; i < 480 * RH; i++) if (!cast[i]) fb.c[i] = withProp.c[i];
};
const room2 = (v: 'open' | 'rest') => v; // readability at the call sites
/** a mouth for SPOKEN lines only: the face table names a speaker, and lipsync would move Mas's lips on his V.O. too.
 *  His inner voice never moves his mouth */
const saying = (sh: PxShot, k: number, who: string) => sh.lines.some((l) => l.who === who && l.kind === 'dialogue' && k >= l.s - 2 && k < l.e + 2);
const say = (sh: PxShot, k: number, who: string) => (saying(sh, k, who) ? mouth(sh, k, who) : 'rest');
const openRest = (sh: PxShot, k: number, who: string): 'open' | 'rest' => room2(roomMouth(sh, k, who));

/** the collars' drawing everywhere in v3.1 (mas-collars 'v31': the gold third, taller points; one design across the
 *  episode, so the pop at 9.08 adds a collar and changes nothing else) */
const CS = 'v31' as const;
/** his breath at the desk (the desk sprite's breathe drawing, a slow held loop) */
const breathe = (f: number) => (Math.floor(f / 36) % 2) as 0 | 1;

// ================================================================== SC 5 · LAUNCH NIGHT, THE BULLPEN (warm: 1)
L.add('5.01', {
  st: 'PROP-BEIGE-BUTTON launch-button drawButtonECU (the button where the 1993 OK sat, its strip `research preview`) + extras.sleepLed (his closed laptop asleep in the corner, breathing)',
  draw: (fb, k, sh, f) => { drawButtonECU(fb, f, {}); sleepLed(fb, f); },
});
L.add('5.02', {
  st: 'ROOM-BULLPEN-LAUNCH drawLaunchWide {warm: 1, life} (the arrival, held, launch night warmed a step by its practicals: the hall\'s tungsten, his desk lamp, a far lamp left on; a far screensaver, a car\'s light on the bridge, and a passer-by crossing the hall\'s lit far end as we arrive · Gerg typing in his green, Rima at LOW-KEY twice-underlined, Alyi in the glass, Mas at the end desk breathing); no voice over the wide: room tone, Rima steps back from her board, the cursor drifts in and parks on the button, in the scene (drawCursor), then Gerg\'s "Okay, the build\'s green." at room scale; the letterbox stays dark',
  face: {GERG: 'room'},
  marks: {cursor: ['f', 43], rima: ['f', 84], pass: ['f', 0]},
  draw: (fb, k, sh, f) => {
    const r = mk(sh, 'rima', 84), c = mk(sh, 'cursor', 43), p0 = mk(sh, 'pass', 0);
    // the passer-by crosses the hall's far end in 36 frames (whole pixels, held on 2s), as we arrive
    const pk = k - (k % 2) - p0, passer = pk >= 0 && pk <= 36 ? pk / 36 : null;
    drawLaunchWide(fb, f, {
      warm: 1, life: {passer, flicker: true, car: true},
      underlines: 2, alyi: 'there', laptop: 'dark',
      rima: {body: k < r + 4 ? 'write' : 'stand', head: 'back'},
      mas: {head: 'turn', breathe: breathe(f)},
      gerg: {mouth: openRest(sh, k, 'GERG'), look: 0},
    });
    if (k >= c) { const [x, y] = cursorPath(k, c, c + 27, [262, 92], [131, 135]); drawCursor(fb, x, y); }
  },
});
L.add('5.03', {
  st: 'ROOM-BULLPEN-LAUNCH drawLaunch2S {warm: 1} (desk to desk: Mas fg left, two collars (v31), his desk lamp\'s key on his face; Gerg typing in his green, lip-synced, not looking up; behind him Rima at the board, her back to us (cast/rima-board lower: she speaks from the board without turning round); the button and the parked cursor); Mas\'s eyes go to Rima\'s board on her line and his prediction; the plate GERG MOCKBRAN · CO-FOUNDER by Gerg',
  face: {GERG: 'lip'},
  marks: {rimaOn: ['on', 'e1-a1-5-02', 0], voEnd: ['end', 'v3-vo-02', 10]},
  draw: (fb, k, sh, f) => {
    const lid = blinkLid(k, 3, 113);
    drawLaunch2S(fb, f, {
      warm: 1, collarStyle: CS, cursor: true, underlines: 2, laptop: 'dark', rima: {body: 'lower'},
      gerg: {head: 'type', mouth: mouth(sh, k, 'GERG'), lid: lid === 2 ? 2 : 1},
      mas: {look: k >= mk(sh, 'rimaOn', 47) && k < mk(sh, 'voEnd', 164) ? 0 : 1},
    });
    plate(fb, sh, k, 'GERG', 302, 154, 'GERG');
  },
});
L.add('5.04', {
  st: 'extras.otsRima {warm: 1} = ROOM-BULLPEN-LAUNCH launchBackM (warm, camX 470, held steady) + rima-speak portrait (lip-synced; blinks; the desk lamp\'s key on her face, face only; she smooths her lapel before her question, lifts her brow waiting on him, firms on "a fortune", half-lids at Gerg\'s "v2 problem") + his desk\'s edge + otsShoulder (its rim in the lamp\'s tungsten) + the button and cursor lifted clear of the V.O. line; Alyi small and soft in the glass; the plate RIMA TAMURI · CTO',
  face: {RIMA: 'lip'},
  marks: {ask: ['on', 'e1-a1-5-06', 0], askEnd: ['end', 'e1-a1-5-06', 0], answered: ['end', 'e1-a1-5-07', 6], fortune: ['w', 'e1-a1-5-08', 'fortune', -6], v2: ['on', 'e1-a1-5-09', 4]},
  draw: (fb, k, sh, f) => {
    const ask = mk(sh, 'ask', 232), askEnd = mk(sh, 'askEnd', 366), ans = mk(sh, 'answered', 507), fortune = mk(sh, 'fortune', 630), v2 = mk(sh, 'v2', 665);
    const brow = k >= askEnd - 14 && k < ans ? 'lift' : k >= fortune && k < v2 ? 'firm' : 'level';
    const hand = k >= ask - 6 && k < ask ? 'smooth0' : k >= ask && k < ask + 6 ? 'smooth1' : 'none';
    const bl = blinkLid(k, 5, 131);
    const lid = k >= v2 ? (bl === 2 ? 2 : 1) : bl;
    otsRima(fb, f, {
      camX: 470, cursor: true, warm: 1,
      rima: {mouth: mouth(sh, k, 'RIMA'), lid, brow, hand},
      alyi: {soft: true, eyes: blinkLid(k, 9, 157) === 2 ? 'closed' : 'open', mouth: 'rest', t: f},
    });
    plate(fb, sh, k, 'RIMA', 122, 150, 'RIMA');
  },
});
L.add('5.05', {
  st: 'ROOM-BULLPEN-LAUNCH drawLaunchGlass {faceLight: 2, warm: 1} (the close glass: Alyi\'s reflection in its doorway, lip-synced, a face light two steps up (face only: one barely shows on the glass), the desk lamp reflected low; the cut on the turn); the plate ALYI · CO-FOUNDER beside him',
  face: {ALYI: 'lip'},
  draw: (fb, k, sh, f) => {
    drawLaunchGlass(fb, f, {alyi: {mouth: mouth(sh, k, 'ALYI'), eyes: 'open', t: f}, faceLight: 2, warm: 1});
    plate(fb, sh, k, 'ALYI', 318, 118, 'ALYI');
  },
});
L.add('5.06', {
  st: 'ROOM-BULLPEN-LAUNCH drawLaunchMcuRima {warm: 1} (Rima turned from the glass to Mas, waiting, the lamp\'s key on her face: her beat); brow up while she waits, a blink, and after "…still a preview." her lids come half down (his answer landing on her face)',
  marks: {answer: ['end', 'e1-a1-5-11', 4]},
  draw: (fb, k, sh, f) => {
    const a = mk(sh, 'answer', 58);
    const bl = blinkLid(k, 0, 1000);
    drawLaunchMcuRima(fb, f, {warm: 1, rima: {brow: k < a ? 'lift' : 'level', lid: k >= a + 2 ? (bl === 2 ? 2 : 1) : k >= 8 && k < 14 ? blinkLid(k - 8, 0, 1000) : 0}});
  },
});
L.add('v3-5.06b', {
  st: 'ROOM-BULLPEN-LAUNCH drawLaunchGlass {faceLight: 2, warm: 1} (the 5.05 setup held two beats on Alyi in the glass, still watching the button, his face lit two steps: one slow blink; his question unanswered)',
  draw: (fb, k, sh, f) => {
    const shut = k >= 26 && k < 34;
    drawLaunchGlass(fb, f, {alyi: {eyes: shut ? 'closed' : 'open', t: f}, faceLight: 2, warm: 1});
  },
});
L.add('5.07', {
  st: 'ROOM-BULLPEN-LAUNCH drawLaunch2S {warm: 1, rima} (the board seed: Gerg one key with a flourish, then "Your button." without looking up, lip-synced; Mas\'s head goes down to the button; behind Gerg, Rima at the board, her back to us (cast/rima-board): she draws the third underline on the marker\'s squeak, caps the marker and asks the room "Did anyone tell the rest of the board?" without turning round; Gerg answers with the phrase, looking up, lip-synced; nobody else answers; the hold into the click)',
  face: {GERG: 'lip'},
  marks: {key: ['snd', 'key_tap_space', 1, 0], squeak: ['snd', 'marker_write_q', 1, 0], button: ['end', 'e1-a1-5-12', 8], ask: ['on', 'v31-a1-0001', 0], answerEnd: ['end', 'v31-a1-0002', 14]},
  draw: (fb, k, sh, f) => {
    const key = mk(sh, 'key', 4), sq = mk(sh, 'squeak', 79), down = mk(sh, 'button', 76), ask = mk(sh, 'ask', 91), after = mk(sh, 'answerEnd', 187);
    const talk = lipOn(sh, k, 'GERG');
    const gerg = {head: (talk ? 'talk' : 'type') as 'talk' | 'type', mouth: mouth(sh, k, 'GERG'), type: (k >= key && k < key + 3 ? 2 : k >= key + 3 && k < key + 6 ? 1 : 0) as 0 | 1 | 2};
    const wet = clamp((k - sq) / 12, 0, 1);
    // Rima: marker down at her side · poised at the line's start · the underline on the squeak (her arm follows the
    // wet end) · holding at its end · the cap going on as she asks · capped · the marker lowered once Gerg has answered
    const rima: RimaBoardPose = k < sq - 8 ? {body: 'lower'} : k < sq ? {body: 'underline', reach: 0} : k < ask ? {body: 'underline'} : k < ask + 8 ? {body: 'cap0'} : k < after ? {body: 'cap1'} : {body: 'lower'};
    drawLaunch2S(fb, f, {warm: 1, collarStyle: CS, cursor: true, underlines: k < sq ? 2 : 3, wet: k < sq ? 1 : wet, laptop: 'dark', rima, gerg, mas: {head: k >= down ? 'down' : '34', lid: k >= down ? 1 : 0}});
  },
});
L.add('5.08', {
  st: 'PROP-BEIGE-BUTTON drawButtonECU via extras.fingerECU (the parked cursor on the cap, then his finger comes in without a hover in three held steps and takes the cursor\'s place: touch, the click, the LED lights, nothing happens); no band text',
  marks: {click: ['snd', 'dialog_ok_click', 1, 0]},
  draw: (fb, k, sh, f) => {
    const c = mk(sh, 'click', 24), a0 = c - 16;
    const steps: Array<[number, number, number]> = [[a0, -96, -64], [a0 + 4, -48, -32], [a0 + 8, -14, -9], [a0 + 12, 0, 0]];
    const lit = k >= c;
    if (k < a0) {
      drawButtonECU(fb, f, {});
      drawCursor(fb, BUTTON_ECU[0] + 1, BUTTON_ECU[1] + 1);
    } else {
      const st = steps.filter(([s]) => k >= s).pop()!;
      const press: 0 | 1 | 2 = k >= c && k < c + 12 ? 2 : k >= c - 3 ? 1 : 0;
      fingerECU(fb, press, st[1], st[2], lit);
      if (k < a0 + 8) drawCursor(fb, BUTTON_ECU[0] + 1, BUTTON_ECU[1] + 1);
    }
  },
});
L.add('5.09', {
  st: 'extras.glassCount {warm: 1, rack} = ROOM-BULLPEN-LAUNCH launchBackM (camX 460: Alyi\'s reflection in the glass, lip-synced, low, to Mas only; the focus racks to the glass on his first word in a held half step: his face lit two steps, Rima at the board softened; he turns out of the doorway and goes on his footsteps) + rima-stand at the board (capped, back to them) + Mas\'s portrait soft in the fg (two rungs down, lip-synced; he turns from the empty glass to the room for "let\'s see if anyone notices.") + the button under his hand; the hold after',
  face: {ALYI: 'lip', MAS: 'lip'},
  marks: {steps: ['snd', 'synth:steps_far', 1, 0], turn: ['on', 'e1-a1-5-16', -6], rack: ['on', 'e1-a1-5-13', 0]},
  draw: (fb, k, sh, f) => {
    const go = mk(sh, 'steps', 244), turn = mk(sh, 'turn', 262), rk = mk(sh, 'rack', 28);
    const alyi = k < go - 6 ? {mouth: mouth(sh, k, 'ALYI'), eyes: 'open' as const, t: f} : k < go + 2 ? {soft: true, mouth: 'rest' as const, eyes: 'open' as const, t: f} : 'gone' as const;
    const rack = (k < rk - 2 ? 0 : k < rk ? 1 : 2) as 0 | 1 | 2;
    glassCount(fb, f, {warm: 1, rack, alyi, rima: {body: 'stand', head: 'back'}, mas: {mouth: say(sh, k, 'MAS'), head: k >= turn ? 'front' : '34'}});
  },
});
// ---- the chat: the bubble lights before anyone types
const BOT1 = 'What a great question!', BOT2 = "Brilliant! You're clearly a visionary.", USER = 'is anyone there?';
L.add('5.10', {
  st: 'ROOM-BULLPEN-LAUNCH drawLaunchOTSLaptop {warm: 1} + UI-CHAT drawChatWindow + CAST-CHATGTP (the room behind a step warmer; the bubble idle, then lit with its glow before anyone types; it talks on its lines; its replies type on; he types his one line in the input row, sends it; the plate CHATGTP · USERS: 0 is the window\'s own) · Rima leaning in, lip-synced, blinking · Gerg\'s hands typing at the frame edge',
  face: {RIMA: 'lip'},
  marks: {light: ['snd', 'ui_toast_pop', 1, 0], bot1: ['on', 'e1-a1-5-19', 0], typing: ['snd', 'synth:keys', 2, 0], bot2: ['on', 'e1-a1-5-21', 0]},
  draw: (fb, k, sh, f) => {
    const light = mk(sh, 'light', 132), b1 = mk(sh, 'bot1', 149), ty = mk(sh, 'typing', 234), b2 = mk(sh, 'bot2', 272), sent = b2 - 6;
    const lines: ChatLine[] = [];
    if (k >= b1) lines.push({who: 'bot', text: BOT1, n: Math.floor((k - b1) * 1.3)});
    if (k >= sent) lines.push({who: 'user', text: USER});
    const input = k >= ty && k < sent ? USER.slice(0, Math.floor((k - ty) * 0.6)) : '';
    const bubble = k < light ? 'idle' : talking(sh, k, 'CHATGTP') ? 'talk' : 'lit';
    drawLaunchOTSLaptop(fb, f, {
      f, gergHands: true, warm: 1,
      rima: {mouth: mouth(sh, k, 'RIMA'), lid: blinkLid(k, 2, 101), brow: inLine(sh, 'e1-a1-5-20', k, 0, 12) ? 'firm' : 'level'},
      chat: {bubble, users: 0, lines, input, caret: k >= ty - 10 && k < sent && Math.floor(k / 8) % 2 === 0},
    });
    // the second reply: the window's own card, set below the product plate (the window would stack it over the plate)
    if (k >= b2) chatCard(fb, 152, 88, 242, BOT2.slice(0, Math.floor((k - b2) * 1.1)));
  },
});
L.add('5.11', {
  st: 'ROOM-BULLPEN-LAUNCH drawLaunchMcuMas {warm: 1, cleanUnder} (lit from below by the chat as a clean rim, no dither on his skin; the lamp\'s warm rim down his left side; the bullpen soft behind; collars v31): he reads it, says "it likes me." (lip-synced) and keeps the one-pixel smile until Gerg deflates it; his eyes go back to the screen on the V.O., and the smile comes back on "twice"',
  face: {MAS: 'lip'},
  marks: {said: ['end', 'e1-a1-5-22', 0], deflate: ['w', 'e1-a1-5-23', 'inspired', 0], again: ['w', 'v3-vo-05', 'still', 0], twice: ['w', 'v3-vo-05', 'twice', 6]},
  draw: (fb, k, sh, f) => {
    const said = mk(sh, 'said', 45), deflate = mk(sh, 'deflate', 110), again = mk(sh, 'again', 150), twice = mk(sh, 'twice', 176);
    const smile = (k >= said && k < deflate) || k >= twice;
    const m = saying(sh, k, 'MAS') ? mouth(sh, k, 'MAS') : smile ? 'smile' : 'rest';
    drawLaunchMcuMas(fb, f, {warm: 1, cleanUnder: true, collarStyle: CS, mas: {mouth: m, look: k < 16 || k >= again ? -1 : 1}});
  },
});
L.add('5.12', {
  st: 'UI-CHAT drawChatECU (the bubble; its plate\'s counter ticks 0 → 1 · 2 · 7 · 104 · 1,389 on the counter rolls, then the digits blur; the bubble glows on the first tick and talks as the count climbs)',
  marks: {t1: ['snd', 'counter_roll', 1, 0], t2: ['snd', 'counter_roll', 2, 0], t3: ['snd', 'counter_roll', 3, 0]},
  draw: (fb, k, sh, f) => {
    const t1 = mk(sh, 't1', 12), t2 = mk(sh, 't2', 30), t3 = mk(sh, 't3', 43);
    let users = 0, roll: number | undefined, spin = false;
    if (k >= t1 && k < t1 + 4) { users = 0; roll = 0.5; }
    else if (k >= t1 + 4 && k < t1 + 10) users = 1;
    else if (k >= t1 + 10 && k < t2 - 6) users = 2;
    else if (k >= t2 - 6 && k < t2) users = 7;
    else if (k >= t2 && k < t2 + 7) users = 104;
    else if (k >= t2 + 7 && k < t3) users = 1389;
    else if (k >= t3) { users = 1389; spin = true; }
    drawChatECU(fb, f, {users, roll, spin, bubble: k >= t2 ? 'talk' : 'lit', glow: k >= t1 && k < t1 + 6});
  },
});

// ================================================================== SC 6 · THE ODOMETER DRILL
L.add('6.01', {
  st: 'UI-CHAT drawChatECU st.grow (the counter leaves the plate and grows in three held drawings to the desk-sized machine, spinning) under "someone noticed."',
  marks: {g1: ['txt', 'USERS: 12,408', 'at', 0], g2: ['txt', 'USERS: 88,190', 'at', 0], g3: ['txt', 'USERS: 301,775', 'at', 0]},
  draw: (fb, k, sh, f) => {
    const g1 = mk(sh, 'g1', 4), g2 = mk(sh, 'g2', 38), g3 = mk(sh, 'g3', 79);
    const grow = (k < g1 ? 0 : k < g2 ? 1 : k < g3 ? 2 : 3) as 0 | 1 | 2 | 3;
    drawChatECU(fb, f, {grow, bubble: grow === 0 ? 'lit' : 'talk', spin: true, users: 1389});
  },
});
L.add('6.02', {
  st: 'ROOM-BULLPEN-LAUNCH drawLaunchWide {warm: 1} st.odo (launch night\'s warm wide; the desk-sized odometer on his desk, dropping through it in two held drawings on the clunk, the hole in the top) + CAST-GERG-POSES armsUp (Gerg jumps up, the count) + rima-stand (beside his desk, then peering down); a whole-pixel shake on the clunk, splinters settling, his lids down to the hole',
  marks: {clunk: ['snd', 'letter_clunk', 1, 0]},
  draw: (fb, k, sh, f) => {
    const c = mk(sh, 'clunk', 0);
    const stage = k < c + 1 ? 'desk' : k < c + 4 ? 'drop1' : k < c + 8 ? 'drop2' : 'gone';
    drawLaunchWide(fb, f, {
      warm: 1, underlines: 3, alyi: 'gone', laptop: 'chat',
      rima: k < c + 14 ? {body: 'stand', head: 'face', at: [196, 166], flip: true} : {body: 'peer', head: 'down', at: [196, 166], flip: true},
      odo: {stage}, gerg: {armsUp: k >= c + 2}, mas: {head: 'turn', lid: k >= c + 10 ? 1 : 0, breathe: breathe(f)},
    });
    if (k >= c + 4 && k < c + 22) grains(fb, f, 100, 150, 130, 142, 5, 61, PAL.G3);
    const dy = [2, -2, 1, -1, 1, 0][k - c] ?? 0;
    if (dy) shiftRoom(fb, 0, dy);
  },
});
L.add('6.06', {
  st: 'INSERT-MILLION-POST drawMillionPost (far down, wedged in the bedrock: the last wheel settles in held steps on the ratchet, then holds legible, 1,000,000; on the post\'s click HIS post pops over it in post-card\'s own UI and held steps, his avatar and name: "CHATGTP launched on wednesday. today it crossed 1 million users!" · DEC 4 · 11:35 PM, held to read) + grit trickling round the wheel, clear of the card',
  marks: {r: ['snd', 'odometer_ratchet', 1, 0], post: ['snd', 'post_click', 1, 0]},
  draw: (fb, k, sh, f) => {
    const r = mk(sh, 'r', 3), p = mk(sh, 'post', 24);
    const settle = k < r ? 0 : k < r + 5 ? 1 : k < r + 9 ? 2 : 3;
    // the card opens in post-card's three held steps (2 frames each), then holds
    drawMillionPost(fb, f, {settle, k: k < p ? null : Math.min(3, Math.floor((k - p) / 2))});
    grains(fb, f, 260, 360, 84, 120, 5, 71, PAL.D2);
  },
});
L.add('6.08', {
  st: 'SET-DRILL drawHoleHigh (the hole from above, Rima peering down it: "Low-key." / "Very low. Basement."; then the tile pops back up out of it like toast on the pop, the red glow climbs, the $ odometer spins in beside the first, the racks step green → amber → red on the palette steps, heat shimmer) ',
  marks: {pop: ['snd', 'tower_pop', 1, 0], dollar: ['snd', 'synth:ratchet_fast', 1, 0], amber: ['snd', 'palette_step_Ab', 1, 0], red: ['snd', 'palette_step_C', 1, 0]},
  draw: (fb, k, sh, f) => {
    const pop = mk(sh, 'pop', 94), dol = mk(sh, 'dollar', 111), amber = mk(sh, 'amber', 175), red = mk(sh, 'red', 235);
    // the tile that fell in comes back up like toast (held steps), sits up while the heat climbs, and drops back in
    const tile = k < pop ? 'gone' : k < pop + 2 ? 1 : k < amber - 4 ? 2 : k < amber - 2 ? 1 : 'gone';
    drawHoleHigh(fb, f, {tile: tile as 'gone' | 1 | 2, rima: true, glow: k < pop ? 1 : k < red ? 2 : 3, racks: k < amber ? 0 : k < red ? 1 : 2, dollar: k >= dol});
  },
});

// ================================================================== SC 7 · THE BILL
L.add('7.01', {
  st: 'CAST-MAS-TEAR drawLaunchMcuPF (looking down the hole, the bullpen stepped down behind him, the hole\'s red rim under his jaw rising a step as Rima speaks; the tear wells and slides down his cheek a pixel every 4 f, then holds at the jaw; on Rima\'s word "tear" it catches the light, its one bright pixel the hottest white); "it\'s the bill." lip-synced with his eyes up toward her, then down again for "mostly the bill."',
  face: {MAS: 'lip'},
  marks: {bill: ['on', 'e1-a1-7-02', -4], billEnd: ['end', 'e1-a1-7-02', 4], tear: ['w', 'v31-a1-0003', 'tear', 0]},
  draw: (fb, k, sh, f) => {
    const b0 = mk(sh, 'bill', 67), b1 = mk(sh, 'billEnd', 98), catchK = mk(sh, 'tear', 40);
    const up = k >= b0 && k < b1;
    // the tear wells at his lower lid and holds a second (Rima sees it), then slides a pixel every 4 f to reach his jaw as he says it
    const well = Math.max(0, b0 - 56);
    drawLaunchMcuPF(fb, f, {tear: k < well ? 0 : k - well, tearCatch: k >= catchK, collarStyle: CS, glow: k < 30 ? 1 : 2, mas: {mouth: say(sh, k, 'MAS'), lid: up ? 0 : 1, look: up ? 1 : 0}});
  },
});
L.add('7.02', {
  st: 'SET-DRILL: drawHoleHigh (the tear falls down the shaft) → drawGpuTear (it lands on a red-hot GPU: the splash, tssss, three held puffs) → drawHoleHigh again, the last steam rising, and under it his hand comes down over the desk\'s edge onto his phone at the top edge (extras.handOnPhone, held steps): the call he\'s about to make (the phone stays dark: its red is the call\'s end now); three setups inside the stick\'s one beat',
  marks: {hiss: ['snd', 'steam_hiss', 1, 0], phone: ['txt', '( ! )', 'at', 0], hand: ['txt', '( ! )', 'at', 14]},
  draw: (fb, k, sh, f) => {
    const land = mk(sh, 'hiss', 10), ph = mk(sh, 'phone', 48), hd = mk(sh, 'hand', 62);
    if (k < land) { drawHoleHigh(fb, f, {tile: 'gone', glow: 3, racks: 2, dollar: true, tear: k / land, phone: 'dark'}); return; }
    if (k < ph) { drawGpuTear(fb, f, {k: k - land}); return; }
    drawHoleHigh(fb, f, {tile: 'gone', glow: 3, racks: 2, dollar: true, tear: null, phone: 'dark'});
    handOnPhone(fb, k < hd ? 0 : k < hd + 4 ? 1 : k < hd + 8 ? 2 : 3);
    // the last of the steam rising out of the shaft (held on 3s)
    const B = HIGH.bottom, rise = Math.floor((k - ph) / 3);
    for (let i = 0; i < 6; i++) { const x = B.x0 + 14 + ((i * 7) % 26), y = B.y0 + 10 - rise * 2 - i * 3; if (y > HIGH.hole.y0) { fb.set(x, y, PAL.G5); fb.set(x + 1, y, PAL.G4); } }
  },
});

// ---- v32-7.03 · THE CALL (draft 8.1; the lead's ruling on art-a §8: open on the ECU of the phone ringing on the desk,
// the contact large; then Mas with the phone at his ear, its screen to him, at normal size)
L.add('v32-7.03', {
  st: 'SET-CALL drawCallScreenECU (his phone on the desk, ringing on the ring: TASYA · MACROSOFT over the key-ring avatar, large, the tile\'s red on the desk; the world carries the name, no pipeline plate) → extras.callMcu (later that night at his end desk, 7.01\'s fallaway behind him, the tile\'s red from below as a clean rim: the phone at his ear, its back to us, a real phone\'s size; "Mas." through the filter; his full ask lip-synced, "it\'s the bill. we\'re going to need more servers."; "I\'ll bring a pen." and the one-pixel smile; he lowers the phone in a held step; on the hang-up it lights red before it reaches the desk, its red on his chin, and his eyes drop to it)',
  face: {MAS: 'lip'},
  marks: {ring: ['snd', 'call_ring', 1, 0], hello: ['on', 'v32-a1-0002', -6], pen: ['end', 'v32-a1-0004', 0], hang: ['snd', 'handset_hangup', 1, 0]},
  draw: (fb, k, sh, f) => {
    const ring = mk(sh, 'ring', 7), cut = mk(sh, 'hello', 30), pen = mk(sh, 'pen', 173), hang = mk(sh, 'hang', 199);
    if (k < cut) { drawCallScreenECU(fb, k < ring ? 0 : f, {state: 'ringing'}); return; }
    const down = pen + 6;
    const phone = k < down ? 'ear' : k < down + 6 ? 'mid' : k < hang + 2 ? 'low' : 'red';
    const m = saying(sh, k, 'MAS') ? mouth(sh, k, 'MAS') : k >= pen && k < hang + 2 ? 'smile' : 'rest';
    callMcu(fb, f, {phone, mas: {mouth: m, lid: phone === 'red' ? 1 : 0, look: 0}});
  },
});

// ================================================================== SC 8 · THE CODE RED, ON HIS PHONE
const elgoog = (f: number, st: ElgoogState) => { const b = new Buf(480, 270, PAL.N0); drawElgoogLobby(b, f, st); return b; };
L.add('8.01', {
  st: 'UI-ALERT drawAlertInsert (his phone on the desk, the red alert ELGOOG · CODE RED; his thumb comes over it and taps; the app zooms to full-bleed in held steps, the Elgoog lobby seen 1:1 through the growing screen: ROOM-ELGOOG with its status bar)',
  marks: {tap: ['snd', 'key_tap_soft_02', 1, 0]},
  draw: (fb, k, sh, f) => {
    const tap = mk(sh, 'tap', 31);
    const thumb = k < tap - 10 ? 'none' : k < tap ? 'over' : k < tap + 4 ? 'tap' : 'none';
    const zoom = k < tap + 6 ? 0 : k < tap + 11 ? 1 : k < tap + 16 ? 2 : 3;
    drawAlertInsert(fb, f, {k: 48 + k, thumb, zoom, pov: zoom ? elgoog(f, {slab: 0, chrome: true, radnus: {arm: 'fold', fire: null}}) : undefined});
  },
});
L.add('8.02', {
  st: 'ROOM-ELGOOG drawElgoogLobby full-bleed on his phone (the status bar): the slab slides aside in held steps on the shove, the siren rises on its scissor lift in three held drawings and starts to turn; Radnus beside the hole, arms folded, until the heat lights his sleeve',
  marks: {shove: ['snd', 'tile_shove', 1, 0]},
  draw: (fb, k, sh, f) => {
    const s = mk(sh, 'shove', 1);
    const slab = k < s ? 0 : k < s + 3 ? 1 : k < s + 6 ? 2 : 3;
    const lift = k < s + 15 ? 0 : k < s + 27 ? 1 : k < s + 39 ? 2 : 3;
    drawElgoogLobby(fb, f, {slab, lift, turning: lift >= 3 && k >= s + 43, chrome: true, radnus: {arm: 'fold', fire: k >= s + 45 ? radnusFlameAt(f) : null}});
  },
});
L.add('8.03', {
  st: 'ROOM-ELGOOG (the siren up and turning) + CAST-RADNUS beside the hole: he pats the sleeve out, it relights; "Everyone, it\'s fine." at room scale (the call\'s take); the gag plate RADNUS · POLITELY ON FIRE on the relight',
  face: {RADNUS: 'room'},
  marks: {relight: ['txt', 'RADNUS', 'at', 0]},
  draw: (fb, k, sh, f) => {
    const rl = mk(sh, 'relight', 12);
    const radnus = k < rl - 6 ? {arm: 'pat' as const, fire: 3 as const} : k < rl ? {arm: 'ext' as const, fire: null} : {arm: 'ext' as const, fire: radnusFlameAt(f)};
    drawElgoogLobby(fb, f, {slab: 3, lift: 3, turning: true, chrome: true, radnus: {...radnus, mouth: roomMouth(sh, k, 'RADNUS') === 'open' ? 'open' : 'smile'}});
    plate(fb, sh, k, 'RADNUS', 16, 14, PAL.R3);
  },
});
L.add('8.04', {
  st: 'ROOM-ELGOOG (the siren turning) + CAST-FOUNDERS: NIRB and EGAP climb out of the crypt one held step at a time, backlit, shading their eyes, out onto the lobby (EGAP\'s RETIRED 2019 mug); Radnus holds up his phone for "Search is fine", folds his hands for "It is ours. We published it.", pats his sleeve; NIRB reaches for "badges" · room-scale mouth for Radnus, silhouettes carry theirs by gesture · the gag plate THE FOUNDERS · SUMMONED. once they are up · the one cut-in (draft 8.1) for EGAP\'s "Someone else built that?": ROOM-ELGOOG drawFoundersCutIn, NIRB and EGAP at 3x peering at Radnus\'s phone held in from frame left, the two-dot bubble on it (the siren\'s sweep left to the wide: with it the cut-in measured 2 flashes a second); back to the wide for Radnus\'s answer',
  face: {RADNUS: 'room'},
  marks: {nirb: ['f', 14], egap: ['f', 24], search: ['on', 'v31-a1-0004', -4], searchEnd: ['end', 'v31-a1-0004', 6], ours: ['on', 'e1-a1-8-05', -4], badges: ['on', 'e1-a1-8-06', -6], nirbTalk: ['on', 'e1-a1-8-02', -2], egapTalk: ['on', 'e1-a1-8-04', -2], egapEnd: ['end', 'e1-a1-8-04', 0], up: ['f', 50], nirbEnd: ['end', 'e1-a1-8-02', 0]},
  draw: (fb, k, sh, f) => {
    const n0 = mk(sh, 'nirb', 14), e0 = mk(sh, 'egap', 24), srch = mk(sh, 'search', 160), srchE = mk(sh, 'searchEnd', 252), ours = mk(sh, 'ours', 342), badges = mk(sh, 'badges', 425), eT = mk(sh, 'egapTalk', 258), eE = mk(sh, 'egapEnd', 332);
    const nStep = k < n0 ? -1 : Math.min(3, Math.floor((k - n0) / 12));
    const eStep = k < e0 ? -1 : Math.min(3, Math.floor((k - e0) / 12));
    const stepping = (k0: number, st: number) => st >= 1 && st <= 3 && ((k - k0) % 12) < 5 && (k - k0) < 42;
    // he holds his phone up for "Search is fine…", pats the sleeve out after EGAP's question, folds his hands for "It is
    // ours. We published it."
    const arm = k < srch ? 'ext' : k < srchE ? 'phone' : k >= eE + 4 && k < eE + 10 ? 'pat' : k >= ours && k < ours + 70 ? 'fold' : 'ext';
    const fire = arm === 'pat' ? 3 : radnusFlameAt(f);
    // the cut-in on the founders for EGAP's question (in 2 frames before it, out 4 after it, before the pat)
    if (k >= eT && k < eE + 4) { drawFoundersCutIn(fb, f, {nirb: 'down', egap: k < eT + 40 ? 'reach' : 'mug', turning: false, chrome: true}); return; }
    drawElgoogLobby(fb, f, {
      slab: 3, lift: 3, turning: true, chrome: true,
      radnus: {arm: arm as 'ext' | 'phone' | 'fold' | 'pat', fire: fire as 0 | 1 | 2 | 3, mouth: roomMouth(sh, k, 'RADNUS') === 'open' ? 'open' : 'smile'},
      nirb: nStep < 0 ? null : {step: nStep, arm: k >= badges ? 'reach' : nStep >= 3 && k >= mk(sh, 'nirbTalk', 60) ? 'down' : 'shade', legs: stepping(n0, nStep) ? 'step' : 'stand'},
      egap: eStep < 0 ? null : {step: eStep, arm: eStep >= 3 ? (k >= eT && k < eT + 40 ? 'reach' : 'mug') : 'shade', legs: stepping(e0, eStep) ? 'step' : 'stand'},
    });
    // the scene's gag plate once both are up out of the crypt, held through NIRB's first question (the lock allows the
    // whole hold; 4 s reads it without sitting on the exchange)
    const up = mk(sh, 'up', 50);
    plateWin(fb, sh, k, 'FOUNDERS', 250, 14, PAL.P2, up, Math.min(up + 96, mk(sh, 'nirbEnd', 156)));
  },
});
L.add('8.05', {
  st: 'ROOM-ELGOOG (the siren turning) + CAST-RADNUS lanyards (his sleeve relights) + CAST-FOUNDERS out on the floor taking them: EGAP\'s, then NIRB\'s; extras.guestCard: each card reads GUEST',
  marks: {g1: ['txt', 'GUEST', 'at', 0]},
  draw: (fb, k, sh, f) => {
    const g1 = mk(sh, 'g1', 12), g2 = g1 + 7;
    drawElgoogLobby(fb, f, {
      slab: 3, lift: 3, turning: true, chrome: true,
      radnus: {arm: k < g2 ? 'lanyards' : 'fold', fire: k < 30 ? null : radnusFlameAt(f)},
      egap: {step: 4, arm: k < g1 ? 'reach' : 'down', lanyard: k >= g1},
      nirb: {step: 4, arm: k < g2 ? 'reach' : 'down', lanyard: k >= g2},
    });
    if (k >= g1) guestCard(fb, 360, 132);
    if (k >= g2) guestCard(fb, 312, 128);
  },
});
L.add('8.06', {
  st: 'UI-ALERT drawPhoneLockOTS (over his shoulder: the siren turning on the phone in his hand; he locks it and the red goes out of the frame) → he gets up and goes right: his figure (the kit\'s own pixels) crosses the lens in five frames, a foreground wipe, and the soft bullpen is left empty under the lobby door\'s pre-lap',
  marks: {lock: ['snd', 'dialog_ok_click--chip', 1, 0], go: ['snd', 'revolving_door', 1, -2]},
  draw: (fb, k, sh, f) => {
    const lk = mk(sh, 'lock', 21), go = mk(sh, 'go', 32);
    if (k < go) { drawPhoneLockOTS(fb, f, {locked: k >= lk}); return; }
    const man = new Buf(480, 270, PAL.N0), bg = new Buf(480, 270, PAL.N0);
    drawPhoneLockOTS(man, f, {locked: true});
    launchBackM(bg, 380, {soft: 2, alyi: 'gone', underlines: 3});
    fb.c.set(bg.c.subarray(0, 480 * RH), 0);
    // he gets up and goes right: his shoulder, arm and phone cross the lens in five frames (a foreground wipe, the
    // kit's own pixels moved whole), and the bullpen is left empty under the lobby door's pre-lap
    const st = Math.min(4, k - go), dx = [60, 150, 260, 380, 520][st], dy = 0;
    // his figure: what the kit changed over the bare back wall, plus the whole shoulder silhouette (its dark body
    // matches the dark wall in places, so the difference alone would leave it behind)
    const sil = new Buf(480, 270, 0x1000000);
    otsShoulder(sil, -40, 58, PAL.N3, {flip: true});
    for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
      const i = y * 480 + x;
      if (man.c[i] === bg.c[i] && sil.c[i] === 0x1000000) continue;
      const X = x + dx, Y = y + dy;
      if (X >= 0 && X < 480 && Y >= 0 && Y < RH) fb.c[Y * 480 + X] = man.c[i];
    }
  },
});

// ================================================================== SC 9 · THE LANDLORD'S DEAL (the NopeAI lobby)
// ---- the jammed check reads clear: nobody stands in front of its words. The wide's check spans x 22-278 (its stub
// 22-72, its words from x 81, the amount box 174-270, rows 100-162), so Mas's marks are right of it (x 312), and its
// pen, which the art clips over the top edge above the amount (x 248), is moved (the kit's own pen pixels) to the
// check's right edge at his hand's height, where he can take it without standing on the amount
const PEN_DX = 34, PEN_DY = 46;
let PEN_PX: Array<[number, number, number]> | null = null;
const penPixels = () => (PEN_PX ??= (() => {
  const a = new Buf(480, 270, PAL.N0), b = new Buf(480, 270, PAL.N0), out: Array<[number, number, number]> = [];
  drawCheck(a, DEAL.checkJam[0], DEAL.checkJam[1], {pen: true, stub: DEAL.stub}); drawCheck(b, DEAL.checkJam[0], DEAL.checkJam[1], {pen: false, stub: DEAL.stub});
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) if (a.get(x, y) !== b.get(x, y)) out.push([x, y, a.get(x, y)]);
  return out;
})());
const edgePen = (b: Buf) => { for (const [x, y, c] of penPixels()) b.set(x + PEN_DX, y + PEN_DY, c); };
const MAS_MARK = 312; // Mas's mark by the desk, right of the check

L.add('9.01', {
  st: 'ROOM-LOBBY-DEAL drawDealWide (the arrival: the lobby by day, NOPEAI · A NONPROFIT in gold on the door, Tasya already standing there like part of the wall, still, 11 keys) · Mas walks in from frame left to the desk (mas-stand walk) · PROP-CHECK: the check slides in through the doors in held steps and jams in the revolving door on the nudge, legible in the wide',
  marks: {jam: ['snd', 'glass_nudge', 1, 0]},
  draw: (fb, k, sh, f) => {
    const jam = mk(sh, 'jam', 53);
    // he's through the door as we arrive and crosses to his mark by the desk before the check lands behind him
    const mx = Math.min(MAS_MARK, 132 + Math.round(k * 3.4)), walking = mx < MAS_MARK;
    const base: DealWideState = {mas: {at: [mx, 190], legs: walking ? masWalkAt(f) : 'stand', collars: 2, collarStyle: CS}, tasya: {at: DEAL.tasya, keys: 11}};
    if (k >= jam) { underCast(fb, f, {...base, check: 'jammed', pen: false}, edgePen); return; }
    const kk = k - (k % 2);
    if (k < jam - 14) { drawDealWide(fb, f, {...base, check: null}); return; }
    underCast(fb, f, {...base, check: null, revolve: 1}, (b) => { const dx = -(jam - kk) * 17; drawCheck(b, DEAL.checkJam[0] + dx, DEAL.checkJam[1], {pen: false, stub: DEAL.stub}); for (const [x, y, c] of penPixels()) b.set(x + PEN_DX + dx, y + PEN_DY, c); });
  },
});
L.add('9.04', {
  st: 'ROOM-LOBBY-DEAL drawDealWide + dealFreeze (THE FULL FREEZE: the lobby printed navy and cream, Mas alone in colour keeps moving: he walks to the jammed check and pockets its pen on the tick) + shared/pixel/ui nameCard: TASYA / THE LANDLORD with its stat RUNS MACROSOFT (the scene\'s gag card); the pen is the one Tasya said he\'d bring',
  marks: {pen: ['snd', 'pen_tick_1', 1, 0], card: ['txt', 'TASYA', 'at', 0]},
  draw: (fb, k, sh, f) => {
    const pen = mk(sh, 'pen', 80), card = mk(sh, 'card', 2);
    // from his mark he turns to the check and takes the two steps to its right edge, reaches, and pockets the pen on
    // the tick: his hand at the pen (x 282-287), his body right of the amount (the check's words stay clear)
    const turn = 12, stop = MAS_MARK - 11;
    const mx = k < turn ? MAS_MARK : Math.max(stop, MAS_MARK - Math.round((k - turn) * 1.2)), walking = k >= turn && mx > stop;
    const arm = k >= pen - 12 && k < pen ? 'reach' : k >= pen && k < pen + 14 ? 'pocket' : 'down';
    const live = new Mask(480, 270);
    underCast(fb, f, {check: 'jammed', pen: false, mas: {at: [mx, 190], flip: k >= turn, legs: walking ? masWalkAt(f) : 'stand', arm, collars: 2, collarStyle: CS}, tasya: {at: DEAL.tasya, keys: 11}, live}, (b) => { if (k < pen) edgePen(b); });
    dealFreeze(fb, live);
    const kk = k - card;
    if (kk >= 0) {
      const x = 330, y = 14;
      nameCard(fb, {x, y, name: 'TASYA', line: 'THE LANDLORD', accent: ACCENT.TASYA ?? PAL.N8, k: kk});
      if (kk >= 16) {
        const s = 'RUNS MACROSOFT';
        rect(x - 5, y + 44, 90, 13, fb.ink(PAL.N0)); rect(x - 5, y + 44, 90, 1, fb.ink(ACCENT.TASYA ?? PAL.N8));
        drawTextTyped(fb, s, x, y + 47, (kk - 16) * 2);
      }
    }
  },
});
const drawTextTyped = (fb: Buf, s: string, x: number, y: number, n: number) => pt(fb, s.slice(0, Math.max(0, n)), x, y, PAL.N8);
L.add('9.06', {
  st: 'ROOM-LOBBY-DEAL 2S via extras.deal2S (pan 110, the art\'s; its gap filled from a car-free frame) (the freeze lifts: Mas left, Tasya right, the jammed check between; Tasya lip-synced, warm, blinking) + Gerg at the door behind, tugging the check\'s blank stub where it\'s caught in the wings (left of its words: the art\'s spot put him over the amount)',
  face: {TASYA: 'lip'},
  marks: {gerg: ['f', 83]},
  draw: (fb, k, sh, f) => {
    deal2S(fb, f, {pan: 110, check: 'jammed', gerg: k >= mk(sh, 'gerg', 83) ? {at: [12, 174]} : false, collars: 2, tasya: {mouth: lipOn(sh, k, 'TASYA') ? mouth(sh, k, 'TASYA') : 'smile', lid: blinkLid(k, 4, 89), brow: 'warm'}, mas: {look: 1}});
  },
});
L.add('9.07', {
  st: 'ROOM-LOBBY-DEAL drawDealWide: the check slides out of the door onto the floor in held steps (drawCheckFloor) and fits like a floor; Mas walks straight onto it (the step on the footstep); Tasya by the desk, Gerg at the door',
  marks: {slide: ['snd', 'folder_slide', 1, 0], step: ['snd', 'footstep_hard_2', 1, 0]},
  draw: (fb, k, sh, f) => {
    const sl = mk(sh, 'slide', 7), stp = mk(sh, 'step', 49);
    // from his mark right of the jammed check (clear of its words), he walks left onto it the moment it's a floor
    const land = sl + 6, dest = 200;
    const mx = k < land ? MAS_MARK - 12 : Math.max(dest, MAS_MARK - 12 - Math.round((k - land) * ((MAS_MARK - 12 - dest) / Math.max(1, stp - land)))), walking = k >= land && mx > dest;
    const base: DealWideState = {mas: {at: [mx, 184], flip: true, legs: walking ? masWalkAt(f) : 'stand', collars: 2, collarStyle: CS}, tasya: {at: [352, 186], keys: 11}, gerg: {body: 'tug', at: [14, 178]}};
    if (k < sl) { drawDealWide(fb, f, {...base, check: 'jammed', revolve: 1}); return; }
    if (k < sl + 6) {
      const off = [-120, -120, -60, -60, -20, -20][k - sl];
      underCast(fb, f, {...base, check: null}, (b) => drawCheckFloor(b, DEAL.checkFloor.x + off, DEAL.checkFloor.y, DEAL.checkFloor.w, {}));
      return;
    }
    drawDealWide(fb, f, {...base, check: 'floor'});
  },
});
L.add('9.08', {
  st: 'ROOM-LOBBY-DEAL drawDealMcuMas {collarStyle: v31} + PROP-COLLARS: pop, the third collar surfaces with its 1-px hop, the gold one standing up the neck (it reads as a new collar, not the hoodie\'s trim); the lobby soft behind',
  marks: {pop: ['snd', 'collar_pop_F5', 1, 0]},
  draw: (fb, k, sh, f) => {
    const p = mk(sh, 'pop', 0);
    drawDealMcuMas(fb, f, {collars: k >= p ? 3 : 2, collarPop: k >= p ? k - p : undefined, check: 'floor', collarStyle: CS});
  },
});
L.add('9.09', {
  st: 'extras.deal2S = ROOM-LOBBY-DEAL\'s 2S re-composed (pan 110, held steady): Mas (three collars, v31, lip-synced) standing on the check, Tasya warm and unhurried (lip-synced, blinking; on "That collar suits you." the ring clinks and the new gold collar hops a pixel, the landlord\'s; the ring comes up again on "our servers", 11 keys; he walks out of frame right on "Everyone is welcome", the jangles going with him); Mas looks down at what he is standing on before "and the rent?"',
  face: {TASYA: 'lip', MAS: 'lip'},
  marks: {clink: ['snd', 'key_ring_jangle_3', 1, 0], itdoes: ['end', 'e1-a1-9-04', 12], rent: ['on', 'e1-a1-9-05', -3], servers: ['w', 'v31-a1-0005', 'servers', -8], lights: ['w', 'v31-a1-0005', 'lights', -4], lot: ['on', 'e1-a1-9-07', 0], leave: ['on', 'e1-a1-9-08', -6]},
  draw: (fb, k, sh, f) => {
    const cl = mk(sh, 'clink', 21), itd = mk(sh, 'itdoes', 66), rent = mk(sh, 'rent', 91), srv = mk(sh, 'servers', 220), lts = mk(sh, 'lights', 260), leave = mk(sh, 'leave', 368);
    const tx = k < leave ? 380 : 380 + (Math.floor((k - leave) / 2) + 1) * 10;
    const clinking = k >= cl - 4 && k < cl + 12;
    const tArm = (k >= srv && k < lts) || clinking ? 'ring' : 'clasp';
    const tMouth = lipOn(sh, k, 'TASYA') ? mouth(sh, k, 'TASYA') : 'smile';
    const masDown = k >= itd && k < rent;
    deal2S(fb, f, {
      pan: 110, check: 'floor', collars: 3, collarPop: k >= cl && k < cl + 4 ? k - cl : undefined,
      mas: {mouth: say(sh, k, 'MAS'), head: masDown ? 'down' : '34', lid: masDown ? 1 : 0, look: k >= mk(sh, 'lot', 355) - 30 && k < mk(sh, 'lot', 355) ? 0 : 1},
      tasya: tx < 480 ? {mouth: tMouth, lid: blinkLid(k, 6, 103), brow: 'warm', arm: tArm, keys: 11, jangle: (clinking ? (k >= cl && k < cl + 3 ? 1 : 0) : tArm === 'ring' ? Math.floor(f / 5) % 2 : 0) as 0 | 1} : null,
      tasyaX: tx,
    });
  },
});
L.add('v32-9.10k', {
  st: 'KIT-KEY-RING drawKeyRingECU (weeks on: the ring at Tasya\'s belt, large for the first time: eleven keys in brass, steel and copper spread round the arc, and a new twelfth in NopeAI beige hanging at the front, its bow stamped NOPEAI; it jangles on the jangle as he turns toward the TV; the rail FEB 7, 2023 in the band, clear of it)',
  marks: {j: ['snd', 'key_ring_jangle_2', 1, 0]},
  draw: (fb, k, sh, f) => {
    const j = mk(sh, 'j', 9);
    drawKeyRingECU(fb, f, {keys: 12, jangle: (k >= j && k < j + 3) || (k >= j + 6 && k < j + 9) ? 1 : 0});
  },
});
L.add('9.10', {
  st: 'ROOM-LOBBY-DEAL drawDealWide (weeks on, the time jump held: the check scuffed grey on the floor, Gerg sitting on its edge with his laptop, Mas at the desk, Tasya where he stood with a twelfth key in NopeAI beige that catches the light; the TV comes on with GNIB, Sydney in its box; Gerg looks up from his laptop to it for his line and stays on Tasya, a listener reacting, through "…we made them dance…") + extras.passerBy (an employee crossing the check without looking down) · Gerg and Tasya at room scale from their takes',
  face: {GERG: 'room', TASYA: 'room'},
  marks: {tv: ['txt', 'TV: MACROSOFT', 'at', 0], walk: ['snd', 'synth:steps_stone', 1, -16]},
  draw: (fb, k, sh, f) => {
    const tv = mk(sh, 'tv', 50), w0 = mk(sh, 'walk', 12);
    const st: DealWideState = {
      check: 'scuffed', tv: k < tv ? {show: 'off'} : {show: 'gnib', bubble: 'sydney'},
      mas: {at: [170, 184], collars: 3, collarStyle: CS},
      tasya: {at: DEAL.tasya, keys: 12, beige: true, mouth: roomMouth(sh, k, 'TASYA') === 'open' ? 'open' : 'smile', jangle: (k >= tv && k < tv + 12 ? Math.floor(k / 3) % 2 : 0) as 0 | 1},
      gerg: {body: 'sit', at: [96, 190], mouth: roomMouth(sh, k, 'GERG') === 'open' ? 'open' : 'rest', look: k >= tv ? 'up' : 'screen'},
    };
    drawDealWide(fb, f, st);
    // someone crossing the check without looking down: from the desk's end, left across it and out by the door
    const x = 262 - Math.round((k - w0) * 2.1);
    if (k >= w0 && x > -30) {
      const bg = new Buf(480, 270, PAL.N0); drawDealWide(bg, f, {...st, mas: null, tasya: null, gerg: null});
      passerBy(fb, f, x, 181, bg, fb.clone(), PASSER_FLIP);
    }
    // the twelfth key, new on his ring, in NopeAI beige and big enough to count as a new one at room scale; it swings
    // with the ring's jangle and catches the light every 40 frames
    twelfthKey(fb, DEAL.tasya[0], DEAL.tasya[1], (st.tasya?.jangle ?? 0) as 0 | 1, k % 40 < 3);
  },
});
const PASSER_FLIP = true;
L.add('9.11', {
  st: 'UI-TV drawTvScreen show tap (across town, at Elgoog: Radnus tap-dancing in two drawings, extinguisher held politely aside, the TV\'s caption)',
  draw: (fb, k, sh, f) => { drawTvScreen(fb, f, {show: 'tap'}); },
});
L.add('9.12', {
  st: 'UI-TV drawTvScreen show telescope (it turns in three held drawings on the servos until its lens stares at him; the ticker crawls in; the figure lands on the stamp) + tvLedger (the LEDGER flash-print, 6 frames)',
  marks: {s1: ['snd', 'orb_servo', 1, 0], s2: ['snd', 'orb_servo', 2, 0], s3: ['snd', 'orb_servo', 3, 0], tick: ['txt', 'TICKER', 'at', 0], stamp: ['snd', 'rubber_stamp_C--chip', 1, 0]},
  draw: (fb, k, sh, f) => {
    const s2 = mk(sh, 's2', 18), s3 = mk(sh, 's3', 30), tk = mk(sh, 'tick', 21), stp = mk(sh, 'stamp', 69);
    drawTvScreen(fb, f, {show: 'telescope', k: k < s2 ? 0 : k < s3 ? 1 : 2, ticker: clamp((k - tk) / 40, 0, 1), figure: k >= stp, date: 'FEB 8'});
    if (k >= stp && k < stp + 6) tvLedger(fb);
  },
});
L.add('9.13', {
  st: 'ROOM-LOBBY-DEAL drawDealGerg2S {collarStyle: v31} (Mas at the desk with his glass, three collars, "ours does that too." lip-synced; Gerg on the check\'s edge, his laptop open on his knees, looks from the TV to Mas on the line and stays on him; the TV back on GNIB\'s box with Sydney in it (tv-news bubble sydney), and she blinks as if she heard) · the laptop close moved to v31-10.04',
  face: {MAS: 'lip'},
  marks: {said: ['on', 'e1-a1-9-11', -6], saidEnd: ['end', 'e1-a1-9-11', 0]},
  draw: (fb, k, sh, f) => {
    const said = mk(sh, 'said', 25), se = mk(sh, 'saidEnd', 67);
    const blink: SydneyFace | undefined = k >= se - 6 && k < se - 2 ? 'blink' : undefined;
    drawDealGerg2S(fb, f, {lid: 0, collars: 3, collarStyle: CS, tv: {show: 'gnib', bubble: 'sydney', bubbleFace: blink}, mas: {mouth: say(sh, k, 'MAS')}, gerg: {head: 'up', look: k >= said ? -1 : 0, lid: 0}});
  },
});

// ================================================================== SC 10 · SYDNEY (restored in draft 7)
const SYD = PAL.F6; // her plate's accent: GNIB's periwinkle
L.add('v31-10.01', {
  st: 'SET-SYDNEY drawSydneyTvExit (the TV full frame, GNIB\'s search box with Sydney in it; on the pop she slips out of the box and off the screen in three held steps, the box empty behind her) → drawSydneyWide (the lobby as 9.10 left it; she drifts down across it, held every 3 frames on its drift path, and parks a pixel too close to Mas) · plate SYDNEY under the box, then where she parks (the 2022 stamp is on her face, the art\'s own)',
  marks: {pop: ['snd', 'ui_toast_pop', 1, 0]},
  draw: (fb, k, sh, f) => {
    const pop = mk(sh, 'pop', 14), out = pop + 10, park = sh.e - sh.s - 4;
    if (k < out) {
      const step = (k < pop ? 0 : k < pop + 3 ? 1 : k < pop + 6 ? 2 : k < pop + 9 ? 3 : 4) as 0 | 1 | 2 | 3 | 4;
      drawSydneyTvExit(fb, f, {step, face: k >= pop - 5 && k < pop - 2 ? 'blink' : 'dots'});
      // her plate under GNIB's box, beside her way out (the box's own field stays clear: it isn't a search query)
      plate(fb, sh, k, 'SYDNEY', 150, 124, SYD);
      return;
    }
    const kk = k - out - ((k - out) % 3), t = clamp(kk / Math.max(1, park - out), 0, 1);
    drawSydneyWide(fb, f, {sydney: {t, face: 'dots'}});
    // in the wide the plate waits where she parks, by his face (a plate holds still; she comes to it)
    plate(fb, sh, k, 'SYDNEY', SYD_WIDE.park[0] + 22, SYD_WIDE.park[1] - 20, SYD);
  },
});
L.add('v31-10.02', {
  st: 'SET-SYDNEY drawSydney2SMas (held: Mas at the desk with his glass, three collars (v31), Sydney parked a pixel off his nose): "Hi! Isn\'t 2022 a lovely year?" and on its 😊 her face takes the smile, fixed from here on; her dots light in turn while she talks, the smile never moving; Mas corrects her politely (lip-synced), his lids half down, gracious, through her scold, and compliments her with the one-pixel smile after',
  face: {MAS: 'lip'},
  marks: {emoji: ['we', 'e1-a1-10-06', 'year', 2], scold: ['on', 'e1-a1-10-02', 0], scoldEnd: ['end', 'e1-a1-10-02', 6], praiseEnd: ['end', 'e1-a1-10-03', 4]},
  draw: (fb, k, sh, f) => {
    const em = mk(sh, 'emoji', 80), sc0 = mk(sh, 'scold', 165), sc1 = mk(sh, 'scoldEnd', 364), pe = mk(sh, 'praiseEnd', 429);
    const m = saying(sh, k, 'MAS') ? mouth(sh, k, 'MAS') : k >= pe ? 'smile' : 'rest';
    drawSydney2SMas(fb, f, {
      collars: 3,
      mas: {mouth: m, lid: k >= sc0 && k < sc1 ? 1 : 0, look: 1},
      sydney: {face: k >= em ? 'smile' : 'dots', talk: talking(sh, k, 'SYDNEY'), f: k},
    });
  },
});
L.add('v31-10.03', {
  st: 'SET-SYDNEY drawSydney2STasya (held: Tasya frame right, twelve keys, the smile unbroken; his near hand clips the landlord\'s egg timer to Sydney\'s chain on the tick (clip 1 → 2), its own face reading 5 QUESTIONS; "House rules, Sydney." lip-synced, blinking; Sydney keeps her 😊)',
  face: {TASYA: 'lip'},
  marks: {clip: ['snd', 'pen_tick_1', 1, 0]},
  draw: (fb, k, sh, f) => {
    const c = mk(sh, 'clip', 21);
    const clip = (k < 4 ? 0 : k < c ? 1 : 2) as 0 | 1 | 2;
    drawSydney2STasya(fb, f, {clip, n: 5, timerFace: 'questions', sydney: {face: 'smile'}, tasya: {mouth: lipOn(sh, k, 'TASYA') ? mouth(sh, k, 'TASYA') : 'smile', lid: blinkLid(k, 7, 89), brow: 'warm'}});
  },
});
L.add('v31-10.04', {
  st: 'SET-SYDNEY drawSydneyWide (the timer dings on the bell: 0, its two shake drawings; the bubble blinks blank, then brightens as new, the timer back at 5) → drawSydneyGerg2S (brand new, turned to Mas: "Hi!", her dots lit in turn; Gerg looks down at his own laptop) → INSERT-GERG-LAPTOP drawGergLaptopPOV place lobby (over his shoulder: the same two-dot face in a chat window, his hands on the keys; he quietly closes it: the lid half down, held, then shut at GERG_LAPTOP.shut) · HOLD on the lid (the match cut\'s first half)',
  marks: {ding: ['snd', 'bell_ding_F6', 1, 0], hi: ['on', 'v31-a1-0007', -2], hiEnd: ['end', 'v31-a1-0007', 0]},
  draw: (fb, k, sh, f) => {
    const d = mk(sh, 'ding', 7), hi = mk(sh, 'hi', 22), he = mk(sh, 'hiEnd', 32);
    const cut2 = hi - 2, cut3 = he + 10, half = cut3 + 10, shut = half + 4;
    if (k < cut2) {
      const ding = (k < d ? 0 : k < d + 3 ? 1 : k < d + 6 ? 2 : 0) as 0 | 1 | 2;
      const face: SydneyFace = k < d ? 'smile' : k < d + 8 ? 'blank' : 'dots';
      drawSydneyWide(fb, f, {sydney: {t: 1, face, bright: k >= d + 8, timer: {n: k < d ? 1 : k < d + 8 ? 0 : 5, ding}}});
      return;
    }
    if (k < cut3) {
      drawSydneyGerg2S(fb, f, {lid: 0, collars: 3, sydney: {face: 'dots', bright: true, talk: talking(sh, k, 'SYDNEY'), f: k, timer: {n: 5}}, gerg: {head: k < he + 2 ? 'up' : 'type', lid: k < he + 2 ? 0 : 1}});
      return;
    }
    const lid = (k < half ? 0 : k < shut ? 1 : 2) as 0 | 1 | 2;
    drawGergLaptopPOV(fb, f, {place: 'lobby', lid, screen: 'chat', hands: lid === 0, f: 0});
  },
});

// ================================================================== SC 11 · THE DUEL (a meanwhile split, by a match cut)
L.add('11.01', {
  st: 'MATCH CUT on the lid: INSERT-GERG-LAPTOP drawGergLaptopPOV place bullpen (the same slab in the same place in frame as v31-10.04\'s last frame, on the demo desk: lid 2 → 1 → 0 in held steps, opening on the Atem thread: the tipped crate ATEM · MODEL WEIGHTS · RESEARCHERS ONLY, anon · 03/03/23) → SPLIT-DUEL drawDemoArrival (the bullpen\'s arrival: the day room dressed as the demo stage under the hand-lettered GTP-4 banner, Mas at his end desk behind; Gerg on camera for his line, lip-synced) → back on his screen for Mas\'s O.S. "give it a minute. it\'ll be open source.", and on "open source" he scrolls down to the replies piling up; the frame splits on the downbeat (11.03)',
  face: {GERG: 'lip'},
  marks: {line: ['on', 'e1-a1-11-04', -2], lineEnd: ['end', 'e1-a1-11-04', 4], open: ['w', 'e1-a1-11-05', 'open', 0]},
  draw: (fb, k, sh, f) => {
    const g0 = mk(sh, 'line', 26), g1 = mk(sh, 'lineEnd', 116), op = mk(sh, 'open', 166);
    if (k >= g0 && k < g1) {
      drawDemoArrival(fb, f, {lid: 0, gerg: {head: lipOn(sh, k, 'GERG') ? 'talk' : 'type', mouth: mouth(sh, k, 'GERG'), lid: blinkLid(k, 4, 83) === 2 ? 2 : 1}});
      return;
    }
    const lid = (k < 4 ? 2 : k < 8 ? 1 : 0) as 0 | 1 | 2;
    // the post fills his screen (the crate and its date held to read); on "open source" he scrolls down to the replies
    // already piling up under it, 24 px in four held steps (the header strip stays)
    const scroll = k < op ? 0 : Math.min(24, (Math.floor((k - op) / 2) + 1) * 6);
    drawGergLaptopPOV(fb, f, {place: 'bullpen', lid, screen: 'thread', thread: {replies: 3, scroll}, hands: lid === 0, f: 0});
  },
});
/** the split's foot a rung down (both panes): the V.O. rows on shadow (the left pane is a day room) */
const splitFoot = (fb: Buf) => bottomShade(fb, 180, 1);
L.add('11.03', {
  st: 'SPLIT-DUEL drawDuelSplit phrase 1: the right pane held clean for Mas\'s V.O. (CLOD unlit, waiting; Mario writing, no scroll yet; the left pane quiet, Gerg typing) · then LEFT the demo (Gerg holding up the napkin and photographing it on the shutter; the photo on the demo screen) · RIGHT Mario dictating his memo as the scroll grows · plates CLOD 1 · SAME DAY and MARIO · EX-NOPEAI in the right pane (the relation the cut V.O. carried)',
  marks: {memo: ['on', 'e1-a1-11-01', 0], memoEnd: ['end', 'e1-a1-11-01', 0], snap: ['snd', 'camera_shutter', 1, 0]},
  draw: (fb, k, sh, f) => {
    const m0 = mk(sh, 'memo', 141), m1 = mk(sh, 'memoEnd', 300), snap = mk(sh, 'snap', 206);
    const gerg = k < snap - 40 ? 'type' : k < snap ? 'napkin' : k < snap + 3 ? 'snap' : 'type';
    // the scroll: none under the V.O., then it grows with the memo (to phrase 2's 50 px by its end)
    const scroll = k < m0 ? 0 : Math.min(50, Math.floor((k - m0) / 3.2));
    drawDuelSplit(fb, f, {
      left: {gerg, screen: k >= snap + 4 ? 'napkin' : 'blank'},
      right: {light: 0, mario: k >= m0 && k < m1 ? 'dictate' : 'write', scroll, f},
    });
    splitFoot(fb);
    plate(fb, sh, k, 'CLOD', 250, 14, PAL.W5);
    const mt = textOf(sh, 'label', 'MARIO');
    if (mt && k >= mt.s && k < mt.e) drawPlate(fb, {...mt, kind: 'plate'}, k - mt.s, 388, 90, ACCENT.MARIO ?? PAL.F6);
  },
});
L.add('11.04', {
  st: 'SPLIT-DUEL drawDuelSplit phrase 2 {left.caption: false}: RIGHT the launch light slams on and CLOD bows ("You\'re absolutely right!"), then rises; Mario looks up at the split line (the same day), "Addendum.", writes · LEFT, GTP-4 goes out on HIS click: the pane cuts in to 5.08\'s insert (extras.paneButton: the beige button, research preview; his finger comes in with no hover in 5.08\'s held steps; touch, the click, the LED), and on the click the pane is back in the bullpen with the napkin swapped into a working website, no caption, the room cheering in two held drawings on the cheer · HOLD on Mario writing',
  marks: {clod: ['on', 'e1-a1-11-02', -2], clodEnd: ['end', 'e1-a1-11-02', 0], add: ['on', 'e1-a1-11-03', 0], cheer: ['snd', 'synth:cheer', 1, 0]},
  draw: (fb, k, sh, f) => {
    const c0 = mk(sh, 'clod', 6), c1 = mk(sh, 'clodEnd', 41), add = mk(sh, 'add', 76), ch = mk(sh, 'cheer', 114), site = ch - 4;
    const mario = k < c1 + 10 ? 'write' : k < add ? 'lookup' : k < add + 22 ? 'dictate' : 'write';
    const cheer = k >= ch && k < ch + 38 ? ((Math.floor((k - ch) / 6) % 2) + 1) as 1 | 2 : 0;
    // his click (no stick spot: it falls 6 frames before the cheer, 2 before the website): the insert from a beat
    // before his finger arrives, in 5.08's held steps, then back to the room on the click's 4th frame
    const clk = site - 2, a0 = clk - 16, in0 = a0 - 8, out = clk + 4;
    drawDuelSplit(fb, f, {
      left: {gerg: k < out ? 'glance' : 'type', screen: k < out ? 'napkin' : k < out + 6 ? 'site1' : 'site2', cheer, caption: false},
      right: {light: k >= c0 ? 1 : 0, clod: k >= c0 && k < c1 + 4 ? {pose: 'bow', smile: true} : {}, mario, scroll: 50 + Math.floor(Math.max(0, k - add) / 10), f},
    });
    if (k >= in0 && k < out) {
      const steps: Array<[number, number, number]> = [[in0, -400, -300], [a0, -96, -64], [a0 + 4, -48, -32], [a0 + 8, -14, -9], [a0 + 12, 0, 0]];
      const st = steps.filter(([s0]) => k >= s0).pop()!;
      paneButton(fb, (k >= clk ? 2 : k >= clk - 3 ? 1 : 0) as 0 | 1 | 2, st[1], st[2], k >= clk);
    }
    splitFoot(fb);
  },
});

// ================================================================== SC 12 · THE PAUSE LETTER (the act-out)
L.add('12.01', {
  st: 'UI-PAUSE-LETTER drawLetterOTS {months} (over his shoulder at night: his monitor lights with PAUSE GIANT AI EXPERIMENTS on the toast, and under it the letter\'s own line 6 MONTHS; the push to full-bleed in held steps) → the whip on the paper\'s sound → drawClipboard gliding through the dark toward frame right (its clip\'s fine print PAUSES RECEIVED: 0 legible, 6 MONTHS on it too) under Nole\'s pre-lap, into 12.02\'s glide',
  marks: {toast: ['snd', 'ui_toast_pop', 1, 0], whip: ['snd', 'paper_whip', 1, 0]},
  draw: (fb, k, sh, f) => {
    const t = mk(sh, 'toast', 9), w = mk(sh, 'whip', 52);
    const push = k < w - 14 ? 0 : k < w - 10 ? 1 : k < w - 6 ? 2 : 3;
    if (k < w) { drawLetterOTS(fb, f, {k: k - t, push, months: true}); return; }
    if (k < w + 3) { // the whip: the full-bleed page slides off to the right in three held frames, the dark behind it
      for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) fb.set(x, y, PAL.N0);
      const dx = [150, 300, 420][k - w];
      drawLetterPage(fb, dx, 0, 480, RH, {months: true});
      for (let y = 0; y < RH; y++) for (let x = dx - 24; x < dx; x++) if (x >= 0 && bayer(x, y) < (x - dx + 24) / 24) fb.set(x, y, PAL.P0);
      return;
    }
    for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) fb.set(x, y, bayer(x, y) < 0.12 ? PAL.N1 : PAL.N0);
    const kk = k - (w + 3), gx = 150 + Math.floor(kk / 3) * 5, gy = 58 + Math.floor(kk / 6);
    // a faint lamp pool far off to the right: where it is going
    for (let y = 60; y < RH; y++) for (let x = 330; x < 480; x++) { const d = Math.hypot((x - 470) / 150, (y - 150) / 80); if (d < 1 && bayer(x, y) < (1 - d) * 0.35) fb.set(x, y, PAL.D1); }
    drawClipboard(fb, gx, gy, {months: true});
  },
});
L.add('12.02', {
  st: 'ROOM-NOLE-DESK drawNoleDesk (a standing desk in the dark, his lamp: the clipboard glides in from the left in held steps and lands at desk size under Nole\'s pre-lap; he signs with his left hand (the flourish on the scribble) and solders a GPU under the desk with his right (sparks on the crackles); OIGNEB holds up PAUSE, higher for "You signed it. Now put the iron down.") · Nole and Oigneb at room scale from their takes · plates NOLE · EARLY FUNDER · BUILDING HIS OWN (riding the sparks) and OIGNEB',
  face: {NOLE: 'room', OIGNEB: 'room'},
  marks: {sign: ['snd', 'pen_scribble_short', 1, 0], c1: ['snd', 'synth:crackle', 1, 0], c2: ['snd', 'synth:crackle', 2, 0], og: ['on', 'v32-a1-0007', -2], ogEnd: ['end', 'v32-a1-0007', 12]},
  draw: (fb, k, sh, f) => {
    const sg = mk(sh, 'sign', 7), c1 = mk(sh, 'c1', 19), c2 = mk(sh, 'c2', 86), og = mk(sh, 'og', 67), ogE = mk(sh, 'ogEnd', 142);
    const clip = k < 2 ? 1 : k < 4 ? 2 : k < 6 ? 3 : 4;
    const sparks = k >= c1 && k < c1 + 34 ? k - c1 : k >= c2 && k < c2 + 24 ? k - c2 : null;
    drawNoleDesk(fb, f, {
      clip, signed: k < sg ? 0 : k < sg + 6 ? 1 : 2, sparks,
      nole: {mouth: room3Mouth(sh, k, 'NOLE')},
      oigneb: {sign: k >= og && k < ogE ? 'high' : 'chest', mouth: roomMouth(sh, k, 'OIGNEB') === 'open' ? 'open' : 'rest', blink: blinkLid(k, 8, 91) === 2},
    });
    // his plate above him, in the dark (the relation words make it wide: at his feet it would run over Oigneb)
    plate(fb, sh, k, 'NOLE', 132, 40, PAL.R3);
    plate(fb, sh, k, 'OIGNEB', 356, 58, PAL.N7);
  },
});
L.add('v31-12.03', {
  st: 'INSERT-EMIT-OPED drawEmitDrop {byline} (THUD, a HARD CUT to his desk from above: on the thud\'s first frame the magazine a hand\'s height over its shadow, then flat on the printed pause letter; the desk takes the 2 px shake in held drawings, his glass\'s water line does not move; EMIT open at the op-ed, its headline held to read, the byline REZEILE printed on the page (no pipeline plate))',
  marks: {thud: ['snd', 'synth:thud', 1, 0]},
  draw: (fb, k, sh, f) => {
    const t = mk(sh, 'thud', 0);
    drawEmitDrop(fb, f, {k: k < t ? 0 : Math.min(8, k - t), byline: true});
  },
});
L.add('12.04', {
  st: 'INSERT-PLEASE drawPleaseHigh {desk: v31, waterStill} (HARD CUT, his desk from above: EMIT open at the op-ed and the printed letter beside the sheet, out of the lamp\'s pool; his hand and the MACROSOFT pen, PLEASE, its last letter still being drawn on the pen\'s scratch, between the two asks); a 1-px knock on the cut (the glass nudged: the desk\'s things shake, the water line stays)',
  marks: {pen: ['snd', 'synth:pen', 1, 0], knock: ['snd', 'glass_nudge', 1, 0]},
  draw: (fb, k, sh, f) => {
    const p = mk(sh, 'pen', 3), kn = mk(sh, 'knock', 0);
    const dy = [1, -1, 1][k - kn] ?? 0;
    drawPleaseHigh(fb, f, {n: 5, part: clamp(0.15 + Math.floor(Math.max(0, k - p) / 3) * 3 * 0.012, 0.15, 0.8), desk: 'v31', waterStill: true, shake: [0, dy]});
  },
});
L.add('12.05', {
  st: 'ROOM-BULLPEN-LAUNCH drawLaunchGlass {alyi: phone, phonePage: emit, faceLight: 2} (Mas soft in the fg, bent over the sheet, not looking up; in the glass Alyi\'s reflection back in its doorway, reading the same EMIT page on his phone, not looking at Mas, his face lit two steps) + the pen\'s tip moving on the sheet\'s corner',
  draw: (fb, k, sh, f) => {
    drawLaunchGlass(fb, f, {mas: 'bent', rima: null, underlines: 3, alyi: 'phone', phonePage: 'emit', faceLight: 2});
    // the pen on the sheet's corner (it's still writing: the scratch runs under the shot)
    const tx = 150 + ((Math.floor(k / 3) * 7) % 30), ty = 190 + (Math.floor(k / 6) % 2);
    fb.set(tx, ty, PAL.I0); fb.set(tx + 1, ty - 1, PAL.N1); fb.set(tx + 2, ty - 2, PAL.N1); fb.set(tx + 3, ty - 3, PAL.N2);
  },
});
L.add('12.06', {
  st: 'INSERT-PLEASE drawPleaseECU {reg} (PLEASE, and on the line below the pen writes R, E, G on its scratch, then lifts mid-word in held steps on the tick: THREAT on the lift); the hold on PLEASE / REG',
  marks: {lift: ['snd', 'pen_tick_3', 1, 0]},
  draw: (fb, k, sh, f) => {
    const l = mk(sh, 'lift', 36), per = Math.max(3, Math.floor((l - 3) / 3));
    const kk = k - (k % 3);
    const reg = Math.min(3, Math.floor(kk / per)), regPart = reg >= 3 ? 1 : (kk % per) / per;
    drawPleaseECU(fb, f, {reg, regPart, lift: k < l ? 0 : k < l + 4 ? 1 : 2});
  },
});
L.add('12.07', {
  st: 'BLACK: the act-out (cut to black on the sting\'s tail), the whole frame',
  draw: (fb) => { fb.c.fill(PAL.N0); return {full: true}; },
});

void LAUNCH; void stepColor; void ease2; void rect;
export const SEGMENT = defineSegment({seg: 'act1', lock: LOCK, layouts: L.all, review: {subtitle: 'PIXEL v3.2 · LOCK ACT1 (v3.2 STICK TIMING) · v3-shots-act1'}});
