#!/usr/bin/env python3
"""Sum recorded Episode 3 provider cost headers; no API calls or key access."""
import argparse
import json
from pathlib import Path
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'.mrmas-root').exists())
def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--out');a=ap.parse_args()
    base=ROOT/'audio/ep03/v1-el';groups={};all_calls=[]
    for name,pattern in [('auditions','auditions/*/*/manifest.json'),('film','ep03-v1/*/manifest.json')]:
        calls=[]
        for p in sorted(base.glob(pattern)):
            for r in json.loads(p.read_text()).get('calls',[]):calls.append(dict(r,manifest=str(p.relative_to(ROOT))))
        # A copied manifest is not another request: unique request key plus provider request id identifies paid work.
        seen=set();unique=[]
        for r in calls:
            key=(r.get('key'),r.get('request_id'),r.get('at'))
            if key not in seen:seen.add(key);unique.append(r)
        values=[float(r['cost_header']) for r in unique if r.get('cost_header') is not None]
        groups[name]=dict(requests=len(unique),sent_characters=sum(r.get('chars',0) for r in unique),
                          credit_headers_present=len(values),real_credits=sum(values) if len(values)==len(unique) else None)
        all_calls+=unique
    values=[float(r['cost_header']) for r in all_calls if r.get('cost_header') is not None]
    d=dict(groups=groups,total_requests=len(all_calls),sent_characters=sum(r.get('chars',0) for r in all_calls),
           real_credits=sum(values) if len(values)==len(all_calls) else None,missing_credit_headers=len(all_calls)-len(values),
           method='Provider character-cost headers on recorded successful calls, including retakes; cache reuse spends zero.',calls=all_calls)
    if a.out:
        p=Path(a.out);p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(d,indent=1)+'\n')
    print(json.dumps({k:v for k,v in d.items() if k!='calls'},indent=1))
if __name__=='__main__':main()
