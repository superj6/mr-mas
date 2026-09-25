import React, {useMemo} from 'react';
import {masTone, MasToneParams} from '../tonal/masTone';
import {ToneSvg} from '../tonal/ToneSvg';
import {TONE_STYLES} from '../tonal/styles';
import {MasHead, INK} from './heads';
import {Piece, STOCK, Wash} from './paper';
import {Engr, Region} from './engr';
import {HAND, handTone, tubeD, tubeFamily, tubeTone} from './limbs';
import {P2, clamp, boil} from './core';

/**
 * COLLAGE — MAS MANALT as a cut-out: a banknote-portrait head (big, André-Gill proportions) on a small
 * catalogue-engraved hoodie torso, sleeves and hands from other catalogues. He faces screen-left (his
 * Thinking Cabinet). World coords.
 */
export const MAS = {
  head: [930, 425] as P2,
  headScale: 0.8,
  neck: [914, 585] as P2,
  body: [925, 436] as P2,
  bodyScale: 0.66,
};

export interface MasPose {
  head?: MasToneParams;
  jaw?: number;
  /** Card-flip of the head: 0 = facing left (monitor), 1 = flipped to face right (Nole). */
  flip?: number;
  /** Head tilt degrees around the neck. */
  tilt?: number;
  /** Head bob offset (y). */
  bob?: number;
  /** Near / far forearm lift in degrees (typing). */
  nearLift?: number;
  farLift?: number;
  cyan?: number;
  warm?: number;
  /** frame, for the rostrum boil */
  f?: number;
  pitchHead: number;
  pitch: number;
}

const LIGHT: P2 = [-0.9, -0.3];

const Torso: React.FC<{pitch: number; cyan: number}> = ({pitch, cyan}) => {
  const model = useMemo(() => {
    const m = masTone({});
    const paths = m.paths.filter((p) => p.transform === 'translate(0 -36)').map((p) => ({...p, transform: undefined}));
    return {...m, paths, box: [-270, 180, 540, 400] as [number, number, number, number]};
  }, []);
  const style = {...TONE_STYLES.engrave, ink: INK.cat, spot: INK.cat, paper: STOCK.news.paper, pitch: pitch / MAS.bodyScale};
  const sil = model.paths.filter((p) => !p.line).map((p) => ({d: p.d}));
  const hood = model.paths.filter((p) => !p.line && p.hue === 'hoodie').map((p) => p.d).join(' ');
  return (
    <g transform={`translate(${MAS.body[0]} ${MAS.body[1]}) scale(${-MAS.bodyScale} ${MAS.bodyScale}) translate(0 -36)`}>
      <Piece id="mas-torso" sil={sil} stock={STOCK.news} margin={12} shadow={[-6, 8, 7, 0.5]} box={[-280, 170, 560, 420]}
        over={
          <>
            <Wash id="mas-hoodie" d={hood} color="#8E949E" opacity={0.5} blur={8} />
            <Wash id="mas-hoodie-cy" d={hood} color="#6FE3F0" opacity={0.35 * cyan} blur={30} blend="screen" />
          </>
        }>
        <ToneSvg model={model} style={style} uid="mastorso" />
      </Piece>
      {/* the catalogue caption left on the cut-out */}
      <text x={-150} y={520} transform="scale(-1 1)" fontFamily='"Playfair Display", serif' fontStyle="italic" fontSize={22} fill={INK.cat} opacity={0.8}>
        No. 4471. The “Founder” Hooded Jersey, grey marl — 4s. 6d.
      </text>
    </g>
  );
};

const Arm: React.FC<{id: string; el: P2; wr: P2; lift: number; pitch: number; cyan: number; dark?: boolean}> = ({id, el, wr, lift, pitch, cyan, dark}) => {
  const tube = tubeD(el, wr, 27, 21);
  const regionsF: Region[] = [{d: tube, tone: tubeTone(el, wr, 27, LIGHT, dark ? 0.2 : 0.32, 0.55), fam: [tubeFamily(el, wr, 29)], k: 1}];
  const c0: P2 = [wr[0] + (el[0] - wr[0]) * 0.16, wr[1] + (el[1] - wr[1]) * 0.16];
  const cuffD = tubeD(c0, wr, 22, 21);
  const cuff: Region[] = [{d: cuffD, tone: () => (dark ? 0.25 : 0.4), fam: [{angle: 64}], k: 0.55}];
  const ang = (Math.atan2(el[1] - wr[1], el[0] - wr[0]) * 180) / Math.PI;
  const handRot = ang - 8;
  const handRegions: Region[] = [
    {d: HAND.palm, tone: (x, y) => handTone(x, y) - (dark ? 0.15 : 0), fam: [{angle: 70}], k: 0.8},
    {d: HAND.thumb, tone: () => 0.35, fam: [{angle: 40}], k: 0.8},
  ];
  return (
    <g transform={`rotate(${lift} ${el[0]} ${el[1]})`}>
      <Piece id={id + '-f'} sil={[{d: tube}]} stock={STOCK.news} margin={6} shadow={[-4, 6, 5, 0.45]} box={[Math.min(wr[0], el[0]) - 40, Math.min(wr[1], el[1]) - 40, Math.abs(wr[0] - el[0]) + 80, Math.abs(wr[1] - el[1]) + 80]}
        over={
          <>
            <Wash id={id + '-fw'} d={tube} color="#8E949E" opacity={0.5} blur={5} />
            <Wash id={id + '-fc'} d={tube} color="#6FE3F0" opacity={0.3 * cyan} blur={14} blend="screen" />
          </>
        }>
        <Engr id={id + '-f'} regions={[...regionsF, ...cuff]} pitch={pitch} ink={INK.cat} lines={[{d: tube, w: 1.5}, {d: cuffD, w: 1}]} />
      </Piece>
      <g transform={`translate(${wr[0]} ${wr[1]}) rotate(${handRot})`}>
        <Piece id={id + '-h'} sil={[{d: HAND.palm}, {d: HAND.thumb}]} stock={STOCK.coated} margin={4} shadow={[-3, 4, 3, 0.45]} box={[-80, -30, 100, 70]}
          over={
            <>
              <Wash id={id + '-hs'} d={HAND.palm + HAND.thumb} color="#E5A48A" opacity={0.45} blur={2.5} />
              <Wash id={id + '-hc'} d={HAND.palm} color="#7FEFFF" opacity={0.45 * cyan} blur={8} blend="screen" />
            </>
          }>
          <Engr id={id + '-h'} regions={handRegions} pitch={pitch * 0.8} ink={INK.cat} lines={[{d: HAND.palm, w: 1.3}, {d: HAND.thumb, w: 1.1}, {d: HAND.knuckles, w: 0.9}, {d: HAND.nail, w: 0.8}]} />
        </Piece>
      </g>
    </g>
  );
};

/** Layer 1: hoodie torso. */
export const MasTorso: React.FC<MasPose> = (p) => {
  const {cyan = 0.7, f = 0, pitch} = p;
  const bB = boil('mas-body', f);
  return (
    <g transform={`translate(${bB[0]} ${bB[1]}) rotate(${bB[2]} ${MAS.neck[0]} ${MAS.neck[1] + 80})`}>
      <Torso pitch={pitch} cyan={cyan} />
    </g>
  );
};

/** Layer 2: the head on its neck pivot (with the card flip). */
export const MasHeadLayer: React.FC<MasPose> = (p) => {
  const {jaw = 0, flip = 0, tilt = 0, bob = 0, cyan = 0.7, warm = 0, f = 0, pitchHead} = p;
  const bH = boil('mas-head', f);
  const c = Math.cos(Math.PI * clamp(flip));
  const sx = Math.max(0.035, Math.abs(c));
  const faceRight = c < 0;
  const [hx, hy] = MAS.head;
  const [nx, ny] = MAS.neck;
  return (
    <g transform={`translate(${bH[0]} ${bH[1] + bob}) rotate(${tilt + bH[2]} ${nx} ${ny})`}>
      <g transform={`translate(${hx} ${hy}) scale(${sx * MAS.headScale} ${MAS.headScale})`}>
        <MasHead id={faceRight ? 'mas-R' : 'mas-L'} p={p.head} jaw={jaw} pitch={pitchHead / MAS.headScale} look={{mirror: !faceRight, cyan, warm}} />
      </g>
      {sx < 0.12 && <rect x={hx - 3} y={hy - 250} width={6} height={420} fill={STOCK.note.paper} stroke="#00000066" strokeWidth={1} />}
    </g>
  );
};

/** Layer 3: forearms + hands on the keys (elbows hidden behind the desk edge). */
export const MasArms: React.FC<MasPose> = (p) => {
  const {nearLift = 0, farLift = 0, cyan = 0.7, f = 0, pitch} = p;
  const bB = boil('mas-arms', f);
  return (
    <g transform={`translate(${bB[0]} ${bB[1]})`}>
      <defs>
        <clipPath id="mas-arm-clip">
          <rect x={600} y={560} width={600} height={196} />
        </clipPath>
      </defs>
      <g clipPath="url(#mas-arm-clip)">
        <Arm id="mas-farArm" el={[884, 776]} wr={[772, 704]} lift={farLift} pitch={pitch} cyan={cyan * 0.6} dark />
        <Arm id="mas-nearArm" el={[1012, 790]} wr={[824, 712]} lift={nearLift} pitch={pitch} cyan={cyan} />
      </g>
    </g>
  );
};

/** Flat silhouette of Mas (head + torso) for the cast shadow on the wall. */
export const MasSilhouette: React.FC<{p?: MasToneParams; flip?: number; tilt?: number; bob?: number; color?: string}> = ({p = {}, flip = 0, tilt = 0, bob = 0, color = '#070814'}) => {
  const m = useMemo(() => masTone({...p, tilt: 0}), [JSON.stringify(p)]); // eslint-disable-line react-hooks/exhaustive-deps
  const head = m.paths.filter((q) => !q.line && (q.transform ?? '').startsWith('rotate')).map((q) => q.d).join(' ');
  const torso = m.paths.filter((q) => !q.line && q.transform === 'translate(0 -36)').map((q) => q.d).join(' ');
  const c = Math.cos(Math.PI * clamp(flip));
  const sx = Math.max(0.035, Math.abs(c)) * (c < 0 ? 1 : -1);
  const [hx, hy] = MAS.head;
  const [nx, ny] = MAS.neck;
  return (
    <g fill={color}>
      <path d={torso} transform={`translate(${MAS.body[0]} ${MAS.body[1]}) scale(${-MAS.bodyScale} ${MAS.bodyScale}) translate(0 -36)`} />
      <g transform={`translate(0 ${bob}) rotate(${tilt} ${nx} ${ny}) translate(${hx} ${hy}) scale(${sx * MAS.headScale} ${MAS.headScale})`}>
        <path d={head} />
      </g>
    </g>
  );
};
