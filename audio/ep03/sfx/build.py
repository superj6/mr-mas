#!/usr/bin/env python3
"""Episode 3's deterministic local ambience and missing foley. Heavy: run via ops/heavy.sh.
Writes only audio/ep03/sfx/wav and manifest.json. Existing shared board sounds are read-only/reused.
"""
from __future__ import annotations
import hashlib
import json
from pathlib import Path
import zlib
import numpy as np
import soundfile as sf
from scipy.signal import butter,sosfilt
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'.mrmas-root').exists())
HERE=Path(__file__).resolve().parent
SR=48000

def rng(name):return np.random.default_rng(zlib.crc32(name.encode()))
def noise(n,r,low=0,high=5000):
    y=r.normal(0,1,n+4096)
    if low and high:y=sosfilt(butter(2,[low,high],btype='bandpass',fs=SR,output='sos'),y)
    elif high:y=sosfilt(butter(2,high,btype='lowpass',fs=SR,output='sos'),y)
    return y[-n:]
def env(n,a=.015,d=.2):
    t=np.arange(n)/SR
    return np.minimum(1,t/max(.001,a))*np.minimum(1,(n/SR-t)/max(.001,d))
def modal(t,tones,decay):return sum(w*np.sin(2*np.pi*f*t)*np.exp(-t*decay/(1+i*.25)) for i,(f,w) in enumerate(tones))
def bed(name):
    r=rng(name);n=SR*16;t=np.arange(n)/SR
    if 'beach' in name:
        wave=(.3+.7*(.5+.5*np.sin(2*np.pi*t/5.33))**2)
        y=noise(n,r,100,5500)*wave+.22*noise(n,r,0,220)
    elif 'stadium' in name:
        y=noise(n,r,180,2300)*(.65+.35*np.sin(2*np.pi*t/4)**2)
        y+=.10*np.sin(2*np.pi*127*t)*(.5+.5*np.sin(2*np.pi*t/8))
    elif any(x in name for x in ['city','alley','parking']):
        y=noise(n,r,0,1500)*(.65+.35*np.sin(2*np.pi*t/8)**2)+.10*np.sin(2*np.pi*61*t)
    elif any(x in name for x in ['roof','terrace','ice']):
        y=noise(n,r,0,1000)*(.55+.45*np.sin(2*np.pi*t/8)**2)
        y+=.15*noise(n,r,500,4500)
        if 'ice' in name:y+=.13*np.sin(2*np.pi*47*t+1.5*np.sin(2*np.pi*t/16))
    elif 'paper' in name:
        y=noise(n,r,900,5000)*(.45+.55*np.sin(2*np.pi*t/2.0)**4)+.08*noise(n,r,0,500)
    elif 'dinner' in name:
        y=noise(n,r,120,1700)*.8+.03*np.sin(2*np.pi*1200*t)*np.sin(2*np.pi*t/8)**20
    else:
        y=noise(n,r,0,1100)*.65+.15*np.sin(2*np.pi*59*t)+.06*np.sin(2*np.pi*118*t)
    # Small crossfade at the loop seam, not an extended fade to black.
    k=SR//10;u=np.linspace(0,1,k)
    tail=y[-k:].copy();head=y[:k].copy();edge=.5*(y[0]+y[-1])
    y[:k]=edge*(1-u)+head*u;y[-k:]=tail*(1-u)+edge*u
    return y

def foley(name):
    r=rng(name)
    seconds={'shutter_clang':2.5,'paper_unfurl':2.8,'generator_cough':2.1,'band_march':5.0,
             'surf':4.0,'sleigh':3.0,'palms':3.0,'ice_creak':2.4,'phone_ring':2.0}.get(name,1.0)
    n=int(SR*seconds);t=np.arange(n)/SR
    if name=='surf':return bed('bed_ep3_beach')[:n]*env(n,.2,.5)
    if name=='palms':return noise(n,r,700,4800)*(.2+.8*np.sin(2*np.pi*t/1.7)**2)*env(n,.1,.3)
    if name=='gull':
        f=800+700*np.sin(np.pi*np.minimum(1,t/.7))
        return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-((t-.3)/.18)**2)+.3*np.sin(2*np.pi*np.cumsum(f*1.9)/SR)*np.exp(-((t-.42)/.18)**2)
    if name=='band_march':
        y=np.zeros(n)
        for at in np.arange(0,seconds,.625):
            k=int(at*SR);m=min(n-k,int(.3*SR));tt=np.arange(m)/SR
            y[k:k+m]+=noise(m,r,650,5000)*np.exp(-tt*22)+.4*np.sin(2*np.pi*80*tt)*np.exp(-tt*15)
        return y*env(n,.003,.15)
    if any(x in name for x in ['paper','calendar','sand','door_gale','door_whoosh']):
        low=500 if 'sand' in name else 1000
        return noise(n,r,low,6500)*np.sin(np.pi*np.minimum(1,t/seconds))**1.3*env(n,.015,.12)
    if name=='phone_ring':
        gate=((t%1.0)<.45).astype(float)
        return (np.sin(2*np.pi*440*t)+.6*np.sin(2*np.pi*480*t))*gate*env(n,.01,.05)
    if any(x in name for x in ['yarn','rope','reflection','ice']):
        f=190 if 'yarn' in name else (60 if 'ice' in name else 115)
        return modal(t,[(f,1),(f*2.01,.5),(f*3.08,.22)],4)*env(n,.006,.08)+.15*noise(n,r,80,1100)*np.exp(-t*8)
    if any(x in name for x in ['shredder','generator','podium','sleigh']):
        freq=90 if 'generator' in name else 140
        y=noise(n,r,80,2500)*(.4+.6*np.sin(2*np.pi*freq*t)**2)
        if 'generator' in name:y*=np.exp(-((t-.1)/.1)**2)+np.exp(-((t-.45)/.15)**2)+np.exp(-((t-.9)/.3)**2)
        if 'sleigh' in name:y+=modal(t,[(920,.2),(1417,.18),(2345,.1)],1.5)
        return y*env(n,.01,.15)
    if any(x in name for x in ['hat_bell','medal','clink','shutter']):
        f=170 if 'shutter' in name else 720
        return (modal(t,[(f,1),(f*1.71,.5),(f*3.13,.32),(f*4.47,.1)],3)+.15*noise(n,r,1200,6500)*np.exp(-t*40))*env(n,.002,.08)
    # Wood/plastic, tactile desk ticks, and weighty cartoon impacts use different modal bodies.
    low=any(x in name for x in ['drop','ceiling','mammoth','kick','clunk','veto'])
    f=75 if low else 760
    return (modal(t,[(f,1),(f*1.43,.35),(f*2.9,.15)],14 if low else 35)+noise(n,r,120,6000)*np.exp(-t*(35 if low else 90)))*env(n,.002,.08)

def main():
    out=HERE/'wav';out.mkdir(exist_ok=True)
    rooms=['city_day','alley_day','roof_day','beach_day','stadium','alley_night','dinner','governor_office',
           'parking_lot','beach_night','writing_room','paper','terrace','ice']
    names={s['name'] for p in (ROOT/'show/episodes/ep03/production/v1/beat-plan').glob('*.json')
           for b in json.loads(p.read_text())['beats'] for s in b.get('sounds',[])}
    rows=[]
    for name in ['bed_ep3_'+s for s in rooms]+sorted(names):
        if not name.startswith('bed_ep3_') and (ROOT/f'audio/sfx/wav/{name}.wav').exists():
            rows.append(dict(id=name,reused=f'audio/sfx/wav/{name}.wav'));continue
        y=bed(name) if name.startswith('bed_ep3_') else foley(name)
        y=np.asarray(y,dtype=np.float64);y*=10**(-3/20)/(np.max(np.abs(y))+1e-12)
        stereo=np.stack([y,.97*y+.03*np.roll(y,173)],axis=1).astype(np.float32)
        p=out/f'{name}.wav';sf.write(p,stereo,SR,subtype='PCM_24')
        rows.append(dict(id=name,file=str(p.relative_to(ROOT)),samples=len(y),rate=SR,
                         sha1=hashlib.sha1(p.read_bytes()).hexdigest(),method='deterministic procedural sound, no generated speech'))
        print(name,round(len(y)/SR,3),'s',flush=True)
    (HERE/'manifest.json').write_text(json.dumps(rows,indent=1)+'\n')
    print('local assets',sum('file' in r for r in rows),'shared reused',sum('reused' in r for r in rows))
if __name__=='__main__':main()
