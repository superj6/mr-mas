// @ts-nocheck -- Node-only dev tool: wireframe of the layout through a camera (composition check, no GL).
//   npx esbuild src/dev/range/p3/tools/sketch.ts --bundle --platform=node --outfile=$SP/sk.js && node $SP/sk.js $SP/sk.png [side|pov|turn|glide:t]
import {writePNG} from '../../../../shared/pixel/png';
import {Cam, project, SIDE_CAM, POV_CAM, WIN_CAM, REFL_EYE_W, MON_CAM, outCam, glideCam, turnCam, TABLE, SEATS, CANDLES, CANDLE_H, MONITOR, WINDOW, MAS_GLASS, PLACES, WALL_Z, END_X, NW, NH, V3} from '../layout';
import {spriteRect} from '../sprites-geo';

const mode = process.argv[3] || 'pov';
const cam: Cam = mode === 'side' ? SIDE_CAM : mode === 'win' ? WIN_CAM : mode === 'mon' ? MON_CAM : mode.startsWith('out') ? outCam(Number(mode.split(':')[1])) : mode === 'turn' ? turnCam(1) : mode.startsWith('glide') ? glideCam(Number(mode.split(':')[1])) : POV_CAM;
const c = new Uint32Array(NW * NH).fill(0x0b0d18);
const plot = (x, y, col) => { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < NW && y < NH) c[y * NW + x] = col; };
const seg = (a: V3, b: V3, col, n = 200) => { for (let i = 0; i <= n; i++) { const t = i / n; const p = project(cam, [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]); if (p) plot(p[0], p[1], col); } };
const {x0, x1, z0, z1, top, hem} = TABLE;
// floor grid + walls
for (let x = -2; x <= 5; x += 0.5) seg([x, 0, WALL_Z], [x, 0, 2.6], 0x1c2442);
for (let z = WALL_Z; z <= 2.6; z += 0.5) seg([-2, 0, z], [END_X, 0, z], 0x1c2442);
for (let y = 0; y <= 2.8; y += 0.4) { seg([-2, y, WALL_Z], [END_X, y, WALL_Z], 0x273156); seg([END_X, y, WALL_Z], [END_X, y, 2.6], 0x273156); }
// table top + drape
seg([x0, top, z0], [x1, top, z0], 0xefe8cf); seg([x0, top, z1], [x1, top, z1], 0xefe8cf); seg([x0, top, z0], [x0, top, z1], 0xefe8cf); seg([x1, top, z0], [x1, top, z1], 0xefe8cf);
seg([x0, hem, z1], [x1, hem, z1], 0x8f8a7a); seg([x0, hem, z0], [x1, hem, z0], 0x8f8a7a);
// places, candles, monitor, window
for (const p of PLACES) for (let a = 0; a < 6.3; a += 0.05) { const q = project(cam, [p.x + Math.cos(a) * 0.13, top + 0.01, p.z + Math.sin(a) * 0.13]); if (q) plot(q[0], q[1], 0xcfc6a8); }
for (const k of CANDLES) seg([k[0], top, k[2]], [k[0], top + CANDLE_H + 0.04, k[2]], 0xfbc15e, 40);
const m = MONITOR; seg([m.c[0], m.c[1] - m.h / 2, -m.w / 2], [m.c[0], m.c[1] - m.h / 2, m.w / 2], 0x3fcacb); seg([m.c[0], m.c[1] + m.h / 2, -m.w / 2], [m.c[0], m.c[1] + m.h / 2, m.w / 2], 0x3fcacb);
seg([m.c[0], m.c[1] - m.h / 2, -m.w / 2], [m.c[0], m.c[1] + m.h / 2, -m.w / 2], 0x3fcacb); seg([m.c[0], m.c[1] - m.h / 2, m.w / 2], [m.c[0], m.c[1] + m.h / 2, m.w / 2], 0x3fcacb);
const wn = WINDOW; for (const [a, b] of [[[-1, -1], [1, -1]], [[1, -1], [1, 1]], [[1, 1], [-1, 1]], [[-1, 1], [-1, -1]]]) seg([wn.c[0], wn.c[1] + a[1] * wn.h / 2, wn.c[2] + a[0] * wn.w / 2], [wn.c[0], wn.c[1] + b[1] * wn.h / 2, wn.c[2] + b[0] * wn.w / 2], 0x6f82b8);
{ const g = project(cam, MAS_GLASS); if (g) for (let j = -40; j < 0; j++) for (let i = -14; i < 14; i++) if (Math.abs(i) > 11 || j < -38) plot(g[0] + i, g[1] + j, 0xb0243a); }
// sprites (rects on the native grid)
for (const s of SEATS) { const r = spriteRect(cam, s); if (!r) continue; for (let i = 0; i < r.w; i++) { plot(r.x + i, r.y, s.rim); plot(r.x + i, r.y + r.h - 1, s.rim); } for (let j = 0; j < r.h; j++) { plot(r.x, r.y + j, s.rim); plot(r.x + r.w - 1, r.y + j, s.rim); } }
// the window's mirror image of the table, its flames and his eye
const rx = (x: number) => 2 * WINDOW.c[0] - x;
seg([rx(x0), top, z0], [rx(x1), top, z0], 0x806a50); seg([rx(x0), top, z1], [rx(x1), top, z1], 0x806a50); seg([rx(x0), top, z0], [rx(x0), top, z1], 0x806a50);
for (const k of CANDLES) seg([rx(k[0]), top, k[2]], [rx(k[0]), top + CANDLE_H + 0.04, k[2]], 0xa08040, 40);
{ const e = project(cam, REFL_EYE_W); if (e) for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) plot(e[0] + i, e[1] + j, 0xff40ff); }
writePNG(process.argv[2], NW, NH, c, 2);
