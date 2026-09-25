"""Piano-roll of a score (for checking voicings/timing by eye)."""
import sys, os, importlib
import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
sys.path.insert(0, os.path.dirname(__file__))
v = sys.argv[1]; a0 = float(sys.argv[2]) if len(sys.argv) > 2 else 0; a1 = float(sys.argv[3]) if len(sys.argv) > 3 else 720
sc = importlib.import_module(f'score.{v.lower()}').build()
stem_of = {k: t.stem for k, t in sc.tracks.items()}
cols = dict(piano='k', strings='tab:green', brass='tab:red', winds='tab:olive', bass='tab:brown', chip='tab:blue', perc='tab:purple', sub='gray', drums='tab:orange', fx='pink', harmon='tab:cyan')
fig, ax = plt.subplots(figsize=(22, 11))
for n in sc.notes:
    if n.start + n.dur < a0 or n.start > a1: continue
    st = stem_of.get(n.inst, 'fx')
    if st in ('drums', 'fx', 'sub') and n.inst not in ('sub',): continue
    ax.plot([n.start, n.start + n.dur], [n.pitch, n.pitch], color=cols.get(st, 'k'), lw=2.5, alpha=0.6, solid_capstyle='butt')
for b in range(0, 721, 15): ax.axvline(b, color='gray', lw=0.3 if b % 60 else 1.0, alpha=0.5)
ax.set_xlim(a0, a1); ax.set_ylim(20, 105); ax.set_yticks(range(24, 106, 12)); ax.set_yticklabels([f'C{o}' for o in range(1, 8)])
ax.grid(axis='y', alpha=0.3)
plt.tight_layout(); plt.savefig(f'analysis/{v}_roll_{int(a0)}_{int(a1)}.png', dpi=60)
