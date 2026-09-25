import React from 'react';
import '@fontsource/jost/300.css';
import '@fontsource/jost/500.css';
import '@fontsource/jost/600.css';
import '@fontsource/jost/800.css';
import {FONT} from '../../shared/theme/fonts';

/** Design tokens for the invented OS ("Halcyon") and its apps. Dark, quiet, hairline UI; color = character. */
export const C = {
  bg: '#04060A',
  win: '#0C0F14',
  winHi: '#11151C',
  bar: '#0A0D12',
  line: 'rgba(255,255,255,0.075)',
  line2: 'rgba(255,255,255,0.14)',
  text: '#E6ECF0',
  sub: '#9AA5AF',
  mute: '#66717B',
  dim: '#3A434C',
  cyan: '#3FE6FF',
  cyanInk: '#2FD2EC',
  cyanDeep: '#03080B',
  orange: '#FF5A1F',
  orangeInk: '#FF6A2A',
  orangeHot: '#FFB089',
  orangeDeep: '#0B0503',
};
export const UI = '"Jost", sans-serif';
export const MONO = FONT.mono;

export const Icon = {
  moon: (s = 14, c = C.sub) => (
    <svg width={s} height={s} viewBox="0 0 16 16"><path d="M11.6 10.9A5.6 5.6 0 0 1 5.1 4.4 5.8 5.8 0 1 0 11.6 10.9Z" fill={c} /></svg>
  ),
  wifi: (s = 16, c = C.sub) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round"><path d="M2 6.2a8.5 8.5 0 0 1 12 0M4.3 8.6a5.2 5.2 0 0 1 7.4 0M6.5 10.9a2 2 0 0 1 3 0" /><circle cx="8" cy="13" r="0.9" fill={c} stroke="none" /></svg>
  ),
  battery: (s = 22, c = C.sub) => (
    <svg width={s} height={s * 0.55} viewBox="0 0 22 12" fill="none"><rect x="0.7" y="0.7" width="18" height="10.6" rx="3" stroke={c} strokeWidth={1.2} /><rect x="2.4" y="2.4" width="11" height="7.2" rx="1.6" fill={c} /><rect x="19.8" y="4" width="1.6" height="4" rx="0.8" fill={c} /></svg>
  ),
  mic: (s = 18, c = C.text) => (
    <svg width={s} height={s} viewBox="0 0 18 18" fill="none" stroke={c} strokeWidth={1.5} strokeLinecap="round"><rect x="6.2" y="2" width="5.6" height="9" rx="2.8" /><path d="M3.8 8.6a5.2 5.2 0 0 0 10.4 0M9 13.8V16" /></svg>
  ),
  cam: (s = 18, c = C.text) => (
    <svg width={s} height={s} viewBox="0 0 18 18" fill="none" stroke={c} strokeWidth={1.5} strokeLinejoin="round"><rect x="1.8" y="4.6" width="10.4" height="8.8" rx="2" /><path d="M12.2 8 16.2 5.6v6.8L12.2 10Z" /></svg>
  ),
  end: (s = 20, c = '#fff') => (
    <svg width={s} height={s} viewBox="0 0 20 20"><path d="M2.4 11.6c4.4-4.2 10.8-4.2 15.2 0l-1.9 2.2-3-1.2v-2.1a9.6 9.6 0 0 0-5.4 0v2.1l-3 1.2Z" fill={c} /></svg>
  ),
  send: (s = 16, c = C.bg) => (
    <svg width={s} height={s} viewBox="0 0 16 16"><path d="M8 13V3M3.6 7.4 8 3l4.4 4.4" stroke={c} strokeWidth={1.9} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  check: (s = 14, c = C.orange) => (
    <svg width={s} height={s} viewBox="0 0 14 14"><path d="M7 0.6 8.6 2l2.1-.3.6 2 1.9 1-.7 2 .7 2-1.9 1-.6 2-2.1-.3L7 13.4 5.4 12l-2.1.3-.6-2-1.9-1 .7-2-.7-2 1.9-1 .6-2 2.1.3Z" fill={c} /><path d="M4.4 7.1 6.2 8.9 9.8 5.2" stroke="#0B0503" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  /** Parody social app mark: a heavy geometric Z in a squircle. */
  z: (s = 18, bg = '#F2F2F2', fg = '#0A0A0A') => (
    <svg width={s} height={s} viewBox="0 0 24 24"><rect width="24" height="24" rx="6.5" fill={bg} /><path d="M6.4 6.2h11.2v2.6L10.4 15.4h7.2v2.4H6.4v-2.6l7.2-6.6H6.4Z" fill={fg} /></svg>
  ),
  cc: (s = 18, c = C.text) => (
    <svg width={s} height={s} viewBox="0 0 18 18" fill="none"><rect x="1.5" y="3.5" width="15" height="11" rx="2.5" stroke={c} strokeWidth={1.4} /><path d="M7.6 7.4a2 2 0 1 0 0 3.2M12.6 7.4a2 2 0 1 0 0 3.2" stroke={c} strokeWidth={1.3} strokeLinecap="round" /></svg>
  ),
  lines: (s = 12, c = C.sub) => (
    <svg width={s} height={s} viewBox="0 0 12 12">{[1, 3.4, 5.8, 8.2, 10.6].map((y, i) => <rect key={i} x="0" y={y - 0.5} width="12" height={0.5 + i * 0.35} fill={c} />)}</svg>
  ),
  /** OS mark: a small orb over a horizon (the show's ORB, as a logo glyph). */
  orb: (s = 16, c = C.text) => (
    <svg width={s} height={s} viewBox="0 0 16 16"><circle cx="8" cy="7" r="5" fill="none" stroke={c} strokeWidth={1.4} /><rect x="1" y="12.6" width="14" height="1.5" rx="0.75" fill={c} /></svg>
  ),
};

// ------------------------------------------------------------------ window chrome
export const Win: React.FC<{
  x: number;
  y: number;
  w: number;
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  titleRight?: React.ReactNode;
  titleLeft?: React.ReactNode;
  active?: boolean;
  glow?: string;
}> = ({x, y, w, title, children, style, titleRight, titleLeft, active = true, glow}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      borderRadius: 14,
      background: C.win,
      border: `1px solid ${C.line2}`,
      boxShadow: `0 40px 90px rgba(0,0,0,0.62), 0 8px 22px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)${glow ? `, 0 0 70px ${glow}` : ''}`,
      overflow: 'visible',
      ...style,
    }}
  >
    <div style={{height: 34, display: 'flex', alignItems: 'center', padding: '0 14px', position: 'relative', borderBottom: `1px solid ${C.line}`}}>
      <div style={{display: 'flex', gap: 7}}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{width: 11, height: 11, borderRadius: 6, background: active ? ['#48515B', '#3A424B', '#2E353D'][i] : '#262C33', boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.12)'}} />
        ))}
      </div>
      {titleLeft}
      <div style={{position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: UI, fontWeight: 500, fontSize: 13.5, letterSpacing: '0.02em', color: active ? C.sub : C.mute, pointerEvents: 'none'}}>{title}</div>
      <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8}}>{titleRight}</div>
    </div>
    {children}
  </div>
);

export const Pill: React.FC<{children: React.ReactNode; bg?: string; color?: string; border?: string; style?: React.CSSProperties}> = ({children, bg = 'rgba(6,8,11,0.62)', color = C.text, border = C.line2, style}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 7, height: 26, padding: '0 11px', borderRadius: 13, background: bg, border: `1px solid ${border}`, color, fontFamily: UI, fontWeight: 500, fontSize: 13, letterSpacing: '0.02em', whiteSpace: 'nowrap', ...style}}>{children}</div>
);

/** Small-caps label used for camera modes, widget headers etc. */
export const Caps: React.FC<{children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties}> = ({children, color = C.sub, size = 11, style}) => (
  <span style={{fontFamily: UI, fontWeight: 600, fontSize: size, letterSpacing: '0.16em', textTransform: 'uppercase', color, ...style}}>{children}</span>
);

// ------------------------------------------------------------------ menu bar
export const MenuBar: React.FC<{app: string; clock: string; zBadge: number; dnd: 'on' | 'broken'; call?: {t: string} | null}> = ({app, clock, zBadge, dnd, call}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 30, background: 'rgba(5,7,10,0.8)', borderBottom: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', padding: '0 18px', fontFamily: UI, fontSize: 14.5, color: C.sub, gap: 22}}>
    {Icon.orb(16, C.text)}
    <span style={{color: C.text, fontWeight: 600}}>{app}</span>
    {['File', 'Edit', 'View', 'Call', 'Window', 'Help'].map((m) => (
      <span key={m}>{m}</span>
    ))}
    <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 18}}>
      {call && (
        <div style={{display: 'flex', alignItems: 'center', gap: 7, height: 20, padding: '0 9px', borderRadius: 10, background: C.orange, color: '#140702', fontWeight: 600, fontSize: 12.5, letterSpacing: '0.04em'}}>
          <div style={{width: 6, height: 6, borderRadius: 3, background: '#140702'}} /> NOLE {call.t}
        </div>
      )}
      <div style={{position: 'relative', display: 'flex'}}>
        {Icon.z(16, C.sub, C.bg)}
        {zBadge > 0 && (
          <div style={{position: 'absolute', left: 10, top: -6, minWidth: 16, height: 14, padding: '0 4px', borderRadius: 7, background: C.orange, color: '#140702', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{zBadge > 99 ? '99+' : zBadge}</div>
        )}
      </div>
      <div style={{position: 'relative', display: 'flex'}}>
        {Icon.moon(15, dnd === 'on' ? C.text : C.orange)}
        {dnd === 'broken' && <div style={{position: 'absolute', left: -2, top: 7, width: 19, height: 1.6, background: C.orange, transform: 'rotate(-40deg)'}} />}
      </div>
      {Icon.wifi(16)}
      {Icon.battery(22)}
      <span style={{color: C.text, fontWeight: 500, fontVariantNumeric: 'tabular-nums'}}>{clock}</span>
    </div>
  </div>
);

// ------------------------------------------------------------------ Z notification (post)
export interface Post {
  text?: string;
  voice?: number; // seconds, renders a voice-note waveform instead of text
  likes: string;
  reposts: string;
  loud?: boolean;
}
export const Toast: React.FC<{post: Post; avatar: React.ReactNode; style?: React.CSSProperties; t?: number}> = ({post, avatar, style, t = 0}) => (
  <div
    style={{
      position: 'absolute',
      width: 392,
      borderRadius: 18,
      background: 'rgba(20,22,27,0.94)',
      border: `1px solid ${C.line2}`,
      boxShadow: '0 18px 40px rgba(0,0,0,0.55)',
      padding: '12px 14px 11px 12px',
      display: 'flex',
      gap: 11,
      fontFamily: UI,
      ...style,
    }}
  >
    <div style={{width: 42, height: 42, borderRadius: 21, overflow: 'hidden', flexShrink: 0, boxShadow: `0 0 0 1.5px ${C.orange}`}}>{avatar}</div>
    <div style={{flex: 1, minWidth: 0}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: C.sub}}>
        <span style={{color: C.text, fontWeight: 600, letterSpacing: '0.04em'}}>NOLE</span>
        {Icon.check(14)}
        <span>@nole · now</span>
        <span style={{marginLeft: 'auto', display: 'flex'}}>{Icon.z(16)}</span>
      </div>
      {post.voice ? (
        <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 6}}>
          <div style={{width: 24, height: 24, borderRadius: 12, background: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 1v8l7-4Z" fill="#140702" /></svg>
          </div>
          <Wave n={34} h={22} t={t} color={C.orangeHot} seed={3} />
          <span style={{fontSize: 13, color: C.sub, fontVariantNumeric: 'tabular-nums'}}>0:0{post.voice}</span>
        </div>
      ) : (
        <div style={{marginTop: 3, fontSize: post.loud ? 19 : 17, fontWeight: post.loud ? 800 : 500, color: C.text, letterSpacing: post.loud ? '0.01em' : 0, lineHeight: 1.22, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{post.text}</div>
      )}
      <div style={{marginTop: 5, display: 'flex', gap: 16, fontSize: 12.5, color: C.mute, fontVariantNumeric: 'tabular-nums'}}>
        <span>♥ {post.likes}</span>
        <span>↻ {post.reposts}</span>
      </div>
    </div>
  </div>
);

/** Voice waveform bars (deterministic). `t` animates the playhead / envelope. */
export const Wave: React.FC<{n: number; h: number; t: number; color: string; seed?: number; level?: number; gap?: number; bw?: number}> = ({n, h, t, color, seed = 1, level = 1, gap = 2, bw = 3}) => (
  <div style={{display: 'flex', alignItems: 'center', gap, height: h}}>
    {Array.from({length: n}).map((_, i) => {
      const base = 0.25 + 0.75 * Math.abs(Math.sin(i * 1.7 + seed) * Math.cos(i * 0.43 + seed * 2));
      const live = 0.55 + 0.45 * Math.sin(t * 0.9 + i * 0.8 + seed);
      const v = Math.max(0.12, Math.min(1, base * (0.4 + 0.6 * live) * level));
      return <div key={i} style={{width: bw, height: Math.max(2, v * h), borderRadius: bw / 2, background: color}} />;
    })}
  </div>
);

// ------------------------------------------------------------------ water widget (the button's hero)
export const WaterWidget: React.FC<{x: number; y: number}> = ({x, y}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 250, height: 250, borderRadius: 30, background: 'linear-gradient(160deg, #111820 0%, #0A0E13 100%)', border: `1px solid ${C.line2}`, boxShadow: '0 30px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)', overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 20, top: 18}}>
      <Caps color={C.sub} size={11}>Water</Caps>
    </div>
    <div style={{position: 'absolute', right: 20, top: 16, fontFamily: UI, fontSize: 12.5, color: C.mute, fontVariantNumeric: 'tabular-nums'}}>250 ml</div>
    <svg width={250} height={250} viewBox="0 0 250 250" style={{position: 'absolute', left: 0, top: 0}}>
      <defs>
        <linearGradient id="ww-water" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#0B3A45" />
          <stop offset="0.62" stopColor="#1590A3" />
          <stop offset="1" stopColor="#7FF2FF" />
        </linearGradient>
        <linearGradient id="ww-glass" x1="0" x2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="0.8" stopColor="rgba(255,255,255,0.09)" />
          <stop offset="1" stopColor="rgba(160,245,255,0.28)" />
        </linearGradient>
        <radialGradient id="ww-caustic" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(63,230,255,0.45)" />
          <stop offset="1" stopColor="rgba(63,230,255,0)" />
        </radialGradient>
      </defs>
      {/* caustic on the "table" */}
      <ellipse cx={133} cy={196} rx={62} ry={9} fill="url(#ww-caustic)" />
      <ellipse cx={125} cy={194} rx={40} ry={6} fill="rgba(0,0,0,0.55)" />
      {/* glass body */}
      <path d="M 88 62 L 162 62 L 154 192 Q 125 198 96 192 Z" fill="url(#ww-glass)" stroke="rgba(200,245,255,0.32)" strokeWidth={1.2} />
      {/* water */}
      <path d="M 91.6 108 L 158.4 108 L 152.8 186 Q 125 191 97.2 186 Z" fill="url(#ww-water)" opacity={0.92} />
      {/* meniscus: perfectly flat */}
      <ellipse cx={125} cy={108} rx={33.4} ry={3.6} fill="#A9F7FF" opacity={0.85} />
      <ellipse cx={125} cy={108} rx={33.4} ry={3.6} fill="none" stroke="#E9FDFF" strokeWidth={0.8} />
      {/* rim */}
      <ellipse cx={125} cy={62} rx={37} ry={4.4} fill="none" stroke="rgba(230,252,255,0.55)" strokeWidth={1.3} />
      {/* wall highlight (monitor side) */}
      <path d="M 154 70 L 158 70 L 151 186 L 148 186 Z" fill="rgba(230,253,255,0.8)" />
      <path d="M 95 72 L 97 72 L 100 180 L 98.5 180 Z" fill="rgba(230,253,255,0.28)" />
      {/* thick base */}
      <path d="M 96 186 Q 125 191 152.8 186 L 154 192 Q 125 198 96 192 Z" fill="rgba(210,250,255,0.35)" />
    </svg>
    <div style={{position: 'absolute', left: 20, bottom: 16, fontFamily: FONT.title, fontStyle: 'italic', fontSize: 30, color: C.text, lineHeight: 1}}>still.</div>
    <div style={{position: 'absolute', right: 20, bottom: 20, fontFamily: UI, fontSize: 12.5, color: C.mute}}>1 of 8 today</div>
  </div>
);

// ------------------------------------------------------------------ cursor
export const Cursor: React.FC<{x: number; y: number; rot?: number; click?: number}> = ({x, y, rot = 0, click = 0}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0}}>
    {click > 0 && click < 1 && (
      <div style={{position: 'absolute', left: -22 * click - 2, top: -22 * click - 2, width: 44 * click + 4, height: 44 * click + 4, borderRadius: '50%', border: `2px solid rgba(63,230,255,${1 - click})`}} />
    )}
    <svg width={26} height={34} viewBox="0 0 26 34" style={{position: 'absolute', left: -3, top: -2, transform: `rotate(${rot}deg)`, transformOrigin: '3px 2px', filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.6))'}}>
      <path d="M3 2 L3 26 L9 20.4 L13.2 30 L17.2 28.2 L13 19 L21 19 Z" fill="#F4F7F9" stroke="#05070A" strokeWidth={1.6} strokeLinejoin="round" />
    </svg>
  </div>
);

// ------------------------------------------------------------------ dock
export const Dock: React.FC<{zBadge: number; bounce?: number[]}> = ({zBadge, bounce = []}) => {
  const icons: {k: string; node: React.ReactNode}[] = [
    {k: 'os', node: <div style={{width: 48, height: 48, borderRadius: 13, background: 'linear-gradient(160deg,#1B222B,#0D1116)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C.line2}`}}>{Icon.orb(26, C.text)}</div>},
    {k: 'presence', node: <div style={{width: 48, height: 48, borderRadius: 13, background: 'linear-gradient(160deg,#0F3A44,#06161B)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid rgba(63,230,255,0.35)`}}>{Icon.cam(24, C.cyan)}</div>},
    {k: 'term', node: <div style={{width: 48, height: 48, borderRadius: 13, background: '#0A0C10', display: 'flex', alignItems: 'center', padding: '0 9px', border: `1px solid ${C.line2}`, fontFamily: MONO, fontWeight: 700, fontSize: 17, color: C.sub}}>&gt;_</div>},
    {k: 'z', node: <div style={{display: 'flex', borderRadius: 13, overflow: 'hidden'}}>{Icon.z(48)}</div>},
    {k: 'notes', node: <div style={{width: 48, height: 48, borderRadius: 13, background: 'linear-gradient(180deg,#E9E4D6,#CFC8B6)', display: 'flex', flexDirection: 'column', gap: 5, padding: '13px 10px'}}>{[1, 0.8, 0.9].map((w, i) => <div key={i} style={{height: 3, width: `${w * 100}%`, background: '#8B8475', borderRadius: 2}} />)}</div>},
  ];
  return (
    <div style={{position: 'absolute', left: 960 - 190, top: 1002, width: 380, height: 66, borderRadius: 22, background: 'rgba(16,19,24,0.72)', border: `1px solid ${C.line2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, boxShadow: '0 20px 40px rgba(0,0,0,0.5)'}}>
      {icons.map((ic, i) => (
        <div key={ic.k} style={{position: 'relative', transform: `translateY(${-(bounce[i] ?? 0)}px)`}}>
          {ic.node}
          {ic.k === 'z' && zBadge > 0 && (
            <div style={{position: 'absolute', right: -7, top: -6, minWidth: 22, height: 20, padding: '0 5px', borderRadius: 10, background: C.orange, color: '#140702', fontFamily: UI, fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 2px #10131A'}}>{zBadge > 99 ? '99+' : zBadge}</div>
          )}
          {(ic.k === 'presence' || ic.k === 'term' || ic.k === 'z') && <div style={{position: 'absolute', left: 21, bottom: -7, width: 5, height: 5, borderRadius: 3, background: C.sub}} />}
        </div>
      ))}
    </div>
  );
};
