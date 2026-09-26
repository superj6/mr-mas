// MR. MAS · range passes (prototype 4): the additive PASSES module the style-range bible asks for (H6). It imports
// only from src/shared/pixel, so the engine owner can promote it to src/shared/pixel/passes/ unchanged.
//   color     palette math: OKLab nearest, linear-light block averages, per-colour grades
//   defocus   stepped-resolution defocus (2x2 / 4x4 bands on the native grid): the only depth of field
//   osdfont   the OSD face (heavy condensed caps) for device graphics
//   osd       plates, held-step reveals, the crawl, the telestrator, timecode, tags
//   device    broadcast-safe grade, stream chroma + macroblock drift, bezel miniatures, the fisheye, the iris blades
//   band      the 480x67 verb/inventory band and its retract/return in held steps
//   present   the room area at an integer pixel scale (pixel-step push-ins) over the 4x band, to 1920x1080
export * from './color';
export * from './defocus';
export * from './osdfont';
export * from './osd';
export * from './device';
export * from './band';
export * from './present';
