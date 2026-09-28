// MR. MAS — Ep1 full-v3, v3-art-a, v3.1 round: Gerg's laptop screen over his shoulder (v31-10.04 → 11.01, the match
// cut and the Atem leak), and the demo stage's v3.1 caption rule (11.04: no NAPKIN → WEBSITE).
import {D} from '../registry';
import {drawGergLaptopPOV, drawAtemThread} from '../../../../../shared/pixel/kits/gerg-laptop';

const M = 'shared/pixel/kits/gerg-laptop.ts';
D({id: 'INSERT-GERG-LAPTOP', state: 'lobby-chat', module: M + ' drawGergLaptopPOV', note: 'v31-10.04 over his shoulder in the lobby: the same two-dot face in a chat window (ChatGTP, NopeAI\'s own colours), his hands on the keys',
  draw: (fb) => drawGergLaptopPOV(fb, 0, {place: 'lobby', lid: 0, screen: 'chat'})});
D({id: 'INSERT-GERG-LAPTOP', state: 'lobby-half', module: M + ' drawGergLaptopPOV', note: 'v31-10.04 he closes it: the lid half down (held), its glow on the keys',
  draw: (fb) => drawGergLaptopPOV(fb, 0, {place: 'lobby', lid: 1, hands: false})});
D({id: 'INSERT-GERG-LAPTOP', state: 'lobby-shut', module: M + ' drawGergLaptopPOV (GERG_LAPTOP.shut)', note: 'v31-10.04 HOLD on the closed lid (lobby): the slab at GERG_LAPTOP.shut',
  draw: (fb) => drawGergLaptopPOV(fb, 0, {place: 'lobby', lid: 2})});
D({id: 'INSERT-GERG-LAPTOP', state: 'bullpen-shut', module: M + ' drawGergLaptopPOV (GERG_LAPTOP.shut)', note: '11.01 MATCH: the same slab in the same place, on the demo desk (March)',
  draw: (fb) => drawGergLaptopPOV(fb, 0, {place: 'bullpen', lid: 2})});
D({id: 'INSERT-GERG-LAPTOP', state: 'bullpen-thread', module: M + ' drawGergLaptopPOV + drawAtemThread', note: '11.01 it opens on a message-board thread: the tipped crate ATEM · MODEL WEIGHTS · RESEARCHERS ONLY, files spilling, 03/03/23',
  draw: (fb) => drawGergLaptopPOV(fb, 0, {place: 'bullpen', lid: 0, screen: 'thread', thread: {replies: 2}})});
D({id: 'KIT-ATEM-THREAD', state: 'full', module: M + ' drawAtemThread', note: '11.01 the thread at full frame (for a push to the screen, or an insert): the post, the crate, replies arriving',
  draw: (fb) => { for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) fb.set(x, y, 0x04050a); drawAtemThread(fb, 110, 8, 260, 190, {replies: 3}); }});

// ------------------------------------------------------------------ the duel's v3.1 frames (11.03 clean, 11.04 no caption)
import {drawDuelSplit, drawDemoArrival} from '../../../../../shared/pixel/rooms/duel-split';
const MD = 'shared/pixel/rooms/duel-split.ts';
D({id: 'SPLIT-DUEL', state: 'v31-arrival-gerg-line', module: MD + ' drawDemoArrival', note: '11.01 (draft 7) the lid open at LOBBY_LID, Gerg on camera for his line ("Somebody leaked Atem\'s model."), Mas at his end desk behind',
  draw: (fb) => drawDemoArrival(fb, 4, {lid: 0, gerg: {head: 'talk', mouth: 'A'}})});
D({id: 'SPLIT-DUEL', state: 'v31-p1-clean', module: MD + ' drawDuelSplit', note: '11.03 (shot note) the right pane held clean for Mas\'s V.O.: CLOD unlit, waiting; Mario writing, no scroll yet; the left pane quiet',
  draw: (fb) => drawDuelSplit(fb, 0, {left: {gerg: 'type', screen: 'blank'}, right: {light: 0, mario: 'write', scroll: 0}})});
D({id: 'SPLIT-DUEL', state: 'v31-p2-no-caption', module: MD + ' drawDuelSplit {left.caption: false}', note: '11.04 (draft 7) the napkin becomes a website with no caption; HOLD on Mario writing the addendum',
  draw: (fb) => drawDuelSplit(fb, 10, {left: {gerg: 'glance', screen: 'site2', cheer: 2, caption: false}, right: {light: 1, mario: 'write', scroll: 50}})});
