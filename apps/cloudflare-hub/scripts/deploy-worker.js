#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceConfigPath = path.join(packageRoot, "wrangler.toml");

export function createTempConfigPath(pid = process.pid) {
  return path.join(packageRoot, `.wrangler-worker-only-${pid}.toml`);
}

export function removeRouteConfig(source) {
  let output = source.replace(/\nroutes\s*=\s*\[[\s\S]*?\]\n(?=\n?\[vars\])/m, "\n");
  output = output.replace(/\n\[\[routes\]\][\s\S]*?(?=\n(?:\[|\[\[)|$)/g, "\n");

  if (/^workers_dev\s*=/m.test(output)) {
    output = output.replace(/^workers_dev\s*=.*$/m, "workers_dev = false");
  } else {
    output = output.replace(/^(compatibility_date = ".*")$/m, "$1\nworkers_dev = false");
  }

  return output;
}

function deployWorker() {
  const tempConfigPath = createTempConfigPath();
  const sourceConfig = fs.readFileSync(sourceConfigPath, "utf8");
  const workerOnlyConfig = removeRouteConfig(sourceConfig);
  fs.writeFileSync(tempConfigPath, workerOnlyConfig);

  try {
    execFileSync("wrangler", ["deploy", "--config", tempConfigPath], {
      cwd: packageRoot,
      stdio: "inherit"
    });
  } finally {
    fs.rmSync(tempConfigPath, { force: true });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  deployWorker();
}
