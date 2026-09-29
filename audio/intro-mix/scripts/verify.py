"""Deliverable QA: loudness / peaks / length of every WAV, M4A and MP4, and A/V sync of the muxes.

Sync method, per MP4:
  1. container: both streams start at pts 0 and last exactly 30.000 s; 720 video frames at 24 fps.
  2. sample alignment: the MP4's decoded AAC is cross-correlated against its source mix WAV
     (the lag must be 0 samples).
  3. events: onsets measured in the decoded MP4 audio at picture sync frames, next to the frame-
     difference jump measured in the decoded MP4 video at the same frames. The ding (f705 = 29.375 s)
     is the headline check.
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
import json, os, subprocess, sys
import numpy as np
from scipy.signal import butter, sosfilt, correlate
sys.path.insert(0, os.path.dirname(__file__))
from mixlib import *   # noqa

FFD = os.path.join(ROOT, 'studio/node_modules/@remotion/compositor-linux-x64-gnu')
ENV = dict(os.environ, LD_LIBRARY_PATH=FFD)
FF, FP = os.path.join(FFD, 'ffmpeg'), os.path.join(FFD, 'ffprobe')
VARS = {'V1': 'chipchamber', 'V2': 'orchestralnoir', 'V3': 'pixelswing', 'V4': 'pianopixels'}
MP4 = [('V1', '1080p'), ('V2', '1080p'), ('V3', '1080p'), ('V4', '1080p')]  # render policy: 1080p max (a legacy 4K file is checked only if present)
if os.path.exists(os.path.join(REPO, 'out/season/intro/intro-ep1-V1-4k.mp4')):
    MP4.insert(1, ('V1', '4k'))
SYNC = [24, 120, 225, 240, 300, 345, 360, 420, 480, 540, 630, 690, 705, 719]   # cuts / freeze pops / title / bookend / ding


def sh(args):
    return subprocess.run(args, env=ENV, capture_output=True, check=True)


TMP = os.environ.get('MIX_TMP', '/tmp/claude-1000/-home-jgon-project-art-mrmas/'
                     'a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/mixqa')


def decode_audio(path):
    """Decode the file's first audio stream (ffmpeg applies the MP4 edit list: AAC priming removed)."""
    import soundfile as sf
    os.makedirs(TMP, exist_ok=True)
    tmp = os.path.join(TMP, '_decode.wav')
    sh([FF, '-v', 'error', '-y', '-i', path, '-map', '0:a:0', '-c:a', 'pcm_s24le', '-ar', str(SR), '-ac', '2', tmp])
    y, sr = sf.read(tmp, dtype='float64', always_2d=True)
    os.remove(tmp)
    return y.T.copy()


def loudnorm_meter(path):
    """ffmpeg's own BS.1770 meter (libebur128 inside the loudnorm filter, measure pass only) as an
    independent cross-check: integrated, LRA, true peak."""
    err = sh([FF, '-hide_banner', '-nostats', '-i', path, '-map', '0:a:0', '-af',
              'loudnorm=I=-14:TP=-1:LRA=20:print_format=json', '-f', 'null', '-']).stderr.decode()
    j = json.loads(err[err.rfind('{'):err.rfind('}') + 1])
    return dict(I=float(j['input_i']), LRA=float(j['input_lra']), TP=float(j['input_tp']))


def probe(path):
    out = sh([FP, '-v', 'error', '-show_entries',
              'stream=index,codec_type,codec_name,sample_rate,channels,bit_rate,nb_frames,duration,'
              'duration_ts,start_time,r_frame_rate,width,height:format=duration', '-of', 'json', path]).stdout
    return json.loads(out)


def video_packet_hash(path):
    """MD5 over every video packet's pts, dts, flags and payload hash (stream-copy check)."""
    import hashlib
    out = sh([FP, '-v', 'error', '-select_streams', 'v:0', '-show_data_hash', 'MD5', '-show_entries',
              'packet=pts,dts,flags,data_hash', '-of', 'csv', path]).stdout
    return hashlib.md5(out).hexdigest()


def video_diffs(path, w=320, h=180):
    raw = sh([FF, '-v', 'error', '-i', path, '-map', '0:v:0', '-vf', f'scale={w}:{h}:flags=area,format=gray',
              '-fps_mode', 'passthrough', '-f', 'image2pipe', '-c:v', 'rawvideo', '-']).stdout
    fr = np.frombuffer(raw, dtype=np.uint8).reshape(-1, h, w).astype(np.int16)
    d = np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))      # d[k-1] = |frame k - frame k-1|
    return len(fr), np.concatenate([[0.0], d])


DING_F = 705          # replaced in main() by the spotting list's ding frame


def ding_onset(x):
    """First ms after the f(ding-5) floor where the >1 kHz band rises 15 dB over that 5-frame floor."""
    sos = butter(4, 1000.0, 'highpass', fs=SR, output='sos')
    a = f2n(DING_F - 5)
    seg = sosfilt(sos, x[:, a:], axis=-1)          # causal: no pre-ringing ahead of the onset
    e = (seg ** 2).sum(axis=0)
    hop = SR // 1000
    e = e[:len(e) // hop * hop].reshape(-1, hop).mean(axis=1)
    le = 10 * np.log10(e + 1e-14)
    floor = np.median(le[:int(4 * 1000 / 24)])
    i = int(np.argmax(le > floor + 15))
    t = (a + i * hop) / SR
    return t, float(floor), float(le[i:i + 20].max())


def meas_wav(x):
    fr, st = loud_curve(x, 3.0)
    _, mo = loud_curve(x, 0.4, 0.25)
    return dict(samples=int(x.shape[1]), seconds=x.shape[1] / SR, lufs_i=round(lufs(x), 2),
                lufs_i_ref=round(lufs_ref(x), 2),
                true_peak_dbtp=round(true_peak_db(x), 2), sample_peak_dbfs=round(sample_peak_db(x), 2),
                short_term_max=round(float(st.max()), 1), momentary_max=round(float(mo.max()), 1))


def cue_onsets(spot):
    """Every placed cue's audible start (first sample within 30 dB of the file's peak, after any head trim) vs
    the frame it is spotted to. 'end' cues report their last sample, 'hit' cues their hit sample."""
    import soundfile as sf
    rows = []
    for e in spot['events']:
        if e['layer'] not in ('main', 'blip'):
            continue
        x, sr = sf.read(os.path.join(AUDIO, e['file']), always_2d=True)
        m = np.abs(x).max(axis=1)
        if e.get('headFrame') is not None:
            m[:max(0, e['headFrame'] * SPF - e['startSample'])] = 0
        if e['anchor'] == 'end':
            at = e['startSample'] + len(m)
        elif e['anchor'] == 'hit':
            at = e['startSample'] + int(round(e['hitOffsetSec'] * SR))
        else:
            at = e['startSample'] + int(np.argmax(m > m.max() * 10 ** (-30 / 20)))
        rows.append(dict(id=e['id'], frame=e['frame'], anchor=e['anchor'],
                         ms_after_frame=round((at - e['frame'] * SPF) / SR * 1000, 1)))
    return rows


def picture_sync(spot):
    """The SFX build's view of the picture vs the picture file on disk now, and every picture-keyed cue's
    placed frame vs the picture frame it answers to."""
    import hashlib
    ps = json.load(open(os.path.join(AUDIO, 'intro-sfx/picture-sync.json')))
    evp = os.path.join(ROOT, 'out/season/intro/picture/intro-events.json')
    now = hashlib.md5(open(evp, 'rb').read()).hexdigest()
    pf = ps.get('pictureFrames', {})
    rows, bad = [], []
    for e in spot['events']:
        k = e.get('pictureKey')
        # skip extras, and cues placed on their own per-launch frames (the popcorn starts on the first launch)
        if e['layer'] != 'main' or k not in pf or e['id'].startswith('x.') or e['id'] == 'd15.keycap_popcorn':
            continue
        want = pf[k] + (1 if e['id'] == 'sky.pop_minddeep' else 0)
        rows.append(dict(id=e['id'], key=k, picture_frame=pf[k], placed_frame=e['frame'], anchor=e['anchor']))
        if e['frame'] != want:
            bad.append(rows[-1])
    return dict(events_md5_at_sfx_build=ps.get('eventsMd5'), events_md5_now=now,
                sfx_built_against_current_picture=ps.get('eventsMd5') == now,
                events_file_mtime=os.path.getmtime(evp), deltas_vs_script=ps.get('deltas'),
                typing=ps.get('typingCheck'), derived=ps.get('derived'), cues_checked=len(rows),
                cues_off_picture=bad)


def main():
    global DING_F
    rep = dict(wav={}, stems={}, m4a={}, mp4={})
    spot = json.load(open(os.path.join(AUDIO, 'intro-sfx/spotting.json')))
    ding = [e for e in spot['events'] if e['id'] == 'book.ding'][0]
    DING_F = ding['frame']
    rep['picture_sync'] = picture_sync(spot)
    print('picture sync', {k: v for k, v in rep['picture_sync'].items() if k not in ('deltas_vs_script',)})
    sfx_only = read(os.path.join(AUDIO, 'intro-sfx/intro-sfx_stem.wav'))
    # each cue's audible start vs its spotted frame (the MP4 carries the stems at lag 0, checked below)
    ons = cue_onsets(spot)
    rep['sfx_onsets'] = ons
    late = [o for o in ons if not (-1.0 <= o['ms_after_frame'] <= 20.0)]
    print('cue onsets checked', len(ons), '; outside [-1, +20] ms of their frame:', late)
    rep['ding_reference'] = dict(spotting_start_sample=ding['startSample'], spotting_start_s=ding['startSec'],
                                 frame=ding['frame'], file=ding['file'],
                                 sfx_stem_measured_onset_s=round(ding_onset(sfx_only)[0], 4))
    print('ding reference', rep['ding_reference'])
    mixes = {}
    for v, n in VARS.items():
        p = os.path.join(OUT_DIR, f'intro-ep1-mix-{v}-{n}.wav')
        x = read(p)
        mixes[v] = x
        r = meas_wav(x)
        r['ffmpeg_loudnorm_info'] = loudnorm_meter(p)
        r['loop'] = dict(first_10ms_peak_dbfs=round(sample_peak_db(x[:, :480]), 1),
                         last_10ms_peak_dbfs=round(sample_peak_db(x[:, -480:]), 1))
        t, fl, pk = ding_onset(x)
        r['ding_onset_s'] = round(t, 4)
        rep['wav'][v] = r
        print('WAV', v, json.dumps(r))
        sd = os.path.join(OUT_DIR, 'stems', v)
        if v == 'V1':
            st = {k: read(os.path.join(sd, f'intro-ep1-{v}-stem-{k}.wav')) for k in ('music', 'sfx', 'dialogue')}
            rep['stems'][v] = {k: dict(lufs_i=round(lufs(s), 2), true_peak_dbtp=round(true_peak_db(s), 2))
                               for k, s in st.items()}
            rep['stems'][v]['sum_vs_mix_residual_dbfs'] = round(sample_peak_db(sum(st.values()) - x), 1)
            m, s_, d = st['music'], st['sfx'], st['dialogue']
            rep['stems'][v]['balance_windows_lufs'] = {
                w: dict(music=round(win_loud(m, a, b), 1), sfx=round(win_loud(s_, a, b), 1),
                        dialogue=round(win_loud(d, a, b), 1), mix=round(win_loud(x, a, b), 1))
                for w, (a, b) in dict(vo_line=(24, 91), vo1=(24, 57), vo2=(72, 91), whisper=(285, 299),
                                      shout=(300, 316), rollcall=(480, 539), title_pad=(632, 686),
                                      ding=(DING_F, 719)).items()}
            print('   stems', json.dumps(rep['stems'][v]))
        a = os.path.join(OUT_DIR, f'intro-ep1-mix-{v}-{n}.m4a')
        y = decode_audio(a)
        ra = dict(decoded_samples=int(y.shape[1]), probe=probe(a)['streams'][0],
                  decoded_tail_beyond_30s_peak_dbfs=round(sample_peak_db(y[:, N:]), 1) if y.shape[1] > N else None)
        y = y[:, :N]
        if True:
            ra.update(lufs_i=round(lufs(y), 2), lufs_i_ref=round(lufs_ref(y), 2),
                      true_peak_dbtp=round(true_peak_db(y), 2))
        ra['ffmpeg_loudnorm_info'] = loudnorm_meter(a)
        rep['m4a'][v] = ra
        print('M4A', v, ra['decoded_samples'], ra.get('lufs_i'), ra.get('lufs_i_ref'), ra.get('true_peak_dbtp'),
              ra['ffmpeg_loudnorm_info'])

    for v, res in MP4:
        p = os.path.join(ROOT, 'out/season/intro', f'intro-ep1-{v}-{res}.mp4')
        pr = probe(p)
        y = decode_audio(p)
        x = mixes[v]
        n = min(x.shape[1], y.shape[1])
        # lag by cross-correlation over the whole programme (mono sums), +-4096 samples
        xm, ym = x[:, :n].sum(0), y[:, :n].sum(0)
        c = correlate(ym, xm, mode='full', method='fft')
        mid = n - 1
        lag = int(np.argmax(c[mid - 4096: mid + 4097])) - 4096
        err = y[:, :n] - x[:, :n]
        nframes, dv = video_diffs(p)
        events = []
        for f in SYNC:
            # local lag: cross-correlate the decoded MP4 audio against the source mix WAV over f-6..f+6
            s0, s1 = f2n(f - 6), min(f2n(f + 6), N)
            xs, ys = x[:, s0:s1].sum(0), y[:, s0:s1].sum(0)
            cc = correlate(ys, xs, mode='full', method='fft')
            m0 = len(xs) - 1
            ll = int(np.argmax(cc[m0 - 480: m0 + 481])) - 480
            events.append(dict(frame=f, t=round(f / FPS, 4), local_lag_samples=ll,
                               video_diff_f_minus_1_to_f=round(float(dv[f]), 2),
                               video_diff_f_minus_2_to_f_minus_1=round(float(dv[f - 1]), 2)))
        t, fl, pk = ding_onset(y)
        src = os.path.join(ROOT, 'out/season/intro/picture', f'intro-ep1-{res}-silent.mp4')
        vh, sh_ = video_packet_hash(p), video_packet_hash(src)
        r = dict(video_stream_copied=vh == sh_, video_packet_md5=vh, probe=pr, decoded_audio_samples=int(y.shape[1]), video_frames=nframes,
                 xcorr_lag_samples=lag, aac_vs_wav_err_rms_db=round(float(todb(np.sqrt((err ** 2).mean()))), 1),
                 decoded_tail_beyond_30s_peak_dbfs=round(sample_peak_db(y[:, N:]), 1) if y.shape[1] > N else None,
                 lufs_i=round(lufs(y[:, :N]), 2), lufs_i_ref=round(lufs_ref(y[:, :N]), 2),
                 true_peak_dbtp=round(true_peak_db(y), 2), ffmpeg_loudnorm_info=loudnorm_meter(p),
                 ding=dict(frame=DING_F, expected_s=DING_F / FPS, audio_onset_s=round(t, 4),
                           audio_minus_picture_ms=round((t - DING_F / FPS) * 1000, 1),
                           video_frame_diff_into_ding=round(float(dv[DING_F]), 2),
                           video_frame_diff_before=round(float(dv[DING_F - 1]), 2),
                           video_frame_pts_s=DING_F / FPS),
                 sync_events=events)
        rep['mp4'][f'{v}-{res}'] = r
        print('MP4', v, res, json.dumps({k: r[k] for k in ('video_stream_copied', 'decoded_audio_samples', 'video_frames',
                                                            'xcorr_lag_samples', 'aac_vs_wav_err_rms_db',
                                                            'lufs_i', 'lufs_i_ref', 'true_peak_dbtp', 'ding')}))
        for e in events:
            print('    ', e)
    json.dump(rep, open(os.path.join(OUT_DIR, 'qa', 'deliverables_qa.json'), 'w'), indent=1)


if __name__ == '__main__':
    main()
