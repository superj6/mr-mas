import {duotone, mix, nearest, darken, lighten} from './color';

/**
 * A Look is how any character/prop/set renders: line, shading, color mapping, texture.
 * Characters are designed once in "true" colors; the look maps them.
 *
 * ink       Ink & Cut-Paper: bold ink outline, two-tone cel shading, paper grain. (recommended backbone, tier 3)
 * bass      Saul Bass poster: no outlines, flat limited palette, hard shadow shapes, misregistration, paper.
 * news      Prestige Newsprint: duotone ink on warm paper, halftone-dot shading, one spot color.
 * gloss     Glossy HDR (tier 4): gradient fills, specular highlights, bloom, colored rim light.
 * onebit    1-bit Mac era (tier 1): black/white only, dithered tones, chunky outline (render small, upscale).
 * camcorder 240p home video (tier 2): ink look, softened, oversaturated, scanlines/chroma in post.
 */
export type LookId = 'ink' | 'bass' | 'news' | 'gloss' | 'onebit' | 'camcorder';

export type Shading = 'cel' | 'flat' | 'halftone' | 'gloss' | 'dither';

export interface Look {
  id: LookId;
  label: string;
  /** Outline color, or null for no outline. */
  line: string | null;
  /** Multiplier on each shape's designed stroke width. */
  lineScale: number;
  shading: Shading;
  /** Background paper / base tone for the look. */
  paper: string;
  /** Ink color for duotone / dither looks. */
  ink: string;
  /** Map a designed ("true") color into this look's palette. */
  color: (c: string) => string;
  /** Shadow color for a given (already mapped) base fill. */
  shade: (c: string) => string;
  /** Highlight color for a given (already mapped) base fill; null = no highlights. */
  highlight: ((c: string) => string) | null;
  /** 0..1 grain overlay strength. */
  grain: number;
  /** Print misregistration offset in px (poster looks). */
  misregister: number;
}

const INK = '#1B1B1F';

// Saul Bass poster palette: cream paper, black, warm orange, red, mustard, teal, navy, olive, pink.
const BASS_PALETTE = ['#F2E8D5', '#16161A', '#E8632B', '#C8312A', '#E3A72F', '#1F6F78', '#1D2B4F', '#6D7A3A', '#E6B08C', '#5A3E2B', '#8E8B86', '#BFB6A4', '#FFFFFF', '#3C4A63'];

export const LOOKS: Record<LookId, Look> = {
  ink: {
    id: 'ink',
    label: 'Ink & Cut-Paper',
    line: INK,
    lineScale: 1,
    shading: 'cel',
    paper: '#F2E8D5',
    ink: INK,
    color: (c) => c,
    shade: (c) => mix(darken(c, 0.28), '#3A2A5A', 0.18),
    highlight: (c) => lighten(c, 0.22),
    grain: 0.06,
    misregister: 0,
  },
  bass: {
    id: 'bass',
    label: 'Saul Bass Poster',
    line: null,
    lineScale: 0,
    shading: 'flat',
    paper: '#F2E8D5',
    ink: '#16161A',
    color: (c) => nearest(c, BASS_PALETTE),
    shade: (c) => (c === '#16161A' ? '#16161A' : darken(c, 0.38)),
    highlight: null,
    grain: 0.1,
    misregister: 3,
  },
  news: {
    id: 'news',
    label: 'Prestige Newsprint',
    line: '#1A1F2B',
    lineScale: 0.55,
    shading: 'halftone',
    paper: '#EFE6D2',
    ink: '#1A1F2B',
    color: (c) => duotone(c, '#1A1F2B', '#EFE6D2', 1.05),
    shade: (c) => c,
    highlight: null,
    grain: 0.12,
    misregister: 0,
  },
  gloss: {
    id: 'gloss',
    label: 'Glossy HDR',
    line: null,
    lineScale: 0,
    shading: 'gloss',
    paper: '#070B1A',
    ink: '#070B1A',
    color: (c) => mix(c, '#3FE6FF', 0.06),
    shade: (c) => mix(darken(c, 0.45), '#1A1446', 0.35),
    highlight: (c) => lighten(c, 0.55),
    grain: 0.03,
    misregister: 0,
  },
  onebit: {
    id: 'onebit',
    label: '1-bit (1993)',
    line: '#000000',
    lineScale: 1.6,
    shading: 'dither',
    paper: '#FFFFFF',
    ink: '#000000',
    color: (c) => duotone(c, '#000000', '#FFFFFF', 1.3),
    shade: (c) => darken(c, 0.35),
    highlight: null,
    grain: 0,
    misregister: 0,
  },
  camcorder: {
    id: 'camcorder',
    label: '240p Camcorder',
    line: '#241A22',
    lineScale: 1.1,
    shading: 'cel',
    paper: '#10131A',
    ink: '#241A22',
    color: (c) => mix(c, '#FF3CAC', 0.05),
    shade: (c) => mix(darken(c, 0.3), '#2F1B4A', 0.25),
    highlight: (c) => lighten(c, 0.3),
    grain: 0.14,
    misregister: 0,
  },
};

export const MAIN_LOOKS: LookId[] = ['ink', 'bass', 'news'];
export const TIER_LOOKS: LookId[] = ['onebit', 'camcorder', 'ink', 'gloss'];
