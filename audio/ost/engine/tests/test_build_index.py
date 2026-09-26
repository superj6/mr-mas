"""Fix 4: build.py's published index never lists private folders (_demo, _template) or '_' ids."""
import importlib.util
import json
import os
import tempfile
import unittest

from _util import OST


def _load_build():
    spec = importlib.util.spec_from_file_location('ost_build', os.path.join(OST, 'build.py'))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def _cue(tid):
    return dict(id=tid, title=tid, timing=dict(bpm=96, album_duration_s=10.0), loop=None,
                masters=dict(album=dict(measured=dict(lufs=-14.0)), underscore=dict(measured=dict(lufs=-20.0))))


class IndexTest(unittest.TestCase):
    def test_private_folders_left_out(self):
        B = _load_build()
        with tempfile.TemporaryDirectory() as d:
            for folder, tid in (('_demo', '_demo'), ('mm99-real', 'mm99-real'), ('_template', 'x'),
                                ('mm98-odd', '_scratch-id')):
                r = os.path.join(d, folder, 'render')
                os.makedirs(r)
                with open(os.path.join(r, f'{tid}.cue.json'), 'w') as fh:
                    json.dump(_cue(tid), fh)
            out = os.path.join(d, 'ix.json')
            ix = B.index(d, out)
            self.assertEqual([t['id'] for t in ix['tracks']], ['mm99-real'])
            with open(out) as fh:
                self.assertEqual([t['id'] for t in json.load(fh)['tracks']], ['mm99-real'])

    def test_published_index_on_disk_has_no_demo(self):
        p = os.path.join(OST, 'ost-index.json')
        with open(p) as fh:
            ids = [t['id'] for t in json.load(fh)['tracks']]
        self.assertFalse([i for i in ids if i.startswith('_')], ids)


if __name__ == '__main__':
    unittest.main()
