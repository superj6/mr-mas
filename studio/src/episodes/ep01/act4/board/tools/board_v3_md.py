"""Markdown writers for board 3 (shotlist-v3.md, chunks-v3.md). Called by board_v3.py; not run on its own."""
from collections import defaultdict

CLS_NAME = {'W': 'wide (incl. LOW room plates)', 'M': '[M] / [2S]', 'OTS': 'over-the-shoulder (incl. OTS-W)', 'MCU': 'frameless close-up (incl. ·PF, the 50/50, frame-in-frame, desk-level)',
            'CU': '[CU] Mas full frame', 'ECU': 'insert (hands, eyes, the iris, props, table overheads)', 'SW': 'screen wide (grid, list)', 'SC': 'screen close (pinned / two-up / half / single tile, phone, counter, macro, the floor POV)',
            'GS': 'blueprint sheet', 'GM': 'blueprint section', 'GD': 'blueprint detail', 'GFX': 'full-screen card', 'BOX': 'the deliberate boxed window'}


def esc(s):
    return str(s).replace('|', '\\|')


def write(doc, SHOTS, A, NEEDS, PROD, glen, tc):
    L = []
    w = L.append
    m, t, sh, ck = doc['meta'], doc['totals'], doc['shares'], doc['checks']
    dist = t['by_size_class']
    boxes = ck['deliberate_boxes']
    inworld = [s for s in SHOTS if s['size_class'] == 'SC' and s['face']]
    w(f"# MR. MAS · Ep1 · Act Four · THE BLIP, TOLD TWICE — shot list v3 (board 3, draft 3.2)")
    w('')
    w(f"*Storyboard / 1st AD · board 3 · from [script.md](../../script.md#act-four--the-blip-told-twice) Act Four **draft 3.2** (the tightening pass) and [tighten-changes.md](tighten-changes.md) (every open ruling at its default), framed to [pov-and-framing §4.7](../../../../bible/pov-and-framing.md#47-shot-variety-2026-09-25) and [framing-v3.md](framing-v3.md), 2026-09-25. Machine-readable twin: [shots-v3.json](shots-v3.json) (the JSON wins if the two ever disagree). Generator: `{m['generator']}`. Chunks: [chunks-v3.md](chunks-v3.md). Board 2 ([shotlist-v2.md](shotlist-v2.md), draft 3.1) is superseded.*")
    w('')
    w('> **The showrunner (binding):** "why is there so much empty silence in the animatic? the dialogue feels slow. i like the visuals otherwise. don\'t lengthen things out just for the sake of it. also, we don\'t need to have all scenes in the form of boxes for people talking, we can have more closeup or other angle zoom variety shots."')
    w('')
    w('## Read this first')
    w('')
    w(f"- **Length.** {t['frames']} f = **{t['length']}** · episode {t['episode_in']}–{t['episode_out']} · **{t['shots']} shots** · {len(doc['chunks'])} chunks. The 3.2 beat model is 5985 f (4:09.375, 114 cuts); this board is **{str(t['model_32']['delta_frames']).replace('-', '−')} f ({str(t['model_32']['delta_s']).replace('-', '−')} s)** against it. Nothing grew. The difference is conversations cut on the turn (§4.7.3 rule 8, the v3 default), frame-accurate at the cue sheet's overlaps, each block closed back onto the beat grid. Set-pieces, cards, posts and holds keep the writer's lengths. Lock v2 ran 10890 f (7:33.75) in 139 shots.")
    w(f"- **Boxes.** Boxed portrait windows: **{len(boxes)}** ({', '.join(boxes)}: the deliberate doorway `[P2]`, logged `BOX`) = **{sh['boxed_windows']['pct']}%** of the act ({sh['boxed_windows']['band']}); spoken lines in it: {sh['spoken_lines_in_a_box']['n']} (Alyi's post). Every other face in a box is one the world owns: {len(inworld)} in-world tile or screen shots (the pinned speaker view, the two-up, Gerg's tile, the half-frame tiles, the macro on Mada's tile), logged `[POV]`/`[SCR]`. Lock v2: 42 boxed shots, 27.3%, 29 of 45 lines.")
    w(f"- **Shot-size distribution** (by §4.7.3 size class, share of time): " + ' · '.join(f"{k} {v['shots']} shot{'s' if v['shots'] > 1 else ''} / {v['pct']}%" for k, v in dist.items() if v['shots']) + '.')
    w(f"- **Longest run of one size: {ck['longest_run']}** ({'; '.join(ck['longest_runs'])}). Runs of 3 or more: **{sh['runs_of_3plus']['n']}** (lock v2: 7).")
    w(f"- **Shares against §4.7.4:** `[MCU]` + `[CU]` **{sh['mcu_plus_cu']['pct']}%** ({sh['mcu_plus_cu']['band']}) · `[M]` + `[2S]` + `[OTS]` **{sh['m_2s_ots']['pct']}%** ({sh['m_2s_ots']['band']}) · faces and hands **{sh['faces_and_hands']['pct']}%** ({sh['faces_and_hands']['band']}) · `[W]` {sh['wides']['pct']}% ({sh['wides']['band']}) · screens {sh['screens']['pct']}% · `[GFX]` {sh['gfx']['pct']}% · inserts {sh['ecu']['pct']}%.")
    mv = ck['moves']
    w(f"- **Coverage and moves.** " + ' · '.join(f"{k} {v['n']} ({', '.join(v['shots'])})" for k, v in mv.items()) + f". Budgets: whips {ck['budgets']['whips']}, racks {ck['budgets']['racks']}, screen macros {ck['budgets']['macros']}, `[CU]` {ck['budgets']['cu']}, deliberate boxes {ck['budgets']['boxes']}. Pushes are cuts up the ladder: " + '; '.join(f"{a}, {b}" for a, b in ck['pushes']) + '. No move plays on a real line, post, card or must-read record.')
    w(f"- **Problems:** {'none' if not ck['problems'] else '; '.join(ck['problems'])}.")
    w("- **Audio is at TARGET.** Lines sit at their tighten-changes §2 target spans and cues; the 3.2 re-record hasn't landed (the scratch is the v2 take in `lines.json`). Re-sit each line on its take at the lock (±10%) and move a cut only with a note in `timing-v3`.")
    w("- **Board calls** a reviewer should look at first are in [Board calls](#board-calls): the PLAN split, the click macro, the avalanche's over-the-shoulder, the boardroom screen direction, and the turn cuts.")
    w('')
    w('## How to read this')
    w('')
    w('| Size class | Tags | Meaning |')
    w('|---|---|---|')
    tags_by_cls = defaultdict(set)
    for s in SHOTS: tags_by_cls[s['size_class']].add(s['tag'])
    for k, v in CLS_NAME.items():
        if k in tags_by_cls: w(f"| **{k}** | {' '.join('`' + esc(x) + '`' for x in sorted(tags_by_cls[k]))} | {v} |")
    w('')
    c = doc['conventions']
    for k in ('angle', 'move', 'entry', 'box', 'framing', 'framing_note', 'record_items'):
        w(f"- **{k}**: {c['fields_new_in_v3'][k]}")
    w(f"- **Change** codes against lock v2: " + ' · '.join(f"**{k}** {v}" for k, v in c['change'].items()) + '.')
    w(f"- **Logging:** " + ' '.join(c['logging']))
    w(f"- **Timing:** {c['timing']}")
    w(f"- **Moves:** {c['moves_rule']}")
    w("- **Screen direction:** Mas stays in the left third and is never flipped at portrait or `[CU]` scale (his silhouette may flip). Others face camera-left from the right third, except where a room's staging sets the line (the boardroom: NELEH left, facing right). Pass one has no Mas single of any size, and every screen there keeps a bezel edge.")
    w("- **Typed dialogue box:** none on close coverage (§4.7.3 rule 4, PROPOSED, the v3 default); it stays on wides, voices off picture or through a speaker, and posts. The subtitle track carries every line.")
    w('')
    w('## The act at a glance')
    w('')
    w('| Sc | Heading | Side | 3.2 printed | Boarded | Frames (model) | Δ | Shots | Temp score (TEMP) |')
    w('|---|---|---|---|---|---|---|---|---|')
    for s in doc['scenes']:
        w(f"| {s['id']} | {esc(s['title'])} | {s['side']} | {esc(s['printed_32'])} | {s['tc_in']}–{s['tc_out']} | {s['frames']} ({s['model_frames']}) | {str(s['delta_frames']).replace('-', '−') if s['delta_frames'] else '0'} f | {s['shots'][0]}–{s['shots'][-1]} ({len(s['shots'])}) | {esc(s['temp_score'])} |")
    w(f"| **Act** | | | 12:31–16:40 (4:09.4) | {t['episode_in']}–{t['episode_out']} | **{t['frames']}** (5985) | **{str(t['model_32']['delta_frames']).replace('-', '−')} f** | **{t['shots']}** | |")
    w('')
    w('## Shot-size distribution and shares')
    w('')
    w('| Size class | Shots | Frames | Seconds | Share |')
    w('|---|---|---|---|---|')
    for k, v in dist.items():
        if v['shots']: w(f"| {k}: {CLS_NAME[k]} | {v['shots']} | {v['frames']} | {v['seconds']} | {v['pct']}% |")
    w('')
    w('| shotSize | Shots | Share |')
    w('|---|---|---|')
    for k, v in t['by_shotSize'].items(): w(f"| {k} | {v['shots']} | {v['pct']}% |")
    w('')
    w('| §4.7.4 measure | Lock v2 | Board 3 | Band |')
    w('|---|---|---|---|')
    w(f"| Boxed windows (`BOX`) | 42 shots · 27.3% | {len(boxes)} shot · {sh['boxed_windows']['pct']}% | {sh['boxed_windows']['band']} |")
    w(f"| Spoken lines in a box | 29 of 45 | {sh['spoken_lines_in_a_box']['n']} | {sh['spoken_lines_in_a_box']['band']} |")
    w(f"| `[MCU]` + `[CU]` | 1.1% | {sh['mcu_plus_cu']['pct']}% | {sh['mcu_plus_cu']['band']} |")
    w(f"| `[M]` + `[2S]` + `[OTS]` | 9.8% | {sh['m_2s_ots']['pct']}% | {sh['m_2s_ots']['band']} |")
    w(f"| Runs of 3+ shots of one size | 7 | {sh['runs_of_3plus']['n']} (longest {ck['longest_run']}) | {'GREEN' if sh['runs_of_3plus']['n'] == 0 else 'RED'} |")
    w(f"| Faces and hands | 49.7% | {sh['faces_and_hands']['pct']}% | {sh['faces_and_hands']['band']} |")
    w(f"| `[W]` | 11.5% | {sh['wides']['pct']}% | {sh['wides']['band']} |")
    w('')
    w("- **`[MCU]` + `[CU]`** is measured per cut over the whole act. About 40% of Act Four is the record, THE PLAN and screens by design (the sanctioned AMBER on faces), which caps it.")
    w("- **Faces and hands** counts a video tile when it fills half the frame, and an overhead with a hand in it.")
    w('')
    w('## Checks')
    w('')
    w(f"- **Runs.** Pairs of one size: " + ', '.join(f"{r['size_class']} {r['first']}–{r['last']}" for r in ck['runs']) + '. No run reaches 3.')
    w(f"- **Two speakers in one setup** (rule 2 allows one question-and-answer pair when the frame's relation is the joke): " + '; '.join(f"{x['shot']} {x['size']} ({' / '.join(x['speakers'])})" for x in ck['two_speaker_setups']) + '. Every other change of speaker changes the setup.')
    w("- **The record plays dry and still:** every shot with a real line, post, card, stamp, meter, counter or (REPORTED) rail is `STILL (record)`; the soft layer never holds record text (27.23 keeps the rent meters sharp behind Mario).")
    w("- **The exit:** no Mas single in sc 27 (his voice on their speaker, his posts, a grainy figure on the security tile); every sc 27 screen keeps its bezel, the macro included.")
    w("- **V.O. clearances** (≥ 1 bar from the record, never overlapped): " + '; '.join(f"`{v['id']}` in {v['shot']}: {v['clear_before']} f after / {v['clear_after']} f before" for v in ck['vo_clearance']) + '.')
    w("- **Set-piece cadence:** every shot in THE PLAN, the falling tile and the avalanche is ≤ 2 bars with a size change at each cut; a face every ≤ 4 bars in the picture set-pieces (" + ', '.join(f"{g['shot']} after {g['frames_since_last_face']} f" for g in ck['set_piece_face_gaps']) + ').')
    for e in ck['exempt']: w(f"- **Exempt:** {e}.")
    w(f"- **Tails over 1 beat after the last word** (each is a read floor, a scripted hold, a rack or a staged action; THE EDITOR checks them at the lock): " + '; '.join(f"{x['shot']} {x['frames']} f ({x['why']})" for x in ck['tails_over_1_beat']) + '.')
    w(f"- **Off-grid cuts** (inside conversation blocks only; each block ends on the grid): {', '.join(ck['off_grid_cuts'])}.")
    w('')
    w('## Board calls')
    w('')
    for b in doc['board_calls']: w(f"- **{b['shot']}.** {b['call']}")
    w('')
    # ------------------------------------------------------------------ the shots
    for scn in doc['scenes']:
        w(f"## {scn['id']}. {scn['title']} · {scn['style']} · {scn['mode']} · side {scn['side']} · {scn['tc_in']}–{scn['tc_out']} · {scn['frames']} f (3.2: {scn['printed_32']})")
        w('')
        w(f"*{scn['side_note']}. Temp score: {scn['temp_score']}.*")
        w('')
        for s in [x for x in SHOTS if x['scene'] == scn['id']]:
            w(f"### {s['id']} · {s['shotSize']} `{esc(s['tag'])}` · {s['frames']} f ({s['grid']}) · {s['tc_in']}–{s['tc_out']} · {s['side']} · {s['chunk']} · {s['change']}")
            w('')
            w(f"- **Angle:** {s['angle']} · **Move:** {s['move']}" + (f" · **Entry:** {s['entry']}" if s['entry'] else '') + f" · **Template:** {s['framing']} · **Box:** {s['box']}")
            w(f"- **Change:** {s['change_note'] or '—'} *(model: {s['model_len']}; script: {s['script_len']})*")
            w(f"- **Room / view:** {s['room']}")
            if s['characters']: w(f"- **Characters:** {' · '.join(s['characters'])}")
            if s['action']: w(f"- **Action:** {' '.join(s['action'])}")
            for d in s['dialogue']:
                if d.get('voiced'):
                    extra = []
                    if d['prelap']: extra.append(f"pre-laps the cut {d['prelap']} f")
                    if d['crosses_cut']: extra.append(f"runs {d['crosses_cut']} f past the cut")
                    w(f"- **Line** `{d['id']}` {d['speaker']}: {d['text']} {d['tag']} · f{d['at']}–{d['end']} ({d['frames']} f, target {d['target_s']} s){' · ' + ', '.join(extra) if extra else ''} · {d['status']}")
                else:
                    w(f"- **Post** `{d['id']}` {d['speaker']}: {d['text']} {d['tag']} · pops f{d['at']}, held {d['held']} f (read floor {d['hold_floor']} f) · {d['status']}")
            for v in s['vo']:
                w(f"- **V.O.** `{v['id']}` MAS (V.O.) {v['tag']}: {v['text']} · f{v['at']}–{v['end']} ({v['frames']} f) · caught by: {v['caught_by']}{' · ' + v['alt'] if v['alt'] else ''}")
            ons = [x for x in s['text'] if x['kind'] != 'rail']
            if ons: w(f"- **On screen:** " + ' · '.join(f"{x['kind']} `{esc(x['text'])}` {x['tag']} (f{x['at']})" for x in ons))
            if s['rail_change']: w(f"- **Rail:** `{esc(s['rail_change']['text'])}` types on at f{s['rail_change']['at']} (read ≥ {s['rail_change']['read_min']} f; it persists)")
            for sw in s['switches']: w(f"- **Switch:** `{esc(sw)}`")
            if s['drop_out']: w(f"- **Drop-out:** {s['drop_out']}")
            if s['quiet_beat']: w("- **Quiet beat:** yes (faces only; no line, no gag, no sting)")
            w(f"- **Sound:** SFX {', '.join(s['sfx']) or '—'} · MUSIC {s['music'] or '—'}")
            if s['gags']: w(f"- **Gags / eggs:** {' '.join(s['gags'])}")
            if s['record_items']: w(f"- **Record in picture (still, sharp):** {', '.join(s['record_items'])}")
            w(f"- **Assets:** " + ' · '.join(f"{a['status']} `{a['id']}`{' [' + a['priority'] + ']' if a['priority'] else ''}" for a in s['assets']))
            w(f"- **Animatic layout:** {s['standin']}")
            w(f"- **Logged as:** {s['logged_as']} · class {s['size_class']} · faces + hands {s['face_frames']} of {s['frames']} f · {s['prod_mode']} · {s['events']} events" + (f" · rides {s['rides']}" if s['rides'] else ''))
            if s['notes']: w(f"- **Notes:** {' '.join(s['notes'])}")
            w(f"- **Crosswalk:** lock v2 {', '.join(s['v2_id']) or '—'}{' (' + str(s['v2_frames']) + ' f)' if s['v2_frames'] else ''} · framing-v3 {', '.join(s['fv3_id']) or '—'}")
            w('')
    # ------------------------------------------------------------------ assets
    w('## New asset needs')
    w('')
    w("Everything board 3 asks for that isn't built, by priority. **P1**: the v3 animatic doesn't read without it · **P2**: a stand-in carries the animatic, the final needs it · **P3**: polish. The last column answers whether a crop or a whole-number scale of existing art is enough **for the animatic** (final art is never a scaled sprite, PIXEL_GUIDE §4; the screen macro is the one sanctioned 2x, and only on a screen's own pixels).")
    w('')
    w('| Pri | Asset | Status | Owner | What | Crop / scale enough for the animatic? | New in v3 | Shots |')
    w('|---|---|---|---|---|---|---|---|')
    for a in NEEDS:
        v = a['crop_or_scale_suffices_for_animatic'] or '—'
        head, _, rest = v.partition(':')
        w(f"| {a['priority']} | `{a['id']}` | {a['status']} | {a['owner']} | {esc(a['fn'])}{(' · ' + esc(a['note'])) if a['note'] else ''} | **{head}**:{esc(rest)} | {'yes' if a['new_in_v3'] else 'carried'} | {', '.join(a['used_in'])} |")
    w('')
    def ls(xs): return ', '.join('`' + a['id'] + '`' for a in xs) or 'none'
    new_art = [a for a in NEEDS if a['status'] == 'NEW' and a['new_in_v3']]
    chg = [a for a in NEEDS if a['status'] == 'CHANGED']
    code = [a for a in NEEDS if a['status'] in ('HELPER', 'PARAM')]
    carried = [a for a in NEEDS if a['status'] in ('NEW', 'CHECK') and not a['new_in_v3']]
    no = [a for a in NEEDS if (a['crop_or_scale_suffices_for_animatic'] or '').startswith('NO')]
    w("**In short.**")
    for pri in ('P1', 'P2', 'P3'):
        w(f"- **New in v3, {pri}:** {ls([a for a in new_art if a['priority'] == pri])}.")
    w(f"- **Existing kits that need a new option:** {ls(chg)}.")
    w(f"- **Code only (framing.ts helpers, kit parameters):** {ls(code)}.")
    w(f"- **Carried from board 2, still unbuilt:** {ls(carried)}.")
    w(f"- **Where a crop, a whole-number scale or a composite of existing art is NOT enough for the animatic:** {ls(no)} (a labelled box, as in v2). Every other need has a stand-in from existing art; the MARKED ones (a 2x scale, a recolour, the day busts' boxy extension) must not reach the final.")
    w("- **Not needed after all:** framing-v3's bullpen-ceiling plate (the landlord is one wide) and its 2x dialog drawing (the click is a screen macro, an in-world 2x of the laptop's own pixels).")
    w('')
    w('## No longer needed')
    w('')
    for a in doc['assets_no_longer_needed']: w(f"- `{a['id']}`: {a['why']}")
    w('')
    w('## Crosswalk from lock v2')
    w('')
    w('| v3 | from lock v2 | framing-v3 |')
    w('|---|---|---|')
    for s in SHOTS: w(f"| {s['id']} | {', '.join(s['v2_id']) or 'NEW'} | {', '.join(s['fv3_id']) or '—'} |")
    w('')
    w('**Lock v2 shots cut in 3.2:** ' + '; '.join(f"{x['id']} ({x['why']})" for x in doc['crosswalk_v2']['v2_cut_in_32']) + '.')
    w('')
    w('**Lines retired in 3.2:** ' + '; '.join(f"`{x['id']}` {x['what']}" for x in doc['retired_lines']) + '.')
    w('')
    w('## Lines (3.2, at target)')
    w('')
    w('| Id | Speaker | Line | 3.2 status | Target | Shot | In (episode) |')
    w('|---|---|---|---|---|---|---|')
    abs_in = {}
    for s in SHOTS:
        for d in s['dialogue'] + s['vo']: abs_in[d['id']] = tc(s['start_frame'] + d['at'])
    for x in doc['lines'] + [dict(id=v['id'], speaker='MAS (V.O.)', text=v['text'], status_32='re-take (pace)', target_s=v['target_s'], shots=v['shots']) for v in doc['vo']]:
        w(f"| `{x['id']}` | {esc(x['speaker'])} | {esc(x['text'])} | {esc(x['status_32'])} | {x.get('target_s', '—') if x.get('target_s') else 'read ' + str(x.get('read_floor_f')) + ' f'} | {', '.join(x['shots'])} | {abs_in.get(x['id'], '—')} |")
    w('')
    w('## Sound')
    w('')
    w("The v3 animatic is cut WITH sound (tighten-changes §6; the `MUSIC:` and `SOUND:` calls are in the script and in each shot above). The OST renders in `audio/ost/tracks/*/render/` were composed to lock v2's clock: use them as TEMP beds, re-conformed to this board, and mark them TEMP in the cue list. Sounds marked *(build)* are not on the SFX board yet.")
    w('')
    open(PROD + '/shotlist-v3.md', 'w').write('\n'.join(L) + '\n')

    # ================================================================== chunks-v3.md
    C = []
    c = C.append
    c('# Ep1 · Act Four · Production chunks v3 (board 3, draft 3.2)')
    c('')
    c(f"*Storyboard / 1st AD, 2026-09-25. Generated by `{m['generator']}` with [shots-v3.json](shots-v3.json) and [shotlist-v3.md](shotlist-v3.md). The frames are board 3's (the 3.2 targets; act frame 0 = episode 12:31:00, end exclusive) until THE EDITOR's `timing-v3` re-locks them on the re-recorded takes. Each chunk renders on its own and hands off on a hard cut; both whips sit inside a chunk (26A.03 → 27.01 in C03, 30.07 → 30.08 in C09). Supersedes [chunks-v2.md](chunks-v2.md), which describes 3.1.*")
    c('')
    c("**Render rules** (PIXEL_GUIDE, ART_GUIDE): 1080p max, previews `--scale=0.5`; the machine is CPU-only and shared, so render a chunk at a time and delete temp frames after each encode.")
    c('')
    c('| Chunk | Shots | Act frames | Length | Episode TC | Lines (voiced · V.O. · posts) | Events | P1 to build first |')
    c('|---|---|---|---|---|---|---|---|')
    per = {}
    for ch in doc['chunks']:
        shots = [s for s in SHOTS if s['chunk'] == ch['id']]
        voiced = [d['id'] for s in shots for d in s['dialogue'] if d.get('voiced')]
        posts = [d['id'] for s in shots for d in s['dialogue'] if not d.get('voiced')]
        vos = [v['id'] for s in shots for v in s['vo']]
        need_ids = sorted({a['id'] for s in shots for a in s['assets'] if a['status'] in ('NEW', 'CHANGED', 'HELPER', 'PARAM', 'CHECK')})
        p1 = [i for i in need_ids if A[i]['priority'] == 'P1']
        per[ch['id']] = (shots, voiced, posts, vos, need_ids)
        c(f"| {ch['id']} | {ch['shots']} ({ch['n_shots']}) | {ch['start_frame']}–{ch['end_frame']} | {ch['frames']} f · {ch['seconds']} s | {ch['tc_in']}–{ch['tc_out']} | {len(voiced)} · {len(vos)} · {len(posts)} | {sum(s['events'] for s in shots)} | {', '.join('`' + i + '`' for i in p1) or '—'} |")
    c(f"| **Act** | {t['shots']} shots | 0–{t['frames']} | {t['frames']} f · {t['seconds']} s | {t['episode_in']}–{t['episode_out']} | | {t['visual_events']} | |")
    c('')
    c("**Build order for the v3 animatic** (the helpers first: they unlock most chunks): `fx.frameless-bust` → `fx.ots-shoulder` → `kit.call-layouts` + `fx.screen-macro` → `kit.blueprint.v3` → `room.table-insert` + `cast.neleh.hand` → `kit.doorway-jamb`, `kit.spotlight`, `room.neleh-desk.full`, `kit.call-label` → `fx.rack`, `fx.whip`, `fx.pan` → the P2 stand-ins. `cast.mas.tallbust` (P1) can ride its stand-in into the first cut.")
    c('')
    for ch in doc['chunks']:
        shots, voiced, posts, vos, need_ids = per[ch['id']]
        c(f"## {ch['id']} · {ch['title']}")
        c('')
        c(f"- **Frames:** act {ch['start_frame']}–{ch['end_frame']} ({ch['frames']} f, {ch['seconds']} s), episode {ch['tc_in']}–{ch['tc_out']}.")
        scs = sorted({s['scene'] for s in shots}, key=lambda x: [d['id'] for d in doc['scenes']].index(x))
        c(f"- **Scenes:** {', '.join(scs)} · **Temp score:** " + ' / '.join(doc['sound']['temp_score'][x] for x in scs))
        ready = sorted({a['id'] for s in shots for a in s['assets'] if a['status'] in ('EXISTS', 'REUSE')})
        c(f"- **Ready ({len(ready)}):** {', '.join('`' + i + '`' for i in ready)}")
        if need_ids:
            c(f"- **To build or confirm ({len(need_ids)}):**")
            c('')
            c('| Asset | Owner | Status | Pri | Animatic now (crop / scale enough?) | Shots here |')
            c('|---|---|---|---|---|---|')
            for i in sorted(need_ids, key=lambda i: (A[i]['priority'], i)):
                a = A[i]
                v = a['crop_or_scale_suffices_for_animatic'] or '—'
                head, _, rest = v.partition(':')
                here = [s['id'] for s in shots if i in s['asset_ids']]
                c(f"| `{i}` | {a['owner']} | {a['status']} | {a['priority']} | **{head}**:{esc(rest)} | {', '.join(here)} |")
            c('')
        c(f"- **Lines ({len(voiced)} voiced · {len(vos)} V.O. · {len(posts)} posts):** {', '.join('`' + i + '`' for i in voiced + vos + posts) or '—'}")
        c('')
        c('| Shot | Tag | Class | Angle | Move | Frames (act) | Len | Animatic layout |')
        c('|---|---|---|---|---|---|---|---|')
        for s in shots:
            c(f"| {s['id']} | `{esc(s['tag'])}` | {s['size_class']} | {esc(s['angle'].split(' · ')[0])} | {esc(s['move'].split(' · ')[0])} | {s['start_frame']}–{s['end_frame']} | {s['grid']} | {esc(s['standin'])} |")
        c('')
    open(PROD + '/chunks-v3.md', 'w').write('\n'.join(C) + '\n')
