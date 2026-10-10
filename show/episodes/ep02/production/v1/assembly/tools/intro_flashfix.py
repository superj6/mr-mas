"""intro_flashfix.py - Ep2 v1 (a copy of Ep1's intro flash fix, show/episodes/ep01/production/full-v3/assembly/tools/
intro_flashfix.py, locked): hold the intro's whip smear on 2s, so its flash count drops under the limit (Ep1 PLAN §5:
4 flashes in a second at the smear, intro frames 221-224, before the fix; 1 after). Ep1's tool read the V1 master and
wrote to the path given; this copy takes both paths, so it never touches out/season/intro/ (Ep1's input).

  audio/.venv-casting/bin/python show/episodes/ep02/production/v1/assembly/tools/intro_flashfix.py <src.mp4> <dst.mp4> \
      [--replace 222:221,224:223]
  e.g. the Ep2 variant, rendered silent to out/ep02/v1/intro/intro-ep2-V1-1080p-raw.mp4, then fixed to
       out/ep02/v1/intro/intro-ep2-V1-1080p.mp4 (the manifest's intro picture); then flash_seg.py on it (limit 3).
The bundled ffmpeg has no rawvideo muxer, so frames go through PNG pipes. Picture only. Through ops/heavy.sh.
"""
import argparse
import os
import subprocess

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), *[".."] * 7))   # tools -> repo root (7 up)
FFD = os.path.join(ROOT, 'studio/node_modules/@remotion/compositor-linux-x64-gnu')
FF = FFD + '/ffmpeg'
env = dict(os.environ, LD_LIBRARY_PATH=FFD)
SIG = b'\x89PNG\r\n\x1a\n'

ap = argparse.ArgumentParser()
ap.add_argument('src')
ap.add_argument('dst')
ap.add_argument('--replace', default='222:221,224:223', help='frame:with,... (Ep1: the smear held on 2s)')
a = ap.parse_args()
REPLACE = {int(k): int(v) for k, v in (x.split(':') for x in a.replace.split(',') if x)}
if os.path.abspath(a.dst).startswith(os.path.join(ROOT, 'out/season/')) or os.path.abspath(a.dst) == os.path.abspath(a.src):
    raise SystemExit('refusing to write into out/season/ (Ep1\'s intro) or over the source')
dec = subprocess.run([FF, '-v', 'error', '-i', a.src, '-f', 'image2pipe', '-c:v', 'png', '-'], stdout=subprocess.PIPE, env=env, check=True).stdout
frames = [SIG + p for p in dec.split(SIG)[1:]]
out = [frames[REPLACE.get(i, i)] for i in range(len(frames))]
os.makedirs(os.path.dirname(os.path.abspath(a.dst)), exist_ok=True)
subprocess.run([FF, '-v', 'error', '-y', '-f', 'image2pipe', '-framerate', '24', '-c:v', 'png', '-i', '-',
                '-c:v', 'libx264', '-crf', '14', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', '24', a.dst],
               input=b''.join(out), env=env, check=True)
print('frames', len(frames), 'replaced', REPLACE, '->', a.dst)
