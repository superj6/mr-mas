// Episode 3 Act Two. Source-driven action and coverage for the four complete scenes.
// Only this file is new; all established rigs and masters are imported read-only.
import {Buf,TRANSPARENT,ellipse,line,poly} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {blitImg} from '../../../../shared/pixel/figure';
import {masPortrait,MAS_PORTRAIT_DEFAULT} from '../../../../shared/pixel/cast/mas';
import {gergPortrait,GERG_PORTRAIT_DEFAULT} from '../../../../shared/pixel/cast/gerg';
import {drawCollarsPortrait} from '../../../../shared/pixel/cast/mas-collars';
import {mouth} from '../lipsync';
import {vramp,pwrap} from '../../../ep02/pixel/art/kit';
import {actor,portrait,glass,keycap,live} from './ensemble';
import * as A from './world';
import type {PxShot} from '../types';
const fill=A.fill;
const ln=(b:Buf,x:number,y:number,u:number,v:number,c:number)=>line(x,y,u,v,b.ink(c));
function no(sh:PxShot){const id=(sh.beats??[]).find(x=>new RegExp(`^${sh.scene}\\.`).test(x))??sh.id;return Number(/\.(\d+)/.exec(id)?.[1]??1);}
function phase(sh:PxShot,k:number){return Math.max(0,Math.min(1,k/Math.max(1,sh.e-sh.s-1)));}
function masClose(b:Buf,x:number,y:number,sh:PxShot,k:number,collars=0,flip=true){
 const t=new Buf(112,136,TRANSPARENT);blitImg(t,masPortrait({...MAS_PORTRAIT_DEFAULT,light:'warm',mouth:(live(sh,k,'MAS')?mouth(sh,k,'MAS'):'rest') as never}),0,0);
 if(collars)drawCollarsPortrait(t,0,0,collars,{light:'warm'});
 for(let yy=0;yy<136;yy++)for(let xx=0;xx<112;xx++){const c=t.get(flip?111-xx:xx,yy);if(c!==TRANSPARENT)b.set(x+xx,y+yy,c);}
}
function gergClose(b:Buf,x:number,y:number,sh:PxShot,k:number){blitImg(b,gergPortrait({...GERG_PORTRAIT_DEFAULT,lid:0,mouth:live(sh,k,'GERG')?'open':'rest'}),x,y);}
function arrow(b:Buf,x:number,y:number,right=true){ln(b,x,y,x+(right?14:-14),y,PAL.W6);ln(b,x+(right?14:-14),y,x+(right?9:-9),y-4,PAL.W6);ln(b,x+(right?14:-14),y,x+(right?9:-9),y+4,PAL.W6);}
function clipboard(b:Buf,x:number,y:number,lines=4){fill(b,x,y,31,38,PAL.W3);fill(b,x+2,y+3,27,32,PAL.P2);fill(b,x+9,y-1,12,4,PAL.N3);for(let i=0;i<lines;i++)fill(b,x+5,y+10+i*5,19-i%2*4,1,PAL.G3);}
function laptop(b:Buf,x:number,y:number,sh:PxShot,k:number,call=false){
 fill(b,x,y,43,30,PAL.N0);fill(b,x+3,y+3,37,23,PAL.C1);fill(b,x-3,y+30,49,3,PAL.G4);
 if(call){const t=new Buf(480,270,TRANSPARENT);actor(t,'GERG',222,189,sh,k);for(let yy=0;yy<19;yy++)for(let xx=0;xx<21;xx++){const c=t.get(201+xx,112+yy*2);if(c!==TRANSPARENT)b.set(x+11+xx,y+5+yy,c);}fill(b,x+5,y+25,4,2,PAL.L3);}
 else for(let i=0;i<4;i++)fill(b,x+6,y+6+i*4,24-i*3,1,PAL.L3);
}
function oldDoor(b:Buf){
 // Leaning frame remains legible as the old physical object, beside the installed drum.
 poly([310,55,347,62,339,155,301,148],b.ink(PAL.W3));poly([313,60,343,66,336,148,305,143],b.ink(PAL.C3));
 ln(b,324,62,315,145,PAL.W6);ln(b,308,99,340,105,PAL.W5);A.tiny(b,'A NONPROFIT',294,161,PAL.W6);
 ellipse(322,155,28,3,b.ink(PAL.N0));
}
function doorCrate(b:Buf){fill(b,309,94,54,55,PAL.D2);fill(b,312,97,48,49,PAL.D3);for(let i=0;i<4;i++)fill(b,312,99+i*12,48,1,PAL.D1);ln(b,313,99,359,145,PAL.D4);ln(b,359,99,313,145,PAL.D4);A.tiny(b,'DOOR',324,113,PAL.N0);}
function photo(b:Buf,x:number,y:number,w=240,h=133,hole=true){
 fill(b,x-5,y-5,w+10,h+10,PAL.W3);fill(b,x-2,y-2,w+4,h+4,PAL.W6);fill(b,x,y,w,h,PAL.N4);
 const dx=w/7,dy=(h-20)/4,sw=Math.max(6,Math.floor(dx*.46));
 for(let i=0;i<28;i++){const xx=Math.round(x+dx*.5+(i%7)*dx),yy=Math.round(y+13+Math.floor(i/7)*dy);if(hole&&i===10){
   // Paper was cut out: uneven white cut edge and the room behind, not an AI/ghost.
   poly([xx-8,yy-3,xx-5,yy-9,xx+4,yy-10,xx+9,yy-3,xx+7,yy+4,xx+12,yy+9,xx+10,yy+19,xx-10,yy+19,xx-12,yy+8,xx-7,yy+4],b.ink(PAL.P1));
   poly([xx-6,yy-3,xx-3,yy-7,xx+3,yy-8,xx+7,yy-3,xx+5,yy+5,xx+10,yy+9,xx+8,yy+17,xx-8,yy+17,xx-10,yy+9,xx-5,yy+4],b.ink(PAL.N1));continue;}
  ellipse(xx,yy,sw*.42,sw*.48,b.ink(i%3===0?PAL.S4:PAL.S3));fill(b,xx-sw*.6,yy+sw*.4,sw*1.2,sw*.8,[PAL.N2,PAL.D2,PAL.C2][i%3]);
  fill(b,xx-3,yy-1,1,1,PAL.N0);fill(b,xx+2,yy-1,1,1,PAL.N0);fill(b,xx-1,yy+3,3,1,PAL.S1);
 }
 A.tiny(b,'CLASS PHOTO · 2024',x+Math.max(5,Math.floor(w/2)-45),y+h-10,PAL.P2);
}
function horizontalInstaller(b:Buf,sh:PxShot,k:number){
 const t=new Buf(100,110,TRANSPARENT);actor(t,'INSTALLER',48,104,sh,k);const ax=162,ay=137;
 for(let y=15;y<106;y++)for(let x=18;x<79;x++){const c=t.get(x,y);if(c!==TRANSPARENT)b.set(ax+104-y,ay+x-48,c);}
 // Bent forearm connects shoulder to gripping hand at reception's actual edge.
 ln(b,197,131,181,121,PAL.N5);ln(b,181,121,167,119,PAL.N5);fill(b,163,116,7,6,PAL.S4);for(let i=0;i<3;i++)fill(b,163+i*2,121,1,3,PAL.S2);
 clipboard(b,257,127,3);
}
function lobbyPair(b:Buf,sh:PxShot,k:number,n:number){
 A.lobby(b,k,sh,{industrial:n>1,photoHole:n>=9,spin:n>=2&&n<=8,valuation:'$86,000,000,000'});oldDoor(b);
 actor(b,'MAS',102,194,sh,k);A.orb(b,145,117,k);
 if(n===1){doorCrate(b);actor(b,'INSTALLER',346,195,sh,k,true);clipboard(b,126,125);laptop(b,43,88,sh,k,true);return;}
 if(n<=4){
  // Close physical pair: Rima is visibly INSIDE the glass drum, Mas outside it.
  // One shared room, native face grids, brass mullions clear of both eyes.
  vramp(b,0,0,480,203,[PAL.N2,PAL.N3,PAL.N4]);
  for(let y=15;y<150;y+=13){fill(b,0,y,263,1,PAL.N1);for(let x=0;x<260;x+=43)fill(b,x,y-12,1,12,PAL.N2);}
  fill(b,267,16,204,179,PAL.N1);fill(b,273,22,192,169,PAL.C2);fill(b,273,111,192,80,PAL.C3);
  fill(b,269,17,201,6,PAL.W6);fill(b,269,190,201,6,PAL.W4);
  for(const x of [274,458])fill(b,x,23,4,166,PAL.W3);
  masClose(b,59,43,sh,k,3,true);portrait(b,'RIMA',323,38,sh,k);
  const wing=294+Math.floor(Math.sin(k/75)*5);ln(b,wing,24,wing,188,PAL.W5);ln(b,367,23,wing,40,PAL.W6);ln(b,367,188,wing,176,PAL.W6);
  fill(b,0,179,233,24,PAL.N2);fill(b,0,177,233,3,PAL.W4);clipboard(b,180,138);glass(b,137,173);
  fill(b,332,173,58,23,PAL.D3);fill(b,332,173,58,2,PAL.W4);ln(b,349,173,349,179,PAL.D1);ln(b,372,173,372,179,PAL.D1);
  if(n===4){laptop(b,211,120,sh,k,true);A.tiny(b,'CALL',222,125,PAL.C7);}
 }else if(n===5||n===6){
  actor(b,'RIMA',420,153,sh,k,true);for(const x of [394,442]){actor(b,'STAFFER',x,154,sh,k);fill(b,x-13,120,25,17,PAL.D2);}
  if(n===6)horizontalInstaller(b,sh,k);
  // Every airborne item changes position; no global flash or luminance jump.
  for(let i=0;i<17;i++){const x=(30+i*51+Math.floor(k*(1+i%2)))%475,y=30+(i*31)%134;poly([x,y,x+12,y-3,x+14,y+4,x+2,y+7],b.ink(PAL.P1));fill(b,x+3,y+1,6,1,PAL.G4);}
  for(let i=0;i<6;i++){const y=53+i*23;ln(b,178,y,235+(Math.floor(k/6)%9),y-3,PAL.N6);}clipboard(b,120,130);
 }else if(n===7){
  const p=phase(sh,k);actor(b,'RIMA',445+Math.floor(p*56),155,sh,k,true);for(const x of [397,428])actor(b,'STAFFER',x+Math.floor(p*45),154,sh,k);laptop(b,44,88,sh,k,true);
 }else if(n===8){
  clipboard(b,120,130);fill(b,151,127,48,24,PAL.P2);for(let i=0;i<3;i++)fill(b,156,133+i*6,31-i*4,1,PAL.G4);fill(b,155+Math.floor(phase(sh,k)*14),141,19,2,PAL.C4);
 }else{
  // The photograph is physically on the wall behind reception, then the call sees it.
  fill(b,111,18,263,158,PAL.N1);photo(b,124,30,236,130,true);laptop(b,31,112,sh,k,true);
 }
}
function dinner(b:Buf,sh:PxShot,k:number,n:number){
 vramp(b,0,0,480,203,[PAL.D0,PAL.D1,PAL.D2]);for(let i=0;i<6;i++){fill(b,i*82,0,3,203,PAL.W2);fill(b,i*82+5,0,1,203,PAL.D3);}
 const seats=[64,136,208,280,352,424],names=['MAS','GERG','ALYI','MARIO','NOLE','INVESTOR'];
 if(n===1||n===5){
  for(let i=0;i<6;i++){fill(b,seats[i]-17,66,34,54,PAL.D0);fill(b,seats[i]-14,69,28,48,PAL.D3);actor(b,names[i],seats[i],153,sh,k,i>2);}
  poly([35,125,445,125,480,194,0,194],b.ink(PAL.D3));fill(b,0,191,480,5,PAL.W3);
  for(let i=0;i<6;i++){const x=seats[i];fill(b,x-10,146,21,9,PAL.P2);if(i<5)A.tiny(b,names[i],x-9,148,PAL.N1);fill(b,x-1,98,3,28,PAL.P1);ellipse(x,94+Math.floor(k/9)%2,2,5,b.ink(PAL.W7));ellipse(x,127,8,2,b.ink(PAL.W4));}
  if(n===5){const p=phase(sh,k);const dims=[4,3,2,1];for(let j=0;j<dims.length;j++){if(p<(j+.5)/5)continue;const x=seats[dims[j]];for(let yy=66;yy<125;yy++)for(let xx=x-22;xx<x+22;xx++){const c=b.get(xx,yy);const r=(c>>16)&255,g=(c>>8)&255,bl=c&255;b.set(xx,yy,(r+g+bl)>430?PAL.P1:PAL.N1);}}
   if(p>.85){fill(b,119,72,34,52,PAL.D0);fill(b,123,77,26,43,PAL.D2);fill(b,124,105,22,4,PAL.N0);} // Gerg's empty chair, laptop-shaped cushion dent.
  }
 }else if(n===2){
  // Real medium change stays inside an obvious phone bezel; only game pixels.
  A.bezel(b,88,33,304,147,{face:PAL.N0,hi:PAL.G4,lo:PAL.N0,t:8});fill(b,100,45,280,119,PAL.N0);
  for(let j=0;j<4;j++)for(let i=0;i<12;i++){if(i===10&&j>0)continue;fill(b,109+i*21,54+j*12,19,9,[PAL.R2,PAL.W6,PAL.L3,PAL.C5][j]);}
  const p=phase(sh,k),bx=328+Math.round(Math.sin(p*13)*13),by=50+Math.round(Math.abs(Math.sin(p*8))*81);fill(b,bx,by,4,4,PAL.P2);fill(b,293+Math.round(Math.sin(p*8)*34),151,42,4,PAL.P2);
 }else if(n===3||n===4){
  // Long conversation gets the known faces close with both people in one room.
  fill(b,66,71,45,76,PAL.D0);fill(b,338,71,45,76,PAL.D0);
  masClose(b,62,38,sh,k,0,true);gergClose(b,305,38,sh,k);
  poly([39,166,444,166,480,203,0,203],b.ink(PAL.D3));fill(b,0,166,480,2,PAL.W3);
  glass(b,137,154);fill(b,230,151,3,22,PAL.P1);ellipse(231,146+Math.floor(k/9)%2,2,5,b.ink(PAL.W7));ellipse(231,176,10,3,b.ink(PAL.W5));
  fill(b,245,166,53,25,PAL.P2);for(let i=0;i<(n===4?3:0);i++)fill(b,251,172+i*5,36-i*5,1,PAL.C2);
  if(n===3){ellipse(307,178,16,4,b.ink(PAL.P1));ellipse(307,175,9,4,b.ink(PAL.D4));laptop(b,331,146,sh,k);}
  else{const p=phase(sh,k);laptop(b,324,151+Math.floor(p*15),sh,k);ln(b,285,168,294,157,PAL.N1);fill(b,285+Math.floor(p*4),169,3,3,PAL.S4);A.tiny(b,'MONDAY',250,180,PAL.N1);}
 }else{
  A.beach(b,k,sh);laptop(b,259,133,sh,k,true);keycap(b,160,181,1);
 }
 // Gerg-owned memory only; present-day beach answer has no invented historical rim.
 if(n<=5){fill(b,0,0,480,4,PAL.L3);fill(b,0,199,480,4,PAL.L3);fill(b,0,0,4,203,PAL.L3);fill(b,476,0,4,203,PAL.L3);}
}
function hydra(b:Buf,x:number,y:number,popped:boolean,stubs:boolean,k:number){
 ellipse(x,y,18,10,b.ink(PAL.L2));for(const d of [-10,10]){fill(b,x+d,y+1,4,10,PAL.L1);fill(b,x+d-2,y+9,8,3,PAL.L3);}
 poly([x-16,y,x-34,y-5,x-29,y+1,x-17,y+4],b.ink(PAL.L1));
 if(!popped){ln(b,x+4,y-4,x+9,y-26,PAL.L3);ln(b,x+5,y-4,x+10,y-26,PAL.L3);ellipse(x+13,y-29,10,7,b.ink(PAL.L3));fill(b,x+18,y-32,2,2,PAL.N0);fill(b,x+22,y-28,6,2,PAL.P1);A.tiny(b,'1047',x-4,y-19,PAL.N0);}
 else{fill(b,x+3,y-13,7,9,PAL.P1);for(let i=0;i<3;i++)ln(b,x+3,y-11+i*2,x+9,y-9+i*2,PAL.G4);ellipse(x+51+Math.floor(k/9)%3,y+10,10,7,b.ink(PAL.L3));if(stubs)for(const d of [2,9]){fill(b,x+d,y-21,3,9,PAL.L2);ellipse(x+d+1,y-22,3,3,b.ink(PAL.L3));}}
}
function governor(b:Buf,sh:PxShot,k:number,n:number){
 vramp(b,0,0,480,203,[PAL.N2,PAL.N3,PAL.N5]);for(let x=19;x<480;x+=84){fill(b,x,17,52,118,PAL.N2);fill(b,x,17,52,2,PAL.W4);}
 actor(b,'MOSWEN',149,185,sh,k);actor(b,'RENEIW',354,193,sh,k,true);
 fill(b,48,139,229,9,PAL.D4);fill(b,57,148,211,55,PAL.D2);fill(b,90,127,109,12,PAL.P2);
 const p=phase(sh,k),pop=n>=4||(n===3&&p>.6);hydra(b,321,180,pop,n===4,k);
 ln(b,331,159,348,143,PAL.W4);ln(b,348,143,359,146,PAL.W4);fill(b,356,143,5,5,PAL.S3); // leash touches gripping hand.
 if(n===2){
  // The plea deserves faces at native 112x136, in a shared room, not distant sprites.
  vramp(b,0,0,480,203,[PAL.N2,PAL.N3,PAL.N5]);fill(b,239,0,3,134,PAL.W3);
  portrait(b,'MOSWEN',72,34,sh,k);portrait(b,'RENEIW',303,34,sh,k);
  poly([36,158,277,158,304,203,12,203],b.ink(PAL.D2));fill(b,36,156,241,3,PAL.D4);
  fill(b,174,151,69,8,PAL.P2);hydra(b,318,186,false,false,k);ln(b,330,162,353,140,PAL.W4);
 }
 if(n===1||n===2){fill(b,190,124,28,3,PAL.N1);fill(b,214,123,4,5,PAL.W7);clipboard(b,231,100,3);}
 if(n===3){
  // The message has a generous primary text hold before a visible signature/stamp.
  if(p<.6){fill(b,43,11,394,181,PAL.P2);A.pt(b,'GOVERNOR OF CALIFORNIA',62,26,PAL.N1);ln(b,62,40,417,40,PAL.G4);A.tiny(b,'SB 1047',62,49,PAL.N3);for(let i=0;i<3;i++)fill(b,63,65+i*9,320-i*32,1,PAL.G4);
   const clause=sh.texts.find(t=>t.kind==='doc'&&/curtailing/.test(t.text))?.text??'curtailing the very innovation that fuels advancement in favor of the public good.';
   pwrap(clause,350).forEach((row,i)=>A.pt(b,row,63,98+i*13,PAL.N1));A.tiny(b,'SEP 29, 2024',62,179,PAL.N3);
   ln(b,293,165,398,165,PAL.G4);if(p>.35){for(let i=0;i<22;i++)ln(b,301+i*3,157+(i%3)*2,304+i*3,161-(i%4),PAL.N1);fill(b,366,146,26,3,PAL.N1);}}
  else{fill(b,173,112,45,17,PAL.R1);A.tiny(b,'VETOED',179,118,PAL.P2);fill(b,206,106,7,10,PAL.S4);}
 }
 if(n===4){
  // Tag appears because Reneiw asks, rather than pre-spoiling the noticing beat.
  fill(b,187,126,31,3,PAL.N1);if(p>.5){ln(b,207,128,220,137,PAL.W4);fill(b,216,136,37,17,PAL.P2);A.tiny(b,'NEDIB',220,141,PAL.N1);}
 }
}
function boardroomPair(b:Buf,sh:PxShot,k:number,n:number){
 const p=phase(sh,k);let value='$86,000,000,000';if(n>=6)value='$157,000,000,000';
 A.boardroom(b,k,sh,value);
 if(n<6){
  // Fourth collar belongs only to new round: master starts at four, so restore three.
  actor(b,'MAS',74,177,sh,k,false,3);poly([130,119,348,119,458,202,21,202],b.ink(PAL.D2));ln(b,130,119,348,119,PAL.W5);glass(b,153,149);glass(b,320,149);
 }
 if(n===1){
  // New money moves through the actual lobby, opposite the returned old pallet.
  A.lobby(b,k,sh,{industrial:true,spin:true,valuation:'$86,000,000,000',photoHole:true});oldDoor(b);
  for(let i=0;i<3;i++){const x=415-i*38-Math.floor(p*45);actor(b,'INVESTOR',x,155+(i%2)*17,sh,k,true);fill(b,x-11,127,23,17,PAL.N1);}
  const x=253+Math.floor(p*111);fill(b,x,160,57,27,PAL.P1);A.tiny(b,'$7T',x+17,165,PAL.N1);A.tiny(b,'RETURN',x+8,173,PAL.R1);for(const dx of [5,45])ellipse(x+dx,192,4,4,b.ink(PAL.N0));arrow(b,365,185,true);
  actor(b,'MAS',100,194,sh,k,false,3);return;
 }
 if(n===7){
  vramp(b,0,0,480,203,[PAL.N2,PAL.N4,PAL.N3]);for(let x=24;x<480;x+=78){fill(b,x,0,8,135,PAL.N1);fill(b,x+1,0,2,135,PAL.N6);}
  masClose(b,65,38,sh,k,4,true);portrait(b,'AUHSOJ',302,38,sh,k);
  poly([19,163,460,163,480,203,0,203],b.ink(PAL.D2));fill(b,19,161,441,3,PAL.W4);
  fill(b,192,167,100,31,PAL.P2);A.tiny(b,'OWNER:',200,178,PAL.N1);ln(b,236,187,283,187,PAL.N1);
  if(p>.4)arrow(b,279,177,false);glass(b,148,171);return;
 }
 if(n===2||n===7||n===8){
  // Negotiation sheet is visibly generic; no fabricated actual term-sheet conditions.
  fill(b,189,138,106,40,PAL.P2);for(let i=0;i<3;i++)fill(b,197,146+i*8,89-i*13,1,PAL.G4);
  if(n===7){A.tiny(b,'OWNER:',198,163,PAL.N1);ln(b,234,169,282,169,PAL.N1);if(p>.4)arrow(b,282,163,false);}
  if(n===8){fill(b,202+Math.floor(p*38),164,3,2,PAL.N1);ln(b,239,153,257,166,PAL.N1);}
 }
 if(n===3||n===4){
  actor(b,'INVESTOR',319,185,sh,k,true);fill(b,275,123,28,32,PAL.P2);A.tiny(b,'PLEDGE',278,130,PAL.N1);
  const count=n===4?14:Math.min(14,4+Math.floor(p*11));for(let i=0;i<count;i++){const x=204+i*16,y=153+i*3;fill(b,x,y,22,9,PAL.P1);fill(b,x+2,y+3,15,1,PAL.G4);}A.tiny(b,'COMPETITORS',207,155,PAL.N1);
  if(n===4){fill(b,158,130,251,58,PAL.P2);A.pt(b,'...AND THE LEMONADE',171,145,PAL.N1);A.pt(b,'STAND ON 3RD',171,160,PAL.N1);}
 }
 if(n===5){
  // Thought close keeps sheet angled away and leaves the actual objective with Mas.
  portrait(b,'MAS',175,42,sh,k,3);clipboard(b,336,143,4);
 }
 if(n===6){
  const names=['$86,000,000,000','$96,000,000,000','$126,000,000,000','$157,000,000,000'];
  const val=names[Math.min(3,Math.floor(p*4))];fill(b,142,36,194,31,PAL.N0);A.pt(b,val,154,47,PAL.W6);
  for(let i=0;i<12;i++){const x=153+i*14;ln(b,x,41,x,61,PAL.N3);} // wheels have real dividers.
  actor(b,'MAS',74,177,sh,k,false,p>.68?4:3);poly([130,119,348,119,458,202,21,202],b.ink(PAL.D2));glass(b,153,149);
 }
 if(n===9){
  fill(b,142,36,194,31,PAL.N0);A.pt(b,p>.35?'$157,000,000,001':'$157,000,000,000',150,47,PAL.W6);
  for(let i=0;i<3;i++)actor(b,'INVESTOR',211+i*51,133,sh,k,i%2===1); // watching signed paper from far end.
 }
}
export function drawAct2(b:Buf,k:number,sh:PxShot,f:number):boolean{
 const n=no(sh);
 if(sh.scene==='11'){lobbyPair(b,sh,k,n);return true;}
 if(sh.scene==='12'){dinner(b,sh,k,n);return true;}
 if(sh.scene==='13'){governor(b,sh,k,n);return true;}
 if(sh.scene==='14'){boardroomPair(b,sh,k,n);return true;}
 void f;return false;
}

/** Exact veto excerpt belongs to the paper; root keeps rails/subtitles but skips generic document tag here. */
export function ownsAct2Text(sh:PxShot,k:number):boolean{return sh.scene==='13'&&no(sh)===3&&phase(sh,k)<.6;}
