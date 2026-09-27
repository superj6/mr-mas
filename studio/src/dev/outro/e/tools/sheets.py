"""OUTRO E · key stills, the keyframe sheet, the variants sheet and the 480x270 check, all cut from the ENCODED mp4
(what a viewer gets), except the per-episode stills, which come from `remotion still` (outro-e-stills).

  python3 src/dev/outro/e/tools/sheets.py <out/lookdev/outro/e> <scratch frames dir>      (from studio/; needs Pillow)

Frame numbers: m = the mock-up's frame (the mp4's frame index); o = the outro's own frame, o = m - 24.
"""
import os
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFont

PRE = 24
HERE = os.path.dirname(os.path.abspath(__file__))
STUDIO = os.path.abspath(os.path.join(HERE, '../../../../..'))
FFD = os.path.join(STUDIO, 'node_modules/@remotion/compositor-linux-x64-gnu')
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
FONT_B = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
BG, INK, DIM, HOT = (12, 13, 20), (226, 222, 206), (140, 150, 180), (230, 90, 100)

# the three key stills (outro frames) and the six keyframes (POLISH PASS: the 3-bar outro, the moth on 4.1)
KEY = [(64, '1-file', 'o64 · 2.1  the file at its end: the credits block lit, the caret on; the terms line on the desktop'),
       (145, '2-close', 'o145 · 3.2  his pointer on the close box (hover); the click lands on 3.3 (o150)'),
       (199, '3-end', 'o199 · Ep1  the file is gone; the loop cursor; the moth landed beside the final period')]
SHEET = [(-12, 'm12 · stand-in', 'the episode\'s last frame (the cold open\'s dark-room MEDIUM), labelled as a stand-in'),
         (30, 'o30 · 1.3 · the build', 'cut to the file on 1.1; the knee lights the credits block a line a note (5 of 8 lit)'),
         (100, 'o100 · 2.3 · the hold', 'the block whole since o55, held for reading; the caret blinks on the beat'),
         (145, 'o145 · 3.2 · hover', 'his pointer on the close box; it set off at o128, 3 s after the block was whole'),
         (153, 'o153 · 3.3 · click', 'the line (drawing 2 of 4) closes toward the loop cursor; the moth comes in with the light'),
         (199, 'o199 · 4.1+ · Ep1 end', 'the moth landed on 4.1 beside the final period, wings folded; the loop cursor blinks')]
VARIANTS = [('ep1', 'Ep1 · ep1.0_research_preview.md', 'raw markdown; the credits are a --- front-matter block; his pointer clicks the close box'),
            ('ep3', 'Ep3 · ep1.2_strawberry.jpg', 'an image viewer in 8x8 JPEG blocks; the credits are the EXIF panel, and the AI disclosure is the Software field'),
            ('ep10', 'Ep10 · ep1.9_pace.yaml', 'nobody\'s pointer: the machine types the credits: block itself, the values already in place before their keys; the close box lights on its own')]


def ff(*args):
    env = dict(os.environ, LD_LIBRARY_PATH=FFD)
    subprocess.run([os.path.join(FFD, 'ffmpeg'), '-hide_banner', '-loglevel', 'error', '-y', *args], check=True, env=env)


def font(sz, bold=False):
    return ImageFont.truetype(FONT_B if bold else FONT, sz)


def labelled(tiles, cols, tile_w, title, sub=None, cap_h=56):
    """tiles: [(Image, caption, subcaption|None)] -> a sheet"""
    rows = (len(tiles) + cols - 1) // cols
    tile_h = int(tile_w * 9 / 16)
    head = 70 if sub else 50
    sheet = Image.new('RGB', (cols * tile_w + (cols + 1) * 16, head + rows * (tile_h + cap_h + 16) + 8), BG)
    d = ImageDraw.Draw(sheet)
    d.text((16, 12), title, font=font(24, True), fill=INK)
    if sub:
        d.text((16, 42), sub, font=font(16), fill=DIM)
    for i, (im, cap, sc) in enumerate(tiles):
        x = 16 + (i % cols) * (tile_w + 16)
        y = head + (i // cols) * (tile_h + cap_h + 16)
        sheet.paste(im.resize((tile_w, tile_h), Image.LANCZOS if tile_w * 2 != im.width else Image.NEAREST), (x, y))
        d.text((x, y + tile_h + 6), cap, font=font(17, True), fill=INK)
        if sc:
            f14, line, yy = font(14), '', y + tile_h + 30
            for word in sc.split(' '):
                if d.textlength(line + ' ' + word, font=f14) > tile_w and line:
                    d.text((x, yy), line, font=f14, fill=DIM)
                    line, yy = word, yy + 18
                else:
                    line = (line + ' ' + word).strip()
            d.text((x, yy), line, font=f14, fill=DIM)
    return sheet


def main(out_dir, frames_dir):
    os.makedirs(frames_dir, exist_ok=True)
    mp4 = os.path.join(out_dir, 'outro-e-ep1-1080p.mp4')
    ff('-i', mp4, '-vsync', '0', os.path.join(frames_dir, 'm%03d.png'))    # every encoded frame, m001 = frame 0
    fr = lambda o: Image.open(os.path.join(frames_dir, 'm%03d.png' % (o + PRE + 1))).convert('RGB')
    check = os.path.join(out_dir, 'check')
    os.makedirs(check, exist_ok=True)

    # 1. the three key stills, full size, from the encoded mp4; and each at 480x270 (the small-player check)
    small = []
    for o, name, cap in KEY:
        im = fr(o)
        im.save(os.path.join(out_dir, f'outro-e-still-{name}.png'))
        s = im.resize((480, 270), Image.BOX)
        s.save(os.path.join(check, f'outro-e-still-{name}-480x270.png'))
        small.append((s, cap))
    # the 480x270 check sheet, 1:1 (no upscaling: this is exactly what a 480x270 player shows)
    w, h = 480, 270
    sh = Image.new('RGB', (3 * w + 4 * 12, h + 60), BG)
    d = ImageDraw.Draw(sh)
    d.text((12, 8), 'outro E · the key stills at 480x270, 1:1 (box-downscaled from the encoded 1080p mp4)', font=font(14, True), fill=INK)
    for i, (s, cap) in enumerate(small):
        sh.paste(s, (12 + i * (w + 12), 32))
        d.text((12 + i * (w + 12), 32 + h + 6), cap.split('  ')[0], font=font(12), fill=DIM)
    sh.save(os.path.join(check, 'outro-e-check-480x270.png'))

    # 2. the keyframe sheet (6 frames with numbers)
    tiles = [(fr(o), cap, sc) for o, cap, sc in SHEET]
    labelled(tiles, 3, 640, 'MR. MAS · outro proposal E · "file closed" · Ep1 · keyframes',
             '7.5 s outro (o0-o179); Ep1\'s moth rides the close and lands on 4.1 (o180), end o199 = 8.33 s; after 1 s '
             'of stand-in · 96 BPM, 60 frames a bar · from the encoded mp4', cap_h=58).save(os.path.join(out_dir, 'outro-e-keyframes.png'))

    # 3. the variants sheet (the file-type ladder), 2x native per tile (exact pixels)
    vt = []
    for key, cap, sc in VARIANTS:
        im = Image.open(os.path.join(out_dir, f'outro-e-{key}-still.png')).convert('RGB')
        vt.append((im, cap, sc))
    labelled(vt, 3, 960, 'MR. MAS · outro proposal E · the file-type ladder (per-episode stills)',
             'the terms line and the pointer line are the same in every episode; only the file changes',
             cap_h=58).save(os.path.join(out_dir, 'outro-e-variants.png'))
    print('wrote key stills, keyframes, variants, check/ in', out_dir)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
