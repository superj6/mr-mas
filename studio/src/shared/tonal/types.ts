/**
 * TONAL RIGS
 * A character/prop is designed as a stack of flat light/shadow planes (like a posterized portrait),
 * not outlines. Each plane has a TONE (0 = deepest shadow/ink ... 4 = brightest highlight) and a HUE
 * (its local color: skin, hair, hoodie...). Renderers turn the same stack into different illustration
 * styles: noir chiaroscuro, banknote engraving, risograph, painterly flat color, glyph/"latent", 1-bit dither.
 *
 * Paths are listed back-to-front. Coordinates are local units (see each rig's header).
 */
export type Tone = 0 | 1 | 2 | 3 | 4;

export interface TP {
  /** SVG path data. */
  d: string;
  tone: Tone;
  /** Local color key (looked up in the rig's hue table) or a hex color. */
  hue: string;
  /** If set, this is an open stroke of this width instead of a filled plane. */
  line?: number;
  /** Hatch angle hint in degrees for engraving-type renderers (follow the form). */
  angle?: number;
  /** Optional SVG transform applied to this path. */
  transform?: string;
  /** Mark planes that are pure light (monitor glow, rim light) so renderers can use the scene light color. */
  light?: boolean;
  /**
   * OPTIONAL (soft/painterly renderer). Edge softness override in local units: 0 = crisp, larger = softer.
   * Default is derived from the plane's size and tone (big form shadows soft, small/cast shadows crisp).
   */
  soft?: number;
  /**
   * OPTIONAL. Force this plane to be a silhouette (true) or interior shading clipped to earlier planes of
   * the same hue (false). Default: auto (same hue + different tone + contained => interior).
   */
  base?: boolean;
}

export interface ToneModel {
  paths: TP[];
  /** Hue table: key -> hex color (true local color at tone 2, i.e. mid-tone). */
  hues: Record<string, string>;
  /** Bounding box in local units [x, y, w, h]. */
  box: [number, number, number, number];
}
