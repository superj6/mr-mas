"""UTMOS22-strong naturalness predictor (SpeechMOS v1.2.0, tarepan; MIT weights from sarulab-speech/UTMOS22), scored on
equal padding as in voice-diagnosis-v4 §1. A proxy trained on isolated read sentences: it doesn't hear acting, timing
between speakers or casting. Compare scores only on the same words.

The model loads through torch.hub into $MOS_TORCH_HOME (default ~/.cache/torch; ~400 MB checkpoint, fetched on first
use from github.com/tarepan/SpeechMOS). torchaudio is not in the casting venv: shim/ supplies the one function UTMOS
needs (functional.resample)."""
import os, sys, warnings
warnings.filterwarnings("ignore")
HERE = os.path.dirname(os.path.abspath(__file__))
os.environ["TORCH_HOME"] = os.environ.get("MOS_TORCH_HOME", os.path.expanduser("~/.cache/torch"))
sys.path.insert(0, os.path.join(HERE, "shim"))
import numpy as np, torch
from scipy.signal import resample_poly
_m = None


def model():
    global _m
    if _m is None:
        local = os.path.join(os.environ["TORCH_HOME"], "hub", "tarepan_SpeechMOS_v1.2.0")
        _m = (torch.hub.load(local, "utmos22_strong", source="local", trust_repo=True) if os.path.isdir(local)
              else torch.hub.load("tarepan/SpeechMOS:v1.2.0", "utmos22_strong", trust_repo=True))
    return _m


def _rms_db(y, sr, win):
    n = int(sr * win); m = len(y) // n
    e = np.sqrt(np.mean(y[: m * n].reshape(m, n) ** 2, axis=1) + 1e-12)
    return 20 * np.log10(e / e.max())


def equal_pad(y, sr):
    d = _rms_db(y, sr, 0.01)
    idx = np.where(d > -45)[0]
    s = max(0, idx[0] * int(0.01 * sr) - int(0.03 * sr)); e = min(len(y), (idx[-1] + 1) * int(0.01 * sr) + int(0.06 * sr))
    z = y[s:e].copy(); f = int(0.005 * sr); z[:f] *= np.linspace(0, 1, f); z[-f:] *= np.linspace(1, 0, f)
    pad = np.zeros(int(0.15 * sr), np.float32)
    return np.concatenate([pad, z.astype(np.float32), pad])


def utmos(y, sr, eq=True):
    if y.ndim > 1: y = y.mean(1)
    if eq: y = equal_pad(y, sr)
    y16 = resample_poly(y, 1, 3).astype(np.float32) if sr == 48000 else y
    with torch.no_grad():
        return float(model()(torch.from_numpy(y16)[None], 16000)[0])


if __name__ == "__main__":
    import soundfile as sf
    for p in sys.argv[1:]:
        y, sr = sf.read(p, dtype="float32"); print(round(utmos(y, sr), 3), p)
