#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDir, "..");
const packagedAppPath = path.join(repositoryRoot, "apps", "electron", "out", "Wikiwise.app");
const packagedExecutablePath = path.join(packagedAppPath, "Contents", "MacOS", "Wikiwise");
const reportPath = path.join(repositoryRoot, "apps", "electron", "out", "packaged-runtime-audit", "report.json");
const reportRoot = path.dirname(reportPath);

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function runPackagedAppAudit() {
  return new Promise((resolve, reject) => {
    const child = spawn(packagedExecutablePath, [
      "--audit-packaged-runtime",
      "--audit-report",
      reportPath
    ], {
      cwd: repositoryRoot,
      stdio: ["ignore", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";
    const timeout = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new Error("Packaged runtime audit timed out."));
    }, 30000);

    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    child.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.on("close", (code, signal) => {
      clearTimeout(timeout);
      if (code !== 0) {
        reject(new Error(`Packaged runtime audit exited with ${signal ?? code}.\n${stderr || stdout}`));
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

function validateReport() {
  if (!fs.existsSync(reportPath)) {
    throw new Error(`Packaged runtime audit did not write ${path.relative(repositoryRoot, reportPath)}`);
  }

  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  if (report.status !== "passed") {
    throw new Error(`Packaged runtime audit report status was ${JSON.stringify(report.status)}`);
  }
  if (report.renderer?.rendererLoaded !== true) {
    throw new Error("Packaged runtime audit did not observe rendererLoaded.");
  }
  if (report.renderer?.preloadBridgeObserved !== true) {
    throw new Error("Packaged runtime audit did not observe preloadBridgeObserved.");
  }
  if (report.terminal?.terminalEchoObserved !== true) {
    throw new Error("Packaged runtime audit did not observe terminalEchoObserved.");
  }

  return report;
}

try {
  if (!fs.existsSync(packagedExecutablePath)) {
    throw new Error(`Missing packaged app executable at ${path.relative(repositoryRoot, packagedExecutablePath)}. Run npm run electron:package:mac first.`);
  }

  fs.rmSync(reportRoot, { recursive: true, force: true });
  fs.mkdirSync(reportRoot, { recursive: true });
  await runPackagedAppAudit();
  const report = validateReport();

  console.log(`Packaged runtime audit report: ${path.relative(repositoryRoot, reportPath)}`);
  console.log(`Packaged runtime audit status: ${report.status}`);
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
