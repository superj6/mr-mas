// ANIME SCENE props, drawn with the shared ink kit so line quality matches the rigs. Owned by animescene builder.
import React from 'react';
import {curve, ell, ink, Pt, prng} from '../ink';
import {LIGHT, NOLE_C} from '../palette';

// ---------------------------------------------------------------------------------------------- WATER GLASS
/**
 * Mas's glass of water, anime-prop style: no black outline (glass is drawn with light lines), cyan
 * refraction band on the monitor side, bright meniscus, caustic on the desk. Base centre at (0,0).
 * `ripple` exists only so the gag can prove it stays 0.
 */
export const WaterGlass: React.FC<{uid: string; light?: number; level?: number; warm?: number; ripple?: number; H?: number}> = ({uid, light = 1, level = 0.6, warm = 0, ripple = 0, H = 200}) => {
  const rt = H * 0.28;
  const rb = H * 0.235;
  const e = 0.2;
  const r = (y: number) => rb + (rt - rb) * (-y / H);
  const yw = -H * level;
  const rw = r(yw);
  const lt = Math.max(0, light);
  const id = (s: string) => `${uid}-${s}`;
  const sil = `M${-rt} ${-H}L${-rb} 0A${rb} ${rb * e} 0 0 0 ${rb} 0L${rt} ${-H}A${rt} ${rt * e} 0 0 0 ${-rt} ${-H}Z`;
  const water = `M${-rw} ${yw}L${-rb} 0A${rb} ${rb * e} 0 0 0 ${rb} 0L${rw} ${yw}A${rw} ${rw * e} 0 0 0 ${-rw} ${yw}Z`;
  // surface: front arc can carry a ripple (amplitude 0 in the scene, on purpose)
  const surfFront = Array.from({length: 13}, (_, i) => {
    const a = Math.PI * (i / 12);
    return [-Math.cos(a) * rw, yw + Math.sin(a) * rw * e + Math.sin(i * 1.9) * ripple] as Pt;
  });
  return (
    <g>
      <defs>
        <linearGradient id={id('w')} x1={-rb} y1="0" x2={rb} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#081B2E" stopOpacity={0.92} />
          <stop offset="0.45" stopColor="#0D3450" stopOpacity={0.8} />
          <stop offset="0.8" stopColor="#1B7896" stopOpacity={0.85} />
          <stop offset="1" stopColor="#57D8EE" stopOpacity={0.95} />
        </linearGradient>
        <linearGradient id={id('g')} x1="0" y1={-H} x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#A9E6FF" stopOpacity={0.1} />
          <stop offset="1" stopColor="#A9E6FF" stopOpacity={0.03} />
        </linearGradient>
        <filter id={id('b2')} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={2.2} />
        </filter>
        <filter id={id('b6')} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation={7} />
        </filter>
        <clipPath id={id('cw')}>
          <path d={water} />
        </clipPath>
      </defs>
      {/* contact shadow + cast shadow away from the monitor, caustic toward the left */}
      <path d={ell(-H * 0.12, 3, rb * 1.9, rb * e * 1.9)} fill="#02030A" opacity={0.7} filter={`url(#${id('b6')})`} />
      <path d={ell(-rb * 1.55, 5, rb * 0.75, rb * e * 0.8)} fill={LIGHT.key} opacity={0.55 * lt} filter={`url(#${id('b2')})`} />
      <path d={ell(-rb * 1.5, 5, rb * 0.3, rb * e * 0.35)} fill="#E6FDFF" opacity={0.7 * lt} filter={`url(#${id('b2')})`} />

      {/* glass body + back rim */}
      <path d={sil} fill={`url(#${id('g')})`} />
      <path d={`M${rt} ${-H}A${rt} ${rt * e} 0 0 0 ${-rt} ${-H}`} fill="none" stroke="#9FCDEB" strokeOpacity={0.45} strokeWidth={1.6} />

      {/* water */}
      <path d={water} fill={`url(#${id('w')})`} />
      <g clipPath={`url(#${id('cw')})`}>
        {/* refracted monitor: bright vertical band, flipped to the far side like real refraction */}
        <path d={`M${-rw * 0.72} ${yw}L${-rw * 0.5} ${yw}L${-rb * 0.46} 0L${-rb * 0.7} 0Z`} fill={LIGHT.key} opacity={0.5 * lt} />
        <path d={`M${rw * 0.6} ${yw}L${rw * 0.86} ${yw}L${rb * 0.84} 0L${rb * 0.56} 0Z`} fill="#CFFBFF" opacity={0.55 * lt} />
        {warm > 0 && <path d={`M${rw * 0.9} ${yw}L${rw} ${yw}L${rb} 0L${rb * 0.9} 0Z`} fill="#FFC58A" opacity={0.75 * warm} />}
        <path d={ell(0, -H * 0.06, rb * 0.8, rb * e * 1.2)} fill="#DFFBFF" opacity={0.35 * lt} filter={`url(#${id('b2')})`} />
      </g>
      {/* surface */}
      <path d={ell(0, yw, rw, rw * e)} fill="#5FD6EC" opacity={0.28 + 0.12 * lt} />
      <path d={ink([[-rw, yw], ...surfFront.slice(1, -1), [rw, yw]], 2.6, {a: 0.25, b: 0.25})} fill="#D8FDFF" opacity={0.95} />
      <path d={ink([[rw * 0.95, yw - 2], [rw * 0.5, yw - rw * e * 0.9], [-rw * 0.2, yw - rw * e], [-rw * 0.8, yw - rw * e * 0.5]], 1.4, {a: 0.4, b: 0.4})} fill="#BDEFFF" opacity={0.55} />

      {/* thick glass base */}
      <path d={`M${-rb} -2A${rb} ${rb * e} 0 0 0 ${rb} -2L${rb * 0.98} ${-H * 0.07}A${rb * 0.98} ${rb * e} 0 0 1 ${-rb * 0.98} ${-H * 0.07}Z`} fill="#BFF3FF" opacity={0.16} />
      <path d={ink([[-rb * 0.96, -H * 0.07], [0, -H * 0.07 + rb * e * 0.95], [rb * 0.96, -H * 0.07]], 1.6, {a: 0.3, b: 0.3})} fill="#CFF6FF" opacity={0.5} />

      {/* walls: light lines, brighter on the monitor side */}
      <path d={ink([[-rt, -H], [-(rt + rb) / 2, -H / 2], [-rb, 0]], 2.2, {a: 0.08, b: 0.1, tip: 0.3})} fill="#8FB7DA" opacity={0.7} />
      <path d={ink([[rt, -H], [(rt + rb) / 2, -H / 2], [rb, 0]], 3.2, {a: 0.05, b: 0.1, tip: 0.4})} fill="#CFFBFF" opacity={0.6 + 0.35 * lt} />
      <path d={`M${-rb} 0A${rb} ${rb * e} 0 0 0 ${rb} 0`} fill="none" stroke="#9FD8F0" strokeOpacity={0.6} strokeWidth={2} />
      <path d={ell(0, -H, rt, rt * e)} fill="none" stroke="#E4FAFF" strokeOpacity={0.8} strokeWidth={2.2} />
      <path d={ink([[rt * 0.2, -H + rt * e], [rt * 0.7, -H + rt * e * 0.6], [rt * 0.98, -H + 1]], 2.6, {a: 0.3, b: 0.2})} fill="#FFFFFF" opacity={0.9} />

      {/* anime highlight shapes: one tall sliver + one short, window side */}
      <path d={ink([[-rt * 0.52, -H * 0.9], [-rt * 0.5, -H * 0.6], [-rb * 0.52, -H * 0.18]], 7, {a: 0.25, b: 0.4, tip: 0})} fill="#FFFFFF" opacity={0.62} />
      <path d={ink([[-rt * 0.3, -H * 0.86], [-rt * 0.29, -H * 0.74]], 3.4, {a: 0.3, b: 0.3, tip: 0})} fill="#FFFFFF" opacity={0.5} />
      <path d={ink([[rt * 0.78, -H * 0.94], [rt * 0.74, -H * 0.55], [rb * 0.78, -H * 0.12]], 5, {a: 0.2, b: 0.35, tip: 0})} fill="#E8FEFF" opacity={0.5 + 0.4 * lt} />
    </g>
  );
};

// ---------------------------------------------------------------------------------------------- PHONE HAND
const SK = NOLE_C.skin;
const skinLine = NOLE_C.skinLine;

/**
 * Nole's phone thrust at the lens (screen toward camera). One held drawing: fingertips wrap the far edge,
 * thumb on the near edge, heel of the hand + forearm exit bottom-right. Phone centre at (0,0), upright.
 * The screen is the only emissive thing; the jab is sold with scale pops + smears in the shot, not new drawings.
 */
export const PhoneHand: React.FC<{uid: string; glow?: number; k?: number; night?: number}> = ({uid, glow = 1, k = 1, night = 0.35}) => {
  const id = (s: string) => `${uid}-${s}`;
  const W = 104;
  const Hh = 208;
  const rr = 30;
  const body = `M${-W + rr} ${-Hh}H${W - rr}Q${W} ${-Hh} ${W} ${-Hh + rr}V${Hh - rr}Q${W} ${Hh} ${W - rr} ${Hh}H${-W + rr}Q${-W} ${Hh} ${-W} ${Hh - rr}V${-Hh + rr}Q${-W} ${-Hh} ${-W + rr} ${-Hh}Z`;
  const i = 9;
  const s = {x0: -W + i, x1: W - i, y0: -Hh + i, y1: Hh - i, r: rr - 7};
  const scr = `M${s.x0 + s.r} ${s.y0}H${s.x1 - s.r}Q${s.x1} ${s.y0} ${s.x1} ${s.y0 + s.r}V${s.y1 - s.r}Q${s.x1} ${s.y1} ${s.x1 - s.r} ${s.y1}H${s.x0 + s.r}Q${s.x0} ${s.y1} ${s.x0} ${s.y1 - s.r}V${s.y0 + s.r}Q${s.x0} ${s.y0} ${s.x0 + s.r} ${s.y0}Z`;
  // hand parts (drawn behind the phone except fingertips + thumb, which overlap the edges)
  const PALM: Pt[] = [[-92, 120], [-112, 196], [-86, 262], [-20, 300], [70, 296], [134, 236], [132, 150], [96, 110]];
  const ARM: Pt[] = [[-40, 280, 1], [40, 300], [170, 470], [250, 700, 1], [420, 700, 1], [300, 420], [150, 220, 1]];
  const TIPS: Pt[][] = [
    [[-96, -104], [-122, -100], [-136, -80], [-132, -58], [-112, -48], [-96, -52]],
    [[-96, -34], [-126, -30], [-142, -8], [-138, 16], [-116, 26], [-96, 22]],
    [[-96, 40], [-122, 44], [-136, 64], [-132, 86], [-112, 96], [-96, 92]],
    [[-96, 110], [-114, 114], [-126, 130], [-122, 150], [-106, 158], [-94, 154]],
  ];
  const THUMB: Pt[] = [[150, 250, 1], [120, 140], [106, 60], [96, 16], [80, 2], [70, 22], [74, 86], [82, 170], [100, 240, 1]];
  const ln = (p: Pt[], w: number, o?: Parameters<typeof ink>[2]) => <path d={ink(p, w * k, o)} fill={skinLine} />;
  return (
    <g>
      <defs>
        <linearGradient id={id('scr')} x1="0" y1={s.y0} x2="0" y2={s.y1} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FBFDFF" />
          <stop offset="0.6" stopColor="#E3F1FF" />
          <stop offset="1" stopColor="#C7DDF5" />
        </linearGradient>
        <filter id={id('bl')} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={34} />
        </filter>
        <filter id={id('s6')} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={5} />
        </filter>
        <clipPath id={id('cs')}>
          <path d={scr} />
        </clipPath>
        <clipPath id={id('ca')}>
          <path d={curve(ARM)} />
          <path d={curve(PALM)} />
        </clipPath>
      </defs>
      {/* forearm + palm heel */}
      <path d={curve(ARM)} fill={SK.base} />
      <path d={curve(PALM)} fill={SK.base} />
      <g clipPath={`url(#${id('ca')})`}>
        <path d={curve([[120, 150], [300, 300], [440, 720], [220, 720], [120, 420], [40, 300]])} fill={SK.shade} />
        <path d={curve([[-120, 170], [40, 180], [120, 230], [60, 330], [-80, 320]])} fill={SK.shade} opacity={0.85} />
        <path d={curve([[-60, 250], [60, 280], [150, 420], [120, 470], [20, 330]])} fill={SK.hi} opacity={0.45} filter={`url(#${id('s6')})`} />
      </g>
      {ln([[-112, 196], [-86, 262], [-20, 300], [40, 300], [170, 470], [250, 700]], 3.4, {a: 0.1, b: 0.05})}
      {ln([[132, 150], [150, 220], [300, 420], [420, 700]], 3.6, {a: 0.1, b: 0.05})}
      <path d={ink([[-50, 270], [10, 286], [60, 280]], 1.6 * k, {a: 0.4, b: 0.4})} fill={NOLE_C.skinLineSoft} opacity={0.7} />

      {/* phone glow (behind + in front) */}
      <path d={ell(0, 0, W * 1.5, Hh * 1.25)} fill="#DDF1FF" opacity={0.28 * glow} filter={`url(#${id('bl')})`} />
      {/* phone body */}
      <path d={body} fill="#111217" />
      <path d={body} fill="none" stroke="#3C3F4C" strokeWidth={3} />
      <path d={scr} fill={`url(#${id('scr')})`} opacity={0.55 + 0.45 * glow} />
      <g clipPath={`url(#${id('cs')})`}>
        {/* notes-app screen: the receipt he is so proud of */}
        <rect x={-26} y={s.y0 + 8} width={52} height={14} rx={7} fill="#111217" />
        <rect x={s.x0 + 18} y={s.y0 + 12} width={30} height={6} rx={3} fill="#1B2230" opacity={0.7} />
        <rect x={s.x1 - 44} y={s.y0 + 12} width={26} height={6} rx={3} fill="#1B2230" opacity={0.7} />
        <text x={s.x0 + 16} y={-120} fontFamily="Jost, sans-serif" fontWeight={700} fontSize={23} fill="#E0A21A">
          ‹ Notes
        </text>
        <text x={s.x0 + 16} y={-86} fontFamily="Jost, sans-serif" fontWeight={400} fontSize={14} fill="#6E7688">
          Dec 11, 2015 · 3:12 AM
        </text>
        <rect x={s.x0 + 10} y={-64} width={158} height={38} rx={4} fill="#FFE45C" opacity={0.85} transform="rotate(-2)" />
        <text x={s.x0 + 16} y={-35} fontFamily="Jost, sans-serif" fontWeight={900} fontSize={30} letterSpacing={-0.5} fill="#12151C">
          THE NAME
        </text>
        <text x={s.x0 + 16} y={-2} fontFamily="Jost, sans-serif" fontWeight={700} fontSize={19} fill="#12151C">
          (mine)
        </text>
        {[20, 42, 64, 86, 118, 140].map((y, j) => (
          <rect key={j} x={s.x0 + 16} y={y} width={[150, 128, 140, 86, 146, 110][j]} height={8} rx={4} fill="#9AA3B6" opacity={0.55} />
        ))}
        {/* glare */}
        <path d={`M${s.x0 - 40} ${s.y0 + 150}L${s.x1 + 40} ${s.y0 - 20}L${s.x1 + 40} ${s.y0 + 40}L${s.x0 - 40} ${s.y0 + 230}Z`} fill="#FFFFFF" opacity={0.35} />
        <path d={`M${s.x0 - 40} ${s.y0 + 250}L${s.x1 + 40} ${s.y0 + 80}L${s.x1 + 40} ${s.y0 + 96}L${s.x0 - 40} ${s.y0 + 266}Z`} fill="#FFFFFF" opacity={0.22} />
      </g>
      <path d={ink([[-W + 6, -Hh + rr], [-W + 6, Hh - rr]], 2.4, {a: 0.05, b: 0.05, tip: 0.6})} fill={LIGHT.key} opacity={0.7} />
      <path d={ink([[W - 5, -Hh + rr], [W - 5, Hh - rr]], 3, {a: 0.05, b: 0.05, tip: 0.6})} fill="#FFC48A" opacity={0.85} />

      {/* fingertips over the far edge */}
      {TIPS.map((t, j) => {
        const d = curve(t);
        return (
          <g key={j}>
            <path d={d} fill={SK.base} />
            <defs>
              <clipPath id={id(`t${j}`)}>
                <path d={d} />
              </clipPath>
            </defs>
            <g clipPath={`url(#${id(`t${j}`)})`}>
              <path d={curve([[-150, t[3][1] - 8], [-90, t[3][1] - 14], [-90, t[4][1] + 30], [-150, t[4][1] + 30]])} fill={SK.shade} />
              <path d={ell(t[2][0] + 8, t[2][1] - 6, 9, 6)} fill={SK.hi} opacity={0.8} filter={`url(#${id('s6')})`} />
            </g>
            {ln(t.slice(0, 5), 2.9, {a: 0.15, b: 0.3, press: [0.7, 1, 1.2, 1.1, 0.8]})}
            <path d={ink([[t[1][0] + 6, t[1][1] + 4], [t[1][0] + 16, t[1][1] + 6]], 1.5 * k, {a: 0.4, b: 0.4})} fill={NOLE_C.skinLineSoft} opacity={0.7} />
          </g>
        );
      })}
      {/* thumb on the near edge */}
      <path d={curve(THUMB)} fill={SK.base} />
      <defs>
        <clipPath id={id('cth')}>
          <path d={curve(THUMB)} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id('cth')})`}>
        <path d={curve([[96, -10], [140, 40], [160, 260], [100, 260], [92, 120]])} fill={SK.shade} />
        <path d={ell(80, 30, 8, 18)} fill={SK.hi} opacity={0.8} filter={`url(#${id('s6')})`} />
      </g>
      {ln([[100, 240], [82, 170], [74, 86], [70, 22], [80, 2], [96, 16]], 3, {a: 0.1, b: 0.3, press: [1, 1, 0.9, 1.1, 0.9]})}
      {ln([[106, 60], [120, 140], [150, 250]], 2.6, {a: 0.2, b: 0.1})}
      <path d={ink([[74, 32], [86, 28]], 1.6 * k, {a: 0.4, b: 0.4})} fill={NOLE_C.skinLineSoft} opacity={0.8} />
      {/* night multiply on the skin only would need a matte; a flat multiply over the hand is close enough */}
      <path d={curve(ARM)} fill="#6A6FA8" opacity={night * 0.35} style={{mixBlendMode: 'multiply'}} />
    </g>
  );
};

// ---------------------------------------------------------------------------------------------- DOORWAY SILHOUETTE
/**
 * Nole, full figure, backlit in the doorway (low angle, striding in toward screen-left, phone thrust
 * forward). One held silhouette drawing built from designed parts (V-taper torso, bent front knee,
 * trailing back leg) so it reads in a split second. Interior detail is deliberately withheld: only the
 * rim, the phone glow and a smirk glint. Feet at y=0, crown ~ -700.
 */
const limb = (pts: Pt[], w0: number, w1: number) => ink(pts, w0, {a: 0.01, b: 0.01, tip: 1, press: [1, (w0 + w1) / 2 / w0, w1 / w0]});
export const DOOR_PARTS = (): string[] => [
  // hair (swept back) + skull + face profile
  curve([[-82, -642], [-66, -684], [-16, -698], [36, -684], [60, -652], [56, -620], [30, -598], [-10, -606], [-50, -622]]),
  curve([[-40, -690], [6, -676], [8, -620], [-10, -576], [-50, -556, 1], [-80, -562, 1], [-88, -574], [-86, -586], [-98, -598, 1], [-86, -618], [-84, -646]]),
  curve([[-58, -574], [-14, -600], [32, -592], [36, -548, 1], [-66, -544, 1]]),
  // torso: square shoulders, V-taper, slight forward lean
  curve([[-70, -566], [-152, -552], [-178, -524, 1], [-150, -452], [-94, -330], [-98, -268, 1], [92, -268, 1], [84, -330], [112, -456], [146, -522, 1], [122, -552], [40, -566]]),
  // front arm thrust forward-up, fist
  limb([[-150, -526], [-234, -552], [-302, -588]], 48, 32),
  curve([[-296, -608], [-330, -606], [-340, -588], [-330, -570], [-300, -572]]),
  // back arm, trailing
  limb([[134, -522], [196, -446], [240, -380]], 42, 30),
  curve([[226, -384], [256, -380], [262, -356], [244, -342], [226, -352]]),
  // legs: front knee bent forward, back leg trailing, heel lifted
  limb([[-50, -290], [-122, -150], [-152, -26]], 66, 44),
  curve([[-176, -36], [-128, -40], [-124, 2, 1], [-232, 8, 1], [-240, -4], [-204, -24]]),
  limb([[58, -290], [84, -150], [110, -32]], 64, 42),
  curve([[88, -40], [132, -36], [146, -8], [136, 6, 1], [74, 9, 1], [68, -2]]),
];

export const DoorNole: React.FC<{uid: string; glow?: number; rim?: number; smirk?: number}> = ({uid, glow = 1, rim = 1, smirk = 1}) => {
  const id = (s: string) => `${uid}-${s}`;
  const parts = DOOR_PARTS();
  return (
    <g>
      <defs>
        <filter id={id('eg')} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feMorphology in="SourceAlpha" operator="erode" radius={3.4} result="er" />
          <feComposite in="SourceAlpha" in2="er" operator="out" result="band" />
          <feGaussianBlur in="band" stdDeviation={1.5} result="bb" />
          <feComposite in="bb" in2="SourceAlpha" operator="in" result="bin" />
          <feFlood floodColor="#FFD7A0" floodOpacity={rim} />
          <feComposite in2="bin" operator="in" result="rim" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="rim" />
          </feMerge>
        </filter>
        <filter id={id('pg')} x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation={16} />
        </filter>
        <linearGradient id={id('body')} x1="0" y1="-700" x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#140B10" />
          <stop offset="1" stopColor="#07050A" />
        </linearGradient>
      </defs>
      <g filter={`url(#${id('eg')})`} fill={`url(#${id('body')})`}>
        {parts.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      {/* the only interior drawing: hair sheen, cheek plane, the smirk glint (the one note of satire in the dark) */}
      <path d={ink([[-66, -680], [-20, -694], [26, -682], [52, -656]], 4.5, {a: 0.3, b: 0.4})} fill="#FFCF94" opacity={0.6 * rim} />
      <path d={ink([[-76, -616], [-66, -618], [-58, -614]], 2.4, {a: 0.3, b: 0.3})} fill="#FFE6C4" opacity={0.5 * rim} />
      <path d={ink([[-86, -577], [-78, -573], [-70, -575], [-63, -582]], 2.4, {a: 0.3, b: 0.5})} fill="#FFF6E6" opacity={0.9 * smirk} />
      <path d={ink([[-150, -548], [-100, -560], [-60, -560]], 3, {a: 0.3, b: 0.5})} fill="#FFCF94" opacity={0.35 * rim} />
      {/* phone: its screen faces Mas, so we see the glow spill, not the face */}
      <path d={ell(-352, -640, 64, 74)} fill="#D9F0FF" opacity={0.65 * glow} filter={`url(#${id('pg')})`} />
      <path d="M-346 -676 L-318 -672 L-314 -604 L-342 -608 Z" fill="#0B0C12" />
      <path d="M-346 -676 L-342 -608" stroke="#E9F7FF" strokeWidth={3.6} opacity={0.95 * glow} />
      <path d={ell(-322, -600, 18, 14)} fill="#0C080B" />
    </g>
  );
};

/** Warm dust motes drifting in a light beam (deterministic). */
export const BeamMotes: React.FC<{t: number; n?: number; box: [number, number, number, number]; seed?: number; color?: string; size?: number; opacity?: number}> = ({t, n = 40, box, seed = 3, color = '#FFE2B8', size = 1, opacity = 1}) => {
  const r = prng(seed);
  const [bx, by, bw, bh] = box;
  return (
    <g>
      {Array.from({length: n}, (_, i) => {
        const x0 = r() * bw;
        const y0 = r() * bh;
        const sp = 0.3 + r() * 0.8;
        const rad = (0.8 + r() * 2.4) * size;
        const ph = r() * 6.28;
        const x = bx + ((x0 - t * sp * 0.9 + Math.sin(t * 0.06 + ph) * 10 + bw * 8) % bw);
        const y = by + ((y0 + t * sp * 0.35 + bh * 4) % bh);
        const o = (0.3 + 0.6 * (0.5 + 0.5 * Math.sin(t * 0.09 + ph))) * opacity;
        return <circle key={i} cx={x} cy={y} r={rad} fill={color} opacity={o} />;
      })}
    </g>
  );
};
