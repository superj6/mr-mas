"""Build OST tracks and refresh the OST index.

    ../.venv-theme/bin/python build.py                 # every track in tracks/ (folders starting with '_' skipped)
    ../.venv-theme/bin/python build.py t03-dinner _demo   # just these
    ../.venv-theme/bin/python build.py --index         # only rebuild ost-index.json from existing cue sheets
Folders starting with '_' (_demo, _template) are private: built only when named, never in ost-index.json.
Flags go through to the engine: --no-stems --no-loop --no-mp3 --loop-stems --verify-loop --workers N
Environment: OST_WORKERS=N caps render processes (default min(6, cores-1)).
"""
import argparse
import glob
import importlib.util
import json
import os
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from engine.export import build, ENGINE_VERSION   # noqa: E402

TRACKS = os.path.join(HERE, 'tracks')


def load(track_dir):
    path = os.path.join(track_dir, 'track.py')
    spec = importlib.util.spec_from_file_location(f'ost_track_{os.path.basename(track_dir)}', path)
    mod = importlib.util.module_from_spec(spec)
    sys.path.insert(0, track_dir)
    spec.loader.exec_module(mod)
    return mod


def published(track_dir_name):
    """Folders starting with '_' (the engine demo, the template, scratch) are private: never built by default and
    never listed in the published index."""
    return not track_dir_name.startswith('_')


def index(tracks_dir=TRACKS, out_path=None):
    rows = []
    for p in sorted(glob.glob(os.path.join(tracks_dir, '*', 'render', '*.cue.json'))):
        if not published(os.path.basename(os.path.dirname(os.path.dirname(p)))):
            continue
        with open(p) as fh:
            c = json.load(fh)
        if not published(str(c.get('id', ''))):
            continue
        rows.append(dict(id=c['id'], title=c['title'], tone=c.get('tone', ''), usage=c.get('usage', ''),
                         tags=c.get('tags', []), key=c.get('key', ''), bpm=c['timing']['bpm'],
                         duration_s=c['timing']['album_duration_s'],
                         loop_s=(c['loop'] or {}).get('seconds'), album_lufs=c['masters']['album']['measured']['lufs'],
                         underscore_lufs=c['masters']['underscore']['measured']['lufs'],
                         warnings=len(c.get('warnings', [])), cue_sheet=os.path.relpath(p, HERE)))
    out = dict(engine=ENGINE_VERSION, updated=time.strftime('%Y-%m-%dT%H:%M:%S'), tracks=rows)
    with open(out_path or os.path.join(HERE, 'ost-index.json'), 'w') as fh:
        json.dump(out, fh, indent=1)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('ids', nargs='*')
    ap.add_argument('--index', action='store_true')
    ap.add_argument('--no-stems', action='store_true')
    ap.add_argument('--no-loop', action='store_true')
    ap.add_argument('--no-mp3', action='store_true')
    ap.add_argument('--loop-stems', action='store_true')
    ap.add_argument('--workers', type=int, default=None)
    ap.add_argument('--verify-loop', action='store_true')
    a = ap.parse_args()
    if not a.index:
        ids = a.ids or sorted(d for d in os.listdir(TRACKS) if published(d)
                              and os.path.exists(os.path.join(TRACKS, d, 'track.py')))
        for tid in ids:
            d = os.path.join(TRACKS, tid)
            mod = load(d)
            sc = mod.build()
            build(sc, os.path.join(d, 'render'), sc.meta.get('id') or tid, stems=not a.no_stems, loop=not a.no_loop,
                  previews=not a.no_mp3, loop_stems=a.loop_stems, workers=a.workers, check_loop=a.verify_loop)
    ix = index()
    print(f"ost-index.json: {len(ix['tracks'])} tracks")


if __name__ == '__main__':
    main()
