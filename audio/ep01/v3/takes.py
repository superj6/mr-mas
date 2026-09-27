#!/usr/bin/env python3
"""Ep1 v3 takes (PLAN.md track S2, pass `v3-lock`): what to record, and the per-segment lines files the lock reads.

  python3 audio/ep01/v3/takes.py plan        -> audio/ep01/v3/<seg>/lines-in.json   (fastrec input, one per segment)
  bash    audio/ep01/v3/record.sh            -> fastrec into audio/ep01/v3/<seg>/    (through ops/heavy.sh, --workers 2)
  python3 audio/ep01/v3/takes.py assemble    -> audio/ep01/v3/<seg>/lines-v3.json   (every v3 take of the segment)

What is recorded (script-v3-notes §8, with the changes listed in lock.md):
  - every Mas V.O. line of the beat plans that has no usable take (kind "vo", on_camera "vo", speed 0.85-0.88);
  - the five new or changed spoken lines (v3-a2-0001, v3-a4-0001..0004), read whole, in the speaker's v2/v5 voice
    and speed (a whole read, not a splice of the old take: nobody can listen to judge a splice);
  - the sample takes whose text is identical are REUSED (copied to audio/ep01/v3/<seg>/wav/<v3 id>.wav), except the
    ones that say a name against the registry (bible/naming.md: "gerg", "AL-yee"; the sample read "jerg" and
    "AL-ih-ee"), which are re-read with the cast lexicon's IPA.
The V.O. uses sentence pauses ({0.35}-{0.5}) so the read is unhurried (mas-inner-voice §9: close, dry, 110-130 wpm).
"""
import json
import os
import shutil
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../..'))
HERE = os.path.join(ROOT, 'audio/ep01/v3')
BP = os.path.join(ROOT, 'show/episodes/ep01/production/full-v3/beat-plan')
SAMPLE = os.path.join(ROOT, 'audio/ep01/v3-sample/vo-v2/lines.json')
SEGS = ['coldopen', 'act1', 'act2', 'act3', 'act4', 'tag']

# IPA from audio/voices/cast.json "lexicon" (the registry's pronunciations)
G, GS, A, M, MB, Y = '[gerg](/ɡˈɜɹɡ/)', "[gerg's](/ɡˈɜɹɡz/)", '[alyi](/ˈælji/)', '[Mas](/mˈɑs/)', '[Mockbran](/mˈɑkbɹæn/)', '[Yrral](/jˈɜɹəl/)'

# what Kokoro reads for each line recorded here, and at what speed (the V.O. preset is picked by kind "vo")
SAY = {
    # V.O.: sentence pauses opened in room tone; 0.87 for the longer lines, 0.88 for the short ones, 0.85 where the first
    # read measured above 4.3 syll/s (v3-vo-04, v3-vo-24; v3-vo-18 was read at 0.85 from the start)
    'v3-vo-01': (f'{G} wants to ship it.{{0.35}} rima wants it quiet.{{0.35}} {A} wants to know what it is first.', 0.87),
    'v3-vo-04': (f'{A} asks that about everything we build.{{0.5}} he means it every time.', 0.85),
    'v3-vo-08': ("eleven keys.{0.45} he's here for the twelfth.", 0.87),
    'v3-vo-09': ('it does.', 0.88),
    'v3-vo-10': (f'mario used to sit where {G} sits.{{0.4}} he left to build a careful one.', 0.87),
    'v3-vo-11': ('four companies, one table.{0.45} radnus has been rehearsing something since the lobby.', 0.87),
    'v3-vo-12': ("he's not wrong.", 0.88),
    'v3-vo-13': ("i'll turn when he finishes the sentence.", 0.87),
    'v3-vo-15': (f"{G} types louder when he's happy.{{0.4}} he's been happy since november.", 0.87),
    'v3-vo-16': ('thrilled is too much.{0.4} enthusiastic is a lot.', 0.87),
    'v3-vo-17': ('the race is tomorrow.{0.4} the board wants noon today.', 0.87),
    'v3-vo-18': (f"{GS} not on it.{{0.4}} {A} set it up.{{0.45}} probably just the budget.", 0.85),
    'v3-vo-21': (f"{G}.{{0.35}} he'll say he's compiling.", 0.88),
    'v3-vo-22': ("he's typing like it's launch night.", 0.87),
    'v3-vo-23': (f'{G} never waits to be asked.', 0.88),
    'v3-vo-24': ('it looks calmer than me.', 0.85),
    # spoken lines: the v2/v5 speaker's speed (first read 2026-09-27 at 0.92 / 0.90; Tasya's two lines and Mas's Senate
    # line were re-read at the bottom of the band after the QA pace / ASR flags: see lock.md §3)
    'v3-a2-0001': ('i have no equity in NopeAI.', 0.88),
    'v3-a4-0001': (f"We're extremely excited to share the news that {M} Manalt and [Gerg](/ɡˈɜɹɡ/) {MB}, together with colleagues, "
                   'will be joining Macrosoft to lead a new advanced AI research team.', 0.92),
    'v3-a4-0002': (f"Everyone's packed.{{0.45}} Whatever happens to this place, {M}, don't worry about us.", 0.88),
    'v3-a4-0003': ('We have all the IP rights and all the capability.{s0.40} We are below them,{s0.35} above them,{s0.38} around them.', 0.85),
    'v3-a4-0004': (f"Before this goes out, I'm reading it once.{{0.50}} We have reached an agreement in principle for {M} Manalt to return "
                   f'to NopeAI as CEO with a new initial board of Terb, Chair, the Other {Y}, and Mada.', 1.02),
}
# the sample's takes that are NOT reused although the text is identical (the name is read against the registry)
REREAD = {'v3-vo-01': 'v3s-01 reads "gerg" as /ʤɜɹɡ/ and "alyi" as /ælɪi/', 'v3-vo-04': 'v3s-03 reads "alyi" as /ælɪi/',
          'v3-vo-21': 'v3s-09 reads "gerg" as /ʤɜɹɡ/', 'v3-vo-23': 'v3s-10 reads "gerg" as /ʤɜɹɡ/'}
SPEAKER = {'mas': 'MAS MANALT', 'tasya': 'TASYA', 'terb': 'TERB'}
SRC_TAKES = {  # the v2/v5 lines files, for a spoken line's scene / room
    'act2': 'audio/ep01/act2/dialogue/lines-fast-v2.json', 'act4': 'audio/ep01/act4/dialogue/lines-v5.json'}


def beat_plans():
    for seg in SEGS:
        yield seg, json.load(open(os.path.join(BP, f'{seg}.json')))


def wanted():
    """every V.O. entry and every new spoken line in the beat plans, with its beat, in episode order"""
    out = []
    for seg, bp in beat_plans():
        for b in bp['beats']:
            for v in b.get('vo', []):
                out.append(dict(seg=seg, beat=b['id'], lk='vo', **v))
            for l in b.get('lines', []):
                if l.get('new'):
                    out.append(dict(seg=seg, beat=b['id'], lk='dialogue', **l))
    return out


def sample_rows():
    return {r['text']: r for r in json.load(open(SAMPLE))}


def plan():
    samp = sample_rows()
    per = {}
    for w in wanted():
        if w['id'] not in SAY:
            if w['lk'] == 'vo' and w['text'] in samp:
                continue  # reused sample take
            if w['lk'] == 'vo' and str(w.get('take', '')).startswith('kept'):
                continue  # a kept v2 take (e1-a3-18-04, a5-26a-01): it stays under its own id in its beat
            sys.exit(f'no recording spec for {w["id"]} ({w["text"]!r})')
        say, speed = SAY[w['id']]
        text = w['text'].strip('"') if w['lk'] != 'vo' else w['text']
        bid = w['beat'][3:] if w['beat'].startswith('v3-') else w['beat']
        row = {'id': w['id'], 'scene': bid.split('.')[0], 'speaker': SPEAKER[w['who']],
               'speaker_slug': {'mas': 'mas-manalt'}.get(w['who'], w['who']), 'text': text, 'spoken_as': say,
               'delivery': w.get('delivery'), 'tag': w.get('tag') or '[INVENTED · VO · v3 inner voice]', 'mode': 'on-mic',
               'on_camera': 'vo' if w['lk'] == 'vo' else 'on', 'kind': w['lk'], 'side': 'none', 'shot': w['beat'],
               'status': 'fast', 'speed': speed}
        if w['id'] in REREAD:
            row['reread_note'] = REREAD[w['id']]
        per.setdefault(w['seg'], []).append(row)
    for seg, rows in per.items():
        os.makedirs(os.path.join(HERE, seg), exist_ok=True)
        f = os.path.join(HERE, seg, 'lines-in.json')
        json.dump(rows, open(f, 'w'), indent=1, ensure_ascii=False)
        print(f'{os.path.relpath(f, ROOT)}: {len(rows)} lines ({", ".join(r["id"] for r in rows)})')


def assemble():
    """lines-v3.json per segment: the fastrec rows plus the reused sample takes (copied under their v3 id)"""
    samp = sample_rows()
    per = {}
    for w in wanted():
        per.setdefault(w['seg'], []).append(w)
    for seg, ws in per.items():
        d = os.path.join(HERE, seg)
        rec = {}
        if os.path.exists(os.path.join(d, 'lines.json')):
            rec = {r['id']: r for r in json.load(open(os.path.join(d, 'lines.json'))) if r}
        rows = []
        for w in ws:
            if w['id'] in rec:
                rows.append(rec[w['id']])
            elif w['lk'] == 'vo' and w['text'] in samp and w['id'] not in SAY:
                r = json.loads(json.dumps(samp[w['text']]))
                os.makedirs(os.path.join(d, 'wav'), exist_ok=True)
                dst = os.path.join(d, 'wav', f'{w["id"]}.wav')
                shutil.copyfile(os.path.join(ROOT, r['file']), dst)
                r['reused_from'] = f'{r["id"]} ({r["file"]}, the v3 sample take, text identical)'
                r['id'] = w['id']
                r['file'] = os.path.relpath(dst, ROOT)
                rows.append(r)
            elif str(w.get('take', '')).startswith('kept'):
                continue
            else:
                print(f'  ! {seg}: {w["id"]} has no take yet')
        f = os.path.join(d, 'lines-v3.json')
        json.dump(rows, open(f, 'w'), indent=1, ensure_ascii=False)
        print(f'{os.path.relpath(f, ROOT)}: {len(rows)} takes '
              f'({sum(1 for r in rows if "reused_from" in r)} reused from the sample)')


if __name__ == '__main__':
    {'plan': plan, 'assemble': assemble}[sys.argv[1] if len(sys.argv) > 1 else 'plan']()
