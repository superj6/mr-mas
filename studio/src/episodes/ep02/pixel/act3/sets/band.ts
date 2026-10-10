// MR. MAS — Ep2 v1 · act3: THE ADVENTURE BAND (sc 14, UI LIT; it lights at 13.06's threshold). A copy of the art
// pass's band (art/sets/floor.ts adventureBand: copied, so a change to sc 14's band never re-renders another act) with
// what the shots need: the SENTENCE LINE (the verb and its object, `Look at heatsink`, as the classic games build it on
// the band's top row while the line is live), the typed STRIP LINE (his phone's chosen line, `congratulations.`, typed
// in his colour as he says it), the hovered verb, the greyed Open, the inventory (his pocket: CTRL · ESC · glass · phone,
// and the note once it's in there, unlabelled, never in his colour, greyed once it lands), and `dim` (the band
// lighting in held steps).
//   adventureBand(b, st)   rows 203..269 of a `full` frame
import {Buf} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {fill, pt, pw, tiny, tinyWidth} from '../../art/kit';

export const VERBS = ['Look at', 'Talk to', 'Pick up', 'Use', 'Open', 'Pivot', 'Raise'];
export interface BandSt {
  /** the hovered (chosen) verb */
  verb?: string;
  /** the sentence line on the band's top row (`Look at heatsink`) */
  sentence?: string;
  /** a line typed on the top row in his colour (the strip's chosen line as he says it): text and how many glyphs */
  say?: string; sayN?: number;
  /** the note in his pocket (an unlabelled yellowed slip in the inventory) */
  note?: boolean;
  /** a slot flashing as something lands in it (frames since) */
  noteIn?: number;
  /** the band a few rungs down (lighting up): 0 lit .. 6 dark */
  dim?: number;
}
export const adventureBand = (b: Buf, st: BandSt = {}) => {
  const t = new Buf(480, 270, PAL.N0);
  fill(t, 0, 203, 480, 67, PAL.N1); fill(t, 0, 203, 480, 1, PAL.N5); fill(t, 0, 204, 480, 1, PAL.N3);
  VERBS.forEach((v, i) => {
    const x = 8 + (i % 4) * 66, y = 226 + Math.floor(i / 4) * 14;
    const greyed = v === 'Open', on = st.verb === v;
    if (on) fill(t, x - 3, y - 2, pw(v) + 6, 11, greyed ? PAL.N2 : PAL.N3);
    pt(t, v, x, y, greyed ? PAL.N4 : on ? PAL.W8 : PAL.C6);
    if (greyed) fill(t, x - 1, y + 3, pw(v) + 2, 1, PAL.N4);
  });
  // the inventory: his pocket
  const inv = ['CTRL', 'ESC', 'glass', 'phone', ...(st.note ? ['·'] : [])];
  fill(t, 282, 220, 190, 40, PAL.N0); fill(t, 282, 220, 190, 1, PAL.N4);
  inv.forEach((v, i) => {
    const x = 288 + i * 36, flash = v === '·' && st.noteIn !== undefined && st.noteIn >= 0 && st.noteIn < 8;
    fill(t, x, 225, 32, 30, flash ? PAL.N3 : PAL.N2); fill(t, x, 225, 32, 1, flash ? PAL.N6 : PAL.N4);
    // the slip: yellowed while it lands (the flash's eight frames), then greyed to the inventory's muted tone, like
    // everything else in his pocket (the review: a bright slip held in the band beside Ekiel's domino and the plate
    // read as Ep1's compute IOU set against the disbanding)
    if (v === '·') { const live = st.noteIn !== undefined && st.noteIn >= 0 && st.noteIn < 8; fill(t, x + 9, 235, 14, 10, live ? PAL.W6 : PAL.P0); fill(t, x + 9, 235, 14, 1, live ? PAL.W7 : PAL.P1); fill(t, x + 22, 236, 1, 9, live ? PAL.W4 : PAL.G3); for (let r = 0; r < 3; r++) fill(t, x + 11, 238 + r * 2, 8 - r * 2, 1, live ? PAL.D3 : PAL.G3); }
    else tiny(t, v.toUpperCase(), x + 16 - Math.round(tinyWidth(v.toUpperCase()) / 2), 247, PAL.P1);
  });
  // the top row: the strip's line typed in his colour, or the sentence line in the game's white
  if (st.say) { const s = st.say.slice(0, st.sayN ?? st.say.length); pt(t, s, 8, 210, PAL.C7); if ((st.sayN ?? 99) < st.say.length) fill(t, 9 + pw(s), 209, 1, 9, PAL.C7); }
  else if (st.sentence) pt(t, st.sentence, 8, 210, PAL.P2);
  const d = st.dim ?? 0;
  for (let y = 203; y < 270; y++) for (let x = 0; x < 480; x++) b.set(x, y, d ? stepColor(t.get(x, y), -d) : t.get(x, y));
};
