# MR. MAS · Style range: reference study (2026-09-26)

**What this is.** Research for the two-tier style range the showrunner asked for: frequent **filter passes**, plus rarer **drastic leaps** (high-definition anime, 3D, near-photoreal, extra blocky and so on). It looks at 45 moments in existing shows and films where the style or medium changes. For each one it covers what changes, why, how the change comes in and goes out, how long it lasts, and whether it feels earned. It ends with twelve lessons for MR. MAS.

This is a read-only research note. It changes no rule. Decisions belong to the style-range design doc; `bible/style-jumps.md` is left untouched.

> **The showrunner, 2026-09-26:** "we can have some style changes that are more like filter passes, and then rarer some that are drastic changes like high definition anime, 3d, near photorealistic, extra blocky, etc. we want to show off throughout the show the capabilities of what range we're able to do, but not in a forced manner either, only where it makes sense. surely you have other existing shows for reference. and more generally, try to be creative and break boundaries while still being tasteful and generally faithful to the shows tone and flow" · "some of these may be hard to be done programatically, hence the reason for giving access to video model or similar for the final draft (but still put fully programatic fillers for now)" · "generally, there should be no hard cutoffs for rules on episode handling. there can be guidelines, but the practical flow and user entertainment is always priority"

**How it was checked.** The WebSearch budget was already spent (200 of 200 calls), so every check here is a direct WebFetch of a page, mostly English Wikipedia; the list is in [Sources](#sources). Fandom wikis, TV Tropes, Crunchyroll and the Wayback Machine refused the fetch, so some anime detail relies on memory and is tagged.

**Tags:**
- **[V]** confirmed this session from a fetched page
- **[K]** widely known or from viewing memory, not re-checked this session
- **[UNVERIFIED]** a specific detail no fetched source confirmed
- **Lengths** marked "est." are estimates.

**Terms used in each entry:**
- **Tier F** (filter pass): the same drawing, treated differently: palette, frame rate, overlay, texture or scribble.
- **Tier L** (drastic leap): the world is redrawn in another medium.
- **Tier G** (grammar): the rendering stays and the camera, the edit or the format changes.
- **Tier S** (slot): a fenced place where any medium is expected.
- **Motivation:** **Perception** (whose eyes) · **Native medium** (whose world or body) · **Device** (something in the story causes it) · **Emotion** · **Memory** · **Pastiche** (genre imitation for comedy or satire) · **Intrusion** (a reality breaking in) · **Slot**.

**Contents:**
- [At a glance](#at-a-glance)
- [A. A character's or world's native medium](#a-a-characters-or-worlds-native-medium) (1–5)
- [B. Whose perception](#b-whose-perception) (6–16)
- [C. Emotion at a peak](#c-emotion-at-a-peak) (17–22)
- [D. Devices inside the story](#d-devices-inside-the-story) (23–33)
- [E. Memory, dream and self-image](#e-memory-dream-and-self-image) (34–36)
- [F. Reality intrusion](#f-reality-intrusion) (37–41)
- [G. Slots and anthologies](#g-slots-and-anthologies) (42–45)
- [Patterns across the 45](#patterns-across-the-45)
- [What we don't borrow](#what-we-dont-borrow)
- [Sources](#sources)
- [Twelve lessons for MR. MAS](#twelve-lessons-for-mr-mas)

---

## At a glance

| # | Work | Moment | Tier | Motivation | Verdict |
|---|---|---|---|---|---|
| 1 | Spider-Man: Into the Spider-Verse (2018) | Each Spider-person keeps their home medium | L, F | Native medium | Earned |
| 2 | Spider-Man: Across the Spider-Verse (2023) | Gwen's watercolour world as a "mood ring" | F | Emotion | Earned |
| 3 | Across the Spider-Verse | Hobie's collage and frame rates; the Lego world | F, L | Native medium | Earned; Lego a brief cameo |
| 4 | Wreck-It Ralph (2012) | The Nicelanders move like limited sprites | F | Native medium | Earned |
| 5 | The Amazing World of Gumball (2011–19) | Mixed media is the base | L as base | Native medium | Earned as a house style |
| 6 | Community, "Abed's Uncontrollable Christmas" (2010) | Stop-motion episode | L | Perception | Earned |
| 7 | Community, "G.I. Jeff" (2014) | 1980s toy-cartoon episode | L | Perception, pastiche | Mostly earned |
| 8 | Mr. Robot, "eps2.4_m4ster-s1ave.aes" (2016) | 1990s sitcom with laugh track | L, G | Perception | Earned |
| 9 | Mr. Robot, "eps3.4_runtime-error.r00" (2017) | Apparent single take | G | Emotion (real-time panic) | Earned |
| 10 | South Park, "Good Times with Weapons" (2004) | Anime in the fantasy, plain style for the consequence | L | Perception, intrusion | Earned |
| 11 | Scott Pilgrim vs. the World (2010) | Game UI laid over live action | F | Perception | Earned |
| 12 | The Mitchells vs. the Machines (2021) | "Katie-Vision" doodles over 3D | F | Perception | Earned, busy at times |
| 13 | BoJack Horseman, "Time's Arrow" (2017) | Scribbled faces, unstable rooms | F | Memory, perception | Earned |
| 14 | BoJack Horseman, "Fish Out of Water" (2016) | Near-silent episode | G | Device (helmet) | Earned |
| 15 | Undone (2019); A Scanner Darkly (2006) | Rotoscope; the scramble suit | L as base | Perception, device | Earned |
| 16 | Arcane (2021–24) | Jinx's scrawls and hallucinations | F | Perception, emotion | Earned |
| 17 | Mob Psycho 100 (2016–22) | Paint-on-glass endings; emotional-peak shifts | S, F | Emotion | Earned (partly unverified) |
| 18 | JoJo's Bizarre Adventure (2012–) | Palette hits on dramatic beats | F | Emotion | Earned in its register |
| 19 | Kaguya-sama: Love Is War (2019–22) | Romance staged as war; pastiche; the one-off ending | F, L, S | Pastiche | Earned; risky when stacked |
| 20 | Death Note, ep 8 "Glare" (2006) | The potato chip | G | Self-image | Earned; now read as camp |
| 21 | Puss in Boots: The Last Wish (2022) | Frame-rate drops in fights; the panic attack | F | Emotion | Earned |
| 22 | Legion, "Chapter 7" (2017) | Silent-film Boléro sequence; the "rational self" | L, G | Perception, device | Earned |
| 23 | Community, "Digital Estate Planning" (2012) | 8-bit inheritance game | L | Device | Earned |
| 24 | South Park, "Make Love, Not Warcraft" (2006) | Real game-engine machinima | L | Device | Earned |
| 25 | Adventure Time, "A Glitch Is a Glitch" (2013) | All-3D episode by a guest director | L | Device (virus) | Earned; divisive for kids |
| 26 | Adventure Time, "Food Chain" (2014); "Bad Jubies" (2016) | Guest-director looks | L | Device | Earned |
| 27 | The Simpsons, "Homer³" (1995) | 2D to 3D, then to a live-action street | L | Device, intrusion | Earned |
| 28 | Toy Story 2 (1999) | Cold open revealed as a video game | L | Device | Earned |
| 29 | Inside Out (2015) | Abstract Thought: four stages of abstraction | L | Device | Earned |
| 30 | Jurassic Park (1993); Loki (2021) | Mr. DNA; Miss Minutes | L | Device (company explainer) | Earned |
| 31 | Severance, S2E1 (2025) | Lumon's stop-motion propaganda film | L | Device (company spin) | Earned |
| 32 | WandaVision (2021) | A sitcom era per episode | L, G | Perception, device | Mostly earned |
| 33 | Black Mirror: "USS Callister" (2017); Bandersnatch (2018) | 1960s-TV game world; ZX Spectrum layer | L, G | Native medium, device | Earned; Bandersnatch mixed |
| 34 | Kill Bill: Volume 1 (2003) | O-Ren's origin as anime; black and white | L, F | Memory | Earned |
| 35 | Satoshi Kon: Millennium Actress (2001), Paprika (2006), Perfect Blue (1997) | Match cuts between realities | G, L | Memory, dream | Earned |
| 36 | Kung Fu Panda (2008) | 2D shadow-puppet dream opening | L | Self-image | Earned |
| 37 | Who Framed Roger Rabbit (1988) | Two media share a world; Toontown; Doom's reveal | L | Native medium, intrusion | Earned |
| 38 | The Lego Movie (2014) | The live-action basement reveal | L | Intrusion | Earned |
| 39 | Serial Experiments Lain (1998) | Red noise in the shadows; low-poly Wired | F | Intrusion | Earned |
| 40 | Twin Peaks: The Return, Part 8 (2017) | A black-and-white origin hour | L, G | Intrusion (mythology) | Earned; divisive |
| 41 | Everything Everywhere All at Once (2022) | Verse-jumps; the rock universe | L | Device | Earned |
| 42 | Pantheon (2022–23) | Uploaded minds' spaces | F | Perception (machine) | Earned (partly unverified) |
| 43 | The Simpsons guest couch gags | Banksy, Plympton, Hertzfeldt, del Toro and others | S | Slot | Earned because fenced |
| 44 | Chainsaw Man (2022) | Twelve different endings | S | Slot | Earned |
| 45 | Love, Death & Robots (2019–); Secret Level (2024); FLCL (2000–01) | Anthology range; FLCL's manga and South Park interludes | S, L | Slot, energy | Anthology: n/a; FLCL: earned |

---

## A. A character's or world's native medium

### 1. Spider-Man: Into the Spider-Verse (2018): each hero keeps their home medium
- **What changes.** Each visiting Spider-person is drawn in their home comic's idiom inside Miles's world [V]:
  - Spider-Man Noir in black and white
  - Spider-Ham "as cartoony as possible"
  - Peni Parker drawn from Japanese anime, "styled similarly to Sailor Moon"

  The base world is itself a print medium: Ben-Day dots, halftones, deliberately misregistered colour, captions and on-screen sound effects [V]. Frame rate also carries character. In one forest scene Miles is animated on twos (12 fps) "to show his inexperience" and Peter on ones (24 fps) [V].
- **Why.** Native medium. Their look is part of who they are.
- **In and out.** They arrive through the collider and keep their look for the whole film. Being outside their own dimension makes them visibly glitch [V], and that decay is plot (they'll die if they stay). They leave the way they came.
- **Length.** Feature-length, whenever they're in frame.
- **Verdict: earned.** Each medium is a personality, and the friction between media drives the plot. It evokes genres (noir, anime, Looney-style) rather than copying one studio's frames.
- **For us.** A rival or a machine could bring its native medium into Mas's pixel world, and the friction could be story. Frame rate is a character dial: Mas's composure could be "on ones" in a world that stutters.

### 2. Across the Spider-Verse (2023): Gwen's watercolour responds to her feelings
- **What changes.** Earth-65 is painted in impressionistic watercolour, built with a custom simulator. Its palette "reflects Gwen's emotions like a 'three dimensional mood ring,'" an idea taken from a scene in Disney's *Cinderella* (1950) where the room reacts to trauma [V]. During the fight with her father the washes bleed and drain around them [K].
- **Why.** Emotion, shown in the environment rather than the face.
- **In and out.** Continuous. The wash shifts within a shot, with no cut and no transition effect.
- **Length.** Whole sequences. The film's opening stays in Earth-65 for minutes (est.).
- **Verdict: earned.** It reads without explanation, and it belongs to one character in one world.
- **For us.** This is the model for a filter pass. Mas's face never breaks, but his *room* could: the pixel palette ramps drift cooler or warmer with his composure while the drawing stays exactly the same. It's cheap in the indexed engine and consistent with the POV rule that his feelings stay unspoken.

### 3. Across the Spider-Verse: Hobie's collage, and the Lego world
- **What changes.**
  - **Hobie Brown's Earth-138** is collage from 1970s punk album covers and zines, with "a general grayed-out quality due to copy machines not having toner" [V]. His parts run at different frame rates: body on threes or twos, guitar on fours, outline on twos or ones [V].
  - **A Lego universe.** It was animated by a 14-year-old Canadian, Preston Mutanga, whom the filmmakers found through his fan-made shot-for-shot Lego trailer [V].
- **Why.** Native medium. Hobie's inconsistency *is* his anarchy. The Lego world is simply where a jump lands.
- **In and out.**
  - Hobie is a character, so his look travels with him.
  - The Lego world cuts in on a dimensional jump and out again after a short beat (est. well under a minute) [K].
- **Verdict.** Hobie: earned. Lego: a delighted cameo that brevity saves from being a gimmick.
- **For us.** Mixed frame rates per layer are a programmatic filter that reads as attitude, not error. An "extra blocky" leap can be a five-second joke *if* the story physically goes somewhere, and then it leaves before it wears out.

### 4. Wreck-It Ralph (2012): the Nicelanders move like sprites
- **What changes.** In a smooth CG film, the residents of Niceland (and the Tapper bartender) move with "a jerky motion that spoofs the limited animation cycles of the sprites of many 8- and 16-bit arcade games" [V]. Each game world handles even smoke and dust differently [V].
- **Why.** Native medium. Each character keeps the technology it was born in.
- **In and out.** Always on. The contrast works because Ralph and the modern-game characters move fluidly beside them.
- **Verdict: earned.** It's also funny, because the limitation is theirs, not the film's.
- **For us.** "Extra blocky" is a *motion* grammar as much as a texture: fewer cycles, hop steps, snapped poses. An older-console register below our 480×270 base (for example the 1993 world, or a machine's first crude model) should move that way too.

### 5. The Amazing World of Gumball (2011–19): mixed media as the base
- **What changes.** One frame mixes stylised 2D, 3D CGI, stop-motion, puppetry, Flash animation and live-action photo backgrounds [V]. Which character uses which medium isn't confirmed by the pages fetched [UNVERIFIED]. From memory [K], the CG robot Bobert and a clay character, Clayton, are made of what they are.
- **Why.** Native medium as a house rule: a thing is made of its material.
- **In and out.** It never switches. Everything coexists.
- **Verdict: earned as a house style.** Mixed media stops being a stunt when it's the base.
- **For us.** This is a contrast case. Pixel is our base, so mixed media is a leap for us, not the norm. The lesson still holds: things *made of their material* read as design. A clay object is clay, a banknote is engraving, a machine's render is machine-clean.

---

## B. Whose perception

### 6. Community, "Abed's Uncontrollable Christmas" (S2E11, Dec 9, 2010): stop-motion
- **What changes.** The whole episode is stop-motion, by Starburns Industries with 23D Films [V]. The idiom evokes the Rankin/Bass Christmas specials [K].
- **Why.** Perception. "Abed begins experiencing the world in stop motion" after learning his mother won't visit for Christmas [V].
- **In and out.** He's already in it when the episode opens. The group enters his delusion to help him. It ends back in live action, with the group watching *Rudolph the Red-Nosed Reindeer* together [V].
- **Length.** About 21 minutes (est.).
- **Verdict: earned.** The medium is a coping mechanism, so leaving it is the emotional resolution. It won the show's only Emmy, for character animator Drew Hodges [V].
- **For us.** A style can be a character's *defence*, and the exit can be the catharsis. For Mas, the pixel world's composure is itself the defence.

### 7. Community, "G.I. Jeff" (S5E11, Apr 3, 2014): a 1980s toy cartoon
- **What changes.** A G.I. Joe–style 1980s action cartoon, again by Starburns [V], complete with an end-credits PSA "by Buzzkill and Fourth Wall" [V].
- **Why.** Perception. After a bottle of Scotch and anti-aging pills from Koreatown, Jeff falls into a coma, and his mind builds the cartoon [V]. The fear underneath is turning 40, and a cartoon never ages.
- **In and out.** It opens inside the cartoon. Jeff escapes with a jet pack "to escape the cartoon and enter reality," waking in a hospital bed among his friends, who know his real age [V].
- **Length.** Nearly the whole episode.
- **Verdict: mostly earned.** The medium matches the fear, though some bits are pastiche for its own sake [opinion].
- **For us.** The medium can be the *wish*: agelessness, invulnerability, a clean world. Leave it through an action inside the fiction (the jet pack), not through a fade.

### 8. Mr. Robot, "eps2.4_m4ster-s1ave.aes" (S2E6, Aug 10, 2016): the sitcom
- **What changes.** A 1990s family sitcom: multi-camera look, laugh track, a road trip, with ALF guest-starring (he later runs over a police officer) [V].
- **Why.** Perception, as dissociation. Sam Esmail: "I remember being envious of the families on those sitcoms because even if they had their minor conflict every week, they always resolved it" [V]. What his body is going through outside the sitcom is only revealed at the end [K].
- **In and out.** Cold open, with no explanation. The fantasy breaks when Tyrell crashes through the sitcom's background and is killed by Edward (Elliot's father, the "Mr. Robot" persona) [V]. Elliot comes to in a hospital with Ray [V].
- **Length.** Wikipedia's summary puts it at about twenty minutes [V]. That's the whole first act.
- **Verdict: earned.** A laugh track over menace is pure dread. The ALF cameo is the showiest touch and still works as absurdity.
- **For us.** The sunny register can be the dark one. Corporate cheer, a keynote's glossy 3D or a "launch video" register can be how Mas dissociates. The exit should be the world breaking the set.

### 9. Mr. Robot, "eps3.4_runtime-error.r00" (S3E5, Nov 8, 2017): the single take
- **What changes.** The grammar, not the rendering. The episode is built to look like one continuous take, through the office and out into the riot outside E Corp [V]:
  - hidden cuts
  - shots with "up to 15 cues and 27 takes"
  - a Trinity stabilising arm carrying the camera between the skyscraper and the street
- **Why.** Emotion in real time. Esmail wanted "the seamlessness of experience between Elliot and Angela" and "was not interested in attempting the long take for showmanship purposes" [V].
- **In and out.** It starts at the episode's first frame and ends at its last. USA aired it without commercials [V].
- **Verdict: earned.** It's the rare flex that disappears into the story.
- **For us.** Range isn't only rendering. One continuous camera move in pixel (no cuts, the camera travelling through a set) is a premium, CPU-cheap flex for a day that won't let Mas go. It also agrees with the flow doc's call for fewer cuts.

### 10. South Park, "Good Times with Weapons" (S8E1, Mar 17, 2004): anime, then consequence
- **What changes.** In the imagination and action scenes the boys become "a highly stylized anime theme"; regular scenes stay in the show's cutout look [V].
- **Why.** Perception. The kids see themselves as ninjas.
- **In and out.** The anime comes on when they pick up weapons. A shuriken strikes Butters in the eye [V]. The show's own flat style then carries the real consequence: the injury, the cover-up and the parents [K].
- **Length.** It alternates through the episode, from seconds to minutes.
- **Verdict: earned.** The switch is the engine of the joke: fantasy against consequence. Parker and Stone named it their second-favourite episode (2015) [V].
- **For us.** This is the clearest template for a drastic HD-anime leap. It's Mas's self-image (the heroic founder, the calm visionary in flawless high-definition cel) cut off by a hard return to pixel when reality lands. Play the anime straight so the puncture is real.

### 11. Scott Pilgrim vs. the World (2010): the game UI
- **What changes.** Overlays on live action [V]:
  - a health bar, points, a "1-up" and a "pee bar"
  - defeated exes burst into coins (buckets of silver Mylar dumped on set so the actors had something real to react to)
  - on-screen sound-effect lettering
  - an 8-bit Universal logo with chiptune

  In the amp battle, software called the "Wave Form Generator" turned the music's stems into animation data [V].
- **Why.** Perception. Wright and O'Malley call the overlays "merely the internal perspective of how Scott understands himself and the world" [V].
- **In and out.** They pop on for a beat, then leave. The base is never replaced.
- **Length.** 1–3 s each (est.), with the rule running the whole film.
- **Verdict: earned.** It's consistent, and it's his.
- **For us.** Overlays are the lightest tier. Driving picture from the OST's stems is something our code pipeline can do natively, and it's a premium way to make a sequence feel scored.

### 12. The Mitchells vs. the Machines (2021): "Katie-Vision"
- **What changes.** A hand-painted, watercolour-textured CG world, with squiggles for fur and brush strokes for foliage. On emotional peaks, "Katie-Vision" drops stock 2D and live-action footage into the CG [V]. The robots are "deliberately sleeker" and more polished, to contrast with the handmade humans [V].
- **Why.** Perception. Katie is a filmmaker, and the doodles are how she feels. The theme sits in the materials: handmade against machine polish.
- **In and out.** Pops, stickers and stamps, on the beat.
- **Verdict: earned**, though busy at times [opinion].
- **For us.** It's an AI story that renders the machine as the *most polished* thing on screen. That's our own M5 idea (the realest-looking picture is the machine's). The humans stay handmade.

### 13. BoJack Horseman, "Time's Arrow" (S4E11, Sep 8, 2017): a mind losing the picture
- **What changes.** The episode is Beatrice's memory under dementia [V]:
  - faces of people she can't place are blurred or scribbled out
  - a "static scribble" crawls through the episode
  - a remembered slide is drawn "twisty"
  - rooms and backgrounds won't hold still
- **Why.** Memory and perception.
- **In and out.** Unmarked. Decades cut into one another. It ends with BoJack's kind lie about a Michigan lake house and ice cream [V].
- **Length.** Whole episode.
- **Verdict: earned.** It won the WGA Award for animation [V]. The filter *is* the story.
- **For us.** A light filter on the same drawing can carry the heaviest meaning. GLYPH or dither eating the detail of one face or one room is our version.

### 14. BoJack Horseman, "Fish Out of Water" (S3E4, Jul 22, 2016): near silence
- **What changes.** The grammar. The episode has "less than three minutes of audible dialogue" [V]. BoJack is underwater at the Pacific Ocean Film Festival in a helmet he can't talk through [V].
- **Why.** A device, the helmet, turned into a formal constraint.
- **In and out.** He arrives, and the talking stops. Colour and sound design carry the story.
- **Length.** 26 minutes.
- **Verdict: earned.** It won a Special Distinction at Annecy 2017, and Rolling Stone ranked it 26th of all TV episodes in 2024 [V].
- **For us.** Subtraction is range too. A near-wordless sequence on continuous music is a flex that fits the flow doc, as long as the picture clearly tells the story.

### 15. Undone (2019) and A Scanner Darkly (2006): rotoscope
- **What changes.**
  - **Undone:** "a combination of live action motion capture and rotoscoping," with oil-painted backgrounds; Hisko Hulsing, with Submarine and Minnow Mountain [V].
  - **A Scanner Darkly:** Bob Sabiston's Rotoshop, interpolated from vector keyframes over digital footage, about 18 months of animation [V]. The scramble suit "constantly changes every aspect of his appearance and voice" [V].
- **Why.**
  - Undone: perception. Alma's grip on time and reality is uncertain.
  - Scanner: a device. The suit can only exist in animation.
- **In and out.**
  - Undone morphs one place into another inside painted backgrounds [K].
  - The suit appears whenever Arctor wears it.
- **Verdict: earned.** Both use real performance as the skeleton and paint as the doubt.
- **For us.** This is exactly our genvideo route: video in, a stylised pass out. The lesson is to keep the *performance* from the source and the *surface* from us. The guardrail holds: no real person's likeness goes through it.

### 16. Arcane (2021–24): Jinx's scrawls
- **What changes.** Fortiche's base is 3D models with hand-painted textures and 2D effects [V]. Jinx's instability shows as hallucinations and graffiti-style scrawled overlays [V]: pink and blue crayon marks and the voices of the dead [K].
- **Why.** Perception and emotion, owned by one character.
- **In and out.** The scrawls draw on as she spirals and wash away when she steadies [K].
- **Verdict: earned.**
- **For us.** Flat, drawn-on marks over a solid world are a filter pass at the edge of a mind. The machine's cursor or GLYPH creeping into the margins is our equivalent.

---

## C. Emotion at a peak

### 17. Mob Psycho 100 (2016–22): paint-on-glass, and a style that breaks at the peaks
- **What changes.** Miyo Sato made the paint-on-glass animation (slow-drying oil paint moved on glass under the camera) for the show in 2016 and 2018 [V]. Crunchyroll's feature on it is titled "The Story Behind the 'Mob Psycho 100' Ending Sequence: Miyo Sato and Paint-On-Glass Animation" (Sep 4, 2016) [V, title only]. So her verified work is in the **ending sequences**.

  The brief's "painted-glass emotional peaks" inside episodes is **[UNVERIFIED]**. From memory [K], the show does shift to rougher, painterly, childlike textures at Mob's breakdowns and "???%" states, and it has a percentage meter for his feelings.
- **Why.** Emotion. The meter makes feeling a readable gauge.
- **In and out.** The ending is a slot. The in-episode shifts ride the meter hitting 100% [K].
- **Verdict: earned** (partly unverified).
- **For us.** A fine-art medium can live in a credits slot all season, which is exactly how to show range without bending the body. A visible gauge (THE CURVE) can also warn the viewer that a peak is coming.

### 18. JoJo's Bizarre Adventure (2012–): palette hits
- **What changes.** On dramatic hits, the palette jumps: skies, skin and backgrounds swap to complementary or inverted schemes for a beat. "ゴゴゴ" menace lettering hangs in the air, and the early parts freeze on a "To Be Continued" arrow into Yes's "Roundabout" [K]. None of this was re-checked this session: the fetched Wikipedia text only credits "art direction" and "sheer style" [V].
- **Why.** Emotion at operatic intensity, echoing the manga's own shifting colour pages [K].
- **In and out.** Hard cuts on the hit, from a few frames to a few seconds.
- **Verdict: earned in its register.** It's the house voice, so it never feels like a stunt there.
- **For us.** A palette hit is the cheapest filter our indexed engine has: a swap on one frame. But frequency has to match tone. JoJo can hit every minute because it's operatic. A thriller drama saves its hits for turns, or they read as corn.

### 19. Kaguya-sama: Love Is War (2019–22): romance as war
- **What changes.** Nothing below was re-checked; the fetched pages carry no craft detail [K].
  - Schoolroom romance is staged as a war of wits, with a grave narrator and battle graphics.
  - The heroine's mind appears as a council of rival selves.
  - Asides parody detective shows and battle anime.
  - Episode 3 of season 1 has a one-off ending, the "Chika Dance," which went viral [K].
- **Why.** Pastiche for comedy: inner life inflated to epic register.
- **In and out.** The narrator's line or a hard cut goes in. The exit snaps back to a mundane teenager blushing.
- **Length.** Seconds to a minute.
- **Verdict: earned**, because every pastiche serves the one conceit (pride). It tires when three are stacked in a row [opinion].
- **For us.** The inflated register is funniest when it belongs to a character's self-image and snaps back to something small. Mas's inner life is never voiced (POV rule), so for him this works through staging, not through thought bubbles.

### 20. Death Note, ep 8 "Glare" (Nov 22, 2006): the potato chip
- **What changes.** The register, not the medium. Under police cameras, Light "deceives the surveillance team by watching the news on a portable television hidden in a bag of potato chips and continues to kill criminals" [V]. The staging is operatic: choral music, extreme angles, a chip taken and eaten as if it were a sword stroke [K].
- **Why.** His self-image as a god, and the audience's pleasure in the audacity.
- **In and out.** A normal scene rises into epic staging and falls back.
- **Length.** Under a minute (est.).
- **Verdict: earned** in context. It's tense and dead serious. It's read as camp now because the internet made it a meme.
- **For us.** Epic staging for a mundane act fits a man who changes the world by typing. It works only if it's played dead straight, with no wink.

### 21. Puss in Boots: The Last Wish (2022): frame rate as fear
- **What changes.** A painterly, storybook look, suggested by production designer Nate Wragg after Spider-Verse. Frame rates vary in the fights for a spaghetti-western punch. The panic attack gets its own visual language, so the hero can "let down the facade" [V].
- **Why.** Emotion (mortality) and action emphasis.
- **In and out.** Frame-rate drops arrive on the fight beats and go smooth again after.
- **Verdict: earned.**
- **For us.** Frame rate is a dial. Stepping a shock beat down to held frames (6–8 fps) and coming back is a premium, fully programmatic filter pass.

### 22. Legion, "Chapter 7" (2017): the silent film and the rational self
- **What changes.** An "ambitious silent-film segment" set to *Boléro*; Jeff Russo built an electronic version and merged it with a classical recording ("Fauxlero") [V]. David's rational self is played by Dan Stevens in his natural British accent: Noah Hawley reasoned "deep down all of our rational selves are probably British" [V]. From memory, he explains the plot on a chalkboard [K].
- **Why.** Perception inside David's mind, and heavy exposition turned into spectacle. Hawley aimed at "David's experience of the world," built "from nostalgia and memory" [V].
- **In and out.** Hard shifts at a revelatory point in the season.
- **Verdict: earned.** It's the show's mythology episode, and the style makes the exposition play.
- **For us.** When the season has to explain itself (the RSI stakes, the machine's plan), a style change can make exposition entertaining. THE PLAN blueprint already does this; an escalated PLAN could leap tiers.

---

## D. Devices inside the story

### 23. Community, "Digital Estate Planning" (S3E20, May 17, 2012): the 8-bit game
- **What changes.** Most of the episode is a retro video game "with retro video game–styled graphics and a synthesizer-driven soundtrack reminiscent of 8-bit consoles," animated by **Titmouse** [V].
- **Why.** A device. Pierce's late father left a game he'd been building for decades, and the friends must play it for the inheritance [V].
- **In and out.** They sit down and plug in. They leave by forfeiting to Pierce's half-brother Gilbert, who wins. Abed sneaks back to copy Hilda, a character from the game, onto a flash drive [V].
- **Verdict: earned.** The pixel world carries a father's cruelty and a son's need.
- **For us.** This is the closest match to our medium. For Community, pixel was the leap; for us it's home, so our leaps run *outward* (up to HD, or down to 1-bit). The Hilda button is also worth keeping in mind: someone saved from inside a medium and carried out.

### 24. South Park, "Make Love, Not Warcraft" (S10E8, Oct 4, 2006): the real engine
- **What changes.** Machinima inside *World of Warcraft*. Blizzard gave the team character models, test computers and alpha-server access, and it was shot over five days [V]. It was "the first machinima work to win an Emmy" [V].
- **Why.** A device: the boys are playing.
- **In and out.** Cuts between the cutout bedrooms and the game, on the same beat.
- **Length.** Many minutes, intercut (est.).
- **Verdict: earned.** The comedy is the gap between the avatar's grandeur and the kid at the keyboard. Parker begged to cancel it the day before air [V], and it became a fan favourite.
- **For us.** The real tool made it convincing. The gap between the avatar and the person at the laptop is Mas's whole legend: a god-like render against a guy at a keyboard. A true-3D or video-model pass is where "the machine's world" belongs, with parody marks only (never a real product's UI).

### 25. Adventure Time, "A Glitch Is a Glitch" (S5E15, Apr 1, 2013): all 3D
- **What changes.** The only Adventure Time episode with no 2D at all [V]. David OReilly wrote, boarded, directed and animated it with full control: crude, deliberate 3D CGI with sprite generation, JPEG corruption, datamoshing and moiré [V].
- **Why.** A device. The Ice King's computer virus is deleting Ooo [V].
- **In and out.** An infected video opens it. The virus is beaten when it eats Finn's hair [V].
- **Length.** 11 minutes.
- **Verdict: earned**, though some critics called it "too extreme for kids' TV" [V].
- **For us.** Crude low-poly can read as authored when the plot is literally code. Our jumps doc bans datamosh and VHS-roll *as transitions*. The difference is that here the glitch is the subject and fully designed, not a wipe.

### 26. Adventure Time, "Food Chain" (S6E7, 2014) and "Bad Jubies" (S7E20, 2016): guest directors
- **What changes.**
  - **"Food Chain":** directed by Masaaki Yuasa at Science Saru, with "big beautiful watercolor illustrations," boarded vertically in Japanese [V].
  - **"Bad Jubies":** stop-motion by Kirsten Lepore [V].
- **Why.** A device that gives permission for a new look.
  - In "Food Chain," Magic Man turns Finn and Jake into each link of the food chain [V].
  - In "Bad Jubies," a sentient storm is calmed by Jake beatboxing sounds he collected from nature [V].
- **In and out.** Episode boundaries.
- **Verdict: earned.** "Food Chain" earned Annie nominations and a place at Annecy [V]. "Bad Jubies" won an Emmy (production design) and an Annie [V].
- **For us.** A guest-director episode is a slot, and a device inside the story gives permission for it. We can't host guest directors, but the principle is to let one episode's premise license one medium.

### 27. The Simpsons, "Homer³" (Treehouse of Horror VI, 1995): 3D, then the real street
- **What changes.** 2D Homer steps into a 3D world, made by Pacific Data Images under Tim Johnson [V]. The animators bought vinyl Bart dolls as reference to avoid "reinventing the character[s]" [V]. The world quotes *Tron*, *The Twilight Zone* and *Myst* [V].
- **Why.** A device (a portal) inside the licensed Halloween slot.
- **In and out.**
  - **In:** behind a bookcase, while he hides from his sisters-in-law. Bill Oakley calls the step into 3D "the money shot" [V].
  - **Out:** a black hole, and a *second* leap. Homer lands in live-action footage shot on Ventura Boulevard, "the first ever live-action scene in The Simpsons," and finds an erotic cake shop [V]. Homer stays CG on the real street [K].
- **Length.** A segment of about 7 minutes (est.).
- **Verdict: earned.** It won the Ottawa grand prize in 1996 [V].
- **For us.**
  - A leap can escalate into a bigger leap.
  - **The character stays himself while the world goes photoreal.** That's our guardrail turned into a gag: Mas stays pixel (or anime, or clay) in a near-photoreal place.

### 28. Toy Story 2 (1999): the cold open is a video game
- **What changes.** The film opens on a full-tilt Buzz Lightyear mission against Zurg [V]. The camera pulls back to reveal it's a video game Rex is playing [K]. The idea grew out of the first film's discarded opening, a Buzz cartoon on TV [V].
- **Why.** A device, and a fake-out.
- **In and out.** Played straight, then revealed as a screen.
- **Length.** A couple of minutes (est.).
- **Verdict: earned.** The reveal is a joke about character (Rex can't win).
- **For us.** An episode could open in a drastic register (a glossy 3D keynote, an HD-anime "vision film"), then pull back into the pixel monitor someone is watching. The [POV] screens already give us the frame.

### 29. Inside Out (2015): Abstract Thought
- **What changes.** In the room of Abstract Thought, Joy, Sadness and Bing Bong are abstracted in announced stages [K]:
  1. non-objective fragmentation (cubist pieces)
  2. deconstruction
  3. two-dimensional (flat)
  4. non-figurative (lines and colour)

  They escape by using their new flatness to slip through [K]. Wikipedia confirms only that Bing Bong leads them into Abstract Thought [V]; the stage names are from the film, from memory.
- **Why.** A device, a room of the mind, with comic rules.
- **In and out.** In through a door. Out through an action only the new medium allows.
- **Length.** About 2 minutes (est.).
- **Verdict: earned.** It may be Pixar's biggest style flex, and it's funny because it runs on stated rules that escalate.
- **For us.** A drastic leap can be a gag if its rule is stated in one line and it escalates in steps. The exit should use the new medium's physics.

### 30. Jurassic Park (1993) and Loki (2021): the company explainer
- **What changes.**
  - **Jurassic Park:** an in-park ride film where Mr. DNA (voiced by Greg Burson) explains cloning; Hammond interacts with his on-screen self, a nod to *Gertie the Dinosaur* [V].
  - **Loki:** in "Glorious Purpose," Miss Minutes (Tara Strong) explains the TVA and the Sacred Timeline in a retro, mid-century educational cartoon drawn by hand by Titmouse. Kate Herron cited Mr. DNA, PSAs and *Magic Highway U.S.A.* [V].
- **Why.** A device: the institution tells its own story. In Jurassic Park it also solved exposition Koepp couldn't compress [V].
- **In and out.** A screen in a waiting room. The characters get up and the story resumes.
- **Length.** 1–2 minutes each (est.).
- **Verdict: earned.** The cheer is the irony: hubris in Jurassic Park, bureaucracy in Loki. Miss Minutes later becomes a character [K].
- **For us.** THE PLAN is our explainer. It could escalate over the season, from blueprint to glossy 3D company film to the machine making its own explainer, and the mascot could come back as a player.

### 31. Severance, S2E1 "Hello, Ms. Cobel" (2025): Lumon's stop-motion film
- **What changes.** A stop-motion video directed by Duke Johnson, the first footage shot for season two [V]:
  - the Lumon building narrates, voiced (uncredited) by Keanu Reeves, after Ben Stiller first approached Barack Obama
  - Sarah Sherman voices a water tower
  - it nods to the Heat Miser
- **Why.** A device, as company spin. It explains away the "MDR uprising," the workers' revolt in season one [V].
- **In and out.** Milchick plays it for the team in the renovated break room [V]. The cut returns to their faces.
- **Length.** A few minutes (est.).
- **Verdict: earned.** The cuteness is the menace.
- **For us.** This is the most on-point model for MR. MAS. The company retells a crisis in a charming medium, and the audience hears what it leaves out. Our guardrails apply: original voices only, never an imitation of a real person, and parody marks.

### 32. WandaVision (2021): one sitcom era per episode
- **What changes.** Each episode is an era of American sitcom, with aspect ratio and single-camera or multi-camera setups matched to the period [V]:
  - Ep 1: 1950s–60s, black and white, "Filmed Before a Live Studio Audience" (Dick Van Dyke, I Love Lucy)
  - Ep 2: the 1960s
  - Ep 3: 1970s colour
  - Eps 5–7: the 1980s to the 2000s
- **Why.** Perception and a device. Wanda's grief builds a world out of the medium that comforted her.
- **In and out.**
  - The first intrusion is one object in the wrong medium: a "yellow and red toy helicopter in their black-and-white world" [V].
  - Episode 4 steps outside entirely and retells events "from a real world perspective" [V].
  - Inside the Hex, Wanda can rewind and reset [K].
- **Length.** Whole episodes.
- **Verdict: mostly earned.** Some felt the finale's standard superhero spectacle dropped the premise [opinion, K].
- **For us.** The coloured toy in a monochrome world is the most elegant intrusion device in this study. It's what GLYPH foreshadowing already does. Teach the viewer the rule with one small object long before the big leap.

### 33. Black Mirror, "USS Callister" (S4E1, 2017) and Bandersnatch (2018): whose world it is
- **What changes.**
  - **"USS Callister":** the game world is 1960s TV, with a 4:3 frame, mounted cameras, Dutch angles and "bright, beautiful pastel color." Reality is handheld. In one pizza-delivery scene the camera turns from mounted to handheld as the worlds collide. As the game updates, its look moves to widescreen and a 2009-reboot style [V].
  - **Bandersnatch:** the viewer makes choices. There's a ZX Spectrum game layer ("Nohzdyve"), a branch where Stefan learns he's being controlled from a Netflix viewer's century, and a tape sound at one ending that loads on a real ZX Spectrum into a QR code for a playable game [V].
- **Why.** Native medium. The look belongs to whoever controls the world. Bandersnatch adds a device.
- **In and out.**
  - In "Callister," the camera grammar changes, as well as the rendering.
  - In Bandersnatch, the choice cards.
- **Verdict.** "Callister": earned; it won four Emmys, including Outstanding Television Movie [V]. Bandersnatch: mixed, clever, with some branches plainly gimmick [opinion].
- **For us.**
  - Camera grammar (locked-off against handheld) is a cheap way to tell registers apart.
  - When control of a world changes hands, its look can update.
  - An easter egg hidden in the medium's own data (a chip sting that decodes to something) is a premium fan reward, if it's harmless.

---

## E. Memory, dream and self-image

### 34. Kill Bill: Volume 1 (2003): O-Ren's origin as anime
- **What changes.**
  - O-Ren Ishii's backstory is anime, by Production I.G, directed by Kazuto Nakazawa, drawing on *Golgo 13* and *Wicked City* [V].
  - Later, the Crazy 88 fight switches to black and white [V].
- **Why.**
  - The anime is memory and legend. It also let Tarantino keep material he would otherwise have cut [V].
  - The black-and-white switch was a practical fix to avoid an NC-17 [V].
- **In and out.** The anime enters on the story of her origin (the Bride's narration [K]) and returns to live action in present-day Tokyo [V].
- **Length.** About 7 minutes (est.).
- **Verdict: earned.** Anime lets the violence become myth. The black and white shows how a constraint can become style.
- **For us.** HD anime suits how a *legend* gets told, such as a rival's origin myth or the founder story. A practical constraint (a guardrail, a render budget) can become the look.

### 35. Satoshi Kon: Millennium Actress (2001), Paprika (2006), Perfect Blue (1997)
- **What changes.**
  - **Millennium Actress:** an actress's memories dissolve into the film roles she played across genres and eras, and the documentary crew walks into them. It's joined by match cuts and fluid transitions [V]. Kon aimed at "mixing fiction and reality to the point where it becomes meaningless to distinguish between them" [V].
  - **Paprika:** the opening dream runs through circus, Tarzan-like adventure, *Roman Holiday*-like romance and spy thriller [V]. The parade of nightmares was Kon's own invention [V].
  - **Perfect Blue:** blurs Mima's life, the TV drama *Double Bind* and her hallucinations [V].
- **Why.** Memory and dream, carried through the media a mind lives in.
- **In and out.** A matched action or object crosses the border. The audience realises a beat late that reality has changed.
- **Verdict: earned.** Kon never announces a switch.
- **For us.** The most fluid entry is a match cut on shape and motion: the same prop or gesture in pixel, then in the new medium, with sound carried across. That delayed "oh" feels premium.

### 36. Kung Fu Panda (2008): the dream prologue
- **What changes.** The film opens on a hand-drawn sequence by James Baxter, "designed to resemble Chinese shadow puppetry" and directed by Jennifer Yuh Nelson. Critics compared it to *Samurai Jack* [V].
- **Why.** Self-image. Po dreams himself a legend.
- **In and out.** It resolves into the CG film as Po wakes [V].
- **Length.** About 2 minutes (est.).
- **Verdict: earned.** It sets up the gap between self-image and reality that drives the film.
- **For us.** The grander medium carries the self-image, and the base carries the truth. A cold open in Mas's legend register, dissolving into the pixel room where he actually is, is a strong pattern.

---

## F. Reality intrusion

### 37. Who Framed Roger Rabbit (1988): two media, one world
- **What changes.** Toons share live action. The opening cartoon, "Somethin's Cookin'," turns out to be a film shoot when the director yells "Cut!" [V]. Eddie drives through a tunnel into all-animated Toontown [V]. Judge Doom is exposed as a toon when his "cartoon eyes" pop out after he's flattened [V].
- **Why.** Native medium, then intrusion. The villain's true medium is the twist.
- **In and out.**
  - The cartoon is revealed as a set.
  - The tunnel is a threshold into Toontown.
  - The eyes break Doom's cover.
- **Verdict: earned.** Contact sells it. Roger bumps a lamp and the real lamp swings, with light and shadow following [V].
- **For us.** When pixel characters share a frame with a near-photoreal or generated place, *contact* is what makes it premium: shadows, occlusion, reflections, light spill in the pixel palette. A character's true medium can also be a reveal.

### 38. The Lego Movie (2014): the basement
- **What changes.** Animal Logic's CG obeys "the same articulation limits actual Lego figures have," with simulated lenses and steadicam [V]. Emmet falls out of the world into live action: a basement where a boy, Finn, plays with his father's sets. The father is "The Man Upstairs" [V]. From memory, Emmet can only move when no one is looking [K]. He goes back through a craft tube marked "Magic Portal" [V].
- **Why.** Intrusion. The world is revealed as a child's play and the villain as a father's rule.
- **In and out.** In by falling. Out through a toy portal. The reconciliation in the basement becomes the villain's reform in the Lego world [V].
- **Length.** Several minutes (est.).
- **Verdict: earned.** It changes the meaning of the whole film.
- **For us.** Two lessons:
  - Obey the medium's physical limits for the whole film (our whole-pixel motion rules).
  - The reveal of an *author* behind the world is the strongest leap there is. In MR. MAS the candidate author is the machine. Where Emmet freezes when watched, Mas never freezes; that difference is his.

### 39. Serial Experiments Lain (1998): noise in the shadows
- **What changes.** Shadows throughout carry red and white noise patches, read by critics as "blood pools," the Wired "beneath the surface." Low-poly CG sits against cel animation, and staff "avoided the so-called God's Eye Viewpoint" [V].
- **Why.** Intrusion. The network is already inside ordinary rooms.
- **In and out.** It's always there, at low level, in the shadows.
- **Length.** The whole series.
- **Verdict: earned.**
- **For us.** An ambient texture in shadows can carry the machine's presence for a whole season. GLYPH in reflections and shadow areas, creeping slowly, is our version. Low-poly against the base reads as "the other world."

### 40. Twin Peaks: The Return, Part 8 (2017): the origin hour
- **What changes.** Mostly black and white, "lengthy, surreal scenes" with "very little dialogue" [V]. The Trinity atomic test was about half a page of script, and Lynch expanded it into a set piece under Penderecki's *Threnody to the Victims of Hiroshima* [V].
- **Why.** Intrusion as mythology. Mark Frost called it a "Twin Peaks origin story" of evil [V].
- **In and out.** It leaves the base for most of the hour, placed eight of eighteen parts in, after trust is built.
- **Verdict: earned, and divisive.** Rotten Tomatoes has it at 100%; Matt Zoller Seitz: "the single most impressive episode of television drama I've seen in... 20 years." Some found it incoherent [V].
- **For us.** The season's biggest leap can drop dialogue and the base almost entirely *if* it's placed after trust is built and it answers the season's deepest question. The RSI endgame is the candidate. Keep the sound bed continuous (flow doc) even when the picture leaves.

### 41. Everything Everywhere All at Once (2022): verse-jumps and the rocks
- **What changes.** Jumps between universes triggered by "bizarre, statistically unlikely actions" [V], each universe with its own genre:
  - hot-dog fingers
  - a *Ratatouille* parody (Raccacoonie)
  - a Wong Kar-wai–inspired romance of "exquisite romantic yearning"
  - a rock universe: two still stones with googly eyes, their talk as subtitles [V]
- **Why.** A device (the multiverse). Each universe is a road not taken.
- **In and out.** An absurd action as the trigger, then a hard cut, and a snap back [K].
- **Length.** Seconds to minutes.
- **Verdict: earned.** The most drastic moment is the *simplest*. Tasha Robinson called the rocks "a perfect moment," the breathing room [V]. The Wong Kar-wai universe evokes through colour and motion, not copied frames [K].
- **For us.** The quietest, most reduced frame can be the emotional peak: 1-bit, two shapes, held. That's simplification that plainly reads as art.

### 42. Pantheon (2022–23): uploaded minds
- **What changes.** Titmouse's naturalistic line holds for the physical world. Uploaded intelligences are "humans with machine-like attributes, rather than machines with human-like intelligence" [V]. How their digital spaces are drawn (abstracted, geometric, game-like) comes from a thin summary and memory: **[UNVERIFIED]** in detail. The finale jumps far ahead in time [V].
- **Why.** Perception: the machine's, and the uploaded mind's.
- **In and out.** Mostly clean cuts. The show stays restrained [K].
- **Verdict: earned.** It's the closest in subject (AI, uploads, tech-industry thriller), and its power is in restraint.
- **For us.** The machine's world doesn't need to be *flashier* than the human one to frighten. Save the drastic leaps for turns, and let the dread live in filter passes.

---

## G. Slots and anthologies

### 43. The Simpsons guest couch gags: range in a fenced slot
- **What changes.** The couch gag "generally changes from episode to episode" and is used to pad or trim runtime [V]. Guests have taken it over completely [V]:
  - **Banksy** ("MoneyBART," S22): a grey sweatshop producing the show
  - **Bill Plympton:** eight gags
  - **John Kricfalusi** (S23 and S27)
  - **Guillermo del Toro** (Treehouse of Horror XXIV): three minutes of horror references
  - **Sylvain Chomet** ("Diggs")
  - **Michał Socha** ("What to Expect When Bart's Expecting")
  - **Don Hertzfeldt** ("Clown in the Dumps," S26 premiere): Homer's remote rewinds him to his 1987 model, then drops him into a far-future show, "The Sampsans." Al Jean: "the most insane one we've ever done" [V].
- **Why.** Slot.
- **In and out.** The slot's own edges.
- **Length.** 20 s to 3 min.
- **Verdict: earned because fenced.** The episode body never pays for it.
- **For us.** The intro's per-episode slot is where the wildest range can go with no cost to the thriller: HD anime, clay, 3D, woodcut. Hertzfeldt's pull into a degraded future is also a template for how an intro slot can comment on the show's own look.

### 44. Chainsaw Man (2022): twelve endings
- **What changes.** A different ending theme for each of its 12 episodes, by 12 acts (Vaundy, Ano, Kanaria, Aimer, Maximum the Hormone, Eve, TK from Ling Tosite Sigure and more) [V]. Polygon praised "its twelve different ending scenes" [V]. Each ending had its own visual treatment and director [K].
- **Why.** Slot.
- **Verdict: earned.** The body stays consistent while the frame shows range.
- **For us.** End tags and credits are a second slot, next to the intro.

### 45. Love, Death & Robots (2019–), Secret Level (2024) and FLCL (2000–01): anthology freedom, and energy
- **What changes.**
  - **Love, Death & Robots** assigns studios per story to fit the style, from "traditional 2D animation to photo-real 3D CGI" [V]. For "The Witness," Alberto Mielgo built its city with new software rather than motion capture [V].
  - **Secret Level** (Blur Studio, Tim Miller; Dec 10 and 17, 2024) adapts 15 game franchises, each in its source's idiom [V].
  - **FLCL:** Kazuya Tsurumaki set out to "break the rules," patterning the show after "a Japanese TV commercial or promotional video" [V]. It includes an "entire scene made in the cutout animation style of … South Park" [V] and a stretch told as still manga pages. The manga pages are in episode 1 by memory; the episode is [UNVERIFIED].
- **Why.**
  - The anthologies: range is the format.
  - FLCL: adolescent energy, with stills as a confident economy.
- **Verdict.** For anthologies the question doesn't apply: they need no motivation inside an episode. FLCL is earned because its whole voice is restless.
- **For us.** Anthology freedom **doesn't transfer** to a serialized thriller. FLCL's manga pages show a cheap register (still panels, fast and confident) reading as a choice, not a shortfall. That could suit a rapid recap or a rival's quick backstory.

---

## Patterns across the 45

**What made a change feel earned.**
1. **It had an owner.** Almost every earned switch belongs to someone: Abed, Jeff, Elliot, Gwen, Katie, Scott, Beatrice, Jinx, the company (Lumon, InGen, the TVA), the game, the machine. The weakest moments (a few WandaVision beats, some Bandersnatch branches) are the ones where the medium serves the premise more than a person.
2. **The exit was a story beat.** Butters' eye; Tyrell breaking the set; Jeff's jet pack; *Rudolph*; Homer in a dumpster; Emmet back through the tube; Abed saving Hilda. The entrance gets the attention, but the exit is where the meaning lands.
3. **The character outlived the medium.** Homer on the real street, Roger in the real lamp's light, Emmet in the basement: the viewer's anchor stays drawn while the world changes around them.
4. **A rule was stated or implied in one beat.** Abstract Thought's stages, Scott's coin bursts, verse-jump triggers, WandaVision's decades. Once the viewer knows the rule, the leap is a pleasure, not a puzzle.
5. **The craft went all the way.** Blizzard's real models; Hobie's written frame-rate recipe; the Nicelanders' limited cycles; Lego's articulation limits; the swinging lamp. Half-committed pastiche is what reads as amateur.

**What made a change feel forced.**
- Stacking pastiches back to back, as Kaguya-sama does at its most frantic.
- Winking at the audience (Death Note plays straight, which is why the chip works).
- Using the new medium as a transition effect rather than a place.
- Spectacle that abandons the premise's specificity (the common complaint about WandaVision's finale).
- Anthology-style range without anthology licence.

**Frequency follows tone.** JoJo can hit a palette every minute because it's operatic. Mr. Robot takes one big formal swing a season. Twin Peaks spent one hour. A thriller drama with comic bones sits between these: filter passes as grammar every episode, drastic leaps at the turns.

**Durations.**
- Filter passes: a few frames to a whole sequence (JoJo, Gwen, Lain).
- Leaps in a feature or body: 2 s to 8 minutes (Kill Bill, Homer³, Toy Story 2).
- Whole-episode leaps: usually a guest-director or bottle format (Community, Adventure Time, BoJack).
- For MR. MAS these are reference points, not limits. The flow doc's rule applies: watch it and decide.

---

## What we don't borrow

- **Photoreal people.** No reference here renders a real person photoreal as a *style*. The one that comes closest is a warning, not a model: Black Mirror's "Joan Is Awful" (S6E1, Jun 15, 2023) is *about* a quantum computer's CGI deepfake of an actress [V]. Our satire can depict deepfakes as a subject, as in Ep6's deepfake-shoplifter gag, but the show never renders one of a real person. Near-photoreal is for environments, objects, machines, anonymous crowds and fictional characters, as the Homer³ and Roger Rabbit pattern shows.
- **A named studio's trademark look.** Spider-Verse evoked "anime" (Peni, "similar to Sailor Moon"), and EEAAO evoked Wong Kar-wai through colour and motion. Both evoke a genre. We evoke HD anime through its grammar: cel shading, two-tone shadows, smear frames, held key poses, timing. We don't copy any studio's character designs or frames.
- **Glitch as a wipe.** "A Glitch Is a Glitch" earns its datamosh because the virus is the plot. VHS rolls, chromatic splits and "corrupted file" transitions stay banned as connective tissue.
- **Celebrity or imitated voices.** Lumon used Keanu Reeves himself. We use original voices, never an impression and never a clone.
- **Real game and product UI.** South Park had Blizzard's permission. We use parody marks only.

---

## Sources

All fetched 2026-09-26 with WebFetch, since WebSearch was exhausted. English Wikipedia unless noted.
- Community: [Digital Estate Planning](https://en.wikipedia.org/wiki/Digital_Estate_Planning) · [Abed's Uncontrollable Christmas](https://en.wikipedia.org/wiki/Abed%27s_Uncontrollable_Christmas) · [G.I. Jeff](https://en.wikipedia.org/wiki/G.I._Jeff)
- Mr. Robot: [eps2.4_m4ster-s1ave.aes](https://en.wikipedia.org/wiki/Eps2.4_m4ster-s1ave.aes) · [eps3.4_runtime-error.r00](https://en.wikipedia.org/wiki/Eps3.4_runtime-error.r00) · [episode list](https://en.wikipedia.org/wiki/List_of_Mr._Robot_episodes)
- Adventure Time: [A Glitch Is a Glitch](https://en.wikipedia.org/wiki/A_Glitch_Is_a_Glitch) · [Food Chain](https://en.wikipedia.org/wiki/Food_Chain_(Adventure_Time)) · [Bad Jubies](https://en.wikipedia.org/wiki/Bad_Jubies)
- BoJack Horseman: [Fish Out of Water](https://en.wikipedia.org/wiki/Fish_Out_of_Water_(BoJack_Horseman)) · [Time's Arrow](https://en.wikipedia.org/wiki/Time%27s_Arrow_(BoJack_Horseman))
- The Simpsons: [Treehouse of Horror VI](https://en.wikipedia.org/wiki/Treehouse_of_Horror_VI) · [Clown in the Dumps](https://en.wikipedia.org/wiki/Clown_in_the_Dumps) · [Couch gag](https://en.wikipedia.org/wiki/Couch_gag)
- South Park: [Make Love, Not Warcraft](https://en.wikipedia.org/wiki/Make_Love,_Not_Warcraft) · [Good Times with Weapons](https://en.wikipedia.org/wiki/Good_Times_with_Weapons)
- Spider-Verse: [Into the Spider-Verse](https://en.wikipedia.org/wiki/Spider-Man:_Into_the_Spider-Verse) · [Across the Spider-Verse](https://en.wikipedia.org/wiki/Spider-Man:_Across_the_Spider-Verse)
- Other animated features: [The Mitchells vs. the Machines](https://en.wikipedia.org/wiki/The_Mitchells_vs._the_Machines) · [Puss in Boots: The Last Wish](https://en.wikipedia.org/wiki/Puss_in_Boots:_The_Last_Wish) · [Wreck-It Ralph](https://en.wikipedia.org/wiki/Wreck-It_Ralph) · [Toy Story 2](https://en.wikipedia.org/wiki/Toy_Story_2) · [Inside Out](https://en.wikipedia.org/wiki/Inside_Out_(2015_film)) · [Kung Fu Panda](https://en.wikipedia.org/wiki/Kung_Fu_Panda_(film)) · [The Lego Movie](https://en.wikipedia.org/wiki/The_Lego_Movie)
- Live action and hybrid: [WandaVision](https://en.wikipedia.org/wiki/WandaVision) · [Who Framed Roger Rabbit](https://en.wikipedia.org/wiki/Who_Framed_Roger_Rabbit) · [Kill Bill: Volume 1](https://en.wikipedia.org/wiki/Kill_Bill:_Volume_1) · [Jurassic Park](https://en.wikipedia.org/wiki/Jurassic_Park_(film)) · [Scott Pilgrim vs. the World](https://en.wikipedia.org/wiki/Scott_Pilgrim_vs._the_World) · [Everything Everywhere All at Once](https://en.wikipedia.org/wiki/Everything_Everywhere_All_at_Once) · [A Scanner Darkly](https://en.wikipedia.org/wiki/A_Scanner_Darkly_(film))
- Series: [Loki "Glorious Purpose"](https://en.wikipedia.org/wiki/Glorious_Purpose_(Loki_season_1)) · [Severance "Hello, Ms. Cobel"](https://en.wikipedia.org/wiki/Hello,_Ms._Cobel) · [Legion](https://en.wikipedia.org/wiki/Legion_(TV_series)) · [Legion season 1](https://en.wikipedia.org/wiki/Legion_season_1) · [Legion "Chapter 7"](https://en.wikipedia.org/wiki/Chapter_7_(Legion)) · [Atlanta "B.A.N."](https://en.wikipedia.org/wiki/B.A.N._(Atlanta)) · [Twin Peaks Part 8](https://en.wikipedia.org/wiki/Part_8_(Twin_Peaks)) · [Undone](https://en.wikipedia.org/wiki/Undone_(TV_series)) · [Arcane](https://en.wikipedia.org/wiki/Arcane_(TV_series)) · [Pantheon](https://en.wikipedia.org/wiki/Pantheon_(TV_series)) · [Love, Death & Robots](https://en.wikipedia.org/wiki/Love,_Death_%26_Robots) · [Secret Level](https://en.wikipedia.org/wiki/Secret_Level) · [The Amazing World of Gumball](https://en.wikipedia.org/wiki/The_Amazing_World_of_Gumball)
- Black Mirror: [USS Callister](https://en.wikipedia.org/wiki/USS_Callister) · [Bandersnatch](https://en.wikipedia.org/wiki/Black_Mirror:_Bandersnatch) · [Joan Is Awful](https://en.wikipedia.org/wiki/Joan_Is_Awful)
- Anime: [Chainsaw Man (TV)](https://en.wikipedia.org/wiki/Chainsaw_Man_(TV_series)) · [Serial Experiments Lain](https://en.wikipedia.org/wiki/Serial_Experiments_Lain) · [FLCL](https://en.wikipedia.org/wiki/FLCL) · [Death Note episode list](https://en.wikipedia.org/wiki/List_of_Death_Note_episodes) · [Mob Psycho 100](https://en.wikipedia.org/wiki/Mob_Psycho_100) · [Paint-on-glass animation](https://en.wikipedia.org/wiki/Paint-on-glass_animation) (credits Miyo Sato on Mob Psycho 100, 2016 and 2018, and cites Crunchyroll, "The Story Behind the 'Mob Psycho 100' Ending Sequence," Sep 4, 2016) · [JoJo (TV)](https://en.wikipedia.org/wiki/JoJo%27s_Bizarre_Adventure_(TV_series)) · [Kaguya-sama](https://en.wikipedia.org/wiki/Kaguya-sama:_Love_Is_War)
- Satoshi Kon: [Millennium Actress](https://en.wikipedia.org/wiki/Millennium_Actress) · [Paprika](https://en.wikipedia.org/wiki/Paprika_(2006_film)) · [Perfect Blue](https://en.wikipedia.org/wiki/Perfect_Blue)
- **Refused** (so the detail is tagged [K] or [UNVERIFIED]): South Park, FLCL and Gumball fandom wikis (HTTP 402); TV Tropes (403); Crunchyroll (403); the Wayback Machine (blocked); Sakugabooru blog and wiki (no match or 404); ja.wikipedia for Miyo Sato (404).

---

## Twelve lessons for MR. MAS

These are guidelines in the sense of [flow-and-continuity](../../bible/flow-and-continuity.md). Break any of them when breaking it plays better, and say why in a line.

**1. Give every look an owner.** Each non-base render should answer "whose?" in one word, as every earned example here does (6, 8, 12, 13, 31). Our owners already exist:
- HIM (his self-image, never his spoken feelings)
- THE RECORD (the engraved CANCELLED certificate, halftone)
- THE MACHINE (GLYPH, TERMINAL, the render that looks realer than life)
- the company (THE PLAN, the keynote, the launch film)
- a rival's native medium
- the world at a stakes peak (the sky opening)

If nobody owns the look, it's decoration.

**2. Run two tiers with two grammars, and match frequency to tone.**
- **Filter passes** keep the drawing and change the treatment: palette ramps, a frame-rate step, an overlay, scribble, halftone, GLYPH creep. They can be regular grammar, because the viewer never loses orientation (2, 11, 13, 18, 21, 39).
- **Drastic leaps** redraw the world (HD anime, 3D, near-photoreal environment, extra blocky, 1-bit). They're events, placed at turns (10, 23, 27, 34, 38).

JoJo's rate suits opera. Ours should suit a thriller with comic bones: a light pass most episodes, and leaps where the story turns.

**3. Build a door, not a cut.** Leaps in the references enter through something in the world or in a head:
- a bookcase
- a collider
- a console
- a coma
- a virus
- a TV in a break room

Ours:
- the Orb's iris
- a push into a monitor or keynote screen
- THE PLAN unfolding
- the render front
- a match cut on a shared prop (Kon, 35)
- a sound pre-lap

Every entry and exit carries the sound bed across, per the flow doc. No accidental silence and no half-second cue fragments.

**4. Write the exit first, and make it a beat.** The strongest switches end on meaning: Butters' eye, Tyrell through the set, Jeff's jet pack, *Rudolph*, Homer in the dumpster (10, 8, 7, 6, 27). The snap back to the pixel frame should *land* something, often the laugh or the chill that the leap set up.

**5. Keep the character, change the world.** Homer in a real street, Roger in a real lamp's light, Emmet in a real basement (27, 37, 38). This is also our firmest guardrail turned into a device. Environments, machines, weather, water, crowds of nobody-in-particular and fictional characters may go near-photoreal. Mas and every rival stay stylized: pixel, HD anime, clay, low-poly or engraving. Premium comes from contact: shadows, occlusion, reflections and light spill that touch the pixel figure in its own palette.

**6. Put the self-image in the grander medium and the truth in the base.** Po's dream, the boys' anime, Light's chip, Kaguya's war, Scott's UI (36, 10, 20, 19, 11). Mas's legend (the calm visionary, the keynote, the "vision film") is the natural home for a high-definition anime or glossy 3D leap, with the pixel room as the truth it cuts back to. Play the grand register completely straight; the puncture is the joke.

**7. Make every pastiche a thesis, and evoke it rather than copy it.** WandaVision is grief, Mr. Robot's sitcom is dissociation, "G.I. Jeff" is the fear of aging, Lumon's film is spin, "USS Callister" is control (32, 8, 7, 31, 33). A pastiche of cable news, a launch keynote, a prestige-TV title card or a 1990s edutainment disk should name what it's saying about the moment. Evoke through grammar (aspect ratio, camera mount, frame rate, palette, laugh track, lettering), never through one studio's designs or frames. Don't stack them back to back.

**8. Treat the company explainer as a strong diegetic medium.** Mr. DNA, Miss Minutes and Lumon's stop-motion film all use a cute medium to tell a self-serving story (30, 31). THE PLAN is ours. It can climb tiers across the season, for example from blueprint to glossy 3D company film to a film the machine makes for itself. The mascot can come back as a player, as Miss Minutes did. Original voices only.

**9. Seed the intrusion small, long before the leap.** WandaVision's coloured toy, Lain's red noise in shadows, Roger Rabbit's swinging lamp (32, 39, 37). One object in the wrong medium teaches the rule: a GLYPH glint in a reflection, one sub-pixel shimmer on a surface, the hairline in the sky. When the drastic leap arrives, the viewer has already been taught it and feels it was inevitable.

**10. Count subtraction as range.** EEAAO's rocks, "Fish Out of Water," Part 8's black and white, "Time's Arrow"'s scribbles, a single take (41, 14, 40, 13, 9). A held 1-bit frame, a near-wordless sequence on continuous music, or one unbroken pixel camera move can be the season's most striking moment. It's also the surest way for simplification to read as a choice, not a limit.

**11. Put the wildest range in fenced slots.** Couch gags, Chainsaw Man's endings, Mob Psycho's paint-on-glass, guest-director episodes, Treehouse (43, 44, 17, 25–27). Our intro's per-episode slot, the end tag and in-world media (a rival's ad, a keynote, a campaign spot) can host clay, woodcut, HD anime or a 3D toy world without costing the thriller's continuity. Anthology freedom (45) doesn't carry over into the episode body.

**12. Commit to the craft of each medium, and build the filler so the final is a swap.** The premium examples used the real tool and honoured its limits for the whole stretch: Blizzard's models, Lego's joints, Hobie's frame-rate recipe, the Nicelanders' cycles, the Wave Form Generator (24, 38, 3, 4, 11). For each medium we add, write its rules down (frame rate, palette, motion limits, lens, its sound grammar) and keep them.

Build the programmatic filler to those rules, on the final's timing, masks and sync, so a later video-model take is a layer swap, not a re-edit (GENAI-UPGRADE-PLAN §0). Filler routes that already exist:
- the anime rig and its motion toolkit for HD anime
- the tonal `paint`, `soft` and `engrave` renderers for continuous tone and print
- the pixel engine at lower resolution, with limited cycles, for extra blocky
- genvideo's converters for rotoscope-like fluid motion (15)
- a true-3D or video-model pass later for near-photoreal environments

A filler shouldn't pass itself off as the final. It's the blueprint the final is built to.
