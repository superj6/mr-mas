// MR. MAS — Ep1 v3.1 pixel picture: THE TAG ("december", sc 32–33), one layout per shot of lock `tag` (the
// v3-shots-coldopen-tag pass, 2026-09-27). The lock is ./data.ts (tools/lock.py on the FINAL v3.1 lock,
// show/reel/ep01-v31/ep01-v31-tag.json, with ./takes-mouth.json: the fastrec takes plus mouth tracks for "that was close."
// and "noted.", from coldopen/tools/mouths.py).
// v3.1: 32.01 is 62 frames and its monitor wakes on its own (kits/monitor-v31 screenWake, then the demo's first card);
// v31-32.01d is the Runway insert, ELGOOG's demo film (out/ep01/full-v3/runway/elgoog-demo-final.mp4, runway.md §6):
// its i0–216 are BROWSER frames, spliced whole from PNGs (tag/tools/splice.ts writes them from insert.py's, with the
// host's V.O. line baked in); its i217–232 are drawn here (the two-shot with the held still on his monitor).
// The art is v3-art-b's dark room for the tag (rooms/darkroom-act3.ts, kits/emit-cover, kits/orb-toast, kits/grey-lady;
// show/episodes/ep01/production/full-v3/art/art-b.md §1.6) and this segment's small additive drawings in ./art.ts. The
// tag ends on its own last frame, black on the vault's hum; the Orb outro (a separate chapter) follows it.
// The record is show/episodes/ep01/production/full-v3/shots-tag.md.
//
// Rules kept: native 480 x 270, the master palette, whole-pixel moves, held drawings. Adult Mas never blinks
// (pov-and-framing §3.6). No lit-UI band (v3 C12 cut the glass prompt). The Orb's two verdicts sit over their two faces.
import {defineSegment, layouts, mk, mouth, on2, shiftRoom} from '../kit';
import {Buf, rect} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {DPLATE, DPLATE_LOOK} from '../../../../shared/pixel/rooms/darkroom-plate';
import {drawDarkA3, drawSlotECU, drawCoverMCU, drawBackWall, drawProfileGlass} from '../../../../shared/pixel/rooms/darkroom-act3';
import {drawMonitorOTS, drawMonitorPOV} from '../../../../shared/pixel/kits/mas-monitor';
import {screenWake} from '../../../../shared/pixel/kits/monitor-v31';
import {heldStillPainter} from './heldstill';
import {drawFrontPageHigh} from '../../../../shared/pixel/kits/grey-lady';
import {drawCoverProfile, drawWallOrb, eraseProfileHand, cardField} from './art';
import {drawMasStand, MAS_STAND_DEFAULT, masWalkAt} from '../../../../shared/pixel/cast/mas-stand';
import {DARKROOM} from '../../../../shared/pixel/rooms/darkroom';
import {LOCK} from './data';

const L = layouts();
/** after the demo the frozen duck stays up on his monitor (runway.md §6's continuity: the Orb re-scans the cover while
 *  the staged duck is still up behind him) */
const PLATE_HELD = {tally: 3 as const, screen: heldStillPainter};
/** the Runway insert: its shot, and the frames spliced from PNGs (i0–216; i217–232 are this file's two-shot) */
const DEMO = LOCK.shots.find((s) => s.id === 'v31-32.01d')!;
export const DEMO_SPLICE = {from: DEMO.s, to: DEMO.s + 217};

// ------------------------------------------------------------------ 32. the delivery
L.add('32.01', {
  st: 'rooms/darkroom-act3 drawDarkA3 (the dark room\'s two-shot, the tag\'s): Mas at the desk, his thumb on the third mark in the wood; the monitor lights on its own (kits/monitor-v31 screenWake 1-2-3 in held steps, then tag/art cardField: the demo film\'s bright first card); the Orb\'s iris goes to it first, and at k50 Mas looks up at it (runway.md §6: the cut to the insert is on his eyeline, 12 f later); the rail types in the band',
  draw: (fb, k, sh, f) => {
    const wake = 14, up = 50;
    const scr = k < wake ? screenWake(0) : k < wake + 3 ? screenWake(1) : k < wake + 6 ? screenWake(2) : k < wake + 12 ? screenWake(3) : cardField;
    drawDarkA3(fb, f, {
      orb: {at: 'shoulder', look: k < wake + 2 ? DPLATE_LOOK.mark3 : DPLATE_LOOK.grid},
      outline: true,
      mas: k < up ? {head: 'down', arm: 'tally', look: -1} : {head: '34', arm: 'rest', look: -1},
      plate: {tally: 3, screen: scr},
    });
  },
});

L.add('v31-32.01d', {
  st: 'the RUNWAY INSERT, ELGOOG\'s demo film (runway.md §3-§6: (a) the push-in, no chip; out/ep01/full-v3/runway/elgoog-demo-final.mp4): i0-216 are browser frames, spliced whole from insert.py\'s PNGs with the host\'s V.O. line baked in (tag/tools/splice.ts); here those frames draw only a pixel fallback (the monitor kit\'s [OTS] / [POV] with the demo\'s card or its held still). i217-232: the two-shot, drawDarkA3 with the held still on his monitor (tag/heldstill), Mas looking at it, the Orb\'s iris on it, then to the rack 6 f before 32.02\'s whir',
  draw: (fb, k, sh, f) => {
    const len = sh.e - sh.s;
    if (k < 22) { drawMonitorOTS(fb, f, cardField, {plate: {tally: 3}, key: 'tag-ots'}); return; }
    if (k < 199) { drawMonitorPOV(fb, f, heldStillPainter); return; }
    if (k < 217) { drawMonitorOTS(fb, f, heldStillPainter, {plate: {tally: 3}, key: 'tag-ots'}); return; }
    drawDarkA3(fb, f, {
      orb: {at: 'shoulder', look: k < len - 6 ? DPLATE_LOOK.grid : DPLATE_LOOK.tray},
      outline: true,
      mas: {head: '34', arm: 'rest', look: -1},
      plate: PLATE_HELD,
    });
  },
});

L.add('32.02', {
  st: 'rooms/darkroom-act3 drawSlotECU + kits/emit-cover (ecu): the rack\'s slot whirs and lets EMIT\'s year-end issue down in three held steps, headline first, masthead last; held to read (the LEDs keep blinking); the rail is the host\'s',
  marks: {whir: ['snd', 'tape_start', 1, 0]},
  draw: (fb, k, sh, f) => {
    const j = k - mk(sh, 'whir', 0);
    drawSlotECU(fb, f, {out: (j < 8 ? 0 : j < 14 ? 1 : j < 20 ? 2 : 3) as 0 | 1 | 2 | 3});
  },
});

L.add('32.03', {
  st: 'rooms/darkroom-act3 drawCoverMCU: Mas holds the cover up beside his face, the two faces wearing the same expression (both to the lens); under the V.O. nothing moves; after it his eyes go to the cover, once. The V.O. line types over his dark hoodie and the fallen-away room (rows 182-203 clear)',
  marks: {vo: ['end', 'v3-vo-24', 0]},
  draw: (fb, k, sh, f) => {
    drawCoverMCU(fb, f, {mas: {look: k >= mk(sh, 'vo', 59) + 10 ? 1 : 0}});
  },
});

L.add('32.04', {
  st: 'rooms/darkroom-act3 drawDarkA3 + kits/orb-toast: the Orb\'s scan fan sweeps Mas in held steps and its verdict pops over him at once; then it re-sweeps the cover in his hand, back and forth, under a working toast over the cover (re-scanning…), and the cover\'s own verdict arrives two beats late; Mas watches the Orb',
  marks: {sw1: ['snd', 'orb_scan_sweep', 1, 0], v1: ['snd', 'glyph_blink', 1, 0], sw2: ['snd', 'orb_scan_sweep', 2, 0], v2: ['snd', 'glyph_blink', 2, 0]},
  draw: (fb, k, sh, f) => {
    const sw1 = mk(sh, 'sw1', 7), v1 = mk(sh, 'v1', 24), sw2 = mk(sh, 'sw2', 28), v2 = mk(sh, 'v2', 68);
    // sweep 1: over his face, four held steps (3 f each); sweep 2: over the cover, there and back twice
    let scan: {dir: number; half: number} | null = null;
    if (k >= sw1 && k < v1 - 2) scan = {dir: [186, 180, 174, 168, 168, 168][Math.min(5, Math.floor((k - sw1) / 3))], half: 7};
    else if (k >= sw2 && k < v2 - 2) { const i = Math.floor((k - sw2) / 3) % 8; scan = {dir: [166, 160, 154, 148, 148, 154, 160, 166][i], half: 5}; }
    const toasts: Array<{s: string; k: number; kind?: 'verdict' | 'working'; x: number; y: number}> = [];
    if (k >= v1) toasts.push({s: 'verified: human', k: k - v1, x: 96, y: 26});
    if (k >= sw2 && k < v2) toasts.push({s: 're-scanning…', k: k - sw2, kind: 'working', x: 182, y: 104});
    if (k >= v2) toasts.push({s: 'verified: human', k: k - v2, x: 182, y: 104});
    const lookOrb = k >= sw2 && k < v2 ? [-0.62, 0.4] as [number, number] : DPLATE_LOOK.face;
    drawDarkA3(fb, f, {orb: {at: 'shoulder', look: lookOrb, scanning: scan !== null}, outline: true, mas: {look: 1}, plate: PLATE_HELD, cover: true, scan, toasts});
  },
});

L.add('32.05', {
  st: 'tag/art drawCoverProfile: the profile set-up (drawProfileGlass\'s, the room four rungs down) with the cover held up at frame left; Mas, turned to it, not to the Orb, grades it: "that was close." (v3.1; mouth from the take)',
  face: {MAS: 'lip'},
  draw: (fb, k, sh, f) => { drawCoverProfile(fb, f, {mas: {mouth: mouth(sh, k, 'MAS')}}); },
});

L.add('32.07', {
  st: 'rooms/darkroom-act3 drawBackWall (the dark room\'s wide, the back wall) + cast/mas-stand: Mas on his feet pins the cover up on the tap, stands back, reaches again and hangs the small frame with the GUEST lanyard on the second tap, then walks back toward his desk (whole-pixel steps on 2s, the walk cycle) so the wall reads; the Orb beside him watches the wall and drifts after him (tag/art drawWallOrb)',
  marks: {pin: ['snd', 'key_tap_soft_03', 1, 0], hang: ['snd', 'key_tap_soft_05', 1, 0]},
  draw: (fb, k, sh, f) => {
    const pin = mk(sh, 'pin', 12), hang = mk(sh, 'hang', 44);
    const reach = k < pin + 4 || (k >= hang - 6 && k < hang + 6);
    drawBackWall(fb, f, {cover: k >= pin, frame: k >= hang, mas: null, orb: false});
    // after the frame: 12 frames to look at it, then the walk back (44 px over 22 frames, on 2s), then he stops
    const w0 = hang + 18, walk = k >= w0 && k < w0 + 22;
    const mx = 132 + Math.round((Math.min(22, Math.max(0, on2(k) - w0)) * 44) / 22);
    drawMasStand(fb, mx, DARKROOM.floorY, {...MAS_STAND_DEFAULT, arm: reach ? 'reach' : 'down', legs: walk ? masWalkAt(k) : 'stand', light: 'monitor'});
    drawWallOrb(fb, f, k < hang + 10 ? [-0.85, 0.15] : k < w0 ? [-0.6, 0.25] : [0.7, 0.2], mx - 132);
  },
});

// ------------------------------------------------------------------ 33. the button
L.add('33.01', {
  st: 'rooms/darkroom-act3 drawDarkA3 + kits/grey-lady drawPaperPlate: back at the desk; THE GREY LADY drops flat onto the desk from above frame in held steps, THUD: the room layer shakes 2 px (the band does not), the Orb hops a pixel, the paper\'s dust; then his eyes go down to it',
  marks: {thud: ['snd', 'synth:thud', 1, 0]},
  draw: (fb, k, sh, f) => {
    const t = k - mk(sh, 'thud', 12);
    const paper = t < -3 ? null : t < 0 ? {phase: 'fall' as const, k: t + 3} : {phase: 'down' as const, k: t};
    const [ox, oy] = DPLATE.orb;
    const orbAt: [number, number] = t >= 0 && t < 3 ? [ox, oy - 1] : [ox, oy];
    drawDarkA3(fb, f, {
      orb: {at: orbAt, look: t < 6 ? DPLATE_LOOK.face : [-0.1, 0.8]},
      outline: true,
      mas: t < 14 ? {head: '34', look: -1} : {head: 'down', look: -1},
      plate: PLATE_HELD,
      paper,
    });
    if (t >= 0 && t < 5) shiftRoom(fb, [2, -2, 1, -1, 1][t], t < 2 ? 1 : 0);
  },
});

L.add('33.02', {
  st: 'kits/grey-lady drawFrontPageHigh (his eyeline, full-bleed: the page on his desk from above): the plain serif masthead, the columns, the clerk\'s stamp held to read; the page settles twice on its two curls',
  marks: {c1: ['snd', 'paper_curl', 1, 0], c2: ['snd', 'paper_curl', 2, 0]},
  draw: (fb, k, sh, f) => {
    const c1 = mk(sh, 'c1', 6), c2 = mk(sh, 'c2', 62);
    const settle = (k >= c1 && k < c1 + 4) || (k >= c2 && k < c2 + 4) ? 1 : 0;
    drawFrontPageHigh(fb, f, {settle: settle as 0 | 1});
  },
});

L.add('33.04', {
  st: 'rooms/darkroom-act3 drawProfileGlass (its resting hand painted out: tag/art eraseProfileHand): Mas in profile, the room fallen away, his glass in frame beside him, its water line one flat row; "noted." (mouth from the take); the chord with no third held on his face',
  face: {MAS: 'lip'},
  draw: (fb, k, sh, f) => { drawProfileGlass(fb, f, {mas: {mouth: mouth(sh, k, 'MAS')}}); eraseProfileHand(fb, f); },
});

L.add('33.05', {
  st: 'black on the vault\'s hum (the whole frame: no band rule), the story\'s last frame; the Orb outro follows as its own chapter',
  draw: (fb) => { rect(0, 0, 480, 270, fb.ink(PAL.N0)); return {full: true}; },
});

void on2; void Buf;
export const SEGMENT = defineSegment({seg: 'tag', lock: LOCK, layouts: L.all,
  browser: {frames: (f) => f >= DEMO_SPLICE.from && f < DEMO_SPLICE.to, note: 'the Runway insert (ELGOOG\'s demo), i0-216: PNGs from tag/tools/splice.ts (GLYPH_DIR/pic/NNNNN.png)'}});
