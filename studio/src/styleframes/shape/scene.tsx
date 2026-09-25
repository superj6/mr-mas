import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, P, PH, W, clamp, ell, keys, nz, on2, rr, shake, snap} from './core';
import {Mottle, Scope, ShapeDefs, Sub} from './fx';
import {FY, Glass, Room} from './set';
import {MasBust, MasSeated} from './mas';
import {NoleFront, NoleMouth, NoleProfile} from './nole';
import {FONT} from '../../shared/theme/fonts';

/**
 * THE TEST BEAT — 120 frames @ 24 fps, five graphic cuts:
 *   A  0-23  WIDE        planar proscenium, Mas typing in the monitor wedge; red blade under the door.
 *   B 24-47  THE DOOR    door blown off, rocket-glow sunburst, Nole's frontal wedge jammed in the frame.
 *   C 48-83  TWO-SHOT    smear-in, land, lean, "I came up with the name!" (nutcracker jaw), phone jabs.
 *   D 84-107 MAS CU      eyes lead, head slides across the egg into the red, one blink, tiniest smile, "super."
 *   E 108-119 FREEZE     poster card: the two-shot flattened to silhouettes on red — NOLE / NAMED IT.
 * Characters move on twos, camera and light on ones; edges boil on threes.
 */

export const SHOTS = {A: 0, B: 24, C: 48, D: 84, E: 108, END: 120};

const Pic: React.FC<{f: number; children: React.ReactNode; mottle?: number}> = ({f, children, mottle}) => (
  <svg width={W} height={PH} viewBox={`0 0 ${W} ${PH}`} style={{display: 'block'}}>
    <ShapeDefs seed={1 + (Math.floor(f / 3) % 3)} />
    {children}
    <Mottle opacity={mottle} />
  </svg>
);

const flicker = (f: number) => 0.93 + 0.05 * nz('mon', f * 0.35) + (f % 37 === 11 ? -0.12 : 0);

// ------------------------------------------------------------------ A: WIDE
export const ShotWide: React.FC<{f: number}> = ({f}) => {
  const z = keys(f, [[0, 1.0], [24, 1.04]], 'lin');
  const rumble = f >= 19 ? shake(f, 19, 2.2, 0.35) : {x: 0, y: 0, r: 0};
  return (
    <Pic f={f}>
      <g transform={`translate(${960 + rumble.x} ${402 + rumble.y}) scale(${z}) translate(-900 -400)`}>
        <Room idp="A" f={f} cy={flicker(f)} red={0} door={0} mas={{typing: 1}} tell={f >= 18 ? 1 : 0.4} jolt={rumble} />
      </g>
    </Pic>
  );
};

// ------------------------------------------------------------------ B: THE DOOR
const DOOR = {x: 980, y: 96, w: 300, h: 634};
const DFY = DOOR.y + DOOR.h; // floor in this shot
const CHIPS = Array.from({length: 14}, (_, i) => ({
  a: (i / 14) * Math.PI * 2 + nz('ca', i) * 0.4,
  v: 26 + 18 * (0.5 + 0.5 * nz('cv', i)),
  s: 8 + 10 * (0.5 + 0.5 * nz('cs', i)),
  r: nz('cr', i) * 40,
  side: i % 2 ? 1 : -1,
}));

export const ShotDoor: React.FC<{f: number}> = ({f}) => {
  const t = f - SHOTS.B; // 0..23
  const burst = 3; // impact frame (t)
  const open = t >= burst;
  const push = keys(t, [[burst, 1.0], [23, 1.06]], 'out');
  const sh = shake(t, burst, 16, 0.3);
  const cx = DOOR.x + DOOR.w / 2;
  const cy = DOOR.y + DOOR.h * 0.42;
  const glow = open ? 1 : 0;
  const pulse = 0.94 + 0.06 * Math.sin(t * 0.9);
  const thump = t === 1 ? 5 : t === 2 ? -3 : 0;
  const launch = t >= 20;
  const lt = t - 20; // 0..3

  return (
    <Pic f={f} mottle={0.04}>
      <g transform={`translate(${960 + sh.x} ${402 + sh.y}) rotate(${sh.r * 30}) scale(${push}) translate(-1060 -430)`}>
        {/* wall + floor */}
        <rect x={-300} y={-300} width={W + 600} height={DFY + 300} fill={C.night1} />
        <rect x={-300} y={DFY} width={W + 600} height={600} fill={C.night0} />
        <rect x={-300} y={-300} width={W + 600} height={400} fill={C.night0} opacity={0.55} />
        {/* cyan wash from the monitor, arriving from screen-left */}
        <path d={P([[-300, 40], [360, 150], [520, DFY], [-300, DFY]])} fill={C.cy0} opacity={0.5} filter="url(#sh-dry)" />

        {open ? (
          <g>
            {/* spill: halo on the wall + a trapezoid on the floor (hard value steps) */}
            <g filter="url(#sh-dryr)">
              <path d={ell(cx, cy, 560 * pulse, 520 * pulse)} fill={C.rd0} />
              <path d={ell(cx, cy, 380 * pulse, 360 * pulse)} fill={C.rd1} opacity={0.6} />
            </g>
            <g filter="url(#sh-dry)">
              <path d={P([[DOOR.x - 10, DFY], [DOOR.x + DOOR.w + 10, DFY], [DOOR.x + DOOR.w + 380, PH + 300], [DOOR.x - 520, PH + 300]])} fill={C.rd1} />
              <path d={P([[DOOR.x + 40, DFY], [DOOR.x + DOOR.w - 40, DFY], [DOOR.x + DOOR.w + 120, PH + 300], [DOOR.x - 220, PH + 300]])} fill={C.rd2} opacity={0.7} />
            </g>
          </g>
        ) : null}

        {/* door frame + opening */}
        <path d={rr(DOOR.x - 22, DOOR.y - 22, DOOR.w + 44, DOOR.h + 22, 2)} fill={open ? C.rd1 : C.night3} />
        <defs>
          <clipPath id="B-doorway">
            <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} />
          </clipPath>
        </defs>
        <g clipPath="url(#B-doorway)">
          <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} fill={open ? C.rd2 : C.night2} />
          {open ? (
            <g>
              {/* rocket-glow: a mid-century sunburst, hard rings + rays */}
              {Array.from({length: 18}, (_, i) => {
                const a0 = (i / 18) * Math.PI * 2 + t * 0.012;
                const a1 = a0 + 0.09;
                const R = 900;
                return <path key={i} d={P([[cx, cy], [cx + Math.cos(a0) * R, cy + Math.sin(a0) * R], [cx + Math.cos(a1) * R, cy + Math.sin(a1) * R]])} fill={C.rd3} opacity={0.35} />;
              })}
              <path d={ell(cx, cy, 250 * pulse, 250 * pulse)} fill={C.rd3} />
              <path d={ell(cx, cy, 150 * pulse, 150 * pulse)} fill={C.rdHot} />
              <path d={ell(cx, cy, 70, 70)} fill={C.cream} />
            </g>
          ) : (
            <g transform={`translate(${thump} 0)`}>
              {/* the door itself, with red leaking at its edges */}
              <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} fill={C.night2} />
              <rect x={DOOR.x + 30} y={DOOR.y + 40} width={DOOR.w - 60} height={240} fill={C.night1} opacity={0.6} />
              <rect x={DOOR.x + 30} y={DOOR.y + 320} width={DOOR.w - 60} height={270} fill={C.night1} opacity={0.6} />
              <circle cx={DOOR.x + DOOR.w - 40} cy={DOOR.y + 340} r={12} fill={C.night3} />
            </g>
          )}
        </g>
        {!open ? (
          <g filter="url(#sh-dry)">
            <rect x={DOOR.x - 4} y={DFY - 6} width={DOOR.w + 8} height={8} fill={C.rd3} opacity={0.6 + 0.4 * Math.min(1, t / 2)} />
            <path d={P([[DOOR.x - 20, DFY], [DOOR.x + DOOR.w + 20, DFY], [DOOR.x + DOOR.w + 160, PH + 200], [DOOR.x - 200, PH + 200]])} fill={C.rd1} opacity={0.35 + 0.25 * Math.min(1, t / 2)} />
            <rect x={DOOR.x - 3} y={DOOR.y} width={3} height={DOOR.h} fill={C.rd2} opacity={0.4 + 0.3 * t} />
          </g>
        ) : null}

        {/* NOLE: frontal wedge, jammed shoulder-to-frame, held pose */}
        {open && !launch ? (
          <g transform={`translate(${cx} ${DFY}) scale(${0.72 * (t === burst ? 1.08 : 1)} ${0.72 * (t === burst ? 0.94 : 1)})`} filter="url(#sh-edge)">
            <NoleFront id="B-nole" light={{rd: 1, cy: 0, phone: 1}} phoneUp={on2(t) >= 8 ? 1 : snap(t, 4, 0, 1, 3, 0.2)} />
          </g>
        ) : null}
        {launch ? (
          // launch smear: the silhouette stretched toward camera-left + speed bars
          <g>
            <g transform={`translate(${cx - 120 * (lt + 1)} ${DFY + 20 * lt}) scale(${0.72 * (1 + 0.5 * (lt + 1))} ${0.72 * (1 + 0.12 * lt)}) skewX(${-10 - 6 * lt})`}>
              <NoleFront id="B-nsm" light={{rd: 1, cy: 0, phone: 1}} flat={C.void} />
            </g>
            {Array.from({length: 7}, (_, i) => (
              <rect key={i} x={cx - 200 - 200 * lt - i * 30} y={180 + i * 72 + (i % 2) * 20} width={500 + 90 * lt} height={10 + (i % 3) * 6} fill={i % 2 ? C.rd3 : C.void} opacity={0.8} />
            ))}
          </g>
        ) : null}

        {/* the door slab, blown off its hinges toward camera (smear frames) */}
        {t >= burst && t < burst + 5 ? (
          <g>
            {[0, 1, 2].map((g) => {
              const k = t - burst + g * 0.35;
              return (
                <g key={g} opacity={g === 0 ? 1 : 0.35 - g * 0.1} transform={`translate(${DOOR.x - 260 * k} ${DOOR.y + 60 * k}) rotate(${-24 * k}) scale(${1 + 0.55 * k})`}>
                  <rect x={0} y={0} width={DOOR.w} height={DOOR.h} fill={g === 0 ? C.night2 : C.rd2} />
                  {g === 0 ? <rect x={DOOR.w - 16} y={0} width={16} height={DOOR.h} fill={C.rd3} /> : null}
                </g>
              );
            })}
          </g>
        ) : null}

        {/* debris chips + dust: flat shapes on simple ballistic paths */}
        {open && t < burst + 14
          ? CHIPS.map((c, i) => {
              const k = t - burst + 1;
              const x = cx + c.side * (DOOR.w / 2) + Math.cos(c.a) * c.v * k;
              const y = cy - 80 + Math.sin(c.a) * c.v * k * 0.7 + 3.2 * k * k;
              return <path key={i} d={P([[-c.s, -c.s * 0.4], [c.s, -c.s * 0.7], [c.s * 0.6, c.s], [-c.s * 0.8, c.s * 0.5]])} transform={`translate(${x} ${y}) rotate(${c.r * k})`} fill={i % 3 === 0 ? C.cream : i % 3 === 1 ? C.night3 : C.rd3} />;
            })
          : null}
        {open
          ? [-1, 1].map((side) => {
              const k = clamp((t - burst) / 16);
              return <path key={side} d={ell(cx + side * (DOOR.w / 2 + 60 + 220 * k), DFY - 14, 90 + 160 * k, 30 + 22 * k)} fill={C.night0} opacity={0.9 * (1 - k * k)} filter="url(#sh-dryr)" />;
            })
          : null}
      </g>
      {/* IMPACT FRAME: one frame of pure graphic negative — cream field, the silhouettes in black */}
      {t === burst ? (
        <g transform={`translate(${960 + sh.x} ${402 + sh.y}) scale(${push}) translate(-1060 -430)`}>
          <rect x={-300} y={-300} width={W + 600} height={PH + 600} fill={C.cream} />
          {Array.from({length: 22}, (_, i) => {
            const a0 = (i / 22) * Math.PI * 2;
            const a1 = a0 + 0.05;
            return <path key={i} d={P([[cx, cy], [cx + Math.cos(a0) * 1400, cy + Math.sin(a0) * 1400], [cx + Math.cos(a1) * 1400, cy + Math.sin(a1) * 1400]])} fill={C.rd2} />;
          })}
          <g transform={`translate(${DOOR.x - 560} ${DOOR.y + 80}) rotate(-26) scale(1.05)`}>
            <rect x={0} y={0} width={DOOR.w} height={DOOR.h} fill={C.void} />
          </g>
          <g transform={`translate(${cx} ${DFY}) scale(0.78 0.68)`}>
            <NoleFront id="B-imp" light={{rd: 0, cy: 0, phone: 0}} flat={C.void} />
          </g>
        </g>
      ) : null}
      {t === burst + 1 ? <rect width={W} height={PH} fill={C.rd2} opacity={0.35} /> : null}
    </Pic>
  );
};

// ------------------------------------------------------------------ C: TWO-SHOT
type NolePose = {rx: number; ry: number; lean: number; head: number};
// phone-hand IK targets in Nole-local coords (feet at 0,0): staged so the phone lands BETWEEN Mas and his monitor
const POSE: Record<string, NolePose> = {
  up: {rx: -236, ry: -660, lean: 10, head: -8},
  jab: {rx: -500, ry: -404, lean: 14, head: -4},
  mid: {rx: -400, ry: -520, lean: 12, head: -6},
  jab2: {rx: -512, ry: -410, lean: 16, head: -2},
};
const MOUTHS: [number, NoleMouth][] = [
  [0, 'm'], [52, 'ai'], [56, 'k'], [58, 'ee'], [60, 'm'], [62, 'ai'], [64, 'm'], [66, 'oh'], [68, 'ee'], [70, 'k'], [72, 'ai'], [74, 'k'], [76, 'ee'], [80, 'm'], [82, 'grin'],
];
const mouthAt = (f: number): NoleMouth => {
  let m: NoleMouth = 'm';
  for (const [k, v] of MOUTHS) if (f >= k) m = v;
  return m;
};

const poseBlend = (f: number) => {
  // snappy pose-to-pose with overshoot: up (land) -> jab ("came") -> mid -> JAB ("the NAME")
  const val = (k: keyof NolePose) => {
    let v = POSE.up[k];
    v = snap(f, 56, v, POSE.jab[k], 3, 0.16);
    if (f > 63) v = snap(f, 63, POSE.jab[k], POSE.mid[k], 3, 0.1);
    if (f > 71) v = snap(f, 71, POSE.mid[k], POSE.jab2[k], 3, 0.2);
    return v;
  };
  return {reach: [val('rx'), val('ry')] as [number, number], lean: val('lean'), head: val('head')};
};

export const ShotTwo: React.FC<{f: number; freeze?: boolean}> = ({f}) => {
  const g = on2(f); // characters on twos
  const z = keys(f, [[48, 1.16], [84, 1.21]], 'lin');
  const land = shake(f, 50, 7, 0.4);
  const p = poseBlend(g);
  const squash = f < 50 ? 0 : keys(f, [[50, 1], [55, 0]], 'out');
  const smear = f < 50;
  const noleX = smear ? (f === 48 ? 1560 : 1290) : 1150;
  const red = 0.94 + 0.06 * Math.sin(f * 0.5);
  const typing = f < 76 ? 1 : 0;
  const nole = {
    x: noleX,
    light: {rd: 1, cy: 0.7, phone: 1},
    lean: smear ? 10 : p.lean + squash * 6,
    head: p.head,
    reach: smear ? undefined : p.reach,
    elbowUp: true,
    sh: 40,
    el: 10,
    mouth: mouthAt(g),
    squash,
  };
  return (
    <Pic f={f}>
      <g transform={`translate(${960 + land.x} ${402 + land.y}) scale(${z}) translate(-880 -251)`}>
        <Room idp="C" f={g} cy={flicker(f)} red={red} door={1} mas={{typing}} nole={smear ? null : nole} />
        {smear ? (
          <g>
            <g transform={`translate(${noleX} ${FY}) scale(${f === 48 ? 2.1 : 1.35} 1) skewX(${f === 48 ? 18 : 8})`}>
              <NoleProfile id="C-sm" sil silColor={C.void} light={nole.light} lean={10} sh={40} el={10} />
            </g>
            {Array.from({length: 8}, (_, i) => (
              <rect key={i} x={noleX + 60 + i * 12} y={-60 + i * 86} width={f === 48 ? 900 : 520} height={8 + (i % 3) * 7} fill={i % 2 ? C.rd2 : C.void} opacity={0.85} />
            ))}
          </g>
        ) : null}
      </g>
    </Pic>
  );
};

// ------------------------------------------------------------------ D: MAS CLOSE-UP
export const masCU = (f: number) => {
  const g = on2(f);
  const yaw = keys(g, [[88, -0.08], [101, 0.6]], 'io');
  const lookX = g < 86 ? 0 : g < 88 ? 0.55 : keys(g, [[88, 1], [100, 0.55]], 'io');
  const lookY = keys(g, [[88, 0], [100, -0.35]], 'io');
  const blink = g >= 100 && g <= 101 ? 1 : g === 102 ? 0.45 : 0;
  const smile = keys(f, [[103, 0], [106, 1]], 'out');
  const mouth: 'rest' | 's' | 'oo' | 'p' | 'er' = g >= 108 ? 'rest' : g >= 106 ? 'er' : g >= 104 ? 'oo' : g >= 102 ? 's' : 'rest';
  return {yaw, lookX, lookY, blink, smile, mouth};
};

export const ShotMasCU: React.FC<{f: number; still?: Partial<ReturnType<typeof masCU>>}> = ({f, still}) => {
  const m = {...masCU(f), ...(still ?? {})};
  const z = keys(f, [[84, 1.0], [108, 1.055]], 'lin');
  const red = 0.92 + 0.08 * Math.sin(f * 0.5);
  const breathe = Math.sin(f * 0.13) * 2;
  return (
    <Pic f={f} mottle={0.035}>
      <g transform={`translate(760 380) scale(${z}) translate(-760 -380)`}>
        {/* background: the dark room; the red door field behind Nole */}
        <rect x={-200} y={-200} width={W + 400} height={PH + 400} fill={C.night0} />
        <g filter="url(#sh-dry)">
          <path d={P([[1080, -100], [W + 200, -100], [W + 200, PH + 200], [1180, PH + 200]])} fill={C.rd1} opacity={red} />
          <path d={P([[1400, -100], [W + 200, -100], [W + 200, PH + 200], [1500, PH + 200]])} fill={C.rd2} opacity={0.8 * red} />
        </g>
        {/* the monitor's aura on the wall behind Mas */}
        <g filter="url(#sh-dryr)">
          <path d={ell(700, 400, 520, 470)} fill={C.cy0} opacity={0.8} />
          <path d={ell(680, 420, 330, 330)} fill={C.cy0} />
        </g>
        {/* NOLE, looming in from the top right: profile, chin block first, phone still out */}
        <g transform={`translate(2040 ${1150 + breathe}) scale(1.7)`} filter="url(#sh-edge)">
          <NoleProfile id="D-nole" light={{rd: 1, cy: 0.5, phone: 0.8}} lean={26} head={16} reach={[-470, -540]} mouth={on2(f) >= 104 ? 'grin' : 'm'} eyes={on2(f) >= 104 ? 'smug' : 'open'} />
        </g>
        {/* MAS */}
        <g transform="translate(700 372)" filter="url(#sh-edge)">
          <MasBust id="D-mas" light={{cy: flicker(f), rd: 0.85 * red}} {...m} />
        </g>
      </g>
    </Pic>
  );
};

// ------------------------------------------------------------------ E: FREEZE-FRAME NAME CARD
export const ShotCard: React.FC<{f: number}> = ({f}) => {
  const t = f - SHOTS.E;
  const s = t <= 0 ? 1.28 : t === 1 ? 0.97 : 1.0;
  const flash = t === 0;
  return (
    <Pic f={f} mottle={0.06}>
      {/* the two-shot, frozen and flattened to three inks: red field, black, cyan */}
      <rect width={W} height={PH} fill={C.rd2} />
      <g transform="translate(960 402) scale(0.82) translate(-900 -211)">
        <g filter="url(#sh-dryr)">
          <path d={P([[300, -200], [1300, -200], [1100, 900], [-100, 900]])} fill={C.rd3} opacity={0.35} />
        </g>
        <g transform="translate(760 530)">
          <MasSeated id="E-mas" sil silColor={C.cy2} light={{cy: 1, rd: 0}} f={0} typing={0} />
        </g>
        <g fill={C.void}>
          <rect x={300} y={470} width={580} height={16} />
          <rect x={322} y={484} width={14} height={180} />
          <rect x={426} y={286} width={22} height={136} rx={6} />
          <rect x={435} y={418} width={8} height={46} />
          <rect x={404} y={462} width={74} height={8} />
        </g>
        <Glass x={492} y={470} cy={1} red={0} />
        <g transform={`translate(1150 ${FY})`} filter="url(#sh-edge)">
          <NoleProfile id="E-nole" sil silColor={C.void} light={{rd: 0, cy: 0, phone: 1}} lean={-5} head={-14} reach={[-330, -700]} mouth="grin" />
        </g>
      </g>
      {/* type */}
      <g transform={`translate(104 250) scale(${s})`}>
        <text x={0} y={0} fontFamily={FONT.bass} fontWeight={900} fontSize={228} letterSpacing={-4} fill={C.cream}>
          NOLE
        </text>
        <rect x={8} y={30} width={600} height={9} fill={C.void} />
        <text x={6} y={104} fontFamily={FONT.bass} fontWeight={700} fontSize={58} letterSpacing={20} fill={C.void}>
          NAMED IT.
        </text>
      </g>
      {flash ? <rect width={W} height={PH} fill={C.cream} opacity={0.85} /> : null}
    </Pic>
  );
};

// ------------------------------------------------------------------ the cut
export const subAt = (f: number): Sub => {
  if (f >= 52 && f < 86) return {text: 'I came up with the name!', who: 'nole'};
  if (f >= 102 && f < 114) return {text: 'super.', who: 'mas'};
  return null;
};

export const SceneAt: React.FC<{f: number}> = ({f}) => {
  let shot: React.ReactNode;
  if (f < SHOTS.B) shot = <ShotWide f={f} />;
  else if (f < SHOTS.C) shot = <ShotDoor f={f} />;
  else if (f < SHOTS.D) shot = <ShotTwo f={f} />;
  else if (f < SHOTS.E) shot = <ShotMasCU f={f} />;
  else shot = <ShotCard f={f} />;
  return (
    <Scope grainSeed={1 + (Math.floor(f / 2) % 6)} sub={subAt(f)}>
      {shot}
    </Scope>
  );
};

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  return <SceneAt f={f} />;
};
