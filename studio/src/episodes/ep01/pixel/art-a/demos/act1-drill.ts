// MR. MAS — Ep1 full-v3, v3-art-a: Act One sc 6–7 (the odometer drill) stills.
import {D} from '../registry';
import {drawLaunchWide, drawLaunchMcuPF} from '../../../../../shared/pixel/rooms/bullpen-launch';
import {drawHoleHigh, drawWedgedWheel, drawGpuTear} from '../../../../../shared/pixel/rooms/drill';
import {drawChatECU} from '../../../../../shared/pixel/kits/chat-window';
import {drawOdometer} from '../../../../../shared/pixel/kits/odometer';
import {rect} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {text} from '../../../../../shared/pixel/font';

const M = 'shared/pixel/rooms/drill.ts';
D({id: 'SET-DRILL', state: 'ecu-grow-1', module: 'shared/pixel/kits/chat-window.ts drawChatECU st.grow', note: '6.01 [ECU] the counter leaves the plate (its socket dark) and grows, spinning (held drawing 1 of 3)',
  draw: (fb) => drawChatECU(fb, 2, {grow: 1, bubble: 'talk'})});
D({id: 'SET-DRILL', state: 'ecu-grow-3', module: 'shared/pixel/kits/chat-window.ts drawChatECU st.grow + kits/odometer.ts', note: '6.01 [ECU] grown to the desk-sized machine over the window, spinning; the cut to the wide follows',
  draw: (fb) => drawChatECU(fb, 6, {grow: 3, bubble: 'lit'})});
D({id: 'SET-DRILL', state: 'w-on-desk', module: 'shared/pixel/rooms/bullpen-launch.ts drawLaunchWide st.odo', note: '6.02 [W] the desk-sized odometer on his desk, spinning, the room around it',
  draw: (fb) => drawLaunchWide(fb, 4, {underlines: 3, alyi: 'gone', laptop: 'chat', rima: {body: 'stand', head: 'face', at: [196, 166], flip: true}, odo: {stage: 'desk'}})});
D({id: 'SET-DRILL', state: 'w-drop', module: 'shared/pixel/rooms/bullpen-launch.ts drawLaunchWide st.odo + cast/gerg-poses.ts', note: '6.02 [W] the clunk: it drops through the desk (held drawing 1 of 2), the top broken; Gerg jumps up, arms up',
  draw: (fb) => drawLaunchWide(fb, 8, {underlines: 3, alyi: 'gone', laptop: 'chat', rima: {body: 'stand', head: 'face', at: [196, 166], flip: true}, odo: {stage: 'drop1'}, gerg: {armsUp: true}})});
D({id: 'SET-DRILL', state: 'w-gone', module: 'shared/pixel/rooms/bullpen-launch.ts drawLaunchWide st.odo', note: '6.02 after: the hole in his desk\'s top',
  draw: (fb) => drawLaunchWide(fb, 12, {underlines: 3, alyi: 'gone', laptop: 'chat', rima: {body: 'peer', head: 'down', at: [196, 166], flip: true}, odo: {stage: 'gone'}})});
D({id: 'SET-DRILL', state: 'ecu-1000000', module: M + ' drawWedgedWheel', note: '6.06 [ECU] wedged in the bedrock, its last wheel settled and legible: 1,000,000 (RAIL DEC 5)',
  draw: (fb) => drawWedgedWheel(fb, 0, {settle: 3})});
D({id: 'SET-DRILL', state: 'ecu-settling', module: M + ' drawWedgedWheel', note: '6.06 [ECU] the last wheel rolling up to 1 (held step 1 of 3)',
  draw: (fb) => drawWedgedWheel(fb, 0, {settle: 1})});
D({id: 'SET-DRILL', state: 'high-rima-peers', module: M + ' drawHoleHigh', note: '6.08 [HIGH] the hole in the floor from above, Rima peering down; "Low-key." / "Very low. Basement."',
  draw: (fb) => drawHoleHigh(fb, 0, {tile: 'gone', rima: true, glow: 1, racks: 0})});
D({id: 'SET-DRILL', state: 'high-toast', module: M + ' drawHoleHigh', note: '6.09 [HIGH] held: the tile pops up like a toast (step 2), red glow, the $ odometer, racks amber',
  draw: (fb) => drawHoleHigh(fb, 6, {tile: 2, glow: 2, racks: 1, dollar: true})});
D({id: 'SET-DRILL', state: 'high-red-hot', module: M + ' drawHoleHigh', note: '6.09 [HIGH] held, the third palette step: red-hot racks, heat shimmer',
  draw: (fb) => drawHoleHigh(fb, 9, {tile: 'gone', glow: 3, racks: 2, dollar: true})});
D({id: 'SET-DRILL', state: 'high-tear-falls', module: M + ' drawHoleHigh', note: '7.02 [HIGH] the tear falling through the open tile (t 0.5); his phone lights red at the edge',
  draw: (fb) => drawHoleHigh(fb, 0, {tile: 'gone', glow: 3, racks: 2, dollar: true, tear: 0.5, phone: 'red'})});
D({id: 'SET-DRILL', state: 'gpu-steam', module: M + ' drawGpuTear', note: '7.02 [ECU] the tear on a red-hot GPU: tssss, steam in three held puffs (all three)',
  draw: (fb) => drawGpuTear(fb, 0, {k: 16})});
D({id: 'SET-DRILL', state: 'gpu-splash', module: M + ' drawGpuTear', note: '7.02 [ECU] the landing (k 1): the splash',
  draw: (fb) => drawGpuTear(fb, 0, {k: 1})});
D({id: 'CAST-MAS-TEAR', state: 'mcu-pf', module: 'shared/pixel/rooms/bullpen-launch.ts drawLaunchMcuPF', note: '7.01 [MCU·PF] looking down the hole, the red from below, the bullpen stepping down; the tear mid-cheek',
  draw: (fb) => drawLaunchMcuPF(fb, 0, {tear: 24})});
D({id: 'PROP-ODOMETER', state: 'sizes', module: 'shared/pixel/kits/odometer.ts drawOdometer', note: 'plate · ecu · wide · desk (spinning) · small $ (hot); heat steps on the right',
  draw: (fb) => {
    rect(0, 0, 480, 203, fb.ink(PAL.N2));
    drawOdometer(fb, 10, 10, {size: 'plate', value: 7, digits: 5});
    drawOdometer(fb, 70, 6, {size: 'ecu', value: 104, digits: 5});
    drawOdometer(fb, 170, 6, {size: 'wide', value: 486002, digits: 7});
    drawOdometer(fb, 10, 60, {size: 'desk', value: 0, digits: 7, spin: 1, f: 2});
    drawOdometer(fb, 190, 60, {size: 'small', value: 0, digits: 5, spin: 1, heat: 3, f: 3, label: '$'});
    [0, 1, 2, 3].forEach((h) => { drawOdometer(fb, 290 + h * 46, 140, {size: 'plate', value: 1000, digits: 4, heat: h}); text(fb, `heat ${h}`, 290 + h * 46, 160, PAL.N6); });
    drawOdometer(fb, 10, 136, {size: 'desk', value: 1000000, digits: 7, heat: 3});
  }});

// ------------------------------------------------------------------ INSERT-GERG-PHONE (6.04)
import {drawGergPhoneInsert} from '../../../../../shared/pixel/kits/gerg-phone-insert';
const MG = 'shared/pixel/kits/gerg-phone-insert.ts + kits/post-any.ts';
D({id: 'INSERT-GERG-PHONE', state: 'buzz', module: MG, note: '6.04 [ECU] cut up to Gerg\'s desk (the drill\'s one angle on the bullpen): his phone buzzes',
  draw: (fb) => drawGergPhoneInsert(fb, 2, {k: 2})});
D({id: 'INSERT-GERG-PHONE', state: 'hearted', module: MG, note: '6.04 NOLE\'s post in its own UI (the record\'s words), Gerg\'s thumb hearts it (RAIL DEC 3; plate NOLE after the read)',
  draw: (fb) => drawGergPhoneInsert(fb, 0, {k: 30, heart: 1})});
D({id: 'INSERT-GERG-PHONE', state: 'unhearted', module: MG, note: '6.04 Rima\'s hand reaches in and un-hearts it for him',
  draw: (fb) => drawGergPhoneInsert(fb, 0, {k: 50, heart: 2})});
