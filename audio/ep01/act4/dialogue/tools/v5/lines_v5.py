"""lines_v5.py - the Act Four v5 recording spec (edit-plan-v5 §7, draft 5.1), shaped for the v5 method
(voice-diagnosis-v4 §4). The line list itself (text, tag, delivery, speed, gap, est.) is parsed from edit-plan-v5.md;
this file adds only what the recordist decides:

  say   the text as Kokoro reads it. Same words as the line (print marks dropped: a leading or trailing ellipsis, quote
        marks, the dash of an interrupted line is replaced by the words the speaker meant). Markup:
          [Word](/ipa/)   a pronunciation override (naming.md §9; misaki G2P)
          [word](-1)      a stress demotion (misaki), to move contrastive stress to the next word
          {0.35}          the TOTAL pause at this word boundary, opened with room tone inside the one read (never
                          digital black, never a second read); Kokoro's own stop is kept if it is already that long
          {b0.45}         the same, with an inhale placed in the pause (a new thought inside a turn)
  bh    1 = an inhale before the first word (first line of an exchange, after a second or more of silence, a turn of
        three or more sentences, or the delivery asks for one); 0 = none (a quick reply, or judgement: see why)
  dev   None (dry: the room is a mix send) | 'call' (the call / monitor small speaker, record_32.call_filter) |
        'laptop' (derived: the laptop-speaker chain, -22 LUFS)
  var   extra variants to read (questions, stress, the echo, the long reading); the pick is measured
"""
MAS = "[Mas](/mˈɑs/)"
GERG = "[Gerg](/ɡˈɜɹɡ/)"
gerg = "[gerg](/ɡˈɜɹɡ/)"
ALYI = "[Alyi](/ˈælji/)"
alyi = "[alyi](/ˈælji/)"
NELEH = "[Neleh](/nˈɛlɛ/)"
TTEMME = "[Ttemme](/tˈɛmi/)"
YRRAL = "[Yrral](/jˈɜɹəl/)"
MOCK = "[Mockbran](/mˈɑkbɹæn/)"
MACRO = "[macrosoft](/mˈækɹəsˌɔft/)"

PRON = {
    "Mas": "mˈɑs ('mahss', naming §9; misaki says mˈɑz)",
    "Gerg": "ɡˈɜɹɡ (hard G; misaki says ʤˈɜɹɡ)",
    "Alyi": "ˈælji ('AL-yee'; misaki says ˈælɪi)",
    "Neleh": "nˈɛlɛ ('NEL-eh'; misaki says nˈɛlA)",
    "Ttemme": "tˈɛmi ('TEM-ee', the plain reading of the spelling; misaki says tˈitˈɛm). Proposal: lock at the first table read",
    "Yrral": "jˈɜɹəl ('YUR-rul'; misaki says ˈɪɹᵊl)",
    "Mockbran": "mˈɑkbɹæn ('MOCK-bran'; misaki reduces it to -bɹən)",
    "Macrosoft": "as spelled (misaki mˈækɹəsˌɔft); lowercase 'macrosoft' in Mas's line is given the same phonemes",
    "NopeAI": "'NopeAI' as written gives nˌOpˈAˌI ('nope-A-I'); Mas's lowercase 'nopeai' is read from 'NopeAI' (lowercase gives nˈOpI)",
    "Nozama": "as spelled (misaki nəzˈɑmə). Proposal: lock at the first table read",
    "Manalt": "as spelled (misaki mˈænɔlt, 'MAN-alt')",
}

Q_LINES = {"a5-25-05", "a5-27-02", "a5-27-03", "a5-27-08", "a5-27-10", "a5-27-13", "a5-27-16", "a5-27-18", "a5-27-25",
           "a5-27-43", "a5-27-46", "a5-29-05", "a5-29-16", "a5-29-18", "a5-29-24", "a5-30-05", "a5-30-08", "a5-30-11",
           "a5-30-15", "a5-31-01", "a5-27-41"}
# the yes/no, echo and declarative questions (Kokoro rarely lifts them; the plan lists them): the take pick prefers a lift
YESNO = {"a5-27-02", "a5-27-03", "a5-27-08", "a5-27-16", "a5-27-18", "a5-27-46", "a5-29-05", "a5-29-18", "a5-30-11",
         "a5-31-01", "a5-29-24"}
# which sentence (by its last word) carries the question, for lines where it isn't the last word of the take
Q_WORD = {"a5-27-18": "coup", "a5-29-05": "open", "a5-25-05": "own", "a5-29-18": "pack", "a5-29-24": "charter",
          "a5-27-43": "long"}

S = {
    # ---------------------------------------------------------------- sc 25 · THE PLAN (Neleh over the blueprint)
    "a5-25-01": dict(say="Three of us stepped down this year.", bh=1, why="'Open on a breath after the stamp'"),
    "a5-25-02": dict(say=f"Leave out {MAS} and {GERG}, and the four of us are a majority.", bh=1,
                     why="'One sentence, one breath': the breath is taken before it, after a 0.9 s gap"),
    "a5-25-03": dict(say="This board controls the company.{0.35} Not the other way round.", bh=0),
    "a5-25-04": dict(say="Our biggest investor has put in billions.{0.40} It gets this many votes.", bh=1,
                     why="1.0 s after her last line"),
    "a5-25-05": dict(say="And the CEO?{0.30} What does he own?", bh=0),
    "a5-25-06": dict(say="Good question.", bh=0, master=True),
    # ---------------------------------------------------------------- sc 26 · the call, his side
    "a5-26-01": dict(say="super.", bh=1, why="after the room comes back (picture lead-in)"),
    # ---------------------------------------------------------------- sc 26A · the dark room
    "a5-26a-01": dict(say="i don't keep,{0.30} score.", bh=1,
                      var=[dict(say="i don't keep{0.30} score."), dict(say="i don't keep...{0.30} score.")],
                      why="the 0.3 s phrase pause after 'keep' (the V.O.'s slowness from pauses, not speed)"),
    # ---------------------------------------------------------------- sc 27 · pass one, the board's side
    "a5-27-01": dict(say=f"{MAS}.{{0.60}} The board has decided that you will no longer lead the company.{{0.40}} It will be announced shortly.",
                     bh=1, dev="call"),
    "a5-27-02": dict(say="Do you have any questions?", bh=1, dev="call", why="1.3 s after his first turn"),
    "a5-27-03": dict(say="Is his feed frozen?", bh=1, why="after the 1.5 s held silence"),
    "a5-27-04": dict(say="No.{0.30} That is just him.", bh=0, dev="call"),
    "a5-27-05": dict(derive="a5-26-01", dev="laptop"),
    "a5-27-06": dict(say="Step two.{0.30} I'll read it once before it goes up.", bh=1),
    "a5-27-07": dict(say=f"He was not consistently candid in his communications with the board.{{0.50}} The board no longer has confidence in his ability to continue leading NopeAI.",
                     bh=1, why="a new reading after 0.5 s: the split inside her turn"),
    "a5-27-08": dict(say="Any objections?", bh=0),
    "a5-27-09": dict(say="Step three.{0.30} Rima, thank you for agreeing to serve as interim CEO while we search.", bh=1),
    "a5-27-10": dict(say="For how long?", bh=0, dev="call"),
    "a5-27-11": dict(say="Until the search is done.", bh=0),
    "a5-27-12": dict(say="The staff will ask you what happened.", bh=0, dev="call"),
    "a5-27-13": dict(say="What should I tell them?", bh=0, dev="call"),
    "a5-27-14": dict(say="What the post says.{0.30} That's all the board is saying for now.", bh=0),
    "a5-27-15": dict(say="We'll share more soon.", bh=0, dev="call"),
    "a5-27-16": dict(say="Will we?", bh=0,
                     alt_text=[dict(say="Will we, though?", note="the plan's last-resort comma variant: a TEXT CHANGE, recorded as an alternate only, never delivered")]),
    "a5-27-17": dict(say="More.{0.25} Soon.", bh=0, dev="call"),
    "a5-27-18": dict(say="Is this a coup?{0.30} Because it looks like one.", bh=1),
    "a5-27-19": dict(say="You can call it this way.{b0.90} I disagree with this.{0.40} This was the board doing its duty to the mission of the nonprofit.",
                     bh=1, why="three sentences after a loaded 1.0 s; the 0.9 s look is a change of thought, so it takes a breath"),
    "a5-27-20": dict(say="Nobody asked him to go.{0.35} He'd have kept his job, just not the chair.", bh=1),
    "a5-27-21": dict(say=f"{GERG} has never waited to be asked.", bh=0, dev="call"),
    "a5-27-22": dict(say="They're all asking whether it was allowed.{0.30} It was.{0.45} The charter, footnote three.{0.35} I've read it four times tonight.",
                     bh=1),
    "a5-27-23": dict(say="What they actually want to know is what happens on Monday.{0.40} I'd like to be able to tell them something.",
                     bh=1, why="1.4 s after nobody answers"),
    "a5-27-24": dict(say="Step four will reveal itself.", bh=0),
    "a5-27-25": dict(say="When?", bh=0),
    "a5-27-26": dict(say="The company will tell us.", bh=0,
                     var=[dict(say="The [company](-1) will tell us.")], stress=("tell", "company")),
    "a5-27-27": dict(say=f"That isn't a time, {ALYI}.{{0.30}} All we've given the staff since yesterday is more soon.", bh=0),
    "a5-27-28": dict(say="That is the [company](-1) telling us.", bh=1,
                     var=[dict(say="That is the company telling us.")], stress=("telling", "company"),
                     why="1.1 s after the clack and her look down"),
    "a5-27-29": dict(say="Then we'll write step four ourselves.", bh=1),
    "a5-27-30": dict(say=f"Mario, it's {NELEH}, from the NopeAI board.{{b0.42}} I'll be direct.{{0.35}} The board is offering you the job of CEO, and it wants to discuss a merger.",
                     bh=1, why="'one breath before I'll be direct'; three sentences after the pickup"),
    "a5-27-31": dict(say=f"{NELEH}, hi.{{0.30}} Wow.{{0.40}} I've actually written up some thoughts on exactly this.{{0.25}} Eleven pages, on the conditions under which we might, hypothetically, consider it.",
                     bh=1, trail=dict(word="hypothetically", by="a5-27-32", overlap_s=0.25, drop_db=-8.0, fade_s=0.15),
                     why="four sentences: the breath before the turn"),
    "a5-27-32": dict(say="In plain English:{0.25} no.", bh=0, why="a tail overlap: already breathed in"),
    "a5-27-33": dict(say="It's Nozama.{0.30} About the money.", bh=1),
    "a5-27-34": dict(say="Hi.{0.18} Yes.{0.24} We're very worried.{0.15} How much?", bh=0, why="'at once' (0.3 s)"),
    "a5-27-35": dict(say="He's been in the building for hours.{0.40} We've talked all day about him coming back, and we're no closer.", bh=1),
    "a5-27-36": dict(say="They gave him a guest badge.", bh=0),
    "a5-27-37": dict(say="It's the correct badge.{0.30} He doesn't work here.", bh=0),
    "a5-27-38": dict(say=f"{TTEMME}, we'd like you to serve as interim CEO.", bh=1),
    "a5-27-39": dict(say="You already have an interim CEO.", bh=0),
    "a5-27-40": dict(say="We'd like a different one.", bh=0),
    "a5-27-41": dict(say="Fine.{0.35} But before I say yes, I need to know why you fired him.", bh=0),
    "a5-27-42": dict(say="Okay.", bh=1, why="after about 3 s of clockwork"),
    "a5-27-43": dict(say="Chat.{0.40} For how long?", bh=1,
                     var=[dict(say="Chat,{0.40} for how long?")], echo="a5-27-10",
                     why="read as 'Chat. For how long?' so the question starts a sentence, as Rima's did; 1.0 s after 'Okay.'"),
    "a5-27-44": dict(say="Good evening.{0.30} You'll want to hear our statement.", bh=1),
    "a5-27-45": dict(say=f"We look forward to getting to know {TTEMME} and NopeAI's new leadership team and working with them.{{b0.50}} And we're extremely excited to share the news that {MAS} Manalt and {GERG} {MOCK}, together with colleagues, will be joining Macrosoft to lead a new advanced AI research team.",
                     bh=0, split_alt=True, why="0.4 s after his own greeting (no head breath); the breath goes in the 0.5 s between the sentences"),
    "a5-27-46": dict(say="Step four?", bh=1, why="after the overhead's loaded beat (1 s)"),
    # ---------------------------------------------------------------- sc 29 · pass two, his side
    "a5-29-01": dict(say="the badge was a joke.", bh=1),
    "a5-29-02": dict(say="mostly.", bh=0, why="judgement: a breath would telegraph the one true word after the Orb's look"),
    "a5-29-03": dict(say="Sorry, one sec.{0.25} I've got a build compiling.", bh=1, dev="call"),
    "a5-29-04": dict(say=f"it's two in the morning, {gerg}.", bh=0),
    "a5-29-05": dict(say="Best time there is.{0.30} Nobody else is pushing anything.{b0.50} Anyway, that's not why I called.{0.20} You've got the staff letter open?{0.28} Scroll down.",
                     bh=0, dev="call", why="a quick reply (0.3 s): already breathed in; the breath goes at the 0.5 s change of thought"),
    "a5-29-06": dict(say="They're telling the board they're unable to work for or with people that lack competence, judgment and care for our mission and employees.",
                     bh=1, dev="call"),
    "a5-29-07": dict(say="And they'll quit, unless all current board members resign.", bh=0, dev="call",
                     fallback=dict(say="And they'll quit unless the whole board resigns.",
                                   note="the plan's paraphrase if the letter's '…unless all current board members resign…' can't be fetched ([K])")),
    "a5-29-08": dict(say=f"and go to {MACRO}.", bh=0),
    "a5-29-09": dict(say="Yep.{0.20} Macrosoft's promised them positions for all NopeAI employees.", bh=0, dev="call"),
    "a5-29-10": dict(say="that's a lot of desks.", bh=0),
    "a5-29-11": dict(say=f"Scroll to the bottom.{{b1.60}} {ALYI} signed it.", bh=0, dev="call",
                     joined=("a5-29-11", "a5-29-12"),
                     why="ONE read for both lines (the plan); the 1.6 s scroll pause opened in room tone, with a breath before 'Alyi signed it.'; the two files are cut from it inside the room tone"),
    "a5-29-12": dict(joined_part="a5-29-11"),
    "a5-29-13": dict(say=f"{alyi} voted.", bh=0),
    "a5-29-14": dict(say="He did both.", bh=0, dev="call"),
    "a5-29-15": dict(say="That'll be the share sale.{0.30} Everybody's been waiting on that one.", bh=1, dev="call"),
    "a5-29-16": dict(say="what are you building?", bh=1, why="after the stamp's beat"),
    "a5-29-17": dict(say="The company.{0.22} Again.{0.28} Just in case.", bh=0, dev="call"),
    "a5-29-18": dict(say="So.{0.30} Do I tell everyone to pack?", bh=1, dev="call"),
    "a5-29-19": dict(say="ask me when it compiles.", bh=0),
    "a5-29-20": dict(say=f"Don't get up, {MAS}.{{0.30}} I won't keep you.{{0.45}} Everyone is welcome.", bh=1),
    "a5-29-21": dict(say="everyone.", bh=0),
    "a5-29-22": dict(say="Yes.{0.25} You first.{0.35} And there's a desk for every one of them.", bh=1, why="three sentences"),
    "a5-29-23": dict(say="leave it open.", bh=1, why="after the door's 1.1 s"),
    "a5-29-24": dict(say="Has anyone read the charter?", bh=1, dev="call",
                     trail=dict(word="charter", n_ph=3, by="the tile's exit", overlap_s=0.0, drop_db=-8.0, fade_s=0.15),
                     why="recorded complete; the world (the tile's exit) takes the tail after 'char'"),
    # ---------------------------------------------------------------- sc 30 · the return
    "a5-30-01": dict(say="You sent three.", bh=1),
    "a5-30-02": dict(say="one for each day.", bh=0),
    "a5-30-03": dict(say="It has been four days.", bh=0),
    "a5-30-04": dict(say="i'm not counting today.", bh=0),
    "a5-30-05": dict(say="what happens to you if NopeAI disappears?", bh=1),
    "a5-30-06": dict(say="Oh, we'd be fine.{b0.50} We have all the IP rights and all the capability.{0.40} We are below them,{0.35} above them,{0.38} around them.",
                     bh=1, why="three sentences; the record starts after a breath"),
    "a5-30-07": dict(say="Hello.", bh=1),
    "a5-30-08": dict(say="Which room is on fire?", bh=1),
    "a5-30-09": dict(say="Ah.", bh=1, why="1.6 s after everyone looks around"),
    "a5-30-10": dict(say=f"Before this goes out, I'm reading it once, so nobody's surprised.{{b0.50}} We have reached an agreement in principle for {MAS} Manalt to return to NopeAI as CEO with a new initial board of Terb, Chair, the Other {YRRAL}, and Mada.",
                     bh=1, why="'(Chair)' read as a word between commas; a breath before the reading"),
    "a5-30-11": dict(say="you're staying?", bh=0),
    "a5-30-12": dict(say=f"He stays.{{0.30}} You and {GERG} don't sit on the board.", bh=0),
    "a5-30-13": dict(say="we'll stand.", bh=0),
    "a5-30-14": dict(say="And there'll be an independent review.", bh=0),
    "a5-30-15": dict(say="of what?", bh=0),
    "a5-30-16": dict(reuse="a5-25-06"),
    "a5-30-17": dict(say="good question.", bh=0),
    "a5-30-18": dict(say="Chat,{0.25} we're so back.", bh=1),
    "a5-30-19": dict(say="okay.", bh=1),
    # ---------------------------------------------------------------- sc 31 · the coda
    "a5-31-01": dict(say="Is it ready?", bh=1),
    "a5-31-02": dict(say="it's a preview.", bh=0),
    "a5-31-03": dict(say="You said that about the last one.", bh=0),
    "a5-31-04": dict(say=f"i love and respect {alyi}, i think he's a guiding light of the field and a gem of a human being.{{b0.50}} i harbor zero ill will towards him.",
                     bh=1),
}

VOICE_OF = {"NELEH": "neleh", "MADA": "mada", "MAS": "mas-manalt", "ALYI": "alyi", "RIMA TAMURI": "rima-tamuri",
            "TILED EMPLOYEE": "tiled-employee", "MARIO": "mario", "ADELINA": "adelina", "TTEMME": "ttemme",
            "TASYA": "tasya", "GERG": "gerg-mockbran", "TERB": "terb"}

# voice-diagnosis-v4 §4.2 bands (speed; articulation syll/s; turn wpm)
BANDS = {"mas-manalt": ((0.88, 0.95), (3.6, 4.2), (135, 155)), "mas-manalt-vo": ((0.88, 0.95), (3.4, 4.0), (120, 140)),
         "neleh": ((0.92, 1.00), (4.2, 4.8), (150, 170)), "alyi": ((0.85, 0.92), (3.4, 4.0), (115, 140)),
         "tasya": ((0.88, 0.96), (3.8, 4.4), (125, 145)), "rima-tamuri": ((0.90, 0.98), (4.0, 4.6), (140, 160)),
         "mada": ((0.92, 1.00), (3.6, 4.2), (125, 145)), "adelina": ((0.95, 1.05), (4.2, 4.8), (150, 165)),
         "terb": ((0.98, 1.06), (4.4, 5.0), (165, 185)), "mario": ((1.00, 1.08), (4.6, 5.4), (160, 185)),
         "ttemme": ((1.00, 1.08), (4.4, 5.2), (155, 175)), "gerg-mockbran": ((1.02, 1.10), (5.0, 5.8), (175, 200)),
         "tiled-employee": ((0.95, 1.05), (4.2, 5.0), (150, 170))}
