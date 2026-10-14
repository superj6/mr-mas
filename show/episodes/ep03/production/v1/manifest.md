# Episode 3 v1 production manifest

> 2026-10-13. Implements [proposal.md](proposal.md); source authority is `beat-plan/_spec.py`, generated script `script-v1.md`, six segment JSON plans. Planning items [J] until source/takes/frames are measured. Ep1 and Ep2 assets are read-only references.

## Sets, cast and reusable work

| ID | Set | Reuse / new needs |
|---|---|---|
| SET-01 | Skyline / roof strawberry | Existing city base; new yarn, roof pot/can, generic fruit phone image. |
| SET-02 | Alley/taco truck | New three-station master: board left, laptop middle, cook window right; two-shot and reaction singles. |
| SET-03 | Cathedral lobby | Reuse Ep2 architecture; reception left, door right, Bay window back, photo behind reception. New industrial door/old removed door, photo hole, calendar, GPU tree. |
| SET-04 | Beach | New chair-supported Gerg, keyboard towel/shell keys, pier/tower, sand racks/cords. |
| SET-05 | Stadium box/field | New scalable crowd tiles, three posts, old/new kickers, band letters, shutter, rival box, FAN CAM. |
| SET-06 | Technical paper | Programmatic paper→token diagram; past-context links, masked future, candidate bars. |
| SET-07 | Dark room | Reuse Mas desk/window/hum; countdown, release brief, pen/envelope, passive monitor news. |
| SET-08 | Woodrose | Existing dinner layout; warm close two-shots, napkin/laptop/phone Breakout. |
| SET-09 | Governor office | New desk/pen/bill/hydra; existing official rigs if available. |
| SET-10 | Boardroom | Existing room; investor queue, absurd pledge/list, odometer, collar four. |
| SET-11 | TPOOL lot | Early-web existing tier; old sign/gift cards, $43.4M, no fund-family staging. |
| SET-12 | Misanthropic writing room / bridge | Existing lighthouse; two desks/scroll/shredder, bridge gaps→planks, hiring sign. |
| SET-13 | Pop-up exodus | Programmatic folded paper hills and split tour bus; native style leap, no grade match. |
| SET-14 | Studio podium corridor | New transport master, EMPTY reverse gold lectern, plain green dot-eye bubble, TAUT vertical string. Never hill/early occupant. |
| SET-15 | Symbolic terrace | Gold trim, queue/side aide, Nole step, reflection panel, diegetic kiosk/check slot, held-angle Rumpt turn. |
| SET-16 | Frozen Bay | Recolor Bay, fruit, moving whale shadow/ice seam. |

Carry Mas/Jeremy, Gerg/Marcus, Rima/Mia, Nole/Ryan, ChatGTP/Maya, Mario/Kokoro am_liam, Auhsoj/Rick; existing Adelina/official/cameo voices as cast allows. New fictional theorists, cook, investor/customer/installer/lifeguard are distinct library roles or clearly documented carried generic voices, never imitations. Final labels must match `audio/ep03/cast-el.json` aliases. The Orb has no spoken voice.

## Visual dispatcher keys

Every source beat has `picture` beginning `VISUAL: <key>`. Scene IDs are stable against draft 3.6; 17A stays a suffix, 16–17 becomes 16. Keys: skyline-yarn, corkboard, strawberry-post, lobby-handover, beach, stadium-box, attention, stadium-kick, stadium-shutter, stadium-fancam, darkroom-clock, door-install, door-interview, door-turbine, class-photo, woodrose, breakout, chairs, veto-hydra, investor-pledge, odometer, nonprofit, tpool-sale, nobel-monitor, beach-call, keycap, writing-room, paper-bridge, paper-exodus, election, podium, amazon-rent, lobby-return, shipmas, launch-pro, launch-aros, launch-elppa, launch-o3, terrace-line, terrace-nole, reflection, check-slot, reveal-rumpt, frozen-bay.

## Text and date routes

Story rails carry dates only; valuations, prices, pledge and personal contribution appear on appropriate signs/documents. No disclaimer, production scaffold, source-confidence label or footnote on the film. Facts-v1 holds provenance off screen. Date rails/Orb toasts must not overlap a thought subtitle. Real essay fragment keeps its conditional wording. Election card separates Nov5 election from result-call timing. Personal gift document is dated Dec13; terrace is undated allegory. Intro quote fixed; filename card `ep1.2_strawberry.jpg` alone.

## Style, music, rooms and effects

| Sequence | Style / score identity | Room + story effects |
|---|---|---|
| Fruit/alley | Pixel; chip caper/knee cells | generator, pins, yarn twang, can water, phone post |
| Handover/beach | Pixel warm Gerg arpeggio | lobby hum/door, keys, sand, surf/gull |
| Attention/stadium | Paper blueprint then pixel sports broadcast; light chip/muted brass→swung spectacle | paper tap/token tick, crowd, horn, kick, band, shutter, applause, note/bill |
| Essay/door | Pixel dark room→lobby caper ostinato | server, split-flap, drill, bolts, turbine, paper, pen |
| Woodrose | Warm dinner, brief 8-bit Breakout; chamber/knee | glass, chair, laptop/napkin, game ticks, candles |
| Veto/raise | Pixel procedure→leverage/spectacle | cameras, pen/veto stamp, cork-pop hydra, door/odometer, collar snap |
| TPOOL/prizes | Early-web then monitor; old cassette colour → quiet present | reversed wheels, confetti, display/chess clunk |
| Social call | Pixel; NO MUSIC | room hum/surf/keys, ring, cord/pier powerdown, stopped keys |
| Essay/bridge/exodus | Pixel then native paper leap; Mario quartet/road-trip colour | writing/shredder, knock, paper unfurl, gulls, folds/bus tear |
| Election/rent | Pixel diegetic display; restrained run | screen changes, empty lectern casters, taut string, box/invoice, pen |
| Reunion/Shipmas | Pixel stream interface; Gerg warmth→knee/chip sleigh swing | key snap, sand, hat bell, calendar, mammoth/sleigh, phone, chart ceiling/yarn |
| Terrace/tag | Pixel; oversize muted brass/no third, quiet palm room, reveal | stanchion/footsteps, personal check paper/clink, kiosk touch, reflection sting, ice creak |

All cues belong to the show's 96 BPM/knee/chip/jazz/no-third language. Sequence performance ducks/thins under speech and documents. Room tone has a bed everywhere, even designed music stops. New sources can be synthesized in code first; resource asks recorded later, no required generated layer.

## Build and checks

1. Source script + beat plans, natural words-at-rate estimate and textual checks.
2. Programmatic scratch takes/source reel, then revise bad flow/lines before pixel finish.
3. Final library takes if authorized by lead, ASR/name verification; master lock from actual take lengths. All V.O. in source.
4. Pixel picture by act; sound/score in parallel only within machine headroom. Every data-heavy command through `ops/heavy.sh`; governor during heavy phases; one job per agent, two globally at most. Caps: Remotion 4, record 2 workers, OST 2.
5. Full-size still checks per shot; scene support/anatomy, speaker, warmth, readability, medium contrast. Timed flash check streamed, no whole-film arrays.
6. Score lock hash, sound anchors after relock, encoded-film loudness/true peak/decode/lag/seams, captions/chapters match.
7. Delivery note distinguishes measured versus judged and exact unwatched/unheard limits; no published/complete claim inferred from metrics.
8. Root keyscan staged before commit and range before push; Ep1 31 hashes unchanged. No Ep1/Ep2 modification; no `.env` values read or shown.

## Pass handoff

New proposal + manifest, no build/API activity. Existing staff draft remains historical. Root owns facts-v1 and pipeline/art/tool setup. Writer owns source script/spec/generated beat plans and new fictional name registry rows. Exact source regeneration command is `python3 show/episodes/ep03/production/v1/beat-plan/_build.py --write` once source exists; dry run without `--write` validates and reports estimates. Later heavy replay commands belong to pipeline.md.
