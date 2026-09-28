"""Hold the intro's whip smear on 2s (frames 222<-221, 224<-223) so its flash count drops under the limit.
The bundled ffmpeg has no rawvideo muxer, so frames go through PNG pipes. Picture only."""
import os, subprocess, sys
FFD = os.path.abspath('studio/node_modules/@remotion/compositor-linux-x64-gnu'); FF = FFD + '/ffmpeg'
env = dict(os.environ, LD_LIBRARY_PATH=FFD)
src, dst = 'out/intro/intro-ep1-V1-1080p.mp4', sys.argv[1]
REPLACE = {222: 221, 224: 223}
SIG = b'\x89PNG\r\n\x1a\n'
dec = subprocess.run([FF, '-v', 'error', '-i', src, '-f', 'image2pipe', '-c:v', 'png', '-'], stdout=subprocess.PIPE, env=env, check=True).stdout
frames = [SIG + p for p in dec.split(SIG)[1:]]
out = [frames[REPLACE.get(i, i)] for i in range(len(frames))]
enc = subprocess.run([FF, '-v', 'error', '-y', '-f', 'image2pipe', '-framerate', '24', '-c:v', 'png', '-i', '-',
                      '-c:v', 'libx264', '-crf', '14', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', '24', dst],
                     input=b''.join(out), env=env, check=True)
print('frames', len(frames), 'replaced', REPLACE)
