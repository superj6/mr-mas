import React from 'react';
import {Piece, Thread, Joint, Brad, cut, poly, rect, oval, torn, tornHole, rnd, hash, ring, clamp, type Pt} from './paper';

/**
 * The diorama: MAS's night room in side elevation (dollhouse cross-section), symmetric about x=960.
 * World units = 1920x1080 at camera zoom 1. Layers (back to front):
 *   SKY   (through the round window)  — stars are pin-pricks, moon hangs on a thread
 *   WALL  — striped wallpaper, round window, frames on nails, the tear (Nole's entrance)
 *   MID   — floor, rug, desk, chair, monitor, puppets, glass of water
 *   FG    — out-of-focus leaves / books
 */
export const WIN = {cx: 960, cy: 392, r: 206};
export const MON = {x: 585, y: 560};
export const TEAR = {cx: 1592, cy: 606, rx: 118, ry: 300};
export const FLOOR_Y = 900;

export const SetDefs: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <defs>
      <pattern id="pz-stripes" patternUnits="userSpaceOnUse" width={64} height={72}>
        <rect width={64} height={72} fill="#a86a5e" />
        <rect x={0} width={26} height={72} fill="#9b5f55" />
        <rect x={28} width={2.2} height={72} fill="#caa08a" />
        <rect x={60} width={1.2} height={72} fill="#8c5249" />
        <path d="M 45 14 C 49 20 49 24 45 30 C 41 24 41 20 45 14 Z" fill="#b97a6a" />
        <circle cx={45} cy={50} r={2.2} fill="#b97a6a" />
        <path d="M 13 50 C 16 54 16 57 13 61 C 10 57 10 54 13 50 Z" fill="#a66b5f" opacity={0.8} />
      </pattern>
      <pattern id="pz-rugpat" patternUnits="userSpaceOnUse" width={46} height={46}>
        <rect width={46} height={46} fill="#7e3326" />
        <path d="M 23 6 L 36 23 L 23 40 L 10 23 Z" fill="#a4553a" />
        <path d="M 23 15 L 29 23 L 23 31 L 17 23 Z" fill="#d7b27a" />
      </pattern>
      <linearGradient id="pz-screen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#b8fbff" />
        <stop offset="0.5" stopColor="#5fe3f6" />
        <stop offset="1" stopColor="#1fa6c8" />
      </linearGradient>
      <radialGradient id="pz-hall" cx="0.5" cy="0.32" r="0.75">
        <stop offset="0" stopColor="#fff0c8" />
        <stop offset="0.3" stopColor="#ffbf6a" />
        <stop offset="0.7" stopColor="#c0622a" />
        <stop offset="1" stopColor="#5a2410" />
      </radialGradient>
      <radialGradient id="pz-moon" cx="0.42" cy="0.4" r="0.6">
        <stop offset="0" stopColor="#fbf4dc" />
        <stop offset="0.8" stopColor="#e9dcb8" />
        <stop offset="1" stopColor="#cdbd96" />
      </radialGradient>
      <linearGradient id="pz-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0b1430" />
        <stop offset="0.7" stopColor="#1a2b52" />
        <stop offset="1" stopColor="#2c3f66" />
      </linearGradient>
      <linearGradient id="pz-glass" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#e9fdff" stopOpacity={0.55} />
        <stop offset="0.25" stopColor="#bff4ff" stopOpacity={0.12} />
        <stop offset="0.75" stopColor="#bff4ff" stopOpacity={0.08} />
        <stop offset="1" stopColor="#e9fdff" stopOpacity={0.3} />
      </linearGradient>
      <linearGradient id="pz-water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8ff2ff" stopOpacity={0.75} />
        <stop offset="1" stopColor="#2aa4c4" stopOpacity={0.55} />
      </linearGradient>
    </defs>
  </svg>
);

// ------------------------------------------------------------------ SKY
export const Sky: React.FC<{f: number; swing: number}> = ({f, swing}) => {
  const r = rnd(900);
  const stars: React.ReactNode[] = [];
  for (let i = 0; i < 46; i++) {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * (WIN.r + 10);
    const x = WIN.cx + Math.cos(a) * d;
    const y = WIN.cy + Math.sin(a) * d - 20;
    if (y > WIN.cy + 120) continue;
    const s = 0.8 + r() * 1.8;
    const tw = 0.65 + 0.35 * hash(i * 31 + Math.floor(f / 4));
    stars.push(
      <g key={i} opacity={tw}>
        <circle cx={x} cy={y} r={s * 2.6} fill="#ffe9b0" opacity={0.18} />
        <circle cx={x} cy={y} r={s * 0.7} fill="#fff8e2" />
      </g>,
    );
  }
  return (
    <g>
      <rect x={-200} y={-200} width={2320} height={1400} fill="url(#pz-sky)" />
      <Piece d={rect(600, 60, 720, 700, 901, 0)} fill="#16244a" z={0} tex="soft" edge={0} op={0.6} />
      {stars}
    </g>
  );
};
export const Skyline: React.FC = () => {
  const r = rnd(950);
  const far: [number, number][] = [];
  const near: [number, number][] = [];
  let x = 700;
  far.push([700, 700]);
  while (x < 1230) {
    const h = 520 + r() * 50;
    far.push([x, h], [x + 26 + r() * 20, h]);
    x += 30 + r() * 26;
  }
  far.push([1240, 700]);
  x = 700;
  near.push([700, 700]);
  const wins: React.ReactNode[] = [];
  let k = 0;
  while (x < 1230) {
    const w = 34 + r() * 40;
    const h = 548 + r() * 40;
    near.push([x, h], [x + w, h]);
    for (let wy = h + 10; wy < 610; wy += 12)
      for (let wx = x + 6; wx < x + w - 6; wx += 10) {
        if (hash(k++ * 7 + 3) > 0.8) wins.push(<rect key={k} x={wx} y={wy} width={4} height={5} fill="#ffcf7a" opacity={0.85} />);
      }
    x += w + 4;
  }
  near.push([1240, 700]);
  return (
    <g>
      <Piece d={poly(far, 951, 0.3)} fill="#243a62" z={0} tex="soft" edge={0} />
      <Piece d={poly(near, 952, 0.3)} fill="#111b33" z={1} tex="soft" edge={0.08} />
      {wins}
    </g>
  );
};
export const Moon: React.FC<{swing: number}> = ({swing}) => (
  <Joint x={872} y={-40} a={swing}>
    <Thread d="M 0 0 L 0 290" color="#d8d2c0" w={1.2} op={0.7} />
    <g transform="translate(0 330)">
      <circle r={70} fill="#fff1c8" opacity={0.08} />
      <circle r={52} fill="#fff1c8" opacity={0.1} />
      <Piece d={oval(0, 0, 40, 40, 960, 16, 0.4)} fill="url(#pz-moon)" z={1.5} tex="soft" edge={0.3} />
      <Piece d={oval(-10, -8, 8, 7, 961)} fill="#d6c79f" z={0} tex="soft" edge={0} op={0.8} />
      <Piece d={oval(12, 10, 6, 5, 962)} fill="#d6c79f" z={0} tex="soft" edge={0} op={0.7} />
      <Piece d={oval(8, -16, 4, 3.5, 963)} fill="#d6c79f" z={0} tex="soft" edge={0} op={0.7} />
    </g>
  </Joint>
);

// ------------------------------------------------------------------ WALL
const WALL_OUT = rect(-240, -200, 2400, 1300, 970, 0);
const winHole = oval(WIN.cx, WIN.cy, WIN.r, WIN.r, 971, 40, 0.4);
/** tear shape at growth k (0..1). Same seed each frame so it grows, not boils. */
export const tearPath = (k: number, g = 1) => tornHole(TEAR.cx, TEAR.cy + (1 - k) * -80, TEAR.rx * k * g, TEAR.ry * k * (1 - (1 - g) * 0.6), 975);

export const Wall: React.FC<{u?: string; f: number; tearK: number; frameL: number; frameR: number; hall: number}> = ({u = '', f, tearK, frameL, frameR, hall}) => {
  const hole = tearK > 0 ? tearPath(tearK) : '';
  const ring1 = tearK > 0 ? tearPath(tearK, 1.07) : '';
  return (
    <g>
      <clipPath id={`pz-wallcut${u}`}>
        <path d={`${WALL_OUT} ${hole}`} clipRule="evenodd" />
      </clipPath>
      {/* the hallway behind the wall (only visible through the tear) */}
      {tearK > 0 ? (
        <g>
          <rect x={1380} y={200} width={420} height={780} fill="url(#pz-hall)" />
          <Piece d={rect(1528, 330, 130, 600, 976, 1)} fill="#b8733c" z={0} tex="kraft" edge={0} op={0.35} />
          <Piece d={rect(1470, 870, 260, 100, 977, 1)} fill="#7a3f1e" z={0} tex="kraft" edge={0} op={0.6} />
          <circle cx={1600} cy={430} r={54} fill="#fff6d8" opacity={0.5 * hall} />
          <circle cx={1600} cy={430} r={18} fill="#fffbe8" opacity={0.9 * hall} />
          {/* the wall's torn edge throws a shadow into the hall */}
          <path d={hole} fill="none" stroke="#1a0a04" strokeWidth={26} opacity={0.55} transform="translate(8 8)" filter="url(#pz-b4)" />
        </g>
      ) : null}
      <g clipPath={tearK > 0 ? `url(#pz-wallcut${u})` : undefined}>
        {/* wallpaper: striped upper, green wainscot lower */}
        <Piece d={`${WALL_OUT} ${winHole}`} rule="evenodd" fill="url(#pz-stripes)" z={0} tex="card" edge={0} />
        <Piece d={rect(-240, 688, 2400, 420, 972, 0)} fill="#2e4a3f" z={0.6} tex="card" edge={0.08} />
        {[-120, 150, 420, 690, 960, 1230, 1500, 1770].map((x, i) => (
          <Piece key={i} d={rect(x - 110 + 4, 724, 220, 128, 980 + i, 0.8)} fill="#36574a" z={0.5} tex="card" edge={0.1} />
        ))}
        <Piece d={rect(-240, 676, 2400, 16, 990, 0.4)} fill="#cdbb98" z={0.9} tex="card" />
        <Piece d={rect(-240, 866, 2400, 150, 991, 0.4)} fill="#243a31" z={0.7} tex="card" />
        <Piece d={rect(-240, 862, 2400, 8, 992, 0.2)} fill="#cdbb98" z={0.5} tex="card" />
      </g>
      {/* torn fibre ring (white core of the paper) + peeled flaps */}
      {tearK > 0 ? (
        <g>
          <g filter="url(#pz-fray)">
            <Piece d={`${ring1} ${hole}`} rule="evenodd" fill="#f0e6cf" z={0.8} tex="card" edge={0} />
          </g>
          {tearK > 0.6 ? <Flaps k={tearK} /> : null}
        </g>
      ) : null}
      {/* round window frame */}
      <Piece d={`${oval(WIN.cx, WIN.cy, WIN.r + 22, WIN.r + 22, 993, 40, 0.4)} ${winHole}`} rule="evenodd" fill="#e3d6ba" z={1.6} tex="card" edge={0.3} />
      <Piece d={`${oval(WIN.cx, WIN.cy, WIN.r + 6, WIN.r + 6, 994, 40, 0.3)} ${winHole}`} rule="evenodd" fill="#bfae8c" z={0.4} tex="card" edge={0} />
      {/* sconces (unlit), symmetric */}
      {[660, 1260].map((x, i) => (
        <g key={x}>
          <Piece d={rect(x - 5, 380, 10, 44, 995 + i)} fill="#8b7445" z={0.8} tex="card" />
          <Piece d={cut([[x - 24, 330], [x + 24, 330], [x + 16, 382, 1], [x - 16, 382, 1]], {seed: 997 + i})} fill="#e6dcc6" z={1.4} tex="soft" />
          <Brad x={x} y={402} r={3.2} />
        </g>
      ))}
      <PictureFrame x={410} y={250} a={frameL} kind="orb" />
      <PictureFrame x={1510} y={250} a={frameR} kind="cert" />
    </g>
  );
};

const Flaps: React.FC<{k: number}> = ({k}) => {
  // [angle on the hole rim, length, width]
  const fl: [number, number, number][] = [
    [-2.05, 78, 74],
    [-0.95, 64, 60],
    [0.3, 84, 86],
    [1.25, 56, 70],
    [2.55, 60, 64],
    [3.2, 70, 60],
  ];
  return (
    <g>
      {fl.map(([ang, len, w], i) => {
        const ex = TEAR.cx + Math.cos(ang) * TEAR.rx * k * 1.02;
        const ey = TEAR.cy + Math.sin(ang) * TEAR.ry * k * 1.02;
        const nx = Math.cos(ang) / TEAR.rx, ny = Math.sin(ang) / TEAR.ry;
        const nl = Math.hypot(nx, ny);
        const ux = nx / nl, uy = ny / nl;
        const px = -uy, py = ux;
        const L = len * k;
        const sk = (hash(i + 40) - 0.5) * 0.6;
        const pts: Pt[] = [
          [ex + px * w * 0.5, ey + py * w * 0.5, 1],
          [ex + ux * L * 0.45 + px * w * (0.32 + sk * 0.2), ey + uy * L * 0.45 + py * w * (0.32 + sk * 0.2)],
          [ex + ux * L + px * w * sk * 0.5, ey + uy * L + py * w * sk * 0.5 + 8, 1],
          [ex + ux * L * 0.55 - px * w * 0.28, ey + uy * L * 0.55 - py * w * 0.28],
          [ex - px * w * 0.5, ey - py * w * 0.5, 1],
        ];
        const d = cut(pts, {seed: 1010 + i, jit: 2.5});
        return (
          <g key={i}>
            <g filter="url(#pz-fray)">
              <Piece d={d} fill={i % 2 ? '#e9dcc0' : '#f2e8d2'} z={2.4} tex="card" edge={0.35} />
            </g>
            {/* curl shading toward the hinge */}
            <path d={d} fill="#6b4a2a" opacity={0.18} transform={`translate(${ux * 3} ${uy * 3})`} />
          </g>
        );
      })}
    </g>
  );
};

const PictureFrame: React.FC<{x: number; y: number; a: number; kind: 'orb' | 'cert'}> = ({x, y, a, kind}) => (
  <g>
    <Joint x={x} y={y} a={a}>
      <Thread d="M 0 0 L -44 44 M 0 0 L 44 44" color="#cfc6b0" w={1.1} op={0.7} />
      <g transform="translate(0 44)">
        <Piece d={rect(-62, 0, 124, 150, 1100 + x, 1)} fill="#2a1d15" z={2} tex="kraft" edge={0.2} />
        <Piece d={rect(-52, 10, 104, 130, 1101 + x, 0.6)} fill="#e9dfc8" z={0.5} tex="card" />
        {kind === 'orb' ? (
          <g>
            <Piece d={rect(-40, 22, 80, 106, 1102, 0.5)} fill="#1c2340" z={0.4} tex="soft" edge={0} />
            <circle cx={0} cy={70} r={30} fill="#9ff0ff" opacity={0.18} />
            <Piece d={oval(0, 70, 20, 20, 1103, 14, 0.3)} fill="#7fe6f5" z={0.8} tex="soft" edge={0.3} />
            <Piece d={oval(-5, 64, 7, 6, 1104)} fill="#e8feff" z={0} tex="none" edge={0} op={0.8} />
          </g>
        ) : (
          <g>
            <Piece d={rect(-40, 22, 80, 106, 1105, 0.5)} fill="#f4ecd8" z={0.3} tex="soft" edge={0} />
            {[40, 52, 60, 68, 76].map((yy, i) => (
              <rect key={i} x={-28 + (i === 0 ? 6 : 0)} y={yy} width={i === 0 ? 44 : 56} height={i === 0 ? 5 : 2.2} fill="#6b5a45" opacity={0.7} />
            ))}
            <Piece d={oval(18, 106, 10, 10, 1106, 12, 0.6)} fill="#b8322a" z={0.5} tex="soft" edge={0.2} />
          </g>
        )}
      </g>
    </Joint>
    <Brad x={x} y={y} r={3.6} />
  </g>
);

/** Clip path for shadows cast on the wall (wall minus window, minus tear). */
export const wallClip = (tearK: number) => `${WALL_OUT} ${winHole} ${tearK > 0 ? tearPath(tearK) : ''}`;

// ------------------------------------------------------------------ MID set pieces
export const Floor: React.FC = () => {
  const boards: React.ReactNode[] = [];
  const tones = ['#5d4331', '#664a36', '#57402f', '#634734'];
  let y = FLOOR_Y;
  let i = 0;
  while (y < 1120) {
    const h = 26 + (i % 3) * 3;
    boards.push(<Piece key={i} d={rect(-240, y, 2400, h + 2, 1200 + i, 0.5)} fill={tones[i % 4]} z={0.35} tex="kraft" edge={0.06} />);
    y += h;
    i++;
  }
  return (
    <g>
      {boards}
      {/* rug */}
      <Piece d={rect(380, 930, 760, 64, 1250, 1.2)} fill="#d7b27a" z={0.5} tex="soft" />
      <Piece d={rect(390, 936, 740, 52, 1251, 1)} fill="url(#pz-rugpat)" z={0} tex="soft" edge={0} />
      <Piece d={rect(390, 936, 740, 6, 1252, 0.3)} fill="#d7b27a" z={0} tex="soft" edge={0} />
      <Piece d={rect(390, 982, 740, 6, 1253, 0.3)} fill="#d7b27a" z={0} tex="soft" edge={0} />
      {Array.from({length: 26}).map((_, k) => (
        <rect key={k} x={382 + k * 29.3} y={994} width={1.4} height={9} fill="#d7b27a" opacity={0.8} />
      ))}
    </g>
  );
};

export const Desk: React.FC = () => (
  <g>
    <Piece d={rect(470, 726, 460, 24, 1300, 0.6)} fill="#3e281d" z={1} tex="kraft" />
    {/* pedestal with drawers */}
    <Piece d={rect(480, 748, 150, 214, 1301, 0.6)} fill="#4a3022" z={1.4} tex="kraft" />
    {[758, 826, 894].map((y, i) => (
      <g key={y}>
        <Piece d={rect(488, y, 134, 60, 1302 + i, 0.5)} fill="#573a29" z={0.6} tex="kraft" />
        <Brad x={555} y={y + 30} r={3.4} />
      </g>
    ))}
    {/* tapered leg */}
    <Piece d={poly([[906, 748], [924, 748], [918, 962], [912, 962]], 1306)} fill="#4a3022" z={1.4} tex="kraft" />
    <Piece d={rect(450, 710, 500, 18, 1307, 0.5)} fill="#5c3d2b" z={1.8} tex="kraft" edge={0.22} />
  </g>
);

export const Chair: React.FC = () => (
  <g>
    {/* mid-century desk chair in profile: one swept back post, a curved top rail, a mid rail */}
    <Piece d={cut([[1060, 962, 1], [1073, 962, 1], [1076, 880], [1076, 800], [1082, 710], [1092, 618], [1080, 616], [1068, 708], [1062, 800], [1061, 880]], {seed: 1320, jit: 0.4})} fill="#a47b2c" z={1.2} tex="card" />
    <Piece d={cut([[1060, 612], [1090, 604], [1112, 612], [1110, 640], [1088, 634], [1062, 640]], {seed: 1325})} fill="#c49a3a" z={1.6} tex="card" />
    <Piece d={cut([[1064, 700], [1090, 694], [1102, 700], [1100, 714], [1086, 710], [1064, 716]], {seed: 1326})} fill="#b58d34" z={1.3} tex="card" />
    <Piece d={poly([[948, 808], [962, 808], [952, 962], [940, 962]], 1321)} fill="#a47b2c" z={1.2} tex="card" />
    <Piece d={poly([[950, 884], [1066, 880], [1066, 887], [950, 891]], 1327)} fill="#94702a" z={0.8} tex="card" />
    <Piece d={cut([[928, 794, 1], [1080, 792, 1], [1084, 802], [1076, 810, 1], [932, 810, 1], [926, 802]], {seed: 1324, jit: 0.4})} fill="#c49a3a" z={1.6} tex="card" />
  </g>
);

export const Monitor: React.FC<{f: number; chars: number}> = ({chars}) => {
  // screen parallelogram: left edge (536..643), right edge (632: 471..659)
  const lines: React.ReactNode[] = [];
  let left = chars;
  const r = rnd(1400);
  for (let row = 0; row < 13 && left > 0; row++) {
    const n = Math.min(left, 6 + Math.floor(r() * 8));
    left -= n;
    const ind = row % 4 === 1 || row % 4 === 2 ? 1 : 0;
    for (let c = 0; c < n; c++) {
      const u = 0.1 + (ind + c) * 0.06;
      if (u > 0.92) break;
      const v = 0.08 + row * 0.066;
      const x = 540 + u * 90;
      const y = 490 + v * 160 - u * 15;
      lines.push(<rect key={`${row}-${c}`} x={x} y={y} width={4.4} height={4.2} fill="#0d4a5c" opacity={0.75} transform={`skewY(-9.3) translate(0 ${x * 0.164})`} />);
    }
  }
  return (
    <g>
      <Piece d={cut([[548, 712, 1], [618, 712, 1], [612, 704], [554, 704]], {seed: 1401})} fill="#1f2226" z={1} tex="dark" />
      <Piece d={poly([[578, 706], [592, 706], [596, 640], [582, 640]], 1402)} fill="#2a2e33" z={1} tex="dark" />
      <Piece d={poly([[526, 478], [642, 460], [642, 670], [526, 652]], 1403)} fill="#15171b" z={2} tex="dark" edge={0.25} />
      <Piece d={poly([[534, 486], [634, 470], [634, 661], [534, 644]], 1404)} fill="url(#pz-screen)" z={0} tex="soft" edge={0} />
      <g clipPath="url(#pz-screenclip)">{lines}</g>
      <clipPath id="pz-screenclip">
        <path d="M 534 486 L 634 470 L 634 661 L 534 644 Z" />
      </clipPath>
    </g>
  );
};

export const Keyboard: React.FC<{f: number}> = () => (
  <g>
    <Piece d={cut([[794, 712, 1], [892, 712, 1], [886, 702, 1], [802, 702, 1]], {seed: 1420, jit: 0.2})} fill="#d6d4cc" z={0.8} tex="soft" edge={0.3} />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={804 + i * 1.5} y={704 + i * 2.6} width={80 - i * 2} height={1.2} fill="#8a8880" opacity={0.7} />
    ))}
  </g>
);

/** The glass of water. It never ripples. */
export const Glass: React.FC = () => (
  <g>
    {/* caustic thrown on the desk by the monitor */}
    <ellipse cx={752} cy={712} rx={26} ry={3} fill="#bff8ff" opacity={0.55} />
    <path d="M 700 638 L 736 638 L 732 711 L 704 711 Z" fill="url(#pz-glass)" />
    <path d="M 703.6 664 L 732.8 664 L 732 710 L 704 710 Z" fill="url(#pz-water)" />
    <path d="M 703.6 664 L 732.8 664" stroke="#e8feff" strokeWidth={1.6} opacity={0.95} />
    <path d="M 700 638 L 704 711" stroke="#e9fdff" strokeWidth={1.8} opacity={0.8} />
    <path d="M 736 638 L 732 711" stroke="#d6f8ff" strokeWidth={1.1} opacity={0.5} />
    <ellipse cx={718} cy={638} rx={18} ry={2.2} fill="none" stroke="#e9fdff" strokeWidth={1.1} opacity={0.7} />
    <path d="M 706 646 L 707.5 700" stroke="#ffffff" strokeWidth={2.6} opacity={0.55} strokeLinecap="round" />
    <path d="M 704 710 L 732 710" stroke="#e9fdff" strokeWidth={2.2} opacity={0.6} />
  </g>
);

// ------------------------------------------------------------------ paper scraps from the tear
export interface Scrap {
  x: number;
  y: number;
  a: number;
  flip: number;
  s: number;
  seed: number;
}
export const scraps = (t: number, t0: number): Scrap[] => {
  if (t < t0) return [];
  const out: Scrap[] = [];
  const r = rnd(1500);
  for (let i = 0; i < 22; i++) {
    const ang = (r() - 0.5) * 2.6 + Math.PI; // mostly leftward/outward
    const sp = 9 + r() * 16;
    const vx = Math.cos(ang) * sp * (0.4 + r() * 0.8);
    const vy = -4 - r() * 10;
    const sx = TEAR.cx + (r() - 0.5) * 120;
    const sy = TEAR.cy + (r() - 0.5) * 380;
    const floor = 925 + r() * 70;
    const dt = t - t0;
    // flutter: drag makes them decelerate
    const drag = 0.9;
    const k = (1 - Math.pow(drag, dt)) / (1 - drag);
    let x = sx + vx * k;
    let y = sy + vy * k + 0.55 * dt * dt * 0.5 * (1 / (1 + dt * 0.08));
    const land = y >= floor;
    if (land) y = floor;
    const a = land ? (r() - 0.5) * 60 : (r() - 0.5) * 50 + dt * (r() - 0.5) * 40;
    const flip = land ? (r() > 0.5 ? 1 : -1) * 0.35 : Math.cos(dt * (0.3 + r() * 0.5) + i);
    out.push({x, y, a, flip, s: 8 + r() * 12, seed: 1600 + i});
  }
  return out;
};
export const Scraps: React.FC<{list: Scrap[]}> = ({list}) => (
  <g>
    {list.map((s, i) => {
      const d = torn(0, 0, s.s, s.s * 0.7, s.seed, 7, 0.35);
      const back = s.flip < 0;
      return (
        <g key={i} transform={`translate(${s.x} ${s.y}) rotate(${s.a}) scale(1 ${Math.max(0.12, Math.abs(s.flip))})`}>
          <Piece d={d} fill={back ? '#efe4cc' : '#a86a5e'} z={1.4} tex="card" edge={0.2} />
          {!back ? <rect x={-s.s * 0.2} y={-s.s} width={2} height={s.s * 2} fill="#caa08a" opacity={0.8} /> : null}
        </g>
      );
    })}
  </g>
);

// ------------------------------------------------------------------ FOREGROUND (out of focus)
export const Foreground: React.FC = () => (
  <g>
    {/* monstera leaves bottom-left, catching a little monitor light */}
    <Piece d={cut([[-120, 1140], [-60, 940], [40, 860], [150, 850], [230, 900], [180, 960], [260, 990], [170, 1040], [210, 1100], [40, 1150]], {seed: 1700})} fill="#1f3a2a" z={0} tex="soft" edge={0.5} />
    <Piece d={cut([[-140, 820], [-40, 760], [70, 790], [30, 840], [110, 870], [-10, 900], [-60, 960], [-150, 960]], {seed: 1701})} fill="#27452f" z={0} tex="soft" edge={0.5} />
    <Piece d={poly([[40, 1100], [150, 880], [158, 884], [52, 1104]], 1702)} fill="#3c6444" z={0} tex="none" edge={0} />
    <path d="M -60 940 C 20 880 90 860 150 850" fill="none" stroke="#8fe8f0" strokeOpacity={0.35} strokeWidth={4} />
    {/* stack of books bottom-right */}
    <Piece d={rect(1700, 990, 320, 44, 1710, 1)} fill="#5a2320" z={0} tex="soft" edge={0.4} />
    <Piece d={rect(1730, 950, 300, 42, 1711, 1)} fill="#2c3d55" z={0} tex="soft" edge={0.4} />
    <Piece d={rect(1690, 1030, 340, 60, 1712, 1)} fill="#4a3d26" z={0} tex="soft" edge={0.4} />
    <Piece d={rect(1750, 962, 200, 6, 1713, 0.3)} fill="#d8b86a" z={0} tex="none" edge={0} op={0.7} />
    <Piece d={rect(1720, 1004, 220, 5, 1714, 0.3)} fill="#d8b86a" z={0} tex="none" edge={0} op={0.5} />
  </g>
);

export {clamp, ring};
