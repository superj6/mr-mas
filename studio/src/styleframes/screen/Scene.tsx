import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, useCurrentFrame} from 'remotion';
import {C, UI, MONO, Win, Pill, Caps, MenuBar, Toast, Post, Wave, WaterWidget, Cursor, Dock, Icon} from './ui';
import {LineScreen, mixRgb} from './LineScreen';
import {paintMasFeed, paintNoleFeed, paintNoleBust, MasFeed, NoleFeed} from './feeds';
import {NOLE_LINE, NOLE_WORDS, NoleMouth, noleTone} from './noleTone';
import {Wallpaper} from './Wallpaper';
import {T, E, tw, track, springStep, ring, hash, noise1, twos, lerp, clamp, inv} from './anim';
import {FONT} from '../../shared/theme/fonts';

// ---------------------------------------------------------------- layout (world = the 1920x1080 desktop)
const PRES = {x: 56, y: 64, w: 560, tileH: 420};
const WIDGET = {x: 372, y: 612};
const CALL = {x: 668, y: 58, w: 900, tileH: 600};
const TERM = {x: 1010, y: 150, w: 820, h: 520};
const TOAST_X = 1500;

export interface Cam {
  cx: number;
  cy: number;
  s: number;
}

// ---------------------------------------------------------------- fonts gate
const useFonts = () => {
  const [h] = useState(() => delayRender('screen-fonts'));
  useEffect(() => {
    Promise.all(['300 16px Jost', '400 16px Jost', '500 16px Jost', '600 16px Jost', '800 16px Jost', '400 16px "JetBrains Mono"', '700 16px "JetBrains Mono"', 'italic 400 16px "Bodoni Moda"', '400 16px Anton'].map((f) => document.fonts.load(f)))
      .then(() => document.fonts.ready)
      .catch(() => undefined)
      .then(() => continueRender(h));
  }, [h]);
};

// ---------------------------------------------------------------- camera
export const camAt = (f: number): Cam => {
  if (f >= T.impact) return {cx: 792, cy: 512, s: 1.24};
  if (f > T.whip && f < T.whipEnd) {
    const k = E.whip(inv(T.whip, T.whipEnd, f));
    return {cx: lerp(1228, 533, k), cy: lerp(418, 338, k), s: lerp(1.5, 1.8, k)};
  }
  if (f > T.slam && f < 34) {
    const k = E.out(inv(T.slam, 34, f));
    return {cx: lerp(850, 960, k), cy: lerp(492, 540, k), s: lerp(1.24, 1.0, k)};
  }
  const cx = track(f, [[0, 668], [T.slam, 850], [34, 960], [46, 960], [60, 1236], [80, 1228], [86, 533], [108, 507]], E.io);
  const cy = track(f, [[0, 446], [T.slam, 492], [34, 540], [46, 540], [60, 426], [80, 418], [86, 338], [108, 346]], E.io);
  const s = track(f, [[0, 1.46], [T.slam, 1.24], [34, 1.0], [46, 1.0], [60, 1.42], [80, 1.5], [86, 1.8], [108, 1.9]], E.io);
  return {cx, cy, s};
};

/** Adaptive-bitrate tiers: the feeds re-screen finer as the camera pushes in (like a stream upgrading). */
export const tierOf = (s: number) => (s < 1.2 ? 1 : s < 1.65 ? 1.41 : 1.9);

// ---------------------------------------------------------------- character timing
const nolePose = (f: number): NoleFeed => {
  const g = twos(f);
  const enter = springStep(g, T.burst, 0.7, 0.55);
  const ex = lerp(860, 0, enter);
  const exPrev = lerp(860, 0, springStep(g - 2, T.burst, 0.7, 0.55));
  const lean = tw(g, T.lean, T.lean + 12, 0, 1, E.out);
  const breathe = Math.sin(g * 0.55) * 5 * (1 - lean * 0.6);
  let mouth: NoleMouth = g < T.burst + 4 ? 'ah' : 'grin';
  let brow = 0.35;
  let tilt = 0;
  const sp = g - T.speech;
  if (sp >= 0 && g < T.speechEnd) {
    for (const v of NOLE_LINE) if (sp >= v.at) mouth = v.m;
    brow = sp >= 20 ? 0.7 : -0.45;
    tilt = sp >= 4 && sp < 10 ? -2.5 : sp >= 20 && sp < 27 ? 3 : 0;
  }
  // phone: raised on the line, three jabs at the lens
  const jab = (a: number) => Math.max(0, Math.sin(clamp((g - a) / 6) * Math.PI));
  const j = g >= T.speech ? jab(T.speech + 4) + jab(T.speech + 12) + jab(T.speech + 20) * 1.3 : 0;
  const raise = tw(g, T.speech - 4, T.speech + 2, 0, 1, E.out);
  const doorOpen = g < T.burst ? 0 : clamp(1 - 0.35 * ring(g, T.burst + 2, 0.12, 8) - 0.1 * Math.min(1, (g - T.burst) / 30));
  return {
    rig: {mouth, brow, tilt, lookX: 0, lookY: -0.1 + j * 0.2, lid: 0.12},
    x: ex + lean * -20,
    y: breathe + lean * 78 + j * 10,
    scale: lerp(0.72, 1.0, lean) * (1 + j * 0.02),
    rot: lerp(10, 0, enter),
    smear: (exPrev - ex) * 0.8,
    present: g >= T.burst,
    door: doorOpen,
    phone: raise > 0 ? {x: 200 - j * 26, y: lerp(760, 470, raise) - j * 40, s: 0.92 + j * 0.3, rot: -12 + j * 5, glow: 1} : null,
    light: 1 + j * 0.08,
  };
};

const masPose = (f: number): MasFeed => {
  const g = twos(f);
  const typing = g < T.slam;
  const turn = tw(g, T.turn0, T.turn1, 0, 1, E.io);
  const dart = tw(g, T.eyeDart - 1, T.eyeDart + 1, 0, 1, E.out);
  const baseLook = typing ? 0.26 + 0.14 * noise1(g * 0.35, 2) : g < T.eyeDart ? 0.5 : 0.5;
  const lookX = lerp(baseLook, -0.72, dart);
  const lid = g >= T.blink && g < T.blink + 6 ? [1, 0.55, 0.2][Math.floor((g - T.blink) / 2)] : 0.12;
  const flash = f >= T.slam && f < T.slam + 6 ? 1 - (f - T.slam) / 6 : 0;
  return {
    rig: {lookX, lookY: typing ? 0.2 : 0.05, lid, mouth: g >= T.smile ? 'smile' : 'rest', brow: 0.1 + 0.15 * turn, tilt: 4 * turn + (typing ? noise1(g * 0.5) * 0.6 : 0), turn},
    headDx: -22 * turn,
    bx: -7 * turn,
    by: typing ? Math.abs(Math.sin(g * 1.9)) * 1.6 : Math.sin(g * 0.2) * 1.2,
    light: 1 + 0.05 * noise1(f * 0.7, 5) + flash * 0.5,
  };
};

/** How much of Nole's orange light spills onto Mas's feed. */
const warmth = (f: number) => {
  if (f < T.slam) return 0;
  const flash = f < T.slam + 6 ? 0.75 * (1 - (f - T.slam) / 6) : 0;
  const base = track(f, [[T.slam, 0.3], [T.speech, 0.34], [T.whip, 0.34], [T.turn1, 0.06]], E.io);
  return Math.max(flash, base);
};

// ---------------------------------------------------------------- the Z flood
const POSTS: Post[] = [
  {text: 'I came up with the name!', likes: '12.4K', reposts: '2.1K'},
  {text: 'I CAME UP WITH THE NAME', loud: true, likes: '31.0K', reposts: '8.8K'},
  {voice: 3, likes: '44.2K', reposts: '9.9K'},
  {text: 'the name is perfect. no notes.', likes: '58.7K', reposts: '12K'},
  {text: 'came up with it in 4 seconds', likes: '61.3K', reposts: '14K'},
  {text: 'NAME >>>>>>>>>>>', loud: true, likes: '70.1K', reposts: '19K'},
  {text: 'you will all be saying it', likes: '77.0K', reposts: '21K'},
  {text: 'I came up with the name!!!', loud: true, likes: '88.8K', reposts: '26K'},
  {text: 'historians will study this name', likes: '90.2K', reposts: '27K'},
  {text: 'reposting myself. it is that good', likes: '95.5K', reposts: '30K'},
  {text: 'NAMED IT', loud: true, likes: '99.9K', reposts: '33K'},
  {text: 'I came up with the name!', likes: '101K', reposts: '35K'},
];
const ARRIVE = [52, 57, 61, 64, 67, 69, 71, 72, 74, 75, 76, 77];

export const NoleAvatar: React.FC<{size?: number}> = ({size = 42}) => (
  <LineScreen
    width={size}
    height={size}
    dpr={2}
    staticKey={`nole-av-${size}`}
    pitch={size / 15}
    soften={0.5}
    floor={0.03}
    bg={C.orangeDeep}
    ink={C.orangeInk}
    hi="#FFF1DF"
    paint={(c, w, h) => paintNoleBust(c, w, h, w * 0.5, h * 0.52, (size * 1.25) / 520, {mouth: 'grin', brow: 0.3}, 0.3)}
  />
);

// ---------------------------------------------------------------- scene
export const ScreenScene: React.FC<{frame?: number; cam?: Cam; noCursor?: boolean}> = ({frame, cam: camOverride, noCursor}) => {
  useFonts();
  const vf = useCurrentFrame();
  const f = frame ?? vf;
  const cam = camOverride ?? camAt(f);
  const dev = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const feedDpr = Math.min(3, dev * cam.s * 1.05);
  const tier = tierOf(cam.s);
  const base = dev >= 1 ? 4.7 : 5.6;
  // a stream quality switch reads as 2 frames of row slip
  const switching = !camOverride && (tierOf(camAt(f - 1).s) !== tier || tierOf(camAt(f - 2).s) !== tier) && !(f > T.whip && f < T.whipEnd + 1) && f < T.impact;
  const impactSlip = f >= T.impact && f < T.impact + 3 ? (r: number) => hash(Math.floor(r / 6) * 1.7 + f) * 60 * (1 - (f - T.impact) / 3) : undefined;

  // --- slam / takeover
  const inCall = f >= T.slam;
  const callK = springStep(f, T.slam, 0.9, 0.7);
  const callX = lerp(1960, CALL.x, callK);
  const callV = lerp(1960, CALL.x, springStep(f - 1, T.slam, 0.9, 0.7));
  const callVel = callX - callV;
  const stretch = 1 + Math.min(0.14, Math.abs(callVel) / 3500);

  // button jolt: every window, never the water
  const jolt = (seed: number, amp = 1): string => {
    const t = f - T.impact;
    if (t < 0) return '';
    const a = Math.exp(-t / 7) * amp;
    const sx = hash(seed * 7.1) > 0 ? 1 : -1;
    const x = 34 * a * Math.cos(t * 1.25 + seed) * sx;
    const y = 24 * a * Math.sin(t * 1.6 + seed * 1.7 + 0.6);
    const r = 2.8 * a * Math.cos(t * 1.1 + seed * 2.3);
    const sk = 3.4 * a * Math.sin(t * 1.4 + seed * 0.9);
    return ` translate(${x}px, ${y}px) rotate(${r}deg) skewX(${sk}deg)`;
  };
  // small bump when the call window lands against Mas's window
  const bump = ring(f, T.slam + 3, 0.3, 3) * 9;

  // terminal gets knocked down-right by the incoming window
  const knock = springStep(f, T.slam + 1, 0.45, 0.42);
  const termT = `translate(${170 * knock}px, ${560 * knock}px) rotate(${2.2 * knock + 5 * ring(f, T.slam + 1, 0.12, 6)}deg)`;

  // --- clocks / badges
  const arrived = ARRIVE.filter((a) => f >= a).length;
  const zBadge = arrived === 0 ? 0 : Math.min(140, arrived * 9 + Math.max(0, f - 60) * 3);
  const callSecs = inCall ? Math.floor((f - T.slam) / 24) + 1 : 0;

  // --- feeds
  const mas = masPose(f);
  const nole = nolePose(f);
  const wk = warmth(f);
  const masInk = mixRgb(C.cyanInk, '#FF9A6A', wk * 0.8);
  const masHi = mixRgb('#E6FEFF', '#FFE9DA', wk);

  // Nole feed "connects": sync roll then lock
  const connecting = f >= T.connect - 1 && f < T.burst + 1;
  const rollShift = (row: number) => (connecting ? hash(row * 0.37 + f * 3.1) * 120 * (hash(Math.floor(row / 9) + f) > 0.2 ? 1 : 0.1) : f < T.settle ? hash(row * 0.9 + f) * 3 : 0);
  const rollGain = (row: number) => (connecting ? 0.4 + 0.8 * Math.abs(hash(Math.floor(row / 14) + f * 1.3)) : 1);

  // --- speech
  const speaking = f >= T.speech && f < T.speechEnd + 2;
  const level = speaking ? 0.55 + 0.45 * Math.abs(Math.sin((f - T.speech) * 0.9)) : inCall && f < T.whip ? 0.18 : 0.08;
  const words = NOLE_WORDS.filter((w) => f >= T.speech + w.at);
  const capOn = f >= T.speech && f < T.whip + 4;

  // --- Mas's reply: typed, deleted, retyped
  const draft = (() => {
    if (f < T.type1) return '';
    if (f < T.del) return 'Super!'.slice(0, Math.min(6, f - T.type1 + 1));
    if (f < T.type2) return 'Super!'.slice(0, Math.max(0, 6 - (f - T.del + 1) * 2));
    if (f < T.send) return 'super.'.slice(0, Math.min(6, Math.floor((f - T.type2) * 1.5) + 1));
    return '';
  })();
  const sent = f >= T.send;
  const sentK = f >= T.send ? 0.35 + 0.65 * springStep(f, T.send - 1, 0.8, 0.5) : 0;
  // Nole's reply: sent with SLAM
  const slamK = f < T.slamIn ? 0 : E.in(inv(T.slamIn, T.impact, f));
  const slamScale = f < T.impact ? lerp(3.4, 1, slamK) : 1 - 0.08 * ring(f, T.impact, 0.35, 3);

  // --- cursor
  const cur = (() => {
    if (f < T.slam) return {x: 1500 + f * 1.5, y: 610 - f * 0.8, rot: 0, click: 0};
    if (f < T.whip) {
      const k = springStep(f, T.slam + 1, 0.4, 0.35);
      return {x: lerp(1536, 1320, k), y: lerp(591, 930, k), rot: 25 * ring(f, T.slam + 1, 0.2, 5), click: 0};
    }
    const k = tw(f, T.whip, T.click, 0, 1, E.io);
    return {x: lerp(1320, 250, k), y: lerp(930, 552, k), rot: 0, click: f >= T.click ? (f - T.click) / 6 : 0};
  })();

  const presTitle = inCall ? 'Presence — Call with NOLE' : 'Presence — Camera';
  const composerOn = tw(f, T.land + 6, T.land + 12, 0, 1, E.out);

  // camera shake on the takeover (screen jolts); never during the button (the water must be still)
  const shakeA = f >= T.slam && f < T.slam + 10 ? Math.exp(-(f - T.slam) / 3) * 18 : 0;
  const shx = shakeA * hash(f * 1.31);
  const shy = shakeA * hash(f * 2.17 + 4);
  const worldT = `translate(${960 - cam.cx * cam.s + shx}px, ${540 - cam.cy * cam.s + shy}px) scale(${cam.s})`;
  const whipBlur = f > T.whip && f < T.whipEnd ? Math.sin(inv(T.whip, T.whipEnd, f) * Math.PI) * 28 : 0;

  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="whip-blur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation={`${whipBlur} ${whipBlur * 0.15}`} />
        </filter>
      </svg>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: worldT, filter: whipBlur > 1 ? 'url(#whip-blur)' : undefined}}>
        <Wallpaper />

        {/* ---------------- TERMINAL ---------------- */}
        <div style={{position: 'absolute', left: 0, top: 0, transform: termT + jolt(4, 0.8), transformOrigin: `${TERM.x + TERM.w / 2}px ${TERM.y}px`}}>
          <Win x={TERM.x} y={TERM.y} w={TERM.w} title="mas — ~/lab — zsh" active={!inCall}>
            <Terminal f={f} />
          </Win>
        </div>

        {/* ---------------- CALL WINDOW (NOLE) ---------------- */}
        {inCall && (
          <>
            {Math.abs(callVel) > 30 &&
              [0.55, 0.3, 0.14].map((o, i) => (
                <div key={i} style={{position: 'absolute', left: callX + callVel * (0.35 + i * 0.3), top: CALL.y, width: CALL.w, height: CALL.tileH + 110, borderRadius: 14, background: `linear-gradient(90deg, rgba(255,90,31,${o * 0.3}), rgba(255,90,31,0))`, borderLeft: `3px solid rgba(255,140,80,${o})`}} />
              ))}
            <div style={{position: 'absolute', left: 0, top: 0, transform: `${jolt(2, 1.1)}`, transformOrigin: `${CALL.x + CALL.w / 2}px ${CALL.y + 360}px`}}>
              <div style={{position: 'absolute', left: callX - CALL.x, top: 0, transform: `scaleX(${stretch})`, transformOrigin: `${CALL.x}px ${CALL.y}px`}}>
                <Win
                  x={CALL.x}
                  y={CALL.y}
                  w={CALL.w}
                  title="Presence — NOLE"
                  glow={speaking ? 'rgba(255,90,31,0.18)' : 'rgba(255,90,31,0.08)'}
                  titleLeft={
                    <Pill bg="rgba(255,90,31,0.14)" border="rgba(255,90,31,0.5)" color={C.orangeHot} style={{marginLeft: 16, height: 22, fontSize: 11.5}}>
                      AUTO-JOINED · DND OVERRIDE
                    </Pill>
                  }
                  titleRight={<span style={{fontFamily: UI, fontSize: 13, color: C.sub, fontVariantNumeric: 'tabular-nums'}}>00:0{callSecs}</span>}
                >
                  <div style={{position: 'relative', width: CALL.w, height: CALL.tileH, overflow: 'hidden'}}>
                    <LineScreen width={CALL.w} height={CALL.tileH} dpr={feedDpr} pitch={(base * 1.08) / tier} soften={1.3} floor={0.03} gamma={1.1} gain={1.08} bg={C.orangeDeep} ink={C.orangeInk} hi="#FFF1DF" rowShift={impactSlip ?? (switching ? (r) => hash(r * 0.7 + f) * 14 : rollShift)} rowGain={rollGain} paint={(c, w, h) => paintNoleFeed(c, w, h, nole)} />
                    {/* active speaker ring */}
                    <div style={{position: 'absolute', inset: 0, boxShadow: speaking ? `inset 0 0 0 3px ${C.orange}, inset 0 0 40px rgba(255,90,31,0.35)` : 'none'}} />
                    <div style={{position: 'absolute', left: 16, top: 14, display: 'flex', gap: 8}}>
                      <Pill>
                        <div style={{width: 7, height: 7, borderRadius: 4, background: C.orange}} />
                        NOLE
                      </Pill>
                    </div>
                    <div style={{position: 'absolute', right: 16, top: 14}}>
                      <Pill color={C.sub}>
                        {Icon.lines(11, C.orangeHot)} <span style={{letterSpacing: '0.14em', fontSize: 11}}>LOW-LIGHT</span>
                      </Pill>
                    </div>
                    {connecting && (
                      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Caps color={C.orangeHot} size={16}>connecting</Caps>
                      </div>
                    )}
                    {/* live captions: the dialogue's native form */}
                    {capOn && (
                      <div style={{position: 'absolute', left: 0, right: 0, bottom: 26, display: 'flex', justifyContent: 'center', opacity: f > T.whip ? 1 - (f - T.whip) / 4 : 1}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(8,4,2,0.72)', borderRadius: 14, padding: '10px 22px 12px 14px', border: '1px solid rgba(255,255,255,0.08)'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: 6, paddingRight: 12, borderRight: `1px solid ${C.line2}`}}>
                            {Icon.cc(18, C.sub)}
                          </div>
                          <div style={{fontFamily: UI, fontWeight: 600, fontSize: 44, color: C.text, letterSpacing: '-0.005em', whiteSpace: 'nowrap', minWidth: 20}}>
                            {words.map((w, i) => {
                              const last = i === words.length - 1;
                              const pop = last ? 1 + 0.12 * Math.max(0, 1 - (f - T.speech - w.at) / 3) : 1;
                              return (
                                <span key={i} style={{display: 'inline-block', marginRight: 12, color: last && speaking ? C.orangeHot : C.text, transform: `scale(${pop}) translateY(${last ? -4 * Math.max(0, 1 - (f - T.speech - w.at) / 2) : 0}px)`, transformOrigin: '50% 80%'}}>
                                  {w.w}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* call controls */}
                  <div style={{height: 76, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 14, borderTop: `1px solid ${C.line}`}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 10, width: 330}}>
                      <div style={{width: 34, height: 34, borderRadius: 17, overflow: 'hidden', boxShadow: `0 0 0 1.5px ${C.orange}`}}>
                        <NoleAvatar size={34} />
                      </div>
                      <div style={{fontFamily: UI, fontWeight: 600, fontSize: 15, color: C.text, letterSpacing: '0.04em'}}>NOLE</div>
                      <Wave n={26} h={26} t={f} color={C.orange} seed={1.3} level={level} />
                    </div>
                    <div style={{display: 'flex', gap: 10, margin: '0 auto'}}>
                      {[Icon.mic(18), Icon.cam(18), Icon.cc(18, C.orangeHot)].map((ic, i) => (
                        <div key={i} style={{width: 44, height: 44, borderRadius: 22, background: i === 2 ? 'rgba(255,90,31,0.16)' : '#171B22', border: `1px solid ${i === 2 ? 'rgba(255,90,31,0.5)' : C.line2}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          {ic}
                        </div>
                      ))}
                      <div style={{width: 64, height: 44, borderRadius: 22, background: '#C8341A', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{Icon.end(22)}</div>
                    </div>
                    <div style={{width: 330, textAlign: 'right'}}>
                      <Caps color={C.mute}>Z · Presence</Caps>
                    </div>
                  </div>
                </Win>
              </div>
            </div>
          </>
        )}

        {/* ---------------- PRESENCE (MAS) ---------------- */}
        <div style={{position: 'absolute', left: 0, top: 0, transform: `translateX(${-bump}px)${jolt(1, 1)}`, transformOrigin: `${PRES.x + PRES.w / 2}px ${PRES.y + 280}px`}}>
          <Win x={PRES.x} y={PRES.y} w={PRES.w} title={presTitle}>
            <div style={{position: 'relative', width: PRES.w, height: PRES.tileH, overflow: 'hidden'}}>
              <LineScreen width={PRES.w} height={PRES.tileH} dpr={feedDpr} pitch={base / tier} rowShift={switching ? (r) => hash(r * 0.7 + f) * 10 : undefined} soften={1.2} floor={0.03} gamma={1.1} gain={1.1} bg={C.cyanDeep} ink={masInk} hi={masHi} paint={(c, w, h) => paintMasFeed(c, w, h, mas)} />
              <div style={{position: 'absolute', left: 14, top: 14}}>
                {f < T.slam + 1 ? (
                  <Pill>
                    {Icon.moon(13, C.text)} Do Not Disturb · until 7:00 AM
                  </Pill>
                ) : (
                  <Pill bg="rgba(40,10,2,0.8)" border="rgba(255,90,31,0.6)" color={C.orangeHot}>
                    {Icon.moon(13, C.orange)} <span style={{textDecoration: 'line-through', textDecorationColor: C.orange}}>Do Not Disturb</span> overridden by NOLE
                  </Pill>
                )}
              </div>
              <div style={{position: 'absolute', right: 14, top: 14}}>
                <Pill color={C.sub}>
                  {Icon.lines(11, C.cyan)} <span style={{letterSpacing: '0.14em', fontSize: 11}}>LOW-LIGHT</span>
                </Pill>
              </div>
              <div style={{position: 'absolute', left: 14, bottom: 14}}>
                <Pill>
                  <div style={{width: 7, height: 7, borderRadius: 4, background: C.cyan}} />
                  {inCall ? 'You' : 'MAS'}
                </Pill>
              </div>
            </div>
            {/* chat overlay (outside the tile clip so the SLAM can fall in from huge) */}
            <div style={{position: 'absolute', left: 0, top: 34, width: PRES.w, height: PRES.tileH, pointerEvents: 'none'}}>
              {sent && (
                <div style={{position: 'absolute', right: 16, bottom: 150, transform: `translateY(${(1 - sentK) * 14}px) scale(${0.88 + 0.12 * sentK})`, transformOrigin: '100% 100%'}}>
                  <div style={{fontFamily: UI, fontSize: 11, color: C.sub, textAlign: 'right', marginBottom: 4, letterSpacing: '0.1em'}}>YOU</div>
                  <div style={{background: 'rgba(3,14,18,0.82)', border: '1px solid rgba(63,230,255,0.55)', color: '#DFFBFF', fontFamily: UI, fontWeight: 500, fontSize: 26, padding: '7px 18px 9px', borderRadius: '18px 18px 4px 18px'}}>super.</div>
                </div>
              )}
              {f >= T.slamIn && (
                <div style={{position: 'absolute', left: 16, bottom: 58, transform: `scale(${slamScale}) rotate(${f < T.impact ? -6 * (1 - slamK) : 0}deg)`, transformOrigin: '0% 100%', filter: f < T.impact ? 'drop-shadow(0 30px 40px rgba(0,0,0,0.6))' : undefined}}>
                  <div style={{fontFamily: UI, fontSize: 11, color: C.orangeHot, marginBottom: 4, letterSpacing: '0.1em'}}>NOLE · SENT WITH SLAM</div>
                  <div style={{background: C.orange, color: '#140702', fontFamily: FONT.cardName, fontSize: 44, lineHeight: 1, padding: '10px 18px 12px', borderRadius: '18px 18px 18px 4px', letterSpacing: '0.02em', boxShadow: '0 12px 30px rgba(255,90,31,0.35)'}}>NAMED IT.</div>
                </div>
              )}
            </div>
            {/* bottom bar: status before the call, composer during it */}
            <div style={{height: 64, position: 'relative', borderTop: `1px solid ${C.line}`}}>
              <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, opacity: 1 - composerOn}}>
                <div style={{width: 8, height: 8, borderRadius: 4, background: C.cyan, boxShadow: `0 0 8px ${C.cyan}`}} />
                <span style={{fontFamily: UI, fontSize: 14, color: C.sub}}>Camera on · nobody can see you</span>
                <span style={{marginLeft: 'auto', fontFamily: UI, fontSize: 13, color: C.mute}}>{inCall ? 'call incoming' : '11:58 PM · focus 3h 12m'}</span>
              </div>
              <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10, opacity: composerOn, transform: `translateY(${(1 - composerOn) * 12}px)`}}>
                <div style={{flex: 1, height: 42, borderRadius: 12, background: '#12161D', border: `1px solid ${f >= T.click ? 'rgba(63,230,255,0.5)' : C.line2}`, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: UI, fontSize: 19}}>
                  {draft ? <span style={{color: C.text}}>{draft}</span> : f < T.click ? <span style={{color: C.mute}}>Message NOLE</span> : null}
                  {f >= T.click && f < T.send && <div style={{width: 2, height: 22, marginLeft: 2, background: Math.floor((f - T.click) / 5) % 2 === 0 || (f >= T.type1 && f < T.send) ? C.cyan : 'transparent'}} />}
                </div>
                <div style={{width: 42, height: 42, borderRadius: 21, background: draft ? C.cyan : '#1A1F27', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{Icon.send(16, draft ? C.bg : C.mute)}</div>
              </div>
            </div>
          </Win>
        </div>

        {/* ---------------- THE WATER: never moves ---------------- */}
        <WaterWidget x={WIDGET.x} y={WIDGET.y} />

        {/* ---------------- Z FLOOD ---------------- */}
        {POSTS.map((p, i) => {
          const a = ARRIVE[i];
          if (f < a) return null;
          const inK = springStep(f, a, 0.55, 0.62);
          let d = 0;
          for (let jj = i + 1; jj < ARRIVE.length; jj++) d += springStep(f, ARRIVE[jj], 0.55, 0.62);
          const y = 44 + (d < 5 ? d * 100 : 500 + (d - 5) * 10);
          const sc = d < 4 ? 1 : 1 - (d - 4) * 0.035;
          const op = d < 6 ? 1 : Math.max(0, 1 - (d - 6) * 0.35);
          const fall = f >= T.impact ? Math.pow(Math.max(0, f - T.impact), 1.6) * (6 + (i % 4) * 3) : 0;
          return (
            <div key={i} style={{position: 'absolute', left: 0, top: 0, transform: jolt(10 + i, 0.9), transformOrigin: `${TOAST_X + 196}px ${y + 44}px`}}>
              <Toast
                post={p}
                t={f}
                avatar={<NoleAvatar size={42} />}
                style={{left: TOAST_X + (1 - inK) * 440, top: y + fall, transform: `scale(${sc}) rotate(${fall * 0.04 * (i % 2 ? 1 : -1)}deg)`, transformOrigin: '50% 0%', opacity: op * clamp(inK * 1.6)}}
              />
            </div>
          );
        })}
        {arrived > 6 && (
          <div style={{position: 'absolute', left: TOAST_X + 120, top: 44 + 5 * 100 + 118, transform: jolt(30, 1)}}>
            <Pill bg="rgba(20,22,27,0.94)" color={C.orangeHot} border="rgba(255,90,31,0.4)">+{(arrived - 6) * 7 + Math.max(0, f - 70) * 2} more from @nole</Pill>
          </div>
        )}

        <div style={{position: 'absolute', left: 0, top: 0, transform: jolt(40, 0.7), transformOrigin: '960px 1035px'}}>
          <Dock zBadge={zBadge} bounce={[0, 0, 0, arrived > 0 && f < T.whip ? Math.abs(Math.sin(f * 0.6)) * 14 : 0, 0]} />
        </div>
        <div style={{position: 'absolute', left: 0, top: 0, transform: jolt(50, 0.35), transformOrigin: '960px 15px'}}>
          <MenuBar app="Presence" clock="11:58 PM" zBadge={zBadge} dnd={inCall ? 'broken' : 'on'} call={inCall ? {t: `00:0${callSecs}`} : null} />
        </div>

        {!noCursor && (
          <div style={{position: 'absolute', left: 0, top: 0, transform: jolt(60, 1.2)}}>
            <Cursor x={cur.x} y={cur.y} rot={cur.rot} click={cur.click} />
          </div>
        )}

        {/* orange light leak / flash from the takeover (world space, comes from screen-right) */}
        {f >= T.leak && f < T.slam + 8 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              mixBlendMode: 'screen',
              background: `linear-gradient(270deg, rgba(255,90,31,${f < T.slam ? (f - T.leak + 1) ** 2 * 0.07 : 0.8 * Math.exp(-(f - T.slam) / 2.2)}) 0%, rgba(255,90,31,0) ${f < T.slam ? 14 + (f - T.leak) * 8 : 90}%)`,
            }}
          />
        )}
      </div>

      {/* screen-space: takeover glitch bands */}
      {f >= T.slam && f < T.slam + 3 && <Glitch f={f} />}
      {/* impact flash for the button */}
      {f >= T.impact && f < T.impact + 3 && <AbsoluteFill style={{background: `rgba(255,90,31,${0.22 * (1 - (f - T.impact) / 3)})`, mixBlendMode: 'screen'}} />}
      <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 50%, transparent 58%, rgba(0,0,0,0.42) 120%)'}} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- terminal content
const Terminal: React.FC<{f: number}> = ({f}) => {
  const line = 'git commit -m "quiet, steady progress"';
  const n = Math.min(line.length, Math.floor(Math.max(0, f - 1) * 1.55) + 8);
  const typed = f >= T.slam ? line.slice(0, Math.min(n, 31)) : line.slice(0, n);
  const P = ({children}: {children: React.ReactNode}) => (
    <span>
      <span style={{color: C.cyan}}>mas@lab</span> <span style={{color: C.mute}}>~/lab</span> <span style={{color: C.text}}>%</span> {children}
    </span>
  );
  return (
    <div style={{height: TERM.h - 34, padding: '18px 22px', fontFamily: MONO, fontSize: 17, lineHeight: 1.62, color: '#93A6B2', whiteSpace: 'pre', overflow: 'hidden'}}>
      <div style={{color: C.mute}}>Last login: Thu Sep 24 23:02 on ttys004</div>
      <div>
        <P>./train --run overnight-7 --quiet</P>
      </div>
      <div>{'  '}step 41,200 / ∞{'   '}loss 0.0412{'   '}eta: sunrise</div>
      <div>
        {'  '}
        <span style={{color: C.cyan}}>▁▁▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁</span>
        {'  '}stable
      </div>
      <div>{'  '}checkpoint saved{'  '}<span style={{color: C.mute}}>name: (untitled)</span></div>
      <div>
        <P>git add -A</P>
      </div>
      <div>
        <P>
          <span style={{color: C.text}}>{typed}</span>
          <span style={{display: 'inline-block', width: 10, height: 20, verticalAlign: -3, background: f < T.slam && Math.floor(f / 6) % 2 === 0 ? C.cyan : 'transparent', marginLeft: 1}} />
        </P>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- takeover glitch (designed, not random noise)
const Glitch: React.FC<{f: number}> = ({f}) => {
  const k = 1 - (f - T.slam) / 3.5;
  const bands = Array.from({length: 8}).map((_, i) => {
    const y = ((hash(i * 3.7 + f * 0.13) + 1) / 2) * 1080;
    const h = 6 + Math.abs(hash(i * 5.1 + f)) * 70;
    const dx = hash(i * 1.9 + f * 7) * 160;
    const kind = i % 4;
    return {y, h, dx, kind, i};
  });
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: k}}>
      {bands.map((b) => (
        <div
          key={b.i}
          style={{
            position: 'absolute',
            left: b.dx - 80,
            top: b.y,
            width: 2080,
            height: b.h,
            background: b.kind === 0 ? C.orange : b.kind === 1 ? 'rgba(63,230,255,0.55)' : b.kind === 2 ? 'rgba(0,0,0,0.85)' : 'rgba(255,240,230,0.9)',
            mixBlendMode: b.kind === 1 ? 'screen' : 'normal',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {b.kind === 2 && b.h > 30 && (
            <div style={{fontFamily: FONT.headline, fontSize: b.h * 0.8, color: C.orange, whiteSpace: 'nowrap', letterSpacing: '0.05em'}}>
              {'INCOMING · NOLE · DND OVERRIDE · '.repeat(8)}
            </div>
          )}
        </div>
      ))}
    </AbsoluteFill>
  );
};
