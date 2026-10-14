#!/usr/bin/env python3
"""Reconcile Ep3 outro voice credits with actual takes. Metadata only, no requests or audio processing."""
import argparse
import json
from pathlib import Path
import re
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'.mrmas-root').exists())
SEGS=['coldopen','act1','act2','act3','act4','tag']

def short_stock(voice):
    parts=[]
    for v in voice.split('+'):
        v=re.sub(r'^(?:am|af|bm|bf)_','',v.split('*')[0]).strip()
        if v and v not in parts:parts.append(v)
    return ' + '.join(parts)

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--variant',choices=['kokoro','el'],required=True)
    a=ap.parse_args();cast=json.loads((ROOT/'audio/ep03/cast-el.json').read_text());rows={};library={}
    for seg in SEGS:
        plan=json.loads((ROOT/f'show/episodes/ep03/production/v1/beat-plan/{seg}.json').read_text())
        expected={l['id']:l['who'] for b in plan['beats'] for l in b.get('lines',[])}
        p=ROOT/(f'audio/ep03/v1/{seg}/lines-v1.json' if a.variant=='kokoro' else f'audio/ep03/v1-el/ep03-v1/{seg}/lines-A.json')
        for r in json.loads(p.read_text()):
            who=expected.get(r['id'])
            if who is None:continue
            if a.variant=='kokoro' or r.get('engine')=='kokoro':name=short_stock(r.get('voiceId') or 'stock voice')
            else:
                role=cast['labels'].get(who) or cast['labels'].get(who.upper()) or who
                rd=cast['roles'][role];base=cast['roles'].get(rd.get('derived_from')) or rd
                picked=((cast.get('set_cand') or {}).get('A') or {}).get(role,'A')
                v=next(c for c in base['candidates'] if c['cand']==picked)
                # Actual take metadata is authoritative if the cast registry was subsequently changed.
                full=(r.get('el') or {}).get('voice_name') or v['voice_name']
                voice_id=(r.get('el') or {}).get('voice_id') or r.get('voiceId') or v['voice_id']
                name=re.split(r'\s+[–—-]\s+',full)[0].lower()
                library[who]=(voice_id,full,name)
            rows.setdefault(who,name)
    # Different library voices can share a first name; retain a short descriptor only where necessary.
    ids_by_base={}
    for voice_id,full,name in library.values():ids_by_base.setdefault(name,set()).add(voice_id)
    for who,(voice_id,full,name) in library.items():
        if len(ids_by_base[name])>1:
            parts=re.split(r'\s+[–—-]\s+',full,maxsplit=1)
            descriptor=re.findall(r'[A-Za-z]+',parts[1] if len(parts)>1 else '')
            short=descriptor[0].lower() if descriptor else 'library'
            rows[who]=f'{name} ({short})'
    labels={'corkboard-guy':'corkboard guy','second-truther':'second truther','mit-kooc':'mit kooc'}
    items=[[labels.get(k,k.replace('-',' ')),v] for k,v in rows.items()]
    middle=(len(items)+1)//2
    p=ROOT/'studio/src/episodes/ep03/outro/timeline.ts';s=p.read_text()
    for group,data in [('A',items[:middle]),('B',items[middle:])]:
        pattern=rf'export const CAST_{group}: Array<\[string, string\]> = \[[\s\S]*?\n\];'
        replacement=f'export const CAST_{group}: Array<[string, string]> = '+json.dumps(data,ensure_ascii=False,indent=2)+';'
        s,n=re.subn(pattern,lambda _:replacement,s,count=1)
        if n!=1:raise SystemExit('cast page array not found')
    s=re.sub(r"export const CAST_HEAD = '[^']*';", "export const CAST_HEAD = 'voices · role: voice';",s)
    p.write_text(s)
    print(f'{a.variant}: {len(items)} actual speaking roles, {middle}/{len(items)-middle} rows')
    for k,v in items:print(k,':',v)
if __name__=='__main__':main()
