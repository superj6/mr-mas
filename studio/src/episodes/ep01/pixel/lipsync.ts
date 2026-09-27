// MR. MAS — Ep1 pixel pipeline (P0): LIP-SYNC for any segment. The Act Four v5 lip-sync (act4/animatic/lipsync5.ts,
// production/act4/lipsync-v5.md) is the show's convention, so this is that module on the pipeline's shots, not a copy:
// the mouth leads its sound by one frame, no drawing is held under two frames, a room-scale mouth flaps on the take's
// syllables. lipsync5 reads only `sh.lines` and each line's who / kind / face / s / e / mouth, which a PxShot's lines
// carry with the same meaning, so these are thin typed wrappers (its per-line caches are keyed by the line objects,
// which the host keeps stable).
//
// WHO shows a mouth: the line's `face` in this shot (the lock's plan, or the layout's `face` table): 'lip' = a drawn
// track, 'room' = room scale, null = none (backs, silhouettes, off screen, POV). A line whose face is null draws 'rest'.
// WHAT it draws: the take's visemes (lock.py moves them onto the segment clock). A line with no take gets a track
// built from its words (lock.py `mouth_src: words`); a line with neither flaps on 4s.
import type {Viseme} from '../../../shared/pixel/cast/talk';
import type {ShotV5, LineV5} from '../act4/animatic/data-v5';
import {LIP5, lineAt5, talking5, lipOn5, mouth5, roomMouth5, room3Mouth5, silentMouth5, lipTrack5, roomTrack5, lipPairs5} from '../act4/animatic/lipsync5';
import type {LipPair5} from '../act4/animatic/lipsync5';
import type {PxLine, PxShot} from './types';

const V = (sh: PxShot) => sh as unknown as ShotV5;
/** the show's lip-sync constants (lead, minimum hold, the room flap): shared with Act Four v5 */
export const LIP = LIP5;
/** `who`'s line sounding at shot frame k (any face) */
export const lineAt = (sh: PxShot, k: number, who: string): PxLine | null => lineAt5(V(sh), k, who) as unknown as PxLine | null;
/** someone is speaking now (a speaking ring, a spinner): face does not matter, no lead */
export const talking = (sh: PxShot, k: number, who: string) => talking5(V(sh), k, who);
/** a faced line of `who` is being drawn at k (lead included) */
export const lipOn = (sh: PxShot, k: number, who: string) => lipOn5(V(sh), k, who);
/** the viseme for `who` at k where this framing shows their mouth, else 'rest' */
export const mouth = (sh: PxShot, k: number, who: string): Viseme => mouth5(V(sh), k, who);
/** room scale: open / rest on the take's syllables */
export const roomMouth = (sh: PxShot, k: number, who: string): 'open' | 'rest' => roomMouth5(V(sh), k, who);
/** a room-scale figure with three mouths (0 shut, 1 small, 2 wide) */
export const room3Mouth = (sh: PxShot, k: number, who: string): 0 | 1 | 2 => room3Mouth5(V(sh), k, who);
/** a silent talking mouth ("no words reach us"): held drawings on 4s */
export const silentMouth = silentMouth5;
/** the drawn tracks, one entry per frame of the line (frame 0 = its first sound) */
export const lipTrack = (l: PxLine): Viseme[] => lipTrack5(l as unknown as LineV5);
export const roomTrack = (l: PxLine): boolean[] => roomTrack5(l as unknown as LineV5);
/** every faced speaker-in-shot pair's drawn-track numbers (for a report) */
export const lipPairs = (shots: PxShot[]): LipPair5[] => lipPairs5(shots as unknown as ShotV5[]);
