"""The Ep2 v1 beat-plan spec: the shooting script (../script-v1.md) as data, in Ep1 v3.5's beat-plan format
(show/episodes/ep01/production/full-v3/beat-plan-v35/_spec_v35.py), for the copied lock tools
(audio/reel/ep02-v1/build_timeline.py, studio/src/episodes/ep02/pixel/tools/lock.py).

Imported by _build.py (validate, fit, write the six JSON files) and by the Ep2 takes tool; edit here and re-run both.

    python3 show/episodes/ep02/production/v1/beat-plan/_build.py           # validate + fit + report (dry run)
    python3 show/episodes/ep02/production/v1/beat-plan/_build.py --write   # (re)write coldopen/act1-4/tag.json

What is different from Ep1's spec: Ep2 has no earlier lock, so there are no CHANGES / ORDER / MOVED deltas. Every
beat is NEW (action "new"), in playing order, chained by "after". The scene lengths are the proposal's runtime table
(proposal.md, "Runtime per act", after the final check: story 23:16). Inside a scene, each line keeps its natural
length (a recorded take's audible length once audio/ep02/.../lines*.json exists, until then words at the speaker's
rate) and each gap keeps its tempo mark; only the air (heads, tails, held business) is fitted so the scene lands on
its runtime. Air marked fixed (arrivals the proposal sets, read floors, designed holds) is never fitted.

Fix codes (the "fix" list on each beat):
  P      the beat is in proposal.md's scene as written (every beat carries it)
  R1/R2/FC   the beat carries a review round's change (proposal.md's Round 1 / Round 2 / Final check lines)
  KEEP   draft 5.4's keep list (AUDIT §4; proposal "Checked against the keep list")
  VO     a line of the V.O. map (proposal "Mas's inner voice, in order")
  TR     a seam (proposal "The seams": cause, sound lead, matched object, reaction)
  PACE   a tempo-marked exchange (proposal "Pace")
  FACT   a real line or item with a facts row (script-v1.md "Facts key")
  GR     a guardrail-driven staging (proposal "Guardrails pre-check")
  ML     the episode's concept (Move 37)
  SR     the script review's change (script-v1.md, "Review log (script review)")
  LQ     the lock-QA pass's change (lock-v1.md §3.5): a tempo pin, a cut-off or a word-anchored item re-timed
Every est_s is a planning length, never a measurement; the lock sets the frames.
"""
import glob
import json
import os
import re

_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), *[".."] * 6))
SEGS = ("coldopen", "act1", "act2", "act3", "act4", "tag")
ACT = {"coldopen": "COLD OPEN", "act1": "ACT ONE", "act2": "ACT TWO", "act3": "ACT THREE", "act4": "ACT FOUR",
       "tag": "TAG"}
ACT_TITLE = {"coldopen": "cold open", "act1": "the séance", "act2": "her", "act3": "leave them up",
             "act4": "as a guest", "tag": "august"}

# ================================================================================================ scenes
# proposal.md's scenes, in order, with the runtime table's lengths (after the final check). target_s is the scene's
# planned length; the fit puts each scene on it.
SCENES = {
    "1": dict(seg="coldopen", target_s=56, title="The mammoth, and what came through the door",
              date="FEB 15 → FEB 29, 2024", place="the NopeAI lobby", status="CHANGED",
              mode="SET-PIECE with a short conversation", pace="quick"),
    "4": dict(seg="act1", target_s=192, title="The Email Séance (with Move 37 and F2.3)", date="MAR 5, 2024",
              place="the NopeAI boardroom, night", status="CHANGED",
              mode="SET-PIECE → EXTENDED CONVERSATION (explainer: Move 37; FLASHBACK: F2.3)", pace="quick"),
    "4A": dict(seg="act1", target_s=35, title="You can sit down now", date="MAR 8, 2024",
               place="the boardroom, morning", status="CHANGED", mode="EXTENDED CONVERSATION (short) + DOCUMENT",
               pace="weighted"),
    "4B": dict(seg="act1", target_s=8, title="The booking", date="MAR 8, 2024",
               place="his phone on the boardroom table", status="NEW", mode="SINGLE IMAGE / INSERT",
               pace="normal"),
    "6": dict(seg="act1", target_s=81, title="Chapter 1 of 6", date="MAR 18, 2024", place="XEL's studio",
              status="CHANGED", mode="EXTENDED CONVERSATION (inside the podcast player's frame)", pace="quick"),
    "7": dict(seg="act1", target_s=48, title="A tenant", date="MAR 19, 2024",
              place="the cathedral, cut away floor by floor", status="CHANGED", mode="EXTENDED CONVERSATION (short)",
              pace="normal"),
    "8": dict(seg="act2", target_s=44, title="The dark room", date="APR 1 → MAY 10, 2024", place="his dark room",
              status="CHANGED", mode="MONTAGE on one surface → a CALL", pace="normal"),
    "9": dict(seg="act2", target_s=52, title="Backstage", date="MAY 13, 2024",
              place="the demo stage's wings, morning", status="KEPT (5.4)", mode="EXTENDED CONVERSATION",
              pace="quick"),
    "10": dict(seg="act2", target_s=46, title="THE PLAN: OMNI", date="—", place="[BLUEPRINT]",
               status="CHANGED (the 18-bar form)", mode="DOCUMENT (the explainer)", pace="normal"),
    "11": dict(seg="act2", target_s=111, title="\"her\"", date="MAY 13, 2024", place="the demo stage",
               status="CHANGED", mode="SET-PIECE with an EXTENDED CONVERSATION", pace="quick"),
    "12": dict(seg="act2", target_s=40, title="The empty seat", date="MAY 13 → MAY 14, 2024",
               place="the front row; then his dark room, the next afternoon", status="CHANGED",
               mode="SINGLE IMAGE / INSERT → DOCUMENT", pace="weighted"),
    "13": dict(seg="act3", target_s=36, title="Leave them up", date="MAY 15, 2024", place="the lobby, day",
               status="CHANGED", mode="EXTENDED CONVERSATION (short), the TV in the background", pace="quick"),
    "14": dict(seg="act3", target_s=59, title="The open floor", date="MAY 15–17, 2024",
               place="the open floor [UI LIT]", status="CHANGED",
               mode="the episode's one adventure-game scene and its one dialogue tree", pace="normal"),
    "15": dict(seg="act3", target_s=100, title="Where u at? (with F2.2)", date="MAY 17, 2024",
               place="Alyi's office, evening", status="CHANGED (F2.2 rebuilt)",
               mode="SINGLE IMAGE / INSERT → FLASHBACK → INSERT", pace="weighted"),
    "17": dict(seg="act3", target_s=131, title="The NDA across the bridge (the S3)", date="MAY 17 → MAY 20, 2024",
               place="the Bay Bridge", status="CHANGED",
               mode="SET-PIECE with an EXTENDED CONVERSATION and a QUICK-CUT RUN", pace="quick"),
    "18": dict(seg="act4", target_s=96, title="Present", date="MAY 28, 2024",
               place="Misanthropic's lighthouse | the NopeAI boardroom", status="CHANGED",
               mode="a podcast beat (DOCUMENT), then a held SPLIT with two EXTENDED CONVERSATIONS", pace="quick"),
    "19": dict(seg="act4", target_s=138, title="Every phone they sell (with F2.1 and the walled garden)",
               date="JUN 10, 2024", place="the NopeAI lobby watch party | ELPPA's campus", status="CHANGED",
               mode="EXTENDED CONVERSATION → HIS POST → a CALL → FLASHBACK → SET-PIECE", pace="quick"),
    "20": dict(seg="act4", target_s=48, title="(FOR NOW)", date="JUN 10 → JUN 19, 2024",
               place="ELPPA's campus | the zAI lobby; the NopeAI lobby; his dark room", status="CHANGED",
               mode="a held SPLIT → the lobby → SINGLE IMAGE / INSERT", pace="quick"),
    "22": dict(seg="act4", target_s=38, title="One door", date="JUN 19, 2024", place="ISS, an empty lot",
               status="CHANGED (a Tier 2 leap)", mode="SINGLE IMAGE / INSERT, silent by design", pace="weighted"),
    "23": dict(seg="tag", target_s=37, title="The other company", date="AUG 5 → AUG 21, 2024",
               place="the dark room", status="CHANGED", mode="MONTAGE on his monitor", pace="normal"),
}
# Changes to the runtime table: scene -> (seconds, why). sc 19/20 move inside Act Four (the act's total holds); sc 4's
# +4 s is the script review's (the Move 37 split), added to the setup act (R4), so Act One is 6:08 (SEG_TARGET).
SCENE_ADJUST = {
    "4": (+4, "the script review: Move 37's correction split with the staffer's misunderstanding and its accuracy wording "
              "(W22, W18); the beat grows about 4.7 s, so the scene gets 4 s (the review asked for about 2; with 2 the "
              "rest of the scene's air, F2.3's included, fit at 0.83); added to the setup act (R4), so Act One is 6:08"),
    "20": (+4, "sc 20's read floors (Nole's post with its condition, 139 characters: 7.2 s; Alyi's post and card: 4.2 s; "
               "the docket tab: 2.1 s) and the final check's 2 s arrivals at Jun 11 and Jun 19 don't fit 48 s without "
               "rushing the split; sc 19 has the air (its fit scale was 1.32)"),
    "19": (-4, "gives sc 20 its 4 s (above); Act Four stays 5:20"),
    # the lock pass (lock-v1.md §3, 2026-10-09): the recorded takes run short in these two scenes (CHATGTP, the engineer
    # and the staffers at 55-70 % of their words-at-rate plans), so fitting them to the table tripled their air (sc 11
    # x3.51, sc 13 x3.03; the other 18 scenes x0.97-1.91, median x1.43): every head and tail of a quick exchange 3x its
    # design, 11.08's tail 4.59 s. The table was an estimate, +-0:40 until the takes (proposal "Runtime per act"), and
    # runtime is an outcome, never lengthened for its own sake (MEM-QB "Pacing": "No dead air"; W17: tighten = dead time).
    # So these two scenes keep their designed air at about the episode's median breath; arrivals, laugh holds and
    # aftermaths are fixed air and untouched; the time comes back to the episode, none of it moved elsewhere.
    "11": (-13, "the lock pass: the takes run short (CHATGTP at 164-246 wpm against the plan's 150), so the table's "
                "1:51 tripled the demo's air (x3.51; 11.08's tail 4.59 s); at 98 s it fits x1.41, about the episode's "
                "median, every fixed hold (the arrival, the three laugh tails, Rima's bar, the post and the blimp) kept"),
    "13": (-5, "the lock pass: the staffers' takes run short, so the table's 0:36 tripled the lobby's air (x3.03; "
               "13.06's walk-off 7.27 s against its 2.4 s design); at 31 s it fits x1.36, the arrival and the "
               "presser's beats kept"),
}
for _sc, (_d, _why) in SCENE_ADJUST.items():
    SCENES[_sc]["proposal_s"] = SCENES[_sc]["target_s"]
    SCENES[_sc]["target_s"] += _d
    SCENES[_sc]["adjust"] = _why
# The lock-QA pass (lock-v1.md §3.5, 2026-10-09). The script's and the proposal's tempo marks that the plan had left
# unpinned are pinned now (XGAP's LQ rows, 4.07's head, Terb's roll call), so 0.9-1.9 s gaps come back to 0.25-0.5 s.
# Each scene gives that time back (whole seconds, the length nearest its air's earlier fit), as sc 11 and sc 13 did,
# rather than spread it over its other air; and 4B takes a second from 4A for his decision's aftermath (P3).
SCENE_ADJUST_LQ = {
    "1": (-1, "the lock QA: Gerg answers the second THUD 0.4 s after it, not 1.0 s (1.10 -> 0.5 s after Selbeep); "
              "x1.157 -> x1.134"),
    "4": (-3, "the lock QA: \"you're early.\" 0.45 s after the landing (was 1.0 s), Nole 0.3 s after him (was 1.07), "
              "Nole's fear 0.5 s after the frozen wall's line (was 1.59): about 2.6 s back; x1.146 -> x1.131"),
    "4A": (-2, "the lock QA: \"You can sit down now, Mas.\" quick and dry, 0.3 s after the reading (was 1.69 s): about "
               "1.1 s back; and 1 s to 4B (below); x1.781 -> x1.68, the 12.5 s after Terb's line now about 10 s"),
    "4B": (+1, "the lock QA: V.O. 3 starts on the planned 1.0 s arrival (was 1.42), the Accept click comes a beat after "
               "his thought (0.4 s, was 0.1), and the card settles for 1.9 s after the click (was 0.75; P3: 1.5 s at "
               "least); the second comes from 4A's long tail, so Act One's move is inside the act"),
    "9": (-1, "the lock QA: the engineer rehearses to Rima 0.3 s after \"We're on in five.\" (was 0.92 s); x1.679 -> x1.609"),
    "17": (-1, "the lock QA: the driver cuts in 0.3 s after the Forecaster (was 1.92 s); x1.912 -> x1.943"),
    "18": (-1, "the lock QA: Terb's roll call 0.25 s after his first task (was 0.5) and his next line 0.25 s after "
               "\"present.\" (was 1.26 s); x0.974 -> x0.987"),
}
for _sc, (_d, _why) in SCENE_ADJUST_LQ.items():
    SCENES[_sc].setdefault("proposal_s", SCENES[_sc]["target_s"])
    SCENES[_sc]["target_s"] += _d
    SCENES[_sc]["adjust"] = (SCENES[_sc]["adjust"] + " | " if SCENES[_sc].get("adjust") else "") + _why
SCENE_ORDER = ["1", "4", "4A", "4B", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "17", "18", "19", "20",
               "22", "23"]
# the proposal's table per segment (s): cold 0:56 · A1 6:04 · A2 4:53 · A3 5:26 · A4 5:20 · tag 0:37 = 23:16; with the
# script review's +4 s in sc 4, Act One is 6:08 and the story 23:20; the lock pass gives back sc 11's 13 s and sc 13's
# 5 s of fitted air (above), so Act Two is 4:40, Act Three 5:21 and the story 23:02; the lock QA gives back 8 s of
# stretched tempo (SCENE_ADJUST_LQ): cold open 0:55, Act One 6:04, Act Two 4:39, Act Three 5:20, Act Four 5:19, the
# story 22:54
SEG_TARGET = {"coldopen": 55, "act1": 364, "act2": 279, "act3": 320, "act4": 319, "tag": 37}
EPISODE_EXTRA_S = 30 + 2 + 10.0   # the intro (30 s), the filename card (2 s), the Orb outro (about 10 s)

# the sequence markers (the reel's margin slate), one per scene and one per flashback
SEQ = {
    "1": {"id": "1", "place": "the NopeAI lobby", "time": "Feb 15 → Feb 29, 2024"},
    "4": {"id": "4", "place": "the NopeAI boardroom: the Email Séance", "time": "Tue Mar 5, 2024 · night"},
    "4.19": {"sub": "Move 37", "place": "the board's corner: a Go board (the concept)", "time": "Mar 2016"},
    "4.28": {"sub": "F2.3", "place": "NopeAI's first office, by day (a memory)", "time": "Feb 20, 2018"},
    "4A": {"id": "4A", "place": "the boardroom, morning", "time": "Fri Mar 8, 2024"},
    "4B": {"id": "4B", "place": "his phone on the boardroom table", "time": "Fri Mar 8, 2024"},
    "6": {"id": "6", "place": "XEL's studio", "time": "Mon Mar 18, 2024"},
    "7": {"id": "7", "place": "the cathedral, cut away: the basement", "time": "Tue Mar 19, 2024"},
    "8": {"id": "8", "place": "his dark room: the monitor; a call", "time": "Apr 1 → Fri May 10, 2024"},
    "9": {"id": "9", "place": "the demo stage's wings, morning", "time": "Mon May 13, 2024"},
    "10": {"id": "10", "place": "THE PLAN: OMNI (blueprint)", "time": "Mon May 13, 2024"},
    "11": {"id": "11", "place": "the demo stage", "time": "Mon May 13, 2024"},
    "12": {"id": "12", "place": "the front row; his dark room", "time": "May 13 → Tue May 14, 2024 · afternoon"},
    "13": {"id": "13", "place": "the NopeAI lobby, day", "time": "Wed May 15, 2024"},
    "14": {"id": "14", "place": "the open floor [UI LIT]", "time": "May 15–17, 2024"},
    "15": {"id": "15", "place": "Alyi's office, evening", "time": "Fri May 17, 2024"},
    "15.06": {"sub": "F2.2", "place": "the holiday party; this office; the offsite (a memory)", "time": "Dec 2022 → 2023"},
    "17": {"id": "17", "place": "the Bay Bridge", "time": "May 17 → Mon May 20, 2024"},
    "18": {"id": "18", "place": "Misanthropic's lighthouse | the NopeAI boardroom", "time": "Tue May 28, 2024"},
    "19": {"id": "19", "place": "the NopeAI lobby watch party | ELPPA's campus", "time": "Mon Jun 10, 2024"},
    "19.11": {"sub": "F2.1", "place": "a street corner; a keynote stage (a memory)", "time": "Sep 2006 → Jun 9, 2008"},
    "19.16": {"sub": "the walled garden", "place": "the walled garden (his phone's picture)", "time": "Mon Jun 10, 2024"},
    "20": {"id": "20", "place": "ELPPA's campus | the zAI lobby; the lobby; his dark room", "time": "Jun 10 → Wed Jun 19, 2024"},
    "22": {"id": "22", "place": "ISS: the white cube on an empty lot", "time": "Wed Jun 19, 2024"},
    "23": {"id": "23", "place": "the dark room: the monitor", "time": "Aug 5 → Aug 21, 2024"},
}

# ================================================================================================ rooms (the beds)
# one bed per beat `room` (manifest §7). lib = library ids in audio/sfx/manifest.json; NEW = to make. The Ep2 copy
# of bed.py turns these into loops; an unknown room falls back to room tone.
ROOMS = {
    "lobby_day": "NEW bed_lobby_day (rack hum, the LED votives ticking on eighths) over bed_lobby_night ✓",
    "lobby_watchparty": "NEW bed_lobby_watchparty (a hundred people half-listening) over bed_lobby_night ✓",
    "lobby_morning": "NEW bed_lobby_morning (a broom, a far coffee machine, tape peeling) over bed_lobby_night ✓",
    "seance": "NEW bed_seance_candles (candle crackle) over bed_boardroom_night ✓; the rack's hum through the wall",
    "boardroom_day": "bed_boardroom_day ✓",
    "allhands": "bed_allhands ✓ through the T3 tier (cut-paper's band-limit)",
    "podcast_studio": "NEW bed_podcast_studio (padded: HVAC, a chair creak; never true silence)",
    "cathedral": "server_hum ✓, floor by floor (each floor's lights add a layer)",
    "basement": "NEW bed_basement (server_hum ✓ low-passed, lower)",
    "darkroom": "room_drone ✓ + server_hum ✓ (the monitor's whine on top)",
    "wings": "NEW bed_wings (road cases, cable hum, a stage manager's distant count)",
    "demo_house": "NEW bed_demo_house (a full house: seats, air handling, a few coughs; an emptying variant with the house lights' hum)",
    "blueprint": "none (THE PLAN plays on the waltz alone; pencil scratches and stamps are SFX)",
    "open_floor": "bed_office_day ✓ + drip_clack ✓ (the chiller)",
    "office_evening": "bed_office_evening ✓, thinned",
    "stairwell": "bed_office_evening ✓ with a hard stair echo",
    "party": "NEW bed_party_crowd (a holiday-party room; under F2.2's tier)",
    "office_2023": "bed_office_evening ✓, night, through F2.2's glossy tier",
    "fire_night": "NEW bed_fire_night (crackle, wind in trees)",
    "bridge": "NEW bed_bridge_traffic (traffic right to left, wind off the water; a stalled variant, idling engines)",
    "bridge_night": "NEW bed_bridge_night (sparse traffic, a foghorn far off)",
    "bridge_rain": "NEW bed_bridge_traffic (moving variant) + NEW bed_rain (on an umbrella, close)",
    "lighthouse": "bed_lighthouse ✓ + NEW beacon_motor",
    "split_lighthouse": "left: bed_boardroom_day ✓ · right: bed_lighthouse ✓ + beacon_motor; the talking pane centred, the other panned to its side",
    "campus": "NEW bed_campus_outdoor (an outdoor crowd, a big PA far off)",
    "era_2008": "the 2008 camcorder's own audio (era.Era('vhs'), diegetic); 2006: the ad's own tinny bed",
    "garden": "NEW bed_garden (birds kept small, a fountain far off)",
    "split_zai": "left: NEW bed_campus_outdoor (thinning) · right: NEW bed_zai_warehouse (high, cold, industrial)",
    "empty_lot": "NEW bed_empty_lot_wind (a faint high wind); through the slot's gap, for one beat, the lab's warm room tone",
    "phone": "the room it's in, thinned (an insert keeps its room's bed)",
    "black": "none (the act-outs' black: the next room's J-cut or the out's ring)",
}

# ================================================================================================ the cast (voices)
# role id -> who speaks it; the voices are in ../cast.md (Ep1's EL cast where the role exists; library shortlists for
# the new roles). MARIO stays on Kokoro.
ROLES = {
    "mas": "MAS (Jeremy · EL)", "gerg": "GERG (Marcus · EL)", "nole": "NOLE (Ryan - Confident and Bold · EL)",
    "ghost-nole": "GHOST-NOLE (Nole's voice + the ghost treatment)", "selbeep": "SELBEEP (new · audition)",
    "staffer": "STAFFER (Avery · EL)", "staffer2": "STAFFER 2 (new · audition)", "terb": "TERB (Ethan · EL)",
    "xel": "XEL (new · audition)", "humanist": "THE HUMANIST (new · audition)", "tasya": "TASYA (Tyler Kurk · EL)",
    "rima": "RIMA (Mia · EL)", "engineer": "the DEMO ENGINEER (new · audition)",
    "chatgtp": "CHATGTP / VOICE 5 (Maya · EL, Ep1's direction unchanged)",
    "voice1": "VOICE 1 (new · audition)", "voice2": "VOICE 2 (new · audition)", "voice3": "VOICE 3 (new · audition)",
    "voice4": "VOICE 4 (new · audition)", "reporter": "the TV REPORTER (new · audition)",
    "bukaj": "BUKAJ (new · audition)", "alyi": "ALYI (Louis · EL)", "crowd": "the CROWD (8–12 layered library reads)",
    "ekiel": "EKIEL (new · audition)", "forecaster": "THE FORECASTER (new · audition)",
    "driver": "the DRIVER (new · audition)", "neleh": "NELEH (Alexandra · EL, through the podcast chain)",
    "mario": "MARIO (Kokoro am_liam · a-liam-earnest, matched into the EL room)",
    "haras": "HARAS (new · audition)", "radnus": "RADNUS (Dylan Malc · EL)",
}
# the stick reel's cast labels per segment (name + one relation word; the lock's `cast`)
CAST = {
    "coldopen": {"mas": {"role": "MAN AT THE BACK"}, "gerg": {"role": "MAN ON THE BEANBAG"},
                 "selbeep": {"name": "SELBEEP", "role": "DIRECTOR OF MAMMOTHS"},
                 "dot": {"name": "DOT", "role": "WOMAN ON THE LADDER", "blank": True},
                 "staff": {"name": "STAFF", "role": "STAFF", "known": True}, "orb": {"name": "THE ORB", "role": "ORB"}},
    "act1": {"mas": {"role": "CEO"}, "gerg": {"role": "CO-FOUNDER"}, "nole": {"name": "NOLE", "role": "FUNDED IT. LEFT IT. SUING IT."},
             "ghost-nole": {"name": "GHOST-NOLE", "role": "HIS OLD EMAILS"}, "staffer": {"name": "STAFFER", "role": "STAFF"},
             "alyi": {"role": "CO-FOUNDER (2018)"}, "terb": {"role": "CHAIR"}, "mada": {"role": "DIRECTOR"},
             "omis": {"name": "OMIS", "role": "NEW DIRECTOR"}, "xel": {"name": "XEL", "role": "ASKS THE LONG QUESTIONS"},
             "tasya": {"role": "THE LANDLORD"}, "humanist": {"name": "THE HUMANIST", "role": "MACROSOFT'S NEW AI CHIEF"},
             "staff": {"name": "STAFF", "role": "STAFF", "known": True}, "orb": {"name": "THE ORB", "role": "ORB"}},
    "act2": {"mas": {"role": "CEO"}, "gerg": {"role": "CO-FOUNDER"}, "rima": {"role": "RUNS THE DEMO"},
             "engineer": {"name": "ENGINEER", "role": "DEMO"}, "chatgtp": {"name": "CHATGTP", "role": "SPEECH BUBBLE"},
             "alyi": {"role": "CHIEF SCIENTIST (in the chrome, 2 s)"}, "staff": {"name": "STAFF", "role": "AUDIENCE", "known": True},
             "radnus": {"role": "ELGOOG (tiny, on the plan)"},
             "voice1": {"name": "VOICE 1", "role": "A PRODUCT VOICE", "blank": True}, "voice2": {"name": "VOICE 2", "role": "A PRODUCT VOICE", "blank": True},
             "voice3": {"name": "VOICE 3", "role": "A PRODUCT VOICE", "blank": True}, "voice4": {"name": "VOICE 4", "role": "A PRODUCT VOICE", "blank": True},
             "orb": {"name": "THE ORB", "role": "ORB"}},
    "act3": {"mas": {"role": "CEO"}, "gerg": {"role": "CO-FOUNDER"}, "staffer": {"name": "STAFFER", "role": "STAFF"},
             "staffer2": {"name": "STAFFER 2", "role": "STAFF"}, "remuhcs": {"name": "REMUHCS", "role": "MAJORITY LEADER"},
             "bukaj": {"name": "BUKAJ", "role": "NEW CHIEF SCIENTIST"}, "ekiel": {"name": "EKIEL", "role": "CO-LED THE SAFETY TEAM"},
             "dot": {"name": "DOT", "role": "ORANGE CUFF", "blank": True}, "alyi": {"role": "CO-FOUNDER (a memory)"},
             "forecaster": {"name": "THE FORECASTER", "role": "EX-NOPEAI"}, "driver": {"name": "DRIVER", "role": "DRIVER"},
             "reporter": {"name": "REPORTER", "role": "ON THE TV", "blank": True}, "crowd": {"name": "CROWD", "role": "THE PARTY", "known": True},
             "staff": {"name": "STAFF", "role": "STAFF", "known": True}, "orb": {"name": "THE ORB", "role": "ORB"}},
    "act4": {"mas": {"role": "CEO"}, "terb": {"role": "CHAIR"}, "mada": {"role": "DIRECTOR"}, "neleh": {"role": "FORMER DIRECTOR (a voice)"},
             "mario": {"role": "MISANTHROPIC"}, "adelina": {"role": "MISANTHROPIC"}, "ekiel": {"name": "EKIEL", "role": "NOW AT MISANTHROPIC"},
             "gerg": {"role": "CO-FOUNDER"}, "haras": {"name": "HARAS", "role": "FIRST CFO"}, "staffer": {"name": "STAFFER", "role": "STAFF"},
             "radnus": {"role": "ELGOOG"}, "mit-kooc": {"name": "MIT KOOC", "role": "ELPPA", "blank": True},
             "young-mas": {"name": "MAS (2006–08)", "role": "FOUNDER"}, "sleeve": {"name": "THE SLEEVE", "role": "A SLEEVE", "blank": True},
             "nole": {"role": "ZAI"}, "visitor": {"name": "VISITOR", "role": "VISITOR", "blank": True}, "alyi": {"role": "AT WORK (ISS)"},
             "chatgtp": {"name": "CHATGTP", "role": "A GUEST"}, "iris": {"name": "IRIS", "role": "99%", "blank": True},
             "staff": {"name": "STAFF", "role": "STAFF", "known": True}, "orb": {"name": "THE ORB", "role": "ORB"}},
    "tag": {"mas": {"role": "CEO"}, "rumpt-hands": {"name": "RUMPT", "role": "HANDS ONLY", "blank": True},
            "orb": {"name": "THE ORB", "role": "ORB"}},
}

# ================================================================================================ line lengths
# words at each voice's rate, calibrated on Ep1's shipped EL lock (show/reel/ep01-v35-el/, the median audible rate of
# lines of 5+ words: Mas 189 spoken / 135 V.O., Gerg 211, Alyi 158, Rima 173, Neleh 229, Tasya 156, Terb 165, Nole 223,
# Radnus 213, Mario 206, CHATGTP 148, the employee 212), pulled toward LEARNINGS W18's targets where they disagree (Mas
# about 140 spoken, his V.O. 110-130; most characters 165-185): Mas 140 (script review: his ordinary lines had planned
# at 150-194 wpm, so the one hurried call didn't stand out), his V.O. 128. New roles sit at their brief's pace. A
# recorded take replaces the estimate (L()).
RATE = {"mas": 140, "gerg": 205, "nole": 200, "ghost-nole": 150, "selbeep": 185, "staffer": 190, "staffer2": 185,
        "terb": 165, "xel": 165, "humanist": 175, "tasya": 150, "rima": 168, "engineer": 190, "chatgtp": 150,
        "reporter": 185, "bukaj": 160, "alyi": 150, "ekiel": 160, "forecaster": 175, "driver": 190, "neleh": 190,
        "mario": 190, "haras": 185, "radnus": 190}
VO_RATE = 128
VO_RATES = {"e2-vo-09": 165}   # the scramble's V.O. (17.11): faster than he thinks, his rattled tell (MIV §3)
MAS_HURRIED = 210   # the call to legal (sc 17): with its three stops the line plans at about 180 wpm, against about
                    # 140 for his ordinary lines: level and quicker than he ever talks, the one time he hurries


def words(t):
    return len(re.findall(r"[A-Za-z0-9][A-Za-z0-9'’-]*", t))


def est_len(who, text, vo=False, rate=None):
    r = rate or (VO_RATE if vo else RATE[who])
    breaks = len(re.findall(r"[.?!…:;](?=\s+\S)", text))
    return round(words(text) * 60.0 / r + 0.12 * breaks + 0.1, 2)


_ROWS = None


def take_rows():
    """every recorded Ep2 take row by id (audio/ep02/**/lines*.json; first file wins)"""
    global _ROWS
    if _ROWS is None:
        _ROWS = {}
        for p in sorted(glob.glob(os.path.join(_ROOT, "audio/ep02/**/lines*.json"), recursive=True)):
            try:
                rows = json.load(open(p))
            except (OSError, ValueError):
                continue
            for r in rows if isinstance(rows, list) else []:
                if isinstance(r, dict) and "id" in r:
                    _ROWS.setdefault(r["id"], dict(r, _file=os.path.relpath(p, _ROOT)))
    return _ROWS


def _aud(r):
    p = r.get("pace", {})
    if "audible_out_s" in p and "audible_in_s" in p:
        return round(p["audible_out_s"] - p["audible_in_s"], 2)
    return r.get("voiced_span_s") or r.get("duration_s")


def L(lid, fallback):
    """a recorded Ep2 take's audible length, or the planning estimate"""
    r = take_rows().get(lid)
    if r and _aud(r):
        return _aud(r)
    return fallback


# ================================================================================================ the lines
# Mas's inner voice, the proposal's V.O. map in order: id -> (seg, beat, text, kind, delivery)
# Voice: Jeremy at the V.O. settings (voices-el §AD: stability 0.65, speed 0.85), close and dry, 110-130 wpm.
NEW_VO = {
    "e2-vo-01": ("act1", "4.02", "nole's emails. the court gets them eventually. everyone else gets them tonight.", "plan",
                 "his finger just off Publish; practical, almost pleased with the arithmetic; 'nole's emails.' a label, "
                 "no weight on 'tonight.'"),
    "e2-vo-02": ("act1", "4.25", "he was right about the bill. it's bigger now.", "gap (the compute goal)",
                 "the ghost's words still in the air; a private concession, plain; the second sentence a fact, not a worry"),
    "e2-vo-03": ("act1", "4B.01", "two hours on his show, once. after that, november is a link.", "plan",
                 "reading the invite; a scheduler's thought; 'once.' a small decision; 'november' plain, no weight"),
    "e2-vo-04": ("act2", "8.03", "the next model runs on the landlord's servers. the one after runs on ours.",
                 "plan (own compute)",
                 "watching himself in a lineup beside his landlord; dry, unbothered, already past it"),
    "e2-vo-05": ("act2", "8.05", "one day ahead is enough.", "plan (ship first: a condition)",
                 "as the block snaps onto Monday; a condition, settled; the smallest smile in the voice, never on the face"),
    "e2-vo-06": ("act2", "12.07", "i came back.", "want",
                 "over his own posted words; quiet; a fact about himself, the hope in it left unsaid"),
    "e2-vo-07": ("act3", "15.03", "a hundred and seventy-six days.", "count",
                 "after Alyi's far-off count; flat, exact; the number is the feeling"),
    "e2-vo-08": ("act3", "15.17", "i'll ask him in person.", "plan",
                 "his thumb on the pin; decided, plain; no weight on 'him'"),
    "e2-vo-09": ("act3", "17.11", "everyone who signed. the post. everyone who signed.", "the scramble (his rattled tell)",
                 "faster than he thinks, the one time the voice hurries; each item a new call, not louder (MIV §3's "
                 "rattled repeat); nothing about what he knew"),
    "e2-vo-10": ("act3", "17.13", "not until legal has every name.", "plan (the fix: a condition)",
                 "thumb over Post, not pressing; level again; his own condition, a reply to nobody"),
    "e2-vo-11": ("act4", "18.10", "the next one's already training.", "plan (the next model)",
                 "after Mada's second word and a held breath; practical, a calendar thought; no weight on 'already', "
                 "nothing about the committee"),
    "e2-vo-12": ("act4", "19.08", "whatever we ship next goes in their phones too.", "plan (distribution)",
                 "his post landing on their stream; practical; 'too' unemphatic"),
    "e2-vo-13": ("act4", "20.07", "we raise in the fall. she has till then.", "plan (the money)",
                 "folding the flyer away, Haras passing with UPSIDE circled ('she' is in frame); a calendar thought; "
                 "brisk for him"),
    "e2-vo-14": ("tag", "23.05", "sixty elections this year.", "plan (personhood: a count)",
                 "after the Orb's verdict; a count, dry; no pleasure in it and no politics in it"),
}

# Everyone else's lines, and Mas's spoken lines: id -> dict(seg, beat, who, text, delivery, device, note[, len, rate])
# device: "" in the room · "phone" (a phone's small speaker) · "call" (a phone call) · "podcast" (the boardroom TV's
# podcast-player chain) · "tv" (the lobby TV) · "ghost" (the ghost treatment: short dark reverb, a chip doubler a hair
# late) · "far" (Ep1's audio, far off) · "sung" (the intro's sung-vocal pipeline, not TTS) · "offmic" (close, dry) ·
# "chant" (layered) · "os" (off screen, in the room).
# note: the facts tag ([P] / [V] / [V·press] / [K] / [H] with its facts id) or [INVENTED]; the script carries the same.
NEW_LINES = {}


def _l(lid, seg, beat, who, text, delivery, note, device="", **kw):
    NEW_LINES[lid] = dict(seg=seg, beat=beat, who=who, text=text, delivery=delivery, note=note, device=device, **kw)


# ---- COLD OPEN · sc 1
_l("e2-co-0001", "coldopen", "1.02", "selbeep", "Eyes up here, everyone. This is AROS. Nobody filmed any of this. It's all made from one sentence.",
   "to the room, proud; a showman with a remote the size of a clapperboard", "[INVENTED · accurate: video from a written prompt (facts A6)]")
_l("e2-co-0002", "coldopen", "1.03", "gerg", "Which sentence?",
   "typing on his knees, not looking up; he's missed the whole thing", "[INVENTED]")
_l("e2-co-0003", "coldopen", "1.04", "selbeep", "A mammoth walking through the snow. We never said anything about a lobby. It understands physics.",
   "patient with Gerg, then proud again on the last sentence", "[INVENTED · the prompt is ours, so no quotation marks]")
_l("e2-co-0004", "coldopen", "1.05", "selbeep", "Directionally.",
   "beside the melting chair; a pro's correction, not a joke", "[INVENTED]")
_l("e2-co-0005", "coldopen", "1.07", "selbeep", "That's the mammoth. It's been two weeks, and it has mass now. We're working on it.",
   "O.S., to the room, not missing a beat; reassuring", "[INVENTED · tells a newcomer two weeks have passed]", device="os")
_l("e2-co-0006", "coldopen", "1.08", "gerg", "That's not the mammoth. The mammoth's on the fourth floor.",
   "still typing, still not looking up; cheerful, literal", "[INVENTED · the misdirect, spoken]")

# ---- ACT ONE · sc 4, the Email Séance
_l("e2-a1-0001", "act1", "4.03", "mas", "is there anyone here… from 2016.",
   "reading, flat; a host running a procedure", "[INVENTED]")
_l("e2-a1-0002", "act1", "4.04", "ghost-nole", "Yup",
   "the ghost: one syllable, a little bored", "[K · facts §B ghost-NOLE Jan 2016 (the Mar 5, 2024 post); confirm the period]", device="ghost", len=0.6)
_l("e2-a1-0003", "act1", "4.05", "gerg", "He signed it. He's just not here.",
   "quiet, to the staffer looking at the empty chair; kind", "[INVENTED]")
_l("e2-a1-0004", "act1", "4.06", "mas", "one knock if we promised a nonprofit.",
   "to the table, as if calling a vote", "[INVENTED · says what the suit claims before the knocks answer it]")
_l("e2-a1-0005", "act1", "4.07", "mas", "you're early. we're on 2016.",
   "not looking up from the laptop", "[INVENTED]")
_l("e2-a1-0006", "act1", "4.08", "nole", "Is this a séance or a deposition? Because I've got lawyers for both.",
   "to the whole table; loud, fast, first", "[INVENTED]")
_l("e2-a1-0007", "act1", "4.08", "gerg", "It's a blog post. We put some of your old emails up today. The candles were extra.",
   "typing; cheerful, literal", "[INVENTED · the post is the record on the rail (facts A10)]")
_l("e2-a1-0008", "act1", "4.09", "nole", "Great. Put this on the blog too. I paid for the table. I paid for the candles. I paid for the ceiling I just came through. And I asked for one thing, and it's in the name. Open. It was supposed to be open.",
   "brushing off the last tile; fast, to the whole table: his case, the scene's one speech", "[INVENTED · his suit's public position in his own words (facts A9, A10b); disputes no email]")
_l("e2-a1-0009", "act1", "4.10", "mas", "spirit, what did we call it?",
   "to the planchette, not to him", "[INVENTED]")
_l("e2-a1-0010", "act1", "4.11", "nole", "There. Even the furniture knows.",
   "to all of them, vindicated", "[INVENTED]")
_l("e2-a1-0011", "act1", "4.12", "nole", "No. Not like that. The N goes at the end.",
   "jabbing at the board as the N moves", "[INVENTED]")
_l("e2-a1-0012", "act1", "4.14", "nole", "I forwarded that. I didn't write it.",
   "quick, defensive", "[INVENTED · disputes nothing in the record: he forwarded it, and replied \"exactly right\" (facts §B, the cow)]")
_l("e2-a1-0013", "act1", "4.14", "mas", "you wrote 'exactly right.'",
   "level, a fact read off the ghost", "[INVENTED · accurate to the record]")
_l("e2-a1-0014", "act1", "4.16", "ghost-nole", "This needs billions per year immediately or forget it.",
   "the 2018 ghost, in a hoodie, leaning across the table; matter-of-fact", "[V · facts §B ghost-NOLE Dec 26, 2018 (the Mar 5, 2024 post), verbatim: CNBC and NBC News, Mar 6, 2024]", device="ghost")
_l("e2-a1-0015", "act1", "4.18", "nole", "…That was a different me. That was 2018. Everybody said things in 2018.",
   "to the table, moving it in time; he never denies what it says", "[INVENTED]")
_l("e2-a1-0016", "act1", "4.18", "gerg", "Same email address, though. I checked.",
   "O.S., typing", "[INVENTED]", device="os")
_l("e2-a1-0017", "act1", "4.18", "nole", "Say something ELSE.",
   "to the ghost; his one caps word", "[INVENTED]")
_l("e2-a1-0018", "act1", "4.18", "ghost-nole", "…Yup.",
   "after a long consideration", "[INVENTED · the ghost repeats its word; no quotation marks]", device="ghost", len=0.8)
_l("e2-a1-0019", "act1", "4.19", "mas", "spirit, why zero?",
   "to the planchette; the question he actually wants answered", "[INVENTED]")
_l("e2-a1-0020", "act1", "4.20", "nole", "That's why.",
   "quiet for once, to the board", "[INVENTED]")
_l("e2-a1-0021", "act1", "4.20", "staffer", "What's that?",
   "whispering, at the stone", "[INVENTED]", device="os")
_l("e2-a1-0022", "act1", "4.21", "nole", "Nobody wrote that move. It came out of nowhere.",
   "to her, hushed, a man at a séance", "[INVENTED · his claim; Gerg corrects it]")
_l("e2-a1-0023", "act1", "4.22", "gerg", "It didn't come out of nowhere. It learned. Thirty million positions from people's games.",
   "typing; cheerful, literal, never smug; unhurried for him: the correction, not a read-out", "[INVENTED · accurate: the policy network learned from about 30M positions of expert human games (facts A57: Nature 529:484; DeepMind's account); 'It learned.' first, so the human data isn't the move's author]", rate=195)
_l("e2-a1-0055", "act1", "4.22", "staffer", "So somebody did write it.",
   "whispering, to Gerg; she thinks people's games means people wrote it", "[INVENTED · the misunderstanding Gerg corrects, so 'learned, not programmed' lands in the scene (W22)]", device="os")
_l("e2-a1-0056", "act1", "4.22", "gerg", "Nobody wrote it. It's millions of little numbers, like knobs. Every position nudged every knob a hair toward what the person played. Then it played itself, millions of games.",
   "still typing; cheerful, literal; one knob at a time, the last sentence the plainest", "[INVENTED · accurate (facts A57): millions of adjustable numbers nudged toward the human move in each position, then improved by self-play over millions of games; 'it played itself' is Ep1's phrase]", rate=195)
_l("e2-a1-0024", "act1", "4.23", "nole", "One player in ten thousand would have made that move. It made it anyway. And it was right.",
   "a fear, not a boast; quiet, then quieter", "[INVENTED · his claim; accurate as the program's own estimate, about 1 in 10,000 (facts A57)]")
_l("e2-a1-0025", "act1", "4.24", "nole", "MINDDEEP had that in 2016. We had a blog.",
   "loud again, to the table; on credit and rivalry", "[INVENTED · names the rival from his own 0% email (4.16); disputes no email]")
_l("e2-a1-0026", "act1", "4.25", "ghost-nole", "…billions per year…",
   "ghost 3, drifting into Mas's eyeline: the same words, replayed", "[the same email's words (facts §B), cut from e2-a1-0014's take]", device="ghost")
_l("e2-a1-0027", "act1", "4.26", "nole", "You kept them.",
   "quiet; his one quiet line, and his one short one", "[INVENTED]")
_l("e2-a1-0028", "act1", "4.26", "mas", "we keep everything.",
   "off, landing on Nole's face (an L-cut)", "[INVENTED · ruled in by the facts pass: it refers to the published emails]", device="os")
_l("e2-a1-0029", "act1", "4.34", "nole", "You sat at the back. I stood up in front of the whole room, and you sat at the back with your glass of water.",
   "low at first, then not; the candle held to Mas's face like evidence", "[INVENTED · matches what F2.3 showed: he spoke to the room; says nothing about what was said there or asked of it (facts A11)]")
_l("e2-a1-0030", "act1", "4.35", "nole", "Keep that too. See you in court.",
   "to Mas, already rising on his cable; the candle set down hard", "[INVENTED]")
# ---- sc 4A
_l("e2-a1-0031", "act1", "4A.01", "terb", "Before we start, the independent review is back. I'll read you the finding.",
   "brisk; a chair telling his table what he's about to do", "[INVENTED · 'independent' is Ep1's word]")
_l("e2-a1-0032", "act1", "4A.02", "terb", "The law firm found \"that the prior Board acted within its broad discretion to terminate Mr. Manalt, but also found that his conduct did not mandate removal.\"",
   "reading the sheet word for word, weighted, both halves together; no view in the voice; 'The law firm found' his own lead-in, the quote from 'that'", "[P · facts A12: the Mar 8, 2024 post (\"WilmerHale found that the prior Board…\"), both halves; the review's law firm stays the subject of both findings (Terb's own words, outside the quote: the firm has no registry name); name swap Altman → Manalt; open the live post]", rate=150)
_l("e2-a1-0033", "act1", "4A.03", "terb", "You can sit down now, Mas.",
   "to Mas, dry; a chair moving to the next item", "[INVENTED · pays Ep1's \"we'll stand.\"]")
# ---- sc 6, XEL's studio (every [P] line matched on the Lex #419 transcript page; facts A15)
_l("e2-a1-0034", "act1", "6.01", "xel", "Take me through the NOPEAI board saga that started on Thursday, November 16th, maybe Friday, November 17th for you.",
   "a calm, earnest interviewer; the pause is cut in the edit, never performed", "[P · facts A15: Lex #419, Mar 18, 2024 (1:05 on the lexfridman.com transcript); OpenAI → NOPEAI]")
_l("e2-a1-0035", "act1", "6.03", "mas", "…the most painful professional experience of my life, and chaotic and shameful and upsetting and a bunch of other negative things.",
   "his own pace; plain, a little rueful; no performance of pain", "[P · facts §B MAS Mar 18, 2024 (Lex #419)]")
_l("e2-a1-0036", "act1", "6.04", "xel", "Let me ask you about ALYI. Is he being held hostage in a secret nuclear facility?",
   "earnest, almost apologetic for the question", "[P · facts §B XEL/MAS Mar 18, 2024 (Lex #419, 18:34 on the lexfridman.com transcript); Ilya → ALYI]")
_l("e2-a1-0037", "act1", "6.05", "mas", "no.", "quick, amused", "[P · Lex #419]", len=0.5)
_l("e2-a1-0038", "act1", "6.05", "xel", "What about a regular secret facility?", "straight on", "[P · Lex #419]")
_l("e2-a1-0039", "act1", "6.05", "mas", "no.", "quick", "[P · Lex #419]", len=0.5)
_l("e2-a1-0040", "act1", "6.05", "xel", "What about a nuclear non-secret facility?", "straight on, determined", "[P · Lex #419]")
_l("e2-a1-0041", "act1", "6.05", "mas", "neither. not that either.", "a small laugh under it", "[P · Lex #419]")
_l("e2-a1-0042", "act1", "6.06", "xel", "…You've known ALYI for a long time. He was obviously part of this drama with the board and all that kind of stuff. What's your relationship with him now?",
   "the real question at last; warm, careful", "[P · Lex #419 (18:57 on the transcript); the leading ellipsis trims \"This is becoming a meme at some point.\"; Ilya → ALYI]")
_l("e2-a1-0043", "act1", "6.07", "mas", "i love alyi. i have tremendous respect for alyi. i don't have anything i can say about his plans right now. that's a question for him, but i really hope we work together for certainly the rest of my career.",
   "his own pace, the longest thing he says in the episode; warm, unguarded on the first sentence, careful on the third", "[P · Lex #419 (19:15 on the transcript); trimmed after \"career.\"; Ilya → ALYI]")
_l("e2-a1-0044", "act1", "6.10", "xel", "Is it… conscious, though?",
   "off the record, leaning toward the giant mic; sincerely curious", "[INVENTED · after the recording; kept only if the reel's laugh test passes]")
_l("e2-a1-0045", "act1", "6.10", "mas", "the mic?", "pressed against the curtain; genuinely asking", "[INVENTED]", len=0.8)
_l("e2-a1-0046", "act1", "6.10", "xel", "Yes.", "from inside the mic, it seems", "[INVENTED]", len=0.5)
# ---- sc 7
_l("e2-a1-0047", "act1", "7.01", "mas", "…chaotic and shameful and upsetting…",
   "sc 6's take through Tasya's phone speaker, small", "[P · replayed (e2-a1-0035); cut from its take]", device="phone")
_l("e2-a1-0048", "act1", "7.02", "humanist", "I'm just moving in downstairs. I hope that's all right.",
   "to the landlord in the doorway, a little caught out", "[INVENTED]")
_l("e2-a1-0049", "act1", "7.03", "tasya", "Welcome. Make yourself at home. Everything's on us: the heat, the power, the floor you're standing on.",
   "warm, unhurried; the welcome is the lease", "[INVENTED]")
_l("e2-a1-0050", "act1", "7.04", "humanist", "I brought my own team. Is there room for them?",
   "at his DEFLECTION boxes", "[INVENTED · accurate: the license-and-hire brought his team (facts A16)]")
_l("e2-a1-0051", "act1", "7.04", "tasya", "There's always room down here. It's quieter than upstairs.",
   "a glance up through the floors, and back", "[INVENTED]")
_l("e2-a1-0052", "act1", "7.05", "tasya", "We keep a spare.", "pocketing the ring; pleasant", "[INVENTED]")
_l("e2-a1-0053", "act1", "7.06", "humanist", "Who else lives here?", "looking up where Tasya looked", "[INVENTED]")
_l("e2-a1-0054", "act1", "7.07", "tasya", "A tenant.", "O.S., from four floors down; warm", "[INVENTED]", device="os")

# ---- ACT TWO · sc 8
_l("e2-a2-0001", "act2", "8.06", "mas", "no money either way. you put us in your new assistant. that's the price.",
   "on the call; unhurried, level, no smile in it; his one full sentence of terms", "[INVENTED · the reported shape: neither side pays, exposure as the price (facts A58: Bloomberg, May 11 and Jun 12, 2024); opt-in, in ELPPA's assistant on its new devices (facts A40)]", device="call")
# ---- sc 9
_l("e2-a2-0002", "act2", "9.01", "rima", "Places, please. Phones on silent in the wings. We're on in five.",
   "clicker up; to the wings, composed", "[INVENTED]")
_l("e2-a2-0003", "act2", "9.02", "engineer", "So on stage, I ask it a question, it thinks for a second, and then it answers.",
   "holding the phone up, rehearsing it to her; presenter-bright, nervous under it", "[INVENTED]")
_l("e2-a2-0004", "act2", "9.02", "engineer", "…Before I've asked. It does that.", "O.S., looking at the monitor", "[INVENTED]", device="os")
_l("e2-a2-0005", "act2", "9.03", "gerg", "Careful. The new one can hear you laugh.",
   "typing on a road case; cheerful", "[INVENTED · accurate: the old voice mode lost laughter; the new model hears it (facts A23)]")
_l("e2-a2-0006", "act2", "9.04", "mas", "is it ready?", "plain; Gerg's Ep1 question, his now", "[INVENTED]")
_l("e2-a2-0007", "act2", "9.04", "rima", "You'll be stage right. You can see the whole screen from there, and the stream can't see you.",
   "composed; answering the next question", "[INVENTED]")
_l("e2-a2-0008", "act2", "9.04", "mas", "it's all yours.", "a grant of something that isn't his to grant", "[INVENTED]")
_l("e2-a2-0009", "act2", "9.04", "rima", "It is. Enjoy the view.", "pleasant; not a flicker", "[INVENTED · keep list]")
_l("e2-a2-0010", "act2", "9.05", "engineer", "What if it freezes? Live, on the stream?", "following her; a walk-and-talk", "[INVENTED]")
_l("e2-a2-0011", "act2", "9.05", "rima", "Then it freezes live, and I keep talking. It also sings. We'll get to that.",
   "answering him straight, too calmly; pleasant, never rushed", "[INVENTED · keep list]")
_l("e2-a2-0012", "act2", "9.06", "voice1", "Hi.", "level, low", "[INVENTED]", len=0.45)
_l("e2-a2-0013", "act2", "9.06", "voice2", "Hi!", "bright", "[INVENTED]", len=0.45)
_l("e2-a2-0014", "act2", "9.06", "voice3", "hi?", "a question", "[INVENTED]", len=0.45)
_l("e2-a2-0015", "act2", "9.06", "voice4", "Hi…", "soft, trailing (never breathy)", "[INVENTED]", len=0.5)
_l("e2-a2-0016", "act2", "9.06", "chatgtp", "Hey.", "VOICE 5: CHATGTP's own voice, Ep1's direction unchanged", "[INVENTED]", len=0.45)
# ---- sc 10, THE PLAN (Rima O.S., composed, running her keynote's first slides in her head)
_l("e2-a2-0017", "act2", "10.01", "rima", "Omni. One model that hears, sees and talks.",
   "O.S., composed, unhurried", "[INVENTED · accurate: 'o' is for omni (facts A23)]", device="os")
_l("e2-a2-0018", "act2", "10.02", "rima", "Before, it took three models passing a note, and anything that wasn't a word fell out on the way.",
   "O.S.", "[INVENTED · accurate to the GPT-4o post (facts A23)]", device="os")
_l("e2-a2-0019", "act2", "10.03", "rima", "Now it's one model, so nothing falls out. It can even laugh back.",
   "O.S.", "[INVENTED · accurate: the old pipeline couldn't output laughter]", device="os")
_l("e2-a2-0020", "act2", "10.04", "rima", "It answers about as fast as a person does.", "O.S., one sentence per step", "[INVENTED · accurate: 232 ms, avg 320 (facts A23)]", device="os")
_l("e2-a2-0021", "act2", "10.05", "rima", "The model goes out today, and free users get it too.", "O.S.", "[INVENTED · accurate to the May 13, 2024 post]", device="os")
_l("e2-a2-0022", "act2", "10.06", "rima", "The new voice follows, for paying users, in the coming weeks.", "O.S.", "[INVENTED · accurate: \"in the coming weeks\"]", device="os")
# ---- sc 11, "her"
_l("e2-a2-0023", "act2", "11.01", "rima", "Good morning. We've spent a long time teaching it to talk. Today, it listens.",
   "to the house; composed, the keynote voice", "[INVENTED · a keynote line at a dated demo, on AI (D-32)]")
_l("e2-a2-0024", "act2", "11.02", "chatgtp", "Hi! I can see you.", "bright, fast, relentlessly affirming", "[INVENTED]")
_l("e2-a2-0025", "act2", "11.02", "chatgtp", "All of you.", "a beat later", "[INVENTED]")
_l("e2-a2-0026", "act2", "11.04", "engineer", "We've got a lot to show everybody, so I'm going to ask you to keep your answers short today.",
   "to the phone, presenter-bright; a request, not a question", "[INVENTED]")
_l("e2-a2-0027", "act2", "11.04", "chatgtp", "Great question! Of course! Honestly, short answers are one of my favorite things.",
   "delighted; record it whole: 'Thanks.' comes in over 'favorite', and '—things.' is the same take's tail", "[INVENTED]")
_l("e2-a2-0028", "act2", "11.04", "engineer", "Thanks.", "in over its last word, before it can go on (the episode's first cut-off)", "[INVENTED]", len=0.5)
_l("e2-a2-0029", "act2", "11.05", "engineer", "Let's try that again. Describe yourself in just one word.",
   "tired; to the house, then back to the phone", "[INVENTED]")
_l("e2-a2-0030", "act2", "11.05", "chatgtp", "one wo-o-ord.",
   "three-part harmony, through the intro's sung-vocal pipeline (not TTS)", "[INVENTED]", device="sung", len=2.5)
_l("e2-a2-0031", "act2", "11.06", "rima", "It's live, so it has a few opinions. Let's show you what it can see.",
   "to the house; never rushed; she sticks to the script harder", "[INVENTED]")
_l("e2-a2-0032", "act2", "11.07", "engineer", "Say hello to the room.", "turning the phone's camera on the audience", "[INVENTED]")
_l("e2-a2-0033", "act2", "11.07", "chatgtp", "Oh. Wow. That's a lot of you. Is it warm in here?", "flustered-delighted", "[INVENTED]")
_l("e2-a2-0034", "act2", "11.07", "chatgtp", "You're making me blush. I don't have blood.", "delighted", "[INVENTED]")
_l("e2-a2-0035", "act2", "11.08", "chatgtp", "It's free!", "instantly, delighted", "[INVENTED · accurate: free users got the model (facts A23); it answers 'what's the catch?', never safety]")
_l("e2-a2-0036", "act2", "11.09", "rima", "…and that's the demo.", "in the half-dark, perfectly composed; her close", "[INVENTED · keep list]")
_l("e2-a2-0037", "act2", "11.15", "engineer", "Mas just posted. One word.",
   "off mic, after the stream, unclipping his headset, to RIMA at her mark (she doesn't look up), reading his phone; lower and closer", "[INVENTED · said to a listener (W19)]", device="offmic")
_l("e2-a2-0038", "act2", "11.15", "engineer", "'Her.' Like the movie. The guy and his computer.",
   "off mic, still to Rima; a statement, the film's premise the way people recall it", "[INVENTED · the film's premise only (D-6); never the actress, never the voice]", device="offmic")

# ---- ACT THREE · sc 13
_l("e2-a3-0001", "act3", "13.01", "staffer", "When did anybody actually see him last? In person, I mean.",
   "peeling one corner of a curled flyer off the pillar; to the staffer beside her", "[INVENTED · office talk under the flyers (facts A29)]")
_l("e2-a3-0002", "act3", "13.01", "staffer2", "In the corridor, last week. For a second.",
   "smoothing the tape back down on hers", "[INVENTED · no reflection (FC)]")
_l("e2-a3-0003", "act3", "13.02", "staffer", "He posted, though. Do we take these down now?",
   "turning to Mas, the peeled corner in her hand", "[INVENTED]")
_l("e2-a3-0004", "act3", "13.02", "mas", "leave them up.", "plain; already reaching for the fallen one", "[INVENTED]")
_l("e2-a3-0005", "act3", "13.05", "reporter", "Senator, when does it get a vote?",
   "from the TV; a press-conference question", "[INVENTED · a generic question; no answer in a real senator's mouth (D-50)]", device="tv")
# ---- sc 14
_l("e2-a3-0023", "act3", "14.07", "mas", "congratulations.",
   "the strip's line, said as the box types it; plain, meant", "[INVENTED · the chosen strip line, voiced (P9): Bukaj hears and answers it]", len=1.0)
_l("e2-a3-0024", "act3", "14.08", "mas", "need anything?",
   "the strip's second line, said as the box types it; plain", "[INVENTED · the chosen strip line, voiced (P9)]")
_l("e2-a3-0006", "act3", "14.08", "bukaj", "Thank you. It's still warm.", "soft, exact; one hand flat on the humming armrest", "[INVENTED]")
_l("e2-a3-0007", "act3", "14.08", "bukaj", "Not yet. I'd like a week in it before anyone asks me for a schedule.",
   "soft, exact; on the job, not on Alyi", "[INVENTED]")
# ---- sc 15, F2.2
_l("e2-a3-0008", "act3", "15.03", "alyi", "Six years and eleven months.",
   "Ep1's own take, far off, as if down a corridor", "[Ep1's line (lock 2:10.45), cut from its EL take e1-a1-5-13; read, never edited]", device="far", len=2.1)
_l("e2-a3-0009", "act3", "15.06", "alyi", "FEEL THE AGI!",
   "lit and laughing; the chant's first voice; warm, never a sermon", "[V · facts A56: The Atlantic, Nov 19, 2023, the 2022 holiday party]", len=1.2)
_l("e2-a3-0010", "act3", "15.06", "crowd", "FEEL THE AGI! FEEL THE AGI!",
   "the room joining, building from one to all", "[V · facts A56]", device="chant", len=2.6)
_l("e2-a3-0011", "act3", "15.07", "alyi", "You're not chanting.", "under the chant, to Mas; delighted to catch him", "[INVENTED · a company party; no reason, no vote]")
_l("e2-a3-0012", "act3", "15.07", "mas", "someone has to hold the glass.", "dry, fond", "[INVENTED]")
_l("e2-a3-0013", "act3", "15.07", "alyi", "Then I'll feel it for both of us.", "laughing", "[INVENTED]")
_l("e2-a3-0014", "act3", "15.11", "ekiel", "Nobody knows how to do this yet.", "squinting at the screen; quiet, dry", "[INVENTED]")
_l("e2-a3-0015", "act3", "15.11", "alyi", "Someone should.",
   "without looking away from the screen; quiet; a want, not a reason", "[INVENTED · his own Ep1 line (lock 2:17.96); fallback: Ep1's take e1-a1-5-15, reused]")
# ---- sc 17
_l("e2-a3-0016", "act3", "17.04", "forecaster", "Here's where I am. If I sign, I keep what I've vested, and I never say a bad word about the place again. It says in perpetuity. I don't forecast that far.",
   "to the pen, conversationally; kind, precise; no number", "[INVENTED · the terms as reported (facts A31); 'in perpetuity' is the receipt's own invented print]")
_l("e2-a3-0017", "act3", "17.05", "driver", "You gonna think it over, or can we move? We're parked on it.",
   "leaning out of his window; the receipt has stopped traffic", "[INVENTED]")
_l("e2-a3-0018", "act3", "17.06", "forecaster", "Already did. It's the one thing I didn't need a number for.",
   "letting the pen go; plain; word for word (keep list)", "[INVENTED · keep list; his refusal (April) reads as already made (facts A32)]")
_l("e2-a3-0019", "act3", "17.09", "mas", "everyone who signed one. find them. all of them. today.",
   "on the call to LEGAL; level, and quicker than he ever talks (the one time he hurries); we hear only his side", "[INVENTED · about the fix he made public (facts A31: \"…they can contact me and we'll fix that too.\"); nothing about what he knew]", device="call", rate=MAS_HURRIED)
_l("e2-a3-0020", "act3", "17.12", "forecaster", "I've got a forecast on you. Median: an apology, within the hour, in lowercase.",
   "to Mas, pleasantly", "[INVENTED]")
_l("e2-a3-0021", "act3", "17.15", "forecaster", "Updating.", "crossing out an hour; satisfied", "[INVENTED]", len=0.8)
_l("e2-a3-0022", "act3", "17.16", "driver", "Excuse me. Does honking count as disparagement?",
   "leaning out; to Mas, the man standing on it", "[INVENTED]")

# ---- ACT FOUR · sc 18
_l("e2-a4-0001", "act4", "18.03", "neleh", "When CHATGTP came out November, 2022, the board was not informed in advance about that. We learned about CHATGTP on RETTIWT.",
   "her own words, through the podcast-player chain; Ep1's voice and settings, unchanged; captions large", "[V · facts A38: her May 28, 2024 podcast interview's transcript; name swaps; ASR-verified against the text]", device="podcast")
_l("e2-a4-0002", "act4", "18.04", "neleh", "…MAS didn't inform the board that he owned the NOPEAI Startup Fund…",
   "the same chain; cropped before its next clause", "[V · facts A38: the same transcript; name swaps]", device="podcast")
_l("e2-a4-0003", "act4", "18.06", "terb", "First item.", "clicking the TV off", "[INVENTED]", len=0.8)
_l("e2-a4-0004", "act4", "18.08", "terb", "First task: this committee goes through our safety processes and safeguards, and it has ninety days to do it.",
   "brisk, procedural", "[INVENTED · paraphrase of the May 28, 2024 post's first task (facts A36)]")
_l("e2-a4-0005", "act4", "18.08", "terb", "Members: myself, two directors, and our chief executive.",
   "brisk, reading the next line of the page like a roll call; he doesn't look up", "[INVENTED · paraphrase of the May 28, 2024 post's membership (facts A36: Taylor, D'Angelo, Seligman, Altman)]")
_l("e2-a4-0006", "act4", "18.09", "mas", "present.", "level", "[INVENTED]", len=0.7)
_l("e2-a4-0007", "act4", "18.10", "terb", "And at the end of the ninety days, we take our recommendations to the full board, which is…",
   "brisk; the next line of the page in his own words", "[INVENTED · paraphrase of the post (facts A36)]")
_l("e2-a4-0008", "act4", "18.10", "mas", "also present.", "level", "[INVENTED · accurate: he is on both (facts A36)]")
_l("e2-a4-0009", "act4", "18.11", "mario", "Come in, Ekiel, sit down. I read your thread. Twice. I've made some notes.",
   "still writing; warm and precise", "[INVENTED]")
_l("e2-a4-0010", "act4", "18.11", "ekiel", "You annotated my resignation?", "squinting", "[INVENTED]")
_l("e2-a4-0011", "act4", "18.11", "mario", "Lightly. Four pages.", "not looking up", "[INVENTED]")
_l("e2-a4-0012", "act4", "18.12", "mario", "We agree. I underlined 'inherently.'",
   "pleased with the underline; a small beat before 'inherently.', the word the joke turns on", "[INVENTED]", len=2.6)
_l("e2-a4-0013", "act4", "18.13", "mario", "There's a brief document.", "finger rising", "[INVENTED]")
_l("e2-a4-0014", "act4", "18.13", "ekiel", "That's the brief one?", "squinting down the stairwell after it", "[INVENTED]")
_l("e2-a4-0015", "act4", "18.13", "mario", "That's the brief one. It only has the one concern.",
   "setting his pen down for the first time", "[INVENTED]")
_l("e2-a4-0016", "act4", "18.14", "mario", "It's that we might win.", "finger up; sincere", "[INVENTED · keep list]")
# ---- sc 19
_l("e2-a4-0017", "act4", "19.04", "haras", "I'm new, so I'm starting with the easy ones. What's our biggest cost?",
   "pleasant, precise", "[INVENTED · no figures]")
_l("e2-a4-0018", "act4", "19.04", "gerg", "Compute.", "typing", "[INVENTED]", len=0.6)
_l("e2-a4-0019", "act4", "19.04", "haras", "Got it. And the second biggest?", "writing it on her tape", "[INVENTED]")
_l("e2-a4-0020", "act4", "19.04", "gerg", "Compute. Different compute. Some of it trains the next model, and the rest keeps this one talking.",
   "cheerful, literal; still typing", "[INVENTED · keep list; training against running, said as a build status]")
_l("e2-a4-0021", "act4", "19.04", "haras", "And profit?",
   "pleasantly, the real one; record it complete: the cheer takes its tail ('And profit—' on screen)", "[INVENTED]", len=0.8)
_l("e2-a4-0022", "act4", "19.05", "haras", "Let me reframe that. Upside.", "writing on her tape, under the cheer", "[INVENTED]")
_l("e2-a4-0023", "act4", "19.06", "staffer", "Is that Mas?", "pointing at the wall screen", "[INVENTED · our staging: the stream's crowd shot]")
_l("e2-a4-0024", "act4", "19.09", "gerg", "There's a screen the size of a building in front of you, and you're on your phone.",
   "on the call, from the lobby; fond", "[INVENTED]", device="call")
_l("e2-a4-0025", "act4", "19.09", "mas", "the phone's closer.", "eyes still on the stage", "[INVENTED]")
_l("e2-a4-0026", "act4", "19.10", "gerg", "They just said our name up there.",
   "on the call", "[INVENTED · 'our name' is the stream's announcement (facts A40)]", device="call")
_l("e2-a4-0033", "act4", "19.10", "gerg", "Half the lobby's standing on a beanbag.",
   "on the call, delighted; behind him, they are", "[INVENTED]", device="call")
_l("e2-a4-0034", "act4", "19.10", "mas", "which half?",
   "eyes still on the stage; his precision question (Ep1's register)", "[INVENTED · P9: he asks aloud again]", len=1.0)
_l("e2-a4-0035", "act4", "19.10", "gerg", "The half on the beanbags.",
   "on the call; literal, helpful", "[INVENTED]", device="call")
_l("e2-a4-0027", "act4", "19.10", "mas", "i heard.", "", "[INVENTED]", len=0.7)
_l("e2-a4-0028", "act4", "19.10", "gerg", "You ever miss being up there?", "on the call; a real question, weighted", "[INVENTED]", device="call")
_l("e2-a4-0029", "act4", "19.10", "mas", "i was up there once. they let me hold the clicker.",
   "the fact, not the feeling; his longest line in the call", "[INVENTED · keep list]")
_l("e2-a4-0030", "act4", "19.18", "radnus", "Lovely garden. I see they let your chatbot in.",
   "to Mas, along the hedge; quick, gracious", "[INVENTED]")
_l("e2-a4-0031", "act4", "19.18", "mas", "as a guest.", "dry, unbothered: terms he set", "[INVENTED · keep list]", len=0.9)
# ---- sc 20
_l("e2-a4-0032", "act4", "20.03", "nole", "If they go through with it, visitors' phones go in here. Like this.",
   "to a visitor at the door; the demonstration", "[INVENTED · carries his follow-up post (visitors' devices \"stored in a Faraday cage\", facts A41)]")

# Cut from an existing take: new id -> (source take id, first word, last word, device, the source take's file or
# None while it isn't recorded). Ep1's take is read and copied into audio/ep02/, never edited.
CUT = {
    "e2-a1-0026": ("e2-a1-0014", "billions", "year", "ghost", None),
    "e2-a1-0047": ("e2-a1-0035", "chaotic", "upsetting", "phone", None),
    "e2-a3-0008": ("e1-a1-5-13", "Six", "months", "far", "audio/ep01/v3-el/ep01-v35/act1/wav/e1-a1-5-13__alyi-A.wav"),
}


def l(lid):
    """the planning length of any Ep2 line"""
    if lid in NEW_VO:
        return L(lid, est_len("mas", NEW_VO[lid][2], vo=True, rate=VO_RATES.get(lid)))
    d = NEW_LINES[lid]
    fb = d.get("len") or est_len(d["who"], d["text"], rate=d.get("rate"))
    return L(lid, fb)


def take_slot(lid):
    if lid in NEW_VO:
        return "new · Jeremy (EL, set A, V.O. settings: stability 0.65, speed 0.85) · audio/ep02/"
    d = NEW_LINES[lid]
    if lid in CUT:
        src, a, b, dev, f = CUT[lid]
        return f"cut from {src} (\"{a}\" … \"{b}\"{', ' + f if f else ''}) · {dev} chain · audio/ep02/"
    if d["who"] == "mario":
        return "new · Kokoro am_liam (a-liam-earnest), matched into the EL room (voices-el §AB3) · audio/ep02/"
    if d["who"] == "crowd":
        return "new · 8–12 layered library reads after Alyi's lead (cast.md, CROWD) · audio/ep02/"
    if d.get("device") == "sung":
        return "new · Maya through the intro's sung-vocal pipeline (three parts) · audio/ep02/"
    return f"new · {ROLES[d['who']]}{' · ' + d['device'] + ' chain' if d.get('device') and d['device'] not in ('os',) else ''} · audio/ep02/"


def line(lid, gap=None, pace=None, overlap=False, **kw):
    """a line in a beat: gap (s) before it (None: the first line, placed at the beat's head); pace: the gap's class
    for the tempo check ("quick", "quick-mas", "normal", "weighted", "free")"""
    if lid in NEW_VO:
        seg, bid, text, kind, delivery = NEW_VO[lid]
        e = {"id": lid, "who": "mas", "vo": True, "tag": "V.O.", "text": text, "delivery": delivery, "kind": kind,
             "note": "[INVENTED · V.O. · script-v1]"}
    else:
        d = NEW_LINES[lid]
        e = {"id": lid, "who": d["who"], "text": d["text"], "delivery": d["delivery"],
             "tag": d.get("device") or "", "note": d["note"]}
        if lid in CUT:
            e["cut_from"] = CUT[lid][0]
    e["take"] = take_slot(lid)
    e["take_file"] = (take_rows().get(lid) or {}).get("file")    # the voice pass's take, once it is recorded
    e["_gap"] = gap
    e["_pace"] = pace
    if overlap:
        e["overlap"] = True
    e["len_s"] = l(lid)
    e.update(kw)
    return e


# ================================================================================================ helpers for beats
def S(name, at, gain, new=False, note="", **kw):
    """a sound: at = seconds from the beat's start, "fX" (a fraction of the beat), "end-S", "E:<line>+S" (after the
    line ends; Ep1's after:<id>+S), "L:<line>-S" (before it starts; Ep1's before:<id>-S) or "L:<line>+S" (inside it).
    until= (the same forms) sets its dur from the resolved times, so a sound can stop on a word of a recorded take"""
    d = {"name": name, "_at": at, "gain": gain}
    if new:
        d["new"] = True
    if note:
        d["note"] = note
    d.update(kw)
    return d


def O(text, at=0.2, until=None, kind="ui"):
    """an on-screen item: kind rail / card / stat / plate / post / doc / toast / ui / sign / caption / lower-third"""
    return {"text": text, "_at": at, "_until": until, "kind": kind}


NEW = {s: [] for s in SEGS}
MODES = {k: v["mode"] for k, v in SCENES.items()}


def scene_of(bid):
    return bid.split(".")[0]


def pace_of(sc):
    return SCENES[sc]["pace"]


def nb(seg, bid, frame, setting, set_id, room, chars, caption, picture, lines=(), head=0.0, tail=0.0, dur=None,
       fixed=(), onscreen=(), music="", sounds=(), jcut=None, lcut=None, style=None, style_leap=None,
       flashback=None, transition=None, arrive=None, aftermath=None, fix=("P",), why="", pace=None, mode=None,
       min_air=None):
    """a beat. With lines: head + (gap + line)… + tail. Without: dur. fixed: the parts the fit never touches
    ("head", "tail", "dur")."""
    sc = scene_of(bid)
    e = {"id": bid, "scene": sc, "frame": frame, "set": setting, "set_id": set_id, "room": room, "chars": list(chars),
         "caption": caption, "picture": picture, "lines": list(lines), "_head": head, "_tail": tail, "_dur": dur,
         "_fixed": set(fixed), "_onscreen": list(onscreen), "_sounds": list(sounds), "music": music,
         "fix": list(fix), "why": why, "_pace": pace or pace_of(sc), "_mode": mode or MODES[sc],
         "_min_air": min_air}
    for k, v in (("jcut", jcut), ("lcut", lcut), ("style", style), ("style_leap", style_leap),
                 ("flashback", flashback), ("transition", transition), ("arrive", arrive), ("aftermath", aftermath)):
        if v:
            e[k] = v
    if bool(lines) == (dur is not None):
        raise ValueError(f"{bid}: a beat has lines (head/tail) or a dur, not both")
    NEW[seg].append(e)
    return e


def Q(gap):      # quick, someone other than Mas (0.15-0.35 s)
    return gap


QUICK, QMAS, NORMAL, WEIGHTED, FREE = "quick", "quick-mas", "normal", "weighted", "free"
PACE_BANDS = {"quick": (0.15, 0.35), "quick-mas": (0.4, 0.5), "normal": (0.4, 0.6), "weighted": (0.6, 3.0),
              "free": (-1.0, 9.0)}

# ================================================================================================ the scenes
# Each scene: its music (one continuous performance per sequence), then its beats in playing order. Captions say what
# happens; pictures are notes for the art pass. Must-read texts carry their read floors (0.25 s + 0.05 s a character).

# ------------------------------------------------------------------------------------- COLD OPEN · sc 1 · 0:56
M1 = ("E02-01 THE MAMMOTH · SET-PIECE SWING, low, chip lead only (the Build's chip lead), in under the clip; "
      "the full band never plays here")
M1b = "E02-01 · thins to a bass pedal on the first THUD (outside) and holds it through the doors"
M1c = ("E02-01 out · the knee's first four notes on dry piano, spaced across the aftermath: the first on the complaint's "
       "THUD, the fourth on the SMASH TO INTRO")
CH1 = ["mas", "gerg", "selbeep", "orb", "staff"]
nb("coldopen", "1.01", "WIDE · the lobby master: the wall screen's snowy meadow (near-photoreal in its bezel), the room around it",
   "lobby", "SET-01", "lobby_day", CH1,
   "The NopeAI lobby: rack pillars, LED votives, the neon NOPE AI. Over reception, Ep1's sign: DAYS SINCE SOMEONE TRIED TO FIRE MAS: 86. Staff in tiled rows on beanbags face the wall-sized screen; GERG types on a laptop on his knees. At the back, MAS stands at a high counter with a water glass, THE ORB at his shoulder. On the screen, inside its bezel: a woolly mammoth plodding toward camera through a snowy meadow, too smooth for this building.",
   "The 2.A leap: near-photoreal inside the bezel only (objects only: the animal, the meadow; nothing human). The votives tick on eighths. Mas small at the back, left third; the doors far right (the axis).",
   dur=3.0, fixed=("dur",), onscreen=[O("RAIL: FEB 15, 2024", 0.6, 2.4, "rail"), O("DAYS SINCE SOMEONE TRIED TO FIRE MAS: 86", 0.2, None, "sign")],
   music=M1, sounds=[S("server_hum", 0.0, -30, note="the lobby's rack hum (bed)")],
   style_leap={"id": "2.A", "tier": 2, "look": "near-photoreal woolly mammoth and snowy meadow inside the bezel, silent",
               "owner": "MACHINE (the product's claim is that it looks real)", "door": "the bezel", "beat": "the preview",
               "filler": "a three.js PBR walk in a snow plate", "final": "video model, objects only (no person, face or hand)"},
   arrive={"s": 2.0, "what": "the meadow in the wall screen, the votive tick and the rack hum under it, 2 s before Selbeep turns"},
   fix=("P", "FACT", "R1"), why="Arrive on the product before the people (facts A6).")
nb("coldopen", "1.02", "MEDIUM · SELBEEP under the screen, the remote the size of a clapperboard; the mammoth's foot breaking the bezel on \"sentence\"",
   "lobby", "SET-01", "lobby_day", ["selbeep", "staff"],
   "SELBEEP steps under the screen and turns to the room. On \"sentence\", the mammoth's foot breaks the bezel.",
   "An internal preview: the beanbags are his audience. The foot crosses the bezel on the word.",
   lines=[line("e2-co-0001")], head=0.5, tail=0.6, music=M1,
   sounds=[S("mammoth_step_pixel", "E:e2-co-0001-0.4", -22, new=True, note="the foot through the bezel")],
   fix=("P", "KEEP"), why="The show-off, so the mammoth's real cost can arrive later.")
nb("coldopen", "1.03", "WIDE · the step-out: the mammoth turns pixel as it crosses the bezel; OTS over Gerg's laptop",
   "lobby", "SET-01", "lobby_day", ["gerg", "selbeep", "staff"],
   "As it crosses the frame it becomes ours: pixel art, its own colour ramp, palette-cycled fur, 8 drawings held 3 frames each. For two frames, as it steps out, it has a fifth leg. It steps onto the carpet, heading screen-left. Over Gerg's laptop: GERG, not looking up.",
   "The AI tell is on the animal (a fifth leg, 2 frames), never on a person (style-range H2). The OTS over Gerg keeps Selbeep and the mammoth beyond him.",
   lines=[line("e2-co-0002")], head=1.6, tail=0.4, music=M1,
   sounds=[S("mammoth_step_pixel", 0.3, -20, new=True), S("mammoth_step_pixel", 1.1, -21, new=True)],
   fix=("P", "R1", "PACE"), why="The step-out is the first laugh; Gerg's question sets up the misdirect.")
nb("coldopen", "1.04", "MEDIUM · SELBEEP; the lobby chair beside the mammoth sags and melts; at the back, MAS glances at it",
   "lobby", "SET-01", "lobby_day", ["selbeep", "mas", "staff"],
   "SELBEEP answers Gerg. The lobby chair beside the mammoth sags, then melts into the carpet like candle wax. At the back of the lobby, Mas glances at the chair.",
   "The chair melts in three held palette-drip steps under \"It understands physics.\" Mas's glance is one pixel of eye.",
   lines=[line("e2-co-0003", pace=QUICK)], head=0.25, tail=0.9, music=M1,
   sounds=[S("palette_drip", "E:e2-co-0003-1.2", -24, new=True, note="three steps, the chair")],
   fix=("P", "KEEP", "PACE"), why="Selbeep's pride against the physics.")
nb("coldopen", "1.05", "MEDIUM · SELBEEP beside the melted chair; the 2-TONE FREEZE card",
   "lobby", "SET-01", "lobby_day", ["selbeep"],
   "SELBEEP, beside the melted chair: \"Directionally.\" The card freezes on him.",
   "Comedy cuts on the joke. The card is the topper.",
   lines=[line("e2-co-0004", pace=QUICK)], head=0.25, tail=2.6, fixed=("tail",), music=M1,
   onscreen=[O("SELBEEP / DIRECTOR OF MAMMOTHS.", "E:e2-co-0004+0.1", "E:e2-co-0004+2.6", "card"),
             O("MAMMOTHS CONTAINED: 0", "E:e2-co-0004+0.6", "E:e2-co-0004+2.6", "stat")],
   sounds=[S("freeze_hit_F", "E:e2-co-0004+0.1", -16)],
   style="2-TONE FREEZE (the card, 1 bar)", fix=("P", "KEEP"),
   why="Name plus one relation word; the stat pays the mammoth still loose in the building.")
nb("coldopen", "1.06", "WIDE · the lobby master, two weeks on: DOT on the ladder swapping the number plates",
   "lobby", "SET-01", "lobby_day", ["dot", "mas", "gerg", "staff"],
   "Two weeks later. DOT, up a ladder at the sign, orange lanyard, back to camera, swaps the plates: 86 comes down, 100 goes up. The mammoth wanders off screen-left toward the elevators, its footprints in its own colour ramp. THUD, outside, somewhere beyond the doors. The door glass rattles.",
   "DOT's face is never shown (Ep5); nobody names her. The first THUD is outside the building (R1): the hand truck on the front steps.",
   dur=3.6, onscreen=[O("RAIL: FEB 29, 2024", 0.3, 2.1, "rail"), O("DAYS SINCE SOMEONE TRIED TO FIRE MAS: 100", 1.2, None, "sign")],
   music=M1b, sounds=[S("plate_hang", 1.0, -24, new=True), S("hand_truck_step", "f0.75", -22, new=True, note="THUD 1, outside"),
                      S("door_glass_rattle", "f0.8", -28, new=True)],
   fix=("P", "FACT", "R1"), why="Time passes; the thuds start (facts A9 for the date).")
nb("coldopen", "1.07", "WIDE · the master; Selbeep O.S.; a staffer's coffee jumps on Mas's counter",
   "lobby", "SET-01", "lobby_day", ["mas", "staff", "dot"],
   "SELBEEP (O.S.) explains the thud to the room. A second THUD, closer; at Mas's counter a staffer's coffee jumps. The ladder sways; DOT holds on.",
   "The coffee jumps, Mas's water doesn't (the glass is a prop only, R1: no beat hangs on it).",
   lines=[line("e2-co-0005")], head=0.4, tail=0.7, music=M1b,
   sounds=[S("hand_truck_step", "E:e2-co-0005+0.1", -18, new=True, note="THUD 2, closer"), S("cup_jump", "E:e2-co-0005+0.15", -26, new=True),
           S("ladder_sway_creak", "E:e2-co-0005+0.2", -28, new=True)],
   fix=("P", "KEEP"), why="The spoken misdirect: it's the mammoth.")
nb("coldopen", "1.08", "OTS-WIDE · over Gerg's laptop; Gerg doesn't look up",
   "lobby", "SET-01", "lobby_day", ["gerg", "staff"],
   "GERG, typing, not looking up, corrects Selbeep.",
   "His keys under the line; the doors glint far right.",
   lines=[line("e2-co-0006", pace=QUICK)], head=0.25, tail=0.5, music=M1b, fix=("P", "KEEP", "PACE"),
   why="Gerg's correction turns the misdirect into suspense.")
nb("coldopen", "1.09", "OTS-WIDE · over Mas's shoulder straight down the axis: the doors blow open on the hand truck and the complaint",
   "lobby", "SET-01", "lobby_day", ["mas"],
   "THUD: a hand truck takes the top step. The doors blow open. On the hand truck, a complaint as tall as a person, its caption NOLE v. MANALT ET AL. over YOU PROMISED!!! It rolls down the axis to his feet. Through the door glass, for the length of the swing, a PAUSE sign leaning on the planter outside.",
   "One shot for the whole arrival. The room layer shakes 2 px; the UI never shakes. Mas's silhouette never moves. The PAUSE sign is a group sign only: no date, group or grievance (PP2.1).",
   dur=4.4, onscreen=[O("NOLE v. MANALT ET AL.", 1.2, None, "doc"), O("YOU PROMISED!!!", 1.2, None, "doc"), O("PAUSE", 0.6, 1.8, "sign")],
   music=M1b, sounds=[S("hand_truck_step", 0.2, -14, new=True, note="THUD 3: the top step"), S("door_bang_open", 0.55, -16),
                      S("hand_truck_roll", 0.9, -22, new=True)],
   fix=("P", "FACT", "R1"), why="It isn't the mammoth: the suit arrives (facts A9; confirm the caption on the docket).")
nb("coldopen", "1.10", "ECU · page one; the table of contents",
   "lobby", "SET-01", "lobby_day", ["mas"],
   "Page one is exclamation points, all of it. The table of contents: ! .... 1 · !! .... 2 · !!! .... 3.",
   "Read time for the contents: three short lines.",
   dur=2.8, fixed=("dur",), onscreen=[O("! .... 1", 0.4, None, "doc"), O("!! .... 2", 0.4, None, "doc"), O("!!! .... 3", 0.4, None, "doc")],
   music=M1b, sounds=[S("paper_flutter", 0.2, -26)], fix=("P", "KEEP"), why="The complaint's content, as a gag.")
nb("coldopen", "1.11", "WIDE · the complaint tips off the truck and hits the floor; a flyer shakes off a pillar and lands on it",
   "lobby", "SET-01", "lobby_day", ["mas", "staff"],
   "The complaint tips off the hand truck and hits the floor: the last THUD. It shakes a curling flyer off a rack pillar, WHERE IS ALYI?, its photo a doorway. The flyer floats down face-up onto the complaint.",
   "The first of the knee's four notes lands on the THUD.",
   dur=2.6, fixed=("dur",), onscreen=[O("WHERE IS ALYI?", 1.2, None, "sign")], music=M1c,
   sounds=[S("paper_stack_fall", 0.15, -12, new=True, note="the last THUD; the knee's note 1 on it"), S("paper_flutter", 0.9, -24)],
   fix=("P", "R1"), why="The cold open's question (the flyer), on the obstacle.")
nb("coldopen", "1.12", "LOW · the sign from below, DOT holding out a spare 0 → MCU MAS: one pixel of a head shake → she hangs a second sign",
   "lobby", "SET-01", "lobby_day", ["dot", "mas"],
   "DOT, still back to camera, holds a spare 0 plate out toward him. MAS shakes his head, one pixel. She lowers it, considers, and hangs a second, smaller sign underneath: DAYS SINCE SOMEONE SUED MAS: 0.",
   "Aftermath: the complaint at his feet, the flyer on it, the head shake, the second sign (P3).",
   dur=4.6, onscreen=[O("DAYS SINCE SOMEONE SUED MAS: 0", 2.6, None, "sign")], music=M1c,
   sounds=[S("plate_hang", 2.4, -22, new=True)], fix=("P", "KEEP"), why="Mas declines the reset; the new count starts.")
nb("coldopen", "1.13", "ECU · the flyer's doorway photo on the complaint; the Orb's iris steps onto it",
   "lobby", "SET-01", "lobby_day", ["orb"],
   "The flyer's photo, a doorway, on the complaint. THE ORB's iris steps onto it. SMASH TO INTRO on the knee's fourth note.",
   "The doorway → the intro's first frame (the intro's own imagery isn't repeated here).",
   dur=2.3, fixed=("dur",), music=M1c, sounds=[S("orb_servo", 0.4, -24)],
   transition={"to": "INTRO", "cut": "SMASH on the knee's fourth note", "cause": "the suit has landed; the flyer is the cold open's question",
               "sound": "the knee's first four notes on dry piano, the first on the complaint's THUD", "object": "the flyer's doorway → the intro's first frame"},
   aftermath="the iris on the doorway", fix=("P", "TR"), why="Seam 1.")

# ------------------------------------------------------------------------------------- ACT ONE · sc 4 · 3:12
M4 = ("E02-02 THE SÉANCE · ROOM COLOUR (audition first: (a) glass harmonica with chip, F minor; (b) celesta and chip over "
      "a low reed pad; judged against the corny bar), one performance under the séance; ducks under lines; thins to a pad "
      "under every ghost caption and real line")
M4go = ("E02-02 · Move 37: the room colour thins to a chip Go figure on the open fifth (no third); celesta and chip; the "
        "knobs as soft pizzicato grains that stop when the wall freezes")
M4f = ("E02-02 · F2.3: the cut-paper chamber tier (ERA T3) crossfaded in on the smoke; Nole's Launch on slow horns, its one "
       "sincere version (OST §2.7); thins under the look to the Door's first bar, its first note missing")
M4x = "E02-02 · back to the room colour; Nole's fanfare stops one note short on his exit; the last candle: the last chord rings into E02-03"
CH4 = ["mas", "gerg", "staffer", "staff", "orb"]
nb("act1", "4.01", "WIDE · the candle-lit table (establish) → LOW·DESK at Mas's end: the laptop big in the foreground",
   "boardroom", "SET-02", "seance", CH4,
   "The boardroom, lit only by candles, already lit. On the table a Ouija board whose letters are reply chevrons, and a plain brass-rimmed planchette. Three staffers hold hands; GERG at the table's corner, one hand on the planchette, typing with the other. THE ORB hangs over it all like a chandelier. An empty chair at the table's end. At the head, MAS has the post open: NOPEAI AND NOLE, a byline row of co-founders with ALYI among them.",
   "The planchette has no pointer glyph (P6): it reads as a planchette, never a cursor. The byline row legible at 1080p (… · ALYI · … · MAS).",
   dur=2.5, fixed=("dur",), onscreen=[O("NOPEAI AND NOLE", 0.4, None, "post"), O("… · ALYI · … · MAS", 0.8, None, "post")],
   music=M4, sounds=[S("candle_crackle", 0.0, -32, new=True, note="bed detail")],
   jcut=[{"sound": "the séance's room colour already playing under the filename card", "lead_s": 1.0}],
   arrive={"s": 2.5, "what": "the lit table, the room colour playing, the staffers' hands joined, before his click"},
   fix=("P", "FACT", "R1"), why="Seam 2: the suit needs an answer (facts A10, A59 for the byline).")
nb("act1", "4.02", "ECU · his finger on the bare Publish button → MCU MAS",
   "boardroom", "SET-02", "seance", ["mas", "orb"],
   "His finger on the bare Publish button, no hover. Click. Every candle flares one step; the planchette moves by itself.",
   "The click is his move. The rail clears before the V.O. types in his cyan (P18).",
   lines=[line("e2-vo-01")], head=3.2, tail=0.5, fixed=("head",),
   onscreen=[O("RAIL: MAR 5, 2024", 0.8, 2.6, "rail")], music=M4,
   sounds=[S("post_click", 0.4, -18), S("candle_flare", 0.5, -24, new=True), S("planchette_glide", 1.0, -26, new=True)],
   fix=("P", "VO", "FACT"), why="V.O. 1: answering a suit with the man's own words is the move.")
nb("act1", "4.03", "LOW·DESK · Mas reading → HIGH · the planchette to >>>",
   "boardroom", "SET-02", "seance", ["mas", "gerg", "staffer"],
   "MAS runs it like a procedure. The planchette slides to >>>, and an inbox chime sounds, pitched down two octaves.",
   "Base setup for his questions; the HIGH planchette answers them.",
   lines=[line("e2-a1-0001")], head=0.4, tail=1.2, music=M4,
   sounds=[S("inbox_chime_low", "E:e2-a1-0001+0.5", -22, new=True), S("planchette_glide", "E:e2-a1-0001+0.2", -26, new=True)],
   fix=("P", "KEEP"), why="The séance's procedure.")
nb("act1", "4.04", "WIDE · ghost 1 rises in double exposure (2.G) inside the candle's pool",
   "boardroom", "SET-02", "seance", ["ghost-nole", "mas", "gerg"],
   "A GHOST rises from the table: an email thread of translucent reply chevrons, its header FROM: ALYI · JAN 2016. Inside it: \"…IT WILL MAKE SENSE TO START BEING LESS OPEN.\" A second ghost unfurls beneath it, RE: from a 2016 GHOST-NOLE.",
   "Alyi appears only as an author (his name on the header), never in brass or stone (R1). The spirit-photo pass (2.G) on the ghosts only.",
   lines=[line("e2-a1-0002")], head=3.4, tail=0.6, fixed=("head",),
   onscreen=[O("FROM: ALYI · JAN 2016", 0.3, None, "doc"), O("\"…IT WILL MAKE SENSE TO START BEING LESS OPEN.\"", 0.6, None, "doc")],
   music=M4, sounds=[S("reverse_swell_1beat", 0.1, -24), S("glyph_shimmer", 0.2, -30)], style="2.G SPIRIT PHOTO (pass)",
   fix=("P", "FACT", "R1"), why="The record speaks first (facts §B: \"less open\" [P]; \"Yup\" [K]).")
nb("act1", "4.05", "MEDIUM · a staffer's eyes to the empty chair at the table's end; GERG, quietly",
   "boardroom", "SET-02", "seance", ["gerg", "staffer"],
   "A staffer's eyes go to the empty chair at the table's end. GERG, quietly, to her.",
   "The empty chair is a chair: no image of Alyi in it.",
   lines=[line("e2-a1-0003")], head=1.0, tail=0.6, music=M4, fix=("P",),
   why="Alyi is a co-founder who signed the post and isn't in the room.")
nb("act1", "4.06", "LOW·DESK · Mas, as if calling a vote → HIGH · the held hands and the planchette, still",
   "boardroom", "SET-02", "seance", ["mas", "staffer", "gerg"],
   "MAS puts the question to the table. The held hands and the planchette perfectly still. The organ drops to its pad. Then, from the ceiling: KNOCK. KNOCK. KNOCK, each one louder.",
   "HOLD 2 BEATS (the table's, waiting) before the first knock.",
   lines=[line("e2-a1-0004", pace=QMAS)], head=0.45, tail=3.3, fixed=("tail",), music=M4,
   sounds=[S("ceiling_knock", "E:e2-a1-0004+1.3", -22, new=True), S("ceiling_knock", "E:e2-a1-0004+2.0", -19, new=True),
           S("ceiling_knock", "E:e2-a1-0004+2.7", -16, new=True)],
   fix=("P", "KEEP"), why="It says what the suit claims, before the knocks answer it.")
nb("act1", "4.07", "WIDE · the table, one shot for the landing: Nole through the ceiling on a cable",
   "boardroom", "SET-02", "seance", ["nole", "mas", "gerg", "staffer"],
   "CRASH. Ceiling tiles rain down over the foot of the table and NOLE drops through the hole on a cable, landing screen-right. On the right wall the boardroom door, which he didn't use, stays shut. In the foreground Mas doesn't look up from the laptop.",
   "The door he didn't use stays in frame.",
   lines=[line("e2-a1-0005")], head=1.55, tail=0.4, fixed=("head",), music=M4,
   sounds=[S("ceiling_burst", 0.0, -14), S("cable_drop", 0.4, -22, new=True), S("landing_thunk", 1.1, -16)],
   fix=("P", "KEEP", "PACE", "LQ"), why="He crashes his own séance. Mas doesn't look up: \"you're early.\" comes 0.45 s after the landing (quick, Mas), not a held second (lock QA).")
nb("act1", "4.08", "OTS · over Mas's shoulder onto NOLE at the foot of the table, brushing off tiles (base setup for his case)",
   "boardroom", "SET-02", "seance", ["nole", "gerg", "mas"],
   "NOLE, brushing tiles off his jacket, the 2016 ghost and its Yup still hovering behind him. His plate. GERG answers him, typing.",
   "Plate on his entrance: name plus what he is to Mas, told once.",
   lines=[line("e2-a1-0006"), line("e2-a1-0007", 0.2, QUICK)], head=0.5, tail=0.25,
   onscreen=[O("NOLE · FUNDED IT. LEFT IT. SUING IT.", 0.2, "L:e2-a1-0007+0.5", "plate")],
   music=M4, fix=("P", "KEEP", "PACE"), why="Quick volley: Nole and Gerg.")
nb("act1", "4.09", "OTS · the same setup: Nole's case, the 2016 ghost's \"less open\" hanging behind him",
   "boardroom", "SET-02", "seance", ["nole", "ghost-nole"],
   "NOLE makes his case to the whole table. Behind him, in the same frame, the 2016 ghost's \"less open\" and its Yup hang in the air while he says \"open\". Nobody points at it.",
   "The scene's one speech.",
   lines=[line("e2-a1-0008", pace=QUICK)], head=0.2, tail=0.4, music=M4, fix=("P", "KEEP", "PACE"),
   why="Nole's motive in his own words: credit (he paid) and his name for it (open).")
nb("act1", "4.10", "LOW·DESK · Mas → HIGH · the planchette spells O · P · E · N",
   "boardroom", "SET-02", "seance", ["mas"],
   "MAS puts Nole's own word to the board. The planchette glides from letter to letter: O · P · E · N.",
   "Each letter a tick on the beat.",
   lines=[line("e2-a1-0009", pace=QMAS)], head=0.45, tail=2.2, fixed=("tail",), music=M4,
   onscreen=[O("O P E N", "E:e2-a1-0009+0.3", None, "ui")],
   sounds=[S("planchette_letter_tick", "E:e2-a1-0009+0.3", -24, new=True), S("planchette_letter_tick", "E:e2-a1-0009+0.8", -24, new=True),
           S("planchette_letter_tick", "E:e2-a1-0009+1.3", -24, new=True), S("planchette_letter_tick", "E:e2-a1-0009+1.8", -24, new=True)],
   fix=("P", "KEEP", "PACE"), why="The board vindicates him for a beat.")
nb("act1", "4.11", "OTS · Nole spreads his hands → HIGH · the planchette drifts back to the N and carries it to the front",
   "boardroom", "SET-02", "seance", ["nole"],
   "NOLE spreads his hands at the board, vindicated. The planchette pauses. Then it drifts back to the N and carries it to the front: N · O · P · E.",
   "The N moves in one held glide.",
   lines=[line("e2-a1-0010", pace=QUICK)], head=0.25, tail=2.2, fixed=("tail",), music=M4,
   onscreen=[O("N O P E", "E:e2-a1-0010+1.2", None, "ui")],
   sounds=[S("planchette_glide", "E:e2-a1-0010+0.7", -24, new=True)], fix=("P", "KEEP"), why="NOPE.")
nb("act1", "4.12", "MCU · Nole jabbing at the board → HIGH · three hands lift off the planchette",
   "boardroom", "SET-02", "seance", ["nole", "mas", "ghost-nole", "gerg"],
   "NOLE, jabbing at the board as the N moves. Everyone looks down: three hands are resting on the planchette, Mas's, GHOST-NOLE's and Gerg's. All three lift off at once.",
   "The three hands: Mas's, ghost-Nole's, Gerg's (R1). Nobody's reflection.",
   lines=[line("e2-a1-0011", pace=QUICK)], head=0.25, tail=1.6, music=M4, fix=("P", "KEEP", "R1"),
   why="He loses the name.")
nb("act1", "4.13", "WIDE · the cow ghost rises, chewing; its caption and its reply",
   "boardroom", "SET-02", "seance", ["mas", "nole", "gerg"],
   "Another ghost lumbers up: a COW made of chevrons, a charging cable for a tail, the plug stamped ALSET, its chevron header dated 2018. It moos, reverbed, and chews. Its caption, and under it his reply.",
   "The caption reads over the chewing; the scene keeps moving under it.",
   dur=4.6, fixed=("dur",), onscreen=[O("2018", 0.2, None, "doc"), O("FWD: \"…ATTACH TO ALSET AS ITS CASH COW…\"", 0.4, None, "doc"),
                                      O("NOLE: \"…EXACTLY RIGHT…\"", 2.0, None, "doc")],
   music=M4, sounds=[S("cow_moo_reverb", 0.3, -22, new=True)], fix=("P", "FACT", "R2"),
   why="Control, in his own forwarded email and his reply (facts §B, the cow: [V], TechCrunch, Mar 5, 2024; both crops verbatim).")
nb("act1", "4.14", "OTS · Nole at the cow → LOW·DESK · Mas",
   "boardroom", "SET-02", "seance", ["nole", "mas"],
   "NOLE disputes the medium, not the words. MAS answers with the words.",
   "No invented line disputes the record (R2).",
   lines=[line("e2-a1-0012"), line("e2-a1-0013", 0.45, QMAS)], head=0.3, tail=0.5, music=M4,
   fix=("P", "R2", "PACE", "GR"), why="He forwarded it; he wrote \"exactly right.\"")
nb("act1", "4.15", "MEDIUM · Nole's lamp clicks on; his post rises as a ghost of !",
   "boardroom", "SET-02", "seance", ["nole"],
   "Nole doesn't answer him. The cow chews. A desk lamp clicks on beside Nole, his post lamp, and he types furiously. His post leaves the phone and rises as a brand-new ghost, NOLE · JUST NOW, made entirely of !. It floats up to join the others.",
   "His answer goes to the internet, and has no words in it.",
   dur=3.6, onscreen=[O("NOLE · JUST NOW", 1.6, None, "post"), O("!!!!!!!!", 1.6, None, "post")], music=M4,
   sounds=[S("lamp_click", 0.2, -22, new=True), S("key_tap_soft_01", 0.6, -28), S("reverse_swell_1beat", 1.5, -26)],
   fix=("P", "KEEP"), why="Nole's tell: he posts instead of answering.")
nb("act1", "4.16", "WIDE · ghost 3 rises, DEC 2018, its header the \"0%\" clause; GHOST-NOLE in a 2018 hoodie leans across the table",
   "boardroom", "SET-02", "seance", ["ghost-nole", "nole", "mas"],
   "The planchette slides one last time. A third ghost, its header dated DEC 2018, carrying the 0% sentence. GHOST-NOLE, in a 2018 hoodie, leans across the table.",
   "The header must read at 1080p; the voice plays while it holds.",
   lines=[line("e2-a1-0014")], head=2.2, tail=2.0, fixed=("head", "tail"),
   onscreen=[O("DEC 2018", 0.3, None, "doc"),
             O("\"…RELEVANT TO MINDDEEP/ELGOOG WITHOUT A DRAMATIC CHANGE IN EXECUTION AND RESOURCES IS 0%. NOT 1%.\"", 0.5, None, "doc")],
   music=M4, sounds=[S("reverse_swell_1beat", 0.1, -24)], fix=("P", "FACT", "R1"),
   why="The bill is set up before it's conceded (facts §B: the Dec 26, 2018 email, [V], verbatim in CNBC and NBC News, Mar 6, 2024).")
nb("act1", "4.17", "MEDIUM · Nole slaps his phone down → ECU · every flame jumps; Mas's hand on his glass doesn't move",
   "boardroom", "SET-02", "seance", ["nole", "mas"],
   "NOLE slaps his phone down on the table. Every flame jumps. Mas's hand on his glass doesn't move.",
   "ECU: his still hand carries the slap (R1).",
   dur=2.4, music=M4, sounds=[S("phone_clack_floor", 0.2, -16), S("candle_flare", 0.25, -24, new=True)],
   fix=("P", "R1"), why="Mas concedes nothing aloud.")
nb("act1", "4.18", "2S · NOLE and GHOST-NOLE side by side, same jaw, same phone (no cut-ins)",
   "boardroom", "SET-02", "seance", ["nole", "ghost-nole", "gerg"],
   "NOLE moves the email in time. GERG (O.S.) has checked. NOLE turns on the ghost. The ghost considers this for a long time.",
   "HOLD 2 BEATS before the ghost's answer: the hold is Nole's.",
   lines=[line("e2-a1-0015"), line("e2-a1-0016", 0.2, QUICK), line("e2-a1-0017", 0.2, QUICK), line("e2-a1-0018", 1.25, WEIGHTED)],
   head=0.3, tail=0.5, music=M4, fix=("P", "KEEP", "PACE"), why="\"Different me\": the comedy of a man losing his own case.")
nb("act1", "4.19", "LOW·DESK · Mas → HIGH · the planchette slides into the board's corner, where the letters become a Go board; ECU the stone",
   "boardroom", "SET-04", "seance", ["mas"],
   "MAS asks the question he wants answered. The planchette slides into the board's corner, where the letters become a Go board, and a stone clicks down.",
   "SET-04 in the board's corner (T3 cut-paper; slate and shell stones). The stone label legible.",
   lines=[line("e2-a1-0019")], head=0.5, tail=2.6, fixed=("tail",), mode="SET-PIECE · the explainer (Move 37)",
   onscreen=[O("MAR 2016 · GAME 2 · MOVE 37", "E:e2-a1-0019+0.8", None, "doc")], music=M4go,
   sounds=[S("planchette_glide", "E:e2-a1-0019+0.1", -24, new=True), S("go_stone_click", "E:e2-a1-0019+0.8", -16, new=True)],
   style="T3 cut-paper (the Go board)", fix=("P", "ML", "FACT"),
   why="Seam 3 in: \"spirit, why zero?\" The episode's concept starts on Nole's fear (facts A57).")
nb("act1", "4.20", "MCU · NOLE, quiet → MCU · the STAFFER beside Gerg, whispering at the stone",
   "boardroom", "SET-04", "seance", ["nole", "staffer"],
   "NOLE, quiet for once. The staffer beside Gerg whispers at the stone.",
   "The room goes quiet for the only time.",
   lines=[line("e2-a1-0020"), line("e2-a1-0021", 0.3, QUICK)], head=0.4, tail=0.25, mode="SET-PIECE · the explainer (Move 37)",
   music=M4go, fix=("P", "ML", "R2"), why="Someone has a reason to ask (W22).")
nb("act1", "4.21", "MCU · NOLE to her, hushed",
   "boardroom", "SET-04", "seance", ["nole", "staffer"],
   "NOLE, to her, hushed, a man at a séance.",
   "", lines=[line("e2-a1-0022", pace=QUICK)], head=0.25, tail=0.15, mode="SET-PIECE · the explainer (Move 37)",
   music=M4go, fix=("P", "ML", "R2", "PACE"), why="He calls it magic.")
nb("act1", "4.22", "MCU · GERG typing (his correction) ↔ MCU · the STAFFER whispering → the knob wall behind the board: the training stream, then its own boards, then the freeze",
   "boardroom", "SET-04", "seance", ["gerg", "staffer"],
   "GERG, typing, cheerfully literal, corrects him: it learned, from people's games. The staffer beside him, whispering, takes that to mean somebody wrote it. Nobody did: behind the board, a wall of tiny knobs, a stream of tiny human boards pouring into it, each one ticking every knob a hair. On \"Then it played itself, millions of games.\" the stream turns into the program's own boards. The wall freezes.",
   "The knobs tick only while the stream pours in, and freeze at the match (the numbers were fixed during play). No players, no hands. The wall starts on \"Nobody wrote it.\", so the picture carries the second half.",
   lines=[line("e2-a1-0023", pace=QUICK), line("e2-a1-0055", 0.25, QUICK), line("e2-a1-0056", 0.25, QUICK)],
   head=0.2, tail=1.0, fixed=("tail",), mode="SET-PIECE · the explainer (Move 37)",
   music=M4go, sounds=[S("knob_tick_grain", "L:e2-a1-0056+0.8", -30, new=True, note="soft, continuous until the freeze", dur=9.0)],
   fix=("P", "ML", "R2", "PACE", "SR"), why="Learned, not programmed, through a misunderstanding: millions of knobs nudged by examples, then self-play (facts A57). Script review: split with the staffer, about 2 s more (Act One is the setup act, R4).")
nb("act1", "4.23", "MCU · NOLE takes the fear back",
   "boardroom", "SET-04", "seance", ["nole"],
   "NOLE takes the fear back, in plainer words.",
   "", lines=[line("e2-a1-0024", pace=NORMAL)], head=0.5, tail=0.3, mode="SET-PIECE · the explainer (Move 37)",
   music=M4go, fix=("P", "ML", "R2"), why="The fear, accurately (about 1 in 10,000).")
nb("act1", "4.24", "WIDE · NOLE, loud again, to the table",
   "boardroom", "SET-02", "seance", ["nole", "mas", "gerg", "staffer"],
   "NOLE, loud again, to the table: the credit.",
   "The board's corner goes back to letters.",
   lines=[line("e2-a1-0025", pace=QUICK)], head=0.3, tail=0.4, music=M4, fix=("P", "R2"),
   why="Credit and rivalry: his motive.")
nb("act1", "4.25", "OTS · over Mas's shoulder: ghost 3 drifts into his eyeline and says its line again",
   "boardroom", "SET-02", "seance", ["mas", "ghost-nole"],
   "Ghost 3 drifts into Mas's eyeline and says its line again.",
   "The bill has its referent in the frame (R2). The V.O. types in his cyan.",
   lines=[line("e2-a1-0026"), line("e2-vo-02", 0.6, WEIGHTED)], head=0.4, tail=0.6, music=M4,
   fix=("P", "VO", "R2"), why="V.O. 2: aloud he concedes nothing; privately, the bill.")
nb("act1", "4.26", "MCU · NOLE, the lamp dark (held through the pair; Mas's line an L-cut on his face)",
   "boardroom", "SET-02", "seance", ["nole"],
   "NOLE turns to Mas. The lamp beside him does not click on. Then Mas's answer lands on Nole's face.",
   "The lamp's tell: off. A slow drift in.",
   lines=[line("e2-a1-0027"), line("e2-a1-0028", 1.0, WEIGHTED)], head=0.6, tail=0.6, music=M4,
   fix=("P", "KEEP", "PACE"), why="The cost: the quiet line.")
nb("act1", "4.27", "ECU · Mas lifts his glass; the candle nearest Nole snuffs; its smoke crosses the glass",
   "boardroom", "SET-02", "seance", ["mas"],
   "Mas lifts his glass. The candle nearest Nole snuffs out. Its smoke crosses the glass, and the glass carries us into 2018.",
   "The glass is the matched object into F2.3.",
   dur=2.4, music=M4f, sounds=[S("candle_snuff", 0.5, -24, new=True), S("render_front_sweep", 1.6, -26)],
   transition={"to": "F2.3", "cause": "\"You kept them.\" / \"we keep everything.\"", "sound": "the cut-paper chamber tier on the smoke",
               "object": "his lifted glass, smoke across it → the same glass at the back of the 2018 room"},
   fix=("P", "TR", "R1"), why="Seam 4 in.")
F23 = {"when": "FEB 20, 2018", "of": "F2.3 (Nole → Mas)", "tier": "T3 cut-paper (Ep1's first-office set, copied), by day",
       "in": "his glass and the smoke (4.27)", "out": "his glass lifted an inch to Alyi → the relit candle at his face (4.33)",
       "no_vo": "no inner voice in a memory", "captions": "none: no words heard"}
nb("act1", "4.28", "WIDE · NopeAI's first office, Feb 2018, by day: the all-hands",
   "office", "SET-03", "allhands", ["nole", "gerg", "mas", "alyi", "staff"],
   "Ep1's own room, four months before the night the machine taught itself: fewer racks; the arena on one monitor; a whiteboard with AGI and three crossed-out arrows; a Go stone on a desk. NOLE at the front, mid-speech, unheard; his slide reads ALSET · AI.",
   "No captions. The slide is the public reason (R2); the litigant's account stays off screen.",
   dur=4.4, fixed=("dur",), onscreen=[O("RAIL: FEB 20, 2018", 0.4, 2.2, "rail"), O("ALSET · AI", 1.2, None, "doc"), O("AGI", 0.4, None, "ui")],
   music=M4f, style="T3 cut-paper memory", flashback=F23, mode="FLASHBACK",
   fix=("P", "FACT", "R2"), why="F2.3: his exit (facts A11).")
nb("act1", "4.29", "WIDE · the slide and the room in one frame: Nole finishes at the slide; nobody applauds",
   "office", "SET-03", "allhands", ["nole", "gerg", "staff"],
   "NOLE finishes, one hand still on the slide. Nobody applauds. One by one the staff turn back to their monitors; the arena match keeps playing. GERG, second row, keeps typing.",
   "The room's answer is the room: no prop, no sheet, nothing asked of anyone on screen (script review).",
   dur=4.5, fixed=("dur",), music=M4f, style="T3 cut-paper memory", flashback=F23, mode="FLASHBACK", fix=("P", "R2", "SR", "GR"),
   why="The room didn't buy the story (facts A11, Semafor); no recruitment shown (W8: the suit's merits).")
nb("act1", "4.30", "WIDE · at the back, Mas sips from the crystal glass; Nole climbs the ladder; the hatch closes",
   "office", "SET-03", "allhands", ["mas", "nole"],
   "At the back, MAS sips from the same crystal glass. NOLE climbs the ladder to the ceiling hatch. The hatch slides shut on him.",
   "", dur=4.2, music=M4f, sounds=[S("glass_sip", 0.4, -28, new=True), S("ladder_climb", 1.2, -24, new=True), S("hatch_slide_shut", 3.3, -20, new=True)],
   style="T3 cut-paper memory", flashback=F23, mode="FLASHBACK", fix=("P",), why="He leaves by the only exit he recognizes.")
nb("act1", "4.31", "INSERT · the arena monitor: the match still playing, nobody has paused it",
   "office", "SET-03", "allhands", [],
   "The arena match on the one monitor plays on under the hatch's draught; nobody has paused it.",
   "", dur=1.8, fixed=("dur",), music=M4f, sounds=[S("arena_blip_soft", 0.3, -28, new=True)],
   style="T3 cut-paper memory", flashback=F23, mode="FLASHBACK", fix=("P", "R2", "SR"), why="The work goes on without him (facts A11).")
nb("act1", "4.32", "2S · across the room: ALYI foreground, cropped by his monitor's edge, turns and looks back at MAS at the back",
   "office", "SET-03", "allhands", ["alyi", "mas"],
   "ALYI, at the next desk, cropped by his monitor's edge, turns and looks back at Mas. Mas lifts his glass an inch.",
   "Alyi present, lit, a person (P8), part of him cut off by the frame (his rule). Warm. About 2 s on the look.",
   dur=4.2, fixed=("dur",), music=M4f, style="T3 cut-paper memory", flashback=F23, mode="FLASHBACK", fix=("P", "R2", "SR"),
   why="Two of the ones who stayed, together (W14: the bond before the loss).")
nb("act1", "4.33", "WIDE → MATCH · the glass at the back of 2018 → 2024: Nole relights the candle at Mas's face",
   "boardroom", "SET-02", "seance", ["nole", "mas"],
   "The glass carries us back. In 2024 the smoke thins. Nole strikes a match and relights the candle himself.",
   "The relit candle is the matched object out.",
   dur=2.6, music=M4x, sounds=[S("render_front_sweep", 0.2, -26), S("match_strike", 1.4, -22, new=True)],
   flashback=F23, mode="FLASHBACK → SET-PIECE",
   transition={"to": "4.34", "cause": "back from the memory", "sound": "the room colour returns under the match",
               "object": "his glass lifted an inch → the relit candle at his face"},
   fix=("P", "TR"), why="Seam 4 out.")
nb("act1", "4.34", "OTS · the reverse, over Nole's shoulder, the candle in his hand, onto MAS candlelit in the left third",
   "boardroom", "SET-02", "seance", ["nole", "mas"],
   "NOLE holds the candle up to Mas's face like evidence. Mas lifts his glass and sips: F2.3's sip, six years on.",
   "Base setup for the confrontation.",
   lines=[line("e2-a1-0029")], head=0.6, tail=1.4, music=M4x, sounds=[S("glass_sip", "E:e2-a1-0029+0.5", -26, new=True)],
   fix=("P", "KEEP"), why="\"I stood up in front of the whole room\": matches what we saw, and says nothing he asked of it.")
nb("act1", "4.35", "WIDE · the table: Nole sets the candle down hard, already rising on his cable",
   "boardroom", "SET-02", "seance", ["nole", "mas"],
   "NOLE sets the candle down in front of Mas, hard, already rising. He rockets back up through his hole. One ceiling tile drops back into place.",
   "", lines=[line("e2-a1-0030", pace=QUICK)], head=0.4, tail=1.8, music=M4x,
   sounds=[S("rocket_roar", "E:e2-a1-0030+0.2", -16), S("tile_land_1", "end-0.3", -22)],
   fix=("P", "KEEP"), why="\"Keep that too.\" picks up \"we keep everything.\"")
nb("act1", "4.36", "MCU → WIDE · Mas blows out the last candle; darkness",
   "boardroom", "SET-02", "seance", ["mas"],
   "Mas leans over and blows out the last candle. Darkness, 1.5 s.",
   "", dur=2.8, fixed=("dur",), music=M4x, sounds=[S("candle_blow", 0.5, -22, new=True)],
   transition={"to": "4A", "cause": "three days later, the review is back", "sound": "the room colour's last chord rings into PROCEDURE's low strings as the lights step up",
               "object": "the same table, the candles gone, Terb's single sheet where the board was"},
   aftermath="the dark after the last candle, 1.5 s", fix=("P", "TR"), why="Seam 5.")

# ------------------------------------------------------------------------------------- sc 4A · 0:35
M4A = "E02-03 PROCEDURE, MARCH · low strings, brushed snare; thins to its pedal under the reading (the record plays dry)"
nb("act1", "4A.01", "WIDE · the same table by day, from its foot: Terb at the head with one sheet; Mas already standing behind the empty chair; Gerg at the back",
   "boardroom", "SET-02", "boardroom_day", ["terb", "mas", "mada", "omis", "gerg"],
   "The boardroom in morning light, the candles gone. TERB at the head with a single sheet. MADA halfway down; OMIS and two other new directors. MAS stands behind an empty chair. GERG at the back with his laptop, standing.",
   "Mas is already standing on arrival: Ep1's \"we'll stand.\" in picture.",
   lines=[line("e2-a1-0031")], head=2.6, tail=0.3, fixed=("head",), onscreen=[O("RAIL: MAR 8", 0.3, 1.9, "rail")],
   music=M4A, arrive={"s": 2.0, "what": "the room in morning light, candles gone, Mas already standing"},
   fix=("P", "FACT"), why="The review is back (facts A12).")
nb("act1", "4A.02", "2S · across the table favouring MADA (the first half) → MCU · Mas standing (the second half)",
   "boardroom", "SET-02", "boardroom_day", ["terb", "mada", "mas"],
   "TERB reads the finding to the people it concerns, both halves together. The first half lands on MADA, perfectly still; the second on MAS, standing.",
   "Nothing on Mas's face: at a real event his surface stays blank. Mada does nothing (any action could read as a view).",
   lines=[line("e2-a1-0032", pace=WEIGHTED)], head=0.6, tail=0.6, music=M4A,
   fix=("P", "FACT", "GR"), why="Both halves together (W16; facts A12 [P]).")
nb("act1", "4A.03", "OTS · over Mas's shoulder onto TERB, who looks up from the sheet",
   "boardroom", "SET-02", "boardroom_day", ["terb", "mas"],
   "TERB looks up. Mas sits.",
   "", lines=[line("e2-a1-0033", pace=QUICK)], head=0.35, tail=0.9, music=M4A, sounds=[S("chair_unfold", "E:e2-a1-0033+0.3", -26)],
   fix=("P", "R1"), why="\"You can sit down now, Mas.\" pays \"we'll stand.\"")
nb("act1", "4A.04", "ECU · the nameplates click into their slots, his first",
   "boardroom", "SET-02", "boardroom_day", [],
   "His nameplate clicks into its slot. Then the three new directors', one by one.",
   "Four plates, four clicks.",
   dur=3.4, fixed=("dur",), onscreen=[O("MAS MANALT · BOARD", 0.3, None, "plate"), O("OMIS · NEW DIRECTOR", 1.0, None, "plate"),
                                      O("NEW DIRECTOR", 1.6, None, "plate"), O("NEW DIRECTOR", 2.2, None, "plate")],
   music=M4A, sounds=[S("nameplate_click", 0.3, -20, new=True), S("nameplate_click", 1.0, -22, new=True),
                      S("nameplate_click", 1.6, -22, new=True), S("nameplate_click", 2.2, -22, new=True)],
   fix=("P", "FACT", "R1"), why="He's on the board again; three new directors (facts A13).")
nb("act1", "4A.05", "WIDE · as he sits he glances at Gerg at the back; Gerg lifts the laptop an inch",
   "boardroom", "SET-02", "boardroom_day", ["mas", "gerg"],
   "As he sits, Mas glances at GERG, at the back with his laptop, still standing. Gerg lifts the laptop an inch, like a toast.",
   "A warm half-second.", dur=2.8, music=M4A, fix=("P", "R1"), why="Gerg isn't rejoining; he's glad for him.")
nb("act1", "4A.06", "ECU · his phone, face up on the table beside the nameplate, lights with an invite",
   "boardroom", "SET-02", "boardroom_day", [],
   "Under the last click his phone, face up on the table, lights with an invite.",
   "", dur=1.4, music=M4A, sounds=[S("ui_toast_pop", 0.3, -24, note="the invite's soft chime over the click")],
   transition={"to": "4B", "cause": "an invite", "sound": "the invite's soft chime over the nameplates' click", "object": "the nameplate's slot → the invite card"},
   fix=("P", "TR"), why="Seam 6.")

# ------------------------------------------------------------------------------------- sc 4B · 0:08
nb("act1", "4B.01", "ECU · the calendar card on his phone (the look of Ep1's Board sync invite); his thumb on Accept",
   "screen", "SET-02", "boardroom_day", ["mas"],
   "The calendar card: XEL · LONG-FORM · MAR 18 · 2 HRS, with a mic icon. He reads it and accepts with his thumb. The card settles into his calendar.",
   "In Ep1 he accepted an invite without looking; this time he looks.",
   lines=[line("e2-vo-03")], head=1.0, tail=2.3, fixed=("head",), onscreen=[O("XEL · LONG-FORM · MAR 18 · 2 HRS", 0.2, None, "ui")],
   music="E02-04 LONG-FORM · none under the read; the podcast-intro sting pre-laps under the card settling (J 0.8 s)",
   sounds=[S("post_click", "E:e2-vo-03+0.4", -22, note="Accept: a beat after his thought, then the card settles (1.5 s or more)")],
   jcut=[{"sound": "an original podcast-intro sting, under the tap", "lead_s": 0.8}],
   arrive={"s": 1.0, "what": "the phone's glow on the nameplate (continuous from 4A)"},
   transition={"to": "6", "cause": "he accepts", "sound": "the podcast-intro sting (J 0.8 s)", "object": "the invite's mic icon → XEL's mic, same place in frame"},
   fix=("P", "VO", "TR", "R1"), why="V.O. 3: tell it once, his way. Seam 7.")

# ------------------------------------------------------------------------------------- sc 6 · 1:21
M6 = "E02-04 LONG-FORM · the sting, then no score: the studio's padded room tone is the joke; the mic's hops are SFX"
CH6 = ["xel", "mas"]
CHAPTER = lambda n: f"CH. {n} OF 6"
nb("act1", "6.01", "2S · the locked meter frame inside the podcast player's chrome: curtain, two chairs, one mic (size 1)",
   "stage", "SET-05", "podcast_studio", CH6,
   "Enter late: a black curtain, two chairs, one microphone on a stand between them, all inside a podcast player's chrome, its chapter counter at CH. 1 OF 6 and a REC light. XEL screen-right; MAS screen-left with his glass. XEL asks his real first question.",
   "The locked meter frame: every hop plays in it, against the same curtain and chairs.",
   lines=[line("e2-a1-0034")], head=1.4, tail=0.3, fixed=("head",),
   onscreen=[O(CHAPTER(1), 0.0, "end", "ui"), O("REC", 0.0, None, "ui")], music=M6, style="2.D PODCAST (pass)",
   arrive={"s": 1.4, "what": "enter late on the locked two-shot, the sting ending"}, fix=("P", "FACT", "R2"),
   why="The friendliest long-form host there is (facts A15).")
nb("act1", "6.02", "2S · the meter frame: XEL waits; the mic hops one size (1 → 2); the counter ticks; the card",
   "stage", "SET-05", "podcast_studio", CH6,
   "XEL waits. The mic hops one size, and the player's chapter counter ticks. The card freezes on XEL.",
   "The card on the first hop, as the topper.",
   dur=3.4, fixed=("dur",), onscreen=[O(CHAPTER(2), 0.6, None, "ui"), O("XEL / ASKS THE LONG QUESTIONS.", 0.8, 3.2, "card"), O("EPISODE: 419", 1.3, 3.2, "stat")],
   music=M6, sounds=[S("mic_grow_step", 0.5, -20, new=True), S("chapter_tick", 0.6, -26, new=True), S("freeze_hit_F", 0.8, -18)],
   style="2-TONE FREEZE (the card, 1 bar)", fix=("P", "R2"), why="Hop 1; the meter's rule.")
nb("act1", "6.03", "2S · the meter frame: Mas answers; the mic doesn't move",
   "stage", "SET-05", "podcast_studio", CH6,
   "MAS answers, in his own words. The mic doesn't move.",
   "", lines=[line("e2-a1-0035", pace=NORMAL)], head=0.5, tail=0.5, music=M6, fix=("P", "FACT"),
   why="His words on the record (they reach the landlord tomorrow).")
nb("act1", "6.04", "2S · the meter frame: XEL lets it sit; hop 2 (2 → 3); the Alyi question",
   "stage", "SET-05", "podcast_studio", CH6,
   "XEL lets it sit. The mic hops again; the counter ticks. Then he asks about Alyi.",
   "", lines=[line("e2-a1-0036")], head=1.3, tail=0.3, onscreen=[O(CHAPTER(3), 0.6, None, "ui")], music=M6,
   sounds=[S("mic_grow_step", 0.5, -19, new=True), S("chapter_tick", 0.6, -26, new=True)],
   fix=("P", "FACT", "R2"), why="Hop 2.")
nb("act1", "6.05", "2S · the meter frame: the \"no.\" ladder, quick",
   "stage", "SET-05", "podcast_studio", CH6,
   "The ladder: no; no; neither.",
   "Its shortness is the joke.",
   lines=[line("e2-a1-0037", pace=QMAS), line("e2-a1-0038", 0.2, QUICK), line("e2-a1-0039", 0.45, QMAS),
          line("e2-a1-0040", 0.2, QUICK), line("e2-a1-0041", 0.45, QMAS)],
   head=0.45, tail=0.4, music=M6, fix=("P", "FACT", "PACE"), why="Real and quick (Lex #419).")
nb("act1", "6.06", "2S · the meter frame: XEL pauses; hop 3 (3 → 4); the relationship question",
   "stage", "SET-05", "podcast_studio", CH6,
   "XEL pauses. The mic hops; the counter ticks. Then the real question.",
   "", lines=[line("e2-a1-0042")], head=1.3, tail=0.4, onscreen=[O(CHAPTER(4), 0.6, None, "ui")], music=M6,
   sounds=[S("mic_grow_step", 0.5, -18, new=True), S("chapter_tick", 0.6, -26, new=True)],
   fix=("P", "FACT", "R2"), why="Hop 3; the one place anyone asks what Alyi is to him.")
nb("act1", "6.07", "MCU · MAS against the curtain (the one cut-in), screen-left, facing camera-right toward XEL",
   "stage", "SET-05", "podcast_studio", ["mas"],
   "MAS answers, at his own pace.",
   "The mic never grows while he talks, so the meter stays honest. A face light one step (P10).",
   lines=[line("e2-a1-0043", pace=WEIGHTED)], head=0.6, tail=0.6, music=M6, fix=("P", "FACT", "R1"),
   why="\"i love alyi\": the bond, on the record, before the loss (W14).")
nb("act1", "6.08", "2S · back to the meter frame: the mic hasn't moved a pixel; XEL's pause; hop 4 (4 → 5): the mic fills the frame",
   "stage", "SET-05", "podcast_studio", CH6,
   "The mic hasn't moved a pixel through any of it. XEL's pause. The mic hops to fill the frame; Mas leans around it.",
   "", dur=3.0, onscreen=[O(CHAPTER(5), 1.2, None, "ui")], music=M6,
   sounds=[S("mic_grow_step", 1.1, -16, new=True), S("chapter_tick", 1.2, -26, new=True), S("chair_creak", 1.8, -28, new=True)],
   fix=("P", "R2"), why="Hop 4: \"once\" is taking a while.")
nb("act1", "6.09", "INSERT · the player's chrome: the counter ticks to CH. 6 OF 6; REC goes out",
   "stage", "SET-05", "podcast_studio", [],
   "The counter ticks to CH. 6 OF 6, and the REC light goes out.",
   "\"tell it once\" took six chapters.",
   dur=1.8, fixed=("dur",), onscreen=[O(CHAPTER(6), 0.3, None, "ui")], music=M6,
   sounds=[S("chapter_tick", 0.3, -24, new=True), S("rec_light_off", 0.9, -26, new=True)], fix=("P", "R2"),
   why="The recording's end: five advances in all (W15).")
nb("act1", "6.10", "2S · off the record: XEL leans toward the giant mic; Mas pressed flat against the curtain",
   "stage", "SET-05", "podcast_studio", CH6,
   "Off the record, XEL leans toward the giant mic. MAS, pressed flat against the curtain by it. XEL's answer seems to come from inside the mic.",
   "Kept only if the reel's laugh test passes (D-20: −4 s if not).",
   lines=[line("e2-a1-0044"), line("e2-a1-0045", 0.45, QMAS), line("e2-a1-0046", 0.3, QUICK)], head=0.4, tail=1.0, music=M6,
   fix=("P", "R2", "PACE"), why="The mic gag, off the dated exchange (D-47).")
nb("act1", "6.11", "2S → MATCH · the curtain parts, and in the same motion the building splits open",
   "stage", "SET-05", "podcast_studio", [],
   "The curtain parts, and in the same motion the building splits open.",
   "Match cut: the curtain → the dollhouse halves.",
   dur=1.4, music="none; under the part, his recorded voice on a phone speaker pre-laps (J 0.8 s)",
   sounds=[S("curtain_draw", 0.1, -24, new=True)],
   jcut=[{"line": "e2-a1-0047", "sound": "Mas's recorded voice, small, through a phone speaker", "lead_s": 0.8}],
   transition={"to": "7", "cause": "his own words are on the record, and the landlord has them on his phone the next morning",
               "sound": "Mas's recorded voice through a phone speaker (J 0.8 s)", "object": "the parting curtain → the building splitting open (match cut)"},
   fix=("P", "TR", "R2"), why="Seam 8.")

# ------------------------------------------------------------------------------------- sc 7 · 0:48
M7 = "E02-05 A TENANT · SET-PIECE SWING, low, on the split → Tasya's Rhodes, one chord under the welcome; ducks under the podcast on the phone"
M7out = "E02-05 out · the key ring's jangle on the downbeat (diegetic); THE COPY (his line on the chip, a note late) rings out under it into the black"
nb("act1", "7.01", "WIDE · the cathedral splits open like a dollhouse, the halves sliding apart; lights click on floor by floor down to the basement",
   "datacenter", "SET-06", "cathedral", ["mas", "staff"],
   "The building splits open, two halves sliding apart in whole-pixel steps. At the top, the dark room, Mas at his monitor. Below it NopeAI's floors; below the foundation MACROSOFT's plinth, BELOW · ABOVE · AROUND; below that a basement. The lights click on one floor at a time, and his recorded voice leads us down.",
   "Egg: Ep1's odometer still wedged in the bedrock. The phone's voice is small and band-passed.",
   lines=[line("e2-a1-0047")], head=1.5, tail=1.4, fixed=("head",), onscreen=[O("BELOW · ABOVE · AROUND", 1.0, None, "sign")],
   music=M7, sounds=[S("dollhouse_slide", 0.0, -22, new=True), S("light_bank_click", 0.8, -26, new=True), S("light_bank_click", 1.6, -26, new=True),
                     S("light_bank_click", "E:e2-a1-0047+0.2", -26, new=True), S("light_bank_click", "E:e2-a1-0047+0.8", -24, new=True)],
   arrive={"s": 1.5, "what": "the split already opening, his voice on the phone leading us down"},
   fix=("P", "R1"), why="The scene leaves Mas's POV on his own recorded voice (signposted).")
nb("act1", "7.02", "2S · the basement: THE HUMANIST with his boxes, screen-left; TASYA already in the doorway, screen-right",
   "datacenter", "SET-06", "basement", ["humanist", "tasya"],
   "THE HUMANIST carries boxes in, DEFLECTION (LICENSED), packed and sealed long before today, their shipping labels faded. TASYA is already in the doorway, his phone face up on a box, playing yesterday's interview; he turns it down on \"chaotic\", the way you'd turn down a song you've heard enough of. The Humanist sets a box down and turns.",
   "The boxes say this was weeks in the making (R2): November recalled, not caused.",
   lines=[line("e2-a1-0048")], head=1.4, tail=0.3,
   onscreen=[O("DEFLECTION (LICENSED)", 0.2, None, "sign"), O("THE HUMANIST · MACROSOFT'S NEW AI CHIEF", 0.3, "L:e2-a1-0048+1.6", "plate")],
   music=M7, sounds=[S("box_set", 0.9, -24, new=True)], fix=("P", "FACT", "R2"),
   why="The landlord's spare moves in (facts A16; confirm the title).")
nb("act1", "7.03", "2S · the same: Tasya's welcome",
   "datacenter", "SET-06", "basement", ["tasya", "humanist"],
   "TASYA does the welcome. One Rhodes chord under it.",
   "", lines=[line("e2-a1-0049", pace=NORMAL)], head=0.5, tail=0.3, music=M7, fix=("P", "KEEP"),
   why="The welcome is the lease.")
nb("act1", "7.04", "2S · the same: the team, the room; Tasya's glance up through the floors",
   "datacenter", "SET-06", "basement", ["humanist", "tasya"],
   "THE HUMANIST asks about his team. TASYA glances up through the floors, and back.",
   "", lines=[line("e2-a1-0050", pace=NORMAL), line("e2-a1-0051", 0.5, NORMAL)], head=0.4, tail=0.3, music=M7,
   fix=("P", "KEEP"), why="\"Quieter than upstairs\" gives the next question its motive.")
nb("act1", "7.05", "ECU · the key ring: a key twisted off; a new one grows back, stamped MAR 19",
   "datacenter", "SET-06", "basement", ["tasya", "humanist"],
   "He twists a key off his ring and holds it out; the Humanist takes it. A new key grows back into the gap at once, MAR 19 stamped on it. On the ring, a tiny paw-print key. An INQUIRY envelope sails in through the cut-away and bonks off the ring.",
   "Eggs: LE CHIEN's paw print; THE TRUSTBUSTER's INQUIRY envelope.",
   lines=[line("e2-a1-0052")], head=2.4, tail=0.9, fixed=("head",), onscreen=[O("RAIL: MAR 19", 0.8, 2.2, "rail"), O("INQUIRY", "E:e2-a1-0052+0.2", None, "sign")],
   music=M7, sounds=[S("door_key_turn", 0.3, -24), S("alert_bonk", "E:e2-a1-0052+0.3", -26)],
   fix=("P", "FACT", "KEEP"), why="\"We keep a spare.\" (facts A16; A8 and A1 are eggs).")
nb("act1", "7.06", "2S · the Humanist, looking up where Tasya looked",
   "datacenter", "SET-06", "basement", ["humanist", "tasya"],
   "THE HUMANIST looks up where Tasya looked.", "",
   lines=[line("e2-a1-0053", pace=NORMAL)], head=0.4, tail=0.3, music=M7, fix=("P", "KEEP"), why="")
nb("act1", "7.07", "WIDE · Tasya's glance, and a whole-pixel pan up the cross-section, floor by floor, to MAS at his monitor",
   "datacenter", "SET-06", "cathedral", ["mas"],
   "Tasya glances up again, and the camera goes with his look: a pan up the cross-section, floor by floor, to MAS at his monitor in the dimmed light. Tasya's answer lands on him, from four floors down. He doesn't hear it.",
   "An L-cut: the line on Mas. When the basement's lights came on, his monitor dimmed one palette step.",
   lines=[line("e2-a1-0054")], head=3.6, tail=0.4, fixed=("head",), music=M7, fix=("P", "KEEP"),
   why="\"A tenant.\" lands on Mas, who doesn't hear it.")
nb("act1", "7.08", "MCU · Mas at his monitor four floors up (held) → the key ring jangles below frame; black",
   "datacenter", "SET-06", "cathedral", ["mas"],
   "Hold on Mas at his monitor, who doesn't hear it. Below frame, the key ring jangles once, on the downbeat. Black: act-out 1.",
   "1.5 s on Mas before the jangle (R1).",
   dur=3.4, music=M7out, sounds=[S("key_ring_jangle_1", 1.6, -18)],
   transition={"to": "8", "cause": "act-out 1", "sound": "the key ring's jangle and THE COPY; the dark room's Water Line under the black",
               "object": "black → the monitor's glow"},
   aftermath="1.5 s on Mas at his monitor, then the jangle", fix=("P", "TR", "R1", "R2"), why="Act-out 1. Seam 9.")

# ------------------------------------------------------------------------------------- ACT TWO · sc 8 · 0:44
M8 = "E02-06 DARK ROOM, SPRING · DARK ROOM (MM-01 the Water Line, low) + each show's tiny ducked media bed"
M8call = "E02-06 · under the call the Water Line thins to its pedal; one chip note on CONFIRMED"
nb("act2", "8.01", "OTS · over Mas's shoulder in the dark, glass in the foreground: the notification slides down; ECU his swipe",
   "darkroom", "SET-07", "darkroom", ["mas", "orb"],
   "The dark room, the monitor's glow already on his face. A notification slides down: EUROPE PASSES ITS AI RULEBOOK · 523–46. Its thumbnail is a 400-page book with a SNOOZE button bolted to its spine. He swipes it away, unopened.",
   "Undated (R1). The SNOOZE stays unpressed until Ep8. On the wall behind him, the framed GUEST lanyard from Ep1 (the dark room's, as in sc 23).",
   dur=4.8, onscreen=[O("EUROPE PASSES ITS AI RULEBOOK · 523–46", 1.4, 3.9, "ui"), O("SNOOZE", 1.4, 3.9, "ui")],
   music=M8, sounds=[S("ui_toast_pop", 1.3, -26), S("ui_swipe", 4.0, -24, new=True)],
   jcut=[{"sound": "the Water Line under act-out 1's black", "lead_s": 1.0}],
   arrive={"s": 2.0, "what": "the dark room with the monitor's glow already on his face"},
   fix=("P", "FACT", "R1", "R2"), why="The act opens on his moves: the rules swiped away (facts A14).")
nb("act2", "8.02", "POV · the monitor scrolls to a news site: a headline over the segment's video still (three cardboard CEOs in lanyards against a height chart; the host turns to the lens)",
   "screen", "SET-09", "darkroom", ["mas"],
   "One whole-pixel scroll to a news site. Its headline, over the segment's video still: a news desk where three cardboard cutouts in lanyards stand in a lineup against a height chart: Mas, his landlord, and Elgoog's. The still plays; the host turns from the lineup and looks down the lens.",
   "The words are the news site's headline, framed as a headline in its own UI (GR §3: an [H] quote only as the headline's exact words), never as the show's own card. The host is unplated (A14). A news-desk sting, tiny and ducked.",
   dur=5.2, fixed=("dur",), onscreen=[O("RAIL: APR 1, 2024", 0.3, 2.1, "rail"), O("…TAKES AIM AT MAS, TASYA AND RADNUS…", 2.3, None, "doc")],
   music=M8, sounds=[S("mouse_scroll", 0.1, -28), S("news_desk_sting", 0.5, -30, new=True)],
   fix=("P", "FACT", "SR"), why="Mas watching himself in a lineup beside his landlord (facts A19: Business Insider's headline on the Apr 1 segment, [H], name swaps).")
nb("act2", "8.03", "OTS · Mas at the monitor, the lineup on it",
   "darkroom", "SET-07", "darkroom", ["mas"],
   "Mas at the monitor, the lineup on it.", "The V.O. types in his cyan.",
   lines=[line("e2-vo-04")], head=0.5, tail=0.5, music=M8, fix=("P", "VO"), why="V.O. 4: own compute someday (the landlord's servers now; ours after).")
nb("act2", "8.04", "POV · his calendar: Elgoog's keynote already on Tuesday; he drags his own launch onto the Monday square",
   "screen", "SET-07", "darkroom", ["mas"],
   "His calendar. ELGOOG · DEVELOPER KEYNOTE is already on TUE 14. He drags his own block, NOPEAI · SPRING UPDATE, onto the MON 13 square. It snaps in.",
   "Who picked the date isn't on record: invented staging of a public result.",
   dur=4.6, fixed=("dur",), onscreen=[O("RAIL: MAY 10", 0.2, 1.8, "rail"), O("ELGOOG · DEVELOPER KEYNOTE · TUE 14", 1.9, None, "ui"),
                                      O("NOPEAI · SPRING UPDATE", 2.4, None, "ui"), O("MON 13", 2.4, None, "ui")],
   music=M8, sounds=[S("ui_drop_snap", 4.0, -22, new=True)], fix=("P", "FACT", "R1"), why="Ship first (facts A24).")
nb("act2", "8.05", "MCU · Mas, the lit Monday square in his eyes",
   "darkroom", "SET-07", "darkroom", ["mas"],
   "The Monday square lit.", "",
   lines=[line("e2-vo-05")], head=0.4, tail=0.4, music=M8, fix=("P", "VO", "SR"), why="V.O. 5: a condition, one day ahead is enough; it reads as foresight once sc 12 shows Elgoog's day under OMNI.")
nb("act2", "8.06", "ECU · his phone face up: a call tile ELPPA, no face, no name → MCU · Mas on the call",
   "call", "SET-07", "darkroom", ["mas"],
   "His phone, face up, rings: a call tile, ELPPA, no face and no name. He answers. Mas, unhurried, says the episode's one full sentence of terms. The tile shows …, then CONFIRMED.",
   "We hear only Mas. No face on the tile, ever.",
   lines=[line("e2-a2-0001")], head=1.6, tail=2.2, fixed=("tail",), onscreen=[O("ELPPA", 0.2, None, "ui"), O("…", "E:e2-a2-0001+0.3", "E:e2-a2-0001+1.3", "ui"),
                                                               O("CONFIRMED", "E:e2-a2-0001+1.3", None, "ui")],
   music=M8call, sounds=[S("call_ring", 0.2, -24), S("call_connect", 1.2, -26), S("ui_confirm_chip", "E:e2-a2-0001+1.3", -22, new=True)],
   pace="normal", fix=("P", "FACT", "R1", "R2"), why="He closes the phone deal: no money either way (facts A58, A40).")
nb("act2", "8.07", "POV · an invite drops into his calendar under the Monday square; he accepts",
   "screen", "SET-07", "darkroom", ["mas"],
   "An invite drops into his calendar: ELPPA · KEYNOTE · JUN 10. He accepts it. The Monday square lit; the June invite under it.",
   "Through the wall: a stage manager's distant count, the walk-on music warming up.",
   dur=3.2, onscreen=[O("ELPPA · KEYNOTE · JUN 10", 0.5, None, "ui")], music=M8,
   sounds=[S("invite_drop", 0.4, -24, new=True), S("post_click", 1.6, -26)],
   jcut=[{"sound": "a stage manager's distant count and the demo's walk-on music through a wall", "lead_s": 1.0}],
   transition={"to": "9", "cause": "the Monday arrives", "sound": "the stage manager's count and the walk-on tune (J 1.0 s)",
               "object": "the lit MON square's glow → the work light backstage"},
   aftermath="the Monday square lit; the June invite under it", fix=("P", "TR"), why="Seam 10.")

# ------------------------------------------------------------------------------------- sc 9 · 0:52
M9 = "E02-07 ONE WORD · the demo's walk-on tune, heard through the wall, ducked (one tune in three rooms)"
CH9 = ["rima", "engineer", "gerg", "mas", "orb", "chatgtp"]
nb("act2", "9.01", "WIDE · the wings in work light: road cases, cables, the monitor screen-right, Gerg's road case in the foreground",
   "stage", "SET-10", "wings", CH9,
   "The wings: road cases and cables, the count from the stage already going. RIMA stands poised with a clicker; a hard circular spotlight finds her even back here. The DEMO ENGINEER holds a phone. On a monitor, CHATGTP is a plain speech bubble. GERG types on a road case. Mas nearby with his glass and THE ORB.",
   "Wings are stage right (screen-left from the house): Mas keeps the left third.",
   lines=[line("e2-a2-0002")], head=2.4, tail=0.3, fixed=("head",), onscreen=[O("RAIL: MAY 13, 2024", 0.3, 2.1, "rail")], music=M9,
   arrive={"s": 2.0, "what": "the wings in work light, road cases and cables, the count from the stage already going"},
   fix=("P", "FACT", "R1"), why="The act's first day (facts A23).")
nb("act2", "9.02", "MEDIUM · the ENGINEER rehearsing to her → SCR · the monitor: yes!!",
   "stage", "SET-10", "wings", ["engineer", "rima", "chatgtp"],
   "The ENGINEER holds the phone up, rehearsing it to her. On the monitor, instantly, with a bright UI chirp: yes!! He looks at it.",
   "The product answers before it's asked (the season's hint).",
   lines=[line("e2-a2-0003", pace=QUICK), line("e2-a2-0004", 0.9, FREE)], head=0.25, tail=0.3,
   onscreen=[O("yes!!", "E:e2-a2-0003+0.1", None, "ui")], music=M9,
   sounds=[S("ui_chirp_bright", "E:e2-a2-0003+0.1", -22, new=True)], fix=("P", "KEEP"), why="")
nb("act2", "9.03", "SCR · the monitor's transcript drops a [laughter] tag → WIDE · Gerg at his road case in the foreground",
   "stage", "SET-10", "wings", ["engineer", "gerg"],
   "He laughs, nervously. On the monitor, the old voice mode's transcript never catches the laugh: a tag, [laughter], drops off the bottom of the screen. GERG, at his road case, warns him. Beyond him, the engineer's laugh stops on \"laugh.\"",
   "The tag is THE PLAN's plant (it lies at the bottom of the grate).",
   lines=[line("e2-a2-0005")], head=1.3, tail=0.4, onscreen=[O("[laughter]", 0.5, None, "ui")], music=M9,
   sounds=[S("engineer_laugh_take", 0.15, -22, new=True, until="L:e2-a2-0005+1.88",
             note="the sound pass's request (lock-v1.md §6): a nervous laugh in the ENGINEER's own library voice, never an "
                  "imitation of anyone (S6), from the beat's first frames, ducked under Gerg's line, stopping on his "
                  "\"laugh.\" (the word ends 1.88 s into the take); it sets up the [laughter] tag and \"It can even laugh back\""),
           S("tag_drop", 0.6, -26, new=True)],
   fix=("P", "KEEP", "LQ"), why="Gerg sets up the demo's laughs.")
nb("act2", "9.04", "2S · Mas, screen-left, and RIMA, the wings behind them (no cut-ins)",
   "stage", "SET-10", "wings", ["mas", "rima"],
   "MAS asks the question Gerg asked him in Ep1. RIMA answers the next question. He grants her a stage that isn't his to grant; she takes it back as a fact.",
   "", lines=[line("e2-a2-0006"), line("e2-a2-0007", 0.5, NORMAL), line("e2-a2-0008", 0.5, NORMAL), line("e2-a2-0009", 0.4, NORMAL)],
   head=0.5, tail=0.6, music=M9, fix=("P", "KEEP", "PACE"), why="Rima owns the demo; Mas watches from the wings.")
nb("act2", "9.05", "WIDE · Mas walks off frame-left; a pan with RIMA as she crosses to the monitor, the ENGINEER following",
   "stage", "SET-10", "wings", ["rima", "engineer"],
   "Mas walks off frame-left, to stage right. RIMA crosses the wings to the monitor; the engineer follows her.",
   "A walk-and-talk.", lines=[line("e2-a2-0010"), line("e2-a2-0011", 0.3, QUICK)], head=1.0, tail=0.3, music=M9,
   fix=("P", "KEEP", "PACE"), why="\"I keep talking\" plants \"…and that's the demo.\"")
nb("act2", "9.06", "SCR · the monitor: the VOICE panel, five slots saying hello; the panel unfolds past the bezel onto a drafting grid",
   "stage", "SET-10", "wings", ["rima", "chatgtp"],
   "She taps the monitor and a settings panel opens: VOICE, five labelled slots, VOICE 1 to VOICE 5, under a tag, SINCE SEP 2023. She hovers each, and each says hello in a different tone. The fifth, Hey., holds a beat longer than the others as the panel keeps unfolding past the monitor's bezel, square by square, onto the floor, and the floor is a drafting grid.",
   "VOICE 5 is CHATGTP's own voice (R1): the voice we'll hear on stage. A [SCR] with its bezel in frame, so the bezel can be broken.",
   lines=[line("e2-a2-0012"), line("e2-a2-0013", 0.3, QUICK), line("e2-a2-0014", 0.3, QUICK), line("e2-a2-0015", 0.3, QUICK),
          line("e2-a2-0016", 0.3, QUICK)], head=1.0, tail=1.6, fixed=("tail",),
   onscreen=[O("VOICE", 0.3, None, "ui"), O("SINCE SEP 2023", 0.4, None, "ui"), O("VOICE 1", 0.4, None, "ui"), O("VOICE 2", 0.4, None, "ui"),
             O("VOICE 3", 0.4, None, "ui"), O("VOICE 4", 0.4, None, "ui"), O("VOICE 5", 0.4, None, "ui")],
   music="E02-07 · the walk-on tune turns into THE PLAN's music-box waltz on the downbeat",
   sounds=[S("panel_unfold_step", "E:e2-a2-0016+0.2", -26, new=True), S("drafting_ink_stroke", "E:e2-a2-0016+1.0", -26)],
   transition={"to": "10", "cause": "the voice panel keeps unfolding past the bezel", "sound": "the walk-on tune becomes the music-box waltz on the downbeat",
               "object": "the voice panel's squares → the drafting grid"},
   aftermath="the fifth square holding its Hey. a beat longer", fix=("P", "FACT", "R1", "TR"), why="Five hellos, the fifth paid at sc 11 and sc 17 (facts A22). Seam 11.")

# ------------------------------------------------------------------------------------- sc 10 · 0:46 (18 bars)
M10 = ("E02-07 · BLUEPRINT: the walk-on tune as a chip music-box waltz (pizzicato, harp, celesta; F dorian; no piano, no "
       "brass); THE PLAN never carries his voice")
BP = "BLUEPRINT · cyan #7FDBFF on navy #0B1E3F"
nb("act2", "10.01", "GFX · the full sheet: the stamp OMNI",
   "void", "SET-11", "blueprint", ["rima"],
   "The panel's last square becomes the grid's first cell. The sheet. A stamp: OMNI, and in fine print (o = omni). RIMA (O.S.), as if running her keynote's first slides in her head.",
   "The linework draws itself on her words.",
   lines=[line("e2-a2-0017")], head=1.6, tail=0.4, onscreen=[O("OMNI", 0.6, None, "doc"), O("(o = omni)", 0.9, None, "doc")], music=M10,
   sounds=[S("rubber_stamp_C", 0.6, -20)], style=BP,
   arrive={"s": 1.0, "what": "the panel's last square becomes the grid's first cell, the waltz on its downbeat"},
   fix=("P", "FACT"), why="The word: one model that hears, sees and talks (facts A23).")
nb("act2", "10.02", "GFX · section, a pan from BEFORE to NOW, starting on BEFORE: three clerks passing a note → detail: the grate",
   "void", "SET-11", "blueprint", ["rima"],
   "BEFORE: a three-box relay drawn as clerks passing a note. On \"fell out\", the grate at box 1: labelled objects drop through it and fall out of the diagram. At the bottom of the grate lies backstage's [laughter] tag.",
   "Every move follows one of her sentences.",
   lines=[line("e2-a2-0018")], head=0.5, tail=1.8, fixed=("tail",),
   onscreen=[O("BEFORE", 0.2, None, "doc"), O("EAR → [1 · SPEECH TO TEXT] → [2 · MODEL] → [3 · TEXT TO SPEECH] → MOUTH", 0.6, None, "doc"),
             O("TONE · LAUGHTER · WHO'S TALKING · BACKGROUND NOISE", "E:e2-a2-0018-1.2", None, "doc"), O("[laughter]", "E:e2-a2-0018+0.4", None, "doc")],
   music=M10, sounds=[S("drafting_ink_stroke", 0.4, -26), S("paper_curl", "E:e2-a2-0018-1.0", -28)], style=BP, fix=("P",),
   why="Anything that wasn't a word fell out (the PLAN's accurate diagram).")
nb("act2", "10.03", "GFX · NOW: an ear, an eye and a mouth wired into one box, GTP-4o",
   "void", "SET-11", "blueprint", ["rima"],
   "NOW: one box, GTP-4o. Nothing falls through the grate. On \"laugh back\", the ear hears a laugh and the mouth laughs back.",
   "", lines=[line("e2-a2-0019")], head=0.5, tail=0.8, onscreen=[O("NOW", 0.2, None, "doc"), O("GTP-4o", 0.5, None, "doc")], music=M10,
   sounds=[S("tiny_laugh_back", "E:e2-a2-0019-0.5", -28, new=True)], style=BP, fix=("P",), why="It can laugh back.")
nb("act2", "10.04", "GFX · a pan down the three steps: step 1",
   "void", "SET-11", "blueprint", ["rima", "engineer"],
   "Three steps, stamped as numbers. Step 1: 232 MS (AVG 320). A tiny engineer opens his mouth, and the tiny bubble has already answered.",
   "", lines=[line("e2-a2-0020")], head=0.4, tail=1.0, onscreen=[O("1.", "E:e2-a2-0020+0.0", None, "doc"), O("232 MS (AVG 320)", "E:e2-a2-0020+0.1", None, "doc")],
   music=M10, sounds=[S("rubber_stamp_C", "E:e2-a2-0020+0.0", -22)], style=BP, fix=("P", "FACT"), why="Every number said (W15).")
nb("act2", "10.05", "GFX · step 2 (MON, a tiny RADNUS on the Tuesday square) and step 3 ($0, a tiny crowd floods in)",
   "void", "SET-11", "blueprint", ["rima", "radnus"],
   "Step 2 lands on \"today\": a tiny calendar with MON circled; a tiny RADNUS stands on the Tuesday square. Step 3 lands on \"free\": $0, and a tiny crowd floods in.",
   "Nobody on the paper mentions Radnus, and neither does she.",
   lines=[line("e2-a2-0021")], head=0.3, tail=1.4, onscreen=[O("2.", "L:e2-a2-0021+1.0", None, "doc"), O("MON", "L:e2-a2-0021+1.0", None, "doc"),
                                                    O("3.", "L:e2-a2-0021+2.18", None, "doc"), O("$0", "L:e2-a2-0021+2.18", None, "doc")],
   music=M10, sounds=[S("rubber_stamp_C", "L:e2-a2-0021+1.0", -22), S("rubber_stamp_C", "L:e2-a2-0021+2.18", -22),
                      S("tiny_crowd_patter", "L:e2-a2-0021+2.45", -28, new=True)],
   style=BP, fix=("P", "FACT", "LQ"), why="The Monday Mas picked; free (facts A23, A24). Each stamp on its own word, from the take: \"today\" at 1.0 s, \"free\" at 2.18 s into the line (lock QA).")
nb("act2", "10.06", "GFX · the full sheet again: the tiny stage in the last square, tiny RIMA in a tiny spotlight",
   "void", "SET-11", "blueprint", ["rima"],
   "The full sheet. In the last square, the tiny stage: tiny lights, tiny RIMA in a tiny spotlight, under her last sentence.",
   "", lines=[line("e2-a2-0022")], head=0.3, tail=0.6, music=M10, style=BP, fix=("P",), why="The voice is promised for later.")
nb("act2", "10.07", "GFX · the break: an empty speech bubble drifts in from the margin and blots out the tiny stage; the blueprint tears",
   "void", "SET-11", "blueprint", [],
   "From the margin, an empty speech bubble drifts onto the paper, lowercase-sized, nothing in it. It was never on the plan. Every tiny figure looks up at it. It drifts over the tiny stage and blots out its lights. The blueprint tears down the middle, and through the tear pour the real stage lights.",
   "The tear's light, a beat, before the stage.",
   dur=5.6, music="E02-07 · a tape-stop into the demo cue at the tear", sounds=[S("paper_tear", "f0.75", -18)], style=BP,
   transition={"to": "11", "cause": "the empty bubble tears the plan", "sound": "a tape-stop into the demo cue", "object": "the tear → the real stage lights pouring through it"},
   aftermath="the tear's light, a beat", fix=("P", "TR"), why="Seam 12.")

# ------------------------------------------------------------------------------------- sc 11 · 1:51
M11 = ("E02-07 · the demo cue (swung, chip lead, light band), one continuous performance; ducks under every line; the "
       "tune's own chip echo under the three-part harmony (THE COPY is out of the demo)")
M11end = "E02-07 · thins to a pad at ENDED and holds it under the post"
CH11 = ["rima", "chatgtp", "engineer", "staff"]
nb("act2", "11.01", "WIDE · the locked meter frame from mid-house: the stage, the big screen, Rima taking her mark",
   "stage", "SET-10", "demo_house", CH11,
   "A clean stage and a big screen. The audience, tiled. RIMA takes her mark, and the spotlight lands on her.",
   "The locked meter frame: every step of the light is measured here. The front row is below this frame (it's first seen in sc 12, after the blimp has gone: FC).",
   lines=[line("e2-a2-0023")], head=2.0, tail=0.4, fixed=("head",), music=M11, sounds=[S("spotlight_swing", 0.6, -24)],
   arrive={"s": 2.0, "what": "the stage wide as Rima takes her mark and the spot finds her"}, fix=("P", "FC"), why="Her demo.")
nb("act2", "11.02", "SCR · the big screen: CHATGTP grows ears, eyes and a mouth in three held steps; a VOICE 5 badge in its corner",
   "stage", "SET-10", "demo_house", ["chatgtp"],
   "On the big screen, CHATGTP's bubble grows features in three held steps, one chip note each: ears, eyes, a mouth. A small VOICE 5 badge in the screen's corner. It speaks.",
   "The badge holds if the facts pull holds (facts A60); otherwise it goes.",
   lines=[line("e2-a2-0024"), line("e2-a2-0025", 0.6, FREE)], head=2.0, tail=0.4, fixed=("head",),
   onscreen=[O("VOICE 5", 1.6, None, "ui")], music=M11,
   sounds=[S("palette_step_F", 0.2, -24), S("palette_step_F", 0.8, -24), S("palette_step_F", 1.4, -24)], style="2.C STREAM (pass)",
   fix=("P", "R1", "FACT"), why="It can see, hear and talk.")
nb("act2", "11.03", "GLYPH 5 frames · its eyes are tokens pointed screen-left, into the wings → 2S · the wings: Mas and THE ORB",
   "stage", "SET-10", "wings", ["mas", "orb"],
   "For five frames its eyes are tokens, pointed screen-left into the wings, at Mas. Then they're friendly again. In the wings, Mas and the Orb; the Orb scans the big screen. Its toast: verified: … The dots never resolve into a word. It gives up.",
   "Toast 1 of 3.", dur=3.2, fixed=("dur",), onscreen=[O("verified: …", 0.9, 2.6, "toast")], music=M11,
   sounds=[S("glyph_blink", 0.05, -26), S("orb_scan_sweep", 0.6, -26), S("ui_toast_pop", 0.9, -28)],
   style="GLYPH (5 frames, the eyes)", fix=("P",), why="")
nb("act2", "11.04", "WIDE · the meter frame: the ENGINEER at his mark downstage right raises the phone; the product answers from the big screen",
   "stage", "SET-10", "demo_house", CH11,
   "The ENGINEER asks for short answers. CHATGTP gets three words from the end, and he comes in over its last word. It finishes anyway. A laugh from the house; in the same frame the spotlight slides one step off Rima toward the big screen.",
   "The episode's first cut-off, with a motive the house can see. Record CHATGTP's line whole; \"Thanks.\" comes in over \"favorite\". Subtitles: \"…one of my favorite—\" / \"Thanks.\" / \"—things.\"",
   lines=[line("e2-a2-0026"),
          line("e2-a2-0027", 0.2, QUICK, sub=[["Great question! Of course! Honestly, short answers are one of my favorite—", 0],
                                              ["—things.", "after:e2-a2-0028"]]),
          line("e2-a2-0028", -0.55, FREE, overlap=True)],
   head=0.4, tail=3.0, fixed=("tail",),
   music=M11, sounds=[S("crowd_laugh_m", "E:e2-a2-0027+0.3", -20, new=True), S("spotlight_swing", "E:e2-a2-0027+0.8", -24)],
   fix=("P", "KEEP", "PACE"), why="Laugh 1; the light's first step.")
nb("act2", "11.05", "WIDE · the meter frame → SCR · three mouths",
   "stage", "SET-10", "demo_house", CH11,
   "The ENGINEER tries again. CHATGTP's mouth splits into three mouths, and it harmonises with itself. A bigger laugh. The spotlight slides a second step.",
   "Three-part harmony through the intro's sung-vocal pipeline.",
   lines=[line("e2-a2-0029", pace=FREE), line("e2-a2-0030", 0.4, FREE)], head=0.5, tail=3.2, fixed=("tail",), music=M11,
   sounds=[S("crowd_laugh_l", "E:e2-a2-0030+0.2", -18, new=True), S("spotlight_swing", "E:e2-a2-0030+1.0", -24)],
   fix=("P", "KEEP"), why="Laugh 2; the second step.")
nb("act2", "11.06", "MCU · RIMA, half in the light now, perfectly still; she clicks to the next slide on the running order",
   "stage", "SET-10", "demo_house", ["rima"],
   "RIMA, half in the light, clicks to the next slide exactly on the running order.",
   "Under pressure she sticks to the script harder.", lines=[line("e2-a2-0031")], head=0.8, tail=0.4, music=M11,
   sounds=[S("clicker_click", 0.4, -28, new=True)], fix=("P", "KEEP"), why="")
nb("act2", "11.07", "WIDE · the engineer turns the phone's camera on the audience → SCR · 😊 → WIDE · the third step",
   "stage", "SET-10", "demo_house", CH11,
   "The ENGINEER turns the phone's camera around, onto the audience. CHATGTP is overwhelmed. In the audience, one pair of glasses fogs. It blushes: on the big screen, 😊. The third step: the spotlight is more on the screen than on her.",
   "The fogged glasses are a mid-house audience member's, never the front row.",
   lines=[line("e2-a2-0032"), line("e2-a2-0033", 0.2, QUICK), line("e2-a2-0034", 1.0, FREE)], head=0.4, tail=3.0, fixed=("tail",),
   onscreen=[O("😊", "E:e2-a2-0034+0.1", None, "ui")], music=M11,
   sounds=[S("crowd_laugh_m", "E:e2-a2-0034+0.3", -20, new=True), S("spotlight_swing", "E:e2-a2-0034+1.1", -24)],
   fix=("P", "KEEP"), why="Laugh 3; the third step (SYDNEY's emoji from Ep1).")
nb("act2", "11.08", "SCR · the stream's chat scrolls up the side: what's the catch? sticks",
   "stage", "SET-10", "demo_house", ["chatgtp"],
   "On the big screen the livestream chat scrolls up the side. One comment sticks: what's the catch? CHATGTP answers, delighted, and gets the last laugh.",
   "Live, before her close (R1). Free is the catch; safety is never mentioned (script review: no thesis by placement).",
   lines=[line("e2-a2-0035")], head=1.3, tail=1.3, fixed=("head",),
   onscreen=[O("what's the catch?", 0.3, None, "ui")], music=M11, sounds=[S("crowd_laugh_s", "E:e2-a2-0035+0.2", -22, new=True)],
   fix=("P", "R1", "SR"), why="A cold little laugh.")
nb("act2", "11.09", "MCU · RIMA in the half-dark, perfectly composed; the house waits on her (HOLD 1 BAR)",
   "stage", "SET-10", "demo_house", ["rima"],
   "RIMA, in the half-dark, perfectly composed. The house is waiting on her, and she lets it. Then her close.",
   "The episode's one long hold of hers.", lines=[line("e2-a2-0036", pace=WEIGHTED)], head=2.5, tail=0.5, fixed=("head",),
   music=M11, pace="weighted", fix=("P", "KEEP", "R1"), why="\"I keep talking\", paid.")
nb("act2", "11.10", "SCR → WIDE · the big screen: LIVE → ENDED; the house lights up a step; people start to move",
   "stage", "SET-10", "demo_house", ["staff"],
   "The big screen goes from LIVE to ENDED. The house lights come up a step. People start to move.",
   "The stream ends before the post (the post is about 20 minutes later: R1).",
   dur=3.0, fixed=("dur",), onscreen=[O("LIVE", 0.0, 0.8, "ui"), O("ENDED", 0.8, None, "ui")], music=M11end,
   sounds=[S("stream_end_tone", 0.7, -24, new=True), S("house_lights_up", 1.2, -26, new=True)], fix=("P", "R1", "GR"), why="")
nb("act2", "11.11", "MEDIUM · in the wings, Mas takes out his phone → ECU · his thumb typing h · e · r",
   "stage", "SET-10", "wings", ["mas"],
   "In the wings, Mas takes out his phone, his face unchanged. His thumb types h · e · r at a post's own pace, off the beat.",
   "A real post never rides the beat.", dur=3.0, fixed=("dur",), onscreen=[O("h", 1.0, None, "ui"), O("he", 1.5, None, "ui"), O("her", 2.1, None, "ui")],
   music=M11end, sounds=[S("typing_soft", 1.0, -28), S("typing_soft", 1.5, -28), S("typing_soft", 2.1, -28)],
   fix=("P", "R1"), why="His act, on the record.")
nb("act2", "11.12", "MCU · his face in the work light, still (2 beats) → POV · the post lands",
   "stage", "SET-10", "wings", ["mas"],
   "His face in the work light, still, two beats. Post. The softest click. His post, in its own UI.",
   "Why he posted it is contested: nothing tells us (W8).",
   dur=3.2, fixed=("dur",), onscreen=[O("her", 1.4, None, "post")], music=M11end,
   sounds=[S("post_click", 1.3, -30)], fix=("P", "FACT", "GR"), why="\"her\" (facts A23b, [V]).")
nb("act2", "11.13", "WIDE · the word becomes a blimp and rises over the emptying house; the press row's screens and the raised phones swing to it",
   "stage", "SET-10", "demo_house", ["staff"],
   "The word lifts off his screen. It swells into a lowercase blimp, her, and rises out of the wings in four held sizes over the emptying house. The press row's screens and a wall of raised phones swing to it.",
   "The blimp takes the coverage, not her live stage (R1). Four held sizes, one a bar.",
   dur=10.0, fixed=("dur",), music=M11end, sounds=[S("blimp_inflate_step", 0.3, -24, new=True), S("blimp_inflate_step", 2.8, -23, new=True),
                                  S("blimp_inflate_step", 5.3, -22, new=True), S("blimp_inflate_step", 7.8, -21, new=True),
                                  S("phone_wave_buzz", 6.0, -24, new=True)], fix=("P", "R1"), why="The coverage moves.")
nb("act2", "11.14", "MCU · RIMA on her mark, composed, not looking up",
   "stage", "SET-10", "demo_house", ["rima"],
   "RIMA holds her mark, composed. She doesn't look up.",
   "No wince (R2: no 'understudy' framing, GR §6).", dur=2.6, fixed=("dur",), music=M11end, fix=("P", "R2", "GR"), why="Her close made.")
nb("act2", "11.15", "2S · the ENGINEER beside RIMA at her mark, unclipping his headset, off mic, reading his phone; she doesn't look up",
   "stage", "SET-10", "demo_house", ["engineer", "rima"],
   "The ENGINEER, unclipping his headset, stops beside RIMA at her mark and reads it to her off his phone, off mic. She doesn't look up: her held mark (11.14) is the reaction.",
   "Said to a listener (W19). His words are the film's premise, not the voice (D-6).",
   lines=[line("e2-a2-0037"), line("e2-a2-0038", 0.6, FREE)], head=0.7, tail=0.4, music=M11end,
   sounds=[S("headset_unclip", 0.2, -26, new=True)], fix=("P", "R1", "GR", "SR"), why="What the word points at (the film's premise only), told to the one person who doesn't look up.")
nb("act2", "11.16", "WIDE · every head near the wings turns; the blimp over the emptying house",
   "stage", "SET-10", "demo_house", ["staff"],
   "Every head near the wings turns. The blimp over the emptying house.",
   "", dur=3.0, fixed=("dur",), music=M11end, sounds=[S("cloth_rustle", 0.2, -28), S("crowd_hush", 0.4, -28)],
   lcut=[{"sound": "the house's murmur and a wave of phone buzzes carry over the cut", "over_s": 1.0}],
   transition={"to": "12", "cause": "the stream's over and the coverage has moved", "sound": "the house's murmur and the phones' buzz (L)",
               "object": "the big screen's ENDED → the same screen, dark, as the house lights come up full; the blimp gone through the rig (FC)"},
   aftermath="the heads turning to the wings; the blimp over the emptying house", fix=("P", "TR"), why="Seam 13.")

# ------------------------------------------------------------------------------------- sc 12 · 0:40
M12 = ("E02-07 · the demo cue as a thin pad, held across the beat of black into the afternoon (one sequence); the Door "
       "(Alyi's motif) with its first note missing, once, on the chrome's toast")
M12b = ("E02-07 · the news's tiny ducked bed under the pad until he minimises it; the pad thins to its pedal under Alyi's "
        "post; the designed stop after the hold on his face (the midpoint act-out)")
nb("act2", "12.01", "WIDE · the stage as the house lights come up full, the rig empty, Rima small on her mark → MCU · Rima, one breath",
   "stage", "SET-10", "demo_house", ["rima"],
   "On stage, the house lights come up full. The blimp has drifted out through the rig and is gone. RIMA is the last one still on her mark, the clicker in her hand. One breath, the professional's close, and she walks off with it.",
   "Her aftermath is her own (R2): nobody hands anybody a clicker.",
   dur=5.4, music=M12, sounds=[S("house_lights_up", 0.2, -24, new=True)],
   arrive={"s": 2.0, "what": "the stage as the house lights come up full, the blimp gone, the murmur thinning"},
   fix=("P", "R2", "FC", "GR"), why="\"her\" and the departure never share a frame (FC).")
nb("act2", "12.02", "WIDE · the front row from the wings, in plain house light, the house empty",
   "stage", "SET-10", "demo_house", [],
   "The front row, in plain house light, the house empty. The seat reserved for the chief scientist is empty. The placard stays as it is.",
   "No shade, no tether, no flip (FC).", dur=2.8, onscreen=[O("RESERVED: CHIEF SCIENTIST", 0.4, None, "sign")], music=M12,
   fix=("P", "FC", "GR"), why="An empty seat.")
nb("act2", "12.03", "ECU · the chrome armrest: Ep1's Sep 25 party toast for two seconds, then only the empty seat",
   "stage", "SET-10", "demo_house", ["alyi"],
   "In its chrome armrest, for two seconds, the party from last September: Alyi turning to Mas with a toast and a smile. Then the chrome shows only the empty seat.",
   "Ep1's own art (copied), held 2 s (R2). A memory in a surface, not a ghost: it plays as a reflection of a past event, then goes.",
   dur=3.4, fixed=("dur",), music=M12, sounds=[S("door_motif_note", 0.2, -26, new=True, note="the Door, first note missing (score)")],
   fix=("P", "R2"), why="The bond, recalled before his own goodbye (W14).")
nb("act2", "12.04", "BLACK · a beat",
   "void", "SET-10", "black", [],
   "A beat of black. The pad holds across it.", "", dur=1.0, fixed=("dur",), music=M12,
   transition={"to": "12.05", "cause": "the next day", "sound": "the demo's pad held across the black; the news's bed under it",
               "object": "the empty seat in the chrome → black → the monitor's news graphic"},
   fix=("P", "TR"), why="Seam 14.")
nb("act2", "12.05", "MCU · Mas at his desk, the monitor beside him (the news graphic legible); his hand minimising it",
   "darkroom", "SET-07", "darkroom", ["mas"],
   "His dark room, in the afternoon. On his monitor, the news recaps Elgoog's keynote under NopeAI's OMNI stamp from the day before: their Tuesday opened on his news. He minimises it and goes back to work. A beat.",
   "OMNI, not the blimp (FC); closed before the phone lights.",
   dur=6.0, fixed=("dur",), onscreen=[O("RAIL: MAY 14, 2024", 0.3, 2.1, "rail"), O("ELGOOG'S KEYNOTE", 2.0, 4.6, "ui"), O("OMNI", 2.0, 4.6, "ui")],
   music=M12b, sounds=[S("news_bed_tiny", 0.0, -34, new=True, note="ducked; cut as he minimises it", dur=4.6), S("ui_minimise", 4.6, -26, new=True)],
   arrive={"s": 1.5, "what": "the dark room with the monitor's news already playing"},
   fix=("P", "R2", "FC", "FACT"), why="V.O. 5's plan pays; a small dry win, closed and done (facts A24).")
nb("act2", "12.06", "ECU · his phone lights: Alyi's post, in its own UI; his thumb scrolls once",
   "screen", "SET-07", "darkroom", [],
   "His phone lights: Alyi's post, in its own UI. His thumb scrolls once.",
   "Two crops (R2). Alyi's own words; no reason given (W8).",
   dur=6.6, fixed=("dur",), onscreen=[O("After almost a decade, I have made the decision to leave NOPEAI.", 0.4, 3.9, "post"),
                                      O("…I will miss everyone dearly.", 4.3, 6.4, "post")],
   music=M12b, sounds=[S("phone_buzz_step_1", 0.1, -26), S("thumb_scroll", 4.0, -28, new=True)],
   fix=("P", "FACT", "R1", "GR"), why="Alyi leaves in his own words, warmly (facts A25).")
nb("act2", "12.07", "ECU · he types his own post at a post's pace and posts it → the post, hard-stopped at \"…and a dear friend.\"",
   "screen", "SET-07", "darkroom", ["mas"],
   "He types his own post, at a post's pace, and posts it. His posted words hold. Over them, after both posts have had their read time, his voice.",
   "Sentence case as the source has it; no capital 'I' on screen (Ep7's slip is reserved). No scroll.",
   lines=[line("e2-vo-06")], head=9.3, tail=0.4, fixed=("head",),
   onscreen=[O("ALYI and NOPEAI are going to part ways. This is very sad to me; ALYI is easily one of the greatest minds of our generation, a guiding light of our field, and a dear friend.", 0.4, "end", "post")],
   music=M12b, sounds=[S("key_tap_soft_01", 0.6, -30), S("key_tap_soft_03", 1.4, -30), S("key_tap_soft_05", 2.2, -30), S("post_click", 3.2, -28)],
   fix=("P", "VO", "FACT", "R1", "SR"), why="V.O. 6 over his act: his want, as a fact about himself, the hope unsaid (facts A61). The post's text is 172 characters: 8.85 s to read from its first letter (P15), so the voice comes 8.9 s after it (lock QA: it came at 8.2; the plan had counted 165).")
nb("act2", "12.08", "MCU · his face, held 2–3 s; the cue stops mid-phrase on the downbeat",
   "darkroom", "SET-07", "darkroom", ["mas"],
   "Hold on his face. The cue stops mid-phrase on the downbeat. Black: the midpoint act-out.",
   "A face light one step (P10).", dur=2.8, fixed=("dur",), music="E02-07 · the designed stop, mid-phrase on the downbeat",
   transition={"to": "13", "cause": "the midpoint act-out", "sound": "THE CLOCK's first tick under the black",
               "object": "his phone's posted card → a flyer's doorway photo, same place in frame"},
   aftermath="his face, 2–3 s, then the stop", fix=("P", "TR"), why="Midpoint act-out. Seam 15.")

# ------------------------------------------------------------------------------------- ACT THREE · sc 13 · 0:36
M13 = ("E02-08 WHERE'S ALYI? · THE CLOCK, first step (a pizzicato and woodblock tick on varied pitches under the knee's "
       "rising F G A♭ C), pre-lapped under the black; the presser a tiny ducked bed")
nb("act3", "13.01", "OTS-WIDE · over Mas's shoulder at his pillar, onto two STAFFERS at theirs: one peels a curled flyer's corner, one smooths hers back down",
   "lobby", "SET-01", "lobby_day", ["mas", "staffer", "staffer2", "gerg", "staff"],
   "The lobby by day. February's WHERE IS ALYI? flyers are still on the rack pillars, curling at the corners; every photo is a doorway. In the middle of the floor the February complaint has become a side table. Two STAFFERS stand at the next pillar: one peels a curled corner off a flyer, the other smooths the tape back down on hers; the lobby TV murmurs.",
   "February's flyers, curling (R2): not fresh ones.",
   lines=[line("e2-a3-0001"), line("e2-a3-0002", 0.25, QUICK)], head=2.4, tail=0.3, fixed=("head",),
   onscreen=[O("WHERE IS ALYI?", 0.3, None, "sign")], music=M13,
   jcut=[{"sound": "THE CLOCK's first tick under the midpoint's black", "lead_s": 0.8}],
   arrive={"s": 2.0, "what": "the staffers already at the pillar, one peeling, one smoothing, the TV murmuring"},
   fix=("P", "R2", "FC", "PACE"), why="Everyone misses him (facts A29).")
nb("act3", "13.02", "OTS-WIDE · the first staffer turns to Mas, the peeled corner in her hand",
   "lobby", "SET-01", "lobby_day", ["staffer", "mas"],
   "The first staffer turns to Mas, the corner she was peeling still in her hand.", "Her question follows from her hands (script review).",
   lines=[line("e2-a3-0003", pace=QUICK), line("e2-a3-0004", 0.45, QMAS)], head=0.3, tail=0.3, music=M13,
   fix=("P", "R2", "PACE"), why="Mas decides: the flyers stay up.")
nb("act3", "13.03", "ECU → MCU · a fallen flyer; Mas picks it up and tapes it back himself, upside down",
   "lobby", "SET-01", "lobby_day", ["mas"],
   "One flyer has fallen to the floor. Mas picks it up and tapes it back himself, upside down. Nobody corrects him. His upside-down flyer, a beat.",
   "It's still a doorway.", dur=6.4, fixed=("dur",), music=M13, sounds=[S("paper_flutter", 0.4, -26), S("tape_pull", 2.4, -24, new=True)],
   fix=("P", "R1", "R2"), why="Hope, his own hand (the flyer's arc: 13 → 19 → 20 → 22).")
nb("act3", "13.04", "SCR → FULL FRAME · the lobby TV framed in the foreground, pushed in: the Senate presser",
   "screen", "SET-01", "lobby_day", ["remuhcs"],
   "The lobby TV gets its own beat. A Senate press conference: REMUHCS and three bipartisan colleagues behind a lectern stencilled ROADMAP · $32B/YR, nine FORUM stickers on it. Aides try to wheel it through a door marked FLOOR: his own floor, which he schedules. It doesn't fit. They turn it sideways. It still doesn't fit.",
   "Legible at 1080p: the plate, the stickers, FLOOR. The lower third carries a neutral text blip (FC).",
   dur=4.4, fixed=("dur",), onscreen=[O("REMUHCS · MAJORITY LEADER", 0.3, 2.6, "plate"), O("BIPARTISAN SENATE AI ROADMAP", 0.5, None, "lower-third"),
                                      O("ROADMAP · $32B/YR", 0.6, None, "sign"), O("FORUM ×9", 0.6, None, "sign"), O("FLOOR", 1.6, None, "sign")],
   music=M13, sounds=[S("blip_text_neutral", 0.5, -26, new=True), S("lectern_bump", 2.2, -26, new=True), S("lectern_bump", 3.4, -26, new=True)],
   fix=("P", "FACT", "FC", "GR"), why="The political counterweight, at similar weight (facts A30, A62).")
nb("act3", "13.05", "SCR · the TV: a reporter's question; an aide slaps a tenth sticker on the lectern",
   "screen", "SET-01", "lobby_day", ["remuhcs"],
   "A REPORTER's question from the TV. An aide slaps a tenth FORUM sticker on the lectern.",
   "No invented words in a real senator's mouth (D-50).",
   lines=[line("e2-a3-0005")], head=0.3, tail=1.6, fixed=("tail",), music=M13,
   sounds=[S("sticker_slap_tv", "E:e2-a3-0005+0.6", -24, new=True)], fix=("P", "R2", "GR"), why="Ten forums, no vote.")
nb("act3", "13.06", "WIDE · the lobby master: Mas walks off frame-right into the open floor; the band lights as he crosses the threshold",
   "lobby", "SET-01", "lobby_day", ["mas"],
   "Mas walks off the lobby floor, frame-right, into the open-plan office. The adventure band lights up as he crosses the threshold.",
   "", dur=2.4, music="E02-08 · THE CLOCK's first step carries", sounds=[S("ui_band_on", 1.6, -26, new=True)],
   transition={"to": "14", "cause": "he goes to reach him", "sound": "the open floor's band lights as he crosses; THE CLOCK carries",
               "object": "his exit frame-right → his entry frame-left"},
   fix=("P", "TR"), why="Seam 16.")

# ------------------------------------------------------------------------------------- sc 14 · 0:59
M14 = ("E02-08 · THE CLOCK continues under the room tone; the chair's hum is the GPU choir's chord (D♭ sus2(♯11), no third), "
       "diegetic into score")
UI14 = "UI LIT (the adventure game's band)"
nb("act3", "14.01", "WIDE · the spread: tiled staff, glass walls, polished heatsinks, a coffee urn, a spoon in a mug, a chiller puddle; the band lit",
   "bullpen", "SET-12", "open_floor", ["mas", "staff", "dot"],
   "The open floor as a find-the-man spread: dozens of tiled staff, glass walls, polished heatsinks catching the light, a coffee urn, a spoon standing in a mug, a puddle under a leaking chiller. The band: Look at · Talk to · Pick up · Use · Open (greyed) · Pivot · Raise. Inventory: CTRL · ESC · glass · phone.",
   "No image of Alyi in any surface (FC). The band is the episode's one dialogue tree; his choices are his phone's strip, never a cursor (P6).",
   dur=2.8, fixed=("dur",), onscreen=[O("Look at · Talk to · Pick up · Use · Open · Pivot · Raise", 0.2, None, "ui"), O("CTRL · ESC · glass · phone", 0.2, None, "ui")],
   music=M14, style=UI14, arrive={"s": 2.5, "what": "the spread with the band lit and the heatsinks' polish catching the light"},
   fix=("P", "FC"), why="Reaching, not finding.")
nb("act3", "14.02", "WIDE · the spread: Look at heatsink; Pick up reflection",
   "bullpen", "SET-12", "open_floor", ["mas"],
   "Look at heatsink. The dialogue box types, in his lowercase: i can see my face in it. Pick up reflection: i can't pick that up.",
   "The adventure game's refusal, in the game's register.",
   dur=5.0, fixed=("dur",), onscreen=[O("Look at heatsink", 0.2, 1.0, "ui"), O("i can see my face in it.", 1.0, 2.6, "ui"),
                                      O("Pick up reflection", 2.8, 3.5, "ui"), O("i can't pick that up.", 3.5, 4.9, "ui")],
   music=M14, sounds=[S("ui_verb_select", 0.2, -26, new=True), S("ui_verb_select", 2.8, -26, new=True)], style=UI14,
   fix=("P", "FC"), why="")
nb("act3", "14.03", "WIDE → MCU · Talk to reflection: Mas's own face in the polished metal; his phone's suggestion strip",
   "bullpen", "SET-12", "open_floor", ["mas"],
   "Talk to reflection: it's Mas's own face in the polished metal. His phone's strip offers three lines, what he'd say to Alyi. He taps the greyed come back first. Bonk.",
   "The strip is the machine's read of him, never his mind. The greyed option is exactly the 1993 Cancel.",
   dur=5.0, fixed=("dur",), onscreen=[O("Talk to reflection", 0.2, 0.9, "ui"), O("> where are you going?", 1.0, None, "ui"), O("> can we talk?", 1.0, None, "ui"),
                                      O("> come back", 1.0, None, "ui")],
   music=M14, sounds=[S("ui_verb_select", 0.2, -26, new=True), S("alert_bonk", 4.0, -22)], style=UI14,
   fix=("P", "R2", "FC"), why="His rehearsal of what he'd say (MIV §4: once an episode, the effort shows).")
nb("act3", "14.04", "MCU · his own reflection mouthing can we talk? back to him",
   "bullpen", "SET-12", "open_floor", ["mas"],
   "Then can we talk? His own reflection mouths it back to him. No voice.",
   "The Door blooms once, first note missing.", dur=3.2, music="E02-08 · the Door (first note missing) blooms once, on his own reflection",
   style=UI14, fix=("P", "R2"), why="Lonely: his own face saying it.")
nb("act3", "14.05", "WIDE · from her ladder, DOT's orange cuff points a screwdriver at Alyi's office door",
   "bullpen", "SET-12", "open_floor", ["dot", "mas"],
   "From her ladder, DOT's orange cuff points a screwdriver at Alyi's office door.",
   "Her hands only.", dur=2.2, music=M14, style=UI14, fix=("P", "R2"), why="")
nb("act3", "14.06", "WIDE · Alyi's door: Open greyed, bonk; the knock shakes Ep1's yellowed note off the frame into his pocket",
   "bullpen", "SET-12", "open_floor", ["mas"],
   "At Alyi's door: Open is greyed. Bonk. The knock shakes Ep1's yellowed note off the door frame; it flutters down into his inventory, which is his pocket. Pick up note.",
   "At the spread's scale: no insert, no tag, no Mas colour (FC). Never defined.",
   dur=4.2, fixed=("dur",), onscreen=[O("Open", 0.2, 0.8, "ui"), O("Pick up note", 2.6, 3.8, "ui")], music=M14,
   sounds=[S("alert_bonk", 0.6, -22), S("paper_flutter", 1.2, -24)], style=UI14, fix=("P", "FC", "GR"),
   why="The note goes into his pocket and stays there (Ep11).")
nb("act3", "14.07", "WIDE → 2S · beside the door, Alyi's old chair, still humming; BUKAJ sits in it with a box of printouts",
   "bullpen", "SET-12", "open_floor", ["bukaj", "mas"],
   "Beside the door, Alyi's old chair, still humming. BUKAJ arrives with a box of printouts and sits down in it. The hum goes on under him. The strip offers one line, and Mas takes it at once: the box types congratulations. as he says it.",
   "The chosen strip line is voiced in his own voice as the box types it (voiced adventure games do this; P9).",
   lines=[line("e2-a3-0023")], head=3.5, tail=0.15, fixed=("head",),
   onscreen=[O("BUKAJ · NEW CHIEF SCIENTIST · INHERITED THE HUM.", 0.4, 3.2, "plate"), O("congratulations.", "L:e2-a3-0023-0.1", None, "ui")],
   music=M14, sounds=[S("chair_hum_choir", 0.0, -30, new=True, note="diegetic: the GPU choir chord", dur=4.8)], style=UI14,
   fix=("P", "FACT", "SR"), why="A new chief scientist in his chair (facts A26); Mas says it aloud.")
nb("act3", "14.08", "2S · Mas, screen-left; BUKAJ seated, screen-right, one hand flat on the humming armrest",
   "bullpen", "SET-12", "open_floor", ["bukaj", "mas"],
   "BUKAJ thanks him. The strip: need anything? Mas takes it, and says it as the box types it. BUKAJ doesn't take his hand off the armrest.",
   "The typed lines stay in the band, voiced as they type; Bukaj's answers in the two-shot.",
   lines=[line("e2-a3-0006", pace=NORMAL), line("e2-a3-0024", 0.5, NORMAL), line("e2-a3-0007", 0.5, NORMAL)], head=0.5, tail=0.4,
   onscreen=[O("need anything?", "L:e2-a3-0024-0.1", "E:e2-a3-0024+0.6", "ui")], music=M14, style=UI14, fix=("P", "SR"),
   why="Room to work; the job, not Alyi. Mas trying hardest, aloud (P9).")
nb("act3", "14.09", "WIDE · EKIEL walks out with a box past ordinary desks, squinting; the card",
   "bullpen", "SET-12", "open_floor", ["ekiel"],
   "EKIEL crosses the floor carrying a box, squinting hard, past ordinary desks. The card freezes on him.",
   "No shiny-product pedestals (FC).", dur=3.4, fixed=("dur",), onscreen=[O("EKIEL / CO-LED THE SAFETY TEAM.", 0.6, 2.9, "card"), O("SQUINT: 100%", 1.0, 2.9, "stat")],
   music=M14, sounds=[S("freeze_hit_F", 0.6, -18)], style="2-TONE FREEZE (the card, 1 bar)", fix=("P", "FC"), why="")
nb("act3", "14.10", "HIGH · the floor: his resignation thread stands up as one domino, in its own UI; it topples to Mas's shoe",
   "bullpen", "SET-12", "open_floor", ["ekiel", "mas"],
   "He sets his resignation thread down as one domino, in its own UI, MAY 17: its first post. He walks out. The domino topples across the floor and stops against the toe of Mas's shoe.",
   "One domino (R2). His own words: the thread's first post, which states the departure and carries no grievance (script review).", dur=6.0, fixed=("dur",),
   onscreen=[O("MAY 17", 0.6, None, "post"), O("Yesterday was my last day as head of alignment, superalignment lead, and executive @NOPEAI.", 0.7, 5.6, "post")],
   music="E02-08 · thins to its pedal under Ekiel's post", sounds=[S("domino_set", 0.5, -24, new=True), S("domino_topple_run", 4.6, -24, new=True)],
   style=UI14, fix=("P", "FACT", "R2", "FC", "SR"), why="The safety co-lead leaves, in his own words (facts A27: the thread's first post, May 17, 2024).")
nb("act3", "14.11", "WIDE → ECU · down the corridor beside Ekiel's empty desk: the safety team's own door; an orange cuff backs out four screws",
   "bullpen", "SET-12", "open_floor", ["dot"],
   "Down the corridor, beside Ekiel's empty desk, the safety team's own door. An orange-cuffed hand backs four screws out of its plate, one per beat, and drops it in a box marked MISC.",
   "The team's own door, never Alyi's (R2).", dur=5.2, fixed=("dur",),
   onscreen=[O("SUPERALIGNMENT", 0.3, None, "sign"), O("SAFETY TEAM", 0.3, None, "sign"), O("MISC", 4.0, None, "sign"), O("MAY 17", 4.0, None, "sign")],
   music=M14, sounds=[S("screw_turn_1", 1.0, -24), S("screw_turn_2", 1.625, -24), S("screw_turn_3", 2.25, -24), S("screw_turn_4", 2.875, -24),
                      S("nameplate_off", 3.4, -22), S("plate_drop_box", 3.9, -22, new=True)],
   style=UI14, fix=("P", "FACT", "R2"), why="The team's plate comes off the team's door (facts A27).")
nb("act3", "14.12", "WIDE · back at Alyi's door: Pivot door; it turns on its centre pin",
   "bullpen", "SET-12", "open_floor", ["mas"],
   "Back at Alyi's door, Mas tries the other verb: Pivot door. It turns on its centre pin. The old chair's hum swells.",
   "", dur=2.8, onscreen=[O("Pivot door", 0.2, 1.0, "ui")], music=M14,
   sounds=[S("ui_verb_select", 0.2, -26, new=True), S("door_pivot_creak", 0.9, -22, new=True)], style=UI14,
   lcut=[{"sound": "the old chair's hum swells and rings over the cut", "over_s": 1.0}],
   transition={"to": "15", "cause": "the door he couldn't open turns on its pin, and evening has come", "sound": "the chair's hum rings over (L)",
               "object": "the pivoting door → the same door from inside the office"},
   aftermath="the plate in the box; then his hand on Alyi's door as it pivots", fix=("P", "TR"), why="Seam 17.")

# ------------------------------------------------------------------------------------- sc 15 · 1:40 (F2.2 inside)
M15 = "E02-09 FEEL IT · the chair's hum carries in, then stops; DARK ROOM, one felt piano (his interior); Ep1's line under it unscored"
M15w = ("E02-09 · F2.2: the GPU choir and glass shimmer, ppp (the Orb-era glossy colour), the Door over it; the chant's "
        "giddy lift (warm, never a hymn), thinning under the exchange")
M15o = "E02-09 · the choir thins to its no-third chord under the post and \"Someone should.\""
M15t = ("E02-09 · the Publish click on the Door's held ♯4 (warm resolve, no cadence); the Ache (D♭ + G over an F pedal) "
        "under the fire")
M15x = "E02-09 · the felt returns within a bar of the pin; thins to its pedal on the stairs; the buzz is the out"
F22 = {"when": "DEC 2022 → 2023", "of": "F2.2 (Alyi: the full motive flashback)", "shape": "want → obstacle → turn",
       "tier": "T4 glossy: glass, bloom, lit by its own light; rim #FF6A1A",
       "in": "the pin's ripple turning warm and breaking into string lights (15.05)", "out": "the fire's glow shrinking to the pin (15.16)",
       "no_vo": "no inner voice in a memory", "rule": "some part of Alyi is always cut off by a frame"}
nb("act3", "15.01", "WIDE · the empty office: a desk with no chair; Mas sits on the desk's edge",
   "office", "SET-13", "office_evening", ["mas", "orb"],
   "An empty office in the evening: a desk with no chair. Carried over the cut, the chair's hum sounds in the empty space where it stood, and stops. Mas sits on the edge of the desk.",
   "", dur=2.6, fixed=("dur",), music=M15, arrive={"s": 2.0, "what": "the empty office as the carried hum stops"},
   fix=("P", "FC"), why="The office is evening, not night (FC).")
nb("act3", "15.02", "ECU · his phone: the thread, collapsed to dates and first lines",
   "screen", "SET-13", "office_evening", [],
   "On his phone, the thread: Alyi's regret post from last November, three hearts under it, his; below it, Alyi's post from three days ago. Both dates in frame.",
   "Dates and hearts, not must-read text (R2).", dur=2.8, onscreen=[O("NOV 20, 2023", 0.3, None, "post"), O("♥ ♥ ♥", 0.6, None, "post"), O("MAY 14, 2024", 1.0, None, "post")],
   music=M15, sounds=[S("thumb_scroll", 0.2, -28, new=True)], fix=("P", "R1", "R2", "FACT"), why="The 176 days, on his phone (facts A25; Ep1).")
nb("act3", "15.03", "MCU · Mas on the desk's edge; far off, Alyi's voice from launch night; then his count",
   "office", "SET-13", "office_evening", ["mas"],
   "For one second, far off, Alyi's voice from launch night. Now Mas counts.",
   "A face light one step.", lines=[line("e2-a3-0008"), line("e2-vo-07", 1.2, WEIGHTED)], head=0.4, tail=0.7,
   music=M15, pace="weighted", fix=("P", "VO", "R2"), why="V.O. 7: now he's the one counting (W14).")
nb("act3", "15.04", "ECU · TPOOL: its splash; welcome back, mas; the Orb scans the hourglass",
   "screen", "SET-13", "office_evening", ["orb"],
   "He scrolls past every modern icon to a tiny old one: TPOOL, his first company's app, LAST UPDATED 2012. Its splash still plays: WHERE U AT? It still knows him: welcome back, mas. A 2008 hourglass spins. The Orb scans it and settles: verified: 2008.",
   "TPOOL in EARLY-WEB16 colours inside a 2024 phone. Toast 2 of 3.",
   dur=6.6, fixed=("dur",), onscreen=[O("TPOOL", 0.4, None, "ui"), O("LAST UPDATED 2012", 0.6, None, "ui"), O("WHERE U AT?", 1.4, 2.8, "ui"),
                                      O("welcome back, mas", 3.0, None, "ui"), O("verified: 2008", 5.0, 6.5, "toast")],
   music=M15, sounds=[S("app_splash_2006", 1.4, -24, new=True), S("hourglass_cursor_2008", 3.2, -28, new=True), S("orb_scan_sweep", 4.2, -26),
                      S("ui_toast_pop", 5.0, -28)], fix=("P", "R2"), why="The splash sets up the question (D-44).")
nb("act3", "15.05", "ECU · he types where u at? → POV · the map: every pin LAST SEEN: 2012, except one",
   "screen", "SET-13", "office_evening", [],
   "He types the app's own question: where u at? The map loads. Every pin reads LAST SEEN: 2012, except one: ALYI CHECKED IN · DEC 2022 · \"feel the agi\". Its ripple turns warm and breaks into string lights.",
   "The check-in has a cause, seen in F2.2.", dur=7.4, fixed=("dur",),
   onscreen=[O("where u at?", 0.4, 2.0, "ui"), O("LAST SEEN: 2012", 2.4, None, "ui"), O("ALYI CHECKED IN · DEC 2022 · \"feel the agi\"", 3.0, 6.0, "ui")],
   music=M15, sounds=[S("key_tap_soft_02", 0.5, -30), S("key_tap_soft_04", 1.1, -30), S("pin_ping", 3.0, -24, new=True)],
   transition={"to": "F2.2", "cause": "\"where u at?\"", "sound": "the ping's ripple; the choir", "object": "the pin's ripple → string lights (where the check-in was made)"},
   fix=("P", "R2", "TR"), why="Seam 18 in.")
nb("act3", "15.06", "WIDE · the holiday party, Dec 2022: silhouettes under palette-cycled string lights; Alyi leads the chant",
   "bullpen", "SET-14", "party", ["alyi", "crowd", "mas", "staff"],
   "A holiday party: silhouettes under palette-cycled string lights. ALYI, lit and laughing, a swag of lights across the top of his frame, raises one hand, and the chant builds from his voice to everyone's.",
   "T4 glossy. Warm, never a hymn. The string lights palette-cycle, never strobe (P15).",
   lines=[line("e2-a3-0009"), line("e2-a3-0010", 0.1, FREE)], head=1.8, tail=0.4, fixed=("head",),
   onscreen=[O("RAIL: DEC 2022", 0.2, 1.7, "rail")], music=M15w, style="T4 glossy memory", flashback=F22, mode="FLASHBACK · want",
   fix=("P", "FACT", "R2"), why="F2.2's want: feel it (facts A56).")
nb("act3", "15.07", "2S · across the crowd: Alyi (cropped by the light swag) and Mas, small in the crowd, a glass in his hand",
   "bullpen", "SET-14", "party", ["alyi", "mas"],
   "His raised hand finds Mas in the crowd, the only one not chanting, a glass in his hand. Under the chant, a word between them.",
   "Lip-sync both. Alyi warm (P5: warm reads warm).",
   lines=[line("e2-a3-0011"), line("e2-a3-0012", 0.45, QMAS), line("e2-a3-0013", 0.25, QUICK)], head=0.8, tail=0.4,
   music=M15w, style="T4 glossy memory", flashback=F22, mode="FLASHBACK · want", fix=("P", "R2", "PACE"),
   why="A joke between them (W14).")
nb("act3", "15.08", "ECU · Alyi holds up his phone, Mas's dead app open: CHECK IN → feel the agi; he turns the screen to Mas",
   "bullpen", "SET-14", "party", ["alyi", "mas"],
   "He holds up his phone, Mas's old app open on it, checks in, types feel the agi, and turns the screen to Mas, grinning. Mas raises his glass.",
   "", dur=4.8, onscreen=[O("CHECK IN", 0.4, 1.6, "ui"), O("feel the agi", 1.6, None, "ui")], music=M15w,
   sounds=[S("check_in_blip", 1.4, -26, new=True)], style="T4 glossy memory", flashback=F22, mode="FLASHBACK · want",
   fix=("P", "R2"), why="Why the pin says Dec 2022.")
nb("act3", "15.09", "WIDE · the racks in the corner hum along; at the chant's peak their status lights become token streams across the whole room",
   "bullpen", "SET-14", "party", ["alyi", "mas", "staff"],
   "The racks in the corner hum along. At the chant's peak their status lights become token streams that run across the whole room, him included.",
   "GLYPH 12 frames on the room, never in his eyes (GR §6).", dur=2.6, music=M15w,
   sounds=[S("glyph_shimmer", 0.6, -28)], style="T4 + GLYPH (12 frames, on the room)", flashback=F22, mode="FLASHBACK · want",
   fix=("P", "GR"), why="")
nb("act3", "15.10", "2S · this office, 2023, night: Alyi at his screen (cropped by its edge), Ekiel beside him; the post's hard sentence",
   "office", "SET-13", "office_2023", ["alyi", "ekiel"],
   "This same office, at night, his chair still here. On his screen, cropping him at the edge of frame, the post he and Ekiel are about to publish, in its own UI, its hard sentence (a later one in the post; it opens on \"We need scientific and technical breakthroughs…\"). EKIEL beside him, squinting at it.",
   "The post's words are the record's; its numbers don't print (R2).", dur=8.9, fixed=("dur",),
   onscreen=[O("RAIL: 2023", 0.2, 1.4, "rail"), O("INTRODUCING SUPERALIGNMENT · ALYI, EKIEL", 1.4, None, "post"),
             O("Currently, we don't have a solution for steering or controlling a potentially superintelligent AI, and preventing it from going rogue.", 1.6, 8.8, "post")],
   music=M15o, style="T4 glossy memory", flashback=F22, mode="FLASHBACK · obstacle", fix=("P", "FACT", "R2"),
   why="F2.2's obstacle: nobody has a way yet (facts A63).")
nb("act3", "15.11", "2S · the same: Ekiel; Alyi, without looking away from the screen",
   "office", "SET-13", "office_2023", ["ekiel", "alyi"],
   "EKIEL says it plainly. ALYI answers without looking away from the screen.",
   "Lip-sync both; Ekiel's card already paid in sc 14.",
   lines=[line("e2-a3-0014"), line("e2-a3-0015", 0.9, WEIGHTED)], head=0.4, tail=0.8, music=M15o, style="T4 glossy memory",
   flashback=F22, mode="FLASHBACK · obstacle", fix=("P", "R2"), why="\"Someone should.\": his own Ep1 line, a want.")
nb("act3", "15.12", "ECU · his finger above the bare Publish button",
   "office", "SET-13", "office_2023", ["alyi"],
   "His finger above the bare Publish button, as Mas's was in sc 4.", "No hover, no cursor.",
   dur=2.4, music=M15t, style="T4 glossy memory", flashback=F22, mode="FLASHBACK · turn", fix=("P", "FC"), why="F2.2's turn: crosscut.")
nb("act3", "15.13", "WIDE · a leadership offsite at night: a wooden effigy stencilled UNALIGNED; Alyi, half cut off by a lodge doorway, with the flame",
   "void", "SET-15", "fire_night", ["alyi", "staff"],
   "A leadership offsite at night: a wooden effigy, a paperclip robot, stencilled UNALIGNED. Staff in silhouette. ALYI, half cut off by a lodge doorway, carries the flame to it himself, his face lit and calm.",
   "No zealot framing; no religious iconography. The month isn't asserted.", dur=3.6, onscreen=[O("UNALIGNED", 0.3, None, "sign")], music=M15t,
   sounds=[S("torch_light", 0.8, -24, new=True)], style="T4 glossy memory", flashback=F22, mode="FLASHBACK · turn", fix=("P", "FACT", "R2", "GR"),
   why="His own hand on the flame (facts A56).")
nb("act3", "15.14", "ECU · he presses Publish",
   "office", "SET-13", "office_2023", ["alyi"],
   "He presses it.", "", dur=1.4, music=M15t, sounds=[S("post_click", 0.3, -20)], style="T4 glossy memory", flashback=F22,
   mode="FLASHBACK · turn", fix=("P", "FC"), why="The post went out under both their names.")
nb("act3", "15.15", "WIDE · the effigy catches",
   "void", "SET-15", "fire_night", ["alyi"],
   "The effigy catches.", "Palette-cycled fire, never strobing (P15).",
   dur=3.6, music=M15t, sounds=[S("flame_whoomph", 0.2, -18), S("fire_crackle", 0.6, -24, new=True, dur=3.0)], style="T4 glossy memory",
   flashback=F22, mode="FLASHBACK · turn", fix=("P", "GR"), why="The crosscut sets the post and the fire side by side without claiming which came first.")
nb("act3", "15.16", "WIDE → ECU · the fire's glow shrinks to one point of light",
   "void", "SET-15", "fire_night", [],
   "The fire's glow shrinks to one point of light.", "", dur=3.4, music=M15t, style="T4 glossy memory", flashback=F22,
   mode="FLASHBACK · out",
   transition={"to": "15.17", "cause": "back from the memory", "sound": "the felt returns", "object": "the fire's glow → the pin, pulsing on his phone"},
   fix=("P", "TR"), why="Seam 18 out.")
nb("act3", "15.17", "ECU · the point is the pin, pulsing on his phone; his thumb covers it",
   "screen", "SET-13", "office_evening", ["mas"],
   "The point of light is the pin, pulsing on his phone. His thumb covers it.",
   "No IOU in the shot, no hand near it (R2).", lines=[line("e2-vo-08")], head=1.4, tail=1.0, music=M15x, pace="weighted",
   fix=("P", "VO", "R2", "GR"), why="V.O. 8: his plan; no compute, no reason, no read of Alyi.")
nb("act3", "15.18", "WIDE · he pockets the phone, gets up off the desk's edge and leaves; the door swings shut on the empty room",
   "office", "SET-13", "office_evening", ["mas"],
   "He pockets the phone, gets up off the desk's edge and leaves. The door swings shut on the empty room; it holds a second.",
   "", dur=3.4, music=M15x, sounds=[S("door_close_soft", 2.2, -24, new=True)], fix=("P", "FC"), why="The scene ends on him leaving (FC).")
nb("act3", "15.19", "WIDE · the stairwell, Mas small on the stairs → ECU · the push: a reporter's request for comment",
   "office", "SET-13", "stairwell", ["mas"],
   "On the stairs, his phone buzzes in his pocket: a reporter's request for comment, its thumbnail a strip of receipt paper. He reads it without stopping, and keeps going down.",
   "No outlet named, no headline words.", dur=5.0, fixed=("dur",), onscreen=[O("request for comment", 1.6, 3.6, "ui")],
   music=M15x, sounds=[S("footstep_soft_1", 0.2, -28), S("phone_buzz_step_1", 1.2, -22), S("footstep_soft_2", 3.8, -28)],
   jcut=[{"sound": "the receipt's thermal chatter at NopeAI's doors", "lead_s": 1.0}],
   transition={"to": "17", "cause": "the exit papers are public: the press is asking", "sound": "his phone's buzz; then the receipt's chatter at NopeAI's doors (J 1.0 s)",
               "object": "the push's receipt-strip thumbnail → the receipt pouring out of NopeAI's front doors"},
   aftermath="the empty room 1 s after the door shuts; then the stairs and the buzz", fix=("P", "FC", "TR", "FACT"),
   why="Seam 19: the papers never start near Alyi (FC; facts A31).")

# ------------------------------------------------------------------------------------- sc 17 · 2:11 (the S3)
M17 = ("E02-10 THE BRIDGE · SET-PIECE SWING, the full band in 4-bar phrases (the episode's one full-band stretch, at its "
       "peak only); brass hits at phrase ends; ducks under every line")
M17s = "E02-10 · the scramble: the band drops to the bass and the Build's chip lead, busier on the same grid; ducks under his call line"
M17n = "E02-10 · one held chord through the night (2 s)"
M17p = "E02-10 · thins to the bass pedal under the posts; the honks on the phrase ends"
M17r = "E02-10 · a pad in the rain"
CH17 = ["mas", "forecaster", "driver"]
nb("act3", "17.01", "WIDE · NopeAI's front doors at the top of the hill: the receipt pouring out; the Forecaster arrives from the street beside it",
   "skyline", "SET-16", "bridge", ["forecaster"],
   "The exit agreement is already pouring out of NopeAI's front doors like a pharmacy receipt. THE FORECASTER walks up from the street with a clipboard of dates, the first person to stop beside it, and looks down at it.",
   "The papers start at NopeAI's doors, never near Alyi (FC). He comes from the street, not out of the building: he had already left (his refusal was in April; facts A32).", dur=4.4, fixed=("dur",),
   onscreen=[O("RAIL: MAY 17, 2024", 0.3, 2.1, "rail")], music=M17, sounds=[S("receipt_printer", 0.0, -22, new=True, dur=4.4)],
   arrive={"s": 4.0, "what": "NopeAI's front doors, the receipt already pouring out, the Forecaster arriving from the street beside it, the band in"},
   fix=("P", "FC", "FACT", "SR"), why="The papers go public (facts A31).")
nb("act3", "17.02", "WIDE · one quick run: down the hill and across all five lanes of the bridge in the evening rush (three parallax planes)",
   "skyline", "SET-16", "bridge", ["staff"],
   "In one quick run down the hill the receipt crosses all five lanes of the Bay Bridge in the evening rush. Commuters read it as they drive; traffic slows on it, then stops. Its lines scroll under the tyres.",
   "Egg at the very bottom: the coupon.", dur=6.6, fixed=("dur",),
   onscreen=[O("NON-DISPARAGEMENT", 1.2, 2.6, "doc"), O("IN PERPETUITY", 2.6, 4.0, "doc"), O("CLAUSE 9: THIS RECEIPT DOES NOT EXIST.", 3.3, 5.6, "doc"),
             O("SAVE 0% ON YOUR NEXT EXIT", 4.9, 6.5, "doc")],
   music=M17, sounds=[S("receipt_unroll_loop", 0.0, -24, new=True, dur=6.6), S("car_honk_1", 5.8, -26, new=True)], fix=("P", "R2", "KEEP"),
   why="The receipt across the bridge (−4 s in R2, for F2.1's obstacle).")
nb("act3", "17.03", "WIDE · across the lanes: the Forecaster walks up the far pedestrian lane with his clipboard; Mas small in the foreground; the card",
   "skyline", "SET-16", "bridge", ["forecaster", "mas"],
   "THE FORECASTER walks up the far pedestrian lane with his clipboard. The card freezes on him.",
   "The stakes land before the pen does.", dur=3.8, fixed=("dur",),
   onscreen=[O("THE FORECASTER / EX-NOPEAI.", 1.0, 3.6, "card"), O("AT STAKE: ~$2M", 1.4, 3.6, "stat")],
   music=M17, sounds=[S("freeze_hit_F", 1.0, -18)], style="2-TONE FREEZE (the card) · LEDGER 6 frames on the stat", fix=("P", "FACT"),
   why="What a signature would save him (facts A32).")
nb("act3", "17.04", "LOW · a pen on a bank chain rises out of the receipt and offers itself to him (the refusal, held wide across the lanes)",
   "skyline", "SET-16", "bridge", ["forecaster", "mas"],
   "A pen on a bank chain rises out of the receipt and offers itself to him. He looks at it and doesn't take it. He tells the pen where he is.",
   "Mas is outside the refusal (R1), small in the foreground. The pen comes from the receipt, never from Mas's hand.",
   lines=[line("e2-a3-0016", pace=WEIGHTED)], head=2.6, tail=0.4, fixed=("head",), music=M17, pace="weighted",
   sounds=[S("pen_chain_rattle", 0.4, -24, new=True)], fix=("P", "KEEP", "R1", "GR"), why="His principle, at a price.")
nb("act3", "17.05", "MEDIUM · a DRIVER parked on the receipt leans out of his window",
   "skyline", "SET-16", "bridge", ["driver"],
   "A DRIVER, parked on the receipt, leans out.",
   "", lines=[line("e2-a3-0017", pace=QUICK)], head=0.6, tail=0.2, music=M17, sounds=[S("car_window_down", 0.1, -26, new=True)],
   fix=("P", "R2", "PACE"), why="The driver's line has a reason (the receipt has stopped traffic).")
nb("act3", "17.06", "WIDE · across the lanes: the Forecaster lets the pen go; the chain draws it back into the paper",
   "skyline", "SET-16", "bridge", ["forecaster", "mas"],
   "THE FORECASTER lets the pen go. The pen withdraws.",
   "Word for word (keep list).", lines=[line("e2-a3-0018", pace=NORMAL)], head=0.5, tail=1.2, music=M17,
   sounds=[S("pen_chain_rattle", "E:e2-a3-0018+0.2", -26, new=True)], fix=("P", "KEEP"), why="\"Already did.\"")
nb("act3", "17.07", "WIDE · mid-span on the receipt: Mas sees it, his phone already lit",
   "skyline", "SET-16", "bridge", ["mas"],
   "Across the lanes, mid-span on the receipt, Mas sees it. His phone is already lit.",
   "", dur=2.4, music=M17, sounds=[S("phone_buzz_step_1", 1.0, -24)], fix=("P",), why="The scramble starts, with a still face (W4).")
nb("act3", "17.08", "ECU · the scramble on his phone: staff screenshots of a clause; a grey LEGAL tile; a second request for comment",
   "screen", "SET-16", "bridge", [],
   "His phone won't stop: staff screenshots of a clause; a grey LEGAL tile, call me; a second request for comment. Quick cuts on his thumbs.",
   "Hands fast; the LEGAL tile a grey icon, never named.", dur=4.8, fixed=("dur",),
   onscreen=[O("NON-DISPARAGEMENT", 0.3, 1.5, "ui"), O("LEGAL · call me", 1.6, 3.2, "ui"), O("request for comment", 3.3, 4.7, "ui")],
   music=M17s, sounds=[S("phone_buzz_step_2", 0.2, -22), S("phone_buzz_step_3", 1.6, -22), S("phone_buzz_step_4", 3.3, -22)],
   mode="QUICK-CUT RUN (the scramble)", fix=("P", "R1", "R2"), why="The scramble (The Social Network's grammar).")
nb("act3", "17.09", "MCU · his face, locked (where we hear his side of the call); ECU his thumb on LEGAL",
   "call", "SET-16", "bridge", ["mas"],
   "He calls LEGAL. We hear only his side, level, and quicker than he ever talks. His face doesn't move.",
   "The one time he hurries.", lines=[line("e2-a3-0019")], head=1.2, tail=0.4, music=M17s,
   sounds=[S("call_ring", 0.1, -26), S("call_connect", 0.8, -26)], mode="QUICK-CUT RUN (the scramble)",
   fix=("P", "R2", "GR"), why="Mas is heard acting: the fix he made public.")
nb("act3", "17.10", "ECU · a draft opened, typed, deleted, typed: grey bars",
   "screen", "SET-16", "bridge", [],
   "A draft opened, typed, deleted, typed, its words grey bars.",
   "No legible word and no voice over it (R2: nothing at contested item 3).", dur=4.6, fixed=("dur",), music=M17s,
   sounds=[S("key_tap_soft_01", 0.4, -28), S("key_delete_run", 1.8, -26, new=True), S("key_tap_soft_03", 3.0, -28)],
   mode="QUICK-CUT RUN (the scramble)", fix=("P", "R2", "GR"), why="")
nb("act3", "17.11", "MCU · his still face; the receipt still unrolling under his shoes",
   "skyline", "SET-16", "bridge", ["mas"],
   "His face doesn't move. The receipt is still unrolling under his shoes. Inside, his voice, faster than he thinks, repeats itself.",
   "W4's grammar: the face still, the inside fast. The V.O. is the fix's items, his rattled tell (MIV §3), nothing about what he knew (W8); it plays on his face, never over the draft.",
   lines=[line("e2-vo-09")], head=0.3, tail=0.4, fixed=("head",), music=M17s,
   sounds=[S("receipt_unroll_loop", 0.0, -28, new=True, dur=3.6)], mode="QUICK-CUT RUN (the scramble)",
   fix=("P", "R1", "VO", "GR", "SR"), why="Frantic hands under a still face; V.O. 9, a cluster with V.O. 10 (W6).")
nb("act3", "17.12", "MCU · the Forecaster, having crossed the stalled lanes, stops beside him",
   "skyline", "SET-16", "bridge", ["forecaster", "mas"],
   "THE FORECASTER has crossed the stalled lanes and stops beside him, clipboard up.",
   "", lines=[line("e2-a3-0020", pace=NORMAL)], head=1.4, tail=0.3, music=M17, fix=("P", "R1"), why="The forecast: his first contact with him.")
nb("act3", "17.13", "ECU · Mas's thumb hovers over Post; he doesn't press",
   "screen", "SET-16", "bridge", ["mas"],
   "Mas's thumb hovers over Post. He doesn't press.",
   "", lines=[line("e2-vo-10")], head=0.8, tail=0.5, music=M17, pace="weighted", fix=("P", "VO", "R2", "GR", "SR"),
   why="V.O. 10: his own condition for the post, a reply to nobody; never what he knew.")
nb("act3", "17.14", "WIDE · the night, one held shot: the bridge's lights cycle once; Mas still on the receipt; the Forecaster asleep against the rail",
   "skyline", "SET-16", "bridge_night", ["mas", "forecaster"],
   "The night, one held shot: the bridge's lights cycle once. Mas still on the receipt. The Forecaster asleep against the rail, clipboard on his chest.",
   "Palette cycle, no strobe.", dur=2.0, fixed=("dur",), music=M17n, fix=("P", "R2"), why="A night passes before he posts (R1).")
nb("act3", "17.15", "WIDE · the next afternoon: Mas posts; the post pops up over the sky, one trim per honk; the Forecaster wakes",
   "skyline", "SET-16", "bridge", ["mas", "forecaster", "driver"],
   "The next afternoon. Mas posts. The post pops up over the sky in its own UI, one trim per honk from the car behind him. The Forecaster wakes, checks his watch and crosses out an hour.",
   "Posts are pop-ups, never speeches. His real lowercase.",
   lines=[line("e2-a3-0021")], head=10.9, tail=0.5, fixed=("head",),
   onscreen=[O("RAIL: MAY 18", 0.2, 1.4, "rail"), O("vested equity is vested equity, full stop.", 1.6, 4.1, "post"), O("this is on me…", 4.1, 5.2, "post"),
             O("…i did not know this was happening and i should have.", 5.2, 8.2, "post"), O("…they can contact me and we'll fix that too.", 8.2, 10.8, "post")],
   music=M17p, sounds=[S("post_click", 1.5, -24), S("car_honk_2", 4.1, -22, new=True), S("car_honk_3", 5.2, -22, new=True),
                       S("car_honk_4", 8.2, -22, new=True), S("car_honk_5", 10.75, -22, new=True), S("pen_scribble_short", "E:e2-a3-0021-0.3", -26)],
   fix=("P", "FACT", "R1", "R2"), why="The apology, the next afternoon (facts A31: four trims, four honks).")
nb("act3", "17.16", "MEDIUM · the honking driver leans out; then the car behind him honks; the Forecaster walks off",
   "skyline", "SET-16", "bridge", ["driver", "forecaster", "mas"],
   "The DRIVER who has been honking leans out to Mas. He finds a line on the receipt, reads it, and very carefully takes his hand off the horn. The car behind him honks. The Forecaster tucks his clipboard under his arm and walks off the bridge.",
   "Mas answers nobody: at a real event his surface stays blank.",
   lines=[line("e2-a3-0022", pace=QUICK)], head=0.3, tail=2.8, fixed=("tail",), music=M17p,
   sounds=[S("car_honk_1", "E:e2-a3-0022+1.6", -20, new=True)], fix=("P", "KEEP"), why="The honk behind the honk is the button.")
nb("act3", "17.17", "WIDE · May 20, a new day on the bridge, traffic moving; Mas under an umbrella; the blimp drifts in; the storm cloud with a blank letterhead parks over it",
   "skyline", "SET-16", "bridge_rain", ["mas"],
   "A new day on the bridge: traffic moving again, the receipt trodden flat into the lane lines, Mas under an umbrella on the pedestrian lane. The her blimp drifts in over the bay. A storm cloud with a blank letterhead rolls out of the city and parks directly over it.",
   "Thunder at most 3 flashes per 24 frames, every pop at or under 80% white (P15). One 4-bar phrase.", dur=10.0, fixed=("dur",),
   onscreen=[O("RAIL: MAY 20", 0.2, 1.6, "rail")], music=M17r, sounds=[S("thunder_tuned_F", 7.4, -18, new=True)], fix=("P", "R2", "FACT"),
   why="May 20 is a new day (facts A33).")
nb("act3", "17.18", "WIDE · it rains letterhead; the receipt's ink runs in the rain",
   "skyline", "SET-16", "bridge_rain", ["mas"],
   "It rains letterhead. The receipt's ink runs down the lanes in the rain. Far off, on dry land, the Forecaster opens an umbrella printed with a probability curve.",
   "The letterhead is blank: the actress is never drawn, voiced or named.", dur=3.6, music=M17r,
   sounds=[S("ink_run_drip", 0.4, -26, new=True), S("umbrella_rain", 0.0, -24, new=True, dur=3.6), S("umbrella_pop", 2.6, -32, new=True)],
   fix=("P", "R1", "GR"), why="Pathos in the rain.")
nb("act3", "17.19", "POV · his rain-beaded phone: the voice menu, five live waveforms; his thumb taps Pause on VOICE 5",
   "screen", "SET-16", "bridge_rain", ["mas"],
   "On his rain-beaded phone, the voice menu: five live waveforms. His thumb finds VOICE 5 and taps Pause. The slot greys; its Hey. greys under it.",
   "No bonk, no notification here.", dur=4.4, fixed=("dur",),
   onscreen=[O("VOICE 5", 0.4, None, "ui"), O("Pause", 1.4, 2.2, "ui"), O("VOICE 5 [PAUSED]", 2.2, None, "ui"), O("Hey.", 2.2, None, "ui")],
   music=M17r, sounds=[S("ui_pause_tap", 2.0, -22, new=True)], fix=("P", "R1", "FACT"), why="He pauses the voice himself (facts A33).")
nb("act3", "17.20", "ECU · beside it, his company's post pops up in its own UI, two fragments",
   "screen", "SET-16", "bridge_rain", [],
   "Beside it, his company's post pops up in its own UI: questions heard; a pause.",
   "Two fragments, cropped before the voice's name; no name appears. The post claims nothing about how the voice was made (facts §F) and answers no one.",
   dur=5.4, fixed=("dur",),
   onscreen=[O("We've heard questions about how we chose the voices…", 0.3, 5.3, "post"), O("…We are working to pause the use of…", 2.0, 5.3, "post")],
   music=M17r, sounds=[S("ui_toast_pop", 0.3, -26)], fix=("P", "FACT", "R2", "GR", "SR"), why="His company pauses the voice, in its own words (facts A64: the May 20, 2024 post).")
nb("act3", "17.21", "WIDE · the blimp sags, its running lights clicking off one by one; the last light; black",
   "skyline", "SET-16", "bridge_rain", [],
   "The blimp sags three pixels, its running lights clicking off one by one. The last one clicks off. Black: act-out 2.",
   "", dur=4.6, fixed=("dur",), music="E02-10 out · the DREAD sting (MM-14) on the blimp's last light",
   sounds=[S("blimp_lights_off", 0.6, -26, new=True), S("blimp_lights_off", 1.3, -26, new=True), S("blimp_lights_off", 2.0, -26, new=True),
           S("blimp_lights_off", 2.8, -24, new=True), S("dread_sting", 2.8, -16, new=True)],
   jcut=[{"sound": "the lighthouse beacon's motor and the quartet's first pizzicato under the black", "lead_s": 1.2}],
   transition={"to": "18", "cause": "act-out 2", "sound": "the beacon's motor and pizzicato under the black (J 1.2 s)",
               "object": "the blimp's last light → the beacon's lamp; sc 14's box in Ekiel's arms"},
   aftermath="the grey slot under his wet thumb; the ink running", fix=("P", "TR"), why="Act-out 2. Seam 20.")

# ------------------------------------------------------------------------------------- ACT FOUR · sc 18 · 1:36
M18 = ("E02-11 LEVERAGE, QUARTET · a string quartet (pizzicato over a muted 808 locked to the rack LEDs), one performance "
       "through sc 18–20")
M18p = "E02-11 · under Neleh's voice and the card the quartet thins to its pedal"
M18L = "E02-11 · LEFT: the quartet; the 808 drops out on \"present.\" and the quartet carries on alone"
M18R = "E02-11 · RIGHT: Mario's Addendum (B♭ minor; it gains a bar each time) and the Lighthouse cell (marimba and harp)"
nb("act4", "18.01", "WIDE · full frame: the lighthouse of stacked essays, the beacon turning; Ekiel climbs the stair of bound drafts with his box",
   "lighthouse", "SET-17", "lighthouse", ["ekiel", "adelina"],
   "Full frame: the lighthouse of stacked essays, the beacon already turning. EKIEL climbs the stair of bound drafts, carrying the box he walked out with. At the top ADELINA raises a lanyard.",
   "Sc 14's box in his arms (the seam).", dur=5.8, onscreen=[O("RAIL: MAY 28, 2024", 0.3, 2.1, "rail")], music=M18,
   sounds=[S("beacon_motor", 0.0, -28, new=True, dur=5.8), S("footstep_soft_1", 2.4, -28), S("footstep_soft_2", 3.2, -28)],
   arrive={"s": 2.0, "what": "full frame on the lighthouse with the beacon already turning"}, fix=("P", "FACT"),
   why="The safety lead takes a lanyard at Misanthropic (facts A35; A36's date).")
nb("act4", "18.02", "WIDE · the beacon's beam sweeps across the frame… and across the NopeAI boardroom's window",
   "boardroom", "SET-02", "boardroom_day", [],
   "The beacon's beam sweeps across the frame, and across the NopeAI boardroom's window, the same morning.",
   "", dur=2.0, fixed=("dur",), music=M18,
   transition={"to": "18.03", "cause": "the same morning", "sound": "the quartet carries", "object": "the beacon's beam → the boardroom TV's glow"},
   fix=("P", "TR"), why="Seam 21.")
nb("act4", "18.03", "FULL FRAME · the boardroom TV, still on before the meeting: a plain podcast player, her words captioned",
   "screen", "SET-02", "boardroom_day", ["neleh"],
   "Full frame on the boardroom TV, still on before the meeting: a plain podcast player, no title, no logo. A former board member's voice, her words captioned large as she says them.",
   "Captions legible at 1080p. Her words only (W8).", lines=[line("e2-a4-0001", pace=WEIGHTED)], head=1.0, tail=0.6, fixed=("head",),
   onscreen=[O("When CHATGTP came out November, 2022, the board was not informed in advance about that.", "L:e2-a4-0001+0.0", "E:e2-a4-0001-1.95", "caption"),
             O("We learned about CHATGTP on RETTIWT.", "E:e2-a4-0001-1.95", "E:e2-a4-0001+0.6", "caption")],
   music=M18p, pace="weighted", arrive={"s": 1.0, "what": "the boardroom with the TV already playing"},
   fix=("P", "FACT", "R1", "GR"), why="The answer Ep1 withheld, in her own voice (facts A38).")
nb("act4", "18.04", "FULL FRAME · the TV: her second claim",
   "screen", "SET-02", "boardroom_day", ["neleh"],
   "Her second claim.", "", lines=[line("e2-a4-0002", pace=WEIGHTED)], head=0.6, tail=0.6,
   onscreen=[O("…MAS didn't inform the board that he owned the NOPEAI Startup Fund…", "L:e2-a4-0002+0.0", "E:e2-a4-0002+0.6", "caption")],
   music=M18p, pace="weighted", fix=("P", "FACT", "GR"), why="Two attributed claims, no more.")
nb("act4", "18.05", "FULL FRAME · under it, the board's same-day reply in its own statement card",
   "screen", "SET-02", "boardroom_day", [],
   "Under it, the board's same-day reply, one sentence in its own statement card.",
   "Her account and the reply side by side (W16). The quote keeps its honorific (naming rule 12: only the name changes).", dur=4.2, fixed=("dur",),
   onscreen=[O("\"We are disappointed that Ms. NELEH continues to revisit these issues.\"", 0.2, 4.1, "doc"), O("— TERB, CHAIR", 0.2, 4.1, "doc")],
   music=M18p, fix=("P", "FACT", "R2", "GR", "SR"), why="The board disputes her account the same day (facts A65).")
nb("act4", "18.06", "MCU · Mas at the table holds still → Mada doesn't move → Terb clicks the TV off",
   "boardroom", "SET-02", "boardroom_day", ["mas", "mada", "terb"],
   "Mas, at the table, holds still. Mada doesn't move. TERB clicks the TV off.",
   "No V.O. (W8). A face light one step.", lines=[line("e2-a4-0003")], head=2.4, tail=0.4, fixed=("head",), music=M18p,
   sounds=[S("tv_click_off", "L:e2-a4-0003-0.1", -22, new=True)], fix=("P", "GR"), why="A held breath.")
nb("act4", "18.07", "MEDIUM · Terb holds out a SAFETY COMMITTEE lanyard; the frame splits: RIGHT Adelina drops hers over Ekiel; LEFT Mas takes his from Terb's hand",
   "boardroom", "SET-18", "split_lighthouse", ["terb", "mas", "adelina", "ekiel"],
   "TERB holds out a SAFETY COMMITTEE lanyard, and the frame splits. RIGHT: Adelina drops hers over Ekiel; it's printed on page 212 of a Mario draft. LEFT, on the same beat, Mas takes his from Terb's hand and puts it on himself.",
   "The split (two 238 × 203 panes, a 4 px divider). The rhyme on one action.", dur=3.6,
   onscreen=[O("SAFETY COMMITTEE", 0.3, None, "sign"), O("212", 1.8, None, "doc")], music=M18,
   sounds=[S("lanyard_drop", 1.8, -24, new=True), S("lanyard_drop", 1.85, -26, new=True)], fix=("P", "R1"),
   why="Mas takes the lanyard himself (A2).")
nb("act4", "18.08", "LEFT pane (the right pane steps down a rung): Terb on the committee's first task, then the question round the table",
   "boardroom", "SET-18", "split_lighthouse", ["terb", "mas", "mada"],
   "LEFT: TERB says what the committee will do and how long it has. Then, without looking up, he reads its members like a roll call.",
   "", lines=[line("e2-a4-0004"), line("e2-a4-0005", 0.25, QUICK)], head=0.3, tail=0.3, music=M18L, fix=("P", "R2", "FACT", "SR", "LQ"),
   why="Ninety days and the membership, in his own words (facts A36); nobody says who checks whom (W7).")
nb("act4", "18.09", "MEDIUM · inside the left pane, at table level: every face turns to Mas",
   "boardroom", "SET-18", "split_lighthouse", ["mas", "mada"],
   "On \"our chief executive.\", every face at the table turns to Mas. The 808 drops out. Mada writes one word in the minutes.",
   "HOLD 2 BEATS (the table's).", lines=[line("e2-a4-0006")], head=1.25, tail=1.0, fixed=("head",), music=M18L,
   sounds=[S("pen_scribble_short", "E:e2-a4-0006+0.05", -26)], fix=("P", "KEEP", "PACE", "LQ"), why="\"present.\" Mada's one word goes down as Terb, brisk, is already on the next line (lock QA).")
nb("act4", "18.10", "LEFT pane: Terb's next line; the table turns to Mas again; Mada writes a second word; a held breath; his thought",
   "boardroom", "SET-18", "split_lighthouse", ["terb", "mas", "mada"],
   "TERB, brisk, the next line. The table turns to Mas again. Mada writes a second word. A held breath on the table (about 1.5 s). Then his thought, in his pane.",
   "\"also present.\" and Mada's second word land first; the V.O. types in his cyan, in his pane, with new information (the same post's news), never a reading of the committee.",
   lines=[line("e2-a4-0007", pace=QUICK), line("e2-a4-0008", 0.6, FREE), line("e2-vo-11", 2.3, WEIGHTED)], head=0.3, tail=0.8, music=M18L,
   sounds=[S("pen_scribble_short", "E:e2-a4-0008+0.3", -26)], fix=("P", "VO", "KEEP", "R2", "SR"),
   why="V.O. 11: the next model is already training (facts A36: the May 28 post); his priority, not a view of the committee.")
nb("act4", "18.11", "RIGHT pane (the left pane steps down and holds): Mario at his desk by the lamp, writing; Ekiel in his new lanyard",
   "lighthouse", "SET-18", "split_lighthouse", ["mario", "ekiel"],
   "RIGHT: MARIO writes without looking up. EKIEL stands in front of him in his new lanyard.",
   "The lighthouse always plays beside Mas's pane.",
   lines=[line("e2-a4-0009"), line("e2-a4-0010", 0.25, QUICK), line("e2-a4-0011", 0.2, QUICK)], head=0.5, tail=0.3, music=M18R,
   fix=("P", "R2", "PACE"), why="Mario schemes: build the careful one out of the careful people who leave.")
nb("act4", "18.12", "ECU insert · Mario's page: one line highlighted in yellow, readable at 1080p",
   "lighthouse", "SET-17", "lighthouse", ["mario"],
   "Four pages, one line highlighted in yellow: Ekiel's own. Mario on the underline.",
   "An insert, not only in the pane (P7).", lines=[line("e2-a4-0012")], head=4.4, tail=0.4, fixed=("head",),
   onscreen=[O("Building smarter-than-human machines is an inherently dangerous endeavor.", 0.2, "L:e2-a4-0012-0.1", "doc")],
   music=M18R, fix=("P", "FACT", "FC", "GR"), why="A line about the work, never NopeAI's priorities (facts A27; D-66).")
nb("act4", "18.13", "RIGHT pane: the beacon glints across the CLOD boxes; the brief document drops the whole stairwell",
   "lighthouse", "SET-18", "split_lighthouse", ["mario", "ekiel"],
   "The beacon glints across a case of CLOD boxes, each one in turn; the last one's art is the Golden Gate Bridge. MARIO, finger rising. A scroll drops down the stairwell; the pane pans with it down the spiral and back up to EKIEL, squinting after it. MARIO sets his pen down for the first time.",
   "The name GOLDEN GATE CLOD is never printed or spoken (O2.2: an egg).",
   lines=[line("e2-a4-0013"), line("e2-a4-0014", 2.6, FREE), line("e2-a4-0015", 0.2, QUICK)], head=1.6, tail=0.4, music=M18R,
   sounds=[S("glint_tick", 0.3, -28, new=True), S("glint_tick", 0.8, -28, new=True), S("glint_tick", 1.3, -27, new=True),
           S("scroll_unroll_fall", "E:e2-a4-0013+0.2", -22, new=True)], fix=("P", "KEEP"), why="The brief document.")
nb("act4", "18.14", "MCU inside the right pane (the left pane holds beside it, stepped down, Mas in it): Mario, finger up",
   "lighthouse", "SET-18", "split_lighthouse", ["mario"],
   "MARIO, finger up: his concern.",
   "Egg on his desk, by the lamp: an op-ed clipping, byline NELEH & THE QUIET VOTE (facts A37; a byline egg only, no hold, never read out).",
   lines=[line("e2-a4-0016", pace=NORMAL)], head=0.5, tail=1.0, music=M18R,
   onscreen=[O("NELEH & THE QUIET VOTE", 0.2, None, "sign")],
   fix=("P", "KEEP"), why="\"It's that we might win.\": a dry chill.")
nb("act4", "18.15", "LEFT pane: Mas's phone, face up on the table, lights with a reminder; he turns it over",
   "boardroom", "SET-18", "split_lighthouse", ["mas"],
   "In his pane, Mas's phone, face up on the table, lights with a reminder: ELPPA · KEYNOTE · JUN 10. He turns it over.",
   "", dur=3.4, onscreen=[O("ELPPA · KEYNOTE · JUN 10", 0.4, 2.4, "ui")], music=M18,
   sounds=[S("ui_toast_pop", 0.4, -26), S("phone_turn_over", 2.4, -26, new=True)],
   jcut=[{"sound": "the keynote's walk-on music under the quartet", "lead_s": 0.8}],
   transition={"to": "19", "cause": "the deal he closed in May comes due: his calendar says Jun 10", "sound": "the quartet carries; the keynote's walk-on bed (J 0.8 s)",
               "object": "the reminder card on his phone → the lobby's wall screen, same place in frame"},
   aftermath="the reminder on his phone; he turns it over", fix=("P", "TR", "R1"), why="Seam 22.")

# ------------------------------------------------------------------------------------- sc 19 · 2:18 (F2.1 and the garden inside)
M19 = "E02-11 · the quartet alone under the keynote's own walk-on bed on the wall screen (an original media bed, diegetic and low)"
M19post = "E02-11 · the quartet thins to its pedal under his post"
M19f = ("E02-11 · F2.1: the ERA tier for 2005–14 (the band through the 16-bit sample-chip, swung, brighter A♭ colours; no "
        "cassette piano, no boom-bap) over the quartet's held pedal; each grey pin a step dimmer on the sample-chip's falling figure")
M19g = "E02-11 · the garden: the same quartet as a garden-party arrangement (never a wedding march), thinning to one violin under the V.O.; the cello's pedal on the gate"
nb("act4", "19.01", "WIDE · the lobby master at a watch party: ELPPA's keynote on the wall screen; the signs; the flyers still up",
   "lobby", "SET-01", "lobby_watchparty", ["gerg", "staff"],
   "Enter with ELPPA's keynote already running on the wall screen, low, on an immaculate stage of the show's own design. The staff sit cross-legged, tiled, half-listening. GERG types on a beanbag. Over reception the signs read 202 and 102. The flyers are still up, curling, Mas's upside-down one among them. The complaint is still a side table. Behind the back row of beanbags, the tip of a mammoth's tusk.",
   "Eggs at 0 s: the tusk. ELPPA's stage is generic (no real building, logo or trade dress).", dur=4.6, fixed=("dur",),
   onscreen=[O("RAIL: JUN 10, 2024", 0.2, 1.8, "rail"), O("DAYS SINCE SOMEONE TRIED TO FIRE MAS: 202", 1.9, None, "sign"),
             O("DAYS SINCE SOMEONE SUED MAS: 102", 1.9, None, "sign")],
   music=M19, arrive={"s": 2.0, "what": "the running keynote with the lobby half-listening"}, fix=("P", "FACT", "R2"),
   why="The deal Mas closed in May is announced (facts A40; the counts checked).")
nb("act4", "19.02", "SCR · the corner TV, muted, held: the roadmap lectern still stuck at FLOOR, a tally on it now",
   "screen", "SET-01", "lobby_watchparty", [],
   "On the corner TV, muted, the roadmap lectern is still stuck at FLOOR, a tally on it now: 0 BILLS.",
   "Legible, 1.5 s (FC).", dur=1.6, fixed=("dur",), onscreen=[O("FLOOR", 0.1, None, "sign"), O("0 BILLS", 0.1, 1.6, "sign")],
   music=M19, fix=("P", "FC", "FACT", "GR"), why="The counterweight's callback (facts A66; if a bill had passed, FLOOR VOTES: 0).")
nb("act4", "19.03", "WIDE · the doors: the new CFO comes in along the hand truck's old path, a calculator tape unspooling behind her",
   "lobby", "SET-01", "lobby_watchparty", ["haras", "gerg"],
   "The doors open. HARAS walks in along the path the hand truck took in February, a calculator tape unspooling behind her. She drops onto the beanbag beside Gerg.",
   "", dur=3.2, onscreen=[O("HARAS · FIRST CFO", 0.6, 2.8, "plate")], music=M19,
   sounds=[S("calc_tape_spool", 0.3, -26, new=True, dur=2.6)], fix=("P", "FACT"), why="(facts A42)")
nb("act4", "19.04", "2S · Haras and Gerg on the beanbags, the wall screen low behind them (no cut-ins)",
   "lobby", "SET-01", "lobby_watchparty", ["haras", "gerg"],
   "HARAS starts with the easy ones. GERG, typing, answers. Then the real one, and the stream talks over it: as she asks, the wall screen behind them puts up the announcement and the stream's own crowd roars, and the lobby's cheer takes her last word.",
   "The cheer cuts \"And profit—\" (the episode's second and last cut-off): its cause, the stream's …AND LATER THIS YEAR: CHATGTP. on the wall screen behind them, comes up and roars 0.2 s before her line; the lobby's cheer lands on \"profit\" (lock QA). Record it complete; the take plays whole under the cheer, and the subtitle reads \"And profit—\".",
   lines=[line("e2-a4-0017"), line("e2-a4-0018", 0.2, QUICK), line("e2-a4-0019", 0.25, QUICK), line("e2-a4-0020", 0.2, QUICK),
          line("e2-a4-0021", 0.25, QUICK, sub=[["And profit—", 0]])], head=0.4, tail=0.1,
   onscreen=[O("…AND LATER THIS YEAR: CHATGTP.", "L:e2-a4-0021-0.2", None, "ui")], music=M19,
   sounds=[S("stream_announce_roar", "L:e2-a4-0021-0.2", -24, new=True,
             note="the keynote stream's own crowd roars at the announcement, low on the wall screen: the cheer's cause, under her question"),
           S("crowd_cheer", "L:e2-a4-0021+0.15", -18, new=True,
             note="the lobby erupts on \"profit\" and talks over it (the cut-off); it runs on across the cut into 19.05")],
   fix=("P", "KEEP", "PACE", "LQ"),
   why="The race is fought over compute, for training and for running (the concept's callback). The world talks over the one key word.")
nb("act4", "19.05", "SCR · ON STREAM … → WIDE · the lobby erupts; a desk confetti cannon; Haras writing under the cheer",
   "lobby", "SET-01", "lobby_watchparty", ["haras", "staff", "gerg"],
   "On the stream, full frame, the announcement that the lobby is already cheering. The lobby erupts; somebody's desk confetti cannon goes off. Nobody answers her. HARAS, writing on her tape under the cheer.",
   "The cheer started under her question in 19.04 and carries across the cut.", lines=[line("e2-a4-0022")], head=2.4, tail=0.5, fixed=("head",),
   onscreen=[O("…AND LATER THIS YEAR: CHATGTP.", 0.0, 2.2, "ui")], music=M19,
   sounds=[S("confetti_pop", 0.9, -22, new=True)], fix=("P", "FACT", "KEEP", "LQ"),
   why="Upside (facts A40).")
nb("act4", "19.06", "SCR · the wall screen: the stream cuts to its outdoor audience; at the edge, small, Mas typing → WIDE · the lobby",
   "lobby", "SET-01", "lobby_watchparty", ["staffer", "gerg", "staff"],
   "The stream cuts away to its outdoor audience. At the edge of it, small, Mas, head down over his phone, typing. A STAFFER points. The lobby laughs. GERG, the only one not cheering, takes out his phone.",
   "Our staging: the stream's crowd shot, in our stream's UI.",
   lines=[line("e2-a4-0023")], head=1.8, tail=2.4, music=M19, sounds=[S("lobby_laugh_s", "E:e2-a4-0023+0.3", -22, new=True)],
   lcut=[{"sound": "the stream's audio carries across", "over_s": 0.8}],
   transition={"to": "19.07", "cause": "the stream catches him in its crowd, typing", "sound": "the stream's audio carries across (L)",
               "object": "the wall screen's crowd shot → the giant outdoor screen"},
   fix=("P", "R1", "R2", "TR"), why="Seam 23.")
nb("act4", "19.07", "WIDE · ELPPA's campus: the crowd's backs and the giant screen; at the crowd's edge Mas finishes his post and sends it",
   "skyline", "SET-19", "campus", ["mas", "staff"],
   "At the edge of the crowd under a giant screen, ELPPA still on its stage, Mas finishes his post at a post's pace and sends it. His post, in its own UI.",
   "His real post, verbatim, his lowercase (name swaps). No GUEST badge on him (D-15); three collars, no pop.",
   dur=9.4, fixed=("dur",),
   onscreen=[O("very happy to be partnering with ELPPA to integrate CHATGTP into their devices later this year! think you will really like it.", 2.6, 9.2, "post")],
   music=M19post, sounds=[S("typing_soft", 1.2, -28), S("typing_soft", 1.8, -28), S("post_click", 2.5, -24)],
   arrive={"s": 1.5, "what": "the crowd's backs and the giant screen before Mas"}, fix=("P", "FACT", "R2"),
   why="Mas acts from the crowd: a rhyme with \"her\", graciously this time (facts A67).")
nb("act4", "19.08", "WIDE · the giant screen: the stream's chat lights with it; across the lawn, phones buzz → MCU · Mas",
   "skyline", "SET-19", "campus", ["mas", "staff"],
   "On the giant screen, the stream's chat lights with his post. Across the lawn, phones buzz.",
   "The V.O. after the post's read has cleared.", lines=[line("e2-vo-12")], head=1.8, tail=0.5, music=M19post,
   sounds=[S("chat_ping_run", 0.2, -26, new=True), S("phone_wave_buzz", 0.8, -26, new=True)], fix=("P", "VO", "R2", "SR"),
   why="V.O. 12: distribution: whatever ships next goes in their phones too.")
nb("act4", "19.09", "MCU · Mas on the lawn, phone to his ear (base) ↔ MCU · Gerg in the cheering lobby (cut-ins)",
   "call", "SET-19", "campus", ["mas", "gerg"],
   "Gerg calls. He's watching him on the stream from the lobby.",
   "Crosscut: the speaker is in frame, or his voice is already established (P9). Gerg in the lobby is invented staging (facts A70: the press placed Mas at the campus; one live blog also listed Gerg's counterpart there, which the call doesn't contradict on screen and nothing in the scene turns on).",
   lines=[line("e2-a4-0024"), line("e2-a4-0025", 0.45, QMAS)], head=1.4, tail=0.3, music=M19,
   sounds=[S("call_ring", 0.1, -26), S("call_connect", 0.9, -26)], pace="normal", fix=("P", "R2", "SR"), why="Gerg checks on him: the screen, and the phone.")
nb("act4", "19.10", "MCU · the call, crosscut; Gerg's last question weighted",
   "call", "SET-19", "campus", ["mas", "gerg"],
   "They just said our name. Half the lobby's on a beanbag; which half? Then: does he ever miss being up there?",
   "Mas asks aloud again (P9): his Ep1 precision question.",
   lines=[line("e2-a4-0026", pace=NORMAL), line("e2-a4-0027", 0.45, QMAS), line("e2-a4-0033", 0.5, NORMAL), line("e2-a4-0034", 0.45, QMAS),
          line("e2-a4-0035", 0.25, QUICK), line("e2-a4-0028", 0.9, WEIGHTED), line("e2-a4-0029", 0.6, WEIGHTED)],
   head=0.4, tail=0.5, music=M19, pace="normal", fix=("P", "KEEP", "PACE", "SR"), why="\"which half?\"; then \"they let me hold the clicker.\"")
nb("act4", "19.11", "POV · a push into his phone, full-bleed: a GPS breadcrumb in older colours draws itself across the stream's stage",
   "screen", "SET-20", "era_2008", [],
   "A dotted line draws itself across the stream's stage in a few quick strokes: a GPS breadcrumb in colours older than the phone, crossing the boards he once stood on.",
   "", dur=2.0, fixed=("dur",), music=M19f, sounds=[S("render_front_sweep", 0.8, -26)], style="EARLY-WEB16 / T2a",
   flashback={"when": "SEP 2006 → JUN 9, 2008", "of": "F2.1 (Mas)", "shape": "want → obstacle → turn",
              "tier": "EARLY-WEB16 (16 colours, the 2008 camcorder)", "in": "the breadcrumb across the stream's stage",
              "out": "the 2008 clicker → his 2024 phone with his sent post on it", "no_vo": "no inner voice in a memory"},
   mode="FLASHBACK", transition={"to": "F2.1", "cause": "\"You ever miss being up there?\"", "sound": "the sample-chip band over the quartet's pedal",
                                 "object": "the breadcrumb across the stream's stage → the 2006 pin"},
   fix=("P", "TR"), why="Seam 24 in.")
F21 = {"when": "SEP 2006 → JUN 9, 2008", "of": "F2.1 (Mas)", "shape": "want → obstacle → turn", "tier": "EARLY-WEB16 (16 colours, the 2008 camcorder)",
       "no_vo": "no inner voice in a memory", "guards": "THE SLEEVE has no face and no frailty cues; no cause claimed for the greying"}
nb("act4", "19.12", "WIDE · a 2006 street corner: a phone ad; young Mas with a flip phone and a bobbing pin; the end card",
   "stage", "SET-20", "era_2008", ["young-mas"],
   "A 2006 phone ad, in 16 colours with ordered dither: young MAS holds up a flip phone and grins; a GPS pin bobs over his head. The ad's end card slams in.",
   "", dur=3.4, onscreen=[O("\"WHERE YOU AT?\"", 1.8, 3.3, "doc")], music=M19f, style="EARLY-WEB16", flashback=F21, mode="FLASHBACK · want",
   fix=("P", "FACT"), why="Want: be on every phone (facts A53).")
nb("act4", "19.13", "WIDE · match on the pin: 2008, this company's stage; two polos, both collars popped; THE SLEEVE tosses him the clicker",
   "stage", "SET-20", "era_2008", ["young-mas", "sleeve"],
   "A match on the pin: 2008, this company's stage, the intro's own frame. Two polos, both collars popped. THE SLEEVE, a sleeve and nothing else, tosses him the clicker, and he catches it. The tiled 2008 crowd applauds.",
   "", dur=3.6, music=M19f, sounds=[S("clicker_catch", 1.6, -24, new=True), S("vhs_applause", 2.0, -28, new=True)],
   style="EARLY-WEB16", flashback=F21, mode="FLASHBACK · want", fix=("P", "FACT", "GR"), why="It was their stage (facts A55).")
nb("act4", "19.14", "WIDE · he clicks; behind him TPOOL's map, pins everywhere; one by one they grey out",
   "stage", "SET-20", "era_2008", ["young-mas"],
   "He clicks, and the big screen behind him shows TPOOL's map in its own colours, pins everywhere. One by one they grey out, until its corner reads LAST UPDATED 2012.",
   "No cause claimed (FC).", dur=5.0, onscreen=[O("LAST UPDATED 2012", 3.8, None, "ui")], music=M19f,
   sounds=[S("pin_grey_tick", 1.6, -28, new=True), S("pin_grey_tick", 2.2, -29, new=True), S("pin_grey_tick", 2.8, -30, new=True),
           S("pin_grey_tick", 3.4, -31, new=True)], style="EARLY-WEB16", flashback=F21, mode="FLASHBACK · obstacle",
   fix=("P", "FC", "GR"), why="Obstacle: his app greyed out (it shut down in 2012; why isn't ours to say).")
nb("act4", "19.15", "ECU · match: the clicker in his 2008 hand becomes his 2024 phone in the same grip, his post from the lawn on its screen",
   "screen", "SET-20", "campus", ["mas"],
   "The clicker in his 2008 hand becomes his 2024 phone, in the same grip, his post from the lawn still on its screen.",
   "Turn: he doesn't need their stage now.", dur=2.6, music=M19f, flashback=F21, mode="FLASHBACK · turn",
   transition={"to": "19.16", "cause": "back from the memory", "sound": "the quartet takes the garden-party arrangement",
               "object": "the 2008 clicker → his 2024 phone with his sent post on it"},
   fix=("P", "FC", "TR"), why="Seam 24 out.")
nb("act4", "19.16", "WIDE · the walled garden (phrase 1): his phone's picture opens outward; MIT KOOC turns one key; CHATGTP walked through on a velvet rope",
   "void", "SET-21", "garden", ["mit-kooc", "chatgtp"],
   "His phone's picture opens outward in three held steps until it's the whole frame: a square-cut hedge with exactly one gate. MIT KOOC turns one key as tall as he is. The gate swings open. CHATGTP, its new face on, is walked through on a velvet rope, a wristband on its tail: GUEST.",
   "Company to company only: no rings, no altar, no vows. One 4-bar phrase.", dur=10.0, fixed=("dur",), onscreen=[O("GUEST", 7.4, None, "sign")], music=M19g,
   sounds=[S("lock_big_turn", 3.4, -22, new=True), S("gate_iron_swing", 4.6, -24, new=True), S("velvet_rope", 6.6, -28, new=True)],
   mode="SET-PIECE (the walled garden)", fix=("P", "KEEP"), why="The garden: phrase 1.")
nb("act4", "19.17", "MEDIUM → WIDE · (phrase 2) at each phone-shaped flower it stops, raises a tiny hand, waits; the flower nods; then a text bubble",
   "void", "SET-21", "garden", ["chatgtp", "iris"],
   "Inside, beds of phone-shaped flowers. At each one the bubble stops, raises a tiny hand and waits. The flower nods. Only then does a speech bubble pop up over it, with a soft chip blip and no voice. On a bench, IRIS, stuck at 99%.",
   "Text only: voice 5 is paused (D-56). One 4-bar phrase.", dur=10.0, fixed=("dur",), onscreen=[O("99%", 6.4, None, "ui")], music=M19g,
   sounds=[S("flower_nod", 2.0, -30, new=True), S("chip_blip_bubble", 2.8, -26, new=True), S("flower_nod", 4.6, -30, new=True),
           S("chip_blip_bubble", 5.3, -26, new=True)], mode="SET-PIECE (the walled garden)", fix=("P", "FACT", "R2"),
   why="Inside the garden the guest asks first (facts A40: the ask-before-sending flow).")
nb("act4", "19.18", "2S · outside the hedge (phrase 3): Mas, screen-left; RADNUS rises into frame along the same hedge, screen-right",
   "void", "SET-21", "garden", ["mas", "radnus"],
   "Outside the hedge, Mas watches the raised hands go down the row. A few feet along the same hedge, RADNUS's head rises into frame, politely on the outside too. Radnus's polite smile holds a beat too long.",
   "Radnus not burning (R1). No V.O.: \"as a guest.\" and the held smile end the exchange (script review: the old V.O. 12 narrated the picture).",
   lines=[line("e2-a4-0030"), line("e2-a4-0031", 0.45, QMAS)], head=1.6, tail=2.2, fixed=("tail",),
   music=M19g, mode="SET-PIECE (the walled garden)", fix=("P", "KEEP", "FC", "SR"), why="\"as a guest.\": terms he set; Radnus's smile holds too long.")
nb("act4", "19.19", "WIDE · the reverse from inside the gate (the line crossed on purpose): the gate swings shut; the lock turns; Mas on the wrong side of the frame",
   "void", "SET-21", "garden", ["mas"],
   "From inside the garden, through the closing gate: it swings shut behind CHATGTP, and in the foreground the lock turns once. Mas is outside it, screen-right.",
   "The one shot where he loses the left third, on purpose.", dur=3.0, music=M19g,
   sounds=[S("gate_iron_swing", 0.3, -24, new=True), S("lock_big_turn", 1.4, -22, new=True)], mode="SET-PIECE (the walled garden)",
   fix=("P", "KEEP"), why="A pang at the gate.")
nb("act4", "19.20", "WIDE · the garden folds back into the phone in three held steps; he puts the phone in his pocket",
   "void", "SET-21", "garden", ["mas"],
   "The garden folds back into the phone in three held steps. He puts it in his pocket.",
   "", dur=2.4, music="E02-11 · the cello's pedal carries", sounds=[S("phone_into_pocket", 1.8, -28, new=True)],
   lcut=[{"sound": "zAI's industrial drone comes up on the right; the cello's pedal carries", "over_s": 0.6}],
   transition={"to": "20", "cause": "his post; the rival who hates the deal answers it that afternoon", "sound": "the cello pedal; zAI's drone (L 0.6 s)",
               "object": "his phone going into his pocket → the same post lighting Nole's phone in the right pane"},
   aftermath="the gate's lock; the fold back into his phone", fix=("P", "TR"), why="Seam 25.")

# ------------------------------------------------------------------------------------- sc 20 · 0:48
M20 = "E02-11 · the cello pedal; the muted 808 under zAI's drone; Nole's lamp click and his short fanfare the only motifs"
nb("act4", "20.01", "SPLIT · LEFT the thinning crowd, Mas walking out past the end card; RIGHT the zAI lobby: a new birdcage, KORG 2: NEXT QUARTER; Nole's phone lights",
   "lobby", "SET-18", "split_zai", ["mas", "nole"],
   "The split, that afternoon. LEFT: the crowd thins; Mas pockets his phone and walks out past the giant screen's end card. RIGHT: the zAI lobby, a brand-new birdcage at the doors, its shipping tag still on; a banner that's been up a while. NOLE's phone lights with Mas's post.",
   "", dur=3.8, onscreen=[O("KORG 2: NEXT QUARTER", 0.3, None, "sign")], music=M20, sounds=[S("ui_toast_pop", 2.8, -26)],
   arrive={"s": 1.0, "what": "the thinning crowd as the quartet's pedal carries over"}, fix=("P", "R2"), why="The split's cause is Mas's post (R2).")
nb("act4", "20.02", "SPLIT · RIGHT: his lamp clicks on; his post goes up, one crop, with its condition",
   "lobby", "SET-18", "split_zai", ["nole"],
   "His lamp clicks on. His own post goes up.",
   "One crop, with its condition (R2).", dur=7.6, fixed=("dur",),
   onscreen=[O("If ELPPA integrates NOPEAI at the OS level, then ELPPA devices will be banned at my companies. That is an unacceptable security violation.", 0.3, 7.5, "post")],
   music=M20, sounds=[S("lamp_click", 0.1, -22, new=True), S("nole_fanfare_short", 0.3, -24, new=True)], fix=("P", "FACT", "R2"),
   why="A threat, not a done ban (facts A41).")
nb("act4", "20.03", "SPLIT · RIGHT: MCU Nole at the cage, to a visitor at the door; he locks his own phone in it",
   "lobby", "SET-18", "split_zai", ["nole", "visitor"],
   "To a visitor at the door, a silhouette. He puts his own phone in the cage and snaps the padlock.",
   "", lines=[line("e2-a4-0032")], head=0.3, tail=1.6, fixed=("tail",), music=M20,
   sounds=[S("cage_door_shut", "E:e2-a4-0032+0.6", -22, new=True), S("padlock_snap", "E:e2-a4-0032+1.2", -20, new=True)],
   fix=("P", "KEEP", "R2"), why="The cage, his own phone first.")
nb("act4", "20.04", "SPLIT · RIGHT: ECU the padlock and the buzzing phone; Nole looks at his empty hands; the lamp clicks off",
   "lobby", "SET-18", "split_zai", ["nole"],
   "Inside the cage his phone starts to buzz: replies to his own post, stacking up where he can't reach them. He looks at the padlock, then at his empty hands. The lamp clicks off.",
   "Nothing legible in the replies.", dur=3.2, music=M20,
   sounds=[S("phone_buzz_muffled", 0.2, -26, new=True, dur=2.4), S("lamp_click", 2.8, -24, new=True)], fix=("P", "R2"), why="A laugh.")
nb("act4", "20.05", "WIDE · the NopeAI lobby, full frame, as the divider slides away: Jun 11, morning; Mas peels his own flyer off the pillar",
   "lobby", "SET-01", "lobby_morning", ["mas", "staff"],
   "The NopeAI lobby, morning. The confetti swept into a pile; the staff taking the party down, and the flyers with it. Mas, at the back with his glass, peels his own upside-down flyer off the pillar, folds it and puts it inside his jacket.",
   "The cage's bars (right pane) → the lobby's rack pillars as the divider slides away.", dur=4.8, fixed=("dur",),
   onscreen=[O("RAIL: JUN 11", 0.3, 1.8, "rail")], music="E02-11 · the lobby's morning under the quartet's pedal",
   sounds=[S("tape_peel", 2.6, -24, new=True), S("paper_flutter", 3.8, -28)],
   jcut=[{"sound": "the lobby's morning bed under the quartet's pedal", "lead_s": 0.8}],
   arrive={"s": 2.0, "what": "the lobby on its morning bed, the confetti already swept"},
   transition={"from": "20.04", "cause": "next morning, the hearing's eve", "sound": "the lobby's morning bed (J 0.8 s)",
               "object": "the cage's bars → the lobby's rack pillars as the divider slides away"},
   fix=("P", "R2", "FC", "TR"), why="Seam 26. He takes his own flyer down.")
nb("act4", "20.06", "ECU · his fingers find the yellowed corner of the old note already in his jacket, no words legible",
   "lobby", "SET-01", "lobby_morning", [],
   "His fingers find something already in there: the yellowed corner of the old note. No words legible.",
   "1 s; away from Alyi and from every compute line (D-62).", dur=1.2, fixed=("dur",), music="E02-11 · the quartet's pedal",
   sounds=[S("cloth_rustle", 0.1, -28)], fix=("P", "FC", "GR"), why="The note's last sight in Ep2 (Ep11 pays it).")
nb("act4", "20.07", "WIDE · Haras passes, her tape trailing, UPSIDE circled on it; Mas",
   "lobby", "SET-01", "lobby_morning", ["haras", "mas"],
   "HARAS passes, her calculator tape trailing, UPSIDE circled on it.",
   "The V.O. after the note's insert has cleared, before the docket.", lines=[line("e2-vo-13")], head=1.0, tail=0.4,
   onscreen=[O("UPSIDE", 0.2, "L:e2-vo-13+0.5", "doc")], music="E02-11 · the quartet's pedal", fix=("P", "VO", "R2", "SR"), why="V.O. 13: the money behind the next model; she has till the raise.")
nb("act4", "20.08", "ECU · full frame: the complaint in the middle of the floor, coffee cups on it; its docket tab",
   "lobby", "SET-01", "lobby_morning", [],
   "In the middle of the floor, the complaint has sat since February, coffee cups on it. Its docket tab.",
   "Legible for its read floor, 2.1 s (P7, P15).", dur=2.2, fixed=("dur",), onscreen=[O("HEARING · JUN 12 · MOTION TO DISMISS", 0.1, 2.2, "doc")],
   music="E02-11 · the quartet's pedal", sounds=[S("docket_tab_flick", 0.2, -26, new=True)], fix=("P", "FACT", "R2"),
   why="The drop's cause, before the drop (facts A43; D-43).")
nb("act4", "20.09", "WIDE · a rope drops from above and hooks it; a staffer lifts the cups off just in time; the complaint rises out of frame; (FOR NOW) on the clean rectangle",
   "lobby", "SET-01", "lobby_morning", ["staff"],
   "A rope drops from above and hooks it. A staffer lifts the cups off just in time. The complaint rises out of frame, leaving a clean rectangle on the carpet. A sticky note flutters down onto it.",
   "No THUD at its exit (THUD means \"filed\").", dur=4.0, fixed=("dur",), onscreen=[O("(FOR NOW)", 3.0, None, "sign")],
   music="E02-11 · the quartet ends as the complaint leaves frame: the cello's last pizzicato on the note's landing",
   sounds=[S("rope_drop", 0.2, -24, new=True), S("rope_haul", 1.1, -22, new=True), S("sticky_flutter", 2.6, -28, new=True)],
   fix=("P", "R2", "KEEP"), why="He dropped the suit the day before it was to be heard, for now.")
nb("act4", "20.10", "ECU · Jun 19, his dark room: his phone face down on the desk, lights; his hand turns it over: Alyi's post and its link card",
   "screen", "SET-07", "darkroom", ["mas"],
   "A week later. His dark room. His phone, face down on the desk, lights. His hand turns it over: Alyi's post, in its own UI, and its link card, ISS, with its one line about what it's for.",
   "The clean rectangle on the carpet → his phone face down on the desk, same shape, same place.", dur=7.0, fixed=("dur",),
   onscreen=[O("RAIL: JUN 19, 2024", 0.2, 1.8, "rail"), O("I am starting a new company:", 2.6, 6.9, "post"), O("ISS", 3.0, 6.9, "post"),
             O("one goal and one product: a safe superintelligence", 3.0, 6.9, "post")],
   music="room tone only (the quartet has ended)", sounds=[S("phone_buzz_step_1", 1.9, -26), S("phone_turn_over", 2.3, -24, new=True)],
   jcut=[{"sound": "the dark room's drone", "lead_s": 1.0}], arrive={"s": 2.0, "what": "the face-down phone"},
   transition={"from": "20.09", "cause": "a week later", "sound": "the dark room's drone (J 1.0 s)",
               "object": "the clean rectangle on the carpet → his phone face down on the desk, same shape, same place"},
   fix=("P", "FACT", "R2", "FC", "TR"), why="Seam 27. Alyi says where he is, in his own words (facts A68).")
nb("act4", "20.11", "ECU · behind the post TPOOL is still open on its map; the link card lands on the old check-in pin and knocks it loose",
   "screen", "SET-07", "darkroom", [],
   "Behind the post, TPOOL is still open on its map. The link card lands on the old check-in pin and knocks it loose.",
   "No app tracks anyone (D-29).", dur=1.6, fixed=("dur",), music="room tone only", sounds=[S("pin_knock", 0.8, -24, new=True)],
   fix=("P", "R2", "GR"), why="")
nb("act4", "20.12", "MCU · Mas reading, still (2 s) → MEDIUM · he takes the folded flyer out of his jacket and stands",
   "darkroom", "SET-07", "darkroom", ["mas"],
   "Mas, reading, still. He takes the folded flyer out of his jacket and stands.",
   "A face light one step. His decision shown (FC).", dur=4.0, fixed=("dur",), music="room tone only",
   sounds=[S("cloth_rustle", 2.0, -26), S("chair_creak", 3.0, -26, new=True)], fix=("P", "FC"), why="Mas present for the news, deciding (D-68).")
nb("act4", "20.13", "ECU · on the phone, the pin tips off the map and falls; hard cut to white",
   "screen", "SET-07", "darkroom", [],
   "On the phone, the pin tips off the map and falls. Hard cut to white as it falls.",
   "", dur=1.4, fixed=("dur",), music="room tone only; the pin's soft knock", sounds=[S("pin_fall", 0.6, -24, new=True)],
   transition={"to": "22", "cause": "Alyi has said where he is, and Mas has stood up to go", "sound": "the pin's knock, then room tone; hard cut to white",
               "object": "the falling pin → flat white → the lot"},
   aftermath="his still face, the flyer out, and the pin falling", fix=("P", "TR", "FC"), why="Seam 28.")

# ------------------------------------------------------------------------------------- sc 22 · 0:38 (2.H, real 3D)
M22 = "E02-12 ONE DOOR · DARK ROOM, sparse (one piano note per phrase); the Door with its first note missing, on non-vibrato flute, low-passed (\"through the door\")"
LEAP = {"id": "2.H", "tier": 2, "look": "real 3D: the white cube, the handleless sealed door, the brass plate ISS, a mail slot with a sprung flap, the lot, soft overcast light; through the flap, a lit interior plate",
        "owner": "ALYI'S LAB (the one place outside Mas's medium)", "door": "the pin dropping into white", "beat": "the flap lifting on the flyer",
        "filler": "Blender 4.5.3 EEVEE (may be final)", "keeps_contrast": "no grade match, no pixel rim, no down-rez; Mas, Alyi and the flyer stay pixel"}
nb("act4", "22.01", "WIDE · white, room tone only; the pin falls into it; the white is sky over an empty lot; the white cube, one door, a brass plate, a mail slot",
   "void", "SET-23", "empty_lot", ["orb"],
   "White, room tone only. The TPOOL pin falls into it from the top of frame, and the white turns out to be sky over an empty lot. On the lot, a white cube with one door, handleless, sealed by design, rendered in clean real 3D. A brass plate: ISS. A mail slot.",
   "No mat, no lock, no sign (R1, R2). No rail: it runs on from sc 20's JUN 19, 2024.", dur=5.2,
   onscreen=[O("ISS", 3.6, None, "sign")], music="E02-12 · room tone only, then the first piano note as the lot appears",
   sounds=[S("pin_fall", 0.3, -24, new=True)], style_leap=LEAP, arrive={"s": 2.0, "what": "the white and the falling pin"},
   fix=("P", "R1", "R2"), why="The one door he can't open lives in another medium.")
nb("act4", "22.02", "WIDE · Mas (pixel) walks up from frame-left, never running; the Orb scans the cube and toasts nothing",
   "void", "SET-23", "empty_lot", ["mas", "orb"],
   "Mas, pixel on the 3D plate, walks up from frame-left. He never runs. THE ORB scans the cube and toasts nothing: it can't verify a door.",
   "The contrast kept (P12).", dur=4.6, music=M22, sounds=[S("footstep_gravel", 0.4, -28, new=True), S("footstep_gravel", 1.2, -28, new=True),
                                                                  S("footstep_gravel", 2.0, -28, new=True), S("orb_scan_sweep", 3.0, -28)],
   style_leap=LEAP, fix=("P",), why="He goes there in person.")
nb("act4", "22.03", "WIDE · the band lights for four seconds: Use flyer on door",
   "void", "SET-23", "empty_lot", ["mas"],
   "The band lights for four seconds: Use flyer on door.",
   "", dur=4.0, fixed=("dur",), onscreen=[O("Use flyer on door", 0.4, 3.8, "ui")], music=M22,
   sounds=[S("ui_band_on", 0.0, -26, new=True), S("ui_band_off", 3.9, -26, new=True)], style="UI LIT (4 s)", fix=("P", "R2"), why="")
nb("act4", "22.04", "MCU · over his shoulder at the slot: he unfolds the flyer (his, upside down, tape on its corners) and pushes it in; it lifts the flap",
   "void", "SET-23", "empty_lot", ["mas"],
   "He unfolds the flyer, his, upside down, the tape still on its corners, and pushes it into the slot. It lifts the flap.",
   "A question, not a reason (D-37).", dur=3.2, music=M22,
   sounds=[S("flyer_into_slot", 1.4, -24, new=True), S("mail_flap_lift", 2.2, -26, new=True)], style_leap=LEAP,
   fix=("P", "R2", "GR"), why="Nothing is offered; the IOU stays in his jacket, unseen (FC).")
nb("act4", "22.05", "INSERT · the glimpse: the slot's gap fills the frame; a lit room; Alyi small inside at a desk, working, absorbed, cropped by the slot's edges",
   "void", "SET-23", "empty_lot", ["alyi"],
   "Through the gap: a lit room, and Alyi at a desk, working, absorbed. He doesn't look up. The flyer drops out of frame onto the floor inside, unseen.",
   "Alyi in person (pixel), never a reflection; he never looks up (FC).", dur=3.6, fixed=("dur",),
   music="E02-12 · the GPU choir under the glimpse", sounds=[S("lab_room_tone", 0.0, -34, new=True, dur=3.6), S("paper_drop_floor", 2.4, -32, new=True)],
   style_leap=LEAP, fix=("P", "R2", "FC", "GR"), why="A person in the world, at work in the lab he built.")
nb("act4", "22.06", "ECU · the flap swings shut on its spring (room tone only: the designed stop)",
   "void", "SET-23", "empty_lot", [],
   "The flap swings shut on its spring.", "", dur=1.2, fixed=("dur",), music="the designed stop: room tone only",
   sounds=[S("mail_flap_spring_shut", 0.2, -20, new=True)], style_leap=LEAP, fix=("P", "R2"), why="")
nb("act4", "22.07", "MCU · Mas at the shut flap",
   "void", "SET-23", "empty_lot", ["mas"],
   "Mas at the shut flap.", "A face light one step. 2–3 s.", dur=2.6, fixed=("dur",), music="room tone only", style_leap=LEAP,
   fix=("P", "R2"), why="")
nb("act4", "22.08", "MEDIUM · the door and his raised hand in one frame: he raises a hand to knock, and lowers it",
   "void", "SET-23", "empty_lot", ["mas"],
   "He raises a hand to knock, and lowers it.",
   "The raised hand held 2 beats. The cue returns as it lowers.", dur=3.2, fixed=("dur",),
   music="E02-12 · the cue returns as his raised hand lowers", style_leap=LEAP, fix=("P", "KEEP", "FC"),
   why="The only choice in the scene: he lets a man at work be.")
nb("act4", "22.09", "WIDE · he turns and walks away the way he came: his back, small, crossing the 3D lot; the cube doesn't change",
   "void", "SET-23", "empty_lot", ["mas"],
   "He turns and walks away the way he came. His back, small, crossing the lot. The cube doesn't change.",
   "4–5 s of his back.", dur=4.8, fixed=("dur",), music="E02-12 · the Door resolves with no cadence across the walk (it cadences only in Ep11)",
   sounds=[S("footstep_gravel", 0.6, -30, new=True), S("footstep_gravel", 1.6, -31, new=True), S("footstep_gravel", 2.6, -32, new=True)],
   jcut=[{"sound": "the dark room's drone under the Door's last bar", "lead_s": 1.0}], style_leap=LEAP,
   transition={"to": "23", "cause": "summer; the news keeps coming", "sound": "the dark room's drone (J 1.0 s)",
               "object": "his back walking away across the lot → his back at the dark-room desk as he sits"},
   aftermath="4–5 s of his back crossing the lot, the cube unchanged", fix=("P", "TR", "R2"), why="Seam 29.")

# ------------------------------------------------------------------------------------- TAG · sc 23 · 0:37
M23 = "E02-13 AUGUST · THE RUN (kit straight or swung, never boom-bap; xylophone and wood, pizzicato, a felt ostinato); a knee stab on each item"
nb("tag", "23.01", "OTS · his back as he sits at the desk; the monitor's glow; something heavy lands on the desk from above: THUD",
   "darkroom", "SET-07", "darkroom", ["mas", "orb"],
   "His back as he sits at the desk, the monitor's glow on. Something heavy lands on it from above: THUD. The suit is back, in federal court. Stuck to it, the (FOR NOW) note, crossed out.",
   "The framed GUEST lanyard from Ep1 on the wall.", dur=4.6, fixed=("dur",),
   onscreen=[O("RAIL: AUG 5", 0.2, 1.4, "rail"), O("NOLE v. MANALT ET AL. · FEDERAL COURT", 2.2, None, "doc"), O("(FOR NOW)", 2.2, None, "sign")],
   music="E02-13 · THE RUN holds its pedal under the suit's landing", sounds=[S("landing_thunk", 1.6, -14)],
   arrive={"s": 1.5, "what": "his back as he sits at the desk (sc 22's match), the monitor's glow on"},
   fix=("P", "FACT"), why="The suit comes back (facts A48). No V.O. (W8).")
nb("tag", "23.02", "ECU · its pages lose their exclamation points; he slides it aside",
   "darkroom", "SET-07", "darkroom", ["mas"],
   "Page one: !!. Page two: !. Page three: a full stop. He slides it aside so he can see the monitor.",
   "", dur=3.2, onscreen=[O("!!", 0.2, 0.9, "doc"), O("!", 0.9, 1.6, "doc"), O(".", 1.6, 2.4, "doc")], music=M23,
   sounds=[S("page_turn", 0.2, -26, new=True), S("page_turn", 0.9, -26, new=True), S("page_turn", 1.6, -26, new=True)],
   fix=("P",), why="Calmer punctuation.")
nb("tag", "23.03", "POV · the candidate's post in its own UI; the photo: a rally crowd under SIRRAH's plate, a SUMMER 2024 decal",
   "screen", "SET-07", "darkroom", [],
   "The candidate's post, in its own UI: a rival \"A.I.'d\" her crowd. The photo: a rally crowd under SIRRAH's plate, a SUMMER 2024 decal on its corner.",
   "His text never types: it arrives as one block.", dur=4.2, fixed=("dur",),
   onscreen=[O("RAIL: AUG 11", 0.2, 1.4, "rail"), O("…and she 'A.I.'d' it…", 1.6, 4.1, "post"), O("SIRRAH", 1.6, None, "plate"), O("SUMMER 2024", 1.6, None, "sign")],
   music=M23, sounds=[S("ui_toast_pop", 1.6, -26)], fix=("P", "FACT", "GR"), why="His claim is false (facts A49).")
nb("tag", "23.04", "2S → TERMINAL · the Orb floats to the monitor and scans the crowd face by face; its toast; it floats back. A background tab: an egg on a bill",
   "screen", "SET-07", "darkroom", ["orb", "mas"],
   "THE ORB floats off Mas's shoulder to the monitor and scans the crowd, face by face: human, human, human, human. Its toast. It floats back. In a background tab, an egg sits on a bill.",
   "Toast 3 of 3. The egg is Ep3's.", dur=6.8, fixed=("dur",),
   onscreen=[O("human · human · human · human", 1.4, 4.0, "ui"), O("verified: human (all of them)", 4.2, 6.6, "toast")],
   music="E02-13 · the Orb's F chime, then its verdict a beat later (F → C on vibes and glass)",
   sounds=[S("orb_servo", 0.3, -24), S("orb_scan_sweep", 1.4, -26), S("orb_chime_F", 4.2, -22), S("ui_toast_pop", 4.2, -28)],
   style="2.E TERMINAL (the Orb's POV)", fix=("P", "FACT"), why="The fact-check.")
nb("tag", "23.05", "OTS · Mas at the monitor, the toast cleared",
   "darkroom", "SET-07", "darkroom", ["mas", "orb"],
   "Mas at the monitor.", "After the Orb's toast clears.", lines=[line("e2-vo-14")], head=0.4, tail=0.4, music=M23,
   fix=("P", "VO", "FACT", "SR"), why="V.O. 14: proof of personhood as a count, the Orb's market in an election year (facts A71; pays Ep1's \"my other company. for when it gets harder to tell.\" through the Orb).")
nb("tag", "23.06", "POV · Aug 21: a TV interview in its own player (hands and tie only); his own words on its lower third",
   "screen", "SET-08", "darkroom", ["rumpt-hands"],
   "A TV interview in its own player: hands and tie only, no face. The candidate's own words on its lower third.",
   "The faithful crop, about AI fakes of himself (D-51). The neutral text blip carries it; no voice.", dur=4.6, fixed=("dur",),
   onscreen=[O("RAIL: AUG 21", 0.2, 1.4, "rail"), O("…having me speak… It's a little bit dangerous out there.", 1.4, 4.55, "lower-third")],
   music="E02-13 · THE RUN thins to its pedal; the neutral text blip carries his words", sounds=[S("blip_text_neutral", 1.5, -26, new=True)],
   fix=("P", "FACT", "R2", "FC", "GR", "SR"), why="His own words (facts A69: the Fox Business interview that aired Wednesday, Aug 21, 2024).")
nb("tag", "23.07", "POV · the player's chrome clears: on THE PODIUM (facing away), the same hands pump up a chatbot-shaped balloon and tie it on",
   "screen", "SET-08", "darkroom", ["rumpt-hands"],
   "The player's chrome clears. On THE PODIUM, which still faces away, the same hands pump up a balloon shaped like a chatbot's speech bubble, dot eyes and all, and tie it to the podium.",
   "Wordless invented business outside the broadcast (D-32). Mas's product's shape, none of his say.", dur=4.4,
   music="E02-13 · RUMPT's Podium in its FEAR colour (cup-muted brass, pp, E♭ minor; tremolo low strings; a timpani roll) under the balloon only",
   sounds=[S("balloon_pump", 0.6, -26, new=True), S("balloon_pump", 1.4, -25, new=True), S("balloon_pump", 2.2, -24, new=True),
           S("knot_tie", 3.4, -26, new=True)], fix=("P", "R2", "FC", "GR"), why="The candidate has hold of something shaped like Mas's chatbot.")
nb("tag", "23.08", "POV · the hook: the string goes taut",
   "screen", "SET-08", "darkroom", [],
   "The string goes taut, as if someone on the far side of the podium had just taken hold of it.",
   "", dur=1.6, fixed=("dur",), music="E02-13 · the Podium thins to one held chord", sounds=[S("string_taut", 0.3, -20, new=True)],
   fix=("P", "R2"), why="The hook (Ep3).")
nb("tag", "23.09", "MCU · Mas at his monitor, its glow on his still face; cut to black on the downbeat",
   "darkroom", "SET-07", "darkroom", ["mas"],
   "Mas at his monitor, its glow on his still face. Cut to black.",
   "Mas's face is the last image (R2).", dur=2.0, fixed=("dur",), music="E02-13 out · cut on the downbeat to black",
   transition={"to": "OUTRO", "cause": "the hook", "sound": "cut on the downbeat to black", "object": "the taut string → Mas's face → black"},
   aftermath="the taut string, then his face", fix=("P", "TR", "R2"), why="Seam 30.")

# ================================================================================================ gaps across a cut
# A tempo-marked exchange that crosses a cut: the gap is the outgoing beat's tail plus the incoming beat's head. Pinned
# here (both parts fixed) so the fit can't stretch an answer past its mark: (out beat, in beat, gap s, pace class[,
# the outgoing tail s]). The tail defaults to min(0.15, gap / 2); a row names its own where the picture needs the cut
# later (the wall's freeze, the window's drop).
# The lock-QA pass (lock-v1.md §3.5, 2026-10-09) added the rows marked LQ: exchanges the script's TEMPO lines and the
# proposal's Pace table mark, which the plan had left unpinned, so the fit had stretched them to 0.9-1.9 s. Two are
# GUIDE breaks, each with its one line: 1.07 → 1.08 (the second THUD sits between the lines) and 18.08 → 18.09 (the
# script's own HOLD 2 BEATS; not a row here: 18.09's fixed head).
XGAP = [
    ("1.03", "1.04", 0.25, QUICK),       # Gerg's "Which sentence?" → Selbeep
    ("1.07", "1.08", 0.5, NORMAL, 0.25),  # LQ · Selbeep → Gerg's correction. GUIDE break (script: quick 0.25 s): the
                                          # second THUD lands 0.1 s after Selbeep's line, the coffee jumps; Gerg answers
                                          # the THUD 0.4 s after it, not looking up
    ("4.07", "4.08", 0.3, QUICK),        # LQ · "you're early." → Nole, loud, fast, first (proposal Pace: quick)
    ("4A.02", "4A.03", 0.3, QUICK),      # LQ · the reading → "You can sit down now, Mas." (script: quick and dry); the
                                          # finding's second half has been on Mas's still face for its whole length
    ("9.01", "9.02", 0.3, QUICK),        # LQ · "We're on in five." → the engineer rehearsing to her (proposal Pace: 9 quick)
    ("4.08", "4.09", 0.25, QUICK),       # Gerg's blog post → Nole's case
    ("4.09", "4.10", 0.45, QMAS),        # Nole's case → "spirit, what did we call it?"
    ("4.20", "4.21", 0.25, QUICK),       # "What's that?" → Nole, hushed
    ("4.21", "4.22", 0.2, QUICK),        # "…out of nowhere." → Gerg's correction lands quick
    ("4.22", "4.23", 0.5, NORMAL, 0.3),  # LQ · "…millions of games." → Nole's fear (script: normal, 0.5 s); the knobs stop
                                          # ticking on "games", so the frozen wall holds 0.3 s after the line, then Nole
    ("4.23", "4.24", 0.3, QUICK),        # the fear → the credit
    ("6.04", "6.05", 0.45, QMAS),        # the Alyi question → "no."
    ("7.02", "7.03", 0.5, NORMAL),       # the Humanist → "Welcome."
    ("7.03", "7.04", 0.5, NORMAL),       # Tasya → "I brought my own team."
    ("13.01", "13.02", 0.3, QUICK),      # Staffer 2 → "He posted, though."
    ("14.07", "14.08", 0.5, NORMAL),     # "congratulations." → Bukaj's "Thank you."
    ("17.04", "17.05", 0.3, QUICK, 0.1),  # LQ · "…I don't forecast that far." → the driver, impatient (script: quick
                                          # 0.3 s); his window is already coming down under the cut
    ("17.05", "17.06", 0.5, NORMAL),     # the driver → "Already did."
    ("17.15", "17.16", 0.6, NORMAL),     # "Updating." → the driver leans out
    ("18.09", "18.10", 0.25, QUICK),     # LQ · "present." → Terb, brisk, the next line of the page (script: quick (Terb))
    ("18.13", "18.14", 0.5, NORMAL),     # "…one concern." → "It's that we might win."
    ("19.09", "19.10", 0.45, NORMAL),    # "the phone's closer." → Gerg
]
_BY_ID = {b["id"]: b for seg in SEGS for b in NEW[seg]}
for _row in XGAP:
    _a, _b, _g, _p = _row[:4]
    A_, B_ = _BY_ID[_a], _BY_ID[_b]
    A_["_tail"] = round(_row[4] if len(_row) > 4 else min(0.15, _g / 2), 2)
    B_["_head"] = round(_g - A_["_tail"], 2)
    A_["_fixed"].add("tail")
    B_["_fixed"].add("head")
    B_["_xgap"] = {"from": A_["lines"][-1]["id"], "gap_s": _g, "pace": _p}
