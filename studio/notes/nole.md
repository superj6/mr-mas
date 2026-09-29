# NOLE: tonal rig (key: `nole`)

## What I built
- `src/shared/tonal/noleTone.ts`: `noleTone(params): ToneModel`, NOLE as a flat-plane tonal rig in the
  same format as `masTone.ts`. It renders in every tonal style: soft, paint, noir, riso, engrave, glyph, pixel, dither, stipple.
- `src/styleframes/nole.frame.tsx`: lookdev compositions. The pattern is copied from `tonetest.frame.tsx`, not imported.
- `src/dev/nole/entry.tsx`: dev entry that registers only the Nole frames.

## Design
- Elon-inspired persona. Caricature is limited to two features plus a prop:
  1. a big square chin and jaw, set forward
  2. dark hair swept back with volume on top and short sides
  3. prop: a phone held at chest height, with the screen as a light plane
- Other persona cues: black crew-neck tee, broad shoulders and high traps, a light stubble shadow, and a
  confident closed-mouth smirk (the default persona pose). There is also a toothy grin.
- Proportions are semi-real: eye line at mid-head, facial thirds, a thick neck set forward, and a tilted collar ellipse.
- Size, in the same local units as Mas: skull crown y-256, hair top y-322, eye line y-24, chin y218, and a bust crop at
  y560. The torso is drawn down to y600 and the forearm to y640, which leaves headroom for breathing and the phone lift.
  The head is about 1.08x Mas and the shoulders are about 1.25x (-346..324). `nole-lineup` shows him next to Mas.
- Lighting is short lighting. The key comes from screen-right (the monitor), so the broad side of the face toward camera is in form shadow.
  - Planes run from the terminator to a half-tone band (narrow on the skull, wide on the cheek), then to eye sockets under a brow
    cast shadow.
  - The nose has a shadow side, a cast shadow and an underside. The chin casts a shadow on the throat, and the lower
    edge of that shadow slopes rather than following the jaw.
  - The SCM muscle line acts as the neck's terminator. There is a deep occlusion pocket under the ear.
  - Highlights sit on the far brow, the nose ridge and tip, the far cheekbone, the chin and the lower lip.
  - There is a cool kicker on the near shoulder and a rim light on the far shoulder.
- Stubble uses its own hue, `stubble`. It shows only on the lit side and in the half-tone band, so it reads as a 5 o'clock shadow, not a goatee.

## Params
| param | range | notes |
|---|---|---|
| `lookX`, `lookY` | -1..1 | Pupils are clipped analytically by the lids, so they never leave the eye. `lookY: 1` looks down at the phone. |
| `lid` | 0..1 | Default is 0.22 (slightly hooded). 1 is a closed-lid line. Iris and pupil are clipped to the lid curve. |
| `mouth` | `rest` `smirk` `grin` `open` | Replacement shapes. `grin` and `open` drop the jaw by rotating the lower-face points around a hinge under the ear, so the chin silhouette moves. `grin` also squints the lower lids and bunches the cheek. |
| `brow` | -1..1 | A negative value lifts the ends less and pulls the inner ends down (concentration or frown). |
| `tilt` | degrees | Head and neck pivot at (10, 200). About ±6° is clean. |
| `phone` | bool | Phone and hand. Default true. |
| `phoneLift` | 0..~40 | Raises the phone and hand. The forearm extends below the crop. |
| `print` | bool | Faded red-planet screen print on the tee. Default false: at bust scale it reads as a badge or cookie. It is meant for close-ups. |

## Compositions (`npx remotion still|render src/dev/nole/entry.tsx <id> ...`)
- `nole-tone-test`: 9 styles plus a legend, 1920x1080.
- `nole-hero-<style>`: 1920x1080 still, one style.
- `nole-motion`: 3 s, paint | noir side by side.
- `nole-motion-<style>`: 3 s, one style.
- `nole-expressions`: rest, smirk, grin, open, phone, blink, in soft and noir.
- `nole-lineup`: Mas vs Nole scale check.
- `nole-big`: 1080 close-up. `--props='{"style":"noir","params":{"mouth":"grin"}}'`

The motion test is on twos and runs:
1. smirk, then a laugh (grin, open, grin)
2. a blink, then an eye dart to camera with a blink on the turn
3. he looks down at the phone as it lifts, with a frown and a head tilt

Throughout there is breathing, monitor flicker on the key light (the spot color dims on a few frames), grain boil and a slow push-in.

## Rig limits (all styles)
- **One drawn angle only: 3/4 facing screen-right, lit from screen-right.** The lighting is baked into the planes.
  - Mirroring with `scale(-1 1)` gives a screen-left Nole, but the key then comes from screen-left, so the scene has to agree.
  - A front view or profile needs a second drawn plane set, swapped on a cut or smear.
  - There is no `turn` param (Mas has a small one).
- **Mouths:** 4 shapes. Lip sync needs about 3-4 more (`o`, `ee`, `f/v`; `m/b/p` = `rest`). Each is about 30 lines in the same pattern.
- **Hand:** one pose (thumb on screen, three fingers wrapped round the far edge). It holds up at bust and medium framing but not in close-up.
  There is no finger animation. New hand poses are replacement drawings.
- **Hair:** no secondary motion yet. The front locks could take a spring transform for follow-through, but that is not wired up.
- **Tilt:** beyond about ±6°, the back of the neck and the collar start to show gaps. There are no shoulder shrugs or arm acting beyond the phone lift.

## Rig limits by style
- **soft:** the best "closer to real" read.
  - The renderer adds subsurface scattering at the jaw and neck and a cool bounce on the shirt. The rig follows two
    conventions, below, so this style has no halos or seams.
  - Most expensive to render (SVG filters). Plan for about 2-3x the render time of paint.
- **paint:** flat and clean. The half-tone band is the raw local hue (warmer and more saturated than the lit tone). It
  reads as a painterly warm terminator, but it is prominent.
- **noir:** the strongest graphic read. Stubble disappears, since tones 3 and 4 map to the same values. Shadow planes
  are pure ink, so the jaw is carried by the teal neck plane under it.
- **riso:** good. Stubble comes through as a bluer overprint on the jaw, which is a nice accident.
- **engrave:** hatch angles are set per plane to follow the form (lit face 68°, shadow 80°, hair -20° to -65°). The
  lines are straight, not contoured. Small lit-side details (lids, lip line) are faint below hero size.
- **pixel:** reads well at cell size 3 or more. At small panel sizes, sub-cell lines (lash, lip line) drop out. Stubble
  had to be warm enough to land on the skin ramp (`#C29482`); a greyer stubble reads as a grey goatee.
- **glyph:** a black tee and dark hair make him dim. He needs a brighter key, or rim planes, in glyph scenes.
- **dither / stipple:** features get mushy at the 384 px grid panel size. Use hero framing.
- **Raster styles:** animate on twos or they crawl.

## Two authoring conventions for the soft renderer
1. **Each hue group's FIRST plane should be its silhouette in the DARKEST tone that touches the contour.** The lit
   planes then go on top as interior planes.
   - The soft renderer blurs interior edges. If a dark interior plane shares an edge with the silhouette, the lighter
     base shows as a halo.
   - In flat renderers, coincident edges leave anti-aliasing fringes.
   - In this rig, that means skin base = tone 1 with the lit front bounded by the terminator, and hair base = tone 0.
2. **Mark thin dark accents `base: false`.** These are accents like hair clump shadows, which have a large bounding box
   but a thin shape. Otherwise they get their own key-rim lines.
   - Stubble planes use `soft: 3`. They are their own hue group, so they would otherwise be crisp.

## Known issues
- The likeness comes from the persona: hair, jaw, smirk, tee and phone. The face itself leans generic "handsome
  square-jawed guy". To push the likeness: fuller cheeks, smaller and more close-set eyes, and a wider grin with
  more upper teeth.
- The grin's teeth are one band with hairline separations. They read at bust scale but look like dentures in close-up.
- The phone UI is generic (status bar, avatars, image block). There is no parody app branding yet.
- The `print` option is designed but defaulted off (see above).

## Outputs (`out/lookdev/looks/nole/`)
- `tone-test-v8.png`: all 9 styles plus legend
- `nole-hero-{soft,paint,noir,riso,engrave,pixel}.png`: hero stills. Glyph, dither and stipple heroes are registered but not rendered.
- `nole-expressions.png`, `nole-lineup.png`
- `nole-motion.mp4` (paint | noir): about 1m40s to render at `--concurrency=2`
- `nole-motion-soft.mp4`: about 14 min on this CPU box, while other builders were rendering in parallel
- `tone-test-v1..v8.png`, `big-*.png`, `expressions-v*.png`: iteration history
