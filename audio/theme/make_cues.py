"""Writes cues.json (SCRIPT v2.1): grid, harmony map, every cue frame with what the music does there
(V1 wording; V2-V4 differences inline), the roll call, the brass accents, the VO duck, and per variation
the files, loudness, balance and the measured onset of every cue on its carrying stem."""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from build import FILES

OUT = os.path.dirname(os.path.abspath(__file__))


def bb(f):
    bar = int(f // 60) + 1
    beat = (f % 60) / 15 + 1
    return f'{bar}.{beat:.2f}'.rstrip('0').rstrip('.')


# (picture frame, music frame, tier, owner, what happens, V1 carrying stems)
CUES = [
    (0, 0, 'T0', 'music', 'felt piano F5 on the cursor blink + a 1-frame chip glint F6; the music owns the drone '
     'F1+C2 (open fifth, no third), fading in over f0-29. V2: celli + basses hold the fifth (no sub), harp harmonic '
     'F5. V3: the F5 is a 12.5 % chip square doubled by felt. V4: piano alone, low F1+C2 under the pedal, no chip',
     ['piano', 'chip', 'sub']),
    (15, 15, 'T0', 'music', 'piano F5 + chip glint', ['piano', 'chip']),
    (23, 23, 'T0', 'music', 'VO duck in (baked into the stems): every stem except the sub -6 dB, strings -9 dB, '
     '2-frame attack; VO f24-91 is on its own bus', []),
    (30, 30, 'T0', 'music', 'piano F5 under the VO (the chip glint is cut: it sat on the consonants)', ['piano']),
    (45, 45, 'T0', 'music', 'piano F5 under the VO (no glint)', ['piano']),
    (57, 57, 'T0', 'music', 'duck lifts inside the semicolon pause (6-frame release to f63), re-ducks f70-72', []),
    (60, 60, 'T0', 'music', 'low D-flat colour (b6 of F) in the pause, ending f71; no A-flat (still no third). '
     'V2: on bassoon (standing in for the bass clarinet)', ['piano']),
    (90, 90, 'T0', 'music', 'the pluck as the dot exits: harp F5 + pizz C5 + chip F6, held at -3 dB by the duck '
     '(V3 vibes + chip, V4 piano + chip); then only the drone under the glimpse - no sting', ['strings', 'chip']),
    (105, 105, 'T0', 'music', "the knee's leap G5 (felt, harp, celesta; the chip doubles it). The reverse swell "
     'into f120 belongs to the SFX (no music revswell)', ['chip', 'perc', 'piano']),
    (108, 108, 'T0', 'music', 'leap A-flat 5 (a passing tone)', ['chip']),
    (112, 112, 'T0', 'music', 'leap C6 (the Post click)', ['chip']),
    (116, 116, 'T0', 'music', 'leap F6', ['chip']),
    (120, 120, 'T1', 'music', 'DROP on Fm(add9), the first chord with a third: sub F1, chip square bass F2, chip '
     'noise; beeper F5 with A-flat 4 + C5; piano left hand Fm9 (F2 C3 Ab3 G4) pedalled to f164. The machine plays '
     'straight. V2 + timpani F and low strings', ['chip', 'sub', 'piano']),
    (127, 127.5, 'T1', 'music', 'beeper F on the straight off-beat (music +7.5; V3 swings it: f130)', ['chip']),
    (135, 135, 'T1', 'music', 'beeper F; the chip then rests while the dialog is open', ['chip']),
    (150, 150, 'T1', 'SFX', 'the bonk is SFX-owned (alert_bonk--chip, E4->E3); the music adds nothing', []),
    (165, 165, 'T1', 'music', 'OK: beeper C6 + square C3', ['chip']),
    (168, 168, 'T1', 'music', 'the chip gains voices: rising arpeggio F-Ab-C-Eb-F (f168/170/172/174/176), a second '
     'pulse voice and a triangle bass by f179; a brushed-snare swell f172-179. V2: harp glissando + string swell '
     '(no chip arpeggio); V3: brush fill + the arpeggio; V4: piano run + the arpeggio', ['chip', 'drums']),
    (172, 172, 'T1', 'music', 'beeper F6', ['chip']),
    (180, 180, 'T2', 'music', '2008: the trio lands, swung, through the 16-bit sample-chip filter (no tape wow - the '
     'cassette is retired): the knee F f180 . F f190 . F f195 . F f205 . G f210 . Ab f220 . C f225 . F f235, the '
     'chip an octave up; Dbmaj7 -> Fm9 (f210) -> C7(b9) (f225); kick on 1 and 3 only. V2: pizz strings + harp, no '
     'kit; V3: full swing kit; V4: piano + chip', ['chip']),
    (195, 195, 'T2', 'music', 'BRASS ACCENT #1: a cup-muted stab, 3 trumpets + 2 trombones on Dbmaj7, through the '
     'sample-chip filter. V2 horns + trombones; V3 full-band shout; V4 a piano cluster with chip', ['chip']),
    (225, 225, 'T2', 'music', "the hook's C; chamber strings (quartet + bass) swell f225-239 into the dinner. No brush "
     'roll / revswell: the keyboard SFX is the roll. V3: drum fill + trumpet pickup; V4: piano run', ['strings']),
    (240, 240, 'T3', 'music', 'HIT GERG, Fm11 - BRASS ACCENT #2 (trumpets + trombones only), low piano, timpani F, '
     'sub; four chip Fs across beats 2-3 (the flat line); then walking bass + brushes, swung, strings hold',
     ['brass', 'perc', 'piano', 'sub', 'chip']),
    (255, 255, 'T3', 'music', 'the viola + cello counter-line begins (lands on F4 inside roll-call stab 1)',
     ['strings']),
    (285, 285, 'T3', 'music', 'a reed-organ (harmonium) swell on a D-flat pedal f285-299 into the hit - never a '
     'church organ (V4: a chip square swell)', ['winds']),
    (300, 300, 'T3', 'music', 'HIT ALYI, Dbmaj9(#11) - BRASS ACCENT #3 (trumpets + trombones), the reed organ, '
     'timpani D-flat', ['brass', 'perc', 'piano', 'sub', 'winds']),
    (345, 345, 'T3', 'music', 'the bass reaches F2 (bar 6 walks Db3 C3 Ab2 F2)', ['bass']),
    (355, 355, 'T3', 'music', 'pizzicato on the swung off-beat against the klaxon SFX (V3 a piano stab, V4 a chip '
     'pluck)', ['strings']),
    (360, 360, 'T3', 'music', 'HIT MARIO, Bbm9 - BRASS ACCENT #4 (trumpets + trombones); the klaxon SFX is cut dead '
     'here', ['brass', 'perc', 'piano', 'sub']),
    (414, 414, 'T3', 'music', 'BRASS ACCENT #5: a trumpet-section rip up to C (f414-419), the pickup into the shout. '
     'V2 horns + low strings crescendo; V3 full-band rip + snare fill; V4 piano glissando + chip riser', ['brass']),
    (420, 420, 'T3', 'music', 'HIT NOLE, C7(#9b13) - BRASS ACCENT #6, the only full shout (trumpets, trombones, '
     'saxes), low piano, timpani C, sub; chip line on E. V2 no saxes', ['brass', 'perc', 'piano', 'sub']),
    (460, 460, 'T3', 'music', 'drum fill f460-464', ['drums']),
    (465, 465, 'T3', 'music', 'the kink: chip + celesta G5 (then Ab5 f470, C6 f475) into F at f480; bass Gb2; '
     'drum fill f465-479', ['chip']),
    (470, 470, 'T3', 'music', 'kink A-flat 5', ['chip']),
    (475, 475, 'T3', 'music', 'kink C6', ['chip']),
]
# bar 9: THE PLAYERS roll call (SCRIPT s3.7) - brass accent #7, stop-time
ROLL = [
    (480, 480.0, 'F5', 'Fm9', 'F2', 'TASYA'),
    (487, 487.5, 'F5', 'Fm9', 'F2', 'RADNUS'),
    (495, 495.0, 'F5', 'Fm9', 'F2', 'KRAM'),
    (502, 502.5, 'F5', 'Fm9', 'F2', 'NESNEJ'),
    (510, 510.0, 'G5', 'Dbmaj7(#11)', 'Db2', 'RIMA TAMURI'),
    (517, 517.5, 'Ab5', 'Dbmaj7(#11)', 'Db2', 'THE WHALE'),
    (525, 525.0, 'C6', 'C7(#9b13)', 'C2', 'RUMPT (silhouette)'),
    (532, 532.5, 'F6', 'F5 open fifth F-C, no third', 'F1 + sub', 'the player who does not exist yet (GLYPH cursor)'),
]
for n, (f, mf, top, ch, bass, who) in enumerate(ROLL):
    CUES.append((f, mf, 'T4', 'music', f'ROLL CALL stab {n + 1} ({who}): top {top} on {ch}, bass {bass} - brass accent '
                 f'#7, 2 trumpets + 2 trombones open and short, doubled an octave up by the chip lead (25 % pulse), '
                 f'upright bass + kick' + ('; sub F1; the viola/cello F4 sounds inside this stab and releases with it'
                                          if n == 0 else '') + ('; rings to f539, sub F1' if n == 7 else ''),
                 ['brass', 'chip', 'bass', 'drums', 'piano'] + (['sub'] if n in (0, 7) else [])))
CUES += [
    (539, 539, 'T4', 'SFX', 'stab 8 has rung out; the reverse swell end-anchored on f540 is SFX-owned. No "music '
     'fired" mute anywhere in bar 9, no f510 slam', []),
    (540, 540, 'sky', 'music', 'pluck F5 (harp + pizz, chip an octave up); upright walking bass + brushes, swung: the '
     'line cliche F2-E2-Eb2-D2; THE MUTED-TRUMPET MOMENT: Harmon C5 f540-564 (its own stem, "harmon")',
     ['strings', 'chip', 'bass', 'harmon']),
    (555, 555, 'sky', 'music', 'pluck F (bass E2)', ['strings', 'chip']),
    (565, 565, 'sky', 'music', 'Harmon B-flat 4 on the swung "and" of 10.2', ['harmon']),
    (570, 570, 'sky', 'music', 'pluck F (bass Eb2); Harmon A-flat 4 f570-584', ['strings', 'chip', 'harmon']),
    (585, 585, 'sky', 'music', 'pluck F (bass D2); the Harmon falls off D5 f585-599 (the 6th of Fm6). V2: the line '
     'runs on through bar 11 (straight) and falls off B-flat 4 by f629; V3: the chip answers beats 3-4; V4: the '
     "piano's right hand in octaves", ['strings', 'chip', 'harmon']),
    (600, 600, 'sky', 'music', 'pluck G (the kink); bar 11 squares up (straight): Db -> C7 (f615) over a timpani F '
     'roll; riser: string tremolo on C-G, chip noise sweep, cymbal swell, snare roll; 16ths on the grid',
     ['strings', 'chip', 'perc', 'drums']),
    (615, 615, 'sky', 'music', 'pluck A-flat; C7', ['strings', 'chip']),
    (622, 622.5, 'sky', 'music', 'pluck C on the straight "and" of 11.2 (music +7.5): the riser peaks',
     ['strings', 'chip']),
    (630, 630, 'title', 'music', 'THE FINAL HIT, quartal C-F-Bb-Eb over F topped by G - NO third; sub drop C2 '
     '(65.4 Hz) -> F1 (43.7 Hz) over 1.6 s; low piano F1+C2 with F2-Bb2; BRASS ACCENT #8 (the last brass): a horn '
     'swell C4 F4 Bb4 Eb5 (V2 + trombones; V3 the band shouts the stack); chip 16ths F5-Bb5-Eb6-F6 (f630-641) into '
     'a sustained F6 with vibrato over C6 + triangle F3. Violas thinned for the PAD', ['perc', 'strings', 'piano',
                                                                                     'sub', 'chip', 'brass']),
    (660, 660, 'title', 'music', 'celesta F6 alone - no chip echo (V4: piano F6)', ['perc']),
    (679, 679, 'title', 'music', "the music's reverse swell into the f690 cut (V4: a soft chip noise swell)", ['fx']),
    (690, 690, 'bookend', 'music', 'the drone F1+C2 returns (the celesta at f690 is cut)', ['sub']),
    (705, 705, 'bookend', 'SFX', 'DING: SFX-owned (bell_ding_F6, cut at f719 with a 0.35 s fade); the music plays '
     'nothing new here - the drone continues', []),
    (719, 719, 'bookend', 'music', 'the drone tail is out by f719 (end fade f706-719.5): the loop point', []),
]

BRASS_ACCENTS = [
    dict(n=1, frames=[195], what='cup-muted stab, 3 trumpets + 2 trombones, Dbmaj7, through the sample-chip filter'),
    dict(n=2, frames=[240], what='card stab, trumpets + trombones only (Fm11)'),
    dict(n=3, frames=[300], what='card stab, trumpets + trombones only (Dbmaj9#11)'),
    dict(n=4, frames=[360], what='card stab, trumpets + trombones only (Bbm9)'),
    dict(n=5, frames=[414, 419], what='trumpet-section rip up to C'),
    dict(n=6, frames=[420], what='the only full shout: trumpets, trombones, saxes (C7#9b13)'),
    dict(n=7, frames=[480, 487.5, 495, 502.5, 510, 517.5, 525, 532.5], what='the roll call: eight stabs, one gesture'),
    dict(n=8, frames=[630], what='horn swell C4 F4 Bb4 Eb5, the last brass'),
    dict(n='melody', frames=[540, 599], what='the one horn melody: Harmon-muted trumpet, bar 10 (V2: bars 10-11); '
         'no Harmon anywhere before f540'),
]

HARMONY = [
    dict(bars='1-2', frames=[0, 119], chord='open fifth F-C (drone); D-flat colour (b6) f60-71', third=False),
    dict(bars='3', frames=[120, 179], chord='Fm(add9) - the first third ("picks a side")', third=True),
    dict(bars='4', frames=[180, 239], chord='Dbmaj7 -> Fm9 (f210) -> C7(b9) (f225)', third=True),
    dict(bars='5', frames=[240, 299], chord='Fm11', third=True),
    dict(bars='6', frames=[300, 359], chord='Dbmaj9(#11)', third=True),
    dict(bars='7', frames=[360, 419], chord='Bbm9', third=True),
    dict(bars='8', frames=[420, 479], chord='C7(#9b13) (E natural pulls home to F)', third=True),
    dict(bars='9', frames=[480, 539], chord='Fm9 x4 -> Dbmaj7(#11) x2 -> C7(#9b13) -> open fifth F-C (no third: '
         'the player who does not exist yet has not picked a side)', third='stabs 1-7 yes; stab 8 no'),
    dict(bars='10', frames=[540, 599], chord='Fm line cliche: Fm / Fm(maj7) / Fm7 / Fm6 (bass F-E-Eb-D)', third=True),
    dict(bars='11.1-11.2', frames=[600, 629], chord='Db -> C7', third=True),
    dict(bars='11.3-12', frames=[630, 719], chord='quartal C-F-Bb-Eb over F, topped by G - no A, no A-flat',
         third=False),
]


def main():
    cues = [dict(frame=f, music_frame=mf, time_s=round(mf / 24, 4), bar_beat=bb(mf), tier=t, owner=o, music=d,
                 stems_v1=s) for f, mf, t, o, d, s in CUES]
    var = {}
    for v, base in FILES.items():
        p = f'{OUT}/analysis/{v}.json'
        if not os.path.exists(p):
            continue
        a = json.load(open(p))
        stems = sorted(f[len(v) + 1:-4] for f in os.listdir(f'{OUT}/stems') if f.startswith(v + '-'))
        var[v] = dict(
            master_wav=f'{base}.wav', preview_mp3=f'{base}.mp3', midi=f'midi/{base}.mid',
            stems={s: f'stems/{v}-{s}.wav' for s in stems},
            integrated_lufs=a['integrated_lufs'], true_peak_dbtp=a['true_peak_dbtp'],
            final_chord_chroma=a['final_chord_chroma'], no_third_windows=a['no_third_windows'],
            rollcall_rms_dbfs=a['rollcall_rms_dbfs'],
            measured_onsets_ms={str(k): dict(stem=o['stem'], offset_ms=o['offset_ms'])
                                for k, o in a['cue_onsets_by_stem'].items()},
            rollcall_section_onsets_ms=a.get('rollcall_section_onsets'),
            harmon_f540_onset_ms=(a['harmon_f540_onset'] or {}).get('offset_ms'))
        bal = f'{OUT}/analysis/{v}_balance.json'
        if os.path.exists(bal):
            b = json.load(open(bal))
            var[v]['balance_pct_piano_orch_bigband_chip'] = b['whole']
            var[v]['balance_by_section_rhythm_excluded'] = {s: d.get('share_ex_rhythm')
                                                            for s, d in b['sections'].items()}
    var_order = {'V1': 'PRIMARY mix (Chip Chamber Jazz)', 'V2': 'alternate', 'V3': 'alternate (fallback if V1 reads '
                 'too polite)', 'V4': 'alternate (quiet episodes)'}
    for v in var:
        var[v]['role'] = var_order[v]
    doc = dict(
        title='The Knee (Main Title)', show='MR. MAS', script='show/intro/SCRIPT.md v2.1',
        grid=dict(fps=24, bpm=96, frames_per_beat=15, frames_per_bar=60, bars=12, frames=720, duration_s=30.0,
                  sample_rate=48000, samples_per_frame=2000,
                  swing='swung 2nd eighth = beat + 10 frames (triplet swing)',
                  straight='straight 2nd eighth = beat + 7.5 frames in the music; picture and SFX use the floor '
                           '(f127, the roll-call cuts f487/502/517/532, f622)',
                  key='F minor', hook='F F F F G Ab C F (eighths; last F an octave up)'),
        stems_note='Stems are post-master-gain: summing all stems of a variation reproduces the master (residual '
                   '< -100 dB). v2.1: the "fired" stem is retired (there is no music-fired mute); the Harmon trumpet '
                   'has its own stem, "harmon". The VO duck (f23-91) is baked into every stem except the sub - do '
                   'not duck the music again in the mix; trim the music bus to about -15.5 LUFS before VO/SFX/chant.',
        vo_duck=dict(frames=[23, 91], general_db=-6, strings_db=-9, sub='not ducked', attack_frames=2,
                     release_frames=6, lifted=[57, 71], pluck_f90_db=-3),
        rollcall=[dict(flash=n + 1, picture_cut=f, music_frame=mf, top=top, chord=ch, bass=bass, player=who)
                  for n, (f, mf, top, ch, bass, who) in enumerate(ROLL)],
        brass_accents=BRASS_ACCENTS,
        sfx_owned=[dict(frames=[105, 119], what='reverse_swell_1beat into f120'), dict(frames=[150], what='bonk'),
                   dict(frames=[532, 540], what='reverse_swell_1beat into f540'), dict(frames=[705], what='ding')],
        harmony=HARMONY, cues=cues, variations=var,
        tiers=dict(T0='dark room: felt piano, the drone (music-owned), chip glints; VO duck',
                   T1='1993 1-bit: beeper / square / noise over a real sub; straight (V3 swings)',
                   T2='2008-14 early chip: the band through a 16-bit sample-chip (BRR grit, gaussian interpolation, '
                      'echo) - no tape wow',
                   T3='dinner: full acoustic (piano / strings / brass accents / jazz rhythm) + the chip flat line',
                   T4='roll call f480-539: eight brass + chip stabs, stop-time; skyline and title after'),
    )
    json.dump(doc, open(f'{OUT}/cues.json', 'w'), indent=1)
    print('cues.json written', len(cues), 'cues', list(var))


if __name__ == '__main__':
    main()
