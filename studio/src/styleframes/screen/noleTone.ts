import type {ToneModel, TP} from '../../shared/tonal/types';
import {ellipse} from '../../shared/draw/geom';

/**
 * NOLE (screen builder's rig, TONAL format). FRONTAL webcam bust — he always faces his lens.
 * Key light from screen-left (his window), shadow side screen-right. Caricature lives in 2 features:
 * the broad square jaw and the swept-back hair; prop = phone (drawn separately, see nolePhone).
 * Local units like masTone: crown ≈ y-240 (hair top -300), chin ≈ y206 (+jaw drop), bust crop y560,
 * head width ≈ 330, shoulders ±430 (he never fits his tile).
 */
export interface NoleToneParams {
  /** Pupils -1..1. */
  lookX?: number;
  lookY?: number;
  /** 0 open .. 1 closed. */
  lid?: number;
  /** Replacement mouth. */
  mouth?: NoleMouth;
  /** Brow: -1 furrowed/angry .. 1 raised. */
  brow?: number;
  /** Head tilt degrees. */
  tilt?: number;
}
export type NoleMouth = 'rest' | 'grin' | 'ah' | 'ee' | 'oh' | 'mm' | 'eh';

export const NOLE_HUES = {
  skin: '#CC9C80',
  shade: '#B78469',
  lip: '#A96A5C',
  hair: '#2B2421',
  brow: '#1F1917',
  eye: '#E6DED6',
  iris: '#56655A',
  pupil: '#0B0B0C',
  teeth: '#F1EBE0',
  mouth: '#1A0E0E',
  tee: '#1C1D22',
  neck: '#BF8E73',
};

const JAW: Record<NoleMouth, number> = {rest: 0, mm: 0, grin: 4, ee: 6, eh: 12, ah: 22, oh: 16};

export const noleTone = (p: NoleToneParams = {}): ToneModel => {
  const {lookX = 0, lookY = 0, lid = 0.1, mouth = 'rest', brow = -0.3, tilt = 0} = p;
  const T: TP[] = [];
  const add = (x: TP) => T.push(x);
  const j = JAW[mouth];
  const head = `rotate(${tilt} 0 180)`;

  // ---------------- torso: black tee, very broad ----------------
  add({hue: 'tee', tone: 2, d: 'M -440 560 C -440 430 -410 346 -300 306 C -220 280 -150 262 -104 246 L 104 246 C 150 262 220 280 300 306 C 410 346 440 430 440 560 Z'});
  add({hue: 'tee', tone: 1, angle: 110, d: 'M 440 560 C 440 430 410 346 300 306 C 240 286 180 270 130 256 C 190 300 250 380 262 560 Z'});
  add({hue: 'tee', tone: 0, angle: 110, d: 'M 440 560 C 440 470 426 410 392 370 C 404 430 410 500 406 560 Z'});
  add({hue: 'tee', tone: 3, angle: 60, d: 'M -420 420 C -404 360 -360 322 -290 300 C -230 282 -170 268 -130 256 C -200 290 -300 320 -350 360 C -384 388 -404 404 -420 420 Z'});
  add({hue: 'tee', tone: 4, light: true, d: 'M -400 372 C -370 336 -320 312 -262 296 C -310 316 -356 340 -392 380 Z'});
  // chest fold shadows
  add({hue: 'tee', tone: 1, d: 'M -170 420 C -120 400 -60 396 -10 404 C -60 410 -120 420 -170 440 Z'});
  // crew neck
  add({hue: 'tee', tone: 0, d: 'M -112 244 C -80 300 80 300 112 244 C 104 276 60 312 0 312 C -60 312 -104 276 -112 244 Z'});
  add({hue: 'tee', tone: 3, d: 'M -112 244 C -100 262 -84 276 -64 288 C -90 284 -106 266 -112 244 Z'});

  // ---------------- neck (thick) ----------------
  add({hue: 'neck', tone: 2, d: 'M -90 110 C -92 170 -100 220 -108 250 C -60 290 60 290 108 250 C 100 220 92 170 90 110 Z'});
  add({hue: 'neck', tone: 3, d: 'M -90 110 C -92 170 -100 220 -108 250 C -86 262 -64 270 -44 274 C -52 220 -60 170 -60 120 Z'});
  add({hue: 'neck', tone: 1, angle: 100, d: 'M 90 110 C 92 170 100 220 108 250 C 86 262 62 270 40 274 C 56 230 60 180 58 120 Z'});
  // cast shadow of the jaw on the neck
  add({hue: 'neck', tone: 0, d: `M -100 ${150 + j * 0.6} C -60 ${212 + j} 60 ${212 + j} 100 ${150 + j * 0.6} L 100 ${196 + j} C 60 ${240 + j} -60 ${240 + j} -100 ${196 + j} Z`});
  // sternocleidomastoid hint
  add({hue: 'neck', tone: 1, line: 3, d: 'M 44 170 C 36 200 20 232 8 262'});

  const Hd = (x: TP) => add({...x, transform: head});

  // ---------------- ears ----------------
  Hd({hue: 'skin', tone: 3, d: 'M -156 -46 C -184 -58 -196 -14 -190 20 C -186 50 -172 70 -154 62 Z'});
  Hd({hue: 'skin', tone: 1, d: 'M -168 -24 C -178 -12 -178 18 -170 36 C -166 18 -166 -4 -168 -24 Z'});
  Hd({hue: 'skin', tone: 1, d: 'M 156 -46 C 184 -58 196 -14 190 20 C 186 50 172 70 154 62 Z'});
  Hd({hue: 'skin', tone: 0, d: 'M 168 -24 C 178 -12 178 18 170 36 C 166 18 166 -4 168 -24 Z'});

  // ---------------- head: square jaw silhouette (lit) ----------------
  const cy = 204 + j; // chin bottom
  Hd({hue: 'skin', tone: 3, d: `M 0 -238 C 72 -240 130 -214 150 -170 C 162 -140 164 -100 162 -60 C 166 -40 168 -10 164 20 C 162 60 156 100 150 ${128 + j * 0.5} C 144 ${152 + j * 0.8} 124 ${170 + j} 96 ${186 + j} C 72 ${198 + j} 44 ${cy} 0 ${cy} C -44 ${cy} -72 ${198 + j} -96 ${186 + j} C -124 ${170 + j} -144 ${152 + j * 0.8} -150 ${128 + j * 0.5} C -156 100 -162 60 -164 20 C -168 -10 -166 -40 -162 -60 C -164 -100 -162 -140 -150 -170 C -130 -214 -72 -240 0 -238 Z`});
  // shadow side (screen-right), terminator down the cheek to the jaw corner
  Hd({hue: 'skin', tone: 1, angle: 95, d: `M 150 -170 C 122 -120 110 -64 106 -14 C 102 40 108 90 128 ${136 + j * 0.6} C 118 ${160 + j} 108 ${172 + j} 96 ${186 + j} C 124 ${170 + j} 144 ${152 + j * 0.8} 150 ${128 + j * 0.5} C 156 100 162 60 164 20 C 168 -10 166 -40 162 -60 C 164 -100 162 -140 150 -170 Z`});
  // half-tone band along the terminator
  Hd({hue: 'skin', tone: 2, angle: 95, d: `M 118 -196 C 90 -130 78 -70 76 -14 C 74 44 82 96 100 ${146 + j * 0.7} C 104 ${160 + j} 102 ${170 + j} 96 ${186 + j} C 108 ${172 + j} 118 ${160 + j} 128 ${136 + j * 0.6} C 108 90 102 40 106 -14 C 110 -64 122 -120 150 -170 C 142 -182 132 -190 118 -196 Z`});
  // jaw underside plane (square jaw read)
  Hd({hue: 'shade', tone: 1, angle: 0, d: `M -150 ${128 + j * 0.5} C -144 ${152 + j * 0.8} -124 ${170 + j} -96 ${186 + j} C -72 ${198 + j} -44 ${cy} 0 ${cy} C 44 ${cy} 72 ${198 + j} 96 ${186 + j} C 124 ${170 + j} 144 ${152 + j * 0.8} 150 ${128 + j * 0.5} C 140 ${146 + j} 120 ${160 + j} 94 ${172 + j} C 64 ${186 + j} 30 ${192 + j} 0 ${192 + j} C -30 ${192 + j} -64 ${186 + j} -94 ${172 + j} C -120 ${160 + j} -140 ${146 + j} -150 ${128 + j * 0.5} Z`});
  // lit cheekbone + temple highlight (window light)
  Hd({hue: 'skin', tone: 4, d: 'M -146 -24 C -128 -34 -104 -30 -92 -16 C -108 -6 -128 -2 -146 -6 Z'});
  Hd({hue: 'skin', tone: 4, d: 'M -120 -196 C -90 -218 -50 -226 -14 -226 C -60 -214 -96 -196 -116 -176 Z'});
  // cheek hollow under the cheekbone
  Hd({hue: 'skin', tone: 2, angle: 70, d: 'M -146 30 C -132 50 -118 76 -110 100 C -122 90 -136 66 -150 48 Z'});
  // forehead brow ridge shadow
  Hd({hue: 'skin', tone: 2, angle: 0, d: 'M -126 -92 C -80 -104 -30 -100 0 -92 C 30 -100 80 -104 126 -92 C 90 -86 40 -84 0 -80 C -40 -84 -90 -86 -126 -92 Z'});
  // deep-set eye sockets
  Hd({hue: 'skin', tone: 2, angle: 20, d: 'M -112 -64 C -92 -78 -40 -78 -24 -62 C -22 -40 -34 -18 -64 -16 C -94 -16 -112 -34 -112 -64 Z'});
  Hd({hue: 'skin', tone: 1, angle: 20, d: 'M 112 -64 C 92 -78 40 -78 24 -62 C 22 -40 34 -18 64 -16 C 94 -16 112 -34 112 -64 Z'});
  // nose: bridge light, shadow side plane, tip, wings, nostrils, cast shadow
  Hd({hue: 'skin', tone: 2, angle: 80, d: 'M 10 -44 C 20 -4 28 28 38 58 C 30 68 20 72 10 72 C 16 40 14 0 4 -44 Z'});
  Hd({hue: 'skin', tone: 4, d: 'M -12 -40 C -16 -4 -18 26 -20 50 L -10 52 C -8 20 -6 -10 -4 -40 Z'});
  Hd({hue: 'skin', tone: 3, d: ellipse(0, 60, 24, 16)});
  Hd({hue: 'skin', tone: 2, d: 'M 14 58 C 30 52 44 60 44 74 C 36 80 24 80 16 76 Z'});
  Hd({hue: 'skin', tone: 3, d: 'M -14 58 C -30 52 -44 60 -44 74 C -36 80 -24 80 -16 76 Z'});
  Hd({hue: 'skin', tone: 4, d: ellipse(-6, 54, 8, 5)});
  Hd({hue: 'pupil', tone: 0, d: ellipse(-17, 76, 8, 3.6)});
  Hd({hue: 'pupil', tone: 0, d: ellipse(17, 76, 8, 3.6)});
  Hd({hue: 'skin', tone: 1, angle: 0, d: 'M -18 86 C 6 92 34 90 54 76 C 44 94 14 100 -14 96 Z'});
  // nasolabial folds
  Hd({hue: 'shade', tone: 2, line: 2.6, d: `M -40 80 C -54 94 -60 ${108 + j * 0.4} -62 ${124 + j * 0.6}`});
  Hd({hue: 'shade', tone: 1, line: 3, d: `M 40 80 C 54 94 60 ${108 + j * 0.4} 62 ${124 + j * 0.6}`});
  // chin highlight + cleft
  Hd({hue: 'skin', tone: 4, d: `M -52 ${176 + j} C -34 ${190 + j} -8 ${194 + j} 8 ${192 + j} C -12 ${184 + j} -32 ${178 + j} -52 ${176 + j} Z`});
  Hd({hue: 'shade', tone: 1, line: 3, d: `M 4 ${166 + j} C 6 ${174 + j} 6 ${180 + j} 4 ${186 + j}`});

  // ---------------- eyes: narrowed, intense ----------------
  const eyes = [
    {cx: -64, cy: -40, rx: 26, ry: 12},
    {cx: 64, cy: -40, rx: 26, ry: 12},
  ];
  eyes.forEach((e, idx) => {
    const almond = `M ${e.cx - e.rx} ${e.cy + 1} C ${e.cx - e.rx * 0.5} ${e.cy - e.ry * 1.3} ${e.cx + e.rx * 0.5} ${e.cy - e.ry * 1.3} ${e.cx + e.rx} ${e.cy + 1} C ${e.cx + e.rx * 0.5} ${e.cy + e.ry * 1.1} ${e.cx - e.rx * 0.5} ${e.cy + e.ry * 1.1} ${e.cx - e.rx} ${e.cy + 1} Z`;
    Hd({hue: 'eye', tone: idx === 0 ? 3 : 2, d: almond});
    const px = e.cx + lookX * e.rx * 0.45;
    const py = e.cy + lookY * e.ry * 0.35;
    Hd({hue: 'iris', tone: 1, d: ellipse(px, py, 11.5, 11.5)});
    Hd({hue: 'pupil', tone: 0, d: ellipse(px, py, 5, 5)});
    Hd({hue: 'eye', tone: 4, light: true, d: ellipse(px - 3.5, py - 3.5, 2.6, 2.6)});
    const drop = lid * e.ry * 2.3;
    Hd({hue: 'skin', tone: idx === 0 ? 2 : 1, d: `M ${e.cx - e.rx - 2} ${e.cy + 1} C ${e.cx - e.rx * 0.5} ${e.cy - e.ry * 1.45} ${e.cx + e.rx * 0.5} ${e.cy - e.ry * 1.45} ${e.cx + e.rx + 2} ${e.cy + 1} L ${e.cx + e.rx + 2} ${e.cy + 1 + drop * 0.3} C ${e.cx + e.rx * 0.5} ${e.cy - e.ry * 1.1 + drop} ${e.cx - e.rx * 0.5} ${e.cy - e.ry * 1.1 + drop} ${e.cx - e.rx - 2} ${e.cy + 1 + drop * 0.3} Z`});
    Hd({hue: 'pupil', tone: 0, line: 5, d: `M ${e.cx - e.rx - 3} ${e.cy + 2} C ${e.cx - e.rx * 0.5} ${e.cy - e.ry * 1.3 + drop} ${e.cx + e.rx * 0.5} ${e.cy - e.ry * 1.3 + drop} ${e.cx + e.rx + 3} ${e.cy + 2}`});
    Hd({hue: 'shade', tone: 1, line: 2.4, d: `M ${e.cx - e.rx * 0.8} ${e.cy + e.ry * 1.2} C ${e.cx - e.rx * 0.2} ${e.cy + e.ry * 1.7} ${e.cx + e.rx * 0.4} ${e.cy + e.ry * 1.6} ${e.cx + e.rx * 0.9} ${e.cy + e.ry * 1.1}`});
  });
  // brows: heavy, straight; brow<0 pulls inner ends down (intensity)
  const lift = brow * 15;
  const inner = Math.min(0, brow) * 12 - Math.max(0, brow) * 6;
  Hd({hue: 'brow', tone: 0, d: `M -134 ${-72 - lift} C -112 ${-88 - lift} -72 ${-92 - lift} -26 ${-80 - lift - inner} L -24 ${-66 - lift - inner} C -66 ${-76 - lift} -108 ${-74 - lift} -132 ${-62 - lift} Z`});
  Hd({hue: 'brow', tone: 0, d: `M 134 ${-72 - lift} C 112 ${-88 - lift} 72 ${-92 - lift} 26 ${-80 - lift - inner} L 24 ${-66 - lift - inner} C 66 ${-76 - lift} 108 ${-74 - lift} 132 ${-62 - lift} Z`});
  // glabella crease when furrowed
  if (brow < -0.2) Hd({hue: 'shade', tone: 1, line: 3, d: 'M -10 -74 C -12 -62 -12 -52 -8 -44 M 10 -74 C 12 -62 12 -52 8 -44'});

  // ---------------- mouth (replacement set, jaw drops the chin) ----------------
  const my = 124 + j * 0.35;
  if (mouth === 'rest' || mouth === 'mm') {
    const press = mouth === 'mm' ? 3 : 0;
    Hd({hue: 'lip', tone: 1, d: `M -54 ${my} C -24 ${my - 8 + press} 24 ${my - 8 + press} 54 ${my} C 24 ${my - 1} -24 ${my - 1} -54 ${my} Z`});
    Hd({hue: 'lip', tone: 3, d: `M -38 ${my + 3} C -14 ${my + 16 - press} 14 ${my + 16 - press} 38 ${my + 3} C 14 ${my + 7} -14 ${my + 7} -38 ${my + 3} Z`});
    Hd({hue: 'mouth', tone: 0, line: 4, d: `M -56 ${my} C -24 ${my + 3} 24 ${my + 3} 56 ${my}`});
  } else {
    const shapes: Record<string, {w: number; top: number; bot: number; teethTop: number; teethBot: number; round: number}> = {
      grin: {w: 74, top: -6, bot: 32, teethTop: 17, teethBot: 9, round: 0.15},
      ee: {w: 66, top: -5, bot: 24, teethTop: 13, teethBot: 8, round: 0.1},
      eh: {w: 58, top: -9, bot: 34, teethTop: 12, teethBot: 6, round: 0.4},
      ah: {w: 52, top: -11, bot: 50, teethTop: 10, teethBot: 0, round: 0.7},
      oh: {w: 32, top: -15, bot: 38, teethTop: 5, teethBot: 0, round: 1},
    };
    const s = shapes[mouth];
    const L = -s.w;
    const R = s.w;
    const up = mouth === 'grin' ? -12 : mouth === 'ee' ? -4 : 0; // corners up on the grin
    const outer = `M ${L} ${my + up} C ${L * (0.6 - s.round * 0.2)} ${my + s.top} ${R * (0.6 - s.round * 0.2)} ${my + s.top} ${R} ${my + up} C ${R * (0.7 - s.round * 0.3)} ${my + s.bot} ${L * (0.7 - s.round * 0.3)} ${my + s.bot} ${L} ${my + up} Z`;
    Hd({hue: 'mouth', tone: 0, d: outer});
    if (s.teethTop > 0)
      Hd({hue: 'teeth', tone: 4, d: `M ${L * 0.86} ${my + up * 0.8 - 1} C ${L * 0.5} ${my + s.top + 2} ${R * 0.5} ${my + s.top + 2} ${R * 0.86} ${my + up * 0.8 - 1} C ${R * 0.5} ${my + s.top + s.teethTop + 4} ${L * 0.5} ${my + s.top + s.teethTop + 4} ${L * 0.86} ${my + up * 0.8 - 1} Z`});
    if (s.teethBot > 0)
      Hd({hue: 'teeth', tone: 3, d: `M ${L * 0.6} ${my + s.bot * 0.7} C ${L * 0.3} ${my + s.bot * 0.7 - s.teethBot} ${R * 0.3} ${my + s.bot * 0.7 - s.teethBot} ${R * 0.6} ${my + s.bot * 0.7} C ${R * 0.3} ${my + s.bot * 0.9} ${L * 0.3} ${my + s.bot * 0.9} ${L * 0.6} ${my + s.bot * 0.7} Z`});
    if (mouth === 'ah' || mouth === 'oh') Hd({hue: 'lip', tone: 1, d: ellipse(4, my + s.bot * 0.62, s.w * 0.45, s.bot * 0.18)});
    // upper lip + lower lip planes
    Hd({hue: 'lip', tone: 1, d: `M ${L - 4} ${my + up} C ${L * 0.6} ${my + s.top - 5} ${R * 0.6} ${my + s.top - 5} ${R + 4} ${my + up} C ${R * 0.6} ${my + s.top - 1} ${L * 0.6} ${my + s.top - 1} ${L - 4} ${my + up} Z`});
    Hd({hue: 'lip', tone: 3, d: `M ${L * 0.7} ${my + s.bot * 0.9} C ${L * 0.3} ${my + s.bot + 10} ${R * 0.3} ${my + s.bot + 10} ${R * 0.7} ${my + s.bot * 0.9} C ${R * 0.3} ${my + s.bot + 3} ${L * 0.3} ${my + s.bot + 3} ${L * 0.7} ${my + s.bot * 0.9} Z`});
  }

  // ---------------- hair: dark, swept back, volume on top ----------------
  Hd({hue: 'hair', tone: 1, d: 'M -156 -104 C -178 -196 -118 -296 0 -300 C 118 -296 178 -196 156 -104 C 150 -128 138 -158 116 -174 C 84 -192 44 -196 0 -192 C -44 -196 -84 -192 -116 -174 C -138 -158 -150 -128 -156 -104 Z'});
  // receding temples (hairline M-shape) + widow's peak
  Hd({hue: 'skin', tone: 3, d: 'M -116 -174 C -100 -186 -82 -190 -70 -186 C -80 -176 -96 -170 -116 -160 Z'});
  Hd({hue: 'hair', tone: 0, angle: 120, d: 'M 156 -104 C 178 -196 118 -296 0 -300 C 80 -280 128 -220 132 -150 C 146 -140 152 -122 156 -104 Z'});
  Hd({hue: 'hair', tone: 2, angle: 100, d: 'M -150 -140 C -160 -214 -100 -282 -10 -290 C -90 -262 -128 -210 -134 -150 Z'});
  // swept-back comb streaks (catch the window light)
  const streaks = [
    'M -96 -186 C -110 -230 -80 -272 -30 -286',
    'M -56 -194 C -64 -240 -40 -278 6 -290',
    'M -16 -196 C -18 -244 6 -278 44 -284',
    'M 26 -196 C 30 -238 54 -268 88 -272',
    'M 66 -190 C 76 -226 100 -250 124 -250',
  ];
  streaks.forEach((d, i) => Hd({hue: 'hair', tone: i < 2 ? 3 : 2, line: i < 2 ? 5 : 4, light: i === 0, d}));
  Hd({hue: 'hair', tone: 4, light: true, d: 'M -110 -238 C -86 -272 -40 -290 -4 -292 C -46 -278 -80 -258 -100 -226 Z'});
  // short sides above the ears
  Hd({hue: 'hair', tone: 1, d: 'M -164 -60 C -170 -90 -166 -120 -156 -104 C -152 -86 -154 -70 -150 -54 Z'});
  Hd({hue: 'hair', tone: 0, d: 'M 164 -60 C 170 -90 166 -120 156 -104 C 152 -86 154 -70 150 -54 Z'});

  return {paths: T, hues: NOLE_HUES, box: [-440, -310, 880, 870]};
};

/** Viseme track for "I came up with the name!" (frames relative to speech start). */
export const NOLE_LINE: {at: number; m: NoleMouth}[] = [
  {at: 0, m: 'ah'}, // I
  {at: 2, m: 'ee'},
  {at: 4, m: 'eh'}, // came
  {at: 6, m: 'ee'},
  {at: 8, m: 'mm'},
  {at: 10, m: 'ah'}, // up
  {at: 12, m: 'mm'},
  {at: 14, m: 'oh'}, // with
  {at: 16, m: 'ee'},
  {at: 18, m: 'eh'}, // the
  {at: 20, m: 'ee'}, // NAME
  {at: 22, m: 'eh'},
  {at: 24, m: 'ah'},
  {at: 27, m: 'mm'},
  {at: 29, m: 'grin'},
];

/** Caption words with their start frame (relative to speech start). */
export const NOLE_WORDS: {w: string; at: number}[] = [
  {w: 'I', at: 0},
  {w: 'came', at: 4},
  {w: 'up', at: 10},
  {w: 'with', at: 14},
  {w: 'the', at: 18},
  {w: 'name!', at: 20},
];
