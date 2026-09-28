# MR. MAS: the final CLOD insert's preview, its temp sound (dev only): the act's EL-timed bed with the lock's takes laid
# at their lock frames, for a window of the act. Not the episode's mix (no ducking, no rooms on the voices); it is there
# so the nod can be checked against the take. Blender's bundled Python (numpy; 48 kHz WAVs).
#   $PY preview_mix.py --lock <lock.json> --bed audio/reel/ep01-v35-el/act1-bed.wav --from 9996 --to 10320 --out mix.wav
import os
import sys
import json
import wave
import numpy as np

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '..', '..'))
a = sys.argv[1:]
A = {a[i].lstrip('-'): a[i + 1] for i in range(0, len(a) - 1, 2)}
F0, F1, SR = int(A['from']), int(A['to']), 48000


def load(path):
    w = wave.open(path)
    sr, sw, ch, n = w.getframerate(), w.getsampwidth(), w.getnchannels(), w.getnframes()
    if sr != SR:
        raise SystemExit(f'{path}: {sr} Hz')
    raw = w.readframes(n)
    if sw == 3:
        b = np.frombuffer(raw, np.uint8).reshape(-1, 3).astype(np.int32)
        x = b[:, 0] | (b[:, 1] << 8) | (b[:, 2] << 16)
        x = np.where(x >= 1 << 23, x - (1 << 24), x) / float(1 << 23)
    else:
        x = np.frombuffer(raw, '<i2') / 32768.0
    x = x.reshape(-1, ch).astype(np.float32)
    return np.repeat(x, 2, axis=1) if ch == 1 else x[:, :2]


n = (F1 - F0) * SR // 24
bed = load(os.path.join(REPO, A['bed']))
out = np.zeros((n, 2), np.float32)
seg = bed[F0 * SR // 24:F0 * SR // 24 + n]
out[:len(seg)] += seg * 0.7
lock = json.load(open(A['lock']))
laid = []
for l in lock['lines']:
    if not l.get('file') or l['file_out'] <= F0 or l['file_in'] >= F1:
        continue
    t = load(os.path.join(REPO, l['file'])) * 0.708                     # -3 dB (the manifest's dialogueGain)
    at = (l['file_in'] - F0) * SR // 24
    s0, d0 = max(0, -at), max(0, at)
    m = min(len(t) - s0, n - d0)
    if m > 0:
        out[d0:d0 + m] += t[s0:s0 + m]
        laid.append(f"{l['id']} ({l['who']}) at {l['file_in']}")
out = np.tanh(out * 1.1) / np.tanh(1.1)
w = wave.open(A['out'], 'wb')
w.setnchannels(2)
w.setsampwidth(2)
w.setframerate(SR)
w.writeframes((np.clip(out, -1, 1) * 32767).astype('<i2').tobytes())
w.close()
print('wrote', A['out'], f'{n / SR:.2f} s;', 'takes:', ', '.join(laid))
