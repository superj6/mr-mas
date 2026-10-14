"""Episode 3's continuous scene score. Lock-driven sections, 96 BPM, chip, knee cells, open fifths.

One performance per act avoids cue fragments. Mood changes come from the scene's declared music, not beat cuts.
Sample calibration writes only this episode's private ignored cache. Renders/measurements require heavy.sh.
"""
from __future__ import annotations
import math
import os
from pathlib import Path
import shutil
import sys
sys.dont_write_bytecode = True
import v3lib as V


def private_cache():
    from engine import sampler
    cache=Path(__file__).parent/'cache'
    cache.mkdir(parents=True,exist_ok=True)
    src=Path(V.REPO)/'audio/ost/cache/calib.json'
    if src.exists() and not (cache/'calib.json').exists():shutil.copyfile(src,cache/'calib.json')
    sampler.CACHE=str(cache)


def mood(text):
    t=text.lower()
    if t.startswith('none') or any(x in t for x in ['no score','unscored','designed quiet','designed silence']):return 'silence'
    cue = __import__('re').search(r'e03-(\d+)', t)
    if cue:
        return {1:'dry',2:'warm',3:'pressure',4:'blueprint',5:'drive',6:'pressure',7:'drive',8:'warm',
                9:'dry',10:'pressure',11:'warm',12:'pressure',13:'warm',14:'drive',15:'drive',
                16:'warm',17:'drive',18:'pressure',19:'pressure'}.get(int(cue.group(1)),'pressure')
    if any(x in t for x in ['warm','loyal','friend','dinner','2015','woodrose','human','flashback']):return 'warm'
    if any(x in t for x in ['blueprint','attention','plan sheet','jumbotron']):return 'blueprint'
    if any(x in t for x in ['triumph','shipmas','launch','platform','upbeat','race','sleigh']):return 'drive'
    if any(x in t for x in ['comic','corkboard','conspiracy','truck','cook']):return 'dry'
    return 'pressure'


def sections(tl):
    out=[]
    for b in tl.beats:
        sc=str((b['b'].get('passes') or {}).get('scene') or b['id'])
        text=next((x.split(': ',1)[1] for x in b['b'].get('cues',[]) if x.startswith('music (v')), '')
        colour=mood(text)
        if out and out[-1]['scene']==sc and out[-1]['mood']==colour:out[-1]['end']=b['t1']
        else:out.append(dict(scene=sc,mood=colour,text=text,start=b['t0'],end=b['t1']))
    return out


def compose(seg,tl):
    name=f'e03-v1-{seg}-continuous'
    c=V.Cue(name,tl,anchor=0,bars=math.ceil(tl.length/V.BAR)+2,swing=0.6)
    T=V.palette()
    for inst,gain in [('lead',-11),('felt',-5),('vibes',-9),('celesta',-10),('ubass',-5),('brush',-13),('drone',-7)]:
        if inst in T:T[inst].gain_db=gain
    ss=sections(tl);designed=[]
    colours={
        'pressure':dict(roots=['F2','C3'],upper=['F4','C5','G4','C5'],lead=['F5','F5','G5'],step=2.5,vel=.35),
        'warm':dict(roots=['Db3','Ab3'],upper=['Db5','Ab4','Eb5','Ab4'],lead=['F5','F5','F5'],step=2.5,vel=.38),
        'blueprint':dict(roots=['F3','C4'],upper=['F5','C5','G5','C5'],lead=['F6','F6','G6'],step=1.875,vel=.32),
        'drive':dict(roots=['Bb2','F3'],upper=['Bb4','F5','C5','F5'],lead=['G5','Ab5','C6'],step=1.25,vel=.42),
        'dry':dict(roots=['F2','C3'],upper=['F4','C5','Eb5','C5'],lead=['F5','F5','F5'],step=2.5,vel=.33),
    }
    for s in ss:
        a,b=s['start'],s['end'];m=s['mood'];c.section(f'scene {s["scene"]}: {m}',a,b)
        if m=='silence':
            designed.append(dict(t0=a,t1=b,why=s['text'] or 'the scene asks for no score'))
            continue
        p=colours[m]
        # Rebow the fifth in overlapping phrases so a dialogue scene never becomes separated hits.
        t=a;i=0
        while t<b:
            end=min(b,t+6.0)
            c.n('drone',p['roots'][0],t,max(.05,end-t),p['vel']*.65,True,
                pitches=p['roots'],fade_in=.35 if i==0 else .12,fade_out=.3)
            t+=5.0;i+=1
        t=a;i=0
        inst='vibes' if m=='warm' else ('celesta' if m=='blueprint' else 'felt')
        while t<b-.05:
            d=min(p['step']*.85,b-t)
            c.n(inst,p['upper'][i%4],t,max(.05,d),p['vel']*(.85 if i%2 else 1),True)
            if i%2==0:c.n('ubass',p['roots'][(i//2)%2],t,min(1.0,b-t),p['vel']*.6,True)
            if m in ('drive','dry') and i%2==1:c.n('brush',38,t,min(.18,b-t),.22,True)
            i+=1;t=a+i*p['step']
        # A cell of the knee, not its completed eight-note statement; the credits own the whole knee.
        t=a+.625
        while t<b-.1:
            for i,n in enumerate(p['lead']):
                at=t+i*V.Q/2
                if at<b-.08:c.n('lead',n,at,min(V.Q*.23,b-at),.25,True,duty=.25)
            t+=10.0 if m=='warm' else 7.5
    V.thin(c,{k:dict(soften={'lead':.18,'felt':.6,'vibes':.7,'celesta':.55,'brush':.6})
              for k in ['real','vo','mas','talk']})
    sc=c.finish(T,dict(id=name,title=f'Episode 3 {seg}: a continuous scene score',key='open fifths; no third',
                      family='knee cells / chip / chamber',knee_whole_ok=False,album_lufs=-23,underscore_lufs=-24),
                length_end=tl.length,end_fade=(max(0,tl.length-.2),tl.length))
    return c,sc,ss,designed


def main(seg,here):
    args,path,tag=V.cli(seg)
    tl=V.TL(path);c,sc,ss,designed=compose(seg,tl)
    noteqa=V.note_qa(sc)
    if args.dry:
        print(seg,tl.frames,'frames',noteqa)
        for s in ss:print(s)
        return
    if not noteqa['written_third_ok']:raise SystemExit(f'written harmony check failed: {noteqa}')
    private_cache()
    work=os.path.join(here,'render','_work','el' if tag=='-el' else 'kokoro')
    if args.render is not None:print('render seconds',round(V.render_cue(sc,work),2),flush=True)
    out=os.path.join(here,'render',f'music{tag}.wav')
    layers=[dict(name=sc.name,wav=os.path.join(work,f'{sc.name}-underscore.wav'),T0=0,a0=0,a1=tl.length,fin=.08,fout=.16,level=-24)]
    stops=[(s['t0'],s['t1']) for s in designed]
    mix,laid=V.assemble(tl,layers,out,stops=stops,designed=[(s['t0'],s['t1'],s['why']) for s in designed])
    rows=[(f'scene {s["scene"]}: {s["mood"]}',s['start'],s['end']) for s in ss]
    res=V.measure(tl,mix,{sc.name:(0,tl.length)},rows,[(s['t0'],s['t1'],s['why']) for s in designed])
    doc=dict(schema='mrmas-reel-music/1',id=f'e03-v1-{seg}{tag}',segment=seg,file=os.path.relpath(out,V.REPO),
             timeline=os.path.relpath(path,V.REPO),lock_sha1=V.lock_sha1(path),length_s=tl.length,
             frames=tl.frames,samples=tl.samples,sample_rate=V.SR,channels=2,clock='segment clock, frame 0',
             cues=[dict(cue=sc.name,start=0,end=tl.length,laid_at_s=0,duck_db=10.5,note_qa=noteqa,scenes=ss)],
             silences_designed=designed,designed_hit=[],claims_sfx=[],
             measured=res,laid=laid,source=os.path.relpath(__file__,V.REPO),
             heard='No human listening claim; measured programmatic first pass.')
    V.write_json(os.path.join(here,'render',f'cues{tag}.json'),doc)
    print('wrote',out,'exact',res['exact'],flush=True)
