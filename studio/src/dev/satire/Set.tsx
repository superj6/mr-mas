// SATIRE structure — the miniature puppet-studio set: back wall flats, window, shelf, door, desk + props.
// World units = screen px of the wide shot (1920x1080) before the camera transform.
import React from 'react';
import {blob, clamp, ellPts, lerp, mix, type XY} from './lib';
import {Soft, bl} from './kit';

const CY = '#6FE8F2';
const WARM = '#FFB36A';

const seeded = (n: number) => {
  let x = n * 9301 + 49297;
  return () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
};

/** Back wall + window + shelf + poster + door (the whole group gets depth-of-field blur by the caller). */
export const BackSet: React.FC<{door: number; doorLight: number; lit: number; shelfJolt: number; t: number; masShadowX: number}> = ({
  door,
  doorLight,
  lit: key,
  shelfJolt,
  masShadowX,
}) => {
  const rnd = seeded(7);
  const bokeh = Array.from({length: 46}).map(() => ({
    x: 150 + rnd() * 420,
    y: 150 + rnd() * 300,
    r: 3 + rnd() * 10,
    c: rnd() > 0.55 ? '#FFC98A' : rnd() > 0.5 ? '#9FD6FF' : '#FFE6C2',
    o: 0.25 + rnd() * 0.6,
  }));
  // door: hinge at x=1790, opens into the room toward camera
  const ang = door * (Math.PI / 180) * 100;
  const hx = 1790;
  const w = 262;
  const fx = hx - w * Math.cos(ang);
  const grow = Math.sin(ang) * 34;
  const books = Array.from({length: 14}).map((_, i) => {
    const r2 = seeded(i + 30);
    return {x: 990 + i * 17 + (i > 8 ? 30 : 0), h: 70 + r2() * 40, w: 13 + r2() * 5, c: ['#6A3A30', '#2E4A5A', '#8A7A5A', '#3A3A44', '#7A4A3A', '#4A5A3A'][i % 6], tilt: i === 11 ? -14 : 0};
  });
  return (
    <g>
      <defs>
        <linearGradient id="bs-wall" x1="0" y1="0" x2="1920" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#10222C" />
          <stop offset="0.4" stopColor="#0C1820" />
          <stop offset="1" stopColor="#080E14" />
        </linearGradient>
        <radialGradient id="bs-cy" cx="560" cy="600" r="900" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2F8C98" stopOpacity={0.55} />
          <stop offset="0.5" stopColor="#1A4A56" stopOpacity={0.25} />
          <stop offset="1" stopColor="#0A1A20" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="bs-warm" cx="1650" cy="560" r="700" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFB060" stopOpacity={0.6} />
          <stop offset="0.45" stopColor="#B8602A" stopOpacity={0.22} />
          <stop offset="1" stopColor="#401808" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="bs-sky" x1="0" y1="80" x2="0" y2="470" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0A1430" />
          <stop offset="0.7" stopColor="#1A2A50" />
          <stop offset="1" stopColor="#3A3050" />
        </linearGradient>
        <radialGradient id="bs-hall" cx="1650" cy="420" r="420" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFF2D6" />
          <stop offset="0.45" stopColor="#FFC57A" />
          <stop offset="1" stopColor="#B86A30" />
        </radialGradient>
      </defs>
      <rect x={-200} y={-200} width={2400} height={1400} fill="url(#bs-wall)" />
      {/* wainscot panelling + set-flat seams (it is a built miniature, and we let it show) */}
      <rect x={-200} y={600} width={2400} height={600} fill="#0A141A" opacity={0.6} />
      <rect x={-200} y={596} width={2400} height={8} fill="#1C2E36" />
      {[80, 470, 860, 1250].map((x) => (
        <rect key={x} x={x} y={640} width={330} height={200} rx={6} fill="none" stroke="#18262E" strokeWidth={6} />
      ))}
      {[455, 1010, 1470].map((x) => (
        <rect key={x} x={x} y={-200} width={3} height={1400} fill="#050A0E" opacity={0.7} />
      ))}
      {/* window: night city through the glass */}
      <rect x={140} y={70} width={440} height={400} fill="url(#bs-sky)" />
      <g>
        {bokeh.map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={b.c} opacity={b.o} />
        ))}
      </g>
      <path d="M 140 420 L 180 380 L 220 400 L 250 350 L 300 360 L 330 320 L 370 340 L 400 300 L 450 330 L 500 310 L 540 350 L 580 330 L 580 470 L 140 470 Z" fill="#0A0E18" opacity={0.85} />
      <rect x={140} y={70} width={440} height={400} fill="none" stroke="#1E2A32" strokeWidth={22} />
      <rect x={352} y={70} width={16} height={400} fill="#1E2A32" />
      <rect x={140} y={262} width={440} height={16} fill="#1E2A32" />
      <rect x={120} y={466} width={480} height={20} fill="#26343C" />
      {/* poster (parody): an orb over a skyline */}
      <g>
        <rect x={1040} y={120} width={210} height={270} fill="#1A1016" stroke="#2A2A30" strokeWidth={10} />
        <circle cx={1145} cy={230} r={56} fill="#D8E8F0" opacity={0.55} />
        <circle cx={1145} cy={230} r={40} fill="#0E1A22" opacity={0.7} />
        <rect x={1070} y={320} width={150} height={14} fill="#C8B070" opacity={0.6} />
        <rect x={1090} y={344} width={110} height={8} fill="#C8B070" opacity={0.4} />
      </g>
      {/* shelf with books, a plant, a trophy */}
      <g transform={`translate(0 ${-Math.max(0, shelfJolt) * 8})`}>
        <rect x={960} y={520} width={420} height={16} fill="#2A2420" />
        {books.map((b, i) => (
          <rect key={i} x={b.x} y={520 - b.h} width={b.w} height={b.h} fill={b.c} transform={`rotate(${b.tilt + shelfJolt * (i % 3 - 1) * 4} ${b.x} 520)`} />
        ))}
        <path d="M 1290 520 L 1300 486 L 1340 486 L 1350 520 Z" fill="#6A4A3A" />
        <g transform={`rotate(${shelfJolt * 6} 1320 486)`}>
          <path d={blob([[1320, 486], [1290, 450], [1300, 420], [1320, 440], [1330, 410], [1350, 446], [1344, 480]])} fill="#2E5A3A" />
        </g>
        <path d="M 1206 520 L 1214 470 L 1236 470 L 1244 520 Z" fill="#9A8040" />
        <circle cx={1225} cy={458} r={16} fill="#C8A850" />
      </g>
      {/* monitor light on the wall + Mas's soft shadow thrown screen-right */}
      <rect x={-200} y={-200} width={2400} height={1400} fill="url(#bs-cy)" opacity={0.6 + 0.4 * key} style={{mixBlendMode: 'screen'}} />
      <Soft blur={40} op={0.55}>
        <path d={blob([[masShadowX - 170, 900], [masShadowX - 190, 620], [masShadowX - 120, 520], [masShadowX - 140, 300], [masShadowX, 180], [masShadowX + 150, 300], [masShadowX + 130, 520], [masShadowX + 200, 620], [masShadowX + 190, 900]])} fill="#02060A" />
      </Soft>
      {/* door frame, doorway, door panel */}
      <rect x={1500} y={70} width={320} height={760} fill="#1A2228" />
      <rect x={1526} y={96} width={264} height={734} fill="#05080A" />
      {doorLight > 0 ? <rect x={1526} y={96} width={264} height={734} fill="url(#bs-hall)" opacity={clamp(doorLight)} /> : null}
      {doorLight > 0 ? (
        <g opacity={clamp(doorLight) * 0.9} style={{mixBlendMode: 'screen'}}>
          <rect x={-200} y={-200} width={2400} height={1400} fill="url(#bs-warm)" />
        </g>
      ) : null}
      <g>
        <path d={`M ${hx} 96 L ${fx} ${96 - grow * 0.6} L ${fx} ${830 + grow} L ${hx} 830 Z`} fill={mix('#26343C', '#3A2A20', clamp(doorLight) * 0.5)} />
        {door < 0.5 ? (
          <g opacity={1 - door * 2}>
            <rect x={lerp(1560, fx + 30, door)} y={140} width={Math.max(2, (hx - fx) - 70)} height={280} fill="none" stroke="#1A262C" strokeWidth={8} />
            <rect x={lerp(1560, fx + 30, door)} y={470} width={Math.max(2, (hx - fx) - 70)} height={300} fill="none" stroke="#1A262C" strokeWidth={8} />
            <circle cx={fx + 26} cy={470} r={10} fill="#8A8070" />
          </g>
        ) : null}
        <path d={`M ${fx} ${96 - grow * 0.6} L ${fx + 8} ${96 - grow * 0.6} L ${fx + 8} ${830 + grow} L ${fx} ${830 + grow} Z`} fill={WARM} opacity={clamp(doorLight) * 0.7} />
      </g>
      <rect x={1500} y={70} width={26} height={760} fill="#222C32" />
      <rect x={1790} y={70} width={30} height={760} fill="#222C32" />
      <rect x={1500} y={70} width={320} height={26} fill="#222C32" />
    </g>
  );
};

/** Volumetric haze: the doorway beam + the monitor bloom. Screen-blended, no blur needed beyond its own. */
export const Haze: React.FC<{doorLight: number; lit: number}> = ({doorLight, lit: key}) => (
  <g style={{mixBlendMode: 'screen'}}>
    {doorLight > 0 ? (
      <g filter={bl(40)} opacity={clamp(doorLight) * 0.15}>
        <path d="M 1530 110 L 1790 110 L 1500 1100 L 820 1100 Z" fill="#FFB36A" />
      </g>
    ) : null}
    <defs>
      <radialGradient id="hz-mon" cx="430" cy="560" r="520" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor={CY} stopOpacity={0.5} />
        <stop offset="0.35" stopColor="#2FA8B8" stopOpacity={0.16} />
        <stop offset="1" stopColor="#0A2A30" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect x={-100} y={0} width={1300} height={1100} fill="url(#hz-mon)" opacity={0.55 + 0.25 * key} />
  </g>
);

/** Mas's office chair back (behind him). */
export const Chair: React.FC<{rim: number; lit: number}> = ({rim, lit: key}) => (
  <g>
    <path d={blob([[560, 800], [556, 600], [580, 520], [680, 486], [880, 486], [980, 520], [1004, 600], [1000, 800]])} fill="#0C0E12" />
    <g filter={bl(10)} opacity={0.5}>
      <path d={blob([[600, 780], [600, 610], [640, 540], [920, 540], [960, 610], [960, 780]])} fill="#1A1E26" />
    </g>
    <g filter={bl(4)} opacity={rim * 0.8} style={{mixBlendMode: 'screen'}}>
      <path d={blob([[880, 490], [980, 522], [1002, 600], [1000, 780]], false)} fill="none" stroke={WARM} strokeWidth={5} />
    </g>
    <g filter={bl(5)} opacity={key * 0.4} style={{mixBlendMode: 'screen'}}>
      <path d={blob([[560, 780], [558, 600], [582, 524], [680, 490]], false)} fill="none" stroke={CY} strokeWidth={5} />
    </g>
  </g>
);

/** Desk top surface + front face (the playboard: every puppeteer hides below this line). */
export const Desk: React.FC<{key2: number; doorLight: number; jolt: number}> = ({key2, doorLight, jolt}) => {
  const j = -Math.max(0, jolt) * 7;
  return (
    <g transform={`translate(0 ${j})`}>
      <defs>
        <linearGradient id="dk-top" x1="0" y1="772" x2="0" y2="912" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1A120E" />
          <stop offset="1" stopColor="#2E2018" />
        </linearGradient>
        <radialGradient id="dk-cy" cx="380" cy="830" r="620" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={CY} stopOpacity={0.55} />
          <stop offset="0.5" stopColor="#2A8A96" stopOpacity={0.18} />
          <stop offset="1" stopColor="#0A2024" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="dk-warm" cx="1500" cy="800" r="600" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={WARM} stopOpacity={0.45} />
          <stop offset="1" stopColor="#401808" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="dk-front" x1="0" y1="912" x2="0" y2="1100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#140E0A" />
          <stop offset="1" stopColor="#050304" />
        </linearGradient>
      </defs>
      <path d="M -200 772 L 2120 772 L 2140 912 L -220 912 Z" fill="url(#dk-top)" />
      {/* wood grain */}
      <g filter={bl(2)} opacity={0.35}>
        {[790, 812, 838, 866, 892].map((y, i) => (
          <path key={y} d={`M -200 ${y} C 400 ${y + (i % 2 ? 4 : -3)} 1100 ${y + (i % 2 ? -5 : 4)} 2120 ${y}`} fill="none" stroke="#3A281C" strokeWidth={2} />
        ))}
      </g>
      <path d="M -200 772 L 2120 772 L 2140 912 L -220 912 Z" fill="url(#dk-cy)" opacity={0.6 + 0.4 * key2} style={{mixBlendMode: 'screen'}} />
      {doorLight > 0 ? <path d="M -200 772 L 2120 772 L 2140 912 L -220 912 Z" fill="url(#dk-warm)" opacity={clamp(doorLight)} style={{mixBlendMode: 'screen'}} /> : null}
      <path d="M -220 912 L 2140 912 L 2140 1200 L -220 1200 Z" fill="url(#dk-front)" />
      <rect x={-220} y={908} width={2360} height={5} fill="#5A4A40" opacity={0.7} />
      <g filter={bl(3)} opacity={0.5 * key2} style={{mixBlendMode: 'screen'}}>
        <rect x={-100} y={906} width={900} height={4} fill={CY} />
      </g>
    </g>
  );
};

export const Keyboard: React.FC<{key2: number; jolt: number; hl: number; hr: number}> = ({key2, jolt, hl, hr}) => {
  const j = -Math.max(0, jolt) * 12;
  const keys: React.ReactNode[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 15; c++) {
      const y = 812 + r * 11;
      const x0 = lerp(612, 596, r / 3);
      const x1 = lerp(948, 964, r / 3);
      const kw = (x1 - x0) / 15;
      const x = x0 + c * kw;
      const pressed = (r === 2 && ((c === 3 && hl > 0.7) || (c === 11 && hr > 0.7))) ? 2 : 0;
      keys.push(<rect key={`${r}-${c}`} x={x + 1} y={y + pressed} width={kw - 3} height={8} rx={2} fill="#1C2026" />);
    }
  }
  return (
    <g transform={`translate(0 ${j})`}>
      <path d="M 600 806 L 960 806 L 976 862 L 584 862 Z" fill="#0C0E12" />
      <path d="M 584 862 L 976 862 L 976 870 L 584 870 Z" fill="#050608" />
      {keys}
      <g filter={bl(3)} opacity={0.55 * key2} style={{mixBlendMode: 'screen'}}>
        <path d="M 600 806 L 800 806 L 790 862 L 584 862 Z" fill="#2A8A96" opacity={0.5} />
      </g>
    </g>
  );
};

/** THE GLASS OF WATER. It never moves and its surface never ripples — that is the joke. */
export const WaterGlass: React.FC<{key2: number; doorLight: number; glint?: number}> = ({key2, doorLight, glint = 0}) => {
  const cx = 500;
  const top = 700;
  const bot = 872;
  const rt = 40;
  const rb = 34;
  const wl = 752; // water line
  const rw = lerp(rt, rb, (wl - top) / (bot - top));
  return (
    <g>
      <defs>
        <linearGradient id="wg-water" x1={cx - rt} y1="0" x2={cx + rt} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8FF4FA" stopOpacity={0.55} />
          <stop offset="0.35" stopColor="#2A7A86" stopOpacity={0.35} />
          <stop offset="0.8" stopColor="#0E3038" stopOpacity={0.45} />
          <stop offset="1" stopColor="#FFB36A" stopOpacity={0.25 * doorLight} />
        </linearGradient>
        <linearGradient id="wg-surf" x1={cx - rw} y1="0" x2={cx + rw} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#D6FCFF" />
          <stop offset="0.5" stopColor="#5FC8D4" />
          <stop offset="1" stopColor="#1A4A54" />
        </linearGradient>
      </defs>
      {/* contact shadow + caustic thrown to the right by the monitor light */}
      <g filter={bl(6)} opacity={0.7}>
        <ellipse cx={cx + 8} cy={bot + 2} rx={rb + 14} ry={8} fill="#020304" />
      </g>
      <g filter={bl(5)} opacity={0.55 * key2} style={{mixBlendMode: 'screen'}}>
        <ellipse cx={cx + 74} cy={bot - 4} rx={36} ry={7} fill={CY} />
        <ellipse cx={cx + 66} cy={bot - 5} rx={10} ry={3} fill="#E8FFFF" />
      </g>
      {/* water body */}
      <path d={`M ${cx - rw} ${wl} L ${cx + rw} ${wl} L ${cx + rb} ${bot - 16} L ${cx - rb} ${bot - 16} Z`} fill="url(#wg-water)" />
      {/* refraction band */}
      <g filter={bl(3)} opacity={0.5}>
        <rect x={cx - rw * 0.2} y={wl + 8} width={rw * 0.5} height={bot - wl - 30} fill="#0A1A20" />
      </g>
      {/* still, mirror-flat surface */}
      <ellipse cx={cx} cy={wl} rx={rw} ry={5.5} fill="url(#wg-surf)" opacity={0.9} />
      <path d={`M ${cx - rw + 3} ${wl} Q ${cx} ${wl + 6} ${cx + rw - 3} ${wl}`} fill="none" stroke="#FFFFFF" strokeWidth={1.4} opacity={0.8} />
      {/* thick glass base */}
      <path d={`M ${cx - rb} ${bot - 16} L ${cx + rb} ${bot - 16} L ${cx + rb} ${bot} L ${cx - rb} ${bot} Z`} fill="#6ACCD8" opacity={0.28} />
      <ellipse cx={cx} cy={bot - 16} rx={rb} ry={4} fill="#BDF4F8" opacity={0.35} />
      {/* walls */}
      <path d={`M ${cx - rt} ${top} L ${cx - rb} ${bot} M ${cx + rt} ${top} L ${cx + rb} ${bot}`} stroke="#9FE8EE" strokeWidth={2} opacity={0.5} />
      <ellipse cx={cx} cy={top} rx={rt} ry={6} fill="none" stroke="#CFF8FA" strokeWidth={2} opacity={0.6} />
      <g filter={bl(1.2)} style={{mixBlendMode: 'screen'}}>
        <path d={`M ${cx - rt + 6} ${top + 10} L ${cx - rb + 5} ${bot - 20}`} stroke="#E8FFFF" strokeWidth={5} opacity={0.75 * key2} />
        <path d={`M ${cx - rt + 16} ${top + 14} L ${cx - rb + 14} ${bot - 26}`} stroke="#E8FFFF" strokeWidth={1.6} opacity={0.5 * key2} />
        <path d={`M ${cx + rt - 5} ${top + 10} L ${cx + rb - 4} ${bot - 20}`} stroke={WARM} strokeWidth={3} opacity={0.8 * doorLight} />
      </g>
      {/* the punchline 'ting': a glint on the unmoved rim */}
      {glint > 0 ? (
        <g transform={`translate(${cx - rt + 10} ${top + 2}) scale(${glint}) rotate(${glint * 30})`} style={{mixBlendMode: 'screen'}}>
          <g filter={bl(3)} opacity={0.8}>
            <circle r={14} fill={CY} />
          </g>
          <path d="M 0 -34 L 4 -4 L 34 0 L 4 4 L 0 34 L -4 4 L -34 0 L -4 -4 Z" fill="#F4FFFF" />
        </g>
      ) : null}
    </g>
  );
};

/** Coffee mug that DOES slosh (the control group for the water gag). */
export const Mug: React.FC<{jolt: number; t: number; t0: number; key2: number; doorLight: number}> = ({jolt, t, t0, key2, doorLight}) => {
  const cx = 1250;
  const top = 770;
  const bot = 866;
  const j = -Math.max(0, jolt) * 16;
  const tilt = jolt * 16;
  const d = t - t0;
  const drops =
    d > 0 && d < 12
      ? [
          {vx: -3.2, vy: -9, r: 5},
          {vx: 2.4, vy: -11, r: 4},
          {vx: 0.6, vy: -13, r: 6},
          {vx: 4.2, vy: -7, r: 3},
        ].map((q, i) => ({x: cx + q.vx * d * 2.2, y: top - 4 + q.vy * d + 0.9 * d * d * 1.4, r: q.r, i}))
      : [];
  return (
    <g>
      <g transform={`translate(0 ${j}) rotate(${jolt * 3} ${cx} ${bot})`}>
        <ellipse cx={cx + 6} cy={bot + 2} rx={52} ry={9} fill="#020304" opacity={0.6} />
        <path d={`M ${cx + 44} ${top + 22} C ${cx + 80} ${top + 22} ${cx + 80} ${top + 70} ${cx + 44} ${top + 70}`} fill="none" stroke="#C8C4BC" strokeWidth={12} />
        <path d={`M ${cx - 46} ${top} L ${cx + 46} ${top} L ${cx + 44} ${bot} L ${cx - 44} ${bot} Z`} fill="#BDB8AE" />
        <g filter={bl(8)} opacity={0.6}>
          <rect x={cx + 6} y={top} width={40} height={bot - top} fill="#3A3634" />
        </g>
        <g filter={bl(6)} opacity={0.5 * key2} style={{mixBlendMode: 'screen'}}>
          <rect x={cx - 46} y={top} width={22} height={bot - top} fill={CY} />
        </g>
        <g filter={bl(4)} opacity={0.6 * doorLight} style={{mixBlendMode: 'screen'}}>
          <rect x={cx + 36} y={top} width={10} height={bot - top} fill={WARM} />
        </g>
        <ellipse cx={cx} cy={top} rx={46} ry={9} fill="#9A958C" />
        <g transform={`rotate(${tilt} ${cx} ${top + 6})`}>
          <ellipse cx={cx} cy={top + 6} rx={40} ry={6} fill="#2A140A" />
          <ellipse cx={cx - 10} cy={top + 5} rx={14} ry={2} fill="#7A5A40" opacity={0.6} />
        </g>
      </g>
      {drops.map((q) => (
        <g key={q.i}>
          <circle cx={q.x} cy={q.y} r={q.r} fill="#3A1E10" />
          <circle cx={q.x - q.r * 0.3} cy={q.y - q.r * 0.3} r={q.r * 0.35} fill="#C89A70" opacity={0.7} />
        </g>
      ))}
    </g>
  );
};

/** THE ORB — a chrome sphere on a little stand, reflecting the monitor. */
export const Orb: React.FC<{jolt: number; key2: number; doorLight: number}> = ({jolt, key2, doorLight}) => {
  const cx = 1060;
  const cy = 752;
  const r = 30;
  return (
    <g transform={`translate(0 ${-Math.max(0, jolt) * 10}) rotate(${jolt * 8} ${cx} ${cy + r + 18})`}>
      <defs>
        <radialGradient id="orb-g" cx={cx - 10} cy={cy - 12} r={r * 1.3} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F4FBFF" />
          <stop offset="0.3" stopColor="#8AA4B0" />
          <stop offset="0.7" stopColor="#1C262C" />
          <stop offset="1" stopColor="#4A6068" />
        </radialGradient>
      </defs>
      <path d={`M ${cx - 16} ${cy + r + 18} L ${cx + 16} ${cy + r + 18} L ${cx + 8} ${cy + r - 2} L ${cx - 8} ${cy + r - 2} Z`} fill="#2A3036" />
      <circle cx={cx} cy={cy} r={r} fill="url(#orb-g)" />
      <path d={`M ${cx - r * 0.8} ${cy + 4} Q ${cx} ${cy + 12} ${cx + r * 0.8} ${cy + 4}`} fill="none" stroke="#0A0E12" strokeWidth={3} opacity={0.6} />
      <rect x={cx - 20} y={cy - 18} width={14} height={10} rx={2} fill={CY} opacity={0.8 * key2} />
      <circle cx={cx + 18} cy={cy - 6} r={4} fill={WARM} opacity={doorLight} />
    </g>
  );
};

/** Foreground monitor, seen from behind (three-quarter back), heavily out of focus. */
export const Monitor: React.FC<{key2: number; jolt: number}> = ({key2, jolt}) => (
  <g transform={`rotate(${jolt * 1.4} 200 900)`}>
    <path d={blob([[-120, 300], [300, 318], [400, 330], [412, 540], [404, 750], [300, 764], [-120, 790]])} fill="#07090C" />
    <path d={blob([[-40, 380], [240, 392], [300, 420], [300, 660], [240, 690], [-40, 700]])} fill="#0E1216" />
    {/* the screen itself faces Mas: we only catch its glowing edge and the light it throws */}
    <path d="M 396 334 L 420 342 L 414 748 L 392 752 Z" fill="#DFFCFF" opacity={0.9 * key2} />
    <g filter={bl(10)} opacity={0.9 * key2} style={{mixBlendMode: 'screen'}}>
      <path d={blob([[402, 330], [418, 540], [410, 752]], false)} fill="none" stroke={CY} strokeWidth={26} />
    </g>
    <g filter={bl(36)} opacity={0.55 * key2} style={{mixBlendMode: 'screen'}}>
      <ellipse cx={470} cy={540} rx={90} ry={260} fill={CY} />
    </g>
    <path d="M 170 760 L 230 760 L 250 900 L 150 900 Z" fill="#090B0E" />
    <ellipse cx={200} cy={906} rx={150} ry={22} fill="#0A0C10" />
    <g filter={bl(4)} opacity={0.5 * key2} style={{mixBlendMode: 'screen'}}>
      <path d="M 232 770 L 250 900" stroke={CY} strokeWidth={4} />
      <ellipse cx={290} cy={900} rx={60} ry={6} fill={CY} />
    </g>
  </g>
);

export const Vignette: React.FC<{amt?: number}> = ({amt = 0.75}) => (
  <g>
    <defs>
      <radialGradient id="vg" cx="960" cy="560" r="1150" gradientUnits="userSpaceOnUse">
        <stop offset="0.45" stopColor="#000" stopOpacity={0} />
        <stop offset="1" stopColor="#000" stopOpacity={amt} />
      </radialGradient>
    </defs>
    <rect x={0} y={0} width={1920} height={1080} fill="url(#vg)" />
  </g>
);

export const ellipsePts = ellPts;
