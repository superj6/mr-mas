# Ep1 · Act Four v5 · sound effects: the spotting (summary)

| | |
|---|---|
| **What** | Every sound effect and room bed Act Four v5 needs, spotted frame by frame to the v5 lock, built from the SFX board. The TEMP-SYNTH stand-ins are gone. |
| **Cue sheet** | [`sfx-v5.json`](sfx-v5.json): **199 effects** (4 of them optional) and **19 room beds**, each with its act frame, placement, gain, pan, fades, and the lock mark or script line it answers |
| **Stems** | `out/ep01/act4/animatic/act4-sfx-v5.wav` (effects) and `act4-rooms-v5.wav` (beds): 8:38.46, 48 kHz / 24-bit, D6 applied. Measurements in `act4-sfx-v5.qa.json` beside them |
| **Code, how to re-run, decisions** | [`audio/ep01/act4/sfx-v5/README.md`](../../../../../audio/ep01/act4/sfx-v5/README.md) |
| **Timing** | [`shots-locked-v5.json`](shots-locked-v5.json) (24 fps). Frames come from its shot starts, story marks and word times, so a re-lock is one re-run away |
| **Who, when** | The SFX editor pass, 2026-09-27, in parallel with the pixel preview pass. Nothing committed. **Nothing heard**: levels are measured and reasoned, not auditioned |

## What was built

- **133 new board sounds** in `audio/sfx/scripts/sounds_4.py`, rendered into `audio/sfx/wav/` and `mp3/` and registered in `manifest.json`: 120 effects and 13 room-bed loops. The sheet uses 128 of them plus 24 existing board sounds (the stamps, the clicks, the bonk, the freeze hit, the odometer, the neon, the hearts' gliss, the Orb's servo, the render front, the shatter, the dark room's drone, tone and hum).
- **Replaced:** all 20 of v4's TEMP-SYNTH one-shot kinds and its 10 synthesised beds. In the sheet, 93 effects and 14 beds name what they replace.
- **New for v5:**
  - the call's UI on both sides (connect, join chime, leave, ring, the mic chip greying)
  - the speakerphone (the pull, four keys tuned to Step Four's line F4 Eb4 Db4 C4, the ringback, a dial tone tuned to the open fifth)
  - the lighthouse's two desk phones, the hang-up and the toppling throne
  - the phones that buzz, step and clack off the table
  - the folder (slide, seal, open, close)
  - the slate door's held steps, the key in its lock, the door opening a crack
  - Terb's door bang, the revolving door on CCTV
  - the avalanche's tuned thocks (one, ten, hundreds), the tile shove and the footnote sparks
  - the hearts rising across the gap, the heart taps
  - the hourglass (flip, trickle, last grain, strain, the fall)
  - the extinguisher's pin and spray, the folding chair, the four screws
  - the crowd's hush and stir, Gerg's typing loop, the Orb's chime
  - the Q\* vault's hum on F

## The rooms (one bed per location, crossfaded; D6 the only hole)

| Frames | Bed | dBFS RMS |
|---|---|---|
| 0–997 | the suite (HVAC, the Strip below), 2 dB down under THE PLAN, **cut on the Cancel click** | −38 |
| 1086–1184 | the suite, back on the buzz | −38 |
| 1140–1524 | the dark room (drone, tone, rack), with TPOOL's frosted office under F1.2 | −39 / −36.5 |
| 1510–3041 | Neleh's office by day | −38.5 |
| 3032–3380 | the all-hands crowd (hushed for the question and the answer, stirring after Alyi) | −35, ridden down 4.5 dB |
| 3368–3634 | Neleh's desk in the evening | −39 |
| 3622–6985 | the boardroom at night; in S4.08 the split (boardroom left, lighthouse right); in S4.09 the lobby CCTV and the boardroom by day. It fades across the card | −38 to −42 |
| 6955–9382 | the dark room, 2 AM, through the avalanche | −39 |
| 9370–10201 | the bullpen on Monday (packing) | −38 |
| 10193–11453 | the boardroom with its fires | −36.5 |
| 11437–11711 | the lobby at night, the neon on F (pre-lapped under the shatter) | −39 |
| 11699–12443 | the bullpen, Nov 22–29, under the whole coda; the vault's F hum over it (5 dB down under the memo) | −38.5 |

## Designed silences and rulings

- **D6** (f 997–1086): every bus is muted, and only the Cancel click's own transient survives. There is no GLYPH dissolve sound in it.
- **No sound on purpose:**
  - THE QUIET VOTE's exit ("without a sound")
  - the one blue heart (texture, never a cause)
  - the silent posts over the violin and over Ttemme's hourglass
- **MADA's label** (S6.06) gets the call UI's chip click, not a freeze hit: the script makes it call UI "so nothing freezes". The band's dead stop is the punctuation.
- **Tasya's key ring** jangles only twice, at his arrival and on the sign's offbeat. His statement is a real line and plays dry.
- **Optional, off by default:**
  - the reversed `tape_spinup` Rewind (the score's retrograde may own it)
  - the palette steps on "below / above / around" (MM-11's chords mark them)
- **Pitch:** everything tuned sits in F minor, and `qa_board.py` finds no held A natural in any new sound (OST rule 12).

## Measured (the stems; nobody has listened)

- **Loudness** (BS.1770 integrated): the effects bus is −32.0 LUFS, the rooms bus −37.4 LUFS, and the two together −34.7 LUFS. For reference, the takes sit at −16 LUFS (mono).
- **Sample peaks:** the effects bus peaks at −5.0 dBFS (the Cancel click), the rooms bus at −19.6 dBFS.
- **D6** (3.71 s): the rooms bus is digital zero. The effects bus is zero after the click's 0.25 s transient (which peaks at −5.0 dBFS).
- **Beds** (50 ms medians in their full-level interiors): 14 of 19 sit within 0.9 dB of their targets. The other five, and why:
  - F1.2's frosted office reads −41.2 against −36.5: bursty on purpose, voices behind glass.
  - The all-hands reads −38.2: ridden down for the hush.
  - The lobby camera with the daylit boardroom reads −37.5: two beds summed.
  - The split's two panes read −38.2.
- **Holes in the floor alone** (rooms + effects, no music or dialogue; 0.3 s or more under −42 dBFS, outside D6):
  - On the louder channel there are 3: two in F1.2's office (0.3 s and 0.4 s) and one in Alyi's pause in S3.07 (0.3 s at −43.3 dBFS).
  - On the mono downmix there are 43 windows, 25.3 s in all. Decorrelated stereo beds read about 3 dB low in mono.
  - The score covers these in the mix, so re-measure on the mix.
- **Against the dialogue:** 25 effects land on speech. The closest is 7.7 dB under the dialogue (the `VOTES: 0` stamp on "votes", as scripted), and none is within 6 dB.
- **The new board sounds:** no held A natural, and no loop-seam jump (`audio/sfx/qa/act4v5_board_qa.json`).
- **Effects per sequence:** S1 34 · S2 13 · S3 19 · S4 50 · S5 27 · S6 11 · S7 26 · S8 19.

## What a human must check

1. **The new sounds on their own.** Start with the ones most likely to be wrong: the crowd's hush and stir, the phone buzzes, the revolving door, the door bang, the extinguisher, the typing loop and the vault hum.
2. **The stems against picture and dialogue, where the effects are busiest:**
   - S4.02 to S4.08: the phones, the dial, the split
   - S5.09 to S5.11: Gerg's keys, the check, the slate door
   - S6: the tiles under the full band
   - S7.06 to S7.13: the bang, the freeze, the pin, the spray, the shatter
3. **The composer** confirms that the key ring's jangle on S4.13e sits on an offbeat, and that the chair walk-offs (on the word "stepped", from the lock) sit well against the waltz's F F F.
