// @ts-nocheck -- Node-only review CLI; studio intentionally omits Node typings.
// Samples the real show host at three points in every locked shot, including
// its rails, inner voice and subtitles. These are stills, not a motion review.
import fs from 'node:fs';
import path from 'node:path';
import {Buf} from '../../../../shared/pixel/px';
import {writePNG} from '../../../../shared/pixel/png';
import {prepare,native,tcOf} from '../frame';
import {SEGMENT as coldopen} from '../coldopen/shots';
import {SEGMENT as act1} from '../act1/shots';
import {SEGMENT as act2} from '../act2/shots';
import {SEGMENT as act3} from '../act3/shots';
import {SEGMENT as act4} from '../act4/shots';
import {SEGMENT as tag} from '../tag/shots';
import {pt} from '../kit';
const dest=process.argv[2];if(!dest)throw new Error('OUTPUT required');
const specs={coldopen,act1,act2,act3,act4,tag};
const requested=process.argv.slice(3);const keys=requested.length?requested:Object.keys(specs);
fs.mkdirSync(dest,{recursive:true});const report=[];
for(const key of keys){
 const seg=prepare(specs[key]),out=path.join(dest,key);fs.mkdirSync(out,{recursive:true});const cells=[];
 if(seg.standins.length||seg.problems.length)throw new Error(JSON.stringify({standins:seg.standins,problems:seg.problems}));
 for(const sh of seg.shots){
  const len=sh.e-sh.s,frames=[sh.s+Math.min(18,len-1),Math.floor((sh.s+sh.e)/2),Math.max(sh.s,sh.e-9)];
  for(const [index,f]of frames.entries()){
   const n=native(seg,f);if(n.host!=='layout'||n.fallback)throw new Error(`${key}/${sh.id}/${f}: ${n.host}, fallback=${n.fallback}`);
   const file=path.join(out,`${sh.id}-${index}.png`);writePNG(file,480,270,n.fb.c,4);
   const cell=new Buf(480,286,0x05070a);for(let y=0;y<270;y++)for(let x=0;x<480;x++)cell.set(x,y,n.fb.get(x,y));
   pt(cell,`${sh.id} · ${tcOf(seg,f)} · ${f-sh.s}/${len}`,9,276,0x9cc8e4);cells.push(cell);
   report.push({segment:key,shot:sh.id,frame:f,time:tcOf(seg,f),file});
  }
 }
 const sheet=new Buf(1440,Math.ceil(cells.length/3)*286,0x05070a);cells.forEach((cell,i)=>{for(let y=0;y<286;y++)for(let x=0;x<480;x++)sheet.set((i%3)*480+x,Math.floor(i/3)*286+y,cell.get(x,y));});
 writePNG(path.join(out,'sheet.png'),sheet.w,sheet.h,sheet.c);console.log(key,seg.shots.length,'shots; first/middle/last, no host failures');
}
fs.writeFileSync(path.join(dest,'frames.json'),JSON.stringify(report,null,2)+'\n');
