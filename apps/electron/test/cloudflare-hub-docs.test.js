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
  assert.match(readme, /apps\/cloudflare-hub\/wrangler\.toml/);
  assert.match(readme, /Worker route/);
  assert.match(readme, /D1/);
  assert.match(readme, /R2/);
  assert.match(readme, /wildcard DNS/);
  assert.match(readme, /wrangler secret put WIKIWISE_PUBLISH_TOKEN/);
  assert.match(readme, /WIKIWISE_SESSION_SECRET/);
  assert.match(readme, /PUBLISH_TOKEN/);
  assert.match(readme, /GOOGLE_CLIENT_ID/);
  assert.match(readme, /GOOGLE_CLIENT_SECRET/);
  assert.match(readme, /GOOGLE_TOKEN_URL/);
  assert.match(readme, /GOOGLE_USERINFO_URL/);
  assert.match(readme, /FEISHU_CLIENT_ID/);
  assert.match(readme, /FEISHU_CLIENT_SECRET/);
  assert.match(readme, /FEISHU_TOKEN_URL/);
  assert.match(readme, /FEISHU_USERINFO_URL/);
  assert.match(readme, /LARK_TOKEN_URL/);
  assert.match(readme, /LARK_USERINFO_URL/);
  assert.match(readme, /WIKIWISE_ADMIN_EMAILS/);
  assert.match(readme, /WIKIWISE_SESSION_DAYS/);
  assert.match(readme, /OAuth secrets/);
  assert.match(readme, /publish\.json/);
});

test("README documents Wrangler-backed Cloudflare Hub deployment commands", () => {
  const readme = readRepository("README.md");

  assert.match(readme, /npm --workspace @wikiwise\/cloudflare-hub run dev/);
  assert.match(readme, /npm --workspace @wikiwise\/cloudflare-hub run d1:migrate:local/);
  assert.match(readme, /npm run cloudflare-hub:deploy:preflight/);
  assert.match(readme, /npm --workspace @wikiwise\/cloudflare-hub run d1:migrate:remote/);
  assert.match(readme, /npm --workspace @wikiwise\/cloudflare-hub run deploy/);
  assert.match(readme, /REPLACE_WITH_D1_DATABASE_ID/);
  assert.match(readme, /wikiwise-files/);
});

test("README maps deployed Hub settings back to the publish dialog", () => {
  const readme = readRepository("README.md");

  assert.match(readme, /Hub endpoint/);
  assert.match(readme, /https:\/\/wiki\.flybullet\.net/);
  assert.match(readme, /publish token/);
  assert.match(readme, /wiki slug/);
  assert.match(readme, /visibility/);
  assert.match(readme, /auth realm/);
  assert.match(readme, /comment policy/);
  assert.match(readme, /Do not commit/);
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
