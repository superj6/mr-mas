import React from 'react';
import type {ArtProps} from '../Page';
import type {PanelId} from '../script';
import {Ink} from '../print';
import {rc} from '../geo';
import {P1Lab} from './P1Lab';

const Placeholder: React.FC<ArtProps> = ({w, h}) => (
  <g>
    <Ink d={rc(0, 0, w, h)} s={{k: 0.85, c: 0.3}} />
    <Ink d={rc(w * 0.3, h * 0.3, w * 0.4, h * 0.4)} s={{c: 0.6, r: 0.4}} />
  </g>
);

export const ART: Record<PanelId, React.FC<ArtProps>> = {
  p1: P1Lab,
  p2: Placeholder,
  p3: Placeholder,
  p4a: Placeholder,
  p4b: Placeholder,
  p4c: Placeholder,
  p5: Placeholder,
};
