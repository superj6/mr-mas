# ops/workflows/: the workflow scripts, as they ran

These 25 files are the orchestration scripts (Claude workflow `*.js`) that drove the early passes: research, the
writers' room, design, the intro, casting, the Act Four rounds, the style tests and more. They were copied here from
`.backups/` (ignored; it also holds the show tarball) in reorg phase 0, 2026-09-29, after a secret scan: no line holds
an API key value or a credential-shaped string.

- **They are records.** They say what each pass was asked to do and in what order. Nothing runs them automatically.
- **They are never rewritten.** `ops/orgmove.py` skips `ops/`, so paths inside them are the paths of the day they ran
  (for example `out/jumps/`, `out/intro/`, `audio/intro-mix/`, and the absolute `/home/jgon/project/art/mrmas`).
- **To re-run one**, copy it outside `ops/`, translate its old paths with the move tables in
  `docs/ORGANIZATION-PLAN.md` §4 and Appendix A (or run `ops/orgmove.py plan` on the copy and apply the diff by hand),
  and replace the absolute root with the repo you cloned.
- **Live templates:** the lead keeps no other copy in the repo. Later passes (the v3–v3.5 Ep1 production) ran from
  briefs in the session, and their records are the READMEs and production docs beside their work
  (`show/episodes/ep01/production/full-v3/`).
