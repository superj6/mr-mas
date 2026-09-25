"""Registry for SFX board entries."""
from __future__ import annotations

REG: list[dict] = []


def sfx(id: str, desc: str, *, pitch: str | None = None, use: str = "", frames: list[int] | None = None,
        cat: str = "", flavor: str = "hybrid", variant_of: str | None = None, mix_db: float = 0.0,
        loop: bool = False, norm: str = "auto", target: float = -14.0, anchor: str = "start",
        sync: str | None = None):
    """Register a sound generator.

    frames: intro frames (24 fps) where the sound's anchor lands.
    anchor: 'start' = file start sits on the frame; 'end' = file END lands on the frame (swells/risers);
            'hit' = file has a pre-roll and the transient is at `sync` seconds.
    mix_db: suggested gain for the intro mix relative to the normalized master.
    """
    def deco(fn):
        REG.append(dict(id=id, fn=fn, description=desc, pitch=pitch, useAt=use, frames=frames or [],
                        category=cat, flavor=flavor, variantOf=variant_of, mixDb=mix_db, loop=loop,
                        norm=norm, target=target, anchor=anchor, sync=sync))
        return fn
    return deco


def variant(id: str, fn, **kw):
    sfx(id, **kw)(fn)
