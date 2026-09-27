// MR. MAS — shared kit: THE MACROSOFT BADGE (PROP-MACROSOFT-BADGE; Ep1 Act Four v5 art pass, round 3; new file, owned by
// the v5 art pass). S7.01 / S7.02: on his desk, beside the GUEST lanyard he took off, the badge Tasya's side issued him:
// slate blue (the MACROSOFT slate, rooms/bullpen.ts SLATE_RAMP), a plain card with the name in caps, a slate strap.
// Nothing on it is a real brand: no logo, no squares, only the parody name in the show's micro caps.
//   macrosoftBadge(b, x, y, scale, o)  'p2'   the P2 box's desk (S7.01), beside v4's lanyardOnDesk card (30 x 16 there):
//                                            a 34 x 16 card, the strap lying in a loose S to the left (x, y = card top-left;
//                                            o.strap false = the strap coiled under the card, for a tight desk)
//                                    'desk' room/medium scale, beside guestBadge('desk'): ~16 x 10, micro caps
//                                    'room' the bullpen wide (S7.02): a 7 x 4 card lying flat, its strap in a 1 px loop
//                                           (x, y = card top-left)
//   badgesOnDeskRoom(b, x, y)        S7.02: the two, side by side at room scale: GUEST (white, red band) and MACROSOFT
//                                    (slate). 17 x 6 overall; (x, y) = the GUEST card's top-left
//   BADGES_ROOM_AT                   where the pair lies relative to bullpenRoom's masDesk anchor: on the desk top left of
//                                    his laptop, clear of his arms (a4p5)
// a4p5 (the prep check read the room pair as invisible: two 3 x 2 chips, "about 1-3 px on the desk"): the room-scale
// cards are now 7 x 4, one flat colour each with a lit edge, a shadow and a band, so the wide reads "two cards, one
// red-and-white, one slate" at 1x. The words themselves are established in S7.01's P2 box ('p2', which reads); the wide
// only has to carry the two colours (a room-scale card can't carry lettering at 480 x 270).
import {Buf, rect} from '../px';
import {PAL} from '../palette';
import {micro, microWidth} from '../cast/bosses';

const SLATE = {strap: [PAL.N5, PAL.N6, PAL.N7], card: PAL.N7, head: PAL.N5, lit: PAL.N8, ink: PAL.P2};
export const MACROSOFT_BADGE_TEXT = 'MACROSOFT';
/** the room-scale card (lying flat, seen from the wide's slight high angle) */
export const BADGE_ROOM = {w: 7, h: 4, gap: 3};
/** the pair's (x, y) relative to bullpenRoom's masDesk anchor (S7.02's walkout wide; masDesk = [270, 115] there) */
export const BADGES_ROOM_AT: [number, number] = [-22, 34];

export const macrosoftBadge = (b: Buf, x: number, y: number, scale: 'p2' | 'desk' | 'room' = 'p2', o: {strap?: boolean} = {}) => {
  if (scale === 'room') {
    const {w, h} = BADGE_ROOM;
    // the strap: a 1 px loop off the card's left end, lying on the desk
    b.set(x - 1, y + 1, SLATE.strap[1]); b.set(x - 2, y + 2, SLATE.strap[1]); b.set(x - 2, y + 3, SLATE.strap[0]); b.set(x - 1, y + 4, SLATE.strap[0]);
    rect(x + 1, y + 1, w, h, b.ink(PAL.N0)); // its shadow
    rect(x, y, w, h, b.ink(SLATE.card));
    rect(x, y, w, 1, b.ink(SLATE.lit)); // the lit far edge
    rect(x, y + 1, w, 1, b.ink(SLATE.head)); // the header band
    rect(x + 2, y + 2, w - 3, 1, b.ink(PAL.N8)); // the printed name, a light line
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

/** S7.02 at room scale: GUEST (white card, red band, red strap) and MACROSOFT (slate), side by side on his desk */
export const badgesOnDeskRoom = (b: Buf, x: number, y: number) => {
  const {w, h, gap} = BADGE_ROOM;
  // GUEST: the red strap's loop off its left end, the white card with the red header band
  b.set(x - 1, y + 1, PAL.R2); b.set(x - 2, y + 2, PAL.R2); b.set(x - 2, y + 3, PAL.R1); b.set(x - 1, y + 4, PAL.R1);
  rect(x + 1, y + 1, w, h, b.ink(PAL.N0));
  rect(x, y, w, h, b.ink(PAL.P2));
  rect(x, y, w, 2, b.ink(PAL.R2)); rect(x, y, w, 1, b.ink(PAL.R3));
  rect(x + 2, y + 3, w - 3, 1, b.ink(PAL.P0)); // GUEST, a dark line
  macrosoftBadge(b, x + w + gap, y, 'room');
};
