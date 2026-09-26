"""The show's leitmotifs as named pitch and rhythm tables (OST-BIBLE s2), so every composer places the
same notes.  The knee is from the LOCKED main title (audio/theme/VARIATIONS.md).

Lines use Arr.line notation: 'F4/4 F4/4 G4/8. r/16 C5/2' (/4 quarter, /8 eighth, /16 sixteenth, '.' dotted,
't' triplet, '^' accent, 'r' rest, '|' bar line).  swing: 1.0 = the house swing (+10 frames at 96 BPM),
0 = straight.  Every entry carries its bible section, key, lead instruments and what it is NEVER played on.

    from engine.motifs import MOTIFS, place_motif, chord_of, find_motif, knee_whole_count
    place_motif(a, 'felt', 'WATER_LINE', (5, 1), vel=0.5)              # swung, as written
    place_motif(a, 'lead', 'WATER_LINE', (5, 1), part='nudge_double')  # the chip square on the nudge only
    place_motif(a, 'lead2', 'COPY', (5, 1), ep=3)                      # THE COPY: an eighth late in Ep3
    a.ch('glasspad', chord_of('ACHE'), (9, 1), '1bar', 0.4)
    find_motif(a.notes, 'WATER_LINE')      # -> [{inst, t, transpose}]   (the s6.9 motif matcher)
    knee_whole_count(a.notes)              # must be 0 in episode cues (s2.1, s6.9)

The knee:  F F F F G Ab C F (the last F an octave up).  'the flat line' = the first four notes;
'the kink' = G Ab C left hanging with no F.  The title chord has NO third (F9sus4 / quartal / open fifth).
"""
from __future__ import annotations

import re

import numpy as np

from .core import nm, Note, pc_of

# ================================================================== the knee (locked)
KNEE = ['F', 'F', 'F', 'F', 'G', 'Ab', 'C', 'F']
KNEE_OCT = [0, 0, 0, 0, 0, 0, 0, 1]
KNEE_IVS = [0, 0, 0, 0, 2, 3, 7, 12]
TITLE_CHORD = 'F9sus4'


def knee(octave=5, key='F', ivs=None):
    base = 12 * (octave + 1) + pc_of(key)
    return [base + i for i in (ivs or KNEE_IVS)]


def flat_line(octave=5, key='F', n=4):
    return knee(octave, key)[:1] * n


def leap(octave=5, key='F'):
    return knee(octave, key)[4:]


def kink(octave=5, key='F'):
    """G Ab C left hanging, no F (s2.1)."""
    return knee(octave, key)[4:7]


def transform(ps, how):
    """invert | retro | minor_leap | major_leap | stretch | compress."""
    p0 = ps[0]
    if how == 'invert':
        return [p0 - (p - p0) for p in ps]
    if how == 'retro':
        return ps[::-1]
    if how == 'minor_leap':
        return [p + (1 if (p - p0) % 12 == 7 else 0) for p in ps]
    if how == 'major_leap':
        return [p + (1 if (p - p0) % 12 == 3 else 0) for p in ps]
    if how == 'stretch':
        return [p + (1 if (p - p0) == 7 else 2 if (p - p0) == 12 else 0) for p in ps]
    if how == 'compress':
        return [p0 + round((p - p0) * 0.5) for p in ps]
    raise KeyError(how)


# ================================================================== the bible's tables (s2)
MOTIFS = {
    'KNEE': dict(bible='2.1', key='F minor', swing=1.0,
                 line='F5/8 F5/8 F5/8 F5/8 G5/8 Ab5/8 C6/8 F6/8',
                 lead='chip + band (main title)',
                 rule='WHOLE only in the main title and each episode\'s end-credits reprise; never inside an episode. '
                      'Fragments (flat line, kink) at most 1 per scene; vary register and chip duty on every note.'),
    'FLAT_LINE': dict(bible='2.1', key='F minor', swing=1.0, line='F5/8 F5/8 F5/8 F5/8',
                      rule='vary the register and chip duty on every note; never even beeps'),
    'KINK': dict(bible='2.1', key='F minor', swing=1.0, line='G5/8 Ab5/8 C6/4', rule='left hanging: no F'),
    'WATER_LINE': dict(
        bible='2.2', key='F minor, open fifth at the cadence', swing=1.0,
        line='F4/4 F4/4 F4/4 G4/8 F4/8 | C4/4 F4/2.',
        nudge_double='r/4 r/4 r/4 G4/8',                      # the 50 % chip square on the nudge note only
        harmony=['Fm(add9)', 'Dbmaj7', 'Bbm9', 'C7sus(b9)', 'F5'],
        lead='felt (+felt_mech); doubling: 50 % chip square on the nudge note only, or a triangle 8vb; rare: solo '
             'viola, one Harmon line per episode',
        never='a brass sustain, a sad cello double, a string swell; never under his room lines; no third at a cadence',
        eps={1: 'plain; after "okay." the felt cadence alone', 2: 'young (16-bit): the nudge twice',
             4: 'D7 debut: the nudge is Gb for one beat', 7: 'first capital letter: its first F an octave up, once',
             9: 'THE COPY plays it in sync, quantised', 10: '"Huh.": it stops on C4',
             11: 'in GLYPH\'s orchestration, but swung', 12: 'the settling F4 gets the season\'s only vibrato'}),
    'KEYNOTE': dict(
        bible='2.3', key='Db major / lydian', swing=0.0,
        line='Db5/4 Db5/4 Db5/4 Eb5/8 Db5/8 | Ab4/4 Db5/2.',
        harmony=['Dbmaj9#11', 'Ab/C', 'Gbmaj7#11', 'Db/F'],
        lead='felt with NO mechanics, NO room, perfectly even velocities (hum 0 ms), glossy long hall, pedal down',
        never='chip, bass, drums, swing; D5 only (<= 1 per episode, 1-2 bars); always cut mid-note by the hard cut'),
    'VERDICT': dict(bible='2.4', key='F-C, no third', swing=0.0, line='F5/4 C6/4',
                    lead='soft vibes + celesta or glass, let ring',
                    never='a third, ever; never at the same moment as the Orb\'s chime; never in answer to the V.O.',
                    eps={6: 'with a Db grace note', 7: 'THE HUG: it does not play', 9: 'retrograde C -> F',
                         10: 'F alone', 12: 'the fifth held under the supper'}),
    'ACHE': dict(bible='2.5', key='F pedal + the 9 and b13', chord=['F2', 'C3', 'G4', 'Db5'], plus=['C6'],
                 lead='glass (glasspad / shimmer / bell), celesta, sub pressure',
                 rule='inside a warm cue for one bar, then it leaves'),
    'TOKENS': dict(bible='2.5', key='{F G Ab C} (+Db), F4-Db6', swing=0.0, stages='patterns.TOKEN_STAGES',
                   eps={1: 'grains', 2: 'grains', 3: 'grains', 4: 'scrambled', 5: 'scrambled', 6: 'scrambled',
                        7: 'almost', 8: 'almost', 9: 'stream', 10: 'stream (swung)', 11: 'stream (swung)', 12: 'stream'},
                   lead='straight 16ths, 30-60 % rests, 0 ms humanise, no vibrato; glass, celesta, 12.5 % chip',
                   never='swung before Ep10, humanised, any "evil AI" trope; above Db6 (the SFX grains own G6-F7)'),
    'COPY': dict(bible='2.5', key='F minor', of='WATER_LINE', swing=0.0,
                 lag_beats={1: 1.0, 2: 1.0, 3: 0.5, 4: 0.5, 5: 0.5, 6: 0.25, 7: 0.25, 8: 0.25, 9: 0.0, 10: 0.0,
                            11: 0.0, 12: 0.0},
                 swung_eps=(10, 11, 12),
                 notes={1: 'a beat late; fails to finish (breaks off)', 2: 'a beat late, harmonised in three parts',
                        9: 'in sync, perfectly quantised', 10: 'in sync, with his swing'},
                 lead='chip', never='announced, or under a line that names it'),
    'BUILD': dict(
        bible='2.6', key='F minor', swing=0.0,
        line='F4/16 F4/16 G4/16 Ab4/16 C5/16 Ab4/16 G4/16 F4/16 F4/16 F4/16 G4/16 Ab4/16 C5/16 Eb5/16 C5/16 Ab4/16',
        tag='C5/8 F5/8', compile_passes=[4, 8, 12, 16],
        lead='25 % chip pulse; doubling xylo, claves or woodclick with pizz; the felt joins when Mas is with him',
        never='marimba (the Lighthouse\'s); it STOPS DEAD when he looks up; F4-C5 when the SFX keycaps pop'),
    'LAUNCH': dict(bible='2.7', key='C7(#9b13), never resolving to F', swing=0.0, line='C4/16 F4/16 Bb4/16 Eb5/16',
                   target='Ab5', rule='rip toward Ab5 and fall off ONE NOTE SHORT; <= 1.5 s',
                   lead='trumpets open staccato + a chip noise burst + timpani'),
    'ADDENDUM': dict(bible='2.8', key='Bb minor', swing=0.0,
                     line='Bb3/4 C4/4 Db4/4 F4/4 | Eb4/4. Db4/8 C4/4 Bb3/4', tail='C4/8 Db4/8 r/4',
                     rule='each repeat gains a bar: the tail climbs stepwise through Bb minor and never cadences',
                     lead='string quartet (svln lead, vla, vc, soft bass), straight or a light swing',
                     never='a pulse lead, a major swing, high bouncy chip; the chip is a triangle bass only'),
    'LIGHTHOUSE': dict(bible='2.8', key='Bb minor', swing=0.0,
                       line='F4/4 Bb4/4 Db5/4 F4/4 | Bb4/4 Db5/4 F4/4 Bb4/4 | Db5/4 F4/4 Bb4/4 Db5/4',
                       lead='marimba + harp (+ celesta), a cello pedal on Bb', never='nothing Nintendo'),
    'GPU_CHOIR': dict(bible='2.9', key='Db sus2(#11), no third', chord=['Db3', 'Ab3', 'Eb4', 'G4'], plus=['C5'],
                      lead='GM choir aahs + reed organ (GM 20), ppp',
                      never='church-organ tutti, hymn or chant quotation, any religious iconography'),
    'DOOR': dict(bible='2.9', key='Db lydian', swing=0.0, line='Ab4/2 Db5/2 | C5/4 G4/2.',
                 lead='flute (non-vibrato: art=nv) over the GPU choir, "through the door" (low-passed, one-sided room)',
                 rule='it never cadences: it ends on the #4'),
    'PODIUM': dict(bible='2.10', key='Eb major march', swing=0.0, pickup='Bb3/8', line='Eb4/4. F4/8 G4/4 Bb4/4 | Eb5/1',
                   credit='Eb4/8 Eb4/8 Eb4/8 Eb4/8 F4/8 G4/8 Bb4/8',
                   lead='engine: field snare, bass drum, staccato tuba, grand-piano march chords; accents: trombones and '
                        'trumpets on the fanfare (<= 2 bars), a 12.5 % chip piccolo 8va, glock on the held note',
                   never='trombone blats, slide glissandi, tuba farts, clown orchestration; the band stops for his real words'),
    'RENAME': dict(bible='2.10', key='Eb -> B/D#', chords=[['Eb2', 'G3', 'Bb3', 'Eb4'], ['D#2', 'F#3', 'B3', 'D#4']],
                   rule='under the held Eb5, over 2 beats: bass and top hold, the inner voices slip a semitone'),
    'FOUNTAIN_PEN': dict(bible='2.11', key='Bb major', swing=0.0, line='Bb3/4 Bb3/4 Bb3/4 Bb3/4 | C4/4 D4/4 F4/4 Bb4/4',
                         turn='C5/16 Bb4/16 A4/16 Bb4/16',
                         lead='string quartet, measured and legato; equal weight to the Podium (same loudness, length, slot)'),
    'UPSELL': dict(bible='2.12', key='F dorian', swing=1.0,
                   line='C4/8 Eb4/8 F4/8 G4/2 r/8 | Eb4/8 F4/8 G4/8 Ab4/2 r/8 | F4/8 G4/8 Ab4/8 Bb4/2 r/8',
                   close='C5/4 G4/4 F4/2^',
                   rule='after the close, beat 1 is a REST: the SFX KA-CHING (F6 + C7) is the downbeat',
                   lead='vibes + straight-mute trumpet in unison over a walking upright (double-time swing feel); '
                        'chip GPU clock (12.5 % 16th arps), grand-piano comping, brushes; the stab on the close'),
    'INTERN': dict(bible='2.13', key='F', swing=0.0, line='F5/8 F5/8 F5/8 G5/8 F5/8 C5/8 F5/4 | F5/8 C6/8 r/4 r/2',
                   lead='chip 25 % + celesta, F5-C6', rule='his motif, improved: faster, unswung, higher; grades itself '
                                                          'with the Orb\'s interval'),
    'STEP_FOUR': dict(bible='2.14', key='Bb minor -> F', swing=0.0, line='F4/2 Eb4/2 | Db4/2 r/2',
                      bass='Bb2/2 Ab2/2 | Gb2/2 F2/2', harmony=['Bbm(add9)', 'Ab(add9)', 'Gbmaj7', None],
                      lead='low strings + bassoon + muted horn (hn art=mute)',
                      rule='parallel fifths top to bass; step four = the bass alone (or the D6 drop-out); never villain '
                           'music'),
    'BLUEPRINT': dict(bible='2.15', key='F dorian, diatonic 4ths below (never an A natural)', swing=0.0,
                      line='F4/4 G4/4 Ab4/4 Bb4/4 | C5/2',
                      lead='chip music-box lead, pizzicato, celesta (also harp, clarinet or flute staccato)',
                      rule='one note per label; the break: the last 2 beats loop as the paper curls, then era.tape_stop',
                      never='piano, brass, a Mas motif, V.O.'),
    # ---- s2.16 colours
    'TASYA_FLOOR': dict(bible='2.16', key='chromatic mediants', chords_sym=['Abmaj9', 'Cmaj9', 'Emaj9', 'Abmaj9'],
                        lead='rhodes on the beats with silent attacks; the key-ring jangle (SFX) owns the offbeats'),
    'NELEH_CLOCKWORK': dict(bible='2.16', key='F minor', swing=0.0,
                            line='F5/16 C5/16 Ab4/16 C5/16 G5/16 C5/16 Ab4/16 C5/16', lead='pizzicato'),
    'NELEH_QUESTION': dict(bible='2.16', key='-', swing=0.0, line='C6/2 Db6/2', lead='one high violin harmonic'),
    'MADA_SPINNER': dict(bible='2.16', key='-', swing=0.0, line='C5/8 Db5/8', lead='harp or celesta; a loop that stops '
                                                                                  'when his spinner stops'),
    'HOURGLASS': dict(bible='2.16', key='-', rule='pizzicato grains, one per beat, falling in pitch (never one pitch)'),
    'CHATGTP_JINGLE': dict(bible='2.16', key='the previous cue\'s key', rule='an original 2-bar jingle that modulates '
                                                                            'into whatever key the previous cue was in '
                                                                            '(notes TBD by its composer)'),
}


def chord_of(name, plus=False):
    m = MOTIFS[name]
    ps = list(m['chord']) + (list(m.get('plus', [])) if plus else [])
    return [nm(p) for p in ps]


def line_pitches(text):
    """Pitches (MIDI) of a line, rests skipped."""
    out = []
    for tok in text.replace('|', ' ').split():
        p = tok.split('/')[0].rstrip('^')
        if p != 'r':
            out.append(nm(p))
    return out


def place_motif(a, inst, name, at, part='line', transpose=0, vel=0.6, swing=None, ep=None, lock=None, **x):
    """Write a motif (or one of its parts: 'line', 'tail', 'tag', 'turn', 'close', 'bass', 'credit', 'pickup',
    'nudge_double') on the grid at `at`.  swing: None = the motif's own (the house 1.0 or straight).
    'COPY' + ep: the Water Line, late by that episode's lag, quantised (swung from Ep10)."""
    m = MOTIFS[name]
    if name == 'COPY':
        lag = m['lag_beats'].get(ep or 1, 0.5)
        t0 = a.g.at(at)
        t0 = t0 + a.g.beats_s(lag, t0) if lag else t0
        sw = 1.0 if (ep in m['swung_eps']) else 0.0
        return a.line(inst, MOTIFS['WATER_LINE']['line'], t0, vel=vel, swing=sw if swing is None else swing,
                      transpose=transpose, lock=True if lock is None else lock, **x)
    text = m[part]
    sw = m.get('swing', 0.0) if swing is None else swing
    straight_rule = sw == 0.0 and name in ('KEYNOTE', 'TOKENS', 'BLUEPRINT', 'BUILD', 'INTERN')
    return a.line(inst, text, at, vel=vel, swing=sw, transpose=transpose,
                  lock=(straight_rule if lock is None else lock), **x)


def place_knee(a, inst, bar, octave=5, key='F', rate=0.5, swing=False, vel=0.6, gate=0.8, pitches=None,
               accents=(1.0, 0.86, 0.95, 0.86, 1.0, 0.95, 1.05, 1.1), lock=False, **x):
    """Put the knee (or `pitches`) on the grid from `bar`, one note per `rate` quarters.
    (The WHOLE knee is for the main title / credits only -- OST-BIBLE s2.1.)"""
    g = a.g
    ps = pitches or knee(octave, key)
    q = g.bar_q(bar)
    amt = None if swing is True else (float(swing) if swing else 0.0)
    out = []
    for i, p in enumerate(ps):
        qa, qb = q + i * rate, q + (i + 1) * rate
        ta = g.tq(g.swing_q(qa, amt) if swing else qa)
        tb = g.tq(g.swing_q(qb, amt) if swing else qb)
        n = Note(inst, float(nm(p)), ta, (tb - ta) * gate, min(1.0, vel * accents[i % len(accents)]), lock, dict(x))
        a.notes.append(n)
        out.append(n)
    return out


# ================================================================== the motif matcher (s6.9 item 10)
DRUMLIKE = {'brush', 'jazz', 'kit808', 'swish', 'k808', 'h808', 'clap808', 'sn808', 'rim808', 'snare', 'hat', 'timp',
            'bdrum', 'crash', 'suscym', 'cym_swell', 'gong', 'snare_taps', 'claves', 'woodclick', 'cabasa', 'rimshot',
            'bdrum_muted', 'noise', 'chipkick', 'noisesweep', 'felt_mech', 'tex', 'glyph', 'riser', 'impact',
            'revswell', 'room', 'clip_perc', 'clip_fx', 'shimmer', 'drone', 'pad'}


def top_lines(notes, insts=None, chord_ms=12.0):
    """{inst: [(t, pitch)]}: the highest note at each onset (chords collapse to their top)."""
    by = {}
    for n in sorted(notes, key=lambda n: n.start):
        if n.inst in DRUMLIKE or (insts and n.inst not in insts):
            continue
        seq = by.setdefault(n.inst, [])
        if seq and n.start - seq[-1][0] < chord_ms / 1000.0:
            if n.pitch > seq[-1][1]:
                seq[-1] = (seq[-1][0], n.pitch)
        else:
            seq.append((n.start, n.pitch))
    return by


def find_motif(notes, motif, insts=None, transpose=True, max_gap_s=1.6, octave_free=True):
    """Occurrences of a motif's pitch sequence in each instrument's top line.
    motif: a MOTIFS name, a line string, or a list of MIDI pitches.  transpose=False demands the written key
    (any octave if octave_free).  Returns [{inst, t, transpose}]."""
    if isinstance(motif, str):
        ps = line_pitches(MOTIFS[motif]['line'] if motif in MOTIFS else motif)
    else:
        ps = [nm(p) for p in motif]
    ivs = np.diff(ps)
    k = len(ps)
    out = []
    for inst, seq in top_lines(notes, insts).items():
        if len(seq) < k:
            continue
        pit = np.array([p for _, p in seq])
        ts = [t for t, _ in seq]
        for i in range(len(seq) - k + 1):
            if not np.allclose(np.diff(pit[i:i + k]), ivs):
                continue
            if max(np.diff(ts[i:i + k]), default=0) > max_gap_s:
                continue
            d = int(round(pit[i] - ps[0]))
            if not transpose and (d % 12 if octave_free else d) != 0:
                continue
            out.append(dict(inst=inst, t=round(ts[i], 4), transpose=d))
    return out


def knee_whole_count(notes, insts=None):
    """How many times the WHOLE knee (all 8 notes, any key) appears in one instrument line (s2.1: must be 0
    inside an episode)."""
    return len(find_motif(notes, knee(5), insts=insts, transpose=True))
