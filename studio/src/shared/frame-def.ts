import type React from 'react';

export interface FrameDef {
  /** Composition id: letters, numbers and dashes only. */
  id: string;
  component: React.ComponentType<any>;
  props?: Record<string, unknown>;
  width?: number;
  height?: number;
  fps?: number;
  /** Omit (or 1) for a still. */
  durationInFrames?: number;
}
