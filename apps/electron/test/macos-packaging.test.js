import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = path.resolve(packageRoot, "..", "..");

function read(relativePath) {
  return fs.readFileSync(path.join(repositoryRoot, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

test("package manifests expose Electron macOS packaging commands", () => {
  const rootPackage = readJson("package.json");
  const electronPackage = readJson("apps/electron/package.json");

  assert.equal(rootPackage.scripts["electron:package:mac"], "npm --workspace @wikiwise/electron-app run package:mac");
  assert.equal(rootPackage.scripts["electron:release:preflight"], "bash scripts/build-release.sh --preflight");
  assert.equal(electronPackage.scripts["package:mac"], "node ../../scripts/package-electron-macos.mjs");
});

test("packaging script assembles a Wikiwise macOS app from installed Electron", () => {
  const script = read("scripts/package-electron-macos.mjs");

  assert.match(script, /node_modules\/electron\/dist\/Electron\.app/);
  assert.match(script, /apps\/electron\/out\/Wikiwise\.app/);
  assert.match(script, /Contents\/Resources\/app/);
  assert.match(script, /Contents\/MacOS\/Electron/);
  assert.match(script, /Contents\/MacOS\/Wikiwise/);
  assert.match(script, /CFBundleDisplayName/);
  assert.match(script, /CFBundleName/);
  assert.match(script, /CFBundleExecutable/);
  assert.match(script, /CFBundleIdentifier/);
  assert.match(script, /CFBundleShortVersionString/);
  assert.match(script, /com\.readwise\.wikiwise/);
  assert.match(script, /copyElectronAppSource/);
  assert.match(script, /copyCorePackage/);
});

test("packaging script embeds the Electron app and shared core package layout", () => {
  const script = read("scripts/package-electron-macos.mjs");

  assert.match(script, /src\/main/);
  assert.match(script, /src\/preload/);
  assert.match(script, /src\/renderer/);
  assert.match(script, /node_modules\/@wikiwise\/core/);
  assert.match(script, /packages\/wikiwise-core\/src/);
  assert.match(script, /packages\/wikiwise-core\/package\.json/);
  assert.match(script, /copyElectronRuntimeDependencies/);
  assert.match(script, /node-pty/);
  assert.match(script, /@xterm\/xterm/);
  assert.match(script, /@xterm\/addon-fit/);
});

test("README documents local unsigned packaging and release guardrails", () => {
  const readme = read("apps/electron/README.md");

  assert.match(readme, /npm run electron:package:mac/);
  assert.match(readme, /apps\/electron\/out\/Wikiwise\.app/);
  assert.match(readme, /unsigned/i);
  assert.match(readme, /signed/i);
  assert.match(readme, /notarized/i);
  assert.match(readme, /DMG/);
});

test("canonical release script builds a signed notarized Electron DMG", () => {
  const script = read("scripts/build-release.sh");

  assert.match(script, /npm run electron:audit:runtime/);
  assert.match(script, /npm run electron:package:mac -- "\$VERSION"/);
  assert.match(script, /apps\/electron\/out\/Wikiwise\.app/);
  assert.match(script, /Wikiwise-macOS\.dmg/);
  assert.match(script, /codesign[\s\S]*--options runtime/);
  assert.match(script, /--entitlements "\$ENTITLEMENTS"/);
  assert.match(script, /hdiutil create/);
  assert.match(script, /codesign --sign "\$SIGNING_IDENTITY" "\$DMG"/);
  assert.match(script, /xcrun notarytool submit "\$DMG" --keychain-profile "\$NOTARY_PROFILE" --wait/);
  assert.match(script, /xcrun stapler staple "\$DMG"/);
  assert.match(script, /spctl --assess --type open --context context:primary-signature "\$DMG"/);
  assert.doesNotMatch(script, /swift build -c release/);
  assert.doesNotMatch(script, /lipo -create/);
});

test("canonical release script exposes a no-artifact preflight mode", () => {
  const script = read("scripts/build-release.sh");

  assert.match(script, /PREFLIGHT_ONLY/);
  assert.match(script, /--preflight/);
  assert.match(script, /check_notary_profile/);
  assert.match(script, /xcrun notarytool history --keychain-profile "\$NOTARY_PROFILE"/);
  assert.match(script, /Release preflight passed/);
  assert.match(script, /No release artifacts were produced/);

  const preflightSuccessIndex = script.indexOf("Release preflight passed");
  const auditStepIndex = script.indexOf("[1/7] Running Electron runtime parity audit");
  assert.ok(preflightSuccessIndex >= 0);
  assert.ok(auditStepIndex > preflightSuccessIndex);
});

test("Electron release script uses checked-in hardened runtime entitlements", () => {
  const entitlementsPath = path.join(repositoryRoot, "apps", "electron", "build", "entitlements.mac.plist");

  assert.equal(fs.existsSync(entitlementsPath), true);

  const entitlements = fs.readFileSync(entitlementsPath, "utf8");
  assert.match(entitlements, /com\.apple\.security\.cs\.allow-jit/);
  assert.match(entitlements, /com\.apple\.security\.cs\.allow-unsigned-executable-memory/);
  assert.match(entitlements, /com\.apple\.security\.cs\.disable-library-validation/);
});

test("release documentation describes the Electron signed DMG path", () => {
  const claude = read("CLAUDE.md");
  const project = read("openspec/project.md");
  const electronReadme = read("apps/electron/README.md");

  for (const document of [claude, project, electronReadme]) {
    assert.match(document, /bash scripts\/build-release\.sh <version>/);
    assert.match(document, /bash scripts\/build-release\.sh --preflight <version>/);
    assert.match(document, /Electron/i);
    assert.match(document, /Wikiwise-macOS\.dmg/);
    assert.match(document, /Developer ID/i);
    assert.match(document, /notar/i);
  }
});
