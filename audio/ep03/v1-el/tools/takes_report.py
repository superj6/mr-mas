#!/usr/bin/env python3
"""Episode 3 local take report. Run through heavy.sh. No requests; no synthesized/retaken audio.

Exact inventory, file format/duration, stored level/peak/ASR checks and actionable watch-through flags.
"""
from __future__ import annotations
import argparse
from collections import Counter
import json
from pathlib import Path
import sys
sys.dont_write_bytecode=True
import soundfile as sf
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'.mrmas-root').exists())
SEGS=['coldopen','act1','act2','act3','act4','tag']

def read(p):return json.loads(p.read_text())

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--variant',choices=['kokoro','el'],default='kokoro')
    ap.add_argument('--segments',nargs='*',default=SEGS)
    args=ap.parse_args();result=[]
    for seg in args.segments:
        plan=read(ROOT/f'show/episodes/ep03/production/v1/beat-plan/{seg}.json')
        expected={l['id']:l for b in plan['beats'] for l in b.get('lines',[]) if l.get('text')}
        p=ROOT/(f'audio/ep03/v1/{seg}/lines-v1.json' if args.variant=='kokoro' else f'audio/ep03/v1-el/ep03-v1/{seg}/lines-A.json')
        rows=read(p);counts=Counter(r['id'] for r in rows);problems=[];flags=[];takes=[]
        for lid in sorted(set(expected)-set(counts)):problems.append(dict(id=lid,what='missing take'))
        for lid,n in counts.items():
            if n!=1:problems.append(dict(id=lid,what=f'{n} take rows'))
            if lid not in expected:flags.append(dict(id=lid,what='take no longer in current script'))
        for r in rows:
            lid=r['id'];q=r.get('qa') or {};f=ROOT/(r.get('file') or 'MISSING')
            if not f.is_file():problems.append(dict(id=lid,what='missing WAV'));continue
            info=sf.info(f)
            if info.samplerate!=48000 or info.channels!=1:problems.append(dict(id=lid,what=f'format {info.samplerate}/{info.channels}, expected 48000/mono'))
            if abs(info.duration-float(r.get('duration_s',info.duration)))>.05:problems.append(dict(id=lid,what='stored file duration differs'))
            target=-18 if r.get('kind')=='vo' or r.get('tag')=='V.O.' else -16
            if q.get('lufs_i') is not None and abs(q['lufs_i']-target)>.6:problems.append(dict(id=lid,what=f'level {q["lufs_i"]} vs {target}'))
            if q.get('true_peak_dbtp') is not None and q['true_peak_dbtp']> -1.45:problems.append(dict(id=lid,what=f'true peak {q["true_peak_dbtp"]}'))
            if q.get('clipped_samples',0)>0:problems.append(dict(id=lid,what='clipped samples'))
            recall=q.get('word_recall_nonames')
            if recall is not None and recall<.8:flags.append(dict(id=lid,what=f'ASR recall {recall}: {q.get("asr")}'))
            if r.get('text')!=expected.get(lid,{}).get('text'):problems.append(dict(id=lid,what='take text differs from plan'))
            takes.append(dict(id=lid,speaker=r.get('speaker_slug'),file=str(f.relative_to(ROOT)),duration_s=round(info.duration,3),
                              audible_s=r.get('voiced_span_s'),voice=r.get('voice'),lufs_i=q.get('lufs_i'),peak=q.get('true_peak_dbtp'),
                              asr=q.get('asr'),recall=recall))
        result.append(dict(segment=seg,rows=len(rows),expected=len(expected),problems=problems,flags=flags,takes=takes))
        print(seg,len(rows),'rows;',len(problems),'problems;',len(flags),'ASR flags')
    out=ROOT/f'show/episodes/ep03/production/v1/assembly/takes-{args.variant}-qa.json'
    doc=dict(method='Inventory and file metadata, stored house QA. No new ASR, no listening claim.',variant=args.variant,
             problems=sum(len(x['problems']) for x in result),flags=sum(len(x['flags']) for x in result),segments=result)
    out.write_text(json.dumps(doc,ensure_ascii=False,indent=1)+'\n')
    print('wrote',out.relative_to(ROOT))
    if doc['problems']:raise SystemExit(1)
if __name__=='__main__':main()
