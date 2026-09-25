import type {FrameDef} from '../shared/frame-def';
import {HERO} from '../shared/title/common';
import {TitleSoft} from '../shared/title/TitleSoft';
import {TitlePixel} from '../shared/title/TitlePixel';
import {TitleDither} from '../shared/title/TitleDither';
import {TitleRiso} from '../shared/title/TitleRiso';
import {TitleEngrave} from '../shared/title/TitleEngrave';
import {TitleGlyph} from '../shared/title/TitleGlyph';
import {TitleAnime} from '../shared/title/TitleAnime';
import {TitleNoir} from '../shared/title/TitleNoir';
import {TitleCartoon} from '../shared/title/TitleCartoon';

/** MR. MAS title card, one still per candidate style (+ 3 s motion tests: "<id>-motion"). */
const STYLES: [string, FrameDef['component']][] = [
  ['pixel', TitlePixel],
  ['soft', TitleSoft],
  ['dither', TitleDither],
  ['riso', TitleRiso],
  ['engrave', TitleEngrave],
  ['glyph', TitleGlyph],
  ['anime', TitleAnime],
  ['noir', TitleNoir],
  ['cartoon', TitleCartoon],
];

export const frames: FrameDef[] = STYLES.flatMap(([k, C]) => [
  {id: `title-${k}`, component: C, props: {frame: HERO}},
  {id: `title-${k}-motion`, component: C, durationInFrames: 72, fps: 24},
]);
