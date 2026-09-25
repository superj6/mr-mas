import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../shared/theme/fonts';
import {PaperDefs, Piece, Brad, Thread, LightCtx, StockCtx, cut, rect, oval, rnd, hash, type StockMode} from './paper';
import {Mas, ProfileHead, FrontHead, FM, MAS_C, type MasMouth} from './mas';
import {Nole, NOLE_H, NOLE_C} from './nole';

/** Printed paper tag with a typewriter label. */
const Tag: React.FC<{x: number; y: number; a?: number; w: number; text: string; sub?: string; seed: number}> = ({x, y, a = 0, w, text, sub, seed}) => (
  <g transform={`translate(${x} ${y}) rotate(${a})`}>
    <Piece d={cut([[0, 0, 1], [w, 0, 1], [w + 16, 17, 1], [w, 34, 1], [0, 34, 1]], {seed, jit: 0.6})} fill="#efe6cf" z={1.2} tex="card" edge={0.3} />
    <circle cx={w - 1} cy={17} r={3.4} fill="#7b6b52" opacity={0.6} />
    <text x={10} y={sub ? 15 : 22} fontFamily={FONT.newsMono} fontSize={13} fill="#2a241c" letterSpacing={0.6}>
      {text}
    </text>
    {sub ? (
      <text x={10} y={28} fontFamily={FONT.newsMono} fontSize={10} fill="#5a4f40" letterSpacing={0.4}>
        {sub}
      </text>
    ) : null}
  </g>
);

/** Split pin lying on its side, prongs open. */
const LoosePin: React.FC<{x: number; y: number; a: number}> = ({x, y, a}) => (
  <g transform={`translate(${x} ${y}) rotate(${a}) scale(1.7)`}>
    <path d="M 0 0 L 22 -3 M 0 0 L 22 4" stroke="#000" strokeOpacity={0.35} strokeWidth={3} transform="translate(2 3)" filter="url(#pz-b1)" />
    <path d="M 0 0 L 22 -3 M 0 0 L 22 4" stroke="#c9a458" strokeWidth={2.2} strokeLinecap="round" />
    <Brad r={6} />
  </g>
);

// ------------------------------------------------------------------ LINEUP: height chart, daylight
export const PuppetLineup: React.FC = () => {
  const lines: React.ReactNode[] = [];
  for (let i = 0; i <= 30; i++) {
    const y = 1000 - i * 30;
    const major = i % 4 === 0;
    lines.push(<rect key={i} x={0} y={y - (major ? 2 : 0.8)} width={1920} height={major ? 4 : 1.6} fill="#2b2a26" opacity={major ? 0.55 : 0.28} />);
    if (major && i > 0)
      lines.push(
        <text key={`t${i}`} x={60} y={y - 10} fontFamily={FONT.poster} fontSize={40} fill="#2b2a26" opacity={0.6}>
          {`${i / 4}'`}
        </text>,
        <text key={`r${i}`} x={1860} y={y - 10} fontFamily={FONT.poster} fontSize={40} fill="#2b2a26" opacity={0.6} textAnchor="end">
          {`${i / 4}'`}
        </text>,
      );
  }
  return (
    <AbsoluteFill style={{background: '#1b1a18'}}>
      <PaperDefs />
      <LightCtx.Provider value={{dx: -2.6, dy: 3.6, op: 0.5, form: 1}}>
        <div style={{position: 'absolute', inset: 0}}>
          <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
            <Piece d={rect(-20, -20, 1960, 1120, 5, 0)} fill="#c9cdbd" z={0} tex="card" edge={0} />
            {lines}
            <Piece d={rect(-20, 1000, 1960, 100, 6, 0.5)} fill="#8b7a62" z={1} tex="kraft" />
            {/* nameplates */}
            {[
              [760, 'MAS MANALT', 'no. 1'],
              [1190, 'NOLE', 'no. 2'],
            ].map(([x, n, k], i) => (
              <g key={i} transform={`translate(${(x as number) - 110} 1016)`}>
                <Piece d={rect(0, 0, 220, 50, 40 + i, 0.8)} fill="#1c1c1e" z={1.6} tex="dark" edge={0.3} />
                <text x={110} y={34} textAnchor="middle" fontFamily={FONT.bass} fontWeight={900} fontSize={26} letterSpacing={2} fill="#efe8d6">
                  {n}
                </text>
                <text x={206} y={14} textAnchor="end" fontFamily={FONT.newsMono} fontSize={10} fill="#bdb6a4">
                  {k}
                </text>
              </g>
            ))}
          </svg>
        </div>
        {/* puppets pinned a few cm off the chart: one soft cast shadow each */}
        <div style={{position: 'absolute', inset: 0, filter: 'drop-shadow(-16px 22px 14px rgba(20,16,10,0.42))'}}>
          <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
            <g transform="translate(760 662)">
              <Mas p={{head: 'front', sit: false, torsoA: 0, nSh: 3, nEl: 5, nWr: 2, fSh: 1, fEl: 5, fWr: 0, lookX: 0, lookY: 0, mouth: 'rest', headA: 0}} />
            </g>
            <g transform="translate(1190 638)">
              <Nole p={{torsoA: 1, pSh: 38, pEl: 70, pWr: -30, bSh: -4, bEl: -6, bWr: 0, fTh: 5, fKn: 0, bTh: -4, bKn: 2, jaw: 0.25, brow: 1, lookX: -0.3, lookY: 0}} />
            </g>
          </svg>
        </div>
      </LightCtx.Provider>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 42% 35%, rgba(255,240,210,0.14), transparent 55%)', mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.5) 120%)'}} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ KIT: the replacement parts tray, flat lay on a cutting mat
export const PuppetKit: React.FC = () => {
  const grid: React.ReactNode[] = [];
  for (let x = 0; x <= 1920; x += 40) grid.push(<rect key={`x${x}`} x={x} y={0} width={x % 200 === 0 ? 1.6 : 0.8} height={1080} fill="#b9dccb" opacity={x % 200 === 0 ? 0.5 : 0.25} />);
  for (let y = 0; y <= 1080; y += 40) grid.push(<rect key={`y${y}`} x={0} y={y} width={1920} height={y % 200 === 0 ? 1.6 : 0.8} fill="#b9dccb" opacity={y % 200 === 0 ? 0.5 : 0.25} />);
  const mouths: MasMouth[] = ['rest', 'smile', 'p', 's', 'u', 'er'];
  const r = rnd(77);
  const pins = Array.from({length: 9}).map((_, i) => [1480 + r() * 360, 760 + r() * 260, r() * 360] as const);
  return (
    <AbsoluteFill style={{background: '#20352c'}}>
      <PaperDefs />
      <LightCtx.Provider value={{dx: 2.4, dy: 3.8, op: 0.55, form: 1}}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
          <rect width={1920} height={1080} fill="#2c5242" />
          <rect width={1920} height={1080} fill="url(#pz-t-soft)" opacity={0.6} />
          {grid}
          <path d="M 0 1080 L 1080 0 M 400 1080 L 1480 0 M 800 1080 L 1880 0" stroke="#b9dccb" strokeOpacity={0.18} strokeWidth={1} />
          {/* MAS: two replacement heads */}
          <g transform="translate(300 420) scale(2.3)">
            <ProfileHead p={{lookX: -0.6, lookY: 0.1}} />
          </g>
          <Tag x={150} y={500} a={-3} w={210} text="MAS · HEAD A" sub="profile · typing" seed={501} />
          <g transform="translate(700 420) scale(2.3)">
            <FrontHead p={{lookX: 0.8, lookY: 0.1, mouth: 'smile'}} />
          </g>
          <Tag x={590} y={500} a={2} w={210} text="MAS · HEAD B" sub="front · the turn" seed={502} />
          {/* replacement mouths, each glued to a skin chip */}
          {mouths.map((m, i) => (
            <g key={m} transform={`translate(${190 + i * 118} ${690 + (i % 2) * 14}) rotate(${(hash(i + 9) - 0.5) * 16})`}>
              <Piece d={oval(0, 0, 44, 30, 600 + i, 12, 1.2)} fill={MAS_C.skin} z={1.4} tex="card" edge={0.25} />
              <g transform="scale(4.2) translate(6 5)">
                {FM[m].open ? (
                  <>
                    <Piece d={FM[m].d} fill={MAS_C.mouth} z={0} tex="none" edge={0} />
                    {m === 's' ? <Piece d={cut([[-13, -6.6], [1, -6.6], [0, -5], [-12, -5]], {seed: 93})} fill="#f4efe6" z={0} tex="none" edge={0} /> : null}
                  </>
                ) : (
                  <Piece d={FM[m].d} fill={MAS_C.mouth} z={0} tex="none" edge={0} />
                )}
              </g>
              <text x={0} y={52} textAnchor="middle" fontFamily={FONT.newsMono} fontSize={14} fill="#e9f3ec" opacity={0.85}>
                {['A rest', 'B smile', 'C p/b/m', 'D s', 'E oo', 'F er'][i]}
              </text>
            </g>
          ))}
          <Tag x={150} y={800} a={-1} w={250} text="MOUTHS A–F" sub="swap on twos · 6 cards" seed={503} />
          {/* lids */}
          {[0.5, 1].map((l, i) => (
            <g key={l} transform={`translate(${470 + i * 150} 900) scale(3.2) translate(29 54)`}>
              <Piece d={oval(-29, -54, 18, 11, 700 + i, 10, 0.4)} fill={MAS_C.skinDk} z={1.2} tex="card" edge={0.3} />
              <Piece d={cut([[-43, -54.5, 1], [-33, -61.8], [-20.5, -59.8], [-15, -54, 1], l < 0.75 ? [-29, -55.6] : [-27, -47.6]], {seed: 710 + i, jit: 0.1})} fill={MAS_C.skin} z={0.6} />
            </g>
          ))}
          <Tag x={560} y={950} a={3} w={200} text="LIDS ½ · 1" sub="one blink = 4 exposures" seed={504} />
          {/* NOLE: head exploded off its jaw pin */}
          <g transform="translate(1300 440) scale(2.1) scale(0.74)">
            <Piece d={NOLE_H.mouthIn} fill={NOLE_C.mouth} z={0} edge={0} tex="none" />
            <Piece d={oval(-44, -71.5, 15, 7.5, 230)} fill={NOLE_C.eye} z={0} tex="soft" edge={0} />
            <Piece d={oval(-48, -71, 4.6, 4.6, 231, 8, 0.1)} fill={NOLE_C.iris} z={0.3} edge={0.1} />
            <Piece d={`${NOLE_H.upper} ${NOLE_H.eyeHole}`} rule="evenodd" fill={NOLE_C.skin} z={1.3} />
            <Piece d={NOLE_H.lash} fill={NOLE_C.brow} z={0.2} edge={0} tex="none" />
            <Piece d={NOLE_H.brow} fill={NOLE_C.brow} z={0.6} />
            <Piece d={NOLE_H.ear} fill={NOLE_C.skinDk} z={0.8} />
            <Piece d={NOLE_H.hair} fill={NOLE_C.hair} z={1.5} tex="dark" />
            <Piece d={NOLE_H.streak1} fill={NOLE_C.hairLt} z={0.5} op={0.9} tex="dark" />
            <g transform="translate(26 92) rotate(-14)">
              <Piece d={NOLE_H.jaw} fill={NOLE_C.skin} z={2} />
              <Piece d={NOLE_H.jawSh} fill={NOLE_C.skinSh} z={0} edge={0} op={0.55} />
              <Piece d={NOLE_H.lowerLip} fill="#b8786a" z={0.2} edge={0} />
            </g>
          </g>
          <LoosePin x={1440} y={500} a={30} />
          <Thread d="M 1318 362 C 1360 420 1400 470 1436 498" color="#f4ecd8" w={1} op={0.5} />
          <Tag x={1200} y={620} a={-2} w={230} text="NOLE · JAW ON PIN" sub="mouth = hinge angle" seed={505} />
          {/* hands */}
          <g transform="translate(1680 330) scale(2.2) rotate(30)">
            <Piece d={cut([[-13, -4], [12, -4], [16, 14], [13, 32], [0, 38], [-12, 32], [-16, 14]], {seed: 263})} fill={NOLE_C.skin} z={1.2} />
            <g transform="translate(0 6) rotate(-8)">
              <Piece d={cut([[-12, 0, 1], [12, 0, 1], [12, 58, 1], [-12, 58, 1]], {seed: 270, jit: 0.3})} fill={NOLE_C.phone} z={1.2} tex="dark" edge={0.3} />
              <Piece d={cut([[-9, 4, 1], [9, 4, 1], [9, 54, 1], [-9, 54, 1]], {seed: 271, jit: 0.2})} fill={NOLE_C.screen} z={0} tex="soft" edge={0} />
            </g>
          </g>
          <Tag x={1630} y={500} a={4} w={170} text="PHONE HAND" sub="glows (tissue)" seed={506} />
          {/* loose brads + a knife */}
          {pins.map(([x, y, a], i) => (
            <LoosePin key={i} x={x} y={y} a={a} />
          ))}
          <g transform="translate(1130 900) rotate(-18)">
            <Piece d={rect(0, -9, 300, 18, 801, 0.2)} fill="#9ea4aa" z={2.2} tex="none" edge={0.4} shade="url(#pz-sh-12)" />
            {[30, 50, 70, 90, 110].map((x) => (
              <rect key={x} x={x} y={-9} width={3} height={18} fill="#5d6268" opacity={0.6} />
            ))}
            <Piece d={cut([[300, -6, 1], [334, -6, 1], [376, 2, 1], [300, 7, 1]], {seed: 802, jit: 0.1})} fill="#d9dde0" z={1.6} tex="none" edge={0.6} />
          </g>
          {/* offcuts */}
          <Piece d={cut([[860, 820], [960, 790], [1010, 860], [930, 900]], {seed: 820})} fill="#a86a5e" z={0.8} tex="card" />
          <Piece d={cut([[930, 730], [1020, 740], [990, 790]], {seed: 821})} fill={MAS_C.hoodie} z={0.8} tex="card" />
          <Piece d={cut([[1010, 950], [1090, 930], [1100, 990], [1030, 1010]], {seed: 822})} fill="#dcb94c" z={0.8} tex="card" />
          <text x={1880} y={1050} textAnchor="end" fontFamily={FONT.newsMono} fontSize={14} fill="#e9f3ec" opacity={0.7} letterSpacing={1}>
            MR. MAS · PUPPET KIT · 1 cm grid
          </text>
        </svg>
      </LightCtx.Provider>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 40% 30%, rgba(255,245,220,0.16), transparent 60%)', mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 125%)'}} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ STOCKS: the sparing style switch = same rig, different paper
const StockPanel: React.FC<{mode: StockMode; x: number; bg: string; ink: string; title: string; sub: string}> = ({mode, x, bg, ink, title, sub}) => (
  <g transform={`translate(${x} 0)`}>
    <clipPath id={`pz-stockclip-${mode}`}>
      <rect x={0} y={0} width={640} height={1080} />
    </clipPath>
    <g clipPath={`url(#pz-stockclip-${mode})`}>
      <rect width={640} height={1080} fill={bg} />
      {mode !== 'bit' ? <Piece d={rect(-20, -20, 680, 1120, 900 + x, 0)} fill={bg} z={0} tex={mode === 'paper' ? 'soft' : 'card'} edge={0} /> : null}
      <StockCtx.Provider value={mode}>
        <g transform="translate(190 900) scale(1.42)">
          <Mas p={{head: 'front', sit: false, torsoA: 0, nSh: 3, nEl: 5, nWr: 2, fSh: 1, fEl: 5, lookX: 0.8, mouth: 'smile'}} />
        </g>
        <g transform="translate(500 930) scale(1.32)">
          <Nole p={{torsoA: -6, pSh: 72, pEl: 58, pWr: -24, bSh: -4, bEl: -6, jaw: 0.55, brow: 1, lookX: -0.6, lookY: 0.2}} />
        </g>
      </StockCtx.Provider>
      <rect x={0} y={0} width={640} height={1080} fill="url(#pz-stockvig)" />
    </g>
    <text x={36} y={66} fontFamily={FONT.bass} fontWeight={900} fontSize={30} letterSpacing={2} fill={ink}>
      {title}
    </text>
    <text x={36} y={98} fontFamily={FONT.newsMono} fontSize={16} fill={ink} opacity={0.8}>
      {sub}
    </text>
    <rect x={638} y={0} width={4} height={1080} fill="#111" />
  </g>
);

export const PuppetStocks: React.FC = () => (
  <AbsoluteFill style={{background: '#111'}}>
    <PaperDefs />
    <svg width={0} height={0} style={{position: 'absolute'}}>
      <defs>
        <radialGradient id="pz-stockvig" cx="0.5" cy="0.45" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.55} />
        </radialGradient>
      </defs>
    </svg>
    <LightCtx.Provider value={{dx: -2.6, dy: 3.6, op: 0.5, form: 1}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
        <StockPanel mode="paper" x={0} bg="#b9bfae" ink="#1d1d1b" title="SHOW STOCK" sub="coloured card · the default" />
        <StockPanel mode="engrave" x={640} bg="#efe7cf" ink="#1f3a2c" title="BANKNOTE STOCK" sub="money flashbacks · same rig" />
        <StockPanel mode="bit" x={1280} bg="#07120a" ink="#8dffb0" title="PUNCH-CARD STOCK" sub="AI / 1993 moments · same rig" />
      </svg>
    </LightCtx.Provider>
  </AbsoluteFill>
);
