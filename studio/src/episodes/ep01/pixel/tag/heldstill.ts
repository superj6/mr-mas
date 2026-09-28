// MR. MAS — Ep1 v3.1 tag: the Runway insert's held still (the frozen duck) at the dark room two-shot's virtual monitor size,
// 96 x 60, as the v31-runway pass snapped it to the master palette (out/ep01/full-v3/runway/painter/held-still-2s-96x60.png,
// runway.md §1). Transcribed to data here (generated, the v3-shots-coldopen-tag pass) so the layout stays pure and needs no file
// read at render time. The insert's own two-shot (i217-232) and the tag's later two-shots show it on his monitor.
import type {Buf} from '../../../../shared/pixel/px';
export const HELD_W = 96, HELD_H = 60;
const COLS = [0x120a0c, 0x161923, 0x242a38, 0x331c1a, 0x34202a, 0x363e50, 0x4b2a22, 0x4d5669, 0x687286, 0x7c4c4a, 0x8993a6, 0x8f8a7a, 0xa2401f, 0xa86e60, 0xb0243a, 0xb0b9c9, 0xc14e4a, 0xcf6627, 0xcf9579, 0xcfc6a8, 0xe0301e, 0xec9338, 0xfbc15e];
const ROWS = [
  'afafafafafffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffafafafaf',
  'fafffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffafa',
  'afafafafffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffafafaf',
  'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa',
  'afafafffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffafffafaf',
  'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffafa',
  'afafffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffaf',
  'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa',
  'afafaffffffffffffffffffffffffffffffffffffjjmmmmjjfffffffffffffffffffffffffffffffffffffffffffafaf',
  'fffffffffffffffffffffffffffffffffffffffjmmmmmmmmmmjfffffffffffffffffffffffffffffffffffffffffffff',
  'ffafffffffffffffffffffffffffffffffffffmmmmmjjjjmmmmjffffffffffffffffffffffffffffffffffffffffffaf',
  'fffffffffffffffffffffffffffffffffffffmmmmmmjjjmmmmmmmfffffffffffffffffffffffffffffffffffffffffff',
  'afffffffffffffffffffffffffffffffffffjmmmmmmmmmmmmmmmmjffffffffffffffffffffffffffffffffffffffafaf',
  'ffffffffffffffffffffffffffffffffffffmmmmmmmmmmjjmmmmmmjfffffffffffffffffffffffffffffffffffffffff',
  'ffffffffffffffffffffffffffffffffffffmmmmmmmmm875bmmmmmmfffffffffffffffffffffffffffffffffffffffaf',
  'fffffffffffffffffffffffffffffffffffbmmmmmmmmm5217mmmmmmjffffffffffffffffffffffffffffffffffffffff',
  'afffafffffffffffffffffffffffffffffilllllmmmmmb009mmmmmmmffffffffffffffffffffffffffffffffffffafaf',
  'fffffffffffffffffffffffffffffffffhhhhhlmmjmmmmlbmmmmmmmmffffffffffffffffffffffffffffffffffffffff',
  'ffffffffffffffffffffffffffffffffdhhhghhhlmlmmmmmmmmmmmmmjfffffffffffffffffffffffffffffffffffffaf',
  'ffffffffffffffffffffffffffffffffhhhhhhhghlllmmmmmmmmmmmmjfffffffffffffffffffffffffffffffffffffff',
  'afffffffffffffffffffffffffffffffhhhhggggghhllmmmmmmmmmmmifffffffffffffffffffffffffffffffffffffff',
  'ffffffffffffffffffffffffffffffffihgekekkkghhhhhlmmmmmmmljfffffffffffffffffffffffffffffffffffffff',
  'fffffffffffffffffffffffffffffffffgekghgeekcgghgllmlmlmllffffffffffffffffffffffffffffffffffffffaf',
  'ffffffffffffffffffffffffffffffffighghhhgkeeeghllmlmlmlmmfffjmmmmjfffffffffffffffffffffffffffffff',
  'afffffffffffffffffffffffffffffffihhhhhhhggghghlllllmlmljffjmmmmmmfffffffffffffffffffffffffffafff',
  'ffffffffffffffffffffffffffffffffffihhghghghghlllmlmlmljffjmmmmmmmjffffffffffffffffffffffffffffff',
  'fffffffffffffffffffffffffffffffffffjhhghghhhlllllllllmffjmmmmmmmmmjfffffffffffffffffffffffffffaf',
  'ffffffffffffffffffffffffffffffffffffjllhhhllllllllllljjmmmmmmmmmmmmfffffffffffffffffffffffffffff',
  'afffffffffffffffffffffffffffffffffffilllhlhlhlllhlhlhllmmmmmmmmmmmmjffffffffffffffffffffffffafff',
  'fffffffffffffffffffffffffffffffffffihhlhhhlhlhlhlhlhllmmmmmmmmmmmmmmjfffffffffffffffffffffffffff',
  'ffffffffffffffffffffffffffffffffffihhhhhhlhllllllllllmmmmmmmmmmmmmmmmmffffffffffffffffffffffffaf',
  'ffffffffffffffffffffffffffffffffjllhhhhhllllmmmmmmmmmmmmmmmmmmmmmmmmmmffffffffffffffffffffffffff',
  'affffffffffffffffffffffffffffffmllllhllllmmmmmmmmmmmmmmmmmmmmmmmmmmmmmffffffffffffffffffffffafff',
  'ffffffffffffffffffffffffffffffmmmlmlllmmmmmmmmmmmmmmmmmmmmmmmmmmmmmjmmjfffffffffffffffffffffffff',
  'ffaffffffffffffffffffffffffffjmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmjjmmmmfffffffffffffffffffffffaf',
  'ffffffffffffffffffffffffffffjmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmfffffffffffffffffffffffff',
  'afffffffffffffffffffffffffffjmmmmmmmmmmmmmmmmmmmmmmmmmmmjmmmmmmmmmmmmmjfffffffffffffffffffffafaf',
  'ffffffffffffffffffffffffffffmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmljfffffffffffffffffffffffff',
  'afafffffffffffffffffffffffffmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmjfffffffffffffffffffffffaf',
  'ffffffffffffffffffffffffffffmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmjfjfffffffffffffffffffffff',
  'afafaffffffffffffffffjfjfjfjmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmfjfjfjfjfjfjffffffffffafaf',
  'ffffffffffjfjfjjjfjjjfjjjfjjmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmjjjjfjjjfjjjfjjjfjfjfjfffff',
  'fffffjfjfjfjfjfjfjfjfjfjfjfjjmmmmmmmmmmmmmmmmmmmmmmmmmlmmmmmmmmmmmmmmjfjfjfjfjfjfjfjfjfjfjfjfjfj',
  'jjjfjjjfjjjfjjjjjjjjjjjjjjjjjmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmjjjjjjjjjjjjjjjfjjjfjjjfjjjf',
  'fjfjfjfjfjfjfjfjfjfjfjfjfjfjfjmmmmmmmmmmmmmmmmmmmmmmmmmmlmmmlmlmllljfjfjfjfjfjfjfjfjfjfjfjfjfjfj',
  'jfjjjfjjjfjjjfjjjfjjjfjjjfjjjfmmmmmmmmmmmmmmmmmmmmmmmmmmmmmlmllllliijjjjjfjjjfjjjfjjjjjjjfjjjfjf',
  'fjfjfjfjfjfjfjfjfjfjfjfjfjfjfjjmlmlmmmmmmmmmmmmmmmmmmmmmlmlllllllibiijfjfjfjfjfjfjfjfjfjfjfjfjfj',
  'jjjjjjjjjjjjjjjjjjjjjjjjjjjfjjjillllmlmlmlmlmmmlmmmlmllllllllhhhhliijjjjjjjjjjjjjjjjjjjjjjjjjjjf',
  'fjfjfjfjfjfjfjfjfjfjfjfjfjfjfjiillhlhlllllllllllllllllhhhhhhhhhhhlljjjfjfjfjfjfjfjfjfjfjfjfjfjfj',
  'jfjjjfjjjfjjjfjjjfjjjjjjjfjjjjjjlllllhhhhhhhhhhhhhhhhhhhlhllliiijjjjjjjjjjjjjjjjjfjjjfjjjfjjjfjj',
  'fjfjfjfjfjfjfjfjjjfjjjfjjjfjjjfjjjjjjjiiiiiiiiiiijijjjjjjjjjjjjjjjfjjjfjjjfjjjfjjjfjfjfjfjfjfjfj',
  'jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjf',
  'fjfjfjfjfjfjfjfjfjfjfjfjfjfjfjjjfjjjfjjjfjjjfjjjfjjjfjjjfjjjfjjjfjjjfjfjfjfjfjfjfjfjfjfjfjfjfjfj',
  'jfjjjfjjjfjjjfjjjfjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjfjjjfjjjfjjjfjjjfjj',
  'fjfjfjfjfjfjfjfjfjfjfjfjfjfjjjfjjjfjjjfjjjfjjjfjjjfjjjfjjjfjjjfjjjfjjjfjfjfjfjfjfjfjfjfjfjfjfjfj',
  'jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjf',
  'fffjfjfjfjfjfjfjfjfjfjfjfjfjfjjjfjjjfjjjfjjjfjjjfjjjfjjjfjjjfjjjfjjjfjfjfjfjfjfjfjfjfjfjfjfjffff',
  'aaffffjfjfjjjfjjjfjjjfjjjfjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjfjjjfjjjfjjjfjffffffaa8',
  '55578aaffffffffjfjfjfjfjfjfjjjfjjjfjjjfjjjfjjjfjjjfjjjfjjjfjjjfjjjfjjjfjfjfjfjffffffaaaabb775235',
  'fffb85557788aaffffffffffjfjfjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjfjfjfjffffffafaabbb8775542678baff',
];
/** a monitor painter (kits/mas-monitor Painter): the held still, nearest-sampled to the painter's screen */
export const heldStillPainter = (scr: Buf) => {
  const A = '0123456789abcdefghijklmnopqrstuvwxyz';
  for (let y = 0; y < scr.h; y++) for (let x = 0; x < scr.w; x++) {
    const sx = Math.min(HELD_W - 1, Math.floor((x * HELD_W) / scr.w)), sy = Math.min(HELD_H - 1, Math.floor((y * HELD_H) / scr.h));
    scr.set(x, y, COLS[A.indexOf(ROWS[sy][sx])]);
  }
};
