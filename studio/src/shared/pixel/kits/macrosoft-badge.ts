// MR. MAS — shared kit: THE MACROSOFT BADGE (PROP-MACROSOFT-BADGE; Ep1 Act Four v5 art pass, round 3; new file, owned by
// the v5 art pass). S7.01 / S7.02: on his desk, beside the GUEST lanyard he took off, the badge Tasya's side issued him:
// slate blue (the MACROSOFT slate, rooms/bullpen.ts SLATE_RAMP), a plain card with the name in caps, a slate strap.
// Nothing on it is a real brand: no logo, no squares, only the parody name in the show's micro caps.
//   macrosoftBadge(b, x, y, scale, o)  'p2'   the P2 box's desk (S7.01), beside v4's lanyardOnDesk card (30 x 16 there):
//                                            a 34 x 16 card, the strap lying in a loose S to the left (x, y = card top-left;
//                                            o.strap false = the strap coiled under the card, for a tight desk)
//                                    'desk' room/medium scale, beside guestBadge('desk'): ~16 x 10, micro caps
//                                    'room' the bullpen wide (S7.02): a 3 x 2 card and a 1 px strap (x, y = card top-left)
//   badgesOnDeskRoom(b, x, y)        S7.02: the two, side by side at room scale: GUEST (red over white) and MACROSOFT (slate)
import {Buf, rect} from '../px';
import {PAL} from '../palette';
import {micro, microWidth} from '../cast/bosses';

const SLATE = {strap: [PAL.N5, PAL.N6, PAL.N7], card: PAL.N7, head: PAL.N5, lit: PAL.N8, ink: PAL.P2};
export const MACROSOFT_BADGE_TEXT = 'MACROSOFT';

export const macrosoftBadge = (b: Buf, x: number, y: number, scale: 'p2' | 'desk' | 'room' = 'p2', o: {strap?: boolean} = {}) => {
  if (scale === 'room') {
    b.set(x - 1, y - 1, SLATE.strap[1]); b.set(x - 2, y - 1, SLATE.strap[0]);
    rect(x, y, 3, 2, b.ink(SLATE.card)); b.set(x, y, SLATE.lit);
    return;
  }
  if (scale === 'desk') {
    const w = microWidth(MACROSOFT_BADGE_TEXT) + 4;
    for (let i = 0; i < 14; i++) b.set(x - 14 + i, y + 6 + (i % 7 < 3 ? 0 : 1), SLATE.strap[i % 2]);
    rect(x + 1, y + 1, w, 10, b.ink(PAL.N0));
    rect(x, y, w, 10, b.ink(SLATE.card)); rect(x, y, w, 2, b.ink(SLATE.head)); rect(x, y, w, 1, b.ink(SLATE.lit));
    micro(b, MACROSOFT_BADGE_TEXT, x + 2, y + 4, SLATE.ink);
    return;
  }
  // 'p2': the card 34 x 16 (the name in micro caps, a photo square, a barcode), the strap in a loose S to its left
  const w = Math.max(34, microWidth(MACROSOFT_BADGE_TEXT) + 6), h = 16;
  if (o.strap !== false) {
    for (let i = 0; i < 40; i++) {
      const px = x - 40 + i, py = y + 8 + Math.round(Math.sin(i / 6) * 2);
      b.set(px, py, SLATE.strap[1]); b.set(px, py + 1, SLATE.strap[0]);
    }
    rect(x - 3, y + 6, 4, 3, b.ink(PAL.G4)); b.set(x - 3, y + 6, PAL.G6); // the clip
  }
  rect(x + 1, y + 1, w, h, b.ink(PAL.N0));
  rect(x, y, w, h, b.ink(SLATE.card));
  rect(x, y, w, 4, b.ink(SLATE.head)); rect(x, y, w, 1, b.ink(SLATE.lit));
  rect(x + Math.round(w / 2) - 3, y + 1, 6, 1, b.ink(PAL.N2)); // the slot punch
  micro(b, MACROSOFT_BADGE_TEXT, x + Math.round((w - microWidth(MACROSOFT_BADGE_TEXT)) / 2), y + 6, SLATE.ink);
  rect(x + 3, y + 11, 4, 4, b.ink(SLATE.head)); // the photo square (blank)
  for (let i = 0; i < w - 12; i++) if ((i * 7) % 5 < 3) b.set(x + 9 + i, y + 13, PAL.N3);
};

/** S7.02 at room scale: GUEST (white card, red strap) and MACROSOFT (slate), side by side on his desk */
export const badgesOnDeskRoom = (b: Buf, x: number, y: number) => {
  b.set(x - 1, y - 1, PAL.R2); b.set(x - 2, y - 1, PAL.R1);
  rect(x, y, 3, 2, b.ink(PAL.P2)); b.set(x, y, PAL.R2); b.set(x + 1, y, PAL.R2); b.set(x + 2, y, PAL.R2);
  macrosoftBadge(b, x + 5, y, 'room');
};
