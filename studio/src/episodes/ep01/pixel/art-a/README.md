# Ep1 full-v3 · art-a stills registry (cold open + Act One)

The v3-art-a pass (2026-09-27) wrote this folder. It registers every state of every asset built for sc 1–12 as one 480×270 still, so the shot passes can see what exists and call it. The record, with the asset table (id, module, entry points, states, stand-ins) and the open decisions, is `show/episodes/ep01/production/full-v3/art/art-a.md`.

## Files

| File | What it is |
|---|---|
| `registry.ts` | `AssetDemo` (`id`, `state`, `module`, `note`, `standin`, `draw(fb)`), the `DEMOS` list and `D()` to register one |
| `demos.ts` | imports the scene groups in order and re-exports `DEMOS` |
| `demos/coldopen.ts` | sc 1–4: APEC, the invite, the rewind toast, 1993, Mas seated, the collars |
| `demos/act1-launch.ts` | sc 5: the beige button, the launch-night bullpen, Rima standing, the chat window, CHATGTP |
| `demos/act1-drill.ts` | sc 6–7: the drill, Mas's tear, the odometer, Gerg's phone insert |
| `demos/act1-elgoog.ts` | sc 8: the code-red alert, Elgoog's lobby, RADNUS, NIRB and EGAP |
| `demos/act1-lobby.ts` | sc 9: the landlord's deal, the TV, the check, Tasya at medium scale, Gerg's poses |
| `demos/act1-duel.ts` | sc 11: the split, the demo-stage arrival (the match cut), CLOD |
| `demos/act1-pause.ts` | sc 12: the pause letter, Nole's desk, OIGNEB, PLEASE, the 12.05 glass |
| `demos/v31-sydney.ts` | v3.1 (script draft 7): sc 10, Sydney in the lobby (restored), the TV's v3.1 states |
| `demos/v31-laptop.ts` | v3.1: Gerg's laptop screen over his shoulder (the chat face, the Atem thread, the match), the duel's v3.1 frames |
| `demos/v31-pause.ts` | v3.1: EMIT lands on his desk; PLEASE / REG |
| `demos/v31-launch.ts` | v3.1: launch night warmed (practicals, face lights, background life), the board seed, 5.09's rack, 12.05's phone, the tear's catch light, the v31 collars |
| `tools/sheet.ts` | the sheet tool (a copy of Act Four's `art-v5` tool, pointed at this registry) |

The drawing code itself lives in `studio/src/shared/pixel/{rooms,cast,kits}/`. This folder only calls it.

## Running

From `studio/`, with `SC` set to any scratch folder outside the repo:

```bash
npx esbuild src/episodes/ep01/pixel/art-a/tools/sheet.ts --bundle --platform=node --outfile=$SC/sheet-a.cjs
bash ../ops/heavy.sh node $SC/sheet-a.cjs all ../out/ep01/full-v3/assets/art-a    # sheet-native.png, native/, full/, index.json (~9 s)
node $SC/sheet-a.cjs strays                                                        # any colour outside the palette; expect "all ok"
node $SC/sheet-a.cjs list                                                          # the keys
node $SC/sheet-a.cjs one   $SC/x.png ROOM-APEC@freeze 2                            # one still, at 2x
node $SC/sheet-a.cjs crop  $SC/x.png SET-DRILL@high-tear-falls 180 60 120 80 5     # a crop, at 5x
node $SC/sheet-a.cjs group $SC/x.png UI-TV 1                                       # one asset's states, 2 across
```

## Rules the drawings keep

- The picture is in rows 0–202; the rail band below is the pipeline's.
- Whole-pixel motion and held drawings only: no scaled or rotated sprites.
- No dither on skin. Lettering is drawn after any flip, so it never mirrors.
- Colours come from the master palette. The exceptions, both allowed and checked by `strays`, are 1993's ONEBIT ink and paper and the TV's LEDGER money print.
- No plates, rails, cards or V.O. are drawn here: that is the pipeline's text layer.

## Measured, and what needs a person

**Measured:**
- 159 stills render: v3's 109, then the v3.1 round's 50.
- The 109 v3 stills re-render pixel-identical in the picture area, because every v3.1 change is an opt-in state or a new module.
- `strays` reports all ok.
- `tsc` prints nothing for these files or the new shared modules.
- Every file here and every shared module the pass wrote is new, so no existing drawing changed.

**Needs a person:**
- Every still was looked at by one reader, at 1× and zoomed; nobody else has checked them.
- Nothing has been seen in motion: the held-step timings are unwatched.
