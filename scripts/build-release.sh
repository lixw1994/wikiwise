#!/bin/bash
set -euo pipefail

PREFLIGHT_ONLY=0
if [[ "${1:-}" == "--preflight" ]]; then
  PREFLIGHT_ONLY=1
  shift
fi

VERSION="${1:-0.1.0}"
PRODUCT_NAME="Wikiwise"
SIGNING_IDENTITY="${WIKIWISE_RELEASE_SIGNING_IDENTITY:-Developer ID Application: Readwise, Inc (QV36BMA4LN)}"
NOTARY_PROFILE="${WIKIWISE_NOTARY_PROFILE:-notarytool}"
APP="apps/electron/out/Wikiwise.app"
DMG="Wikiwise-macOS.dmg"
DMG_STAGING_DIR="apps/electron/out/release-dmg"
ENTITLEMENTS="apps/electron/build/entitlements.mac.plist"

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

check_signing_identity() {
  security find-identity -v -p codesigning | grep -F "$SIGNING_IDENTITY" >/dev/null \
    || fail "missing Developer ID signing identity '$SIGNING_IDENTITY'"
}

check_notary_profile() {
  xcrun notarytool history --keychain-profile "$NOTARY_PROFILE" >/dev/null 2>&1 \
    || fail "missing or unusable Apple notarization keychain profile '$NOTARY_PROFILE'"
}

preflight() {
  [[ "$(uname -s)" == "Darwin" ]] || fail "Electron macOS releases must run on macOS"

  require_command npm
  require_command hdiutil
  require_command codesign
  require_command xcrun
  require_command security
  require_command spctl
  require_file "$ENTITLEMENTS"
  check_signing_identity
  check_notary_profile
}

echo "=== Building Electron Wikiwise v${VERSION} ==="

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
