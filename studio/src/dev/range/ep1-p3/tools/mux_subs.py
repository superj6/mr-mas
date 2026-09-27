"""MR. MAS - style-range prototype E1-P3 (1.D): add the soft subtitle track (mov_text, English, default on) to the mux.
  audio/.venv-casting/bin/python src/dev/range/ep1-p3/tools/mux_subs.py <in.mp4> <subs.srt> <out.mp4>
The bundled Remotion ffmpeg has no subtitle codecs, so this copies the video and audio packets unchanged with PyAV
(audio/.venv-casting has av 18) and writes each cue as a mov_text sample (2-byte length + UTF-8), with an empty sample
holding each gap. Prints the streams and the cues read back from the written file.
"""
import re, struct, sys
from fractions import Fraction
import av
src, srt, dst = sys.argv[1:4]
cues = []
for block in open(srt, encoding='utf-8').read().strip().split('\n\n'):
    lines = block.strip().split('\n')
    m = re.match(r'(\d+):(\d+):(\d+),(\d+) --> (\d+):(\d+):(\d+),(\d+)', lines[1])
    g = [int(x) for x in m.groups()]
    a = g[0] * 3600000 + g[1] * 60000 + g[2] * 1000 + g[3]
    b = g[4] * 3600000 + g[5] * 60000 + g[6] * 1000 + g[7]
    cues.append((a, b, '\n'.join(lines[2:])))
inp = av.open(src)
out = av.open(dst, 'w', format='mp4')
smap = {}
for s in inp.streams:
    if s.type in ('video', 'audio'):
        smap[s.index] = out.add_stream_from_template(s)
sub = out.add_stream('mov_text')
sub.time_base = Fraction(1, 1000)
sub.metadata['language'] = 'eng'
# the mov_text encoder opens from an ASS style header (it writes the tx3g sample description from it)
sub.codec_context.subtitle_header = (
    '[Script Info]\nScriptType: v4.00+\nPlayResX: 1920\nPlayResY: 1080\n\n[V4+ Styles]\n'
    'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, '
    'Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, '
    'MarginV, Encoding\nStyle: Default,Sans,48,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,0,2,'
    '40,40,60,0\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n').encode()
try:
    sub.disposition = av.stream.Disposition.default
except Exception as e:
    print('disposition not set:', e)
pk = []
for p in inp.demux():
    if p.dts is None or p.stream.index not in smap:
        continue
    p.stream = smap[p.stream.index]
    out.mux(p)
t = 0
for a, b, text in cues:
    if a > t:  # an empty sample holds the gap (mov_text is a continuous track)
        e = av.Packet(struct.pack('>H', 0)); e.stream = sub; e.pts = e.dts = t; e.duration = a - t; e.time_base = sub.time_base; out.mux(e)
    body = text.encode('utf-8')
    q = av.Packet(struct.pack('>H', len(body)) + body); q.stream = sub; q.pts = q.dts = a; q.duration = b - a; q.time_base = sub.time_base
    out.mux(q)
    t = b
out.close(); inp.close()
chk = av.open(dst)
print([(s.type, s.codec_context.name if s.codec_context else None, s.metadata.get('language')) for s in chk.streams])
ss = chk.streams.subtitles[0]
for p in chk.demux(ss):
    if p.size > 2:
        print(float(p.pts * p.time_base), float((p.pts + p.duration) * p.time_base), bytes(p)[2:].decode())
