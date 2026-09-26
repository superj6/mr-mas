// MR. MAS - style-range Prototype 1: the TUNGSTEN colour script for the HD cel read (10.C).
// One hard key: the card room's pool light, tungsten, from above the pot. No fill. Each material gets a lit base, two
// shadow tones (shade, deep) and ONE highlight; the only other light is the far neon's cool rim on the back edges.
// Deep blacks are the rule: everything that doesn't face the lamp falls to the room's near-black.

export const KEY = {warm: '#FFC98E', hot: '#FFE6C2', rimCool: '#62D8E6', rimCoolSoft: '#2E8C9E', lamp: '#FFD9A0'};

export interface Tone4 { base: string; shade: string; deep: string; hi: string; line: string; }

export const SKIN_MAS: Tone4 = {base: '#DE9E78', shade: '#94584E', deep: '#4E2B33', hi: '#FFD6AE', line: '#26100F'};
export const SKIN_NOLE: Tone4 = {base: '#D9987A', shade: '#8E5550', deep: '#4A2932', hi: '#FFD0AC', line: '#230E10'};
export const SKIN_KRAM: Tone4 = {base: '#C58660', shade: '#7C4838', deep: '#3E2226', hi: '#F2C08E', line: '#1F0C0C'};
export const SKIN_MARIO: Tone4 = {base: '#D39168', shade: '#8A5143', deep: '#46272D', hi: '#FAC99C', line: '#220E0E'};
export const SKIN_NESNEJ: Tone4 = {base: '#DBA07E', shade: '#935C52', deep: '#4D2D34', hi: '#FFD9B6', line: '#26110F'};

export const HAIR_MAS: Tone4 = {base: '#6A4634', shade: '#2F1D1C', deep: '#150C0E', hi: '#D7A06A', line: '#0E0709'};
export const HAIR_DARK: Tone4 = {base: '#3A2A28', shade: '#191113', deep: '#0B0709', hi: '#B58A62', line: '#060405'};
export const HAIR_SILVER: Tone4 = {base: '#C9C2B8', shade: '#6E6A6C', deep: '#343036', hi: '#FFF4E2', line: '#17141A'};

export const HOODIE: Tone4 = {base: '#8C857C', shade: '#46434A', deep: '#222127', hi: '#C9BCA8', line: '#121116'};
export const TEE_BLACK: Tone4 = {base: '#3A3230', shade: '#1A1618', deep: '#0C0A0C', hi: '#8A6A52', line: '#050405'};
export const FLEECE: Tone4 = {base: '#3C5A9C', shade: '#1F2E58', deep: '#111930', hi: '#8FA6D8', line: '#0A0F1E'};
export const LEATHER: Tone4 = {base: '#342C2A', shade: '#161214', deep: '#09080A', hi: '#E2B488', line: '#040304'};
export const BLAZER: Tone4 = {base: '#B9B3A8', shade: '#5A575C', deep: '#2E2D34', hi: '#EFE6D4', line: '#131318'};

export const EYE_TUNGSTEN = {
  white: '#CDB6A6', whiteShade: '#6E5452', irisTop: '#16231C', irisMid: '#3F5B3C', irisBot: '#94AE74',
  pupil: '#090D0A', line: '#1A0C0E', lineSoft: '#6A3B38', glint: '#FFF0D6',
};
export const EYE_DARK = {...EYE_TUNGSTEN, irisTop: '#130F10', irisMid: '#3A2A24', irisBot: '#8A6446'};
export const EYE_NOLE = {...EYE_TUNGSTEN, irisTop: '#121820', irisMid: '#384A5E', irisBot: '#8AA6BC'};
export const MOUTH_T = {line: '#3A171A', lineSoft: '#7A4640', interior: '#3E1B20', tongue: '#A45560', teeth: '#EFE4DA'};

/** the room's near-black and its warm and cool darks */
export const ROOM = {black: '#07060A', warmDark: '#1A0F0C', coolDark: '#0A1016', felt: '#1F4A36', feltLit: '#3F7A55', feltHi: '#7FA86E', feltDeep: '#0C1F18'};
