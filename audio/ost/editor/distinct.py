"""Are the OST tracks distinct tones?  One feature vector per album master, z-scored across the set,
then the nearest neighbour of each track (Euclidean on z-scores).  The locked main title V1 is included as
a reference row, so we can also see that no cue is the title again.

Features (all measured from the audio / cue sheet, nothing hand-set):
  brightness   spectral centroid (Hz, log)
  low / high   share of power < 250 Hz and > 2 kHz (dB)
  density      onsets per second (spectral flux peaks)
  dynamics     LRA (corrected short-term, p95 - p10)
  pulse        autocorrelation strength of the onset envelope at 1 beat (0.625 s) / bar
  chroma       the 12 pitch-class means (8 of the dims share the key, so they get 1/3 weight)
  balance      piano / orch / big band / chip shares (cue sheet)
  swing        share of off-beat onsets (MIDI) at a swung 8th or swung 16th position
v2 (fix pass 1, 2026-09-26): MM-10 and MM-11 are measured on their ALBUM EDITS (the album master file is the
edit; balance and swing come from the album-edit cue sheet and MIDI), and the LRA uses the engine's corrected
short-term meter (engine/mix.short_term_lufs, K-weighting along time).
Writes editor/distinct.json.
"""
import json
import os
import sys

import numpy as np
from scipy import signal

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from qa import read, OST, SR   # noqa: E402
from engine import mix as EM   # noqa: E402  (qa put audio/ost on sys.path)

TRACKS = ['mm01-water-line', 'mm02-his-version', 'mm05-the-more-you-buy', 'mm06-beeper-1993-sample-chip-2008',
          'mm07-how-to-fire-a-ceo', 'mm08-the-falling-tile', 'mm09-the-boards-side', 'mm10-his-side-745',
          'mm11-the-return', 'mm13-outside-intended-scope', 'mm19-renamed-it']
ALBUM_EDIT = {'mm10-his-side-745', 'mm11-the-return'}     # the album master is the edit: use its cue sheet + MIDI
V1 = '/home/jgon/project/art/mrmas/audio/theme/theme-V1-chipchamber.wav'
V1_BAL = dict(piano=34, orch=28, bigband=11, chip=27)


def feats(x):
    m = x.mean(0)
    f, t, Z = signal.stft(m, SR, nperseg=4096, noverlap=4096 - 1024)
    P = np.abs(Z) ** 2
    act = P.sum(0) > P.sum(0).max() * 1e-6                   # skip digital silence (D6, the dry windows)
    P = P[:, act]
    tot = P.sum() + 1e-20
    cen = float((f[:, None] * P).sum() / tot)
    low = 10 * np.log10(P[f < 250].sum() / tot + 1e-12)
    high = 10 * np.log10(P[f > 2000].sum() / tot + 1e-12)
    # onsets: half-wave rectified log-spectral flux
    L = np.log1p(1e3 * P / P.max())
    flux = np.maximum(np.diff(L, axis=1), 0).sum(0)
    flux = flux - signal.medfilt(flux, 31)
    hop = 1024 / SR
    pk, _ = signal.find_peaks(flux, height=np.percentile(flux, 90), distance=int(0.08 / hop))
    dur = P.shape[1] * hop
    dens = len(pk) / dur
    ac = np.correlate(flux - flux.mean(), flux - flux.mean(), 'full')[len(flux) - 1:]
    ac /= ac[0] + 1e-12
    beat = int(round(0.625 / hop))
    pulse = float(max(ac[beat - 1:beat + 2].max(), ac[2 * beat - 1:2 * beat + 2].max()))
    # chroma 80 Hz - 2 kHz
    sel = (f > 80) & (f < 2000)
    pc = np.round(12 * np.log2(f[sel] / 440.0) + 69).astype(int) % 12
    ch = np.array([P[sel][pc == k].sum() for k in range(12)])
    ch = ch / ch.sum()
    st = EM.short_term_lufs(x, 3.0, 0.5)
    st = st[st > -60]
    lra = float(np.percentile(st, 95) - np.percentile(st, 10)) if len(st) > 3 else 0.0
    return dict(centroid=cen, low_db=low, high_db=high, onsets_per_s=dens, pulse=pulse, lra=lra, chroma=ch.tolist())


def swing_share(mid):
    """Share of off-beat onsets at a swung position: the swung eighth (+10 frames) or the double-time swung
    sixteenth (+5 / +12.5 frames) on the 96 grid (15 frames a beat)."""
    import pretty_midi
    pm = pretty_midi.PrettyMIDI(mid)
    on = np.array([n.start for i in pm.instruments if not i.is_drum for n in i.notes])
    ph = (on * 24) % 15
    off = ph[(ph > 1.5) & (ph < 13.5)]
    if not len(off):
        return 0.0
    sw = ((off >= 9.3) & (off < 10.7)) | ((off >= 4.5) & (off < 5.5)) | ((off >= 12) & (off < 13))
    return round(float(sw.mean()), 2)


def main():
    rows = []
    for tid in TRACKS:
        cid = f'{tid}-album-edit' if tid in ALBUM_EDIT else tid
        c = json.load(open(f'{OST}/tracks/{tid}/render/{cid}.cue.json'))
        x = read(f'{OST}/tracks/{tid}/render/{tid}-album.wav')
        r = feats(x)
        b = c['qa']['balance']['balance']
        r.update(id=tid, mm=c.get('mm'), title=c['title'], balance=b,
                 swing_share=swing_share(f'{OST}/tracks/{tid}/render/{cid}.mid'))
        rows.append(r)
        print(tid, {k: (round(v, 2) if isinstance(v, float) else v) for k, v in r.items() if k not in ('chroma', 'title')},
              flush=True)
    r = feats(read(V1))
    r.update(id='MT-V1 (locked title)', mm='MT', title='The Knee (Main Title) V1', balance=V1_BAL,
             swing_share=swing_share('/home/jgon/project/art/mrmas/audio/theme/midi/theme-V1-chipchamber.mid'))
    rows.append(r)

    def vec(r):
        return np.array([np.log(r['centroid']), r['low_db'], r['high_db'], r['onsets_per_s'], r['pulse'], r['lra'],
                         r['balance']['piano'], r['balance']['orch'], r['balance']['bigband'], r['balance']['chip'],
                         100 * r['swing_share']] + list(np.array(r['chroma']) * 100))
    V = np.array([vec(r) for r in rows])
    Zs = (V - V.mean(0)) / (V.std(0) + 1e-9)
    w = np.array([1.0] * 11 + [1 / 3] * 12)
    Zs = Zs * w
    D = np.sqrt(((Zs[:, None] - Zs[None]) ** 2).sum(-1))
    off = D[~np.eye(len(rows), dtype=bool)]
    out = []
    for i, r in enumerate(rows):
        d = D[i].copy()
        d[i] = np.inf
        j = int(np.argmin(d))
        out.append(dict(id=r['id'], mm=r['mm'], nearest=rows[j]['id'], dist=round(float(d[j]), 2),
                        dist_to_title=round(float(D[i, -1]), 2),
                        feats={k: (round(v, 3) if isinstance(v, float) else v) for k, v in r.items()
                               if k not in ('id', 'mm', 'title')}))
    res = dict(median_pair_distance=round(float(np.median(off)), 2), min_pair=round(float(off.min()), 2),
               rows=out, matrix=[[round(float(v), 2) for v in row] for row in D], order=[r['id'] for r in rows])
    json.dump(res, open(os.path.join(os.path.dirname(__file__), 'distinct.json'), 'w'), indent=1)
    print('median pair distance', res['median_pair_distance'])
    for o in out:
        print(f"{o['id']:<38} nearest {o['nearest']:<38} {o['dist']:>5}  (to title {o['dist_to_title']})")


if __name__ == '__main__':
    main()
