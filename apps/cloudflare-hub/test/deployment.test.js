import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = path.resolve(packageRoot, "..", "..");

function readPackage(relativePath) {
  return fs.readFileSync(path.join(packageRoot, relativePath), "utf8");
}

function readPackageJson(relativePath) {
  return JSON.parse(readPackage(relativePath));
}

function findTomlBlock(source, headerPattern) {
  const match = source.match(headerPattern);
  assert.ok(match, `Expected TOML block matching ${headerPattern}`);

  const start = match.index;
  const nextBlock = source.slice(start + match[0].length).search(/\n(?:\[|\[\[)/);
  if (nextBlock === -1) {
    return source.slice(start);
  }
  return source.slice(start, start + match[0].length + nextBlock);
}

test("wrangler manifest declares the Hub Worker deployment bindings", () => {
  const manifest = readPackage("wrangler.toml");

  assert.match(manifest, /^name = "wikiwise-cloudflare-hub"$/m);
  assert.match(manifest, /^main = "src\/worker\.js"$/m);
  assert.match(manifest, /^compatibility_date = "\d{4}-\d{2}-\d{2}"$/m);
  assert.match(manifest, /pattern = "\*\.wiki\.flybullet\.net\/\*"/);
  assert.match(manifest, /zone_name = "wiki\.flybullet\.net"/);

  const vars = findTomlBlock(manifest, /^\[vars\]$/m);
  assert.match(vars, /^WIKIWISE_PUBLIC_DOMAIN = "wiki\.flybullet\.net"$/m);

  const d1 = findTomlBlock(manifest, /^\[\[d1_databases\]\]$/m);
  assert.match(d1, /^binding = "DB"$/m);
  assert.match(d1, /^database_name = "wikiwise-hub"$/m);
  assert.match(d1, /^database_id = "REPLACE_WITH_D1_DATABASE_ID"$/m);
  assert.match(d1, /^migrations_dir = "migrations"$/m);

  const r2 = findTomlBlock(manifest, /^\[\[r2_buckets\]\]$/m);
  assert.match(r2, /^binding = "WIKIWISE_FILES"$/m);
  assert.match(r2, /^bucket_name = "wikiwise-files"$/m);
});

test("wrangler manifest keeps Hub secret values out of source control", () => {
  const manifest = readPackage("wrangler.toml");
  const secretNames = [
    "WIKIWISE_PUBLISH_TOKEN",
    "WIKIWISE_SESSION_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "FEISHU_CLIENT_ID",
    "FEISHU_CLIENT_SECRET",
    "LARK_CLIENT_ID",
    "LARK_CLIENT_SECRET"
  ];

  for (const name of secretNames) {
    assert.doesNotMatch(manifest, new RegExp(`^\\s*${name}\\s*=`, "m"));
  }

  assert.doesNotMatch(manifest, /access_token/i);
  assert.doesNotMatch(manifest, /refresh_token/i);
  assert.doesNotMatch(manifest, /client_secret/i);
  assert.doesNotMatch(manifest, /Bearer\s+/i);
});

test("Hub package exposes Wrangler deployment and migration scripts", () => {
  const packageJson = readPackageJson("package.json");
  const rootPackageJson = JSON.parse(fs.readFileSync(path.join(repositoryRoot, "package.json"), "utf8"));

  assert.equal(packageJson.scripts.test, "node --test test/*.test.js");
  assert.equal(packageJson.scripts.dev, "wrangler dev --config wrangler.toml");
  assert.equal(packageJson.scripts["deploy:preflight"], "node scripts/deploy-preflight.js");
  assert.equal(packageJson.scripts.deploy, "wrangler deploy --config wrangler.toml");
  assert.match(packageJson.devDependencies.wrangler, /^\^?\d+\.\d+\.\d+$/);
  assert.equal(
    packageJson.scripts["d1:migrate:local"],
    "wrangler d1 migrations apply wikiwise-hub --local --config wrangler.toml"
  );
  assert.equal(
    packageJson.scripts["d1:migrate:remote"],
    "wrangler d1 migrations apply wikiwise-hub --remote --config wrangler.toml"
  );
  assert.equal(
    rootPackageJson.scripts["cloudflare-hub:deploy:preflight"],
    "npm --workspace @wikiwise/cloudflare-hub run deploy:preflight"
  );
});

test("Hub deployment preflight checks concrete Cloudflare deployment blockers", () => {
  const source = readPackage("scripts/deploy-preflight.js");

  assert.match(source, /REPLACE_WITH_D1_DATABASE_ID/);
  assert.match(source, /wrangler d1 create wikiwise-hub/);
  assert.match(source, /0003_user_profile_overrides\.sql/);
  assert.match(source, /WIKIWISE_PUBLISH_TOKEN/);
  assert.match(source, /WIKIWISE_SESSION_SECRET/);
  assert.match(source, /WIKIWISE_ADMIN_EMAILS/);
  assert.match(source, /wrangler.*--version/s);
});
