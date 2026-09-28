// MR. MAS: CLOD look-dev (dev only). A stand-in for shared/pixel/cast/clod.ts that draws nothing, bundled ONLY into
// the clean-plate renderer (plate-build.mjs) so the lighthouse pane renders without the pixel CLOD. Everything else
// the module exports is the real thing. The episode's own code and bundles are untouched.
export * from '../../../shared/pixel/cast/clod';
export const drawClod = (..._args: unknown[]): void => {};
