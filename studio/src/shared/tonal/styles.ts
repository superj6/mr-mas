import {mix, darken, lighten, luminance} from '../theme/color';
import type {Tone} from './types';
import {tweak} from './render/color2';

export type ToneStyleId = 'noir' | 'engrave' | 'riso' | 'paint' | 'soft' | 'glyph' | 'pixel' | 'dither' | 'stipple';

export interface ToneStyle {
  id: ToneStyleId;
  label: string;
  blurb: string;
  paper: string;
  ink: string;
  /** Scene light / spot color (monitor cyan in the cold open, ember in the cathedral...). */
  spot: string;
  grain: number;
  /** OPTIONAL (soft/paint/pixel): cool ambient the shadows fall toward. */
  shade?: string;
  /** OPTIONAL (soft): bounce / reflected light color wrapped into shadow-side edges. */
  bounce?: string;
  /** OPTIONAL (soft): warm subsurface color at skin terminators. */
  sss?: string;
  /**
   * OPTIONAL (engrave/noir halftone): line / dot pitch in LOCAL units. Keep it >= ~5 screen px
   * (pitch = 5.5 / pxPerUnit) or fine lines will moire. Default 4.6 (good at ~1.2+ px/unit, i.e. hero framing).
   */
  pitch?: number;
}

export const TONE_STYLES: Record<ToneStyleId, ToneStyle> = {
  noir: {id: 'noir', label: 'Noir Prestige', blurb: 'Chiaroscuro graphic novel: pure black shadows, one spot color per scene.', paper: '#ECE5D3', ink: '#0A0A0D', spot: '#3FE6FF', grain: 0.07},
  engrave: {id: 'engrave', label: 'Banknote Engraving', blurb: 'Line-engraved like currency & stock certificates: tone = line weight.', paper: '#EEE7D2', ink: '#16302A', spot: '#16302A', grain: 0.06},
  riso: {id: 'riso', label: 'Riso Editorial', blurb: 'Two-ink risograph print: overprint, halftone, misregistration.', paper: '#F3EEE3', ink: '#1D2B4F', spot: '#FF48B0', grain: 0.1},
  paint: {id: 'paint', label: 'Painterly Flat', blurb: 'Semi-real color planes with colored light, no outlines (prestige 2D).', paper: '#141821', ink: '#101218', spot: '#3FE6FF', grain: 0.05, shade: '#1B1640'},
  soft: {
    id: 'soft',
    label: 'Soft Painted',
    blurb: 'Closer to realism: soft form shadows, warm subsurface, cool bounce, painted texture.',
    paper: '#0E1219',
    ink: '#0B0D12',
    spot: '#5FE3F2',
    grain: 0.035,
    shade: '#241E46',
    bounce: '#5B6FA6',
    sss: '#D9442C',
  },
  glyph: {id: 'glyph', label: 'Latent Glyph', blurb: 'The characters are made of tokens: tone = glyph density.', paper: '#000000', ink: '#000000', spot: '#3FE6FF', grain: 0.02},
  pixel: {id: 'pixel', label: '16-bit Pixel', blurb: 'Rotoscope-era pixel art: posterized planes, curated 32-color palette, sel-out outline.', paper: '#0B0D14', ink: '#07080D', spot: '#2FB8C8', grain: 0, shade: '#221C3E'},
  dither: {id: 'dither', label: '1-bit Dither', blurb: 'Ordered-dither black & white at 512 px, for the 1993 tier.', paper: '#F2F0E6', ink: '#0B0C10', spot: '#000000', grain: 0},
  stipple: {id: 'stipple', label: 'Hedcut Stipple', blurb: 'Newspaper hedcut: dot rows that follow the form, dot size = tone.', paper: '#F1ECE0', ink: '#17181C', spot: '#17181C', grain: 0.04},
};

/**
 * Painterly: shade a mid-tone hue to a tone level, with cool shadows and scene-light highlights.
 * Light planes (the 4th arg) are the local color lightened and mixed with the scene light (never raw spot).
 */
export const paintTone = (hue: string, tone: Tone, spot: string, light = false): string => {
  if (light) return mix(lighten(hue, 0.5), spot, 0.38);
  switch (tone) {
    case 0:
      return mix(darken(hue, 0.62), '#120A2A', 0.35);
    case 1:
      return mix(darken(hue, 0.36), '#1B1640', 0.22);
    case 2:
      return hue;
    case 3:
      return mix(lighten(hue, 0.16), spot, 0.1);
    case 4:
      return mix(lighten(hue, 0.42), spot, 0.22);
  }
};

/**
 * Soft / semi-real grade. Shadows fall toward a cool ambient (not black), lit planes pick up a hint of the
 * key, whites are held down so eyes don't glare. `light` planes are glows (rendered with screen blend).
 */
export const softTone = (hue: string, tone: Tone, s: ToneStyle, light = false): string => {
  const shade = s.shade ?? '#241E46';
  const white = luminance(hue) > 0.72;
  if (light) return tone >= 4 ? mix(lighten(hue, 0.28), s.spot, 0.5) : mix(lighten(hue, 0.18), s.spot, 0.45);
  switch (tone) {
    case 0:
      return mix(darken(tweak(hue, 1.1), 0.7), shade, 0.42);
    case 1:
      return mix(darken(tweak(hue, 1.15), 0.44), shade, 0.3);
    case 2:
      return white ? mix(hue, '#7E8098', 0.22) : mix(tweak(hue, 1.05), shade, 0.05);
    case 3:
      return white ? mix(hue, '#9EA3B4', 0.12) : mix(lighten(hue, 0.1), s.spot, 0.07);
    case 4:
      return mix(lighten(hue, 0.36), s.spot, 0.16);
  }
};

/** Warm subsurface fringe color for a skin-like hue. */
export const sssTone = (hue: string, s: ToneStyle): string => mix(tweak(hue, 1.6, -0.1), s.sss ?? '#D9442C', 0.55);

/**
 * Noir: tones 0-1 are ink; 2 is a readable mid of the spot; 3 is lit (paper tinted by the spot on skin);
 * 4 is paper white. Tone 2 sits near 45% value so faces keep their half-tones instead of splitting.
 */
export const noirTone = (tone: Tone, s: ToneStyle, hue: string): string => {
  const warm = luminance(hue) > 0.35;
  switch (tone) {
    case 0:
      return s.ink;
    case 1:
      return warm ? mix(s.ink, s.spot, 0.07) : s.ink;
    case 2:
      return warm ? mix(s.spot, s.ink, 0.42) : mix(s.spot, s.ink, 0.5);
    case 3:
      return warm ? mix(s.paper, s.spot, 0.3) : mix(s.spot, s.paper, 0.18);
    case 4:
      return s.paper;
  }
};

/** Brightness 0..1 per tone for sampling renderers (glyph, dither, stipple). */
export const TONE_VALUE: Record<Tone, number> = {0: 0.04, 1: 0.24, 2: 0.48, 3: 0.72, 4: 0.95};
