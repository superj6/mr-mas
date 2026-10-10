// MR. MAS — Ep2 v1 · act4 · scene 19: EVERY PHONE THEY SELL (JUN 10, 2024; the NopeAI lobby's watch party | ELPPA's
// campus; F2.1 in EARLY-WEB16; the walled garden). 20 shots, 3216 f on the v1 EL lock. The shots pass, 2026-10-09; the
// record is shots-act4.md. The staging is proposal.md sc 19 / script-v1 (the lock QA: the announcement and the
// stream's roar come up 0.2 s before "And profit?", the lobby's cheer lands on "profit"):
//   ARRIVE   19.01 the running keynote on the wall screen, the lobby half-listening (2 s): signs 202 / 102, the flyers
//            curling (his upside down), the complaint a side table, the tusk behind the back row; 19.02 the corner TV
//            held 1.5 s: the lectern still stuck at FLOOR, 0 BILLS; 19.03 the new CFO along the hand truck's path
//   TALK     19.04 Haras and Gerg (compute; different compute), the announcement behind them, the cheer takes "profit";
//            19.05 the stream full frame, the eruption, the confetti, "Upside."; 19.06 the stream's crowd cutaway (Mas
//            small at its edge, typing), "Is that Mas?", the laugh; Gerg, not cheering, takes out his phone
//   ACT      19.07 the campus: the crowd's backs and the giant screen (1.5 s) before Mas; he finishes his post and sends
//            it (its own UI, verbatim, his lowercase); 19.08 the stream's chat lights with it, phones buzz across the
//            lawn; his still face, V.O. 12 (lips still); 19.09-19.10 Gerg's call, crosscut (lip-synced both sides)
//   F2.1     19.11 the push into his phone, the breadcrumb across the stage; 19.12 2006, the ad and its end card; 19.13
//            the match on the pin: 2008, the sleeve tosses him the clicker; 19.14 he clicks, the map, its pins grey out
//            to LAST UPDATED 2012 (no cause claimed); 19.15 the clicker becomes his 2024 phone in the same grip
//   GARDEN   19.16-19.20 the phone's picture opens outward: the gate, the key, CHATGTP on its rope (GUEST); the raised
//            hands; outside the hedge, Radnus; "as a guest."; the reverse through the closing gate (he loses the left
//            third); the fold back into the phone, into his pocket
// The garden's CHATGTP speaks in text bubbles only (voice 5 is paused). ELPPA's stage and campus are generic.
import {defineScene, layouts, mouth, roomMouth, mk, drawPlate} from '../../kit';
import type {PxShot} from '../../kit';
import {Buf, clamp} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {party, tvClose, harasGerg, onStream, gergCall} from '../sets/lobby';
import {lawn, masLawn, phonePush, MAS_EDGE} from '../sets/campus';
import {corner2006, matchClicker} from '../../art/sets/elppa';
import {stage08} from '../sets/f21';
import {gardenGate, gardenBeds, outsideHedge, gateReverse, phoneUnfold} from '../../art/sets/garden';
import {drawRadnus, RADNUS_DEFAULT} from '../../../../../shared/pixel/cast/radnus';
import {drawMasStand2} from '../../art/cast/mas2';
import {drawEp2Post} from '../../art/props/ui';
import {roomWalkAt} from '../../../../../shared/pixel/cast/civic-kit';
import {fill, bpt, bpw} from '../../art/kit';
import type {Mas2Legs} from '../../art/cast/mas2';

const L = layouts();
const W = 480;
const textOf = (sh: PxShot, kind: string) => sh.texts.find((t) => t.kind === kind);
const walk = (k: number) => roomWalkAt(k) as Mas2Legs;

// ------------------------------------------------------------------ 19.01-19.03 the lobby
L.add('19.01', {
  st: 'act4/sets/lobby party ([W] ARRIVE: the lobby master at the watch party (art/sets/lobby2): ELPPA\'s keynote running low on the wall screen (art/sets/elppa keynotePainter: a generic white stage, one presenter), the staff cross-legged on their beanbags half-listening (art/cast/civic2), GERG typing on his own beanbag (coldopen\'s gergSitting, copied); DAYS SINCE 202 and 102; February\'s flyers curling, his upside down among them; the complaint a side table with coffee cups; behind the back row the tip of a mammoth\'s tusk; the corner TV on the stuck lectern)',
  draw: (fb, k, sh, f) => { party(fb, f, {screen: 'stage', crowd: 'watch'}); void sh; void k; },
});
L.add('19.02', {
  st: 'act4/sets/lobby tvClose ([SCR] the corner TV close, muted (its mute glyph), the lobby soft beyond: the presser (art/props/ui presserFull, stuck) at 1:1: the lectern still jammed at the FLOOR door, a tally hung over it: 0 BILLS, legible, 1.6 s)',
  draw: (fb, k, sh, f) => { tvClose(fb, f); void sh; void k; },
});
L.add('19.03', {
  st: 'act4/sets/lobby party ([W] the doors open; HARAS (art/cast/haras room) walks in along the hand truck\'s old path, her calculator tape unspooling behind her from the doors, and drops onto the beanbag beside Gerg; her plate HARAS · FIRST CFO typed on (top right))',
  marks: {spool: ['snd', 'calc_tape_spool', 1, 0]},
  draw: (fb, k, sh, f) => {
    const sp = mk(sh, 'spool', 10), sit = sp + 66;
    const door = (k < 4 ? 1 : k < sit - 20 ? 2 : 1) as 0 | 1 | 2;
    const x = Math.round(470 - Math.max(0, k - 2) * ((470 - 262) / (sit - 2)));
    party(fb, f, {screen: 'stage', crowd: 'watch', door, haras: k < sit ? {walk: x} : 'seated'});
    const t = textOf(sh, 'plate');
    if (t && k >= t.s) drawPlate(fb, t, k - t.s, 250, 6, PAL.C6);
  },
});
// ------------------------------------------------------------------ 19.04-19.06 the talk, the cheer, the crowd shot
L.add('19.04', {
  st: 'act4/sets/lobby harasGerg ([2S] GERG (his speaking portrait, turned to her, his laptop on his knees, typing) and HARAS (art/cast/haras bust, her tape) on the beanbags, both lip-synced; the wall screen low behind them on the keynote; as she asks the real one, the screen puts up …AND LATER THIS YEAR: CHATGTP. and the staff behind them rise to cheer on "profit")',
  face: {HARAS: 'lip', GERG: 'lip'},
  marks: {roar: ['snd', 'stream_announce_roar', 1, 0], cheer: ['snd', 'crowd_cheer', 1, 0], prof: ['on', 'e2-a4-0021', 0]},
  draw: (fb, k, sh, f) => {
    const roar = mk(sh, 'roar', 327), cheer = mk(sh, 'cheer', 336), prof = mk(sh, 'prof', 332);
    harasGerg(fb, f, {gerg: mouth(sh, k, 'GERG'), haras: mouth(sh, k, 'HARAS'), harasExpr: k >= prof - 4 ? 'focus' : 'smile', slide: k >= roar ? 'later' : 'stage', cheer: k >= cheer ? k - cheer + 1 : 0, type: k < prof - 8});
  },
});
L.add('19.05', {
  st: 'act4/sets/lobby onStream → harasGerg ([SCR] ON STREAM full frame in our stream\'s UI: …AND LATER THIS YEAR: CHATGTP., the announcement the lobby is already cheering; [2S] the lobby erupts behind them, half of it up, the desk confetti cannon\'s burst coming down; nobody answers her; HARAS, writing on her tape under the cheer: "Let me reframe that. Upside." lip-synced, the tape up on "Upside.")',
  face: {HARAS: 'lip'},
  marks: {pop: ['snd', 'confetti_pop', 1, 0], up: ['w', 'e2-a4-0022', 'Upside', 0]},
  draw: (fb, k, sh, f) => {
    const pop = mk(sh, 'pop', 21), up = mk(sh, 'up', 84);
    if (k < 44) { onStream(fb, f, {view: 'later'}); return; }
    harasGerg(fb, f, {gerg: 'rest', haras: mouth(sh, k, 'HARAS'), harasExpr: k >= up - 2 ? 'proud' : 'focus', harasArm: k >= up - 2 ? 'upside' : 'tape', slide: 'later', cheer: 40 + k, confetti: k - pop, type: false});
  },
});
L.add('19.06', {
  st: 'act4/sets/lobby onStream → party → gergCall ([SCR] the stream cuts away to its outdoor audience (art/sets/elppa streamCrowd, our stream\'s UI): at its edge, small, Mas, head down over his phone, typing; [W] the lobby: a STAFFER stands and points at the wall screen: "Is that Mas?" (room mouth); the lobby laughs; [MCU] GERG, the only one not cheering, takes out his phone)',
  face: {STAFFER: 'room'},
  marks: {is: ['on', 'e2-a4-0023', 0], laugh: ['snd', 'lobby_laugh_s', 1, 0]},
  draw: (fb, k, sh, f) => {
    const is = mk(sh, 'is', 60), laugh = mk(sh, 'laugh', 87);
    if (k < is - 8) { onStream(fb, f, {view: 'crowd'}); return; }
    if (k < laugh + 30) { party(fb, f, {screen: 'stream', crowd: k >= laugh ? 'laugh' : 'watch', up: false, haras: 'seated', pointer: roomMouth(sh, k, 'STAFFER') === 'open' ? 'open' : 'rest'}); return; }
    gergCall(fb, f, {phone: 'hand', cheer: 20});
  },
});
// ------------------------------------------------------------------ 19.07-19.10 the campus, his post, the call
L.add('19.07', {
  st: 'act4/sets/campus lawn + art/props/ui drawEp2Post ([W] ARRIVE: ELPPA\'s campus (generic pavilions, the lawn, the giant outdoor screen with the keynote, the crowd\'s backs) for 1.5 s; Mas comes up to the crowd\'s edge, head down over his phone (three collars, no pop, no badge), finishes his post at a post\'s pace and sends it; his post in its own UI over the sky, verbatim, his lowercase, held for its read)',
  marks: {click: ['snd', 'post_click', 1, 0], post: ['txt', 'very happy', 'at', 0]},
  draw: (fb, k, sh, f) => {
    const click = mk(sh, 'click', 60), post = mk(sh, 'post', 62);
    // the crowd's backs and the screen first (1.5 s), then Mas comes up to the crowd's edge, head down over his phone
    const in0 = 30, arrive = 52, x = k < arrive ? Math.round(-24 + (MAS_EDGE + 24) * Math.max(0, (k - in0) / (arrive - in0))) : MAS_EDGE;
    lawn(fb, f, {mas: k < in0 ? null : {x, legs: k < arrive ? walk(k) : 'stand', arm: 'phone', bow: true}});
    if (k >= post) drawEp2Post(fb, 16, 14, 'jun10', {size: 'popup', w: 230, k: k - post});
    void click;
  },
});
L.add('19.08', {
  st: 'act4/sets/campus lawn → masLawn ([W] on the giant screen the stream\'s chat lights with his post; across the lawn the crowd\'s phones buzz (lit, held up); [MCU] Mas on the lawn, his face still in the noon light (keyed one step), his phone low in his hand; V.O. 12 typed by the host, his lips still)',
  marks: {chat: ['snd', 'chat_ping_run', 1, 0], buzz: ['snd', 'phone_wave_buzz', 1, 0], vo: ['on', 'e2-vo-12', 0]},
  draw: (fb, k, sh, f) => {
    const chat = mk(sh, 'chat', 6), buzz = mk(sh, 'buzz', 27), vo = mk(sh, 'vo', 60);
    if (k < vo - 12) { lawn(fb, f, {mas: {x: MAS_EDGE, arm: 'phone', bow: false}, chat: k >= chat ? 2 : 1, buzz: k >= buzz}); return; }
    masLawn(fb, f, {phone: 'hand', look: 1});
  },
});
L.add('19.09', {
  st: 'act4/sets/campus masLawn ↔ act4/sets/lobby gergCall ([MCU] Mas on the lawn, his phone buzzing in his hand (GERG), up to his ear on the connect; [MCU] GERG in the cheering lobby, his phone at his ear, lip-synced (the call); back on Mas: "the phone\'s closer." lip-synced, his eyes still on the stage)',
  face: {GERG: 'lip', MAS: 'lip'},
  marks: {ring: ['snd', 'call_ring', 1, 0], con: ['snd', 'call_connect', 1, 0], g: ['on', 'e2-a4-0024', 0], m: ['on', 'e2-a4-0025', 0]},
  draw: (fb, k, sh, f) => {
    const con = mk(sh, 'con', 30), g = mk(sh, 'g', 47), m = mk(sh, 'm', 136);
    if (k < g - 3) { masLawn(fb, f, {phone: k < con ? 'hand' : 'ear', buzz: k < con}); return; }
    if (k < m - 6) { gergCall(fb, f, {mouth: mouth(sh, k, 'GERG'), phone: 'ear', cheer: 30}); return; }
    masLawn(fb, f, {phone: 'ear', mouth: mouth(sh, k, 'MAS') as never});
  },
});
/** the crosscut: whoever speaks next is on screen from a few frames before his line (Mas's cut a beat ahead of his
 *  unhurried answer); Gerg holds through his weighted last question */
const CROSS: Array<[string, string]> = [['GERG', 'e2-a4-0026'], ['MAS', 'e2-a4-0027'], ['GERG', 'e2-a4-0033'], ['MAS', 'e2-a4-0034'], ['GERG', 'e2-a4-0035'], ['GERG', 'e2-a4-0028'], ['MAS', 'e2-a4-0029']];
L.add('19.10', {
  st: 'act4/sets/campus masLawn ↔ act4/sets/lobby gergCall (the call, crosscut on the speakers: GERG in the lobby, half of it standing on its beanbags behind him; Mas on the lawn, his eyes on the stage; both lip-synced; Gerg\'s last question held, Mas\'s answer: "i was up there once. they let me hold the clicker.")',
  face: {GERG: 'lip', MAS: 'lip'},
  draw: (fb, k, sh, f) => {
    let who = 'GERG';
    for (const [w, id] of CROSS) { const l = sh.lines.find((x) => x.id === id); if (l && k >= l.s - (w === 'MAS' ? 6 : 4)) who = w; }
    if (who === 'GERG') gergCall(fb, f, {mouth: mouth(sh, k, 'GERG'), phone: 'ear', cheer: 40});
    else masLawn(fb, f, {phone: 'ear', mouth: mouth(sh, k, 'MAS') as never});
  },
});
// ------------------------------------------------------------------ 19.11-19.15 F2.1
L.add('19.11', {
  st: 'act4/sets/campus phonePush ([POV] a push from his face into his phone in three held steps, to full-bleed: the stream\'s stage; a dotted GPS breadcrumb in colours older than the phone (art/sets/elppa breadcrumb) draws itself across the boards he once stood on)',
  marks: {sweep: ['snd', 'render_front_sweep', 1, 0]},
  draw: (fb, k, sh, f) => { phonePush(fb, f, {push: Math.min(3, Math.floor(k / 4)), crumb: k - 12}); void sh; },
});
L.add('19.12', {
  st: 'art/sets/elppa corner2006 ([W] EARLY-WEB16: a street corner, 2006, a phone ad: YOUNG MAS (f21/mas08) holds up a flip phone and grins, a GPS pin bobbing over his head; the ad\'s end card slams in: "WHERE YOU AT?", its pin)',
  marks: {card: ['txt', 'WHERE YOU AT', 'at', 0]},
  draw: (fb, k, sh, f) => { corner2006(fb, f, {card: k >= mk(sh, 'card', 60)}); },
});
L.add('19.13', {
  st: 'act4/sets/f21 stage08 ([W] a match on the pin: the end card\'s pin is the pin on the 2008 stage\'s screen (a TPOOL slide); 2008, this company\'s stage, the intro\'s own frame (f21/era2008, its camcorder, EARLY-WEB16): Mas strides out of the wing, THE SLEEVE (a sleeve and nothing else) tosses him the clicker and he catches it, the collars pop; the tiled 2008 crowd)',
  marks: {catch: ['snd', 'clicker_catch', 1, 0]},
  draw: (fb, k, sh, f) => {
    const c = mk(sh, 'catch', 54), g = 190 + (k - c);
    stage08(fb, Math.max(150, g), {splash: true});
    void f;
  },
});
L.add('19.14', {
  st: 'act4/sets/f21 stage08 ([W] he clicks, and the big screen behind him shows TPOOL\'s map in its own colours, pins everywhere; one by one they grey out (two on each tick), until its corner reads LAST UPDATED 2012; no cause claimed)',
  marks: {t1: ['snd', 'pin_grey_tick', 1, 0], t2: ['snd', 'pin_grey_tick', 2, 0], t3: ['snd', 'pin_grey_tick', 3, 0], t4: ['snd', 'pin_grey_tick', 4, 0], last: ['txt', 'LAST UPDATED', 'at', 0]},
  draw: (fb, k, sh, f) => {
    const t = [mk(sh, 't1', 54), mk(sh, 't2', 74), mk(sh, 't3', 94), mk(sh, 't4', 115)], last = mk(sh, 'last', 128);
    const grey = t.filter((x) => k >= x).length * 2 + (k >= last - 6 ? 1 : 0);
    stage08(fb, 196 + (k % 24), {splash: k < 6, grey, last: k >= last});
    void f;
  },
});
L.add('19.15', {
  st: 'art/sets/elppa matchClicker ([ECU · MATCH] the clicker in his 2008 hand (EARLY-WEB16) becomes his 2024 phone in the same grip, his post from the lawn still on its screen)',
  draw: (fb, k, sh, f) => { matchClicker(fb, f, {phone: k >= 40}); void sh; },
});
// ------------------------------------------------------------------ 19.16-19.20 the walled garden
L.add('19.16', {
  st: 'art/sets/garden phoneUnfold → gardenGate ([W] phrase 1: his phone\'s picture opens outward in three held steps to the whole frame: the square-cut hedge with exactly one gate; MIT KOOC (art/cast/kooc, unplated) turns one key as tall as he is in the lock (three held steps); the gate swings open; CHATGTP, its new face on, walked through on a velvet rope, a wristband on its tail: GUEST)',
  marks: {lock: ['snd', 'lock_big_turn', 1, 0], gate: ['snd', 'gate_iron_swing', 1, 0], rope: ['snd', 'velvet_rope', 1, 0]},
  draw: (fb, k, sh, f) => {
    const lk = mk(sh, 'lock', 81), gt = mk(sh, 'gate', 110), rp = mk(sh, 'rope', 158);
    const kooc = k < lk - 14 ? 'carry' : k < lk - 4 ? 'turn0' : k < lk + 4 ? 'turn1' : 'turn2';
    const gate = (k < gt ? 0 : k < gt + 6 ? 1 : 2) as 0 | 1 | 2;
    const chat = k < rp - 24 ? null : Math.round(40 + Math.min(1, (k - (rp - 24)) / 40) * 150);
    const scene = (t: Buf) => gardenGate(t, f, {gate, kooc: kooc as 'carry', chat});
    const step = Math.min(3, Math.floor(k / 6)) as 0 | 1 | 2 | 3;
    phoneUnfold(fb, scene, step);
  },
});
L.add('19.17', {
  st: 'art/sets/garden gardenBeds ([W] phrase 2: inside, the beds of phone-shaped flowers; at a flower CHATGTP stops, raises one tiny hand and waits; the flower nods; only then a speech bubble pops over it, text only (a soft chip blip, no voice); on to the next flower, the same; IRIS on her bench at 99%)',
  marks: {n1: ['snd', 'flower_nod', 1, 0], b1: ['snd', 'chip_blip_bubble', 1, 0], n2: ['snd', 'flower_nod', 2, 0], b2: ['snd', 'chip_blip_bubble', 2, 0]},
  draw: (fb, k, sh, f) => {
    const n1 = mk(sh, 'n1', 48), b1 = mk(sh, 'b1', 67), n2 = mk(sh, 'n2', 110), b2 = mk(sh, 'b2', 127);
    const second = k >= b1 + 16;
    const n = second ? n2 : n1, bb = second ? b2 : b1;
    gardenBeds(fb, f, {at: second ? 4 : 3, hand: k >= (second ? n2 - 18 : 20) && k < bb + 6, nod: k < n ? 0 : k < n + 4 ? 1 : k < n + 10 ? 2 : 0, bubble: k >= bb && k < bb + (second ? 120 : 16)});
  },
});
L.add('19.18', {
  st: 'art/sets/garden outsideHedge ([2S] phrase 3, outside the hedge: Mas screen-left, phone in hand, watching the row; a few feet along the same hedge, screen-right, RADNUS (cast/radnus) rises into frame, politely on the outside too, not burning; "Lovely garden. I see they let your chatbot in." (room mouth); "as a guest." (room mouth), dry; Radnus\'s polite smile holds a beat too long)',
  face: {RADNUS: 'room', MAS: 'room'},
  draw: (fb, k, sh, f) => {
    const rise = (k < 14 ? 0 : k < 22 ? 1 : k < 30 ? 2 : 3) as 0 | 1 | 2 | 3;
    outsideHedge(fb, f, {radnus: rise});
    // the mouths on their takes (the same drawings redrawn over the art's, with the room mouth)
    const rm = roomMouth(sh, k, 'RADNUS'), mm = roomMouth(sh, k, 'MAS');
    if (rise === 3) drawRadnus(fb, 380, 196, {...RADNUS_DEFAULT, arm: 'fold', fire: null, mouth: rm === 'open' ? 'open' : 'smile'}, {});
    if (mm === 'open') drawMasStand2(fb, 110, 196, {arm: 'phone', mouth: 'open'});
  },
});
L.add('19.19', {
  st: 'art/sets/garden gateReverse ([W] the reverse from inside the garden, the line crossed on purpose: through the closing gate it swings shut behind CHATGTP, and in the foreground the lock as tall as MIT KOOC turns once; Mas outside it, screen-right: the one shot where he loses the left third)',
  marks: {gate: ['snd', 'gate_iron_swing', 1, 0], lock: ['snd', 'lock_big_turn', 1, 0]},
  draw: (fb, k, sh, f) => {
    const gt = mk(sh, 'gate', 10), lk = mk(sh, 'lock', 47);
    gateReverse(fb, f, {gate: (k < gt ? 2 : k < gt + 6 ? 1 : 0) as 0 | 1 | 2, lock: (k < lk ? 0 : k < lk + 5 ? 1 : 2) as 0 | 1 | 2});
  },
});
L.add('19.20', {
  st: 'art/sets/garden phoneUnfold → act4/sets/campus lawn ([W] the garden folds back into the phone in three held steps; on the lawn at the crowd\'s edge Mas, his phone in his hand, puts it in his pocket)',
  marks: {pocket: ['snd', 'phone_into_pocket', 1, 0]},
  draw: (fb, k, sh, f) => {
    const pk = mk(sh, 'pocket', 60);
    if (k < 24) { const step = (3 - Math.min(3, Math.floor(k / 6))) as 0 | 1 | 2 | 3; phoneUnfold(fb, (t) => gateReverse(t, f, {gate: 0, lock: 2}), step); return; }
    lawn(fb, f, {mas: {x: MAS_EDGE, arm: k < pk ? 'phone' : 'pocket', bow: k < pk - 10}});
  },
});

export const SCENE = defineScene({scene: '19', layouts: L.all});
void clamp; void fill; void bpt; void bpw; void W;
