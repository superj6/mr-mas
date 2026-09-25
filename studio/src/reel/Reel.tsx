// The reel composition: 3 s episode title card, then one beat after another, with always-on overlays
// (episode / act / beat id, reel time + real time in the 22-min episode, caption, real-event chip, act progress bar).
import React, {useMemo} from 'react';
import {AbsoluteFill, Series, useCurrentFrame} from 'remotion';
import {beatAt, fmtClock, FPS, TITLE_FRAMES, timeEpisode, type Beat, type Episode, type Timing} from './schema';
import {BeatStage} from './Stage';
import {actCol, clamp, DISPLAY, easeOut, MONO, SANS, SH, STYLE_CHIP, wrap} from './look';

const W = 1280;
const PB_Y = 690; // progress bar top

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

const Chip: React.FC<{x: number; y: number; t: string; bg: string; fg: string; fs?: number; stroke?: string}> = ({x, y, t, bg, fg, fs = 13, stroke}) => {
  const w = t.length * fs * 0.62 + 16;
  return (
    <g>
      <rect x={x} y={y} width={w} height={fs + 9} rx={4} fill={bg} stroke={stroke ?? '#000'} strokeWidth={1} />
      <text x={x + 8} y={y + fs + 2} fill={fg} fontFamily={MONO} fontWeight={700} fontSize={fs}>
        {t}
      </text>
    </g>
  );
};
const chipW = (t: string, fs = 13) => t.length * fs * 0.62 + 16;

const Hud: React.FC<{ep: Episode; beat: Beat; f: number; tm: Timing}> = ({ep, beat, f, tm}) => {
  const head = `${epLabel(ep)} · ${ep.title}`;
  const headW = Math.min(head.length * 9.3 + 20, 760);
  const act = beat.act;
  const sc = STYLE_CHIP[beat.style];
  let x = 10;
  const row2: React.ReactNode[] = [];
  const push = (t: string, bg: string, fg: string) => {
    row2.push(<Chip key={row2.length} x={x} y={38} t={t} bg={bg} fg={fg} />);
    x += chipW(t) + 5;
  };
  push(act, actCol(act), '#fff');
  push(beat.id, 'rgba(0,0,0,0.75)', '#fff');
  if (beat.kind !== 'scene') push(beat.kind.toUpperCase(), '#ff9a5c', '#1a0c00');
  push(beat.style, sc.bg, sc.fg);
  push(`${beat.shot} · ${beat.set === 'void' && beat.setRaw && beat.setRaw !== 'void' ? beat.setRaw : beat.set}`, 'rgba(0,0,0,0.6)', '#cfd6e6');
  beat.fx.forEach((fx) => push(`fx:${fx}`, '#39FF88', '#04200f'));
  if (ep.speculative) push('SPECULATIVE', '#d33', '#fff');
  const r1 = `REEL ${reelClock(f)} / ${reelClock(tm.total)}`;
  const r2 = realLabel(beat);
  return (
    <g>
      <rect x={10} y={8} width={headW} height={26} rx={4} fill="rgba(0,0,0,0.75)" />
      <text x={20} y={27} fill="#fff" fontFamily={MONO} fontWeight={700} fontSize={15}>
        {head.length > 80 ? head.slice(0, 79) + '…' : head}
      </text>
      {row2}
      <rect x={W - 10 - 330} y={8} width={330} height={26} rx={4} fill="rgba(0,0,0,0.75)" />
      <text x={W - 20} y={27} fill="#fff" fontFamily={MONO} fontWeight={700} fontSize={15} textAnchor="end" xmlSpace="preserve">
        {r1}
      </text>
      <rect x={W - 10 - 330} y={38} width={330} height={24} rx={4} fill="rgba(0,0,0,0.6)" />
      <text x={W - 20} y={55} fill="#ffd24a" fontFamily={MONO} fontWeight={700} fontSize={14} textAnchor="end" xmlSpace="preserve">
        {r2}
      </text>
    </g>
  );
};

const CaptionStrip: React.FC<{beat: Beat}> = ({beat}) => {
  const lines = wrap(beat.caption || '', 118, 2);
  const two = lines.length > 1;
  const real = beat.real ? `REAL · ${beat.real}` : '';
  const info = [beat.lines.length ? `${beat.lines.length} line${beat.lines.length > 1 ? 's' : ''}` : '', beat.vo ? 'v.o.' : '', beat.onscreen.length ? `${beat.onscreen.length} card${beat.onscreen.length > 1 ? 's' : ''}` : '', `${beat.reelDur.toFixed(1)} s in reel`]
    .filter(Boolean)
    .join(' · ');
  return (
    <g>
      <rect y={SH} width={W} height={PB_Y - SH} fill="#0c0e13" />
      <line x1={0} y1={SH} x2={W} y2={SH} stroke="#2a2f3a" strokeWidth={2} />
      {lines.map((l, i) => (
        <text key={i} x={16} y={SH + (two ? 18 + i * 19 : 22)} fill="#f4f6fb" fontFamily={SANS} fontWeight={700} fontSize={two ? 16.5 : 19}>
          {l}
        </text>
      ))}
      {real && !two && <Chip x={16} y={SH + 32} t={real.length > 90 ? real.slice(0, 89) + '…' : real} bg="#3a2a08" fg="#ffd24a" fs={12} stroke="#ffd24a" />}
      {real && two && <Chip x={W - 16 - Math.min(chipW(real, 11), 520)} y={SH + 40} t={real.length > 72 ? real.slice(0, 71) + '…' : real} bg="#3a2a08" fg="#ffd24a" fs={11} stroke="#ffd24a" />}
      {!two && (
        <text x={W - 16} y={SH + 46} fill="#6d778d" fontFamily={MONO} fontSize={12} textAnchor="end">
          {info}
        </text>
      )}
    </g>
  );
};

const Progress: React.FC<{ep: Episode; tm: Timing; f: number}> = ({ep, tm, f}) => {
  const X0 = 16;
  const X1 = W - 16;
  const TX = (fr: number) => X0 + (fr / Math.max(1, tm.total)) * (X1 - X0);
  const segs = [{act: 'TITLE', from: 0, to: TITLE_FRAMES}, ...tm.acts];
  const bi = beatAt(tm, f);
  const cur = bi >= 0 ? ep.beats[bi] : null;
  const runtime = ep.runtimeMin * 60;
  const RX = (s: number) => X0 + (clamp(s / runtime) * (X1 - X0));
  return (
    <g>
      <rect y={PB_Y} width={W} height={720 - PB_Y} fill="#07080b" />
      {segs.map((s, i) => {
        const x = TX(s.from);
        const w = TX(s.to) - x;
        const on = f >= s.from && f < s.to;
        return (
          <g key={i}>
            <rect x={x} y={PB_Y + 4} width={Math.max(1, w - 1)} height={13} fill={actCol(s.act)} opacity={on ? 1 : 0.55} />
            {w > s.act.length * 6.3 + 8 && (
              <text x={x + 4} y={PB_Y + 14} fill="#fff" fontFamily={MONO} fontWeight={700} fontSize={9.5}>
                {s.act}
              </text>
            )}
          </g>
        );
      })}
      {tm.starts.map((st, i) => (
        <line key={i} x1={TX(st)} y1={PB_Y + 4} x2={TX(st)} y2={PB_Y + 8} stroke="#000" strokeWidth={1} opacity={0.8} />
      ))}
      {/* real-time row: where each beat sits in the 22-min episode */}
      <rect x={X0} y={PB_Y + 21} width={X1 - X0} height={5} fill="#1a1d26" />
      {ep.beats.map((b, i) =>
        b.realStart !== null ? <rect key={i} x={RX(b.realStart)} y={PB_Y + 21} width={Math.max(1.5, RX(b.realStart + (b.realDur ?? 10)) - RX(b.realStart))} height={5} fill={actCol(b.act)} opacity={0.45} /> : null,
      )}
      {cur && cur.realStart !== null && <rect x={RX(cur.realStart)} y={PB_Y + 19} width={Math.max(3, RX(cur.realStart + (cur.realDur ?? 10)) - RX(cur.realStart))} height={9} fill="#ffd24a" />}
      <line x1={TX(f)} y1={PB_Y + 1} x2={TX(f)} y2={PB_Y + 20} stroke="#fff" strokeWidth={2} />
      <polygon points={`${TX(f) - 5},${PB_Y} ${TX(f) + 5},${PB_Y} ${TX(f)},${PB_Y + 6}`} fill="#fff" />
    </g>
  );
};

const TitleCard: React.FC<{ep: Episode; tm: Timing; f: number}> = ({ep, tm, f}) => {
  const k = easeOut(f / 10);
  const out = clamp((TITLE_FRAMES - 1 - f) / 5);
  const log = wrap(ep.logline || '', 70, 4);
  const actList = tm.acts.map((a) => `${a.act} ${((a.to - a.from) / FPS).toFixed(0)}s`);
  let ax = 120;
  return (
    <g opacity={Math.min(1, out + 0.15)}>
      <rect width={W} height={PB_Y} fill="#060913" />
      {Array.from({length: 17}, (_, i) => (
        <line key={i} x1={i * 80} y1={0} x2={i * 80} y2={PB_Y} stroke="#0f1a33" strokeWidth={1} />
      ))}
      <text x={120} y={96} fill="#3FE6FF" fontFamily={'"Archivo Black", sans-serif'} fontSize={30} opacity={k}>
        MR. MAS
      </text>
      <text x={290} y={96} fill="#5f6d8f" fontFamily={MONO} fontSize={15} opacity={k}>
        season outline reel · rough animatic
      </text>
      <g transform={`translate(${(1 - k) * -40} 0)`} opacity={k}>
        <text x={120} y={200} fill="#FFC857" fontFamily={DISPLAY} fontSize={84} letterSpacing={2}>
          {`EPISODE ${ep.episode ?? '?'}`}
        </text>
        <text x={120} y={252} fill="#e4ecff" fontFamily={MONO} fontWeight={700} fontSize={32}>
          {ep.title}
        </text>
        {ep.dateSpan && (
          <text x={120} y={296} fill="#93aee0" fontFamily={SANS} fontWeight={700} fontSize={25}>
            {ep.dateSpan}
          </text>
        )}
      </g>
      {log.map((l, i) => (
        <text key={i} x={120} y={352 + i * 32} fill="#dfe6f7" fontFamily={SANS} fontStyle="italic" fontSize={24} opacity={clamp((f - 8 - i * 3) / 6)}>
          {l}
        </text>
      ))}
      <text x={120} y={530} fill="#8d97ad" fontFamily={MONO} fontSize={16} opacity={clamp((f - 16) / 6)}>
        {`${ep.runtimeMin}-min episode (proposed) · reel ${reelClock(tm.total)} · ${ep.beats.length} beats`}
      </text>
      <g opacity={clamp((f - 20) / 6)}>
        {actList.map((a, i) => {
          const x = ax;
          ax += chipW(a, 12) + 6;
          return <Chip key={i} x={x} y={550} t={a} bg={actCol(tm.acts[i].act)} fg="#fff" fs={12} />;
        })}
      </g>
      {ep.speculative && (
        <g transform="translate(1010 180) rotate(-8)" opacity={clamp((f - 12) / 4)}>
          <rect x={-130} y={-36} width={260} height={62} fill="none" stroke="#ff4a4a" strokeWidth={5} />
          <text x={0} y={10} fill="#ff4a4a" fontFamily={DISPLAY} fontSize={40} textAnchor="middle" letterSpacing={3}>
            SPECULATIVE
          </text>
        </g>
      )}
      {ep.error && (
        <text x={120} y={620} fill="#ff6b6b" fontFamily={MONO} fontWeight={700} fontSize={15}>
          {`DATA ERROR: ${ep.error.slice(0, 120)}`}
        </text>
      )}
    </g>
  );
};

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
    <clipPath id="rStage">
      <rect width={W} height={SH} />
    </clipPath>
  </defs>
);

const StyleOverlay: React.FC<{beat: Beat; f: number}> = ({beat, f}) => {
  if (beat.style === 'TERMINAL')
    return (
      <g>
        {Array.from({length: Math.ceil(SH / 4)}, (_, i) => (
          <rect key={i} x={0} y={i * 4} width={W} height={1.5} fill="#000" opacity={0.28} />
        ))}
        <text x={24} y={SH - 16} fill="#2ee6c9" fontFamily={MONO} fontWeight={700} fontSize={18}>
          {`> ${f % 16 < 9 ? '_' : ' '}`}
        </text>
      </g>
    );
  if (beat.style === 'LEDGER')
    return <line x1={70} y1={0} x2={70} y2={SH} stroke="#ff7b7b" strokeWidth={2} opacity={0.6} />;
  return null;
};

export const Reel: React.FC<{ep: Episode}> = ({ep}) => {
  const f = useCurrentFrame();
  const tm = useMemo(() => timeEpisode(ep), [ep]);
  const bi = beatAt(tm, f);
  const beat = bi >= 0 ? ep.beats[bi] : null;
  return (
    <AbsoluteFill style={{background: '#05070d'}}>
      <svg width={W} height={720} viewBox={`0 0 ${W} 720`}>
        <Defs />
        {beat ? (
          <>
            <g clipPath="url(#rStage)">
              <BeatStage ctx={{ep, beat, lf: f - tm.starts[bi], len: tm.lens[bi]}} />
              <StyleOverlay beat={beat} f={f} />
            </g>
            <Hud ep={ep} beat={beat} f={f} tm={tm} />
            <CaptionStrip beat={beat} />
          </>
        ) : (
          <TitleCard ep={ep} tm={tm} f={f} />
        )}
        <Progress ep={ep} tm={tm} f={f} />
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
