#!/usr/bin/env python3
"""Spoiler-free Ep3 thumbnails from the delivered film, with the series fonts.

Run through ops/heavy.sh with audio/.venv-casting/bin/python after final assembly.
The frame, film hash and caption are recorded for every option. No API requests.
"""
import hashlib,json,os,pathlib,subprocess,tempfile
from PIL import Image,ImageDraw,ImageFont
from fontTools.ttLib import TTFont
ROOT=next(p for p in pathlib.Path(__file__).resolve().parents if (p/'.mrmas-root').exists())
OUT=ROOT/'out/ep03/v1/thumbnails';OUT.mkdir(parents=True,exist_ok=True)
FILM=ROOT/'out/ep03/v1/ep03-v1.mp4'
FFD=ROOT/'studio/node_modules/@remotion/compositor-linux-x64-gnu'
ENV={**os.environ,'LD_LIBRARY_PATH':str(FFD)}
LOCK=json.loads((ROOT/'show/episodes/ep03/production/v1/lock/coldopen.json').read_text())
def frame(shot):
 row=next(s for s in LOCK['shots'] if s['id']==shot)
 return LOCK['meta']['ep_in_frames']+(row['s']+row['e'])//2
with tempfile.TemporaryDirectory(prefix='mrmas-ep03-thumbs-') as scratch:
 scratch=pathlib.Path(scratch)
 def font(name,size):
  target=scratch/(name+'.ttf')
  if not target.exists():
   source=ROOT/f'studio/node_modules/@fontsource/{name}/files/{name}-latin-400-normal.woff'
   f=TTFont(source);f.flavor=None;f.save(target)
  return ImageFont.truetype(str(target),size)
 options=[
  ('thumb-1-orb.png',LOCK['summary']['frames']+110,'unclear which side.','#5ed1d7'),
  ('thumb-2-strawberry.png',frame('3.01'),"it's a strawberry.",'#5ed1d7'),
  ('thumb-3-morse.png',frame('2.01'),"it's morse.",'#f3edda')]
 records=[]
 for name,f,caption,col in options:
  # The bundled ffmpeg omits the select filter. Decode from the preceding
  # two-second GOP boundary and take the exact last RGB frame, as seam_frames.py does.
  start=(f//48)*2;count=f-start*24+1
  raw=subprocess.run([str(FFD/'ffmpeg'),'-v','error','-ss',str(start),'-i',str(FILM),'-frames:v',str(count),'-f','image2pipe','-c:v','rawvideo','-pix_fmt','rgb24','-'],env=ENV,check=True,capture_output=True).stdout
  size=1920*1080*3
  assert len(raw)==count*size,(f,count,len(raw))
  im=Image.frombytes('RGB',(1920,1080),raw[-size:]).resize((1280,720),Image.Resampling.NEAREST);d=ImageDraw.Draw(im)
  d.rectangle((0,540,1280,720),fill='#080c14');d.rectangle((44,34,584,99),fill='#080c14')
  d.text((57,45),'MR. MAS · EP. 3',font=font('silkscreen',36),fill='#f3edda')
  size=112
  while d.textlength(caption,font=font('vt323',size))>1164:size-=2
  d.text((58,548),caption,font=font('vt323',size),fill=col)
  d.text((62,662),'ep1.2_strawberry.jpg',font=font('vt323',39),fill='#b6b4ac')
  im.save(OUT/name);im.resize((320,180),Image.Resampling.LANCZOS).save(OUT/name.replace('.png','-small.png'))
  records.append(dict(file=name,frame=f,seconds=f/24,caption=caption))
 h=hashlib.sha256()
 with FILM.open('rb')as f:
  for chunk in iter(lambda:f.read(1024*1024),b''):h.update(chunk)
 (OUT/'provenance.json').write_text(json.dumps(dict(film=str(FILM.relative_to(ROOT)),sha256=h.hexdigest(),options=records),indent=2)+'\n')
 print(json.dumps(records,indent=2))
