#!/usr/bin/env python3
"""Decode Ep3 middle-shot contact sheets and selected native delivery stills.

Run through ops/heavy.sh after assembly. Samples are from the encoded film,
not fresh drawings. Exact native review scope is recorded in frames.json.
"""
import hashlib
import json
import os
from pathlib import Path
import subprocess

from PIL import Image, ImageDraw

ROOT = next(p for p in Path(__file__).resolve().parents if (p / '.mrmas-root').exists())
BASE = ROOT / 'show/episodes/ep03/production/v1'
A = json.loads((BASE / 'assembly/v1-assembly.json').read_text())
FILM = ROOT / A['film']
OUT = ROOT / 'out/ep03/v1/review/delivered-film'
FFD = ROOT / 'studio/node_modules/@remotion/compositor-linux-x64-gnu'
ENV = {**os.environ, 'LD_LIBRARY_PATH': str(FFD)}
CRITICAL = {'4.02', '4.05', '5.01', '7.02', '8.04', '10.03', '11.03', '12.03',
            '13.03', '14.05', '14.09', '17A.04', '17A.05', '19.02', '21.02',
            '22.03', '22.07', '22.08', '23.03', '23.06', '24.04', '24.05'}


def decode(frame):
    raw = subprocess.run([str(FFD / 'ffmpeg'), '-v', 'error', '-ss', f'{frame/24:.9f}',
                          '-i', str(FILM), '-frames:v', '1', '-f', 'image2pipe',
                          '-c:v', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                         env=ENV, check=True, capture_output=True).stdout
    assert len(raw) == 1920 * 1080 * 3, (frame, len(raw))
    return Image.frombytes('RGB', (1920, 1080), raw)


def tc(f):
    return f'{f//1440:02}:{f//24%60:02}:{f%24:02}'


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    records = []
    for c in A['chapters']:
        if c['id'] not in ('coldopen', 'act1', 'act2', 'act3', 'act4', 'tag'):
            continue
        lock = json.loads((BASE / f"lock/{c['id']}.json").read_text())
        shots = lock['shots']
        sheet = Image.new('RGB', (1920, ((len(shots)+3)//4)*294+32), '#080c14')
        draw = ImageDraw.Draw(sheet)
        draw.text((8, 8), f"Encoded Episode 3 / {c['id']} / one middle frame per shot / MM:SS:FF", fill='#f3edda')
        scenes = set()
        for i, sh in enumerate(shots):
            f = c['start_frame'] + (sh['s'] + sh['e']) // 2
            im = decode(f)
            scene = sh['id'].split('.')[0]
            native = sh['id'] in CRITICAL or scene not in scenes
            scenes.add(scene)
            name = f"{c['id']}-{sh['id']}-f{f:05}.png"
            if native:
                im.save(OUT / name)
            x, y = i % 4 * 480, i // 4 * 294 + 32
            sheet.paste(im.resize((480, 270), Image.Resampling.NEAREST), (x, y))
            draw.text((x+7, y+276), f"{sh['id']} / {tc(f)}", fill='#f3edda')
            records.append(dict(segment=c['id'], shot=sh['id'], frame=f, timecode=tc(f),
                                native_file=name if native else None))
        sheet.save(OUT / f"{c['id']}-sheet.png")
        print(c['id'], len(shots), 'decoded shot samples', flush=True)
    for label, f in [('intro-quote', A['chapters'][1]['start_frame']+110),
                     ('intro-title', A['chapters'][1]['start_frame']+660),
                     ('credits', A['chapters'][-1]['start_frame']+120),
                     ('cast', A['chapters'][-1]['start_frame']+260)]:
        decode(f).save(OUT / f'{label}.png')
        records.append(dict(shot=label, frame=f, timecode=tc(f), native_file=f'{label}.png'))
    digest = hashlib.sha256()
    with FILM.open('rb') as f:
        for chunk in iter(lambda: f.read(1 << 20), b''):
            digest.update(chunk)
    (OUT / 'frames.json').write_text(json.dumps(dict(film=A['film'], film_sha256=digest.hexdigest(), samples=records), indent=2)+'\n')
    print(len(records), 'samples;', sum(bool(r['native_file']) for r in records), 'native files', flush=True)


if __name__ == '__main__':
    main()
