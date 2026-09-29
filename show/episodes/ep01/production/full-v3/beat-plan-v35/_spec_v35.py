"""The v3.5 spec (script draft 8.4, the final version: proposal-v35.md with the lead's choices, PLAN §8), as deltas on
the v3.4 LOCK (show/reel/ep01-v34/ep01-v34-<seg>.json). Imported by _build_v35.py and audio/ep01/v35/takes.py; edit
here and re-run both.

Fix codes:
  C1..C12  PLAN §8's choices on proposal-v35's open choices (1A 3 AM thought · 2A the vision-post thought · 3A Mario's
           point two · 4A Nole's stamp · 5A TPOOL two shots about 6 s · 6A Neleh's line cut, Alyi's kept · 7A Gerg's
           earlier GNIB line · 8A HOW DO I WIN? retired (season) · 9A the tear macro · 10A the pay-back set · 11A one
           film · 12A amended plus the quicker board exit)
  NEW      a new scene of proposal-v35 (its number is the beat's "scene")
  REST     restored from an earlier lock (the president's deepfake: v3.3)
  TR       a new or changed seam (script-v35-notes §5: cause, sound lead, matched object)
  PACE     proposal-v35's pace table (quick: others 0.15-0.35 s, Mas 0.4-0.5 s; normal 0.4-0.6 s; weighted)
  KEEP     version-ledger §5's keep list
  FACT     a verification result (script-v35-notes §7)
  CLONE    the Senate's cloned voice, cut (SHOWRUNNER-NOTES 00000)

Lengths: a new take's audible length comes from the recorded v3.5 take (audio/ep01/v35/<seg>/lines.json) when it
exists (L(id, fallback)); a restored take's from its own row (A(id)). Every est_s is a planning length, never a
measurement; the v3.5 lock sets the frames.
"""
import json
import os

_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), *[".."] * 6))
SEGS = ("coldopen", "act1", "act2", "act3", "act4", "tag")

# ------------------------------------------------------------------------------------------------ take lengths
_TAKE_FILES = ['audio/ep01/coldopen/dialogue/lines-fast-v1.json', 'audio/ep01/act1/dialogue/lines-fast-v1.json',
               'audio/ep01/act2/dialogue/lines-fast-v2.json', 'audio/ep01/act3/dialogue/lines-fast-v2.json',
               'audio/ep01/tag/dialogue/lines-fast-v1.json', 'audio/ep01/act4/dialogue/lines-v5.json'] + \
              [f'audio/ep01/v3/{s}/lines-v3.json' for s in ('act1', 'act2', 'act3', 'act4', 'tag')] + \
              [f'audio/ep01/v31/{s}/lines-v31.json' for s in ('act1', 'act2', 'act3', 'act4', 'tag')] + \
              [f'audio/ep01/v32/{s}/lines-v32.json' for s in ('act1', 'act2', 'act3', 'act4')] + \
              ['audio/ep01/v33/act4/lines-v33.json'] + \
              [f'audio/ep01/v34/{s}/lines-v34.json' for s in ('act1', 'act2', 'act3', 'act4')]
_ROWS = None


def take_rows():
    """every existing take row by id (first file wins), with the file it came from"""
    global _ROWS
    if _ROWS is None:
        _ROWS = {}
        for f in _TAKE_FILES:
            p = os.path.join(_ROOT, f)
            if os.path.exists(p):
                for r in json.load(open(p)):
                    _ROWS.setdefault(r['id'], dict(r, _file=f))
    return _ROWS


def _aud(r):
    p = r.get('pace', {})
    if 'audible_out_s' in p and 'audible_in_s' in p:
        return round(p['audible_out_s'] - p['audible_in_s'], 2)
    return r.get('voiced_span_s') or r.get('duration_s')


def A(lid):
    """the audible length of an existing take"""
    return _aud(take_rows()[lid])


def L(lid, fallback):
    """the audible length of a recorded v3.5 take, or the fallback estimate"""
    for seg in SEGS:
        for name in ('lines-v35.json', 'lines.json'):
            p = os.path.join(_ROOT, 'audio/ep01/v35', seg, name)
            if os.path.exists(p):
                for r in json.load(open(p)):
                    if r['id'] == lid:
                        return _aud(r)
    return fallback


# ------------------------------------------------------------------------------------------------ the new lines
M = "[Mas](/mˈɑs/)"
G = "[gerg](/ɡˈɜɹɡ/)"
T = "[tasya](/tˈɑsjə/)"

# Mas's four new inner-voice lines: id -> (seg, beat, text, spoken_as, delivery, kind, speed)
# Voice: the episode's existing Kokoro Mas V.O. (speaker mas-manalt, kind vo: am_michael · a-michael-close · vo-close),
# the v3.4 settings; never a clone of anyone.
NEW_VO = {
    "v35-vo-01": ("act1", "v35-12.02", "they've stopped testing it. they're using it.",
                  "they've stopped testing it.{0.45} they're using it.",
                  "3 AM, alone, after reading a stranger's post twice; quiet, almost to himself; the second sentence lighter",
                  "a read of the world (choice 1A); the act's one moment he's moved, never named", 0.87),
    "v35-vo-02": ("act1", "v35-19.03", "someone gets to be in the room.",
                  "someone gets to be in the room.",
                  "his face in the page's light, the post finished; plain, private; no weight on any word",
                  "his want, hinted (choice 2A); a rewatcher hears the cold open", 0.85),
    "v35-vo-03": ("act4", "v35-41.01", "the budget. i said the budget.",
                  "the budget.{0.4} i said the budget.",
                  "the phone won't stop; flat, a man replaying his own wrong read; not self-pity",
                  "the wrong read, paid (the one he got wrong at the JOIN)", 0.87),
    "v35-vo-04": ("act4", "v35-41.04", "gerg. tasya. the money. the money. the money.",
                  f"{G}.{{0.3}} {T}.{{0.3}} the money.{{0.25}} the money.{{0.25}} the money.",
                  "faster than he ever thinks: the tiles stacking; each 'the money.' a new tile, not louder",
                  "the rattled count (it replaces the cut 406/407 count; said calmly at the return)", 0.93),
}

# Everyone else's new lines, and Mas's new spoken lines: id -> dict.
# ref: the existing take whose speaker, voice, speed and device the new read copies (the character's existing Kokoro
# voice). voice_slug: only where a character has no voice yet (AUHSOJ doubles a stock registry preset; the ElevenLabs
# pass casts him properly). device: the room chain (None: in the room; call: a video-call tile; pa: a hall).
NEW_LINES = {
    # ---- ACT ONE · sc 13, JUN 2018 (in the room, weighted)
    "v35-a1-0001": dict(seg="act1", beat="v35-13.02", who="alyi", text="Nobody taught it that. It played itself.",
                        say="Nobody taught it that.{0.45} It played itself.", ref="a5-30-01", device=None,
                        delivery="low, in awe, eyes on the arena; the second sentence almost a whisper",
                        note="[INVENTED · the lab's own account: \"OpenAI Five plays 180 years worth of games against itself every day, learning via self-play.\" (Jun 25, 2018, [P·arch])]"),
    "v35-a1-0002": dict(seg="act1", beat="v35-13.02", who="mas", text="a hundred and eighty years. since this morning.",
                        say="a hundred and eighty years.{0.35} since this morning.", ref="e1-a1-10-01", device=None, speed=0.9,
                        delivery="reading the wall counter; practical, quietly impressed",
                        note="[INVENTED · the 180 years a day is the post's figure [P·arch]]"),
    "v35-a1-0003": dict(seg="act1", beat="v35-13.02", who="alyi", text="Make it bigger and it could learn anything.",
                        say="Make it bigger and it could learn anything.", ref="a5-30-01", device=None,
                        delivery="the believer; not a pitch, a thing he's sure of", note="[INVENTED]"),
    "v35-a1-0004": dict(seg="act1", beat="v35-13.02", who="mas", text="how much bigger?",
                        say="how much bigger?", ref="e1-a1-10-01", device=None, speed=0.9,
                        delivery="the organizer's question; plain, already doing the sum", note="[INVENTED]"),
    "v35-a1-0005": dict(seg="act1", beat="v35-13.03", who="alyi", text="Games now. Robots, maybe. After that… I don't know.",
                        say="Games now. Robots, maybe.{0.4} After that… I don't know.", ref="a5-30-01", device=None,
                        delivery="honest; the not-knowing is happy, not afraid",
                        note="[INVENTED · the lab's 2018: games (Jun), a robot hand (Jul 30, 2018, [K]); nobody knew the road]"),
    "v35-a1-0006": dict(seg="act1", beat="v35-13.03", who="mas", text="then a lot more computers.",
                        say="then a lot more computers.", ref="e1-a1-10-01", device=None, speed=0.9,
                        delivery="O.S., simple, certain: his job, not a dream", note="[INVENTED · the 256 GPUs on the racks behind the bots [P·arch]]"),
    "v35-a1-0007": dict(seg="act1", beat="v35-13.04", who="alyi", text="Something that can learn anything, Mas. What else would you build?",
                        say=f"Something that can learn anything, {M}.{{0.4}} What else would you build?", ref="a5-30-01", device=None,
                        delivery="turning to him; warm, a real question between partners; no answer comes", note="[INVENTED]"),
    # ---- ACT ONE · sc 14, 18, 21, 23
    "v35-a1-0008": dict(seg="act1", beat="9.09", who="tasya", text="And we'd like it in everything we make.",
                        say="And we'd like it in everything we make.", ref="v31-a1-0005", device=None,
                        delivery="warmly, the same breath as the floors; a small request that is the whole deal",
                        note="[INVENTED · consistent with Macrosoft's Jan 23, 2023 post: \"Microsoft will deploy OpenAI's models across our consumer and enterprise products…\" ([P], blogs.microsoft.com)]"),
    "v35-a1-0009": dict(seg="act1", beat="v35-18.02", who="rima", text="Still a preview?",
                        say="Still a preview?", ref="e1-a1-5-02", device=None,
                        delivery="teasing, warm; her launch-night worry turned into the joke", note="[INVENTED]"),
    "v35-a1-0011": dict(seg="act1", beat="11.03", who="mario",
                        text="Point two: if someone's going to build it, it should be someone who's scared of it.",
                        say="Point two:{0.4} if someone's going to build it, it should be someone who's scared of it.",
                        ref="e1-a1-11-01", device=None, speed=0.95,
                        delivery="still dictating to CLOD, finger up; sincere, the reason he builds at all; the same memo voice",
                        note="[INVENTED · close to Misanthropic's public thesis (Mar 8, 2023, [V]) · choice 3A · MARIO's Kokoro take is final (choice 11A)]"),
    "v35-a1-0012": dict(seg="act1", beat="12.02", who="oigneb", text="You signed it. Now put the stamp down.",
                        say="You signed it.{0.35} Now put the stamp down.", ref="v32-a1-0007", device=None,
                        delivery="gentle, precise, holding the sign higher: he wants the stamp put down",
                        note="[INVENTED · choice 4A: the FILED stamp replaces the soldering iron]"),
    # ---- ACT TWO · sc 27, 28, 29
    "v35-a2-0001": dict(seg="act2", beat="15.13", who="mas", text="i get paid enough for health insurance.",
                        say="i get paid enough for health insurance.", ref="e1-a2-15-11", device=None,
                        delivery="the wallet held up to the dais; plain, unbothered, a fact",
                        note="[P · MAY 16, 2023 · the Senate transcript (facts L22, W2): \"I make no… I get paid enough for health insurance. I have no equity in OpenAI.\"; lowercased; it was the clone's line in v3.4]"),
    "v35-a2-0002": dict(seg="act2", beat="v35-28.02", who="gerg", text="The next one costs billions. Nobody donates billions.",
                        say="The next one costs billions.{0.35} Nobody donates billions.", ref="e1-a1-11-04", device=None,
                        delivery="holding a cloud bill that unrolls to the floor; cheerful, stating the physics",
                        note="[INVENTED · the Mar 11, 2019 post: \"We'll need to invest billions of dollars in upcoming years into large-scale cloud compute…\" ([P·arch])]"),
    "v35-a2-0003": dict(seg="act2", beat="v35-28.02", who="mas", text="so they don't donate. they invest.",
                        say="so they don't donate.{0.35} they invest.", ref="e1-a1-10-01", device=None, speed=0.92,
                        delivery="drawing the box as he says it; easy, a man who has already solved it", note="[INVENTED]"),
    "v35-a2-0004": dict(seg="act2", beat="v35-28.02", who="alyi", text="Capped at what?",
                        say="Capped at what?", ref="a5-30-01", device=None, speed=0.95,
                        delivery="quick, careful", note="[INVENTED]"),
    "v35-a2-0005": dict(seg="act2", beat="v35-28.02", who="mas", text="a hundred times.",
                        say="a hundred times.", ref="e1-a1-10-01", device=None, speed=0.92,
                        delivery="writing 100x", note="[P·arch · \"Returns for our first round of investors are capped at 100x their investment\" (Mar 11, 2019)]"),
    "v35-a2-0006": dict(seg="act2", beat="v35-28.02", who="alyi", text="And who's in charge?",
                        say="And who's in charge?", ref="a5-30-01", device=None, speed=0.95,
                        delivery="the question that matters to him", note="[INVENTED]"),
    "v35-a2-0007": dict(seg="act2", beat="v35-28.02", who="mas", text="the board.",
                        say="the board.", ref="e1-a1-10-01", device=None, speed=0.92,
                        delivery="tapping the top box; simple; no irony (we supply it)",
                        note="[P·arch · \"the company is controlled by OpenAI Nonprofit's board\" (Mar 11, 2019)]"),
    "v35-a2-0008": dict(seg="act2", beat="v35-28.03", who="mada", text="And you?",
                        say="And you?", ref="a5-25-06", device=None,
                        delivery="a considered beat after; dry", note="[INVENTED]"),
    "v35-a2-0009": dict(seg="act2", beat="v35-28.03", who="mas", text="nothing.",
                        say="nothing.", ref="e1-a1-10-01", device=None, speed=0.9,
                        delivery="drawing the stick figure; light, pleased with the design",
                        note="[his Senate answer (facts L22, [P]); the structure's public record]"),
    "v35-a2-0010": dict(seg="act2", beat="v35-28.03", who="mada", text="Good answer.",
                        say="Good answer.", ref="a5-25-06", device=None,
                        delivery="dry, approving; it rhymes with Act Four's \"Good question.\"", note="[INVENTED]"),
    "v35-a2-0011": dict(seg="act2", beat="v35-29.02", who="mas",
                        text="if we can comply, we will, and if we can't, we'll cease operating.",
                        say="if we can comply, we will,{0.3} and if we can't, we'll cease operating.",
                        ref="v32-a3-0001", device="pa",
                        delivery="at a lectern, pleasant, conversational; a threat said like a weather report",
                        note="[V · MAY 24, 2023 · University College London, as printed by TIME and Decrypt: \"If we can comply, we will, and if we can't, we'll cease operating…\"; lowercased · FACT: the proposal's hybrid (\"we will try to comply, and if…\") mixed TIME's and Reuters' reports; this is one outlet's exact words]"),
    # ---- ACT FOUR · sc 41, the war room (calls on the call chain; Mas in the room)
    "v35-a4-0001": dict(seg="act4", beat="v35-41.02", who="gerg", text="They took my chair. Told me after. So I quit.",
                        say="They took my chair.{0.35} Told me after.{0.4} So I quit.", ref="a5-29-18", device="call",
                        delivery="flat, the cheer gone; not angry, finished",
                        note="[INVENTED · he quit at 4:09 PM PT: \"…but based on today's news, i quit.\" (facts L5, [P]); removed as chair and told after the call (L7, [V])]"),
    "v35-a4-0002": dict(seg="act4", beat="v35-41.02", who="mas", text="you didn't have to.",
                        say="you didn't have to.", ref="e1-a1-10-01", device=None, speed=0.9,
                        delivery="quiet; his face doesn't move", note="[INVENTED]"),
    "v35-a4-0003": dict(seg="act4", beat="v35-41.02", who="gerg", text="Yeah. I did.",
                        say="Yeah. I did.", ref="a5-29-18", device="call",
                        delivery="simple, final; not a joke", note="[INVENTED]"),
    "v35-a4-0004": dict(seg="act4", beat="v35-41.03", who="tasya",
                        text="We found out a minute before the rest of the world, Mas. One minute.",
                        say=f"We found out a minute before the rest of the world, {M}.{{0.45}} One minute.", ref="v32-a1-0002", device="call", speed=0.85,
                        delivery="warm on top, cold under it; the smile stays",
                        note="[INVENTED · the reported minute (Axios, Nov 17, 2023, [H])]"),
    "v35-a4-0005": dict(seg="act4", beat="v35-41.03", who="mas", text="i got a few more.",
                        say="i got a few more.", ref="e1-a1-10-01", device=None, speed=0.9,
                        delivery="dry, level; true", note="[INVENTED · true to the public account: he was told on the noon call, and the post followed]"),
    "v35-a4-0006": dict(seg="act4", beat="v35-41.03", who="tasya", text="Then we should talk.",
                        say="Then we should talk.", ref="v32-a1-0002", device="call",
                        delivery="warmly; the offer arriving before it's an offer", note="[INVENTED]"),
    "v35-a4-0007": dict(seg="act4", beat="v35-41.04", who="auhsoj", text="—the tender's in trouble—",
                        say="the tender's in trouble,", ref="e1-a2-13-06", voice_slug="photographer", speaker="AUHSOJ",
                        device="call", speed=1.1,
                        delivery="overlapping, quick, an investor mid-sentence; a fragment",
                        note="[INVENTED · facts #53: Thrive's ~$86B tender in jeopardy [V] · AUHSOJ has no voice in the registry: a stock preset (the photographer's) doubles on the call chain for the Kokoro timing; the ElevenLabs pass casts him (never the real person's voice)]"),
    # ---- ACT FOUR · sc 47, Saturday night (SN 00000A, 2026-09-28: the phones' pressure is about his return): Neleh's
    # footnote-three line, re-recorded with its new first sentences at its natural length (it replaces a5-27-22)
    "v35-a4-0009": dict(seg="act4", beat="S4.02", who="neleh",
                        text="They all want him back. As if it wasn't allowed. It was. The charter, footnote three. I've read it four times tonight.",
                        say="They all want him back.{0.35} As if it wasn't allowed.{0.30} It was.{0.45} The charter, footnote three.{0.35} I've read it four times tonight.",
                        ref="a5-27-22", device=None,
                        delivery="After the phones' first buzz-and-step. Polite, a little tired: the first sentence plain (it's what the phones say), the second dry; then the footnote, as before. 'The charter' said clearly.",
                        note="[INVENTED · SN 00000A (2026-09-28): the phones' pressure is about bringing him back; the charter and its footnote stay the board's grounds]"),
}

# Reused takes under a new id (the same file; no new read): new id -> source id
REUSE = {
    "v35-a1-0010": "e1-a1-5-11",   # MAS "still a preview." (launch night's read, now the old joke at the window, sc 18)
}
# Cut from an existing take: new id -> (source id, first word, last word or None for the end, device or None)
CUT = {
    # TERB: the return announcement without "Before this goes out, I'm reading it once." (choice 12A), at the sentence
    # boundary; the agreement clause stays (it names Mada and sets up "you're staying?")
    "v35-a4-0008": ("v3-a4-0004", "We", None, None),
}
CUT_TEXT = {
    "v35-a4-0008": "We have reached an agreement in principle for Mas Manalt to return to NopeAI as CEO with a new initial board of Terb (Chair), the Other Yrral, and Mada.",
}
# Restored takes (earlier recordings, unchanged): id -> source lines file (the file the take row lives in)
RESTORE = {
    "e1-a1-9-09": "audio/ep01/act1/dialogue/lines-fast-v1.json",    # GERG "That's our model in your search engine…" (7A)
    "e1-a3-21-02": "audio/ep01/act3/dialogue/lines-fast-v2.json",   # THE COPY "And then the computers regulate themselves."
    "e1-a3-21-04": "audio/ep01/act3/dialogue/lines-fast-v2.json",   # NEDIB "When the hell did I say that?"
    "e1-a3-21-06": "audio/ep01/act3/dialogue/lines-fast-v2.json",   # MAS "which one's real?"
    "a5-27-29": "audio/ep01/act4/dialogue/lines-v5.json",           # NELEH "Then we'll write step four ourselves." (SN 00000A)
}

# fallback audible lengths until the takes exist (words at each voice's pace)
FALLBACK = {"v35-vo-01": 3.3, "v35-vo-02": 2.2, "v35-vo-03": 2.5, "v35-vo-04": 3.2,
            "v35-a1-0001": 2.6, "v35-a1-0002": 3.0, "v35-a1-0003": 2.7, "v35-a1-0004": 1.1, "v35-a1-0005": 3.8,
            "v35-a1-0006": 1.6, "v35-a1-0007": 3.9, "v35-a1-0008": 2.3, "v35-a1-0009": 1.0, "v35-a1-0010": 1.1,
            "v35-a1-0011": 4.6, "v35-a1-0012": 2.4, "v35-a2-0001": 2.3, "v35-a2-0002": 3.2, "v35-a2-0003": 2.2,
            "v35-a2-0004": 1.0, "v35-a2-0005": 1.1, "v35-a2-0006": 1.1, "v35-a2-0007": 0.8, "v35-a2-0008": 0.7,
            "v35-a2-0009": 0.7, "v35-a2-0010": 0.9, "v35-a2-0011": 3.9, "v35-a4-0001": 2.9, "v35-a4-0002": 1.2,
            "v35-a4-0003": 1.1, "v35-a4-0004": 4.1, "v35-a4-0005": 1.1, "v35-a4-0006": 1.2, "v35-a4-0007": 1.1,
            "v35-a4-0008": 8.3, "v35-a4-0009": 7.6}


def l(lid):
    """the planning length of any v3.5 line (new, reused, cut or restored)"""
    if lid in REUSE:
        return A(REUSE[lid])
    if lid in RESTORE:
        return A(lid)
    return L(lid, FALLBACK[lid])


def line(lid, after, gap=0.0, **kw):
    """a new, reused or cut v3.5 line, placed after a line id (with gap_s) or at start+S"""
    if lid in NEW_VO:
        seg, bid, text, say, delivery, kind, speed = NEW_VO[lid]
        e = {"id": lid, "who": "mas", "vo": True, "tag": "V.O.", "text": text, "delivery": delivery, "kind": kind,
             "take": "new (V.O.: am_michael · a-michael-close · vo-close, audio/ep01/v35)",
             "note": "[INVENTED · V.O. · draft 8.4]"}
    elif lid in NEW_LINES:
        d = NEW_LINES[lid]
        e = {"id": lid, "who": d["who"], "text": d["text"], "delivery": d["delivery"],
             "tag": d.get("device") or "", "note": d["note"],
             "take": f"new (the {d.get('speaker', d['who'].upper())} voice, ref {d['ref']}{', ' + d['device'] + ' chain' if d.get('device') else ''}; audio/ep01/v35)"}
    elif lid in REUSE:
        r = take_rows()[REUSE[lid]]
        e = {"id": lid, "who": "mas", "text": r["text"].lstrip("…"), "take": f"reuse {REUSE[lid]} (the same take file, {r['file']})",
             "note": "[INVENTED · the launch-night take, reused as the old joke]"}
    elif lid in CUT:
        src = CUT[lid][0]
        e = {"id": lid, "who": "terb", "text": CUT_TEXT[lid],
             "take": f"cut from {src} (from the word \"{CUT[lid][1]}\" to the end, at the sentence boundary; audio/ep01/v35)",
             "note": "[V · NOV 21, 2023 · the return announcement's first sentence, whole (facts L15, [P]); the lead-in \"Before this goes out, I'm reading it once.\" is cut (choice 12A)]"}
    else:
        raise KeyError(lid)
    e["after"] = after
    e["gap_s"] = gap
    e["len_s"] = l(lid)
    e.update(kw)
    return e


def restored(lid, after, gap=0.0, **kw):
    r = take_rows()[lid]
    e = {"id": lid, "who": {"GERG MOCKBRAN": "gerg", "DEEPFAKE NEDIB": "deepfake", "NEDIB": "nedib",
                            "MAS MANALT": "mas"}.get(r["speaker"], r["speaker"].lower()),
         "text": r["text"].strip('"'), "after": after, "gap_s": gap, "take": r["file"], "take_file": RESTORE[lid],
         "len_s": A(lid), "tag": r.get("device") or ""}
    e.update(kw)
    return e


def seq(head, items, tail):
    """a beat's planning length: head + each line's (gap before + length) + tail; items: (line id, gap before)"""
    return round(head + sum(g + l(i) for i, g in items) + tail, 2)


def tempo(pace, gaps=None, note=""):
    return {"pace": pace, "gaps": gaps or {}, "rule": {"quick": "others 0.15-0.35 s, Mas 0.4-0.5 s",
                                                       "normal": "0.4-0.6 s", "weighted": "longer, only on turns"}[pace],
            **({"note": note} if note else {})}


# ------------------------------------------------------------------------------------------------ scenes and modes
MODES = {  # proposal-v35's mode per scene
    1: "CONVERSATION", 2: "INSERT", 3: "QUICK-CUT", 4: "CONVERSATION", 5: "CONVERSATION", 6: "CONVERSATION → INSERT",
    7: "QUICK-CUT + DOCUMENT", 8: "CONVERSATION + INSERT", 9: "CONVERSATION (a call)", 10: "MONTAGE",
    11: "QUICK-CUT + CONVERSATION", 12: "INSERT + DOCUMENT", 13: "FLASHBACK · CONVERSATION", 14: "CONVERSATION",
    15: "CONVERSATION", 16: "QUICK-CUT", 17: "CONVERSATION", 18: "CONVERSATION", 19: "DOCUMENT", 20: "CONVERSATION",
    21: "QUICK-CUT (split)", 22: "INSERT", 23: "CONVERSATION", 24: "INSERT + DOCUMENT", 25: "CONVERSATION",
    26: "INSERT", 27: "CONVERSATION", 28: "FLASHBACK · CONVERSATION", 29: "MONTAGE + DOCUMENT",
    30: "MONTAGE → CONVERSATION", "30A": "QUICK-CUT", 31: "CONVERSATION + DOCUMENT", 32: "INSERT",
    "32A": "INSERT (wordless)",
    33: "CONVERSATION (a call)", 34: "DOCUMENT", 35: "QUICK-CUT (on the monitor)", 36: "CONVERSATION → DOCUMENT",
    37: "INSERT", 38: "INSERT", 39: "CONVERSATION (a call)", 40: "DOCUMENT", 41: "QUICK-CUT (calls)", 42: "INSERT",
    43: "INSERT → FLASHBACK", 44: "CONVERSATION + DOCUMENT", 45: "CONVERSATION", 46: "CONVERSATION",
    47: "CONVERSATION", 48: "INSERT + DOCUMENT", 49: "CONVERSATION", "49A": "INSERT (wordless)",
    50: "CONVERSATION (a call) + DOCUMENT", 51: "CONVERSATION", 52: "QUICK-CUT (tiles leaving)",
    53: "DOCUMENT → CONVERSATION", 54: "CONVERSATION", 55: "INSERT", 56: "CONVERSATION + DOCUMENT",
    57: "CONVERSATION", 58: "INSERT",
}
PACE = {  # proposal-v35's pace table
    **{s: "quick" for s in (4, 6, 7, 9, 14, 15, 17, 18, 20, 23, 27, 28, 29, "30A", 33, 41, 46, 47, 49, 50, 51, 54)},
    **{s: "weighted" for s in (5, 12, 13, 19, 39, 45, 55)},
}


def pace_of(sc):
    return PACE.get(sc, "normal")


def scene_of(seg, bid):
    """proposal-v35's scene number for a lock or new beat id"""
    b = bid.replace("v3-", "").replace("v31-", "").replace("v32-", "")
    if bid.startswith("v35-"):
        s = bid[4:].split(".")[0]
        return int(s) if s.isdigit() else s
    if seg == "coldopen":
        return int(b.split(".")[0])
    if seg == "act1":
        top = b.split(".")[0]
        sub = b.split(".")[1] if "." in b else ""
        if top == "5":
            if sub in ("09",):
                return 5
            if sub in ("10", "11", "12"):
                return 6
            return 4
        return {"6": 7, "7": 9 if bid == "v32-7.03" else 8, "8": 11, "9": 15 if b == "9.10" else (16 if sub in ("11", "12", "13") else 14),
                "10": 17, "11": 20 if b == "11.01" else 21, "12": 23 if sub in ("01", "02") else 24}[top]
    if seg == "act2":
        top = b.split(".")[0]
        sub = b.split(".")[1]
        return {"13": 25, "14": 26 if b == "14.01" else 27, "15": 27, "16": 29, "17": 30 if sub in ("01", "02") else "30A"}[top]
    if seg == "act3":
        top = b.split(".")[0]
        return {"18": 31, "19": 32, "20": 34 if b in ("20.07", "20.08") else 33, "21": 35, "22": 36, "23": 37}[top]
    if seg == "act4":
        k = {"S1.01": 38, "S1.01b": 38, "S1.02": 38, "S1.13": 40, "S3.00p": 44, "S1.03": 44, "S1.04": 44, "S1.05": 44,
             "S3.00a": 45, "S3.01": 45, "S3.02": 45, "S3.03": 45, "S4.01": 47, "S4.02": 47, "S4.07": 49, "S4.08": 47,
             "S5.00": 48, "S5.11": 51, "S5.12": 51}
        if b in k:
            return k[b]
        if b.startswith("S1."):
            return 39
        if b.startswith("S2."):
            return 43
        if b.startswith("S3."):
            return 46
        if b.startswith("S4."):
            return 49
        if b.startswith("S5."):
            return 50
        if b.startswith("S6."):
            return 52
        if b.startswith("S7."):
            return 53 if b in ("S7.01", "S7.02", "S7.02b") else 54
        if b.startswith("S8."):
            return 55 if b in ("S8.01", "S8.03", "S8.04", "S8.05") else 56
    if seg == "tag":
        return 57 if b.startswith("32") else 58
    raise KeyError(bid)


R = "after:{}+{}".format   # a kept line's retime: after <line id> + S
T35 = "art pass v3.5"


# ================================================================================================ THE CHANGES
CHANGES = {"coldopen": {}, "act1": {}, "act2": {}, "act3": {}, "act4": {}, "tag": {}}

# ------------------------------------------------------------------------------------------------ ACT ONE
A1 = CHANGES["act1"]
A1["5.03"] = dict(est_s=round(9.72 - 0.25, 2), retime={"e1-a1-5-03": R("e1-a1-5-02", 0.25)},
                  tempo=tempo("quick", {"e1-a1-5-03": 0.25}), fix=["PACE"],
                  why="Quick banter: Gerg answers Rima on her last word's tail (0.50 → 0.25 s).")
A1["5.04"] = dict(est_s=round(29.64 - 1.30, 2),
                  retime={"e1-a1-5-06": R("e1-a1-5-05", 0.25), "e1-a1-5-08": R("e1-a1-5-07", 0.25),
                          "e1-a1-5-09": "overlap:e1-a1-5-08-0.25"},
                  tempo=tempo("quick", {"e1-a1-5-06": 0.25, "e1-a1-5-08": 0.25, "e1-a1-5-09": -0.25},
                              "Gerg's \"That's a v2 problem.\" cuts in on Rima's last word (overlap 0.25 s): the scene's one overlap. Mas's own gaps unchanged (the V.O. and \"it's a preview.\" keep 0.5 / 0.8)."),
                  fix=["PACE"], why="The bargain plays quicker; Mas stays unhurried inside it.")
A1["5.10"] = dict(est_s=round(14.17 - 0.2, 2), retime={"e1-a1-5-20": R("e1-a1-5-19", 0.25)},
                  tempo=tempo("quick", {"e1-a1-5-20": 0.25}, "the typing (2.4 s) is business and stays"), fix=["PACE"])
A1["5.11"] = dict(est_s=round(8.16 - 0.15, 2), retime={"e1-a1-5-23": R("e1-a1-5-22", 0.25)},
                  tempo=tempo("quick", {"e1-a1-5-23": 0.25}), fix=["PACE"])
A1["5.12"] = dict(est_s=4.6, frame="2S → INSERT · the wait, then the bubble's counter ticks",
                  caption="The wait. The bubble's plate reads CHATGTP · USERS: 0. Gerg refreshes: one key, a beat, again, a beat, a third time. Rima, at the whiteboard, doesn't look; then does. Then the 0 ticks over, 1 · 2 · 7 · 104 · 1,389…, and the swing comes in on the first tick.",
                  onscreen={"retime": {"CHATGTP · USERS: 1 · 2 · 7 · 104 · 1,389…": 2.5}},
                  sounds=[{"name": "key_tap_soft_01", "at": 0.5}, {"name": "key_tap_soft_02", "at": 1.1}, {"name": "key_tap_soft_03", "at": 1.7}],
                  picture="Two-shot first (Gerg's three refreshes, Rima not looking then looking; the plate at USERS: 0), then the insert as before. The wait is 2 s of held breath; nothing else moves.",
                  tempo=tempo("weighted", note="the wait is the beat"), fix=["NEW", "TR"],
                  why="Sc 6 (new): the team waits for the first user. The counter's first tick lands after a held breath.")
A1["7.01"] = dict(est_s=round(10.56 - 0.2, 2), retime={"e1-a1-7-02": R("v31-a1-0003", 0.6)},
                  tempo=tempo("normal", {"e1-a1-7-02": 0.6}), fix=["PACE"])
A1["7.02"] = dict(style_leap={"tier": "drastic", "kind": "near-photoreal macro, objects only (no people, no hands)",
                              "at_s": 1.2, "len_s": 2.5,
                              "what": "the tear lands on the red-hot heatsink: water bead, hiss, steam, the INVIDIA logo on the shroud in real metal; then steps back into pixels on the steam's second puff",
                              "route": "the art pass makes it (video model or render); fallback: the BASE pixel shot as v3.4",
                              "why": "choice 9A: the one time his face moves, and the cost made physical; far from the hourglass; it carries Nesnej's plant"},
                  picture="The GPU the tear lands on carries INVIDIA's logo, legible (the first of two plants for sc 30A). The macro replaces 2.5 s of the shot; no added time.",
                  onscreen={"add": ["INVIDIA (the logo on the GPU shroud)"]}, fix=["C9", "NEW"],
                  why="Choice 9A: the tear on the heatsink as a 2–3 s near-photoreal macro of objects only; the INVIDIA plant.")
A1["v32-7.03"] = dict(est_s=round(9.0 - 0.4, 2),
                      retime={"v32-a1-0003": R("v32-a1-0002", 0.45), "v32-a1-0004": R("v32-a1-0003", 0.25)},
                      tempo=tempo("quick", {"v32-a1-0003": 0.45, "v32-a1-0004": 0.25}),
                      caption="Later that night. MAS at his end desk, the phone at his ear, TASYA · MACROSOFT on its lit screen. \"Mas.\" / \"it's the bill. we're going to need more servers.\" / \"I'll bring a pen.\" He lowers the phone. Before it reaches the desk it lights with a stranger's screenshot of a chat, then another, then dozens, popping up the screen.",
                      jcut=[{"sound": "the first weeks' driving pulse, under the screenshots' pops", "lead_s": 0.6}],
                      sounds_drop=["the siren's J-cut (moves to the end of the first weeks, v35-10.08)"],
                      picture="The exit: the phone lighting with strangers' screenshots (no faces, no names; prompts and answers only).",
                      fix=["PACE", "TR"], why="Its exit changes: people are posting what they do with it, which causes the first weeks.")
A1["8.01"] = dict(caption="Among the phones, his own, on the desk: ELGOOG · CODE RED, lit red, the siren whining through its small speaker. His thumb opens it, and the app zooms to full-bleed.",
                  fix=["TR"], why="The code red now arrives out of the first weeks (sc 10's last cut).")
A1["8.06"] = dict(caption="Over Mas's shoulder: the siren on the phone in his hand. He locks it, and the red goes. He turns back to his laptop: 3 AM, the feed still pouring.",
                  lcut=[{"sound": "the siren's tail becomes the bullpen's fans", "over_s": 0.8}],
                  sounds_drop=["the NopeAI lobby's revolving door pre-lap (moves to the end of the 2018 flashback)"],
                  fix=["TR"], why="The exit changes: he turns back to the feed at 3 AM (sc 12).")
A1["9.01"] = dict(caption="MATCH, from 2018: MAS walks into the NopeAI lobby in January with the same glass, and crosses to the desk. Through the glass doors comes a novelty check, enormous, and it jams in the revolving door: MACROSOFT · \"multiyear, multibillion dollar\" · $ MULTIBILLION.",
                  fix=["TR"], why="The 2018 flashback's exit lands here: the same glass, the same walk.")
A1["9.06"] = dict(est_s=round(7.12 - 0.15, 2), retime={"e1-a1-9-03": R("e1-a1-9-02", 0.25)},
                  tempo=tempo("quick", {"e1-a1-9-03": 0.25}, "Gerg's entrance (1.2 s) is business and stays"), fix=["PACE"])
A1["9.09"] = dict(est_s=round(20.98 + l("v35-a1-0008"), 2),
                  add=[line("v35-a1-0008", "v31-a1-0005", 0.35)],
                  retime={"v31-a1-0005": R("e1-a1-9-05", 0.25), "e1-a1-9-07": R("v35-a1-0008", 0.45),
                          "e1-a1-9-08": R("e1-a1-9-07", 0.25)},
                  tempo=tempo("quick", {"v31-a1-0005": 0.25, "v35-a1-0008": 0.35, "e1-a1-9-07": 0.45, "e1-a1-9-08": 0.25},
                              "his hold after \"it does.\" (1.2 s) stays: it's his"),
                  fix=["NEW", "PACE"], why="One Tasya line: the deal wants his model in everything Macrosoft makes. \"that's a lot of servers.\" now answers both.")
A1["9.10"] = dict(est_s=round(9.99 - 2.18 - 0.35 + A("e1-a1-9-09"), 2),
                  drop={"v32-a1-0005": "C7: Gerg's earlier recording comes back"},
                  restore=[restored("e1-a1-9-09", "start+2.6", 0.0,
                                    note="[INVENTED · choice 7A: his earlier recording restored (v3–v3.1) · the new GNIB ran on the lab's model (facts #8; Macrosoft's Feb 7 post: \"running on a new, next-generation OpenAI large language model\", [P])]")],
                  retime={"e1-a1-9-10": R("e1-a1-9-09", 0.25)},
                  onscreen={"replace": {"TV: MACROSOFT UNVEILS THE NEW GNIB": "TV: THE NEW GNIB · POWERED BY NOPEAI"}},
                  tempo=tempo("quick", {"e1-a1-9-10": 0.25}),
                  picture="The TV chyron reads THE NEW GNIB · POWERED BY NOPEAI; the chat bubble in GNIB's search box has CHATGTP's two-dot face in GNIB's colours.",
                  fix=["C7", "FACT", "PACE"],
                  why="Gerg says it plainly: their model in the landlord's search engine, aimed at Elgoog. Tasya's \"made them dance\" answers him.")
A1["v31-10.02"] = dict(est_s=round(18.5 - 0.75, 2),
                       retime={"e1-a1-10-01": R("e1-a1-10-06", 0.45), "e1-a1-10-02": R("e1-a1-10-01", 0.25),
                               "e1-a1-10-03": R("e1-a1-10-02", 0.45)},
                       tempo=tempo("quick", {"e1-a1-10-01": 0.45, "e1-a1-10-02": 0.25, "e1-a1-10-03": 0.45}), fix=["PACE"])
A1["v31-10.04"] = dict(caption="The timer dings. The bubble blinks blank, brightens as new: \"Hi!\" Gerg looks down at his own laptop, where the same two-dot face sits, and quietly closes it. HOLD on the closed lid.",
                       jcut=[{"sound": "the egg timer's tick becomes the marker's squeak on the bullpen window (sc 18)", "lead_s": 0.6}],
                       sounds_drop=["the Build's chip line J-cut (moves to the vision post's Publish click)"],
                       fix=["TR"], why="The exit changes: that evening, Gerg takes a marker to the window.")
A1["11.01"] = dict(est_s=round(8.79 - 0.15, 2), retime={"e1-a1-11-05": R("e1-a1-11-04", 0.45)},
                   caption="MATCH: Mas's lid closed on the vision post; a week later it opens as Gerg's laptop, in the same place in frame, on a message-board thread: a crate stencilled ATEM · MODEL WEIGHTS · RESEARCHERS ONLY, tipped open, spilling files; the thread's own date 03/03/23.",
                   onscreen={"drop": ["RAIL: MAR 14, 2023", "GTP-4"], "add": ["RAIL: MAR 3, 2023"]},
                   tempo=tempo("quick", {"e1-a1-11-05": 0.45}),
                   picture="The GTP-4 banner isn't up yet (it comes with the split, 11.03). Mas at his end desk behind the laptop.",
                   fix=["TR", "PACE"], why="Sc 20 is now a response: a week after Atem gave its model to researchers, the whole thing is loose.")
A1["11.03"] = dict(est_s=round(13.59 + 0.4 + l("v35-a1-0011"), 2),
                   add=[line("v35-a1-0011", "e1-a1-11-01", 0.4)],
                   onscreen={"add": ["RAIL: MAR 14, 2023"]},
                   style_leap_optional={"kind": "3D claymation insert (Blender), CLOD only, inside the right pane",
                                        "where": "the right pane's CLOD, from 11.03's start through 11.04's \"You're absolutely right!\"",
                                        "fallback": "BASE pixel CLOD as in v3.4 (a terracotta clay figure drawn in pixels)",
                                        "rule": "fitted to the pane's existing frames: the timing is identical either way; Mario stays pixel; the left pane stays pixel",
                                        "status": "the Blender test decides (PLAN §8)"},
                   picture="RIGHT: Mario dictates both points to CLOD, finger up. LEFT: the bullpen demo waits; Gerg photographs the napkin. The rail rolls MAR 3 → MAR 14 on the split.",
                   tempo=tempo("normal", {"v35-a1-0011": 0.4}), fix=["C3", "NEW"],
                   why="Choice 3A: Mario's second point, the reason he builds at all. Then his own bot launches the same day.")
A1["11.04"] = dict(est_s=round(8.5 + 2.0, 2),
                   caption="PHRASE 2. RIGHT: CLOD, mid-bow, launching: \"You're absolutely right!\" Mario looks up at the split line: the same day. \"Addendum.\" LEFT: Mas's finger on his beige button, click; the napkin swaps into a working website in two drawings; a card pops over the website, SIMULATED BAR EXAM · TOP 10%; in the bullpen glass, Alyi's reflection leans in toward the website. On the click, the window's users line behind them jumps, and Gerg extends it again.",
                   onscreen={"add": ["SIMULATED BAR EXAM · TOP 10%"]},
                   jcut=[{"sound": "a velvet rope's snap on the bullpen's wall TV (sc 22)", "lead_s": 0.4}],
                   sounds_drop=["the pause letter's toast pop J-cut (moves to the end of sc 22)"],
                   picture="LEFT pane adds: the bar-exam card (a clean result card, [P]); Alyi's reflection in the conference-room glass leaning in (his awe, before his distance at sc 24); the users line on the window behind jumping and Gerg's marker extending it.",
                   fix=["NEW", "FACT", "TR"],
                   why="The leap made legible (the bar exam), Alyi's awe, and the line on the window jumping: the team's lead, in picture.")
A1["12.01"] = dict(caption="Over Mas's shoulder at his desk: his monitor lights with a letter's header, PAUSE GIANT AI EXPERIMENTS; its toast popped a beat early, over the waitlist. The screen pushes to full-bleed, and the letter becomes a clipboard gliding onto a standing desk in the dark. 6 MONTHS · PAUSES RECEIVED: 0.",
                   fix=["TR"], why="The toast now leads out of the waitlist (sc 22).")
A1["12.02"] = dict(est_s=round(7.45 - 2.52 + l("v35-a1-0012") - 0.25, 2),
                   drop={"v32-a1-0007": "C4: the iron becomes the stamp"},
                   add=[line("v35-a1-0012", "e1-a1-12-01", 2.05, note_gap="the read floor's gap before Oigneb stays (PLAN_PATCH, lock-v32)")],
                   retime={"e1-a1-12-03": R("v35-a1-0012", 0.25)},
                   caption="NOLE takes the clipboard and signs it with a flourish of his left hand. With his right, not looking, he stamps a stack of papers under the desk, ZAI CORP. · ARTICLES OF INCORPORATION · NEVADA: FILED, FILED. In the background OIGNEB holds up a PAUSE sign. Nobody pauses.",
                   onscreen={"add": ["ZAI CORP. · ARTICLES OF INCORPORATION · NEVADA", "FILED"]},
                   sounds=[{"name": "rubber_stamp_C", "at": 0.9}, {"name": "rubber_stamp_C", "at": 2.1}],
                   sounds_drop=["the solder's sparks"],
                   picture="Nole's right hand stamps FILED on the papers (two stamps, one a beat), in frame with his signing hand: two hands, one frame. No date on the papers. Plate stays NOLE · BUILDING HIS OWN.",
                   tempo=tempo("quick", {"e1-a1-12-03": 0.25}),
                   fix=["C4", "FACT", "PACE"],
                   why="Choice 4A: he signs a pause with one hand and files his own company with the other (X.AI Corp., Nevada, Mar 9, 2023: facts #62 [H]; the papers carry no day).")

# ------------------------------------------------------------------------------------------------ ACT TWO
A2 = CHANGES["act2"]
A2["13.12"] = dict(onscreen={"add": ["DEEPFAKES OF ME: SEEN 0"]}, fix=["REST"],
                   why="Nedib's card gets its stat back; sc 35's deepfake pays it (SEEN 1).")
A2["13.13"] = dict(onscreen={"add": ["DEEPFAKES OF ME: SEEN 0"]}, fix=["REST"],
                   why="The card rides into 13.13 with its stat, as in v3.3.")
A2["14.01"] = dict(est_s=6.0,
                   caption="The match cut: the print in his hand becomes his phone at the dark bullpen window, his glass on the sill. His feed opens on CLASS PHOTO #1, hearts under it. A reminder slides over it, a generic calendar card: SENATE JUDICIARY · MAY 16 · TESTIFY. He takes the folded sheet from his pocket, PLEASE REG—, looks at it, and puts it back. Beyond the glass, the cold open's skyline, the one lit window.",
                   onscreen={"add": ["SENATE JUDICIARY · MAY 16 · TESTIFY", "PLEASE REG—"]},
                   jcut=[{"sound": "a gavel's knock, under the last half second (the next scene's)", "lead_s": 0.5}],
                   picture="The reminder is a generic calendar UI (the cold open's), no seal. The sheet is the one from 12.06, folded twice.",
                   fix=["NEW", "TR"], why="Sc 26: he's going to the Senate, and he's taking the sheet.")
A2["14.06"] = dict(action="cut", est_s=0.0, fix=["CLONE"], why="The cloned voice over black is cut (the Senate's fake, SN 00000).")
A2["15.01"] = dict(action="cut", est_s=0.0, fix=["CLONE"], why="The voice finds a mouth: the clone, cut.")
A2["15.02"] = dict(action="cut", est_s=0.0, fix=["CLONE"],
                   why="\"That voice was not mine. The words were not mine.\" is cut with the clone. The hearing room's wide and the chairman's plate move (v35-27.00, 15.06).")
A2["15.03"] = dict(action="cut", est_s=0.0, fix=["CLONE"], why="The chairman and the clone: cut.")
A2["15.05"] = dict(est_s=round(7.08 - 0.2, 2), retime={"e1-a2-15-05": R("e1-a2-15-04", 0.25)},
                   tempo=tempo("quick", {"e1-a2-15-05": 0.25}), fix=["PACE"])
A2["15.06"] = dict(onscreen={"add": ["LAHTNEMULB · CHAIRMAN"]},
                   caption="LAHTNEMULB, reading from a card, alone at the dais's centre (no clone at his left hand).",
                   fix=["CLONE"], why="His plate moves here from the cut 15.02.")
A2["15.07"] = dict(caption="From behind Mas onto the dais: the chairman with his cards. \"gtp-4 and other systems like it are good at doing tasks, not jobs.\" On the line's last word the chairman reaches for his next card. (The clone's card-taking business is cut.)",
                   fix=["CLONE"])
A2["15.11"] = dict(est_s=round(8.4 - 0.5, 2),
                   retime={"e1-a2-15-11": R("v32-a2-0002", 0.45), "e1-a2-15-12": R("e1-a2-15-11", 0.25)},
                   tempo=tempo("quick", {"e1-a2-15-11": 0.45, "e1-a2-15-12": 0.25}), fix=["PACE"])
A2["15.13"] = dict(est_s=seq(1.0, [("v35-a2-0001", 0.0)], 1.0),
                   drop={"e1-a2-15-13": "CLONE: the clone's \"Health insurance.\" is cut; the words go back to Mas, as on the record"},
                   add=[line("v35-a2-0001", "start+1.0", 0.0)],
                   caption="Mas holds the open wallet up toward the dais, the one card showing: \"i get paid enough for health insurance.\" The gallery gasps: one held drawing, all at once.",
                   sounds=[{"name": "synth:gasp", "at": "after:v35-a2-0001+0.1"}],
                   fix=["CLONE", "NEW"], why="His own words at the hearing, lowercased (facts L22).")
A2["15.14"] = dict(caption="MAS and SUCRAM. \"That proves nothing. Partially.\" / \"i have no equity in nopeai.\" A held beat. His hand sets the wallet down on the table.",
                   jcut=[{"sound": "a marker's squeak and an old office fan, under \"equity\" (2019)", "lead_s": 0.8}],
                   sounds_drop=["the tour's first stamp thunk (moves to the gavel at the end of sc 28)"],
                   picture="The out: his hand sets the wallet on the table (the object for the 2019 match).",
                   fix=["TR"], why="The senator's disbelief sends him back to the night he chose it: sc 28.")
A2["15.16"] = dict(caption="The dais (a match on action): the sheet comes in from frame left into the chairman's waiting hand. The senators lean in at once, delighted.",
                   fix=["CLONE"])
A2["16.01"] = dict(action="cut", est_s=0.0, fix=["NEW"],
                   why="The tour poster is rebuilt as sc 29 (v35-29.01–05): the stamps, the lectern, NOTERB's post, his post.")
A2["17.01"] = dict(est_s=6.5,
                   frame="MONTAGE → WIDE · many desks, then the rooftop signing table",
                   caption="The one sentence types across the top, held to read: \"Mitigating the risk of extinction from AI should be a global priority…\" Pens on many desks sign it in quick swaps, and the names scroll up the sheet: MAS MANALT · MARIO · SIMED · NOTNIH · OIGNEB · + HUNDREDS MORE. The last table is a long table on a rooftop under a perfect blue sky, where MAS and MARIO sign side by side.",
                   onscreen={"add": ["MAS MANALT · MARIO · SIMED · NOTNIH · OIGNEB", "+ HUNDREDS MORE"]},
                   picture="The signatures as a scroll of names in the statement's own list style; signers are hands and pens (SIMED's chess piece, NOTNIH's Godfather lighting as before, both unplated). The rooftop at the end.",
                   fix=["FACT", "TR"],
                   why="Sc 30: the people racing to build it sign one sentence. The signers are checked against the statement's own page; the count is shown as \"hundreds\".")
A2["17.10"] = dict(caption="Every signer's pen at the table is now, somehow, a purchase order: PURCHASE ORDER · AI CHIPS · QTY: MORE on each, Mario's in the foreground (his fleece cuff, the footnote still wet under it). Mas's hand stays half out beside them, empty.",
                   picture="Several hands, each with an order; Mario's nearest. Mas's hand empty (v3.3 P7's ruling holds: on the record his compute came through the landlord).",
                   fix=["NEW"], why="Sc 30A: the ones who warned are the ones buying.")
A2["17.07"] = dict(sounds=[{"name": "synth:bell", "at": 0.62, "gain": -18, "dur": 16.2,
                            "note": "the register's bell decays across the racks (v35-30A) to 17.13's black, as before"}],
                   picture="unchanged (v3.4)", fix=["TR"], why="SN 00000A: the racks add 5.0 s before the act-out; the bell's decay is lengthened so it still reaches the black.")

# ------------------------------------------------------------------------------------------------ ACT THREE
A3 = CHANGES["act3"]
A3["20.01"] = dict(sounds=[{"name": "glass_set_stone", "at": 0.05, "gain": -28,
                            "note": "his glass set down on the desk: the party's glass lands at home (the match)"}],
                   picture="v3.5b: his glass on the desk in the near foreground, where the party's glass was in frame (v35-32A.03's out: a matched object); set down on the cut.",
                   fix=["TR"], why="SN 00000A: the party (sc 32A) now comes before the post; its glass lands here.")
A3["20.06"] = dict(est_s=round(12.48 - 0.55, 2),
                   retime={"e1-a3-20-06": R("v31-a3-0002", 0.45), "e1-a3-20-08": R("e1-a3-20-07", 0.45)},
                   tempo=tempo("quick", {"e1-a3-20-06": 0.45, "e1-a3-20-08": 0.45}), fix=["PACE"])
A3["21.02"] = dict(est_s=10.6,
                   restore=[restored("e1-a3-21-02", "e1-a3-21-01", 0.35,
                                     note="[INVENTED · the fake's line; restored from v3.3 (SN 00000: \"i also liked the deepfake with the president. don't remove that.\")]")],
                   caption="The signing desk on the monitor: NEDIB, pen raised, over an order that runs off both ends of a very big desk. \"Here's the deal, folks…\" One cut-paper copy of him pops up beside him (scissor edges, glossier, tie a shade wrong) and finishes his sentence: \"And then the computers regulate themselves.\"",
                   sounds=[{"name": "tower_pop", "at": "before:e1-a3-21-02-0.3", "gain": -16}],
                   fix=["REST"], why="The president's deepfake, restored as in v3.3: one copy (the second copy stays un-drawn).")
A3["21.05"] = dict(caption="The real NEDIB signs, in ink. The copy claps, and keeps clapping.", fix=["REST"])
A3["v32-21.06"] = dict(caption="The copy is still clapping on the monitor. Mas reaches over and switches the monitor off. The glass goes black, and the clapping doesn't stop: it grows, and it's a hall's applause.",
                       fix=["REST"])
A3["22.01"] = dict(est_s=round(14.32 + 3.0, 2),
                   retime={"v34-vo-06": "start+4.8"},
                   tempo=tempo("normal", note="the V.O. waits one beat after the date and the counter have been read (the counter lands at 4.37 s)"),
                   fix=["C2", "TR"],
                   why="\"a year ago, forty users and a nice thread.\" now comes one beat after the rail and the counter are read (the proposal's timing change), so the number lands first.")

# ------------------------------------------------------------------------------------------------ ACT FOUR
A4 = CHANGES["act4"]
A4["v32-S1.13"] = dict(est_s=8.0,
                       caption="His phone in his hand, the suite's afternoon light on it. His thumb types the first sentence, unhurried: i loved my time at nopeai. It stops. He deletes it, letter by letter. Then he types it again, the same, and goes on. The post goes up in its own UI, its card's time 1:46 PM. Before the card fades, the phone lights, and doesn't stop.",
                       onscreen={"add": ["i loved my time at nopeai.", "1:46 PM"]},
                       jcut=[{"sound": "the war room's driving pulse starts under the lighting phone", "lead_s": 0.6}],
                       picture="The one crack: the deleting, letter by letter (a 1-px cursor eating the line). No face; the thumb only.",
                       fix=["NEW", "TR"], why="Sc 40: typed twice. It costs him something; nothing on his face says so.")
A4["S2.01"] = dict(onscreen={"replace": {"RAIL: NOV 17 · NIGHT": "RAIL: NOV 18 · NIGHT"}},
                   caption="Home. The desk under the cyan key, close: the two faint marks. The pen he wrote TERMS with on the plane (the MACROSOFT check's pen) carves a third mark beside them, one stroke a beat. \"i don't keep score.\"",
                   jcut=[{"sound": "the plane's hum becomes the dark room's drone", "lead_s": 0.6}],
                   fix=["TR"], why="The carve now follows the flight home (Nov 18).")
A4["S2.02"] = dict(est_s=2.0,
                   caption="The three marks from above, his thumb on mark 3. The Orb's cyan eye-light is a spot on the wood; it steps onto mark 1.",
                   picture="The eye-light stops on mark 1; a VHS tracking wipe starts from it into TPOOL.",
                   fix=["C5", "TR"], why="The marks take us back: the first mark opens TPOOL.")
A4["S2.05"] = dict(est_s=3.0,
                   caption="Back on the desk: the eye-light steps onto mark 3 and his thumb. THE ORB's iris, full frame, lifts from his thumb to his face. Toast: rewinding…, and a WHIP, right to left, onto a desk earlier that Friday.",
                   fix=["C5", "TR"], why="The Orb counts the marks, then rewinds to the board's side.")
A4["v31-S3.00p"] = dict(est_s=5.6,
                        caption="The whip lands on her desk from above: her laptop's call open at 11:52, Mada's tile joined early. Beside the laptop, THE PLAN's blueprint, and two printed pages she squares twice before noon: his million post (Dec 4, 2022) and her own paper, page 30. NELEH leans over the blueprint. \"Once more, before the others join.\"",
                        onscreen={"add": ["CHATGTP launched on wednesday. today it crossed 1 million users!", "…frantic corner-cutting…"]},
                        picture="The two props legible for a beat each: the post card (his, Dec 4, [P]) and page 30 (her paper, [P]). She squares them twice: nervous. A feeling of why, never an answer.",
                        fix=["NEW"], why="Sc 44: the desk's props (SN 0000's \"why he was fired\", felt as a question; Ep2's podcast is the answer).")
A4["S1.03"] = dict(est_s=round(11.75 - 1.55 - 0.9, 2),
                   drop={"a5-25-01": "the proposal's sc 44: the blueprint's three outlines walking off carry it"},
                   retime={"a5-25-02": "start+1.4"},
                   caption="THE SHEET: HOW TO FIRE A CEO over nine chair outlines. Three outlines stand up on small legs and walk off the grid on the waltz (DIRE, NOVIHS, DRUH), with no line. \"Leave out Mas and Gerg, and the four of us are a majority.\" \"This board controls the company. Not the other way round.\"",
                   fix=["NEW"], why="\"Three of us stepped down this year.\" is cut; the picture says it.")
A4["S3.00a"] = dict(est_s=round(15.2 - 1.0, 2),
                    tempo=tempo("weighted", note="the join's pre-roll 1.0 s tighter (the 11:59 wait); every line and the held beat after \"Do you have any questions?\" stay"),
                    fix=["C12"], why="12A: the replay of noon, tighter at its head only; Alyi's sentence stays whole (heard once per side).")
A4["S3.01"] = dict(est_s=2.6,
                   onscreen={"drop": ["ALYI removed MAS MANALT from the meeting."]},
                   caption="The same Remove, from their side: in Alyi's tile his reflection's hand moves, once, a click. Mas's tile goes; the four close the gap; a small lit chip stays, MAS MANALT · audio, and tinny, out of it: \"super.\"",
                   fix=["C12"], why="12A: the removal notice goes; \"super.\" through their laptop stays (the told-twice payoff).")
A4["S3.02"] = dict(action="cut", est_s=0.0, fix=["C12"],
                   why="12A: the overhead of her desk and its tick go; step 4's blank is on the table on Saturday (S4.02) and in her look (S4.07, moved).")
A4["S3.03"] = dict(est_s=5.5,
                   drop={"a5-27-08": "12A: \"Any objections?\" goes"},
                   caption="Her laptop: the NopeAI blog in its own UI, the post whole on the page, held to read its two sentences: \"…he was not consistently candid in his communications with the board… The board no longer has confidence in his ability to continue leading NopeAI.\" She clicks Post, on a tick.",
                   fix=["C12"], why="12A: a shorter hold (5.5 s reads both sentences).")
A4["S3.04"] = dict(est_s=round(10.83 - 0.95, 2),
                   retime={"a5-27-13": R("v32-a4-0001", 0.25), "a5-27-14": R("a5-27-13", 0.25), "a5-27-15": R("a5-27-14", 0.25)},
                   tempo=tempo("quick", {"a5-27-13": 0.25, "a5-27-14": 0.25, "a5-27-15": 0.25}), fix=["PACE"])
A4["S3.04b"] = dict(est_s=round(3.26 - 0.25, 2), retime={"v31-a4-0003": R("a5-27-16", 0.25)},
                    jcut=[{"sound": "the all-hands crowd's hush (no line: the line waits a beat, S3.06)", "lead_s": 0.6}],
                    tempo=tempo("quick", {"v31-a4-0003": 0.25}), fix=["PACE", "TR"])
A4["S3.06"] = dict(est_s=round(2.36 + 0.6 + 1.0, 2),
                   retime={"a5-27-18": "start+1.0"},
                   caption="The all-hands, from the back of the crowd: over the tiled heads, ALYI in the doorway. One beat of silence: the staff's shock, held on their backs and one turned face. Then one tiled employee on her feet: \"Is this a coup? Because it looks like one.\"",
                   picture="The staff's beat: one second, nobody moves, the hush. Then her hand goes up with the line.",
                   fix=["NEW", "TR"], why="Sc 46: the staff's shock, one beat of silence, before the question.")
A4["S3.05"] = dict(est_s=5.5,
                   drop={"a5-27-20": "C6: \"Nobody asked him to go…\" is cut; the war room already tells it"},
                   retime={"a5-27-21": "start+2.2"},
                   caption="Her laptop, evening: Gerg's post arrives as the call's own notification, …i quit., and keycaps rain across the grid. Alyi, in his tile, looking at his own doorway: \"Gerg has never waited to be asked.\"",
                   fix=["C6", "KEEP"], why="Choice 6A: Alyi's line stays (the ledger's keep list), alone.")
A4["S4.01"] = dict(action="cut", est_s=0.0, fix=["C12"],
                   why="12A: the eulogy post card and the wall screen go.")
A4["S4.02"] = dict(est_s=seq(1.25, [("v35-a4-0009", 0.0), ("a5-27-29", 0.73)], 1.3),
                   drop={"a5-27-23": "12A: \"What they actually want to know…\" goes",
                         "a5-27-22": "SN 00000A: re-recorded as v35-a4-0009 (\"They all want him back…\"), at its natural length"},
                   add=[line("v35-a4-0009", "start+1.25")],
                   restore=[restored("a5-27-29", "v35-a4-0009", 0.73,
                                     note="[INVENTED · the v3.4 line, restored (SN 00000A: \"yes i want to restore it\"): step four's payoff; its v3.4 takes, Kokoro and EL, reused]")],
                   onscreen={"add": ["RAIL: NOV 18"]},
                   sounds=[{"name": "BUZZ", "at": 0.288, "gain": -24},
                           {"name": "BUZZ", "at": "after:v35-a4-0009+0.172", "gain": -26},
                           {"name": "landing_thunk", "at": "after:v35-a4-0009+0.48", "gain": -22,
                            "note": "the clack: the first phone goes over after her line; nobody picks it up"},
                           {"name": "marker_uncap", "at": "after:a5-27-29+0.12", "gain": -30, "note": "her marker, uncapped"},
                           {"name": "marker_write_q", "at": "after:a5-27-29+0.35", "gain": -28,
                            "note": "she writes 4. MARIO on step four's blank line as she dials (the tones pre-lap S4.08)"}],
                   caption="The boardroom at night, the blueprint on the table: steps 1–3 ticked, step 4 a blank line. Four phones buzz and step toward the edge: STAFF · STAFF · INVESTORS · STAFF. NELEH, with a marker: \"They all want him back. As if it wasn't allowed. It was. The charter, footnote three. I've read it four times tonight.\" The first phone goes over the edge: clack. Nobody picks it up. NELEH: \"Then we'll write step four ourselves.\" She uncaps the marker and writes 4. MARIO on the blank line as she reaches for the speakerphone.",
                   picture="Step 4's blank line visible on the table. v3.5b: after the restored line she writes 4. MARIO on it in the marker's hand (from the line's end + 0.35 s to the cut), reaching for the speakerphone with the other hand; it's the line Adelina's \"no\" strikes through (S4.08) and Neleh looks at on Sunday (S4.07). The push to her MCU stays dropped.",
                   tempo=tempo("quick", {"a5-27-29": 0.73}, "the phone's fall is the beat between her two lines: the restored line 0.25 s after the clack"),
                   fix=["C12", "TR"], why="SN 00000A: the pressure is about his return (the re-recorded line), and step four's payoff is restored: they try to replace him, and 4. MARIO goes on the blueprint; the rail moves here from the cut S4.01.")
A4["S4.07"] = dict(est_s=3.0,
                   drop={"a5-27-29": "12A: \"Then we'll write step four ourselves.\" goes from here; SN 00000A restores it in S4.02; her look stays"},
                   caption="NELEH, the boardroom stepping down behind her, the slate door still open behind the table. She looks at step 4 on the blueprint: 4. MARIO, struck through. It isn't a joke: her real face. (Face light, one step.)",
                   picture="Moved here: after Tasya's statement. v3.5b: her look lands on the crossed-out line (4. MARIO, struck through after Adelina's \"no\"). No speakerphone, no dial.",
                   fix=["C12", "KEEP"], why="Neleh's look at step four (the keep list), moved to after the statement; it replaces \"Step four, Mada?\" (still cut) and bridges to Alyi alone.")
A4["S4.08"] = dict(est_s=round(18.79 - 0.35 - 0.5 - 0.5, 2),
                   retime={"a5-27-31": R("v31-a4-0017", 0.25)},
                   sounds=[{"name": "marker_write_q", "at": "after:a5-27-32+0.35", "gain": -30, "dur": 0.4,
                            "note": "LEFT pane: after Adelina's \"no\", Neleh strikes 4. MARIO through (one stroke, under the dial tone)"}],
                   caption="The meanwhile split: LEFT, the speakerphone, NELEH and MADA leaning in, four dial tones pre-lapped under the cut; RIGHT, the lighthouse, MARIO picks up the phone with a small throne on it. \"Mario, it's Neleh…\" / \"Eleven pages…\" / ADELINA: \"In plain English: no.\" Click. The dial tone, briefly. On the left, Neleh strikes 4. MARIO through.",
                   tempo=tempo("quick", {"a5-27-31": 0.25}, "Adelina's overlap stays"), fix=["PACE", "C12"])
A4["S4.09"] = dict(est_s=round(11.34 - 0.7 - 0.4, 2),
                   retime={"v31-a4-0005": "start+0.8", "a5-27-36": R("v31-a4-0005", 0.25), "a5-27-37": R("a5-27-36", 0.25)},
                   tempo=tempo("quick", {"a5-27-36": 0.25, "a5-27-37": 0.25}, "head 1.2 → 0.8 s (12A: shorter holds)"), fix=["PACE", "C12"])
A4["S4.10"] = dict(action="cut", est_s=0.0, fix=["C12"],
                   why="12A: \"the boardroom, now night\" goes; Ttemme's card and CHAT: LIVE plate move to S4.10b's head.")
A4["S4.10b"] = dict(est_s=round(15.2 - 0.95 + 0.8 - 1.0, 2),
                    onscreen={"add": ["TTEMME / INTERIM CEO, TAKE TWO · CHAT: LIVE", "RIMA TAMURI · CTO"]},
                    retime={"a5-27-38": "start+0.8", "a5-27-39": R("a5-27-38", 0.25), "a5-27-40": R("a5-27-39", 0.25),
                            "a5-27-41": R("a5-27-40", 0.25)},
                    caption="The spotlight swings off Rima's tile on the wall (its label steps back to RIMA TAMURI · CTO) onto TTEMME in the CEO chair, hoodie and headset, his stream's CHAT: LIVE panel at his elbow; the card rides the landing. \"Ttemme, we'd like you to serve as interim CEO.\" / \"You already have an interim CEO.\" / \"We'd like a different one.\" / \"Fine. But before I say yes, I need to know why you fired him.\" The sealed folder; he turns the page toward us: its back is blank (the business 1.0 s tighter).",
                    tempo=tempo("quick", {"a5-27-39": 0.25, "a5-27-40": 0.25, "a5-27-41": 0.25}),
                    fix=["C12", "KEEP", "PACE"], why="12A: Ttemme, \"We'd like a different one.\" and the blank page stay; his card and CHAT: LIVE plate move here from the cut S4.10.")
A4["S4.11"] = dict(onscreen={"drop": ["LIVE · CHAT:  F  F  F  F"]},
                   caption="Desk level: Ttemme sets the hourglass down and flips it; the sand starts, one pixel a beat. His chat panel beside it, LIVE, quiet.",
                   fix=["C12", "KEEP"], why="12A: the hourglass turning stays (Tuesday's fixed-length hourglass needs it); the F F F F chat goes.")
A4["S4.12"] = dict(action="merge", into="S4.13", fix=["C12"],
                   why="12A: its reaction hold goes; the slate step, the new door and the rail NOV 19 · ~11:53 PM PT open S4.13.")
A4["S4.13"] = dict(est_s=6.25,
                   retime={"a5-27-44": "start+2.4", "v3-a4-0001": R("a5-27-44", 0.35)},
                   caption="The boardroom wall steps one palette step to MACROSOFT slate; a door appears in it and opens (rail NOV 19 · ~11:53 PM PT). TASYA in the new doorway, key ring jangling: \"Good evening. You'll want to hear our statement.\" He reads from his phone; the line crosses the cut.",
                   onscreen={"add": ["RAIL: NOV 19 · ~11:53 PM PT"]}, fix=["C12"])
A4["S4.13d"] = dict(est_s=8.6,
                    caption="On \"Mas Manalt and Gerg Mockbran\": NELEH and ALYI's reflection in the wall screen's glass, the slate door beyond. Neleh's pen stops. The statement ends; no hold after it.",
                    fix=["C12"], why="12A: shorter reaction holds; the statement's tail (it ran into S4.13e) ends here.")
A4["S4.13e"] = dict(action="cut", est_s=0.0, fix=["C12"], why="12A: Tasya's sign goes (the S5.11 door keeps its own).")
A4["S4.14"] = dict(action="cut", est_s=0.0, fix=["C12"], why="12A: \"Step four, Mada?\" goes; Neleh's look (S4.07, moved) replaces it.")
A4["S4.15"] = dict(action="cut", est_s=0.0, fix=["C12"], why="12A: Mada's held note goes; the bridge is Alyi alone (sc 49A).")
A4["S5.03"] = dict(est_s=2.5,
                   drop={"v3-vo-20": "12A: the 2 AM count is cut; the war room's count carries the device"},
                   onscreen={"add": ["RAIL: NOV 20, 2023 · ~2:06 AM PT"]},
                   caption="MATCH, from Alyi's phone: the same hearts, now on Mas's phone, face-up by his glass. RIMA's post, \"NopeAI is nothing without its people\", and the same words from other avatars, climbing. His thumb taps a heart on the downbeat. Tick. No voice.",
                   picture="The heart counter climbs (a blur, no figure called out). The rail rides the match.",
                   fix=["C12", "TR"], why="The hearts stay (2.5 s, no voice); the count goes.")
A4["S5.02"] = dict(est_s=3.0,
                   onscreen={"drop": ["RAIL: NOV 20, 2023 · ~2:06 AM PT"]},
                   caption="The home shot: the glass on the dark-room desk, its water line one flat row of pixels, the GUEST lanyard laid square beside it, the phone still lighting with hearts.",
                   fix=["TR"], why="Moved after the hearts, so the match from Alyi's phone lands on Mas's phone.")
A4["S5.09"] = dict(est_s=round(14.06 - (2.23 - 0.8) - 0.3, 2),
                   drop={"v34-vo-09": "12A: \"gerg walked out for me.\" is cut (the war room shows it)"},
                   retime={"a5-29-03": "start+0.8", "v31-a4-0007": R("a5-29-04", 0.25), "v31-a4-0008": R("v31-a4-0007", 0.45)},
                   tempo=tempo("quick", {"v31-a4-0007": 0.25, "v31-a4-0008": 0.45}, "\"His keys stop, for half a beat\" (0.81 s) stays"),
                   fix=["C12", "PACE"])
A4["S5.06"] = dict(est_s=round(22.79 - 0.3, 2),
                   retime={"a5-29-10": R("a5-29-09", 0.45), "a5-29-11": R("a5-29-10", 0.25)},
                   tempo=tempo("quick", {"a5-29-10": 0.45, "a5-29-11": 0.25}, "the scroll to Alyi's name (1.6 s) stays"), fix=["PACE"])
A4["S5.09-back"] = dict(est_s=round(5.4 - 0.15, 2), retime={"a5-29-17": R("a5-29-16", 0.25)},
                        tempo=tempo("quick", {"a5-29-17": 0.25}), fix=["PACE"])
A4["S5.11"] = dict(est_s=round(15.6 - 0.75, 2),
                   retime={"a5-29-21": R("a5-29-20", 0.45), "a5-29-22": R("a5-29-21", 0.25), "v31-a4-0013": R("v31-a4-0012", 0.25)},
                   tempo=tempo("quick", {"a5-29-21": 0.45, "a5-29-22": 0.25, "v31-a4-0013": 0.25}, "the door's crack on \"desk\" (1.2 s) stays"),
                   fix=["PACE"])
A4["S6.01"] = dict(est_s=2.3, fix=["C12"], why="The quicker board exit (the lead's extra): the grid fills in 2.3 s.")
A4["S6.02"] = dict(est_s=1.0, fix=["C12"])
A4["S6.03"] = dict(est_s=1.2, fix=["C12"])
A4["S6.04"] = dict(est_s=1.6, fix=["C12"])
A4["S6.06"] = dict(est_s=2.9, caption="THE QUIET VOTE's black tile is pushed out without a sound. In the last gap, MADA's tile, wedged in; every tile presses; he doesn't move. His label flips, and the band stops dead on it: MADA · LAST FIRER STANDING. A short hold on the dark room's air.",
                   fix=["C12"], why="The board leaves the call in about 9 s.")
A4["S7.01"] = dict(est_s=20.1,
                   onscreen={"replace": {"POST: ALYI: “I deeply regret my participation in the board's actions. I never intended to harm NopeAI…”":
                                         "POST: ALYI: “I deeply regret my participation in the board's actions. I never intended to harm NopeAI. I love everything we've built together and I will do everything I can to reunite the company.”"}},
                   caption="The act's one box: MAS, left, at his end desk, the GUEST lanyard and the MACROSOFT badge side by side before him; ALYI, right, in the gap of the conference-room door, his phone in his hand. His post pops up in full and holds to read: \"I deeply regret my participation in the board's actions. I never intended to harm NopeAI. I love everything we've built together and I will do everything I can to reunite the company.\" Three red hearts rise out of Mas's window. \"You sent three.\" / \"one for each day.\" / \"It has been four days.\" / \"i'm not counting today.\"",
                   picture="The post in full, held about 1.5 s longer; its last clause (\"reunite the company\") the one a newcomer needs.",
                   fix=["NEW", "FACT"], why="Sc 53: his own words, in full (facts L10, [P], re-read raw).")
A4["S7.06"] = dict(est_s=3.4, fix=["C12"], why="Only the freeze card is shorter (TERB / THE NEW CHAIR).")
A4["S7.06-cont"] = dict(est_s=round(4.92 - 0.6, 2), retime={"a5-30-09": R("a5-30-08", 1.0)},
                        tempo=tempo("quick", {"a5-30-09": 1.0}, "the look-around is a beat, 1.6 → 1.0 s"),
                        fix=["C12"], why="The fire exchange is tighter.")
A4["S7.07"] = dict(est_s=round(10.88 - A("v3-a4-0004") + l("v35-a4-0008"), 2),
                   drop={"v3-a4-0004": "12A: its first sentence is cut; the rest is the same recording"},
                   add=[line("v35-a4-0008", "start+0.8", 0.0, delivery="brisk, reading from the sheet; the same read, from its second sentence")],
                   fix=["C12"], why="Terb reads the agreement without his lead-in.")
A4["S7.07-cont"] = dict(est_s=round(17.36 - 0.25, 2),
                        retime={"a5-30-13": R("a5-30-12", 0.45), "v31-a4-0016": R("v31-a4-0015", 0.25), "a5-30-15": R("a5-30-14", 0.45)},
                        tempo=tempo("quick", {"a5-30-13": 0.45, "v31-a4-0016": 0.25, "a5-30-15": 0.45},
                                    "Mada's non-answer after \"you're staying?\" (0.9 s) and the dead stop before \"Good question.\" (1.6 s) stay"),
                        fix=["PACE", "KEEP"])
A4["S8.06"] = dict(est_s=2.2, fix=["C12"], why="A tighter vault shot.")
A4["S8.07"] = dict(est_s=round(9.0 - 0.25 - 2.24, 2), retime={"a5-31-03": R("a5-31-02", 0.25)},
                   tempo=tempo("quick", {"a5-31-03": 0.25}, "the rack to the vault and Gerg's exit, 4.1 → 1.9 s"),
                   fix=["C12", "PACE"], why="A tighter \"Is it ready?\" exchange.")
A4["S8.10"] = dict(est_s=3.8, fix=["C12", "KEEP"], why="The observer chair stays (the act's last payoff), its hold shorter.")

# ================================================================================================ THE NEW BEATS
NEW = {s: [] for s in SEGS}


def nb(seg, bid, est, frame, setting, room, chars, caption, picture, lines=(), onscreen=None, music="", sounds=None,
       jcut=None, lcut=None, style=None, style_leap=None, flashback=None, restore_from=None, fix=("NEW",), why="", tempo_=None):
    e = {"id": bid, "est_s": round(est, 2), "frame": frame, "set": setting, "room": room, "chars": list(chars),
         "caption": caption, "picture": picture, "lines": list(lines), "fix": list(fix), "why": why}
    if onscreen:
        e["onscreen"] = onscreen
    if music:
        e["music"] = music
    if sounds:
        e["sounds"] = sounds
    if jcut:
        e["jcut"] = jcut
    if lcut:
        e["lcut"] = lcut
    if style:
        e["style"] = style
    if style_leap:
        e["style_leap"] = style_leap
    if flashback:
        e["flashback"] = flashback
    if restore_from:
        e["restore_from"] = restore_from
    if tempo_:
        e["tempo"] = tempo_
    NEW[seg].append(e)
    return e


# ---- sc 10 · THE FIRST WEEKS · DEC 2022 · MONTAGE (the driving pulse; prompts only, no faces, no names)
FW = "THE FIRST WEEKS · a driving pulse, rising (new cue in the show's own chip-and-808 colour; not a trio, not lounge); every cut on the pulse"
nb("act1", "v35-10.01", 2.5, "INSERT · a stranger's phone (match from his)", "screen", "phone", [],
   "MATCH: his phone's screen becomes the first stranger's phone, a hand (no face). Typed: write my essay on the fall of rome. 500 words. make it sound like me. The answer pours down the screen.",
   "Phones and laptops everywhere, hands only; every UI generic, CHATGTP's two-dot face. The typed prompt readable, the answer a pouring blur.",
   onscreen={"add": ["RAIL: DEC 2022", "write my essay on the fall of rome. 500 words. make it sound like me"]}, music=FW,
   why="Sc 10: what people do with it, fast and rising.")
nb("act1", "v35-10.02", 2.0, "INSERT · a laptop: the bug fix", "screen", "phone", [],
   "A laptop: why does this crash. A red error line; the answer; the line turns green.",
   "Red → green, one step on the pulse.", onscreen={"add": ["why does this crash"]}, music=FW)
nb("act1", "v35-10.03", 2.5, "INSERT · a phone: the sandwich in the VCR", "screen", "phone", [],
   "A phone: a bible verse, king james style, about getting a peanut butter sandwich out of a VCR. The answer: And it came to pass…",
   "The prompt readable, the answer's first words in a King James face. [V · the viral prompt of Dec 1, 2022, shown as a prompt only; its poster never named]",
   onscreen={"add": ["a bible verse, king james style, about getting a peanut butter sandwich out of a VCR", "And it came to pass…"]},
   music=FW, why="The comedy of it.")
nb("act1", "v35-10.04", 3.0, "INSERT · a post card: NOLE", "screen", "phone", [],
   "A post card in its own UI, replying to @masa: \"CHATGTP is scary good. We are not far from dangerously strong AI.\" Its name reads NOLE, and his plate rides it: NOLE.",
   "The post whole, held to read (3 s); a flicker in the pulse under it. [P · @elonmusk, Dec 3, 2022, 19:48 UTC (11:48 AM PT), a reply to @sama, read raw; the name swaps only]",
   onscreen={"add": ["@masa CHATGTP is scary good. We are not far from dangerously strong AI.", "NOLE"]}, music=FW,
   fix=("NEW", "FACT"), why="Nole's first reaction (the ledger's 4a #5): scared of it, and watching. Sc 23 pays it.")
nb("act1", "v35-10.05", 2.0, "INSERT · two phones, a split", "screen", "phone", [],
   "Two phones side by side: eggs, half an onion, rice. what's dinner · how do i say sorry to my sister.",
   "Both prompts readable; the answers a blur. The second prompt is the one a stranger's post answers at 3 AM (sc 12).",
   onscreen={"add": ["eggs, half an onion, rice. what's dinner", "how do i say sorry to my sister"]}, music=FW)
nb("act1", "v35-10.06", 2.5, "INSERT · the banner, and the wrong sum", "screen", "phone", [],
   "A chat window's small print, the banner nobody reads: research preview · may make things up. Above it, the answer: 7 × 8 = 54.",
   "The wince. The banner is the show's own UI line (it pays Rima's \"a banner that says it makes things up\"); the sum is invented. [INVENTED banner, grounded in the launch post: \"ChatGPT sometimes writes plausible-sounding but incorrect or nonsensical answers.\" (Nov 30, 2022, [P·arch]) · FACT: the in-app banner's exact words couldn't be verified]",
   onscreen={"add": ["research preview · may make things up", "7 × 8 = 54."]}, music=FW, fix=("NEW", "FACT"),
   why="Rima's banner, paid: nobody reads banners.")
nb("act1", "v35-10.07", 2.5, "INSERT · STACK UNDERFLOW", "screen", "phone", [],
   "The coders' question site, STACK UNDERFLOW, its notice bar: Temporary policy: CHATGTP is banned.",
   "A parody Q&A site UI. [P·arch · meta.stackoverflow.com, \"Temporary policy: ChatGPT is banned\", posted 2022-12-05 05:34 UTC; the name swaps only; STACK UNDERFLOW is a proposed parody name (naming.md owner confirms)]",
   onscreen={"add": ["STACK UNDERFLOW", "Temporary policy: CHATGTP is banned"]}, music=FW, fix=("NEW", "FACT"))
nb("act1", "v35-10.08", 1.5, "WIDE · the desk of phones", "bullpen", "bullpen", ["mas"],
   "Pull back: the bullpen desk covered in lit phones. Among them his own lights red. A siren whines through its small speaker.",
   "His phone's red among the white glows. The pulse cuts on the siren.",
   jcut=[{"sound": "the siren, through the phone's small speaker", "lead_s": 0.3}], music=FW, fix=("NEW", "TR"),
   why="The out: the players notice. The code red arrives on his own phone (8.01).")

# ---- sc 12 · 3 AM · DEC 2022 · INSERT + DOCUMENT (weighted; no score)
nb("act1", "v35-12.01", 4.5, "OTS · over Mas onto his laptop, the bullpen dark, 3 AM", "bullpen", "bullpen-night", ["mas"],
   "3 AM. The bullpen dark but for his laptop. The feed stalls on the at-capacity page, CHATGTP IS AT CAPACITY RIGHT NOW, then reloads. The first post back is a stranger's: asked it how to say sorry to my sister. it helped.",
   "The laptop's clock reads 3:0x AM. The post in a generic feed UI, no name, no face, no avatar detail. The corner of his screen keeps a small counter: CHATGTP · USERS: and a still-spinning blur (never a figure).",
   onscreen={"add": ["CHATGTP IS AT CAPACITY RIGHT NOW", "asked it how to say sorry to my sister. it helped.", "CHATGTP · USERS:"]},
   music="3 AM · no score: the bullpen's fans; one felt note under the second read",
   tempo_=tempo("weighted"), fix=("NEW", "FACT"),
   why="Sc 12: among the jokes and the tests, someone used it for something that mattered. [H · the at-capacity page, December 2022 (reported; no first date found: shown undated) · the post [INVENTED]; a post someone chose to share, never a private chat]")
nb("act1", "v35-12.02", seq(0.8, [("v35-vo-01", 0.0)], 0.9), "MCU · Mas, the laptop's light", "bullpen", "bullpen-night", ["mas"],
   "MAS, the laptop's light on his face. His eyes go back to the top of the post: he reads it twice. Nothing on his face changes but one pixel.",
   "His eyes travel the post's two lines, return to the start, travel them again. The one-pixel change is at the second read's end.",
   lines=[line("v35-vo-01", "start+0.8", 0.0)], music="3 AM · the felt note under the second read",
   tempo_=tempo("weighted"), fix=("NEW", "C1"),
   why="Choice 1A: \"they've stopped testing it. they're using it.\" The act's one moment where he's moved, never named; it rhymes with \"i still read it twice.\"")
nb("act1", "v35-12.03", 1.8, "INSERT · the corner counter (match)", "screen", "bullpen-night", [],
   "The small counter in the corner of his screen, CHATGTP · USERS:, becomes in the same place and size PLAYED AGAINST ITSELF TODAY: 180 YEARS. The intro's glowing line re-draws the room around it as it was then.",
   "A counter match (same position, same size, same font), then the glowing line sweeps the frame into 2018.",
   onscreen={"add": ["PLAYED AGAINST ITSELF TODAY: 180 YEARS"]},
   jcut=[{"sound": "2018's server fans and a game's tinny arena, under the thought's tail", "lead_s": 0.8}],
   music="the JUN 2018 cue enters on the glowing line", fix=("NEW", "TR"),
   why="Having seen what the world does with it, he remembers why they started.")

# ---- sc 13 · JUN 2018 · FLASHBACK · CONVERSATION (weighted)
FB18 = {"when": "JUN 2018", "memory": 1, "of": 3, "tier": "T3 cut-paper (the 2015–2019 memory tier, flashback-map §0.1): crisp vector with paper grain, lit by the monitors",
        "in": "the counter match (12.03) and the intro's glowing line", "out": "his glass, walking out of 2018 into the January lobby (9.01)",
        "no_vo": "no inner voice in a memory"}
M18 = "JUN 2018 · wonder and warmth: felt piano and the Build's chip, soft (new cue); the arena's tinny game audio inside it; the fans"
nb("act1", "v35-13.01", 3.2, "WIDE · NopeAI's first office, night: the wall of monitors", "office", "office_night", ["mas", "alyi", "gerg"],
   "NopeAI's first office, night. A wall of monitors: bots play bots in a top-down arena, a match on every screen, teaching themselves. The racks behind them carry INVIDIA's logo. At the top of the wall, PLAYED AGAINST ITSELF TODAY: 180 YEARS. MAS (with his glass) and ALYI stand before it; GERG codes at a desk in the background, green glow. In a corner, a lone desk with a small monitor, a sticky note, a hoodie on the empty chair.",
   "The arena drawn top-down in its own game medium (the milestones layer: each machine in its own medium), not the office's style. INVIDIA's logo on the racks legible (the second plant). The lone desk small and unlit but for its monitor.",
   onscreen={"add": ["RAIL: JUN 2018", "INVIDIA (the logo on the racks)", "ATOD"]}, music=M18, flashback=FB18,
   style="T3 cut-paper memory; the arena in its own top-down game medium",
   fix=("NEW", "FACT"), why="Sc 13: the night the machine taught itself. [P·arch · \"OpenAI Five plays 180 years worth of games against itself every day, learning via self-play… on 256 GPUs\" (Jun 25, 2018); ATOD is Dota's parody name]")
nb("act1", "v35-13.02", seq(0.6, [("v35-a1-0001", 0.0), ("v35-a1-0002", 0.6), ("v35-a1-0003", 0.6), ("v35-a1-0004", 0.6)], 0.5),
   "2S · Mas and Alyi at the wall, the arena's light on them (held)", "office", "office_night", ["mas", "alyi"],
   "ALYI, low: \"Nobody taught it that. It played itself.\" MAS reads the counter: \"a hundred and eighty years. since this morning.\" ALYI: \"Make it bigger and it could learn anything.\" MAS: \"how much bigger?\"",
   "Alyi in person, not a reflection (his only direct, lit face before Act Four); the arena's colours move on both faces. Held; one slow push.",
   lines=[line("v35-a1-0001", "start+0.6"), line("v35-a1-0002", "v35-a1-0001", 0.6), line("v35-a1-0003", "v35-a1-0002", 0.6),
          line("v35-a1-0004", "v35-a1-0003", 0.6)],
   music=M18, flashback=FB18, tempo_=tempo("weighted"), fix=("NEW",),
   why="Alyi's awe, Mas's practicality: the believer and the organizer.")
nb("act1", "v35-13.03", seq(0.4, [("v35-a1-0005", 0.0), ("v35-a1-0006", 0.6)], 0.5),
   "MCU · Alyi, lit by the arena", "office", "office_night", ["alyi"],
   "ALYI: \"Games now. Robots, maybe. After that… I don't know.\" MAS (O.S.): \"then a lot more computers.\"",
   "His real face, happy not to know. Face light, one step.",
   lines=[line("v35-a1-0005", "start+0.4"), line("v35-a1-0006", "v35-a1-0005", 0.6, tag="O.S.")],
   music=M18, flashback=FB18, tempo_=tempo("weighted"), fix=("NEW",), why="Neither knows the road.")
nb("act1", "v35-13.04", seq(0.3, [("v35-a1-0007", 0.0)], 1.3),
   "2S · Alyi turns to Mas", "office", "office_night", ["mas", "alyi"],
   "ALYI turns to him: \"Something that can learn anything, Mas. What else would you build?\" No answer. Mas's eyes go past him, to the corner.",
   "The no-answer is 1.3 s: his eyeline leaves Alyi for the lone desk.",
   lines=[line("v35-a1-0007", "start+0.3")], music=M18, flashback=FB18, tempo_=tempo("weighted"), fix=("NEW",),
   why="Why they want AGI, in one question. It's broken at sc 39 and mended at sc 53.")
nb("act1", "v35-13.05", 2.5, "INSERT · the lone desk: the side project", "office", "office_night", [],
   "The lone desk's small monitor: a text model finishing a sentence badly, the cat sat on the the mat of the. A sticky note: text? (side project). A hoodie on the empty chair. Only Mas looked.",
   "Never pointed at: no push, no sting. Its researcher is never drawn or named (the hoodie on the chair). [the text model, Jun 11, 2018, [P]]",
   onscreen={"add": ["the cat sat on the the mat of the", "text? (side project)"]}, music=M18, flashback=FB18, fix=("NEW",),
   why="A small rewatch thrill: CHATGTP's seed, for whoever notices.")
nb("act1", "v35-13.06", 1.5, "WIDE → MATCH · he walks out with his glass", "office", "office_night", ["mas"],
   "Mas walks out of the 2018 office with his glass; the glowing line sweeps back across the frame, and he is walking into NopeAI's lobby in January with the same glass.",
   "A walk-through match: his figure and glass hold their place in frame through the sweep.",
   lcut=[{"sound": "a revolving door's squeal and a heavy jam (the check, 9.01)", "over_s": 0.5}], music=M18 + "; out on the sweep",
   flashback=FB18, fix=("NEW", "TR"), why="\"then a lot more computers.\" The money for them arrives.")

# ---- sc 18 · THE WINDOW · that evening · CONVERSATION (quick)
MW = "THE WINDOW · warm: the Build in major, the team's peak (new cue); out to one felt note under the lamp"
nb("act1", "v35-18.01", 6.0, "WIDE · the bullpen window at dusk, the users line", "bullpen", "bullpen", ["gerg", "rima", "alyi", "mas"],
   "That evening, the bullpen window. On the glass, a hand-drawn line: CHATGTP's users, rising. Gerg, stung from the lobby, takes a marker and extends it, up, off the top of the glass. Taped beside it, a clipping: CHATGTP SETS RECORD FOR FASTEST-GROWING USER BASE. Rima's board behind now reads PLUS · $20. Alyi shows Rima something on his laptop; she leans in.",
   "The users line is never explained: it's the running picture of their lead. The clipping is a headline only (no figure). [H · Reuters, Feb 2, 2023: \"ChatGPT sets record for fastest-growing user base - analyst note\" · P·arch · \"ChatGPT Plus, will be available for $20/month\" (Feb 1, 2023)]",
   onscreen={"add": ["CHATGTP SETS RECORD FOR FASTEST-GROWING USER BASE", "PLUS · $20"]},
   sounds=[{"name": "marker_write_q", "at": 0.3, "note": "the marker's squeak on glass"}], music=MW, fix=("NEW", "FACT", "TR"),
   why="Sc 18: whatever wears their badge, the users are theirs.")
nb("act1", "v35-18.02", seq(0.5, [("v35-a1-0009", 0.0), ("v35-a1-0010", 0.45)], 2.0),
   "2S → W · the four of them at the window", "bullpen", "bullpen", ["mas", "rima", "gerg", "alyi"],
   "RIMA, teasing: \"Still a preview?\" MAS: \"still a preview.\" All four laugh.",
   "The laugh is picture (four held drawings, shoulders); the sound pass lays a soft group laugh from its library under the room (no voice takes). Warm light; the line on the glass behind them.",
   lines=[line("v35-a1-0009", "start+0.5"), line("v35-a1-0010", "v35-a1-0009", 0.45)],
   music=MW, tempo_=tempo("quick", {"v35-a1-0010": 0.45}), fix=("NEW",),
   why="The old joke, and the height the firing falls from.")
nb("act1", "v35-18.03", 2.5, "WIDE · Mas alone under one lamp", "bullpen", "bullpen-night", ["mas"],
   "The others go home. Mas stays at his end desk under one lamp, the line in the dark glass behind him. He opens a blank page.",
   "The window has gone dark; the line reads as a reflection over the city.",
   music="one felt note under the lamp", fix=("NEW", "TR"), why="The dream came true, and he writes it down.")

# ---- sc 19 · THE VISION POST · FEB 24, 2023 · DOCUMENT (weighted)
MV = "the vision post · quiet ambition: one held felt line and his keys (new cue); the Build's chip line under the Publish click"
nb("act1", "v35-19.01", 3.0, "INSERT · his hands, the post editor", "screen", "bullpen-night", ["mas"],
   "His hands; a blank post editor. He types the title: Planning for AGI and beyond.",
   "A plain blog editor UI (generic). Typed at his rate.",
   onscreen={"add": ["RAIL: FEB 24, 2023", "Planning for AGI and beyond"]}, music=MV, fix=("NEW", "FACT"),
   why="Sc 19: his vision, in his own words. [P·arch · the post of Feb 24, 2023; every typed line checked against the Internet Archive's capture of that day]")
nb("act1", "v35-19.02", 14.0, "POV · the post, three passages typed and held", "screen", "bullpen-night", [],
   "The post's lines type and hold to read, one at a time: \"Our mission is to ensure that artificial general intelligence—AI systems that are generally smarter than humans—benefits all of humanity.\" · \"…a gradual transition to a world with AGI is better than a sudden one.\" · \"…perhaps the most important—and hopeful, and scary—project in human history.\"",
   "Each passage typed at his rate, held about 4 s after it lands; the previous passage scrolls up and dims. No name in the text needs a swap.",
   onscreen={"add": ["Our mission is to ensure that artificial general intelligence—AI systems that are generally smarter than humans—benefits all of humanity.",
                     "…a gradual transition to a world with AGI is better than a sudden one.",
                     "…perhaps the most important—and hopeful, and scary—project in human history."]},
   music=MV, fix=("NEW", "FACT"), why="The mission, why he shipped a preview (gradually), and the stakes.")
nb("act1", "v35-19.03", seq(1.0, [("v35-vo-02", 0.0)], 1.2), "MCU · Mas, the page's light on his face", "bullpen", "bullpen-night", ["mas"],
   "MAS, his face in the page's light, the post finished.",
   "Held. Nothing moves but the cursor's blink reflected on him.",
   lines=[line("v35-vo-02", "start+1.0", 0.0)], music=MV, tempo_=tempo("weighted"), fix=("NEW", "C2"),
   why="Choice 2A: \"someone gets to be in the room.\" His want, hinted; a rewatcher hears the cold open.")
nb("act1", "v35-19.04", 3.5, "POV → MATCH · Publish; a rival answers; the lid closes", "screen", "bullpen-night", ["mas"],
   "His cursor clicks Publish. His feed refreshes: ATEM · A NEW MODEL · FOR RESEARCHERS ONLY, the same day. He closes the lid.",
   "The lid's close is the match object (it opens as Gerg's laptop a week later, 11.01).",
   onscreen={"add": ["ATEM · A NEW MODEL · FOR RESEARCHERS ONLY"]},
   jcut=[{"sound": "the Build's chip line, under the Publish click", "lead_s": 0.0}], music=MV,
   fix=("NEW", "FACT", "TR"), why="A rival answers the same day [V · Feb 24, 2023, facts #10].")

# ---- sc 22 · ELGOOG'S WAITLIST · MAR 21, 2023 · INSERT
nb("act1", "v35-22.01", 3.0, "SCR · the bullpen's wall TV", "screen", "bullpen", [],
   "The bullpen's wall TV: Elgoog finally opens its chatbot, DRAB, behind a velvet rope: DRAB · JOIN THE WAITLIST. The rope snaps taut. Behind the TV, the window's users line is far above it.",
   "The rope's snap is the sound lead in; the users line visible past the TV's edge.",
   onscreen={"add": ["RAIL: MAR 21, 2023", "DRAB · JOIN THE WAITLIST"]},
   music="a smug little sting on the rope's snap; it rings on under the usage flash (v35-22.02) and out under the toast",
   fix=("NEW", "FACT", "TR"),
   why="Sc 22: they're ahead. [V · Mar 21, 2023: Bard's waitlist opens in the US and UK] (v3.5b: the toast's J-cut moves to the usage flash, v35-22.02, which now comes before the letter)")
nb("act1", "v35-22.02", 2.0, "INSERT · MATCH · every chatbot's usage, climbing at once", "screen", "bullpen", [],
   "MATCH: the users line on the bullpen window, past the TV's edge, becomes the top line of a chart that fills the frame: every chatbot we've just seen, each its own usage line climbing at once, CHATGTP · GNIB · DRAB · CLOD · ATEM · LEAKED. All five climb; CHATGTP's runs off the top, far ahead. The letter's toast pops over it.",
   "One held insert. The lines draw left to right in whole-pixel steps from 0.1 s, each tagged with its bot as shown earlier (CHATGTP's two-dot face, GNIB's search box with a small POWERED BY NOPEAI, DRAB's skewed primaries, CLOD's clay, Atem's stencilled crate); no axes, no figures (never a number). CHATGTP's line is the window's line, the same colour and stroke. The letter's toast pops at 1.6 s (12.01's, a beat early) and the cut lands on his monitor.",
   onscreen={"add": ["CHATGTP · GNIB · DRAB · CLOD · ATEM · LEAKED"]},
   sounds=[{"name": "counter_roll", "at": 0.2, "gain": -28, "note": "five usage counters rolling at once (under the sting's ring)"}],
   jcut=[{"sound": "the pause letter's toast pop, a beat early (12.01)", "lead_s": 0.4}],
   music="a smug little sting rings on: the chip climbs with the lines (the Build's tag, 16ths up A-flat major), landing under the toast",
   fix=("NEW", "TR"),
   why="SN 00000A step 2: a quick flash of every chatbot just shown (sc 20-22), usage climbing at once with NopeAI far ahead: why the letter asks for a pause. In: the window's users line (matched object). Out: the letter's toast (sound-led). Not picture-only: v35-22.01's 3.0 s carries DRAB's page to read (0.2 s on, the snap at 0.9 s) and the letter's header lands 0.4 s into 12.01, so at most 1.3 s were free; +2.0 s. [INVENTED chart: no figures; ChatGPT's lead in early 2023 is on the record (Reuters, Feb 2, 2023, [H])]")

# ---- sc 27 · the Senate's new opener
nb("act2", "v35-27.00", 3.8, "HIGH → WIDE · the witness table, then the hearing room", "senate", "senate", ["mas", "sucram", "lahtnemulb", "gallery"],
   "MATCH on the gavel's knock: the folded sheet, the same one, now under his hand at the witness table. The camera lifts to the hearing room: the dais, the tiled gallery, the chairman at the centre; beside Mas, SUCRAM already typing, live-threading.",
   "Opens straight on the hearing (no clone, no voice over black). Sucram's phone lit. The sheet stays folded under his hand until 15.15.",
   onscreen={"add": ["RAIL: MAY 16, 2023 · SENATE JUDICIARY"]},
   sounds=[{"name": "landing_thunk", "at": 0.0, "note": "the gavel's knock (the sound pass may swap in a gavel)"}],
   music="procedural comedy, MM-20, in on the gavel", fix=("NEW", "CLONE", "TR"),
   why="Sc 27 opens straight on the hearing, with Sucram beside him.")

# ---- sc 28 · MAR 2019 · FLASHBACK · CONVERSATION (quick)
FB19 = {"when": "MAR 2019", "memory": 2, "of": 3, "tier": "T3 cut-paper (flashback-map §0.1)",
        "in": "his hand sets the wallet on the table; in 2019 the same hand sets a marker on a whiteboard's tray (a marker's squeak, an old office fan)",
        "out": "the check under the door; the glowing line sweeps back to the hearing", "no_vo": "no inner voice in a memory"}
M19 = "MAR 2019 · admiration with a flicker of unease: the Build and low strings (new cue); an old office fan"
nb("act2", "v35-28.01", 2.3, "INSERT → MATCH · the hand, the marker", "office", "office", ["mas"],
   "MATCH: in 2019 the same hand sets a marker on a whiteboard's tray. The glowing line re-draws NopeAI's first office around it, by day.",
   "Same hand, same place in frame. The office is sc 13's room by day, a year on.",
   onscreen={"add": ["RAIL: MAR 2019"]}, music=M19, flashback=FB19, fix=("NEW", "TR"),
   why="Sc 28: the night he chose it.")
nb("act2", "v35-28.02", seq(0.4, [("v35-a2-0002", 0.0), ("v35-a2-0003", 0.45), ("v35-a2-0004", 0.8), ("v35-a2-0005", 0.45),
                                   ("v35-a2-0006", 0.8), ("v35-a2-0007", 0.45)], 0.6),
   "W → 2S · the whiteboard (held)", "office", "office", ["mas", "gerg", "alyi"],
   "GERG holds a cloud bill that unrolls to the floor: \"The next one costs billions. Nobody donates billions.\" MAS draws a box under NONPROFIT · THE BOARD: \"so they don't donate. they invest.\" He writes CAPPED PROFIT. ALYI: \"Capped at what?\" MAS writes 100x: \"a hundred times.\" ALYI: \"And who's in charge?\" MAS taps the top box: \"the board.\"",
   "The diagram builds on each line: NONPROFIT · THE BOARD at the top; an arrow down to CAPPED PROFIT; 100x beside it. Each write is on his line. [P·arch · the Mar 11, 2019 post: \"billions of dollars\", \"capped at 100x\", \"controlled by OpenAI Nonprofit's board\"]",
   lines=[line("v35-a2-0002", "start+0.4"), line("v35-a2-0003", "v35-a2-0002", 0.45), line("v35-a2-0004", "v35-a2-0003", 0.8),
          line("v35-a2-0005", "v35-a2-0004", 0.45), line("v35-a2-0006", "v35-a2-0005", 0.8), line("v35-a2-0007", "v35-a2-0006", 0.45)],
   onscreen={"add": ["NONPROFIT · THE BOARD", "CAPPED PROFIT", "100x"]}, music=M19, flashback=FB19,
   tempo_=tempo("quick", {"v35-a2-0003": 0.45, "v35-a2-0004": 0.8, "v35-a2-0005": 0.45, "v35-a2-0006": 0.8, "v35-a2-0007": 0.45},
                "Alyi's two questions wait for the marker (0.8 s: business)"),
   fix=("NEW", "FACT"), why="He builds the machine: how NopeAI raised money.")
nb("act2", "v35-28.03", seq(0.6, [("v35-a2-0008", 0.0), ("v35-a2-0009", 0.45), ("v35-a2-0010", 0.5)], 0.6),
   "2S · Mada at the table; the Quiet Vote's chair turned away", "office", "office", ["mas", "mada", "quiet-vote"],
   "MADA, arms folded at the table, a spinner over his head: \"And you?\" MAS draws a stick figure in the lower box, CEO · EQUITY: 0: \"nothing.\" MADA: \"Good answer.\" Beside him, a chair turned away: THE QUIET VOTE.",
   "Mada as in Act Four (the spinner); the Quiet Vote only as a chair turned away. The stick figure and its EQUITY: 0 legible. A sharp viewer's unease: he just put the board on top.",
   lines=[line("v35-a2-0008", "start+0.6"), line("v35-a2-0009", "v35-a2-0008", 0.45), line("v35-a2-0010", "v35-a2-0009", 0.5)],
   onscreen={"add": ["CEO · EQUITY: 0"]}, music=M19, flashback=FB19,
   tempo_=tempo("quick", {"v35-a2-0009": 0.45, "v35-a2-0010": 0.5}),
   fix=("NEW", "FACT"),
   why="Why he owns nothing, and who's on top. [P·arch · the board list of Mar 11, 2019 names Mada's and the Quiet Vote's counterparts]")
nb("act2", "v35-28.04", 2.8, "INSERT · under the door", "office", "office", [],
   "Under the office door slides a check: MACROSOFT · $1,000,000,000 · JUL 2019.",
   "The landlord's first check, a smaller cousin of Act One's. [V · Jul 22, 2019]",
   onscreen={"add": ["MACROSOFT · $1,000,000,000", "JUL 2019"]}, music=M19, flashback=FB19, fix=("NEW",),
   why="The money arrives; the landlord's first key.")
nb("act2", "v35-28.05", 2.5, "WIDE · the dais, nothing to write", "senate", "senate", ["lahtnemulb", "gallery"],
   "The glowing line sweeps back: the hearing. The dais leans back; a senator's pen hovers over a blank pad, nothing to write (hands only). The chairman's gavel ends the hearing; its knock is a passport stamp.",
   "Hands and pads only; no senator's face. The gavel's knock and the stamp's thunk are one sound.",
   sounds=[{"name": "landing_thunk", "at": 1.9, "note": "the chairman's gavel (the sound pass may swap in a gavel)"}], jcut=[{"sound": "the gavel's knock becomes a passport stamp (29.01)", "lead_s": 0.2}],
   music="MM-20's last phrase; out on the gavel", fix=("NEW", "TR"),
   why="Back from 2019: the question has no answer to write down.")

# ---- sc 29 · TAKING IT TO THE WORLD · MAY 2023 · MONTAGE + DOCUMENT (quick; no inner voice)
MT = "THE RUN (MM-03), in on the first stamp; a knee stab on every stamp; thins under the lectern and the posts"
nb("act2", "v35-29.01", 4.0, "INSERT · his passport, the stamps; hands under flags", "void", "none", ["mas"],
   "His passport; the stamps land one a beat: RIO DE JANEIRO · LAGOS · MADRID · WARSAW · PARIS · LONDON · MUNICH. Between them, copies of his page slide across tables to hands under flags (no faces).",
   "Seven stamps, one per beat; two cutaways of the page sliding to hands under flags. No leader drawn. FACT: Toronto and Washington came before the hearing (the tour's first week), so the stamps start at Rio. [V · Rio May 18 (Museu do Amanhã) · Lagos May 19 · Madrid May 22 (La Moncloa) · Warsaw May 23 · Paris May 23 · London May 24 · Munich May 25 (TUM), 2023]",
   onscreen={"add": ["RIO DE JANEIRO", "LAGOS", "MADRID", "WARSAW", "PARIS", "LONDON", "MUNICH"]},
   sounds=[{"name": "rubber_stamp_C", "at": 0.3 + 0.5 * i} for i in range(7)], music=MT, fix=("NEW", "FACT", "TR"),
   why="Sc 29: he won't run the agency, so he carries his rules to the world himself.")
nb("act2", "v35-29.02", seq(0.4, [("v35-a2-0011", 0.0)], 0.4), "M · a lectern in a London hall", "stage", "none", ["mas"],
   "A lectern in a university hall. MAS, pleasant: \"if we can comply, we will, and if we can't, we'll cease operating.\"",
   "A generic hall (no university crest). His one-pixel smile on \"cease operating\".",
   lines=[line("v35-a2-0011", "start+0.4")], onscreen={"add": ["RAIL: MAY 24, 2023 · LONDON"]}, music=MT,
   fix=("NEW", "FACT"), why="The leverage: threat.")
nb("act2", "v35-29.03", 2.8, "POV · his phone: NOTERB's post", "screen", "phone", [],
   "On his phone, a post in its own UI from NOTERB, a Brussels commissioner: \"There is no point in attempting blackmail…\"",
   "NOTERB only as his post (name and text; no face). The card's time reads May 25. [P · @ThierryBreton, May 25, 2023, 13:57 UTC, read raw; the name swap only]",
   onscreen={"add": ["NOTERB", "There is no point in attempting blackmail…"]}, music=MT, fix=("NEW", "FACT"),
   why="Push-back.")
nb("act2", "v35-29.04", 3.0, "INSERT · his thumb, his post", "screen", "phone", ["mas"],
   "His thumb; his post goes up in its own UI: \"…we are excited to continue to operate here and of course have no plans to leave.\" His one-pixel smile.",
   "The post's card time May 26. [P · @sama, May 26, 2023, 05:59 UTC (7:59 AM in Europe, where he was), read raw; its first clause, \"very productive week of conversations in europe about how to best regulate AI!\", trimmed with a print ellipsis]",
   onscreen={"add": ["RAIL: MAY 26, 2023", "…we are excited to continue to operate here and of course have no plans to leave."]},
   music=MT, fix=("NEW", "FACT"), why="Retreat: he's played the room and got his meetings.")
nb("act2", "v35-29.05", 1.4, "INSERT → MATCH · his pen, a guest book", "void", "none", ["mas"],
   "His pen signs a guest book under a flag; the pen, the hand and the signature hold their place as the page becomes a one-sentence letter on many desks.",
   "A generic guest book, no city named (the proposal's \"Paris\" is dropped: Paris came before London). The stamps' rhythm slows into many pens scratching.",
   lcut=[{"sound": "the stamps' rhythm slows into many pens scratching", "over_s": 0.5}], music=MT + "; rings out into the statement's held pad",
   fix=("NEW", "FACT", "TR"), why="The out: the same pen signs one sentence.")

# ---- sc 30A · THE RACKS · the same day · INSERT (wordless; SN 00000A step 2): the orders arrive, and staff rack them.
# 5.0 s, two bars of the Upsell's 96 BPM: its drive plays on through them; the register's bell rings across (17.07)
MRK = "THE ROOFTOP · the Upsell's drive carries the racks (the walk, the GPU clock, phrase 3 climbing on); the fans under it"
nb("act2", "v35-30A.01", 2.0, "INSERT → MATCH · the packing slip on an INVIDIA crate", "datacenter", "racks", [],
   "MATCH: the purchase order in Mario's hand becomes, in the same place in frame, a packing slip on a crate stencilled INVIDIA: AI CHIPS · QTY: MORE. A box cutter slits the tape; a gloved hand lifts a new board out of its silver sleeve, the INVIDIA logo on its shroud.",
   "The slip is the order's own form (same size, same place, same type), now taped to the crate; the board's shroud carries the logo planted in Act One (7.02, 13.01). A data hall's cold aisle behind, soft; no company named on its walls. Hands only.",
   onscreen={"add": ["INVIDIA", "AI CHIPS · QTY: MORE"]},
   sounds=[{"name": "paper_tear", "at": 0.35, "gain": -30, "note": "the cutter through the slip's tape"}],
   jcut=[{"sound": "the racks' server fans lead the cut", "lead_s": 0.5}],
   music=MRK, fix=("NEW", "TR"),
   why="SN 00000A step 2 (sc 30A): the orders arrive. In: the purchase order (a matched object), the fans leading it by 0.5 s (sound-led).")
nb("act2", "v35-30A.02", 3.0, "MEDIUM → WIDE · the racks: staff slide the boards home", "datacenter", "racks", ["staff"],
   "A row of racks in the cold aisle. Two staff in lanyards slide the new boards home, one after the other; each latch snaps shut. The rack's LEDs come up in a column, climbing to the top of the frame. One of them pats the rack's door, pleased.",
   "Backs and hands, lanyards, sleeves rolled; nobody named. Board 1 slides at 0.3 s and latches at 1.05 s; board 2 slides at 1.2 s and latches at 1.9 s; the LEDs step up from 2.2 s (0.2 s a step), the column climbing off the top of the frame on the cut: it becomes the price's line lifting off in 17.11 (the same upward motion).",
   sounds=[{"name": "folder_slide", "at": 0.3, "gain": -24, "note": "board 1 sliding home in its slot"},
           {"name": "nameplate_off", "at": 1.05, "gain": -22, "note": "board 1's latch snapping shut"},
           {"name": "folder_slide", "at": 1.2, "gain": -25, "note": "board 2 sliding home"},
           {"name": "nameplate_off", "at": 1.9, "gain": -22, "note": "board 2's latch"},
           {"name": "ui_mute_blip", "at": 2.2, "gain": -30, "note": "the LEDs coming up, a step at a time (the sound pass may use the dark room's LED ticks)"},
           {"name": "ui_mute_blip", "at": 2.4, "gain": -30},
           {"name": "ui_mute_blip", "at": 2.6, "gain": -30}],
   lcut=[{"sound": "the fans stop on the cut; the register's bell rings across into the sky", "over_s": 0.1}],
   music=MRK, fix=("NEW", "TR"),
   why="The staff at work on what he bought through the landlord. Out: the LED column climbing off the top of the frame, matched to the price's line climbing off the top in 17.11.")

# ---- sc 32A · THE LAUNCH PARTY · MON SEP 25, 2023 · wordless (SN 00000A step 2): the staff cheer him, and Alyi is
# there, warm with him (a toast, a shared laugh), so his vote lands harder.  10.0 s: exactly four bars of Act Three's
# 96 BPM grid (the score's bar lines before and after it stay where they were)
MPT = "ACT THREE · the party: a short warm lift in the show's voice (the felt swings over brushes and the upright; Alyi's Door on the flute, warm, never cadencing); it gives way to the felt alone on his glass, into the post, as the runner's end did"
nb("act3", "v35-32A.01", 3.75, "WIDE · NopeAI's bullpen, evening: the launch party", "bullpen", "party", ["staff", "mas", "alyi"],
   "The rail rolls on to SEP 25 and the cheer takes the cut: NopeAI's bullpen in the evening, full of staff with cups, a banner over the window: CHATGTP CAN NOW SEE, HEAR AND SPEAK. On the glass behind it, Act One's users line, off the top. Mas and Alyi at the centre of it.",
   "Warm light, the bullpen crowded (staff as figures, nobody named); the banner in the launch post's own words; the users line on the window (sc 18's). Mas with his glass; Alyi beside him, in person, lit.",
   onscreen={"add": ["RAIL: SEP 25, 2023", "CHATGTP CAN NOW SEE, HEAR AND SPEAK"]},
   sounds=[{"name": "synth:cheer", "at": 0.0, "gain": -26, "dur": 1.4, "note": "the staff's cheer takes the cut (the J-cut moves it 0.4 s under the runner)"}],
   jcut=[{"sound": "the party's cheer leads the cut", "lead_s": 0.4}],
   music=MPT, fix=("NEW", "FACT", "TR"),
   why="SN 00000A step 2 (sc 32A): the staff love him, and so does Alyi. In: sound-led, the cheer under the runner's last 0.4 s, on the rail's roll to SEP 25. [P·arch · \"ChatGPT can now see, hear, and speak\" (Sep 25, 2023) · the party itself is INVENTED]")
nb("act3", "v35-32A.02", 2.5, "MEDIUM · the staff cheer as Mas raises his glass", "bullpen", "party", ["mas", "staff"],
   "MAS raises his glass; the staff around him raise their cups and cheer. Two cups clink near the lens.",
   "His glass (the one he carries everywhere) up at 0.3 s; the cheer on it; his one-pixel smile. The clinks at 0.9 and 1.05 s.",
   sounds=[{"name": "synth:cheer", "at": 0.3, "gain": -24, "dur": 1.6},
           {"name": "glass_nudge", "at": 0.9, "gain": -24, "note": "two cups clink"},
           {"name": "glass_nudge", "at": 1.05, "gain": -26}],
   music=MPT, fix=("NEW",), why="The staff's affection, in picture: they cheer him.")
nb("act3", "v35-32A.03", 3.75, "2S · Mas and Alyi: the toast, and a shared laugh", "bullpen", "party", ["mas", "alyi"],
   "ALYI lifts his cup to Mas's glass: they clink. Alyi says something we don't hear; they both laugh, Alyi's hand on Mas's shoulder. The laugh settles; Mas lowers his glass.",
   "Held two-shot, warm. The clink at 0.6 s; the laugh from 1.2 s (shoulders, three held drawings; the sound pass lays a soft laugh in the room, no voice takes); Mas's glass comes down at 3.2 s, and the cut matches it to the same glass on his desk at home (20.01).",
   sounds=[{"name": "glass_nudge", "at": 0.6, "gain": -22, "note": "the toast: Alyi's cup on Mas's glass"}],
   lcut=[{"sound": "the party's walla drains into the dark room's fans", "over_s": 0.6}],
   music=MPT, fix=("NEW", "TR"),
   why="Alyi warm with Mas, so his vote lands harder (sc 45). Out: his glass (a matched object) to the desk at home the next night; the walla trails 0.6 s into the dark room.")

# ---- sc 35 · the president's deepfake, restored from v3.3 (as new beats in v3.5)
nb("act3", "21.03", 4.38, "POV · the signing desk: the real one turns", "whitehouse", "dark", ["nedib", "deepfake"],
   "The real NEDIB turns to look at the copy, pen raised: \"When the hell did I say that?\" His stat row updates: DEEPFAKES OF ME: SEEN 1.",
   "One copy only (the second copy stays un-drawn, as in v3.4's cut). The stat updates on the card from sc 25.",
   lines=[restored("e1-a3-21-04", "start+0.54", 0.0, note="[P · Oct 30, 2023 · about a deepfake of himself (facts #38, §B)]")],
   onscreen={"add": ["RAIL: OCT 30, 2023", "DEEPFAKES OF ME: SEEN 1"]},
   sounds=[{"name": "post_click--chip", "at": 2.892, "gain": -20}],
   music="ACT THREE · the Water Line; the monitor's items play their own audio inside it",
   restore_from="show/reel/ep01-v33/ep01-v33-act3.json#21.03", fix=("REST",),
   why="His own real words are the joke, and they're in his favour (the balance: script-v35-notes §6).")
nb("act3", "21.04", 4.4, "2S·SCR · Mas, the Orb, the two NEDIBs on the monitor (slow drift in)", "screen", "dark", ["mas", "orb"],
   "\"which one's real?\" The Orb's iris flicks across the two NEDIBs and settles on the one with the pen; its toast pops over him: verified: human.",
   "It pays the Orb's \"for when it gets harder to tell.\" (sc 31).",
   lines=[restored("e1-a3-21-06", "start+0.8", 0.0, note="[INVENTED]")],
   onscreen={"add": ["DEEPFAKES OF ME: SEEN 1", "verified: human"]},
   sounds=[{"name": "orb_servo", "at": 2.32, "gain": -26}, {"name": "orb_servo", "at": 2.72, "gain": -26}],
   music="ACT THREE · the Water Line", restore_from="show/reel/ep01-v33/ep01-v33-act3.json#21.04", fix=("REST", "KEEP"),
   why="\"which one's real?\" and the Orb's verdict (the ledger's keep list).")

# ---- sc 41 · THE WAR ROOM · Friday afternoon into night · QUICK-CUT (calls), the pay-back set's 22 s
MWR = "THE WAR ROOM · a driving pulse under the calls (new cue); his calm on top; no score under his lines"
nb("act4", "v35-41.01", seq(0.5, [("v35-vo-03", 0.0)], 0.3), "ECU · his phone on the suite desk, lighting and not stopping", "call", "suite", ["mas"],
   "His phone on the suite desk: calls and messages stacking, tile over tile: GERG · TASYA · MACROSOFT · AUHSOJ · THE FIRST CHECK · FOUNDER MODE · NOR · a grey LAWYER icon.",
   "Tiles only (names and generic avatars; the lawyer never named). The pulse; each new tile a step of light on the desk, never on his face.",
   lines=[line("v35-vo-03", "start+0.5", 0.0)],
   onscreen={"add": ["GERG", "TASYA · MACROSOFT", "AUHSOJ", "THE FIRST CHECK", "FOUNDER MODE", "NOR"]}, music=MWR,
   fix=("NEW", "C10"), why="Sc 41: he's surprised, and working every line he has (The Social Network's grammar).")
nb("act4", "v35-41.02", seq(0.3, [("v35-a4-0001", 0.0), ("v35-a4-0002", 0.45), ("v35-a4-0003", 0.25)], 0.3),
   "2S (tile) · Mas at the desk, Gerg's call tile", "call", "suite", ["mas", "gerg"],
   "GERG's tile, flat: \"They took my chair. Told me after. So I quit.\" MAS: \"you didn't have to.\" GERG: \"Yeah. I did.\"",
   "Gerg's tile: no green glow, no keys (the first time his hands are still). Mas's face doesn't move.",
   lines=[line("v35-a4-0001", "start+0.3", tag="call"), line("v35-a4-0002", "v35-a4-0001", 0.45),
          line("v35-a4-0003", "v35-a4-0002", 0.25, tag="call")],
   music=MWR, tempo_=tempo("quick", {"v35-a4-0002": 0.45, "v35-a4-0003": 0.25}), fix=("NEW",),
   why="Sympathy for Gerg's hurt; his loyalty, shown.")
nb("act4", "v35-41.03", seq(-0.3, [("v35-a4-0004", 0.0), ("v35-a4-0005", 0.45), ("v35-a4-0006", 0.25)], 0.0),
   "2S (tile) · Tasya's call tile", "call", "suite", ["mas", "tasya"],
   "TASYA's tile, warm on top: \"We found out a minute before the rest of the world, Mas. One minute.\" MAS: \"i got a few more.\" TASYA: \"Then we should talk.\"",
   "Tasya's smile never moves; the key ring jangles once, off frame. Her tile rings in under Gerg's last word (J-cut 0.3 s): the calls overlap.",
   lines=[line("v35-a4-0004", "start-0.3", tag="call"), line("v35-a4-0005", "v35-a4-0004", 0.45),
          line("v35-a4-0006", "v35-a4-0005", 0.25, tag="call")],
   music=MWR, tempo_=tempo("quick", {"v35-a4-0005": 0.45, "v35-a4-0006": 0.25}), fix=("NEW",),
   why="Tasya's anger, which becomes Sunday's offer.")
nb("act4", "v35-41.04", round(max(3.1, 0.4 + l("v35-vo-04") + 0.2), 2), "QUICK-CUT · the tiles overlap", "call", "suite", ["mas"],
   "The tiles overlap: AUHSOJ, mid-sentence, \"—the tender's in trouble—\"; FOUNDER MODE's tile lit and silent; NOR's ringing. Over them, faster than he ever thinks.",
   "Three tiles in 3 s, cut on the pulse; FOUNDER MODE is a silent tile in the pay-back set (his fragment is cut).",
   lines=[line("v35-a4-0007", "start-0.3", tag="call"), line("v35-vo-04", "start+0.4", 0.0, overlap=True)],
   music=MWR, tempo_=tempo("quick", note="overlaps: AUHSOJ's fragment under the V.O.'s first word"), fix=("NEW", "C10"),
   why="The money's calls; the rattled count (said calmly at the return).")
nb("act4", "v35-41.05", 2.6, "POV · his post, 9:32 PM; the window now night", "screen", "suite", ["mas"],
   "His post goes up, its card's time 9:32 PM: \"if i start going off, the nopeai board should go after me for the full value of my shares\". The suite's window behind the phone is night.",
   "[V·ID · facts §B: a joke; he has no equity]",
   onscreen={"add": ["9:32 PM", "if i start going off, the nopeai board should go after me for the full value of my shares"]},
   music=MWR, fix=("NEW",), why="A joke, in public, on the night he was fired.")
nb("act4", "v35-41.06", 1.6, "INSERT · the hotel notepad", "void", "suite", ["mas"],
   "The hotel notepad, his pen: NEW COMPANY · MACROSOFT · BACK. The phone lights again at the frame's edge.",
   "Three words, stacked; the pen is the MACROSOFT check's pen. [the weekend's reported options, [H]/[P]]",
   onscreen={"add": ["NEW COMPANY", "MACROSOFT", "BACK"]},
   lcut=[{"sound": "the phone's ring becomes a plane's hum", "over_s": 0.5}], music=MWR + "; out into the hum",
   fix=("NEW", "TR"), why="His three options. Nothing about the staff, the letter, the firing's reasons or family.")

# ---- sc 42 · THE FLIGHT HOME · NOV 18 · INSERT (the pay-back set's 3 s)
nb("act4", "v35-42.01", 3.0, "INSERT · a small plane's tray, daylight", "void", "none", ["mas"],
   "A small plane in daylight. The notepad on his knee: under TERMS, 1. GERG, and his pen keeps writing a second line we can't read. His glass on the tray doesn't ripple in the bump.",
   "The pen is the same pen (it carves at S2.01). The glass's flat line in turbulence.",
   onscreen={"add": ["RAIL: NOV 18", "TERMS", "1. GERG"]},
   lcut=[{"sound": "the plane's hum becomes the dark room's drone", "over_s": 0.6}],
   music="the pulse drops out; the plane's hum; one felt note (relief)", fix=("NEW", "C10", "TR"),
   why="Sc 42: he's chosen; the planner is back. Paid at \"gerg comes back too.\" [his conditions were reported that weekend, [H]]")

# ---- sc 43 · TPOOL · two shots, about 6 s (choice 5A)
FBT = {"when": "2005–08 (no card)", "memory": 3, "of": 3, "tier": "T2a · 240p lo-fi (flashback-map §0.1: the TPOOL era), silhouettes only",
       "in": "the Orb's eye-light on mark 1 (S2.02), a VHS tracking wipe", "out": "back to the desk: the eye-light on mark 3 (S2.05)",
       "guardrail": "silhouettes only; no reason shown; sourced to the WSJ (Dec 2023) via facts L21, never to a 2024 podcast"}
MTP = "TPOOL · lo-fi: the dark room's felt line detuned through a VHS wobble; no drums"
nb("act4", "v35-43.01", 3.5, "WIDE · TPOOL's office, 240p: the first sheet", "office", "office", ["staff"],
   "A small office under a TPOOL decal on the glass. Staff silhouettes pass a single sheet across a table to board silhouettes. The sheet's only words: TO THE BOARD.",
   "240p, tracking lines, silhouettes; the sheet's words legible, nothing else.",
   onscreen={"add": ["TPOOL", "TO THE BOARD"]}, music=MTP, flashback=FBT, style="T2a · 240p lo-fi",
   fix=("C5", "FACT"), why="Choice 5A (two shots, about 6 s: a 3.5 s TPOOL was unreadable before). [H · facts L21: senior staff twice asked the board to fire him]")
nb("act4", "v35-43.02", 2.5, "WIDE · the same, again: he walks out", "office", "office", ["mas", "staff"],
   "The same table: the sheet passed again. Then a young silhouette in two popped collars walks out past it, a nameplate under his arm: CEO. Still in charge.",
   "The same framing as 43.01 (a repeat, one tracking-line jump between them). The nameplate legible.",
   onscreen={"add": ["CEO"]}, music=MTP, flashback=FBT, style="T2a · 240p lo-fi",
   fix=("C5",), why="It's happened before, and he survived. The return's count is a lesson learned here.")

# ---- sc 45 · Alyi's face holds
nb("act4", "v35-45.01", 1.2, "SCR · Alyi's tile: his face holds", "call", "office", ["alyi"],
   "In Alyi's doorway tile, after the click: his reflection's face holds a beat, and nothing on it moves.",
   "Face light, one step. No line.", music="the procedure's pedal only", fix=("NEW",),
   why="Sc 45 (new): a first twinge for Alyi, filled at 49A and 53.")

# ---- sc 49A · ALYI, ALONE · late Sunday into Monday · INSERT (wordless; the pay-back set's 5 s)
nb("act4", "v35-49A.01", 5.0, "WIDE → MCU · Alyi alone in the bullpen at night", "bullpen", "bullpen-night", ["alyi"],
   "The bullpen at night, full of packed boxes. ALYI alone, his phone in his hand: hearts keep landing on RIMA's post, \"NopeAI is nothing without its people\". On the window, Act One's users line, off the top of the glass. He puts a hand near it, not on it.",
   "In person (not a reflection). The boxes are the staff's (for the landlord's building). The line on the glass is sc 18's. No family; nothing about his vote.",
   onscreen={"add": ["RAIL: NOV 20, 2023 · ~2:06 AM PT", "RIMA: “NopeAI is nothing without its people”"]},
   lcut=[{"sound": "the hearts' soft ticks carry across to Mas's phone", "over_s": 0.4}],
   music="no score; the bullpen's night air; the hearts' soft ticks", fix=("NEW", "C10", "TR"),
   why="Sc 49A: the company he built is emptying, and he did it. The cause, shown; his own words come at sc 53. [P · Nov 20, 2023, 2:06 AM PT (facts L11)]")

# ================================================================================================ THE ORDER
# The v3.4 beats that move (everything else keeps its lock order; new beats are inserted where ORDER puts them)
MOVED = {"act4": {"S4.07": "after S4.13d: Neleh's look at the blank line, after Tasya's statement (12A amended)",
                  "S5.03": "before S5.02: the hearts first, so the match from Alyi's phone lands on Mas's phone"}}

# Every v3.4 lock beat once, in the new order, with the new beats in place. Cut beats keep their place.
ORDER = {
    "coldopen": None,   # unchanged
    "act1": ["5.01", "5.02", "5.03", "5.04", "5.05", "5.06", "v3-5.06b", "5.07", "5.08", "5.09", "5.10", "5.11", "5.12",
             "6.01", "6.02", "6.06", "6.08", "6.09", "7.01", "7.02", "v32-7.03",
             "v35-10.01", "v35-10.02", "v35-10.03", "v35-10.04", "v35-10.05", "v35-10.06", "v35-10.07", "v35-10.08",
             "8.01", "8.02", "8.03", "8.04", "8.05", "8.06",
             "v35-12.01", "v35-12.02", "v35-12.03",
             "v35-13.01", "v35-13.02", "v35-13.03", "v35-13.04", "v35-13.05", "v35-13.06",
             "9.01", "9.04", "9.06", "9.07", "9.08", "9.09", "v32-9.10k", "9.10", "9.11", "9.12", "9.13",
             "v31-10.01", "v31-10.02", "v31-10.03", "v31-10.04",
             "v35-18.01", "v35-18.02", "v35-18.03", "v35-19.01", "v35-19.02", "v35-19.03", "v35-19.04",
             "11.01", "11.03", "11.04", "v35-22.01", "v35-22.02", "12.01", "12.02", "v31-12.03", "12.04", "12.05", "12.06", "12.07"],
    "act2": ["13.01", "13.02", "13.03", "13.04", "13.05", "13.06", "13.07", "13.08", "13.09", "13.10", "13.11", "13.12",
             "13.13", "13.14", "14.01", "14.06", "15.01", "15.02", "15.03", "v35-27.00", "15.04", "15.05", "15.06", "15.07",
             "15.10", "15.15", "15.16", "15.11", "15.12", "15.13", "15.14",
             "v35-28.01", "v35-28.02", "v35-28.03", "v35-28.04", "v35-28.05",
             "16.01", "v35-29.01", "v35-29.02", "v35-29.03", "v35-29.04", "v35-29.05",
             "17.01", "17.02", "17.03", "17.04", "17.05", "17.06", "17.07", "17.08", "17.09", "17.10", "v35-30A.01", "v35-30A.02", "17.11", "17.13"],
    "act3": ["v31-18.00", "18.01", "18.02", "18.03", "18.04", "18.04g", "18.05", "18.06", "19.01", "v31-19.03", "v35-32A.01", "v35-32A.02", "v35-32A.03", "20.01",
             "20.03", "20.04", "20.05", "20.06", "v31-20.07", "v31-20.08", "21.02", "21.03", "21.04", "21.05", "v32-21.06",
             "22.01", "22.02", "22.03", "v32-22.04", "23.01", "23.02", "23.03", "23.04"],
    "act4": ["S1.01", "v31-S1.01b", "S1.02", "S1.07", "v31-S1.08d", "S1.09", "S1.10", "S1.11", "S1.12", "v32-S1.13",
             "v35-41.01", "v35-41.02", "v35-41.03", "v35-41.04", "v35-41.05", "v35-41.06", "v35-42.01",
             "S2.01", "S2.02", "v35-43.01", "v35-43.02", "S2.05",
             "v31-S3.00p", "S1.03", "S1.04", "S1.05", "S3.00a", "S3.01", "v35-45.01", "S3.02", "S3.03",
             "S3.04", "S3.04b", "S3.06", "S3.07", "S3.05",
             "S4.01", "S4.02", "S4.08", "v32-S5.00", "S4.09", "S4.10", "S4.10b", "S4.11", "S4.12", "S4.13", "S4.13d",
             "S4.13e", "S4.14", "S4.15", "S4.07", "v35-49A.01",
             "S5.03", "S5.02", "S5.04", "S5.05", "S5.09", "S5.06", "S5.07b", "S5.08", "S5.09-back", "S5.09b",
             "S5.11", "S5.12", "S6.01", "S6.02", "S6.03", "S6.04", "S6.06", "S7.01", "S7.02", "S7.02b",
             "S7.03", "v31-S7.03b", "S7.05", "S7.06", "S7.06-cont", "S7.07", "S7.07-cont", "S7.08", "S7.09", "S7.13",
             "S8.01", "S8.03", "S8.04", "S8.05", "S8.06", "S8.07", "S8.08", "S8.09", "S8.10"],
    "tag": None,
}
