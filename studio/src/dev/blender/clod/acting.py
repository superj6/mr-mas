# MR. MAS: CLOD look-dev, acting helpers: eased key tracks sampled ON 2s, replacement-mouth tracks, hand-placed jitter.
# Pure Python (no bpy), so the timing can be checked outside Blender.
import math

CHANNELS = ('bow', 'head', 'turn', 'tilt', 'squash', 'lift')
DEFAULTS = {'bow': 0.0, 'head': 0.0, 'turn': 0.0, 'tilt': 0.0, 'squash': 1.0, 'lift': 0.0}


def ease(t):
    """slow in, slow out (a puppet moved by hand is eased by the animator's spacing, not by a curve editor)"""
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


class Track:
    """keys: [(frame, {channel: value}), ...]; a channel missing from a key holds its last value"""
    def __init__(self, keys):
        self.keys = sorted(keys, key=lambda k: k[0])
        filled, cur = [], dict(DEFAULTS)
        for f, d in self.keys:
            cur = dict(cur)
            cur.update(d)
            filled.append((f, cur))
        self.filled = filled

    def at(self, f):
        K = self.filled
        if f <= K[0][0]:
            return dict(K[0][1])
        for (f0, a), (f1, b) in zip(K, K[1:]):
            if f0 <= f <= f1:
                t = ease((f - f0) / max(1e-6, f1 - f0))
                return {c: a[c] + (b[c] - a[c]) * t for c in CHANNELS}
        return dict(K[-1][1])


def on2s(f, first=0):
    """the drawing held at frame f when the puppet is shot on 2s from `first`"""
    return first + ((f - first) // 2) * 2


def mouth_at(events, f, lead=1):
    """events: [(frame, shape)], shape in rest/M/O/E/A; the mouth leads the sound by `lead` frames"""
    cur = 'rest'
    for fr, sh in events:
        if fr <= f + lead:
            cur = sh
    return cur


# hand-placed jitter for a stop-motion camera (and the animator's touch on the puppet): millimetres and degrees,
# written out by hand, not generated, so no two neighbouring steps repeat and nothing drifts
CAM_JITTER = [(0.0, 0.0, 0.0), (0.25, -0.1, 0.02), (0.1, 0.2, -0.01), (-0.2, 0.05, 0.0), (0.05, -0.25, 0.03),
              (0.3, 0.1, -0.02), (-0.1, -0.05, 0.01), (0.0, 0.3, 0.0), (-0.3, -0.15, -0.03), (0.15, 0.0, 0.02),
              (-0.05, 0.2, -0.01), (0.2, -0.2, 0.0), (-0.25, 0.1, 0.03), (0.05, 0.05, -0.02), (0.3, -0.05, 0.01),
              (-0.15, 0.25, 0.0), (0.1, -0.3, -0.01), (-0.2, 0.0, 0.02), (0.0, 0.15, -0.03), (0.25, 0.05, 0.0),
              (-0.1, -0.2, 0.01), (0.15, 0.3, -0.02), (-0.3, 0.05, 0.0), (0.05, -0.1, 0.03)]
PUPPET_JITTER = [(0.0, 0.0, 0.0), (0.08, 0.0, -0.05), (-0.05, 0.06, 0.0), (0.0, -0.08, 0.04), (0.1, 0.03, 0.0),
                 (-0.08, -0.04, 0.05), (0.03, 0.09, -0.03), (-0.1, 0.0, 0.0), (0.06, -0.06, 0.02), (-0.02, 0.05, -0.04),
                 (0.09, -0.02, 0.0), (-0.06, 0.08, 0.03), (0.0, -0.05, -0.02)]


def jitter(table, step):
    j = table[step % len(table)]
    return j
