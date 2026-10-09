# audio/ep02: Ep2's voices

| Path | What |
|---|---|
| `cast-el.json` | the ElevenLabs cast: a COPY of Ep1's (`audio/ep01/v3-el/cast-el.json`, locked). Ep1's picks carry over (Mas is Jeremy, Sirrah is Ida Freeist, MARIO stays on Kokoro); a new role is auditioned and added here with its reason (manifest.md §5). Library voices only: no cloning, no voice design, no voice chosen to resemble anyone. `cache_dir` is Ep2's; Ep1's cache is only read (`cache_read`) |
| `v1-el/tools/` | the EL route, copied from `audio/ep01/v3-el/tools/` and pointed at Ep2: `el_render.py` (the takes; `--dry-run` now writes nothing), `el_lock.py` (the EL-timed lock, the master; `--fixed` no longer swallows segments, and a rebuild that would drop a line stops), `ellib.py`, `elaudio.py` |
| `v1-el/tools/el_audition.py` | the new roles' auditions (cast.md §3, §6): `screen` (free listing: the shortlist re-screened, a failing voice replaced and logged), `render` (the role's real lines per candidate through `el_render.render_take`, the episode's seeds, −16 LUFS: the pick's takes are cached for the takes pass), `measure`, `scene`, `pick`, `cast` (writes the picks into `cast-el.json`), `report`, `credits`. A copy of Ep1's method with Ep2's tables |
| `v1-el/auditions/` | `index.json` (the screen, every take's measures, the neighbours, the rankings, the picks, the credits) and `<role>/wav/` (the audition takes, git-ignored). No `lines*.json` is written here, so no lock or plan reads an audition as a take |
| `v1-el/ep02-v1/<seg>/` | **the episode's takes** (the takes pass, 2026-10-09): `lines-A.json` lists every line of the segment (the ElevenLabs takes, and the special rows marked `special`: `cut`, `crowd`, `sung`, `kokoro`), `manifest.json` every request and the pick, `wav/` (git-ignored), `log/`. Record and QA: [takes-qa.md](../../show/episodes/ep02/production/v1/takes-qa.md) |
| `v1-el/ep02-v1/qa/<seg>-qa.json` | every read's measures (ASR, names, length, tempo, level, clipping, floor, pitch), the retakes and the pick |
| `v1-el/ep02-v1/act3/crowd/`, `act2/sung/`, `variants/` | the chant's ten layers, the sung line's source and part stems, the reads tried before a per-line reading or setting was kept |
| `v1-el/tools/render_v1.sh` | the one command that records the episode: `el_render.py` per segment, `el_qa.py retake`, the special lines (`el_cut.py`, `el_crowd.py`, `el_sung.py`, `el_mario.py`), `el_qa.py measure` + `report`. `pron_check.py`: the forced-choice name check (Ep1's, with Ep2's names) |
| `v1-el/cache/` | the request cache (git-ignored) |
| `v1/<seg>/lines-v1.json` | a Kokoro round (the base lock reads it first): `v1/act4/` holds MARIO's six lines (`el_mario.py`, through Ep1's fastrec, run, never edited) |

The flow, with commands: [pipeline.md](../../show/episodes/ep02/production/v1/pipeline.md) §2. The key stays in `.env` (read inside `ellib.py`, never printed). Every take WAV under `audio/ep02/` is git-ignored, as Ep1's are.
