#!/usr/bin/env python3
"""framing-v3 plan for Ep1 Act Four (cinematography / framing designer, 2026-09-25). Writes show/episodes/ep01/production/act4/framing-v3.json:
    python3 studio/src/dev/framing-v3/plan_v3.py show/episodes/ep01/production/act4/framing-v3.json
One row per v3 shot, validated against the v3 framing grammar.
Frames are CARRIED from lock v2 (split where a v2 shot is split) so the shares are comparable; THE EDITOR's v3 lock
re-times everything (the dead-air pass), so treat seconds as v2-clock projections, never as the v3 clock."""
import os  # noqa: E402  (phase 1: the project root is found at run time, docs/ORGANIZATION-PLAN.md §4)
import sys  # noqa: E402


def _repo():
    for start in (os.path.dirname(os.path.abspath(__file__)), os.getcwd()):
        d = start
        while True:
            if os.path.exists(os.path.join(d, '.mrmas-root')):
                return d
            if d == os.path.dirname(d):
                break
            d = os.path.dirname(d)
    sys.exit('MR. MAS: no .mrmas-root above this script or the cwd; set MRMAS_ROOT')


REPO = os.environ.get('MRMAS_ROOT') or _repo()
import json, itertools, sys

# size classes for the "no more than 2 consecutive shots of the same size" rule
# W wide (incl. LOW/HIGH room plates and OTS-W) · M medium (M, 2S) · OTS · MCU (frameless bust, frame-in-frame, desk-low)
# CU · ECU (hands, eyes, the Orb's iris, prop inserts, table overheads) · SW screen wide (a grid, a full list)
# SC screen close (a pinned / single / half tile, a phone, a counter, a floor POV) · GS/GM/GD blueprint sheet/section/detail
# GFX full-screen card · BOX the deliberate portrait window
P = []
def s(i, v2, tag, cls, tpl, fr, what, face=False, box='none', move='', build='', rule=''):
    P.append(dict(id=i, v2=v2, tag=tag, cls=cls, tpl=tpl, frames=fr, what=what, face=face, box=box, move=move, build=build, rule=rule))

# ---------------------------------------------------------------- 24
s('24.01', ['24.01'], '[W]', 'W', 'W', 60, 'The suite: the crane truck passes, every glass shivers but his.', build='exists')
s('24.02', ['24.02'], '[ECU]', 'ECU', 'ECU-HANDS', 30, 'His two fingers nudge the glass one pixel true.', face=True, build='exists')
s('24.03', ['24.03'], '[MCU·PF]', 'MCU', 'MCU-F', 30, 'MAS frameless, left third; the suite steps down behind him to the laptop glow; the flash-print to blueprint rides the last beat.', face=True, build='helper', rule='was [PF] box')
# ---------------------------------------------------------------- 25 THE PLAN (the show's voice: sizes of the sheet, never a face)
s('25.01', ['25.01'], '[GFX·sheet]', 'GS', 'BP-SIZES', 180, 'THE WORD: the grid draws itself; HOW TO FIRE A CEO WHO OWNS NOTHING. stamps.', build='exists')
s('25.02', ['25.02'], '[GFX·section]', 'GM', 'BP-SIZES', 240, 'THE DIAGRAM: nine chairs; DIRE, NOVIHS, DRUH walk off; LEFT EARLIER IN 2023; THESE FOUR VOTE.', build='exists')
s('25.03', ['25.03'], '[GFX·sheet]', 'GS', 'BP-SIZES', 120, 'The structure, plan view: a whole-pixel PAN down one oversize sheet, NONPROFIT → CONTROLS → COMPANY, the key ring outside the fence.', move='pan', build='kit param (sheet taller than the frame)', rule='split')
s('25.03b', ['25.03'], '[GFX·detail]', 'GD', 'BP-SIZES', 60, 'Cut-in: the CEO box, EQUITY: 0 (HIS TESTIMONY); the blueprint moth opens its wings (linework redrawn 2x, 1 px lines).', build='kit param (2x coordinates)', rule='split')
s('25.04', ['25.04'], '[GFX·section]', 'GM', 'BP-SIZES', 180, 'THE PLAN: four walkers tick 1 · 2 · 3 in stride and stop at 4.', build='exists')
s('25.05', ['25.05'], '[GFX·detail]', 'GD', 'BP-SIZES', 120, 'The walkers at 2x: NELEH "Step four." / MADA "Good question." (a GFX pair: one Q+A in one frame).', build='exists')
s('25.06', ['25.06'], '[GFX·detail]', 'GD', 'BP-SIZES', 60, 'The blank line: the chalk squeaks and snaps.', build='exists')
s('25.07', ['25.07'], '[GFX·sheet]', 'GS', 'BP-SIZES', 60, 'The corner curls, neon bleeds through; the sheet tears on the line of step 4.', build='exists')
s('25.08', ['25.08'], '[ECU]', 'ECU', 'ECU-HANDS', 60, 'His hand on the trackpad; JOIN; click.', face=True, build='exists')
# ---------------------------------------------------------------- 26 THE FALLING TILE
s('26.01', ['26.01'], '[POV·grid]', 'SW', 'SCREEN', 60, 'His laptop: the five-tile grid connects; four vote icons already flipped (Wi-Fi 1 bar egg).', build='exists')
s('26.02', ['26.02'], 'CARD on [POV·grid]', 'SW', 'CARD-RIDE', 60, 'NELEH name card rides the live grid.', build='exists')
s('26.02a', ['26.02a'], '[MCU·PF]', 'MCU', 'MCU-F', 60, 'MAS frameless; the suite down to the Strip neon + laptop glow; he reads the icons, one pupil step per tile; HOLD 1 beat.', face=True, build='helper', rule='was [PF] box')
s('26.03', ['26.03'], '[POV·pin]', 'SC', 'SCREEN', 60, "The app's active-speaker view (automatic, never his click) pins ALYI: his mouth moves, no sound reaches Mas; the box over his tile types … and stops.", box='typed', build='kit param (pinned tile)', rule='in-world push')
s('26.04', ['26.04'], '[POV·grid]', 'SW', 'SCREEN', 60, 'The 1993-style dialog pops up over his tile: OK · Cancel (Cancel live).', build='exists')
s('26.04a', ['26.04a'], '[ECU]', 'ECU', 'ECU-EYES', 60, 'The eyes strip: his pupils move one pixel toward the dialog.', face=True, build='exists')
s('26.04b', ['26.04b'], '[POV·grid]', 'SW', 'SCREEN', 60, 'The unlit arrow steps in from the board tiles, one tile a beat.', build='exists')
s('26.04c', ['26.04c'], '[MCU·PF]', 'MCU', 'MCU-F', 60, 'MAS, still: the laptop glow only; nothing on him moves while the arrow (O.S.) settles on Cancel.', face=True, build='helper', rule='breaks a 3-screen run')
s('26.05', ['26.05'], '[POV·close]', 'SC', 'SCREEN', 15, 'Close on the dialog: the arrow clicks Cancel on the downbeat. D6 DROP-OUT starts here.', build='NEW: dialog + arrow drawn at 2x UI scale', rule='split')
s('26.05b', ['26.05'], '[POV·grid]', 'SW', 'SCREEN', 45, 'His tile drops out of the grid, four drawings, GLYPH dissolve; the four slide together.', build='exists', rule='split')
s('26.05a', ['26.05a'], '[CU]', 'CU', 'CU', 90, 'MAS full frame, silent (the Strip neon); HOLD 2 beats; +1 FIRING on beat 3.', face=True, build='exists')
s('26.06', ['26.06'], '[ECU]', 'ECU', 'ECU-HANDS', 150, 'The phone buzzes, the room sound returns; [super]×3 lights; the mic chip still lit; his thumb taps the middle one at once.', face=True, build='exists')
s('26.07', ['26.07'], '[MCU]', 'MCU', 'MCU-F', 60, 'MAS frameless (neon): "super." into the still-open mic. No music.', face=True, rule='was [P] box')
s('26.08', ['26.08'], '[POV·grid]', 'SW', 'SCREEN', 60, "The grid as his screen shows it: four held faces (a listener's hold); the control bar's mic still lit.", build='exists')
s('26.09', ['26.09'], '[W]', 'W', 'W', 60, 'The suite: the truck passes, every glass shivers; his does not.', build='exists')
s('26.10', ['26.10'], '[GFX]', 'GFX', 'GFX', 120, 'The candor quote card.', build='exists')
s('26.11', ['26.11'], '[POV·grid]', 'SW', 'SCREEN', 30, 'His greyed tile, still falling, becomes the render front.', build='exists')
s('26.12', ['26.12'], '[W]', 'W', 'W', 120, 'F1.2 TPOOL door, EARLY-WEB16, (REPORTED).', build='exists')
s('26.13', ['26.13'], '[ECU]', 'ECU', 'ECU-PROP', 30, 'The frosted glass; the dither settles into wood grain.', build='exists')
# ---------------------------------------------------------------- 26A
s('26A.01', ['26A.01'], '[ECU]', 'ECU', 'ECU-HANDS', 135, 'He carves mark 3, brushes the shavings, thumb on mark 3 only. V.O. "i don\'t keep score." (bar 2).', face=True, build='exists')
s('26A.02', ['26A.02'], '[2S]', 'M', '2S', 45, "Mas + the Orb: its iris counts 1, 2, 3 and stops on his thumb.", face=True, build='exists')
s('26A.03', ['26A.03'], '[POV]', 'SC', 'SCREEN', 120, 'His phone, full-bleed: the post types in source casing, 9:32 PM PT.', build='exists')
s('26A.04', ['26A.04'], '[ECU]', 'ECU', 'ECU-PROP', 60, 'The Senate wallet, HEALTH INSURANCE; a moth flies out.', build='exists')
s('26A.05', ['26A.05'], '[MCU·PF]', 'MCU', 'MCU-F', 90, 'MAS frameless; the room down to the cyan key + rack LEDs; V.O. "the meeting ended early." on the hoodie shadow.', face=True, move='drift', build='helper', rule='was [PF] box')
s('26A.06', ['26A.06'], '[ECU·Orb]', 'ECU', 'ECU-ORB', 30, 'The Orb\'s iris, full frame, lifts from the desk to his face; toast rewinding…; WHIP (right→left) into pass one.', face=True, move='whip-out', build='procedural', rule='was [P] box (no Orb portrait exists)')
# ---------------------------------------------------------------- 27 PASS ONE (the exit)
s('27.01', ['27.01'], '[SCR·grid]', 'SW', 'SCREEN', 45, "The board's grid on a laptop, bezel: the call goes on; his \"super.\" out of the small speaker (no portrait).", box='speaker', build='exists')
s('27.01a', ['27.01a'], '[MCU]', 'MCU', 'MCU-F', 45, "NELEH at her own desk (her tile's world, full frame): she turns a page and doesn't look up. The catch lands on a face.", face=True, build='helper + nelehTileBg at 480x203', rule='split; nobody looked up')
s('27.01b', ['27.01a'], '[SCR·grid]', 'SW', 'SCREEN', 75, 'Toast GERG MOCKBRAN has left.; his post "…I quit." green-lit.', build='exists', rule='split')
s('27.02', ['27.02'], '[SCR·close]', 'SC', 'SCREEN', 60, 'Closer on the laptop: BUKAJ has left.; keycaps rain across the tiles.', build='kit param (bigger tiles, bezel edge)')
s('27.03', ['27.03', '27.04'], '[MCU] + CARD', 'MCU', 'MCU-F', 90, 'RIMA in her hard spotlight, smoothing her jacket; RIMA TAMURI name card rides.', face=True, build='helper + spotlight pool', rule='was [P] box')
s('27.05', ['27.05'], '[SCR·2-up]', 'SC', 'SCREEN', 60, 'The call\'s two-up (bezel): RIMA "I\'ll hold it together." in her tile, NELEH listening in hers.', face=True, build='kit param (2-up layout)', rule='was [P] box')
s('27.05a', ['27.05a'], '[MCU]', 'MCU', 'MCU-F', 45, 'NELEH (her desk): "For how long?"', face=True, rule='was [P] box')
s('27.05b', ['27.05b'], '[MCU]', 'MCU', 'MCU-F', 60, 'RIMA (pleasant): "We\'ll share more soon."', face=True, rule='was [P] box')
s('27.05c', ['27.05c'], '[SCR·2-up]', 'SC', 'SCREEN', 15, 'The two-up: NELEH, one brow up.', face=True, rule='was [P] box')
s('27.06', ['27.06'], '[W]', 'W', 'W', 60, 'The bullpen all-hands: one hand up in the tiled crowd; "Is this a coup?" (box with a tail).', box='typed', build='exists')
s('27.07', ['27.07'], '[MCU·door]', 'MCU', 'MCU-FRAME', 105, 'ALYI frameless in the doorway, the jamb and leaf cutting him: "You can call it this way" [V]. No move.', face=True, build='helper + full-height jamb/leaf', rule='was [P] box')
s('27.07a', ['27.07a'], '[W]', 'W', 'W', 15, 'The crowd: the one hand is still up (the listener).', build='exists')
s('27.08', ['27.08'], '[MCU·door]', 'MCU', 'MCU-FRAME', 60, 'ALYI steps back into the dark of the doorway, one whole-pixel step a time, until the frame has all of him; the empty doorway holds 1 beat.', face=True, rule='was "steps out of his own window"')
s('27.09', ['27.09'], '[SCR·grid]', 'SW', 'SCREEN', 90, 'NOV 18: a heart, ten, hundreds pour over the grid.', build='exists', rule='split')
s('27.09b', ['27.09'], '[SCR·macro 2x]', 'SC', 'SCREEN-MACRO', 30, "Screen macro (integer 2x of the screen's own pixels, the bezel corner kept in frame: the world's view): the one blue heart lands on Mada's spinner and spins with it.", build='helper', rule='split; macro 1 of 2')
s('27.10', ['27.10'], '[SCR·grid]', 'SW', 'SCREEN', 135, 'His post "…eulogy" scrolls across the hearts.', build='exists')
s('27.11', ['27.11'], '[2S]', 'M', '2S', 60, 'Boardroom, night: NELEH (marker) + MADA (spinner), ALYI a reflection in the window between them; every phone buzzes.', face=True, build='exists')
s('27.12', ['27.12'], '[MCU]', 'MCU', 'MCU-F', 75, 'NELEH frameless, left third, facing right (flipped): "The bylaws allow it. Footnote three."', face=True, rule='was [P] box')
s('27.12a', ['27.12a'], '[OTS]', 'OTS', 'OTS', 105, 'Over NELEH\'s shoulder onto the window: ALYI\'s reflection "Step four… will reveal itself."', face=True, move='drift', build='helper', rule='was [P] box')
s('27.12b', ['27.12b'], '[2S]', 'M', '2S', 30, 'NELEH: "When?" (Mada unmoved, the reflection between them).', face=True, rule='was [P] box')
s('27.12c', ['27.12c'], '[MCU·glass]', 'MCU', 'MCU-FRAME', 90, 'ALYI\'s reflection close in the dark glass, the Valley\'s lights through him: "The company will tell us."', face=True, build='helper (reflection stepped -1)', rule='was [P] box')
s('27.12d', ['27.12d'], '[MCU]', 'MCU', 'MCU-F', 15, 'NELEH listening, one brow up.', face=True, rule='was [P] box')
s('27.13', ['27.13'], '[HIGH]', 'ECU', 'HIGH-TABLE', 60, 'Overhead on the walnut: every phone buzzes harder and walks toward the edge, one held step a beat.', build='NEW: drawTableInsert "phones" focus')
s('27.14', ['27.14'], '[MCU]', 'MCU', 'MCU-F', 60, 'NELEH: "The company is calling us."', face=True, rule='was [P] box')
s('27.14a', ['27.14a', '27.14b'], '[2S]', 'M', '2S', 120, 'ALYI\'s reflection between them: "That is the company telling us." It flickers for two frames and steadies; the black tile never moves.', face=True, rule='was [P] box + 2S merged (-30 f: the flicker rides the line\'s tail)')
s('27.15', ['27.15'], '[MCU·PF]', 'MCU', 'MCU-F', 45, 'NELEH looks down at the blank line; the boardroom steps down behind her. HOLD 1 beat. Her real face.', face=True, rule='was [PF] box')
s('27.16', ['27.16'], '[HIGH]', 'ECU', 'HIGH-TABLE', 60, 'Her hand uncaps the marker and writes ? on the blank line.', face=True, build='exists')
s('27.17', ['27.17'], '[W]', 'W', 'W', 60, 'The whole table: the speakerphone dials four tones. CUT on the first ring.', build='exists')
s('27.18', ['27.18'], '[ECU]', 'ECU', 'ECU-PROP', 45, 'Lighthouse: the phone with the little throne rings. Rail (REPORTED).', build='exists')
s('27.19', ['27.19'], '[MCU]', 'MCU', 'MCU-F', 90, 'MARIO, the lamp turning in the window behind: "I\'ve written up some thoughts."', face=True, rule='was [P] box')
s('27.20', ['27.20', '27.21'], '[W] + CARD', 'W', 'W', 90, 'The lighthouse: ADELINA crosses and takes the phone out of his hand; her name card rides.', build='exists (room sprites)', rule='was [P2] box')
s('27.22', ['27.22'], '[MCU]', 'MCU', 'MCU-F', 60, 'ADELINA, into the phone: "In plain English: no."', face=True, rule='was [P2] box')
s('27.23', ['27.23'], '[ECU]', 'ECU', 'ECU-PROP', 30, 'Click. The throne falls off the handset.', build='exists')
s('27.24', ['27.24'], '[MCU]', 'MCU', 'MCU-F', 120, 'MARIO answers the second phone; the rent meters spin SHARP in the window behind (record text never goes soft): "Hi. Yes. We\'re very worried. How much?"', face=True, rule='was [P] box')
s('27.26', ['27.26'], '[SCR·cam]', 'SC', 'SCREEN', 120, 'The lobby security-camera tile, bezel, grainy: a figure in a GUEST lanyard; his post upside-down in the corner.', build='exists')
s('27.27', ['27.27'], '[W]', 'W', 'W', 60, 'Boardroom, Nov 19: the spotlight swings off Rima\'s empty chair onto TTEMME.', build='exists')
s('27.28', ['27.28'], 'CARD on [W]', 'W', 'CARD-RIDE', 60, 'TTEMME name card rides the wide.', build='exists')
s('27.29', ['27.29'], '[MCU]', 'MCU', 'MCU-F', 60, 'TTEMME (headset, hourglass; his stream chat scrolling up the frame edge): "Chat. I\'m the CEO now."', face=True, rule='was [P] box')
s('27.30', ['27.30'], '[HIGH]', 'ECU', 'HIGH-TABLE', 45, 'He sets the hourglass down and flips it: three drawings.', face=True, build='exists')
s('27.31', ['27.31'], '[LOW·desk]', 'MCU', 'DESK-LOW', 60, 'Desk level: the hourglass big in the foreground, sand falling; TTEMME above it watching: "Chat… for how long?"', face=True, move='rack', build='NEW: the hourglass at insert scale (the lg one reads too small in the foreground: sheet panel 9)', rule='was [P] box')
s('27.32', ['27.32'], '[2S]', 'M', '2S', 75, 'NELEH + MADA: the wall steps to slate; a door appears and opens. Hard cut to the door (no whip: her real line starts 6 f into 27.33).', face=True, build='exists')
s('27.33', ['27.33'], '[MCU·door]', 'MCU', 'MCU-FRAME', 90, 'TASYA in the new doorway, slate light, the sign pointing out: "a new advanced AI research team" [V]. No move.', face=True, rule='was [P] box')
s('27.35', ['27.35'], '[2S]', 'M', '2S', 30, 'NELEH + MADA look down at the blueprint (the listeners).', face=True, build='exists')
s('27.36', ['27.36'], '[HIGH]', 'ECU', 'HIGH-TABLE', 35, 'Overhead: step 4 blank but for her ?. NELEH (O.S.): "Step four?"', box='os', build='exists', rule='split')
s('27.36b', ['27.36'], '[MCU]', 'MCU', 'MCU-F', 40, 'MADA, the spinner turning: "Good question." Pass one ends on his face.', face=True, rule='split')
# ---------------------------------------------------------------- 28
s('28.01', ['28.01'], '[GFX]', 'GFX', 'GFX', 75, 'WHAT THEY DIDN\'T KNOW.', build='exists')
# ---------------------------------------------------------------- 29 PASS TWO
s('29.00', ['29.00'], '[ECU]', 'ECU', 'ECU-PROP', 30, 'The home shot: the glass from above, its water line flat. Rail · HIS SIDE.', face=True, build='exists')
s('29.01', ['29.01'], '[2S]', 'M', '2S', 105, 'Mas + the Orb, the lanyard square by the glass; his hand on the phone. V.O. "i put the phone down."', face=True, build='exists')
s('29.01a', ['29.01a'], "[ECU] MAS'S VERSION", 'ECU', 'ECU-HANDS', 60, 'The matching frame: face-down, too still, keynote piano.', face=True, build='exists')
s('29.03', ['29.03'], '[ECU]', 'ECU', 'ECU-HANDS', 120, 'Hard cut: the same frame, face-up; Rima\'s post [V]; eight hearts on the beat.', face=True, build='exists')
s('29.04', ['29.04'], '[2S]', 'M', '2S', 60, 'The Orb\'s iris steps off the phone onto the GUEST lanyard (beat 3) and stays.', face=True, build='exists')
s('29.10', ['29.10'], '[ECU·Orb]', 'ECU', 'ECU-ORB', 75, 'The iris full frame, holding on the lanyard. V.O. "the badge was a joke." HOLD 1 beat.', face=True, build='procedural', rule='was [P] box')
s('29.10a', ['29.10a'], '[MCU]', 'MCU', 'MCU-F', 60, 'MAS aloud, to the Orb: "mostly." (look toward it); RACK to the Orb soft-then-sharp behind his shoulder; it doesn\'t move. Cut on the downbeat.', face=True, move='rack', rule='was [2S]')
s('29.05', ['29.05'], '[POV]', 'SC', 'SCREEN', 75, 'The counter rolls 505 · 650 · 700 · 745 / 770; clunk.', build='exists')
s('29.06', ['29.06'], '[GFX]', 'GFX', 'GFX', 180, 'The employee letter quote card.', build='exists')
s('29.07', ['29.07'], '[POV]', 'SW', 'SCREEN', 60, 'The signature list stops 2 beats on ALYI (REPORTED).', build='exists')
s('29.07a', ['29.07a'], '[ECU·Orb]', 'ECU', 'ECU-ORB', 60, 'The iris: to the name, to Alyi\'s thumbnail, back. Chime. (The Orb\'s beat; no Mas tell.)', face=True, build='procedural', rule='was [P] box')
s('29.08', ['29.08'], '[2S]', 'M', '2S', 90, 'DELIVERY: the rack slot ejects the check tray across the desk.', face=True, build='exists')
s('29.11', ['29.11'], '[POV·tile]', 'SC', 'SCREEN', 60, 'GERG\'s video tile opens on the monitor, big enough to act in: "One sec. Compiling."', face=True, box='none', build='exists')
s('29.11a', ['29.11a'], '[MCU]', 'MCU', 'MCU-F', 60, 'MAS, facing his monitor: "what are you building?"', face=True, rule='was [P] box')
s('29.11b', ['29.11b'], '[POV·tile]', 'SC', 'SCREEN', 60, 'GERG: "The company. Again. Just in case."', face=True, build='exists')
s('29.12q', ['29.12q'], '[MCU·PF]', 'MCU', 'MCU-F', 30, 'QUIET BEAT: MAS; the room falls away to the monitor\'s green + his cyan; he watches Gerg type.', face=True, rule='was [PF] box')
s('29.11c', ['29.11c'], '[POV·full]', 'SC', 'SCREEN', 15, 'Gerg\'s tile fills the frame; he glances up into his camera, at Mas.', face=True, build='exists')
s('29.12r', ['29.12r'], '[MCU·PF]', 'MCU', 'MCU-F', 15, 'MAS looks back (the look swaps from the tile to the lens).', face=True, rule='was [PF] box')
s('29.12', ['29.12'], '[2S]', 'M', '2S', 135, 'The whole back wall: V.O. "gerg never waits to be asked."; on "asked" the slate door steps up; TASYA (O.S.) "Everyone is welcome."', face=True, box='os', build='exists')
s('29.13', ['29.13'], '[MCU]', 'MCU', 'MCU-F', 60, 'MAS at once, not turning: "leave it open." The slate door soft behind him; after the line, RACK to the door.', face=True, move='rack', rule='was [P] box')
s('29.14', ['29.14'], '[POV·grid]', 'SW', 'SCREEN', 120, 'AVALANCHE phrase 1: the board\'s grid on the monitor; one tile appears, another; hundreds begin to fall.', build='exists', rule='split')
s('29.14b', ['29.14'], '[MCU·PF]', 'MCU', 'MCU-F', 60, 'MAS watching, blank; each landing steps the ROOM\'s light (never his face).', face=True, rule='split: a face inside the set-piece')
s('29.14c', ['29.14'], '[POV·grid]', 'SW', 'SCREEN', 60, 'The stack presses on the board\'s row.', build='exists', rule='split')
s('29.15', ['29.15'], '[POV·half]', 'SC', 'SCREEN', 120, 'Phrase 2: ALYI\'s tile shoved sideways; resisting one beat, it fills half the frame; it slides off.', face=True, build='kit param (half-frame tile)')
s('29.16', ['29.16'], '[POV·grid]', 'SW', 'SCREEN', 120, 'NELEH\'s tile follows, footnotes scattering: "Has anyone read the char—"', build='exists')
s('29.17', ['29.17'], '[POV·grid]', 'SW', 'SCREEN', 120, 'Phrase 3: the Quiet Vote\'s tile pushed out without a sound; the faces keep coming.', build='exists', rule='split')
s('29.17b', ['29.17'], '[ECU]', 'ECU', 'ECU-PROP', 60, 'The glass on the desk, from above, in the monitor\'s flicker: its water line flat while the screen shakes.', face=True, build='exists (29.00 plate)', rule='split: the glass that never ripples')
s('29.17a', ['29.17a'], '[MCU·PF]', 'MCU', 'MCU-F', 60, 'MAS, the room down until the 745 faces on the monitor are its only light, watching the one gap.', face=True, rule='was [PF] box')
s('29.18', ['29.18'], '[POV·half]', 'SC', 'SCREEN', 120, 'Phrase 4: MADA\'s tile wedged in the gap; every tile presses; he doesn\'t move; the half-frame hold (his real face).', face=True, build='kit param (half-frame tile)')
s('29.19', ['29.19'], 'CARD on [POV·half]', 'SC', 'CARD-RIDE', 60, 'MADA / LAST FIRER STANDING rides the tile wall.', build='exists')
s('29.20', ['29.20'], '[POV·grid]', 'SW', 'SCREEN', 60, 'Hold: 745 faces press; the spinner turns; the phrase ends.', build='exists')
# ---------------------------------------------------------------- 30 THE RETURN
s('30.01', ['30.01'], '[P2] DELIBERATE BOX 1/2', 'BOX', 'BOX', 240, 'MAS left in his window, ALYI right in the door-cut window; ALYI\'s post [V]; three hearts rise out of Mas\'s window and cross the gap; Alyi looks up; HOLD 2 beats; the IOU flutters. The act\'s one deliberate box: two men in two boxes.', face=True, build='exists (drawDoorwayP2)', rule='deliberate stylistic beat')
s('30.05', ['30.04', '30.05'], '[W]', 'W', 'W', 165, 'The bullpen: every desk boxed, coats on, TASYA mid-floor: "We are below them," the floor steps to slate from her feet.', box='typed', build='exists', rule='merged')
s('30.06', ['30.06'], '[LOW]', 'W', 'LOW-ROOM', 120, 'Low angle, the bullpen ceiling: "above them," (O.S.) the ceiling steps to slate in 3 held palette steps.', box='os', build='NEW: bullpen ceiling low-angle plate', rule='angle')
s('30.07', ['30.07'], '[MCU]', 'MCU', 'MCU-F', 120, 'TASYA delighted: "around them." The walls go slate behind her.', face=True, rule='was [P] box')
s('30.07b', ['30.07'], '[W]', 'W', 'W', 0, '(folded into 30.07\'s tail if the editor keeps 8 bars: the whole room Tasya-blue; the key ring jangles inside the wall.)', build='exists', rule='optional')
s('30.08', ['30.08'], '[MCU·PF]', 'MCU', 'MCU-F', 60, 'MAS at his desk looking down at the floor (the look-down swap): "hi."', face=True, build='exists (masLookDown)', rule='was [PF] box')
s('30.08b', ['30.08'], '[POV·floor]', 'SC', 'HIGH-FLOOR', 60, 'His eyeline: the slate floor from above, his shoe tips at the top edge. TASYA (O.S., from the floor): "Hello."', box='os', build='NEW: bullpen floor plate (top-down)', rule='split; the reverse is the floor')
s('30.09', ['30.09'], '[M]', 'M', 'M', 45, 'MADA in the only chair that isn\'t burning. The door bangs: WHIP to it.', face=True, move='whip-out', build='exists')
s('30.10', ['30.10'], '[W]', 'W', 'W', 45, 'The door bangs open: TERB, extinguisher like a briefcase, the helmet appears.', build='exists')
s('30.11', ['30.11'], 'CARD on [W] (freeze)', 'W', 'CARD-RIDE', 90, 'TERB card, full freeze; Mas walks past in colour and pulls the pin.', build='exists')
s('30.12', ['30.12'], '[ECU]', 'ECU', 'ECU-HANDS', 30, 'The pin in his fingers: DO NOT REMOVE. He pockets it.', face=True, build='exists')
s('30.13', ['30.13'], '[MCU]', 'MCU', 'MCU-F', 60, 'TERB, the fires soft behind: "Which room is on fire?"', face=True, rule='was [P] box; split')
s('30.13a', ['30.13'], '[W]', 'W', 'W', 60, 'The room looks around at the fires as if for the first time. TERB: "…Ah."', box='typed', build='exists', rule='split')
s('30.14', ['30.14'], '[2S]', 'M', '2S', 75, 'THE CALM-OFF: MAS left, MADA right across the table; the chaos behind them; TERB (O.S.) "Terms?"', face=True, box='os', build='exists')
s('30.15', ['30.15'], '[OTS]', 'OTS', 'OTS', 60, 'Over Mas\'s shoulder (silhouette, the fires\' rim) onto MADA: "Good question." HOLD 1 beat.', face=True, build='helper', rule='was [P] box')
s('30.16', ['30.16'], '[MCU]', 'MCU', 'MCU-F', 75, 'MAS, near-front, eyes toward Mada, fires soft behind: HOLD 1 beat; "good question." (one beat late).', face=True, rule='was [P] box')
s('30.17', ['30.17'], '[2S]', 'M', '2S', 120, 'HOLD 1 BAR: two still men; the spinner stops; the nod; Terb\'s hand stamps the term sheet, hands it to both.', face=True, build='exists')
s('30.20', ['30.20'], '[POV]', 'SC', 'SCREEN', 90, 'His phone lights green: GERG\'s post [V]; keycaps pop.', build='exists')
s('30.20a', ['30.20a'], '[MCU·PF]', 'MCU', 'MCU-F', 15, 'MAS reading it; his face doesn\'t change.', face=True, rule='was [PF] box')
s('30.21', ['30.21'], '[HIGH]', 'ECU', 'HIGH-TABLE', 135, 'The hourglass: the last grain; TTEMME\'s post [V]; only the glass shatters; the sand holds its shape one beat, falls.', build='exists')
s('30.22', ['30.22'], '[LOW]', 'W', 'LOW-ROOM', 60, 'The lobby from low: the wall sign lights up over us, DAYS SINCE SOMEONE TRIED TO FIRE MAS: 0; Mas small at the reception desk.', build='NEW: lobby low-angle plate', rule='angle')
s('30.23', ['30.23'], '[ECU]', 'ECU', 'ECU-PROP', 45, 'A maintenance hand sets a box of spare 0 plates under the sign.', face=True, build='exists')
s('30.24', ['30.24'], '[OTS-W]', 'OTS', 'OTS', 60, 'Over Mas\'s shoulder (tungsten rim) onto the lobby: the 1993 dialog, Cancel greys 3 steps, the arrow bonks.', face=True, build='helper (check the geography with the lobby builder; fallback: v2 [W])', rule='was [W]; stepped push into 30.25')
s('30.25', ['30.25'], '[CU]', 'CU', 'CU', 30, 'MAS full frame, silent, the lobby tungsten behind.', face=True, build='exists')
s('30.26', ['30.26'], '[ECU]', 'ECU', 'ECU-HANDS', 45, 'His hand sets the glass down, nudges it one pixel true. "okay." over the hands.', face=True, box='os', build='exists')
# ---------------------------------------------------------------- 31
s('31.01', ['31.01'], '[ECU]', 'ECU', 'ECU-PROP', 90, 'The Q* vault, the sticky note, the hum on F. Rail (REPORTED).', build='exists')
s('31.02', ['31.02'], '[W]', 'W', 'W', 60, 'The back wall: Mas walks past the vault without looking, the Orb looks; Gerg passes the other way, typing, and stops.', build='exists')
s('31.03', ['31.03'], '[MCU-2]', 'MCU', 'MCU-2', 90, 'A frameless 50/50: MAS left, turned to camera-left (away from the vault and from Gerg: not looking), GERG right, laptop green under his chin, the vault soft between them. GERG: "What\'s in there?" / MAS: "it\'s a preview." The vault hums on the line: RACK to the vault, both men go soft.', face=True, move='rack', build='helper (two frameless busts)', rule='was [P2] box; keeps the shared frame (§3.8); one Q+A pair in one frame (rule 2)')
s('31.05', ['31.03'], '[ECU]', 'ECU', 'ECU-PROP', 15, 'The sticky note: DO NOT OPEN. DO NOT EXPLAIN. (his read)', build='exists (vault insert)', rule='was [P2] box')
s('31.05b', ['31.03'], '[MCU]', 'MCU', 'MCU-F', 15, 'GERG nods and walks on out of frame, whole-pixel steps.', face=True, rule='was "his window closes"')
s('31.06', ['31.06'], '[MCU]', 'MCU', 'MCU-F', 165, 'MAS at his desk reads his memo aloud [V], unhurried. No move.', face=True, rule='was [P] box')
s('31.07', ['31.07'], '[ECU]', 'ECU', 'ECU-PROP', 90, 'The boardroom: a screwdriver takes the ALYI plate off his board chair, four screws, four beats.', face=True, build='exists')
s('31.08', ['31.08'], '[ECU]', 'ECU', 'ECU-PROP', 45, 'The conference-room door, shut, its nameplate still on.', build='exists')
s('31.09', ['31.09'], '[W]', 'W', 'W', 120, 'The folding chair unfolds: OBSERVER (NON-VOTING); the key ring drops onto it. Jangle.', build='exists')

P = [p for p in P if p['frames'] > 0]
SPLIT_LINES = {'a4-27-21': '27.36', 'a4-27-22': '27.36b', 'a4-30-03': '30.08', 'a4-30-04': '30.08b', 'a4-30-05': '30.13', 'a4-30-06': '30.13a',
               'a4-31-01': '31.03', 'a4-31-02': '31.03', 'a4-27-00': '27.01', 'a4-27-01': '27.01b'}
V2L = json.load(open(os.path.join(REPO, 'show/episodes/ep01/production/act4/shots-locked-v2.json')))
by = {p['id']: p for p in P}
for x in V2L['shots']:
    for l in x['lines']:
        tgt = SPLIT_LINES.get(l['id'])
        if tgt is None:
            if l['id'] == 'a4-30-02':  # Tasya's three-part line: one part per shot of the landlord
                tgt = {'30.05': '30.05', '30.06': '30.06', '30.07': '30.07'}[x['id']]
            else:
                tgt = next(p['id'] for p in P if x['id'] in p['v2'])
        by[tgt].setdefault('lines', [])
        if l['id'] not in by[tgt]['lines']: by[tgt]['lines'].append(l['id'])
        by[tgt].setdefault('kinds', {})[l['id']] = l.get('kind')

# ---------------------------------------------------------------- checks
prob = []
for k, g in itertools.groupby(P, key=lambda p: p['cls']):
    g = list(g)
    if len(g) > 2: prob.append(f"3+ consecutive {k}: {g[0]['id']}..{g[-1]['id']}")
boxes = [p['id'] for p in P if p['cls'] == 'BOX']
if len(boxes) > 2: prob.append(f'deliberate boxes > 2: {boxes}')
tot = sum(p['frames'] for p in P)
v2 = json.load(open(os.path.join(REPO, 'show/episodes/ep01/production/act4/shots-locked-v2.json')))
v2tot = sum(x['frames'] for x in v2['shots'])
used = set(i for p in P for i in p['v2'])
missing = [x['id'] for x in v2['shots'] if x['id'] not in used]
# the 30.07b row folded away: its v2 source is still covered by 30.07
if missing: prob.append(f'v2 shots not covered: {missing}')
moves = {}
for p in P:
    for m in filter(None, p['move'].split(',')): moves.setdefault(m, []).append(p['id'])
print('shots', len(P), 'frames', tot, 'v2 frames', v2tot, 'delta', tot - v2tot)
print('problems:', prob or 'none')
print('moves:', {k: len(v) for k, v in moves.items()}, moves)
from collections import Counter, defaultdict
C = Counter(p['tpl'] for p in P); print('templates:', dict(C))
cls = defaultdict(int)
for p in P: cls[p['cls']] += p['frames']
print({k: round(100 * v / tot, 1) for k, v in sorted(cls.items(), key=lambda x: -x[1])})
faces = sum(p['frames'] for p in P if p['face'])
wide = sum(p['frames'] for p in P if p['cls'] == 'W')
scr = sum(p['frames'] for p in P if p['cls'] in ('SW', 'SC') and not p['face'])
gfx = sum(p['frames'] for p in P if p['cls'] in ('GS', 'GM', 'GD', 'GFX'))
boxf = sum(p['frames'] for p in P if p['cls'] == 'BOX')
mcu = sum(p['frames'] for p in P if p['cls'] == 'MCU')
med = sum(p['frames'] for p in P if p['cls'] in ('M', 'OTS'))
ecu_face = sum(p['frames'] for p in P if p['cls'] == 'ECU' and p['face'])
print('faces+hands %', round(100 * faces / tot, 1), '| W %', round(100 * wide / tot, 1), '| screens(no face) %', round(100 * scr / tot, 1), '| gfx %', round(100 * gfx / tot, 1))
print('boxed window %', round(100 * boxf / tot, 1), '| MCU %', round(100 * mcu / tot, 1), '| M+2S+OTS %', round(100 * med / tot, 1), '| ECU with face/hand %', round(100 * ecu_face / tot, 1), '| CU %', round(100 * sum(p['frames'] for p in P if p['cls']=='CU') / tot, 1))
# lines by framing
L = {}
for x in v2['shots']:
    for l in x['lines']:
        if l.get('kind') == 'dialogue': L.setdefault(x['id'], []).append(l['id'])
print('dialogue lines per v3 class:', Counter(p['cls'] for p in P for l, k in p.get('kinds', {}).items() if k == 'dialogue'))
print('V.O. per class:', Counter(p['cls'] for p in P for l, k in p.get('kinds', {}).items() if k == 'vo'))
print('lines in boxes:', [(p['id'], l) for p in P if p['cls'] == 'BOX' for l in p.get('lines', [])])
TEMPLATES = {
 'MCU-F': 'frameless close-up: portrait Img + framelessBust over the room stepped down 2 (soft) + negativeFill; side L (x~100) / R (x~262), top y 20-26; tall bust by day',
 'MCU-2': 'frameless 50/50: two MCU-F busts, one per third, the thing between them soft (rack target)',
 'MCU-FRAME': 'MCU-F inside an in-world frame: doorway (full-height jamb + leaf) or dark window glass (reflection stepped -1)',
 'DESK-LOW': 'insert-scale prop big on the bottom edge + MCU-F behind; rack between',
 'OTS': 'fg: listener portrait silhouette (N0 + 1 px rim on the key side, may flip) bleeding off the side/bottom; bg: speaker medium rig in a medium plate (OTS-W: a room wide)',
 '2S': 'existing medium two-shots (drawDark2S / drawBoard2S / drawCalmOff2S)', 'M': 'existing medium (drawMadaM)', 'CU': 'drawMasCU',
 'ECU-HANDS': 'kits/inserts-mas + inserts-hands', 'ECU-EYES': 'drawEyesStrip', 'ECU-PROP': 'prop inserts (rooms, inserts-props)',
 'ECU-ORB': 'drawOrb at r 60-90 on a dark pool, orbStep looks, toasts ride',
 'HIGH-TABLE': 'drawTableInsert overhead (blueprint | prop | NEW phones)', 'HIGH-FLOOR': 'NEW bullpen floor top-down plate',
 'LOW-ROOM': 'NEW low-angle plates (bullpen ceiling, lobby sign)',
 'SCREEN': 'callgrid layouts: grid | active-speaker pin | two-up | half tile | closer laptop; bezel edge in the exit',
 'SCREEN-MACRO': 'integer 2x crop of a screen buffer, <= 1 beat, <= 2 per act, bezel corner in the exit',
 'BP-SIZES': 'blueprint sheet / section / detail (2x coordinates, 1 px lines) + whole-pixel pan', 'CARD-RIDE': 'name card riding the live shot',
 'W': 'room wide', 'BOX': 'the deliberate portrait window (<= 2 per act)'}
SIZE_CLASSES = {'W': 'wide incl. room angle plates and OTS-W backgrounds', 'M': '[M] [2S]', 'OTS': 'over-the-shoulder', 'MCU': 'frameless close-up, 50/50, frame-in-frame, desk-low',
 'CU': 'full-frame close-up', 'ECU': 'hands, eyes, the iris, prop inserts, table overheads', 'SW': 'screen wide (grid, list)', 'SC': 'screen close (pinned/single/half tile, phone, counter, floor POV)',
 'GS': 'blueprint sheet', 'GM': 'blueprint section', 'GD': 'blueprint detail', 'GFX': 'full-screen card', 'BOX': 'deliberate portrait window'}
json.dump({'meta': {'what': 'Ep1 Act Four framing v3 plan (cinematography); frames carried from lock v2 for comparison only: THE EDITOR re-times in the v3 lock',
                    'grammar': 'show/bible/pov-and-framing.md §4.7', 'doc': 'show/episodes/ep01/production/act4/framing-v3.md', 'prototype': 'studio/src/dev/framing-v3/templates.ts',
                    'rules': {'max_same_size_run': 2, 'deliberate_boxes_per_act': 2, 'whips_per_act': 4, 'racks_per_act': 4, 'screen_macros_per_act': 2},
                    'box_field': 'none = no typed dialogue box (close coverage); typed / speaker / os = keep the typed box',
                    'templates': TEMPLATES, 'size_classes': SIZE_CLASSES,
                    'date': '2026-09-25', 'shots': len(P), 'v2_frames_carried': tot, 'problems': prob},
           'shots': P}, open(sys.argv[1], 'w'), indent=1, ensure_ascii=False)
