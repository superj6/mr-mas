#!/usr/bin/env python3
"""Focused whole-line masker diagnosis against the actual premix; no audio or API mutations. Run via ops/heavy.sh."""
import argparse
import importlib.util
import json
from pathlib import Path
import sys
sys.dont_write_bytecode=True
HERE=Path(__file__).resolve().parent
sp=importlib.util.spec_from_file_location('ep3audit',HERE/'sound_audit.py');A=importlib.util.module_from_spec(sp);sp.loader.exec_module(A)
M,S=A.M,A.S
ROOT=Path(A.ROOT)
def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('segments',nargs='*');ap.add_argument('--out',required=True);a=ap.parse_args()
 out=Path(a.out);data={}
 for seg in a.segments or A.SEGS:
  if seg not in A.SEGS:raise SystemExit(f'unknown segment {seg}')
  A._line_audio_cache.clear();p=S.timeline_path(seg,'el');g=S.Seg(seg,json.load(open(p)),p)
  P=M.premix(seg,g,'el',True,keep_buses=True)
  rows=A.line_whole(seg,g,P['buses'],'el');weak=[r for r in rows if not r['ok']]
  data[seg]=dict(lines=len(rows),weak=len(weak),rows=rows)
  print(seg,len(rows),'measured',len(weak),'weak',flush=True)
  for r in weak:print(r['line'],r['p10_db'],r['component_p10_db'],flush=True)
  out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(data,indent=1)+'\n')
  del P
if __name__=='__main__':main()
