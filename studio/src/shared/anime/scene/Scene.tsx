// ANIME SCENE — the 5 s test beat staged as prestige TV anime. Owned by the animescene builder.
// Uses the shared anime rigs read-only (AnimeMas / AnimeNole / Room / Grade) and wraps them with shot layout,
// relight filters and compositing. See notes/animescene.md.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AnimeMas} from '../Mas';
import {AnimeNole} from '../Nole';
import {Mouth} from '../cel';
import {ForegroundBlur, Motes, RoomBack, RoomFront} from '../Room';
import {AnimeGrade, DiffusionDefs} from '../Grade';
import {LIGHT} from '../palette';
import {ell} from '../ink';
import {FocusLines, ImpactFilter, Kira, RimFilter, SpeedStreaks, Subtitle} from './fx';
import {BeamMotes, DoorNole, PhoneHand, WaterGlass} from './props';
import {TypingHands} from './hands';
import {blink, clamp, cutAt, E, hold, monitorFlicker, on2s, on3s, shake, spring, track, tw} from './timing';

// ------------------------------------------------------------------------------------------ layout (the "bank")
/** Wide two-shot layout, shared by C1 (end of pan), C3 and C6. */
export const WIDE = {
  mas: {x: 820, y: 520, s: 0.78},
  nole: {x: 1404, y: 404, s: 0.81},
  glass: {x: 388, y: 1024, H: 248},
};

// ------------------------------------------------------------------------------------------ shot frame wrapper
const ShotSvg: React.FC<{uid: string; diffusion?: number; impact?: false | 'dark' | 'light'; children: React.ReactNode; bg?: string}> = ({uid, diffusion = 0.28, impact = false, children, bg = '#0A0C1E'}) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, background: bg}}>
    <defs>
      <DiffusionDefs id={`${uid}-diff`} blur={16} />
      <ImpactFilter id={`${uid}-imp`} invert={impact === 'light'} />
    </defs>
    <g filter={impact ? `url(#${uid}-imp)` : undefined}>
      <g id={`${uid}-scene`}>{children}</g>
      {!impact && diffusion > 0 && <use href={`#${uid}-scene`} filter={`url(#${uid}-diff)`} opacity={diffusion} style={{mixBlendMode: 'screen'}} />}
    </g>
  </svg>
);

// ------------------------------------------------------------------------------------------ shared pieces
/** Desk plane extended past the plate edges so the multiplane pan never shows a seam. */
const DeskExt: React.FC = () => (
  <g>
    <path d="M-600 931 L2600 877 L2600 1200 L-600 1200 Z" fill="url(#rm-desk)" />
    <path d="M-600 931 L2600 877 L2600 899 L-600 953 Z" fill="#232B5E" opacity={0.8} />
  </g>
);

/** Warm hallway light spilling in from screen-right once the door is open (compositing layer). */
const HallSpill: React.FC<{amt: number; uid: string}> = ({amt, uid}) => {
  if (amt <= 0) return null;
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-hs`} x1="1920" y1="0" x2="700" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF9E57" stopOpacity={0.42} />
          <stop offset="0.5" stopColor="#FF8A4A" stopOpacity={0.12} />
          <stop offset="1" stopColor="#FF8A4A" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill={`url(#${uid}-hs)`} opacity={amt} style={{mixBlendMode: 'screen'}} />
    </g>
  );
};

/** Door-shaped warm patch thrown on the back wall (+ Nole's shadow in it), painted soft. */
const WallPatch: React.FC<{amt: number; uid: string; shadowX?: number; shadowOn?: number}> = ({amt, uid, shadowX = 0, shadowOn = 1}) => {
  if (amt <= 0) return null;
  return (
    <g opacity={amt}>
      <defs>
        <filter id={`${uid}-wp`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={10} />
        </filter>
        <linearGradient id={`${uid}-wpg`} x1="1500" y1="0" x2="1060" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFB26A" stopOpacity={0.55} />
          <stop offset="1" stopColor="#FF8F52" stopOpacity={0.18} />
        </linearGradient>
      </defs>
      <g filter={`url(#${uid}-wp)`} style={{mixBlendMode: 'screen'}}>
        <path d="M1090 120 L1500 60 L1520 900 L1110 870 Z" fill={`url(#${uid}-wpg)`} />
      </g>
      {/* Nole's cast shadow inside the patch: head + shoulders, soft-edged */}
      <g filter={`url(#${uid}-wp)`} opacity={0.75 * shadowOn} transform={`translate(${shadowX} 0)`}>
        <path d="M1180 330 C1175 250 1230 205 1290 212 C1350 220 1380 270 1372 330 C1368 380 1345 420 1330 440 C1400 470 1470 500 1520 540 L1520 900 L1120 880 C1120 700 1150 520 1250 460 C1215 430 1185 390 1180 330 Z" fill="#150A16" />
      </g>
    </g>
  );
};

// ------------------------------------------------------------------------------------------ C1 / C3 / C6: WIDE
const WideShot: React.FC<{f: number; uid?: string}> = ({f, uid = 'w'}) => {
  const cut = cutAt(f).id;
  const c = on2s(f);
  const fl = monitorFlicker(f);
  const doorOpen = f >= 24;
  // ---- camera: C1 multiplane pan on 1s (eases into the bank layout)
  const P = cut === 'C1' ? tw(f, 0, 22, 150, 0, E.out) : 0;
  // ---- button: everything jolts except the glass
  const slam = 108;
  const inBtn = f >= slam;
  const [sx, sy] = inBtn ? shake(f, slam + 1, 20, 9, 5) : cut === 'C3' ? shake(f, 39, 7, 5, 3) : [0, 0];
  const hop = (amp: number, d = 0) => (inBtn ? hold(f - slam - d, [[-99, 0], [1, -amp], [2, -amp * 0.45], [3, amp * 0.12], [4, 0]]) : 0);

  // ---- Mas: types on 3s, reads (eye saccades), never reacts
  const typing = f < 84;
  const bob = typing ? (on3s(f) / 3) % 2 : 0;
  const saccade = hold(f, [[0, 0.46], [7, 0.58], [13, 0.5], [19, 0.62], [36, 0.5], [44, 0.56]]);
  const gust = spring(c, [[26, 9], [37, 5], [109, -7]], 0.22, 0.2);
  const masLid = blink(f, 15, 0.2);

  // ---- Nole: slides in from screen-right at 36 (smear, overshoot, settle), slams at 108
  const nIn = f >= 36;
  const nx = hold(f, [[36, 330], [37, 120], [38, -30], [40, 10], [42, 0]]);
  const smear = f === 36 ? 1 : f === 37 ? 0.55 : 0;
  const nHair = spring(c, [[36, -26], [38, 14], [108, 18]], 0.2, 0.22);
  const lurch = inBtn ? hold(f, [[108, 26], [110, 18], [112, 10], [114, 6]]) : 0;
  const nTilt = inBtn ? hold(f, [[108, 5], [110, 3.5], [112, 2.5]]) : hold(f, [[36, -4], [38, 3], [40, 1], [42, 0]]);
  const nMouth: Mouth = inBtn ? hold<Mouth>(f, [[108, 'A'], [112, 'E'], [114, 'smile']]) : 'smile';
  const noleLook = f < 44 ? 0.2 : 0.45;

  const mas = WIDE.mas;
  const no = WIDE.nole;
  const noleRig = (key: string, extraX = 0) => (
    <g transform={`translate(${no.x + nx + extraX} ${no.y + lurch}) rotate(${-nTilt} 0 ${no.s * 160}) scale(${-no.s} ${no.s})`}>
      <AnimeNole uid={`${uid}-n${key}`} lookX={noleLook} lookY={0.35} lid={0.18} mouth={nMouth} brow={0.35} tilt={0} hairX={nHair} hairY={Math.abs(nHair) * 0.1} light={0.42 * fl} night={0.58} phoneGlow={1.1} ink={1.05} />
    </g>
  );

  return (
    <ShotSvg uid={uid} impact={f === slam ? 'light' : false}>
      <defs>
        <RimFilter id={`${uid}-warmR`} dx={7} dy={-1} color="#FFB57A" opacity={0.9} wrap={0.5} />
        <RimFilter id={`${uid}-warmM`} dx={5} dy={-1} color="#FFB57A" opacity={0.55} wrap={0.35} />
        <filter id={`${uid}-smear`} x="-30%" y="-10%" width="160%" height="120%">
          <feGaussianBlur stdDeviation="26 0" />
        </filter>
      </defs>
      <g transform={`translate(${sx} ${sy})`}>
        {/* BG plate (far) */}
        <g transform={`translate(${P * 0.55 + (inBtn ? hop(4, 1) * 0.5 : 0)} 0) translate(960 540) scale(1.08) translate(-960 -540)`}>
          <RoomBack flicker={fl} blur={2.6} t={f} />
          <WallPatch amt={doorOpen ? tw(f, 24, 27, 0, 1, E.out) : 0} uid={uid} shadowX={nIn ? 0 : -120} shadowOn={f >= 26 ? 1 : 0} />
        </g>
        <Motes t={f} n={30} region={[640, 120, 980, 760]} />

        {/* Mas (mid) */}
        <g transform={`translate(${P} ${hop(6, 0)})`}>
          <g filter={doorOpen ? `url(#${uid}-warmM)` : undefined}>
            <g transform={`translate(${mas.x} ${mas.y + bob * 1.6}) scale(${mas.s})`}>
              <AnimeMas uid={`${uid}-mas`} lookX={saccade} lookY={0.12} lid={masLid} mouth="rest" brow={0} tilt={bob * -0.35} hairX={gust} hairY={Math.abs(gust) * 0.2} light={fl} night={0.5} ink={1} />
            </g>
          </g>
        </g>

        {/* Nole (mid, between Mas and the monitor), mirrored to face Mas; warm hallway rim from screen-right */}
        {nIn && (
          <g transform={`translate(0 ${hop(3, 0)})`}>
            {smear > 0 &&
              [1, 2, 3].map((g) => (
                <g key={g} opacity={0.22 * smear * (1 - g * 0.22)} filter={`url(#${uid}-smear)`}>
                  {noleRig(`g${g}`, g * 70 * smear)}
                </g>
              ))}
            <g filter={smear > 0.8 ? `url(#${uid}-smear)` : `url(#${uid}-warmR)`} opacity={smear > 0.8 ? 0.85 : 1}>
              {noleRig('main')}
            </g>
          </g>
        )}

        {/* FG plate: desk, keyboard, monitor, mug */}
        <g transform={`translate(${P * 1.15} ${hop(10, 0)})`}>
          <DeskExt />
          <RoomFront flicker={fl} t={f} uiScroll={f * 0.0016} />
          <TypingHands uid={`${uid}-th`} phase={bob} typing={typing} light={fl} x={mas.x} y={mas.y} s={mas.s} />
        </g>
        <Motes t={f} n={8} region={[1300, 140, 300, 700]} seed={17} scale={1.8} />
        <HallSpill amt={doorOpen ? tw(f, 24, 28, 0, 1, E.out) * (f === 25 ? 1.8 : 1) : 0} uid={uid} />
        {/* horizontal speed streaks on the entrance */}
        {f >= 36 && f < 40 && <SpeedStreaks seed={f * 7} n={34} opacity={0.55 - (f - 36) * 0.12} y={[90, 900]} x={[900, 1920]} />}
      </g>

      {/* THE GLASS — outside the shake group: it does not move, the water does not ripple */}
      <g transform={`translate(${WIDE.glass.x + P * 1.4} ${WIDE.glass.y})`}>
        <WaterGlass uid={`${uid}-glass`} light={fl} warm={doorOpen ? 0.6 : 0} H={WIDE.glass.H} ripple={0} />
        {inBtn && f >= 112 && <Kira x={WIDE.glass.H * 0.26} y={-WIDE.glass.H - 6} r={track(f, [[112, 0], [113, 46], [114, 34], [119, 30]])} rot={(f - 112) * 4} op={1} />}
      </g>
      <g transform={`translate(${-60 + P * 1.8} 40) scale(1.2)`}>
        <ForegroundBlur />
      </g>
    </ShotSvg>
  );
};

// ------------------------------------------------------------------------------------------ C2: DOOR
const DoorShot: React.FC<{f: number}> = ({f}) => {
  const t = f - 24;
  const [sx, sy] = shake(f, 25, 22, 9, 2);
  const flick = hold(f, [[24, 1.6], [25, 1.25], [26, 1], [29, 0.72], [30, 1.05], [31, 1]]);
  const doorA = hold(t, [[0, 0.55], [1, 1.04], [2, 0.93], [3, 0.98], [5, 1]]);
  const push = tw(f, 25, 35, 1, 1.035, E.io);
  const masGust = spring(on2s(f), [[26, 9]], 0.22, 0.2);
  const doorW = 250 * doorA;
  return (
    <ShotSvg uid="d" impact={t === 0 ? 'light' : false} diffusion={0.34} bg="#07060E">
      <defs>
        <linearGradient id="d-hall" x1="0" y1="60" x2="0" y2="780" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFE9C8" />
          <stop offset="0.5" stopColor="#FFC98A" />
          <stop offset="1" stopColor="#FF9A52" />
        </linearGradient>
        <radialGradient id="d-core" cx="1350" cy="380" r="420" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFBF2" stopOpacity={1} />
          <stop offset="0.5" stopColor="#FFE2B4" stopOpacity={0.6} />
          <stop offset="1" stopColor="#FFB36B" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="d-wall" x1="0" y1="0" x2="1920" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0B1030" />
          <stop offset="0.55" stopColor="#120F26" />
          <stop offset="1" stopColor="#1A0E1A" />
        </linearGradient>
        <linearGradient id="d-floorlight" x1="0" y1="780" x2="0" y2="1080" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFC98A" stopOpacity={0.95} />
          <stop offset="1" stopColor="#FF8A4A" stopOpacity={0.35} />
        </linearGradient>
        <filter id="d-b8" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={8} />
        </filter>
        <filter id="d-b30" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={30} />
        </filter>
        <filter id="d-b3" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={2.4} />
        </filter>
        <filter id="d-noise" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={1} seed={9} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <RimFilter id="d-masrim" dx={-4} dy={0} color="#FFB57A" opacity={0.7} wrap={0.3} />
      </defs>
      <g transform={`translate(${sx} ${sy}) translate(1300 560) scale(${push * 1.06}) rotate(-3.5) translate(-1300 -560)`}>
        {/* back wall + floor (low angle: floor line high, verticals converge upward) */}
        <rect x={-200} y={-200} width={2400} height={1100} fill="url(#d-wall)" />
        <path d="M-200 780 L2200 770 L2200 1400 L-200 1400 Z" fill="#08070F" />
        {Array.from({length: 13}, (_, i) => {
          const x0 = -200 + i * 190;
          return <path key={i} d={`M${1350 + (x0 - 1350) * 0.18} 780 L${x0 + (x0 - 1350) * 0.9} 1400`} stroke="#15142A" strokeWidth={3} />;
        })}
        {/* warm spill on the wall around the frame */}
        <path d={ell(1350, 430, 430, 400)} fill="#FF7A2E" opacity={0.3 * flick} filter="url(#d-b30)" style={{mixBlendMode: 'screen'}} />
        <path d={ell(1350, 430, 250, 380)} fill="#FFB26A" opacity={0.22 * flick} filter="url(#d-b30)" style={{mixBlendMode: 'screen'}} />
        {/* the doorway: overexposed hallway */}
        <path d="M1180 780 L1196 70 L1508 64 L1522 780 Z" fill="url(#d-hall)" />
        <path d="M1180 780 L1196 70 L1508 64 L1522 780 Z" fill="url(#d-core)" opacity={flick} />
        <path d="M1262 780 L1270 170 L1432 166 L1440 780 Z" fill="#FFF6E6" opacity={0.35 * flick} filter="url(#d-b8)" />
        {/* door frame (casing) */}
        <path d="M1150 790 L1168 44 L1196 46 L1180 790 Z" fill="#0A0810" />
        <path d="M1522 790 L1508 40 L1540 38 L1556 790 Z" fill="#0A0810" />
        <path d="M1168 44 L1540 38 L1540 66 L1170 72 Z" fill="#0A0810" />
        <path d="M1180 790 L1196 70" stroke="#FFD29A" strokeWidth={3} opacity={0.8 * flick} />
        <path d="M1522 790 L1508 66" stroke="#FFD29A" strokeWidth={3} opacity={0.8 * flick} />
        {/* floor light pool + Nole's long shadow toward camera */}
        <path d="M1180 780 L1522 780 L1760 1400 L420 1400 Z" fill="url(#d-floorlight)" opacity={0.85 * flick} filter="url(#d-b3)" />
        <path d="M1296 782 L1382 782 L1300 1400 L760 1400 Z" fill="#0A0508" opacity={0.92} filter="url(#d-b3)" />
        {/* volumetric shafts */}
        <g filter="url(#d-b30)" style={{mixBlendMode: 'screen'}} opacity={0.5 * flick}>
          <path d="M1196 80 L1508 70 L900 1100 L180 1100 Z" fill="#FFB36B" opacity={0.45} />
          <path d="M1300 80 L1420 70 L1200 1100 L760 1100 Z" fill="#FFE2B8" opacity={0.4} />
        </g>
        <BeamMotes t={f * 1.4} n={46} box={[700, 120, 820, 900]} seed={11} size={1.3} opacity={flick} />

        {/* Nole in the doorway: one held silhouette drawing */}
        <g transform="translate(1356 796) scale(1.0)">
          <DoorNole uid="d-nole" glow={1} rim={0.95 * flick} smirk={1} />
        </g>
        {/* the door slab, swung in toward camera (bounce on 1s) */}
        <path d={`M1522 780 L1508 66 L${1508 + doorW} ${-10 - doorW * 0.18} L${1522 + doorW * 1.02} ${900 + doorW * 0.2} Z`} fill="#0C0A12" />
        <path d={`M${1508 + doorW} ${-10 - doorW * 0.18} L${1522 + doorW * 1.02} ${900 + doorW * 0.2}`} stroke="#FFC58A" strokeWidth={5} opacity={0.75 * flick} />
        <circle cx={1508 + doorW * 0.86} cy={470} r={7} fill="#FFD9A6" opacity={0.8 * flick} />

        {/* far left: Mas at his desk, small, cyan-lit, not turning */}
        <path d={ell(470, 560, 330, 260)} fill={LIGHT.key} opacity={0.12} filter="url(#d-b30)" style={{mixBlendMode: 'screen'}} />
        <g filter="url(#d-masrim)">
          <g transform="translate(360 548) scale(0.3)">
            <AnimeMas uid="d-mas" lookX={0.5} lookY={0.12} lid={0.2} mouth="rest" hairX={masGust} light={1.1} night={0.72} ink={1.6} />
          </g>
        </g>
        {/* chair back + desk + monitor (back side) as dark shapes */}
        <path d="M190 560 C200 520 250 505 290 512 L300 730 L200 730 Z" fill="#06060D" />
        <path d="M-200 680 L760 668 L760 700 L-200 712 Z" fill="#090A16" />
        <path d="M-200 700 L700 690 L704 800 L-200 812 Z" fill="#07070F" />
        <path d="M-200 700 L700 690" stroke="#1A1E3E" strokeWidth={3} />
        <path d="M-200 680 L760 668" stroke={LIGHT.key} strokeWidth={2} opacity={0.35} />
        <path d="M720 700 L732 700 L740 790 L728 790 Z" fill="#06060D" />
        <path d="M540 470 L650 462 L652 664 L542 668 Z" fill="#05060C" />
        <path d="M540 470 L542 668" stroke={LIGHT.key} strokeWidth={4} opacity={0.7} />
        <path d="M586 664 L612 664 L616 684 L582 684 Z" fill="#05060C" />
        <rect x={-200} y={-200} width={2400} height={1600} filter="url(#d-noise)" opacity={0.06} style={{mixBlendMode: 'soft-light'}} />
      </g>
    </ShotSvg>
  );
};

// ------------------------------------------------------------------------------------------ C4: NOLE B.C.U.
/** Lip flap for "I came up with the name!" — shapes held 2-4 frames, placed on syllables. */
const noleMouth = (f: number): Mouth =>
  hold<Mouth>(f, [
    [48, 'M'],
    [50, 'A'], // I
    [54, 'E'], // ca-
    [57, 'M'], // -me
    [59, 'A'], // u-
    [62, 'M'], // -p
    [64, 'E'], // with
    [67, 'rest'],
    [68, 'E'], // the
    [70, 'A'], // NA-
    [75, 'M'], // -me
    [77, 'A'], // !
    [80, 'smile'],
  ]);

const NoleCU: React.FC<{f: number}> = ({f}) => {
  const c = on2s(f);
  const t = f - 48;
  // lean-in: arrives slightly small/low and overshoots toward the lens
  const lean = hold(f, [[48, 0.9], [49, 1.035], [51, 0.99], [53, 1]]);
  const jab = (j0: number, big: number) => hold(f - j0, [[-99, 0], [0, -0.35], [1, 1.25 * big], [2, 1 * big], [4, 0.6 * big], [7, 0.3 * big], [10, 0]]);
  const J = jab(54, 0.6) + jab(70, 1);
  const pop = 1 + hold(f, [[48, 0], [54, 0.012], [56, 0], [70, 0.03], [72, 0.018], [74, 0.008], [77, 0]]);
  const [sx, sy] = f >= 70 ? shake(f, 70, 14, 7, 9) : shake(f, 54, 6, 5, 8);
  const hairX = spring(c, [[48, -18], [54, 6], [70, 16]], 0.2, 0.22);
  const brow = track(f, [[48, 0.2], [68, 0.35], [71, 0.85], [80, 0.6]]);
  const lid = f >= 70 && f < 78 ? 0.06 : 0.14;
  const lineGlow = f >= 70 && f < 74 ? 1 : 0.6;
  const S = 2.28;
  return (
    <ShotSvg uid="n" diffusion={0.3} bg="#140609">
      <defs>
        <radialGradient id="n-bg" cx="1180" cy="430" r="1300" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6A2418" />
          <stop offset="0.35" stopColor="#35101A" />
          <stop offset="1" stopColor="#0C0510" />
        </radialGradient>
        <filter id="n-b40" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={40} />
        </filter>
        <filter id="n-smear" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="14 5" />
        </filter>
        <RimFilter id="n-warm" dx={-9} dy={-2} color="#FFB57A" opacity={0.95} wrap={0.55} blur={1.4} />
        <RimFilter id="n-cy" dx={6} dy={-2} color={LIGHT.key} opacity={0.6} wrap={0.35} blur={1.2} />
      </defs>
      <g transform={`translate(${sx} ${sy}) translate(960 540) scale(${pop}) translate(-960 -540)`}>
        <rect x={-100} y={-100} width={2120} height={1280} fill="url(#n-bg)" />
        <path d={ell(1250, 380, 520, 420)} fill="#FF8A3C" opacity={0.35} filter="url(#n-b40)" />
        <FocusLines cx={900} cy={470} seed={1000 + c} n={170} rx={560} ry={380} spread={0.8} color="#FFE3C4" opacity={0.3 + 0.3 * lineGlow} w={[2, 18]} />
        {/* Nole, mirrored (faces Mas / the lens), warm rim from the door side */}
        <g filter="url(#n-warm)">
          <g transform={`translate(1330 ${410 + (1 - lean) * 120}) scale(${-S * lean} ${S * lean})`}>
            <AnimeNole uid="n-nole" lookX={0.62} lookY={0.18} lid={lid} mouth={noleMouth(c)} brow={brow} tilt={hold(c, [[48, -3], [50, 1], [54, 0], [70, 1.6], [76, 0.5]])} hairX={hairX} hairY={Math.abs(hairX) * 0.12} light={0.85} night={0.52} phoneGlow={1.35 + 0.4 * J} ink={0.52} />
          </g>
        </g>
        {/* FG: the phone, jabbed at the lens on "came" and "NAME" (scale pops + one smear frame) */}
        <g filter={f === 55 || f === 71 ? 'url(#n-smear)' : 'url(#n-cy)'}>
          <g transform={`translate(${720 - J * 70} ${820 - J * 40}) rotate(${-13 - J * 5}) scale(${1.22 + J * 0.2})`}>
            <PhoneHand uid="n-ph" glow={1 + 0.3 * J} k={0.8} />
          </g>
        </g>
        <path d={ell(760, 640, 260, 300)} fill="#DDF1FF" opacity={0.1 + 0.08 * J} filter="url(#n-b40)" style={{mixBlendMode: 'screen'}} />
      </g>
    </ShotSvg>
  );
};

// ------------------------------------------------------------------------------------------ C5: MAS C.U.
const masMouth = (f: number): Mouth =>
  hold<Mouth>(f, [
    [84, 'rest'],
    [98, 'E'], // s-
    [100, 'O'], // -u-
    [102, 'M'], // -p-
    [103, 'E'], // -er.
    [105, 'smile'],
  ]);

const MasCU: React.FC<{f: number}> = ({f}) => {
  const c = on2s(f);
  // eyes lead: monitor -> Nole (up and toward lens), 1 in-between + overshoot, all on 2s
  const [lx, ly] = hold<[number, number]>(f, [
    [84, [0.52, 0.14]],
    [86, [0.36, -0.08]],
    [88, [0.16, -0.46]],
    [90, [0.2, -0.38]],
  ]);
  const tilt = tw(c, 88, 98, 0, -3.4, E.soft);
  const tiltFn = (x: number) => tw(on2s(x), 88, 98, 0, -3.4, E.soft);
  let hx = 0;
  {
    let v = 0;
    for (let q = 85; q <= c; q++) {
      const acc = tiltFn(q) - 2 * tiltFn(q - 1) + tiltFn(q - 2);
      v += -0.16 * hx - 0.22 * v - 26 * acc;
      hx += v;
    }
  }
  const lid = blink(f, 92, f >= 98 ? 0.2 : 0.16);
  const brow = tw(f, 96, 104, 0, 0.18);
  const warm = tw(f, 86, 100, 0.25, 0.8);
  const fl = monitorFlicker(f) * tw(f, 86, 100, 1, 0.82);
  // slow push (T.U.) on 1s, anchored between his eyes
  const push = tw(f, 84, 118, 1, 1.26, E.io);
  const ax = 900;
  const ay = 430;
  const bgPush = 1 + (push - 1) * 0.4;
  return (
    <ShotSvg uid="m" diffusion={0.3}>
      <defs>
        <RimFilter id="m-warm" dx={6} dy={-3} color="#FFB57A" opacity={0.85 * warm} wrap={0.5} blur={1.3} />
        <linearGradient id="m-spill" x1="1920" y1="0" x2="600" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF9E57" stopOpacity={0.35} />
          <stop offset="1" stopColor="#FF9E57" stopOpacity={0} />
        </linearGradient>
      </defs>
      <g transform={`translate(${ax} ${ay}) scale(${bgPush}) translate(${-ax} ${-ay})`}>
        <g transform="translate(1400 560) scale(1.5) translate(-1400 -560)">
          <RoomBack flicker={fl} blur={4.5} t={f} />
        </g>
      </g>
      <g transform={`translate(${ax} ${ay}) scale(${push}) translate(${-ax} ${-ay})`}>
        <g filter="url(#m-warm)">
          <g transform="translate(760 500) scale(1.36)">
            <AnimeMas uid="m-mas" lookX={lx} lookY={ly} lid={lid} mouth={masMouth(c)} brow={brow} tilt={tilt} hairX={hx} hairY={Math.abs(hx) * 0.15} light={fl} night={0.5} ink={0.72} />
          </g>
        </g>
      </g>
      <g transform={`translate(${ax} ${ay}) scale(${bgPush}) translate(${-ax} ${-ay})`}>
        <g transform="translate(1400 560) scale(1.5) translate(-1400 -560)">
          <RoomFront flicker={fl} t={f} uiScroll={f * 0.0016} />
        </g>
      </g>
      <rect width={1920} height={1080} fill="url(#m-spill)" opacity={warm} style={{mixBlendMode: 'screen'}} />
      <Motes t={f} n={30} region={[900, 80, 800, 900]} seed={9} scale={1.6} />
    </ShotSvg>
  );
};

// ------------------------------------------------------------------------------------------ master
const subtitleAt = (f: number): string => {
  if (f >= 50 && f < 84) return 'I came up with the name!';
  if (f >= 98 && f < 114) return 'super.';
  return '';
};

export const AnimeScene: React.FC<{frame?: number; grade?: boolean; subs?: boolean}> = ({frame, grade = true, subs = true}) => {
  const cf = useCurrentFrame();
  const f = frame ?? cf;
  const cut = cutAt(f).id;
  const impact = f === 24 || f === 108;
  return (
    <AbsoluteFill style={{background: '#0A0C1E', overflow: 'hidden'}}>
      {(cut === 'C1' || cut === 'C3' || cut === 'C6') && <WideShot f={f} />}
      {cut === 'C2' && <DoorShot f={f} />}
      {cut === 'C4' && <NoleCU f={f} />}
      {cut === 'C5' && <MasCU f={f} />}
      {grade && !impact && <AnimeGrade seed={1 + Math.floor(f / 2)} />}
      {subs && <Subtitle text={subtitleAt(f)} />}
    </AbsoluteFill>
  );
};

export const clamp01 = clamp;
