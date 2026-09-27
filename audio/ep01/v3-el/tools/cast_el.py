"""cast_el.py - casting screen for the ElevenLabs voice pass (MR. MAS Ep1, track A4, pass v3-voices-el).

Subcommands (every one is free: metadata and the library's public preview MP3s only, no text-to-speech):
  pool      pull American-English shared-library voices (metadata) + the account's premade voices -> <work>/pool.json
  screen    drop anything that could point at a real person, an accent, a price multiplier or a banned register;
            rank the rest per role from the briefs -> <work>/shortlist.json
  measure   download each shortlisted voice's preview MP3 and measure it: median F0, F0 range, speaking rate (ASR words),
            brightness (spectral centroid) -> <work>/measure.json

House rule, binding: never clone or imitate a real person's voice. No voice is chosen because it resembles anyone;
the screen *removes* every voice whose name or description names or evokes a real person, a celebrity, an
impression, a real product's assistant voice, or a regional/foreign accent, before any ranking happens.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import ellib  # noqa: E402

# --------------------------------------------------------------------------------------------- the screen
RED_PERSON = re.compile(
    r"\b(celebrit\w*|famous|impression\w*|imitat\w*|parod\w*|soundalike|sound-alike|look-?alike|sounds? like|"
    r"inspired by|in the style of|style of|voice of|as heard|clone of|deepfake|lookalike|"
    r"president|senator|politician|congress\w*|governor|prime minister|king|queen|prince|pope|"
    r"trump|biden|obama|clinton|harris|kamala|schumer|blumenthal|vance|musk|elon|altman|sutskever|brockman|"
    r"murati|toner|nadella|jensen|huang|zuckerberg|bezos|gates|jobs|amodei|hassabis|pichai|son\b|cook\b|"
    r"andreessen|thiel|sacks|freeman|attenborough|morgan|oprah|rogan|shapiro|peterson|tyson|arnold|"
    r"batman|joker|yoda|darth|vader|gandalf|optimus|spongebob|mario\b|sonic|pikachu|disney|pixar|marvel|anime|"
    r"narrator of|character from|movie|film star|actor who|tv host|youtuber|streamer|podcaster|"
    r"siri|alexa|cortana|chatgpt|openai|gpt|juniper|breeze|\bsky\b|ember|\bcove\b|arbor|maple|\bsol\b|spruce|\bvale\b|"
    r"jarvis|hal ?9000|glados|connery|sinatra|elvis|brando|nicholson|walken|bogart|shatner|"
    r"black american|white american|african american|ethnic\w*|scripture\w*|bible|biblical|church|sermon|preacher|pastor|"
    r"priest|gospel|lisp\w*|stutter\w*)\b", re.I)
RED_ACCENT = re.compile(
    r"\b(southern|texan|texas|country|cowboy|new york\w*|brooklyn|bronx|boston|chicago|midwest\w*|valley girl|"
    r"californian|surfer|jersey|cajun|appalachian|hillbilly|redneck|gangster|urban|street|hood|"
    r"british|irish|scottish|welsh|australian|aussie|kiwi|canadian|indian|african|nigerian|"
    r"jamaican|caribbean|latino|latina|hispanic|mexican|spanish|puerto|cuban|french|german|russian|italian|"
    r"asian|chinese|japanese|korean|arab|middle eastern|european|foreign|bilingual|non-native)\b", re.I)
BARE_ACCENT = re.compile(r"\baccent\w*\b", re.I)
OK_ACCENT = re.compile(r"\b(general|standard|neutral|mid-?atlantic)?\s*american accent\b|\bneutral accent\b|"
                       r"\bno (discernible |noticeable )?accent\b|\baccent-?free\b|\bwithout an? accent\b", re.I)
RED_REGISTER = re.compile(
    r"\b(asmr|whisper\w*|sleep\w*|meditat\w*|hypno\w*|seduct\w*|sultry|sexy|flirt\w*|sensual|breathy|erotic|"
    r"trailer|villain\w*|evil|demon\w*|monster|horror|creepy|scary|zombie|goblin|wizard|pirate|robot\w*|"
    r"old man|old woman|grandpa|grandma|grandfather|grandmother|elderly|senior citizen|raspy|gravel\w*|husky|smok\w*|"
    r"child|children|kid|kids|teen\w*|baby|little girl|little boy|young boy|schoolgirl|cartoon\w*|squeaky|drunk|"
    r"stoned|sick|shout\w*|scream\w*|angry|rage)\b", re.I)
BAD_DESCRIPTIVE = {"whispery", "raspy", "husky", "rough", "robotic", "sad", "grumpy", "meditative", "sassy"}


def red_flags(v):
    txt = f"{v.get('name') or ''} || {v.get('description') or ''}"
    out = []
    if RED_PERSON.search(txt):
        out.append("person:" + RED_PERSON.search(txt).group(0))
    if RED_ACCENT.search(txt):
        out.append("accent:" + RED_ACCENT.search(txt).group(0))
    elif BARE_ACCENT.search(txt) and not OK_ACCENT.search(txt):
        out.append("accent:" + BARE_ACCENT.search(txt).group(0))
    if RED_REGISTER.search(txt):
        out.append("register:" + RED_REGISTER.search(txt).group(0))
    if (v.get("descriptive") or "") in BAD_DESCRIPTIVE:
        out.append("descriptive:" + v["descriptive"])
    if (v.get("rate") or 1.0) != 1.0 or v.get("fiat_rate"):
        out.append(f"price:rate {v.get('rate')} fiat {v.get('fiat_rate')}")
    if v.get("category") not in ("professional", "high_quality", "premade", "generated"):
        out.append("category:" + str(v.get("category")))
    if (v.get("accent") or "american") != "american" or (v.get("locale") not in (None, "", "en-US")):
        out.append(f"locale:{v.get('accent')}/{v.get('locale')}")
    return out


# --------------------------------------------------------------------------------------------- the roles
# gender, allowed ages, preferred descriptives (weight 2), preferred words in name/description (weight 1 each),
# words that count against (weight -2), shortlist size. From audio/voices/CASTING.md, cast_a4.py and the
# character files; never from any real person.
ROLES = {
    "mas-manalt": dict(g="male", ages={"young", "middle_aged"}, desc={"calm", "relaxed", "chill", "gentle", "soft", "pleasant", "neutral"},
                       words="soft soft-spoken calm measured understated gentle quiet thoughtful warm intimate close natural conversational relaxed even steady mellow low-key subtle",
                       against="energetic hype excited announcer booming deep bass dramatic epic loud fast", n=16),
    "gerg-mockbran": dict(g="male", ages={"young", "middle_aged"}, desc={"upbeat", "excited", "casual", "pleasant", "confident", "hyped"},
                          words="fast quick energetic upbeat cheerful friendly bright enthusiastic lively sunny chatty youthful conversational tech rapid",
                          against="deep bass slow calm soothing gravel dramatic narrator documentary", n=16),
    "alyi": dict(g="male", ages={"middle_aged", "young"}, desc={"deep", "calm", "serious", "wise", "mature", "classy"},
                 words="deep low resonant grave slow measured weighty rich baritone contemplative thoughtful philosophical calm serene documentary narration",
                 against="energetic upbeat excited fast bright youthful hype trailer epic", n=16),
    "rima-tamuri": dict(g="female", ages={"young", "middle_aged"}, desc={"calm", "professional", "confident", "pleasant", "classy", "crisp"},
                        words="calm composed confident professional clear warm diplomatic polished poised smooth measured news broadcast corporate",
                        against="cute bubbly excited hyped childlike breathy high-pitched", n=16),
    "neleh": dict(g="female", ages={"young", "middle_aged"}, desc={"crisp", "professional", "calm", "neutral", "formal", "serious"},
                  words="precise articulate crisp clear clean polite exact thoughtful intelligent academic measured cool neutral informative",
                  against="warm bubbly cute excited sassy husky breathy", n=16),
    "tasya": dict(g="male", ages={"middle_aged", "young"}, desc={"calm", "gentle", "pleasant", "relaxed", "soft", "classy"},
                  words="warm gentle soft smiling friendly kind soothing calm amused pleasant easy smooth mellow",
                  against="energetic hype excited deep bass gravel announcer", n=16),
    "mada": dict(g="male", ages={"middle_aged", "young"}, desc={"neutral", "calm", "professional", "formal"},
                 words="neutral flat even level plain steady controlled measured corporate",
                 against="energetic excited warm bubbly gravel", n=8),
    "chatgtp": dict(g="female", ages={"young"}, desc={"upbeat", "excited", "cute", "pleasant"},
                    words="bright bubbly cheerful eager enthusiastic friendly upbeat peppy sweet happy",
                    against="deep calm serious husky", n=8),
    "mario": dict(g="male", ages={"young", "middle_aged"}, desc={"calm", "professional", "pleasant", "casual", "neutral"},
                  words="earnest thoughtful clear podcast lecture warm sincere intelligent measured articulate",
                  against="deep bass gravel hype announcer", n=8),
    "ttemme": dict(g="male", ages={"young", "middle_aged"}, desc={"casual", "chill", "pleasant", "upbeat"},
                   words="casual chill laid-back friendly affable conversational easygoing relaxed natural",
                   against="deep bass announcer formal", n=8),
    "terb": dict(g="male", ages={"middle_aged", "young"}, desc={"confident", "professional", "crisp", "deep"},
                 words="crisp clear confident capable calm steady baritone reassuring practical direct",
                 against="excited hype bubbly soft whisper", n=8),
    "radnus": dict(g="male", ages={"middle_aged", "young"}, desc={"gentle", "calm", "soft", "pleasant", "classy"},
                   words="gentle soft courteous polite warm kind calm smooth sincere",
                   against="energetic hype excited deep bass gravel", n=8),
    "adelina": dict(g="female", ages={"middle_aged", "young"}, desc={"professional", "confident", "pleasant", "calm"},
                    words="warm brisk clear confident friendly kind direct professional",
                    against="cute bubbly breathy husky", n=8),
    "tiled-employee": dict(g="female", ages={"young", "middle_aged"}, desc={"casual", "pleasant", "neutral", "calm"},
                           words="natural plain conversational everyday real casual clear",
                           against="announcer dramatic breathy", n=6),
    "nedib": dict(g="male", ages={"middle_aged"}, desc={"confident", "pleasant", "classy", "professional"},
                  words="warm friendly direct clear confident conversational folksy",
                  against="old aged elderly slow gravel raspy tremble", n=8),
    "sydney": dict(g="female", ages={"young"}, desc={"cute", "pleasant", "upbeat", "calm"},
                   words="sweet soft gentle friendly warm lilting melodic",
                   against="deep husky breathy", n=8),
    "sucram": dict(g="male", ages={"young", "middle_aged"}, desc={"casual", "confident", "neutral"},
                   words="fast quick dry direct conversational matter-of-fact",
                   against="deep soothing slow announcer", n=6),
    "sirrah": dict(g="female", ages={"middle_aged"}, desc={"crisp", "professional", "confident", "formal"},
                   words="crisp clear patient precise teacher educational articulate",
                   against="cute breathy husky", n=6),
    "nole": dict(g="male", ages={"middle_aged", "young"}, desc={"confident", "intense", "casual", "excited"},
                 words="punchy bold confident forward energetic dynamic",
                 against="soft gentle soothing whisper calm", n=6),
    "lahtnemulb": dict(g="male", ages={"middle_aged"}, desc={"formal", "serious", "professional", "mature"},
                       words="formal serious measured steady official clear",
                       against="casual hype excited", n=6),
    "a-senator": dict(g="female", ages={"middle_aged"}, desc={"professional", "formal", "confident", "serious"},
                      words="clear confident professional measured direct",
                      against="cute bubbly breathy", n=6),
    "photographer": dict(g="female", ages={"young", "middle_aged"}, desc={"upbeat", "pleasant", "casual", "confident"},
                         words="brisk cheerful friendly quick upbeat",
                         against="deep slow breathy", n=6),
    "nirb": dict(g="male", ages={"young", "middle_aged"}, desc={"upbeat", "excited", "pleasant", "casual"},
                 words="bright eager curious friendly energetic",
                 against="deep bass slow", n=6),
    "egap": dict(g="male", ages={"middle_aged"}, desc={"calm", "serious", "neutral", "deep"},
                 words="dry level low calm understated deliberate",
                 against="excited hype bubbly", n=6),
    "oigneb": dict(g="male", ages={"middle_aged"}, desc={"calm", "gentle", "soft", "wise", "professional"},
                   words="soft gentle warm thoughtful lecture professor precise calm",
                   against="energetic hype excited", n=6),
    "remuhcs": dict(g="male", ages={"middle_aged"}, desc={"confident", "professional", "pleasant", "classy"},
                    words="host warm confident clear friendly",
                    against="whisper soft", n=6),
    "panel-host": dict(g="neutral", ages={"young", "middle_aged"}, desc={"calm", "pleasant", "professional", "neutral"},
                       words="warm friendly host neutral clear",
                       against="", n=6),
    "nesnej": dict(g="male", ages={"middle_aged"}, desc={"confident", "upbeat", "excited", "pleasant"},
                   words="warm showman energetic enthusiastic generous confident keynote presenter",
                   against="soft whisper calm", n=6),
    "clod": dict(g="neutral", ages={"young", "middle_aged"}, desc={"calm", "pleasant", "gentle", "neutral"},
                 words="warm earnest friendly soft",
                 against="", n=6),
}


def score(v, r):
    if (v.get("gender") or "") != r["g"]:
        return None
    age = (v.get("age") or "").replace("-", "_")
    if age not in r["ages"]:
        return None
    txt = f"{v.get('name') or ''} {v.get('description') or ''}".lower()
    s = 2.0 if (v.get("descriptive") or "") in r["desc"] else 0.0
    s += sum(1.0 for w in r["words"].split() if re.search(r"\b" + re.escape(w) + r"\b", txt))
    s -= sum(2.0 for w in r["against"].split() if re.search(r"\b" + re.escape(w) + r"\b", txt))
    if v.get("category") == "premade":
        s += 0.5
    u = v.get("usage_character_count_1y") or 0
    s += min(2.0, (len(str(int(u))) - 5) * 0.5) if u > 0 else 0.0     # well-used voices: proven in production
    return s


# --------------------------------------------------------------------------------------------- commands
def cmd_pool(a):
    import collections
    keep = ('public_owner_id', 'voice_id', 'name', 'accent', 'gender', 'age', 'descriptive', 'use_case', 'category',
            'language', 'locale', 'description', 'preview_url', 'usage_character_count_1y', 'cloned_by_count', 'rate',
            'fiat_rate', 'free_users_allowed', 'live_moderation_enabled', 'featured', 'date_unix')
    pool = {}
    for g in ["male", "female", "neutral"]:
        for uc in ["conversational", "narrative_story", "characters_animation", "entertainment_tv",
                   "informative_educational", "social_media", "advertisement"]:
            for page in range(2 if g != "neutral" else 1):
                r = ellib.get("/v1/shared-voices", page_size=100, page=page, language="en", accent="american",
                              gender=g, use_cases=uc, sort="usage_character_count_1y")
                for v in r["voices"]:
                    vv = {k: v.get(k) for k in keep}
                    vv["source"] = "shared-library"
                    pool.setdefault(v["voice_id"], vv)
                if not r.get("has_more"):
                    break
    for v in ellib.get("/v2/voices", page_size=100)["voices"]:
        lab = v.get("labels") or {}
        pool[v["voice_id"]] = dict(voice_id=v["voice_id"], name=v["name"], category=v.get("category"),
                                   gender=lab.get("gender"), age=lab.get("age"), accent=lab.get("accent"),
                                   descriptive=lab.get("descriptive"), use_case=lab.get("use_case"),
                                   description=v.get("description"), preview_url=v.get("preview_url"),
                                   rate=1.0, fiat_rate=None, source="premade", locale="en-US")
    os.makedirs(a.work, exist_ok=True)
    ellib.jdump(list(pool.values()), os.path.join(a.work, "pool.json"))
    print(len(pool), collections.Counter(v["category"] for v in pool.values()))


def cmd_screen(a):
    pool = json.load(open(os.path.join(a.work, "pool.json")))
    clean, dropped = [], {}
    for v in pool:
        f = red_flags(v)
        if f:
            dropped[v["voice_id"]] = dict(name=v["name"], flags=f)
        else:
            clean.append(v)
    out = {}
    for role, r in ROLES.items():
        ranked = sorted(((score(v, r), v) for v in clean if score(v, r) is not None), key=lambda t: -t[0])
        out[role] = [dict(voice_id=v["voice_id"], name=v["name"], score=round(s, 2), category=v["category"],
                          source=v.get("source"), descriptive=v.get("descriptive"), age=v.get("age"),
                          description=(v.get("description") or "")[:240], preview_url=v.get("preview_url"),
                          public_owner_id=v.get("public_owner_id"), usage_1y=v.get("usage_character_count_1y"))
                     for s, v in ranked[: r["n"]]]
    ellib.jdump(dict(roles=out, dropped=dropped, n_pool=len(pool), n_clean=len(clean)), os.path.join(a.work, "shortlist.json"))
    print(f"pool {len(pool)}; clean {len(clean)}; dropped {len(dropped)}")
    for role, lst in out.items():
        print(f"== {role}: " + " | ".join(f"{x['name'][:34]} ({x['score']})" for x in lst[:6]))


def f0_stats(y, sr):
    import numpy as np
    import librosa
    f0, vflag, _ = librosa.pyin(y, fmin=60, fmax=400, sr=sr, frame_length=1024, hop_length=256)
    fv = f0[vflag & ~np.isnan(f0)]
    if len(fv) < 10:
        return None, None
    med = float(np.median(fv))
    st = 12 * np.log2(fv / med)
    st = st[np.abs(st) <= 12]
    return round(med, 1), round(float(np.percentile(st, 95) - np.percentile(st, 5)), 1)


def cmd_measure(a):
    import numpy as np
    import soundfile as sf
    import librosa
    from faster_whisper import WhisperModel
    sl = json.load(open(os.path.join(a.work, "shortlist.json")))
    pdir = os.path.join(a.work, "previews")
    os.makedirs(pdir, exist_ok=True)
    mpath = os.path.join(a.work, "measure.json")
    meas = json.load(open(mpath)) if os.path.exists(mpath) else {}
    ids = {}
    for role, lst in sl["roles"].items():
        for x in lst:
            ids.setdefault(x["voice_id"], x)
    for v in json.load(open(os.path.join(a.work, "pool.json"))):      # every premade voice is measured too
        if v.get("source") == "premade" and not red_flags(v):
            ids.setdefault(v["voice_id"], v)
    asr = WhisperModel("small.en", device="cpu", compute_type="int8", cpu_threads=4)
    for i, (vid, x) in enumerate(ids.items()):
        if vid in meas or not x.get("preview_url"):
            continue
        dest = os.path.join(pdir, vid + ".mp3")
        try:
            if not os.path.exists(dest):
                ellib.download(x["preview_url"], dest)
            y, sr = sf.read(dest, dtype="float32", always_2d=True)
            y = y.mean(axis=1)
            y16 = librosa.resample(y, orig_sr=sr, target_sr=16000)
            segs, _ = asr.transcribe(y16, language="en", beam_size=1, word_timestamps=True, vad_filter=False)
            words = [w for s in segs for w in (s.words or [])]
            txt = " ".join(w.word.strip() for w in words)
            if len(words) >= 5:
                span = words[-1].end - words[0].start
                wpm = round(len(words) / span * 60, 1)
                # speech-only rate: drop gaps over 0.25 s
                gaps = sum(max(0.0, words[k + 1].start - words[k].end) for k in range(len(words) - 1)
                           if words[k + 1].start - words[k].end > 0.25)
                wpm_art = round(len(words) / max(0.1, span - gaps) * 60, 1)
            else:
                span, wpm, wpm_art = None, None, None
            yy = librosa.resample(y, orig_sr=sr, target_sr=22050)[: 22050 * 25]
            med, rng = f0_stats(yy, 22050)
            cen = float(np.median(librosa.feature.spectral_centroid(y=yy, sr=22050)[0]))
            meas[vid] = dict(name=x["name"], f0_med_hz=med, f0_range_st=rng, wpm=wpm, wpm_speech=wpm_art,
                             centroid_hz=round(cen), dur_s=round(len(y) / sr, 2), asr=txt[:300])
            print(f"[{i+1}/{len(ids)}] {x['name'][:40]:40s} f0 {med} rng {rng} wpm {wpm}/{wpm_art} cen {round(cen)}", flush=True)
        except Exception as e:  # noqa: BLE001
            meas[vid] = dict(name=x["name"], error=ellib.redact(e))
            print("ERR", x["name"], ellib.redact(e), flush=True)
        if i % 10 == 0:
            ellib.jdump(meas, mpath)
    ellib.jdump(meas, mpath)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["pool", "screen", "measure"])
    ap.add_argument("--work", required=True)
    a = ap.parse_args()
    dict(pool=cmd_pool, screen=cmd_screen, measure=cmd_measure)[a.cmd](a)


if __name__ == "__main__":
    main()
