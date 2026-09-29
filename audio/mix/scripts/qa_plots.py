"""QA sheet per variation: short-term loudness of each layer + master spectrogram with cue markers,
and an onset check on the new roll-call bar (music-only master)."""
import os  # noqa: E402  (phase 1: the project root is found at run time, docs/ORGANIZATION-PLAN.md §4)
import sys  # noqa: E402


def _repo():
    for start in (os.path.dirname(os.path.abspath(__file__)), os.getcwd()):
        d = start
        while True:
            if os.path.exists(os.path.join(d, '.mrmas-root')):
                return d
            if d == os.path.dirname(d):
                break
            d = os.path.dirname(d)
    sys.exit('MR. MAS: no .mrmas-root above this script or the cwd; set MRMAS_ROOT')


REPO = os.environ.get('MRMAS_ROOT') or _repo()
import json
import sys

import numpy as np
import soundfile as sf
from scipy import signal
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

MIX = os.path.join(REPO, 'audio/mix')
SR, SPF = 48000, 2000
PARTS = ['master', 'music', 'sfx', 'vo', 'chant', 'choir']
COL = dict(master='#222222', music='#3b6fb6', sfx='#d08a2e', vo='#c0392b', chant='#7d3c98', choir='#2e8b57')
MARK = [0, 24, 60, 105, 120, 150, 165, 180, 225, 240, 285, 300, 345, 360, 405, 420, 435, 465, 480, 540, 600, 622,
        630, 690, 705, 719]
NAMES = {'V1': 'V1-chipchamber', 'V2': 'V2-orchestralnoir', 'V3': 'V3-pixelswing', 'V4': 'V4-pianopixels'}
KB = [(np.array([1.53512485958697, -2.69169618940638, 1.19839281085285]),
       np.array([1.0, -1.69065929318241, 0.73248077421585])),
      (np.array([1.0, -2.0, 1.0]), np.array([1.0, -1.99004745483398, 0.99007225036621]))]


def st_loud(x, win=0.4, hop=0.05):
    for b, a in KB:
        x = signal.lfilter(b, a, x, axis=-1)
    p = np.sum(x ** 2, axis=0)
    W, H = int(win * SR), int(hop * SR)
    c = np.concatenate([[0], np.cumsum(p)])
    idx = np.arange(0, len(p) - W, H)
    e = (c[idx + W] - c[idx]) / W
    return (idx + W / 2) / SPF, -0.691 + 10 * np.log10(e + 1e-12)


def onset_frames(x, a_f, b_f):
    m = x.mean(0)[int(a_f * SPF):int(b_f * SPF)]
    f, t, Z = signal.stft(m, SR, nperseg=1024, noverlap=1024 - 128)
    S = np.log1p(np.abs(Z) * 100)
    flux = np.maximum(0, np.diff(S, axis=1)).sum(0)
    flux = flux / (flux.max() + 1e-9)
    pk, _ = signal.find_peaks(flux, height=0.25, distance=int(0.12 * SR / 128))
    return [round(a_f + t[i + 1] * 24 - 1024 / 2 / SR * 24, 1) for i in pk]


def sheet(v):
    P = np.load(f'{MIX}/cache/{v}_parts.npy').astype(np.float32)
    fig, ax = plt.subplots(2, 1, figsize=(18, 9), sharex=True, gridspec_kw=dict(height_ratios=[1.2, 1]))
    for i, name in enumerate(PARTS):
        if np.abs(P[i]).max() < 1e-5:
            continue
        t, L = st_loud(P[i].astype(np.float64))
        L[L < -60] = np.nan
        ax[0].plot(t, L, color=COL[name], lw=2.2 if name == 'master' else 1.3, label=name)
    ax[0].set_ylim(-50, -5)
    ax[0].set_ylabel('short-term loudness (LUFS, 400 ms)')
    ax[0].legend(loc='lower right', ncol=6)
    ax[0].grid(alpha=0.3)
    m = P[0].mean(0)
    f, t, Z = signal.stft(m, SR, nperseg=2048, noverlap=2048 - 480)
    S = 20 * np.log10(np.abs(Z) + 1e-7)
    ax[1].pcolormesh(t * 24, f, S, shading='auto', vmin=-100, vmax=-20, cmap='magma')
    ax[1].set_yscale('symlog', linthresh=200)
    ax[1].set_ylim(30, 16000)
    ax[1].set_ylabel('Hz')
    ax[1].set_xlabel('frame (24 fps)')
    for a in ax:
        for fr in MARK:
            a.axvline(fr, color='#888888', lw=0.6, alpha=0.6)
        for k in range(13):
            a.axvline(k * 60, color='#444444', lw=1.0, alpha=0.5)
    ax[1].set_xticks(MARK)
    ax[1].tick_params(axis='x', labelsize=7)
    ax[0].set_title(f'intro-sketch-{v}: layer loudness + master spectrogram (bar lines every 60 frames)')
    plt.tight_layout()
    plt.savefig(f'{MIX}/qa/{v}_sheet.png', dpi=80)
    plt.close()
    mus, _ = sf.read(f'{MIX}/music/theme-{NAMES[v]}-rollcall.wav', always_2d=True)
    return onset_frames(mus.T, 474, 546)


if __name__ == '__main__':
    out = {}
    for v in sys.argv[1:]:
        out[v] = dict(rollcall_onsets_frames=sheet(v), expected=[480 + 7.5 * i for i in range(8)] + [540])
        print(v, out[v])
    json.dump(out, open(f'{MIX}/qa/rollcall_onsets.json', 'w'), indent=1)
