"""Short character lines: Nole "I came up with the name!" (bright, emphatic) and
Mas "super." (flat, tiny smile). Kokoro-82M stock voices only (no cloning)."""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
import pedalboard as pb
from vlib import *

def dialog_chain(y, bright=0.0, comp=(-20, 2.0), drive=(4.0, 0.2), room='booth', wet=0.10):
    chain = [pb.HighpassFilter(90), pb.LowShelfFilter(170, 1.0, 0.7),
             pb.PeakFilter(3000, bright, 0.9), pb.HighShelfFilter(8000, -1.5 + bright * 0.5, 0.7),
             pb.Compressor(threshold_db=comp[0], ratio=comp[1], attack_ms=6, release_ms=120)]
    y = board_mono(chain, y)
    y = saturate(y, *drive)
    out = convolve(y, ir(room), wet=wet)
    return fade(out, 0.002, 0.12)

def nole(text, voice, speed, semis, drive, name):
    y, _ = tts_words(text, voice, speed)
    y = trim(y, -45, 0.01, 0.12)
    if semis:
        y = stretch(y, 1.0, semis, formants=True)
    y = formant_shift(y, 0.35)                       # a touch brighter / more forward
    out = dialog_chain(y, bright=2.5, comp=(-22, 3.0), drive=drive, room='booth', wet=0.10)
    out = np.pad(out, ((0, 0), (0, int(0.25 * SR))))
    return export(fade(out, 0, 0.2), f'vo/{name}')

def super_line(voice, take, name, call=False):
    if take == 1:     # dead flat, quick
        y, _ = tts_words('super', voice, 0.98)
        y = trim(y, -45, 0.01, 0.10)
        y = level_word(y, strength=0.9, settle_st=-0.6)
    else:             # flat, a hair slower, the smallest lift on "su-" before settling
        y, _ = tts_words('super.', voice, 0.9)
        y = trim(y, -45, 0.01, 0.10)
        y = level_word(y, strength=0.75, settle_st=-1.0)
    y = formant_shift(y, 0.55)                       # 'tiny smile': ~3% shorter vocal tract
    out = dialog_chain(y, bright=0.8, comp=(-22, 2.0), drive=(4.0, 0.2), room='dark_room', wet=0.14)
    if call:          # heard through a laptop video call (THE BLIP: his tile drops out, still unmuted)
        m = out.mean(0)
        m = board_mono([pb.HighpassFilter(220), pb.LowpassFilter(6800), pb.PeakFilter(1800, 3.0, 0.8),
                        pb.Compressor(threshold_db=-26, ratio=4, attack_ms=3, release_ms=80),
                        pb.MP3Compressor(vbr_quality=8.5)], m)
        out = np.stack([m, m])
    out = np.pad(out, ((0, 0), (0, int(0.2 * SR))))
    return export(fade(out, 0, 0.15), f'vo/{name}')

if __name__ == '__main__':
    stats = []
    stats.append(nole('[I](+2) came up with the name!', 'am_fenrir', 1.0, 0.8, (5.0, 0.3), 'nole_came-up-with-the-name_take1_fenrir'))
    stats.append(nole('I came up with the name!!', 'am_fenrir', 1.12, 2.0, (7.0, 0.4), 'nole_came-up-with-the-name_take2_fenrir'))
    stats.append(nole('[I](+2) came up with the name!', 'am_adam', 1.05, 1.2, (5.0, 0.3), 'nole_came-up-with-the-name_alt_adam'))
    for n, v in [('michael', 'am_michael'), ('puck', 'am_puck'), ('echo', 'am_echo'), ('liam', 'am_liam'),
                 ('designed', {'am_michael': 0.5, 'am_puck': 0.3, 'am_echo': 0.2})]:
        vv = voice_blend(v) if isinstance(v, dict) else v
        for take in (1, 2):
            stats.append(super_line(vv, take, f'mas_super_take{take}_{n}'))
    stats.append(super_line('am_michael', 1, 'mas_super_take1_michael_videocall', call=True))
    json.dump(stats, open(os.path.join(ROOT, 'vo', '_lines_stats.json'), 'w'), indent=1, default=float)
