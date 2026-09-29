#!/usr/bin/env python3
"""keyscan.py: check that no API key value is about to be committed or pushed. It never prints a value.

  python3 ops/keyscan.py                      # the staged changes (run before `git commit`)
  python3 ops/keyscan.py origin/main..HEAD    # the commits about to be pushed (run before `git push`)

Reads the values of ELEVEN_LABS_API_KEY and RUNWAY_API_KEY (and any other KEY=value line) from .env at the repo root,
then searches the full new content of every added or changed file (text and binary) for each value. Prints the number
of values checked and, for a hit, only the file name and which variable. Exit 1 on any hit, 2 if .env has no values.
.env and .secrets/ are only read here, never written.
"""
import os
import subprocess
import sys


def repo():
    for start in (os.path.dirname(os.path.abspath(__file__)), os.getcwd()):
        d = start
        while True:
            if os.path.exists(os.path.join(d, '.mrmas-root')) or os.path.isdir(os.path.join(d, '.git')):
                return d
            if d == os.path.dirname(d):
                break
            d = os.path.dirname(d)
    sys.exit('keyscan: no repo root above this script or the cwd; set MRMAS_ROOT')


REPO = os.environ.get('MRMAS_ROOT') or repo()


def git(*a, text=True):
    return subprocess.run(['git', *a], cwd=REPO, capture_output=True, text=text, check=True).stdout


def values():
    vals = {}
    path = os.path.join(REPO, '.env')
    if os.path.exists(path):
        for ln in open(path, errors='ignore'):
            ln = ln.strip()
            if not ln or ln.startswith('#') or '=' not in ln:
                continue
            k, v = ln.split('=', 1)
            k = k.replace('export ', '').strip()
            v = v.strip().strip('"\'')
            if len(v) >= 8:
                vals[k] = v.encode()
    return vals


def main():
    vals = values()
    if not vals:
        print('keyscan: no values in .env to check against')
        return 2
    rng = sys.argv[1] if len(sys.argv) > 1 else None
    if rng:
        names = git('diff', '--name-only', '--diff-filter=AMRC', '-z', rng).split('\0')
        rev = rng.split('..')[-1] or 'HEAD'
        blob = lambda f: git('show', f'{rev}:{f}', text=False)   # noqa: E731
        what = f'the files changed in {rng}'
    else:
        names = git('diff', '--cached', '--name-only', '--diff-filter=AMRC', '-z').split('\0')
        blob = lambda f: git('show', f':{f}', text=False)        # noqa: E731
        what = 'the staged files'
    names = [n for n in names if n]
    hits = []
    for f in names:
        data = blob(f)
        for k, v in vals.items():
            if v in data:
                hits.append((f, k))
    # the commit messages of a push range too
    if rng:
        msgs = git('log', '--format=%B', rng).encode()
        hits += [('(commit message)', k) for k, v in vals.items() if v in msgs]
    print(f'keyscan: {len(vals)} values ({", ".join(sorted(vals))}) checked in {len(names)} files ({what}); hits: {len(hits)}')
    for f, k in hits:
        print(f'  HIT {k} in {f}')
    return 1 if hits else 0


if __name__ == '__main__':
    sys.exit(main())
