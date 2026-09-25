import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../theme/fonts';
import {Grain, Paper} from '../fx/Grain';
import {buildSkyline} from './skyline';
import {fieldOf, useCanvasDraw} from './raster';
import {epitrochoid, hypotrochoid, laceRing, rope, wovenBand} from './guilloche';
import {H, TitleProps, W, clamp, easeOut, layoutWordmark, rng, smooth, swellPath, useFontsReady, useTitleFrame} from './common';

/**
 * title-engrave — MR. MAS as a STOCK CERTIFICATE. Procedural guilloché border, corner rosettes,
 * medallions and seal (SVG); the cathedral vignette is a real line engraving generated from a tone
 * painting (variable-width lines + crosshatch, canvas); THE ORB is an engraved sphere with a
 * spirograph iris; red numbering-ink serials and the subtitle.
 */
const PAPER = '#EFE8D3';
const INK = '#17302A';
const GREEN = '#2F6B53';
const UNDER = '#A9C4B5';
const RED = '#B3322A';
const PEN = '#1D2440';

const B0 = 46; // outer border inset
const B1 = 120; // inner border inset

// ---------------- engraved vignette (canvas) ----------------
const VW = 640;
const VH = 222;
const Vignette: React.FC<{ready: boolean; f: number}> = ({ready, f}) => {
  const sky = useMemo(() => buildSkyline({seed: 41, width: VW, ground: VH - 16, cx: VW / 2, u: 0.2, x0: -20, x1: VW + 20}), []);
  const ref = useCanvasDraw(
    ready,
    (cv) => {
      const c = cv.getContext('2d')!;
      const SS = 2; // supersample the engraving
      const w = VW * SS;
      const h = VH * SS;
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.clearRect(0, 0, w, h);
      const rose = sky.rose;
      const tone = fieldOf(w, h, (t) => {
        t.scale(SS, SS);
        const g = t.createLinearGradient(0, 0, 0, VH);
        g.addColorStop(0, '#6A6A6A');
        g.addColorStop(0.55, '#B4B4B4');
        g.addColorStop(0.9, '#F4F4F4');
        t.fillStyle = g;
        t.fillRect(0, 0, VW, VH);
        const rg = t.createRadialGradient(rose.cx, rose.cy, 2, rose.cx, rose.cy, 230);
        rg.addColorStop(0, 'rgba(255,255,255,1)');
        rg.addColorStop(0.5, 'rgba(255,255,255,0.35)');
        rg.addColorStop(1, 'rgba(255,255,255,0)');
        t.fillStyle = rg;
        t.fillRect(0, 0, VW, VH);
        // sunburst rays (the classic certificate vignette device)
        const R = rng(8);
        for (let k = 0; k < 26; k++) {
          const a = -Math.PI + ((k + 0.5) / 26) * Math.PI;
          const ww = 0.028 + R() * 0.012;
          t.fillStyle = k % 2 ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.16)';
          t.beginPath();
          t.moveTo(rose.cx, rose.cy);
          t.lineTo(rose.cx + Math.cos(a - ww) * 700, rose.cy + Math.sin(a - ww) * 700);
          t.lineTo(rose.cx + Math.cos(a + ww) * 700, rose.cy + Math.sin(a + ww) * 700);
          t.fill();
        }
        // cloud banks
        t.fillStyle = 'rgba(0,0,0,0.22)';
        for (const [x, y, rx, ry] of [
          [90, 70, 120, 14],
          [540, 58, 130, 12],
          [120, 118, 90, 9],
          [520, 110, 100, 9],
        ]) {
          t.beginPath();
          t.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
          t.fill();
        }
        t.fillStyle = '#7C7C7C';
        t.fill(new Path2D(sky.far));
        t.strokeStyle = '#111';
        t.lineWidth = 1.3;
        t.stroke(new Path2D(sky.lines));
        t.lineWidth = 0.7;
        t.stroke(new Path2D(sky.cables));
        t.fillStyle = '#141414';
        t.fill(new Path2D(sky.mid));
        t.fillStyle = '#2A2A2A';
        t.fillRect(0, sky.ground, VW, VH);
        t.fillStyle = '#FFFFFF';
        sky.windows.forEach((wn) => wn.arch && t.fill(new Path2D(wn.d)));
        t.beginPath();
        t.arc(rose.cx, rose.cy, rose.r, 0, Math.PI * 2);
        t.fill();
      });
      c.fillStyle = INK;
      const sp = 3.4 * SS;
      const maxW = 2.9 * SS;
      const at = (x: number, y: number) => {
        const xi = Math.max(0, Math.min(w - 1, Math.round(x)));
        const yi = Math.max(0, Math.min(h - 1, Math.round(y)));
        return tone[yi * w + xi];
      };
      const drawLine = (x0: number, y0: number, dx: number, dy: number, len: number, widthOf: (t: number) => number) => {
        let pts: [number, number][] = [];
        let ws: number[] = [];
        const flush = () => {
          if (pts.length > 1) c.fill(new Path2D(swellPath(pts, ws)));
          pts = [];
          ws = [];
        };
        for (let s = 0; s <= len; s += 2 * SS) {
          const x = x0 + dx * s;
          const y = y0 + dy * s;
          if (x < -4 || y < -4 || x > w + 4 || y > h + 4) {
            flush();
            continue;
          }
          const lw = widthOf(at(x, y));
          if (lw < 0.28 * SS) {
            flush();
            continue;
          }
          pts.push([x, y]);
          ws.push(lw);
        }
        flush();
      };
      // family 1: horizontal lines, width = darkness
      for (let y = sp / 2; y < h; y += sp) drawLine(0, y, 1, 0, w, (t) => Math.pow(1 - t, 1.15) * maxW);
      // family 2: crosshatch in the deep shadows (buildings, ground)
      const a = (-58 * Math.PI) / 180;
      const dx = Math.cos(a);
      const dy = Math.sin(a);
      const nx = -dy;
      const ny = dx;
      const diag = Math.hypot(w, h);
      for (let o = -diag; o < diag; o += sp * 1.15) {
        const x0 = w / 2 + nx * o - dx * diag;
        const y0 = h / 2 + ny * o - dy * diag;
        drawLine(x0, y0, dx, dy, diag * 2, (t) => (t < 0.42 ? ((0.42 - t) / 0.42) * maxW * 0.85 : 0));
      }
      void f;
    },
    [f],
  );
  return <canvas ref={ref} width={VW * 2} height={VH * 2} style={{width: VW, height: VH, display: 'block'}} />;
};

// ---------------- engraved orb (SVG swell lines) ----------------
const EngravedOrb: React.FC<{cx: number; cy: number; r: number; look: [number, number]; uid: string}> = ({cx, cy, r, look, uid}) => {
  const L = [0.55, -0.62, 0.56];
  const ln = Math.hypot(L[0], L[1], L[2]);
  const lam = (x: number, y: number) => {
    const nz = Math.sqrt(Math.max(0, 1 - (x * x + y * y) / (r * r)));
    return Math.max(0, ((x / r) * L[0] + (y / r) * L[1] + nz * L[2]) / ln);
  };
  const lines = useMemo(() => {
    const out: string[] = [];
    const N = Math.round((2 * r) / 3.1);
    const sinA = 0.3;
    const cosA = Math.sqrt(1 - sinA * sinA);
    for (let j = 1; j < N; j++) {
      const hgt = -r + (2 * r * j) / N;
      const rx = Math.sqrt(r * r - hgt * hgt);
      const ry = rx * sinA;
      const yc = hgt * cosA;
      const pts: [number, number][] = [];
      const ws: number[] = [];
      for (let i = 0; i <= 60; i++) {
        const th = (i / 60) * Math.PI;
        const x = rx * Math.cos(th);
        const y = yc + ry * Math.sin(th);
        pts.push([cx + x, cy + y]);
        const l = lam(x, y);
        ws.push(0.25 + Math.pow(1 - l, 1.3) * 2.1);
      }
      out.push(swellPath(pts, ws, 0.2));
    }
    return out.join(' ');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cx, cy, r]);
  const ix = cx + look[0] * r * 0.5;
  const iy = cy + look[1] * r * 0.5;
  const ri = r * 0.5;
  const star = useMemo(() => hypotrochoid(0, 0, 1, 0.3, 0.5, 3, 900, 1), []);
  const star2 = useMemo(() => hypotrochoid(0, 0, 1, 0.14, 0.2, 7, 1400, 1), []);
  return (
    <g>
      <defs>
        <mask id={`${uid}-m`}>
          <circle cx={cx} cy={cy} r={r} fill="#fff" />
          <circle cx={ix} cy={iy} r={ri * 1.16} fill="#000" />
        </mask>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={PAPER} />
      <path d={lines} fill={INK} mask={`url(#${uid}-m)`} />
      {/* iris: spirograph rosette */}
      <g transform={`translate(${ix} ${iy})`}>
        <circle r={ri * 1.16} fill="none" stroke={INK} strokeWidth={0.9} />
        <circle r={ri} fill="none" stroke={INK} strokeWidth={1.4} />
        <path d={star} transform={`scale(${ri * 0.98})`} fill="none" stroke={INK} strokeWidth={0.5 / (ri * 0.98)} />
        <path d={star2} transform={`scale(${ri * 0.9}) rotate(9)`} fill="none" stroke={GREEN} strokeWidth={0.45 / (ri * 0.9)} />
        <circle r={ri * 0.4} fill={INK} />
        <circle cx={ri * 0.14} cy={-ri * 0.14} r={ri * 0.1} fill={PAPER} />
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={INK} strokeWidth={1.5} />
    </g>
  );
};

// ---------------- medallion rosette ----------------
const Medallion: React.FC<{cx: number; cy: number; R: number; seed: number; children?: React.ReactNode; draw: number}> = ({cx, cy, R, seed, children, draw}) => {
  const p = useMemo(
    () => ({
      outer: laceRing(cx, cy, R - 9, 8, 44 + seed * 4, 5, {amp2: 2, n2: 88}),
      petal: epitrochoid(cx, cy, 1, 1 / 18, 0.05, 1, 3000, R * 0.8),
      ring2: laceRing(cx, cy, R * 0.72, 7, 30 + seed * 2, 6, {rot: 0.05}),
      ring3: laceRing(cx, cy, R * 0.6, 4, 60, 3),
    }),
    [cx, cy, R, seed],
  );
  return (
    <g opacity={draw}>
      <circle cx={cx} cy={cy} r={R + 3} fill={PAPER} stroke={GREEN} strokeWidth={1.6} />
      <circle cx={cx} cy={cy} r={R - 1} fill="none" stroke={GREEN} strokeWidth={0.6} />
      <path d={p.outer} fill="none" stroke={GREEN} strokeWidth={0.6} />
      <path d={p.petal} fill="none" stroke={GREEN} strokeWidth={0.55} />
      <path d={p.ring2} fill="none" stroke={INK} strokeWidth={0.5} />
      <path d={p.ring3} fill="none" stroke={GREEN} strokeWidth={0.5} />
      <circle cx={cx} cy={cy} r={R * 0.52} fill={PAPER} stroke={INK} strokeWidth={1.2} />
      <circle cx={cx} cy={cy} r={R * 0.48} fill="none" stroke={INK} strokeWidth={0.5} />
      {children}
    </g>
  );
};

// ---------------- signature squiggle ----------------
const signature = (x0: number, y0: number, w: number, seed: number) => {
  // cursive pen model: a sequence of strokes (loop / hump / tall loop / descender) with per-stroke
  // amplitude, blended smoothly, slanted, with a drifting baseline, a capital and a flourish.
  const R = rng(seed);
  const kinds = ['cap', 'loop', 'hump', 'hump', 'tall', 'loop', 'desc', 'hump', 'loop', 'tall', 'hump', 'loop'];
  const segs = kinds.map((k, i) => {
    const j = i === 0 ? 'cap' : kinds[1 + Math.floor(R() * (kinds.length - 1))];
    const t = i === 0 ? k : j;
    return {
      A: t === 'loop' ? 7 + R() * 3 : t === 'tall' ? 6 : t === 'cap' ? 12 : t === 'desc' ? 5 : 1.5,
      B: t === 'tall' ? 30 + R() * 8 : t === 'cap' ? 38 : t === 'desc' ? -24 : t === 'hump' ? 9 + R() * 4 : 10 + R() * 3,
      len: t === 'cap' ? 30 : 16 + R() * 8,
    };
  });
  const total = segs.reduce((a2, sg) => a2 + sg.len, 0);
  const sc = w / total;
  const pts: string[] = [];
  let x = 0;
  segs.forEach((sg, i) => {
    const nx = segs[i + 1] ?? sg;
    for (let k = 0; k <= 24; k++) {
      const u = k / 24;
      const ph = u * Math.PI * 2;
      const bl = u * u * (3 - 2 * u);
      const A = sg.A * (1 - bl * 0.3) + nx.A * bl * 0.3;
      const px = x + u * sg.len - Math.sin(ph) * A;
      let py = -(1 - Math.cos(ph)) * 0.5 * sg.B;
      const drift = -((x + u * sg.len) / total) * 10;
      py += drift;
      const slant = -py * 0.38;
      pts.push(`${(x0 + (px + slant) * sc).toFixed(1)} ${(y0 + py).toFixed(1)}`);
    }
    x += sg.len;
  });
  const ex = x0 + w;
  const u = `M ${ex - 6} ${y0 - 12} C ${ex + 34} ${y0 - 26} ${ex + 20} ${y0 + 18} ${x0 + w * 0.4} ${y0 + 12} S ${x0 + w * 0.02} ${y0 + 8} ${x0 + w * 0.1} ${y0 + 2}`;
  return 'M ' + pts.join(' L ') + ' ' + u;
};

export const TitleEngrave: React.FC<TitleProps> = (props) => {
  const f = useTitleFrame(props);
  const ready = useFontsReady([`800 172px "Bodoni Moda"`, `400 20px "Bodoni Moda"`, `700 26px "JetBrains Mono"`, `400 26px "JetBrains Mono"`, `italic 400 18px "Playfair Display"`, `400 40px UnifrakturMaguntia`]);
  const border = useMemo(() => {
    const mid = (B0 + B1) / 2 + 2;
    const half = 17;
    const x0 = B0 + 70;
    const x1 = W - B0 - 70;
    const y0 = B0 + 70;
    const y1 = H - B0 - 70;
    return {
      top: wovenBand(x0, x1, mid, half, 30, 6),
      bot: wovenBand(x0, x1, H - mid, half, 30, 6),
      left: wovenBand(y0, y1, mid, half, 30, 6, true),
      right: wovenBand(y0, y1, W - mid, half, 30, 6, true),
      ropeT: rope(x0, x1, mid, 4, 12),
      ropeB: rope(x0, x1, H - mid, 4, 12),
      ropeL: rope(y0, y1, mid, 4, 12, true),
      ropeR: rope(y0, y1, W - mid, 4, 12, true),
      corners: [
        [B0 + 37, B0 + 37],
        [W - B0 - 37, B0 + 37],
        [B0 + 37, H - B0 - 37],
        [W - B0 - 37, H - B0 - 37],
      ].map(([x, y]) => ({x, y, a: laceRing(x, y, 25, 6, 18, 5), b: hypotrochoid(x, y, 1, 0.24, 0.42, 6, 1200, 18)})),
      under: laceRing(W / 2, 540, 400, 38, 28, 7, {amp2: 10, n2: 56}),
      under2: laceRing(W / 2, 540, 300, 26, 40, 5),
    };
  }, []);
  if (!ready) return <AbsoluteFill style={{background: PAPER}} />;

  const font = `800 172px ${FONT.title}`;
  const L = layoutWordmark({font, tracking: 12, orb: 0.66, gapL: 0.14, gapR: 0.34, sink: 0.01});
  const by = 560;
  const draw = smooth(0, 30, f);
  const stamp = f >= 34 || props.frame !== undefined ? easeOut(clamp((f - 34) / 6)) : 0;
  const stampK = props.frame !== undefined ? 1 : stamp;
  const look: [number, number] = [0.15 * Math.sin(f / 21), 0.1 + 0.08 * Math.cos(f / 27)];
  const legal = [
    'THIS CERTIFIES THAT THE BEARER IS THE OWNER OF ONE FULLY PAID, NON-ASSESSABLE, NON-VOTING SHARE OF THE',
    'CAPPED-PROFIT COMMON STOCK OF MR. MAS HOLDINGS, TRANSFERABLE ONLY ON THE BOOKS OF THE CORPORATION,',
    'SUBJECT TO THE MISSION, THE CHARTER, AND ANY SUBSEQUENT RESTRUCTURING.',
  ];
  const sig1 = signature(420, 884, 250, 3);
  const sig2 = signature(1250, 884, 270, 9);

  return (
    <AbsoluteFill style={{background: PAPER}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <pattern id="eg-face" width="10" height="3.3" patternUnits="userSpaceOnUse">
            <rect width="10" height="3.3" fill={PAPER} />
            <rect y="0.9" width="10" height="1.35" fill={INK} />
          </pattern>
          <pattern id="eg-tab" width="10" height="3" patternUnits="userSpaceOnUse">
            <rect width="10" height="3" fill={PAPER} />
            <rect y="0.6" width="10" height="1.9" fill={INK} />
          </pattern>
          <path id="eg-seal" d={`M ${960 - 45} 886 a 45 45 0 1 1 90 0 a 45 45 0 1 1 -90 0`} />
        </defs>
        {/* security underprint */}
        <g opacity={0.55 * draw}>
          <path d={border.under} fill="none" stroke={UNDER} strokeWidth={0.7} />
          <path d={border.under2} fill="none" stroke={UNDER} strokeWidth={0.6} />
        </g>
        {/* ---------- border ---------- */}
        <g opacity={draw}>
          <rect x={B0} y={B0} width={W - 2 * B0} height={H - 2 * B0} fill="none" stroke={GREEN} strokeWidth={3} />
          <rect x={B0 + 6} y={B0 + 6} width={W - 2 * B0 - 12} height={H - 2 * B0 - 12} fill="none" stroke={GREEN} strokeWidth={0.8} />
          <rect x={B1 - 8} y={B1 - 8} width={W - 2 * B1 + 16} height={H - 2 * B1 + 16} fill="none" stroke={GREEN} strokeWidth={0.8} />
          <rect x={B1} y={B1} width={W - 2 * B1} height={H - 2 * B1} fill="none" stroke={INK} strokeWidth={2.2} />
          {[border.top, border.bot, border.left, border.right].map((d, i) => (
            <path key={i} d={d} fill="none" stroke={GREEN} strokeWidth={0.75} />
          ))}
          {[border.ropeT, border.ropeB, border.ropeL, border.ropeR].map((d, i) => (
            <path key={i} d={d} fill="none" stroke={INK} strokeWidth={0.9} />
          ))}
          {border.corners.map((c, i) => (
            <g key={i}>
              <rect x={c.x - 34} y={c.y - 34} width={68} height={68} fill={PAPER} stroke={GREEN} strokeWidth={1.4} />
              <path d={c.a} fill="none" stroke={GREEN} strokeWidth={0.6} />
              <path d={c.b} fill="none" stroke={INK} strokeWidth={0.5} />
              <circle cx={c.x} cy={c.y} r={8} fill={PAPER} stroke={INK} strokeWidth={1} />
              <text x={c.x} y={c.y + 4.5} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={13} fill={INK}>
                1
              </text>
            </g>
          ))}
        </g>

        {/* ---------- header ---------- */}
        <text x={W / 2} y={154} textAnchor="middle" fontFamily={FONT.title} fontSize={19} letterSpacing={6} fill={INK}>
          INCORPORATED UNDER THE LAWS OF THE CLOUD
        </text>
        <text x={160} y={178} fontFamily={FONT.mono} fontWeight={700} fontSize={26} letterSpacing={3} fill={RED} opacity={stampK}>
          No. MM 000001
        </text>
        <text x={W - 160} y={170} textAnchor="end" fontFamily={FONT.mono} fontSize={13} letterSpacing={2} fill={INK}>
          CUSIP 000000 00 1
        </text>
        <text x={W - 160} y={188} textAnchor="end" fontFamily={FONT.title} fontSize={12} letterSpacing={2} fill={INK}>
          SEE REVERSE FOR CERTAIN DEFINITIONS
        </text>

        {/* ---------- vignette frame ---------- */}
        <ellipse cx={W / 2} cy={292} rx={VW / 2 + 16} ry={VH / 2 + 12} fill="none" stroke={GREEN} strokeWidth={0.7} />
        <ellipse cx={W / 2} cy={292} rx={VW / 2 + 9} ry={VH / 2 + 6} fill="none" stroke={INK} strokeWidth={1.8} />
        <ellipse cx={W / 2} cy={292} rx={VW / 2 + 4} ry={VH / 2 + 2} fill="none" stroke={INK} strokeWidth={0.6} />
        <foreignObject x={W / 2 - VW / 2} y={292 - VH / 2} width={VW} height={VH}>
          <div style={{width: VW, height: VH, clipPath: 'ellipse(50% 50% at 50% 50%)', background: PAPER}}>
            <Vignette ready={ready} f={f} />
          </div>
        </foreignObject>

        {/* ---------- medallions ---------- */}
        <Medallion cx={330} cy={470} R={126} seed={1} draw={draw}>
          <text x={330} y={446} textAnchor="middle" fontFamily={FONT.title} fontStyle="italic" fontSize={22} fill={INK}>
            No.
          </text>
          <text x={330} y={482} textAnchor="middle" fontFamily={FONT.mono} fontWeight={700} fontSize={26} letterSpacing={1} fill={RED} opacity={stampK}>
            000001
          </text>
          <text x={330} y={508} textAnchor="middle" fontFamily={FONT.title} fontSize={12} letterSpacing={3} fill={INK}>
            SERIES MM
          </text>
        </Medallion>
        <Medallion cx={W - 330} cy={470} R={126} seed={2} draw={draw}>
          <text x={W - 330} y={496} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={82} fill={INK}>
            1
          </text>
          <text x={W - 330} y={520} textAnchor="middle" fontFamily={FONT.title} fontSize={12} letterSpacing={4} fill={INK}>
            SHARE
          </text>
        </Medallion>

        {/* ---------- WORDMARK (shaded engraved letters) ---------- */}
        <g transform={`translate(${W / 2} ${by})`}>
          {(['MR', 'MAS'] as const).map((t) => (
            <text key={t + 's'} x={(t === 'MR' ? L.mrX : L.masX) + 6} y={6} fontFamily={FONT.title} fontWeight={800} fontSize={172} letterSpacing={12} fill={INK}>
              {t}
            </text>
          ))}
          {(['MR', 'MAS'] as const).map((t) => (
            <text key={t} x={t === 'MR' ? L.mrX : L.masX} y={0} fontFamily={FONT.title} fontWeight={800} fontSize={172} letterSpacing={12} fill="url(#eg-face)" stroke={INK} strokeWidth={1.6}>
              {t}
            </text>
          ))}
          <circle cx={L.orb.cx + 5} cy={L.orb.cy + 5} r={L.orb.r} fill={INK} />
          <EngravedOrb cx={L.orb.cx} cy={L.orb.cy} r={L.orb.r} look={look} uid="eg-orb" />
        </g>
        <text x={W / 2 + 4} y={by + 52} textAnchor="middle" fontFamily={FONT.mono} fontSize={26} letterSpacing={7} fill={RED} opacity={stampK}>
          now in low-key research preview
        </text>

        {/* ---------- tablet: ONE SHARE — NON-VOTING ---------- */}
        <g>
          <rect x={W / 2 - 330} y={by + 74} width={660} height={56} rx={28} fill="url(#eg-tab)" stroke={INK} strokeWidth={1.8} />
          <rect x={W / 2 - 322} y={by + 80} width={644} height={44} rx={22} fill="none" stroke={PAPER} strokeWidth={1.4} />
          <text x={W / 2 + 4} y={by + 114} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={27} letterSpacing={6} fill={PAPER} stroke={INK} strokeWidth={0.5}>
            ONE SHARE — NON-VOTING
          </text>
        </g>
        <text x={W / 2} y={by + 170} textAnchor="middle" fontFamily={FONT.masthead} fontSize={30} fill={INK}>
          Capped-Profit Common Stock
        </text>
        {legal.map((l, i) => (
          <text key={i} x={W / 2} y={by + 204 + i * 22} textAnchor="middle" fontFamily={FONT.news} fontStyle="italic" fontSize={16.5} letterSpacing={0.6} fill={INK}>
            {l}
          </text>
        ))}

        {/* ---------- signatures + seal ---------- */}
        <path d={sig1} fill="none" stroke={PEN} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" opacity={0.92} />
        <path d={sig2} fill="none" stroke={PEN} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" opacity={0.92} />
        <line x1={400} x2={700} y1={900} y2={900} stroke={INK} strokeWidth={1} />
        <line x1={1220} x2={1540} y1={900} y2={900} stroke={INK} strokeWidth={1} />
        <text x={550} y={922} textAnchor="middle" fontFamily={FONT.title} fontSize={13} letterSpacing={3} fill={INK}>
          SECRETARY (ACTING)
        </text>
        <text x={1380} y={922} textAnchor="middle" fontFamily={FONT.title} fontSize={13} letterSpacing={3} fill={INK}>
          CHIEF EXECUTIVE OFFICER (REINSTATED)
        </text>
        <g>
          <circle cx={960} cy={886} r={58} fill={PAPER} stroke={GREEN} strokeWidth={1.6} />
          <circle cx={960} cy={886} r={54} fill="none" stroke={GREEN} strokeWidth={0.6} />
          <circle cx={960} cy={886} r={36} fill="none" stroke={GREEN} strokeWidth={1} />
          <text fontFamily={FONT.title} fontSize={9} letterSpacing={1.1} fill={GREEN}>
            <textPath href="#eg-seal">MR. MAS HOLDINGS · CAPPED PROFIT · SEAL ·</textPath>
          </text>
          <path d={hypotrochoid(960, 886, 1, 0.2, 0.36, 5, 1200, 31)} fill="none" stroke={GREEN} strokeWidth={0.5} />
          <circle cx={960} cy={886} r={7} fill={GREEN} />
        </g>
        <text x={W - 160} y={930} textAnchor="end" fontFamily={FONT.mono} fontWeight={700} fontSize={26} letterSpacing={3} fill={RED} opacity={stampK}>
          MM 000001
        </text>
      </svg>
      <Paper amount={0.28} seed={4} />
      <Grain amount={0.05} seed={2 + Math.floor(f / 3)} blend="multiply" scale={1.1} />
    </AbsoluteFill>
  );
};
