#!/usr/bin/env python3
"""Compare the preserved pre-rail stock locks with current date-rail locks. JSON and small audio-head reads only."""
from collections import Counter
from pathlib import Path
import hashlib
import json
import math
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'.mrmas-root').exists())
BASE=ROOT/'show/episodes/ep03/production/v1'
ASM=BASE/'assembly'
SEGS=['coldopen','act1','act2','act3','act4','tag']
def read(p):return json.loads(p.read_text())
def signature(items):return Counter(items)
def main():
 failures=[];segments={};total_old=total_new=total_source=0
 for seg in SEGS:
  old=read(ASM/f'programmatic-pass/inputs/show/episodes/ep03/production/v1/lock/{seg}.json')
  new=read(BASE/f'lock/{seg}.json')
  plan=read(BASE/f'beat-plan/{seg}.json');master=read(ROOT/f'show/reel/ep03-v1-el/ep03-v1-el-{seg}.json')
  source=signature((b['id'],o['text'].removeprefix('RAIL: ')) for b in plan['beats'] for o in b.get('onscreen_items',[]) if o.get('kind')=='rail')
  intended=signature((b['id'],o['text'].removeprefix('RAIL: ')) for b in master['beats'] for o in b.get('onscreen',[]) if isinstance(o,dict) and o.get('kind')=='rail')
  delivered=signature((r['shot'],r['text']) for r in new['rails'])
  checks=dict(frames_unchanged=old['summary']['frames']==new['summary']['frames'],
              episode_offset_unchanged=old['meta']['ep_in_frames']==new['meta']['ep_in_frames'],
              lines_unchanged=old['lines']==new['lines'],sound_marks_unchanged=old['sound_marks']==new['sound_marks'],
              subtitles_unchanged=old['subs']==new['subs'],plan_master_delivered_rails_match=source==intended==delivered)
  removed=[];remaining=[];other_shot_changes=[]
  for a,b in zip(old['shots'],new['shots']):
   assert a['id']==b['id']
   keep=[]
   for t in a['texts']:
    if t['kind']=='label' and (a['id'],t['text']) in delivered:
     removed.append((a['id'],t['text'],a['s']+t['s'],a['s']+t['e']))
    else:keep.append(t)
   if keep!=b['texts']:other_shot_changes.append(a['id'])
   for t in b['texts']:
    if (b['id'],t['text']) in delivered:remaining.append((b['id'],t['text']))
   aa={k:v for k,v in a.items() if k!='texts'};bb={k:v for k,v in b.items() if k!='texts'}
   if aa!=bb:other_shot_changes.append(a['id']+':other-fields')
  checks['only_old_generic_date_labels_removed']=not other_shot_changes and not remaining and signature(removed)==signature((r['shot'],r['text'],r['s'],r['e']) for r in new['rails'])
  rails=[]
  for r in new['rails']:
   type_frames=math.ceil(len(r['text'])/2) # frame.ts: band typed=(f-r.s)*2, slice floors its endpoint
   full_ink=r['e']-r['s']-type_frames
   overlaps=[l['id'] for l in new['lines'] if l.get('kind')=='vo' and l['abs_in']<r['e'] and r['s']<l['abs_out']+15]
   rails.append(dict(**r,typing_frames=type_frames,full_ink_frames=full_ink,full_ink_at_least_floor=full_ink>=r['floor_f'],vo_overlaps_including_15f_tail=overlaps))
  checks['full_ink_floors_pass']=all(r['full_ink_at_least_floor'] for r in rails)
  checks['no_vo_overlap_with_full_tail']=all(not r['vo_overlaps_including_15f_tail'] for r in rails)
  failures += [f'{seg}: {k}' for k,v in checks.items() if not v]
  segments[seg]=dict(checks=checks,old_rails=len(old['rails']),new_rails=len(new['rails']),source_explicit_rails=sum(source.values()),generic_date_labels_removed=len(removed),other_shot_changes=other_shot_changes,rails=rails)
  total_old+=len(old['rails']);total_new+=len(new['rails']);total_source+=sum(source.values())
 audio=[]
 for c in read(ASM/'programmatic-pass/v1-assembly.json')['chapters']:
  p=ROOT/c['audio']
  with p.open('rb') as f:head=hashlib.md5(f.read(1<<20)).hexdigest()[:12]
  audio.append(dict(chapter=c['id'],file=c['audio'],preserved_head_md5=c['audio_head_md5'],current_head_md5=head,unchanged=head==c['audio_head_md5']))
 if not all(r['unchanged'] for r in audio):failures.append('chapter audio head fingerprint changed')
 if (total_old,total_new,total_source)!=(0,13,13):failures.append('expected intentional date count0→13 with13 source items')
 report=dict(comparison='Preserved pre-rail programmatic cut versus corrected canonical stock picture locks',
  segments=segments,date_rail_counts=dict(before=total_old,after=total_new,source=total_source),
  audio=dict(line_file_references_and_timing_unchanged=True,chapter_head_md5=audio,all_nine_heads_unchanged=all(r['unchanged'] for r in audio),
             method='Exact lock line-array equality and first1MiB MD5 against preserved assembly records; no full-file pre-correction audio hash baseline is claimed'),
  voiceover_tail_frames=15,rail_typing_glyphs_per_frame=2,failures=failures,passed=not failures)
 (ASM/'rail-correction.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(dict(date_rail_counts=report['date_rail_counts'],audio_heads_unchanged=report['audio']['all_nine_heads_unchanged'],failures=failures,passed=not failures),indent=2))
 if failures:raise SystemExit(1)
if __name__=='__main__':main()
