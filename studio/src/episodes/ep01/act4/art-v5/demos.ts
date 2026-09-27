// MR. MAS — Ep1 Act Four v5 art pass: one demo still per new asset state (the stills sheet's registry; tools/sheet.ts).
// Each demo paints the 480 x 203 picture area of a native frame the way the v5 shot would use the asset, so the sheet
// shows the asset in its framing, not on a blank. These are previews, not the v5 layouts: shots5.ts (INF-SHOTS5, not
// built yet) owns the shots. Keys are `ID@state`; ids match art-needs-v5.md §2.
import {Buf, rect, bayer, hash} from '../../../../shared/pixel/px';
import {text} from '../../../../shared/pixel/font';
import {PAL} from '../../../../shared/pixel/palette';
import {drawPost, POSTS, postBox} from '../../../../shared/pixel/kits/post-card';
import {withFootnoteStyle, FootnoteStyle, drawNelehTile} from '../../../../shared/pixel/cast/neleh';

export interface AssetDemo {
  id: string;
  state?: string;
  /** the module the asset lives in (repo-relative from studio/src) */
  module: string;
  note?: string;
  /** what in this still is still a stand-in (empty = none) */
  standin?: string;
  draw: (fb: Buf) => void;
}
export const DEMOS: AssetDemo[] = [];
/** a4p5 r2: Neleh's footnotes in every demo are drawn in the v5 style ('slips', cast/neleh.ts withFootnoteStyle), since
 *  the sheet previews v5; FIX-FOOTNOTES@digits-vs-slips shows v4's digits beside them. A demo can pin `footnotes`. */
export const V5_FOOTNOTES: FootnoteStyle = 'slips';
const D = (d: AssetDemo & {footnotes?: FootnoteStyle}) => { const draw = d.draw; DEMOS.push({...d, draw: (fb) => withFootnoteStyle(d.footnotes ?? V5_FOOTNOTES, () => draw(fb))}); };

// ------------------------------------------------------------------ UI-POST
D({id: 'UI-POST', state: 'phone', module: 'shared/pixel/kits/post-card.ts', note: "S5.03 phone size: Rima's post, hearted; the flood below",
  draw: (fb) => {
    rect(0, 0, 480, 203, fb.ink(PAL.N0));
    rect(128, 0, 224, 203, fb.ink(PAL.N1));
    let y = 8;
    drawPost(fb, 132, y, POSTS.rimaPeople, {size: 'phone', w: 216, hearted: true, hearts: 1});
    y += postBox(POSTS.rimaPeople, 'phone', 216).h + 6;
    for (let i = 0; i < 3; i++) {
      drawPost(fb, 132, y, {...POSTS.rimaPeople, who: 'staff'}, {size: 'phone', w: 216, hearted: i < 2, hearts: [2, 4, 16][i]});
      y += postBox(POSTS.rimaPeople, 'phone', 216).h + 6;
    }
  }});
D({id: 'UI-POST', state: 'notify', module: 'shared/pixel/kits/post-card.ts', note: "S3.05 / S4.01 / S4.09 notification size; right: its entrance, k0-k2 held, k3 whole",
  draw: (fb) => {
    rect(0, 0, 480, 203, fb.ink(PAL.N1));
    drawPost(fb, 20, 20, POSTS.gergQuit, {size: 'notify', w: 150, glow: true});
    drawPost(fb, 20, 70, POSTS.masEulogy, {size: 'notify', w: 200});
    drawPost(fb, 250, 20, POSTS.masBadge, {size: 'notify', w: 200});
    // a4p5 r2: the card's entrance as labelled held steps (k 0, 1, 2, then whole); a lone k 1 read as an empty card
    ([0, 1, 2, 3] as const).forEach((k, i) => { text(fb, `k${k}`, 232, 86 + i * 29, PAL.N6); drawPost(fb, 250, 76 + i * 29, POSTS.gergQuit, {size: 'notify', w: 150, k}); });
  }});
D({id: 'UI-POST', state: 'popup', module: 'shared/pixel/kits/post-card.ts', note: "S7.01 / S7.13 pop-up in its own UI",
  draw: (fb) => {
    rect(0, 0, 480, 203, fb.ink(PAL.D1));
    drawPost(fb, 30, 30, POSTS.alyiRegret, {size: 'popup', w: 200, hearts: 3});
    drawPost(fb, 250, 30, POSTS.ttemmeResult, {size: 'popup', w: 210});
    drawPost(fb, 250, 120, POSTS.gergReturn, {size: 'popup', w: 210, hearts: 12});
  }});

// ------------------------------------------------------------------ ROOM-NELEH-DESK + CAST-NELEH-OTS-R + UI-CALL-V5
import {drawNelehDeskOTS, drawNelehBezel, drawNelehDeskWall, NDESK} from '../../../../shared/pixel/rooms/neleh-desk';
import {drawNelehShoulderR} from '../../../../shared/pixel/cast/neleh-ots';
import {drawBoardCall, BOARD_NOTICE} from '../../../../shared/pixel/kits/call-boardside';
import {nelehPortrait, NELEH_PORTRAIT_DEFAULT} from '../../../../shared/pixel/cast/neleh';
import {drawBust} from '../animatic/framing';
const otsScreen = (st: Parameters<typeof drawBoardCall>[1]) => { const s = new Buf(NDESK.screen.w, NDESK.screen.h, PAL.N1); drawBoardCall(s, st); return s; };
const fullScreen = (st: Parameters<typeof drawBoardCall>[1]) => { const s = new Buf(456, 177, PAL.N1); drawBoardCall(s, st); return s; };
D({id: 'ROOM-NELEH-DESK', state: 'ots-day-waiting', module: 'shared/pixel/rooms/neleh-desk.ts + kits/call-boardside.ts', note: 'S3.00a open: 11:59, the empty fifth tile, her pen on step 1',
  draw: (fb) => drawNelehDeskOTS(fb, 40, {time: 'day', push: 0, screen: otsScreen({f: 40, clock: '11:59', fifth: {kind: 'waiting', k: 40}})})});
D({id: 'ROOM-NELEH-DESK', state: 'ots-day-connected-push', module: 'shared/pixel/rooms/neleh-desk.ts + kits/call-boardside.ts', note: 'S3.00a late: 12:00, his tile live (neon chase), Alyi speaking; push 12 px',
  draw: (fb) => drawNelehDeskOTS(fb, 300, {time: 'day', push: 12, neleh: {turn: 1}, screen: otsScreen({f: 300, clock: '12:00', fifth: {kind: 'mas', k: 99}, speaking: 'alyi', mouths: {alyi: 'E'}})})});
D({id: 'ROOM-NELEH-DESK', state: 'ots-day-rima', module: 'shared/pixel/rooms/neleh-desk.ts + kits/call-boardside.ts', note: "S3.04: Rima's spotlit fifth slot over Neleh's shoulder",
  draw: (fb) => drawNelehDeskOTS(fb, 500, {time: 'day', push: 4, pen: 'gone', screen: otsScreen({f: 500, clock: '12:04', fifth: {kind: 'rima', k: 40, mouth: 'A'}, speaking: 'rima'})})});
D({id: 'ROOM-NELEH-DESK', state: 'scr-day-removed', module: 'shared/pixel/rooms/neleh-desk.ts drawNelehBezel + kits/call-boardside.ts', note: 'S3.01: his tile gone, the four closed, the notice, the audio chip lit',
  draw: (fb) => drawNelehBezel(fb, fullScreen({f: 320, clock: '12:00', removed: 40, audio: {level: 2}, notice: {text: BOARD_NOTICE.removed, k: 60}}), {time: 'day'})});
D({id: 'ROOM-NELEH-DESK', state: 'scr-day-removing', module: 'shared/pixel/rooms/neleh-desk.ts drawNelehBezel + kits/call-boardside.ts', note: 'S3.01 k 6: mid-reflow (held step), the notice starting',
  draw: (fb) => drawNelehBezel(fb, fullScreen({f: 286, clock: '12:00', removed: 7, notice: {text: BOARD_NOTICE.removed, k: 2}}), {time: 'day'})});
D({id: 'ROOM-NELEH-DESK', state: 'scr-evening', module: 'shared/pixel/rooms/neleh-desk.ts drawNelehBezel', note: "S3.05: the lamp's warm pool on the bezel; Rima in the fifth slot; Gerg's post",
  draw: (fb) => {
    const s = fullScreen({f: 900, clock: '6:12', fifth: {kind: 'rima', k: 99}});
    // r3: the notification sits in the bottom-left corner over THE QUIET VOTE's black tile (at 150,40 it covered Mada's
    // face); nobody who speaks in S3.05 is under it
    // a4p5 r2: 5 px lower (at 142 its top covered "camera" in "camera off", which then read "...off")
    drawPost(s, 4, 147, POSTS.gergQuit, {size: 'notify', w: 156, glow: true});
    drawNelehBezel(fb, s, {time: 'evening'});
  }});
D({id: 'ROOM-NELEH-DESK', state: 'mcu-wall', module: 'shared/pixel/rooms/neleh-desk.ts drawNelehDeskWall + cast/neleh.ts', note: 'S3.04b: Neleh MCU right third, brow query, over the soft shelf wall',
  draw: (fb) => { drawNelehDeskWall(fb, {time: 'day', soft: 2}); drawBust(fb, nelehPortrait({...NELEH_PORTRAIT_DEFAULT, brow: 'query'}), {third: 'R'}); }});
for (const light of ['screen', 'lamp', 'window', 'sil'] as const)
  D({id: 'CAST-NELEH-OTS-R', state: light, module: 'shared/pixel/cast/neleh-ots.ts', note: `her right-side OTS shoulder, light '${light}': turn 0 at frame right, turn 1 (toward the screen) inset`,
    draw: (fb) => {
      rect(0, 0, 480, 203, fb.ink(light === 'lamp' ? PAL.W1 : light === 'screen' ? PAL.C1 : PAL.N2));
      rect(40, 30, 280, 150, fb.ink(light === 'screen' ? PAL.C4 : PAL.N1));
      if (light === 'window') {
        // a4p5 r2: over a night window (S4.04 looks past her onto the boardroom glass), not a flat navy card
        for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) fb.set(x, y, y < 70 ? PAL.N1 : y < 108 ? (bayer(x, y) < (y - 70) / 60 ? PAL.N3 : PAL.N2) : y === 108 ? PAL.N4 : PAL.N1);
        for (let r = 0; r < 9; r++) for (let x = (r * 7) % 4; x < 480; x += 2 + (r >> 1)) if (hash(x, r, 9) < 0.55) fb.set(x, 110 + Math.round(r * r * 1.1), r < 2 ? PAL.W3 : hash(x, r, 10) < 0.1 ? PAL.C5 : hash(x, r, 11) < 0.2 ? PAL.W7 : PAL.W5);
        for (const mx of [118, 262, 406]) { rect(mx, 0, 4, 203, fb.ink(PAL.N0)); rect(mx, 0, 1, 203, fb.ink(PAL.N4)); }
        rect(0, 196, 480, 7, fb.ink(PAL.N0)); rect(0, 196, 480, 1, fb.ink(PAL.N4));
      }
      drawNelehShoulderR(fb, 480, 203, {light, turn: 0});
      drawNelehShoulderR(fb, 330, 203, {light, turn: 1});
    }});

// ------------------------------------------------------------------ UI-BLOG-DRAFT
import {drawBlogDraft} from '../../../../shared/pixel/kits/blog-draft';
const blogShot = (st: Parameters<typeof drawBlogDraft>[1]) => (fb: Buf) => { const s = new Buf(456, 177, PAL.N1); drawBlogDraft(s, st); drawNelehBezel(fb, s, {time: 'day'}); };
D({id: 'UI-BLOG-DRAFT', state: 'draft', module: 'shared/pixel/kits/blog-draft.ts', note: 'S3.03: the draft, both sentences, Post, the call in the corner', draw: blogShot({f: 700, k: 0, pointer: 'rest'})});
D({id: 'UI-BLOG-DRAFT', state: 'click', module: 'shared/pixel/kits/blog-draft.ts', note: "S3.03: her pointer on Post, the pressed drawing (the click on a tick)", draw: blogShot({f: 1000, k: 300, pointer: 'post', click: 0})});
D({id: 'UI-BLOG-DRAFT', state: 'posted', module: 'shared/pixel/kits/blog-draft.ts', note: 'S3.03 tail: PUBLISHED, the date, the toast', draw: blogShot({f: 1020, k: 320, pointer: 'post', click: 30})});

// ------------------------------------------------------------------ UI-LETTER-V5
import {drawStaffLetter, LETTER_SCROLL_MAX} from '../../../../shared/pixel/kits/staff-letter';
D({id: 'UI-LETTER-V5', state: 'first-quote', module: 'shared/pixel/kits/staff-letter.ts', note: 'S5.06 ~2 s: the insult on the page, SIGNED 505, Gerg reading (mouth), window night',
  draw: (fb) => drawStaffLetter(fb, {k: 60, f: 4000, quotes: [40, 200, 340], count: 505, gerg: {mouth: 'E'}, window: 0})});
D({id: 'UI-LETTER-V5', state: 'third-quote', module: 'shared/pixel/kits/staff-letter.ts', note: 'S5.06 ~15 s: all three quotes, SIGNED 700, scrolled 60 px',
  draw: (fb) => drawStaffLetter(fb, {k: 360, f: 4300, quotes: [40, 200, 340], count: 700, scroll: 60, gerg: {mouth: 'A'}, window: 0})});
D({id: 'UI-LETTER-V5', state: 'alyi-stop', module: 'shared/pixel/kits/staff-letter.ts', note: 'S5.06 end: scrolled to the bottom, ALYI lit, 745 / 770, the window one step greyer',
  draw: (fb) => drawStaffLetter(fb, {k: 520, f: 4460, quotes: [40, 200, 340], count: 745, clunk: false, scroll: LETTER_SCROLL_MAX, alyi: true, gerg: {mouth: 'rest'}, window: 1})});

// ------------------------------------------------------------------ BP-NELEH-POINTER (over v4's plan4 sheet, the v5 poses)
import {drawPlan4, PLAN4} from '../animatic/plan4';
import {bpNeleh, bpTipIn, bpVoice, inkOver, sweep, bpBracket} from '../../../../shared/pixel/kits/bp-pointer';
import {BPX} from '../../../../shared/pixel/kits/blueprint';
const planShot = (id: string) => ({id, marks: {}, lines: [], texts: []} as unknown as Parameters<typeof drawPlan4>[1]);
const NX = 458; // r3: inside the sheet's double border (at 468 the border line ran through her paper)
D({id: 'BP-NELEH-POINTER', state: 'point-plates', module: 'shared/pixel/kits/bp-pointer.ts', note: 'S1.03: her figure at the right edge taps MAS / CEO and GERG / CO-FOUNDER',
  standin: 'the sheet is v4 plan4 (it gets the figure drawn in before composite in plan5)',
  // a4p5 r2: the callout (routed under the labels and the four's ring to a hot arrow at the bracket's centre) replaces
  // the straight leader, which ended a pixel from ALYI's chair
  draw: (fb) => { drawPlan4(fb, planShot('S1.03'), 100); inkOver(fb, (b) => { const box: [number, number, number, number] = [176, PLAN4.FOOT + 3, 96, 24]; bpNeleh(b, NX, PLAN4.FOOT, {kind: 'point', at: [224, PLAN4.FOOT + 14], tap: 1, callout: {box, rail: PLAN4.FOOT + 41}}, 100, {knock: true}); bpBracket(b, ...box, 4); }); }});
D({id: 'BP-NELEH-POINTER', state: 'sweep-four-us', module: 'shared/pixel/kits/bp-pointer.ts', note: "S1.03: the sweep to the four (a held in-between), her page glowing on \"us\"",
  draw: (fb) => { drawPlan4(fb, planShot('S1.03'), 110); inkOver(fb, (b) => bpNeleh(b, NX, PLAN4.FOOT, sweep(10, 0, 12, [216, 162], [336, 110]), 110, {glow: true, knock: true})); }});
D({id: 'BP-NELEH-POINTER', state: 'detail-ring-voice', module: 'shared/pixel/kits/bp-pointer.ts', note: "S1.04 2x detail: the pointer's tip on the key ring; MADA's spinner icon (speaking)",
  draw: (fb) => { drawPlan4(fb, planShot('S1.04'), 30); inkOver(fb, (b) => { bpTipIn(b, [446, 104], [0.55, -1], 120); bpVoice(b, 34, 44, 30, true); }); }});
D({id: 'BP-NELEH-POINTER', state: 'poses', module: 'shared/pixel/kits/bp-pointer.ts', note: 'rest · point (tap) · down · walk A · walk B · 2x rest (the detail scale)',
  // a4p5 r2: on a blank drafting sheet (v4's S1.05 frame 0 left a stray "THE." and a figure cut by the left edge)
  draw: (fb) => { inkOver(fb, (b) => {
    rect(0, 0, 480, 203, b.ink(BPX.navy));
    for (let x = 4; x < 480; x += 8) rect(x, 0, 1, 203, b.ink(x % 40 === 4 ? BPX.major : BPX.minor));
    for (let y = 4; y < 203; y += 8) rect(0, y, 480, 1, b.ink(y % 40 === 4 ? BPX.major : BPX.minor));
    bpNeleh(b, 280, 110, {kind: 'rest'}, 0); bpNeleh(b, 330, 110, {kind: 'point', at: [260, 60], tap: 0}, 0); bpNeleh(b, 380, 110, {kind: 'down'}, 0);
    bpNeleh(b, 280, 190, {kind: 'walk', step: 1}, 0); bpNeleh(b, 330, 190, {kind: 'walk', step: 2}, 0); bpNeleh(b, 420, 190, {kind: 'rest'}, 0, {k: 2}); }); }});

// ------------------------------------------------------------------ CAST-TTEMME-MEDIUM + PROP-FOLDER + PLATE-BOARD-HEAD + UI-CHAT-ROOM
import {drawBoardHead, drawBoardHead2S, drawBoardHeadM} from '../../../../shared/pixel/rooms/boardroom-head';
import {drawTtemmeMedium, TTEMME_MEDIUM_DEFAULT} from '../../../../shared/pixel/cast/ttemme-medium';
import {drawFolder} from '../../../../shared/pixel/kits/folder';
import {drawChatPanel} from '../../../../shared/pixel/kits/chat-panel';
import {VISEMES} from '../../../../shared/pixel/cast/talk';
D({id: 'PLATE-BOARD-HEAD', state: '2S-offer', module: 'shared/pixel/rooms/boardroom-head.ts', note: 'S4.10b: Neleh at the side, Ttemme in the CEO chair, Mada soft beyond, the chat panel, the folder sliding',
  draw: (fb) => drawBoardHead2S(fb, 1200, {ttemme: {mouth: 'rest'}, neleh: {mouth: 'E'}, folder: {kind: 'table', slide: 0.5}, chat: 1200})});
D({id: 'PLATE-BOARD-HEAD', state: '2S-reading', module: 'shared/pixel/rooms/boardroom-head.ts + kits/folder.ts', note: 'S4.10b: he reads behind the folder (seal broken, cover open away from us)',
  draw: (fb) => drawBoardHead2S(fb, 1300, {ttemme: {head: 'down'}, neleh: {mouth: 'rest'}, folder: {kind: 'up', seal: 'broken', open: 2}, chat: 1300})});
D({id: 'PLATE-BOARD-HEAD', state: 'M-door-tasya', module: 'shared/pixel/rooms/boardroom-head.ts', note: 'S4.13c: slate wall, the door open, Tasya soft in it; Ttemme turned to him, nodding',
  draw: (fb) => drawBoardHeadM(fb, 2000, {ttemme: {nod: 1, mouth: 'smile', brow: 'unsure'}, tasya: {arm: 'clasp', mouth: 'smile'}, tasyaNod: 1, chat: 2000})});
D({id: 'PLATE-BOARD-HEAD', state: 'empty', module: 'shared/pixel/rooms/boardroom-head.ts drawBoardHead', note: 'the plate alone: window wall, slats, the LED bar, the table, the CEO chair',
  draw: (fb) => drawBoardHead(fb, 0, {})});
D({id: 'CAST-TTEMME-MEDIUM', state: 'sheet', module: 'shared/pixel/cast/ttemme-medium.ts', note: 'mouths A E O M rest smile · lids · brows · nod 2 · down · arms rest / hourglass / folder · spot light',
  draw: (fb) => {
    rect(0, 0, 480, 203, fb.ink(PAL.N2));
    const table = (y: number, x = 0) => (b: Buf) => rect(x, y + 80, 78, 20, b.ink(PAL.D2));
    VISEMES.forEach((m, i) => drawTtemmeMedium(fb, 4 + i * 78, 0, {...TTEMME_MEDIUM_DEFAULT, mouth: m}, {table: table(0, 4 + i * 78)}));
    const row2: Array<[Partial<typeof TTEMME_MEDIUM_DEFAULT>, Parameters<typeof drawTtemmeMedium>[4]]> = [
      [{lid: 1}, {}], [{lid: 2}, {}], [{brow: 'hype', look: 1}, {flip: true}], [{brow: 'unsure', nod: 2}, {}], [{arm: 'hourglass', head: 'down'}, {hourglass: {sand: 0.3}}], [{arm: 'folder', head: 'down', light: 'spot'}, {folder: {kind: 'up', seal: 'whole', open: 0}}],
    ];
    row2.forEach(([s, o], i) => drawTtemmeMedium(fb, 4 + i * 78, 100, {...TTEMME_MEDIUM_DEFAULT, ...s}, {table: table(100, 4 + i * 78), ...o}));
  }});
D({id: 'PROP-FOLDER', state: 'states', module: 'shared/pixel/kits/folder.ts', note: 'on the table (4 held slide steps) · up sealed · seal broken · cover opening · open (no page shows)',
  draw: (fb) => {
    rect(0, 0, 480, 203, fb.ink(PAL.D1)); rect(0, 120, 480, 83, fb.ink(PAL.D2));
    for (let i = 0; i < 4; i++) drawFolder(fb, 0, 0, {kind: 'table', slide: i / 4}, {path: [[60, 160], [420, 160]]});
    drawFolder(fb, 70, 60, {kind: 'up', seal: 'whole', open: 0}, {hands: 'ttemme'});
    drawFolder(fb, 170, 60, {kind: 'up', seal: 'broken', open: 0}, {hands: 'ttemme'});
    drawFolder(fb, 280, 60, {kind: 'up', seal: 'broken', open: 1}, {hands: 'ttemme'});
    drawFolder(fb, 390, 60, {kind: 'up', seal: 'broken', open: 2}, {hands: 'ttemme'});
  }});
D({id: 'UI-CHAT-ROOM', state: 'sizes', module: 'shared/pixel/kits/chat-panel.ts', note: 'medium (legible LIVE · CHAT) · room (the wide) · corner (entering the S7.13 overhead)',
  draw: (fb) => {
    rect(0, 0, 480, 203, fb.ink(PAL.D1));
    drawChatPanel(fb, 40, 40, 'medium', 30); drawChatPanel(fb, 140, 60, 'medium', 61); drawChatPanel(fb, 250, 70, 'room', 30); drawChatPanel(fb, 300, 70, 'room', 44);
    drawChatPanel(fb, 470, 190, 'corner', 30);
  }});

// ------------------------------------------------------------------ CAST-TERB-SHEET + PROP-PHONE-TABLE + CAST-OTHER-YRRAL
import {drawCalmOffTerms2S, drawOtherYrralM} from '../../../../shared/pixel/rooms/calmoff-terms';
import {drawPost as drawPostCard} from '../../../../shared/pixel/kits/post-card';
D({id: 'CAST-TERB-SHEET', state: 'reading', module: 'shared/pixel/cast/terb-sheet.ts + rooms/calmoff-terms.ts', note: 'S7.07: Terb in depth between them, the sheet up, reading (mouth open); Mas and Mada still',
  draw: (fb) => drawCalmOffTerms2S(fb, 3000, {terb: {pose: {mouth: 'open'}}})});
D({id: 'CAST-TERB-SHEET', state: 'looks-to-mada', module: 'shared/pixel/cast/terb-sheet.ts + rooms/calmoff-terms.ts', note: 'S7.07 cont: "He stays." Terb looks up, toward Mada',
  draw: (fb) => drawCalmOffTerms2S(fb, 3100, {terb: {pose: {read: false, mouth: 'open'}}})});
D({id: 'CAST-TERB-SHEET', state: 'spray', module: 'shared/pixel/cast/terb-sheet.ts + rooms/calmoff-terms.ts', note: 'S7.07: between sentences he sprays the chair fire, the sheet under his arm',
  draw: (fb) => drawCalmOffTerms2S(fb, 3200, {terb: {spray: 8}})});
D({id: 'PROP-PHONE-TABLE', state: 'lit', module: 'shared/pixel/rooms/calmoff-terms.ts drawTablePhone + kits/post-card.ts', note: "S7.09: Mas's phone lights green on the table (no keycaps, a4p5); Gerg's post as its notify card",
  draw: (fb) => { drawCalmOffTerms2S(fb, 3400, {terb: {pose: {arm: 'sheet', read: false}}, phone: 10, mada: {nod: 1}, stopped: true}); drawPostCard(fb, 150, 12, {who: 'gerg', text: 'Returning to NopeAI & getting back to coding tonight.'}, {size: 'notify', w: 184, glow: true}); }});
D({id: 'CAST-OTHER-YRRAL', state: 'nod-0', module: 'shared/pixel/rooms/calmoff-terms.ts drawOtherYrralM', note: 'S7.07b: the seated silhouette, the nameplate, among the fires', draw: (fb) => drawOtherYrralM(fb, 3050, {nod: 0})});
D({id: 'CAST-OTHER-YRRAL', state: 'nod-1', module: 'shared/pixel/rooms/calmoff-terms.ts drawOtherYrralM', note: 'S7.07b: the nod (the second drawing, held 6 f)', draw: (fb) => drawOtherYrralM(fb, 3056, {nod: 1})});

// ------------------------------------------------------------------ ROOM-LOBBY-CCTV-DESK + PLATE-BOARD-SCREEN + CAST-ALYI-LOOK + CAST-ALYI-PHONE
import {drawLobbyFeed, FEED_W, FEED_H} from '../../../../shared/pixel/kits/lobby-feed';
import {drawBoardScreenOTS, drawBoardScreen2S} from '../../../../shared/pixel/rooms/board-screen';
import {alyiLook, drawAlyiDoorPhone} from '../../../../shared/pixel/cast/alyi-v5';
import {doorFrame} from '../animatic/framing';
const feed = (st: Parameters<typeof drawLobbyFeed>[1], post = true) => { const s = new Buf(FEED_W, FEED_H, PAL.N0); drawLobbyFeed(s, st); if (post) drawPost(s, 6, FEED_H - 44, POSTS.masBadge, {size: 'notify', w: 150}); return s; };
D({id: 'ROOM-LOBBY-CCTV-DESK', state: 'stand-zoom', module: 'shared/pixel/kits/lobby-feed.ts', note: 'S4.09 feed at 3x here: Mas at the desk, the ZOOM window holding on GUEST', draw: (fb) => {
  rect(0, 0, 480, 203, fb.ink(PAL.N0)); const s = feed({f: 5000, phase: 'stand', k: 30}, false); for (let y = 0; y < FEED_H; y++) for (let x = 0; x < FEED_W; x++) fb.set(128 + x, 17 + y, s.get(x, y)); }});
D({id: 'ROOM-LOBBY-CCTV-DESK', state: 'walk-out', module: 'shared/pixel/kits/lobby-feed.ts', note: 'S4.09 on "here": he turns and walks out through the revolving door (inside the drum)', draw: (fb) => {
  rect(0, 0, 480, 203, fb.ink(PAL.N0)); const s1 = feed({f: 5200, phase: 'walk', k: 60}, false), s2 = feed({f: 5240, phase: 'walk', k: 110}, false);
  for (let y = 0; y < FEED_H; y++) for (let x = 0; x < FEED_W; x++) { fb.set(8 + x, 17 + y, s1.get(x, y)); fb.set(248 + x, 17 + y, s2.get(x, y)); } }});
D({id: 'PLATE-BOARD-SCREEN', state: 'ots-day', module: 'shared/pixel/rooms/board-screen.ts + kits/lobby-feed.ts', note: "S4.09: over Neleh onto the wall screen by day: the feed at 1:1, his post, Alyi's reflection in the glass (speaking)",
  draw: (fb) => drawBoardScreenOTS(fb, 5000, {feed: feed({f: 5000, phase: 'stand', k: 30}), alyi: {mouth: 'A'}})});
D({id: 'PLATE-BOARD-SCREEN', state: '2S-night-door', module: 'shared/pixel/rooms/board-screen.ts + cast/alyi-v5.ts', note: "S4.13d: Neleh (pen stops), Alyi's reflection looking at the slate door beyond",
  draw: (fb) => drawBoardScreen2S(fb, 6000, {alyi: {look: 'door'}, neleh: {arm: 'marker', mouth: 'rest', head: '34'}})});
D({id: 'CAST-ALYI-LOOK', state: 'looks', module: 'shared/pixel/cast/alyi-v5.ts alyiLook', note: 'ahead · left · right · down (the eye patches); S3.07 MCU·door with the look to the employee',
  draw: (fb) => {
    rect(0, 0, 480, 203, fb.ink(PAL.W1));
    (['ahead', 'left', 'right', 'down'] as const).forEach((d, i) => { const img = alyiLook({mouth: 'rest', eyes: 'open', t: 0, dir: d}); for (let y = 30; y < 90; y++) for (let x = 20; x < 90; x++) { const v = img.c[y * img.w + x]; if (v >= 0) fb.set(10 + i * 76 + (x - 20), 4 + (y - 30), v); } });
    const img = alyiLook({mouth: 'rest', eyes: 'open', t: 0, dir: 'left'});
    drawBust(fb, img, {third: 'R', y: 70}); doorFrame(fb, 250, 150, {leaf: 'right', leafW: 80});
  }});
D({id: 'CAST-ALYI-PHONE', state: 'reading', module: 'shared/pixel/cast/alyi-v5.ts drawAlyiDoorPhone + rooms/twoshots.ts', note: 'S7.01: the P2 box, Alyi reading his post on his phone',
  draw: (fb) => drawAlyiDoorPhone(fb, 7000, {phone: true, alyi: {mouth: 'rest'}})});
D({id: 'CAST-ALYI-PHONE', state: 'looks-up', module: 'shared/pixel/cast/alyi-v5.ts drawAlyiDoorPhone', note: 'S7.01: he looks up at the three hearts (twoshots alyiUp), the phone still in hand',
  draw: (fb) => drawAlyiDoorPhone(fb, 7100, {phone: true, alyi: {mouth: 'rest', up: true}, hearts: [7040, 7060, 7080]})});

// ------------------------------------------------------------------ ROOM-SLATE-DESKS (S5.11, S5.12)
import {drawDark2S} from '../../../../shared/pixel/rooms/twoshots';
import {drawDarkPlate, drawDarkPlateDesk, drawDarkPlateFront, DPLATE, DPLATE_LOOK} from '../../../../shared/pixel/rooms/darkroom-plate';
import {drawSlateDoorOpen, drawSlateBeyond, slateDoorSign, SLATE_GAP} from '../../../../shared/pixel/rooms/slate-desks';
import {soft, softMask, keepRect, vignette as mcuVignette, MCU_X} from '../animatic/framing';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../shared/pixel/cast/mas';
const dark2S = (fb: Buf, f: number, over: (b: Buf) => void) => {
  // drawDark2S paints the plate, the Orb, Mas and the desk in one call; the door overlay goes in between via a plate
  // pass: paint the full 2S, then re-apply the door region from a plate that carries the overlay
  drawDark2S(fb, f, {mas: {arm: 'rest'}, orb: {look: DPLATE_LOOK.door}, plate: {tally: 3, lanyard: true, phone: 'up', door: 4}});
  over(fb);
};
D({id: 'ROOM-SLATE-DESKS', state: '2S-key-turning', module: 'shared/pixel/rooms/slate-desks.ts drawSlateDoorOpen', note: 'S5.11 lead-in: the door up, the key mid-turn (drawing 2 of 3), the sign left of the latch',
  draw: (fb) => dark2S(fb, 900, (b) => { drawSlateDoorOpen(b, 900, {key: 1}); slateDoorSign(b, 0); })});
D({id: 'ROOM-SLATE-DESKS', state: '2S-open-desks', module: 'shared/pixel/rooms/slate-desks.ts drawSlateDoorOpen', note: 'S5.11 on "desk": the crack open (13 px), the labelled desks in slate light, the spill',
  draw: (fb) => dark2S(fb, 1100, (b) => { drawSlateDoorOpen(b, 1100, {gap: SLATE_GAP.open}); slateDoorSign(b, 0); })});
D({id: 'ROOM-SLATE-DESKS', state: 'key-drawings', module: 'shared/pixel/rooms/slate-desks.ts', note: 'the key turn, 3 held drawings (1:1 crops of the door) + the crack at 6 and 13 px',
  draw: (fb) => {
    rect(0, 0, 480, 203, fb.ink(PAL.N0));
    const cells: Array<(b: Buf) => void> = [
      (b) => drawSlateDoorOpen(b, 900, {key: 0}), (b) => drawSlateDoorOpen(b, 900, {key: 1}), (b) => drawSlateDoorOpen(b, 900, {key: 2}),
      (b) => drawSlateDoorOpen(b, 900, {gap: SLATE_GAP.crack}), (b) => drawSlateDoorOpen(b, 900, {gap: SLATE_GAP.open}),
    ];
    cells.forEach((paint, i) => {
      const p = new Buf(480, 203, PAL.N0);
      drawDarkPlate(p, 900, {door: 4}); paint(p); slateDoorSign(p, 0);
      const sx = DPLATE.door.x0 - 6, sy = DPLATE.door.y0 - 6, w = 58, h = 108;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) fb.set(12 + i * 92 + x, 8 + y, p.get(sx + x, sy + y));
    });
  }});
D({id: 'ROOM-SLATE-DESKS', state: 'beyond-wide', module: 'shared/pixel/rooms/slate-desks.ts drawSlateBeyond', note: 'the slate room alone in a wide rect (for a wider door or a later pull-out): rows of labelled desks',
  draw: (fb) => { rect(0, 0, 480, 203, fb.ink(PAL.N0)); drawSlateBeyond(fb, 90, 10, 300, 183, {vp: [0.5, 0.4]}); }});
D({id: 'ROOM-SLATE-DESKS', state: 'mcu-soft', module: 'shared/pixel/rooms/slate-desks.ts (+ v3 29.17 framing)', note: 'S5.12 after the rack: Mas left, not turning; the door soft, open a crack on the desks',
  standin: 'the MCU framing is v3 29.17\'s recipe re-typed here (the v5 layout owns it)',
  draw: (fb) => {
    const plate: Parameters<typeof drawDarkPlate>[2] = {tally: 3, glass: true, lanyard: true, phone: 'up', door: 4};
    drawDarkPlate(fb, 0, plate); drawSlateDoorOpen(fb, 0, {gap: SLATE_GAP.open}); slateDoorSign(fb, 0);
    drawDarkPlateDesk(fb, 0, plate); drawDarkPlateFront(fb, 0, plate);
    const doorMask = new Uint8Array(480 * 270);
    keepRect(doorMask, DPLATE.door.x0 - 2, DPLATE.door.y0 - 2, DPLATE.door.x1 - DPLATE.door.x0 + 4, DPLATE.deskY - DPLATE.door.y0 + 4);
    soft(fb, 2, doorMask); softMask(fb, 0, doorMask); mcuVignette(fb, MCU_X.L + 56, 2);
    drawBust(fb, masPortrait({...MAS_PORTRAIT_DEFAULT, look: -1}), {third: 'L', faceK: 0});
  }});

// ------------------------------------------------------------------ CAST-MAS-TURNAWAY (S8.07)
import {masTurnedAway, drawVaultMid, gergHandOnVault, VAULT_MID} from '../../../../shared/pixel/cast/mas-turnaway';
import {gergGlow} from '../../../../shared/pixel/cast/gerg-speak';
import {drawBullpen} from '../../../../shared/pixel/rooms/bullpen';
import {drawOrb} from '../../../../shared/pixel/cast/orb-medium';
import {vignette as roomVignette} from '../animatic/framing';
const vault50 = (step: 0 | 1, dx: number, rack: 0 | 1) => (fb: Buf) => {
  // v4 S8.07's frameless 50/50 recipe (the bullpen by day, soft 1), the vault drawn at this scale between them
  drawBullpen(fb, 0, {door: 'shut'});
  const keep = new Uint8Array(480 * 270); keepRect(keep, 196, 88, 100, 104);
  soft(fb, 1, keep); roomVignette(fb, 158, 1); roomVignette(fb, 330, 1);
  const VX = 198, VY = 92;
  drawVaultMid(fb, VX, VY, {soft: rack ? 0 : 1, noteSharp: !!rack});
  drawBust(fb, masTurnedAway({light: 'warm', step}), {third: 'L', dx: -8 + dx, y: 24, faceK: rack});
  drawOrb(fb, 186 + dx, 44, 9, {look: [0.9, 0.5], aperture: 0.5} as Parameters<typeof drawOrb>[4]);
  drawBust(fb, gergGlow({mouth: 'rest', lid: 1, look: -1}), {third: 'R', dx: 14, y: 26, faceK: rack});
  gergHandOnVault(fb, VX + VAULT_MID.hand.x, VY + VAULT_MID.hand.y, rack);
};
D({id: 'CAST-MAS-TURNAWAY', state: '50-50', module: 'shared/pixel/cast/mas-turnaway.ts', note: 'S8.07: Mas turned away, already past (no mouth); Gerg\'s hand on the vault; the vault soft between',
  draw: vault50(0, 0, 0)});
D({id: 'CAST-MAS-TURNAWAY', state: '50-50-rack', module: 'shared/pixel/cast/mas-turnaway.ts', note: 'S8.07 after "the last one.": RACK to the vault, both men soft, the note sharp; Mas walking (step 2)',
  draw: vault50(1, -10, 1)});
D({id: 'CAST-MAS-TURNAWAY', state: 'drawings', module: 'shared/pixel/cast/mas-turnaway.ts masTurnedAway', note: 'warm step 0 / step 1 · monitor step 0 · vs his front portrait (v4) for scale',
  draw: (fb) => {
    rect(0, 0, 480, 203, fb.ink(PAL.G1));
    const imgs = [masTurnedAway({light: 'warm', step: 0}), masTurnedAway({light: 'warm', step: 1}), masTurnedAway({light: 'monitor', step: 0}), masPortrait({...MAS_PORTRAIT_DEFAULT, look: -1, light: 'warm'})];
    imgs.forEach((img, i) => { for (let y = 0; y < img.h && y < 200; y++) for (let x = 0; x < img.w; x++) { const v = img.c[y * img.w + x]; if (v >= 0) fb.set(4 + i * 118 + x, 4 + y, v); } });
  }});

// ------------------------------------------------------------------ ROOM-BULLPEN-UNPACK (S8.08)
import {drawBullpenUnpack, openBox, shirtExtra} from '../../../../shared/pixel/rooms/bullpen-unpack';
D({id: 'ROOM-BULLPEN-UNPACK', state: 'reading', module: 'shared/pixel/rooms/bullpen-unpack.ts', note: 'S8.08: Nov 29, coats off, boxes open, the staff turned to his end desk; Mas reading (mouth open)',
  draw: (fb) => { drawBullpenUnpack(fb, 0, {mas: {mouth: 'open'}}); }});
D({id: 'ROOM-BULLPEN-UNPACK', state: 'drift-8', module: 'shared/pixel/rooms/bullpen-unpack.ts', note: 'S8.08 end of the drift (8 px left); Mas between words (mouth rest)',
  draw: (fb) => { drawBullpenUnpack(fb, 0, {mas: {mouth: 'rest'}, drift: 8}); }});
D({id: 'ROOM-BULLPEN-UNPACK', state: 'parts', module: 'shared/pixel/rooms/bullpen-unpack.ts openBox + shirtExtra', note: 'open boxes 0-4 · staff in shirtsleeves (6 shirts, holds: mug / plant / papers), both facings',
  draw: (fb) => {
    rect(0, 0, 480, 203, fb.ink(PAL.G3)); rect(0, 120, 480, 83, fb.ink(PAL.G2));
    for (let i = 0; i < 5; i++) { const im = openBox(i); for (let y = 0; y < im.h; y++) for (let x = 0; x < im.w; x++) { const v = im.c[y * im.w + x]; if (v >= 0) fb.set(12 + i * 30 + x, 20 + y, v); } }
    const holds = ['none', 'mug', 'plant', 'papers', 'none', 'mug'] as const;
    for (let i = 0; i < 6; i++) { const im = shirtExtra([3, 7, 12, 19, 23, 31][i], {shirt: i, hold: holds[i], flip: i % 2 === 1}); for (let y = 0; y < im.h; y++) for (let x = 0; x < im.w; x++) { const v = im.c[y * im.w + x]; if (v >= 0) fb.set(170 + i * 50 + x, 100 + y, v); } }
  }});

// ------------------------------------------------------------------ PROP-HOURGLASS-INSERT (S4.11, S7.13)
import {drawHourglassXL, hgxFlip, HGX, HGX_GRAINS, HGX_HIGH} from '../../../../shared/pixel/kits/hourglass-insert';
import {drawTableInsert, TABLE_INSERT} from '../../../../shared/pixel/rooms/boardroom';
import {woodGrain} from '../../../../shared/pixel/kits/props';
import {drawTtemmeMedium as ttM, TTEMME_MEDIUM_DEFAULT as TTM} from '../../../../shared/pixel/cast/ttemme-medium';
import {drawChatPanel as chatP} from '../../../../shared/pixel/kits/chat-panel';
/** S4.11 [LOW·desk]: the boardroom table at eye level, the dark window, Ttemme above and behind (soft), the chat beside */
const lowDesk = (fb: Buf, k: number, f: number) => {
  rect(0, 0, 480, 203, fb.ink(PAL.N1));
  for (let y = 0; y < 120; y++) for (let x = 0; x < 480; x++) if (((x * 7 + y * 13) % 97) === 0) fb.set(x, y, y < 60 ? PAL.W3 : PAL.C2);
  // r3: he sits at the far end of the table (his bust meets the table band at y 150), soft, instead of floating
  // beside the hourglass at its own height (the stills check read the insert-scale hourglass as a giant prop)
  const td = new Buf(480, 203, PAL.N0);
  ttM(td, 200, 52, {...TTM, head: 'down', light: 'room', arm: 'rest'});
  for (let y = 0; y < 150; y++) for (let x = 0; x < 480; x++) { const v = td.get(x, y); if (v !== PAL.N0) fb.set(x, y, v); }
  soft(fb, 2);
  // the table top at eye level: a thin dark band, its lit edge (the LED bar), the grain
  rect(0, 150, 480, 53, fb.ink(PAL.D1)); woodGrain(fb, 0, 150, 480, 53, 7, [PAL.D0, PAL.D1, PAL.D2, PAL.D3]);
  rect(0, 150, 480, 1, fb.ink(PAL.C5)); rect(0, 151, 480, 1, fb.ink(PAL.C3));
  chatP(fb, 330, 70, 'medium', f);
  const fl = hgxFlip(k);
  drawHourglassXL(fb, 60, 150 - HGX.h + 4 + fl.dy, {moved: fl.flipped ? 2 : 0, running: fl.flipped && !fl.hand, f, pose: fl.pose, hand: fl.hand});
};
D({id: 'PROP-HOURGLASS-INSERT', state: 'low-flip-side', module: 'shared/pixel/kits/hourglass-insert.ts', note: 'S4.11: the flip\'s middle drawing (on its side, his hand), Ttemme soft above, the chat beside',
  standin: 'the LOW·desk plate here is a demo backing (the v5 layout owns the boardroom plate)',
  draw: (fb) => lowDesk(fb, 6, 3000)});
D({id: 'PROP-HOURGLASS-INSERT', state: 'low-running', module: 'shared/pixel/kits/hourglass-insert.ts', note: 'S4.11: set down, flipped; the sand starts to fall, one pixel per beat',
  standin: 'the LOW·desk plate here is a demo backing (the v5 layout owns the boardroom plate)',
  draw: (fb) => lowDesk(fb, 40, 3060)});
/** S7.13 [HIGH]: a4p5 r2 puts the high view on v4's own S7.13 plate (rooms/boardroom drawTableInsert 'prop': the walnut
 *  top, the pendant's reflection, the blueprint's corner), its foot on TABLE_INSERT.prop, instead of a flat grain field
 *  (which read as a wall) */
const highTable = (st: Parameters<typeof drawHourglassXL>[3], post = false) => (fb: Buf) => {
  drawTableInsert(fb, {f: 0, focus: 'prop'});
  const [px, py] = TABLE_INSERT.prop;
  drawHourglassXL(fb, px - HGX_HIGH.foot[0], py + 3 - HGX_HIGH.foot[1], {view: 'high', ...st});
  chatP(fb, 470, 160, 'corner', 5000);
  if (post) drawPost(fb, 20, 20, POSTS.ttemmeResult, {size: 'popup', w: 200});
};
D({id: 'PROP-HOURGLASS-INSERT', state: 'high-last-grain', module: 'shared/pixel/kits/hourglass-insert.ts', note: 'S7.13 [HIGH]: the table from above, a third of the frame; the last grain on the neck; his post; the chat corner',
  draw: highTable({moved: HGX_GRAINS - 1}, true)});
D({id: 'PROP-HOURGLASS-INSERT', state: 'high-shatter', module: 'shared/pixel/kits/hourglass-insert.ts', note: 'S7.13: the shatter (k 4): shards on their arcs, the sand still holding the bulb\'s shape',
  draw: highTable({moved: HGX_GRAINS, shatter: 4})});
D({id: 'PROP-HOURGLASS-INSERT', state: 'states', module: 'shared/pixel/kits/hourglass-insert.ts', note: 'full, running, last grain, crack, held · slump 16, 22, side, HIGH · lift+hand',
  draw: (fb) => {
    // a4p5 r2: re-laid out (the lift+hand drawing's sleeve overlapped the slump drawing above it)
    rect(0, 0, 480, 203, fb.ink(PAL.N2));
    const S: Array<Parameters<typeof drawHourglassXL>[3]> = [{moved: 0}, {moved: 200, running: true, f: 30}, {moved: HGX_GRAINS - 1}, {moved: HGX_GRAINS, shatter: 0}, {moved: HGX_GRAINS, shatter: 10}];
    S.forEach((o, i) => drawHourglassXL(fb, 8 + i * 76, 2, o));
    drawHourglassXL(fb, 8, 104, {moved: HGX_GRAINS, shatter: 16});
    drawHourglassXL(fb, 84, 104, {moved: HGX_GRAINS, shatter: 22});
    drawHourglassXL(fb, 184, 104, {pose: 'side'});
    drawHourglassXL(fb, 296, 102, {view: 'high', moved: HGX_GRAINS - 1});
    drawHourglassXL(fb, 404, 102, {pose: 'lift', hand: true});
  }});

// ------------------------------------------------------------------ CAST-TASYA-PHONE (S4.13)
import {tasyaPhonePortrait} from '../../../../shared/pixel/cast/tasya-phone';
import {drawBoardPlate, drawBoardPlateTable, drawBoardPlateFront} from '../../../../shared/pixel/rooms/boardroom-plate';
const s413 = (st: Parameters<typeof tasyaPhonePortrait>[0]) => (fb: Buf) => {
  // v4 S4.13's recipe: the boardroom plate with the slate door (door 5), soft 2, the vignette; the bust right third
  const opt = {slate: true, door: 5, laptop: false, rolodex: 'still'} as Parameters<typeof drawBoardPlate>[2];
  drawBoardPlate(fb, 0, opt); drawBoardPlateTable(fb, 0, opt); drawBoardPlateFront(fb, 0, opt);
  soft(fb, 2); roomVignette(fb, 318, 2);
  drawBust(fb, tasyaPhonePortrait(st), {third: 'R', dx: 4});
  doorFrame(fb, 246, 172, {leaf: 'left', leafW: 58, light: PAL.N5});
};
D({id: 'CAST-TASYA-PHONE', state: 'reading', module: 'shared/pixel/cast/tasya-phone.ts', note: 'S4.13: in the new doorway, reading his statement off his phone (eyes down, the screen on his chin), mouth open',
  draw: s413({mouth: 'E', lid: 0, brow: 'warm', arms: 'none', jangle: 0, read: true})});
D({id: 'CAST-TASYA-PHONE', state: 'pleased-ring', module: 'shared/pixel/cast/tasya-phone.ts', note: 'S4.13: looking up from it, pleased, the key-ring arm up (the ring itself is the host\'s, as v4)',
  draw: s413({mouth: 'smile', lid: 0, brow: 'warm', arms: 'ring', jangle: 0, read: false})});

// ================================================================== round 3 (prep-artbuild-r3): the remaining P2 items
// v4 backings come from THE EDITOR's v4 composer (animatic/frame4.ts native4), so each new asset shows in the v4 shot it
// re-dresses. The act frames are v4 lock frames (shots-locked-v4.json); v5 will re-clock them.
import {native4} from '../animatic/frame4';
const v4Frame = (f: number) => (fb: Buf) => { const n = native4(f).fb; for (let i = 0; i < 480 * 203; i++) fb.c[i] = n.c[i]; };

// ------------------------------------------------------------------ UI-JOIN-CORNER (S1.02)
import {drawNudgeJoin} from '../../../../shared/pixel/kits/join-corner';
D({id: 'UI-JOIN-CORNER', state: 'set-beside', module: 'shared/pixel/kits/join-corner.ts drawNudgeJoin', note: "S1.02: the nudge ECU with the laptop's corner: BOARD · VIDEO CALL, the waiting fifth tile, JOIN, his arrow beside it",
  draw: (fb) => drawNudgeJoin(fb, 'set', {pointer: 'beside'})});
D({id: 'UI-JOIN-CORNER', state: 'out1-glow', module: 'shared/pixel/kits/join-corner.ts drawNudgeJoin', note: "S1.02: the hand leaving for the trackpad; JOIN's halo, held step 2 (the beat before the blueprint print)",
  draw: (fb) => drawNudgeJoin(fb, 'out1', {pointer: 'beside', glow: 2})});

// ------------------------------------------------------------------ PROP-SPEAKERPHONE-MCU (S4.07)
import {drawSpeakerphoneMCU, dialAt} from '../../../../shared/pixel/kits/speakerphone';
D({id: 'PROP-SPEAKERPHONE-MCU', state: 'pull', module: 'shared/pixel/kits/speakerphone.ts', note: "S4.07 over v4's MCU·PF: she pulls the pod across the table to her (held step 2 of 3)",
  draw: (fb) => { v4Frame(2370)(fb); drawSpeakerphoneMCU(fb, {slide: 2, hand: 'pull'}); }});
D({id: 'PROP-SPEAKERPHONE-MCU', state: 'dial-2', module: 'shared/pixel/kits/speakerphone.ts dialAt', note: 'S4.07: the second tone: her index on the key (pressed), two seat LEDs lit',
  draw: (fb) => { v4Frame(2370)(fb); drawSpeakerphoneMCU(fb, {slide: 3, hand: 'dial', ...dialAt(13, 0, 12)}); }});
D({id: 'PROP-SPEAKERPHONE-MCU', state: 'dial-4', module: 'shared/pixel/kits/speakerphone.ts dialAt', note: 'S4.07: the fourth tone, all four LEDs lit (one per seat); the ring follows in S4.08',
  draw: (fb) => { v4Frame(2370)(fb); drawSpeakerphoneMCU(fb, {slide: 3, hand: 'dial', ...dialAt(37, 0, 12)}); }});

// ------------------------------------------------------------------ PROP-MACROSOFT-BADGE (S7.01, S7.02)
import {macrosoftBadge, badgesOnDeskRoom, BADGES_ROOM_AT} from '../../../../shared/pixel/kits/macrosoft-badge';
import {guestBadge} from '../../../../shared/pixel/kits/props';
import {bullpenRoom} from '../animatic/backs';
D({id: 'PROP-MACROSOFT-BADGE', state: 'p2', module: 'shared/pixel/kits/macrosoft-badge.ts', note: "S7.01 over v4's P2 box: the slate MACROSOFT card on his desk beside the GUEST card (v4's lanyardOnDesk)",
  draw: (fb) => { v4Frame(4460)(fb); macrosoftBadge(fb, 22, 143, 'p2', {strap: false}); }});
D({id: 'PROP-MACROSOFT-BADGE', state: 'room', module: 'shared/pixel/kits/macrosoft-badge.ts badgesOnDeskRoom', note: 'S7.02 the walkout wide: the two badges on his end desk at room scale (GUEST red-white, MACROSOFT slate)',
  draw: (fb) => { const b = new Buf(480, 270, PAL.N0); const A = bullpenRoom(b, 0, {variant: 'walkout'}, {mas: true, tasya: {arm: 'clasp'}, landlord: {floor: 0, ceiling: 0, walls: 0}}); for (let i = 0; i < 480 * 203; i++) fb.c[i] = b.c[i]; const [mx, my] = A.masDesk; badgesOnDeskRoom(fb, mx + BADGES_ROOM_AT[0], my + BADGES_ROOM_AT[1]); }});
D({id: 'PROP-MACROSOFT-BADGE', state: 'scales', module: 'shared/pixel/kits/macrosoft-badge.ts', note: "p2 (with its strap) · desk (beside guestBadge 'desk') · room (x4 crop inset) · the pair at room scale",
  draw: (fb) => {
    rect(0, 0, 480, 203, fb.ink(PAL.D2)); rect(0, 0, 480, 1, fb.ink(PAL.D4));
    macrosoftBadge(fb, 70, 30, 'p2');
    guestBadge(fb, 146, 34, 'desk'); macrosoftBadge(fb, 210, 35, 'desk');
    // a4p5: the room pair is 17 x 6 now (7 x 4 cards); the inset shows it at 6x
    const t = new Buf(26, 10, PAL.D2); badgesOnDeskRoom(t, 5, 2);
    for (let y = 0; y < 10; y++) for (let x = 0; x < 26; x++) rect(300 + x * 6, 30 + y * 6, 6, 6, fb.ink(t.get(x, y)));
    badgesOnDeskRoom(fb, 300, 110);
  }});

// ------------------------------------------------------------------ CAST-EMP-STAND (S3.06)
import {drawEmployeeStanding, EMP_STAND_WHO} from '../../../../shared/pixel/cast/employee-stand';
import {ALLHANDS_TILES} from '../../../../shared/pixel/rooms/bullpen';
/** v4 S3.06 shifts the all-hands room right by 30 px for the match cut (shots4.ts MATCH_DX, not exported) */
const MATCH_DX = 30;
D({id: 'CAST-EMP-STAND', state: 'stand-hand-up', module: 'shared/pixel/cast/employee-stand.ts', note: "S3.06 over v4's all-hands wide: tile 22 risen (step 3) with her hand up: she stands",
  draw: (fb) => { v4Frame(1700)(fb); drawEmployeeStanding(fb, EMP_STAND_WHO, {rise: 3, hand: true}, {dx: MATCH_DX}); }});
D({id: 'CAST-EMP-STAND', state: 'stand-hand-down', module: 'shared/pixel/cast/employee-stand.ts', note: 'S3.06 tail / S3.07: her hand down, still standing',
  draw: (fb) => { v4Frame(1700)(fb); drawEmployeeStanding(fb, EMP_STAND_WHO, {rise: 3, hand: false}, {dx: MATCH_DX}); }});
D({id: 'CAST-EMP-STAND', state: 'steps', module: 'shared/pixel/cast/employee-stand.ts', note: 'the stand in 3 held steps (rise 0 · 1 · 2 · 3), 4x crops round tile 22',
  draw: (fb) => {
    rect(0, 0, 480, 203, fb.ink(PAL.N1));
    const t = ALLHANDS_TILES[EMP_STAND_WHO];
    ([0, 1, 2, 3] as const).forEach((r, i) => {
      const b = new Buf(480, 270, PAL.N0); const n = native4(1700).fb; b.c.set(n.c);
      drawEmployeeStanding(b, EMP_STAND_WHO, {rise: r, hand: true}, {dx: MATCH_DX});
      const sx = t.x + MATCH_DX - 6, sy = t.y - 24;
      for (let y = 0; y < 48; y++) for (let x = 0; x < 28; x++) rect(8 + i * 118 + x * 4, 4 + y * 4, 4, 4, fb.ink(b.get(sx + x, sy + y)));
    });
  }});

// ------------------------------------------------------------------ STYLE-1G-NEON + STYLE-1G-SOFT
import {drawMasTileTheirs, drawTileSoft, drawBoardCall as drawCall5} from '../../../../shared/pixel/kits/call-boardside';
import {drawTile, callChrome} from '../../../../shared/pixel/kits/callgrid';
import {G5 as G5v2, BOARD4 as BOARD4v2, masTileState} from '../animatic/shots';
D({id: 'STYLE-1G-NEON', state: 'their-side-steps', module: 'shared/pixel/kits/call-boardside.ts vegasNeon / drawMasTileTheirs', note: "his tile on THEIR side at f 0 · 8 · 16 (one step per 8 f: marquee, floor chase, star) · frozen on 'super.'",
  draw: (fb) => {
    rect(0, 0, 480, 203, fb.ink(PAL.N1));
    [0, 8, 16].forEach((f, i) => drawMasTileTheirs(fb, 8 + i * 157, 10, 150, 84, f));
    drawMasTileTheirs(fb, 8, 106, 150, 84, 40, {frozen: true});
    text(fb, 'f 0', 12, 96, PAL.G4); text(fb, 'f 8', 169, 96, PAL.G4); text(fb, 'f 16', 326, 96, PAL.G4); text(fb, 'FROZEN', 12, 192, PAL.G4);
  }});
D({id: 'STYLE-1G-NEON', state: 'his-side-guard', module: 'shared/pixel/kits/callgrid.ts vegasBg (guard) · drawTile({neonGuard})', note: "his OWN tile on his side (S1.07-S1.09): top v4 (f 0/2/4: steps every 2-4 f, the car) · below neonGuard (f 0/8/16)",
  draw: (fb) => {
    rect(0, 0, 480, 203, fb.ink(PAL.N1));
    [0, 2, 4].forEach((f, i) => drawTile(fb, {x: 8 + i * 157, y: 8, w: 150, h: 84, id: 'mas', name: 'MAS MANALT', muted: false, level: 1}, 20 + f));
    [0, 8, 16].forEach((f, i) => drawTile(fb, {x: 8 + i * 157, y: 108, w: 150, h: 84, id: 'mas', name: 'MAS MANALT', muted: false, level: 1, neonGuard: true}, 24 + f));
  }});
D({id: 'STYLE-1G-SOFT', state: 'his-side', module: 'shared/pixel/kits/call-boardside.ts drawTileSoft', note: "his side (sc 26's call, v2 geometry): the four board tiles' video one grid-true step softer, their chips sharp; his own tile sharp",
  draw: (fb) => {
    const b = new Buf(480, 203, PAL.N1);
    callChrome(b, {title: 'board sync', clock: null, controls: false});
    BOARD4v2.forEach((t, i) => drawTileSoft(b, {...G5v2[i + 1], id: t.id, name: t.name, vote: 3, muted: t.id === 'off' ? true : undefined}, 620));
    drawTile(b, {...masTileState(), neonGuard: true}, 620);
    for (let i = 0; i < 480 * 203; i++) fb.c[i] = b.c[i];
  }});
D({id: 'STYLE-1G-SOFT', state: 'their-side', module: 'shared/pixel/kits/call-boardside.ts drawBoardCall({softMas})', note: 'their side (S3.00a / S3.01 [SCR]): his tile soft (softMas), their own four sharp',
  draw: (fb) => { const s = new Buf(456, 177, PAL.N1); drawCall5(s, {f: 300, clock: '12:00', fifth: {kind: 'mas', k: 99}, softMas: true, speaking: 'alyi', mouths: {alyi: 'A'}}); drawNelehBezel(fb, s, {time: 'day'}); }});

// ------------------------------------------------------------------ UI-CALL-V5: the states the desk stills don't show
const call5 = (st: Parameters<typeof drawCall5>[1]) => (fb: Buf) => { const s = new Buf(456, 177, PAL.N1); drawCall5(s, st); drawNelehBezel(fb, s, {time: 'day'}); };
D({id: 'UI-CALL-V5', state: 'connect-step', module: 'shared/pixel/kits/call-boardside.ts', note: 'S3.00a on 12:00: his tile connecting, the 2nd of 3 held opening steps (the waiting tile gone)',
  draw: call5({f: 250, clock: '12:00', fifth: {kind: 'mas', k: 3}})});
D({id: 'UI-CALL-V5', state: 'connected', module: 'shared/pixel/kits/call-boardside.ts', note: 'S3.00a: MAS small and still, the one-pixel smile, one bar of hotel Wi-Fi, the neon behind him',
  draw: call5({f: 260, clock: '12:00', fifth: {kind: 'mas', k: 99}})});
D({id: 'UI-CALL-V5', state: 'audio-greyed', module: 'shared/pixel/kits/call-boardside.ts', note: "S3.01 end: the four closed ranks, the notice held, the MAS MANALT · audio chip greyed",
  draw: call5({f: 400, clock: '12:01', removed: 80, audio: {level: 0, greyed: true}, notice: {text: BOARD_NOTICE.removed, k: 99}})});
D({id: 'UI-CALL-V5', state: 'rima-ring', module: 'shared/pixel/kits/call-boardside.ts', note: "S3.04: Rima's join: the ring's first held step; the spotlight searching (overshoot)",
  draw: call5({f: 500, clock: '12:04', removed: 80, fifth: {kind: 'rima', k: 9, mouth: 'rest'}})});
D({id: 'UI-CALL-V5', state: 'rima-spot', module: 'shared/pixel/kits/call-boardside.ts', note: 'S3.04: the spot landed on her slot, speaking (mouth A), her speaking ring',
  draw: call5({f: 540, clock: '12:04', removed: 80, fifth: {kind: 'rima', k: 40, mouth: 'A'}, speaking: 'rima'})});

// ------------------------------------------------------------------ STATE-SMALL: the re-dresses that needed art
D({id: 'STATE-SMALL', state: 'rima-smooth', module: 'shared/pixel/cast/rima-v5.ts + kits/call-boardside.ts (fifth.hand)', note: "S3.04 (item 8): Rima smooths her jacket in her tile, 2 held drawings; 4x crops of the fifth slot (none · smooth0 · smooth1)",
  draw: (fb) => {
    rect(0, 0, 480, 203, fb.ink(PAL.N1));
    (['none', 'smooth0', 'smooth1'] as const).forEach((hand, i) => {
      const s = new Buf(456, 177, PAL.N1);
      drawCall5(s, {f: 540, clock: '12:04', removed: 80, fifth: {kind: 'rima', k: 40, mouth: 'rest', hand}});
      // the fifth slot's centre, 38 x 48 at 4x... too wide: 36 x 46 px of it at 3x
      const L = {x: 243, y: 106};
      for (let y = 0; y < 60; y++) for (let x = 0; x < 50; x++) rect(10 + i * 158 + x * 3, 10 + y * 3, 3, 3, fb.ink(s.get(L.x + 45 + x, L.y + 10 + y)));
    });
  }});
D({id: 'STATE-SMALL', state: 'alyi-mouth-his-side', module: 'shared/pixel/kits/callgrid.ts (TileState.mouth, additive)', note: "S1.07 (item 5): his side's ALYI tile: mouth rest · open (talking unheard), with the call's speaking ring",
  draw: (fb) => {
    rect(0, 0, 480, 203, fb.ink(PAL.N1));
    drawTile(fb, {x: 8, y: 40, w: 150, h: 84, id: 'alyi', name: 'ALYI', vote: 3}, 700);
    drawTile(fb, {x: 166, y: 40, w: 150, h: 84, id: 'alyi', name: 'ALYI', vote: 3, mouth: 'open', speaking: true}, 700);
    drawTile(fb, {x: 324, y: 40, w: 150, h: 84, id: 'alyi', name: 'ALYI', vote: 3, mouth: 'rest', speaking: true}, 702);
  }});

// ------------------------------------------------------------------ STYLE-J1 (conditional): the ported J1's PIXEL side
// The certificate itself is React/SVG (j1/J1Cancelled.tsx) and renders only in Remotion: its stills are in
// out/ep01/act4/assets/v5/j1/ (the preview composition). These are the frames J1 changes in the pixel picture, over
// THE EDITOR's v4 S1.09 (the click at act frame 735), as j1PixelFrame returns them.
import {j1PixelFrame} from './j1/pixel';
const V4_CLICK = 735;
const j1At = (t: number) => (fb: Buf) => { const host = native4(V4_CLICK + t).fb; const out = j1PixelFrame(t, host, {fClick: V4_CLICK}); for (let i = 0; i < 480 * 203; i++) fb.c[i] = out.c[i]; };
D({id: 'STYLE-J1', state: 't01-flash-print', module: 'episodes/ep01/act4/art-v5/j1/pixel.ts', note: 'J1 t 1-2: the flash-print (the room area one flat P1); t 3-44 is the certificate (Remotion only, see j1/)', draw: j1At(1)});
D({id: 'STYLE-J1', state: 't46-snap-scar', module: 'episodes/ep01/act4/art-v5/j1/pixel.ts j1Snap', note: 'J1 t 45-47: the snap: his tile greyed, the ONE scar row across the hoodie, the dialog gone', draw: j1At(46)});
D({id: 'STYLE-J1', state: 't52-fall', module: 'episodes/ep01/act4/art-v5/j1/pixel.ts j1Snap', note: 'J1 t 52: the tile falls through its own slot, masked to it (held drawing 3 of 4)', draw: j1At(52)});
D({id: 'STYLE-J1', state: 't57-close', module: 'episodes/ep01/act4/art-v5/j1/pixel.ts j1Snap', note: 'J1 t 56-57: the slot empty, the four close ranks (held step 2); from t 60 the host resumes', draw: j1At(57)});

// ================================================================== a4p5 r2: FIX-FOOTNOTES (P4), the design call made
// v4's bare gold digits (left) against the v5 paper slips (right), in Neleh's call tile at two orbit phases: f 14 puts
// the front "1" across her brow (the case the prep check read as a mark on her forehead), f 40 the "3" at her cheek.
D({id: 'FIX-FOOTNOTES', state: 'digits-vs-slips', module: 'shared/pixel/cast/neleh.ts drawFootnotes(style) / withFootnoteStyle', note: "left: v4 digits · right: v5 'slips' (her glowing paper, numbered) · orbit f 14 and f 40",
  draw: (fb) => {
    rect(0, 0, 480, 203, fb.ink(PAL.N1));
    ([[14, 8], [40, 106]] as Array<[number, number]>).forEach(([f, y]) => (['digits', 'slips'] as FootnoteStyle[]).forEach((st, i) => {
      const x = i ? 290 : 40;
      rect(x - 1, y - 1, 152, 88, fb.ink(PAL.N3));
      withFootnoteStyle(st, () => drawNelehTile(fb, x, y, 150, 86, {mouth: 'rest', lid: 0, brow: 'level'}, {orbit: f}));
    }));
    text(fb, 'v4 DIGITS', 196, 44, PAL.N6); text(fb, 'v5 SLIPS', 200, 56, PAL.P1);
  }});
