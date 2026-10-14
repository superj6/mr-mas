// @ts-nocheck -- Node CLI, exercised through esbuild; studio omits Node typings.
// Cheap motion review: first/middle/last drawings of every source beat before lock.
import fs from 'node:fs';
import path from 'node:path';
import {Buf} from '../../../../shared/pixel/px';
import {writePNG} from '../../../../shared/pixel/png';
import {drawStory} from './story';
import {drawTexts} from '../text';
import {pt} from '../kit';
const root=process.cwd(),dest=process.argv[2];if(!dest)throw new Error('OUTPUT required');
const segs=process.argv.slice(3);if(!segs.length)segs.push('coldopen','act1','act2','act3','act4','tag');
fs.mkdirSync(dest,{recursive:true});
for(const seg of segs){
 const plan=JSON.parse(fs.readFileSync(path.join(root,'show/episodes/ep03/production/v1/beat-plan',seg+'.json'),'utf8'));
 const rows=[];const out=path.join(dest,seg);fs.mkdirSync(out,{recursive:true});
 for(const beat of plan.beats){
  const len=Math.round(beat.est_s*24);
  const frames=[Math.min(18,len-1),Math.floor(len/2),Math.max(0,len-9)];
  for(const [index,k] of frames.entries()){
   const sh={id:beat.id,beats:[beat.id],scene:beat.scene,sceneS:0,cls:/MCU|CLOSE/.test(beat.frame)?'MCU':/ECU|INSERT/.test(beat.frame)?'ECU':'W',picture:beat.picture,does:beat.caption,framing:beat.frame,texts:(beat.onscreen_items??[]).filter(t=>t.kind!=='rail').map(t=>({kind:t.kind,text:t.text,s:Math.round(t.at*24),e:Math.round(t.until*24)})),lines:beat.lines.map(l=>({id:l.id,who:plan.cast[l.who]?.name??l.who.toUpperCase(),kind:l.vo?'vo':'dialogue',os:!!l.os,mode:l.mode??'on-mic',s:Math.round(l.t_s*24),e:Math.round((l.t_s+l.len_s)*24),mouth:[],words:[],face:'room'})),chars:beat.chars.map(c=>plan.cast[c]?.name??c.toUpperCase()),marks:{},s:0,e:len};
   const b=new Buf(480,270,0x05070a);drawStory(b,k,sh,k);pt(b,`${beat.id} · ${index+1}/3 · ${k}/${len}`,12,219,0x9cc8e4);writePNG(path.join(out,`${beat.id}-${index}.png`),480,270,b.c,4);rows.push(b);
  }
 }
 const cols=3,cellH=236,sheet=new Buf(cols*480,Math.ceil(rows.length/cols)*cellH,0x05070a);
 rows.forEach((b,i)=>{for(let y=0;y<cellH;y++)for(let x=0;x<480;x++)sheet.set((i%cols)*480+x,Math.floor(i/cols)*cellH+y,b.get(x,y));});
 writePNG(path.join(out,'sheet.png'),sheet.w,sheet.h,sheet.c);console.log(seg,plan.beats.length,'beats × 3 frames, no drawing exceptions');
}
