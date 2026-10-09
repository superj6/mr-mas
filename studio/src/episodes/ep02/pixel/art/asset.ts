// MR. MAS — Ep2 v1 art: the asset record every art module exports (`ART: ArtAsset[]`), so one tool can render each
// asset's stills and the contact sheet (tools/stills.ts) and art.md can list each with its file and scenes.
import {Buf} from '../../../../shared/pixel/px';

export type ArtKind = 'set' | 'character' | 'creature' | 'prop';
export interface ArtStill {
  /** a short label (printed in the still's band and on the sheet) */
  label: string;
  /** draw one full 480 x 270 frame (the room area 0..202; the band below is free for the label) */
  draw: (b: Buf) => void;
}
export interface ArtAsset {
  /** a stable id (the still's file name) */
  id: string;
  /** the manifest's id(s): SET-01, §2.2 SELBEEP, §3 … */
  manifest: string;
  kind: ArtKind;
  name: string;
  /** the module, from studio/src/episodes/ep02/pixel/art/ */
  file: string;
  /** the public drawing functions a shot pass calls */
  exports: string;
  /** the scenes it plays in */
  scenes: string;
  /** what the still shows / how to use it (one line) */
  note?: string;
  stills: ArtStill[];
}
