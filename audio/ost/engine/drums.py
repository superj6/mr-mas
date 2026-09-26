"""A small drum-pattern DSL: brushes, jazz ride, orchestral, 808 / trap, chip.

    from engine.drums import Drums
    d = Drums(a, 'brushes')                 # a = arrange.Arr(grid); swing comes from the grid
    d.play('''
        sweep: ~~~~~~~~ ~~~~~~~~            # '~' after a hit (or a leading '~') = one sweep circle
        tap:   ....x... ....x...
        kick[vel=0.4]: x...x... x...x...
        hatf:  ....x... ....x...
    ''', bars=(3, 7))

    Drums(a, '808').play('''
        kick:  x.......x.x..... | x.......x...x...
        hat[swing=0]: x.x.x.x.x.x.3.x. | x.x.x.x.x4x.x.x.     # digits = ratchets (trap rolls)
        clap:  ....X.......X...
        sub[pitch=F1,len=6]: x.......x.x.....
    ''', bars=(9, 13))

Syntax per line  `voice[opt=v,...]: steps`
  steps  one character per step; spaces are ignored; '|' separates BARS (each bar the same step count;
         a 1-bar line loops over the bar range, a 2-bar line alternates, ...).  Steps per bar set the
         resolution: 8 in 4/4 = eighths, 16 = sixteenths, 12 = triplet eighths, 6 in 6/8 = eighths.
  chars  x hit (0.75)   X accent (1.0)   o soft (0.55)   g ghost (0.3)   f flam (grace 20 ms before)
         2-9 ratchet: that many even hits inside the step (trap rolls)   ~ hold the previous hit
         . or - rest
  opts   vel=  (multiplier)   swing=  (override the grid's swing; 0 = straight)   pitch=  (808 kick /
         sub / timpani / chip)   len=  (length in steps)   push=  (ms; negative = ahead)
Voices per kit: see KITS (print(Drums.voices('brushes'))).
"""
from __future__ import annotations

import re

from .core import nm, Note

# voice -> dict(track=, pitch=, vel=, x={extras}); 'fnpitch' voices take their pitch from the line opts
KITS = {
    'brushes': {
        'sweep': dict(track='swish', pitch=60, vel=0.9, sustain=True, x=dict(circles=1.0)),
        'tap':   dict(track='brush', pitch=38),
        'slap':  dict(track='brush', pitch=39),
        'swirl': dict(track='brush', pitch=40),
        'kick':  dict(track='jazz', pitch=36, vel=0.45),
        'hatf':  dict(track='jazz', pitch=44, vel=0.6),
        'ride':  dict(track='jazz', pitch=51, vel=0.8),
        'bell':  dict(track='jazz', pitch=53),
        'rim':   dict(track='jazz', pitch=37),
    },
    'jazz': {
        'ride':  dict(track='jazz', pitch=51), 'bell': dict(track='jazz', pitch=53),
        'crash': dict(track='jazz', pitch=49), 'snare': dict(track='jazz', pitch=38),
        'rim':   dict(track='jazz', pitch=37), 'kick': dict(track='jazz', pitch=36),
        'hat':   dict(track='jazz', pitch=42), 'hatf': dict(track='jazz', pitch=44),
        'ohat':  dict(track='jazz', pitch=46), 'tom1': dict(track='jazz', pitch=50),
        'tom2':  dict(track='jazz', pitch=47), 'tom3': dict(track='jazz', pitch=43),
    },
    '808': {
        'kick':  dict(track='k808', pitch='F1', fnpitch=True),
        'sub':   dict(track='sub', pitch='F1', fnpitch=True, sustain=True),
        'snare': dict(track='sn808', pitch=60),
        'clap':  dict(track='clap808', pitch=60),
        'hat':   dict(track='h808', pitch=60, vel=0.8),
        'ohat':  dict(track='h808', pitch=60, vel=0.8, x=dict(open=True)),
        'rim':   dict(track='rim808', pitch=60),
        'gu_kick': dict(track='kit808', pitch=36), 'gu_snare': dict(track='kit808', pitch=38),
        'gu_clap': dict(track='kit808', pitch=39), 'gu_hat': dict(track='kit808', pitch=42),
        'gu_ohat': dict(track='kit808', pitch=46), 'gu_cym': dict(track='kit808', pitch=49),
    },
    'orch': {
        'bd':    dict(track='bdrum', pitch=60), 'snare': dict(track='snare', pitch=60),
        'taps':  dict(track='snare_taps', pitch=60), 'cym': dict(track='suscym', pitch=60),
        'crash': dict(track='crash', pitch=60), 'timp': dict(track='timp', pitch='F2', fnpitch=True),
        'rim':   dict(track='rimshot', pitch=60), 'wood': dict(track='woodclick', pitch=60),
    },
    'chip': {
        'kick':  dict(track='chipkick', pitch='F2', fnpitch=True),
        'snare': dict(track='noise', pitch=60, x=dict(clock=9000.0, hp=800, dec=0.08, sus=0.0, rel=0.05)),
        'hat':   dict(track='noise', pitch=60, vel=0.7, x=dict(clock=30000.0, dec=0.02, sus=0.0, rel=0.02)),
        'ohat':  dict(track='noise', pitch=60, vel=0.7, x=dict(clock=30000.0, dec=0.12, sus=0.1, rel=0.06)),
        'metal': dict(track='noise', pitch=60, vel=0.6, x=dict(clock=20000.0, short=True, dec=0.05, sus=0.0)),
    },
}

CHAR_VEL = {'x': 0.75, 'X': 1.0, 'o': 0.55, 'g': 0.3, 'f': 0.75}
LINE = re.compile(r'^\s*([A-Za-z_][\w]*)\s*(?:\[([^\]]*)\])?\s*:\s*(.*)$')


def _opts(s):
    out = {}
    if not s:
        return out
    for kv in s.split(','):
        if '=' in kv:
            k, v = kv.split('=', 1)
            k, v = k.strip(), v.strip()
            try:
                out[k] = float(v)
            except ValueError:
                out[k] = v
    return out


class Drums:
    def __init__(self, arr, kit='brushes', vel=1.0, swing=None):
        if kit not in KITS:
            raise KeyError(f'unknown kit {kit!r}: {sorted(KITS)}')
        self.a = arr
        self.g = arr.g
        self.kit = kit
        self.vel = vel
        self.swing = swing

    @staticmethod
    def voices(kit):
        return sorted(KITS[kit])

    def play(self, text, bars, vel=1.0, swing=None, lock=False):
        """Parse and place a pattern over bars [b0, b1).  Returns the Notes added."""
        out = []
        for raw in text.strip().splitlines():
            line = raw.split('#', 1)[0].rstrip()
            if not line.strip():
                continue
            m = LINE.match(line)
            if not m:
                raise ValueError(f'drum DSL: cannot parse {raw!r}')
            voice, opts, steps = m.group(1), _opts(m.group(2)), m.group(3)
            if voice not in KITS[self.kit]:
                raise KeyError(f'kit {self.kit!r} has no voice {voice!r}: {self.voices(self.kit)}')
            out += self._line(voice, opts, steps, bars, vel, swing, lock)
        return out

    def _line(self, voice, opts, steps, bars, vel, swing, lock):
        spec = KITS[self.kit][voice]
        segs = [re.sub(r'\s+', '', s) for s in steps.split('|')]
        segs = [s for s in segs if s]
        S = len(segs[0])
        if any(len(s) != S for s in segs):
            raise ValueError(f'drum DSL: every bar of {voice!r} needs {S} steps: {segs}')
        g = self.g
        amt = opts.get('swing', swing if swing is not None else (self.swing if self.swing is not None else g.swing))
        vmul = opts.get('vel', 1.0) * vel * self.vel * spec.get('vel', 1.0)
        push = opts.get('push', 0.0) / 1000.0
        pitch = opts.get('pitch', spec['pitch']) if spec.get('fnpitch') else spec['pitch']
        pitch = nm(pitch) if isinstance(pitch, str) else pitch
        length = opts.get('len', None)
        out = []
        for bar in range(bars[0], bars[1]):
            pat = segs[(bar - bars[0]) % len(segs)]
            q0 = g.bar_q(bar)
            stepq = g.bar_len_q(bar) / S
            pos = [g.tq(g.swing_q(q0 + j * stepq, amt)) for j in range(S + 1)]   # step edges (swung)

            def span(k, n_steps):
                """seconds from step k over n_steps (fractional OK; past the bar end at the last step's size)."""
                e = k + float(n_steps)
                if e <= S:
                    i = int(e)
                    frac = e - i
                    end = pos[i] + (frac * (pos[i + 1] - pos[i]) if frac and i < S else 0.0)
                    return end - pos[k]
                return pos[S] - pos[k] + (e - S) * (pos[S] - pos[S - 1])
            k = 0
            while k < S:
                ch = pat[k]
                if ch in '.-':
                    k += 1
                    continue
                if ch == '~':
                    if k == 0 and spec.get('sustain'):        # a leading '~' starts a sustained hit
                        ch = 'x'
                    else:
                        k += 1
                        continue
                hold = 1
                while k + hold < S and pat[k + hold] == '~':
                    hold += 1
                t = pos[k] + push
                x = dict(spec.get('x', {}))
                if ch.isdigit():                              # ratchet: r even hits inside the step
                    r = max(1, int(ch))
                    step_s = pos[k + 1] - pos[k]
                    for j in range(r):
                        out.append(self._note(spec, pitch, t + step_s * j / r, step_s / r * 0.9,
                                              vmul * (0.55 + 0.25 * j / max(r - 1, 1)), lock, x))
                    k += 1
                    continue
                v = CHAR_VEL.get(ch)
                if v is None:
                    raise ValueError(f'drum DSL: bad step char {ch!r} in {voice}')
                dur = max(span(k, length if length else hold), 0.01)
                if ch == 'f':
                    out.append(self._note(spec, pitch, t - 0.02, 0.02, vmul * 0.4, lock, dict(x)))
                if voice == 'sweep':                          # one brush circle per two beats
                    x['circles'] = max(0.5, hold * stepq / g.beat_q(bar) / 2.0)
                out.append(self._note(spec, pitch, t, dur, vmul * v, lock, x))
                k += hold if spec.get('sustain') else 1
        self.a.notes.extend(out)
        return out

    def _note(self, spec, pitch, t, d, v, lock, x):
        return Note(spec['track'], float(pitch), float(max(t, 0.0)), float(d), float(min(max(v, 0.02), 1.0)), lock,
                    dict(x))


def swing_ride(a, bars, vel=0.55, hat=True, feathered_kick=0.0):
    """The theme's swing ride (1, 2 &, 3, 4 &; 2 and 4 accented) + hi-hat foot on 2 and 4."""
    txt = 'ride: x.Xox.Xo\n' + ('hatf: ..x...x.\n' if hat else '')
    if feathered_kick:
        txt += f'kick[vel={feathered_kick}]: x.x.x.x.\n'
    return Drums(a, 'jazz').play(txt, bars, vel=vel / 0.75)
