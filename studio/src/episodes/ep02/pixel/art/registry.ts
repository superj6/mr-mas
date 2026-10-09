// MR. MAS — Ep2 v1 art: every new asset's record (ART lists), in manifest order. tools/stills.ts renders them all.
import type {ArtAsset} from './asset';
import {ART as selbeep} from './cast/selbeep';
import {ART as xel} from './cast/xel';
import {ART as humanist} from './cast/humanist';
import {ART as engineer} from './cast/engineer';
import {ART as bukaj} from './cast/bukaj';
import {ART as ekiel} from './cast/ekiel';
import {ART as forecaster} from './cast/forecaster';
import {ART as haras} from './cast/haras';
import {ART as kooc} from './cast/kooc';
import {ART as alyi2} from './cast/alyi2';
import {ART as mas2} from './cast/mas2';
import {ART as dot} from './cast/dot';
import {ART as lobby} from './sets/lobby2-art';
import {ART as seance} from './sets/seance';
import {ART as office18} from './sets/office2018';
import {ART as studio} from './sets/studio';
import {ART as cutaway} from './sets/cutaway';
import {ART as dark2} from './sets/darkroom2';
import {ART as stage} from './sets/stage';
import {ART as plan} from './sets/plan';
import {ART as floor} from './sets/floor';
import {ART as aoffice} from './sets/alyioffice';
import {ART as f22} from './sets/f22';
import {ART as bridge} from './sets/bridge';
import {ART as committee} from './sets/committee';
import {ART as elppa} from './sets/elppa';
import {ART as garden} from './sets/garden';
import {ART as zai} from './sets/zai';
import {ART as iss} from './sets/iss';
import {ART as tag} from './sets/tag';
import {ART as ui} from './props/ui';

export const ALL_ART: ArtAsset[] = [
  ...lobby, ...seance, ...office18, ...studio, ...cutaway, ...dark2, ...stage, ...plan, ...floor, ...aoffice, ...f22, ...bridge, ...committee, ...elppa,
  ...garden, ...zai, ...iss, ...tag, ...ui,
  ...selbeep, ...xel, ...humanist, ...engineer, ...bukaj, ...ekiel, ...forecaster, ...haras, ...kooc, ...alyi2, ...mas2, ...dot,
];
