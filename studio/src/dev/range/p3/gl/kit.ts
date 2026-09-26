// MR. MAS — range/p3: the GL kit's core. One WebGL2 renderer on the iGPU (--gl=angle), render targets, fullscreen
// passes, and the tone curve. The tone curve has an exact inverse, so anything that must land on a master-palette
// colour (the lifted pixels, the sprites seen in a knife) can be written in HDR and still come out exact.
// three ships no types here (no @types/three is installed), so the kit is typed at its own boundary.
// @ts-ignore
import * as THREE0 from 'three';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const THREE: any = THREE0;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;

export const OUT_W = 1920, OUT_H = 1080;

/** GLSL: sRGB <-> linear, the ACES-fit tone curve and its inverse (per channel), exposure applied by the caller */
export const TONE_GLSL = /* glsl */ `
float p3_s2l(float c) { return c <= 0.04045 ? c / 12.92 : pow((c + 0.055) / 1.055, 2.4); }
float p3_l2s(float c) { return c <= 0.0031308 ? c * 12.92 : 1.055 * pow(c, 1.0 / 2.4) - 0.055; }
vec3 p3_srgb2lin(vec3 c) { return vec3(p3_s2l(c.r), p3_s2l(c.g), p3_s2l(c.b)); }
vec3 p3_lin2srgb(vec3 c) { c = clamp(c, 0.0, 1.0); return vec3(p3_l2s(c.r), p3_l2s(c.g), p3_l2s(c.b)); }
vec3 p3_tone(vec3 x) { x = max(x, 0.0); return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }
float p3_itone1(float y) {
  y = clamp(y, 0.0, 0.9995);
  float A = 2.43 * y - 2.51, B = 0.59 * y - 0.03, C = 0.14 * y;
  return (-B - sqrt(max(B * B - 4.0 * A * C, 0.0))) / (2.0 * A);
}
vec3 p3_itone(vec3 y) { return vec3(p3_itone1(y.r), p3_itone1(y.g), p3_itone1(y.b)); }
/** display sRGB colour -> the HDR value that tones back to it (divide by exposure yourself) */
vec3 p3_fromDisplay(vec3 srgb) { return p3_itone(p3_srgb2lin(srgb)); }
vec3 p3_toDisplay(vec3 hdr) { return p3_lin2srgb(p3_tone(hdr)); }
float p3_hash12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
`;
/** the same curve on the CPU (for the sprite textures that feed the mirror pass) */
export const s2l = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
export const itone1 = (y: number) => { y = Math.min(Math.max(y, 0), 0.9995); const A = 2.43 * y - 2.51, B = 0.59 * y - 0.03, C = 0.14 * y; return (-B - Math.sqrt(Math.max(B * B - 4 * A * C, 0))) / (2 * A); };
export const fromDisplay = (hex: number, exposure: number): [number, number, number] => [
  itone1(s2l(((hex >> 16) & 255) / 255)) / exposure, itone1(s2l(((hex >> 8) & 255) / 255)) / exposure, itone1(s2l((hex & 255) / 255)) / exposure];

// ------------------------------------------------------------------ renderer + targets
export const makeRenderer = (canvas: HTMLCanvasElement) => {
  const r = new THREE.WebGLRenderer({canvas, antialias: false, alpha: false, preserveDrawingBuffer: true, powerPreference: 'high-performance', stencil: false});
  r.setPixelRatio(1);
  r.setSize(OUT_W, OUT_H, false);
  r.autoClear = false;
  r.outputColorSpace = THREE.LinearSRGBColorSpace; // every output here is written display-referred by our shaders
  r.toneMapping = THREE.NoToneMapping;
  r.shadowMap.enabled = true;
  r.shadowMap.type = THREE.PCFShadowMap;
  r.shadowMap.autoUpdate = true;
  return r;
};
export const rt = (w: number, h: number, o: Record<string, unknown> = {}) =>
  new THREE.WebGLRenderTarget(w, h, {type: THREE.HalfFloatType, format: THREE.RGBAFormat, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: true, stencilBuffer: false, colorSpace: THREE.NoColorSpace, ...o});

/** a fullscreen triangle pass */
export class FS {
  scene = new THREE.Scene();
  cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  mesh: Any;
  constructor() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 2, 0, 0, 2], 2));
    this.mesh = new THREE.Mesh(g);
    this.mesh.frustumCulled = false;
    this.scene.add(this.mesh);
  }
  run(r: Any, mat: Any, target: Any, clear = true) {
    this.mesh.material = mat;
    r.setRenderTarget(target);
    if (clear) r.clear(true, true, false);
    r.render(this.scene, this.cam);
  }
}
export const fsMat = (frag: string, uniforms: Record<string, {value: unknown}>, o: Record<string, unknown> = {}) =>
  new THREE.ShaderMaterial({
    uniforms,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: TONE_GLSL + frag,
    depthTest: false, depthWrite: false, ...o,
  });

/** Halton low-discrepancy sequence */
export const halton = (i: number, b: number) => { let f = 1, r = 0; while (i > 0) { f /= b; r += f * (i % b); i = Math.floor(i / b); } return r; };
/** deterministic hash (no Math.random anywhere) */
export const h01 = (a: number, b = 0, c = 0) => {
  // three rounds of a murmur3-style finaliser over the three inputs (a weak single round made visible streaks)
  const mix = (h: number) => { h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; return h; };
  let h = mix((Math.round(a * 4096) | 0) ^ 0x9e3779b9);
  h = mix(h ^ (Math.round(b * 4096) | 0) ^ 0x7f4a7c15);
  h = mix(h ^ (Math.round(c * 4096) | 0) ^ 0x94d049bb);
  return (h >>> 0) / 4294967296;
};
