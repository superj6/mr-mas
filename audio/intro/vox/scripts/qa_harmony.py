"""Pitch-class check (CQT chroma, the vocal pass's method) over a frame window of a 30 s stem."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from ivlib import *
import librosa
PC = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']


def pcs(y, f0_, f1_):
    m = to_st(y).mean(0)[int(fs(f0_) * SR):int(fs(f1_) * SR)]
    x = soxr.resample(m, SR, 22050)
    # 3 bins per semitone, centre bin only (a 12-bin CQT smears Bb+C into B, Bb into A, and so on)
    C = np.abs(librosa.cqt(x, sr=22050, hop_length=256, fmin=librosa.note_to_hz('C2') * 2 ** (-1 / 36),
                           n_bins=216, bins_per_octave=36, filter_scale=1.0))
    p = (C ** 2).mean(1).reshape(6, 12, 3)[:, :, 1].sum(0)
    p = 10 * np.log10(p / p.max() + 1e-12)
    return {PC[i]: round(float(p[i]), 1) for i in np.argsort(-p)}


if __name__ == '__main__':
    path, a, b = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
    y, _ = sf.read(path)
    print(os.path.basename(path), f'f{a}-{b}', pcs(y.T, a, b))
