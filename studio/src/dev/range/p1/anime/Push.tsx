// MR. MAS - style-range Prototype 1: p150-359, the [OTS] and ONE continuous multiplane push across the table on 1s.
// Planes at p150: his head and shoulder in silhouette with his hand on the rail and his PIXEL glass on the felt; the
// table and the chips; the four players round the far arc, each in a chair at their own depth; the painted casino dark
// with the far neon. The tells light as objects one per beat (p180 the ladle tips and a drop falls, p195 the napkin's
// corner lifts on `Addendum:`, p210 the register key sinks, p225 Nole's phone flares one step), and each player's stat
// bar sets over his head in cel line. The push slows with mass and rests on the Intern's caret face, in focus: over its
// head, nothing (from p318). Then the caret stops blinking and the lens is drawn into its screen (p336-359): the cut to
// the machine's view (J4) is made from inside the caret.
import React from 'react';
import {EdgeGlowFilter, FlatFilter, RimFilter} from '../../../../shared/anime/scene/fx';
import {MasBack} from './MasTungsten';
import {curve, ell, ink, Pt} from '../../../../shared/anime/ink';
import {T, BARS, Seat, SEATS, caretOn} from '../geo';
import {camAt, Cam, focusAt, blurFor, project, railFarZ, railNearZ, TABLE, WORLD} from './world';
import {PlateCanvas} from './PlateCanvas';
import {CelBust, BustProps} from './CelBust';
import {InternCel, CelBar} from './Intern';
import {Card, Chair, feltMatrix, GpuStack, Napkin, Register, Shoe, Thermos} from './props';
import {glassDataUrl, GLASS_H, GLASS_PX, GLASS_W} from './glass';
import {EYE_DARK, EYE_NOLE, FLEECE, HAIR_DARK, HAIR_SILVER, KEY, LEATHER, SKIN_KRAM, SKIN_MARIO, SKIN_NESNEJ, SKIN_NOLE, TEE_BLACK} from './tungsten';
import {Finish} from './finish';

const UNIT = 22 / 310; // cm per rig unit (a head is ~310 units, ~22 cm)
const lineK = (s: number) => Math.max(0.7, Math.min(4.2, 2.3 / (3 * s * UNIT)));
const smooth = (a: number, b: number, x: number) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

type Player = Omit<BustProps, 'uid' | 'k'> & {flip: boolean; barLift: number; barDX?: number};
const PLAYER: Record<Seat, Player> = {
  nole: {ws: 0.92, face: 'nole', hairStyle: 'nole', torso: 'tee', skin: SKIN_NOLE, hair: HAIR_DARK, cloth: TEE_BLACK, eye: EYE_NOLE, flip: false, lookX: 0.25, lookY: 0.85, lid: 0.36, phone: 0.45, tilt: 6, barLift: 33, barDX: 28},
  kram: {ws: 0.8, face: 'mas', hairStyle: 'kram', torso: 'tee', skin: SKIN_KRAM, hair: HAIR_DARK, cloth: TEE_BLACK, eye: EYE_DARK, flip: false, lookX: 0.45, lookY: 0.5, lid: 0.3, chain: true, tilt: 9, faceScale: [1.06, 0.95], smirk: 0.5, barLift: 26},
  mario: {ws: 0.86, face: 'mas', hairStyle: 'mario', torso: 'fleece', skin: SKIN_MARIO, hair: HAIR_DARK, cloth: FLEECE, eye: EYE_DARK, flip: true, lookX: 0.2, lookY: 0.6, lid: 0.26, glasses: true, tilt: 2, faceScale: [0.94, 1.05], barLift: 37},
  nesnej: {ws: 0.9, face: 'nole', hairStyle: 'nesnej', torso: 'leather', skin: SKIN_NESNEJ, hair: HAIR_SILVER, cloth: LEATHER, eye: EYE_DARK, flip: true, lookX: 0.4, lookY: 0.45, lid: 0.4, age: true, tilt: -6, faceScale: [1.04, 0.98], smirk: 0.35, barLift: 30},
};

/** a billboard at a world point: translate to its projection, scale to px per local unit */
const at = (c: Cam, X: number, Y: number, Z: number, unit: number, flip = false) => {
  const q = project(c, X, Y, Z);
  return {q, tf: `translate(${q.x} ${q.y}) scale(${(flip ? -1 : 1) * q.s * unit} ${q.s * unit})`};
};
/** the held drawings breathe on 2s: a fraction of a centimetre, never a bob */
const breathAt = (p: number, [ph, per]: [number, number]) => 0.32 * Math.sin((2 * Math.PI * (Math.floor(p / 2) * 2 + ph)) / per);
/** blinks are the one other live drawing: half, shut, shut, half */
const lidAt = (p: number, base: number, blinks: number[]) => {
  for (const b of blinks) { if (p === b || p === b + 1) return 1; if (p === b - 1 || p === b + 2) return Math.max(base, 0.66); }
  return base;
};

export const Push: React.FC<{p: number}> = ({p}) => {
  const cam = camAt(p);
  const fd = focusAt(p, cam);
  const tell = T.tell;
  // ---- the tells, as held drawings
  const ladle: 0 | 1 | 2 = p < tell.kram ? 0 : p < tell.kram + 2 ? 1 : 2;
  const drop = p < tell.kram + 2 ? undefined : Math.min(1, (Math.floor((p - tell.kram - 2) / 2) * 2) / 8);
  const napkinLift = p < tell.mario ? 0 : p < tell.mario + 2 ? 34 : 62;
  /** each tell 'lights': the lamp catches it on its beat, then it settles a rung brighter than before */
  const litFor = (t0: number) => (p < t0 ? 0 : p < t0 + 4 ? 1 : 0.55);
  const sunk = p >= tell.nesnej;
  const flare = p >= tell.nole ? 1 : 0.45;

  // ---- depth-sorted billboards (far to near)
  type Item = {d: number; node: React.ReactNode};
  const people: Item[] = [];
  const bars: React.ReactNode[] = [];
  const clipDefs: React.ReactNode[] = [];
  // everything seated behind the far rail is hidden below the rail's own top edge, which curves down toward the ends
  // of the oval: one clip that follows it across the frame (a flat cut at the seat's height leaves a gap at the sides)
  const railTop = (() => {
    const {XC, A, R, TOP, CUSHION} = TABLE;
    const pts: string[] = [];
    let first: {x: number; y: number} | null = null, last: {x: number; y: number} | null = null;
    for (let i = 0; i <= 96; i++) {
      const X = XC - (A + R) + ((A + R) * 2 * i) / 96;
      const Z = railFarZ(X);
      if (Z - cam.z < 10) continue;
      const q = project(cam, X, TOP - CUSHION, Z);
      if (!first) first = q;
      last = q;
      pts.push(`${q.x.toFixed(1)} ${q.y.toFixed(1)}`);
    }
    if (!first || !last) return 'M-4000 -4000L5920 -4000L5920 5000L-4000 5000Z';
    return `M-4000 -4000L-4000 ${first.y.toFixed(1)}L${pts.join('L')}L5920 ${last.y.toFixed(1)}L5920 -4000Z`;
  })();
  let clipMade = false;
  const railClip = (_key: string, _x: number) => {
    if (!clipMade) { clipDefs.push(<clipPath key="p1rail" id="p1rail"><path d={railTop} /></clipPath>); clipMade = true; }
    return 'url(#p1rail)';
  };
  for (const s of SEATS) {
    const seat = WORLD.seats[s];
    const pp = PLAYER[s];
    const by = breathAt(p, seat.breath);
    const {q, tf} = at(cam, seat.x, seat.headY + by, seat.z, UNIT * seat.scale);
    if (q.d < 20 || q.x < -1100 || q.x > 3000) continue;
    const k = lineK(q.s * seat.scale);
    const blur = blurFor(q.d, fd);
    const cp = railClip(`p1clip-${s}`, seat.x);
    // the chair: behind them, a little wider than the shoulders, cut by the rail like they are
    const ch = at(cam, seat.x + (pp.flip ? 3 : -3), seat.headY, seat.z + 12, 1);
    const cb = blurFor(ch.q.d, fd);
    people.push({d: ch.q.d, node: (
      <g key={`chair-${s}`} style={{filter: cb > 0.4 ? `blur(${cb.toFixed(2)}px)` : undefined}}>
        <g clipPath={railClip(`p1clipc-${s}`, seat.x)}><g transform={ch.tf}><Chair uid={`ch-${s}`} w={58 * seat.scale} top={17} bottom={96} k={2 / ch.q.s} /></g></g>
      </g>
    )});
    people.push({d: q.d, node: (
      <g key={s} style={{filter: blur > 0.4 ? `blur(${blur.toFixed(2)}px)` : undefined}}>
        <g clipPath={cp}>
          <g transform={tf}>
            <g transform={pp.flip ? 'scale(-1 1)' : undefined}>
              <CelBust uid={`b-${s}`} {...pp} lid={lidAt(p, pp.lid ?? 0.34, seat.blinks)} phone={s === 'nole' ? flare : undefined} k={k} />
            </g>
          </g>
        </g>
      </g>
    )});
    // the stat bar: sharp (it is his read, not a thing in the room); it fades before it can reach the frame's edge
    const bar = BARS[s];
    const bA = at(cam, seat.x + (pp.barDX ?? 0), seat.headY - pp.barLift, seat.z, 1);
    const tot = bar.label.length * 5 * 0.62 + 1.6 + bar.cells * 3.5;
    const left = bA.q.x - (tot / 2) * bA.q.s, right = bA.q.x + (tot / 2) * bA.q.s, top = bA.q.y - 5 * bA.q.s;
    const fade = smooth(16, 80, left) * smooth(16, 80, 1920 - right) * smooth(16, 70, top);
    if (fade > 0.02 && bA.q.d > 20) bars.push(<g key={`bar-${s}`} opacity={fade} transform={bA.tf}><CelBar label={bar.label} cells={bar.cells} filled={bar.filled} t={p - tell[s]} k={Math.min(2, 4 / bA.q.s)} /></g>);
  }
  {
    const I = WORLD.intern;
    const {q, tf} = at(cam, I.x, I.headY, I.z, 1);
    const blur = blurFor(q.d, fd);
    const caret = p >= T.caretHold ? true : caretOn(p);
    people.push({d: q.d, node: (
      <g key="intern" style={{filter: blur > 0.4 ? `blur(${blur.toFixed(2)}px)` : undefined}}>
        <g clipPath={railClip('p1clip-intern', I.x)}><g transform={tf}><InternCel uid="intern" caret={caret} k={3 / q.s} /></g></g>
      </g>
    )});
  }
  people.sort((a, b) => b.d - a.d);

  // chips: each player's stacks in front of them, the pot, Mas's own
  const things: Item[] = [];
  const onFelt = (x: number, back: number) => railFarZ(x) - back;
  const stacks: Array<[number, number, number]> = [
    [-74, onFelt(-74, 12), 6], [-64, onFelt(-64, 15), 4], [-56, onFelt(-56, 12), 3],
    [-16, onFelt(-16, 15), 5], [-8, onFelt(-8, 13), 8],
    [36, onFelt(36, 13), 5], [44, onFelt(44, 15), 3],
    [62, onFelt(62, 13), 9], [71, onFelt(71, 15), 7], [54, onFelt(54, 12), 6],
    [0, 186, 6], [8, 181, 9], [16, 187, 5], [4, 193, 4], [14, 195, 7], [22, 190, 3], [-6, 190, 5],
    [-50, 150, 6], [-42, 146, 4],
  ];
  stacks.forEach(([x, z, n], i) => {
    const {q, tf} = at(cam, x, TABLE.TOP, z, 1);
    if (q.d < 12 || q.x < -200 || q.x > 2120) return;
    things.push({d: q.d, node: <g key={`st${i}`} transform={tf}><GpuStack n={n} seed={i} k={2 / q.s} /></g>});
  });
  // the tell props
  const propAt = (key: string, x: number, z: number, node: (k: number) => React.ReactNode) => {
    const {q, tf} = at(cam, x, TABLE.TOP, z, 1);
    if (q.d < 12 || q.x < -300 || q.x > 2220) return;
    things.push({d: q.d, node: <g key={key} transform={tf}>{node(2 / q.s)}</g>});
  };
  propAt('thermos', -36, onFelt(-36, 9), (k) => <Thermos tip={ladle} drop={drop} lit={litFor(tell.kram)} k={k} />);
  propAt('register', 90, onFelt(90, 11), (k) => <Register sunk={sunk} lit={litFor(tell.nesnej)} k={k} />);
  propAt('shoe', 106, onFelt(106, 9), (k) => <Shoe k={k} />);
  // Mario's napkin, flat on the felt in front of him
  const napZ = onFelt(14, 30);
  if (napZ - cam.z > 16) things.push({d: napZ - cam.z, node: <Napkin key="napkin" cam={cam} x0={4} z0={napZ + 8} lift={napkinLift} />});
  things.sort((a, b) => b.d - a.d);

  // ---- flat objects in the felt's plane (drawn under the billboards)
  const flat: React.ReactNode[] = [];
  const cardAt = (key: string, x: number, z: number, up: boolean, pip: 0 | 1 | 2 | 3, rot = 0) => {
    if (z - 9 - cam.z < 14) return;
    flat.push(<g key={key} transform={feltMatrix(cam, x, z)}><Card up={up} pip={pip} rot={rot} /></g>);
  };
  [-16, -8.5, -1, 6.5, 14].forEach((x, i) => cardAt(`bd${i}`, x, 168, i < 3, ((i + 1) % 4) as 0 | 1 | 2 | 3, (i - 2) * 1.5));
  cardAt('h1', -44, 140, false, 0, -8);
  cardAt('h2', -40, 139, false, 0, 6);

  // ---- the padded rail's cushion as a cel band: the far run (in front of the players), the near run (last)
  const cushion = (far: boolean) => {
    const top: string[] = [], bot: string[] = [], hi: string[] = [];
    const {XC, A, R, TOP, CUSHION} = TABLE;
    for (let i = 0; i <= 72; i++) {
      const X = XC - (A + R) + ((A + R) * 2 * i) / 72;
      const Z = far ? railFarZ(X) : railNearZ(X);
      if (Z - cam.z < 10) continue;
      const a = project(cam, X, TOP - CUSHION, Z), b = project(cam, X, TOP, Z), h = project(cam, X, TOP - CUSHION + 0.8, Z - (far ? 1.2 : -1.2));
      top.push(`${a.x.toFixed(1)} ${a.y.toFixed(1)}`); bot.push(`${b.x.toFixed(1)} ${b.y.toFixed(1)}`); hi.push(`${h.x.toFixed(1)} ${h.y.toFixed(1)}`);
    }
    if (top.length < 2) return null;
    return (
      <g key={far ? 'cf' : 'cn'}>
        <path d={`M${top.join('L')}L${bot.reverse().join('L')}Z`} fill="#0E0A0B" />
        <path d={`M${hi.join('L')}`} fill="none" stroke="url(#p1-cushion)" strokeWidth={far ? 2.4 : 5} strokeLinecap="round" />
        <path d={`M${top.join('L')}`} fill="none" stroke="#050304" strokeWidth={far ? 1.6 : 2.6} />
      </g>
    );
  };

  // ---- the foreground: his head and shoulder in silhouette (the shared rig, flattened and rimmed), his hand, his glass
  const M = WORLD.mas;
  const mh = at(cam, M.head[0], M.head[1], M.head[2], UNIT);
  const fgVisible = mh.q.d > 8 && mh.q.x > -700;
  const hand = project(cam, M.hand[0], M.hand[1], M.hand[2]);
  const gl = project(cam, M.glass[0], M.glass[1], M.glass[2]);
  const glassW = GLASS_W * GLASS_PX, glassH = GLASS_H * GLASS_PX;
  const gx = Math.round(gl.x - glassW / 2), gy = Math.round(gl.y - glassH + 6);
  const glassOn = gl.d > 10 && gx > -glassW && gx < 1920;
  const handPts: Pt[] = [[-6, -3.2], [1, -4.2], [5.6, -3], [7.4, -0.6], [5, 1.4], [-4, 1.6], [-9, 0.8]];
  const armPts: Pt[] = [[-40, -8], [-6, -4], [-6, 2], [-42, 10]];
  // the glass's contact with the felt, in cel: a soft shadow toward us, and the lamp through the water as a warm caustic
  const glassFloor = glassOn && (() => {
    const c = project(cam, M.glass[0], TABLE.TOP, M.glass[2] - 3);
    const s = c.s;
    return (
      <g>
        <path d={ell(c.x, c.y, 5.6 * s, 1.5 * s)} fill="#000" opacity={0.55} filter="url(#p1-soft)" />
        <path d={ell(c.x + 0.6 * s, c.y + 1.4 * s, 3.2 * s, 0.8 * s)} fill="#9FE8E2" opacity={0.2} filter="url(#p1-soft)" />
        <path d={ell(c.x + 0.4 * s, c.y + 1.3 * s, 1.4 * s, 0.32 * s)} fill={KEY.hot} opacity={0.35} />
      </g>
    );
  })();

  return (
    <>
      <PlateCanvas cam={cam} />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        <defs>
          {clipDefs}
          <linearGradient id="p1-haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFC98E" stopOpacity={0.16} />
            <stop offset="0.6" stopColor="#FFC98E" stopOpacity={0.05} />
            <stop offset="1" stopColor="#FFC98E" stopOpacity={0} />
          </linearGradient>
          <filter id="p1-hazeblur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="40" /></filter>
          <filter id="p1-soft" x="-40%" y="-80%" width="180%" height="260%"><feGaussianBlur stdDeviation="4" /></filter>
          <linearGradient id="p1-cushion" x1="0" y1="0" x2="1920" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#5A3420" /><stop offset="0.5" stopColor="#D8955C" /><stop offset="1" stopColor="#6A3C24" />
          </linearGradient>
        </defs>
        {/* the lamp's hood of light in the air over the table: one soft cone, barely there */}
        {(() => {
          const L = project(cam, WORLD.lamp[0], WORLD.lamp[1] + 6, WORLD.lamp[2]);
          const a = project(cam, WORLD.pot[0] - 70, TABLE.TOP, WORLD.pot[2]), b = project(cam, WORLD.pot[0] + 70, TABLE.TOP, WORLD.pot[2]);
          const w0 = 40 * L.s;
          return (
            <g opacity={0.5}>
              <path d={`M${L.x - w0} ${L.y}L${L.x + w0} ${L.y}L${b.x} ${b.y}L${a.x} ${a.y}Z`} fill="url(#p1-haze)" filter="url(#p1-hazeblur)" />
            </g>
          );
        })()}
        {people.map((it) => it.node)}
        {cushion(true)}
        {flat}
        {glassFloor}
        {things.map((it) => it.node)}
        {cushion(false)}
        {bars}
      </svg>
      {fgVisible && (
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
          <defs>
            <FlatFilter id="fg-flat" color="#07060A" />
            <RimFilter id="fg-rim" dx={2.6} dy={-3.2} color={KEY.warm} opacity={0.95} wrap={0.25} blur={0.9} />
            <EdgeGlowFilter id="fg-cool" r={1.2} color={KEY.rimCool} opacity={0.35} blur={1.4} />
          </defs>
          {/* forearm and hand on the rail (in silhouette; the knuckles take the key) */}
          <g filter="url(#fg-rim)">
            <g filter="url(#fg-flat)">
              <g transform={`translate(${hand.x} ${hand.y}) scale(${hand.s})`}>
                <path d={curve(armPts)} fill="#0A090C" />
                <path d={curve(handPts)} fill="#0A090C" />
              </g>
            </g>
          </g>
          <g filter="url(#fg-cool)">
            <g transform={mh.tf}><MasBack uid="fgmas" k={lineK(mh.q.s)} /></g>
          </g>
          <path d={ink([[hand.x - 1.5 * hand.s, hand.y - 4 * hand.s], [hand.x + 5 * hand.s, hand.y - 3.2 * hand.s]], 0.35 * hand.s, {a: 0.3, b: 0.3})} fill={KEY.warm} opacity={0.8} />
        </svg>
      )}
      {glassOn && (
        <img src={glassDataUrl()} style={{position: 'absolute', left: gx, top: gy, width: glassW, height: glassH, imageRendering: 'pixelated'}} />
      )}
      <Finish seed={60 + Math.floor(p / 2)} />
    </>
  );
};
