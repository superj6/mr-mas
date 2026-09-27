// J1 v5 PORT (prep-artbuild-r3, 2026-09-26): copied from src/dev/jumps/proto1/Certificate.tsx (the prototype stays frozen
// as the record); only the import paths changed. Shipped Act Four code must not import src/dev/ (ORGANIZATION-PLAN 5a).
// MR. MAS — style-jump prototype 1 · THE RECORD PRINTS: the certificate (1920 x 812, the room area at 1080p).
// One ink (#16302A, the tonal `engrave` ink) on ivory paper, graded to <= 75% luminance with falloff toward the edges,
// as if the laptop lit it. Built on the call grid's geometry (G5 at 4x): the vignette sits where his tile was (the eye
// lands on his face, not a new place), the cartouche takes the dialog's job (it names him), and the four board tiles
// become four signature seals at the foot of the sheet.
// Fix pass (lead review): it must read as a STOCK certificate, not a dollar bill, and CANCELLED must read whole at
// phone size. So the certificate's own formula carries the story -- THIS CERTIFIES THAT / MAS MANALT / HOLDS ____
// SHARES, the ruled blank long and plainly empty -- one serial (No. 1, top right; two in opposite corners is a
// banknote's), and the perforation runs across clean paper only, under the blank, clear of the portrait and the seals.
// Text is only the medium's own marks: NOPEAI · THIS CERTIFIES THAT · MAS MANALT · HOLDS · SHARES · No. 1. No date.
import React, {useMemo} from 'react';
import {FONT} from '../../../../../shared/theme/fonts';
import {engravedMasSvg, BUST_SCALE} from './bust';
import {laceRing, hypotrochoid, epitrochoid, wovenBand, rope} from '../../../../../shared/title/guilloche';
import {swellPath} from '../../../../../shared/title/common';
import {perforation} from './perforation';

export const CW = 1920, CH = 812;
export const PAPER = '#F5EFDA'; // ivory (the grade below takes it to <= 75% luminance)
export const INK = '#16302A';
/** each cut, final polish (the blind cold read: "solid black dots read as dot-matrix printing, not punched-through
 *  holes"). A cut shows three things a printed dot never does: the grid under the sheet (its blocks, in the sheet's
 *  shadow), the sheet's own shadow falling into the cut on the side away from the key (upper left), and the cut wall
 *  catching the key on the other side (a thin crescent of paper edge, lower right). No ink ring around it: ink is
 *  printing. */
export const CUT = {shadow: '#04060c', shadowOp: 0.8, shadowD: 2.8, wall: '#9a9582', wallOp: 0.95, wallD: 1.25};

// ------------------------------------------------------------------ layout (1080p px, room area)
const B = {outer: 16, band0: 26, band1: 62, inner: 70};
export const VIG = {cx: 356, cy: 386, rx: 186, ry: 248};
const CART = {cx: 1236};
/** HOLDS ________ SHARES: the certificate's formula, the ruled blank long and empty (the story: he owns nothing) */
const SH = {y: 442, holds: CART.cx - 446, b0: CART.cx - 268, b1: CART.cx + 146, shares: CART.cx + 446};
export const SEALS = [
  {cx: CART.cx - 285, id: 'door'},
  {cx: CART.cx - 95, id: 'page'},
  {cx: CART.cx + 95, id: 'spinner'},
  {cx: CART.cx + 285, id: 'square'},
] as const;
// the seals sit clear BELOW the word (the signatures stay at the foot of the sheet; the holes never land on a rim)
const SEAL_Y = 690, SEAL_R = 40;
// pitch 16 / dia 12: a punch die's pins, not a headline. The word is centred under the blank, on clean paper only:
// right of the vignette's frame, below the blank's rule, above the seals and clear of the counter.
export const PERF = {x0: CART.cx - 488, y0: 482, pitch: 16, dia: 12, track: 1};
const COUNTER = {cx: 1768, cy: 668, R: 58};

const TAU = Math.PI * 2;
const f2 = (n: number) => n.toFixed(2);

/** A woven lace band around an ellipse (m phase-shifted sines riding between two ellipses). */
const ellipseLace = (cx: number, cy: number, rx: number, ry: number, amp: number, n: number, m: number, steps = 1400) => {
  const out: string[] = [];
  for (let k = 0; k < m; k++) {
    const phi = (k / m) * TAU;
    const pts: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * TAU;
      const o = amp * Math.sin(n * t + phi);
      // offset along the ellipse normal
      const x = Math.cos(t) * rx, y = Math.sin(t) * ry;
      const nx = Math.cos(t) * ry, ny = Math.sin(t) * rx;
      const l = Math.hypot(nx, ny) || 1;
      pts.push(`${f2(cx + x + (nx / l) * o)} ${f2(cy + y + (ny / l) * o)}`);
    }
    out.push('M ' + pts.join(' L ') + ' Z');
  }
  return out.join(' ');
};

/** The security underprint (final polish): fine wavy lathe lines across the whole sheet inside the border (the
 *  vignette's paper covers it inside the oval), pale, so the cuts visibly interrupt printed lines at full size (a
 *  printed dot never cuts the print under it). A field, never a band: a band-shaped ribbon read as a grey wave at
 *  phone size in the fix pass; across the whole sheet it is a tint with no edge. */
const underprintField = () => {
  const out: string[] = [];
  const x0 = B.inner + 4, x1 = CW - B.inner - 4, y0 = B.inner + 6, y1 = CH - B.inner - 6;
  for (let k = 0, y = y0; y <= y1; k++, y += 5.2) {
    const pts: string[] = [];
    for (let x = x0; x <= x1; x += 8) pts.push(`${f2(x)} ${f2(y + 1.3 * Math.sin(x / 11 + k * 0.9) + 0.6 * Math.sin(x / 37 - k * 0.4))}`);
    out.push('M ' + pts.join(' L '));
  }
  return out.join(' ');
};

/** The vignette's field: horizontal engraved lines, swelling darker toward the oval's rim (a lit halo behind him). */
const vignetteField = () => {
  const {cx, cy, rx, ry} = VIG;
  const out: string[] = [];
  const gap = 3.6;
  for (let y = cy - ry; y <= cy + ry; y += gap) {
    const pts: [number, number][] = [];
    const ws: number[] = [];
    for (let x = cx - rx - 4; x <= cx + rx + 4; x += 5) {
      const dx = (x - (cx + 26)) / rx, dy = (y - (cy - 70)) / ry;
      const d = Math.min(1.4, Math.hypot(dx * 1.05, dy * 0.95));
      const t = Math.max(0, (d - 0.22) / 1.0); // 0 at the halo, 1 at the rim
      ws.push(0.3 + Math.pow(Math.min(1, t), 1.35) * 2.0);
      pts.push([x, y]);
    }
    out.push(swellPath(pts, ws, 0.2));
  }
  return out.join(' ');
};

// ------------------------------------------------------------------ seals: the four board tiles, as signature seals
const SealEmblem: React.FC<{id: string; cx: number; cy: number; r: number}> = ({id, cx, cy, r}) => {
  if (id === 'door') {
    // a doorway: the frame, the dark opening (cross-hatched), a threshold. Nobody in it.
    const w = r * 0.62, h = r * 1.12, x = cx - w / 2, y = cy - h * 0.52;
    return (
      <g>
        <rect x={x - 5} y={y - 5} width={w + 10} height={h + 5} fill="url(#j1-h45)" stroke={INK} strokeWidth={1.1} />
        <rect x={x} y={y} width={w} height={h} fill="url(#j1-x)" stroke={INK} strokeWidth={1.4} />
        <rect x={x + w * 0.16} y={y + h * 0.1} width={w * 0.68} height={h * 0.66} fill="none" stroke={PAPER} strokeWidth={0.9} />
        <line x1={x - 10} x2={x + w + 10} y1={y + h} y2={y + h} stroke={INK} strokeWidth={1.6} />
      </g>
    );
  }
  if (id === 'page') {
    // a glowing page: a sheet with ruled lines, rays engraved around it
    const w = r * 0.56, h = r * 0.74, x = cx - w / 2, y = cy - h / 2;
    const rays: string[] = [];
    for (let k = 0; k < 28; k++) {
      const a = (k / 28) * TAU;
      rays.push(`M ${f2(cx + Math.cos(a) * r * 0.5)} ${f2(cy + Math.sin(a) * r * 0.5)} L ${f2(cx + Math.cos(a) * r * 0.9)} ${f2(cy + Math.sin(a) * r * 0.9)}`);
    }
    return (
      <g>
        <path d={rays.join(' ')} stroke={INK} strokeWidth={0.8} />
        <rect x={x} y={y} width={w} height={h} fill={PAPER} stroke={INK} strokeWidth={1.4} />
        {[0.2, 0.34, 0.48, 0.62, 0.76].map((t, i) => (
          <line key={i} x1={x + w * 0.16} x2={x + w * (i === 4 ? 0.55 : 0.84)} y1={y + h * t} y2={y + h * t} stroke={INK} strokeWidth={1} />
        ))}
      </g>
    );
  }
  if (id === 'spinner') {
    // a loading spinner: eight engraved dots, graded
    return (
      <g>
        {Array.from({length: 8}, (_, k) => {
          const a = (k / 8) * TAU - Math.PI / 2;
          const rr = r * (0.07 + 0.012 * k);
          return <circle key={k} cx={cx + Math.cos(a) * r * 0.46} cy={cy + Math.sin(a) * r * 0.46} r={rr} fill={k > 3 ? 'url(#j1-x)' : 'url(#j1-h45)'} stroke={INK} strokeWidth={1.1} />;
        })}
      </g>
    );
  }
  // a black square (camera off): cross-hatched to near-solid
  const s = r * 0.78;
  return (
    <g>
      <rect x={cx - s / 2} y={cy - s / 2} width={s} height={s} fill="url(#j1-x)" stroke={INK} strokeWidth={1.4} />
      <rect x={cx - s / 2} y={cy - s / 2} width={s} height={s} fill="url(#j1-h135)" />
      <rect x={cx - s / 2 - 6} y={cy - s / 2 - 6} width={s + 12} height={s + 12} fill="none" stroke={INK} strokeWidth={0.8} />
    </g>
  );
};

const Seal: React.FC<{cx: number; cy: number; R: number; id: string; seed: number}> = ({cx, cy, R, id, seed}) => {
  const p = useMemo(
    () => ({
      teeth: laceRing(cx, cy, R - 4, 2.2, 72, 2),
      lace: laceRing(cx, cy, R * 0.82, 5.5, 26 + seed * 4, 5, {amp2: 1.5, n2: 60}),
      petal: epitrochoid(cx, cy, 1, 1 / 16, 0.06, 1, 2000, R * 0.7),
    }),
    [cx, cy, R, id, seed],
  );
  return (
    <g>
      <circle cx={cx} cy={cy} r={R} fill={PAPER} stroke={INK} strokeWidth={1.2} />
      <path d={p.teeth} fill="none" stroke={INK} strokeWidth={0.6} />
      <path d={p.lace} fill="none" stroke={INK} strokeWidth={0.42} />
      <path d={p.petal} fill="none" stroke={INK} strokeWidth={0.35} />
      <circle cx={cx} cy={cy} r={R * 0.64} fill={PAPER} stroke={INK} strokeWidth={1} />
      <circle cx={cx} cy={cy} r={R * 0.6} fill="none" stroke={INK} strokeWidth={0.5} />
      <SealEmblem id={id} cx={cx} cy={cy} r={R * 0.6} />
    </g>
  );
};

// ------------------------------------------------------------------ small engraved box: "No. 1"
const Serial: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g>
    <rect x={x} y={y} width={150} height={52} rx={6} fill={PAPER} stroke={INK} strokeWidth={1.8} />
    <rect x={x + 5} y={y + 5} width={140} height={42} rx={3} fill="none" stroke={INK} strokeWidth={0.6} />
    <text x={x + 44} y={y + 36} textAnchor="middle" fontFamily={FONT.title} fontStyle="italic" fontSize={22} fill={INK}>No.</text>
    <text x={x + 104} y={y + 40} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill={INK}>1</text>
  </g>
);

// ------------------------------------------------------------------ the counter medallion (bottom right): where a
// share count would sit, a guilloche rosette around an empty centre -- the blank, again, without a word
const Counter: React.FC<{cx: number; cy: number; R: number}> = ({cx, cy, R}) => {
  const p = useMemo(
    () => ({
      outer: laceRing(cx, cy, R - 8, 6, 40, 5, {amp2: 2, n2: 80}),
      petal: epitrochoid(cx, cy, 1, 1 / 20, 0.05, 1, 3000, R * 0.78),
      ring2: laceRing(cx, cy, R * 0.66, 6, 28, 6, {rot: 0.05}),
      star: hypotrochoid(cx, cy, 1, 0.26, 0.44, 13, 2600, R * 0.42),
    }),
    [cx, cy, R],
  );
  return (
    <g>
      <circle cx={cx} cy={cy} r={R + 3} fill={PAPER} stroke={INK} strokeWidth={1.4} />
      <circle cx={cx} cy={cy} r={R - 1} fill="none" stroke={INK} strokeWidth={0.5} />
      <path d={p.outer} fill="none" stroke={INK} strokeWidth={0.5} />
      <path d={p.petal} fill="none" stroke={INK} strokeWidth={0.45} />
      <path d={p.ring2} fill="none" stroke={INK} strokeWidth={0.45} />
      <circle cx={cx} cy={cy} r={R * 0.5} fill={PAPER} stroke={INK} strokeWidth={1.1} />
      <path d={p.star} fill="none" stroke={INK} strokeWidth={0.35} opacity={0.8} />
      <circle cx={cx} cy={cy} r={R * 0.2} fill={PAPER} stroke={INK} strokeWidth={0.9} />
    </g>
  );
};

// ------------------------------------------------------------------ the certificate
export interface CertProps {
  /** CANCELLED punched through (from beat 2). The cuts themselves are the host's (HOLES_CLIP + HoleRims). */
  perforated?: boolean;
  /** his one live motion: the pupils step one line toward the holes (beat 3) */
  pupilStep: boolean;
  /** show the grading overlay (debug: false = flat paper) */
  grade?: boolean;
}

export const Certificate: React.FC<CertProps> = ({pupilStep, grade = true}) => {
  const geo = useMemo(() => {
    const mid = (B.band0 + B.band1) / 2;
    const half = (B.band1 - B.band0) / 2 - 3;
    const c = 44; // corner square half-size
    return {
      bands: [
        wovenBand(B.band0 + c + 12, CW - B.band0 - c - 12, mid, half, 28, 6),
        wovenBand(B.band0 + c + 12, CW - B.band0 - c - 12, CH - mid, half, 28, 6),
        wovenBand(B.band0 + c + 12, CH - B.band0 - c - 12, mid, half, 28, 6, true),
        wovenBand(B.band0 + c + 12, CH - B.band0 - c - 12, CW - mid, half, 28, 6, true),
      ].join(' '),
      ropes: [
        rope(B.band0 + c + 12, CW - B.band0 - c - 12, mid, 3.2, 11),
        rope(B.band0 + c + 12, CW - B.band0 - c - 12, CH - mid, 3.2, 11),
        rope(B.band0 + c + 12, CH - B.band0 - c - 12, mid, 3.2, 11, true),
        rope(B.band0 + c + 12, CH - B.band0 - c - 12, CW - mid, 3.2, 11, true),
      ].join(' '),
      corners: [
        [mid + 6, mid + 6],
        [CW - mid - 6, mid + 6],
        [mid + 6, CH - mid - 6],
        [CW - mid - 6, CH - mid - 6],
      ].map(([x, y]) => ({x, y, a: laceRing(x, y, 27, 5, 16, 5), b: hypotrochoid(x, y, 1, 0.24, 0.42, 6, 1200, 19), c})),
      vigLace: ellipseLace(VIG.cx, VIG.cy, VIG.rx + 19, VIG.ry + 19, 7, 64, 4),
      vigTeeth: ellipseLace(VIG.cx, VIG.cy, VIG.rx + 30, VIG.ry + 30, 1.8, 180, 2),
      field: vignetteField(),
      underprint: underprintField(),
      under1: laceRing(CART.cx, 300, 250, 30, 30, 6, {amp2: 8, n2: 64}),
      under2: laceRing(CART.cx, 300, 180, 20, 44, 5),
    };
  }, []);

  // the bust: 0.54 px per unit; the cowlick just under the oval's top, the hoodie runs out through the bottom
  const bust = useMemo(() => engravedMasSvg(pupilStep, INK, PAPER), [pupilStep]);

  return (
    <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{display: 'block'}}>
      <defs>
        <pattern id="j1-face" width="10" height="3.4" patternUnits="userSpaceOnUse">
          <rect width="10" height="3.4" fill={PAPER} />
          <rect y="1.0" width="10" height="1.3" fill={INK} />
        </pattern>
        <pattern id="j1-face2" width="10" height="2.8" patternUnits="userSpaceOnUse">
          <rect width="10" height="2.8" fill={PAPER} />
          <rect y="0.8" width="10" height="1.05" fill={INK} />
        </pattern>
        <pattern id="j1-h45" width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="3.2" height="3.2" fill={PAPER} />
          <rect width="1.2" height="3.2" fill={INK} />
        </pattern>
        <pattern id="j1-h135" width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <rect width="1.1" height="3.2" fill={INK} />
        </pattern>
        <pattern id="j1-x" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <rect width="3" height="3" fill={PAPER} />
          <rect width="1.7" height="3" fill={INK} />
          <rect width="3" height="1.2" fill={INK} />
        </pattern>
        <clipPath id="j1-vig">
          <ellipse cx={VIG.cx} cy={VIG.cy} rx={VIG.rx} ry={VIG.ry} />
        </clipPath>
        <radialGradient id="j1-grade" cx={1000} cy={370} r={1300} gradientUnits="userSpaceOnUse">
          {/* neutral: the sheet's warmth is the paper's (and the fibre's) own, so it reads ivory, not khaki */}
          <stop offset="0" stopColor="#CECCC5" />
          <stop offset="0.45" stopColor="#BCBAB3" />
          <stop offset="0.8" stopColor="#83817E" />
          <stop offset="1" stopColor="#434147" />
        </radialGradient>
      </defs>

      {/* paper */}
      <rect width={CW} height={CH} fill={PAPER} />
      {/* the security underprint: a pale field of lathe lines across the sheet (the cuts interrupt it) */}
      <path d={geo.underprint} fill="none" stroke={INK} strokeWidth={0.42} opacity={0.2} />
      {/* security underprint behind the cartouche */}
      <path d={geo.under1} fill="none" stroke={INK} strokeWidth={0.45} opacity={0.35} />
      <path d={geo.under2} fill="none" stroke={INK} strokeWidth={0.45} opacity={0.3} />

      {/* ---------- border: the call window's frame, engraved ---------- */}
      <rect x={B.outer} y={B.outer} width={CW - 2 * B.outer} height={CH - 2 * B.outer} fill="none" stroke={INK} strokeWidth={2.6} />
      <rect x={B.outer + 5} y={B.outer + 5} width={CW - 2 * B.outer - 10} height={CH - 2 * B.outer - 10} fill="none" stroke={INK} strokeWidth={0.7} />
      <path d={geo.bands} fill="none" stroke={INK} strokeWidth={0.6} />
      <path d={geo.ropes} fill="none" stroke={INK} strokeWidth={0.85} />
      <rect x={B.inner - 5} y={B.inner - 5} width={CW - 2 * B.inner + 10} height={CH - 2 * B.inner + 10} fill="none" stroke={INK} strokeWidth={0.7} />
      <rect x={B.inner} y={B.inner} width={CW - 2 * B.inner} height={CH - 2 * B.inner} fill="none" stroke={INK} strokeWidth={2} />
      {geo.corners.map((c, i) => (
        <g key={i}>
          <rect x={c.x - 36} y={c.y - 36} width={72} height={72} fill={PAPER} stroke={INK} strokeWidth={1.4} />
          <rect x={c.x - 32} y={c.y - 32} width={64} height={64} fill="none" stroke={INK} strokeWidth={0.5} />
          <path d={c.a} fill="none" stroke={INK} strokeWidth={0.55} />
          <path d={c.b} fill="none" stroke={INK} strokeWidth={0.45} />
          <circle cx={c.x} cy={c.y} r={7} fill={PAPER} stroke={INK} strokeWidth={1} />
        </g>
      ))}

      {/* ---------- the vignette: his tile, engraved ---------- */}
      <path d={geo.vigTeeth} fill="none" stroke={INK} strokeWidth={0.6} />
      <path d={geo.vigLace} fill="none" stroke={INK} strokeWidth={0.55} />
      <ellipse cx={VIG.cx} cy={VIG.cy} rx={VIG.rx + 36} ry={VIG.ry + 36} fill="none" stroke={INK} strokeWidth={0.8} />
      <ellipse cx={VIG.cx} cy={VIG.cy} rx={VIG.rx + 9} ry={VIG.ry + 9} fill="none" stroke={INK} strokeWidth={2.2} />
      <ellipse cx={VIG.cx} cy={VIG.cy} rx={VIG.rx + 4} ry={VIG.ry + 4} fill="none" stroke={INK} strokeWidth={0.6} />
      <g clipPath="url(#j1-vig)">
        <rect x={VIG.cx - VIG.rx} y={VIG.cy - VIG.ry} width={VIG.rx * 2} height={VIG.ry * 2} fill={PAPER} />
        <path d={geo.field} fill={INK} />
        <g transform={`translate(${VIG.cx - 6} ${VIG.cy - 50}) scale(${BUST_SCALE})`} dangerouslySetInnerHTML={{__html: bust}} />
      </g>
      <ellipse cx={VIG.cx} cy={VIG.cy} rx={VIG.rx} ry={VIG.ry} fill="none" stroke={INK} strokeWidth={1.4} />

      {/* ---------- the cartouche: the dialog's job (it names him), in the certificate's own formula ---------- */}
      <g>
        <text x={CART.cx + 5} y={206} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={128} letterSpacing={16} fill={INK}>NOPEAI</text>
        <text x={CART.cx} y={201} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={128} letterSpacing={16} fill="url(#j1-face)" stroke={INK} strokeWidth={1.5}>NOPEAI</text>
      </g>
      <g stroke={INK}>
        <line x1={CART.cx - 420} x2={CART.cx - 22} y1={238} y2={238} strokeWidth={1.4} />
        <line x1={CART.cx + 22} x2={CART.cx + 420} y1={238} y2={238} strokeWidth={1.4} />
        <line x1={CART.cx - 380} x2={CART.cx - 22} y1={244} y2={244} strokeWidth={0.5} />
        <line x1={CART.cx + 22} x2={CART.cx + 380} y1={244} y2={244} strokeWidth={0.5} />
        <path d={`M ${CART.cx - 14} 241 L ${CART.cx} 229 L ${CART.cx + 14} 241 L ${CART.cx} 253 Z`} fill={PAPER} strokeWidth={1.2} />
      </g>
      {/* the title band: the formula every certificate opens with */}
      <text x={CART.cx} y={284} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={27} letterSpacing={9} fill={INK}>THIS CERTIFIES THAT</text>
      <g>
        <text x={CART.cx + 3} y={365} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} letterSpacing={12} fill={INK}>MAS MANALT</text>
        <text x={CART.cx} y={362} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} letterSpacing={12} fill="url(#j1-face2)" stroke={INK} strokeWidth={1.1}>MAS MANALT</text>
      </g>
      {/* HOLDS ________ SHARES: the story of the sheet (he owns nothing), so the blank is the longest thing under the
          name and nothing is written on it */}
      <text x={SH.holds} y={SH.y} fontFamily={FONT.title} fontWeight={700} fontSize={32} letterSpacing={8} fill={INK}>HOLDS</text>
      <line x1={SH.b0} x2={SH.b1} y1={SH.y + 1} y2={SH.y + 1} stroke={INK} strokeWidth={2} />
      <line x1={SH.b0 + 8} x2={SH.b1 - 8} y1={SH.y + 7} y2={SH.y + 7} stroke={INK} strokeWidth={0.6} />
      <line x1={SH.b0} x2={SH.b0} y1={SH.y - 9} y2={SH.y + 1} stroke={INK} strokeWidth={1.2} />
      <line x1={SH.b1} x2={SH.b1} y1={SH.y - 9} y2={SH.y + 1} stroke={INK} strokeWidth={1.2} />
      <g>
        <text x={SH.shares + 2} y={SH.y + 2} textAnchor="end" fontFamily={FONT.title} fontWeight={800} fontSize={46} letterSpacing={10} fill={INK}>SHARES</text>
        <text x={SH.shares} y={SH.y} textAnchor="end" fontFamily={FONT.title} fontWeight={800} fontSize={46} letterSpacing={10} fill="url(#j1-face2)" stroke={INK} strokeWidth={0.9}>SHARES</text>
      </g>

      {/* ---------- one serial, top right (a stock certificate is numbered once) ---------- */}
      <Serial x={CW - B.inner - 172} y={B.inner + 20} />

      <Counter cx={COUNTER.cx} cy={COUNTER.cy} R={COUNTER.R} />

      {/* ---------- the four seals (the board's tiles) ---------- */}
      {SEALS.map((s, i) => (
        <Seal key={s.id} cx={s.cx} cy={SEAL_Y} R={SEAL_R} id={s.id} seed={i + 1} />
      ))}

      {/* ---------- the grade: <= 75% luminance, falling off toward the edges ---------- */}
      {grade && <rect width={CW} height={CH} fill="url(#j1-grade)" style={{mixBlendMode: 'multiply'}} />}
      {/* CANCELLED is not drawn here: the holes are real cuts. The host puts the pixel frame the jump left (the
          click's frame, darkened) behind the sheet inside HOLES_CLIP, then <HoleRims> on top. The linework runs right
          up to each cut: no bare-paper halo. */}
    </svg>
  );
};

// ------------------------------------------------------------------ the perforation: real cuts through the sheet
export const PERF_HOLES = perforation('CANCELLED', PERF.x0, PERF.y0, PERF.pitch, PERF.dia, PERF.track).holes;
const circleD = (x: number, y: number, r: number) =>
  `M ${f2(x - r)} ${f2(y)} a ${f2(r)} ${f2(r)} 0 1 0 ${f2(2 * r)} 0 a ${f2(r)} ${f2(r)} 0 1 0 ${f2(-2 * r)} 0 Z`;
/** every hole as one path (1080p px, the room area) */
export const HOLES_D = PERF_HOLES.map((h) => circleD(h.x, h.y, h.r)).join(' ');
/** CSS clip-path covering every hole: what shows through is the grid the jump left */
export const HOLES_CLIP = `path('${HOLES_D}')`;

/**
 * Each cut, drawn over the grid seen through it and clipped to the holes: the sheet's shadow falling into the cut
 * (the hole minus itself shifted toward the lower right = a crescent on the upper left), and the cut wall lit on the
 * lower right (the hole minus itself shifted toward the upper left). Both are the hole's own geometry, so every cut
 * is the same cut.
 */
export const HoleRims: React.FC = () => {
  const d = useMemo(() => {
    const sh = PERF_HOLES.map((h) => circleD(h.x, h.y, h.r) + ' ' + circleD(h.x + CUT.shadowD, h.y + CUT.shadowD, h.r)).join(' ');
    const wa = PERF_HOLES.map((h) => circleD(h.x, h.y, h.r) + ' ' + circleD(h.x - CUT.wallD, h.y - CUT.wallD, h.r)).join(' ');
    return {sh, wa};
  }, []);
  return (
    <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{position: 'absolute', left: 0, top: 0, display: 'block'}}>
      <defs>
        <clipPath id="j1-holes"><path d={HOLES_D} /></clipPath>
      </defs>
      <g clipPath="url(#j1-holes)">
        <path d={d.sh} fill={CUT.shadow} fillRule="evenodd" opacity={CUT.shadowOp} />
        <path d={d.wa} fill={CUT.wall} fillRule="evenodd" opacity={CUT.wallOp} />
      </g>
    </svg>
  );
};
