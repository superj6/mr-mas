// MR. MAS — Ep2 v1 · act3 · scene 13: LEAVE THEM UP (MAY 15, 2024; the NopeAI lobby by day). 6 shots, 744 f on the v1
// EL lock (7 shots, 840 f since the fixes pass, 2026-10-10). The shots pass, 2026-10-09; the record is shots-act3.md. The staging is proposal.md sc 13 (its final check:
// the sighting has no reflection in it; the counterweight is the other side's, at similar weight) / script-v1:
//   ARRIVE   13.01 the lobby master by day (2 s: the complaint a side table, the TV on the presser, the staffers at
//            their pillar, Mas watching them), then over Mas's shoulder onto the two staffers at their pillar, February's
//            flyers curling: one peels a corner, the other smooths his tape back down; their exchange (quick)
//   TURN     13.02 the first staffer turns to Mas, the corner still in her fingers: "He posted, though. Do we take these
//            down now?" · his face: "leave them up." · 13.03 a fallen flyer; he picks it up and tapes it back himself,
//            upside down; nobody corrects him; his upside-down flyer, a beat: his hand comes back to turn it, stops,
//            and lowers (a choice) · 13.03b (the fixes pass) the staffers, low: "Did his post say why?" "No."
//   COUNTER  13.04 the lobby TV framed in the foreground, pushed in to full frame: the presser, REMUHCS · MAJORITY LEADER,
//            the lectern ROADMAP · $32B/YR with nine FORUM stickers that won't go through FLOOR, face on or sideways ·
//            13.05 the reporter's question from the TV (no answer in a real senator's mouth); an aide slaps on a tenth
//   OUT      13.06 the master: Mas walks off frame-right; the adventure band lights as he crosses (sc 14's band)
// No reflection, no image of Alyi: every flyer's photo is a doorway with nobody in it.
import {defineScene, layouts, mouth, mk} from '../../kit';
import {pillarMedium, masMCU13, floorECU, tapeMCU, flyerPillarECU, presser, tvPush, lobbyWide, lobbyArrive, PRESS} from '../sets/lobby';
import {roomWalkAt} from '../../../../../shared/pixel/cast/civic-kit';
import type {Mas2Legs} from '../../art/cast/mas2';

const L = layouts();

L.add('13.01', {
  st: 'act3/sets/lobby lobbyArrive → pillarMedium ([W] ARRIVE: the lobby master by day for 2 s (art/sets/lobby2 as 13.06 has it: the complaint a side table with cups, DAYS SINCE 176 and 76, the beanbag rows, the corner TV murmuring on the presser): the two STAFFERS at their rack pillar, A\'s hand at her flyer, B\'s on his; Mas on the near floor, still, looking at them; [OTS-W] over Mas\'s shoulder (the back of his head and hood, act3/sets/backhead) onto the two staffers at their pillar, close (two new busts on art/cast/civic2 makeBust3: A a woman with a bun and a mustard cardigan, B a man with curly hair and a dusty blue hoodie); February\'s WHERE IS ALYI? flyers on the pillar, curling (doorway photos, nobody in them); A peels the curled corner of hers (her arm from the shoulder, the corner lifting in held steps), B smooths the tape back down on his (his hand flat on it); the lobby soft behind them by day; their exchange lip-synced)',
  face: {STAFFER: 'lip', STAFFER2: 'lip'},
  marks: {a: ['on', 'e2-a3-0001', 0], b: ['on', 'e2-a3-0002', 0]},
  draw: (fb, k, sh, f) => {
    const aOn = mk(sh, 'a', 57), bOn = mk(sh, 'b', 144), cut = Math.min(48, aOn - 6);
    if (k < cut) { lobbyArrive(fb, f, {peel: k >= 24 ? 1 : 0}); return; }
    pillarMedium(fb, f, {
      peel: k < cut + 14 ? 0 : k < cut + 30 ? 1 : 2, smooth: Math.floor(k / 9) % 2,
      aMouth: mouth(sh, k, 'STAFFER'), bMouth: mouth(sh, k, 'STAFFER2'),
      aLook: 0, bLook: k >= bOn - 10 ? -1 : 0, bExpr: k >= bOn - 4 ? 'worry' : 'neutral',
    });
  },
});
L.add('13.02', {
  st: 'act3/sets/lobby pillarMedium → masMCU13 ([OTS-W] the first staffer turns to Mas, the peeled corner still pinched in her fingers, her question lip-synced, a worried brow; B looks round too; [MCU] Mas (his approved portrait, the lobby\'s daylight keyed one step from the doors) facing them: "leave them up." lip-synced, unhurried)',
  face: {STAFFER: 'lip', MAS: 'lip'},
  marks: {mas: ['on', 'e2-a3-0004', 0]},
  draw: (fb, k, sh, f) => {
    const m = mk(sh, 'mas', 76), cut = m - 6;
    if (k < cut) { pillarMedium(fb, f, {turnA: true, peel: 2, aMouth: mouth(sh, k, 'STAFFER'), aExpr: 'worry', bLook: -1, bExpr: 'neutral', smooth: 0}); return; }
    masMCU13(fb, f, {mouth: mouth(sh, k, 'MAS'), look: 1});
  },
});
L.add('13.03', {
  st: 'act3/sets/lobby floorECU → tapeMCU → flyerPillarECU ([ECU] a fallen flyer flutters down onto the lobby\'s stone floor by the red runner, curled; his hand comes down and lifts it by its corner; [MCU] Mas at his pillar, side on and close to it: the flyer pressed to the steel upside down under his near hand (his arm bent from the shoulder), his thumb running the tape along its top; the staffers soft far behind him, not correcting him; [ECU] his flyer on the pillar, upside down (the art\'s flyer ECU with nobody in its photo, as the cold open\'s), a beat: it is still a doorway)',
  marks: {flut: ['snd', 'paper_flutter', 1, 0], tape: ['snd', 'tape_pull', 1, 0]},
  draw: (fb, k, sh, f) => {
    const fl = mk(sh, 'flut', 9), tp = mk(sh, 'tape', 57);
    if (k < 44) {
      const drop = Math.min(3, Math.max(0, Math.floor((k - fl + 9) / 3)));
      floorECU(fb, f, {drop, hand: k >= 22 ? 1 : 0, lift: k < 32 ? 0 : (k - 32) / 12});
      return;
    }
    if (k < 118) {
      const raise = Math.min(1, (k - 44) / 10);
      tapeMCU(fb, f, {raise: Math.floor(raise * 3) / 3, press: k < tp ? 0 : k < tp + 6 ? 1 : 2});
      return;
    }
    // the fixes pass (2026-10-10): the flyer alone a beat; his hand comes back toward its taped top corner in held
    // steps (to turn it), stops a finger short of it and holds, then lowers out of frame: he leaves it upside down;
    // the flyer alone again to the cut (the review read the upside-down flyer as a slip, not a choice)
    const j = k - 118;
    const reach = j < 12 ? 0 : Math.min(1, Math.floor((j - 12) / 3) * 3 / 12);
    const lower = j < 42 ? 0 : Math.min(1, Math.floor((j - 42) / 3) * 3 / 12);
    flyerPillarECU(fb, f, {reach, lower});
    void sh;
  },
});
L.add('13.03b', {
  st: 'act3/sets/lobby pillarMedium ([OTS-W] the fixes pass, 2026-10-10: over Mas\'s shoulder (the back of his head and hood at his pillar) onto the two staffers at theirs, who have watched him tape it back: B, quietly, to A: "Did his post say why?" (lip); A, turned to Mas, her hand still at her flyer\'s peeled corner, not looking away from him: "No." (lip); low, to each other, never to him)',
  face: {STAFFER: 'lip', STAFFER2: 'lip'},
  marks: {q: ['on', 'e2-a3-0025', 0], no: ['on', 'e2-a3-0026', 0]},
  draw: (fb, k, sh, f) => {
    const no = mk(sh, 'no', 60);
    pillarMedium(fb, f, {turnA: true, peel: 2, smooth: 0, aMouth: mouth(sh, k, 'STAFFER'), bMouth: mouth(sh, k, 'STAFFER2'),
      aExpr: 'neutral', bExpr: k >= no + 6 ? 'worry' : 'neutral', aLook: -1, bLook: -1});
  },
});
L.add('13.04', {
  st: 'act3/sets/lobby tvPush → presser ([SCR] the lobby\'s TV framed close in the foreground, the presser on it at half size; pushed in to full frame: the Senate press room (art/props/ui presserFull\'s pieces re-staged): REMUHCS (plated REMUHCS · MAJORITY LEADER) and three bipartisan colleagues (civic-extras senators), the bill-shaped lectern ROADMAP · $32B/YR with nine FORUM stickers carried along the wall by two aides, both gripping its side edges: the lead aide backs into the narrow FLOOR doorway ahead of it; its leading edge strikes the door\'s jamb face on (contact, the jamb jolts, then the recoil); they turn it sideways, push again, and it strikes again; the presser\'s own lower third BIPARTISAN SENATE AI ROADMAP)',
  marks: {b1: ['snd', 'lectern_bump', 1, 0], b2: ['snd', 'lectern_bump', 2, 0]},
  draw: (fb, k, sh, f) => {
    const b1 = mk(sh, 'b1', 52), b2 = mk(sh, 'b2', 81), J = PRESS.jamb;
    // face on, its right edge carried to the jamb by b1 (held on 2s); recoil 4 px; turned sideways (60, then 40 wide)
    // with the right edge 4 px off the jamb; pushed in again to the jamb by b2; recoil
    let lx: number, turn: 0 | 1 | 2 = 0, hit = 0, walk: number | undefined;
    if (k < b1) { lx = J - 84 - Math.round((1 - Math.floor(k / 2) * 2 / b1) * 70); walk = k; }
    else if (k < b1 + 2) { lx = J - 84; hit = k - b1 + 1; }
    else if (k < b1 + 8) lx = J - 84 - 4;
    else if (k < b2) { turn = k < b1 + 12 ? 1 : 2; const lw = turn === 1 ? 60 : 40; const push = turn === 2 ? Math.max(0, Math.floor((k - b2 + 12) / 3)) : 0; lx = J - lw - 4 + Math.min(4, push); if (push > 0) walk = k; }
    else if (k < b2 + 2) { turn = 2; lx = J - 40; hit = k - b2 + 1; }
    else { turn = 2; lx = J - 40 - 4; }
    const st = {lx, turn, hit, walk};
    if (k < 16) { tvPush(fb, f, st); return; }
    presser(fb, f, st);
  },
});
L.add('13.05', {
  st: 'act3/sets/lobby presser ([SCR] the press room: the reporter\'s question from off camera (the TV\'s audio; no senator speaks); the lectern stuck sideways at the doorway; the aides give up and turn it face on again by the door (their hands on its edges); the rear aide\'s hand slaps a tenth FORUM sticker on it, crooked, on the slap)',
  marks: {slap: ['snd', 'sticker_slap_tv', 1, 0]},
  draw: (fb, k, sh, f) => {
    const s = mk(sh, 'slap', 72), J = PRESS.jamb;
    const turn = (k < s - 14 ? 2 : k < s - 10 ? 1 : 0) as 0 | 1 | 2;
    const lw = turn === 2 ? 40 : turn === 1 ? 60 : 84;
    presser(fb, f, {lx: J - lw - 4, turn, tenth: k >= s, slap: k >= s - 4 && k < s ? 1 : k >= s && k < s + 8 ? 2 : 0});
  },
});
L.add('13.06', {
  st: 'act3/sets/lobby lobbyWide ([W] the master by day (art/sets/lobby2: the curling flyers, his upside down, the complaint a side table with cups, the corner TV\'s presser, DAYS SINCE 176 and 76): Mas walks off the near floor frame-right past the staffers at their pillar (their room figures turning after him); as he crosses the frame\'s edge the adventure band lights in the band\'s rows in held steps (act3/sets/band: sc 14\'s verbs and inventory))',
  marks: {band: ['snd', 'ui_band_on', 1, 0]},
  draw: (fb, k, sh, f) => {
    const bo = mk(sh, 'band', 52);
    const x = Math.round(486 - (bo - k) * 3.4);
    const mas = x < 500 ? {x, y: 197, legs: roomWalkAt(k) as Mas2Legs} : null;
    lobbyWide(fb, f, {mas, look: k > 10, band: k < bo ? 0 : Math.min(3, 1 + Math.floor((k - bo) / 3))});
    return {full: true};
  },
});

export const SCENE = defineScene({scene: '13', layouts: L.all});
