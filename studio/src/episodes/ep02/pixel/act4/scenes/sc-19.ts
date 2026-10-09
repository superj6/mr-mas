// MR. MAS — Ep2 v1 · act4 · scene 19: 20 shot(s), 3216 f at the lock of show/reel/ep02-v1-el/ep02-v1-el-act4.json:
//   19.01 (110 f, WIDE · the lobby master at a watch party) · 19.02 (39 f, SCR · the corner TV, muted, held: the ro)
//   · 19.03 (108 f, WIDE · the doors: the new CFO comes in a) · 19.04 (358 f, 2S · Haras and Gerg on the beanbags,
//   the) · 19.05 (113 f, SCR · ON STREAM … → WIDE · the lobby eru) · 19.06 (161 f, SCR · the wall screen: the stream
//   cuts t) · 19.07 (226 f, WIDE · ELPPA's campus: the crowd's backs) · 19.08 (166 f, WIDE · the giant screen: the
//   stream's ch) · 19.09 (169 f, MCU · Mas on the lawn, phone to his ear ) · 19.10 (353 f, MCU · the call, crosscut;
//   Gerg's last qu) · 19.11 (48 f, POV · a push into his phone, full-bleed:) · 19.12 (115 f, WIDE · a 2006 street
//   corner: a phone ad;) · 19.13 (121 f, WIDE · match on the pin: 2008, this comp) · 19.14 (170 f, WIDE · he clicks;
//   behind him TPOOL's map) · 19.15 (88 f, ECU · match: the clicker in his 2008 han) · 19.16 (240 f, WIDE · the
//   walled garden (phrase 1): his) · 19.17 (240 f, MEDIUM → WIDE · (phrase 2) at each phone) · 19.18 (208 f, 2S ·
//   outside the hedge (phrase 3): Mas, ) · 19.19 (102 f, WIDE · the reverse from inside the gate ) · 19.20 (81 f,
//   WIDE · the garden folds back into the ph)
// The plan's picture notes (eggs, Ep1 payoffs, constraints; each shot's `picture` in data.ts):
//   19.01: Eggs at 0 s: the tusk. ELPPA's stage is generic (no real building, logo or trade dress).
//   19.02: Legible, 1.5 s (FC).
//   19.04: The cheer cuts "And profit—" (the episode's second and last cut-off): its cause, the stream's …AND LATER
//     THIS YEAR: CHATGTP. on the wall screen behind them, comes up and roars 0.2 s before her line; the lobby's cheer
//     lands on "profit" (lock QA). Record it complete; the take plays whole under the cheer, and the subtitle reads
//     "And profit—".
//   19.05: The cheer started under her question in 19.04 and carries across the cut.
//   19.06: Our staging: the stream's crowd shot, in our stream's UI.
//   19.07: His real post, verbatim, his lowercase (name swaps). No GUEST badge on him (D-15); three collars, no pop.
//   19.08: The V.O. after the post's read has cleared.
//   19.09: Crosscut: the speaker is in frame, or his voice is already established (P9). Gerg in the lobby is
//     invented staging (facts A70: the press placed Mas at the campus; one live blog also listed Gerg's counterpart
//     there, which the call doesn't contradict on screen and nothing in the scene turns on).
//   19.10: Mas asks aloud again (P9): his Ep1 precision question.
//   19.14: No cause claimed (FC).
//   19.15: Turn: he doesn't need their stage now.
//   19.16: Company to company only: no rings, no altar, no vows. One 4-bar phrase.
//   19.17: Text only: voice 5 is paused (D-56). One 4-bar phrase.
//   19.18: Radnus not burning (R1). No V.O.: "as a guest." and the held smile end the exchange (script review: the
//     old V.O. 12 narrated the picture).
//   19.19: The one shot where he loses the left third, on purpose.
// A stub written by tools/scenes.py: no layouts yet, so every shot renders as the host's STAND-IN (render.ts `check`
// fails on stand-ins). Fill it with L.add(<shot id>, {st, draw: (fb, k, sh, f) => ...}) per shot (README.md); `f` is
// the frame inside this scene. Name every file a layout reads at run time in defineScene({assets}).
import {defineScene, layouts} from '../../kit';

const L = layouts();

export const SCENE = defineScene({scene: "19", layouts: L.all});
