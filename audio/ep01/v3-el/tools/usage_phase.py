#!/usr/bin/env python3
"""usage_phase.py - snapshot the ElevenLabs subscription into audio/ep01/v3-el/usage.json for one phase (no key printed).

  usage_phase.py before PHASE     record the subscription before a phase's first call
  usage_phase.py after PHASE      record it after, and the phase's calls / chars sent / credits billed from the
                                  render manifests named with --manifests (each call's character-cost header)
"""
from __future__ import annotations

import argparse
import glob
import json
import os
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import ellib  # noqa: E402

USAGE = os.path.join(ellib.REPO, "audio/ep01/v3-el/usage.json")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("when", choices=["before", "after"])
    ap.add_argument("phase")
    ap.add_argument("--manifests", nargs="*", default=[], help="render manifest.json files (globs) whose calls belong to this phase")
    ap.add_argument("--since", default=None, help="only calls at or after this HH:MM:SS (a manifest's calls carry the time)")
    ap.add_argument("--budget", type=int, default=None)
    ap.add_argument("--note", default=None)
    a = ap.parse_args()
    u = json.load(open(USAGE))
    ph = u.setdefault("phases", {}).setdefault(a.phase, {})
    s = ellib.subscription()
    s["checked_at"] = time.strftime("%Y-%m-%dT%H:%M:%S")
    if a.budget:
        ph["budget_chars"] = a.budget
    if a.note:
        ph["_about"] = a.note
    if a.when == "before":
        ph["subscription_before"] = s
    else:
        ph["subscription_after"] = s
        calls = chars = billed = 0
        per = {}
        for pat in a.manifests:
            for p in sorted(glob.glob(os.path.join(ellib.REPO, pat))):
                m = json.load(open(p))
                name = os.path.relpath(os.path.dirname(p), ellib.REPO)
                c = dict(calls=0, chars_sent=0, credits_billed=0)
                for x in m.get("calls", []):
                    if a.since and x.get("at", "") < a.since:
                        continue
                    c["calls"] += 1
                    c["chars_sent"] += int(x.get("chars") or 0)
                    c["credits_billed"] += int(float(x.get("cost_header") or 0))
                if c["calls"]:
                    per[name] = c
                    calls += c["calls"]
                    chars += c["chars_sent"]
                    billed += c["credits_billed"]
        ph["runs"] = per
        ph["total"] = dict(calls=calls, chars_sent=chars, credits_billed=billed)
        b = ph.get("subscription_before", {}).get("character_count")
        if b is not None and s.get("character_count") is not None:
            ph["used_by_subscription"] = s["character_count"] - b
    ellib.jdump(u, USAGE)
    print(json.dumps({k: v for k, v in ph.items() if k != "runs"}, indent=1))


if __name__ == "__main__":
    main()
