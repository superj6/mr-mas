// MR. MAS — Ep1 Act Four v5 · the Cancel click both ways, for the showrunner (the a4p5-render pass). NOT the cut.
// style-range §6.1a withdrew J1 in favour of the masked GLYPH dissolve at the Cancel click, and the showrunner has not
// ruled. The v5 animatic keeps GLYPH; this clip plays the same stretch of the v5 picture twice so the two can be judged
// side by side in time:
//   slate A (1 s) · A: the v5 picture as cut, the GLYPH dissolve (Animatic5 picture mode, true tokens)
//   slate B (1 s) · B: the same frames with J1 "CANCELLED" dropped in at the click (art-v5/j1: J1Cancelled for
//                     t = f - CANCEL_CLICK in 0..59, the host's own frames around it; S1.09's GLYPH layers are not drawn)
// Each pass runs act frames CLIP_FROM..CLIP_TO (compare5.ts): about 8 s either side of the click, cut to cut (S1.07 to
// the end of S1.12 on the current lock). Output: out/ep01/act4/animatic/act4-v5-cancel-compare.mp4.
// render5.ts `compare` renders this composition (heavy.sh) and muxes the stick mix under each pass (silence under the
// slates). J1's own punch sound (proto1 tools/sound.py) is not in the temp mix: under B, D6's digital silence plays.
//   'ep01-act4-v5-cancel-compare'   1920 x 1080, 24 fps
import React, {useLayoutEffect, useMemo, useRef, useState} from 'react';
import {AbsoluteFill, cancelRender, continueRender, delayRender, useCurrentFrame} from 'remotion';
import {Buf} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {ensureGlyphFonts} from '../../../../shared/pixel/glyphDraw';
import {toRGBA, otext} from './frame';
import {pw} from './lay';
import {native5} from './frame5';
import {paint5} from './Animatic5';
import {CLIP_FROM, CLIP_TO, CLIP_SHOTS, SLATE, COMPARE_LEN, COMPARE_PARTS, partAt} from './compare5';
import {CANCEL_CLICK, J1_PIXEL_OPTS} from './shots5';
import {J1Cancelled, j1Active} from '../art-v5/j1/J1Cancelled';

const ts = (f: number) => { const s = f / 24; return `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`; };

const slateBuf = (which: 'A' | 'B'): Buf => {
  const b = new Buf(1920, 1080, 0x07080d);
  const col = which === 'A' ? PAL.C6 : PAL.W6;
  const t1 = which === 'A' ? 'A · THE GLYPH DISSOLVE' : 'B · J1 "CANCELLED"';
  const t2 = which === 'A' ? 'AS IN THE v5 ANIMATIC (THE MAIN CUT)' : 'THE ALTERNATE: NOT IN THE CUT, UNRULED';
  otext(b, t1, Math.round(960 - (pw(t1) * 8) / 2), 380, 8, col, {shadow: 0x000000});
  otext(b, t2, Math.round(960 - (pw(t2) * 4) / 2), 480, 4, 0xf2efe6);
  const notes = which === 'A'
    ? ['HIS TILE BREAKS INTO GLYPH TOKENS AND FALLS; THE FOUR CLOSE RANKS (STYLE-RANGE 6.1A, USE 2 OF 2)']
    : ['J1 OWNS 60 FRAMES FROM THE CLICK: A FLASH, THE ENGRAVED CERTIFICATE, CANCELLED PUNCHED THROUGH,', 'THEN THE SNAP BACK TO THE GRID. ITS OWN PUNCH SOUND IS NOT IN THE TEMP MIX (D6 SILENCE PLAYS)'];
  notes.forEach((l, i) => otext(b, l, Math.round(960 - (pw(l) * 2) / 2), 560 + i * 26, 2, 0x8a93a8));
  const t3 = `ACT ${ts(CLIP_FROM)}-${ts(CLIP_TO)} · ${CLIP_SHOTS[0]} TO ${CLIP_SHOTS[1]} · THE CLICK ${((CANCEL_CLICK - CLIP_FROM) / 24).toFixed(1)} S IN (ACT F ${CANCEL_CLICK}) · TEMP TRACK: THE STICK MIX`;
  otext(b, t3, Math.round(960 - (pw(t3) * 2) / 2), 660, 2, 0x5d667a);
  return b;
};

const BufCanvas: React.FC<{buf: Buf; tag: string}> = ({buf, tag}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const h = delayRender(`cancel5 ${tag}`);
    const cv = ref.current;
    if (cv) { const ctx = cv.getContext('2d')!; const img = ctx.createImageData(buf.w, buf.h); toRGBA(buf, img.data); ctx.putImageData(img, 0, 0); }
    continueRender(h);
  }, [buf, tag]);
  return <canvas ref={ref} width={buf.w} height={buf.h} style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080}} />;
};

const HostPicture: React.FC<{f: number}> = ({f}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const h = delayRender(`cancel5 host ${f}`);
    ensureGlyphFonts().then(() => { const cv = ref.current; if (cv) paint5(cv.getContext('2d')!, f, true); continueRender(h); }).catch((e) => cancelRender(e));
  }, [f]);
  return <canvas ref={ref} width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080}} />;
};

export {COMPARE_LEN, COMPARE_PARTS, SLATE};
export const Cancel5: React.FC = () => {
  const p = useCurrentFrame();
  const part = partAt(p);
  const [slates] = useState(() => ({A: slateBuf('A'), B: slateBuf('B')}));
  const f = CLIP_FROM + (p - part.at);
  const t = f - CANCEL_CLICK;
  const j1 = part.kind === 'clip' && part.which === 'B' && j1Active(t);
  const frame = useMemo(() => (j1 ? native5(f).fb : null), [j1, f]);
  const click = useMemo(() => native5(CANCEL_CLICK).fb, []);
  if (part.kind === 'slate') return <AbsoluteFill style={{background: '#07080d'}}><BufCanvas buf={slates[part.which as 'A' | 'B']} tag={`slate ${part.which}`} /></AbsoluteFill>;
  if (j1 && frame) return <J1Cancelled t={t} frame={frame} click={click} pixel={J1_PIXEL_OPTS} />;
  return <AbsoluteFill style={{background: '#07080d'}}><HostPicture f={f} /></AbsoluteFill>;
};
