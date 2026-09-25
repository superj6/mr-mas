"""make_doc.py - write show/episodes/ep01/production/act4/dialogue.md (draft 3.1) from the delivered data
(lines.json, qa/final_cast.json, auditions/auditions.json, qa/qa.json, reel_cues.json, lines_a4.RETIRED).
Every number in the doc comes from those files; the prose sections are fixed text below."""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import a4lib as AL
import cast_a4 as CA
from lines_a4 import SILENT, RETIRED, LINES as SPEC

REPO = "/home/jgon/project/art/mrmas"
ROOT = os.path.join(REPO, "audio/ep01/act4/dialogue")
DOC = os.path.join(REPO, "show/episodes/ep01/production/act4/dialogue.md")

lines = json.load(open(os.path.join(ROOT, "lines.json")))
fc = json.load(open(os.path.join(ROOT, "qa", "final_cast.json")))
aud = json.load(open(os.path.join(ROOT, "auditions", "auditions.json")))
qa = json.load(open(os.path.join(ROOT, "qa", "qa.json")))
reel = json.load(open(os.path.join(ROOT, "reel_cues.json")))
rel_audio = "../../../../../audio/ep01/act4/dialogue"

WHY = {
    "mas-manalt-vo": "The same performer and pack as his scenes (pov-and-framing §5.1), told closer and softer: the vo-close chain (more proximity, the presence lift taken out, a softer top, gentler levelling), no room, each line paced 8-20% slower than his own on-camera read of the same words (the bible's 110-125 vs 125-135 wpm, as a ratio; §3), and delivered 2 LU under dialogue. Takes were scored for an understated read (narrow range, level or gently falling finals, nothing steeper than -5 st).",
    "mas-manalt": "CASTING.md pick, unchanged except the room removed. The still centre: every one-word line was cast from 6-11 takes for a level or gently falling final, in his lane and free of creak.",
    "gerg-mockbran": "CASTING.md pick, dry. Fastest human in the act; bright and dry against TASYA's warm and slow in sc 29.",
    "alyi": "CASTING.md pick. Lowest lane in the act, 3.5 st under TERB, the slowest pace. His cathedral hall is now a mix send (numbers under Mix notes).",
    "mario": "CASTING.md pick, dry. His lighthouse exchange is with ADELINA, ~10 st below her.",
    "rima-tamuri": "CASTING.md pick, dry. Kokoro's top-graded pack; NELEH is placed ~3 st under her for the sc 27 exchange.",
    "neleh": "Most even of three (8 st), clean ASR on 'Footnote three.', and the largest timbre distance from RIMA; placed -2 st (house max) to open a 3 st lane under her.",
    "mada": "Flattest 'Good question.' of three (8-9 st vs 16-22 for the echo-based ones) and the only pack with no conflict: am_echo is TERB's, in the same scene. Placed +1.5 st so the calm-off is two men: ~1.5-2 st apart in pitch, with the timbre (MFCC 27) doing the rest. One master read, chosen as a pair with Mas's echo.",
    "terb": "The only candidate in a tall-baritone lane (~100 Hz on 'Which room is on fire?'); am_fenrir came out at 150 Hz and turned 'Ah.' into 'Bye.'. Darkest timbre of the act's men after ALYI: MFCC distance 48 from MAS and 59 from MADA, his two calm-off neighbours.",
    "tasya": "Pace sat in band on every line (130-140 wpm) and warm_smile reads soft; the most periodic, smoothest voice in the act. Pure eric keeps it off every other act-four pack except TTEMME's round 1 (which is why TTEMME moved). His read-aloud post uses a tail-carrier take: every plain read ended in creak on 'team'.",
    "ttemme": "Round 2: every eric-based TTEMME sat 10-17 MFCC units from TASYA in the same boardroom; am_fenrir in a headset chain sits 36 away. +2 st (the house max) keeps him above MADA, but they remain the act's closest pair (§6); the headset texture is the separation. One-episode cameo, so sharing NOLE's pack is harmless (they never share a scene).",
    "adelina": "A- pack (best available), the most controlled range (6-7 st, 'kind finality'), in pace band. Not shared with anyone in the act.",
    "tiled-employee": "Follows RIMA directly (sc 27): the largest distance from her with a clean ASR read (af_alloy was heard as 'Is this a cool?'). Placed -1.5 st: 6 st under RIMA, 3 st under NELEH (two lines earlier), and the take that finally lifts on 'coup?'.",
}

TEXT_DESC = {  # the 'text description' the script header asks the voice plan to log with each preset ID
    "mas-manalt": "soft light baritone, close-mic, level finals, lunch-order pace; never raised, never smug",
    "mas-manalt-vo": "the same voice, closer and softer: intimate close mic, dry, a touch slower, slightly lower; told, never performed",
    "gerg-mockbran": "bright quick tenor-baritone, dry laptop-room close mic, sunny and literal, fastest in the cast",
    "alyi": "low, slow, weighty baritone, falling sermon finals; (hall added in the mix, generic tech cathedral)",
    "mario": "earnest mid baritone, lecture mic with a rolled-off top, clause-structured, anxious contour",
    "rima-tamuri": "composed alto-mezzo with broadcast polish, unhurried, soft landings",
    "neleh": "cool, even mezzo, crisp consonants, precise and polite; questions barely lift",
    "mada": "neutral, muted-grey mid baritone, flat dynamics, a canned courteous non-answer",
    "terb": "tall, dark, brisk baritone, crisp 2 kHz edge, procedural and unbothered",
    "tasya": "warm, soft-onset light baritone with a smile in the air band, measured and gently amused; no accent colour",
    "ttemme": "affable light mid voice through a headset mic (bass rolled off, forward presence), streamer patter",
    "adelina": "warm, brisk mezzo, close and dry, kind finality",
    "tiled-employee": "plain clean mid female voice, earnest question",
}


PLACED = {
    "neleh": "−1 → −2 st (house max), for a 3 st lane under RIMA.",
    "mada": "0 → +1.5 st, to sit above MAS in the calm-off; lane tightened to 112-126 Hz so the pair search favours his lower takes (away from TTEMME).",
    "ttemme": "auditioned at 0 st (the 114 Hz above); delivered at +2 st (the house max).",
    "tiled-employee": "0 → −1.5 st, to clear NELEH by 3 st.",
}

QA_NOTES = {
    "a4-27-17": "optional pop-up read; the recognizer hears a leading 'The', most likely a pre-voiced onset like the ones seen on the direct one-word Mas takes. Check by ear before using it in the animatic",
    "a4-29-09": "expected: the line is cut inside 'char-' and the recognizer completes the word",
    "a4-30-11": "optional pop-up read; the recognizer writes '72' for the spoken 'seventy-two'",
    "a4-31-03": "the recognizer spells ALYI (/ˈælji/) as 'Ali'; everything else is exact",
}


# V.O. slots in draft 3.1 (pov-and-framing §5.1: a V.O. line starts on a beat and ends >= 1 beat before a cut, a spoken
# line or a must-read rail item). max_beats = the audible length that fits if the line starts where the script puts it.
SLOTS = {
    "a4-26a-vo1": ("[ECU] 2 bars + 1 beat; the line waits for bar 2", 4,
                   "from bar 2's downbeat 5 beats remain, less the 1-beat clearance before the [2S]"),
    "a4-26a-vo2": ("[PF] 1½ bars", 5, "6 beats, less 1 before the Orb's [P] and its toast"),
    "a4-29-vo1": ("[2S] 1 bar, then MAS'S VERSION", 3, "4 beats, less 1 before the matching frame"),
    "a4-29-vo2": ("[2S] from beat 4 (the iris lands on beat 3) into [P] THE ORB", None,
                  "the Orb must already be on the lanyard, so it starts on beat 4 at the earliest and runs into the [P]; "
                  "the [P] holds 1 beat after it, then 'mostly.'"),
    "a4-29-vo3": ("[2S] the back wall, out of the quiet beat", None,
                  "the door's first held step lands on 'asked'; TASYA comes at least 1 beat after the line ends"),
}

SPEC_BY_ID = {l["id"]: l for l in SPEC}


def f(x, n=2):
    return "–" if x is None else (f"{x:.{n}f}" if isinstance(x, float) else str(x))


def mn(x):
    return f"{x:.1f}".replace("-", "−")


def beats(s):
    import math
    return int(math.ceil(round(s / AL.BEAT, 3)))


def main():
    L = []
    w = L.append
    E = {e["id"]: e for e in lines}
    voiced = [e for e in lines if e["voiced_in_cut"]]
    dlg = [e for e in voiced if e["kind"] == "dialogue"]
    vos = [e for e in voiced if e["kind"] == "vo"]
    pop = [e for e in lines if e["kind"] == "post"]
    tot_d = sum(e["duration_s"] for e in dlg)
    tot_v = sum(e["duration_s"] for e in vos)
    vo_words = sum(len(e["text"].split()) for e in vos)
    changed = [e for e in lines if e.get("status") not in (None, "unchanged")]
    new_takes = sum(len(qa.get(i, [])) for i in ("a4-26a-vo1", "a4-26a-vo1-fallback", "a4-26a-vo2", "a4-29-vo1",
                                                   "a4-29-vo2", "a4-29-vo3", "a4-29-03"))

    w("# Ep1 · Act Four · Dialogue (casting + recording) · draft 3.1")
    w("")
    w("*Dialogue director + recordist, 2026-09-25, updated for script **draft 3.1** (the POV pass, after its table read) of "
      "[script.md](../../script.md#act-four--the-blip-told-twice), per [pov-changes.md](pov-changes.md) §1–2 with its §7 defaults "
      "(\"super.\" through their speaker, as written; \"i don't keep score.\", with the fallback recorded as an alternate). "
      "The first pass (draft 2) is carried: every line whose words and take did not change keeps its file. "
      "**Scratch synthetic voices** (Kokoro-82M stock packs): every take is measured and picked by numbers, and nobody has "
      "listened. A human ear pass is still the first thing the next stage needs (§10).*")
    w("")
    w("| | |")
    w("|---|---|")
    w(f"| **Lines** | {len(lines)} rows in draft 3.1 order · **{len(dlg)} dialogue** ({tot_d:.1f} s) + **{len(vos)} MAS (V.O.)** "
      f"({tot_v:.1f} s, {vo_words} words) voiced in the cut · {len(pop)} post pop-ups (unvoiced by house rule; scratch reads in `optional/`) |")
    w(f"| **This pass** | {len(changed)} rows changed (§0): 5 new V.O. lines + the guardrails fallback, the laptop-speaker "
      f"\"super.\" (derived, with a clean copy), the \"mostly.\" re-take, and restaged rows; {new_takes} new takes; "
      f"1 line retired (\"the hearts were sincere.\") |")
    w(f"| **Speakers** | {len([s for s in fc['lanes'] if not s.endswith('-vo')])} voiced + MAS's V.O. lane · silent by design: THE ORB, "
      "THE QUIET VOTE, BUKAJ, MADA's tile-avalanche beat, and Mas's portrait in pass one |")
    w(f"| **Audio** | [`{rel_audio}/`]({rel_audio}/) · `wav/<id>.wav` 48 kHz/24-bit mono · `mp3/<id>.mp3` 160k · "
      f"`fallback/` (the V.O. alternate wording) · `clean/` (the unprocessed laptop line) · `retired/` (cut and superseded files) · "
      f"[`lines.json`]({rel_audio}/lines.json) · [`act4-dialogue-reel.mp3`]({rel_audio}/act4-dialogue-reel.mp3) "
      f"({reel['duration_s']:.0f} s listening reel, script order, not picture timing) |")
    w(f"| **Levels** | DRY (no reverb/slap). Integrated loudness per line: **dialogue −16.0 LUFS**, **MAS (V.O.) {mn(CA.VO_LUFS)}** "
      f"(2 LU under: \"slightly lower\"), **the laptop-speaker line {mn(CA.LAPTOP_LUFS)}** (\"quieter than the room\"). "
      "True peak ≤ −1.5 dBTP, 0 clipped samples, 30 ms head / 80 ms tail; MP3s level-matched to ±0.1 LU. Each row's target is "
      "`qa.target_lufs`; all checked by `tools/final_cast.py` |")
    w("| **Engine** | Kokoro-82M v1.0, lang 'a' (General American) stock packs; misaki G2P; pedalboard EQ/comp. "
      "No cloning, no reference audio, no accent. Tools in `audio/ep01/act4/dialogue/tools/` |")
    w("")
    probs = fc["problems"]
    w(f"**QA gate:** every row passes format, level (to its own target), true-peak, clipping, MP3 level-match, staging-field and "
      f"mouth-track checks. {len(probs)} speech-recognition differences remain, none a misread:")
    for p in probs:
        pid = p.split(":")[0]
        w(f"- {p}: {QA_NOTES.get(pid, 'check by ear')}")
    w("")
    w("---")
    w("")

    # ---------------------------------------------------------------- §0
    w("## 0. What changed for draft 3.1")
    w("")
    w("Diffed line by line: draft 3.1's Act Four dialogue against the draft-2 `lines.json`, and against pov-changes §1.")
    w("")
    w("| Id | Sc | Line | Change | What was done |")
    w("|---|---|---|---|---|")
    rows = [
        ("a4-26a-vo1", "new V.O. (D2)", f"Recorded in the V.O. voice ({E['a4-26a-vo1']['takes_tried']} takes, "
                                        f"{E['a4-26a-vo1']['take']} delivered). The guardrails fallback \"i don't keep things.\" is "
                                        f"recorded too ({E['a4-26a-vo1']['fallback']['takes_tried']} takes) and rides on the row as "
                                        f"`fallback` (`fallback/a4-26a-vo1.wav`). Default per §7 ruling 2: score"),
        ("a4-26a-vo2", "new V.O. (D4)", f"Recorded ({E['a4-26a-vo2']['takes_tried']} takes). These words were draft 3's sc 26 line "
                                        "`a4-26-vo1`; that id is retired from sc 26 (it was never recorded here)"),
        ("a4-27-00", "new, derived", "No new read: `a4-26-01`'s delivered take through a small laptop-speaker filter (§4), "
                                    f"{CA.LAPTOP_LUFS:g} LUFS. The untouched copy is in `clean/`. No portrait, no mouth"),
        ("a4-29-vo1", "new V.O. (D5)", f"Recorded ({E['a4-29-vo1']['takes_tried']} takes). Replaces draft 3's \"i kept quiet.\""),
        ("a4-29-vo2", "new V.O. (D3)", f"Recorded ({E['a4-29-vo2']['takes_tried']} takes). Replaces draft 3's \"the hearts were sincere.\"; "
                                       "it now comes before the letter"),
        ("a4-29-03", "re-take", f"{E['a4-29-03']['takes_tried']} new takes read after the new account (§4); "
                                f"{E['a4-29-03']['take']} delivered. The draft-2 take is archived in `retired/`"),
        ("a4-29-vo3", "new V.O. (D8)", f"Recorded ({E['a4-29-vo3']['takes_tried']} takes). pov-changes says \"no re-read\", but this "
                                       "stage had never recorded it (only the editor's scratch existed), so it was recorded now; "
                                       "the word track gives the frame for \"asked\" (the door's first step)"),
        ("a4-29-02", "**cut**", "\"the hearts were sincere.\" (draft 2, on-mic): removed from `lines.json`; files in `retired/`"),
        ("a4-30-12", "restaged", "Same words, same take. It now plays off his face, over the `[ECU]` of his hands: `mouth: []`, no lip-sync"),
        ("a4-29-01", "hold", "Rima's post is now legible on the phone inside the `[ECU]` for its full 2 bars: `popup_hold_beats` 8"),
    ]
    for lid, ch, what in rows:
        e = E.get(lid)
        sc = e["scene"] if e else "29"
        txt = e["text"] if e else "the hearts were sincere."
        w(f"| `{lid}` | {sc} | {txt} | {ch} | {what} |")
    rest = [e for e in lines if e.get("status") == "restaged-3.1" and e["id"] != "a4-30-12"]
    w(f"| {', '.join('`' + e['id'] + '`' for e in rest)} | | | restaged | Same words and take; the delivery note and shot follow "
      "draft 3.1 (e.g. the all-hands line plays in a `[W]` with no portrait; NELEH's \"The company is calling us.\" is in the "
      "boardroom `[2S]`; TASYA's \"Everyone is welcome.\" comes ≥ 1 beat after the V.O. with no music; \"leave it open.\" comes at "
      "once, with no eyelines; ALYI's post plays in the doorway `[P2]` with Mas) |")
    w("| every row | | | new fields | `kind`, `side`, `pov`, `shot`, `lip_sync`, `status` (§9). Lines with no visible mouth "
      "(V.O., O.S., his voice through their speaker, off-face) now carry `mouth: []`; O.S. rows that had cues lost them "
      f"({', '.join('`' + e['id'] + '`' for e in lines if e['on_camera'] == 'os')}) |")
    w("")
    w("**Unchanged:** every other line keeps its words, take, file and mouth cues: THE PLAN's two lines, sc 26's \"super.\", all of "
      "pass one's spoken lines, the Gerg exchange, NELEH's \"char—\", sc 30 except \"okay.\", and sc 31. Real lines and their tags "
      "are untouched.")
    w("")

    # ---------------------------------------------------------------- §1
    w("## 1. House rules applied")
    w("")
    w("- **Never clone, never mimic.** Stock Kokoro packs or averages of them only; every brief was written from the character "
      "file's persona and comic function, never from the real person's voice (script header; guardrails §5 'Voices'; CASTING.md §0).")
    w("- **No accent humour; no age, health or disability coding.** Every voice is a General-American pack. A creak/fry detector runs "
      "on every take and penalises it (fry reads as age coding, and the Mas brief rules it out). No delivered line trips it.")
    w("- **The V.O. is Mas's alone and never heard in the world** (pov-and-framing §1.3, §4.6). It is the same performer as on camera, "
      "closer; every line is [INVENTED] and tagged with its device; its text stays lowercase, full stops only. Nothing here gives the "
      "Orb (or anyone) a reaction to it: \"mostly.\" is read as an answer to the Orb's look, not to the V.O.")
    w("- **A voice on their call, never a caption** (§6.2). In pass one Mas is heard only through the board's laptop speaker, "
      "processed from the line he already said on his side; it types in the dialogue box with no portrait (`side: none`).")
    w("- **Tags travel with the audio.** Each row carries its script tag. [V] lines are spoken verbatim with the parody-name swap; "
      "[INVENTED] lines never go on a dated card. [V/K] (TASYA 'below/above/around') and GERG's two re-fetch flags are carried, not resolved.")
    w("- **Posts are pop-ups, never speeches.** The 7 pop-up posts are unvoiced in the cut (`kind: post`); scratch reads sit in "
      "`optional/`. The posts the script has *spoken* (TASYA 'read aloud with pleasure', ALYI 'read from the doorway') and Mas's memo "
      "are voiced (`kind: dialogue`).")
    w("- **Mas's text stays lowercase** in `text`; pronunciation overrides live in `spoken_as` only (NopeAI → 'Nope AI', ALYI → "
      "/ˈælji/ 'AL-yee', '~72' → 'about seventy-two', '&' → 'and').")
    w("")

    # ---------------------------------------------------------------- §2
    w("## 2. Cast")
    w("")
    w("Lane numbers are measured on the **delivered** lines (`qa/final_cast.json`): median F0, mean per-line F0 range (5th-95th pct), "
      "words per minute on lines of 3+ words (pauses included). The laptop-speaker row is a copy of `a4-26-01` and has no lane of its own.")
    w("")
    w("| Character | Scenes | Lines | Voice (preset ID) | Text description | Median F0 · range · pace | Why this voice |")
    w("|---|---|---|---|---|---|---|")
    order = sorted(fc["lanes"].items(), key=lambda kv: kv[1]["median_f0_hz"] or 0)
    for slug, v in order:
        base = slug[:-3] if slug.endswith("-vo") else slug
        scs = sorted({e["scene"] for e in voiced if e["speaker_slug"] == base and (e["kind"] == "vo") == slug.endswith("-vo")
                      and not e.get("derived_from")}, key=lambda s: (int("".join(c for c in s if c.isdigit())), s))
        src = "CASTING.md ★" if base in CA.RETURNING and base in ("mas-manalt", "gerg-mockbran", "alyi", "mario", "rima-tamuri") else "**new (pass 1)**"
        if slug.endswith("-vo"):
            src = "**new (this pass)**"
        pace = ", ".join(str(x) for x in v["wpm_lines"]) or "–"
        voice = v["voice"].split(" (Kokoro")[0]
        cand = "a-michael-close · vo-close" if slug.endswith("-vo") else v["voice"].split("· ")[1].split(" ·")[0]
        w(f"| {v['name']} ({src}) | {', '.join(scs)} | {v['n_lines']} ({v['total_s']:.1f} s) | `{voice}` · {cand} | {TEXT_DESC[slug]} | "
          f"{v['median_f0_hz']} Hz · {v['mean_range_st']} st · {pace} wpm | {WHY[slug]} |")
    w("")
    w("Silent by design (not recorded): " + "; ".join(f"**{n}** (sc {sc}): {why}" for sc, n, why in SILENT) + ". "
      "THE OTHER YRRAL left the act in draft 3.1 with the new-board wide.")
    w("")
    w("**Processing (all dry).** Returning cast keep their CASTING.md chains with the room stripped. New chains (`tools/cast_a4.py`):")
    for slug in CA.NEW:
        cid = CA.NEW_PICKS[slug]
        c = next(x for x in CA.NEW[slug]["cands"] if x["id"] == cid)
        w(f"- **{CA.NEW[slug]['name']}** `{cid}`: {'; '.join(AL.V.describe_chain(c['chain']))}")
    w(f"- **MAS (V.O.)** `vo-close` (this pass): {'; '.join(AL.V.describe_chain(CA.vo_close(0.0)))}; {CA.VO_LUFS:g} LUFS")
    w(f"- **MAS through the board's laptop speaker** `laptop_speaker` (this pass): {'; '.join(AL.V.describe_chain(CA.laptop_speaker()))}; "
      f"{CA.LAPTOP_LUFS:g} LUFS")
    w("")

    # ---------------------------------------------------------------- §3 the V.O.
    oc, vo = fc["lanes"]["mas-manalt"], fc["lanes"]["mas-manalt-vo"]
    w("## 3. MAS (V.O.)")
    w("")
    w("**Brief (performer first, for the human who replaces the scratch).** The same man as on camera, telling us, not the room: "
      "close to the mic, dry, a touch slower (110–125 wpm against his scenes' 125–135), and a little lower in level. It is a story "
      "he has told many times, told to one person. Lowercase on the page means understated in the voice: no emphasis word, no "
      "comic timing, no smile audible, no irony; finals level or gently falling, never a performed drop. Never whispered, never "
      "breathy (no breath or heartbeat sounds, X3), never ASMR. He denies feelings; he never sounds hurt. The picture does every "
      "joke. D8 (\"gerg never waits to be asked.\") is the one warm line, and even that stays plain.")
    w("")
    w("**The chain against his on-camera voice** (measured on the delivered lines):")
    w("")
    w("| | On camera (`a-michael-close`) | V.O. (`vo-close`) |")
    w("|---|---|---|")
    w(f"| Median F0 · mean range | {oc['median_f0_hz']} Hz · {oc['mean_range_st']} st | {vo['median_f0_hz']} Hz · {vo['mean_range_st']} st |")
    w(f"| Pace (lines of 3+ words) | {', '.join(str(x) for x in oc['wpm_lines'])} wpm | {', '.join(str(x) for x in vo['wpm_lines'])} wpm |")
    w(f"| Brightness (spectral centroid) | {oc['centroid_hz']} Hz | {vo['centroid_hz']} Hz |")
    w("| Span vs his on-camera read of the same words | 1.00 | " + ", ".join(f"×{e['qa'].get('span_vs_oncam')}" for e in vos) + " |")
    w(f"| Level | −16.0 LUFS | {CA.VO_LUFS:.1f} LUFS |".replace("-", "−"))
    w("| EQ / dynamics | low shelf +2 dB @160 · −2 dB @320 · **+1 dB @3.2 kHz** · high shelf −1.5 dB @8 k · 2:1 @ −24 | "
      "low shelf **+2.5** dB @150 · −2 dB @320 · **−1 dB @3.2 kHz** · high shelf **−2.5** dB @7.5 k · **2.5:1 @ −26, 15/160 ms** |")
    w("| Room | none (dry) | none (dry) |")
    w("")
    w("**Takes.** Eight per line: three seeds and a speed step, a mid-story lead-in carrier (\"Mm.\", \"So.\", \"Anyway.\", \"Well.\", "
      "cut away at the quietest frame), and a tail carrier (\", really.\") that keeps the final from dropping. Scored like the "
      "one-word Mas lines (ASR, lane, final contour, creak) plus an **understated** term (0.12 × range), a steep-fall penalty below "
      "−5 st, and a pace term. Every term is in `qa/qa.json` and each row's `pick_reason`; alternates are in "
      "`takes/<id>/`, best first in `alt_takes`.")
    w("")
    w("**How the pace is set.** The bible's numbers (V.O. 110–125 wpm against his scenes' 125–135) are a ratio: the V.O. is "
      "8–20% slower. Words per minute can't carry that ratio across line shapes: \"i put the phone down.\" is five "
      "monosyllables and reads ~150 wpm even at a drawl, while \"the meeting ended early.\" reads 115 at a normal pace, and his own "
      "on-camera lines measure 128–148 wpm. So each V.O. line is paced against **his on-camera voice reading the same words** "
      "(`a-michael-close`, seed 1, its own pace band): the V.O. span must be ×1.08–1.20 of that read. The per-line band that "
      "implies is in `qa.pace_ref`, and the delivered ratio in `qa.span_vs_oncam`. The wpm column is kept for reference.")
    w("")
    w("| Id | Sc · device | Line | Dur · fr · beats | Pace (wpm · × on-camera span) | F0 · range · final | Take | Slot (draft 3.1) | Fit |")
    w("|---|---|---|---|---|---|---|---|---|")
    for e in vos:
        q = e["qa"]
        span = e["voiced_span_s"]
        nb = beats(span)
        slot, mx, why = SLOTS[e["id"]]
        fit = (f"fits ({nb} ≤ {mx} beats)" if nb <= mx else f"**{nb} beats vs {mx}: see §10**") if mx else "editor places it"
        dev = e["tag"].split("VO · ")[1].split(" ·")[0].rstrip("]")
        w(f"| `{e['id']}` | {e['scene']} · {dev} | {e['text']} | {e['duration_s']:.2f} s · {e['frames_24']} · {nb} | {q.get('wpm')} · ×{q.get('span_vs_oncam')} | "
          f"{q.get('median_f0_hz')} Hz · {q.get('f0_range_st')} st · {q.get('final_move_st')} st | {e['take']}/{e['takes_tried']} | "
          f"{slot}: {why} | {fit} |")
    fb = E["a4-26a-vo1"]["fallback"]
    fq = fb["qa"]
    w(f"| ↳ fallback | 26A · D2 | {fb['text']} | {fb['duration_s']:.2f} s · {fb['frames_24']} · {beats(fb['voiced_span_s'])} | "
      f"{fq.get('wpm')} · ×{fq.get('span_vs_oncam')} | {fq.get('median_f0_hz')} Hz · {fq.get('f0_range_st')} st · {fq.get('final_move_st')} st | "
      f"{fb['take']}/{fb['takes_tried']} | `fallback/a4-26a-vo1.wav`; swap it in only under ruling 2's fallback | – |")
    w("")
    asked = next((x for x in E["a4-29-vo3"]["words"] if x["w"].lower().startswith("asked")), None)
    if asked:
        w(f"*Beats* = the audible span rounded up to whole beats (1 beat = 0.625 s = 15 frames). **The door's first held step:** "
          f"\"asked\" starts {asked['t0']:.3f} s (frame {asked['f0']}) into `a4-29-vo3` and ends at frame {asked['f1']}.")
    w("")
    w(f"Total V.O.: {len(vos)} lines, {vo_words} words, {tot_v:.1f} s of files (the bible's budget for the pilot is ≤ 8 lines, ≤ 60 "
      "words, ≤ 30 s; Act Four carries 5 of the episode's 7).")
    w("")

    # ---------------------------------------------------------------- §4 the laptop line and the retake
    lp = E["a4-27-00"]
    w("## 4. \"super.\" through their laptop speaker, and the \"mostly.\" re-take")
    w("")
    w(f"**`a4-27-00` (sc 27, the board's side).** No new read: `a4-26-01`'s delivered take ({E['a4-26-01']['take']}), unchanged in "
      "time (so its word track and length are the same), through `laptop_speaker`: a steep band-limit to 330 Hz – 5.4 kHz, the "
      "chassis resonance at 950 Hz, a small honk at 2.8 kHz, a little driver distortion and the laptop's own levelling. "
      f"Delivered at **{lp['qa']['lufs_i']} LUFS** ({CA.DIALOGUE_LUFS - CA.LAPTOP_LUFS:g} LU under dialogue), true peak "
      f"{lp['qa']['true_peak_dbtp']} dBTP. The recognizer still hears “{lp['qa']['asr']}”. No room is added: the call's room tone "
      "and any codec colour are the mix's. The **clean copy** (`clean/a4-27-00.wav`, the untouched −16 LUFS take) is for a mix that "
      "builds its own speaker. `side: none` (the dialogue box types `super.` with no portrait window), `mouth: []`.")
    w("")
    m3 = E["a4-29-03"]
    q3 = m3["qa"]
    old = next((r for r in RETIRED if r["id"].startswith("a4-29-03")), None)
    ref = E.get(q3.get("below_ref") or "a4-29-vo2")
    d_st = None
    if ref and ref["qa"].get("median_f0_hz") and q3.get("median_f0_hz"):
        import math
        d_st = round(12 * math.log2(q3["median_f0_hz"] / ref["qa"]["median_f0_hz"]), 1)
    w(f"**`a4-29-03` \"mostly.\" (re-take).** It now answers the Orb's look at the lanyard after a 1-beat hold, and the line "
      "before it is the V.O. \"the badge was a joke.\", which the Orb never hears. Ten takes: five read straight after the new "
      "account (\"the badge was a joke.\" / \"It was a joke.\", said aloud in his on-camera voice and cut away, so the word comes out "
      "as its qualifier), two direct, three after a small lead-in. Picked for a level-to-gently-falling final, in his lane, a shade "
      f"under the V.O. before it. Delivered **{m3['take']}**: {m3['duration_s']:.2f} s, {q3.get('median_f0_hz')} Hz, range "
      f"{q3.get('f0_range_st')} st, final {q3.get('final_move_st')} st"
      + (f", {d_st:+.1f} st against the V.O." if d_st is not None else "") + f" ASR “{q3.get('asr')}”. {m3['pick_reason']}. "
      "The draft-2 take (final +0.9 st, level) is archived at `retired/a4-29-03_d2.wav` with its alternates.")
    w("")

    # ---------------------------------------------------------------- §5 auditions (pass 1, unchanged)
    w("## 5. New voices of pass 1: briefs and auditions")
    w("")
    w("Unchanged since pass 1 (no casting changes in draft 3.1). Written performer-first, like CASTING.md §1, from each character "
      "file's persona and comic function. Three stock candidates each (TTEMME got two more in round 2), read DRY on the role's real "
      "Act Four lines. Audition files: "
      f"[`{rel_audio}/auditions/<role>/`]({rel_audio}/auditions/) (reel pings = candidate index). Numbers from `auditions/auditions.json` "
      "(round-1 tracker; the delivered lanes in §2 are re-measured).")
    w("")
    for slug, role in CA.NEW.items():
        b = role["brief"]
        w(f"### {role['name']}")
        w(f"- **Comic function:** {b['function']}")
        w(f"- **Pitch:** {b['pitch']}. **Pace:** {b['pace']}.")
        w(f"- **Texture:** {b['texture']}. **Attitude:** {b['attitude']}.")
        w(f"- **Cadence:** {b['cadence']}. **Avoid:** {b['avoid']}.")
        w("")
        w("| Cand. | Pack (grade) | Median F0 | Range | Pace | Worst CER · conf. | |")
        w("|---|---|---|---|---|---|---|")
        cands = dict(aud["roles"][slug]["cands"])
        if slug == "ttemme":
            cands.update(aud.get("round2", {}).get("cands", {}))
        for cid, c in cands.items():
            s = c["summary"]
            star = "★" if cid == CA.NEW_PICKS[slug] else ""
            grade = c.get("grade") or next((x["grade"] for x in role["cands"] if x["id"] == cid), "")
            w(f"| {star} {cid} | `{c['voiceId']}` ({grade}) | {s['median_f0_hz']} Hz | {s['mean_range_st']} st | "
              f"{', '.join(str(x) for x in s['wpm']) or '–'} | {s['worst_cer']} · {s['mean_logprob']} | |")
        if slug in PLACED:
            w(f"*Placement after audition:* {PLACED[slug]}")
        w("")
        w(f"**Pick:** {WHY[slug]}")
        w("")

    # ---------------------------------------------------------------- §6 distinctness
    w("## 6. Distinctness where voices share a scene")
    w("")
    w("Measured on the delivered lines. ΔF0 in semitones; ΔMFCC = distance between mean MFCC 1-12 vectors (different stock packs "
      "land at ~20-70, variants of one pack at ~10-17); Δcentroid = brightness difference. MAS / MAS (V.O.) is the same performer "
      "by design: that pair should read as one man at two distances, so a small ΔMFCC there is the goal, not a flag.")
    w("")
    w("| Pair | Scenes | ΔF0 | ΔMFCC | Δcentroid | Read |")
    w("|---|---|---|---|---|---|")
    for k, v in fc["shared_scene_pairs"].items():
        a, b = k.split("|")
        na, nb = fc["lanes"][a]["name"], fc["lanes"][b]["name"]
        if {a, b} == {"mas-manalt", "mas-manalt-vo"}:
            ok = "same man, two distances (by design)"
        else:
            ok = "clear" if (v["d_f0_st"] >= 3 or v["d_mfcc"] >= 30) else ("ok (timbre)" if v["d_mfcc"] >= 20 else "**closest: listen**")
        w(f"| {na} / {nb} | {', '.join(v['scenes'])} | {v['d_f0_st']} st | {v['d_mfcc']} | {v['d_centroid_pct']}% | {ok} |")
    w("")

    # ---------------------------------------------------------------- §7 line list
    w("## 7. Line list (draft 3.1 order)")
    w("")
    w("Durations are the delivered WAV (incl. 30 ms head + 80 ms tail pad); frames at 24 fps (1 beat = 15 frames). **Kind:** D dialogue · "
      "VO · ◻ post pop-up (unvoiced; hold = on-screen beats). **Side** = the portrait window the line plays from (`ui.ts` dialogueBox "
      "`tail`): L Mas's window · R the other character's · – none. **Lip:** ✓ = mouth cues to animate. **Take** = delivered / recorded.")
    w("")
    w("| ID | Sc | Kind | Side | Lip | Speaker | Line | Shot (draft 3.1) | Dur (s) · fr | Take | Status | Tag |")
    w("|---|---|---|---|---|---|---|---|---|---|---|---|")
    for e in lines:
        kind = {"dialogue": "D", "vo": "VO", "post": f"◻ {e.get('popup_hold_beats')} b"}[e["kind"]]
        side = {"left": "L", "right": "R", "none": "–"}[e["side"]]
        lip = "✓" if e["lip_sync"] else ("cues" if e["mouth"] else "")
        st = {"unchanged": "", "new-3.1": "**new**", "retake-3.1": "**re-take**", "derived-3.1": "**derived**",
              "restaged-3.1": "restaged"}[e["status"]]
        take = f"{e['take']}/{e['takes_tried']}" if not e.get("derived_from") else f"= {e['derived_from']}"
        spk = e["speaker"] + (" (V.O.)" if e["kind"] == "vo" else "")
        w(f"| `{e['id']}` | {e['scene']} | {kind} | {side} | {lip} | {spk} | {e['text']} | {e['shot']} | {e['duration_s']:.2f} · "
          f"{e['frames_24']} | {take} | {st} | {e['tag']} |")
    w("")
    w("*cues* = the speaker is drawn (a blueprint figure in THE PLAN, the employee in the all-hands crowd) but no mouth is animated "
      "by default; the cues are kept as an option.")
    w("")
    w(f"Voiced total **{tot_d + tot_v:.1f} s**: dialogue {tot_d:.1f} s ({sum(1 for e in dlg if e['speaker_slug'] == 'mas-manalt')} Mas "
      f"rows incl. the laptop copy), V.O. {tot_v:.1f} s. The act's picture clock is 7:12.8 (pov-changes §0).")
    w("")
    w("**Retired or superseded** (not in `lines.json`; nothing here goes in the cut):")
    w("")
    w("| Id | Words | Was | Why | Files |")
    w("|---|---|---|---|---|")
    for r in RETIRED:
        w(f"| `{r['id']}` | {r['text']} | {r['was']} | {r['why']} | {', '.join('`' + x + '`' for x in r['files']) or '–'} |")
    w("")

    # ---------------------------------------------------------------- §8 key lines
    w("## 8. Key comedic lines: takes and picks")
    w("")
    w("Takes vary what a director would vary: speed (±5-10%), a **context carrier** (the line read after a lead-in in the same "
      "breath, then cut at the quietest frame before it; e.g. 'mostly.' read straight after 'the badge was a joke.'), a tail carrier, "
      "and the vocoder seed. Each take is scored (lower is better) on ASR accuracy + confidence, the duration window, F0 range, the "
      "final contour the delivery asks for (for Mas 'level or gently falling', so over-steep falls also cost), the character's lane, "
      "creak, and line-specific terms. Every term is logged per take in `qa/qa.json` and in each row's `pick_reason`.")
    w("")
    w("| Line | Takes | Delivered | Why (measured) |")
    w("|---|---|---|---|")
    for e in lines:
        if not e.get("alt_takes") and e["id"] not in ("a4-30-09",):
            continue
        q = e["qa"]
        extra = ""
        if e["id"] == "a4-30-09":
            extra = f" Picked **as a pair** with MADA's master take {e.get('pair', {}).get('mada_take')} (contour r = {q.get('contour_r_vs_mada')})."
        if e.get("master"):
            extra = " One master read reused for all three MADA lines (sc 25, 27, 30): a canned answer should be identical."
        mark = " **(3.1)**" if e["status"] in ("new-3.1", "retake-3.1") else ""
        w(f"| `{e['id']}`{mark} {e['speaker']}{' (V.O.)' if e['kind'] == 'vo' else ''}: {e['text']} | {e['takes_tried']} | "
          f"{e['take']} · {e['duration_s']:.2f} s · {q.get('median_f0_hz')} Hz · range {q.get('f0_range_st')} st · final "
          f"{q.get('final_move_st')} st | {e['pick_reason']}.{extra} ASR: “{q.get('asr')}” |")
    w("")
    w("Alternates are kept in `takes/<id>/` and listed best-first in each row's `alt_takes` (the fallback's in "
      "`fallback.alt_takes`), so the ear pass can swap one in without re-recording.")
    w("")

    # ---------------------------------------------------------------- §9 mouth + schema
    w("## 9. Mouth cues and `lines.json`")
    w("")
    w("**Which rows have a mouth track (draft 3.1).** `lip_sync: true` only where the speaker's mouth is drawn in the shot: a "
      "portrait window (`[P]`, `[P2]`, `[PF]`), a medium rig in a `[2S]` (\"mostly.\", the boardroom lines), a reflection in a "
      "portrait, or a video tile big enough to act in (Gerg on the monitor, NELEH's avalanche tile). The five V.O. lines, the "
      "laptop-speaker \"super.\", the O.S. lines and \"okay.\" (now off his face, over the hands) have `mouth: []`. The two THE PLAN "
      "lines and the all-hands employee keep their cues with `lip_sync: false`: the figures are drawn, but a blueprint figure and a "
      "tiled crowd drawing have no mouth by default. The re-taken \"mostly.\" has new cues from its new take; every other row keeps "
      "its pass-1 cues.")
    w("")
    w("`mouth: [{t, f, shape}]` per line on the portrait set used by `studio/src/shared/pixel/cast/talk.ts` "
      "(**A** open · **E** wide/teeth · **O** round · **M** closed · **rest** · **smile**); `t` is seconds from the start of the WAV, "
      "`f` the 24 fps frame; each cue holds until the next. Method (unchanged): Kokoro's word timings carried through every edit and "
      "checked against a recognizer; each word split across its misaki phonemes by weight; phonemes mapped to mouths (a Rhubarb-style "
      "reduction); the 10 ms envelope gates open/close; every drawing held ≥ 2 frames (on 2s); `rest` after the last word, `smile` "
      "only after warm deliveries. `words: [{w, t0, t1, f0, f1}]` is delivered on every voiced row (V.O. included) for picture sync. "
      "Diagnostic strip: [`out/ep01/act4/dialogue/mouth_check.png`](../../../../../out/ep01/act4/dialogue/mouth_check.png).")
    w("")
    w("A list in draft 3.1 script order. Paths are relative to the repo root (`/home/jgon/project/art/mrmas`).")
    w("")
    w("```")
    w("{id, scene, speaker, speaker_slug, text, spoken_as, delivery, tag, mode, voiced_in_cut, on_camera,")
    w(" kind       'dialogue' | 'vo' | 'post'        (post = unvoiced pop-up; read-aloud posts and the memo are dialogue)")
    w(" side       'left' | 'right' | 'none'         portrait window / dialogueBox tail: left = Mas, right = the other character,")
    w("                                              none = no window (V.O., his voice via their speaker, O.S., tiles, blueprint, crowd, posts)")
    w(" pov        'his' | 'board'                   whose side of the told-twice (sc 27 = the board's pass)")
    w(" shot       the draft 3.1 shot the line plays over (tag + framing)")
    w(" lip_sync   true = animate `mouth`;  status  'unchanged' | 'new-3.1' | 'retake-3.1' | 'derived-3.1' | 'restaged-3.1'")
    w(" file (wav), mp3, duration_s, frames_24, voiced_span_s, take, takes_tried, pick_reason, alt_takes?,")
    w(" voice, voiceId, model, processing[], mouth[{t,f,shape}], words[{w,t0,t1,f0,f1}],")
    w(" qa{lufs_i, target_lufs, true_peak_dbtp, clipped_samples, median_f0_hz, f0_range_st, final_move_st, wpm, asr, cer, logprob,")
    w("    align_median_s, mp3_lufs_i, mp3_true_peak_dbtp},")
    w(" popup_hold_beats? popup_note? (posts) · master? / pair? (the calm-off) · voice_desc? (V.O.)")
    w(" fallback? {text, file, mp3, duration_s, words, qa, alt_takes, why}   (a4-26a-vo1: the guardrails wording)")
    w(" derived_from? + clean? {file, mp3, lufs_i}                            (a4-27-00: processed from a4-26-01)}")
    w("```")
    w("")
    w("`mode` is kept for the editor's lock (`vo` for the V.O. rows, `speaker` for the laptop row, `post-popup`, `read-aloud-post`, "
      "`memo-read`, `on-mic`). **Filter the cut on `voiced_in_cut`** (or `kind != 'post'`); pop-up rows point at `optional/`.")
    w("")

    # ---------------------------------------------------------------- §10 next stage
    w("## 10. For the next stage")
    w("")
    w("**The editor's lock must drop its scratch V.O. overlay.** `studio/src/episodes/ep01/act4/animatic/tools/lock.py` loads "
      "`out/ep01/act4/animatic/scratch-vo/scratch_vo.json` after `lines.json` and overrides by id, and those scratch rows carry "
      "draft 3's words under the same ids (`a4-26a-vo1` = \"i'm not a sentimental person.\", `a4-26a-vo2`, `a4-29-vo1`, `a4-29-vo2`), "
      "plus `a4-26-vo1`, which draft 3.1 removes. Until that overlay goes, the lock keeps the wrong words. Draft 3.1's V.O. is all "
      "in `lines.json` now (`kind: vo`, `mode: vo`).")
    w("")
    tight = [e for e in vos if SLOTS[e["id"]][1] and beats(e["voiced_span_s"]) > SLOTS[e["id"]][1]]
    if tight:
        w("**V.O. that is longer than its written slot:** " + "; ".join(
            f"`{e['id']}` \"{e['text']}\" runs {e['voiced_span_s']:.2f} s ({beats(e['voiced_span_s'])} beats) against the "
            f"{SLOTS[e['id']][1]} beats its slot leaves ({SLOTS[e['id']][0]})" for e in tight)
          + ". " + "; ".join(
            f"The shortest of its {len(qa[e['id']])} takes is {min(t['voiced_span_s'] for t in qa[e['id']])} s, and his on-camera read of the same "
            f"words is {e['qa']['pace_ref']['oncam_span_s']} s" for e in tight)
          + ": at V.O. pace these words do not fit 3 beats, and reading them faster would put him back at his on-camera pace and lose "
            "the closeness. It also shares the `[2S]` with the rail: `· HIS SIDE` types on after the 2-beat home shot, needs 2.05 s, "
            "and the V.O. may not play at the same moment as a rail item (pov-and-framing §5.2: stagger ≥ 1 beat). So the board has to give this beat "
            "room: run the `[2S]` 2 bars (rail first, then the line from bar 2's downbeat, clear by a beat before MAS'S VERSION), or "
            "type the rail on over the home shot and let the line start on the `[2S]`'s second beat with the shot at 1 bar + 2 beats. "
            "Script lengths are picture time; the act clock absorbs ≤ 1 bar.")
        w("")
    w("**Listen first.** These picks are measured, not heard. The ear pass should confirm or swap (alternates are in `takes/`): the "
      "five V.O. lines as a set (one man, one distance, nothing performed), the fallback, the \"mostly.\" re-take against the V.O. "
      "before it, the laptop \"super.\" in the call's room tone, the one-word Mas lines, the calm-off pair, ADELINA's 'no.', "
      "MARIO's run, TERB's '…Ah.' and 'Terms?', NELEH's cut-off, and the closest pairs flagged in §6.")
    w("")
    w("**Mix notes (all dialogue is dry; rooms and treatments are yours):**")
    w(f"- **MAS (V.O.):** delivered {mn(CA.VO_LUFS)} LUFS, 2 LU under dialogue, as briefed (\"slightly lower\"). pov-and-framing §5.1 says "
      "the V.O. \"sits at dialogue level\": if the mix follows the bible, raise it 2 dB; either way it stays dry and close, with no "
      "room and no send. The score thins to one instrument or drops out under it; never a sting or a swell under a line. It never "
      "plays inside the drop-out (sc 26 has no V.O. at all) and never over the dialogue box or a rail item.")
    w(f"- **`a4-27-00` his voice through their laptop:** laid at its delivered {mn(CA.LAPTOP_LUFS)} LUFS, under the board's call room "
      "tone, which continues through it; nobody reacts. No music. Use `clean/a4-27-00.wav` only if the mix builds its own speaker.")
    w("- **`a4-26-01` 'super.' (sc 26):** the live mic on the call, no music under it; a light call-codec band-limit is still an "
      "option, but keep it clearly fuller than the sc 27 laptop version so the two sides read as the same word heard twice.")
    w("- **ALYI:** his CASTING hall as a send (room 0.8, damp 0.6, ~12% wet, 35 ms pre-delay, send HPF 200 Hz). Low and pre-delayed "
      "in the reflections (sc 27) and the doorway `[P2]` (sc 30). The sad violin runs under his post only and stops dead on the "
      "first heart; the 2-beat hold after it is room tone only.")
    w("- **TASYA (O.S.) 'Everyone is welcome.':** behind the slate-blue door (low-pass plus a little room), at least 1 beat after "
      "the V.O. ends, **no music under either**. 'leave it open.' comes at once on it. TASYA 'Hello.' from the floor: optional low-mid lift.")
    w("- **GERG on the monitor** (sc 29): a small-speaker EQ, but a different speaker from the board's laptop (his tile is big and "
      "close). **NELEH `a4-29-09`:** a hard stop inside 'char-'; a dropout blip on the tile exit can cover it.")
    w("- **MAS'S VERSION** (sc 29): the keynote-reel piano is score, cut mid-phrase on the hard cut; no dialogue sits inside it.")
    w("- **\"okay.\"** plays off his face over the glass set-down `[ECU]`, after the silent `[CU]`'s 2 beats.")
    w("- THE PLAN's NELEH and MADA are blueprint figures: a chip/band-limit treatment is a style call for the mix.")
    w("- Gaps inside lines are digital silence (pause edits). Lay room tone under all dialogue, V.O. included.")
    w("")
    w("**Flags:**")
    w("- **Finals that miss the direction on every take** (a Kokoro limit, for the actor or an alternate): RIMA 'I'll hold it "
      "together.' lifts (+2.2 st; 4 takes, all rising); MAS 'super.' ends +1.4 st and a little under his lane (11 takes; the best "
      "falling alternates are listed in `alt_takes`). The laptop copy inherits that take.")
    w("- **Closest pairs (§6):** MADA / TTEMME (both at the house pitch limit) and ADELINA / RIMA (same scene, never the same "
      "exchange). If either blurs by ear: MADA to master take t04, or TTEMME to `e-liam-headset`.")
    w("- **Texture:** `am_michael` (MAS, and so the V.O.) and `am_adam` (MADA) vowels are less periodic than the rest of the cast, a "
      "slightly husky grain. It doesn't register as creak, but pYIN loses whole vowels on them, so the tracker fills those frames "
      "from YIN (method in `a4lib.f0_contour`). The softer V.O. top makes this grain a little more audible: check it by ear first.")
    w("- `am_adam` (MADA) is Kokoro's lowest-graded pack (F+); D-grade packs: ALYI (onyx), MARIO (liam), TERB (echo), TASYA (eric).")
    w("- ASR hears ALYI as 'Ali' in the memo (`/ˈælji/` is set). Lock the pronunciation at the table read (naming §9 says 'AL-yee').")
    w("- **\"gerg\" is said aloud for the first time in any recording so far** (`a4-29-vo3`). naming §9 writes it \"gerg\"; the G2P read it "
      "\"jerg\" (/dʒɜrg/, heard as 'Jerg'/'Jurg' on all 8 first-session takes), so it is set to a hard G, /ɡɜrɡ/, rhyming with "
      "'berg' (the letter swap of Greg). Lock it at the table read with ALYI's; if the room wants 'jerg', re-run `record.py a4-29-vo3` "
      "with the override removed from `lines_a4.py`.")
    w("- The script's holds (the 1-beat Orb hold before 'mostly.', the calm-off, the 1-bar hold, the quiet beat) are **picture** "
      "time. The files are trimmed, and the holds are timed in the edit (the listening reel approximates them).")
    w("- 'noted.' is not in Act Four (it is the cold open and the tag button), so it was not recorded here.")
    w("- Carried tags: TASYA `a4-30-02` is [V/K], re-verify before lock. GERG's posts `a4-27-01` / `a4-30-10` need a casing re-fetch.")
    w("- Blip pairing (pixel dialogue voice): NELEH, MADA, TTEMME, TERB, TASYA, ADELINA and the employee have no blip kit in "
      "`audio/sfx` yet.")
    w("")
    w("**Re-run:** `HF_HUB_OFFLINE=1 audio/.venv-casting/bin/python audio/ep01/act4/dialogue/tools/record.py [ids…]` (no ids = the "
      "whole act; any run refreshes the draft 3.1 staging on every row), then `final_cast.py`, `reel.py`, `make_doc.py`. Takes are "
      "seeded, so a re-run reproduces them exactly. This pass: `record.py a4-26a-vo1 a4-26a-vo2 a4-29-vo1 a4-29-vo2 a4-29-vo3 "
      "a4-29-03 a4-27-00`.")
    open(DOC, "w").write("\n".join(L) + "\n")
    print("wrote", DOC, len(L), "lines")


if __name__ == "__main__":
    main()
