// MR. MAS — Ep1 full-v3, v3-art-a: the cold open's stills (sc 1–4).
import {Buf, rect} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {Mask} from '../../../../../shared/pixel/mask';
import {D} from '../registry';
import {drawApecWide, drawApecMCU, drawApecTable, drawApec2S, apecFreeze, apecScrub} from '../../../../../shared/pixel/rooms/apec-stage';

const M = 'shared/pixel/rooms/apec-stage.ts';
// ------------------------------------------------------------------ ROOM-APEC
D({id: 'ROOM-APEC', state: 'wide-arrival', module: M + ' drawApecWide', note: 'sc 1 [W] first frame: the stage, the banquet seated, the lit window far off, the host\'s hand + card',
  draw: (fb) => drawApecWide(fb, 0, {ovation: 0})});
D({id: 'ROOM-APEC', state: 'wide-push-ovation', module: M + ' drawApecWide', note: 'sc 1 [W] end of the drift upstage (push 12): the ovation risen, the card lifted (the question)',
  draw: (fb) => drawApecWide(fb, 40, {ovation: 1, push: 12, lift: 1})});
D({id: 'ROOM-APEC', state: 'mcu-hail', module: M + ' drawApecMCU + cast/mas-collars.ts', note: 'sc 1 [MCU] answering, eyes on the host; the hailstone crossing the soft window (t 0.45); three collars',
  draw: (fb) => drawApecMCU(fb, 20, {hail: 0.45, mas: {mouth: 'E'}})});
D({id: 'ROOM-APEC', state: 'mcu-lit-window-off', module: M + ' drawApecMCU', note: 'sc 1 [MCU] "...forward": the lit window\'s phone off, the ovation risen',
  draw: (fb) => drawApecMCU(fb, 60, {litWin: false, ovation: 1, mas: {mouth: 'rest'}})});
D({id: 'ROOM-APEC', state: 'table-plink', module: M + ' drawApecTable', note: 'sc 1 [ECU] the plink: the stone bobbing in his glass (glyph noise, no letters), the host\'s glass over its rim',
  draw: (fb) => drawApecTable(fb, 4, {plink: 2, slosh: 3})});
D({id: 'ROOM-APEC', state: 'table-settled', module: M + ' drawApecTable', note: 'sc 1 [ECU] settled: his water line flat, the phone face-up and dark, the tent card legible',
  draw: (fb) => drawApecTable(fb, 30, {plink: 30, slosh: 1})});
D({id: 'ROOM-APEC', state: 'freeze', module: M + ' drawApecWide + apecFreeze', note: 'sc 2 [W] the freeze: navy and cream, Mas and his phone stay in colour (the live mask)',
  draw: (fb) => { const live = new Mask(480, 270); drawApecWide(fb, 0, {ovation: 1, hail: 'glass', slosh: 3, phone: 'invite', live}); apecFreeze(fb, live); }});
D({id: 'ROOM-APEC', state: 'mcu-invite-light', module: M + ' drawApecMCU', note: 'sc 2 [MCU] reading the invite: eyes down, the phone\'s white on his jaw from below frame',
  draw: (fb) => drawApecMCU(fb, 0, {phoneLight: 'invite', mas: {look: 0, lid: 1}})});
D({id: 'ROOM-APEC', state: 'mcu-accepted-light', module: M + ' drawApecMCU', note: 'sc 2 [MCU] "noted." eyes up; the light on his jaw steps to the calendar\'s pale blue',
  draw: (fb) => drawApecMCU(fb, 0, {phoneLight: 'accepted', mas: {mouth: 'M'}})});
D({id: 'ROOM-APEC', state: '2s-orb', module: M + ' drawApec2S', note: 'sc 3 [2S] Mas and the Orb (r 11): the iris on him (step 3 of 3)',
  draw: (fb) => drawApec2S(fb, 0, {})});
D({id: 'ROOM-APEC', state: 'scrub-steps', module: M + ' apecScrub', note: 'sc 3 [W] the step to paper white: k 1 (left), k 2, k 3 (right), in three strips',
  draw: (fb) => {
    const W = new Buf(480, 270, PAL.N0);
    [1, 2, 3].forEach((k, i) => { W.c.fill(PAL.N0); drawApecWide(W, 0, {ovation: 0}); apecScrub(W, k); for (let y = 0; y < 203; y++) for (let x = i * 160; x < i * 160 + 160; x++) fb.c[y * 480 + x] = W.c[y * 480 + x]; });
    rect(159, 0, 1, 203, fb.ink(PAL.N0)); rect(319, 0, 1, 203, fb.ink(PAL.N0));
  }});

// ------------------------------------------------------------------ UI-INVITE (sc 2)
import {drawInviteInsert} from '../../../../../shared/pixel/kits/phone-invite';
const MI = 'shared/pixel/kits/phone-invite.ts';
D({id: 'UI-INVITE', state: 'slide-k3', module: MI + ' drawInviteInsert', note: 'sc 2 [ECU] the phone lights; the invite slides down its screen (held step 2 of 3)',
  draw: (fb) => drawInviteInsert(fb, 3, {k: 3})});
D({id: 'UI-INVITE', state: 'invite', module: MI + ' drawInviteInsert', note: 'sc 2 [ECU] held to read: Board sync · Fri 12:00, four attendee circles with no names, Accept / Decline',
  draw: (fb) => drawInviteInsert(fb, 12, {k: 12})});
D({id: 'UI-INVITE', state: 'accepted', module: MI + ' drawInviteInsert', note: 'sc 2 on "noted.": accepted, the card and its light step to the calendar\'s pale blue',
  draw: (fb) => drawInviteInsert(fb, 40, {k: 40, state: 'accepted'})});

// ------------------------------------------------------------------ UI-REWIND-TOAST (sc 3) + GFX-1993 (sc 4)
import {drawRewindToast, drawRewindToast1bit, yearAt} from '../../../../../shared/pixel/kits/rewind-toast';
import {draw1993Dialog, DLG1993} from '../../../../../shared/pixel/kits/dialog-1993';
const MT = 'shared/pixel/kits/rewind-toast.ts';
D({id: 'UI-REWIND-TOAST', state: '2s-2023', module: MT + ' drawRewindToast + rooms/apec-stage.ts drawApec2S', note: 'sc 3 [2S] the toast pops beside the Orb, its year slot at 2023',
  draw: (fb) => { drawApec2S(fb, 0, {}); drawRewindToast(fb, 262, 60, {k: 6, year: 2023}); }});
D({id: 'UI-REWIND-TOAST', state: 'caught-2022', module: MT + ' drawRewindToast + rooms/apec-stage.ts apecScrub', note: 'sc 3 [W] the scrub catches on 2022 and holds (about a second), the room one step up its ramps',
  draw: (fb) => { drawApecWide(fb, 0, {ovation: 0}); apecScrub(fb, 1); const y = yearAt(1.0); drawRewindToast(fb, 176, 70, {k: 20, ...y}); }});
D({id: 'UI-REWIND-TOAST', state: 'slipping', module: MT + ' drawRewindToast', note: 'sc 3 [W] it slips: 2008 with the ones wheel mid-roll (the counter always turning now), k 3 of the white-out',
  draw: (fb) => { drawApecWide(fb, 0, {ovation: 0}); apecScrub(fb, 3); drawRewindToast(fb, 176, 70, {k: 40, year: 2008, roll: 0.5}); }});
const M93 = 'shared/pixel/kits/dialog-1993.ts';
D({id: 'GFX-1993', state: 'dialog', module: M93 + ' draw1993Dialog', note: 'sc 4 F1.1: paper white in a 3:2 pillarbox, the 1993 card; Are you sure? OK, Cancel greyed (50% dither)',
  draw: (fb) => draw1993Dialog(fb, {k: 10})});
D({id: 'GFX-1993', state: 'toast-too-far', module: M93 + ' + kits/rewind-toast.ts drawRewindToast1bit', note: 'sc 4: the Orb\'s toast, now in 1-bit: rewinding… too far',
  draw: (fb) => { draw1993Dialog(fb, {k: 40}); drawRewindToast1bit(fb, DLG1993.x + 40, DLG1993.y + DLG1993.h + 20, {k: 6}); }});
D({id: 'GFX-1993', state: 'open-step', module: M93 + ' draw1993Dialog', note: 'sc 4 the dialog opening: held step 2 of 2 (a 1993 zoom rect)',
  draw: (fb) => draw1993Dialog(fb, {k: 2})});

// ------------------------------------------------------------------ CAST-MAS-SEATED + PROP-COLLARS
import {drawMasSeated, MAS_SEATED_DEFAULT} from '../../../../../shared/pixel/cast/mas-seated';
import {drawCollarsPortrait, drawCollarsMedium, drawCollarsStand} from '../../../../../shared/pixel/cast/mas-collars';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../../shared/pixel/cast/mas';
import {drawMasMedium, MAS_MEDIUM_DEFAULT} from '../../../../../shared/pixel/cast/mas-medium';
import {drawMasStand, MAS_STAND_DEFAULT} from '../../../../../shared/pixel/cast/mas-stand';
import {blitImg} from '../../../../../shared/pixel/figure';
import {text} from '../../../../../shared/pixel/font';
D({id: 'CAST-MAS-SEATED', state: 'poses', module: 'shared/pixel/cast/mas-seated.ts drawMasSeated', note: 'seated, legs crossed, 3/4 to the right: lap, sip, hold, reach (down), phone (down); stage light',
  draw: (fb) => { rect(0, 0, 480, 203, fb.ink(PAL.F2)); rect(0, 150, 480, 53, fb.ink(PAL.N3)); (['lap', 'sip', 'hold', 'reach', 'phone'] as const).forEach((a, i) => { drawMasSeated(fb, 50 + i * 90, 150, {...MAS_SEATED_DEFAULT, arm: a, head: a === 'reach' || a === 'phone' ? 'down' : 'host'}); text(fb, a, 44 + i * 90, 176, PAL.N7); }); }});
D({id: 'PROP-COLLARS', state: 'scales', module: 'shared/pixel/cast/mas-collars.ts', note: 'the collar stack (coral, green, then cream): portrait 1/2/3, the pop\'s hop; medium 2/3 flipped; room scale 3',
  draw: (fb) => {
    rect(0, 0, 480, 203, fb.ink(PAL.N2));
    [1, 2, 3].forEach((n, i) => { const x = -30 + i * 90, y = 20; blitImg(fb, masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'warm', head: 'front'}), x, y); drawCollarsPortrait(fb, x, y, n, {head: 'front', pop: n === 3 ? 0 : undefined}); });
    drawMasMedium(fb, 270, 60, {...MAS_MEDIUM_DEFAULT, light: 'warm'}, {flip: true}); drawCollarsMedium(fb, 270, 60, 3, {flip: true});
    drawMasStand(fb, 440, 190, MAS_STAND_DEFAULT); drawCollarsStand(fb, 440, 190, 3);
  }});
