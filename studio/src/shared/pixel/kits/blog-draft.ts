// MR. MAS — shared kit: THE NOPEAI BLOG, DRAFTED (UI-BLOG-DRAFT; Ep1 Act Four v5 art pass; new file, owned by the v5 art
// pass). S3.03 [SCR]: her laptop full frame, the company blog's post open in its own editor, both sentences on the page
// in the source's words (the lock's text; the ellipses are print marks), a `Post` button, and the call small in a
// window in the corner (the spinner turning, the black tile, Alyi at his doorway). She reads it once, asks for
// objections, and clicks `Post` on a tick: the button's pressed drawing for 2 frames, then the published state (the
// header reads PUBLISHED, the date line types on, a small `Posted` toast). Generic editor UI (guardrails §5).
// Draws into the 456 x 177 [SCR] opening (v4 geometry: put it with drawNelehBezel or putSCR).
//   drawBlogDraft(b, {f, k, pointer, click})
//     f        act frame (the call's loops)       k       frames into the shot (the page is already open at k 0)
//     pointer  her pointer: 'rest' (off the button) | 'post' (on it) | null
//     click    frames since she clicked Post (undefined = not yet)
//   BLOG.lines  the two sentences (edit here if the facts owner's re-fetch changes a word)
//   BLOG_POST_BTN  the button rect (for the pointer's path)
import {Buf, rect} from '../px';
import {PAL} from '../palette';
import {drawPointer} from './callgrid';
import {pt, pw, bpt, bpw, bpwrap} from './uitype';
import {drawBoardCall} from './call-boardside';

export const BLOG = {
  head: 'NOPEAI BLOG · DRAFT',
  headPosted: 'NOPEAI BLOG · PUBLISHED',
  kicker: 'COMPANY ANNOUNCEMENT',
  date: 'NOV 17, 2023',
  lines: [
    '…he was not consistently candid in his communications with the board…',
    'The board no longer has confidence in his ability to continue leading NopeAI.',
  ],
};
const W = 456, H = 177;
const ED = {x: 10, w: 300};
export const BLOG_POST_BTN = {x: ED.x + ED.w - 52, y: H - 22, w: 48, h: 15};
const CALLWIN = {x: W - 136, y: 22, w: 128, h: 86};

/** read (a4p5 finish, opt-in): how many of the post's words (both sentences, split on spaces) she has read aloud; each
 *  read word gets a 1 px underline in the editor's cursor colour, so the 15 s read has a place on the page and a
 *  motion (the picture audit: the page sat still while an unseen voice read it, and the audience read ahead) */
export interface BlogDraftState { f: number; k: number; pointer?: 'rest' | 'post' | null; click?: number; read?: number }
export const drawBlogDraft = (b: Buf, st: BlogDraftState) => {
  const posted = st.click !== undefined && st.click >= 2;
  rect(0, 0, W, H, b.ink(PAL.N2));
  // the app bar: the blog's mark, the editor's state, the section links (dim)
  rect(0, 0, W, 14, b.ink(PAL.N1)); rect(0, 14, W, 1, b.ink(PAL.N0));
  pt(b, posted ? BLOG.headPosted : BLOG.head, 8, 4, posted ? PAL.L3 : PAL.P1);
  for (const [i, s] of ['RESEARCH', 'SAFETY', 'COMPANY'].entries()) pt(b, s, 220 + i * 50, 4, PAL.N6);
  // the page: paper, the kicker, the rule, both sentences in the display face, greeked rest below
  rect(ED.x, 20, ED.w, H - 20, b.ink(PAL.P2));
  rect(ED.x, 20, ED.w, 1, b.ink(PAL.P1));
  pt(b, BLOG.kicker, ED.x + 12, 26, PAL.G3);
  if (posted) pt(b, `· ${BLOG.date}`.slice(0, Math.max(0, (st.click! - 2) * 2)), ED.x + 16 + pw(BLOG.kicker), 26, PAL.G3);
  rect(ED.x + 12, 36, 140, 1, b.ink(PAL.P0));
  let y = 42, wi = 0;
  for (const [i, s] of BLOG.lines.entries()) {
    for (const l of bpwrap(s, ED.w - 24)) {
      bpt(b, l, ED.x + 12, y, PAL.N2);
      if (st.read !== undefined) { // underline the words read so far (whole words, in this line's own positions)
        const ws = l.split(' ');
        let pre = '';
        for (const w of ws) {
          if (wi < st.read && w) { const x0 = ED.x + 12 + (pre ? bpw(pre + ' ') : 0); rect(x0, y + 14, bpw(w), 1, b.ink(PAL.C4)); }
          if (w) wi++;
          pre = pre ? `${pre} ${w}` : w;
        }
      }
      y += 17;
    }
    if (i === 0) y += 5;
  }
  // the editor's cursor at the end of the text (a draft is still editable), blinking on 16 f
  if (!posted && Math.floor(st.k / 16) % 2 === 0) rect(ED.x + 14 + bpwFinal(), y - 17, 2, 14, b.ink(PAL.C4));
  // the Post button (primary), pressed for 2 frames on the click; after, it greys to "Posted"
  const B = BLOG_POST_BTN;
  const pressed = st.click !== undefined && st.click < 2;
  rect(B.x - 1, B.y - 1, B.w + 2, B.h + 2, b.ink(PAL.N0));
  rect(B.x, B.y + (pressed ? 1 : 0), B.w, B.h - (pressed ? 1 : 0), b.ink(posted ? PAL.G3 : pressed ? PAL.C3 : PAL.C4));
  if (!pressed) rect(B.x, B.y, B.w, 1, b.ink(posted ? PAL.G4 : PAL.C6));
  const label = posted ? 'Posted' : 'Post';
  pt(b, label, B.x + Math.round((B.w - pw(label)) / 2), B.y + 4 + (pressed ? 1 : 0), posted ? PAL.N2 : PAL.N0);
  pt(b, 'Save draft', B.x - 62, B.y + 4, PAL.G4);
  // the call, small in its own window in the corner (the four after his removal: spinner, black tile, Alyi)
  const cw = new Buf(CALLWIN.w, CALLWIN.h, PAL.N1);
  drawBoardCall(cw, {f: st.f, removed: 99, title: 'board sync'});
  rect(CALLWIN.x - 2, CALLWIN.y - 2, CALLWIN.w + 4, CALLWIN.h + 4, b.ink(PAL.N0));
  for (let j = 0; j < CALLWIN.h; j++) for (let i = 0; i < CALLWIN.w; i++) b.set(CALLWIN.x + i, CALLWIN.y + j, cw.get(i, j));
  // the toast after posting
  if (posted && st.click! >= 6) {
    const s = 'Posted to the blog.', w = pw(s) + 16, x = CALLWIN.x + CALLWIN.w - w, yy = CALLWIN.y + CALLWIN.h + 10;
    rect(x, yy, w, 13, b.ink(PAL.N0)); rect(x + 1, yy + 1, w - 2, 11, b.ink(PAL.N3)); rect(x + 1, yy + 1, w - 2, 1, b.ink(PAL.L2));
    pt(b, s, x + 8, yy + 3, PAL.P1);
  }
  // her pointer
  if (st.pointer) {
    const [px, py] = st.pointer === 'post' ? [B.x + 30, B.y + 7] : [B.x - 40, B.y - 34];
    drawPointer(b, px, py, pressed);
  }
};
/** width of the last line of the last sentence (the caret sits after it) */
const bpwFinal = () => { const ls = bpwrap(BLOG.lines[1], ED.w - 24); return Math.min(ED.w - 28, bpw(ls[ls.length - 1])); };
