import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, UI, Win, Pill, Caps, MenuBar, Icon} from './ui';
import {LineScreen} from './LineScreen';
import {paintMasBust, paintNoleBust, paintMasFeed} from './feeds';
import {Wallpaper} from './Wallpaper';
import {masTone} from '../../shared/tonal/masTone';
import {ToneSvg} from '../../shared/tonal/ToneSvg';
import {ToneCanvas} from '../../shared/tonal/ToneCanvas';
import {TONE_STYLES} from '../../shared/tonal/styles';
import {FONT} from '../../shared/theme/fonts';

const dev = () => (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);

// =====================================================================================
// LINEUP: the two leads as Z profile cards, same scale, same ground line.
// Nole breaks his frame (he never fits a tile) — a staging rule, not an accident.
// =====================================================================================
const Card: React.FC<{who: 'mas' | 'nole'; x: number}> = ({who, x}) => {
  const mas = who === 'mas';
  const W = 700;
  const PH = 600;
  const accent = mas ? C.cyan : C.orange;
  const over = mas ? 0 : 64; // Nole's head overshoots the portrait frame
  return (
    <div style={{position: 'absolute', left: x, top: 92, width: W, borderRadius: 26, background: C.win, border: `1px solid ${C.line2}`, boxShadow: '0 40px 90px rgba(0,0,0,0.6)'}}>
      <div style={{height: 64, display: 'flex', alignItems: 'center', padding: '0 22px', gap: 12, borderBottom: `1px solid ${C.line}`}}>
        {Icon.z(24)}
        <Caps color={C.sub} size={12}>Profile</Caps>
        <div style={{marginLeft: 'auto'}}>
          <Pill color={C.sub}>
            {Icon.lines(11, accent)} <span style={{letterSpacing: '0.14em', fontSize: 11}}>LOW-LIGHT PORTRAIT</span>
          </Pill>
        </div>
      </div>
      <div style={{position: 'relative', width: W, height: PH}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: W, height: PH, overflow: 'hidden'}}>
          <LineScreen
            width={W}
            height={PH}
            dpr={dev()}
            staticKey={`card-${who}`}
            pitch={dev() >= 1 ? 4.4 : 5.4}
            soften={1.1}
            floor={0.03}
            gamma={1.1}
            gain={mas ? 1.12 : 1}
            bg={mas ? C.cyanDeep : C.orangeDeep}
            ink={mas ? C.cyanInk : C.orangeInk}
            hi={mas ? '#E6FEFF' : '#FFF1DF'}
            paint={(c, w, h) => {
              if (mas) paintMasBust(c, w, h, w * 0.46, 300, 0.86, {lookX: 0.35, lookY: 0.05, mouth: 'rest'}, 0.07);
              else paintNoleBust(c, w, h, w * 0.5, 184, 0.86, {mouth: 'grin', brow: 0.5}, 0.24);
            }}
          />
        </div>
        {!mas && (
          // the part of Nole that doesn't fit: screened with no backdrop, over the card header
          <div style={{position: 'absolute', left: 0, top: -over, width: W, height: over}}>
            <LineScreen
              width={W}
              height={over}
              dpr={dev()}
              staticKey="card-nole-over"
              pitch={dev() >= 1 ? 4.4 : 5.4}
              soften={1.1}
              floor={0}
              gamma={1.1}
              bg="transparent"
              ink={C.orangeInk}
              hi="#FFF1DF"
              paint={(c, w, h) => paintNoleBust(c, w, h, w * 0.5, 184 + over, 0.86, {mouth: 'grin', brow: 0.5}, 0)}
            />
          </div>
        )}
        {/* frame line Nole breaks */}
        {!mas && <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 1, background: C.line2}} />}
        <div style={{position: 'absolute', left: 22, bottom: 20}}>
          <Pill>
            <div style={{width: 7, height: 7, borderRadius: 4, background: accent}} />
            {mas ? 'online · Do Not Disturb' : 'online · always'}
          </Pill>
        </div>
      </div>
      <div style={{padding: '22px 28px 26px', fontFamily: UI, borderTop: `1px solid ${C.line}`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <div style={{fontWeight: 800, fontSize: 38, color: C.text, letterSpacing: '0.01em'}}>{mas ? 'MAS MANALT' : 'NOLE'}</div>
          {!mas && Icon.check(24)}
          <div style={{marginLeft: 'auto', height: 42, padding: '0 22px', borderRadius: 21, display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: 16, background: mas ? 'transparent' : C.orange, color: mas ? C.text : '#140702', border: mas ? `1px solid ${C.line2}` : 'none'}}>{mas ? 'Follow' : 'Following you'}</div>
        </div>
        <div style={{fontSize: 18, color: C.sub, marginTop: 2}}>{mas ? '@mas · joined quietly' : '@nole · joined first'}</div>
        <div style={{fontSize: 21, color: C.text, marginTop: 14, fontWeight: 500}}>{mas ? 'building carefully. mostly water.' : 'I name things. CEO of several things.'}</div>
        <div style={{display: 'flex', gap: 26, marginTop: 14, fontSize: 17, color: C.sub, fontVariantNumeric: 'tabular-nums'}}>
          <span>
            <b style={{color: C.text}}>{mas ? '212' : '1'}</b> Following
          </span>
          <span>
            <b style={{color: C.text}}>{mas ? '4.1M' : '212M'}</b> Followers
          </span>
          <span>
            <b style={{color: C.text}}>{mas ? '3' : '48,112'}</b> Posts today
          </span>
        </div>
      </div>
    </div>
  );
};

export const LineupFrame: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <Wallpaper />
    <MenuBar app="Z" clock="11:57 PM" zBadge={0} dnd="on" />
    <Card who="mas" x={200} />
    <Card who="nole" x={1020} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 34, textAlign: 'center'}}>
      <Caps color={C.mute} size={12}>MR. MAS · screenlife lookdev · leads at shared scale, shared ground line</Caps>
    </div>
  </AbsoluteFill>
);

// =====================================================================================
// STYLE SWITCHES: in this structure a switch is a *document or an app*, never a filter.
// =====================================================================================
const Guilloche: React.FC<{w: number; h: number; ink: string}> = ({w, h, ink}) => {
  const rows: string[] = [];
  for (let k = 0; k < 7; k++) {
    let d = '';
    for (let x = 0; x <= w; x += 4) {
      const y = 14 + k * 2.2 + Math.sin(x * 0.09 + k * 0.7) * 6 + Math.sin(x * 0.023 + k) * 3;
      d += `${x === 0 ? 'M' : 'L'} ${x} ${y.toFixed(2)} `;
    }
    rows.push(d);
  }
  return (
    <svg width={w} height={40} style={{display: 'block'}}>
      {rows.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={ink} strokeWidth={0.8} opacity={0.8} />
      ))}
    </svg>
  );
};

const Certificate: React.FC = () => {
  const s = TONE_STYLES.engrave;
  const ink = s.ink;
  return (
    <div style={{width: 760, height: 500, background: s.paper, position: 'relative', overflow: 'hidden', color: ink}}>
      <div style={{position: 'absolute', inset: 14, border: `2px solid ${ink}`}} />
      <div style={{position: 'absolute', inset: 22, border: `0.8px solid ${ink}`}} />
      <div style={{position: 'absolute', left: 26, right: 26, top: 26}}>
        <Guilloche w={708} h={40} ink={ink} />
      </div>
      <div style={{position: 'absolute', left: 26, right: 26, bottom: 24, transform: 'scaleY(-1)'}}>
        <Guilloche w={708} h={40} ink={ink} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: FONT.title, fontWeight: 800, fontSize: 40, letterSpacing: '0.12em'}}>MANALT CAPITAL</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 118, textAlign: 'center', fontFamily: FONT.title, fontStyle: 'italic', fontSize: 19}}>certificate of one hundred billion shares · non-voting · non-profit (mostly)</div>
      <div style={{position: 'absolute', left: 270, top: 146, width: 220, height: 244, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${ink}`, boxShadow: `0 0 0 5px ${s.paper}, 0 0 0 6px ${ink}`}}>
        <svg width={220} height={244} viewBox="-212 -318 440 488">
          <rect x={-212} y={-318} width={440} height={488} fill={s.paper} />
          <ToneSvg model={masTone({lookX: 0.3, mouth: 'rest'})} style="engrave" uid="cert" />
        </svg>
      </div>
      {[
        [70, 'No. 0000001'],
        [560, 'SERIES A–Z'],
      ].map(([x, t]) => (
        <div key={t as string} style={{position: 'absolute', left: x as number, top: 250, width: 130, textAlign: 'center', fontFamily: FONT.newsMono, fontSize: 14, letterSpacing: '0.1em'}}>
          {t}
        </div>
      ))}
      <div style={{position: 'absolute', left: 0, right: 0, top: 404, textAlign: 'center', fontFamily: FONT.title, fontSize: 13, letterSpacing: '0.3em'}}>ISSUED · SAN FRANCISCO · 2019</div>
    </div>
  );
};

const RetroWin: React.FC<{x: number; y: number}> = ({x, y}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 520, background: '#fff', border: '2px solid #000', boxShadow: '8px 8px 0 #000'}}>
    <div style={{height: 26, borderBottom: '2px solid #000', position: 'relative', background: 'repeating-linear-gradient(0deg, #000 0 1.5px, #fff 1.5px 4px)'}}>
      <div style={{position: 'absolute', left: 8, top: 4, width: 16, height: 16, background: '#fff', border: '2px solid #000'}} />
      <div style={{position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', background: '#fff', padding: '0 12px', fontFamily: FONT.pixel, fontSize: 15, lineHeight: '24px', color: '#000'}}>ASK.EXE (1993)</div>
    </div>
    <div style={{display: 'flex', gap: 14, padding: 14}}>
      <div style={{border: '2px solid #000', width: 240, height: 300, overflow: 'hidden', imageRendering: 'pixelated'}}>
        <ToneCanvas model={masTone({lookX: 0.2})} mode="dither" style="dither" width={240} height={300} view={[-260, -320, 520, 650]} cell={3} background="#ffffff" />
      </div>
      <div style={{flex: 1, fontFamily: FONT.osd, fontSize: 25, lineHeight: 1.05, color: '#000'}}>
        &gt; HELLO.
        <br />
        &gt; WHAT SHOULD
        <br />
        &nbsp;&nbsp;WE CALL YOU?
        <br />
        <br />
        &gt; ...
        <br />
        &gt; LATER.
        <span style={{display: 'inline-block', width: 12, height: 20, background: '#000', marginLeft: 4, verticalAlign: -3}} />
      </div>
    </div>
  </div>
);

export const SwitchFrame: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <Wallpaper />
    <MenuBar app="Preview" clock="11:59 PM" zBadge={0} dnd="on" />
    {/* the house look, for reference */}
    <Win x={70} y={120} w={480} title="Presence — Camera">
      <LineScreen width={480} height={360} dpr={dev()} staticKey="sw-mas" pitch={dev() >= 1 ? 4.2 : 5.2} soften={1.2} floor={0.03} gamma={1.12} bg={C.cyanDeep} ink={C.cyanInk} hi="#E6FEFF" paint={(c, w, h) => paintMasFeed(c, w, h, {rig: {lookX: 0.3}, scale: 0.56, glass: true})} />
    </Win>
    {/* money flashback = an engraved document opened in Preview */}
    <Win x={600} y={96} w={760} title="certificate_2019.pdf — Preview">
      <Certificate />
    </Win>
    {/* 1993 / AI tier = an ancient app window */}
    <RetroWin x={1340} y={470} />
    {[
      [70, 560, 'HOUSE', 'line-screen video · every camera feed'],
      [600, 670, 'MONEY FLASHBACK', 'engraved document · opened, zoomed, scanned'],
      [1340, 880, '1993 / THE MACHINE', '1-bit application · its own window chrome'],
    ].map(([x, y, a, b]) => (
      <div key={a as string} style={{position: 'absolute', left: x as number, top: (y as number) + 20, fontFamily: UI}}>
        <Caps color={C.text} size={13}>{a}</Caps>
        <div style={{fontSize: 16, color: C.sub, marginTop: 4}}>{b}</div>
      </div>
    ))}
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 34, textAlign: 'center'}}>
      <Caps color={C.mute} size={12}>style switches arrive as documents and apps on the same desktop — the camera opens them, the show never changes filter</Caps>
    </div>
  </AbsoluteFill>
);
