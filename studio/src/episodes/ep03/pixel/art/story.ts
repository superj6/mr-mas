// Episode 3 picture: explicit visual families, selected by the shooting script's
// VISUAL marks. This file never draws production notes or documentary captions.
import {Buf,ellipse,line,poly,clamp} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {drawTexts} from '../text';
import type {PxShot} from '../types';
import type {LayoutOut} from '../spec';
import {pwrap,paper,vramp} from '../../../ep02/pixel/art/kit';
import {drawMammoth,drawIris} from '../../../ep02/pixel/art/creatures';
import {drawChatBubble} from '../../../../shared/pixel/cast/chatgtp';
import {podiumPainter as ep2Podium} from '../../../ep02/pixel/tag/sets/screen';
import * as A from './world';
import {drawAct1} from './act1';
import {drawAct2,ownsAct2Text} from './act2';
import {drawAct3} from './act3';
import {drawAct4} from './act4';

const simple=(s:string)=>s.toUpperCase().replace(/-/g,' ').replace('MIT KOOC','MIT KOOC').replace('CORKBOARD GUY','CORKBOARD GUY');
function active(sh:PxShot,k:number){return sh.lines.find(l=>l.kind==='dialogue'&&!l.os&&k>=l.s&&k<l.e)?.who??sh.lines.find(l=>l.kind==='dialogue'&&!l.os)?.who??'';}
function pictureNote(sh:PxShot){return `${sh.picture??''} ${sh.does??''}`.toLowerCase();}
function visual(sh:PxShot){return /VISUAL:\s*([a-z0-9-]+)/i.exec(sh.picture??'')?.[1]??'';}
function bodyText(b:Buf,s:string,x:number,y:number,width=390,col=PAL.N1){pwrap(s,width).forEach((v,i)=>A.pt(b,v,x,y+i*12,col));}
function document(b:Buf,sh:PxShot,k:number,title:string){
  A.fill(b,29,17,422,166,PAL.N0);A.fill(b,25,13,422,166,PAL.P2);A.fill(b,25,13,422,3,PAL.W6);A.pt(b,title,42,28,PAL.N1);
  let y=51;
  const ts=sh.texts.filter(t=>k>=t.s&&k<t.e&&!['plate','card','toast'].includes(t.kind));
  for(const t of ts){const rows=pwrap(t.text,382);rows.forEach(v=>{A.pt(b,v,42,y,PAL.N1);y+=12;});y+=8;}
  for(let i=0;i<5;i++)A.fill(b,42,y+i*9,300-i*23,1,PAL.G4);
}
function attention(b:Buf,k:number,sh:PxShot){
  A.fill(b,0,0,480,203,PAL.N1);for(let y=0;y<203;y+=12)A.fill(b,0,y,480,1,PAL.N2);for(let x=0;x<480;x+=12)A.fill(b,x,0,1,203,PAL.N2);
  A.center(b,'THE NEXT TOKEN',16,PAL.C7);
  const words=['The','keys','on','the','desk'];let x=29;const centers:number[]=[];
  for(let i=0;i<words.length;i++){const w=A.pw(words[i])+15;A.fill(b,x,53,w,20,PAL.N0);if(k>=i*10)A.pt(b,words[i],x+7,60,i===1?PAL.W7:PAL.C7);centers.push(x+w/2);x+=w+6;}
  A.fill(b,x,53,34,20,PAL.C3);A.pt(b,'?',x+14,60,PAL.P2);
  // Mask is causal: arrows only lead from earlier words into the empty next slot.
  if(k>=55)for(let i=0;i<centers.length;i++){const y=84+i*5;line(centers[i],75,centers[i],y,b.ink(i===1?PAL.W7:PAL.C4));line(centers[i],y,x+17,y,b.ink(i===1?PAL.W7:PAL.C4));line(x+17,y,x+17,76,b.ink(i===1?PAL.W7:PAL.C4));if(i===1)line(x+14,81,x+17,76,b.ink(PAL.W7));}
  const cands=[['are',116],['is',47],['were',27]] as const;
  if(k>=70)cands.forEach(([s,w],i)=>{A.pt(b,s,89,124+i*19,PAL.P2);A.fill(b,130,122+i*19,w,10,i===0?PAL.W6:PAL.C3);});
  A.tiny(b,'ILLUSTRATIVE CANDIDATES',286,160,PAL.N6);
  if(k>Math.min(240,(sh.e-sh.s)*.65)){A.fill(b,x,53,34,20,PAL.W6);A.pt(b,'are',x+6,60,PAL.N1);A.pt(b,'Then choose again.',286,124,PAL.C7);A.fill(b,x+41,53,26,20,PAL.N0);A.pt(b,'?',x+51,60,PAL.C7);}
}
function newsMonitor(b:Buf,k:number,sh:PxShot,v:string){
  A.darkroom(b,k,sh);
  // Draw type at the native picture grid inside the monitor. Rendering a whole
  // room to a thumbnail would drop strokes and make these public facts unreadable.
  A.bezel(b,68,9,344,183,{face:PAL.N3,hi:PAL.G5,lo:PAL.N0,t:6});A.fill(b,75,16,330,169,PAL.N1);
  if(v==='election'){
    A.center(b,'NOV 2024 · ELECTION RESULT',59,PAL.N7);A.center(b,'RUMPT WINS',99,PAL.W6);
    A.fill(b,105,145,268,1,PAL.N4);
  }else if(v==='nobel-monitor'){
    A.pt(b,'OCT 8 · PHYSICS NOBEL',103,38,PAL.W6);A.pt(b,'OCT 9 · CHEMISTRY NOBEL',103,113,PAL.W6);
    for(const y of [77,153]){line(223,y-20,236,y,b.ink(PAL.R2));line(253,y-20,240,y,b.ink(PAL.R2));ellipse(238,y,13,13,b.ink(PAL.W5));ellipse(238,y,9,9,b.ink(PAL.W7));}
    for(let i=0;i<12;i++){line(289+i*6,145+Math.round(Math.sin(i*.6)*13),295+i*6,145+Math.round(Math.sin((i+1)*.6)*13),b.ink(PAL.C6));line(289+i*6,146+Math.round(Math.sin(i*.6)*13),295+i*6,146+Math.round(Math.sin((i+1)*.6)*13),b.ink(PAL.C4));}
  }else{
    A.center(b,'NOV 2024 · +$4B · $8B TOTAL',34,PAL.W6);
    // The invented invoice gag sits beside the factual investment label.
    A.fill(b,103,111,113,41,PAL.W3);A.fill(b,208,123,46,29,PAL.W3);A.fill(b,216,128,24,15,PAL.C6);
    A.pt(b,'NOZAMA',115,124,PAL.N1);for(const x of [122,228])ellipse(x,155,9,9,b.ink(PAL.N0));
    A.fill(b,273,86,92,57,PAL.P1);A.pt(b,'RENT',291,102,PAL.N1);A.pt(b,'INVOICE',281,117,PAL.N1);
    A.fill(b,269,152,100,6,PAL.D3);A.fill(b,279,143,28,9,PAL.W5);A.fill(b,331,143,29,9,PAL.P1);
    line(319,132,319,153,b.ink(PAL.W6));line(287,140,345,140,b.ink(PAL.W6));
  }
}
function woodrose(b:Buf,k:number,sh:PxShot,v:string){
  vramp(b,0,0,480,203,[PAL.D0,PAL.D1,PAL.D2]);for(let i=0;i<6;i++){A.fill(b,i*83,0,3,203,PAL.W2);A.fill(b,i*83+6,0,1,203,PAL.D3);}
  for(let i=0;i<6;i++){const x=58+i*72;A.fill(b,x-13,68,27,49,PAL.D0);A.actor(b,['MAS','GERG','MARIO','NOLE','LUNCHMAS','INVESTOR'][i],x,141,sh,k,i>2);}
  poly([53,115,419,115,479,182,0,182],b.ink(PAL.D3));A.fill(b,0,181,480,4,PAL.W3);
  for(let i=0;i<5;i++){const x=62+i*83;A.fill(b,x,96,3,21,PAL.P2);ellipse(x+1,91+(Math.floor(k/8)%2),2,5,b.ink(PAL.W7));ellipse(x+1,118,8,2,b.ink(PAL.W5));}
  if(v.includes('breakout')){A.bezel(b,121,93,63,40,{face:PAL.N0,t:3});A.fill(b,125,97,55,30,PAL.N0);for(let i=0;i<18;i++)A.fill(b,128+(i%6)*8,100+Math.floor(i/6)*4,7,3,[PAL.R2,PAL.W6,PAL.C6][Math.floor(i/6)]);A.fill(b,139+Math.floor(k/5)%21,123,11,2,PAL.P2);A.fill(b,129+(Math.floor(k/3)%43),116-(Math.floor(k/6)%10),2,2,PAL.P2);}
  if(v.includes('chairs'))for(const x of [205,277,349,421])A.fill(b,x-16,67,35,48,PAL.N0);
  A.fill(b,0,0,480,4,PAL.L3);A.fill(b,0,199,480,4,PAL.L3); // Gerg's remembered rim.
}
function veto(b:Buf,k:number,sh:PxShot){
  vramp(b,0,0,480,203,[PAL.N2,PAL.N3,PAL.N5]);for(let x=16;x<480;x+=84){A.fill(b,x,17,53,122,PAL.N2);A.fill(b,x,17,53,2,PAL.W4);}
  A.actor(b,'MOSWEN',176,177,sh,k);A.actor(b,'RENEIW',345,187,sh,k,true);
  A.fill(b,67,139,214,10,PAL.D4);A.fill(b,76,149,197,54,PAL.D2);A.fill(b,108,131,91,8,PAL.P2);
  const popped=/vetoed|pop|stump|veto/.test(pictureNote(sh))&&(/stamp|head|message|pocket/.test(pictureNote(sh)));
  ellipse(321,180,16,10,b.ink(PAL.L2));A.fill(b,314,181,4,12,PAL.L1);A.fill(b,329,181,4,12,PAL.L1);
  if(!popped){line(325,175,329,154,b.ink(PAL.L3));ellipse(333,150,9,6,b.ink(PAL.L3));A.fill(b,337,146,2,2,PAL.N0);A.tiny(b,'1047',322,158,PAL.P2);}else{A.fill(b,325,169,6,6,PAL.P2);ellipse(375,191,9,6,b.ink(PAL.L3));}
  line(326,162,345,144,b.ink(PAL.W4));
}
function launch(b:Buf,k:number,sh:PxShot,v:string){
  A.lobby(b,k,sh,{industrial:true,valuation:'$157,000,000,000',photoHole:true,shipmas:true,spin:true});
  // GPU tree: rack modules, static luminance and slow two-palette bulbs.
  poly([341,31,314,124,368,124],b.ink(PAL.N1));for(let i=0;i<7;i++){const y=56+i*10,w=12+i*5;A.fill(b,341-w/2,y,w,7,PAL.N3);for(let j=0;j<Math.floor(w/6);j++)b.set(344-w/2+j*6,y+3,(i+j)%2?PAL.L3:PAL.R2);}
  A.actor(b,'MAS',200,193,sh,k,false,4);poly([185,111,205,90,220,111],b.ink(PAL.R2));A.fill(b,182,110,41,4,PAL.P2);A.actor(b,'GERG',113,188,sh,k);
  if(v==='launch-pro'){A.fill(b,237,80,102,57,PAL.W5);A.fill(b,242,85,92,47,PAL.N1);A.pt(b,'PRO',276,94,PAL.W7);A.pt(b,'$200/mo',260,112,PAL.P2);A.actor(b,'CUSTOMER',275,195,sh,k,true);}
  if(v==='launch-aros'){drawMammoth(b,224-Math.min(90,Math.floor(k/4)),193,k);A.fill(b,323,173,106,16,PAL.R1);line(324,190,433,190,b.ink(PAL.W6));line(302,185,323,185,b.ink(PAL.W6));for(let i=0;i<4;i++){ellipse(344+i*21,169,8,8,b.ink(PAL.G3));ellipse(344+i*21,169,3,3,b.ink(PAL.N0));}}
  if(v==='launch-elppa'){A.bezel(b,229,100,199,66,{face:PAL.G5,t:5});A.fill(b,238,111,180,45,PAL.N2);drawChatBubble(b,259,121,{state:'talk',f:k});drawIris(b,338,134,{});}
  if(v==='launch-o3'){const h=40+Math.min(165,Math.floor(k/3));A.fill(b,266,193-h,40,h,PAL.C6);A.fill(b,269,193-h,4,h,PAL.C8);A.pt(b,'o3',278,154,PAL.N0);A.fill(b,255,1,63,13,PAL.N0);A.tiny(b,'ANNOUNCED',263,5,PAL.W6);}
  if(v==='shipmas'){for(let i=0;i<12;i++){const x=270+(i%4)*18,y=80+Math.floor(i/4)*23;A.fill(b,x,y,15,20,PAL.W4);A.fill(b,x+2,y+2,11,16,PAL.N2);A.tiny(b,String(i+1),x+5,y+7,PAL.W7);}}
  A.fill(b,8,5,54,13,PAL.R1);A.tiny(b,'LIVE',21,9,PAL.P2);
}

export function drawStory(b:Buf,k:number,sh:PxShot,f:number):LayoutOut|void {
  if(drawAct1(b,k,sh)){drawTexts(b,sh.scene==='7'&&sh.id==='7.01'?{...sh,texts:sh.texts.filter(t=>t.kind!=='doc')}:sh,k);return;}
  if(drawAct2(b,k,sh,f)){if(!ownsAct2Text(sh,k))drawTexts(b,sh,k);return;}
  if(drawAct3(b,k,sh)){drawTexts(b,sh,k);return;}
  if(drawAct4(b,k,sh)){if(sh.id!=='22.07')drawTexts(b,sh,k);return;}
  const v=visual(sh),n=pictureNote(sh);let customText=false;
  const sc=sh.scene;
  if(sh.id==='16.01'||sh.id==='20.01'||sh.id==='20.03'){newsMonitor(b,k,sh,v);customText=true;}
  else if(v==='attention'||sc==='7')attention(b,k,sh);
  else if(v==='skyline-yarn'||sc==='1')A.skyline(b,k,false,true);
  else if(v==='corkboard'||['2','9'].includes(sc))A.alley(b,k,sh,sc==='9');
  else if(v==='strawberry-post'||sc==='3'){
    A.skyline(b,k,false,true);A.fill(b,0,167,480,36,PAL.N3);A.fill(b,0,165,480,3,PAL.N5);A.actor(b,'MAS',285,199,sh,k);A.orb(b,328,119,k);A.fill(b,181,153,33,34,PAL.D3);A.fill(b,178,151,39,5,PAL.D4);line(197,155,197,132,b.ink(PAL.L2));A.strawberry(b,196,131,1);
  }
  else if(v==='beach'||v==='beach-call'||sc==='5')A.beach(b,k,sh,v.includes('call'));
  else if(v.startsWith('stadium')||['6','8'].includes(sc))A.stadium(b,k,sh,v||'stadium-box');
  else if(['woodrose','breakout','chairs'].includes(v)||sc==='12')woodrose(b,k,sh,v);
  else if(v==='veto-hydra'||sc==='13'){veto(b,k,sh);if(sh.cls==='ECU'||/message|letterhead/.test(n)){document(b,sh,k,'GOVERNOR OF CALIFORNIA');customText=true;}}
  else if(v==='paper-exodus'||sc==='19')A.paperBook(b,k,sh);
  else if(v==='writing-room'||v==='paper-bridge'||sc==='18'){
    if(v==='paper-bridge'){A.skyline(b,k);for(let i=0;i<42;i++){const x=60+i*8,y=162-Math.floor(i*1.4);A.fill(b,x,y,9,3,PAL.P2);A.fill(b,x,y+3,9,1,PAL.D2);}A.fill(b,338,85,100,22,PAL.N0);A.pt(b,'NOW HIRING',350,92,PAL.W6);}
    else A.lighthouse(b,k,sh);
  }
  else if(['investor-pledge','odometer','nonprofit'].includes(v)||sc==='14'){
    A.boardroom(b,k,sh,v==='odometer'&&k<48?'$86,000,000,000':'$157,000,000,000');
    if(v==='investor-pledge'){A.actor(b,'INVESTOR',324,179,sh,k,true);for(let i=0;i<9;i++)A.fill(b,213+i*18,154+i*4,22,7,PAL.P1);}
  }
  else if(v==='tpool-sale'||sc==='15'){
    A.fill(b,0,0,480,203,PAL.C6);A.fill(b,0,139,480,64,PAL.G3);A.fill(b,66,39,348,100,PAL.P1);A.fill(b,120,57,240,23,PAL.N1);A.pt(b,'TPOOL',212,65,PAL.C7);A.fill(b,191,104,45,35,PAL.N2);for(let i=0;i<35;i++)A.fill(b,20+(i*61)%440,35+(i*29+Math.floor(k/4))%160,3,2,[PAL.W6,PAL.R2,PAL.C3][i%3]);A.actor(b,'MAS',267,186,sh,k);A.fill(b,67,159,126,25,PAL.W4);A.pt(b,'$43.4M',99,168,PAL.N1);
  }
  else if(v.startsWith('terrace')||v==='reflection'||sc==='23'){
    A.terrace(b,k,sh);if(v==='reflection'){A.fill(b,291,23,152,141,PAL.W4);A.fill(b,297,29,140,129,PAL.W3);A.actor(b,'SAMA NOS',366,158,sh,k);A.fill(b,310,94,111,32,PAL.P2);A.bpt(b,'$100B',319,101,PAL.N1);}
  }
  else if(['podium','check-slot','reveal-rumpt'].includes(v)&&sc==='24'||sc==='24'){
    A.terrace(b,k,sh,v==='reveal-rumpt'||/turn|say a number|president-elect/.test(n));
    if(v==='check-slot'){A.fill(b,261,126,76,26,PAL.P2);A.pt(b,'$1,000,000',268,135,PAL.N1);A.podium(b,342,172,k,false,true);}
  }
  else if(v==='frozen-bay'||sc==='25'){
    A.skyline(b,k,true);A.fill(b,0,124,480,79,PAL.C8);for(let i=0;i<18;i++)line((i*43)%480,132+i*3,(i*43+70)%480,139+i*3,b.ink(PAL.C5));const x=-170+Math.floor(k*2);ellipse(x,169,87,17,b.ink(PAL.C4));poly([x-70,169,x-117,146,x-113,178],b.ink(PAL.C4));A.strawberry(b,244,147,1,true);
  }
  else if(v==='keycap'){
    vramp(b,0,0,480,203,[PAL.N1,PAL.N3,PAL.N2]);A.keycap(b,188,58,6);A.glass(b,315,148);
  }
  else if(v==='podium'&&sc==='20'){
    const t=new Buf(480,203,PAL.N0);ep2Podium({phase:'taut',taut:3,f:k})(t,k);b.c.set(t.c);
  }
  else if(['nobel-monitor','election','amazon-rent','darkroom-clock'].includes(v)||['10','16','17A','20'].includes(sc)){
    A.darkroom(b,k,sh,screen=>{
      if(v==='podium'){A.fill(screen,0,0,480,203,PAL.N2);A.podium(screen,210,187,k);}
      else if(v==='election'){A.fill(screen,0,0,480,203,PAL.N0);A.center(screen,'NOV 5, 2024 · ELECTION',62,PAL.P2);A.center(screen,'RUMPT WINS',95,PAL.W6);}
      else if(v==='amazon-rent'){A.fill(screen,0,0,480,203,PAL.D2);A.fill(screen,121,64,238,100,PAL.W3);A.center(screen,'+$4B',83,PAL.N1);A.center(screen,'$8B TOTAL',109,PAL.N1);A.center(screen,'RENT INVOICE',135,PAL.N1);}
      else if(v==='nobel-monitor'){A.fill(screen,0,0,480,203,PAL.N1);A.center(screen,'OCT 8 · PHYSICS',40,PAL.W6);A.center(screen,'OCT 9 · CHEMISTRY',122,PAL.W6);for(const y of [78,161]){ellipse(242,y,20,20,screen.ink(PAL.W5));ellipse(242,y,15,15,screen.ink(PAL.W7));}}
      else{A.fill(screen,0,0,480,203,PAL.N1);A.center(screen,'A FEW THOUSAND DAYS (!)',83,PAL.C7);}
    });
  }
  else {
    A.lobby(b,k,sh,{industrial:sc!=='4',valuation:['21','22'].includes(sc)?'$157,000,000,000':'$86,000,000,000',photoHole:sc!=='4',spin:v==='door-turbine',shipmas:sc==='22'});
    A.actor(b,'MAS',93,194,sh,k,false,['21','22'].includes(sc)?4:3);
    if(['4','21'].includes(sc))A.actor(b,'GERG',294,193,sh,k);
    else if(sc==='11'){A.actor(b,'RIMA',416,151,sh,k,true);if(v==='door-install')A.actor(b,'INSTALLER',340,192,sh,k);}
    A.orb(b,136,118,k);
    if(v==='class-photo'){A.fill(b,116,24,254,145,PAL.W4);A.fill(b,122,30,242,133,PAL.N4);for(let i=0;i<28;i++){const x=139+(i%7)*32,y=43+Math.floor(i/7)*28;if(i===10){A.fill(b,x,y,18,24,PAL.N0);continue;}ellipse(x+9,y+5,6,6,b.ink(PAL.S3));A.fill(b,x+2,y+11,15,15,PAL.N2);}}
  }
  if(v==='shipmas'||v.startsWith('launch-'))launch(b,k,sh,v);
  // Real conversations stay in their masters until a scripted close-up changes status.
  const speaker=simple(active(sh,k));
  if(['MCU','CU'].includes(sh.cls)&&speaker&&!customText&&!['attention','frozen-bay','reflection','class-photo','launch-o3','paper-exodus','paper-bridge'].includes(v)){
    const t=new Buf(480,270,PAL.N0);t.c.set(b.c);A.fill(b,0,0,480,203,PAL.N1);
    for(let y=0;y<203;y++)for(let x=0;x<480;x++)b.set(x,y,t.get(Math.floor(x/3)*3,Math.floor(y/3)*3));
    A.portrait(b,speaker,183,48,sh,k,['14','21','22','23','24'].includes(sc)?4:3);
  }
  if(!customText)drawTexts(b,sh,k);
  void f;
}
