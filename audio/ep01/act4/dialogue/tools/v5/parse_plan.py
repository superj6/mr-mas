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
import re, json, os
P = os.path.join(REPO, "show/episodes/ep01/production/act4/edit-plan-v5.md")
SCRIPT = os.path.join(REPO, "show/episodes/ep01/script.md")
src = open(P).read()
sec = src.split("## 7. The full line list")[1].split("## 8. Build order")[0]
rows, scene = [], None
for line in sec.splitlines():
    m = re.match(r"#### sc (\S+) · (.*)", line)
    if m: scene = m.group(1); continue
    if line.startswith("| a5-"):
        cells = [c.strip() for c in line.strip().strip("|").split(" | ")]
        assert len(cells) == 9, (len(cells), line[:80])
        rid, shot, spk, text, tag, deliv, speed, gap, est = cells
        rows.append(dict(id=rid, scene=scene, shot=shot, speaker=spk, text=text, tag=tag, delivery=deliv,
                         speed=None if speed == "—" else float(speed), gap=gap, est=est))
voiced = [r for r in rows if r["speed"] is not None]
posts = [r for r in rows if r["speed"] is None]
print(len(rows), "rows;", len(voiced), "voiced;", len(posts), "posts")
wc = lambda t: len(re.findall(r"[A-Za-z0-9*']+(?:[-’'][A-Za-z0-9]+)*", t))
print("words", sum(wc(r["text"]) for r in voiced))
# check each voiced line's text appears in the script's Act Four
scr = open(SCRIPT).read()
a4 = scr.split("## ACT FOUR · THE BLIP, TOLD TWICE")[1].split("## TAG ·")[0]
norm = lambda s: re.sub(r"\s+", " ", s.replace("“", '"').replace("”", '"')).strip()
A = norm(a4)
miss = [r["id"] + " " + r["text"] for r in voiced if norm(r["text"].strip('"')) not in A]
print("not found verbatim in script Act Four:", len(miss)); [print("  ", m) for m in miss]
json.dump(dict(voiced=voiced, posts=posts), open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "plan_lines.json"), "w"), indent=1, ensure_ascii=False)
