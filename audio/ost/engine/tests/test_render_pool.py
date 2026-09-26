"""Fix 3b: the forked renderer can no longer hang.

The old ProcessPoolExecutor(fork) hung for ever when a worker died part-way through sending its buffer
(shared result semaphore left held, parent stuck in recv); these tests drive the new pool through the same
failures and check that every track still comes back, in bounded time."""
import os
import threading
import time
import unittest

import numpy as np

from _util import OST  # noqa: F401  (puts audio/ost on sys.path)
from engine import render

PARENT = os.getpid()


def _fake(behaviour):
    """A stand-in for render._job: `behaviour(name)` runs only inside forked children."""
    def job(name):
        if os.getpid() != PARENT:
            behaviour(name)
        return name, np.full((2, 48000), float(len(name)), dtype=np.float32), 0.0
    return job


class RenderPoolTest(unittest.TestCase):
    def setUp(self):
        self._orig = render._job

    def tearDown(self):
        render._job = self._orig

    def _run(self, names, workers=3, timeout=30.0):
        t0 = time.time()
        out = {n: y for n, y, _ in render.run_jobs(names, workers, timeout=timeout)}
        return out, time.time() - t0

    def test_all_results_come_back(self):
        render._job = _fake(lambda n: None)
        names = [f'trk{i}' for i in range(7)]
        out, _ = self._run(names)
        self.assertEqual(sorted(out), sorted(names))
        for n, y in out.items():
            self.assertEqual(y.shape, (2, 48000))
            self.assertTrue(np.all(y == len(n)))

    def test_worker_killed_mid_job_is_rendered_again(self):
        def die(n):
            if n == 'victim':
                os.kill(os.getpid(), 9)                     # what the OOM killer does
        render._job = _fake(die)
        out, dt = self._run(['a', 'victim', 'bb', 'ccc'])
        self.assertEqual(sorted(out), ['a', 'bb', 'ccc', 'victim'])
        self.assertLess(dt, 20)

    def test_worker_crash_is_rendered_again(self):
        def crash(n):
            if n == 'bad':
                os._exit(3)
        render._job = _fake(crash)
        out, _ = self._run(['bad', 'good'])
        self.assertEqual(sorted(out), ['bad', 'good'])

    def test_hung_worker_times_out(self):
        def hang(n):
            if n == 'stuck':                                 # a lock that never comes free (futex wait)
                lk = threading.Lock()
                lk.acquire()
                lk.acquire()
        render._job = _fake(hang)
        out, dt = self._run(['stuck', 'ok1', 'ok2'], timeout=2.0)
        self.assertEqual(sorted(out), ['ok1', 'ok2', 'stuck'])
        self.assertLess(dt, 15)

    def test_no_fork_while_other_threads_live(self):
        pids = []

        def job(name):
            pids.append(os.getpid())
            return name, np.zeros((2, 8), dtype=np.float32), 0.0
        render._job = job
        ev = threading.Event()
        th = threading.Thread(target=ev.wait, name='a caller thread')
        th.start()
        try:
            out, _ = self._run(['x', 'y', 'z'])
        finally:
            ev.set()
            th.join()
        self.assertEqual(sorted(out), ['x', 'y', 'z'])
        self.assertEqual(set(pids), {PARENT})               # rendered in-process: nothing was forked

    def test_no_temp_files_left(self):
        render._job = _fake(lambda n: None)
        d = render._xfer_dir()
        before = {p for p in os.listdir(d) if p.startswith(f'ost-render-{os.getpid()}-')}
        self._run(['p', 'q'])
        after = {p for p in os.listdir(d) if p.startswith(f'ost-render-{os.getpid()}-')}
        self.assertEqual(after, before)


if __name__ == '__main__':
    unittest.main()
