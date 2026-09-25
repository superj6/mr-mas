Act Four's dialogue is cast, recorded and documented. The script has 50 lines. 43 are voiced (78.9 s); the other 7 are posts shown as on-screen pop-ups, which the house rule keeps unvoiced, so they only have scratch reads. Every take was picked by measurement and nobody has listened yet, so an ear pass is the first thing the next stage needs.

All lines pass the checks: 48 kHz/24-bit, dry, −16.0 LUFS, true peak ≤ −1.5 dBTP, no clipping, MP3s level-matched, and no creak on any delivered take. Four speech-recognition mismatches remain, none a misread: the recognizer completes the cut-off "char—", writes "72" for "seventy-two", spells ALYI as "Ali", and hears a leading "The" on an optional pop-up read (possibly a small onset artefact; check by ear before using it).

**Cast.** The five returning voices are the CASTING.md picks with the room reverb removed.

| Character | Voice | Median pitch |
|---|---|---|
| ALYI | `am_onyx` (returning) | 84 Hz |
| TERB | `am_echo` b-echo-brisk | 103 Hz |
| MAS | `am_michael` (returning) | 111 Hz |
| MARIO | `am_liam` (returning) | 115 Hz |
| MADA | `am_adam` b-adam-grey, +1.5 st | 124 Hz |
| TTEMME | `am_fenrir` d-fenrir-headset, +2 st | 137 Hz |
| GERG | `am_puck` (returning) | 141 Hz |
| TILED EMPLOYEE | `af_nova` a-nova-plain, −1.5 st | 146 Hz |
| TASYA | `am_eric` b-eric-warm | 151 Hz |
| NELEH | `af_aoede` c-aoede-precise, −2 st | 175 Hz |
| ADELINA | `af_bella` a-bella-warm | 199 Hz |
| RIMA | `af_heart` (returning) | 207 Hz |

The seven new roles each got a written brief and three auditioned candidates, and TTEMME a second round. His first candidates all used TASYA's `am_eric` pack and sounded too alike in the same boardroom.

**Strengths**
- **Calm-off:** MADA's master read and Mas's echo were chosen as a pair so their melodies match (correlation 0.85). One MADA read is reused for all three of his lines, since it's a canned answer.
- **Key comedic lines:** these got 4–11 takes each. "super.", "mostly.", "okay.", "hi.", "leave it open." and "it's a preview." all end level or gently falling.
- **Timing:** internal pauses are set exactly (for example, 0.60 s at the memo's ellipsis). NELEH's "char—" stops hard mid-word.
- **Picture sync:** each line has word timings in frames, e.g. TASYA's "below / above / around" for the palette steps.
- **Mouth cues:** 24 fps, on the mouth set in `talk.ts`, with every drawing held at least 2 frames and smile only after warm lines. I checked the method on a diagnostic plot, which is how I caught and fixed mouths staying open after the sound ended.

**Weaknesses**
- **Finals that miss the direction on every take:** RIMA's "I'll hold it together." rises (+2.2 st); "super." ends +1.4 st and a little under Mas's pitch lane; "mostly." is level rather than "a shade lower".
- **Closest pairs:** MADA and TTEMME (1.8 st apart, similar timbre). Both are already at the ±2 st pitch-shift limit, so the headset tone is the only separation. ADELINA and RIMA are also close (0.6 st), but share a scene without ever being in the same exchange.
- **Pack quality:** MADA's `am_adam` is Kokoro's lowest-graded voice. Several others are D-grade (onyx, liam, echo, eric), where grain is the likeliest artefact.
- **Pitch measurement:** the tracker drops whole vowels on MAS's and MADA's packs, so YIN fills those gaps. The audition tables use the earlier tracker; the delivered pitch numbers are re-measured.

**What the next stage must know**
- Filter lines.json on `voiced_in_cut`. The pop-up rows point at `optional/` and must not go in the cut; each carries a suggested on-screen hold.
- File paths in lines.json are relative to the repo root.
- Everything is dry. Mix notes are in dialogue.md §9 (ALYI's hall send, Mas's "super." on a light call codec with no music under it, TASYA behind the door, GERG through a monitor speaker, a dropout on NELEH's tile exit).
- Gaps inside lines are digital silence, so lay room tone under all dialogue.
- The script's HOLD beats are picture time; the files are trimmed. At 96 BPM a beat is 15 frames.
- "noted." is not in Act Four (it's in the cold open and the tag), so it wasn't recorded.
- Tags carried unresolved: TASYA's "below/above/around" is [V/K]; GERG's two posts need a casing re-fetch.
- Pronunciation to lock: "Alyi" is set to AL-yee but the recognizer hears "Ali".
- The new speakers have no pixel dialogue-blip kits yet.
- Alternate takes are in `takes/<id>/`, ranked in each line's `alt_takes`.
- Re-run: `record.py [ids]`, then `final_cast.py`, `reel.py`, `make_doc.py`. Takes are seeded, so a re-run reproduces them exactly.

Files are in /home/jgon/project/art/mrmas/:
- show/episodes/ep01/production/act4/dialogue.md
- audio/ep01/act4/dialogue/lines.json
- audio/ep01/act4/dialogue/act4-dialogue-reel.mp3 (104 s, script order, for listening, not picture timing)
- audio/ep01/act4/dialogue/wav/ and mp3/ (43 voiced lines each)
- audio/ep01/act4/dialogue/optional/ (the 7 pop-up scratch reads)
- audio/ep01/act4/dialogue/auditions/ (candidate reels and auditions.json)
- audio/ep01/act4/dialogue/qa/ (qa.json, final_cast.json)
- audio/ep01/act4/dialogue/tools/ (the recording scripts)
- out/ep01/act4/dialogue/mouth_check.png