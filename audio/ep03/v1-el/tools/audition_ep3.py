#!/usr/bin/env python3
"""Fresh Episode 3 library auditions for Maon, Corkboard Guy and Rumpt.
plan writes scene-line inputs and prints cost only; render spends under explicit caps after the programmatic cut.
measure selects by real take metrics, never claims listening; report records actual cost headers.
"""
from __future__ import annotations
import argparse
import copy
import json
import math
import os
from pathlib import Path
import re
import statistics
import subprocess
import sys
sys.dont_write_bytecode=True
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'.mrmas-root').exists())
HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
import el_render as R
import elaudio as E
import numpy as np
SEGS=['coldopen','act1','act2','act3','act4','tag']
ROLES=['maon','corkboard-guy','rumpt']
OUT=ROOT/'audio/ep03/v1-el/auditions'
PY=ROOT/'audio/.venv-casting/bin/python'

def load(p):return json.loads(p.read_text())
def save(p,d):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(d,ensure_ascii=False,indent=1)+'\n')
def selected(role):
    rows=[]
    for seg in SEGS:
        for b in load(ROOT/f'show/reel/ep03-v1/ep03-v1-{seg}.json')['beats']:
            for l in b.get('lines',[]):
                if l['who']==role:rows.append((b,l))
    long=max(rows,key=lambda x:len(x[1]['text']))
    more=[x for x in rows if x[1]['id']!=long[1]['id']]
    out=[long]+([min(more,key=lambda x:len(x[1]['text']))] if more else [])
    beats=[dict(id=b['id'],lines=[l]) for b,l in out]
    if not more:
        beats.append(dict(id='audition-context',lines=[dict(id='e3-aud-rumpt-context',who=role,tag='',
             text="We're going to put the number at the top of the page. Say a number.")]))
    return dict(beats=beats,note='Actual script turns; Rumpt context line is audition-only, never in film.')

def commands(role,letter,dry=False):
    cmd=['bash',str(ROOT/'ops/heavy.sh'),str(PY),str(HERE/'el_render.py'),'render','--lines',str(OUT/role/'input.json'),
         '--out',str(OUT/role/letter),'--sets','A','--cand',f'{role}={letter}','--max-chars','1500','--retry-bad','1',
         '--target-lufs','-16','--vo-lufs','-18']
    if dry:cmd+=['--dry-run']
    return cmd

def raw_metrics(row):
    key=(row.get('el') or {}).get('request_key')
    p=ROOT/'audio/ep03/v1-el/cache'/f'{key}.mp3'
    y=E.decode(p.read_bytes());n=int(.02*E.SR);m=len(y)//n
    rms=20*np.log10(np.sqrt(np.mean(y[:m*n].reshape(m,n)**2,axis=1))+1e-7)
    floor=float(np.percentile(rms,5));speech=float(np.median(rms[rms>=rms.max()-20]))
    return dict(floor_p5_dbfs=round(floor,1),speech_to_floor_db=round(speech-floor,1))

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('mode',choices=['plan','render','measure'])
    ap.add_argument('--dry-run',action='store_true')
    a=ap.parse_args()
    if a.mode=='measure' and os.environ.get('MRMAS_EP3_AUD_MEASURE')!='1':
        env=dict(os.environ,MRMAS_EP3_AUD_MEASURE='1',PYTHONDONTWRITEBYTECODE='1')
        os.execve('/usr/bin/bash',['bash',str(ROOT/'ops/heavy.sh'),sys.executable,str(Path(__file__).resolve()),'measure'],env)
    cast=load(ROOT/'audio/ep03/cast-el.json')
    if a.mode=='plan':
        for role in ROLES:
            d=selected(role);save(OUT/role/'input.json',d)
            chars=sum(len(l['text']) for b in d['beats'] for l in b['lines'])*3
            print(role,'baseline',chars,'script characters for 3 candidates; cap 1500 per candidate including retake')
            for letter in ['A','B','C']:print('$ '+' '.join(commands(role,letter,True)))
        return
    if a.mode=='render':
        for role in ROLES:
            if not (OUT/role/'input.json').exists():raise SystemExit('run plan first')
            for letter in ['A','B','C']:
                subprocess.run(commands(role,letter,a.dry_run),check=True,cwd=ROOT,
                               env=dict(__import__('os').environ,HF_HUB_OFFLINE='1',PYTHONDONTWRITEBYTECODE='1'))
        return
    # Resolve carried speakers exactly as the production recorder does; featured auditions avoid main cast IDs.
    registry=R.Cast(str(ROOT/'audio/ep03/cast-el.json'))
    existing={};main_ids={}
    speakers={l['who'] for seg in SEGS for b in load(ROOT/f'show/reel/ep03-v1/ep03-v1-{seg}.json')['beats'] for l in b.get('lines',[])}
    for speaker in speakers-set(ROLES):
        role=registry.role_of(speaker)
        if registry.engine(role,'v1')=='kokoro':continue
        letter=cast.get('set_cand',{}).get('A',{}).get(role,'A');candidate,_=registry.voice(role,letter)
        existing.setdefault(candidate['voice_id'],[]).append(speaker)
        if speaker in ['mas','gerg','nole','mario','rima','adelina','auhsoj','chatgtp']:
            main_ids.setdefault(candidate['voice_id'],[]).append(speaker)
    results={};used=set();calls=[]
    for role in ROLES:
        ranked=[]
        for letter in ['A','B','C']:
            path=OUT/role/letter/'lines-A.json';rows=load(path);c=next(x for x in cast['roles'][role]['candidates'] if x['cand']==letter)
            q=[x.get('qa') or {} for x in rows];long=[x for x in rows if len(x['text'].split())>=5]
            f0=[x['qa']['median_f0_hz'] for x in long if x.get('qa',{}).get('median_f0_hz')]
            lane=(90,140) if role=='rumpt' else ((105,150) if role=='maon' else (115,180))
            hz=statistics.median(f0) if f0 else None
            penalty=0 if hz is None or lane[0]<=hz<=lane[1] else min(abs(12*math.log2(hz/lane[0])),abs(12*math.log2(hz/lane[1])))
            penalty+=sum(5*(1-x.get('word_recall_nonames',0))+4*bool(x.get('raw_tail_cut')) for x in q)
            penalty+=sum(1 for x in q if (x.get('true_peak_dbtp') or -99)>-1.45)
            raw=[raw_metrics(x) for x in rows]
            worst_floor=min(x['speech_to_floor_db'] for x in raw)
            penalty+=max(0,(45-worst_floor)/5)
            target=160 if role=='maon' else (180 if role=='corkboard-guy' else 155)
            pace=[(x.get('pace') or {}).get('wpm') for x in long]
            pace=[x for x in pace if x]
            if pace:penalty+=max(0,abs(statistics.median(pace)/target-1)-.15)*10
            duplicate_main=main_ids.get(c['voice_id'],[])
            duplicate_existing=existing.get(c['voice_id'],[])
            if c['voice_id'] in used or duplicate_main:penalty+=20
            ranked.append(dict(candidate=letter,voice=c['voice_name'],voice_id=c['voice_id'],duplicates_main=duplicate_main,duplicates_existing=duplicate_existing,score=round(penalty,3),median_f0_hz=hz,raw_floor=raw,median_wpm=statistics.median(pace) if pace else None,
                               rows=[dict(id=x['id'],text=x['text'],file=x['file'],qa=x.get('qa'),voice=x.get('voice')) for x in rows]))
            man=load(OUT/role/letter/'manifest.json');calls+=man.get('calls',[])
        ranked.sort(key=lambda x:x['score']);pick=ranked[0];letter=pick['candidate']
        c=next(x for x in cast['roles'][role]['candidates'] if x['cand']==letter);used.add(c['voice_id'])
        cast.setdefault('set_cand',{}).setdefault('A',{})[role]=letter
        results[role]=dict(pick=letter,voice=pick['voice'],ranked=ranked,
                           limitation='Measured scene reads; no human listen. Acting/timbre/neighbor separation remain ear checks; pitch, pace, raw floor, recall, tail and level scored.')
        print(role,'picked',letter,pick['voice'],'score',pick['score'])
    save(ROOT/'audio/ep03/cast-el.json',cast)
    costs=[float(x['cost_header']) for x in calls if x.get('cost_header') is not None]
    report=dict(roles=results,existing_library_usage=existing,featured_main_voice_ids=main_ids,requests=len(calls),sent_characters=sum(x.get('chars',0) for x in calls),
                real_credit_cost=sum(costs) if len(costs)==len(calls) else None,
                credit_headers_present=len(costs),calls=calls,heard=False)
    save(OUT/'index.json',report)
    print('requests',len(calls),'actual credits',report['real_credit_cost'],'sent characters',report['sent_characters'])
if __name__=='__main__':main()
