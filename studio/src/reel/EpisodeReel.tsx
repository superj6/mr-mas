// The EPISODE reel composition (episode.ts builds the plan; README.md beside this file explains the manifest).
// Chapters play back to back on one clock. A reel/card chapter is the ordinary Reel with an episode clock; the title,
// the video slot and the optional reviewer slates are drawn here in the same amber-notes look.
import React, {useMemo} from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import type {Chapter, EpisodePlan} from './episode';
import {A, Chip, chipW, EpisodeBar, LAYOUT, Reel, reelClock, TitleCard, type EpClock} from './Reel';
import {clamp, DISPLAY, easeOut, MONO, wrap} from './look';
import {FPS, type Episode, type Timing} from './schema';

const {W, H, PX, PY, PW, PH, NX, NW, DY, PB_Y} = LAYOUT;

const clockFor = (plan: EpisodePlan, i: number): EpClock => {
  const ch = plan.chapters[i];
  const story = plan.chapters.filter((c) => c.kind !== 'title' && c.kind !== 'slate');
  return {
    offset: ch.from,
    total: plan.total,
    len: ch.dur,
    index: Math.max(0, story.indexOf(ch)),
    count: story.length,
    label: ch.label,
    sub: ch.sub,
    card: ch.kind === 'title' || ch.kind === 'slate' ? 0 : Math.round(plan.actCardSec * FPS),
    top: plan.top,
    sub2: plan.sub,
    // a chapter that brings its own sound has no temp bed under it (the bed is gated off there)
    beds: ch.bed ? plan.beds.map((b) => ({label: b.label, from: Math.round(b.from * FPS), to: Math.round(b.to * FPS)})) : [],
    known: ch.known,
  };
};

// ---------------------------------------------------------------- the title chapter
const EpisodeTitle: React.FC<{plan: EpisodePlan; ch: Chapter}> = ({plan, ch}) => {
  const f = useCurrentFrame();
  const ep: Episode = {key: plan.key, episode: plan.episode, title: plan.title, logline: '', dateSpan: plan.dateSpan, runtimeMin: plan.runtimeMin, variant: plan.variant, beats: []};
  const story = plan.chapters.filter((c) => c.kind !== 'title' && c.kind !== 'slate');
  const tm: Timing = {starts: [], lens: [], total: plan.total, acts: [], head: ch.dur};
  const beats = story.reduce((a, c) => a + (c.ep?.beats.length ?? 0), 0);
  const chips = story.map((c) => `${c.label} ${reelClock(c.dur).replace(/\.\d$/, '')}`);
  const summary = `${plan.runtimeMin}-min target · this reel ${reelClock(plan.total)} · ${story.length} chapters · ${beats} beats`;
  return (
    <AbsoluteFill style={{background: A.bg}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <TitleCard ep={ep} tm={tm} f={f} summary={summary} chips={chips} dur={ch.dur} />
        <EpisodeBar total={plan.total} top={plan.top} sub={plan.sub} fe={ch.from + f} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- a reviewer slate before an act (actCards: "slate")
const Slate: React.FC<{plan: EpisodePlan; ch: Chapter}> = ({plan, ch}) => {
  const f = useCurrentFrame();
  const k = easeOut(f / 6);
  const next = plan.chapters[plan.chapters.indexOf(ch) + 1];
  return (
    <AbsoluteFill style={{background: A.bg}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={PB_Y} fill={A.bg} />
        <g opacity={k}>
          <text x={120} y={300} fill={A.amber} fontFamily={DISPLAY} fontSize={96} letterSpacing={2}>
            {ch.label}
          </text>
          {ch.sub && (
            <text x={124} y={350} fill={A.text} fontFamily={MONO} fontWeight={700} fontSize={26}>
              {ch.sub}
            </text>
          )}
          <text x={124} y={396} fill={A.dim} fontFamily={MONO} fontSize={17}>
            {`${next ? reelClock(next.dur) + ' in the reel · ' : ''}from EP ${reelClock(ch.from + ch.dur)} · reviewer slate, not in the show`}
          </text>
        </g>
        <EpisodeBar total={plan.total} top={plan.top} sub={plan.sub} fe={ch.from + f} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- a real video file in a slot (the finished intro)
const VideoSlot: React.FC<{plan: EpisodePlan; ch: Chapter; clock: EpClock}> = ({plan, ch, clock}) => {
  const f = useCurrentFrame();
  const v = ch.video!;
  const full = v.fit === 'full';
  const trim = Math.round(v.in * FPS);
  if (full && v.media)
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <OffthreadVideo src={staticFile(v.media)} trimBefore={trim} muted style={{width: W, height: H}} />
      </AbsoluteFill>
    );
  // notes column
  const out: React.ReactNode[] = [];
  let y = PY + 20;
  const x = NX + 12;
  const cw = Math.floor((NW - 24) / (13.5 * 0.6));
  const line = (t: string, fs = 13.5, fill: string = A.text, bold = false) => {
    if (y > PY + PH - 6) return;
    out.push(
      <text key={out.length} x={x} y={y} fill={fill} fontFamily={MONO} fontWeight={bold ? 700 : 400} fontSize={fs} xmlSpace="preserve">
        {t}
      </text>,
    );
    y += fs * 1.38;
  };
  const head = (t: string) => {
    y += 7;
    out.push(<line key={out.length} x1={x} y1={y - 12} x2={NX + NW - 12} y2={y - 12} stroke={A.rule} strokeWidth={1} />);
    y += 4;
    line(t, 11, A.dim, true);
  };
  if (f < clock.card) {
    line(ch.label, 24, f < clock.card - 12 ? A.hi : A.amber, true);
    if (ch.sub) line(ch.sub, 12, A.text);
    line(`chapter ${clock.index + 1} / ${clock.count} · ${reelClock(ch.dur)} · from EP ${reelClock(ch.from)}`, 12, A.dim);
    y += 8;
  }
  line(`EP  ${reelClock(ch.from + f)} / ${reelClock(plan.total)}`, 14, A.hi, true);
  line(`${ch.label}  ${reelClock(f)} / ${reelClock(ch.dur)}`, 13, A.amber, true);
  head('SLOT');
  for (const l of wrap(`${v.src}${v.in ? ` from ${v.in} s` : ''}`, cw, 3)) line(l, 12.5, A.text);
  head('SOUND');
  for (const l of wrap(ch.audio, cw, 3)) line(l, 12.5, A.amber);
  head('NOTES');
  const notes = [
    full ? 'the finished master is spliced here full-frame at assembly (tools/episode.mjs); this frame is the studio stand-in' : 'the finished master plays inside the picture frame; the notes and the bar keep running',
    ...(v.note ? [v.note] : []),
  ];
  for (const n of notes) for (const l of wrap(`· ${n}`, cw, 4)) line(l, 12.5, A.dim);
  const k = clamp(f / 8);
  return (
    <AbsoluteFill style={{background: A.bg}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill={A.bg} />
        <text x={PX} y={29} fill={A.hi} fontFamily={MONO} fontWeight={700} fontSize={15}>
          {`EP ${plan.episode !== null ? String(plan.episode).padStart(2, '0') : '??'} · ${plan.title}`.slice(0, 48)}
        </text>
        {(() => {
          let cx = PX + Math.min(48, `EP 01 · ${plan.title}`.length) * 15 * 0.6 + 16;
          return [ch.act, 'VIDEO', full ? 'FULL FRAME' : 'INSET'].map((t, i) => {
            const el = <Chip key={i} x={cx} y={12} t={t} on={i === 0} />;
            cx += chipW(t) + 6;
            return el;
          });
        })()}
        <rect x={PX - 1} y={PY - 1} width={PW + 2} height={PH + 2} fill="#000" stroke="#d8d2c2" strokeWidth={1.5} />
        {!v.media && (
          <g opacity={k}>
            <rect x={PX} y={PY} width={PW} height={PH} fill="#05070d" />
            <text x={PX + PW / 2} y={PY + PH / 2 - 30} fill="#d8d2c2" fontFamily={DISPLAY} fontSize={64} textAnchor="middle" letterSpacing={2}>
              {ch.label}
            </text>
            <text x={PX + PW / 2} y={PY + PH / 2 + 14} fill="#8d94a3" fontFamily={MONO} fontWeight={700} fontSize={18} textAnchor="middle">
              {`${reelClock(ch.dur)} · ${v.src.replace(/^.*\//, '')}`}
            </text>
            <text x={PX + PW / 2} y={PY + PH / 2 + 44} fill="#5d6473" fontFamily={MONO} fontSize={14} textAnchor="middle">
              {full ? 'spliced full-frame at assembly' : 'staged into the bundle at render time'}
            </text>
          </g>
        )}
        <rect x={NX} y={PY} width={NW} height={PH} rx={4} fill={A.panel} stroke={A.rule} strokeWidth={1} />
        {out}
        <rect x={PX} y={DY} width={W - 32} height={PB_Y - 6 - DY} rx={4} fill={A.panel} stroke={A.rule} strokeWidth={1} />
        <text x={PX + 10} y={DY + 15} fill={A.dim} fontFamily={MONO} fontWeight={700} fontSize={10.5}>
          DIALOGUE
        </text>
        <text x={PX + 158} y={DY + 26} fill={A.faint} fontFamily={MONO} fontStyle="italic" fontSize={14}>
          the slot's own voices and score (its master mix)
        </text>
        <EpisodeBar total={plan.total} top={plan.top} sub={plan.sub} fe={ch.from + f} />
      </svg>
      {v.media && !full && (
        <div style={{position: 'absolute', left: PX, top: PY, width: PW, height: PH, overflow: 'hidden', background: '#000'}}>
          <OffthreadVideo src={staticFile(v.media)} trimBefore={trim} muted style={{width: PW, height: PH}} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- the composition
const ChapterView: React.FC<{plan: EpisodePlan; i: number}> = ({plan, i}) => {
  const ch = plan.chapters[i];
  const clock = useMemo(() => clockFor(plan, i), [plan, i]);
  if (ch.kind === 'title') return <EpisodeTitle plan={plan} ch={ch} />;
  if (ch.kind === 'slate') return <Slate plan={plan} ch={ch} />;
  if (ch.kind === 'video') return <VideoSlot plan={plan} ch={ch} clock={clock} />;
  return <Reel ep={ch.ep!} clock={clock} />;
};

export const EpisodeReel: React.FC<{plan: EpisodePlan}> = ({plan}) => (
  <AbsoluteFill style={{background: A.bg}}>
    {plan.chapters.map((ch, i) => (
      <Sequence key={ch.id} from={ch.from} durationInFrames={ch.dur} name={ch.label}>
        <ChapterView plan={plan} i={i} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
