"""'FEEL THE AGI' gang chant (ALYI card): whispered "feel... the..." then a shouted "A-G-I!".

Intro clock (final.md cue sheet): FEEL f285, THE f292, A f300, G f303, I f307 (hit on Db at f300).
Files start at f280 (11.667 s) = 5 frames of pre-roll.

Group = 6 Kokoro-82M stock voices (3 male, 3 female incl. British), 2 passes each for the shout.
 whisper: WORLD re-synthesis with zero periodic excitation (a true whisper of the same words),
          wide stereo, a sub-octave whisper ghost for unease.
 shout:   per letter ("Ay!" "Gee!" "Eye!"), constant Rubber Band pitch lift into shouting range
          (tuned loosely to the Db hit: men toward Ab2/Db3, women toward Ab3/Db4), formant lift,
          presence boost, hard compression + saturation, tight +/-12 ms group spread.
 room:    synthetic stone-room IR (hard early reflections, 1.5 s), or cathedral (3.6 s), or dry.
"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
import pedalboard as pb
from vlib import *

START_F = 280
def at(frame):
    return (frame - START_F) / FPS

GROUP = [  # voice, gender, pan
    ('am_michael', 'm', -0.55), ('af_nicole', 'f', 0.6), ('am_fenrir', 'm', 0.25),
    ('af_sarah', 'f', -0.3), ('bm_george', 'm', 0.8), ('bf_emma', 'f', -0.8),
]
TARGET = {'m': [53, 56], 'f': [65, 68]}   # shout pitch, tuned into the Db hit: men F3/Ab3, women F4/Ab4 (~an octave over speech)

def hz2m(h):
    return 69 + 12 * np.log2(h / 440)

def med_f0(y):
    import pyworld as pw
    f0, t = pw.harvest(np.ascontiguousarray(y), SR, f0_floor=60, f0_ceil=500, frame_period=5)
    return float(np.median(f0[f0 > 0])) if (f0 > 0).any() else 150.0

def onset_of(y, rel_db=-25):
    e = 20 * np.log10(rms_env(y, 48) + 1e-9)
    return int(np.argmax(e > e.max() + rel_db)) * 48 / SR

def vowel_onset(y):
    import pyworld as pw
    f0, t = pw.harvest(np.ascontiguousarray(y), SR, f0_floor=60, f0_ceil=600, frame_period=2)
    v = np.where(f0 > 0)[0]
    return float(t[v[0]]) if len(v) else onset_of(y)

def fit_len(y, L):
    return stretch(y, L / (len(y) / SR)) if abs(L / (len(y) / SR) - 1) > 0.03 else y

# ---------------------------------------------------------------- whisper
def whisper_layer(rng):
    out = np.zeros((2, int(3.0 * SR)))
    for i, (v, g, p) in enumerate(GROUP):
        for word, frame, L in (('feel.', 285, 0.30), ('thee.', 292, 0.24)):
            y = trim(tts(word, v, 0.85), -45, 0.005, 0.04)
            y = fit_len(y, L + rng.uniform(-0.03, 0.04))
            w = whisperize(y, formant_shift=1.0 + rng.uniform(-0.03, 0.03))
            w = board_mono([pb.HighpassFilter(250), pb.PeakFilter(3500, 3.0, 0.8), pb.HighShelfFilter(9000, 2.0, 0.7)], w)
            w = fade(w / (np.sqrt(np.mean(w ** 2)) + 1e-9) * 0.05, 0.004, 0.06)
            t = at(frame) + rng.uniform(-0.028, 0.028)
            place(out, pan(w, p), t)
            if i in (0, 2):       # sub-octave ghost (formant-preserved pitch drop of the whisper's envelope)
                gh = stretch(w, 1.05, -7.0, formants=False)
                gh = board_mono([pb.LowpassFilter(2500)], gh)
                place(out, pan(gh * 0.45, -p * 0.5), t + 0.012)
    return out

# ---------------------------------------------------------------- shout
LETTERS = [('Ay!', 300, 0.125), ('Gee!', 303, 0.165), ('Eye!', 307, 0.36)]

def shout_layer(rng, tuned=True):
    out = np.zeros((2, int(3.0 * SR)))
    for i, (v, g, p) in enumerate(GROUP):
        for k in range(2):            # double each singer
            for li, (txt, frame, L) in enumerate(LETTERS):
                y = trim(tts(txt, v, 1.15), -42, 0.004, 0.03)
                last = li == 2
                L2 = L + (rng.uniform(0.02, 0.10) if last else rng.uniform(-0.01, 0.015))
                y = fit_len(y, L2 + 0.03)
                f = med_f0(y)
                if tuned:
                    tgt = TARGET[g][(i + k) % 2]
                    semis = float(np.clip(tgt - hz2m(f), 2.0, 7.0))
                else:
                    semis = 4.5 if g == 'm' else 3.0
                semis += rng.uniform(-0.3, 0.3) + (0.12 if k else 0)
                y = stretch(y, 1.0, semis, formants=True)
                y = formant_shift(y, 0.8 + rng.uniform(-0.2, 0.2))
                y = board_mono([pb.HighpassFilter(160), pb.LowShelfFilter(250, -2.5, 0.7), pb.PeakFilter(2400, 5.0, 0.9),
                                pb.PeakFilter(4200, 2.0, 1.2), pb.Compressor(threshold_db=-24, ratio=5, attack_ms=1.5, release_ms=60)], y)
                y = saturate(y, 9.0, 0.5)
                y = fade(y / (np.sqrt(np.mean(y ** 2)) + 1e-9) * 0.07, 0.002, 0.05 if not last else 0.14)
                # align the vowel onset (the perceived beat) to the frame
                vo = vowel_onset(y) if li == 1 else onset_of(y)
                t = at(frame) - vo + 0.012 + rng.uniform(-0.012, 0.012)
                gain = (1.0 if k == 0 else 0.7) * (1.12 if last else 1.0)
                place(out, pan(y * gain, np.clip(p + (0.2 if k else 0) * (-1) ** i, -1, 1)), t)
    return out

def build(room='stone_room', tuned=True, seed=7):
    rng = np.random.default_rng(seed)
    wh = whisper_layer(rng)
    sh = shout_layer(rng, tuned)
    rooms = {'stone_room': (0.42, 0.34), 'cathedral': (0.62, 0.48), 'dry': (0.0, 0.0)}
    ww, sw = rooms[room]
    def wet(x, w, rt_extra=0.0):
        if room == 'dry':
            return convolve(x, ir('booth'), wet=0.12)
        return convolve(x, ir(room), wet=w)
    wh_w = wet(wh, ww * 1.15)
    sh_w = wet(sh, sw)
    # eerie pre-swell: reversed room tail of the first whisper, leading into "feel" (stone/cathedral only)
    L = int((4.6 if room == 'cathedral' else 3.4) * SR)
    mix = np.zeros((2, L))
    place(mix, wh_w * 0.9, 0.0)
    place(mix, sh_w, 0.0)
    if room != 'dry':
        seg = wh[:, int(at(285) * SR):int((at(285) + 0.3) * SR)]
        tail = convolve(seg, ir(room), wet=1.0, dry=0.0)[:, :int(0.9 * SR)]
        rev = tail[:, ::-1] * np.linspace(0, 1, tail.shape[1]) ** 2
        rev = board([pb.HighpassFilter(400)], rev)
        start = at(285) + 0.02 - rev.shape[1] / SR
        place(mix, rev * 0.35, start)
    mix = board([pb.HighpassFilter(120), pb.Compressor(threshold_db=-20, ratio=2.0, attack_ms=10, release_ms=150)], mix)
    stems = dict(whisper=wet(wh, ww * 1.15), shout=wet(sh, sw))
    return fade(mix, 0.0, 0.4), stems

if __name__ == '__main__':
    stats = []
    mix, stems = build('stone_room')
    stats.append(export(mix, 'chant/feel-the-agi_stone-room_from-f280'))
    for k, s in stems.items():
        s = fade(s[:, :int(3.4 * SR)], 0, 0.4)
        stats.append(export(s, f'chant/feel-the-agi_stone-room_STEM-{k}_from-f280'))
    mix, _ = build('cathedral')
    stats.append(export(mix, 'chant/feel-the-agi_cathedral_from-f280'))
    mix, _ = build('dry')
    stats.append(export(mix, 'chant/feel-the-agi_dry_from-f280'))
    mix, _ = build('stone_room', tuned=False, seed=11)
    stats.append(export(mix, 'chant/feel-the-agi_stone-room_untuned-alt_from-f280'))
