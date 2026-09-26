// MR. MAS — genvideo demos: converted clips inside pixel shots (masks, the match-cut handoff, GLYPH on a clip).
//   genvideo-window   the approved room; the converted SKY plate shows only in the window's sky (keyed by the
//                     sky's palette colours, so the skyline and the blinds stay in front) and, from f24, through
//                     a hole in the ceiling that opens in 3 held steps
//   genvideo-handoff  the engine's live room -> the SAME scene as a converted clip (a round trip through video:
//                     the stand-in for a clip conditioned on our frame), joined by a 5-frame genHandoff
//   genvideo-glyph    a converted clip under the engine's own GLYPH switch (an iris that opens), for comparing
//                     with tools/genvideo/glyphize.py
//   genvideo-clip     a converted clip full frame (props: {clip}), for checking the PNG readback is exact
import React from 'react';
import type {FrameDef} from '../../shared/frame-def';
import {GenVideoScene, Buf, Mask, PAL, blitGen, genHandoff, maskFromColors, radialMask, text} from '../../shared/pixel';
import {drawRoom} from '../pixelengine/room';

const SKY = [PAL.N2, PAL.N3, PAL.N4];
const WINDOW: [number, number, number, number] = [22, 32, 81, 75];
const HOLE = {x: 338, y: 12, rx: 34, ry: 11};

const caption = (ui: Buf, s: string) => text(ui, s, 6, 6, PAL.P2, {shadow: PAL.N0});

const WindowDemo: React.FC = () => (
  <GenVideoScene
    clip="genvideo/_test/sky"
    placement={{loop: true}}
    draw={(fb, f, gen) => {
      drawRoom(fb, {world: 20 + (f % 24), ui: true});
      if (!gen) return;
      // only the sky: the window's sky colours inside the window rect (blind gaps included, buildings excluded)
      const sky = maskFromColors(fb, SKY, WINDOW);
      blitGen(fb, gen, {mask: sky, dy: -118});
      // the ceiling hole opens in 3 held steps (never a smooth scale), then the plate shows through it
      const k = f < 24 ? 0 : f < 26 ? 0.35 : f < 28 ? 0.7 : 1;
      if (k > 0) {
        const hole = new Mask().addEllipse(HOLE.x, HOLE.y, HOLE.rx * k, HOLE.ry * k);
        blitGen(fb, gen, {mask: hole, dx: 150, dy: -150}); // shows plate x 150-220, y 150-175 (clouds over the dusk band)
        const rim = hole.outline();
        for (let i = 0; i < rim.a.length; i++) if (rim.a[i]) fb.c[i] = PAL.N0;
      }
    }}
    after={(ui, f) => caption(ui, f < 24 ? 'GENVIDEO: SKY PLATE IN THE WINDOW (MASKED)' : 'GENVIDEO: + THE CEILING HOLE')}
  />
);

const HANDOFF_AT = 40;
const HandoffDemo: React.FC = () => (
  <GenVideoScene
    clip="genvideo/_test/pixeladv"
    draw={(fb, f, gen) => {
      drawRoom(fb, {world: f, ui: true, convo: true});
      if (!gen || f < HANDOFF_AT) return;
      genHandoff(fb, gen, Math.min(1, (f - HANDOFF_AT + 1) / 5));
    }}
    after={(ui, f) => caption(ui, f < HANDOFF_AT ? 'ENGINE (LIVE)' : f < HANDOFF_AT + 5 ? 'HANDOFF' : 'CONVERTED CLIP')}
  />
);

const GlyphDemo: React.FC = () => (
  <GenVideoScene
    clip="genvideo/_test/satire"
    switch={(f) => (f < 6 ? null : {type: 'glyph', mask: f < 30 ? radialMask(240, 110, 20 + (f - 6) * 12, 6) : undefined})}
  />
);

const ClipDemo: React.FC<{clip?: string}> = ({clip}) => <GenVideoScene clip={clip ?? 'genvideo/_test/satire'} />;

export const frames: FrameDef[] = [
  {id: 'genvideo-window', component: WindowDemo, durationInFrames: 72, fps: 24},
  {id: 'genvideo-handoff', component: HandoffDemo, durationInFrames: 96, fps: 24},
  {id: 'genvideo-glyph', component: GlyphDemo, durationInFrames: 48, fps: 24},
  {id: 'genvideo-clip', component: ClipDemo, durationInFrames: 120, fps: 24, props: {clip: 'genvideo/_test/satire'}},
];
