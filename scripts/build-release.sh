#!/bin/bash
set -euo pipefail

PREFLIGHT_ONLY=0
PREFLIGHT_REPORT_PATH=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --preflight)
      PREFLIGHT_ONLY=1
      shift
      ;;
    --preflight-report)
      PREFLIGHT_REPORT_PATH="${2:-}"
      if [[ -z "$PREFLIGHT_REPORT_PATH" ]]; then
        echo "Release prerequisite failed: --preflight-report requires a path" >&2
        exit 1
      fi
      shift 2
      ;;
    --)
      shift
      break
      ;;
    -*)
      echo "Release prerequisite failed: unknown option '$1'" >&2
      exit 1
      ;;
    *)
      break
      ;;
  esac
done

VERSION="${1:-0.1.0}"
PRODUCT_NAME="Wikiwise"
SIGNING_IDENTITY="${WIKIWISE_RELEASE_SIGNING_IDENTITY:-Developer ID Application: Readwise, Inc (QV36BMA4LN)}"
NOTARY_PROFILE="${WIKIWISE_NOTARY_PROFILE:-notarytool}"
APP="apps/electron/out/Wikiwise.app"
DMG="Wikiwise-macOS.dmg"
DMG_STAGING_DIR="apps/electron/out/release-dmg"
ENTITLEMENTS="apps/electron/build/entitlements.mac.plist"
PREFLIGHT_CHECK_NAMES=()
PREFLIGHT_CHECK_STATUSES=()
PREFLIGHT_CHECK_MESSAGES=()
PREFLIGHT_BLOCKER_NAMES=()
PREFLIGHT_BLOCKER_MESSAGES=()

fail() {
  echo "Release prerequisite failed: $*" >&2
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "missing required command '$1'"
}

require_file() {
  [[ -f "$1" ]] || fail "missing required file '$1'"
}

require_directory() {
  [[ -d "$1" ]] || fail "missing required directory '$1'"
}

json_escape() {
  local value="$1"
  value="${value//\\/\\\\}"
  value="${value//\"/\\\"}"
  value="${value//$'\n'/\\n}"
  value="${value//$'\r'/\\r}"
  value="${value//$'\t'/\\t}"
  printf '%s' "$value"
}

json_string() {
  printf '"%s"' "$(json_escape "$1")"
}

record_preflight_check() {
  local name="$1"
  local status="$2"
  local message="$3"
  PREFLIGHT_CHECK_NAMES+=("$name")
  PREFLIGHT_CHECK_STATUSES+=("$status")
  PREFLIGHT_CHECK_MESSAGES+=("$message")

  if [[ "$status" == "blocked" ]]; then
    PREFLIGHT_BLOCKER_NAMES+=("$name")
    PREFLIGHT_BLOCKER_MESSAGES+=("$message")
  fi
}

check_preflight_command() {
  local command_name="$1"

  if command -v "$command_name" >/dev/null 2>&1; then
    record_preflight_check "command:${command_name}" "passed" "found required command '${command_name}'"
  else
    record_preflight_check "command:${command_name}" "blocked" "missing required command '${command_name}'"
  fi
}

check_preflight_file() {
  local file_path="$1"

  if [[ -f "$file_path" ]]; then
    record_preflight_check "file:${file_path}" "passed" "found required file '${file_path}'"
  else
    record_preflight_check "file:${file_path}" "blocked" "missing required file '${file_path}'"
  fi
}

check_signing_identity() {
  if ! command -v security >/dev/null 2>&1; then
    record_preflight_check "signing-identity" "blocked" "unable to check Developer ID signing identity because 'security' is unavailable"
    return
  fi

  if security find-identity -v -p codesigning 2>/dev/null | grep -F "$SIGNING_IDENTITY" >/dev/null; then
    record_preflight_check "signing-identity" "passed" "found Developer ID signing identity '$SIGNING_IDENTITY'"
  else
    record_preflight_check "signing-identity" "blocked" "missing Developer ID signing identity '$SIGNING_IDENTITY'"
  fi
}

check_notary_profile() {
  if ! command -v xcrun >/dev/null 2>&1; then
    record_preflight_check "notary-profile" "blocked" "unable to check Apple notarization keychain profile because 'xcrun' is unavailable"
    return
  fi

  if xcrun notarytool history --keychain-profile "$NOTARY_PROFILE" >/dev/null 2>&1; then
    record_preflight_check "notary-profile" "passed" "found usable Apple notarization keychain profile '$NOTARY_PROFILE'"
  else
    record_preflight_check "notary-profile" "blocked" "missing or unusable Apple notarization keychain profile '$NOTARY_PROFILE'"
  fi
}

write_preflight_report() {
  [[ -n "$PREFLIGHT_REPORT_PATH" ]] || return 0

  local status="ready"
  local preflight_command="bash scripts/build-release.sh --preflight"
  if [[ -n "$PREFLIGHT_REPORT_PATH" ]]; then
    preflight_command+=" --preflight-report ${PREFLIGHT_REPORT_PATH}"
  fi
  preflight_command+=" ${VERSION}"

  if (( ${#PREFLIGHT_BLOCKER_NAMES[@]} > 0 )); then
    status="blocked"
  fi

  mkdir -p "$(dirname "$PREFLIGHT_REPORT_PATH")"
  {
    printf '{\n'
    printf '  "version": '; json_string "$VERSION"; printf ',\n'
    printf '  "status": '; json_string "$status"; printf ',\n'
    printf '  "releaseCommand": '; json_string "bash scripts/build-release.sh ${VERSION}"; printf ',\n'
    printf '  "preflightCommand": '; json_string "$preflight_command"; printf ',\n'
    printf '  "checks": [\n'
    local check_count="${#PREFLIGHT_CHECK_NAMES[@]}"
    local index
    for (( index=0; index<check_count; index++ )); do
      printf '    { "name": '; json_string "${PREFLIGHT_CHECK_NAMES[$index]}"; printf ', "status": '; json_string "${PREFLIGHT_CHECK_STATUSES[$index]}"; printf ', "message": '; json_string "${PREFLIGHT_CHECK_MESSAGES[$index]}"; printf ' }'
      if (( index < check_count - 1 )); then
        printf ','
      fi
      printf '\n'
    done
    printf '  ],\n'
    printf '  "blockers": [\n'
    local blocker_count="${#PREFLIGHT_BLOCKER_NAMES[@]}"
    for (( index=0; index<blocker_count; index++ )); do
      printf '    { "name": '; json_string "${PREFLIGHT_BLOCKER_NAMES[$index]}"; printf ', "message": '; json_string "${PREFLIGHT_BLOCKER_MESSAGES[$index]}"; printf ' }'
      if (( index < blocker_count - 1 )); then
        printf ','
      fi
      printf '\n'
    done
    printf '  ],\n'
    printf '  "artifactProduction": {\n'
    printf '    "releaseArtifactsProduced": false,\n'
    printf '    "signedOrNotarizedReleaseProduced": false\n'
    printf '  },\n'
    printf '  "finalMigrationRequirement": '; json_string "Final Electron migration completion still requires an actual signed and notarized release run or an explicitly accepted OpenSpec deviation."; printf '\n'
    printf '}\n'
  } > "$PREFLIGHT_REPORT_PATH"
}

preflight() {
  if [[ "$(uname -s)" == "Darwin" ]]; then
    record_preflight_check "platform:macos" "passed" "running on macOS"
  else
    record_preflight_check "platform:macos" "blocked" "Electron macOS releases must run on macOS"
  fi

  check_preflight_command npm
  check_preflight_command hdiutil
  check_preflight_command codesign
  check_preflight_command xcrun
  check_preflight_command security
  check_preflight_command spctl
  check_preflight_file "$ENTITLEMENTS"
  check_signing_identity
  check_notary_profile

  write_preflight_report

  if (( ${#PREFLIGHT_BLOCKER_MESSAGES[@]} > 0 )); then
    local message
    for message in "${PREFLIGHT_BLOCKER_MESSAGES[@]}"; do
      echo "Release prerequisite failed: ${message}" >&2
    done
    exit 1
  fi
}

echo "=== Building Electron Wikiwise v${VERSION} ==="

if [[ -n "$PREFLIGHT_REPORT_PATH" && "$PREFLIGHT_ONLY" != "1" ]]; then
  fail "--preflight-report can only be used with --preflight"
fi

preflight

if [[ "$PREFLIGHT_ONLY" == "1" ]]; then
  echo "Release preflight passed for Electron Wikiwise v${VERSION}."
  echo "No release artifacts were produced."
  exit 0
fi

echo "[1/7] Running Electron runtime parity audit..."
npm run electron:audit:runtime

echo "[2/7] Packaging Electron app..."
npm run electron:package:mac -- "$VERSION"
require_directory "$APP"

echo "[3/7] Signing Electron app..."
codesign --deep --force --options runtime --entitlements "$ENTITLEMENTS" --sign "$SIGNING_IDENTITY" "$APP"
codesign --verify --deep --strict --verbose=2 "$APP"

echo "[4/7] Creating DMG..."
rm -rf "$DMG_STAGING_DIR"
mkdir -p "$DMG_STAGING_DIR"
cp -R "$APP" "$DMG_STAGING_DIR/${PRODUCT_NAME}.app"
ln -s /Applications "$DMG_STAGING_DIR/Applications"
rm -f "$DMG"
hdiutil create -volname "$PRODUCT_NAME" -srcfolder "$DMG_STAGING_DIR" -ov -format UDZO "$DMG"
rm -rf "$DMG_STAGING_DIR"

echo "[5/7] Signing DMG..."
codesign --sign "$SIGNING_IDENTITY" "$DMG"
codesign --verify --verbose=2 "$DMG"

echo "[6/7] Notarizing DMG..."
xcrun notarytool submit "$DMG" --keychain-profile "$NOTARY_PROFILE" --wait

echo "[7/7] Stapling and assessing DMG..."
xcrun stapler staple "$DMG"
spctl --assess --type open --context context:primary-signature "$DMG"

echo ""
echo "=== Done: $DMG ==="
echo "Electron app packaged, signed with Developer ID, notarized, stapled, and assessed."
echo ""
echo "To publish:"
echo "  gh release create v${VERSION} ${DMG} --title \"Wikiwise v${VERSION}\" --notes \"...\""
