"""Write audio/ost/index.json: the editor's curated index of the OST batch-1 cues.

    ../../.venv-theme/bin/python make_index.py      (after qa.py and make_sampler.py)

One row per album / library track and per to-picture cut:
  {id, mm, kind, title, palette, motifs, length, files: {mp3, album, underscore, stems}, firstUse, ...}
Paths are relative to audio/ost/.  Numbers come from the cue sheets and from editor/qa.json (re-measured).
(The engine's own ost-index.json -- written by build.py -- is left as it is.)

v2 (fix pass 1, 2026-09-26): MM-10 and MM-11 carry their album edit under `album_edit` (their `files.mp3` / `album`
ARE the edit; the picture version is the underscore master and the stems); every row has the editor's `status`
and `open` items after fix pass 1, and `qa` adds the engine's fix-5 checks next to the editor's re-measure.
"""
import glob
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OST = os.path.dirname(HERE)

# id -> (kind, palette, motifs, firstUse)
HAND = {
    'mm01-water-line': ('album/library', 'P01 DARK ROOM',
                        ['the Water Line (Mas)', "the Orb's verdict (F-C)", 'the kink (never taken)'],
                        'Ep1 sc 18, dark room, 10:13; every episode: his rooms, nights, V.O.'),
    'mm02-his-version': ('album/library', 'KEYNOTE REEL (the D5 register)',
                         ['KEYNOTE (the Water Line in Db major)'],
                         'the D5 device [MAS\'S VERSION]: cut from Ep1 in draft 3.2, it debuts in Ep2 or Ep3 '
                         '(the 1-bar insert e01-s29-d5 is held); Ep12 plays the reel uncut'),
    'e01-s29-d5': ('to-picture insert', 'KEYNOTE REEL (D5)', ['KEYNOTE bar 1'],
                   'UNUSED in Ep1 since draft 3.2 (D5 cut); held for D5\'s debut in Ep2 or Ep3; cut mid-note on '
                   'the next downbeat'),
    'mm05-the-more-you-buy': ('album/library', 'P06 THE JOB', ['the Upsell (Nesnej)', 'the KA-CHING slot'],
                              'Ep1 sc 17 rooftop, 9:33 (lead-in to the register bell)'),
    'mm06-beeper-1993-sample-chip-2008': ('album/library', 'P10 ERA TIERS (1-bit 1993 -> 16-bit 2008)',
                                          ['the flat line', 'the kink', 'the Upsell (1-bit)',
                                           'the Water Line (young Mas)', 'the Build'],
                                          'Ep1 sc 3-4 F1.1 (1993), 0:30'),
    'mm07-how-to-fire-a-ceo': ('album/library', 'P14 BLUEPRINT (+ a P01 DARK ROOM pickup)',
                               ['the Blueprint', 'the knee-cell waltz', 'Step Four', 'the Water Line bar 1'],
                               'Ep1 sc 24-25, 12:31 (picture cut e01-s25-the-plan); PLAN-SHORT / PLAN-MICRO: every '
                               'later episode\'s THE PLAN'),
    'e01-s25-the-plan': ('to-picture', 'P14 BLUEPRINT (+ a P01 DARK ROOM pickup)',
                         ['the Water Line bar 1', 'the Blueprint', 'the knee-cell waltz', 'Step Four'],
                         'Ep1 sc 24-25, 12:31-13:21'),
    'mm08-the-falling-tile': ('album/library', 'P03 LEVERAGE -> D6 -> P01 DARK ROOM',
                              ['Step Four', 'the 1-bit flat line', "Neleh's clockwork", "Mada's spinner",
                               'the Water Line settle', 'THE REWIND'],
                              'Ep1 sc 26-26A, 13:21 (picture cut e01-s26-the-falling-tile)'),
    'e01-s26-the-falling-tile': ('to-picture', 'P03 LEVERAGE -> D6 -> P01 DARK ROOM',
                                 ['Step Four', 'the 1-bit flat line', "Neleh's clockwork", "Mada's spinner",
                                  'the Water Line settle', 'THE REWIND'],
                                 'Ep1 sc 26-26A, 13:21.0-14:33.5'),
    'mm09-the-boards-side': ('to-picture (in sections) + album', 'P02 PROCEDURE + P08 OUTS KIT (09x REVERSAL)',
                             ['Step Four', 'the Door + the GPU choir', "Neleh's clockwork and question",
                              "Mada's spinner", 'the Lighthouse', 'the Addendum', 'the hourglass', "Tasya's floor",
                              'REVERSAL'],
                             'Ep1 sc 27-28, 14:34 (section files in render/parts/)'),
    'mm10-his-side-745': ('to-picture + album', 'P01 DARK ROOM -> P11 SET-PIECE SWING',
                          ['the Water Line (and augmented)', 'the Build', 'Step Four', "Mada's spinner"],
                          'Ep1 sc 29, 16:28 (act frames 5925-8295, timed to lock v2; conform to v3/v4 pending: '
                          'editor/CONFORM-ACT4.md)'),
    'mm11-the-return': ('to-picture + album', 'STRAIGHT -> the floor -> P03 LEVERAGE -> P09 VICTORY LAP',
                        ['the Door (violin)', "Tasya's floor", 'the Build', 'the 1-bit flat line',
                         'the Water Line settle'],
                        'Ep1 sc 30, 18:00 (timed to lock v2; conform pending: editor/CONFORM-ACT4.md)'),
    'e01-s30a-the-door': ('to-picture insert', 'STRAIGHT (P01 sincere mode)', ['the Door (violin, 8vb)'],
                          'Ep1 sc 30a, 18:00: under Alyi\'s regret post; the editor stops it on the first heart'),
    'mm13-outside-intended-scope': ('album/library', 'P05 GLYPH',
                                    ['TOKENS (4 stages)', 'the Ache', 'the knee reversed', 'the runaway',
                                     'the no-third chord'],
                                    'Ep1 GLYPH hits (the Orb\'s scan, Q*); beds from Ep9 (L4)'),
    'mm13-kit-glyph-hits-and-copy': ('kit', 'P05 GLYPH', ['GLYPH hits', 'Q*', 'THE COPY (the Water Line, 7 lags)'],
                                     'Ep1 GLYPH hits and sc 19 hands runner (THE COPY a beat late)'),
    'mm19-renamed-it': ('album/library', 'P13 THE PODIUM',
                        ['the Fountain Pen (NEDIB)', 'the Podium (RUMPT)', 'the Rename'],
                        'Ep1 sc 13 White House (NEDIB), 5:54; RUMPT\'s FEAR in Ep2'),
}
ALBUM_EDIT = {'mm10-his-side-745': 'mm10-his-side-745-album-edit', 'mm11-the-return': 'mm11-the-return-album-edit'}
FIX1 = 'fix pass 1 (2026-09-26): re-rendered on the fixed engine and re-measured by the editor; NOT auditioned'
# id -> (what changed in fix pass 1, [what is still open])
STATUS = {
    'mm01-water-line': ('rebalanced to 61 / 27 / 3 / 8 (strings +2 dB, violas join the cellos, Harmon +2 dB); V.O. windows '
                        '-24.8 / -25.2 / -24.9; room-SFX windows added (sub -33 to -38 dB); the 5 s cut\'s fade is in '
                        'the score', ['ears: 17.5-45 s, do the strings stay distant and the Harmon stay "the night"?']),
    'mm02-his-version': ('unchanged (no retuned samples); re-rendered, bit-level same music', []),
    'e01-s29-d5': ('unchanged; re-rendered', ['unused in Ep1 (D5 cut in draft 3.2): re-spot in Ep2/3']),
    'mm05-the-more-you-buy': ('the A2 body resonance of the contrabass-pizz F2 notched (Q 5, -10 dB at 112 Hz): worst '
                              'sieved A/F 0.16 -> 0.042; the main cue and all five variants pass',
                              ['ears: is the walking bass still woody on its F downbeats (5.0, 10.6, 35.0, 50.0, 65.0 s)?']),
    'mm06-beeper-1993-sample-chip-2008': ('the knee completion broken: bar 7 re-strikes C5 (then F4 F4 F3); knee '
                                          'completion 0, across the loop seam too',
                                          ['ears: at 0:15.3, does the re-struck C sound stuck, not like a cadence?']),
    'mm07-how-to-fire-a-ceo': ('harp and pizz retuned; PLAN-SHORT (30 s + loop) and PLAN-MICRO (20 s) rendered as their '
                               'own files with stems; MP3s beside the tape-stop alternates',
                               ['F-major: 5 windows at the break (43.1-48.7 s) read A energy with nothing written: the '
                                'tape-stop glide and the viola pizz body. Accepted by the editor; ears on the break']),
    'e01-s25-the-plan': ('harp and pizz retuned; timing unchanged (0.0 ms lag, markers within 2.7 ms)',
                         ['F-major: the same 5 break windows as MM-07 (accepted; ears)']),
    'mm08-the-falling-tile': ('LEVERAGE rebalanced (low grand clusters +9 dB; phrase 1 27/56/0/17); cello and '
                              'contrabass pizz notched at ~111 Hz; F-major 0 resonance windows',
                              ['ears: are the louder clusters murky? does the notched pizz pedal stay woody?']),
    'e01-s26-the-falling-tile': ('as MM-08; timing unchanged (0.0 ms lag)', ['ears: as MM-08']),
    'mm09-the-boards-side': ('the written A3 over F3 removed (the pulse leaves F for two bars); the clarinet whisper '
                             'stops on B-flat 3; the blanks\' contrabass F1 notched at 111 Hz; written third 0; timing '
                             'unchanged (0.0 ms lag)',
                             ['ears: 18.75-21.3 s, any F-major colour? do the notched blanks stay full?',
                              'the b9.1 marker (20.0 s) reads +10.7 ms (0.7 ms over the 10 ms tolerance; pre-existing)']),
    'mm10-his-side-745': ('the album master is now a 1:31.9 album edit (-14.0 LUFS): fragments with 1-bar rests, the '
                          'avalanche, a NEW 12-bar second chorus, 3 bars of full band, the dead stop; the picture version '
                          '(underscore + stems) is unchanged (0.0 ms lag)',
                          ['ears: the new second chorus (53.1-83.1 s of the edit) and the intro\'s rests',
                           'the album edit is now the cue nearest the main title (distinct 2.72): not a second main title?',
                           'the picture cue sheet\'s album_wav points at the EDIT (another timeline): mix from the '
                           'underscore / stems only']),
    'mm11-the-return': ('the album master is now a 1:32.9 album edit (-16 LUFS); the felt ending\'s fade is in the render; '
                        'the picture version is unchanged (0.0 ms lag)',
                        ['OPEN (fix): LEVERAGE (c1, picture 35.6-47.1 s; edit 38.7-60.2 s) carries the ~111 Hz '
                         'cello-pizz body resonance that MM-08 notched: 8 (picture) and 10 (edit) F-bass windows, sieved '
                         'A/F up to 0.63 where the F holds over 20 % of the pitched energy (1.35-1.77 where it barely sounds). Apply MM-08\'s cello-pizz notch (Q 10, -12 dB at '
                         '111.7 Hz) and re-render both',
                         'ears: does LEVERAGE sound minor? does the album edit hold as a piece?']),
    'e01-s30a-the-door': ('unchanged (no retuned samples); the four stop files regenerated', []),
    'mm13-outside-intended-scope': ('sub pressure 9 dB lower (-20.2 to -24.8 dB under the room in every level; room '
                                    'windows marked); tokens shelved above 1.6 kHz, strings LP 1.9 kHz (2-6 kHz -16.0 '
                                    'dB); 30 / 15 / 5 s cut-downs, reduced and solo versions delivered',
                                    ['F-major: 3 L3 windows (40.6-45.6 s) read A energy: the A band sits 18-24 dB under '
                                     'the A-flat 4 tokens (their spectral skirt), with the F barely sounding. Accepted',
                                     'the cut-downs read -11.9 / -13.7 / -14.9 dB at 2-6 kHz: act-outs only; under a line '
                                     'use the reduced or solo version',
                                     'ears: is L1 now too empty? are the tokens muffled?']),
    'mm13-kit-glyph-hits-and-copy': ('the same sub fix (22 room windows pass, worst -19.9 dB); H02\'s soft harp -3 dB',
                                     ['F-major: H07 (30.5 s) is the same A-flat 4 skirt (accepted)',
                                      'ears: the soft harp in H02 and H08; does H11\'s sub drop land?']),
    'mm19-renamed-it': ('30 / 15 / 5 s cut-downs, NEDIB 15 / 5 s cuts (parity), a reduced (one trumpet) and a solo-piano '
                        'version; parity 0.4 LU', ['ears: the solo piano: straight, or oom-pah? one trumpet: ceremony, '
                                                   'or a bugle call?']),
}
# fix 2b (2026-09-26, the engine owner): the engine's corrected brass / bass shorts, tremolos and solo violin, and
# MM-11's LEVERAGE.  A cue listed here was re-rendered; its status gets this note and FIX2B_OPEN replaces its open items.
FIX2B = {
    'mm09-the-boards-side': 'fix 2b: re-rendered on the retuned engine (six solo-violin notes move 11.5 c; the music is '
                            'unchanged)',
    'mm10-his-side-745': 'fix 2b: re-rendered on the retuned engine (the pressing tremolo\'s cello E3 and B-flat 3 were '
                         '33 and 25 c sharp; now in tune)',
    'mm11-the-return': 'fix 2b: LEVERAGE fixed -- the cello pizz on its own track, notched at 110.5 Hz (Q 16, -12 dB), '
                       'the F pedal re-bowed every 2 bars (the held sample ran out 6.7 s in), LEVERAGE -1.5 dB; F-major '
                       '0 resonance windows in picture and edit (worst 0.045 / 0.085 explained); the senza violin retuned '
                       '(its C4 sample is 23 c sharp) and +2 dB',
    'e01-s30a-the-door': 'fix 2b: the senza violin retuned (the D-flat and C were 22 and 17 c sharp); stops regenerated',
    'mm19-renamed-it': 'fix 2b: re-rendered on the retuned engine with all variants (the tuba B-flat 1 take was 95 c flat, '
                       'the FEAR tremolo 25-43 c flat, the stab G3 23-31 c flat, the violin 10-20 c off: now in tune)',
}
FIX2B_OPEN = {
    'mm09-the-boards-side': ['F-major (fix 2b): one window, 74.99-75.61 s, sieved A/F 0.126, classed resonance: the harp\'s '
                             'F4 / B-flat 4 ring (430-447 Hz) where the soft cello F2 holds 6.3 % of the pitched energy. '
                             'Ears: anything major there?',
                             'ears: 18.75-21.3 s, any F-major colour? do the notched blanks stay full?',
                             'the b9.1 marker (20.0 s) reads +10.7 ms (0.7 ms over the 10 ms tolerance; pre-existing)'],
    'mm11-the-return': ['ears (fix 2b): is the notched cello pizz still woody, and LEVERAGE minor? are the F pedal\'s bow '
                        'changes inaudible (picture 39.4 / 44.4 s; edit every 5 s from 43.1 s)?',
                        'ears (fix 2b): the retuned Door (0.6-6.0 s), in tune now?',
                        'ears: does the album edit hold as a piece?',
                        'the editor\'s file-only F-major cross-check lists 44.375-44.725 s (0.146): the MIDI collapses the '
                        'pedal\'s overlapping bow change (the known MIDI-export limit); the engine check passes'],
    'mm19-renamed-it': ['ears (fix 2b): the retuned tuba (48.75-76.25 s) and FEAR tremolo (25-45 s): in tune, and still '
                        'the same march?',
                        'the b15.1 marker (35.0 s) reads -10.7 ms since fix 2b: the retuned tremolo\'s attack, 7 ms '
                        'ahead of the timpani (no note moved)',
                        'ears: the solo piano: straight, or oom-pah? one trumpet: ceremony, or a bugle call?'],
}
ORDER = ['mm01-water-line', 'mm02-his-version', 'e01-s29-d5', 'mm05-the-more-you-buy',
         'mm06-beeper-1993-sample-chip-2008', 'mm07-how-to-fire-a-ceo', 'e01-s25-the-plan', 'mm08-the-falling-tile',
         'e01-s26-the-falling-tile', 'mm09-the-boards-side', 'mm10-his-side-745', 'mm11-the-return',
         'e01-s30a-the-door', 'mm13-outside-intended-scope', 'mm13-kit-glyph-hits-and-copy', 'mm19-renamed-it']


def rel(p):
    return os.path.relpath(p, OST) if p else None


def cue_path(cid):
    for p in glob.glob(os.path.join(OST, 'tracks', '*', 'render', f'{cid}.cue.json')):
        return p


def main():
    qa = {r['id']: r for r in json.load(open(os.path.join(HERE, 'qa.json')))}
    smp = json.load(open(os.path.join(HERE, 'sampler.json')))
    out = []
    for cid in ORDER:
        p = cue_path(cid)
        c = json.load(open(p))
        tdir = os.path.dirname(os.path.dirname(p))
        F = c['files']
        ab = lambda k: rel(os.path.join(tdir, F[k])) if F.get(k) else None   # noqa: E731
        kind, pal, motifs, first = HAND[cid]
        q = qa.get(cid, {})
        row = dict(
            id=cid, mm=c.get('mm'), kind=kind, title=c['title'], palette=pal, motifs=motifs,
            length=round(c['timing']['album_duration_s'], 3),
            files=dict(mp3=ab('album_mp3'), album=ab('album_wav'), underscore=ab('underscore_wav'),
                       underscore_mp3=ab('underscore_mp3'),
                       stems={k: rel(os.path.join(tdir, v)) for k, v in (F.get('stems') or {}).items()},
                       midi=ab('midi'), pianoroll=ab('pianoroll'), cue_sheet=rel(p),
                       readme=rel(os.path.join(tdir, 'README.md')) if os.path.exists(os.path.join(tdir, 'README.md'))
                       else None),
            firstUse=first,
            tone=c.get('tone'), key=c.get('key'), composer=c.get('composer'),
            loudness=dict(album_lufs=q.get('album', {}).get('lufs'), album_tp_db=q.get('album', {}).get('tp_db'),
                          underscore_lufs=q.get('underscore', {}).get('lufs'),
                          underscore_target=q.get('underscore', {}).get('target_lufs'),
                          underscore_tp_db=q.get('underscore', {}).get('tp_db'),
                          underscore_st_p95_corrected=q.get('underscore', {}).get('st_p95')),
            balance=(c.get('qa', {}).get('balance') or {}).get('balance'),
            sections=[dict(label=s['label'], start=s['start']['sec'], end=s['end']['sec'])
                      for s in c.get('sections', [])],
            loops=[dict(file=l['file'], seconds=l['seconds'], frames=l['frames'], verdict=l['verdict'])
                   for l in q.get('loops', [])],
            qa=dict(stems_residual_db=q.get('stems', {}).get('residual_db_re_master'),
                    knee_whole=len(q.get('midi', {}).get('knee_whole', [])),
                    knee_completion=q.get('midi', {}).get('knee_completion'),
                    written_a_over_f_bass=q.get('midi', {}).get('written_third'),
                    f_major_ok=q.get('engine', {}).get('f_major_ok'),
                    f_major_classes=q.get('engine', {}).get('f_major_classes'),
                    hits=f"{q.get('hits', {}).get('within_tol')}/{q.get('hits', {}).get('n')}" if q.get('hits') else None,
                    sub_under_room_ok=(q.get('sub_under_room') or {}).get('ok'),
                    engine_warnings=len(c.get('warnings', [])),
                    editor_flags=q.get('editor_flags', [])),
            status=FIX1 + '. ' + STATUS[cid][0] + ('; ' + FIX2B[cid] if cid in FIX2B else ''),
            open=FIX2B_OPEN.get(cid, STATUS[cid][1]),
        )
        if cid in ALBUM_EDIT:
            row['length'] = q.get('underscore', {}).get('seconds', row['length'])
            row['length_note'] = 'the picture version (the underscore master); the album edit\'s length is album_edit.length'
            ep = cue_path(ALBUM_EDIT[cid])
            ec = json.load(open(ep))
            eq = qa.get(ALBUM_EDIT[cid], {})
            row['album_edit'] = dict(id=ec['id'], title=ec['title'], length=round(ec['timing']['album_duration_s'], 3),
                                     cue_sheet=rel(ep), mp3=ab('album_mp3'), album=ab('album_wav'),
                                     midi=rel(os.path.join(tdir, ec['files']['midi'])),
                                     sections=[dict(label=x['label'], start=x['start']['sec'], end=x['end']['sec'])
                                               for x in ec.get('sections', [])],
                                     album_lufs=eq.get('album', {}).get('lufs'), album_tp_db=eq.get('album', {}).get('tp_db'),
                                     balance=(ec.get('qa', {}).get('balance') or {}).get('balance'),
                                     engine_warnings=ec.get('warnings', []),
                                     note='files.mp3 / files.album of this row ARE the album edit; the picture version '
                                          'is files.underscore and the stems')
        # variants / cut-downs / parts living in the same folder
        var = []
        for vp in sorted(glob.glob(os.path.join(tdir, 'render', '*.cue.json')) +
                         glob.glob(os.path.join(tdir, 'render', 'variants', '*.cue.json'))):
            vc = json.load(open(vp))
            if vc['id'] == cid or vc['id'] in HAND or vc['id'] in ALBUM_EDIT.values():
                continue
            vd = os.path.dirname(os.path.dirname(vp)) if os.path.basename(os.path.dirname(vp)) == 'render' \
                else os.path.dirname(os.path.dirname(os.path.dirname(vp)))
            vf = vc['files']
            def vpath(k):
                if not vf.get(k):
                    return None
                for b in (vd, os.path.dirname(os.path.dirname(vp)), os.path.dirname(vp)):
                    if os.path.exists(os.path.join(b, vf[k])):
                        return rel(os.path.join(b, vf[k]))
                return None
            vq = qa.get(vc['id'], {})
            var.append(dict(id=vc['id'], title=vc['title'], length=round(vc['timing']['album_duration_s'], 3),
                            mp3=vpath('album_mp3'), album=vpath('album_wav'), underscore=vpath('underscore_wav'),
                            underscore_mp3=vpath('underscore_mp3'), cue_sheet=rel(vp),
                            album_lufs=vq.get('album', {}).get('lufs'), underscore_lufs=vq.get('underscore', {}).get('lufs'),
                            engine_warnings=len(vc.get('warnings', [])), editor_flags=vq.get('editor_flags', [])))
        extra = sorted(glob.glob(os.path.join(tdir, 'render', 'parts', '*.wav')) +
                       glob.glob(os.path.join(tdir, 'render', 'alt', '*.wav')) +
                       glob.glob(os.path.join(tdir, 'render', f'{cid}-stop-*.wav')) +
                       glob.glob(os.path.join(tdir, 'render', 'extras', '*.mp3')))
        extra = [rel(e) for e in extra if not e.endswith('-tail.wav')]
        if var:
            row['variants'] = var
        if extra and cid not in ('mm07-how-to-fire-a-ceo',):
            row['parts'] = extra
        if cid == 'mm07-how-to-fire-a-ceo':
            row['cuts'] = [dict(label='E01 picture cut (sc 24 + 25)', start=0.0, end=50.0, note='= e01-s25-the-plan'),
                           dict(label='PLAN-SHORT (12 bars, 2-5-3-2, flute)', start=50.0, end=80.0,
                                note='also its own mastered file with stems and loop (fix pass 1): see variants'),
                           dict(label='PLAN-MICRO (8 bars, 1-3-3-1, clarinet)', start=80.0, end=100.297,
                                note='also its own mastered file with stems (fix pass 1): see variants')]
        if cid == 'e01-s25-the-plan':
            row['parts'] = extra
            row['parts_note'] = 'alt/: the tape-stop starting on b17.1, b17.2 or b17.4; butt at 42.500 s (frame 1020)'
        eds = c.get('editor')
        if eds:
            row['editor_fixes'] = eds
        for it in smp['items']:
            src = it['source']
            if os.path.basename(src).startswith(cid + '-album'):
                row.setdefault('sampler', []).append(dict(n=it['n'], at=it['start_tc'], src_in=it['src_in'],
                                                          src_out=it['src_out']))
        out.append(row)
    with open(os.path.join(OST, 'index.json'), 'w') as fh:
        json.dump(out, fh, indent=1, ensure_ascii=False)
    print(f'index.json: {len(out)} cues')


if __name__ == '__main__':
    main()
