#!/usr/bin/env python3
"""Ep1 v3.5 takes (script draft 8.4, the final version): what to read, what to cut, what to reuse, and the lines files.

  python3 audio/ep01/v35/takes.py plan                                  -> audio/ep01/v35/<seg>/lines-in.json (fastrec input)
  bash    ops/heavy.sh bash audio/ep01/v35/record.sh act1 act2 act4     -> fastrec into audio/ep01/v35/<seg>/ (--workers 2)
  audio/.venv-casting/bin/python audio/ep01/v35/takes.py cut            -> the cut take (Terb, v35-a4-0008)
  python3 audio/ep01/v35/takes.py assemble                              -> audio/ep01/v35/<seg>/lines-v35.json

Everything comes from the v3.5 spec (show/episodes/ep01/production/full-v3/beat-plan-v35/_spec_v35.py), so the text
can't drift from the plans:
  - READ, V.O. (NEW_VO): Mas's inner voice in the episode's existing Kokoro voice (speaker mas-manalt, kind vo: fastrec's
    vo-close chain on am_michael · a-michael-close), the v3.4 settings; speed 0.87 (0.95 for the war room's count).
  - READ, dialogue (NEW_LINES): each line copies its reference take's speaker, voice, speed and device, i.e. the
    character's existing Kokoro voice. MARIO's "Point two…" is read in his Kokoro voice (final, choice 11A). AUHSOJ has no
    voice yet: a stock registry preset (the photographer's) doubles on the call chain for timing only; the ElevenLabs
    pass casts him. Never a clone of anyone.
  - CUT (CUT): Terb's return announcement (v3-a4-0004) from its second sentence, at the sentence boundary, 12 ms fades,
    room-tone handles to 0.35 s, no device chain (the source is already dry), levelled to -16 LUFS.
  - REUSE (REUSE): a new id on an existing take file, no new audio (Mas's "still a preview." at the window).
  - Restored takes (RESTORE) keep their own files and rows; the plans carry their paths.
"""
import json
import os
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../..'))
HERE = os.path.join(ROOT, 'audio/ep01/v35')
sys.path.insert(0, os.path.join(ROOT, 'show/episodes/ep01/production/full-v3/beat-plan-v35'))
import _spec_v35 as S  # noqa: E402

HANDLE, FADE = 0.35, 0.012


def camera(d):
    if d.get("device") == "call":
        return "monitor"
    if d.get("tag") == "O.S." or d.get("os"):
        return "os"
    return "on"


def plan():
    per = {}
    for vid, (seg, bid, text, say, delivery, kind, speed) in S.NEW_VO.items():
        per.setdefault(seg, []).append({
            'id': vid, 'scene': str(S.scene_of(seg, bid)), 'speaker': 'MAS MANALT', 'speaker_slug': 'mas-manalt',
            'text': text, 'spoken_as': say, 'delivery': delivery, 'tag': f'[INVENTED · VO · draft 8.4 · {kind}]',
            'mode': 'on-mic', 'on_camera': 'vo', 'kind': 'vo', 'side': 'none', 'shot': bid, 'status': 'fast',
            'speed': speed})
    rows = S.take_rows()
    os_lines = {"v35-a1-0006"}   # Mas off picture in 13.03
    for lid, d in S.NEW_LINES.items():
        ref = rows[d["ref"]]
        row = {'id': lid, 'scene': str(S.scene_of(d["seg"], d["beat"])), 'speaker': d.get("speaker", ref['speaker']),
               'speaker_slug': d.get("speaker", ref['speaker']).lower() if d.get("voice_slug") else ref.get('speaker_slug'),
               'text': d["text"], 'spoken_as': d["say"], 'delivery': d["delivery"], 'tag': d["note"], 'mode': 'on-mic',
               'on_camera': "os" if lid in os_lines else camera(d), 'kind': 'dialogue', 'side': 'none',
               'shot': d["beat"], 'status': 'fast',
               'speed': d.get("speed") or ref.get('pace', {}).get('speed') or 1.0, 'ref_take': d["ref"]}
        if d.get("device"):
            row['device'] = d["device"]
        if d.get("voice_slug"):
            row['voice_slug'] = d["voice_slug"]
        per.setdefault(d["seg"], []).append(row)
    for seg, rs in per.items():
        os.makedirs(os.path.join(HERE, seg), exist_ok=True)
        json.dump(rs, open(os.path.join(HERE, seg, 'lines-in.json'), 'w'), indent=1, ensure_ascii=False)
        print(f'audio/ep01/v35/{seg}/lines-in.json: {len(rs)} to read ({", ".join(r["id"] for r in rs)})')


def cut():
    import numpy as np
    import soundfile as sf
    sys.path.insert(0, os.path.join(ROOT, 'audio/ep01/act4/dialogue/tools/fastrec'))
    import house
    rows = S.take_rows()
    for cid, (src, first_word, last_word, dev) in S.CUT.items():
        r = rows[src]
        seg_name = S.NEW_LINES.get(cid, {}).get("seg", "act4")
        x, sr = sf.read(os.path.join(ROOT, r['file']), always_2d=True, dtype='float64')
        W = r['words']
        i0 = next(i for i, w in enumerate(W) if w['w'].strip('"“”').startswith(first_word) and i > 0)
        i1 = len(W) - 1 if last_word is None else next(i for i, w in enumerate(W) if i > i0 and w['w'].startswith(last_word))
        prev_t1 = W[i0 - 1]['t1']
        a = max((prev_t1 + W[i0]['t0']) / 2, W[i0]['t0'] - HANDLE)
        e = r['pace']['audible_out_s'] + 0.1 if i1 == len(W) - 1 else min((W[i1]['t1'] + W[i1 + 1]['t0']) / 2, W[i1]['t1'] + HANDLE)
        a, e = max(0.0, a), min(len(x) / sr, e)
        seg = x[int(a * sr):int(e * sr)].copy()
        k = int(FADE * sr)
        seg[:k] *= np.linspace(0, 1, k)[:, None]
        seg[-k:] *= np.linspace(1, 0, k)[:, None]
        tone = x[:int(0.25 * sr)].copy()
        pre = max(0.0, HANDLE - (W[i0]['t0'] - a))
        post = max(0.0, HANDLE - (e - W[i1]['t1']))
        pad = lambda s: np.concatenate([tone] * (int(s * sr) // len(tone) + 1))[:int(s * sr)]
        y = np.concatenate([pad(pre), seg, pad(post)])
        mono = y.mean(axis=1).astype(np.float32)
        if dev:
            mono = house.L.V.apply_chain(mono, sr, house.DEVICES[dev]()).astype(np.float32)
        mono = house.L.V.normalise(mono, target=-16.0).astype(np.float32)
        out = os.path.join(HERE, seg_name, 'wav', f'{cid}.wav')
        os.makedirs(os.path.dirname(out), exist_ok=True)
        sf.write(out, mono, sr, subtype='PCM_24')
        off = pre - a
        words = [dict(w, t0=round(w['t0'] + off, 3), t1=round(w['t1'] + off, 3)) for w in W[i0:i1 + 1]]
        new = {k2: v for k2, v in r.items() if k2 not in ('mouth', 'alt_takes', 'mp3', 'clean', 'complete', '_file')}
        new.update(id=cid, file=os.path.relpath(out, ROOT), duration_s=round(len(mono) / sr, 3), words=words,
                   text=S.CUT_TEXT[cid], device=dev,
                   cut_from=f'{src} words {i0}-{i1} ({r["file"]}, {a:.3f}-{e:.3f} s), 12 ms fades, room-tone handles to {HANDLE} s; '
                            f'{"then fastrec" + chr(39) + "s " + dev + " chain, " if dev else "no device chain (dry, as the source), "}-16 LUFS')
        new['pace'] = dict(r['pace'], audible_in_s=round(words[0]['t0'] - 0.02, 3),
                           audible_out_s=round(min(len(mono) / sr, words[-1]['t1'] + 0.08), 3))
        json.dump(new, open(os.path.join(HERE, seg_name, 'wav', f'{cid}.cut.json'), 'w'), indent=1, ensure_ascii=False)
        print(f'{new["file"]}: {" ".join(w["w"] for w in words)[:70]!r}… ({len(mono) / sr:.2f} s) from {src} words {i0}-{i1}')


def assemble():
    per = {}
    for vid, v in S.NEW_VO.items():
        per.setdefault(v[0], []).append(vid)
    for lid, d in S.NEW_LINES.items():
        per.setdefault(d["seg"], []).append(lid)
    for lid in S.CUT:
        per.setdefault("act4", []).append(lid)
    for lid in S.REUSE:
        per.setdefault("act1", []).append(lid)
    rows = S.take_rows()
    for seg, ids in per.items():
        d = os.path.join(HERE, seg)
        rec = {r['id']: r for r in json.load(open(os.path.join(d, 'lines.json')))} if os.path.exists(os.path.join(d, 'lines.json')) else {}
        out = []
        for i in ids:
            if i in rec:
                r = dict(rec[i])
                spec = S.NEW_LINES.get(i, {})
                if spec.get("voice_slug"):   # a doubled stock preset: the row keeps the character's name
                    r['speaker'], r['speaker_slug'] = spec["speaker"], spec["speaker"].lower()
                    r['voice_note'] = f'doubled stock preset {spec["voice_slug"]} (timing only; the ElevenLabs pass casts {spec["speaker"]})'
                out.append(r)
            elif i in S.CUT:
                p = os.path.join(d, 'wav', f'{i}.cut.json')
                if os.path.exists(p):
                    out.append(json.load(open(p)))
                else:
                    print(f'  ! {seg}: {i} not cut yet (run: audio/.venv-casting/bin/python audio/ep01/v35/takes.py cut)')
            elif i in S.REUSE:
                src = rows[S.REUSE[i]]
                r = {k: v for k, v in src.items() if k != '_file'}
                r.update(id=i, reuse_of=S.REUSE[i], text=src['text'].lstrip('…'), shot='v35-18.02',
                         note='the same take file as launch night (no new audio): the old joke, the same read')
                out.append(r)
            else:
                print(f'  ! {seg}: {i} has no take')
        json.dump(out, open(os.path.join(d, 'lines-v35.json'), 'w'), indent=1, ensure_ascii=False)
        print(f'audio/ep01/v35/{seg}/lines-v35.json: {len(out)} takes')


if __name__ == '__main__':
    {'plan': plan, 'cut': cut, 'assemble': assemble}[sys.argv[1] if len(sys.argv) > 1 else 'plan']()
