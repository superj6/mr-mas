"""Per-section K-weighted loudness of every stem (LUFS) -> balance tool."""
import sys, os, json
import numpy as np, soundfile as sf, pyloudnorm as pyln
sys.path.insert(0, os.path.dirname(__file__))
from engine.core import SR, SPF
SECTIONS = [('T0 cold', 0, 119), ('T1 1993', 120, 179), ('T2 2008', 180, 239), ('T3 dinner', 240, 479),
            ('T4 rollcall', 480, 539), ('skyline', 540, 629), ('title', 630, 700)]
GROUPS = {'piano': ['piano'], 'orch': ['strings', 'winds', 'perc'], 'bigband': ['brass', 'harmon'], 'chip': ['chip'],
          'rhythm': ['bass', 'drums', 'sub'], 'fx': ['fx']}
def lufs(m, x):
    if x.shape[1] < int(0.45 * SR): x = np.pad(x, ((0, 0), (0, int(0.45 * SR) - x.shape[1])))
    try:
        v = m.integrated_loudness(x.T)
    except Exception:
        return -99
    return v if np.isfinite(v) else -99
def table(v):
    m = pyln.Meter(SR, block_size=0.4)
    stems = {}
    for f in sorted(os.listdir('stems')):
        if f.startswith(v + '-'):
            y, _ = sf.read('stems/' + f, always_2d=True); stems[f[len(v) + 1:-4]] = y.T
    master, _ = sf.read([f for f in os.listdir('.') if f.startswith(f'theme-{v}-') and f.endswith('.wav')][0], always_2d=True)
    names = list(stems)
    print(f'{"section":10s} {"MASTER":>7s} ' + ' '.join(f'{n[:7]:>7s}' for n in names))
    out = {}
    for s, a, b in SECTIONS:
        seg = slice(a * SPF, (b + 1) * SPF)
        row = {n: lufs(m, stems[n][:, seg]) for n in names}
        ml = lufs(m, master.T[:, seg])
        print(f'{s:10s} {ml:7.1f} ' + ' '.join(f'{row[n]:7.1f}' for n in names))
        # group loudness shares (power of K-weighted loudness)
        g = {}
        for gn, members in GROUPS.items():
            p = sum(10 ** (row[mm] / 10) for mm in members if mm in row and row[mm] > -90)
            g[gn] = p
        tot = sum(g.values()) + 1e-12
        out[s] = dict(master=round(ml, 1), stems={k: round(v2, 1) for k, v2 in row.items()},
                      share={k: round(100 * p / tot) for k, p in g.items()})
    # whole-piece share (legacy v2.0 metric: gated integrated loudness of each whole stem - it over-weights
    # stems that play only briefly, e.g. the bar-10 Harmon or the roll-call brass)
    g = {}
    for gn, members in GROUPS.items():
        g[gn] = sum(10 ** (lufs(m, stems[mm]) / 10) for mm in members if mm in stems)
    tot = sum(g.values())
    whole = {k: round(100 * p / tot) for k, p in g.items()}
    # v2.1 metric: time-weighted K-weighted loudness share (sum over the sections of duration x power),
    # with the rhythm section (bass, kit, sub) excluded - the VARIATIONS.md / SCRIPT s9.2 'balance'
    tw = {gn: 0.0 for gn in GROUPS}
    for s, a, b in SECTIONS:
        for gn, members in GROUPS.items():
            tw[gn] += (b + 1 - a) * sum(10 ** (out[s]['stems'][mm] / 10) for mm in members
                                        if mm in out[s]['stems'] and out[s]['stems'][mm] > -90)
    tot2 = sum(p for k, p in tw.items() if k not in ('rhythm', 'fx'))
    balance = {k: round(100 * tw[k] / tot2) for k in ('piano', 'orch', 'bigband', 'chip')}
    tot3 = sum(tw.values())
    rhythm_pct = round(100 * tw['rhythm'] / tot3)
    ex = {}
    for s, _, _ in SECTIONS:
        sh = out[s]['share']
        t_ = sum(sh[k] for k in ('piano', 'orch', 'bigband', 'chip')) or 1
        ex[s] = {k: round(100 * sh[k] / t_) for k in ('piano', 'orch', 'bigband', 'chip')}
        out[s]['share_ex_rhythm'] = ex[s]
    print('shares per section:'); [print(f'  {s:10s}', out[s]['share']) for s, _, _ in SECTIONS]
    print('shares per section, rhythm excluded:'); [print(f'  {s:10s}', ex[s]) for s, _, _ in SECTIONS]
    print('whole-piece loudness share (legacy gated):', whole)
    print('BALANCE (time-weighted, rhythm excluded) piano/orch/bigband/chip:', balance, f'(rhythm {rhythm_pct}% of all)')
    return out, dict(legacy_gated=whole, balance=balance, rhythm_pct_of_all=rhythm_pct)
if __name__ == '__main__':
    for v in sys.argv[1:]:
        o, w = table(v)
        json.dump(dict(sections=o, whole=w['balance'], legacy_gated=w['legacy_gated'],
                       rhythm_pct_of_all=w['rhythm_pct_of_all']), open(f'analysis/{v}_balance.json', 'w'), indent=1)
