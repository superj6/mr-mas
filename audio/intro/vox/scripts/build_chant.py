"""CHANT stem: the ALYI card's gang chant, "feel... the... A-G-I!" (SCRIPT v2.1 §3.5b, §4 D5).

v2.1 placement (the vocal pass rendered the v2.0 cue, THE at f292; v2.1 moves it to the swung "and"):
  whisper  "feel..."  f285 (5.4)            close-mic, panned wide, 6 voices, no leader
  whisper  "...the..." f295 (5.4 + 10, the swung "and")
  shout    "A-!"  f300.00 (6.1, the Db hit)  straight 16ths inside the swing, locked:
  shout    "G-!"  f303.75 (inside frame 303)
  shout    "I!"   f307.50 (inside frame 307)
  The same 6 voices at full voice, dry (the room freezes at f300), together on every letter, no single voice on top.
Voices: Kokoro-82M stock voices am_michael, af_nicole, am_fenrir, af_sarah, bm_george, bf_emma (no cloning,
no accent play: each speaks in its stock voice). Whisper = WORLD re-synthesis with no periodic excitation.
Shout = per-letter "Ay!" "Gee!" "Eye!", Rubber Band lift into shouting range, loosely tuned into the Db hit
(men Ab3, women Db4, +/-35 cents crowd scatter; WORLD keeps 45 % of each spoken contour), formant lift,
presence, hard compression + drive, -4/+14 ms group spread (no one ahead of the frame), each singer doubled at -3 dB.
Differences from audio/intro/vocals/chant (v2.0): THE moved f292 -> f295 and shortened so it clears the hit;
G and I moved onto the exact straight-16th grid; the reversed-whisper pre-swell and the sub-octave
"ghost" whisper are dropped (horror-trailer tropes; the harmonium swell owns f285-299); the shout is dry.
"""
import os, sys, json
sys.path.insert(0, os.path.dirname(__file__))
from ivlib import *
import pedalboard as pb
import chant as vc                 # the vocal pass's chant helpers (read-only import)
use_cache(vc)

GROUP = vc.GROUP                   # (voice, gender, pan)
WHISPER = [('feel.', 285.0, 0.36), ('thee.', 295.0, 0.155)]
SEMIS = []
PITCH = []                         # (gender, letter, median MIDI after tuning)
LETTERS = [('Ay!', 300.0, 0.135), ('Gee!', 303.75, 0.15), ('Eye!', 307.5, 0.34)]
TUNE = {'m': 56, 'f': 61}          # Ab3 / Db4: the Db chord's fifth and root, whose low harmonics (Ab Eb C / Db Ab F)
                                   # are all tones of Dbmaj9(#11). Tuning to F put its 5th harmonic, A natural, on top.


def whisper_layer(rng):
    out = np.zeros((2, N30))
    for i, (v, g, p) in enumerate(GROUP):
        p_w = np.clip(p * 1.35, -0.95, 0.95)          # wide
        for word, frame, L in WHISPER:
            y = trim(tts(word, v, 0.85), -45, 0.005, 0.04)
            y = vc.fit_len(y, L + rng.uniform(-0.02, 0.025))
            w = whisperize(y, formant_shift=1.0 + rng.uniform(-0.035, 0.035))      # 'detuned' layers
            w = board_mono([pb.HighpassFilter(250), pb.PeakFilter(3500, 3.0, 0.8), pb.HighShelfFilter(9000, 2.0, 0.7)], w)
            w = fade(w / (np.sqrt(np.mean(w ** 2)) + 1e-9) * 0.05, 0.004, 0.05)
            # the whisper's audible onset lands on the frame (fricative /f/ and /th/ start the word)
            t = fs(frame) - vc.onset_of(w) + rng.uniform(-0.02, 0.02)
            place(out, pan(w, p_w), t)
    return out


def shout_layer(rng):
    out = np.zeros((2, N30))
    onsets = {l[0]: [] for l in LETTERS}
    for i, (v, g, p) in enumerate(GROUP):
        for k in range(2):                              # each singer doubled
            for li, (txt, frame, L) in enumerate(LETTERS):
                y = trim(tts(txt, v, 1.15), -42, 0.004, 0.03)
                last = li == 2
                L2 = L + (rng.uniform(0.02, 0.08) if last else rng.uniform(-0.01, 0.01))
                y = vc.fit_len(y, L2 + 0.03)
                f = vc.med_f0(y)
                semis = float(np.clip(TUNE[g] + rng.uniform(-0.35, 0.35) - vc.hz2m(f), 1.0, 9.5)) + (0.1 if k else 0.0)
                SEMIS.append(round(semis, 2))
                y = stretch(y, 1.0, semis, formants=True)
                # keep 45 % of the spoken contour: still a shout, but it no longer sweeps through E / Gb / A
                y = level_word(y, strength=0.55, settle_st=-1.5 if last else -0.8, ramp=0.02)
                PITCH.append((g, txt, round(float(vc.hz2m(vc.med_f0(y))), 2)))
                y = formant_shift(y, 0.8 + rng.uniform(-0.2, 0.2))
                y = board_mono([pb.HighpassFilter(160), pb.LowShelfFilter(250, -2.5, 0.7), pb.PeakFilter(2400, 5.0, 0.9),
                                pb.PeakFilter(4200, 2.0, 1.2),
                                pb.Compressor(threshold_db=-24, ratio=5, attack_ms=1.5, release_ms=60)], y)
                y = saturate(y, 9.0, 0.5)
                y = fade(y / (np.sqrt(np.mean(y ** 2)) + 1e-9) * 0.07, 0.002, 0.05 if not last else 0.14)
                # the perceived beat: vowel onset for "Gee" (after the /dZ/), energy onset for the vowel-initial letters
                vo = vc.vowel_onset(y) if li == 1 else vc.onset_of(y)
                dt = rng.uniform(-0.004, 0.014)             # group spread: nobody lands ahead of the picture's f300 pop
                t = fs(frame) - vo + dt
                onsets[txt].append(round(dt * 1000, 1))
                gain = 1.0 if k == 0 else 0.708          # double at -3 dB; every singer equal: no leader
                place(out, pan(y * gain, np.clip(p + (0.2 if k else 0) * (-1) ** i, -1, 1)), t)
    return out, onsets


def build(seed=7):
    rng = np.random.default_rng(seed)
    wh = whisper_layer(rng)
    sh, spread = shout_layer(rng)
    # rooms: whisper close (booth + a sliver of the stone room); shout dry (booth only)
    wh = convolve(wh, ir('booth'), wet=0.14)[:, :N30] + 0.0
    wh = wh + convolve(wh, ir('stone_room'), wet=0.07, dry=0.0)[:, :N30]
    sh = convolve(sh, ir('booth'), wet=0.10)[:, :N30]
    bus = lambda x: board([pb.HighpassFilter(120), pb.Compressor(threshold_db=-20, ratio=2.0, attack_ms=10, release_ms=150)], x)
    wh, sh = bus(wh), bus(sh)
    # hard guarantees: the whisper is gone before the hit's attack, nothing before f284
    g = np.ones(N30)
    a, b = int(fs(299.6) * SR), int(fs(300.1) * SR)
    g[a:b] = np.cos(np.linspace(0, np.pi / 2, b - a)) ** 2; g[b:] = 0.0
    wh = wh * g
    pre = int(fs(284.2) * SR); wh[:, :pre] = 0.0; sh[:, :int(fs(299.4) * SR)] = 0.0
    return wh, sh, spread


if __name__ == '__main__':
    wh, sh, spread = build()
    save_build(wh, 'chant_whisper_raw')
    save_build(sh, 'chant_shout_raw')
    print('shout pitch lifts (st):', sorted(SEMIS))
    PCN = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
    import collections
    print('shout median pitch classes:', collections.Counter(PCN[int(round(m)) % 12] for _, _, m in PITCH).most_common())
    print('shout median pitches (MIDI):', sorted(m for _, _, m in PITCH))
    json.dump(dict(group_spread_ms=spread, shout_lift_semitones=SEMIS, shout_median_midi=PITCH), open(os.path.join(BUILD, 'chant_meta.json'), 'w'), indent=1)
    for n, x in (('whisper', wh), ('shout', sh)):
        print(stats(x, n), audible_span(x, -60))
