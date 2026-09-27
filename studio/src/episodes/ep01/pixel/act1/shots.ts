// MR. MAS — Ep1 pixel v3, ACT ONE: one layout per shot of the v3 stick lock (sc 5–12, 47 shots, 5:22.5). The
// `v3-shots-act1` pass, 2026-09-27. Built on the art-a modules (show/episodes/ep01/production/full-v3/art/art-a.md);
// the few pieces those modules fix inside a packaged setup (a camera x, a lifted prop, a speaking mouth in a composite)
// are re-composed from their exported parts in ./extras.ts. No existing drawing is edited.
//
// Grammar (pov-and-framing §4, flow-and-continuity §2a): every new place opens on the room with its people (5.02, 8.02,
// 9.01, 9.10, 11.01, 12.02); holds breathe (Gerg's keys, blinks, a sleep LED, a passer-by, rack LEDs, the siren, a
// drifting back wall); Mas never blinks (§4.3 rule 10), his tells are the eye, the lids and the one-pixel smile. Mouths
// come from the takes (lipsync), faces per framing. Plates are names only, except the two gag plates the beat plan
// keeps (RADNUS · POLITELY ON FIRE, NOLE · BUILDING HIS OWN), CLOD's product plate, and Tasya's freeze card. Stick
// scaffolding in the lock's texts (`mas types: …`, `his sheet: …`, `USERS: …` over a spinning blur, `SUMMONED.`) is
// not drawn: the picture carries it.
//
// The lit band (sc 5, the one lit-UI moment of Act One): from the cursor's arrival in 5.02 until the click in 5.08 the
// layouts draw the band themselves (extras.litBand: the host's rail and V.O. line, plus the sentence line) and return
// {full: true}; after the click it dims out in held steps to the host's own band.
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
import {drawHoleHigh, drawWedgedWheel, drawGpuTear, HIGH} from '../../../../shared/pixel/rooms/drill';
import {drawGergPhoneInsert} from '../../../../shared/pixel/kits/gerg-phone-insert';
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
import {masWalkAt} from '../../../../shared/pixel/cast/mas-stand';
import {gergTypeAt} from '../../../../shared/pixel/cast/gerg';
import {
  litBand, SENTENCE, blinkLid, cursorPath, ease2, sleepLed, fingerECU, rimaMarkerHand, otsRima, glassCount, deal2S, passerBy,
  guestCard, bottomShade, grains, castMask, chatCard, twelfthKey,
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

// ================================================================== the lit band (5.02 k 43 → 5.08's click)
const voOn = (sh: PxShot, k: number) => sh.lines.some((l) => l.kind === 'vo' && k >= l.s && k < l.e + 15);
/** the lit band's two moments, each 4 s at most (pov-and-framing §4.5): 5.02, the band lights as the cursor drifts to
 *  the button and parks (then dims back to cutscene mode); 5.08, it lights again for the press and dims out after the
 *  click (the script: "the band dims back into cutscene mode"). Everywhere else the host's own dark band */
const LIT_MAX = 96; // 4 s
const litLevel = (sh: PxShot, k: number) => {
  if (sh.id === '5.02') {
    const c = mk(sh, 'cursor', 43), off = c + LIT_MAX; // lit 4 s from the cursor's arrival, the dim-out inside them
    return k < c ? 0 : k < c + 2 ? 1 : k < c + 4 ? 2 : k < off - 8 ? 3 : k < off - 4 ? 2 : k < off ? 1 : 0;
  }
  if (sh.id === '5.08') { const c = mk(sh, 'click', 24); return k < 2 ? 1 : k < 4 ? 2 : k < c + 4 ? 3 : k < c + 8 ? 2 : k < c + 12 ? 1 : 0; }
  return 0;
};
const band = (fb: Buf, sh: PxShot, k: number, f: number): LayoutOut => {
  const lv = litLevel(sh, k);
  if (lv === 0) return {};
  const ui = sh.texts.filter((t) => t.kind === 'ui' && k >= t.s && k < t.e).pop();
  litBand(fb, sh, k, f, LOCK.rails, {level: lv === 3 && voOn(sh, k) ? 2 : lv, text: ui ? ui.text : SENTENCE});
  return {full: true};
};
/** his breath at the desk (the desk sprite's breathe drawing, a slow held loop) */
const breathe = (f: number) => (Math.floor(f / 36) % 2) as 0 | 1;

// ================================================================== SC 5 · LAUNCH NIGHT, THE BULLPEN
L.add('5.01', {
  st: 'PROP-BEIGE-BUTTON launch-button drawButtonECU (the button where the 1993 OK sat, its strip `research preview`) + extras.sleepLed (his closed laptop asleep in the corner, breathing)',
  draw: (fb, k, sh, f) => { drawButtonECU(fb, f, {}); sleepLed(fb, f); },
});
L.add('5.02', {
  st: 'ROOM-BULLPEN-LAUNCH drawLaunchWide (the arrival, held: Gerg typing in his green, Rima at LOW-KEY twice-underlined, Alyi in the glass, Mas at the end desk breathing); Gerg glances up as Mas names him, Rima steps back from her board as he names her; the cursor drifts to the button and parks (drawCursor); the band lights (extras.litBand)',
  face: {GERG: 'room'},
  marks: {cursor: ['txt', 'UI: Push button', 'at', 0], rima: ['w', 'v3-vo-01', 'rima', 0], gerg: ['w', 'v3-vo-01', 'gerg', 0]},
  draw: (fb, k, sh, f) => {
    const g = mk(sh, 'gerg', 29), r = mk(sh, 'rima', 72), c = mk(sh, 'cursor', 43);
    drawLaunchWide(fb, f, {
      underlines: 2, alyi: 'there', laptop: 'dark',
      rima: {body: k < r + 4 ? 'write' : 'stand', head: 'back'},
      mas: {head: 'turn', breathe: breathe(f)},
      gerg: {mouth: openRest(sh, k, 'GERG'), look: k >= g && k < g + 16 ? 1 : 0},
    });
    if (k >= c) { const [x, y] = cursorPath(k, c, c + 27, [262, 92], [131, 135]); drawCursor(fb, x, y); }
    return band(fb, sh, k, f);
  },
});
L.add('5.03', {
  st: 'ROOM-BULLPEN-LAUNCH drawLaunch2S (desk to desk: Mas fg left, two collars; Gerg typing in his green, lip-synced, not looking up; the board\'s edge; the button and the parked cursor); Mas\'s eyes go to Rima\'s board on her line and his prediction; plate GERG MOCKBRAN by Gerg',
  face: {GERG: 'lip'},
  marks: {rimaOn: ['on', 'e1-a1-5-02', 0], voEnd: ['end', 'v3-vo-02', 10]},
  draw: (fb, k, sh, f) => {
    const lid = blinkLid(k, 3, 113);
    drawLaunch2S(fb, f, {
      cursor: true, underlines: 2, laptop: 'dark',
      gerg: {head: 'type', mouth: mouth(sh, k, 'GERG'), lid: lid === 2 ? 2 : 1},
      mas: {look: k >= mk(sh, 'rimaOn', 47) && k < mk(sh, 'voEnd', 164) ? 0 : 1},
    });
    plate(fb, sh, k, 'GERG', 302, 154, 'GERG');
    return band(fb, sh, k, f);
  },
});
L.add('5.04', {
  st: 'extras.otsRima = ROOM-BULLPEN-LAUNCH launchBackM (the back wall drifting 8 px toward the glass over the hold) + rima-speak portrait (lip-synced; blinks; she smooths her lapel before her question, lifts her brow waiting on him, firms on "a fortune", half-lids at Gerg\'s "v2 problem") + his desk\'s edge + otsShoulder + the button and cursor lifted clear of the V.O. line; Alyi small and soft in the glass; plate RIMA TAMURI',
  face: {RIMA: 'lip'},
  marks: {ask: ['on', 'e1-a1-5-06', 0], askEnd: ['end', 'e1-a1-5-06', 0], answered: ['end', 'e1-a1-5-07', 6], fortune: ['w', 'e1-a1-5-08', 'fortune', -6], v2: ['on', 'e1-a1-5-09', 4]},
  draw: (fb, k, sh, f) => {
    const ask = mk(sh, 'ask', 232), askEnd = mk(sh, 'askEnd', 366), ans = mk(sh, 'answered', 507), fortune = mk(sh, 'fortune', 630), v2 = mk(sh, 'v2', 665);
    const brow = k >= askEnd - 14 && k < ans ? 'lift' : k >= fortune && k < v2 ? 'firm' : 'level';
    const hand = k >= ask - 6 && k < ask ? 'smooth0' : k >= ask && k < ask + 6 ? 'smooth1' : 'none';
    const bl = blinkLid(k, 5, 131);
    const lid = k >= v2 ? (bl === 2 ? 2 : 1) : bl;
    otsRima(fb, f, {
      camX: 470, cursor: true,
      rima: {mouth: mouth(sh, k, 'RIMA'), lid, brow, hand},
      alyi: {soft: true, eyes: blinkLid(k, 9, 157) === 2 ? 'closed' : 'open', mouth: 'rest', t: f},
    });
    plate(fb, sh, k, 'RIMA', 122, 150, 'RIMA');
    return band(fb, sh, k, f);
  },
});
L.add('5.05', {
  st: 'ROOM-BULLPEN-LAUNCH drawLaunchGlass (the close glass: Alyi\'s reflection in its doorway, lip-synced; the cut on the turn); plate ALYI beside him',
  face: {ALYI: 'lip'},
  draw: (fb, k, sh, f) => {
    drawLaunchGlass(fb, f, {alyi: {mouth: mouth(sh, k, 'ALYI'), eyes: 'open', t: f}});
    plate(fb, sh, k, 'ALYI', 318, 118, 'ALYI');
    return band(fb, sh, k, f);
  },
});
L.add('5.06', {
  st: 'ROOM-BULLPEN-LAUNCH drawLaunchMcuRima (Rima turned from the glass to Mas, waiting: her beat); brow up while she waits, a blink, and after "…still a preview." her lids come half down (his answer landing on her face)',
  marks: {answer: ['end', 'e1-a1-5-11', 4]},
  draw: (fb, k, sh, f) => {
    const a = mk(sh, 'answer', 58);
    const bl = blinkLid(k, 0, 1000);
    drawLaunchMcuRima(fb, f, {rima: {brow: k < a ? 'lift' : 'level', lid: k >= a + 2 ? (bl === 2 ? 2 : 1) : k >= 8 && k < 14 ? blinkLid(k - 8, 0, 1000) : 0}});
    return band(fb, sh, k, f);
  },
});
L.add('v3-5.06b', {
  st: 'ROOM-BULLPEN-LAUNCH drawLaunchGlass (the 5.05 setup held on Alyi in the glass, still watching the button: a slow blink twice) under Mas\'s V.O.',
  draw: (fb, k, sh, f) => {
    const shut = (k >= 44 && k < 52) || (k >= 122 && k < 130);
    drawLaunchGlass(fb, f, {alyi: {eyes: shut ? 'closed' : 'open', t: f}});
    return band(fb, sh, k, f);
  },
});
L.add('5.07', {
  st: 'ROOM-BULLPEN-LAUNCH drawLaunch2S (Gerg: one key with a flourish, then "Your button." without looking up, lip-synced) + extras.rimaMarkerHand (behind him, Rima\'s hand draws the third underline on the marker\'s squeak) ; Mas\'s head goes down to the button after "Your button."',
  face: {GERG: 'lip'},
  marks: {key: ['snd', 'key_tap_space', 1, 0], squeak: ['snd', 'marker_write_q', 1, 0], button: ['end', 'e1-a1-5-12', 8]},
  draw: (fb, k, sh, f) => {
    const key = mk(sh, 'key', 4), sq = mk(sh, 'squeak', 79), down = mk(sh, 'button', 76);
    const talk = lipOn(sh, k, 'GERG');
    const gerg = {head: (talk ? 'talk' : 'type') as 'talk' | 'type', mouth: mouth(sh, k, 'GERG'), type: (k >= key && k < key + 3 ? 2 : k >= key + 3 && k < key + 6 ? 1 : 0) as 0 | 1 | 2};
    const wet = clamp((k - sq) / 12, 0, 1);
    drawLaunch2S(fb, f, {cursor: true, underlines: k < sq ? 2 : 3, wet: k < sq ? 1 : wet, laptop: 'dark', gerg, mas: {head: k >= down ? 'down' : '34', lid: k >= down ? 1 : 0}});
    if (k >= sq - 6 && k < sq + 18) rimaMarkerHand(fb, f, k < sq ? 0 : wet, gerg);
    return band(fb, sh, k, f);
  },
});
L.add('5.08', {
  st: 'PROP-BEIGE-BUTTON drawButtonECU via extras.fingerECU (the parked cursor on the cap, then his finger comes in without a hover in three held steps and takes the cursor\'s place: touch, the click, the LED lights, nothing happens); the band dims back into cutscene mode in held steps',
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
    return band(fb, sh, k, f);
  },
});
L.add('5.09', {
  st: 'extras.glassCount = ROOM-BULLPEN-LAUNCH launchBackM (camX 460: Alyi\'s reflection in the glass, lip-synced, low, to Mas only; he turns out of the doorway and goes on his footsteps) + rima-stand at the board (capping her marker, back to them) + Mas\'s portrait soft in the fg (two rungs down, lip-synced; he turns from the empty glass to the room for "let\'s see if anyone notices.") + the button under his hand; the hold after',
  face: {ALYI: 'lip', MAS: 'lip'},
  marks: {steps: ['snd', 'synth:steps_far', 1, 0], turn: ['on', 'e1-a1-5-16', -6]},
  draw: (fb, k, sh, f) => {
    const go = mk(sh, 'steps', 244), turn = mk(sh, 'turn', 262);
    const alyi = k < go - 6 ? {mouth: mouth(sh, k, 'ALYI'), eyes: 'open' as const, t: f} : k < go + 2 ? {soft: true, mouth: 'rest' as const, eyes: 'open' as const, t: f} : 'gone' as const;
    glassCount(fb, f, {alyi, rima: {body: k < 110 ? 'cap' : 'stand', head: 'back'}, mas: {mouth: say(sh, k, 'MAS'), head: k >= turn ? 'front' : '34'}});
  },
});
// ---- the chat: the bubble lights before anyone types
const BOT1 = 'What a great question!', BOT2 = "Brilliant! You're clearly a visionary.", USER = 'is anyone there?';
L.add('5.10', {
  st: 'ROOM-BULLPEN-LAUNCH drawLaunchOTSLaptop + UI-CHAT drawChatWindow + CAST-CHATGTP (the bubble idle, then lit with its glow before anyone types; it talks on its lines; its replies type on; he types his one line in the input row, sends it; the plate CHATGTP · USERS: 0 is the window\'s own) · Rima leaning in, lip-synced, blinking · Gerg\'s hands typing at the frame edge',
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
      f, gergHands: true,
      rima: {mouth: mouth(sh, k, 'RIMA'), lid: blinkLid(k, 2, 101), brow: inLine(sh, 'e1-a1-5-20', k, 0, 12) ? 'firm' : 'level'},
      chat: {bubble, users: 0, lines, input, caret: k >= ty - 10 && k < sent && Math.floor(k / 8) % 2 === 0},
    });
    // the second reply: the window's own card, set below the product plate (the window would stack it over the plate)
    if (k >= b2) chatCard(fb, 152, 88, 242, BOT2.slice(0, Math.floor((k - b2) * 1.1)));
  },
});
L.add('5.11', {
  st: 'ROOM-BULLPEN-LAUNCH drawLaunchMcuMas (lit from below by the chat; the bullpen soft behind): he reads it, says "it likes me." (lip-synced) and keeps the one-pixel smile until Gerg deflates it; his eyes go back to the screen on the V.O., and the smile comes back on "twice"',
  face: {MAS: 'lip'},
  marks: {said: ['end', 'e1-a1-5-22', 0], deflate: ['w', 'e1-a1-5-23', 'inspired', 0], again: ['w', 'v3-vo-05', 'still', 0], twice: ['w', 'v3-vo-05', 'twice', 6]},
  draw: (fb, k, sh, f) => {
    const said = mk(sh, 'said', 45), deflate = mk(sh, 'deflate', 110), again = mk(sh, 'again', 150), twice = mk(sh, 'twice', 176);
    const smile = (k >= said && k < deflate) || k >= twice;
    const m = saying(sh, k, 'MAS') ? mouth(sh, k, 'MAS') : smile ? 'smile' : 'rest';
    drawLaunchMcuMas(fb, f, {mas: {mouth: m, look: k < 16 || k >= again ? -1 : 1}});
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
  st: 'ROOM-BULLPEN-LAUNCH drawLaunchWide st.odo (the desk-sized odometer on his desk, dropping through it in two held drawings on the clunk, the hole in the top) + CAST-GERG-POSES armsUp (Gerg jumps up, the count) + rima-stand (beside his desk, then peering down); a whole-pixel shake on the clunk, splinters settling, his lids down to the hole',
  marks: {clunk: ['snd', 'letter_clunk', 1, 0]},
  draw: (fb, k, sh, f) => {
    const c = mk(sh, 'clunk', 0);
    const stage = k < c + 1 ? 'desk' : k < c + 4 ? 'drop1' : k < c + 8 ? 'drop2' : 'gone';
    drawLaunchWide(fb, f, {
      underlines: 3, alyi: 'gone', laptop: 'chat',
      rima: k < c + 14 ? {body: 'stand', head: 'face', at: [196, 166], flip: true} : {body: 'peer', head: 'down', at: [196, 166], flip: true},
      odo: {stage}, gerg: {armsUp: k >= c + 2}, mas: {head: 'turn', lid: k >= c + 10 ? 1 : 0, breathe: breathe(f)},
    });
    if (k >= c + 4 && k < c + 22) grains(fb, f, 100, 150, 130, 142, 5, 61, PAL.G3);
    const dy = [2, -2, 1, -1, 1, 0][k - c] ?? 0;
    if (dy) shiftRoom(fb, 0, dy);
  },
});
L.add('6.04', {
  st: 'INSERT-GERG-PHONE drawGergPhoneInsert (his desk in the laptop\'s green: the phone buzzes, NOLE\'s post lands in its own UI, Gerg\'s thumb hearts it, Rima\'s fingertip reaches in and un-hearts it) + plate NOLE outside the UI once the post has been read',
  marks: {buzz: ['snd', 'phone_buzz_desk', 1, 0], heart: ['snd', 'heart_tap_1', 1, 0], unheart: ['snd', 'heart_tap_2', 1, 0]},
  draw: (fb, k, sh, f) => {
    const b = mk(sh, 'buzz', 2), h1 = mk(sh, 'heart', 69), h2 = mk(sh, 'unheart', 100);
    drawGergPhoneInsert(fb, f, {k: Math.max(0, k - b), heart: k < h1 ? 0 : k < h2 ? 1 : 2});
    plate(fb, sh, k, 'NOLE', 360, 44, PAL.R3);
  },
});
L.add('6.06', {
  st: 'SET-DRILL drawWedgedWheel (far down, wedged in the bedrock: the last wheel settles in held steps on the ratchet, then holds legible, 1,000,000) + grit trickling round it',
  marks: {r: ['snd', 'odometer_ratchet', 1, 0]},
  draw: (fb, k, sh, f) => {
    const r = mk(sh, 'r', 3);
    const settle = k < r ? 0 : k < r + 5 ? 1 : k < r + 9 ? 2 : 3;
    drawWedgedWheel(fb, f, {settle});
    grains(fb, f, 120, 360, 20, 60, 6, 71, PAL.D2);
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
  st: 'CAST-MAS-TEAR drawLaunchMcuPF (looking down the hole, the bullpen stepped down behind him, the hole\'s red rim under his jaw rising a step as Rima speaks; the tear wells and slides down his cheek a pixel every 4 f, then holds at the jaw); "it\'s the bill." lip-synced with his eyes up toward her, then down again for "mostly the bill."',
  face: {MAS: 'lip'},
  marks: {bill: ['on', 'e1-a1-7-02', -4], billEnd: ['end', 'e1-a1-7-02', 4]},
  draw: (fb, k, sh, f) => {
    const b0 = mk(sh, 'bill', 79), b1 = mk(sh, 'billEnd', 111);
    const up = k >= b0 && k < b1;
    // the tear wells at his lower lid and holds a second (Rima sees it), then slides a pixel every 4 f to reach his jaw as he says it
    const well = Math.max(0, b0 - 56);
    drawLaunchMcuPF(fb, f, {tear: k < well ? 0 : k - well, glow: k < 30 ? 1 : 2, mas: {mouth: say(sh, k, 'MAS'), lid: up ? 0 : 1, look: up ? 1 : 0}});
  },
});
L.add('7.02', {
  st: 'SET-DRILL: drawHoleHigh (the tear falls down the shaft) → drawGpuTear (it lands on a red-hot GPU: the splash, tssss, three held puffs) → drawHoleHigh again, his phone lit red at the top edge (the siren\'s J-cut); three setups inside the stick\'s one beat',
  marks: {hiss: ['snd', 'steam_hiss', 1, 0], phone: ['txt', '( ! )', 'at', 0]},
  draw: (fb, k, sh, f) => {
    const land = mk(sh, 'hiss', 10), ph = mk(sh, 'phone', 48);
    if (k < land) { drawHoleHigh(fb, f, {tile: 'gone', glow: 3, racks: 2, dollar: true, tear: k / land, phone: 'dark'}); return; }
    if (k < ph) { drawGpuTear(fb, f, {k: k - land}); return; }
    drawHoleHigh(fb, f, {tile: 'gone', glow: 3, racks: 2, dollar: true, tear: null, phone: 'red'});
    // the last of the steam rising out of the shaft (held on 3s)
    const B = HIGH.bottom, rise = Math.floor((k - ph) / 3);
    for (let i = 0; i < 6; i++) { const x = B.x0 + 14 + ((i * 7) % 26), y = B.y0 + 10 - rise * 2 - i * 3; if (y > HIGH.hole.y0) { fb.set(x, y, PAL.G5); fb.set(x + 1, y, PAL.G4); } }
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
  st: 'ROOM-ELGOOG (the siren turning) + CAST-FOUNDERS: NIRB and EGAP climb out of the crypt one held step at a time, backlit, shading their eyes, out onto the lobby (EGAP\'s RETIRED 2019 mug); Radnus holds up his phone for "Search is fine", folds his hands for "It is ours. We published it.", pats his sleeve; NIRB reaches for "badges" · room-scale mouth for Radnus, silhouettes carry theirs by gesture',
  face: {RADNUS: 'room'},
  marks: {nirb: ['f', 14], egap: ['f', 24], search: ['on', 'e1-a1-8-03', -4], ours: ['on', 'e1-a1-8-05', -4], badges: ['on', 'e1-a1-8-06', -6], nirbTalk: ['on', 'e1-a1-8-02', -2], egapTalk: ['on', 'e1-a1-8-04', -2]},
  draw: (fb, k, sh, f) => {
    const n0 = mk(sh, 'nirb', 14), e0 = mk(sh, 'egap', 24), srch = mk(sh, 'search', 160), ours = mk(sh, 'ours', 380), badges = mk(sh, 'badges', 463), eT = mk(sh, 'egapTalk', 296);
    const nStep = k < n0 ? -1 : Math.min(3, Math.floor((k - n0) / 12));
    const eStep = k < e0 ? -1 : Math.min(3, Math.floor((k - e0) / 12));
    const stepping = (k0: number, st: number) => st >= 1 && st <= 3 && ((k - k0) % 12) < 5 && (k - k0) < 42;
    const arm = k < srch ? 'ext' : k < srch + 126 ? 'phone' : k >= ours && k < ours + 70 ? 'fold' : k >= 330 && k < 338 ? 'pat' : 'ext';
    const fire = arm === 'pat' ? 3 : radnusFlameAt(f);
    drawElgoogLobby(fb, f, {
      slab: 3, lift: 3, turning: true, chrome: true,
      radnus: {arm: arm as 'ext' | 'phone' | 'fold' | 'pat', fire: fire as 0 | 1 | 2 | 3, mouth: roomMouth(sh, k, 'RADNUS') === 'open' ? 'open' : 'smile'},
      nirb: nStep < 0 ? null : {step: nStep, arm: k >= badges ? 'reach' : nStep >= 3 && k >= mk(sh, 'nirbTalk', 60) ? 'down' : 'shade', legs: stepping(n0, nStep) ? 'step' : 'stand'},
      egap: eStep < 0 ? null : {step: eStep, arm: eStep >= 3 ? (k >= eT && k < eT + 40 ? 'reach' : 'mug') : 'shade', legs: stepping(e0, eStep) ? 'step' : 'stand'},
    });
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
L.add('9.01', {
  st: 'ROOM-LOBBY-DEAL drawDealWide (the arrival: the lobby by day, NOPEAI · A NONPROFIT in gold on the door, Tasya already standing there like part of the wall, still, 11 keys) · Mas walks in from frame left to the desk (mas-stand walk) · PROP-CHECK: the check slides in through the doors in held steps and jams in the revolving door on the nudge, legible in the wide',
  marks: {jam: ['snd', 'glass_nudge', 1, 0]},
  draw: (fb, k, sh, f) => {
    const jam = mk(sh, 'jam', 53);
    const mx = Math.min(150, -16 + Math.round(Math.max(0, k - 2) * 2.4)), walking = mx < 150;
    const base: DealWideState = {mas: {at: [mx, 190], legs: walking ? masWalkAt(f) : 'stand', collars: 2}, tasya: {at: DEAL.tasya, keys: 11}};
    if (k >= jam) { drawDealWide(fb, f, {...base, check: 'jammed', pen: true}); return; }
    const kk = k - (k % 2);
    if (k < jam - 14) { drawDealWide(fb, f, {...base, check: null}); return; }
    underCast(fb, f, {...base, check: null, revolve: 1}, (b) => drawCheck(b, DEAL.checkJam[0] - (jam - kk) * 17, DEAL.checkJam[1], {pen: true, stub: DEAL.stub}));
  },
});
L.add('9.04', {
  st: 'ROOM-LOBBY-DEAL drawDealWide + dealFreeze (THE FULL FREEZE: the lobby printed navy and cream, Mas alone in colour keeps moving: he walks to the jammed check and pockets its pen on the tick) + shared/pixel/ui nameCard: TASYA / THE LANDLORD with its stat RUNS MACROSOFT (the scene\'s gag card) · the frame\'s foot a rung darker under the V.O.',
  marks: {pen: ['snd', 'pen_tick_1', 1, 0], card: ['txt', 'TASYA', 'at', 0]},
  draw: (fb, k, sh, f) => {
    const pen = mk(sh, 'pen', 80), card = mk(sh, 'card', 2);
    const mx = Math.min(214, 150 + Math.round(Math.max(0, k - 6) * 1.6)), walking = mx < 214;
    const arm = k >= pen - 10 && k < pen ? 'reach' : k >= pen && k < pen + 14 ? 'pocket' : 'down';
    const live = new Mask(480, 270);
    drawDealWide(fb, f, {check: 'jammed', pen: k < pen, mas: {at: [mx, 188], flip: true, legs: walking ? masWalkAt(f) : 'stand', arm, collars: 2}, tasya: {at: DEAL.tasya, keys: 11}, live});
    dealFreeze(fb, live);
    // the frame's foot in the print's navy under the V.O. line (the sunlit floor prints cream there)
    const ink = fb.get(476, 150);
    for (let y = 180; y < RH; y++) for (let x = 0; x < 300; x++) { if (y < 186 && bayer(x, y) > (y - 180) / 6) continue; if (!live.a[y * 480 + x]) fb.set(x, y, ink); }
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
  st: 'ROOM-LOBBY-DEAL 2S via extras.deal2S (pan 110, the art\'s; its gap filled from a car-free frame) (the freeze lifts: Mas left, Tasya right, the jammed check between; Tasya lip-synced, warm, blinking) + Gerg at the door behind, tugging the check\'s corner from his entrance',
  face: {TASYA: 'lip'},
  marks: {gerg: ['f', 83]},
  draw: (fb, k, sh, f) => {
    deal2S(fb, f, {pan: 110, check: 'jammed', gerg: k >= mk(sh, 'gerg', 83), collars: 2, tasya: {mouth: lipOn(sh, k, 'TASYA') ? mouth(sh, k, 'TASYA') : 'smile', lid: blinkLid(k, 4, 89), brow: 'warm'}, mas: {look: 1}});
  },
});
L.add('9.07', {
  st: 'ROOM-LOBBY-DEAL drawDealWide: the check slides out of the door onto the floor in held steps (drawCheckFloor) and fits like a floor; Mas walks straight onto it (the step on the footstep); Tasya by the desk, Gerg at the door',
  marks: {slide: ['snd', 'folder_slide', 1, 0], step: ['snd', 'footstep_hard_2', 1, 0]},
  draw: (fb, k, sh, f) => {
    const sl = mk(sh, 'slide', 7), stp = mk(sh, 'step', 49);
    const mx = Math.min(152, 110 + Math.round(Math.max(0, k - (stp - 20)) * 2.1)), walking = mx < 152;
    const base: DealWideState = {mas: {at: [mx, 184], legs: walking ? masWalkAt(f) : 'stand', collars: 2}, tasya: {at: [336, 186], keys: 11}, gerg: {body: 'tug', at: [60, 178]}};
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
  st: 'ROOM-LOBBY-DEAL drawDealMcuMas + PROP-COLLARS: pop, the third collar surfaces with its 1-px hop; the lobby soft behind',
  marks: {pop: ['snd', 'collar_pop_F5', 1, 0]},
  draw: (fb, k, sh, f) => {
    const p = mk(sh, 'pop', 0);
    drawDealMcuMas(fb, f, {collars: k >= p ? 3 : 2, collarPop: k >= p ? k - p : undefined, check: 'floor'});
  },
});
L.add('9.09', {
  st: 'extras.deal2S = ROOM-LOBBY-DEAL\'s 2S re-composed with the soft lobby\'s pan drifting 110 → 120 over the hold: Mas (three collars, lip-synced) standing on the check, Tasya warm and unhurried (lip-synced, blinking; the ring comes up on "our servers", 11 keys; he walks out of frame right on "Everyone is welcome", the jangles going with him); Mas looks down at what he is standing on before "and the rent?"',
  face: {TASYA: 'lip', MAS: 'lip'},
  marks: {itdoes: ['end', 'v3-vo-09', 4], rent: ['on', 'e1-a1-9-05', -3], servers: ['w', 'e1-a1-9-06', 'servers', -8], lights: ['w', 'e1-a1-9-06', 'lights', -4], lot: ['on', 'e1-a1-9-07', 0], leave: ['on', 'e1-a1-9-08', -8]},
  draw: (fb, k, sh, f) => {
    const itd = mk(sh, 'itdoes', 89), rent = mk(sh, 'rent', 120), srv = mk(sh, 'servers', 230), lts = mk(sh, 'lights', 330), leave = mk(sh, 'leave', 554);
    const tx = k < leave ? 380 : 380 + (Math.floor((k - leave) / 2) + 1) * 10;
    const tArm = k >= srv && k < lts ? 'ring' : 'clasp';
    const tMouth = lipOn(sh, k, 'TASYA') ? mouth(sh, k, 'TASYA') : 'smile';
    const masDown = k >= itd && k < rent;
    deal2S(fb, f, {
      pan: 110, check: 'floor', collars: 3,
      mas: {mouth: say(sh, k, 'MAS'), head: masDown ? 'down' : '34', lid: masDown ? 1 : 0, look: k >= mk(sh, 'lot', 515) - 30 && k < mk(sh, 'lot', 515) ? 0 : 1},
      tasya: tx < 480 ? {mouth: tMouth, lid: blinkLid(k, 6, 103), brow: 'warm', arm: tArm, keys: 11, jangle: (tArm === 'ring' ? Math.floor(f / 5) % 2 : 0) as 0 | 1} : null,
      tasyaX: tx,
    });
  },
});
L.add('9.10', {
  st: 'ROOM-LOBBY-DEAL drawDealWide (weeks on, the time jump held: the check scuffed grey on the floor, Gerg sitting on its edge with his laptop, Mas at the desk, Tasya where he stood with a twelfth key in NopeAI beige that catches the light; the TV comes on with GNIB (UI-TV drawTvPicture)) + extras.passerBy (an employee crossing the check without looking down) · Gerg and Tasya at room scale from their takes',
  face: {GERG: 'room', TASYA: 'room'},
  marks: {tv: ['txt', 'TV: MACROSOFT', 'at', 0], walk: ['snd', 'synth:steps_stone', 1, -16]},
  draw: (fb, k, sh, f) => {
    const tv = mk(sh, 'tv', 50), w0 = mk(sh, 'walk', 12);
    const st: DealWideState = {
      check: 'scuffed', tv: {show: k < tv ? 'off' : 'gnib'},
      mas: {at: [170, 184], collars: 3},
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
    drawTvScreen(fb, f, {show: 'telescope', k: k < s2 ? 0 : k < s3 ? 1 : 2, ticker: clamp((k - tk) / 40, 0, 1), figure: k >= stp});
    if (k >= stp && k < stp + 6) tvLedger(fb);
  },
});
L.add('9.13', {
  st: 'ROOM-LOBBY-DEAL drawDealGerg2S (Mas at the desk with his glass, three collars, "ours does that too." lip-synced; Gerg on the check\'s edge looks from the TV to Mas, then down at his laptop, and closes it on the click: the lid shut at LOBBY_LID, held — the match cut\'s first half; the TV holds the telescope and its figure)',
  face: {MAS: 'lip'},
  marks: {close: ['snd', 'folder_close', 1, 0], said: ['on', 'e1-a1-9-11', -6]},
  draw: (fb, k, sh, f) => {
    const c = mk(sh, 'close', 82), said = mk(sh, 'said', 25);
    const lid = (k < c - 3 ? 0 : k < c ? 1 : 2) as 0 | 1 | 2;
    const gHead = k < said ? 'up' : k < c - 10 ? 'up' : 'type';
    drawDealGerg2S(fb, f, {lid, collars: 3, mas: {mouth: say(sh, k, 'MAS')}, gerg: {head: gHead, look: k >= said && k < c - 10 ? -1 : 0, lid: gHead === 'type' ? 1 : 0}});
  },
});

// ================================================================== SC 11 · THE DUEL (a meanwhile split, by a match cut)
L.add('11.01', {
  st: 'SPLIT-DUEL drawDemoArrival (MATCH CUT: the day bullpen dressed as the demo stage under the hand-lettered GTP-4 banner, Mas at his end desk behind it; Gerg in the fg exactly where he sat in 9.13, his lid opening at LOBBY_LID in held steps, then typing)',
  draw: (fb, k, sh, f) => {
    const lid = (k < 4 ? 2 : k < 8 ? 1 : 0) as 0 | 1 | 2;
    drawDemoArrival(fb, f, {lid, gerg: {head: 'type', type: lid === 0 ? gergTypeAt(f) : 0}});
  },
});
/** the split's foot a rung down (both panes): the V.O. rows on shadow (the left pane is a day room) */
const splitFoot = (fb: Buf) => bottomShade(fb, 180, 1);
L.add('11.03', {
  st: 'SPLIT-DUEL drawDuelSplit phrase 1: LEFT the demo (Gerg typing, then holding up the napkin and photographing it on the shutter; the photo on the demo screen) · RIGHT the lighthouse (CLOD unlit on its plinth; Mario writing, then dictating his memo as the scroll grows) · plates CLOD 1 · SAME DAY and MARIO in the right pane',
  marks: {memo: ['on', 'e1-a1-11-01', 0], memoEnd: ['end', 'e1-a1-11-01', 0], snap: ['snd', 'camera_shutter', 1, 0]},
  draw: (fb, k, sh, f) => {
    const m0 = mk(sh, 'memo', 141), m1 = mk(sh, 'memoEnd', 300), snap = mk(sh, 'snap', 206);
    const gerg = k < snap - 40 ? 'type' : k < snap ? 'napkin' : k < snap + 3 ? 'snap' : 'type';
    drawDuelSplit(fb, f, {
      left: {gerg, screen: k >= snap + 4 ? 'napkin' : 'blank'},
      right: {light: 0, mario: k >= m0 && k < m1 ? 'dictate' : 'write', scroll: 30 + Math.floor(Math.max(0, k - m0) / 8), f},
    });
    splitFoot(fb);
    plate(fb, sh, k, 'CLOD', 250, 14, PAL.W5);
    const mt = textOf(sh, 'label', 'MARIO');
    if (mt && k >= mt.s && k < mt.e) drawPlate(fb, {...mt, kind: 'plate'}, k - mt.s, 404, 90, ACCENT.MARIO ?? PAL.F6);
  },
});
L.add('11.04', {
  st: 'SPLIT-DUEL drawDuelSplit phrase 2: RIGHT the launch light slams on and CLOD bows ("You\'re absolutely right!"), then rises; Mario looks up at the split line, "Addendum.", writes · LEFT the napkin swaps into a working website in two drawings on the pop (NAPKIN → WEBSITE, the demo\'s own caption) and the bullpen cheers in two held drawings',
  marks: {clod: ['on', 'e1-a1-11-02', -2], clodEnd: ['end', 'e1-a1-11-02', 0], add: ['on', 'e1-a1-11-03', 0], site: ['snd', 'ui_toast_pop', 1, 0], cheer: ['snd', 'synth:cheer', 1, 0]},
  draw: (fb, k, sh, f) => {
    const c0 = mk(sh, 'clod', 6), c1 = mk(sh, 'clodEnd', 41), add = mk(sh, 'add', 76), site = mk(sh, 'site', 105), ch = mk(sh, 'cheer', 120);
    const mario = k < c1 + 10 ? 'write' : k < add ? 'lookup' : k < add + 22 ? 'dictate' : 'write';
    const cheer = k >= ch && k < ch + 38 ? ((Math.floor((k - ch) / 6) % 2) + 1) as 1 | 2 : 0;
    drawDuelSplit(fb, f, {
      left: {gerg: k < site ? 'glance' : 'type', screen: k < site ? 'napkin' : k < site + 6 ? 'site1' : 'site2', cheer},
      right: {light: k >= c0 ? 1 : 0, clod: k >= c0 && k < c1 + 4 ? {pose: 'bow', smile: true} : {}, mario, scroll: 50 + Math.floor(Math.max(0, k - add) / 10), f},
    });
    splitFoot(fb);
  },
});
L.add('11.05', {
  st: 'SPLIT-DUEL drawDuelSplit phrase 3: LEFT Mas holds up his phone and his post pops over the pane (post-card, in his lowercase), everyone\'s phones come out, the bullpen cheers harder · RIGHT Mario reads the same post on his phone, then adds a line to the scroll on the scribble',
  marks: {post: ['snd', 'post_click', 1, 0], cheer: ['snd', 'synth:cheer', 1, 0], scrib: ['snd', 'pen_scribble_short', 1, 0]},
  draw: (fb, k, sh, f) => {
    const p = mk(sh, 'post', 4), ch = mk(sh, 'cheer', 45), sc = mk(sh, 'scrib', 67);
    const cheer = k >= ch && k < ch + 56 ? ((Math.floor((k - ch) / 5) % 2) + 1) as 1 | 2 : 0;
    drawDuelSplit(fb, f, {
      left: {gerg: 'type', screen: 'site2', masPhone: true, phones: k >= p + 18, cheer},
      right: {light: 1, mario: k < sc - 6 ? 'phone' : 'write', scroll: 60 + Math.floor(Math.max(0, k - sc) / 6), f},
      post: k >= p ? k - p : null,
    });
    splitFoot(fb);
  },
});
L.add('11.06', {
  st: 'SPLIT-DUEL drawDuelSplit phrase 4, the turn: RIGHT the second, longer scroll unrolls from Mario\'s hand and runs across the split line (the crossing, in held steps) until its end lands on Gerg\'s desk on the curl · LEFT Gerg photographs it (the shutter), MEMO → WEBSITE on the pop · RIGHT Mario holds the empty spindle; the hold',
  marks: {flutter: ['snd', 'synth:flutter', 1, 0], curl: ['snd', 'paper_curl', 1, 0], snap: ['snd', 'camera_shutter', 1, 0], site: ['snd', 'ui_toast_pop', 1, 0]},
  draw: (fb, k, sh, f) => {
    const fl = mk(sh, 'flutter', 12), cu = mk(sh, 'curl', 57), sn = mk(sh, 'snap', 63), si = mk(sh, 'site', 67);
    const unroll = k < fl ? 0 : clamp(Math.floor((k - fl) / 3) * 3 / 24, 0, 1);
    const cross = k < fl + 22 ? 0 : k >= cu ? 1 : clamp(Math.floor((k - fl - 22) / 3) * 3 / (cu - fl - 22), 0, 0.98);
    const gerg = k >= sn && k < sn + 3 ? 'snapScroll' : k >= sn - 10 && k < sn ? 'glance' : 'type';
    const screen = k < si ? 'memo' : k < si + 5 ? 'memo1' : 'memo2';
    drawDuelSplit(fb, f, {left: {gerg, screen}, right: {light: 1, mario: k >= si + 6 ? 'spindle' : 'write', unroll, f}, cross: cross || undefined});
    splitFoot(fb);
  },
});

// ================================================================== SC 12 · THE PAUSE LETTER (the act-out)
L.add('12.01', {
  st: 'UI-PAUSE-LETTER drawLetterOTS (over his shoulder at night: his monitor lights with PAUSE GIANT AI EXPERIMENTS on the toast; the push to full-bleed in held steps) → the whip on the paper\'s sound → drawClipboard gliding through the dark toward frame right (its clip\'s fine print PAUSES RECEIVED: 0 legible), into 12.02\'s glide',
  marks: {toast: ['snd', 'ui_toast_pop', 1, 0], whip: ['snd', 'paper_whip', 1, 0]},
  draw: (fb, k, sh, f) => {
    const t = mk(sh, 'toast', 9), w = mk(sh, 'whip', 52);
    const push = k < w - 14 ? 0 : k < w - 10 ? 1 : k < w - 6 ? 2 : 3;
    if (k < w) { drawLetterOTS(fb, f, {k: k - t, push}); return; }
    if (k < w + 3) { // the whip: the full-bleed page slides off to the right in three held frames, the dark behind it
      for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) fb.set(x, y, PAL.N0);
      const dx = [150, 300, 420][k - w];
      drawLetterPage(fb, dx, 0, 480, RH);
      for (let y = 0; y < RH; y++) for (let x = dx - 24; x < dx; x++) if (x >= 0 && bayer(x, y) < (x - dx + 24) / 24) fb.set(x, y, PAL.P0);
      return;
    }
    for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) fb.set(x, y, bayer(x, y) < 0.12 ? PAL.N1 : PAL.N0);
    const kk = k - (w + 3), gx = 150 + Math.floor(kk / 3) * 5, gy = 58 + Math.floor(kk / 6);
    // a faint lamp pool far off to the right: where it is going
    for (let y = 60; y < RH; y++) for (let x = 330; x < 480; x++) { const d = Math.hypot((x - 470) / 150, (y - 150) / 80); if (d < 1 && bayer(x, y) < (1 - d) * 0.35) fb.set(x, y, PAL.D1); }
    drawClipboard(fb, gx, gy, {});
  },
});
L.add('12.02', {
  st: 'ROOM-NOLE-DESK drawNoleDesk (a standing desk in the dark, his lamp: the clipboard glides in from the left in held steps and lands; he signs with his left hand (the flourish on the scribble) and solders a GPU under the desk with his right (sparks on the crackles); OIGNEB holds up PAUSE, higher for his line) · Nole and Oigneb at room scale from their takes · plates NOLE · BUILDING HIS OWN (riding the sparks) and OIGNEB',
  face: {NOLE: 'room', OIGNEB: 'room'},
  marks: {sign: ['snd', 'pen_scribble_short', 1, 0], c1: ['snd', 'synth:crackle', 1, 0], c2: ['snd', 'synth:crackle', 2, 0], og: ['on', 'e1-a1-12-02', -2], ogEnd: ['end', 'e1-a1-12-02', 12]},
  draw: (fb, k, sh, f) => {
    const sg = mk(sh, 'sign', 7), c1 = mk(sh, 'c1', 19), c2 = mk(sh, 'c2', 86), og = mk(sh, 'og', 97), ogE = mk(sh, 'ogEnd', 223);
    const clip = k < 2 ? 1 : k < 4 ? 2 : k < 6 ? 3 : 4;
    const sparks = k >= c1 && k < c1 + 34 ? k - c1 : k >= c2 && k < c2 + 24 ? k - c2 : null;
    drawNoleDesk(fb, f, {
      clip, signed: k < sg ? 0 : k < sg + 6 ? 1 : 2, sparks,
      nole: {mouth: room3Mouth(sh, k, 'NOLE')},
      oigneb: {sign: k >= og && k < ogE ? 'high' : 'chest', mouth: roomMouth(sh, k, 'OIGNEB') === 'open' ? 'open' : 'rest', blink: blinkLid(k, 8, 91) === 2},
    });
    plate(fb, sh, k, 'NOLE', 262, 152, PAL.R3);
    plate(fb, sh, k, 'OIGNEB', 356, 58, PAL.N7);
  },
});
L.add('12.04', {
  st: 'INSERT-PLEASE drawPleaseHigh (HARD CUT back out to his desk from above: his hand and the MACROSOFT pen, PLEASE, its last letter still being drawn on the pen\'s scratch); a 1-px knock on the cut (the glass nudged)',
  marks: {pen: ['snd', 'synth:pen', 1, 0]},
  draw: (fb, k, sh, f) => {
    const p = mk(sh, 'pen', 3);
    drawPleaseHigh(fb, f, {n: 5, part: clamp(0.15 + Math.floor(Math.max(0, k - p) / 3) * 3 * 0.012, 0.15, 0.8)});
    const dy = [1, -1, 1, 0][k] ?? 0;
    if (dy) shiftRoom(fb, 0, dy);
  },
});
L.add('12.05', {
  st: 'ROOM-BULLPEN-LAUNCH drawLaunchGlass (Mas soft in the fg, bent over the sheet; in the glass Alyi\'s reflection back in its doorway, reading the pause letter on his phone, not looking at Mas) + his thumb scrolling the reflected page (held steps) and the pen\'s tip moving on the sheet\'s corner',
  draw: (fb, k, sh, f) => {
    drawLaunchGlass(fb, f, {mas: 'bent', rima: null, underlines: 3, alyi: 'phone'});
    // the reflected phone's page scrolls a line every 18 frames (launchBackM's 'phone' page at camX 460)
    const px = 846 - 460 + 46, py = 48 + 84, s = Math.floor(k / 18) % 3;
    for (let j = 6; j < 21; j++) for (let i = 1; i < 12; i++) fb.set(px + i, py + j, (j + s) % 3 === 0 && i > 2 && i < 10 ? PAL.G6 : PAL.P1);
    // the pen on the sheet's corner (it's still writing: the scratch runs under the shot)
    const tx = 150 + ((Math.floor(k / 3) * 7) % 30), ty = 190 + (Math.floor(k / 6) % 2);
    fb.set(tx, ty, PAL.I0); fb.set(tx + 1, ty - 1, PAL.N1); fb.set(tx + 2, ty - 2, PAL.N1); fb.set(tx + 3, ty - 3, PAL.N2);
  },
});
L.add('12.06', {
  st: 'INSERT-PLEASE drawPleaseECU (PLEASE and blank paper under it; the pen on the last stroke, then it lifts in held steps on the tick: THREAT on the lift); the hold',
  marks: {lift: ['snd', 'pen_tick_3', 1, 0]},
  draw: (fb, k, sh, f) => {
    const l = mk(sh, 'lift', 36);
    drawPleaseECU(fb, f, {lift: k < l ? 0 : k < l + 4 ? 1 : 2});
  },
});
L.add('12.07', {
  st: 'BLACK: the act-out (cut to black on the sting\'s tail), the whole frame',
  draw: (fb) => { fb.c.fill(PAL.N0); return {full: true}; },
});

void LAUNCH; void stepColor; void ease2; void rect;
export const SEGMENT = defineSegment({seg: 'act1', lock: LOCK, layouts: L.all, review: {subtitle: 'PIXEL v3 · LOCK ACT1 (STICK TIMING) · v3-shots-act1'}});
