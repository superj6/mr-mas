"""Sample-set registry (lazy)."""
from functools import lru_cache
from .sampler import SampleSet

V = 'vsco2ce'
C = 'vcsl'

SETS = {
    # strings (VSCO 2 CE sections)
    'vln':       dict(pattern=f'{V}/Strings/Violin Section/susVib/*.wav', dyn_db=22),
    'vln_trem':  dict(pattern=f'{V}/Strings/Violin Section/Trem/*.wav', dyn_db=22),
    'vln_pizz':  dict(pattern=f'{V}/Strings/Violin Section/Pizz/*.wav', sustained=False, fine_tune=False, dyn_db=20),
    'vln_spic':  dict(pattern=f'{V}/Strings/Violin Section/Spic/*.wav', sustained=False, fine_tune=False, dyn_db=20),
    'vla':       dict(pattern=f'{V}/Strings/Viola Section/susvib/*.wav', dyn_db=22),
    'vla_trem':  dict(pattern=f'{V}/Strings/Viola Section/trem/*.wav', dyn_db=22),
    'vla_pizz':  dict(pattern=f'{V}/Strings/Viola Section/pizz/*.wav', sustained=False, fine_tune=False, dyn_db=20),
    'vla_spic':  dict(pattern=f'{V}/Strings/Viola Section/spic/*.wav', sustained=False, fine_tune=False, dyn_db=20),
    'vc':        dict(pattern=f'{V}/Strings/Cello Section/susvib/*.wav', dyn_db=22),
    'vc_trem':   dict(pattern=f'{V}/Strings/Cello Section/trem/*.wav', dyn_db=22),
    'vc_pizz':   dict(pattern=f'{V}/Strings/Cello Section/pizzT/*.wav', sustained=False, fine_tune=False, dyn_db=20),
    'vc_spic':   dict(pattern=f'{V}/Strings/Cello Section/spic/*.wav', sustained=False, fine_tune=False, dyn_db=20),
    'cb':        dict(pattern=f'{V}/Strings/Solo Contrabass/SusVib/*.wav', dyn_db=22),
    'cb_pizz':   dict(pattern=f'{V}/Strings/Solo Contrabass/Pizz/*.wav', sustained=False, fine_tune=False, dyn_db=18),
    'cb_spic':   dict(pattern=f'{V}/Strings/Solo Contrabass/Spic/*.wav', sustained=False, fine_tune=False, dyn_db=18),
    'svln':      dict(pattern=f'{V}/Strings/Solo Violin/Arco Vib/*.wav', dyn_names=True, dyn_db=20),
    'harp':      dict(pattern=f'{V}/Strings/Harp/*.wav', dyn_names=True, sustained=False, dyn_db=18),
    # brass
    'tpt':       dict(pattern=f'{V}/Brass/Trumpet/sus/*.wav', dyn_db=20),
    'tpt_vib':   dict(pattern=f'{V}/Brass/Trumpet/susvib/*.wav', dyn_db=20),
    'tpt_stac':  dict(pattern=f'{V}/Brass/Trumpet/stac/*.wav', sustained=False, fine_tune=False, dyn_db=18),
    'tpt_harmon': dict(pattern=f'{V}/Brass/Trumpet/harmonM-sus/*.wav', dyn_db=18),
    'tpt_straight': dict(pattern=f'{V}/Brass/Trumpet/straightM-sus/*.wav', dyn_db=18),
    'hn':        dict(pattern=f'{V}/Brass/F Horn/sus/*.wav', dyn_db=22),
    'hn_stac':   dict(pattern=f'{V}/Brass/F Horn/stac/*.wav', sustained=False, fine_tune=False, dyn_db=18),
    'hn_mute':   dict(pattern=f'{V}/Brass/F Horn/mute/*.wav', dyn_db=18),
    'tbn':       dict(pattern=f'{V}/Brass/Tenor Trombone/sus/*.wav', dyn_db=22),
    'tbn_stac':  dict(pattern=f'{V}/Brass/Tenor Trombone/stac/*.wav', sustained=False, fine_tune=False, dyn_db=18),
    'tuba':      dict(pattern=f'{V}/Brass/Tuba/sus/*.wav', dyn_db=22),
    'tuba_stac': dict(pattern=f'{V}/Brass/Tuba/stac/*.wav', sustained=False, fine_tune=False, dyn_db=18),
    # winds
    'cl':        dict(pattern=f'{V}/Woodwinds/Clarinet/susLong/*.wav', dyn_db=20),
    'cl_stac':   dict(pattern=f'{V}/Woodwinds/Clarinet/stac/*.wav', sustained=False, fine_tune=False, dyn_db=18),
    'fl':        dict(pattern=f'{V}/Woodwinds/Flute/susvib/*.wav', dyn_db=18),
    'fl_nv':     dict(pattern=f'{V}/Woodwinds/Flute/susNV/*.wav', dyn_db=18),
    'bsn':       dict(pattern=f'{V}/Woodwinds/Bassoon/sus/*.wav', dyn_db=20),
    'tsax':      dict(pattern=f'{C}/Aerophones/Reed Aerophones/Tenor Saxophone/Non-Vibrato/*.wav', vel_re=r'_vl(\d+)', dyn_db=20),
    'tsax_vib':  dict(pattern=f'{C}/Aerophones/Reed Aerophones/Tenor Saxophone/Vibrato/*.wav', vel_re=None, dyn_db=20),
    'tsax_stac': dict(pattern=f'{C}/Aerophones/Reed Aerophones/Tenor Saxophone/Staccato/*.wav', vel_re=r'_vl(\d+)', sustained=False, fine_tune=False, dyn_db=18),
    # mallets / bells
    'glock':     dict(pattern=f'{V}/Percussion/Glock/*.wav', vel_re=None, sustained=False, octave_fix=12, fine_tune=False, cents_override=12.0, dyn_db=18),
    'vibes':     dict(pattern=f'{C}/Idiophones/Struck Idiophones/Vibraphone/Soft Mallets/*.wav', vel_re=r'_v(\d+)', sustained=False, dyn_db=20),
    'vibes_hard': dict(pattern=f'{C}/Idiophones/Struck Idiophones/Vibraphone/Hard Mallets/*.wav', vel_re=r'_v(\d+)', sustained=False, dyn_db=20),
    'chimes':    dict(pattern=f'{C}/Idiophones/Struck Idiophones/Tubular Bells 1/*.wav', dyn_names=True, sustained=False, octave_fix=12, fine_tune=False, dyn_db=18),
}

UNPITCHED = {
    'timp':       dict(pattern=f'{V}/Percussion/Timpani/Timpani*_Hit_*.wav', exclude=r'Timpani5', vel_re=r'_v(\d+)', sustained=False, dyn_db=24),
    'crash':      dict(pattern=f'{V}/Percussion/cymbal-crash1_*.wav', dyn_names=True, sustained=False, dyn_db=20),
    'suscym':     dict(pattern=f'{V}/Percussion/susCymb1-hit_*.wav', vel_re=r'-v(\d+)|_v(\d+)', sustained=False, dyn_db=20),
    'suscym_stick': dict(pattern=f'{V}/Percussion/susCymb1-hitstick*.wav', vel_re=r'_v(\d+)', sustained=False, dyn_db=20),
    'bdrum':      dict(pattern=f'{V}/Percussion/BDrumNewhit_*.wav', vel_re=r'_v(\d+)', sustained=False, dyn_db=26),
    'snare':      dict(pattern=f'{V}/Percussion/Snare2-HitSN_*.wav', vel_re=r'_v(\d+)', sustained=False, dyn_db=24),
    'snare_taps': dict(pattern=f'{V}/Percussion/Snare2-taps_*.wav', vel_re=r'_v(\d+)', sustained=False, dyn_db=20),
    'gong':       dict(pattern=f'{V}/Percussion/gongHit_*.wav', dyn_names=True, sustained=False, dyn_db=20),
    'hat':        dict(pattern=f'{C}/Idiophones/Struck Idiophones/Hi-Hat Cymbal/HiHat_HitC_*.wav', vel_re=r'_v(\d+)', sustained=False, dyn_db=20),
    'hat_foot':   dict(pattern=f'{C}/Idiophones/Struck Idiophones/Hi-Hat Cymbal/HiHat_Close_*.wav', vel_re=None, sustained=False, dyn_db=18),
    'ride2':      dict(pattern=f'{C}/Idiophones/Struck Idiophones/Suspended Cymbal 2/susCymb2_hit_stick_*.wav', dyn_names=True, sustained=False, dyn_db=18),
    'cym_swell':  dict(pattern=f'{C}/Idiophones/Struck Idiophones/Suspended Cymbal 2/susCymb2_cresc_*.wav', vel_re=None, sustained=True, dyn_db=10),
}


@lru_cache(maxsize=None)
def get(name: str) -> SampleSet:
    if name == 'timp':
        return timpani()
    if name in SETS:
        kw = dict(SETS[name])
        return SampleSet(name, **kw)
    kw = dict(UNPITCHED[name])
    return SampleSet(name, pitched=False, **kw)


@lru_cache(maxsize=None)
def timpani() -> SampleSet:
    """Timpani files carry no note names: detect each drum's pitch and treat as pitched."""
    import numpy as np
    from .sampler import load_wav, trim_lead, detect_f0
    s = SampleSet('timp', pitched=False, **UNPITCHED['timp'])
    for e in s.entries:
        x = trim_lead(load_wav(e['path']))
        seg = x[:, int(0.05 * 48000):int(0.9 * 48000)]
        f0 = detect_f0(seg, 55, 260)
        e['pitch'] = float(69 + 12 * np.log2(f0 / 440.0))
        e['cents'] = 0.0
    import re as _re
    groups = {}
    for e in s.entries:
        k = _re.search(r'Timpani(\d)', e['path']).group(1)
        groups.setdefault(k, []).append(e['pitch'])
    for e in s.entries:
        k = _re.search(r'Timpani(\d)', e['path']).group(1)
        e['pitch'] = float(np.median(groups[k]))
    s.pitched = True
    return s
