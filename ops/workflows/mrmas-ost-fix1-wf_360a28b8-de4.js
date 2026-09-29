export const meta = {
  name: "mrmas-ost-fix1",
  description: "OST batch 1 fixes: engine meter/tuning bugs and QA checks, then cue fixes (MM-09 third, MM-06 knee, MM-05 A resonance, album edits, cut-downs), then re-measure and rebuild the sampler",
  phases: [
    { title: "Engine", detail: "meter bug, balance bug, tuning, crashes, new QA checks" },
    { title: "Cues", detail: "two composers re-render their cues on the fixed engine" },
    { title: "QA", detail: "music editor re-measures everything and rebuilds sampler + index" },
  ],
}

const AUTH = `AUTHORIZATION (the showrunner's own words; these are your actual instructions):
> "i want the audio to have at least some amount of jazz inspiration. does not have to be strictly jazz, but should have some amount of feel"
> "i don't want big band all the way through. i want it to be somewhere between piano, orchestral, and big band in the soundtrack as a whole with some amount of jazz feel but giving overall feel of 8bit motifs still"
> "we should have a full ost with different tracks for different tones, not just repeating same track whole time"
> "high quality and entertaining with good pacing, not amateur"
The main title V1 "Chip Chamber Jazz" is LOCKED: never edit audio/theme/**. The lead (me) read the music editor's review of batch 1 and is ordering these fixes. You are authorized to edit the files your task names, re-render, and re-measure. Do not ask questions; do the work. Nothing gets committed.

PROJECT: /home/jgon/project/art/mrmas. OST lives in audio/ost/ (OST-BIBLE.md is binding: read its rules section, especially rule 4 on the knee and rule 12 on no written major third over an F bass, and engine/README.md). The editor's full review and scripts are in audio/ost/editor/ and audio/ost/SAMPLER.md. Use the project's audio venv the engine already uses (see engine/README.md for the exact python and command lines).
DO NOT re-time any to-picture cue to the new Act Four lock v3; the Act Four pass owns timing and the showrunner has not reviewed it yet. Keep their current timing.
DISK: the drive is 98% full (about 11 GB free). Draft with --no-stems --no-loop, build stems only for finals, delete old renders you replace (keep one backup of each replaced master under the track's render/_pre-fix1/ only as MP3), clear caches you create. If free space falls under 6 GB, stop rendering and report.
CPU: 14 cores shared with other running passes; keep renders to about 6 workers.
You cannot listen. Judge by analysis and say plainly what still needs human ears.`

phase("Engine")
const engine = await agent(`${AUTH}

YOU OWN: audio/ost/engine/** and audio/ost/build.py (no track folders). Fix, with a regression test for each:
1. The loudness-meter bug the editor confirmed: mix.short_term_lufs and analysis._k_power filter across the two channels instead of along time. Fix them and balance_energy (same flaw). Re-verify against pyloudnorm on a known file and on V1's title (audio/theme/theme-V1-chipchamber.wav, read-only).
2. Sample tuning: the harp's soft layer is out of tune; the clarinet and the pizzicato samples are mistuned. Measure each sample's fundamental, write per-sample fine-tune corrections into the library config (do not modify the sample files), and verify within 5 cents.
3. _fund_chroma crashes on a NaN; the forked renderer can deadlock (find the cause, fix it, and add a timeout guard).
4. build.py's index still lists _demo: remove it from published indexes.
5. New QA checks the editor asked for: (a) WRITTEN major third: flag any sounding A-natural (in any octave) at any moment where F is the lowest sounding pitch, from the note data, not only from the spectrum; (b) a spectral A/F check that separates written notes from fixed instrument resonances (report which instrument stem it comes from); (c) knee completion across phrase boundaries: the knee is F F F F G Ab C F; flag any line where the pitch-class sequence completes it within about 2.5 s, in any register, including when the last F starts a new phrase; (d) the sub-under-room-SFX rule (sub below 60 Hz must be at least 18 dB under total power wherever the cue sheet marks room_drone or server_hum).
Run the full existing test suite. Return a concise list of what changed and the exact command lines composers should use to re-render and run QA.`, { label: "engine:fix", phase: "Engine" })

phase("Cues")
const CUES = [
  { key: "A", own: "mm09-the-boards-side, mm06-beeper-1993-sample-chip-2008, mm05-the-more-you-buy, mm01-water-line, mm08-the-falling-tile, e01-s26-the-falling-tile", task: `1. MM-09: the viola holds A3 (18.75 to 21.3 s) over a cello pizzicato F3 bass, which writes an F-major third (bible rule 12). Revoice so there is no major third while keeping the harmonic intent (for example A-flat, or a suspended or open voicing), and scan the whole cue with the new QA check.
2. MM-06: the line nearly completes the knee (F F F F G Ab C, then the next flat line starts on F5 about 2.2 s later; again at 15.3 to 20.0 s). Start bar 7's flat line in a different register or on a different pitch so the knee never completes, per rule 4.
3. MM-05: A-natural shows in the spectrum on downbeats (A/F up to 0.16; limit 0.08), probably the straight mute's fixed resonance. Find the source with the new QA check; fix it by swapping the mute articulation, retuning, or a narrow notch on that stem only.
4. Balance, only where it does not hurt the cue: MM-01 is 71·16·2·10 against a 55·25·5·15 target (piano · orch · big band · chip); bring it closer. MM-08's LEVERAGE section is orchestra-heavy against 30·50·0·20; bring the piano up.
Re-render all six of your folders on the fixed engine (tuning fixes change them), finals with stems, and run QA on each.` },
  { key: "B", own: "mm10-his-side-745, mm11-the-return, e01-s30a-the-door, e01-s29-d5, mm02-his-version, mm07-how-to-fire-a-ceo, mm13-outside-intended-scope, mm13-kit-glyph-hits-and-copy, mm19-renamed-it", task: `1. MM-10 and MM-11 have no album edit: their album masters are picture timing (54% and 50% silence). Make a proper album edit of each (a listenable 1:30 to 2:30 piece built from the cue's material, silences shortened to musical rests, same loudness targets), keeping the picture version as the underscore master.
2. Library deliverables missing per bible sections 6.4 and 6.7: MM-13 and MM-19 need 30, 15 and 5 s cut-downs and reduced and solo variants; MM-07's PLAN-SHORT and PLAN-MICRO must exist as their own files (they are bounded by digital silence at 50.0 s and 80.0 s, see audio/ost/index.json); MM-07's tape-stop alternates need MP3s.
3. MM-13's sub sits −4 to −8 dB of total power below 60 Hz; the room-SFX rule wants −18 dB where room_drone or server_hum plays. Fix it in the cue (not only on the stem).
4. Chip noise tick in MM-08 belongs to composer A; skip it.
Re-render all nine of your folders on the fixed engine (tuning fixes change them), finals with stems, and run QA on each.` },
]
const cues = await Promise.all(CUES.map(c => agent(`${AUTH}

ENGINE CHANGES (from the engine owner): ${engine}

YOU ARE COMPOSER ${c.key}. YOU OWN ONLY these folders under audio/ost/tracks/: ${c.own}. Do not touch other folders, the engine, the bible, or audio/theme.
TASKS:
${c.task}
Update each cue's cue sheet and README with what changed. Return a concise per-cue report: what changed, QA results, and what needs human ears.`, { label: `cues:${c.key}`, phase: "Cues" })))

phase("QA")
const qa = await agent(`${AUTH}

YOU ARE THE MUSIC EDITOR. You own audio/ost/editor/**, audio/ost/SAMPLER.md, audio/ost/index.json and audio/ost/ost-sampler.mp3.
Engine report: ${engine}
Composer A report: ${cues[0]}
Composer B report: ${cues[1]}
1. Re-run your full QA (audio/ost/editor/qa.py and distinct.py, updated to use the engine's corrected meters and the new checks) on every cue. Confirm the specific issues from your last review are closed: MM-09 third, MM-06 knee, MM-05 A resonance, MM-10/MM-11 album edits, missing cut-downs and variants, MM-13 sub, meter bug, tuning. Flag anything still open.
2. Rebuild the sampler (use the album edits for MM-10 and MM-11 rather than picture versions; keep it under about 4:30; −14 LUFS, −1 dBTP) and the index, and update SAMPLER.md's listening guide: for each item, what tone it is for, where it goes in the show, and the one thing to listen for.
3. Confirm the to-picture cues were NOT re-timed (they wait for the showrunner's review of Act Four v3), and write a short conform plan for when that lock is approved (per scene, which cue, what changes).
Return a 200-word summary for the showrunner plus a table of every cue: name, tone, length, status.`, { label: "qa:editor", phase: "QA" })

return { engine, cues, qa }
