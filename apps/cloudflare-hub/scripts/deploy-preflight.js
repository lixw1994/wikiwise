#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(packageRoot, "wrangler.toml");
const migrationsDir = path.join(packageRoot, "migrations");
const requiredMigrations = [
  "0001_initial.sql",
  "0002_wiki_invitations.sql",
  "0003_user_profile_overrides.sql"
];
const requiredSecrets = [
  "WIKIWISE_PUBLISH_TOKEN",
  "WIKIWISE_SESSION_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "FEISHU_CLIENT_ID",
  "FEISHU_CLIENT_SECRET",
  "WIKIWISE_ADMIN_EMAILS"
];

const errors = [];
const warnings = [];

function readConfig() {
  try {
    return fs.readFileSync(configPath, "utf8");
  } catch (error) {
    errors.push(`Cannot read ${configPath}: ${error.message}`);
    return "";
  }
}

function requireMatch(source, pattern, message) {
  if (!pattern.test(source)) {
    errors.push(message);
  }
}

function checkWranglerCli() {
  if (process.env.WIKIWISE_DEPLOY_PREFLIGHT_SKIP_WRANGLER === "1") {
    warnings.push("Skipped Wrangler CLI check because WIKIWISE_DEPLOY_PREFLIGHT_SKIP_WRANGLER=1.");
    return;
  }

  try {
    const version = execFileSync("wrangler", ["--version"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    }).trim();
    if (version) {
      console.log(`Wrangler: ${version}`);
    }
  } catch {
    errors.push("Wrangler CLI is not available on PATH. Install it or run through a package-managed wrangler before deploying.");
  }
}

function checkWranglerManifest(source) {
  requireMatch(source, /^name = "wikiwise-cloudflare-hub"$/m, "wrangler.toml must keep Worker name wikiwise-cloudflare-hub.");
  requireMatch(source, /^main = "src\/worker\.js"$/m, "wrangler.toml must point main to src/worker.js.");
  requireMatch(source, /pattern = "\*\.wiki\.flybullet\.net\/\*"/, "wrangler.toml must declare the *.wiki.flybullet.net/* route.");
  requireMatch(source, /zone_name = "wiki\.flybullet\.net"/, "wrangler.toml must declare zone_name = wiki.flybullet.net.");
  requireMatch(source, /^WIKIWISE_PUBLIC_DOMAIN = "wiki\.flybullet\.net"$/m, "wrangler.toml must set WIKIWISE_PUBLIC_DOMAIN = wiki.flybullet.net.");
  requireMatch(source, /^binding = "DB"$/m, "wrangler.toml must declare D1 binding DB.");
  requireMatch(source, /^database_name = "wikiwise-hub"$/m, "wrangler.toml must declare D1 database_name wikiwise-hub.");
  requireMatch(source, /^migrations_dir = "migrations"$/m, "wrangler.toml must point D1 migrations_dir to migrations.");
  requireMatch(source, /^binding = "WIKIWISE_FILES"$/m, "wrangler.toml must declare R2 binding WIKIWISE_FILES.");
  requireMatch(source, /^bucket_name = "wikiwise-files"$/m, "wrangler.toml must declare R2 bucket_name wikiwise-files.");

  if (/^database_id = "REPLACE_WITH_D1_DATABASE_ID"$/m.test(source)) {
    errors.push("Replace database_id = \"REPLACE_WITH_D1_DATABASE_ID\" with the id returned by `wrangler d1 create wikiwise-hub`.");
  } else {
    requireMatch(source, /^database_id = "[0-9a-f-]{16,}"$/m, "wrangler.toml database_id must be a concrete Cloudflare D1 database id.");
  }
}

function checkMigrations() {
  for (const migration of requiredMigrations) {
    const migrationPath = path.join(migrationsDir, migration);
    if (!fs.existsSync(migrationPath)) {
      errors.push(`Missing required migration ${migrationPath}.`);
    }
  }
}

function printResult() {
  if (warnings.length) {
    console.warn("Warnings:");
    for (const warning of warnings) {
      console.warn(`- ${warning}`);
    }
  }

  if (errors.length) {
    console.error("Cloudflare Hub deploy preflight failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    console.error("");
    console.error("After fixing the blockers, run:");
    console.error("  npm --workspace @wikiwise/cloudflare-hub run d1:migrate:remote");
    console.error("  npm --workspace @wikiwise/cloudflare-hub run deploy");
    process.exit(1);
  }

  console.log("Cloudflare Hub deploy preflight passed.");
  console.log("Before deploying, make sure these Cloudflare secrets are set:");
  for (const name of requiredSecrets) {
    console.log(`- ${name}`);
  }
  console.log("Optional provider secrets: LARK_CLIENT_ID, LARK_CLIENT_SECRET.");
}

const manifest = readConfig();
checkWranglerCli();
checkWranglerManifest(manifest);
checkMigrations();
printResult();
