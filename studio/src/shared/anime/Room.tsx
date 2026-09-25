import React from 'react';
import {prng} from './ink';
import {LIGHT} from './palette';

/**
 * Painted anime night-room BG (1920x1080 space): window with a blurred city + bokeh, LED shelf,
 * the monitor (key light) at screen-right, desk. Everything soft-edged like a hand-painted BG plate;
 * `blur` is the depth-of-field amount (bigger on close-ups). `flicker` scales the monitor light.
 */

type V = [number, number];
const lerp = (a: V, b: V, t: number): V => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

// monitor screen corners (TL, TR, BR, BL) — seen from the left, right edge nearer the camera
const SCR: [V, V, V, V] = [
  [1622, 292],
  [1960, 222],
  [1960, 850],
  [1622, 770],
];
/** Bilinear map of (u, v) in 0..1 onto the screen quad (fake perspective for UI elements). */
const persp = (u: number, v: number): V => {
  const top = lerp(SCR[0], SCR[1], u);
  const bot = lerp(SCR[3], SCR[2], u);
  return lerp(top, bot, v);
};
const quad = (u0: number, v0: number, u1: number, v1: number) => {
  const a = persp(u0, v0);
  const b = persp(u1, v0);
  const c = persp(u1, v1);
  const d = persp(u0, v1);
  return `M${a[0]} ${a[1]}L${b[0]} ${b[1]}L${c[0]} ${c[1]}L${d[0]} ${d[1]}Z`;
};

const Bokeh: React.FC<{seed: number; n: number; x: [number, number]; y: [number, number]; r: [number, number]; colors: string[]; op: [number, number]; drift?: number}> = ({seed, n, x, y, r, colors, op, drift = 0}) => {
  const rnd = prng(seed);
  const items = Array.from({length: n}, () => ({
    x: x[0] + rnd() * (x[1] - x[0]),
    y: y[0] + rnd() ** 0.7 * (y[1] - y[0]),
    r: r[0] + rnd() ** 2 * (r[1] - r[0]),
    c: colors[Math.floor(rnd() * colors.length)],
    o: op[0] + rnd() * (op[1] - op[0]),
    ph: rnd() * Math.PI * 2,
  }));
  return (
    <g>
      {items.map((b, i) => (
        <g key={i} opacity={b.o * (0.85 + 0.15 * Math.sin(drift * 0.7 + b.ph))}>
          <circle cx={b.x} cy={b.y} r={b.r} fill={`url(#bk-${b.c.slice(1)})`} />
        </g>
      ))}
    </g>
  );
};

export const BOKEH_COLORS = ['#FFB36B', '#FF7AB8', '#7FE8FF', '#FFE7C2', '#9E8CFF'];

export const RoomDefs: React.FC = () => (
  <>
    {BOKEH_COLORS.map((c) => (
      <radialGradient key={c} id={`bk-${c.slice(1)}`}>
        <stop offset="0" stopColor={c} stopOpacity={0.55} />
        <stop offset="0.72" stopColor={c} stopOpacity={0.5} />
        <stop offset="0.86" stopColor={c} stopOpacity={0.85} />
        <stop offset="1" stopColor={c} stopOpacity={0} />
      </radialGradient>
    ))}
  </>
);

interface RoomProps {
  flicker?: number;
  blur?: number;
  t?: number;
  uiScroll?: number;
}

/** Back plate: wall, window + city, curtain, LED shelf, light cone. Renders the shared defs. */
export const RoomBack: React.FC<RoomProps> = ({flicker = 1, blur = 2.5, t = 0}) => {
  const f = Math.max(0, flicker);
  const rnd = prng(11);
  // far + near city skyline (inside the window)
  const far: string[] = [];
  const near: string[] = [];
  const lit: {x: number; y: number; w: number; c: string}[] = [];
  let x = 90;
  while (x < 1040) {
    const w = 30 + rnd() * 60;
    const h = 90 + rnd() * 220;
    far.push(`M${x} 760V${620 - h}H${x + w}V760Z`);
    x += w + rnd() * 10;
  }
  x = 80;
  while (x < 1040) {
    const w = 50 + rnd() * 90;
    const h = 60 + rnd() * 170;
    near.push(`M${x} 760V${680 - h}H${x + w}V760Z`);
    for (let k = 0; k < 7; k++) if (rnd() > 0.35) lit.push({x: x + 6 + rnd() * (w - 12), y: 690 - h + 14 + rnd() * (h - 10), w: 3 + rnd() * 4, c: rnd() > 0.7 ? '#9EEBFF' : '#FFC98A'});
    x += w + 4 + rnd() * 16;
  }
  return (
    <g>
      <defs>
        <RoomDefs />
        <linearGradient id="rm-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#090B1E" />
          <stop offset="0.55" stopColor="#141A3C" />
          <stop offset="1" stopColor="#0A0C1E" />
        </linearGradient>
        <radialGradient id="rm-monglow" cx="1780" cy="520" r="1100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3FD6F0" stopOpacity={0.55} />
          <stop offset="0.35" stopColor="#1F6E96" stopOpacity={0.28} />
          <stop offset="1" stopColor="#141A3C" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="rm-sky" x1="0" y1="90" x2="0" y2="760" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0E1440" />
          <stop offset="0.55" stopColor="#23256A" />
          <stop offset="0.85" stopColor="#5B3479" />
          <stop offset="1" stopColor="#8A4A86" />
        </linearGradient>
        <linearGradient id="rm-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1B7F9C" />
          <stop offset="0.6" stopColor="#0F4A64" />
          <stop offset="1" stopColor="#0A2E44" />
        </linearGradient>
        <linearGradient id="rm-desk" x1="0" y1="900" x2="0" y2="1080" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1A2146" />
          <stop offset="0.25" stopColor="#10142E" />
          <stop offset="1" stopColor="#07081A" />
        </linearGradient>
        <linearGradient id="rm-deskref" x1="700" y1="0" x2="1920" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={LIGHT.key} stopOpacity={0} />
          <stop offset="0.7" stopColor={LIGHT.key} stopOpacity={0.22} />
          <stop offset="1" stopColor={LIGHT.key} stopOpacity={0.5} />
        </linearGradient>
        <linearGradient id="rm-cone" x1="1620" y1="0" x2="500" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={LIGHT.key} stopOpacity={0.2} />
          <stop offset="1" stopColor={LIGHT.key} stopOpacity={0} />
        </linearGradient>
        <filter id="rm-dof" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation={blur} />
        </filter>
        <filter id="rm-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={blur * 3 + 4} />
        </filter>
        <filter id="rm-bloom" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={46} />
        </filter>
        <filter id="rm-fg" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={18} />
        </filter>
        <filter id="rm-noise" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={1} seed={4} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <clipPath id="rm-win">
          <rect x={110} y={90} width={900} height={640} />
        </clipPath>
      </defs>

      {/* back wall */}
      <rect width={1920} height={1080} fill="url(#rm-wall)" />
      <rect width={1920} height={1080} fill="url(#rm-monglow)" opacity={0.75 + 0.25 * f} />

      <g filter="url(#rm-dof)">
        {/* window */}
        <g clipPath="url(#rm-win)">
          <rect x={110} y={90} width={900} height={640} fill="url(#rm-sky)" />
          <ellipse cx={560} cy={720} rx={620} ry={160} fill="#C0609A" opacity={0.28} filter="url(#rm-soft)" />
          {/* painted clouds */}
          <g filter="url(#rm-soft)" fill="#4A4596">
            <ellipse cx={300} cy={200} rx={260} ry={34} opacity={0.35} />
            <ellipse cx={720} cy={160} rx={300} ry={28} opacity={0.3} />
            <ellipse cx={520} cy={300} rx={340} ry={40} opacity={0.28} />
            <ellipse cx={880} cy={380} rx={200} ry={30} opacity={0.3} fill="#6A4C9A" />
            <ellipse cx={240} cy={420} rx={220} ry={26} opacity={0.26} fill="#6A4C9A" />
          </g>
          <circle cx={880} cy={170} r={90} fill="#8FA6FF" opacity={0.12} filter="url(#rm-soft)" />
          <circle cx={880} cy={170} r={16} fill="#DDE6FF" opacity={0.55} filter="url(#rm-dof)" />
          <g fill="#2E2A6A" opacity={0.85}>
            {far.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          <g fill="#17173E">
            {near.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          {lit.map((l, i) => (
            <rect key={i} x={l.x} y={l.y} width={l.w} height={l.w * 0.8} fill={l.c} opacity={0.75} />
          ))}
          <Bokeh seed={3} n={46} x={[120, 1000]} y={[430, 740]} r={[5, 26]} colors={['#FFB36B', '#FF7AB8', '#FFE7C2', '#7FE8FF']} op={[0.35, 0.9]} drift={t * 0.05} />
          {/* glass reflections */}
          <path d="M380 90 L520 90 L260 730 L120 730 Z" fill="#AFC6FF" opacity={0.05} />
          <path d="M600 90 L640 90 L380 730 L340 730 Z" fill="#AFC6FF" opacity={0.05} />
        </g>
        {/* window frame + mullions */}
        <g fill="#080918">
          <rect x={96} y={78} width={928} height={16} />
          <rect x={96} y={724} width={928} height={22} />
          <rect x={96} y={78} width={18} height={668} />
          <rect x={1006} y={78} width={18} height={668} />
          <rect x={548} y={78} width={16} height={668} />
          <rect x={96} y={396} width={928} height={12} />
        </g>
        <rect x={100} y={744} width={920} height={4} fill="#6E62D6" opacity={0.35} />
        <rect x={1020} y={80} width={3} height={664} fill="#6E62D6" opacity={0.3} />
        {/* curtain at far left */}
        <path d="M0 40 C 40 300 20 700 60 1080 L 0 1080 Z" fill="#0B0C22" />
        <path d="M40 40 C 90 320 70 700 110 1080 L 70 1080 C 36 700 50 320 10 40 Z" fill="#15173A" opacity={0.9} />

        {/* shelf with LED gear, right-back */}
        <g>
          <rect x={1210} y={330} width={330} height={10} fill="#1C2250" />
          <rect x={1210} y={520} width={330} height={10} fill="#1C2250" />
          <rect x={1236} y={264} width={150} height={66} rx={6} fill="#0B0E24" />
          <rect x={1400} y={286} width={110} height={44} rx={6} fill="#0D1028" />
          <rect x={1230} y={440} width={220} height={80} rx={6} fill="#0B0E24" />
          <rect x={1462} y={462} width={60} height={58} rx={4} fill="#101432" />
          {[
            [1256, 300, '#7FE8FF'], [1272, 300, '#7FE8FF'], [1288, 300, '#9CFFB0'], [1420, 306, '#FFB36B'], [1436, 306, '#7FE8FF'],
            [1250, 470, '#9CFFB0'], [1266, 470, '#9CFFB0'], [1282, 470, '#FFB36B'], [1298, 470, '#7FE8FF'], [1480, 480, '#FF7AB8'],
          ].map(([cx, cy, c], i) => (
            <g key={i}>
              <circle cx={cx as number} cy={cy as number} r={14} fill={c as string} opacity={0.18 * (0.8 + 0.2 * Math.sin(t * 0.3 + i))} />
              <circle cx={cx as number} cy={cy as number} r={3} fill={c as string} opacity={i % 3 === 0 ? 0.6 + 0.4 * ((Math.floor(t / 5) + i) % 2) : 1} />
            </g>
          ))}
        </g>
      </g>

      {/* light cone from the monitor */}
      <path d="M1622 300 L 520 60 L 480 1080 L 1622 780 Z" fill="url(#rm-cone)" opacity={0.55 * f} filter="url(#rm-soft)" />
      {/* paint texture / dither (kills 8-bit gradient banding) */}
      <rect width={1920} height={1080} filter="url(#rm-noise)" opacity={0.07} style={{mixBlendMode: 'soft-light'}} />
    </g>
  );
};

/** Front plate: desk, monitor (key light) + bloom. Draw after the characters, inside the same <svg> as RoomBack. */
export const RoomFront: React.FC<RoomProps> = ({flicker = 1, t = 0, uiScroll = 0}) => {
  const f = Math.max(0, flicker);
  // chat-style UI: a user bubble + an answer made of word segments
  const rnd = prng(21);
  const rows = Array.from({length: 13}, (_, i) => {
    const words: [number, number][] = [];
    let u = i < 2 ? 0.52 : 0.08;
    const end = i < 2 ? 0.9 : 0.14 + (0.5 + rnd() * 0.36);
    while (u < end) {
      const w = 0.03 + rnd() * 0.09;
      words.push([u, Math.min(end, u + w)]);
      u += w + 0.018;
    }
    return {v: i < 2 ? 0.15 + i * 0.045 : 0.28 + (i - 2) * 0.05, words};
  });
  return (
    <g>

      {/* desk */}
      <path d="M0 918 L1920 890 L1920 1080 L0 1080 Z" fill="url(#rm-desk)" />
      <path d="M0 918 L1920 890 L1920 912 L0 938 Z" fill="#232B5E" opacity={0.8} />
      <path d="M700 910 L1920 890 L1920 1000 L700 960 Z" fill="url(#rm-deskref)" opacity={0.8 * f} />
      <path d="M0 918 L1920 890" stroke={LIGHT.key} strokeOpacity={0.35 * f} strokeWidth={2} />

      {/* monitor: bezel, glowing screen with a chat-style UI in fake perspective */}
      <g>
        <path d="M1600 272 L1960 196 L1960 876 L1600 792 Z" fill="#06070F" />
        <path d={quad(0, 0, 1, 1)} fill="url(#rm-screen)" opacity={0.75 + 0.25 * f} />
        <g fill="#C8F8FF" opacity={0.55 + 0.35 * f}>
          <path d={quad(0.06, 0.04, 0.94, 0.08)} opacity={0.3} />
          <path d={quad(0.48, 0.125, 0.94, 0.225)} opacity={0.18} />
          {rows.map((r, i) => {
            const v = r.v - (i >= 2 ? uiScroll : 0);
            if (v < 0.25 && i >= 2) return null;
            if (v > 0.8) return null;
            return (
              <g key={i} opacity={i < 2 ? 0.95 : 0.62}>
                {r.words.map(([u0, u1], j) => (
                  <path key={j} d={quad(u0, v, u1, v + 0.018)} />
                ))}
              </g>
            );
          })}
          <path d={quad(0.08, 0.86, 0.92, 0.93)} opacity={0.3} />
          <path d={quad(0.1, 0.88, 0.115, 0.91)} opacity={Math.floor(t / 12) % 2 ? 1 : 0.15} />
        </g>
        <path d="M1600 272 L1622 292 L1622 770 L1600 792 Z" fill="#1B2A44" />
        <path d="M1600 272 L1600 792" stroke={LIGHT.key} strokeOpacity={0.6 * f} strokeWidth={3} />
        {/* monitor stand */}
        <path d="M1700 800 L1760 810 L1780 900 L1690 906 Z" fill="#070812" />
      </g>
      {/* keyboard: dark slab, key tops catching the monitor light */}
      <g>
        <path d="M980 944 L1500 926 L1540 972 L1000 996 Z" fill="#0A0C1C" />
        <path d="M980 944 L1500 926 L1502 930 L982 948 Z" fill={LIGHT.key} opacity={0.35 * f} />
        {[0, 1, 2, 3].map((r) =>
          Array.from({length: 18}, (_, i) => {
            const tt = i / 18;
            const x0 = 996 + r * 5 + tt * 500;
            const y0 = 950 + r * 11 - tt * 18;
            return <rect key={`${r}-${i}`} x={x0} y={y0} width={22} height={6} rx={1.5} fill="#1A2244" stroke={LIGHT.key} strokeOpacity={(0.1 + tt * 0.35) * f} strokeWidth={1} transform={`skewY(-2)`} />;
          }),
        )}
      </g>
      {/* mug */}
      <g>
        <path d="M1552 850 L1552 918 C 1552 930 1612 930 1612 918 L1612 850 Z" fill="#12163A" />
        <ellipse cx={1582} cy={850} rx={30} ry={8} fill="#1E2552" />
        <ellipse cx={1582} cy={851} rx={24} ry={5} fill="#070817" />
        <path d="M1604 856 L1606 916" stroke={LIGHT.key} strokeWidth={4} strokeOpacity={0.7 * f} strokeLinecap="round" />
        <path d="M1552 866 C 1530 866 1528 900 1552 902" stroke="#12163A" strokeWidth={7} fill="none" />
      </g>
      {/* screen bloom */}
      <path d={quad(0, 0, 1, 1)} fill={LIGHT.key} opacity={0.45 * f} filter="url(#rm-bloom)" style={{mixBlendMode: 'screen'}} />
    </g>
  );
};

/** Floating dust motes in the monitor light (deterministic drift). */
export const Motes: React.FC<{t: number; n?: number; region?: [number, number, number, number]; seed?: number; scale?: number}> = ({t, n = 40, region = [600, 120, 1000, 800], seed = 5, scale = 1}) => {
  const rnd = prng(seed);
  const [rx, ry, rw, rh] = region;
  return (
    <g>
      {Array.from({length: n}, (_, i) => {
        const x0 = rnd() * rw;
        const y0 = rnd() * rh;
        const sp = 0.2 + rnd() * 0.6;
        const r = (0.8 + rnd() * 2.2) * scale;
        const ph = rnd() * 6.28;
        const x = rx + ((x0 + t * sp * 0.6 + Math.sin(t * 0.05 + ph) * 12) % rw);
        const y = ry + ((y0 - t * sp * 0.4 + rh * 4) % rh);
        const o = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * 0.08 + ph));
        return <circle key={i} cx={x} cy={y} r={r} fill="#CFFBFF" opacity={o * (1 - Math.abs(x - (rx + rw)) / (rw * 1.4))} />;
      })}
    </g>
  );
};

/** Out-of-focus foreground element framing the shot (bottom-left). */
export const ForegroundBlur: React.FC = () => (
  <g filter="url(#rm-fg)">
    <path d="M-40 1120 C 60 900 160 860 260 900 C 330 930 360 1010 380 1120 Z" fill="#05060F" />
    <path d="M200 1120 C 250 960 330 930 400 960" stroke={LIGHT.back} strokeWidth={8} strokeOpacity={0.25} fill="none" />
  </g>
);
