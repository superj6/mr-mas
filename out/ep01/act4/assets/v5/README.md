# Ep1 Act Four · v5 pixel assets: the stills sheet

Stills of every new pixel asset built for the Act Four v5 pixel preview, shown in the framing the v5 shot uses (often
over the v4 shot it re-dresses). They are previews of the assets, not v5 animatic frames: the v5 layouts don't exist yet.
Made by the `prep-artbuild` pass, 2026-09-26 (round 3 rendered this folder).

**The record** (what each asset is, its module, how to use it, what is still a stand-in):
[`show/episodes/ep01/production/act4/art-built-v5.md`](../../../../../show/episodes/ep01/production/act4/art-built-v5.md).

| Path | What |
|---|---|
| `sheet-native.png` | All 88 stills at 480×270 (1×), 4 across. The band under each picture is sheet chrome (the key, the module, a note, any stand-in in red), not picture. |
| `native/<ID>--<state>.png` | Each still at 480×270 (the native frame). |
| `full/<ID>--<state>.png` | Each still at 1920×1080 (4× nearest: the output size). |
| `index.json` | Every still's key, module, note, stand-in and file paths. |
| `j1/` | J1 `CANCELLED` ported (conditional, off by default): `j1-v5-preview-silent.mp4` (5 s, silent, J1 dropped into v4's S1.09 at the click), key stills `j1-t±NN` at 1920×1080 (t = frames since the click; the two certificate stills are JPEG q92), and the same at 480×270 in `j1/native/`. |

**Re-make** (from `studio/`):

```bash
npx esbuild src/episodes/ep01/act4/art-v5/tools/sheet.ts --bundle --platform=node --outfile=$S/sheet.cjs
node $S/sheet.cjs all ../out/ep01/act4/assets/v5
```

For J1, see `studio/src/episodes/ep01/act4/art-v5/README.md`.

**Measured versus needs a person:**
- Measured: every still is inside the master palette (plus THE PLAN's blueprint palette); `sheet.cjs strays` returns `ok` for all 88.
- Needs a person: whether each asset reads was judged by one reader, looking at the stills at 1×, 2× and in crops. Nothing here is in motion.
