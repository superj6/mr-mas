// Episode 3 rooms and props. Native 480x203 room plates; band belongs to the host.
import {Buf, rect, line, poly, ellipse, hash, bayer} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {fill, pt, pw, bpt, bpw, tiny, vramp, bezel, paper} from '../../../ep02/pixel/art/kit';
import {drawChatBalloon,drawMammoth,drawIris} from '../../../ep02/pixel/art/creatures';
import {drawOrb,orbBob} from '../../../../shared/pixel/cast/orb';
import {drawGergPose,GERG_POSE_DEFAULT} from '../../../../shared/pixel/cast/gerg-poses';
import {actor,glass,live,portrait,keycap} from './ensemble';
import type {PxShot} from '../types';
export {fill,pt,pw,bpt,bpw,tiny,bezel,glass,keycap,actor,portrait};
export const W=480,H=203;
const ln=(b:Buf,x:number,y:number,a:number,c:number,col:number)=>line(x,y,a,c,b.ink(col));
export const center=(b:Buf,s:string,y:number,col=PAL.P2)=>pt(b,s,Math.max(8,Math.round((480-pw(s))/2)),y,col);
export function strawberry(b:Buf,x:number,y:number,s=1,bitten=false){
  poly([x-9*s,y-8*s,x+9*s,y-8*s,x+12*s,y-2*s,x+8*s,y+8*s,x,y+15*s,x-8*s,y+8*s,x-12*s,y-2*s],b.ink(PAL.R1));
  poly([x-8*s,y-7*s,x+6*s,y-7*s,x+8*s,y-1*s,x+4*s,y+9*s,x,y+12*s,x-8*s,y+3*s],b.ink(PAL.R3));
  for(let i=0;i<9;i++){const xx=x+((i*7)%17-8)*s,yy=y+(Math.floor(i/3)*5-2)*s;fill(b,xx,yy,s,s*2,PAL.W6);}
  poly([x-11*s,y-9*s,x-2*s,y-7*s,x,y-14*s,x+3*s,y-8*s,x+11*s,y-11*s,x+7*s,y-5*s,x,y-7*s,x-7*s,y-4*s],b.ink(PAL.L3));
  if(bitten)ellipse(x+10*s,y,6*s,6*s,b.ink(PAL.C8));
}
export function skyline(b:Buf,f:number,night=false,yarn=false){
  vramp(b,0,0,480,203,night?[PAL.N0,PAL.N1,PAL.N2]:[PAL.C5,PAL.C6,PAL.C8]);
  if(night)for(let i=0;i<38;i++)b.set((i*67)%480,(i*43)%87,PAL.N6);
  fill(b,0,150,480,53,night?PAL.C0:PAL.C4);
  for(let i=0;i<22;i++){const x=i*24-8,h=26+Math.floor(hash(i,1,41)*60);fill(b,x,150-h,20,h,night?PAL.N1:PAL.N5);fill(b,x,150-h,20,2,night?PAL.N4:PAL.N7);for(let yy=153-h;yy<145;yy+=7)for(let xx=x+3;xx<x+18;xx+=5)if(hash(xx,yy,31)>.3)fill(b,xx,yy,2,3,night?PAL.W5:PAL.C7);}
  fill(b,290,70,60,95,PAL.N2);poly([280,70,320,28,360,70],b.ink(PAL.N3));fill(b,317,12,6,81,PAL.N1);poly([313,12,320,0,327,12],b.ink(PAL.N2));
  for(let y=80;y<155;y+=10)for(let x=296;x<346;x+=8)fill(b,x,y,3,5,PAL.C5);
  fill(b,48,100,31,63,PAL.D2);for(let y=100;y<160;y+=5)fill(b,46,y,35,2,PAL.P1);poly([44,100,64,86,84,100],b.ink(PAL.W6));
  const sw=Math.floor(f/12)%30;ln(b,64,94,120+sw*5,80,PAL.W5);
  if(yarn)for(let i=0;i<18;i++)ln(b,-30+i*33,12+(i*17)%100,480-i*19,40+(i*29)%100,PAL.R2);
  for(let i=0;i<15;i++){const x=(i*41+Math.floor(f/8))%480;fill(b,x,173+(i%3)*8,16,1,night?PAL.C2:PAL.C6);}
}
export function orb(b:Buf,x:number,y:number,f:number,look:[number,number]=[.4,0]){drawOrb(b,x,y+orbBob(f),10,{look,aperture:.65,monitor:-1});}
export function podium(b:Buf,x:number,y:number,f:number,reveal=false,slot=false){
  ellipse(x+29,y+2,40,4,b.ink(PAL.N0));
  if(reveal){fill(b,x+8,y-76,43,46,PAL.N2);ellipse(x+29,y-82,13,16,b.ink(PAL.S4));poly([x+15,y-88,x+20,y-102,x+41,y-99,x+44,y-89],b.ink(PAL.W6));fill(b,x+26,y-64,7,48,PAL.R2);fill(b,x+17,y-85,2,2,PAL.N0);fill(b,x+32,y-85,2,2,PAL.N0);}
  poly([x-5,y-50,x+63,y-50,x+58,y-41,x,y-41],b.ink(PAL.W7));fill(b,x+4,y-41,49,41,PAL.W4);fill(b,x+7,y-39,3,37,PAL.W6);fill(b,x+47,y-39,5,37,PAL.W2);fill(b,x,y,58,4,PAL.W3);
  if(slot)fill(b,x+22,y-27,15,3,PAL.N0);
  if(!reveal){line(x+4,23,x+4,y-50,b.ink(PAL.G6));drawChatBalloon(b,x+15,5,4);}
}
export function lobby(b:Buf,f:number,sh:PxShot,st:{industrial?:boolean;valuation?:string;photoHole?:boolean;shipmas?:boolean;spin?:boolean}={}){
  vramp(b,0,0,480,203,[PAL.N2,PAL.N3,PAL.N4]);
  for(let y=12;y<150;y+=12){fill(b,0,y,480,1,PAL.N1);for(let x=(y%24?0:15);x<480;x+=30)fill(b,x,y-11,1,11,PAL.N2);}
  for(let x=0;x<480;x+=82){fill(b,x,0,12,157,PAL.N1);fill(b,x+1,0,2,157,PAL.N5);for(let y=17;y<145;y+=7){fill(b,x+5,y,5,2,PAL.N0);if((Math.floor(f/12)+y+x)%5)fill(b,x+6,y,2,1,PAL.C6);}}
  for(let x=0;x<480;x+=82)poly([x+11,28,x+34,5,x+53,5,x+81,28,x+81,32,x+53,11,x+34,11,x+11,32],b.ink(PAL.N5));
  for(let y=150;y<203;y++){fill(b,0,y,480,1,((y-150)%10<2)?PAL.N2:PAL.N3);for(let x=0;x<480;x+=40)ln(b,240,130,x+(x-240)*((y-130)/100),y,PAL.N2);}
  // Bay window and draft bridge: a new side-on angle on the established cathedral.
  bezel(b,183,40,120,102,{face:PAL.W3,hi:PAL.W7,lo:PAL.W1,t:4});fill(b,188,45,110,92,PAL.C7);fill(b,188,100,110,37,PAL.C4);fill(b,242,45,3,92,PAL.W3);
  for(let i=0;i<12;i++){const x=191+i*8,y=114-Math.floor(i/3);fill(b,x,y,8,3,i%4===2?PAL.C4:PAL.P1);}
  fill(b,267,72,17,39,PAL.D2);for(let y=75;y<108;y+=4)fill(b,265,y,21,1,PAL.P1);poly([263,72,276,62,286,72],b.ink(PAL.W6));
  // Reception and class photograph.
  fill(b,15,112,155,9,PAL.W4);fill(b,19,121,147,36,PAL.N2);fill(b,19,121,147,1,PAL.W6);tiny(b,'NOPE AI',71,136,PAL.C7);
  fill(b,22,40,67,43,PAL.W4);fill(b,25,43,61,37,PAL.N5);for(let i=0;i<18;i++){const xx=29+(i%6)*9,yy=49+Math.floor(i/6)*10;if(st.photoHole&&i===9){fill(b,xx,yy,6,9,PAL.N0);continue;}ellipse(xx+3,yy+2,2,2,b.ink(PAL.S3));fill(b,xx+1,yy+4,5,5,[PAL.N2,PAL.D2,PAL.C2][i%3]);}
  tiny(b,'CLASS PHOTO',30,85,PAL.N7);
  bezel(b,98,44,68,40,{face:PAL.N1,t:3});fill(b,103,49,58,30,PAL.C1);tiny(b,'DAYS SINCE',109,52,PAL.C7);tiny(b,'FIRING',119,60,PAL.C7);pt(b,'258',123,69,PAL.W7);
  fill(b,97,18,224,14,PAL.N0);tiny(b,'NOPEAI',101,23,PAL.C7);pt(b,st.valuation??'$86,000,000,000',144,21,PAL.W6);
  // Door's drum, brass wings and lit pavement.
  fill(b,372,39,92,116,PAL.N1);fill(b,376,43,84,108,PAL.C4);fill(b,376,102,84,49,PAL.N4);fill(b,376,42,84,4,PAL.W6);fill(b,376,148,84,5,PAL.W4);
  for(const x of [376,416,459])fill(b,x,45,3,105,PAL.W3);
  if(st.industrial){const phase=st.spin?Math.floor(f/4)%8:0;const dx=Math.round(Math.cos(phase*Math.PI/4)*35);ln(b,418,45,418+dx,50,PAL.W6);ln(b,418,149,418+dx,145,PAL.W6);ln(b,418+dx,50,418+dx,145,PAL.W5);ln(b,418,46,418-dx,51,PAL.W4);ln(b,418-dx,51,418-dx,145,PAL.W4);tiny(b,'INDUSTRIAL',387,156,PAL.W6);}
  else tiny(b,'A NONPROFIT',385,156,PAL.W6);
  // February flyers and the complaint-as-side-table carried from Ep2.
  for(let i=0;i<3;i++){fill(b,174,61+i*21,9,15,PAL.P1);fill(b,177,64+i*21,3,8,PAL.N2);}
  fill(b,315,160,41,8,PAL.P1);for(let j=0;j<5;j++)fill(b,315,162+j,41,1,j%2?PAL.P0:PAL.P1);fill(b,321,153,7,9,PAL.P2);fill(b,335,153,7,9,PAL.P2);
  if(st.shipmas){fill(b,303,45,64,102,PAL.N1);for(let i=0;i<12;i++){const x=308+(i%3)*19,y=50+Math.floor(i/3)*23;fill(b,x,y,16,20,PAL.W3);fill(b,x+2,y+2,12,16,PAL.N3);tiny(b,String(i+1),x+5,y+7,PAL.W7);}}
  void sh;
}
export function alley(b:Buf,f:number,sh:PxShot,ellipsis=false){
  vramp(b,0,0,480,203,[PAL.N0,PAL.N1,PAL.N2]);for(let y=13;y<161;y+=10){fill(b,0,y,480,1,PAL.N0);for(let x=(y%20?0:13);x<480;x+=26)fill(b,x,y-9,1,9,PAL.N1);}
  fill(b,0,161,480,42,PAL.N1);for(let i=0;i<70;i++){const x=(i*41)%480,y=165+(i*17)%36;fill(b,x,y,5,1,PAL.N2);}
  bezel(b,14,19,193,133,{face:PAL.D1,hi:PAL.D3,lo:PAL.D0,t:5});fill(b,20,25,181,121,PAL.D2);
  for(let i=0;i<20;i++){const x=28+(i*41)%162,y=31+(i*31)%102;ln(b,109,80,x,y,PAL.R2);fill(b,x-1,y-1,3,3,PAL.W6);}
  fill(b,78,49,62,61,PAL.P1);if(ellipsis){pt(b,'THINKING...',83,61,PAL.N1);pt(b,'...',94,83,PAL.R2);}else strawberry(b,109,73,2);
  fill(b,325,42,155,136,PAL.L1);fill(b,331,48,149,115,PAL.L2);fill(b,333,71,142,63,PAL.N0);fill(b,333,71,142,3,PAL.W7);tiny(b,'TACOS',370,56,PAL.P2);fill(b,330,135,150,6,PAL.W4);for(const x of [349,451])ellipse(x,178,15,15,b.ink(PAL.N0));
  fill(b,214,139,91,6,PAL.G4);for(const x of [219,294])fill(b,x,145,3,44,PAL.G2);fill(b,234,115,35,22,PAL.N1);fill(b,237,118,29,16,PAL.C3);
  actor(b,'CORKBOARD GUY',164,192,sh,f);actor(b,'SECOND TRUTHER',274,192,sh,f,true);
  const cook=new Buf(480,270,0x1000000);actor(cook,'COOK',402,175,sh,f);
  for(let y=72;y<134;y++)for(let x=334;x<474;x++){const c=cook.get(x,y);if(c!==0x1000000)b.set(x,y,c);}
  if(Math.floor(f/6)%2)fill(b,384,87,3,20,PAL.W4);
}
export function beach(b:Buf,f:number,sh:PxShot,night=false){
  vramp(b,0,0,480,203,night?[PAL.N0,PAL.N1,PAL.C0]:[PAL.C5,PAL.C7,PAL.C8]);fill(b,0,80,480,48,night?PAL.C1:PAL.C4);fill(b,0,125,480,78,PAL.W3);
  for(let j=0;j<4;j++){const y=90+j*9+Math.floor(f/8)%4;for(let x=0;x<480;x+=27)fill(b,x+j*7,y,17,1,night?PAL.C3:PAL.C7);}
  for(let i=0;i<140;i++)b.set((i*61)%480,131+(i*43)%70,i%3?PAL.W2:PAL.W4);
  // Gerg is supported by a folding beach chair; laptop and hands have a deck.
  for(const x of [193,237])ln(b,x-10,151,x+8,198,PAL.G4);fill(b,187,139,52,31,PAL.L2);fill(b,188,143,50,4,PAL.P1);fill(b,188,155,50,4,PAL.P1);
  drawGergPose(b,211,194,{...GERG_POSE_DEFAULT,body:'sit',type:Math.floor(f/3)%3 as 0|1|2,mouth:live(sh,f,'GERG')?'open':'rest'});
  fill(b,365,57,5,81,PAL.D3);fill(b,404,57,5,81,PAL.D3);fill(b,354,42,67,33,PAL.W4);fill(b,360,47,55,20,PAL.N1);poly([348,42,387,21,426,42],b.ink(PAL.W6));
  if(night){for(let i=0;i<5;i++){fill(b,275+i*13,151-i%2*9,11,22,PAL.W2);fill(b,277+i*13,155-i%2*9,7,1,PAL.C5);}ln(b,301,178,398,132,PAL.N1);}
  for(let i=0;i<10;i++)keycap(b,120+(i*31)%210,180+(i*7)%17);
}
export function stadium(b:Buf,f:number,sh:PxShot,mode='stadium-box'){
  vramp(b,0,0,480,203,[PAL.N0,PAL.N1,PAL.N3]);
  for(let row=0;row<7;row++)for(let col=0;col<66;col++){const x=col*8-10+row%2*4,y=25+row*9;ellipse(x,y,2,2,b.ink(row%2?PAL.W4:PAL.N7));fill(b,x-2,y+2,5,3,[PAL.N4,PAL.C3,PAL.R1,PAL.D2][col%4]);}
  poly([45,93,435,93,479,181,0,181],b.ink(PAL.L1));for(let y=100;y<180;y+=12)ln(b,20,y,461,y,PAL.L3);ln(b,240,94,240,180,PAL.P1);
  for(let i=1;i<=3;i++){const x=102+(i-1)*126;ln(b,x-18,98,x-18,135,PAL.W6);ln(b,x+18,98,x+18,135,PAL.W6);ln(b,x-18,125,x+18,125,PAL.W6);ln(b,x,125,x,148,PAL.W6);pt(b,String(i),x-3,89,PAL.P2);}
  fill(b,158,2,164,31,PAL.N0);fill(b,160,4,160,27,PAL.N3);tiny(b,'HOW MANY R\'S IN STRAWBERRY?',178,9,PAL.P2);
  if(mode.includes('shutter')){const down=Math.min(137,Math.floor(f/3)*5);fill(b,0,40,480,down,PAL.G3);for(let y=42;y<40+down;y+=6){fill(b,0,y,480,1,PAL.G1);fill(b,0,y+1,480,1,PAL.G5);}if(down>110){center(b,'THOUGHTS SUMMARIZED',87,PAL.P2);center(b,'FOR YOUR SAFETY',102,PAL.P2);}}
  else if(mode.includes('kick')){const u=Math.min(1,f/45);strawberry(b,Math.round(235+(mode.includes('old')?-7:119)*u),Math.round(155-103*Math.sin(u*Math.PI)),1);fill(b,227,159,26,18,PAL.P2);fill(b,230,160,20,13,PAL.C3);tiny(b,mode.includes('old')?'2':'3',236,164,PAL.N0);}
  else if(mode.includes('band')){const word='STRAWBERRY';for(let i=0;i<word.length;i++){const x=108+i*27;pt(b,word[i],x,137,word[i]==='R'?PAL.W7:PAL.P2);fill(b,x,150,3,6,PAL.N3);}}
  // Owner's box is a physical foreground ledge; seats under both figures.
  fill(b,0,180,480,23,PAL.N1);fill(b,0,178,480,3,PAL.W4);
  if(mode==='stadium-box'||mode.includes('fancam')){portrait(b,'MAS',45,84,sh,f);portrait(b,'MAON',322,61,sh,f);fill(b,0,180,480,23,PAL.N2);glass(b,163,171);orb(b,151,115,f);}
}
export function darkroom(b:Buf,f:number,sh:PxShot,screen?: (b:Buf)=>void){
  vramp(b,0,0,480,203,[PAL.N0,PAL.N1,PAL.N2]);fill(b,310,25,142,86,PAL.N0);for(let i=0;i<26;i++){const x=316+(i*23)%130,y=29+(i*31)%73;fill(b,x,y,2,3,PAL.W3);}
  bezel(b,145,36,163,104,{face:PAL.N1,hi:PAL.N5,lo:PAL.N0,t:5});fill(b,151,42,151,92,PAL.C1);
  if(screen){const s=new Buf(480,203,PAL.N0);screen(s);for(let y=0;y<90;y++)for(let x=0;x<150;x++)b.set(151+x,43+y,s.get(Math.floor(x*480/150),Math.floor(y*203/90)));}
  fill(b,105,158,260,8,PAL.N4);fill(b,111,166,8,37,PAL.N1);fill(b,348,166,8,37,PAL.N1);fill(b,225,140,8,18,PAL.N3);fill(b,198,156,61,3,PAL.N2);
  actor(b,'MAS',99,202,sh,f);orb(b,144,111,f);glass(b,317,147);
  fill(b,24,27,91,29,PAL.N0);tiny(b,'SUPERINTELLIGENCE IN:',29,32,PAL.W5);tiny(b,'A FEW THOUSAND DAYS',29,43,PAL.C7);
  // Three collar souvenirs and the safety-committee lanyard, never a new collar pop.
  for(let i=0;i<3;i++){ln(b,41+i*15,85,35+i*15,102,PAL.G4);ln(b,35+i*15,102,47+i*15,102,PAL.G4);}fill(b,79,80,1,29,PAL.C4);fill(b,75,106,9,11,PAL.C2);
}
export function boardroom(b:Buf,f:number,sh:PxShot,number='$157,000,000,000'){
  vramp(b,0,0,480,203,[PAL.N2,PAL.N4,PAL.N3]);
  for(let x=20;x<480;x+=77){fill(b,x,0,11,121,PAL.N1);fill(b,x+1,0,2,121,PAL.N6);}
  bezel(b,122,20,230,84,{face:PAL.W3,t:4});fill(b,127,25,220,74,PAL.C3);fill(b,155,39,172,17,PAL.N0);pt(b,number,164,44,PAL.W6);
  for(const x of [51,413]){fill(b,x,114,30,60,PAL.N1);fill(b,x+3,116,24,54,PAL.N3);}
  actor(b,'MAS',74,177,sh,f,false,4);actor(b,'AUHSOJ',404,177,sh,f,true);orb(b,155,113,f);
  poly([130,119,348,119,458,202,21,202],b.ink(PAL.D2));ln(b,130,119,348,119,PAL.W5);for(let y=127;y<203;y+=11)ln(b,111,y,366,y,PAL.D3);
  fill(b,201,137,75,36,PAL.P2);for(let i=0;i<5;i++)fill(b,208,143+i*5,59-i*5,1,PAL.G4);glass(b,153,149);glass(b,320,149);
}
export function lighthouse(b:Buf,f:number,sh:PxShot){
  vramp(b,0,0,480,203,[PAL.D1,PAL.D2,PAL.D3]);for(let y=6;y<160;y+=8){fill(b,0,y,480,1,PAL.D0);for(let x=(y%16?0:17);x<480;x+=34)fill(b,x,y-7,1,7,PAL.D1);}
  bezel(b,183,18,116,91,{face:PAL.W3,t:4});fill(b,188,23,106,81,PAL.C2);fill(b,188,69,106,35,PAL.C3);const sweep=Math.floor(f/8)%120;ln(b,241,25,188+sweep,100,PAL.W4);
  for(let i=0;i<9;i++){const x=13+i*15,y=120-(i%4)*8;fill(b,x,y,12,43,PAL.P1);for(let j=0;j<6;j++)fill(b,x,y+j*7,12,1,PAL.D2);}
  actor(b,'MARIO',156,181,sh,f);actor(b,'ADELINA',338,181,sh,f,true);fill(b,69,157,127,8,PAL.D4);fill(b,293,157,126,8,PAL.D4);for(const x of [73,188,299,410])fill(b,x,165,5,38,PAL.D1);
  for(let i=0;i<20;i++){const x=185+i*8,y=167+Math.floor(Math.sin(i/3)*10);fill(b,x,y,11,3,PAL.P2);if(i%2===0)fill(b,x+3,y,4,1,PAL.G4);}
  fill(b,351,143,27,14,PAL.N1);fill(b,354,144,21,2,PAL.G4);for(let i=0;i<5;i++)fill(b,356+i*4,157,2,15,PAL.P1);
}
export function terrace(b:Buf,f:number,sh:PxShot,reveal=false){
  vramp(b,0,0,480,203,[PAL.N0,PAL.N1,PAL.N2]);fill(b,0,144,480,59,PAL.W2);for(let y=149;y<203;y+=12)fill(b,0,y,480,1,PAL.W1);for(let x=0;x<480;x+=42)ln(b,240,110,x,203,PAL.W1);
  for(const [x,h] of [[19,90],[101,80],[455,112]]){fill(b,x,144-h,6,h,PAL.D2);for(let i=0;i<7;i++){const a=i*Math.PI/4;ln(b,x+3,144-h,x+3+Math.cos(a)*38,144-h+Math.sin(a)*14,PAL.L1);ln(b,x+3,145-h,x+3+Math.cos(a)*31,145-h+Math.sin(a)*19,PAL.L2);}}
  fill(b,421,28,29,112,PAL.W4);fill(b,424,31,23,106,PAL.W6);fill(b,427,34,17,100,PAL.W3);
  for(const x of [53,150,249]){ellipse(x,155,5,3,b.ink(PAL.W7));fill(b,x-1,155,3,37,PAL.W4);ellipse(x,193,7,2,b.ink(PAL.W3));}ln(b,55,157,149,163,PAL.R1);ln(b,151,163,247,157,PAL.R1);
  podium(b,341,172,f,reveal,reveal);actor(b,'MAS',214,195,sh,f,false,4);orb(b,246,118,f);
  // The step is the actual support for Nole, who stands on it in this first pass.
  fill(b,284,181,49,14,PAL.W3);actor(b,'NOLE',308,182,sh,f);
  if(!reveal){actor(b,'MIT KOOC',134,196,sh,f);actor(b,'SKCAS',58,182,sh,f);}
}
export function paperBook(b:Buf,f:number,sh:PxShot){
  fill(b,0,0,480,203,PAL.P1);fill(b,237,0,5,203,PAL.D2);for(let i=0;i<18;i++)ln(b,241,199,16+i*26,111+(i%3)*9,PAL.P0);
  poly([0,144,93,72,167,144],b.ink(PAL.L2));poly([270,144,370,60,479,144],b.ink(PAL.L1));fill(b,0,145,480,24,PAL.D3);
  const x=68+Math.min(65,Math.floor(f/5));paper(b,t=>{fill(t,x,92,132,46,PAL.W6);fill(t,x+3,96,126,21,PAL.N3);for(let i=0;i<11;i++){const xx=x+8+i*11;fill(t,xx,100,7,10,PAL.C5);ellipse(xx+3,105,3,4,t.ink(PAL.S3));}fill(t,x+63,91,4,48,PAL.P1);for(const xx of [x+17,x+112])ellipse(xx,140,10,10,t.ink(PAL.N1));tiny(t,'MISANTHROPIC',x+12,122,PAL.N2);});
  fill(b,0,0,480,4,PAL.F3);fill(b,0,199,480,4,PAL.F3);void sh;
}
