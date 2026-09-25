// Path helpers shared by all rigs.
export const ellipse = (cx: number, cy: number, rx: number, ry: number) =>
  `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 ${-rx * 2} 0 Z`;

export const rect = (x: number, y: number, w: number, h: number, r = 0) =>
  r > 0
    ? `M ${x + r} ${y} H ${x + w - r} Q ${x + w} ${y} ${x + w} ${y + r} V ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} H ${x + r} Q ${x} ${y + h} ${x} ${y + h - r} V ${y + r} Q ${x} ${y} ${x + r} ${y} Z`
    : `M ${x} ${y} H ${x + w} V ${y + h} H ${x} Z`;

/** Regular polygon / star points helper. */
export const poly = (pts: [number, number][]) => 'M ' + pts.map(([x, y]) => `${x} ${y}`).join(' L ') + ' Z';
