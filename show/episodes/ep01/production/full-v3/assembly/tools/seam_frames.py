#!/usr/bin/env python3
"""seam_frames.py - the v3-assemble pass: each chapter's first and last frame in the film against the same frame of its source
picture (mean abs difference, 0-255, at 480 x 270), and against the neighbouring source frame, so a one-frame shift would show.
  audio/.venv-casting/bin/python show/episodes/ep01/production/full-v3/assembly/tools/seam_frames.py  -> assembly/seam-frames.json"""
import json, subprocess, os, numpy as np, sys
ROOT="/home/jgon/project/art/mrmas"; FFD=f"{ROOT}/studio/node_modules/@remotion/compositor-linux-x64-gnu"; ENV={**os.environ,"LD_LIBRARY_PATH":FFD}
def frame(path, idx, W=480, H=270):
    # the idx-th frame, decoded from the start of its GOP (accurate seek)
    # decode from the nearest earlier second and take the right frame by count (robust to edit lists)
    t0 = max(0, idx // 24 - 2)
    r = subprocess.run([f"{FFD}/ffmpeg","-v","error","-ss",f"{t0}","-i",path,"-frames:v",str(idx - t0*24 + 1),"-vf",f"scale={W}:{H}:flags=area","-f","image2pipe","-c:v","rawvideo","-pix_fmt","rgb24","-"],capture_output=True,env=ENV,check=True).stdout
    a = np.frombuffer(r,np.uint8).reshape(-1,H,W,3)
    assert len(a) == idx - t0*24 + 1, (path, idx, len(a))
    return a[-1].astype(float)
out={}
for v in ["kokoro","el"]:
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
json.dump(out,open(f"{ROOT}/show/episodes/ep01/production/full-v3/assembly/seam-frames.json","w"),indent=1)
