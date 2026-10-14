#!/usr/bin/env python3
"""Decode dedicated final-film date-rail samples after the complete text types.

Run through ops/heavy.sh after final assembly. Thirteen bounded exact seeks,
one native RGB frame each; no whole-film frame array. Samples and their actual
film hash are recorded and checked against final delivery evidence when present.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
from pathlib import Path
import subprocess

from PIL import Image

ROOT = next(p for p in Path(__file__).resolve().parents if (p / '.mrmas-root').exists())
BASE = ROOT / 'show/episodes/ep03/production/v1'
FFD = ROOT / 'studio/node_modules/@remotion/compositor-linux-x64-gnu'
FPS = 24


def read(path: Path):
    return json.loads(path.read_text())


def tc(frame: int) -> str:
    seconds, f = divmod(frame, FPS)
    minute, second = divmod(seconds, 60)
    return f'{minute:02}:{second:02}:{f:02}'


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--film', type=Path)
    parser.add_argument('--out', type=Path, default=ROOT / 'out/ep03/v1/review/delivered-rails')
    parser.add_argument('--expect-rails', type=int, default=13)
    args = parser.parse_args()
    assembly = read(BASE / 'assembly/v1-assembly.json')
    film = (args.film or ROOT / assembly['film']).resolve()
    digest = hashlib.sha256()
    with film.open('rb') as f:
        for chunk in iter(lambda: f.read(1 << 20), b''):
            digest.update(chunk)
    film_hash = digest.hexdigest()
    acceptance = BASE / 'assembly/delivery-checks.json'
    if acceptance.exists():
        final = read(acceptance)
        assert final['passed'], 'final delivery checks have not passed'
        assert final['sha256'] == film_hash, 'film does not match final delivery evidence'
        assert (ROOT / final['film']).resolve() == film, 'wrong delivered film'
    original_stat = film.stat()
    samples = []
    for chapter in assembly['chapters']:
        seg = chapter['id']
        if seg not in ('coldopen', 'act1', 'act2', 'act3', 'act4', 'tag'):
            continue
        lock = read(BASE / f'lock/{seg}.json')
        assert lock['summary']['frames'] == chapter['frames'], (seg, 'stale lock length')
        assert lock['meta']['ep_in_frames'] == chapter['start_frame'], (seg, 'stale lock offset')
        lines = lock['lines'] if isinstance(lock['lines'], list) else list(lock['lines'].values())
        for rail in lock['rails']:
            typed = math.ceil(len(rail['text']) / 2)
            full_hold = rail['e'] - rail['s'] - typed
            assert full_hold >= rail['floor_f'], (seg, rail['shot'], 'complete text below read floor')
            overlaps = [l['id'] for l in lines if l['kind'] == 'vo' and
                        l['abs_in'] < rail['e'] and rail['s'] < l['abs_out'] + 15]
            assert not overlaps, (seg, rail['shot'], 'rail / V.O. overlap', overlaps)
            local = rail['s'] + typed + full_hold // 2
            frame = chapter['start_frame'] + local
            samples.append(dict(segment=seg, shot=rail['shot'], text=rail['text'],
                                frame=frame, timecode=tc(frame),
                                rail_start_frame=chapter['start_frame'] + rail['s'],
                                rail_end_frame=chapter['start_frame'] + rail['e'],
                                typed_frames=typed, complete_ink_frames=full_hold,
                                reading_floor_frames=rail['floor_f']))
    assert len(samples) == args.expect_rails, (len(samples), args.expect_rails)
    samples.sort(key=lambda r: r['frame'])
    args.out.mkdir(parents=True, exist_ok=True)
    env = {**os.environ, 'LD_LIBRARY_PATH': str(FFD)}
    for i, row in enumerate(samples, 1):
        # The bundled compositor FFmpeg omits select. This is the same proven
        # seek/raw-RGB route as film_stills.py, with one 6 MiB output at a time.
        raw = subprocess.run([str(FFD / 'ffmpeg'), '-v', 'error', '-threads', '2',
                              '-ss', f'{row["frame"] / FPS:.9f}', '-i', str(film),
                              '-frames:v', '1', '-f', 'image2pipe', '-c:v', 'rawvideo',
                              '-pix_fmt', 'rgb24', '-threads', '1', '-'],
                             env=env, check=True, capture_output=True).stdout
        assert len(raw) == 1920 * 1080 * 3, (row['frame'], len(raw))
        name = f'rail-{i:02}-{row["segment"]}-{row["shot"]}-f{row["frame"]:05}.png'
        Image.frombytes('RGB', (1920, 1080), raw).save(args.out / name)
        row['file'] = name
    final_stat = film.stat()
    assert (original_stat.st_size, original_stat.st_mtime_ns) == (final_stat.st_size, final_stat.st_mtime_ns), 'film changed during inspection extraction'
    report = dict(film=str(film.relative_to(ROOT)), film_sha256=film_hash,
                  samples=samples, count=len(samples),
                  method='Thirteen bounded exact seeks, one native RGB frame each, after full date ink types. Still samples, not motion or listening review.')
    (args.out / 'frames.json').write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps(dict(count=len(samples), film_sha256=report['film_sha256'], out=str(args.out))))


if __name__ == '__main__':
    main()
