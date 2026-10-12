\version "2.24.0"

% MR. MAS: main title, "The Knee" (V1 "Chip Chamber Jazz"), piano reduction.
% Source: audio/theme/score/v1.py with common.py (the cue's notes, harmony and frames); V4's piano voicings
% for the roll call. A playable reduction: the strings' halo, the drums, the brass layers and the chip's
% bar-10 arpeggio are left out; the cold open's drone is a synth in the original.
% 12 bars of 4/4 at quarter = 96 (15 frames a beat at 24 fps), 30.000 s.
% Pitches are entered absolute (c' = middle C).

#(set-global-staff-size 18)
\paper {
  #(set-paper-size "letter")
  ragged-last-bottom = ##f
}

\header {
  title = "MR. MAS"
  subtitle = "Main Title: “The Knee”"
  subsubtitle = "the opening theme, arranged for solo piano"
  poet = "prompt: jgon"
  composer = "music and arrangement: Opus 5.5"
  tagline = ##f
}

fl = \markup \fontsize #-3 \raise #0.7 \flat
sh = \markup \fontsize #-3 \raise #0.7 \sharp
chd = #(define-music-function (txt) (markup?)
  #{ \once \override ChordNames.ChordName.text = #txt #})

swingMark = \markup \small \concat {
  \bold "Swing  " \rhythm { 8[ 8] } "  =  " \rhythm { \tuplet 3/2 { 4 8 } }
}
straightMark = \markup \small \bold "Straight 8ths"

chordsLine = \chordmode {
  \chd \markup "F5" f1
  s1
  \chd \markup "Fm(add9)" f1
  \chd \markup \concat { "D" \fl "maj7" } des2
  \chd \markup "Fm9" f4
  \chd \markup \concat { "C7(" \fl "9)" } c4
  \chd \markup "Fm11" f1
  \chd \markup \concat { "D" \fl "maj9(" \sh "11)" } des1
  \chd \markup \concat { "B" \fl "m9" } bes1
  \chd \markup \concat { "C7(" \sh "9" \fl "13)" } c1
  \chd \markup "Fm9" f2
  \chd \markup \concat { "D" \fl "maj7(" \sh "11)" } des4
  \chd \markup "C7alt" c8
  s8
  \chd \markup "Fm" f4
  \chd \markup "Fm(maj7)/E" f4
  \chd \markup \concat { "Fm7/E" \fl } f4
  \chd \markup "Fm6/D" f4
  \chd \markup \concat { "D" \fl "maj7(" \sh "11)" } des4
  \chd \markup \concat { "C7(" \fl "9" \fl "13)" } c4
  \chd \markup "F9sus4" f2
  s2
  \chd \markup "F5" f2
}

% picture cues and section marks, above the right hand
annotations = {
  \mark \markup \box \bold "Cold open"
  s4 s4^\markup \small \italic "V.O.  “near the singularity;”" s2
  s4 s4^\markup \small \italic "“unclear which side.”" s2
  \mark \markup \box \bold "1993"
  \tempo \straightMark
  s1 \break
  \mark \markup \box \bold "2008"
  \tempo \swingMark
  s1
  \mark \markup \box \bold "Dinner"
  s1^\markup \small \caps "Gerg"
  s1^\markup \small \caps "Alyi" \break
  s1^\markup \small \caps "Mario"
  s1^\markup \small \caps "Nole"
  \mark \markup \box \bold "The Players"
  \tempo \straightMark
  s1 \break
  \mark \markup \box \bold "Skyline"
  \tempo \swingMark
  s1
  \tempo \markup \small \bold "Straight 16ths"
  s2
  \mark \markup \box \bold "Title"
  s2
  s2 s2
  \bar "|."
}

upper = {
  \clef treble
  \key f \minor
  \time 4/4
  \tempo "Dark, in time" 4 = 96

  % 1  cold open: the cursor blinks
  f''4 f'' f'' f'' |
  % 2  the D-flat colour in the pause, the pluck, the leap
  c''8 r8 r4 <f'' f'''>4 <g' g''>16 <aes' aes''> <c'' c'''> <f'' f'''> |
  % 3  1993: the drop on Fm(add9); the machine plays straight
  << { <aes' c'' f''>8-. f''-. f''-. r8 r4 \tuplet 6/4 { c'''16 f'' aes'' c''' ees''' f''' } }
     \\ { g'2. r4 } >> |
  % 4  2008: the knee, swung (the cup-muted stab on beat 2)
  f''8 f'' <aes' c'' f''>-> f'' <ees'' g''> aes'' <e'' c'''> f''' |
  % 5-8  the dinner: the hit, the chip's flat line (beats 2-3), the noir counter-line below
  << { c''4-> f''8 f'' f'' f'' r4 } \\ { <g' bes'>4 c''4~ c''8 bes' aes'4 } >> |
  << { ees''4-> f''8 f'' f'' f'' r4 } \\ { <g'~ c''>4 g'4 f'8 g' aes'4 } >> |
  << { f''4-> f''8 f'' f'' f'' r4 } \\ { <aes' c''~>4 c''4~ c''8 r des'' c'' } >> |
  << { aes''4-> e''8 e'' e'' e'' \tuplet 3/2 { g''8 aes'' c''' } } \\ { <bes' ees''>4 aes'8 g' e'2 } >> |
  % 9  the Players: eight stabs, stop-time; the top line is the knee
  <aes' c'' ees'' f''>8-.-> q-. q-. q-. <aes' c'' f'' g''>-. <c'' f'' g'' aes''>-. <ees'' aes'' c'''>-. <f'' c''' f'''>->\laissezVibrer |
  % 10  skyline: the slow knee above, the muted-trumpet line below (its fall off the D)
  << { f''4 f'' f'' f'' } \\ { c''4~_\markup \small \italic "espr." c''8 bes' aes'4 d''4\bendAfter #-4 } >> |
  % 11  the riser in straight 16ths, then the title: quartal, no third, up to the F
  des''16 f'' aes'' c''' c'' e'' g'' bes'' <bes' ees'' g''>16 bes'' ees''' <c''' f'''>~ <c''' f'''>4 |
  % 12  the hold: the F alone; then the drone returns
  f'''2 r2\fermata |
}

lower = {
  \clef bass
  \key f \minor
  \time 4/4
  \set Staff.pedalSustainStyle = #'bracket

  % 1-2  the open fifth F-C under everything (no third)
  \ottava #-1
  <f,, c,>1\sustainOn |
  <des,, des,>8\sustainOff\sustainOn r8\sustainOff r4 <f,, c,>2\sustainOn |
  \ottava #0
  % 3
  <f, c>2.\sustainOff\sustainOn c8\sustainOff f, |
  % 4  walking, with shells
  <des, c>4\sustainOn aes,4 <f, ees>4\sustainOff\sustainOn <c, bes,>8 e,8\sustainOff |
  % 5-8  the hit's low octave, then the bass keeps walking
  <f,, f,>4\sustainOn aes,4\sustainOff c4 d4 |
  <des, des>4\sustainOn c4\sustainOff aes,4 f,4 |
  <bes,, bes,>4\sustainOn aes,4\sustainOff f,4 des,4 |
  <c, c>4\sustainOn e,4\sustainOff g,4 ges,4 |
  % 9
  <f, c>8-. q-. q-. q-. <des, aes,>-. q-. <c e bes>-. <f,, c,>8->\laissezVibrer |
  % 10  the line cliche in the bass, under a held C
  <f, c>4\sustainOn <e, c>4\sustainOff\sustainOn <ees, c>4\sustainOff\sustainOn <d, c>4\sustainOff\sustainOn |
  % 11
  <des, c>4\sustainOff\sustainOn <c, bes,>4\sustainOff\sustainOn <f,, c, f,>2\sustainOff\sustainOn ~ |
  % 12
  << { <f,, c, f,>2 <f,, c,>2\fermata } { s2 s4.\sustainOff\sustainOn s8\sustainOff } >> |
}

dyn = {
  s1\pp |
  s2 s4\p s4\< |
  s1\mf |
  s2 s2\< |
  s4\f s4\mp s2 |
  s4\f s4\mp s2 |
  s4\f s4\mp s4 s4\< |
  s4\ff s4\mp s4 s4\< |
  s1\f |
  s1\mp |
  s2\< s2\ff |
  s2\pp s2\ppp |
}

\score {
  <<
    \new ChordNames \chordsLine
    \new PianoStaff \with { instrumentName = "Piano" } <<
      \new Staff = "up" << \new Voice \annotations \new Voice \upper >>
      \new Dynamics \dyn
      \new Staff = "down" \lower
    >>
  >>
  \layout {
    \context { \Score \override RehearsalMark.self-alignment-X = #LEFT }
  }
}
