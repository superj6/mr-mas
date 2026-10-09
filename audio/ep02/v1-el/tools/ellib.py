"""ellib.py - a small, key-safe client for the ElevenLabs REST API (https://api.elevenlabs.io), for the v3-voices-el pass.

The key is read from the repo's .env (ELEVEN_LABS_API_KEY) at call time. It is never printed, logged, written to a file
or put on a command line: it lives only in this process's request headers. Every error message that leaves this module
is passed through redact() first.

Only library voices are used (premade or the shared Voice Library), called by voice_id straight from text-to-speech.
Nothing here clones or designs a voice: there is no call to the instant-clone upload (/v1/voices/add with files),
/v1/voices/pvc, voice design, or speech-to-speech with any reference recording.
"""
from __future__ import annotations

import json
import os
import time

import requests

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "../../../.."))
API = "https://api.elevenlabs.io"
_KEY = None
LAST = {}          # headers of the last response we care about (request-id, character-cost); never the key


def _key():
    global _KEY
    if _KEY is None:
        with open(os.path.join(REPO, ".env")) as f:
            for ln in f:
                ln = ln.strip()
                if ln.startswith("ELEVEN_LABS_API_KEY="):
                    _KEY = ln.split("=", 1)[1].strip().strip('"').strip("'")
        if not _KEY:
            raise SystemExit("ELEVEN_LABS_API_KEY not found in .env")
    return _KEY


def redact(s):
    s = str(s)
    k = _KEY
    return s.replace(k, "[REDACTED]") if k else s


def _req(method, path, params=None, body=None, timeout=120, raw=False, tries=4):
    url = API + path
    h = {"xi-api-key": _key(), "accept": "application/json" if not raw else "*/*"}
    last = None
    for i in range(tries):
        try:
            r = requests.request(method, url, params=params, json=body, headers=h, timeout=timeout)
        except requests.RequestException as e:          # network: retry
            last = redact(type(e).__name__)
            time.sleep(2 * (i + 1))
            continue
        if r.status_code == 429 or r.status_code >= 500:
            last = f"HTTP {r.status_code}: {redact(r.text[:300])}"
            time.sleep(3 * (i + 1))
            continue
        if r.status_code >= 400:
            raise RuntimeError(f"{method} {path} -> HTTP {r.status_code}: {redact(r.text[:600])}")
        LAST.clear()
        LAST.update({k.lower(): v for k, v in r.headers.items()
                     if k.lower() in ("request-id", "character-cost", "x-character-count", "history-item-id")})
        return r.content if raw else r.json()
    raise RuntimeError(f"{method} {path} failed after {tries} tries: {last}")


def get(path, **params):
    return _req("GET", path, params=params or None)


def post(path, body, params=None, raw=False, timeout=180):
    return _req("POST", path, params=params, body=body, raw=raw, timeout=timeout)


def subscription():
    s = get("/v1/user/subscription")
    return {k: s.get(k) for k in ("tier", "character_count", "character_limit", "next_character_count_reset_unix",
                                  "voice_limit", "voice_slots_used", "professional_voice_limit",
                                  "can_extend_character_limit", "status")}


def download(url, dest, timeout=60):
    """a public preview file (the library's preview_url on its CDN): no key is sent"""
    r = requests.get(url, timeout=timeout)
    r.raise_for_status()
    with open(dest, "wb") as f:
        f.write(r.content)
    return dest


def jdump(obj, path, indent=1):
    tmp = path + ".tmp"
    with open(tmp, "w") as f:
        json.dump(obj, f, indent=indent, ensure_ascii=False)
        f.write("\n")
    os.replace(tmp, path)


def tts(voice_id, text, model_id="eleven_v3", settings=None, seed=None, output_format="mp3_44100_192",
        timestamps=True, language_code="en"):
    """one text-to-speech call. -> (audio bytes, alignment dict or None, request body as sent, minus nothing secret).
    The with-timestamps endpoint returns base64 audio plus character-level alignment."""
    import base64
    body = {"text": text, "model_id": model_id}
    if settings:
        body["voice_settings"] = settings
    if seed is not None:
        body["seed"] = int(seed)
    if language_code:
        body["language_code"] = language_code
    path = f"/v1/text-to-speech/{voice_id}" + ("/with-timestamps" if timestamps else "")
    params = {"output_format": output_format}
    if timestamps:
        r = post(path, body, params=params)
        return base64.b64decode(r["audio_base64"]), {"alignment": r.get("alignment"),
                                                     "normalized_alignment": r.get("normalized_alignment")}, body
    return post(path, body, params=params, raw=True), None, body
