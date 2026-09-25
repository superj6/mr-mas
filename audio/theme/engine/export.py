"""Master, export (WAV 48k/24 + MP3 256k), stems, MIDI."""
from __future__ import annotations

import os
import subprocess

import numpy as np
import soundfile as sf
import pretty_midi

from .core import SR, N, f2s
from .mix import master_gain, lufs, true_peak

FFDIR = '/home/jgon/project/art/mrmas/studio/node_modules/@remotion/compositor-linux-x64-gnu'
FFMPEG = f'{FFDIR}/ffmpeg'


def mp3(wav_path, mp3_path, kbps=256):
    env = dict(os.environ, LD_LIBRARY_PATH=FFDIR)
    subprocess.run([FFMPEG, '-y', '-loglevel', 'error', '-i', wav_path, '-codec:a', 'libmp3lame', '-b:a',
                    f'{kbps}k', mp3_path], check=True, env=env)


def master_and_export(stems: dict, out_wav: str, stem_dir: str, stem_prefix: str, target=-14.0, ceiling=-1.0,
                      comp=None):
    mix = sum(stems.values())
    g = master_gain(mix, target_lufs=target, ceiling_db=ceiling, comp=comp or dict(thresh_db=-20, ratio=1.8))
    master = (mix * g[None]).astype(np.float32)
    tp = true_peak(master)
    if tp > 10 ** (ceiling / 20):
        master *= (10 ** (ceiling / 20) / tp) * 0.995
        g = g * (10 ** (ceiling / 20) / tp) * 0.995
    sf.write(out_wav, master.T, SR, subtype='PCM_24')
    mp3(out_wav, out_wav.replace('.wav', '.mp3'))
    os.makedirs(stem_dir, exist_ok=True)
    import glob
    for old in glob.glob(os.path.join(stem_dir, f'{stem_prefix}-*.wav')):    # no stale stems (e.g. v2.0 'fired')
        os.remove(old)
    for name, x in stems.items():
        y = (x * g[None]).astype(np.float32)
        if np.abs(y).max() < 1e-6:
            continue
        sf.write(os.path.join(stem_dir, f'{stem_prefix}-{name}.wav'), y.T, SR, subtype='PCM_24')
    return master, g, dict(lufs=lufs(master), true_peak_db=float(20 * np.log10(true_peak(master) + 1e-12)))


GM = dict(felt=0, grand=0, fired_piano=0, snes_piano=0, vln1=48, vln2=48, vla=48, vc=48, cb=48, vln_trem=44,
          vla_trem=44, vc_trem=44, vln_pizz=45, vla_pizz=45, vc_pizz=45, harp=46, svln=40, tpt_stac=56,
          tbn_stac=57, tuba_stac=58, hn=60, hn_stac=60, tbn=57, tuba=58, tpt=56, tsax_stac=66, tsax=66, bsax=67,
          asax=65, harmon=59, cl=71, fl=73, bsn=70, ubass=32, cb_pizz=32, snes_bass=32, glock=9, celesta=8,
          vibes=11, snes_vibes=11, chimes=14, lead=80, lead2=80, arp=80, tri=81, beeper=80, sqbass=80,
          snes_brass=61, snes_tbn=61, snes_str=48, sub=38, drone=89, reed=20, snes_cup=59, snes_hn=60,
          snes_pizz=45, snes_harp=46, snes_sax=66, noisesweep=127)
DRUMS = {'brush', 'jazz', 'snes_kit', 'swish', 'snare', 'hat', 'timp', 'bdrum', 'crash', 'suscym', 'cym_swell', 'noise'}


def write_midi(notes, path):
    pm = pretty_midi.PrettyMIDI(initial_tempo=96)
    insts = {}
    for n in notes:
        if n.inst not in insts:
            drum = n.inst in DRUMS
            insts[n.inst] = pretty_midi.Instrument(program=GM.get(n.inst, 0), is_drum=drum, name=n.inst)
        p = int(round(n.pitch)) if n.inst not in ('swish',) else 60
        insts[n.inst].notes.append(pretty_midi.Note(velocity=int(np.clip(n.vel * 127, 1, 127)), pitch=int(np.clip(p, 0, 127)),
                                                    start=f2s(n.start), end=f2s(n.start + max(n.dur, 0.5))))
    for i in insts.values():
        pm.instruments.append(i)
    pm.write(path)
