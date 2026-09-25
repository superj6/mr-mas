// MR. MAS — pixeladv: scene timeline (5.0 s @ 24 fps). Pure function frame -> 480x270 buffer.
//  0-23   night, Mas typing; the player's cursor hovers his glass ("Look at glass of water").
//  14-23  feet break the light under the door.
//  24-31  DOOR BURST: slab slams open, hallway light floods in, Nole backlit in the doorway.
//  32-47  Nole strides in (4-drawing walk on twos), palette fades from silhouette to room light.
//  48-83  Nole leans in, jabbing his phone: "I came up with the name!" (portrait + dialogue box).
//  84-107 Mas turns his head (3 drawings, held long), one blink, a one-pixel smile: "super."
//  108-119 Nole slams the phone on the desk: every object hops — the water doesn't.
import {Buf, W, H, clamp, rect} from './core/px';
import {text, textWidth} from './core/font';
import {PAL, lum} from './core/palette';
import {RoomState, renderRoom, drawGlass, drawGlint, ROOM_W, ROOM_H, GLASS} from './art/room';
import {masImg, MasPose, MAS_AT, masStandImg, MAS_STAND_H} from './art/mas';
import {noleImg, NolePose, NOLE_FOOT} from './art/nole';
import {blitImg, imgOpaque, Img} from './core/figure';
import {drawUI, drawCursor, drawPortraitFrame, drawDialogueBox, UI_Y} from './art/ui';
import {drawPortrait, nolePortraitImg, masPortraitImg} from './art/portraits';
import {drawForeground} from './art/foreground';

export const FRAMES = 120;
import {LINE_NOLE_STR, LINE_NOLE_T0, LINE_MAS_STR, LINE_MAS_T0, MAS_BLINK, MAS_SMILE_F} from './art/timing';
export const LINE_NOLE = LINE_NOLE_STR;
export const LINE_MAS = LINE_MAS_STR;

const DOOR_F = 24;
export const NOLE_CPS = 1.25;
const WALK0 = 32, WALK1 = 48;
const SLAM_F = 108;
const NOLE_TXT0 = LINE_NOLE_T0;
const MAS_TXT0 = LINE_MAS_T0;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - (1 - t) * (1 - t);

// ---------- Nole blocking ----------
export const nolePlace = (f: number): {x: number; y: number; pose: NolePose} | null => {
  if (f < DOOR_F) return null;
  const base: NolePose = {legs: 'stand', arm: 'down', mouth: 0, lean: 0, light: 'lit', brow: 0};
  if (f < WALK0) return {x: 422, y: 150, pose: {...base, legs: 'wide', light: 'sil', arm: 'down'}};
  if (f < WALK1) {
    const t = (f - WALK0) / (WALK1 - WALK0);
    const e = easeOut(t);
    const cyc = ['w0', 'w1', 'w2', 'w3'] as const;
    const legs = cyc[Math.floor((f - WALK0) / 2) % 4];
    const light = f < 34 ? 'sil' : f < 36 ? 'fade1' : f < 39 ? 'fade2' : 'lit';
    return {x: Math.round(lerp(422, 322, e)), y: Math.round(lerp(150, 178, e)), pose: {...base, legs, arm: 'phone', light}};
  }
  // at the desk
  let arm: NolePose['arm'] = 'phone';
  let lean = f < 50 ? 1 : f < 52 ? 2 : 3;
  if ((f >= 55 && f < 59) || (f >= 72 && f < 77)) arm = 'jab';
  else if ((f >= 59 && f < 62) || (f >= 77 && f < 80)) arm = 'jab2';
  if (f >= 84) { lean = 2; arm = 'phone'; }
  if (f >= 104 && f < SLAM_F) { arm = 'raise'; lean = 1; }
  if (f >= SLAM_F) { arm = 'slam'; lean = 4; }
  const mouth = noleMouth(f);
  const brow = f >= 52 && f < 84 ? 1 : 0;
  const shake = f >= SLAM_F && f < SLAM_F + 3 ? (f - SLAM_F) % 2 === 0 ? 1 : -1 : 0;
  return {x: 322 + shake, y: 178, pose: {...base, arm, lean, mouth, brow: brow as 0 | 1}};
};

const shownChars = (f: number, t0: number, str: string, cps = 1) => clamp(Math.floor((f - t0) * cps), 0, str.length);

export const noleMouth = (f: number): 0 | 1 | 2 => {
  const n = shownChars(f, NOLE_TXT0, LINE_NOLE, NOLE_CPS);
  if (f < NOLE_TXT0 || n >= LINE_NOLE.length) return 0;
  const ch = LINE_NOLE[n] ?? ' ';
  if (ch === ' ') return 0;
  return /[aeiouAEIOU!]/.test(ch) ? 2 : 1;
};

// ---------- Mas acting ----------
export const masPose = (f: number): MasPose => {
  const keys = [1, 0, 2, 0, 0, 1, 2, 0, 1, 0, 0, 2, 1, 2, 0, 0, 1, 0];
  const typing = f < 86;
  const type = typing ? (keys[Math.floor(f / 2) % keys.length] as 0 | 1 | 2) : 0;
  const head = f < 88 ? 'back' : f < 96 ? 'lost' : 'profile';
  const blink = f >= MAS_BLINK && f < MAS_BLINK + 3;
  const smile = f >= MAS_SMILE_F;
  const breathe = f >= 30 && f < 70 ? 1 : 0;
  const warm = f >= DOOR_F;
  // the cowlick is the only spring on him: it answers the door slam and the desk slam
  const spring = [0, -1, 0, 1, 0];
  const hb = f >= DOOR_F && f < DOOR_F + 5 ? spring[f - DOOR_F] : f >= SLAM_F && f < SLAM_F + 5 ? spring[f - SLAM_F] : 0;
  return {head, type, blink, smile, breathe, warm, hairBob: hb};
};

export const roomState = (f: number, nole: ReturnType<typeof nolePlace>, noleI: Img | null): RoomState => {
  const door = f < DOOR_F ? 'closed' : f === DOOR_F ? 'a' : f < DOOR_F + 3 ? 'b' : f < DOOR_F + 5 ? 'c' : 'd';
  const shakeSeq: Array<[number, number]> = [[2, 0], [-2, 1], [1, -1], [-1, 0]];
  const slamSeq: Array<[number, number]> = [[0, 3], [1, -2], [-1, 1], [0, -1], [0, 1]];
  const shake = f >= DOOR_F && f < DOOR_F + 4 ? shakeSeq[f - DOOR_F] : f >= SLAM_F && f < SLAM_F + 5 ? slamSeq[f - SLAM_F] : ([0, 0] as [number, number]);
  const typedAt = (k: number) => 60 + Math.floor(k * 2.2 + (k > 20 ? (k - 20) * 0.6 : 0));
  const typed = typedAt(Math.min(f, 86));
  const shadow = nole && noleI && f >= DOOR_F
    ? (() => {
        const fx = nole.x, fy = nole.y;
        const ox = fx - NOLE_FOOT[0], oy = fy - NOLE_FOOT[1];
        return (x: number, y: number) => {
          const d = y - fy;
          if (d < 0) return false;
          const j = NOLE_FOOT[1] - Math.round(d * 1.75);
          const i = Math.round(x - ox + d * 2.1);
          return imgOpaque(noleI, i, j) || imgOpaque(noleI, i - 1, j);
        };
      })()
    : undefined;
  const tilt = f < DOOR_F + 1 ? 0 : f < DOOR_F + 3 ? 6 : f < SLAM_F ? 4 : f < SLAM_F + 2 ? 9 : 7;
  const monitorFlicker = 1 + (Math.sin(f * 1.7) * 0.5 + Math.sin(f * 0.61) * 0.5) * 0.025 + (f >= SLAM_F && f < SLAM_F + 2 ? -0.35 : 0) + (f >= DOOR_F && f < DOOR_F + 2 ? -0.2 : 0);
  return {
    f, door, underDoor: f >= 14 && f < DOOR_F ? (f - 14) / 10 : 0,
    flash: f === DOOR_F || f === DOOR_F + 1 ? 1 : 0,
    monitor: monitorFlicker,
    typed, jolt: f >= SLAM_F ? f - SLAM_F : -1, tilt, shake, shadow,
  };
};

// ---------- conversation layout ----------
const PORTRAIT_W = 112, PORTRAIT_H = 136;
const NOLE_WIN: [number, number] = [480 - PORTRAIT_W - 8, 8];
const MAS_WIN: [number, number] = [8, 8];

const winOpen = (f: number, t0: number, t1: number) => (f < t0 || f >= t1 ? 0 : Math.min(1, (f - t0 + 1) / 3));

export const renderScene = (f: number, opts: {noUI?: boolean} = {}): Buf => {
  const out = new Buf(W, H, PAL.N0);
  const roomB = new Buf(ROOM_W, ROOM_H, PAL.N0);
  const nole = nolePlace(f);
  const nI = nole ? noleImg(nole.pose) : null;
  const rs = roomState(f, nole, nI);

  // room (with shake baked in) -> characters -> glass
  const noShake: RoomState = {...rs, shake: [0, 0]};
  renderRoom(noShake, roomB, 0);

  // Mas
  const mp = masPose(f);
  const mI = masImg(mp);
  blitImg(roomB, mI, MAS_AT[0], MAS_AT[1]);
  // Nole — in the doorway he is clipped by the door frame (he's standing in it)
  if (nole && nI) {
    const x = nole.x - NOLE_FOOT[0], y = nole.y - NOLE_FOOT[1];
    const inDoor = f < WALK0 + 3;
    blitImg(roomB, nI, x, y, inDoor ? {clip: (px, py) => px >= 400 && px <= 444 && py >= 59} : {});
  }
  drawForeground(roomB, rs.jolt);

  // composite room into frame with impact shake (the UI never shakes)
  const [sx, sy] = rs.shake;
  for (let y = 0; y < ROOM_H; y++)
    for (let x = 0; x < ROOM_W; x++) out.set(x, y, roomB.get(clamp(x - sx, 0, ROOM_W - 1), clamp(y - sy, 0, ROOM_H - 1)));
  // Mas's water is composited AFTER the shake: on the slam the whole room jolts around it and it
  // doesn't move a pixel. (On the door burst it rides along with the desk like everything else.)
  const slamming = f >= SLAM_F;
  drawGlass(out, slamming ? 0 : 0, slamming ? [0, 0] : rs.shake);
  if (f >= SLAM_F + 4 && f < SLAM_F + 9) drawGlint(out, GLASS.x + 1, GLASS.y - 1, f - SLAM_F - 4);

  if (opts.noUI) return out;
  // interface
  const cutscene = f >= DOOR_F && f < SLAM_F + 6;
  const sentence = cutscene ? '' : 'Look at glass of water';
  drawUI(out, {cutscene, sentence, hoverVerb: cutscene ? undefined : 'Look at', f});
  if (!cutscene) {
    const cx = f < DOOR_F ? Math.round(lerp(300, GLASS.x + 3, easeOut(clamp(f / 14, 0, 1)))) : GLASS.x + 3;
    const cy = f < DOOR_F ? Math.round(lerp(150, GLASS.y + 5, easeOut(clamp(f / 14, 0, 1)))) : GLASS.y + 5;
    drawCursor(out, cx, cy, f);
  }

  // conversation: Nole
  const no = winOpen(f, 50, 88);
  if (no > 0) {
    const fr = drawPortraitFrame(out, NOLE_WIN[0], NOLE_WIN[1], PORTRAIT_W, PORTRAIT_H, 'NOLE', PAL.W7, no);
    if (fr.full) {
      drawPortrait(out, 'nole', NOLE_WIN[0], NOLE_WIN[1], PORTRAIT_W, PORTRAIT_H, f);
      drawDialogueBox(out, 136, 14, 222, LINE_NOLE, shownChars(f, NOLE_TXT0, LINE_NOLE, NOLE_CPS), PAL.W7, f, 'right');
    }
  }
  // conversation: Mas
  const mo = winOpen(f, 96, SLAM_F + 6);
  if (mo > 0) {
    const fr = drawPortraitFrame(out, MAS_WIN[0], MAS_WIN[1], PORTRAIT_W, PORTRAIT_H, 'MAS', PAL.C7, mo);
    if (fr.full) {
      drawPortrait(out, 'mas', MAS_WIN[0], MAS_WIN[1], PORTRAIT_W, PORTRAIT_H, f);
      drawDialogueBox(out, 136, 14, 96, LINE_MAS, shownChars(f, MAS_TXT0, LINE_MAS, 0.75), PAL.C7, f, 'left');
    }
  }
  return out;
};

const blit2x = (b: Buf, img: Img, sx: number, sy: number, w: number, h: number, dx: number, dy: number, k = 2) => {
  for (let y = 0; y < h * k; y++)
    for (let x = 0; x < w * k; x++) {
      const v = img.c[(sy + Math.floor(y / k)) * img.w + sx + Math.floor(x / k)];
      b.set(dx + x, dy + y, v >= 0 ? v : PAL.N1);
    }
};
const box = (b: Buf, x: number, y: number, w: number, h: number) => {
  rect(x - 1, y - 1, w + 2, h + 2, b.ink(PAL.N0));
  rect(x - 2, y - 2, w + 4, 1, b.ink(PAL.N4));
  rect(x - 2, y + h + 1, w + 4, 1, b.ink(PAL.N3));
};
const label = (b: Buf, s: string, x: number, y: number, c: number = PAL.N6) => text(b, s, x, y, c, {shadow: PAL.N0});

export const renderSheet = (id: string): Buf => {
  const b = new Buf(W, H, PAL.N1);
  if (id === 'sprites') {
    b.c.fill(PAL.N3);
    const mp: MasPose = {head: 'back', type: 0, blink: false, smile: false, breathe: 0, warm: false, hairBob: 0};
    const ms: MasPose[] = [mp, {...mp, type: 1}, {...mp, head: 'lost', warm: true}, {...mp, head: 'profile', warm: true}, {...mp, head: 'profile', warm: true, blink: true}, {...mp, head: 'profile', warm: true, smile: true}];
    ms.forEach((p, i) => blitImg(b, masImg(p), 4 + i * 40, 4));
    const np: NolePose = {legs: 'stand', arm: 'down', mouth: 0, lean: 0, light: 'lit', brow: 0};
    const ns: NolePose[] = [np, {...np, legs: 'w0', arm: 'phone'}, {...np, legs: 'w1', arm: 'phone'}, {...np, legs: 'w2', arm: 'phone'}, {...np, legs: 'w3', arm: 'phone'}, {...np, arm: 'jab', lean: 3, mouth: 2, brow: 1}, {...np, arm: 'raise', lean: 2}, {...np, arm: 'slam', lean: 4}];
    ns.forEach((p, i) => blitImg(b, noleImg(p), 2 + i * 58, 78));
    blitImg(b, noleImg({...np, light: 'sil', legs: 'wide'}), 244, 0);
    blitImg(b, masStandImg(), 300, 0);
  }
  if (id === 'portraits') {
    label(b, 'CONVERSATION PORTRAITS', 10, 5, PAL.N7);
    label(b, 'replacement parts, shown 2x', 176, 5, PAL.N5);
    // NOLE
    const nx = 10, ny = 22;
    drawPortraitFrame(b, nx, ny, PORTRAIT_W, PORTRAIT_H, 'NOLE', PAL.W7, 1);
    drawPortrait(b, 'nole', nx, ny, PORTRAIT_W, PORTRAIT_H, 74);
    label(b, 'MOUTHS', 132, 22, PAL.W6);
    ([0, 1, 2, 3] as const).forEach((m, i) => {
      const img = nolePortraitImg({mouth: m, jab: 0, blink: 0, brow: 1, dip: 0});
      const x = 132 + (i % 2) * 50, y = 32 + Math.floor(i / 2) * 32;
      box(b, x, y, 46, 28);
      blit2x(b, img, 30, 62, 23, 14, x, y);
    });
    label(b, 'LIDS', 132, 100, PAL.W6);
    ([0, 1, 2] as const).forEach((l, i) => {
      const img = nolePortraitImg({mouth: 0, jab: 0, blink: l, brow: 1, dip: 0});
      const x = 132 + i * 34, y = 110;
      box(b, x, y, 30, 18);
      blit2x(b, img, 46, 38, 15, 9, x, y);
    });
    label(b, 'JAB: integer nudge', 132, 136, PAL.W6);
    label(b, '0 / -5,-3 / -2,-1', 132, 147, PAL.N5);
    // MAS
    const mx = 246, my = 22;
    drawPortraitFrame(b, mx, my, PORTRAIT_W, PORTRAIT_H, 'MAS', PAL.C7, 1);
    drawPortrait(b, 'mas', mx, my, PORTRAIT_W, PORTRAIT_H, 110);
    label(b, 'LIDS', 368, 22, PAL.C6);
    ([0, 1, 2, 3] as const).forEach((l, i) => {
      const img = masPortraitImg({lid: l, mouth: 0, smile: false});
      const x = 368 + (i % 2) * 52, y = 32 + Math.floor(i / 2) * 26;
      box(b, x, y, 48, 22);
      blit2x(b, img, 55, 38, 24, 11, x, y);
    });
    label(b, 'MOUTH / THE SMILE', 368, 88, PAL.C6);
    ([[0, false], [1, false], [0, true]] as const).forEach(([mo, sm], i) => {
      const img = masPortraitImg({lid: 3, mouth: mo as 0 | 1, smile: sm});
      const x = 368 + i * 36, y = 98;
      box(b, x, y, 32, 20);
      blit2x(b, img, 63, 59, 16, 10, x, y);
    });
    label(b, 'one pixel ->', 368, 124, PAL.N5);
    label(b, 'the tiniest smile', 368, 135, PAL.N5);
    // footer
    rect(0, 196, 480, 1, b.ink(PAL.N3));
    label(b, 'Faces are painted planes on the native 480x270 grid. Acting = replacement parts.', 10, 206, PAL.N6);
    label(b, 'No tweening between drawings: every change is a whole-pixel swap, held on 2s or longer.', 10, 219, PAL.N6);
    label(b, 'Key: monitor cyan from camera-left.  Back-rim: hallway tungsten.  Outline: shadow side only.', 10, 232, PAL.N5);
    label(b, 'MR. MAS  /  structure test: PIXEL ADVENTURE', 10, 252, PAL.N4);
  }
  if (id === 'lineup') {
    // height lineup on a model-sheet grid
    const fy = 190;
    for (let y = fy; y > 20; y -= 10) rect(6, y, 140, 1, b.ink(y === fy ? PAL.N5 : PAL.N2));
    blitImg(b, masStandImg(), 24, fy - MAS_STAND_H);
    const nStand = noleImg({legs: 'stand', arm: 'down', mouth: 0, lean: 0, light: 'lit', brow: 0});
    blitImg(b, nStand, 74, fy - NOLE_FOOT[1]);
    label(b, 'MAS', 30, fy + 5, PAL.C7);
    label(b, '74px', 30, fy + 16, PAL.N5);
    label(b, 'NOLE', 96, fy + 5, PAL.W7);
    label(b, '86px', 96, fy + 16, PAL.N5);
    label(b, 'LINEUP', 8, 6, PAL.N7);
    // palette
    const cols = Object.values(PAL);
    label(b, 'PALETTE', 8, 226, PAL.N6);
    cols.forEach((c, i) => rect(8 + (i % 22) * 6, 237 + Math.floor(i / 22) * 6, 5, 5, b.ink(c)));
    rect(152, 0, 1, 270, b.ink(PAL.N3));
    // Nole frames
    label(b, 'NOLE  walk (on 2s) / doorway silhouette', 160, 6, PAL.W6);
    const np: NolePose = {legs: 'stand', arm: 'phone', mouth: 0, lean: 0, light: 'lit', brow: 0};
    const row1: NolePose[] = [{...np, legs: 'w0'}, {...np, legs: 'w1'}, {...np, legs: 'w2'}, {...np, legs: 'w3'}, {...np, legs: 'wide', arm: 'down', light: 'sil'}];
    row1.forEach((p, i) => blitImg(b, noleImg(p), 156 + i * 64, 14));
    label(b, 'lean + jab / raise / slam', 160, 112, PAL.W6);
    const row2: NolePose[] = [{...np, lean: 3}, {...np, arm: 'jab', lean: 3, mouth: 2, brow: 1}, {...np, arm: 'jab2', lean: 3, mouth: 1, brow: 1}, {...np, arm: 'raise', lean: 1}, {...np, arm: 'slam', lean: 4}];
    row2.forEach((p, i) => blitImg(b, noleImg(p), 156 + i * 64, 118));
    rect(152, 212, 328, 1, b.ink(PAL.N3));
    label(b, 'MAS  at the desk: back / lost profile / profile / blink / type A-B', 160, 216, PAL.C6);
    const mp: MasPose = {head: 'back', type: 0, blink: false, smile: false, breathe: 0, warm: true, hairBob: 0};
    const row3: MasPose[] = [mp, {...mp, head: 'lost'}, {...mp, head: 'profile'}, {...mp, head: 'profile', blink: true}, {...mp, head: 'profile', smile: true}, {...mp, type: 1}, {...mp, type: 2}];
    row3.forEach((p, i) => {
      const img = masImg(p);
      // crop to head + shoulders so seven drawings fit
      for (let y = 0; y < 42; y++) for (let x = 0; x < 36; x++) { const v = img.c[y * img.w + x]; if (v >= 0) b.set(160 + i * 44 + x, 226 + y, v); }
    });
  }
  if (id === 'switch') {
    // the same frame, four palettes: a style switch here is a palette swap, not a re-draw
    const src = renderScene(74, {noUI: true});
    const cx = 128, cy = 44;
    const tone = (c: number) => Math.pow(clamp((lum(c) - 0.015) / 0.5, 0, 1), 0.7);
    const bay = (x: number, y: number) => [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5][(y & 3) * 4 + (x & 3)] / 16 + 1 / 32;
    const modes: Array<[string, string, (c: number, x: number, y: number) => number]> = [
      ['BASE', 'the show', (c) => c],
      ['1-BIT', '1993 / the model dreaming', (c, x, y) => (Math.pow(clamp((lum(c) - 0.05) / 0.45, 0, 1), 1.05) > bay(x, y) ? 0xe9e6da : 0x0e0e10)],
      ['LEDGER', 'money flashbacks', (c, x, y) => {
        const v = tone(c) * 2.1;
        const th = ((y % 3) / 3 + ((x + y) % 9) / 40);
        return v > 1 ? (v - 1 > th ? 0xe3dcc0 : 0x4f6f55) : v > th ? 0x4f6f55 : 0x16251d;
      }],
      ['TERMINAL', 'the machine POV', (c, x, y) => [0x020606, 0x0b3b3b, 0x22a7ad, 0xc6fbf1][clamp(Math.floor(tone(c) * 3.2 + bay(x, y) - 0.2), 0, 3)]],
    ];
    modes.forEach(([name, sub, f], k) => {
      const ox = (k % 2) * 240, oy = Math.floor(k / 2) * 135;
      for (let y = 0; y < 135; y++) for (let x = 0; x < 240; x++) b.set(ox + x, oy + y, f(src.get(cx + x, cy + y), x, y));
      const tw = textWidth(name) + textWidth(sub) + 18;
      rect(ox + 4, oy + 4, tw, 11, b.ink(PAL.N0));
      text(b, name, ox + 8, oy + 6, PAL.C7);
      text(b, sub, ox + 14 + textWidth(name), oy + 6, PAL.N6);
    });
    rect(239, 0, 2, 270, b.ink(PAL.N0));
    rect(0, 134, 480, 2, b.ink(PAL.N0));
  }
  return b;
};

export {UI_Y};
