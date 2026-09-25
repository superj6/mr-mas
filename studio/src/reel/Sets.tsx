// Simple set silhouettes, one per `set` value, drawn in wide-shot coordinates (floor at y=540, 1280 wide).
// The camera layer scales them for medium / close shots. `SetFront` holds pieces that sit in front of the cast
// (dinner table, boardroom table, witness table, lectern).
import React from 'react';
import type {SetId} from './schema';
import {FLOOR, GLY, MONO, PIX, rng, type Pal} from './look';

interface SP {set: SetId; pal: Pal; f: number; raw?: string; xs?: number[]}

const Wall: React.FC<{pal: Pal; dark?: number}> = ({pal, dark}) => (
  <g>
    <rect x={-400} y={-400} width={2080} height={400 + FLOOR} fill={pal.bg} />
    {pal.wallFill && <rect x={-400} y={-400} width={2080} height={400 + FLOOR} fill={pal.wallFill} opacity={0.5} />}
    <rect x={-400} y={FLOOR} width={2080} height={600} fill={pal.floor} />
    {pal.floorFill && <rect x={-400} y={FLOOR} width={2080} height={600} fill={pal.floorFill} opacity={0.6} />}
    <line x1={-400} y1={FLOOR} x2={1680} y2={FLOOR} stroke={pal.dim} strokeWidth={3} />
    {dark ? <rect x={-400} y={-400} width={2080} height={1600} fill="#000" opacity={dark} /> : null}
  </g>
);

const Towers: React.FC<{pal: Pal; f: number; base: number; scale?: number; labels?: boolean}> = ({pal, f, base, scale = 1, labels}) => {
  const T: [number, number, number, string][] = [
    [60, 90, 190, 'MACROSOFT'],
    [175, 70, 250, 'ELGOOG'],
    [270, 60, 150, ''],
    [345, 80, 210, 'ATEM'],
    [560, 120, 360, 'NOPEAI'],
    [700, 70, 170, ''],
    [790, 90, 240, 'INVIDIA'],
    [905, 60, 140, ''],
    [990, 70, 200, 'zAI'],
    [1085, 110, 160, ''],
    [1200, 60, 230, 'PEEKDEEP'],
  ];
  return (
    <g>
      {T.map(([x, w, h, n], i) => {
        const hh = h * scale;
        const nope = n === 'NOPEAI';
        return (
          <g key={i}>
            <rect x={x} y={base - hh} width={w} height={hh} fill={pal.bg2} stroke={nope ? pal.glow : pal.dim} strokeWidth={2} />
            {nope && <line x1={x + w / 2} y1={base - hh} x2={x + w / 2} y2={base - hh - 80 * scale} stroke={pal.glow} strokeWidth={3} />}
            {nope && <circle cx={x + w / 2} cy={base - hh + 50 * scale} r={22 * scale} fill="none" stroke={pal.glow} strokeWidth={2} />}
            {Array.from({length: Math.floor(hh / 26)}, (_, r) =>
              Array.from({length: Math.floor(w / 22)}, (_, c) => {
                const on = (r * 7 + c * 3 + i + Math.floor(f / 24)) % 5 !== 0;
                return on ? <rect key={`${r}-${c}`} x={x + 7 + c * 22} y={base - hh + 12 + r * 26} width={8} height={10} fill={pal.dim} opacity={0.8} /> : null;
              }),
            )}
            {labels && n && (
              <text x={x + w / 2} y={base - hh - (nope ? 90 : 8) * scale} fill={nope ? pal.glow : pal.dim} fontFamily={PIX} fontSize={13} textAnchor="middle">
                {n}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
};

const Flag: React.FC<{x: number; y: number; pal: Pal; f: number}> = ({x, y, pal, f}) => (
  <g stroke={pal.dim} strokeWidth={3} fill="none">
    <line x1={x} y1={y} x2={x} y2={FLOOR} />
    <path d={`M${x} ${y + 6} q30 ${-10 + Math.sin(f / 6) * 4} 60 0 v44 q-30 ${-10 + Math.sin(f / 6 + 1) * 4} -60 0 Z`} fill={pal.bg2} />
    <circle cx={x} cy={y} r={5} fill={pal.gold} stroke="none" />
  </g>
);

const Plant: React.FC<{x: number; pal: Pal}> = ({x, pal}) => (
  <g stroke={pal.dim} strokeWidth={3} fill="none">
    <path d={`M${x - 22} ${FLOOR - 60} h44 l-6 60 h-32 Z`} fill={pal.bg2} />
    <path d={`M${x} ${FLOOR - 60} q-40 -40 -30 -90 M${x} ${FLOOR - 60} q10 -60 0 -110 M${x} ${FLOOR - 60} q40 -30 36 -80`} />
  </g>
);

export const SetBack: React.FC<SP> = ({set, pal, f, raw}) => {
  const d = pal.dim;
  const ink = pal.ink;
  const L = {stroke: d, strokeWidth: 3, fill: 'none'} as const;
  switch (set) {
    case 'stage':
      return (
        <g>
          <Wall pal={pal} />
          <rect x={340} y={60} width={600} height={320} fill={pal.bg2} stroke={pal.glow} strokeWidth={3} />
          <polyline points="380,340 560,338 700,320 800,270 860,180 900,80" fill="none" stroke={pal.glow} strokeWidth={4} opacity={0.7} />
          {[250, 1030].map((x) => (
            <path key={x} d={`M${x - 20} -10 L${x + 20} -10 L${x + 120} ${FLOOR} L${x - 120} ${FLOOR} Z`} fill={pal.glow} opacity={0.07} />
          ))}
          <rect x={-400} y={FLOOR + 8} width={2080} height={400} fill={pal.bg2} />
          <line x1={-400} y1={FLOOR + 8} x2={1680} y2={FLOOR + 8} stroke={d} strokeWidth={3} />
          {Array.from({length: 22}, (_, i) => (
            <circle key={i} cx={i * 62 + (i % 2) * 20} cy={640} r={26} fill={pal.bg} stroke={d} strokeWidth={2} />
          ))}
        </g>
      );
    case 'office':
      return (
        <g>
          <Wall pal={pal} />
          <rect {...L} x={140} y={100} width={320} height={230} fill={pal.bg2} />
          {Array.from({length: 8}, (_, i) => (
            <line key={i} x1={140} y1={120 + i * 26} x2={460} y2={120 + i * 26} stroke={d} strokeWidth={2} />
          ))}
          <rect x={800} y={130} width={130} height={170} {...L} />
          <polyline points="815,280 850,250 880,262 915,160" fill="none" stroke={pal.glow} strokeWidth={3} />
          <g {...L}>
            <path d={`M920 ${FLOOR - 90} h280 M940 ${FLOOR - 90} V${FLOOR} M1180 ${FLOOR - 90} V${FLOOR}`} />
            <rect x={1010} y={FLOOR - 170} width={110} height={70} fill={pal.bg2} />
            <path d={`M1065 ${FLOOR - 100} v10`} />
          </g>
          <Plant x={80} pal={pal} />
        </g>
      );
    case 'bullpen':
      return (
        <g>
          <Wall pal={pal} />
          {[160, 480, 800, 1120].map((x) => (
            <line key={x} x1={x - 80} y1={30} x2={x + 80} y2={30} stroke={pal.glow} strokeWidth={4} opacity={0.5} />
          ))}
          <rect {...L} x={470} y={90} width={340} height={170} fill={pal.plate} opacity={pal.mono ? 1 : 0.12} />
          <path d="M500 140 q40 -20 80 0 t80 0 M500 190 h140 M690 130 l60 90 M750 130 l-60 90" stroke={d} strokeWidth={3} fill="none" />
          {[90, 330, 950, 1190].map((x) => (
            <g key={x} {...L}>
              <path d={`M${x - 90} ${FLOOR - 70} h180`} />
              <rect x={x - 40} y={FLOOR - 130} width={80} height={52} fill={pal.bg2} />
              <rect x={x - 30} y={FLOOR - 122} width={60} height={36} fill={pal.glow} opacity={0.15} stroke="none" />
            </g>
          ))}
        </g>
      );
    case 'boardroom':
      return (
        <g>
          <Wall pal={pal} />
          <rect {...L} x={160} y={70} width={960} height={300} fill={pal.bg2} />
          <Towers pal={pal} f={f} base={370} scale={0.55} />
          {[400, 640, 880].map((x) => (
            <line key={x} x1={x} y1={70} x2={x} y2={370} stroke={d} strokeWidth={4} />
          ))}
        </g>
      );
    case 'darkroom':
      return (
        <g>
          <Wall pal={pal} dark={pal.mono ? 0 : 0.45} />
          <rect {...L} x={120} y={120} width={180} height={220} fill={pal.bg2} />
          {Array.from({length: 7}, (_, i) => (
            <line key={i} x1={120} y1={140 + i * 30} x2={300} y2={140 + i * 30} stroke={d} strokeWidth={2} />
          ))}
          <path d={`M880 ${FLOOR - 20} L1180 ${FLOOR - 20}`} stroke={d} strokeWidth={4} />
          <rect x={960} y={FLOOR - 150} width={150} height={100} fill={pal.bg2} stroke={pal.glow} strokeWidth={3} />
          <path d={`M960 ${FLOOR - 150} L620 ${FLOOR + 80} L1300 ${FLOOR + 80} L1110 ${FLOOR - 150} Z`} fill={pal.glow} opacity={pal.mono ? 0.05 : 0.08} />
        </g>
      );
    case 'lobby':
      return (
        <g>
          <Wall pal={pal} />
          <circle cx={640} cy={190} r={90} fill="none" stroke={pal.glow} strokeWidth={5} />
          <circle cx={640} cy={190} r={40} fill={pal.glow} opacity={0.3} />
          <text x={640} y={322} fill={d} fontFamily={PIX} fontSize={22} textAnchor="middle">
            LOBBY
          </text>
          {[60, 1080].map((x) => (
            <g key={x} {...L}>
              <rect x={x} y={120} width={140} height={FLOOR - 120} fill={pal.bg2} />
              <line x1={x + 70} y1={120} x2={x + 70} y2={FLOOR} />
              <line x1={x + 20} y1={180} x2={x + 50} y2={150} stroke={pal.glow} opacity={0.5} />
            </g>
          ))}
          <path {...L} d={`M780 ${FLOOR - 80} h220 v80 h-220 Z`} fill={pal.bg2} />
          <Plant x={300} pal={pal} />
        </g>
      );
    case 'courtroom':
      return (
        <g>
          <Wall pal={pal} />
          {[90, 250, 1030, 1190].map((x) => (
            <g key={x} {...L}>
              <rect x={x - 22} y={80} width={44} height={FLOOR - 80} />
              <rect x={x - 32} y={70} width={64} height={14} fill={pal.bg2} />
            </g>
          ))}
          <circle cx={640} cy={130} r={56} fill="none" stroke={pal.gold} strokeWidth={4} />
          <circle cx={640} cy={130} r={36} fill="none" stroke={pal.gold} strokeWidth={2} />
          <rect {...L} x={440} y={250} width={400} height={FLOOR - 250} fill={pal.bg2} />
          <rect x={560} y={272} width={160} height={26} fill={pal.plate} opacity={0.9} />
          <text x={640} y={291} fill={pal.plateInk} fontFamily={MONO} fontWeight={700} fontSize={16} textAnchor="middle">
            THE COURT
          </text>
        </g>
      );
    case 'senate':
      return (
        <g>
          <Wall pal={pal} />
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${100 + i * 40} ${330 - i * 60} Q640 ${250 - i * 80} ${1180 - i * 40} ${330 - i * 60}`} {...L} strokeWidth={10 - i * 2} opacity={0.8} />
          ))}
          {Array.from({length: 9}, (_, i) => (
            <circle key={i} cx={260 + i * 95} cy={270 - Math.sin((i / 8) * Math.PI) * 60} r={10} fill={d} />
          ))}
          <rect {...L} x={470} y={330} width={340} height={90} fill={pal.bg2} />
          <Flag x={120} y={150} pal={pal} f={f} />
          <Flag x={1120} y={150} pal={pal} f={f} />
        </g>
      );
    case 'whitehouse':
      return (
        <g>
          <Wall pal={pal} />
          {[200, 900].map((x) => (
            <g key={x}>
              <rect {...L} x={x} y={90} width={180} height={300} fill={pal.bg2} />
              <line x1={x + 90} y1={90} x2={x + 90} y2={390} stroke={d} strokeWidth={2} />
              <path d={`M${x - 30} 70 q10 170 0 340 h40 q-10 -170 0 -340 Z M${x + 210} 70 q-10 170 0 340 h-40 q10 -170 0 -340 Z`} fill={pal.gold} opacity={0.55} />
            </g>
          ))}
          <Flag x={540} y={150} pal={pal} f={f} />
          <Flag x={680} y={150} pal={pal} f={f} />
          <ellipse cx={640} cy={FLOOR + 50} rx={460} ry={40} fill="none" stroke={pal.gold} strokeWidth={3} opacity={0.7} />
          <path {...L} d={`M500 ${FLOOR - 95} h280 v95 h-280 Z M520 ${FLOOR - 80} h100 v60 h-100 Z M660 ${FLOOR - 80} h100 v60 h-100 Z`} fill={pal.bg2} />
        </g>
      );
    case 'podium':
      return (
        <g>
          <Wall pal={pal} />
          <rect {...L} x={200} y={60} width={880} height={400} fill={pal.bg2} />
          {Array.from({length: 4}, (_, r) =>
            Array.from({length: 7}, (_, c) => <circle key={`${r}${c}`} cx={270 + c * 124} cy={120 + r * 96} r={26} fill="none" stroke={d} strokeWidth={2} />),
          )}
          <Flag x={130} y={120} pal={pal} f={f} />
          <Flag x={1140} y={120} pal={pal} f={f} />
        </g>
      );
    case 'street':
      return (
        <g>
          <rect x={-400} y={-400} width={2080} height={400 + FLOOR} fill={pal.bg} />
          {[
            [0, 200, 330],
            [200, 180, 250],
            [380, 230, 390],
            [610, 160, 280],
            [770, 250, 350],
            [1020, 200, 300],
            [1220, 200, 380],
          ].map(([x, w, h], i) => (
            <g key={i}>
              <rect x={x} y={FLOOR - 40 - h} width={w} height={h} fill={pal.bg2} stroke={d} strokeWidth={2} />
              {Array.from({length: Math.floor(h / 40)}, (_, r) =>
                Array.from({length: Math.floor(w / 36)}, (_, c) => <rect key={`${r}${c}`} x={x + 12 + c * 36} y={FLOOR - 40 - h + 14 + r * 40} width={14} height={18} fill={d} opacity={(r + c + i) % 3 ? 0.9 : 0.3} />),
              )}
            </g>
          ))}
          <rect x={-400} y={FLOOR - 40} width={2080} height={40} fill={pal.floor} />
          <rect x={-400} y={FLOOR} width={2080} height={600} fill={pal.bg2} />
          <line x1={-400} y1={FLOOR} x2={1680} y2={FLOOR} stroke={d} strokeWidth={4} />
          {Array.from({length: 10}, (_, i) => (
            <rect key={i} x={380 + i * 56} y={FLOOR + 30} width={30} height={60} fill={pal.floor} opacity={0.8} />
          ))}
          <g {...L}>
            <path d={`M1120 ${FLOOR} V300 q0 -20 30 -20 h30`} />
            <circle cx={1190} cy={290} r={10} fill={pal.gold} opacity={0.8} />
          </g>
        </g>
      );
    case 'skyline':
      return (
        <g>
          <rect x={-400} y={-400} width={2080} height={1600} fill={pal.bg} />
          {Array.from({length: 40}, (_, i) => {
            const r = rng(i * 31 + 3);
            return <rect key={i} x={r() * 1280} y={r() * 260} width={3} height={3} fill={pal.ink} opacity={0.3 + ((i + Math.floor(f / 8)) % 3) * 0.2} />;
          })}
          <circle cx={1080} cy={110} r={44} fill={pal.plate} opacity={pal.mono ? 1 : 0.18} />
          <Towers pal={pal} f={f} base={FLOOR - 10} labels />
          <rect x={-400} y={FLOOR - 10} width={2080} height={600} fill={pal.floor} />
          <g stroke={d} strokeWidth={3}>
            <line x1={-400} y1={FLOOR - 10} x2={1680} y2={FLOOR - 10} />
            {Array.from({length: 26}, (_, i) => (
              <line key={i} x1={i * 52} y1={FLOOR - 10} x2={i * 52} y2={FLOOR + 30} />
            ))}
            <line x1={-400} y1={FLOOR + 30} x2={1680} y2={FLOOR + 30} />
          </g>
        </g>
      );
    case 'lab':
      return (
        <g>
          <Wall pal={pal} />
          <rect {...L} x={600} y={90} width={440} height={210} fill={pal.plate} opacity={pal.mono ? 1 : 0.1} />
          <path d="M630 270 L760 268 L860 250 L930 200 L980 120" fill="none" stroke={pal.glow} strokeWidth={3} />
          <text x={640} y={140} fill={d} fontFamily={MONO} fontSize={20}>
            {'∑ loss → 0 ?'}
          </text>
          <g {...L}>
            <path d={`M80 ${FLOOR - 90} h420 M100 ${FLOOR - 90} V${FLOOR} M480 ${FLOOR - 90} V${FLOOR}`} />
            {[150, 230, 320, 410].map((x, i) => (
              <path key={x} d={`M${x - 8} ${FLOOR - 140} v26 l-14 24 h44 l-14 -24 v-26`} fill={i % 2 ? pal.glow : pal.bg2} fillOpacity={i % 2 ? 0.35 : 1} />
            ))}
          </g>
          <rect {...L} x={1110} y={170} width={110} height={FLOOR - 170} fill={pal.bg2} />
          {Array.from({length: 10}, (_, i) => (
            <rect key={i} x={1126} y={190 + i * 34} width={10} height={6} fill={(i + Math.floor(f / 4)) % 3 ? pal.glow : d} />
          ))}
        </g>
      );
    case 'datacenter': {
      const vp = [640, 300];
      return (
        <g>
          <Wall pal={pal} />
          {[-1, 1].map((side) => (
            <g key={side}>
              {Array.from({length: 6}, (_, i) => {
                const k0 = i / 6;
                const k1 = (i + 0.8) / 6;
                const X = (k: number) => vp[0] + side * (620 - 560 * k);
                const Y0 = (k: number) => vp[1] - (330 - 290 * k);
                const Y1 = (k: number) => vp[1] + (240 - 200 * k);
                return (
                  <g key={i}>
                    <polygon points={`${X(k0)},${Y0(k0)} ${X(k1)},${Y0(k1)} ${X(k1)},${Y1(k1)} ${X(k0)},${Y1(k0)}`} fill={pal.bg2} stroke={d} strokeWidth={2} />
                    {Array.from({length: 6}, (_, j) => {
                      const on = (i * 5 + j * 3 + Math.floor(f / 3) + (side > 0 ? 2 : 0)) % 4 === 0;
                      const yy = Y0(k0) + ((Y1(k0) - Y0(k0)) * (j + 1)) / 7;
                      return <rect key={j} x={X(k0) + side * -12 * (1 - k0) - 3} y={yy} width={6 * (1 - k0 * 0.7)} height={4} fill={on ? pal.glow : d} />;
                    })}
                  </g>
                );
              })}
            </g>
          ))}
          <path d={`M0 20 L${vp[0]} ${vp[1] - 40} L1280 20`} {...L} />
        </g>
      );
    }
    case 'stadium':
      return (
        <g>
          <rect x={-400} y={-400} width={2080} height={1600} fill={pal.bg} />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M-100 ${420 - i * 70} Q640 ${300 - i * 80} 1380 ${420 - i * 70}`} fill="none" stroke={d} strokeWidth={30} opacity={0.5 - i * 0.08} />
          ))}
          {Array.from({length: 60}, (_, i) => {
            const r = rng(i * 17);
            const x = r() * 1280;
            const row = Math.floor(r() * 4);
            const y = 420 - row * 70 - Math.sin((x / 1280) * Math.PI) * (120 + row * 10) + ((i + Math.floor(f / 6)) % 2) * 3;
            return <circle key={i} cx={x} cy={y} r={6} fill={pal.ink} opacity={0.5} />;
          })}
          <rect x={440} y={40} width={400} height={170} fill={pal.bg2} stroke={pal.glow} strokeWidth={3} />
          {[60, 1220].map((x) => (
            <g key={x}>
              <line x1={x} y1={40} x2={x} y2={FLOOR} stroke={d} strokeWidth={5} />
              <rect x={x - 40} y={20} width={80} height={30} fill={pal.plate} opacity={0.6} />
            </g>
          ))}
          <rect x={-400} y={FLOOR - 40} width={2080} height={600} fill={pal.floor} />
          <line x1={-400} y1={FLOOR - 40} x2={1680} y2={FLOOR - 40} stroke={d} strokeWidth={3} />
          <line x1={640} y1={FLOOR - 40} x2={640} y2={700} stroke={d} strokeWidth={3} opacity={0.6} />
        </g>
      );
    case 'dinner':
      return (
        <g>
          <Wall pal={pal} />
          {[200, 500, 780, 1080].map((x) => (
            <path {...L} key={x} d={`M${x - 70} 380 V170 q70 -110 140 0 V380 Z`} fill={pal.bg2} />
          ))}
          <text x={640} y={98} fill={d} fontFamily={PIX} fontSize={16} textAnchor="middle">
            THE WOODROSE
          </text>
        </g>
      );
    case 'call':
      return (
        <g>
          <rect x={-400} y={-400} width={2080} height={1600} fill={pal.mono ? pal.bg : '#070a12'} />
          <rect x={60} y={60} width={1160} height={520} rx={10} fill={pal.bg} stroke={d} strokeWidth={2} />
        </g>
      );
    case 'screen':
      return (
        <g>
          <Wall pal={pal} />
          <rect x={170} y={60} width={940} height={410} rx={16} fill={pal.mono ? pal.bg : '#05070d'} stroke={ink} strokeWidth={6} />
          <rect x={195} y={82} width={890} height={366} fill={pal.bg2} opacity={0.8} />
          <path d={`M600 470 l-30 ${FLOOR - 470} h140 l-30 ${-(FLOOR - 470)} Z`} fill={pal.bg2} stroke={d} strokeWidth={3} />
        </g>
      );
    case 'lighthouse': {
      const a = (f * 3) % 360;
      return (
        <g>
          <rect x={-400} y={-400} width={2080} height={1600} fill={pal.bg} />
          <rect x={-400} y={380} width={2080} height={800} fill={pal.bg2} />
          {Array.from({length: 6}, (_, i) => (
            <path key={i} d={`M${-40 + ((f * 2 + i * 230) % 1400) - 100} ${400 + i * 22} q20 -8 40 0 t40 0`} stroke={d} strokeWidth={2} fill="none" />
          ))}
          <path d={`M780 ${FLOOR} L860 330 L1300 300 L1400 ${FLOOR} Z`} fill={pal.floor} stroke={d} strokeWidth={3} />
          <path d="M960 330 L990 110 L1050 110 L1080 330 Z" fill={pal.plate} opacity={pal.mono ? 1 : 0.85} stroke={ink} strokeWidth={3} />
          {[160, 220, 280].map((y) => (
            <path key={y} d={`M${963 + (330 - y) * 0.12} ${y} L${1077 - (330 - y) * 0.12} ${y} L${1077 - (330 - y - 22) * 0.12} ${y - 22} L${963 + (330 - y - 22) * 0.12} ${y - 22} Z`} fill={pal.red} opacity={0.8} />
          ))}
          <rect x={995} y={80} width={50} height={30} fill={pal.gold} stroke={ink} strokeWidth={3} />
          <path d="M985 80 L1020 55 L1055 80 Z" fill={pal.bg2} stroke={ink} strokeWidth={3} />
          <g transform={`rotate(${Math.sin((a * Math.PI) / 180) * 30} 1020 95)`}>
            <path d="M1020 95 L200 20 L200 170 Z" fill={pal.gold} opacity={0.12} />
          </g>
          <rect x={-400} y={FLOOR} width={2080} height={600} fill={pal.floor} />
          <line x1={-400} y1={FLOOR} x2={1680} y2={FLOOR} stroke={d} strokeWidth={3} />
        </g>
      );
    }
    case 'vault':
      return (
        <g>
          <Wall pal={pal} />
          <circle cx={640} cy={290} r={200} fill={pal.bg2} stroke={ink} strokeWidth={6} />
          <circle cx={640} cy={290} r={170} fill="none" stroke={d} strokeWidth={3} />
          {Array.from({length: 12}, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <circle key={i} cx={640 + Math.cos(a) * 185} cy={290 + Math.sin(a) * 185} r={6} fill={d} />;
          })}
          <g transform={`rotate(${f * 0.6} 640 290)`}>
            {[0, 60, 120].map((r) => (
              <line key={r} x1={640 - 70} y1={290} x2={640 + 70} y2={290} stroke={ink} strokeWidth={8} transform={`rotate(${r} 640 290)`} strokeLinecap="round" />
            ))}
            <circle cx={640} cy={290} r={20} fill={pal.bg2} stroke={ink} strokeWidth={5} />
          </g>
          {Array.from({length: 12}, (_, i) => (
            <line key={i} x1={i * 120} y1={FLOOR} x2={640 + (i * 120 - 640) * 1.8} y2={640} stroke={d} strokeWidth={2} opacity={0.6} />
          ))}
        </g>
      );
    case 'rocket': {
      const smoke = Array.from({length: 8}, (_, i) => {
        const r = rng(i * 7 + 1);
        return <circle key={i} cx={880 + (r() - 0.5) * 260} cy={FLOOR - 20 - r() * 40} r={30 + r() * 30 + Math.sin(f / 7 + i) * 4} fill={pal.plate} opacity={pal.mono ? 1 : 0.14} stroke={d} strokeWidth={2} />;
      });
      return (
        <g>
          <Wall pal={pal} />
          <g stroke={d} strokeWidth={3} fill="none">
            <path d={`M1040 ${FLOOR} V60 M1110 ${FLOOR} V60`} />
            {Array.from({length: 12}, (_, i) => (
              <path key={i} d={`M1040 ${FLOOR - i * 40} L1110 ${FLOOR - (i + 1) * 40} M1110 ${FLOOR - i * 40} L1040 ${FLOOR - (i + 1) * 40}`} />
            ))}
          </g>
          <path d={`M880 70 Q930 130 930 200 V${FLOOR - 60} H830 V200 Q830 130 880 70 Z`} fill={pal.bg2} stroke={pal.ink} strokeWidth={4} />
          <path d={`M830 ${FLOOR - 140} L790 ${FLOOR - 50} H830 Z M930 ${FLOOR - 140} L970 ${FLOOR - 50} H930 Z`} fill={pal.red} opacity={0.8} />
          <circle cx={880} cy={220} r={18} fill={pal.glow} opacity={0.5} stroke={pal.ink} strokeWidth={3} />
          <text x={880} y={330} fill={pal.dim} fontFamily={PIX} fontSize={16} textAnchor="middle" transform="rotate(-90 880 330)">
            SPACEZ
          </text>
          {smoke}
        </g>
      );
    }
    case 'void':
    default:
      return (
        <g>
          <rect x={-400} y={-400} width={2080} height={1600} fill={pal.bg} />
          {Array.from({length: 13}, (_, i) => (
            <line key={i} x1={640} y1={FLOOR - 30} x2={-400 + i * 173} y2={900} stroke={pal.dim} strokeWidth={1.5} opacity={0.35} />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={-400} y1={FLOOR + i * i * 12} x2={1680} y2={FLOOR + i * i * 12} stroke={pal.dim} strokeWidth={1.5} opacity={0.4} />
          ))}
          {raw && raw.toLowerCase() !== 'void' && (
            <text x={640} y={120} fill={pal.dim} fontFamily={MONO} fontWeight={700} fontSize={22} textAnchor="middle">
              {`[ set: ${raw} ]`}
            </text>
          )}
        </g>
      );
  }
};

export const SetFront: React.FC<SP> = ({set, pal, xs}) => {
  const d = pal.dim;
  switch (set) {
    case 'dinner':
      return (
        <g>
          <rect x={-60} y={FLOOR - 40} width={1400} height={140} fill={pal.plate} opacity={pal.mono ? 1 : 0.9} stroke={d} strokeWidth={3} />
          <path d={`M-60 ${FLOOR - 26} H1340`} stroke={pal.plateInk} strokeWidth={2} opacity={0.3} />
          {[180, 460, 820, 1100].map((x) => (
            <g key={x}>
              <rect x={x - 3} y={FLOOR - 70} width={6} height={30} fill={pal.plateInk} />
              <path d={`M${x - 5} ${FLOOR - 72} h10 l-5 -16 Z`} fill={pal.gold} />
            </g>
          ))}
          {[300, 640, 960].map((x) => (
            <rect key={x} x={x - 7} y={FLOOR - 62} width={14} height={22} fill="none" stroke={pal.plateInk} strokeWidth={2} />
          ))}
        </g>
      );
    case 'boardroom':
      return (
        <g>
          <path d={`M160 ${FLOOR - 50} H1120 L1150 ${FLOOR - 28} H130 Z`} fill={pal.dim} stroke={pal.ink} strokeWidth={3} />
          <path d={`M130 ${FLOOR - 28} H1150 V${FLOOR + 90} H130 Z`} fill={pal.bg2} stroke={pal.ink} strokeWidth={3} />
          {[300, 640, 980].map((x) => (
            <g key={x}>
              <rect x={x - 24} y={FLOOR - 46} width={48} height={12} fill={pal.plate} opacity={0.85} transform={`rotate(-4 ${x} ${FLOOR - 40})`} />
              <rect x={x + 34} y={FLOOR - 62} width={10} height={16} fill="none" stroke={pal.ink} strokeWidth={2} />
            </g>
          ))}
        </g>
      );
    case 'senate':
      return (
        <g>
          <rect x={360} y={FLOOR - 36} width={560} height={130} fill={pal.bg2} stroke={pal.ink} strokeWidth={3} />
          {[480, 640, 800].map((x) => (
            <path key={x} d={`M${x} ${FLOOR - 36} l-10 -40 m10 40 l0 0`} stroke={pal.ink} strokeWidth={3} />
          ))}
          <rect x={560} y={FLOOR - 20} width={160} height={24} fill={pal.plate} />
          <text x={640} y={FLOOR - 2} fill={pal.plateInk} fontFamily={MONO} fontWeight={700} fontSize={14} textAnchor="middle">
            WITNESS
          </text>
        </g>
      );
    case 'courtroom':
      return (
        <g stroke={d} strokeWidth={3}>
          <line x1={-60} y1={FLOOR + 30} x2={1340} y2={FLOOR + 30} />
          {Array.from({length: 24}, (_, i) => (
            <line key={i} x1={i * 58} y1={FLOOR + 30} x2={i * 58} y2={FLOOR + 80} />
          ))}
        </g>
      );
    case 'podium': {
      const lx = xs && xs.length ? xs[0] : 640;
      return (
        <g stroke={pal.ink} strokeWidth={3}>
          <path d={`M${lx - 60} ${FLOOR - 150} H${lx + 60} L${lx + 45} ${FLOOR + 10} H${lx - 45} Z`} fill={pal.bg2} />
          <circle cx={lx} cy={FLOOR - 90} r={20} fill="none" stroke={pal.gold} />
          <path d={`M${lx + 10} ${FLOOR - 150} q6 -20 -6 -30`} fill="none" />
        </g>
      );
    }
    default:
      return null;
  }
};

/** Background glyph field for the GLYPH style (drawn over the wall, under the cast). */
export const GlyphBg: React.FC<{pal: Pal; f: number; seed: number}> = ({pal, f, seed}) => {
  const rows = 26;
  const cols = 92;
  const r = rng(seed);
  const lines: string[] = [];
  for (let y = 0; y < rows; y++) {
    let s = '';
    for (let x = 0; x < cols; x++) s += r() < 0.35 ? GLY[Math.floor(r() * GLY.length)] : ' ';
    lines.push(s);
  }
  const shift = Math.floor(f / 3) % rows;
  return (
    <g fontFamily={MONO} fontSize={24} fill={pal.dim} opacity={0.38}>
      {lines.map((l, i) => (
        <text key={i} x={0} y={((i + shift) % rows) * 24 + 20} xmlSpace="preserve">
          {l}
        </text>
      ))}
    </g>
  );
};
