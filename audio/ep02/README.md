# audio/ep02: Ep2's voices

| Path | What |
|---|---|
| `cast-el.json` | the ElevenLabs cast: a COPY of Ep1's (`audio/ep01/v3-el/cast-el.json`, locked). Ep1's picks carry over (Mas is Jeremy, Sirrah is Ida Freeist, MARIO stays on Kokoro); a new role is auditioned and added here with its reason (manifest.md §5). Library voices only: no cloning, no voice design, no voice chosen to resemble anyone. `cache_dir` is Ep2's; Ep1's cache is only read (`cache_read`) |
| `v1-el/tools/` | the EL route, copied from `audio/ep01/v3-el/tools/` and pointed at Ep2: `el_render.py` (the takes; `--dry-run` now writes nothing), `el_lock.py` (the EL-timed lock, the master; `--fixed` no longer swallows segments, and a rebuild that would drop a line stops), `ellib.py`, `elaudio.py` |
| `v1-el/tools/el_audition.py` | the new roles' auditions (cast.md §3, §6): `screen` (free listing: the shortlist re-screened, a failing voice replaced and logged), `render` (the role's real lines per candidate through `el_render.render_take`, the episode's seeds, −16 LUFS: the pick's takes are cached for the takes pass), `measure`, `scene`, `pick`, `cast` (writes the picks into `cast-el.json`), `report`, `credits`. A copy of Ep1's method with Ep2's tables |
| `v1-el/auditions/` | `index.json` (the screen, every take's measures, the neighbours, the rankings, the picks, the credits) and `<role>/wav/` (the audition takes, git-ignored). No `lines*.json` is written here, so no lock or plan reads an audition as a take |
| `v1-el/ep02-v1/<seg>/` | the EL takes (`lines-A.json` + WAVs, git-ignored), from `el_render.py render --out audio/ep02/v1-el/ep02-v1/<seg>` |
| `v1-el/cache/` | the request cache (git-ignored) |
| `v1/<seg>/lines-v1.json` | a Kokoro round, if one is recorded (the base lock reads it first) |

The flow, with commands: [pipeline.md](../../show/episodes/ep02/production/v1/pipeline.md) §2. The key stays in `.env` (read inside `ellib.py`, never printed). Every take WAV under `audio/ep02/` is git-ignored, as Ep1's are.
