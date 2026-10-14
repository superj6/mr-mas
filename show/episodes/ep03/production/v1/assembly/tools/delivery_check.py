#!/usr/bin/env python3
"""Check assembled Ep3 evidence and record the delivered media identity.

Run through ops/heavy.sh after qa.py and seam_frames.py. This verifies measured
delivery conditions; it makes no claim about a watch, a listen or editorial quality.
"""
from __future__ import annotations

import hashlib
import json
from collections import Counter
from pathlib import Path

ROOT = next(p for p in Path(__file__).resolve().parents if (p / '.mrmas-root').exists())
BASE = ROOT / 'show/episodes/ep03/production/v1'
ASM = BASE / 'assembly'


def read(path):
    return json.loads(path.read_text())


def main():
    a, q = read(ASM / 'v1-assembly.json'), read(ASM / 'v1-qa.json')
    film = ROOT / a['film']
    failures = []

    def check(name, ok):
        if not ok:
            failures.append(name)

    check('same film', q['film'] == a['film'])
    check('full decode', q['decode']['exit'] == 0 and q['decode']['error_lines'] == 0
          and q['decode']['frames_decoded'] == a['total_frames'])
    check('chapters', q['chapters_match_assembly'] and len(a['chapters']) == 9)
    video = next(s for s in q['streams'] if s['codec_type'] == 'video')
    audio = next(s for s in q['streams'] if s['codec_type'] == 'audio')
    check('1080p24 H264', video['codec_name'] == 'h264' and video['width'] == 1920
          and video['height'] == 1080 and video['r_frame_rate'] == '24/1')
    check('48k stereo AAC', audio['codec_name'] == 'aac' and audio['sample_rate'] == '48000'
          and audio['channels'] == 2)
    check('flash', q['flash']['pass'] and q['flash']['frames'] == a['total_frames'])
    check('integrated loudness', -16.5 <= q['audio']['integrated_lufs'] <= -15.5)
    check('true peak', q['audio']['true_peak_dbtp'] <= -1.0)
    check('audio length', abs(q['audio']['length_diff_ms']) < 1000 / 24)
    check('sample alignment', all(c['sync_lag_samples'] == 0 for c in q['audio']['chapters']))
    check('codec bursts', all(c['codec_bursts'] == [] for c in q['audio']['chapters']))
    seams = read(ASM / 'seam-frames-v1.json')['v1']
    check('boundary pictures', len(seams) == 18 and max(r['mad'] for r in seams) <= 2)
    expected_lines = 1  # the unchanged opening quote
    rail_count = 0
    for c in a['chapters']:
        if c['id'] not in ('coldopen', 'act1', 'act2', 'act3', 'act4', 'tag'):
            continue
        lock = read(BASE / f"lock/{c['id']}.json")
        check(f"{c['id']} clock", lock['summary']['frames'] == c['frames']
              and lock['meta']['ep_in_frames'] == c['start_frame'])
        lines = lock['lines'].values() if isinstance(lock['lines'], dict) else lock['lines']
        expected_lines += sum(l.get('kind') != 'post' for l in lines)
        timeline = read(ROOT / f"show/reel/ep03-v1-el/ep03-v1-el-{c['id']}.json")
        intended = Counter((b['id'], o['text'][6:] if o['text'].upper().startswith('RAIL: ') else o['text'])
                           for b in timeline['beats'] for o in b.get('onscreen', [])
                           if isinstance(o, dict) and o.get('kind') == 'rail')
        delivered = Counter((r['shot'], r['text']) for r in lock['rails'])
        check(f"{c['id']} explicit rails", intended == delivered)
        rail_count += len(lock['rails'])
    check('transcript line inventory', q['transcript']['lines'] == expected_lines)
    hashes = {name: hashlib.new(name) for name in ('md5', 'sha256')}
    with film.open('rb') as f:
        for block in iter(lambda: f.read(1 << 20), b''):
            for h in hashes.values():
                h.update(block)
    report = dict(film=a['film'], bytes=film.stat().st_size, frames=a['total_frames'],
                  seconds=a['total_s'], **{k: v.hexdigest() for k, v in hashes.items()},
                  lufs=q['audio']['integrated_lufs'], true_peak_dbtp=q['audio']['true_peak_dbtp'],
                  transcript_lines=expected_lines, date_rails=rail_count, boundary_mad_max=max(r['mad'] for r in seams),
                  failures=failures, passed=not failures,
                  limitation='Measured file checks only. No full-speed watch or listening pass.')
    (ASM / 'delivery-checks.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))
    if failures:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
