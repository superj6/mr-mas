/**
 * Shared props drawn for the comic (builder: comic): the glass of water, the monitor, the phone.
 * All plate-aware (render inside a PlateGroup).
 */
import React from 'react';
import {Ink, InkLine, Spec, usePlate} from '../print';
import {ell, pl, sp} from '../geo';
import {RadFill, Soft} from '../paint';
import {misreg} from '../script';

/**
 * Mas's glass of water. Origin = centre of the base on the table. `h` = height.
 * Lit from `side` (-1 = light from screen-left). Never ripples.
 * `hold` = [dx, dy] page-unit counter-offset so it can stay still while the page jolts;
 * `f` = frame (so it can also cancel the plate misregistration during the jolt).
 */
export const Glass: React.FC<{x: number; y: number; h: number; side?: -1 | 1; spot?: 'c' | 'r'; hold?: [number, number]; f?: number; line?: number; id: string; fill?: number}> = ({x, y, h, side = -1, spot: X = 'c', hold = [0, 0], f, line, id, fill = 0.62}) => {
  const plate = usePlate();
  const w = h * 0.5;
  const top = -h;
  const rw = w / 2;
  const bw = rw * 0.84;
  const ery = h * 0.07;
  const wl = top + h * (1 - fill);
  const wr = bw + (rw - bw) * (1 - (wl - top) / h) + 0;
  const L = line ?? Math.max(2.2, h * 0.022);
  // counter the jolt: page shake + plate misregistration
  let cx = hold[0];
  let cy = hold[1];
  if (f !== undefined) {
    const [mx, my] = misreg(plate, f);
    const [bx, by] = misreg(plate, -100);
    cx -= mx - bx;
    cy -= my - by;
  }
  const body = sp([[-rw, top, 1], [rw, top, 1], [bw, -ery * 0.3], [0, ery * 0.55], [-bw, -ery * 0.3]]);
  const water = sp([[-wr, wl, 1], [wr, wl, 1], [bw, -ery * 0.3], [0, ery * 0.55], [-bw, -ery * 0.3]]);
  const lit: Spec = {};
  return (
    <g transform={`translate(${(x + cx).toFixed(2)} ${(y + cy).toFixed(2)})`}>
      {/* contact shadow away from the light */}
      <Ink d={ell(-side * w * 0.45, ery * 0.2, w * 0.75, ery * 1.1)} s={{k: 1}} />
      {/* glass body: see-through glow */}
      <Ink d={body} s={{k: 0.08, [X]: 0.32}} />
      {/* water column: the brightest thing on the desk after the monitor */}
      <Ink d={water} s={{[X]: 0.9}} />
      {/* refracted light band + dark edge on the shadow side */}
      <Soft id={`${id}-ref`} r={h * 0.02}>
        <Ink d={pl([[side * wr * 0.15, wl + 4], [side * wr * 0.55, wl + 4], [side * bw * 0.5, -ery], [side * bw * 0.1, -ery]])} s={{[X]: 0.45}} />
      </Soft>
      <Ink d={pl([[-side * wr * 0.95, wl], [-side * wr * 0.62, wl], [-side * bw * 0.58, -ery * 0.4], [-side * bw * 0.95, -ery * 0.3]])} s={{k: 0.55, [X]: 1}} />
      {/* water surface: flat ellipse, meniscus line */}
      <Ink d={ell(0, wl, wr, ery * 0.8)} s={{[X]: 0.55}} />
      <InkLine d={`M ${-wr} ${wl} A ${wr} ${ery * 0.8} 0 0 0 ${wr} ${wl}`} s={{k: 1}} w={L * 0.8} />
      {/* rim */}
      <InkLine d={ell(0, top, rw, ery)} s={{k: 1}} w={L} />
      {/* outline of the glass */}
      <InkLine d={`M ${-rw} ${top} L ${-bw} ${-ery * 0.3} Q 0 ${ery * 1.2} ${bw} ${-ery * 0.3} L ${rw} ${top}`} s={{k: 1}} w={L * 1.15} />
      {/* thick base */}
      <InkLine d={`M ${-bw * 0.94} ${-ery * 1.4} Q 0 ${ery * 0.2} ${bw * 0.94} ${-ery * 1.4}`} s={{k: 1}} w={L * 0.7} />
      {/* specular streaks toward the light — paper white */}
      <Ink d={pl([[side * rw * 0.78, top + h * 0.08], [side * rw * 0.6, top + h * 0.08], [side * bw * 0.52, -h * 0.1], [side * bw * 0.7, -h * 0.1]])} s={lit} />
      <Ink d={pl([[side * rw * 0.46, top + h * 0.12], [side * rw * 0.4, top + h * 0.12], [side * bw * 0.34, -h * 0.34], [side * bw * 0.4, -h * 0.34]])} s={lit} />
      <Ink d={ell(side * rw * 0.5, top + ery * 0.2, rw * 0.22, ery * 0.3)} s={lit} />
    </g>
  );
};

/** A phone (flat slab) with a glowing screen. Origin = centre. */
export const Phone: React.FC<{w: number; h: number; rot?: number; x: number; y: number; glow?: Spec; ui?: boolean}> = ({w, h, rot = 0, x, y, glow = {}, ui = true}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <Ink d={roundRect(-w / 2 - w * 0.07, -h / 2 - w * 0.07, w * 1.14, h + w * 0.14, w * 0.18)} s={{k: 1}} />
    <Ink d={roundRect(-w / 2, -h / 2, w, h, w * 0.12)} s={glow} />
    {ui && (
      <>
        <Ink d={roundRect(-w * 0.36, -h * 0.4, w * 0.72, h * 0.1, w * 0.04)} s={{k: 0.85}} />
        <Ink d={roundRect(-w * 0.36, -h * 0.24, w * 0.5, h * 0.05, w * 0.02)} s={{k: 0.5}} />
        <Ink d={roundRect(-w * 0.36, -h * 0.14, w * 0.62, h * 0.05, w * 0.02)} s={{k: 0.5}} />
      </>
    )}
  </g>
);

export const roundRect = (x: number, y: number, w: number, h: number, r: number) =>
  `M ${x + r} ${y} H ${x + w - r} Q ${x + w} ${y} ${x + w} ${y + r} V ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} H ${x + r} Q ${x} ${y + h} ${x} ${y + h - r} V ${y + r} Q ${x} ${y} ${x + r} ${y} Z`;

export {RadFill};
