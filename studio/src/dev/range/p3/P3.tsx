// MR. MAS — range/p3 (Prototype 3): THE RECONSTRUCTION's table (12.A, Ep12 #6, F12.1). The Remotion host.
// Per frame: the plan (direct.ts) -> the pixel layers on the CPU (the [W] and its render fronts; the sprites with their
// occlusion, contact and idles; the pixel lens of his glass; the bars, the rim, the slate) -> the model's render on the
// iGPU (gl/world.ts) -> one canvas. One backend for the whole clip: --gl=angle, after the p3-probe still.
import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, cancelRender, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import {W, H, Buf, hash} from '../../../shared/pixel/px';
import {PAL, FAMILIES, lightness, stepColor} from '../../../shared/pixel/palette';
import {blinkAt} from '../../../shared/pixel/sprite';
import {ensureGlyphFonts} from '../../../shared/pixel/glyphDraw';
import {eraStamp} from '../../../shared/pixel/cast/era';
import {Img} from '../../../shared/pixel/figure';
import {renderFront} from '../../../shared/pixel/transitions';
import {THREE, Any, fromDisplay, h01} from './gl/kit';
import {World, EXPOSURE, SpriteCard} from './gl/world';
import {buildPoints, makePoints, GRP, K, Pt, rimOf, assemblyPoints, dissolvePoints, PixelCloud} from './gl/points';
import {glyphAtlas, imgTex} from './gl/tex';
import {OBuf, O, drawWide, drawMonitor, WIDE_PEOPLE} from './plate';
import {plan} from './direct';
import {T} from './timeline';
import {SEATS, MAS_GLASS, WINDOW, SCONCES, ARMS, TABLE, Cam, POV_CAM, WIN_CAM, REFL_EYE_W, project, unprojectDepth, V3, Who, Seat} from './layout';
import {spriteRect, SpriteRect} from './sprites-geo';
import {guestImg, breathe, sleeveOf, drawForearm, masGlassImg, masGlassLens, masReflectionImg, REFL_EYE, drawBar, drawEmptyPlate, BARS, drawRim, MAS_GLASS_W, MAS_GLASS_H, darker} from './sprites';

const F_POV = W / (POV_CAM.tr - POV_CAM.tl), F_WIN = W / (WIN_CAM.tr - WIN_CAM.tl);
const TRANSPARENT = 0x1000000;

// ------------------------------------------------------------------ helpers
class Layer {
  data = new Uint8Array(W * H * 4);
  tex: Any;
  constructor() {
    this.tex = new THREE.DataTexture(this.data, W, H, THREE.RGBAFormat);
    this.tex.magFilter = THREE.NearestFilter; this.tex.minFilter = THREE.NearestFilter; this.tex.generateMipmaps = false; this.tex.colorSpace = THREE.NoColorSpace;
  }
  clear() { this.data.fill(0); }
  set(x: number, y: number, c: number, a = 255) {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = ((H - 1 - y) * W + x) * 4;
    this.data[i] = (c >> 16) & 255; this.data[i + 1] = (c >> 8) & 255; this.data[i + 2] = c & 255; this.data[i + 3] = a;
  }
  get(x: number, y: number) { const i = ((H - 1 - y) * W + x) * 4; return this.data[i + 3] ? (this.data[i] << 16) | (this.data[i + 1] << 8) | this.data[i + 2] : -1; }
  fromBuf(b: Buf, mask?: (i: number) => boolean) {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x; const c = b.c[i]; if (c >= TRANSPARENT || (mask && !mask(i))) continue; this.set(x, y, c); }
  }
  up() { this.tex.needsUpdate = true; }
}
/** a Buf that knows which pixels were painted (UI over the render) */
class UIBuf extends Buf { constructor() { super(W, H, TRANSPARENT); } }

const topRowAndCentre = (m: Img): [number, number] => {
  let top = m.h, sx = 0, n = 0;
  for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) if (m.c[y * m.w + x] >= 0) { if (y < top) top = y; }
  for (let y = top; y < top + Math.round(m.h * 0.2); y++) for (let x = 0; x < m.w; x++) if (m.c[y * m.w + x] >= 0) { sx += x; n++; }
  return [top, n ? sx / n : m.w / 2];
};

/** the people at tonight's table, turned to their memory colour (the POV rim) in whole rungs of its own ramp:
 *  a print of each of them, form kept. Mas turns to his own cyan. */
const RIMFAM: Record<string, number[]> = {gerg: FAMILIES.L, mario: FAMILIES.F, nole: FAMILIES.Q, mas: FAMILIES.C};
const tintCache = new Map<string, number>();
export const tintPeople = (b: OBuf) => {
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, o = b.own[i];
    if (o !== O.person && o !== O.mas) continue;
    const who = o === O.mas ? 'mas' : WIDE_PEOPLE.find((q) => x >= q.x0 && x < q.x1)?.who;
    if (!who) continue;
    const c = b.c[i], key = who + c;
    let v = tintCache.get(key);
    if (v === undefined) {
      const ramp = RIMFAM[who], L = lightness(c);
      let k = 0, bd = 9;
      ramp.forEach((r, j) => { const d = Math.abs(lightness(r) - L); if (d < bd) { bd = d; k = j; } });
      v = ramp[Math.min(ramp.length - 1, k + 1)];
      tintCache.set(key, v);
    }
    b.c[i] = v;
  }
};

interface GuestInfo {
  s: Seat; si: number; flip: boolean; toward: 1 | -1; r: SpriteRect; w: number; h: number;
  land: Float32Array; out: Float32Array; head: [number, number];
  /** the shadow rungs of each row: below the cloth's height the body is in the table's shadow; under the seat, nothing */
  rowK: Int8Array;
  arm: {img: [Img, Img, Img]; x0: number; y0: number; depth: number; shade: Buf; land: Float32Array; out: Float32Array} | null;
}

// ------------------------------------------------------------------ the engine (one per render tab)
class Engine {
  world!: World;
  pv: Any; pr: Any;
  pixBg = new Layer(); sprites = new Layer(); ui = new Layer(); shade = new Layer(); lens = new Layer();
  cardTex = new Map<string, {tex: Any; hdr: Any}>();
  guests: GuestInfo[] = [];
  glass!: {x0: number; y0: number; depth: number; out: Float32Array};
  refl!: {x0: number; y0: number; depth: number; out: Float32Array; edgeY: number; head: [number, number]};
  ots: Int16Array = new Int16Array(H).fill(-1);
  mull!: {x: number; y: number};
  ready: Promise<void>;
  constructor(public canvas: HTMLCanvasElement) {
    this.ready = this.init();
  }
  async init() {
    await ensureGlyphFonts();
    this.world = new World(this.canvas, staticFile('hdri/warm_restaurant_night_2k.hdr'));
    await this.world.ready;
    // the [W] as it stands when the camera starts to move: the frame the model lifts (the people in their colours)
    const lifted = new OBuf(W, H, PAL.N0);
    drawWide(lifted, T.glide[0], {band: 0});
    tintPeople(lifted);
    const fam = this.world.sampleFamilies({table: 16000, candles: 1800, cutlery: 6000, glasses: 5000});
    const grpOf = {table: GRP.table, candles: GRP.candles, cutlery: GRP.cutlery, glasses: GRP.glasses} as const;
    const objSamples: Array<{grp: number; pts: V3[]}> = fam.map((f) => ({grp: grpOf[f.fam] as number, pts: f.pts}));
    objSamples.push({grp: GRP.masGlass, pts: Array.from({length: 500}, (_, i) => {
      const a = h01(i, 3, 77) * Math.PI * 2, t = h01(i, 4, 77);
      const r = t > 0.4 ? 0.042 : t > 0.12 ? 0.006 : 0.036;
      return [MAS_GLASS[0] + Math.cos(a) * r, MAS_GLASS[1] + t * 0.158, MAS_GLASS[2] + Math.sin(a) * r] as V3;
    })});
    const build = buildPoints(lifted, objSamples);
    const extra: Pt[] = [];
    // ---- the guests at the 2015 seats: where each pixel of the drawing is in the world (at the POV), when it lands
    // (assembled out of its cluster, top to bottom) and when it comes apart
    SEATS.forEach((s, si) => {
      const flip = s.near ? false : s.z > 0;
      const toward: 1 | -1 = s.z < 0 ? 1 : -1;
      const r = spriteRect(POV_CAM, s)!;
      const img = guestImg(s.who, s.near, flip, toward, 2, 200);
      const w = img.w, h = img.h;
      const land = new Float32Array(w * h), out = new Float32Array(w * h);
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
        land[j * w + i] = T.resolve.guests + 13 * Math.pow(j / h, 0.8) + 5 * h01(i, j, si + 50);
        out[j * w + i] = T.peopleOut[0] + 1 + 8 * h01(i, j, si + 60) + 3 * (1 - j / h);
      }
      const world = (x: number, y: number) => unprojectDepth(POV_CAM, x, y, r.depth);
      const rowK = new Int8Array(h);
      for (let j = 0; j < h; j++) { const yw = unprojectDepth(POV_CAM, r.x + w / 2, r.y + j + 0.5, r.depth)[1]; rowK[j] = yw >= TABLE.top ? 0 : yw >= TABLE.top - 0.02 ? 1 : yw >= TABLE.top - 0.04 ? 2 : yw >= TABLE.top - 0.06 ? 3 : 5; }
      const pc: PixelCloud = {img, x0: r.x, y0: r.y, world, foot: r.depth / F_POV, rim: rimOf(s.rim), grp: GRP.sprite + si};
      const cloud = (k: number): V3 => { const a = h01(k, si, 111) * Math.PI * 2, rr = Math.sqrt(h01(k, si, 112)), hg = h01(k, si, 113); return [s.x + Math.cos(a) * rr * 0.2, s.eye - 0.42 + hg * 0.62, s.pz + Math.sin(a) * rr * 0.16]; };
      extra.push(...assemblyPoints(pc, cloud, (i, j) => land[j * w + i], (i, j) => rowK[j] < 4 && (!s.near || (i + j) % 2 === 0)), ...dissolvePoints(pc, (i, j) => out[j * w + i], (i, j) => rowK[j] < 4));
      // the far pair's forearm on the cloth, drawn from its projected elbow, wrist and fingertips
      let arm: GuestInfo['arm'] = null;
      const A = ARMS.find((a) => a.who === s.who);
      if (A) {
        const pe = project(POV_CAM, A.e)!, pw = project(POV_CAM, A.w)!, ph = project(POV_CAM, A.h)!;
        const rad = (0.042 / pw[2]) * F_POV;
        const sleeve = sleeveOf(img);
        const imgs = ([0, 1, 2] as const).map((st) => {
          const b = new Buf(W, H, TRANSPARENT), sh = new Buf(W, H, 0);
          drawForearm(b, sh, [pe[0], pe[1] - rad], [pw[0], pw[1] - rad], [ph[0], ph[1] - rad * 0.4], rad, sleeve, st);
          return {b, sh};
        });
        // crop to the arm's box
        let x0 = W, y0 = H, x1 = -1, y1 = -1;
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (imgs[2].b.c[y * W + x] < TRANSPARENT || imgs[2].sh.c[y * W + x]) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
        const aw = x1 - x0 + 1, ah = y1 - y0 + 1;
        const crop = (b: Buf): Img => { const m: Img = {w: aw, h: ah, c: new Int32Array(aw * ah).fill(-1)}; for (let y = 0; y < ah; y++) for (let x = 0; x < aw; x++) { const v = b.c[(y + y0) * W + x + x0]; if (v < TRANSPARENT) m.c[y * aw + x] = v; } return m; };
        const aimgs = imgs.map((q) => crop(q.b)) as [Img, Img, Img];
        const aland = new Float32Array(aw * ah), aout = new Float32Array(aw * ah);
        for (let y = 0; y < ah; y++) for (let x = 0; x < aw; x++) { aland[y * aw + x] = T.resolve.guests + 9 + 6 * h01(x, y, si + 70); aout[y * aw + x] = T.peopleOut[0] + 8 * h01(x, y, si + 71); }
        const depth = pw[2];
        const apc: PixelCloud = {img: aimgs[2], x0, y0, world: (x, y) => unprojectDepth(POV_CAM, x, y, depth - 0.02), foot: depth / F_POV, rim: rimOf(s.rim), grp: GRP.sprite + si};
        extra.push(...assemblyPoints(apc, cloud, (i, j) => aland[j * aw + i]), ...dissolvePoints(apc, (i, j) => aout[j * aw + i]));
        arm = {img: aimgs, x0, y0, depth, shade: imgs[2].sh, land: aland, out: aout};
      }
      this.guests.push({s, si, flip, toward, r, w, h, land, out, head: topRowAndCentre(img), arm, rowK});
    });
    // ---- his glass at the POV: it comes apart with the people (it was drawn, like them)
    {
      const q = project(POV_CAM, MAS_GLASS)!;
      const x0 = Math.round(q[0] - MAS_GLASS_W / 2), y0 = Math.round(q[1]) - 47;
      const g = masGlassImg();
      const out = new Float32Array(g.w * g.h);
      for (let j = 0; j < g.h; j++) for (let i = 0; i < g.w; i++) out[j * g.w + i] = T.peopleOut[0] + 2 + 8 * h01(i, j, 91);
      this.glass = {x0, y0, depth: q[2], out};
      extra.push(...dissolvePoints({img: g, x0, y0, world: (x, y) => unprojectDepth(POV_CAM, x, y, q[2]), foot: q[2] / F_POV, rim: PAL.C6, grp: GRP.mas}, (i, j) => out[j * g.w + i], () => true, (i, j) => out[j * g.w + i] + 6 + 8 * h01(i, j, 95)));
    }
    // ---- his reflection at the insert: seated behind the reflected table's head end (rows below its edge are hidden)
    {
      const q = project(WIN_CAM, REFL_EYE_W)!;
      const x0 = Math.round(q[0] - REFL_EYE[0]), y0 = Math.round(q[1] - REFL_EYE[1]);
      const m = masReflectionImg();
      const edge = project(WIN_CAM, [2 * WINDOW.c[0] - TABLE.x0, TABLE.top, 0])!;
      const edgeY = Math.round(edge[1]) - 1;
      const out = new Float32Array(m.w * m.h);
      for (let j = 0; j < m.h; j++) for (let i = 0; i < m.w; i++) out[j * m.w + i] = T.peopleOut[0] - 1 + 9 * h01(i, j, 93) + 2 * (j / m.h);
      const vis: Img = {w: m.w, h: m.h, c: new Int32Array(m.c)};
      for (let j = 0; j < m.h; j++) if (y0 + j >= edgeY) for (let i = 0; i < m.w; i++) vis.c[j * m.w + i] = -1;
      this.refl = {x0, y0, depth: q[2], out, edgeY, head: topRowAndCentre(m)};
      extra.push(...dissolvePoints({img: vis, x0, y0, world: (x, y) => unprojectDepth(WIN_CAM, x, y, q[2]), foot: q[2] / F_WIN, rim: PAL.C6, grp: GRP.mas}, (i, j) => out[j * m.w + i], () => true, (i, j) => out[j * m.w + i] + 5 + 7 * h01(i, j, 96)));
      // the window's mullions as they cross him (drawn: the frame in front of the reflection)
      const wn = WINDOW, straight = wn.h - wn.w / 2, wy0 = wn.c[1] - wn.h / 2;
      const mv = project(WIN_CAM, [wn.c[0], 1.2, wn.c[2]])!, mh = project(WIN_CAM, [wn.c[0], wy0 + straight * 0.5, wn.c[2] + 0.3])!;
      this.mull = {x: Math.round(mv[0]), y: Math.round(mh[1])};
    }
    // ---- GERG's shoulder at the insert's left edge: the show's over-the-shoulder silhouette (N0, a rim on the key side)
    {
      const s = SEATS.find((q) => q.who === 'gerg')!;
      const put = (p: V3) => { const q = project(WIN_CAM, p); if (!q) return; const y = Math.round(q[1]), x = Math.round(q[0]); if (y >= 0 && y < H) this.ots[y] = Math.max(this.ots[y], x); };
      for (let k = 0; k <= 60; k++) for (let a = 0; a < 64; a++) {
        const y = 0.5 + (k / 60) * (s.eye - 0.12 - 0.5), an = (a / 64) * Math.PI * 2;
        const hz = 0.12 + 0.05 * Math.min(1, (y - 0.5) / 0.45);
        put([s.x + 0.23 * Math.cos(an), y, s.pz + hz * Math.sin(an)]);
      }
      for (let a = 0; a < 40; a++) for (let b = 0; b < 40; b++) { const th = (a / 40) * Math.PI, ph = (b / 40) * Math.PI * 2; put([s.x + 0.1 * Math.sin(th) * Math.cos(ph), s.eye + 0.04 + 0.12 * Math.cos(th), s.pz + 0.09 * Math.sin(th) * Math.sin(ph)]); }
      // fill gaps between sampled rows
      for (let y = 1; y < H - 1; y++) if (this.ots[y] < 0 && this.ots[y - 1] >= 0 && this.ots[y + 1] >= 0) this.ots[y] = Math.round((this.ots[y - 1] + this.ots[y + 1]) / 2);
    }
    const all = [...build.pts, ...extra];
    const atlas = glyphAtlas();
    this.pv = makePoints(all.filter((q) => q.kind === K.lift), atlas, EXPOSURE, true);
    this.pr = makePoints(all.filter((q) => q.kind !== K.lift), atlas, EXPOSURE, false);
    this.world.scene.add(this.pv, this.pr);
    this.world.points = [this.pv, this.pr];
  }

  card(key: string, img: Img) {
    let e = this.cardTex.get(key);
    if (!e) {
      const tex = imgTex(img.w, img.h, img.c);
      // the same drawing in HDR, so it tones back to its exact colours when it is seen in a knife
      const data = new Float32Array(img.w * img.h * 4);
      for (let y = 0; y < img.h; y++) for (let x = 0; x < img.w; x++) {
        const v = img.c[y * img.w + x]; const i = ((img.h - 1 - y) * img.w + x) * 4;
        if (v < 0) continue;
        const [r, g, b] = fromDisplay(v, EXPOSURE); data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = 1;
      }
      const hdr = new THREE.DataTexture(data, img.w, img.h, THREE.RGBAFormat, THREE.FloatType);
      hdr.magFilter = THREE.NearestFilter; hdr.minFilter = THREE.NearestFilter; hdr.generateMipmaps = false; hdr.colorSpace = THREE.NoColorSpace; hdr.needsUpdate = true;
      e = {tex, hdr};
      this.cardTex.set(key, e);
    }
    return e;
  }

  /** the sprite's card in the world: its native rect unprojected at its depth */
  cardCorners(cam: Cam, x: number, y: number, w: number, h: number, depth: number): [V3, V3, V3, V3] {
    return [unprojectDepth(cam, x, y, depth), unprojectDepth(cam, x + w, y, depth), unprojectDepth(cam, x + w, y + h, depth), unprojectDepth(cam, x, y + h, depth)];
  }

  frame(f: number) {
    const p = plan(f);
    for (const L of [this.pixBg, this.sprites, this.ui, this.shade, this.lens]) L.clear();
    const cards: SpriteCard[] = [];
    if (p.mode === 'pixel') {
      let out: Buf;
      if (p.front?.kind === 'in') {
        // the door: the render front sweeps from the monitor's end; behind it the room is the model's copy and the
        // people are prints in their memory colours
        const A = new OBuf(W, H, PAL.N0); drawWide(A, f, {band: 0});
        const B = new OBuf(W, H, PAL.N0); drawWide(B, f, {band: 0}); tintPeople(B);
        out = renderFront(new Buf(W, H, PAL.N0), A, B, p.front.pos, {dir: 'left', smear: p.front.smear});
      } else if (p.front?.kind === 'out') {
        // the exit: out of the monitor's glow, the front re-renders the [W], landing on Mas and his glass
        const A = new OBuf(W, H, 0x000000); drawMonitor(A, 3);
        const B = new OBuf(W, H, PAL.N0); drawWide(B, f, {band: p.band, flare: p.flare});
        out = renderFront(new Buf(W, H, 0x000000), A, B, p.front.pos, {dir: 'left', smear: p.front.smear});
      } else {
        const b = new OBuf(W, H, PAL.N0);
        drawWide(b, f, {band: p.band, flare: p.flare});
        out = b;
      }
      this.pixBg.fromBuf(out);
    } else {
      for (const P of [this.pv, this.pr]) {
        const u = P.material.uniforms;
        u.uF.value = f; u.uRimCyan.value = p.pts.rimCyan; u.uStream0.value = p.pts.stream0; u.uWinDots.value = p.pts.winDots;
        for (let i = 0; i < u.uDeres.value.length; i++) u.uDeres.value[i] = p.pts.deres[i] ?? 0;
      }
      const needDepth = f >= T.resolve.guests && f < T.peopleOut[1];
      const depth = needDepth ? this.world.readDepth(p.cam) : null;
      const assembled = f >= T.resolve.guests + 18;
      // ---- the guests (far first, near last), at the POV
      const order = [...this.guests].sort((a, b) => (a.s.near === b.s.near ? 0 : a.s.near ? 1 : -1));
      for (const g of order) {
        const {s, r, w} = g;
        const img = guestImg(s.who, s.near, g.flip, g.toward, p.stage, f);
        // shadows and reflections in the world come from the card (a representative drawing per light stage)
        const cimg = guestImg(s.who, s.near, g.flip, g.toward, p.stage, 200);
        const t = this.card(`${s.who}${p.stage}`, cimg);
        const bb = this.cardCorners(POV_CAM, r.x, r.y, cimg.w, cimg.h, r.depth);
        const pw = Math.hypot(bb[1][0] - bb[0][0], bb[1][1] - bb[0][1], bb[1][2] - bb[0][2]);
        const sc = SCONCES.find((q) => q.who === s.who)!;
        const nz = Math.sign(sc.p[2] - s.pz);
        const cx = s.x, cz = s.pz - nz * 0.04;
        const sh: [V3, V3, V3, V3] = [[cx - pw / 2, bb[0][1], cz], [cx + pw / 2, bb[0][1], cz], [cx + pw / 2, bb[3][1], cz], [cx - pw / 2, bb[3][1], cz]];
        const present = f >= T.resolve.guests + 14 && f < T.peopleOut[0] + 6;
        cards.push({key: 'g' + s.who, tex: t.tex, hdrTex: t.hdr, corners: bb, shadowCorners: sh, shadow: present, mirror: present});
        if (p.insert || !depth || f >= T.peopleOut[1]) continue;
        const dy = assembled ? breathe(s.who, f) : 0;
        const occl = new Uint8Array(w * img.h), vis = new Uint8Array(w * img.h);
        for (let j = 0; j < img.h; j++) for (let i = 0; i < w; i++) {
          let v = img.c[j * w + i];
          const rk = g.rowK[Math.min(g.h - 1, Math.max(0, j + dy))];
          if (v < 0 || rk < 0) continue;
          for (let q = 0; q < rk; q++) v = darker(v);
          const k = j * w + i;
          if (f < g.land[k] || f >= g.out[k]) continue;
          const x = r.x + i, y = r.y + j + dy;
          if (x < 0 || y < 0 || x >= W || y >= H) continue;
          if (depth[y * W + x] < r.depth - 0.015) { occl[k] = 1; continue; }
          vis[k] = 1;
          this.sprites.set(x, y, v);
        }
        // contact: where the cloth covers the body, the two rows just above it sit in the table's shadow
        if (assembled) for (let i = 0; i < w; i++) for (let j = img.h - 2; j >= 1; j--) {
          if (!vis[j * w + i] || !occl[(j + 1) * w + i]) continue;
          for (const jj of [j, j - 1]) if (vis[jj * w + i] && g.rowK[jj] === 0) this.sprites.set(r.x + i, r.y + jj + dy, darker(img.c[jj * w + i]));
          break;
        }
        // the far pair's forearm, on the cloth (in front of it; behind anything nearer)
        if (g.arm) {
          const a = g.arm, m = a.img[p.stage];
          for (let j = 0; j < m.h; j++) for (let i = 0; i < m.w; i++) {
            const k = j * m.w + i, x = a.x0 + i, y = a.y0 + j;
            if (f >= a.land[k] + 2 && f < a.out[k] && a.shade.c[y * W + x]) this.shade.set(x, y, 0, a.shade.c[y * W + x] === 2 ? 190 : 100);
            const v = m.c[k];
            if (v < 0 || f < a.land[k] || f >= a.out[k]) continue;
            if (depth[y * W + x] < a.depth - 0.06) continue;
            this.sprites.set(x, y, v);
          }
        }
        // the stat bar over the head (his read of the table)
        const kb = p.bars[s.who as Who];
        if (kb >= 0) { const ub = new UIBuf(); drawBar(ub, BARS[s.who as Who], r.x + Math.round(g.head[1]), r.y + g.head[0] - 4, kb); this.ui.fromBuf(ub); }
      }
      // ---- his glass: pixel, on the real cloth; inside it, the world in pixel (the lens)
      if (p.masGlass > 0 && !p.insert && f < T.peopleOut[1] && depth) {
        const img = masGlassImg(), lens = masGlassLens(), G = this.glass;
        for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) {
          const k = j * img.w + i, x = G.x0 + i, y = G.y0 + j;
          if (x < 0 || y < 0 || x >= W || y >= H || f >= G.out[k]) continue;
          if (p.masGlass < 1 && hash(i, j, 31) >= p.masGlass) continue;
          if (depth[y * W + x] < G.depth - 0.015) continue;
          const v = img.c[k], l = lens.c[k];
          if (v >= 0) this.sprites.set(x, y, v);
          else if (l > 0 && p.masGlass >= 1) this.lens.set(x, y, l === 1 ? 0xff0000 : 0x800000, 255);
        }
        // its contact: the foot's back edge darkens the cloth a pixel wide, and a softer row under it
        if (p.masGlass >= 1) for (let i = 4; i <= 25; i++) { const u = (i - 14.5) / 10.8; if (Math.abs(u) > 1) continue; const yb = G.y0 + 46 + Math.round(Math.sqrt(1 - u * u) * 2.2); this.shade.set(G.x0 + i, yb + 1, 0, 170); this.shade.set(G.x0 + i, yb + 2, 0, 80); }
        const t = this.card('masglass', img);
        cards.push({key: 'masglass', tex: t.tex, hdrTex: t.hdr, corners: this.cardCorners(POV_CAM, G.x0, G.y0, MAS_GLASS_W, MAS_GLASS_H, G.depth), shadow: p.masGlass >= 1 && f < T.peopleOut[0] + 4, mirror: false});
      }
      // ---- the insert: his reflection in the dark glass, the mullions in front of it, the empty plate, GERG's shoulder
      if (p.insert) {
        const behindGlass = (x: number, y: number) => !depth || depth[y * W + x] > WINDOW.c[0] - 0.4;
        const sheen = (x: number, y: number) => { const d = (x + y * 0.55) % 190; return (d > 60 && d < 68) || (d > 76 && d < 79); };
        const barGone = (x: number, y: number) => f >= T.peopleOut[0] + 3 + 7 * h01(x >> 1, y >> 1, 97);
        // he blinks (the only one here who moves, but for the cursor)
        const R = this.refl, m = masReflectionImg(blinkAt(f, 286) || blinkAt(f, 294) as 0 | 1 | 2);
        // the pane has two faces: a faint second image, a few pixels off and two rungs down, sits behind the first
        for (const [ox, oy, k] of [[4, 3, 2], [0, 0, 0]] as Array<[number, number, number]>)
          for (let j = 0; j < m.h; j++) for (let i = 0; i < m.w; i++) {
            let v = m.c[j * m.w + i];
            const x = R.x0 + i + ox, y = R.y0 + j + oy;
            if (v < 0 || y >= R.edgeY || f >= R.out[j * m.w + i]) continue;
            for (let q = 0; q < k; q++) v = darker(v);
            if (k === 0 && sheen(x, y)) v = stepColor(v, 1);
            this.sprites.set(x, y, v);
          }
        // the pane's sheen: two long diagonal bands of the monitor's light across the glass (and across him)
        if (f < T.peopleOut[0] + 8) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (sheen(x, y) && behindGlass(x, y) && this.sprites.get(x, y) < 0 && !barGone(x + 40, y)) this.pixBg.set(x, y, 0x06101a);
        // the window's bars in front of him, at their real width at this lens (a 24 mm mullion, a 30 mm meeting rail)
        const hw = 9, vw = 7;
        for (let y = 0; y < H; y++) for (let x = this.mull.x - vw; x <= this.mull.x + vw; x++) {
          if (!behindGlass(x, y) || barGone(x, y)) continue;
          this.sprites.set(x, y, x === this.mull.x - vw ? PAL.C2 : x === this.mull.x - vw + 1 ? PAL.D2 : x === this.mull.x + vw ? PAL.N0 : x === this.mull.x - vw + 3 ? PAL.D2 : PAL.D1);
        }
        for (let x = 0; x < W; x++) for (let y = this.mull.y - hw; y <= this.mull.y + hw; y++) {
          if (!behindGlass(x, y) || Math.abs(x - this.mull.x) <= vw || barGone(x, y)) continue;
          this.sprites.set(x, y, y === this.mull.y - hw ? PAL.D3 : y === this.mull.y - hw + 1 ? PAL.D2 : y === this.mull.y + hw ? PAL.N0 : y > this.mull.y + hw - 3 ? PAL.D0 : PAL.D1);
        }
        if (p.plate >= 0 && f < T.peopleOut[0] + 6) {
          const ub = new UIBuf();
          const k = f < T.peopleOut[0] + 2 ? p.plate : -1;
          drawEmptyPlate(ub, R.x0 + Math.round(R.head[1]), R.y0 + R.head[0] - 5, k);
          this.ui.fromBuf(ub);
        }
        const otsOn = f < T.peopleOut[0] + 3;
        if (otsOn) for (let y = 0; y < H; y++) { const xr = this.ots[y]; if (xr < 0) continue; for (let x = 0; x <= Math.min(W - 1, xr); x++) this.sprites.set(x, y, x === xr ? PAL.W3 : x === xr - 1 ? PAL.N1 : PAL.N0); }
      }
      // ---- the rim (whose memory: the model's own cyan) and the era slate
      if (p.rim > 0) { const ub = new UIBuf(); drawRim(ub, p.rim); this.ui.fromBuf(ub); }
      if (p.era >= 0) { const ub = new UIBuf(); eraStamp(ub, '2015', p.era, {text: PAL.C7, plate: PAL.N0, rule: PAL.C5}); this.ui.fromBuf(ub); }
      // ---- the camera is back on the side view: the [W]'s monitor lands, holding everything it drank
      if (p.monPixel >= 0) { const b = new OBuf(W, H, PAL.N0); drawMonitor(b, p.monPixel); this.pixBg.fromBuf(b, (i) => b.own[i] === O.monitor); }
    }
    for (const L of [this.pixBg, this.sprites, this.ui, this.shade, this.lens]) L.up();
    this.world.setCards(cards);
    this.world.render({cam: p.camFrom ?? p.cam, camTo: p.camTo, reveal: p.reveal, fresh: p.fresh, light: p.light, fill: p.fill, monitor: p.monitor, samples: p.samples, aperture: p.aperture, focus: p.focus, points: true, bloom: p.bloom,
      present: 1, grain: p.grain, vig: p.vig, masGlass: p.masGlass * (f < T.peopleOut[0] + 6 ? 1 : 0), monScreen: p.monScreen, monFlare: p.monFlare, winMirror: p.winMirror ? (p.insert ? 1 : 0.5) : 0, monHidden: p.monPixel >= 0},
      {pixBg: this.pixBg.tex, sprites: this.sprites.tex, ui: this.ui.tex, shade: this.shade.tex, lens: this.lens.tex}, f);
  }
}

let ENGINE: Engine | null = null;

export const P3: React.FC<{hold?: number; dbg?: string}> = ({hold, dbg}) => {
  const cur = useCurrentFrame();
  const f = hold ?? cur;
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const h = delayRender(`p3 f${f}`, {timeoutInMilliseconds: 600000});
    const cv = ref.current!;
    if (!ENGINE || ENGINE.canvas !== cv) ENGINE = new Engine(cv);
    const e = ENGINE;
    e.ready
      .then(() => { const t0 = performance.now(); e.world.dbg = dbg ?? ''; e.frame(f); console.log(`[p3] f${f} ${(performance.now() - t0).toFixed(0)} ms`); continueRender(h); })
      .catch((err) => cancelRender(err));
  }, [f]);
  return (
    <AbsoluteFill style={{background: '#04050a'}}>
      <canvas ref={ref} width={1920} height={1080} style={{width: '100%', height: '100%'}} />
    </AbsoluteFill>
  );
};
