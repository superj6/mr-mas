"""lines_a4.py - every line of Ep1 Act Four (sc 24-31), as the script prints it: DRAFT 3.1 (the POV pass), 2026-09-25.

Built in two layers so the draft-2 recording specs stay untouched: _D2 is the draft-2 list the first pass recorded
(its takes, picks and seeds reproduce those files exactly), and the DRAFT 3.1 layer at the bottom restages every
line (kind, side, pov, shot, cam), adds the new lines (five MAS (V.O.) lines, the laptop-speaker "super.", the
"mostly." re-take) and retires the cut one. LINES (the draft 3.1 list, script order) is what record.py reads.

Fields
  id        a4-<scene>-<nn>, in script order
  scene     script scene number ('26A' kept as printed)
  speaker   voice slug (cast_a4)
  text      exactly as the script prints it (casing kept: Mas lowercase house style, posts in source casing)
  say       what the renderer speaks: {x} = set the pause after the preceding word to x seconds;
            [Word](/phonemes/) = house pronunciation override (misaki inline syntax)
  delivery  the script's parenthetical + direction for the read
  tag       house fact tag ([V] lines stay verbatim; [INVENTED] never goes on a dated card)
  mode      on-mic | read-aloud-post (a post the script has spoken on camera) | memo-read |
            post-popup (the house rule: posts appear as pop-ups, never as speeches -> unvoiced in the cut;
            an optional scratch read is recorded for the animatic / audio description only)
  cam       on | reflection | monitor | blueprint | crowd | os | speaker | offface | none: where the speaker is.
            A mouth is drawn (lip_sync) only for on / reflection / monitor; blueprint and crowd figures keep their
            cues as an option; os / speaker / offface / none (and every V.O.) have no mouth track
  kind      dialogue | vo | post   (draft 3.1)   post = an unvoiced pop-up (read-aloud posts and the memo are dialogue)
  side      left | right | none    (draft 3.1)   the portrait window the line plays from = ui.ts dialogueBox `tail`:
            left = Mas's window, right = the other character's (framing grammar §4.3 rule 8), none = no portrait
            window (V.O., his voice through their speaker, O.S., screens and tiles, blueprint, crowd, posts)
  pov       his | board            (draft 3.1)   whose side of the told-twice the line plays in (sc 27 = the board's pass)
  shot      the draft 3.1 shot the line plays over (script tag + framing)
  voice     optional voice slug override (mas-manalt-vo = the V.O. chain)
  status    new-3.1 | retake-3.1 | derived-3.1 | restaged-3.1 | (absent = unchanged words, take and staging)
  takes     list of take specs {seed, speed (x character speed), carrier, say}; key comedic lines get 4-6
  pick      measurement targets used to choose the take (see record.py: score_take)
  end       mouth drawing after the line ('smile' only for warm deliveries; never during speech)
"""

NEUTRAL = "Right. Okay."

MASTER_MADA = "mada-good-question"  # one master read reused for all three MADA lines (a canned answer)

_D2 = [
    # ------------------------------------------------------------------ 25 THE PLAN [BLUEPRINT]
    {"id": "a4-25-01", "scene": "25", "speaker": "neleh", "text": "Step four.", "say": "Step four.",
     "delivery": "(blueprint, precise) Reads the next item on the list. Level, exact, a clean full stop.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "on",
     "takes": [{"seed": 1}, {"seed": 1, "carrier": NEUTRAL}, {"seed": 2}],
     "pick": {"dur": (0.55, 0.95), "final": "fall", "lane": True}},
    {"id": "a4-25-02", "scene": "25", "speaker": "mada", "text": "Good question.", "say": "Good question.",
     "delivery": "(blueprint) The canned answer. Level, courteous, no answer inside it.",
     "tag": "[INVENTED] catchphrase", "mode": "on-mic", "cam": "on", "master": MASTER_MADA},

    # ------------------------------------------------------------------ 26 THE FALLING TILE
    {"id": "a4-26-01", "scene": "26", "speaker": "mas-manalt", "text": "super.", "say": "super.",
     "delivery": "His tile is gone but his mic isn't. Pleasant, lunch-order even, a complete sentence; "
                 "the final falls or stays level, never lifts. Mix: no music under it.",
     "tag": "[INVENTED] usage of a real public tic", "mode": "on-mic", "cam": "on", "key": True,
     "takes": [{"seed": 1}, {"seed": 2, "speed": 0.92}, {"seed": 1, "carrier": NEUTRAL},
               {"seed": 3, "carrier": "That's fine.", "speed": 0.95}, {"seed": 4, "say": "Super.", "speed": 1.05},
               {"seed": 5, "carrier": "Well.", "speed": 0.9}, {"seed": 6, "carrier": "Okay."},
               {"seed": 7, "carrier": "Okay.", "speed": 0.92}, {"seed": 8, "carrier": "I see."},
               {"seed": 9, "carrier": "Sure.", "speed": 0.95}, {"seed": 10, "carrier": "Mm. Okay."}],
     "pick": {"dur": (0.5, 0.85), "range_max": 9.0, "final": "fall", "gentle": True, "lane": True}},

    # ------------------------------------------------------------------ 26A MAS'S DARK ROOM
    {"id": "a4-26a-01", "scene": "26A", "speaker": "mas-manalt",
     "text": "\"if i start going off, the nopeai board should go after me for the full value of my shares\"",
     "say": "if I start going off,{0.25} the Nope AI board should go after me for the full value of my shares.",
     "delivery": "(post) Typed in source casing; the post UI stamps 9:32 PM PT. Scratch read only: dry joke, level.",
     "tag": "[V · NOV 17, 2023 · decoded 9:32 PM, zone to confirm]", "mode": "post-popup", "cam": "none"},

    # ------------------------------------------------------------------ 27 PASS ONE: THE BOARD'S SIDE
    {"id": "a4-27-01", "scene": "27", "speaker": "gerg-mockbran", "text": "\"…I quit.\"", "say": "I quit.",
     "delivery": "(post) Green-lit from below, after the 'has left' toast. Scratch read only.",
     "tag": "[V · NOV 17, 2023 · fragment of a longer message; re-fetch the casing]", "mode": "post-popup", "cam": "none",
     "takes": [{"seed": 1}, {"seed": 1, "carrier": NEUTRAL}]},
    {"id": "a4-27-02", "scene": "27", "speaker": "rima-tamuri", "text": "I'll hold it together.",
     "say": "I'll hold it together.",
     "delivery": "Spotlight, smoothing the perfect jacket. Composed, even, a soft landing on 'together'.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "on", "pick": {"final": "fall", "lane": True},
     "takes": [{"seed": 1}, {"seed": 2}, {"seed": 3, "speed": 0.92}, {"seed": 1, "carrier": NEUTRAL}]},
    {"id": "a4-27-03", "scene": "27", "speaker": "neleh", "text": "For how long?", "say": "For how long?",
     "delivery": "Polite and exact; the question she already knows the answer to. A small lift, no edge.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "on",
     "takes": [{"seed": 1}, {"seed": 1, "carrier": NEUTRAL}, {"seed": 2}, {"seed": 3, "speed": 0.95}], "pick": {"lane": True}},
    {"id": "a4-27-04", "scene": "27", "speaker": "rima-tamuri", "text": "We'll share more soon.",
     "say": "We'll share more soon.",
     "delivery": "(pleasant) The non-answer, delivered as good news. Unhurried, soft final, a smile after.",
     "tag": "[INVENTED] catchphrase", "mode": "on-mic", "cam": "on", "end": "smile", "key": True,
     "takes": [{"seed": 1}, {"seed": 2, "speed": 0.92}, {"seed": 1, "carrier": NEUTRAL}],
     "pick": {"dur": (1.0, 1.6), "range_max": 10.0, "final": "fall", "lane": True}},
    {"id": "a4-27-05", "scene": "27", "speaker": "tiled-employee", "text": "Is this a coup?", "say": "Is this a coup?",
     "delivery": "(one hand up in the crowd) Earnest, direct, a little unsure. A real question lift on 'coup'.",
     "tag": "[INVENTED] cartoon line (unquoted paraphrase of the all-hands question)", "mode": "on-mic", "cam": "on",
     "takes": [{"seed": 1}, {"seed": 1, "carrier": NEUTRAL}, {"seed": 2}, {"seed": 3, "speed": 0.95}, {"seed": 4, "carrier": "Okay."}],
     "pick": {"final": "rise", "lane": True}},
    {"id": "a4-27-06", "scene": "27", "speaker": "alyi", "text": "\"You can call it this way\"",
     "say": "You can call it{0.20} this way.",
     "delivery": "From a doorway, half cut off by the frame. Grave, serene, slow; the stress lands on 'way' and lets go. "
                 "A real quote spoken in the scene (not a post).",
     "tag": "[V · NOV 17, 2023]", "mode": "on-mic", "cam": "on", "pick": {"final": "fall", "lane": True}},
    {"id": "a4-27-07", "scene": "27", "speaker": "mas-manalt",
     "text": "\"…sorta like reading your own eulogy while you're still alive\"",
     "say": "sorta like reading your own eulogy{0.20} while you're still alive.",
     "delivery": "(post, a notification scrolling across the hearts) Scratch read only: mild, amused, level.",
     "tag": "[V · NOV 18, 2023]", "mode": "post-popup", "cam": "none"},
    {"id": "a4-27-08", "scene": "27", "speaker": "neleh", "text": "The bylaws allow it. Footnote three.",
     "say": "The bylaws allow it.{0.40} Footnote three.",
     "delivery": "At the blueprint, marker in hand. Precise; a clean full stop, then the citation, landing on 'three'.",
     "tag": "[INVENTED] ('Footnote three.' is her catchphrase)", "mode": "on-mic", "cam": "on", "pick": {"final": "fall", "lane": True},
     "takes": [{"seed": 1}, {"seed": 2}, {"seed": 3, "speed": 0.95}]},
    {"id": "a4-27-09", "scene": "27", "speaker": "alyi", "text": "Step four… will reveal itself.",
     "say": "Step four...{0.60} will reveal itself.",
     "delivery": "(reflection in the dark window) A sermon's last line: 'four' suspended, a real pause, then it lets go.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "reflection", "pick": {"final": "fall", "lane": True}},
    {"id": "a4-27-10", "scene": "27", "speaker": "neleh", "text": "When?", "say": "When?",
     "delivery": "One word, exact. A small, reasonable lift.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "on",
     "takes": [{"seed": 1}, {"seed": 1, "carrier": NEUTRAL}, {"seed": 2, "carrier": "Step four will reveal itself."},
               {"seed": 3}, {"seed": 4, "speed": 0.95}], "pick": {"lane": True}},
    {"id": "a4-27-11", "scene": "27", "speaker": "alyi", "text": "The company will tell us.",
     "say": "The company{0.15} will tell us.",
     "delivery": "(reflection) Serene certainty; stress on 'tell', the line lets go.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "reflection", "pick": {"final": "fall", "lane": True}},
    {"id": "a4-27-12", "scene": "27", "speaker": "neleh", "text": "The company is calling us.",
     "say": "The company is calling us.",
     "delivery": "The phones buzz harder. Still level and factual: a correction, not alarm.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "on", "pick": {"final": "fall", "lane": True}},
    {"id": "a4-27-13", "scene": "27", "speaker": "alyi", "text": "That is the company telling us.",
     "say": "That is the company{0.15} telling us.",
     "delivery": "(reflection) Unbothered; the koan closes the loop. Stress on 'telling'.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "reflection", "pick": {"final": "fall", "lane": True}},
    {"id": "a4-27-14", "scene": "27", "speaker": "mario", "text": "I've written up some thoughts.",
     "say": "I've written up some thoughts.",
     "delivery": "Looking at the throne, finger rising. Earnest, a little proud of the document.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "on", "takes": [{"seed": 1}, {"seed": 2}, {"seed": 3, "speed": 0.95}]},
    {"id": "a4-27-15", "scene": "27", "speaker": "adelina", "text": "In plain English: no.",
     "say": "In plain English:{0.35} no.",
     "delivery": "(into the phone, taking it out of his hand) Brisk and warm. A real beat at the colon; "
                 "'no.' is short, kind and final. Click.",
     "tag": "[INVENTED] catchphrase", "mode": "on-mic", "cam": "on", "key": True,
     "takes": [{"seed": 1}, {"seed": 2, "say": "In plain English:{0.30} no."},
               {"seed": 3, "say": "In plain English:{0.42} no.", "speed": 0.95}, {"seed": 4, "speed": 1.06}],
     "pick": {"dur": (1.2, 1.9), "final": "fall", "last_word_dur": (0.18, 0.45), "lane": True}},
    {"id": "a4-27-16", "scene": "27", "speaker": "mario", "text": "Hi. Yes. We're very worried. How much?",
     "say": "Hi.{0.16} Yes.{0.16} We're very worried.{0.20} How much?",
     "delivery": "Answers the second phone immediately. Eager and fast: no gaps to think, the worry is a formality "
                 "on the way to the number.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "on", "key": True,
     "takes": [{"seed": 1}, {"seed": 2, "speed": 1.07}, {"seed": 3, "say": "Hi.{0.12} Yes.{0.12} We're very worried.{0.15} How much?", "speed": 1.1},
               {"seed": 4, "speed": 0.97}],
     "pick": {"dur": (2.2, 3.2), "lane": True}},
    {"id": "a4-27-17", "scene": "27", "speaker": "mas-manalt", "text": "\"first and last time i ever wear one of these\"",
     "say": "first and last time I ever wear one of these.",
     "delivery": "(post, upside-down in the security tile's corner) Scratch read only: dry, level.",
     "tag": "[V · NOV 19, 2023]", "mode": "post-popup", "cam": "none", "takes": [{"seed": 1}, {"seed": 2}]},
    {"id": "a4-27-18", "scene": "27", "speaker": "ttemme", "text": "Chat. I'm the CEO now.",
     "say": "Chat.{0.28} I'm the CEO now.",
     "delivery": "To the stream, into the headset. Affable announcement; he means it.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "on", "pick": {"lane": True},
     "takes": [{"seed": 1}, {"seed": 2}, {"seed": 3}, {"seed": 4}, {"seed": 5, "speed": 0.96}]},
    {"id": "a4-27-19", "scene": "27", "speaker": "ttemme", "text": "Chat… for how long?",
     "say": "Chat...{0.55} for how long?",
     "delivery": "(watching the sand) Slower; the thought dawns mid-line. An honest small lift on 'long?'.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "on", "key": True,
     "takes": [{"seed": 1}, {"seed": 2, "speed": 0.92}, {"seed": 3, "say": "Chat...{0.65} for how long?", "speed": 0.88},
               {"seed": 4, "carrier": "Chat. I'm the CEO now."}],
     "pick": {"dur": (1.4, 2.3), "final": "rise", "lane": True}},
    {"id": "a4-27-20", "scene": "27", "speaker": "tasya", "text": "\"a new advanced AI research team\"",
     "say": "A new advanced AI research team.",
     "delivery": "(post, read aloud with pleasure) In the new slate-blue door, key ring jangling, arrow sign up. "
                 "Warm, delighted, unhurried; a smile after.",
     "tag": "[V · NOV 19-20, 2023]", "mode": "read-aloud-post", "cam": "on", "end": "smile", "pick": {"lane": True},
     "takes": [{"seed": 1}, {"seed": 2}, {"seed": 3, "speed": 0.95}, {"seed": 4, "speed": 1.04}, {"seed": 5}, {"seed": 6, "speed": 0.95},
               {"seed": 7}, {"seed": 8, "speed": 1.02}, {"seed": 9, "tail": ", everyone."}, {"seed": 10, "tail": ", everyone.", "speed": 0.95}]},
    {"id": "a4-27-21", "scene": "27", "speaker": "neleh", "text": "Step four?", "say": "Step four?",
     "delivery": "The callback. Looking at the blank line; a small, patient lift.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "on",
     "takes": [{"seed": 1}, {"seed": 1, "carrier": NEUTRAL}, {"seed": 2}, {"seed": 3, "speed": 0.95}], "pick": {"final": "rise", "lane": True}},
    {"id": "a4-27-22", "scene": "27", "speaker": "mada", "text": "Good question.", "say": "Good question.",
     "delivery": "The same canned answer as sc 25.", "tag": "[INVENTED] catchphrase", "mode": "on-mic", "cam": "on",
     "master": MASTER_MADA},

    # ------------------------------------------------------------------ 29 PASS TWO: THE OTHER SIDE
    {"id": "a4-29-01", "scene": "29", "speaker": "rima-tamuri", "text": "\"NopeAI is nothing without its people\"",
     "say": "Nope AI is nothing without its people.",
     "delivery": "(post; a dozen identical copies stack up the feed) Scratch read only: calm, warm.",
     "tag": "[V · NOV 20, 2023, ~2:06 AM PT]", "mode": "post-popup", "cam": "none"},
    {"id": "a4-29-02", "scene": "29", "speaker": "mas-manalt", "text": "the hearts were sincere.",
     "say": "the hearts{0.12} were sincere.",
     "delivery": "(to the Orb) Plain and sincere, level; a small earnest pause before the key word.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "on", "pick": {"final": "fall", "lane": True}},
    {"id": "a4-29-03", "scene": "29", "speaker": "mas-manalt", "text": "mostly.", "say": "mostly.",
     "delivery": "After HOLD 1 BEAT (the Orb looks at the check). The afterthought, a shade lower than the line before, "
                 "landing flat. No wink.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "on", "key": True,
     "takes": [{"seed": 1}, {"seed": 2, "speed": 0.9}, {"seed": 1, "carrier": "the hearts were sincere."},
               {"seed": 3, "carrier": "the hearts were sincere.", "speed": 0.92}, {"seed": 4, "carrier": NEUTRAL},
               {"seed": 5, "carrier": "the hearts were sincere.", "speed": 1.0}, {"seed": 6, "carrier": "Okay."}],
     "pick": {"dur": (0.6, 0.95), "range_max": 9.0, "final": "fall", "gentle": True, "lane": True, "below": "a4-29-02"}},
    {"id": "a4-29-04", "scene": "29", "speaker": "gerg-mockbran", "text": "One sec. Compiling.",
     "say": "One sec.{0.22} Compiling.",
     "delivery": "(on the monitor, typing, green glow) Cheerful, mid-thought; a 'one sec' beat, not a dramatic one.",
     "tag": "[INVENTED] catchphrase", "mode": "on-mic", "cam": "monitor",
     "takes": [{"seed": 1}, {"seed": 2, "speed": 0.95}]},
    {"id": "a4-29-05", "scene": "29", "speaker": "mas-manalt", "text": "what are you building?",
     "say": "what are you building?",
     "delivery": "Mild curiosity at the lunch-order pace. No alarm.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "on", "pick": {"lane": True}, "takes": [{"seed": 1}, {"seed": 2}, {"seed": 3}]},
    {"id": "a4-29-06", "scene": "29", "speaker": "gerg-mockbran", "text": "The company. Again. Just in case.",
     "say": "The company.{0.20} Again.{0.20} Just in case.",
     "delivery": "(on the monitor) A commit-log cheer; three fragments, quick beats between them, the tail trails into typing.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "monitor",
     "takes": [{"seed": 1}, {"seed": 2, "speed": 0.95}, {"seed": 3}, {"seed": 4}, {"seed": 5, "speed": 1.04}, {"seed": 6, "speed": 0.95}]},
    {"id": "a4-29-07", "scene": "29", "speaker": "tasya", "text": "Everyone is welcome.", "say": "Everyone is welcome.",
     "delivery": "(O.S., from behind the slate-blue door) Warm, gentle, smiling. Recorded dry: the mix puts it behind the door.",
     "tag": "[INVENTED] (short form of his 'Everyone is welcome. Rent is due on the first.')",
     "mode": "on-mic", "cam": "os", "end": "smile", "pick": {"final": "fall", "lane": True}},
    {"id": "a4-29-08", "scene": "29", "speaker": "mas-manalt", "text": "leave it open.", "say": "leave it open.",
     "delivery": "Looks at the blue door, Gerg's tile, the hearts. A quiet decision (an arc step), even and falling. "
                 "No weight put on it.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "on", "key": True,
     "takes": [{"seed": 1}, {"seed": 2, "speed": 0.92}, {"seed": 3, "speed": 1.04}, {"seed": 1, "carrier": NEUTRAL}],
     "pick": {"dur": (1.0, 1.55), "range_max": 10.0, "final": "fall", "gentle": True, "lane": True}},
    {"id": "a4-29-09", "scene": "29", "speaker": "neleh", "text": "Has anyone read the char—",
     "say": "Has anyone read the charter?", "cut": ("charter", 3),
     "delivery": "(as her tile goes) Mid-question, polite to the end; cut off hard inside 'char-' as the tile leaves frame.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "on", "takes": [{"seed": 1}, {"seed": 2}, {"seed": 3}], "pick": {"lane": True}},

    # ------------------------------------------------------------------ 30 THE RETURN
    {"id": "a4-30-01", "scene": "30", "speaker": "alyi",
     "text": "\"I deeply regret my participation in the board's actions.\"",
     "say": "I deeply regret{0.25} my participation{0.15} in the board's actions.",
     "delivery": "(post, read from the doorway) One sad violin, played straight. Slow and sincere; no melodrama.",
     "tag": "[V · NOV 20, 2023]", "mode": "read-aloud-post", "cam": "on", "pick": {"final": "fall", "lane": True}},
    {"id": "a4-30-02", "scene": "30", "speaker": "tasya", "text": "\"We are below them, above them, around them.\"",
     "say": "We are below them,{0.30} above them,{0.30} around them.",
     "delivery": "Hands clasped, delighted, in the middle of the floor. Three even parallel phrases; the palette steps "
                 "sync to 'below', 'above', 'around' (see the word track).",
     "tag": "[V/K · NOV 20, 2023 · re-verify before lock]", "mode": "on-mic", "cam": "on", "end": "smile",
     "pick": {"lane": True}},
    {"id": "a4-30-03", "scene": "30", "speaker": "mas-manalt", "text": "hi.", "say": "hi.",
     "delivery": "Looking down at the floor, which is Tasya. Mild and friendly.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "on", "key": True,
     "takes": [{"seed": 1}, {"seed": 1, "carrier": NEUTRAL}, {"seed": 2, "carrier": "Oh.", "speed": 0.92},
               {"seed": 3}, {"seed": 4, "carrier": "Oh. Okay."}, {"seed": 5, "carrier": "Well."}],
     "pick": {"dur": (0.35, 0.7), "range_max": 9.0, "final": "fall", "gentle": True, "lane": True}},
    {"id": "a4-30-04", "scene": "30", "speaker": "tasya", "text": "Hello.", "say": "Hello.",
     "delivery": "(from the floor, warmly) Warm and pleased; a smile after. The mix can put it in the floor.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "os", "end": "smile", "key": True,
     "takes": [{"seed": 1}, {"seed": 1, "carrier": NEUTRAL}, {"seed": 2, "speed": 0.9}],
     "pick": {"dur": (0.45, 0.85), "lane": True}},
    {"id": "a4-30-05", "scene": "30", "speaker": "terb", "text": "Which room is on fire?", "say": "Which room is on fire?",
     "delivery": "Door banging open, extinguisher like a briefcase. Brisk and procedural, as if asking which room the meeting's in.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "on", "pick": {"lane": True}, "takes": [{"seed": 1}, {"seed": 2}, {"seed": 3}]},
    {"id": "a4-30-06", "scene": "30", "speaker": "terb", "text": "…Ah.", "say": "Ah.",
     "delivery": "Everyone sees the fires. The realisation: short, flat, a little falling. (The '…' is picture time.)",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "on", "key": True,
     "takes": [{"seed": 1}, {"seed": 1, "carrier": "Which room is on fire?"}, {"seed": 2, "carrier": NEUTRAL},
               {"seed": 3, "say": "Ah...", "speed": 0.9}],
     "pick": {"dur": (0.28, 0.6), "final": "fall"}},
    {"id": "a4-30-07", "scene": "30", "speaker": "terb", "text": "Terms?", "say": "Terms?",
     "delivery": "Brisk, procedural; the only question that matters to him. A quick lift.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "on",
     "takes": [{"seed": 1}, {"seed": 1, "carrier": NEUTRAL}, {"seed": 2}, {"seed": 3, "carrier": "Ah."}, {"seed": 4, "carrier": "Okay."},
               {"seed": 5, "carrier": "Right.", "speed": 1.05}],
     "pick": {"final": "rise", "dur": (0.4, 0.8)}},
    {"id": "a4-30-08", "scene": "30", "speaker": "mada", "text": "Good question.", "say": "Good question.",
     "delivery": "The calm-off (PORTRAIT: MADA, right; HOLD 1 BEAT before). The same canned answer, perfectly level.",
     "tag": "[INVENTED] catchphrase", "mode": "on-mic", "cam": "on", "master": MASTER_MADA, "key": True},
    {"id": "a4-30-09", "scene": "30", "speaker": "mas-manalt", "text": "good question.", "say": "good question.",
     "delivery": "(one beat late; PORTRAIT: MAS, left) The echo: Mada's melody, in Mas's lane, just as level. "
                 "Then HOLD 1 BAR, the episode's one long hold.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "on", "key": True,
     "takes": [{"seed": 1}, {"seed": 2, "speed": 0.92}, {"seed": 1, "carrier": NEUTRAL}, {"seed": 3, "carrier": "Hm.", "speed": 0.95},
               {"seed": 4, "speed": 1.05}, {"seed": 5, "say": "Good question."}, {"seed": 6, "carrier": "Mm.", "speed": 0.95},
               {"seed": 7, "carrier": "Hm.", "speed": 0.9}, {"seed": 8, "carrier": "Okay."}, {"seed": 9, "carrier": "Hm.", "speed": 1.0}],
     "pick": {"dur": (0.85, 1.3), "range_max": 10.0, "final": "fall", "gentle": True, "lane": True, "match": MASTER_MADA}},
    {"id": "a4-30-10", "scene": "30", "speaker": "gerg-mockbran",
     "text": "\"Returning to NopeAI & getting back to coding tonight.\"",
     "say": "Returning to Nope AI and getting back to coding tonight.",
     "delivery": "(post; his laptop lights green, keycaps pop) Scratch read only.",
     "tag": "[V · NOV 21, 2023 · re-fetch the casing; '&' read as 'and']", "mode": "post-popup", "cam": "none"},
    {"id": "a4-30-11", "scene": "30", "speaker": "ttemme",
     "text": "\"I am deeply pleased by this result, after ~72 very intense hours of work.\"",
     "say": "I am deeply pleased by this result,{0.22} after about seventy-two very intense hours of work.",
     "delivery": "(post; the last grain runs out) Scratch read only: sincere, gracious.",
     "tag": "[V · NOV 21, 2023; '~' read as 'about']", "mode": "post-popup", "cam": "none"},
    {"id": "a4-30-12", "scene": "30", "speaker": "mas-manalt", "text": "okay.", "say": "okay.",
     "delivery": "After the Bonk (Cancel greyed out, the stranger clicks it). Settled, level-to-falling; the act resolves.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "on", "key": True,
     "takes": [{"seed": 1}, {"seed": 2, "speed": 0.9}, {"seed": 1, "carrier": "Right."}, {"seed": 3, "carrier": "I see.", "speed": 0.95},
               {"seed": 4, "carrier": "Mm."}, {"seed": 5, "carrier": "Sure.", "speed": 0.95}, {"seed": 6, "carrier": "I see."}],
     "pick": {"dur": (0.5, 0.9), "range_max": 9.0, "final": "fall", "gentle": True, "lane": True}},

    # ------------------------------------------------------------------ 31 BACK WALL
    {"id": "a4-31-01", "scene": "31", "speaker": "gerg-mockbran", "text": "What's in there?", "say": "What's in there?",
     "delivery": "Stops mid-typing at the vault. Cheerful, literal curiosity.",
     "tag": "[INVENTED]", "mode": "on-mic", "cam": "on", "takes": [{"seed": 1}, {"seed": 1, "carrier": NEUTRAL}]},
    {"id": "a4-31-02", "scene": "31", "speaker": "mas-manalt", "text": "it's a preview.", "say": "it's a preview.",
     "delivery": "(not looking) Walking past; pleasant and flat. The vault hums under it.",
     "tag": "[INVENTED] (echo of the 'research preview' launch)", "mode": "on-mic", "cam": "on", "key": True,
     "takes": [{"seed": 1}, {"seed": 2, "speed": 0.92}, {"seed": 3, "speed": 1.05}, {"seed": 1, "carrier": "Oh."}],
     "pick": {"dur": (1.0, 1.55), "range_max": 10.0, "final": "fall", "gentle": True, "lane": True}},
    {"id": "a4-31-03", "scene": "31", "speaker": "mas-manalt",
     "text": "\"i love and respect alyi… i harbor zero ill will towards him.\"",
     "say": "i love and respect [Alyi](/ˈælji/)...{0.60} i harbor zero ill will towards him.",
     "delivery": "(reads his memo aloud, unhurried; voiced only, the page is never inserted) Sincere, even; "
                 "a real pause at the ellipsis. 'Alyi' = AL-yee (naming §9).",
     "tag": "[V · NOV 29, 2023]", "mode": "memo-read", "cam": "on", "pick": {"final": "fall", "gentle": True, "lane": True},
     "takes": [{"seed": 1}, {"seed": 2}, {"seed": 3}, {"seed": 4, "speed": 0.95}]},
]

# =============================================================================================================
# DRAFT 3.1 LAYER (the POV pass, after its table read). Source: script.md Act Four draft 3.1 and
# production/act4/pov-changes.md §1 (dialogue and V.O.) with its §7 defaults: "super." through their speaker
# as written; "i don't keep score." (fallback "i don't keep things." recorded as an alternate).
# =============================================================================================================

# --- the V.O. takes: what a director would vary on a close, told line (seed, a little speed, a mid-story lead-in
#     carrier, a tail carrier that keeps the final level). Scored for an understated read (see record.py).
_VO_TAKES = [
    {"seed": 1}, {"seed": 2}, {"seed": 3, "speed": 0.95},
    {"seed": 1, "carrier": "Mm."}, {"seed": 4, "carrier": "So."}, {"seed": 5, "carrier": "Anyway.", "speed": 0.95},
    {"seed": 6, "tail": ", really."}, {"seed": 7, "carrier": "Well.", "speed": 1.04},
]
_VO_PICK = {"range_max": 8.0, "final": "fall", "gentle": True, "fall_floor": -5.0, "lane": True,
            "understated": 0.12, "wpm": "voice"}  # 'voice' = the per-line band record.vo_pace() sets (8-20% slower than his scenes)
_VO_TAG = "[INVENTED · VO · {}]"

NEW_31 = {
    # ---------------------------------------------------------------- 26A MAS'S DARK ROOM, THAT NIGHT
    "a4-26a-vo1": {
        "id": "a4-26a-vo1", "scene": "26A", "speaker": "mas-manalt", "voice": "mas-manalt-vo",
        "text": "i don't keep score.", "say": "i don't keep score.",
        "delivery": "(V.O., on the [ECU]'s second bar, over the tally he has just carved) A plain self-description, "
                    "present tense, told rather than performed: level, settling on 'score' without weight. Close and soft, "
                    "a touch slower than his scenes. No irony, no defence; the Orb counting the marks is the laugh.",
        "tag": _VO_TAG.format("D2 · the Orb catches it; the tag's drawer pays it off"), "mode": "vo", "cam": "none",
        "key": True, "takes": _VO_TAKES, "pick": _VO_PICK, "status": "new-3.1",
        "fallback": {"text": "i don't keep things.", "say": "i don't keep things.", "takes": _VO_TAKES,
                     "why": "guardrails fallback (pov-changes §7 ruling 2), if 'score' reads as a grudge against the "
                            "board; the Orb's iris then steps to the pocketed pen instead of along the tally. Default: score"}},
    "a4-26a-vo2": {
        "id": "a4-26a-vo2", "scene": "26A", "speaker": "mas-manalt", "voice": "mas-manalt-vo",
        "text": "the meeting ended early.", "say": "the meeting ended early.",
        "delivery": "(V.O., over his [PF]; the door into the exit) Gracious and small, like a scheduling note: level through "
                    "'meeting', a gentle settle on 'early'. Nothing pointed; the board's call going on without him is the catch.",
        "tag": _VO_TAG.format("D4 · the exit's first shot catches it"), "mode": "vo", "cam": "none",
        "key": True, "takes": _VO_TAKES, "pick": _VO_PICK, "status": "new-3.1"},

    # ---------------------------------------------------------------- 27 PASS ONE: his voice on their call
    "a4-27-00": {
        "id": "a4-27-00", "scene": "27", "speaker": "mas-manalt", "text": "super.", "say": "super.",
        "derive": {"from": "a4-26-01", "chain": "laptop"},
        "delivery": "(through their laptop speaker; no portrait) No new read: sc 26's 'super.' take, heard from the board's "
                    "side: small, boxy and quieter than the room. The call's room tone runs under it; nobody looks up. "
                    "The dialogue box types it with no portrait window.",
        "tag": "[INVENTED] usage of a real public tic (a4-26-01 heard from the board's side)", "mode": "speaker",
        "cam": "speaker", "status": "derived-3.1"},

    # ---------------------------------------------------------------- 29 PASS TWO: HIS SIDE
    "a4-29-vo1": {
        "id": "a4-29-vo1", "scene": "29", "speaker": "mas-manalt", "voice": "mas-manalt-vo",
        "text": "i put the phone down.", "say": "i put the phone down.",
        "delivery": "(V.O., over the [2S]; sets up MAS'S VERSION) Plain and even, technically true; no stress on 'down' "
                    "(the matching frame delivers it). Lunch-order calm, closer than the room.",
        "tag": _VO_TAG.format("D5"), "mode": "vo", "cam": "none",
        "key": True, "takes": _VO_TAKES, "pick": _VO_PICK, "status": "new-3.1"},
    "a4-29-vo2": {
        "id": "a4-29-vo2", "scene": "29", "speaker": "mas-manalt", "voice": "mas-manalt-vo",
        "text": "the badge was a joke.", "say": "the badge was a joke.",
        "delivery": "(V.O.; the Orb is already on the lanyard and never hears it) Light, dismissive only by understatement: "
                    "'a joke' said like 'a detail'. Level final; no smile in the voice, no wink.",
        "tag": _VO_TAG.format("D3 · the Orb is already on the lanyard; it never hears the line"), "mode": "vo",
        "cam": "none", "key": True, "takes": _VO_TAKES, "pick": _VO_PICK, "status": "new-3.1"},
    "a4-29-vo3": {
        "id": "a4-29-vo3", "scene": "29", "speaker": "mas-manalt", "voice": "mas-manalt-vo",
        "text": "gerg never waits to be asked.", "say": "[gerg](/ɡˈɜɹɡ/) never waits to be asked.",
        "delivery": "(V.O., out of the exchanged look; a straight line, not caught) Warm and plain, generous about Gerg; "
                    "even to the end, 'asked' soft and complete (the door's first held step lands on it). Not a joke: D8. "
                    "'gerg' with a hard G, /ɡɜrɡ/, rhyming with 'berg' (the G2P default read it 'jerg').",
        "tag": _VO_TAG.format("D8 · plants 'to be asked' for Ep12"), "mode": "vo", "cam": "none",
        "key": True, "takes": _VO_TAKES, "pick": _VO_PICK, "status": "new-3.1"},
}

# 'mostly.': re-take (pov-changes §1.1). It now answers the Orb's look at the lanyard after a 1-beat hold, and the line
# before it is the V.O. 'the badge was a joke.' (not 'the hearts were sincere.', which is cut). The context carrier is
# the new account, read aloud in his on-camera voice and cut away, so 'mostly.' comes out as its qualifier.
RETAKE_31 = {
    "a4-29-03": {
        "delivery": "(aloud, to the Orb, after [P] THE ORB HOLD 1 BEAT on the lanyard) The one true word. It answers the "
                    "Orb's look, not the V.O. (the Orb never hears that). Plain, a shade lower than the account before it, "
                    "landing level to gently falling: a concession, not a punchline. No wink, no smile.",
        "takes": [{"seed": 1, "carrier": "the badge was a joke."}, {"seed": 2, "carrier": "the badge was a joke.", "speed": 0.95},
                  {"seed": 3, "carrier": "the badge was a joke.", "speed": 0.9}, {"seed": 4, "carrier": "It was a joke."},
                  {"seed": 5, "carrier": "It was a joke.", "speed": 0.92}, {"seed": 6}, {"seed": 7, "speed": 0.92},
                  {"seed": 8, "carrier": "Hm."}, {"seed": 9, "carrier": "Mm.", "speed": 0.95}, {"seed": 10, "carrier": "Well."}],
        "pick": {"dur": (0.6, 0.95), "range_max": 9.0, "final": "fall", "gentle": True, "lane": True, "below": "a4-29-vo2"},
        "status": "retake-3.1"},
}

# Draft 3.1 staging for every line: (kind, side, cam, pov, shot[, delivery override, status]).
# side = the portrait window the line plays from (dialogueBox tail); none = no window.
STAGE_31 = {
    "a4-25-01": ("dialogue", "none", "blueprint", "his", "[GFX] THE PLAN: the blueprint figures at the blank line"),
    "a4-25-02": ("dialogue", "none", "blueprint", "his", "[GFX] THE PLAN: the blueprint figures at the blank line"),
    "a4-26-01": ("dialogue", "left", "on", "his", "[P] MAS, left (phrase 4, after his thumb taps the middle super at once)",
                 "(in [P], right after his thumb takes the strip's offer at once) His tile is gone; his mic isn't. Pleasant, "
                 "lunch-order even, a complete sentence; the final falls or stays level, never lifts. Mix: no music under it."),
    "a4-26a-vo1": ("vo", "none", "none", "his", "[ECU] the desk and the tally, bar 2 (the brush; his thumb comes to rest on mark 3)"),
    "a4-26a-01": ("post", "none", "none", "his", "[POV] his phone, full-bleed (2 bars)"),
    "a4-26a-vo2": ("vo", "none", "none", "his", "[PF] MAS, left (1½ bars; V.O. band y 182-203 on hoodie shadow)"),
    "a4-27-00": ("dialogue", "none", "speaker", "board", "[SCR] the board's call grid, bezel in frame (after HOLD 1 BEAT: NELEH turns a page)"),
    "a4-27-01": ("post", "none", "none", "board", "[SCR] the board's call grid (after the 'has left' toast)"),
    "a4-27-02": ("dialogue", "right", "on", "board", "[P] RIMA TAMURI, right, under the spotlight"),
    "a4-27-03": ("dialogue", "right", "on", "board", "[P] NELEH, right"),
    "a4-27-04": ("dialogue", "right", "on", "board", "[P] RIMA, right (then [P] NELEH listening, 1 beat)"),
    "a4-27-05": ("dialogue", "none", "crowd", "board", "[W] the all-hands, a tighter plate of the bullpen (no portrait)",
                 "(one hand up in the crowd; [W] over the heads, no portrait) Earnest, direct, a little unsure. A real "
                 "question lift on 'coup'."),
    "a4-27-06": ("dialogue", "right", "on", "board", "[P] ALYI, right, the door frame cutting his window in half"),
    "a4-27-07": ("post", "none", "none", "board", "[SCR] the board's grid under the hearts (a notification)"),
    "a4-27-08": ("dialogue", "right", "on", "board", "[P] volley, right-hand window: NELEH"),
    "a4-27-09": ("dialogue", "right", "reflection", "board", "[P] volley, right-hand window: ALYI (reflection)"),
    "a4-27-10": ("dialogue", "right", "on", "board", "[P] volley, right-hand window: NELEH"),
    "a4-27-11": ("dialogue", "right", "reflection", "board", "[P] volley, right-hand window: ALYI (reflection) (then [P] NELEH listening, 1 beat)"),
    "a4-27-12": ("dialogue", "right", "on", "board", "[2S] NELEH and MADA, the phones buzzing harder (Neleh's medium rig)",
                 "(in the boardroom [2S], the phones walking to the table's edge) Still level and factual: a correction, not alarm."),
    "a4-27-13": ("dialogue", "right", "reflection", "board", "[P] ALYI, right (reflection)"),
    "a4-27-14": ("dialogue", "right", "on", "board", "[P] MARIO, right, the lamp turning in the window behind him",
                 "(after the throne-handset insert; looking at the throne, his finger rising) Earnest, a little proud of the document."),
    "a4-27-15": ("dialogue", "right", "on", "board", "[P2] MARIO and ADELINA, she on the right"),
    "a4-27-16": ("dialogue", "right", "on", "board", "[P] MARIO, right, the rent meters spinning through the lighthouse window behind him"),
    "a4-27-17": ("post", "none", "none", "board", "[SCR] the lobby security-camera tile (upside-down in its corner)"),
    "a4-27-18": ("dialogue", "right", "on", "board", "[P] TTEMME, right (chat overlay)"),
    "a4-27-19": ("dialogue", "right", "on", "board", "[P] TTEMME, right (after the hourglass-flip insert)"),
    "a4-27-20": ("dialogue", "right", "on", "board", "[P] TASYA, right, in the new slate-blue doorway"),
    "a4-27-21": ("dialogue", "right", "on", "board", "[2S] NELEH and MADA over the blueprint (step 4 blank but for her '?')",
                 "The callback. Looking at the line that is blank but for her question mark; a small, patient lift."),
    "a4-27-22": ("dialogue", "right", "on", "board", "[2S] NELEH and MADA over the blueprint"),
    "a4-29-vo1": ("vo", "none", "none", "his", "[2S] Mas, the Orb, the lanyard laid square, his hand on his phone (1 bar) → MAS'S VERSION"),
    "a4-29-01": ("post", "none", "none", "his", "[ECU] the matching frame: the phone face-up on the desk, the post legible on its screen for 2 bars"),
    "a4-29-vo2": ("vo", "none", "none", "his", "[2S] the Orb's iris on the GUEST lanyard (from the bar's 3rd beat) → [P] THE ORB, HOLD 1 BEAT"),
    "a4-29-03": ("dialogue", "left", "on", "his", "[2S] Mas, aloud, to the Orb (Mas's medium rig); HOLD 1 BEAT after"),
    "a4-29-04": ("dialogue", "none", "monitor", "his", "[POV] Gerg's video tile on the monitor, big enough to act in"),
    "a4-29-05": ("dialogue", "left", "on", "his", "[P] MAS, left"),
    "a4-29-06": ("dialogue", "none", "monitor", "his", "[POV] Gerg's tile"),
    "a4-29-vo3": ("vo", "none", "none", "his", "[2S] the dark room's back wall, out of the quiet beat; the door's first held step on 'asked'"),
    "a4-29-07": ("dialogue", "none", "os", "his", "[2S] the back wall and the slate-blue door (O.S., behind it)",
                 "(O.S., from behind the slate-blue door; at least 1 beat after the V.O. ends, no music under either) Warm, "
                 "gentle, smiling. Recorded dry: the mix puts it behind the door."),
    "a4-29-08": ("dialogue", "left", "on", "his", "[P] MAS, left, at once on 'Everyone is welcome.'",
                 "(at once on 'Everyone is welcome.'; no eyelines before it) A quiet decision (an arc step), even and "
                 "falling. No weight put on it."),
    "a4-29-09": ("dialogue", "none", "monitor", "his", "[POV] the tile avalanche, phrase 2: NELEH's tile as it goes"),
    "a4-30-01": ("dialogue", "right", "on", "his", "[P2] MAS left at his end desk; ALYI right, the door frame cutting his window",
                 "(post, read from the doorway, in the [P2] with Mas) Slow and sincere, played straight; the one sad violin "
                 "runs under the post only and stops dead on the first heart. No melodrama."),
    "a4-30-02": ("dialogue", "right", "on", "his", "[W] the bullpen with [P] TASYA's window open over it, right"),
    "a4-30-03": ("dialogue", "left", "on", "his", "[PF] MAS, left, the 'looking down' swap",
                 "(in [PF], looking down at the floor, which is Tasya) Mild and friendly."),
    "a4-30-04": ("dialogue", "none", "os", "his", "[PF] MAS, left (TASYA O.S., from the floor)"),
    "a4-30-05": ("dialogue", "right", "on", "his", "[P] TERB, right (after the [W] entrance and his card)"),
    "a4-30-06": ("dialogue", "right", "on", "his", "[P] TERB, right; behind his window everyone looks around",
                 "(in [P]; behind his window the room looks around at the fires) The realisation: short, flat, a little "
                 "falling. (The '…' is picture time.)"),
    "a4-30-07": ("dialogue", "none", "os", "his", "[2S] the calm-off (TERB O.S.)"),
    "a4-30-08": ("dialogue", "right", "on", "his", "[P] MADA, right, after HOLD 1 BEAT"),
    "a4-30-09": ("dialogue", "left", "on", "his", "[P] MAS, left, after HOLD 1 BEAT; then [2S] HOLD 1 BAR"),
    "a4-30-10": ("post", "none", "none", "his", "[POV] his phone, lit green (then [PF] MAS reading it, 1 beat)"),
    "a4-30-11": ("post", "none", "none", "his", "[ECU] prop insert: the last grain runs out of the hourglass"),
    "a4-30-12": ("dialogue", "none", "offface", "his", "[ECU] his hand sets the glass down and nudges it (2 beats), after the silent [CU]",
                 "(off his face, over the [ECU] of his hands; the silent [CU] held 2 beats before it; no lip-sync) Settled, "
                 "level-to-falling; the act resolves.", "restaged-3.1"),
    "a4-31-01": ("dialogue", "right", "on", "his", "[P2] MAS left; GERG right, laptop open (gerg-speak portrait)"),
    "a4-31-02": ("dialogue", "left", "on", "his", "[P2] MAS left (not looking); the vault hums on the line"),
    "a4-31-03": ("dialogue", "left", "on", "his", "[P] MAS, left, at his desk (voiced on camera, never V.O.)"),
}

# Draft 3.1 script order.
ORDER_31 = [
    "a4-25-01", "a4-25-02", "a4-26-01",
    "a4-26a-vo1", "a4-26a-01", "a4-26a-vo2",
    "a4-27-00", "a4-27-01", "a4-27-02", "a4-27-03", "a4-27-04", "a4-27-05", "a4-27-06", "a4-27-07", "a4-27-08",
    "a4-27-09", "a4-27-10", "a4-27-11", "a4-27-12", "a4-27-13", "a4-27-14", "a4-27-15", "a4-27-16", "a4-27-17",
    "a4-27-18", "a4-27-19", "a4-27-20", "a4-27-21", "a4-27-22",
    "a4-29-vo1", "a4-29-01", "a4-29-vo2", "a4-29-03", "a4-29-04", "a4-29-05", "a4-29-06", "a4-29-vo3", "a4-29-07",
    "a4-29-08", "a4-29-09",
    "a4-30-01", "a4-30-02", "a4-30-03", "a4-30-04", "a4-30-05", "a4-30-06", "a4-30-07", "a4-30-08", "a4-30-09",
    "a4-30-10", "a4-30-11", "a4-30-12",
    "a4-31-01", "a4-31-02", "a4-31-03",
]

# Post pop-up holds the draft 3.1 picture sets outright (beats).
HOLD_31 = {"a4-29-01": (8, "Legible on the face-up phone inside the [ECU] for its full 2 bars (the same words the whole "
                            "time: every post is identical; it needs 2.05 s).")}

# Cut in draft 3.1, or superseded (the files move to retired/; nothing here is laid in the cut).
RETIRED = [
    {"id": "a4-29-02", "text": "the hearts were sincere.", "was": "draft 2, on-mic (to the Orb)",
     "why": "cut in draft 3.1: pov-and-framing §5.7 'never write' (claims a feeling about the employees' real act, and "
            "paired it with the check). Replaced by the V.O. a4-29-vo2 'the badge was a joke.' before the letter; the check "
            "now lands as pure record.", "files": ["retired/a4-29-02.wav", "retired/a4-29-02.mp3"]},
    {"id": "a4-29-03 (draft-2 take)", "text": "mostly.", "was": "draft 2 t01/7, read after 'the hearts were sincere.'",
     "why": "re-taken for draft 3.1's context (after the Orb's look at the lanyard); the old delivered take and its 7 "
            "alternates are archived", "files": ["retired/a4-29-03_d2.wav", "retired/takes/a4-29-03_d2/"]},
    {"id": "a4-26-vo1", "text": "the meeting ended early.", "was": "draft 3, sc 26 V.O. over the [CU] (editor scratch only)",
     "why": "removed from sc 26 in draft 3.1 (no V.O. inside the drop-out or in the candor card's scene); the words "
            "move to 26A as a4-26a-vo2. Never recorded by this stage.", "files": []},
    {"id": "draft-3 V.O. texts", "text": "i'm not a sentimental person. · the weekend was mostly logistics. · i kept quiet. "
                                          "· the hearts were sincere.",
     "was": "draft 3 wording under the ids a4-26a-vo1, a4-26a-vo2, a4-29-vo1, a4-29-vo2 (editor scratch in "
            "out/ep01/act4/animatic/scratch-vo/)",
     "why": "all four are in the §5.7 'never write' list or were rewritten at the table read; the same ids now carry "
            "draft 3.1's words, recorded here. The editor's scratch overlay must be dropped (it overrides lines.json by id).",
     "files": []},
]


def _build():
    d2 = {l["id"]: l for l in _D2}
    out = []
    for lid in ORDER_31:
        ln = dict(NEW_31[lid]) if lid in NEW_31 else dict(d2[lid])
        if lid in RETAKE_31:
            ln.update(RETAKE_31[lid])
        st = STAGE_31[lid]
        ln["kind"], ln["side"], ln["cam"], ln["pov"], ln["shot"] = st[:5]
        if len(st) > 5 and st[5]:
            ln["delivery"] = st[5]
            ln.setdefault("status", "restaged-3.1")
        if len(st) > 6:
            ln["status"] = st[6]
        if lid in HOLD_31:
            ln["hold_beats"], ln["hold_note"] = HOLD_31[lid]
        out.append(ln)
    return out


LINES = _build()

# Not voiced in Act Four, by design (kept here so nobody records them by mistake):
SILENT = [
    ("26A, 29", "THE ORB", "non-verbal by canon: its iris, the toast 'rewinding…' and the chime; it never reacts to the V.O."),
    ("29", "MADA", "tile avalanche PHRASE 4: '(No line. The stat is the joke.)'"),
    ("27/30", "THE QUIET VOTE", "camera-off tile, no line"),
    ("27", "BUKAJ", "toast text only; his plate waits for his real debut"),
    ("27", "MAS (portrait)", "pass one gives him no portrait window and no V.O.: only posts, the security tile and his voice through their speaker (a4-27-00)"),
    ("28", "CARD", "WHAT THEY DIDN'T KNOW: music sting, no VO"),
]
# THE OTHER YRRAL left the act in draft 3.1 (the new-board wide is cut), so the mute-by-guardrail entry is gone.
