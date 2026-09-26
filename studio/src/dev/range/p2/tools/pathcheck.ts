// @ts-nocheck -- Node-only dev tool (bundled with esbuild).
// Prints the frame chain's scales and the camera's world path at a few frames (sanity for the nesting).
import {Vector3} from 'three';
import {shotAt, cameraWorld, S_T, S_S, LAND_POINT, RIDE, LAMBDA_1, AXIS_LEN, PASS, lnLambda} from '../path';
import {SCREEN_N, MON} from '../extrude';
import {nestGeometry, LIP, X_OUT, PW} from '../worlds';
console.log('S_T m/card', S_T, 'S_S card/cell', S_S, 'axis', AXIS_LEN, 'lambda1', LAMBDA_1, 'pass', PASS.toArray());
console.log('screen n', SCREEN_N, MON, 'nest F', nestGeometry().F, 'lip', LIP, 'xout', X_OUT, 'ride', RIDE, 'land', LAND_POINT.toArray());
for (const p of [60, 90, 124, 135, 145, 150, 155, 159, 160, 165, 167, 170, 172, 180, 190, 197, 205, 218, 226, 234, 239, 240, 245, 250, 255, 256, 265, 276, 280, 284, 290, 300, 305, 310, 313, 314]) {
  const s = shotAt(p, false);
  const {m, scale} = cameraWorld(s);
  const pos = new Vector3().setFromMatrixPosition(m);
  console.log(p, s.seg, 'local', s.pos.toArray().map((x) => x.toFixed(3)).join(','), 'fwd', s.fwd.toArray().map((x) => x.toFixed(3)).join(','), 'cy', s.cy.toFixed(1), 'col', s.collapse2.toFixed(2), s.draw.join('+'), p >= 172 && p < 240 ? 'lnL ' + lnLambda(p).toFixed(3) : '');
}
