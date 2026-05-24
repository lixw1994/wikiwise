#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDir, "..");
const electronTemplateRelativePath = "node_modules/electron/dist/Electron.app";
const outputAppRelativePath = "apps/electron/out/Wikiwise.app";
const embeddedAppRelativePath = "Contents/Resources/app";
const electronExecutableRelativePath = "Contents/MacOS/Electron";
const wikiwiseExecutableRelativePath = "Contents/MacOS/Wikiwise";
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
const productName = "Wikiwise";
const bundleIdentifier = process.env.WIKIWISE_ELECTRON_BUNDLE_ID || "com.readwise.wikiwise";

const electronPackage = JSON.parse(
  fs.readFileSync(path.join(electronPackageRoot, "package.json"), "utf8")
);
const version = process.argv[2] || electronPackage.version || "0.0.0";

function assertDirectory(targetPath, message) {
  if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isDirectory()) {
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

function rewriteInfoPlist() {
  const infoPlistPath = path.join(outputAppPath, "Contents", "Info.plist");
  let plist = fs.readFileSync(infoPlistPath, "utf8");

  const updates = {
    CFBundleDisplayName: productName,
    CFBundleName: productName,
    CFBundleExecutable: productName,
    CFBundleIdentifier: bundleIdentifier,
    CFBundleShortVersionString: version,
    CFBundleVersion: version,
    CFBundleIconFile: productName,
    LSApplicationCategoryType: "public.app-category.productivity"
  };

  for (const [key, value] of Object.entries(updates)) {
    plist = setPlistString(plist, key, value);
  }

  fs.writeFileSync(infoPlistPath, plist);
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

function copyNativeResources() {
  const packagedResources = path.join(outputAppPath, "Contents", "Sources", "Wikiwise", "Resources");
  copyDirectory(nativeResourcesRoot, packagedResources);
  copyFile(
    path.join(nativeResourcesRoot, "Wikiwise.icns"),
    path.join(outputAppPath, "Contents", "Resources", "Wikiwise.icns")
  );
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
    force: true
  });

  renameExecutable();
  copyElectronAppSource();
  copyCorePackage();
  copyNativeResources();
  rewriteInfoPlist();

  return {
    appPath: outputAppRelativePath,
    bundleIdentifier,
    version
  };
}

try {
  const result = packageElectronMacApp();
  console.log(`Packaged ${productName} at ${result.appPath}`);
  console.log(`Bundle identifier: ${result.bundleIdentifier}`);
  console.log(`Version: ${result.version}`);
  console.log("This local Electron app bundle is unsigned; signed, notarized DMG release remains a separate gate.");
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
