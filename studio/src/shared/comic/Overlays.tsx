/**
 * Lettering layer (builder: comic): captions, balloons, SFX — in page coordinates, above the panels,
 * free to break borders and cross gutters. Timings from script.ts.
 */
import React from 'react';
import {Balloon, Caption, Sfx, LetterPaths} from './Letterers';
import {panel, T} from './script';
import {clamp, onN} from './geo';
import {INKS, PAPER} from './print';

const pop = (f: number, at: number, len = 4) => clamp((f - at) / len);

export const Overlays: React.FC<{f: number; all: boolean; shake: [number, number]}> = ({f, all}) => {
  const F = all ? 999 : f;
  const p1 = panel('p1');
  // typing SFX: small lettering that ticks in with the keystrokes
  const taps = ['TAK', 'TIKKA', 'TAK', 'TAK'];
  const tapN = Math.min(taps.length, Math.floor((onN(F, 2) - 2) / 5) + 1);
  return (
    <g>
      <Caption x={p1.x + 30} y={p1.y + 26} text={'11:58 P.M.'} size={30} fill="#E7D9A8" appear={pop(F, T.cap1)} seed={2} />
      <Caption x={p1.x + 30} y={p1.y + 96} text={"THE CITY SLEPT.\nTHE MODEL DIDN'T."} size={30} fill="#E7D9A8" appear={pop(F, T.cap2)} seed={5} />
      {F < 60 &&
        taps.slice(0, Math.max(0, tapN)).map((t, i) => (
          <g key={i} transform={`translate(${p1.x + 700 + i * 70} ${p1.y + 520 - (i % 2) * 22}) rotate(${-8 + i * 5})`}>
            <LetterPaths text={t} size={20} color={PAPER} weight={0.16} seed={i + 9} />
          </g>
        ))}
    </g>
  );
};
