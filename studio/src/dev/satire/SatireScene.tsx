// SATIRE structure — the 5 s test beat, staged on a miniature puppet set.
// Shot A (0-83) wide: typing, door bursts, NOLE thrust in on his rod, "I came up with the name!"
// Shot B (84-107) MCU: Mas's eyes lead, the head follows, one blink, the tiniest smile: "super."
// Shot C (108-119) wide: Nole slams the desk; the whole miniature jolts — except Mas's water.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT} from '../../shared/theme/fonts';
import {clamp, easeInOut, easeOut, kf, kfl, lerp, ring, wob, type XY} from './lib';
import {PuppetDefs, bl} from './kit';
import {MasHead, MAS_REST, type PuppetPose} from './MasHead';
import {NoleHead, NOLE_REST} from './NoleHead';
import {MasArms, MasTorso, NolePhoneArm, NoleTorso} from './Bodies';
import {BackSet, Chair, Desk, Haze, Keyboard, Monitor, Mug, Orb, Vignette, WaterGlass} from './Set';

export const MAS_POS: XY = [790, 396];
export const MAS_S = 0.95;
export const NOLE_POS: XY = [1440, 318];
export const NOLE_S = 0.88;
const SLAM = 29;
const THUD = 110;

export interface SceneState {
  t: number;
  shot: 'A' | 'B' | 'C';
  cam: {s: number; cx: number; cy: number; tx: number; ty: number; rot: number};
  bgBlur: number;
  fgBlur: number;
  key: number;
  door: number;
  doorLight: number;
  shelfJolt: number;
  jolt: number;
  mas: PuppetPose;
  masBody: {dx: number; dy: number; rot: number; breath: number; sway: number; hl: number; hr: number};
  nole: PuppetPose;
  noleBody: {x: number; y: number; rot: number; headDx: number; headDy: number; headRot: number; shoulder: number; elbow: number; smear: number; phone: number; wrist: XY; handTilt: number};
  caption: {who: 'nole' | 'mas'; text: string} | null;
}

export const sceneState = (t: number): SceneState => {
  const shot: SceneState['shot'] = t < 84 ? 'A' : t < 108 ? 'B' : 'C';
  const key = 0.9 + wob('flick', t, 0.35, 0.06) + (Math.floor(t / 5) % 3 === 0 ? 0.03 : 0);

  // ---- door burst + the room's shock ----
  const door = t < 26 ? 0 : kf(t, [[26, 0], [29, 1], [32, 0.86], [35, 0.95], [39, 0.92]], easeOut) + (t > THUD ? ring(t, THUD, 1.1, 0.2) * 0.03 : 0);
  const doorLight = t < 26 ? 0 : kf(t, [[26, 0], [28, 0.7], [29.5, 1.3], [34, 1]], (x) => x);
  const jolt = ring(t, THUD, 1.25, 0.2);
  const slamShake = ring(t, SLAM, 1.6, 0.3);
  const shelfJolt = slamShake * 0.8 + jolt;

  // ---- camera ----
  let cam = {s: 1, cx: 960, cy: 540, tx: 960, ty: 540, rot: 0};
  if (shot === 'A') {
    const s = lerp(1.05, 1.1, easeInOut(t / 84));
    cam = {s, cx: 980, cy: 498, tx: 960, ty: 540, rot: 0};
    cam.tx += slamShake * 7;
    cam.ty += slamShake * 4;
    cam.rot = slamShake * 0.25;
  } else if (shot === 'B') {
    const u = (t - 84) / 24;
    const s = lerp(1.72, 1.8, u);
    cam = {s, cx: MAS_POS[0] + 70 + u * 16, cy: MAS_POS[1] + 90, tx: 900, ty: 540, rot: 0};
  } else {
    cam = {s: 1.12, cx: 1000, cy: 506, tx: 960, ty: 540, rot: 0};
    // the camera is on a pedestal: it barely registers the thud
    cam.ty += jolt * 2;
  }

  // ---- MAS ----
  const typing = t < 70 ? clamp((70 - t) / 8) : 0;
  const hl = typing * Math.max(0, Math.sin(t * 0.95));
  const hr = typing * Math.max(0, Math.sin(t * 0.95 + 2.3));
  const read = Math.floor(t / 7) % 2 === 0 ? -0.46 : -0.3;
  const turn = easeInOut((t - 88) / 13);
  const yaw = lerp(-0.36, 0.24, turn);
  const pitch = lerp(-0.1, 0.1, turn);
  let gazeX = t < 85 ? read : lerp(0.62, 0.2, easeInOut((t - 88) / 12));
  let gazeY = t < 85 ? -0.14 : lerp(0.26, 0.14, easeInOut((t - 88) / 12));
  if (t >= 85 && t < 86) {
    gazeX = 0.3;
    gazeY = 0.08;
  }
  const baseLid = 0.3;
  const lid = kf(t, [[95, baseLid], [97, 1], [99, 1], [102, baseLid]], (x) => x);
  const smile = kf(t, [[99, 0.12], [106, 0.46]]);
  const jaw = kfl(t, [[101, 0], [102.5, 0.3], [104, 0.08], [105.5, 0.24], [107.5, 0]]);
  const hair = 5 * slamShake + 10 * jolt - 7 * ring(t, 89, 0.5, 0.12) + wob('mh', t, 0.08, 1.2);
  const masBob = typing * Math.sin(t * 1.9) * 1.2 + jolt * 5;
  const mas: PuppetPose = {
    ...MAS_REST,
    yaw,
    pitch,
    lid,
    smile,
    jaw,
    gazeX,
    gazeY,
    brow: t > 100 ? 0.15 : 0,
    key,
    rim: doorLight * 0.85,
    hair,
    light: [-0.95, -0.12],
  };
  const masBody = {
    dx: 0,
    dy: masBob,
    rot: jolt * 0.6,
    breath: (Math.sin(t * 0.16) + 1) / 2,
    sway: Math.sin(t * 0.21) * 3 + slamShake * 8 + jolt * 16,
    hl,
    hr,
  };

  // ---- NOLE ----
  // puppeteer thrusts him in on an arc from off-screen right, a hop, an overshoot, a settle
  const nx = t < 30 ? 1500 : kf(t, [[30, 1500], [37, -46], [41, 14], [46, 0]], easeOut);
  const ny = t < 30 ? 140 : kf(t, [[30, 140], [34, -40], [37, -10], [40, 6], [44, 0]], (x) => x);
  const lean = kf(t, [[45, 0], [53, 1], [82, 1], [90, 0.8]]);
  const thrust = kf(t, [[106, 0], [108, -0.4], [110, 1.2], [113, 0.9], [119, 0.9]]);
  const nJaw = kfl(t, [
    [49, 0], [51, 0.55], [53, 0.12], [54, 0.1], [56, 0.9], [58.5, 0.15], [60, 0.2], [61.5, 0.5], [63, 0.1], [64.5, 0.38], [66, 0.06],
    [67, 0.08], [68, 0.32], [69.5, 0.06], [71, 0.6], [72.5, 1], [77, 0.85], [80, 0.12], [82, 0],
    [109, 0], [111, 0.75], [115, 0.6], [119, 0.35],
  ]);
  const syll = nJaw; // head bobs back on each open
  const jab = Math.max(0, ring(t, 55, 0.9, 0.35)) + Math.max(0, ring(t, 71, 0.8, 0.28)) * 1.3;
  const entryLag = ring(t, 37, 0.55, 0.14);
  const noleHeadRot = -entryLag * 10 + syll * 3 - lean * 4 + jolt * 3 + (t > THUD ? ring(t, THUD, 0.7, 0.12) * 6 : 0);
  const nole: PuppetPose = {
    ...NOLE_REST,
    yaw: -0.26 - lean * 0.06,
    pitch: -0.06 - lean * 0.04 + syll * 0.05,
    jaw: nJaw,
    smile: t > 108 ? 0.9 : 0.55 + (t > 80 ? 0.2 : 0),
    lid: kf(t, [[40, 0.34], [70, 0.22], [82, 0.3], [100, 0.34], [110, 0.18]]),
    gazeX: -0.36,
    gazeY: -0.12,
    brow: kf(t, [[40, 0.2], [50, 0.5], [70, 0.4], [72, 1], [80, 0.9], [90, 0.4], [110, 1]]),
    key: key * (0.3 + lean * 0.25),
    rim: doorLight,
    hair: entryLag * 8,
    phone: t > 42 ? 1 : 0,
    light: [-0.9, 0.22],
    exposure: 0.62 + lean * 0.14,
  };
  const bx = NOLE_POS[0] + nx - lean * 64 - thrust * 20;
  const by = NOLE_POS[1] + ny + lean * 18 + thrust * 10;
  const toLocal = (w: XY): XY => [(w[0] - bx) / NOLE_S, (w[1] - by) / NOLE_S];
  // phone hand: raised in the gap between the two heads, jabbing toward Mas; then the slam onto the desk
  const raised: XY = [-340 - jab * 56 - lean * 14, 392 - jab * 30 + Math.sin(t * 0.5) * 4];
  const slamW = toLocal([1110, 818]);
  const sl = easeInOut(clamp((t - 106) / 4));
  const wrist: XY = t < 106 ? raised : [lerp(-350, slamW[0], sl), lerp(330, slamW[1], sl)];
  const noleBody = {
    wrist,
    handTilt: t < 106 ? -14 - jab * 14 : lerp(-14, 4, sl),
    x: bx,
    y: by,
    rot: -lean * 5 + entryLag * 4 - thrust * 3,
    headDx: -lean * 30 - entryLag * 18,
    headDy: 26 + lean * 10 - syll * 6,
    headRot: noleHeadRot,
    shoulder: t < 106 ? -38 - lean * 6 - jab * 14 : lerp(-44, -30, clamp((t - 106) / 4)),
    elbow: t < 106 ? -108 + jab * 26 : lerp(-110, -40, easeInOut(clamp((t - 106) / 4))),
    smear: t >= 30 && t < 38 ? clamp(1 - Math.abs(t - 33) / 5) : 0,
    phone: t > 42 ? 1 : 0.2,
  };

  let caption: SceneState['caption'] = null;
  if (t >= 50 && t < 84) caption = {who: 'nole', text: 'I came up with the name!'};
  if (t >= 101 && t < 116) caption = {who: 'mas', text: 'super.'};

  return {
    t,
    shot,
    cam,
    bgBlur: shot === 'B' ? 10 : 5,
    fgBlur: shot === 'B' ? 20 : 12,
    key,
    door,
    doorLight,
    shelfJolt,
    jolt,
    mas,
    masBody,
    nole,
    noleBody,
    caption,
  };
};

const camT = (c: SceneState['cam']) => `translate(${c.tx} ${c.ty}) rotate(${c.rot}) scale(${c.s}) translate(${-c.cx} ${-c.cy})`;

export const World: React.FC<{st: SceneState}> = ({st}) => {
  const {mas, masBody: mb, nole, noleBody: nb} = st;
  const L: XY = [-0.95, -0.12];
  const LN: XY = [-0.9, 0.22];
  const jo = st.jolt;
  const masT = `translate(${MAS_POS[0] + mb.dx} ${MAS_POS[1] + mb.dy}) rotate(${mb.rot}) scale(${MAS_S})`;
  const noleT = `translate(${nb.x} ${nb.y}) rotate(${nb.rot}) scale(${NOLE_S})`;
  const noleHeadT = `translate(${nb.headDx} ${nb.headDy}) rotate(${nb.headRot} 0 200)`;
  const smear = nb.smear;
  const armB = {L: LN, key: Math.min(1, nole.key * 1.6), rim: nole.rim, phone: nb.phone, shoulder: nb.shoulder, elbow: nb.elbow, lean: 0};
  // the elbow always lives below the playboard; only the forearm + hand are ever seen
  const noleArm = st.shot === 'C' ? null : <NolePhoneArm b={armB} rodTo={[-330, 1400]} wrist={nb.wrist} handTilt={nb.handTilt} part="fore" />;
  const noleFore = <NolePhoneArm id="na2" b={armB} rodTo={[-330, 1400]} wrist={nb.wrist} handTilt={nb.handTilt} part="fore" />;
  return (
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
      <PuppetDefs />
      <defs>
        <filter id="dofbg" filterUnits="userSpaceOnUse" x="-400" y="-400" width="2720" height="1880">
          <feGaussianBlur stdDeviation={st.bgBlur} />
        </filter>
        <filter id="doffg" filterUnits="userSpaceOnUse" x="-600" y="-400" width="3000" height="1880">
          <feGaussianBlur stdDeviation={st.fgBlur} />
        </filter>
        <filter id="smear" filterUnits="userSpaceOnUse" x="-3000" y="-3000" width="6000" height="6000">
          <feGaussianBlur stdDeviation={`${smear * 26} ${smear * 3}`} />
        </filter>
      </defs>
      <rect width={1920} height={1080} fill="#05080B" />
      <g transform={camT(st.cam)}>
        <g filter="url(#dofbg)">
          <BackSet door={st.door} doorLight={st.doorLight} lit={st.key} shelfJolt={st.shelfJolt} t={st.t} masShadowX={MAS_POS[0] + 250} />
        </g>
        {/* NOLE behind the desk (the desk is the playboard) */}
        <g filter={smear > 0.02 ? 'url(#smear)' : undefined}>
          <g transform={noleT}>
            <NoleTorso b={{L: LN, key: nole.key, rim: nole.rim, phone: nb.phone, shoulder: nb.shoulder, elbow: nb.elbow, lean: 0}} />
            <g transform={noleHeadT}>
              <NoleHead p={nole} />
            </g>
          </g>
        </g>
        <Chair rim={st.doorLight * 0.9} lit={st.key} />
        {/* MAS */}
        <g transform={masT}>
          <MasTorso b={{L, key: st.key, rim: mas.rim, breath: mb.breath, sway: mb.sway}} />
          <MasHead p={mas} />
        </g>
        <g filter={smear > 0.02 ? 'url(#smear)' : undefined}>
          <g transform={noleT}>{noleArm}</g>
        </g>
        <Desk key2={st.key} doorLight={st.doorLight} jolt={jo} />
        <Orb jolt={jo} key2={st.key} doorLight={st.doorLight} />
        <Keyboard key2={st.key} jolt={jo} hl={mb.hl} hr={mb.hr} />
        <g transform={masT}>
          <MasArms b={{L, key: st.key, rim: mas.rim, breath: mb.breath, sway: mb.sway}} hl={mb.hl} hr={mb.hr} />
        </g>
        <Mug jolt={jo} t={st.t} t0={THUD} key2={st.key} doorLight={st.doorLight} />
        {st.shot === 'C' ? <g transform={noleT}>{noleFore}</g> : null}
        <WaterGlass key2={st.key} doorLight={st.doorLight} glint={st.t >= 113 ? Math.sin(clamp((st.t - 113) / 6) * Math.PI) : 0} />
        <Haze doorLight={st.doorLight} lit={st.key} />
        <g filter="url(#doffg)">
          <Monitor key2={st.key} jolt={jo} />
        </g>
      </g>
      <Vignette amt={0.8} />
    </svg>
  );
};

const Caption: React.FC<{c: SceneState['caption']}> = ({c}) => {
  if (!c) return null;
  const col = c.who === 'nole' ? '#FFE14A' : '#7FF0F6';
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 30, display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          fontFamily: FONT.bass,
          fontWeight: 700,
          fontSize: 50,
          letterSpacing: 0.5,
          color: col,
          background: 'rgba(0,0,0,0.82)',
          padding: '6px 22px 10px',
          lineHeight: 1.1,
        }}
      >
        {c.text}
      </div>
    </div>
  );
};

const Bug: React.FC = () => (
  <div style={{position: 'absolute', right: 70, top: 56, fontFamily: FONT.wordmark, fontWeight: 600, fontSize: 30, letterSpacing: 6, color: 'rgba(255,255,255,0.42)'}}>
    MR·MAS
  </div>
);

export const SatireFrame: React.FC<{t: number; captions?: boolean}> = ({t, captions = true}) => {
  const st = sceneState(t);
  return (
    <AbsoluteFill style={{background: '#05080B'}}>
      <World st={st} />
      <FilmGrain seed={Math.floor(t / 2)} />
      <Bug />
      {captions ? <Caption c={st.caption} /> : null}
    </AbsoluteFill>
  );
};

const FilmGrain: React.FC<{seed: number}> = ({seed}) => (
  <AbsoluteFill style={{mixBlendMode: 'overlay', opacity: 0.22, pointerEvents: 'none'}}>
    <svg width="100%" height="100%">
      <filter id={`sg-${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency={0.85} numOctaves={2} seed={seed} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#sg-${seed})`} />
    </svg>
  </AbsoluteFill>
);

export const SatireScene: React.FC = () => {
  const f = useCurrentFrame();
  return <SatireFrame t={f} />;
};

export {bl};
