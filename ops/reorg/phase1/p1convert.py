#!/usr/bin/env python3
"""Phase 1 converter: /home/jgon/project/art/mrmas -> the .mrmas-root marker lookup (plan §4 phase 1).
   python3 p1convert.py [--apply] file...      (report mode prints what it would change and every case it can't)"""
import ast, io, os, re, sys, tokenize

ABS = '/home/jgon/project/art/mrmas'
APPLY = '--apply' in sys.argv
files = [f for f in sys.argv[1:] if not f.startswith('--')]
manual = []

PY_BLOCK = '''import os  # noqa: E402  (phase 1: the project root is found at run time, docs/ORGANIZATION-PLAN.md §4)
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


{var} = os.environ.get('MRMAS_ROOT') or _repo()
'''

SH_LINE = ('{var}=${{MRMAS_ROOT:-$(d=$(cd "$(dirname "${{BASH_SOURCE[0]}}")" && pwd) || exit 1; while [ ! -e "$d/.mrmas-root" ]; do '
           '{{ [ "$d" = / ] || [ "$d" = . ]; }} && {{ echo "MR. MAS: no .mrmas-root above ${{BASH_SOURCE[0]}}; set MRMAS_ROOT" >&2; exit 1; }}; '
           'd=$(dirname "$d"); done; echo "$d")}} || exit 1   # the project root (phase 1, docs/ORGANIZATION-PLAN.md §4)\n')


def comment_fix(s):
    return s.replace(ABS + '/', '').replace(ABS, '<repo>').replace('/home/jgon/', '$HOME/')


def py(f, text):
    tree = ast.parse(text)
    lines = text.split('\n')
    # the var: REPO unless the file uses REPO for something other than the constant
    rm_line = None
    for st in tree.body:
        if isinstance(st, ast.Assign) and len(st.targets) == 1 and getattr(st.targets[0], 'id', '') == 'REPO' \
                and isinstance(st.value, ast.Constant) and st.value.value in (ABS, ABS + '/'):
            rm_line = st.lineno
    other_repo = any(isinstance(n, ast.Name) and n.id == 'REPO' for n in ast.walk(tree)) and rm_line is None
    var = '_MRMAS_ROOT' if other_repo else 'REPO'
    # docstring expression statements (module, function, class) keep prose: repo-relative
    doc_lines = set()
    for n in ast.walk(tree):
        if isinstance(n, (ast.Module, ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)) and n.body \
                and isinstance(n.body[0], ast.Expr) and isinstance(n.body[0].value, ast.Constant) and isinstance(n.body[0].value.value, str):
            doc_lines.update(range(n.body[0].lineno, n.body[0].end_lineno + 1))
    edits = []   # (row, col, end_row, end_col, new)
    toks = list(tokenize.generate_tokens(io.StringIO(text).readline))
    i = 0
    fstr_depth = 0
    while i < len(toks):
        t = toks[i]
        tn = tokenize.tok_name.get(t.type, '')
        if tn == 'FSTRING_START':      # py3.12: f-strings are tokenized in parts
            j = i
            while tokenize.tok_name.get(toks[j].type) != 'FSTRING_END':
                j += 1
            seg = toks[i:j + 1]
            src = tokenize.untokenize  # noqa
            (r0, c0), (r1, c1) = t.start, toks[j].end
            raw = '\n'.join(lines[r0 - 1:r1])[c0:len('\n'.join(lines[r0 - 1:r1])) - (len(lines[r1 - 1]) - c1)]
            if ABS in raw:
                edits.append((r0, c0, r1, c1, raw.replace(ABS, '{' + var + '}')))
            i = j + 1
            continue
        if t.type == tokenize.COMMENT and '/home/jgon' in t.string:
            edits.append((*t.start, *t.end, comment_fix(t.string)))
        elif t.type == tokenize.STRING and '/home/jgon' in t.string:
            s = t.string
            mo = re.match(r'^([rRbBuUfF]*)(\'\'\'|"""|\'|")', s)
            pre, q = mo.group(1), mo.group(2)
            body = s[len(pre) + len(q):-len(q)]
            if t.start[0] in doc_lines or q in ('"""', "'''") and not pre.lower().count('f'):
                edits.append((*t.start, *t.end, comment_fix(s)))
            elif 'f' in pre.lower():
                edits.append((*t.start, *t.end, s.replace(ABS, '{' + var + '}')))
            elif body == ABS or body == ABS + '/':
                edits.append((*t.start, *t.end, var))
            elif body.startswith(ABS + '/') and not pre and '\\' not in body:
                rest = body[len(ABS) + 1:]
                edits.append((*t.start, *t.end, f'os.path.join({var}, {q}{rest}{q})'))
            elif body.startswith('/home/jgon/Downloads/'):
                edits.append((*t.start, *t.end, f"os.path.expanduser({q}~/{body[len('/home/jgon/'):]}{q})"))
            else:
                manual.append((f, t.start[0], s[:120]))
        i += 1
    if rm_line:
        edits.append((rm_line, 0, rm_line, len(lines[rm_line - 1]), '#REMOVE#'))
    # apply edits bottom-up
    out = lines[:]
    for r0, c0, r1, c1, new in sorted(edits, reverse=True):
        head, tail = out[r0 - 1][:c0], out[r1 - 1][c1:]
        out[r0 - 1:r1] = (head + new + tail).split('\n')
    out = [ln for ln in out if ln.strip() != '#REMOVE#']
    # insert the block after the module docstring and __future__ imports (the earliest legal place)
    at = 0
    body = tree.body
    k = 0
    if body and isinstance(body[0], ast.Expr) and isinstance(body[0].value, ast.Constant) and isinstance(body[0].value.value, str):
        at = body[0].end_lineno; k = 1
    while k < len(body) and isinstance(body[k], ast.ImportFrom) and body[k].module == '__future__':
        at = body[k].end_lineno; k += 1
    if at == 0:   # skip the shebang and leading comments
        while at < len(lines) and (lines[at].startswith('#') or not lines[at].strip()):
            at += 1
    # the removed REPO line shifts nothing above `at` (it's below the docstring)
    block = PY_BLOCK.format(var=var)
    new = '\n'.join(out[:at]) + ('\n' if at else '') + block + '\n'.join(out[at:])
    return new, len(edits), var


def sh(f, text):
    lines = text.split('\n')
    var = 'REPO'
    if re.search(r'^\s*(?:export\s+)?REPO=', text, re.M) and not re.search(r'^\s*REPO=' + re.escape(ABS), text, re.M):
        var = 'MRMAS_REPO'
    n = 0
    out = []
    for ln in lines:
        if '/home/jgon' not in ln:
            out.append(ln); continue
        n += 1
        if ln.lstrip().startswith('#'):
            out.append(comment_fix(ln)); continue
        if re.match(r'^\s*REPO=' + re.escape(ABS) + r'\s*$', ln) and var == 'REPO':
            continue                                  # replaced by the resolver line
        code, sep, com = ln.partition(' #')
        code = re.sub(r'(^|[\s=;(])cd ' + re.escape(ABS) + r'(?=\s|$|;|&)', r'\1cd "$' + var + '"', code)
        code = code.replace('"' + ABS, '"$' + var).replace(ABS, '$' + var).replace('/home/jgon/Downloads/', '$HOME/Downloads/')
        if '/home/jgon' in code:
            manual.append((f, len(out) + 1, ln[:120]))
        out.append(code + sep + (comment_fix(com) if sep else ''))
    # insert the resolver after the shebang and the leading comment block, before any command
    at = 0
    while at < len(out) and (out[at].startswith('#') or not out[at].strip()):
        at += 1
    uses = any(('$' + var) in ln or ('${' + var) in ln for ln in out)
    if uses:
        out.insert(at, SH_LINE.format(var=var).rstrip('\n'))
    return '\n'.join(out), n, var if uses else '(none)'


JS_FN_TS = '''function repo(): string {   // the project root: the nearest .mrmas-root above the cwd (phase 1; this tool can run bundled from scratch)
  for (let d = process.cwd(); ; d = path.dirname(d)) {
    if (fs.existsSync(path.join(d, '.mrmas-root'))) return d;
    if (d === path.dirname(d)) throw new Error('MR. MAS: no .mrmas-root above the cwd; set MRMAS_ROOT');
  }
}'''
JS_FN_MJS = '''function repo() {   // the project root: the nearest .mrmas-root above this script or the cwd (phase 1)
  for (const start of [path.dirname(new URL(import.meta.url).pathname), process.cwd()]) {
    for (let d = start; ; d = path.dirname(d)) {
      if (fs.existsSync(path.join(d, '.mrmas-root'))) return d;
      if (d === path.dirname(d)) break;
    }
  }
  throw new Error('MR. MAS: no .mrmas-root above this script or the cwd; set MRMAS_ROOT');
}'''


def js(f, text):
    out, n = [], 0
    for ln in text.split('\n'):
        if '/home/jgon' not in ln:
            out.append(ln); continue
        n += 1
        if re.match(r"^const REPO = '" + re.escape(ABS) + r"';\s*$", ln):
            out.append("const REPO = process.env.MRMAS_ROOT ?? repo();")
            out.append(JS_FN_MJS if f.endswith('.mjs') else JS_FN_TS)
        elif ln.lstrip().startswith('//'):
            out.append(ln.replace(ABS + '/', '"$REPO"/'))
        else:
            manual.append((f, len(out) + 1, ln[:120])); out.append(ln)
    return '\n'.join(out), n, 'REPO'


for f in files:
    text = open(f).read()
    ext = os.path.splitext(f)[1]
    fn = py if ext == '.py' else sh if ext == '.sh' else js
    new, n, var = fn(f, text)
    print(f'{f}: {n} sites, var {var}')
    if APPLY and new != text:
        open(f, 'w').write(new)
print(f'MANUAL ({len(manual)}):')
for m in manual:
    print('  ', *m)
