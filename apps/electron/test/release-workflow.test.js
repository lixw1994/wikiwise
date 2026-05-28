import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = path.resolve(packageRoot, "..", "..");

function readRepository(relativePath) {
  return fs.readFileSync(path.join(repositoryRoot, relativePath), "utf8");
}

test("Electron release workflow is manually dispatched on macOS", () => {
  const workflow = readRepository(".github/workflows/electron-release.yml");

  assert.match(workflow, /name:\s*Electron Release/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /release_version:/);
  assert.match(workflow, /runs-on:\s*macos-/);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /swift build/);
});

test("Electron release workflow bootstraps Apple credentials from secrets", () => {
  const workflow = readRepository(".github/workflows/electron-release.yml");

  for (const secretName of [
    "APPLE_SIGNING_CERTIFICATE_BASE64",
    "APPLE_SIGNING_CERTIFICATE_PASSWORD",
    "APPLE_NOTARY_KEY_ID",
    "APPLE_NOTARY_ISSUER_ID",
    "APPLE_NOTARY_KEY_BASE64"
  ]) {
    assert.match(workflow, new RegExp(`secrets\\.${secretName}`));
  }

  assert.match(workflow, /security create-keychain/);
  assert.match(workflow, /security import/);
  assert.match(workflow, /security set-key-partition-list/);
  assert.match(workflow, /base64 --decode/);
  assert.match(workflow, /xcrun notarytool store-credentials notarytool/);
});

test("Electron release workflow delegates release gates to the canonical script", () => {
  const workflow = readRepository(".github/workflows/electron-release.yml");

  assert.match(
    workflow,
    /bash scripts\/build-release\.sh --release-report apps\/electron\/out\/release\/report\.json/
  );
  assert.match(workflow, /npm run electron:release:evidence/);
  assert.doesNotMatch(workflow, /hdiutil create/);
  assert.doesNotMatch(workflow, /codesign --/);
  assert.doesNotMatch(workflow, /notarytool submit/);
  assert.doesNotMatch(workflow, /xcrun stapler/);
  assert.doesNotMatch(workflow, /spctl --assess/);
});

test("Electron release workflow uploads the DMG and retained release report", () => {
  const workflow = readRepository(".github/workflows/electron-release.yml");

  assert.match(workflow, /actions\/upload-artifact@v4/);
  assert.match(workflow, /Wikiwise-macOS\.dmg/);
  assert.match(workflow, /apps\/electron\/out\/release\/report\.json/);
});

test("Electron release workflow uploads retained runtime audit evidence", () => {
  const workflow = readRepository(".github/workflows/electron-release.yml");

  assert.match(workflow, /Wikiwise-electron-runtime-audit/);
  assert.match(workflow, /apps\/electron\/out\/runtime-audit\/report\.json/);
  assert.match(workflow, /apps\/electron\/out\/runtime-audit\/screenshots/);
  assert.match(workflow, /Wikiwise-electron-packaged-runtime-audit/);
  assert.match(workflow, /apps\/electron\/out\/packaged-runtime-audit\/report\.json/);
  assert.match(workflow, /if-no-files-found:\s*error/);
});

test("Electron documentation describes the credential-backed release workflow", () => {
  const electronReadme = readRepository("apps/electron/README.md");

  assert.match(electronReadme, /Electron Release/);
  assert.match(electronReadme, /\.github\/workflows\/electron-release\.yml/);
  assert.match(electronReadme, /APPLE_SIGNING_CERTIFICATE_BASE64/);
  assert.match(electronReadme, /APPLE_SIGNING_CERTIFICATE_PASSWORD/);
  assert.match(electronReadme, /APPLE_NOTARY_KEY_ID/);
  assert.match(electronReadme, /APPLE_NOTARY_ISSUER_ID/);
  assert.match(electronReadme, /APPLE_NOTARY_KEY_BASE64/);
  assert.match(electronReadme, /Wikiwise-macOS\.dmg/);
  assert.match(electronReadme, /apps\/electron\/out\/release\/report\.json/);
  assert.match(electronReadme, /apps\/electron\/out\/runtime-audit\/report\.json/);
  assert.match(electronReadme, /apps\/electron\/out\/runtime-audit\/screenshots/);
  assert.match(electronReadme, /apps\/electron\/out\/packaged-runtime-audit\/report\.json/);
  assert.match(electronReadme, /successful signed and notarized release run/i);
});
