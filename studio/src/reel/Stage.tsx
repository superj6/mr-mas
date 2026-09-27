// One beat's PICTURE: set + cast + in-world text (cards, date rail, ticker, UI) + kind treatments + fx.
// Only what would appear in the show is drawn here. Everything that is a note about the show (ids, labels,
// dialogue, captions, cues, timecodes) is drawn by Reel.tsx in the amber margin around the picture; this file
// exports what the margin needs: castMarks() (where each figure stands, for the name labels) and lineStarts().
import React from 'react';
import {castName, deviceOf, displayName, FPS, type Beat, type CharRef, type Episode, type Shot} from './schema';
import {Figure, figTop, humanGeo} from './Figure';
import {GlyphBg, SetBack, SetFront} from './Sets';
import {clamp, DISPLAY, easeBack, easeOut, FLOOR, GLY, hash, HEAD, MONO, palFor, rng, SANS, SH, typed, wrap, type Pal} from './look';

const W = 1280;
export interface BeatCtx {ep: Episode; beat: Beat; lf: number; len: number; dlg?: DlgCtx}
/** Dialogue reels only (schema.ts DIALOGUE REELS): what the picture needs to know about the talk at this frame. */
export interface DlgCtx {
  speaking: Set<string>; // ids whose line is audible on this frame
  label: (id: string) => string; // the name once the picture has named them, else the neutral role
}
const SPEAK_SPECIAL = new Set(['whale', 'orb', 'calendar', 'podium', 'clod', 'chatgtp', 'korg']);
/** A soft glow and ring behind the head of whoever is talking (dialogue reels). */
const SpeakGlow: React.FC<{p: Placed; x: number; lf: number; pal: Pal}> = ({p, x, lf, pal}) => {
  let hx = x;
  let hy = p.top + 22 * p.s;
  let R = 22 * p.s;
  if (!SPEAK_SPECIAL.has(p.ref.id)) {
    const g = humanGeo(p.ref.id, p.ref.pose, x, p.y, p.s, lf, p.dir);
    hx = g.hx;
    hy = g.hy;
    R = g.R;
  }
  const pulse = 1 + 0.06 * Math.sin(lf / 2.2);
  const ax = hx + R * 1.75 * (p.dir === -1 ? -1 : 1);
  return (
    <g>
      <circle cx={hx} cy={hy} r={R * 2.2 * pulse} fill={pal.mas} opacity={0.13} />
      <circle cx={hx} cy={hy} r={R * 1.6} fill="none" stroke={pal.mas} strokeWidth={Math.max(1.5, 2.2 * p.s)} opacity={0.55} />
      {[0, 1, 2].map((k) => (
        <path
          key={k}
          d={`M ${ax + (p.dir === -1 ? -1 : 1) * k * 7 * p.s} ${hy - (8 + k * 5) * p.s} q ${(p.dir === -1 ? -1 : 1) * (5 + k * 2) * p.s} ${(8 + k * 5) * p.s} 0 ${(16 + k * 10) * p.s}`}
          fill="none"
          stroke={pal.mas}
          strokeWidth={Math.max(1.2, 2 * p.s)}
          strokeLinecap="round"
          opacity={0.6 - k * 0.15 + 0.15 * Math.sin(lf / 2 + k)}
        />
      ))}
    </g>
  );
};

// ---------------------------------------------------------------- cast layout
interface Placed {ref: CharRef; x: number; y: number; s: number; dir: 1 | -1; look: number; top: number}
const SHOT_GEO: Record<Exclude<Shot, 'insert'>, {s: number; y: number; perFig: number}> = {
  wide: {s: 0.95, y: FLOOR, perFig: 118},
  medium: {s: 1.55, y: 604, perFig: 190},
  close: {s: 2.7, y: 694, perFig: 330},
};
const layout = (chars: CharRef[], shot: Shot, x0 = 90, x1 = 1190): Placed[] => {
  const g = SHOT_GEO[shot === 'insert' ? 'wide' : shot];
  const n = chars.length;
  if (!n) return [];
  const xs = chars.map((c, i) => (c.x !== null ? c.x : n === 1 ? 0.5 : 0.14 + (i * 0.72) / (n - 1)));
  const px = xs.map((x) => x0 + x * (x1 - x0));
  const want = g.perFig * (shot === 'wide' ? 1 : 0.75);
  if (shot !== 'wide' && n > 1) {
    // medium / close: spread the cast apart (keeping order and centre) rather than shrinking it off the bottom
    const order = px.map((_, i) => i).sort((a, b) => px[a] - px[b]);
    const mean = px.reduce((a, b) => a + b, 0) / n;
    const step = Math.min(want, (x1 - x0) / (n - 1));
    const pos = order.map((i) => px[i]);
    for (let k = 1; k < n; k++) pos[k] = Math.max(pos[k], pos[k - 1] + step);
    const span = pos[n - 1] - pos[0];
    if (span > x1 - x0) for (let k = 0; k < n; k++) pos[k] = pos[0] + ((pos[k] - pos[0]) * (x1 - x0)) / span;
    let shift = mean - pos.reduce((a, b) => a + b, 0) / n;
    shift = Math.max(x0 - pos[0], Math.min(x1 - pos[n - 1], shift));
    order.forEach((i, k) => (px[i] = pos[k] + shift));
  }
  const sorted = [...px].sort((a, b) => a - b);
  let gap = Infinity;
  for (let i = 1; i < sorted.length; i++) gap = Math.min(gap, sorted[i] - sorted[i - 1]);
  let s = g.s;
  if (n > 1 && gap < want - 0.5) s = Math.max(g.s * 0.55, (g.s * gap) / want);
  return chars.map((c, i) => {
    const others = px.filter((_, j) => j !== i);
    const tx = others.length ? others.reduce((a, b) => a + b, 0) / others.length : 640;
    const dir: 1 | -1 = tx >= px[i] ? 1 : -1;
    const look = n === 1 || (shot === 'close' && n <= 2 && c.id === 'mas') ? 0 : dir * 0.55;
    const sc = c.id === 'whale' ? s * 0.9 : s;
    let y = g.y;
    if (shot === 'close') {
      // feet are off-frame in a close-up: keep heads at the same height whatever the scale or pose
      y = 230 + 172 * sc;
      if (c.pose === 'sit') y -= 26 * sc;
    }
    return {ref: c, x: px[i], y, s: sc, dir, look, top: figTop(c.id, c.pose, px[i], y, sc)};
  });
};

// ---------------------------------------------------------------- dialogue timing (the strip itself is in Reel.tsx)
/** Frame (inside the beat) at which each line starts. Line t is already resolved to a fraction (schema.ts). */
export const lineStarts = (beat: Beat, len: number) =>
  beat.lines.map((l, i) => Math.floor(len * (l.t !== null ? l.t : 0.06 + (0.8 * i) / Math.max(1, beat.lines.length))));

// ---------------------------------------------------------------- on-screen text
interface CardLay {text: string; lines: string[]; fs: number; w: number; h: number; y: number; dx: number | null; ui?: boolean}
const CARD_TOP = 72;
/** Wrap a card's text without hard-splitting a filename-sized word (up to 40 chars). */
const cardWrap = (text: string, max = 30, maxLines = 3) => {
  const lw = Math.max(0, ...text.split(/\s+/).map((w) => w.length));
  return wrap(text, Math.min(40, Math.max(max, lw)), maxLines);
};
/** Stack cards top-down inside a height budget, shrinking the type when they don't fit.
 *  More than 4 items go in two columns (left column first), so nothing the writers typed is dropped. */
const layCards = (items: string[], maxW: number, budget: number): {cards: CardLay[]; used: number} => {
  const gap = 8;
  const two = items.length > 4;
  const colW = two ? maxW / 2 - 8 : maxW;
  const half = Math.ceil(items.length / 2);
  const base = items.map((text, i) => {
    const lines = cardWrap(text, two ? 24 : 30, 3);
    const longest = Math.max(...lines.map((l) => l.length), 4);
    const fs = Math.min(46, (colW - 50) / (longest * 0.47));
    return {text, lines, fs, longest, col: two ? (i < half ? 0 : 1) : 0};
  });
  const colH = (k: number, col: number) => {
    const cs = base.filter((c) => c.col === col);
    return cs.reduce((a, c) => a + c.lines.length * c.fs * k * 1.06 + 24, 0) + gap * Math.max(0, cs.length - 1);
  };
  const height = (k: number) => Math.max(colH(k, 0), two ? colH(k, 1) : 0);
  const k = Math.max(0.45, Math.min(1, budget / height(1)));
  const ys = [CARD_TOP, CARD_TOP];
  const cards = base.map((c) => {
    const fs = c.fs * k;
    const h = c.lines.length * fs * 1.06 + 24;
    const w = Math.min(colW, c.longest * fs * 0.47 + 50);
    const out = {text: c.text, lines: c.lines, fs, w, h, y: ys[c.col], dx: two ? (c.col === 0 ? -1 : 1) * (colW / 2 + 8) : null};
    ys[c.col] += h + gap;
    return out;
  });
  return {cards, used: Math.max(ys[0], two ? ys[1] : 0) - CARD_TOP - gap};
};

const OnCard: React.FC<{c: CardLay; cx: number; k: number; seed: number}> = ({c, cx, k, seed}) => {
  if (k <= 0) return null;
  const r = rng(seed);
  const rot = (r() - 0.5) * 3.5;
  const sc = easeBack(k);
  const cy = c.y + c.h / 2;
  if (c.ui)
    // an on-screen UI button (the writers' "UI: …" items)
    return (
      <g transform={`translate(${cx} ${cy}) scale(${sc})`}>
        <rect x={-c.w / 2} y={-c.h / 2} width={c.w} height={c.h} rx={c.h / 2} fill="#eef1f6" stroke="#0E1426" strokeWidth={3} />
        {c.lines.map((l, i) => (
          <text key={i} x={0} y={-c.h / 2 + 12 + c.fs * 0.78 + i * c.fs * 1.06} fill="#0E1426" fontFamily={SANS} fontWeight={700} fontSize={c.fs * 0.8} textAnchor="middle">
            {l}
          </text>
        ))}
      </g>
    );
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${sc})`}>
      <rect x={-c.w / 2 + 6} y={-c.h / 2 + 6} width={c.w} height={c.h} fill="rgba(0,0,0,0.45)" />
      <rect x={-c.w / 2} y={-c.h / 2} width={c.w} height={c.h} fill="#F2E8CF" stroke="#1B2A4A" strokeWidth={4} />
      {c.lines.map((l, i) => (
        <text key={i} x={0} y={-c.h / 2 + 12 + c.fs * 0.9 + i * c.fs * 1.06} fill="#1B2A4A" fontFamily={DISPLAY} fontSize={c.fs} textAnchor="middle" letterSpacing={1}>
          {l}
        </text>
      ))}
    </g>
  );
};

const onK = (i: number, lf: number, len: number, n = 1) => clamp((lf - len * (0.08 + i * Math.min(0.14, 0.5 / Math.max(1, n)))) / 6);

const FloatCards: React.FC<{ctx: BeatCtx; lay: CardLay[]; cx: number; ui: Set<string>; ageOf?: Map<string, number> | null}> = ({ctx, lay, cx, ui, ageOf}) => (
  <g>
    {lay.map((c, i) => (
      <OnCard
        key={i}
        c={{...c, ui: ui.has(c.text)}}
        cx={cx + (c.dx !== null ? c.dx : (i % 2 === 0 ? -1 : 1) * (lay.length > 1 ? 24 : 0))}
        k={ageOf && ageOf.has(c.text) ? clamp(ageOf.get(c.text)! / 6) : onK(i, ctx.lf, ctx.len, lay.length)}
        seed={hash(c.text) + i}
      />
    ))}
  </g>
);

// "RAIL: …" items: the show's Veep-style date chyron, lower left of the picture (prefix never drawn)
const DateRail: React.FC<{items: string[]; lf: number; bottom: number; ageOf?: Map<string, number> | null}> = ({items, lf, bottom, ageOf}) => {
  const fs = 30;
  let y = bottom;
  const out: React.ReactNode[] = [];
  for (let i = items.length - 1; i >= 0; i--) {
    const lines = wrap(items[i], 38, 2);
    const w = Math.min(1060, Math.max(...lines.map((l) => l.length)) * fs * 0.47 + 44);
    const h = lines.length * fs * 1.1 + 16;
    y -= h + 8;
    const k = ageOf && ageOf.has(items[i]) ? clamp((ageOf.get(items[i])! - 1) / 6) : clamp((lf - 2 - i * 6) / 6);
    if (k <= 0) continue;
    const x = 104 - (1 - easeOut(k)) * 50;
    out.push(
      <g key={i} opacity={k}>
        <clipPath id={`rail-${i}`}>
          <rect x={x} y={y} width={w * easeOut(k)} height={h} />
        </clipPath>
        <g clipPath={`url(#rail-${i})`}>
          <rect x={x} y={y} width={w} height={h} fill="#0E1426" opacity={0.93} />
          <rect x={x} y={y} width={8} height={h} fill="#3FE6FF" />
          {lines.map((l, j) => (
            <text key={j} x={x + 22} y={y + 8 + fs * 0.95 + j * fs * 1.1} fill="#F2E8CF" fontFamily={DISPLAY} fontSize={fs} letterSpacing={1.5}>
              {l}
            </text>
          ))}
        </g>
      </g>,
    );
  }
  return <g>{out}</g>;
};

// "TICKER: …" items: a news crawl along the bottom of the picture
const Ticker: React.FC<{items: string[]; lf: number; bottom: number}> = ({items, lf, bottom}) => {
  const txt = items.join('   ·   ');
  const fs = 22;
  const tw = txt.length * fs * 0.6 + 200;
  const x = 1202 - ((lf * 7) % (tw + 1124));
  return (
    <g>
      <rect x={0} y={bottom - 38} width={W} height={38} fill="#0E1426" opacity={0.95} />
      <rect x={0} y={bottom - 38} width={W} height={3} fill="#ff5a5a" />
      <text x={x} y={bottom - 11} fill="#F2E8CF" fontFamily={MONO} fontWeight={700} fontSize={fs} xmlSpace="preserve">
        {txt}
      </text>
    </g>
  );
};

// ---------------------------------------------------------------- panels
const CAM: Record<string, (x: number) => string> = {
  wide: () => '',
  medium: () => `translate(640 604) scale(1.4) translate(-640 ${-FLOOR})`,
  close: () => `translate(640 694) scale(2.3) translate(-640 ${-FLOOR})`,
};

const castX = (p: Placed, lf: number, len: number, frozen: boolean) =>
  p.ref.pose === 'walk' && !(frozen && p.ref.id !== 'mas') ? p.x + p.dir * lin01(lf / len) * 70 * p.s - p.dir * 35 * p.s : p.x;
const hiddenInMontage = (i: number, n: number, lf: number, len: number, montage: boolean) => montage && n > 1 && lf < Math.floor(len * 0.6 * (i / n));

const Cast: React.FC<{ctx: BeatCtx; placed: Placed[]; pal: Pal; frozen: boolean; montage: boolean; dashed: boolean}> = ({ctx, placed, pal, frozen, montage, dashed}) => {
  const {lf, len, beat} = ctx;
  const n = placed.length;
  return (
    <g>
      {ctx.dlg &&
        placed.map((p, i) =>
          ctx.dlg!.speaking.has(p.ref.id) && !hiddenInMontage(i, n, lf, len, montage) ? <SpeakGlow key={`g${i}`} p={p} x={castX(p, lf, len, frozen)} lf={lf} pal={pal} /> : null,
        )}
      {placed.map((p, i) => {
        if (hiddenInMontage(i, n, lf, len, montage)) return null;
        const still = frozen && p.ref.id !== 'mas';
        const x = castX(p, lf, len, frozen);
        return (
          <Figure
            key={i}
            id={p.ref.id}
            pose={p.ref.pose}
            face={p.ref.face}
            x={x}
            y={p.y}
            s={p.s}
            pal={pal}
            f={still ? 0 : lf}
            dir={p.dir}
            look={p.look}
            dashed={dashed}
            label="none"
            date={beat.real}
            noPodium={beat.set === 'podium'}
            t={lf / len}
          />
        );
      })}
    </g>
  );
};
const lin01 = (t: number) => clamp(t);

const World: React.FC<{ctx: BeatCtx; pal: Pal; placed: Placed[]; frozen: boolean}> = ({ctx, pal, placed, frozen}) => {
  const {beat, lf} = ctx;
  const shot = beat.shot === 'insert' ? 'wide' : beat.shot;
  const cam = CAM[shot]?.(0) ?? '';
  const f = frozen ? 0 : lf;
  return (
    <g>
      <g transform={cam || undefined}>
        <SetBack set={beat.set} pal={pal} f={f} raw={beat.setRaw} />
        {pal.key === 'GLYPH' && <GlyphBg pal={pal} f={f} seed={hash(beat.id)} />}
      </g>
      <Cast ctx={ctx} placed={placed} pal={pal} frozen={frozen} montage={beat.kind === 'montage'} dashed={beat.kind === 'plan'} />
      <g transform={cam || undefined}>
        <SetFront set={beat.set} pal={pal} f={f} xs={placed.filter((p) => p.ref.id === 'rumpt').map((p) => p.x).concat(placed.map((p) => p.x))} />
      </g>
    </g>
  );
};

// video-call grid
const CallGrid: React.FC<{ctx: BeatCtx; pal: Pal; frozen: boolean; top?: number}> = ({ctx, pal, frozen, top = 76}) => {
  // (the tile name plates are the call UI, i.e. in-world; the margin adds no labels for a call)
  const {beat, lf} = ctx;
  const n = Math.max(1, beat.chars.length);
  const cols = n <= 1 ? 1 : n <= 4 ? 2 : n <= 9 ? 3 : 4;
  const rows = Math.ceil(n / cols);
  // the tile grid starts below any on-screen cards, so the cards never cover a face
  const Y0 = Math.min(Math.max(76, top), 326);
  const GH = 546 - Y0;
  const GW = 1120;
  const X0 = 80;
  const tw = (GW - (cols - 1) * 12) / cols;
  const th = (GH - (rows - 1) * 12) / rows;
  const tiles = beat.chars.map((c, i) => {
    const cx = X0 + (i % cols) * (tw + 12);
    const cy = Y0 + Math.floor(i / cols) * (th + 12);
    return {c, cx, cy};
  });
  const placed: Placed[] = tiles.map(({c, cx, cy}) => {
    const s = Math.min(th / 150, tw / 170);
    const y = cy + th + 60 * s;
    return {ref: c, x: cx + tw / 2, y, s, dir: 1, look: 0, top: cy + 10};
  });
  return (
    <g>
      <SetBack set="call" pal={pal} f={lf} />
      {tiles.map(({c, cx, cy}, i) => (
        <g key={i}>
          <clipPath id={`tile-${beat.idx}-${i}`}>
            <rect x={cx} y={cy} width={tw} height={th} rx={8} />
          </clipPath>
          <rect x={cx} y={cy} width={tw} height={th} rx={8} fill={ctx.dlg && ctx.ep.cast?.[c.id]?.blank ? '#000' : pal.bg2} />
          {!(ctx.dlg && ctx.ep.cast?.[c.id]?.blank) && (
            <g clipPath={`url(#tile-${beat.idx}-${i})`}>
              <Figure id={c.id} pose={c.pose === 'walk' ? 'stand' : c.pose} face={c.face} x={placed[i].x} y={placed[i].y} s={placed[i].s} pal={pal} f={frozen && c.id !== 'mas' ? 0 : lf} look={0} label="none" date={beat.real} noPodium />
            </g>
          )}
          <rect x={cx} y={cy} width={tw} height={th} rx={8} fill="none" stroke={c.id === 'mas' ? pal.mas : pal.dim} strokeWidth={c.id === 'mas' ? 4 : 2} />
          {ctx.dlg && ctx.dlg.speaking.has(c.id) && <rect x={cx + 3} y={cy + 3} width={tw - 6} height={th - 6} rx={7} fill="none" stroke="#39FF88" strokeWidth={5} />}
          {(() => {
            const nm = ctx.dlg ? castName(ctx.ep, c.id) : displayName(c.id);
            return (
              <g>
                <rect x={cx + 8} y={cy + th - 30} width={nm.length * 9 + 14} height={22} rx={4} fill="rgba(0,0,0,0.65)" />
                <text x={cx + 15} y={cy + th - 14} fill="#fff" fontFamily={MONO} fontWeight={700} fontSize={14}>
                  {nm}
                </text>
              </g>
            );
          })()}
        </g>
      ))}
      <g>
        {[560, 620, 680].map((x, i) => (
          <circle key={x} cx={x} cy={566} r={14} fill={i === 2 ? '#d33' : pal.dim} />
        ))}
      </g>
    </g>
  );
};

// insert: a big object filling the frame, carrying on-screen text (or the caption)
const Insert: React.FC<{ctx: BeatCtx; pal: Pal; ageOf?: Map<string, number> | null}> = ({ctx, pal, ageOf}) => {
  const {beat, lf, len} = ctx;
  const screenish = ['screen', 'call', 'darkroom', 'office', 'bullpen', 'lab', 'datacenter', 'void'].includes(beat.set);
  const texts = beat.onscreen; // callers only use Insert when there is in-world text to show
  const t = clamp(lf / (len * 0.55));
  return (
    <g>
      <rect x={-10} y={-10} width={W + 20} height={SH + 20} fill={pal.mono ? pal.bg : '#03060e'} />
      {screenish ? (
        <g>
          <rect x={110} y={50} width={1060} height={500} rx={20} fill="#0b0f18" stroke="#2a3346" strokeWidth={8} />
          <rect x={140} y={78} width={1000} height={444} fill={pal.key === 'BASE' ? '#060b17' : pal.bg} />
        </g>
      ) : (
        <g transform="rotate(-2 640 300)">
          <rect x={260} y={40} width={760} height={530} fill={pal.plate} stroke={pal.plateInk} strokeWidth={4} />
          {Array.from({length: 14}, (_, i) => (
            <line key={i} x1={300} y1={120 + i * 32} x2={980} y2={120 + i * 32} stroke={pal.plateInk} strokeWidth={1} opacity={0.15} />
          ))}
        </g>
      )}
      {(() => {
        // stack the texts, shrinking to fit inside the screen (y 150..505) / paper (y 150..545).
        // Width: mono is ~0.6 em per char; the paper's Archivo Black runs ~0.74 em.
        const cw = screenish ? 36 : 26;
        const maxW = screenish ? 900 : 650;
        const em = screenish ? 0.6 : 0.74;
        const fulls = texts.map((tx) => wrap(tx, cw, 4));
        let fs = Math.min(52, ...fulls.map((f) => maxW / (Math.max(...f.map((l) => l.length), 6) * em)));
        const L = fulls.reduce((a, f) => a + f.length, 0);
        const avail = (screenish ? 505 : 545) - 150 - 24 * (texts.length - 1);
        if (fs * (1.2 * L + 0.2) > avail) fs = avail / (1.2 * L + 0.2);
        let y = 150 + fs;
        const nodes = texts.map((tx, i) => {
          const lines = wrap(ageOf && ageOf.has(tx) ? typed(tx, ageOf.get(tx)! / Math.max(6, tx.length / 2.5)) : typed(tx, t * texts.length - i), cw, 4);
          const y0 = y;
          y += fulls[i].length * fs * 1.2 + 24;
          return lines.map((l, j) => (
            <text key={`${i}-${j}`} x={screenish ? 180 : 310} y={y0 + j * fs * 1.2} fill={screenish ? (pal.key === 'BASE' ? '#e4ecff' : pal.text) : pal.plateInk} fontFamily={screenish ? MONO : HEAD} fontWeight={700} fontSize={fs}>
              {l}
            </text>
          ));
        });
        const curY = Math.min(480, y - 24 - fs * 0.75);
        return (
          <g>
            {nodes}
            {screenish && lf % 16 < 9 && y - 24 - fs * 0.75 <= 480 && <rect x={180} y={curY} width={16} height={28} fill={pal.glow} />}
          </g>
        );
      })()}
    </g>
  );
};

// kind = card: big text on a flat field
const CardStage: React.FC<{ctx: BeatCtx; pal: Pal; ageOf?: Map<string, number> | null}> = ({ctx, pal, ageOf}) => {
  const {beat, lf, len} = ctx;
  const items = beat.onscreen; // no text = an empty field (the caption is a note: it stays in the margin)
  const n = items.length;
  // stack the items top to bottom, never hard-splitting a filename-sized word, shrinking to fit the frame
  const gap = 26;
  const lays = items.map((t, i) => {
    const lines = cardWrap(t, t.length > 70 ? 40 : t.length > 36 ? 32 : 24, 6);
    const longest = Math.max(...lines.map((l) => l.length), 5);
    const fs = Math.min(i === 0 ? 76 : 54, (1000 / longest - 2) / 0.47); // Anton ~0.47 em + 2 px tracking
    return {lines, fs};
  });
  const total = lays.reduce((a, l) => a + l.lines.length * l.fs * 1.08, 0) + gap * Math.max(0, n - 1);
  const kf = Math.min(1, 470 / Math.max(1, total));
  let y = SH / 2 - (total * kf) / 2;
  return (
    <g>
      <rect x={-10} y={-10} width={W + 20} height={SH + 20} fill={pal.bg} />
      {pal.wallFill && <rect width={W} height={SH} fill={pal.wallFill} opacity={0.4} />}
      {lays.map(({lines, fs: fs0}, i) => {
        const k = ageOf && ageOf.has(items[i]) ? clamp(ageOf.get(items[i])! / 5) : clamp((lf - len * 0.05 - i * len * 0.15) / 5);
        const fs = fs0 * kf;
        const y0 = y;
        y += lines.length * fs * 1.08 + gap * kf;
        return (
          <g key={i} opacity={k} transform={`translate(0 ${(1 - easeOut(k)) * 20})`}>
            {lines.map((l, j) => (
              <text key={j} x={640} y={y0 + fs * 0.9 + j * fs * 1.08} fill={i === 0 ? pal.text : pal.glow} fontFamily={DISPLAY} fontSize={fs} textAnchor="middle" letterSpacing={2}>
                {l}
              </text>
            ))}
          </g>
        );
      })}
    </g>
  );
};

// kind = intro: stand-in for the 30 s main title (the intro has its own animatic). The episode's own intro
// items (onscreen) are the bar-9 slot words and the filename card; they are laid out here, under the logo.
const FILE_RE = /^ep\d+\.\d+_[\w.-]+$/i;
const IntroStage: React.FC<{ctx: BeatCtx; pal: Pal}> = ({ctx, pal}) => {
  const {beat, lf, len} = ctx;
  const k = clamp(lf / (len * 0.4));
  const files = beat.onscreen.filter((t) => FILE_RE.test(t.trim()));
  const slots = beat.onscreen.filter((t) => !FILE_RE.test(t.trim()));
  // flow the slot cards into centred rows, shrinking the type until they fit the band under the logo
  const MAXW = 1120;
  const GAP = 12;
  const BUDGET = files.length ? 262 : 300;
  const lay = (fs: number) => {
    const rows: {t: string; lines: string[]; w: number; h: number; i: number}[][] = [];
    let row: {t: string; lines: string[]; w: number; h: number; i: number}[] = [];
    let rw = 0;
    let fits = true;
    slots.forEach((t, i) => {
      const lines = cardWrap(t, t.length > 60 ? 46 : 34, 3);
      const longest = Math.max(...lines.map((l) => l.length), 3);
      const w = longest * fs * 0.5 + 36;
      const h = lines.length * fs * 1.08 + 18;
      if (w > MAXW) fits = false;
      if (row.length && rw + GAP + w > MAXW) {
        rows.push(row);
        row = [];
        rw = 0;
      }
      row.push({t, lines, w, h, i});
      rw += (row.length > 1 ? GAP : 0) + w;
    });
    if (row.length) rows.push(row);
    const total = rows.reduce((a, r) => a + Math.max(...r.map((c) => c.h)), 0) + GAP * Math.max(0, rows.length - 1);
    return {rows, total, fits};
  };
  let fs = 42;
  let L = lay(fs);
  while (fs > 16 && (!L.fits || L.total > BUDGET)) {
    fs -= 2;
    L = lay(fs);
  }
  const n = Math.max(1, slots.length);
  const cardK = (i: number) => clamp((lf - len * (0.14 + i * Math.min(0.12, 0.5 / n))) / 5);
  let y = files.length ? 270 : 236;
  const cards: React.ReactNode[] = [];
  L.rows.forEach((r, ri) => {
    const rh = Math.max(...r.map((c) => c.h));
    const rw = r.reduce((a, c) => a + c.w, 0) + GAP * (r.length - 1);
    let x = 640 - rw / 2;
    r.forEach((c) => {
      const kk = cardK(c.i);
      const cx = x + c.w / 2;
      const cy = y + rh / 2;
      const rot = (rng(hash(c.t) + c.i)() - 0.5) * 3;
      if (kk > 0)
        cards.push(
          <g key={`${ri}-${c.i}`} transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${easeBack(kk)})`}>
            <rect x={-c.w / 2 + 5} y={-c.h / 2 + 5} width={c.w} height={c.h} fill="rgba(0,0,0,0.5)" />
            <rect x={-c.w / 2} y={-c.h / 2} width={c.w} height={c.h} fill="#F2E8CF" stroke="#1B2A4A" strokeWidth={3} />
            {c.lines.map((l, j) => (
              <text key={j} x={0} y={-c.h / 2 + 9 + fs * 0.9 + j * fs * 1.08} fill="#1B2A4A" fontFamily={DISPLAY} fontSize={fs} textAnchor="middle" letterSpacing={1}>
                {l}
              </text>
            ))}
          </g>,
        );
      x += c.w + GAP;
    });
    y += rh + GAP;
  });
  const fileK = clamp((lf - len * 0.08) / 5);
  return (
    <g>
      <SetBack set="skyline" pal={pal} f={lf} />
      <rect width={W} height={SH} fill="#000" opacity={0.45} />
      <g transform={`translate(640 176) scale(${0.8 + easeBack(k) * 0.2})`}>
        <text x={4} y={4} fill="#000" fontFamily={HEAD} fontSize={104} textAnchor="middle">
          MR. MAS
        </text>
        <text x={0} y={0} fill={pal.glow} fontFamily={HEAD} fontSize={104} textAnchor="middle">
          MR. MAS
        </text>
      </g>
      {files.map((t, i) => {
        const fw = t.length * 13.6 + 36;
        return (
          <g key={t} opacity={fileK}>
            <rect x={640 - fw / 2} y={200 + i * 40} width={fw} height={34} rx={6} fill="rgba(4,8,20,0.9)" stroke={pal.glow} strokeWidth={2} />
            <text x={640} y={224 + i * 40} fill={pal.text} fontFamily={MONO} fontWeight={700} fontSize={22} textAnchor="middle">
              {t}
            </text>
          </g>
        );
      })}
      {cards}
    </g>
  );
};

// ---------------------------------------------------------------- kind treatments
const KindLayer: React.FC<{ctx: BeatCtx; pal: Pal}> = ({ctx, pal}) => {
  const {beat, lf} = ctx;
  switch (beat.kind) {
    case 'montage':
      return (
        <g>
          {[0, SH - 26].map((y) => (
            <g key={y}>
              <rect x={0} y={y} width={W} height={26} fill="#050505" />
              {Array.from({length: 33}, (_, i) => (
                <rect key={i} x={((i * 40 - (lf * 6) % 40) + 40) % (W + 40) - 20} y={y + 7} width={22} height={12} rx={2} fill="#ddd" opacity={0.85} />
              ))}
            </g>
          ))}
        </g>
      );
    case 'flashback': {
      const pts: string[] = [];
      for (let i = 0; i <= 64; i++) {
        const a = (i / 64) * Math.PI * 2;
        const wob = 1 + Math.sin(a * 9 + lf * 0.15) * 0.018;
        pts.push(`${640 + Math.cos(a) * 700 * wob},${316 + Math.sin(a) * 400 * wob}`);
      }
      return (
        <g>
          <path d={`M-20 -20 H${W + 20} V${SH + 20} H-20 Z M${pts.join(' L')} Z`} fill={pal.mono ? '#0E0E10' : '#F2E8CF'} fillRule="evenodd" opacity={0.28} />
          <rect x={0} y={0} width={W} height={SH} fill="#F2E8CF" opacity={pal.mono ? 0 : 0.05} />
        </g>
      );
    }
    case 'plan':
      return (
        <g>
          {Array.from({length: 33}, (_, i) => (
            <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={SH} stroke={pal.glow} strokeWidth={1} opacity={0.12} />
          ))}
          {Array.from({length: 16}, (_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 40} x2={W} y2={i * 40} stroke={pal.glow} strokeWidth={1} opacity={0.12} />
          ))}
        </g>
      );
    case 'setpiece':
      return (
        <g>
          <rect x={0} y={0} width={W} height={40} fill="#000" />
          <rect x={0} y={SH - 40} width={W} height={40} fill="#000" />
        </g>
      );
    default:
      return null;
  }
};

// ---------------------------------------------------------------- fx overlays
const FreezeCard: React.FC<{ctx: BeatCtx; name: string; sub: string; id: string}> = ({ctx, name, sub, id}) => {
  const {lf, len} = ctx;
  const k = clamp((lf - Math.min(8, len * 0.1)) / 5);
  if (k <= 0) return null;
  const x = 662 + (1 - easeOut(k)) * 600;
  const w = 520;
  const subL = wrap(sub, 26, 2);
  const h = 140 + Math.max(0, subL.length - 1) * 30;
  const pal2 = palFor('2-TONE');
  return (
    <g transform={`translate(${x} 80) rotate(-1.5)`}>
      <rect x={8} y={8} width={w} height={h} fill="rgba(0,0,0,0.45)" />
      <rect width={w} height={h} fill="#1B2A4A" stroke="#F2E8CF" strokeWidth={5} />
      <rect x={16} y={16} width={108} height={108} fill="#0c1426" stroke="#F2E8CF" strokeWidth={3} />
      <clipPath id={`fc-${ctx.beat.idx}`}>
        <rect x={16} y={16} width={108} height={108} />
      </clipPath>
      <g clipPath={`url(#fc-${ctx.beat.idx})`}>
        <Figure id={id} pose="stand" face="calm" x={70} y={300} s={1.5} pal={{...pal2, bg: '#0c1426'}} f={0} label="none" noPodium />
      </g>
      <text x={144} y={62} fill="#39FF88" fontFamily={DISPLAY} fontSize={Math.min(42, 360 / (Math.max(4, name.length) * 0.5))} letterSpacing={1}>
        {name}
      </text>
      <rect x={144} y={72} width={Math.min(360, name.length * Math.min(42, 360 / (Math.max(4, name.length) * 0.5)) * 0.5)} height={4} fill="#39FF88" />
      {subL.map((l, i) => (
        <text key={i} x={144} y={108 + i * 30} fill="#F2E8CF" fontFamily={MONO} fontWeight={700} fontSize={24}>
          {l}
        </text>
      ))}
    </g>
  );
};

const Rain: React.FC<{lf: number; pal: Pal; seed: number}> = ({lf, pal, seed}) => (
  <g>
    {Array.from({length: 70}, (_, i) => {
      const r = rng(seed + i * 11);
      const x = r() * W;
      const sp = 6 + r() * 10;
      const y = ((r() * SH + lf * sp) % (SH + 60)) - 40;
      const sz = 14 + r() * 16;
      const ch = GLY[Math.floor(r() * GLY.length)];
      return (
        <g key={i} transform={`translate(${x} ${y})`}>
          <rect x={-sz / 2} y={-sz / 2} width={sz} height={sz} fill={i % 3 === 0 ? pal.glow : pal.plate} opacity={0.8} stroke="#000" strokeWidth={1} />
          <text x={0} y={sz * 0.3} fill="#0E1426" fontFamily={MONO} fontWeight={700} fontSize={sz * 0.7} textAnchor="middle">
            {ch}
          </text>
        </g>
      );
    })}
  </g>
);

const Rewind: React.FC<{lf: number; len: number}> = ({lf, len}) => {
  const a = clamp(1 - lf / (len * 0.8));
  if (a <= 0.02) return null;
  return (
    <g opacity={a}>
      {Array.from({length: 40}, (_, i) => (
        <rect key={i} x={0} y={i * 16} width={W} height={3} fill="#fff" opacity={0.12} />
      ))}
      {[0, 1, 2].map((i) => {
        const y = ((lf * 23 + i * 211) % (SH + 60)) - 30;
        return <rect key={i} x={0} y={SH - y} width={W} height={14 + i * 6} fill="#fff" opacity={0.25} />;
      })}
      <rect x={560} y={92} width={160} height={40} rx={4} fill="rgba(0,0,0,0.7)" />
      <text x={640} y={121} fill="#fff" fontFamily={MONO} fontWeight={700} fontSize={24} textAnchor="middle">
        ◀◀ REW
      </text>
    </g>
  );
};

const GlyphDissolve: React.FC<{lf: number; len: number; pal: Pal; seed: number}> = ({lf, len, pal, seed}) => {
  const p = clamp((lf / len - 0.55) / 0.45) * 0.92;
  if (p <= 0) return null;
  const C = 32;
  const cols = Math.ceil(W / C);
  const rows = Math.ceil(SH / C);
  const r = rng(seed);
  const cells: React.ReactNode[] = [];
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      const v = r();
      const g = GLY[Math.floor(r() * GLY.length)];
      if (v < p)
        cells.push(
          <g key={`${x}-${y}`}>
            <rect x={x * C} y={y * C} width={C} height={C} fill={pal.mono ? pal.bg : '#020805'} />
            <text x={x * C + C / 2} y={y * C + C * 0.72} fill={pal.mono ? pal.ink : '#39FF88'} fontFamily={MONO} fontSize={22} textAnchor="middle" opacity={0.4 + (v / Math.max(p, 0.01)) * 0.6}>
              {g}
            </text>
          </g>,
        );
    }
  return <g>{cells}</g>;
};

const Burst: React.FC<{lf: number; pal: Pal}> = ({lf, pal}) => {
  if (lf > 7) return null;
  const k = lf / 7;
  return (
    <g opacity={1 - k}>
      {Array.from({length: 16}, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const r0 = 80 + k * 260;
        return <line key={i} x1={640 + Math.cos(a) * r0} y1={300 + Math.sin(a) * r0 * 0.7} x2={640 + Math.cos(a) * (r0 + 70)} y2={300 + Math.sin(a) * (r0 + 70) * 0.7} stroke={pal.mas} strokeWidth={6} strokeLinecap="round" />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- the beat
type Mode = 'placeholder' | 'card' | 'intro' | 'insert' | 'call' | 'split' | 'world';
interface Plan {
  beat: Beat; // the beat as drawn: onscreen[] holds only the plain in-world texts (device prefixes stripped)
  mode: Mode;
  fx: Set<string>;
  frozen: boolean;
  pal: Pal;
  freeze: {id: string; name: string; sub: string} | null;
  cards: string[];
  rails: string[];
  tickers: string[];
  ui: Set<string>;
  placed: Placed[];
  pa: Placed[];
  pb: Placed[];
  push: number; // slow camera push (scale about 640,316)
  ageOf: Map<string, number> | null; // dialogue reels: frames since each visible in-world text appeared
  fg: {id: string; side: 'left' | 'right'} | null; // dialogue reels: over-the-shoulder silhouette
}

const planBeat = (ctx: BeatCtx): Plan => {
  const raw = ctx.beat;
  const fx = new Set<string>(raw.fx);
  const frozen = fx.has('freeze');
  const pal = palFor(raw.style, frozen);
  const t = ctx.lf / ctx.len;
  // dialogue reels: in-world text and cast are timed inside the beat (schema.ts DIALOGUE REELS)
  const D = ctx.dlg && raw.dlg ? raw.dlg : null;
  let src = raw.onscreen;
  let chars = raw.chars;
  let ageOf: Map<string, number> | null = null;
  if (D) {
    const sec = ctx.lf / FPS;
    const vis = D.timed.filter((x) => sec >= x.at && (x.until === null || sec < x.until));
    src = vis.map((x) => x.text);
    ageOf = new Map(vis.map((x) => [deviceOf(x.text).text, ctx.lf - x.at * FPS]));
    chars = raw.chars.filter((_, i) => {
      const T = D.charT[i];
      return !T || ((T.from === null || sec >= T.from) && (T.until === null || sec < T.until));
    });
  }
  // in-world text devices: the prefixes ("RAIL:", "UI:", …) are pointers and are never drawn
  const items = src.map(deviceOf);
  const rails = items.filter((d) => d.device === 'rail').map((d) => d.text);
  const tickers = items.filter((d) => d.device === 'ticker').map((d) => d.text);
  const ui = new Set(items.filter((d) => d.device === 'ui').map((d) => d.text));
  const texts = items.filter((d) => d.device === 'card' || d.device === 'ui').map((d) => d.text);
  const beat: Beat = {...raw, onscreen: texts, chars};
  // freeze name card: "NAME / SUBTITLE" in onscreen names the card (and picks the portrait); else the first non-Mas char
  let freeze: Plan['freeze'] = null;
  let cards = texts;
  // (no name card on a full-frame card or insert: the text already fills the frame)
  if (frozen && beat.kind !== 'card' && beat.kind !== 'intro' && beat.shot !== 'insert' && !beat.placeholder) {
    const nameOf = (id: string) => displayName(id).replace(/^THE /, '');
    const charFor = (nm: string) => beat.chars.find((c) => nameOf(c.id) === nm.toUpperCase().replace(/^THE /, '') || c.id === nm.toLowerCase().replace(/\s+/g, '-'));
    // "NAME / SUB", or "NAME · SUB" when NAME is someone in the shot (the writers use both)
    const split = texts.map((x) => {
      const m = x.match(/^\s*([^/]{1,26}?)\s*\/\s*(.+)$/);
      if (m) return m;
      const d = x.match(/^\s*([^·]{1,26}?)\s*·\s*(.+)$/);
      return d && charFor(d[1]) ? d : null;
    });
    // prefer a "NAME / SUB" item naming someone in the shot, then any short "NAME / SUB", else the first non-Mas char
    let k = split.findIndex((m) => m && charFor(m[1]));
    if (k < 0) k = split.findIndex((m) => m && m[1] === m[1].toUpperCase());
    if (k >= 0) {
      const m = split[k]!;
      const who = charFor(m[1]) ?? beat.chars.find((c) => c.id !== 'mas');
      freeze = {id: who?.id ?? 'generic', name: m[1].toUpperCase(), sub: m[2]};
      cards = texts.filter((_, i) => i !== k);
    } else {
      const who = beat.chars.find((c) => c.id !== 'mas');
      if (who) freeze = {id: who.id, name: displayName(who.id), sub: ''};
    }
  }
  let mode: Mode;
  let placed: Placed[] = [];
  let pa: Placed[] = [];
  let pb: Placed[] = [];
  if (beat.placeholder) mode = 'placeholder';
  else if (beat.kind === 'card') mode = 'card';
  else if (beat.kind === 'intro') mode = 'intro';
  else if (beat.shot === 'insert' && texts.length) mode = 'insert';
  else if (beat.set === 'call' && !fx.has('split')) mode = 'call';
  else if (fx.has('split') && beat.chars.length >= 1) {
    mode = 'split';
    const half = Math.ceil(beat.chars.length / 2);
    pa = layout(beat.chars.slice(0, Math.max(1, half)).map((c) => ({...c, x: null})), beat.shot, 420, 860);
    pb = layout(beat.chars.slice(Math.max(1, half)).map((c) => ({...c, x: null})), beat.shot, 420, 860);
  } else {
    mode = 'world';
    // an insert with no in-world text reads as a tight detail of the set (and anyone in it)
    placed = layout(beat.chars, beat.shot === 'insert' ? 'close' : beat.shot);
  }
  const push = frozen || mode === 'card' || mode === 'placeholder' ? 1 : 1 + 0.035 * t;
  return {beat: mode === 'world' && beat.shot === 'insert' ? {...beat, shot: 'close'} : beat, mode, fx, frozen, pal, freeze, cards, rails, tickers, ui, placed, pa, pb, push, ageOf, fg: D && mode !== 'card' && mode !== 'insert' ? D.fg : null};
};

/** Where each visible figure stands (x in stage coordinates, 0..1280), for the margin's name labels.
 *  Empty for full-frame cards, inserts, the intro, placeholders and video calls (call tiles carry their own names). */
export const castMarks = (ctx: BeatCtx): {id: string; x: number}[] => {
  const P = planBeat(ctx);
  const {lf, len} = ctx;
  const pushX = (x: number) => 640 + (x - 640) * P.push;
  const fgMark = P.fg ? [{id: P.fg.id, x: P.fg.side === 'left' ? 200 : 1080}] : [];
  if (P.fg && P.mode !== 'world' && P.mode !== 'split') return fgMark;
  if (P.mode === 'world') {
    const n = P.placed.length;
    return [...fgMark, ...P.placed.flatMap((p, i) => (hiddenInMontage(i, n, lf, len, P.beat.kind === 'montage') ? [] : [{id: p.ref.id, x: pushX(castX(p, lf, len, P.frozen))}]))];
  }
  if (P.mode === 'split')
    return [
      ...fgMark,
      ...P.pa.map((p) => ({id: p.ref.id, x: pushX(Math.min(632, castX(p, lf, len, P.frozen) - 320))})),
      ...P.pb.map((p) => ({id: p.ref.id, x: pushX(Math.max(648, castX(p, lf, len, P.frozen) + 320))})),
    ];
  return [];
};

const Placeholder: React.FC = () => (
  // a segment with no picture yet: an empty, hatched frame (what it is, and how long, is in the margin)
  <g>
    <rect x={-10} y={-10} width={W + 20} height={SH + 20} fill="#10141b" />
    {Array.from({length: 52}, (_, i) => (
      <line key={i} x1={-720 + i * 40} y1={-10} x2={-720 + i * 40 + SH + 20} y2={SH + 10} stroke="#1f2631" strokeWidth={10} />
    ))}
  </g>
);

export const BeatStage: React.FC<{ctx: BeatCtx}> = ({ctx: ctx0}) => {
  const P = planBeat(ctx0);
  const ctx: BeatCtx = {...ctx0, beat: P.beat};
  const {beat, lf, len} = ctx;
  const {fx, frozen, pal, freeze, cards} = P;
  const t = lf / len;
  const seed = hash(beat.id + beat.caption);
  // camera
  let camT = P.push !== 1 ? `translate(640 316) scale(${P.push}) translate(-640 -316)` : '';
  if (fx.has('pop') && lf < 10) {
    const sc = 1 + 0.14 * (1 - easeBack(lf / 10));
    camT = `translate(640 316) scale(${sc}) translate(-640 -316) ` + camT;
  }
  let shake = '';
  if (fx.has('shake')) {
    const r = rng(lf * 97 + 5);
    const amp = 4 + 12 * (1 - t);
    shake = `translate(${Math.round((r() * 2 - 1) * amp)} ${Math.round((r() * 2 - 1) * amp)})`;
  }
  if (fx.has('rewind') && t < 0.8) {
    const r = rng(lf * 13 + 1);
    shake += ` translate(${Math.round((r() * 2 - 1) * 10 * (1 - t))} 0)`;
  }
  const flat = P.mode === 'card' || P.mode === 'intro' || P.mode === 'insert' || P.mode === 'placeholder';
  const hasCards = cards.length > 0 && !flat && beat.set !== 'screen';
  const cardW = freeze ? 600 : 860;
  const budget = beat.shot === 'close' ? 150 : beat.shot === 'medium' ? 230 : 220;
  const cardLay = hasCards ? layCards(cards.slice(0, 8), cardW, budget) : {cards: [], used: 0};
  const minTop = hasCards ? CARD_TOP + cardLay.used + 6 : 66;
  // picture
  let picture: React.ReactNode;
  if (P.mode === 'placeholder') picture = <Placeholder />;
  else if (P.mode === 'card') picture = <CardStage ctx={ctx} pal={pal} ageOf={P.ageOf} />;
  else if (P.mode === 'intro') picture = <IntroStage ctx={ctx} pal={pal} />;
  else if (P.mode === 'insert') picture = <Insert ctx={ctx} pal={pal} ageOf={P.ageOf} />;
  else if (P.mode === 'call') picture = <CallGrid ctx={ctx} pal={pal} frozen={frozen} top={hasCards ? minTop : 76} />;
  else if (P.mode === 'split') {
    picture = (
      <g>
        <clipPath id={`splitL-${beat.idx}`}>
          <rect x={0} y={0} width={638} height={SH} />
        </clipPath>
        <clipPath id={`splitR-${beat.idx}`}>
          <rect x={642} y={0} width={638} height={SH} />
        </clipPath>
        <g clipPath={`url(#splitL-${beat.idx})`}>
          <g transform="translate(-320 0)">
            <World ctx={ctx} pal={pal} placed={P.pa} frozen={frozen} />
          </g>
        </g>
        <g clipPath={`url(#splitR-${beat.idx})`}>
          <g transform="translate(320 0)">
            <World ctx={{...ctx, beat: {...beat, set: beat.set === 'call' ? 'void' : beat.set}}} pal={pal} placed={P.pb} frozen={frozen} />
          </g>
        </g>
        <rect x={636} y={0} width={8} height={SH} fill="#000" />
        <rect x={638} y={0} width={4} height={SH} fill={pal.glow} />
      </g>
    );
  } else picture = <World ctx={ctx} pal={pal} placed={P.placed} frozen={frozen} />;
  // screen set: on-screen text lives inside the monitor
  const screenText =
    beat.set === 'screen' && !flat && cards.length ? (
      <g>
        {(() => {
          const wide = beat.shot === 'wide';
          const x0 = wide ? 225 : 110;
          let y = wide ? 128 : 112;
          const fs = wide ? 30 : 36;
          const yMax = wide ? 440 : 470;
          const out: React.ReactNode[] = [];
          cards.forEach((c, i) => {
            const lines = wrap(P.ageOf && P.ageOf.has(c) ? typed(c, P.ageOf.get(c)! / Math.max(6, c.length / 2.5)) : typed(c, clamp((lf - i * len * 0.2) / (len * 0.4))), wide ? 48 : 50, 3);
            const full = wrap(c, wide ? 48 : 50, 3);
            full.forEach((_, j) => {
              if (y > yMax) return;
              if (lines[j]) out.push(<text key={`${i}-${j}`} x={x0} y={y} fill={pal.text} fontFamily={MONO} fontWeight={700} fontSize={fs}>{lines[j]}</text>);
              y += fs * 1.25;
            });
            y += fs * 0.6;
          });
          return out;
        })()}
      </g>
    ) : null;
  const bottom = SH - 22 - (beat.kind === 'setpiece' ? 40 : beat.kind === 'montage' ? 26 : 0);
  return (
    <g>
      <g transform={shake || undefined}>
        <g transform={camT || undefined}>
          {picture}
          {screenText}
        </g>
      </g>
      <KindLayer ctx={ctx} pal={pal} />
      {fx.has('rain') && <Rain lf={lf} pal={pal} seed={seed} />}
      {fx.has('glyph-dissolve') && <GlyphDissolve lf={lf} len={len} pal={pal} seed={seed} />}
      {P.fg && <Shoulder side={P.fg.side} pal={pal} />}
      {hasCards && <FloatCards ctx={ctx} lay={cardLay.cards} cx={freeze ? 340 : 640} ui={P.ui} ageOf={P.ageOf} />}
      {freeze && <FreezeCard ctx={ctx} id={freeze.id} name={freeze.name} sub={freeze.sub} />}
      {P.tickers.length > 0 && <Ticker items={P.tickers} lf={lf} bottom={bottom + 22} />}
      {P.rails.length > 0 && <DateRail items={P.rails} lf={lf} bottom={bottom - (P.tickers.length ? 38 : 0)} ageOf={P.ageOf} />}
      {fx.has('pop') && <Burst lf={lf} pal={pal} />}
      {fx.has('rewind') && <Rewind lf={lf} len={len} />}
      {(fx.has('flash') || frozen) && lf < 6 && <rect x={0} y={0} width={W} height={SH} fill="#fff" opacity={1 - lf / 6} />}
      {ctx.dlg && beat.dlg?.side && P.mode !== 'card' && <SideBadge text={beat.dlg.side} />}
    </g>
  );
};

// dialogue reels: the over-the-shoulder foreground (a dark shoulder and head, cut by the frame edge)
const Shoulder: React.FC<{side: 'left' | 'right'; pal: Pal}> = ({side, pal}) => {
  const m = side === 'left' ? 1 : -1;
  const cx = side === 'left' ? 150 : 1130;
  return (
    <g>
      <ellipse cx={cx - m * 10} cy={715} rx={215} ry={150} fill="#03050a" opacity={0.94} />
      <circle cx={cx - m * 20} cy={490} r={78} fill="#03050a" opacity={0.94} />
      <path d={`M ${cx - m * 20 + m * 78} 490 A 78 78 0 0 ${side === 'left' ? 1 : 0} ${cx - m * 20 + m * 34} 560`} fill="none" stroke={pal.dim} strokeWidth={3} opacity={0.8} />
    </g>
  );
};

// dialogue reels: the show's side badge (in-world chrome: HIS SIDE / THE BOARD'S SIDE), top right, persistent
const SideBadge: React.FC<{text: string}> = ({text}) => {
  const fs = 20;
  const w = text.length * fs * 0.62 + 28;
  const x = 1186 - w;
  const board = /BOARD/i.test(text);
  return (
    <g>
      <rect x={x} y={16} width={w} height={fs + 14} rx={4} fill={board ? '#1B2A4A' : '#0E1426'} opacity={0.9} stroke={board ? '#F2E8CF' : '#FFC857'} strokeWidth={2} />
      <text x={x + w / 2} y={16 + fs + 3} fill={board ? '#F2E8CF' : '#FFC857'} fontFamily={MONO} fontWeight={700} fontSize={fs} textAnchor="middle" letterSpacing={1}>
        {text}
      </text>
    </g>
  );
};
