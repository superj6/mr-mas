# Sample & instrument licenses (audio/samples)

Each agent appends a section for what it downloaded or used.

## sfx agent (audio/sfx) — 2026-09-25

### `vsco2ce-sfx/` — VS Chamber Orchestra 2: Community Edition (Versilian Studios)
- Source: https://github.com/sgossner/VSCO-2-CE (master branch), 198 individual WAVs fetched by raw URL (~232 MB), paths mirror the repo.
- License: **CC0 1.0 Universal** (repo `LICENSE`, copied as `vsco2ce/LICENSE`). Readme terms: use for any purpose; please don't sell the raw samples as-is; credit to Versilian Studios encouraged.
- Upright Piano sampled by Simon Dalzell (Ivy Audio); redistribution granted by Versilian Studios LLC (`Keys/Upright Piano/Info.txt`).
- Used: Upright Piano, Upright No.1, contrabass pizz, harp, marimba, glockenspiel (+ glissandi), xylophone, harmon/staccato trumpet, trombone shorts/falls, flute/clarinet staccato, timpani, crash/suspended cymbal, triangle, ratchet, claves/wood clicks, snare clicks/rimshot.
- Note: `vsco2ce-sfx/.git` is an abandoned partial sparse clone from an earlier attempt (safe to delete to reclaim ~470 MB; the WAVs outside `.git` are what the SFX scripts use).

### `generaluser-gs/GeneralUser-GS.sf2` — GeneralUser GS v2.0.3 (S. Christian Collins)
- License (see `generaluser-gs/LICENSE.txt`): free to use without restriction for music creation, private or commercial.
- Used via tinysoundfont for celesta, vibraphone (SFX plucks/dings/gliss and voice blips).

### Credit line (suggested for end credits / docs)
"Orchestral samples: VS Chamber Orchestra 2 Community Edition by Versilian Studios (CC0). Upright piano by Simon Dalzell / Ivy Audio. GeneralUser GS SoundFont by S. Christian Collins."

## theme agent (audio/samples/theme-pack) — copied here 2026-09-25 by the rendering audit

`theme-pack/LICENSES.md` is gitignored along with the samples, so its table is repeated here to keep the credits in the repo.

| Folder | Source | License | Credit line |
|---|---|---|---|
| `theme-pack/vsco2ce/` (sparse: strings, brass, clarinet, flute, bassoon, harp, timpani, glock, cymbals, snare, bass drum) | Versilian Studios, VSCO 2 Community Edition — https://github.com/sgossner/VSCO-2-CE | CC0 1.0 (see `vsco2ce/LICENSE`; README asks not to sell the samples directly and to credit) | "Orchestral samples: VSCO 2 CE by Versilian Studios / Sam Gossner & Simon Dalzell" |
| `theme-pack/vcsl/` (sparse: vibraphone, tenor saxophone, hi-hat, tubular bells, suspended cymbal 2) | Versilian Community Sample Library — https://github.com/sgossner/VCSL | CC0 1.0 (see `vcsl/LICENSE`) | "VCSL by Versilian Studios" (not required) |
| `theme-pack/SalamanderGrandPiano-SF2-V3+20200602/` | Salamander Grand Piano V3 by Alexander Holm, SF2 assembled by FreePats — https://freepats.zenvoid.org/Piano/acoustic-grand-piano.html | CC BY 3.0 | "Salamander Grand Piano by Alexander Holm (CC BY 3.0)" — **attribution required in credits** |
| `theme-pack/UprightPianoKW-SF2-20220221/` | Upright Piano KW, FreePats (Gonzalo & Roberto) | CC0 1.0 per bundled `readme.txt`/`cc0.txt` (web page lists CC BY 3.0 — credit anyway to be safe) | "Upright Piano KW by FreePats" |
| `generaluser-gs/GeneralUser-GS.sf2` (shared) | GeneralUser GS v2.0.3 by S. Christian Collins | Free for any music use, private or commercial | "GeneralUser GS by S. Christian Collins" |

## Re-downloading (rendering audit)

Nothing in this folder except this file, `fetch_samples.sh` and `MANIFEST.sha256` belongs in git. To rebuild the folder:

```bash
bash audio/samples/fetch_samples.sh            # all libraries, pinned sources, every file checked against MANIFEST.sha256
bash audio/samples/fetch_samples.sh --check    # verify an existing folder (no network)
```

Pinned sources: VSCO-2-CE @ `440300901dfe9275fd84e0b7763af1f8443ae62e`, VCSL @ `c1ea7bcc3c7309650ab0da9d15c9cd1fbc4a4c7e`, GeneralUser-GS @ `97049183643d5fc5a9322a69c5b09efb667c6c3a` (v2.0.3), FreePats `SalamanderGrandPiano-SF2-V3+20200602.tar.xz` and `UprightPianoKW-SF2-20220221.7z`. See `docs/RENDERING.md` §2.
