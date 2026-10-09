// MR. MAS — Ep2 v1 · act3 · scene 14: THE OPEN FLOOR (MAY 15-17, 2024; UI LIT, the episode's one adventure-game scene
// and its one dialogue tree). 12 shots, 1,416 f on the v1 EL lock. The shots pass, 2026-10-09; the record is
// shots-act3.md. The staging is proposal.md sc 14 (its final check: no image of Alyi in any surface; the note never
// defined; Ekiel walks out past ordinary desks) / script-v1. Every frame is `full`: the band is the game's (act3/sets/
// band: the verbs, Open greyed, the inventory that is his pocket), lit through the whole scene (lock-v1 §3.3).
//   ARRIVE   14.01 the spread, the band lit, the polish catching the light; Mas comes in frame-left (13.06's exit)
//   REACH    14.02 Look at heatsink: "i can see my face in it." · Pick up reflection: "i can't pick that up." · 14.03 Talk
//            to reflection: his own face in the fins; his phone's strip offers three lines; his thumb tries the greyed
//            come back first: bonk · 14.04 can we talk?: his reflection mouths it back, no voice · 14.05 DOT's orange
//            cuff points a screwdriver at Alyi's door · 14.06 Open is greyed: bonk; the knock shakes Ep1's note off the
//            frame and it flutters into his pocket (the inventory), at the spread's scale, never held for reading
//   THE WORLD MOVES ON  14.07 Bukaj sits in the humming chair (plated); "congratulations." typed as he says it · 14.08
//            the two-shot · 14.09 Ekiel walks out with his box (the card) · 14.10 his thread's first post as one domino;
//            it tips and lands at Mas's shoe · 14.11 down the corridor, the safety team's own door: four screws, the
//            plate into the MISC box
//   OUT      14.12 back at Alyi's door: Pivot door; it turns on its centre pin; the chair's hum swells (into 15.01)
import {defineScene, layouts, mouth, mk, drawPlate} from '../../kit';
import type {PxShot} from '../../kit';
import {roomWalkAt} from '../../../../../shared/pixel/cast/civic-kit';
import {freeze2, FREEZE_DARK, drawGagCard} from '../../../../ep01/pixel/act2/kit2';
import type {GagCard} from '../../../../ep01/pixel/act2/kit2';
import {Buf} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {spread, sayAt, finsMCU, chair2S, dominoHigh, corridor, plateECU, boxECU, SP} from '../sets/floor';
import type {SpreadSt} from '../sets/floor';
import {adventureBand} from '../sets/band';
import type {BandSt} from '../sets/band';
import type {Mas2Legs} from '../../art/cast/mas2';

const L = layouts();
const walk = (k: number) => roomWalkAt(k) as Mas2Legs;
const txt = (sh: PxShot, kind: string, s?: string) => sh.texts.find((t) => t.kind === kind && (!s || t.text.startsWith(s))) ?? null;
/** the band for a frame: the sentence line while its text is up, the hovered verb with it */
const sentence = (sh: PxShot, k: number, verb: string, text: string, extra: BandSt = {}): BandSt => {
  const t = txt(sh, 'ui', text);
  return t && k >= t.s && k < t.e ? {verb, sentence: text, ...extra} : extra;
};
const NOTE_IN = 54; // 14.06: the note lands in his pocket (and the inventory) this many frames into the shot

L.add('14.01', {
  st: 'act3/sets/floor spread ([W] the open floor as a find-the-man spread (art/sets/floor openFloor: tiled staff at ordinary desks, glass walls, the urn, a spoon in a mug, the chiller\'s puddle, DOT up her ladder, Alyi\'s door and the humming chair; a polished heatsink on its plinth by the glass): Mas walks in from frame-left along the back aisle (13.06\'s exit frame-right); the band lit: Look at · Talk to · Pick up · Use · Open (greyed) · Pivot · Raise, the inventory CTRL · ESC · glass · phone)',
  draw: (fb, k, sh, f) => {
    spread(fb, f, {mas: {x: -20 + Math.round(k * 2.2), legs: walk(k)}});
    adventureBand(fb, {});
    void sh;
    return {full: true};
  },
});
L.add('14.02', {
  st: 'act3/sets/floor spread ([W] he walks on to the heatsink and stops at it; the band: Look at heatsink (the sentence line), and over his head, typed in his lowercase and his colour, "i can see my face in it." (his face a warm smudge in the polish); then Pick up reflection: he reaches; "i can\'t pick that up.")',
  marks: {v1: ['snd', 'ui_verb_select', 1, 0], v2: ['snd', 'ui_verb_select', 2, 0], s1: ['txt', 'i can see', 'at', 0], s2: ['txt', 'i can\'t pick', 'at', 0]},
  draw: (fb, k, sh, f) => {
    const s1 = mk(sh, 's1', 24), s2 = mk(sh, 's2', 84), v2 = mk(sh, 'v2', 67);
    const x = Math.min(SP.masAtSink, 127 + Math.round(k * 2.4));
    const moving = x < SP.masAtSink;
    const reach = k >= v2 + 3 && k < s2 + 4;
    const say = sayAt('i can see my face in it.', k, s1, v2) ?? sayAt('i can\'t pick that up.', k, s2, 120);
    spread(fb, f, {mas: {x, legs: moving ? walk(k) : 'stand', arm: reach ? 'reach' : 'down'}, say});
    adventureBand(fb, k < v2 ? sentence(sh, k, 'Look at', 'Look at heatsink') : sentence(sh, k, 'Pick up', 'Pick up reflection'));
    return {full: true};
  },
});
L.add('14.03', {
  st: 'act3/sets/floor spread → finsMCU ([W] Talk to reflection (the sentence line); [MCU] the fins close: his own face in the polished metal (his approved portrait mirrored, banded by the fins, cooled to the steel: his, never Alyi\'s); low in frame his phone, its suggestion strip: > where are you going? · > can we talk? · > come back (greyed and struck, exactly the 1993 Cancel); his thumb (no cursor) goes to the greyed come back first and presses: bonk, the chip shakes)',
  marks: {bonk: ['snd', 'alert_bonk', 1, 0]},
  draw: (fb, k, sh, f) => {
    const bonk = mk(sh, 'bonk', 96), cut = 24;
    if (k < cut) {
      spread(fb, f, {mas: {x: SP.masAtSink, arm: 'down'}});
      adventureBand(fb, sentence(sh, k, 'Talk to', 'Talk to reflection'));
      return {full: true};
    }
    const tap = k < bonk - 30 ? null : 2;
    finsMCU(fb, f, {tap, down: k >= bonk - 2 && k < bonk + 4, bonk: k - bonk});
    adventureBand(fb, sentence(sh, k, 'Talk to', 'Talk to reflection'));
    return {full: true};
  },
});
/** his reflection mouthing "can we talk?" (no voice): a held viseme track on 3s */
const MOUTHED: Array<[number, 'rest' | 'A' | 'E' | 'O' | 'M']> = [[0, 'E'], [5, 'A'], [9, 'rest'], [11, 'O'], [15, 'E'], [18, 'rest'], [20, 'A'], [26, 'O'], [30, 'rest']];
const mouthed = (j: number) => { if (j < 0) return 'rest' as const; let m: 'rest' | 'A' | 'E' | 'O' | 'M' = 'rest'; for (const [t, v] of MOUTHED) if (j >= t) m = v; return m; };
L.add('14.04', {
  st: 'act3/sets/floor finsMCU ([MCU] his thumb moves to > can we talk? and presses it (the chip lights); then, in the fins, his own reflection mouths "can we talk?" back to him (a held viseme track, no voice); held on his face in the metal (the Door blooms once))',
  draw: (fb, k, sh, f) => {
    const press = 8;
    finsMCU(fb, f, {tap: k < 30 ? 1 : null, down: k >= press && k < press + 6, lit: k >= press ? 1 : null, mouth: mouthed(k - 30)});
    adventureBand(fb, {});
    void sh;
    return {full: true};
  },
});
L.add('14.05', {
  st: 'act3/sets/floor spread ([W] from her ladder at the back, DOT (from behind, never her face) turns and points her screwdriver, her orange cuff, at Alyi\'s door; Mas looks to it, then walks to the door)',
  draw: (fb, k, sh, f) => {
    const go = 44;
    const x = k < go ? SP.masAtSink : Math.min(SP.masAtDoor, SP.masAtSink + Math.round((k - go) * 2));
    spread(fb, f, {mas: {x, legs: k >= go && x < SP.masAtDoor ? walk(k) : 'stand'}, dot: k >= 6 ? 'point' : 'ladder'});
    adventureBand(fb, {});
    void sh;
    return {full: true};
  },
});
L.add('14.06', {
  st: 'act3/sets/floor spread ([W] at Alyi\'s door: Open (greyed) is tried, the sentence line greyed; he knocks; bonk (the room jolts a pixel); the knock shakes Ep1\'s yellowed note off the frame and it flutters down, tumbling in held steps, into his pocket, at the spread\'s scale (no insert, no tag, not his colour); the inventory gains a plain yellowed slip; Pick up note)',
  marks: {bonk: ['snd', 'alert_bonk', 1, 0], flut: ['snd', 'paper_flutter', 1, 0]},
  draw: (fb, k, sh, f) => {
    const bonk = mk(sh, 'bonk', 14), fl = mk(sh, 'flut', 28);
    const st: SpreadSt = {mas: {x: SP.masAtDoor, arm: k >= bonk - 6 && k < bonk + 4 ? 'knock' : 'down'}, shake: k === bonk || k === bonk + 1 ? 1 : 0};
    st.note = k < fl ? 'on' : k < NOTE_IN ? {fall: (k - fl) / (NOTE_IN - fl)} : 'gone';
    spread(fb, f, st);
    const open = txt(sh, 'ui', 'Open');
    const band: BandSt = open && k >= open.s && k < open.e ? {verb: 'Open', sentence: 'Open'} : sentence(sh, k, 'Pick up', 'Pick up note');
    adventureBand(fb, {...band, note: k >= NOTE_IN, noteIn: k - NOTE_IN});
    return {full: true};
  },
});
L.add('14.07', {
  st: 'act3/sets/floor spread → chair2S ([W] beside the door the old chair still hums (its tiny lines); BUKAJ (art/cast/bukaj room) comes in from the right with a box of printouts and sits down in it; the hum goes on under him; his plate BUKAJ · NEW CHIEF SCIENTIST · INHERITED THE HUM. typed on; [2S] Mas (his portrait in the floor\'s daylight, facing him) and Bukaj in the chair (art/cast/bukaj bust, his hand flat on the humming armrest); the strip\'s line typed in the band in his colour as he says it: "congratulations." (lip-synced))',
  face: {MAS: 'lip'},
  marks: {con: ['on', 'e2-a3-0023', 0]},
  draw: (fb, k, sh, f) => {
    const con = mk(sh, 'con', 84), cut = con - 8;
    const say = txt(sh, 'ui', 'congratulations');
    const sayN = say ? Math.max(0, Math.floor((k - say.s) * 16 / Math.max(1, (sh.lines.find((l) => l.id === 'e2-a3-0023')?.e ?? say.e) - say.s))) : 0;
    const band: BandSt = say && k >= say.s ? {say: 'congratulations.', sayN, note: true} : {note: true};
    if (k < cut) {
      const bx = Math.max(SP.chair.x + 10, 470 - Math.round(k * 3.1)), seated = k >= 46;
      spread(fb, f, {mas: {x: SP.masAtDoor}, bukaj: seated ? {x: SP.chair.x + 10, state: 'seated'} : {x: bx, state: 'carry'}, hum: 1});
      const t = txt(sh, 'plate');
      if (t && k >= t.s) drawPlate(fb, t, k - t.s, 236, 6, PAL.C6);
      adventureBand(fb, band);
      return {full: true};
    }
    chair2S(fb, f, {mas: mouth(sh, k, 'MAS')});
    adventureBand(fb, band);
    return {full: true};
  },
});
L.add('14.08', {
  st: 'act3/sets/floor chair2S ([2S] Mas screen-left, Bukaj seated screen-right, one hand flat on the humming armrest: "Thank you. It\'s still warm." (a soft smile); the strip\'s next line typed in the band as Mas says it, "need anything?"; "Not yet. I\'d like a week in it before anyone asks me for a schedule." (soft, exact; his hand never leaves the armrest); both lip-synced)',
  face: {MAS: 'lip', BUKAJ: 'lip'},
  marks: {need: ['on', 'e2-a3-0024', 0], not: ['on', 'e2-a3-0007', 0]},
  draw: (fb, k, sh, f) => {
    const nt = mk(sh, 'not', 102);
    const say = txt(sh, 'ui', 'need anything');
    const band: BandSt = say && k >= say.s ? {say: 'need anything?', sayN: Math.max(0, Math.floor((k - say.s) * 0.75)), note: true} : {note: true};
    chair2S(fb, f, {mas: mouth(sh, k, 'MAS'), bukaj: {mouth: mouth(sh, k, 'BUKAJ'), expr: k >= nt - 2 ? 'neutral' : 'smile'}});
    adventureBand(fb, band);
    return {full: true};
  },
});
const CARD_EKIEL: GagCard = {x: 14, y: 12, name: 'EKIEL', lines: ['CO-LED THE SAFETY TEAM.'], stat: ['SQUINT: 100%'], accent: PAL.C7};
const KEEP = new Map<number, Uint8Array>();
L.add('14.09', {
  st: 'act3/sets/floor spread ([W] EKIEL (art/cast/ekiel room: sandy hair, navy zip-up, his squint) crosses the back aisle from the right carrying a box, past ordinary desks (no pedestals); on the hit the 2-TONE FREEZE (Ep1 act2/kit2 freeze2, the dark curve) with Ekiel kept in colour and the card EKIEL / CO-LED THE SAFETY TEAM. + SQUINT: 100% (one bar), then he walks on; Mas and Bukaj at the chair)',
  marks: {hit: ['snd', 'freeze_hit_F', 1, 0]},
  draw: (fb, k, sh, f) => {
    const hit = mk(sh, 'hit', 14), end = hit + 60;
    const kk = k < hit ? k : k < end ? hit : k - 60;
    const ek = {x: 440 - Math.round(kk * 2.2), legs: Math.floor(kk / 3)};
    const st: SpreadSt = {mas: {x: SP.masAtDoor}, bukaj: {x: SP.chair.x + 10, state: 'seated'}, ekiel: ek, hum: 1};
    const ff = k >= hit && k < end ? f - k + hit : f;
    spread(fb, ff, st);
    if (k >= hit && k < end) {
      let keep = KEEP.get(ek.x);
      if (!keep) {
        const A = new Buf(480, 270, 0), Bf = new Buf(480, 270, 0);
        spread(A, ff, st); spread(Bf, ff, {...st, ekiel: null});
        keep = new Uint8Array(480 * 203);
        for (let i = 0; i < keep.length; i++) keep[i] = A.c[i] !== Bf.c[i] ? 1 : 0;
        KEEP.set(ek.x, keep);
      }
      const km = keep;
      freeze2(fb, (x, y) => y < 203 && km[y * 480 + x] === 1, FREEZE_DARK);
      drawGagCard(fb, k - hit + 3, CARD_EKIEL);
    }
    adventureBand(fb, {note: true});
    return {full: true};
  },
});
L.add('14.10', {
  st: 'act3/sets/floor dominoHigh ([HIGH] the carpet from above: Ekiel\'s hand sets his thread down as one domino standing on its end, his post in its own UI (art/props/ui EP2_POSTS ekiel, verbatim, MAY 17: "Yesterday was my last day as head of alignment, superalignment lead, and executive @NOPEAI."), held to its read time; his shoes walk off; it tips back, its face turning up to the lens, lands face up and slides to the toe of Mas\'s sneaker)',
  marks: {set: ['snd', 'domino_set', 1, 0], run: ['snd', 'domino_topple_run', 1, 0]},
  draw: (fb, k, sh, f) => {
    const set = mk(sh, 'set', 12), run = mk(sh, 'run', 110);
    const fall = k < run ? 0 : Math.min(3, 1 + Math.floor((k - run) / 4));
    const slide = k < run + 12 ? 0 : Math.min(10, Math.floor((k - run - 12) / 2) * 2);
    dominoHigh(fb, f, {set: Math.min(1, k / set), shoes: k < set + 2 ? 0 : Math.min(1, (k - set - 2) / 46), fall, slide});
    adventureBand(fb, {note: true});
    return {full: true};
  },
});
L.add('14.11', {
  st: 'act3/sets/floor corridor → plateECU → boxECU ([W] down the corridor: Ekiel\'s empty desk (the MISC box on it) and at the end the safety team\'s own door, never Alyi\'s, its plate SUPERALIGNMENT / SAFETY TEAM legible; DOT at it from behind; [ECU] her orange-cuffed hand backs out the four screws, one per beat (art/cast/dot dotHandsECU), the plate comes off; [ECU] the plate dropped face up into the MISC box, MAY 17, its screws beside it)',
  marks: {s1: ['snd', 'screw_turn_1', 1, 0], s2: ['snd', 'screw_turn_2', 1, 0], s3: ['snd', 'screw_turn_3', 1, 0], s4: ['snd', 'screw_turn_4', 1, 0], off: ['snd', 'nameplate_off', 1, 0], drop: ['snd', 'plate_drop_box', 1, 0]},
  draw: (fb, k, sh, f) => {
    const s = [mk(sh, 's1', 24), mk(sh, 's2', 39), mk(sh, 's3', 54), mk(sh, 's4', 69)], off = mk(sh, 'off', 81), drop = mk(sh, 'drop', 93);
    if (k < 20) corridor(fb, f, {});
    else if (k < drop - 3) plateECU(fb, k, k >= off ? 5 : s.filter((v) => k >= v + 2).length);
    else boxECU(fb, f, {drop: k < drop ? 0 : k < drop + 3 ? 1 : 2});
    adventureBand(fb, {note: true});
    return {full: true};
  },
});
L.add('14.12', {
  st: 'act3/sets/floor spread ([W] back at Alyi\'s door, the domino lying at his shoe: Pivot door (the sentence line); his hand to the door; it turns on its centre pin in held steps (edge-on, the empty office\'s evening light through the opening); the old chair\'s hum swells (its lines brighter, wider))',
  marks: {v: ['snd', 'ui_verb_select', 1, 0], piv: ['snd', 'door_pivot_creak', 1, 0]},
  draw: (fb, k, sh, f) => {
    const piv = mk(sh, 'piv', 35);
    const pivot = (k < piv ? 0 : k < piv + 5 ? 1 : k < piv + 10 ? 2 : 3) as 0 | 1 | 2 | 3;
    spread(fb, f, {mas: {x: SP.masAtDoor, arm: k >= piv - 8 && k < piv + 12 ? 'reach' : 'down'}, pivot, domino: true, bukaj: {x: SP.chair.x + 10, state: 'seated'}, hum: k < piv + 10 ? 1 : 2});
    adventureBand(fb, {...sentence(sh, k, 'Pivot', 'Pivot door'), note: true});
    return {full: true};
  },
});

export const SCENE = defineScene({scene: '14', layouts: L.all});
