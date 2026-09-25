// Palettes (one per style tag), small drawing utils and layout constants for the reel.
import {FONT} from '../shared/theme/fonts';
import type {StyleId} from './schema';

export const MONO = FONT.mono;
export const PIX = FONT.pixel;
export const SANS = 'Jost, sans-serif';
export const DISPLAY = FONT.cardName; // Anton
export const HEAD = FONT.headline; // Archivo Black

export const SH = 632; // stage height; caption strip + progress bar below
export const FLOOR = 540; // floor line of a wide shot, in set coordinates

export interface Pal {
  key: StyleId;
  bg: string; // wall / sky
  floor: string;
  bg2: string; // secondary fills
  ink: string; // figures + set lines
  dim: string; // set detail
  text: string;
  glow: string; // cyan thread
  mas: string; // Mas stays in colour
  accent: string;
  gold: string;
  red: string;
  clay: string; // CLOD terracotta
  plate: string; // balloon / card plate
  plateInk: string;
  wallFill?: string; // optional pattern fill (url(#..))
  floorFill?: string;
  mono?: boolean; // 1-bit: every colour is ink
}

const BASE: Pal = {key: 'BASE', bg: '#0a1532', floor: '#0d1b3d', bg2: '#13244d', ink: '#a9c1ee', dim: '#3f5790', text: '#e4ecff', glow: '#3FE6FF', mas: '#FFC857', accent: '#ff5fa2', gold: '#e8b640', red: '#ff5a5a', clay: '#c8674a', plate: '#F4F1E6', plateInk: '#0E1426'};
const ONE: Pal = {key: '1-BIT', bg: '#E9E6DA', floor: '#E9E6DA', bg2: '#E9E6DA', ink: '#0E0E10', dim: '#0E0E10', text: '#0E0E10', glow: '#0E0E10', mas: '#0E0E10', accent: '#0E0E10', gold: '#0E0E10', red: '#0E0E10', clay: '#0E0E10', plate: '#E9E6DA', plateInk: '#0E0E10', wallFill: 'url(#r1bitWall)', floorFill: 'url(#r1bitFloor)', mono: true};
const EW: Pal = {key: 'EARLY-WEB16', bg: '#008080', floor: '#800080', bg2: '#000080', ink: '#FFFFFF', dim: '#C0C0C0', text: '#FFFFFF', glow: '#00FFFF', mas: '#FFFF00', accent: '#FF00FF', gold: '#FFFF00', red: '#FF0000', clay: '#FF6600', plate: '#C0C0C0', plateInk: '#000080'};
const GLYPH: Pal = {key: 'GLYPH', bg: '#020805', floor: '#03120a', bg2: '#062414', ink: '#39FF88', dim: '#1c6b3e', text: '#bfffd6', glow: '#39FF88', mas: '#FFC857', accent: '#9dffc4', gold: '#d8ff6a', red: '#ff6b6b', clay: '#7ddf9f', plate: '#062414', plateInk: '#bfffd6'};
const LEDGER: Pal = {key: 'LEDGER', bg: '#0d3b22', floor: '#0b3320', bg2: '#12502e', ink: '#dfffe9', dim: '#3fa56b', text: '#eafff0', glow: '#39FF88', mas: '#FFC857', accent: '#ff7b7b', gold: '#f2d36b', red: '#ff7b7b', clay: '#e9a07d', plate: '#eafff0', plateInk: '#0d3b22', wallFill: 'url(#rLedger)'};
const TERM: Pal = {key: 'TERMINAL', bg: '#021414', floor: '#031c1c', bg2: '#062a2a', ink: '#2ee6c9', dim: '#11695d', text: '#b9fff2', glow: '#2ee6c9', mas: '#FFC857', accent: '#7affea', gold: '#e6f27a', red: '#ff7a7a', clay: '#58d9c0', plate: '#031c1c', plateInk: '#b9fff2'};
const TWO: Pal = {key: '2-TONE', bg: '#1B2A4A', floor: '#1B2A4A', bg2: '#223457', ink: '#F2E8CF', dim: '#7e7c74', text: '#F2E8CF', glow: '#3FE6FF', mas: '#FFC857', accent: '#F2E8CF', gold: '#F2E8CF', red: '#F2E8CF', clay: '#F2E8CF', plate: '#F2E8CF', plateInk: '#1B2A4A'};

export const PALS: Record<StyleId, Pal> = {BASE, '1-BIT': ONE, 'EARLY-WEB16': EW, GLYPH, LEDGER, TERMINAL: TERM, '2-TONE': TWO};
export const palFor = (s: StyleId, frozen = false): Pal => (frozen ? TWO : PALS[s] ?? BASE);

export const STYLE_CHIP: Record<StyleId, {bg: string; fg: string}> = {
  BASE: {bg: '#1f4aa0', fg: '#bff6ff'},
  '1-BIT': {bg: '#E9E6DA', fg: '#0E0E10'},
  'EARLY-WEB16': {bg: '#FF6600', fg: '#000080'},
  GLYPH: {bg: '#39FF88', fg: '#04200f'},
  LEDGER: {bg: '#1f8f4a', fg: '#dfffe9'},
  TERMINAL: {bg: '#11695d', fg: '#b9fff2'},
  '2-TONE': {bg: '#F2E8CF', fg: '#1B2A4A'},
};

export const ACT_COL: Record<string, string> = {
  TITLE: '#3a3f4c',
  INTRO: '#29b6d6',
  'COLD OPEN': '#7a5cff',
  'ACT ONE': '#2f6fe0',
  'ACT TWO': '#1fa37a',
  'ACT THREE': '#d08a1f',
  'ACT FOUR': '#d04a4a',
  'ACT FIVE': '#b04ad0',
  TAG: '#8a8a98',
  CREDITS: '#4a4a58',
};
export const actCol = (a: string) => ACT_COL[a] ?? '#6b6f80';

// ---------------------------------------------------------------- utils
export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lin = (f: number, a: number, b: number, v0: number, v1: number) => v0 + (v1 - v0) * clamp((f - a) / (b - a || 1));
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const easeBack = (t: number) => {
  const c = 1.9;
  const x = clamp(t) - 1;
  return 1 + (c + 1) * x * x * x + c * x * x;
};
export const rng = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};
export const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};
/** Greedy word wrap by character count (monospace-ish estimate). Long words are hard-split. */
export const wrap = (text: string, max: number, maxLines = 99): string[] => {
  const words = text.replace(/\s+/g, ' ').trim().split(' ');
  const out: string[] = [];
  let cur = '';
  for (let w of words) {
    while (w.length > max) {
      if (cur) {
        out.push(cur);
        cur = '';
      }
      out.push(w.slice(0, max));
      w = w.slice(max);
    }
    if (!cur) cur = w;
    else if ((cur + ' ' + w).length <= max) cur += ' ' + w;
    else {
      out.push(cur);
      cur = w;
    }
  }
  if (cur) out.push(cur);
  if (out.length > maxLines) {
    const cut = out.slice(0, maxLines);
    cut[maxLines - 1] = cut[maxLines - 1].replace(/.{0,1}$/, '') + '…';
    return cut;
  }
  return out;
};
export const typed = (s: string, t: number) => s.slice(0, Math.round(s.length * clamp(t)));
export const GLY = '01<>{}[]=+*#;:/|~^%$&@';
