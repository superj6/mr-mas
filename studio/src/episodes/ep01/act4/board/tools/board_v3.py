#!/usr/bin/env python3
"""MR. MAS · Ep1 · Act Four · BOARD 3 (v3), storyboard artist / 1st AD, 2026-09-25.

Re-boards Act Four from script draft 3.2 (the tightening pass) with the v3 framing grammar
(bible pov-and-framing §4.7, framing-v3.md). Writes, into show/episodes/ep01/production/act4/:
    shots-v3.json    the board (the JSON wins if the two ever disagree)
    shotlist-v3.md   the readable board
    chunks-v3.md     production chunks for the v3 animatic and the render
Run:  python3 studio/src/episodes/ep01/act4/board/tools/board_v3.py            (writes the three files)
      python3 studio/src/episodes/ep01/act4/board/tools/board_v3.py --check    (prints the checks only)
Re-run after a re-record or a ruling; don't hand-edit the outputs.

Sources: script.md Act Four (draft 3.2) · tighten-changes.md (§2 lines + targets, §4 cue sheet, §5 beat model, §6 sound,
§7 assets) · framing-v3.md / framing-v3.json (size, angle, template, moves; it decides where a 3.1 shot survives) ·
shots-v2.json / shots-locked-v2.json (crosswalk) · audio/ep01/act4/dialogue/lines.json (v2 takes = scratch until the
3.2 re-record lands).

Timing: the 3.2 beat model is the budget. Set-pieces, holds, cards, posts and music-bound cuts stay on the beat grid at
the writer's lengths. Inside a conversation the cut lands on the turn (§4.7.3 rule 8, the v3 default), frame-accurate,
with L-cuts <= 8 f; each conversation block is then closed back onto the beat grid by its last shot, so everything
after it stays on the grid. That is where this board is shorter than the model (never longer).
"""
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
import json, sys, itertools
from collections import Counter, defaultdict

ROOT = REPO
PROD = ROOT + '/show/episodes/ep01/production/act4'
FPS, FPB, FPBAR = 24, 15, 60
EP0 = (12 * 60 + 31) * FPS  # act frame 0 = episode 12:31:00


def tc(f):
    a = EP0 + f
    return f"{a // (FPS * 60):02d}:{(a // FPS) % 60:02d}:{a % FPS:02d}"


def glen(f):
    bars, rem = divmod(f, FPBAR)
    beats, fr = divmod(rem, FPB)
    parts = []
    if bars: parts.append(f"{bars} bar" + ("s" if bars > 1 else ""))
    if beats: parts.append(f"{beats} beat" + ("s" if beats > 1 else ""))
    if fr: parts.append(f"{fr} f")
    return " + ".join(parts)


# ======================================================================================= the 3.2 lines (tighten-changes §2)
# id: (speaker, text, tag, status_32, target_s, mode, os)
L32 = {
    'a4-25-10': ('NELEH (blueprint)', 'Nine seats. Three left this year. Four of us vote.', '[INVENTED]', 'NEW', 3.30, 'on-mic', False),
    'a4-25-11': ('NELEH (blueprint)', 'This board controls the company.', '[INVENTED]', 'NEW', 1.70, 'on-mic', False),
    'a4-25-12': ('NELEH (blueprint)', 'The investor gets—', '[INVENTED]', 'NEW (cut-off)', 0.80, 'on-mic', False),
    'a4-25-13': ('NELEH (blueprint)', 'And the CEO owns—', '[INVENTED]', 'NEW (cut-off)', 0.90, 'on-mic', False),
    'a4-25-02': ('MADA (blueprint)', 'Good question.', '[INVENTED] catchphrase', 're-take; new cue (overlapping)', 0.85, 'on-mic', False),
    'a4-26-01': ('MAS', 'super.', '[INVENTED] usage of a real public tic', 're-take (pace)', 0.60, 'on-mic', False),
    'a4-27-00': ('MAS (through their laptop)', 'super.', '[INVENTED] (a4-26-01 heard from the board\'s side)', 're-derive', 0.60, 'speaker', False),
    'a4-27-04': ('RIMA', "We'll share more soon.", '[INVENTED] catchphrase', 're-take (pace)', 1.10, 'on-mic', False),
    'a4-27-23': ('NELEH (on the call)', 'Share what?', '[INVENTED]', 'NEW (overlapping; call filter)', 0.55, 'call', False),
    'a4-27-24': ('RIMA', 'More. Soon.', '[INVENTED]', 'NEW', 0.90, 'on-mic', False),
    'a4-27-05': ('TILED EMPLOYEE', 'Is this a coup?', '[INVENTED] cartoon line', 're-take (pace)', 0.90, 'on-mic', False),
    'a4-27-06': ('ALYI', '"You can call it this way"', '[V · NOV 17, 2023]', 're-take (pace)', 2.10, 'on-mic', False),
    'a4-27-08': ('NELEH', 'The bylaws allow it. Footnote three.', '[INVENTED]', 're-take (pace)', 2.00, 'on-mic', False),
    'a4-27-09': ('ALYI (reflection)', 'Step four will reveal itself.', '[INVENTED]', 'CHANGED (no pause)', 2.10, 'on-mic', False),
    'a4-27-10': ('NELEH', 'When?', '[INVENTED]', 're-take; new cue (overlapping)', 0.45, 'on-mic', False),
    'a4-27-12': ('NELEH', 'The company is calling us.', '[INVENTED]', 're-take (pace)', 1.30, 'on-mic', False),
    'a4-27-13': ('ALYI (reflection)', 'That is the company telling us.', '[INVENTED]', 're-take (pace)', 2.20, 'on-mic', False),
    'a4-27-14': ('MARIO', "I've written up some thoughts—", '[INVENTED]', 'CHANGED (cut-off)', 1.60, 'on-mic', False),
    'a4-27-15': ('ADELINA', 'In plain English: no.', '[INVENTED] catchphrase', 're-take; new cue (overlapping)', 1.30, 'on-mic', False),
    'a4-27-16': ('MARIO', "Hi. Yes. We're very worried. How much?", '[INVENTED]', 're-take (pace)', 2.20, 'on-mic', False),
    'a4-27-19': ('TTEMME', 'Chat… for how long?', '[INVENTED]', 're-take (pace)', 1.30, 'on-mic', False),
    'a4-27-20': ('TASYA', '"a new advanced AI research team"', '[V · NOV 19–20, 2023]', 're-take (pace)', 2.10, 'read-aloud-post', False),
    'a4-27-21': ('NELEH (O.S.)', 'Step four?', '[INVENTED]', 're-take; restaged O.S.', 0.65, 'on-mic', True),
    'a4-29-03': ('MAS', 'mostly.', '[INVENTED]', 're-take (pace)', 0.65, 'on-mic', False),
    'a4-29-04': ('GERG', 'One sec. Compiling—', '[INVENTED] catchphrase', 'CHANGED (cut-off)', 0.90, 'on-mic', False),
    'a4-29-05': ('MAS', 'what are you building?', '[INVENTED]', 're-take; new cue (overlapping)', 1.40, 'on-mic', False),
    'a4-29-06': ('GERG', 'The company. Again. Just in case.', '[INVENTED]', 're-take (pace)', 1.70, 'on-mic', False),
    'a4-29-07': ('TASYA (O.S.)', 'Everyone is welcome.', '[INVENTED]', 're-take (pace)', 1.20, 'on-mic', True),
    'a4-29-08': ('MAS', 'leave it open.', '[INVENTED]', 're-take; new cue (overlapping)', 1.00, 'on-mic', False),
    'a4-29-09': ('NELEH', 'Has anyone read the char—', '[INVENTED]', 're-take (pace)', 1.20, 'on-mic', False),
    'a4-30-01': ('ALYI', '"I deeply regret my participation in the board\'s actions."', '[V · NOV 20, 2023]', 're-take (pace)', 3.80, 'read-aloud-post', False),
    'a4-30-02': ('TASYA', '"We are below them, above them, around them."', '[V/K · NOV 20, 2023 · re-verify before lock]', 're-take (pace)', 2.90, 'on-mic', False),
    'a4-30-03': ('MAS', 'hi.', '[INVENTED]', 're-take (pace)', 0.45, 'on-mic', False),
    'a4-30-04': ('TASYA (O.S., from the floor)', 'Hello.', '[INVENTED]', 're-take; new cue (overlapping)', 0.60, 'on-mic', True),
    'a4-30-05': ('TERB', 'Which room is on fire?', '[INVENTED]', 're-take (pace)', 1.20, 'on-mic', False),
    'a4-30-06': ('TERB', '…Ah.', '[INVENTED]', 're-take (pace)', 0.40, 'on-mic', False),
    'a4-30-07': ('TERB (O.S.)', 'Terms?', '[INVENTED]', 're-take (pace)', 0.50, 'on-mic', True),
    'a4-30-08': ('MADA', 'Good question.', '[INVENTED] catchphrase', 're-take (pace)', 0.85, 'on-mic', False),
    'a4-30-09': ('MAS', 'good question.', '[INVENTED]', 're-take (pace)', 0.90, 'on-mic', False),
    'a4-30-12': ('MAS (over the hands)', 'okay.', '[INVENTED]', 're-take (pace)', 0.60, 'on-mic', True),
    'a4-31-01': ('GERG', "What's in there?", '[INVENTED]', 're-take (pace)', 0.70, 'on-mic', False),
    'a4-31-02': ('MAS', "it's a preview.", '[INVENTED] (echo of the launch)', 're-take (pace)', 1.00, 'on-mic', False),
    'a4-31-03': ('MAS', '"i love and respect alyi… i harbor zero ill will towards him."', '[V · NOV 29, 2023]', 're-take (pace)', 4.30, 'memo-read', False),
}
VO32 = {
    'a4-26a-vo1': ("i don't keep score.", 'D2', '[INVENTED · VO · D2]', 1.50,
                   "the same shot (he's carving the mark as he says it); the next shot, the Orb counts the tally 1, 2, 3 and stops on his thumb; the tag's drawer pays it off",
                   "fallback 'i don't keep things.' (record it at the same pace)"),
    'a4-29-vo2': ('the badge was a joke.', 'D3', '[INVENTED · VO · D3]', 1.60,
                  "the Orb is already on the lanyard; aloud: \"mostly.\"; the tag frames the lanyard", ''),
    'a4-29-vo3': ('gerg never waits to be asked.', 'D8', '[INVENTED · VO · D8 · plants "to be asked" for Ep12]', 2.00,
                  "not caught (D8); released by Tasya's door, whose first held step lands on \"asked\"", ''),
}
# unvoiced posts (pop-ups in source casing; scratch reads stay in optional/)
POSTS = {
    'a4-27-01': ('GERG MOCKBRAN', '"…I quit."', '[V · NOV 17, 2023 · a fragment; re-fetch the casing]'),
    'a4-26a-01': ('MAS', '"if i start going off, the nopeai board should go after me for the full value of my shares"', '[V · NOV 17, 2023 · 9:32 PM PT, zone to confirm]'),
    'a4-27-07': ('MAS', '"…sorta like reading your own eulogy while you\'re still alive"', '[V · NOV 18, 2023]'),
    'a4-27-17': ('MAS', '"first and last time i ever wear one of these"', '[V · NOV 19, 2023]'),
    'a4-29-01': ('RIMA TAMURI', '"NopeAI is nothing without its people"', '[V · NOV 20, 2023, ~2:06 AM PT]'),
    'a4-30-10': ('GERG MOCKBRAN', '"Returning to NopeAI & getting back to coding tonight."', '[V · NOV 21, 2023 · re-fetch the casing]'),
    'a4-30-11': ('TTEMME', '"I am deeply pleased by this result, after ~72 very intense hours of work."', '[V · NOV 21, 2023]'),
}
RETIRED = {  # removed in 3.2 (tighten-changes §1.3)
    'a4-25-01': 'NELEH "Step four." (THE PLAN no longer shows step 4)',
    'a4-26a-vo2': 'MAS (V.O.) "the meeting ended early." (D4 cut)',
    'a4-29-vo1': 'MAS (V.O.) "i put the phone down." (D5 and MAS\'S VERSION cut)',
    'a4-27-02': 'RIMA "I\'ll hold it together." (R6)',
    'a4-27-03': 'NELEH "For how long?" (replaced by "Share what?")',
    'a4-27-11': 'ALYI "The company will tell us." (R2)',
    'a4-27-18': 'TTEMME "Chat. I\'m the CEO now." (it said his card aloud)',
    'a4-27-22': 'MADA "Good question." (end of pass one; pattern 8)',
}


def post_floor(text):
    """read-time floor for an unvoiced post or a card, in frames: 0.25 s + 0.05 s a character"""
    return round((0.25 + 0.05 * len(text)) * FPS)


# ======================================================================================= the asset catalog
# status: EXISTS (built) · REUSE (show / engine asset) · PARAM (an existing kit called with new parameters: no drawing)
#         HELPER (a framing.ts helper, prototyped in studio/src/dev/framing-v3/templates.ts) · CHANGED (exists; needs a
#         new option or state) · NEW (a drawing or plate to make) · CHECK (confirm at this size)
# pri (for PARAM / HELPER / CHANGED / NEW / CHECK): P1 the v3 animatic doesn't read without it · P2 a stand-in carries the
#         animatic, the final needs it · P3 polish / optional
# animatic: how the v3 animatic gets it now, and whether a crop / whole-number scale of existing art suffices there
A = {}


def asset(i, owner, status, fn, pri='', animatic='', note='', new_v3=False, crop_ok=None):
    A[i] = dict(id=i, owner=owner, status=status, fn=fn, priority=pri, animatic=animatic, note=note, new_in_v3=new_v3,
                crop_or_scale_suffices_for_animatic=crop_ok)


# ---- rooms and plates
asset('room.vegas-suite', 'rooms-a', 'EXISTS', 'rooms/vegas-suite.ts drawSuite · drawDeskInsert · drawLaptopInsert')
asset('room.tpool-door', 'rooms-a', 'EXISTS', 'rooms/tpool-door.ts drawTpoolDoor · drawTpoolClose')
asset('room.darkroom.desk', 'rooms-b', 'EXISTS', 'rooms/darkroom.ts drawDarkDesk (the tally desk, the glass from above)')
asset('room.darkroom.plate', 'rooms-b', 'EXISTS', 'rooms/darkroom-plate.ts drawDarkPlate / Desk / Front · DPLATE_LOOK (the medium plate: monitor, rack slot, the door in the wall)')
asset('room.boardroom', 'rooms-a', 'EXISTS', 'rooms/boardroom.ts drawBoardroom (FIRES_SC30, the door bang, the spotlight)')
asset('room.boardroom.plate', 'rooms-a', 'EXISTS', 'rooms/boardroom-plate.ts drawBoardPlate / Table / Front (window, table, fires)')
asset('room.bullpen', 'rooms-b', 'EXISTS', 'rooms/bullpen.ts drawBullpen · bullpenLandlord · ALLHANDS_TILES · DOOR_OPENING')
asset('room.lighthouse', 'rooms-b', 'EXISTS', 'rooms/lighthouse.ts drawLighthouse · drawRentMeter · drawDeskPhone · throneImg')
asset('room.lobby', 'rooms-a', 'EXISTS', 'rooms/lobby.ts drawLobby · drawLobbyCam (the security tile) · drawSignFloorInsert')
asset('room.table-insert', 'rooms-a', 'CHANGED', "rooms/boardroom.ts drawTableInsert: + focus 'phones' (four phones walk to the edge in held steps, the first tips off) and the blueprint's steps list on focus 'blueprint' (1–4, three ticks, the fold line, the ?)",
      'P1', "stand-in: focus 'prop' + the desk-insert phone sprite ×4 in held steps (a composite of existing art, no scaling); the steps list as text over focus 'blueprint'",
      "framing-v3 drawing 1 (15–20 agent-min) + the steps (10 agent-min). It's the committee's clock and the pass's fuse", True, True)
asset('room.neleh-desk.full', 'cast', 'PARAM', 'cast/neleh.ts nelehTileBg(b, 0, 0, 480, 203): her tile\'s world at full frame', 'P1',
      'call it at 480x203 (it is parametric; the shelves may need to fill the height)', 'framing-v3 shapes list (0–10 agent-min)', True, True)
asset('angle.high.neleh-desk', 'rooms-a', 'NEW', "an overhead of NELEH's home desk (surface + the unfolded blueprint + her phone), a surface variant of drawTableInsert", 'P2',
      "stand-in: drawTableInsert 'blueprint' as-is (the walnut reads as a desk for 2 beats)", "10–15 agent-min: a palette/prop swap so noon and that night don't read as the boardroom table", True, True)
asset('angle.high.bullpen-floor', 'rooms-b', 'NEW', 'HIGH-FLOOR: the bullpen floor top-down, slate (the landlord remap applies), his shoe tips at the top edge', 'P2',
      "stand-in: a crop of the slate-remapped bullpen floor band from the wide + the mas-stand shoe tips (reads for its 1 beat)", 'framing-v3 drawing 2 (10–15 agent-min)', True, True)
asset('angle.low.lobby', 'rooms-a', 'NEW', 'LOW-ROOM: the lobby from low, the wall sign looming over us (3 held ignite steps), Mas small at the reception desk', 'P2',
      'stand-in: a crop of drawLobby (night, lit) framed on the sign and the desk (not a true low angle; it times the shot)', 'framing-v3 drawing 4 (25–35 agent-min)', True, True)
asset('room.lighthouse.desk-insert', 'rooms-b', 'NEW', 'the lighthouse desk at insert scale (paper drifts, the ringing handset with its throne)', 'P2',
      "stand-in: a crop of the lighthouse wide's desk + adelina.ts drawThroneHandset lg (v2's BOX plate)", 'carried from board 2 (not new in v3)', False, True)
# ---- cast: portraits (the MCU source art) and rigs
for i, fn in [('cast.mas.portrait', 'cast/mas.ts masPortrait (light monitor | warm)'), ('cast.mas.lookdown', 'cast/swaps-act4.ts masLookDown'),
              ('cast.neleh.portrait', 'cast/neleh.ts nelehPortrait + drawFootnotes'), ('cast.mada.portrait', 'cast/mada.ts madaPortrait + drawSpinner'),
              ('cast.rima.portrait', 'cast/rima-speak.ts rimaSpeakPortrait'), ('cast.alyi.portrait', 'cast/alyi-speak.ts alyiSpeakPortrait'),
              ('cast.alyi.reflection', 'cast/alyi-speak.ts alyiReflection'), ('cast.mario.portrait', 'cast/mario.ts marioPortraitImg'),
              ('cast.ttemme.portrait', 'cast/ttemme.ts ttemmePortrait + drawChatOverlay'), ('cast.tasya.portrait', 'cast/tasya-speak.ts tasyaSpeakPortrait'),
              ('cast.terb.portrait', 'cast/terb.ts terbPortrait'), ('cast.gerg.portrait', 'cast/gerg-speak.ts gergGlow / gergSpeakPortrait')]:
    asset(i, 'cast', 'EXISTS', fn)
asset('cast.mas.cu', 'cast', 'EXISTS', 'cast/mas-cu.ts drawMasCU (one silent drawing; backdrops strip | lobby)')
asset('cast.mas.eyes', 'cast', 'EXISTS', 'cast/mas-cu.ts drawEyesStrip')
asset('cast.mas.medium', 'cast', 'EXISTS', 'cast/mas-medium.ts drawMasMedium')
asset('cast.mada.medium', 'cast', 'EXISTS', 'cast/mada-medium.ts drawMadaMedium · rooms/twoshots.ts drawMadaM')
asset('cast.neleh.medium', 'cast', 'EXISTS', 'cast/neleh-medium.ts (inside drawBoard2S)')
asset('cast.orb', 'cast', 'EXISTS', 'cast/orb-medium.ts drawOrb (procedural at any radius) · orbStep')
asset('cast.gerg.medium-tile', 'cast', 'EXISTS', 'cast/gerg-medium.ts drawGergMediumPOV / drawGergMediumTile · swaps-act4 drawGergTileWide')
asset('cast.twoshots', 'rooms', 'EXISTS', 'rooms/twoshots.ts drawDark2S · drawBoard2S · drawCalmOff2S · drawMadaM · drawDoorwayP2 · drawVaultP2')
asset('cast.room-sprites', 'cast', 'EXISTS', 'mas-stand · terb room · ttemme room · tasya room · alyi stand · adelina room · neleh room · mada seated · gerg stand')
asset('cast.mas.hands', 'cast', 'EXISTS', 'kits/inserts-mas.ts drawNudgeInsert · drawClickInsert · drawStripTapInsert · drawCarveInsert · drawBrushInsert · drawPhone29Timeline')
asset('cast.mas.tallbust', 'cast', 'NEW', "Mas's day tall bust: masPortrait AND masLookDown, the same vector torso rendered 48 rows longer (112x184)", 'P1',
      "stand-in: the helper's bottom extension (reads boxy by day, templates sheet 12); acceptable for the animatic, logged as a stand-in", 'framing-v3 §6 (5–10 agent-min each)', True, True)
asset('cast.gerg.tallbust', 'cast', 'NEW', "Gerg's day tall bust (gergGlow), for the 50/50", 'P2', "stand-in: the helper's extension (his print repeats into stripes: crop it at the laptop line)", 'framing-v3 §6', True, True)
asset('cast.alyi.tallbust', 'cast', 'NEW', "Alyi's day tall bust (alyiSpeakPortrait), for the all-hands doorway", 'P2', "stand-in: the helper's extension; the jamb covers half of him", 'framing-v3 §6', True, True)
asset('cast.neleh.tallbust', 'cast', 'NEW', "Neleh's tall bust, only if the helper reads boxy on her lit desk world", 'P3', "stand-in: the helper's extension", 'optional', True, True)
asset('cast.neleh.hand', 'cast', 'NEW', "NELEH's hand at insert scale: the pen tap, the marker uncapped and writing, the hand at rest by the ? (sleeve, no ring)", 'P1',
      "stand-in: kits/inserts-hands pinchHand / restHandCaps through a palette map to her sleeve and skin (a recolour, not a redraw)", '15–25 agent-min; v2 had a BOX here', True, True)
asset('cast.hands.worker', 'cast', 'NEW', "a maintenance worker's hand + screwdriver (four screws)", 'P2', 'stand-in: drawChairBackInsert with the screws stepping, no hand (v2 BOX)', 'carried from board 2', False, True)
asset('cast.hands.maintenance', 'cast', 'NEW', 'a maintenance hand setting the box of 0 plates down', 'P3', 'stand-in: drawSignFloorInsert without the hand', 'carried from board 2', False, True)
asset('cast.mas.hand.pin', 'cast', 'CHECK', "Mas's fingers on the pin (drawPinTag)", 'P3', 'stand-in: the pin tag alone (v2)', 'carried from board 2', False, True)
# ---- kits
asset('kit.blueprint.v3', 'kits', 'CHANGED', "THE PLAN re-laid to 3.2 (plan25 rebuilt at 7 bars): the new title; chairs that walk off; the circle; the box + arrow on a sheet taller than the frame (the pan); the key ring's jangle + the VOTES: 0 stamp; the CEO box + EQUITY: 0 + the moth's flight; the path '1. NOON · VIDEO CALL' under a fold whose corner curls to neon; detail sizes at 2x coordinates (1 px lines)", 'P1',
      "partly: the detail cut-ins may be an integer 2x nearest crop of the section as a MARKED stand-in (final: redrawn at 2x coordinates); the new content must be built (kit calls + text, ≈ 30–45 agent-min)", 'kits/blueprint.ts has every primitive (bpChair walk poses, bpRing, bpKeyRing, bpStamp, bpMoth, curlAt, tearAt, bpWalker)', True, True)
asset('kit.call-grid', 'kits', 'EXISTS', 'kits/callgrid.ts gridLayout · drawTile · callDialog · drawPointer · tileDrop · spinner · callToast · postChip · cctv')
asset('kit.call-layouts', 'kits', 'PARAM', "callgrid layouts: the app's speaker view (pinned tile), the two-up, the half-frame tile, and the avalanche laid into the dark-room monitor rect (DPLATE screen) for the OTS", 'P1',
      'gridLayout(n, {area}) + drawTile at the new rects (parameters, no drawing)', 'framing-v3 shapes list (10–20 agent-min)', True, True)
asset('kit.call-label', 'kits', 'PARAM', "MADA's tile label flipping in: 'MADA · LAST FIRER STANDING · ANSWERS GIVEN: 0' (call UI, 3 held flip steps); replaces his name card", 'P1',
      'drawTile name/label + a 3-step flip', 'tighten-changes §7', True, True)
asset('kit.spotlight', 'kits', 'PARAM', "RIMA's hard spotlight pool at full frame", 'P1', 'kits/callgrid.ts spotlight() on a 480x203 region', 'framing-v3 shapes list (5 agent-min)', True, True)
asset('kit.dialog-1993', 'kits', 'EXISTS', 'kits/callgrid.ts callDialog · dialogButton · drawPointer')
asset('kit.falling-stack', 'kits', 'EXISTS', 'kits/avalanche.ts planPile · drawPile · planGridStack · drawGridStack · shove · scatter · odometer')
asset('kit.post-ui', 'kits', 'NEW', 'the posts\' own UI: phone post, feed notification, security-tile corner, the phone lit green', 'P2', 'stand-in: lay.ts postCard / callgrid postChip (as v2)', 'carried from board 2', False, True)
asset('kit.cards', 'kits', 'NEW', 'dated quote cards, the act-out card, the NELEH and TERB name cards (stat lines)', 'P2', 'stand-in: lay.ts quoteCard / actCard / blipCard (as v2)', 'carried from board 2', False, True)
asset('kit.plates', 'kits', 'NEW', "lower-third plates: 'RIMA TAMURI · CEO (WEEKEND EDITION)' and 'TTEMME · CEO (72 HOURS)' (they replace their name cards)", 'P2', 'stand-in: text on the rail-band plate style', 'tighten-changes §7', True, True)
asset('kit.doorway-jamb', 'kits', 'NEW', "MCU-FRAME's doorway: the jamb and the door leaf as full-height foreground shapes (the bullpen door by day; the slate door in the boardroom wall)", 'P1',
      'flat shapes (rects in the room palette) over the frameless bust: no art needed', 'framing-v3 shapes list (5–10 agent-min each)', True, True)
# ---- props
for i, fn in [('prop.pen', 'kits/props.ts pen'), ('prop.tally', 'kits/props.ts tally'), ('prop.guest-lanyard', 'kits/props.ts guestBadge'),
              ('prop.phone', 'vegas-suite desk insert phone · inserts-mas'), ('prop.odometer', 'kits/avalanche.ts odometer'),
              ('prop.hourglass', "cast/ttemme.ts drawHourglass 'lg' / kits/props.ts hourglass 'L' + hourglassFlip"),
              ('prop.extinguisher', 'cast/terb.ts drawExtinguisherInsert · drawPinTag'), ('prop.term-sheet', 'cast/terb.ts drawTermSheet'),
              ('prop.throne-handset', 'cast/adelina.ts drawThroneHandset'), ('prop.rent-meters', 'rooms/lighthouse.ts drawRentMeter'),
              ('prop.arrow-sign', 'cast/tasya-speak.ts (the sign with the arrow)'), ('prop.fires', 'rooms/setkit.ts drawFire · kits/props.ts fire'),
              ('prop.zero-box', 'kits/props.ts zeroBox · lobby drawSignFloorInsert'), ('prop.lobby-sign', 'kits/props.ts lobbySign'),
              ('prop.nameplate-alyi', 'rooms/boardroom.ts drawChairBackInsert'), ('prop.q-vault', 'kits/inserts-props.ts drawVaultInsert · twoshots drawVaultP2 (the vault layer)')]:
    asset(i, 'kits', 'EXISTS', fn)
asset('prop.hourglass.insert', 'cast', 'NEW', 'the hourglass at insert scale (three states: sand up, falling, down) for the desk-level foreground', 'P2',
      "stand-in: an integer 2x nearest of drawHourglass 'lg', MARKED (the templates sheet 9 shows 'lg' reads as a small prop, not a foreground); final art is redrawn, never scaled", 'framing-v3 drawing 6 (10–15 agent-min)', True, True)
asset('prop.observer-chair', 'rooms-b', 'NEW', 'the MACROSOFT-blue folding chair, OBSERVER (NON-VOTING), unfolding in 4 drawings', 'P2', 'stand-in: v2 BOX', 'carried from board 2', False, False)
asset('prop.check-evirht', 'kits', 'NEW', 'the giant check EVIRHT · TENDER OFFER @ ~$86B VALUATION + VOID IF CEO MISSING', 'P3', "stand-in: the dark plate's own tray check (v2)", 'carried from board 2', False, True)
# ---- framing helpers (framing.ts, engine owner; prototyped in studio/src/dev/framing-v3/templates.ts)
asset('fx.frameless-bust', 'engine', 'HELPER', 'framelessBust + negativeFill + softLayer: MCU-F / MCU·PF / MCU-FRAME / MCU-2 / DESK-LOW', 'P1',
      'copy the prototype (bust / soft / vignette) into the animatic: existing portrait art composed unscaled; no crop or scale involved', 'framing-v3 §6 helpers (45–75 agent-min with the rest)', True, True)
asset('fx.ots-shoulder', 'engine', 'HELPER', 'shoulderFg: the listener\'s portrait as an N0 silhouette with a 1 px rim, bleeding off the side and bottom', 'P1', 'the prototype `shoulder`', 'framing-v3 §6', True, True)
asset('fx.rack', 'engine', 'HELPER', 'softLayer with a keep mask + rackAt (3 held steps of 2 f); record text is never inside the soft layer', 'P2', 'the prototype `soft` with a keep mask', 'framing-v3 §6', True, True)
asset('fx.whip', 'engine', 'HELPER', 'whipFrame: 4 f (2 out, 2 in), row runs + the highlight smear; the rail band and UI never streak', 'P2', 'the prototype `whip`; fallback a hard cut', 'framing-v3 §6', True, True)
asset('fx.screen-macro', 'engine', 'HELPER', "screenMacro: an integer 2x crop of a screen's own pixels, <= 1 beat, <= 2 per act (in the exit it keeps a bezel corner)", 'P1',
      'it IS a whole-number 2x crop of the screen buffer: nothing to draw', 'framing-v3 §6', True, True)
asset('fx.drift', 'engine', 'HELPER', 'driftAt: whole-pixel parallax, <= 16 px a shot', 'P3', 'the prototype `shift`', 'framing-v3 §6', True, True)
asset('fx.pan', 'engine', 'HELPER', 'moveTo across art drawn bigger than the frame, whole pixels on 2 f holds', 'P2', 'a whole-pixel offset of the tall blueprint sheet', 'framing-v3 §2.2', True, True)
asset('engine.fx', 'engine', 'EXISTS', 'renderFront (F1.2) · GLYPH dissolve · 2-tone freeze · BLUEPRINT_PRINT · the typed dialogue box · the V.O. line')

# the verdict the task asks for: is a crop / whole-number scale (or a composite) of EXISTING art enough for the v3 animatic?
VERDICT = {
    'room.table-insert': 'YES: a composite of existing art (the table overhead + the desk-insert phone ×4), no scaling',
    'room.neleh-desk.full': 'n/a: a parameter call, no art', 'angle.high.neleh-desk': 'YES: the boardroom table overhead as-is',
    'angle.high.bullpen-floor': 'YES: a crop of the slate floor band from the wide + the shoe tips', 'angle.low.lobby': 'YES: a crop of the lobby night wide on the sign (not a true low angle)',
    'room.lighthouse.desk-insert': "YES: a crop of the lighthouse wide's desk + the existing throne handset",
    'cast.mas.tallbust': "YES: the existing portrait, unscaled, with the helper's bottom extension (reads boxy by day: MARKED)",
    'cast.gerg.tallbust': "YES: the helper's extension (MARKED)", 'cast.alyi.tallbust': "YES: the helper's extension (half behind the jamb)", 'cast.neleh.tallbust': "YES: the helper's extension",
    'cast.neleh.hand': "YES: Mas's inserts-hands pinch / rest hand through a palette map (a recolour, not a redraw: MARKED)",
    'cast.hands.worker': 'YES: the chair-back insert with the screws stepping, no hand', 'cast.hands.maintenance': 'YES: the floor insert without the hand', 'cast.mas.hand.pin': 'YES: the pin tag alone',
    'kit.blueprint.v3': 'PARTLY: the detail sizes may be an integer 2x crop of the section (MARKED); the new title, walk-offs, stamp, moth flight and fold must be built as kit calls',
    'kit.call-layouts': 'n/a: parameters, no art', 'kit.call-label': 'n/a: a parameter (the tile label) + 3 held steps', 'kit.spotlight': 'n/a: a parameter call',
    'kit.post-ui': "YES: v2's existing stand-in layouts", 'kit.cards': "YES: v2's existing stand-in cards", 'kit.plates': 'YES: text on the plate style',
    'kit.doorway-jamb': 'YES: flat shapes in the room palette, no art', 'prop.hourglass.insert': "YES: an integer 2x of the 'lg' hourglass (MARKED; the final is redrawn)",
    'prop.observer-chair': 'NO: nothing exists (v2 played a labelled box)', 'prop.check-evirht': "YES: the dark plate's own tray check",
    'fx.frameless-bust': 'n/a: code (prototyped); it composes the existing portraits unscaled', 'fx.ots-shoulder': 'n/a: code (prototyped); a silhouette of the existing portrait',
    'fx.rack': 'n/a: code (prototyped)', 'fx.whip': 'n/a: code (prototyped); fallback a hard cut', 'fx.drift': 'n/a: code', 'fx.pan': 'n/a: code (needs the tall sheet from kit.blueprint.v3)',
    'fx.screen-macro': "YES: it IS an integer 2x crop of the screen's own buffer",
}
for k, v in VERDICT.items(): A[k]['crop_or_scale_suffices_for_animatic'] = v

DROPPED = [
    ('cast.orb.portrait', 'the Orb in a portrait window: its face is now its iris, full frame (drawOrb, procedural)'),
    ('kit.mas-version + cast.mas.hand.six + score.keynote-piano', "D5 and MAS'S VERSION cut in 3.2 (debuts in Ep2 or Ep3)"),
    ('prop.wallet', 'the Senate wallet insert: the 9:32 post now lands on EQUITY: 0 on the board\'s side'),
    ('prop.door-nameplate (drawShutDoorInsert in sc 31)', 'the shut-door insert repeated the screwdriver\'s point'),
    ('the sc 31 walk wide + the Q* vault at room scale', 'the walk and the exchange are one frameless 50/50'),
    ('the RIMA, ADELINA, TTEMME and MADA name-card layouts', 'plates, a line and a tile label instead (cards stay >= 45 s apart)'),
    ('the THAT NIGHT, NOV 19 · NIGHT, THE LETTER and return NOV 20 rails', 'cut in 3.2'),
    ("framing-v3 drawing 3 (the bullpen ceiling, low angle)", 'the landlord is one still wide (a real line plays whole on one shot)'),
    ("framing-v3 drawing 5 (the 1993 dialog + arrow redrawn at 2x UI scale)", "replaced by the screen macro on 26.06: in-world 2x of the laptop's own pixels, 1 beat (macro 1 of 2)"),
    ('kit.portrait-layout (except the one BOX) and kit.fallaway', 'the frameless bust and the MCU·PF lighting move replace the windows'),
    ('cast.alyi.window-exit', 'Alyi steps back in the all-hands wide, not out of a window'),
]

# ======================================================================================= the shots
SHOTS = []
SIZE_OF_CLASS = {'W': 'W', 'M': 'M', 'OTS': 'OTS', 'MCU': 'MCU', 'CU': 'CU', 'ECU': 'ECU', 'SW': 'SW', 'SC': 'SC', 'GS': 'GS', 'GM': 'GM', 'GD': 'GD', 'GFX': 'GFX', 'BOX': 'BOX'}


def S(i, sc, fr, tag, size, cls, tpl, angle, move, *, box='none', v2=(), fv3=(), change='CARRY', note='', model='', script='',
      room='', chars=(), action=(), lines=(), text=(), sfx=(), music='', gags=(), notes=(), assets=(), face=False, hand=False,
      standin='', record=(), events=2, mode='I', rides=None, switches=(), drop_out=None, quiet=False, entry='', side=None):
    SHOTS.append(dict(id=i, scene=sc, frames=fr, tag=tag, shotSize=size, size_class=cls, framing=tpl, angle=angle, move=move, box=box,
                      v2_id=list(v2), fv3_id=list(fv3), change=change, change_note=note, model_len=model, script_len=script, room=room,
                      characters=list(chars), action=list(action), line_cues=list(lines), text=list(text), sfx=list(sfx), music=music,
                      gags=list(gags), notes=list(notes), asset_ids=list(assets), face=face, hand_in_frame=hand, standin=standin,
                      record_items=list(record), events=events, prod_mode=mode, rides=rides, switches=list(switches), drop_out=drop_out,
                      quiet_beat=quiet, entry=entry, side_override=side))


# ------------------------------------------------------------------------------------------------ 24 · the suite (6 beats)
S('24.01', '24', 60, '[W]', 'WIDE', 'W', 'W', 'EYE · the suite wide, window to the Strip; Mas at the desk left third, 3/4', 'STILL',
  v2=['24.01'], fv3=['24.01'], model='1 bar', script='1 bar', room='vegas-suite · wide · day',
  chars=['MAS: room sprite at the desk (left third, 3/4 front), laptop open, his glass beside it', 'THE ORB: at his shoulder, room scale'],
  action=['f0: the rail types on.', 'The crane truck grinds along the closed circuit below the window (1 px / 2 f).',
          'As it passes, the flute, the tumbler, the ice bucket and the vase shiver in turn (2 held drawings, 1 px, staggered 3 f).',
          "Mas's glass doesn't move a pixel; its water line stays flat."],
  text=[('rail', 'NOV 17, 2023 · ~NOON PT · LAS VEGAS', '[V]', 0)],
  sfx=['crane truck diesel grind (build), pre-lapped a bar under sc 23 if the Act Three owner takes it', 'glass tings ×4 (build), uneven, never a chord'],
  music='DARK ROOM, one felt phrase (MM-07 E01-S24) · in: the cut', gags=['The cup that never ripples.'],
  notes=["The act's one establishing wide. No race branding (generic barriers)."], assets=['room.vegas-suite', 'cast.room-sprites', 'cast.orb'],
  standin='rooms-a drawSuite (truck, shiver) + cast desk sprite + drawOrb at room scale (v2 24.01)', events=6)
S('24.02', '24', 30, '[ECU]', 'INSERT-HANDS', 'ECU', 'ECU-HANDS', 'HIGH · 3/4 down onto the desk: his hand, the glass, the trackpad edge', 'STILL',
  v2=['24.02', '24.03'], fv3=['24.02', '24.03'], change='CHANGED', note="Carries 24.03's job: the laptop's glow floods the insert and turns to blueprint (the [PF] is cut).",
  model='2 beats', script='2 beats', room='vegas-suite · desk insert', chars=['MAS: hand only'],
  action=['Beat 1: two fingers nudge the glass one pixel true, onto a spot it never left.', 'Beat 2: the hand settles on the trackpad; the laptop glow floods the frame.',
          'f22–29: the whole-frame flash-print to blueprint (a palette remap, no redraw); hard cut on the downbeat.'],
  switches=["f22-29: palette BLUEPRINT_PRINT, whole frame ('the glow turns to blueprint')"], sfx=['glass set-down tick (the nudge), very soft', 'blueprint print thump on the cut'],
  music='DARK ROOM felt · out: cut, by the blueprint', gags=['He straightens a glass that didn\'t move.'], assets=['room.vegas-suite', 'cast.mas.hands', 'engine.fx'],
  face=True, hand=True, standin='inserts-mas drawNudgeInsert (suite) + BLUEPRINT_PRINT on f22-29', events=3, mode='M')

# ------------------------------------------------------------------------------------------------ 25 · THE PLAN (7 bars)
PLAN_NOTE = "THE PLAN is the show's voice: [GFX], no V.O., no device, no Mas tell, no faces. Variety comes from the sheet's own sizes (sheet · section · detail) and one pan."
S('25.01', '25', 60, '[GFX·sheet]', 'BLUEPRINT-SHEET', 'GS', 'BP-SIZES', 'FLAT · the whole sheet on the drafting grid', 'STILL',
  v2=['25.01'], fv3=['25.01'], change='CHANGED', note='New title (the no-spoiler fold): WHO OWNS A CEO WHO OWNS NOTHING? · 3 bars → 1.', model='1 bar', script='1 bar (THE WORD)',
  room='blueprint · sheet', action=['f0–29: the drafting grid draws itself.', 'f30 (beat 3): the title stamps across the grid.'],
  text=[('stamp', 'WHO OWNS A CEO WHO OWNS NOTHING?', '[INVENTED] title', 30)], sfx=['rubber_stamp_C (the title)', 'pencil strokes on the grid'],
  music='BLUEPRINT waltz (MM-07 E01-S25, re-conformed 18 → 7 bars) · in: the cut', notes=[PLAN_NOTE], assets=['kit.blueprint.v3'],
  standin='plan25 rebuilt at 7 bars (kit.blueprint.v3)', events=3, mode='P')
S('25.02', '25', 105, '[GFX·section]', 'BLUEPRINT-SECTION', 'GM', 'BP-SIZES', 'FLAT · section: the nine chair outlines, nameplates legible', 'STILL',
  v2=['25.02'], fv3=['25.02'], change='SPLIT', note="The model's 4-bar voiced diagram is cut in four on NELEH's clauses (a set-piece cuts at least every 2 bars): section → sheet (pan) → detail → detail.",
  model='4 bars (split 7 + 3 + 2 + 4 beats)', script='THE DIAGRAM (4 bars)', room='blueprint · section',
  action=['Nine blueprint chair outlines on the grid, each with a nameplate.', '"Three": three outlines stand up on small legs and walk politely off the grid, one per waltz beat: DIRE, NOVIHS, DRUH (a campaign sticker, no logo, no date).',
          '"Four": a circle draws itself around ALYI, NELEH, MADA and THE QUIET VOTE; MAS and GERG stay outside it (egg: bolts at MADA\'s feet).'],
  lines=[('a4-25-10', 15)], sfx=['pencil on every line', 'tiny chair-feet ticks, one per step'], music="Waltz thinned to pizzicato + celesta under NELEH's lines",
  gags=['The polite chairs.'], notes=['Keep NOVIHS name-only, away from any NOLE cue (no lamp click, no zAI colours).', 'The departures are [V/K]; exit dates not shown.'],
  assets=['kit.blueprint.v3'], standin='kit.blueprint.v3 section', events=6, mode='P')
S('25.02b', '25', 45, '[GFX·sheet]', 'BLUEPRINT-SHEET', 'GS', 'BP-SIZES', 'FLAT · pulled back to the sheet, a sheet drawn taller than the frame', 'PAN · down, whole pixels on 2 f holds, following the arrow from THE NONPROFIT into THE COMPANY (≈ 1 px / 2 f)',
  v2=['25.03'], fv3=['25.03'], change='SPLIT', note="framing-v3's structure pan, on NELEH's control line.", model='(in 25.02)', script='THE DIAGRAM',
  room='blueprint · sheet (tall)', action=['f0: a box draws itself around the six: NOPEAI · THE NONPROFIT.', 'f8–40: a thick arrow drives down out of it into a bigger box, NOPEAI · THE COMPANY (CAPPED PROFIT); the pan rides the arrowhead down.'],
  lines=[('a4-25-11', 2)], sfx=['pencil; the arrow\'s long stroke'], music='Waltz, pizzicato', notes=['"controls" lands on the arrow\'s draw. The pan is allowed: no [V] line, post or card is in picture.'],
  assets=['kit.blueprint.v3', 'fx.pan'], standin='the tall sheet + a whole-pixel y offset per 2 f', events=3, mode='P')
S('25.02c', '25', 30, '[GFX·detail]', 'BLUEPRINT-DETAIL', 'GD', 'BP-SIZES', 'FLAT · detail (2x coordinates): the key ring outside the fence', 'STILL',
  v2=['25.03'], fv3=['25.03'], change='SPLIT', note='The investor gets—: the stamp is the cut-off.', model='(in 25.02)', script='THE DIAGRAM',
  room='blueprint · detail', action=['A key ring the size of a steering wheel outside a drawn fence: MACROSOFT · ~$10B IN (REPORTED).', 'It jangles, hopeful (f4–16).',
                                      'f21, on the "t" of "gets": a stamp lands on it: VOTES: 0.'],
  lines=[('a4-25-12', 2)], text=[('label', 'MACROSOFT · ~$10B IN (REPORTED)', '[V as reported]', 0), ('stamp', 'VOTES: 0', '[V]', 21)],
  sfx=['key ring jangle (build), hopeful', 'rubber_stamp_C on f21 (it cuts the line)'], music='Waltz, pizzicato', record=['MACROSOFT label (REPORTED)', 'VOTES: 0'],
  gags=['The hopeful key ring.'], assets=['kit.blueprint.v3'], standin='kit.blueprint.v3 detail; stand-in: an integer 2x nearest crop of the section (MARKED)', events=3, mode='P')
S('25.02d', '25', 60, '[GFX·detail]', 'BLUEPRINT-DETAIL', 'GD', 'BP-SIZES', 'FLAT · detail (2x coordinates): the CEO box inside the company box', 'STILL',
  v2=['25.03', '25.05'], fv3=['25.03b', '25.05'], change='SPLIT', note="MADA's \"Good question.\" now cuts off \"And the CEO owns—\" (a GFX pair: one question and its non-answer in one frame).",
  model='(in 25.02)', script='THE DIAGRAM', room='blueprint · detail',
  action=['The small CEO box, stamped underneath: EQUITY: 0 (HIS TESTIMONY).', 'f46: in the empty equity box beside it, a tiny blueprint moth opens its wings.', 'f50–59: it flutters up and out of the top of frame (it crosses 25.03\'s top edge).'],
  lines=[('a4-25-13', 8), ('a4-25-02', 26)], text=[('stamp', 'EQUITY: 0 (HIS TESTIMONY)', '[V]', 0)], sfx=['moth flutter (paper)'], music='Waltz, pizzicato',
  record=['EQUITY: 0 (HIS TESTIMONY)'], gags=['The moth: the answer is nothing.'], assets=['kit.blueprint.v3'], standin='kit.blueprint.v3 detail (2x crop stand-in, MARKED)', events=3, mode='P')
S('25.03', '25', 60, '[GFX·sheet]', 'BLUEPRINT-SHEET', 'GS', 'BP-SIZES', 'FLAT · the sheet', 'STILL',
  v2=['25.04'], fv3=['25.04'], change='CHANGED', note='Only step 1 shows; the rest runs under a fold (no spoiler of the firing).', model='1 bar', script='THE PATH (bar 1)',
  room='blueprint · sheet', action=['Four blueprint figures walk on in a row: a door outline (ALYI), a figure with a glowing paper (NELEH), a figure with a spinner (MADA), a black square (THE QUIET VOTE).',
                                    'A numbered path draws itself under their feet: 1. NOON · VIDEO CALL, and runs on under a fold in the paper.', 'Beat 4: they step onto 1 and stop. (The moth crosses the top edge and is gone.)'],
  text=[('label', '1. NOON · VIDEO CALL', '[V]', 20)], sfx=['pencil; four tiny footsteps'], music='Waltz', notes=['The figures are the invite\'s four circles.'],
  assets=['kit.blueprint.v3'], standin='kit.blueprint.v3 (bpWalker ×4)', events=4, mode='P')
S('25.04', '25', 30, '[GFX·detail]', 'BLUEPRINT-DETAIL', 'GD', 'BP-SIZES', 'FLAT · detail on the fold', 'STILL',
  v2=['25.07'], fv3=['25.07'], change='CHANGED', note='The fold curls (was the corner curl + the tear on step 4).', model='2 beats', script='THE BREAK (bar 2)',
  room='blueprint · detail', action=["The fold's corner curls up in held steps; Las Vegas neon bleeds through behind it.", 'f18: the blueprint tears along step 1\'s line, straight back into the suite.'],
  sfx=['paper_flutter (the fold)', 'paper_whip (the tear)'], music='Waltz', assets=['kit.blueprint.v3'], standin='curlAt / tearAt (kits/blueprint)', events=3, mode='P')
S('25.05', '25', 30, '[ECU]', 'INSERT-HANDS', 'ECU', 'ECU-HANDS', 'HIGH · over his hand onto the laptop screen', 'STILL',
  v2=['25.08'], fv3=['25.08'], change='RETIME', note='1 bar → 2 beats.', model='2 beats', script='2 beats', room='vegas-suite · laptop insert', chars=['MAS: hand only'],
  action=['His hand on the trackpad; the laptop reads BOARD · VIDEO CALL · JOIN, the pointer on JOIN.', 'f15 (beat 2): he clicks; the waltz\'s tape-stop lands on the click.', 'f16–29: connecting….'],
  text=[('ui', 'BOARD · VIDEO CALL · JOIN', '[INVENTED] UI', 0)], sfx=['trackpad click (f15)'], music='out: a tape-stop on the click',
  notes=["It's his laptop's pointer. The lit cursor is the player's and stays dark all act."], assets=['cast.mas.hands', 'room.vegas-suite'], face=True, hand=True,
  standin='inserts-mas drawClickInsert (click moved to f15)', events=2, mode='M')

# ------------------------------------------------------------------------------------------------ 26 · the falling tile (29 beats)
S('26.01', '26', 60, '[POV] + CARD', 'SCREEN-WIDE', 'SW', 'SCREEN + CARD-RIDE', 'POV · his laptop full-bleed (no bezel): the five-tile grid', 'STILL',
  v2=['26.01', '26.02'], fv3=['26.01', '26.02'], change='MERGE', note='The NELEH name card rides the live grid for the bar (it logs as the grid).', model='1 bar', script='1 bar',
  room='the call · G5', action=['The grid connects tile by tile: MAS (Vegas neon), ALYI (a doorway; he is a reflection in its glass), NELEH (a paper glows; footnotes orbit), MADA (arms folded, spinner), THE QUIET VOTE · camera off.',
                                "Four vote icons on the board's tiles are already flipped.", 'Egg: the hotel Wi-Fi shows one bar of four.', "f15: the card rides in (live, no freeze): NELEH / READ THE CHARTER. LITERALLY. · FOOTNOTES: ∞"],
  text=[('card', 'NELEH / READ THE CHARTER. LITERALLY. · FOOTNOTES: ∞', '[INVENTED] name card', 15)], sfx=['call connect chime', 'vote-icon ticks ×4'],
  music='LEVERAGE, low (MM-08 E01-S26) · in: the connect', rides='[POV]', assets=['kit.call-grid', 'kit.cards'], standin='callgrid G5 (v2 26.01) + blipCard stand-in', events=6, mode='M')
S('26.02', '26', 30, '[POV·pin]', 'SCREEN-CLOSE', 'SC', 'SCREEN', "POV · the app's own speaker view: ALYI's tile pinned large, the strip of others below", "APP-PUSH · the app's automatic speaker view (in-world zoom; never his click)",
  v2=['26.03'], fv3=['26.03'], change='REFRAME', note='Was the grid with Alyi speaking; now the app pins him.', model='2 beats', script='2 beats', box='typed',
  room='the call · speaker view', chars=['ALYI (in his tile): mouth moving, no sound'], action=["His mouth moves; no sound reaches Mas's tile.", 'The dialogue box above his tile types … and stops (f18).'],
  sfx=['(no voice: nobody on the call is heard)'], music='LEVERAGE', notes=['What the board said happened behind a real door.'], assets=['kit.call-layouts', 'cast.alyi.portrait'],
  face=True, standin="callgrid speaker view: drawTile at the pinned rect + gridLayout strip", events=2, mode='M', entry='the app pushes in from 26.01')
S('26.03', '26', 30, '[POV]', 'SCREEN-CLOSE', 'SC', 'SCREEN', "POV · the laptop screen at the grid's scale, the dialog over his tile", 'STILL',
  v2=['26.04'], fv3=['26.04'], change='RETIME', note='1 bar → 2 beats.', model='2 beats', script='2 beats', room='the call · G5 + dialog',
  action=['f0: a dialog pops up over Mas\'s tile, drawn like the 1993 one but in full colour: OK · Cancel.', 'Cancel is not greyed out.'],
  text=[('ui', 'OK · Cancel', '[INVENTED] UI', 0)], sfx=['dialog pop (chip)'], music='LEVERAGE: the 1-bit flat line on the dialog', assets=['kit.dialog-1993', 'kit.call-grid'],
  standin='callgrid + callDialog (v2 26.04)', events=1, mode='M')
S('26.04', '26', 15, '[ECU]', 'INSERT-EYES', 'ECU', 'ECU-EYES', 'EYE · frontal, letterboxed eyes strip (480x64)', 'STILL',
  v2=['26.04a'], fv3=['26.04a'], change='RETIME', note='1 bar → 1 beat.', model='1 beat', script='1 beat', room='eyes strip', chars=['MAS: eyes only'],
  action=['His pupils move one pixel toward the dialog (f6). Nothing else on him moves.'], music='LEVERAGE', assets=['cast.mas.eyes'], face=True,
  standin='mas-cu drawEyesStrip 0 → −1 at f6', events=1, mode='M')
S('26.05', '26', 30, '[POV]', 'SCREEN-WIDE', 'SW', 'SCREEN', 'POV · the whole grid, the dialog over his tile', 'STILL',
  v2=['26.04b'], fv3=['26.04b'], change='RETIME', note='3 beats → 2: the last step onto Cancel moves into the macro.', model='3 beats', script='3 beats (the whole grid)',
  room='the call · G5 + dialog', action=["An unlit arrow pointer steps in from the board's tiles in whole pixels, one tile a beat (f0, f15), and reaches the dialog's edge."],
  sfx=['pointer steps (tiny ticks)'], music='LEVERAGE', notes=["The unlit arrow belongs to whoever is trying to fire him, never to him or the player."], assets=['kit.dialog-1993', 'kit.call-grid'],
  standin='callgrid + dialog + drawPointer, one held position a beat (v2 26.04b)', events=2, mode='M')
S('26.06', '26', 15, '[POV·macro 2x]', 'SCREEN-MACRO', 'SC', 'SCREEN-MACRO', "POV · integer 2x of the laptop's own pixels on the dialog's Cancel button", 'MACRO · in-world 2x crop of the screen buffer, 1 beat (macro 1 of 2)',
  v2=['26.04c', '26.05'], fv3=['26.05'], change='REFRAME', note="framing-v3's 'close on the dialog' as a screen macro instead of a 2x redraw: no new drawing.",
  model='(in 26.06, 2 beats)', script='2 beats (the click)', room='the call · dialog, 2x', action=['f0: the arrow\'s last step onto Cancel.', 'f12: Cancel shows pressed; the click lands on the cut.'],
  sfx=['(the click is 26.06b f0)'], music='LEVERAGE · hard stop on the click (next frame)', assets=['fx.screen-macro', 'kit.dialog-1993'],
  standin='2x nearest crop of 26.05\'s buffer around the Cancel button', events=2, mode='M', entry='an in-world push from 26.05')
S('26.06b', '26', 30, '[POV]', 'SCREEN-WIDE', 'SW', 'SCREEN', 'POV · back out to the whole grid', 'STILL',
  v2=['26.05'], fv3=['26.05b'], change='SPLIT', note='The drop, the dissolve and the four sliding together, in the silence.', model='(in 26.06)', script='2 beats (the click)',
  room='the call · G5 → G4', action=['f0: Click (dialog_ok_click). DROP-OUT starts: the fan, the Strip, the truck and the score stop together.',
                                     "f0–7: Mas's tile drops out like a puzzle piece, four drawings straight down, coming apart into tokens.", 'f4–23: GLYPH dissolve (20 f; use 2 of 2).', 'f22–29: the four remaining tiles slide together to close the gap.'],
  switches=['f4-23: [GLYPH] dissolve (use 2 of 2)'], drop_out='D6 start (f0): digital silence, no tone, no breath', sfx=['dialog_ok_click (f0)', 'glyph_dissolve', 'then NOTHING'],
  music='none from f0 (D6)', assets=['kit.call-grid', 'engine.fx'], standin='callgrid: tileDrop + GLYPH (v2 26.05)', events=4, mode='M')
S('26.07', '26', 45, '[CU]', 'CLOSE-UP', 'CU', 'CU', 'EYE · 3/4, full frame, the Strip neon behind', 'STILL',
  v2=['26.05a'], fv3=['26.05a'], change='RETIME', note='Quiet beat 1 of 2; 3 beats, +1 FIRING on its second beat.', model='3 beats', script='3 beats',
  room='vegas-suite (neon backdrop)', chars=["MAS: the [CU] drawing (one silent drawing); the one-pixel smile; nothing changes"],
  action=['Nothing on the face changes.', 'f15 (beat 2), still in the silence: the rail types on +1 FIRING.', 'It holds with the face to the cut.'],
  text=[('rail', '+1 FIRING', '[INVENTED] rail', 15)], drop_out='D6 continues', quiet=True, sfx=['(silence)'], music='none', gags=['The still face is the joke; the rail is its punchline.'],
  assets=['cast.mas.cu'], face=True, standin="mas-cu drawMasCU backdrop 'strip'", events=1, mode='I')
S('26.08', '26', 45, '[ECU]', 'INSERT-HANDS', 'ECU', 'ECU-HANDS', 'HIGH · onto the desk: his phone, the laptop\'s corner with the mic icon', 'STILL',
  v2=['26.06'], fv3=['26.06'], change='RETIME', note='2½ bars → 3 beats; the drop-out ran 5 beats, click to buzz.', model='3 beats', script='3 beats',
  room='vegas-suite · desk insert', chars=['MAS: hand only'],
  action=["f0: the phone buzzes and the room's sound comes back with it.", 'f2: the suggested-replies strip lights: [super] [super] [super].', 'f8: his thumb taps the middle one at once, no hover (G04).',
          "In the laptop's corner the call's mic icon is still lit (his tile is gone, his microphone isn't)."],
  text=[('ui', '[super] [super] [super]', '[INVENTED] UI', 2)], drop_out='D6 ends f0 (5 beats after the click)', sfx=['phone table buzz (build)', 'room tone back: fan, Strip', 'text tick (the tap)'],
  music='none', gags=['G04: he always takes the offer. The slip belongs to the interface.'], assets=['cast.mas.hands', 'room.vegas-suite', 'kit.post-ui'], face=True, hand=True,
  standin='inserts-mas drawStripTapInsert (the tap moved to f8)', events=4, mode='M')
S('26.09', '26', 30, '[OTS]', 'OTS', 'OTS', 'OTS', "OTS · over Mas's left shoulder (his silhouette, the neon rim) onto the laptop screen", 'STILL',
  v2=['26.07', '26.08'], fv3=['26.07', '26.08'], change='MERGE', note="3.2's staging (ruling 6): the line and its listeners in one frame; framing-v3's MCU + grid folded. 3 beats → 2: the script's listener's hold is 1 beat (the line ends f17), so the model's third beat was slack.", model='3 beats', script='3 beats',
  room='vegas-suite · desk, the laptop showing the frozen G4', chars=['MAS: foreground silhouette (N0, 1 px neon rim), left, cut by the frame edge', 'The board on the laptop: four tiles'],
  action=['f3: "super." into the still-open mic.', "f10, on the word: the four tiles freeze (Neleh's footnotes stop orbiting, Mada's spinner stops).", "f17–29: the listener's hold, 1 beat (the frozen feed)."],
  lines=[('a4-26-01', 3)], sfx=['voice: mas (dry)'], music='NO music under the line', gags=['Board it to read as four stunned people: it is his feed that froze.'],
  notes=['Pass one shows nobody looked up.'], assets=['fx.ots-shoulder', 'cast.mas.portrait', 'room.vegas-suite', 'kit.call-grid'], face=True,
  standin='shoulderFg(masPortrait) over drawLaptopInsert(screen = callgrid G4 frozen)', events=2, mode='I')
S('26.10', '26', 90, '[W] F1.2', 'WIDE', 'W', 'W', 'EYE · the frosted-glass boardroom door, flat on', 'STILL',
  v2=['26.11', '26.12', '26.13'], fv3=['26.11', '26.12', '26.13'], change='MERGE', note='F1.2: 3 bars → 6 beats.', model='1 bar + 2 beats', script='6 beats',
  room='F1.2 · tpool-door (EARLY-WEB16)', action=["f0–5: the laptop screen full-bleed, Mas's greyed tile still falling in its corner, becomes the start of a render front.", 'f6–44: the front sweeps the frame back to sixteen colours: a frosted-glass door with two shadows behind it, leaning together.',
                                                   'f45–89: the dither settles into wood grain; the grain becomes the next shot\'s desk.'],
  text=[('rail', '2005–08 · TPOOL · (REPORTED)', '[REPORTED]', 0)], switches=['f0-44: render front BASE → [EARLY-WEB16]', 'f45-89: [EARLY-WEB16] → grain → BASE on the cut'],
  sfx=['render_front_sweep'], music='none (F1.2 silent, C39)', notes=['No whisper, no POV rim: (REPORTED) material belongs to the show.', 'The rail shows beats 1–3 and clears before the dither turns.'],
  record=['(REPORTED) rail'], assets=['room.tpool-door', 'engine.fx'], standin='drawTpoolDoor / drawTpoolClose under EARLYWEB16 + renderFront (v2 26.11–26.13)', events=4, mode='F')

# ------------------------------------------------------------------------------------------------ 26A · that night (13 beats)
S('26A.01', '26A', 90, '[ECU]', 'INSERT-HANDS', 'ECU', 'ECU-HANDS', 'HIGH · onto the desk under the cyan key: the tally, his hand, the pen', 'DRIFT · the insert as one layer, 1 px / 8 f toward the marks (11 px); the act\'s one drift',
  v2=['26A.01'], fv3=['26A.01'], change='RETIME', note='2¼ bars → 6 beats.', model='1 bar + 2 beats', script='6 beats', room='darkroom · desk insert', chars=['MAS: hand only'],
  action=['Marks 1 and 2 are there, faint.', 'With the steel clip of the MACROSOFT check pen he carves a third mark, one stroke a beat (f0, 15, 30, 45).', 'f60: he brushes the shavings away with the side of his hand.', 'f72: his thumb comes to rest on mark 3, and only mark 3.'],
  lines=[('a4-26a-vo1', 15)], sfx=['pen clip on wood, one stroke a beat (build)', 'a soft brush of shavings'], music='DARK ROOM, a single felt (MM-08 E01-S26A), thinning to one note under the V.O.',
  notes=['His hand never touches marks 1 and 2, in any episode.', 'The V.O. text band sits on the desk shadow (y 182–203).'], assets=['cast.mas.hands', 'room.darkroom.desk', 'prop.pen', 'prop.tally', 'fx.drift'],
  face=True, hand=True, standin='inserts-mas drawCarveInsert → drawBrushInsert + a whole-pixel offset', events=6, mode='M')
S('26A.02', '26A', 45, '[2S]', 'TWO-SHOT', 'M', '2S', 'EYE · 3/4, the cyan cone: Mas left, the Orb right', 'STILL',
  v2=['26A.02'], fv3=['26A.02'], model='3 beats', script='3 beats', room='darkroom · medium plate', chars=['MAS: medium rig, thumb on mark 3', 'THE ORB: medium, iris stepping'],
  action=['The Orb\'s iris steps along the tally, one mark a beat: 1, 2, 3 (f0, 15, 30), and stops on his thumb.'], sfx=['orb_servo (three ticks)'], music='felt',
  gags=["The Orb is counting. Its look is the only thing that ever touches marks 1 and 2."], assets=['cast.twoshots', 'cast.mas.medium', 'cast.orb', 'room.darkroom.plate'], face=True,
  standin='twoshots drawDark2S + orbTally', events=3)
S('26A.03', '26A', 60, '[ECU·Orb]', 'ECU-ORB', 'ECU', 'ECU-ORB', 'EYE · the Orb\'s iris full frame on a dark pool (a shot OF the witness, never its POV)', 'WHIP-OUT · right → left, f58–59 (whip 1 of 4: the rewind)',
  v2=['26A.06'], fv3=['26A.06'], change='REFRAME', note='Was a boxed [P] (no Orb portrait exists): the iris full frame, drawn procedurally.', model='1 bar', script='4 beats',
  room='darkroom (dark pool)', chars=['THE ORB: iris, r ≈ 84'], action=['f8–14: the iris lifts from his thumb to his face, in held steps: it reads him, not the line.', 'f24: toast rewinding….', 'f39: the rail types on (1 beat after the toast).', 'f58: WHIP right → left into pass one.'],
  text=[('toast', 'rewinding…', '[INVENTED] UI', 24), ('rail', "NOV 17 · EARLIER · THE BOARD'S SIDE", '[V] (side label)', 39)], sfx=['orb_servo', 'tape_spinup reversed (the Rewind)', 'a short air pass under the whip (never a whoosh)'],
  music='out: the Rewind, 1 beat, into sc 27\'s downbeat', notes=['EXIT: the rail names the side.'], assets=['cast.orb', 'fx.whip'], face=True, standin='drawOrb r 84 + orbStep + callToast', events=3, mode='I')

# ------------------------------------------------------------------------------------------------ 27 · pass one: the board's side (the exit)
EXIT = "The exit: no Mas single of any size; screens keep a bezel edge."
S('27.01', '27', 60, '[SCR]', 'SCREEN-WIDE', 'SW', 'SCREEN', "EYE · the board's call on a laptop, bezel and desk edge in frame (the world's view)", 'WHIP-IN · f0–1 (the rewind lands)',
  v2=['27.01'], fv3=['27.01'], change='RETIME', note='1½ bars → 1 bar.', model='1 bar', script='1 bar', box='speaker', room='the call on a laptop · G4 (bezel)',
  chars=['The board in their tiles: NELEH reading, MADA spinner, ALYI\'s reflection looking at his doorway, THE QUIET VOTE black'],
  action=['Noon. Four tiles; the gap where his tile was has already closed.', 'f2: his voice out of the laptop\'s small speaker, tinny; the dialogue box types it, no portrait.', 'Nobody looks up. MADA\'s spinner keeps turning.'],
  lines=[('a4-27-00', 2)], sfx=['laptop_speaker chain, −22 LUFS'], music="PROCEDURE (MM-09 E01-S27a): NELEH's clockwork pizzicato from the downbeat",
  gags=['The board\'s pass is the true one: nobody looked up.'], notes=[EXIT], assets=['kit.call-grid', 'fx.whip'], standin='callgrid G4 in the [SCR] bezel; typed box, no portrait (v2 27.01)', events=2, mode='M')
S('27.02', '27', 30, '[MCU]', 'MCU', 'MCU', 'MCU-F', "EYE · 3/4, NELEH right third facing left; her tile's world full frame, stepped down 2 (soft)", 'STILL',
  v2=[], fv3=['27.01a'], change='NEW', note="framing-v3's catch on a face: she turns a page and doesn't look up.", model='2 beats', script='2 beats', room="NELEH's desk world (nelehTileBg at 480x203), by day",
  chars=['NELEH: frameless, reading the charter; footnotes orbit'], action=["f6: she turns a page of the charter (2 held drawings). She doesn't look up. The call goes on."],
  sfx=['page turn'], music='pizzicato', notes=[EXIT, 'By day: if the helper\'s extension reads boxy on her lit shelves, cast.neleh.tallbust (P3).'],
  assets=['fx.frameless-bust', 'cast.neleh.portrait', 'room.neleh-desk.full', 'cast.neleh.tallbust'], face=True, standin='MCU-F: nelehPortrait over nelehTileBg(480x203) soft 2', events=2)
S('27.03', '27', 30, '[HIGH]', 'ANGLE-HIGH', 'ECU', 'HIGH-TABLE', "OVERHEAD · top-down onto her desk: THE PLAN's blueprint, unfolded, square to frame", 'STILL',
  v2=[], fv3=[], change='NEW', note='The fuse: the blueprint\'s steps tick as the record lands.', model='2 beats', script='2 beats', room="NELEH's desk · overhead",
  action=['1. NOON · VIDEO CALL ticks itself (f4).', 'What the fold hid is right under it: 2. BLOG POST · 3. INTERIM CEO · 4. ______.', 'f14–29: the tick runs on toward step 2.'],
  text=[('blueprint', '1. NOON · VIDEO CALL ✓ · 2. BLOG POST · 3. INTERIM CEO · 4. ______', '[V] steps 1–3; step 4 blank', 4)], sfx=['pencil tick (build)'], music='pizzicato',
  notes=[EXIT, 'Step 4 stays blank: nothing implies a plan past the record.'], assets=['room.table-insert', 'angle.high.neleh-desk'],
  standin="drawTableInsert 'blueprint' + the steps list (stand-in text)", events=2, mode='M')
S('27.04', '27', 90, '[GFX]', 'CARD', 'GFX', 'GFX', 'FLAT · full-screen quote card', 'STILL (record)',
  v2=['26.10'], fv3=['26.10'], change='MOVED', note='From sc 26: step 2 of their plan, on their side.', model='1 bar + 2 beats', script='1 bar + 2 beats',
  room='card', action=['The board\'s blog post, dry.'], text=[('card', '"…not consistently candid in his communications with the board…"', '[V · NOV 17, 2023]', 0)],
  sfx=['card thud (soft)'], music='DRY: nothing 1 bar each side', notes=['No music, V.O. or device within a bar; he is not in this pass to make a tell.'], record=['candor quote card'],
  assets=['kit.cards'], standin='lay.ts quoteCard', events=1, mode='CARD')
S('27.05', '27', 32, '[MCU]', 'MCU', 'MCU', 'MCU-F', 'EYE · 3/4, RIMA right third facing left, under a hard circular spotlight on black', 'STILL',
  v2=['27.03', '27.05b'], fv3=['27.03', '27.05b'], change='REFRAME', note='Was a boxed [P] over the held grid. Cut on the turn: NELEH\'s "Share what?" starts at f28; the cut at f32.',
  model='3 beats', script='3 beats', room="RIMA's spotlight (full-frame pool on black)", chars=['RIMA TAMURI: frameless, jacket perfect'],
  action=['f2: off picture, a pencil tick: step 3.', 'f4: she smooths the jacket; the spotlight doesn\'t move.'], lines=[('a4-27-04', 8)],
  sfx=['pencil tick (build)', 'voice: rima'], music='pizzicato; dry under the line', assets=['fx.frameless-bust', 'cast.rima.portrait', 'kit.spotlight'], face=True,
  standin='MCU-F: rimaSpeakPortrait in spotlight() on N0', events=2)
S('27.05b', '27', 15, '[SCR·2-up]', 'SCREEN-CLOSE', 'SC', 'SCREEN', "EYE · the call's two-up on a laptop (bezel): NELEH's tile left, RIMA's right", 'STILL',
  v2=['27.05c'], fv3=['27.05c'], change='REFRAME', note='The cut lands on NELEH\'s line (it started 4 f before it).', model='1 beat', script='1 beat', room='the call · two-up (bezel)',
  chars=['NELEH (tile): literal, polite', 'RIMA (tile): pleasant'], lines=[('a4-27-23', -4)], sfx=['call filter on NELEH (lighter than the laptop chain), ≈ 2 dB under'],
  music='dry', assets=['kit.call-layouts', 'cast.neleh.portrait', 'cast.rima.portrait'], face=True, standin='gridLayout(2) two-up in the bezel', events=1, mode='M')
S('27.05c', '27', 58, '[MCU]', 'MCU', 'MCU', 'MCU-F', 'EYE · the identical RIMA setup (the repeat is the joke)', 'STILL',
  v2=['27.05b', '27.04'], fv3=['27.05b'], change='REFRAME', note="Her card becomes a plate; the length is the plate's read floor (48 f from f2).", model='3 beats', script='3 beats',
  room="RIMA's spotlight", chars=['RIMA TAMURI: exactly the same'], action=['f0–2: "More. Soon." pre-laps 2 f.', 'f2: PLATE types on as the topper.'],
  lines=[('a4-27-24', -2)], text=[('plate', 'RIMA TAMURI · CEO (WEEKEND EDITION)', '[INVENTED] plate', 2)], music='dry', gags=['Composure as a weapon: the same read, the same frame.'],
  assets=['fx.frameless-bust', 'cast.rima.portrait', 'kit.spotlight', 'kit.plates'], face=True, standin='as 27.05 + a plate', events=2)
S('27.06', '27', 60, '[SCR]', 'SCREEN-WIDE', 'SW', 'SCREEN', "EYE · the board's grid on the laptop (bezel)", 'STILL (record)',
  v2=['27.01a', '27.02'], fv3=['27.01b', '27.02'], change='MERGE', note='BUKAJ\'s toast cut (T1).', model='1 bar', script='1 bar', box='post', room='the call · grid (bezel)',
  action=['f2: toast GERG MOCKBRAN has left.', 'f10: his post arrives under it, green-lit from below.', 'f24–59: keycaps pop out of the bottom like popcorn and rain across the grid.'],
  lines=[('a4-27-01', 10)], text=[('toast', 'GERG MOCKBRAN has left.', '[V]', 2), ('post', '"…I quit."', '[V · NOV 17, 2023]', 10)], sfx=['toast blip', 'keycap_popcorn'],
  music='pizzicato; dry around the post', notes=['Nothing on the blueprint ticks: he wasn\'t on the plan.'], record=['Gerg\'s post'], assets=['kit.call-grid', 'kit.post-ui'],
  standin='callgrid [SCR] + callToast + postChip + keycaps (v2 27.01a/27.02)', events=4, mode='M')
S('27.07', '27', 38, '[W]', 'WIDE', 'W', 'W', 'EYE · reverse, from the back of the all-hands crowd over the tiled heads to the doorway', 'STILL',
  v2=['27.06'], fv3=['27.06'], change='RETIME', note='Cut on the turn (4 f after "coup?").', model='3 beats', script='3 beats', box='typed', room='bullpen · all-hands (a tighter plate)',
  chars=['TILED EMPLOYEES: rows of one held drawing, one hand up', 'ALYI: room scale, in a doorway, half cut off by its frame'], lines=[('a4-27-05', 12)],
  sfx=['crowd room tone'], music='pizzicato', assets=['room.bullpen', 'cast.room-sprites'], standin='rooms-b bullpen all-hands (ALLHANDS_TILES) + drawAlyiStand (v2 27.06)', events=2)
S('27.08', '27', 60, '[MCU·door]', 'MCU-FRAME', 'MCU', 'MCU-FRAME', 'EYE · 3/4, ALYI right third facing left, the doorway jamb and leaf full height in front, cutting him in half', 'STILL (record)',
  v2=['27.07'], fv3=['27.07'], change='REFRAME', note="The window's joke moved into the world: a real doorway.", model='4 beats', script='4 beats', room='bullpen doorway (day), soft behind',
  chars=['ALYI: frameless, half in shadow'], lines=[('a4-27-06', 3)], sfx=['voice: alyi (dry)'], music='NO music under the real line', record=['ALYI [V] line'],
  notes=['Day room: cast.alyi.tallbust (P2); the jamb covers half of him.'], assets=['fx.frameless-bust', 'cast.alyi.portrait', 'kit.doorway-jamb', 'room.bullpen', 'cast.alyi.tallbust'], face=True,
  standin='MCU-FRAME: alyiSpeakPortrait + jamb/leaf rects over the bullpen soft 1', events=1)
S('27.09', '27', 37, '[W]', 'WIDE', 'W', 'W', 'EYE · the 27.07 setup (from the back of the crowd)', 'STILL',
  v2=['27.07a', '27.08'], fv3=['27.07a', '27.08'], change='MERGE', note='The listener (the hand still up) and Alyi\'s exit in one shot.', model='2 beats', script='2 beats', room='bullpen · all-hands',
  action=['The one hand is still up (the listener).', 'f4–16: in the doorway, Alyi steps back out of frame, one whole-pixel step a time.', 'f17–36: the doorway holds empty.'],
  sfx=['(room tone)'], music='pizzicato', assets=['room.bullpen', 'cast.room-sprites'], standin='as 27.07; Alyi steps back in whole pixels', events=3)
S('27.10', '27', 120, '[SCR]', 'SCREEN-CLOSE', 'SC', 'SCREEN', "OVERHEAD · NELEH's phone face-up on her desk beside the blueprint, bezel in frame", 'STILL (record)',
  v2=['26A.03'], fv3=['26A.03'], change='MOVED', note='From 26A: his public record plays on the board\'s side, on NELEH\'s phone. That night.', model='2 bars', script='2 bars', box='post',
  room="NELEH's desk · overhead (night)", action=['f2: his post pops in its own UI, stamped 9:32 PM PT; it holds to the cut (read floor ≈ 112 f).'],
  lines=[('a4-26a-01', 2)], text=[('post', POSTS['a4-26a-01'][1], POSTS['a4-26a-01'][2], 2), ('ui', '9:32 PM PT', '[V]', 2)], sfx=['phone wake'], music='dry',
  record=['the 9:32 post'], notes=[EXIT], assets=['kit.post-ui', 'angle.high.neleh-desk', 'prop.phone'], standin='post-ui stand-in phone on the table overhead', events=1, mode='M')
S('27.11', '27', 30, '[HIGH]', 'ANGLE-HIGH', 'ECU', 'HIGH-TABLE', 'OVERHEAD · the blueprint\'s CEO box, her hand and pen entering from the right', 'STILL (record)',
  v2=[], fv3=[], change='NEW', note="His own real line lands on a prop consequence (replaces the wallet's topper).", model='2 beats', script='2 beats', room="NELEH's desk · overhead",
  chars=["NELEH: hand + pen only"], action=['f8: her pen taps the CEO box once: EQUITY: 0 (HIS TESTIMONY).', 'The equity box beside it is empty; the moth is long gone.'],
  text=[('stamp', 'EQUITY: 0 (HIS TESTIMONY)', '[V]', 0)], sfx=['pen tap on paper'], music='pizzicato', record=['EQUITY: 0 (HIS TESTIMONY)'],
  notes=['The tap points at his own testimony, not a verdict on his post. Fallback: the same insert without her hand.'], assets=['room.table-insert', 'angle.high.neleh-desk', 'cast.neleh.hand'],
  face=True, hand=True, standin="drawTableInsert 'blueprint' + inserts-hands pinch (recoloured) stand-in", events=2, mode='M')
S('27.12', '27', 105, '[SCR]', 'SCREEN-WIDE', 'SW', 'SCREEN', "EYE · the board's grid on the laptop (bezel)", 'STILL (record)',
  v2=['27.09', '27.10'], fv3=['27.09', '27.10'], change='MERGE', note='2 bars → 7 beats; the blue heart gets the macro.', model='2 bars (7 beats + the macro)', script='2 bars', box='post',
  room='the call · grid (bezel)', action=["f0: a heart in the corner of Neleh's tile; f6: ten; f10–40: hundreds of red hearts pour down until the tiles are buried (each a held sprite).",
                                          'f20: the notification scrolls in across them (his eulogy post) and holds its read; it scrolls off by f104.'],
  lines=[('a4-27-07', 20)], text=[('rail', 'NOV 18', '[V]', 0), ('post', POSTS['a4-27-07'][1], POSTS['a4-27-07'][2], 20)], sfx=['heart_gliss, stacking'], music='pizzicato; dry around the post',
  record=['the eulogy post'], notes=[EXIT], assets=['kit.falling-stack', 'kit.call-grid', 'kit.post-ui'], standin='avalanche planPile/drawPile + postChip (v2 27.09/27.10)', events=4, mode='M')
S('27.12b', '27', 15, '[SCR·macro 2x]', 'SCREEN-MACRO', 'SC', 'SCREEN-MACRO', "EYE · integer 2x of the laptop's own pixels on MADA's tile, the bezel corner kept in frame", 'MACRO · in-world 2x crop, 1 beat (macro 2 of 2)',
  v2=['27.09'], fv3=['27.09b'], change='SPLIT', note='framing-v3\'s macro. The post is off the screen before the cut, so no record is cropped.', model='(in 27.12)', script='2 bars',
  room='the call · MADA tile, 2x', chars=['MADA (tile): arms folded, the spinner the only thing sticking out'], action=['f3: exactly one BLUE heart drifts down last and lands on Mada\'s spinner.', 'f3–14: it spins with it, blue, for the beat.'],
  sfx=['a single blue-heart ping (build)'], music='pizzicato', gags=['Exactly one heart is blue.'], assets=['fx.screen-macro', 'kit.falling-stack'], face=True,
  standin='2x nearest crop of 27.12\'s buffer around Mada\'s tile + the bezel corner', events=2, mode='M', entry='an in-world push from 27.12')
BOARD2S = 'boardroom · medium plate, night: the window behind (the Valley, the Rolodex wheel), the table, the phones'
S('27.13', '27', 15, '[2S]', 'TWO-SHOT', 'M', '2S', 'EYE · 3/4, NELEH standing left, MADA seated right, ALYI\'s reflection in the dark window between them', 'STILL',
  v2=['27.11'], fv3=['27.11'], change='RETIME', note='Two-shot first (it places the committee).', model='1 beat', script='1 beat', room=BOARD2S,
  chars=['NELEH: medium, marker in hand', 'MADA: medium, seated, spinner turning', 'ALYI: a reflection in the window', "THE QUIET VOTE: a laptop on a chair, the black tile"],
  action=['The blueprint on the table: steps 1–3 ticked, step 4 a blank line.', 'f0: buzz: every phone on the table steps toward the edge.', 'Egg: a speed-dial wheel the size of a Ferris wheel spins through the Valley.'],
  sfx=['phone table buzz ×n (build), locked to the pizzicato'], music='PROCEDURE: the pizzicato locks to the buzz', assets=['cast.twoshots', 'cast.neleh.medium', 'cast.mada.medium', 'room.boardroom.plate'], face=True,
  standin='twoshots drawBoard2S (phones buzz)', events=3)
S('27.13b', '27', 57, '[MCU]', 'MCU', 'MCU', 'MCU-F', 'EYE · 3/4, NELEH LEFT third facing right (the room\'s line: framing-v3 §2.3); the boardroom soft behind', 'STILL',
  v2=['27.12'], fv3=['27.12'], change='REFRAME', note='Was a boxed [P]. Cut on the turn (5 f tail).', model='4 beats', script='4 beats', room='boardroom (night), stepped down 2',
  chars=['NELEH: frameless (portrait flipped), footnotes orbiting'], action=['f4: the first buzz, with her line.'], lines=[('a4-27-08', 4)], sfx=['phone buzz (build)'], music='pizzicato on the buzz',
  assets=['fx.frameless-bust', 'cast.neleh.portrait', 'room.boardroom.plate'], face=True, standin='MCU-F: nelehPortrait (flipped) over the boardroom plate soft 2 (templates panel 2)', events=2)
S('27.14', '27', 52, '[OTS]', 'OTS', 'OTS', 'OTS', "OTS · over NELEH's right shoulder (her silhouette, the city's rim) onto the dark window: ALYI's reflection", 'STILL',
  v2=['27.12a', '27.12b'], fv3=['27.12a', '27.12b'], change='REFRAME', note='Was two boxed [P]s. "When?" starts in this frame; the cut to the table lands on it.', model='1 bar + 1 beat', script='5 beats',
  room='boardroom window (night), the reflection stepped −1', chars=['NELEH: foreground silhouette, left, cut 35% by the edge', 'ALYI: reflection in the glass, the Valley\'s lights through him'],
  action=['f2: buzz; step. One phone\'s corner hangs over the edge (seen at the table line).'], lines=[('a4-27-09', 2), ('a4-27-10', 48)], sfx=['buzz'], music='pizzicato',
  notes=['A statement and its question in one over-the-shoulder: the pair is the relation (rule 2).'], assets=['fx.ots-shoulder', 'cast.neleh.portrait', 'cast.alyi.reflection', 'room.boardroom.plate'], face=True,
  standin='shoulderFg(nelehPortrait) + the boardroom window + alyiReflection (templates panel 11)', events=2)
S('27.15', '27', 41, '[HIGH]', 'ANGLE-HIGH', 'ECU', 'HIGH-TABLE', 'OVERHEAD · top-down on the walnut: the phones and the table\'s edge', 'STILL',
  v2=['27.13'], fv3=['27.13'], change='REFRAME', note="The committee races the phones: framing-v3's 'phones' overhead.", model='2 beats', script='2 beats', room='boardroom table · overhead',
  action=['f4: buzz; the phones walk, one held step a beat (f4, f19).', 'f30: the first tips off the edge; f36: Clack. Nobody picks it up.'], sfx=['buzz ×2', "a phone's clack off the table (build)"],
  music='pizzicato', assets=['room.table-insert'], standin="drawTableInsert 'prop' + the desk-insert phone ×4 in held steps (composite stand-in)", events=4, mode='M')
S('27.16', '27', 35, '[MCU]', 'MCU', 'MCU', 'MCU-F', 'EYE · 3/4 down, NELEH left third, looking down at the fallen phone', 'STILL',
  v2=['27.14'], fv3=['27.14'], change='REFRAME', note='Was a boxed [P]; cut on "us".', model='3 beats', script='3 beats', room='boardroom (night), stepped down 2', chars=['NELEH: frameless, eyes down'],
  lines=[('a4-27-12', 4)], music='pizzicato', assets=['fx.frameless-bust', 'cast.neleh.portrait', 'room.boardroom.plate'], face=True, standin='MCU-F: nelehPortrait (flipped, look down)', events=1)
S('27.17', '27', 60, '[2S]', 'TWO-SHOT', 'M', '2S', 'EYE · the 27.13 setup: NELEH, MADA, the reflection between them', 'STILL',
  v2=['27.14a', '27.14b'], fv3=['27.14a'], change='MERGE', note='Back to the two-shot for the button.', model='1 bar', script='1 bar', room=BOARD2S,
  action=['f3: the reflection speaks.', "f57–58: Alyi's reflection flickers, there and not there, for two frames, and steadies.", 'From here the rest of the phones go over the edge, one a beat, under the next three shots.'],
  lines=[('a4-27-13', 3)], sfx=['phones clack off one a beat (O.S. from f60)'], music='pizzicato', assets=['cast.twoshots', 'cast.alyi.reflection'], face=True,
  standin='twoshots drawBoard2S (reflection flicker f57-58)', events=3)
S('27.18', '27', 15, '[MCU·PF]', 'MCU', 'MCU', 'MCU-F', 'EYE · 3/4 down, NELEH left third; the boardroom steps down behind her', 'STILL (a lighting move: the fallaway)',
  v2=['27.15'], fv3=['27.15'], change='REFRAME', note='Was a boxed [PF]. Her real face.', model='1 beat', script='1 beat', room='boardroom, stepping down (fallaway)',
  chars=['NELEH: frameless, looking at the blank line'], action=['The room steps down in held steps; she looks at the blank line. It isn\'t a joke.'], sfx=['one clack (O.S.)'], music='pizzicato thins',
  assets=['fx.frameless-bust', 'cast.neleh.portrait'], face=True, standin='MCU-F + softLayer stepping', events=1)
S('27.19', '27', 40, '[HIGH]', 'ANGLE-HIGH', 'ECU', 'HIGH-TABLE', 'OVERHEAD · the blueprint on the table, her hand and marker entering right', 'STILL',
  v2=['27.16'], fv3=['27.16'], change='CARRY', note='Closes the committee block on the grid.', model='2 beats', script='2 beats', room='boardroom table · overhead', chars=['NELEH: hand + marker only'],
  action=['f2: she uncaps the marker.', 'f10–22: she writes one mark on step 4: ?', 'f23–39: the ? holds; one more clack (O.S.).'], text=[('blueprint', '4. ?', '[INVENTED]', 22)],
  sfx=['marker uncap', 'marker squeak', 'clack (O.S.)'], music='pizzicato', assets=['room.table-insert', 'cast.neleh.hand'], face=True, hand=True,
  standin="drawTableInsert 'blueprint' + ? strokes + the hand stand-in", events=3, mode='M')
S('27.20', '27', 30, '[W]', 'WIDE', 'W', 'W', 'HIGH · 3/4 down the whole boardroom table', 'STILL',
  v2=['27.17'], fv3=['27.17'], change='RETIME', note='CUT on the first ring.', model='2 beats', script='2 beats', room='boardroom · wide (night)',
  action=['Every phone gone over the edge.', 'The conference speakerphone dials out on its own: four tones, one per seat (f2, 8, 14, 20).', 'Cut on the first ring (f30).'],
  sfx=["speakerphone tones ×4 (build)"], music='pizzicato out', assets=['room.boardroom', 'cast.room-sprites'], standin='rooms-a boardroom wide (v2 27.17)', events=2)
S('27.21', '27', 30, '[ECU]', 'INSERT-PROP', 'ECU', 'ECU-PROP', 'HIGH · 3/4 down on the lighthouse desk buried in paper', 'STILL',
  v2=['27.18'], fv3=['27.18'], change='CARRY', note='The home room, opened close.', model='2 beats', script='2 beats', room='lighthouse · desk insert (night)',
  action=['The ring carries over the cut.', 'A phone rings on a desk buried in paper; attached to its handset, somehow, is a small throne (it hops on the ring).'],
  text=[('rail', '(REPORTED) · THE BOARD OFFERS MARIO THE JOB, AND A MERGER', '[V as reported]', 0)], sfx=['phone ring (chip)'], music="Mario's quartet (MM-09) in",
  record=['(REPORTED) rail'], assets=['room.lighthouse.desk-insert', 'prop.throne-handset'], standin='lighthouse desk crop + drawThroneHandset lg (v2 27.18)', events=2, mode='M')
S('27.22a', '27', 41, '[MCU]', 'MCU', 'MCU', 'MCU-F', 'EYE · 3/4, MARIO right third facing left; the lamp turning in the window behind (soft)', 'STILL',
  v2=['27.19'], fv3=['27.19'], change='REFRAME', note='Was a boxed [P]. Cut on "thoughts": ADELINA starts 2 f before the cut.', model='2 beats', script='2 beats',
  room='lighthouse (night), stepped down 2', chars=['MARIO: frameless, brick-red, looks at the throne; his finger rises'], lines=[('a4-27-14', 6)], music='quartet',
  assets=['fx.frameless-bust', 'cast.mario.portrait', 'room.lighthouse'], face=True, standin='MCU-F: marioPortraitImg over the lighthouse soft 2', events=2)
S('27.22b', '27', 42, '[W]', 'WIDE', 'W', 'W', "EYE · the lighthouse's one wide", 'STILL',
  v2=['27.20', '27.22', '27.23'], fv3=['27.20', '27.22', '27.23'], change='REFRAME', note='Was a [P2] box. The physical gag belongs to the wide.', model='5 beats', script='5 beats', box='typed',
  room='lighthouse · wide (night)', chars=['ADELINA: room sprite, crossing; brisk, warm', 'MARIO: room sprite'],
  action=['ADELINA crosses and takes the phone out of his hand.', 'f30: Click. The throne falls off the handset (3 drawings, f30–41).', 'f32: on the click, the second phone on the desk rings; f34: MARIO answers it at once ("Hi." pre-laps the cut by 8 f).'],
  lines=[('a4-27-15', -2)], sfx=['handset click', 'throne thunk (build)', 'second phone ring'], music='quartet', gags=['In plain English: no.'], assets=['room.lighthouse', 'cast.room-sprites', 'prop.throne-handset'],
  standin='rooms-b lighthouse + adelina room sprite + throneImg falling', events=5)
S('27.23', '27', 52, '[MCU]', 'MCU', 'MCU', 'MCU-F', 'EYE · the 27.22a setup: MARIO right third; the two rent meters SHARP in the window behind', 'STILL (record)',
  v2=['27.24'], fv3=['27.24'], change='REFRAME', note='Was a boxed [P]. The soft layer keeps the meters sharp (record text never goes soft).', model='4 beats', script='4 beats',
  room='lighthouse (night): the room soft, the window meters sharp', chars=['MARIO: frameless, second phone to his ear'], lines=[('a4-27-16', -8)],
  text=[('meter', 'NOZAMA · UP TO $4B', '[V · SEP 25]', 0), ('meter', 'ELGOOG · UP TO $2B', '[V · OCT 27]', 0)], sfx=['meter whir'], music='quartet',
  record=['rent meters'], assets=['fx.frameless-bust', 'fx.rack', 'cast.mario.portrait', 'prop.rent-meters'], face=True,
  standin='MCU-F with a keep mask on the meters (softLayer keep)', events=2)
S('27.24', '27', 90, '[SCR]', 'SCREEN-CLOSE', 'SC', 'SCREEN', 'HIGH · the lobby security camera\'s own high corner: grainy, bezel and REC chrome', 'STILL (record)',
  v2=['27.26'], fv3=['27.26'], change='RETIME', note='2 bars → 6 beats.', model='1 bar + 2 beats', script='6 beats', box='post', room='lobby · security tile (day)',
  chars=['A familiar figure (MAS, room sprite, too far to read a face) in a GUEST lanyard'], action=['He walks in (whole-pixel steps).', 'f10: his post sits upside-down in the tile\'s corner.'],
  lines=[('a4-27-17', 10)], text=[('rail', 'NOV 19', '[V]', 0), ('post', POSTS['a4-27-17'][1], POSTS['a4-27-17'][2], 10)], sfx=['CCTV hum'], music='dry',
  record=['the badge post'], notes=[EXIT, 'The lanyard is the design Radnus handed the founders at 3:20.'], assets=['room.lobby', 'cast.room-sprites', 'kit.post-ui', 'prop.guest-lanyard'],
  standin='rooms-a drawLobbyCam + mas-stand walk + the post upside-down (v2 27.26)', events=3, mode='M')
S('27.25', '27', 45, '[W]', 'WIDE', 'W', 'W', 'EYE · the boardroom wide (night), the spotlight rig', 'STILL',
  v2=['27.27', '27.28'], fv3=['27.27', '27.28'], change='MERGE', note="TTEMME's card becomes a plate riding the wide.", model='3 beats', script='3 beats', room='boardroom · wide (night)',
  chars=['TTEMME: room sprite, hoodie, headset, hourglass', 'NELEH, MADA: room scale'], action=["f0–8: the spotlight swings off Rima's empty chair onto the new arrival (3 held positions).", 'His nameplate is a sticky note: CEO (TEMP).', 'f10: PLATE rides the wide.'],
  text=[('plate', 'TTEMME · CEO (72 HOURS)', '[INVENTED] plate', 10), ('prop', 'CEO (TEMP)', '[INVENTED]', 0)], sfx=['spotlight clunk'], music='pizzicato', assets=['room.boardroom', 'cast.room-sprites', 'kit.plates'],
  standin='rooms-a boardroom wide (sticky CEO (TEMP), the spot swings) + ttemme room sprite (v2 27.27)', events=3)
S('27.26', '27', 30, '[HIGH]', 'ANGLE-HIGH', 'ECU', 'HIGH-TABLE', 'OVERHEAD · the table: the hourglass', 'STILL',
  v2=['27.30'], fv3=['27.30'], change='RETIME', note='3 beats → 2.', model='2 beats', script='2 beats', room='boardroom table · overhead',
  action=['He sets the hourglass on the table and flips it: three held drawings (f0, 4, 8).', 'Sand begins to fall, one pixel a beat.'], sfx=['hourglass flip (glass on wood)'], music='pizzicato',
  notes=["TTEMME's hand is optional (P3); the flip states read without it."], assets=['room.table-insert', 'prop.hourglass'], standin="drawTableInsert 'prop' + hourglass L flip (v2 27.30)", events=3, mode='M')
S('27.27', '27', 45, '[LOW·desk]', 'DESK-LOW', 'MCU', 'DESK-LOW', 'DESK · table level: the hourglass big on the bottom edge, TTEMME above and behind it, right third', 'RACK · the hourglass (sharp) → TTEMME (sharp) on "Chat", f6–11, 3 held steps (rack 1 of 4)',
  v2=['27.31'], fv3=['27.31'], change='REFRAME', note='Was a boxed [P]. A face and the thing it is about in one frame.', model='3 beats', script='3 beats', room='boardroom (night): the table edge at desk level',
  chars=['TTEMME: frameless, watching the sand; his stream chat scrolls up the frame edge spamming F (egg)'], lines=[('a4-27-19', 8)], sfx=['sand trickle'], music='pizzicato',
  gags=['"Chat… for how long?" gets its laugh on its own.'], assets=['fx.frameless-bust', 'fx.rack', 'cast.ttemme.portrait', 'prop.hourglass.insert'], face=True,
  standin="DESK-LOW: ttemmePortrait + drawChatOverlay; the hourglass 'lg' at 2x nearest (MARKED stand-in)", events=3)
S('27.28', '27', 45, '[2S]', 'TWO-SHOT', 'M', '2S', 'EYE · 3/4, NELEH left, MADA right, the boardroom wall behind them', 'STILL',
  v2=['27.32'], fv3=['27.32'], change='RETIME', note='Hard cut to the door (no whip): Tasya\'s real read starts 4 f into 27.29.', model='3 beats', script='3 beats', room=BOARD2S,
  action=['f0–8: the wall changes colour by one palette step, to MACROSOFT slate.', 'f15: a door appears in it that wasn\'t there; f30: it opens.'],
  text=[('rail', 'NOV 19 · 11:53 PM PT', '[V]', 0)], sfx=['door appear (a soft palette thump)'], music="Tasya's Rhodes, one step, on the door", assets=['cast.twoshots', 'room.boardroom.plate'], face=True,
  standin='twoshots drawBoard2S: the wall to slate, the door 1 → 5', events=3)
S('27.29', '27', 60, '[MCU·door]', 'MCU-FRAME', 'MCU', 'MCU-FRAME', 'EYE · 3/4, TASYA right third facing left, framed by the new doorway (jamb + leaf), slate light behind', 'STILL (record)',
  v2=['27.33'], fv3=['27.33'], change='REFRAME', note='Was a boxed [P].', model='1 bar', script='4 beats', room='the new slate door (night)',
  chars=['TASYA: frameless, warm as ever; key ring jangling; a small sign with an arrow pointing out'], lines=[('a4-27-20', 4)], sfx=['key ring jangle (build)', 'voice: tasya'],
  music='NO music under the real line', record=['TASYA [V] read'], assets=['fx.frameless-bust', 'cast.tasya.portrait', 'kit.doorway-jamb', 'prop.arrow-sign'], face=True,
  standin='MCU-FRAME: tasyaSpeakPortrait + jamb rects + the sign (night: the helper reads)', events=2)
S('27.30', '27', 30, '[HIGH]', 'ANGLE-HIGH', 'ECU', 'HIGH-TABLE', "OVERHEAD · the blueprint on the table; NELEH's hand at the edge by the ?", 'STILL',
  v2=['27.35', '27.36'], fv3=['27.35', '27.36'], change='MERGE', note="The listeners' shot becomes her hand in the overhead (the real read lands on a listener within a beat).", model='2 beats', script='2 beats', box='os',
  room='boardroom table · overhead', chars=['NELEH: hand + capped marker at rest (O.S. voice)'], action=['Steps 1–3 ticked; step 4 blank but for her ?.'],
  lines=[('a4-27-21', 6)], text=[('blueprint', '1 ✓ · 2 ✓ · 3 ✓ · 4. ?', '[V] 1–3', 0)], music='pizzicato, thin', assets=['room.table-insert', 'cast.neleh.hand'], face=True, hand=True,
  standin="drawTableInsert 'blueprint' (3 ticks + ?) + the hand stand-in", events=1, mode='M')
S('27.31', '27', 30, '[MCU]', 'MCU', 'MCU', 'MCU-F', 'EYE · 3/4, MADA right third facing left; the boardroom soft', 'STILL',
  v2=['27.36'], fv3=['27.36b'], change='REFRAME', note="MADA's pass-one \"Good question.\" is cut: the spinner is the non-answer. Pass one ends on his face.", model='2 beats', script='2 beats',
  room='boardroom (night), stepped down 2', chars=['MADA: frameless, arms folded, spinner turning; he doesn\'t answer'], music='out: into the card',
  assets=['fx.frameless-bust', 'cast.mada.portrait', 'room.boardroom.plate'], face=True, standin='MCU-F: madaPortrait + drawSpinner at the new origin', events=1)

# ------------------------------------------------------------------------------------------------ 28 · the card
S('28.01', '28', 60, '[GFX]', 'CARD', 'GFX', 'GFX', 'FLAT · black, cream type, centred', 'STILL', v2=['28.01'], fv3=['28.01'], change='RETIME', note='The extra beat cut.', model='1 bar', script='1 bar',
  room='card', text=[('card', "WHAT THEY DIDN'T KNOW", '[INVENTED] act-out card', 0)], music='OUTS · REVERSAL (MM-09x E01-S28) on the downbeat; a felt F4 rings into sc 29',
  notes=['The door back: the home shot\'s rail names his side.'], assets=['kit.cards'], standin='lay.ts actCard', events=1, mode='CARD')

# ------------------------------------------------------------------------------------------------ 29 · pass two: his side
S('29.01', '29', 45, '[ECU]', 'INSERT-PROP', 'ECU', 'ECU-PROP', 'OVERHEAD · the glass on the dark-room desk from above', 'STILL',
  v2=['29.00'], fv3=['29.00'], change='RETIME', note='2 beats → 3 (the rail\'s read starts here).', model='3 beats', script='3 beats', room='darkroom · desk (the home shot)',
  action=['The water line is one flat row of pixels.'], text=[('rail', 'NOV 20, 2023 · ~2:06 AM PT · HIS SIDE', '[V] (side label)', 0)], music='(the felt F4 from the card)',
  assets=['room.darkroom.desk'], standin='rooms-b drawDarkDesk: the glass (v2 29.00)', events=1, mode='M')
S('29.02', '29', 120, '[ECU]', 'INSERT-HANDS', 'ECU', 'ECU-HANDS', 'HIGH · 3/4 down: his phone face-up beside the glass, his thumb', 'STILL (record)',
  v2=['29.03'], fv3=['29.03'], change='CHANGED', note="MAS'S VERSION and D5 cut: the hearts play straight.", model='2 bars', script='2 bars', room='darkroom · desk insert',
  chars=['MAS: thumb only'], action=["RIMA's post on the phone.", 'His thumb taps a heart on the downbeat (tick); the same post again from another avatar, word for word; eight identical posts stack up the feed, one a beat, and he hearts each on the beat (f0, 15, … 105).'],
  lines=[('a4-29-01', 0)], text=[('post', POSTS['a4-29-01'][1], POSTS['a4-29-01'][2], 0)], sfx=['heart tick ×8 on the beat (build, or post_click)'], music='dry: the ticks are the rhythm',
  record=["RIMA's post"], gags=['Like a man playing a rhythm game he has already beaten. Never 8 → 6 (L7).'], assets=['cast.mas.hands', 'kit.post-ui', 'prop.phone'], face=True, hand=True,
  standin='inserts-mas drawPhone29Timeline (the true shot only)', events=8, mode='M')
S('29.03', '29', 60, '[2S]', 'TWO-SHOT', 'M', '2S', 'EYE · 3/4, Mas left, the Orb right; the lanyard square beside the glass', 'STILL',
  v2=['29.04'], fv3=['29.04'], change='CARRY', note="The bar is the clearance after the real post.", model='1 bar', script='1 bar', room='darkroom · medium plate',
  chars=['MAS: medium, hand by the phone', 'THE ORB: iris following every tap'], action=['f30 (beat 3): the iris steps off the phone onto the GUEST lanyard, and stays.'], sfx=['orb_servo'], music='dry',
  assets=['cast.twoshots', 'cast.mas.medium', 'cast.orb', 'prop.guest-lanyard'], face=True, standin='twoshots drawDark2S + orbToLanyard', events=2)
S('29.04', '29', 60, '[ECU·Orb]', 'ECU-ORB', 'ECU', 'ECU-ORB', "EYE · the Orb's iris full frame, its look on the lanyard (off frame)", 'STILL',
  v2=['29.10'], fv3=['29.10'], change='REFRAME', note='Was a boxed [P]. A cut-in on the Orb from the two-shot.', model='1 bar', script='4 beats', room='darkroom (dark pool)', chars=['THE ORB: iris, r ≈ 84, still'],
  action=['The iris holds on the lanyard. It never hears the line.'], lines=[('a4-29-vo2', 0)], music='DARK ROOM, one felt line (MM-10 E01-S29a), from here', notes=['The V.O. band sits on the black under the iris.'],
  assets=['cast.orb'], face=True, standin='drawOrb r 84, look = lanyard', events=1, entry='a cut-in from 29.03 on the Orb')
S('29.05', '29', 45, '[MCU]', 'MCU', 'MCU', 'MCU-F', "EYE · 3/4 turned toward the Orb, MAS left third; the Orb soft at his far shoulder", 'RACK · after the line, Mas → the Orb (f18–23, 3 held steps): Mas soft, the Orb sharp (rack 2 of 4)',
  v2=['29.10a'], fv3=['29.10a'], change='REFRAME', note='Was a [2S]. HOLD 1 beat after the rack.', model='3 beats', script='3 beats', room='darkroom (night), stepped down 2',
  chars=['MAS: frameless, look toward the Orb', 'THE ORB: soft, then sharp; it doesn\'t look away'], lines=[('a4-29-03', 2)], music='felt, a shade under', gags=['The one true word.'],
  assets=['fx.frameless-bust', 'fx.rack', 'cast.mas.portrait', 'cast.orb'], face=True, standin='MCU-F: masPortrait (monitor light) + drawOrb soft layer; the prototype rack (templates 6/7)', events=2)
S('29.06', '29', 60, '[POV]', 'SCREEN-CLOSE', 'SC', 'SCREEN', 'POV · the monitor full-bleed: a counter', 'STILL (record)', v2=['29.05'], fv3=['29.05'], change='RETIME', model='1 bar', script='1 bar',
  room='his monitor', action=['The counter rolls like launch night\'s odometer: 505 · 650 · 700 · 745 / 770.', 'At 745 it stops with a clunk we recognise.'], text=[('counter', '505 · 650 · 700 · 745 / 770', '[V]', 0)],
  sfx=['odometer_ratchet'], music='a Build cell', record=['the counter'], assets=['prop.odometer', 'kit.falling-stack'], standin='avalanche odometer + odoRoll', events=4, mode='M')
S('29.07', '29', 135, '[GFX]', 'CARD', 'GFX', 'GFX', 'FLAT · full-screen quote card, the count in its corner', 'STILL (record)', v2=['29.06'], fv3=['29.06'], change='RETIME', note='3 bars → 2 bars + 1 beat.',
  model='2 bars + 1 beat', script='2 bars + 1 beat', room='card', text=[('card', '"…unable to work for or with people that lack competence, judgment and care for our mission and employees"', '[V · NOV 20, 2023]', 0), ('counter', '745 / 770', '[V]', 0)],
  music='dry', record=['the letter card'], assets=['kit.cards'], standin='lay.ts quoteCard + the counter corner', events=1, mode='CARD')
S('29.08', '29', 45, '[POV]', 'SCREEN-WIDE', 'SW', 'SCREEN', 'POV · the monitor full-bleed: the signature list', 'STILL (record)', v2=['29.07'], fv3=['29.07'], change='RETIME', model='3 beats', script='3 beats',
  room='his monitor', action=['The list scrolls; it stops for 2 beats on one name (f15–44).'], text=[('list', 'ALYI (REPORTED)', '[REPORTED]', 15)], music='dry', record=['ALYI (REPORTED)'],
  notes=['Generic, unidentifiable rows.'], assets=['kit.post-ui'], standin='the signature-list stand-in (v2 29.07)', events=2, mode='M')
S('29.09', '29', 45, '[ECU·Orb]', 'ECU-ORB', 'ECU', 'ECU-ORB', "EYE · the Orb's iris full frame", 'STILL', v2=['29.07a'], fv3=['29.07a'], change='REFRAME', note='Was a boxed [P]. The Orb\'s beat: no V.O., no Mas tell on (REPORTED) material.',
  model='3 beats', script='3 beats', room='darkroom (dark pool)', chars=['THE ORB: iris'], action=['The iris goes to the name (f0), to Alyi\'s thumbnail in the monitor corner (f15), back to the name (f30).', 'Chime.'],
  sfx=['orb chime'], music='dry', assets=['cast.orb'], face=True, standin='drawOrb r 84 + orbStep ×3', events=3)
S('29.10', '29', 75, '[2S]', 'TWO-SHOT', 'M', '2S', 'EYE · 3/4, the dark-room desk, the rack slot between Mas and the Orb', 'STILL (record)', v2=['29.08'], fv3=['29.08'], change='RETIME', note='Pure record: no V.O., no tell, no look from him.',
  model='1 bar + 1 beat', script='5 beats', room='darkroom · medium plate', chars=['MAS: medium, still', 'THE ORB'],
  action=['DELIVERY: the rack slot whirs and ejects a giant check, tray-first, across the desk between them.', 'Stamped across the middle in red: VOID IF CEO MISSING.', 'Eggs on the back (zero read load).'],
  text=[('check', 'EVIRHT · TENDER OFFER @ ~$86B VALUATION', '[V/K · re-verify before lock]', 10), ('stamp', 'VOID IF CEO MISSING', '[INVENTED]', 30)], sfx=['rack slot whir (build)', 'tray slide'], music='dry',
  record=['the check'], assets=['cast.twoshots', 'prop.check-evirht'], face=True, standin='twoshots drawDark2S tray 1 → 4 (the plate\'s own check)', events=3)
GERG_ROOM = "darkroom (night): the monitor's green + his cyan"
S('29.11a', '29', 21, '[POV·tile]', 'SCREEN-CLOSE', 'SC', 'SCREEN', 'POV · his monitor: a video tile opening big enough to act in', 'STILL',
  v2=['29.11'], fv3=['29.11'], change='RETIME', note='Cut on "Compil-": MAS cuts in 3 f before the cut.', model='2 beats', script='2 beats', room="his monitor · Gerg's tile",
  chars=['GERG: on the monitor, laptop open, typing, the green glow under his chin'], action=['f0–5: the tile opens in 3 held steps.'], lines=[('a4-29-04', 6)],
  sfx=['keys (key_tap_soft_*)'], music="the Build: Gerg's chip arpeggio over his keys", assets=['cast.gerg.medium-tile'], face=True, standin='gerg-medium drawGergMediumPOV (3 held steps)', events=2, mode='M')
S('29.11b', '29', 33, '[MCU]', 'MCU', 'MCU', 'MCU-F', 'EYE · 3/4 to camera-left (facing his monitor), MAS left third; the room soft', 'STILL',
  v2=['29.11a'], fv3=['29.11a'], change='REFRAME', note='Was a boxed [P]. The cut lands on his line.', model='2 beats', script='2 beats', room=GERG_ROOM, chars=['MAS: frameless, monitor light'],
  lines=[('a4-29-05', -3)], sfx=["Gerg's keys continue under it"], music='the Build', assets=['fx.frameless-bust', 'cast.mas.portrait', 'room.darkroom.plate'], face=True,
  standin='MCU-F: masPortrait (monitor) over the dark plate soft 2 (templates panel 1)', events=1)
S('29.12', '29', 50, '[POV·tile]', 'SCREEN-CLOSE', 'SC', 'SCREEN', "POV · Gerg's tile filling half the frame", 'STILL', v2=['29.11b'], fv3=['29.11b'], change='RETIME', model='3 beats', script='3 beats',
  room="his monitor · Gerg's tile (half frame)", chars=['GERG: sunny, literal, typing'], lines=[('a4-29-06', 2)], sfx=['keys'], music='the Build', assets=['cast.gerg.medium-tile', 'kit.call-layouts'], face=True,
  standin='drawGergMediumPOV at the half-frame rect', events=1, mode='M')
S('29.13', '29', 15, '[MCU·PF]', 'MCU', 'MCU', 'MCU-F', 'EYE · the 29.11b setup; the room falls away to the green + his cyan', 'STILL (a lighting move: the fallaway)',
  v2=['29.12q'], fv3=['29.12q'], change='REFRAME', note='QUIET BEAT 2 of 2 (3 beats): face, tile, face.', model='1 beat', script='1 beat', room=GERG_ROOM, chars=['MAS: watching Gerg type'],
  quiet=True, sfx=['keycaps click'], music='none: the Build stops', assets=['fx.frameless-bust', 'cast.mas.portrait'], face=True, standin='MCU-F + softLayer stepping', events=1)
S('29.14', '29', 15, '[POV]', 'SCREEN-CLOSE', 'SC', 'SCREEN', "POV · Gerg's tile fills the frame (the app's layout)", "APP-PUSH · the tile fills the frame",
  v2=['29.11c'], fv3=['29.11c'], change='CARRY', note='His real face.', model='1 beat', script='1 beat', room="his monitor · Gerg's tile (full)", chars=['GERG: glances up into his camera, at Mas'],
  quiet=True, sfx=['keys stop'], music='none', assets=['cast.gerg.medium-tile'], face=True, standin='swaps-act4 drawGergTileWide (eyes up)', events=1, mode='M', entry='the app fills the frame with his tile')
S('29.15', '29', 15, '[MCU·PF]', 'MCU', 'MCU', 'MCU-F', 'EYE · the 29.13 setup; his look swaps from the monitor toward the lens', 'STILL', v2=['29.12r'], fv3=['29.12r'], change='REFRAME', note='Was a boxed [PF].', model='1 beat', script='1 beat',
  room=GERG_ROOM, chars=['MAS: looks back; the green on him flickers (Gerg typing again)'], quiet=True, sfx=['keys resume'], music='none', assets=['fx.frameless-bust', 'cast.mas.portrait'], face=True, standin='MCU-F, look param', events=1)
S('29.16', '29', 102, '[2S]', 'TWO-SHOT', 'M', '2S', 'EYE · 3/4, the whole back wall of the dark room: Mas left, the Orb, the wall with its shadowed door right', 'STILL',
  v2=['29.12'], fv3=['29.12'], change='RETIME', note='The cut falls inside "welcome" (f102).', model='1 bar + 3 beats', script='7 beats', box='os', room='darkroom · medium plate (the back wall)',
  chars=['MAS: medium, still', 'THE ORB'], action=['On "asked" (≈ f40) a slate-blue door takes its first held step up out of the shadow (steps f40, 55, 70), a key already in its lock.', "It is the door the board watched open at 11:53, now in his wall."],
  lines=[('a4-29-vo3', 0), ('a4-29-07', 75)], sfx=['door steps (palette thumps) ×3', 'voice: tasya O.S., warm'], music='NO music under the D8 line or "Everyone is welcome." (R16)',
  notes=['Log the word frame of "asked" (the door\'s first step).'], assets=['cast.twoshots', 'room.darkroom.plate'], face=True, standin='twoshots drawDark2S: the plate door 1 → 3 → 4 (v2 29.12)', events=4)
S('29.17', '29', 49, '[MCU]', 'MCU', 'MCU', 'MCU-F', 'EYE · 3/4 to camera-left, MAS left third, not turning; the slate door soft over his right shoulder', 'RACK · after the line, Mas → the door (f24–29, 3 held steps): the door sharp, Mas soft (rack 3 of 4)',
  v2=['29.13'], fv3=['29.13'], change='REFRAME', note='Was a boxed [P]. Closes the Gerg block on the grid.', model='4 beats', script='4 beats', room='darkroom (night), the door in the wall',
  chars=['MAS: frameless, at once, blank surface'], lines=[('a4-29-08', -2)], music='none, then the band comes in on 29.18', assets=['fx.frameless-bust', 'fx.rack', 'cast.mas.portrait', 'room.darkroom.plate'], face=True,
  standin='MCU-F + the plate door as the rack layer', events=2)
AVA = "THE TILE AVALANCHE (S3): fast-cut on the beat under SET-PIECE SWING (MM-10 E01-S29b, 16 → 8 bars), the episode's one full band; every tile lands with a held thock (build). He has stopped narrating."
S('29.18', '29', 30, '[POV·tile]', 'SCREEN-CLOSE', 'SC', 'SCREEN', "POV · the monitor full-bleed: the board's grid, one employee tile at the top edge", 'STILL', v2=['29.14'], fv3=['29.14'], change='SPLIT', model='2 beats', script='phrase 1 (a cut every 2 beats)',
  room='his monitor · the board grid', action=['One employee tile appears at the top edge: a face in a square.'], sfx=['thock'], music='SWING · in: the first tile', notes=[AVA], assets=['kit.falling-stack', 'kit.call-grid'],
  standin='avalanche planGridStack / drawGridStack', events=2, mode='S-rep')
S('29.19', '29', 30, '[POV]', 'SCREEN-WIDE', 'SW', 'SCREEN', 'POV · the monitor full-bleed', 'STILL', v2=['29.14'], fv3=['29.14'], change='SPLIT', model='2 beats', script='phrase 1', room='his monitor', action=['Ten.'],
  sfx=['thock ×10'], music='SWING', assets=['kit.falling-stack'], standin='drawGridStack', events=2, mode='S-rep')
S('29.20', '29', 30, '[OTS]', 'OTS', 'OTS', 'OTS', "OTS · over Mas's left shoulder (silhouette, the monitor's light as his rim) onto the monitor across the dark room", 'STILL',
  v2=['29.14'], fv3=['29.14'], change='REFRAME', note="BOARD CALL: the scripted [POV] 'hundreds' becomes an OTS so the avalanche has one frame of scale with him in it; it cuts in to 29.21 on the same axis. Fallback: the scripted [POV].",
  model='2 beats', script='phrase 1 ([POV])', room='darkroom · medium plate, the monitor filled by the stack', chars=['MAS: foreground silhouette, left'],
  action=['Hundreds, each a held drawing, stacking the way puzzle pieces stack; each landing steps the room\'s light.'], sfx=['thock ×n'], music='SWING',
  assets=['fx.ots-shoulder', 'cast.mas.portrait', 'room.darkroom.plate', 'kit.call-layouts', 'kit.falling-stack'], standin='shoulderFg(masPortrait) + the dark plate; the stack laid into the DPLATE screen rect', events=3, mode='S-rep')
S('29.21', '29', 30, '[MCU·PF]', 'MCU', 'MCU', 'MCU-F', 'EYE · 3/4 to camera-left, MAS left third, the monitor off frame left lighting him', 'STILL', v2=['29.14'], fv3=['29.14b'], change='SPLIT', note='A face inside the set-piece.',
  model='2 beats', script='phrase 1', room='darkroom, stepped down', chars=['MAS: watching, blank'], action=["Each landing steps the room's light, never his face."], music='SWING',
  assets=['fx.frameless-bust', 'cast.mas.portrait'], face=True, standin='MCU-F; the room layer steps per landing', events=2, mode='S-rep', entry='a cut-in from 29.20 on the same axis')
S('29.22', '29', 30, '[POV]', 'SCREEN-WIDE', 'SW', 'SCREEN', 'POV · the monitor full-bleed', 'STILL', v2=['29.14'], fv3=['29.14c'], change='SPLIT', model='2 beats', script='phrase 2', room='his monitor',
  action=["The stack presses down on the board's row."], music='SWING', assets=['kit.falling-stack'], standin='drawGridStack + shove', events=2, mode='S-rep')
S('29.23', '29', 45, '[POV·half]', 'SCREEN-CLOSE', 'SC', 'SCREEN', 'POV · half-frame tile', 'STILL', v2=['29.15'], fv3=['29.15'], change='RETIME', model='3 beats', script='phrase 2 (3 beats)', room='his monitor · ALYI tile, half frame',
  chars=["ALYI (tile)"], action=["ALYI's tile is shoved sideways; for the one beat it resists it fills half the frame (f10–24); then it slides off the edge."], music='SWING',
  assets=['kit.falling-stack', 'kit.call-layouts'], face=True, standin='drawTile at the half rect + shove', events=3, mode='S-rep')
S('29.24', '29', 45, '[POV·half]', 'SCREEN-CLOSE', 'SC', 'SCREEN', 'POV · half-frame tile', 'STILL', v2=['29.16'], fv3=['29.16'], change='RETIME', model='3 beats', script='phrase 2 (3 beats)', room='his monitor · NELEH tile, half frame',
  chars=['NELEH (tile)'], action=["NELEH's tile follows, her footnotes scattering like sparks.", 'On "char" (f37) the tile leaves the frame: she\'s gone.'], lines=[('a4-29-09', 8)], sfx=['footnote scatter'], music='SWING (her line over it)',
  assets=['kit.falling-stack', 'kit.call-layouts', 'cast.neleh.portrait'], face=True, standin='drawTile half + scatter', events=3, mode='S-rep')
S('29.25', '29', 30, '[POV]', 'SCREEN-WIDE', 'SW', 'SCREEN', 'POV · the monitor full-bleed', 'STILL', v2=['29.17'], fv3=['29.17'], change='SPLIT', model='2 beats', script='phrase 3', room='his monitor',
  action=["THE QUIET VOTE's black tile is pushed out without a sound."], sfx=['(no thock for this one)'], music='SWING', assets=['kit.falling-stack'], standin='drawGridStack', events=2, mode='S-rep')
S('29.26', '29', 30, '[POV]', 'SCREEN-WIDE', 'SW', 'SCREEN', 'POV · the monitor full-bleed', 'STILL', v2=['29.17'], fv3=['29.17'], change='SPLIT', model='2 beats', script='phrase 3', room='his monitor',
  action=['The employee tiles keep coming: the whole screen is faces now, 745 of them, with one gap left in the bottom row.'], music='SWING', assets=['kit.falling-stack'], standin='drawGridStack', events=2, mode='S-rep')
S('29.27', '29', 30, '[ECU]', 'INSERT-PROP', 'ECU', 'ECU-PROP', 'OVERHEAD · the glass on the desk (the 29.01 plate), in the monitor\'s flicker', 'STILL', v2=['29.17'], fv3=['29.17b'], change='SPLIT', model='2 beats', script='phrase 3',
  room='darkroom · desk', action=['Its water line flat while the screen shakes.'], music='SWING', gags=['The glass that never ripples.'], assets=['room.darkroom.desk'], standin='drawDarkDesk glass + a flicker', events=1, mode='S-rep')
S('29.28', '29', 30, '[MCU·PF]', 'MCU', 'MCU', 'MCU-F', 'EYE · 3/4 to camera-left, MAS left third; the room stepped down until the small faces are its only light', 'STILL', v2=['29.17a'], fv3=['29.17a'], change='REFRAME', note='Was a boxed [PF].',
  model='2 beats', script='phrase 3', room='darkroom, stepped down', chars=['MAS: watching the gap'], music='SWING', assets=['fx.frameless-bust', 'cast.mas.portrait'], face=True, standin='MCU-F + softLayer', events=1, mode='S-rep')
S('29.29', '29', 60, '[POV·half]', 'SCREEN-CLOSE', 'SC', 'SCREEN', 'POV · half-frame tile', 'STILL', v2=['29.18'], fv3=['29.18'], change='RETIME', model='1 bar', script='phrase 4 (4 beats)', room='his monitor · MADA tile, half frame',
  chars=['MADA (tile): arms folded, spinner turning'], action=['In the gap is MADA\'s tile, wedged in. Every tile around him presses. He does not move.', 'f45–59: the frame holds on him, half-frame, 1 beat (his real face).'],
  music='SWING', gags=['The first time Mas has watched someone else be as still as he is.'], assets=['kit.falling-stack', 'kit.call-layouts', 'cast.mada.portrait'], face=True,
  standin='avalanche + mada drawMadaTile at the half rect (v2 29.18)', events=2, mode='S-rep')
S('29.30', '29', 60, '[POV·half]', 'SCREEN-CLOSE', 'SC', 'SCREEN', 'POV · the same half-frame tile', 'STILL', v2=['29.18', '29.19', '29.20'], fv3=['29.19', '29.20'], change='REFRAME', note='His name card becomes his tile\'s own label (call UI: nothing freezes).',
  model='1 bar', script='phrase 4 (4 beats)', room='his monitor · MADA tile', action=['f0, on the downbeat: his tile\'s label flips (3 held steps); the band stops dead on it.', 'The label holds to the cut (read floor ≈ 61 f).'],
  text=[('ui', 'MADA · LAST FIRER STANDING · ANSWERS GIVEN: 0', '[INVENTED] tile label', 0)], music='SWING · a dead stop on the label (f0)', gags=['The stat is the joke.'],
  assets=['kit.call-label', 'kit.falling-stack'], face=True, standin='drawTile label flip', events=2, mode='S-rep')

# ------------------------------------------------------------------------------------------------ 30 · the return
S('30.01', '30', 150, '[P2] BOX', 'BOX', 'BOX', 'BOX', 'EYE · the back wall: two windows over the held bullpen, MAS left, ALYI right in the conference-door gap', 'STILL (record)',
  v2=['30.01'], fv3=['30.01'], change='RETIME', note="THE ACT'S ONE DELIBERATE BOX (1 of 2 allowed): two men in two boxes that don't touch; the hearts cross the gap. Logged BOX.",
  model='2 bars + 2 beats', script='10 beats', room='bullpen · back wall (day), held', chars=['MAS (left window): face doesn\'t change', "ALYI (right window, cut off by the door frame): looks up at the hearts, doesn't step out"],
  action=['f6: ALYI reads his post from the doorway; one violin under it.', 'f99, f112, f128 (off the grid, at the post\'s own pace): three red hearts rise out of Mas\'s window; the violin stops dead on the first.',
          "They cross the gap and hang at the edge of Alyi's window.", 'f134: Alyi looks up at them. HOLD 1 beat, room tone (his real face).', 'f140: the yellowed note on the door frame flutters: IOU: 20% COMPUTE (egg).'],
  lines=[('a4-30-01', 6)], text=[('prop', 'IOU: 20% COMPUTE', '[V] egg (Jul 5, 2023 pledge)', 140)], sfx=['heart_gliss ×3, off the grid', 'room tone'], music='STRAIGHT: one violin (MM-11 E01-S30a / temp e01-s30a-the-door) under the post only, stopped dead on the first heart',
  record=["ALYI's post"], gags=['The first frame in the act that holds Mas and the man who fired him.'], notes=['Reason on the board: the boxes are the point (framing-v3 §4).'],
  assets=['cast.twoshots'], face=True, standin='twoshots drawDoorwayP2 (hearts re-timed to f99/112/128, Alyi looks up f134, IOU f140)', events=6)
S('30.03', '30', 150, '[W]', 'WIDE', 'W', 'W', 'EYE · the bullpen wide, TASYA mid-floor', 'STILL (record)', v2=['30.04', '30.05', '30.06', '30.07'], fv3=['30.05', '30.06', '30.07'], change='MERGE',
  note="3.2's staging (ruling 6): one still wide, because a real line plays whole on one shot; framing-v3's three-shot split is not used.", model='2 bars + 2 beats', script='S2, 10 beats', box='typed',
  room='bullpen · wide (day), the landlord remap', chars=['TASYA: room sprite, hands clasped, delighted', 'EMPLOYEES: coats on, packed boxes on every desk', 'MAS: at his end desk'],
  action=['f15: TASYA\'s line.', 'On "below" (≈ f24) the floor steps to MACROSOFT slate in three held palette steps, spreading from his feet.', 'On "above" (≈ f45) the ceiling does the same; on "around" (≈ f66) the walls follow.',
          'f85: the whole bullpen is Tasya-blue; every employee, coat on and box in arms, is standing on him.', 'f110: his key ring jangles once, from inside the wall.'],
  lines=[('a4-30-02', 15)], sfx=['palette-step thump ×3 on below / above / around', 'key ring jangle (build)'], music="Tasya's Rhodes floor after her line (from f86)", record=['TASYA [V/K] line'],
  notes=['Log the word frames of below / above / around (each starts a remap step).'], assets=['room.bullpen', 'cast.room-sprites'], standin='rooms-b bullpenLandlord (3 held steps on the word) + tasya room sprite', events=6, mode='S-rep')
S('30.06', '30', 23, '[MCU·PF]', 'MCU', 'MCU', 'MCU-F', 'EYE · 3/4, eyes down: MAS left third at his desk looking at the floor; the slate bullpen soft', 'STILL',
  v2=['30.08'], fv3=['30.08'], change='REFRAME', note='Was a boxed [PF]. Cut on "Hello." (it starts 2 f before the cut).', model='2 beats', script='2 beats', room='bullpen (slate, day), stepped down',
  chars=['MAS: frameless, the look-down swap (masLookDown)'], lines=[('a4-30-03', 8)], music='Rhodes floor', notes=['Day room: cast.mas.tallbust (P1), including the look-down variant.'],
  assets=['fx.frameless-bust', 'cast.mas.lookdown', 'cast.mas.tallbust'], face=True, standin='MCU-F: masLookDown (warm) over the slate bullpen soft (tall-bust stand-in)', events=1)
S('30.06b', '30', 22, '[HIGH]', 'ANGLE-HIGH', 'SC', 'HIGH-FLOOR', 'OVERHEAD · his eyeline: the slate floor from above, his shoe tips at the top edge', 'STILL', v2=['30.08'], fv3=['30.08b'], change='SPLIT', note='The reverse is the floor. (Logged screen-close: a floor POV.)',
  model='1 beat', script='1 beat', box='os', room='bullpen floor · top-down', action=['The floor is Tasya.'], lines=[('a4-30-04', -2)], text=[], music='Rhodes floor',
  assets=['angle.high.bullpen-floor'], standin='crop of the slate floor band + shoe tips (stand-in)', events=1, mode='I')
S('30.07', '30', 45, '[M]', 'MEDIUM', 'M', 'M', 'EYE · 3/4, MADA right, seated at the burning table', 'WHIP-OUT · to the door on the bang, f43–44 (whip 2 of 4)',
  v2=['30.09'], fv3=['30.09'], change='CARRY', model='3 beats', script='3 beats', room='boardroom · medium plate (night), fires', chars=['MADA: medium, perfectly still, in the only chair that isn\'t burning'],
  action=['Small cartoon fires burn around him: on the table, on a chair, on a nameplate. Nobody has mentioned them.', 'f43: the door bangs: WHIP.'],
  text=[('rail', 'NOV 21, 2023 · ~10 PM PT', '[V]', 0)], sfx=['fire crackle (small)', 'flame_whoomph', 'door bang (f43)'], music='none: the calm-off plays in silence under its own chaos',
  assets=['cast.twoshots', 'cast.mada.medium', 'prop.fires', 'fx.whip'], face=True, standin='twoshots drawMadaM', events=3)
S('30.08', '30', 30, '[W]', 'WIDE', 'W', 'W', 'EYE · the boardroom wide from the table end, the door right', 'WHIP-IN · f0–1', v2=['30.10'], fv3=['30.10'], change='RETIME', model='2 beats', script='2 beats',
  room='boardroom · wide (night), fires', chars=['TERB: room sprite, crisp shirtsleeves, the extinguisher held like a briefcase'], action=['The door bangs open (the room shakes 1 px); TERB comes in.', "f20: a fire marshal's helmet appears on him, only now."],
  sfx=['door bang', 'helmet pop'], music='none', assets=['room.boardroom', 'cast.room-sprites', 'fx.whip'], standin='rooms-a boardroom wide (FIRES_SC30, SHAKE_DOOR) + terb walk-in (v2 30.10)', events=3)
S('30.09', '30', 60, 'CARD (full freeze) on [W]', 'WIDE', 'W', 'CARD-RIDE', 'EYE · the 30.08 wide, frozen', 'STILL (freeze)', v2=['30.11'], fv3=['30.11'], change='RETIME', note='The card logs as the wide it rides.',
  model='1 bar', script='1 bar', room='boardroom · wide, 2-tone freeze', chars=['MAS: in colour through the freeze, room sprite'], action=['f0: FULL FREEZE; the card.', "f24–48: Mas walks past in colour and pulls the pin from Terb's extinguisher."],
  text=[('card', 'TERB / CHAIRS BOARDS ON FIRE · EXTINGUISHERS: 1', '[INVENTED] name card', 0)], sfx=['freeze_hit_F', 'footsteps soft', 'the pin (build)'], music='none', rides='[W]',
  switches=['f0-59: [2-TONE FREEZE] (Mas never freezes)'], assets=['room.boardroom', 'cast.room-sprites', 'kit.cards', 'engine.fx'], standin='FULL FREEZE + mas-stand walk → reach → pocket + blipCard (v2 30.11)', events=4)
S('30.10', '30', 30, '[ECU]', 'INSERT-HANDS', 'ECU', 'ECU-PROP', 'EYE · the pin in his fingers, the tamper tag readable', 'STILL', v2=['30.12'], fv3=['30.12'], change='CARRY', model='2 beats', script='2 beats',
  room='insert', chars=['MAS: fingers only'], action=['DO NOT REMOVE.', 'f20: he pockets it (business 2 of 2).'], text=[('prop', 'DO NOT REMOVE', '[INVENTED]', 0)], sfx=['pin clink'], music='none',
  assets=['prop.extinguisher', 'cast.mas.hand.pin'], face=True, hand=True, standin='terb drawPinTag (+ fingers: CHECK)', events=2, mode='M')
FIRES = 'boardroom (night), the fires soft behind'
S('30.11a', '30', 36, '[MCU]', 'MCU', 'MCU', 'MCU-F', 'EYE · 3/4, TERB right third facing left, the fires soft behind', 'STILL', v2=['30.13'], fv3=['30.13'], change='REFRAME', note='Was a boxed [P]. The room unfreezes.',
  model='2 beats', script='2 beats', room=FIRES, chars=['TERB: frameless, procedural, unbothered'], lines=[('a4-30-05', 3)], music='none', assets=['fx.frameless-bust', 'cast.terb.portrait', 'room.boardroom.plate', 'prop.fires'], face=True,
  standin='MCU-F: terbPortrait over the fires plate soft 2', events=1)
S('30.11b', '30', 29, '[W]', 'WIDE', 'W', 'W', 'EYE · the boardroom wide', 'STILL', v2=['30.13'], fv3=['30.13a'], change='SPLIT', model='2 beats', script='2 beats', box='typed', room='boardroom · wide, fires',
  action=['f0–14: everyone in the room looks around, as if seeing the fires for the first time (the "…").', 'f15: "…Ah."'], lines=[('a4-30-06', 15)], music='none', assets=['room.boardroom', 'cast.room-sprites'],
  standin='rooms-a boardroom wide + the heads turn (held drawings)', events=2)
S('30.12', '30', 24, '[2S]', 'TWO-SHOT', 'M', '2S', 'EYE · 3/4 across the table: MAS left, MADA right; the chaos behind them', 'STILL', v2=['30.14'], fv3=['30.14'], change='RETIME', note='THE CALM-OFF, placed. Cut on the end of "Terms?" (MADA is tight on its tail).',
  model='2 beats', script='2 beats', box='os', room='boardroom · calm-off plate, fires', chars=['MAS: medium, still', 'MADA: medium, still, spinner'],
  action=['Behind them: Terb sprays the chair fire (the extinguisher works: the pin is out); keycaps bounce off the table; a key ring jangles inside the wall.'], lines=[('a4-30-07', 12)],
  sfx=['steam_hiss (the extinguisher)', 'keycaps', 'key ring jangle (build)'], music='none', assets=['cast.twoshots', 'cast.mas.medium', 'cast.mada.medium'], face=True, standin='twoshots drawCalmOff2S', events=4)
S('30.13', '30', 23, '[OTS]', 'OTS', 'OTS', 'OTS', "OTS · over Mas's left shoulder (silhouette, the fires' rim) onto MADA", 'STILL', v2=['30.15'], fv3=['30.15'], change='REFRAME', note='Was a boxed [P]. Cut on the end of his line: the next beat is Mas\'s.',
  model='2 beats', script='2 beats', room='boardroom · calm-off plate', chars=['MAS: foreground silhouette (flippable)', 'MADA: medium rig, spinner'], lines=[('a4-30-08', 3)], music='none',
  assets=['fx.ots-shoulder', 'cast.mas.portrait', 'cast.mada.medium'], face=True, standin='shoulderFg(masPortrait, rim W3) + drawMadaM (templates panel 3)', events=1, entry='a cut-in from 30.12 (the calm-off push, step 1)')
S('30.14', '30', 40, '[MCU]', 'MCU', 'MCU', 'MCU-F', 'EYE · near-front, MAS left third, eyes toward Mada; the fires soft behind', 'STILL', v2=['30.16'], fv3=['30.16'], change='REFRAME', note='Was a boxed [P]. His line is exactly 1 beat after Mada\'s: the late beat is the joke.',
  model='3 beats', script='3 beats', room=FIRES, chars=['MAS: frameless, near-front'], lines=[('a4-30-09', 15)], music='none', assets=['fx.frameless-bust', 'cast.mas.portrait'], face=True,
  standin='MCU-F: masPortrait (front head, warm) over the fires soft', events=1, entry='a cut-in from 30.13 (the calm-off push, step 2)')
S('30.15', '30', 58, '[2S]', 'TWO-SHOT', 'M', '2S', 'EYE · the 30.12 setup', 'STILL', v2=['30.17'], fv3=['30.17'], change='RETIME', note='Back to the two-shot for the button. The long hold stays 2 beats.', model='1 bar', script='4 beats',
  room='boardroom · calm-off plate', action=["HOLD 2 BEATS (the episode's one long hold), the chaos still running behind: two still men.", "f18: Mada's spinner stops; f24: he nods once.", "f30: Terb's hand comes into frame, stamps a term sheet without looking, and hands it to both at the same time (f44)."],
  sfx=['rubber_stamp_C'], music='none', assets=['cast.twoshots', 'prop.term-sheet'], face=True, standin='twoshots drawCalmOff2S (long hold, stamp)', events=4)
S('30.16', '30', 75, '[POV]', 'SCREEN-CLOSE', 'SC', 'SCREEN', 'POV · his phone full-bleed, lit green', 'STILL (record)', v2=['30.20'], fv3=['30.20'], change='RETIME', model='1 bar + 1 beat', script='5 beats', box='post', room='his phone',
  action=["Mas's phone lights green; keycaps pop out of the bottom of the frame.", "f2: GERG's post."], lines=[('a4-30-10', 2)], text=[('post', POSTS['a4-30-10'][1], POSTS['a4-30-10'][2], 2)], sfx=['keycap_popcorn', 'phone wake'],
  music='the Build restarts (VICTORY LAP)', record=["Gerg's post"], assets=['kit.post-ui', 'prop.phone'], standin='post-ui stand-in, phone lit green', events=3, mode='M')
S('30.17', '30', 15, '[MCU·PF]', 'MCU', 'MCU', 'MCU-F', 'EYE · 3/4 down, MAS left third reading; the boardroom stepped down', 'STILL', v2=['30.20a'], fv3=['30.20a'], change='REFRAME', note='Was a boxed [PF]. The payoff of the D8 plant.',
  model='1 beat', script='1 beat', room='boardroom (night), stepped down', chars=["MAS: his face doesn't change"], music='the Build', assets=['fx.frameless-bust', 'cast.mas.portrait'], face=True, standin='MCU-F + softLayer', events=1)
S('30.18', '30', 120, '[HIGH]', 'ANGLE-HIGH', 'ECU', 'HIGH-TABLE', "OVERHEAD · the boardroom table: TTEMME's hourglass", 'STILL (record)', v2=['30.21'], fv3=['30.21'], change='RETIME', model='2 bars', script='8 beats', box='post',
  room='boardroom table · overhead', action=['The last grain runs out.', 'f4: his post pops over it.', 'f105 (the post\'s last beat): the hourglass shatters, only the glass; the sand holds the hourglass shape one beat, then falls.'],
  lines=[('a4-30-11', 4)], text=[('post', POSTS['a4-30-11'][1], POSTS['a4-30-11'][2], 4)], sfx=['hourglass_shatter (f105)'], music='the Build', record=["TTEMME's post"],
  assets=['room.table-insert', 'prop.hourglass', 'kit.post-ui'], standin="drawTableInsert 'prop' + hourglass L: last grain, shatter (v2 30.21)", events=4, mode='M')
S('30.19', '30', 60, '[LOW]', 'ANGLE-LOW', 'W', 'LOW-ROOM', 'LOW · the lobby from low: the wall sign looming over us, Mas small at the reception desk', 'STILL', v2=['30.22'], fv3=['30.22'], change='REFRAME', note='Was a [W]: an institution looming.',
  model='1 bar', script='1 bar', room='lobby (night), low angle', chars=['MAS: room sprite at the reception desk, no lanyard, his glass in his hand'], action=['The sign that was blank in the check scene lights up over us (3 held ignite steps).'],
  text=[('sign', 'DAYS SINCE SOMEONE TRIED TO FIRE MAS: 0', '[INVENTED] sign (in the plot: sharp)', 6)], sfx=['sign ignite ticks'], music='a brass stab on the sign',
  assets=['angle.low.lobby', 'prop.lobby-sign', 'cast.room-sprites'], standin='crop of drawLobby night framed on the sign + mas-stand (stand-in, not a true low angle)', events=3)
S('30.20', '30', 30, '[ECU]', 'INSERT-PROP', 'ECU', 'ECU-PROP', 'EYE · floor level under the sign', 'STILL', v2=['30.23'], fv3=['30.23'], change='CARRY', model='2 beats', script='2 beats', room='lobby · floor insert',
  chars=['A maintenance hand'], action=['A maintenance hand sets a small box on the floor under the sign: it is full of spare 0 plates.'], sfx=['box set down'], music='the flat line',
  assets=['prop.zero-box', 'cast.hands.maintenance'], hand=True, face=True, standin='rooms-a drawSignFloorInsert (hand: stand-in)', events=2, mode='M')
S('30.21', '30', 60, '[OTS-W]', 'OTS-W', 'OTS', 'OTS', "OTS · over Mas's left shoulder (tungsten rim) onto the lobby wide", 'STILL', v2=['30.24'], fv3=['30.24'], change='REFRAME', note='Was a [W]; a stepped push into the [CU]. Check the geography with the lobby builder; fallback: the v2 [W].',
  model='1 bar', script='1 bar', room='lobby (night) · wide beyond his shoulder', chars=['MAS: foreground silhouette'],
  action=['The 1993 dialog pops up once more, in full colour: OK · Cancel.', 'Cancel greys out one dither step a beat over three held beats (f0, 15, 30).', 'f45 (beat 4): the arrow pointer from the call steps in and clicks it. Bonk.'],
  text=[('ui', 'OK · Cancel', '[INVENTED] UI', 0)], sfx=['alert_bonk (f45)'], music='the flat line', assets=['fx.ots-shoulder', 'cast.mas.portrait', 'room.lobby', 'kit.dialog-1993'], face=True,
  standin='shoulderFg(masPortrait, tungsten rim) + lobby night + callDialog (v2 30.24 layout)', events=4)
S('30.22', '30', 30, '[CU]', 'CLOSE-UP', 'CU', 'CU', 'EYE · 3/4, full frame, the lobby tungsten behind', 'STILL', v2=['30.25'], fv3=['30.25'], change='CARRY', note="The episode's second and last [CU]: the cut-in from the OTS-W.",
  model='2 beats', script='2 beats', room='lobby (tungsten backdrop)', chars=['MAS: the same one silent drawing'], music='the flat line', assets=['cast.mas.cu'], face=True, standin="drawMasCU backdrop 'lobby'", events=1, entry='a cut-in from 30.21')
S('30.23', '30', 45, '[ECU]', 'INSERT-HANDS', 'ECU', 'ECU-HANDS', 'HIGH · 3/4 down onto the reception desk: his hand, the glass', 'STILL', v2=['30.26'], fv3=['30.26'], change='CARRY', model='3 beats', script='3 beats', box='os',
  room='lobby · reception desk insert', chars=['MAS: hand only'], action=['His hand sets the glass down on the reception desk and nudges it one pixel true (f8).'], lines=[('a4-30-12', 12)], sfx=['glass set down', 'nudge tick'],
  music='"okay." and the felt cadence', assets=['cast.mas.hands'], face=True, hand=True, standin='inserts-mas drawNudgeInsert (lobby)', events=2, mode='M')

# ------------------------------------------------------------------------------------------------ 31 · the back wall
S('31.01', '31', 105, '[ECU]', 'INSERT-PROP', 'ECU', 'ECU-PROP', 'EYE · the vault, square on, under the tungsten spill from the hall', 'STILL', v2=['31.01'], fv3=['31.01'], change='RETIME', note="The (REPORTED) rail's read (4.3 s) sets the length.",
  model='1 bar + 3 beats', script='7 beats', room='bullpen back wall · vault insert', action=['A squat steel vault stencilled Q*, a yellow sticky note on its door.', 'It hums at the score\'s root note, F.'],
  text=[('rail', 'NOV 22, 2023 · REPORTED: STAFF WROTE TO THE BOARD ABOUT A BREAKTHROUGH CALLED "Q*"', '[V as reported]', 0)], sfx=['server_hum pitched to F (the vault)'],
  music='GLYPH, diegetic: the room\'s hum becomes the score\'s root (MM-12 is B2: the hum is the temp)', record=['(REPORTED) rail'], notes=['No move: the rail is must-read record.'],
  assets=['prop.q-vault'], standin='inserts-props drawVaultInsert', events=1, mode='M')
S('31.02', '31', 75, '[MCU-2]', 'MCU-2', 'MCU', 'MCU-2', 'EYE · the frameless 50/50: MAS left third turned away to camera-left, GERG right third facing him; the vault soft between them', 'RACK · on the hum, after "it\'s a preview.": the two men → the vault (f40–45, 3 held steps), the note sharp (rack 4 of 4)',
  v2=['31.02', '31.03'], fv3=['31.02', '31.03', '31.05', '31.05b'], change='MERGE', note='Was a [W] walk + a [P2] box: one frame, one question and its answer (rule 2); Gerg walks out of frame.',
  model='1 bar + 1 beat', script='5 beats', room='bullpen back wall (day)', chars=['MAS: frameless, already past, not looking; the Orb at his shoulder looking at the vault', 'GERG: frameless, laptop open, the green under his chin'],
  action=['f12: GERG asks; f30: MAS answers, not looking.', 'f40: the vault hums on the line: RACK to the vault; both men go soft.', 'f50: Gerg reads the sticky note, nods (f58) and walks out of frame in whole-pixel steps (f62–74).'],
  lines=[('a4-31-01', 12), ('a4-31-02', 30)], text=[('note', 'DO NOT OPEN. DO NOT EXPLAIN.', '[INVENTED]', 45)], sfx=['the vault hum swells on the line'], music='the hum',
  notes=['Day room: tall busts for Mas (P1) and Gerg (P2).'], assets=['fx.frameless-bust', 'fx.rack', 'cast.mas.portrait', 'cast.gerg.portrait', 'cast.orb', 'prop.q-vault', 'cast.mas.tallbust', 'cast.gerg.tallbust', 'room.bullpen'], face=True,
  standin='MCU-2: two framelessBust calls + the drawVaultP2 vault as the rack layer (templates panel 12)', events=4)
S('31.03', '31', 120, '[MCU]', 'MCU', 'MCU', 'MCU-F', 'EYE · 3/4, MAS left third at his desk; the bullpen soft', 'STILL (record)', v2=['31.06'], fv3=['31.06'], change='REFRAME', note='Was a boxed [P]. No move, no music; the memo page is never inserted.',
  model='2 bars', script='2 bars', room='bullpen (day), stepped down', chars=['MAS: frameless, reading aloud, unhurried but not slow'], lines=[('a4-31-03', 12)], text=[('rail', 'NOV 29, 2023', '[V]', 0)],
  music='none (the record)', record=['the memo [V]'], notes=['Voiced on camera, never as V.O. The source has a capital "I": that belongs to Ep7.', 'Day room: cast.mas.tallbust (P1).'],
  assets=['fx.frameless-bust', 'cast.mas.portrait', 'cast.mas.tallbust', 'room.bullpen'], face=True, standin='MCU-F: masPortrait (warm) over the bullpen soft (tall-bust stand-in)', events=1)
S('31.04', '31', 60, '[ECU]', 'INSERT-PROP', 'ECU', 'ECU-PROP', "EYE · the back of ALYI's board chair", 'STILL', v2=['31.07'], fv3=['31.07'], change='RETIME', model='4 beats', script='4 beats', room='boardroom · chair-back insert',
  chars=["a maintenance worker's hand + screwdriver"], action=['Four screws, four beats (f0, 15, 30, 45), one held drawing each.', 'f55: the plate comes off.'], text=[('prop', 'ALYI', '[V] nameplate', 0)], sfx=['screw squeak ×4'],
  music='none', notes=["His own real line lands on a prop consequence, never on the Orb's look. (He left the board that day; he stays at the company.)"], assets=['prop.nameplate-alyi', 'cast.hands.worker'], face=True, hand=True,
  standin='rooms-a drawChairBackInsert (hand: stand-in)', events=5, mode='M')
S('31.05', '31', 60, '[W]', 'WIDE', 'W', 'W', 'EYE · the bullpen by the window', 'STILL (record)', v2=['31.09'], fv3=['31.09'], change='RETIME', model='1 bar', script='1 bar', room='bullpen (day) · window corner',
  action=['A MACROSOFT-blue folding chair unfolds itself (4 drawings, f0–16).', 'It stays empty.', "f45: from somewhere above, Tasya's key ring drops onto the seat. Jangle."],
  text=[('prop', 'OBSERVER (NON-VOTING)', '[V]', 16)], sfx=['chair unfold clacks', 'key ring jangle (build)'], music='none', record=['OBSERVER (NON-VOTING)'], gags=['The chair is on his floor anyway.'],
  assets=['room.bullpen', 'prop.observer-chair'], standin='rooms-b bullpen window corner + prop.observer-chair stand-in', events=3)

SCENES = [
    ('24', 'INT. LAS VEGAS HOTEL SUITE — DAY', 'MAS', '[BASE] → [BLUEPRINT] on the insert\'s last beat', 'I', 90, '12:31–12:35 (6 beats)', 'his POV'),
    ('25', 'THE PLAN', 'MAS', '[BLUEPRINT]', 'P', 420, '12:35–12:52 (7 bars: 1 · 4 · 2)', "the show's voice, inside his POV block: no V.O., no device, no Mas tell"),
    ('26', 'SAME — THE FALLING TILE', 'MAS', '[BASE] (+[GLYPH] 20 f, [EARLY-WEB16] F1.2)', 'S2', 435, '12:52–13:10 (29 beats: 8 · 8 · 7 · F1.2 6)', 'his POV; a fast-cut set-piece'),
    ('26A', "INT. MAS'S DARK ROOM — THAT NIGHT", 'MAS', '[BASE]', 'I', 195, '13:10–13:18 (13 beats)', 'his POV; D2'),
    ('27', "THE FIVE DAYS, PASS ONE: THE BOARD'S SIDE", 'BOARD', '[BASE]', 'I (the exit)', 1710, '13:18–14:30 (114 beats)', 'the exit: no V.O., no devices, no Mas single'),
    ('28', 'CARD · INTERNAL ACT-OUT', 'MAS', '[BASE]', 'CARD', 60, '14:30–14:32 (1 bar)', 'the door back'),
    ('29', 'THE FIVE DAYS, PASS TWO: HIS SIDE', 'MAS', '[BASE]', 'I + S3', 1485, '14:32–15:34 (99 beats; the avalanche 8 bars)', 'his POV; D3, D8; the S3'),
    ('30', 'THE RETURN', 'MAS', '[BASE]', 'I + S2', 1170, '15:34–16:23 (78 beats)', 'his POV; no V.O.'),
    ('31', 'INT. NOPEAI BULLPEN — BACK WALL — DAY', 'MAS', '[BASE]', 'M/I', 420, '16:23–16:40 (28 beats)', 'his POV'),
]
SCENE_CAP = {'24': 5.0, '25': 20.0, '26': 20.0, '26A': 9.4, '27': 76.0, '28': 2.5, '29': 67.0, '30': 52.0, '31': 19.0}
CHUNKS = [
    ('C01', '24.01', '25.05', 'The suite + THE PLAN (7 bars, voiced) + the click'),
    ('C02', '26.01', '26.10', 'THE FALLING TILE: the call, the macro click, D6, the silent [CU], "super." over his shoulder, F1.2'),
    ('C03', '26A.01', '27.09', "The dark room (D2, the Orb's iris, the whip) + pass one's calls and the all-hands doorway"),
    ('C04', '27.10', '27.19', "That night: the 9:32 post, the hearts and the blue-heart macro, the committee races the phones"),
    ('C05', '27.20', '28.01', 'The lighthouse, the security tile, TTEMME at desk level, the slate door, step four?, the act-out card'),
    ('C06', '29.01', '29.10', "His side: the home shot, eight hearts, the Orb's iris (D3), mostly., the counter, the letter, the check"),
    ('C07', '29.11a', '29.17', 'Gerg on the monitor, the quiet beat, D8 and the slate door, leave it open.'),
    ('C08', '29.18', '29.30', 'THE TILE AVALANCHE (S3, 8 bars)'),
    ('C09', '30.01', '30.15', 'The doorway BOX, the landlord, the fires, TERB, the calm-off'),
    ('C10', '30.16', '30.23', "The consequences: Gerg's post, the hourglass, the lobby from low, Cancel greys, the [CU], okay."),
    ('C11', '31.01', '31.05', 'The back wall: Q*, the 50/50, the memo, the screwdriver, the observer chair'),
]
TEMP_SCORE = {  # the OST renders that exist now (audio/ost/tracks/*/render); all TEMP, all composed to lock v2's clock: re-conform
    '24': 'mm01-water-line (felt, bar 1) · TEMP', '25': 'mm07-how-to-fire-a-ceo/render/e01-s25-the-plan-underscore (conform 18 → 7 bars) · TEMP',
    '26': 'mm08-the-falling-tile-underscore (or variants/mm08-leverage-bed) to the Cancel click; then silence · TEMP',
    '26A': 'mm08-the-falling-tile (the E01-S26A felt section) · TEMP', '27': 'mm09-the-boards-side-underscore (114.9 s → ≈ 69 s) · TEMP', '28': 'mm09 (the REVERSAL out) · TEMP',
    '29': 'mm10-his-side-745-underscore (the felt, the Build; the S29b swing conformed 16 → 8 bars) · TEMP',
    '30': 'e01-s30a-the-door (the violin) + mm11-the-return-underscore (82.4 s → ≈ 48 s) · TEMP', '31': 'server_hum pitched to F (SFX); nothing under the memo',
}
BOARD_CALLS = [
    ('25.02–25.02d', "The model's 4-bar voiced diagram is cut in four on NELEH's clauses: section (the chairs) → sheet with a PAN down the arrow (control) → detail (the key ring, VOTES: 0 on the cut-off) → detail (the CEO box, the overlap, the moth). A set-piece cuts every ≤ 2 bars with a size change (§4.7.3 rule 8). Same 4 bars."),
    ('26.05–26.06b', "The click gets a screen macro: 26.05 the arrow steps in (2 beats, was 3), 26.06 an integer 2x of the laptop's own pixels on Cancel (1 beat; macro 1 of 2), 26.06b the drop in the silence (2 beats). The click lands on the cut into 26.06b at the model's frame, so D6 stays exactly 5 beats. It replaces framing-v3's drawing 5 (the dialog redrawn at 2x): no new art."),
    ('26.09', "3.2's single [OTS] for \"super.\" (ruling 6 default) over framing-v3's MCU + grid: the line and its listeners in one frame. 3 beats → 2: the line ends f17 and the script's listener's hold is 1 beat, so the model's third beat was slack (−15 f; the drop-out, the [CU] and F1.2 are untouched)."),
    ('27.02 / 27.13b–27.18', "Screen direction: NELEH's boardroom singles are LEFT third facing right (the room's line, as drawBoard2S stages her: framing-v3 §2.3 and §4.7.3 rule 5, 'in an exit the room's own staging sets the line'). At her own desk (27.02) she is right third facing left. The script's 'anyone framed alone faces from the right' is read as 'the left of frame never holds Mas'."),
    ('27.12–27.12b', "The hearts shot is split 7 beats + 1: the blue heart landing on Mada's spinner is macro 2 of 2 (framing-v3's 27.09b). The eulogy post enters at f20 and has scrolled off before the macro cut, so no record is cropped (post read ≥ 3.25 s holds)."),
    ('27.05–27.05c · 27.07–27.09 · 27.13–27.19 · 27.21–27.23 · 29.11a–29.17 · 30.06–30.06b · 30.11a–30.15', "Cut on the turn (§4.7.3 rule 8, the v3 default): each conversation cut is frame-accurate at the cue sheet's overlap, L-cuts ≤ 8 f; each block is closed back onto the beat grid by its last shot (a read floor, a scripted hold or a rack), so everything after stays on the grid. Net with 26.09: −90 f (−3.75 s) against the beat model; set-pieces, cards, posts and holds otherwise keep the writer's lengths."),
    ('27.30', "NELEH's hand, resting by the ? with the capped marker, is in the overhead: TASYA's real read (27.29) then lands on a listener within a beat (§4.3 rule 5), which the cut 2S used to do."),
    ('29.20', "NEW ANGLE: the avalanche's 'hundreds' plays over Mas's shoulder onto the monitor across the dark room (one frame of scale with him in it), then cuts in to his face (29.21) on the same axis. It's still his side (his silhouette, his monitor). Fallback: the scripted full-bleed [POV]."),
    ('30.03', "3.2's one still wide for the landlord (ruling 6 default): a real line plays whole on one still shot (§4.7.3 rules 6, 8). framing-v3's floor / ceiling / Tasya split and its ceiling plate are not used."),
    ('31.01', 'No drift on the vault: the (REPORTED) rail is must-read record, so the shot plays dry (the act\'s one drift is 26A.01).'),
]

# ======================================================================================= derive
V2 = json.load(open(PROD + '/history/shots-v2.json'))
V2S = {s['id']: s for s in V2['shots']}
LOCK2 = json.load(open(PROD + '/history/shots-locked-v2.json'))
LOCK2S = {s['id']: s for s in LOCK2['shots']}
LINES_JSON = {x['id']: x for x in json.load(open(ROOT + '/audio/ep01/act4/dialogue/lines.json'))}

f = 0
by_id = {}
for s in SHOTS:
    s['start_frame'] = f
    s['end_frame'] = f + s['frames']
    s['dur_s'] = round(s['frames'] / FPS, 3)
    s['grid'] = glen(s['frames'])
    s['on_grid'] = s['start_frame'] % FPB == 0
    s['tc_in'], s['tc_out'] = tc(s['start_frame']), tc(s['end_frame'])
    f = s['end_frame']
    by_id[s['id']] = s
TOTAL = f

sc_frames = defaultdict(int)
for s in SHOTS: sc_frames[s['scene']] += s['frames']

# chunks
chunk_of = {}
chunk_rows = []
ids = [s['id'] for s in SHOTS]
for cid, a, b, title in CHUNKS:
    i0, i1 = ids.index(a), ids.index(b)
    for i in ids[i0:i1 + 1]: chunk_of[i] = cid
    sh = SHOTS[i0:i1 + 1]
    chunk_rows.append(dict(id=cid, first=a, last=b, shots=f"{a}–{b}", n_shots=len(sh), start_frame=sh[0]['start_frame'], end_frame=sh[-1]['end_frame'],
                           frames=sh[-1]['end_frame'] - sh[0]['start_frame'], seconds=round((sh[-1]['end_frame'] - sh[0]['start_frame']) / FPS, 2),
                           tc_in=tc(sh[0]['start_frame']), tc_out=tc(sh[-1]['end_frame']), title=title))
assert len(chunk_of) == len(SHOTS), 'chunks must cover every shot'

# lines, V.O. and posts per shot
LINE_ROWS = {}
for s in SHOTS:
    s['chunk'] = chunk_of[s['id']]
    s['side'] = s['side_override'] or ('BOARD' if s['scene'] == '27' else 'MAS')
    s['lines'], s['dialogue'], s['vo'] = [], [], []
    for lid, at in s['line_cues']:
        s['lines'].append(lid)
        lj = LINES_JSON.get(lid)
        if lid in L32:
            spk, txt, tag, st, tgt, mode, os_ = L32[lid]
            n = round(tgt * FPS)
            d = dict(id=lid, speaker=spk, text=txt, tag=tag, mode=mode, os=os_, voiced=True, frames=n, at=at, end=at + n, abs_in=s['start_frame'] + at,
                     tc_in=tc(s['start_frame'] + at), target_s=tgt, status=f"3.2: {st} · TARGET (re-record pending)",
                     scratch=(lj or {}).get('file'), scratch_s=(lj or {}).get('duration_s'),
                     crosses_cut=max(0, at + n - s['frames']), prelap=max(0, -at))
            s['dialogue'].append(d)
        elif lid in VO32:
            txt, dev, tag, tgt, caught, alt = VO32[lid]
            n = round(tgt * FPS)
            d = dict(id=lid, text=txt, device=dev, tag=tag, at=at, end=at + n, frames=n, abs_in=s['start_frame'] + at, tc_in=tc(s['start_frame'] + at),
                     target_s=tgt, status='3.2: re-take (pace) · TARGET (re-record pending; needs the POV owner\'s sign-off on the pace, ruling 7)',
                     scratch=(lj or {}).get('file'), caught_by=caught, alt=alt, on_screen='x 12, baseline y 198, 1-px N0 shadow, cyan one step down, 0.5 ch/f')
            s['vo'].append(d)
        elif lid in POSTS:
            who, txt, tag = POSTS[lid]
            s['dialogue'].append(dict(id=lid, speaker=who + ' (post)', text=txt, tag=tag, mode='post-popup', voiced=False, at=at, hold_floor=post_floor(txt),
                                      held=s['frames'] - at, status='unvoiced pop-up (scratch read stays in optional/)'))
        else:
            raise SystemExit(f'unknown line {lid} in {s["id"]}')
        LINE_ROWS.setdefault(lid, []).append(s['id'])
    s['text'] = [dict(kind=k, text=t, tag=g, at=a, must_read=k in ('rail', 'post', 'card', 'stamp', 'meter', 'counter', 'check', 'list', 'plate', 'sign')) for k, t, g, a in s['text']]
    rails = [t for t in s['text'] if t['kind'] == 'rail']
    s['rail_changes_here'] = bool(rails)
    s['rail_change'] = dict(text=rails[0]['text'], at=rails[0]['at'], abs=s['start_frame'] + rails[0]['at'], read_min=post_floor(rails[0]['text'])) if rails else None
    s['style'] = '[BLUEPRINT]' if s['scene'] == '25' else ('[EARLY-WEB16]' if s['id'] == '26.10' else '[BASE]')
    s['lock_id'] = list(s['v2_id'])
    s['v2_frames'] = sum(LOCK2S[i]['frames'] for i in s['v2_id'] if i in LOCK2S) or None
    s['assets'] = [dict(id=a, status=A[a]['status'], owner=A[a]['owner'], priority=A[a]['priority']) for a in s['asset_ids']]
    cls = s['size_class']
    s['logged_as'] = s['shotSize']
    s['face_frames'] = s['frames'] if s['face'] else 0
    s['faces_hands'] = bool(s['face'])
    s['move_type'] = s['move'].split(' ')[0].split('·')[0].strip().lower().replace('(', '')
    if s['move_type'] in ('still', ''): s['move_type'] = 'still'
    s['has_record'] = bool(s['record_items'])

# rail persistence
cur = None
for s in SHOTS:
    if s['rail_change']: cur = s['rail_change']['text']
    s['rail_shown'] = None if s['size_class'] in ('GS', 'GM', 'GD', 'GFX') else cur

# ======================================================================================= checks
problems, warnings = [], []
# 1 · runs of one size class
runs = []
for k, g in itertools.groupby(SHOTS, key=lambda s: s['size_class']):
    g = list(g)
    runs.append((k, len(g), g[0]['id'], g[-1]['id']))
longest = max(r[1] for r in runs)
longest_runs = [r for r in runs if r[1] == longest]
for r in runs:
    if r[1] > 2: problems.append(f'run of {r[1]} {r[0]} shots: {r[2]}..{r[3]}')
# 1b · the angle and move vocabularies
for s in SHOTS:
    if s['angle'].split(' · ')[0] not in ('EYE', 'HIGH', 'OVERHEAD', 'LOW', 'DESK', 'OTS', 'POV', 'FLAT'): problems.append(f"{s['id']}: angle token '{s['angle'].split(' · ')[0]}'")
    if s['move_type'] not in ('still', 'pan', 'drift', 'rack', 'whip-out', 'whip-in', 'macro', 'app-push'): problems.append(f"{s['id']}: move token '{s['move_type']}'")
# 2 · scene totals
for sc, head, side, style, mode, model, clock, _ in SCENES:
    got = sc_frames[sc]
    if got > model: problems.append(f'sc {sc} runs {got} f, over the 3.2 model ({model} f)')
    if got / FPS > SCENE_CAP[sc]: problems.append(f'sc {sc} over its cap')
# 3 · boxes
boxes = [s['id'] for s in SHOTS if s['size_class'] == 'BOX']
if len(boxes) > 2: problems.append(f'deliberate boxes > 2: {boxes}')
box_lines = [(s['id'], d['id']) for s in SHOTS if s['size_class'] == 'BOX' for d in s['dialogue'] if d.get('voiced')]
# 4 · moves and budgets
mv = defaultdict(list)
for s in SHOTS:
    mv[s['move_type']].append(s['id'])
budget = {'whip-out': 4, 'rack': 4, 'macro': 2}
for k, n in budget.items():
    if len(mv.get(k, [])) > n: problems.append(f'{k}: {len(mv[k])} > {n}')
for s in SHOTS:
    if s['has_record'] and s['move_type'] not in ('still', 'still record', 'app-push'):
        problems.append(f"{s['id']}: a camera move ({s['move_type']}) on a shot with record in picture")
# whips land on shots without record at the whip frames
for s in SHOTS:
    if s['move_type'] == 'whip-out':
        nxt = SHOTS[SHOTS.index(s) + 1]
        if nxt['move_type'] != 'whip-in': problems.append(f"{s['id']}: whip-out without a whip-in on {nxt['id']}")
        if not nxt['on_grid'] or nxt['start_frame'] % FPB: problems.append(f"{nxt['id']}: a whip must land on a beat")
# 5 · the exit: no Mas single in sc 27
for s in SHOTS:
    if s['scene'] == '27' and s['size_class'] in ('MCU', 'CU', 'M', 'OTS') and any(c.startswith('MAS') for c in s['characters']):
        problems.append(f"{s['id']}: a Mas single in the exit")
# 6 · lines: pre-laps and overhangs <= 8 f (V.O. never crosses)
for s in SHOTS:
    for d in s['dialogue']:
        if not d.get('voiced'): continue
        if d['prelap'] > 8: problems.append(f"{s['id']} {d['id']}: pre-lap {d['prelap']} f > 8")
        if d['crosses_cut'] > 8: problems.append(f"{s['id']} {d['id']}: runs {d['crosses_cut']} f past the cut (> 8)")
    for v in s['vo']:
        if v['at'] < 0 or v['end'] > s['frames']: problems.append(f"{s['id']} {v['id']}: the V.O. crosses a cut")
# 7 · setups: speakers per shot
setup_pairs = []
for s in SHOTS:
    spk = [d['speaker'].split(' (')[0] for d in s['dialogue'] if d.get('voiced') and d['at'] >= 0]
    if len(set(spk)) > 1:
        setup_pairs.append((s['id'], s['shotSize'], spk))
        if s['size_class'] not in ('M', 'OTS', 'GD') and s['framing'] != 'MCU-2': problems.append(f"{s['id']}: two speakers in a single's setup")
        if len(spk) > 2: problems.append(f"{s['id']}: more than one question-and-answer pair in one setup")
# 8 · V.O. clearances (>= 1 bar from record in picture; >= 1 beat before the next line)
REC_SPAN = {'26.10': (0, 45)}  # F1.2: only its (REPORTED) rail is record (beats 1–3); the grain after it isn't
rec_spans = [(s['start_frame'] + REC_SPAN.get(s['id'], (0, s['frames']))[0], s['start_frame'] + REC_SPAN.get(s['id'], (0, s['frames']))[1], s['id'])
             for s in SHOTS if s['has_record']]
vo_report = []
for s in SHOTS:
    for v in s['vo']:
        a, b = v['abs_in'], v['abs_in'] + v['frames']
        before = max([e for (st, e, i) in rec_spans if e <= a], default=-10 ** 6)
        after = min([st for (st, e, i) in rec_spans if st >= b], default=10 ** 6)
        vo_report.append(dict(id=v['id'], shot=s['id'], start=a, end=b, clear_before=a - before, clear_after=after - b))
        if a - before < FPBAR or after - b < FPBAR: problems.append(f"{v['id']}: within a bar of the record ({a - before} / {after - b} f)")
# 9 · set-piece cadence
SETPIECE = {'25': 'THE PLAN', '26': 'THE FALLING TILE', 'AVA': 'THE AVALANCHE'}
sp_shots = [s for s in SHOTS if s['scene'] in ('25', '26')] + SHOTS[ids.index('29.18'):ids.index('29.30') + 1]
for s in sp_shots:
    if s['frames'] > 2 * FPBAR: problems.append(f"{s['id']}: a set-piece shot over 2 bars")
face_gaps = []
for grp, lo, hi in [('26 the falling tile', '26.01', '26.10'), ('29 the avalanche', '29.18', '29.30')]:
    last = by_id[lo]['start_frame']
    for s in SHOTS[ids.index(lo):ids.index(hi) + 1]:
        if s['face']:
            face_gaps.append((grp, s['id'], s['start_frame'] - last)); last = s['end_frame']
    worst = max(g for (_, _, g) in [x for x in face_gaps if x[0] == grp])
    if worst > 4 * FPBAR: problems.append(f'{grp}: more than 4 bars without a face')
# 10 · holds after the last voiced word (the editor's list: > 1 beat needs a reason)
TAIL_WHY = {'26A.01': 'staged: the brush and the thumb on mark 3 after the V.O.', '27.01': "scripted: nobody looks up (the pass's first laugh); music-bound bar",
            '27.05c': "the plate's read floor (48 f)", '29.04': 'the V.O. ends >= 1 beat before "mostly." (clearance) + the grid', '29.05': 'the rack, then the scripted HOLD 1 BEAT',
            '29.17': 'the rack to the door after the line; closes the block on the grid', '30.01': "scripted: the hearts cross the gap, Alyi looks up, HOLD 1 BEAT, the IOU",
            '30.03': "staged: the remap completes, everyone stands on him, the key ring jangles (the writer's 10-beat S2)", '30.23': 'the felt cadence under the act-out of the return',
            '31.02': 'staged: the rack, Gerg reads the note, nods and walks out'}
long_tails = []
for s in SHOTS:
    ends = [d['end'] for d in s['dialogue'] if d.get('voiced')] + [v['end'] for v in s['vo']]
    if ends:
        tail = s['frames'] - max(ends)
        if tail > FPB:
            long_tails.append((s['id'], tail))
            if s['id'] not in TAIL_WHY: problems.append(f"{s['id']}: {tail} f after the last word with no scripted reason")
# 11 · conversation cuts on the grid at block ends
off_grid = [s['id'] for s in SHOTS if not s['on_grid']]
# ======================================================================================= shares (§4.7.4, time-weighted)
def pct(n): return round(100 * n / TOTAL, 1)
fr_cls = defaultdict(int); n_cls = Counter()
for s in SHOTS: fr_cls[s['size_class']] += s['frames']; n_cls[s['size_class']] += 1
fr_size = defaultdict(int); n_size = Counter()
for s in SHOTS: fr_size[s['shotSize']] += s['frames']; n_size[s['shotSize']] += 1
box_f = fr_cls['BOX']
mcu_cu = fr_cls['MCU'] + fr_cls['CU']
med = fr_cls['M'] + fr_cls['OTS']
faces = sum(s['face_frames'] for s in SHOTS)
wide = fr_cls['W']
scr = fr_cls['SW'] + fr_cls['SC']
gfx = fr_cls['GS'] + fr_cls['GM'] + fr_cls['GD'] + fr_cls['GFX']
ecu = fr_cls['ECU']
inworld_box_shots = [s['id'] for s in SHOTS if s['size_class'] in ('SC',) and s['face'] and s['id'] not in ('30.06b',)]
spoken = [d for s in SHOTS for d in s['dialogue'] if d.get('voiced')]


def band(v, g, a):  # g/a are (lo, hi) inclusive ranges for GREEN / AMBER
    return 'GREEN' if g[0] <= v <= g[1] else ('AMBER' if a[0] <= v <= a[1] else 'RED')


SHARES = dict(
    boxed_windows=dict(shots=len(boxes), frames=box_f, pct=pct(box_f), band=band(pct(box_f), (0, 5), (5, 10)), note='the one deliberate BOX; in-world tiles log as [POV]/[SCR]'),
    spoken_lines_in_a_box=dict(n=len(box_lines), lines=box_lines, band='GREEN' if len(box_lines) <= 2 else ('AMBER' if len(box_lines) <= 4 else 'RED')),
    mcu_plus_cu=dict(frames=mcu_cu, pct=pct(mcu_cu), band=band(pct(mcu_cu), (20, 30), (15, 20))),
    m_2s_ots=dict(frames=med, pct=pct(med), band=band(pct(med), (12, 20), (8, 12))),
    runs_of_3plus=dict(n=sum(1 for r in runs if r[1] > 2), longest=longest, longest_runs=[f"{r[0]} ×{r[1]} ({r[2]}–{r[3]})" for r in longest_runs]),
    faces_and_hands=dict(frames=faces, pct=pct(faces), band='AMBER, sanctioned for this act' if 45 <= pct(faces) < 55 else band(pct(faces), (55, 100), (45, 55))),
    wides=dict(frames=wide, pct=pct(wide), band=band(pct(wide), (0, 15), (15, 20))),
    screens=dict(frames=scr, pct=pct(scr)), gfx=dict(frames=gfx, pct=pct(gfx)), ecu=dict(frames=ecu, pct=pct(ecu)),
)
DIST = {k: dict(shots=n_cls[k], frames=fr_cls[k], seconds=round(fr_cls[k] / FPS, 2), pct=pct(fr_cls[k])) for k in ['W', 'M', 'OTS', 'MCU', 'CU', 'ECU', 'SW', 'SC', 'GS', 'GM', 'GD', 'GFX', 'BOX']}
DIST_SIZE = {k: dict(shots=n_size[k], frames=fr_size[k], pct=pct(fr_size[k])) for k in sorted(n_size, key=lambda k: -fr_size[k])}
MOVES = {k: v for k, v in mv.items() if k != 'still'}
entries = [(s['id'], s['entry']) for s in SHOTS if s['entry']]

# ======================================================================================= outputs
def assets_needed():
    rows = []
    for a in A.values():
        if a['status'] in ('NEW', 'CHANGED', 'HELPER', 'PARAM', 'CHECK'):
            used = [s['id'] for s in SHOTS if a['id'] in s['asset_ids']]
            if used: rows.append(dict(a, used_in=used))
    order = {'P1': 0, 'P2': 1, 'P3': 2, '': 3}
    return sorted(rows, key=lambda r: (order[r['priority']], not r['new_in_v3'], r['id']))


NEEDS = assets_needed()
unused_assets = [a for a in A if not any(a in s['asset_ids'] for s in SHOTS)]

KEEP = ['id', 'scene', 'chunk', 'side', 'start_frame', 'end_frame', 'frames', 'dur_s', 'grid', 'model_len', 'script_len', 'tc_in', 'tc_out', 'tag', 'shotSize', 'size_class',
        'framing', 'framing_note', 'angle', 'move', 'move_type', 'entry', 'box', 'change', 'change_note', 'v2_id', 'v2_frames', 'lock_id', 'fv3_id', 'room', 'characters', 'action', 'lines', 'dialogue',
        'vo', 'text', 'rail_change', 'rail_shown', 'rail_changes_here', 'style', 'switches', 'drop_out', 'quiet_beat', 'sfx', 'music', 'gags', 'notes', 'events', 'prod_mode',
        'assets', 'standin', 'record_items', 'hand_in_frame', 'logged_as', 'rides', 'face_frames', 'faces_hands', 'on_grid']
for s in SHOTS: s['framing_note'] = s['standin']
out_shots = [{k: s.get(k) for k in KEEP} for s in SHOTS]
v2_used = set(i for s in SHOTS for i in s['v2_id'])
v2_cut = [x['id'] for x in LOCK2['shots'] if x['id'] not in v2_used]
V2_CUT_WHY = {'24.03': "the [PF]: the glow turns to blueprint on the hand (24.02)", '25.06': 'the chalk at the blank line (step 4 is under the fold)', '26.02a': 'Mas reading the icons (the fast-cut phrase 1)',
              '26.09': 'the shiver wide again (R10)', '26A.04': 'the Senate wallet', '26A.05': 'D4 V.O. close-up', '27.12c': '"The company will tell us." (R2)', '27.12d': 'the listener after it',
              '27.21': "ADELINA's card", '27.29': 'TTEMME "Chat. I\'m the CEO now."', '29.01': 'the 2S of "i put the phone down." (D5)', '29.01a': "MAS'S VERSION (D5)", '31.08': 'the shut-door insert',
              '27.04': "RIMA's card (now a plate)", '27.28': "TTEMME's card (now a plate)", '29.19': "MADA's card (now a tile label)"}
meta = dict(show='MR. MAS', episode='ep01 · research_preview', act='ACT FOUR · THE BLIP, TOLD TWICE', scenes='24–31 (incl. 26A, 28)',
            source='show/episodes/ep01/script.md Act Four DRAFT 3.2 (the tightening pass) + production/act4/tighten-changes.md (§2 lines, §4 cue sheet, §5 beat model, §6 sound, §7 assets; rulings at their defaults) + framing-v3.md/.json (size, angle, template and moves where a 3.1 shot survives), 2026-09-25',
            board='board 3 (v3). Crosswalk to board 2 / lock v2 in v2_id (= lock_id) and to framing-v3 in fv3_id', owner='storyboard artist / 1st AD',
            status='board 3 · sized to the 3.2 TARGETS (the re-record is pending: scratch = the v2 takes); set-pieces on the writer\'s beat model, conversations cut on the turn',
            frames=TOTAL, seconds=round(TOTAL / FPS, 3), length=f"{TOTAL // (FPS * 60)}:{(TOTAL / FPS) % 60:05.2f}", fps=FPS, bpm=96, frames_per_beat=FPB, frames_per_bar=FPBAR,
            canvas='480x270 native, 4x nearest to 1920x1080 (previews --scale=0.5); room area y 0-202, RAIL band y 203-269; V.O. band y 182-203',
            timecode='episode clock mm:ss:ff at 24 fps; start_frame / end_frame are act-relative (0 = 12:31:00); end is exclusive',
            generator='studio/src/episodes/ep01/act4/board/tools/board_v3.py (re-run after a re-record or a ruling; do not hand-edit the outputs)',
            grammar='show/bible/pov-and-framing.md §4.7 (Shot variety, 2026-09-25)')
conventions = dict(
    fields_new_in_v3=dict(angle="camera height and axis, leading token EYE | HIGH | OVERHEAD | LOW | DESK | OTS | POV | FLAT, then the composition",
                          move="STILL | PAN | DRIFT | RACK | WHIP-OUT | WHIP-IN | MACRO | APP-PUSH, then the recipe and the budget count; STILL (record) marks a shot that must stay still (§4.7.3 rule 6)",
                          move_type='the move token, lowercased', entry="how the shot is entered when it is part of a push: a cut-in up the ladder on the same axis, an in-world push (the app's layout or a screen macro)",
                          size_class='§4.7.3 rule 1 class for the run check: W (room wides and LOW room plates) · M ([M] [2S]) · OTS (incl. OTS-W) · MCU (frameless, 50/50, frame-in-frame, desk-level) · CU · ECU (hands, eyes, the iris, prop inserts, table overheads) · SW screen wide · SC screen close (pinned / two-up / half tile / phone / counter / macro / the floor POV) · GS / GM / GD blueprint sheet / section / detail · GFX full-screen card · BOX',
                          framing='the framing-v3 template (MCU-F, MCU-2, MCU-FRAME, DESK-LOW, OTS, 2S, M, CU, ECU-*, ECU-ORB, HIGH-TABLE, HIGH-FLOOR, LOW-ROOM, SCREEN, SCREEN-MACRO, BP-SIZES, CARD-RIDE, W, BOX)',
                          framing_note='the animatic layout: which existing function draws it now, and what is a stand-in',
                          box="none (no typed box: close coverage, §4.7.3 rule 4) · typed (the typed dialogue box on a wide) · speaker (through a speaker, no portrait) · os (a voice off picture) · post (a post's own UI) · BOX (the deliberate window)",
                          v2_id='board 2 / lock v2 ids this shot comes from (they coincide); lock_id repeats them for the lock tools', fv3_id='framing-v3 rows',
                          model_len='the 3.2 beat model length (tighten-changes §5)', record_items='must-read record in picture: the shot stays still and sharp on it', on_grid='the cut lands on the beat grid'),
    shotSizes={'WIDE': '[W] room wide', 'ANGLE-HIGH': '[HIGH] a pre-drawn overhead (table, desk, floor)', 'ANGLE-LOW': '[LOW] a pre-drawn low angle on architecture',
               'MEDIUM': '[M] a principal\'s medium rig', 'TWO-SHOT': '[2S] two figures at medium scale', 'OTS': '[OTS] the listener\'s silhouette over the speaker\'s medium (or a screen)',
               'OTS-W': '[OTS-W] the silhouette over a room wide', 'MCU': '[MCU] frameless close-up (incl. ·PF, the fallaway as a lighting move)', 'MCU-2': '[MCU-2] the frameless 50/50',
               'MCU-FRAME': '[MCU·door] frame in frame (a doorway)', 'DESK-LOW': '[LOW·desk] a prop big in the foreground, the MCU behind', 'CLOSE-UP': '[CU] Mas full frame (2 per episode)',
               'INSERT-HANDS': '[ECU] his hands', 'INSERT-EYES': '[ECU] the eyes strip', 'INSERT-PROP': '[ECU] a prop insert', 'ECU-ORB': "[ECU·Orb] the Orb's iris full frame",
               'SCREEN-WIDE': '[POV]/[SCR] a grid or list', 'SCREEN-CLOSE': '[POV]/[SCR] a pinned / two-up / half / single tile, a phone, a counter', 'SCREEN-MACRO': 'an integer 2x of a screen\'s own pixels (≤ 1 beat, ≤ 2 per act)',
               'BLUEPRINT-SHEET': '[GFX·sheet]', 'BLUEPRINT-SECTION': '[GFX·section]', 'BLUEPRINT-DETAIL': '[GFX·detail] (2x coordinates)', 'CARD': '[GFX] full-screen card', 'BOX': '[P]/[P2] the deliberate window (≤ 2 per act)'},
    side='BOARD = pass one, sc 27 (the exit); MAS = everything else (his POV)',
    change={'CARRY': 'the same framing as lock v2', 'REFRAME': 'the same beat, a new size / angle (most: a box becomes frameless, an OTS or an in-world frame)', 'SPLIT': 'one lock-v2 shot cut into several',
            'MERGE': 'several lock-v2 shots into one', 'MOVED': 'from another scene', 'NEW': 'no lock-v2 source', 'RETIME': 'a new length only', 'CHANGED': 'the same framing, new action or text'},
    logging=['A name card or plate logs as the shot it rides.', 'A video tile counts as a face when it fills at least half the frame (the pinned, two-up, half-frame and full tiles).',
             'A prop insert counts as a face or hand only with a hand in frame; a table overhead with her hand in it counts.', 'OTS and OTS-W log in [M]+[2S]+[OTS].', 'The floor POV (30.06b) is a screen-close class shot by framing-v3\'s class list but not a face.'],
    timing='96 BPM; 1 beat = 15 f; 1 bar = 60 f. Set-pieces, cards, posts, holds and music-bound cuts on the writer\'s beat model. Conversations cut on the turn (§4.7.3 rule 8, PROPOSED, the v3 default), L-cuts ≤ 8 f; each conversation block closes on the grid. Lines are placed at the 3.2 TARGET spans; re-sit them on the takes at the lock (±10%).',
    posts='Unvoiced posts hold at least 0.25 s + 0.05 s a character from their pop (the read floor); read-aloud posts are voiced lines.',
    moves_rule='No drift, rack, whip, pan or macro on a shot with a real line, post, card or must-read record in picture; soft focus never touches record text (§4.7.3 rule 6).',
    asset_status={'EXISTS': 'built', 'PARAM': 'an existing kit with new parameters (no drawing)', 'HELPER': 'a framing.ts helper (prototyped in studio/src/dev/framing-v3/templates.ts)',
                  'CHANGED': 'exists; needs a new option or state', 'NEW': 'to draw or plate', 'CHECK': 'confirm at this size'},
    priority={'P1': 'the v3 animatic does not read without it', 'P2': 'a stand-in carries the animatic; the final needs it', 'P3': 'polish / optional'},
)
checks = dict(problems=problems, runs=[dict(size_class=r[0], n=r[1], first=r[2], last=r[3]) for r in runs if r[1] > 1], longest_run=longest,
              longest_runs=[f"{r[0]} ×{r[1]} ({r[2]}–{r[3]})" for r in longest_runs], deliberate_boxes=boxes, lines_in_box=box_lines,
              moves={k: dict(n=len(v), shots=v) for k, v in MOVES.items()}, budgets=dict(whips='%d of 4' % len(mv.get('whip-out', [])), racks='%d of 4' % len(mv.get('rack', [])),
                                                                                  macros='%d of 2' % len(mv.get('macro', [])), cu='%d of 2 per episode' % n_size['CLOSE-UP'], boxes='%d of 2' % len(boxes)),
              pushes=entries, two_speaker_setups=[dict(shot=a, size=b, speakers=c) for a, b, c in setup_pairs], vo_clearance=vo_report, set_piece_face_gaps=[dict(group=g, shot=i, frames_since_last_face=n) for g, i, n in face_gaps],
              tails_over_1_beat=[dict(shot=i, frames=t, why=TAIL_WHY.get(i, '')) for i, t in long_tails], off_grid_cuts=off_grid,
              exempt=["THE PLAN (sc 25) has no face for 7 bars: it is the show's voice ([GFX], no Mas tell; framing-v3 §3 sc 25). The 4-bar face rule applies to the picture set-pieces (26, the avalanche)",
                      "30.01 (the BOX, 10 beats) and 30.03 (the landlord, 10 beats) run over 2 bars: each is a real line played whole on one still shot (rule 8)"])
doc = dict(meta=meta, conventions=conventions,
           totals=dict(shots=len(SHOTS), frames=TOTAL, seconds=round(TOTAL / FPS, 3), length=meta['length'], episode_in=tc(0), episode_out=tc(TOTAL),
                       model_32=dict(frames=5985, length='4:09.375', delta_frames=TOTAL - 5985, delta_s=round((TOTAL - 5985) / FPS, 3)),
                       lock_v2=dict(shots=len(LOCK2['shots']), frames=sum(x['frames'] for x in LOCK2['shots'])), framing_v3_plan=dict(shots=147),
                       by_size_class=DIST, by_shotSize=DIST_SIZE, visual_events=sum(s['events'] for s in SHOTS)),
           scenes=[dict(id=sc, title=h, side=sd, style=st, mode=m, printed_32=c, model_frames=mf, frames=sc_frames[sc], delta_frames=sc_frames[sc] - mf, side_note=note,
                        cap_s=SCENE_CAP[sc], shots=[s['id'] for s in SHOTS if s['scene'] == sc], tc_in=tc(min(s['start_frame'] for s in SHOTS if s['scene'] == sc)),
                        tc_out=tc(max(s['end_frame'] for s in SHOTS if s['scene'] == sc)), temp_score=TEMP_SCORE[sc]) for sc, h, sd, st, m, mf, c, note in SCENES],
           shots=out_shots,
           lines=[dict(id=k, speaker=v[0], text=v[1], tag=v[2], status_32=v[3], target_s=v[4], mode=v[5], shots=LINE_ROWS.get(k, []), scratch=(LINES_JSON.get(k) or {}).get('file')) for k, v in L32.items()]
                 + [dict(id=k, speaker=v[0] + ' (post)', text=v[1], tag=v[2], status_32='unvoiced pop-up', shots=LINE_ROWS.get(k, []), read_floor_f=post_floor(v[1])) for k, v in POSTS.items()],
           vo=[dict(id=k, text=v[0], device=v[1], tag=v[2], target_s=v[3], caught_by=v[4], alt=v[5], shots=LINE_ROWS.get(k, [])) for k, v in VO32.items()],
           retired_lines=[dict(id=k, what=v) for k, v in RETIRED.items()],
           crosswalk_v2=dict(v3_from_v2={s['id']: s['v2_id'] for s in SHOTS}, v2_cut_in_32=[dict(id=i, why=V2_CUT_WHY.get(i, 'folded')) for i in v2_cut]),
           shares=SHARES, checks=checks, chunks=chunk_rows,
           assets=list(A.values()), asset_needs=NEEDS, assets_no_longer_needed=[dict(id=a, why=b) for a, b in DROPPED],
           board_calls=[dict(shot=a, call=b) for a, b in BOARD_CALLS], sound=dict(temp_score=TEMP_SCORE, brief='tighten-changes.md §6 (the MUSIC: and SOUND: calls are also in the script)'),
           problems=len(problems))

# ----------------------------------------------------------------------------------------------- printing
def report():
    print(f"shots {len(SHOTS)} · frames {TOTAL} ({TOTAL / FPS:.2f} s) · model 5985 · delta {TOTAL - 5985}")
    for sc, *_ in SCENES: print(f"  sc {sc}: {sc_frames[sc]} f")
    print('size classes:', {k: (v['shots'], v['pct']) for k, v in DIST.items() if v['shots']})
    print('longest run', longest, [f"{r[0]}x{r[1]} {r[2]}-{r[3]}" for r in longest_runs])
    print('boxes', boxes, 'lines in box', box_lines)
    print('moves', {k: v for k, v in MOVES.items()})
    print('shares', {k: (v.get('pct'), v.get('band')) for k, v in SHARES.items()})
    print('two-speaker setups', setup_pairs)
    print('V.O.', vo_report)
    print('tails > 1 beat', long_tails)
    print('off-grid cuts', off_grid)
    print('unused catalog assets', unused_assets)
    print('PROBLEMS:', problems or 'none')


if '--check' in sys.argv:
    report(); sys.exit(1 if problems else 0)

json.dump(doc, open(PROD + '/history/shots-v3.json', 'w'), indent=1, ensure_ascii=False)
import board_v3_md  # noqa: E402  (the markdown writers live next to this file)
board_v3_md.write(doc, SHOTS, A, NEEDS, PROD, glen, tc)
report()
