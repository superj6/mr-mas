// Cold open and stadium choreography, on the lock's actual shot clock.
import {Buf,line,ellipse,poly} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import type {PxShot} from '../types';
import * as A from './world';
import {drawChatBubble} from '../../../../shared/pixel/cast/chatgtp';
const num=(sh:PxShot)=>Number(sh.id.split('.').pop());
function handover(b:Buf,k:number,sh:PxShot,n:number){
 const p=Math.min(1,k/Math.max(1,sh.e-sh.s-1));
 A.lobby(b,k,sh,{valuation:'$86,000,000,000',photoHole:false});
 if(n===1||n===7){
  A.actor(b,'MAS',93,194,sh,k);
  const x=n===7?320+Math.floor(p*90):294;
  A.actor(b,'GERG',x,193,sh,k);
  // A real folding chair: seat, crossed braces and two feet remain connected.
  const cx=x+35;
  line(cx-17,141,cx+18,189,b.ink(PAL.W4));line(cx+17,141,cx-18,189,b.ink(PAL.W4));
  A.fill(b,cx-17,142,34,4,PAL.C6);A.fill(b,cx-18,161,36,4,PAL.C5);
  if(n===1){A.fill(b,112,151,29,24,PAL.P2);A.fill(b,115,155,21,2,PAL.G4);A.fill(b,115,163,4,4,PAL.N1);}
  if(n===7&&p<.65){line(390,153,cx,162,b.ink(PAL.W4));A.fill(b,389,148,4,17,PAL.W6);}
 }else if(n===3||n===6){
  A.portrait(b,'MAS',183,42,sh,k);A.fill(b,279,152,47,27,PAL.P1);
  for(let i=0;i<4;i++)A.fill(b,284,157+i*5,35-i*4,1,PAL.G4);
  if(n===3){A.fill(b,284,162,6,5,PAL.N1);line(291,164,303,161,b.ink(PAL.C6));}
  if(n===6){A.keycap(b,311,159-Math.floor(p*12),.7);A.fill(b,244,154,15,23,PAL.N0);}
 }else{
  A.portrait(b,'MAS',86,43,sh,k);A.portrait(b,'GERG',294,30,sh,k);A.fill(b,68,174,352,9,PAL.D3);
  A.fill(b,206,149,64,26,PAL.P2);for(let i=0;i<3;i++){A.fill(b,211,153+i*6,4,4,PAL.N2);A.fill(b,220,154+i*6,43-i*7,1,PAL.G4);}
  A.glass(b,183,162);
  if(n===4){const x=244+Math.floor(p*32),y=162+Math.floor(Math.sin(p*Math.PI)*-20);A.keycap(b,x,y,.7);}
  if(n===5){
   // The motivated window view stays between the pair, at a readable scale.
   A.fill(b,207,61,70,66,PAL.C6);for(let i=0;i<9;i++){A.fill(b,211+i*7,112-i*3,8,3,PAL.P2);A.fill(b,211+i*7,115-i*3,8,1,PAL.G4);}
   A.actor(b,'LUNCHMAS',245,104,sh,k,true);A.fill(b,243,81,15,12,PAL.W3);
  }
 }
 A.orb(b,n===3||n===6?153:55,119,k);
}
export function drawAct1(b:Buf,k:number,sh:PxShot):boolean{
 const sc=sh.scene,n=num(sh),u=Math.min(1,k/48);
 if(sc==='2'){
  A.alley(b,k,sh);
  if(n===1){A.fill(b,78,49,62,61,PAL.R2);for(let i=0;i<36;i++){const x=80+(i*13)%56,y=52+(i*29)%52;A.fill(b,x,y,2,3,PAL.W6);}}
  if(n>=2){A.strawberry(b,250,126,0.5);A.fill(b,275,162,25,5,PAL.P1);A.fill(b,278,159,18,3,PAL.W5);}
  if(n===4){line(163,122,200+k*2,Math.max(-20,105-k*2),b.ink(PAL.R2));}
  return true;
 }
 if(sc==='4'){handover(b,k,sh,n);return true;}
 if(sc==='7'&&n!==2){
  if(n===1){
   A.fill(b,0,0,480,203,PAL.N2);A.fill(b,55,12,370,184,PAL.P2);A.fill(b,55,12,370,3,PAL.W6);
   A.pt(b,'ATTENTION IS ALL YOU NEED',82,46,PAL.N1);A.pt(b,'ELGOOG RESEARCH',82,75,PAL.N2);
   for(let i=0;i<8;i++){A.fill(b,82,103+i*9,309-(i%3)*23,1,PAL.G4);}A.fill(b,235,151,124,28,PAL.P2);
   for(let i=0;i<3;i++){A.fill(b,243+i*35,153,25,7,PAL.C3);line(255+i*35,160,255+i*35,175,b.ink(PAL.C4));}
  }else{
   A.stadium(b,k,sh,'stadium-box');A.fill(b,209,157,63,26,PAL.P2);A.fill(b,215,163,49,1,PAL.G4);
   if(n===4){A.portrait(b,'MAS',183,40,sh,k);A.fill(b,294,155,45,24,PAL.P1);}
  }
  return true;
 }
 if(sc==='3'){
  A.skyline(b,k,false,true);A.fill(b,0,167,480,36,PAL.N3);A.fill(b,0,165,480,3,PAL.N5);
  A.actor(b,'MAS',285,199,sh,k);A.orb(b,328,119,k);A.fill(b,181,153,33,34,PAL.D3);A.fill(b,178,151,39,5,PAL.D4);line(197,155,197,132,b.ink(PAL.L2));
  if(n<3||k<20)A.strawberry(b,196,131,1);
  if(n===1){A.fill(b,228,143,20,15,PAL.G3);A.fill(b,226,140,22,3,PAL.G5);line(227,147,208,140,b.ink(PAL.G5));ellipse(249,149,7,7,b.ink(PAL.G4));ellipse(249,149,4,4,b.ink(PAL.N2));for(let i=0;i<5;i++)A.fill(b,207-i*2,143+(Math.floor(k/3)+i*4)%14,1,2,PAL.C7);}
  if(n===2){A.portrait(b,'MAS',184,39,sh,k);A.bezel(b,282,125,39,62,{face:PAL.N0,t:3});A.fill(b,285,129,33,52,PAL.C2);A.strawberry(b,300,145,.7);A.tiny(b,'POST',291,169,PAL.P2);}
  if(n===3){A.bezel(b,288,133,18,27,{face:PAL.N0,t:2});A.fill(b,291,137,12,18,PAL.C3);if(k>15){A.fill(b,291,140,12,2,PAL.L3);for(let i=0;i<8;i++)A.fill(b,50+i*49,Math.max(15,97-i*7-Math.floor(k/4)),7,3,PAL.C7);}}
  return true;
 }
 if(sc!=='8')return false;
 if(n===1){
  A.stadium(b,0,sh,'stadium-field');drawChatBubble(b,224,140,{state:'talk',f:k});A.fill(b,221,136,41,4,PAL.P2);A.fill(b,226,139,6,5,PAL.N1);A.strawberry(b,254,159,1);A.fill(b,224,170,9,4,PAL.N0);
 }else if(n===2){
  A.stadium(b,k,sh,'stadium-kick-old');A.fill(b,11,50,85,16,PAL.N0);A.pt(b,'CALLED IT',20,55,PAL.R3);
 }else if(n===5){
  A.stadium(b,0,sh,'stadium-field');const word='STRAWBERRY',count=Math.min(10,Math.floor(k/12)+1);
  for(let i=0;i<count;i++){const x=104+i*27;A.pt(b,word[i],x,132,word[i]==='R'?PAL.W7:PAL.P2);for(let j=0;j<3;j++){const dx=(Math.floor(k/4)%2)*2;A.fill(b,x-4+j*5,147,4,7,PAL.N4);ellipse(x-2+j*5,145,2,2,b.ink(PAL.W5));A.fill(b,x-4+j*5+dx,154,2,4,PAL.P1);}}
  A.fill(b,228,167,21,20,PAL.P1);A.tiny(b,'o1',235,175,PAL.N1);
 }else if(n===6){
  A.stadium(b,0,sh,'stadium-field');A.portrait(b,'MARIO',91,43,sh,k);A.portrait(b,'ADELINA',297,43,sh,k);
  A.fill(b,0,180,480,23,PAL.N2);for(let i=0;i<14;i++){const x=171+i*5,y=159+i*3;A.fill(b,x,y,22,5,PAL.P1);if(i%2===0)A.fill(b,x+3,y+2,15,1,PAL.G4);}
  A.fill(b,334,163,42,21,PAL.N0);A.fill(b,337,166,36,3,PAL.G4);for(let i=0;i<8;i++)A.fill(b,339+i*4,182,2,15,PAL.P1);
 }else if(n===8){A.stadium(b,k,sh,'stadium-shutter');}
 else if(n===9){
  A.stadium(b,0,sh,'stadium-field');A.bezel(b,61,8,358,181,{face:PAL.G2,hi:PAL.G5,lo:PAL.N0,t:6});A.fill(b,68,15,344,166,PAL.N3);A.portrait(b,'MAS',188,38,sh,k);A.fill(b,73,21,65,13,PAL.R1);A.tiny(b,'FAN CAM',80,25,PAL.P2);
  for(const [x,y,dx,dy] of [[176,35,20,0],[176,35,0,20],[294,35,-20,0],[294,35,0,20],[176,161,20,0],[294,161,-20,0]])line(x,y,x+dx,y+dy,b.ink(PAL.W6));
 }else if(n===10){A.stadium(b,k,sh,'stadium-kick');}
 else {
  A.stadium(b,k,sh,'stadium-box');
  if(n===3||n===4){A.fill(b,178,168,89,20,PAL.P2);A.tiny(b,'PRO PLAN · PRICE TBD',185,174,PAL.N1);}
  if(n===11){A.fill(b,200,154,80,29,PAL.W6);A.pt(b,'thought hard.',206,165,PAL.N1);}
 }
 return true;
}
