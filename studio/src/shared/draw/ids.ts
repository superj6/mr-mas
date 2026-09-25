// Deterministic ids for SVG defs (clipPaths, gradients). Same input -> same id on every frame.
export const hashId = (prefix: string, s: string): string => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `${prefix}-${(h >>> 0).toString(36)}`;
};
