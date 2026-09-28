// MR. MAS — the Runway insert's pixel frames (the `v31-runway` pass, 2026-09-27): the dark room around ELGOOG's duck
// demo, drawn by the show's own kits at native 480 x 270, so the compositor (insert.py) can push into, cut to, or
// inset the generated film. Nothing here is new art: it is the tag's two-shot (rooms/darkroom-act3 drawDarkA3 with
// the tag's plate, as tag/shots.ts 32.01 draws it after Mas looks up) and the monitor kit's [OTS] and [POV]
// (kits/mas-monitor), each with a painter that shows a frame of the film already snapped to the master palette.
//
// Build + run (from studio/):
//   node src/episodes/ep01/pixel/tools/build.mjs --entry src/dev/genvideo/runway/pxframes.ts $S/pxframes.cjs
//   node $S/pxframes.cjs jobs.json
// jobs.json: {"out": DIR, "frames": [{"name": "a-0001", "kind": "2s" | "ots" | "pov", "f": 12,
//              "screen": "DIR/x.rgb" | null, "sw": 258, "sh": 138, "orb": "grid", "masLook": -1}]}
// Each frame is written as raw RGB (480 x 270 x 3) to DIR/<name>.rgb. A screen file is raw RGB at the painter's
// buffer size (2s: 96 x 60 · ots: 258 x 138 · pov: 380 x 186); null paints the tag's dim screen.
import * as fs from 'fs';
import * as path from 'path';
import {Buf, rect} from '../../../shared/pixel/px';
import {PAL} from '../../../shared/pixel/palette';
import {DPLATE_LOOK} from '../../../shared/pixel/rooms/darkroom-plate';
import {drawDarkA3} from '../../../shared/pixel/rooms/darkroom-act3';
import {drawMonitorOTS, drawMonitorPOV, screenDim, MON_OTS, MON_POV, Painter} from '../../../shared/pixel/kits/mas-monitor';

const RH = 203;
interface Job {name: string; kind: '2s' | 'ots' | 'pov'; f: number; screen: string | null; sw?: number; sh?: number; orb?: keyof typeof DPLATE_LOOK; masLook?: number; masHead?: string}

const painterFrom = (file: string | null, sw: number, sh: number): Painter => {
  if (!file) return screenDim;
  const raw = fs.readFileSync(file);
  if (raw.length !== sw * sh * 3) throw new Error(`${file}: ${raw.length} bytes, want ${sw}x${sh}x3`);
  return (scr: Buf) => {
    for (let y = 0; y < scr.h; y++) for (let x = 0; x < scr.w; x++) {
      const sx = Math.min(sw - 1, Math.floor((x * sw) / scr.w)), sy = Math.min(sh - 1, Math.floor((y * sh) / scr.h));
      const o = (sy * sw + sx) * 3;
      scr.set(x, y, (raw[o] << 16) | (raw[o + 1] << 8) | raw[o + 2]);
    }
  };
};

/** the show's band with no rail and no badge (frame.ts band(b, null, 0, null): the tag's 32.01) */
const band = (b: Buf) => { rect(0, RH, 480, 270 - RH, b.ink(PAL.N0)); rect(0, RH, 480, 1, b.ink(PAL.N3)); };

const draw = (j: Job): Buf => {
  const fb = new Buf(480, 270, PAL.N0);
  if (j.kind === '2s') {
    const paint = painterFrom(j.screen, j.sw ?? 96, j.sh ?? 60);
    drawDarkA3(fb, j.f, {
      orb: {at: 'shoulder', look: DPLATE_LOOK[j.orb ?? 'grid']},
      outline: true,
      mas: {head: (j.masHead ?? '34') as never, arm: 'rest', look: j.masLook ?? -1},
      plate: {tally: 3, screen: paint},
    });
  } else if (j.kind === 'ots') {
    drawMonitorOTS(fb, j.f, painterFrom(j.screen, j.sw ?? MON_OTS.w, j.sh ?? MON_OTS.h), {plate: {tally: 3}, key: 'tag-ots'});
  } else {
    drawMonitorPOV(fb, j.f, painterFrom(j.screen, j.sw ?? MON_POV.w, j.sh ?? MON_POV.h));
  }
  band(fb);
  return fb;
};

const main = () => {
  const spec = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')) as {out: string; frames: Job[]};
  fs.mkdirSync(spec.out, {recursive: true});
  const rgb = Buffer.alloc(480 * 270 * 3);
  for (const j of spec.frames) {
    const fb = draw(j);
    for (let i = 0; i < fb.c.length; i++) { const v = fb.c[i]; rgb[i * 3] = (v >> 16) & 255; rgb[i * 3 + 1] = (v >> 8) & 255; rgb[i * 3 + 2] = v & 255; }
    fs.writeFileSync(path.join(spec.out, `${j.name}.rgb`), rgb);
  }
  fs.writeFileSync(path.join(spec.out, 'geometry.json'), JSON.stringify({RH, MON_OTS, MON_POV}, null, 1));
  console.log(`pxframes: ${spec.frames.length} frames -> ${spec.out}`);
};
main();
