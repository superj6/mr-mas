"""crosscut.py - Ep2 v1: who is on screen during a crosscut call, on the lock's clock (new, the sound pass 2026-10-10;
read by stems.py and mix_episode.py).

cast.md §4: a `call` line is dry while its speaker is in frame and band-passed (the phone's far end) while he isn't. The
picture decides who is in frame. Sc 19's call (Mas on ELPPA's lawn, Gerg in the cheering lobby) cuts on the speakers:
studio/src/episodes/ep02/pixel/act4/scenes/sc-19.ts draws 19.09 on Mas, cuts to Gerg 3 frames before his line and back
to Mas 6 frames before "the phone's closer."; 19.10 opens on Gerg and cuts to each next speaker a few frames before his
line (CROSS there: Mas 6 frames ahead of his unhurried answers, Gerg 4). This table is that rule, keyed by the lines,
so it re-anchors itself on any re-lock (S5). The other Ep2 calls (8.06 to ELPPA, 17.09 to LEGAL) hold on Mas and the
far end is never heard: their lines stay dry.

  spans(seg, beats, starts) -> {'GERG': [(t0, t1), ...], 'MAS': [...]} on the segment clock (seconds)
The stems lay the lobby's watch-party bed under Gerg's spans (his side of the call), the mix band-passes any part of a
call line that falls in the other speaker's span.
"""
from __future__ import annotations

FPS = 24
# (seg, beat): (who is on screen at the beat's head, [(who, line id, frames ahead of the line), ...])
CROSS = {
    ('act4', '19.09'): ('MAS', [('GERG', 'e2-a4-0024', 3), ('MAS', 'e2-a4-0025', 6)]),
    ('act4', '19.10'): ('GERG', [('GERG', 'e2-a4-0026', 4), ('MAS', 'e2-a4-0027', 6), ('GERG', 'e2-a4-0033', 4),
                                 ('MAS', 'e2-a4-0034', 6), ('GERG', 'e2-a4-0035', 4), ('GERG', 'e2-a4-0028', 4),
                                 ('MAS', 'e2-a4-0029', 6)]),
}
WHO_OF = {'gerg': 'GERG', 'mas': 'MAS'}


def spans(seg, beats, starts):
    """the on-screen speaker's spans over every crosscut beat of this segment"""
    out = {}
    for i, b in enumerate(beats):
        key = (seg, b['id'])
        if key not in CROSS:
            continue
        head, rule = CROSS[key]
        b0, b1 = starts[i]
        lines = {l['id']: l for l in b.get('lines') or []}
        cuts = [(b0, head)]
        for who, lid, ahead in rule:
            l = lines.get(lid)
            if l is None:
                continue
            t = b0 + float(l['t']) - ahead / FPS
            if t > cuts[-1][0] and who != cuts[-1][1]:
                cuts.append((max(b0, t), who))
        for j, (t, who) in enumerate(cuts):
            e = cuts[j + 1][0] if j + 1 < len(cuts) else b1
            if e > t:
                out.setdefault(who, []).append((round(t, 4), round(e, 4)))
    for who in out:                                  # join runs that continue across the beat boundary
        js = []
        for a, e in sorted(out[who]):
            if js and abs(a - js[-1][1]) < 1e-3:
                js[-1] = (js[-1][0], e)
            else:
                js.append((a, e))
        out[who] = js
    return out
