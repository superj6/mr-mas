# EP06 · Intro slot

Base spec: [intro/](../../intro/). Only the changing slots are listed here.

## At a glance
| Slot | EP06 value | Notes |
|---|---|---|
| **Cold-open (dark-room) quote** | *"…I'll find you a buyer… Enough."* | Trimmed from the BG2 exchange ("If you want to sell your shares, I'll find you a buyer… Enough."), displayed **verbatim with the source's casing** in an auto-caption strip, per the [source-fidelity rule](../../intro/spec.md#33-source-fidelity-rule-for-the-cold-open-line-new-in-v11) and [episode-slots §3](../../intro/episode-slots.md#3-cold-open-lines). **[K]: re-verify.** 31 chars ✓. The pause before "Enough." holds the low piano note |
| **9.1 (news)** | `$1.4T` | Egg: `30GW · COMMITTED (NOT PAID)` |
| **9.2 ("music fired")** | `BACKSTOP` | All stems mute; a baseball backstop rises in silence with an empty bleacher. **Lint: 8 glyphs (>7).** Default fix per [episode-slots §4](../../intro/episode-slots.md#4-bar-9-the-slot): the picture leads the mute by one frame (f494), giving 16 frames. See [open-questions.md](open-questions.md) #5 |
| **9.3 ("music rehired")** | `CODE RED` | The band slams back. **Lint: 7 glyphs (spaces are free): TIGHT pass** |
| **9.4 (transition object)** | The code-red siren lifts off ELGOOG's tower and flies across the water to NopeAI's spire, carrying the camera | Siren ≤2 revolutions/s (photosensitivity) |
| **Skyline change** | GATESTAR rings multiply; MISANTHROPIC's lighthouse grows a book-return slot `$1.5B`; a lit window in NopeAI shows a desk plate `RESERVED` | From the FINAL slot table |
| **PODIUM state** (WC-INT §5) | A small **receipt curl** hangs off the podium on the hill. **No motion** | — |
| **Orb toast** | `human (probably)` | **First episode of `(probably)`**, matching the in-episode Orb micro |
| **Title subtitle** | `backstop not included` | 21 chars ✓ |
| **RUMPT podium beat** | Only the receipt curl | — |

## Eggs that update
| Egg | EP06 state |
|---|---|
| `you are here` dot | Notch **6 of 12** |
| 1993 screen rotation (bar 3) | **10°** (last episode at 10°) |
| Coat hook | +1 collar |
| Gold threads in the cold-open hoodie | **3** (the Sep 4 dinner) |
| Firing tally | Unchanged (4 marks) |
| KORG board | `KORG 4.1` (Nov 17 [V]); banner `KORG 5: NEXT QUARTER` |
| Valuation ticker | `$500B` (Oct 2025 secondary [V]) |
| MISANTHROPIC lighthouse egg | A tiny `$183B` tag on the price-tag string |

## Lint and safety
- Must-read headline glyphs: `$1.4T` (5) ✓ · `BACKSTOP` (8) ✗ → fixed by the one-frame picture lead · `CODE RED` (7, spaces free) ✓ TIGHT.
- The siren flight: rotation stays ≤2 rev/s, and the red flash stays ≤80% luminance and ≤3 flashes per 24 frames.
- New must-read text: about 21 characters plus the subtitle.

## Delivery note for the quote
"I'll find you a buyer…" is polite and helpful, almost warm. Then comes the pause, and "Enough." lands as quietly as the first half, with no bite. The joke is that he doesn't raise his voice even when shutting someone down.
