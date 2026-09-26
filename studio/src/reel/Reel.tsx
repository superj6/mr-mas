// The reel composition: a 3 s title card, then one beat after another.
// Layout (1280x720): the show's PICTURE is a framed 16:9 inset (everything in it is a rough stand-in for what
// appears in the show), and every production note sits in the amber margin around it, never inside it:
//   header row      episode · act · beat id · kind · style · shot/set · fx
//   right column    reel clock, real time in the episode, what happens (caption), real-event tag, cues, notes
//   under picture   character name labels on leader ticks, then the dialogue strip (speaker-labelled lines,
//                   Mas's V.O. as "mas (v.o.)" in lowercase italic)
//   bottom          act / timeline bar (reel time on top, where the beat sits in the 22-min episode below)
import React, {useMemo} from 'react';
import {AbsoluteFill, Series, useCurrentFrame} from 'remotion';
import {beatAt, castName, displayName, fmtClock, FPS, MARKED, SETS, TITLE_FRAMES, timeEpisode, type Beat, type Episode, type Timing} from './schema';
import {BeatStage, castMarks, lineStarts, type DlgCtx} from './Stage';
import {clamp, DISPLAY, easeOut, MONO, PALS, SH, typed, wrap} from './look';

const W = 1280;
const H = 720;

// ---------------------------------------------------------------- the frame
// The stage is drawn in 1280 x SH (632) coordinates; the picture shows its centred 16:9 window.
const VH = SH;
const VW = (SH * 16) / 9; // 1123.6
const VX = 640 - VW / 2; // 78.2
const PX = 16;
const PY = 46;
const PW = 896;
const PH = 504; // 896 x 504 = 16:9
const K = PW / VW;
const NX = PX + PW + 16; // notes column
const NW = W - 16 - NX; // 336
const LY = PY + PH; // label row top (550)
const DY = 582; // dialogue strip top
const PB_Y = 690; // timeline bar top

// ---------------------------------------------------------------- annotation style (warm amber mono on slate)
const A = {
  bg: '#141920', // slate margin
  panel: '#1b2129',
  rule: '#2b333f',
  amber: '#f0a842',
  hi: '#ffd58a',
  dim: '#b0853f',
  faint: '#6f5733',
  text: '#f4e6c8', // cream-amber for longer notes and dialogue
  old: '#8e7a58', // earlier dialogue lines
};
const CH = 0.6; // JetBrains Mono advance, em

const reelClock = (f: number) => {
  const s = Math.max(0, f) / FPS;
  return `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`;
};
const realLabel = (b: Beat) => {
  if (b.realStart === null && b.realDur === null) return 'IN EP  —';
  const st = b.realStart !== null ? fmtClock(b.realStart) : '?';
  const end = b.realStart !== null && b.realDur !== null ? ` → ${fmtClock(b.realStart + b.realDur)}` : '';
  const dur = b.realDur !== null ? ` · ${Math.round(b.realDur)} s` : '';
  return `IN EP  ${st}${end}${dur}`;
};
const epLabel = (ep: Episode) => `EP ${ep.episode !== null ? String(ep.episode).padStart(2, '0') : '??'}`;
const clip = (t: string, n: number) => (t.length > n ? t.slice(0, n - 1) + '…' : t);

const chipW = (t: string, fs = 12) => t.length * fs * CH + 14;
const Chip: React.FC<{x: number; y: number; t: string; fs?: number; on?: boolean; swatch?: [string, string]}> = ({x, y, t, fs = 12, on, swatch}) => {
  const sw = swatch ? fs + 4 : 0;
  return (
    <g>
      <rect x={x} y={y} width={chipW(t, fs) + sw} height={fs + 9} rx={3} fill={on ? A.faint : A.panel} stroke={on ? A.amber : A.faint} strokeWidth={1} />
      {swatch && (
        <g>
          <rect x={x + 6} y={y + 4} width={fs} height={fs + 1} fill={swatch[0]} stroke={A.faint} strokeWidth={0.5} />
          <rect x={x + 6 + fs * 0.5} y={y + 4} width={fs * 0.5} height={fs + 1} fill={swatch[1]} />
        </g>
      )}
      <text x={x + 7 + sw} y={y + fs + 2} fill={on ? A.hi : A.amber} fontFamily={MONO} fontWeight={700} fontSize={fs}>
        {t}
      </text>
    </g>
  );
};

// ---------------------------------------------------------------- header row
const Header: React.FC<{ep: Episode; beat: Beat}> = ({ep, beat}) => {
  const head = clip(`${epLabel(ep)} · ${ep.title}`, 48);
  let x = PX + head.length * 15 * CH + 16;
  const chips: React.ReactNode[] = [];
  const push = (t: string, opt: {on?: boolean; swatch?: [string, string]} = {}) => {
    const w = chipW(t) + (opt.swatch ? 16 : 0);
    if (x + w > W - 16) return;
    chips.push(<Chip key={chips.length} x={x} y={12} t={t} {...opt} />);
    x += w + 6;
  };
  const setName = beat.set === 'void' && beat.setRaw && beat.setRaw !== 'void' ? beat.setRaw : beat.set;
  push(beat.act, {on: true});
  push(beat.id);
  if (beat.dlg) {
    // dialogue reels: the shot marker leads (WIDE / TWO-SHOT / OTS / SINGLE / INSERT …)
    push(beat.dlg.frame || beat.shot.toUpperCase(), {on: true});
    if (beat.kind !== 'scene') push(beat.kind.toUpperCase());
    if (beat.style !== 'BASE') push(beat.style, {swatch: [PALS[beat.style].bg, PALS[beat.style].ink]});
    push(setName);
  } else if (beat.placeholder) push('PLACEHOLDER');
  else {
    if (beat.kind !== 'scene') push(beat.kind.toUpperCase());
    const pal = PALS[beat.style];
    push(beat.style, {swatch: [pal.bg, pal.ink]});
    push(`${beat.shot} · ${setName}`);
  }
  beat.fx.forEach((fx) => push(`fx:${fx}`));
  return (
    <g>
      <text x={PX} y={29} fill={A.hi} fontFamily={MONO} fontWeight={700} fontSize={15}>
        {head}
      </text>
      {chips}
    </g>
  );
};

// ---------------------------------------------------------------- right-hand notes column
const FX_NOTE: Record<string, string> = {
  freeze: 'freeze · the world drops to 2-TONE, Mas stays in colour',
  flash: 'white flash on the cut',
  'glyph-dissolve': 'glyph dissolve',
  shake: 'camera shake',
  pop: 'pop-in',
  rain: 'tile rain',
  rewind: 'VHS rewind',
  split: 'split screen',
};
const notesFor = (beat: Beat): string[] => {
  const n: string[] = [];
  if (beat.placeholder) n.push('no picture yet: the frame is left empty');
  switch (beat.kind) {
    case 'montage':
      n.push('montage · film-strip frame');
      break;
    case 'flashback':
      n.push('flashback · vignette = memory');
      break;
    case 'plan':
      n.push('THE PLAN · blueprint register · dashed figures = the plan, not the event');
      break;
    case 'setpiece':
      n.push('set-piece · letterboxed');
      break;
    case 'intro':
      n.push('intro stand-in · the 0:30 main title has its own animatic: out/animatic/intro-animatic.mp4');
      break;
    case 'card':
      if (!beat.placeholder) n.push('full-frame card');
      break;
    default:
      break;
  }
  if (beat.shot === 'insert' && !beat.placeholder && beat.kind !== 'card' && beat.kind !== 'intro')
    n.push(`insert${beat.chars.length ? ' on ' + beat.chars.map((c) => displayName(c.id)).join(', ') : ''}${beat.onscreen.length ? '' : ' · drawn as a tight detail of the set'}`);
  beat.fx.forEach((f) => FX_NOTE[f] && n.push(FX_NOTE[f]));
  const raw = beat.setRaw.toLowerCase();
  if (beat.set === 'void' && raw && raw !== 'void' && !(SETS as readonly string[]).includes(raw)) n.push(`set "${beat.setRaw}": no set art yet (drawn as the void)`);
  const generic = Array.from(new Set(beat.chars.filter((c) => !MARKED.has(c.id)).map((c) => displayName(c.id))));
  if (generic.length) n.push(`no figure mark yet: ${generic.join(', ')}`);
  return n;
};

const Notes: React.FC<{ep: Episode; beat: Beat; bi: number; f: number; tm: Timing}> = ({ep, beat, bi, f, tm}) => {
  const seq = beat.dlg?.seqCur ?? null;
  const out: React.ReactNode[] = [];
  const x = NX + 12;
  const cw = Math.floor((NW - 24) / (13.5 * CH)); // chars per line at 13.5 px
  let y = PY + 20;
  const MAXY = PY + PH - 6;
  const line = (t: string, o: {fs?: number; fill?: string; bold?: boolean; italic?: boolean} = {}) => {
    const fs = o.fs ?? 13.5;
    if (y > MAXY) return false;
    out.push(
      <text key={out.length} x={x} y={y} fill={o.fill ?? A.text} fontFamily={MONO} fontWeight={o.bold ? 700 : 400} fontStyle={o.italic ? 'italic' : undefined} fontSize={fs} xmlSpace="preserve">
        {t}
      </text>,
    );
    y += fs * 1.38;
    return true;
  };
  const head = (t: string) => {
    y += 7;
    if (y > MAXY - 14) return;
    out.push(<line key={out.length} x1={x} y1={y - 12} x2={NX + NW - 12} y2={y - 12} stroke={A.rule} strokeWidth={1} />);
    y += 4;
    line(t, {fs: 11, fill: A.dim, bold: true});
  };
  const para = (t: string, fill: string, max: number, italic = false) => {
    const ls = wrap(t, cw, max);
    for (const l of ls) if (!line(l, {fill, italic})) break;
  };
  if (seq && beat.dlg) {
    // dialogue reels: where and when (a note, not in the picture); bright for 4 s after the sequence starts
    const fresh = f - tm.starts[Math.max(0, beat.dlg.seqStart)] < 4 * FPS;
    line(`${seq.id}${seq.side ? ' · ' + seq.side : ''}`, {fs: 13, fill: fresh ? A.hi : A.amber, bold: true});
    para(seq.place || '—', fresh ? A.hi : A.text, 2);
    if (seq.time) para(seq.time, fresh ? A.hi : A.text, 2);
    y += 4;
  }
  line(`REEL  ${reelClock(f)} / ${reelClock(tm.total)}`, {fs: 14, fill: A.hi, bold: true});
  line(realLabel(beat), {fs: 14, fill: A.amber, bold: true});
  line(`beat ${bi + 1} / ${ep.beats.length} · ${beat.reelDur.toFixed(1)} s in the reel`, {fs: 12, fill: A.dim});
  if (beat.dlg) line(`ACT ${reelClock(f - TITLE_FRAMES)}  (+12:31 = episode)`, {fs: 12, fill: A.dim});
  head('WHAT HAPPENS');
  para(beat.caption || '—', A.text, 8);
  if (beat.real) {
    head('REAL EVENT');
    para(beat.real, A.amber, 4);
  }
  if (beat.cues.length) {
    head('CUES');
    beat.cues.forEach((c) => para(`♪ ${c}`, A.amber, 2));
  }
  const notes = notesFor(beat);
  if (notes.length) {
    head('NOTES');
    notes.forEach((n) => para(`· ${n}`, A.dim, 3));
  }
  return (
    <g>
      <rect x={NX} y={PY} width={NW} height={PH} rx={4} fill={A.panel} stroke={A.rule} strokeWidth={1} />
      {out}
    </g>
  );
};

// ---------------------------------------------------------------- character name labels (under the picture)
const CastLabels: React.FC<{marks: {id: string; x: number}[]; nameOf?: (id: string) => string; speaking?: Set<string>}> = ({marks, nameOf, speaking}) => {
  const fs = 12;
  const items = marks
    .map((m) => {
      const name = nameOf ? nameOf(m.id) : displayName(m.id);
      const px = PX + (m.x - VX) * K;
      return {id: m.id, name, x: clamp(px, PX + 3, PX + PW - 3), w: name.length * fs * CH + 12};
    })
    .sort((a, b) => a.x - b.x);
  if (!items.length) return null;
  // spread the labels so they never overlap, keeping order; the leader ticks show who is who
  const cx = items.map((it) => it.x);
  for (let i = 1; i < items.length; i++) cx[i] = Math.max(cx[i], cx[i - 1] + (items[i - 1].w + items[i].w) / 2 + 6);
  const over = cx[cx.length - 1] + items[items.length - 1].w / 2 - (PX + PW);
  if (over > 0) for (let i = 0; i < cx.length; i++) cx[i] -= over;
  for (let i = cx.length - 2; i >= 0; i--) cx[i] = Math.min(cx[i], cx[i + 1] - (items[i].w + items[i + 1].w) / 2 - 6);
  const under = PX - (cx[0] - items[0].w / 2);
  if (under > 0) for (let i = 0; i < cx.length; i++) cx[i] += under;
  const top = LY + 11;
  return (
    <g>
      {items.map((it, i) => (
        <g key={i}>
          <polyline points={`${it.x},${LY + 1} ${it.x},${LY + 5} ${cx[i]},${top}`} fill="none" stroke={A.dim} strokeWidth={1.2} />
          <rect x={cx[i] - it.w / 2} y={top} width={it.w} height={fs + 7} rx={3} fill={speaking?.has(it.id) ? A.faint : A.panel} stroke={speaking?.has(it.id) ? A.hi : A.faint} strokeWidth={1} />
          <text x={cx[i]} y={top + fs + 1.5} fill={it.id === 'mas' || speaking?.has(it.id) ? A.hi : A.amber} fontFamily={MONO} fontWeight={700} fontSize={fs} textAnchor="middle">
            {it.name}
          </text>
        </g>
      ))}
    </g>
  );
};

// ---------------------------------------------------------------- dialogue strip
interface Row {label: string; text: string; start: number; vo: boolean}
const dialogueRows = (beat: Beat, len: number): Row[] => {
  const starts = lineStarts(beat, len);
  const inShot = new Set(beat.chars.map((c) => c.id));
  const rows: Row[] = beat.lines.map((l, i) => ({
    label: l.who ? displayName(l.who) + (inShot.has(l.who) ? '' : ' (O.S.)') : '—',
    text: l.text,
    start: starts[i],
    vo: false,
  }));
  if (beat.vo) rows.unshift({label: 'mas (v.o.)', text: beat.vo.toLowerCase(), start: 0, vo: true});
  return rows.map((r, i) => ({r, i})).sort((a, b) => a.r.start - b.r.start || a.i - b.i).map((x) => x.r);
};

const DialogueStrip: React.FC<{beat: Beat; lf: number; len: number}> = ({beat, lf, len}) => {
  const LX = PX + 158; // text column
  const fs = 15;
  const cw = Math.floor((W - 16 - 12 - LX) / (fs * CH));
  const rows = dialogueRows(beat, len);
  const started = rows.filter((r) => lf >= r.start);
  // newest lines at the bottom; up to 4 text rows (a long line takes 2)
  const shown: {label: string; lines: string[]; vo: boolean; cur: boolean}[] = [];
  let budget = 4;
  for (let i = started.length - 1; i >= 0 && budget > 0; i--) {
    const r = started[i];
    const cur = i === started.length - 1;
    const speed = r.vo ? len * 0.45 : Math.max(4, Math.min(12, r.text.length / 3));
    const full = wrap(r.text, cw, Math.min(2, budget));
    const txt = cur ? typed(r.text, (lf - r.start + 1) / speed) : r.text;
    const ls = wrap(txt, cw, Math.min(2, budget)).slice(0, full.length);
    shown.unshift({label: r.label, lines: ls.length ? ls : [''], vo: r.vo, cur});
    budget -= full.length;
  }
  const out: React.ReactNode[] = [];
  let y = DY + 26;
  if (!shown.length)
    out.push(
      <text key="none" x={LX} y={y} fill={A.faint} fontFamily={MONO} fontStyle="italic" fontSize={14}>
        {rows.length ? '…' : 'no dialogue'}
      </text>,
    );
  shown.forEach((s, i) => {
    const fill = s.cur ? A.text : A.old;
    out.push(
      <text key={`l${i}`} x={LX - 14} y={y} fill={s.cur ? A.amber : A.faint} fontFamily={MONO} fontWeight={700} fontStyle={s.vo ? 'italic' : undefined} fontSize={13} textAnchor="end">
        {s.label}
      </text>,
    );
    s.lines.forEach((l, j) => {
      out.push(
        <text key={`t${i}-${j}`} x={LX} y={y + j * 22} fill={fill} fontFamily={MONO} fontStyle={s.vo ? 'italic' : undefined} fontSize={fs} xmlSpace="preserve">
          {l}
        </text>,
      );
    });
    y += s.lines.length * 22;
  });
  return (
    <g>
      <rect x={PX} y={DY} width={W - 32} height={PB_Y - 6 - DY} rx={4} fill={A.panel} stroke={A.rule} strokeWidth={1} />
      <text x={PX + 10} y={DY + 15} fill={A.dim} fontFamily={MONO} fontWeight={700} fontSize={10.5}>
        DIALOGUE
      </text>
      <line x1={LX - 7} y1={DY + 8} x2={LX - 7} y2={PB_Y - 14} stroke={A.rule} strokeWidth={1} />
      {out}
    </g>
  );
};

// ---------------------------------------------------------------- dialogue reels: recorded lines across the whole reel
// (schema.ts DIALOGUE REELS). Lines are placed on the reel's clock, so a line that crosses a cut keeps playing in the
// strip; each word appears as it is spoken (the take's word timings). The speaker is labelled by name only once the
// picture has named them (a beat's names[]); before that the cast's neutral role is used.
interface GLine {who: string; text: string; tag: string; start: number; end: number; words: {w: string; f0: number}[]; cut: boolean}
interface GDlg {lines: GLine[]; namedAt: Map<string, number>; speaks: {id: string; f0: number; f1: number}[]; segs: {label: string; from: number; to: number}[]}
const buildDlg = (ep: Episode, tm: Timing): GDlg => {
  const lines: GLine[] = [];
  const namedAt = new Map<string, number>();
  const speaks: GDlg['speaks'] = [];
  const segs: GDlg['segs'] = [];
  Object.entries(ep.cast ?? {}).forEach(([id, c]) => c?.known && namedAt.set(id, -1));
  ep.beats.forEach((b, i) => {
    const D = b.dlg;
    if (!D) return;
    const s0 = tm.starts[i];
    D.lines.forEach((l) =>
      lines.push({who: l.who, text: l.text, tag: l.tag, start: s0 + l.t * FPS, end: s0 + (l.t + l.dur) * FPS, words: l.words.map((w) => ({w: w.w, f0: s0 + (l.t + w.t0) * FPS})), cut: l.cut}),
    );
    D.names.forEach((n) => {
      const fr = s0 + n.at * FPS;
      if (!namedAt.has(n.id) || namedAt.get(n.id)! > fr) namedAt.set(n.id, fr);
    });
    D.speak.forEach((k) => speaks.push({id: k.id, f0: s0 + k.at * FPS, f1: s0 + (k.at + k.dur) * FPS}));
    if (D.seq && !D.seq.sub) {
      if (segs.length) segs[segs.length - 1].to = s0;
      segs.push({label: D.seq.id, from: s0, to: tm.total});
    }
  });
  lines.sort((a, b) => a.start - b.start);
  return {lines, namedAt, speaks, segs};
};
const nameAt = (ep: Episode, G: GDlg, id: string, f: number) => {
  const at = G.namedAt.get(id);
  return at !== undefined && at <= f + 0.5 ? castName(ep, id) : ep.cast?.[id]?.role || 'VOICE';
};
const speakingAt = (G: GDlg, f: number): Set<string> => {
  const out = new Set<string>();
  for (const l of G.lines) if (l.who && f >= l.start - 1 && f < l.end + 2 && l.tag !== 'V.O.' && l.tag !== 'laptop') out.add(l.who);
  for (const k of G.speaks) if (f >= k.f0 && f < k.f1) out.add(k.id);
  return out;
};
const TAG_SUFFIX: Record<string, string> = {'O.S.': ' (O.S.)', laptop: ' (laptop)', monitor: ' (monitor)', call: ' (call)', door: ' (O.S.)'};
const DialogueStripRec: React.FC<{ep: Episode; G: GDlg; f: number}> = ({ep, G, f}) => {
  const LX = PX + 250; // text column (wider labels: roles and suffixes)
  const fs = 15;
  const cw = Math.floor((W - 16 - 12 - LX) / (fs * CH));
  const HOLD = 7 * FPS; // a finished line stays (dimmed) this long
  const started = G.lines.filter((l) => l.start <= f && f - l.end < HOLD);
  const shown: {label: string; lines: string[]; vo: boolean; cur: boolean}[] = [];
  let budget = 4;
  for (let i = started.length - 1; i >= 0 && budget > 0; i--) {
    const l = started[i];
    const cur = f < l.end + 3;
    const vo = l.tag === 'V.O.';
    const label = vo ? `${nameAt(ep, G, l.who, l.start).toLowerCase()} (v.o.)` : nameAt(ep, G, l.who, l.start) + (TAG_SUFFIX[l.tag] ?? '');
    const rows = Math.min(2, budget);
    const full = wrap(l.text, cw, rows);
    let txt = l.text;
    if (cur && l.words.length) {
      // reveal the printed text up to the words already spoken (the take's word timings)
      const n = l.words.filter((w) => w.f0 <= f).length;
      if (n < l.words.length) {
        const toks = l.text.split(/\s+/);
        txt = toks.slice(0, Math.round((n / l.words.length) * toks.length)).join(' ');
      }
    } else if (cur) txt = l.text.slice(0, Math.round(l.text.length * clamp((f - l.start + 1) / Math.max(4, l.end - l.start))));
    // a long turn scrolls: the strip keeps the most recent words (its last rows), with a lead-in ellipsis
    const all = wrap(txt, cw);
    let ls = all.length > rows ? all.slice(all.length - rows) : all;
    if (all.length > rows) ls = ['…' + ls[0], ...ls.slice(1)];
    ls = ls.slice(0, full.length);
    shown.unshift({label, lines: ls.length ? ls : [''], vo, cur});
    budget -= full.length;
  }
  const out: React.ReactNode[] = [];
  let y = DY + 26;
  if (!shown.length)
    out.push(
      <text key="none" x={LX} y={y} fill={A.faint} fontFamily={MONO} fontStyle="italic" fontSize={14}>
        …
      </text>,
    );
  shown.forEach((r, i) => {
    out.push(
      <text key={`l${i}`} x={LX - 14} y={y} fill={r.cur ? A.amber : A.faint} fontFamily={MONO} fontWeight={700} fontStyle={r.vo ? 'italic' : undefined} fontSize={13} textAnchor="end">
        {clip(r.label, 30)}
      </text>,
    );
    r.lines.forEach((t, j) =>
      out.push(
        <text key={`t${i}-${j}`} x={LX} y={y + j * 22} fill={r.cur ? A.text : A.old} fontFamily={MONO} fontStyle={r.vo ? 'italic' : undefined} fontSize={fs} xmlSpace="preserve">
          {t}
        </text>,
      ),
    );
    y += r.lines.length * 22;
  });
  return (
    <g>
      <rect x={PX} y={DY} width={W - 32} height={PB_Y - 6 - DY} rx={4} fill={A.panel} stroke={A.rule} strokeWidth={1} />
      <text x={PX + 10} y={DY + 15} fill={A.dim} fontFamily={MONO} fontWeight={700} fontSize={10.5}>
        DIALOGUE · RECORDED TAKES
      </text>
      <line x1={LX - 7} y1={DY + 8} x2={LX - 7} y2={PB_Y - 14} stroke={A.rule} strokeWidth={1} />
      {out}
    </g>
  );
};

// ---------------------------------------------------------------- act / timeline bar
const Progress: React.FC<{ep: Episode; tm: Timing; f: number; seqs?: {label: string; from: number; to: number}[]}> = ({ep, tm, f, seqs}) => {
  const X0 = 16;
  const X1 = W - 16;
  const TX = (fr: number) => X0 + (fr / Math.max(1, tm.total)) * (X1 - X0);
  // dialogue reels: the bar is split by sequence (S1 … S8) rather than by act
  const segs = [{act: 'TITLE', from: 0, to: TITLE_FRAMES}, ...(seqs && seqs.length ? seqs.map((q) => ({act: q.label, from: q.from, to: q.to})) : tm.acts)];
  const bi = beatAt(tm, f);
  const cur = bi >= 0 ? ep.beats[bi] : null;
  const runtime = ep.runtimeMin * 60;
  const RX = (s: number) => X0 + clamp(s / runtime) * (X1 - X0);
  return (
    <g>
      <rect y={PB_Y} width={W} height={H - PB_Y} fill="#0e1217" />
      {segs.map((s, i) => {
        const x = TX(s.from);
        const w = TX(s.to) - x;
        const on = f >= s.from && f < s.to;
        return (
          <g key={i}>
            <rect x={x} y={PB_Y + 4} width={Math.max(1, w - 1)} height={13} fill={on ? A.faint : A.rule} stroke={on ? A.amber : 'none'} strokeWidth={1} />
            {w > s.act.length * 6.3 + 8 && (
              <text x={x + 4} y={PB_Y + 14} fill={on ? A.hi : A.dim} fontFamily={MONO} fontWeight={700} fontSize={9.5}>
                {s.act}
              </text>
            )}
          </g>
        );
      })}
      {tm.starts.map((st, i) => (
        <line key={i} x1={TX(st)} y1={PB_Y + 4} x2={TX(st)} y2={PB_Y + 7} stroke="#0e1217" strokeWidth={1} opacity={0.8} />
      ))}
      {/* real-time row: where each beat sits in the 22-min episode */}
      <rect x={X0} y={PB_Y + 21} width={X1 - X0} height={5} fill="#1b2129" />
      {ep.beats.map((b, i) =>
        b.realStart !== null ? <rect key={i} x={RX(b.realStart)} y={PB_Y + 21} width={Math.max(1.5, RX(b.realStart + (b.realDur ?? 10)) - RX(b.realStart))} height={5} fill={A.dim} opacity={0.45} /> : null,
      )}
      {cur && cur.realStart !== null && <rect x={RX(cur.realStart)} y={PB_Y + 19} width={Math.max(3, RX(cur.realStart + (cur.realDur ?? 10)) - RX(cur.realStart))} height={9} fill={A.amber} />}
      <line x1={TX(f)} y1={PB_Y + 1} x2={TX(f)} y2={PB_Y + 20} stroke={A.hi} strokeWidth={2} />
      <polygon points={`${TX(f) - 5},${PB_Y} ${TX(f) + 5},${PB_Y} ${TX(f)},${PB_Y + 6}`} fill={A.hi} />
    </g>
  );
};

// ---------------------------------------------------------------- title card (all notes: amber on slate)
const TitleCard: React.FC<{ep: Episode; tm: Timing; f: number}> = ({ep, tm, f}) => {
  const k = easeOut(f / 10);
  const out = clamp((TITLE_FRAMES - 1 - f) / 5);
  const log = wrap(ep.logline || '', 70, 4);
  const actList = tm.acts.map((a) => `${a.act} ${fmtClock((a.to - a.from) / FPS)}`);
  let ax = 120;
  const legendK = clamp((f - 6) / 6);
  return (
    <g opacity={Math.min(1, out + 0.15)}>
      <rect width={W} height={PB_Y} fill={A.bg} />
      {Array.from({length: 17}, (_, i) => (
        <line key={i} x1={i * 80} y1={0} x2={i * 80} y2={PB_Y} stroke="#1a2029" strokeWidth={1} />
      ))}
      <text x={120} y={96} fill={A.hi} fontFamily={'"Archivo Black", sans-serif'} fontSize={30} opacity={k}>
        MR. MAS
      </text>
      <text x={290} y={96} fill={A.dim} fontFamily={MONO} fontSize={15} opacity={k}>
        {ep.variant ?? 'season outline reel · rough animatic'}
      </text>
      <g transform={`translate(${(1 - k) * -40} 0)`} opacity={k}>
        <text x={120} y={200} fill={A.amber} fontFamily={DISPLAY} fontSize={84} letterSpacing={2}>
          {`EPISODE ${ep.episode ?? '?'}`}
        </text>
        <text x={120} y={252} fill={A.text} fontFamily={MONO} fontWeight={700} fontSize={32}>
          {ep.title}
        </text>
        {(ep.dateSpan || ep.part) && (
          <text x={120} y={294} fill={A.dim} fontFamily={MONO} fontWeight={700} fontSize={20}>
            {[ep.dateSpan, ep.part].filter(Boolean).join('  ·  ')}
          </text>
        )}
      </g>
      {log.map((l, i) => (
        <text key={i} x={120} y={350 + i * 30} fill={A.text} fontFamily={MONO} fontStyle="italic" fontSize={20} opacity={clamp((f - 8 - i * 3) / 6)}>
          {l}
        </text>
      ))}
      <text x={120} y={500} fill={A.dim} fontFamily={MONO} fontSize={16} opacity={clamp((f - 16) / 6)}>
        {`${ep.runtimeMin}-min episode (proposed) · reel ${reelClock(tm.total)} · ${ep.beats.length} beats`}
      </text>
      <g opacity={clamp((f - 20) / 6)}>
        {actList.map((a, i) => {
          const x = ax;
          ax += chipW(a, 12) + 6;
          return x + chipW(a, 12) < W - 40 ? <Chip key={i} x={x} y={518} t={a} fs={12} /> : null;
        })}
      </g>
      {/* legend: what is show and what is a note */}
      <g opacity={legendK}>
        <rect x={120} y={596} width={64} height={36} fill="#060913" stroke="#d8d2c2" strokeWidth={1.5} />
        <g fill="none" stroke="#a9c1ee" strokeWidth={1.6} strokeLinecap="round">
          <circle cx={144} cy={606} r={4} />
          <path d="M144 610 v10 M138 627 l6 -7 l6 7 M138 613 h12" />
          <path d="M156 628 h22 M162 628 v-14 h10 v14" />
        </g>
        <rect x={190} y={596} width={22} height={36} fill={A.panel} stroke={A.faint} strokeWidth={1} />
        <rect x={194} y={604} width={14} height={3} fill={A.amber} />
        <rect x={194} y={612} width={10} height={3} fill={A.amber} />
        <text x={228} y={619} fontFamily={MONO} fontWeight={700} fontSize={17} xmlSpace="preserve">
          <tspan fill="#e8e4d8">inside the frame = rough stand-ins for the show</tspan>
          <tspan fill={A.amber}>{' · amber margin = notes'}</tspan>
        </text>
      </g>
      {ep.error && (
        <text x={120} y={660} fill="#ff6b6b" fontFamily={MONO} fontWeight={700} fontSize={15}>
          {`DATA ERROR: ${ep.error.slice(0, 120)}`}
        </text>
      )}
    </g>
  );
};

// ---------------------------------------------------------------- picture (the show)
const Defs: React.FC = () => (
  <defs>
    <pattern id="r1bitWall" width={8} height={8} patternUnits="userSpaceOnUse">
      <rect width={8} height={8} fill="#E9E6DA" />
      <rect width={2} height={2} fill="#0E0E10" />
    </pattern>
    <pattern id="r1bitFloor" width={6} height={6} patternUnits="userSpaceOnUse">
      <rect width={6} height={6} fill="#E9E6DA" />
      <rect width={3} height={3} fill="#0E0E10" />
      <rect x={3} y={3} width={3} height={3} fill="#0E0E10" />
    </pattern>
    <pattern id="rLedger" width={40} height={24} patternUnits="userSpaceOnUse">
      <rect width={40} height={24} fill="#0d3b22" />
      <rect y={23} width={40} height={1} fill="#39FF88" opacity={0.6} />
    </pattern>
  </defs>
);

const StyleOverlay: React.FC<{beat: Beat; f: number}> = ({beat, f}) => {
  if (beat.placeholder) return null;
  if (beat.style === 'TERMINAL')
    return (
      <g>
        {Array.from({length: Math.ceil(SH / 4)}, (_, i) => (
          <rect key={i} x={0} y={i * 4} width={W} height={1.5} fill="#000" opacity={0.28} />
        ))}
        <text x={VX + 28} y={SH - 16} fill="#2ee6c9" fontFamily={MONO} fontWeight={700} fontSize={18}>
          {`> ${f % 16 < 9 ? '_' : ' '}`}
        </text>
      </g>
    );
  if (beat.style === 'LEDGER') return <line x1={VX + 60} y1={0} x2={VX + 60} y2={SH} stroke="#ff7b7b" strokeWidth={2} opacity={0.6} />;
  return null;
};

const Picture: React.FC<{ep: Episode; beat: Beat; lf: number; len: number; f: number; dlg?: DlgCtx}> = ({ep, beat, lf, len, f, dlg}) => (
  <g>
    <rect x={PX - 1} y={PY - 1} width={PW + 2} height={PH + 2} fill="#000" stroke="#d8d2c2" strokeWidth={1.5} />
    <svg x={PX} y={PY} width={PW} height={PH} viewBox={`${VX} 0 ${VW} ${VH}`} preserveAspectRatio="none" overflow="hidden">
      <rect x={VX} y={0} width={VW} height={VH} fill="#05070d" />
      <BeatStage ctx={{ep, beat, lf, len, dlg}} />
      <StyleOverlay beat={beat} f={f} />
    </svg>
  </g>
);

export const Reel: React.FC<{ep: Episode}> = ({ep}) => {
  const f = useCurrentFrame();
  const tm = useMemo(() => timeEpisode(ep), [ep]);
  const G = useMemo(() => (ep.dialogueReel ? buildDlg(ep, tm) : null), [ep, tm]);
  const bi = beatAt(tm, f);
  const beat = bi >= 0 ? ep.beats[bi] : null;
  const lf = beat ? f - tm.starts[bi] : 0;
  const len = beat ? tm.lens[bi] : 1;
  const speaking = G ? speakingAt(G, f) : null;
  const dlg: DlgCtx | undefined = G && speaking ? {speaking, label: (id) => nameAt(ep, G, id, f)} : undefined;
  return (
    <AbsoluteFill style={{background: A.bg}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs />
        {beat ? (
          <>
            <rect width={W} height={H} fill={A.bg} />
            <Picture ep={ep} beat={beat} lf={lf} len={len} f={f} dlg={dlg} />
            <Header ep={ep} beat={beat} />
            <Notes ep={ep} beat={beat} bi={bi} f={f} tm={tm} />
            {dlg ? (
              <>
                <CastLabels marks={castMarks({ep, beat, lf, len, dlg})} nameOf={dlg.label} speaking={dlg.speaking} />
                <DialogueStripRec ep={ep} G={G!} f={f} />
              </>
            ) : (
              <>
                <CastLabels marks={castMarks({ep, beat, lf, len})} />
                <DialogueStrip beat={beat} lf={lf} len={len} />
              </>
            )}
          </>
        ) : (
          <TitleCard ep={ep} tm={tm} f={f} />
        )}
        <Progress ep={ep} tm={tm} f={f} seqs={G?.segs} />
      </svg>
    </AbsoluteFill>
  );
};

export const Season: React.FC<{eps: Episode[]}> = ({eps}) => (
  <Series>
    {eps.map((ep) => (
      <Series.Sequence key={ep.key} durationInFrames={timeEpisode(ep).total}>
        <Reel ep={ep} />
      </Series.Sequence>
    ))}
  </Series>
);
