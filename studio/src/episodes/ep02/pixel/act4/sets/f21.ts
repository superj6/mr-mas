// MR. MAS — Ep2 v1 · act4 · F2.1's 2008 stage (sc 19.13-19.14). The shots pass, 2026-10-09. The frame is the intro's
// own 2008 keynote (art/f21/era2008 draw2008, the art pass's copy of studio/src/dev/meras: the sleeve's toss, the catch,
// the collars, the camcorder, EARLY-WEB16), imported; its screen hook (o.screen) is painted here with what F2.1 needs
// (the art's stage2008 painted only the greying pins):
//   stage08(b, g, st)    st.splash: before his click, the screen is a TPOOL title slide whose one red pin stands where the
//                        2006 end card's pin stood (240, 70: the match on the pin); after it, the map in its own
//                        colours (the frame's own) with nine pins, `grey` of them greyed (no cause claimed), and its
//                        corner LAST UPDATED 2012 (`last`)
import {Buf, ellipse, poly} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {bigText, bigTextWidth} from '../../../../../shared/pixel/font';
import {draw2008} from '../../art/f21/era2008';
import {fill, pt, pw} from '../../art/kit';

/** the GPS pin (2006 web red), its tip at (x, y): the same drawing as the 2006 end card's (art/sets/elppa gpsPin) */
const gpsPin = (b: Buf, x: number, y: number) => { poly([x - 4, y - 10, x + 4, y - 10, x + 4, y - 6, x, y, x - 4, y - 6], b.ink(PAL.R2)); ellipse(x, y - 8, 4, 4, b.ink(PAL.R3)); fill(b, x - 1, y - 9, 2, 2, PAL.P2); };
const PINS: Array<[number, number]> = [[30, 30], [62, 54], [100, 26], [140, 70], [180, 40], [210, 90], [44, 100], [120, 104], [228, 30]];
export const stage08 = (b: Buf, g: number, st: {splash?: boolean; grey?: number; last?: boolean} = {}) => {
  draw2008(b, g, {screen: (w, r) => {
    if (st.splash) {
      // the title slide: white, the wordmark, one red pin where the 2006 card's pin was
      fill(w, r.x, r.y, r.w, r.h, PAL.P2);
      fill(w, r.x, r.y + r.h - 18, r.w, 18, PAL.C5);
      const tw = bigTextWidth('TPOOL');
      bigText(w, 'TPOOL', r.x + Math.round((r.w - tw) / 2), r.y + 82, PAL.C4);
      gpsPin(w, 240, 70);
      return;
    }
    PINS.forEach(([px, py], i) => {
      const grey = i < (st.grey ?? 0); const X = r.x + px, Y = r.y + py;
      poly([X - 3, Y - 8, X + 3, Y - 8, X + 3, Y - 5, X, Y, X - 3, Y - 5], w.ink(grey ? PAL.G4 : PAL.R2)); ellipse(X, Y - 6, 3, 3, w.ink(grey ? PAL.G5 : PAL.R3));
    });
    if (st.last) { const s = 'LAST UPDATED 2012'; fill(w, r.x + r.w - pw(s) - 10, r.y + r.h - 14, pw(s) + 8, 11, PAL.P2); pt(w, s, r.x + r.w - pw(s) - 6, r.y + r.h - 12, PAL.G3); }
  }});
};
