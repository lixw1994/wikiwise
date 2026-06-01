import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { handleRequest } from "../src/worker.js";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function base64(content) {
  return Buffer.from(content, "utf8").toString("base64");
}

function createEnv() {
  const wikis = new Map();
  const users = new Map();
  const sessions = new Map();
  const memberships = new Map();
  const comments = new Map();
  const oauthStates = new Map();
  const oauthAccounts = new Map();
  const revisions = [];
  const objects = new Map();

  return {
    WIKIWISE_PUBLISH_TOKEN: "secret",
    WIKIWISE_PUBLIC_DOMAIN: "wiki.flybullet.net",
    DB: {
      wikis,
      users,
      sessions,
      memberships,
      comments,
      oauthStates,
      oauthAccounts,
      revisions,
      prepare(sql) {
        return {
          bind(...values) {
            return {
              async run() {
                if (/INSERT INTO wikis/i.test(sql)) {
                  const [slug, visibility, authRealm, commentPolicy, updatedAt] = values;
                  wikis.set(slug, {
                    slug,
                    visibility,
                    authRealm,
                    commentPolicy,
                    updatedAt
                  });
                } else if (/INSERT INTO users/i.test(sql)) {
                  const [id, displayName, avatarUrl, updatedAt] = values;
                  users.set(id, {
                    id,
                    displayName,
                    avatarUrl,
                    updatedAt
                  });
                } else if (/INSERT INTO oauth_states/i.test(sql)) {
                  const [id, provider, wikiSlug, returnTo, expiresAt, createdAt] = values;
                  oauthStates.set(id, {
                    id,
                    provider,
                    wikiSlug,
                    returnTo,
                    expiresAt,
                    createdAt
                  });
                } else if (/INSERT INTO oauth_accounts/i.test(sql)) {
                  const [id, userId, provider, providerSubject, email] = values;
                  oauthAccounts.set(`${provider}:${providerSubject}`, {
                    id,
                    userId,
                    provider,
                    providerSubject,
                    email
                  });
                } else if (/INSERT INTO sessions/i.test(sql)) {
                  const [id, userId, expiresAt] = values;
                  sessions.set(id, {
                    id,
                    userId,
                    expiresAt
                  });
                } else if (/INSERT INTO wiki_members/i.test(sql)) {
                  const [wikiSlug, userId, role] = values;
                  memberships.set(`${wikiSlug}:${userId}`, {
                    wikiSlug,
                    userId,
                    role
                  });
                } else if (/INSERT INTO page_revisions/i.test(sql)) {
                  revisions.push({
                    slug: values[0],
                    fileCount: values[1],
                    createdAt: values[2]
                  });
                } else if (/INSERT INTO comments/i.test(sql)) {
                  const [
                    id,
                    wikiSlug,
                    pagePath,
                    userId,
                    parentCommentId,
                    body,
                    anchorJson,
                    status,
                    createdAt,
                    updatedAt
                  ] = values;
                  comments.set(id, {
                    id,
                    wikiSlug,
                    pagePath,
                    userId,
                    parentCommentId,
                    body,
                    anchorJson,
                    status,
                    createdAt,
                    updatedAt
                  });
                } else if (/UPDATE comments/i.test(sql)) {
                  const [status, updatedAt, id] = values;
                  const comment = comments.get(id);
                  if (comment) {
                    comment.status = status;
                    comment.updatedAt = updatedAt;
                  }
                } else if (/DELETE FROM oauth_states/i.test(sql)) {
                  oauthStates.delete(values[0]);
                } else if (/DELETE FROM sessions/i.test(sql)) {
                  sessions.delete(values[0]);
                }
                return { success: true };
              },
              async first() {
                if (/FROM wikis/i.test(sql)) {
                  return wikis.get(values[0]) ?? null;
                }
                if (/FROM oauth_states/i.test(sql)) {
                  return oauthStates.get(values[0]) ?? null;
                }
                if (/FROM oauth_accounts/i.test(sql)) {
                  return oauthAccounts.get(`${values[0]}:${values[1]}`) ?? null;
                }
                if (/FROM sessions/i.test(sql)) {
                  const session = sessions.get(values[0]);
                  if (!session) return null;
                  const user = users.get(session.userId);
                  if (!user) return null;

                  return {
                    id: session.id,
                    userId: session.userId,
                    displayName: user.displayName,
                    avatarUrl: user.avatarUrl ?? null,
                    expiresAt: session.expiresAt
                  };
                }
                if (/FROM wiki_members/i.test(sql)) {
                  return memberships.get(`${values[0]}:${values[1]}`) ?? null;
                }
                if (/FROM comments/i.test(sql)) {
                  return comments.get(values[0]) ?? null;
                }
                return null;
              },
              async all() {
                if (/FROM comments/i.test(sql)) {
                  return {
                    results: [...comments.values()]
                      .filter((comment) => comment.wikiSlug === values[0] && comment.pagePath === values[1])
                      .sort((left, right) => left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id))
                  };
                }
                return { results: [] };
              }
            };
          }
        };
      }
    },
    WIKIWISE_FILES: {
      objects,
      async put(key, value, options = {}) {
        objects.set(key, {
          value: Buffer.from(value),
          httpMetadata: options.httpMetadata ?? {}
        });
      },
      async get(key) {
        const object = objects.get(key);
        if (!object) return null;

        return {
          httpMetadata: object.httpMetadata,
          async arrayBuffer() {
            return object.value;
          }
        };
      },
      async list(options = {}) {
        const prefix = options.prefix ?? "";
        return {
          objects: [...objects.keys()]
            .filter((key) => key.startsWith(prefix))
            .map((key) => ({ key })),
          truncated: false
        };
      },
      async delete(key) {
        objects.delete(key);
      }
    }
  };
}

async function postComment(env, slug, body, sessionId = "session-1") {
  return handleRequest(
    new Request(`https://${slug}.wiki.flybullet.net/_wikiwise/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(sessionId ? { Cookie: `wwh_session=${sessionId}` } : {})
      },
      body: JSON.stringify(body)
    }),
    env
  );
}

async function listComments(env, slug, pagePath = "index.html", sessionId = null) {
  return handleRequest(
    new Request(`https://${slug}.wiki.flybullet.net/_wikiwise/comments?pagePath=${encodeURIComponent(pagePath)}`, {
      headers: {
        ...(sessionId ? { Cookie: `wwh_session=${sessionId}` } : {})
      }
    }),
    env
  );
}

function addUserSession(env, options = {}) {
  const userId = options.userId ?? "user-1";
  const sessionId = options.sessionId ?? "session-1";
  env.DB.users.set(userId, {
    id: userId,
    displayName: options.displayName ?? "Li Xianwei",
    avatarUrl: options.avatarUrl ?? "https://cdn.example/avatar.png"
  });
  env.DB.sessions.set(sessionId, {
    id: sessionId,
    userId,
    expiresAt: options.expiresAt ?? "2999-01-01T00:00:00.000Z"
  });

  for (const slug of options.memberOf ?? []) {
    env.DB.memberships.set(`${slug}:${userId}`, {
      wikiSlug: slug,
      userId,
      role: "member"
    });
  }

  return sessionId;
}

function addOAuthState(env, options = {}) {
  const id = options.id ?? "oauth_state_test";
  env.DB.oauthStates.set(id, {
    id,
    provider: options.provider ?? "google",
    wikiSlug: options.wikiSlug ?? "notes",
    returnTo: options.returnTo ?? `https://${options.wikiSlug ?? "notes"}.wiki.flybullet.net/`,
    expiresAt: options.expiresAt ?? "2999-01-01T00:00:00.000Z",
    createdAt: options.createdAt ?? "2026-01-01T00:00:00.000Z"
  });
  return id;
}

function oauthEnv(overrides = {}) {
  return {
    GOOGLE_CLIENT_ID: "google-client",
    GOOGLE_CLIENT_SECRET: "google-secret",
    GOOGLE_AUTHORIZATION_URL: "https://accounts.example/google/auth",
    GOOGLE_TOKEN_URL: "https://accounts.example/google/token",
    GOOGLE_USERINFO_URL: "https://accounts.example/google/userinfo",
    ...overrides
  };
}

function mockOAuthFetch(profile, options = {}) {
  return async (request) => {
    const url = typeof request === "string" ? request : request.url;
    if (url === "https://accounts.example/google/token") {
      if (options.tokenStatus && options.tokenStatus >= 400) {
        return new Response(options.tokenBody ?? "provider secret failure", {
          status: options.tokenStatus
        });
      }
      return Response.json({
        access_token: options.accessToken ?? "provider-access-token",
        token_type: "Bearer"
      });
    }
    if (url === "https://accounts.example/google/userinfo") {
      if (options.profileStatus && options.profileStatus >= 400) {
        return new Response(options.profileBody ?? "provider profile failure", {
          status: options.profileStatus
        });
      }
      return Response.json(profile);
    }
    return new Response("not found", { status: 404 });
  };
}

function sessionCookieFrom(response) {
  const setCookie = response.headers.get("Set-Cookie") ?? "";
  const match = setCookie.match(/wwh_session=([^;]+)/);
  return match ? `wwh_session=${match[1]}` : "";
}

async function publish(env, body, headers = { Authorization: "Bearer secret" }) {
  return handleRequest(
    new Request("https://hub.wiki.flybullet.net/_wikiwise/publish", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      body: JSON.stringify(body)
    }),
    env
  );
}

test("publish endpoint stores valid publish and serves public wiki root", async () => {
  const env = createEnv();
  const response = await publish(env, {
    slug: "notes",
    settings: {
      visibility: "public",
      authRealm: "shared",
      comments: {
        policy: "login-required"
      }
    },
    files: [
      { path: "index.html", data: base64("<h1>Home</h1>") },
      { path: "about.html", data: base64("<h1>About</h1>") }
    ]
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ok: true,
    slug: "notes",
    url: "https://notes.wiki.flybullet.net",
    fileCount: 2
  });
  assert.deepEqual(env.DB.wikis.get("notes"), {
    slug: "notes",
    visibility: "public",
    authRealm: "shared",
    commentPolicy: "login-required",
    updatedAt: env.DB.wikis.get("notes").updatedAt
  });
  assert.equal(env.DB.revisions.length, 1);
  assert.equal(env.WIKIWISE_FILES.objects.has("notes/index.html"), true);
  assert.equal(env.WIKIWISE_FILES.objects.has("notes/about.html"), true);

  const served = await handleRequest(new Request("https://notes.wiki.flybullet.net/"), env);
  assert.equal(served.status, 200);
  assert.equal(served.headers.get("Content-Type"), "text/html; charset=utf-8");
  assert.equal(await served.text(), "<h1>Home</h1>");
});

test("public and private wiki reads follow session membership access checks", async () => {
  const env = createEnv();
  await publish(env, {
    slug: "public-notes",
    settings: {
      visibility: "public",
      authRealm: "shared",
      comments: {
        policy: "login-required"
      }
    },
    files: [{ path: "index.html", data: base64("<h1>Public</h1>") }]
  });
  await publish(env, {
    slug: "private-notes",
    settings: {
      visibility: "private",
      authRealm: "shared",
      comments: {
        policy: "members-only"
      }
    },
    files: [{ path: "index.html", data: base64("<h1>Private</h1>") }]
  });

  const publicRead = await handleRequest(new Request("https://public-notes.wiki.flybullet.net/"), env);
  assert.equal(publicRead.status, 200);
  assert.equal(await publicRead.text(), "<h1>Public</h1>");

  const anonymousPrivateRead = await handleRequest(new Request("https://private-notes.wiki.flybullet.net/"), env);
  assert.equal(anonymousPrivateRead.status, 401);
  assert.equal(await anonymousPrivateRead.text(), "Sign in required");

  const sessionId = addUserSession(env, { memberOf: ["private-notes"] });
  const authorizedPrivateRead = await handleRequest(
    new Request("https://private-notes.wiki.flybullet.net/", {
      headers: {
        Cookie: `wwh_session=${sessionId}`
      }
    }),
    env
  );
  assert.equal(authorizedPrivateRead.status, 200);
  assert.equal(await authorizedPrivateRead.text(), "<h1>Private</h1>");
});

test("shared realm profile is reused while per-wiki membership gates private access", async () => {
  const env = createEnv();
  for (const slug of ["shared-a", "shared-b"]) {
    await publish(env, {
      slug,
      settings: {
        visibility: "public",
        authRealm: "shared",
        comments: {
          policy: "login-required"
        }
      },
      files: [{ path: "index.html", data: base64(`<h1>${slug}</h1>`) }]
    });
  }
  for (const slug of ["private-a", "private-b"]) {
    await publish(env, {
      slug,
      settings: {
        visibility: "private",
        authRealm: "per-wiki",
        comments: {
          policy: "members-only"
        }
      },
      files: [{ path: "index.html", data: base64(`<h1>${slug}</h1>`) }]
    });
  }
  const sessionId = addUserSession(env, { memberOf: ["private-a"] });
  const sessionCookie = { Cookie: `wwh_session=${sessionId}` };

  const sharedA = await handleRequest(new Request("https://shared-a.wiki.flybullet.net/_wikiwise/me", {
    headers: sessionCookie
  }), env);
  const sharedB = await handleRequest(new Request("https://shared-b.wiki.flybullet.net/_wikiwise/me", {
    headers: sessionCookie
  }), env);
  assert.equal(sharedA.status, 200);
  assert.equal(sharedB.status, 200);
  assert.deepEqual((await sharedA.json()).user, (await sharedB.json()).user);

  const memberRead = await handleRequest(new Request("https://private-a.wiki.flybullet.net/", {
    headers: sessionCookie
  }), env);
  assert.equal(memberRead.status, 200);
  assert.equal(await memberRead.text(), "<h1>private-a</h1>");

  const nonMemberRead = await handleRequest(new Request("https://private-b.wiki.flybullet.net/", {
    headers: sessionCookie
  }), env);
  assert.equal(nonMemberRead.status, 403);
  assert.equal(await nonMemberRead.text(), "Forbidden");
});

test("per-wiki realm scopes visible profile and comment identity per wiki", async () => {
  const env = createEnv();
  for (const slug of ["realm-a", "realm-b"]) {
    await publish(env, {
      slug,
      settings: {
        visibility: "public",
        authRealm: "per-wiki",
        comments: {
          policy: "login-required"
        }
      },
      files: [{ path: "index.html", data: base64(`<h1>${slug}</h1>`) }]
    });
  }
  const sessionId = addUserSession(env);
  const sessionCookie = { Cookie: `wwh_session=${sessionId}` };

  const profileA = await handleRequest(new Request("https://realm-a.wiki.flybullet.net/_wikiwise/me", {
    headers: sessionCookie
  }), env);
  const profileB = await handleRequest(new Request("https://realm-b.wiki.flybullet.net/_wikiwise/me", {
    headers: sessionCookie
  }), env);

  assert.equal(profileA.status, 200);
  assert.equal(profileB.status, 200);
  const userA = (await profileA.json()).user;
  const userB = (await profileB.json()).user;
  assert.notEqual(userA.id, userB.id);
  assert.match(userA.id, /^wiki:realm-a:/);
  assert.match(userB.id, /^wiki:realm-b:/);

  const commentA = await postComment(env, "realm-a", {
    pagePath: "index.html",
    body: "A"
  }, sessionId);
  const commentB = await postComment(env, "realm-b", {
    pagePath: "index.html",
    body: "B"
  }, sessionId);

  assert.equal(commentA.status, 201);
  assert.equal(commentB.status, 201);
  assert.notEqual((await commentA.json()).comment.userId, (await commentB.json()).comment.userId);
});

test("OIDC provider boundaries expose configured providers without leaking secrets", async () => {
  const env = {
    ...createEnv(),
    GOOGLE_CLIENT_ID: "google-client",
    GOOGLE_CLIENT_SECRET: "google-secret",
    GOOGLE_AUTHORIZATION_URL: "https://accounts.example/google/auth",
    FEISHU_CLIENT_ID: "feishu-client",
    FEISHU_CLIENT_SECRET: "feishu-secret",
    FEISHU_AUTHORIZATION_URL: "https://accounts.example/feishu/auth",
    FEISHU_TOKEN_URL: "https://accounts.example/feishu/token",
    FEISHU_USERINFO_URL: "https://accounts.example/feishu/userinfo",
    LARK_CLIENT_ID: "lark-client",
    LARK_CLIENT_SECRET: "lark-secret",
    LARK_AUTHORIZATION_URL: "https://accounts.example/lark/auth",
    LARK_TOKEN_URL: "https://accounts.example/lark/token",
    LARK_USERINFO_URL: "https://accounts.example/lark/userinfo"
  };

  const providersResponse = await handleRequest(
    new Request("https://notes.wiki.flybullet.net/_wikiwise/auth/providers"),
    env
  );
  assert.equal(providersResponse.status, 200);
  const providers = await providersResponse.json();
  assert.deepEqual(providers.providers.map((provider) => provider.id), ["google", "feishu", "lark"]);
  assert.equal(JSON.stringify(providers).includes("secret"), false);

  const startResponse = await handleRequest(
    new Request("https://notes.wiki.flybullet.net/_wikiwise/auth/google/start?returnTo=https%3A%2F%2Fnotes.wiki.flybullet.net%2F"),
    env
  );

  assert.equal(startResponse.status, 302);
  const location = new URL(startResponse.headers.get("Location"));
  assert.equal(`${location.origin}${location.pathname}`, "https://accounts.example/google/auth");
  assert.equal(location.searchParams.get("response_type"), "code");
  assert.equal(location.searchParams.get("client_id"), "google-client");
  assert.equal(location.searchParams.get("redirect_uri"), "https://notes.wiki.flybullet.net/_wikiwise/auth/google/callback");
  assert.equal(location.searchParams.get("scope"), "openid profile email");
});

test("OIDC providers without callback endpoints are not advertised or started", async () => {
  const env = {
    ...createEnv(),
    GOOGLE_CLIENT_ID: "google-client",
    GOOGLE_CLIENT_SECRET: "google-secret",
    GOOGLE_AUTHORIZATION_URL: "https://accounts.example/google/auth",
    FEISHU_CLIENT_ID: "feishu-client",
    FEISHU_CLIENT_SECRET: "feishu-secret",
    FEISHU_AUTHORIZATION_URL: "https://accounts.example/feishu/auth",
    LARK_CLIENT_ID: "lark-client",
    LARK_CLIENT_SECRET: "lark-secret",
    LARK_AUTHORIZATION_URL: "https://accounts.example/lark/auth"
  };

  const providersResponse = await handleRequest(
    new Request("https://notes.wiki.flybullet.net/_wikiwise/auth/providers"),
    env
  );
  assert.equal(providersResponse.status, 200);
  assert.deepEqual((await providersResponse.json()).providers.map((provider) => provider.id), ["google"]);

  const startFeishu = await handleRequest(
    new Request("https://notes.wiki.flybullet.net/_wikiwise/auth/feishu/start"),
    env
  );
  assert.equal(startFeishu.status, 404);
});

test("OIDC start stores opaque state and validates return target", async () => {
  const env = {
    ...createEnv(),
    GOOGLE_CLIENT_ID: "google-client",
    GOOGLE_CLIENT_SECRET: "google-secret",
    GOOGLE_AUTHORIZATION_URL: "https://accounts.example/google/auth"
  };
  await publish(env, {
    slug: "notes",
    settings: {
      visibility: "public",
      authRealm: "shared",
      comments: {
        policy: "login-required"
      }
    },
    files: [{ path: "index.html", data: base64("<h1>Notes</h1>") }]
  });

  const response = await handleRequest(
    new Request("https://notes.wiki.flybullet.net/_wikiwise/auth/google/start?returnTo=https%3A%2F%2Fevil.example%2Fsteal"),
    env
  );

  assert.equal(response.status, 302);
  const location = new URL(response.headers.get("Location"));
  const state = location.searchParams.get("state");
  assert.match(state, /^oauth_state_/);
  assert.notEqual(state, "https://evil.example/steal");
  assert.equal(env.DB.oauthStates.size, 1);
  assert.deepEqual(env.DB.oauthStates.get(state), {
    id: state,
    provider: "google",
    wikiSlug: "notes",
    returnTo: "https://notes.wiki.flybullet.net/",
    expiresAt: env.DB.oauthStates.get(state).expiresAt,
    createdAt: env.DB.oauthStates.get(state).createdAt
  });
});

test("OAuth callback creates user, linked provider account, session cookie, and safe redirect", async () => {
  const env = {
    ...createEnv(),
    ...oauthEnv()
  };
  env.fetch = mockOAuthFetch({
    sub: "google-user-1",
    name: "Li Xianwei",
    picture: "https://cdn.example/avatar.png",
    email: "lixianwei1994@gmail.com"
  });
  await publish(env, {
    slug: "notes",
    settings: {
      visibility: "public",
      authRealm: "shared",
      comments: { policy: "login-required" }
    },
    files: [{ path: "index.html", data: base64("<h1>Notes</h1>") }]
  });
  addOAuthState(env, {
    id: "oauth_state_success",
    wikiSlug: "notes",
    returnTo: "https://notes.wiki.flybullet.net/deep/page.html"
  });

  const response = await handleRequest(
    new Request("https://notes.wiki.flybullet.net/_wikiwise/auth/google/callback?code=code-123&state=oauth_state_success"),
    env
  );

  assert.equal(response.status, 302);
  assert.equal(response.headers.get("Location"), "https://notes.wiki.flybullet.net/deep/page.html");
  const setCookie = response.headers.get("Set-Cookie") ?? "";
  assert.match(setCookie, /^wwh_session=session_/);
  assert.match(setCookie, /HttpOnly/);
  assert.match(setCookie, /Secure/);
  assert.match(setCookie, /SameSite=Lax/);
  assert.match(setCookie, /Domain=\.wiki\.flybullet\.net/);
  assert.equal(setCookie.includes("provider-access-token"), false);
  assert.equal(env.DB.users.size, 1);
  assert.equal(env.DB.oauthAccounts.size, 1);
  assert.equal(env.DB.sessions.size, 1);
  assert.equal(env.DB.oauthStates.has("oauth_state_success"), false);

  const profile = await handleRequest(new Request("https://notes.wiki.flybullet.net/_wikiwise/me", {
    headers: { Cookie: sessionCookieFrom(response) }
  }), env);
  assert.equal(profile.status, 200);
  assert.deepEqual((await profile.json()).user, {
    id: [...env.DB.users.keys()][0],
    displayName: "Li Xianwei",
    avatarUrl: "https://cdn.example/avatar.png"
  });
});

test("OAuth callback rejects invalid, expired, mismatched, and reused state", async () => {
  const env = {
    ...createEnv(),
    ...oauthEnv()
  };
  env.fetch = mockOAuthFetch({
    sub: "google-user-1",
    name: "Li Xianwei",
    email: "lixianwei1994@gmail.com"
  });
  await publish(env, {
    slug: "notes",
    settings: {
      visibility: "public",
      authRealm: "shared",
      comments: { policy: "login-required" }
    },
    files: [{ path: "index.html", data: base64("<h1>Notes</h1>") }]
  });
  addOAuthState(env, {
    id: "oauth_state_expired",
    wikiSlug: "notes",
    expiresAt: "2000-01-01T00:00:00.000Z"
  });
  addOAuthState(env, {
    id: "oauth_state_feishu",
    provider: "feishu",
    wikiSlug: "notes"
  });

  for (const url of [
    "https://notes.wiki.flybullet.net/_wikiwise/auth/google/callback?code=code-123",
    "https://notes.wiki.flybullet.net/_wikiwise/auth/google/callback?code=code-123&state=unknown",
    "https://notes.wiki.flybullet.net/_wikiwise/auth/google/callback?code=code-123&state=oauth_state_expired",
    "https://notes.wiki.flybullet.net/_wikiwise/auth/google/callback?code=code-123&state=oauth_state_feishu"
  ]) {
    const response = await handleRequest(new Request(url), env);
    assert.equal(response.status, 400);
    assert.equal(response.headers.has("Set-Cookie"), false);
  }
  assert.equal(env.DB.users.size, 0);
  assert.equal(env.DB.oauthAccounts.size, 0);
  assert.equal(env.DB.sessions.size, 0);

  addOAuthState(env, {
    id: "oauth_state_reused",
    wikiSlug: "notes"
  });
  const first = await handleRequest(
    new Request("https://notes.wiki.flybullet.net/_wikiwise/auth/google/callback?code=code-123&state=oauth_state_reused"),
    env
  );
  assert.equal(first.status, 302);

  const second = await handleRequest(
    new Request("https://notes.wiki.flybullet.net/_wikiwise/auth/google/callback?code=code-123&state=oauth_state_reused"),
    env
  );
  assert.equal(second.status, 400);
  assert.equal(env.DB.sessions.size, 1);
});

test("OAuth provider exchange and profile failures do not expose provider internals", async () => {
  for (const [fetchImpl, expectedText] of [
    [mockOAuthFetch({}, { tokenStatus: 500, tokenBody: "provider-super-secret-token-error" }), "oauth_exchange_failed"],
    [mockOAuthFetch({ name: "Missing Subject", email: "missing@example.com" }), "oauth_profile_missing_subject"]
  ]) {
    const env = {
      ...createEnv(),
      ...oauthEnv()
    };
    env.fetch = fetchImpl;
    addOAuthState(env, {
      id: "oauth_state_failure",
      wikiSlug: "notes"
    });

    const response = await handleRequest(
      new Request("https://notes.wiki.flybullet.net/_wikiwise/auth/google/callback?code=code-123&state=oauth_state_failure"),
      env
    );

    assert.equal(response.status, 502);
    const text = await response.text();
    assert.equal(text, expectedText);
    assert.equal(text.includes("provider-super-secret"), false);
    assert.equal(env.DB.users.size, 0);
    assert.equal(env.DB.sessions.size, 0);
  }
});

test("session lifecycle covers profile access, expired sessions, and logout", async () => {
  const env = createEnv();
  await publish(env, {
    slug: "notes",
    settings: {
      visibility: "public",
      authRealm: "shared",
      comments: { policy: "login-required" }
    },
    files: [{ path: "index.html", data: base64("<h1>Notes</h1>") }]
  });
  const activeSession = addUserSession(env, { sessionId: "session-active" });
  const expiredSession = addUserSession(env, {
    sessionId: "session-expired",
    userId: "user-expired",
    expiresAt: "2000-01-01T00:00:00.000Z"
  });

  const signedIn = await handleRequest(new Request("https://notes.wiki.flybullet.net/_wikiwise/me", {
    headers: { Cookie: `wwh_session=${activeSession}` }
  }), env);
  assert.equal(signedIn.status, 200);

  const expired = await handleRequest(new Request("https://notes.wiki.flybullet.net/_wikiwise/me", {
    headers: { Cookie: `wwh_session=${expiredSession}` }
  }), env);
  assert.equal(expired.status, 401);

  const unknown = await handleRequest(new Request("https://notes.wiki.flybullet.net/_wikiwise/me", {
    headers: { Cookie: "wwh_session=missing" }
  }), env);
  assert.equal(unknown.status, 401);

  const logout = await handleRequest(new Request("https://notes.wiki.flybullet.net/_wikiwise/logout", {
    method: "POST",
    headers: { Cookie: `wwh_session=${activeSession}` }
  }), env);
  assert.equal(logout.status, 204);
  assert.equal(env.DB.sessions.has(activeSession), false);
  assert.match(logout.headers.get("Set-Cookie") ?? "", /Max-Age=0/);

  const afterLogout = await handleRequest(new Request("https://notes.wiki.flybullet.net/_wikiwise/me", {
    headers: { Cookie: `wwh_session=${activeSession}` }
  }), env);
  assert.equal(afterLogout.status, 401);
});

test("private wiki owner bootstrap grants only callback wiki membership", async () => {
  const env = {
    ...createEnv(),
    ...oauthEnv({ WIKIWISE_ADMIN_EMAILS: "owner@example.com" })
  };
  env.fetch = mockOAuthFetch({
    sub: "owner-provider-subject",
    name: "Owner",
    email: "owner@example.com",
    email_verified: true
  });
  for (const slug of ["private-a", "private-b"]) {
    await publish(env, {
      slug,
      settings: {
        visibility: "private",
        authRealm: "shared",
        comments: { policy: "members-only" }
      },
      files: [{ path: "index.html", data: base64(`<h1>${slug}</h1>`) }]
    });
  }
  addOAuthState(env, {
    id: "oauth_state_owner",
    wikiSlug: "private-a"
  });

  const ownerCallback = await handleRequest(
    new Request("https://private-a.wiki.flybullet.net/_wikiwise/auth/google/callback?code=code-123&state=oauth_state_owner"),
    env
  );
  assert.equal(ownerCallback.status, 302);
  const ownerUserId = [...env.DB.oauthAccounts.values()][0].userId;
  assert.deepEqual(env.DB.memberships.get(`private-a:${ownerUserId}`), {
    wikiSlug: "private-a",
    userId: ownerUserId,
    role: "owner"
  });

  const privateA = await handleRequest(new Request("https://private-a.wiki.flybullet.net/", {
    headers: { Cookie: sessionCookieFrom(ownerCallback) }
  }), env);
  assert.equal(privateA.status, 200);

  const privateB = await handleRequest(new Request("https://private-b.wiki.flybullet.net/", {
    headers: { Cookie: sessionCookieFrom(ownerCallback) }
  }), env);
  assert.equal(privateB.status, 403);

  const nonOwnerEnv = {
    ...createEnv(),
    ...oauthEnv({ WIKIWISE_ADMIN_EMAILS: "owner@example.com" })
  };
  nonOwnerEnv.fetch = mockOAuthFetch({
    sub: "reader-provider-subject",
    name: "Reader",
    email: "reader@example.com"
  });
  await publish(nonOwnerEnv, {
    slug: "private-a",
    settings: {
      visibility: "private",
      authRealm: "shared",
      comments: { policy: "members-only" }
    },
    files: [{ path: "index.html", data: base64("<h1>private-a</h1>") }]
  });
  addOAuthState(nonOwnerEnv, {
    id: "oauth_state_reader",
    wikiSlug: "private-a"
  });

  const readerCallback = await handleRequest(
    new Request("https://private-a.wiki.flybullet.net/_wikiwise/auth/google/callback?code=code-123&state=oauth_state_reader"),
    nonOwnerEnv
  );
  assert.equal(readerCallback.status, 302);
  assert.equal(nonOwnerEnv.DB.memberships.size, 0);
  const forbidden = await handleRequest(new Request("https://private-a.wiki.flybullet.net/", {
    headers: { Cookie: sessionCookieFrom(readerCallback) }
  }), nonOwnerEnv);
  assert.equal(forbidden.status, 403);
});

test("private wiki owner bootstrap requires a verified provider email", async () => {
  for (const profile of [
    {
      sub: "unverified-provider-subject",
      name: "Unverified Owner",
      email: "owner@example.com",
      email_verified: false
    },
    {
      sub: "missing-verification-provider-subject",
      name: "Missing Verification Owner",
      email: "owner@example.com"
    }
  ]) {
    const env = {
      ...createEnv(),
      ...oauthEnv({ WIKIWISE_ADMIN_EMAILS: "owner@example.com" })
    };
    env.fetch = mockOAuthFetch(profile);
    await publish(env, {
      slug: "private-a",
      settings: {
        visibility: "private",
        authRealm: "shared",
        comments: { policy: "members-only" }
      },
      files: [{ path: "index.html", data: base64("<h1>private-a</h1>") }]
    });
    addOAuthState(env, {
      id: "oauth_state_owner",
      wikiSlug: "private-a"
    });

    const callback = await handleRequest(
      new Request("https://private-a.wiki.flybullet.net/_wikiwise/auth/google/callback?code=code-123&state=oauth_state_owner"),
      env
    );
    assert.equal(callback.status, 302);
    assert.equal(env.DB.memberships.size, 0);

    const privateRead = await handleRequest(new Request("https://private-a.wiki.flybullet.net/", {
      headers: { Cookie: sessionCookieFrom(callback) }
    }), env);
    assert.equal(privateRead.status, 403);
  }
});

test("comment policy enforcement covers disabled, login-required, and members-only", async () => {
  const env = createEnv();
  const sessionId = addUserSession(env, { memberOf: ["members-wiki"] });
  for (const [slug, policy] of [
    ["disabled-wiki", "disabled"],
    ["login-wiki", "login-required"],
    ["members-wiki", "members-only"]
  ]) {
    await publish(env, {
      slug,
      settings: {
        visibility: "public",
        authRealm: "shared",
        comments: { policy }
      },
      files: [{ path: "index.html", data: base64(`<h1>${slug}</h1>`) }]
    });
  }

  const disabled = await postComment(env, "disabled-wiki", {
    pagePath: "index.html",
    body: "Nope"
  }, sessionId);
  assert.equal(disabled.status, 403);
  assert.equal(await disabled.text(), "Comments disabled");

  const anonymousLoginRequired = await postComment(env, "login-wiki", {
    pagePath: "index.html",
    body: "Please sign me in"
  }, null);
  assert.equal(anonymousLoginRequired.status, 401);

  const loggedIn = await postComment(env, "login-wiki", {
    pagePath: "index.html",
    body: "Hello"
  }, sessionId);
  assert.equal(loggedIn.status, 201);

  const nonMember = await postComment(env, "members-wiki", {
    pagePath: "index.html",
    body: "Not a member"
  }, addUserSession(env, { sessionId: "session-2", userId: "user-2" }));
  assert.equal(nonMember.status, 403);

  const member = await postComment(env, "members-wiki", {
    pagePath: "index.html",
    body: "Member comment"
  }, sessionId);
  assert.equal(member.status, 201);
});

test("page-level threaded comments can be created and listed", async () => {
  const env = createEnv();
  const sessionId = addUserSession(env);
  await publish(env, {
    slug: "threads",
    settings: {
      visibility: "public",
      authRealm: "shared",
      comments: { policy: "login-required" }
    },
    files: [{ path: "index.html", data: base64("<h1>Threaded</h1>") }]
  });

  const topLevel = await postComment(env, "threads", {
    pagePath: "index.html",
    body: "Top level"
  }, sessionId);
  assert.equal(topLevel.status, 201);
  const topLevelJson = await topLevel.json();

  const reply = await postComment(env, "threads", {
    pagePath: "index.html",
    parentCommentId: topLevelJson.comment.id,
    body: "Reply"
  }, sessionId);
  assert.equal(reply.status, 201);

  const listed = await listComments(env, "threads");
  assert.equal(listed.status, 200);
  assert.deepEqual((await listed.json()).comments.map((comment) => ({
    body: comment.body,
    parentCommentId: comment.parentCommentId
  })), [
    { body: "Top level", parentCommentId: null },
    { body: "Reply", parentCommentId: topLevelJson.comment.id }
  ]);
});

test("annotation comments preserve anchor data and threaded replies", async () => {
  const env = createEnv();
  const sessionId = addUserSession(env);
  await publish(env, {
    slug: "annotations",
    settings: {
      visibility: "public",
      authRealm: "shared",
      comments: { policy: "login-required" }
    },
    files: [{ path: "index.html", data: base64("<p>Alpha Beta Gamma</p>") }]
  });

  const annotation = await postComment(env, "annotations", {
    pagePath: "index.html",
    body: "Annotation",
    anchor: {
      text: "Beta",
      prefix: "Alpha ",
      suffix: " Gamma"
    }
  }, sessionId);
  assert.equal(annotation.status, 201);
  const annotationJson = await annotation.json();

  const reply = await postComment(env, "annotations", {
    pagePath: "index.html",
    parentCommentId: annotationJson.comment.id,
    body: "Annotation reply"
  }, sessionId);
  assert.equal(reply.status, 201);

  const listed = await listComments(env, "annotations");
  assert.equal(listed.status, 200);
  const comments = (await listed.json()).comments;
  assert.deepEqual(comments[0].anchor, {
    text: "Beta",
    prefix: "Alpha ",
    suffix: " Gamma"
  });
  assert.equal(comments[0].status, "visible");
  assert.equal(comments[1].parentCommentId, annotationJson.comment.id);
});

test("republish keeps safe annotation anchors visible and marks unsafe anchors stale", async () => {
  const env = createEnv();
  const sessionId = addUserSession(env);
  await publish(env, {
    slug: "republish",
    settings: {
      visibility: "public",
      authRealm: "shared",
      comments: { policy: "login-required" }
    },
    files: [{ path: "index.html", data: base64("<p>Alpha Beta Gamma Delta</p>") }]
  });

  const safe = await postComment(env, "republish", {
    pagePath: "index.html",
    body: "Safe",
    anchor: {
      text: "Beta",
      prefix: "Alpha ",
      suffix: " Gamma"
    }
  }, sessionId);
  assert.equal(safe.status, 201);

  const stale = await postComment(env, "republish", {
    pagePath: "index.html",
    body: "Stale",
    anchor: {
      text: "Missing",
      prefix: "Old ",
      suffix: " Text"
    }
  }, sessionId);
  assert.equal(stale.status, 201);

  await publish(env, {
    slug: "republish",
    settings: {
      visibility: "public",
      authRealm: "shared",
      comments: { policy: "login-required" }
    },
    files: [{ path: "index.html", data: base64("<p>Alpha Beta Gamma Updated</p>") }]
  });

  const listed = await listComments(env, "republish");
  const statuses = new Map((await listed.json()).comments.map((comment) => [comment.body, comment.status]));
  assert.equal(statuses.get("Safe"), "visible");
  assert.equal(statuses.get("Stale"), "stale-anchor");
});

test("publish endpoint rejects missing and invalid publish tokens without storing data", async () => {
  for (const [headers, status] of [
    [{}, 401],
    [{ Authorization: "Bearer wrong" }, 403]
  ]) {
    const env = createEnv();
    const response = await publish(
      env,
      {
        slug: "notes",
        settings: {
          visibility: "public",
          authRealm: "shared",
          comments: {
            policy: "login-required"
          }
        },
        files: [{ path: "index.html", data: base64("<h1>Home</h1>") }]
      },
      headers
    );

    assert.equal(response.status, status);
    assert.equal(env.DB.wikis.size, 0);
    assert.equal(env.WIKIWISE_FILES.objects.size, 0);
  }
});

test("republish removes stale R2 files for the wiki slug", async () => {
  const env = createEnv();
  await publish(env, {
    slug: "cleanup",
    settings: {
      visibility: "public",
      authRealm: "shared",
      comments: {
        policy: "login-required"
      }
    },
    files: [
      { path: "index.html", data: base64("<h1>Home</h1>") },
      { path: "old.html", data: base64("<h1>Old</h1>") }
    ]
  });

  assert.equal(env.WIKIWISE_FILES.objects.has("cleanup/old.html"), true);

  await publish(env, {
    slug: "cleanup",
    settings: {
      visibility: "public",
      authRealm: "shared",
      comments: {
        policy: "login-required"
      }
    },
    files: [{ path: "index.html", data: base64("<h1>Home updated</h1>") }]
  });

  assert.equal(env.WIKIWISE_FILES.objects.has("cleanup/index.html"), true);
  assert.equal(env.WIKIWISE_FILES.objects.has("cleanup/old.html"), false);
  const response = await handleRequest(new Request("https://cleanup.wiki.flybullet.net/old.html"), env);
  assert.equal(response.status, 404);
});

test("unknown wiki slug returns not found without exposing another wiki's files", async () => {
  const env = createEnv();
  await publish(env, {
    slug: "notes",
    settings: {
      visibility: "public",
      authRealm: "shared",
      comments: {
        policy: "login-required"
      }
    },
    files: [{ path: "index.html", data: base64("<h1>Notes</h1>") }]
  });

  const response = await handleRequest(new Request("https://unknown.wiki.flybullet.net/"), env);

  assert.equal(response.status, 404);
  assert.equal(await response.text(), "Wiki not found");
});

test("migration creates Hub wiki, auth, membership, comment, and revision tables", () => {
  const migration = fs.readFileSync(path.join(packageRoot, "migrations", "0001_initial.sql"), "utf8");

  for (const tableName of [
    "wikis",
    "users",
    "oauth_accounts",
    "oauth_states",
    "sessions",
    "wiki_members",
    "comments",
    "page_revisions"
  ]) {
    assert.match(migration, new RegExp(`CREATE TABLE IF NOT EXISTS ${tableName}`));
  }
});
