"""rooms.py - Ep2 v1: the room-tone recipes, one per lock `room` (new for Ep2; read by bed.py and stems.py).

The lock names each beat's room (the beat plan's `room`, show/episodes/ep02/production/v1/beat-plan/_spec.py); this
table turns a room into layers of SFX-board beds (audio/sfx/wav/<bed>.wav, levelled to a LUFS target, optionally
low-passed and panned). Each room lists CANDIDATES in order: the first whose beds all exist on the board is used, so a
NEW bed the SFX pass adds (manifest.md §7: bed_lobby_day, bed_seance_candles, bed_podcast_studio, ...) replaces its
stand-in with no code change. A room that isn't listed plays room tone at -44 LUFS, and says so; a room that is None
(black, the blueprint's card) has no bed (the stems put a faint room tone under a black instead).

Layers: {'bed': name, 'lufs': target, 'lp': Hz (optional), 'pan': (left gain, right gain) (optional)}.
"""
from __future__ import annotations

import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../..'))
SFXD = os.path.join(ROOT, 'audio/sfx/wav')


def L(bed, lufs, lp=None, pan=None):
    d = {'bed': bed, 'lufs': lufs}
    if lp:
        d['lp'] = lp
    if pan:
        d['pan'] = pan
    return d


DARK = [L('server_hum', -42, 1400), L('room_tone', -46), L('room_drone', -50)]     # Ep1's dark room, his room again
# room -> [candidate, ...]; a candidate is a list of layers. None: no bed (a black).
ROOMS = {
    # NopeAI's lobby (SET-01): by day, the watch party, the next morning; Ep1's night bed as the base
    'lobby_day': [[L('bed_lobby_day', -37)], [L('room_tone', -37), L('server_hum', -47, 2600)]],
    'lobby_watchparty': [[L('bed_lobby_watchparty', -36)], [L('bed_allhands', -37), L('room_tone', -43)]],
    'lobby_morning': [[L('bed_lobby_morning', -38)], [L('room_tone', -38), L('server_hum', -48, 2600)]],
    'lobby_night': [[L('bed_lobby_night', -38)]],
    # the boardroom (SET-02): the séance by candlelight; Mar 8 and May 28 by day
    'seance': [[L('bed_seance_candles', -38)], [L('bed_boardroom_night', -39)]],
    'boardroom_day': [[L('bed_boardroom_day', -39)]],
    'boardroom_night': [[L('bed_boardroom_night', -39)]],
    'boardroom': [[L('bed_boardroom_night', -39)]],
    # F2.3's 2018 all-hands (T3)
    'allhands': [[L('bed_allhands', -36)]],
    # the cathedral cut away (SET-06): the racks floor by floor, the basement lower
    'cathedral': [[L('server_hum', -37), L('room_tone', -44)]],
    'basement': [[L('bed_basement', -38)], [L('server_hum', -35, 900)]],
    # XEL's studio (SET-05): padded, never true silence (the score rests here: the room is the joke)
    'podcast_studio': [[L('bed_podcast_studio', -42)], [L('room_tone', -42, 1500)]],
    # his dark room (SET-07)
    'darkroom': [DARK],
    'dark': [DARK],
    # the demo stage: the wings (work lights), the house
    'wings': [[L('bed_wings', -40)], [L('room_tone', -40), L('server_hum', -50, 1800)]],
    'demo_house': [[L('bed_demo_house', -36)], [L('bed_allhands', -37), L('room_tone', -42)]],
    # the open floor (SET-12), Alyi's office (SET-13), the stairwell, the 2022 party, the 2023 offsite fire
    'open_floor': [[L('bed_open_floor', -38)], [L('bed_bullpen_packing', -38)]],
    'office_evening': [[L('bed_office_evening', -40)]],
    'office_2023': [[L('bed_office_evening', -41), L('server_hum', -50, 1800)]],
    'stairwell': [[L('bed_stairwell', -42)], [L('room_tone', -42, 2500)]],
    'party': [[L('bed_party_2022', -35)], [L('bed_allhands', -35)]],
    'fire_night': [[L('bed_fires', -37)]],
    # the Bay Bridge (SET-16): the evening rush, the night, the rain
    'bridge': [[L('bed_bridge_traffic', -36)], [L('bed_lighthouse', -41), L('room_tone', -42, 600)]],
    'bridge_night': [[L('bed_bridge_night', -40)], [L('bed_lighthouse', -43), L('room_tone', -44, 600)]],
    'bridge_rain': [[L('bed_bridge_rain', -37)], [L('bed_lighthouse', -40), L('room_tone', -40, 3000)]],
    # Misanthropic's lighthouse (SET-17) and the splits (SET-18: room tone panned to each pane)
    'lighthouse': [[L('bed_lighthouse', -39)]],
    'split_lighthouse': [[L('bed_boardroom_day', -41, pan=(1.0, 0.35)), L('bed_lighthouse', -43, pan=(0.35, 1.0))]],
    'split_zai': [[L('bed_campus_crowd', -40, pan=(1.0, 0.35)), L('bed_zai_lobby', -42, pan=(0.35, 1.0))],
                  [L('bed_allhands', -41, pan=(1.0, 0.35)), L('room_tone', -42, 1800, pan=(0.35, 1.0))]],
    # ELPPA's campus (SET-19), the 2008 stage (SET-20), the walled garden (SET-21), ISS's empty lot (SET-23)
    'campus': [[L('bed_campus_crowd', -37)], [L('bed_allhands', -40), L('room_tone', -42)]],
    'era_2008': [[L('bed_tpool', -40), L('room_tone', -44, 1800)]],
    'garden': [[L('bed_garden', -40)], [L('room_tone', -42, 3000)]],
    'empty_lot': [[L('bed_empty_lot', -42)], [L('room_tone', -44, 1500)]],
    # the 2 s filename card: room tone (Ep1's card level), the next chapter's room leads under its end
    'card': [[L('room_tone', -38)]],
    # no bed: a black, the blueprint's card (THE PLAN plays its own score)
    'black': None, 'void': None, 'none': None, '': None, 'blueprint': None,
}
DEFAULT = [L('room_tone', -44)]


def have(bed):
    return os.path.exists(os.path.join(SFXD, bed + '.wav'))


def recipe(room):
    """-> (layers or None, a note): the first candidate whose beds all exist; unknown -> room tone"""
    r = (room or '').strip()
    if r in ROOMS and ROOMS[r] is None:
        return None, f'{r or "(none)"}: no bed'
    if r not in ROOMS:
        return DEFAULT, f'{r}: NO RECIPE (room tone -44 LUFS; add it to audio/reel/ep02-v1/rooms.py)'
    for i, cand in enumerate(ROOMS[r]):
        if all(have(x['bed']) for x in cand):
            return cand, f'{r}: ' + ' + '.join(f"{x['bed']} {x['lufs']}" for x in cand) + ('' if i == 0 else ' (stand-in: the first choice is not on the SFX board yet)')
    return DEFAULT, f'{r}: none of its beds is on the board (room tone -44 LUFS)'
