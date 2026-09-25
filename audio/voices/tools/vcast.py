"""vcast.py - MR. MAS voice-casting toolkit (stock-voice TTS + conservative shaping + QA).

Model: Kokoro-82M (Apache-2.0), American-English stock voice packs only, optionally
blended (weighted average of stock packs). No reference audio of any real person is
ever loaded, so nothing here can clone a voice.

Pipeline per line: synth (24 kHz) -> optional carrier-cut for very short lines ->
trim -> upsample to 48 kHz -> FX chain (pedalboard + a few numpy effects) ->
tail/head trim -> loudness normalise to -16 LUFS with a -1.5 dBTP ceiling.
"""
from __future__ import annotations

import os
import subprocess
import warnings

warnings.filterwarnings("ignore")

import numpy as np
import soundfile as sf
import pyloudnorm as pyln
from scipy.signal import resample_poly
import pedalboard as pb

SR_TTS = 24000
SR = 48000
TARGET_LUFS = -16.0
TP_CEIL = -1.5  # dBTP ceiling (4x oversampled estimate)

FFMPEG_DIR = "/home/jgon/project/art/mrmas/studio/node_modules/@remotion/compositor-linux-x64-gnu"
FFMPEG = os.path.join(FFMPEG_DIR, "ffmpeg")

_pipe = None


def pipeline():
    global _pipe
    if _pipe is None:
        from kokoro import KPipeline
        _pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
    return _pipe


def voice_pack(blend: dict):
    """blend = {'am_michael': 0.7, 'am_puck': 0.3} -> weighted average of stock packs."""
    p = pipeline()
    tot = sum(blend.values())
    pack = None
    for name, w in blend.items():
        v = p.load_single_voice(name) * (w / tot)
        pack = v if pack is None else pack + v
    return pack


def voice_id(blend: dict) -> str:
    if len(blend) == 1:
        return next(iter(blend))
    tot = sum(blend.values())
    return "+".join(f"{k}*{v / tot:.2f}" for k, v in blend.items())


# ----------------------------------------------------------------------------- synth

def _synth_raw(text, pack, speed):
    p = pipeline()
    audio, toks = [], []
    t0 = 0.0
    for r in p(text, voice=pack, speed=speed):
        a = r.audio.numpy().astype(np.float32)
        for tk in (r.tokens or []):
            toks.append((tk.text, (tk.start_ts or 0) + t0, (tk.end_ts or 0) + t0))
        audio.append(a)
        t0 += len(a) / SR_TTS
    return np.concatenate(audio), toks


def _rms_frames(y, sr, win=0.01):
    n = max(1, int(sr * win))
    m = len(y) // n
    if m == 0:
        return np.array([np.sqrt(np.mean(y ** 2) + 1e-12)]), n
    fr = y[: m * n].reshape(m, n)
    return np.sqrt(np.mean(fr ** 2, axis=1) + 1e-12), n


def synth(text, blend, speed, carrier=None):
    """Return mono float32 @24 kHz. With a carrier the line is spoken after a neutral
    lead-in (Kokoro is weak on <10-20 token utterances) and cut out at the quietest
    10 ms frame inside the pause before the first target word."""
    pack = voice_pack(blend)
    if not carrier:
        y, _ = _synth_raw(text, pack, speed)
        return y
    y, toks = _synth_raw(f"{carrier} {text}", pack, speed)
    n_carrier_words = len([w for w in carrier.replace(".", " ").replace(",", " ").split() if w])
    words = [t for t in toks if any(c.isalnum() for c in t[0])]
    first = words[n_carrier_words]
    prev_end = words[n_carrier_words - 1][2]
    lo, hi = prev_end, first[1] + 0.02
    env, hop = _rms_frames(y, SR_TTS)
    a, b = int(lo * SR_TTS / hop), max(int(lo * SR_TTS / hop) + 1, int(hi * SR_TTS / hop))
    k = a + int(np.argmin(env[a:b]))
    cut = k * hop
    out = y[cut:].copy()
    f = int(0.004 * SR_TTS)
    out[:f] *= np.linspace(0, 1, f)
    return out


def trim(y, sr, thresh_db=-50.0, head_pad=0.03, tail_pad=0.06):
    """Trim silence relative to the clip peak using a 10 ms RMS envelope."""
    env, hop = _rms_frames(y, sr)
    ref = env.max()
    idx = np.where(20 * np.log10(env / ref) > thresh_db)[0]
    if len(idx) == 0:
        return y
    s = max(0, idx[0] * hop - int(head_pad * sr))
    e = min(len(y), (idx[-1] + 1) * hop + int(tail_pad * sr))
    out = y[s:e].copy()
    fi, fo = int(0.004 * sr), int(0.03 * sr)
    out[:fi] *= np.linspace(0, 1, fi)
    out[-fo:] *= np.linspace(1, 0, fo)
    return out


# ----------------------------------------------------------------------------- FX

def _sat(y, drive=2.0, mix=0.2):
    wet = np.tanh(drive * y) / np.tanh(drive)
    return (1 - mix) * y + mix * wet


def _ringmod(y, sr, hz, mix):
    t = np.arange(len(y)) / sr
    return (1 - mix) * y + mix * y * np.sin(2 * np.pi * hz * t)


def _comb(y, sr, ms, fb, mix):
    d = max(1, int(sr * ms / 1000))
    out = y.copy()
    # feedback comb, block-vectorised by delay length
    for i in range(d, len(out), d):
        j = min(i + d, len(out))
        out[i:j] += fb * out[i - d:j - d]
    out = out / (1 + fb)
    return (1 - mix) * y + mix * out


def _board(fx, sr):
    return pb.Pedalboard(fx)


def apply_chain(y, sr, chain):
    """chain: list of dicts {'fx': name, ...}. Returns processed float32 mono."""
    x = y.astype(np.float32)
    for st in chain:
        k = st["fx"]
        if k == "hpf":
            x = pb.HighpassFilter(st["hz"])(x, sr)
        elif k == "lpf":
            x = pb.LowpassFilter(st["hz"])(x, sr)
        elif k == "lowshelf":
            x = pb.LowShelfFilter(st["hz"], st["db"], st.get("q", 0.707))(x, sr)
        elif k == "highshelf":
            x = pb.HighShelfFilter(st["hz"], st["db"], st.get("q", 0.707))(x, sr)
        elif k == "peak":
            x = pb.PeakFilter(st["hz"], st["db"], st.get("q", 1.0))(x, sr)
        elif k == "pitch":
            if st["st"]:
                x = pb.PitchShift(semitones=st["st"])(x, sr)
        elif k == "comp":
            x = pb.Compressor(st["th"], st["ratio"], st.get("att", 5), st.get("rel", 100))(x, sr)
            x = x * (10 ** (st.get("makeup", 0) / 20))
        elif k == "sat":
            pk = np.max(np.abs(x)) + 1e-9
            x = _sat(x / pk, st.get("drive", 2.0), st.get("mix", 0.2)) * pk
        elif k == "reverb":
            # parallel send with pre-delay so the dry voice stays intelligible
            wet = x
            if st.get("predelay_ms", 0):
                wet = pb.Delay(st["predelay_ms"] / 1000, 0.0, 1.0)(wet, sr)
            if st.get("send_hpf"):
                wet = pb.HighpassFilter(st["send_hpf"])(wet, sr)
            wet = pb.Reverb(room_size=st.get("room", 0.3), damping=st.get("damp", 0.5),
                            wet_level=1.0, dry_level=0.0, width=st.get("width", 0.5))(wet, sr)
            if wet.ndim > 1:
                wet = wet.mean(axis=0)
            x = x + st["wet"] * wet[: len(x)]
        elif k == "slap":
            wet = pb.Delay(st["ms"] / 1000, st.get("fb", 0.0), 1.0)(x, sr)
            if st.get("lpf"):
                wet = pb.LowpassFilter(st["lpf"])(wet, sr)
            x = x + st["mix"] * wet
        elif k == "chorus":
            x = pb.Chorus(st.get("rate", 0.8), st.get("depth", 0.15), st.get("delay_ms", 7.0),
                          st.get("fb", 0.0), st.get("mix", 0.2))(x, sr)
        elif k == "bitcrush":
            wet = pb.Bitcrush(st["bits"])(x, sr)
            x = (1 - st["mix"]) * x + st["mix"] * wet
        elif k == "ringmod":
            x = _ringmod(x, sr, st["hz"], st["mix"])
        elif k == "comb":
            x = _comb(x, sr, st["ms"], st["fb"], st["mix"])
        elif k == "harmony":
            h = pb.PitchShift(semitones=st["st"])(x, sr)
            x = x + (10 ** (st["db"] / 20)) * h
        elif k == "band":  # phone / PA band-limit in parallel
            b = pb.Pedalboard([pb.HighpassFilter(st["lo"]), pb.LowpassFilter(st["hi"])])(x, sr)
            b = _sat(b / (np.max(np.abs(b)) + 1e-9), st.get("drive", 1.5), 1.0) * np.max(np.abs(b))
            x = (1 - st["mix"]) * x + st["mix"] * b
        else:
            raise ValueError(k)
        x = np.asarray(x, dtype=np.float32).reshape(-1)
    return x


def describe_chain(chain):
    out = []
    for st in chain:
        k = st["fx"]
        if k == "hpf": out.append(f"HPF {st['hz']} Hz")
        elif k == "lpf": out.append(f"LPF {st['hz']} Hz")
        elif k == "lowshelf": out.append(f"low shelf {st['db']:+g} dB @{st['hz']} Hz")
        elif k == "highshelf": out.append(f"high shelf {st['db']:+g} dB @{st['hz']} Hz")
        elif k == "peak": out.append(f"peak {st['db']:+g} dB @{st['hz']} Hz Q{st.get('q', 1.0)}")
        elif k == "pitch": out.append(f"pitch {st['st']:+g} st" if st["st"] else "pitch 0")
        elif k == "comp": out.append(f"comp {st['ratio']}:1 @{st['th']} dB ({st.get('att', 5)}/{st.get('rel', 100)} ms)")
        elif k == "sat": out.append(f"tanh saturation drive {st.get('drive', 2)} mix {st.get('mix', 0.2)}")
        elif k == "reverb": out.append(f"reverb send room {st.get('room', 0.3)} wet {st['wet']} predelay {st.get('predelay_ms', 0)} ms")
        elif k == "slap": out.append(f"slapback {st['ms']} ms mix {st['mix']}")
        elif k == "chorus": out.append(f"chorus {st.get('rate', 0.8)} Hz depth {st.get('depth', 0.15)} mix {st.get('mix', 0.2)}")
        elif k == "bitcrush": out.append(f"bitcrush {st['bits']}-bit mix {st['mix']}")
        elif k == "ringmod": out.append(f"ring mod {st['hz']} Hz mix {st['mix']}")
        elif k == "comb": out.append(f"comb {st['ms']} ms fb {st['fb']} mix {st['mix']}")
        elif k == "harmony": out.append(f"harmony layer {st['st']:+g} st @{st['db']} dB")
        elif k == "band": out.append(f"parallel band {st['lo']}-{st['hi']} Hz mix {st['mix']}")
    return out


# ----------------------------------------------------------------------------- loudness

_meter = pyln.Meter(SR)


def lufs(y, sr=SR):
    yy = y
    if len(yy) < int(1.2 * sr):  # short clip: tile so 400 ms gating blocks are full
        reps = int(np.ceil(1.2 * sr / max(1, len(yy)))) + 1
        yy = np.tile(yy, reps)
    m = _meter if sr == SR else pyln.Meter(sr)
    return float(m.integrated_loudness(yy.astype(np.float64)))


def true_peak_db(y, sr=SR):
    up = resample_poly(y.astype(np.float64), 4, 1)
    return float(20 * np.log10(np.max(np.abs(up)) + 1e-12))


def normalise(y, sr=SR, target=TARGET_LUFS, ceil=TP_CEIL):
    x = y.astype(np.float32)
    for _ in range(4):
        g = target - lufs(x, sr)
        x = x * (10 ** (g / 20))
        tp = true_peak_db(x, sr)
        if tp <= ceil:
            break
        x = pb.Limiter(threshold_db=ceil - 1.0, release_ms=60)(x, sr)
        x = np.asarray(x, dtype=np.float32).reshape(-1)
    # final safety: static gain down if still over the ceiling
    tp = true_peak_db(x, sr)
    if tp > ceil:
        x = x * (10 ** ((ceil - tp) / 20))
    return x


# ----------------------------------------------------------------------------- render

def render_line(say, blend, speed, chain, carrier=None, wpm_band=None):
    """Synthesize, then (for lines of 3+ words) re-time via Kokoro's speed control until the
    dry read sits inside the character's words-per-minute band. Returns (audio48k, info)."""
    n_words = len(say.split())
    sp = speed
    lo_sp, hi_sp = speed * 0.85, speed * 1.15  # nudge only: big stretches smear phonemes
    band = None
    if wpm_band and n_words >= 5:
        band = (wpm_band[0], wpm_band[1] * (1.15 if n_words < 8 else 1.0))  # short lines run hotter
    for _ in range(4):
        y = synth(say, blend, sp, carrier)
        y = trim(y, SR_TTS, head_pad=0.0, tail_pad=0.0)
        wpm = n_words / (len(y) / SR_TTS) * 60
        if not band or band[0] <= wpm <= band[1]:
            break
        target = 0.5 * (band[0] + band[1])
        new_sp = float(np.clip(sp * target / wpm, lo_sp, hi_sp))
        if abs(new_sp - sp) < 1e-3:
            break
        sp = new_sp
    info = {"speed": round(sp, 3), "dry_wpm": round(wpm)}
    y = np.concatenate([np.zeros(int(0.02 * SR_TTS), np.float32), y, np.zeros(int(0.05 * SR_TTS), np.float32)])
    y = resample_poly(y, 2, 1).astype(np.float32)
    y = np.concatenate([np.zeros(int(0.02 * SR), np.float32), y, np.zeros(int(0.9 * SR), np.float32)])
    y = apply_chain(y, SR, chain)
    y = trim(y, SR, thresh_db=-52, head_pad=0.03, tail_pad=0.06)
    return normalise(y), info


def _encode_mp3(y, mp3_path, sr, bitrate):
    import tempfile
    env = dict(os.environ, LD_LIBRARY_PATH=FFMPEG_DIR)
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tf:
        tmp = tf.name
    try:
        sf.write(tmp, y.astype(np.float32), sr, subtype="FLOAT")
        subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-i", tmp, "-ac", "1",
                        "-c:a", "libmp3lame", "-b:a", bitrate, mp3_path], check=True, env=env)
    finally:
        os.remove(tmp)


def write_wav_mp3(y, wav_path, mp3_path=None, sr=SR, bitrate="160k"):
    """WAV is written as-is. The MP3 is level-matched: LAME at 160k mono shifts integrated
    loudness by ~ -0.45 dB here, so encode, decode, measure, and re-encode once with the
    correction (kept only while the decoded true peak stays under -1.0 dBTP)."""
    if wav_path:
        sf.write(wav_path, y, sr, subtype="PCM_24")
    if mp3_path:
        _encode_mp3(y, mp3_path, sr, bitrate)
        d, dsr = sf.read(mp3_path, dtype="float32")
        diff = lufs(y, sr) - lufs(d, dsr)
        if abs(diff) > 0.05:
            g = diff
            tp_after = true_peak_db(d, dsr) + g
            if tp_after > -1.0:
                g -= tp_after + 1.0
            _encode_mp3(y * (10 ** (g / 20)), mp3_path, sr, bitrate)


def chime(n_pings=1, sr=SR):
    """Spoken-free candidate marker: n soft two-partial bell pings (C6 + 3.99x partial)."""
    ping_len, gap = 0.22, 0.13
    t = np.arange(int(ping_len * sr)) / sr
    f0 = 1046.5
    ping = (np.sin(2 * np.pi * f0 * t) * np.exp(-t / 0.07)
            + 0.25 * np.sin(2 * np.pi * f0 * 3.99 * t) * np.exp(-t / 0.025)
            + 0.35 * np.sin(2 * np.pi * f0 * 1.5 * t) * np.exp(-t / 0.05))
    a = int(0.002 * sr)
    ping[:a] *= np.linspace(0, 1, a)
    out = []
    for i in range(n_pings):
        out.append(ping)
        if i < n_pings - 1:
            out.append(np.zeros(int(gap * sr)))
    y = np.concatenate(out).astype(np.float32)
    y = y / np.max(np.abs(y)) * 0.25
    g = -26.0 - lufs(y, sr)  # quieter than dialogue (-16) so it reads as a marker
    return (y * 10 ** (g / 20)).astype(np.float32)


# ----------------------------------------------------------------------------- QA

def analyse(y, sr=SR, n_words=None):
    import librosa
    env, hop = _rms_frames(y, sr)
    db = 20 * np.log10(env + 1e-12)
    act = np.where(db > -45)[0]
    head = act[0] * hop / sr if len(act) else 0.0
    tail = (len(env) - act[-1] - 1) * hop / sr if len(act) else 0.0
    y16 = resample_poly(y.astype(np.float64), 1, 3)
    f0, vflag, _ = librosa.pyin(y16, fmin=55, fmax=520, sr=16000, frame_length=1024)
    f0 = f0[~np.isnan(f0)]
    med = float(np.median(f0)) if len(f0) else float("nan")
    rng = float(np.percentile(12 * np.log2(f0 / med), 95) - np.percentile(12 * np.log2(f0 / med), 5)) if len(f0) > 5 else float("nan")
    dur = len(y) / sr
    speech = max(1e-3, dur - head - tail)  # active span incl. internal pauses
    S = np.abs(librosa.stft(y16.astype(np.float32), n_fft=1024, hop_length=256))
    cent = librosa.feature.spectral_centroid(S=S, sr=16000)[0]
    flat = librosa.feature.spectral_flatness(S=S)[0]
    loud = S.sum(axis=0) > np.percentile(S.sum(axis=0), 40)
    return {
        "duration_s": round(dur, 3),
        "lufs_i": round(lufs(y, sr), 2),
        "true_peak_dbtp": round(true_peak_db(y, sr), 2),
        "clipped_samples": int(np.sum(np.abs(y) >= 0.999)),
        "head_silence_ms": round(head * 1000),
        "tail_silence_ms": round(tail * 1000),
        "median_f0_hz": round(med, 1),
        "f0_range_st": round(rng, 1),
        "wpm": round(n_words / speech * 60) if n_words else None,
        "centroid_hz": round(float(np.median(cent[loud]))) if loud.any() else None,
        "flatness": round(float(np.median(flat[loud])), 4) if loud.any() else None,
    }


_asr = None


def asr(wav_path):
    global _asr
    if _asr is None:
        from faster_whisper import WhisperModel
        _asr = WhisperModel("small.en", device="cpu", compute_type="int8", cpu_threads=6)
    segs, _ = _asr.transcribe(wav_path, language="en", beam_size=5, condition_on_previous_text=False,
                              vad_filter=False, without_timestamps=True)
    segs = list(segs)
    text = " ".join(s.text.strip() for s in segs).strip()
    lp = float(np.mean([s.avg_logprob for s in segs])) if segs else -9.0
    return text, lp


_NUM = {"0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five", "15": "fifteen"}


def _norm(s):
    import re
    s = s.lower().replace("’", "'")
    s = re.sub(r"\b(\d+)\b", lambda m: _NUM.get(m.group(1), m.group(1)), s)
    s = re.sub(r"([a-z])(\d)", lambda m: m.group(1) + " " + _NUM.get(m.group(2), m.group(2)), s)
    s = s.replace("vee", "v").replace("a.i.", "ai").replace("a.g.i.", "agi")
    s = re.sub(r"[^a-z]", "", s)
    return s


def cer(ref, hyp):
    import jiwer
    r, h = _norm(ref), _norm(hyp)
    if not r:
        return 0.0
    return float(jiwer.cer(r, h)) if h else 1.0
