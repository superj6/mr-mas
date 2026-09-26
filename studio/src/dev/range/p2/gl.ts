// MR. MAS — Prototype 2 · THE CLIFF · the 3D renderer (browser; one WebGL2 context on the iGPU, --gl=angle).
// Three instanced shaders and one quad, one palette:
//   SLAB   the extruded room: each instance is a pixel's footprint on its plane, pushed back along the staging ray.
//          Front faces keep the painted colour (rung 0); every face the frame never showed is shaded in whole rungs
//          from the monitor's cyan (the key), plus the plate's vignette in screen space on the native grid. The room
//          stays alive: its LEDs and the city re-read from the plate every frame, the Orb keeps its bob.
//   SCREEN the monitor's display: one quad on the screen plane that samples the display at a resolution step
//          (2^L texels per image px; L = 0 is the painted frame, bit for bit). The step rises in held steps as the lens
//          nears it (the machine resolving), so when the portal opens the 3D badge behind it is already the picture.
//   BOX    the machine's worlds (the nest, the plot): voxels turned about their vertical axis, shaded in whole rungs by
//          a key direction, with a palette fog (rungs, a Bayer seam on the native grid) for depth.
// Every fragment is a texel of the palette texture (family x rung): the native variant's output IS master-palette
// colour. The 1080 variant renders 2x and passes through the palette snap: each 2x2 block becomes the nearest whole
// rung of the families present in it (no new hues, no blend left over).
// @ts-ignore  three ships no types here (no @types/three is installed): typed at this module's boundary.
import * as THREE0 from 'three';
import {FAMILIES, PAL} from '../../../shared/pixel/palette';
import {Buf} from '../../../shared/pixel/px';
import * as OM from '../../../shared/pixel/cast/orb-medium';
import {CAM, DEPTH, NW, NH, T} from './params';
import {roomLayers, plateAt, screenNestAt, SCREEN_RES, NEST_GENS} from './pixel';
import {extrudeRoom, FAM_ORDER, Instances, FLAG, LAYER, KEY_LIGHT, colCode, screenLevel, ScreenLevel, SCREEN_BOX, onPlane, SCREEN_N, SCREEN_D, portalPixels} from './extrude';
import {nestBoxes, plotBoxes, Boxes, TUNNEL, nestGeometry, BOXFLAG} from './worlds';
import {CARD} from './pixel';
import {shotAt, cameraWorld, SEG_M, M_TUN, M_SURF, M_ROOM2, Seg, Shot} from './path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const THREE: any = THREE0;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

export type Variant = 'native' | 'hd';
export const N_LEVELS = 5;

// ------------------------------------------------------------------ shaders
const PAL_GLSL = /* glsl */ `
uniform sampler2D uPal;
uniform float uFamLen[16];
vec4 palCol(int fam, int rung) {
  int len = int(uFamLen[fam] + 0.5);
  return texelFetch(uPal, ivec2(clamp(rung, 0, len - 1), fam), 0);
}
float bayer4(vec2 p) {
  int x = int(mod(p.x, 4.0)), y = int(mod(p.y, 4.0));
  int i = y * 4 + x;
  int b[16] = int[16](0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5);
  return (float(b[i]) + 0.5) / 16.0;
}
`;

const SLAB_VS = /* glsl */ `
precision highp float;
in vec3 position;
in float face;
in vec4 a0; in vec4 a1; in vec4 a2;
uniform mat4 modelViewMatrix, projectionMatrix;
uniform vec3 uStage;      // f, cx, cy of the staging camera
uniform float uCollapse, uZref, uOrbDy, uCullBehind;
uniform vec3 uScreenN; uniform float uScreenD;
out vec3 vLocal;
flat out vec4 vA0; flat out vec3 vN; flat out float vFront;
void main() {
  if (uCullBehind > 0.5) {
    // the portal is open and the lens is at the glass: nothing of the room behind the screen plane may show past the
    // nest's edges (whole instances, tested at their footprint's centre)
    vec2 pc = a0.xy + 0.5;
    vec3 dc = vec3((pc.x - uStage.y) / uStage.x, -(pc.y - uStage.z) / uStage.x, -1.0);
    vec3 Pc = dc * (a1.w / dot(a1.xyz, dc));
    if ((int(a0.w + 0.5) & ${FLAG.behindScreen}) != 0 || dot(uScreenN, Pc) < uScreenD - 0.003) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  }
  vec2 px = a0.xy + vec2(position.x, 1.0 - position.y);
  vec3 dir = vec3((px.x - uStage.y) / uStage.x, -(px.y - uStage.z) / uStage.x, -1.0);
  float t = a1.w / dot(a1.xyz, dir);
  vec3 P = dir * t * (1.0 + a2.x * (1.0 - position.z));
  if (abs(a2.y - ${LAYER.orb}.0) < 0.5) P.y += uOrbDy;   // the Orb keeps its bob
  float z = -P.z;
  float zc = uZref + (z - uZref) * uCollapse;
  P *= zc / z;
  vLocal = P; vA0 = a0; vN = a1.xyz; vFront = face > 4.5 ? 1.0 : 0.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(P, 1.0);
}`;

const SLAB_FS = /* glsl */ `
precision highp float;
precision highp int;
in vec3 vLocal;
flat in vec4 vA0; flat in vec3 vN; flat in float vFront;
${PAL_GLSL}
uniform sampler2D uVig;
uniform vec3 uCamLocal, uLight;
uniform float uVigOn, uPxScale, uCodeOut, uShadow;
uniform vec2 uRes;
out vec4 outColor;
void main() {
  vec3 N = normalize(cross(dFdx(vLocal), dFdy(vLocal)));
  if (dot(N, uCamLocal - vLocal) < 0.0) N = -N;
  int code = int(vA0.z + 0.5); int fam = code / 16; int rung = code - fam * 16;
  int flags = int(vA0.w + 0.5);
  int off = 0;
  // the key's shadow, one whole rung, dissolved in on the pixels' own grid (never a fade)
  if ((flags & ${FLAG.shadow}) != 0 && bayer4(vA0.xy) < uShadow) off -= 1;
  if (vFront < 0.5) {
    // a face the frame never showed: whole rungs from the monitor's key
    vec3 L = normalize(uLight - vLocal);
    float l = dot(N, L);
    off = l > 0.3 ? 0 : (l > -0.25 ? -1 : -2);
    if ((flags & ${FLAG.card}) != 0) off = -1;               // his card's cut edge: one rung, always
    if ((flags & ${FLAG.emissive}) != 0) off = max(off, -1);  // a lit screen / the city keeps its glow
    if ((flags & ${FLAG.sphere}) != 0) off = l > 0.2 ? 0 : -2; // the Orb turns: its unseen side is dark chrome
  }
  vec2 np = floor(vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uPxScale);
  if (uVigOn > 0.5 && texelFetch(uVig, ivec2(np), 0).r > 0.5) off -= 1;
  int len = int(uFamLen[fam] + 0.5);
  int r = clamp(rung + off, 0, len - 1);
  if (uCodeOut > 0.5) outColor = vec4(float(fam * 16 + r) / 255.0, 0.0, 0.0, 1.0);
  else outColor = palCol(fam, r);
}`;

// the display quad: staging-space corners on the screen plane; the fragment finds its own staging-image point
const SCREEN_VS = /* glsl */ `
precision highp float;
in vec3 position;
uniform mat4 modelViewMatrix, projectionMatrix;
out vec3 vLocal;
void main() { vLocal = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const SCREEN_FS = /* glsl */ `
precision highp float;
precision highp int;
in vec3 vLocal;
${PAL_GLSL}
uniform sampler2D uVig, uLevel;
uniform vec3 uStage;
uniform vec2 uBox, uRes;
uniform float uScale, uPortalOpen, uVigOn, uPxScale, uCodeOut;
out vec4 outColor;
void main() {
  float z = -vLocal.z;
  vec2 img = vec2(uStage.y + uStage.x * vLocal.x / z, uStage.z - uStage.x * vLocal.y / z);
  ivec2 tc = ivec2(floor((img - uBox) * uScale));
  ivec2 sz = textureSize(uLevel, 0);
  if (tc.x < 0 || tc.y < 0 || tc.x >= sz.x || tc.y >= sz.y) discard;
  vec4 t = texelFetch(uLevel, tc, 0);
  int kind = int(t.g * 255.0 + 0.5);
  if (kind == 0) discard;
  if (kind == 2 && uPortalOpen > 0.5) discard;
  int code = int(t.r * 255.0 + 0.5); int fam = code / 16; int rung = code - fam * 16;
  int off = 0;
  vec2 np = floor(vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uPxScale);
  if (uVigOn > 0.5 && texelFetch(uVig, ivec2(np), 0).r > 0.5) off -= 1;
  int len = int(uFamLen[fam] + 0.5);
  int r = clamp(rung + off, 0, len - 1);
  if (uCodeOut > 0.5) outColor = vec4(float(fam * 16 + r) / 255.0, 0.0, 0.0, 1.0);
  else outColor = palCol(fam, r);
}`;

const BOX_VS = /* glsl */ `
precision highp float;
in vec3 position;
in vec4 b0; in vec4 b1; in vec4 b2;
uniform mat4 modelViewMatrix, projectionMatrix;
out vec3 vLocal; out float vDepth;
flat out vec4 vB0; flat out float vFlags;
void main() {
  vec3 o = (position - 0.5) * b1.xyz;
  float c = cos(b2.x), s = sin(b2.x);
  o = vec3(c * o.x + s * o.z, o.y, -s * o.x + c * o.z);   // the hang: turned about the vertical
  vec3 P = b0.xyz + o;
  vLocal = P; vB0 = b0; vFlags = b1.w;
  vec4 mv = modelViewMatrix * vec4(P, 1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}`;

const BOX_FS = /* glsl */ `
precision highp float;
precision highp int;
in vec3 vLocal; in float vDepth;
flat in vec4 vB0; flat in float vFlags;
${PAL_GLSL}
uniform vec3 uCamLocal, uKey;
uniform vec2 uFog;        // view depth (world units) of the first and second fog rung
uniform float uPxScale, uCodeOut;
uniform vec2 uRes;
out vec4 outColor;
void main() {
  vec3 N = normalize(cross(dFdx(vLocal), dFdy(vLocal)));
  if (dot(N, uCamLocal - vLocal) < 0.0) N = -N;
  int code = int(vB0.w + 0.5); int fam = code / 16; int rung = code - fam * 16;
  int flags = int(vFlags + 0.5);
  float l = dot(N, uKey);
  int off = l > 0.55 ? 0 : (l > -0.1 ? -1 : -2);
  if ((flags & ${BOXFLAG.flat}) != 0) off = N.z > 0.5 ? 0 : -1;  // the plot's field: flat, as painted
  if ((flags & ${BOXFLAG.emissive}) != 0) off = max(off, -1);
  vec2 np = floor(vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uPxScale);
  float b = bayer4(np) - 0.5;
  if (uFog.x > 0.0) {
    float f1 = (vDepth - uFog.x) / (uFog.x * 0.35) + b;
    float f2 = (vDepth - uFog.y) / (uFog.y * 0.35) + b;
    if (f1 > 0.0) off -= 1;
    if (f2 > 0.0) off -= 1;
  }
  int len = int(uFamLen[fam] + 0.5);
  int r = clamp(rung + off, 0, len - 1);
  if (uCodeOut > 0.5) outColor = vec4(float(fam * 16 + r) / 255.0, 0.0, 0.0, 1.0);
  else outColor = palCol(fam, r);
}`;

// the palette snap (1080 variant): 2x2 codes -> the nearest whole rung among the families present
const SNAP_VS = /* glsl */ `
precision highp float;
in vec3 position;
void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`;
const SNAP_FS = /* glsl */ `
precision highp float;
precision highp int;
uniform sampler2D uSrc;
${PAL_GLSL}
out vec4 outColor;
void main() {
  ivec2 o = ivec2(gl_FragCoord.xy) * 2;
  int codes[4];
  codes[0] = int(texelFetch(uSrc, o, 0).r * 255.0 + 0.5);
  codes[1] = int(texelFetch(uSrc, o + ivec2(1, 0), 0).r * 255.0 + 0.5);
  codes[2] = int(texelFetch(uSrc, o + ivec2(0, 1), 0).r * 255.0 + 0.5);
  codes[3] = int(texelFetch(uSrc, o + ivec2(1, 1), 0).r * 255.0 + 0.5);
  vec3 m = vec3(0.0);
  for (int i = 0; i < 4; i++) m += palCol(codes[i] / 16, codes[i] - (codes[i] / 16) * 16).rgb;
  m *= 0.25;
  vec3 best = vec3(0.0); float bd = 1e9;
  for (int i = 0; i < 4; i++) {
    int fam = codes[i] / 16;
    int len = int(uFamLen[fam] + 0.5);
    for (int r = 0; r < 10; r++) {
      if (r >= len) break;
      vec3 c = palCol(fam, r).rgb;
      vec3 d = (c - m) * 255.0;
      float dd = d.r * d.r * 0.3 + d.g * d.g * 0.59 + d.b * d.b * 0.11;
      if (dd < bd) { bd = dd; best = c; }
    }
  }
  outColor = vec4(best, 1.0);
}`;

// ------------------------------------------------------------------ the scene (once per tab)
interface Ctx {
  renderer: Any; scene: Any; camera: Any;
  room1: Any; room2: Any; screen: Any; nest: Any; surf: Any;
  I1: Instances; live: Int32Array; base59: number;
  levels: Any[];
  rtNative: Any; rtHd: Any; rtSnap: Any; snapScene: Any; snapCam: Any;
  info: string;
}
let CTX: Ctx | null = null;

const cubeGeometry = () => {
  // 24 vertices (4 per face) so each face knows which it is: 0 -x, 1 +x, 2 -y, 3 +y, 4 -z (back), 5 +z (the FRONT:
  // the pixel's own footprint). Outward CCW winding in (u, v, w) space.
  const g = new THREE.InstancedBufferGeometry();
  const P: number[] = [], Fc: number[] = [], I: number[] = [];
  const faces: Array<[number, number[][]]> = [
    [0, [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]]],
    [1, [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]]],
    [2, [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]]],
    [3, [[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]]],
    [4, [[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]]],
    [5, [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]]],
  ];
  for (const [f, vs] of faces) {
    const b = P.length / 3;
    for (const q of vs) { P.push(...q); Fc.push(f); }
    I.push(b, b + 1, b + 2, b, b + 2, b + 3);
  }
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  g.setAttribute('face', new THREE.Float32BufferAttribute(Fc, 1));
  g.setIndex(I);
  return g;
};

const palTexture = () => {
  const data = new Uint8Array(16 * 16 * 4);
  const famLen: number[] = [];
  FAM_ORDER.forEach((f, fi) => {
    const ramp = FAMILIES[f] ?? [];
    famLen.push(ramp.length);
    for (let r = 0; r < 16; r++) {
      const c = ramp[Math.min(r, ramp.length - 1)] ?? 0;
      const o = (fi * 16 + r) * 4;
      data[o] = (c >> 16) & 255; data[o + 1] = (c >> 8) & 255; data[o + 2] = c & 255; data[o + 3] = 255;
    }
  });
  const tex = new THREE.DataTexture(data, 16, 16, THREE.RGBAFormat, THREE.UnsignedByteType);
  tex.magFilter = tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return {tex, famLen};
};
const nearestTex = (data: Uint8Array, w: number, h: number) => {
  const t = new THREE.DataTexture(data, w, h, THREE.RGBAFormat, THREE.UnsignedByteType);
  t.magFilter = t.minFilter = THREE.NearestFilter; t.generateMipmaps = false; t.flipY = false; t.needsUpdate = true;
  return t;
};

const slabMesh = (I: Instances, common: Any) => {
  const g = cubeGeometry();
  g.setAttribute('a0', new THREE.InstancedBufferAttribute(I.a0, 4));
  g.setAttribute('a1', new THREE.InstancedBufferAttribute(I.a1, 4));
  g.setAttribute('a2', new THREE.InstancedBufferAttribute(I.a2, 4));
  g.instanceCount = I.n;
  const mat = new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3, vertexShader: SLAB_VS, fragmentShader: SLAB_FS, side: THREE.FrontSide,
    uniforms: {
      ...common,
      uStage: {value: new THREE.Vector3(CAM.f, CAM.cx, CAM.cy)},
      uCollapse: {value: 1}, uZref: {value: DEPTH.mas}, uOrbDy: {value: 0}, uCullBehind: {value: 0},
      uScreenN: {value: new THREE.Vector3(...SCREEN_N)}, uScreenD: {value: SCREEN_D},
      uCamLocal: {value: new THREE.Vector3()}, uLight: {value: new THREE.Vector3()},
      uVigOn: {value: 0}, uShadow: {value: 0},
    },
  });
  const m = new THREE.Mesh(g, mat);
  m.frustumCulled = false;
  return m;
};
const boxMesh = (B: Boxes, common: Any, key: [number, number, number]) => {
  const g = cubeGeometry();
  g.setAttribute('b0', new THREE.InstancedBufferAttribute(B.b0, 4));
  g.setAttribute('b1', new THREE.InstancedBufferAttribute(B.b1, 4));
  g.setAttribute('b2', new THREE.InstancedBufferAttribute(B.b2, 4));
  g.instanceCount = B.n;
  const k = new THREE.Vector3(...key).normalize();
  const mat = new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3, vertexShader: BOX_VS, fragmentShader: BOX_FS, side: THREE.FrontSide,
    uniforms: {...common, uCamLocal: {value: new THREE.Vector3()}, uKey: {value: k}, uFog: {value: new THREE.Vector2(0, 0)}},
  });
  const m = new THREE.Mesh(g, mat);
  m.frustumCulled = false;
  return m;
};
/** a level of the display as a texture: R = palette code, G = kind (0 not display, 1 display, 2 portal) */
const levelTexture = (S: ScreenLevel) => {
  const d = new Uint8Array(S.w * S.h * 4);
  for (let i = 0; i < S.w * S.h; i++) { if (S.kind[i]) d[i * 4] = colCode(S.col[i]); d[i * 4 + 1] = S.kind[i]; d[i * 4 + 3] = 255; }
  return nearestTex(d, S.w, S.h);
};
const screenMesh = (common: Any, level0: Any) => {
  const {x0, x1, y0, y1} = SCREEN_BOX;
  const c = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(([x, y]) => onPlane(x, y, SCREEN_N, SCREEN_D));
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([...c[0], ...c[1], ...c[2], ...c[0], ...c[2], ...c[3]], 3));
  const mat = new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3, vertexShader: SCREEN_VS, fragmentShader: SCREEN_FS, side: THREE.DoubleSide,
    uniforms: {
      ...common, uLevel: {value: level0}, uStage: {value: new THREE.Vector3(CAM.f, CAM.cx, CAM.cy)},
      uBox: {value: new THREE.Vector2(x0, y0)}, uScale: {value: 1}, uPortalOpen: {value: 0}, uVigOn: {value: 0},
    },
  });
  const m = new THREE.Mesh(g, mat);
  m.frustumCulled = false;
  return m;
};

export const glInit = async (): Promise<Ctx> => {
  if (CTX) return CTX;
  const canvas = document.createElement('canvas');
  canvas.width = 16; canvas.height = 16;
  THREE.ColorManagement.enabled = false;
  const renderer = new THREE.WebGLRenderer({canvas, antialias: false, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: false});
  renderer.setPixelRatio(1);
  renderer.autoClear = true;
  const gl = renderer.getContext();
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  const info = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
  const {tex: palTex, famLen} = palTexture();
  // the plate's vignette, native grid
  const L1 = roomLayers(T.d3 - 1, 'nest', {});
  const vd = new Uint8Array(NW * NH * 4);
  for (let i = 0; i < NW * NH; i++) { vd[i * 4] = L1.vig[i] ? 255 : 0; vd[i * 4 + 3] = 255; }
  const vigTex = nearestTex(vd, NW, NH);
  const common = {uPal: {value: palTex}, uFamLen: {value: famLen.concat(Array(16 - famLen.length).fill(1))}, uVig: {value: vigTex}, uPxScale: {value: 1}, uRes: {value: new THREE.Vector2(NW, NH)}, uCodeOut: {value: 0}};
  // the rooms: the one we leave (frame 59, the nest on the monitor) and the one we land in (the pixel frame after it)
  const I1 = extrudeRoom(L1);
  const L2 = roomLayers(T.pixelBack, 'plot', {});
  const I2 = extrudeRoom(L2, {margins: {left: 110, right: 90, top: 50}, city: 'window', displayVoxels: true});
  const room1 = slabMesh(I1, common), room2 = slabMesh(I2, common);
  const light = new THREE.Vector3(...KEY_LIGHT);
  room1.material.uniforms.uLight.value.copy(light);
  room2.material.uniforms.uLight.value.copy(light);
  // the room's live pixels: every plate pixel that changes over the 3D stretch (LEDs, the city's lights)
  const base = L1.plate;
  const liveSet = new Set<number>();
  for (let q = T.d3 - 1; q < T.d3 + 120; q++) {
    const pl = plateAt(q, 'nest');
    for (let i = 0; i < NW * NH; i++) if (pl.c[i] !== base.c[i] && I1.plateInst[i] >= 0) liveSet.add(i);
  }
  const live = Int32Array.from(liveSet);
  // the display at its resolution steps (level 0 = the painted pixels)
  const paint = (scr: Buf, V: number) => screenNestAt(scr, V, NEST_GENS, SCREEN_RES);
  const levels: Any[] = [];
  for (let L = 0; L < N_LEVELS; L++) levels.push(levelTexture(screenLevel(L, L1.plate, paint)));
  const screen = screenMesh(common, levels[0]);
  const nest = boxMesh(nestBoxes(), common, [0.35, 0.55, 1.0]);
  const surf = boxMesh(plotBoxes(), common, [-0.3, 0.55, 0.78]);
  // the chain
  const scene = new THREE.Scene();
  const mk = (m: Any) => { const g = new THREE.Group(); g.matrixAutoUpdate = false; if (m) g.matrix.copy(m); return g; };
  const gRoom = mk(null), gTun = mk(M_TUN), gSurf = mk(M_SURF), gRoom2 = mk(M_ROOM2);
  scene.add(gRoom); gRoom.add(room1); gRoom.add(screen); scene.add(gTun); gTun.add(nest); gTun.add(gSurf); gSurf.add(surf); gSurf.add(gRoom2); gRoom2.add(room2);
  scene.updateMatrixWorld(true);
  const camera = new THREE.PerspectiveCamera();
  camera.matrixAutoUpdate = false; camera.matrixWorldAutoUpdate = false;
  const rtOpts = {minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, depthBuffer: true, stencilBuffer: false, generateMipmaps: false};
  const rtNative = new THREE.WebGLRenderTarget(NW, NH, rtOpts);
  const rtHd = new THREE.WebGLRenderTarget(3840, 2160, rtOpts);
  const rtSnap = new THREE.WebGLRenderTarget(1920, 1080, {...rtOpts, depthBuffer: false});
  const snapScene = new THREE.Scene();
  const tri = new THREE.BufferGeometry();
  tri.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  const snapMat = new THREE.RawShaderMaterial({glslVersion: THREE.GLSL3, vertexShader: SNAP_VS, fragmentShader: SNAP_FS, depthTest: false, depthWrite: false,
    uniforms: {uSrc: {value: rtHd.texture}, uPal: {value: palTex}, uFamLen: common.uFamLen}});
  const snapMesh = new THREE.Mesh(tri, snapMat); snapMesh.frustumCulled = false;
  snapScene.add(snapMesh);
  const snapCam = new THREE.Camera();
  CTX = {renderer, scene, camera, room1, room2, screen, nest, surf, I1, live, base59: OM.orbBob(T.d3 - 1), levels, rtNative, rtHd, rtSnap, snapScene, snapCam, info};
  // eslint-disable-next-line no-console
  console.log(`[p2] WebGL renderer: ${info} | room1 ${I1.n} voxels (${live.length} live), room2 ${I2.n}, nest ${nest.geometry.instanceCount}, plot ${surf.geometry.instanceCount}, portal px ${portalPixels().length}`);
  return CTX;
};

/** a lens-shifted perspective: principal point (cx, cy) in native px of a 480 x 270 frame, focal f */
const projection = (near: number, far: number, cy: number) => {
  const f = CAM.f, W = NW, H = NH, cx = CAM.cx;
  const m = new THREE.Matrix4();
  m.set(
    (2 * f) / W, 0, 1 - (2 * cx) / W, 0,
    0, (2 * f) / H, -(1 - (2 * cy) / H), 0,
    0, 0, -(far + near) / (far - near), (-2 * far * near) / (far - near),
    0, 0, -1, 0,
  );
  return m;
};

export interface Rendered { native?: Buf; hd?: ImageData; level?: number }
/** V9's photo window (the plot's world is seen only through it until the camera is in it), world space */
const lastWindow = (() => {
  const G = nestGeometry(), k = TUNNEL.count - 1, o = G.origin(k), s = G.scale(k), p = CARD.photo;
  return [[p.x, p.y], [p.x + p.w, p.y], [p.x, p.y + p.h], [p.x + p.w, p.y + p.h]].map(([u, v]) => new THREE.Vector3(o[0] + u * s, o[1] - v * s, o[2]).applyMatrix4(SEG_M.TUN));
})();
/** its projected rect in render-target pixels [x, y, w, h] (bottom-left origin), or null if it is behind the camera */
const windowRect = (camera: Any, W: number, H: number): [number, number, number, number] | null => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const P of lastWindow) {
    const q = P.clone().applyMatrix4(camera.matrixWorldInverse);
    if (q.z > 0) return null;
    const c = q.applyMatrix4(camera.projectionMatrix);
    const sx = (c.x * 0.5 + 0.5) * W, sy = (c.y * 0.5 + 0.5) * H;
    x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy);
  }
  const ax = Math.max(0, Math.floor(x0)), ay = Math.max(0, Math.floor(y0)), bx = Math.min(W, Math.ceil(x1)), by = Math.min(H, Math.ceil(y1));
  return bx > ax && by > ay ? [ax, ay, bx - ax, by - ay] : [0, 0, 0, 0];
};
/** render the scene into the bound target; the plot's world clipped to V9's photo window while we're outside it */
const drawScene = (C: Ctx, shot: {seg: Seg}, W: number, H: number) => {
  const surfOn = C.surf.visible, room2On = C.room2.visible;
  const clip = (shot.seg === 'ROOM' || shot.seg === 'TUN') && (surfOn || room2On);
  if (!clip) { C.renderer.render(C.scene, C.camera); return; }
  C.surf.visible = false; C.room2.visible = false;
  C.renderer.render(C.scene, C.camera);
  const r = windowRect(C.camera, W, H);
  if (!r || r[2] === 0) return;
  const r1 = C.room1.visible, s1 = C.screen.visible, n1 = C.nest.visible;
  C.room1.visible = false; C.screen.visible = false; C.nest.visible = false; C.surf.visible = surfOn; C.room2.visible = room2On;
  C.renderer.autoClear = false;
  C.renderer.setScissorTest(true);
  C.renderer.setScissor(r[0], r[1], r[2], r[3]);
  C.renderer.render(C.scene, C.camera);
  C.renderer.setScissorTest(false);
  C.renderer.autoClear = true;
  C.room1.visible = r1; C.screen.visible = s1; C.nest.visible = n1;
};
const NEST_F = new THREE.Vector3(...nestGeometry().F);

/** the display's resolution step for this camera: how many output px one image px of the screen now spans (at the
 *  portal), as a power of two, held (0 = the painted frame) */
const PORTAL_C = (() => {
  const px = portalPixels();
  const cx = px.reduce((a, q) => a + q[0], 0) / px.length + 0.5, cy = px.reduce((a, q) => a + q[1], 0) / px.length + 0.5;
  return [onPlane(cx, cy, SCREEN_N, SCREEN_D), onPlane(cx + 1, cy, SCREEN_N, SCREEN_D), onPlane(cx, cy + 1, SCREEN_N, SCREEN_D)].map((q) => new THREE.Vector3(...q));
})();
const levelFor = (camera: Any): number => {
  const pr = PORTAL_C.map((P) => {
    const q = P.clone().applyMatrix4(camera.matrixWorldInverse);
    if (q.z > -1e-6) return null;
    const c = q.applyMatrix4(camera.projectionMatrix);
    return [(c.x * 0.5 + 0.5) * NW, (c.y * 0.5 + 0.5) * NH];
  });
  if (pr.some((q) => !q)) return N_LEVELS - 1;
  const [a, b, c] = pr as number[][];
  const m = Math.max(Math.hypot(b[0] - a[0], b[1] - a[1]), Math.hypot(c[0] - a[0], c[1] - a[1]));
  return Math.max(0, Math.min(N_LEVELS - 1, Math.floor(Math.log2(Math.max(1, m)))));
};

/** render clip frame p (60..314) in 3D */
export const render3d = (p: number, variant: Variant): Rendered => {
  const C = CTX!;
  const shot: Shot = shotAt(p, variant === 'native');
  const {m, scale} = cameraWorld(shot);
  C.camera.matrixWorld.copy(m);
  C.camera.matrixWorldInverse.copy(m).invert();
  // near / far in the current segment's units (the nest shrinks as we fly: scale with the distance to the fixed point)
  let near = 0.02 * scale, far = 60 * scale;
  if (shot.seg === 'TUN') { const d = shot.pos.clone().sub(NEST_F).length(); near = Math.max(1e-5, 0.01 * d) * scale; far = 60 * d * scale; }
  if (shot.seg === 'SURF') { near = (p > T.land - 20 ? 3 : 0.5) * scale; far = 5000 * scale; }
  C.camera.projectionMatrix.copy(projection(near, far, shot.cy));
  C.camera.projectionMatrixInverse.copy(C.camera.projectionMatrix).invert();
  // visibility
  C.room1.visible = C.screen.visible = shot.draw.includes('ROOM');
  C.nest.visible = shot.draw.includes('TUN');
  C.surf.visible = shot.draw.includes('SURF');
  C.room2.visible = shot.draw.includes('ROOM2');
  // the room stays alive: its LEDs and city lights from the plate at this frame, and the Orb's bob
  if (C.room1.visible) {
    // the room's own clock runs one frame behind in 3D, so p60 is p59's room exactly and nothing skips
    const q = p - 1;
    const pl = plateAt(q, 'nest');
    const a0 = C.I1.a0;
    for (const i of C.live) a0[C.I1.plateInst[i] * 4 + 2] = colCode(pl.c[i]);
    C.room1.geometry.attributes.a0.needsUpdate = true;
    C.room1.material.uniforms.uOrbDy.value = -(OM.orbBob(q) - C.base59) * (DEPTH.orb / CAM.f);
  }
  // uniforms
  const camW = new THREE.Vector3().setFromMatrixPosition(m);
  const toLocal = (mesh: Any) => camW.clone().applyMatrix4(mesh.matrixWorld.clone().invert());
  for (const mesh of [C.room1, C.room2, C.nest, C.surf]) mesh.material.uniforms.uCamLocal.value.copy(toLocal(mesh));
  const lv = C.screen.visible ? levelFor(C.camera) : 0;
  const su = C.screen.material.uniforms;
  su.uLevel.value = C.levels[lv]; su.uScale.value = 1 << lv; su.uPortalOpen.value = shot.portal ? 1 : 0; su.uVigOn.value = shot.vig1 ? 1 : 0;
  C.room1.material.uniforms.uVigOn.value = shot.vig1 ? 1 : 0;
  C.room1.material.uniforms.uCullBehind.value = shot.portal ? 1 : 0;
  C.room2.material.uniforms.uVigOn.value = shot.vig2 ? 1 : 0;
  C.room2.material.uniforms.uCollapse.value = shot.collapse2;
  C.room1.material.uniforms.uShadow.value = shot.shadow1;
  C.room2.material.uniforms.uShadow.value = shot.shadow2;
  // the plot's fog: in world units (cells x the segment's scale)
  const sScale = new THREE.Vector3().setFromMatrixColumn(SEG_M.SURF, 0).length();
  C.surf.material.uniforms.uFog.value.set(300 * sScale, 620 * sScale);
  const hd = variant === 'hd';
  const px = hd ? 8 : 1;
  for (const mesh of [C.room1, C.room2, C.screen, C.nest, C.surf]) {
    mesh.material.uniforms.uPxScale.value = px;
    mesh.material.uniforms.uRes.value.set(hd ? 3840 : NW, hd ? 2160 : NH);
    mesh.material.uniforms.uCodeOut.value = hd ? 1 : 0;
  }
  if (!hd) {
    C.renderer.setClearColor(new THREE.Color(((PAL.N0 >> 16) & 255) / 255, ((PAL.N0 >> 8) & 255) / 255, (PAL.N0 & 255) / 255), 1);
    C.renderer.setRenderTarget(C.rtNative);
    drawScene(C, shot, NW, NH);
    const px4 = new Uint8Array(NW * NH * 4);
    C.renderer.readRenderTargetPixels(C.rtNative, 0, 0, NW, NH, px4);
    C.renderer.setRenderTarget(null);
    const b = new Buf(NW, NH, PAL.N0);
    for (let y = 0; y < NH; y++) for (let x = 0; x < NW; x++) {
      const o = ((NH - 1 - y) * NW + x) * 4;
      b.c[y * NW + x] = (px4[o] << 16) | (px4[o + 1] << 8) | px4[o + 2];
    }
    return {native: b, level: lv};
  }
  C.renderer.setClearColor(new THREE.Color(0, 0, 0), 1); // code 0 = N0 rung 0
  C.renderer.setRenderTarget(C.rtHd);
  drawScene(C, shot, 3840, 2160);
  C.renderer.setRenderTarget(C.rtSnap);
  C.renderer.render(C.snapScene, C.snapCam);
  const out = new Uint8Array(1920 * 1080 * 4);
  C.renderer.readRenderTargetPixels(C.rtSnap, 0, 0, 1920, 1080, out);
  C.renderer.setRenderTarget(null);
  const img = new ImageData(1920, 1080);
  for (let y = 0; y < 1080; y++) img.data.set(out.subarray((1079 - y) * 1920 * 4, (1080 - y) * 1920 * 4), y * 1920 * 4);
  return {hd: img, level: lv};
};
export {DEPTH, M_SURF, M_ROOM2};
