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

test("README documents Cloudflare Hub publishing and deployment overview", () => {
  const readme = readRepository("README.md");

  assert.match(readme, /## Self-hosted Cloudflare Hub/);
  assert.match(readme, /https:\/\/<slug>\.wiki\.flybullet\.net/);
  assert.match(readme, /official Wikiwise hosting service/);
  assert.match(readme, /Cloudflare Hub/);
  assert.match(readme, /public or private/);
  assert.match(readme, /shared realm/);
  assert.match(readme, /Google/);
  assert.match(readme, /Feishu\/Lark/);
  assert.match(readme, /comments and annotations/);
});

test("README documents manual Cloudflare setup boundaries", () => {
  const readme = readRepository("README.md");

  assert.match(readme, /apps\/cloudflare-hub/);
  assert.match(readme, /Worker route/);
  assert.match(readme, /D1/);
  assert.match(readme, /R2/);
  assert.match(readme, /wildcard DNS/);
  assert.match(readme, /PUBLISH_TOKEN/);
  assert.match(readme, /GOOGLE_CLIENT_ID/);
  assert.match(readme, /GOOGLE_CLIENT_SECRET/);
  assert.match(readme, /FEISHU_CLIENT_ID/);
  assert.match(readme, /FEISHU_CLIENT_SECRET/);
  assert.match(readme, /OAuth secrets/);
  assert.match(readme, /publish\.json/);
});

test("scaffold AGENTS guidance covers Cloudflare Hub publish workflows", () => {
  const agents = readRepository("apps/electron/resources/scaffold/AGENTS.md");

  assert.match(agents, /## Publishing/);
  assert.match(agents, /Cloudflare Hub/);
  assert.match(agents, /publish\.json/);
  assert.match(agents, /target/);
  assert.match(agents, /cloudflare-hub/);
  assert.match(agents, /visibility/);
  assert.match(agents, /auth realm/);
  assert.match(agents, /comment policy/);
  assert.match(agents, /public/);
  assert.match(agents, /private/);
  assert.match(agents, /Do not commit real publish tokens/);
});
