// Realism kit — palette (builder key: realism). Colours are "as lit" in the cold-open room:
// a cyan monitor key, near-black ambient, and (after Nole enters) a sodium-warm doorway rim.
export const PAL = {
  room: '#06080c',
  roomLift: '#0c1219',
  // skin (Mas) under cyan key
  skShadow: '#241d22',
  skCore: '#170f13',
  skBounce: '#2a3038',
  skSSS: '#8a3a30',
  skMid: '#557b80',
  skLit: '#7fa9ad',
  skHi: '#b4d8d8',
  skSpec: '#e4fbfa',
  lipLit: '#7a8b90',
  lipShadow: '#3b2529',
  // skin (Nole) slightly ruddier / tanner
  nkShadow: '#2a1d1c',
  nkCore: '#180f0e',
  nkMid: '#5b7a7a',
  nkLit: '#86a6a4',
  nkHi: '#bcd6d2',
  // eyes
  sclera: '#8fb0b4',
  scleraShadow: '#3a4a50',
  irisMas: '#2f4f55',
  irisMasLit: '#6f9fa2',
  irisNole: '#3a4a3c',
  pupil: '#07090b',
  // hair
  hairMas: '#1c1714',
  hairMasMid: '#3a3a3a',
  hairMasLit: '#62797c',
  hairMasSheen: '#a3c7c9',
  hairNole: '#0e0c0c',
  hairNoleMid: '#262a2d',
  hairNoleLit: '#4d6468',
  // cloth
  hoodShadow: '#15181c',
  hoodMid: '#2c3339',
  hoodLit: '#56676e',
  hoodHi: '#7c9097',
  teeShadow: '#070808',
  teeMid: '#15191c',
  teeLit: '#2c3a40',
  // light
  cyan: '#7fe6f2',
  cyanHot: '#d9fbff',
  warm: '#ff9a4a',
  warmHot: '#ffd29a',
  warmRim: '#ffb473',
};

export type Pal = typeof PAL;
