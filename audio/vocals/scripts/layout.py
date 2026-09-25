"""Place the vocal pieces on the 30 s intro clock (t=0 == f0), build an audition reel, and
(optionally) a preview over whatever theme mixes the music agent has rendered so far."""
import os, sys, glob
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
from vlib import *

INTRO = 30.0

def load(rel):
    y, sr = sf.read(os.path.join(ROOT, rel + '.wav'))
    assert sr == SR
    return y.T

def layer(items):
    out = np.zeros((2, int(INTRO * SR)))
    for rel, frame, gain_db in items:
        y = load(rel)
        place(out, y * 10 ** (gain_db / 20), frame / FPS)
    return fade(out, 0, 0.05)

STORY = [
    ('vo/mas_coldopen_michael', 24, 0.0),                               # VO in at f24
    ('chant/feel-the-agi_stone-room_from-f280', 280, -3.0),             # file starts at f280
    ('harmony/title-pad_HYBRID_jazz+chip_F9sus', 630, -4.0),            # title hit f630
]
STABS = [  # stab files start 10 frames before the hit
    ('harmony/stab_doo-bah_HYBRID_F', 240 - 10, -7.0),
    ('harmony/stab_doo-bah_HYBRID_Bb', 360 - 10, -7.0),
    ('harmony/stab_doo-bah_HYBRID_C', 420 - 10, -6.0),
]

REEL = [
    'vo/mas_coldopen_michael', 'vo/mas_coldopen_puck', 'vo/mas_coldopen_echo', 'vo/mas_coldopen_liam',
    'vo/mas_coldopen_designed',
    'vo/nole_came-up-with-the-name_take1_fenrir', 'vo/nole_came-up-with-the-name_take2_fenrir',
    'vo/nole_came-up-with-the-name_alt_adam',
    'vo/mas_super_take1_michael', 'vo/mas_super_take2_michael', 'vo/mas_super_take1_michael_videocall',
    'chant/feel-the-agi_stone-room_from-f280', 'chant/feel-the-agi_cathedral_from-f280',
    'chant/feel-the-agi_dry_from-f280',
    'harmony/title-pad_piano-intimate_ooh_Fsus', 'harmony/title-pad_jazz-quartal_aah_F9sus',
    'harmony/title-pad_orchestral-choir_open-fifth_F', 'harmony/title-pad_8bit-chip-voice_arp_F9sus',
    'harmony/title-pad_HYBRID_jazz+chip_F9sus', 'harmony/title-pad_HYBRID_orch+jazz+chip_F',
    'harmony/stab_doo-bah_jazz-group_F', 'harmony/stab_doo-bah_8bit-chip_F', 'harmony/stab_doo-bah_HYBRID_F',
    'harmony/stab_doo-bah_jazz-group_Db', 'harmony/stab_doo-bah_jazz-group_Bb', 'harmony/stab_doo-bah_jazz-group_C',
    'harmony/scat_knee-hook_jazz-group_Fm', 'harmony/scat_knee-hook_8bit-chip_Fm', 'harmony/scat_knee-hook_HYBRID_Fm',
]

if __name__ == '__main__':
    a = layer(STORY)
    export(a, 'intro-layer/intro_vocals_A_story_at-f0')
    b = layer(STORY + STABS)
    export(b, 'intro-layer/intro_vocals_B_story+card-stabs_at-f0')
    # audition reel: every main variant, 0.7 s apart, index in README order
    parts = []
    for rel in REEL:
        y = load(rel)
        parts.append(y); parts.append(np.zeros((2, int(0.7 * SR))))
    reel = np.concatenate(parts, 1)
    export(reel, 'reel/vocals_audition_reel', target=-16.0)
    # previews over the theme agent's current renders (snapshot; those files belong to the theme agent).
    # Each theme colour gets the matching vocal colour.
    MATCH = {
        'chipchamber':    ('harmony/title-pad_HYBRID_jazz+chip_F9sus', 'harmony/stab_doo-bah_8bit-chip_{}'),
        'orchestralnoir': ('harmony/title-pad_HYBRID_orch+jazz+chip_F', 'harmony/stab_doo-bah_jazz-group_{}'),
        'pixelswing':     ('harmony/title-pad_jazz-quartal_aah_F9sus', 'harmony/stab_doo-bah_HYBRID_{}'),
        'pianopixels':    ('harmony/title-pad_piano-intimate_ooh_Fsus', 'harmony/stab_doo-bah_jazz-group_{}'),
    }
    for f in glob.glob(os.path.join(ROOT, 'intro-layer', '_preview_*')):
        os.remove(f)
    for th in sorted(glob.glob('/home/jgon/project/art/mrmas/audio/theme/theme-V*.wav')):
        m, sr = sf.read(th)
        if sr != SR or abs(len(m) / SR - INTRO) > 0.05:
            continue
        name = os.path.basename(th)[:-4]
        key = next((k for k in MATCH if k in name.lower()), None)
        pad, stab = MATCH.get(key, (STORY[2][0], STABS[0][0].rsplit('_', 1)[0] + '_{}'))
        story = STORY[:2] + [(pad, 630, -4.0)]
        stabs = [(stab.format(k), f - 10, g) for (k, f, g) in (('F', 240, -7.0), ('Bb', 360, -7.0), ('C', 420, -6.0))]
        m = m.T
        for tag, items in (('A', story), ('B', story + stabs)):
            lay = layer(items)[:, :m.shape[1]]
            mix = m * 10 ** (-2.0 / 20) + lay * 10 ** (-5.0 / 20)
            export(mix, f'intro-layer/_preview_vocals-{tag}_over_{name}')
