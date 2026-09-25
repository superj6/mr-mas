// MR. MAS — ep01 act 4 · rooms B: preview scenes (pure; shared by the Remotion stills and the Node preview).
// Each entry paints a 480x270 frame: the room plate (rows 0-202) + a placeholder rail band (the real rail is the
// rail builder's). 'staged' variants drop the existing cast sprites on the room's anchors, for scale and blocking only.
import {Buf, rect} from '../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../shared/pixel/palette';
import {blitImg} from '../../../../shared/pixel/figure';
import {drawBullpen, bullpenLandlord, drawGlassReflection, BullpenOpts, DOOR_CRACK, DOOR_OPENING, GLASS_PANES} from '../../../../shared/pixel/rooms/bullpen';
import {previewBand, tiny, newImg, imgPut} from '../../../../shared/pixel/rooms/kit-b';
import {drawMasDesk, MAS_DESK_DEFAULT} from '../../../../shared/pixel/cast/mas';
import {drawGergTable, GERG_DEFAULT} from '../../../../shared/pixel/cast/gerg';
import {drawLighthouse, LighthouseOpts} from '../../../../shared/pixel/rooms/lighthouse';
import {marioImg, MARIO_BASE, MARIO_FOOT} from '../../../../shared/pixel/cast/mario';
import {drawDarkRoom, drawDarkRoomFront, drawDarkDesk, DarkRoomOpts, DarkDeskOpts, DARKROOM} from '../../../../shared/pixel/rooms/darkroom';
// the Orb is the intro builder's (dev) drawing; used here for staging only
import {drawOrb} from '../../../../dev/mcoldopen/orb';

export interface PreviewScene { id: string; label: string; draw: (fb: Buf, f: number) => void; frames?: number }

/** A flat blocking silhouette (stand-in, NOT cast art) for characters that have no room sprite yet. */
const standIn = (b: Buf, footX: number, footY: number, h: number, col: number, clip?: {x: number; y: number; w: number; h: number}) => {
  const inClip = (x: number, y: number) => !clip || (x >= clip.x && x < clip.x + clip.w && y >= clip.y && y < clip.y + clip.h);
  const head = Math.round(h * 0.16), hw = Math.round(h * 0.075);
  const put = (x: number, y: number) => { if (inClip(x, y)) b.set(x, y, col); };
  for (let y = footY - h; y < footY - h + head; y++) for (let x = footX - hw; x <= footX + hw; x++) put(x, y);
  for (let y = footY - h + head; y < footY; y++) { const half = y < footY - h + head + 3 ? hw + 1 : Math.round(h * 0.14); for (let x = footX - half; x <= footX + half; x++) put(x, y); }
};

/** A light stand-in figure as an Img (for the reflection demo only; the cast owns Alyi). */
const standInImg = (h: number) => {
  const img = newImg(20, h);
  const head = Math.round(h * 0.16);
  for (let y = 0; y < h; y++) for (let x = 0; x < 20; x++) {
    const inHead = y < head && Math.abs(x - 10) <= 5;
    const inBody = y >= head && Math.abs(x - 10) <= (y < head + 3 ? 6 : 9) && !(y > h * 0.55 && Math.abs(x - 10) < 1);
    if (inHead || inBody) imgPut(img, x, y, x > 12 ? PAL.P1 : x < 7 ? PAL.N2 : PAL.G5);
  }
  return img;
};

const bp = (o: BullpenOpts, stage?: (fb: Buf, room: ReturnType<typeof drawBullpen>) => void, landlord?: {floor: number; ceiling: number; walls: number}) => (fb: Buf, f: number) => {
  const room = drawBullpen(fb, f, o);
  if (landlord) bullpenLandlord(fb, room, landlord);
  stage?.(fb, room);
  previewBand(fb);
};

const stageMas = (fb: Buf, room: ReturnType<typeof drawBullpen>) => {
  const [mx, my] = room.anchors.masDesk;
  drawMasDesk(fb, mx, my, {...MAS_DESK_DEFAULT, head: 'camera', light: 'monitor'});
};
const stageGerg = (fb: Buf, room: ReturnType<typeof drawBullpen>) => {
  const [gx, gy] = room.anchors.gergDesk;
  drawGergTable(fb, gx, gy, GERG_DEFAULT, 0);
};

const lh = (o: LighthouseOpts, stage?: (fb: Buf, room: ReturnType<typeof drawLighthouse>) => void) => (fb: Buf, f: number) => {
  const room = drawLighthouse(fb, f, o);
  stage?.(fb, room);
  previewBand(fb);
};

const dr = (o: DarkRoomOpts, cast = true) => (fb: Buf, f: number) => {
  drawDarkRoom(fb, f, o);
  if (cast) {
    const [mx, my] = DARKROOM.mas;
    drawMasDesk(fb, mx, my, {...MAS_DESK_DEFAULT, head: 'screen', look: -1, light: 'orb'});
    const [ox, oy] = DARKROOM.orb;
    drawOrb(fb, ox, oy, DARKROOM.orbR, {look: [-0.62, 0.12], aperture: 0.5, monitor: -1});
  }
  drawDarkRoomFront(fb, f, o);
  previewBand(fb);
};
const dd = (o: DarkDeskOpts) => (fb: Buf, f: number) => { drawDarkDesk(fb, f, o); previewBand(fb); };

export const SCENES: PreviewScene[] = [
  {id: 'rb-bullpen-day', label: 'BULLPEN DAY · DOOR SHUT', draw: bp({door: 'shut'})},
  {id: 'rb-bullpen-crack', label: 'BULLPEN DAY · DOOR CRACK (SC 30)', draw: bp({door: 'crack', chairs: [true, true, true, true]})},
  {id: 'rb-bullpen-crack-staged', label: 'STAGED · ALYI STAND-IN IN THE CRACK', draw: bp({door: 'crack'}, (fb, room) => {
    const [ax, ay] = room.anchors.alyiCrack;
    standIn(fb, ax + 3, ay, 84, PAL.N1, DOOR_CRACK);
  })},
  {id: 'rb-bullpen-staged', label: 'STAGED · MAS + GERG ON THEIR MARKS (SC 31)', draw: bp({door: 'shut', chairs: [true, false, true, false]}, (fb, room) => { stageGerg(fb, room); stageMas(fb, room); })},
  {id: 'rb-bullpen-reflection', label: 'STAGED · A REFLECTION IN PANE 2 (STAND-IN)', draw: bp({door: 'shut'}, (fb, room) => {
    const [x0, , x1] = GLASS_PANES[1];
    drawGlassReflection(fb, room, standInImg(80), Math.round((x0 + x1) / 2) - 10, 62);
  })},
  {id: 'rb-bullpen-allhands', label: 'ALL-HANDS (SC 27) · ONE HAND UP', draw: bp({variant: 'allhands', door: 'open', handsUp: [22]}, (fb, room) => {
    const [ax, ay] = room.anchors.alyiDoorway;
    standIn(fb, ax, ay, 84, PAL.N1, {x: DOOR_OPENING.x, y: DOOR_OPENING.y, w: 14, h: DOOR_OPENING.h});
  })},
  {id: 'rb-bullpen-allhands-empty', label: 'ALL-HANDS · A SECOND HAND · THE DOORWAY EMPTY', draw: bp({variant: 'allhands', door: 'open', handsUp: [22, 44]})},
  {id: 'rb-bullpen-walkout', label: 'WALKOUT · BOXES + COATS (SC 30)', draw: bp({variant: 'walkout', door: 'shut'})},
  {id: 'rb-bullpen-landlord-1', label: 'LANDLORD · BELOW (STEP 1)', draw: bp({variant: 'walkout'}, undefined, {floor: 1, ceiling: 0, walls: 0})},
  {id: 'rb-bullpen-landlord-2', label: 'LANDLORD · BELOW (STEP 2)', draw: bp({variant: 'walkout'}, undefined, {floor: 2, ceiling: 0, walls: 0})},
  {id: 'rb-bullpen-landlord-3', label: 'LANDLORD · BELOW ABOVE AROUND', draw: bp({variant: 'walkout'}, undefined, {floor: 3, ceiling: 3, walls: 3})},
  {id: 'rb-lighthouse', label: 'LIGHTHOUSE NIGHT · THRONE ON THE HANDSET', draw: lh({meters: 0, ring1: 0})},
  {id: 'rb-lighthouse-meters', label: 'LIGHTHOUSE · TWO RENT METERS (SC 27)', draw: lh({meters: 2, throne: 'fallen', ring2: 0})},
  {id: 'rb-lighthouse-staged', label: 'STAGED · MARIO ON HIS MARK', draw: lh({meters: 2, ring1: 0}, (fb, room) => {
    const [mx, my] = room.anchors.marioDesk;
    blitImg(fb, marioImg({...MARIO_BASE, arm: 'raise'}), mx - MARIO_FOOT[0], my - MARIO_FOOT[1]);
    const [ax, ay] = room.anchors.adelinaDesk;
    standIn(fb, ax, ay, 80, PAL.W1);
    // front-pass check: a stand-in BEHIND the desk, then the desk repainted over it
    const [bx, by] = room.anchors.marioBehind;
    standIn(fb, bx + 40, by, 80, PAL.U1);
    room.front?.(fb);
  }), frames: 96},
  {id: 'rb-darkroom-plate', label: 'DARK ROOM · CLEAN PLATE (INTRO ROOM)', draw: dr({clock: '2:06'}, false)},
  {id: 'rb-darkroom-sc29', label: 'DARK ROOM SC 29 · 3 MARKS · GUEST · GRID · 2:06', draw: dr({clock: '2:06', tally: 3, lanyard: true, screen: 'feed', boardGrid: true})},
  {id: 'rb-darkroom-door-1', label: 'DARK ROOM · BLUE DOOR STEP 1', draw: dr({clock: '2:06', tally: 3, lanyard: true, screen: 'feed', boardGrid: true, blueDoor: 1})},
  {id: 'rb-darkroom-door-3', label: 'DARK ROOM · BLUE DOOR STEP 3', draw: dr({clock: '2:06', tally: 3, lanyard: true, screen: 'feed', boardGrid: true, blueDoor: 3})},
  {id: 'rb-darkroom-door', label: 'DARK ROOM · BLUE DOOR, KEY IN THE LOCK', draw: dr({clock: '2:06', tally: 3, lanyard: true, screen: 'feed', boardGrid: true, blueDoor: 4})},
  {id: 'rb-darkroom-door-ajar', label: 'DARK ROOM · LEAVE IT OPEN', draw: dr({clock: '2:06', tally: 3, lanyard: true, screen: 'feed', boardGrid: true, blueDoor: 4, blueDoorAjar: true})},
  {id: 'rb-darkdesk-2', label: 'THE DESK, CLOSE (SC 26A) · TWO OLD MARKS', draw: dd({tally: 3, carve: 0})},
  {id: 'rb-darkdesk-carve', label: 'THE DESK, CLOSE · CARVING (1/2)', draw: dd({tally: 3, carve: 0.5})},
  {id: 'rb-darkdesk-3', label: 'THE DESK, CLOSE · THREE MARKS', draw: dd({tally: 3, carve: 1})},
];

/** Motion tests (whole-pixel, held steps, on the 96 BPM grid: 15 frames a beat). */
export const MOTION: PreviewScene[] = [
  // one revolution of the lamp (2 bars), phone 1 ringing from the top, the meters spinning
  {id: 'rb-motion-lighthouse', label: 'LIGHTHOUSE · LAMP + RING + METERS', draw: lh({meters: 2, ring1: 0}), frames: 120},
  // "below them, above them, around them": three held steps each, one word per bar
  {id: 'rb-motion-landlord', label: 'LANDLORD · BELOW / ABOVE / AROUND', frames: 210, draw: (fb, f) => {
    const st = (t0: number) => (f < t0 ? 0 : f < t0 + 5 ? 1 : f < t0 + 10 ? 2 : 3);
    bp({variant: 'walkout'}, undefined, {floor: st(30), ceiling: st(90), walls: st(150)})(fb, f);
  }},
  // the blue door steps up out of the shadow, one step a beat, key jangling; then it stands ajar
  {id: 'rb-motion-bluedoor', label: 'DARK ROOM · THE BLUE DOOR', frames: 120, draw: (fb, f) => {
    const rise = (f < 15 ? 0 : f < 30 ? 1 : f < 45 ? 2 : f < 60 ? 3 : 4) as 0 | 1 | 2 | 3 | 4;
    dr({clock: '2:06', tally: 3, lanyard: true, screen: 'feed', boardGrid: true, blueDoor: rise, blueDoorAjar: f >= 90})(fb, f);
  }},
];

// keep unused helpers referenced for the type checker
void rect; void stepColor; void blitImg; void tiny;
