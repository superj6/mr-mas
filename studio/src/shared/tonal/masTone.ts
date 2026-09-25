import type {ToneModel, TP} from './types';
import {ellipse} from '../draw/geom';

/**
 * MAS MANALT: tonal bust, three-quarter view facing screen-right, key light from screen-right
 * (his monitor). Semi-real proportions; caricature lives in 2 features only: slightly large, calm,
 * unblinking eyes and the forward cowlick. Local units: crown y-230, chin y188, bust crop y560.
 */
export interface MasToneParams {
  /** Pupil offset -1..1 (x>0 = toward screen-right / his monitor, x<0 = toward camera-left). */
  lookX?: number;
  lookY?: number;
  /** 0 open .. 1 closed. */
  lid?: number;
  /** Mouth shape. */
  mouth?: 'rest' | 'smile' | 'open' | 'o';
  /** Brow lift -1..1. */
  brow?: number;
  /** Head tilt degrees (around the neck). */
  tilt?: number;
  /** Head turn toward camera 0..1 (small shift of features; 0 = 3/4 view). */
  turn?: number;
}

export const MAS_HUES = {
  skin: '#D9A78A',
  lip: '#B8736A',
  hair: '#4E3A2A',
  brow: '#3E2E22',
  eye: '#EDE6DC',
  iris: '#5E7F5A',
  pupil: '#0E1012',
  hoodie: '#7D828B',
  string: '#E6E6E6',
  neck: '#CF9C80',
};

export const masTone = (p: MasToneParams = {}): ToneModel => {
  const {lookX = 0.25, lookY = 0.05, lid = 0.12, mouth = 'rest', brow = 0.15, tilt = 0, turn = 0} = p;
  const T: TP[] = [];
  const add = (x: TP) => T.push(x);
  const fx = (x: number) => x - turn * 18; // features slide toward camera as he turns
  const head = `rotate(${tilt} 0 170)`;

  // ---------------- torso (hoodie) ----------------
  add({transform: 'translate(0 -36)', hue: 'hoodie', tone: 2, d: 'M -250 560 C -258 410 -236 312 -150 262 C -96 232 96 228 160 256 C 244 296 266 410 262 560 Z'});
  add({transform: 'translate(0 -36)', hue: 'hoodie', tone: 1, angle: 70, d: 'M -250 560 C -258 410 -236 312 -150 262 C -120 248 -96 242 -70 240 C -120 300 -150 420 -128 560 Z'});
  add({transform: 'translate(0 -36)', hue: 'hoodie', tone: 0, angle: 70, d: 'M -250 560 C -254 470 -246 400 -222 350 C -214 420 -214 500 -206 560 Z'});
  add({transform: 'translate(0 -36)', hue: 'hoodie', tone: 3, angle: 110, d: 'M 176 266 C 236 300 256 380 260 470 L 238 470 C 232 392 214 324 170 290 Z'});
  // hood collar ring
  add({transform: 'translate(0 -36)', hue: 'hoodie', tone: 2, d: 'M -150 262 C -140 204 -60 196 16 232 C 86 196 166 198 178 262 C 156 300 86 300 18 292 C -52 302 -134 298 -150 262 Z'});
  add({transform: 'translate(0 -36)', hue: 'hoodie', tone: 1, angle: 20, d: 'M -150 262 C -140 204 -60 196 16 232 C -40 232 -90 252 -118 292 C -136 286 -148 276 -150 262 Z'});
  add({transform: 'translate(0 -36)', hue: 'hoodie', tone: 3, d: 'M 70 212 C 118 200 164 214 176 250 C 150 234 110 226 72 226 Z'});
  add({transform: 'translate(0 -36)', hue: 'hoodie', tone: 0, d: 'M -28 262 C 2 286 50 288 84 262 C 66 296 -6 298 -28 262 Z'});
  // drawstrings
  add({transform: 'translate(0 -36)', hue: 'string', tone: 3, line: 6, d: 'M 4 290 C 0 330 -4 362 -6 396'});
  add({transform: 'translate(0 -36)', hue: 'string', tone: 2, line: 6, d: 'M 58 290 C 62 326 66 352 68 384'});

  // ---------------- neck ----------------
  add({hue: 'neck', tone: 2, d: 'M -40 110 C -34 160 -30 200 -26 236 L 70 236 C 68 206 70 176 78 126 Z'});
  add({hue: 'neck', tone: 1, angle: 10, d: 'M -40 110 C -34 160 -30 200 -26 236 L 12 236 C 6 210 0 190 -2 170 C -18 156 -32 134 -40 110 Z'});
  add({hue: 'neck', tone: 0, angle: 10, d: 'M -8 150 C 20 176 54 176 78 150 L 76 170 C 50 196 16 194 -4 176 Z'});
  add({hue: 'neck', tone: 3, d: 'M 56 180 C 62 200 64 220 64 236 L 70 236 C 68 214 68 196 72 176 Z'});

  // ---------------- head (tilt group) ----------------
  const H = (x: TP) => add({...x, transform: head});
  // skull + face silhouette, lit skin
  H({hue: 'skin', tone: 3, d: 'M 0 -230 C 60 -232 118 -200 140 -150 C 156 -115 160 -85 158 -60 C 156 -45 150 -38 150 -30 C 152 -12 162 0 160 14 C 158 36 152 52 148 66 C 142 96 130 118 116 136 C 104 152 92 164 78 170 C 66 175 54 176 42 174 C 6 166 -32 146 -60 118 C -76 102 -88 86 -96 70 C -122 50 -148 20 -154 -20 C -162 -80 -150 -160 -110 -200 C -80 -224 -40 -230 0 -230 Z'});
  // form shadow: the side turned away from the monitor (terminator runs just in front of the ear)
  H({hue: 'skin', tone: 1, angle: 80, d: 'M -154 -20 C -162 -80 -150 -160 -110 -200 C -86 -220 -64 -227 -44 -229 C -60 -170 -76 -110 -78 -50 C -80 0 -70 50 -48 92 C -30 126 -4 152 30 172 C 10 168 -28 150 -60 118 C -76 102 -88 86 -96 70 C -122 50 -148 20 -154 -20 Z'});
  // half-tone band along the terminator (soft turn of the form)
  H({hue: 'skin', tone: 2, angle: 80, d: 'M -44 -229 C -30 -190 -30 -140 -38 -90 C -46 -40 -44 10 -30 52 C -14 96 12 132 50 160 C 44 168 38 172 30 172 C -4 152 -30 126 -48 92 C -70 50 -80 0 -78 -50 C -76 -110 -60 -170 -44 -229 Z'});
  // nose silhouette breaking the far contour
  H({hue: 'skin', tone: 3, d: `M ${fx(136)} -26 C ${fx(148)} 4 ${fx(162)} 36 ${fx(170)} 56 C ${fx(168)} 66 ${fx(156)} 74 ${fx(140)} 74 Z`});
  // eye sockets
  H({hue: 'skin', tone: 2, angle: 30, d: `M ${fx(-18)} -46 C ${fx(4)} -62 ${fx(52)} -62 ${fx(66)} -44 C ${fx(70)} -24 ${fx(62)} -4 ${fx(40)} 2 C ${fx(14)} 4 ${fx(-12)} -10 ${fx(-18)} -46 Z`});
  H({hue: 'skin', tone: 2, angle: 30, d: `M ${fx(96)} -48 C ${fx(114)} -60 ${fx(142)} -58 ${fx(150)} -40 C ${fx(152)} -20 ${fx(144)} -4 ${fx(126)} 0 C ${fx(106)} 0 ${fx(94)} -20 ${fx(96)} -48 Z`});
  // nose: shadow side plane + cast shadow under the nose
  H({hue: 'skin', tone: 2, angle: 60, d: `M ${fx(90)} -30 C ${fx(96)} 0 ${fx(102)} 32 ${fx(108)} 58 C ${fx(114)} 66 ${fx(122)} 70 ${fx(130)} 70 C ${fx(116)} 58 ${fx(108)} 30 ${fx(100)} -24 Z`});
  H({hue: 'skin', tone: 2, angle: 20, d: `M ${fx(112)} 76 C ${fx(124)} 82 ${fx(138)} 82 ${fx(148)} 78 C ${fx(140)} 86 ${fx(124)} 88 ${fx(110)} 84 Z`});
  H({hue: 'skin', tone: 1, d: ellipse(fx(134), 71, 5, 3)});
  // cheekbone hollow + jaw shadow
  H({hue: 'skin', tone: 2, angle: 60, d: `M ${fx(58)} 56 C ${fx(84)} 64 ${fx(118)} 74 ${fx(142)} 98 C ${fx(134)} 114 ${fx(124)} 124 ${fx(114)} 130 C ${fx(100)} 106 ${fx(78)} 82 ${fx(58)} 56 Z`});
  // chin cleft shading + under lip
  H({hue: 'skin', tone: 2, angle: 0, d: `M ${fx(66)} 132 C ${fx(84)} 126 ${fx(106)} 128 ${fx(116)} 132 C ${fx(108)} 140 ${fx(86)} 142 ${fx(66)} 132 Z`});
  // highlights (monitor light)
  H({hue: 'skin', tone: 4, d: 'M 70 -150 C 104 -144 130 -124 142 -100 C 124 -110 98 -126 70 -136 Z'});
  H({hue: 'skin', tone: 4, d: `M ${fx(146)} 20 C ${fx(156)} 34 ${fx(164)} 46 ${fx(166)} 54 C ${fx(158)} 52 ${fx(150)} 40 ${fx(146)} 20 Z`});
  H({hue: 'skin', tone: 4, light: true, d: 'M 148 -2 C 156 12 156 30 152 44 C 148 30 146 14 148 -2 Z'});
  H({hue: 'skin', tone: 4, d: `M ${fx(84)} 150 C ${fx(94)} 146 ${fx(104)} 148 ${fx(108)} 152 C ${fx(100)} 158 ${fx(90)} 158 ${fx(84)} 150 Z`});
  // ear (in shadow)
  H({hue: 'skin', tone: 1, d: 'M -72 -30 C -100 -44 -118 -10 -114 24 C -110 52 -96 70 -80 66 C -70 50 -66 10 -72 -30 Z'});
  H({hue: 'skin', tone: 0, d: 'M -84 -14 C -98 -8 -102 18 -96 38 C -90 30 -88 10 -84 -14 Z'});
  H({hue: 'skin', tone: 2, d: 'M -72 -30 C -86 -34 -98 -22 -104 -6 C -94 -14 -84 -18 -76 -14 Z'});

  // ---------------- eyes: slightly large, calm, the only caricature ----------------
  const eyes = [
    {cx: fx(22), cy: -22, rx: 30, ry: 15, tilt: -4},
    {cx: fx(122), cy: -24, rx: 18, ry: 13.5, tilt: 4},
  ];
  eyes.forEach((e) => {
    const almond = `M ${e.cx - e.rx} ${e.cy + 2} C ${e.cx - e.rx * 0.55} ${e.cy - e.ry * 1.25} ${e.cx + e.rx * 0.45} ${e.cy - e.ry * 1.35} ${e.cx + e.rx} ${e.cy - 2} C ${e.cx + e.rx * 0.5} ${e.cy + e.ry * 1.05} ${e.cx - e.rx * 0.5} ${e.cy + e.ry * 1.1} ${e.cx - e.rx} ${e.cy + 2} Z`;
    H({hue: 'eye', tone: 3, d: almond});
    const ir = e.ry * 1.02;
    const px = e.cx + lookX * e.rx * 0.45;
    const py = e.cy + 1 + lookY * e.ry * 0.3;
    H({hue: 'iris', tone: 1, d: ellipse(px, py, ir * 0.92 * (e.rx / 30 + 0.3), ir)});
    H({hue: 'pupil', tone: 0, d: ellipse(px, py, ir * 0.42, ir * 0.46)});
    H({hue: 'eye', tone: 4, light: true, d: ellipse(px + ir * 0.4, py - ir * 0.35, ir * 0.22, ir * 0.22)});
    // upper lid shadow on the eyeball + lid (lid param lowers it)
    const lidDrop = lid * e.ry * 2.2;
    H({hue: 'skin', tone: 1, d: `M ${e.cx - e.rx - 2} ${e.cy + 2} C ${e.cx - e.rx * 0.55} ${e.cy - e.ry * 1.3} ${e.cx + e.rx * 0.45} ${e.cy - e.ry * 1.4} ${e.cx + e.rx + 2} ${e.cy - 2} L ${e.cx + e.rx + 2} ${e.cy - 2 + lidDrop * 0.6} C ${e.cx + e.rx * 0.4} ${e.cy - e.ry * 0.9 + lidDrop} ${e.cx - e.rx * 0.5} ${e.cy - e.ry * 0.85 + lidDrop} ${e.cx - e.rx - 2} ${e.cy + 2} Z`});
    // lash line + crease + lower lid
    H({hue: 'pupil', tone: 0, line: 4.5, d: `M ${e.cx - e.rx - 2} ${e.cy + 2} C ${e.cx - e.rx * 0.55} ${e.cy - e.ry * 1.25 + lidDrop} ${e.cx + e.rx * 0.45} ${e.cy - e.ry * 1.35 + lidDrop} ${e.cx + e.rx + 3} ${e.cy - 3}`});
    H({hue: 'skin', tone: 1, line: 2.2, d: `M ${e.cx - e.rx * 0.7} ${e.cy - e.ry * 1.55} C ${e.cx - e.rx * 0.1} ${e.cy - e.ry * 2.05} ${e.cx + e.rx * 0.5} ${e.cy - e.ry * 1.95} ${e.cx + e.rx * 0.95} ${e.cy - e.ry * 1.2}`});
    H({hue: 'skin', tone: 1, line: 1.8, d: `M ${e.cx - e.rx * 0.75} ${e.cy + e.ry * 0.9} C ${e.cx - e.rx * 0.2} ${e.cy + e.ry * 1.35} ${e.cx + e.rx * 0.4} ${e.cy + e.ry * 1.25} ${e.cx + e.rx * 0.85} ${e.cy + e.ry * 0.6}`});
  });
  // brows (filled, tapered)
  const b = brow * 7;
  H({hue: 'brow', tone: 0, d: `M ${fx(-16)} ${-50 - b} C ${fx(2)} ${-66 - b * 1.5} ${fx(36)} ${-70 - b * 1.6} ${fx(62)} ${-60 - b} C ${fx(40)} ${-62 - b} ${fx(10)} ${-58 - b} ${fx(-16)} ${-50 - b} Z`});
  H({hue: 'brow', tone: 0, d: `M ${fx(98)} ${-62 - b} C ${fx(114)} ${-70 - b * 1.4} ${fx(136)} ${-70 - b * 1.2} ${fx(152)} ${-56 - b * 0.6} C ${fx(136)} ${-62 - b} ${fx(116)} ${-62 - b} ${fx(98)} ${-62 - b} Z`});
  // nose contour
  H({hue: 'skin', tone: 1, line: 2.2, d: `M ${fx(128)} 64 C ${fx(140)} 72 ${fx(156)} 72 ${fx(166)} 64`});
  // mouth
  const m = fx(-2);
  if (mouth === 'rest' || mouth === 'smile') {
    const up = mouth === 'smile' ? 6 : 0;
    H({hue: 'lip', tone: 2, d: `M ${m + 66} ${110 - up * 0.3} C ${m + 84} 102 ${m + 108} 102 ${m + 132} ${108 - up} C ${m + 110} 112 ${m + 88} 114 ${m + 66} ${110 - up * 0.3} Z`});
    H({hue: 'lip', tone: 3, d: `M ${m + 70} 112 C ${m + 90} 126 ${m + 114} 124 ${m + 128} ${110 - up} C ${m + 108} 116 ${m + 88} 116 ${m + 70} 112 Z`});
    H({hue: 'pupil', tone: 0, line: 3.2, d: `M ${m + 64} ${110 - up * 0.4} C ${m + 86} 114 ${m + 110} 114 ${m + 134} ${106 - up}`});
  } else {
    const h = mouth === 'o' ? 22 : 14;
    const w = mouth === 'o' ? 22 : 34;
    H({hue: 'pupil', tone: 0, d: ellipse(m + 98, 114, w, h * 0.7)});
    H({hue: 'lip', tone: 2, d: `M ${m + 98 - w - 4} 112 C ${m + 90} ${112 - h * 0.9} ${m + 110} ${112 - h * 0.9} ${m + 98 + w + 4} 110 C ${m + 110} ${112 - h * 0.6} ${m + 88} ${112 - h * 0.6} ${m + 98 - w - 4} 112 Z`});
  }

  // ---------------- hair: short, messy, swept forward; visible forehead ----------------
  H({hue: 'hair', tone: 1, d: 'M -156 -30 C -178 -120 -140 -226 -40 -252 C 30 -270 120 -252 160 -206 C 172 -190 174 -176 166 -168 C 154 -170 144 -164 138 -150 C 130 -164 118 -170 104 -166 C 100 -152 94 -144 88 -138 C 86 -154 78 -166 64 -170 C 40 -174 10 -170 -14 -160 C -40 -150 -60 -132 -70 -110 C -78 -90 -82 -60 -80 -30 C -100 -18 -130 -16 -156 -30 Z'});
  H({hue: 'hair', tone: 0, angle: 60, d: 'M -156 -30 C -178 -120 -140 -226 -40 -252 C -96 -222 -120 -160 -112 -96 C -106 -64 -98 -40 -80 -30 C -100 -18 -130 -16 -156 -30 Z'});
  H({hue: 'hair', tone: 2, angle: 120, d: 'M -40 -244 C 30 -262 116 -244 156 -202 C 166 -190 168 -180 164 -172 C 124 -214 60 -236 -40 -226 Z'});
  H({hue: 'hair', tone: 3, light: true, d: 'M 40 -250 C 92 -248 136 -226 160 -196 C 130 -216 94 -232 46 -238 Z'});
  // forward strands (lit tips)
  H({hue: 'hair', tone: 2, d: 'M 104 -166 C 110 -186 130 -196 150 -192 C 138 -184 126 -170 122 -156 C 116 -162 110 -166 104 -166 Z'});
  H({hue: 'hair', tone: 2, d: 'M 64 -170 C 72 -190 92 -198 110 -192 C 96 -184 90 -168 88 -150 C 82 -160 74 -168 64 -170 Z'});
  // cowlick
  H({hue: 'hair', tone: 1, d: 'M 70 -252 C 86 -300 140 -306 170 -270 C 148 -272 130 -264 122 -250 C 140 -252 160 -242 166 -226 C 136 -242 102 -250 70 -252 Z'});
  H({hue: 'hair', tone: 3, light: true, d: 'M 108 -282 C 124 -296 150 -294 166 -274 C 146 -278 128 -272 114 -264 Z'});
  // sideburn
  H({hue: 'hair', tone: 0, d: 'M -70 -110 C -78 -80 -82 -54 -78 -30 C -70 -44 -64 -78 -60 -104 Z'});

  return {paths: T, hues: MAS_HUES, box: [-270, -310, 540, 870]};
};
