# e01-v3-tag · Ep1 v3 tag "december" (sc 32–33) · the music stem (MM-12 to picture)

**Composer X (`v3-score-a`), 2026-09-27.** Track A1 of [PLAN.md](../../../../show/episodes/ep01/production/full-v3/PLAN.md). Mood map: *quiet, wry* (the Water Line). **Nothing here has been listened to.** Every number is measured.

| File | What |
|---|---|
| `render/music.wav` | The Kokoro lock's stem: **33.875 s, 1,626,000 samples (813 frames × 2000), exact.** 48 kHz / 24-bit stereo, git-ignored. |
| `render/music-el.wav` | The ElevenLabs-timed lock's stem: **33.708 s, 1,618,000 samples, exact.** |
| `cues.json`, `cues-el.json` | The cue sheet (sync points, engine QA, note QA, loudness per sub-section, silences). |
| `track.py` | The source. Shared helpers: `../e01-v3-act1/v3lib.py`. |

## What plays

One cue, `tag_december`, in P01 DARK ROOM on the felt (MM-12 isn't built; this is its Ep1 cut to picture). Kokoro-lock seconds; every time is read from the lock.

| s | What |
|---|---|
| 0 → 0.6 | No score: Act Four's vault hum (the sound bed carries it 1.5 s into the tag). Marked. |
| 0.6 | **The felt's open fifth F3 + C4**, ppp: it takes the F over from the hum ("MM-12 picks up the vault's F pedal and turns it into the Water Line's felt"). |
| 3.1 | **The Water Line, plain** (F F F G-sw F \| C F) over rootless Fm(add9) and D♭maj7; the chip square on the nudge only (−10 dB). The rack slot's delivery (4.5) lands inside it. |
| 8.1 | One held B♭m9 under "it looks calmer than me." (the V.O. sits inside it; nothing moves). Then a C7sus colour (no third). |
| 12.1 | An open F (felt) held through the Orb's two scans and "close.". |
| 13.16 / 15.01 | **The verdict** (OST-BIBLE §2.4, Ep1): F5 just after the first toast's blink and the C6 **two beats late**, just after the second (never on the blink itself), on soft vibes + celesta, let ring. |
| 17.7 → 23.1 | The back wall: its chord pre-laps the cut right after "close.", then **the Water Line once more, timed so its settling F would land on the THUD**: the C4 sounds, and the thud (23.12) **stops the line dead** (3 ms, tails cut) before the F. The one stop, as the script asks. |
| 23.1 → 30.6 | No score: the front page and "noted." (the room holds). Designed and marked. |
| 30.64 | **The button: the chord with no third** (felt F3 C4 G4 C5), on the downbeat after "noted.", held on his face; the vault's F hum (a timeline sound) is its root. It rings down into the black and is out by the tag's last frame, so **the Orb outro starts on its own music.** |

## Measured

| | Kokoro | EL |
|---|---|---|
| Length | 33.875 s, exact | 33.708 s, exact |
| LUFS-I · ST p95 · true peak | −21.0 · −19.7 · −4.5 dBTP | −21.0 · −19.6 · −3.7 dBTP |
| Per section (LUFS-I) | the Water Line −20.3; the V.O. and scans −24.5 (a V.O. window, P01's ≈ −24); the back wall −19.9; the button −21.8 | −20.3 · −24.9 · −19.6 · −20.8 |
| Digital silence | 0 → 0.6 and 23.13 → 30.63, both marked | 0 → 0.6 and 23.08 → 30.47, both marked |
| Holes, fragments | none | none |
| OST checks | written A♮ over F 0; F-major OK (sieved A/F worst 0.039, limit 0.08); knee whole 0, completion 0; the Water Line found by the motif matcher | the same (sieved worst 0.038) |
| Onsets | 5 of 5 within ±10 ms | 4 of 5 (the button 12.7 ms) |

## Re-run

```bash
OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-tag/track.py --render [--el]   # ~10 s
audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-tag/track.py --assemble [--el]
audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-tag/track.py --dry [--el]
```

## Decide (one owner per sound)

**The timeline has `synth:button_chord` at 33.04** (the v2 bed's temp felt chord, F3 C4 F4 C5). The script calls the button MUSIC ("MM-12's button"), so the score plays it (F3 C4 G4 C5, on the same frame). **The sound stem should drop `synth:button_chord`**, or the mix mutes one. If both play they're consonant (both have no third), just louder.

## For an ear

1. 0–8 s: the felt taking the F from the vault hum, then the Water Line: quiet and wry, not sad.
2. 13–15.5 s: the verdict, F then C two beats late: a small shrug, not a chime.
3. 20–23.2 s: the Water Line cut by the thud before its last F: does the stop land as the thud's?
4. 30.6–33.9 s: the button with no third: open, and gone before the outro.
