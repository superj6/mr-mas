#!/usr/bin/env python3
"""The Ep2 v1 beat plans, built from _spec.py (the shooting script ../script-v1.md as data), in Ep1 v3.5's beat-plan
format (show/episodes/ep01/production/full-v3/beat-plan-v35/<seg>.json): one JSON per segment, every beat action "new".

    python3 show/episodes/ep02/production/v1/beat-plan/_build.py           # validate + fit + checks + report (dry run)
    python3 show/episodes/ep02/production/v1/beat-plan/_build.py --write   # (re)write coldopen, act1-4, tag .json
    python3 show/episodes/ep02/production/v1/beat-plan/_build.py --lines   # also list every line (the voice pass's list)

Reads only _spec.py and, when they exist, the recorded Ep2 takes (audio/ep02/**/lines*.json: a take's audible length
replaces the words-at-rate estimate). Writes only beat-plan/<seg>.json. Plain python3, no venv.

The fit: each scene lands on its length in the proposal's runtime table (proposal.md, "Runtime per act", after the final
check). Lines keep their natural length and gaps their tempo marks; the air (beat heads, tails and wordless holds) not
marked fixed is scaled by one factor per scene (floors: head 0.15 s, tail 0.3 s, a wordless beat 0.8 s); rounding
lands on the scene's longest flexible beat. est_s is a planning length, never a measurement; the lock sets the frames.

Checks (it stops on a FAIL; WARN is reported): every scene and segment on its target; no fitted air over 3 s in a
head or tail, or over 8 s in a wordless beat; every line id defined once and
used once, in the beat the spec names; the V.O. in the map's order, 14 lines, none with a banned word (LEARNINGS W7);
every rail a date only (W2), and the rail list exactly manifest §3's; no V.O. on screen with a rail or a toast (P18);
the tempo gaps inside their marks (W18); must-read text held for its read floor (P15: 0.25 s + 0.05 s a character,
name cards 1.2 s); every scene opens with an arrival and closes with a transition (or a designed out); every
figure and speaker in a beat is in its segment's cast.
"""
import json
import os
import re
import statistics
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import _spec as S  # noqa: E402

ABOUT = (
    "Ep2 v1 beat plan (script-v1.md, the shooting script of proposal.md as agreed in its Decisions and Review logs), in "
    "Ep1 v3.5's beat-plan format (show/episodes/ep01/production/full-v3/beat-plan-v35/<seg>.json). Ep2 has no earlier "
    "lock, so source is null and every beat is action \"new\", in playing order, chained by \"after\"; a source-less "
    "build reads each beat's set, frame, room, chars, caption and est_s (Ep1's build_new), and its act, seq and the "
    "segment's cast (added here because there is no source timeline to inherit them from). est_s is a planning length: "
    "each scene is fitted to the proposal's runtime table (lines at their natural length and tempo; air scaled), never "
    "a measurement. Lines: new (e2-* ids; takes in audio/ep02/<seg>/; take_file is the slot the voice pass fills), "
    "cut_from (a new id cut from another take; Ep1's e1-a1-5-13 is read and copied, never edited), vo (Mas's inner "
    "voice). Placement: \"after\" is start+S for a beat's first line, else the line before it, with gap_s (negative "
    "with overlap: true = it starts that long before the line before it ends). Sounds: at is seconds from the beat's "
    "start, or after:<line>+S / before:<line>-S; gain in dB; new: true = to make (manifest §8). onscreen.add carries "
    "each text with its window \"(a-b s)\"; onscreen_items has the same with its kind (rail, card, stat, plate, post, "
    "doc, caption, lower-third, toast, ui, sign) and is authoritative: Ep1's strip_note drops trailing parentheses, so a "
    "text that itself ends in them (listed in each file's keep_parens) must be read from onscreen_items. Per-beat fields for the art, shot and score passes: scene, mode, pace, "
    "tempo (the gap before each line), camera, picture, style, style_leap, flashback, arrive, aftermath, transition "
    "(cause, sound, matched object), set_id (manifest §1), music (manifest §6's cue and its state), fix, why. Fix codes "
    "are in _spec.py.")

MONTHS = "JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC"
RAIL_RE = re.compile(rf"^RAIL: (?:(?:{MONTHS})(?: \d{{1,2}}(?:, \d{{4}})?| \d{{4}})?|\d{{4}})$")
# manifest §3, "Rails", in order
RAILS_EXPECTED = ["FEB 15, 2024", "FEB 29, 2024", "MAR 5, 2024", "FEB 20, 2018", "MAR 8", "MAR 19", "APR 1, 2024",
                  "MAY 10", "MAY 13, 2024", "MAY 14, 2024", "DEC 2022", "2023", "MAY 17, 2024", "MAY 18", "MAY 20",
                  "MAY 28, 2024", "JUN 10, 2024", "JUN 11", "JUN 19, 2024", "AUG 5", "AUG 11", "AUG 21"]
VO_BANNED = ["plan", "planned", "long game", "all along", "step one", "that part i"]
MUST_READ = {"rail", "card", "stat", "plate", "post", "doc", "caption", "lower-third", "toast"}
MIN_HEAD, MIN_TAIL, MIN_DUR = 0.15, 0.3, 0.8

FAILS, WARNS = [], []


def fail(msg):
    FAILS.append(msg)


def warn(msg):
    WARNS.append(msg)


# ------------------------------------------------------------------------------------------------ geometry
def layout(b, head):
    """line windows [(id, start, end)] for a beat with lines, its first line at head"""
    out = []
    t = head
    prev_end = None
    for i, ln in enumerate(b["lines"]):
        if i == 0:
            s = head
        else:
            g = ln["_gap"] if ln["_gap"] is not None else 0.5
            s = prev_end + g
        e = s + ln["len_s"]
        out.append((ln["id"], s, e))
        prev_end = e if i == 0 or e > prev_end or not ln.get("overlap") else prev_end
        if ln.get("overlap"):
            prev_end = max(prev_end, e)
        t = e
    return out


def span(b):
    """the beat's fixed middle (its lines and gaps), its air parts and the parts' fixedness"""
    if b["lines"]:
        lw = layout(b, 0.0)
        mid = max(e for _, _, e in lw)
        return mid, {"head": b["_head"], "tail": b["_tail"]}
    return 0.0, {"dur": b["_dur"]}


def est_of(b, air):
    if b["lines"]:
        mid, _ = span(b)
        return air["head"] + mid + air["tail"]
    return air["dur"]


def fit_scene(sc, beats):
    target = S.SCENES[sc]["target_s"]
    airs = [dict(span(b)[1]) for b in beats]
    floors = []
    for b, a in zip(beats, airs):
        f = {}
        for k in a:
            f[k] = {"head": MIN_HEAD, "tail": MIN_TAIL, "dur": MIN_DUR}[k] if b.get("_min_air") is None else b["_min_air"]
        floors.append(f)
    fixed_mid = sum(span(b)[0] for b in beats)
    scale = 1.0
    for _ in range(6):
        fixed = fixed_mid + sum(a[k] for b, a in zip(beats, airs) for k in a if k in b["_fixed"] or a.get("_clamped_" + k))
        flex = sum(a[k] for b, a in zip(beats, airs) for k in list(a) if not k.startswith("_") and k not in b["_fixed"]
                   and not a.get("_clamped_" + k))
        if flex <= 0:
            fail(f"sc {sc}: no flexible air to fit")
            break
        s = (target - fixed) / flex
        scale *= s
        changed = False
        for b, a, fl in zip(beats, airs, floors):
            for k in [k for k in a if not k.startswith("_")]:
                if k in b["_fixed"] or a.get("_clamped_" + k):
                    continue
                v = a[k] * s
                if v < fl[k]:
                    v = fl[k]
                    a["_clamped_" + k] = True
                    changed = True
                a[k] = v
        if not changed:
            break
    # rounding: two decimals, the remainder on the longest flexible part
    for a in airs:
        for k in [k for k in a if not k.startswith("_")]:
            a[k] = round(a[k], 2)
    total = sum(est_of(b, a) for b, a in zip(beats, airs))
    rem = round(target - total, 3)
    if abs(rem) > 1e-6:
        cands = [(a[k], i, k) for i, (b, a) in enumerate(zip(beats, airs)) for k in a
                 if not k.startswith("_") and k not in b["_fixed"]]
        if cands:
            _, i, k = max(cands)
            airs[i][k] = round(airs[i][k] + rem, 3)
    return airs, scale


# ------------------------------------------------------------------------------------------------ time resolution
def resolve(at, b, air, old_air, est, lw):
    """a time spec -> seconds from the beat's start"""
    if at is None:
        return None
    if isinstance(at, (int, float)):
        t = float(at)
        if b["lines"]:
            oh, nh = old_air["head"], air["head"]
            return t * (nh / oh) if oh > 0 and t <= oh else t + (nh - oh)
        od, nd = old_air["dur"], air["dur"]
        return t * (nd / od) if od > 0 else t
    if at == "end":
        return est
    m = re.match(r"^end-([\d.]+)$", at)
    if m:
        return est - float(m.group(1))
    m = re.match(r"^f([\d.]+)$", at)
    if m:
        return float(m.group(1)) * est
    m = re.match(r"^([EL]):(.+?)([+-][\d.]+)$", at)
    if m:
        w = {i: (s, e) for i, s, e in lw}
        if m.group(2) not in w:
            fail(f"{b['id']}: time {at!r} names a line not in the beat")
            return 0.2
        s, e = w[m.group(2)]
        return (e if m.group(1) == "E" else s) + float(m.group(3))
    fail(f"{b['id']}: unreadable time {at!r}")
    return 0.2


def sound_at(at, at_s):
    """Ep1's sound placement grammar: seconds, after:<id>+S, before:<id>-S"""
    if isinstance(at, str):
        m = re.match(r"^E:(.+?)([+-])([\d.]+)$", at)
        if m:
            return f"after:{m.group(1)}{m.group(2)}{m.group(3)}"
        m = re.match(r"^L:(.+?)-([\d.]+)$", at)
        if m:
            return f"before:{m.group(1)}-{m.group(2)}"
    return round(max(0.0, at_s), 3)


def fmt_s(x):
    return f"{x:.2f}".rstrip("0").rstrip(".") if x is not None else ""


# ------------------------------------------------------------------------------------------------ build
def build():
    used = {}
    vo_order = []
    rails = []
    tempo_rows = []
    out = {}
    scene_rep = []
    for seg in S.SEGS:
        beats = S.NEW[seg]
        by_scene = {}
        for b in beats:
            by_scene.setdefault(b["scene"], []).append(b)
        fitted = {}
        for sc, bs in by_scene.items():
            if S.SCENES[sc]["seg"] != seg:
                fail(f"sc {sc}: in {seg}, the scene table says {S.SCENES[sc]['seg']}")
            airs, scale = fit_scene(sc, bs)
            for b, a in zip(bs, airs):
                fitted[b["id"]] = a
            est = sum(est_of(b, fitted[b["id"]]) for b in bs)
            scene_rep.append((seg, sc, S.SCENES[sc]["target_s"], round(est, 2), round(scale, 3), len(bs)))
            if abs(est - S.SCENES[sc]["target_s"]) > 0.05:
                fail(f"sc {sc}: {est:.2f} s against the proposal's {S.SCENES[sc]['target_s']} s")
            for b_, a_ in zip(bs, airs):
                for k_ in [k for k in a_ if not k.startswith("_") and k not in b_["_fixed"]]:
                    lim = 8.0 if k_ == "dur" else 3.0
                    if a_[k_] > lim:
                        warn(f"{b_['id']}: its flexible {k_} came out at {a_[k_]:.2f} s (over {lim} s: look again at its holds)")
        plan_beats = []
        prev = "(start)"
        first_of_scene = set()
        seen_sc = set()
        for b in beats:
            if b["scene"] not in seen_sc:
                first_of_scene.add(b["id"])
                seen_sc.add(b["scene"])
        for i, b in enumerate(beats):
            old_air = dict(span(b)[1])
            air = fitted[b["id"]]
            est = round(est_of(b, air), 3)
            lw = layout(b, air["head"]) if b["lines"] else []
            e = {"id": b["id"], "action": "new", "after": prev, "act": S.ACT[seg], "scene": b["scene"],
                 "mode": b["_mode"], "pace": b["_pace"], "est_s": round(est, 2), "frame": b["frame"],
                 "camera": b["frame"], "set": b["set"], "set_id": b["set_id"], "room": b["room"], "chars": b["chars"]}
            if b["room"] not in S.ROOMS:
                fail(f"{b['id']}: room {b['room']!r} has no bed in ROOMS")
            # lines
            lines = []
            gaps = {}
            for j, (ln, (lid, s0, e0)) in enumerate(zip(b["lines"], lw)):
                d = {"id": lid, "new": True, "who": ln["who"]}
                if ln.get("vo"):
                    d["vo"] = True
                for k in ("tag", "text", "delivery", "kind", "take", "take_file", "note", "cut_from", "sub"):
                    if k in ln:
                        d[k] = ln[k]
                for piece in ln.get("sub") or []:
                    # the subtitle as drawn, when it isn't the line's words as recorded (a cut-off): [text, from] pieces,
                    # from = a word index of the take, or "after:<line id>" (shown once that line ends)
                    st_ = piece[1]
                    if not (isinstance(piece, list) and len(piece) == 2 and isinstance(piece[0], str) and (
                            isinstance(st_, int) or (isinstance(st_, str) and st_.startswith("after:")))):
                        fail(f"{b['id']} {lid}: subtitle piece {piece!r} is not [text, word index | 'after:<line>']")
                    elif isinstance(st_, str) and st_[6:] not in {x[0] for x in lw}:
                        fail(f"{b['id']} {lid}: subtitle piece {piece[0]!r} waits for {st_[6:]}, which isn't in the beat")
                if j == 0:
                    d["after"] = f"start+{fmt_s(air['head'])}"
                    d["gap_s"] = 0.0
                else:
                    g = ln["_gap"] if ln["_gap"] is not None else 0.5
                    d["after"] = b["lines"][j - 1]["id"]
                    d["gap_s"] = g
                    gaps[lid] = g
                    pc = ln["_pace"] or ("quick-mas" if ln["who"] == "mas" and b["_pace"] == "quick" else
                                         "quick" if b["_pace"] == "quick" else b["_pace"])
                    lo, hi = S.PACE_BANDS[pc]
                    ok = lo - 1e-6 <= g <= hi + 1e-6 or ln.get("overlap")
                    tempo_rows.append((b["id"], lid, ln["who"], pc, g, ok))
                    if not ok:
                        warn(f"{b['id']} {lid} ({ln['who']}): gap {g} s outside the {pc} mark {lo}-{hi} s")
                if ln.get("overlap"):
                    d["overlap"] = True
                d["len_s"] = ln["len_s"]
                d["t_s"] = round(s0, 2)
                lines.append(d)
                # bookkeeping
                if lid in used:
                    fail(f"line {lid} used twice ({used[lid]} and {b['id']})")
                used[lid] = b["id"]
                spec_beat = S.NEW_VO[lid][1] if lid in S.NEW_VO else S.NEW_LINES[lid]["beat"]
                spec_seg = S.NEW_VO[lid][0] if lid in S.NEW_VO else S.NEW_LINES[lid]["seg"]
                if spec_beat != b["id"] or spec_seg != seg:
                    fail(f"line {lid}: the spec puts it in {spec_seg} {spec_beat}, it's used in {seg} {b['id']}")
                if ln.get("vo"):
                    vo_order.append((lid, b["id"], s0, e0))
            e["lines"] = lines
            e["caption"] = b["caption"]
            e["picture"] = b["picture"]
            # on-screen
            items = []
            adds = []
            for o in b["_onscreen"]:
                a0 = resolve(o["_at"], b, air, old_air, est, lw)
                u0 = resolve(o["_until"], b, air, old_air, est, lw) if o["_until"] is not None else None
                a0 = max(0.0, min(a0, est - 0.2))
                u = min(u0, est) if u0 is not None else est
                items.append({"text": o["text"], "at": round(a0, 2), "until": round(u, 2), "kind": o["kind"],
                              **({"holds": True} if u0 is None else {})})
                adds.append(f"{o['text']} ({fmt_s(round(a0, 2))}-{fmt_s(round(u, 2))} s)")
                if o["kind"] == "rail":
                    if not RAIL_RE.match(o["text"]):
                        fail(f"{b['id']}: rail {o['text']!r} is not a date (W2)")
                    rails.append(o["text"][6:])
                if o["kind"] in MUST_READ:
                    floor = 1.2 if o["kind"] == "card" else 0.25 + 0.05 * len(o["text"])
                    if u - a0 < floor - 0.02 and u0 is not None:
                        warn(f"{b['id']}: \"{o['text'][:48]}\" holds {u - a0:.2f} s, under its read floor {floor:.2f} s")
                    elif u - a0 < floor - 0.02:
                        warn(f"{b['id']}: \"{o['text'][:48]}\" holds to the beat's end, {u - a0:.2f} s, under its read "
                             f"floor {floor:.2f} s (fine if it carries into the next beat)")
            if adds:
                e["onscreen"] = {"add": adds}
                e["onscreen_items"] = items
            # V.O. never shares the screen with a rail or a toast
            for lid, s0, e0 in [(x[0], x[1], x[2]) for x in lw if x[0] in S.NEW_VO]:
                for it in items:
                    if it["kind"] in ("rail", "toast") and it["at"] < e0 and it["until"] > s0:
                        fail(f"{b['id']}: V.O. {lid} ({s0:.2f}-{e0:.2f}) shares the screen with {it['kind']} "
                             f"\"{it['text']}\" ({it['at']}-{it['until']})")
            e["music"] = b["music"]
            if not b["music"]:
                fail(f"{b['id']}: no music note")
            snds = []
            for sd in b["_sounds"]:
                at_s = resolve(sd["_at"], b, air, old_air, est, lw)
                d = {"name": sd["name"], "at": sound_at(sd["_at"], at_s), "at_s": round(max(0.0, at_s), 2), "gain": sd["gain"]}
                for k in ("new", "dur", "note"):
                    if k in sd:
                        d[k] = sd[k]
                if sd.get("until") is not None:       # a sound that stops on a word: its dur from the resolved times
                    u_s = resolve(sd["until"], b, air, old_air, est, lw)
                    if u_s <= at_s:
                        fail(f"{b['id']}: sound {sd['name']} until {sd['until']!r} ({u_s:.2f} s) is not after its start ({at_s:.2f} s)")
                    d["dur"] = round(u_s - max(0.0, at_s), 2)
                    d["until_s"] = round(u_s, 2)
                if at_s > est + 0.05:
                    warn(f"{b['id']}: sound {sd['name']} at {at_s:.2f} s, past the beat's end ({est:.2f})")
                snds.append(d)
            if snds:
                e["sounds"] = snds
            for k in ("jcut", "lcut", "style", "style_leap", "flashback"):
                if k in b:
                    e[k] = b[k]
            if b.get("_xgap"):
                xg = b["_xgap"]
                prev_b = plan_beats[-1]
                prev_last = max(prev_b["lines"], key=lambda l: l["t_s"] + l["len_s"])
                real = round(prev_b["est_s"] - (prev_last["t_s"] + prev_last["len_s"]) + lw[0][1], 2)
                lo, hi = S.PACE_BANDS[xg["pace"]]
                ok = lo - 1e-6 <= real <= hi + 1e-6
                tempo_rows.append((b["id"], lw[0][0], b["lines"][0]["who"], xg["pace"], real, ok))
                if prev_last["id"] != xg["from"]:
                    fail(f"{b['id']}: its cross-cut gap names {xg['from']}, but the beat before ends on {prev_last['id']}")
                if not ok:
                    warn(f"{b['id']}: the gap across the cut is {real} s, outside the {xg['pace']} mark {lo}-{hi} s")
                gaps[lw[0][0]] = real
            if lines:
                e["tempo"] = {"pace": b["_pace"], "gaps": gaps,
                              "rule": {"quick": "others 0.15-0.35 s, Mas 0.4-0.5 s", "normal": "0.4-0.6 s",
                                       "weighted": "longer, only on turns"}[b["_pace"]]}
                if b.get("_xgap"):
                    e["tempo"]["across_cut"] = {"from": b["_xgap"]["from"], "gap_s": gaps[lw[0][0]],
                                                "note": "the gap from the last line of the beat before (its tail + this head)"}
            seq_key = b["id"] if b["id"] in S.SEQ else (b["scene"] if b["id"] in first_of_scene else None)
            if seq_key:
                e["seq"] = dict(S.SEQ[seq_key], side="")
            for k in ("arrive", "aftermath", "transition"):
                if k in b:
                    e[k] = b[k]
            e["fix"] = b["fix"]
            e["why"] = b["why"]
            plan_beats.append(e)
            prev = b["id"]
        # every figure and speaker is in the segment's cast (a source-less build has no other cast to read)
        for x in plan_beats:
            for cid in set(x["chars"]) | {l["who"] for l in x["lines"]}:
                if cid not in S.CAST[seg]:
                    fail(f"{x['id']}: {cid!r} is not in {seg}'s cast")
        # scene openings and closings
        for sc, bs in by_scene.items():
            if "arrive" not in bs[0] and not any("arrive" in x for x in bs[:2]):
                warn(f"sc {sc}: no arrival marked on its first beat")
            if "transition" not in bs[-1]:
                fail(f"sc {sc}: its last beat {bs[-1]['id']} has no transition")
        est_total = round(sum(x["est_s"] for x in plan_beats), 2)
        if abs(est_total - S.SEG_TARGET[seg]) > 0.05:
            fail(f"{seg}: {est_total} s against the proposal's {S.SEG_TARGET[seg]} s")
        out[seg] = {"segment": seg, "act": S.ACT[seg], "title": S.ACT_TITLE[seg], "source": None, "_about": ABOUT,
                    "story_s": {"target": S.SEG_TARGET[seg], "estimate": est_total},
                    "scenes": [dict(id=sc, **{k: v for k, v in S.SCENES[sc].items() if k != "seg"},
                                    estimate_s=round(sum(x["est_s"] for x in plan_beats if x["scene"] == sc), 2),
                                    fit_scale=next(r[4] for r in scene_rep if r[1] == sc))
                               for sc in S.SCENE_ORDER if S.SCENES[sc]["seg"] == seg],
                    "cast": S.CAST[seg],
                    "keep_parens": sorted({it["text"] for x in plan_beats for it in x.get("onscreen_items", [])
                                           if re.search(r"\)\s*$", it["text"])}),
                    "rooms": {r: S.ROOMS[r] for r in sorted({x["room"] for x in plan_beats})},
                    "beats": plan_beats}
    # every defined line used
    for lid in list(S.NEW_VO) + list(S.NEW_LINES):
        if lid not in used:
            fail(f"{lid} is defined in the spec but no beat uses it")
    # the V.O. map
    ids = [v[0] for v in vo_order]
    if ids != [f"e2-vo-{n:02d}" for n in range(1, 15)]:
        fail(f"the V.O. plays out of the map's order: {ids}")
    for lid in S.NEW_VO:
        t = S.NEW_VO[lid][2]
        for w in VO_BANNED:
            if re.search(rf"\b{re.escape(w)}\b", t):
                fail(f"{lid}: banned word {w!r} in the V.O. (W7)")
        if t != t.lower():
            fail(f"{lid}: the V.O. is lowercase")
    if rails != RAILS_EXPECTED:
        fail(f"the rails differ from manifest §3's list: {rails}")
    # scene order
    order = [b["scene"] for seg in S.SEGS for b in S.NEW[seg]]
    dedup = [x for i, x in enumerate(order) if i == 0 or order[i - 1] != x]
    if dedup != S.SCENE_ORDER:
        fail(f"the scenes play out of the proposal's order: {dedup}")
    return out, scene_rep, tempo_rows, vo_order


def fmt(s):
    m, sec = divmod(s, 60)
    return f"{int(m)}:{sec:05.2f}"


def main():
    write = "--write" in sys.argv
    out, scene_rep, tempo_rows, vo_order = build()
    print("== scenes (target -> estimate; the air's fit scale)")
    for seg, sc, tgt, est, scale, n in scene_rep:
        adj = S.SCENES[sc].get("proposal_s")
        print(f"  {seg:<9} sc {sc:<3} {fmt(tgt):>8} -> {fmt(est):>8}  x{scale:<5} ({n} beats)"
              + (f"  [proposal {fmt(adj)}; see SCENE_ADJUST]" if adj else ""))
    print("== segments")
    tot = 0
    for seg in S.SEGS:
        st = out[seg]["story_s"]
        tot += st["estimate"]
        print(f"  {seg:<9} {fmt(st['target']):>8} -> {fmt(st['estimate']):>8}  ({len(out[seg]['beats'])} beats)")
    print(f"  story     {fmt(tot):>8}   episode (+30 s intro, 2 s card, ~10 s outro): {fmt(tot + S.EPISODE_EXTRA_S)}")
    nlines = sum(len(b["lines"]) for seg in S.SEGS for b in out[seg]["beats"])
    words = [S.words(l["text"]) for seg in S.SEGS for b in out[seg]["beats"] for l in b["lines"] if not l.get("vo")]
    print(f"== lines: {nlines} ({len(vo_order)} V.O.); spoken words per line: median {statistics.median(words)}, "
          f"max {max(words)}; total spoken {sum(words)} words")
    vo_words = sum(S.words(S.NEW_VO[v[0]][2]) for v in vo_order)
    print(f"== V.O.: {len(vo_order)} lines, {vo_words} words")
    for lid, bid, s0, e0 in vo_order:
        print(f"  {lid}  {bid:<6} {S.NEW_VO[lid][3]:<26} {S.NEW_VO[lid][2]}")
    bad = [r for r in tempo_rows if not r[5]]
    print(f"== tempo: {len(tempo_rows)} gaps checked, {len(bad)} outside their marks")
    if "--lines" in sys.argv:
        print("== lines (the voice pass's list)")
        for seg in S.SEGS:
            for b in out[seg]["beats"]:
                for l in b["lines"]:
                    print(f"  {l['id']:<11} {b['id']:<6} {l['who']:<10} {l['len_s']:>5} {(l.get('tag') or ''):<8} {l['text'][:70]}")
    for w in WARNS:
        print("WARN:", w)
    for f in FAILS:
        print("FAIL:", f)
    if FAILS:
        print(f"{len(FAILS)} failure(s); nothing written")
        sys.exit(1)
    if write:
        for seg in S.SEGS:
            with open(os.path.join(HERE, f"{seg}.json"), "w") as f:
                json.dump(out[seg], f, indent=1, ensure_ascii=False)
                f.write("\n")
        print("written:", ", ".join(f"{s}.json" for s in S.SEGS))
    else:
        print("(dry run; --write to write the JSON)")


if __name__ == "__main__":
    main()
