// SATIRE structure — small puppet bodies (foam torsos in real-fabric costumes), rod arms, latex hands.
// Local units match the head sculpt space: origin = head centre, y down.
import React from 'react';
import {blob, ellPts, mix, type XY} from './lib';
import {Rim, Soft, bl} from './kit';

const HOOD = {base: '#5A5F68', hi: '#9AA2AE', low: '#2E3238', deep: '#14161A', string: '#C8CACE'};
const TEE = {base: '#141518', hi: '#34383F', low: '#060607'};
const SKIN = {base: '#DDA184', mid: '#C07F66', low: '#8D4F43', deep: '#4E2622', sss: '#C8463A', hi: '#F0C3A6'};
const KEY = '#9FEFF5';
const WARM = '#FFB36A';

/** Tapered capsule outline between two joints. */
export const taper = (a: XY, b: XY, ra: number, rb: number) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l = Math.hypot(dx, dy) || 1;
  const nx = -dy / l;
  const ny = dx / l;
  const f = (v: number) => v.toFixed(1);
  return `M ${f(a[0] + nx * ra)} ${f(a[1] + ny * ra)} L ${f(b[0] + nx * rb)} ${f(b[1] + ny * rb)} A ${rb} ${rb} 0 0 1 ${f(b[0] - nx * rb)} ${f(b[1] - ny * rb)} L ${f(a[0] - nx * ra)} ${f(a[1] - ny * ra)} A ${ra} ${ra} 0 0 1 ${f(a[0] + nx * ra)} ${f(a[1] + ny * ra)} Z`;
};

/** A cylindrical limb segment: lit toward L, core shadow, warm rim on the far side. */
const Limb: React.FC<{id: string; a: XY; b: XY; ra: number; rb: number; c: {hi: string; base: string; low: string}; L: XY; lit: number; rim?: number}> = ({id, a, b, ra, rb, c, L, lit, rim = 0}) => {
  const d = taper(a, b, ra, rb);
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const r = Math.max(ra, rb);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-g`} x1={mx + L[0] * r} y1={my + L[1] * r} x2={mx - L[0] * r} y2={my - L[1] * r} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={mix(c.base, c.hi, lit)} />
          <stop offset="0.45" stopColor={c.base} />
          <stop offset="0.8" stopColor={c.low} />
          <stop offset="1" stopColor={mix(c.low, c.base, 0.4)} />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${id}-g)`} />
      {rim > 0 ? <Rim id={`${id}-rim`} d={d} dx={-10} dy={3} color={WARM} op={rim * 0.9} blur={3} /> : null}
    </g>
  );
};

/** Latex puppet hand seen from the front: back of the hand, knuckles, fingers hanging onto the keys. */
export const RubberHand: React.FC<{x: number; y: number; s?: number; rot?: number; L: XY; lit: number; flip?: boolean; id: string; rim?: number}> = ({x, y, s = 1, rot = 0, L, lit, flip, id, rim = 0}) => {
  const f = flip ? -1 : 1;
  const back: XY[] = [[-26, -34], [-4, -40], [18, -38], [32, -26], [36, -2], [30, 14], [-28, 14], [-34, -8]];
  const fingers: [number, number, number, number][] = [
    [-22, 6, 7.5, -0.1],
    [-7, 8, 8, -0.03],
    [8, 8, 7.8, 0.03],
    [22, 5, 6.8, 0.1],
  ];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * f} ${s})`}>
      <defs>
        <linearGradient id={`${id}-g`} x1={L[0] * 40 * f} y1={-40} x2={-L[0] * 40 * f} y2={40} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={mix(SKIN.base, '#E8E4DC', 0.35 * lit)} />
          <stop offset="0.5" stopColor={SKIN.mid} />
          <stop offset="1" stopColor={SKIN.deep} />
        </linearGradient>
      </defs>
      {/* fingers: proximal segment down from the knuckle, tip bent onto the key */}
      {fingers.map(([fx, fy, r, a], i) => (
        <g key={i} transform={`rotate(${(a * 180) / Math.PI} ${fx} ${fy})`}>
          <path d={taper([fx, fy], [fx, fy + 30], r, r * 0.9)} fill={`url(#${id}-g)`} />
          <g filter={bl(1.6)} opacity={0.6}>
            <path d={`M ${fx - r * 0.8} ${fy + 18} Q ${fx} ${fy + 22} ${fx + r * 0.8} ${fy + 18}`} fill="none" stroke={SKIN.deep} strokeWidth={2} />
            <ellipse cx={fx} cy={fy + 36} rx={r * 0.9} ry={4} fill="#050304" />
          </g>
        </g>
      ))}
      <path d={blob(back)} fill={`url(#${id}-g)`} />
      {/* thumb along the inner edge */}
      <path d={taper([30, -10], [44, 22], 10, 8)} fill={SKIN.mid} />
      <g filter={bl(2)} opacity={0.5}>
        <path d={blob([[30, -6], [40, 10], [44, 24]], false)} fill="none" stroke={SKIN.deep} strokeWidth={3} />
      </g>
      {/* knuckle row + tendons (sculpted into the latex) */}
      <g filter={bl(1.6)} opacity={0.55 * lit} style={{mixBlendMode: 'screen'}}>
        {fingers.map(([fx], i) => (
          <ellipse key={i} cx={fx - 1} cy={2} rx={5.5} ry={4} fill={KEY} />
        ))}
        <path d={blob(ellPts(-8, -26, 18, 7))} fill={KEY} opacity={0.7} />
      </g>
      <g filter={bl(1.6)} opacity={0.35}>
        {fingers.map(([fx], i) => (
          <line key={i} x1={fx * 0.5} y1={-30} x2={fx} y2={-4} stroke={SKIN.deep} strokeWidth={2} />
        ))}
      </g>
      <g filter={bl(4)} opacity={0.3}>
        <path d={blob(back)} fill="none" stroke={SKIN.sss} strokeWidth={7} />
      </g>
      {rim > 0 ? (
        <g filter={bl(2)} opacity={rim} style={{mixBlendMode: 'screen'}}>
          <path d={blob([[34, -26], [38, -4], [32, 12]], false)} fill="none" stroke={WARM} strokeWidth={4} />
        </g>
      ) : null}
    </g>
  );
};

export interface MasBodyPose {
  L: XY;
  key: number;
  rim: number;
  breath: number; // 0..1
  sway: number; // drawstring swing (deg)
}

/** Hood, neck, torso with upper sleeves — drawn BEHIND the head (the head goes on top). */
export const MasTorso: React.FC<{b: MasBodyPose; id?: string}> = ({b, id = 'mt'}) => {
  const L = b.L;
  const br = b.breath * 3;
  const torso: XY[] = [[-196, 420], [-190, 330], [-168, 290], [-110, 262], [-40, 250], [40, 250], [110, 262], [168, 290], [190, 330], [196, 420], [204, 600], [-204, 600]];
  const sw = (b.sway * Math.PI) / 180;
  const string = (x0: number, ph: number) => {
    const len = 104;
    const a = sw * (1 + ph * 0.3);
    const x1 = x0 + Math.sin(a) * len;
    const y1 = 298 + Math.cos(a) * len;
    return {d: `M ${x0} 298 Q ${x0 + Math.sin(a) * len * 0.25} ${298 + len * 0.55} ${x1} ${y1}`, x1, y1, a};
  };
  const strings = [string(-24, 0), string(28, 1)];
  const sleeve = (sd: 1 | -1): XY[] => [[170 * sd, 292], [198 * sd, 330], [212 * sd, 420], [214 * sd, 470], [166 * sd, 470], [160 * sd, 400], [150 * sd, 330]];
  return (
    <g transform={`translate(0 ${-br * 0.4})`}>
      <defs>
        <linearGradient id={`${id}-hood`} x1={L[0] * 220} y1="250" x2={-L[0] * 220} y2="420" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={mix(HOOD.hi, '#8FD8E0', 0.3 * b.key)} />
          <stop offset="0.35" stopColor={HOOD.base} />
          <stop offset="0.75" stopColor={HOOD.low} />
          <stop offset="1" stopColor={HOOD.deep} />
        </linearGradient>
        <linearGradient id={`${id}-neck`} x1="0" y1="130" x2="0" y2="270" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2A1212" />
          <stop offset="0.45" stopColor={SKIN.deep} />
          <stop offset="1" stopColor={SKIN.low} />
        </linearGradient>
      </defs>
      {/* hood lying behind the neck */}
      <path d={blob([[-150, 262], [-142, 196], [-96, 160], [0, 150], [96, 160], [142, 196], [150, 262], [0, 272]])} fill={HOOD.low} />
      <Soft blur={12} op={0.8}>
        <path d={blob([[-116, 250], [-100, 196], [0, 176], [100, 196], [116, 250], [0, 258]])} fill={HOOD.deep} />
      </Soft>
      {/* neck */}
      <path d={blob([[-50, 120], [50, 120], [54, 272], [-54, 272]])} fill={`url(#${id}-neck)`} />
      <Soft blur={6} op={0.5 * b.key} blend="screen">
        <path d={blob([[-50, 190], [-44, 262]], false)} fill="none" stroke={KEY} strokeWidth={8} />
      </Soft>
      {/* torso */}
      <path d={blob(torso)} fill={`url(#${id}-hood)`} />
      {/* upper sleeves hanging to the elbows (hidden by the desk) */}
      <path d={blob(sleeve(-1))} fill={`url(#${id}-hood)`} />
      <path d={blob(sleeve(1))} fill={HOOD.low} />
      <Soft blur={6} op={0.7}>
        <path d={blob([[-156, 330], [-162, 400], [-166, 460]], false)} fill="none" stroke={HOOD.deep} strokeWidth={8} />
        <path d={blob([[156, 330], [162, 400], [166, 460]], false)} fill="none" stroke={HOOD.deep} strokeWidth={10} />
      </Soft>
      {/* fabric folds: chest sag, side creases */}
      <Soft blur={7} op={0.6}>
        <path d={blob([[-110, 340], [-60, 372], [0, 380], [60, 372], [110, 340]], false)} fill="none" stroke={HOOD.deep} strokeWidth={7} />
        <path d={blob([[-120, 400], [-90, 440], [-80, 500]], false)} fill="none" stroke={HOOD.deep} strokeWidth={8} />
        <path d={blob([[118, 380], [100, 440], [96, 500]], false)} fill="none" stroke={HOOD.deep} strokeWidth={10} />
      </Soft>
      <Soft blur={8} op={0.5 * b.key} blend="screen">
        <path d={blob([[-186, 320], [-200, 400], [-206, 470]], false)} fill="none" stroke={KEY} strokeWidth={10} />
        <path d={blob([[-150, 290], [-100, 270], [-40, 262]], false)} fill="none" stroke={KEY} strokeWidth={6} opacity={0.6} />
      </Soft>
      {/* hood crossover at the neckline */}
      <path d={blob([[-126, 244], [-70, 270], [-8, 312], [20, 300], [-40, 262], [-110, 232]])} fill={mix(HOOD.base, HOOD.hi, 0.25 * b.key)} />
      <path d={blob([[126, 244], [70, 270], [8, 312], [-14, 306], [40, 262], [110, 232]])} fill={HOOD.low} />
      <Soft blur={4} op={0.8}>
        <path d={blob([[-70, 272], [-8, 314], [70, 272]], false)} fill="none" stroke={HOOD.deep} strokeWidth={6} transform="translate(0 6)" />
      </Soft>
      {/* drawstrings + aglets (secondary motion on a spring) */}
      {strings.map((st, i) => (
        <g key={i}>
          <circle cx={i ? 28 : -24} cy={298} r={5} fill={HOOD.deep} />
          <path d={st.d} fill="none" stroke={HOOD.string} strokeWidth={5.5} strokeLinecap="round" opacity={0.9} />
          <path d={st.d} fill="none" stroke={HOOD.deep} strokeWidth={2} strokeLinecap="round" transform="translate(2 0)" opacity={0.5} />
          <rect x={st.x1 - 3.5} y={st.y1 - 2} width={7} height={16} rx={3} fill="#B8BCC2" transform={`rotate(${(-st.a * 180) / Math.PI} ${st.x1} ${st.y1})`} />
        </g>
      ))}
      <Rim id={`${id}-rim`} d={`${blob(torso)} ${blob(sleeve(1))}`} dx={-12} dy={6} color={WARM} op={b.rim * 0.9} blur={5} />
      <Rim id={`${id}-rimk`} d={`${blob(torso)} ${blob(sleeve(-1))}`} dx={9} dy={4} color={KEY} op={b.key * 0.4} blur={4} />
    </g>
  );
};

/** Mas's forearms on the desk + latex hands on the keyboard. Drawn after the desk top. */
export const MasArms: React.FC<{b: MasBodyPose; hl: number; hr: number; id?: string}> = ({b, hl, hr, id = 'ma'}) => {
  const L = b.L;
  const lh: XY = [-92, 450 - hl * 13];
  const rh: XY = [98, 452 - hr * 13];
  const fore = (sd: 1 | -1, h: XY): XY[] => [
    [206 * sd, 400], [214 * sd, 430], [h[0] + 40 * sd, h[1] + 12], [h[0] + 6 * sd, h[1] + 2], [h[0] + 10 * sd, h[1] - 26], [150 * sd, 402],
  ];
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sl`} x1="-240" y1="380" x2="0" y2="470" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={mix(HOOD.base, HOOD.hi, 0.5 * b.key)} />
          <stop offset="1" stopColor={HOOD.low} />
        </linearGradient>
        <linearGradient id={`${id}-sr`} x1="0" y1="380" x2="240" y2="470" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={HOOD.low} />
          <stop offset="1" stopColor={HOOD.deep} />
        </linearGradient>
      </defs>
      <Soft blur={10} op={0.7}>
        <path d={blob(fore(-1, lh).map(([x, y]) => [x + 10, y + 16] as XY))} fill="#030204" />
        <path d={blob(fore(1, rh).map(([x, y]) => [x + 14, y + 16] as XY))} fill="#030204" />
      </Soft>
      <path d={blob(fore(-1, lh))} fill={`url(#${id}-sl)`} />
      <path d={blob(fore(1, rh))} fill={`url(#${id}-sr)`} />
      <Soft blur={4} op={0.6}>
        <path d={blob([[-176, 414], [-150, 428], [-128, 440]], false)} fill="none" stroke={HOOD.deep} strokeWidth={5} />
        <path d={blob([[176, 414], [150, 428], [128, 440]], false)} fill="none" stroke={HOOD.deep} strokeWidth={5} />
      </Soft>
      <path d={blob(ellPts(lh[0] - 18, lh[1] - 10, 22, 24, 12, 0.5))} fill={HOOD.low} />
      <path d={blob(ellPts(rh[0] + 18, rh[1] - 10, 22, 24, 12, -0.5))} fill={HOOD.deep} />
      <RubberHand id={`${id}-l`} x={lh[0]} y={lh[1]} s={1.05} rot={-14} L={L} lit={b.key} />
      <RubberHand id={`${id}-r`} x={rh[0]} y={rh[1]} s={1.05} rot={14} L={L} lit={b.key * 0.45} flip rim={b.rim} />
      <Rim id={`${id}-rim`} d={blob(fore(1, rh))} dx={-8} dy={4} color={WARM} op={b.rim * 0.7} blur={3} />
    </g>
  );
};

export interface NoleBodyPose {
  L: XY;
  key: number;
  rim: number;
  phone: number;
  shoulder: number;
  elbow: number;
  lean: number;
}

/** Nole's torso (black tee) — drawn behind his head. Below local y~520 is hidden by the playboard. */
export const NoleTorso: React.FC<{b: NoleBodyPose; id?: string}> = ({b, id = 'nt'}) => {
  const L = b.L;
  const torso: XY[] = [
    [-112, 336], [-60, 352], [0, 356], [60, 352], [112, 336], [196, 360], [258, 386], [300, 424], [318, 486], [312, 560], [296, 800],
    [-296, 800], [-312, 560], [-318, 486], [-300, 424], [-258, 386], [-196, 360],
  ];
  const sleeveR: XY[] = [[250, 384], [300, 420], [322, 480], [326, 548], [270, 560], [262, 470]];
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-tee`} x1={L[0] * 320} y1={330 + L[1] * 100} x2={-L[0] * 320} y2={560 - L[1] * 100} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={mix(TEE.hi, '#3E7A84', 0.5 * b.key)} />
          <stop offset="0.35" stopColor={TEE.base} />
          <stop offset="1" stopColor={TEE.low} />
        </linearGradient>
        <linearGradient id={`${id}-neck`} x1="0" y1="200" x2="0" y2="350" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#120606" />
          <stop offset="0.6" stopColor="#2E1614" />
          <stop offset="1" stopColor={mix(SKIN.low, SKIN.deep, 0.5)} />
        </linearGradient>
      </defs>
      {/* thick neck + trapezius */}
      <path d={blob([[-98, 190], [98, 190], [118, 344], [-118, 344]])} fill={`url(#${id}-neck)`} />
      <path d={blob(torso)} fill={`url(#${id}-tee)`} />
      <path d={blob(sleeveR)} fill={TEE.low} />
      {/* shoulder/pec planes catching a little monitor light */}
      <Soft blur={18} op={0.6 * b.key} blend="screen">
        <path d={blob(ellPts(-250, 430, 60, 50))} fill="#2E5A64" />
        <path d={blob(ellPts(-120, 440, 100, 46))} fill="#20404A" />
      </Soft>
      <Soft blur={8} op={0.8}>
        <path d={blob([[-180, 470], [-100, 486], [-10, 470]], false)} fill="none" stroke={TEE.low} strokeWidth={10} />
        <path d={blob([[40, 400], [36, 470], [30, 540]], false)} fill="none" stroke={TEE.low} strokeWidth={9} />
      </Soft>
      {/* crew-neck rib */}
      <path d={blob([[-118, 332], [-60, 350], [0, 356], [60, 350], [118, 332], [112, 348], [56, 370], [0, 376], [-56, 370], [-112, 348]])} fill="#202226" />
      {/* the jaw's cast shadow on the neck and chest */}
      <Soft blur={16} op={0.75}>
        <path d={blob([[-150, 300], [0, 330], [150, 300], [120, 380], [0, 400], [-120, 380]])} fill="#030303" />
      </Soft>
      <Rim id={`${id}-rim`} d={`${blob(torso)} ${blob(sleeveR)}`} dx={-15} dy={10} color={WARM} op={b.rim} blur={6} />
    </g>
  );
};

/** Nole's phone arm on a visible rod — drawn in front of the desk top. */
export const NolePhoneArm: React.FC<{b: NoleBodyPose; id?: string; rodTo?: XY; wrist: XY; handTilt?: number; part?: 'all' | 'upper' | 'fore'}> = ({b, id = 'na', rodTo, wrist, handTilt = 0, part = 'all'}) => {
  const L = b.L;
  const sh: XY = [-276, 424];
  const up = 200;
  const fo = 190;
  // 2-bone IK: elbow hangs low and outward (a rod puppet's elbow falls with gravity)
  const dx = wrist[0] - sh[0];
  const dy = wrist[1] - sh[1];
  const dist = Math.min(up + fo - 1, Math.max(20, Math.hypot(dx, dy)));
  const base = Math.atan2(dy, dx);
  const cosA = (up * up + dist * dist - fo * fo) / (2 * up * dist);
  const A = Math.acos(Math.max(-1, Math.min(1, cosA)));
  const cands: XY[] = [base + A, base - A].map((ang) => [sh[0] + Math.cos(ang) * up, sh[1] + Math.sin(ang) * up] as XY);
  const el = cands[0][1] > cands[1][1] ? cands[0] : cands[1];
  const wr: XY = [el[0] + ((wrist[0] - el[0]) / Math.hypot(wrist[0] - el[0], wrist[1] - el[1])) * fo, el[1] + ((wrist[1] - el[1]) / Math.hypot(wrist[0] - el[0], wrist[1] - el[1])) * fo];
  const slv: XY = [sh[0] + (el[0] - sh[0]) * 0.5, sh[1] + (el[1] - sh[1]) * 0.5];
  const arm =
    part === 'upper' ? taper(sh, el, 46, 36) : part === 'fore' ? `${taper(el, wr, 36, 26)} ${blob(ellPts(el[0], el[1], 38, 38))}` : `${taper(sh, el, 46, 36)} ${taper(el, wr, 36, 26)}`;
  const showUpper = part !== 'fore';
  const showFore = part !== 'upper';
  const xs = [sh[0], el[0], wr[0]];
  const ys = [sh[1], el[1], wr[1]];
  const bx0 = Math.min(...xs) - 50;
  const bx1 = Math.max(...xs) + 50;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-arm`} x1={bx0} y1={Math.min(...ys)} x2={bx1} y2={Math.max(...ys)} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={mix(SKIN.mid, SKIN.hi, b.key)} />
          <stop offset="0.45" stopColor={SKIN.mid} />
          <stop offset="1" stopColor={SKIN.deep} />
        </linearGradient>
      </defs>
      <path d={arm} fill={`url(#${id}-arm)`} />
      <Soft blur={6} op={0.55}>
        <path d={taper(el, wr, 16, 12)} fill={SKIN.deep} transform={`translate(${-L[0] * 16} ${-L[1] * 16})`} />
        <circle cx={el[0]} cy={el[1]} r={14} fill={SKIN.deep} />
      </Soft>
      <Soft blur={5} op={0.5 * b.key} blend="screen">
        <path d={taper(el, wr, 10, 8)} fill={KEY} transform={`translate(${L[0] * 20} ${L[1] * 20})`} />
      </Soft>
      <Soft blur={3} op={b.rim * 0.6} blend="screen">
        <path d={taper(el, wr, 6, 5)} fill={WARM} transform={`translate(${-L[0] * 22} ${-L[1] * 22})`} />
      </Soft>
      {/* short black sleeve */}
      {showUpper ? <path d={taper(sh, slv, 60, 52)} fill={TEE.base} /> : null}
      {showUpper ? (
        <Soft blur={8} op={0.5 * b.key} blend="screen">
          <path d={taper(sh, slv, 36, 30)} fill="#2E5A64" transform={`translate(${L[0] * 16} ${L[1] * 16})`} />
        </Soft>
      ) : null}
      {/* the rod: the puppeteer's control shows — it is part of the grammar */}
      {rodTo && showFore ? (
        <g>
          <line x1={wr[0]} y1={wr[1]} x2={rodTo[0]} y2={rodTo[1]} stroke="#08080A" strokeWidth={5.5} />
          <line x1={wr[0] - 1.6} y1={wr[1]} x2={rodTo[0] - 1.6} y2={rodTo[1]} stroke="#6FD8E0" strokeWidth={1.2} opacity={0.55 * b.key} />
          <line x1={wr[0] + 1.6} y1={wr[1]} x2={rodTo[0] + 1.6} y2={rodTo[1]} stroke={WARM} strokeWidth={1.2} opacity={0.5 * b.rim} />
          <circle cx={wr[0]} cy={wr[1]} r={7} fill="#1A1A1E" />
        </g>
      ) : null}
      {showFore ? (
      <g transform={`translate(${wr[0]} ${wr[1]}) rotate(${handTilt})`}>
        <g transform="translate(-4 -52) rotate(-10)">
          <rect x={-40} y={-86} width={80} height={152} rx={13} fill="#0A0A0C" />
          <rect x={-34} y={-80} width={68} height={140} rx={9} fill={mix('#1A2A36', '#EEF8FF', b.phone)} />
          <g opacity={b.phone}>
            <rect x={-24} y={-66} width={48} height={7} rx={3.5} fill="#90AEC4" />
            <rect x={-24} y={-48} width={32} height={5} rx={2.5} fill="#B0C6D6" />
            <text x={0} y={22} textAnchor="middle" fontFamily="Jost, sans-serif" fontWeight={900} fontSize={40} fill="#0E1620">
              ?
            </text>
          </g>
          <g filter={bl(20)} opacity={b.phone * 0.65} style={{mixBlendMode: 'screen'}}>
            <rect x={-44} y={-90} width={88} height={160} rx={14} fill="#CFE8FF" />
          </g>
        </g>
        <path d={blob([[-40, -30], [-18, -40], [20, -36], [40, -20], [42, 14], [30, 30], [-30, 30], [-44, 8]])} fill={SKIN.mid} />
        {[-26, -8, 10, 26].map((fx, i) => (
          <path key={i} d={blob(ellPts(fx, -44 + (i === 3 ? 4 : 0), 9, 14))} fill={mix(SKIN.mid, SKIN.base, 0.5 * b.key)} />
        ))}
        <path d={blob([[36, -8], [52, -30], [60, -54], [50, -60], [38, -40], [28, -20]])} fill={SKIN.base} />
        <g filter={bl(2)} opacity={0.5}>
          {[-17, 1, 18].map((gx) => (
            <line key={gx} x1={gx} y1={-56} x2={gx} y2={-30} stroke={SKIN.deep} strokeWidth={2.2} />
          ))}
        </g>
        <g filter={bl(6)} opacity={b.phone * 0.6} style={{mixBlendMode: 'screen'}}>
          <path d={blob(ellPts(0, -40, 36, 16))} fill="#CFE8FF" />
        </g>
      </g>
      ) : null}
    </g>
  );
};
