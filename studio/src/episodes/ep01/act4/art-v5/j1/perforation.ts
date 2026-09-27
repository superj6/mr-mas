// J1 v5 PORT (prep-artbuild-r3, 2026-09-26): copied from src/dev/jumps/proto1/perforation.ts; only the import paths changed.
// MR. MAS — style-jump prototype 1 · the perforator.
// CANCELLED is set in the show's own 7-px pixel face (font.ts), and every lit pixel becomes one punched round
// hole: the grid the story just left is what cuts through the record. Real cancelled certificates are
// perforated the same way (a punch die of round pins spelling the word).
import {Buf} from '../../../../../shared/pixel/px';
import {text, textWidth} from '../../../../../shared/pixel/font';

export interface Hole { x: number; y: number; r: number }
export interface Perf { holes: Hole[]; w: number; h: number; x0: number; y0: number; pitch: number }

/** Hole centres (1080p px) for `word` with its top-left at (x0, y0), `pitch` px per font pixel. `track` adds empty
 *  columns between letters (a punch die spaces its letters wider than the screen face does). */
export const perforation = (word: string, x0: number, y0: number, pitch: number, dia: number, track = 1): Perf => {
  const h = 7;
  const w = textWidth(word) + track * (word.length - 1);
  const b = new Buf(w + 2, h + 2, 0);
  let cx = 1;
  for (const ch of word) { text(b, ch, cx, 1, 1); cx += textWidth(ch) + 1 + track; }
  const holes: Hole[] = [];
  for (let j = 0; j < h + 2; j++)
    for (let i = 0; i < w + 2; i++)
      if (b.get(i, j) === 1) holes.push({x: x0 + (i - 1) * pitch + pitch / 2, y: y0 + (j - 1) * pitch + pitch / 2, r: dia / 2});
  return {holes, w: w * pitch, h: h * pitch, x0, y0, pitch};
};
