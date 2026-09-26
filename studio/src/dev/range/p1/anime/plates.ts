// MR. MAS - style-range Prototype 1: the PAINTED PLATES of the push (canvas, generated once per render worker).
//   backdrop  the casino dark behind the players, painted out of focus: the far back bar's unlettered neon tube, the
//             bottles as soft warm and cool discs, the far room falling to black, the lamp's hood of warm haze
//   tableTop  the felt seen from above in world units (10 px / cm): the pool of the one lamp, the felt's nap, the
//             betting line, the padded rail with its lit crown; mapped in true perspective under the cels each frame
// Deterministic (seeded), no text, no marks.
import {prng} from '../../../../shared/anime/ink';
import {TABLE, WORLD} from './world';

const mk = (w: number, h: number) => {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
};

// ------------------------------------------------------------------ backdrop (a card at WORLD.wallZ)
export const BACK = {w: 2600, h: 1500, /** world extent of the card */ x0: -1120, x1: 1480, y0: -760, y1: 540};
let BACKDROP: HTMLCanvasElement | null = null;
export const backdrop = () => {
  if (BACKDROP) return BACKDROP;
  const c = mk(BACK.w, BACK.h);
  const g = c.getContext('2d')!;
  const X = (wx: number) => ((wx - BACK.x0) / (BACK.x1 - BACK.x0)) * BACK.w;
  const Y = (wy: number) => ((wy - BACK.y0) / (BACK.y1 - BACK.y0)) * BACK.h;
  // the far room: a cool near-black, a warmer dark where the lamp's hood reaches
  const bg = g.createLinearGradient(0, 0, 0, BACK.h);
  bg.addColorStop(0, '#07060A');
  bg.addColorStop(0.5, '#0B0A10');
  bg.addColorStop(1, '#050408');
  g.fillStyle = bg;
  g.fillRect(0, 0, BACK.w, BACK.h);
  const hood = g.createRadialGradient(X(WORLD.lamp[0]), Y(-600), 40, X(WORLD.lamp[0]), Y(-200), 900);
  hood.addColorStop(0, 'rgba(120,70,36,0.42)');
  hood.addColorStop(0.5, 'rgba(60,32,20,0.16)');
  hood.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = hood;
  g.fillRect(0, 0, BACK.w, BACK.h);
  const rnd = prng(81);
  g.filter = 'blur(22px)';
  // the back bar: a long dark counter, bottles above it as out-of-focus discs
  const barY = Y(70);
  for (let i = 0; i < 90; i++) {
    const x = rnd() * BACK.w, y = barY - 60 - rnd() * 200;
    const warm = rnd() > 0.35;
    const r = 10 + rnd() * 26;
    g.fillStyle = warm ? `rgba(255,${150 + Math.floor(rnd() * 60)},${80 + Math.floor(rnd() * 40)},${0.08 + rnd() * 0.16})` : `rgba(90,210,220,${0.06 + rnd() * 0.12})`;
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  }
  // far violet and amber glows of the room beyond (slot banks, never lettered)
  for (let i = 0; i < 14; i++) {
    const x = rnd() * BACK.w, y = barY + 40 + rnd() * 160;
    g.fillStyle = rnd() > 0.5 ? `rgba(110,60,150,${0.1 + rnd() * 0.12})` : `rgba(200,120,50,${0.08 + rnd() * 0.1})`;
    g.fillRect(x, y, 60 + rnd() * 120, 30 + rnd() * 60);
  }
  g.filter = 'blur(10px)';
  // the unlettered neon tube along the bar front: the one cool light in the room
  g.fillStyle = 'rgba(63,202,203,0.9)';
  g.fillRect(0, barY - 6, BACK.w * 0.43, 12);
  g.fillRect(BACK.w * 0.45, barY - 6, BACK.w * 0.55, 12);
  g.filter = 'blur(40px)';
  g.fillStyle = 'rgba(63,202,203,0.35)';
  g.fillRect(0, barY - 40, BACK.w, 80);
  g.filter = 'none';
  // the counter under it
  g.fillStyle = 'rgba(4,4,7,0.92)';
  g.fillRect(0, barY + 12, BACK.w, BACK.h - barY);
  const cf = g.createLinearGradient(0, barY + 12, 0, barY + 120);
  cf.addColorStop(0, 'rgba(40,110,120,0.25)');
  cf.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = cf;
  g.fillRect(0, barY + 12, BACK.w, 110);
  // painted grain
  const img = g.getImageData(0, 0, BACK.w, BACK.h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (rnd() - 0.5) * 7;
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
  BACKDROP = c;
  return c;
};

// ------------------------------------------------------------------ the table top (world X-Z plane at Y = TOP)
export const TOPTEX = {x0: -120, x1: 140, z0: 100, z1: 270, ppc: 8};
let TOP: HTMLCanvasElement | null = null;
export const tableTop = () => {
  if (TOP) return TOP;
  const {x0, x1, z0, z1, ppc} = TOPTEX;
  const w = Math.round((x1 - x0) * ppc), h = Math.round((z1 - z0) * ppc);
  const c = mk(w, h);
  const g = c.getContext('2d')!;
  const U = (x: number) => (x - x0) * ppc;
  const V = (z: number) => (z1 - z) * ppc; // far (large Z) at the top of the texture
  const {XC, ZC, A, B, R} = TABLE;
  const oval = (a: number, b: number) => { g.beginPath(); g.ellipse(U(XC), V(ZC), a * ppc, b * ppc, 0, 0, Math.PI * 2); };
  // the rail: dark padded leather, its crown catching the pool
  oval(A + R, B + R);
  g.fillStyle = '#0D0A0B';
  g.fill();
  const railLit = g.createRadialGradient(U(WORLD.pot[0]), V(WORLD.pot[2]), 20 * ppc, U(WORLD.pot[0]), V(WORLD.pot[2]), 140 * ppc);
  railLit.addColorStop(0, 'rgba(160,96,58,0.75)');
  railLit.addColorStop(1, 'rgba(60,30,20,0.25)');
  g.save();
  oval(A + R * 0.55, B + R * 0.55);
  g.lineWidth = R * ppc * 0.3;
  g.strokeStyle = railLit;
  g.stroke();
  g.restore();
  // the felt, with the pool of the lamp
  oval(A, B);
  g.save();
  g.clip();
  g.fillStyle = '#0C2018';
  g.fillRect(0, 0, w, h);
  const pool = g.createRadialGradient(U(WORLD.pot[0]), V(WORLD.pot[2]), 0, U(WORLD.pot[0]), V(WORLD.pot[2]), 126 * ppc);
  pool.addColorStop(0, '#6A965A');
  pool.addColorStop(0.22, '#467C52');
  pool.addColorStop(0.5, '#23513A');
  pool.addColorStop(0.78, '#102A1F');
  pool.addColorStop(1, '#07130E');
  g.fillStyle = pool;
  g.fillRect(0, 0, w, h);
  // the tungsten warmth at the pool's heart
  const warm = g.createRadialGradient(U(WORLD.pot[0]), V(WORLD.pot[2]), 0, U(WORLD.pot[0]), V(WORLD.pot[2]), 70 * ppc);
  warm.addColorStop(0, 'rgba(255,196,120,0.22)');
  warm.addColorStop(1, 'rgba(255,196,120,0)');
  g.fillStyle = warm;
  g.fillRect(0, 0, w, h);
  const rnd = prng(29);
  // a painted mottle: broad soft patches, lighter and darker
  g.filter = 'blur(26px)';
  for (let i = 0; i < 70; i++) {
    g.fillStyle = rnd() > 0.5 ? 'rgba(150,190,120,0.06)' : 'rgba(0,14,8,0.10)';
    g.beginPath(); g.ellipse(rnd() * w, rnd() * h, 40 + rnd() * 160, 20 + rnd() * 70, rnd() * 3, 0, Math.PI * 2); g.fill();
  }
  g.filter = 'none';
  // the nap of the felt: fine, soft, seeded
  g.globalAlpha = 0.085;
  for (let i = 0; i < 16000; i++) {
    g.fillStyle = rnd() > 0.5 ? '#A6C894' : '#030A06';
    g.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 6, 1 + rnd() * 1.5);
  }
  g.globalAlpha = 1;
  // the cushion's soft shadow on the felt all round the edge
  g.lineWidth = 7 * ppc;
  g.strokeStyle = 'rgba(0,0,0,0.45)';
  g.filter = 'blur(10px)';
  oval(A, B);
  g.stroke();
  g.filter = 'none';
  // the betting line
  g.lineWidth = 0.5 * ppc;
  g.strokeStyle = 'rgba(190,220,170,0.28)';
  oval(A - 18, B - 12);
  g.stroke();
  g.restore();
  // the rail's inner lip against the felt
  oval(A, B);
  g.lineWidth = 0.6 * ppc;
  g.strokeStyle = 'rgba(0,0,0,0.8)';
  g.stroke();
  TOP = c;
  return c;
};
