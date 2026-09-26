// MR. MAS — range/p3: the model's render. The learned objects of the 2015 table as near-photoreal three.js
// (MeshPhysical + one CC0 HDRI for reflections, true point lights in the LED candles, multi-sample accumulation for
// AA, soft shadows and depth of field), the room as points, and the pixel people IN it: their shadows fall on the
// cloth, they show in the knives and inside the water, the cloth covers their laps. The people themselves are
// composited as native pixel sprites (see P3.tsx); this module renders everything around them.
//
// Layers: 0 objects · 1 liquids · 2 glass shells · 3 mirror-only sprite cards · 5 shadow-only sprite cards
//         6 points · 7 cutlery (not in its own mirror)
// @ts-ignore
import {HDRLoader} from 'three/addons/loaders/HDRLoader.js';
// @ts-ignore
import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';
import {THREE, Any, TONE_GLSL, FS, fsMat, rt, halton, h01, OUT_W, OUT_H} from './kit';
import * as G from './geo';
import * as TX from './tex';
import {TABLE, CANDLES, PLACES, SEATS, MONITOR, SCONCES, MAS_GLASS, Cam, camBasis, NW, NH, V3, WINDOW, END_X, ARMS} from '../layout';

export const EXPOSURE = 1.1;
export type Family = 'table' | 'candles' | 'cutlery' | 'glasses';
export const FAMILIES: Family[] = ['table', 'candles', 'cutlery', 'glasses'];

/** per-frame inputs from the timeline */
export interface WorldState {
  cam: Cam;
  /** the shutter's other end (motion blur on moving frames), or null */
  camTo?: Cam | null;
  reveal: Record<Family, number>;
  fresh: Record<Family, number>;
  /** the LED candles' light, 0..1 */
  light: number;
  /** the monitor's cyan light, 0..1 */
  monitor: number;
  samples: number;
  aperture: number;
  focus: number;
  /** points layer is drawn by its own module (it adds itself to the scene); this toggles it */
  points: boolean;
  /** bloom strength */
  bloom: number;
  /** 0..1: the objects present at all (the collapse) */
  present: number;
  grain?: number;
  vig?: number;
  masGlass?: number;
  monScreen?: number;
  /** the room drains into the screen: it brightens (0..) */
  monFlare?: number;
  /** the sconces' fill before the candles (0..1) */
  fill?: number;
  /** the window reflects the learned objects (the mirror pass), at this strength (0 = off) */
  winMirror?: number;
  /** hide the 3D monitor (the pixel one has landed) */
  monHidden?: boolean;
}

/** a sprite as a card in the world: shadows and reflections of the pixel people come from these */
export interface SpriteCard { key: string; tex: Any; hdrTex: Any; corners: [V3, V3, V3, V3]; shadowCorners?: [V3, V3, V3, V3]; shadow: boolean; mirror: boolean; }

// ------------------------------------------------------------------ the reveal (the model's render converging)
/** patch a built-in material: fragments appear on a stable per-pixel hash as `reveal` rises; fresh ones glow cyan */
const revealable = (m: Any, u: {reveal: {value: number}; fresh: {value: number}; seed: number}) => {
  m.onBeforeCompile = (sh: Any) => {
    sh.uniforms.uReveal = u.reveal; sh.uniforms.uFresh = u.fresh; sh.uniforms.uSeed = {value: u.seed};
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uReveal; uniform float uFresh; uniform float uSeed;\nfloat p3h(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }')
      .replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>\n float p3rv = p3h(floor(gl_FragCoord.xy / 2.0) + uSeed); if (p3rv >= uReveal) discard;')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n totalEmissiveRadiance += vec3(0.03, 0.3, 0.33) * uFresh * step(uReveal - 0.22, p3rv);');
    if (m.userData.patch) m.userData.patch(sh);
  };
  m.customProgramCacheKey = () => 'p3rev' + (m.userData.key ?? '');
  return m;
};

// ------------------------------------------------------------------ the glass (display-space refraction of the composite)
const GLASS_VS = /* glsl */ `
varying vec3 vW; varying vec3 vN; varying float vR;
uniform vec3 uAxis;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal);
  vR = length(w.xz - uAxis.xz);
  gl_Position = projectionMatrix * viewMatrix * w;
}`;
const GLASS_FS = TONE_GLSL + /* glsl */ `
uniform mat4 projectionMatrix;
varying vec3 vW; varying vec3 vN; varying float vR;
uniform sampler2D tComp; uniform sampler2D tEnv; uniform float uEnvI; uniform float uExposure;
uniform vec3 uLightP[${CANDLES.length}]; uniform float uLight; uniform vec3 uMonP; uniform float uMon;
uniform float uIor; uniform float uThick; uniform vec3 uTint; uniform float uLiquid; uniform float uReveal; uniform float uSeed; uniform float uFresh;
uniform float uBaseA;
uniform sampler2D tCard0; uniform sampler2D tCard1; uniform sampler2D tCard2; uniform sampler2D tCard3;
uniform vec3 uCO[4]; uniform vec3 uCU[4]; uniform vec3 uCV[4]; uniform float uCOn[4];
// the pixel people, as the glass sees them: the reflected ray against each guest's card (their pixels, unscaled
// in the texture, bent by the curve of the bowl)
vec4 cardAt(vec3 O, vec3 U, vec3 Vv, vec3 P, vec3 R) {
  vec3 n = normalize(cross(U, Vv));
  float dn = dot(R, n); if (abs(dn) < 1e-4) return vec4(0.0);
  float t = dot(O - P, n) / dn; if (t <= 0.0) return vec4(0.0);
  vec3 h = P + R * t - O;
  float u = dot(h, U) / dot(U, U), v = dot(h, Vv) / dot(Vv, Vv);
  if (u < 0.0 || u > 1.0 || v < 0.0 || v > 1.0) return vec4(0.0);
  return vec4(u, 1.0 - v, t, 1.0);
}
vec3 envEq(vec3 d){ vec2 uv = vec2(atan(d.z, d.x) / 6.2831853 + 0.5, asin(clamp(d.y, -1.0, 1.0)) / 3.1415927 + 0.5); return texture2D(tEnv, uv).rgb; }
void main(){
  float rv = p3_hash12(floor(gl_FragCoord.xy / 2.0) + uSeed); if (rv >= uReveal) discard;
  vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vW);
  float nv = clamp(dot(N, V), 0.0, 1.0);
  float F = 0.04 + 0.96 * pow(1.0 - nv, 5.0);
  // refraction: where the ray leaves the glass, projected back onto the composite (screen-space transmission)
  float th = uLiquid > 0.5 ? max(uThick, vR * 1.7) : (vR < 0.0095 ? 0.012 : uThick);
  vec3 Rr = refract(-V, N, 1.0 / uIor);
  vec3 P = vW + Rr * th;
  vec4 c = projectionMatrix * viewMatrix * vec4(P, 1.0);
  vec2 suv = clamp(c.xy / c.w * 0.5 + 0.5, 0.001, 0.999);
  vec3 behind = texture2D(tComp, suv).rgb;
  // reflections: the room (HDRI) + glints of the LED flames and the monitor, in HDR, toned to display
  vec3 Rf = reflect(-V, N);
  vec3 hdr = envEq(Rf) * uEnvI;
  for (int i = 0; i < ${CANDLES.length}; i++) {
    vec3 L = normalize(uLightP[i] - vW); vec3 H = normalize(L + V);
    hdr += vec3(1.0, 0.62, 0.3) * pow(max(dot(N, H), 0.0), 900.0) * 60.0 * uLight;
    hdr += vec3(1.0, 0.62, 0.3) * pow(max(dot(N, H), 0.0), 90.0) * 1.2 * uLight;
  }
  vec3 Hm = normalize(normalize(uMonP - vW) + V);
  hdr += vec3(0.2, 0.9, 1.0) * pow(max(dot(N, Hm), 0.0), 300.0) * 6.0 * uMon;
  vec3 refl = p3_toDisplay(hdr * uExposure);
  vec4 cr = vec4(0.0); float best = 1e9;
  #define P3CARD(I, TEX) if (uCOn[I] > 0.5) { vec4 hh = cardAt(uCO[I], uCU[I], uCV[I], vW, Rf); if (hh.w > 0.5 && hh.z < best) { vec4 tx = texture2D(TEX, hh.xy); if (tx.a > 0.5) { best = hh.z; cr = vec4(tx.rgb, 1.0); } } }
  P3CARD(0, tCard0) P3CARD(1, tCard1) P3CARD(2, tCard2) P3CARD(3, tCard3)
  if (cr.a > 0.5) refl = mix(refl, cr.rgb, 0.92);
  vec3 col; float a;
  if (uLiquid > 0.5) { col = behind * uTint * (1.0 - F) + refl * F * 1.4 + refl * 0.08; a = 1.0; }
  else { col = mix(behind * uTint, refl, clamp(F * 1.25, 0.0, 1.0)) + refl * 0.06; a = clamp(uBaseA + F * 1.1 + (vR < 0.0095 ? 0.55 : 0.0), 0.0, 1.0); }
  col += vec3(0.05, 0.55, 0.6) * uFresh * step(uReveal - 0.28, rv) * 0.6;
  gl_FragColor = vec4(col * a, a);
}`;

// ------------------------------------------------------------------ world
export class World {
  r: Any; scene: Any; cam: Any; fs = new FS();
  rtS: Any; rtA: Any; rtC: Any; rtG: Any; rtAG: Any; rtMirror: Any; rtDepthN: Any; rtB1: Any; rtB2: Any;
  addMat: Any; compMat: Any; copyMat: Any; blurMat: Any; brightMat: Any; finalMat: Any;
  depthMat: Any; depthOnly: Any;
  env: Any = null; envEq: Any = null;
  fam: Record<Family, {reveal: {value: number}; fresh: {value: number}}>;
  lights: Any[] = []; lightBase: V3[] = []; monLight: Any;
  glassMats: Any[] = [];
  mirrorCam: Any; mirrorMatrix: Any;
  cards = new Map<string, {shadow: Any; mirror: Any; sil: Any}>();
  caustics: Any[] = [];
  steelMats: Any[] = [];
  objectsGroup: Any;
  ready: Promise<void>;
  flameMats: Any[] = [];
  sconces: Any[] = []; sconceBase: V3[] = [];
  masAO: Any = null;
  envRot: Any = null;
  monParts: Any[] = [];
  /** the guests' cards for the glass (shared by every glass material) */
  cardU: Record<string, {value: Any}> = {
    tCard0: {value: null}, tCard1: {value: null}, tCard2: {value: null}, tCard3: {value: null},
    uCO: {value: [0, 1, 2, 3].map(() => new THREE.Vector3())}, uCU: {value: [0, 1, 2, 3].map(() => new THREE.Vector3(1, 0, 0))},
    uCV: {value: [0, 1, 2, 3].map(() => new THREE.Vector3(0, -1, 0))}, uCOn: {value: [0, 0, 0, 0]},
  };
  monScreen: Any = null;
  monPic: TX.MonitorPicture | null = null;
  ptsVP = new THREE.Matrix4();
  points: Any[] = [];
  rtWin: Any; winCam: Any; winMatrix: Any; winGlass: Any = null;
  palTex: Any; palN = 0;

  constructor(canvas: HTMLCanvasElement, hdrUrl: string) {
    RectAreaLightUniformsLib.init();
    this.r = new THREE.WebGLRenderer({canvas, antialias: false, alpha: false, preserveDrawingBuffer: true, powerPreference: 'high-performance'});
    const r = this.r;
    r.setPixelRatio(1); r.setSize(OUT_W, OUT_H, false); r.autoClear = false;
    r.outputColorSpace = THREE.LinearSRGBColorSpace; r.toneMapping = THREE.NoToneMapping;
    r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFShadowMap;
    this.scene = new THREE.Scene();
    this.scene.background = null;
    this.cam = new THREE.PerspectiveCamera(40, OUT_W / OUT_H, 0.05, 60);
    this.fam = {} as Record<Family, {reveal: {value: number}; fresh: {value: number}}>;
    for (const f of FAMILIES) this.fam[f] = {reveal: {value: 1}, fresh: {value: 0}};
    this.rtS = rt(OUT_W, OUT_H);
    this.rtA = rt(OUT_W, OUT_H, {depthBuffer: false});
    this.rtC = rt(OUT_W, OUT_H, {depthBuffer: false});
    this.rtG = rt(OUT_W, OUT_H);
    this.rtAG = rt(OUT_W, OUT_H, {depthBuffer: false});
    this.rtMirror = rt(960, 540);
    this.rtDepthN = rt(NW, NH, {type: THREE.FloatType, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter});
    this.rtB1 = rt(480, 270, {depthBuffer: false}); this.rtB2 = rt(480, 270, {depthBuffer: false});
    this.mirrorCam = new THREE.PerspectiveCamera();
    this.mirrorMatrix = new THREE.Matrix4();
    this.rtWin = rt(960, 540);
    this.winCam = new THREE.PerspectiveCamera(30, 0.5, 0.05, 40);
    this.winMatrix = new THREE.Matrix4();
    // the master palette as a texture (the pixel lens quantises to it)
    {
      const cols = TX.PALETTE_LIST; this.palN = cols.length;
      const d = new Uint8Array(128 * 4);
      cols.forEach((c, i) => { d[i * 4] = (c >> 16) & 255; d[i * 4 + 1] = (c >> 8) & 255; d[i * 4 + 2] = c & 255; d[i * 4 + 3] = 255; });
      this.palTex = new THREE.DataTexture(d, 128, 1, THREE.RGBAFormat); this.palTex.magFilter = THREE.NearestFilter; this.palTex.minFilter = THREE.NearestFilter; this.palTex.colorSpace = THREE.NoColorSpace; this.palTex.needsUpdate = true;
    }
    this.objectsGroup = new THREE.Group();
    this.scene.add(this.objectsGroup);
    this.buildPasses();
    this.ready = this.loadEnv(hdrUrl).then(() => this.build());
  }

  // ---------------------------------------------------------------- env
  async loadEnv(url: string) {
    const tex = await new HDRLoader().setDataType(THREE.FloatType).loadAsync(url);
    // tame the room: 45% desaturated, the EXIT sign (the one piece of text in it) painted out
    const d = tex.image.data as Float32Array, w = tex.image.width, h = tex.image.height;
    for (let i = 0; i < w * h; i++) {
      const R = d[i * 4], Gc = d[i * 4 + 1], B = d[i * 4 + 2];
      const L = 0.2126 * R + 0.7152 * Gc + 0.0722 * B;
      const sign = Gc > R * 1.35 && Gc > B * 1.15 && Gc > 0.2;
      const k = sign ? 1 : 0.45;
      d[i * 4] = R + (L - R) * k; d[i * 4 + 1] = Gc + (L - Gc) * k; d[i * 4 + 2] = B + (L - B) * k;
      if (sign) { d[i * 4] *= 0.25; d[i * 4 + 1] *= 0.25; d[i * 4 + 2] *= 0.25; }
    }
    tex.needsUpdate = true;
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter; tex.generateMipmaps = false;
    this.envEq = tex;
    const pm = new THREE.PMREMGenerator(this.r);
    this.env = pm.fromEquirectangular(tex).texture;
    pm.dispose();
    // NOT scene.environment: three replaces every material's envMapIntensity with the scene's when it is used.
    // Each material that should reflect the room gets the map and its own intensity (the cloth gets none).
    this.envRot = new THREE.Euler(0, 1.9, 0);
  }

  // ---------------------------------------------------------------- the set
  build() {
    const g = this.objectsGroup;
    const F = this.fam;
    let seed = 1;
    const rev = (m: Any, fam: Family, key: string) => { m.userData.key = key; m.userData.fam = fam; return revealable(m, {reveal: F[fam].reveal, fresh: F[fam].fresh, seed: (seed++) * 17.3}); };
    const weave = TX.linenWeave(), creases = TX.linenCreases(6, 2);
    const linen = (key: string, detailScale: [number, number], fam: Family = 'table') => {
      const m = new THREE.MeshPhysicalMaterial({color: new THREE.Color(0.86, 0.84, 0.79), roughness: 0.86, sheen: 0.28, sheenRoughness: 0.75, sheenColor: new THREE.Color(1.0, 0.93, 0.84), normalMap: creases, normalScale: new THREE.Vector2(1.5, 1.5), envMapIntensity: 0.0, side: THREE.DoubleSide});
      m.userData.patch = (sh: Any) => {
        sh.uniforms.uDetail = {value: weave}; sh.uniforms.uDetailScale = {value: new THREE.Vector2(...detailScale)};
        sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform sampler2D uDetail; uniform vec2 uDetailScale;')
          .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n { vec3 dN = texture2D(uDetail, vNormalMapUv * uDetailScale).xyz * 2.0 - 1.0; normal = normalize(normal + tbn * vec3(dN.xy * 0.9, 0.0)); }');
      };
      return rev(m, fam, key);
    };
    // ---- the table: cloth top + hang, legs under the hem
    const top = new THREE.Mesh(G.clothTop(), linen('top', [(TABLE.x1 - TABLE.x0) / 0.03, (TABLE.z1 - TABLE.z0) / 0.03]));
    top.receiveShadow = true; top.castShadow = true;
    const drape = new THREE.Mesh(G.clothDrape(), linen('drape', [1 / 0.03, 1 / 0.03]));
    drape.receiveShadow = true; drape.castShadow = true;
    // the drape's uv is in metres (s, depth): the crease map wants 0..1 — scale it in the patch via normalScale only
    g.add(top, drape);
    const wood = rev(new THREE.MeshStandardMaterial({color: new THREE.Color(0.07, 0.04, 0.03), roughness: 0.45, envMapIntensity: 0.1}), 'table', 'leg');
    for (const [lx, lz] of [[TABLE.x0 + 0.1, TABLE.z0 + 0.1], [TABLE.x1 - 0.1, TABLE.z0 + 0.1], [TABLE.x0 + 0.1, TABLE.z1 - 0.1], [TABLE.x1 - 0.1, TABLE.z1 - 0.1]]) {
      const leg = new THREE.Mesh(G.legGeo(), wood); leg.position.set(lx, 0.37, lz); leg.castShadow = true; g.add(leg);
    }
    // ---- places: plate, napkin, cutlery (oriented to each diner), glasses for the guests
    const porcelain = rev(new THREE.MeshPhysicalMaterial({color: new THREE.Color(0.93, 0.92, 0.9), roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 0.18, side: THREE.DoubleSide}), 'cutlery', 'plate');
    // napkins belong to the cutlery beat (they are part of the setting)
    const napkinMat = linen('napkin', [1 / 0.012, 1 / 0.012], 'cutlery');
    const steel = (key: string) => {
      const m = new THREE.MeshPhysicalMaterial({color: new THREE.Color(0.9, 0.9, 0.92), metalness: 1, roughness: 0.14, envMapIntensity: 0.2});
      m.userData.patch = (sh: Any) => {
        sh.uniforms.tMirror = {value: this.rtMirror.texture}; sh.uniforms.uMirrorM = {value: this.mirrorMatrix};
        sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWp;').replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\n vWp = (modelMatrix * vec4(transformed, 1.0)).xyz;');
        sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform sampler2D tMirror; uniform mat4 uMirrorM; varying vec3 vWp;')
          .replace('#include <opaque_fragment>', `
            { vec3 nW = normalize(inverseTransformDirection(normal, viewMatrix));
              vec4 tc = uMirrorM * vec4(vWp + vec3(nW.x, 0.0, nW.z) * 0.02, 1.0);
              vec3 mir = texture2D(tMirror, tc.xy / tc.w).rgb;
              float up = smoothstep(0.55, 0.95, nW.y);
              outgoingLight += mir * up * 0.85; }
            #include <opaque_fragment>`);
      };
      this.steelMats.push(m);
      return rev(m, 'cutlery', key);
    };
    const knifeM = steel('knife'), forkM = steel('fork'), spoonM = steel('spoon');
    const kG = G.knifeGeo(), fG = G.forkGeo(), sG = G.spoonGeo(), pG = G.plateGeo(), nG = G.napkinGeo();
    const wineG = G.wineGlassGeo(), wineL = G.wineGeo(), waterG = G.waterGlassGeo(), waterL = G.waterGeo();
    const blob = TX.blobTex(), caus = TX.causticTex();
    const aoMat = (fam: Family, key: string) => rev(new THREE.MeshBasicMaterial({color: 0x000000, map: blob, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.MultiplyBlending, premultipliedAlpha: true}), fam, key);
    const ao = (x: number, z: number, rx: number, rz: number, fam: Family, op = 0.55) => {
      const m = aoMat(fam, 'ao' + fam); m.opacity = op;
      const q = new THREE.Mesh(new THREE.PlaneGeometry(rx * 2, rz * 2), m); q.rotation.x = -Math.PI / 2; q.position.set(x, TABLE.top + 0.0035, z); q.renderOrder = 1; g.add(q); return q;
    };
    for (const p of PLACES) {
      // the diner's frame: forward (toward the table centre) and right
      const fwd: [number, number] = p.who === 'mas' ? [1, 0] : p.z < 0 ? [0, 1] : [0, -1];
      const right: [number, number] = [-fwd[1], fwd[0]]; // for fwd +x: right = +z ... fwd (0,1): right = (-1,0)
      const rot = Math.atan2(-fwd[1], fwd[0]); // rotate +x onto fwd
      const at = (f: number, rgt: number): [number, number] => [p.x + fwd[0] * f + right[0] * rgt, p.z + fwd[1] * f + right[1] * rgt];
      const plate = new THREE.Mesh(pG, porcelain); plate.position.set(p.x, TABLE.top + 0.003, p.z); plate.castShadow = true; plate.receiveShadow = true; g.add(plate);
      ao(p.x, p.z, 0.16, 0.16, 'cutlery', 0.5);
      const nap = new THREE.Mesh(nG, napkinMat); const [nx, nz] = at(-0.01, 0.005); nap.position.set(nx, TABLE.top + 0.024, nz); nap.rotation.y = rot + 0.06 * (h01(p.x * 100) - 0.5); nap.castShadow = true; nap.receiveShadow = true; g.add(nap);
      const put = (geo: Any, mat: Any, f: number, rgt: number, jitter: number) => {
        const m = new THREE.Mesh(geo, mat); const [x, z] = at(f, rgt);
        m.position.set(x, TABLE.top + 0.0035, z); m.rotation.y = rot + jitter; m.castShadow = true; m.receiveShadow = true; m.layers.set(7); g.add(m);
        ao(x + fwd[0] * 0.1, z + fwd[1] * 0.1, 0.13, 0.03, 'cutlery', 0.3).rotation.z = rot;
      };
      put(fG, forkM, -0.095, -0.165, 0.02);
      put(kG, knifeM, -0.11, 0.165, -0.015);
      put(sG, spoonM, -0.1, 0.205, 0.01);
      if (p.who === 'mas') continue; // his glass is pixel
      // glasses: water goblet at the knife's tip, the wine just beyond it
      const [wx, wz] = at(0.1, 0.2), [vx, vz] = at(0.24, 0.13);
      this.addGlass(waterG, waterL, [wx, wz], 'water', seed++);
      this.addGlass(wineG, wineL, [vx, vz], 'wine', seed++);
      ao(wx, wz, 0.07, 0.07, 'glasses', 0.35); ao(vx, vz, 0.065, 0.065, 'glasses', 0.35);
      // caustics: on the side away from the nearest candle
      for (const [gx, gz, tint] of [[wx, wz, [1.0, 0.72, 0.42]], [vx, vz, [1.0, 0.25, 0.12]]] as Array<[number, number, number[]]>) {
        let best = CANDLES[0]; for (const c of CANDLES) if (Math.hypot(c[0] - gx, c[2] - gz) < Math.hypot(best[0] - gx, best[2] - gz)) best = c;
        const dx = gx - best[0], dz = gz - best[2], dl = Math.hypot(dx, dz) || 1;
        const cm = new THREE.MeshBasicMaterial({map: caus, color: new THREE.Color(...tint), transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false});
        const cmr = revealable(cm, {reveal: F.glasses.reveal, fresh: F.glasses.fresh, seed: (seed++) * 7.1});
        cm.userData.key = 'caus';
        const q = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.13), cmr);
        q.rotation.x = -Math.PI / 2; q.rotation.z = Math.atan2(dx, dz) + Math.PI; q.position.set(gx + (dx / dl) * 0.075, TABLE.top + 0.004, gz + (dz / dl) * 0.075);
        q.renderOrder = 2; q.userData.base = tint; g.add(q); this.caustics.push(q);
      }
    }
    // ---- the contact of Mas's pixel glass with the real cloth: a soft occlusion under its foot
    {
      const m = new THREE.MeshBasicMaterial({color: 0x000000, map: blob, transparent: true, opacity: 0, depthWrite: false, blending: THREE.MultiplyBlending, premultipliedAlpha: true});
      const q = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.07), m); q.rotation.x = -Math.PI / 2; q.position.set(MAS_GLASS[0], TABLE.top + 0.0035, MAS_GLASS[2]); q.renderOrder = 1;
      g.add(q); this.masAO = q;
    }
    // ---- the LED candles: ivory pillar (lit from inside), the flame-shaped LED, the hurricane glass, the light
    const holderG = G.holderGeo();
    for (let i = 0; i < CANDLES.length; i++) {
      const c = CANDLES[i];
      const wax = rev(new THREE.MeshPhysicalMaterial({color: new THREE.Color(0.9, 0.84, 0.72), roughness: 0.55, sheen: 0.3, envMapIntensity: 0.07, emissive: new THREE.Color(1.0, 0.55, 0.22), emissiveIntensity: 0.0}), 'candles', 'wax');
      wax.userData.glow = true;
      const pillar = new THREE.Mesh(G.pillarGeo(), wax); pillar.position.set(c[0], TABLE.top + 0.009, c[2]); pillar.castShadow = false; pillar.receiveShadow = true; g.add(pillar);
      const flameM = rev(new THREE.MeshBasicMaterial({color: new THREE.Color(0, 0, 0)}), 'candles', 'flame');
      this.flameMats.push(flameM);
      const flame = new THREE.Mesh(G.ledFlameGeo(), flameM); flame.position.set(c[0], TABLE.top + 0.009 + 0.1025, c[2]); g.add(flame);
      this.addGlass(holderG, null, [c[0], c[2]], 'holder', seed++);
      ao(c[0], c[2], 0.075, 0.075, 'candles', 0.45);
      const L = new THREE.PointLight(new THREE.Color(1.0, 0.7, 0.42), 0, 6, 2);
      L.position.set(c[0], TABLE.top + 0.009 + 0.114, c[2]);
      L.castShadow = true; L.shadow.mapSize.set(512, 512); L.shadow.bias = -0.0012; L.shadow.normalBias = 0.01; L.shadow.camera.near = 0.02; L.shadow.radius = 1;
      L.layers.enableAll();
      this.scene.add(L); this.lights.push(L); this.lightBase.push([L.position.x, L.position.y, L.position.z]);
    }
    // ---- the wall sconces behind the guests (warm, dim, shaded downward): they put each guest on the cloth
    for (const sc of SCONCES) {
      const L = new THREE.SpotLight(new THREE.Color(1.0, 0.8, 0.6), 0, 5, 0.52, 0.85, 2);
      L.position.set(...sc.p); L.target.position.set(...sc.aim);
      L.castShadow = true; L.shadow.mapSize.set(1024, 1024); L.shadow.bias = -0.0008; L.shadow.normalBias = 0.01; L.shadow.camera.near = 0.1; L.shadow.camera.far = 5;
      L.layers.enableAll();
      this.scene.add(L, L.target); this.sconces.push(L); this.sconceBase.push([...sc.p] as V3);
    }
    // ---- the monitor at the far end: the model's own light (cyan), a rect light facing Mas
    const mon = new THREE.RectAreaLight(new THREE.Color(0.25, 0.95, 1.0), 0, MONITOR.w, MONITOR.h);
    mon.position.set(MONITOR.c[0] - 0.01, MONITOR.c[1], MONITOR.c[2]); mon.lookAt(0, MONITOR.c[1] - 0.2, 0); mon.layers.enableAll();
    this.scene.add(mon); this.monLight = mon;
    // the room's reflections, per material (the cloth takes none: it is lit only by the lights that resolve)
    g.traverse((o: Any) => {
      const m = o.material;
      if (!o.isMesh || !m || !(m.isMeshStandardMaterial) || m.userData?.noEnv) return;
      if (m.normalMap && m.sheen > 0 && m.metalness === 0 && m.roughness > 0.8) return; // linen
      m.envMap = this.env; m.envMapRotation = this.envRot;
    });
    // the screen itself: the model's face. What it shows is its own picture of the table, in glyph (TX.monitorPicture):
    // the table seen from its end, the candles, the guests as tokens, and at the head of the table, where he sits, nothing
    this.monPic = TX.monitorPicture();
    const scr = new THREE.ShaderMaterial({
      uniforms: {uOn: {value: 1}, uExp: {value: EXPOSURE}, uFlare: {value: 0}, tPic: {value: this.monPic.tex}},
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: TONE_GLSL + `uniform float uOn; uniform float uExp; uniform float uFlare; uniform sampler2D tPic; varying vec2 vUv;
        void main(){
          vec3 disp = texture2D(tPic, vUv).rgb;
          vec2 d = vUv - 0.5; disp *= 1.0 - dot(d, d) * 0.35;
          disp = mix(disp, vec3(0.776, 0.984, 0.945), clamp(uFlare * 0.45, 0.0, 0.92));
          gl_FragColor = vec4(p3_fromDisplay(clamp(disp, 0.0, 0.985)) / uExp * uOn * (1.0 + uFlare * 0.6), 1.0);
        }`,
    });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(MONITOR.w, MONITOR.h), scr);
    screen.position.set(MONITOR.c[0] - 0.006, MONITOR.c[1], MONITOR.c[2]); screen.rotation.y = -Math.PI / 2;
    this.objectsGroup.add(screen); this.monScreen = screen;
    const bezel = new THREE.Mesh(new THREE.BoxGeometry(0.03, MONITOR.h + 0.03, MONITOR.w + 0.03), new THREE.MeshStandardMaterial({color: 0x07080b, roughness: 0.35, metalness: 0.2, envMap: this.env, envMapIntensity: 0.16}));
    bezel.position.set(MONITOR.c[0] + 0.012, MONITOR.c[1], MONITOR.c[2]);
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.03, MONITOR.c[1] - MONITOR.h / 2, 0.05), bezel.material);
    post.position.set(MONITOR.c[0] + 0.03, (MONITOR.c[1] - MONITOR.h / 2) / 2, MONITOR.c[2]);
    this.objectsGroup.add(bezel, post); this.monParts = [screen, bezel, post];
    // ---- the window's glass: dark, and in it the mirror image of what the model learned (renderWinMirror)
    {
      const wn = WINDOW, hw = wn.w / 2, straight = wn.h - hw, y0 = wn.c[1] - wn.h / 2;
      const sh = new THREE.Shape();
      sh.moveTo(-hw, 0); sh.lineTo(hw, 0); sh.lineTo(hw, straight); sh.absarc(0, straight, hw, 0, Math.PI, false); sh.lineTo(-hw, 0);
      const geo = new THREE.ShapeGeometry(sh, 32);
      const m = new THREE.ShaderMaterial({
        uniforms: {tWin: {value: this.rtWin.texture}, uWinM: {value: this.winMatrix}, uOn: {value: 0}},
        vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
        fragmentShader: `uniform sampler2D tWin; uniform mat4 uWinM; uniform float uOn; varying vec3 vW;
          void main(){
            vec4 tc = uWinM * vec4(vW, 1.0); vec2 uv = tc.xy / tc.w;
            vec3 r = texture2D(tWin, uv).rgb;
            // a dark pane at night: about a fifth of the room comes back, a little cool; the glass itself a faint blue-black
            vec3 c = r * vec3(0.17, 0.19, 0.22) * uOn + vec3(0.0012, 0.0016, 0.0032);
            gl_FragColor = vec4(c, 1.0);
          }`,
        side: THREE.DoubleSide,
      });
      const q = new THREE.Mesh(geo, m);
      // the shape is in (z, y) of the end wall: place it at x = the pane, facing the head of the table
      q.rotation.y = Math.PI / 2; q.position.set(wn.c[0] - 0.004, y0, wn.c[2]);
      q.layers.set(4); q.frustumCulled = false;
      this.scene.add(q); this.winGlass = q;
    }
    // ---- contact: the cloth darkens where each guest sits close to it, and under the far guests' forearms
    for (const st of SEATS) { const sg = Math.sign(st.z); ao(st.x, sg * (TABLE.z1 - 0.05), st.near ? 0.28 : 0.24, 0.08, 'table', 0.42); }
    for (const a of ARMS) { ao((a.e[0] + a.h[0]) / 2, (a.e[2] + a.h[2]) / 2, 0.06, Math.abs(a.h[2] - a.e[2]) / 2 + 0.03, 'table', 0.5); }
  }

  addGlass(geo: Any, liquid: Any, [x, z]: [number, number], kind: 'water' | 'wine' | 'holder', seed: number) {
    const fam: Family = kind === 'holder' ? 'candles' : 'glasses';
    const u = this.fam[fam];
    const common = () => ({
      tComp: {value: this.rtC.texture}, tEnv: {value: null}, uEnvI: {value: 0.35}, uExposure: {value: EXPOSURE},
      uLightP: {value: CANDLES.map((c) => new THREE.Vector3(c[0], c[1] + 0.123, c[2]))}, uLight: {value: 0}, uMonP: {value: new THREE.Vector3(...MONITOR.c)}, uMon: {value: 0},
      uReveal: u.reveal, uFresh: u.fresh, uSeed: {value: seed * 13.7}, uAxis: {value: new THREE.Vector3(x, 0, z)},
      ...this.cardU,
    });
    const shell = new THREE.ShaderMaterial({uniforms: {...common(), uIor: {value: 1.5}, uThick: {value: 0.0035}, uTint: {value: new THREE.Vector3(0.97, 0.98, 0.98)}, uLiquid: {value: 0}, uBaseA: {value: kind === 'holder' ? 0.1 : 0.05}},
      vertexShader: GLASS_VS, fragmentShader: GLASS_FS, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor});
    const m = new THREE.Mesh(geo, shell); m.position.set(x, TABLE.top + 0.0035, z); m.layers.set(2); m.renderOrder = 3; m.userData.fam = fam; this.objectsGroup.add(m);
    this.glassMats.push(shell);
    if (liquid) {
      const tint = kind === 'wine' ? new THREE.Vector3(0.42, 0.035, 0.06) : new THREE.Vector3(0.92, 0.97, 0.98);
      const lm = new THREE.ShaderMaterial({uniforms: {...common(), uIor: {value: 1.33}, uThick: {value: 0.02}, uTint: {value: tint}, uLiquid: {value: 1}, uBaseA: {value: 1}},
        vertexShader: GLASS_VS, fragmentShader: GLASS_FS, transparent: false, depthWrite: true, side: THREE.FrontSide});
      const l = new THREE.Mesh(liquid, lm); l.position.copy(m.position); l.layers.set(1); this.objectsGroup.add(l);
      this.glassMats.push(lm);
    }
  }

  /** points on the learned objects' surfaces (area-weighted), per family: the clouds they condense from */
  sampleFamilies(budget: Record<Family, number>): Array<{fam: Family; pts: V3[]}> {
    this.objectsGroup.updateMatrixWorld(true);
    const out: Array<{fam: Family; pts: V3[]}> = [];
    for (const fam of FAMILIES) {
      const tris: Array<[Any, Any, Any, number]> = [];
      let total = 0;
      this.objectsGroup.traverse((o: Any) => {
        if (!o.isMesh) return;
        const f = o.userData.fam ?? o.material?.userData?.fam;
        if (f !== fam || o.material?.blending === THREE.MultiplyBlending || o.material?.blending === THREE.AdditiveBlending) return;
        const g = o.geometry, p = g.attributes.position, idx = g.index ? g.index.array : null;
        const n = idx ? idx.length / 3 : p.count / 3;
        for (let t = 0; t < n; t++) {
          const ia = idx ? idx[t * 3] : t * 3, ib = idx ? idx[t * 3 + 1] : t * 3 + 1, ic = idx ? idx[t * 3 + 2] : t * 3 + 2;
          const a = new THREE.Vector3().fromBufferAttribute(p, ia).applyMatrix4(o.matrixWorld);
          const b = new THREE.Vector3().fromBufferAttribute(p, ib).applyMatrix4(o.matrixWorld);
          const c = new THREE.Vector3().fromBufferAttribute(p, ic).applyMatrix4(o.matrixWorld);
          const area = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a)).length() / 2;
          if (area <= 0) continue;
          total += area; tris.push([a, b, c, total]);
        }
      });
      const pts: V3[] = [];
      const N = budget[fam];
      for (let i = 0; i < N && tris.length; i++) {
        const u = h01(i, 7, FAMILIES.indexOf(fam)) * total;
        let lo = 0, hi = tris.length - 1;
        while (lo < hi) { const m = (lo + hi) >> 1; if (tris[m][3] < u) lo = m + 1; else hi = m; }
        const [a, b, c] = tris[lo];
        let r1 = h01(i, 8, 3), r2 = h01(i, 9, 3);
        if (r1 + r2 > 1) { r1 = 1 - r1; r2 = 1 - r2; }
        pts.push([a.x + (b.x - a.x) * r1 + (c.x - a.x) * r2, a.y + (b.y - a.y) * r1 + (c.y - a.y) * r2, a.z + (b.z - a.z) * r1 + (c.z - a.z) * r2]);
      }
      out.push({fam, pts});
    }
    return out;
  }

  // ---------------------------------------------------------------- passes
  buildPasses() {
    this.addMat = fsMat('uniform sampler2D tSrc; uniform float uW; varying vec2 vUv; void main(){ gl_FragColor = vec4(texture2D(tSrc, vUv).rgb * uW, uW); }', {tSrc: {value: null}, uW: {value: 1}},
      {blending: THREE.CustomBlending, blendEquation: THREE.AddEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneFactor, transparent: true});
    this.copyMat = fsMat('uniform sampler2D tSrc; varying vec2 vUv; void main(){ gl_FragColor = texture2D(tSrc, vUv); }', {tSrc: {value: null}});
    this.brightMat = fsMat('uniform sampler2D tSrc; uniform float uExp; varying vec2 vUv; void main(){ vec3 c = texture2D(tSrc, vUv).rgb * uExp; float l = max(max(c.r, c.g), c.b); gl_FragColor = vec4(c * smoothstep(0.9, 3.0, l), 1.0); }', {tSrc: {value: null}, uExp: {value: EXPOSURE}});
    this.blurMat = fsMat(`uniform sampler2D tSrc; uniform vec2 uDir; varying vec2 vUv; void main(){
      vec3 s = texture2D(tSrc, vUv).rgb * 0.227;
      s += (texture2D(tSrc, vUv + uDir * 1.385).rgb + texture2D(tSrc, vUv - uDir * 1.385).rgb) * 0.316;
      s += (texture2D(tSrc, vUv + uDir * 3.231).rgb + texture2D(tSrc, vUv - uDir * 3.231).rgb) * 0.07;
      gl_FragColor = vec4(s, 1.0); }`, {tSrc: {value: null}, uDir: {value: new THREE.Vector2()}});
    // the composite: HDR -> display, bloom, grain; the native contact shading; the pixel lens (his glass: what is behind
    // it, sampled at the native grid and quantised to the master palette); then the pixel layers
    this.compMat = fsMat(`uniform sampler2D tA; uniform sampler2D tBloom; uniform sampler2D tPixBg; uniform sampler2D tSprites; uniform sampler2D tShade; uniform sampler2D tLens; uniform sampler2D tPal;
      uniform float uExp; uniform float uBloom; uniform float uGrain; uniform float uFrame; uniform float uVig; uniform float uPalN; varying vec2 vUv;
      vec3 look(vec2 uv) {
        vec3 hdr = texture2D(tA, uv).rgb + texture2D(tBloom, uv).rgb * uBloom;
        vec2 d = uv - 0.5; hdr *= 1.0 - uVig * dot(d, d) * 1.6;
        return p3_toDisplay(hdr * uExp);
      }
      void main(){
        vec3 disp = look(vUv);
        float g = p3_hash12(gl_FragCoord.xy + uFrame * 17.0) - 0.5; disp += g * uGrain;
        vec4 sh = texture2D(tShade, vUv); disp *= 1.0 - sh.a * 0.62;
        vec4 ln = texture2D(tLens, vUv);
        if (ln.a > 0.5) {
          vec2 nuv = (floor(vUv * vec2(${NW}.0, ${NH}.0)) + 0.5) / vec2(${NW}.0, ${NH}.0);
          vec3 c = look(nuv);
          if (ln.r < 0.75) c = mix(c, vec3(0.247, 0.792, 0.796), 0.22) * 0.9;
          vec3 best = c; float bd = 1e9;
          for (int i = 0; i < 128; i++) {
            if (float(i) >= uPalN) break;
            vec3 q = texture2D(tPal, vec2((float(i) + 0.5) / 128.0, 0.5)).rgb;
            vec3 e = (c - q) * 255.0; float dd = e.r * e.r * 0.3 + e.g * e.g * 0.59 + e.b * e.b * 0.11;
            if (dd < bd) { bd = dd; best = q; }
          }
          disp = best;
        }
        vec4 bg = texture2D(tPixBg, vUv); disp = disp + bg.rgb * bg.a;
        vec4 sp = texture2D(tSprites, vUv); disp = mix(disp, sp.rgb, step(0.5, sp.a));
        gl_FragColor = vec4(disp, 1.0);
      }`, {tA: {value: null}, tBloom: {value: null}, tPixBg: {value: null}, tSprites: {value: null}, tShade: {value: null}, tLens: {value: null}, tPal: {value: this.palTex}, uPalN: {value: this.palN},
      uExp: {value: EXPOSURE}, uBloom: {value: 0.6}, uGrain: {value: 0.012}, uFrame: {value: 0}, uVig: {value: 0.35}});
    this.finalMat = fsMat(`uniform sampler2D tSrc; uniform sampler2D tUI; varying vec2 vUv; void main(){ vec3 c = texture2D(tSrc, vUv).rgb; vec4 u = texture2D(tUI, vUv); gl_FragColor = vec4(mix(c, u.rgb, step(0.5, u.a)), 1.0); }`, {tSrc: {value: null}, tUI: {value: null}});
    this.depthMat = new THREE.ShaderMaterial({vertexShader: 'varying float vZ; void main(){ vec4 v = modelViewMatrix * vec4(position, 1.0); vZ = -v.z; gl_Position = projectionMatrix * v; }',
      fragmentShader: 'varying float vZ; void main(){ gl_FragColor = vec4(vZ, 0.0, 0.0, 1.0); }', side: THREE.DoubleSide});
    this.depthOnly = new THREE.MeshBasicMaterial({colorWrite: false, side: THREE.DoubleSide});
  }

  /** set the three camera from a Cam, with a sub-pixel jitter (hi-res px) and a lens offset (metres) kept on the focus plane */
  setCam(c: Cam, jx = 0, jy = 0, lx = 0, ly = 0, focus = 2.3, near = 0.03, far = 40) {
    const {fwd, right, up} = camBasis(c);
    const cam = this.cam;
    cam.position.set(c.pos[0] + right[0] * lx + up[0] * ly, c.pos[1] + right[1] * lx + up[1] * ly, c.pos[2] + right[2] * lx + up[2] * ly);
    const m = new THREE.Matrix4().makeBasis(new THREE.Vector3(...right), new THREE.Vector3(...up), new THREE.Vector3(-fwd[0], -fwd[1], -fwd[2]));
    cam.quaternion.setFromRotationMatrix(m);
    cam.updateMatrixWorld(true);
    const dx = jx * (c.tr - c.tl) / OUT_W - lx / focus, dy = jy * (c.tt - c.tb) / OUT_H - ly / focus;
    cam.projectionMatrix.makePerspective((c.tl + dx) * near, (c.tr + dx) * near, (c.tt + dy) * near, (c.tb + dy) * near, near, far);
    cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
  }

  setCards(cards: SpriteCard[]) {
    const seen = new Set<string>();
    for (const c of cards) {
      seen.add(c.key);
      let e = this.cards.get(c.key);
      if (!e) {
        const quad = () => {
          const g = new THREE.BufferGeometry();
          g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(12), 3));
          g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 1, 1, 1, 1, 0, 0, 0], 2));
          g.setIndex([0, 3, 1, 1, 3, 2]);
          return g;
        };
        const geo = quad(), geoM = quad();
        const sm = new THREE.MeshBasicMaterial({map: c.tex, alphaTest: 0.5, colorWrite: false, depthWrite: false, side: THREE.DoubleSide});
        const shadow = new THREE.Mesh(geo, sm); shadow.castShadow = true; shadow.layers.set(5); shadow.frustumCulled = false;
        shadow.customDistanceMaterial = new THREE.MeshDistanceMaterial({map: c.tex, alphaTest: 0.5, side: THREE.DoubleSide});
        const mm = new THREE.MeshBasicMaterial({map: c.hdrTex, alphaTest: 0.5, side: THREE.DoubleSide});
        const mirror = new THREE.Mesh(geoM, mm); mirror.layers.set(3); mirror.frustumCulled = false;
        // in the window's reflection the guests are dark shapes against the lit room (their backs, to the glass)
        const sil = new THREE.Mesh(geoM, new THREE.MeshBasicMaterial({color: new THREE.Color(0.004, 0.005, 0.009), map: c.tex, alphaTest: 0.5, side: THREE.DoubleSide}));
        sil.layers.set(8); sil.frustumCulled = false;
        this.scene.add(shadow, mirror, sil);
        e = {shadow, mirror, sil};
        this.cards.set(c.key, e);
      }
      const pa = e.shadow.geometry.attributes.position, pm = e.mirror.geometry.attributes.position;
      (c.shadowCorners ?? c.corners).forEach((p, i) => pa.setXYZ(i, p[0], p[1], p[2]));
      c.corners.forEach((p, i) => pm.setXYZ(i, p[0], p[1], p[2]));
      pa.needsUpdate = true; pm.needsUpdate = true; e.shadow.geometry.computeBoundingSphere(); e.mirror.geometry.computeBoundingSphere();
      e.shadow.material.map = c.tex; e.shadow.customDistanceMaterial.map = c.tex; e.mirror.material.map = c.hdrTex; e.sil.material.map = c.tex;
      e.shadow.visible = c.shadow; e.mirror.visible = c.mirror; e.sil.visible = c.mirror && c.key.startsWith('g');
    }
    for (const [k, e] of this.cards) if (!seen.has(k)) { e.shadow.visible = false; e.mirror.visible = false; e.sil.visible = false; }
    // the guests' cards as the glasses see them (the table-facing card: the shadow card)
    const U = this.cardU;
    for (let i = 0; i < 4; i++) U.uCOn.value[i] = 0;
    cards.filter((c) => c.key.startsWith('g')).slice(0, 4).forEach((c, i) => {
      const q = c.shadowCorners ?? c.corners;
      U['tCard' + i].value = c.tex;
      U.uCO.value[i].set(...q[0]);
      U.uCU.value[i].set(q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]);
      U.uCV.value[i].set(q[3][0] - q[0][0], q[3][1] - q[0][1], q[3][2] - q[0][2]);
      U.uCOn.value[i] = c.mirror ? 1 : 0;
    });
  }

  dbg = '';
  applyState(s: WorldState) {
    for (const f of FAMILIES) { this.fam[f].reveal.value = s.reveal[f] * s.present; this.fam[f].fresh.value = s.fresh[f]; }
    for (let i = 0; i < this.lights.length; i++) this.lights[i].intensity = 0.2 * s.light;
    for (const L of this.sconces) L.intensity = 2.7 * Math.max(s.light, s.fill ?? 0);
    for (const m of this.flameMats) m.color.setRGB(9 * s.light + 0.2 * s.reveal.candles, 5.2 * s.light + 0.1 * s.reveal.candles, 2.0 * s.light);
    this.monLight.intensity = 2.2 * s.monitor;
    if (this.monScreen) { const u = this.monScreen.material.uniforms; u.uOn.value = s.monScreen ?? 1; u.uFlare.value = s.monFlare ?? 0; }
    this.objectsGroup.traverse((o: Any) => { if (o.material?.userData?.glow) o.material.emissiveIntensity = 0.22 * s.light; });
    for (const m of this.glassMats) { m.uniforms.uLight.value = s.light; m.uniforms.uMon.value = s.monitor; m.uniforms.tEnv.value = this.envEq; }
    for (const q of this.caustics) q.material.opacity = 0.55 * s.light;
    for (const o of this.monParts) o.visible = s.monitor > 0.001 && !s.monHidden;
    if (this.masAO) this.masAO.material.opacity = 0.75 * (s.masGlass ?? 0) * s.present;
    if (this.winGlass) { this.winGlass.visible = (s.winMirror ?? 0) > 0; this.winGlass.material.uniforms.uOn.value = s.winMirror ?? 0; }
    // shadows only matter once something casts light
    this.r.shadowMap.enabled = s.light > 0.01 || (s.fill ?? 0) > 0.01;
  }

  /** the window's mirror: the room seen from the eye's reflection in the pane (a virtual camera behind the glass, looking
   *  back into the room through it). The pane's shader looks it up by world position, so it is the mirror image. */
  renderWinMirror(c: Cam) {
    // the virtual camera: the eye reflected in the pane, looking along the reflected view, with the view's own frustum
    // (so the mirror image is rendered at the resolution it is seen at)
    this.setCam(c);
    const WX = WINDOW.c[0];
    const p = this.cam.position;
    const {fwd} = camBasis(c);
    const wc = this.winCam;
    wc.position.set(2 * WX - p.x, p.y, p.z);
    wc.up.set(0, 1, 0);
    wc.lookAt(wc.position.x - fwd[0], wc.position.y + fwd[1], wc.position.z + fwd[2]);
    wc.fov = (2 * Math.atan(Math.max(Math.abs(c.tt), Math.abs(c.tb))) * 180) / Math.PI;
    wc.aspect = Math.max(Math.abs(c.tl), Math.abs(c.tr)) / Math.max(Math.abs(c.tt), Math.abs(c.tb));
    wc.near = Math.max(0.05, (wc.position.x - WX) * 0.9); wc.far = 30;
    wc.updateProjectionMatrix(); wc.updateMatrixWorld(true);
    const bias = new THREE.Matrix4().set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
    this.winMatrix.copy(bias).multiply(wc.projectionMatrix).multiply(wc.matrixWorldInverse);
    wc.layers.disableAll(); wc.layers.enable(0); wc.layers.enable(7); wc.layers.enable(8);
    this.r.setRenderTarget(this.rtWin); this.r.setClearColor(0x000000, 1); this.r.clear(true, true, false);
    this.r.render(this.scene, wc);
  }

  /** mirror of the main camera in the cloth's plane (for the reflections in the flatware) */
  renderMirror(c: Cam) {
    this.setCam(c);
    const y0 = TABLE.top + 0.006;
    const mc = this.mirrorCam;
    mc.position.copy(this.cam.position); mc.position.y = 2 * y0 - mc.position.y;
    const q = this.cam.quaternion.clone();
    const e = new THREE.Euler().setFromQuaternion(q, 'YXZ'); e.x = -e.x; e.z = -e.z;
    mc.quaternion.setFromEuler(e);
    mc.updateMatrixWorld(true);
    mc.projectionMatrix.copy(this.cam.projectionMatrix);
    // flip vertically in the projection so the mirrored image reads right side up in texture space
    mc.projectionMatrixInverse.copy(mc.projectionMatrix).invert();
    const bias = new THREE.Matrix4().set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
    this.mirrorMatrix.copy(bias).multiply(mc.projectionMatrix).multiply(mc.matrixWorldInverse);
    // clip everything under the cloth
    this.r.clippingPlanes = [new THREE.Plane(new THREE.Vector3(0, 1, 0), -y0)];
    mc.layers.disableAll(); mc.layers.enable(0); mc.layers.enable(3);
    const sm = this.r.shadowMap.enabled; this.r.shadowMap.enabled = false;
    this.r.setRenderTarget(this.rtMirror); this.r.setClearColor(0x000000, 1); this.r.clear(true, true, false);
    this.r.render(this.scene, mc);
    this.r.clippingPlanes = [];
    this.r.shadowMap.enabled = sm;
  }

  /** the native-res depth of everything that can cover a sprite (view depth along the camera's forward axis) */
  readDepth(c: Cam): Float32Array {
    this.setCam(c);
    const cam = this.cam;
    cam.layers.disableAll(); cam.layers.enable(0); cam.layers.enable(7);
    const sm = this.r.shadowMap.enabled; this.r.shadowMap.enabled = false;
    this.scene.overrideMaterial = this.depthMat;
    this.r.setRenderTarget(this.rtDepthN); this.r.setClearColor(0x000000, 1); this.r.clear(true, true, false);
    // clear to "far"
    this.r.setClearColor(new THREE.Color(1e4, 0, 0), 1); this.r.clear(true, true, false);
    this.r.render(this.scene, cam);
    this.scene.overrideMaterial = null;
    this.r.shadowMap.enabled = sm;
    const buf = new Float32Array(NW * NH * 4);
    this.r.readRenderTargetPixels(this.rtDepthN, 0, 0, NW, NH, buf);
    const out = new Float32Array(NW * NH);
    for (let y = 0; y < NH; y++) for (let x = 0; x < NW; x++) out[y * NW + x] = buf[((NH - 1 - y) * NW + x) * 4];
    this.r.setClearColor(0x000000, 1);
    return out;
  }

  /** the whole frame: accumulate the opaque world, compose with the pixel layers, accumulate the glass on top */
  render(s: WorldState, tex: {pixBg: Any; sprites: Any; ui: Any; shade: Any; lens: Any}, frame: number, onSample?: (i: number) => void) {
    const r = this.r;
    if (s.samples > 0) this.monPic?.draw(frame);
    this.applyState(s);
    // mirrors once per frame from the unjittered camera: the flatware's (the cloth plane) and the window's
    if (s.reveal.cutlery > 0 && s.present > 0) this.renderMirror(s.cam);
    if ((s.winMirror ?? 0) > 0) this.renderWinMirror(s.cam);
    const cam = this.cam;
    // the model's points are its pixels: no lens, no jitter, no shutter (they stay square and sharp)
    this.setCam(s.cam);
    this.ptsVP.multiplyMatrices(this.cam.projectionMatrix, this.cam.matrixWorldInverse);
    for (const P of this.points) { const u = P.material.uniforms; u.uVP.value.copy(this.ptsVP); u.uV.value.copy(this.cam.matrixWorldInverse); u.uFocal.value = OUT_W / (s.cam.tr - s.cam.tl); }
    if (s.samples <= 0) {
      // a pure pixel frame: no world, the pixel layers only (exact)
      r.setRenderTarget(this.rtA); r.setClearColor(0x000000, 1); r.clear(true, false, false);
      r.setRenderTarget(this.rtB1); r.clear(true, false, false);
      const cm0 = this.compMat.uniforms;
      cm0.tA.value = this.rtA.texture; cm0.tBloom.value = this.rtB1.texture; cm0.tPixBg.value = tex.pixBg; cm0.tSprites.value = tex.sprites; cm0.tShade.value = tex.shade; cm0.tLens.value = tex.lens; cm0.uBloom.value = 0; cm0.uGrain.value = 0; cm0.uVig.value = 0;
      this.fs.run(r, this.compMat, this.rtC);
      this.finalMat.uniforms.tSrc.value = this.rtC.texture; this.finalMat.uniforms.tUI.value = tex.ui;
      this.fs.run(r, this.finalMat, null);
      r.getContext().finish();
      return;
    }
    const N = Math.max(1, s.samples);
    // ---- opaque accumulation
    for (let i = 0; i < N; i++) {
      const jx = halton(i + 1, 2) - 0.5, jy = halton(i + 1, 3) - 0.5;
      const a = halton(i + 1, 5) * Math.PI * 2, rr = Math.sqrt(halton(i + 1, 7)) * s.aperture;
      const tt = N > 1 ? (i + 0.5) / N : 0.5;
      const c = s.camTo ? lerpCam(s.cam, s.camTo, tt) : s.cam;
      this.setCam(c, jx, jy, Math.cos(a) * rr, Math.sin(a) * rr, s.focus);
      for (let k = 0; k < this.lights.length; k++) {
        const b = this.lightBase[k];
        const u = halton(i + 1, 11 + k * 2) * 2 - 1, v = halton(i + 1, 13 + k * 2) * 2 - 1, w = h01(i, k, 3) * 2 - 1;
        this.lights[k].position.set(b[0] + u * 0.006, b[1] + w * 0.009, b[2] + v * 0.006);
      }
      for (let k = 0; k < this.sconces.length; k++) {
        const b = this.sconceBase[k];
        const u = halton(i + 1, 17 + k) * 2 - 1, v = halton(i + 1, 19 + k) * 2 - 1;
        this.sconces[k].position.set(b[0] + u * 0.05, b[1] + v * 0.03, b[2]);
      }
      cam.layers.disableAll(); for (const L of [0, 4, 5, 6, 7]) cam.layers.enable(L);
      r.setRenderTarget(this.rtS); r.setClearColor(0x000000, 1); r.clear(true, true, false);
      r.render(this.scene, cam);
      this.addMat.uniforms.tSrc.value = this.rtS.texture; this.addMat.uniforms.uW.value = 1 / N;
      this.fs.run(r, this.addMat, this.rtA, i === 0);
      onSample?.(i);
    }
    // ---- bloom (flames, the monitor, glints)
    this.brightMat.uniforms.tSrc.value = this.rtA.texture; this.fs.run(r, this.brightMat, this.rtB1);
    for (let k = 0; k < 2; k++) {
      this.blurMat.uniforms.tSrc.value = this.rtB1.texture; this.blurMat.uniforms.uDir.value.set(1.6 / 480, 0); this.fs.run(r, this.blurMat, this.rtB2);
      this.blurMat.uniforms.tSrc.value = this.rtB2.texture; this.blurMat.uniforms.uDir.value.set(0, 1.6 / 270); this.fs.run(r, this.blurMat, this.rtB1);
    }
    // ---- composite C (display space): the world, the lifted pixel frame behind, the sprites on top
    const cm = this.compMat.uniforms;
    cm.tA.value = this.rtA.texture; cm.tBloom.value = this.rtB1.texture; cm.tPixBg.value = tex.pixBg; cm.tSprites.value = tex.sprites; cm.tShade.value = tex.shade; cm.tLens.value = tex.lens; cm.uBloom.value = s.bloom; cm.uFrame.value = frame;
    cm.uGrain.value = s.grain ?? 0.011; cm.uVig.value = s.vig ?? 0.3;
    this.fs.run(r, this.compMat, this.rtC);
    // ---- glass: per sample, copy C, depth-prepass the opaque world, liquids (replace), shells (over)
    const glassOn = (s.reveal.glasses > 0 || s.reveal.candles > 0) && s.present > 0;
    let finalTex = this.rtC.texture;
    if (glassOn) {
      const NG = Math.max(1, Math.min(N, 32));
      for (let i = 0; i < NG; i++) {
        const jx = halton(i + 1, 2) - 0.5, jy = halton(i + 1, 3) - 0.5;
        const a = halton(i + 1, 5) * Math.PI * 2, rr = Math.sqrt(halton(i + 1, 7)) * s.aperture;
        const tt = NG > 1 ? (i + 0.5) / NG : 0.5;
        const c = s.camTo ? lerpCam(s.cam, s.camTo, tt) : s.cam;
        this.setCam(c, jx, jy, Math.cos(a) * rr, Math.sin(a) * rr, s.focus);
        this.copyMat.uniforms.tSrc.value = this.rtC.texture; this.fs.run(r, this.copyMat, this.rtG);
        const sm = r.shadowMap.enabled; r.shadowMap.enabled = false;
        cam.layers.disableAll(); cam.layers.enable(0); cam.layers.enable(7);
        this.scene.overrideMaterial = this.depthOnly;
        r.setRenderTarget(this.rtG); r.render(this.scene, cam);
        this.scene.overrideMaterial = null;
        cam.layers.disableAll(); cam.layers.enable(1); r.render(this.scene, cam);
        cam.layers.disableAll(); cam.layers.enable(2); r.render(this.scene, cam);
        r.shadowMap.enabled = sm;
        this.addMat.uniforms.tSrc.value = this.rtG.texture; this.addMat.uniforms.uW.value = 1 / NG;
        this.fs.run(r, this.addMat, this.rtAG, i === 0);
      }
      finalTex = this.rtAG.texture;
    }
    // ---- out: the UI layer (native, nearest) over everything
    this.finalMat.uniforms.tSrc.value = finalTex; this.finalMat.uniforms.tUI.value = tex.ui;
    this.fs.run(r, this.finalMat, null);
    r.getContext().finish();
  }
}

export const lerpCam = (a: Cam, b: Cam, t: number): Cam => ({
  pos: [a.pos[0] + (b.pos[0] - a.pos[0]) * t, a.pos[1] + (b.pos[1] - a.pos[1]) * t, a.pos[2] + (b.pos[2] - a.pos[2]) * t],
  yaw: a.yaw + (b.yaw - a.yaw) * t, pitch: a.pitch + (b.pitch - a.pitch) * t,
  tl: a.tl + (b.tl - a.tl) * t, tr: a.tr + (b.tr - a.tr) * t, tt: a.tt + (b.tt - a.tt) * t, tb: a.tb + (b.tb - a.tb) * t,
});
void WINDOW; void END_X; void SEATS;
