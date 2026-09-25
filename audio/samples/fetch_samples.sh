#!/usr/bin/env bash
# ---------------------------------------------------------------------------------------------------------------------
# MR. MAS: re-download the third-party sample libraries into audio/samples/ (the folder is gitignored).
#
#   bash audio/samples/fetch_samples.sh                  # everything (about 2.3 GB download, 3.1 GB on disk)
#   bash audio/samples/fetch_samples.sh theme-pack       # only what the theme / reel beds need
#   bash audio/samples/fetch_samples.sh vsco2ce-sfx generaluser-gs    # only what the SFX board needs
#   bash audio/samples/fetch_samples.sh --check          # verify what is on disk (no network)
#   bash audio/samples/fetch_samples.sh --dry-run        # print what would be fetched, fetch nothing
#   options: --jobs N (parallel downloads, default 8)    env: SAMPLES_DIR=... (default: this script's folder)
#
# Library selectors are path prefixes of MANIFEST.sha256: generaluser-gs, vsco2ce, vsco2ce-sfx, theme-pack,
# theme-pack/vsco2ce, theme-pack/vcsl, theme-pack/SalamanderGrandPiano-SF2-V3+20200602,
# theme-pack/UprightPianoKW-SF2-20220221.
#
# Who reads what (see docs/RENDERING.md):
#   theme-pack/ + generaluser-gs/   audio/theme (score), audio/reel (reel temp beds), audio/mix (old intro sketch)
#   vsco2ce-sfx/ + generaluser-gs/  audio/sfx (the SFX board and voice blips)
#   vsco2ce/                        licence/readme copies only; no script reads it
#   (intro-sfx, intro-vox, intro-mix, vocals and voices need no sample libraries)
#
# Every file is checked against MANIFEST.sha256 (1,740 files, sha256 of the exact files the committed audio was built
# from). Files already on disk with the right hash are skipped, so the script is safe to re-run or resume.
# Sources are pinned: GitHub files by commit, FreePats archives by versioned file name. Licences: LICENSES.md.
#
# Needs: bash 4+, curl (7.66+ for --parallel), sha256sum, python3 (URL quoting), tar + xz, and for the one .7z archive
# either 7z / 7za / 7zr or py7zr (audio/.venv-theme has it; otherwise `pip install py7zr`).
# ---------------------------------------------------------------------------------------------------------------------
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIR="${SAMPLES_DIR:-$HERE}"
MAN="$HERE/MANIFEST.sha256"
JOBS=8
MODE=fetch
SEL=()

VSCO_REPO=sgossner/VSCO-2-CE;       VSCO_REV=440300901dfe9275fd84e0b7763af1f8443ae62e   # master, 2020-08-04
VCSL_REPO=sgossner/VCSL;            VCSL_REV=c1ea7bcc3c7309650ab0da9d15c9cd1fbc4a4c7e   # master as of 2026-09-25
GUGS_REPO=mrbumpy409/GeneralUser-GS; GUGS_REV=97049183643d5fc5a9322a69c5b09efb667c6c3a  # "Update SoundFont to v2.0.3"
SALAMANDER=SalamanderGrandPiano-SF2-V3+20200602
SALAMANDER_URL="https://freepats.zenvoid.org/Piano/SalamanderGrandPiano/$SALAMANDER.tar.xz"   # ~310 MB
UPRIGHT=UprightPianoKW-SF2-20220221
UPRIGHT_URL="https://freepats.zenvoid.org/Piano/UprightPianoKW/$UPRIGHT.7z"                   # ~29 MB

while [ $# -gt 0 ]; do
  case "$1" in
    --check) MODE=check ;;
    --dry-run) MODE=dry ;;
    --jobs) JOBS="$2"; shift ;;
    --jobs=*) JOBS="${1#--jobs=}" ;;
    -h|--help) sed -n '2,27p' "$0"; exit 0 ;;
    -*) echo "unknown option: $1" >&2; exit 2 ;;
    *) SEL+=("${1%/}") ;;
  esac
  shift
done

[ -f "$MAN" ] || { echo "missing $MAN" >&2; exit 1; }
for t in curl sha256sum python3; do command -v "$t" >/dev/null || { echo "needs $t" >&2; exit 1; }; done
mkdir -p "$DIR"
cd "$DIR"

selected() {  # $1 = manifest path
  [ ${#SEL[@]} -eq 0 ] && return 0
  local s
  for s in "${SEL[@]}"; do [[ "$1" == "$s" || "$1" == "$s/"* ]] && return 0; done
  return 1
}

# source of a manifest path: "gh <repo> <rev> <path in repo>" | "archive salamander|upright"
source_of() {
  local p="$1"
  case "$p" in
    generaluser-gs/GeneralUser-GS.sf2)     echo "gh $GUGS_REPO $GUGS_REV GeneralUser-GS.sf2" ;;
    generaluser-gs/LICENSE.txt)            echo "gh $GUGS_REPO $GUGS_REV documentation/LICENSE.txt" ;;
    vsco2ce-sfx/LICENSE-VSCO2CE-CC0.txt)   echo "gh $VSCO_REPO $VSCO_REV LICENSE" ;;
    vsco2ce-sfx/*)                         echo "gh $VSCO_REPO $VSCO_REV ${p#vsco2ce-sfx/}" ;;
    vsco2ce/*)                             echo "gh $VSCO_REPO $VSCO_REV ${p#vsco2ce/}" ;;
    theme-pack/vsco2ce/*)                  echo "gh $VSCO_REPO $VSCO_REV ${p#theme-pack/vsco2ce/}" ;;
    theme-pack/vcsl/*)                     echo "gh $VCSL_REPO $VCSL_REV ${p#theme-pack/vcsl/}" ;;
    theme-pack/$SALAMANDER/*)              echo "archive salamander" ;;
    theme-pack/$UPRIGHT/*)                 echo "archive upright" ;;
    *) echo "unknown" ;;
  esac
}

# ---- 1. what we want, and what is already good on disk
declare -A WANT=() HAVE=()
ORDER=()
while read -r h p; do
  [ -n "${p:-}" ] || continue
  selected "$p" || continue
  WANT["$p"]=$h; ORDER+=("$p")
done < "$MAN"
[ ${#ORDER[@]} -gt 0 ] || { echo "nothing in MANIFEST.sha256 matches: ${SEL[*]}" >&2; exit 2; }

hash_existing() {
  HAVE=()
  local p h
  while read -r h p; do HAVE["$p"]=$h; done < <(
    for p in "${ORDER[@]}"; do [ -f "$p" ] && printf '%s\0' "$p"; done | xargs -0 -r sha256sum)
}
hash_existing

MISSING=()
for p in "${ORDER[@]}"; do [ "${HAVE[$p]:-}" = "${WANT[$p]}" ] || MISSING+=("$p"); done
echo "samples: ${#ORDER[@]} files selected, $(( ${#ORDER[@]} - ${#MISSING[@]} )) already good, ${#MISSING[@]} to fetch (dir: $DIR)"

if [ "$MODE" = check ]; then
  n=0
  for p in "${MISSING[@]}"; do
    n=$((n + 1)); [ $n -gt 50 ] && { echo "  ... and $(( ${#MISSING[@]} - 50 )) more"; break; }
    if [ -f "$p" ]; then echo "  BAD      $p"; else echo "  MISSING  $p"; fi
  done
  if [ ${#MISSING[@]} -eq 0 ]; then echo "OK: every selected file matches MANIFEST.sha256"; exit 0; fi
  exit 1
fi
[ ${#MISSING[@]} -eq 0 ] && { echo "OK: nothing to do"; exit 0; }

# ---- 2. plan the downloads
TMP="$(mktemp -d "${TMPDIR:-/tmp}/mrmas-samples.XXXXXX")"
trap 'rm -rf "$TMP"' EXIT
GH_DEST=() GH_SRC=()
NEED_SALAMANDER=0 NEED_UPRIGHT=0
for p in "${MISSING[@]}"; do
  read -r kind a _ <<<"$(source_of "$p")" || true
  case "$kind" in
    gh) GH_DEST+=("$p") ;;
    archive) [ "$a" = salamander ] && NEED_SALAMANDER=1; [ "$a" = upright ] && NEED_UPRIGHT=1 ;;
    *) echo "no source known for $p" >&2; exit 1 ;;
  esac
done
# GitHub raw URLs: https://raw.githubusercontent.com/<repo>/<rev>/<url-quoted path>
if [ ${#GH_DEST[@]} -gt 0 ]; then
  : > "$TMP/gh.src"
  for p in "${GH_DEST[@]}"; do source_of "$p" | cut -d' ' -f2- >> "$TMP/gh.src"; done   # "<repo> <rev> <path>"
  python3 - "$TMP/gh.src" > "$TMP/gh.urls" <<'PY'
import sys, urllib.parse
for line in open(sys.argv[1], encoding='utf-8'):
    repo, rev, path = line.rstrip('\n').split(' ', 2)
    print(f'https://raw.githubusercontent.com/{repo}/{rev}/{urllib.parse.quote(path)}')
PY
  mapfile -t GH_SRC < "$TMP/gh.urls"
fi

if [ "$MODE" = dry ]; then
  echo "would download ${#GH_DEST[@]} files from GitHub (pinned commits):"
  for i in "${!GH_DEST[@]}"; do
    [ "$i" -ge 40 ] && { echo "  ... and $(( ${#GH_DEST[@]} - 40 )) more"; break; }
    echo "  ${GH_SRC[$i]}  ->  ${GH_DEST[$i]}"
  done
  if [ $NEED_SALAMANDER = 1 ]; then echo "would download + extract $SALAMANDER_URL -> theme-pack/$SALAMANDER/"; fi
  if [ $NEED_UPRIGHT = 1 ]; then echo "would download + extract $UPRIGHT_URL -> theme-pack/$UPRIGHT/"; fi
  exit 0
fi

command -v tar >/dev/null || { echo "needs tar" >&2; exit 1; }
avail_kb=$(df -Pk "$DIR" | awk 'NR==2 {print $4}')
[ "${avail_kb:-0}" -lt 3800000 ] && echo "warning: only $(( avail_kb / 1024 )) MB free in $DIR (a full fetch needs ~3.1 GB + ~1.5 GB temp)" >&2

# ---- 3. GitHub files, in parallel
if [ ${#GH_DEST[@]} -gt 0 ]; then
  echo "downloading ${#GH_DEST[@]} files from GitHub ($JOBS at a time)…"
  cfg="$TMP/curl.cfg"
  : > "$cfg"
  for i in "${!GH_DEST[@]}"; do
    d="${GH_DEST[$i]//\\/\\\\}"; d="${d//\"/\\\"}"
    printf 'url = "%s"\noutput = "%s"\n' "${GH_SRC[$i]}" "$d" >> "$cfg"
  done
  curl --parallel --parallel-max "$JOBS" --fail --location --retry 3 --retry-delay 2 --create-dirs \
       --silent --show-error -K "$cfg" || echo "some downloads failed; the check below lists them" >&2
fi

# ---- 4. FreePats archives
if [ $NEED_SALAMANDER = 1 ]; then
  echo "downloading $SALAMANDER_URL (~310 MB)…"
  curl --fail --location --retry 3 --silent --show-error -o "$TMP/salamander.tar.xz" "$SALAMANDER_URL"
  mkdir -p "$TMP/sal" theme-pack
  tar -xJf "$TMP/salamander.tar.xz" -C "$TMP/sal"
  src="$TMP/sal/$SALAMANDER"; [ -d "$src" ] || src="$TMP/sal"
  rm -rf "theme-pack/$SALAMANDER"; mv "$src" "theme-pack/$SALAMANDER"
fi
if [ $NEED_UPRIGHT = 1 ]; then
  echo "downloading $UPRIGHT_URL (~29 MB)…"
  curl --fail --location --retry 3 --silent --show-error -o "$TMP/upright.7z" "$UPRIGHT_URL"
  mkdir -p "$TMP/up" theme-pack
  if   command -v 7z  >/dev/null; then 7z  x -y -o"$TMP/up" "$TMP/upright.7z" >/dev/null
  elif command -v 7za >/dev/null; then 7za x -y -o"$TMP/up" "$TMP/upright.7z" >/dev/null
  elif command -v 7zr >/dev/null; then 7zr x -y -o"$TMP/up" "$TMP/upright.7z" >/dev/null
  elif [ -x "$HERE/../.venv-theme/bin/python" ] && "$HERE/../.venv-theme/bin/python" -c 'import py7zr' 2>/dev/null; then
    "$HERE/../.venv-theme/bin/python" -m py7zr x "$TMP/upright.7z" "$TMP/up"
  elif python3 -c 'import py7zr' 2>/dev/null; then python3 -m py7zr x "$TMP/upright.7z" "$TMP/up"
  else
    echo "cannot extract .7z: install p7zip (7z) or py7zr, or build audio/.venv-theme first" >&2; exit 1
  fi
  src="$TMP/up/$UPRIGHT"; [ -d "$src" ] || src="$TMP/up"
  rm -rf "theme-pack/$UPRIGHT"; mv "$src" "theme-pack/$UPRIGHT"
fi

# theme-pack/LICENSES.md was written by the theme agent and is not downloadable; its text lives in ../LICENSES.md now
if [ -d theme-pack ] && [ ! -f theme-pack/LICENSES.md ]; then
  printf '# theme-pack\n\nSources, licences and credit lines: see ../LICENSES.md (section "theme-pack").\nRe-fetch with ../fetch_samples.sh.\n' > theme-pack/LICENSES.md
fi

# ---- 5. verify
hash_existing
bad=0
for p in "${ORDER[@]}"; do
  if [ "${HAVE[$p]:-}" != "${WANT[$p]}" ]; then
    bad=$((bad + 1)); [ $bad -le 50 ] && echo "  FAILED   $p"
  fi
done
if [ $bad -eq 0 ]; then
  echo "OK: all ${#ORDER[@]} selected files match MANIFEST.sha256"
else
  echo "$bad file(s) missing or with the wrong checksum. Re-run to retry; if an upstream file changed, see docs/RENDERING.md." >&2
  exit 1
fi
