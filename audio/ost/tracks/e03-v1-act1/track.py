#!/usr/bin/env python3
"""Episode 3 act1: lock-driven continuous scene score. Through ops/heavy.sh, OST_WORKERS=2."""
import os
import sys
sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'e03-v1-common'))
from episode_score import main
if __name__ == '__main__':
    main('act1', HERE)
