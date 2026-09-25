/**
 * Anime cel color scripts ("iro-shitei"). Each material = base + one hard shade (+ a deeper accent
 * used sparingly) + a soft highlight. This is the NIGHT / MONITOR script: cool violet shadows,
 * cyan key light from the monitor (screen-right), a violet back-rim from the window.
 */
export const LIGHT = {
  key: '#8CF3FF', // monitor cyan
  keyHot: '#E6FDFF',
  back: '#8E7DFF', // window/violet back rim
  phone: '#E4F4FF',
};

export const MAS_C = {
  skin: {base: '#EDD2C8', shade: '#A98AA2', deep: '#7B6389', hi: '#FFF5EF'},
  skinLine: '#2C1D2A',
  skinLineSoft: '#6E4654',
  hair: {base: '#51403F', shade: '#2E2332', shine: '#8B7673', line: '#1B1320'},
  eye: {white: '#F4F0F2', whiteShade: '#B5AEC8', irisTop: '#1F3A30', irisMid: '#4A7A5E', irisBot: '#A8DDBB', pupil: '#0E1813', line: '#1E141D', lineSoft: '#6E4654', glint: '#9CF6FF'},
  brow: '#2E2126',
  mouth: {line: '#3A1E28', lineSoft: '#7A4A55', interior: '#4B2231', tongue: '#B45F6E', teeth: '#F3EFF1'},
  hoodie: {base: '#8C92A2', shade: '#5C6178', deep: '#44485E', hi: '#C4CAD8', line: '#232434'},
  string: {base: '#E8EAF0', line: '#3A3C4E'},
};

export const NOLE_C = {
  skin: {base: '#E9C9B3', shade: '#A57F8C', deep: '#775870', hi: '#FFF1E6'},
  skinLine: '#2A1B22',
  skinLineSoft: '#6A4250',
  hair: {base: '#2F272C', shade: '#17121A', shine: '#6E6070', line: '#0F0B12'},
  eye: {white: '#F2EEF0', whiteShade: '#AFA8C2', irisTop: '#1B2533', irisMid: '#445B75', irisBot: '#9DC0DA', pupil: '#0B0F16', line: '#150F16', lineSoft: '#6A4250', glint: '#A8F2FF'},
  brow: '#1D1519',
  mouth: {line: '#34182A', lineSoft: '#76464F', interior: '#44202C', tongue: '#AE5A68', teeth: '#F2EEF0'},
  tee: {base: '#2C2D35', shade: '#18181F', deep: '#101015', hi: '#5A5C6E', line: '#07070B'},
  phone: {body: '#1A1B21', edge: '#454857', lens: '#0B0C10', glow: '#D9F1FF'},
};

export type EnvC = typeof ENV;
export const ENV = {
  wallTop: '#0B0E24',
  wall: '#141A3A',
  wallLow: '#0D0F24',
  sky: '#1A2358',
  skyGlow: '#5A2E6E',
  desk: '#10142C',
  deskLit: '#2B6C86',
};
