"""make_doc_32.py - write show/episodes/ep01/production/act4/dialogue.md for DRAFT 3.2 (the tightening pass) from the
delivered data: lines.json, qa/qa.json, qa/final_cast.json, qa/pace-3.2.json, reel_cues.json, lines_a4_32 (the spec) and
retired/3.1/lines.json (what it replaces). The pass-1 briefs (unchanged) come from tools/doc_briefs_pass1.md."""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lines_a4_32 as S

REPO = "/home/jgon/project/art/mrmas"
ROOT = os.path.join(REPO, "audio/ep01/act4/dialogue")
DOC = os.path.join(REPO, "show/episodes/ep01/production/act4/dialogue.md")
A = "../../../../../audio/ep01/act4/dialogue"

lines = json.load(open(os.path.join(ROOT, "lines.json")))
old = {e["id"]: e for e in json.load(open(os.path.join(ROOT, "retired", "3.1", "lines.json")))}
qa = json.load(open(os.path.join(ROOT, "qa", "qa.json")))
fc = json.load(open(os.path.join(ROOT, "qa", "final_cast.json")))
pace = json.load(open(os.path.join(ROOT, "qa", "pace-3.2.json")))
reel = json.load(open(os.path.join(ROOT, "reel_cues.json")))
E = {e["id"]: e for e in lines}

TEXT_DESC = {
    "mas-manalt": "soft light baritone, close-mic, level finals; the slowest in any room, never a drawl",
    "mas-manalt-vo": "the same voice, closer and softer: intimate close mic, dry, a touch slower than his scenes, slightly lower; told, never performed",
    "gerg-mockbran": "bright quick tenor-baritone, dry laptop-room close mic, sunny and literal, fastest in the act",
    "alyi": "low, weighty baritone, falling sermon finals; the weight in pitch, not length (hall added in the mix)",
    "mario": "earnest mid baritone, lecture mic with a rolled-off top; his short stops are the joke",
    "rima-tamuri": "composed alto-mezzo with broadcast polish, pleasant, soft landings",
    "neleh": "cool, even mezzo, crisp consonants, precise and polite; questions barely lift",
    "mada": "neutral, muted-grey mid baritone, flat dynamics, a canned courteous non-answer",
    "terb": "tall, dark, brisk baritone, crisp 2 kHz edge, procedural and unbothered",
    "tasya": "warm, soft-onset light baritone with a smile in the air band, gently amused; no accent colour",
    "ttemme": "affable light mid voice through a headset mic, streamer patter",
    "adelina": "warm, brisk mezzo, close and dry, kind finality",
    "tiled-employee": "plain clean mid female voice, earnest question",
}


def f2(x):
    return "–" if x is None else f"{x:.2f}"


def sg(x):
    return "–" if x is None else f"{x:+.1f}".replace("-", "−")


def pct(r):
    return f"{100 * (r - 1):+.0f}%".replace("-", "−")


def spk(e):
    return e["speaker"] + (" (V.O.)" if e["kind"] == "vo" else "")


def main():
    L = []
    w = L.append
    voiced = [e for e in lines if e["voiced_in_cut"]]
    dlg = [e for e in voiced if e["kind"] == "dialogue"]
    vos = [e for e in voiced if e["kind"] == "vo"]
    posts = [e for e in lines if e["kind"] == "post"]
    T = pace["draft_3.2"]["totals"]
    T1 = pace["draft_3.1"]["totals"]
    by = pace["draft_3.2"]["by_character"]
    by1 = pace["draft_3.1"]["by_character"]
    problems = fc["problems"]
    tsm = [e for e in voiced if e.get("pace", {}).get("tsm", 1.0) > 1.0005]
    in_tol = [e for e in voiced if e["kind"] != "vo" and abs(e["voiced_span_s"] / e["target_span_s"] - 1) <= 0.10 and not e.get("derived_from")]
    n_tol = len([e for e in voiced if e["kind"] != "vo" and not e.get("derived_from")])
    ex = reel["exchange_gaps"]
    ov = [e for e in voiced if e.get("overlap_prev_s") is not None]
    cut = [e for e in voiced if e.get("cutoff")]
    takes_total = sum(len(v) for v in qa.values())

    w("# Ep1 · Act Four · Dialogue (casting + recording) · draft 3.2")
    w("")
    w("*Dialogue director + recordist, 2026-09-25. Re-recorded for script **draft 3.2** (the tightening pass) of "
      "[script.md](../../script.md#act-four--the-blip-told-twice), per [tighten-changes.md](tighten-changes.md) §1–§4, which answers "
      "the showrunner's note on animatic v2 (\"why is there so much empty silence in the animatic? the dialogue feels slow…\"). "
      "**Every voiced line is re-taken at pace** (same words, same tags), the removed lines are retired, the new ones are recorded, "
      "and the overlaps and cut-offs the script marks are built into the takes and placed in `lines.json`. These are still **scratch "
      "synthetic voices** (Kokoro-82M stock packs): every take was measured and picked by numbers, and nobody has listened yet. A "
      "human ear pass is the first thing the next stage needs (§12). Draft 3.1's doc and takes are in `retired/3.1/` and the repository "
      "history.*")
    w("")
    w("| | |")
    w("|---|---|")
    w(f"| **Lines** | {len(lines)} rows in draft 3.2 order · **{len(dlg)} dialogue** + **{len(vos)} MAS (V.O.)** voiced in the cut · "
      f"{len(posts)} post pop-ups (unvoiced by house rule; scratch reads unchanged in `optional/`) |")
    w(f"| **This pass** | 6 new · 3 changed · 8 removed (§0) · all {len(voiced) - 1} read lines re-taken for pace, plus the laptop "
      f"\"super.\" re-derived · {takes_total} takes recorded and measured · the 7 posts restaged (the 9:32 post moves to sc 27) |")
    w(f"| **Voiced time** | **{T['audible_s']:.1f} s audible** ({T['file_s']:.1f} s of files, {T['words']} words), against 3.1's "
      f"{T1['audible_s']:.1f} s ({T1['file_s']:.1f} s, {T1['words']} words). On the 3.2 beat model (4:09.4) the dialogue covers "
      f"**{reel['coverage_pct']}%** of the act (v2: 20% of 7:33.8) |")
    w(f"| **Pace** | **{T['wpm_all_reads']} wpm** over every read (words per audible minute; 3.1's takes: {T1['wpm_all_reads']}). "
      f"MAS on camera {by['mas-manalt']['wpm_all']} · MAS (V.O.) {by['mas-manalt-vo']['wpm_all']} · everyone else "
      f"{min(x['wpm_all'] for k, x in by.items() if k not in ('mas-manalt', 'mas-manalt-vo', 'mada', 'tiled-employee'))}–"
      f"{max(x['wpm_all'] for k, x in by.items() if k not in ('mas-manalt', 'mas-manalt-vo', 'mada', 'tiled-employee'))} "
      f"(ALYI slowest, by brief; MADA's canned two-word line {by['mada']['wpm_all']}, the one-line crowd voice {by['tiled-employee']['wpm_all']}) (§1) |")
    w(f"| **Fit** | {len(in_tol)} of {n_tol} on-camera and O.S. reads land within ±10% of their §2 target; the 3 V.O. lines sit inside their "
      f"slots (§4). Time-compression used on {len(tsm)} line{'s' if len(tsm) != 1 else ''} |")
    w(f"| **Overlaps · cut-offs** | {len(ov)} overlaps placed (`overlap_prev_s`) · {len(cut)} hard cut-offs · median gap inside an "
      f"exchange on the model clock **{ex['median_excl_open_by_rule_s']} s** (the two gaps the script holds open excluded; v2: 1.14 s) |")
    w(f"| **Audio** | [`{A}/`]({A}/) · `wav/<id>.wav` 48 kHz/24-bit mono · `mp3/<id>.mp3` 160k · `fallback/` (the V.O. alternate wording) · "
      f"`clean/` (the dry copies of the two processed lines) · `retired/` (removed lines) · `retired/3.1/` (the takes this pass replaces) · "
      f"[`lines.json`]({A}/lines.json) · [`act4-dialogue-reel.mp3`]({A}/act4-dialogue-reel.mp3) (the dialogue stem laid on the 3.2 "
      f"beat model, 4:09.4; dialogue only) |")
    w("| **Levels** | DRY (no reverb/slap). Integrated loudness per line: **dialogue −16.0 LUFS**, **MAS (V.O.) −18.0**, **NELEH on the "
      "call −18.0** (\"≈ 2 dB under RIMA\", §4 row 3), **the laptop-speaker line −22.0**. True peak ≤ −1.5 dBTP, 0 clipped samples. "
      "**Trims: 20 ms head / 40 ms tail** (was 30 / 80); cut-offs end on the cut consonant with no tail. MP3s level-matched to ±0.1 LU |")
    w("| **Engine** | Kokoro-82M v1.0, lang 'a' (General American) stock packs; misaki G2P; pedalboard EQ/comp; Rubber Band (R3, via "
      "pedalboard) for time-compression. No cloning, no reference audio, no accent. Tools: `tools/record_32.py` (+ `lines_a4_32.py`, "
      "`a4pace.py`), `final_cast.py`, `pace_32.py`, `reel_32.py`, `make_doc_32.py` |")
    w("")
    if problems:
        w(f"**QA gate** (`tools/final_cast.py`): format, level to each row's target, true peak, clipping, MP3 level-match, staging fields, "
          f"mouth tracks, and the 3.2 checks (status values, trims ≤ 40 ms, internal pauses ≤ 0.3 s, hard cut-off ends, span against "
          f"target). {len(problems)} item{'s' if len(problems) != 1 else ''} flagged, none a format or level failure:")
        for p in problems:
            w(f"- {p}")
    else:
        w("**QA gate** (`tools/final_cast.py`): every row passes format, level, true peak, clipping, MP3 level-match, staging, mouth-track "
          "and the 3.2 checks (status values, trims ≤ 40 ms, internal pauses ≤ 0.3 s, hard cut-off ends, span against target).")
    w("")
    w("---")
    w("")

    # ------------------------------------------------------------------------------------------------ 0
    w("## 0. What changed for draft 3.2")
    w("")
    w("Line by line against [tighten-changes.md](tighten-changes.md) §1 and the 3.1 `lines.json`. Status values are §1.4's.")
    w("")
    w("| Id | Sc | Speaker | Line | Status | What was done |")
    w("|---|---|---|---|---|---|")
    notes = {
        "new": "recorded", "changed": "re-recorded with the new wording", "rederive": "re-derived from the new take",
        "restaged": "re-taken and restaged", "moved": "moved (unvoiced; not re-recorded)"}
    for e in lines:
        st = e.get("status")
        if st in ("retake-pace", "unchanged"):
            continue
        what = notes.get(st, st)
        if e["id"] == "a4-27-23":
            what = "recorded dry, then a light call filter at −18 LUFS (dry copy in `clean/`); overlaps RIMA's 'soon'"
        elif e["id"] == "a4-27-24":
            what = f"delivered: {'her own a4-27-04 read of the two words, with a 0.12 s stop' if e.get('derived_from') else 'a fresh read matched to her a4-27-04 melody'} (§5)"
        elif e["id"] in ("a4-25-12", "a4-25-13", "a4-27-14", "a4-29-04"):
            what += "; a hard cut-off (§3)"
        elif e["id"] == "a4-27-09":
            what += " (no pause after 'four')"
        elif e["id"] == "a4-27-00":
            what = "the new a4-26-01 take through the same laptop_speaker chain, −22 LUFS"
        elif e["id"] == "a4-27-21":
            what = "re-taken for pace; now O.S. over the blueprint insert (no mouth)"
        elif e["id"] == "a4-26a-01":
            what = "the 9:32 post moves from 26A to sc 27 (27.10, on NELEH's phone), hold 8 beats"
        w(f"| `{e['id']}` | {e['scene']} | {spk(e)} | {e['text']} | **{st}** | {what} |")
    for rid, who, text, why in S.REMOVED_32:
        w(f"| `{rid}` | {rid.split('-')[1].upper()} | {who} | {text} | **removed** | {why}. WAV/MP3 → `retired/`, alternates → `retired/takes/` |")
    rt = [e for e in voiced if e.get("status") == "retake-pace"]
    w(f"| {len(rt)} lines | | | every other voiced line | **retake-pace** | same words, same tag, re-taken at pace; several have a new cue (§2) |")
    post_un = [e["id"] for e in posts if e.get("status") == "unchanged"]
    w(f"| {', '.join('`' + i + '`' for i in post_un)} | | | the other posts | unchanged | unvoiced; holds re-timed to the 3.2 shots (`popup_hold_beats`) |")
    w("")

    # ------------------------------------------------------------------------------------------------ 1
    w("## 1. Pace")
    w("")
    w("**The note** was \"the dialogue feels slow\": v2 measured 129 wpm with a median gap of 1.14 s. The fix sits in three places, and "
      "this pass owns the first two: the read and the trim. The placement (the gaps) is the lock's; §3 gives it the overlaps and fixed gaps "
      "to place from.")
    w("")
    w("**How the pace was set.**")
    w("- **Span first.** Each line has a target: the audible span the 3.2 picture was timed to (§2, ±10%). Kokoro-82M's durations are "
      "deterministic for a given text, pack and speed, and scale as 1/speed, so one probe read per line gives the speed that lands the "
      "*delivered* span (after the chain and trims) on its aim; a take whose carrier moves it more than 5% off is read once more at its own "
      "speed. The §3 per-pack speeds were the starting points, and each line was solved from there (clamped to ×0.85–×1.25 of the start).")
    w("- **The aim.** Everyone aims at the target, except **MAS on camera, whose lines of two or more words aim 8% long** (measured, the "
      "slowest in any room, never sluggish; the cap is +10%), and **the V.O.**, which is paced to its wpm band inside the picture slot "
      "its clearances leave (§4). One-word Mas lines stay at their targets (≤ 0.65 s audible).")
    w(f"- **Light time-compression only at the clamp.** Where the speed solver hit its limit, Rubber Band (R3 engine, formants kept) took "
      f"the rest, at most ×1.10. A few takes were also read slower and brought back to length on purpose, because the slower read "
      f"carried the contour the direction asked for. Delivered with compression: {', '.join('`' + e['id'] + '` ×' + format(e['pace']['tsm'], '.3f') for e in tsm) or 'none'}.")
    w("- **Internal pauses** are set as digital silence inside the read: every full stop or ellipsis inside a line ≤ 0.3 s (MARIO's four "
      "stops 0.12–0.16 s; the memo's '…' the one exception at ≈ 0.4 s). \"Step four will reveal itself.\" has none.")
    w("- **Trims: 20 ms of head and 40 ms of tail silence** (the QA gate checks ≤ 40 ms). Cut-offs have no tail at all.")
    w("- **Contractions** are the script's (\"I've\", \"We'll\", \"What's\", \"it's\", \"don't\") and read as contractions; no line's words were "
      "changed. \"That is the company telling us.\" and \"Everyone is welcome.\" keep their printed, uncontracted forms.")
    w("")
    w("**Measured pace per character.** One measure throughout: words ÷ audible span (10 ms frames above −40 dB of the line's peak, first "
      "to last), summed over the character's lines. *All* = every line; *3+* = lines of three or more words (one-word lines read slow in wpm "
      "by nature, and cut-offs read fast). Copies (the laptop \"super.\"" + (", the lifted \"More. Soon.\"" if E["a4-27-24"].get("derived_from") else "")
      + ") are left out. 3.1 is the same measure on the takes this pass replaces (`retired/3.1/`).")
    w("")
    w("| Character | Lines | Words | Audible s | **wpm (all)** | wpm (3+) | 3.1 wpm (all · 3+) | Speed 3.1 → 3.2 (median) |")
    w("|---|---|---|---|---|---|---|---|")
    import statistics
    for slug, x in by.items():
        y = by1.get(slug, {})
        rows = [e for e in voiced if (e["speaker_slug"] + ("-vo" if e["kind"] == "vo" else "")) == slug and not e.get("derived_from")]
        sp32 = statistics.median([e["pace"]["speed"] for e in rows])
        sp31 = rows[0]["pace"].get("speed_31")
        w(f"| {x['name']} | {x['lines']} | {x['words']} | {x['audible_s']:.2f} | **{x['wpm_all']}** | {x['wpm_3plus'] or '–'} | "
          f"{y.get('wpm_all', '–')} · {y.get('wpm_3plus') or '–'} | {sp31:.2f} → {sp32:.2f} |")
    w(f"| **All reads** | {sum(x['lines'] for x in by.values())} | {sum(x['words'] for x in by.values())} | "
      f"{sum(x['audible_s'] for x in by.values()):.2f} | **{T['wpm_all_reads']}** | | {T1['wpm_all_reads']} | |")
    w("")
    w("*Speed 3.1* is the cast speed in `cast_a4` (3.1's wpm-band loop then slowed many lines further: ALYI and RIMA read at 0.68–0.72, the "
      "V.O. at 0.58–0.61). The per-line speeds are in each row's `pace.speed`.")
    w("")

    # ------------------------------------------------------------------------------------------------ 2
    w("## 2. Every voiced line against its target")
    w("")
    w("Target = tighten-changes §2 (the audible span the picture was timed to). Span = the delivered take's audible span. ± = span against "
      "target. wpm on the audible span. **Cue** = the 3.2 shot and the beat inside it where the line starts (§5). Dur = the file (with its "
      "20 / 40 ms pads).")
    w("")
    w("| # | Id | Speaker | Line | Status | Target | **Span** | ± | wpm | Speed · TSM | Dur · fr | Take | Cue |")
    w("|---|---|---|---|---|---|---|---|---|---|---|---|---|")
    k = 0
    for e in lines:
        if not e["voiced_in_cut"]:
            continue
        k += 1
        p = e["pace"]
        tk = e["take"]
        tt = f"{tk}/{e['takes_tried']}" if e.get("takes_tried") else tk
        sp = f"{p['speed']:.3f}" + (f" · ×{p['tsm']:.2f}" if p.get("tsm", 1) > 1.0005 else "")
        w(f"| {k} | `{e['id']}` | {spk(e)} | {e['text']} | {e['status']} | {e['target_span_s']:.2f} | **{e['voiced_span_s']:.2f}** | "
          f"{pct(e['span_vs_target'])} | {p.get('wpm') or '–'} | {sp} | {e['duration_s']:.2f} · {e['frames_24']} | {tt} | {e['cue']} |")
    w("")
    w("Removed from the cut and from `lines.json`: " + ", ".join(f"`{r[0]}`" for r in S.REMOVED_32) + " (§0).")
    w("")

    # ------------------------------------------------------------------------------------------------ 3
    w("## 3. Overlaps, cut-offs and fixed gaps")
    w("")
    w("**Overlaps** are placed from the previous voiced line's word track, exactly where tighten-changes §4 puts them. In `lines.json`:")
    w("- `overlap_prev_s`: seconds of audible overlap (the previous line's audible end minus this line's audible start); `overlap_prev_frames` the same at 24 fps;")
    w("- `overlap_with`: the previous line; `overlap_place_at_s`: **where this WAV's t = 0 sits on the previous WAV's clock** (lay the file there); `overlap_anchor`: the rule it was placed by.")
    w("")
    w("| Sc · shot | Under | Over | Rule (§4) | `overlap_prev_s` · fr | Place at (s into the under WAV) |")
    w("|---|---|---|---|---|---|")
    for e in ov:
        u = E[e["overlap_with"]]
        w(f"| {e['scene']} · {e['shot_id']} | `{u['id']}` {spk(u)}: {u['text']} | `{e['id']}` {spk(e)}: {e['text']} | {e['overlap_anchor']} | "
          f"**{e['overlap_prev_s']:.3f}** · {e['overlap_prev_frames']} | {e['overlap_place_at_s']:.3f} |")
    w("")
    w("**Cut-offs** are read on into a continuation, so the cut word keeps a mid-sentence contour, then cut at the closure before it (or "
      "inside the word after n phonemes), re-cut after the chain so no processing smears the stop, with a 3 ms de-click ramp and no tail pad. "
      "The QA gate checks each ends loud (a stop, not a decay). The next sound is the cut: a stamp, a line, a tile's exit.")
    w("")
    w("| Id | Line | How | Ends | Span (target) | Next sound |")
    w("|---|---|---|---|---|---|")
    nxt = {"a4-25-12": "the `VOTES: 0` stamp (`rubber_stamp_C`) on the 't' of 'gets'", "a4-25-13": "MADA's \"Good question.\" (overlapping)",
           "a4-27-14": "ADELINA's \"In plain English: no.\" (overlapping)", "a4-29-04": "MAS's \"what are you building?\" (overlapping); Gerg's keys continue",
           "a4-29-09": "her tile's exit"}
    for e in cut:
        how = [x for x in e["processing"] if x.startswith("CUT-OFF")][0].replace("CUT-OFF: ", "")
        w(f"| `{e['id']}` | {e['text']} | {how} | {e['cutoff']['ends_on']} | {e['voiced_span_s']:.2f} s ({e['target_span_s']:.2f}) | {nxt.get(e['id'], '')} |")
    g = E["a4-25-12"].get("sync", {}).get("gets", {})
    if g.get("t_of_gets_f") is not None:
        w("")
        w(f"The stamp lands on the 't' of 'gets': **{g['t_of_gets_s']:.3f} s (frame {g['t_of_gets_f']})** into `a4-25-12` (its `sync`).")
    w("")
    w("**Fixed gaps** the script or §3 sets (`gap_prev_s`, `gap_with`, `gap_place_at_s` = where this WAV's t = 0 sits on the previous WAV's clock):")
    w("")
    w("| Id | Line | Gap after | `gap_prev_s` | Why |")
    w("|---|---|---|---|---|")
    why = {"a4-27-13": "tight on NELEH's 'us' (≤ 3 f)", "a4-29-07": "at least 1 beat after the V.O. (§3, pov-and-framing §5)",
           "a4-30-08": "on the tail of 'Terms?' (≤ 3 f), tight, not overlapped", "a4-30-09": "**exactly 1 beat** after MADA's line: the late beat is the joke",
           "a4-31-02": "tight on Gerg (≤ 4 f)"}
    for e in voiced:
        if e.get("gap_prev_s") is not None:
            w(f"| `{e['id']}` | {e['text']} | `{e['gap_with']}` | {e['gap_prev_s']:.3f} s | {why.get(e['id'], '')} |")
    w("")
    w("Everything else inside an exchange follows the lock's default (tighten-changes §3): a reply starts on the previous line's last "
      "syllable or ≤ 0.3 s after it; conversation cuts land on the turn.")
    w("")
    w("**Check on the 3.2 beat model.** `tools/reel_32.py` lays every delivered take at its §5 cue (shot In + cue beat), or from the "
      "previous line where an overlap or a fixed gap is set, and measures the dialogue stem (`act4-dialogue-reel.mp3`, `reel_cues.json`). "
      "It is the recordist's fit check, not the lock:")
    w(f"- voiced **{reel['voiced_s']:.1f} s of {reel['act_s']:.1f} s = {reel['coverage_pct']}%** of the act (v2: 20% of 453.8 s; "
      f"tighten-changes projected ≈ 62 s, 25%);")
    w(f"- stretches of more than 6 s with no voice: **{reel['silences_over_6s']['count']}, {reel['silences_over_6s']['total_s']:.1f} s** "
      f"(v2: 18, ≈ 304 s; the 3.2 board projects 12, ≈ 138 s). They are the set-pieces (THE PLAN's bars around the diagram, the drop-out and "
      f"F1.2, the exit's screens, the hearts, the avalanche, the landlord's aftermath, the lobby) and every one is scored or carries its own "
      f"sound in tighten-changes §6: the v3 animatic must be cut with that sound, or they will read as silence again;")
    w(f"- median gap between consecutive lines inside an exchange: **{ex['median_excl_open_by_rule_s']} s** (v2: 1.14 s; the target is "
      f"≤ 0.3 s), or {ex['median_s']} s counting the two gaps held open by rule (MAS's 1-beat-late echo and the V.O. clearance before "
      f"\"Everyone is welcome.\");")
    col = reel.get("collisions") or []
    w(f"- unmarked collisions (a take running into the next line's cue): {', '.join(f'`{a}` → `{b}` ({-g:.2f} s)' for a, b, g in col) if col else '**none**'}.")
    w("")
    w("| Silence on the model clock | Starts (s into the act) | Length |")
    w("|---|---|---|")
    for a, d in reel["silences_over_6s"]["list"]:
        w(f"| | {a:.2f} | {d:.2f} s |")
    w("")

    # ------------------------------------------------------------------------------------------------ 4
    x108 = [json.load(open(os.path.join(ROOT, "takes", e["id"] + "-x108", "pick.json"))) for e in vos]
    ocw = [e["qa"]["pace_ref"]["oncam_wpm"] for e in vos]
    w("## 4. MAS (V.O.)")
    w("")
    w("Three lines in 3.2 (D4's \"the meeting ended early.\" and D5's \"i put the phone down.\" are cut). Same performer and pack as his scenes, "
      "the `vo-close` chain, dry, −18 LUFS, told, never performed; the brief is unchanged from 3.1. The V.O. is never overlapped and never overlaps.")
    w("")
    w("**Pace, and a call for the POV owner (script ruling 7).** The ruling states two numbers: ×1.05–1.10 of his new on-camera read of the "
      "same words, and 130–140 wpm (this pass's brief: ~135–145). At the new on-camera pace they disagree. His on-camera voice at its delivered "
      f"speed reads these words at {min(ocw)}–{max(ocw)} wpm, so the first pass, paced at ×1.08, came out at {', '.join(str(x['wpm']) for x in x108)} wpm. "
      "**The delivered V.O. is paced to the wpm band instead:** ×1.15–1.32 of his on-camera read (aim ×1.28), inside each slot, which keeps it "
      "clearly a touch slower and closer than his scenes. The ×1.08 reads are kept as a named alternate in `takes/<id>-x108/` (the pick in "
      f"`pick.json`), so the POV owner can rule either way without a re-record; the ×1.08 set runs {sum(e['voiced_span_s'] for e in vos) - sum(x['span_s'] for x in x108):.2f} s "
      "shorter across the three lines.")
    w("")
    w("| Id | Sc · device | Line | Target | **Span** | wpm | ×on-camera (his read) | Slot max (why) | Final · range | Take |")
    w("|---|---|---|---|---|---|---|---|---|---|")
    for e in vos:
        pr = e["qa"]["pace_ref"]
        w(f"| `{e['id']}` | {e['scene']} · {e['tag'].split('·')[2].strip() if e['tag'].count('·') >= 2 else ''} | {e['text']} | "
          f"{e['target_span_s']:.2f} | **{e['voiced_span_s']:.2f}** | {e['pace']['wpm']} | ×{e['qa']['span_vs_oncam']:.3f} "
          f"({pr['oncam_span_s']:.2f} s at {pr['oncam_speed']:.3f}) | {pr['slot_max_s']:.3f} s ({pr['slot_note']}) | "
          f"{sg(e['qa'].get('final_move_st'))} st · {e['qa'].get('f0_range_st')} st | {e['take']}/{e['takes_tried']} |")
    fb = E["a4-26a-vo1"].get("fallback")
    if fb:
        w(f"| ↳ fallback | 26A · D2 | {fb['text']} | 1.50 | **{fb['voiced_span_s']:.2f}** | {fb['pace']['wpm']} | ×{fb['qa']['span_vs_oncam']:.3f} | "
          f"2.500 s | {sg(fb['qa'].get('final_move_st'))} st · {fb['qa'].get('f0_range_st')} st | {fb['take']}/{fb['takes_tried']} |")
    w("")
    vs = sum(e["voiced_span_s"] for e in vos)
    vw = sum(e["pace"]["words"] for e in vos)
    w(f"Total: {len(vos)} lines, {vw} words, **{vs:.2f} s audible, {round(vw / vs * 60)} wpm**. Why it sits above a plain 135–145: these are "
      f"four-to-six-word lines of short words with no internal stop, and the picture bounds them. \"the badge was a joke.\" can't run past "
      f"1.875 s without moving 29.05's cut (it must end a beat before \"mostly.\"), which is 160 wpm for five words at the most. On the like-for-like "
      f"measure the V.O. is slower than his scenes: his on-camera lines of 3+ words run {by['mas-manalt']['wpm_3plus']} wpm, and every V.O. line "
      f"is ×{min(e['qa']['span_vs_oncam'] for e in vos):.2f}–{max(e['qa']['span_vs_oncam'] for e in vos):.2f} of his own read of the same words.")
    v3 = E["a4-29-vo3"].get("sync", {}).get("asked")
    if v3:
        w("")
        w(f"**The door's first held step:** \"asked\" starts **{v3['t0']:.3f} s (frame {v3['f0']})** into `a4-29-vo3` and ends at frame {v3['f1']}.")
    w("")

    # ------------------------------------------------------------------------------------------------ 5
    w("## 5. The special lines")
    w("")
    e = E["a4-27-00"]
    w(f"**`a4-27-00` \"super.\" through their laptop** (re-derived). No new read: the new `a4-26-01` take ({E['a4-26-01']['take']}), unchanged in "
      f"time, through `laptop_speaker` (330 Hz – 5.4 kHz, the chassis resonance, a little driver distortion, the laptop's levelling), "
      f"**{e['qa']['lufs_i']} LUFS**. The dry copy is `clean/a4-27-00.wav`. `side: none`, `mouth: []`.")
    w("")
    e = E["a4-27-23"]
    w(f"**`a4-27-23` NELEH \"Share what?\" on the call** (new). Read dry and picked like any line ({e['take']}/{e['takes_tried']}), then a "
      f"**light call filter**, thinner than the laptop chain: HPF 200 Hz, LPF 7 kHz (single poles), +1.5 dB at 1.8 kHz, 2.5:1 levelling, no "
      f"saturation; delivered at **{e['qa']['lufs_i']} LUFS**, 2 LU under RIMA (§4 row 3). Dry copy: `clean/a4-27-23.wav`. It overlaps RIMA's "
      f"'soon' by {e['overlap_prev_s']:.3f} s. The two-up tile shows her mouth (`lip_sync`).")
    w("")
    e = E["a4-27-24"]
    r = e["qa"].get("contour_r_vs_a4-27-04_more_soon")
    alts = e.get("alt_takes", [])
    w(f"**`a4-27-24` RIMA \"More. Soon.\"** (new): \"exactly the read of a4-27-04's last two words; the stop ≤ 0.15 s\". Two kinds of candidate were "
      f"scored together: **the two words lifted from her delivered a4-27-04 take** with a 0.12 s stop between them (literally her read), and "
      f"four fresh reads scored on how closely their melody matches those two words. Delivered: **{e['take']}** "
      + ("(the lifted words" if e.get("derived_from") else "(a fresh read") + f"; melody r = {r} against a4-27-04's 'more soon'); "
      f"span {e['voiced_span_s']:.2f} s. Every candidate is in `takes/a4-27-24/`, best first in `alt_takes`: "
      + ", ".join(f"{a['take']} ({a['score']})" for a in alts[:5]) + ".")
    w("")
    m, ec = E["a4-30-08"], E["a4-30-09"]
    w(f"**The calm-off** (`a4-25-02` / `a4-30-08` MADA, `a4-30-09` MAS). MADA's line is still **one master read** for both his lines "
      f"(`takes/mada-good-question/`, {len(qa.get('mada-good-question', []))} takes); `a4-27-22` is cut, so it plays twice, not three times. "
      f"The master and MAS's echo were chosen **as a pair**: {m['take']} × {ec['take']}, melody r = {ec['qa'].get('contour_r_vs_mada')}. "
      f"MADA {m['voiced_span_s']:.2f} s, MAS {ec['voiced_span_s']:.2f} s, laid **exactly one beat apart** (`gap_prev_s` 0.625).")
    w("")
    e = E["a4-29-03"]
    w(f"**`a4-29-03` \"mostly.\"** answers the Orb's look, a shade under the V.O. before it: {e['qa'].get('median_f0_hz')} Hz, "
      f"{sg(e['qa'].get('st_vs_ref'))} st against `a4-29-vo2`, final {sg(e['qa'].get('final_move_st'))} st, {e['voiced_span_s']:.2f} s.")
    w("")

    # ------------------------------------------------------------------------------------------------ 6
    w("## 6. Cast")
    w("")
    w("No casting changes: the same packs and chains as 3.1 (CASTING.md picks for the returning cast; pass-1 picks for the new roles, §11). "
      "Lanes re-measured on the 3.2 lines (`qa/final_cast.json`): median F0, mean per-line range, and the timbre used for §7.")
    w("")
    w("| Character | Lines | Voice (preset) | Text description | Median F0 · range | Speed (3.2, median) |")
    w("|---|---|---|---|---|---|")
    for slug, ln in sorted(fc["lanes"].items(), key=lambda kv: kv[1]["median_f0_hz"] or 0):
        rows = [x for x in voiced if (x["speaker_slug"] + ("-vo" if x["kind"] == "vo" else "")) == slug and not x.get("derived_from")]
        sp = statistics.median([x["pace"]["speed"] for x in rows]) if rows else None
        vid = rows[0]["voiceId"] if rows else ""
        cand = rows[0]["voice"].split("·")[1].strip() if rows else ""
        w(f"| {ln['name']} | {ln['n_lines']} ({ln['total_s']:.1f} s) | `{vid}` · {cand} | {TEXT_DESC.get(slug, '')} | "
          f"{ln['median_f0_hz']} Hz · {ln['mean_range_st']} st | {f2(sp)} |")
    w("")
    w("Silent by design (not recorded): " + "; ".join(f"**{who}** (sc {sc}): {why}" for sc, who, why in S.SILENT_32) + ".")
    w("")

    # ------------------------------------------------------------------------------------------------ 7
    w("## 7. Distinctness where voices share a scene")
    w("")
    w("Measured on the delivered 3.2 lines. ΔF0 in semitones; ΔMFCC = distance between mean MFCC 1–12 vectors (different stock packs land "
      "at ~20–70, variants of one pack at ~10–17); Δcentroid = brightness difference. MAS / MAS (V.O.) is one man at two distances by design.")
    w("")
    w("| Pair | Scenes | ΔF0 | ΔMFCC | Δcentroid | Read |")
    w("|---|---|---|---|---|---|")
    for kp, v in fc["shared_scene_pairs"].items():
        a, b = kp.split("|")
        na, nb = fc["lanes"][a]["name"], fc["lanes"][b]["name"]
        same = {a.replace("-vo", ""), b.replace("-vo", "")} == {"mas-manalt"}
        read = "same man, two distances (by design)" if same else ("**closest: listen**" if v["d_mfcc"] < 20 and v["d_f0_st"] < 2.5 else
                                                                   ("ok (timbre)" if v["d_f0_st"] < 1.5 else "clear"))
        w(f"| {na} / {nb} | {', '.join(v['scenes'])} | {v['d_f0_st']} st | {v['d_mfcc']} | {v['d_centroid_pct']}% | {read} |")
    w("")

    # ------------------------------------------------------------------------------------------------ 8
    w("## 8. Key lines: takes and picks")
    w("")
    w("Kokoro-82M's timing and melody are deterministic for a given text, pack and speed (the seed only moves vocoder noise), so takes vary "
      "what a director varies: the **context** before the line (a lead-in carrier read in the same breath and cut away at the quietest frame, "
      "e.g. \"mostly.\" read straight after \"It was a joke.\"), a **tail** that keeps a final open, a **pace variant** (a take aimed ±5% off), "
      "and the **internal stops**. Each take is scored (lower is better) on ASR accuracy and confidence, the final contour the delivery asks "
      "for, the character's lane, creak, line-specific terms, and the 3.2 pace terms: span against the target (±10%), the pull toward the aim, "
      "compression used, and the longest internal pause. Every term is logged per take in `qa/qa.json` and in each row's `pick_reason`.")
    w("")
    w("| Line | Takes | Delivered | Why (measured) |")
    w("|---|---|---|---|")
    for e in voiced:
        if not e.get("alt_takes"):
            continue
        q = e["qa"]
        w(f"| `{e['id']}` {spk(e)}: {e['text']} | {e['takes_tried']} | {e['take']} · {e['voiced_span_s']:.2f} s · {q.get('median_f0_hz')} Hz · "
          f"range {q.get('f0_range_st')} st · final {sg(q.get('final_move_st'))} st | {e['pick_reason']}. ASR: “{q.get('asr')}” |")
    w("")
    w("Alternates are kept in `takes/<id>/` for these lines and listed best-first in `alt_takes` (the fallback's in `fallback.alt_takes`), so "
      "the ear pass can swap one in without re-recording. Other lines keep only the delivered take; every take's numbers are in `qa/qa.json`.")
    w("")

    # ------------------------------------------------------------------------------------------------ 9
    w("## 9. `lines.json` and mouth cues")
    w("")
    w("A list in draft 3.2 script order (voiced lines and the post pop-ups between them). Paths are relative to the repo root. **Filter the "
      "cut on `voiced_in_cut`** (or `kind != 'post'`); pop-up rows point at `optional/`.")
    w("")
    w("```")
    w("{id, scene, speaker, speaker_slug, text, spoken_as, delivery, tag, mode, voiced_in_cut, on_camera,")
    w(" kind       'dialogue' | 'vo' | 'post'")
    w(" side       'left' | 'right' | 'none'   portrait window: 'none' everywhere in 3.2 except ALYI's post in the 30.01 [P2] box ('right')")
    w(" pov        'his' | 'board'")
    w(" shot, shot_id, cue                     the 3.2 shot (tag + framing) and 'shot, beat n' where the line starts (tighten-changes §2/§5)")
    w(" lip_sync, status                       status: new | changed | retake-pace | rederive | restaged | moved | unchanged")
    w(" target_span_s, voiced_span_s, span_vs_target")
    w(" pace {words, wpm, speed, speed_start_32, speed_31, tsm, aim_s, target_s, longest_internal_gap_s, audible_in_s, audible_out_s}")
    w(" overlap_prev_s?, overlap_prev_frames?, overlap_with?, overlap_place_at_s?, overlap_anchor?   (marked overlaps, §3)")
    w(" gap_prev_s?, gap_with?, gap_place_at_s?                                                  (fixed gaps, §3)")
    w(" cutoff? {type, ends_on, note}  ·  sync? {word: {t0, f0, t1, f1}}   (the stamp's 't' of 'gets', 'Three'/'Four', 'asked', 'below/above/around')")
    w(" file (wav), mp3, duration_s, frames_24, take, takes_tried, pick_reason, alt_takes?,")
    w(" voice, voiceId, model, processing[], mouth[{t,f,shape}], words[{w,t0,t1,f0,f1,ph}],")
    w(" qa{lufs_i, target_lufs, true_peak_dbtp, clipped_samples, median_f0_hz, f0_range_st, final_move_st, wpm, asr, cer, logprob, align_median_s,")
    w("    pace_ref? span_vs_oncam? (V.O.) · below_ref? st_vs_ref? · contour_r_vs_*?},")
    w(" popup_hold_beats? popup_note? (posts) · master? / pair? (the calm-off) · fallback? (a4-26a-vo1) · derived_from? + clean? (a4-27-00; a4-27-23 has clean? only)}")
    w("```")
    w("")
    w("**Mouths.** `lip_sync: true` only where the speaker's mouth is drawn in the 3.2 shot: the `[MCU]`s and `[MCU·door]`s, the reflections, "
      "the wides where the speaker acts (ADELINA, TASYA's landlord, TERB's \"…Ah.\"), the call's two-up (NELEH), Gerg's tiles and NELEH's "
      "avalanche tile, and ALYI in the one box. `mouth: []` for the V.O., O.S. lines (TASYA ×2, TERB's \"Terms?\", NELEH's \"Step four?\"), "
      "the laptop line, and the two lines over a silhouette or an insert: \"super.\" (the 26.09 `[OTS]`), NELEH's \"When?\" (over her silhouette "
      "into the table cut) and \"okay.\" (over his hands). THE PLAN's figures and the all-hands employee keep cues with `lip_sync: false`. "
      "Every voiced row has new cues from its new take; the method is unchanged (Kokoro's word timings carried through every edit, "
      "misaki phonemes → the portrait set A / E / O / M / rest / smile, held on 2s). Word tracks now carry each word's phonemes (`ph`).")
    w("")

    # ------------------------------------------------------------------------------------------------ 10
    here = os.path.dirname(os.path.abspath(__file__))
    w("## 10. House rules applied")
    w("")
    w("Unchanged from 3.1:")
    w("")
    w("- **Never clone, never mimic.** Stock Kokoro packs or averages of them only; every brief was written from the character file's persona and comic function, never from the real person's voice (script header; guardrails §5 'Voices'; CASTING.md §0).")
    w("- **No accent humour; no age, health or disability coding.** Every voice is a General-American pack. A creak/fry detector runs on every take and penalises it.")
    w("- **The V.O. is Mas's alone and never heard in the world.** Same performer, closer; every line [INVENTED], tagged with its device, lowercase. \"mostly.\" answers the Orb's look, not the V.O.")
    w("- **A voice on their call, never a caption.** In pass one Mas is heard only through the board's laptop speaker, processed from the line he already said on his side.")
    w("- **Tags travel with the audio.** [V] lines are spoken verbatim with the parody-name swap; [V/K] (TASYA 'below/above/around') and GERG's re-fetch flags are carried, not resolved. The four new THE PLAN lines are [INVENTED] (the board describing its own public structure).")
    w("- **Posts are pop-ups, never speeches.** The 7 posts are unvoiced (`kind: post`); the spoken ones (TASYA's read-aloud post, ALYI's post from the doorway, Mas's memo) are `kind: dialogue`.")
    w("- **Mas's text stays lowercase** in `text`; pronunciation overrides live in `spoken_as` only (ALYI → /ˈælji/ 'AL-yee', gerg → hard G).")
    w("")
    w("## 11. Briefs and auditions (pass 1, unchanged)")
    w("")
    briefs = open(os.path.join(here, "doc_briefs_pass1.md")).read().split("\n", 1)[1].strip()
    briefs = briefs.replace("Unchanged since pass 1 (no casting changes in draft 3.1).", "Unchanged since pass 1 (no casting changes in draft 3.1 or 3.2; the §3 pace brief of tighten-changes replaces each role's pass-1 'Pace' line).")
    briefs = briefs.replace("### ", "#### ")
    w(briefs)
    w("")

    # ------------------------------------------------------------------------------------------------ 12
    w("## 12. For the next stage")
    w("")
    w("**THE EDITOR (re-lock as `timing-v3`).** Lay each file at its cue (`cue`), and use `overlap_place_at_s` / `gap_place_at_s` where "
      "they're set: those are already in the previous WAV's clock. Cut-offs end on the cut: lay the next sound on the file's end. Word "
      "frames for picture sync are in `sync` and `words`. Every on-camera and O.S. take is within ±10% of the span the board was timed to "
      "except two, and neither needs a cut to move:")
    e14, e08 = E["a4-27-14"], E["a4-29-08"]
    w(f"- `a4-27-14` MARIO \"I've written up some thoughts—\" is {e14['voiced_span_s']:.2f} s against 1.60 s. The target doesn't fit its own shot: "
      "27.22a is 2 beats, the line starts on beat 1.4 and ADELINA comes in 3 f into 'thoughts', 2 f before the cut. That leaves about "
      "1.1–1.2 s for the line, and this read (at MARIO's speed floor) fits it. A 1.6 s read would push ADELINA, and the cut, about half a second late.")
    w(f"- `a4-29-08` MAS \"leave it open.\" is {e08['voiced_span_s']:.2f} s against 1.00 s (+{100 * (e08['span_vs_target'] - 1):.0f}%, one frame past the band). "
      "It's his 8%-long aim and the take with the most level final. 29.17 is a bar long, so nothing moves.")
    w("- The three V.O. lines run 13–23% over their targets by design (§4). Each stays inside the slot its clearances leave, so no cut moves.")
    w("")
    w("**Listen first.** The picks are measured, not heard. The ear pass should confirm or swap (alternates in `takes/`): the pace as a whole "
      "(does anything now sound hurried rather than brisk?), the cut-offs (a stop, not a glitch), the overlaps laid as §3 places them, the three "
      "V.O. lines as a set, \"More. Soon.\" against \"We'll share more soon.\", NELEH's call filter, the calm-off pair a beat apart, and the "
      "one-word Mas lines.")
    w("")
    w("**V.O. pace needs the POV owner's sign-off** (script ruling 7, §4). The delivered V.O. is paced to the wpm band (×1.22–1.31 of his on-camera "
      "read). The ruling's own ratio (×1.05–1.10) is already recorded: `takes/<id>-x108/`, with the pick in `pick.json`. If the owner rules for the "
      "ratio, swap those three files in; they're shorter, so no cut moves.")
    w("")
    w("**Mix notes** (all dialogue is dry; rooms and treatments are yours):")
    w("- **Sound under every stretch without voice** (tighten-changes §6): the v2 animatic was dialogue-only and played its set-pieces as dead air. "
      "The dialogue stem here has the same holes by design (the reel's silences in §3); the temp score and SFX fill them.")
    w("- **Overlaps are two dry files summed.** Keep both intelligible: the second voice rides ≈ 2 dB under where §4 says so (NELEH on the "
      "call is already delivered 2 LU under); nothing ducks the first line's tail. No music under a real line or a card.")
    w("- **MAS (V.O.)** −18 LUFS, lifted +2 dB in the premix (§3 levels); dry and close, no room. No sting or swell under any V.O. line.")
    w("- **`a4-27-00`** at its delivered −22 LUFS under the call's room tone. **`a4-26-01`** is the live mic on his side: keep it fuller than the laptop copy.")
    w("- **ALYI:** his CASTING hall as a send (room 0.8, damp 0.6, ~12% wet, 35 ms pre-delay, send HPF 200 Hz), low in the reflections and the doorway box.")
    w("- **TASYA (O.S.)** \"Everyone is welcome.\" behind the door (low-pass plus a little room), ≥ 1 beat after the V.O., no music under either; "
      "\"leave it open.\" overlaps its tail. \"Hello.\" from the floor.")
    w("- **GERG on the monitor:** a small-speaker EQ, a different speaker from the board's laptop. His keys continue under MAS's overlap.")
    w("- Gaps inside lines are digital silence (pause edits): lay room tone under all dialogue.")
    w("")
    w("**Flags:**")
    fl = []
    for lid, want in (("a4-27-05", "a lift on 'coup?'"), ("a4-29-08", "even and falling"), ("a4-31-02", "pleasant and flat, level or falling"),
                      ("a4-30-09", "Mada's melody, level"), ("a4-29-03", "level or gently falling")):
        q = E[lid]["qa"]
        fl.append(f"`{lid}` {E[lid]['text']} ends {sg(q.get('final_move_st'))} st (asked for: {want})")
    w("- **Finals that miss or only just meet the direction** (a Kokoro limit at these speeds; alternates in `takes/`): " + "; ".join(fl) + ". "
      "\"Is this a coup?\" stayed level or fell on all " + str(E["a4-27-05"]["takes_tried"]) + " takes, including slower reads compressed back to "
      "length. The 3.1 take that lifted was 24% longer than the 3.2 target.")
    q = E["a4-30-12"]["qa"]
    w(f"- **\"okay.\"** now settles ({sg(q.get('final_move_st'))} st), read with a tail (\". Fine.\") cut away. Every read without a tail "
      "(18 across two passes, plain, after a carrier, or slower and compressed) rose, which turned it into a question. Check that the fall isn't too final.")
    w("- **Time-compression** (Rubber Band R3, formants kept) is on " + ", ".join(f"`{e['id']}` {e['text']} (×{e['pace']['tsm']:.2f})" for e in tsm)
      + ". TERB's two are at his speed clamp (am_echo still reads one-word lines long at 1.375). \"mostly.\" is a slower read brought back to length, "
      "because it was the take that sat under the V.O. Check each for smearing; if one smears, `takes/` has uncompressed alternates.")
    w("- `am_michael` (MAS) and `am_adam` (MADA) remain less periodic than the rest (a slightly husky grain; pYIN is gap-filled from YIN). "
      "`am_adam` is Kokoro's lowest-graded pack (F+).")
    w("- The act's closest pairs are listed in §7; if one blurs by ear, the 3.1 remedies still apply (MADA to another master take; TTEMME to `e-liam-headset`).")
    w("")
    open(DOC, "w").write("\n".join(L) + "\n")
    print(f"wrote {DOC} ({len(L)} lines)")


if __name__ == "__main__":
    main()
