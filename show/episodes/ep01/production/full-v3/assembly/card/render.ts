// The filename card's Node renderer entry (a throwaway-style segment outside pixel/, pixel/README.md). From studio/:
//   node src/episodes/ep01/pixel/tools/build.mjs --entry ../show/episodes/ep01/production/full-v3/assembly/card/render.ts $S/r-card.cjs
//   node $S/r-card.cjs check · node $S/r-card.cjs native $S/st 0 8 16 30 47
//   X264_THREADS=1 SEGDIR=$S bash ../ops/heavy.sh node $S/r-card.cjs picture ../out/ep01/full-v3/picture/card.mp4 --jobs 1
import {SEGMENT} from './shots';
import {main} from '../../../../../../../studio/src/episodes/ep01/pixel/tools/render';

main(SEGMENT);
