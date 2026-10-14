#!/usr/bin/env python3
"""Arrange actual-lock 1080p stills four to a page, without resizing any shot.

Run through ops/heavy.sh with the casting Python. The locked-review.ts CLI
writes frames.json; its middle sample of every shot becomes these review pages.
These are still inspections, never evidence of watching motion or listening.
"""
import json,pathlib,sys
from PIL import Image,ImageDraw,ImageFont
base=pathlib.Path(sys.argv[1])
rows=json.loads((base/'frames.json').read_text())
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf',22)
for seg in dict.fromkeys(r['segment'] for r in rows):
 selected=[r for r in rows if r['segment']==seg and pathlib.Path(r['file']).stem.endswith('-1')]
 out=base/seg/'pages';out.mkdir(exist_ok=True)
 for start in range(0,len(selected),4):
  page=Image.new('RGB',(3840,2224),'#05070a');draw=ImageDraw.Draw(page)
  for index,row in enumerate(selected[start:start+4]):
   x=(index%2)*1920;y=(index//2)*1112
   picture=Image.open(row['file']).convert('RGB')
   assert picture.size==(1920,1080),picture.size
   page.paste(picture,(x,y));draw.text((x+15,y+1084),f"{seg} · {row['shot']} · {row['time']}",font=font,fill='#9cc8e4')
  page.save(out/f'page-{start//4+1:02}.png')
 print(seg,len(selected),'full-size shots',flush=True)
