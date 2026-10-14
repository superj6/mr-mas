# Ep3 v1: Act Two picture pass

2026-10-13. `studio/src/episodes/ep03/pixel/art/act2.ts` exports `drawAct2`, used before the general picture dispatcher. Implements source scenes 11–14 by stable beat number. All statements about visual feeling are [J] until stills/motion are inspected; no render, heavy job or human watch occurred in this source pass.

| Beats | Concrete drawing / coverage |
|---|---|
| 11.01 | Industrial crate and installed drum vs physically leaning old NONPROFIT frame; actual reception, laptop call and people. |
| 11.02–04 | Closer Mas/Rima pair at door, box and clipboard, whole handover/refusal, Gerg visible on call. |
| 11.05–06 | Moving paper/gust, three people in wings, horizontally supported installer with bent forearm and gripping hand on desk, signature clipboard. |
| 11.07–08 | Rima exits right; after she leaves, Mas moves practical names/review sheet. No inference about departure reasons. |
| 11.09 | Full-size class photograph with actual scissor edge around removed human shape; call laptop remains a physical screen. |
| 12.01/05 | Warm remembered table and known founders; source-order two-tone dimming, empty Gerg chair with laptop dent, green rim only in memory. |
| 12.02 | Breakout inside phone bezel; tunneling gap, moving ball/paddle, distinct 8-bit medium. No second technical lecture. |
| 12.03–04 | Held Mas/Gerg conversation with napkin and dessert/laptop, then task writing and MONDAY choice. No invented exact historic quotes. |
| 12.06 | Present beach chair supports Gerg for “Mine's fine”; rim gone. |
| 13.01–02 | Governor/author negotiation, one-head hydra with leash connected to hand and floor support; capped pen/bill. |
| 13.03 | Message page first with signature, then stamped/victim image and cartoon cork-pop. No generated person/real harm. |
| 13.04 | Bandage with two future stubs; pen tag becomes visible only after Reneiw notices it. |
| 14.01 | Investors enter left through actual door; returned $7T pallet moves right, opposite flow. |
| 14.02/07/08 | Working sheet, blank OWNER line and signed paper in held table negotiation; no claim to reproduce actual term-sheet text. |
| 14.03–04 | Absurd pledge and unrolling competitor list; lemonade end insert only after Mas answers. |
| 14.05 | Mas thought close with sheet turned away; no source rail/toast sharing the thought. |
| 14.06/09 | Discrete valuation wheels, fourth collar only after new round, then extra-dollar payoff. |

Text overlays remain root `drawTexts` responsibility and should be called once after `drawAct2`; this module draws diegetic support props/room lettering only. Timing follows shot-local k and relative line/beat state; absolute segment positions do not affect it. Source IDs come from `sh.beats`, not inferred film time.

Re-run after lock: `python3 studio/src/episodes/ep03/pixel/tools/picture.py act2`; render/typecheck/still inspection commands through `ops/heavy.sh`, coordinated by root while pipeline owns take/lock slot. Next checks: native full-size anatomy/crops, no cast-label leaks, light/shadow support, scissor hole readability, signature/source text compatibility and collar chronology. Full real-time watch/ear still owed.

**Close-coverage revision [J], before render:** 12.03–04 now use native full 112×136 Mas/Gerg portraits in one warm room with table/napkin; no sprite enlargement or portrait window border. 13.02 uses native Moswen/Reneiw close pair for plea. 14.07 uses native Mas/Auhsoj close pair with blank OWNER line visible on table. Mas stays left; known face shapes and scale remain consistent. Gallery mocks tolerate missing sh.beats; real shots use stable IDs.

**Departure-context correction:** 11.05 airborne newspaper stays unread. Its for-profit restructuring headline is now a funding-prep document in14.01, after the full dinner and veto, so no picture offers Rima a departure reason. Root text overlays will follow regenerated source metadata after full take pass.

**Rima coverage revision [J]:** 11.02–04 use native Mas/Rima close pair in one room; the glass drum expands behind her with clear brass mullions outside her eyes, box inside wing, Mas/clipboard outside. “You’re still inside” now points at visible spatial fact; laptop appears for Gerg’s remote goodbye.

**Full-size source review [M/J]:** viewed12.03-1,13.02-1,14.07-1,11.03-1,11.06-1,11.09-1,13.03-1 at1080p. Warm native pairs and blank owner line readable; full-size scissor hole reads as a missing person in a photograph. Source11.03 image predates latest drum/close fix, requiring fresh lock frame. Veto clause floated above page through generic drawer: fixed with exact clause ink on cream page, and `ownsAct2Text(sh,k)` suppresses generic doc tag during paper phase. Date appears in paper ink; host date/subtitles remain. No ear or real-time motion claim.

**Actual-lock review:** inspected all seven unscaled Act2 pages, one 1920×1080 middle frame for each of 28 shots, plus the three-position contact sheet and individual handover/veto/pair frames. The latest handover close and paper ink read clearly. Two geometry defects found and fixed: 14.05 now replaces the whole room with one supported native Mas at a desk; 14.09 draws investors behind the far table edge, with the foreground table covering their lower bodies. Fresh actual-lock stills at frames 5617 and 6604 were rendered through `ops/heavy.sh` and inspected; saved in `out/ep03/v1/review/local-lock/act2/fixes/`. Other close pairs cover the whole room crop and do not retain underlying room actors. Root’s shared portrait fix removes Rima’s opaque helper background. The final Act2 picture needs rerendering after these source-only art corrections; no take, lock, dialogue or timing changed. Full review scope and pending checks are in [review-picture.md](review-picture.md).

**Delivered stock pass:** root completed the corrected Act2 render after these fixes. The latest actual-host gallery drew all Act2 shots at three positions without exception. The full-film attempt retains the same stock-take timing; an optional paid audition was blocked before any request. Picture inspection remains a still review, not a continuous motion or listening pass.
