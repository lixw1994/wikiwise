#!/usr/bin/env node
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDir, "..");
const electronTemplateRelativePath = "node_modules/electron/dist/Electron.app";
const outputAppRelativePath = "apps/electron/out/Wikiwise.app";
const embeddedAppRelativePath = "Contents/Resources/app";
const electronTemplateIconRelativePath = "Contents/Resources/electron.icns";
const electronTemplatePkgInfoRelativePath = "Contents/PkgInfo";
const electronExecutableRelativePath = "Contents/MacOS/Electron";
const wikiwiseExecutableRelativePath = "Contents/MacOS/Wikiwise";
const packagedInfoPlistRelativePath = "Contents/Info.plist";
const packagedWikiwiseIconRelativePath = "Contents/Resources/Wikiwise.icns";
const packagedDefaultAppAsarRelativePath = "Contents/Resources/default_app.asar";
const electronMainSourceRelativePath = "src/main";
const electronPreloadSourceRelativePath = "src/preload";
const electronRendererSourceRelativePath = "src/renderer";
const embeddedCoreRelativePath = "node_modules/@wikiwise/core";
const coreSourceRelativePath = "packages/wikiwise-core/src";
const corePackageManifestRelativePath = "packages/wikiwise-core/package.json";
const electronTemplatePath = path.join(repositoryRoot, electronTemplateRelativePath);
const outputAppPath = path.join(repositoryRoot, outputAppRelativePath);
const electronPackageRoot = path.join(repositoryRoot, "apps", "electron");
const corePackageRoot = path.join(repositoryRoot, "packages", "wikiwise-core");
const nativeResourcesRoot = path.join(repositoryRoot, "Sources", "Wikiwise", "Resources");
const nativeAppInfoPlistPath = path.join(repositoryRoot, "Wikiwise.app", "Contents", "Info.plist");
const requireFromElectronPackage = createRequire(path.join(electronPackageRoot, "package.json"));
const electronRuntimeDependencyNames = Object.freeze([
  "node-pty",
  "node-addon-api",
  "@xterm/xterm",
  "@xterm/addon-fit"
]);
const productName = "Wikiwise";
const bundleIdentifier = process.env.WIKIWISE_ELECTRON_BUNDLE_ID || "com.readwise.wikiwise";
const inheritedElectronTemplateInfoPlistKeys = Object.freeze([
  "NSCameraUsageDescription",
  "NSMicrophoneUsageDescription",
  "NSBluetoothAlwaysUsageDescription",
  "NSBluetoothPeripheralUsageDescription",
  "NSAppTransportSecurity",
  "DTCompiler",
  "DTSDKBuild",
  "DTSDKName",
  "DTXcode",
  "DTXcodeBuild",
  "LSApplicationCategoryType"
]);
const electronRuntimeInfoPlistKeyAllowlist = Object.freeze([
  "CFBundleInfoDictionaryVersion",
  "ElectronAsarIntegrity",
  "LSEnvironment",
  "NSMainNibFile",
  "NSPrefersDisplaySafeAreaCompatibilityMode",
  "NSPrincipalClass",
  "NSQuitAlwaysKeepsWindows",
  "NSRequiresAquaSystemAppearance",
  "NSSupportsAutomaticGraphicsSwitching"
]);

const electronPackage = JSON.parse(
  fs.readFileSync(path.join(electronPackageRoot, "package.json"), "utf8")
);
const explicitReleaseVersion = process.argv[2] || "";
const nativeVersionMetadata = readNativeAppVersionMetadata();
const versionMetadata = resolveVersionMetadata(explicitReleaseVersion, nativeVersionMetadata);
const version = versionMetadata.shortVersion;

function assertDirectory(targetPath, message) {
  if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isDirectory()) {
    throw new Error(message);
  }
}

function assertFile(targetPath, message) {
  if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isFile()) {
    throw new Error(message);
  }
}

function copyDirectory(source, destination) {
  fs.rmSync(destination, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(source, destination, {
    recursive: true,
    force: true
  });
}

function copyFile(source, destination) {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function setPlistString(plist, key, value) {
  const escapedValue = escapeXml(value);
  const pattern = new RegExp(`(<key>${key}</key>\\s*<string>)([^<]*)(</string>)`);
  if (pattern.test(plist)) {
    return plist.replace(pattern, `$1${escapedValue}$3`);
  }

  return plist.replace(
    "</dict>",
    `    <key>${key}</key><string>${escapedValue}</string>\n</dict>`
  );
}

function plistStringValue(plist, key) {
  const match = plist.match(new RegExp(`<key>${key}</key>\\s*<string>([^<]*)</string>`));
  return match?.[1] ?? "";
}

function topLevelPlistKeys(plist) {
  const keys = [];
  const tokenPattern = /<\/?(?:dict|array)>|<key>([^<]+)<\/key>/g;

  let depth = 0;
  for (const match of plist.matchAll(tokenPattern)) {
    const [token, key] = match;
    if (token === "<dict>" || token === "<array>") {
      depth += 1;
      continue;
    }
    if (token === "</dict>" || token === "</array>") {
      depth = Math.max(0, depth - 1);
      continue;
    }
    if (key && depth === 1) {
      keys.push(key);
    }
  }

  return keys;
}

function readNativeAppVersionMetadata() {
  if (!fs.existsSync(nativeAppInfoPlistPath)) {
    return {
      shortVersion: "",
      bundleVersion: ""
    };
  }

  const plist = fs.readFileSync(nativeAppInfoPlistPath, "utf8");
  return {
    shortVersion: plistStringValue(plist, "CFBundleShortVersionString"),
    bundleVersion: plistStringValue(plist, "CFBundleVersion")
  };
}

function resolveVersionMetadata(explicitReleaseVersion, nativeVersionMetadata) {
  const fallbackVersion = electronPackage.version || "0.0.0";

  return {
    shortVersion: explicitReleaseVersion || nativeVersionMetadata.shortVersion || fallbackVersion,
    bundleVersion: explicitReleaseVersion || nativeVersionMetadata.bundleVersion || nativeVersionMetadata.shortVersion || fallbackVersion
  };
}

function removePlistEntry(plist, key) {
  const valuePattern = [
    "<string>[\\s\\S]*?</string>",
    "<dict>[\\s\\S]*?</dict>",
    "<array>[\\s\\S]*?</array>",
    "<true\\s*/>",
    "<false\\s*/>",
    "<integer>[^<]*</integer>",
    "<real>[^<]*</real>"
  ].join("|");
  const pattern = new RegExp(`\\n?\\s*<key>${key}</key>\\s*(?:${valuePattern})`, "g");
  return plist.replace(pattern, "");
}

function removeElectronTemplateInfoPlistKeys(plist) {
  return inheritedElectronTemplateInfoPlistKeys.reduce(
    (currentPlist, key) => removePlistEntry(currentPlist, key),
    plist
  );
}

function rewriteInfoPlist() {
  const infoPlistPath = path.join(outputAppPath, ...packagedInfoPlistRelativePath.split("/"));
  let plist = fs.readFileSync(infoPlistPath, "utf8");

  const updates = {
    CFBundleDisplayName: productName,
    CFBundleName: productName,
    CFBundleExecutable: productName,
    CFBundleIdentifier: bundleIdentifier,
    CFBundleShortVersionString: versionMetadata.shortVersion,
    CFBundleVersion: versionMetadata.bundleVersion,
    CFBundleIconFile: productName,
    LSMinimumSystemVersion: "14.0"
  };

  for (const [key, value] of Object.entries(updates)) {
    plist = setPlistString(plist, key, value);
  }

  plist = removeElectronTemplateInfoPlistKeys(plist);

  fs.writeFileSync(infoPlistPath, plist);
}

function assertPackagedInfoPlistKeyDelta() {
  const infoPlistPath = path.join(outputAppPath, ...packagedInfoPlistRelativePath.split("/"));
  assertFile(nativeAppInfoPlistPath, "Missing native app Info.plist for package-only plist key audit.");

  const packagedKeys = topLevelPlistKeys(fs.readFileSync(infoPlistPath, "utf8"));
  const nativeKeys = new Set(topLevelPlistKeys(fs.readFileSync(nativeAppInfoPlistPath, "utf8")));
  const allowedPackageOnlyKeys = new Set(electronRuntimeInfoPlistKeyAllowlist);
  const unexpectedPackageOnlyKeys = packagedKeys.filter(
    (key) => !nativeKeys.has(key) && !allowedPackageOnlyKeys.has(key)
  );

  if (unexpectedPackageOnlyKeys.length > 0) {
    throw new Error(`Unexpected package-only Info.plist keys: ${unexpectedPackageOnlyKeys.join(", ")}`);
  }
}

function renameExecutable() {
  const sourceExecutable = path.join(outputAppPath, electronExecutableRelativePath);
  const destinationExecutable = path.join(outputAppPath, wikiwiseExecutableRelativePath);

  if (!fs.existsSync(sourceExecutable)) {
    throw new Error("Missing Electron executable at Contents/MacOS/Electron");
  }

  fs.rmSync(destinationExecutable, { force: true });
  fs.renameSync(sourceExecutable, destinationExecutable);
  fs.chmodSync(destinationExecutable, 0o755);
}

function removeElectronTemplateResources() {
  fs.rmSync(path.join(outputAppPath, ...electronTemplateIconRelativePath.split("/")), { force: true });
  fs.rmSync(path.join(outputAppPath, ...electronTemplatePkgInfoRelativePath.split("/")), { force: true });
}

function copyElectronAppSource() {
  const appRoot = path.join(outputAppPath, embeddedAppRelativePath);

  fs.rmSync(appRoot, { recursive: true, force: true });
  fs.mkdirSync(appRoot, { recursive: true });

  copyFile(path.join(electronPackageRoot, "package.json"), path.join(appRoot, "package.json"));
  copyDirectory(
    path.join(electronPackageRoot, ...electronMainSourceRelativePath.split("/")),
    path.join(appRoot, ...electronMainSourceRelativePath.split("/"))
  );
  copyDirectory(
    path.join(electronPackageRoot, ...electronPreloadSourceRelativePath.split("/")),
    path.join(appRoot, ...electronPreloadSourceRelativePath.split("/"))
  );
  copyDirectory(
    path.join(electronPackageRoot, ...electronRendererSourceRelativePath.split("/")),
    path.join(appRoot, ...electronRendererSourceRelativePath.split("/"))
  );
}

function copyCorePackage() {
  const coreDestination = path.join(
    outputAppPath,
    embeddedAppRelativePath,
    ...embeddedCoreRelativePath.split("/")
  );

  fs.rmSync(coreDestination, { recursive: true, force: true });
  copyFile(
    path.join(repositoryRoot, ...corePackageManifestRelativePath.split("/")),
    path.join(coreDestination, "package.json")
  );
  copyDirectory(
    path.join(repositoryRoot, ...coreSourceRelativePath.split("/")),
    path.join(coreDestination, "src")
  );
}

function resolveDependencyRoot(packageName) {
  const resolvedEntry = requireFromElectronPackage.resolve(packageName);
  let directory = path.dirname(resolvedEntry);
  const root = path.parse(directory).root;

  while (directory !== root) {
    const manifestPath = path.join(directory, "package.json");
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      if (manifest.name === packageName) {
        return directory;
      }
    }
    directory = path.dirname(directory);
  }

  throw new Error(`Unable to resolve Electron runtime dependency ${packageName}`);
}

function dependencyDestination(appRoot, packageName) {
  return path.join(appRoot, "node_modules", ...packageName.split("/"));
}

function copyElectronRuntimeDependencies() {
  const appRoot = path.join(outputAppPath, embeddedAppRelativePath);

  for (const dependencyName of electronRuntimeDependencyNames) {
    copyDirectory(
      resolveDependencyRoot(dependencyName),
      dependencyDestination(appRoot, dependencyName)
    );
  }
}

function packagedNodePtySpawnHelperPaths() {
  const appRoot = path.join(outputAppPath, embeddedAppRelativePath);
  const prebuildsPath = path.join(dependencyDestination(appRoot, "node-pty"), "prebuilds");

  if (!fs.existsSync(prebuildsPath)) {
    return [];
  }

  return fs.readdirSync(prebuildsPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("darwin-"))
    .map((entry) => path.join(prebuildsPath, entry.name, "spawn-helper"))
    .filter((helperPath) => fs.existsSync(helperPath));
}

function ensurePackagedNodePtySpawnHelperExecutable() {
  let repairedCount = 0;
  for (const helperPath of packagedNodePtySpawnHelperPaths()) {
    const stat = fs.statSync(helperPath);
    if ((stat.mode & 0o111) !== 0) {
      continue;
    }

    fs.chmodSync(helperPath, stat.mode | 0o111);
    repairedCount += 1;
  }
  return repairedCount;
}

function copyNativeResources() {
  const packagedResources = path.join(outputAppPath, "Contents", "Sources", "Wikiwise", "Resources");
  copyDirectory(nativeResourcesRoot, packagedResources);
  copyFile(
    path.join(nativeResourcesRoot, "Wikiwise.icns"),
    path.join(outputAppPath, ...packagedWikiwiseIconRelativePath.split("/"))
  );
}

function assertRequiredPackagedFiles() {
  for (const relativePath of [
    packagedInfoPlistRelativePath,
    wikiwiseExecutableRelativePath,
    packagedWikiwiseIconRelativePath,
    packagedDefaultAppAsarRelativePath
  ]) {
    assertFile(
      path.join(outputAppPath, ...relativePath.split("/")),
      `Missing required packaged file ${relativePath}`
    );
  }
}

function packageElectronMacApp() {
  assertDirectory(
    electronTemplatePath,
    `Missing installed Electron runtime at ${electronTemplateRelativePath}. Run npm install first.`
  );
  assertDirectory(nativeResourcesRoot, "Missing native Wikiwise resources.");

  fs.rmSync(outputAppPath, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(outputAppPath), { recursive: true });
  fs.cpSync(electronTemplatePath, outputAppPath, {
    recursive: true,
    force: true,
    verbatimSymlinks: true
  });

  renameExecutable();
  removeElectronTemplateResources();
  copyElectronAppSource();
  copyCorePackage();
  copyElectronRuntimeDependencies();
  ensurePackagedNodePtySpawnHelperExecutable();
  copyNativeResources();
  rewriteInfoPlist();
  assertPackagedInfoPlistKeyDelta();
  assertRequiredPackagedFiles();

  return {
    appPath: outputAppRelativePath,
    bundleIdentifier,
    version,
    bundleVersion: versionMetadata.bundleVersion
  };
}

try {
  const result = packageElectronMacApp();
  console.log(`Packaged ${productName} at ${result.appPath}`);
  console.log(`Bundle identifier: ${result.bundleIdentifier}`);
  console.log(`Version: ${result.version}`);
  console.log(`Bundle version: ${result.bundleVersion}`);
  console.log("This local Electron app bundle is unsigned; use bash scripts/build-release.sh <version> for signed, notarized DMG release.");
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
