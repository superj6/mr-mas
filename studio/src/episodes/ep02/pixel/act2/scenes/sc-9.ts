// MR. MAS — Ep2 v1 · act2 · scene 9: BACKSTAGE (MAY 13, 2024; the demo stage's wings, morning). 6 shots, 1224 f on the
// v1 EL lock. The shots pass, 2026-10-09; the record is shots-act2.md. The staging is proposal.md sc 9 / script-v1:
//   ARRIVE   9.01 the wings in work light (cut on the match: 8.07's lit Monday square -> the work light, the same
//            place in frame), the count already going (the mix's), 2.4 s before Rima's first line: Mas in the left third
//            with his glass of water and the Orb, the engineer with the phone, Rima in her hard spot with the clicker,
//            CHATGTP a plain bubble on the monitor screen-right, Gerg typing behind his road case in the foreground
//   TURN     9.02 the engineer rehearses to her (his bust, lip-synced) -> the monitor answers yes!! before he's asked ·
//            9.03 the old transcript drops the [laughter] tag off its foot -> Gerg in the foreground, the engineer's
//            laugh stopping on "laugh." · 9.04 the two-shot, no cut-ins (both lip-synced)
//   AFTER    9.05 Mas walks off frame-left (to stage right); the camera pans with Rima to the monitor, the engineer
//            following (room mouths) · 9.06 she taps the monitor (no cursor: her fingertip), the VOICE panel, each slot
//            says hello under her fingertip, the fifth (Hey.) holds; the panel unfolds past the bezel onto the floor and
//            the floor is a drafting grid: its last square is 10.01's first cell
import {defineScene, layouts, mouth, roomMouth, mk} from '../../kit';
import {wingsWide, engineerMedium, wingsMonitor, wings2S, gergFore} from '../sets/wings';
import {rimaWalkAt} from '../../../../../shared/pixel/cast/rima-stand';
import {glide} from '../sets/common';

const L = layouts();
const typeAt = (f: number) => (Math.floor(f / 4) % 3) as 0 | 1 | 2;
const walk4 = (k: number) => (['w0', 'w1', 'w2', 'w3'] as const)[Math.floor(k / 3) % 4];
const room2 = (m: 'open' | 'rest') => m;

L.add('9.01', {
  st: 'act2/sets/wings wingsWide ([W] the art\'s SET-10 wings rebuilt as a pannable room, the work light where 8.07\'s Monday square was; Mas (art cast/mas2, the glass arm, its drink recoloured to water) with the Orb (Ep1 orb-medium) in the left third; the engineer (art cast/engineer room) with the phone; Rima (Ep1 rima-stand) in her hard spot with the clicker, a room mouth on her line; CHATGTP a plain bubble on the monitor (Ep1 chatgtp); Gerg (Ep1 gerg-stand) typing behind his road case in the foreground); the rail MAY 13, 2024',
  face: {RIMA: 'room'},
  draw: (fb, k, sh, f) => {
    wingsWide(fb, f, {spot: 214, cast: {
      mas: {x: 92}, orb: {x: 124, y: 98, look: [0.9, 0.2]},
      eng: {x: 168, pose: {arm: 'phone', mouth: 'smile'}},
      rima: {x: 214, pose: {mouth: room2(roomMouth(sh, k, 'RIMA'))}},
      gerg: {type: typeAt(f)},
    }});
  },
});
L.add('9.02', {
  st: 'act2/sets/wings engineerMedium → wingsMonitor ([M] the engineer (art cast/engineer bust, the phone up, presenter-bright) rehearsing it to Rima, who is soft at frame left (Ep1 rima-speak, a rung down); lip-synced; [SCR] the wings\' monitor, its bezel in frame: CHATGTP\'s plain bubble lights and answers yes!! on the chirp, before he\'s asked; his "…Before I\'ve asked." off screen)',
  face: {ENGINEER: 'lip'},
  marks: {chirp: ['snd', 'ui_chirp_bright', 1, 0]},
  draw: (fb, k, sh, f) => {
    const chirp = mk(sh, 'chirp', 116);
    if (k < chirp - 4) { engineerMedium(fb, f, {mouth: mouth(sh, k, 'ENGINEER'), expr: 'smile'}); return; }
    wingsMonitor(fb, f, {mode: 'reply', yes: k >= chirp});
  },
});
L.add('9.03', {
  st: 'act2/sets/wings wingsMonitor → gergFore ([SCR] the old voice mode\'s transcript: his words, its yes!!, and the laugh it never catches: the tag [laughter] falls off the screen\'s foot (THE PLAN\'s plant); [M] Gerg close at his road case in the foreground (Ep1 gerg-speak, the laptop\'s green glow), lip-synced, typing; beyond him, small and soft, the engineer laughing nervously beside Rima in her spot, the laugh stopping on "laugh.")',
  face: {GERG: 'lip'},
  marks: {drop: ['snd', 'tag_drop', 1, 0], said: ['end', 'e2-a2-0005', 0], g: ['on', 'e2-a2-0005', 0]},
  draw: (fb, k, sh, f) => {
    const drop = mk(sh, 'drop', 23), said = mk(sh, 'said', 98), g = mk(sh, 'g', 50);
    if (k < g - 6) { wingsMonitor(fb, f, {mode: 'transcript', drop: k >= drop ? k - drop : -1}); return; }
    gergFore(fb, f, {mouth: mouth(sh, k, 'GERG'), laugh: k < said - 2});
  },
});
L.add('9.04', {
  st: 'act2/sets/wings wings2S ([2S] the wings soft behind them: Mas in the left third (Ep1\'s approved portrait in the work light, flipped to face her) and Rima (Ep1 rima-speak), no cut-ins; both lip-synced; her "It is. Enjoy the view." pleasant, level brows, not a flicker)',
  face: {MAS: 'lip', RIMA: 'lip'},
  draw: (fb, k, sh, f) => { wings2S(fb, f, {mas: mouth(sh, k, 'MAS'), rima: mouth(sh, k, 'RIMA')}); },
});
L.add('9.05', {
  st: 'act2/sets/wings wingsWide (the walk-and-talk: Mas walks off frame-left to stage right (mas2\'s walk, flipped); a whole-pixel pan with Rima as she crosses the wings to the monitor (rima-stand\'s walk), her hard spot keeping up with her; the engineer following (his room walk); room mouths on both lines)',
  face: {ENGINEER: 'room', RIMA: 'room'},
  draw: (fb, k, sh, f) => {
    const mx = 92 - Math.max(0, k - 4);
    const rx = glide(k, 18, 110, 214, 306, 1);
    const ex = glide(k, 30, 124, 168, 262, 1);
    const pan = glide(k, 40, 140, 0, 40, 2, true);
    const rWalk = k >= 18 && k < 110, eWalk = k >= 30 && k < 124;
    wingsWide(fb, f, {pan, spot: rx, cast: {
      mas: mx > -30 ? {x: mx, flip: k >= 4, pose: {arm: 'glass', legs: k >= 4 ? walk4(k) : 'stand'}} : null,
      orb: mx > -30 ? {x: mx + 32, y: 98, look: [-0.8, 0.1]} : null,
      eng: {x: ex, pose: {arm: 'phone', mouth: roomMouth(sh, k, 'ENGINEER') === 'open' ? 'open' : 'rest', legs: eWalk ? walk4(k + 1) : 'stand'}},
      rima: {x: rx, pose: {body: rWalk ? rimaWalkAt(k) : 'stand', mouth: roomMouth(sh, k, 'RIMA')}},
      gerg: {type: typeAt(f)},
    }});
  },
});
L.add('9.06', {
  st: 'act2/sets/wings wingsMonitor ([SCR] the monitor, bezel in frame: her fingertip taps it (no cursor) and the art\'s VOICE panel opens: VOICE · VOICE 1..5 · SINCE SEP 2023; her fingertip hovers each slot and each says hello (Hi. Hi! hi? Hi… Hey.); the fifth holds its lit square; on the unfold step the panel\'s own rows come away one by one (VOICE 1 first, the fifth last), each folding into a square drafting cell as it falls past the bezel; the fifth, still lit, settles on the screen\'s foot as THE PLAN\'s first cell; on the ink stroke the drafting grid takes the frame from the floor up, a row of cells at a time, round that lit cell: 10.01\'s arrival)',
  marks: {unfold: ['snd', 'panel_unfold_step', 1, 0], ink: ['snd', 'drafting_ink_stroke', 1, 0]},
  draw: (fb, k, sh, f) => {
    const un = mk(sh, 'unfold', 131), ink = mk(sh, 'ink', 150);
    const ons = ['e2-a2-0012', 'e2-a2-0013', 'e2-a2-0014', 'e2-a2-0015', 'e2-a2-0016'].map((id, i) => sh.lines.find((l) => l.id === id)?.s ?? [38, 57, 72, 90, 114][i]);
    let said = -1; for (let i = 0; i < 5; i++) if (k >= ons[i]) said = i;
    if (k < 10) { wingsMonitor(fb, f, {mode: 'reply', tapAt: k >= 3 ? (k >= 6 ? 2 : 1) : 0}); return; }
    const hover = said >= 0 ? said : 0;
    // the panel's own rows fall past the bezel row by row (the fifth last, folding into the lit first cell); on the ink
    // stroke the drafting grid takes the frame from the floor up, a row of cells at a time
    wingsMonitor(fb, f, {mode: 'panel', hover: said >= 0 ? hover : undefined, said, unfold: k >= un ? k - un : -1, grid: k >= ink ? k - ink : -1, tap: k < un - 2});
  },
});
export const SCENE = defineScene({scene: '9', layouts: L.all});
