// MR. MAS — Ep2 v1 · act1 · scene 4A: YOU CAN SIT DOWN NOW (MAR 8, 2024; the boardroom, morning). 6 shots, 792 f on the
// v1 EL lock. The shots pass, 2026-10-09; the record is show/episodes/ep02/production/v1/shots-act1.md. The staging is
// proposal.md sc 4A and script-v1.md sc 4A:
//   ARRIVE   4A.01 the same table by day on the séance's camera (the candles gone; the dark table -> the same table by
//            day), MAS already standing behind his empty chair, TERB at the head with his single sheet: 2.6 s, then
//            Terb's first line
//   TURN     4A.02 the finding read whole: its first half on MADA (perfectly still), its second on MAS (nothing on his
//            face: Ep1's approved, unchanging CU); 4A.03 "You can sit down now, Mas." over his shoulder, and he sits
//   AFTER    4A.04 the four nameplates click in, his first; 4A.05 as he sits he looks to GERG at the back, who lifts his
//            laptop an inch; 4A.06 under the last click his phone lights with an invite (the slot -> the card)
import {defineScene, layouts, mouth, roomMouth, mk} from '../../kit';
import {day, mada2S, masStill, terbOTS, plates, phoneTable} from '../sets/board';
import {stepOf} from '../sets/common';

const L = layouts();

L.add('4A.01', {
  st: 'act1/sets/board day (Ep1 rooms/boardroom on the séance\'s camera, a morning grade, the window a pale sky): TERB at the head (seat L, Ep1 cast/terb-sheet, no helmet) with his single sheet, looking up for his first line (room-scale mouth); MADA halfway down (C), perfectly still; OMIS and two new directors (Ep1 civic extras) seated; MAS standing behind his empty chair (B); GERG at the back by the door with his laptop, standing',
  face: {TERB: 'room'},
  draw: (fb, k, sh, f) => {
    const l = sh.lines[0];
    const look = !!l && k >= l.s - 6 && k < (l.s + 70);
    day(fb, {f, mas: 'stand', terb: {read: !look, mouth: roomMouth(sh, k, 'TERB')}, gerg: 'type'});
  },
});
L.add('4A.02', {
  st: 'act1/sets/board mada2S ([2S] favouring MADA, Ep1\'s medium rig, the poker face to the lens, arms folded, perfectly still; Mas\'s flank at the frame\'s left edge) for the finding\'s first half → masStill ([MCU] Mas standing: Ep1\'s approved CU drawing, one silent unchanging face) from "but also found"; Terb\'s reading over both (his voice established)',
  marks: {but: ['w', 'e2-a1-0032', 'but', 0]},
  draw: (fb, k, sh, f) => { const but = mk(sh, 'but', 154); if (k < but - 2) mada2S(fb, f); else masStill(fb, f); },
});
L.add('4A.03', {
  st: 'act1/sets/board terbOTS ([OTS] over MAS\'s shoulder (his back, his hood, the right foreground) onto TERB at the head, Ep1\'s approved portrait, no helmet, his sheet at the frame\'s foot; he looks up from it, lip-synced: "You can sit down now, Mas."; on the chair\'s sound Mas sits and his shoulder drops out of frame)',
  face: {TERB: 'lip'},
  marks: {sit: ['snd', 'chair_unfold', 1, 0]},
  draw: (fb, k, sh, f) => {
    const sit = mk(sh, 'sit', 53);
    terbOTS(fb, {f, mouth: mouth(sh, k, 'TERB'), read: k > (sh.lines[0]?.e ?? 47) + 8, sit: k < sit - 4 ? 0 : Math.min(1, (k - sit + 4) / 10)});
  },
});
L.add('4A.04', {
  st: 'art/props/ui nameplatesECU ([ECU] the table\'s edge in the morning, four brass slots: MAS MANALT · BOARD clicks in first, then OMIS · NEW DIRECTOR, NEW DIRECTOR, NEW DIRECTOR, one click each, the last held to read)',
  marks: {c1: ['snd', 'nameplate_click', 1, 0], c2: ['snd', 'nameplate_click', 2, 0], c3: ['snd', 'nameplate_click', 3, 0], c4: ['snd', 'nameplate_click', 4, 0]},
  draw: (fb, k, sh, f) => {
    const cl = [mk(sh, 'c1', 7), mk(sh, 'c2', 24), mk(sh, 'c3', 38), mk(sh, 'c4', 52)];
    const n = stepOf(k, cl);
    plates(fb, f, {n, click: n > 0 && k - cl[n - 1] < 2});
  },
});
L.add('4A.05', {
  st: 'act1/sets/board day (the plates in): MAS sits in his chair (B) and looks over to GERG at the back by the door, who lifts his laptop an inch, like a toast, then types on; a warm half-second',
  draw: (fb, k, sh, f) => {
    day(fb, {f, mas: k < 18 ? 'sit' : 'glance', plates: true, terb: {read: true}, gerg: k >= 40 && k < 64 ? 'lift' : 'type'});
    void sh;
  },
});
L.add('4A.06', {
  st: 'act1/sets/board phoneTable ([ECU] his phone face up on the table beside his nameplate\'s corner; under the last click it lights with an invite: its toast, the mic icon; its glow on the wood)',
  marks: {pop: ['snd', 'ui_toast_pop', 1, 0]},
  draw: (fb, k, sh, f) => { phoneTable(fb, f, {lit: k >= mk(sh, 'pop', 12) ? 1 : 0}); },
});

export const SCENE = defineScene({scene: '4A', layouts: L.all});
