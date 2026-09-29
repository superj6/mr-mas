// MR. MAS — range/p3: CLOD's clay turnaround (front, three-quarter, side, back) on a seamless paper sweep. One big
// soft key, a warm fill, contact shadows, a shallow miniature lens; 96 accumulated samples on the iGPU.
//   npx remotion still src/dev/range/p3/entry.tsx p3-clod ../out/lookdev/range/p3-clod-turnaround.png --gl=angle --public-dir=src/dev/range/p3/public
import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, cancelRender, continueRender, delayRender} from 'remotion';
// @ts-ignore
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {THREE, Any, FS, fsMat, rt, halton, OUT_W, OUT_H} from './gl/kit';
import {makeClod, makeSweep, clayNormal} from './gl/clod';
import {blobTex} from './gl/tex';

const render = (canvas: HTMLCanvasElement) => {
  const r = new THREE.WebGLRenderer({canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance'});
  r.setPixelRatio(1); r.setSize(OUT_W, OUT_H, false); r.autoClear = false;
  r.outputColorSpace = THREE.LinearSRGBColorSpace; r.toneMapping = THREE.NoToneMapping;
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFShadowMap;
  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(r);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.22;
  scene.add(makeSweep());
  const nmap = clayNormal(3);
  const blob = blobTex();
  const views: Array<[number, number]> = [[-0.4, 0], [-0.135, -Math.PI / 4], [0.135, -Math.PI / 2], [0.4, Math.PI]];
  views.forEach(([x, ry], i) => {
    const c = makeClod(nmap, 7 + i * 0); // the same puppet four times: one seed, four turns
    c.position.set(x, 0, 0); c.rotation.y = ry;
    scene.add(c);
    const ao = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.16), new THREE.MeshBasicMaterial({color: 0x000000, map: blob, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.MultiplyBlending, premultipliedAlpha: true}));
    ao.rotation.x = -Math.PI / 2; ao.position.set(x, 0.0008, 0.01); scene.add(ao);
  });
  // one big soft key (upper left, in front), a warm low fill, a faint back light to part them from the sweep
  const key = new THREE.SpotLight(new THREE.Color(1.0, 0.95, 0.88), 9, 8, 0.7, 0.9, 2);
  key.position.set(-1.15, 0.85, 0.85); key.target.position.set(0, 0.12, 0); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.004; key.shadow.camera.near = 0.3; key.shadow.camera.far = 4;
  scene.add(key, key.target);
  const fill = new THREE.HemisphereLight(new THREE.Color(1.0, 0.86, 0.72), new THREE.Color(0.35, 0.28, 0.24), 0.5);
  scene.add(fill);
  const back = new THREE.PointLight(new THREE.Color(0.95, 0.9, 1.0), 0.35, 5, 2); back.position.set(0.7, 0.8, -0.6); scene.add(back);
  const cam = new THREE.PerspectiveCamera(19, OUT_W / OUT_H, 0.05, 20);
  const rtS = rt(OUT_W, OUT_H), rtA = rt(OUT_W, OUT_H, {depthBuffer: false});
  const fs = new FS();
  const add = fsMat('uniform sampler2D tSrc; uniform float uW; varying vec2 vUv; void main(){ gl_FragColor = vec4(texture2D(tSrc, vUv).rgb * uW, uW); }', {tSrc: {value: null}, uW: {value: 1}},
    {blending: THREE.CustomBlending, blendEquation: THREE.AddEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, transparent: true});
  const out = fsMat(`uniform sampler2D tA; varying vec2 vUv; void main(){
      vec3 hdr = texture2D(tA, vUv).rgb * 1.02; vec2 d = vUv - 0.5; hdr *= 1.0 - dot(d, d) * 0.55;
      vec3 c = p3_toDisplay(hdr);
      c += (p3_hash12(gl_FragCoord.xy) - 0.5) * 0.012;
      gl_FragColor = vec4(c, 1.0); }`, {tA: {value: null}});
  const eye = new THREE.Vector3(0, 0.36, 2.05), look = new THREE.Vector3(0, 0.14, 0);
  const focus = eye.distanceTo(look);
  const N = 96;
  const kb = key.position.clone();
  for (let i = 0; i < N; i++) {
    const jx = halton(i + 1, 2) - 0.5, jy = halton(i + 1, 3) - 0.5;
    const a = halton(i + 1, 5) * Math.PI * 2, rr = Math.sqrt(halton(i + 1, 7)) * 0.022;
    cam.position.copy(eye); cam.lookAt(look); cam.updateMatrixWorld(true);
    const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0), up = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 1);
    const lx = Math.cos(a) * rr, ly = Math.sin(a) * rr;
    cam.position.copy(eye).addScaledVector(right, lx).addScaledVector(up, ly);
    cam.updateMatrixWorld(true);
    const near = 0.05, t = Math.tan((19 * Math.PI) / 360), asp = OUT_W / OUT_H;
    const dx = (jx * 2 * t * asp) / OUT_W - lx / focus, dy = (jy * 2 * t) / OUT_H - ly / focus;
    cam.projectionMatrix.makePerspective((-t * asp + dx) * near, (t * asp + dx) * near, (t + dy) * near, (-t + dy) * near, near, 20);
    cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
    // the key is a big softbox: its position walks a disc each sample
    const ka = halton(i + 1, 11) * Math.PI * 2, kr = Math.sqrt(halton(i + 1, 13)) * 0.16;
    key.position.set(kb.x + Math.cos(ka) * kr, kb.y + Math.sin(ka) * kr * 0.7, kb.z);
    r.setRenderTarget(rtS); r.setClearColor(0x000000, 1); r.clear(true, true, false);
    r.render(scene, cam);
    add.uniforms.tSrc.value = rtS.texture; add.uniforms.uW.value = 1 / N;
    fs.run(r, add, rtA, i === 0);
  }
  out.uniforms.tA.value = rtA.texture;
  fs.run(r, out, null);
  r.getContext().finish();
};

export const Clod: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const done = useRef(false);
  useLayoutEffect(() => {
    if (done.current) return;
    done.current = true;
    const h = delayRender('clod', {timeoutInMilliseconds: 600000});
    try { render(ref.current!); continueRender(h); } catch (e) { cancelRender(e as Error); }
  }, []);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <canvas ref={ref} width={1920} height={1080} style={{width: '100%', height: '100%'}} />
    </AbsoluteFill>
  );
};
void (null as unknown as Any);
