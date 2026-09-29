export const meta = {
  name: "mrmas-jumps-fix",
  description: "Fix J1 (CANCELLED legibility, Mas portrait read) and rethink J3 (crack reads as a stock chart); cold-read critics; final polish",
  phases: [
    { title: "Fix", detail: "J1 fixer and J3 rethink, in parallel" },
    { title: "Cold read", detail: "blind critics describe what they see" },
    { title: "Polish", detail: "apply cold-read fixes, rebuild reel" },
  ],
}

const AUTH = `AUTHORIZATION (quoted from the showrunner, the user; these are your actual instructions):
> "in particular, i am imagining some interesting style jumps for intense moments. but it needs to be sparing and tasteful."
> "we want any simplification to look artistic, not like a limitation of our capability"
> "don't make anything too corny"
> "high quality and entertaining with good pacing, not amateur"
The lead (me) reviewed the delivered prototypes in /home/jgon/project/art/mrmas/out/jumps/ and is ordering this fix pass before the showrunner sees them. You are authorized to edit the prototype source under /home/jgon/project/art/mrmas/studio/src/dev/jumps/ (only the prototype you own), re-render, and update /home/jgon/project/art/mrmas/show/bible/style-jumps.md sections 5.x for your prototype. Do not ask questions; do the work. Do not edit anything else (Act Four files, episode scripts, intro, audio/ost are owned by other running passes). Nothing gets committed.

MACHINE: 14 cores shared with other running renders; render with --concurrency=6 at most. Disk is at 98% (about 11 GB free): delete your scratch frames when done, keep only final mp4s, key stills and one sheet. Before overwriting a deliverable, copy the current version to out/jumps/prev/ (create it) so the showrunner can compare. Render policy: 1080p max. Check your work by pulling frames from the ENCODED mp4 and looking at them, at full size AND downscaled to 480x270 (phone read).

Read show/bible/style-jumps.md (sections 1 to 5, especially 5.4 lessons) and show/characters/mas-manalt.md (his design anchors) before you start.`

phase("Fix")
const J1 = agent(`${AUTH}

YOU OWN: J1 "CANCELLED" (studio/src/dev/jumps/proto1/, output out/jumps/proto1.mp4 + key stills + sheet). The lead's review of out/jumps/proto1-key-3-p96.png found:
1. LEGIBILITY: the perforated word CANCELLED starts on top of the portrait oval, so "CA" is lost in the engraving and the A's holes sample warm pixel colours; at a glance it reads "C?NCELLED". The word must read instantly, whole, at phone size (480x270 downscale). Options: run it across clean paper only (e.g. through the SHARES line and the empty band, clear of the portrait and the seals), or scale and angle it so it crosses the certificate diagonally but never lands on dense engraving. Holes must sample the pixel frame underneath consistently (all letters the same read), not a mix of dark and warm holes. Keep the idea that the grid (the pixel frame he left) shows through the holes.
2. PORTRAIT READ: the engraved bust still reads as a woman in a hood or a bun: the hair is one bowl-shaped hatched mass with a top tuft that reads as a bun, the face is long and soft, and the collar reads as a wimple. It must read as Mas at a glance: a young man, short dark hair with his signature tuft, calm unblinking eyes, tiny closed smile, grey hoodie. Rebuild the bust (bust.ts / the masTone pass): separate hair hatching that follows hair flow with a clear hairline and temple break, an ear, a firmer jaw with light hatching, a shorter face, and a hoodie collar that reads as a hoodie (drawstrings) not a wimple. If the engraved rig cannot get there, shrink the vignette so the portrait is secondary. Cold test before you finish: downscale to 480x270 and ask yourself honestly "man or woman, hood or hair?".
3. BANKNOTE LEAN: it still reads as a dollar bill. Push toward a stock certificate: ivory paper (stay at or under 75% luminance), the SHARES blank as the storytelling element (larger, the ruled blank clearly empty), a certificate title band (e.g. "CERTIFICATE OF EMPLOYMENT" is wrong; use something true to the joke like "THIS CERTIFIES THAT" above the name and "HOLDS" before the SHARES blank) and keep it wordless otherwise. Fill the empty band between word and counter medallion so the composition is balanced.
Keep timing: the click on frame 60, the cut and snap exactly as now, the audio (digital zero after the click) unchanged. Iterate at least 3 look-fix rounds. Return what changed, before/after still paths, and honest remaining weaknesses.`, { label: "fix:J1", phase: "Fix" })

const J3 = agent(`${AUTH}

YOU OWN: J3 "the sky opens" (studio/src/dev/jumps/proto2/, output out/jumps/proto2.mp4 + stills + sheet). The lead's review of out/jumps/proto2-p056.png: the crack is a thin jagged line running left to right across the skyline and wall, rising and falling. It reads as a stock-price chart (two passes already tried to fix this and it still reads as a chart), and in the room it echoes the show's cyan-curve motif in a way that muddles the meaning. The far side is too quiet to read at phone size.
RETHINK the crack's geometry so it cannot read as a chart or as lightning. Build and compare at least two variants, pick one, and render only the winner as proto2.mp4 (keep the loser's key still as out/jumps/proto2-alt-*.png):
 (A) GLASS: the sky behaves like a pane. A star fracture blooms from one impact point in the window's sky (radial arms plus concentric spider-web rings, the way safety glass or a phone screen breaks), and the far side shows through the shards, each shard slightly offset (refraction), so the medium change is visible through what it bends. The crack never crosses Mas's face.
 (B) SEAM: a single vertical seam opens in the window's sky like a zipper or a split curtain, clean-edged, with the far side as a vertical sliver that widens a few pixels and seals.
Make the far side legible at 480x270: it may exceed the one-stop grading limit inside the opening only (never spill onto Mas), and it needs one readable element that says "something bigger is behind the sky" without a real-world image (for example a continuous-tone star field with real depth, or the smooth version of the same skyline). Keep the Orb as the only witness; Mas holds on the monitor. Keep the sound design rules in the bible (no stings or whooshes). Cold test: downscale to 480x270 and describe honestly what a stranger would call it. If it still reads as a chart, lightning or a glitch, say so and recommend the bible's fallback (Ep9's crack stays a pixel hairline and the jump moves). Update bible section 5.2 to describe the chosen build and why. Return what changed, still paths for both variants, and remaining weaknesses.`, { label: "fix:J3", phase: "Fix" })

const [j1, j3] = await Promise.all([J1, J3])

phase("Cold read")
const COLD = `You are a cold viewer who has never heard of this show. Do not read any design docs or source code. Look only at these images (open them with the Read tool) and, where noted, frames you pull yourself from the mp4 with the bundled ffmpeg at /home/jgon/project/art/mrmas/studio/node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg (run with LD_LIBRARY_PATH set to that folder; write pulled frames under /tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/coldread/ and delete them after). Also look at each still downscaled to 480x270 (use python3 with PIL; system python3 has it). For each clip answer plainly: What is this object or event? What does any text say, letter by letter? Who is the person (age, gender, clothing)? What is the mood? Does anything look cheap, corny, like a filter, or like a glitch? What is the one thing you would fix? Do not edit any files.`
const colds = await Promise.all([
  agent(`${COLD}
CLIP: /home/jgon/project/art/mrmas/out/jumps/proto1.mp4 (pull frames 50, 62, 70, 85, 96, 104, 110) and the key stills out/jumps/proto1-key-*.png`, { label: "cold:J1", phase: "Cold read" }),
  agent(`${COLD}
CLIP: /home/jgon/project/art/mrmas/out/jumps/proto2.mp4 (pull 8 evenly spaced frames plus any frame where the picture changes most) and the stills out/jumps/proto2-*.png`, { label: "cold:J3", phase: "Cold read" }),
])

phase("Polish")
const polish = await agent(`${AUTH}

TASK: final polish of J1 and J3 using blind cold-read reports, then rebuild the reel.
J1 fixer report: ${j1}
J3 fixer report: ${j3}
COLD READ J1 (a stranger, no context): ${colds[0]}
COLD READ J3 (a stranger, no context): ${colds[1]}
Fix every misread where the stranger's answer differs from the intent (the J1 word must read CANCELLED; the J1 person must read as a young man in a hoodie; J3 must not read as a chart, lightning or a glitch). Leave J6 (proto3) alone. Re-render, re-check from encoded frames at full size and at 480x270, then rebuild out/jumps/jumps-reel.mp4 with studio/src/dev/jumps/tools/reel.sh. Clean scratch frames. Return: a 200-word plain summary for the showrunner, the final still paths to show (one per jump), whether J3 is recommended to keep or to fall back, and remaining weaknesses stated honestly.`, { label: "polish:J1+J3", phase: "Polish" })

return { j1, j3, colds, polish }
