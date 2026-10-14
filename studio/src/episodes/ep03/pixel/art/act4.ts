// Reunion, launch choreography and the larger-number reveal.
import {Buf,line,ellipse,poly} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {blitImg} from '../../../../shared/pixel/figure';
import {noleImg,NOLE_BASE} from '../../../../shared/pixel/cast/nole';
import {drawMammoth,drawIris} from '../../../ep02/pixel/art/creatures';
import {drawChatBubble} from '../../../../shared/pixel/cast/chatgtp';
import {live} from './ensemble';
import {pwrap} from '../../../ep02/pixel/art/kit';
import * as A from './world';
import type {PxShot} from '../types';
const no=(sh:PxShot)=>Number(sh.id.split('.').pop());
const progress=(sh:PxShot,k:number)=>Math.min(1,k/Math.max(1,sh.e-sh.s-1));
function hats(b:Buf,x:number,y:number){A.fill(b,x,y,30,9,PAL.N2);A.fill(b,x-3,y+8,36,3,PAL.N4);A.tiny(b,'AI',x+10,y+2,PAL.C7);A.fill(b,x-2,y-12,34,9,PAL.N3);A.tiny(b,'CRYPTO',x+2,y-10,PAL.W6);}
function tree(b:Buf){poly([341,31,314,124,368,124],b.ink(PAL.N1));for(let i=0;i<7;i++){const y=56+i*10,w=12+i*5;A.fill(b,341-w/2,y,w,7,PAL.N3);for(let j=0;j<Math.floor(w/6);j++)b.set(344-w/2+j*6,y+3,(i+j)%2?PAL.L3:PAL.R2);}poly([341,24,344,31,351,32,346,37,347,43,341,39,335,43,336,36,331,32,338,31],b.ink(PAL.W6));}
function calendar(b:Buf,k:number,sh:PxShot,hat=true,people=true){
 A.lobby(b,k,sh,{industrial:true,valuation:'$157,000,000,000',photoHole:true,shipmas:true,spin:true});tree(b);
 if(people){A.actor(b,'MAS',201,193,sh,k,false,4);A.actor(b,'GERG',107,190,sh,k);}A.orb(b,240,119,k);
 if(hat&&people){poly([185,113,204,93,218,113],b.ink(PAL.R2));A.fill(b,183,112,39,4,PAL.P2);ellipse(204,92,3,3,b.ink(PAL.P2));}
 A.fill(b,8,5,51,13,PAL.R1);A.tiny(b,'LIVE',21,9,PAL.P2);
}
function pair(b:Buf,k:number,sh:PxShot){A.lobby(b,k,sh,{industrial:true,valuation:'$157,000,000,000',photoHole:true});A.portrait(b,'MAS',86,39,sh,k,4);A.portrait(b,'GERG',294,28,sh,k);A.fill(b,68,174,352,9,PAL.D3);A.glass(b,187,162);}
function seatedNole(b:Buf,k:number,sh:PxShot){
 // His upper body connects to newly drawn bent knees resting on the actual step.
 A.fill(b,284,139,59,9,PAL.W4);A.fill(b,287,148,53,33,PAL.W2);
 blitImg(b,noleImg({...NOLE_BASE,noLegs:true,arm:live(sh,k,'NOLE')?'jab':'phone',mouth:live(sh,k,'NOLE')?1:0}),267,90);
 poly([293,136,315,136,335,151,329,157,307,149,292,148],b.ink(PAL.F3));A.fill(b,328,154,6,24,PAL.F2);A.fill(b,323,177,14,5,PAL.N0);
}
function terrace(b:Buf,k:number,sh:PxShot,n:number){
 const close=[3,4,6].includes(n);A.terrace(b,k,sh,false,!close);
 A.fill(b,270,80,69,101,PAL.N1);A.fill(b,270,145,69,36,PAL.W2);if(![3,4].includes(n))seatedNole(b,k,sh);
 if(n===1||n===2||n===8){A.actor(b,'AIDE',426,187,sh,k,true);if(n===2)hats(b,42,104);}
 if(n===3||n===4){
  // Move in on the status exchange: still no person behind lectern.
  A.portrait(b,'MAS',88,49,sh,k,4);A.portrait(b,'NOLE',296,31,sh,k);A.fill(b,277,166,154,9,PAL.W3);A.glass(b,184,164);
 }
 if(n===5){A.fill(b,223,137,90,29,PAL.P2);A.pt(b,'$1,000,000',229,148,PAL.N1);A.fill(b,242,135,30,3,PAL.S3);}
 if(n===6){A.portrait(b,'MAS',87,47,sh,k,4);A.portrait(b,'MIT KOOC',300,43,sh,k);}
 if(n===7){A.fill(b,289,21,156,143,PAL.W4);A.fill(b,295,27,144,131,PAL.W3);A.actor(b,'SAMA NOS',366,158,sh,k);A.fill(b,307,92,118,33,PAL.P2);A.bpt(b,'$100B',320,101,PAL.N1);}
}
export function drawAct4(b:Buf,k:number,sh:PxShot):boolean{
 const n=no(sh),p=progress(sh,k);
 if(sh.scene==='21'){
  if(n===1){A.lobby(b,k,sh,{industrial:true,valuation:'$157,000,000,000',photoHole:true,spin:true});A.actor(b,'MAS',94,193,sh,k,false,4);A.actor(b,'GERG',434-Math.floor(p*139),193,sh,k);for(let i=0;i<14;i++)A.fill(b,410-Math.floor(p*135)+(i*7)%25,166+(i*11+Math.floor(k/3))%28,2,1,PAL.W4);}
  else if(n===6){calendar(b,k,sh);}
  else{pair(b,k,sh);if(n===2)A.keycap(b,213+Math.floor(p*86),158,1);if(n===5){A.fill(b,208,142,70,31,PAL.P2);for(let i=0;i<6;i++)A.fill(b,214+i*10,150+(i%2)*8,7,6,PAL.C3);}}
  return true;
 }
 if(sh.scene==='22'){
  if(n===7){
   // A personal ledger at his own desk; no official, political room or payoff shares frame.
   A.darkroom(b,k,sh);A.fill(b,42,19,397,171,PAL.P2);A.fill(b,42,19,397,3,PAL.W6);A.pt(b,'PERSONAL LEDGER',59,36,PAL.N1);line(59,50,421,50,b.ink(PAL.G4));
   let yy=75;for(const t of sh.texts.filter(t=>k>=t.s&&k<t.e)){for(const row of pwrap(t.text,345)){A.pt(b,row,59,yy,PAL.N1);yy+=14;}}
   A.fill(b,279,153,102,1,PAL.G4);A.tiny(b,'personal funds',289,164,PAL.N2);return true;
  }
  if(n===9){A.lobby(b,k,sh,{industrial:true,valuation:'$157,000,000,000',photoHole:true,shipmas:true});A.portrait(b,'MAS',181,42,sh,k,4);A.fill(b,318,71,46,104,PAL.N0);A.fill(b,322,75,38,96,PAL.W4);return true;}
  if(n===10){
   if(p<.34){calendar(b,k,sh);const h=35+Math.floor(p/.34*178);A.fill(b,269,193-h,40,h,PAL.C6);A.fill(b,272,193-h,4,h,PAL.C8);for(let i=0;i<8;i++)A.fill(b,256+(i*13)%67,17+Math.floor(p*100)+(i*11)%35,4,3,PAL.N4);}
   else{A.skyline(b,k);const x=317,y=203-Math.floor((p-.34)*260);A.fill(b,x,y,32,203-y,PAL.C6);A.fill(b,x+3,y,4,203-y,PAL.C8);A.fill(b,x-22,y+32,76,18,PAL.P1);A.tiny(b,'CALLED IT',x-14,y+38,PAL.R2);A.fill(b,x-31,y+63,94,11,PAL.P2);for(let i=0;i<9;i++)A.fill(b,x-9+(i*7)%47,y+65,4,1,PAL.G4);A.fill(b,x-43,y+91,114,60,PAL.D2);for(let i=0;i<11;i++)line(x+12,y+111,x-30+(i*17)%96,y+97+(i*13)%46,b.ink(PAL.R2));}
   return true;
  }
  if(n===11){A.lighthouse(b,k,sh,false);A.portrait(b,'MARIO',88,25,sh,k);A.portrait(b,'ADELINA',298,25,sh,k);A.fill(b,67,166,369,8,PAL.D3);return true;}
  if(n===12){calendar(b,k,sh,true,false);poly([242,0,319,0,343,203,224,203],b.ink(PAL.N5));A.actor(b,'MAS',249,195,sh,k,false,4);A.actor(b,'CORKBOARD GUY',315,195,sh,k,true);A.orb(b,227,124,k);return true;}
  calendar(b,k,sh,true,![3,4,8].includes(n));
  if(n===2){A.fill(b,241,85,95,54,PAL.W5);A.fill(b,246,90,85,44,PAL.N1);A.pt(b,'PRO',275,96,PAL.W7);A.pt(b,'$200/mo',258,115,PAL.P2);drawChatBubble(b,272,145,{f:k});}
  if(n===3||n===4){A.portrait(b,'GERG',87,28,sh,k);A.portrait(b,'CUSTOMER',297,28,sh,k);A.fill(b,63,174,373,9,PAL.D3);A.fill(b,216,154,54,19,PAL.W5);A.tiny(b,'$200/mo',223,160,PAL.N1);}
  if(n===5){drawMammoth(b,274-Math.min(130,Math.floor(k/3)),194,k);A.fill(b,337-Math.min(130,Math.floor(k/3)),174,106,16,PAL.R1);line(324,190,433,190,b.ink(PAL.W6));for(let i=0;i<4;i++){ellipse(347-Math.min(130,Math.floor(k/3))+i*21,170,8,8,b.ink(PAL.G3));ellipse(347-Math.min(130,Math.floor(k/3))+i*21,170,3,3,b.ink(PAL.N0));}}
  if(n===6){A.bezel(b,233,103,199,66,{face:PAL.G5,t:5});A.fill(b,242,114,180,45,PAL.N2);drawChatBubble(b,263,124,{state:'talk',f:k});drawIris(b,342,137,{});}
  if(n===8){A.portrait(b,'CORKBOARD GUY',83,31,sh,k);A.portrait(b,'SECOND TRUTHER',292,31,sh,k);A.fill(b,67,173,361,9,PAL.D2);for(let i=0;i<12;i++)line(244,169,278+(i%4)*18,77+Math.floor(i/4)*23,b.ink(PAL.R2));}
  return true;
 }
 if(sh.scene==='23'){terrace(b,k,sh,n);return true;}
 if(sh.scene==='24'){
  const close=n===1||n===5||n===4&&k>=24;
  A.terrace(b,k,sh,n>=4&&k>=24,!close,!(n===5||n===4&&k>=24));A.fill(b,270,80,69,101,PAL.N1);A.fill(b,270,145,69,36,PAL.W2);if(!close)seatedNole(b,k,sh);
  if(n===1){A.bezel(b,275,64,161,105,{face:PAL.W4,t:5});A.fill(b,281,70,149,93,PAL.N2);A.pt(b,'TALK   PITCH',291,87,PAL.N7);A.fill(b,296,113,119,28,PAL.W5);A.pt(b,'GIVE',341,123,PAL.N1);A.portrait(b,'MAS',183,42,sh,k,4);poly([268,143,274,140,288,153,312,131,316,136,290,162,271,150],b.ink(PAL.N3));A.fill(b,310,131,8,7,PAL.S4);}
  if(n===2){const xx=249+Math.floor(p*111);poly([225,144,230,141,xx+14,145,xx+14,150,228,150],b.ink(PAL.N3));A.fill(b,xx,131,66-Math.floor(p*49),22,PAL.P2);A.fill(b,xx+11,147,6,5,PAL.S4);if(p<.6)A.tiny(b,'$1M',xx+5,139,PAL.N1);A.fill(b,360,135,24,3,PAL.N0);}
  if(n===3){A.fill(b,296,29,142,127,PAL.W3);A.actor(b,'SAMA NOS',366,153,sh,k);A.fill(b,307,84-Math.floor(p*11),118,33,PAL.P2);A.bpt(b,'$100B',320,93-Math.floor(p*11),PAL.N1);}
  if(n===4&&k<24){A.fill(b,337,85,65,91,PAL.N1);const w=k<12?55:23;A.fill(b,370-w/2,120,w,54,PAL.W4);A.fill(b,366,120,4,54,PAL.W6);}
  if(n===4&&k>=24){
   const speech=sh.lines.find(l=>l.who==='RUMPT'),end=(speech?.e??54)+18;
   if(k<end){
    // First full occupant view: a native fictional portrait, tied to his line.
    A.portrait(b,'RUMPT',184,27,sh,k);A.fill(b,168,154,146,12,PAL.W7);A.fill(b,180,166,122,37,PAL.W4);A.fill(b,184,166,4,37,PAL.W6);
   }else{A.portrait(b,'MAS',183,43,sh,k,4);A.glass(b,297,167);}
  }
  if(n===5){A.orb(b,266,109,k,[.8,0]);A.portrait(b,'MAS',84,48,sh,k,4);}
  return true;
 }
 return false;
}
