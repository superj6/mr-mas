#!/usr/bin/env python3
"""Episode 3 takes driver. Plan/prepare send nothing; kokoro is local; elevenlabs spends only when explicitly run.

  python3 audio/ep03/v1-el/tools/takes.py prepare [seg ...]
  python3 audio/ep03/v1-el/tools/takes.py kokoro [seg ...]    # calls heavy.sh, workers=2
  python3 audio/ep03/v1-el/tools/takes.py adopt-kokoro [seg ...] # preview takes into canonical route, no API
  python3 audio/ep03/v1-el/tools/takes.py elevenlabs [seg ...] --dry-run
  python3 audio/ep03/v1-el/tools/takes.py elevenlabs [seg ...] --max-chars 6000

Every role has an explicit stock-voice mapping for the programmatic pass. The source Ep1 recorder is read-only.
"""
from __future__ import annotations
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
sys.dont_write_bytecode = True
ROOT = next(p for p in Path(__file__).resolve().parents if (p / '.mrmas-root').exists())
SEGS = ['coldopen', 'act1', 'act2', 'act3', 'act4', 'tag']
BP = ROOT / 'show/episodes/ep03/production/v1/beat-plan'
PY = ROOT / 'audio/.venv-casting/bin/python'
FAST = ROOT / 'audio/ep01/act4/dialogue/tools/fastrec/fastrec.py'
OUT = ROOT / 'audio/ep03/v1-el/ep03-v1'
# Explicit doubles for new roles in the offline first pass; final EL casting is independent.
DOUBLES = {
    'maon': 'alyi', 'corkboard-guy': 'sucram', 'second-truther': 'the-intern', 'lunchmas': 'terb',
    'auhsoj': 'gerg-mockbran', 'josh': 'gerg-mockbran', 'notnih': 'sucram', 'simed': 'radnus',
    'sozeb': 'nesnej', 'mit-kooc': 'egap', 'nivag-moswen': 'ttemme', 'moswen': 'ttemme', 'reneiw': 'neleh',
    'customer': 'tiled-employee', 'installer': 'photographer', 'investor': 'adelina', 'lifeguard': 'the-intern',
    'silhouette-ceo': 'nesnej', 'taco-truck-cook': 'photographer', 'cook': 'photographer',
    'staffer': 'tiled-employee', 'staffer2': 'tiled-employee', 'reporter': 'panel-host',
    'engineer': 'gerg-mockbran', 'intern': 'the-intern', 'rumpt': 'rumpt', 'o1': 'chatgtp',
    'o3': 'chatgtp', 'chatgpt': 'chatgtp', 'announcer': 'panel-host',
}

def read(p):
    return json.loads(p.read_text())

def write(p, data):
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(data, indent=1, ensure_ascii=False) + '\n')

def planned(seg):
    d=read(BP / f'{seg}.json')
    return [(b, l) for b in d['beats'] for l in (b.get('lines') or []) if l.get('text')]

def prepare(seg):
    cast=read(ROOT / 'audio/ep03/cast-kokoro.json')
    labels=cast['labels']; known=set(cast['voices']) | set(labels.values()) | {'mas-manalt-vo','mario','rumpt','the-intern','nesnej'}
    rows=[]
    for b,l in planned(seg):
        who=l['who']; slug=DOUBLES.get(who) or labels.get(who.upper()) or who
        if slug not in known:raise SystemExit(f'{l["id"]}: no explicit offline voice mapping for {who!r}')
        vo=bool(l.get('vo') or l.get('tag')=='V.O.')
        if vo and slug=='mas-manalt':slug+='-vo'
        rows.append(dict(id=l['id'], scene=b['id'], speaker=who.upper(), speaker_slug=who, voice_slug=slug,
                         text=l['text'], delivery=l.get('delivery'), kind='vo' if vo else 'dialogue',
                         tag=l.get('note') or '', mode='on-mic', on_camera='vo' if vo else 'on',
                         est_s=l.get('len_s'), shot=b['id'], side=b.get('side') or 'none'))
    path=ROOT / 'audio/ep03/v1' / seg / 'lines-in.json'
    write(path,rows)
    print(f'{seg}: {len(rows)} lines, {sum(len(x["text"]) for x in rows)} characters -> {path.relative_to(ROOT)}')
    return path

def run(cmd):
    print('$ '+' '.join(str(x) for x in cmd),flush=True)
    subprocess.run([str(x) for x in cmd], check=True, cwd=ROOT,
                   env=dict(os.environ, HF_HUB_OFFLINE='1', PYTHONDONTWRITEBYTECODE='1', OMP_NUM_THREADS='3'))

def main():
    a=argparse.ArgumentParser(description=__doc__)
    a.add_argument('mode', choices=['prepare','kokoro','adopt-kokoro','elevenlabs'])
    a.add_argument('segments', nargs='*', choices=SEGS)
    a.add_argument('--dry-run',action='store_true')
    a.add_argument('--max-chars',type=int,default=6000)
    a.add_argument('--force',action='store_true')
    args=a.parse_args();segs=args.segments or SEGS
    for seg in segs:
        kok=ROOT / 'audio/ep03/v1' / seg
        if args.mode in ('prepare','kokoro'):
            inp=prepare(seg)
            if args.mode=='kokoro':
                run(['bash',ROOT/'ops/heavy.sh',PY,FAST,'record','--lines',inp,'--out',kok,
                     '--lines-out',kok/'lines-v1.json','--cast',ROOT/'audio/ep03/cast-kokoro.json','--workers','2','--threads','3'])
                # A stock double changes the physical voice, never the story's speaker identity.
                rows=read(kok/'lines-v1.json');who={l['id']:l['who'] for _,l in planned(seg)}
                for r in rows:r['speaker_slug']=who[r['id']]
                write(kok/'lines-v1.json',rows)
        elif args.mode=='adopt-kokoro':
            dest=OUT/seg/'lines-A.json'
            if dest.exists() and not args.force:raise SystemExit(f'{dest}: exists; refusing to overwrite takes (use --force)')
            rows=read(kok/'lines-v1.json')
            for r in rows:r.update(engine='kokoro',take='kokoro',special='kokoro')
            write(dest,rows)
            print(f'{seg}: adopted {len(rows)} local takes (no API)')
        else:
            cmd=['bash',ROOT/'ops/heavy.sh',PY,Path(__file__).with_name('el_render.py'),'render',
                 '--lines',(ROOT/'show/reel/ep03-v1'/f'ep03-v1-{seg}.json') if (ROOT/'show/reel/ep03-v1'/f'ep03-v1-{seg}.json').exists() else BP/f'{seg}.json','--out',OUT/seg,'--sets','A','--max-chars',str(args.max_chars),
                 '--retry-bad','1','--retry-pitch','--target-lufs','-16','--vo-lufs','-18']
            auditions=ROOT/'audio/ep03/v1-el/auditions'
            if (auditions/'index.json').exists():
                chosen=read(auditions/'index.json').get('roles',{})
                reuse=[auditions/role/info['pick'] for role,info in chosen.items() if (auditions/role/info['pick']/'manifest.json').exists()]
                if reuse:cmd+=['--reuse',*[str(p) for p in reuse]]
            if args.dry_run:cmd+=['--dry-run']
            run(cmd)

if __name__=='__main__':main()
