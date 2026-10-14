#!/usr/bin/env python3
"""Generate six Ep2-compatible plans and the shooting script from _spec.py.

Dry run validates and reports speech/design time. --write writes JSON/script/estimates.
Runtime is natural line durations + marked gaps + designed business; no target fitting or
silent hold inflation. Recorded take duration, when found, replaces words-at-rate. No API.
"""
import argparse
import importlib.util
import json
import math
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[5]
spec = importlib.util.spec_from_file_location('ep3spec', HERE / '_spec.py')
S = importlib.util.module_from_spec(spec)
spec.loader.exec_module(S)
RATES = {'mas': 140, 'gerg': 190, 'mario': 165, 'rima': 165, 'maon': 160, 'nole': 170}
BANNED = re.compile(r'\b(plan|planned)\b|long game|all along|step one|that part i', re.I)

def read_floor(text):
    # Pixel windows quantize independently, so reserve one frame beyond rounded floor.
    return math.ceil(max(1.2,.25+.05*len(text))*24)/24+1/24

def words(s):
    return len(re.findall(r"[\w]+(?:['’][\w]+)*", s))

def takes():
    result = {}
    # Canonical delivered lists include carried stock lines such as Mario.
    # Never let an older stock list or snapshot win by lexicographic path order.
    paths=[ROOT/f'audio/ep03/v1-el/ep03-v1/{seg}/lines-A.json' for seg in S.SEGS]
    paths += [ROOT/f'audio/ep03/v1/{seg}/lines-v1.json' for seg in S.SEGS]
    for p in paths:
        if not p.exists():continue
        try:
            data=json.loads(p.read_text())
            rows=data if isinstance(data,list) else data.get('lines',[])
            for r in rows:
                pace=r.get('pace') or {}
                dur=r.get('voiced_span_s')
                if dur is None and pace.get('audible_out_s') is not None and pace.get('audible_in_s') is not None:
                    dur=float(pace['audible_out_s'])-float(pace['audible_in_s'])
                if dur is None:dur=r.get('dur_s',r.get('duration_s',r.get('dur')))
                if dur is not None:
                    result.setdefault(r['id'],float(dur))
        except (ValueError,KeyError,TypeError):
            pass
    return result

def route_line(source, raw):
    """Audio device/offscreen is separate from the off-screen factual attribution.

    A beat can contain an on-screen speaker and a filtered remote reply. Calls are
    deliberately covered by held sides: 17A.04 on Mas, 17A.05 on Gerg at the beach.
    Voice renders retain identical words/IDs; the mix/lock consumes this metadata.
    """
    bid, who=source['id'],raw['who']
    if raw.get('vo'):return 'V.O.',None,'vo'
    if who=='announcer':return 'O.S.','pa','speaker'
    if bid.startswith('11.') and who=='gerg':return 'O.S.','laptop','speaker'
    if bid=='12.06' and who=='mas':return 'O.S.','phone','call'
    if bid=='17A.04' and who=='gerg':return 'O.S.','phone','call'
    if bid=='17A.05' and who=='mas':return 'O.S.','phone','call'
    if bid.startswith('22.') and who=='maon':return 'O.S.','intercom','speaker'
    if bid=='7.02' and who=='maon':return 'O.S.',None,'on-mic'
    return '',None,'on-mic'

def build():
    recorded=takes(); result={}; seen=set(); total_words=0; reports=[]; voiced=[]
    for seg in S.SEGS:
        beats=[]; previous='(start)'; cast={}; scene_times={}; seg_words=0
        for source in S.NEW[seg]:
            b={k:source[k] for k in ('id','scene','mode','pace','frame','camera','set','set_id','room','chars','caption','picture','music','style')}
            if 'TWO SHOT' in b['frame'] or 'TWO-SHOT' in b['frame']:
                b['frame']='TWO-SHOT · '+b['frame'].replace('TWO SHOT','held pair').replace('TWO-SHOT','held pair')
                b['camera']=b['frame']
            b.update(action='new',after=previous,act=S.ACT[seg],lines=[],fix=['P','KEEP'])
            previous=b['id']; sc=S.SCENES[b['scene']]
            for who in b['chars']:
                assert who in S.CAST, f'unknown figure {who}'
                name,role=S.CAST[who];cast[who]=dict(name=name,role=role)
            t=source['head']; prev_line=None
            for raw in source['lines']:
                lid=raw['id']; assert lid not in seen, f'duplicate {lid}'; seen.add(lid)
                rate=120 if raw.get('vo') else RATES.get(raw['who'],165)
                duration=round(recorded.get(lid,max(0.7,words(raw['text'])*60/rate)),3)
                gap=raw.get('gap_s',.5) if prev_line else 0
                if prev_line:t+=gap
                line=dict(raw,new=True,after=prev_line or f"start+{source['head']}",gap_s=gap,
                          len_s=duration,t_s=round(t,3),take='new',
                          take_file=f'audio/ep03/v1/{seg}/{lid}.wav')
                line['fact_tag']=raw.get('tag','[INVENTED]')
                line['tag'],line['device'],line['mode']=route_line(source,raw)
                if line['tag']=='O.S.':line['os']=True
                b['lines'].append(line);t+=duration;prev_line=lid
                seg_words+=words(raw['text'])
                if raw.get('vo'):
                    assert not BANNED.search(raw['text']),f'on-the-nose thought {lid}'
                    assert raw['text']==raw['text'].lower(),f'uppercase thought {lid}'
                    voiced.append((lid,seg,b['scene'],raw['text']))
            if b['lines']:
                duration=t+source['air']
            else:
                duration=source['dur'] if source['dur'] is not None else max(2.5,source['head']+source['air'])
            # Read-floor is functional presentation time, never generic runtime padding.
            text_time=sum(read_floor(text) for kind,text in source['text'])
            duration=max(duration,text_time+.5)
            b['est_s']=round(duration,3)
            items=[];at=.25
            for kind,text in source['text']:
                assert not any(l.get('vo') for l in b['lines']) or kind not in ('rail','toast'),f'VO overlay {b["id"]}'
                length=read_floor(text)
                until=b['est_s']-.25 if source.get('text_mode')=='concurrent' else min(b['est_s'],at+length)
                items.append(dict(text=text,kind=kind,at=round(at,3),until=round(until,3)))
                if source.get('text_mode')!='concurrent':at=until+.1
            if items:
                # Sequential text windows avoid reading multiple paragraphs at once.
                need=items[-1]['until']+.3
                if need>b['est_s']:b['est_s']=round(need,3)
                b['onscreen_items']=items
                b['onscreen']={'add':[f'{i["text"]} ({i["at"]}-{i["until"]} s)' for i in items]}
            if source['sounds']:
                b['sounds']=[dict(name=name,at=0.,at_s=0.,gain=-20,new=True) for name in source['sounds']]
            if source['flashback']:b['flashback']=source['flashback']
            if 'LEAP' in source['style']:b['style_leap']=source['style']
            if source['first']:
                b['seq']=dict(id=b['scene'],place=sc['place'],time=sc['date'],side='')
                b['arrive']=dict(s=source['head'],what='room and people established before the exchange')
                b['jcut']=[dict(sound=sc['room'],lead_s=.6)]
            b['aftermath']=dict(s=source['air'] if b['lines'] else 0,what='changing listener/action; no generic frozen hold')
            b['tempo']=dict(pace=b['pace'],gaps={l['id']:l['gap_s'] for l in b['lines'][1:]})
            beats.append(b);scene_times[b['scene']]=scene_times.get(b['scene'],0)+b['est_s']
        for i,b in enumerate(beats):
            if i==len(beats)-1 or beats[i+1]['scene']!=b['scene']:
                b['transition']=dict(cause='previous choice/obstacle carries story',sound=S.SCENES[b['scene']]['seam'],matched_object=S.SCENES[b['scene']]['seam'])
        scenes=[dict(id=sc,**{k:v for k,v in S.SCENES[sc].items() if k not in ('seg','set','room','music','seam')},
                     target_s=round(seconds,3),estimate_s=round(seconds,3)) for sc,seconds in scene_times.items()]
        secs=round(sum(b['est_s'] for b in beats),3)
        result[seg]=dict(segment=seg,act=S.ACT[seg],title=S.ACT_TITLE[seg],source=None,
          _about='Episode 3 source-only new beats in Ep2 schema. est_s is natural speech + designed action, not a fitted target. _spec.py is authority; _build.py regenerates JSON and script. Recorded durations replace rate estimates when available.',
          story_s=dict(target=secs,estimate=secs),scenes=scenes,cast=cast,rooms=S.ROOMS,keep_parens=[],beats=beats)
        total_words+=seg_words
        reports.append(dict(segment=seg,seconds=secs,words=seg_words,beats=len(beats),scenes=scene_times))
    assert len(voiced)==16,f'expected 16 thoughts, got {len(voiced)}'
    assert len(seen)==len(S.NEW_LINES)+len(S.NEW_VO),'source line dropped'
    return result,reports,voiced,total_words,len(recorded)

def screenplay(plans,reports,voiced,total_words,recorded=0):
    out=['# ep1.2_strawberry.jpg — shooting script v1','',
     '> Source generated from `beat-plan/_spec.py` by `_build.py --write`. Edit the spec, never only this transcription. All dialogue is invented except clearly tagged original fragments on documents. The draft 3.6 file remains historical. Dates identify referenced public events; impossible staging is cartoon invention. The terrace/tag are an undated allegory, not a claimed visit or newly timed donation. Nothing here is a real-time watch/hearing.','',
     'Pixel primary. 1080p maximum. Whole-turn speech; held two-shots, listener shots on turns. Mas captions lowercase. No disclaimers/confidence labels in picture. Continuous location bed and sequence score; negative offsets used later for sound leads. Every VISUAL label is renderer metadata.','',
     '## Frame around the story','',
     'Cold open → 30 s intro (typed/spoken `near the singularity; unclear which side.` unchanged; MUTE / `now with voice (paused)` / dot .60) → 2 s filename alone → Acts One–Four → Tag → Orb B 15 s.','']
    for seg,p in plans.items():
        out+=['## '+S.ACT[seg]+' · '+S.ACT_TITLE[seg],'']
        current=None
        for b in p['beats']:
            if b['scene']!=current:
                current=b['scene'];sc=S.SCENES[current]
                seconds=next(x['target_s'] for x in p['scenes'] if x['id']==current)
                out+=[f'### {current}. {sc["title"]} · {sc["date"]} · {sc["place"]} · {seconds:.1f} s planned','',
                      f'Mode: {sc["mode"]}. Pace: {sc["pace"]}. Music: {sc["music"]}. Out: {sc["seam"]}.','']
            out+=[f'**{b["id"]} · {b["frame"]} · {b["est_s"]:.1f} s planned**','',b['picture'],'']
            if b.get('flashback'):out += ['Memory: '+b['flashback']+'.','']
            for item in b.get('onscreen_items',[]):out += [f'ON SCREEN ({item["kind"]}): `{item["text"]}`','']
            for l in b['lines']:
                who=S.CAST[l['who']][0]+(' (V.O.)' if l.get('vo') else '')
                out += [f'**{who}** `{l["id"]}` · {l.get("fact_tag",l["tag"])}',l['text'],'']
            if b.get('sounds'):out += ['SFX: '+', '.join(x['name'] for x in b['sounds'])+'.','']
    secs=sum(r['seconds'] for r in reports)
    out+=['## Source checks and handoff','',
     f'[M, source text] {total_words} words, {sum(len(b["lines"]) for p in plans.values() for b in p["beats"])} lines, {sum(r["beats"] for r in reports)} beats; sixteen inner thoughts. [J] Recorded audible spans for {recorded} lines plus designed action/read windows: {secs:.1f} s story; {secs+47:.1f} s with intro/card/outro. Frame quantization and motion review may change it. No episode-duration fitting.','',
     '| Segment | Source estimate | Words | Beats |','|---|---:|---:|---:|']
    out += [f'| {r["segment"]} | {r["seconds"]:.1f} s | {r["words"]} | {r["beats"]} |' for r in reports]
    out+=['','## Mas inner voice in order','','| ID | Act / scene | Thought |','|---|---|---|']
    out += [f'| {i} | {seg} / {sc} | {s} |' for i,seg,sc,s in voiced]
    out += ['','## Review log','',
     'Source review: the trophy/suitcase illustrative example changed to `The keys on the desk` → `are`, matching actual art. The source uses only backward attention links; weights and candidate bars are schematic, never claimed measurement. No raw-thinking transcript or twenty-second model benchmark. Mas sets preview, handover, financing and release choices; Gerg returns without an invitation. Personal donation is documented Dec13 before final Shipmas door; symbolic terrace check is explicitly a replay of the same contribution, not a new donation after Dec20. Quiet call, Rima exchange, investment pressure and rival publication keep complete middles. New scene estimates supersede rough proposal budget.','',
     'Human watch/listen still owed: whole-turn prosody, chronology and allegory clarity, genuine warmth, comedy at speed, technical explanation without lecture, text read time and hidden-reasoning metaphor. Metrics cannot resolve these.','',
     'Regenerate: `python3 show/episodes/ep03/production/v1/beat-plan/_build.py --write`. Programmatic takes/lock/picture/sound through pipeline; all heavy jobs via `ops/heavy.sh`. No API call occurs here.']
    return '\n'.join(out)+'\n'

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--write',action='store_true');a=ap.parse_args()
    plans,reports,voiced,total_words,nrec=build()
    print(json.dumps(dict(words=total_words,vo=len(voiced),recorded_durations=nrec,segments=reports,
                         story_s=round(sum(r['seconds'] for r in reports),3),film_s=round(sum(r['seconds'] for r in reports)+47,3)),indent=2))
    if a.write:
        for seg,p in plans.items():(HERE/(seg+'.json')).write_text(json.dumps(p,ensure_ascii=False,indent=2)+'\n')
        (HERE.parent/'script-v1.md').write_text(screenplay(plans,reports,voiced,total_words,nrec))
        (HERE.parent/'source-check.json').write_text(json.dumps(dict(reports=reports,voiced=voiced,words=total_words),ensure_ascii=False,indent=2)+'\n')
        print('WROTE six plans, script-v1.md and source-check.json')
