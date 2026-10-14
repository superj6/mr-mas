// @ts-nocheck -- Node-only CLI, bundled with esbuild; the studio omits Node typings.
// Programmatic look development; small frame set through ops/heavy.sh.
import fs from 'node:fs';
import {Buf} from '../../../../shared/pixel/px';
import {writePNG} from '../../../../shared/pixel/png';
import {drawStory} from './story';
import type {PxShot} from '../types';
const dest=process.argv[2];if(!dest)throw new Error('gallery.ts OUTPUT');fs.mkdirSync(dest,{recursive:true});
const views=[['1','skyline-yarn'],['2','corkboard'],['3','strawberry-post'],['4','lobby-handover'],['5','beach'],['6','stadium-box'],['7','attention'],['8','stadium-shutter'],['11','door-interview'],['11','class-photo'],['12','breakout'],['13','veto-hydra'],['14','nonprofit'],['15','tpool-sale'],['16','nobel-monitor'],['18','writing-room'],['18','paper-bridge'],['19','paper-exodus'],['20','election'],['22','launch-aros'],['22','launch-elppa'],['22','launch-o3'],['23','terrace-nole'],['23','reflection'],['24','reveal-rumpt'],['25','frozen-bay']];
const sheet=new Buf(480*4,235*Math.ceil(views.length/4),0x05070a);
views.forEach(([scene,v],i)=>{
 const sh={id:`${scene}.01`,beats:[`${scene}.01`],scene,sceneS:0,cls:'W',picture:`VISUAL: ${v}`,does:'',texts:[],lines:[],chars:[],marks:{},s:0,e:400} as unknown as PxShot;
 const b=new Buf(480,270,0x05070a);drawStory(b,100,sh,100);writePNG(`${dest}/${v}.png`,480,270,b.c,4);
 for(let y=0;y<203;y++)for(let x=0;x<480;x++)sheet.set((i%4)*480+x,Math.floor(i/4)*235+y,b.get(x,y));
});
writePNG(`${dest}/sheet.png`,sheet.w,sheet.h,sheet.c);console.log(`Wrote ${views.length} 1080p plates plus contact sheet.`);
