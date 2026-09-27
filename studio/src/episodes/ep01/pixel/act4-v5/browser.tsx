// MR. MAS — Ep1 pixel pipeline (P0): Act Four v5's browser-only frames: J1 "CANCELLED" (art-v5/j1/J1Cancelled.tsx) at
// the Cancel click, when the segment option j1 is on (shots.ts `browser`). As Cancel5.tsx's pass B: J1 gets the host's
// own show frame under it and the click frame; S1.09's GLYPH layers are not drawn on these frames. Loaded only by the
// Remotion side (frames.ts); the Node renderer never imports React.
import React, {useMemo} from 'react';
import {J1Cancelled} from '../../act4/art-v5/j1/J1Cancelled';
import {CANCEL_CLICK, J1_PIXEL_OPTS} from '../../act4/animatic/shots5';
import {native} from '../frame';
import type {BrowserModule} from '../Host';

const J1: BrowserModule['Component'] = ({f, seg}) => {
  const frame = useMemo(() => native(seg, f).fb, [seg, f]);
  const click = useMemo(() => native(seg, CANCEL_CLICK).fb, [seg]);
  return <J1Cancelled t={f - CANCEL_CLICK} frame={frame} click={click} pixel={J1_PIXEL_OPTS} />;
};
export const BROWSER: BrowserModule = {Component: J1};
