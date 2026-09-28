#!/usr/bin/env python3
"""el_render.py - render any MR. MAS lines file with the ElevenLabs cast (track A4, pass v3-voices-el).

  plan    read a lines file, resolve every speaker to a cast role, print the rows and the character cost per set.
          No API calls.
  render  render every row with the cast voice for the chosen set(s), dress each take to the house format
          (48 kHz / 24-bit mono WAV, -18 LUFS integrated, -1.5 dBTP, dry, room-tone handles) and write a lines JSON
          per set in the fastrec format. Resumable: a take whose request (voice, model, settings, text as sent, seed)
          is unchanged is never sent again; its cached MP3 is re-dressed locally if the dressing changed.
  qa      re-measure every take listed in a set's lines JSON and print a table.

Lines files it reads (auto-detected):
  * a stick/reel timeline (dict with "beats": [{"id", "lines": [{"id", "who", "text", "tag", "audio"}]}]), e.g.
    show/reel/trials/ep01-v3-sample.json or the v3 lock show/reel/ep01-v3/<seg>.json;
  * a fastrec lines JSON (a list of rows with "id", "speaker_slug" or "speaker", "text");
  * a beat plan (full-v3/beat-plan/<seg>.json): only rows that carry their own "text" and "who".

Resumable and cheap to re-run: every request is cached by its key (voice, model, settings, text as sent, seed) in
audio/ep01/v3-el/cache/ (git-ignored), and a take whose key is unchanged is never sent again. A changed line (new text,
new voice or new settings) is the only thing that costs characters. --max-chars stops a run before it overspends.

QA per take (all local): LUFS, true peak, head/tail silence, pace, median F0 and range, and an ASR read
(faster-whisper small.en) scored for recall. --retry-bad sends one new-seed take when ASR recall < 0.8 or the raw audio
stops while still sounding; --retry-pitch sends one when a take sits > 4 st off its role's typical pitch (and outside its
lane); --retake ID,ID sends one on request (a listening note). Each keeps the better-measured take.

Examples (from the repo root; the ASR check runs on CPU, so wrap long runs in ops/heavy.sh):
  PY=audio/.venv-casting/bin/python; T=audio/ep01/v3-el/tools/el_render.py
  HF_HUB_OFFLINE=1 $PY $T plan --lines show/reel/ep01-v3/ep01-v3-act1.json --sets A B      # no API calls
  HF_HUB_OFFLINE=1 bash ops/heavy.sh $PY $T render --lines show/reel/trials/ep01-v3-sample.json \
        --out audio/ep01/v3-el/sample --sets A B --max-chars 7000 --retry-bad 1 --retry-pitch
  # the whole episode, one segment at a time, after the script lock (only new or changed lines are sent):
  for s in coldopen act1 act2 act3 act4 tag; do
    HF_HUB_OFFLINE=1 bash ops/heavy.sh $PY $T render --lines show/reel/ep01-v3/ep01-v3-$s.json \
        --out audio/ep01/v3-el/$s --sets A --max-chars 6000 --retry-bad 1 --retry-pitch; done
  $PY audio/ep01/v3-el/tools/retime.py --timeline show/reel/ep01-v3/ep01-v3-act1.json \
        --lines audio/ep01/v3-el/act1/lines-A.json --out audio/ep01/v3-el/act1/ep01-v3-act1-el-A.json

The key is read from .env inside ellib; it is never printed, logged or written. No voice is cloned or designed here.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import ellib  # noqa: E402
import elaudio as E  # noqa: E402

REPO = ellib.REPO
CAST = os.path.join(REPO, "audio/ep01/v3-el/cast-el.json")
def proc_version(tgt=-18.0):
    """the dressing's identity: a take whose stored proc differs is re-dressed (free). -18 gives phase 1's exact string."""
    return f"el-dress 1 (HPF 60; own onset/decay; HEAD 0.15/TAIL 0.10; handles 0.35; tone -62 dBFS; {tgt:g} LUFS; -1.5 dBTP)"


PROC_VERSION = proc_version(-18.0)
MONTHS = set("january february april june july august september october november december".split())
FPS = 24


def rel(p):
    return os.path.relpath(os.path.abspath(p), REPO)


def jload(p):
    with open(p) as f:
        return json.load(f)


# ============================================================================================ reading lines files
def read_rows(path):
    d = jload(path)
    rows = []
    if isinstance(d, dict) and "beats" in d and any("lines" in b for b in d["beats"]):
        for b in d["beats"]:
            for ln in b.get("lines", []) or []:
                if not ln.get("text"):
                    continue                      # 'cut' is a line cut off by the world (it is played): kept
                rows.append(dict(id=ln["id"], who=ln["who"], text=ln["text"], tag=ln.get("tag") or "",
                                 beat=b.get("id"), ref_audio=ln.get("audio"), ref_in=ln.get("in"),
                                 ref_dur=ln.get("dur"), delivery=ln.get("delivery"), cut=bool(ln.get("cut"))))
    elif isinstance(d, list):
        for r in d:
            if not r.get("text"):
                continue
            # fastrec rows: 'tag' is the house provenance tag ([INVENTED], [V] ...); the performance tag comes from
            # kind / on_camera, and a call or monitor line from mode / device
            tag = r.get("tag") or ""
            if not re.fullmatch(r"(V\.O\.|O\.S\.|monitor|call)?", tag):
                tag = ""
            if r.get("kind") == "vo" or r.get("on_camera") == "vo":
                tag = "V.O."
            elif not tag and r.get("on_camera") in ("os", "off"):
                tag = "O.S."
            dev = "call" if (r.get("mode") == "call" or r.get("device") in ("call", "monitor")) else None
            rows.append(dict(id=r["id"], who=r.get("speaker_slug") or r.get("speaker"), text=r["text"], tag=tag,
                             beat=r.get("scene"), ref_audio=r.get("file"), ref_in=(r.get("pace") or {}).get("audible_in_s"),
                             ref_dur=r.get("duration_s"), delivery=r.get("delivery"), device=dev,
                             provenance=r.get("tag") if r.get("tag") != tag else None))
    elif isinstance(d, dict) and "segment" in d:
        for b in d.get("beats", []):
            for ln in (b.get("lines") or []) + (b.get("vo") or []):
                if ln.get("text") and (ln.get("who") or ln.get("id", "").startswith("v3-vo")):
                    rows.append(dict(id=ln["id"], who=ln.get("who") or "mas", text=ln["text"],
                                     tag="V.O." if ln.get("id", "").startswith("v3-vo") else (ln.get("tag") or ""),
                                     beat=b.get("id"), delivery=ln.get("delivery")))
    else:
        raise SystemExit(f"unrecognised lines file: {path}")
    seen = set()
    out = []
    for r in rows:
        if r["id"] in seen:
            continue
        seen.add(r["id"])
        out.append(r)
    return out


# ============================================================================================ the cast
class Cast:
    def __init__(self, path=CAST):
        self.path = path
        self.d = jload(path)
        self.labels = {k.lower(): v for k, v in self.d["labels"].items()}
        self.roles = self.d["roles"]

    def role_of(self, who):
        w = (who or "").strip()
        k = self.labels.get(w.lower())
        if k:
            return k
        if w in self.roles:
            return w
        slug = re.sub(r"[^a-z0-9]+", "-", w.lower()).strip("-")
        return slug if slug in self.roles else None

    def voice(self, role, cand, strict=False):
        """-> (candidate dict with settings resolved, the role dict). Derived roles borrow their base's candidate."""
        r = self.roles[role]
        base = r
        if r.get("derived_from"):
            base = self.roles[r["derived_from"]]
        cands = {c["cand"]: c for c in base["candidates"]}
        if cand not in cands:
            if strict:
                return None, r
            cand = "A"
        c = dict(cands[cand])
        if r.get("derived_from"):
            c = dict(c, settings=dict(c["settings"], **(r.get("settings_override") or {})), derived=r["derived_from"])
        return c, r

    def respell(self, text, line_id=None, role=None, voice_id=None):
        """names as the voice should say them (house lexicon: cast.json 'lexicon', naming.md §9), per word, then any
        per-role override (cast 'respell_roles': {role: {word: respelling}}, where one voice needs its own spelling)
        and per-line override (cast 'respell_lines': {line id: {word: respelling}}, for a fix one take needs).
        -> (text as sent, [(word, sent piece)] one per word)"""
        rs = {k.lower(): v for k, v in self.d.get("respell", {}).items()}
        rs.update({k.lower(): v for k, v in (self.d.get("respell_roles", {}).get(role) or {}).items()})
        pv = (self.d.get("respell_voices") or {}).get(voice_id) or {}     # fixes fitted to one voice only
        rs.update({k.lower(): v for k, v in (pv.get("words") or {}).items()})
        rs.update({k.lower(): v for k, v in (self.d.get("respell_lines", {}).get(line_id) or {}).items()})
        rs.update({k.lower(): v for k, v in ((pv.get("lines") or {}).get(line_id) or {}).items()})
        pieces, pairs = [], []
        for w in text.split():
            m = re.match(r"^([^A-Za-z0-9]*)([A-Za-z0-9\-]+?)('s)?([^A-Za-z0-9]*)$", w)
            piece = w
            if m and m.group(2).lower() in rs:
                rep = rs[m.group(2).lower()]                   # the respelling's own case: a name is a name
                piece = m.group(1) + rep + (m.group(3) or "") + m.group(4)
                piece = re.sub(r"(?<!\.)\.\.(?!\.)", ".", piece)       # "Nope A.I." + "." -> one full stop
            pieces.append(piece)
            pairs.append((w, piece))
        return " ".join(pieces), pairs


def sentence_case(t, names=()):
    """Mas's subtitles are lowercase by rule; the voice gets ordinary sentence case (and 'I') so it reads them as speech.
    Names (cast 'names') and months are capitalised too, so 'gerg', 'alyi', 'macrosoft', 'november' read as proper nouns."""
    t = re.sub(r"\bi\b", "I", t)
    t = re.sub(r"\bi'(m|ll|d|ve)\b", lambda m: "I'" + m.group(1), t)
    caps = set(names) | MONTHS

    def cap(m):
        w = m.group(0)
        return w[0].upper() + w[1:] if w.lower() in caps else w
    t = re.sub(r"(?<![A-Za-z0-9'\-])[a-z][a-z0-9]*(?![A-Za-z0-9\-])", cap, t)
    return re.sub(r"(^|[.!?]\s+|…\s*)([a-z])", lambda m: m.group(1) + m.group(2).upper(), t)


EMOJI = re.compile("[\U0001F000-\U0001FFFF\u2600-\u27BF\uFE0F\u200D]")


def normalise_text(t):
    t = EMOJI.sub("", t)                                  # an emoji is print (SYDNEY's 😊), never read aloud
    t = t.strip().replace("“", '"').replace("”", '"').replace("’", "'")
    t = re.sub(r'"\s*…\s*', '"', t)                    # a quoted fragment's leading ellipsis is print, not speech
    t = re.sub(r'\s*…\s*"', '"', t)
    t = t.replace('"', "")                               # he reads the letter aloud; the quote marks are print
    t = re.sub(r"(?<=\s)…(?=\w)", "", t)                 # an elision opening a quoted fragment mid-line ("they're …unable")
                                                         # is print too (v3.1 dropped the quote marks, kept the elision)
    t = t.replace("…", "... ").replace("...  ", "... ")
    t = re.sub(r"\s+", " ", t).strip()
    t = re.sub(r"(\.\.\.)$", "", t).strip()                 # a trailing print ellipsis (a quote cut short) ends the thought
    t = re.sub(r"\s*\(([^()]*)\)", r", \1,", t)               # "Terb (Chair)" is read "Terb, Chair," (as Kokoro read it)
    t = re.sub(r",\s*,", ",", t)
    t = re.sub(r",\s*([.!?])", r"\1", t)
    if t and t[0].islower():
        t = t[0].upper() + t[1:]                            # a quote fragment that starts lowercase is read as a sentence
    if t and t[-1] not in ".!?":
        t += "."                                            # a finished line lands (the house reads quotes as finished)
    return t


def text_to_send(row, cast, role, pairs=False, voice_id=None):
    """-> text as sent (and optionally [(display word, sent piece)] one per word of the line)"""
    full = (cast.d.get("say_full") or {}).get(row.get("id"))
    src = full or row["text"]                   # a cut-off line is read whole, as the house records it (say_full)
    norm = normalise_text(src)
    if cast.roles[role].get("sentence_case"):
        norm = sentence_case(norm, cast.d.get("names", []))
    say = (cast.d.get("say_lines") or {}).get(row.get("id")) or \
        (((cast.d.get("respell_voices") or {}).get(voice_id) or {}).get("say") or {}).get(row.get("id"))
    if say and len(say.split()) == len(norm.split()):
        norm = say                          # a per-line reading (same words, other punctuation), e.g. a flat final
    sent, pr = cast.respell(norm, row.get("id"), role, voice_id)
    sent = re.sub(r"\s+", " ", sent).strip()
    if not pairs:
        return sent
    orig = normalise_text(src).split()
    if len(orig) == len(pr):
        pr = [(o, sp) for o, (_, sp) in zip(orig, pr)]
    return sent, pr


def seed_of(row_id, voice_id):
    return int(hashlib.sha1(f"{row_id}|{voice_id}".encode()).hexdigest()[:8], 16) % 4294967295


def request_key(voice_id, model, settings, text, seed, fmt):
    blob = json.dumps(dict(v=voice_id, m=model, s=settings, t=text, seed=seed, f=fmt), sort_keys=True)
    return hashlib.sha1(blob.encode()).hexdigest()[:16]


# ============================================================================================ word timings
def words_from_alignment(al, sent_text, pairs, offset):
    """character alignment of the text as sent -> [{w, t0, t1}] per word of the line, in file time"""
    if not al or not al.get("characters"):
        return []
    joined = "".join(al["characters"])
    st, en = al["character_start_times_seconds"], al["character_end_times_seconds"]
    toks, i = [], 0
    for orig, piece in pairs:
        j = joined.find(piece, i)
        w = re.sub(r"^[^A-Za-z0-9']+|[^A-Za-z0-9']+$", "", orig)
        if j < 0 or not w:
            continue
        k = j + len(piece)
        idx = [q for q in range(j, k) if re.match(r"[A-Za-z0-9]", joined[q])]
        if idx:
            toks.append(dict(w=w, t0=round(st[idx[0]] + offset, 3), t1=round(en[idx[-1]] + offset, 3)))
        i = k
    return toks


def align_check(words, asr_ws):
    """median |t0 difference| between the alignment and ASR for words both have, matched in order"""
    import difflib
    a = [w["w"].lower() for w in words]
    b = [re.sub(r"[^a-z0-9']", "", w.lower()) for w, _, _ in asr_ws]
    sm = difflib.SequenceMatcher(a=a, b=b, autojunk=False)
    diffs = []
    for blk in sm.get_matching_blocks():
        for q in range(blk.size):
            w = words[blk.a + q]
            if w["t0"] is not None:
                diffs.append(abs(w["t0"] - asr_ws[blk.b + q][1]))
    if not diffs:
        return None
    diffs.sort()
    return round(diffs[len(diffs) // 2], 3)


# ============================================================================================ render
def load_manifest(out):
    p = os.path.join(out, "manifest.json")
    return jload(p) if os.path.exists(p) else {"takes": {}, "calls": []}


def save_manifest(out, m):
    ellib.jdump(m, os.path.join(out, "manifest.json"))


_REUSE = None


def reuse_lookup(args, cast, voice_id, model, settings, sent, row_id=None):
    """a take already rendered elsewhere (--reuse DIR: another render's manifest, e.g. the sample) with the same voice,
    model, settings and text as sent -> {key, seed, from}. Its cached MP3 is used as is: no characters are sent."""
    global _REUSE
    if not getattr(args, "reuse", None):
        return None
    if _REUSE is None:
        _REUSE = {}
        cdir = os.path.join(REPO, cast.d.get("cache_dir", "audio/ep01/v3-el/cache"))
        for d in args.reuse:
            mp = os.path.join(os.path.abspath(d), "manifest.json")
            if not os.path.exists(mp):
                continue
            for t in jload(mp)["takes"].values():
                if not t.get("key") or not os.path.exists(os.path.join(cdir, t["key"] + ".mp3")):
                    continue
                k = (t["voice_id"], t["model"], json.dumps(t["settings"], sort_keys=True), t["sent"])
                _REUSE.setdefault(k, []).append(dict(key=t["key"], seed=t["seed"], bump=t.get("bump") or 0,
                                                     frm=f"{rel(os.path.dirname(mp))}:{t['take']}", line=t["take"].split("__")[0]))
    got = _REUSE.get((voice_id, model, json.dumps(settings, sort_keys=True), sent)) or []
    own = [g for g in got if g["line"] == row_id]                 # the same line's own take first (a repeated line, such
    return (own or got or [None])[0]                              # as "Super." or "Noted.", keeps its own read)


def target_of(args, cast, vo=False):
    """integrated loudness per take: --vo-lufs for V.O. rows when given, else --target-lufs, else the cast's target"""
    if vo and getattr(args, "vo_lufs", None) is not None:
        return float(args.vo_lufs)
    t = getattr(args, "target_lufs", None)
    return float(t) if t is not None else float(cast.d.get("target_lufs", -18.0))


def render_take(row, role, c, rdef, cast, out, man, args, log, bump=0):
    vo = row["tag"] == "V.O."
    tgt = target_of(args, cast, vo)
    proc = proc_version(tgt)
    settings = dict(c["settings"])
    if vo and c.get("vo_settings"):
        settings = dict(settings, **c["vo_settings"])
    model = c.get("model") or cast.d["model_default"]
    fmt = cast.d.get("output_format", "mp3_44100_192")
    sent, pairs = text_to_send(row, cast, role, pairs=True, voice_id=c["voice_id"])
    seed0 = seed_of(row["id"], c["voice_id"])
    base_key = request_key(c["voice_id"], model, settings, sent, seed0, fmt)
    seed = seed0 + bump
    key = request_key(c["voice_id"], model, settings, sent, seed, fmt)
    take_name = f"{row['id']}__{role}-{c['cand']}"
    wav = os.path.join(out, "wav", take_name + ".wav")
    cdir = os.path.join(REPO, cast.d.get("cache_dir", "audio/ep01/v3-el/cache"))
    os.makedirs(cdir, exist_ok=True)
    cache_mp3 = os.path.join(cdir, key + ".mp3")
    cache_js = os.path.join(cdir, key + ".json")
    prev = man["takes"].get(take_name)
    if (bump == 0 and prev and prev.get("base_key") == base_key and prev.get("proc") == proc
            and os.path.exists(os.path.join(REPO, prev["file"])) and not args.redress):
        return prev, 0                                             # unchanged: never sent again
    reused = None
    if bump == 0 and prev and prev.get("base_key") == base_key and prev.get("reused_from"):
        key, seed, reused = prev["key"], prev["seed"], prev["reused_from"]     # a re-dress of a reused take
        cache_mp3 = os.path.join(cdir, key + ".mp3")
        cache_js = os.path.join(cdir, key + ".json")
    elif bump == 0 and not (prev and prev.get("base_key") == base_key):
        # the take chosen for this same line in a --reuse render (retakes included) first, then the line's own cached
        # first take, then another line's identical take
        ru = reuse_lookup(args, cast, c["voice_id"], model, settings, sent, row["id"])
        own_cached = os.path.exists(cache_mp3) and os.path.exists(cache_js)
        if ru and not (ru["line"] == row["id"] or not own_cached):
            ru = None
        if ru:
            key, seed, reused = ru["key"], ru["seed"], ru["frm"]
            cache_mp3 = os.path.join(cdir, key + ".mp3")
            cache_js = os.path.join(cdir, key + ".json")
    if reused is None and bump == 0 and prev and prev.get("base_key") == base_key and prev.get("bump"):
        bump = prev["bump"]                                        # keep the retake that was picked last time
        seed = seed0 + bump
        key = request_key(c["voice_id"], model, settings, sent, seed, fmt)
        cache_mp3 = os.path.join(cdir, key + ".mp3")
        cache_js = os.path.join(cdir, key + ".json")
    spent = 0
    if not (os.path.exists(cache_mp3) and os.path.exists(cache_js)):
        if args.dry_run:
            return dict(take=take_name, dry_run=True, chars=len(sent)), len(sent)
        if args.budget_left is not None and len(sent) > args.budget_left:
            raise BudgetStop(f"budget: {take_name} needs {len(sent)} chars, {args.budget_left} left")
        t0 = time.time()
        audio, al, body = ellib.tts(c["voice_id"], sent, model_id=model, settings=settings, seed=seed, output_format=fmt)
        hdr = dict(ellib.LAST)
        with open(cache_mp3, "wb") as f:
            f.write(audio)
        ellib.jdump(dict(request=body, output_format=fmt, headers=hdr, alignment=al, wall_s=round(time.time() - t0, 2),
                         at=time.strftime("%Y-%m-%dT%H:%M:%S")), cache_js)
        spent = len(sent)
        if args.budget_left is not None:
            args.budget_left -= spent
        man["calls"].append(dict(take=take_name, key=key, chars=len(sent), cost_header=hdr.get("character-cost"),
                                 request_id=hdr.get("request-id"), at=time.strftime("%H:%M:%S")))
        log(f"  sent {take_name}: {len(sent)} chars (cost header {hdr.get('character-cost')})")
    meta = jload(cache_js)
    y = E.decode(open(cache_mp3, "rb").read())
    if rdef.get("process") == "gloss":                              # derived voices: a process on the base voice
        y = E.gloss(y)
    if rdef.get("pitch_st"):
        y = E.pitch(y, float(rdef["pitch_st"]))
    kref = kokoro_ref(row)
    dev = "call" if (row["tag"].lower() in ("monitor", "call") or row.get("device") == "call"
                     or kref.get("mode") == "call") else None
    wav_dry, off, info = E.dress(y, seed, tgt)
    E.write24(wav, wav_dry)
    wav_dev = None
    if dev:
        ydev, _, _ = E.dress(y, seed, tgt, dev=dev)
        wav_dev = os.path.join(out, "wav-device", take_name + ".call.wav")
        E.write24(wav_dev, ydev)
    m = E.measure(wav_dry, row["text"])
    asr_txt, asr_ws = E.asr(wav_dry)
    al = (meta.get("alignment") or {}).get("alignment")
    words = words_from_alignment(al, meta["request"]["text"], pairs, off)
    for w in words:                                     # the alignment starts at 0 and can run past the sound
        w["t0"] = round(min(max(w["t0"], m["audible_in_s"] - 0.02), m["audible_out_s"]), 3)
        w["t1"] = round(max(min(w["t1"], m["audible_out_s"] + 0.02), w["t0"] + 0.02), 3)
    names = set(n.lower() for n in cast.d.get("names", []))
    qa = dict(asr=asr_txt, cer=E.cer(row["text"], asr_txt), word_recall_nonames=E.word_recall(row["text"], asr_txt, names),
              lufs_i=round(E.lufs(wav_dry), 2), target_lufs=tgt,
              true_peak_dbtp=round(E.true_peak_db(wav_dry), 2), clipped_samples=int((abs(wav_dry) >= 0.999).sum()),
              digital_black_runs=E.zero_runs(wav_dry), median_f0_hz=m["median_f0_hz"], f0_range_st=m["f0_range_st"],
              speech_head_s=m["speech_head_s"], speech_tail_s=m["speech_tail_s"], raw_tail_cut=info["raw_tail_cut"],
              align_median_s=align_check(words, asr_ws) if words else None)
    rec = dict(take=take_name, key=key, base_key=base_key, bump=bump, proc=proc, reused_from=reused, file=rel(wav),
               file_device=rel(wav_dev) if wav_dev else None, device=dev, duration_s=round(len(wav_dry) / E.SR, 3),
               offset_s=round(off, 3), sent=sent, seed=seed, model=model, settings=settings, voice_id=c["voice_id"],
               voice_name=c["voice_name"], cand=c["cand"], role=role, measured=m, words=words, qa=qa, raw=info,
               kokoro=kref)
    if prev and prev.get("base_key") == base_key and (prev.get("bump") or 0) == bump and prev.get("pitch_retry"):
        rec["pitch_retry"] = True                                  # a re-dress keeps what the pitch pass decided
    man["takes"][take_name] = rec
    return rec, spent


_KOK = None


def kokoro_ref(row):
    """the Kokoro take the timeline used for this line (by its file), for the A/B: mode/device, loudness, delivery"""
    global _KOK
    if _KOK is None:
        import glob
        _KOK = {}
        for p in sorted(glob.glob(os.path.join(REPO, "audio/ep01/*/dialogue/lines*.json"))
                        + glob.glob(os.path.join(REPO, "audio/ep01/v3-sample/*/lines.json"))
                        + glob.glob(os.path.join(REPO, "audio/ep01/v3/*/lines*.json"))
                        + glob.glob(os.path.join(REPO, "audio/ep01/v31/*/lines*.json"))):
            try:
                d = jload(p)
            except Exception:  # noqa: BLE001
                continue
            if not isinstance(d, list):
                continue
            for r in d:
                if isinstance(r, dict) and r.get("file"):
                    _KOK[r["file"]] = dict(file=r["file"], mode=r.get("mode"), lufs_i=(r.get("qa") or {}).get("lufs_i"),
                                           duration_s=r.get("duration_s"), audible_in_s=(r.get("pace") or {}).get("audible_in_s"),
                                           audible_out_s=(r.get("pace") or {}).get("audible_out_s"),
                                           wpm=(r.get("pace") or {}).get("wpm"), median_f0_hz=(r.get("qa") or {}).get("median_f0_hz"),
                                           f0_range_st=(r.get("qa") or {}).get("f0_range_st"), delivery=r.get("delivery"),
                                           voice=r.get("voice"))
    return dict(_KOK.get(row.get("ref_audio") or "", {}))


class BudgetStop(Exception):
    pass


def row_out(row, rec, role, rdef, c):
    vo = row["tag"] == "V.O."
    m = rec["measured"]
    return {
        "id": row["id"], "kind": "vo" if vo else "dialogue", "scene": row.get("beat"),
        "speaker": rdef.get("name") or role.upper(), "speaker_slug": role, "text": row["text"], "spoken_as": rec["sent"],
        "tag": row["tag"], "delivery": row.get("delivery") or (rec.get("kokoro") or {}).get("delivery"), "on_camera": "vo" if vo else ("os" if row["tag"] == "O.S." else "on"),
        "mode": "on-mic" if not rec.get("device") else rec["device"], "device": rec.get("device"),
        "file": rec["file"], "file_device": rec.get("file_device"), "mp3": None,
        "duration_s": rec["duration_s"], "frames_24": int(round(rec["duration_s"] * FPS)),
        "voiced_span_s": m["span_s"],
        "pace": {"audible_in_s": m["audible_in_s"], "audible_out_s": m["audible_out_s"],
                 "measured": {k: m[k] for k in ("span_s", "wpm", "syllables", "articulation_sps", "pauses_s")},
                 "longest_internal_gap_s": m["longest_internal_gap_s"], "words": m["words"], "wpm": m["wpm"],
                 "speed": rec["settings"].get("speed"), "tsm": 1.0},
        "words": rec["words"],
        "qa": rec["qa"],
        "voice": f"ElevenLabs library voice '{rec['voice_name']}' ({c.get('source')}) · cand {rec['cand']} · "
                 f"{rec['model']} · speed {rec['settings'].get('speed')}",
        "voiceId": rec["voice_id"], "model": f"ElevenLabs {rec['model']} (REST API, text-to-speech with timestamps)",
        "el": {"cand": rec["cand"], "role": role, "voice_id": rec["voice_id"], "voice_name": rec["voice_name"],
               "source": c.get("source"), "model_id": rec["model"], "settings": rec["settings"], "seed": rec["seed"],
               "chars_sent": len(rec["sent"]), "request_key": rec["key"], "derived_from": c.get("derived"),
               "reused_from": rec.get("reused_from")},
        "status": "el", "take": f"el-{rec['cand']}",
        "processing": ["ElevenLabs MP3 44.1 kHz 192 kbps -> 48 kHz (resample_poly 160/147)", "HPF 60 Hz",
                       "own onset and decay kept: 0.15 s before the first sound, decay to -60 dB + 0.10 s; "
                       "0.35 s room-tone handles each side; room-tone bed -62 dBFS under the whole file",
                       f"48 kHz / 24-bit mono; {rec['qa'].get('target_lufs', -18.0):g} LUFS integrated; true-peak ceiling -1.5 dBTP; "
                       "DRY (rooms are mix sends)"]
                      + (["file_device: the same take through a copy of house.call_filter() (HPF 200, LPF 7k, "
                          "+1.5 dB @1.8k, 2.5:1), as the Kokoro take printed it"] if rec.get("device") else []),
        "kokoro_ref": dict(rec.get("kokoro") or {}, timeline_in=row.get("ref_in"), timeline_dur=row.get("ref_dur")),
    }


def _st(f, ref):
    import math
    return 12 * math.log2(f / ref)


def pitch_pass(lines, rows, cast, s, out, man, a, log):
    """re-send (once, new seed) any take whose median F0 sits more than 4 st from its role's typical pitch and outside
    the role's lane widened by 2 st; keep whichever take is nearer, unless its ASR recall is worse by > 0.1"""
    import statistics
    a._pitch_spent = 0
    byrow = {r["id"]: r for r in rows}
    groups = {}
    for ln in lines:
        groups.setdefault((ln["speaker_slug"], ln["kind"]), []).append(ln)
    out_lines = {ln["id"]: ln for ln in lines}
    for (role, kind), lns in groups.items():
        base = cast.roles[role].get("derived_from") or role
        lane = cast.roles[base].get("lane_hz")
        f0s = [ln["qa"]["median_f0_hz"] for ln in lns if ln["qa"]["median_f0_hz"]]
        if not f0s:
            continue
        ref = statistics.median(f0s) if len(f0s) >= 5 else ((lane[0] * lane[1]) ** 0.5 if lane else statistics.median(f0s))
        for ln in lns:
            f = ln["qa"]["median_f0_hz"]
            if not f:
                continue
            in_wide = lane and (lane[0] * 2 ** (-2 / 12) <= f <= lane[1] * 2 ** (2 / 12))
            if abs(_st(f, ref)) <= 4 or in_wide:
                continue
            r = byrow[ln["id"]]
            c, rdef = cast.voice(role, cand_map(a, cast, s).get(role, s), strict=a.strict)
            prev = man["takes"].get(f"{r['id']}__{role}-{c['cand']}", {})
            if prev.get("pitch_retry"):
                continue                                             # retried once already (a previous run)
            bump = (prev.get("bump") or 0) + 211
            log(f"  PITCH {r['id']} {role}-{c['cand']}: {f} Hz vs typical {ref:.0f} Hz ({_st(f, ref):+.1f} st); one retake")
            keep = dict(prev)
            rec2, n2 = render_take(r, role, c, rdef, cast, out, man, a, log, bump=bump)
            a._pitch_spent += n2
            f2 = rec2["qa"]["median_f0_hz"] or f
            better = abs(_st(f2, ref)) < abs(_st(f, ref)) and rec2["qa"]["word_recall_nonames"] >= ln["qa"]["word_recall_nonames"] - 0.1
            if better:
                rec2["pitch_retry"] = True
                man["takes"][rec2["take"]] = rec2
                out_lines[ln["id"]] = row_out(r, rec2, role, rdef, c)
                log(f"    kept the retake: {f2} Hz")
            else:
                man["takes"][keep["take"]] = dict(keep, proc=None)
                rec1, _ = render_take(r, role, c, rdef, cast, out, man, a, log, bump=keep.get("bump") or 0)
                rec1["pitch_retry"] = True
                man["takes"][rec1["take"]] = rec1
                log(f"    kept take 1 (the retake measured {f2} Hz)")
            save_manifest(out, man)
    return [out_lines[ln["id"]] for ln in lines]


def cand_map(a, cast=None, s=None):
    """-> {role: candidate}: the set's own choices (cast-el.json 'set_cand': {set: {role: cand}}, e.g. the recast Mas in
    set A), then --cand mas-manalt=B,rima-tamuri=B over them (that role's candidate whatever the set)"""
    out = dict(((cast.d.get("set_cand") or {}).get(s) or {}) if cast is not None else {})
    for kv in [x for x in (getattr(a, "cand", "") or "").split(",") if "=" in x]:
        k, _, v = kv.partition("=")
        out[k.strip()] = v.strip()
    return out


def to_send_cost(r, cast, role, c, a):
    """characters this row would still send: 0 if its take is cached (own seed) or reusable from a --reuse dir"""
    vo = r["tag"] == "V.O."
    settings = dict(c["settings"])
    if vo and c.get("vo_settings"):
        settings = dict(settings, **c["vo_settings"])
    model = c.get("model") or cast.d["model_default"]
    fmt = cast.d.get("output_format", "mp3_44100_192")
    sent = text_to_send(r, cast, role, voice_id=c["voice_id"])
    key = request_key(c["voice_id"], model, settings, sent, seed_of(r["id"], c["voice_id"]), fmt)
    cdir = os.path.join(REPO, cast.d.get("cache_dir", "audio/ep01/v3-el/cache"))
    if os.path.exists(os.path.join(cdir, key + ".mp3")) or reuse_lookup(a, cast, c["voice_id"], model, settings, sent, r["id"]):
        return 0, len(sent)
    return len(sent), len(sent)


def cmd_plan(a):
    cast = Cast(a.cast)
    rows = read_rows(a.lines)
    miss = sorted({r["who"] for r in rows if not cast.role_of(r["who"])})
    tot, left, per_role = {}, {}, {}
    for s in a.sets:
        cm = cand_map(a, cast, s)
        n = m = 0
        for r in rows:
            role = cast.role_of(r["who"])
            if not role:
                continue
            c, _ = cast.voice(role, cm.get(role, s), strict=a.strict)
            if c is None:
                continue
            todo, full = to_send_cost(r, cast, role, c, a)
            n += full
            m += todo
            pr = per_role.setdefault((s, role + "-" + c["cand"]), [0, 0, 0])
            pr[0] += 1
            pr[1] += full
            pr[2] += todo
        tot[s] = n
        left[s] = m
    for r in rows:
        role = cast.role_of(r["who"])
        print(f"{r['id']:14s} {str(role):16s} {r['tag']:8s} {text_to_send(r, cast, role) if role else r['text']}")
    print(f"rows {len(rows)}; speakers with no role: {miss or 'none'}; chars per set (before cache): {tot}; "
          f"still to send (not cached or reusable): {left}")
    if a.by_role:
        for (s, rc), (nr, full, todo) in sorted(per_role.items(), key=lambda kv: -kv[1][2]):
            if todo:
                print(f"  {s} {rc:22s} rows {nr:3d}  chars {full:5d}  to send {todo:5d}")


def cmd_render(a):
    cast = Cast(a.cast)
    rows = read_rows(a.lines)
    if a.only:
        keep = set(a.only.split(","))
        rows = [r for r in rows if r["id"] in keep]
    if a.skip:
        drop = set(a.skip.split(","))
        rows = [r for r in rows if r["id"] not in drop]    # e.g. lines cut from another take (el_cut.py adds them)
    if a.who:
        keep = set(a.who.split(","))
        rows = [r for r in rows if cast.role_of(r["who"]) in keep]
    out = os.path.abspath(a.out)
    for sub in ("wav", "wav-device", "log"):
        os.makedirs(os.path.join(out, sub), exist_ok=True)
    logf = open(os.path.join(out, "log", "render.log"), "a")

    def log(s):
        print(s, flush=True)
        logf.write(ellib.redact(s) + "\n")
        logf.flush()

    man = load_manifest(out)
    a.budget_left = a.max_chars
    a._retake = set(x for x in (a.retake or "").split(",") if x)
    log(f"== render {rel(a.lines)} -> {rel(out)} sets {a.sets} at {time.strftime('%Y-%m-%d %H:%M:%S')} (max chars {a.max_chars})")
    spent = 0
    per_set = {}
    try:
        for s in a.sets:
            cm = cand_map(a, cast, s)
            lines = []
            for r in rows:
                role = cast.role_of(r["who"])
                if not role:
                    log(f"  NO ROLE for speaker {r['who']!r} ({r['id']}); skipped")
                    continue
                c, rdef = cast.voice(role, cm.get(role, s), strict=a.strict)
                if c is None:
                    continue
                rec, n = render_take(r, role, c, rdef, cast, out, man, a, log)
                spent += n
                if rec.get("dry_run"):
                    continue
                q = rec["qa"]
                bad = (q["word_recall_nonames"] < 0.8) or q["raw_tail_cut"]
                if bad and a.retry_bad and n > 0 and not rec.get("bump"):
                    log(f"  RETRY {rec['take']}: recall {q['word_recall_nonames']} tail_cut {q['raw_tail_cut']} asr {q['asr']!r}")
                    rec2, n2 = render_take(r, role, c, rdef, cast, out, man, a, log, bump=101)
                    spent += n2
                    q2 = rec2["qa"]
                    if (q2["word_recall_nonames"], -int(q2["raw_tail_cut"])) > (q["word_recall_nonames"], -int(q["raw_tail_cut"])):
                        rec = rec2
                        log(f"    kept the retake: recall {q2['word_recall_nonames']} asr {q2['asr']!r}")
                    else:
                        man["takes"][rec["take"]] = dict(rec, proc=None, bump=0)   # force a free re-dress of take 1
                        rec, _ = render_take(r, role, c, rdef, cast, out, man, a, log, bump=0)
                        log(f"    kept take 1 (the retake measured no better: recall {q2['word_recall_nonames']})")
                if r["id"] in a._retake and not rec.get("dry_run"):
                    q = rec["qa"]
                    bump = (rec.get("bump") or 0) + 307
                    log(f"  RETAKE (asked) {rec['take']}: new seed")
                    keep = dict(rec)
                    rec2, n2 = render_take(r, role, c, rdef, cast, out, man, a, log, bump=bump)
                    spent += n2
                    q2 = rec2["qa"]
                    if (q2["word_recall_nonames"], -int(q2["raw_tail_cut"])) >= (q["word_recall_nonames"], -int(q["raw_tail_cut"])):
                        rec = rec2
                        log(f"    kept the retake: recall {q2['word_recall_nonames']} tail_cut {q2['raw_tail_cut']}")
                    else:
                        man["takes"][keep["take"]] = dict(keep, proc=None)
                        rec, _ = render_take(r, role, c, rdef, cast, out, man, a, log, bump=keep.get("bump") or 0)
                        log(f"    kept the earlier take (the retake measured recall {q2['word_recall_nonames']}, tail_cut {q2['raw_tail_cut']})")
                lines.append(row_out(r, rec, role, rdef, c))
                save_manifest(out, man)
            if lines and a.retry_pitch:
                lines = pitch_pass(lines, rows, cast, s, out, man, a, log)
                spent += a._pitch_spent
            if lines:
                p = os.path.join(out, f"lines-{a.label or s}.json")
                ellib.jdump(lines, p)
                per_set[s] = len(lines)
                log(f"  wrote {rel(p)} ({len(lines)} rows)")
    except BudgetStop as e:
        log(f"STOP {e}")
    finally:
        save_manifest(out, man)
        log(f"== chars sent this run: {spent}")
        logf.close()


def cmd_qa(a):
    for p in a.files:
        rows = jload(p)
        print(f"== {p}")
        for r in rows:
            q = r["qa"]
            print(f"{r['id']:14s} {r['speaker_slug']:14s} {r['el']['cand']} dur {r['duration_s']:5.2f} in {r['pace']['audible_in_s']:.2f} "
                  f"wpm {r['pace']['wpm']!s:6s} f0 {q['median_f0_hz']!s:6s} rng {q['f0_range_st']!s:5s} lufs {q['lufs_i']:6.2f} "
                  f"tp {q['true_peak_dbtp']:6.2f} rec {q['word_recall_nonames']:.2f} cut {q['raw_tail_cut']!s:5s} | {q['asr']}")


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = ap.add_subparsers(dest="cmd", required=True)
    for name in ("plan", "render"):
        p = sp.add_parser(name)
        p.add_argument("--lines", required=True)
        p.add_argument("--cast", default=CAST)
        p.add_argument("--sets", nargs="+", default=["A"])
        p.add_argument("--strict", action="store_true", help="a role without this set's candidate is skipped (auditions)")
        p.add_argument("--cand", default="", help="per-role candidate over the set, e.g. mas-manalt=B,rima-tamuri=B")
        p.add_argument("--reuse", nargs="*", default=[], help="other render dirs whose takes are reused when voice, model, settings and text as sent match (no characters sent)")
        if name == "render":
            p.add_argument("--out", required=True)
            p.add_argument("--only", default="")
            p.add_argument("--skip", default="", help="comma-separated line ids not to render (their takes come from el_cut.py)")
            p.add_argument("--who", default="", help="comma-separated role slugs")
            p.add_argument("--max-chars", type=int, default=None, help="stop before sending more than this many characters")
            p.add_argument("--retry-bad", type=int, default=0, help="re-send a take once (new seed) if ASR recall < 0.8 or the tail is cut")
            p.add_argument("--retake", default="", help="comma-separated line ids: send one new-seed take each and keep the better")
            p.add_argument("--retry-pitch", action="store_true", help="re-send once any take > 4 st off its role's typical pitch (and outside the lane)")
            p.add_argument("--redress", action="store_true", help="re-dress every cached take (no API calls)")
            p.add_argument("--target-lufs", type=float, default=None, help="integrated loudness per take (default: cast-el.json target_lufs)")
            p.add_argument("--vo-lufs", type=float, default=None, help="integrated loudness per V.O. take (default: --target-lufs)")

            p.add_argument("--dry-run", action="store_true")
            p.add_argument("--label", default="", help="the lines file is lines-<label>.json (default: the set), e.g. with --cand")
        else:
            p.add_argument("--by-role", action="store_true", help="print what each role still has to send")
    q = sp.add_parser("qa")
    q.add_argument("files", nargs="+")
    a = ap.parse_args(argv)
    dict(plan=cmd_plan, render=cmd_render, qa=cmd_qa)[a.cmd](a)


if __name__ == "__main__":
    main()
