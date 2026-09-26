"""Shared bits for the engine regression tests.  Run them all from audio/ost:
    ../.venv-theme/bin/python -m unittest discover -s engine/tests -v
"""
import os
import sys

OST = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# OST_ENGINE_ROOT=<a folder holding another engine/> runs the same tests against that copy (an A/B against the
# pre-fix engine: they should fail there)
ROOT = os.environ.get('OST_ENGINE_ROOT', OST)
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)
THEME_V1 = os.path.join(os.path.dirname(OST), 'theme', 'theme-V1-chipchamber.wav')   # read-only reference
