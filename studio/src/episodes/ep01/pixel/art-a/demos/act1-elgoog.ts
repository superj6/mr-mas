// MR. MAS — Ep1 full-v3, v3-art-a: Act One sc 8 (the code red, on his phone) stills.
import {D} from '../registry';
import {Buf, rect} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {text} from '../../../../../shared/pixel/font';
import {drawElgoogLobby} from '../../../../../shared/pixel/rooms/elgoog-lobby';
import {drawAlertInsert, drawPhoneLockOTS} from '../../../../../shared/pixel/kits/phone-alert';
import {drawRadnus, RADNUS_DEFAULT} from '../../../../../shared/pixel/cast/radnus';
import {drawFounder, FOUNDER_DEFAULT} from '../../../../../shared/pixel/cast/elgoog-founders';

const ML = 'shared/pixel/rooms/elgoog-lobby.ts';
const lobby = (f: number, st: Parameters<typeof drawElgoogLobby>[2]) => { const b = new Buf(480, 270, PAL.N0); drawElgoogLobby(b, f, st); return b; };
// ------------------------------------------------------------------ UI-ALERT
const MA = 'shared/pixel/kits/phone-alert.ts';
D({id: 'UI-ALERT', state: 'desk-lit', module: MA + ' drawAlertInsert', note: '8.01 [ECU] his phone on the desk: the red alert, siren glyph, ELGOOG · CODE RED (draft 6)',
  draw: (fb) => drawAlertInsert(fb, 0, {k: 12})});
D({id: 'UI-ALERT', state: 'thumb-tap', module: MA + ' drawAlertInsert', note: '8.01 [ECU] his thumb opens it (the press)',
  draw: (fb) => drawAlertInsert(fb, 6, {k: 30, thumb: 'tap'})});
D({id: 'UI-ALERT', state: 'zoom-2', module: MA + ' drawAlertInsert + ' + ML, note: '8.01 the app zooms, the camera doesn\'t: held step 2 of 3, the lobby seen 1:1 through the growing screen',
  draw: (fb) => drawAlertInsert(fb, 0, {k: 40, zoom: 2, pov: lobby(0, {slab: 0, chrome: true})})});
D({id: 'UI-ALERT', state: 'ots-siren', module: MA + ' drawPhoneLockOTS', note: '8.06 [OTS] over his shoulder: the siren turning on the phone in his hand',
  draw: (fb) => drawPhoneLockOTS(fb, 3, {})});
D({id: 'UI-ALERT', state: 'ots-locked', module: MA + ' drawPhoneLockOTS', note: '8.06 [OTS] he locks it; the red goes out of the frame',
  draw: (fb) => drawPhoneLockOTS(fb, 3, {locked: true})});

// ------------------------------------------------------------------ ROOM-ELGOOG
D({id: 'ROOM-ELGOOG', state: 'arrival-slab', module: ML + ' drawElgoogLobby', note: '8.02 [POV] full-bleed on his phone (the status bar): the atrium in skewed primaries; the slab sliding (1 of 3)',
  draw: (fb) => drawElgoogLobby(fb, 0, {slab: 1, chrome: true, radnus: {arm: 'fold', fire: null}})});
D({id: 'ROOM-ELGOOG', state: 'lift-rising', module: ML + ' drawElgoogLobby', note: '8.02 the siren rising on its scissor lift (held drawing 2 of 3), the hole open',
  draw: (fb) => drawElgoogLobby(fb, 0, {slab: 3, lift: 2, chrome: true, radnus: {arm: 'fold', fire: null}})});
D({id: 'ROOM-ELGOOG', state: 'siren-turning', module: ML + ' drawElgoogLobby + cast/radnus.ts', note: '8.03 up and turning (1 rev/s, 8 held beams): Radnus beside the hole, extinguisher, sleeve alight',
  draw: (fb) => drawElgoogLobby(fb, 6, {slab: 3, lift: 3, turning: true, chrome: true, radnus: {arm: 'ext'}})});
D({id: 'ROOM-ELGOOG', state: 'founders-climb', module: ML + ' + cast/elgoog-founders.ts', note: '8.04 the founders climbing out of the crypt, backlit, shading their eyes (NIRB step 2, EGAP step 1)',
  draw: (fb) => drawElgoogLobby(fb, 12, {slab: 3, lift: 3, turning: true, chrome: true, radnus: {arm: 'pat', fire: 3}, nirb: {step: 2, arm: 'shade'}, egap: {step: 1, arm: 'shade'}})});
D({id: 'ROOM-ELGOOG', state: 'founders-top', module: ML + ' + cast/elgoog-founders.ts', note: '8.04 held: at the top; Radnus holds up his phone (the bubble); EGAP\'s mug RETIRED 2019',
  draw: (fb) => drawElgoogLobby(fb, 18, {slab: 3, lift: 3, turning: true, chrome: true, radnus: {arm: 'phone'}, nirb: {step: 3, arm: 'shade', legs: 'step'}, egap: {step: 3, arm: 'mug'}})});
D({id: 'ROOM-ELGOOG', state: 'lanyards', module: ML + ' + cast/radnus.ts + cast/elgoog-founders.ts', note: '8.05 he hands them two lanyards: GUEST; the siren turns, his sleeve relights',
  draw: (fb) => drawElgoogLobby(fb, 0, {slab: 3, lift: 3, turning: true, chrome: true, radnus: {arm: 'lanyards', fire: 1}, nirb: {step: 4, arm: 'reach', lanyard: false}, egap: {step: 4, arm: 'down', lanyard: true}})});

// ------------------------------------------------------------------ CAST-RADNUS + CAST-FOUNDERS
D({id: 'CAST-RADNUS', state: 'poses', module: 'shared/pixel/cast/radnus.ts drawRadnus', note: 'fold, ext, pat (flame out), phone, lanyards, tap0, tap1; the flame loop 0-2 (right)',
  draw: (fb) => {
    rect(0, 0, 480, 203, fb.ink(PAL.G4)); rect(0, 150, 480, 53, fb.ink(PAL.G3));
    (['fold', 'ext', 'pat', 'phone', 'lanyards', 'tap0', 'tap1'] as const).forEach((a, i) => { drawRadnus(fb, 30 + i * 52, 150, {...RADNUS_DEFAULT, arm: a, fire: a === 'pat' ? 3 : 0}); text(fb, a, 14 + i * 52, 160, PAL.N1); });
    ([0, 1, 2] as const).forEach((k, i) => drawRadnus(fb, 400 + i * 30, 110, {...RADNUS_DEFAULT, arm: 'ext', fire: k}));
  }});
D({id: 'CAST-FOUNDERS', state: 'poses', module: 'shared/pixel/cast/elgoog-founders.ts drawFounder', note: 'NIRB (prism) and EGAP (the mug): shade, step, reach, lanyard; silhouette (lit 0) and half-lit (lit 1)',
  draw: (fb) => {
    rect(0, 0, 480, 203, fb.ink(PAL.G5)); rect(0, 150, 480, 53, fb.ink(PAL.G4));
    drawFounder(fb, 'nirb', 40, 150, {...FOUNDER_DEFAULT}); drawFounder(fb, 'nirb', 90, 150, {...FOUNDER_DEFAULT, legs: 'step'}); drawFounder(fb, 'nirb', 140, 150, {...FOUNDER_DEFAULT, arm: 'reach', lit: 1}); drawFounder(fb, 'nirb', 190, 150, {...FOUNDER_DEFAULT, arm: 'down', lanyard: true, lit: 1});
    drawFounder(fb, 'egap', 260, 150, {...FOUNDER_DEFAULT}); drawFounder(fb, 'egap', 320, 150, {...FOUNDER_DEFAULT, arm: 'mug'}); drawFounder(fb, 'egap', 380, 150, {...FOUNDER_DEFAULT, arm: 'mug', lit: 1}); drawFounder(fb, 'egap', 430, 150, {...FOUNDER_DEFAULT, arm: 'down', lanyard: true, lit: 1});
  }});
