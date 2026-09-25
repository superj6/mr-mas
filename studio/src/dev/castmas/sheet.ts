// MR. MAS — castmas dev: model sheet + motion test as pure functions -> 480x270 buffers.
import {Buf, W, H, rect} from '../pixeladv/core/px';
import {text} from '../pixeladv/core/font';
import {PAL} from '../pixeladv/core/palette';
import {drawMasDesk, MasDeskPose, MAS_DESK_DEFAULT, MAS_DESK_EDGE, masPortrait, MAS_PORTRAIT_DEFAULT, MasPortraitState, MasMouth, drawMasPortrait, drawMasKid, MAS_KID_DEFAULT, masStage, MAS_STAGE_DEFAULT, MAS_STAGE_FOOT, masThrone, MAS_THRONE_DEFAULT, MAS_THRONE_SEAT, MAS_THRONE_ARM} from '../../shared/pixel/cast/mas';
import {drawPortraitFrame} from '../pixeladv/art/ui';
import {blitTo} from '../../shared/pixel/cast/kit';
import {drawGergTable, GERG_DEFAULT, gergTypeAt, gergPortrait, GERG_PORTRAIT_DEFAULT, drawGergPortrait, gergKeycaps, drawKeycaps, GergPortraitState} from '../../shared/pixel/cast/gerg';
import {deskTop, dinnerTable, laptopThrone, stagePool} from './vignette';
import {INK, lightPool} from '../../shared/pixel/cast/kit';
import {drawAlyiTable, ALYI_DEFAULT, drawAlyiLevitate, ALYI_LEV_DEFAULT, alyiLift, alyiPortrait, ALYI_PORTRAIT_DEFAULT, drawAlyiPortrait, AlyiPortraitState} from '../../shared/pixel/cast/alyi';

const label = (b: Buf, s: string, x: number, y: number, c: number = PAL.N6) => text(b, s, x, y, c, {shadow: PAL.N0});

const deskShot = (b: Buf, x: number, y: number, p: MasDeskPose) => {
  drawMasDesk(b, x, y, p, (bb, dx, dy) => deskTop(bb, dx, dy));
  void MAS_DESK_EDGE;
};

const wip = (name: string): Buf => {
  const b = new Buf(240, 90, PAL.N1);
  if (name === 'desk') {
    const d = MAS_DESK_DEFAULT;
    const poses: MasDeskPose[] = [d, {...d, type: 1}, {...d, head: 'turn'}, {...d, head: 'camera'}, {...d, head: 'camera', mouth: 'smile', lid: 1}];
    poses.forEach((p, i) => deskShot(b, 2 + i * 48, 10, p));
  }
  if (name === 'mport') {
    const d = MAS_PORTRAIT_DEFAULT;
    const st: MasPortraitState[] = [d, {...d, look: -1, mouth: 'A'}, {...d, lid: 1, mouth: 'smile', light: 'warm'}];
    const bb = new Buf(3 * 116, 140, PAL.N2);
    st.forEach((q, i) => blitTo(bb, masPortrait(q), 2 + i * 116, 2));
    return bb;
  }
  if (name === 'kid') {
    const bb = new Buf(2 * 90, 80, PAL.N1);
    drawMasKid(bb, 2, 2, MAS_KID_DEFAULT, 'base');
    rect(90, 0, 90, 80, bb.ink(0x0e0e10));
    drawMasKid(bb, 92, 2, {...MAS_KID_DEFAULT, look: 1}, '1bit');
    return bb;
  }
  if (name === 'eras') {
    const bb = new Buf(200, 90, PAL.N1);
    blitTo(bb, masStage(MAS_STAGE_DEFAULT), 2, 4);
    blitTo(bb, masStage({...MAS_STAGE_DEFAULT, arm: 'down', mouth: 'open'}), 48, 4);
    blitTo(bb, masThrone(MAS_THRONE_DEFAULT), 96, 10);
    blitTo(bb, masThrone({...MAS_THRONE_DEFAULT, crown: false, mouth: 'rest'}), 146, 10);
    return bb;
  }
  if (name.startsWith('gerg')) {
    const f = Number(name.slice(4) || 30);
    const bb = new Buf(292, 140, PAL.N1);
    [0, 1, 2].forEach((k) => drawGergTable(bb, 2 + k * 56, 4, {...GERG_DEFAULT, type: gergTypeAt(f + k)}, f + k * 7, {table: (b2, x, y) => dinnerTable(b2, x - 2, y, 56)}));
    blitTo(bb, gergPortrait(GERG_PORTRAIT_DEFAULT), 176, 2);
    [3, 4, 5].forEach((k) => drawGergTable(bb, 2 + (k - 3) * 56, 72, {...GERG_DEFAULT, type: gergTypeAt(f + k)}, f + 20 + k * 9, {table: (b2, x, y) => dinnerTable(b2, x - 2, y, 56)}));
    return bb;
  }
  if (name === 'alyi') {
    const bb = new Buf(360, 140, PAL.N1);
    drawAlyiTable(bb, 2, 4, ALYI_DEFAULT, {table: (b2, x, y) => dinnerTable(b2, x - 2, y, 52)});
    drawAlyiLevitate(bb, 56, 10, ALYI_LEV_DEFAULT, alyiLift(0), {glow: PAL.C3});
    drawAlyiLevitate(bb, 56, 80, {...ALYI_LEV_DEFAULT, lid: 0, hands: 'open'}, alyiLift(24), {glow: PAL.C3});
    blitTo(bb, alyiPortrait(ALYI_PORTRAIT_DEFAULT), 110, 2);
    blitTo(bb, alyiPortrait({...ALYI_PORTRAIT_DEFAULT, eyes: 'tokens', t: 5}), 230, 2);
    return bb;
  }
  if (name === 'deskz') {
    const d = MAS_DESK_DEFAULT;
    const poses: MasDeskPose[] = [d, {...d, head: 'turn'}, {...d, head: 'camera'}, {...d, lid: 2}, {...d, head: 'camera', mouth: 'smile', look: 1}];
    const bb = new Buf(5 * 38, 44, PAL.N1);
    poses.forEach((p, i) => {
      const t = new Buf(48, 50, PAL.N1);
      deskShot(t, 0, 0, p);
      for (let y = 0; y < 44; y++) for (let x = 0; x < 36; x++) bb.set(i * 38 + x, y, t.get(x + 4, y));
    });
    return bb;
  }
  return b;
};

// ------------------------------------------------------------------ the lineup sheet
const MAS_C = PAL.C7, GERG_C = PAL.W6, ALYI_C = PAL.X3;
const zoomCrop = (b: Buf, src: Buf, sx: number, sy: number, w: number, h: number, dx: number, dy: number, k = 1) => {
  rect(dx - 1, dy - 1, w * k + 2, h * k + 2, b.ink(PAL.N0));
  for (let y = 0; y < h * k; y++) for (let x = 0; x < w * k; x++) b.set(dx + x, dy + y, src.get(sx + Math.floor(x / k), sy + Math.floor(y / k)));
};
const masFace = (s: MasPortraitState) => {
  const t = new Buf(112, 136, PAL.N1);
  drawMasPortrait(t, 0, 0, s);
  return t;
};
const small = (b: Buf, s: string, x: number, y: number, c: number = PAL.N5) => text(b, s, x, y, c);
/** Draw into a scratch copy of the destination, then paste back only the crop window (no boxed backgrounds). */
const drawCropped = (b: Buf, dx: number, dy: number, w: number, h: number, sx: number, draw: (t: Buf) => void) => {
  const t = new Buf(w + sx + 16, h, PAL.N1);
  for (let y = 0; y < h; y++) for (let x = 0; x < t.w; x++) t.set(x, y, b.get(dx - sx + x, dy + y));
  draw(t);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) b.set(dx + x, dy + y, t.get(sx + x, y));
};

const monitorGlow = (b: Buf, x: number, y: number, w: number, h: number) =>
  lightPool(b, x, y, w, h, -6, h * 0.45, w * 0.9, h * 0.75, PAL.N1, [[1, PAL.N2], [0.62, PAL.C0], [0.36, PAL.C1]]);

export const renderSheet = (): Buf => {
  const b = new Buf(W, H, PAL.N1);
  label(b, 'MR. MAS', 6, 3, PAL.N7);
  small(b, 'CAST  /  MAS . GERG . ALYI  /  base palette, native 480x270', 50, 3, PAL.N5);

  // ---------------- portraits
  const PY = 16, PWc = 104, PHc = 134;
  drawPortraitFrame(b, 8, PY, PWc, PHc, 'MAS MANALT', MAS_C, 1);
  drawMasPortrait(b, 8, PY, {...MAS_PORTRAIT_DEFAULT, look: 0}, PWc, PHc, 4);
  drawPortraitFrame(b, 240, PY, PWc, PHc, 'GERG MOCKBRAN', GERG_C, 1);
  drawGergPortrait(b, 240, PY, GERG_PORTRAIT_DEFAULT, PWc, PHc, 4);
  drawPortraitFrame(b, 364, PY, PWc, PHc, 'ALYI', ALYI_C, 1);
  drawAlyiPortrait(b, 364, PY, ALYI_PORTRAIT_DEFAULT, PWc, PHc, 4);
  // Alyi: the token eyes, inset over the sweater (2x)
  {
    const t = new Buf(112, 136, PAL.N1);
    drawAlyiPortrait(t, 0, 0, {...ALYI_PORTRAIT_DEFAULT, eyes: 'tokens', t: 7});
    zoomCrop(b, t, 36, 45, 26, 10, 364 + 4, PY + PHc - 26, 2);
    small(b, 'eyes: tokens', 364 + 60, PY + PHc - 18, PAL.C6);
  }
  // Mas expressions: mouths A E O M rest smile (1x face crops), lids + eye dart
  const EX = 124;
  small(b, 'MOUTHS', EX, PY - 1, MAS_C);
  const mouths: MasMouth[] = ['A', 'E', 'O', 'M', 'rest', 'smile'];
  mouths.forEach((m, i) => {
    const cx = EX + (i % 3) * 36, cy = PY + 9 + Math.floor(i / 3) * 44;
    zoomCrop(b, masFace({...MAS_PORTRAIT_DEFAULT, mouth: m}), 32, 44, 34, 34, cx, cy);
    small(b, m === 'rest' ? 'rest' : m === 'smile' ? 'smile' : m, cx + 1, cy + 35, PAL.N6);
  });
  small(b, 'LIDS  /  EYE DART', EX, PY + 99, MAS_C);
  const eyeRow = (sts: MasPortraitState[], y0: number, names: string[]) => sts.forEach((st, i) => {
    zoomCrop(b, masFace(st), 36, 45, 34, 10, EX + i * 36, y0);
    small(b, names[i], EX + i * 36 + 1, y0 + 11, PAL.N6);
  });
  eyeRow([{...MAS_PORTRAIT_DEFAULT}, {...MAS_PORTRAIT_DEFAULT, lid: 1}, {...MAS_PORTRAIT_DEFAULT, lid: 2}], PY + 107, ['open', 'half', 'shut']);
  eyeRow([{...MAS_PORTRAIT_DEFAULT, look: -1}, {...MAS_PORTRAIT_DEFAULT, look: 0}, {...MAS_PORTRAIT_DEFAULT, look: 1}], PY + 129, ['screen', 'you', 'away']);

  // ---------------- room sprites (native)
  rect(0, 170, W, 1, b.ink(PAL.N3));
  small(b, 'ROOM SPRITES', 6, 174, PAL.N6);
  const BY = 184;
  // Mas, present: at the desk, lit by the monitor (camera-left); the Orb rims his back
  monitorGlow(b, 2, BY, 128, 72);
  const d = MAS_DESK_DEFAULT;
  ([['screen', 0], ['turn', 0], ['camera', 0]] as const).forEach(([hd], i) => {
    drawCropped(b, 4 + i * 42, BY + 12, 40, 50, 5, (t) => drawMasDesk(t, 0, 0, {...d, head: hd, type: i === 0 ? 1 : 0}, (bb, dx, dy) => deskTop(bb, dx, dy)));
  });
  small(b, 'screen   turn   camera', 8, BY + 64, MAS_C);
  // 1993, native 1-bit
  rect(134, BY - 2, 86, 76, b.ink(INK));
  drawMasKid(b, 135, BY - 1, {...MAS_KID_DEFAULT}, '1bit');
  small(b, '1993  1-bit', 138, BY + 76, MAS_C);
  // 2008, the stage
  stagePool(b, 222, BY + 70, 44);
  blitTo(b, masStage(MAS_STAGE_DEFAULT), 222, BY + 74 - MAS_STAGE_FOOT[1] - 2);
  small(b, '2008', 234, BY + 76, MAS_C);
  // 2014, for the throne (a suggestion of the throne of laptops behind him)
  laptopThrone(b, 268, BY + 8, MAS_THRONE_SEAT, MAS_THRONE_ARM);
  blitTo(b, masThrone(MAS_THRONE_DEFAULT), 268, BY + 8);
  small(b, '2014', 282, BY + 76, MAS_C);
  // Gerg at the dinner table, keycaps mid-pop
  lightPool(b, 316, BY, 52, 74, 30, 0, 40, 60, PAL.N1, [[1, PAL.W0], [0.5, PAL.W1]]);
  drawGergTable(b, 316, BY + 12, {...GERG_DEFAULT, type: gergTypeAt(31)}, 31, {table: (bb, x, y) => dinnerTable(bb, x, y, 52)});
  small(b, 'gerg 1s', 324, BY + 76, GERG_C);
  // Alyi at the table, and floating
  lightPool(b, 370, BY, 108, 74, 54, 0, 60, 60, PAL.N1, [[1, PAL.W0], [0.5, PAL.W1]]);
  drawAlyiTable(b, 370, BY + 12, ALYI_DEFAULT, {table: (bb, x, y) => dinnerTable(bb, x, y, 50)});
  drawAlyiLevitate(b, 424, BY + 20, ALYI_LEV_DEFAULT, 4, {glow: PAL.C2, shadow: PAL.W0});
  small(b, 'table   levitate', 378, BY + 76, ALYI_C);
  return b;
};

// ------------------------------------------------------------------ motion test (48 frames)
export const MOTION_FRAMES = 48;
const masPortraitAt = (f: number): MasPortraitState => {
  const s: MasPortraitState = {...MAS_PORTRAIT_DEFAULT};
  s.look = f < 8 ? -1 : f < 40 ? 0 : f < 44 ? 1 : -1;
  s.lid = f === 12 || f === 14 ? 1 : f === 13 ? 2 : 0;
  const seq: MasMouth[] = ['A', 'E', 'O', 'M', 'rest'];
  s.mouth = f >= 18 && f < 33 ? seq[Math.floor((f - 18) / 3)] : f >= 33 ? 'smile' : 'rest';
  return s;
};
const masDeskAt = (f: number): MasDeskPose => {
  const keys = [1, 0, 2, 0, 3, 1, 0, 2, 1, 0];
  const typing = f < 20 || f >= 38;
  const head = f < 20 ? 'screen' : f < 22 ? 'turn' : f < 36 ? 'camera' : f < 38 ? 'turn' : 'screen';
  return {...MAS_DESK_DEFAULT, head, type: typing ? (keys[Math.floor(f / 2) % keys.length] as 0 | 1 | 2 | 3) : 0, lid: f === 30 || f === 32 ? 1 : f === 31 ? 2 : 0, mouth: f >= 26 && f < 36 ? 'smile' : 'rest'};
};

const gergPortraitAt = (f: number) => {
  const up = f >= 28 && f < 38; // he glances up at us, once
  return {mouth: (f >= 31 && f < 34 ? 'open' : 'rest') as 'open' | 'rest', lid: (f === 36 ? 2 : up ? 0 : 1) as 0 | 1 | 2, look: (up ? 0 : -1) as -1 | 0 | 1};
};

export const renderMotion = (f: number): Buf => {
  const b = new Buf(W, H, PAL.N1);
  label(b, 'MR. MAS', 6, 3, PAL.N7);
  small(b, 'CAST MOTION TEST  /  every change is a whole-pixel swap', 50, 3, PAL.N5);
  small(b, `f${String(f).padStart(2, '0')}`, W - 24, 3, PAL.N6);
  const PY = 16;
  // Mas portrait: dart, blink, mouths, the tiny smile
  drawPortraitFrame(b, 8, PY, 104, 134, 'MAS MANALT', MAS_C, 1);
  const ms = masPortraitAt(f);
  drawMasPortrait(b, 8, PY, ms, 104, 134, 4);
  // readout
  const RX = 122;
  small(b, 'MAS', RX, PY + 2, MAS_C);
  small(b, 'mouth', RX, PY + 16, PAL.N5); small(b, ms.mouth, RX + 30, PY + 16, PAL.N7);
  small(b, 'eyes', RX, PY + 28, PAL.N5); small(b, ms.look < 0 ? 'screen' : ms.look > 0 ? 'away' : 'you', RX + 30, PY + 28, PAL.N7);
  small(b, 'lids', RX, PY + 40, PAL.N5); small(b, ms.lid === 2 ? 'shut' : ms.lid === 1 ? 'half' : 'open', RX + 30, PY + 40, PAL.N7);
  const gs = gergPortraitAt(f);
  small(b, 'GERG', RX, PY + 64, GERG_C);
  small(b, 'eyes', RX, PY + 78, PAL.N5); small(b, gs.look < 0 ? 'laptop' : 'you', RX + 30, PY + 78, PAL.N7);
  small(b, 'ALYI', RX, PY + 102, ALYI_C);
  small(b, 'eyes', RX, PY + 116, PAL.N5); small(b, f >= 24 ? 'tokens' : 'open', RX + 30, PY + 116, f >= 24 ? PAL.C6 : PAL.N7);
  drawPortraitFrame(b, 244, PY, 104, 134, 'GERG MOCKBRAN', GERG_C, 1);
  drawGergPortrait(b, 244, PY, gs, 104, 134, 4);
  drawPortraitFrame(b, 366, PY, 104, 134, 'ALYI', ALYI_C, 1);
  drawAlyiPortrait(b, 366, PY, {...ALYI_PORTRAIT_DEFAULT, eyes: f >= 24 ? 'tokens' : 'open', t: f}, 104, 134, 4);
  // bottom band: the room sprites
  rect(0, 172, W, 1, b.ink(PAL.N3));
  const BY = 178;
  monitorGlow(b, 8, BY, 112, 80);
  {
    drawCropped(b, 38, BY + 14, 46, 50, 2, (t) => drawMasDesk(t, 0, 0, masDeskAt(f), (bb, dx, dy) => deskTop(bb, dx, dy)));
  }
  small(b, 'types on 2s, turns', 12, BY + 80, MAS_C);
  lightPool(b, 128, BY, 176, 80, 88, 0, 110, 76, PAL.N1, [[1, PAL.W0], [0.55, PAL.W1]]);
  drawGergTable(b, 188, BY + 16, {...GERG_DEFAULT, type: gergTypeAt(f), flick: (Math.floor(f / 3) % 4 === 3 ? 1 : 0) as 0 | 1}, f + 40, {table: (bb, x, y) => dinnerTable(bb, x - 40, y, 132)});
  small(b, 'types on 1s, keycaps pop', 132, BY + 80, GERG_C);
  lightPool(b, 312, BY, 160, 80, 80, 0, 90, 76, PAL.N1, [[1, PAL.W0], [0.55, PAL.W1]]);
  drawAlyiLevitate(b, 368, BY + 22, {...ALYI_LEV_DEFAULT}, alyiLift(f, 48), {glow: PAL.C2, shadow: PAL.W0});
  small(b, 'levitation bob, shadow holds', 316, BY + 80, ALYI_C);
  return b;
};

// ------------------------------------------------------------------ extra: variants, alternate lights, physics
export const renderExtra = (): Buf => {
  const b = new Buf(W, H, PAL.N1);
  label(b, 'MR. MAS', 6, 3, PAL.N7);
  small(b, 'CAST EXTRAS  /  alternate lights, era renders, pose variants', 50, 3, PAL.N5);
  const PY = 16;
  // Mas, the second head angle: the near-front drawing (the look to the lens, cold open f94), swapped on a snap
  drawPortraitFrame(b, 8, PY, 104, 134, 'MAS  to lens', MAS_C, 1);
  drawMasPortrait(b, 8, PY, {...MAS_PORTRAIT_DEFAULT, look: 0, mouth: 'smile', head: 'front'}, 104, 134, 4);
  // Gerg + Alyi portrait states (1x crops)
  const gs: Array<[GergPortraitState, string]> = [[GERG_PORTRAIT_DEFAULT, 'focus'], [{mouth: 'open', lid: 0, look: 0}, 'glance'], [{mouth: 'rest', lid: 2, look: -1}, 'blink']];
  small(b, 'GERG', 124, PY - 1, GERG_C);
  gs.forEach(([st, n], i) => {
    const t = new Buf(112, 136, PAL.N1);
    drawGergPortrait(t, 0, 0, st);
    zoomCrop(b, t, 32, 35, 34, 40, 124 + i * 37, PY + 9);
    small(b, n, 125 + i * 37, PY + 51, PAL.N6);
  });
  const as: Array<[AlyiPortraitState, string]> = [[ALYI_PORTRAIT_DEFAULT, 'open'], [{...ALYI_PORTRAIT_DEFAULT, eyes: 'closed'}, 'closed'], [{...ALYI_PORTRAIT_DEFAULT, eyes: 'tokens', t: 11}, 'tokens']];
  small(b, 'ALYI', 124, PY + 66, ALYI_C);
  as.forEach(([st, n], i) => {
    const t = new Buf(112, 136, PAL.N1);
    drawAlyiPortrait(t, 0, 0, st);
    zoomCrop(b, t, 32, 35, 34, 40, 124 + i * 37, PY + 76);
    small(b, n, 125 + i * 37, PY + 118, i === 2 ? PAL.C6 : PAL.N6);
  });
  // keycap physics strobe: every cap's path over 40 frames (dim), the caps at f40 (bright)
  lightPool(b, 238, PY, 114, 134, 57, 10, 70, 110, PAL.N1, [[1, PAL.W0], [0.55, PAL.W1]]);
  small(b, 'KEYCAP ARCS, f0-40', 242, PY + 2, GERG_C);
  const gx = 268, gy = PY + 60;
  drawGergTable(b, gx, gy, {...GERG_DEFAULT, type: gergTypeAt(40)}, 40, {table: (bb, x, y) => dinnerTable(bb, x - 20, y, 92)});
  for (let f = 0; f <= 40; f++) for (const c of gergKeycaps(f)) if (!c.resting) b.set(gx + c.x + 1, gy + c.y - 1, f % 2 ? PAL.W3 : PAL.W4);
  drawKeycaps(b, gx, gy, gergKeycaps(40));
  small(b, 'one bounce, then', 242, PY + 116, PAL.N6);
  small(b, 'they stay put', 242, PY + 126, PAL.N6);
  // 2008 pose variants
  stagePool(b, 358, PY + 118, 44); stagePool(b, 410, PY + 118, 44);
  blitTo(b, masStage({...MAS_STAGE_DEFAULT, arm: 'point', mouth: 'open'}), 358, PY + 122 - MAS_STAGE_FOOT[1] - 2);
  blitTo(b, masStage({...MAS_STAGE_DEFAULT, arm: 'down', look: 1}), 410, PY + 122 - MAS_STAGE_FOOT[1] - 2);
  small(b, '2008  point / down', 360, PY + 128, MAS_C);
  // bottom band: 1993 in BASE and in native 1-bit, 2014 without the crown, Alyi opened up, Mas monitor-only
  rect(0, 170, W, 1, b.ink(PAL.N3));
  const BY = 178;
  drawMasKid(b, 4, BY, {...MAS_KID_DEFAULT}, 'base');
  rect(92, BY - 1, 176, 76, b.ink(INK));
  drawMasKid(b, 93, BY, {...MAS_KID_DEFAULT, look: 1, mouth: 'o'}, '1bit');
  drawMasKid(b, 181, BY, {...MAS_KID_DEFAULT, lid: 2, click: 1}, '1bit');
  small(b, '1993 base', 8, BY + 78, MAS_C);
  small(b, '1-bit: looks up / blinks, clicks', 96, BY + 78, MAS_C);
  laptopThrone(b, 274, BY + 12, MAS_THRONE_SEAT, MAS_THRONE_ARM);
  blitTo(b, masThrone({...MAS_THRONE_DEFAULT, crown: false, mouth: 'rest', look: -1}), 274, BY + 12);
  small(b, 'no crown', 276, BY + 82, MAS_C);
  lightPool(b, 330, BY, 60, 80, 30, 0, 40, 60, PAL.N1, [[1, PAL.W0], [0.5, PAL.W1]]);
  drawAlyiLevitate(b, 336, BY + 20, {lid: 0, mouth: 'open', hands: 'open'}, 5, {glow: PAL.C2, shadow: PAL.W0});
  small(b, 'alyi open', 338, BY + 82, ALYI_C);
  monitorGlow(b, 396, BY, 82, 80);
  drawCropped(b, 404, BY + 16, 42, 50, 4, (t) => drawMasDesk(t, 0, 0, {...MAS_DESK_DEFAULT, light: 'monitor', head: 'camera', look: 1}, (bb, dx, dy) => deskTop(bb, dx, dy)));
  small(b, 'no orb rim', 404, BY + 82, MAS_C);
  return b;
};

export const renderView = (id: string): Buf => {
  if (id.startsWith('wip:')) return wip(id.slice(4));
  if (id === 'sheet') return renderSheet();
  if (id === 'extra') return renderExtra();
  if (id.startsWith('motion:')) return renderMotion(Number(id.slice(7)));
  return renderSheet();
};
