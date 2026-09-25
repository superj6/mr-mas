import React from 'react';
import {Shape, Line, Fill, Figure} from '../draw/Shape';
import {useLook} from '../theme/LookContext';
import {ellipse} from '../draw/geom';

/**
 * MAS MANALT: bust rig, three-quarter view facing screen-right.
 * Local units: head centre ~(0,0); cowlick tip ~y-225; bust crop at y 540.
 * Design anchors (every era): grey hoodie, BIG calm unblinking eyes, a forward cowlick,
 * a tiny closed smile, a small frame under a big head. Shape language: soft circles (earnest, harmless).
 */
export interface MasProps {
  /** Pupil offset, -1..1. x>0 looks screen-right (toward his monitor), x<0 toward camera-left. */
  lookX?: number;
  lookY?: number;
  /** 0 = wide open (default "unblinking") .. 1 = closed. */
  lid?: number;
  mouth?: 'closed' | 'smirk' | 'o' | 'flat';
  /** Brow lift, -1 furrowed .. 1 raised. */
  brow?: number;
  tilt?: number;
}

export const MAS_COLORS = {
  skin: '#F0C9A9',
  lid: '#E0AE90',
  hair: '#5E4632',
  hairLight: '#7A5C42',
  hoodie: '#8F939B',
  hoodieDeep: '#62666F',
  string: '#EEEEEE',
  iris: '#6F9A68',
  mouth: '#A24E47',
};
const C = MAS_COLORS;


export const Mas: React.FC<MasProps> = ({lookX = 0.1, lookY = 0.05, lid = 0.06, mouth = 'closed', brow = 0.25, tilt = 0}) => {
  const look = useLook();
  const soft = look.id !== 'onebit' && look.id !== 'news';
  const eyes = [
    {cx: 0, cy: 4, rx: 31, ry: 35},
    {cx: 84, cy: 0, rx: 23, ry: 33},
  ];
  return (
    <Figure outline={7}>
      {/* ---------- hood (behind neck) ---------- */}
      <Shape
        d="M -128 250 C -150 186 -76 150 8 176 C 92 150 166 186 146 252 C 100 270 -80 272 -128 250 Z"
        fill={C.hoodie}
        shadow="M -128 250 C -150 186 -76 150 8 176 C -40 186 -80 214 -84 262 Z"
        stroke={6}
      />
      {/* ---------- torso ---------- */}
      <Shape
        d="M -206 540 C -214 390 -192 282 -116 240 C -64 214 72 212 132 238 C 204 276 224 390 222 540 Z"
        fill={C.hoodie}
        shadow="M -206 540 C -214 390 -192 282 -116 240 L -70 232 C -118 290 -126 420 -104 540 Z"
        highlight="M 150 252 C 198 284 214 360 218 450 L 202 450 C 196 370 184 300 146 270 Z"
        stroke={7}
      />
      <Line d="M -150 318 C -160 380 -164 450 -160 536" width={3.5} opacity={0.55} />
      <Line d="M 172 318 C 184 380 188 450 186 536" width={3.5} opacity={0.55} />
      {/* ---------- neck ---------- */}
      <Shape d="M -36 118 C -32 160 -30 200 -26 232 L 52 232 C 50 196 52 160 60 124 Z" fill={C.skin} shadow="M -36 118 L 60 124 L 58 176 C 22 190 -16 184 -34 162 Z" stroke={5} />
      {/* ---------- hood front collar + opening ---------- */}
      <Shape
        d="M -118 236 C -96 206 -40 212 10 236 C 62 210 124 204 142 236 C 128 262 72 266 12 262 C -48 268 -106 264 -118 236 Z"
        fill={C.hoodie}
        shadow="M -118 236 C -96 206 -40 212 10 236 C -40 240 -80 250 -100 258 Z"
        stroke={6}
      />
      <Fill d="M -30 228 C -4 250 34 250 58 228 C 44 256 -14 258 -30 228 Z" fill={C.hoodieDeep} />
      {/* drawstrings */}
      <Line d="M -4 254 C -8 292 -12 322 -14 352" width={7} color={C.string} />
      <Line d="M 40 254 C 44 290 48 314 50 342" width={7} color={C.string} />
      <Shape d="M -22 348 h 15 v 26 h -15 Z" fill="#BCC0C7" stroke={3} />
      <Shape d="M 43 338 h 15 v 26 h -15 Z" fill="#BCC0C7" stroke={3} />

      <g transform={`rotate(${tilt} 10 140)`}>
        {/* ---------- ear ---------- */}
        <Shape d="M -100 -14 C -132 -26 -142 32 -120 56 C -106 70 -88 60 -84 44 Z" fill={C.skin} shadow="M -114 -4 C -124 18 -120 42 -108 52 L -96 38 C -104 26 -104 10 -100 -2 Z" stroke={5} />
        <Line d="M -106 4 C -116 16 -114 34 -104 42" width={3} opacity={0.6} />
        {/* ---------- head ---------- */}
        <Shape
          d="M 8 -166 C 92 -166 142 -110 142 -30 C 142 30 124 80 92 118 C 70 144 46 160 22 162 C -6 162 -32 150 -54 130 C -94 96 -128 40 -132 -30 C -134 -110 -72 -166 8 -166 Z"
          fill={C.skin}
          shadow="M -132 -30 C -128 40 -94 96 -54 130 C -32 150 -6 162 22 162 C -16 152 -54 124 -78 82 C -98 44 -106 -8 -106 -60 C -120 -60 -132 -52 -132 -30 Z"
          highlight="M 116 -60 C 128 -26 130 12 122 46 C 116 16 112 -22 102 -54 Z"
          stroke={6}
        />
        {soft && <Fill d={ellipse(98, 58, 22, 12)} fill="#EBA38F" opacity={0.32} />}
        {soft && <Fill d={ellipse(-14, 62, 20, 11)} fill="#EBA38F" opacity={0.22} />}
        {/* ---------- eyes: the signature ---------- */}
        {eyes.map((e, i) => {
          const irisR = e.ry * 0.62;
          const px = e.cx + lookX * e.rx * 0.42;
          const py = e.cy + 3 + lookY * e.ry * 0.3;
          const lidY = e.cy - e.ry + lid * e.ry * 2;
          const clip = `mas-eye-${i}-${Math.round(e.cx)}`;
          return (
            <g key={i}>
              <defs>
                <clipPath id={clip}>
                  <path d={ellipse(e.cx, e.cy, e.rx, e.ry)} />
                </clipPath>
              </defs>
              <Shape d={ellipse(e.cx, e.cy, e.rx, e.ry)} fill="#FFFFFF" stroke={4} />
              <g clipPath={`url(#${clip})`}>
                <Fill d={ellipse(px, py, irisR * (e.rx / e.ry) * 1.05, irisR)} fill={C.iris} />
                <Fill d={ellipse(px + 1, py + 2, irisR * 0.55 * (e.rx / e.ry), irisR * 0.62)} fill="#3E5E40" opacity={0.5} />
                <Fill d={ellipse(px, py, irisR * 0.45 * (e.rx / e.ry), irisR * 0.47)} fill="#14171B" />
                <Fill d={ellipse(px + irisR * 0.35, py - irisR * 0.42, irisR * 0.26, irisR * 0.26)} fill="#FFFFFF" raw />
                <Fill d={ellipse(px - irisR * 0.3, py + irisR * 0.4, irisR * 0.11, irisR * 0.11)} fill="#FFFFFF" raw opacity={0.8} />
                {lid > 0.01 && (
                  <Fill d={`M ${e.cx - e.rx - 4} ${e.cy - e.ry - 6} H ${e.cx + e.rx + 4} V ${lidY} C ${e.cx + e.rx * 0.5} ${lidY + 6} ${e.cx - e.rx * 0.5} ${lidY + 6} ${e.cx - e.rx - 4} ${lidY} Z`} fill={C.lid} />
                )}
              </g>
              {/* heavy upper lash line, thin lower lid */}
              <Line d={`M ${e.cx - e.rx - 3} ${lidY + e.ry * 0.28} C ${e.cx - e.rx * 0.6} ${lidY - 2} ${e.cx + e.rx * 0.5} ${lidY - 3} ${e.cx + e.rx + 5} ${lidY + e.ry * 0.22}`} width={7} />
              <Line d={`M ${e.cx - e.rx * 0.7} ${e.cy + e.ry + 5} C ${e.cx - e.rx * 0.2} ${e.cy + e.ry + 10} ${e.cx + e.rx * 0.35} ${e.cy + e.ry + 9} ${e.cx + e.rx * 0.75} ${e.cy + e.ry + 3}`} width={2.4} opacity={0.45} />
              {/* lid crease */}
              <Line d={`M ${e.cx - e.rx * 0.7} ${e.cy - e.ry - 9} C ${e.cx - e.rx * 0.1} ${e.cy - e.ry - 16} ${e.cx + e.rx * 0.5} ${e.cy - e.ry - 14} ${e.cx + e.rx * 0.9} ${e.cy - e.ry - 6}`} width={2.4} opacity={0.4} />
            </g>
          );
        })}
        {/* brows: thin, lifted at the inner end (earnest) */}
        <Line d={`M -36 ${-58 - brow * 6} C -18 ${-70 - brow * 12} 6 ${-74 - brow * 12} 26 ${-66 - brow * 10}`} width={8} color={C.hair} />
        <Line d={`M 62 ${-70 - brow * 10} C 80 ${-76 - brow * 12} 98 ${-72 - brow * 9} 112 ${-60 - brow * 5}`} width={7} color={C.hair} />
        {/* nose: a single confident line + nostril */}
        <Fill d="M 52 -4 C 54 16 54 40 50 56 C 56 58 60 58 64 56 C 60 38 56 14 52 -4 Z" fill={C.lid} opacity={0.55} />
        <Line d="M 56 -2 C 64 18 72 36 76 50 C 72 58 62 61 52 57" width={3.6} />
        <Fill d={ellipse(62, 54, 4, 2.6)} fill="#8A5A4A" opacity={0.6} />
        {/* mouth */}
        {mouth === 'closed' && <Line d="M 30 100 C 42 108 58 108 72 98" width={4.2} />}
        {mouth === 'smirk' && <Line d="M 30 102 C 44 108 60 104 76 90" width={4.2} />}
        {mouth === 'flat' && <Line d="M 32 102 C 46 104 58 104 70 100" width={4.2} />}
        {mouth === 'o' && <Shape d={ellipse(50, 104, 10, 12)} fill={C.mouth} stroke={4} />}
        <Line d="M 70 96 C 74 98 76 101 76 104" width={2.4} opacity={0.5} />
        {/* ---------- hair: short, messy fringe ---------- */}
        <Shape
          d="M -136 -18 C -152 -92 -120 -176 -30 -194 C 32 -206 104 -190 136 -142 C 150 -120 150 -98 142 -84 Q 132 -72 118 -90 Q 104 -70 88 -94 Q 72 -76 58 -102 Q 42 -84 24 -106 Q 14 -94 4 -98 C -20 -102 -50 -92 -74 -72 C -92 -58 -100 -32 -104 -12 C -114 -8 -126 -8 -136 -18 Z"
          fill={C.hair}
          shadow="M -136 -18 C -152 -92 -120 -176 -30 -194 C -76 -168 -96 -124 -94 -66 C -100 -40 -108 -14 -136 -18 Z"
          highlight="M 10 -178 C 62 -186 108 -168 126 -138 C 96 -156 54 -164 10 -162 Z"
          stroke={6}
        />
        {/* the cowlick: flicks forward, like it's already moving toward the future */}
        <Shape
          d="M 58 -182 C 70 -232 122 -242 150 -212 C 128 -214 110 -206 102 -192 C 120 -196 140 -186 146 -170 C 118 -182 88 -184 58 -182 Z"
          fill={C.hair}
          highlight="M 90 -214 C 104 -228 126 -228 140 -216 C 124 -216 108 -212 96 -204 Z"
          stroke={6}
        />
        <Line d="M -40 -170 C -4 -160 40 -150 70 -126" width={3} opacity={0.45} color={C.hairLight} />
        <Line d="M -86 -150 C -80 -120 -80 -96 -88 -74" width={3} opacity={0.45} color={C.hairLight} />
      </g>
    </Figure>
  );
};
