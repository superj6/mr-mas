#!/usr/bin/env python3
"""Derive delivery watch ranges from one assembly and its current pixel locks.

No media decode, API or rendering. Refuses stale chapter/lock lengths or offsets.
Run after final assembly, e.g. python3 .../watchlist.py --write.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

BASE = Path(__file__).resolve().parents[2]
FPS = 24
ITEMS = [
    ('coldopen', '1.01', '3.03', 'E, A', 'Fruit/yarn conspiracy: playful cold open, readable fruit post, then August 5 rewind understood.'),
    ('act1', '4.01', '5.01', 'E, A', 'Gerg handover and beach: full warmth, complete signatures, keycap and gull/ESC actions readable.'),
    ('act1', '7.01', '7.04', 'E, A', 'One next-token/causal-attention lesson: keys→are, past-only links, illustrative bars and paper return clear.'),
    ('act1', '8.01', '8.12', 'E, A', 'Stadium: rehearsal, band, shutter, fan cam and correct kick earn their time; answer-making never reads as a raw thought transcript.'),
    ('act1', '10.01', '10.04', 'E, A', 'Essay quote keeps possibility/uncertainty and reads before the countdown joke; Staffer and concrete release work remain clear.'),
    ('act2', '11.01', '11.09', 'E, A', 'Rima exit: listen to repeated phrasing, warm refusal and remote Gerg; turbine/photo-hole are physical gags with no invented departure cause.'),
    ('act2', '12.01', '12.06', 'E, A', 'Woodrose: warm invented motive, Breakout/napkin/first task and return to present; tenderness rather than a lecture or padded hold.'),
    ('act2', '13.01', '13.04', 'E, A', 'Veto: exact page ink reads before stamp; fantasy hydra and property-pen joke read without a claim about private motives.'),
    ('act2', '14.01', '14.09', 'E, A', 'Funding: absurd pledge distinct from reported ask, actual round/valuation clear, native owner pair grounded, investors behind table.'),
    ('act3', '17A.01', '17A.06', 'E, A', 'Unscored phone call: intimacy, complete pauses, held reverse sides and connected hands; filtering/distance heard as a phone.'),
    ('act3', '18.01', '19.02', 'E, A', 'Rival writing and paper bridge: hope/pushback, Lunchmas arrival and native paper leap; Adelina window belongs to the room.'),
    ('act3', '20.01', '20.06', 'E, A', 'Rival funding/election: month-only result has no election-day call claim. The exact Ep2 empty/taut podium plate holds seven seconds with offscreen caster sound; check whether implied movement reads despite limited visible action.'),
    ('act4', '21.01', '21.06', 'E, A', 'Gerg return: keycap recognition and warmth play without assigning an undisclosed historical reason.'),
    ('act4', '22.01', '22.12', 'E, A', 'Shipmas: Pro price choice, silent Aros mammoth, phone integration and o3 ANNOUNCED read in time; chart/corkboard business stays clear.'),
    ('act4', '22.07', '22.07', 'E', 'Personal ledger: December 13, personal contributor and $1M inaugural-fund amount all read together, before December 20.'),
    ('act4', '23.01', '23.08', 'E, A', 'Undated terrace: no new contribution-writing, no bought-policy claim; personal symbolic replay and larger investment pledge remain separate.'),
    ('tag', '24.01', '24.05', 'E, A', 'Check no-response, larger sign, three held turn angles, face before first sound, then Mas listener/Orb verdicts. No early or duplicate podium occupant.'),
    ('tag', '25.01', '25.01', 'E, A', 'Frozen bay: single fruit, moving whale-shaped shadow and ice sound; direct cut into credits needs to feel intentional.'),
]


def tc(frame: int) -> str:
    seconds, f = divmod(frame, FPS)
    minute, second = divmod(seconds, 60)
    return f'{minute:02}:{second:02}:{f:02}'


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--assembly', type=Path, default=BASE / 'assembly/v1-assembly.json')
    parser.add_argument('--write', action='store_true')
    args = parser.parse_args()
    assembly = json.loads(args.assembly.read_text())
    chapters = {c['id']: c for c in assembly['chapters']}
    locks = {}
    for seg in sorted({r[0] for r in ITEMS}):
        lock = json.loads((BASE / f'lock/{seg}.json').read_text())
        chapter = chapters[seg]
        assert lock['meta']['fps'] == FPS, (seg, 'fps')
        assert lock['summary']['frames'] == chapter['frames'], (seg, 'length mismatch')
        assert lock['meta']['ep_in_frames'] == chapter['start_frame'], (seg, 'offset mismatch')
        locks[seg] = {s['id']: s for s in lock['shots']}
    lines = ['# Episode 3 v1 · final-clock watchlist', '',
             f'Generated from `{args.assembly.name}` and matching pixel locks. MM:SS:FF at {FPS} fps. E = eye; A = ear. '
             'These are requests for a watch/listen, not claims that one occurred.', '',
             '## Chapters', '', '| Start | Chapter |', '|---|---|']
    for c in assembly['chapters']:
        if c.get('chapter', True):
            lines.append(f'| {tc(c["start_frame"])} | {c["title"]} |')
    lines += ['', '## Focused passes', '', '- **Whole film once at speed (E, A).** No still inspection or meter establishes story flow, natural prosody or whether the jokes land.']
    for seg, first, last, sense, text in ITEMS:
        a, b = locks[seg][first], locks[seg][last]
        offset = chapters[seg]['start_frame']
        lines.append(f'- **{tc(offset+a["s"])}–{tc(offset+b["e"])}** · {first}'+
                     (f'–{last}' if first != last else '')+f' ({sense}): {text}')
    outro = chapters['outro']
    lines += [f'- **{tc(outro["start_frame"])}–{tc(outro["start_frame"]+outro["frames"])}** (E, A): check cast credits against delivered voices, page-2 pause readability, tag/outro seam and inherited outro vocal/music.',
              '', 'Across the film (A): speech under score/rooms, PA/intercom/phone/laptop distance, synthesized crowds, marginal referred-to effects, and all chapter seams. Consult final sound/encoded-film QA for numerical flags; they are not listening findings.', '']
    act4 = json.loads((BASE / 'lock/act4.json').read_text())
    raw = act4['lines']
    by_id = raw if isinstance(raw, dict) else {l['id']: l for l in raw}
    interjections = [l for l in by_id.values() if l['shot'] == '22.04' and l['who'] == 'MAS']
    lines += ['Speaker-clarity detail (A): 22.04 holds on Gerg/customer while Mas speaks from the established room. Listen for these two interjections:', '']
    for line in interjections:
        offset = chapters['act4']['start_frame']
        lines.append(f'- **{tc(offset+line["abs_in"])}–{tc(offset+line["abs_out"])}** · `{line["id"]}`: “{line["text"]}”')
    lines.append('')
    film_qa = BASE / 'assembly/v1-qa.json'
    if film_qa.exists():
        qa = json.loads(film_qa.read_text())
        at_by_join = {s['join']: s['at_frame'] for s in assembly['seams']}
        large = [s for s in qa['audio']['seams'] if abs(s['step_db']) >= 8]
        if large:
            lines += ['## Measured joins to hear', '',
                      'The encoded 200 ms RMS step measures contrast around a cut, not whether it clicks or feels too loud. These are the largest joins:', '']
            for seam in large:
                lines.append(f'- **{tc(at_by_join[seam["join"]])}** (A): {seam["join"]}, '
                             f'{seam["step_db"]:+.1f} dB RMS step; measured sample jump {seam["sample_jump"]:.4f}. Listen at speed.')
            lines.append('')
    # These are recognizer flags, not established bad takes. Preserve the expected
    # script and the recognizer output together so an ear can settle the difference.
    take_report = BASE / 'assembly/takes-kokoro-qa.json'
    if take_report.exists():
        flags = json.loads(take_report.read_text())
        lines += ['## Stock-take recognizer flags', '',
                  'Ten stored low-recall flags remain machine-review flags, not confirmed misreads. Some differences are punctuation, homophones or spelled-out numbers. Listen before changing a take.', '',
                  '| Final-film range | Shot / line | Expected script | Recognizer flag |', '|---|---|---|---|']
        for segment in flags['segments']:
            seg = segment['segment']
            lock = json.loads((BASE / f'lock/{seg}.json').read_text())
            raw = lock['lines']
            by_id = raw if isinstance(raw, dict) else {l['id']: l for l in raw}
            for flag in segment['flags']:
                line = by_id[flag['id']]
                offset = chapters[seg]['start_frame']
                clean = lambda text: text.replace('|', '\\|').replace('\n', ' ')
                lines.append(f'| {tc(offset+line["abs_in"])}–{tc(offset+line["abs_out"])} '
                             f'| {line["shot"]} / `{line["id"]}` | {clean(line["text"])} | {clean(flag["what"])} |')
        lines.append('')
    output = '\n'.join(lines)
    if args.write:
        target = BASE / 'assembly/watchlist-film.md'
        target.write_text(output)
        print(target)
    else:
        print(output)


if __name__ == '__main__':
    main()
