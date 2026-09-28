#!/usr/bin/env python3
"""MR. MAS: a small Runway API client (text-to-video, image-to-video, text-to-image) with provenance.

Built by the `v31-runway` pass (2026-09-27) for Ep1's tag insert (ELGOOG's duck demo), per
show/production/GENAI-UPGRADE-PLAN.md §6 ("gen.py: a Runway client first ... It writes provenance.json").

Rules it keeps (GENAI-UPGRADE-PLAN §1):
- The key is RUNWAY_API_KEY in the project's .env. It is read here and sent only in the Authorization header.
  It is never printed, logged or written to disk; every error message is scrubbed of it.
- Moderation is never lowered. For models that take `contentModeration`, `publicFigureThreshold` is sent as "auto".
  A request that sets it to anything else is refused before it is sent.
- Model audio is always off where the model has the switch.
- Every generation writes a provenance.json beside its clip (model, endpoint, prompt, seed, params, input hashes,
  task id, times, credits before/after, the estimated cost, the output hash), including failures.

Usage (Python 3.10+ with `requests`; the project's audio/.venv-casting has it):
  gen.py balance
  gen.py t2v --model veo3.1_fast --prompt "..." --duration 6 --ratio 1280:720 --seed 7 --out DIR [--negative "..."]
  gen.py i2v --model veo3.1_fast --prompt "..." --first img.png [--last img.png] --duration 6 --out DIR
  gen.py t2i --model gen4_image --prompt "... @ref ..." [--ref ref=img.png] --ratio 1280:720 --seed 7 --out DIR
  gen.py task TASK_ID                                   # re-poll a task (and download it with --out)
  gen.py estimate --model veo3.1_fast --duration 6      # the price table below, no call
Add --dry-run to print the request body (images elided) without sending it.
"""
from __future__ import annotations

import argparse
import base64
import datetime as dt
import hashlib
import json
import mimetypes
import os
import sys
import time
from pathlib import Path

import requests

API = "https://api.dev.runwayml.com"
VERSION = "2024-11-06"
ROOT = Path(__file__).resolve().parents[5]  # studio/src/dev/genvideo/runway -> project root

# Credits per output second (docs.dev.runwayml.com/guides/pricing, fetched 2026-09-27; 1 credit = $0.01).
PRICE = {
    "wan3@480p": 5, "wan3@720p": 10, "wan3@1080p": 20,
    "gen4.5": 12, "gen4_turbo": 5,
    "veo3.1": 20, "veo3.1+audio": 40,
    "veo3.1_fast": 10, "veo3.1_fast+audio": 15,
}
# Credits per image (the same page).
IMAGE_PRICE = {"gen4_image@720p": 5, "gen4_image@1080p": 8, "gen4_image_turbo": 2, "muse_image": 1}
# Which models take which switches (from the OpenAPI spec embedded in docs.dev.runwayml.com/api, 2026-09-27).
MODERATION_MODELS = {"gen4.5", "gen4_turbo", "gen4_image", "gen4_image_turbo"}
AUDIO_MODELS = {"veo3.1", "veo3.1_fast", "wan3", "wan3_prime", "seedance2", "seedance2_fast", "seedance2_mini", "seedance2_5"}
NEGATIVE_MODELS = {"veo3.1", "veo3.1_fast"}
SEED_MODELS = {"gen4.5", "gen4_turbo", "gen4_image", "gen4_image_turbo", "veo3.1", "veo3.1_fast", "seedance2", "seedance2_fast", "seedance2_mini", "seedance2_5", "h3_max"}


# ------------------------------------------------------------------ the key (never printed)
def _key() -> str:
    k = os.environ.get("RUNWAY_API_KEY")
    if not k:
        env = ROOT / ".env"
        if env.exists():
            for line in env.read_text().splitlines():
                line = line.strip()
                if line.startswith("RUNWAY_API_KEY="):
                    k = line.split("=", 1)[1].strip().strip('"').strip("'")
    if not k:
        sys.exit("gen.py: RUNWAY_API_KEY not found in the environment or .env")
    return k


def _scrub(s: str) -> str:
    try:
        k = _key()
        return s.replace(k, "<RUNWAY_API_KEY>") if k else s
    except SystemExit:
        return s


def _headers() -> dict:
    return {"Authorization": f"Bearer {_key()}", "X-Runway-Version": VERSION, "Content-Type": "application/json"}


def _req(method: str, path: str, body: dict | None = None, timeout: int = 60) -> dict:
    for attempt in range(5):
        try:
            r = requests.request(method, API + path, headers=_headers(), json=body, timeout=timeout)
        except requests.RequestException as e:  # network: retry
            print(f"[gen] {method} {path}: {_scrub(type(e).__name__)}; retry {attempt + 1}", file=sys.stderr)
            time.sleep(5 * (attempt + 1))
            continue
        if r.status_code == 429 or r.status_code >= 500:
            print(f"[gen] {method} {path}: HTTP {r.status_code}; retry {attempt + 1}", file=sys.stderr)
            time.sleep(10 * (attempt + 1))
            continue
        if not r.ok:
            raise RuntimeError(f"{method} {path}: HTTP {r.status_code}: {_scrub(r.text)[:800]}")
        return r.json() if r.content else {}
    raise RuntimeError(f"{method} {path}: gave up after retries")


# ------------------------------------------------------------------ helpers
def sha256(p: Path) -> str:
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def data_uri(p: Path) -> str:
    mt = mimetypes.guess_type(str(p))[0] or "image/png"
    b = p.read_bytes()
    if len(b) > 5 * 1024 * 1024 * 3 // 4:
        sys.exit(f"gen.py: {p} is too big for a data URI (5 MB after base64); use a JPEG")
    return f"data:{mt};base64,{base64.b64encode(b).decode()}"


def now() -> str:
    return dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")


def balance() -> float:
    return _req("GET", "/v1/organization").get("creditBalance")


def price_key(model: str, ratio: str | None, audio: bool) -> str:
    if model == "wan3":
        h = int((ratio or "1280:720").split(":")[1]) if ratio and ":" in ratio and not ratio.startswith("auto") else {"auto_480p": 480, "auto_720p": 720, "auto_1080p": 1080}.get(ratio or "", 720)
        return f"wan3@{'480p' if h <= 544 else '1080p' if h >= 1080 else '720p'}"
    return model + ("+audio" if audio else "")


def estimate(model: str, duration: float, ratio: str | None = None, audio: bool = False) -> float | None:
    if model.startswith("gen4_image") or model == "muse_image":
        h = int(ratio.split(":")[1]) if ratio and ":" in ratio else 720
        return IMAGE_PRICE.get(f"{model}@{'1080p' if h > 720 else '720p'}", IMAGE_PRICE.get(model))
    p = PRICE.get(price_key(model, ratio, audio))
    return None if p is None else p * duration


# ------------------------------------------------------------------ build the request
def build(kind: str, a) -> tuple[str, dict, dict]:
    """Returns (endpoint, body, inputs-for-provenance)."""
    body: dict = {"model": a.model, "promptText": a.prompt}
    inputs: dict = {}
    if a.ratio:
        body["ratio"] = a.ratio
    if getattr(a, "duration", None) is not None:
        body["duration"] = int(a.duration)
    if a.seed is not None and a.model in SEED_MODELS:
        body["seed"] = int(a.seed)
    if a.model in AUDIO_MODELS:
        body["audio"] = False  # model audio is always off (GENAI §1.9)
    if a.negative and a.model in NEGATIVE_MODELS:
        body["negativePrompt"] = a.negative
    if a.model in MODERATION_MODELS:
        body["contentModeration"] = {"publicFigureThreshold": "auto"}  # never lowered (GENAI §1.6)
    if kind == "t2i":
        refs = []
        for spec in a.ref or []:
            tag, _, path = spec.partition("=")
            pp = Path(path).resolve()
            inputs[f"ref:{tag}"] = {"path": str(pp.relative_to(ROOT)) if pp.is_relative_to(ROOT) else str(pp), "sha256": sha256(pp)}
            refs.append({"uri": data_uri(pp), "tag": tag})
        if refs or a.model == "gen4_image_turbo":
            body["referenceImages"] = refs
        endpoint = "/v1/text_to_image"
    elif kind == "i2v":
        imgs = []
        for pos, p in (("first", a.first), ("last", a.last)):
            if p:
                pp = Path(p).resolve()
                inputs[pos] = {"path": str(pp.relative_to(ROOT)) if pp.is_relative_to(ROOT) else str(pp), "sha256": sha256(pp)}
                imgs.append({"uri": data_uri(pp), "position": pos})
        if not imgs:
            sys.exit("gen.py i2v: --first is required")
        body["promptImage"] = imgs if len(imgs) > 1 or a.model in ("wan3", "veo3.1", "veo3.1_fast") else imgs[0]["uri"]
        endpoint = "/v1/image_to_video"
    else:
        endpoint = "/v1/text_to_video"
    cm = body.get("contentModeration", {})
    if cm and cm.get("publicFigureThreshold", "auto") != "auto":
        sys.exit("gen.py: publicFigureThreshold must stay 'auto'")
    return endpoint, body, inputs


def elide(body: dict) -> dict:
    b = json.loads(json.dumps(body))
    for r in b.get("referenceImages") or []:
        r["uri"] = r["uri"][:30] + "…"
    pi = b.get("promptImage")
    if isinstance(pi, str):
        b["promptImage"] = pi[:30] + "…"
    elif isinstance(pi, list):
        for i in pi:
            i["uri"] = i["uri"][:30] + "…"
    return b


# ------------------------------------------------------------------ run one generation
def poll(task_id: str, every: float = 8.0, limit: float = 1800.0) -> dict:
    t0 = time.time()
    last = None
    while True:
        t = _req("GET", f"/v1/tasks/{task_id}")
        st = t.get("status")
        prog = t.get("progress")
        if st != last or prog is not None:
            print(f"[gen] task {task_id[:8]} {st}" + (f" {prog:.0%}" if isinstance(prog, (int, float)) else ""), file=sys.stderr)
            last = st
        if st in ("SUCCEEDED", "FAILED", "CANCELLED"):
            return t
        if time.time() - t0 > limit:
            raise RuntimeError(f"task {task_id} still {st} after {limit} s")
        time.sleep(every)


def download(url: str, dest: Path) -> None:
    with requests.get(url, stream=True, timeout=300) as r:
        r.raise_for_status()
        with open(dest, "wb") as f:
            for chunk in r.iter_content(1 << 20):
                f.write(chunk)


def run(kind: str, a) -> dict:
    endpoint, body, inputs = build(kind, a)
    est = estimate(a.model, getattr(a, "duration", None) or 0, a.ratio, False)
    if a.dry_run:
        print(json.dumps({"endpoint": endpoint, "body": elide(body), "estimate_credits": est}, indent=1))
        return {}
    out = Path(a.out).resolve()
    out.mkdir(parents=True, exist_ok=True)
    name = a.name or f"{a.model}-{kind}-{dt.datetime.now().strftime('%H%M%S')}"
    b0 = balance()
    if a.cap is not None and est is not None and est > a.cap:
        sys.exit(f"gen.py: estimate {est} credits is over --cap {a.cap}")
    if a.floor is not None and b0 is not None and est is not None and b0 - est < a.floor:
        sys.exit(f"gen.py: balance {b0} - estimate {est} would go under the floor {a.floor}")
    prov = {
        "tool": "studio/src/dev/genvideo/runway/gen.py",
        "provider": "Runway API (api.dev.runwayml.com)", "api_version": VERSION,
        "endpoint": endpoint, "kind": kind, "model": a.model,
        "prompt": a.prompt, "negative_prompt": body.get("negativePrompt"),
        "seed": body.get("seed"), "ratio": body.get("ratio"), "duration_s": body.get("duration"),
        "audio": body.get("audio", None), "content_moderation": body.get("contentModeration"),
        "inputs": inputs, "request_body_elided": elide(body),
        "credits_before": b0, "estimate_credits": est,
        "submitted_at": now(), "purpose": a.purpose,
        "terms_note": "Not re-verified by this tool: per GENAI-UPGRADE-PLAN §5.1, Runway claims no ownership of outputs; Veo outputs carry Google SynthID (invisible). Check each clip for a visible watermark; disclose in the end credits (GENAI §6).",
    }
    t_start = time.time()
    try:
        created = _req("POST", endpoint, body)
        tid = created["id"]
        prov["task_id"] = tid
        print(f"[gen] submitted {name}: task {tid}", file=sys.stderr)
        task = poll(tid)
        prov["status"] = task.get("status")
        prov["task_created_at"] = task.get("createdAt")
        if task.get("status") != "SUCCEEDED":
            prov["failure"] = {k: task.get(k) for k in ("failure", "failureCode") if task.get(k)}
        else:
            urls = task.get("output") or []
            files = []
            for i, u in enumerate(urls):
                ext = Path(u.split("?")[0]).suffix or (".png" if kind == "t2i" else ".mp4")
                dest = out / (f"{name}{ext}" if i == 0 else f"{name}-{i}{ext}")
                download(u, dest)
                files.append({"file": dest.name, "sha256": sha256(dest), "bytes": dest.stat().st_size})
            prov["outputs"] = files
    except Exception as e:  # noqa: BLE001: provenance for failures too
        prov["status"] = prov.get("status") or "ERROR"
        prov["error"] = _scrub(str(e))[:1000]
    prov["finished_at"] = now()
    prov["wall_s"] = round(time.time() - t_start, 1)
    try:
        b1 = balance()
        prov["credits_after"] = b1
        if b0 is not None and b1 is not None:
            prov["credits_spent"] = round(b0 - b1, 3)
    except Exception as e:  # noqa: BLE001
        prov["credits_after_error"] = _scrub(str(e))[:200]
    pj = out / f"{name}.provenance.json"
    pj.write_text(json.dumps(prov, indent=1) + "\n")
    print(json.dumps({k: prov.get(k) for k in ("status", "task_id", "credits_before", "credits_after", "credits_spent", "wall_s", "outputs", "error", "failure")}, indent=1))
    return prov


# ------------------------------------------------------------------ CLI
def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("balance")
    for kind in ("t2v", "i2v", "t2i"):
        p = sub.add_parser(kind)
        p.add_argument("--model", required=True)
        p.add_argument("--prompt", required=True)
        p.add_argument("--negative")
        p.add_argument("--ratio", default="1280:720")
        if kind != "t2i":
            p.add_argument("--duration", type=float, default=5)
        else:
            p.add_argument("--ref", action="append", help="tag=path: a reference image, named @tag in the prompt")
        p.add_argument("--seed", type=int)
        p.add_argument("--out", required=True)
        p.add_argument("--name")
        p.add_argument("--purpose", default="")
        p.add_argument("--cap", type=float, help="refuse if the estimate is over this many credits")
        p.add_argument("--floor", type=float, help="refuse if the balance would fall under this")
        p.add_argument("--dry-run", action="store_true")
        if kind == "i2v":
            p.add_argument("--first", required=True)
            p.add_argument("--last")
    pt = sub.add_parser("task")
    pt.add_argument("id")
    pe = sub.add_parser("estimate")
    pe.add_argument("--model", required=True)
    pe.add_argument("--duration", type=float, required=True)
    pe.add_argument("--ratio")
    a = ap.parse_args()
    if a.cmd == "balance":
        org = _req("GET", "/v1/organization")
        tier = org.get("tier", {}) or {}
        print(json.dumps({"creditBalance": org.get("creditBalance"), "maxMonthlyCreditSpend": tier.get("maxMonthlyCreditSpend"),
                          "models": sorted((tier.get("models") or {}).keys())}, indent=1))
    elif a.cmd == "estimate":
        print(estimate(a.model, a.duration, a.ratio))
    elif a.cmd == "task":
        t = _req("GET", f"/v1/tasks/{a.id}")
        print(json.dumps({k: v for k, v in t.items() if k != "output"} | {"outputs": len(t.get("output") or [])}, indent=1))
    else:
        run(a.cmd, a)


if __name__ == "__main__":
    main()
