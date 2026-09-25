// Offline fonts (SIL OFL) bundled via @fontsource. Import once from Root.
import '@fontsource/anton';
import '@fontsource/permanent-marker';
import '@fontsource/jetbrains-mono/300.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import '@fontsource/silkscreen/400.css';
import '@fontsource/silkscreen/700.css';
import '@fontsource/vt323';
import '@fontsource/oswald/500.css';
import '@fontsource/oswald/600.css';
import '@fontsource/bodoni-moda/400.css';
import '@fontsource/bodoni-moda/800.css';
import '@fontsource/bodoni-moda/400-italic.css';
import '@fontsource/archivo-black';
import '@fontsource/bebas-neue';
import '@fontsource/jost/400.css';
import '@fontsource/jost/700.css';
import '@fontsource/jost/900.css';
import '@fontsource/abril-fatface';
import '@fontsource/playfair-display/700.css';
import '@fontsource/playfair-display/900.css';
import '@fontsource/playfair-display/400-italic.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/unifrakturmaguntia';

export const FONT = {
  mono: '"JetBrains Mono", monospace',
  pixel: 'Silkscreen, monospace',
  osd: 'VT323, monospace',
  cardName: 'Anton, sans-serif',
  cardSub: '"Permanent Marker", cursive',
  wordmark: 'Oswald, sans-serif',
  headline: '"Archivo Black", sans-serif',
  title: '"Bodoni Moda", serif',
  bass: 'Jost, sans-serif',
  bassDisplay: '"Abril Fatface", serif',
  news: '"Playfair Display", serif',
  newsMono: '"IBM Plex Mono", monospace',
  masthead: '"UnifrakturMaguntia", serif',
  poster: '"Bebas Neue", sans-serif',
} as const;
