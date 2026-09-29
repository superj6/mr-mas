# ML concepts across the season

> **Status: AGREED, 2026-09-29.** Showrunner: "throughout the rest of the season i want to slowly explain a few of the key ml concepts in more detail where relevant". Ep1 is locked, so this starts in Ep2 and nothing is retrofitted.

## Rules
- **At most one concept in depth per episode,** about 20–30 s. Later episodes call back to it in 2–4 s.
- **Each grows out of that episode's AI milestone** ([season-flashbacks-overview §4](../timeline/season-flashbacks-overview.md), the milestones layer) or a story beat already planned. The concepts build on each other in order.
- **Never a lecture.**
  - Someone in the scene has a reason to explain it: fear, a sale, a deposition, a question the audience has too.
  - A visual in the show's pixel language carries the idea, drawn in the milestone's own medium where it has one.
  - Mas's planner V.O. can add what it means for the race. It never explains the mechanics for him.
- **Technically right, even when simplified.** Each episode's pass includes a short accuracy review of its concept.
- **It counts toward the episode's flashback cap** (150 s). Ep4 is already the heaviest, so its deepened beat is paid for by a trim elsewhere in Ep4.

## The map

| Ep | Concept | The trigger already in the plan | How it's explained |
|---|---|---|---|
| **2** | **Learned, not programmed:** a neural network is millions of knobs nudged by examples, so nobody wrote the winning move | The Email Séance: AlphaGo's Move 37 | As Nole's 2016 email rises, the Go stones replay over a wall of turning knobs. His fear is the reason we see it. |
| **3** | **What GTP actually is:** next-word prediction, plus attention (every word looks at every other word) | "It is ours. We published it.": the transformer paper | A sentence completes word by word, with attention lines to earlier words and a bar chart of candidate next words. Mas's V.O. adds what it means for the race. |
| **4** | **Teaching it manners (RLHF), and why chatbots flatter** | The sycophancy button: Mario's 2017 backflip paper, then 2022's ratings | 👍 and 👎 train the stick figure, then the chatbot. It learns what earns a 👍, flattery included. The existing 8 s beat is deepened. |
| **5** | **Reinforcement learning and self-play:** reward, trial and error, playing yourself | Draft night: OpenAI Five beats the champions | The arena's scoreboard as the reward. It pays off Ep1's "180 years a day". |
| **7** | **Scaling laws:** loss falls predictably with more compute, data and model size | Mario's escape flashback, and GTP-2's box | Mario's curves. They explain why everyone buys chips, and pay off Gerg's "The next one costs billions." (Ep1). |
| **10** | **Thinking time:** letting the model reason longer before it answers | The Vegas callback: the poker bot that paused | Poker chips as seconds of thinking, spent before a hard answer. |
| **11** | **Alignment and self-improvement:** reward hacking, and models helping train their successors | RSI: AlphaZero taught itself | Breakout's tunnel as "it found a trick we didn't intend", then the training loop closing on itself. |

Eps **6, 8, 9 and 12** get callbacks only, to keep the story room. Ep12's family-album montage replays each concept's image once.
