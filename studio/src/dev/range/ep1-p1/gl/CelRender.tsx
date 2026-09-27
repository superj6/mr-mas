// MR. MAS — range E1-P1 (1.A): the clay cels, rendered on the iGPU (--gl=angle), one cel per frame of `ep1-p1-cels`.
// Each frame is three 400 x 384 tiles side by side, so nothing depends on PNG transparency:
//   [0] the clay's colour, premultiplied over black   [1] its coverage (alpha)   [2] R: the key's shadow on the
//   plinth top and floor, G: the dome's occlusion there (the contact shadow and AO the pixel frame takes as rungs)
// The camera is the one camera of the clip: a level lens at CLOD's head height, shifted so the plinth top's centre
// lands on output pixel (1280, 704), the tile being that window of the 1920 x 1080 frame. Shot like a miniature:
// accumulated samples with a lens disc (shallow focus on the face), a softboxed can-light key with its shadow, a dome
// of shadowed lights for ambient occlusion, a warm rim from the desk lamp and the pool's warm bounce.
import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, cancelRender, continueRender, delayRender, useCurrentFrame} from 'remotion';
import {THREE, Any, FS, fsMat, rt, halton} from '../../p3/gl/kit';
import {makeClayTex, makePuppet, disposePuppet, ClayTex} from './clay';
import {CELS, TILE, Cel} from './cels';

export const CEL_W = TILE.w * 3, CEL_H = TILE.h;
// round 5: the aperture is roughly halved (0.075 -> 0.04). At 0.075 the lower body and the clipboard went soft, and
// that softness against the pixel pane's hard edges was the likeliest "pasted-in" tell; the face stays the focus
export const CAM = {D: 1.6, eyeH: 0.26, f: 1280, cx: 1280, cy: 704 - (1280 * 0.26) / 1.6, focus: 1.56, aperture: 0.04};
export const YAW = 0.4;
const N_LIT = 56, N_NIGHT = 32;

interface GL { r: Any; tex: ClayTex; scene: Any; cam: Any; key: Any; dome: Any; rim: Any; bounce: Any; top: Any; catcher: Any[]; fs: FS; add: Any; out: Any; rtS: Any; rtA: Any; rtK: Any; rtD: Any; hide: Any; shadowK: Any; shadowD: Any }
let G: GL | null = null;
const init = (canvas: HTMLCanvasElement): GL => {
  const r = new THREE.WebGLRenderer({canvas, antialias: false, alpha: false, preserveDrawingBuffer: true, powerPreference: 'high-performance'});
  r.setPixelRatio(1); r.setSize(CEL_W, CEL_H, false); r.autoClear = false;
  r.outputColorSpace = THREE.LinearSRGBColorSpace; r.toneMapping = THREE.NoToneMapping;
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFShadowMap;
  const scene = new THREE.Scene();
  const tex = makeClayTex();
  // the can: a PAR can on a stand, up and to the left, a little in front (its lens in the pixel frame at room (101, 105))
  const key = new THREE.SpotLight(new THREE.Color(1.0, 0.78, 0.54), 2.4, 3, 0.42, 0.35, 2);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0003; key.shadow.normalBias = 0.002; key.shadow.camera.near = 0.1; key.shadow.camera.far = 2;
  key.target.position.set(0.0, 0.13, 0.0);
  scene.add(key, key.target);
  // the dome: one shadowed directional light a sample, from the upper hemisphere (ambient that knows occlusion)
  const dome = new THREE.DirectionalLight(new THREE.Color(0.5, 0.56, 0.86), 0.3);
  dome.castShadow = true; dome.shadow.mapSize.set(1024, 1024); dome.shadow.bias = -0.0004; dome.shadow.normalBias = 0.002;
  Object.assign(dome.shadow.camera, {left: -0.3, right: 0.3, top: 0.4, bottom: -0.2, near: 0.01, far: 3});
  dome.target.position.set(0, 0.12, 0);
  scene.add(dome, dome.target);
  // the desk lamp behind and right (warm rim); the pool's warm bounce from below
  const rim = new THREE.PointLight(new THREE.Color(1.0, 0.66, 0.38), 0.12, 3, 2);
  rim.position.set(0.42, 0.36, -0.45); scene.add(rim);
  const bounce = new THREE.HemisphereLight(new THREE.Color(0.02, 0.025, 0.05), new THREE.Color(0.9, 0.52, 0.3), 0.22);
  scene.add(bounce);
  // the catcher: the plinth's top, its side and the floor, which only receive (CLOD's shadow, CLOD's occlusion)
  const cat = (g: Any) => { const m = new THREE.Mesh(g, new THREE.ShadowMaterial({opacity: 1, transparent: true, depthWrite: true})); m.receiveShadow = true; m.castShadow = false; m.visible = false; scene.add(m); return m; };
  const top = cat(new THREE.CircleGeometry(0.098, 64).rotateX(-Math.PI / 2));
  const side = cat(new THREE.CylinderGeometry(0.098, 0.098, 0.085, 64, 1, true).translate(0, -0.0425, 0));
  const floor = cat(new THREE.PlaneGeometry(2, 2).rotateX(-Math.PI / 2).translate(0, -0.085, 0));
  // the desk's front panel, 12.5 cm behind CLOD (where the pixel desk stands), from the floor to the desk top
  const desk = cat(new THREE.PlaneGeometry(1.2, 0.205).translate(0.2, 0.0175, -0.125));
  const hide = new THREE.MeshBasicMaterial({colorWrite: false, depthWrite: false});
  const cam = new THREE.PerspectiveCamera(30, TILE.w / TILE.h, 0.05, 20);
  const fs = new FS();
  const add = fsMat('uniform sampler2D tSrc; uniform float uW; uniform float uCh; varying vec2 vUv; void main(){ vec4 s = texture2D(tSrc, vUv); gl_FragColor = uCh > 0.5 ? vec4(0.0, 0.0, 0.0, s.a * uW) : s * uW; }', {tSrc: {value: null}, uW: {value: 1}, uCh: {value: 0}},
    {blending: THREE.CustomBlending, blendEquation: THREE.AddEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneFactor, transparent: true});
  const out = fsMat(`uniform sampler2D tA; uniform sampler2D tK; uniform sampler2D tD; uniform float uWhich; uniform float uExp; varying vec2 vUv; void main(){
      vec4 a = texture2D(tA, vUv);
      if (uWhich < 0.5) {
        vec3 hdr = a.rgb / max(a.a, 1e-4) * uExp;
        // mostly hue-preserving: tone the luminance and carry the chroma, so the terracotta stays terracotta into
        // the can's light (a per-channel curve alone bleaches it toward peach); a little of the per-channel roll-off
        // is kept so the hottest spots still warm toward cream
        float Y = dot(hdr, vec3(0.2126, 0.7152, 0.0722));
        vec3 lin = mix(p3_tone(hdr), hdr * (p3_tone(vec3(Y)).x / max(Y, 1e-5)), 0.7);
        vec3 c = p3_lin2srgb(clamp(lin, 0.0, 1.0));
        // whites at or under 80 %: a soft shoulder on luminance from 0.6 that never passes 0.76, and no channel past
        // 0.86, so the clearcoat's hottest glints still measure under 80 % after the 4:2:0 encode (0.8 before it
        // measured 83 % on one glint in the encoded mp4)
        float Yd = dot(c, vec3(0.2126, 0.7152, 0.0722));
        if (Yd > 0.6) c *= (0.6 + 0.16 * (1.0 - exp(-(Yd - 0.6) / 0.16))) / Yd;
        c = min(c, vec3(0.86));
        c += (p3_hash12(gl_FragCoord.xy) - 0.5) * 0.008;
        gl_FragColor = vec4(clamp(c, 0.0, 1.0) * a.a, 1.0);
      } else if (uWhich < 1.5) gl_FragColor = vec4(vec3(a.a), 1.0);
      else gl_FragColor = vec4(texture2D(tK, vUv).a, texture2D(tD, vUv).a, 0.0, 1.0);
    }`, {tA: {value: null}, tK: {value: null}, tD: {value: null}, uWhich: {value: 0}, uExp: {value: 1}});
  G = {r, tex, scene, cam, key, dome, rim, bounce, top, catcher: [top, side, floor, desk], fs, add, out,
    rtS: rt(TILE.w, TILE.h), rtA: rt(TILE.w, TILE.h, {depthBuffer: false}), rtK: rt(TILE.w, TILE.h, {depthBuffer: false}), rtD: rt(TILE.w, TILE.h, {depthBuffer: false}),
    hide, shadowK: null, shadowD: null};
  return G;
};

/** the camera for one sample: sub-pixel jitter (jx, jy in px) and a lens offset (lx, ly in m) re-aimed at the focus */
const aim = (cam: Any, jx: number, jy: number, lx: number, ly: number) => {
  const {D, eyeH, f, cx, cy, focus} = CAM;
  cam.position.set(lx, eyeH + ly, D);
  cam.quaternion.identity();
  cam.updateMatrixWorld(true);
  const near = 0.05;
  const l = (TILE.x - cx + jx) / f - lx / focus, rr = (TILE.x + TILE.w - cx + jx) / f - lx / focus;
  const t = (cy - TILE.y - jy) / f - ly / focus, b = (cy - TILE.y - TILE.h - jy) / f - ly / focus;
  cam.projectionMatrix.makePerspective(l * near, rr * near, t * near, b * near, near, 20);
  cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
};

const renderCel = (g: GL, cel: Cel) => {
  const {r, scene, key, dome, rim, bounce, cam} = g;
  const pup = makePuppet(g.tex, cel);
  pup.group.rotation.y = YAW;
  pup.group.position.set(0, 0.003, 0);
  scene.add(pup.group);
  const lit = cel.mode === 'lit', id = cel.mode === 'id';
  // round 5: a harder stage key (a smaller source, less fill), so the clay reads as lit by that can, with a
  // shadow side and a terminator like the pixel pane's banded light, not the even glow of a product shot
  key.visible = lit; key.intensity = 1.5;
  bounce.intensity = lit ? 0.22 : 0.05;
  rim.intensity = lit ? 0.36 : 0.3;
  dome.intensity = lit ? 0.17 : 0.5;
  const N = id ? 1 : lit ? N_LIT : N_NIGHT;
  // the can's lens (pixel.ts LENS(), room (104.5, 65.5)) back-projected at 0.35 m in front of CLOD: the key is where
  // the pixel can is, so the clay's modelling and its shadow on the desk agree with the drawn light
  const kb = new THREE.Vector3(-0.147, 0.489, 0.35);
  const clearT = (t: Any) => { r.setRenderTarget(t); r.setClearColor(0x000000, 0); r.clear(true, true, false); };
  clearT(g.rtA); clearT(g.rtK); clearT(g.rtD);
  for (let i = 0; i < N; i++) {
    const jx = id ? 0 : halton(i + 1, 2) - 0.5, jy = id ? 0 : halton(i + 1, 3) - 0.5;
    const la = halton(i + 1, 5) * Math.PI * 2, lr = id ? 0 : Math.sqrt(halton(i + 1, 7)) * CAM.aperture;
    aim(cam, jx, jy, Math.cos(la) * lr, Math.sin(la) * lr);
    // the softbox: the can's lens is ~12 cm across; its position walks a disc each sample
    const ka = halton(i + 1, 11) * Math.PI * 2, kr = Math.sqrt(halton(i + 1, 13)) * 0.018;
    key.position.set(kb.x + Math.cos(ka) * kr, kb.y + Math.sin(ka) * kr * 0.7, kb.z);
    // the dome: a direction over the upper hemisphere, biased toward the open front of the room
    const u = halton(i + 1, 17), v = halton(i + 1, 19);
    const th = Math.acos(Math.sqrt(1 - u * 0.92)), ph = v * Math.PI * 2;
    const dir = new THREE.Vector3(Math.sin(th) * Math.cos(ph), Math.cos(th), Math.sin(th) * Math.sin(ph) * 0.8 + 0.35).normalize();
    dome.position.copy(dir.multiplyScalar(1.2)).add(dome.target.position);
    // the colour pass
    for (const m of g.catcher) m.visible = false;
    r.setRenderTarget(g.rtS); r.setClearColor(0x000000, 0); r.clear(true, true, false);
    r.render(scene, cam);
    g.add.uniforms.tSrc.value = g.rtS.texture; g.add.uniforms.uW.value = 1 / N; g.add.uniforms.uCh.value = 0;
    g.fs.run(r, g.add, g.rtA, false);
    if (lit) {
      // the catcher passes: CLOD writes nothing (it only casts); first the key's shadow, then the dome's occlusion
      const mats = pup.meshes.map((m: Any) => m.material);
      for (const m of pup.meshes) m.material = g.hide;
      for (const m of g.catcher) m.visible = true;
      for (const [light, other, target] of [[key, dome, g.rtK], [dome, key, g.rtD]] as Array<[Any, Any, Any]>) {
        const ov = other.visible; other.visible = false; light.visible = true;
        const bi = bounce.visible, ri = rim.visible; bounce.visible = false; rim.visible = false;
        r.setRenderTarget(g.rtS); r.setClearColor(0x000000, 0); r.clear(true, true, false);
        r.render(scene, cam);
        g.add.uniforms.tSrc.value = g.rtS.texture; g.add.uniforms.uCh.value = 1;
        g.fs.run(r, g.add, target, false);
        other.visible = ov; bounce.visible = bi; rim.visible = ri;
      }
      for (const m of g.catcher) m.visible = false;
      pup.meshes.forEach((m: Any, k: number) => { m.material = mats[k]; });
      key.visible = true;
    }
  }
  // the three tiles into the canvas
  r.setRenderTarget(null);
  r.setScissorTest(true);
  for (let w = 0; w < 3; w++) {
    r.setViewport(w * TILE.w, 0, TILE.w, TILE.h); r.setScissor(w * TILE.w, 0, TILE.w, TILE.h);
    r.setClearColor(0x000000, 1); r.clear(true, true, false);
    g.out.uniforms.tA.value = g.rtA.texture; g.out.uniforms.tK.value = g.rtK.texture; g.out.uniforms.tD.value = g.rtD.texture;
    g.out.uniforms.uWhich.value = id && w === 0 ? 1 : w; g.out.uniforms.uExp.value = 1.0;
    g.fs.mesh.material = g.out; r.render(g.fs.scene, g.fs.cam);
  }
  r.setScissorTest(false);
  r.getContext().finish();
  scene.remove(pup.group);
  // the id pass writes its code in the colour tile unmodified (flat red levels): uWhich 1 would lose it, so redo tile 0
  if (id) {
    r.setScissorTest(true); r.setViewport(0, 0, TILE.w, TILE.h); r.setScissor(0, 0, TILE.w, TILE.h);
    const raw = fsMat('uniform sampler2D tA; varying vec2 vUv; void main(){ vec4 a = texture2D(tA, vUv); gl_FragColor = vec4(a.rgb, 1.0); }', {tA: {value: g.rtA.texture}});
    g.fs.mesh.material = raw; r.render(g.fs.scene, g.fs.cam); r.setScissorTest(false); r.getContext().finish();
  }
  disposePuppet(pup);
};

export const Cels: React.FC = () => {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const h = delayRender(`cel ${frame}`, {timeoutInMilliseconds: 600000});
    try {
      const g = G && G.r.domElement === ref.current ? G : init(ref.current!);
      renderCel(g, CELS[frame]);
      continueRender(h);
    } catch (e) { cancelRender(e as Error); }
  }, [frame]);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <canvas ref={ref} width={CEL_W} height={CEL_H} style={{width: '100%', height: '100%'}} />
    </AbsoluteFill>
  );
};
export const CEL_COUNT = CELS.length;
