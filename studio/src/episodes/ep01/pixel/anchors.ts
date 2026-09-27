// MR. MAS — Ep1 pixel pipeline (P0): story marks as ANCHORS, resolved on a shot at load time. The same grammar as
// tools/lock.py (and Act Four's lock_v5.py), so a shot pass can declare its marks beside its layout (Layout.marks)
// instead of in a plan file. Offsets are FRAMES; results are SHOT frames (k).
//   ['f', n]                          n frames into the shot         ['len', off]              the shot's end + off
//   ['snd', name, n, off]             the n-th stick sound spot of that name in the shot (1-based)
//   ['txt', substr, 'at'|'until', off]  an onscreen item's start or end (the stick's text, rails and posts included)
//   ['on'|'end', lineId, off]         a line's first / last sound (any line the shot hears: own, carried, pre-lapped)
//   ['w'|'we', lineId, word, off]     a word's start / end ('word#2' = its 2nd occurrence)
//   ['speak', who, 'at'|'end', off]   a silent speaking highlight    ['beat', beatId, off]      a merged beat's first frame
//   ['mark', name, off]               another mark of this shot (declared earlier, or the lock's)
import type {PxShot} from './types';

export type Anchor =
  | ['f', number]
  | ['len', number]
  | ['snd', string, number, number]
  | ['txt', string, 'at' | 'until', number]
  | ['on' | 'end', string, number]
  | ['w' | 'we', string, string, number]
  | ['speak', string, 'at' | 'end', number]
  | ['beat', string, number]
  | ['mark', string, number];

const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9']/g, '');

/** an anchor -> a shot frame. Throws (with the reason) when the anchor names something the shot does not have */
export const resolveAnchor = (sh: PxShot, a: Anchor, marks: Record<string, number>): number => {
  const len = sh.e - sh.s;
  switch (a[0]) {
    case 'f': return a[1];
    case 'len': return len + a[1];
    case 'mark': {
      if (!(a[1] in marks)) throw new Error(`${sh.id}: no mark ${a[1]}`);
      return marks[a[1]] + a[2];
    }
    case 'beat': {
      if (!(a[1] in sh.beatStarts)) throw new Error(`${sh.id}: no beat ${a[1]} in this shot`);
      return sh.beatStarts[a[1]] + a[2];
    }
    case 'snd': {
      const hits = sh.spots.filter((x) => x.name === a[1]);
      if (hits.length < a[2]) throw new Error(`${sh.id}: no sound ${a[1]} #${a[2]}`);
      return hits[a[2] - 1].k + a[3];
    }
    case 'txt': {
      const o = sh.onscreen.find((x) => x.text.includes(a[1]));
      if (!o) throw new Error(`${sh.id}: no text ${JSON.stringify(a[1])}`);
      return (a[2] === 'at' ? o.s : o.e) + a[3];
    }
    case 'speak': {
      const x = sh.speak.find((y) => y.who === a[1].toUpperCase());
      if (!x) throw new Error(`${sh.id}: no speak ${a[1]}`);
      return (a[2] === 'at' ? x.s : x.e) + a[3];
    }
    case 'on':
    case 'end': {
      const l = sh.lines.find((x) => x.id === a[1]);
      if (!l) throw new Error(`${sh.id}: line ${a[1]} is not heard in this shot`);
      return (a[0] === 'on' ? l.s : l.e) + a[2];
    }
    case 'w':
    case 'we': {
      const l = sh.lines.find((x) => x.id === a[1]);
      if (!l) throw new Error(`${sh.id}: line ${a[1]} is not heard in this shot`);
      const m = /^(.*?)(?:#(\d+))?$/.exec(a[2])!;
      const want = norm(m[1]), nth = Number(m[2] ?? 1);
      let hits = l.words.filter((w) => norm(w[0]) === want);
      if (hits.length < nth) hits = l.words.filter((w) => norm(w[0]).startsWith(want));
      if (hits.length < nth) throw new Error(`${sh.id}: no word ${a[2]} in ${a[1]} (${l.words.map((w) => w[0]).join(' ')})`);
      return l.s + hits[nth - 1][a[0] === 'w' ? 1 : 2] + a[3];
    }
  }
  throw new Error(`${sh.id}: bad anchor ${JSON.stringify(a)}`);
};

/** resolve a layout's marks on its shot, in order (a 'mark' anchor may name an earlier one or one of the lock's) */
export const resolveMarks = (sh: PxShot, anchors: Record<string, Anchor>, problems: string[]): Record<string, number> => {
  const out: Record<string, number> = {...sh.marks};
  for (const [name, a] of Object.entries(anchors)) {
    try { out[name.replace(/_+$/, '')] = resolveAnchor(sh, a, out); } catch (e) { problems.push(`mark ${name}: ${(e as Error).message}`); }
  }
  return out;
};
