# e01-v3-tag · Ep1 v3 tag "december" (sc 32–33) · the music stem (MM-12 to picture)

**Composer X (`v3-score-a`), 2026-09-27.** Track A1 of [PLAN.md](../../../../show/episodes/ep01/production/full-v3/PLAN.md). Mood map: *quiet, wry* (the Water Line). **Nothing here has been listened to.** Every number is measured.

## v3.4 (current, 2026-09-28)

**The locks:** `show/reel/ep01-v34/` and `-el`, 33.250 s (798 frames) each, exact. **The duck is cut:** 32.01 is a plain 77-frame arrival, so the demo layer is gone (it's built only when the demo beat exists). MM-12 plays through as on the v3 lock:
- the felt's fifth takes the F;
- the Water Line comes in with the delivery (3.1 s);
- the B♭m9 goes under "it looks calmer than me.";
- the verdict follows the toasts;
- the back wall's Water Line is cut by the thud;
- then no score until the button.

**Measured:** −21.0 LUFS-I; F-major OK, knee 0, no unmarked silence or fragments; the cut check is clean.

## v3.3 (superseded by v3.4, 2026-09-28)

**The locks:** `show/reel/ep01-v33/` and `-el`, 42.333 s (1,016 frames) each, exact. The cover beat (32.03) holds about 1 s longer: the B♭m9 still sits under "it looks calmer than me.", and the C7sus colour after it holds the extra second until the cut to the scans; everything after it follows the timeline. Every rest fades over 5 ms. **Measured:** MM-12 −21.6 LUFS-I, the demo bed −24.2; the same checks pass.

## v3.2 (superseded by v3.3, 2026-09-28)

**The locks:** `show/reel/ep01-v32/ep01-v32-tag.json` (the default) and `show/reel/ep01-v32-el/` (`--el`). Both are 41.333 s (992 frames), exact, with the demo's frames unchanged.
- **The V.O. "those are stills." is cut** (the stutter carries the joke). The stills now play on the room alone, from the dead cut at i151 to MM-12's return with the pull-back at i199 (a designed silence).
- **The audit's 21:20.1 accent** (+12 dB on the cut to the scan two-shot, 32.04) is **designed, and now marked:** on the cut, the felt re-voices from the C7sus colour to an open F, held under the Orb's two scans. The verdict's F5 follows the first toast's blink.
- **Measured:** MM-12 −21.6 LUFS-I; the demo bed −24.2; the same checks as v3.1 (F-major OK, knee 0, no unmarked silence, no fragments).


## v3.1 (superseded by v3.2, 2026-09-27): the Elgoog demo insert

**The lock:** `show/reel/ep01-v31/ep01-v31-tag.json` (the default). **`render/music.wav`: 41.333 s, 1,984,000 samples (992 frames), exact.** The tag now opens on **ELGOOG's product film** (the Runway insert, 233 frames from tag frame 62; `show/episodes/ep01/production/full-v3/runway.md` §4a, §7):
- **`demo_film`, the film's own sound** (diegetic, its own layer; `DEMO=0` drops it): a clean, glossy corporate-demo bed in the show's palette, no melody. An E♭ glass pad with no third (E♭ B♭ F C) is the sheen; a shimmer rises as the lines draw themselves (i34); a swell into the fill and a soft glow chord as the duck becomes real (~i95); the chip's clock plays at a whisper through the turn. It is **small on the monitor's speaker until the grid dissolves** (i22–26), then full range.
- **The stutter** (i137–150): the bed is chopped in step with the held frames, a buffering stutter with tiny digital clicks, not a beat. **The first still (i151): the sheen cuts out dead**, with drier slide-change clicks on i151, 159 and 167. Then there's nothing but the room and the V.O. ("those are stills.").
- **MM-12** keeps its shape: the felt's open fifth takes the vault's F and **ducks to the room as the demo opens up**. **The Water Line returns with the room on the pull-back (i199)**, with a tiny chip blip as the monitor's still snaps back to the grid (i213). Then the V.O., the verdict two beats late, "that was close.", the back wall cut by the THUD, and the button with no third.
- **Measured:** MM-12 −21.6 LUFS-I; the demo bed −24.2 over its window (a monitor's film, before the mix's own balance). Its 2–6 kHz band reads −13.8 dB against the −15 underscore guide: it's the diegetic film, bright by design, and its voice ("What the quack!") is part of it. Digital silence only at the head (0–0.6 s) and the THUD → the button; no holes. Written A♮ over F 0, F-major OK, knee 0.
- **For the sound pass:** the stutter's clicks and the slide-change clicks are in this layer, as part of the film's own track. If the sound stem makes its own, run with `DEMO=0`, or tell me and I'll take the clicks out.

**The EL variant:** `render/music-el.wav` from `show/reel/ep01-v31-el/` (`--el`); the v3-EL render is kept as `render/music-v3-el.wav` / `cues-v3-el.json`, superseded.


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
