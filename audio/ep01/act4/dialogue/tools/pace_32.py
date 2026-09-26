"""pace_32.py - measured pace per character, draft 3.2 against the 3.1 takes it replaces (retired/3.1/lines.json).

One measure throughout: words / audible span (10 ms RMS frames above -40 dB rel. the line's peak, first to last), summed
over a character's voiced lines. 'all' counts every line; '3+' only lines of three or more words (one-word lines read
slow in words per minute by nature, and cut-offs read fast). Derived copies (the laptop 'super.', a lifted 'More. Soon.')
are left out: they are not reads. Writes qa/pace-3.2.json and prints the table.
"""
import json
import os
import re
from collections import OrderedDict

REPO = "/home/jgon/project/art/mrmas"
ROOT = os.path.join(REPO, "audio/ep01/act4/dialogue")
GROUP = OrderedDict([("mas-manalt", "MAS (on camera)"), ("mas-manalt-vo", "MAS (V.O.)"), ("alyi", "ALYI"), ("tasya", "TASYA"),
                     ("mada", "MADA"), ("terb", "TERB"), ("mario", "MARIO"), ("rima-tamuri", "RIMA"), ("ttemme", "TTEMME"),
                     ("neleh", "NELEH"), ("adelina", "ADELINA"), ("gerg-mockbran", "GERG"), ("tiled-employee", "TILED EMPLOYEE")])


def n_words(e):
    if e.get("words"):
        return len(e["words"])
    return len(re.findall(r"[A-Za-z0-9']+", e["text"]))


def stats(rows):
    out = OrderedDict()
    for slug, name in GROUP.items():
        rs = [e for e in rows if e.get("voiced_in_cut") and (e["speaker_slug"] + ("-vo" if e.get("kind") == "vo" else "")) == slug
              and not e.get("derived_from")]
        if not rs:
            continue
        w = sum(n_words(e) for e in rs)
        s = sum(e["voiced_span_s"] for e in rs)
        r3 = [e for e in rs if n_words(e) >= 3]
        w3, s3 = sum(n_words(e) for e in r3), sum(e["voiced_span_s"] for e in r3)
        out[slug] = {"name": name, "lines": len(rs), "words": w, "audible_s": round(s, 2), "file_s": round(sum(e["duration_s"] for e in rs), 2),
                     "wpm_all": round(w / s * 60), "wpm_3plus": round(w3 / s3 * 60) if s3 else None,
                     "per_line": [(e["id"], n_words(e), e["voiced_span_s"], round(n_words(e) / e["voiced_span_s"] * 60)) for e in rs]}
    return out


def totals(rows):
    v = [e for e in rows if e.get("voiced_in_cut")]
    reads = [e for e in v if not e.get("derived_from")]
    return {"lines": len(v), "dialogue": sum(1 for e in v if e.get("kind") == "dialogue"), "vo": sum(1 for e in v if e.get("kind") == "vo"),
            "file_s": round(sum(e["duration_s"] for e in v), 2), "audible_s": round(sum(e["voiced_span_s"] for e in v), 2),
            "words": sum(n_words(e) for e in v),
            "wpm_all_reads": round(sum(n_words(e) for e in reads) / sum(e["voiced_span_s"] for e in reads) * 60),
            "wpm_file_basis": round(sum(n_words(e) for e in v) / sum(e["duration_s"] for e in v) * 60)}


def main():
    new = json.load(open(os.path.join(ROOT, "lines.json")))
    old = json.load(open(os.path.join(ROOT, "retired", "3.1", "lines.json")))
    a, b = stats(new), stats(old)
    out = {"measure": __doc__.split("\n\n")[1].replace("\n", " "), "draft_3.2": {"totals": totals(new), "by_character": a},
           "draft_3.1": {"totals": totals(old), "by_character": b}}
    json.dump(out, open(os.path.join(ROOT, "qa", "pace-3.2.json"), "w"), indent=1)
    t, u = out["draft_3.2"]["totals"], out["draft_3.1"]["totals"]
    print(f"3.2: {t['lines']} voiced ({t['dialogue']} dialogue + {t['vo']} V.O.), {t['audible_s']} s audible / {t['file_s']} s of files, "
          f"{t['words']} words, {t['wpm_all_reads']} wpm (audible) / {t['wpm_file_basis']} wpm (files)")
    print(f"3.1: {u['lines']} voiced, {u['audible_s']} s audible / {u['file_s']} s of files, {u['words']} words, "
          f"{u['wpm_all_reads']} wpm (audible) / {u['wpm_file_basis']} wpm (files)")
    print(f"{'character':16s} {'lines':>5s} {'words':>5s} {'aud s':>6s} {'wpm':>5s} {'3+':>5s} | 3.1: {'wpm':>5s} {'3+':>5s}")
    for slug, x in a.items():
        y = b.get(slug, {})
        print(f"{x['name']:16s} {x['lines']:5d} {x['words']:5d} {x['audible_s']:6.2f} {x['wpm_all']:5d} {str(x['wpm_3plus']):>5s} | "
              f"     {str(y.get('wpm_all', '-')):>5s} {str(y.get('wpm_3plus', '-')):>5s}")


if __name__ == "__main__":
    main()
