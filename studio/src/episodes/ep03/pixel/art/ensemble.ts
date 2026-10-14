// Episode 3's cast adapter. Established rigs are imported read-only; new supporting
// roles are composites from the civic kit. All mouths follow the master lock.
import {Buf, ellipse, TRANSPARENT} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {blitImg} from '../../../../shared/pixel/figure';
import {drawMasStand2} from '../../../ep02/pixel/art/cast/mas2';
import {drawMasMedium, MAS_MEDIUM_DEFAULT} from '../../../../shared/pixel/cast/mas-medium';
import {drawCollarsMedium, drawCollarsStand} from '../../../../shared/pixel/cast/mas-collars';
import {drawGergStand, GERG_STAND_DEFAULT} from '../../../../shared/pixel/cast/gerg-stand';
import {drawGergPortrait, GERG_PORTRAIT_DEFAULT} from '../../../../shared/pixel/cast/gerg';
import {drawMarioPortrait, MARIO_PORTRAIT_REST, marioImg, MARIO_BASE} from '../../../../shared/pixel/cast/mario';
import {drawNolePortrait, NOLE_PORTRAIT_REST, noleImg, NOLE_BASE} from '../../../../shared/pixel/cast/nole';
import {drawAdelinaRoom, ADELINA_ROOM_DEFAULT, drawAdelinaPortrait, ADELINA_PORTRAIT_DEFAULT} from '../../../../shared/pixel/cast/adelina';
import {drawRimaStand, RIMA_STAND_DEFAULT} from '../../../../shared/pixel/cast/rima-stand';
import {drawRimaSpeakPortrait, RIMA_PORTRAIT_DEFAULT} from '../../../../shared/pixel/cast/rima-speak';
import {makeRoom,makeBust3} from '../../../ep02/pixel/art/cast/civic2';
import type {BustSpec3,BustState} from '../../../ep02/pixel/art/cast/civic2';
import {SKIN, SUIT, HAIR, SHIRT_WHITE} from '../../../../shared/pixel/cast/civic-kit';
import {roomMouth, mouth} from '../lipsync';
import type {PxShot} from '../types';
import {fill, tiny} from '../../../ep02/pixel/art/kit';

const basics = {skin: SKIN.medium, suit: SUIT.charcoal, shirt: SHIRT_WHITE, hair: HAIR.dark, tie: [PAL.N0,PAL.R0,PAL.R1,PAL.R2,PAL.R3,PAL.R3]};
const extras: Record<string,ReturnType<typeof makeRoom>> = {};
const rig = (id: string) => extras[id] ??= makeRoom({kind: id==='CORKBOARD GUY'?'jacket':'suit',
  ramps: {...basics, suit: id==='MAON'?SUIT.teal:id==='CORKBOARD GUY'?SUIT.plum:id==='MOSWEN'?SUIT.navy:id==='RUMPT'?SUIT.navy:SUIT.charcoal,
    hair: id==='RUMPT'?[PAL.D1,PAL.W2,PAL.W3,PAL.W4,PAL.W6,PAL.W7]:id==='MOSWEN'?HAIR.silver:HAIR.dark}});
const busts:Record<string,ReturnType<typeof makeBust3<BustState>>>={};
const bustFor=(id:string)=>{
 if(busts[id])return busts[id];
 const skin=id==='SECOND TRUTHER'?SKIN.deep:SKIN.medium;
 const suit=id==='MAON'?SUIT.teal:id==='CORKBOARD GUY'?SUIT.plum:SUIT.charcoal;
 const hair=id==='MOSWEN'?HAIR.silver:HAIR.dark;
 const spec:BustSpec3={
  head:{yaw:22,at:[57,57],scale:1,cranium:[20,24,23],cheekW:16,jawW:14.5,jawY:18,chinY:32,chinW:7,chinZ:12,cheekbone:.7,full:.8,brow:1.6,
    nose:{tipY:13,proj:6,wing:5.4,tip:3.6},mouthY:22,lips:1.4,eyeX:8.5,neck:{r:9.5,throat:true},hair:{style:id==='CORKBOARD GUY'?'curly':id==='MOSWEN'?'swept':'crop',thick:2.6,line:-18},skin,hairRamp:hair,back:{skin:PAL.S2,hair:PAL.B2}},
  face:{eye:'almond',eyeW:9,eyeH:2,brow:'soft',browCol:PAL.N0,mouthW:10,lip:{line:PAL.S0,lower:PAL.S2}},torso:{kind:'jacket'},
  ramps:{skin,hair,suit,shirt:SHIRT_WHITE},backRamp:{skin:PAL.S2,hair:PAL.B2,suit:PAL.C3}};
 return busts[id]=makeBust3<BustState>(spec);
};
const norm=(s:string)=>s.toUpperCase().replace(/-/g,' ');
export const live = (sh: PxShot,k:number,id:string) => sh.lines.some(l=>norm(l.who)===norm(id)&&l.kind!=='vo'&&l.kind!=='post'&&k>=l.s&&k<l.e);
const who=(sh:PxShot,id:string)=>sh.lines.find(l=>norm(l.who)===norm(id))?.who??id;
const rm = (sh:PxShot,k:number,id:string) => live(sh,k,id)?roomMouth(sh,k,who(sh,id)):'rest';
const vm = (sh:PxShot,k:number,id:string) => live(sh,k,id)?mouth(sh,k,who(sh,id)):'rest';
export const glass = (b:Buf,x:number,y:number) => {fill(b,x,y,8,13,PAL.C5);fill(b,x+1,y+1,6,10,PAL.N5);fill(b,x+1,y+5,6,1,PAL.C8);fill(b,x+2,y+6,4,5,PAL.C3);};
export function actor(b:Buf,id:string,x:number,y:number,sh:PxShot,k:number,flip=false,collars=3) {
  const m=rm(sh,k,id),open=m==='rest'?'rest':'open';
  ellipse(x,y+1,18,3,b.ink(PAL.N0));
  if(id==='MAS'){drawMasStand2(b,x,y,{arm:/phone|call/.test(sh.picture??'')?'phone':'glass',mouth:open,light:'room'},{flip});drawCollarsStand(b,x,y,collars,{flip});return;}
  if(id==='GERG'){drawGergStand(b,x,y,{...GERG_STAND_DEFAULT,type:Math.floor(k/3)%3 as 0|1|2,mouth:open},{flip});return;}
  if(id==='MARIO'){blitImg(b,marioImg({...MARIO_BASE,arm:live(sh,k,id)?'raise':'scroll',scroll:true,mouth:open==='open'?1:0}),x-33,y-80,{flip});return;}
  if(id==='NOLE'){blitImg(b,noleImg({...NOLE_BASE,arm:live(sh,k,id)?'jab':'phone',mouth:open==='open'?1:0}),x-41,y-93,{flip});return;}
  if(id==='ADELINA'){drawAdelinaRoom(b,x,y,{...ADELINA_ROOM_DEFAULT,mouth:open},{flip});return;}
  if(id==='RIMA'){drawRimaStand(b,x,y,{...RIMA_STAND_DEFAULT,mouth:open},{flip});return;}
  rig(id).draw(b,x,y,{arm:live(sh,k,id)?'point':'down',head:{hair:id==='CORKBOARD GUY'?'curly':id==='MAON'?'short':'swoop',mouth:open},tie:id==='RUMPT'},{flip});
  if(id==='MAON'){ellipse(x+15,y-43,4,5,b.ink(PAL.W5));fill(b,x+15,y-46,1,4,PAL.N1);fill(b,x+13,y-50,4,2,PAL.W6);}
  if(id==='CORKBOARD GUY'){fill(b,x-11,y-73,3,17,PAL.W7);fill(b,x-14,y-77,7,4,PAL.W6);}
  if(id==='RUMPT')fill(b,x-2,y-57,5,42,PAL.R2);
}

// Frameless singles: established portrait proportions, with room scenery left visible.
export function portrait(b:Buf,id:string,x:number,y:number,sh:PxShot,k:number,collars=3) {
  const m=vm(sh,k,id),open=m==='rest'?'rest':'open';
  if(id==='MAS'){drawMasMedium(b,x,y,{...MAS_MEDIUM_DEFAULT,arm:'down',light:'warm',mouth:m as never});drawCollarsMedium(b,x,y,collars);return;}
  if(id==='GERG'){drawGergPortrait(b,x,y,{...GERG_PORTRAIT_DEFAULT,mouth:open});return;}
  if(id==='MARIO'){drawMarioPortrait(b,x,y,{...MARIO_PORTRAIT_REST,mouth:m==='rest'?0:m==='O'?3:m==='M'?2:1});return;}
  if(id==='NOLE'){drawNolePortrait(b,x,y,{...NOLE_PORTRAIT_REST,mouth:m==='rest'?0:m==='O'?3:m==='M'?4:1});return;}
  if(id==='ADELINA'){drawAdelinaPortrait(b,x,y,{...ADELINA_PORTRAIT_DEFAULT,mouth:m as never});return;}
  if(id==='RIMA'){drawRimaSpeakPortrait(b,x,y,{...RIMA_PORTRAIT_DEFAULT,mouth:m as never});return;}
  // New roles have their own native portrait mesh, matching the established cast's grid.
  blitImg(b,bustFor(id)({mouth:m as never,expr:'neutral'}),x,y);
  if(id==='MAON'){ellipse(x+83,y+96,7,9,b.ink(PAL.W5));fill(b,x+82,y+89,1,7,PAL.N1);}
}
export function keycap(b:Buf,x:number,y:number,s=1,legend=''){
  fill(b,x+2*s,y+3*s,18*s,13*s,PAL.N0);fill(b,x,y,18*s,13*s,PAL.G4);fill(b,x+2*s,y+2*s,14*s,8*s,PAL.G6);fill(b,x+3*s,y+3*s,12*s,1*s,PAL.P1);if(legend)tiny(b,legend,x+3*s,y+5*s,PAL.N1);
}
