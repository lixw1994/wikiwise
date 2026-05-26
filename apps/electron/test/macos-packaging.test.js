import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
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

function plistStringValue(plist, key) {
  const match = plist.match(new RegExp(`<key>${key}</key>\\s*<string>([^<]+)</string>`));
  assert.ok(match, `Expected ${key} string value in plist`);
  return match[1];
}

const inheritedElectronTemplatePlistKeys = [
  "NSCameraUsageDescription",
  "NSMicrophoneUsageDescription",
  "NSBluetoothAlwaysUsageDescription",
  "NSBluetoothPeripheralUsageDescription",
  "NSAppTransportSecurity"
];
const nonNativeElectronTemplatePlistKeys = [
  "DTCompiler",
  "DTSDKBuild",
  "DTSDKName",
  "DTXcode",
  "DTXcodeBuild",
  "LSApplicationCategoryType"
];
const nativeMinimumMacOSVersion = "14.0";

test("package manifests expose Electron macOS packaging commands", () => {
  const rootPackage = readJson("package.json");
  const electronPackage = readJson("apps/electron/package.json");

  assert.equal(rootPackage.scripts["electron:package:mac"], "npm --workspace @wikiwise/electron-app run package:mac");
  assert.equal(rootPackage.scripts["electron:release:preflight"], "bash scripts/build-release.sh --preflight");
  assert.equal(
    rootPackage.scripts["electron:release:readiness"],
    "bash scripts/build-release.sh --preflight --preflight-report apps/electron/out/release-readiness/report.json"
  );
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

test("packaging script strips unused Electron template privacy plist metadata", () => {
  const script = read("scripts/package-electron-macos.mjs");
  const nativeInfoPlist = read("Wikiwise.app/Contents/Info.plist");

  assert.match(nativeInfoPlist, /<key>CFBundleDisplayName<\/key>/);
  assert.match(script, /removeElectronTemplateInfoPlistKeys/);
  assert.match(script, /removePlistEntry/);
  assert.match(script, /plist = removeElectronTemplateInfoPlistKeys\(plist\)/);

  for (const key of inheritedElectronTemplatePlistKeys) {
    assert.doesNotMatch(nativeInfoPlist, new RegExp(`<key>${key}</key>`));
    assert.match(script, new RegExp(`"${key}"`));
  }
});

test("packaging script strips non-native Electron template build plist metadata", () => {
  const script = read("scripts/package-electron-macos.mjs");
  const nativeInfoPlist = read("Wikiwise.app/Contents/Info.plist");

  assert.match(script, /removeElectronTemplateInfoPlistKeys/);

  for (const key of nonNativeElectronTemplatePlistKeys) {
    assert.doesNotMatch(nativeInfoPlist, new RegExp(`<key>${key}</key>`));
    assert.match(script, new RegExp(`"${key}"`));
  }

  assert.doesNotMatch(script, /LSApplicationCategoryType:\s*"/);
});

test("packaging script removes unused Electron template icon resource", () => {
  const script = read("scripts/package-electron-macos.mjs");
  const nativeResources = read("Wikiwise.app/Contents/Info.plist");

  assert.match(script, /electronTemplateIconRelativePath/);
  assert.match(script, /Contents\/Resources\/electron\.icns/);
  assert.match(script, /removeElectronTemplateResources/);
  assert.match(script, /fs\.rmSync\(path\.join\(outputAppPath,\s*\.\.\.electronTemplateIconRelativePath\.split\("\/"\)\),\s*\{\s*force:\s*true\s*\}\)/);
  assert.match(script, /copyNativeResources\(\)/);
  assert.match(script, /Wikiwise\.icns/);
  assert.match(script, /CFBundleIconFile:\s*productName/);
  assert.match(nativeResources, /<key>CFBundleIconFile<\/key><string>Wikiwise<\/string>/);
});

test("packaging script removes unused Electron template PkgInfo file", () => {
  const script = read("scripts/package-electron-macos.mjs");
  const nativePkgInfoPath = path.join(repositoryRoot, "Wikiwise.app", "Contents", "PkgInfo");

  assert.equal(fs.existsSync(nativePkgInfoPath), false);
  assert.match(script, /electronTemplatePkgInfoRelativePath/);
  assert.match(script, /Contents\/PkgInfo/);
  assert.match(script, /removeElectronTemplateResources/);
  assert.match(script, /fs\.rmSync\(path\.join\(outputAppPath,\s*\.\.\.electronTemplatePkgInfoRelativePath\.split\("\/"\)\),\s*\{\s*force:\s*true\s*\}\)/);
  assert.match(script, /Info\.plist/);
  assert.match(script, /Contents\/MacOS\/Wikiwise/);
  assert.match(script, /Contents\/Resources\/Wikiwise\.icns/);
  assert.match(script, /Contents\/Resources\/default_app\.asar/);
});

test("packaging script mirrors native minimum macOS metadata", () => {
  const script = read("scripts/package-electron-macos.mjs");
  const packageManifest = read("Package.swift");
  const readme = read("README.md");
  const nativeInfoPlist = read("Wikiwise.app/Contents/Info.plist");

  assert.match(packageManifest, /platforms:\s*\[\.macOS\(\.v14\)\]/);
  assert.match(readme, /Requires macOS 14\+/);
  assert.match(
    nativeInfoPlist,
    new RegExp(`<key>LSMinimumSystemVersion</key>\\s*<string>${nativeMinimumMacOSVersion}</string>`)
  );
  assert.match(script, /LSMinimumSystemVersion:\s*"14\.0"/);
  assert.doesNotMatch(script, /LSMinimumSystemVersion:\s*"11\.0"/);
});

test("packaging script defaults Electron bundle version metadata to native app values", () => {
  const script = read("scripts/package-electron-macos.mjs");
  const releaseScript = read("scripts/build-release.sh");
  const nativeInfoPlist = read("Wikiwise.app/Contents/Info.plist");

  const nativeShortVersion = plistStringValue(nativeInfoPlist, "CFBundleShortVersionString");
  const nativeBundleVersion = plistStringValue(nativeInfoPlist, "CFBundleVersion");

  assert.notEqual(nativeShortVersion, "");
  assert.notEqual(nativeBundleVersion, "");
  assert.match(script, /nativeAppInfoPlistPath/);
  assert.match(script, /readNativeAppVersionMetadata/);
  assert.match(script, /resolveVersionMetadata/);
  assert.match(script, /explicitReleaseVersion/);
  assert.match(script, /CFBundleShortVersionString:\s*versionMetadata\.shortVersion/);
  assert.match(script, /CFBundleVersion:\s*versionMetadata\.bundleVersion/);
  assert.match(script, /shortVersion:\s*explicitReleaseVersion \|\| nativeVersionMetadata\.shortVersion/);
  assert.match(script, /bundleVersion:\s*explicitReleaseVersion \|\| nativeVersionMetadata\.bundleVersion/);
  assert.match(script, /Wikiwise\.app",\s*"Contents",\s*"Info\.plist"/);
  assert.match(releaseScript, /npm run electron:package:mac -- "\$VERSION"/);
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

test("canonical release script can write retained preflight readiness reports", () => {
  const script = read("scripts/build-release.sh");

  assert.match(script, /PREFLIGHT_REPORT_PATH/);
  assert.match(script, /--preflight-report/);
  assert.match(script, /write_preflight_report/);
  assert.match(script, /"status"/);
  assert.match(script, /"releaseCommand"/);
  assert.match(script, /"preflightCommand"/);
  assert.match(script, /"checks"/);
  assert.match(script, /"blockers"/);
  assert.match(script, /"artifactProduction"/);
  assert.match(script, /signedOrNotarizedReleaseProduced/);
});

test("blocked release preflight writes a readiness report without running release steps", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "wikiwise-release-readiness-"));
  const reportPath = path.join(tempDir, "report.json");
  const result = spawnSync(
    "bash",
    [
      "scripts/build-release.sh",
      "--preflight",
      "--preflight-report",
      reportPath,
      "0.0.0"
    ],
    {
      cwd: repositoryRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        WIKIWISE_RELEASE_SIGNING_IDENTITY: "__Wikiwise Missing Identity For Test__",
        WIKIWISE_NOTARY_PROFILE: "__wikiwise-missing-notary-profile__"
      }
    }
  );

  assert.notEqual(result.status, 0);
  assert.equal(fs.existsSync(reportPath), true);
  assert.doesNotMatch(result.stdout, /\[1\/7\] Running Electron runtime parity audit/);
  assert.doesNotMatch(result.stdout, /Electron app packaged, signed with Developer ID, notarized, stapled, and assessed/);

  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  assert.equal(report.version, "0.0.0");
  assert.equal(report.status, "blocked");
  assert.equal(report.releaseCommand, "bash scripts/build-release.sh 0.0.0");
  assert.equal(report.preflightCommand, `bash scripts/build-release.sh --preflight --preflight-report ${reportPath} 0.0.0`);
  assert.equal(report.artifactProduction.signedOrNotarizedReleaseProduced, false);
  assert.equal(report.artifactProduction.releaseArtifactsProduced, false);
  assert.ok(Array.isArray(report.checks));
  assert.ok(report.checks.length > 0);
  assert.ok(Array.isArray(report.blockers));
  assert.ok(report.blockers.length > 0);
  assert.match(report.finalMigrationRequirement, /actual signed and notarized release run/i);
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

test("Electron documentation describes retained release readiness evidence", () => {
  const electronReadme = read("apps/electron/README.md");

  assert.match(electronReadme, /npm run electron:release:readiness/);
  assert.match(electronReadme, /apps\/electron\/out\/release-readiness\/report\.json/);
  assert.match(electronReadme, /blocker/i);
  assert.match(electronReadme, /actual signed and notarized release run/i);
  assert.match(electronReadme, /accepted OpenSpec deviation/i);
});
