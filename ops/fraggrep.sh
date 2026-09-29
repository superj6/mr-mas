# fraggrep.sh: the fragment check, independent of orgmove.py (docs/ORGANIZATION-PLAN.md §7.5). From the repo root:
#   bash ops/fraggrep.sh 2|2d|3|4|5a|5b
# Prints every code line that still names an old folder by a fragment. Each line must be fixed or be a reviewed record.
D='["'"'"'`/{}$ ]'                                   # what may come before a fragment: a quote, /, {, }, $ or a space
case "$1" in
  2)  F='review-desk|jumps/prev|_reviews|["'"'"']jumps["'"'"'] *, *["'"'"']prev' ;;
  2d) F='dialogue/retired|["'"'"']retired["'"'"']|["'"'"']retired/' ;;
  3)  F='out/(intro|animatic|pixel|reel|dev|structures|range|jumps|genvideo)([/"'"'"'` ,;:)}]|$)|["'"'"']out["'"'"'] *[,/] *["'"'"'](intro|animatic|pixel|reel|dev|structures|range|jumps|genvideo)["'"'"']' ;;
  4)  F='intro-(mix|sfx|vox)([/"'"'"'` ,;:)}]|$)|LISTENING_GUIDE|audio/(vocals|animatic|mix)([/"'"'"'` ,;:)}]|$)|["'"'"']audio["'"'"'] *[,/] *["'"'"'](vocals|animatic|mix)["'"'"']|(AUDIO|audio)[}]?[^a-z]{1,4}(vocals|animatic|mix)["'"'"'/]' ;;
  5a) F='dev/(makeRoot|pixeladv/tools/png|pixeladv/art/room|mcoldopen/orb|mfinale/callart)|["'"'"']dev["'"'"'] *, *["'"'"'](makeRoot|mcoldopen|mfinale|pixeladv)' ;;
  5b) F='dev/(mcoldopen|meras|mdinner1|mdinner2|mrollcall|mfinale|intro|animatic|reel)([/"'"'"'` ,;:)}]|$)|["'"'"']dev["'"'"'] *, *["'"'"'](mcoldopen|meras|mdinner[12]|mrollcall|mfinale|intro|animatic|reel)["'"'"']|src/dev/\$\{' ;;
  *)  echo "usage: bash fraggrep.sh 2|2d|3|4|5a|5b"; exit 2 ;;
esac
git grep -nE "(^|$D)($F)" -- '*.py' '*.sh' '*.ts' '*.tsx' '*.mjs' '*.js' '*.cjs' \
  ':!**/history/**' ':!docs/ORGANIZATION-PLAN.md' ':!ops/**' | cut -c1-200
