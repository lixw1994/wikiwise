import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import * as core from "../src/index.js";
import {
  checkPublishAvailability,
  loadPublishConfig,
  publishSite,
  randomPublishSubdomain,
  unpublishSite
} from "../src/index.js";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = path.resolve(packageRoot, "..", "..");

function tempRoot(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function response(status, payload = {}) {
  return {
    status,
    async json() {
      return payload;
    },
    async text() {
      return typeof payload === "string" ? payload : JSON.stringify(payload);
    }
  };
}

function readRepository(relativePath) {
  return fs.readFileSync(path.join(repositoryRoot, relativePath), "utf8");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("loadPublishConfig returns target-aware official publish config and rejects malformed JSON", () => {
  const root = tempRoot("wikiwise-publish-config-");

  assert.equal(loadPublishConfig(root), null);

  const config = {
    subdomain: "my-wiki",
    token: "ww_token",
    lastPublishedAt: "2026-05-24T10:30:00.000Z",
    url: "https://my-wiki.wiki-wise.com"
  };
  writeFile(path.join(root, "publish.json"), JSON.stringify(config));

  assert.deepEqual(loadPublishConfig(root), {
    ...config,
    target: "official"
  });

  writeFile(path.join(root, "publish.json"), "{not-json");
  assert.throws(() => loadPublishConfig(root), { code: "corrupt_config" });
});

test("loadPublishConfig returns Cloudflare Hub publish config and validates required fields", () => {
  const root = tempRoot("wikiwise-cloudflare-hub-config-");
  const config = {
    target: "cloudflare-hub",
    lastPublishedAt: "2026-05-31T10:30:00.000Z",
    hub: {
      endpoint: "https://hub-wiki.flybullet.net",
      publishToken: "wwh_token",
      slug: "notes",
      url: "https://notes-wiki.flybullet.net",
      visibility: "private",
      authRealm: "shared",
      comments: {
        policy: "members-only"
      }
    }
  };

  writeFile(path.join(root, "publish.json"), JSON.stringify(config));

  assert.deepEqual(loadPublishConfig(root), config);

  writeFile(path.join(root, "publish.json"), JSON.stringify({
    target: "cloudflare-hub",
    hub: {
      endpoint: "https://hub-wiki.flybullet.net",
      publishToken: "wwh_token",
      slug: "notes",
      url: "https://notes-wiki.flybullet.net",
      visibility: "secret",
      authRealm: "shared",
      comments: {
        policy: "members-only"
      }
    }
  }));

  assert.throws(() => loadPublishConfig(root), { code: "corrupt_config" });
});

test("publish helpers expose native fixed error descriptions with stable codes", async () => {
  const nativeMessages = {
    corrupt_config: "publish.json exists but is malformed. Delete it to start fresh, or fix its contents.",
    token_mismatch: "Token doesn't match. Check your publish.json.",
    subdomain_taken: "That subdomain is already taken. Edit the subdomain in publish.json and try again.",
    rate_limited: "Too many publishes. Try again in a few minutes."
  };

  for (const message of Object.values(nativeMessages)) {
  }

  const malformedRoot = tempRoot("wikiwise-publish-copy-config-");
  writeFile(path.join(malformedRoot, "publish.json"), "{not-json");
  assert.throws(
    () => loadPublishConfig(malformedRoot),
    (error) => {
      assert.equal(error.code, "corrupt_config");
      assert.equal(error.message, nativeMessages.corrupt_config);
      return true;
    }
  );

  const cases = [
    [403, "token_mismatch", nativeMessages.token_mismatch],
    [409, "subdomain_taken", nativeMessages.subdomain_taken],
    [429, "rate_limited", nativeMessages.rate_limited]
  ];

  for (const [status, code, message] of cases) {
    const projectRoot = tempRoot(`wikiwise-publish-copy-${code}-`);
    const siteFolder = path.join(projectRoot, "site", "out");
    writeFile(path.join(siteFolder, "home.html"), "<h1>Home</h1>");

    await assert.rejects(
      () =>
        publishSite({
          projectRoot,
          siteFolder,
          subdomain: "fixed",
          fetch: async () => response(status, "failed"),
          randomSubdomain: () => "fixed",
          tokenGenerator: () => "ww_testtoken"
        }),
      (error) => {
        assert.equal(error.code, code);
        assert.equal(error.message, message);
        return true;
      }
    );
  }

  const unpublishRoot = tempRoot("wikiwise-unpublish-copy-token-");
  writeFile(path.join(unpublishRoot, "publish.json"), JSON.stringify({
    subdomain: "my-wiki",
    token: "ww_token",
    url: "https://my-wiki.wiki-wise.com"
  }));

  await assert.rejects(
    () =>
      unpublishSite({
        projectRoot: unpublishRoot,
        fetch: async () => response(403, "failed")
      }),
    (error) => {
      assert.equal(error.code, "token_mismatch");
      assert.equal(error.message, nativeMessages.token_mismatch);
      return true;
    }
  );
});

test("randomPublishSubdomain preserves native slug prefix and suffix shape", () => {
  const subdomain = randomPublishSubdomain("My Wiki Name With Extra Words");

  assert.match(subdomain, /^my-wiki-name-with-ex-[a-z0-9]{6}$/);
  assert.ok(subdomain.length <= 48);
});

test("randomPublishSubdomain truncates Unicode slug prefixes like native Publisher", () => {
  const subdomain = randomPublishSubdomain("\u{10400}".repeat(21));
  const prefix = subdomain.slice(0, -7);

  assert.equal(prefix, "\u{10428}".repeat(20));
  assert.equal(Array.from(prefix).length, 20);
  assert.equal(subdomain.slice(-7, -6), "-");
  assert.match(subdomain.slice(-6), /^[a-z0-9]{6}$/);
});

test("checkPublishAvailability maps service reasons and sends bearer token", async () => {
  const calls = [];
  const fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    return response(200, { reason: "owned" });
  };

  const result = await checkPublishAvailability("my-wiki", {
    token: "ww_token",
    fetch
  });

  assert.equal(result, "owned");
  assert.match(calls[0].url, /\/_check\?subdomain=my-wiki$/);
  assert.equal(calls[0].init.headers.Authorization, "Bearer ww_token");
});

test("publishSite uploads native payload, rewrites root home, and saves publish config", async () => {
  const projectRoot = tempRoot("wikiwise-publish-project-");
  const siteFolder = path.join(projectRoot, "site", "out");
  const now = new Date("2026-05-24T10:30:00.000Z");
  let uploadedPayload;
  let uploadHeaders;

  writeFile(path.join(siteFolder, "home.html"), '<a href="index.html">Index</a>');
  writeFile(path.join(siteFolder, "index.html"), '<a href="home.html">Home</a>');
  writeFile(path.join(siteFolder, "about.html"), '<a href="index.html#all">All</a>');

  const result = await publishSite({
    projectRoot,
    siteFolder,
    fetch: async (_url, init) => {
      uploadHeaders = init.headers;
      uploadedPayload = JSON.parse(init.body);
      return response(200, {});
    },
    now: () => now,
    randomSubdomain: () => "my-wiki-abc123",
    tokenGenerator: () => "ww_testtoken"
  });

  assert.equal(result.url, "https://my-wiki-abc123.wiki-wise.com");
  assert.equal(result.isFirstPublish, true);

  const byPath = new Map(uploadedPayload.files.map((entry) => [entry.path, entry.data]));
  assert.deepEqual([...byPath.keys()].sort(), ["about.html", "catalog.html", "home.html", "index.html"]);
  assert.equal(Buffer.from(byPath.get("index.html"), "base64").toString("utf8"), '<a href="catalog.html">Index</a>');
  assert.equal(Buffer.from(byPath.get("about.html"), "base64").toString("utf8"), '<a href="catalog.html#all">All</a>');
  assert.equal(uploadHeaders.Authorization, "Bearer ww_testtoken");
  assert.equal(uploadHeaders["X-Subdomain"], "my-wiki-abc123");

  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(projectRoot, "publish.json"), "utf8")), {
    lastPublishedAt: now.toISOString(),
    subdomain: "my-wiki-abc123",
    token: "ww_testtoken",
    url: "https://my-wiki-abc123.wiki-wise.com"
  });
});

test("prepareCloudflareHubPublishPayload rewrites root home and excludes secret-like settings", () => {
  const projectRoot = tempRoot("wikiwise-cloudflare-payload-");
  const siteFolder = path.join(projectRoot, "site", "out");

  writeFile(path.join(siteFolder, "home.html"), '<a href="index.html">Index</a>');
  writeFile(path.join(siteFolder, "index.html"), '<a href="home.html">Home</a>');
  writeFile(path.join(siteFolder, "about.html"), '<a href="index.html#all">All</a>');

  const payload = core.prepareCloudflareHubPublishPayload({
    siteFolder,
    slug: "notes",
    settings: {
      visibility: "private",
      authRealm: "shared",
      comments: {
        policy: "members-only"
      },
      oauth: {
        clientSecret: "should-not-ship"
      },
      clientSecret: "should-not-ship",
      sessionSecret: "should-not-ship",
      secrets: {
        anything: "should-not-ship"
      }
    }
  });

  assert.equal(payload.slug, "notes");
  assert.deepEqual(payload.settings, {
    visibility: "private",
    authRealm: "shared",
    comments: {
      policy: "members-only"
    }
  });

  const byPath = new Map(payload.files.map((entry) => [entry.path, entry.data]));
  assert.deepEqual([...byPath.keys()].sort(), ["about.html", "catalog.html", "home.html", "index.html"]);
  assert.equal(Buffer.from(byPath.get("index.html"), "base64").toString("utf8"), '<a href="catalog.html">Index</a>');
  assert.equal(Buffer.from(byPath.get("about.html"), "base64").toString("utf8"), '<a href="catalog.html#all">All</a>');

  const serialized = JSON.stringify(payload);
  assert.doesNotMatch(serialized, /should-not-ship/);
  assert.doesNotMatch(serialized, /clientSecret/);
  assert.doesNotMatch(serialized, /sessionSecret/);
  assert.doesNotMatch(serialized, /secrets/);
});

test("publishCloudflareHubSite uploads Hub payload and saves target-aware config", async () => {
  const projectRoot = tempRoot("wikiwise-cloudflare-publish-");
  const siteFolder = path.join(projectRoot, "site", "out");
  const now = new Date("2026-05-31T10:30:00.000Z");
  let request;

  writeFile(path.join(siteFolder, "home.html"), '<a href="index.html">Index</a>');
  writeFile(path.join(siteFolder, "index.html"), '<a href="home.html">Home</a>');
  writeFile(path.join(siteFolder, "about.html"), '<a href="index.html#all">All</a>');

  const result = await core.publishCloudflareHubSite({
    projectRoot,
    siteFolder,
    hubEndpoint: "https://hub-wiki.flybullet.net/",
    publishToken: "wwh_token",
    slug: "notes",
    settings: {
      visibility: "public",
      authRealm: "shared",
      comments: {
        policy: "login-required"
      }
    },
    fetch: async (url, init) => {
      request = { url: String(url), init };
      return response(200, { fileCount: 4 });
    },
    now: () => now
  });

  assert.equal(request.url, "https://hub-wiki.flybullet.net/_wikiwise/publish");
  assert.equal(request.init.method, "PUT");
  assert.equal(request.init.headers.Authorization, "Bearer wwh_token");
  assert.equal(request.init.headers["Content-Type"], "application/json");

  const payload = JSON.parse(request.init.body);
  assert.equal(payload.slug, "notes");
  assert.deepEqual(payload.settings, {
    visibility: "public",
    authRealm: "shared",
    comments: {
      policy: "login-required"
    }
  });
  assert.deepEqual(payload.files.map((entry) => entry.path).sort(), [
    "about.html",
    "catalog.html",
    "home.html",
    "index.html"
  ]);

  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(projectRoot, "publish.json"), "utf8")), {
    target: "cloudflare-hub",
    lastPublishedAt: now.toISOString(),
    hub: {
      endpoint: "https://hub-wiki.flybullet.net",
      publishToken: "wwh_token",
      slug: "notes",
      url: "https://notes-wiki.flybullet.net",
      visibility: "public",
      authRealm: "shared",
      comments: {
        policy: "login-required"
      }
    }
  });

  assert.deepEqual(result, {
    target: "cloudflare-hub",
    url: "https://notes-wiki.flybullet.net",
    fileCount: 4
  });
});

test("publishCloudflareHubSite maps Hub publish error status codes", async () => {
  for (const [status, code] of [
    [401, "token_mismatch"],
    [403, "token_mismatch"],
    [400, "validation_error"],
    [422, "validation_error"],
    [413, "too_large"],
    [429, "rate_limited"],
    [500, "server_error"]
  ]) {
    const projectRoot = tempRoot(`wikiwise-cloudflare-publish-${code}-`);
    const siteFolder = path.join(projectRoot, "site", "out");
    writeFile(path.join(siteFolder, "home.html"), "<h1>Home</h1>");

    await assert.rejects(
      () =>
        core.publishCloudflareHubSite({
          projectRoot,
          siteFolder,
          hubEndpoint: "https://hub-wiki.flybullet.net",
          publishToken: "wwh_token",
          slug: "notes",
          settings: {
            visibility: "private",
            authRealm: "per-wiki",
            comments: {
              policy: "members-only"
            }
          },
          fetch: async () => response(status, "failed")
        }),
      { code }
    );

    assert.equal(fs.existsSync(path.join(projectRoot, "publish.json")), false);
  }
});

test("publishSite retries first-publish subdomain conflicts with native suffix-only candidate", async () => {
  const parent = tempRoot("wikiwise-publish-conflict-parent-");
  const projectRoot = path.join(parent, "Collision Wiki");
  const siteFolder = path.join(projectRoot, "site", "out");
  const requests = [];

  writeFile(path.join(siteFolder, "home.html"), "<h1>Home</h1>");

  const result = await publishSite({
    projectRoot,
    siteFolder,
    fetch: async (_url, init) => {
      requests.push(init.headers["X-Subdomain"]);
      return response(requests.length === 1 ? 409 : 200, {});
    },
    now: () => new Date("2026-05-24T10:30:00.000Z"),
    tokenGenerator: () => "ww_testtoken"
  });

  assert.equal(requests.length, 2);
  assert.match(requests[0], /^collision-wiki-[a-z0-9]{6}$/);
  assert.match(requests[1], /^[a-z0-9]{6}$/);
  assert.doesNotMatch(requests[1], /collision-wiki/);
  assert.equal(result.url, `https://${requests[1]}.wiki-wise.com`);

  const savedConfig = JSON.parse(fs.readFileSync(path.join(projectRoot, "publish.json"), "utf8"));
  assert.equal(savedConfig.subdomain, requests[1]);
  assert.equal(savedConfig.url, `https://${requests[1]}.wiki-wise.com`);
});

test("publishSite maps native publish error status codes", async () => {
  const projectRoot = tempRoot("wikiwise-publish-errors-");
  const siteFolder = path.join(projectRoot, "site", "out");
  writeFile(path.join(siteFolder, "home.html"), "<h1>Home</h1>");

  for (const [status, code] of [
    [403, "token_mismatch"],
    [409, "subdomain_taken"],
    [413, "too_large"],
    [429, "rate_limited"],
    [500, "server_error"]
  ]) {
    await assert.rejects(
      () =>
        publishSite({
          projectRoot,
          siteFolder,
          subdomain: "fixed",
          fetch: async () => response(status, "failed"),
          randomSubdomain: () => "fixed",
          tokenGenerator: () => "ww_testtoken"
        }),
      { code }
    );
  }
});

test("unpublishSite deletes remotely and removes local publish config", async () => {
  const projectRoot = tempRoot("wikiwise-unpublish-");
  const configPath = path.join(projectRoot, "publish.json");
  const config = {
    subdomain: "my-wiki",
    token: "ww_token",
    url: "https://my-wiki.wiki-wise.com"
  };
  let request;

  writeFile(configPath, JSON.stringify(config));

  const result = await unpublishSite({
    projectRoot,
    fetch: async (url, init) => {
      request = { url: String(url), init };
      return response(404, {});
    }
  });

  assert.deepEqual(result, { unpublished: true });
  assert.equal(request.init.method, "DELETE");
  assert.equal(request.init.headers.Authorization, "Bearer ww_token");
  assert.equal(request.init.headers["X-Subdomain"], "my-wiki");
  assert.equal(fs.existsSync(configPath), false);
});
