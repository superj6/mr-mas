// MR. MAS — Ep2 v1 art: the UI props (§3): every post Ep2 shows, in its own UI (Ep1's post kits, imported: kits/post-card
// for Mas and Alyi, kits/post-any for the rest), with the verbatim texts from the script (name swaps; his lowercase); the
// XEL invite card (sc 4B, the look of Ep1's Board sync invite, a mic icon); the blog editor with the post NOPEAI AND NOLE
// and its byline row, the bare Publish (sc 4); the request-for-comment push (sc 15, 17); the ISS link card (sc 20); and
// REMUHCS's roadmap presser at full frame (sc 13; on the corner TV in 19: sets/lobby2 drawPresserSmall).
//   EP2_POSTS / drawEp2Post(b, x, y, id, o)   the posts by id (o = post-card's PostDraw: size, w, k = open steps, hearts)
//   xelInvite(b, f, st)        [ECU] 4B.01: his phone on the table: XEL · LONG-FORM · MAR 18 · 2 HRS with a mic icon,
//                              Accept (st.accept: his thumb on it, then the card settles into the calendar)
//   blogEditor(b, f, st)       [POV] 4.01-4.02: the editor, NOPEAI AND NOLE, the byline row `… · ALYI · … · MAS`, the
//                              bare Publish button (no cursor, no hover; his finger: sets/alyioffice publishECU)
//   requestPush(b, x, y, w)    the push: `request for comment`, its thumbnail a strip of receipt paper
//   issLinkCard(b, x, y, w)    Alyi's Jun 19 post's link card: ISS · "one goal and one product: a safe superintelligence"
//   presserFull(b, f, st)      [SCR] 13.04-13.05 full frame: REMUHCS and three colleagues behind a bill-shaped lectern
//                              (ROADMAP · $32B/YR, nine FORUM stickers; st.tenth: the aide's tenth), aides trying it at the
//                              FLOOR door (st.turn: sideways), the lower third BIPARTISAN SENATE AI ROADMAP, the plate
//                              REMUHCS · MAJORITY LEADER; st.stuck = the 0 BILLS tally (sc 19)
import {Buf, rect, line, ellipse, bayer, hash, clamp, poly} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {drawPost, PostDraw} from '../../../../../shared/pixel/kits/post-card';
import {drawPostFor, PosterAny, POSTERS_A1} from '../../../../../shared/pixel/kits/post-any';
import {drawSenator} from '../../../../../shared/pixel/cast/civic-extras';
import {fill, pt, pw, pwrap, bpt, bpw, tiny, tinyWidth, vramp, RH, TR, grip, HANDSKIN} from '../kit';
import type {ArtAsset} from '../asset';

const FACE = (hair: string[]) => ['....kkkkkk....', '..kkbbbbbbkk..', ...hair, 'kbbbsSSSSsbbbk', 'kbbbsSSSSsbbbk', 'kbbbbsSSsbbbbk', 'kbbbxxssxxbbbk', '.kbxxxxxxxxbk.', '.kbxxxxxxxxbk.', '..kkxxxxxxkk..', '....kkkkkk....'];
export const POSTERS_EP2: Record<string, PosterAny> = {
  ekiel: {name: 'Ekiel', handle: '@ekiel', accent: PAL.C5, bg: PAL.C2, avatar: FACE(['.kbhhhhhhhbbk.', '.khhhhhhhhhbk.', 'kbhhhsSSshhbbk', 'kbbhsSSSSsbbbk']), avatarPal: {k: PAL.N0, b: PAL.C1, h: PAL.B4, s: PAL.S4, S: PAL.S5, x: PAL.N2}, initial: ['###', '#..', '##.', '#..', '###']},
  nopeai: {name: 'NopeAI', handle: '@nopeai', accent: PAL.C7, bg: PAL.N0, avatar: Array.from({length: 14}, (_, j) => j < 2 || j > 11 ? '..kkkkkkkkkk..' : 'kkCCCCCCCCCCkk'), avatarPal: {k: PAL.N0, C: PAL.C5}, initial: ['#.#', '###', '###', '#.#', '#.#']},
  rumpt: {name: 'RUMPT', handle: '@rumpt', accent: PAL.R3, bg: PAL.R1, avatar: Array.from({length: 14}, (_, j) => j < 2 || j > 11 ? '..kkkkkkkkkk..' : 'kkRRRRRRRRRRkk'), avatarPal: {k: PAL.N0, R: PAL.R2}, initial: ['##.', '#.#', '##.', '#.#', '#.#']},
};
type PostDef = {who?: 'mas' | 'alyi'; poster?: PosterAny; text: string; ts?: string; hearts?: number};
/** every post Ep2 shows, verbatim (name swaps; Mas's lowercase is his) */
export const EP2_POSTS: Record<string, PostDef> = {
  her: {who: 'mas', text: 'her', ts: 'MAY 13'},
  alyiLeave1: {who: 'alyi', text: 'After almost a decade, I have made the decision to leave NOPEAI.', ts: 'MAY 14'},
  alyiLeave2: {who: 'alyi', text: '…I will miss everyone dearly.', ts: 'MAY 14'},
  masAlyi: {who: 'mas', text: 'ALYI and NOPEAI are going to part ways. This is very sad to me; ALYI is easily one of the greatest minds of our generation, a guiding light of our field, and a dear friend.', ts: 'MAY 14'},
  ekiel: {poster: POSTERS_EP2.ekiel, text: 'Yesterday was my last day as head of alignment, superalignment lead, and executive @NOPEAI.', ts: 'MAY 17'},
  apology1: {who: 'mas', text: 'vested equity is vested equity, full stop.', ts: 'MAY 18'},
  apology2: {who: 'mas', text: 'this is on me…', ts: 'MAY 18'},
  apology3: {who: 'mas', text: '…i did not know this was happening and i should have.', ts: 'MAY 18'},
  apology4: {who: 'mas', text: '…they can contact me and we\'ll fix that too.', ts: 'MAY 18'},
  pause1: {poster: POSTERS_EP2.nopeai, text: 'We\'ve heard questions about how we chose the voices…', ts: 'MAY 20'},
  pause2: {poster: POSTERS_EP2.nopeai, text: '…We are working to pause the use of…', ts: 'MAY 20'},
  jun10: {who: 'mas', text: 'very happy to be partnering with ELPPA to integrate CHATGTP into their devices later this year! think you will really like it.', ts: 'JUN 10'},
  nole: {poster: POSTERS_A1.nole, text: 'If ELPPA integrates NOPEAI at the OS level, then ELPPA devices will be banned at my companies. That is an unacceptable security violation.', ts: 'JUN 10'},
  alyiIss: {who: 'alyi', text: 'I am starting a new company:', ts: 'JUN 19'},
  hturt: {poster: POSTERS_EP2.rumpt, text: '…and she \'A.I.\'d\' it…', ts: 'AUG 11'},
};
export const drawEp2Post = (b: Buf, x: number, y: number, id: keyof typeof EP2_POSTS, o: PostDraw) => {
  const p = EP2_POSTS[id];
  if (p.who) return drawPost(b, x, y, {who: p.who, text: p.text, ts: p.ts, hearts: p.hearts}, o);
  return drawPostFor(b, x, y, {poster: p.poster!, text: p.text, ts: p.ts, hearts: p.hearts}, o);
};
export const issLinkCard = (b: Buf, x: number, y: number, w = 200) => {
  fill(b, x - 1, y - 1, w + 2, 46, PAL.N0); fill(b, x, y, w, 44, PAL.N3); fill(b, x, y, 40, 44, PAL.P2); bpt(b, 'ISS', x + 6, y + 15, PAL.N1);
  pwrap('"one goal and one product: a safe superintelligence"', w - 50).forEach((l, i) => pt(b, l, x + 46, y + 6 + i * 10, PAL.P1));
};
export const requestPush = (b: Buf, x: number, y: number, w = 170) => {
  fill(b, x - 1, y - 1, w + 2, 32, PAL.N0); fill(b, x, y, w, 30, PAL.N3); fill(b, x, y, w, 1, PAL.C5);
  fill(b, x + 6, y + 5, 10, 20, PAL.P2); for (let j = 0; j < 20; j += 4) fill(b, x + 7, y + 6 + j, 7, 1, PAL.G4);
  pt(b, 'request for comment', x + 24, y + 11, PAL.P2);
};
export const xelInvite = (b: Buf, f: number, st: {accept?: 0 | 1 | 2} = {}) => {
  // the phone face up on the table by the nameplate, its glow on the wood; the calendar card (Ep1's invite look)
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, (x * 3 + y) % 53 < 2 ? PAL.D2 : PAL.D3);
  fill(b, 150, 10, 180, 193, PAL.N0); fill(b, 156, 18, 168, 185, PAL.N2);
  const a = st.accept ?? 0;
  const cy = a === 2 ? 30 : 50;
  fill(b, 166, cy, 148, 92, PAL.N3); fill(b, 166, cy, 148, 2, PAL.C5);
  // the mic icon (where the next shot's mic stands)
  fill(b, 180, cy + 12, 8, 14, PAL.G5); ellipse(184, cy + 12, 4, 3, b.ink(PAL.G6)); fill(b, 183, cy + 26, 2, 6, PAL.G4); fill(b, 178, cy + 32, 12, 2, PAL.G4);
  pt(b, 'XEL · LONG-FORM', 198, cy + 10, PAL.P2); pt(b, 'MAR 18 · 2 HRS', 198, cy + 24, PAL.N8);
  fill(b, 176, cy + 60, 60, 18, a ? PAL.L1 : PAL.C3); pt(b, a ? 'accepted' : 'Accept', 184, cy + 65, PAL.P2);
  fill(b, 244, cy + 60, 60, 18, PAL.N2); pt(b, 'Decline', 250, cy + 65, PAL.N6);
  if (a === 1) { fill(b, 196, cy + 66, 30, 60, HANDSKIN[0][2]); fill(b, 196, cy + 66, 30, 2, HANDSKIN[0][3]); fill(b, 224, cy + 66, 2, 60, HANDSKIN[0][1]); }
};
export const blogEditor = (b: Buf, f: number, st: {pressed?: boolean} = {}) => {
  // his laptop's screen, full-bleed: a plain blog editor (no real platform's chrome), the title, the byline row, the
  // first paragraph's grey bars, the bare Publish
  vramp(b, 0, 0, 480, RH, [PAL.N1, PAL.N2]);
  fill(b, 30, 10, 420, 183, PAL.P2); fill(b, 30, 10, 420, 16, PAL.G5); for (let i = 0; i < 3; i++) ellipse(42 + i * 10, 18, 3, 3, b.ink(PAL.G3));
  bpt(b, 'NOPEAI AND NOLE', 50, 40, PAL.N1);
  pt(b, '… · ALYI · … · MAS', 52, 66, PAL.G3);
  for (let r = 0; r < 7; r++) fill(b, 52, 86 + r * 10, 360 - (r * 37) % 120, 4, PAL.G6);
  fill(b, 360, 160, 74, 22, st.pressed ? PAL.C2 : PAL.C3); fill(b, 360, 160, 74, 2, PAL.C5); pt(b, 'Publish', 376, 167, PAL.P2);
};
// ------------------------------------------------------------------ REMUHCS's roadmap presser (full frame)
export const presserFull = (b: Buf, f: number, st: {turn?: 0 | 1 | 2; tenth?: boolean; stuck?: boolean} = {}) => {
  // a Senate press room: a blue drape, flags-free (no seal), the FLOOR door at right; the colleagues behind the lectern
  vramp(b, 0, 0, 480, RH, [PAL.F1, PAL.F2, PAL.F2]);
  for (let x = 0; x < 480; x += 12) fill(b, x, 0, 3, 150, PAL.F1);
  fill(b, 0, 150, 480, 53, PAL.D2);
  // the FLOOR door (right): a tall wooden door, its sign
  fill(b, 380, 40, 70, 112, PAL.D3); fill(b, 380, 40, 70, 3, PAL.D4); fill(b, 384, 50, 62, 30, PAL.D2); bpt(b, 'FLOOR', 390, 56, PAL.W7);
  // the senators: REMUHCS (plated) and three bipartisan colleagues (unplated, unnamed), and the aides
  drawSenator(b, 90, 176, 1, 'sit'); drawSenator(b, 140, 176, 2, 'sit'); drawSenator(b, 300, 176, 0, 'sit');
  drawSenator(b, 200, 176, 0, 'up', {mouth: 'open'});
  // the lectern: shaped like a bill (a tall document with a header), ROADMAP · $32B/YR, the FORUM stickers
  const turn = st.turn ?? 0;
  const lx = turn ? 330 : 172, lw = turn === 2 ? 18 : turn === 1 ? 30 : 84;
  fill(b, lx, 106, lw, 70, PAL.P2); fill(b, lx, 106, lw, 3, PAL.W9); fill(b, lx + lw - 2, 106, 2, 70, PAL.P0);
  // a bill's header (its title, its price), then the stickers in rows: nine FORUMs, the aide's tenth slapped on crooked
  if (lw > 40) { pt(b, 'ROADMAP', lx + 6, 112, PAL.N1); pt(b, '$32B/YR', lx + 6, 124, PAL.R2); }
  const n = st.tenth ? 10 : 9, sw = tinyWidth('FORUM') + 3;
  for (let k = 0; k < n; k++) {
    if (lw > 40) { const sx = k < 9 ? lx + 4 + (k % 3) * (sw + 2) : lx + lw - sw - 6, sy = k < 9 ? 138 + Math.floor(k / 3) * 10 : 128; fill(b, sx, sy, sw, 8, k === 9 ? PAL.W7 : PAL.C5); tiny(b, 'FORUM', sx + 2, sy + 1, PAL.N1); }
    else fill(b, lx + 2 + (k % 2) * 6, 112 + Math.floor(k / 2) * 9, 5, 6, k === 9 ? PAL.W7 : PAL.C5);
  }
  // the aides at the lectern's sides (when they wheel it to the door)
  if (turn) { drawSenator(b, lx - 12, 180, 1, 'lean', {flip: true}); drawSenator(b, lx + lw + 10, 180, 2, 'lean'); }
  // the tally (sc 19): a card taped ABOVE the jammed lectern, drawn after the aides so nothing stands in front of it;
  // the big face so it reads in its 1.5 s hold, and at the corner TV's scale (lobby2 drawPresserSmall)
  if (st.stuck) {
    const s0 = '0 BILLS', cw = bpw(s0) + 12, cx = Math.min(372 - cw, Math.max(150, lx + Math.round(lw / 2) - Math.round(cw / 2)));
    fill(b, cx, 76, cw, 22, PAL.N0); fill(b, cx, 76, cw, 1, PAL.G3); bpt(b, s0, cx + 6, 81, PAL.R3);
    fill(b, cx + 4, 74, 6, 3, PAL.P1); fill(b, cx + cw - 10, 74, 6, 3, PAL.P1);
  }
  // the presser's own lower third and REMUHCS's plate
  // the broadcast's lower third: his plate above the headline bar
  fill(b, 0, 168, pw('REMUHCS · MAJORITY LEADER') + 18, 13, PAL.P2); pt(b, 'REMUHCS · MAJORITY LEADER', 12, 171, PAL.N1);
  fill(b, 0, 182, 480, 21, PAL.N0); fill(b, 0, 182, 6, 21, PAL.R2); pt(b, 'BIPARTISAN SENATE AI ROADMAP', 12, 189, PAL.P2);
};

// ------------------------------------------------------------------ the 4A nameplates (ECU)
const PLATES_4A = ['MAS MANALT · BOARD', 'OMIS · NEW DIRECTOR', 'NEW DIRECTOR', 'NEW DIRECTOR'];
/** [ECU] 4A.04: the table's edge in morning light, four brass slot holders; his plate clicks in, then the three new
 *  directors' one by one (n = how many are in; the last one in sits a pixel high on its click frame: st.click) */
export const nameplatesECU = (b: Buf, f: number, st: {n?: number; click?: boolean} = {}) => {
  // the boardroom table close: dark wood, the morning window's light along its far edge
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y < 46 ? (bayer(x, y) < 0.3 ? PAL.W5 : PAL.W4) : (x * 3 + y * 7) % 61 < 2 ? PAL.D1 : y < 52 ? PAL.D3 : PAL.D2);
  fill(b, 0, 46, 480, 2, PAL.W6);
  const n = clamp(st.n ?? 4, 0, 4);
  PLATES_4A.forEach((t, i) => {
    const row = i < 2 ? 0 : 1, col = i % 2, w = 200, x = 24 + col * 236, y = 70 + row * 64;
    // the holder: a brass channel with a slot
    fill(b, x - 4, y + 34, w + 8, 8, PAL.W3); fill(b, x - 4, y + 34, w + 8, 2, PAL.W6); fill(b, x - 2, y + 30, w + 4, 4, PAL.N1);
    if (i < n) {
      const up = st.click && i === n - 1 ? 1 : 0;
      fill(b, x, y - up, w, 34, PAL.P2); fill(b, x, y - up, w, 1, PAL.W9); fill(b, x + w - 2, y - up, 2, 34, PAL.P0);
      pt(b, t, x + Math.round((w - pw(t)) / 2), y + 12 - up, PAL.N1);
    }
  });
};

export const ART: ArtAsset[] = [
  {
    id: 'prop-posts-ui', manifest: '§3 the posts in their own UI · the XEL invite · the blog editor · the push · the ISS link card', kind: 'prop', name: 'Ep2\'s posts and phone UI (verbatim, name swaps, his lowercase)',
    file: 'props/ui.ts', exports: 'EP2_POSTS, drawEp2Post, POSTERS_EP2, xelInvite, blogEditor, requestPush, issLinkCard', scenes: '4, 4B, 11, 12, 14, 15, 17, 19, 20, 23',
    note: 'each post in its own UI (Ep1\'s kits); no capital "I" on screen in Mas\'s crops; the Publish is bare (no cursor)',
    stills: [
      {label: 'posts: her · Alyi\'s two crops · Mas\'s May 14 · Ekiel\'s · the apology\'s first trim · NopeAI\'s pause · his Jun 10 · Nole\'s · Alyi\'s Jun 19 + the ISS card', draw: (b) => {
        fill(b, 0, 0, 480, 203, PAL.N1);
        let y = 4; const col = (x: number, ids: Array<keyof typeof EP2_POSTS>) => { y = 4; for (const id of ids) { const r = drawEp2Post(b, x, y, id, {size: 'notify', w: 154}); y += r.h + 4; } };
        col(4, ['her', 'alyiLeave1', 'alyiLeave2', 'masAlyi']); col(162, ['ekiel', 'apology1', 'pause1', 'pause2']); col(320, ['jun10', 'nole', 'alyiIss']);
        issLinkCard(b, 322, 160, 154);
      }},
      {label: 'posts (2): the apology\'s other trims · RUMPT\'s on HTURT (its photo: sets/tag.ts)', draw: (b) => {
        fill(b, 0, 0, 480, 203, PAL.N1);
        let y = 4; for (const id of ['apology2', 'apology3', 'apology4'] as const) { const r = drawEp2Post(b, 4, y, id, {size: 'notify', w: 230}); y += r.h + 4; }
        drawEp2Post(b, 246, 4, 'hturt', {size: 'notify', w: 230});
      }},
      {label: '[ECU] 4B.01 the XEL invite on his phone (a mic icon where the next shot\'s mic stands), Accept', draw: (b) => xelInvite(b, 0, {accept: 0})},
      {label: '[POV] 4.01 the blog editor: NOPEAI AND NOLE, the byline row, the bare Publish (no cursor)', draw: (b) => blogEditor(b, 0)},
      {label: 'the push: request for comment (sc 15, 17), its thumbnail a strip of receipt paper', draw: (b) => { fill(b, 0, 0, 480, 203, PAL.N1); fill(b, 150, 10, 180, 193, PAL.N0); fill(b, 156, 18, 168, 185, PAL.N2); requestPush(b, 160, 30, 160); }},
    ],
  },
  {
    id: 'prop-nameplates-4a', manifest: '§3 the 4A nameplates (new plates; Terb\'s sheet is cast/terb-sheet.ts)', kind: 'prop', name: 'The Mar 8 nameplates clicking into their slots',
    file: 'props/ui.ts', exports: 'nameplatesECU', scenes: '4A',
    note: 'MAS MANALT · BOARD, OMIS · NEW DIRECTOR, NEW DIRECTOR, NEW DIRECTOR; no bracketed placeholder (P17); one click each',
    stills: [{label: '[ECU] 4A.04 his nameplate, then the three new directors\', one by one (the last on its click)', draw: (b) => nameplatesECU(b, 0, {n: 4, click: true})}],
  },
  {
    id: 'prop-presser', manifest: '§3 the roadmap lectern · §2.1 REMUHCS (+ colleagues and aides) on the lobby TV', kind: 'prop', name: 'REMUHCS\'s roadmap presser on the lobby TV (full frame, sc 13; the corner TV, sc 19)',
    file: 'props/ui.ts', exports: 'presserFull', scenes: '13, 19',
    note: 'the bill-shaped lectern ROADMAP · $32B/YR with nine FORUM stickers (an aide\'s tenth), turned sideways at FLOOR, still stuck; 0 BILLS; REMUHCS has no line in Ep2',
    stills: [
      {label: '[SCR] 13.04: the presser at full frame, REMUHCS · MAJORITY LEADER, the lower third, the lectern with nine FORUM stickers', draw: (b) => presserFull(b, 0, {})},
      {label: '[SCR] 13.05 an aide slaps on a tenth sticker; they try it sideways at the FLOOR door', draw: (b) => presserFull(b, 0, {turn: 2, tenth: true})},
      {label: 'sc 19 (the corner TV): still stuck at the door, 0 BILLS', draw: (b) => presserFull(b, 0, {turn: 1, tenth: true, stuck: true})},
    ],
  },
];
void rect; void line; void bayer; void hash; void clamp; void poly; void stepColor; void bpw; void tinyWidth; void TR; void grip;
