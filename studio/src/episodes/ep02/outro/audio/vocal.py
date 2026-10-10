"""E02-14's paused voice: the title's wordless vocal pad sings the knee's flat line (F F F F, swung) and stops before the
leap. The intro's PAD recipe (audio/intro/vox/scripts/build_pad.py: four parts on "oo", each double-tracked, the
singer audio/intro/vocals/scripts/sing.py + harmony.py, imported read-only) with the top part moved from E-flat4 to the
melody's F4: F3 - B-flat3 - C4 - F4, no third. Kokoro-82M stock voices re-sung through WORLD; no recording of anyone.

The vocal pass's Kokoro cache is only READ (copied into <scratch>/tts_cache when a syllable is there, so the singers are
the title pad's own renders); anything new renders into the scratch folder. Nothing is written under audio/.
  PYTHONDONTWRITEBYTECODE=1 HF_HUB_OFFLINE=1 bash ops/heavy.sh audio/.venv-vocals/bin/python \
      studio/src/episodes/ep02/outro/audio/vocal.py "$SC"          -> $SC/music/vocal-pad.wav (+ vocal-pad.json)
"""
import hashlib
import json
import os
import shutil
import sys

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '../../../../../..'))
VOC = os.path.join(REPO, 'audio/intro/vocals/scripts')
sys.path.insert(0, VOC)
SC = os.path.abspath(sys.argv[1])
OUT = os.path.join(SC, 'music')
os.makedirs(OUT, exist_ok=True)

import vlib                                       # noqa: E402  (read-only import; its cache is pointed at scratch)
vlib.WORK = os.path.join(SC, 'vocal-work')
import numpy as np                                # noqa: E402
import pedalboard as pb                           # noqa: E402
import harmony as hm                              # noqa: E402
import sing                                       # noqa: E402

SR, FPS = vlib.SR, vlib.FPS
BEAT = 60.0 / 96
NOTES = ['F3', 'Bb3', 'C4', 'F4']                 # the title PAD's F3 Bb3 C4, the flat line's F4 on top: no third
SWING_OFF = 2.0 / 3.0                             # house swing 1.0: an eighth's off-beat on +10 of 15 frames
BAR2 = 4 * BEAT                                   # o60, 2.500 s
ON = [BAR2, BAR2 + SWING_OFF * BEAT, BAR2 + BEAT, BAR2 + BEAT + SWING_OFF * BEAT]
STOP = BAR2 + 2 * BEAT - 0.035                    # the voice is out just before 2.3 (o90), where the celesta takes G
TOTAL_S = 360 / FPS                               # the outro file, 15.000 s


def seed():
    """copy the title pad's own syllable renders from the vocal pass's cache (read), so the singers are the same"""
    dst = os.path.join(vlib.WORK, 'tts_cache')
    os.makedirs(dst, exist_ok=True)
    n = 0
    for part in hm.ROSTER.values():
        for v in part:
            k = hashlib.md5(f"{sing.SYL_TEXT['ooh']}|{v}|0.72".encode()).hexdigest() + '.wav'
            for base in (os.path.join(REPO, 'audio/intro/vocals/_work/tts_cache'), os.path.join(REPO, 'audio/intro/vox/_work/tts_cache')):
                if os.path.exists(os.path.join(base, k)) and not os.path.exists(os.path.join(dst, k)):
                    shutil.copy2(os.path.join(base, k), os.path.join(dst, k))
                    n += 1
                    break
    return n


def build():
    seeded = seed()
    out = np.zeros((2, int(TOTAL_S * SR)))
    for i, t in enumerate(ON):
        end = ON[i + 1] if i + 1 < len(ON) else STOP
        dur = end - t - (0.02 if i + 1 < len(ON) else 0.0)
        last = i == len(ON) - 1
        x = hm.ensemble(NOTES, 'ooh', dur, per_part=2, dbl_gain_db=-6, time_spread=0.008, detune=3.5, width=0.7,
                        seed=40 + i, gains=[1.1, 0.9, 0.85, 0.95],
                        att=0.035, rel=0.05 if last else 0.07, consonant=False, swell=0.05, breath=0.10,
                        vib_cents=6, vib_rate=5.2, vib_delay=0.25, vib_rise=0.3,
                        scoop_cents=-12, scoop_ms=45, jitter_cents=3, drift_cents=3,
                        accent=[0.35, 0.15, 0.3, 0.15][i])
        vlib.place(out, x, t)
    # build_pad.py's treatment: the "oo" second formant sits on F3's 5th harmonic (A5): a narrow dip, then the bus
    out = vlib.board([pb.PeakFilter(880, -3.0, 6.0)], out)
    out = hm.vocal_bus(out, lo_cut=100, air=1.0, warmth=0.5, comp=(-24, 1.8))
    out = vlib.convolve(out, vlib.ir('plate'), wet=0.20)[:, :int(TOTAL_S * SR)]
    # the voice stops: a 30 ms fade at the stop, the plate's tail let ring 0.4 s into the leap, then gone
    g = np.ones(out.shape[1])
    a, b = int(STOP * SR), int((STOP + 0.03) * SR)
    g[:int((ON[0] - 0.03) * SR)] = 0.0
    tail = out[:, b:].copy()
    out[:, a:b] *= np.linspace(1, 0.25, b - a)[None]
    k = int(0.4 * SR)
    env = np.zeros(out.shape[1] - b)
    env[:k] = 0.25 * np.cos(np.linspace(0, np.pi / 2, k)) ** 2
    out[:, b:] = tail * env[None]
    out *= g[None]
    out /= np.max(np.abs(out)) + 1e-12
    out *= 10 ** (-6 / 20)
    import soundfile as sf
    sf.write(os.path.join(OUT, 'vocal-pad.wav'), out.T.astype(np.float32), SR, subtype='FLOAT')
    rep = dict(notes=NOTES, onsets_s=[round(t, 4) for t in ON], onsets_outro_frames=[round(t * FPS, 2) for t in ON],
               stop_s=round(STOP, 4), stop_frame=round(STOP * FPS, 2), seeded_from_vocal_cache=seeded,
               recipe='build_pad.py (the title PAD): 4 parts x 2 on "ooh", Kokoro-82M stock voices re-sung through WORLD, '
                      '-3 dB @880 Hz, the vocal bus, plate 20 %; the top part on F4 (the flat line), each note its own attack',
               peak_dbfs=-6.0)
    json.dump(rep, open(os.path.join(OUT, 'vocal-pad.json'), 'w'), indent=1)
    print(json.dumps(rep, indent=1))


if __name__ == '__main__':
    build()
