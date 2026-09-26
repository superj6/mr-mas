import torch
from math import gcd
from scipy.signal import resample_poly
def resample(wave, orig_freq, new_freq, **kw):
    if int(orig_freq) == int(new_freq):
        return wave
    g = gcd(int(orig_freq), int(new_freq))
    y = resample_poly(wave.detach().cpu().numpy(), int(new_freq) // g, int(orig_freq) // g, axis=-1)
    return torch.from_numpy(y.astype("float32"))
