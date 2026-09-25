import React from 'react';
import {Engr, Region} from './engr';
import {Piece, STOCK, Wash} from './paper';
import {hatch2, cylinderFamily, Family} from './engrave';
import {clamp, ell, polyD, rectD, smoothD, P2, smooth} from './core';
import {INK} from './heads';
import {FONT} from '../theme/fonts';

/**
 * COLLAGE — the set: one engraved interior plate (the room) + furniture cut from other catalogues and pasted on.
 * World units = px at camera zoom 1 (1920 x 1080). The monitor (a "Patent Thinking Cabinet") is the key light.
 */

/** Monitor screen centre: the key light. */
export const SCREEN: P2 = [430, 468];
/** Light falloff from the monitor, 0..1. */
export const LM = (x: number, y: number, r = 430) => Math.exp(-((x - SCREEN[0]) ** 2 + ((y - SCREEN[1]) * 1.15) ** 2) / (2 * r * r));

const frac = (x: number) => x - Math.floor(x);

// ------------------------------------------------------------------------------------------------ room plate
const trellis = (x: number, y: number) => {
  const cw = 118;
  const ch = 150;
  const t1 = frac(x / cw + y / ch);
  const t2 = frac(x / cw - y / ch);
  const b = Math.exp(-((t1 - 0.5) ** 2) / 0.0016) + Math.exp(-((t2 - 0.5) ** 2) / 0.0016);
  // rosette at the lattice crossings
  const u = frac(x / cw + 0.5) - 0.5;
  const v = frac(y / (ch * 1) + 0.5) - 0.5;
  const ros = Math.exp(-(u * u * 9 + v * v * 6) / 0.02);
  return clamp(b * 0.8 + ros * 0.9);
};
const topDark = (y: number) => 0.12 * (1 - smooth(-80, 420, y));

export const roomRegions = (): Region[] => {
  const wall: Region = {
    d: rectD(-100, 176, 2120, 466),
    tone: (x, y) => clamp(0.16 + 0.2 * trellis(x, y) + 0.66 * LM(x, y) - topDark(y) + 0.05 * Math.sin(x * 0.004)),
    fam: [{angle: 90}, {angle: 28, below: 0.26, weight: 0.8, phase: 0.5}],
    gamma: 1.05,
  };
  const frieze: Region = {
    d: rectD(-100, -100, 2120, 250),
    tone: (x, y) => clamp(0.1 + 0.45 * LM(x, y, 380) - topDark(y) * 0.5),
    fam: hatch2(0, 0.3, 58),
  };
  const railTop: Region = {d: rectD(-100, 150, 2120, 10), tone: (x, y) => clamp(0.55 + 0.4 * LM(x, y)), fam: [{angle: 0}], k: 0.8};
  const railBody: Region = {d: rectD(-100, 160, 2120, 16), tone: (x, y) => clamp(0.22 + 0.4 * LM(x, y)), fam: [{angle: 0}], k: 0.8};
  const chairRail: Region = {d: rectD(-100, 640, 2120, 26), tone: (x, y) => clamp(0.42 + 0.5 * LM(x, y)), fam: [{angle: 0}], k: 0.8};
  const wains: Region = {d: rectD(-100, 666, 2120, 520), tone: (x, y) => clamp(0.18 + 0.4 * LM(x, y)), fam: [{angle: 90}, {angle: 35, below: 0.2, phase: 0.5}]};
  const fields: string[] = [];
  const bevT: string[] = [];
  const bevB: string[] = [];
  for (let x = -60; x < 2040; x += 250) {
    const x0 = x + 36;
    const x1 = x + 214;
    const y0 = 706;
    const y1 = 1040;
    const b = 12;
    fields.push(rectD(x0 + b, y0 + b, x1 - x0 - 2 * b, y1 - y0 - 2 * b));
    bevT.push(polyD([[x0, y0], [x1, y0], [x1 - b, y0 + b], [x0 + b, y0 + b], [x0 + b, y1 - b], [x0, y1]]));
    bevB.push(polyD([[x1, y0], [x1, y1], [x0, y1], [x0 + b, y1 - b], [x1 - b, y1 - b], [x1 - b, y0 + b]]));
  }
  const field: Region = {d: fields.join(' '), tone: (x, y) => clamp(0.26 + 0.42 * LM(x, y)), fam: [{angle: 0}]};
  const bt: Region = {d: bevT.join(' '), tone: (x, y) => clamp(0.55 + 0.4 * LM(x, y)), fam: [{angle: 45}], k: 0.8};
  const bb: Region = {d: bevB.join(' '), tone: () => 0.08, fam: hatch2(-45, 0.3), k: 0.8};
  return [frieze, wall, railTop, railBody, chairRail, wains, field, bt, bb];
};

export const RoomPlate: React.FC<{pitch: number; night?: number}> = ({pitch, night = 1}) => {
  const lines = [
    {d: 'M -100 150 H 2020', w: 1.4},
    {d: 'M -100 160 H 2020', w: 0.9},
    {d: 'M -100 176 H 2020', w: 1.6},
    {d: 'M -100 640 H 2020', w: 1.6},
    {d: 'M -100 666 H 2020', w: 1.2},
  ];
  const [sx, sy] = SCREEN;
  return (
    <Piece
      id="room"
      sil={[{d: rectD(-100, -100, 2120, 1280)}]}
      stock={STOCK.plate}
      margin={0}
      shadow={false}
      box={[-100, -100, 2120, 1280]}
      showMargin={false}
      over={
        <>
          <defs>
            <radialGradient id="room-night" gradientUnits="userSpaceOnUse" cx={sx} cy={sy} r={1250}>
              <stop offset="0" stopColor="#C8E4EC" />
              <stop offset="0.2" stopColor="#6D7FA8" />
              <stop offset="0.5" stopColor="#343E6A" />
              <stop offset="1" stopColor="#1C2044" />
            </radialGradient>
            <radialGradient id="room-cy" gradientUnits="userSpaceOnUse" cx={sx} cy={sy} r={560}>
              <stop offset="0" stopColor="#5FE8F8" stopOpacity={0.9} />
              <stop offset="0.45" stopColor="#1FA0C0" stopOpacity={0.35} />
              <stop offset="1" stopColor="#10508A" stopOpacity={0} />
            </radialGradient>
          </defs>
          <rect x={-100} y={-100} width={2120} height={1280} fill="url(#room-night)" opacity={night} style={{mixBlendMode: 'multiply'}} />
          <rect x={-100} y={-100} width={2120} height={1280} fill="url(#room-cy)" opacity={night} style={{mixBlendMode: 'screen'}} />
        </>
      }>
      <rect x={-100} y={-100} width={2120} height={1280} fill={STOCK.plate.paper} />
      <Engr id={'room'} regions={roomRegions()} pitch={pitch * 1.3} ink={INK.plate} lines={lines} />
    </Piece>
  );
};

/** A cast shadow thrown on the wall by the monitor: the silhouette scaled away from the light. */
export const CastShadow: React.FC<{k?: number; lift?: number; opacity?: number; children: React.ReactNode; id: string}> = ({k = 1.32, lift = -30, opacity = 0.6, children, id}) => {
  const [sx, sy] = SCREEN;
  const u = id.replace(/[^a-zA-Z0-9_-]/g, '_');
  return (
    <g style={{mixBlendMode: 'multiply'}} opacity={opacity}>
      <defs>
        <filter id={`cs-${u}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={5} />
        </filter>
      </defs>
      <g filter={`url(#cs-${u})`} transform={`translate(0 ${lift}) translate(${sx} ${sy}) scale(${k}) translate(${-sx} ${-sy})`}>
        {children}
      </g>
    </g>
  );
};

// ------------------------------------------------------------------------------------------------ desk
const deskRegions = (): Region[] => {
  const top: Region = {d: polyD([[46, 716], [1296, 716], [1312, 736], [30, 736]]), tone: (x, y) => clamp(0.38 + 0.6 * LM(x, y, 520)), fam: [{angle: 0}], k: 0.85};
  const edge: Region = {d: polyD([[30, 736], [1312, 736], [1312, 762], [30, 762]]), tone: (x, y) => clamp(0.3 + 0.55 * LM(x, y, 480)), fam: [{angle: 0}], k: 0.8};
  const front: Region = {
    d: polyD([[44, 762], [1298, 762], [1298, 1120], [44, 1120]]),
    tone: (x, y) => clamp(0.16 + 0.45 * LM(x, y, 470) + 0.04 * Math.sin(y * 0.09 + Math.sin(x * 0.01) * 3)),
    fam: [{angle: 0}, {angle: 60, below: 0.22, phase: 0.5}],
  };
  const drawers = [
    [112, 792, 460, 118],
    [794, 792, 440, 118],
  ].map(([x, y, w, h]) => rectD(x, y, w, h));
  const dr: Region = {d: drawers.join(' '), tone: (x, y) => clamp(0.3 + 0.5 * LM(x, y, 470)), fam: [{angle: 0}]};
  const knee: Region = {d: rectD(600, 792, 164, 400), tone: () => 0.03, fam: hatch2(0, 0.6, 70)};
  return [top, edge, front, dr, knee];
};
export const Desk: React.FC<{pitch: number; transform?: string}> = ({pitch, transform}) => {
  const sil = polyD([[46, 716], [1296, 716], [1312, 736], [1312, 762], [1298, 762], [1298, 1120], [44, 1120], [44, 762], [30, 762], [30, 736]]);
  const pulls = [
    [342, 850],
    [1014, 850],
  ];
  return (
    <Piece id="desk" sil={[{d: sil}]} stock={STOCK.news} margin={6} shadow={[3, -3, 5, 0.5]} transform={transform} box={[20, 700, 1300, 440]}
      over={
        <>
          <Wash id="desk-wood" d={sil} color="#A0643A" opacity={0.38} blur={6} />
          {pulls.map(([x, y], i) => (
            <Wash key={i} id={'pull' + i} d={ell(x, y, 26, 12)} color="#D9A441" opacity={0.7} blur={1.5} />
          ))}
        </>
      }>
      <Engr
        id="desk"
        regions={deskRegions()}
        pitch={pitch}
        ink={INK.cat}
        fills={pulls.map(([x, y]) => ({d: ell(x, y + 3, 24, 10), color: INK.cat}))}
        lights={pulls.map(([x, y]) => ({d: ell(x - 3, y - 2, 18, 6), color: '#EADCB8'}))}
        lines={[
          {d: 'M 30 736 H 1312', w: 1.4},
          {d: 'M 44 762 H 1298', w: 1.8},
          {d: rectD(112, 792, 460, 118), w: 1.6},
          {d: rectD(794, 792, 440, 118), w: 1.6},
          {d: rectD(600, 792, 164, 400), w: 1.6},
          {d: rectD(124, 804, 436, 94), w: 0.8},
          {d: rectD(806, 804, 416, 94), w: 0.8},
        ]}
      />
    </Piece>
  );
};

// ------------------------------------------------------------------------------------------------ monitor cabinet
const CAB = {
  side: polyD([[168, 312], [254, 290], [254, 732], [168, 724]]),
  front: polyD([[254, 290], [606, 306], [606, 732], [254, 732]]),
  ped: smoothD([[150, 318, 1], [150, 300, 1], [196, 298], [238, 290], [268, 272], [284, 252], [306, 244], [326, 254], [340, 246], [356, 232], [376, 222], [392, 204], [398, 186, 1], [404, 204], [420, 222], [440, 232], [456, 246], [470, 254], [490, 244], [512, 252], [528, 272], [558, 290], [600, 298], [642, 300, 1], [642, 318, 1]]),
  screen: 'M 322 346 C 386 338 480 342 548 356 C 560 420 560 520 548 572 C 480 584 386 588 322 584 C 310 520 310 420 322 346 Z',
  bezel: 'M 292 322 C 380 312 500 318 578 332 C 594 420 594 520 578 598 C 500 612 380 614 292 612 C 278 520 278 420 292 322 Z',
  panel: polyD([[264, 630], [598, 634], [598, 722], [264, 722]]),
};
const cabRegions = (): Region[] => {
  const side: Region = {d: CAB.side, tone: (x, y) => clamp(0.1 + 0.12 * (y - 290) / 440), fam: [{angle: 88}, {angle: 20, below: 0.3, phase: 0.5}]};
  const front: Region = {d: CAB.front, tone: (x, y) => clamp(0.22 + 0.22 * Math.sin((x - 254) * 0.02) ** 2 + 0.1 * (1 - (y - 290) / 440)), fam: [{angle: 90}]};
  const ped: Region = {d: CAB.ped, tone: (x, y) => clamp(0.2 + 0.35 * smooth(318, 240, y) + 0.2 * Math.cos((x - 398) * 0.05) ** 2 * smooth(300, 200, y)), fam: [{angle: 0}, {angle: 70, below: 0.25}]};
  const bezel: Region = {
    d: CAB.bezel,
    tone: (x, y) => {
      const r = Math.hypot((x - 435) / 150, (y - 466) / 146);
      return clamp(0.25 + 0.45 * Math.cos(r * 3.2) ** 2);
    },
    fam: [{angle: 0}],
    k: 0.8,
  };
  const panel: Region = {d: CAB.panel, tone: (x, y) => clamp(0.28 + 0.1 * Math.sin(x * 0.05)), fam: [{angle: 0}]};
  // the tube face: horizontal scan-line engraving, brightest in the middle
  const screen: Region = {
    d: CAB.screen,
    tone: (x, y) => {
      const r = Math.hypot((x - 435) / 120, (y - 464) / 118);
      return clamp(0.98 - 0.55 * smooth(0.55, 1.05, r));
    },
    fam: [{angle: 0}],
    k: 0.75,
    maxW: 0.7,
  };
  return [side, front, ped, bezel, panel, screen];
};
export const Cabinet: React.FC<{pitch: number; transform?: string; glow: number; lines?: number}> = ({pitch, transform, glow, lines = 1}) => {
  const knobs: P2[] = [
    [318, 676],
    [548, 678],
  ];
  const sil = [CAB.side, CAB.front, CAB.ped, polyD([[176, 724], [210, 724], [206, 742], [180, 742]]), polyD([[560, 732], [596, 732], [592, 750], [564, 750]])];
  // typed lines on the tube: a few engraved text rows
  const rows = Array.from({length: 7}, (_, i) => {
    const y = 392 + i * 24;
    const len = [150, 120, 170, 90, 140, 60, 110][i] * Math.min(1, lines * 1.6 - i * 0.18);
    return len > 4 ? `M 346 ${y} H ${346 + len}` : '';
  }).join(' ');
  return (
    <Piece
      id="cabinet"
      sil={sil.map((d) => ({d}))}
      stock={STOCK.news}
      margin={7}
      shadow={[5, 6, 6, 0.5]}
      transform={transform}
      box={[140, 180, 500, 580]}
      over={
        <>
          <Wash id="cab-wood" d={[CAB.side, CAB.front, CAB.ped].join(' ')} color="#8A4E2C" opacity={0.42} blur={6} />
          <Wash id="cab-brass" d={CAB.bezel + ' ' + knobs.map(([x, y]) => ell(x, y, 22, 22)).join(' ')} color="#D6A443" opacity={0.55} blur={3} />
          <Wash id="cab-glow" d={CAB.screen} color="#7EF0FF" opacity={0.92 * glow} blur={5} />
          <Wash id="cab-glow2" d={CAB.screen} color="#E8FFFF" opacity={0.6 * glow} blur={18} blend="screen" />
        </>
      }>
      <Engr
        id="cabinet"
        regions={cabRegions()}
        pitch={pitch}
        ink={INK.cat}
        fills={[...knobs.map(([x, y]) => ({d: ell(x + 2, y + 3, 20, 20)})), {d: polyD([[176, 724], [210, 724], [206, 742], [180, 742]])}, {d: polyD([[560, 732], [596, 732], [592, 750], [564, 750]])}]}
        lights={knobs.map(([x, y]) => ({d: ell(x - 5, y - 6, 8, 6), color: '#F0E2B8'}))}
        lines={[
          {d: CAB.side, w: 1.6},
          {d: CAB.front, w: 1.6},
          {d: CAB.ped, w: 1.6},
          {d: CAB.bezel, w: 2.2},
          {d: CAB.screen, w: 2.6},
          {d: CAB.panel, w: 1.2},
          {d: rows, w: 3.2, dash: '5 3 9 3 4 3 12 3 7 3', color: '#1B4E5A'},
          {d: 'M 336 360 C 400 352 470 354 530 364', w: 1, color: '#FFFFFF'},
          ...knobs.map(([x, y]) => ({d: ell(x, y, 22, 22), w: 1.4})),
          ...knobs.map(([x, y]) => ({d: `M ${x} ${y} L ${x + 12} ${y - 14}`, w: 2.2})),
        ]}
      />
      <text x={431} y={662} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={13} letterSpacing={2.5} fill={INK.cat}>
        PATENT
      </text>
      <text x={431} y={683} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={15} letterSpacing={2} fill={INK.cat}>
        THINKING CABINET
      </text>
      <text x={431} y={702} textAnchor="middle" fontFamily={FONT.title} fontStyle="italic" fontSize={11} letterSpacing={1} fill={INK.cat}>
        Manalt &amp; Co. — Nº 1
      </text>
      <path d={rectD(360, 646, 142, 64)} fill="none" stroke={INK.cat} strokeWidth={1.2} />
    </Piece>
  );
};

// ------------------------------------------------------------------------------------------------ typewriter (profile, keys toward Mas)
const TW = {
  body: smoothD([[556, 730, 1], [562, 694], [582, 668], [618, 654], [676, 654], [716, 662], [746, 678], [776, 694], [806, 710], [822, 730, 1]]),
  base: polyD([[546, 730], [826, 730], [830, 740], [542, 740]]),
  basket: 'M 604 656 C 610 700 706 700 712 656 Z',
  platen: 'M 590 620 H 720 A 13 13 0 0 1 720 646 H 590 A 13 13 0 0 1 590 620 Z',
  sheet: smoothD([[622, 624, 1], [616, 586], [614, 548], [606, 520], [590, 500, 1], [612, 504], [632, 522], [642, 560], [646, 596], [650, 624, 1]]),
};
export const TW_KEYS: P2[] = [
  [806, 712],
  [782, 699],
  [758, 687],
  [734, 676],
];
export const Typewriter: React.FC<{pitch: number; transform?: string; carriage?: number; press?: number[]}> = ({pitch, transform, carriage = 0, press = []}) => {
  const regions: Region[] = [
    {d: TW.body, tone: (x, y) => clamp(0.1 + 0.18 * smooth(700, 580, x) + 0.3 * Math.exp(-((y - 660) ** 2) / 60)), fam: [{angle: 8}, {angle: 60, below: 0.22, phase: 0.5}], k: 0.9},
    {d: TW.base, tone: () => 0.2, fam: [{angle: 0}], k: 0.7},
    {d: TW.sheet, tone: (x) => clamp(0.95 - 0.35 * smooth(636, 612, x)), fam: [{angle: 84}], maxW: 0.45, k: 0.9},
  ];
  // the type-bar fan inside the basket
  const fan = Array.from({length: 13}, (_, i) => {
    const a = Math.PI * (0.08 + (0.84 * i) / 12);
    return `M ${658 + Math.cos(a) * 8} ${652 + Math.sin(a) * 6} L ${658 + Math.cos(a) * 52} ${652 + Math.sin(a) * 36}`;
  }).join(' ');
  const keys = TW_KEYS.map(([x, y], i) => ({x, y: y + (press[i] ?? 0) * 4}));
  const stems = keys.map(({x, y}) => `M ${x - 2} ${y + 3} L ${x - 34} ${y + 22}`).join(' ');
  const keyD = keys.map(({x, y}) => ell(x, y, 11, 4.5)).join(' ');
  const sheetT = `translate(${carriage} 0)`;
  return (
    <Piece id="typewriter" sil={[{d: TW.body}, {d: TW.base}, {d: TW.basket}, {d: TW.platen, transform: sheetT}, {d: TW.sheet, transform: sheetT}, {d: keyD}]} stock={STOCK.coated} margin={6} shadow={[4, 4, 4, 0.5]} transform={transform} box={[530, 490, 320, 270]}>
      <path d={TW.basket} fill={INK.cat} />
      <path d={fan} stroke="#B8A57A" strokeWidth={1.2} />
      <Engr id="typewriter" regions={regions.slice(0, 2)} pitch={pitch} ink={INK.cat} lines={[{d: TW.body, w: 1.6}, {d: stems, w: 2.2}, {d: 'M 572 722 C 600 690 640 668 690 666 C 730 668 770 690 804 716', w: 1.1, color: '#C9A24A'}]} />
      <g transform={sheetT}>
        <path d={TW.sheet} fill={STOCK.coated.paper} />
        <Engr id="tw-sheet" regions={[regions[2]]} pitch={pitch} ink={INK.cat} lines={[{d: TW.sheet, w: 1.2}]} />
        {Array.from({length: 7}, (_, i) => (
          <path key={i} d={`M ${621 + i * 0.3} ${612 - i * 13} L ${640 - i * 0.6} ${612 - i * 13.6}`} stroke={INK.cat} strokeWidth={1.3} strokeDasharray="2 1.4 3 1.4 1.5 1.4" />
        ))}
        <path d={TW.platen} fill={INK.cat} />
        <path d="M 592 627 H 718" stroke="#D8CBA8" strokeWidth={2} />
        <path d="M 596 650 H 714" stroke={INK.cat} strokeWidth={4} />
        <circle cx={580} cy={633} r={11} fill={INK.cat} stroke="#C9A24A" strokeWidth={1.2} />
        <circle cx={730} cy={633} r={9} fill={INK.cat} stroke="#C9A24A" strokeWidth={1.2} />
      </g>
      {keys.map(({x, y}, i) => (
        <g key={i}>
          <path d={ell(x, y, 11, 4.5)} fill="#EFE7D2" stroke={INK.cat} strokeWidth={1.6} />
          <path d={ell(x, y - 0.6, 6, 2)} fill="none" stroke={INK.cat} strokeWidth={0.8} />
        </g>
      ))}
    </Piece>
  );
};

// ------------------------------------------------------------------------------------------------ the glass of water
export const GLASS = {x: 1166, top: 584, bot: 742, rT: 46, rB: 38, water: 640};
export const Glass: React.FC<{pitch: number; transform?: string; glint?: number}> = ({pitch, transform, glint = 0}) => {
  const {x, top, bot, rT, rB, water} = GLASS;
  const rAt = (y: number) => rT + (rB - rT) * ((y - top) / (bot - top));
  const body = polyD([[x - rT, top], [x + rT, top], [x + rB, bot], [x - rB, bot]]);
  const waterD = polyD([[x - rAt(water), water], [x + rAt(water), water], [x + rB, bot], [x - rB, bot]]);
  const regions: Region[] = [
    {
      d: body,
      tone: (px, py) => {
        const r = rAt(py);
        const s = Math.abs(px - x) / r;
        return clamp(0.95 - 0.75 * smooth(0.62, 1.0, s) - (py > water ? 0.12 : 0));
      },
      fam: [cylinderFamily(x, top, bot, rT, 0)],
      k: 0.8,
      maxW: 0.8,
    },
    {d: waterD, tone: (px, py) => clamp(0.72 - 0.35 * smooth(0.5, 1, Math.abs(px - x) / rAt(py)) - (py - water) * 0.0015), fam: [{angle: 0}], k: 0.7, maxW: 0.7},
  ];
  const rim = ell(x, top, rT, 7);
  const surf = ell(x, water, rAt(water), 5.5);
  return (
    <Piece id="glass" sil={[{d: body}, {d: rim}]} stock={STOCK.coated} margin={5} shadow={[4, 3, 3, 0.45]} transform={transform} box={[x - 50, top - 20, 100, bot - top + 40]}
      over={
        <>
          <Wash id="water" d={waterD + ' ' + surf} color="#8FE0EA" opacity={0.6} blur={2} />
          <Wash id="glass-lit" d={body} color="#BFF6FF" opacity={0.25} blur={6} blend="screen" />
        </>
      }>
      <Engr
        id="glass"
        regions={regions}
        pitch={pitch}
        ink={INK.cat}
        lines={[
          {d: body, w: 1.5},
          {d: rim, w: 1.3},
          {d: surf, w: 1.1},
          {d: `M ${x - rB + 6} ${bot - 6} C ${x - 10} ${bot + 2} ${x + 10} ${bot + 2} ${x + rB - 6} ${bot - 6}`, w: 2.4},
        ]}
        lights={[{d: polyD([[x - rT + 12, top + 12], [x - rT + 20, top + 12], [x - rB + 18, bot - 16], [x - rB + 11, bot - 16]]), color: '#FFFFFF', opacity: 0.85}]}
      />
      {glint > 0 && (
        <g transform={`translate(${x - 16} ${top + 30}) scale(${glint})`}>
          <path d="M 0 -26 L 4 -4 L 26 0 L 4 4 L 0 26 L -4 4 L -26 0 L -4 -4 Z" fill="#FFFFFF" stroke={INK.cat} strokeWidth={1.2} />
          <path d="M 0 -12 L 0 12 M -12 0 L 12 0" stroke={INK.cat} strokeWidth={0.8} />
        </g>
      )}
    </Piece>
  );
};

// ------------------------------------------------------------------------------------------------ chair back (buttoned leather)
export const Chair: React.FC<{pitch: number; transform?: string}> = ({pitch, transform}) => {
  const back = smoothD([[832, 740, 1], [820, 560], [850, 498], [960, 474], [1070, 498], [1098, 560], [1086, 740, 1]]);
  const btn: P2[] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5 - (r % 2); c++) btn.push([880 + c * 44 + (r % 2) * 22, 530 + r * 46]);
  const regions: Region[] = [
    {
      d: back,
      tone: (x, y) => {
        // tufting: each button pulls a dark pocket
        let t = 0.36;
        for (const [bx, by] of btn) t -= 0.18 * Math.exp(-((x - bx) ** 2 + (y - by) ** 2) / 260);
        return clamp(t + 0.18 * Math.exp(-((y - 490) ** 2) / 900) + 0.2 * LM(x, y, 420));
      },
      fam: [{angle: 70}, {angle: -30, below: 0.26, phase: 0.5}],
    },
  ];
  return (
    <Piece id="chair" sil={[{d: back}]} stock={STOCK.news} margin={6} shadow={[4, 5, 5, 0.45]} transform={transform} box={[810, 460, 300, 300]}
      over={<Wash id="chair-ox" d={back} color="#8C2A22" opacity={0.55} blur={5} />}>
      <Engr id="chair" regions={regions} pitch={pitch} ink={INK.cat} fills={btn.map(([x, y]) => ({d: ell(x, y, 5, 4)}))} lines={[{d: back, w: 1.8}]} />
    </Piece>
  );
};

// ------------------------------------------------------------------------------------------------ the framed sampler
export const Sampler: React.FC<{pitch: number; transform?: string}> = ({pitch, transform}) => {
  const cx = 1204;
  const cy = 392;
  const outer = ell(cx, cy, 96, 118);
  const inner = ell(cx, cy, 74, 96);
  const regions: Region[] = [
    {
      d: outer,
      tone: (x, y) => {
        const a = Math.atan2(y - cy, x - cx);
        return clamp(0.35 + 0.35 * Math.cos(a * 14) ** 2 * 0.6 + 0.25 * Math.cos(a + 2.4));
      },
      fam: [{angle: 0}],
      k: 0.8,
    },
    {d: inner, tone: (x, y) => clamp(0.88 - 0.25 * smooth(60, 96, Math.hypot((x - cx) * 1.25, y - cy))), fam: [{angle: 45}], maxW: 0.55},
  ];
  return (
    <Piece id="sampler" sil={[{d: outer}]} stock={STOCK.note} margin={5} shadow={[6, 8, 6, 0.55]} transform={transform} box={[cx - 110, cy - 130, 220, 260]}
      over={<Wash id="sampler-gilt" d={outer} color="#C99A3E" opacity={0.5} blur={3} />}>
      <Engr id="sampler" regions={regions} pitch={pitch} ink={INK.cat} lines={[{d: outer, w: 1.6}, {d: inner, w: 1.4}, {d: ell(cx, cy, 68, 90), w: 0.8, dash: '2 3'}]} />
      <g fontFamily={FONT.title} fill="#6A1E1A" textAnchor="middle">
        <text x={cx} y={cy - 34} fontSize={20} fontWeight={800} letterSpacing={2}>
          BLESS
        </text>
        <text x={cx} y={cy - 8} fontSize={17} fontStyle="italic">
          this
        </text>
        <text x={cx} y={cy + 20} fontSize={19} fontWeight={800} letterSpacing={1}>
          NON-
        </text>
        <text x={cx} y={cy + 44} fontSize={19} fontWeight={800} letterSpacing={1}>
          PROFIT
        </text>
      </g>
      <path d={`M ${cx - 40} ${cy + 62} C ${cx - 20} ${cy + 74} ${cx + 20} ${cy + 74} ${cx + 40} ${cy + 62}`} fill="none" stroke="#2F5A34" strokeWidth={2} />
      <path d={`M ${cx} ${cy - 118} L ${cx} ${cy - 150}`} stroke={INK.cat} strokeWidth={1.4} />
    </Piece>
  );
};

export type {Family};
