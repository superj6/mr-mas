"""MR. MAS OST engine (generalised from audio/theme/engine, which stays locked).

    from engine import *          # the composer-facing API (see engine/README.md)

core        SR, FPS, FAMILIES, Note, nm, note_name, db, filters
grid        Grid, frame_lock_bpm                         bars / beats / frames / tempo ramps / swing
arrange     Arr, palette                                 writing notes; every instrument as a Track
render      Track, Score, render_score, render_loop      stems, loops
harmony     parse, voice, drop2, rootless, quartal, so_what, ust, spread, lead, progression, scale
patterns    arp, ostinato, rhythm, euclid, comp, walking_bass, tokens (GLYPH's token stream)
dynamics    DYN, Curve, marks, hairpin, phrase_arc, apply_vel, gain_points, db_points, swell_env
humanize    Humanizer, groove, accent
articulations (as art)  legato, pizz, spic, trem, swell, fp, sfz, stab, fall, rip, doit, scoop, shout
drums       Drums, swing_ride                            the pattern DSL
texture     sine_cluster, dread, granular, freeze, crush, glyph, shepard, server_hum
era         Era, ERA_PRESETS, tape_stop, codec_2008, futz  tape era filters, in-world speakers
motifs      MOTIFS (the OST-BIBLE s2 tables), place_motif, find_motif, knee_whole_count, knee, ...
export      build, render_cli, MASTERS                   masters, stems, loop, MIDI, cue sheet
analysis    loudness, bands, hits, loop_seam, piano_roll, written_third, f_major_check, knee_completion,
            sub_under_room, ...
tuning      per-sample tuning: `python -m engine.tuning [--verify]` (the table is library.TUNING)
tests       `python -m unittest discover -s engine/tests -v` (run from audio/ost)
"""
from .core import SR, FPS, SPF, FAMILIES, Note, nm, note_name, pc_of, db, todb, lp, hp, bp, peq, shelf, s2f, f2s
from .grid import Grid, frame_lock_bpm
from .render import Track, Score, render_score, render_loop, expand_loops
from .arrange import (Arr, palette, felt_post, felt_post_bright, snes_post, cup_mute, air, tape_peak, DIEGETIC_ONLY,
                      balance_group)
from .harmony import (parse, voice, close, drop2, drop3, drop24, rootless, shell, quartal, so_what, ust, cluster,
                      spread, lead, progression, chord_at, scale, scale_notes, degree, names)
from .patterns import arp, ostinato, rhythm, euclid, comp, walking_bass, step_times, tokens, TOKEN_STAGES
from .dynamics import DYN, Curve, marks, hairpin, phrase_arc, apply_vel, gain_points, db_points, swell_env, fp_env
from .humanize import Humanizer, groove, accent
from . import articulations as art
from .drums import Drums, swing_ride
from .texture import sine_cluster, dread, granular, freeze, crush, glyph, shepard, server_hum
from .era import Era, ERA_PRESETS, tape_stop, codec_2008, futz, FUTZ
from .motifs import (KNEE, knee, place_knee, flat_line, leap, kink, transform, MOTIFS, place_motif, chord_of,
                     line_pitches, find_motif, knee_whole_count, TITLE_CHORD)
from .export import build, render_cli, MASTERS, ENGINE_VERSION
from . import analysis

__all__ = [k for k in dir() if not k.startswith('_')]
