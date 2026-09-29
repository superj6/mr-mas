"""Build the OST sampler: an excerpt of each batch-1 track, 1 s of digital silence between, in a dramatic order.

    ../../.venv-theme/bin/python make_sampler.py

v2 (fix pass 1, 2026-09-26):
  * MM-10 and MM-11 are cut from their ALBUM EDITS (the album master file is now the edit), not the picture cues.
  * The sampler is mastered to -14.0 LUFS-I and <= -1.0 dBTP (measured on the decoded MP3).  The items keep the
    album's relative levels (quiet tracks at -16); the whole reel gets one gain and a look-ahead true-peak limiter
    (engine/mix.limiter_gain) that only touches the loudest peaks.  Its gain reduction is reported in sampler.json.
  * Every item carries its tone, where it plays in the show, and the one thing to listen for (for SAMPLER.md).

Source = each track's ALBUM master.  Cuts are sample-exact on bar lines of the 96 grid (2.5 s), on a section or
entry point, or on the track's own stop.  Ends: 'fade' = a 1-beat (0.625 s) raised-cosine fade where the excerpt
stops mid-phrase; 'stop' = the excerpt ends on the track's own designed stop or ring-out (a 5 ms de-click only).
Starts get a 10 ms fade-in.  Writes ../ost-sampler.mp3 and editor/sampler.json.  The WAV goes to $SAMPLER_WAV_DIR
(default: this session's scratchpad) and is not a deliverable.
"""
import os  # noqa: E402  (phase 1: the project root is found at run time, docs/ORGANIZATION-PLAN.md §4)
import sys  # noqa: E402


def _repo():
    for start in (os.path.dirname(os.path.abspath(__file__)), os.getcwd()):
        d = start
        while True:
            if os.path.exists(os.path.join(d, '.mrmas-root')):
                return d
            if d == os.path.dirname(d):
                break
            d = os.path.dirname(d)
    sys.exit('MR. MAS: no .mrmas-root above this script or the cwd; set MRMAS_ROOT')


REPO = os.environ.get('MRMAS_ROOT') or _repo()
import json
import os
import subprocess
import sys

import numpy as np
import pyloudnorm as pyln
import soundfile as sf
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__))
OST = os.path.dirname(HERE)
sys.path.insert(0, OST)
from engine import mix as EM   # noqa: E402  (the true-peak-aware look-ahead limiter)

T = os.path.join(OST, 'tracks')
FFDIR = os.path.join(REPO, 'studio/node_modules/@remotion/compositor-linux-x64-gnu')
SR = 48000
GAP = 1.0
BEAT = 0.625
TARGET_LUFS = -14.0
CEILING_DBTP = -1.0

ITEMS = [
    dict(key='mm01', mm='MM-01', title='Water Line', rel='mm01-water-line/render/mm01-water-line-album.wav',
         t0=0.0, t1=25.0, end='fade', palette='DARK ROOM', act='I · who he is',
         tone='Mas alone at 2 a.m., calm and sure of himself: felt upright, a trio in two, the chip only on the nudge',
         where="Mas's theme. First heard in Ep1 sc 18 (the dark room, 10:13); then every episode's rooms, nights and "
               "V.O.; in Act Four its felt carries 26A (v4 S2) and his side at 2 a.m. (v4 S5)",
         listen='Calm, not sad: would you know this tune again after two bars?',
         moments=[(0.0, 'the felt alone: the flat line and the nudge; the settle held back'),
                  (5.0, 'the trio comes in (upright in two, brushes) under statement 1'),
                  (10.0, 'V.O. window: felt alone, nothing moves'),
                  (15.0, "statement 2: the violas now join the cellos' guide tones (fix 1)"),
                  (20.0, 'the second V.O. window')]),
    dict(key='mm06', mm='MM-06', title='Beeper, 1993 / Sample-Chip, 2008',
         rel='mm06-beeper-1993-sample-chip-2008/render/mm06-beeper-1993-sample-chip-2008-album.wav',
         t0=30.0, t1=50.0, end='fade', palette='ERA TIERS', act='I · who he is',
         tone='His past as the machine heard it: a 1-bit beeper in 1993, then a 16-bit memory of 2008',
         where='The flashbacks. Ep1 sc 3-4 (F1.1, 1993, 0:30); its 1-bit flat line returns inside MM-08 and MM-11',
         listen='A memory, or a video game? Nothing may sound Nintendo',
         moments=[(30.0, "1993: NESNEJ's Upsell on the beeper (two voices, on or off, no dynamics)"),
                  (38.75, 'the close lands'),
                  (40.0, 'THE EMPTY SLOT (the SFX register clunks here, with no bell)'),
                  (40.625, '2008: the trio through the 16-bit sample-chip, pushed half a beat early'),
                  (42.5, 'young Mas plays his line, with the nudge twice')]),
    dict(key='mm05', mm='MM-05', title='The More You Buy', rel='mm05-the-more-you-buy/render/mm05-the-more-you-buy-album.wav',
         t0=50.0, t1=70.0, end='stop', palette='THE JOB', act='I · who he is',
         tone='A sales pitch that climbs a step every bar and always closes: double-time swing, vibes and a straight '
              'mute over a walking bass',
         where='Nesnej, deals, the upsell. Ep1 sc 17 (the rooftop, 9:33), into the register\'s KA-CHING',
         listen='Does the sale close on the empty downbeat, or does it sound like a dropout?',
         moments=[(50.0, "A': the walking bass lands on F (the downbeat that read as an A before fix 1)"),
                  (61.25, 'the close: an open fifth, bari and trombone stab'),
                  (62.5, 'THE KA-CHING SLOT: every stem rests the downbeat (the SFX bell owns it)'),
                  (66.25, 'the tag stalls on C7(#9b13)'),
                  (68.75, 'the late slot, then nothing')]),
    dict(key='mm19', mm='MM-19', title='Renamed It. / The Fountain Pen', rel='mm19-renamed-it/render/mm19-renamed-it-album.wav',
         t0=70.0, t1=90.0, end='stop', palette='THE PODIUM', act='I · who he is',
         tone='The state occasion, played straight and one size too big; the joke is the rename, under a held note',
         where="Power. NEDIB's Fountain Pen in Ep1 sc 13 (the White House, 5:54); RUMPT's march and the Rename from Ep2",
         listen='Is the Rename deadpan, or cute?',
         moments=[(70.0, "WHO?: RUMPT's march"),
                  (72.5, 'the missing downbeat: a silent beat where the fanfare should land'),
                  (77.5, 'the band waits politely; only the pickup plays'),
                  (80.0, 'SUPER: the full march, the chip on the top line'),
                  (81.25, 'THE RENAME: E-flat slips to B under the held top note (the label gun lands)'),
                  (86.25, 'renamed again, to G'),
                  (87.5, 'the button')]),
    dict(key='mm07', mm='MM-07', title='How to Fire a CEO Who Owns Nothing.',
         rel='mm07-how-to-fire-a-ceo/render/mm07-how-to-fire-a-ceo-album.wav', t0=30.0, t1=49.0, end='stop',
         palette='BLUEPRINT', act='II · Ep1 Act Four, in picture order',
         tone='THE PLAN: a small, precise, cheerful drafting machine (chip music box, harp, pizzicato, dead straight) '
              'that explains everything and then breaks',
         where='Ep1 sc 24-25, Act Four\'s opening (12:31 on the v3 lock; v4 S1). PLAN-SHORT and PLAN-MICRO serve every '
               'later episode\'s THE PLAN',
         listen='Does the break read as the plan failing, or as a playback fault?',
         moments=[(30.0, 'PLAN: harp eighths draw the path, the chip music box on top (the harp retuned in fix 1)'),
                  (32.5, 'three ticks, one per step of the plan'),
                  (36.25, 'the line stops at step four'),
                  (37.5, 'one held chord, pp, under "Step four." / "Good question."'),
                  (42.5, 'THE BREAK: the last two notes stick in a loop'),
                  (46.25, 'the tape-stop'),
                  (48.75, 'it reaches zero on the JOIN click')]),
    dict(key='mm08', mm='MM-08', title='The Falling Tile', rel='mm08-the-falling-tile/render/mm08-the-falling-tile-album.wav',
         t0=0.0, t1=19.0, end='stop', palette='LEVERAGE -> D6', act='II · Ep1 Act Four, in picture order',
         tone='A trap closing without a tune: F pedal, low grand clusters a semitone apart, a pitched sub-thud, a chip '
              'tick; then the click takes every sound away',
         where='Ep1 sc 26: the call, up to the Cancel click and the drop-out (12:52 on the v3 lock; v4 S1, second half)',
         listen='Does the stop on the click land as a blow, or as a glitch? (the top audition item)',
         moments=[(0.0, 'LEVERAGE low: the grand clusters, now 9 dB up (fix 1)'),
                  (3.125, "Neleh's clockwork pizzicato"),
                  (10.0, 'the 1-bit flat line: 1993, on the call'),
                  (12.5, 'the clusters move up a semitone'),
                  (15.0, 'Step Four on muted horns: three steps, level, no riser'),
                  (17.5, 'THE CLICK: a hard stop into digital silence; the missing fourth step is the silence')]),
    dict(key='mm09', mm='MM-09', title="The Board's Side / What They Didn't Know",
         rel='mm09-the-boards-side/render/mm09-the-boards-side-album.wav', t0=95.0, t1=114.8815, end='stop',
         palette='PROCEDURE -> OUTS (REVERSAL)', act='II · Ep1 Act Four, in picture order',
         tone='The other side, played straight and with dignity: no felt, no chip, no swing. Then the card',
         where="Ep1 sc 27-28, the board's pass and the card WHAT THEY DIDN'T KNOW (13:18-14:33 on the v3 lock; v4 S3-S4)",
         listen='A reversal, or a fanfare?',
         moments=[(95.0, "11:53 PM: Tasya's floor, one held step on Rhodes and low strings"),
                  (100.0, "dry for Tasya's post"),
                  (105.0, '"Step four?": the board\'s chord with its blank'),
                  (110.0, "WHAT THEY DIDN'T KNOW: the REVERSAL, C to F up the octave, no third"),
                  (112.5, 'one felt F4: his room comes back first')]),
    dict(key='mm02', mm='MM-02', title='His Version', rel='mm02-his-version/render/mm02-his-version-album.wav',
         t0=20.0, t1=38.1155, end='stop', palette='KEYNOTE REEL', act='II · Ep1 Act Four, in picture order',
         tone='His flattering account: his own tune in D-flat major on the same piano, with everything human removed',
         where="The D5 device ([MAS'S VERSION]). Draft 3.2 cut D5 from Ep1, so it debuts in Ep2 or Ep3; Ep12 plays it "
               "uncut. (Its place here is the old sc 29 position.)",
         listen='Parody by polish, or a sincere ad? Compare it with item 1: the same tune?',
         moments=[(20.0, 'pass 3: too clean, too even, too still; no chip, no swing'),
                  (30.0, 'pass 4, a shade more confident'),
                  (37.815, 'CUT mid-note, tails and all')]),
    dict(key='mm10', mm='MM-10', title='His Side / 745 (album edit)', rel='mm10-his-side-745/render/mm10-his-side-745-album.wav',
         t0=63.125, t1=91.0, end='stop', palette='SET-PIECE SWING', act='II · Ep1 Act Four, in picture order',
         tone='His version of the five days: the company falls into his lap as a swung avalanche that stops dead on the '
              'one man who will not move',
         where="Ep1 sc 29b, the avalanche (15:12-15:30 on the v3 lock; v4 S6), with the episode's one full band. This "
               "excerpt is the album edit's new second chorus, which the picture does not have",
         listen='Chorus 2 is new writing: does it add momentum, or just repeat?',
         moments=[(63.125, 'chorus 2: the board presses (Step Four, the blank crushed)'),
                  (71.875, 'Step Four crushed again: brass hits'),
                  (73.125, 'the Water Line twice in the violins, in its own time, over the swung Build'),
                  (83.125, "THE FULL BAND on C7(#9b13): three bars, level, no ramp"),
                  (90.625, 'THE CARD: everything stops dead')]),
    dict(key='mm11a', mm='MM-11', title='The Return (album edit): a, the Door (STRAIGHT violin)',
         rel='mm11-the-return/render/mm11-the-return-album.wav', t0=0.5, t1=14.0, end='stop', palette='STRAIGHT',
         act='II · Ep1 Act Four, in picture order',
         tone='The one sad violin of the season: the Door on a solo violin, senza vibrato, nothing under it',
         where="Ep1 sc 30a, under Alyi's regret post only (15:32 on the v3 lock; v4 S7, where it decays on the first "
               "heart instead of stopping dead)",
         listen='Does it avoid "the world\'s smallest violin"?',
         moments=[(0.625, 'the Door, plain'),
                  (8.125, "again, under the regret post"),
                  (13.5, 'stopped dead on the first heart')]),
    dict(key='mm11', mm='MM-11', title='The Return (album edit): d-e, the Build, the sign, "okay."',
         rel='mm11-the-return/render/mm11-the-return-album.wav', t0=66.875, t1=92.9412, end='stop',
         palette='VICTORY LAP -> DARK ROOM', act='II · Ep1 Act Four, in picture order',
         tone="The other side's sounds hand him back his company: the win played straight and one size too big, then "
              "undercut; his felt returns last",
         where='Ep1 sc 30d-e: Gerg is back, the lobby sign, "okay." (16:03-16:23 on the v3 lock; v4 S7-S8)',
         listen='Is the felt the right last word, or one note too many?',
         moments=[(66.875, "the Build restarts over the stamp's C pedal (Gerg is back)"),
                  (73.125, "the sand's held beat"),
                  (75.625, 'THE ONE STAB, on the lobby sign; two bars at full'),
                  (80.625, 'the band cuts to one chip note (the box of spare 0 plates)'),
                  (82.5, 'the 1-bit flat line'),
                  (84.375, 'the rest: the bonk and "okay."'),
                  (85.625, 'his felt: C4 to F4, an open fifth, ringing out')]),
    dict(key='mm13', mm='MM-13', title='Outside Intended Scope', rel='mm13-outside-intended-scope/render/'
         'mm13-outside-intended-scope-album.wav', t0=65.0, t1=85.303, end='stop', palette='GLYPH', act='Coda · the machine',
         tone="The machine learning the show's tune, politely",
         where="Ep1's GLYPH hits (the Orb's scan, Q*); the L1-L4 beds as the dread curve rises, L4 from Ep9",
         listen='Thrilling, or just loud? Dread, or a screensaver?',
         moments=[(65.0, "L4, the runaway: the tokens play the knee's first seven notes, then keep climbing past the end"),
                  (65.0, 'under it, a line climbs an octave every two bars, cello to violins'),
                  (82.5, 'one glass D-flat 6 over a sub swell (the sub now 9 dB lower, fix 1)'),
                  (85.0, 'cut dead')]),
]


def raised(n, up=True):
    g = 0.5 * (1 - np.cos(np.pi * np.arange(n) / max(1, n - 1)))
    return g if up else g[::-1]


def lufs(x):
    try:
        return round(float(pyln.Meter(SR).integrated_loudness(x)), 2)
    except Exception:
        return None


def tp_db(x):
    return round(20 * np.log10(np.abs(signal.resample_poly(x, 4, 1, axis=0)).max() + 1e-15), 2)


def mmss(t):
    return f'{int(t // 60)}:{t % 60:05.2f}'


def master(y, ceiling_db):
    """One gain to TARGET_LUFS, then the look-ahead true-peak limiter at ceiling_db; iterate (the limiter takes a
    little loudness back).  y: [n, 2].  Returns (out, gain_db, limiter gain curve)."""
    g_db = TARGET_LUFS - lufs(y)
    for _ in range(4):
        z = y * 10 ** (g_db / 20)
        pad = int(0.1 * SR)                         # the limiter's smoothing would dip at the file's two edges
        lg = EM.limiter_gain(np.pad(z, ((pad, pad), (0, 0))).T, ceiling_db=ceiling_db)[pad:pad + len(z)]
        out = z * lg[:, None]
        err = TARGET_LUFS - lufs(out)
        if abs(err) < 0.02:
            break
        g_db += err
    return out, g_db, lg


def main():
    out, rows, t = [], [], 0.0
    for i, it in enumerate(ITEMS):
        x, sr = sf.read(os.path.join(T, it['rel']), dtype='float64', always_2d=True)
        assert sr == SR
        t0, t1 = it['t0'], it['t1']
        a, b = int(round(t0 * SR)), min(len(x), int(round(t1 * SR)))
        seg = x[a:b].copy()
        k = int(0.010 * SR)
        seg[:k] *= raised(k)[:, None]
        k = int((BEAT if it['end'] == 'fade' else 0.005) * SR)
        seg[-k:] *= raised(k, up=False)[:, None]
        dur = len(seg) / SR
        rows.append(dict(n=i + 1, key=it['key'], mm=it['mm'], title=it['title'],
                         source=os.path.relpath(os.path.join(T, it['rel']), OST),
                         src_in=t0, src_out=round(t0 + dur, 3), start=round(t, 3), end=round(t + dur, 3),
                         start_tc=mmss(t), end_tc=mmss(t + dur), palette=it['palette'], act=it['act'], ending=it['end'],
                         tone=it['tone'], where=it['where'], listen=it['listen'], _a=len(np.concatenate(out, 0)) if out else 0,
                         moments=[dict(src=m, at=round(t + m - t0, 3), at_tc=mmss(t + m - t0), what=w)
                                  for m, w in it['moments']]))
        out.append(seg)
        t += dur
        if i < len(ITEMS) - 1:
            out.append(np.zeros((int(GAP * SR), 2)))
            t += GAP
    y = np.concatenate(out, 0)
    L0, tp0 = lufs(y), tp_db(y)
    wav_dir = os.environ.get('SAMPLER_WAV_DIR', '/tmp/claude-1000/-home-jgon-project-art-mrmas/'
                             'a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/editor-fix1')
    os.makedirs(wav_dir, exist_ok=True)
    wav = os.path.join(wav_dir, 'ost-sampler.wav')
    dec = os.path.join(wav_dir, 'ost-sampler-decoded.wav')
    mp3 = os.path.join(OST, 'ost-sampler.mp3')
    env = dict(os.environ, LD_LIBRARY_PATH=FFDIR)
    ceiling = CEILING_DBTP - 0.3                   # margin for the MP3 encoder's overs; lowered further if needed
    for attempt in range(4):
        z, g_db, lg = master(y, ceiling)
        sf.write(wav, z, SR, subtype='PCM_24')
        subprocess.run([f'{FFDIR}/ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-codec:a', 'libmp3lame', '-b:a',
                        '256k', '-metadata', 'title=MR. MAS OST - batch 1 sampler (fix pass 1)', '-metadata',
                        'artist=MR. MAS score (OST batch 1)', '-metadata', 'album=MR. MAS Original Soundtrack (working)',
                        '-metadata', 'comment=Excerpts of the album masters; see audio/ost/SAMPLER.md', mp3],
                       check=True, env=env)
        subprocess.run([f'{FFDIR}/ffmpeg', '-y', '-loglevel', 'error', '-i', mp3, dec], check=True, env=env)
        zz, _ = sf.read(dec, dtype='float64', always_2d=True)
        mtp = tp_db(zz)
        if mtp <= CEILING_DBTP:
            break
        ceiling -= (mtp - CEILING_DBTP) + 0.05
    gr = -20 * np.log10(np.maximum(lg, 1e-9))
    for r in rows:
        a = r.pop('_a')
        seg = z[a:a + int(round((r['end'] - r['start']) * SR))]
        r['lufs'] = lufs(seg) if len(seg) > 0.5 * SR else None
        r['tp_db'] = tp_db(seg)
        r['max_limiter_gr_db'] = round(float(gr[a:a + len(seg)].max()), 2)
    res = dict(seconds=round(len(z) / SR, 3), duration_tc=mmss(len(z) / SR), lufs_i=lufs(z), true_peak_db=tp_db(z),
               mp3=os.path.relpath(mp3, OST), mp3_kbps=256, mp3_decoded_seconds=round(len(zz) / SR, 3),
               mp3_true_peak_db=mtp, mp3_lufs_i=lufs(zz), gap_s=GAP,
               mastering=dict(before=dict(lufs_i=L0, true_peak_db=tp0), gain_db=round(g_db, 2),
                              limiter_ceiling_dbtp=round(ceiling, 2), limiter_max_gr_db=round(float(gr.max()), 2),
                              limiter_share_over_0p1db=round(float((gr > 0.1).mean()), 5),
                              limiter_share_over_0p5db=round(float((gr > 0.5).mean()), 5)),
               items=rows)
    json.dump(res, open(os.path.join(HERE, 'sampler.json'), 'w'), indent=1)
    os.remove(dec)
    print(f"sampler {res['duration_tc']} ({res['seconds']} s), LUFS-I {res['lufs_i']}, TP {res['true_peak_db']} dBTP; "
          f"mp3 LUFS {res['mp3_lufs_i']} TP {mtp}; gain {g_db:+.2f} dB, limiter max GR {gr.max():.2f} dB")
    for r in rows:
        print(f"{r['n']:>2} {r['start_tc']}-{r['end_tc']} {r['mm']:<6} {r['title'][:44]:<44} src {r['src_in']}-{r['src_out']} "
              f"LUFS {r['lufs']} GR {r['max_limiter_gr_db']}")


if __name__ == '__main__':
    main()
