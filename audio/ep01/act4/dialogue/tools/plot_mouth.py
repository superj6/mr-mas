"""plot_mouth.py - diagnostic strips for the mouth-cue method: waveform envelope, F0, word spans (Kokoro,
carried through every edit) vs ASR word onsets, and the 24 fps mouth lane coloured by shape.
Usage: plot_mouth.py out.png id [id ...]
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import soundfile as sf

import a4lib as L

REPO = "/home/jgon/project/art/mrmas"
ROOT = os.path.join(REPO, "audio/ep01/act4/dialogue")
COL = {"A": "#d9534f", "E": "#f0ad4e", "O": "#5bc0de", "M": "#333333", "rest": "#dddddd", "smile": "#9b59b6"}


def main():
    out, ids = sys.argv[1], sys.argv[2:]
    lines = {e["id"]: e for e in json.load(open(os.path.join(ROOT, "lines.json")))}
    fig, axes = plt.subplots(len(ids), 1, figsize=(12, 2.3 * len(ids)), squeeze=False)
    for ax, i in zip(axes[:, 0], ids):
        e = lines[i]
        y, sr = sf.read(os.path.join(REPO, e["file"]), dtype="float32")
        t = np.arange(len(y)) / sr
        env, hop = L.V._rms_frames(y, sr, 0.01)
        te = (np.arange(len(env)) + 0.5) * hop / sr
        ax.fill_between(te, 0, env / env.max(), color="#bbbbbb", lw=0)
        tf, f0, _ = L.f0_contour(y)
        ax2 = ax.twinx()
        ax2.plot(tf, f0, ".", ms=2, color="#2c7fb8")
        ax2.set_ylim(20, 320)
        ax2.set_ylabel("F0 Hz", fontsize=7)
        for w in e["words"]:
            ax.axvspan(w["t0"], w["t1"], ymin=0.86, ymax=0.97, color="#8fbc8f", alpha=0.6)
            ax.text(0.5 * (w["t0"] + w["t1"]), 1.08, w["w"], ha="center", fontsize=7)
        _, _, asr_ws = L.asr_words(os.path.join(REPO, e["file"]))
        for w in asr_ws:
            ax.axvline(w["t0"], ymin=0.75, ymax=0.86, color="#006d2c", lw=1)
        cues = e["mouth"]
        end = len(y) / sr
        for a, b in zip(cues, cues[1:] + [{"t": end, "shape": None}]):
            ax.axvspan(a["t"], b["t"], ymin=0.0, ymax=0.08, color=COL[a["shape"]])
            if b["t"] - a["t"] >= 0.08:
                ax.text(0.5 * (a["t"] + b["t"]), 0.045, a["shape"], ha="center", va="center", fontsize=6,
                        color="white" if a["shape"] in ("M", "A") else "black")
        for f in range(int(np.ceil(end * 24)) + 1):
            ax.axvline(f / 24, ymin=0.0, ymax=0.03, color="k", lw=0.3)
        ax.set_xlim(0, end)
        ax.set_ylim(0, 1.2)
        ax.set_yticks([])
        ax.set_title(f"{i}  {e['speaker']}: {e['text']}   take {e['take']}  {e['duration_s']:.2f}s  "
                     f"(green bars = Kokoro word spans, dark ticks = ASR word onsets, bottom = 24 fps mouth lane)", fontsize=8, loc="left")
    fig.tight_layout()
    fig.savefig(out, dpi=90)
    print("wrote", out)


if __name__ == "__main__":
    main()
