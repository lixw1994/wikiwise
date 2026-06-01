const defaultPublicDomain = "wiki.flybullet.net";
const allowedVisibility = new Set(["public", "private"]);
const allowedAuthRealm = new Set(["shared", "per-wiki"]);
const allowedCommentPolicy = new Set(["disabled", "login-required", "members-only"]);

export default {
  fetch: handleRequest
};

export async function handleRequest(request, env) {
  const url = new URL(request.url);

  if (url.pathname === "/_wikiwise/publish") {
    if (request.method !== "PUT") {
      return textResponse("Method not allowed", 405);
    }
    return publishWiki(request, env);
  }

  if (url.pathname === "/_wikiwise/auth/providers") {
    if (request.method !== "GET") {
      return textResponse("Method not allowed", 405);
    }
    return listOidcProviders(env);
  }

  const authStartMatch = url.pathname.match(/^\/_wikiwise\/auth\/([^/]+)\/start$/);
  if (authStartMatch) {
    if (request.method !== "GET") {
      return textResponse("Method not allowed", 405);
    }
    return startOidcProvider(request, env, authStartMatch[1]);
  }

  if (url.pathname === "/_wikiwise/me") {
    if (request.method !== "GET") {
      return textResponse("Method not allowed", 405);
    }
    return currentUser(request, env);
  }

  if (url.pathname === "/_wikiwise/comments") {
    if (request.method === "GET") {
      return listPageComments(request, env);
    }
    if (request.method === "POST") {
      return createPageComment(request, env);
    }
    return textResponse("Method not allowed", 405);
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return textResponse("Method not allowed", 405);
  }

  return serveWikiFile(request, env);
}

async function publishWiki(request, env) {
  const auth = request.headers.get("Authorization") ?? "";
  const expectedToken = env?.WIKIWISE_PUBLISH_TOKEN;

  if (!auth) {
    return jsonResponse({ error: "missing_token" }, 401);
  }
  if (!expectedToken || auth !== `Bearer ${expectedToken}`) {
    return jsonResponse({ error: "invalid_token" }, 403);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "invalid_json" }, 400);
  }

  const validation = validatePublishPayload(payload);
  if (!validation.ok) {
    return jsonResponse({ error: validation.error }, 422);
  }

  const now = new Date().toISOString();
  const slug = payload.slug;
  const settings = payload.settings;
  const publishedFiles = [];
  await upsertWiki(env, {
    slug,
    visibility: settings.visibility,
    authRealm: settings.authRealm,
    commentPolicy: settings.comments.policy,
    updatedAt: now
  });

  for (const file of payload.files) {
    const body = decodeBase64Data(file.data);
    publishedFiles.push({
      path: file.path,
      text: decodeUtf8(body)
    });
    await putWikiFile(env, slug, file.path, body);
  }

  for (const file of publishedFiles) {
    await updateAnnotationStatusesForPublishedFile(env, slug, file.path, file.text, now);
  }
  await removeStaleWikiFiles(env, slug, new Set(publishedFiles.map((file) => file.path)));

  await insertPageRevision(env, {
    slug,
    fileCount: payload.files.length,
    createdAt: now
  });

  return jsonResponse({
    ok: true,
    slug,
    url: publicWikiUrl(env, slug),
    fileCount: payload.files.length
  });
}

async function serveWikiFile(request, env) {
  const url = new URL(request.url);
  const slug = slugFromHost(env, url.hostname);
  if (!slug) {
    return textResponse("Wiki not found", 404);
  }

  const wiki = await findWiki(env, slug);
  if (!wiki) {
    return textResponse("Wiki not found", 404);
  }
  const access = await authorizeWikiRead(request, env, wiki);
  if (!access.ok) {
    return textResponse(access.message, access.status);
  }

  const filePath = requestPathToFilePath(url.pathname);
  if (!filePath) {
    return textResponse("Not found", 404);
  }

  const object = await getWikiFile(env, slug, filePath);
  if (!object) {
    return textResponse("Not found", 404);
  }

  const headers = new Headers();
  headers.set("Content-Type", object.httpMetadata?.contentType ?? contentTypeForPath(filePath));

  if (request.method === "HEAD") {
    return new Response(null, { status: 200, headers });
  }

  const body = typeof object.arrayBuffer === "function" ? await object.arrayBuffer() : object.body;
  return new Response(body, { status: 200, headers });
}

async function currentUser(request, env) {
  const url = new URL(request.url);
  const slug = slugFromHost(env, url.hostname);
  if (!slug) {
    return textResponse("Wiki not found", 404);
  }

  const wiki = await findWiki(env, slug);
  if (!wiki) {
    return textResponse("Wiki not found", 404);
  }

  const session = await resolveSession(request, env);
  if (!session) {
    return textResponse("Sign in required", 401);
  }

  const membership = await findWikiMember(env, wiki.slug, session.userId);
  if (wiki.visibility !== "public" && !membership) {
    return textResponse("Forbidden", 403);
  }

  const identity = userIdentityForWiki(wiki, session);
  return jsonResponse({
    user: identity,
    wiki: {
      slug: wiki.slug,
      visibility: wiki.visibility,
      authRealm: wiki.authRealm
    },
    identityScope: wiki.authRealm === "shared" ? "shared" : `wiki:${wiki.slug}`,
    membership: membership
      ? {
        role: membership.role
      }
      : null
  });
}

async function listPageComments(request, env) {
  const url = new URL(request.url);
  const wiki = await wikiFromRequestHost(request, env);
  if (!wiki) {
    return textResponse("Wiki not found", 404);
  }

  const access = await authorizeWikiRead(request, env, wiki);
  if (!access.ok) {
    return textResponse(access.message, access.status);
  }

  const pagePath = url.searchParams.get("pagePath") ?? "index.html";
  if (!safeObjectPath(pagePath)) {
    return jsonResponse({ error: "invalid_page_path" }, 422);
  }

  const comments = await findCommentsForPage(env, wiki.slug, pagePath);
  return jsonResponse({
    comments: orderThreadedComments(comments).map(serializeComment)
  });
}

async function createPageComment(request, env) {
  const wiki = await wikiFromRequestHost(request, env);
  if (!wiki) {
    return textResponse("Wiki not found", 404);
  }

  const commentAccess = await authorizeCommentWrite(request, env, wiki);
  if (!commentAccess.ok) {
    return textResponse(commentAccess.message, commentAccess.status);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "invalid_json" }, 400);
  }

  const pagePath = payload?.pagePath ?? "index.html";
  if (!safeObjectPath(pagePath) || typeof payload?.body !== "string" || !payload.body.trim()) {
    return jsonResponse({ error: "invalid_comment" }, 422);
  }

  const parentCommentId = payload.parentCommentId ?? null;
  if (parentCommentId) {
    const parent = await findComment(env, parentCommentId);
    if (!parent || parent.wikiSlug !== wiki.slug || parent.pagePath !== pagePath) {
      return jsonResponse({ error: "invalid_parent" }, 422);
    }
  }

  const anchor = payload.anchor === undefined ? null : normalizeAnchor(payload.anchor);
  if (anchor === false) {
    return jsonResponse({ error: "invalid_anchor" }, 422);
  }

  const now = new Date().toISOString();
  const identity = userIdentityForWiki(wiki, commentAccess.session);
  await ensureCommentIdentityUser(env, wiki, identity, now);

  const comment = {
    id: randomId("comment"),
    wikiSlug: wiki.slug,
    pagePath,
    userId: identity.id,
    parentCommentId,
    body: payload.body,
    anchorJson: anchor ? JSON.stringify(anchor) : null,
    status: "visible",
    createdAt: now,
    updatedAt: now
  };

  await insertComment(env, comment);

  return jsonResponse({
    comment: serializeComment(comment)
  }, 201);
}

async function authorizeWikiRead(request, env, wiki) {
  if (wiki.visibility === "public") {
    return { ok: true };
  }

  const session = await resolveSession(request, env);
  if (!session) {
    return { ok: false, status: 401, message: "Sign in required" };
  }

  const membership = await findWikiMember(env, wiki.slug, session.userId);
  if (!membership) {
    return { ok: false, status: 403, message: "Forbidden" };
  }

  return { ok: true, session, membership };
}

async function authorizeCommentWrite(request, env, wiki) {
  if (wiki.commentPolicy === "disabled") {
    return { ok: false, status: 403, message: "Comments disabled" };
  }

  const session = await resolveSession(request, env);
  if (!session) {
    return { ok: false, status: 401, message: "Sign in required" };
  }

  const membership = await findWikiMember(env, wiki.slug, session.userId);
  if (wiki.visibility !== "public" && !membership) {
    return { ok: false, status: 403, message: "Forbidden" };
  }
  if (wiki.commentPolicy === "members-only" && !membership) {
    return { ok: false, status: 403, message: "Forbidden" };
  }

  return { ok: true, session, membership };
}

function userIdentityForWiki(wiki, session) {
  const id = wiki.authRealm === "per-wiki"
    ? `wiki:${wiki.slug}:${session.userId}`
    : session.userId;

  return {
    id,
    displayName: session.displayName,
    avatarUrl: session.avatarUrl
  };
}

async function ensureCommentIdentityUser(env, wiki, identity, updatedAt) {
  if (wiki.authRealm !== "per-wiki") return;

  await env.DB.prepare(`
    INSERT INTO users (id, display_name, avatar_url, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      display_name = excluded.display_name,
      avatar_url = excluded.avatar_url,
      updated_at = excluded.updated_at
  `).bind(
    identity.id,
    identity.displayName,
    identity.avatarUrl,
    updatedAt
  ).run();
}

async function resolveSession(request, env) {
  const sessionId = parseCookies(request.headers.get("Cookie") ?? "").wwh_session;
  if (!sessionId) return null;

  const session = await env.DB.prepare(`
    SELECT
      sessions.id,
      sessions.user_id AS userId,
      sessions.expires_at AS expiresAt,
      users.display_name AS displayName,
      users.avatar_url AS avatarUrl
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.id = ?
  `).bind(sessionId).first();

  if (!session) return null;
  if (session.expiresAt && Date.parse(session.expiresAt) <= Date.now()) {
    return null;
  }

  return session;
}

async function findWikiMember(env, slug, userId) {
  return env.DB.prepare(`
    SELECT wiki_slug AS wikiSlug, user_id AS userId, role
    FROM wiki_members
    WHERE wiki_slug = ? AND user_id = ?
  `).bind(slug, userId).first();
}

function validatePublishPayload(payload) {
  if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(payload?.slug ?? "")) {
    return { ok: false, error: "invalid_slug" };
  }
  if (
    !allowedVisibility.has(payload?.settings?.visibility) ||
    !allowedAuthRealm.has(payload?.settings?.authRealm) ||
    !allowedCommentPolicy.has(payload?.settings?.comments?.policy)
  ) {
    return { ok: false, error: "invalid_settings" };
  }
  if (!Array.isArray(payload?.files) || payload.files.length === 0) {
    return { ok: false, error: "missing_files" };
  }

  for (const file of payload.files) {
    if (!safeObjectPath(file?.path) || typeof file.data !== "string") {
      return { ok: false, error: "invalid_file" };
    }
  }

  return { ok: true };
}

function listOidcProviders(env) {
  return jsonResponse({
    providers: configuredOidcProviders(env).map((provider) => ({
      id: provider.id,
      name: provider.name,
      authorizationUrl: provider.authorizationUrl
    }))
  });
}

async function startOidcProvider(request, env, providerId) {
  const provider = configuredOidcProviders(env).find((candidate) => candidate.id === providerId);
  if (!provider) {
    return textResponse("Provider not configured", 404);
  }

  const requestUrl = new URL(request.url);
  const slug = slugFromHost(env, requestUrl.hostname);
  if (!slug) {
    return textResponse("Wiki not found", 404);
  }

  const now = new Date();
  const stateId = randomId("oauth_state");
  await insertOAuthState(env, {
    id: stateId,
    provider: provider.id,
    wikiSlug: slug,
    returnTo: safeReturnTo(requestUrl, requestUrl.searchParams.get("returnTo")),
    expiresAt: new Date(now.getTime() + 10 * 60 * 1000).toISOString(),
    createdAt: now.toISOString()
  });

  const authUrl = new URL(provider.authorizationUrl);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", provider.clientId);
  authUrl.searchParams.set("redirect_uri", `${requestUrl.origin}/_wikiwise/auth/${provider.id}/callback`);
  authUrl.searchParams.set("scope", "openid profile email");
  authUrl.searchParams.set("state", stateId);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl.toString()
    }
  });
}

function configuredOidcProviders(env) {
  return [
    oidcProvider(env, {
      id: "google",
      name: "Google",
      clientIdKey: "GOOGLE_CLIENT_ID",
      clientSecretKey: "GOOGLE_CLIENT_SECRET",
      authorizationUrlKey: "GOOGLE_AUTHORIZATION_URL",
      defaultAuthorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth"
    }),
    oidcProvider(env, {
      id: "feishu",
      name: "Feishu",
      clientIdKey: "FEISHU_CLIENT_ID",
      clientSecretKey: "FEISHU_CLIENT_SECRET",
      authorizationUrlKey: "FEISHU_AUTHORIZATION_URL"
    }),
    oidcProvider(env, {
      id: "lark",
      name: "Lark",
      clientIdKey: "LARK_CLIENT_ID",
      clientSecretKey: "LARK_CLIENT_SECRET",
      authorizationUrlKey: "LARK_AUTHORIZATION_URL"
    })
  ].filter(Boolean);
}

function oidcProvider(env, options) {
  const clientId = env?.[options.clientIdKey];
  const clientSecret = env?.[options.clientSecretKey];
  const authorizationUrl = env?.[options.authorizationUrlKey] ?? options.defaultAuthorizationUrl;

  if (!clientId || !clientSecret || !authorizationUrl) return null;

  return {
    id: options.id,
    name: options.name,
    clientId,
    clientSecret,
    authorizationUrl
  };
}

function safeReturnTo(requestUrl, returnTo) {
  if (!returnTo) {
    return `${requestUrl.origin}/`;
  }

  try {
    const target = new URL(returnTo, requestUrl.origin);
    if (target.origin === requestUrl.origin) {
      return target.toString();
    }
  } catch {
    // Fall through to the wiki root.
  }

  return `${requestUrl.origin}/`;
}

async function upsertWiki(env, wiki) {
  await env.DB.prepare(`
    INSERT INTO wikis (slug, visibility, auth_realm, comment_policy, updated_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET
      visibility = excluded.visibility,
      auth_realm = excluded.auth_realm,
      comment_policy = excluded.comment_policy,
      updated_at = excluded.updated_at
  `).bind(
    wiki.slug,
    wiki.visibility,
    wiki.authRealm,
    wiki.commentPolicy,
    wiki.updatedAt
  ).run();
}

async function insertPageRevision(env, revision) {
  await env.DB.prepare(`
    INSERT INTO page_revisions (wiki_slug, file_count, created_at)
    VALUES (?, ?, ?)
  `).bind(revision.slug, revision.fileCount, revision.createdAt).run();
}

async function insertOAuthState(env, state) {
  await env.DB.prepare(`
    INSERT INTO oauth_states (id, provider, wiki_slug, return_to, expires_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    state.id,
    state.provider,
    state.wikiSlug,
    state.returnTo,
    state.expiresAt,
    state.createdAt
  ).run();
}

async function findWiki(env, slug) {
  return env.DB.prepare(`
    SELECT
      slug,
      visibility,
      auth_realm AS authRealm,
      comment_policy AS commentPolicy
    FROM wikis
    WHERE slug = ?
  `).bind(slug).first();
}

async function wikiFromRequestHost(request, env) {
  const url = new URL(request.url);
  const slug = slugFromHost(env, url.hostname);
  return slug ? findWiki(env, slug) : null;
}

async function insertComment(env, comment) {
  await env.DB.prepare(`
    INSERT INTO comments (
      id,
      wiki_slug,
      page_path,
      user_id,
      parent_comment_id,
      body,
      anchor_json,
      status,
      created_at,
      updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    comment.id,
    comment.wikiSlug,
    comment.pagePath,
    comment.userId,
    comment.parentCommentId,
    comment.body,
    comment.anchorJson,
    comment.status,
    comment.createdAt,
    comment.updatedAt
  ).run();
}

async function findComment(env, id) {
  return env.DB.prepare(`
    SELECT
      id,
      wiki_slug AS wikiSlug,
      page_path AS pagePath,
      user_id AS userId,
      parent_comment_id AS parentCommentId,
      body,
      anchor_json AS anchorJson,
      status,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM comments
    WHERE id = ?
  `).bind(id).first();
}

async function findCommentsForPage(env, slug, pagePath) {
  const result = await env.DB.prepare(`
    SELECT
      id,
      wiki_slug AS wikiSlug,
      page_path AS pagePath,
      user_id AS userId,
      parent_comment_id AS parentCommentId,
      body,
      anchor_json AS anchorJson,
      status,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM comments
    WHERE wiki_slug = ? AND page_path = ?
    ORDER BY created_at ASC, id ASC
  `).bind(slug, pagePath).all();

  return result.results ?? [];
}

async function updateCommentStatus(env, comment, status, updatedAt) {
  if (comment.status === status) return;

  await env.DB.prepare(`
    UPDATE comments
    SET status = ?, updated_at = ?
    WHERE id = ?
  `).bind(status, updatedAt, comment.id).run();
}

async function updateAnnotationStatusesForPublishedFile(env, slug, pagePath, content, updatedAt) {
  const comments = await findCommentsForPage(env, slug, pagePath);
  for (const comment of comments) {
    if (!comment.anchorJson) continue;

    const anchor = parseAnchorJson(comment.anchorJson);
    if (!anchor) continue;

    await updateCommentStatus(
      env,
      comment,
      canSafelyReanchor(content, anchor) ? "visible" : "stale-anchor",
      updatedAt
    );
  }
}

async function removeStaleWikiFiles(env, slug, publishedPaths) {
  if (
    typeof env.WIKIWISE_FILES?.list !== "function" ||
    typeof env.WIKIWISE_FILES?.delete !== "function"
  ) {
    return;
  }

  const prefix = `${slug}/`;
  let cursor;
  do {
    const result = await env.WIKIWISE_FILES.list({ prefix, cursor });
    for (const object of result.objects ?? []) {
      const filePath = object.key.slice(prefix.length);
      if (!publishedPaths.has(filePath)) {
        await env.WIKIWISE_FILES.delete(object.key);
      }
    }
    cursor = result.truncated ? result.cursor : null;
  } while (cursor);
}

async function putWikiFile(env, slug, filePath, body) {
  await env.WIKIWISE_FILES.put(objectKey(slug, filePath), body, {
    httpMetadata: {
      contentType: contentTypeForPath(filePath)
    }
  });
}

async function getWikiFile(env, slug, filePath) {
  return env.WIKIWISE_FILES.get(objectKey(slug, filePath));
}

function objectKey(slug, filePath) {
  return `${slug}/${filePath}`;
}

function slugFromHost(env, hostname) {
  const publicDomain = env?.WIKIWISE_PUBLIC_DOMAIN ?? defaultPublicDomain;
  if (!hostname.endsWith(`.${publicDomain}`)) {
    return null;
  }

  const slug = hostname.slice(0, -publicDomain.length - 1);
  return /^[a-z0-9-]+$/.test(slug) ? slug : null;
}

function publicWikiUrl(env, slug) {
  return `https://${slug}.${env?.WIKIWISE_PUBLIC_DOMAIN ?? defaultPublicDomain}`;
}

function requestPathToFilePath(pathname) {
  const decoded = decodeURIComponent(pathname);
  const filePath = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
  return safeObjectPath(filePath) ? filePath : null;
}

function safeObjectPath(filePath) {
  return (
    typeof filePath === "string" &&
    filePath.length > 0 &&
    !filePath.startsWith("/") &&
    !filePath.split("/").includes("..")
  );
}

function parseCookies(cookieHeader) {
  const cookies = {};
  for (const segment of String(cookieHeader).split(";")) {
    const [rawName, ...rawValue] = segment.trim().split("=");
    if (!rawName) continue;
    cookies[rawName] = decodeURIComponent(rawValue.join("="));
  }
  return cookies;
}

function normalizeAnchor(anchor) {
  if (!anchor || typeof anchor !== "object" || typeof anchor.text !== "string" || !anchor.text) {
    return false;
  }

  return {
    text: anchor.text,
    prefix: typeof anchor.prefix === "string" ? anchor.prefix : "",
    suffix: typeof anchor.suffix === "string" ? anchor.suffix : ""
  };
}

function serializeComment(comment) {
  return {
    id: comment.id,
    pagePath: comment.pagePath,
    userId: comment.userId,
    parentCommentId: comment.parentCommentId ?? null,
    body: comment.body,
    anchor: parseAnchorJson(comment.anchorJson),
    status: comment.status,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt
  };
}

function orderThreadedComments(comments) {
  const byParent = new Map();
  for (const comment of comments) {
    const parentId = comment.parentCommentId ?? "";
    const siblings = byParent.get(parentId) ?? [];
    siblings.push(comment);
    byParent.set(parentId, siblings);
  }

  for (const siblings of byParent.values()) {
    siblings.sort((left, right) => left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id));
  }

  const ordered = [];
  function visit(comment) {
    ordered.push(comment);
    for (const child of byParent.get(comment.id) ?? []) {
      visit(child);
    }
  }

  for (const topLevel of byParent.get("") ?? []) {
    visit(topLevel);
  }

  return ordered;
}

function parseAnchorJson(anchorJson) {
  if (!anchorJson) return null;

  try {
    return JSON.parse(anchorJson);
  } catch {
    return null;
  }
}

function canSafelyReanchor(content, anchor) {
  const index = content.indexOf(anchor.text);
  if (index < 0) return false;

  const before = content.slice(Math.max(0, index - anchor.prefix.length), index);
  const after = content.slice(index + anchor.text.length, index + anchor.text.length + anchor.suffix.length);

  return before === anchor.prefix && after === anchor.suffix;
}

function randomId(prefix) {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}_${globalThis.crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function decodeBase64Data(data) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(data, "base64");
  }

  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function decodeUtf8(data) {
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(data)) {
    return data.toString("utf8");
  }

  return new TextDecoder().decode(data);
}

function contentTypeForPath(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (filePath.endsWith(".json")) return "application/json; charset=utf-8";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}

function textResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
