// MR. MAS — Ep1 act 4: the MEDIUM / TWO-SHOT tier sheets (owned by the act-4 medium-tier artist). Pure pixel code:
// every view returns a native 480x270 buffer and renders identically in Node (tools/lab.ts) and Remotion.
import {Buf} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {text} from '../../../../shared/pixel/font';
import {rect} from '../../../../shared/pixel/px';
import {textWidth} from '../../../../shared/pixel/font';
import {renderView as castView} from '../cast/sheet';
import * as MM from '../../../../shared/pixel/cast/mas-medium';
import {VISEMES} from '../../../../shared/pixel/cast/talk';
import * as OM from '../../../../shared/pixel/cast/orb-medium';
import * as DP from '../../../../shared/pixel/rooms/darkroom-plate';
import * as MD from '../../../../shared/pixel/cast/mada-medium';

const W = 480, H = 270;

// ------------------------------------------------------------------ sheet furniture
const title = (b: Buf, name: string, sub: string, accent: number) => {
  text(b, 'MR. MAS  EP1 ACT 4  MEDIUM', 6, 3, PAL.N5);
  text(b, name, 6 + textWidth('MR. MAS  EP1 ACT 4  MEDIUM') + 10, 3, accent);
  text(b, sub, W - 6 - textWidth(sub), 3, PAL.N4);
  rect(0, 13, W, 1, b.ink(PAL.N2));
};
const label = (b: Buf, s: string, x: number, y: number, col: number = PAL.N5) => text(b, s, x, y, col);
/** a dark 'desk top' band for rig tests: the far edge at row y */
const testDesk = (b: Buf, x: number, y: number, w: number, h: number) => {
  rect(x, y, w, h, b.ink(PAL.D1)); rect(x, y, w, 1, b.ink(PAL.C2)); rect(x, y + 1, w, 1, b.ink(PAL.D2));
};

// ------------------------------------------------------------------ MAS medium
const sheetMas = (b: Buf) => {
  title(b, 'MAS', 'waist-up rig  head 36px  3 heads  4 arms', PAL.C6);
  const at = (x: number, y: number, s: Partial<MM.MasMediumState>, flip = false) => {
    const st = {...MM.MAS_MEDIUM_DEFAULT, ...s};
    MM.drawMasMedium(b, x, y, st, {flip, desk: (bb) => testDesk(bb, x - 2, y + MM.MAS_M_DESK, MM.MAS_MW + 4, MM.MAS_MH - MM.MAS_M_DESK)});
  };
  at(4, 20, {});
  at(92, 20, {head: 'down', arm: 'tally'});
  at(180, 20, {head: 'front', look: 1, arm: 'phone'});
  at(268, 20, {arm: 'clasp', light: 'board'}, true);
  at(356, 20, {head: 'down', arm: 'down', light: 'warm'});
  label(b, "'34' rest", 8, 132); label(b, "'down' tally", 96, 132); label(b, "'front' phone", 184, 132); label(b, 'flip clasp board', 272, 132); label(b, "down 'warm'", 360, 132);
};

// ------------------------------------------------------------------ MADA medium
const sheetMada = (b: Buf) => {
  title(b, 'MADA', 'waist-up rig  seated  3 heads  4 arms  the spinner', PAL.G6);
  const at = (x: number, y: number, s: Partial<MD.MadaMediumState>, spin: number | null = 0, flip = false) => {
    const st = {...MD.MADA_MEDIUM_DEFAULT, ...s};
    MD.drawMadaMedium(b, x, y, st, {flip, spin, table: (bb) => testDesk(bb, x - 2, y + MD.MADA_M_TABLE, MD.MADA_MW + 4, MD.MADA_MH - MD.MADA_M_TABLE)});
  };
  at(4, 24, {});
  at(84, 24, {head: '34', look: -1});
  at(164, 24, {head: 'down', arm: 'rest'}, null);
  at(244, 24, {arm: 'clasp', mouth: 'A'}, 9);
  at(324, 24, {arm: 'take', head: '34', nod: 2, light: 'fire'}, 0);
  at(404, 24, {mouth: 'smile', lid: 1}, 0);
  ['fold', "'34' fold", 'down rest', 'clasp A', 'take nod fire', 'tell lid1'].forEach((t, i) => label(b, t, 8 + i * 80, 132));
};

/** dev: crop a native region of another view and blow it up k x (nearest) */
const zoom = (k: number, x: number, y: number, w: number, h: number, id: string): Buf => {
  const src = renderView(id);
  const out = new Buf(w * k, h * k, PAL.N0);
  for (let j = 0; j < h * k; j++) for (let i = 0; i < w * k; i++) out.set(i, j, src.get(x + Math.floor(i / k), y + Math.floor(j / k)));
  return out;
};

const dark2s = (b: Buf, f: number) => {
  const o: DP.DarkPlateOpts = {tally: 3, lanyard: true, phone: 'down', boardGrid: true, door: 0};
  DP.drawDarkPlate(b, f, o);
  const [ox, oy] = DP.DPLATE.orb;
  const m3 = [DP.DPLATE.tally.x + DP.DPLATE.tally.gap * 2, DP.DPLATE.tally.y + 4];
  OM.drawOrb(b, ox, oy + OM.orbBob(f), OM.ORB_MR, {look: OM.orbLook(ox, oy, m3[0], m3[1]), aperture: 0.5, monitor: -1});
  const [mx, my] = DP.DPLATE.mas;
  MM.drawMasMedium(b, mx, my, {...MM.MAS_MEDIUM_DEFAULT, head: 'down', arm: 'tally'}, {desk: (bb) => DP.drawDarkPlateDesk(bb, f, o)});
  DP.drawDarkPlateFront(b, f, o);
};

export const renderView = (id: string): Buf => {
  const parts = id.split(':');
  const kind = parts[0];
  if (kind === 'zoom') {
    const [k, x, y, w, h] = parts.slice(1, 6).map(Number);
    return zoom(k, x, y, w, h, parts.slice(6).join(':'));
  }
  if (kind === 'cast') return castView(parts.slice(1).join(':'));
  const b = new Buf(W, H, PAL.N1);
  if (kind === 'sheet') {
    const S: Record<string, (b: Buf) => void> = {mas: sheetMas, mada: sheetMada, dark2s: (bb) => dark2s(bb, 0), orbs: (bb) => {
      const looks: Array<[number, number]> = [[-0.85, 0.5], [-0.05, 0.85], [-0.2, 0.8], [-0.72, -0.04], [-0.95, -0.15], [0.85, 0.05], [0.95, 0.4], [-0.3, 0.75], [0, 0.6]];
      looks.forEach((l, i) => { OM.drawOrb(bb, 20 + i * 30, 40, OM.ORB_MR, {look: l, aperture: 0.5, monitor: -1}); label(bb, String(i), 18 + i * 30, 56); });
    }};
    if (S[parts[1]]) { S[parts[1]](b); return b; }
  }
  text(b, 'unknown view ' + id, 8, 8, PAL.R3);
  return b;
};
