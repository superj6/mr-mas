#!/usr/bin/env python3
"""orgmove.py v2: move folders by a manifest and rewrite the references to them (docs/ORGANIZATION-PLAN.md §7).

  MRMAS_ROOT=<repo> python3 orgmove.py plan  phaseN.tsv [phaseN.ok.tsv]  # dry run: diff, then the MANUAL lists
  MRMAS_ROOT=<repo> python3 orgmove.py apply phaseN.tsv                  # rewrite, move, write phaseN.done.tsv
  MRMAS_ROOT=<repo> python3 orgmove.py frag  phaseN.tsv [phaseN.ok.tsv]  # check: exit 1 if anything is unreviewed
  MRMAS_ROOT=<repo> python3 orgmove.py undo  phaseN.done.tsv

Manifest: one "old<TAB>new" per line, repo-relative, '#' comments. git mv when the source holds tracked files
(ignored and untracked files travel with the directory), plain os.rename otherwise. The destination must not exist.

Rewritten automatically (text files only, never the SKIP list, never a file whose new home is under history/):
  1. whole path strings: old/... -> new/... at a boundary (repo-relative, ../ studio-cwd and absolute forms);
  2. Markdown links and TS/JS relative imports, resolved from the file's old location, re-relativized from its new one;
  3. paths joined onto a variable whose value can be worked out statically:
       Python  os.path.join(BASE, 'a', 'b/c'), BASE / 'a', f'{BASE}/a/b', j('a/b') with j = lambda *p: join(BASE, *p)
       shell   $BASE/a/b and ${BASE}/a/b, also inside ${X:-$BASE/a/b}
       TS/JS   path.join(BASE, 'a'), path.resolve(BASE, 'a'), `${BASE}/a`, BASE + '/a'
     BASE is traced through assignments, sibling-module imports (from mixlib import *), sys.path inserts, __file__,
     $0/BASH_SOURCE, import.meta.url, the old /home/jgon/project/art/mrmas constant and the phase 1 .mrmas-root lookup.
     It is evaluated at the file's old and new locations; the joined path is mapped through the manifest and the string
     parts are replaced by one repo-style string. '..' parts are recomputed for code that moves to a new depth.
Listed for a person, never rewritten (the MANUAL lists):
  DEPTH     a variable that points somewhere else once its file moves (dirname chains, a file moved alone)
  ESCAPES   a joined path whose new target leaves its base variable
  COMPOSED  a name built at run time beside a moved file: join(OUT, f"act4-mix-{v}.wav")
  FRAGMENT  any other code or data line that still names a moved path by a fragment: 'intro-sfx/x', "'out', 'intro'",
            join(ROOT, "retired"), $ROOT/out/range with an unknown ROOT, shots-locked-{v}
A reviewed false positive goes in phaseN.ok.tsv as "file<TAB>stripped line text<TAB>reason"; it is then not reported.
"""
import ast, bisect, difflib, os, re, subprocess, sys

ROOT = os.environ.get('MRMAS_ROOT') or os.getcwd()
ABS = sorted({os.path.realpath(ROOT).rstrip('/'), '/home/jgon/project/art/mrmas'}, key=len, reverse=True)
TEXT = {'.py', '.ts', '.tsx', '.mjs', '.js', '.cjs', '.sh', '.json', '.md', '.html', '.txt', '.toml', '.cfg', ''}
CODE = ('.py', '.sh', '.ts', '.tsx', '.mjs', '.js', '.cjs')
SKIP = re.compile(r'^(\.git/|\.backups/|ops/|\.env|\.secrets/|.*node_modules/|.*\.venv[^/]*/|audio/samples/'
                  r'|studio/out/|.*/history/|.*/_reviews/|.*\.cues\.json$|.*/qa/.*\.json$|out/.*\.json$|.*\.log$'
                  r'|show/production/SHOWRUNNER-NOTES\.md$|docs/ORGANIZATION-PLAN\.md$|studio/package-lock\.json$'
                  r'|studio/src/reel/data/)')
B = r'(?:^|(?<=[\s"\'`(\[=:,])|(?<=\.\./)|(?<=mrmas/))'
TOP = ('audio/', 'out/', 'show/', 'studio/', 'docs/', 'src/', 'ops/')
GENERIC = {'intro', 'reel', 'reels', 'dev', 'pixel', 'range', 'jumps', 'genvideo', 'animatic', 'mix', 'vocals', 'alt',
           'prev', 'moments', 'tools', 'data', 'src', 'out', 'audio', 'show', 'studio', 'entry.tsx',
           'review.tsx', 'stills.mjs', 'scripts', 'sfx', 'vox', 'history', 'season', 'lookdev', 'looks', 'review'}


def git(*a):
    return subprocess.run(['git', *a], cwd=ROOT, capture_output=True, text=True)


def exists(p):
    return os.path.lexists(os.path.join(ROOT, p))


def load(path):
    rows = []
    for ln in open(path):
        ln = ln.rstrip('\n')
        if ln and not ln.startswith('#'):
            old, new = ln.split('\t')[:2]
            rows.append((old.strip('/'), new.strip('/')))
    return rows


def mapper(rows):
    rows = sorted(rows, key=lambda r: -len(r[0]))            # longest old prefix wins
    def m(p):
        if p is None:
            return None
        p = os.path.normpath(p) if p else ''
        p = '' if p == '.' else p
        for old, new in rows:
            if p == old or p.startswith(old + '/'):
                return new + p[len(old):]
        return p
    return m


def aliases(rows):
    """old -> new, plus the studio-cwd form (src/... for studio/src/...) that render commands use."""
    a = {}
    for old, new in rows:
        a[old] = new
        if old.startswith('studio/') and new.startswith('studio/'):
            a[old[7:]] = new[7:]
    return a


def rows_old(al):                                            # the manifest's own old paths (not the src/ aliases)
    return {k for k in al if not (k.startswith('src/') and 'studio/' + k in al)}


def literal(rows):
    keys = sorted(aliases(rows), key=len, reverse=True)      # longest first, single pass: no chained rewrites
    # a '.' ends a path only at a sentence end, not before an extension: audio/mix.py is not audio/mix (2026-09-29)
    return re.compile(B + '(?:' + '|'.join(map(re.escape, keys)) + r')(?=[/\s"\'`),\]:;]|\.(?![\w-])|$)', re.M)


# ---------------------------------------------------------------- repo-relative path arithmetic ('' is the root)
def absrel(p):
    for a in ABS:
        if p in (a, a + '/'):
            return ''
        if p.startswith(a + '/'):
            return pj('', p[len(a) + 1:])
    return None


def pj(base, *parts):
    if base is None:
        return None
    segs = base.split('/') if base else []
    for part in parts:
        if part is None:
            return None
        if part.startswith('/'):
            r = absrel(part)
            if r is None:
                return None
            segs = r.split('/') if r else []
            continue
        for s in part.split('/'):
            if s in ('', '.'):
                continue
            if s == '..':
                if not segs:
                    return None
                segs.pop()
            else:
                segs.append(s)
    return '/'.join(segs)


def dirn(p):
    if p is None or p == '':
        return None
    return p.rsplit('/', 1)[0] if '/' in p else ''


def relp(target, base):
    r = os.path.relpath('/' + target, '/' + base)
    return '.' if r == '.' else r


class Ctx:
    def __init__(self, rows):
        self.rows, self.m = rows, mapper(rows)
        done = [(o, n) for o, n in rows if not exists(o) and exists(n)]
        self.inv = mapper([(n, o) for o, n in done])
        self.files = {}                                       # path -> analyzed file (also used for imports)

    def locs(self, f):                                        # (old location, new location) of a file as it is now
        o = self.inv(f)
        return (o, f) if o != f else (f, self.m(f))

    def site(self, bo, bn, comps, here):
        """A path joined onto a base known at the old (bo) and new (bn) location. -> (status, target, new text)."""
        old_full = pj(bo, *comps)
        if old_full is None or bn is None:
            return ('none', None, None)
        target = self.m(old_full)
        intended = bn if here else self.m(bo)                 # a file-relative base follows its file; a root does not
        if pj(intended, *comps) == target:
            return ('ok', target, None)
        r = relp(target, intended)
        dotdot = any(s == '..' for c in comps for s in c.split('/'))
        if r.startswith('..') and not dotdot and not here:
            return ('escape', target, r)
        return ('edit', target, r)

    def value_after(self, bo, bn, comps, here):               # a joined value once this tool's own edits are made
        st = self.site(bo, bn, comps, here)
        ok = here or bn == self.m(bo)
        return self.m(pj(bo, *comps)) if st[0] in ('ok', 'edit') and ok else pj(bn, *comps)

    def composed(self, d, prefix):                            # moved files in folder d whose name starts with prefix
        if d is None or not prefix:
            return []
        return [o for o, _ in self.rows if dirn(o) == d and o.rsplit('/', 1)[-1].startswith(prefix)]


class Src:
    """One code file: base-variable analysis -> edits, protected spans and MANUAL findings."""
    def __init__(self, cx, f, text):
        self.cx, self.f, self.text = cx, f, text
        self.old, self.new = cx.locs(f)
        self.lines = text.split('\n')
        self.starts = [0]
        for ln in self.lines:
            self.starts.append(self.starts[-1] + len(ln) + 1)
        self.edits, self.protect, self.findings = [], [], []
        self.env, self.broken = {}, set()

    def here(self, pair):
        return pair[0] == dirn(self.old) and pair[1] == dirn(self.new)

    def note(self, kind, line, msg):
        self.findings.append((kind, self.f, line, self.lines[line - 1].strip(), msg))

    def depth(self, name, pair, refs, line):
        vo, vn = pair
        if vo is None or self.here(pair) or vn == self.cx.m(vo):
            self.broken.discard(name)
            return
        self.broken.add(name)
        if not any(r in self.broken for r in refs):
            self.note('DEPTH', line, f'{name} is {vo or "the repo root"} now but {vn if vn is not None else "outside the repo"}'
                                     f' after the move; make it {self.cx.m(vo) or "the repo root"} (phase 1 REPO)')

    def site_edit(self, a, b, pair, comps, quote, line, suffix='', lead='', prefix=''):
        st = self.cx.site(pair[0], pair[1], comps, self.here(pair))
        if st[0] == 'none':
            return
        self.protect.append((a, b))
        if st[0] == 'edit':
            self.edits.append((a, b, prefix + quote + lead + st[2] + suffix + quote))
        elif st[0] == 'escape':
            self.note('ESCAPES', line, f'now {st[1]}, which is outside this base ({st[2]}); rewrite the base')


# ---------------------------------------------------------------- Python
IDENT = {'os.path.abspath', 'abspath', 'os.path.realpath', 'realpath', 'os.path.normpath', 'normpath', 'str',
         'os.fspath', 'Path', 'pathlib.Path', 'PurePath', 'PosixPath'}
DIRN = {'os.path.dirname', 'dirname', 'osp.dirname', 'path.dirname'}
JOIN = {'os.path.join', 'path.join', 'join', 'osp.join', 'posixpath.join'}
ENVGET = {'os.environ.get', 'os.getenv', 'environ.get', 'getenv'}


def dotted(n):
    if isinstance(n, ast.Name):
        return n.id
    if isinstance(n, ast.Attribute):
        d = dotted(n.value)
        return d and d + '.' + n.attr
    return None


def sconst(n):
    return isinstance(n, ast.Constant) and isinstance(n.value, str)


class Py(Src):
    def __init__(self, cx, f, text):
        super().__init__(cx, f, text)
        self.search = [dirn(f)]
        self.tree = ast.parse(text)
        deferred = []
        self.block(self.tree.body, self.env, deferred)
        while deferred:
            fn, env = deferred.pop(0), dict(self.env)
            if isinstance(fn, (ast.FunctionDef, ast.AsyncFunctionDef)):
                a = fn.args
                for x in a.posonlyargs + a.args + a.kwonlyargs + [a.vararg, a.kwarg]:
                    if x is not None:
                        env[x.arg] = None
            self.block(fn.body, env, deferred)

    def off(self, line, col):                                 # ast columns are UTF-8 byte offsets
        s = self.lines[line - 1].encode('utf-8', 'surrogateescape')[:col].decode('utf-8', 'surrogateescape')
        return self.starts[line - 1] + len(s)

    def path(self, n, env):
        v = self.ev(n, env)
        return v if v and v[0] == 'p' else None

    def ev(self, n, env):
        """-> ('p', old, new) a repo path, ('j', pair) a joiner, ('m', env) a module, or None."""
        if sconst(n):                                         # the literal pass rewrites an absolute constant
            r = absrel(n.value) if n.value.startswith('/') else None
            return ('p', r, self.cx.m(r)) if r is not None else None
        if isinstance(n, ast.Name):
            return ('p', self.old, self.new) if n.id == '__file__' else env.get(n.id)
        if isinstance(n, ast.Attribute):
            if n.attr == 'parent':
                v = self.path(n.value, env)
                return v and ('p', dirn(v[1]), dirn(v[2]))
            v = self.ev(n.value, env)
            return v[1].get(n.attr) if v and v[0] == 'm' else None
        if isinstance(n, ast.Subscript) and isinstance(n.value, ast.Attribute) and n.value.attr == 'parents' \
                and isinstance(n.slice, ast.Constant) and isinstance(n.slice.value, int):
            v = self.path(n.value.value, env)
            if v:
                vo, vn = v[1], v[2]
                for _ in range(n.slice.value + 1):
                    vo, vn = dirn(vo), dirn(vn)
                return ('p', vo, vn)
            return None
        if isinstance(n, ast.BoolOp) and isinstance(n.op, ast.Or):
            for v in n.values:
                if isinstance(v, ast.Call) and dotted(v.func) in ENVGET and len(v.args) < 2:
                    continue                                  # os.environ.get('MRMAS_ROOT') or ...: an override hook
                if isinstance(v, ast.Subscript) and dotted(v.value) == 'os.environ':
                    continue
                r = self.ev(v, env)
                if r:
                    return r
            return None
        if isinstance(n, ast.JoinedStr):
            return self.fstr(n, env, record=False)
        if isinstance(n, (ast.Call, ast.BinOp)):
            jp = self.joinparts(n, env)
            if jp:
                base, args = jp
                if base and all(sconst(a) for a in args):
                    comps = [a.value.lstrip('/') if isinstance(n, ast.BinOp) and isinstance(n.op, ast.Add) else a.value
                             for a in args]
                    return ('p', pj(base[0], *comps), self.cx.value_after(base[0], base[1], comps, self.here(base)))
                return None
        if isinstance(n, ast.Call):
            d = dotted(n.func)
            if d == '_repo':
                return ('p', '', '')
            if d in ENVGET:
                return self.ev(n.args[1], env) if len(n.args) > 1 else None
            if d in DIRN and n.args:
                v = self.path(n.args[0], env)
                return v and ('p', dirn(v[1]), dirn(v[2]))
            if d in IDENT and len(n.args) == 1:
                return self.ev(n.args[0], env)
            if isinstance(n.func, ast.Attribute) and n.func.attr in ('resolve', 'absolute') and not n.args:
                return self.ev(n.func.value, env)
        return None

    def joinparts(self, n, env):
        """join-like node -> (base value, argument nodes after the base), else None."""
        if isinstance(n, ast.Call):
            d = dotted(n.func)
            if d in JOIN and n.args:
                b = self.path(n.args[0], env)
                return (b[1:], n.args[1:]) if b else None
            v = env.get(d) if d else None
            if v and v[0] == 'j':
                return (v[1], n.args)
            if isinstance(n.func, ast.Attribute) and n.func.attr == 'joinpath':
                b = self.path(n.func.value, env)
                return (b[1:], n.args) if b else None
        if isinstance(n, ast.BinOp) and isinstance(n.op, (ast.Div, ast.Add)):
            chain, x = [], n
            while isinstance(x, ast.BinOp) and isinstance(x.op, type(n.op)):
                chain.insert(0, x.right)
                x = x.left
            b = self.path(x, env)
            if not b:
                return None
            if isinstance(n.op, ast.Add):                     # BASE + '/a/b' (string concatenation)
                if not (chain and sconst(chain[0]) and chain[0].value.startswith('/')):
                    return None
            return (b[1:], chain)
        return None

    def rec_join(self, n, env):
        jp = self.joinparts(n, env)
        if not jp:
            return
        base, args = jp
        comps = []
        for a in args:
            if not sconst(a):
                break
            comps.append(a)
        line = n.lineno
        if comps:
            vals = [c.value.lstrip('/') if isinstance(n, ast.BinOp) and isinstance(n.op, ast.Add) else c.value
                    for c in comps]
            a0, b0 = self.off(comps[0].lineno, comps[0].col_offset), self.off(comps[-1].end_lineno, comps[-1].end_col_offset)
            seg = self.text[a0:self.off(comps[0].end_lineno, comps[0].end_col_offset)]
            mo = re.match(r'([rRuU]?)(\'\'\'|"""|\'|")', seg)
            q = mo.group(2) if mo else "'"
            lead = '/' if isinstance(n, ast.BinOp) and isinstance(n.op, ast.Add) else ''
            suffix = '/' if comps[-1].value.endswith('/') else ''
            self.site_edit(a0, b0, base, vals, q, line, suffix, lead, mo.group(1) if mo else '')
        rest = args[len(comps):]
        if rest:
            d = pj(base[0], *[c.value for c in comps])
            x = rest[0]
            pre = None
            if isinstance(x, ast.JoinedStr) and x.values and sconst(x.values[0]):
                pre = x.values[0].value
            elif isinstance(x, ast.BinOp) and isinstance(x.op, ast.Add) and sconst(x.left):
                pre = x.left.value
            if pre:
                if '/' in pre:
                    d, pre = pj(d, pre.rsplit('/', 1)[0]), pre.rsplit('/', 1)[1]
                for o in self.cx.composed(d, pre):
                    self.note('COMPOSED', line, f'a name built at run time in {d} can be {o}, which this phase moves')

    def fstr(self, n, env, record=True):
        v = n.values
        if not (len(v) >= 2 and isinstance(v[0], ast.FormattedValue) and sconst(v[1]) and v[1].value.startswith('/')):
            return None
        base = self.path(v[0].value, env)
        if not base:
            return None
        base = base[1:]
        mo = re.match(r'/([\w.@+,=~-]+(?:/[\w.@+,=~-]+)*)?(/?)', v[1].value)
        segs = mo.group(1).split('/') if mo.group(1) else []
        whole = mo.end() == len(v[1].value)
        partial = segs.pop() if whole and len(v) > 2 and not mo.group(2) and segs else None
        if not record:
            if len(v) == 2 and whole:
                return ('p', pj(base[0], *segs), self.cx.value_after(base[0], base[1], ['/'.join(segs)], self.here(base)))
            return None
        if segs:
            a, b = self.off(n.lineno, n.col_offset), self.off(n.end_lineno, n.end_col_offset)
            vsrc = ast.get_source_segment(self.text, v[0].value) or ''
            pat = re.compile(r'\{\s*' + re.escape(vsrc) + r'\s*(?:![rsa])?(?::[^}]*)?\}/(' + re.escape('/'.join(segs))
                             + r')(?=[/{\'"]|$)')
            hit = pat.search(self.text, a, b)
            if hit:
                self.site_edit(hit.start(1), hit.end(1), base, ['/'.join(segs)], '', n.lineno)
        if partial:
            for o in self.cx.composed(pj(base[0], *segs), partial):
                self.note('COMPOSED', n.lineno, f'a name built at run time can be {o}, which this phase moves')

    def module(self, name):
        for d in self.search:
            p = pj(d, name + '.py') if d is not None else None
            if p and os.path.isfile(os.path.join(ROOT, p)) and p != self.f:
                if p not in self.cx.files:
                    self.cx.files[p] = None                   # guard against import cycles
                    try:
                        self.cx.files[p] = Py(self.cx, p, open(os.path.join(ROOT, p), encoding='utf-8',
                                                               errors='surrogateescape').read())
                    except (SyntaxError, ValueError):
                        pass
                mod = self.cx.files[p]
                return mod.env if isinstance(mod, Py) else None
        return None

    def scan(self, node, env):
        inner = set()
        for n in ast.walk(node):
            if id(n) in inner:
                continue
            if isinstance(n, ast.BinOp):
                x = n.left
                while isinstance(x, ast.BinOp) and isinstance(x.op, type(n.op)):
                    inner.add(id(x))
                    x = x.left
            if isinstance(n, (ast.Call, ast.BinOp)):
                self.rec_join(n, env)
            if isinstance(n, ast.JoinedStr):
                self.fstr(n, env)
            if isinstance(n, ast.Call) and dotted(n.func) in ('sys.path.insert', 'sys.path.append') and n.args:
                p = self.path(n.args[-1], env)
                if p:
                    self.search.append(p[1] if exists(p[1] or '.') else self.cx.m(p[1]))

    def assign(self, st, env):
        if isinstance(st, (ast.Import, ast.ImportFrom)):
            for a in st.names:
                if isinstance(st, ast.ImportFrom):
                    mod = self.module(st.module) if st.level == 0 and st.module and '.' not in st.module else None
                    if a.name == '*':
                        env.update({k: v for k, v in (mod or {}).items() if not k.startswith('_')})
                    else:
                        env[a.asname or a.name] = (mod or {}).get(a.name)
                elif '.' not in a.name:
                    mod = self.module(a.name)
                    env[a.asname or a.name] = ('m', mod) if mod is not None else None
            return
        targets, value = [], None
        if isinstance(st, ast.Assign):
            targets, value = st.targets, st.value
        elif isinstance(st, ast.AnnAssign):
            targets, value = [st.target], st.value
        elif isinstance(st, (ast.AugAssign, ast.For, ast.AsyncFor)):
            targets = [st.target]
        elif isinstance(st, (ast.With, ast.AsyncWith)):
            targets = [i.optional_vars for i in st.items if i.optional_vars is not None]
        for t in targets:
            if isinstance(t, ast.Name) and value is not None:
                v = None
                if isinstance(value, ast.Lambda) and value.args.vararg and isinstance(value.body, ast.Call) \
                        and dotted(value.body.func) in JOIN and value.body.args:
                    b = self.path(value.body.args[0], env)
                    v = ('j', (b[1], b[2])) if b else None
                else:
                    v = self.ev(value, env)
                    if v and v[0] == 'p':
                        refs = {x.id for x in ast.walk(value) if isinstance(x, ast.Name) and x.id != '__file__'}
                        self.depth(t.id, (v[1], v[2]), refs, st.lineno)
                env[t.id] = v
            else:
                for x in ast.walk(t):
                    if isinstance(x, ast.Name):
                        env[x.id] = None

    def block(self, stmts, env, deferred):
        for st in stmts:
            if isinstance(st, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                if isinstance(st, ast.FunctionDef) and st.args.vararg and len(st.body) == 1 \
                        and isinstance(st.body[0], ast.Return) and isinstance(st.body[0].value, ast.Call) \
                        and dotted(st.body[0].value.func) in JOIN and st.body[0].value.args:
                    b = self.path(st.body[0].value.args[0], env)  # def j(*p): return os.path.join(BASE, *p)
                    env[st.name] = ('j', (b[1], b[2])) if b else None
                else:
                    env[st.name] = None
                deferred.append(st)
                continue
            heads = {ast.If: ['test'], ast.While: ['test'], ast.For: ['iter'], ast.AsyncFor: ['iter'],
                     ast.With: ['items'], ast.AsyncWith: ['items'], ast.Try: []}
            kind = next((k for k in heads if isinstance(st, k)), None)
            if kind is None:
                self.scan(st, env)
            else:
                for h in heads[kind]:
                    x = getattr(st, h)
                    for y in (x if isinstance(x, list) else [x]):
                        self.scan(y, env)
            self.assign(st, env)
            for blk in ('body', 'orelse', 'finalbody'):
                if kind is not None and hasattr(st, blk):
                    self.block(getattr(st, blk), env, deferred)
            for h in getattr(st, 'handlers', []) if kind is ast.Try else []:
                self.block(h.body, env, deferred)


# ---------------------------------------------------------------- shell
SH_SET = re.compile(r'^\s*(?:export\s+|local\s+|readonly\s+|declare\s+(?:-\w+\s+)?)?([A-Za-z_]\w*)=(.*?)\s*(?:\s#.*)?$')
SH_USE = re.compile(r'\$(?:\{([A-Za-z_]\w*)\}|([A-Za-z_]\w*))(/[\w.@+,=~/-]*)')
SH_HERE = r'\$\(\s*dirname\s+"?\$(?:\{BASH_SOURCE(?:\[0\])?\}|BASH_SOURCE|0|\{0\})"?\s*\)'


class Sh(Src):
    def __init__(self, cx, f, text):
        super().__init__(cx, f, text)
        for i, ln in enumerate(self.lines, 1):
            if ln.lstrip().startswith('#'):
                continue
            self.uses(ln, i)
            mo = SH_SET.match(ln)
            if mo:
                name, rhs = mo.group(1), mo.group(2)
                vo = self.val(rhs, 0)
                vn = self.val(rhs, 1)
                refs = set(re.findall(r'\$\{?([A-Za-z_]\w*)', rhs)) - {'BASH_SOURCE', 'MRMAS_ROOT'}
                plain = re.fullmatch(r'"?(?:\$\{\w+:-)?"?\$\{?(\w+)\}?(/[\w.@+,=~/-]*)?"?\}?"?', rhs)
                if vo is not None and plain and plain.group(1) in self.env and self.env[plain.group(1)]:
                    b = self.env[plain.group(1)]              # X=$BASE/a/b: the site edit makes it right
                    vn = self.cx.value_after(b[0], b[1], [(plain.group(2) or '').lstrip('/')], self.here(b))
                self.depth(name, (vo, vn), refs, i)
                self.env[name] = (vo, vn) if vo is not None else None

    def val(self, v, k):
        v = v.strip()
        if '.mrmas-root' in v or re.fullmatch(r'"?\$\(\s*git\s+rev-parse\s+--show-toplevel\s*\)"?', v):
            return ''
        mo = re.fullmatch(r'"?\$\{[A-Za-z_]\w*:?-(.*)\}"?', v)
        if mo:
            return self.val(mo.group(1), k)
        loc = (self.old, self.new)[k]
        mo = re.fullmatch(r'"?\$\(\s*cd\s+"?(.*?)"?\s*&&\s*pwd\s*\)"?', v)
        if mo:
            inner = mo.group(1)
            h = re.fullmatch(r'"?' + SH_HERE + r'"?(/[^"\s]*)?', inner)
            if h:
                return pj(dirn(loc), (h.group(1) or '').lstrip('/'))
            return self.val(inner, k) if inner.startswith(('$', '"$', '/')) else None
        h = re.fullmatch(r'"?' + SH_HERE + r'"?(/[^"\s]*)?"?', v)
        if h:
            return pj(dirn(loc), (h.group(1) or '').lstrip('/'))
        mo = re.fullmatch(r'"?\$(?:\{(\w+)\}|(\w+))(/[\w.@+,=~/-]*)?"?', v)
        if mo:
            b = self.env.get(mo.group(1) or mo.group(2))
            return pj(b[k], (mo.group(3) or '').lstrip('/')) if b else None
        mo = re.fullmatch(r'"?(/[\w.@+,=~/-]*)"?', v)
        r = absrel(mo.group(1)) if mo else None
        return self.cx.m(r) if k and r is not None else r

    def uses(self, ln, i):
        a = self.starts[i - 1]
        for mo in SH_USE.finditer(ln):
            b = self.env.get(mo.group(1) or mo.group(2))
            if not b:
                continue
            tail = mo.group(3)[1:]
            rest = ln[mo.end(3):mo.end(3) + 1]
            segs = [s for s in tail.split('/')]
            if rest in ('$', '{', '*', '?', '[') and segs and not tail.endswith('/'):
                segs.pop()                                    # "$MIX/intro-ep1-mix-$V.wav": drop the partial name
            path = '/'.join(s for s in segs if s)
            if not path:
                continue
            s0 = a + mo.start(3) + 1
            self.site_edit(s0, s0 + len(path), b, [path], '', i)


# ---------------------------------------------------------------- TS / JS
JS_SET = re.compile(r'^\s*(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=]+)?=\s*(.+?);?\s*(?://.*)?$')
JS_STR = r'(?:\'[^\'\n]*\'|"[^"\n]*")'
JS_JOIN = re.compile(r'path\.(?:join|resolve)\(\s*([A-Za-z_$][\w$]*)\s*((?:,\s*' + JS_STR + r')+)')
JS_TPL = re.compile(r'\$\{\s*([A-Za-z_$][\w$]*)\s*\}(/[\w.@+,=~/-]*)')
JS_PLUS = re.compile(r'\b([A-Za-z_$][\w$]*)\s*\+\s*([\'"])(/[\w.@+,=~/-]*)\2')
JS_HERE = re.compile(r'path\.dirname\(\s*(?:url\.)?fileURLToPath\(\s*import\.meta\.url\s*\)\s*\)|__dirname')


class Js(Src):
    def __init__(self, cx, f, text):
        super().__init__(cx, f, text)
        for i, ln in enumerate(self.lines, 1):
            if ln.lstrip().startswith(('//', '*', '/*')):
                continue
            self.uses(ln, i)
            mo = JS_SET.match(ln)
            if mo:
                name, rhs = mo.group(1), mo.group(2).strip()
                vo, vn = self.val(rhs, 0), self.val(rhs, 1)
                refs = set(re.findall(r'[A-Za-z_$][\w$]*', rhs)) & set(self.env)
                self.depth(name, (vo, vn), refs, i)
                self.env[name] = (vo, vn) if vo is not None else None

    def val(self, e, k):
        mo = re.fullmatch(r'process\.env\.\w+\s*(?:\?\?|\|\|)\s*(.+)', e)
        if mo:
            return self.val(mo.group(1).strip(), k)
        if JS_HERE.fullmatch(e):
            return dirn((self.old, self.new)[k])
        if re.fullmatch(r'_?repo\(\)', e):                     # the phase 1 marker lookup
            return ''
        mo = JS_JOIN.fullmatch(e[:-1]) if e.endswith(')') else None
        if mo and self.env.get(mo.group(1)):
            b, comps = self.env[mo.group(1)], [x[1:-1] for x in re.findall(JS_STR, mo.group(2))]
            return pj(b[0], *comps) if k == 0 else self.cx.value_after(b[0], b[1], comps, self.here(b))
        mo = re.fullmatch(r'`\$\{\s*([A-Za-z_$][\w$]*)\s*\}(/[\w.@+,=~/-]*)`', e) or \
            re.fullmatch(r'([A-Za-z_$][\w$]*)\s*\+\s*[\'"](/[\w.@+,=~/-]*)[\'"]', e)
        if mo and self.env.get(mo.group(1)):
            b, comps = self.env[mo.group(1)], [mo.group(2).lstrip('/')]
            return pj(b[0], *comps) if k == 0 else self.cx.value_after(b[0], b[1], comps, self.here(b))
        mo = re.fullmatch(r'[\'"`](/[\w.@+,=~/-]*)[\'"`]', e)
        r = absrel(mo.group(1)) if mo else None
        return self.cx.m(r) if k and r is not None else r

    def uses(self, ln, i):
        a = self.starts[i - 1]
        for mo in JS_JOIN.finditer(ln):
            b = self.env.get(mo.group(1))
            if b:
                strs = [x for x in re.finditer(JS_STR, mo.group(2))]
                comps = [x.group(0)[1:-1] for x in strs]
                s0, s1 = a + mo.start(2) + strs[0].start(), a + mo.start(2) + strs[-1].end()
                self.site_edit(s0, s1, b, comps, strs[0].group(0)[0], i)
        for rx in (JS_TPL, JS_PLUS):
            for mo in rx.finditer(ln):
                b = self.env.get(mo.group(1))
                if not b:
                    continue
                g = 3 if rx is JS_PLUS else 2
                tail = mo.group(g)[1:]
                segs = tail.split('/')
                if rx is JS_TPL and ln[mo.end(g):mo.end(g) + 2] == '${' and segs and not tail.endswith('/'):
                    segs.pop()
                path = '/'.join(s for s in segs if s)
                if path:
                    s0 = a + mo.start(g) + 1
                    self.site_edit(s0, s0 + len(path), b, [path], '', i)


# ---------------------------------------------------------------- fragments (run on the text after the rewrite)
def frag_patterns(rows):
    """(tag, kind, regex) per fragment of every old path; group 1..n marks the fragment itself."""
    E = r'(?=[/\'"`\s,;:)}\]]|$)'
    J = r'(?:join|resolve|joinpath)\((?:[^()\n]|\([^()\n]*\))*?,[ \t]*[\'"]'
    out = []
    for old in aliases(rows):
        c = old.split('/')
        for i in range(len(c)):
            tag, tail = old + ('\t' + c[i - 1] if i else ''), re.escape('/'.join(c[i:]))
            if i < len(c) - 1:                                # two or more parts: 'intro-sfx/x', dev/mcoldopen/orb.ts
                rx = r'(?:[\'"`/}]|^|\s)(' + tail + ')' + E
            elif re.search(r'[-_.]', c[-1]):                   # a leaf with punctuation: 'intro-sfx', "_reviews"
                rx = r'[\'"`/}](' + tail + ')' + E
            else:                                             # a plain word (alt, mix, retired, mcoldopen): only as a path
                rx = (r'(?:\}|\$\w+|\$\{\w+\})/(' + tail + ')' + E                 # $ROOT/reel, {AUDIO}/mix
                      + '|' + J + '(' + tail + r')(?:[\'"][ \t]*[,)]|/)'           # join(X, 'alt'), join(X, 'mix/a')
                      + r'|[\w)\'"\]][ \t]*/[ \t]*[\'"](' + tail + r')[\'"]')        # ROOT / 'mix'
                if c[-1] not in GENERIC:
                    rx += r'|[\'"`](' + tail + r')/'                  # 'retired/3.1', "mcoldopen/timeline.ts"
            out.append((tag, 'FRAGMENT', re.compile(rx, re.M)))
        for a, b in zip(c, c[1:]):                            # 'out', 'intro' and 'out' / 'intro'
            out.append((old, 'FRAGMENT', re.compile(r'[\'"](' + re.escape(a) + r')[\'"][ \t]*[,/][ \t]*[\'"]'
                                                    + re.escape(b) + r'[\'"]')))
        mo = re.match(r'^(.+?[-_])v\d+(?:\.\d+)?(?:\.\w+)*$', c[-1])
        if mo:                                                # f"shots-locked-{v}.json", `act4-mix-${v}.wav`
            out.append((old, 'COMPOSED', re.compile(r'[\'"`/](' + re.escape(mo.group(1)) + r')(?:\{|\$\{|[\'"`]\s*\+)')))
        if len(c) > 1:                                        # `studio/src/dev/${m}/timeline.ts`, f'{OUT}/{name}'
            par = re.escape('/'.join(c[:-1]))
            out.append((old, 'COMPOSED', re.compile(r'(?:[\'"`/}]|^|\s)(' + par + r')/(?:\$\{|\{[A-Za-z_]|[\'"`]\s*\+)', re.M)))
    return out


IMPORT_LINE = re.compile(r'^\s*(?:import|export)\b.*\bfrom\s*[\'"]|\brequire\(\s*[\'"]|^\s*import\s*[\'"]')


def fragments(f, text, protect, pats, keys, al):
    hits = []
    starts = [0]
    for ln in text.split('\n'):
        starts.append(starts[-1] + len(ln) + 1)
    lines = text.split('\n')
    for tag, kind, rx in pats:
        old, _, parent = tag.partition('\t')
        for mo in rx.finditer(text):
            g = next(i for i in range(1, (rx.groups or 0) + 1) if mo.group(i) is not None) if rx.groups else 0
            s, e = mo.span(g)
            if any(a <= s < b for a, b in protect):
                continue
            ln = bisect.bisect_right(starts, s) - 1
            line = lines[ln]
            if f.endswith(('.ts', '.tsx', '.mjs', '.js', '.cjs')) and IMPORT_LINE.search(line):
                continue
            a, b = s, e                                       # the whole token around the fragment
            while a > 0 and re.match(r'[\w.@+,=~/-]', text[a - 1]):
                a -= 1
            while b < len(text) and re.match(r'[\w.@+,=~/-]', text[b]):
                b += 1
            tok = text[a:b]
            var = a > 0 and text[a - 1] in '}$'
            if tok.startswith('/') and not var:
                if absrel(tok) is None:
                    continue                                  # /dev/null, /tmp/...: not a repo path
                tok = absrel(tok)
            while tok.startswith('../'):
                tok = tok[3:]
            if kind == 'FRAGMENT' and not var and tok.startswith(TOP) and not any(tok == k or tok.startswith(k + '/') for k in keys):
                continue                                      # a whole path to somewhere else that shares a name
            before = text[a:s].rstrip('/').rsplit('/', 1)[-1] if text[a:s].endswith('/') else None
            if parent and before and before not in ('.', '..', parent):
                continue                                      # render/alt is not intro-sfx/alt
            segs = [x for x in text[e + 1:b].split('/') if x] if text[e:e + 1] == '/' else []
            real = [('studio/' + x if x.startswith('src/') and x not in rows_old(al) else x) for x in (old, al[old])]
            if kind == 'FRAGMENT' and len(segs) >= 2 and not any(os.path.isdir(os.path.join(ROOT, r, segs[0])) for r in real):
                continue                                      # 'intro/sfx/x.wav' goes through no folder of out/intro
            hits.append((ln + 1, old, line.strip(), kind))
    return sorted(set(hits))


# ---------------------------------------------------------------- the rewrite of one file
LINK = re.compile(r'(\]\()([^)\s#]+)([^)]*\))')                          # [text](target "title")
IMPORT = re.compile(r'''((?:from|import|require\()\s*['"])(\.{1,2}/[^'"]+)(['"])''')


def candidates(cx):
    out = git('ls-files', '-co', '--exclude-standard').stdout.split('\n')
    return [f for f in out if f and os.path.splitext(f)[1] in TEXT and not SKIP.match(f)
            and not SKIP.match(cx.m(f)) and os.path.isfile(os.path.join(ROOT, f))]


def apply_edits(text, edits, protect):
    edits = sorted(set(edits))
    keep, last = [], -1
    for s, e, new in edits:
        if s >= last:
            keep.append((s, e, new))
            last = e
    def shift(p):
        return p + sum(len(n) - (e - s) for s, e, n in keep if e <= p)
    out, pos = [], 0
    for s, e, new in keep:
        out.append(text[pos:s])
        out.append(new)
        pos = e
    out.append(text[pos:])
    return ''.join(out), [(shift(a), shift(b)) for a, b in protect]


def rewrite(cx, f, text, rows, lit, al):
    newf = cx.m(f)
    src = None
    ext = os.path.splitext(f)[1]
    if ext in CODE:
        try:
            src = cx.files.get(f) or (Py if ext == '.py' else Sh if ext == '.sh' else Js)(cx, f, text)
            cx.files[f] = src
        except (SyntaxError, ValueError) as err:
            src = None
            print(f'# note: {f} does not parse ({err.__class__.__name__}); only the literal pass and the fragment scan ran')
    edits = list(src.edits) if src else []
    protect = list(src.protect) if src else []
    for mo in lit.finditer(text):                             # 1. literal path strings, one pass
        if not any(a < mo.end() and mo.start() < b for a, b in protect):
            edits.append((mo.start(), mo.end(), al[mo.group(0)]))
    text, protect = apply_edits(text, edits, protect)
    def rel(mo):                                              # 2. relative links and imports
        tgt = mo.group(2)
        if re.match(r'^[a-z]+:', tgt) or tgt.startswith('/'):
            return mo.group(0)
        abs_old = os.path.normpath(os.path.join(os.path.dirname(f), tgt))
        if abs_old.startswith('..'):
            return mo.group(0)
        ext2 = ''                                             # an import names 'x' for x.ts / x.tsx / x/index.ts
        if mo.re is IMPORT:
            ext2 = next((e for e in ('', '.ts', '.tsx', '.js', '.mjs', '/index.ts', '/index.tsx')
                         if os.path.isfile(os.path.join(ROOT, abs_old + e))), '')
        new_abs = cx.m(abs_old + ext2)
        new_abs = new_abs[:len(new_abs) - len(ext2)] if ext2 else new_abs
        if new_abs == abs_old and newf == f:
            return mo.group(0)                                # neither end moved: leave the text alone
        r = os.path.relpath(new_abs, os.path.dirname(newf) or '.')
        if tgt.endswith('/'):
            r += '/'
        if mo.re is IMPORT and not r.startswith('.'):
            r = './' + r
        return mo.group(1) + r + mo.group(3)
    mid = text
    if f.endswith('.md'):
        text = LINK.sub(rel, text)
    if f.endswith(('.ts', '.tsx', '.mjs', '.js', '.cjs')):
        text = IMPORT.sub(rel, text)
    return text, mid, protect, (src.findings if src else [])


def analyse(cx, rows, allow):
    lit, al, pats, keys = literal(rows), aliases(rows), frag_patterns(rows), list(aliases(rows))
    edits, manual, reviewed = {}, [], 0
    for f in candidates(cx):
        src = open(os.path.join(ROOT, f), encoding='utf-8', errors='surrogateescape').read()
        dst, mid, protect, found = rewrite(cx, f, src, rows, lit, al)
        if dst != src:
            edits[f] = (src, dst)
        items = list(found)
        if f.endswith(CODE):
            items += [(kind, f, ln, text, ('names ' if kind == 'FRAGMENT' else 'can build a name in the folder of ') + old)
                      for ln, old, text, kind in fragments(f, mid, protect, pats, keys, al)]
        elif f.endswith('.json'):                             # data: one line per file, allow-listed as "file<TAB>*"
            hits = fragments(f, mid, protect, pats, keys, al)
            if hits:
                olds = sorted({o for _, o, _, _ in hits})
                items.append(('FRAGMENT', f, hits[0][0], '*', f'{len(hits)} data lines name {", ".join(olds)} '
                              f'(a build record or relative path; regenerate it or fix it by hand)'))
        merged = {}
        for it in items:                                      # one line per file:line, naming every old path it hits
            k = (it[0], it[1], it[2])
            merged[k] = it if k not in merged else it[:4] + (merged[k][4] + ', ' + it[4].split(' ')[-1],)
        for it in merged.values():
            key = {(p, it[3]) for p in (f, cx.m(f), cx.inv(f))}
            if key & allow:
                reviewed += 1
            else:
                manual.append(it)
    return edits, manual, reviewed


def main(cmd, manifest, allow_file=None):
    rows = load(manifest)
    assert os.path.isdir(os.path.join(ROOT, '.git')), f'ROOT={ROOT} is not the project root; set MRMAS_ROOT'
    if cmd == 'undo':
        for old, new in reversed(rows):
            if exists(old) and not exists(new):
                print('already undone', old)
                continue
            os.makedirs(os.path.dirname(os.path.join(ROOT, old)) or ROOT, exist_ok=True)
            os.rename(os.path.join(ROOT, new), os.path.join(ROOT, old))
            print('undo', new, '->', old)
            try:                                              # drop the parents apply created, if now empty
                os.removedirs(os.path.dirname(os.path.join(ROOT, new)))
            except OSError:
                pass                                          # stops at the first non-empty parent
        print('now restore text: git reset --hard <pre-phase commit>')
        return 0
    cx = Ctx(rows)
    for old, new in rows:
        if cmd == 'apply':
            assert os.path.exists(os.path.join(ROOT, old)), f'missing source {old}'
            assert not os.path.exists(os.path.join(ROOT, new)), f'destination exists {new}'
        elif not exists(old):
            print(f'# note: {old} is already moved; this lists only leftovers' if exists(new) else
                  f'# WARNING: neither {old} nor {new} exists (deleted?); drop the row, apply will refuse')
        elif exists(new):
            print(f'# WARNING: destination exists {new}; apply will refuse')
    allow = set()
    if allow_file and os.path.exists(allow_file):
        for ln in open(allow_file):
            if ln.strip() and not ln.startswith('#') and '\t' in ln:
                p, t = ln.rstrip('\n').split('\t')[:2]
                allow.add((p, t.strip()))
    edits, manual, reviewed = analyse(cx, rows, allow)
    if cmd == 'plan':
        for f, (src, dst) in edits.items():
            sys.stdout.writelines(difflib.unified_diff(src.splitlines(True), dst.splitlines(True),
                                                       'a/' + f, 'b/' + cx.m(f), n=0))
    print(f'# {len(rows)} moves, {len(edits)} files rewritten')
    for kind in ('DEPTH', 'ESCAPES', 'COMPOSED', 'FRAGMENT'):
        items = [x for x in manual if x[0] == kind]
        print(f'# MANUAL {kind} ({len(items)}):')
        for _, f, ln, text, msg in sorted(set(items)):
            print(f'{f}:{ln}: {text[:160]}    <- {msg}')
    print(f'# reviewed (in {allow_file or "no ok-list"}): {reviewed}')
    if cmd == 'frag':
        return 1 if manual or edits else 0
    if cmd != 'apply':
        return 0
    for f, (_, dst) in edits.items():                         # rewrite in place first (new inode), then move
        p = os.path.join(ROOT, f)
        tmp = p + '.orgmove-tmp'
        with open(tmp, 'w', encoding='utf-8', errors='surrogateescape') as fh:
            fh.write(dst)
        os.chmod(tmp, os.stat(p).st_mode)
        os.replace(tmp, p)
    done = open(manifest.replace('.tsv', '') + '.done.tsv', 'w', buffering=1)   # line-buffered undo log
    for old, new in rows:
        os.makedirs(os.path.dirname(os.path.join(ROOT, new)) or ROOT, exist_ok=True)
        tracked = git('ls-files', '--', old).stdout.strip()
        if tracked:
            r = git('mv', old, new)
            assert r.returncode == 0, r.stderr
        else:
            os.rename(os.path.join(ROOT, old), os.path.join(ROOT, new))
        done.write(f'{old}\t{new}\n')
        print('moved', old, '->', new, '(git mv)' if tracked else '(mv)')
    git('add', '-u', '--', *[cx.m(f) for f in edits], *[n for _, n in rows])   # stage edits + renames (tracked only)
    return 0


if __name__ == '__main__':
    sys.exit(main(*sys.argv[1:4]))
