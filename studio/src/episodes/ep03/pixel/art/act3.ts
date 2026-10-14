// The keycap call and rival's paper sequence: held, readable native faces and physical business.
import {Buf,ellipse,line,poly,TRANSPARENT} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {applyPalette} from '../../../../shared/pixel/palettes';
import {drawGergPortrait,GERG_PORTRAIT_DEFAULT} from '../../../../shared/pixel/cast/gerg';
import {live} from './ensemble';
import * as A from './world';
import type {PxShot} from '../types';
const no=(sh:PxShot)=>Number(sh.id.split('.').pop());
const progress=(sh:PxShot,k:number)=>Math.min(1,k/Math.max(1,sh.e-sh.s-1));
function phone(b:Buf,x:number,y:number){A.fill(b,x,y,10,25,PAL.N0);A.fill(b,x+2,y+2,6,20,PAL.C3);A.fill(b,x-2,y+10,3,6,PAL.S3);}
function callClose(b:Buf,k:number,sh:PxShot,gerg:boolean){
 if(gerg){A.beach(b,k,sh,true);A.fill(b,101,103,130,100,PAL.L1);A.fill(b,105,107,122,5,PAL.P1);A.portrait(b,'GERG',111,29,sh,k);A.fill(b,82,165,180,9,PAL.N3);for(let i=0;i<32;i++)A.fill(b,91+(i%16)*10,167+Math.floor(i/16)*4,7,2,PAL.G5);phone(b,215,101);}
 else{A.darkroom(b,k,sh);A.portrait(b,'MAS',167,37,sh,k);phone(b,229,102);A.keycap(b,271,157,2);}
}
function paperBus(b:Buf,k:number,sh:PxShot){
 const p=progress(sh,k);A.fill(b,0,0,480,203,PAL.P1);A.fill(b,238,0,4,203,PAL.D2);
 // Hinged hills rise, retain paper fold shadows and the book's central gutter.
 const rise=Math.min(1,p*5);poly([0,146,96,146-65*rise,181,146],b.ink(PAL.L2));poly([266,146,370,146-85*rise,479,146],b.ink(PAL.L1));
 for(let i=0;i<16;i++)line(240,199,i*31,144,b.ink(PAL.P0));A.fill(b,0,145,480,22,PAL.D3);
 const split=Math.max(0,Math.min(1,(p-.22)*3));
 // Front half retains the engine; rear half takes ELEVEN figures in an invented band-breakup metaphor.
 const front=70-Math.round(split*55),rear=177+Math.round(split*100);
 for(const [x,w,label] of [[front,105,'NOPE AI'],[rear,168,'MISANTHROPIC']] as Array<[number,number,string]>){
  A.fill(b,x+3,91,w,47,PAL.D2);A.fill(b,x,88,w,46,PAL.W5);A.fill(b,x+3,92,w-6,23,PAL.N2);A.tiny(b,label,x+8,121,PAL.N1);for(const xx of [x+15,x+w-18])ellipse(xx,139,9,9,b.ink(PAL.N0));
 }
 for(let i=0;i<11;i++){const x=rear+7+i*14;A.fill(b,x,96,10,16,PAL.C5);ellipse(x+5,101,3,4,b.ink(PAL.S3));A.fill(b,x+2,105,6,6,PAL.N4);}
 if(split<.4){A.fill(b,front+105,87,4,49,PAL.P1);for(let i=0;i<9;i++)A.fill(b,front+102+(i%2)*3,89+i*5,4,3,PAL.P1);}
 A.fill(b,0,0,480,4,PAL.F3);A.fill(b,0,199,480,4,PAL.F3);
}
export function drawAct3(b:Buf,k:number,sh:PxShot):boolean{
 const sc=sh.scene,n=no(sh),p=progress(sh,k);
 if(sc==='15'){
  if(n===2){A.boardroom(b,k,sh);A.portrait(b,'MAS',175,43,sh,k,4);return true;}
  A.fill(b,0,0,480,203,PAL.C6);A.fill(b,0,139,480,64,PAL.G3);A.fill(b,66,39,348,100,PAL.P1);A.fill(b,120,57,240,23,PAL.N1);A.pt(b,p<.4?'TPOOL':'TOD NEERG',194,65,PAL.C7);A.fill(b,191,104,45,35,PAL.N2);A.actor(b,'MAS',267,186,sh,k);
  for(let i=0;i<33;i++)A.fill(b,20+(i*61)%440,35+(i*29+Math.floor(k/4))%160,3,2,[PAL.W6,PAL.R2,PAL.C3][i%3]);A.fill(b,67,159,126,25,PAL.W4);A.pt(b,'$43.4M',99,168,PAL.N1);applyPalette(b,'EARLYWEB16',{rect:[0,0,480,203]});return true;
 }
 if(sc==='16'&&(n===2||n===3)){
  A.darkroom(b,k,sh);A.portrait(b,'MAS',80,47,sh,k,4);if(n===2){A.fill(b,320,21,109,182,PAL.N0);A.portrait(b,'STAFFER',319,42,sh,k);}return true;
 }
 if(sc==='17A'){
  if(n===1||n===6){A.darkroom(b,k,sh);A.portrait(b,'MAS',174,39,sh,k,4);A.keycap(b,278,153,2);if(n===1)phone(b,236,112);return true;}
  if(n===2||n===3){A.beach(b,k,sh,true);if(n===2){A.actor(b,'LIFEGUARD',296,198,sh,k,true);line(290,169,300,184,b.ink(PAL.W6));}else{const off=p>.18&&p<.46;for(let i=0;i<5;i++){A.fill(b,277+i*13,155-i%2*9,7,1,off?PAL.N2:PAL.C5);}line(232,181,353,134,b.ink(PAL.N0));}return true;}
  // Hold the listener on the other end until a real turn, then reverse once.
  const speaker=sh.lines.find(l=>l.kind==='dialogue'&&k>=l.s&&k<l.e)?.who??'';
  const gerg=n===5?speaker!=='MAS':false;callClose(b,k,sh,gerg);return true;
 }
 if(sc==='18'&&n<=5){
  A.lighthouse(b,k,sh);A.portrait(b,'MARIO',87,22,sh,k);A.portrait(b,'ADELINA',296,22,sh,k);
  A.fill(b,64,157,150,9,PAL.D4);A.fill(b,284,157,150,9,PAL.D4);for(let i=0;i<20;i++){const x=181+i*8,y=168+Math.floor(Math.sin(i/3)*9);A.fill(b,x,y,11,3,PAL.P2);if(i%2===0)A.fill(b,x+3,y,4,1,PAL.G4);}
  if(n===4||n===5){A.fill(b,219,38,61,119,PAL.N0);A.fill(b,222,43,55,112,PAL.D0);A.actor(b,'LUNCHMAS',249,155,sh,k);A.fill(b,234,122,32,24,PAL.D3);A.fill(b,234,123,32,2,PAL.W4);}
  A.fill(b,350,145,29,14,PAL.N1);A.fill(b,353,146,23,2,PAL.G4);for(let i=0;i<5;i++)A.fill(b,355+i*4,159,2,14,PAL.P1);
  if(n===5){A.fill(b,179,136,150,25,PAL.P2);A.tiny(b,'a country of geniuses',189,141,PAL.N1);A.tiny(b,'in a datacenter',189,151,PAL.N1);}
  return true;
 }
 if(sc==='18'&&n===6){
  A.skyline(b,k);const count=Math.min(42,Math.floor(p*46));for(let i=0;i<count;i++){const x=60+i*8,y=162-Math.floor(i*1.4);A.fill(b,x,y,9,3,PAL.P2);A.fill(b,x,y+3,9,1,PAL.D2);if(i%4===0)A.fill(b,x+3,y,3,1,PAL.G4);}
  if(count>=38){A.fill(b,338,85,100,22,PAL.N0);A.pt(b,'NOW HIRING',350,92,PAL.W6);}return true;
 }
 if(sc==='19'){
  if(n===1)paperBus(b,k,sh);else{A.skyline(b,k);for(let i=0;i<43;i++)A.fill(b,60+i*8,162-Math.floor(i*1.4),9,4,PAL.P2);A.actor(b,'LUNCHMAS',143,145,sh,k);A.fill(b,129,116,29,20,PAL.D3);A.portrait(b,'ADELINA',307,31,sh,k);}
  return true;
 }
 if(sc==='20'&&(n===5||n===6)){A.darkroom(b,k,sh);A.portrait(b,'MAS',91,48,sh,k,4);if(n===5){A.fill(b,321,19,105,184,PAL.N0);A.portrait(b,'STAFFER',317,44,sh,k);}return true;}
 return false;
}
