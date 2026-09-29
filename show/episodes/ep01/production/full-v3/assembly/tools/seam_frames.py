#!/usr/bin/env python3
"""seam_frames.py - the v3-assemble pass: each chapter's first and last frame in the film against the same frame of its source
picture (mean abs difference, 0-255, at 480 x 270), and against the neighbouring source frame, so a one-frame shift would show.
  audio/.venv-casting/bin/python show/episodes/ep01/production/full-v3/assembly/tools/seam_frames.py [variant ...]  -> assembly/seam-frames[-<variants>].json"""
import os  # noqa: E402  (phase 1: the project root is found at run time, docs/ORGANIZATION-PLAN.md §4)
import sys  # noqa: E402


def _repo():
    for start in (os.path.dirname(os.path.abspath(__file__)), os.getcwd()):
        d = start
        while True:
            if os.path.exists(os.path.join(d, '.mrmas-root')):
                return d
            if d == os.path.dirname(d):
                break
            d = os.path.dirname(d)
    sys.exit('MR. MAS: no .mrmas-root above this script or the cwd; set MRMAS_ROOT')


REPO = os.environ.get('MRMAS_ROOT') or _repo()
import json, subprocess, os, numpy as np, sys
ROOT=REPO; FFD=f"{ROOT}/studio/node_modules/@remotion/compositor-linux-x64-gnu"; ENV={**os.environ,"LD_LIBRARY_PATH":FFD}
def frame(path, idx, W=480, H=270):
    if path.endswith(".png"):                      # a held still (v3.2's hum gap): every frame is the image
        r = subprocess.run([f"{FFD}/ffmpeg","-v","error","-i",path,"-vf",f"scale={W}:{H}:flags=area","-f","image2pipe","-c:v","rawvideo","-pix_fmt","rgb24","-"],capture_output=True,env=ENV,check=True).stdout
        return np.frombuffer(r,np.uint8).reshape(H,W,3).astype(float)
    # the idx-th frame, decoded from the start of its GOP (accurate seek)
    # decode from the nearest earlier second and take the right frame by count (robust to edit lists)
    t0 = max(0, idx // 24 - 2)
    r = subprocess.run([f"{FFD}/ffmpeg","-v","error","-ss",f"{t0}","-i",path,"-frames:v",str(idx - t0*24 + 1),"-vf",f"scale={W}:{H}:flags=area","-f","image2pipe","-c:v","rawvideo","-pix_fmt","rgb24","-"],capture_output=True,env=ENV,check=True).stdout
    a = np.frombuffer(r,np.uint8).reshape(-1,H,W,3)
    assert len(a) == idx - t0*24 + 1, (path, idx, len(a))
    return a[-1].astype(float)
out={}
for v in (sys.argv[1:] or ["kokoro","el"]):
    a=json.load(open(f"{ROOT}/show/episodes/ep01/production/full-v3/assembly/{v}-assembly.json"))
    film=f"{ROOT}/{a['film']}"; rows=[]
    for c in a["chapters"]:
        src=f"{ROOT}/{c['video']}"
        for k,lab in [(0,"first"),(c["frames"]-1,"last")]:
            fa=frame(film,c["start_frame"]+k); fb=frame(src,k)
            # and the neighbours, to show a one-frame shift would be caught
            fn=frame(src,min(c["frames"]-1,k+1)) if lab=="first" else frame(src,max(0,k-1))
            rows.append(dict(ch=c["id"],which=lab,mad=round(float(np.abs(fa-fb).mean()),2),mad_vs_neighbour=round(float(np.abs(fa-fn).mean()),2)))
    out[v]=rows
    for r in rows: print(v, r)
json.dump(out,open(f"{ROOT}/show/episodes/ep01/production/full-v3/assembly/seam-frames{'-' + '-'.join(sys.argv[1:]) if sys.argv[1:] else ''}.json","w"),indent=1)
