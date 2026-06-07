const defaultPublicDomain = "flybullet.net";
const wikiHostnameSuffix = "-wiki";
const reservedWikiSlugs = new Set(["hub"]);
const allowedVisibility = new Set(["public", "private"]);
const allowedAuthRealm = new Set(["shared", "per-wiki"]);
const allowedCommentPolicy = new Set(["disabled", "login-required", "members-only"]);
const maxProfileDisplayNameLength = 80;
const maxProfileAvatarUrlLength = 512;

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

  if (url.pathname === "/_wikiwise/publish/check") {
    if (request.method !== "GET") {
      return textResponse("Method not allowed", 405);
    }
    return checkPublishSlug(request, env);
  }

  if (url.pathname === "/_wikiwise/client.js") {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return textResponse("Method not allowed", 405);
    }
    return runtimeAssetResponse(request, readerClientScript, "application/javascript; charset=utf-8");
  }

  if (url.pathname === "/_wikiwise/client.css") {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return textResponse("Method not allowed", 405);
    }
    return runtimeAssetResponse(request, readerClientStyles, "text/css; charset=utf-8");
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

  const authCallbackMatch = url.pathname.match(/^\/_wikiwise\/auth\/([^/]+)\/callback$/);
  if (authCallbackMatch) {
    if (request.method !== "GET") {
      return textResponse("Method not allowed", 405);
    }
    return completeOidcProvider(request, env, authCallbackMatch[1]);
  }

  if (url.pathname === "/_wikiwise/me") {
    if (request.method === "GET") {
      return currentUser(request, env);
    }
    if (request.method === "PATCH") {
      return updateCurrentUserProfile(request, env);
    }
    return textResponse("Method not allowed", 405);
  }

  if (url.pathname === "/_wikiwise/logout") {
    if (request.method !== "POST") {
      return textResponse("Method not allowed", 405);
    }
    return logoutUser(request, env);
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

  if (url.pathname === "/_wikiwise/admin/comments") {
    if (request.method === "GET") {
      return listAdminPageComments(request, env);
    }
    return textResponse("Method not allowed", 405);
  }

  const adminCommentMatch = url.pathname.match(/^\/_wikiwise\/admin\/comments\/([^/]+)$/);
  if (adminCommentMatch) {
    if (request.method === "PATCH") {
      return updateAdminCommentStatus(request, env, decodeURIComponent(adminCommentMatch[1]));
    }
    return textResponse("Method not allowed", 405);
  }

  if (url.pathname === "/_wikiwise/admin/invitations") {
    if (request.method === "POST") {
      return createWikiInvitation(request, env);
    }
    if (request.method === "GET") {
      return listWikiInvitations(request, env);
    }
    return textResponse("Method not allowed", 405);
  }

  if (url.pathname === "/_wikiwise/admin/members") {
    if (request.method === "GET") {
      return listWikiMembers(request, env);
    }
    return textResponse("Method not allowed", 405);
  }

  const adminMemberMatch = url.pathname.match(/^\/_wikiwise\/admin\/members\/([^/]+)$/);
  if (adminMemberMatch) {
    if (request.method === "DELETE") {
      return removeWikiMember(request, env, decodeURIComponent(adminMemberMatch[1]));
    }
    return textResponse("Method not allowed", 405);
  }

  const adminInvitationMatch = url.pathname.match(/^\/_wikiwise\/admin\/invitations\/([^/]+)$/);
  if (adminInvitationMatch) {
    if (request.method === "DELETE") {
      return revokeWikiInvitation(request, env, decodeURIComponent(adminInvitationMatch[1]));
    }
    return textResponse("Method not allowed", 405);
  }

  const acceptInvitationMatch = url.pathname.match(/^\/_wikiwise\/invitations\/([^/]+)\/accept$/);
  if (acceptInvitationMatch) {
    if (request.method === "POST") {
      return acceptWikiInvitation(request, env, decodeURIComponent(acceptInvitationMatch[1]));
    }
    return textResponse("Method not allowed", 405);
  }

  const invitationPageMatch = url.pathname.match(/^\/_wikiwise\/invitations\/([^/]+)$/);
  if (invitationPageMatch) {
    if (request.method === "GET") {
      return showWikiInvitation(request, env, decodeURIComponent(invitationPageMatch[1]));
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

async function checkPublishSlug(request, env) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") ?? "";
  if (!isValidWikiSlug(slug)) {
    return jsonResponse({ reason: "invalid" });
  }

  const wiki = await findWiki(env, slug);
  if (!wiki) {
    return jsonResponse({ reason: "free" });
  }

  const auth = request.headers.get("Authorization") ?? "";
  const expectedToken = env?.WIKIWISE_PUBLISH_TOKEN;
  if (expectedToken && auth === `Bearer ${expectedToken}`) {
    return jsonResponse({ reason: "owned" });
  }

  return jsonResponse({ reason: "taken" });
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

  const filePath = requestPathToFilePath(url.pathname);
  if (!filePath) {
    return textResponse("Not found", 404);
  }

  const access = await authorizeWikiRead(request, env, wiki);
  if (!access.ok) {
    if (filePath.endsWith(".html")) {
      return privateAccessResponse(request, env, wiki, access);
    }
    return textResponse(access.message, access.status);
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
  if (shouldInjectReaderRuntime(headers.get("Content-Type"), filePath)) {
    return new Response(injectReaderRuntime(decodeUtf8(body)), { status: 200, headers });
  }

  return new Response(body, { status: 200, headers });
}

async function currentUser(request, env) {
  const context = await currentUserContext(request, env);
  if (!context.ok) return context.response;

  return jsonResponse(await currentUserPayload(env, context.wiki, context.session, context.membership));
}

async function updateCurrentUserProfile(request, env) {
  const context = await currentUserContext(request, env);
  if (!context.ok) return context.response;

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "invalid_json" }, 400);
  }

  const currentProfile = await userIdentityForWiki(env, context.wiki, context.session);
  const profile = normalizeProfilePayload(payload, currentProfile);
  if (!profile.ok) {
    return jsonResponse({ error: "invalid_profile" }, 422);
  }

  const now = new Date().toISOString();
  await upsertProfileOverride(env, {
    identityId: identityIdForWiki(context.wiki, context.session.userId),
    userId: context.session.userId,
    wikiSlug: context.wiki.authRealm === "per-wiki" ? context.wiki.slug : null,
    displayName: profile.displayName,
    avatarUrl: profile.avatarUrl,
    updatedAt: now
  });

  return jsonResponse(await currentUserPayload(env, context.wiki, context.session, context.membership));
}

async function currentUserContext(request, env) {
  const url = new URL(request.url);
  const slug = slugFromHost(env, url.hostname);
  if (!slug) {
    return { ok: false, response: textResponse("Wiki not found", 404) };
  }

  const wiki = await findWiki(env, slug);
  if (!wiki) {
    return { ok: false, response: textResponse("Wiki not found", 404) };
  }

  const session = await resolveSession(request, env);
  if (!session) {
    return { ok: false, response: textResponse("Sign in required", 401) };
  }

  const membership = await findWikiMember(env, wiki.slug, session.userId);
  if (wiki.visibility !== "public" && !membership) {
    return { ok: false, response: textResponse("Forbidden", 403) };
  }

  return {
    ok: true,
    wiki,
    session,
    membership
  };
}

async function currentUserPayload(env, wiki, session, membership) {
  const identity = await userIdentityForWiki(env, wiki, session);
  return {
    user: identity,
    wiki: {
      slug: wiki.slug,
      visibility: wiki.visibility,
      authRealm: wiki.authRealm,
      commentPolicy: wiki.commentPolicy
    },
    identityScope: wiki.authRealm === "shared" ? "shared" : `wiki:${wiki.slug}`,
    membership: membership
      ? {
        role: membership.role
      }
      : null
  };
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
  const visibleComments = readerVisibleComments(comments);
  const authors = await authorProfilesForComments(env, wiki, visibleComments);
  const commentAccess = await describeCommentWriteAccess(request, env, wiki);
  return jsonResponse({
    comments: orderThreadedComments(visibleComments).map((comment) => serializeComment(comment, authors.get(comment.userId))),
    commentPolicy: wiki.commentPolicy,
    canComment: commentAccess.ok,
    commentMessage: commentAccess.ok ? null : commentAccess.message
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
  const identity = await userIdentityForWiki(env, wiki, commentAccess.session);
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
    comment: serializeComment(comment, publicAuthorProfile(identity))
  }, 201);
}

async function listAdminPageComments(request, env) {
  const url = new URL(request.url);
  const wiki = await wikiFromRequestHost(request, env);
  if (!wiki) {
    return textResponse("Wiki not found", 404);
  }

  const ownership = await authorizeWikiOwner(request, env, wiki);
  if (!ownership.ok) {
    return textResponse(ownership.message, ownership.status);
  }

  const pagePath = url.searchParams.get("pagePath") ?? "index.html";
  if (!safeObjectPath(pagePath)) {
    return jsonResponse({ error: "invalid_page_path" }, 422);
  }

  const comments = await findCommentsForPage(env, wiki.slug, pagePath);
  const authors = await authorProfilesForComments(env, wiki, comments);
  return jsonResponse({
    comments: orderThreadedComments(comments).map((comment) => serializeComment(comment, authors.get(comment.userId)))
  });
}

async function updateAdminCommentStatus(request, env, commentId) {
  const wiki = await wikiFromRequestHost(request, env);
  if (!wiki) {
    return textResponse("Wiki not found", 404);
  }

  const ownership = await authorizeWikiOwner(request, env, wiki);
  if (!ownership.ok) {
    return textResponse(ownership.message, ownership.status);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "invalid_json" }, 400);
  }

  const status = payload?.status;
  if (status !== "hidden" && status !== "visible") {
    return jsonResponse({ error: "invalid_comment_status" }, 422);
  }

  const comment = await findComment(env, commentId);
  if (!comment || comment.wikiSlug !== wiki.slug) {
    return textResponse("Comment not found", 404);
  }

  const updatedAt = comment.status === status ? comment.updatedAt : new Date().toISOString();
  await updateCommentStatus(env, comment, status, updatedAt);
  const updated = {
    ...comment,
    status,
    updatedAt
  };
  const author = await publicProfileForIdentity(env, wiki, updated.userId);
  return jsonResponse({
    comment: serializeComment(updated, author)
  });
}

async function createWikiInvitation(request, env) {
  const wiki = await wikiFromRequestHost(request, env);
  if (!wiki) {
    return textResponse("Wiki not found", 404);
  }

  const ownership = await authorizeWikiOwner(request, env, wiki);
  if (!ownership.ok) {
    return textResponse(ownership.message, ownership.status);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "invalid_json" }, 400);
  }

  const expiresInDays = normalizeInvitationDays(payload?.expiresInDays);
  if (!expiresInDays) {
    return jsonResponse({ error: "invalid_expiration" }, 422);
  }

  const now = new Date();
  const token = randomId("invite_token");
  const invitation = {
    id: randomId("invite"),
    wikiSlug: wiki.slug,
    tokenHash: await hashInvitationToken(token),
    createdByUserId: ownership.session.userId,
    role: "member",
    status: "pending",
    expiresAt: new Date(now.getTime() + expiresInDays * 24 * 60 * 60 * 1000).toISOString(),
    acceptedByUserId: null,
    acceptedAt: null,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  };

  await insertWikiInvitation(env, invitation);

  return jsonResponse({
    invitation: serializeInvitation(invitation),
    inviteUrl: invitationUrlForRequest(request, token)
  }, 201);
}

async function listWikiInvitations(request, env) {
  const wiki = await wikiFromRequestHost(request, env);
  if (!wiki) {
    return textResponse("Wiki not found", 404);
  }

  const ownership = await authorizeWikiOwner(request, env, wiki);
  if (!ownership.ok) {
    return textResponse(ownership.message, ownership.status);
  }

  const invitations = await findInvitationsForWiki(env, wiki.slug);
  return jsonResponse({
    invitations: invitations.map((invitation) => serializeInvitation(invitation))
  });
}

async function revokeWikiInvitation(request, env, invitationId) {
  const wiki = await wikiFromRequestHost(request, env);
  if (!wiki) {
    return textResponse("Wiki not found", 404);
  }

  const ownership = await authorizeWikiOwner(request, env, wiki);
  if (!ownership.ok) {
    return textResponse(ownership.message, ownership.status);
  }

  const invitation = await findInvitationForWiki(env, wiki.slug, invitationId);
  if (!invitation) {
    return textResponse("Invitation not found", 404);
  }

  if (invitation.status === "pending") {
    await updateWikiInvitationStatus(env, invitation.id, "revoked", new Date().toISOString());
  }

  return new Response(null, { status: 204 });
}

async function listWikiMembers(request, env) {
  const wiki = await wikiFromRequestHost(request, env);
  if (!wiki) {
    return textResponse("Wiki not found", 404);
  }

  const ownership = await authorizeWikiOwner(request, env, wiki);
  if (!ownership.ok) {
    return textResponse(ownership.message, ownership.status);
  }

  const members = await findMembersForWiki(env, wiki.slug);
  const resolvedMembers = [];
  for (const member of members) {
    const publicProfile = await publicProfileForUser(env, wiki, member.userId, member);
    resolvedMembers.push({
      ...member,
      displayName: publicProfile.displayName,
      avatarUrl: publicProfile.avatarUrl
    });
  }
  return jsonResponse({
    members: resolvedMembers.map((member) => serializeMember(member))
  });
}

async function removeWikiMember(request, env, userId) {
  const wiki = await wikiFromRequestHost(request, env);
  if (!wiki) {
    return textResponse("Wiki not found", 404);
  }

  const ownership = await authorizeWikiOwner(request, env, wiki);
  if (!ownership.ok) {
    return textResponse(ownership.message, ownership.status);
  }

  const membership = await findWikiMember(env, wiki.slug, userId);
  if (!membership) {
    return new Response(null, { status: 204 });
  }
  if (membership.role !== "member") {
    return textResponse("Cannot remove owner", 403);
  }

  await deleteWikiMember(env, wiki.slug, userId);
  return new Response(null, { status: 204 });
}

async function showWikiInvitation(request, env, token) {
  const lookup = await lookupInvitationFromRequest(request, env, token);
  if (!lookup.ok) {
    return lookup.response;
  }

  if (!isPendingInvitation(lookup.invitation)) {
    return textResponse("Invitation expired", 410);
  }

  const session = await resolveSession(request, env);
  if (!session) {
    return htmlResponse(renderInvitationSignInPage(request, env, lookup.wiki), 401);
  }

  return htmlResponse(renderInvitationAcceptPage(lookup.wiki, token));
}

async function acceptWikiInvitation(request, env, token) {
  const lookup = await lookupInvitationFromRequest(request, env, token);
  if (!lookup.ok) {
    return lookup.response;
  }

  const session = await resolveSession(request, env);
  if (!session) {
    return textResponse("Sign in required", 401);
  }

  if (!isPendingInvitation(lookup.invitation)) {
    return textResponse("Invitation expired", 410);
  }

  const now = new Date().toISOString();
  const accepted = await acceptInvitationRecord(env, lookup.invitation.id, session.userId, now);
  if (!accepted) {
    return textResponse("Invitation expired", 410);
  }

  let membership = await findWikiMember(env, lookup.invitation.wikiSlug, session.userId);
  if (!membership) {
    membership = {
      wikiSlug: lookup.invitation.wikiSlug,
      userId: session.userId,
      role: "member"
    };
    await upsertWikiMember(env, membership);
  }

  const acceptedInvitation = {
    ...lookup.invitation,
    status: "accepted",
    acceptedByUserId: session.userId,
    acceptedAt: now,
    updatedAt: now
  };

  return jsonResponse({
    ok: true,
    membership: {
      wikiSlug: membership.wikiSlug,
      role: membership.role
    },
    invitation: serializeInvitation(acceptedInvitation)
  });
}

async function lookupInvitationFromRequest(request, env, token) {
  const wiki = await wikiFromRequestHost(request, env);
  if (!wiki) {
    return { ok: false, response: textResponse("Wiki not found", 404) };
  }

  const invitation = await findInvitationByTokenHash(env, await hashInvitationToken(token));
  if (!invitation || invitation.wikiSlug !== wiki.slug) {
    return { ok: false, response: textResponse("Invitation not found", 404) };
  }

  return {
    ok: true,
    wiki,
    invitation
  };
}

async function authorizeWikiOwner(request, env, wiki) {
  const session = await resolveSession(request, env);
  if (!session) {
    return { ok: false, status: 401, message: "Sign in required" };
  }

  const membership = await findWikiMember(env, wiki.slug, session.userId);
  if (!membership || membership.role !== "owner") {
    return { ok: false, status: 403, message: "Forbidden" };
  }

  return { ok: true, session, membership };
}

function normalizeInvitationDays(value) {
  if (value === undefined || value === null) return 7;
  const days = Number(value);
  if (!Number.isFinite(days) || days <= 0) return null;
  return Math.min(90, Math.floor(days));
}

function isPendingInvitation(invitation) {
  return invitation.status === "pending" &&
    invitation.expiresAt &&
    Date.parse(invitation.expiresAt) > Date.now();
}

function invitationUrlForRequest(request, token) {
  const url = new URL(request.url);
  return `${url.origin}/_wikiwise/invitations/${encodeURIComponent(token)}`;
}

async function hashInvitationToken(token) {
  const data = new TextEncoder().encode(token);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
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
  const access = await describeCommentWriteAccess(request, env, wiki);
  if (!access.ok) {
    return access;
  }

  return {
    ok: true,
    session: access.session,
    membership: access.membership
  };
}

async function describeCommentWriteAccess(request, env, wiki) {
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

function normalizeProfilePayload(payload, fallbackProfile = null) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { ok: false };
  }

  const keys = Object.keys(payload);
  if (!keys.length || keys.some((key) => key !== "displayName" && key !== "avatarUrl")) {
    return { ok: false };
  }

  let displayName = fallbackProfile?.displayName ?? "";
  if ("displayName" in payload) {
    if (typeof payload.displayName !== "string") return { ok: false };
    displayName = payload.displayName.trim();
  }
  if (!displayName || displayName.length > maxProfileDisplayNameLength) {
    return { ok: false };
  }

  let avatarUrl = fallbackProfile?.avatarUrl ?? null;
  if ("avatarUrl" in payload) {
    const normalizedAvatarUrl = normalizeProfileAvatarUrl(payload.avatarUrl);
    if (normalizedAvatarUrl === false) return { ok: false };
    avatarUrl = normalizedAvatarUrl;
  }

  return {
    ok: true,
    displayName,
    avatarUrl
  };
}

function normalizeProfileAvatarUrl(value) {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") return false;

  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length > maxProfileAvatarUrlLength) return false;

  let url;
  try {
    url = new URL(trimmed);
  } catch {
    return false;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  if (url.username || url.password) return false;

  return url.toString();
}

async function userIdentityForWiki(env, wiki, session) {
  return publicProfileForUser(env, wiki, session.userId, session);
}

function identityIdForWiki(wiki, userId) {
  return wiki.authRealm === "per-wiki"
    ? `wiki:${wiki.slug}:${userId}`
    : userId;
}

function baseUserIdForIdentity(wiki, identityId) {
  const prefix = `wiki:${wiki.slug}:`;
  return wiki.authRealm === "per-wiki" && identityId.startsWith(prefix)
    ? identityId.slice(prefix.length)
    : identityId;
}

async function publicProfileForUser(env, wiki, userId, fallbackProfile = null) {
  const identityId = identityIdForWiki(wiki, userId);
  const override = await findProfileOverride(env, identityId);
  const fallback = fallbackProfile?.displayName !== undefined
    ? fallbackProfile
    : await findUser(env, userId);

  return publicAuthorProfile({
    id: identityId,
    displayName: override?.displayName ?? fallback?.displayName,
    avatarUrl: override ? override.avatarUrl : fallback?.avatarUrl
  }, identityId);
}

async function publicProfileForIdentity(env, wiki, identityId) {
  const override = await findProfileOverride(env, identityId);
  const baseUserId = baseUserIdForIdentity(wiki, identityId);
  const baseUser = await findUser(env, baseUserId);
  const identityUser = baseUserId === identityId ? baseUser : await findUser(env, identityId);
  const fallback = baseUser ?? identityUser;

  return publicAuthorProfile({
    id: identityId,
    displayName: override?.displayName ?? fallback?.displayName,
    avatarUrl: override ? override.avatarUrl : fallback?.avatarUrl
  }, identityId);
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

async function authorProfilesForComments(env, wiki, comments) {
  const authors = new Map();
  for (const comment of comments) {
    if (authors.has(comment.userId)) continue;
    authors.set(comment.userId, await publicProfileForIdentity(env, wiki, comment.userId));
  }
  return authors;
}

function publicAuthorProfile(identity, fallbackId = null) {
  const id = identity?.id ?? fallbackId;
  return {
    id,
    displayName: identity?.displayName || "Unknown author",
    avatarUrl: identity?.avatarUrl ?? null
  };
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

async function findMembersForWiki(env, slug) {
  const result = await env.DB.prepare(`
    SELECT
      wiki_members.wiki_slug AS wikiSlug,
      wiki_members.user_id AS userId,
      wiki_members.role,
      wiki_members.created_at AS joinedAt,
      users.display_name AS displayName,
      users.avatar_url AS avatarUrl
    FROM wiki_members
    JOIN users ON users.id = wiki_members.user_id
    WHERE wiki_members.wiki_slug = ?
    ORDER BY wiki_members.role DESC, users.display_name ASC, users.id ASC
  `).bind(slug).all();

  return result.results ?? [];
}

async function deleteWikiMember(env, slug, userId) {
  await env.DB.prepare(`
    DELETE FROM wiki_members
    WHERE wiki_slug = ? AND user_id = ? AND role = 'member'
  `).bind(slug, userId).run();
}

function validatePublishPayload(payload) {
  if (!isValidWikiSlug(payload?.slug ?? "")) {
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

function isValidWikiSlug(slug) {
  return (
    /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(slug) &&
    !reservedWikiSlugs.has(slug)
  );
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
  authUrl.searchParams.set("redirect_uri", oauthRedirectUri(requestUrl, env, provider.id));
  authUrl.searchParams.set("scope", "openid profile email");
  authUrl.searchParams.set("state", stateId);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl.toString()
    }
  });
}

async function completeOidcProvider(request, env, providerId) {
  const provider = configuredOidcProviders(env).find((candidate) => candidate.id === providerId);
  if (!provider) {
    return textResponse("Provider not configured", 404);
  }

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const stateId = requestUrl.searchParams.get("state");
  if (!code || !stateId) {
    return textResponse("invalid_oauth_state", 400);
  }

  const state = await findOAuthState(env, stateId);
  if (!validOAuthState(state, provider.id)) {
    return textResponse("invalid_oauth_state", 400);
  }

  let profile;
  try {
    const redirectUri = oauthRedirectUri(requestUrl, env, provider.id);
    const tokens = await exchangeAuthorizationCode(env, provider, code, redirectUri);
    profile = await fetchProviderProfile(env, provider, tokens);
  } catch (error) {
    return textResponse(error.oauthCode ?? "oauth_exchange_failed", error.status ?? 502);
  }

  const now = new Date();
  const user = await upsertOAuthUser(env, provider, profile, now.toISOString());
  await bootstrapOwnerMembership(env, state.wikiSlug, user.id, profile.email, profile.emailVerified);

  const expiresAt = sessionExpiry(env, now);
  const sessionId = randomId("session");
  await insertSession(env, {
    id: sessionId,
    userId: user.id,
    expiresAt: expiresAt.toISOString()
  });
  await deleteOAuthState(env, state.id);

  return new Response(null, {
    status: 302,
    headers: {
      Location: state.returnTo,
      "Set-Cookie": sessionCookie(request, env, sessionId, expiresAt)
    }
  });
}

async function logoutUser(request, env) {
  const sessionId = parseCookies(request.headers.get("Cookie") ?? "").wwh_session;
  if (sessionId) {
    await deleteSession(env, sessionId);
  }

  return new Response(null, {
    status: 204,
    headers: {
      "Set-Cookie": expiredSessionCookie(request, env)
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
      tokenUrlKey: "GOOGLE_TOKEN_URL",
      userInfoUrlKey: "GOOGLE_USERINFO_URL",
      defaultAuthorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      defaultTokenUrl: "https://oauth2.googleapis.com/token",
      defaultUserInfoUrl: "https://openidconnect.googleapis.com/v1/userinfo"
    }),
    oidcProvider(env, {
      id: "feishu",
      name: "Feishu",
      clientIdKey: "FEISHU_CLIENT_ID",
      clientSecretKey: "FEISHU_CLIENT_SECRET",
      authorizationUrlKey: "FEISHU_AUTHORIZATION_URL",
      tokenUrlKey: "FEISHU_TOKEN_URL",
      userInfoUrlKey: "FEISHU_USERINFO_URL"
    }),
    oidcProvider(env, {
      id: "lark",
      name: "Lark",
      clientIdKey: "LARK_CLIENT_ID",
      clientSecretKey: "LARK_CLIENT_SECRET",
      authorizationUrlKey: "LARK_AUTHORIZATION_URL",
      tokenUrlKey: "LARK_TOKEN_URL",
      userInfoUrlKey: "LARK_USERINFO_URL"
    })
  ].filter(Boolean);
}

function oidcProvider(env, options) {
  const clientId = env?.[options.clientIdKey];
  const clientSecret = env?.[options.clientSecretKey];
  const authorizationUrl = env?.[options.authorizationUrlKey] ?? options.defaultAuthorizationUrl;
  const tokenUrl = env?.[options.tokenUrlKey] ?? options.defaultTokenUrl;
  const userInfoUrl = env?.[options.userInfoUrlKey] ?? options.defaultUserInfoUrl;

  if (!clientId || !clientSecret || !authorizationUrl || !tokenUrl || !userInfoUrl) return null;

  return {
    id: options.id,
    name: options.name,
    clientId,
    clientSecret,
    authorizationUrl,
    tokenUrl,
    userInfoUrl
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

function oauthRedirectUri(requestUrl, env, providerId) {
  return `${oauthCallbackOrigin(requestUrl, env)}/_wikiwise/auth/${encodeURIComponent(providerId)}/callback`;
}

function oauthCallbackOrigin(requestUrl, env) {
  const configuredOrigin = String(env?.WIKIWISE_AUTH_ORIGIN ?? "").trim();
  if (!configuredOrigin) {
    return requestUrl.origin;
  }

  try {
    const url = new URL(configuredOrigin);
    return url.protocol === "https:" || url.protocol === "http:" ? url.origin : requestUrl.origin;
  } catch {
    return requestUrl.origin;
  }
}

function validOAuthState(state, providerId) {
  return Boolean(
    state &&
    state.provider === providerId &&
    state.expiresAt &&
    Date.parse(state.expiresAt) > Date.now()
  );
}

async function exchangeAuthorizationCode(env, provider, code, redirectUri) {
  if (!provider.tokenUrl) {
    throw oauthError("oauth_exchange_failed", 502);
  }

  const response = await providerFetch(env)(provider.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: provider.clientId,
      client_secret: provider.clientSecret,
      redirect_uri: redirectUri
    })
  });

  if (!response.ok) {
    throw oauthError("oauth_exchange_failed", 502);
  }

  const tokens = await readJsonResponse(response, "oauth_exchange_failed");
  if (!tokens?.access_token) {
    throw oauthError("oauth_exchange_failed", 502);
  }
  return tokens;
}

async function fetchProviderProfile(env, provider, tokens) {
  if (!provider.userInfoUrl || !tokens.access_token) {
    throw oauthError("oauth_profile_missing_subject", 502);
  }

  const response = await providerFetch(env)(provider.userInfoUrl, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${tokens.access_token}`
    }
  });
  if (!response.ok) {
    throw oauthError("oauth_profile_failed", 502);
  }
  const claims = await readJsonResponse(response, "oauth_profile_failed");

  const profile = normalizeProviderProfile(claims ?? {});
  if (!profile.providerSubject) {
    throw oauthError("oauth_profile_missing_subject", 502);
  }
  return profile;
}

async function upsertOAuthUser(env, provider, profile, updatedAt) {
  const existingAccount = await findOAuthAccount(env, provider.id, profile.providerSubject);
  const userId = existingAccount?.userId ?? randomId("user");
  const user = {
    id: userId,
    displayName: profile.displayName,
    avatarUrl: profile.avatarUrl,
    updatedAt
  };

  await upsertUser(env, user);
  await upsertOAuthAccount(env, {
    id: existingAccount?.id ?? randomId("oauth_account"),
    userId,
    provider: provider.id,
    providerSubject: profile.providerSubject,
    email: profile.email
  });

  return user;
}

async function bootstrapOwnerMembership(env, wikiSlug, userId, email, emailVerified) {
  const allowedEmails = adminEmails(env);
  if (!email || emailVerified !== true || !allowedEmails.has(email)) return;

  const wiki = await findWiki(env, wikiSlug);
  if (!wiki || wiki.visibility !== "private") return;

  await upsertWikiMember(env, {
    wikiSlug,
    userId,
    role: "owner"
  });
}

function normalizeProviderProfile(claims) {
  const nested = claims?.data && typeof claims.data === "object" ? claims.data : {};
  const providerSubject = firstString(
    claims.sub,
    claims.id,
    claims.open_id,
    claims.union_id,
    claims.user_id,
    nested.sub,
    nested.id,
    nested.open_id,
    nested.union_id,
    nested.user_id
  );
  const email = normalizeEmail(firstString(claims.email, nested.email));
  const emailVerified = firstVerifiedBoolean(
    claims.email_verified,
    claims.verified_email,
    nested.email_verified,
    nested.verified_email
  );
  const displayName = firstString(
    claims.name,
    claims.display_name,
    claims.username,
    nested.name,
    nested.display_name,
    nested.en_name,
    email,
    providerSubject
  );
  const avatarUrl = firstString(
    claims.picture,
    claims.avatar_url,
    claims.avatar,
    nested.picture,
    nested.avatar_url,
    nested.avatar_thumb
  );

  return {
    providerSubject,
    displayName,
    avatarUrl,
    email,
    emailVerified
  };
}

function firstString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

function normalizeEmail(email) {
  return typeof email === "string" && email.trim()
    ? email.trim().toLowerCase()
    : null;
}

function firstVerifiedBoolean(...values) {
  for (const value of values) {
    if (value === true || value === "true") return true;
    if (value === false || value === "false") return false;
  }
  return false;
}

function adminEmails(env) {
  return new Set(
    String(env?.WIKIWISE_ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => normalizeEmail(email))
      .filter(Boolean)
  );
}

function sessionExpiry(env, now) {
  const configuredDays = Number(env?.WIKIWISE_SESSION_DAYS);
  const days = Number.isFinite(configuredDays) && configuredDays > 0
    ? Math.min(configuredDays, 365)
    : 30;
  return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
}

function sessionCookie(request, env, sessionId, expiresAt) {
  const maxAge = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
  return buildSessionCookie(request, env, encodeURIComponent(sessionId), {
    maxAge,
    expires: expiresAt.toUTCString()
  });
}

function expiredSessionCookie(request, env) {
  return buildSessionCookie(request, env, "", {
    maxAge: 0,
    expires: "Thu, 01 Jan 1970 00:00:00 GMT"
  });
}

function buildSessionCookie(request, env, value, options) {
  const attrs = [
    `wwh_session=${value}`,
    "Path=/",
    `Max-Age=${options.maxAge}`,
    `Expires=${options.expires}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax"
  ];
  const domain = cookieDomainForRequest(request, env);
  if (domain) attrs.push(`Domain=${domain}`);
  return attrs.join("; ");
}

function cookieDomainForRequest(request, env) {
  const publicDomain = publicDomainForEnv(env);
  const hostname = new URL(request.url).hostname;
  return hostname === publicDomain || hostname.endsWith(`.${publicDomain}`)
    ? `.${publicDomain}`
    : null;
}

function providerFetch(env) {
  return typeof env?.fetch === "function" ? env.fetch : fetch;
}

async function readJsonResponse(response, errorCode) {
  try {
    return await response.json();
  } catch {
    throw oauthError(errorCode, 502);
  }
}

function oauthError(oauthCode, status) {
  const error = new Error(oauthCode);
  error.oauthCode = oauthCode;
  error.status = status;
  return error;
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

async function findOAuthState(env, id) {
  return env.DB.prepare(`
    SELECT
      id,
      provider,
      wiki_slug AS wikiSlug,
      return_to AS returnTo,
      expires_at AS expiresAt
    FROM oauth_states
    WHERE id = ?
  `).bind(id).first();
}

async function deleteOAuthState(env, id) {
  await env.DB.prepare(`
    DELETE FROM oauth_states
    WHERE id = ?
  `).bind(id).run();
}

async function findOAuthAccount(env, provider, providerSubject) {
  return env.DB.prepare(`
    SELECT
      id,
      user_id AS userId,
      provider,
      provider_subject AS providerSubject,
      email
    FROM oauth_accounts
    WHERE provider = ? AND provider_subject = ?
  `).bind(provider, providerSubject).first();
}

async function upsertUser(env, user) {
  await env.DB.prepare(`
    INSERT INTO users (id, display_name, avatar_url, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      display_name = excluded.display_name,
      avatar_url = excluded.avatar_url,
      updated_at = excluded.updated_at
  `).bind(
    user.id,
    user.displayName,
    user.avatarUrl,
    user.updatedAt
  ).run();
}

async function findUser(env, id) {
  return env.DB.prepare(`
    SELECT
      id,
      display_name AS displayName,
      avatar_url AS avatarUrl
    FROM users
    WHERE id = ?
  `).bind(id).first();
}

async function findProfileOverride(env, identityId) {
  return env.DB.prepare(`
    SELECT
      identity_id AS identityId,
      user_id AS userId,
      wiki_slug AS wikiSlug,
      display_name AS displayName,
      avatar_url AS avatarUrl
    FROM user_profile_overrides
    WHERE identity_id = ?
  `).bind(identityId).first();
}

async function upsertProfileOverride(env, profile) {
  await env.DB.prepare(`
    INSERT INTO user_profile_overrides (
      identity_id,
      user_id,
      wiki_slug,
      display_name,
      avatar_url,
      updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(identity_id) DO UPDATE SET
      user_id = excluded.user_id,
      wiki_slug = excluded.wiki_slug,
      display_name = excluded.display_name,
      avatar_url = excluded.avatar_url,
      updated_at = excluded.updated_at
  `).bind(
    profile.identityId,
    profile.userId,
    profile.wikiSlug,
    profile.displayName,
    profile.avatarUrl,
    profile.updatedAt
  ).run();
}

async function upsertOAuthAccount(env, account) {
  await env.DB.prepare(`
    INSERT INTO oauth_accounts (id, user_id, provider, provider_subject, email)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(provider, provider_subject) DO UPDATE SET
      user_id = excluded.user_id,
      email = excluded.email
  `).bind(
    account.id,
    account.userId,
    account.provider,
    account.providerSubject,
    account.email
  ).run();
}

async function insertSession(env, session) {
  await env.DB.prepare(`
    INSERT INTO sessions (id, user_id, expires_at)
    VALUES (?, ?, ?)
  `).bind(session.id, session.userId, session.expiresAt).run();
}

async function deleteSession(env, id) {
  await env.DB.prepare(`
    DELETE FROM sessions
    WHERE id = ?
  `).bind(id).run();
}

async function upsertWikiMember(env, membership) {
  await env.DB.prepare(`
    INSERT INTO wiki_members (wiki_slug, user_id, role)
    VALUES (?, ?, ?)
    ON CONFLICT(wiki_slug, user_id) DO UPDATE SET
      role = excluded.role
  `).bind(
    membership.wikiSlug,
    membership.userId,
    membership.role
  ).run();
}

async function insertWikiInvitation(env, invitation) {
  await env.DB.prepare(`
    INSERT INTO wiki_invitations (
      id,
      wiki_slug,
      token_hash,
      created_by_user_id,
      role,
      status,
      expires_at,
      accepted_by_user_id,
      accepted_at,
      created_at,
      updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    invitation.id,
    invitation.wikiSlug,
    invitation.tokenHash,
    invitation.createdByUserId,
    invitation.role,
    invitation.status,
    invitation.expiresAt,
    invitation.acceptedByUserId,
    invitation.acceptedAt,
    invitation.createdAt,
    invitation.updatedAt
  ).run();
}

async function findInvitationByTokenHash(env, tokenHash) {
  return env.DB.prepare(`
    SELECT
      id,
      wiki_slug AS wikiSlug,
      token_hash AS tokenHash,
      created_by_user_id AS createdByUserId,
      role,
      status,
      expires_at AS expiresAt,
      accepted_by_user_id AS acceptedByUserId,
      accepted_at AS acceptedAt,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM wiki_invitations
    WHERE token_hash = ?
  `).bind(tokenHash).first();
}

async function findInvitationForWiki(env, slug, id) {
  return env.DB.prepare(`
    SELECT
      id,
      wiki_slug AS wikiSlug,
      token_hash AS tokenHash,
      created_by_user_id AS createdByUserId,
      role,
      status,
      expires_at AS expiresAt,
      accepted_by_user_id AS acceptedByUserId,
      accepted_at AS acceptedAt,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM wiki_invitations
    WHERE wiki_slug = ? AND id = ?
  `).bind(slug, id).first();
}

async function findInvitationsForWiki(env, slug) {
  const result = await env.DB.prepare(`
    SELECT
      id,
      wiki_slug AS wikiSlug,
      token_hash AS tokenHash,
      created_by_user_id AS createdByUserId,
      role,
      status,
      expires_at AS expiresAt,
      accepted_by_user_id AS acceptedByUserId,
      accepted_at AS acceptedAt,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM wiki_invitations
    WHERE wiki_slug = ?
    ORDER BY created_at DESC, id DESC
  `).bind(slug).all();

  return result.results ?? [];
}

async function updateWikiInvitationStatus(env, id, status, updatedAt) {
  await env.DB.prepare(`
    UPDATE wiki_invitations
    SET status = ?, updated_at = ?
    WHERE id = ?
  `).bind(status, updatedAt, id).run();
}

async function acceptInvitationRecord(env, id, acceptedByUserId, acceptedAt) {
  const result = await env.DB.prepare(`
    UPDATE wiki_invitations
    SET status = ?, accepted_by_user_id = ?, accepted_at = ?, updated_at = ?
    WHERE id = ? AND status = 'pending'
  `).bind("accepted", acceptedByUserId, acceptedAt, acceptedAt, id).run();
  return result.meta?.changes !== 0;
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
    if (comment.status === "hidden") continue;
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
  const publicDomain = publicDomainForEnv(env);
  const normalizedHostname = String(hostname ?? "").toLowerCase();
  if (!normalizedHostname.endsWith(`.${publicDomain}`)) {
    return null;
  }

  const hostLabel = normalizedHostname.slice(0, -publicDomain.length - 1);
  if (!hostLabel.endsWith(wikiHostnameSuffix)) {
    return null;
  }

  const slug = hostLabel.slice(0, -wikiHostnameSuffix.length);
  if (!slug || reservedWikiSlugs.has(slug)) {
    return null;
  }

  return /^[a-z0-9-]+$/.test(slug) ? slug : null;
}

function publicWikiUrl(env, slug) {
  return `https://${slug}${wikiHostnameSuffix}.${publicDomainForEnv(env)}`;
}

function publicDomainForEnv(env) {
  return String(env?.WIKIWISE_PUBLIC_DOMAIN ?? defaultPublicDomain).trim().toLowerCase();
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

function serializeComment(comment, author = null) {
  return {
    id: comment.id,
    pagePath: comment.pagePath,
    userId: comment.userId,
    author: publicAuthorProfile(author, comment.userId),
    parentCommentId: comment.parentCommentId ?? null,
    body: comment.body,
    anchor: parseAnchorJson(comment.anchorJson),
    status: comment.status,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt
  };
}

function serializeInvitation(invitation) {
  return {
    id: invitation.id,
    wikiSlug: invitation.wikiSlug,
    role: invitation.role,
    status: invitation.status,
    expiresAt: invitation.expiresAt,
    acceptedAt: invitation.acceptedAt ?? null,
    createdAt: invitation.createdAt,
    updatedAt: invitation.updatedAt
  };
}

function serializeMember(member) {
  return {
    wikiSlug: member.wikiSlug,
    role: member.role,
    joinedAt: member.joinedAt ?? null,
    user: {
      id: member.userId,
      displayName: member.displayName || "Unknown member",
      avatarUrl: member.avatarUrl ?? null
    }
  };
}

function readerVisibleComments(comments) {
  const byId = new Map(comments.map((comment) => [comment.id, comment]));
  const hiddenBranch = new Map();

  function isHiddenBranch(comment) {
    if (hiddenBranch.has(comment.id)) {
      return hiddenBranch.get(comment.id);
    }

    const hidden = comment.status === "hidden" || (
      comment.parentCommentId &&
      byId.has(comment.parentCommentId) &&
      isHiddenBranch(byId.get(comment.parentCommentId))
    );
    hiddenBranch.set(comment.id, hidden);
    return hidden;
  }

  return comments.filter((comment) => !isHiddenBranch(comment));
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

function runtimeAssetResponse(request, body, contentType) {
  const headers = new Headers({
    "Content-Type": contentType,
    "Cache-Control": "public, max-age=300"
  });

  return new Response(request.method === "HEAD" ? null : body, {
    status: 200,
    headers
  });
}

function shouldInjectReaderRuntime(contentType, filePath) {
  return filePath.endsWith(".html") && String(contentType).includes("text/html");
}

function injectReaderRuntime(html) {
  const stylesheet = '<link rel="stylesheet" href="/_wikiwise/client.css">';
  const script = '<script src="/_wikiwise/client.js" defer></script>';
  let output = html;

  if (!output.includes('/_wikiwise/client.css')) {
    output = insertBeforeClosingTag(output, "head", stylesheet);
  }
  if (!output.includes('/_wikiwise/client.js')) {
    output = insertBeforeClosingTag(output, "body", script);
  }

  return output;
}

function insertBeforeClosingTag(html, tagName, markup) {
  const pattern = new RegExp(`</${tagName}>`, "i");
  const match = pattern.exec(html);
  if (!match) {
    return `${html}\n${markup}`;
  }

  return `${html.slice(0, match.index)}${markup}\n${html.slice(match.index)}`;
}

function privateAccessResponse(request, env, wiki, access) {
  const body = request.method === "HEAD" ? null : renderPrivateAccessPage(request, env, wiki, access);
  return htmlResponse(body, access.status);
}

function renderPrivateAccessPage(request, env, wiki, access) {
  const requestUrl = new URL(request.url);
  const returnTo = safeReturnTo(requestUrl, requestUrl.toString());
  const providers = configuredOidcProviders(env);
  const isSignIn = access.status === 401;
  const title = isSignIn ? `Sign in to ${wiki.slug}` : "Access required";
  const message = isSignIn
    ? "Choose a sign-in provider to continue reading this private wiki."
    : "Your account is signed in, but it does not have access to this private wiki.";
  const providerLinks = providers.map((provider) => {
    const href = `/_wikiwise/auth/${encodeURIComponent(provider.id)}/start?returnTo=${encodeURIComponent(returnTo)}`;
    return `<a class="wikiwise-hub-auth-link" href="${escapeAttribute(href)}">${escapeHtml(provider.name)}</a>`;
  }).join("");
  const providerContent = providerLinks ||
    '<p class="wikiwise-hub-muted">No sign-in providers are configured for this Hub.</p>';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>${escapeHtml(title)}</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      color: #18212f;
      background: #f6f7f9;
      font: 16px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    main {
      width: min(420px, calc(100vw - 32px));
      padding: 28px;
      border: 1px solid #d8dde6;
      border-radius: 8px;
      background: #fff;
      box-shadow: 0 12px 36px rgba(24, 33, 47, 0.08);
    }
    h1 {
      margin: 0 0 10px;
      font-size: 24px;
      line-height: 1.2;
    }
    p {
      margin: 0 0 18px;
      color: #4c5a6d;
    }
    .wikiwise-hub-auth-actions {
      display: grid;
      gap: 10px;
    }
    .wikiwise-hub-auth-link {
      display: block;
      padding: 10px 12px;
      border: 1px solid #c9d2df;
      border-radius: 6px;
      color: #172033;
      text-align: center;
      text-decoration: none;
      background: #fff;
    }
    .wikiwise-hub-auth-link:hover {
      border-color: #8292a8;
      background: #f9fafb;
    }
    .wikiwise-hub-muted {
      margin-bottom: 0;
      color: #6d7888;
    }
  </style>
</head>
<body>
  <main>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(message)}</p>
    <div class="wikiwise-hub-auth-actions">${providerContent}</div>
  </main>
</body>
</html>`;
}

function renderInvitationSignInPage(request, env, wiki) {
  const requestUrl = new URL(request.url);
  const returnTo = safeReturnTo(requestUrl, requestUrl.toString());
  const providers = configuredOidcProviders(env);
  const providerLinks = providers.map((provider) => {
    const href = `/_wikiwise/auth/${encodeURIComponent(provider.id)}/start?returnTo=${encodeURIComponent(returnTo)}`;
    return `<a class="wikiwise-hub-auth-link" href="${escapeAttribute(href)}">${escapeHtml(provider.name)}</a>`;
  }).join("");
  const providerContent = providerLinks ||
    '<p class="wikiwise-hub-muted">No sign-in providers are configured for this Hub.</p>';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>Sign in to accept invitation</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      color: #18212f;
      background: #f6f7f9;
      font: 16px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    main {
      width: min(420px, calc(100vw - 32px));
      padding: 28px;
      border: 1px solid #d8dde6;
      border-radius: 8px;
      background: #fff;
      box-shadow: 0 12px 36px rgba(24, 33, 47, 0.08);
    }
    h1 {
      margin: 0 0 10px;
      font-size: 24px;
      line-height: 1.2;
    }
    p {
      margin: 0 0 18px;
      color: #4c5a6d;
    }
    .wikiwise-hub-auth-actions {
      display: grid;
      gap: 10px;
    }
    .wikiwise-hub-auth-link {
      display: block;
      padding: 10px 12px;
      border: 1px solid #c9d2df;
      border-radius: 6px;
      color: #172033;
      text-align: center;
      text-decoration: none;
      background: #fff;
    }
    .wikiwise-hub-auth-link:hover {
      border-color: #8292a8;
      background: #f9fafb;
    }
    .wikiwise-hub-muted {
      margin-bottom: 0;
      color: #6d7888;
    }
  </style>
</head>
<body>
  <main>
    <h1>Sign in to accept invitation</h1>
    <p>Sign in to join ${escapeHtml(wiki.slug)}.</p>
    <div class="wikiwise-hub-auth-actions">${providerContent}</div>
  </main>
</body>
</html>`;
}

function renderInvitationAcceptPage(wiki, token) {
  const action = `/_wikiwise/invitations/${encodeURIComponent(token)}/accept`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>Accept invitation</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      color: #18212f;
      background: #f6f7f9;
      font: 16px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    main {
      width: min(420px, calc(100vw - 32px));
      padding: 28px;
      border: 1px solid #d8dde6;
      border-radius: 8px;
      background: #fff;
      box-shadow: 0 12px 36px rgba(24, 33, 47, 0.08);
    }
    h1 {
      margin: 0 0 10px;
      font-size: 24px;
      line-height: 1.2;
    }
    p {
      margin: 0 0 18px;
      color: #4c5a6d;
    }
    button {
      padding: 10px 12px;
      border: 1px solid #172033;
      border-radius: 6px;
      color: #fff;
      background: #172033;
      cursor: pointer;
      font: inherit;
    }
  </style>
</head>
<body>
  <main>
    <h1>Accept invitation</h1>
    <p>You are accepting membership for ${escapeHtml(wiki.slug)}.</p>
    <form method="post" action="${escapeAttribute(action)}">
      <button type="submit">Accept invitation</button>
    </form>
  </main>
</body>
</html>`;
}

function htmlResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8"
    }
  });
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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

const readerClientStyles = `
.wikiwise-hub-account {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  margin: 16px auto 0;
  width: min(100%, 1040px);
  color: #2d3748;
  font: 14px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.wikiwise-hub-account a,
.wikiwise-hub-account button,
.wikiwise-hub-comment-composer button,
.wikiwise-hub-comment-actions button,
.wikiwise-hub-hidden-comment button,
.wikiwise-hub-comment-reply {
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  color: #1f2937;
  background: #fff;
  cursor: pointer;
  font: inherit;
  text-decoration: none;
}

.wikiwise-hub-account a,
.wikiwise-hub-account button {
  padding: 6px 10px;
}

.wikiwise-hub-profile {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.wikiwise-hub-profile img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.wikiwise-hub-profile-control,
.wikiwise-hub-profile-form {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.wikiwise-hub-profile-form input {
  width: min(32vw, 220px);
  min-width: 120px;
  padding: 6px 8px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  color: #243044;
  background: #fff;
  font: inherit;
}

.wikiwise-hub-invitation-control {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: min(100%, 560px);
}

.wikiwise-hub-invitation-control input {
  width: min(48vw, 360px);
  min-width: 220px;
  padding: 6px 8px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  color: #243044;
  background: #f8fafc;
  font: inherit;
}

.wikiwise-hub-invitation-status {
  color: #64748b;
}

.wikiwise-hub-members-control {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.wikiwise-hub-members-panel {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 2147483647;
  width: min(340px, calc(100vw - 32px));
  max-height: 360px;
  overflow: auto;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.16);
}

.wikiwise-hub-member-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
  padding: 8px 0;
  border-top: 1px solid #edf2f7;
}

.wikiwise-hub-member-row:first-child {
  border-top: 0;
}

.wikiwise-hub-member-name {
  display: block;
  overflow: hidden;
  color: #1f2937;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wikiwise-hub-member-role {
  display: block;
  color: #64748b;
  font-size: 12px;
}

.wikiwise-hub-comments {
  margin: 40px 0 0;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
  color: #243044;
  font: 15px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.wikiwise-hub-comments h2 {
  margin: 0 0 16px;
  font-size: 20px;
}

.wikiwise-hub-comment {
  margin: 0 0 14px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
}

.wikiwise-hub-comment-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  color: #64748b;
  font-size: 13px;
}

.wikiwise-hub-comment-meta img {
  width: 22px;
  height: 22px;
  border-radius: 50%;
}

.wikiwise-hub-comment-author {
  color: #1f2937;
  font-weight: 600;
}

.wikiwise-hub-comment-body {
  white-space: pre-wrap;
}

.wikiwise-hub-comment-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.wikiwise-hub-hidden-comments {
  margin: 18px 0;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.wikiwise-hub-hidden-comments h3 {
  margin: 0 0 8px;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
}

.wikiwise-hub-hidden-comment {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  align-items: start;
  padding: 8px 0;
  border-top: 1px solid #f1f5f9;
}

.wikiwise-hub-hidden-comment:first-of-type {
  border-top: 0;
}

.wikiwise-hub-hidden-comment-body {
  overflow: hidden;
  color: #475569;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wikiwise-hub-comment-composer {
  display: grid;
  gap: 8px;
  margin-top: 16px;
}

.wikiwise-hub-comment-composer textarea {
  min-height: 92px;
  resize: vertical;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font: inherit;
}

.wikiwise-hub-comment-composer button,
.wikiwise-hub-comment-actions button,
.wikiwise-hub-hidden-comment button,
.wikiwise-hub-comment-reply {
  justify-self: start;
  padding: 6px 10px;
}

.wikiwise-hub-muted,
.wikiwise-hub-error {
  color: #64748b;
}

.wikiwise-hub-error {
  color: #b42318;
}
`.trim();

const readerClientScript = `
(() => {
  const accountClass = "wikiwise-hub-account";
  const commentsClass = "wikiwise-hub-comments";

  document.addEventListener("DOMContentLoaded", () => {
    bootWikiwiseHubReader().catch((error) => {
      console.warn("Wikiwise Hub reader failed", error);
    });
  });

  async function bootWikiwiseHubReader() {
    const accountRoot = ensureAccountRoot();
    const commentsRoot = ensureCommentsRoot();
    const providersResult = await fetchJson("/_wikiwise/auth/providers");
    const profileResult = await fetchJson("/_wikiwise/me");
    const providers = providersResult.ok ? providersResult.data.providers || [] : [];
    const profile = profileResult.ok ? profileResult.data : null;
    const readerState = {
      accountRoot,
      commentsRoot,
      providers,
      profile
    };

    renderAccountSurface(accountRoot, profile, providers, readerState);
    await renderCommentsSurface(commentsRoot, profile);
  }

  function ensureAccountRoot() {
    let root = document.querySelector("." + accountClass);
    if (root) return root;

    root = document.createElement("div");
    root.className = accountClass;
    const masthead = document.querySelector(".masthead") || document.querySelector("header") || document.body;
    masthead.appendChild(root);
    return root;
  }

  function ensureCommentsRoot() {
    let root = document.querySelector("." + commentsClass);
    if (root) return root;

    root = document.createElement("section");
    root.className = commentsClass;
    root.id = "wikiwise-hub-comments";
    root.setAttribute("aria-label", "Comments");
    const article = document.querySelector(".article") || document.querySelector("article") || document.querySelector("main") || document.body;
    article.appendChild(root);
    return root;
  }

  function renderAccountSurface(root, profile, providers, state) {
    const readerState = state || {};
    readerState.accountRoot = root;
    readerState.providers = providers;
    readerState.profile = profile;

    root.replaceChildren();
    if (profile && profile.user) {
      const identity = document.createElement("span");
      identity.className = "wikiwise-hub-profile";
      if (profile.user.avatarUrl) {
        const avatar = document.createElement("img");
        avatar.src = profile.user.avatarUrl;
        avatar.alt = "";
        identity.appendChild(avatar);
      }
      const name = document.createElement("span");
      name.textContent = profile.user.displayName || "Signed in";
      identity.appendChild(name);

      const logout = document.createElement("button");
      logout.type = "button";
      logout.textContent = "Log out";
      logout.addEventListener("click", async () => {
        await fetch("/_wikiwise/logout", {
          method: "POST",
          credentials: "same-origin"
        });
        window.location.reload();
      });

      root.appendChild(identity);
      root.appendChild(createProfileEditControl(profile, readerState));
      if (profile.membership && profile.membership.role === "owner") {
        root.appendChild(createOwnerInvitationControl());
        root.appendChild(createOwnerMembersControl());
      }
      root.appendChild(logout);
      return;
    }

    if (!providers.length) {
      const unavailable = document.createElement("span");
      unavailable.className = "wikiwise-hub-muted";
      unavailable.textContent = "Sign-in unavailable";
      root.appendChild(unavailable);
      return;
    }

    for (const provider of providers) {
      const link = document.createElement("a");
      link.href = "/_wikiwise/auth/" + encodeURIComponent(provider.id) + "/start?returnTo=" + encodeURIComponent(window.location.href);
      link.textContent = "Sign in with " + provider.name;
      root.appendChild(link);
    }
  }

  function createProfileEditControl(profile, state) {
    const control = document.createElement("span");
    control.className = "wikiwise-hub-profile-control";

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.textContent = "Edit profile";

    const form = document.createElement("form");
    form.className = "wikiwise-hub-profile-form";
    form.hidden = true;

    const displayName = document.createElement("input");
    displayName.name = "displayName";
    displayName.type = "text";
    displayName.required = true;
    displayName.maxLength = 80;
    displayName.value = profile.user.displayName || "";
    displayName.placeholder = "Display name";
    displayName.setAttribute("aria-label", "Display name");

    const avatarUrl = document.createElement("input");
    avatarUrl.name = "avatarUrl";
    avatarUrl.type = "url";
    avatarUrl.maxLength = 512;
    avatarUrl.value = profile.user.avatarUrl || "";
    avatarUrl.placeholder = "Avatar URL";
    avatarUrl.setAttribute("aria-label", "Avatar URL");

    const save = document.createElement("button");
    save.type = "submit";
    save.textContent = "Save";

    const status = document.createElement("span");
    status.className = "wikiwise-hub-muted";

    toggle.addEventListener("click", () => {
      form.hidden = !form.hidden;
      status.textContent = "";
      if (!form.hidden) {
        displayName.focus();
        displayName.select();
      }
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      await saveProfile(profile, form, state, status, save);
    });

    form.append(displayName, avatarUrl, save);
    control.append(toggle, form, status);
    return control;
  }

  async function saveProfile(profile, form, state, status, button) {
    const displayName = form.elements.displayName.value.trim();
    const avatarUrl = form.elements.avatarUrl.value.trim();
    const refreshMembers = Boolean(state.accountRoot && state.accountRoot.querySelector(".wikiwise-hub-members-panel:not([hidden])"));

    button.disabled = true;
    status.className = "wikiwise-hub-muted";
    status.textContent = "";
    const result = await fetchJson("/_wikiwise/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        displayName,
        avatarUrl: avatarUrl || null
      })
    });
    button.disabled = false;

    if (!result.ok) {
      status.className = "wikiwise-hub-error";
      status.textContent = result.error || "Unable to save profile.";
      return;
    }

    const updatedProfile = result.data;
    state.profile = updatedProfile;
    renderAccountSurface(state.accountRoot, updatedProfile, state.providers || [], state);
    if (state.commentsRoot) {
      await renderCommentsSurface(state.commentsRoot, updatedProfile);
    }
    if (refreshMembers) {
      const panel = state.accountRoot.querySelector(".wikiwise-hub-members-panel");
      if (panel) {
        panel.hidden = false;
        await refreshOwnerMembers(panel);
      }
    }
  }

  function createOwnerInvitationControl() {
    const control = document.createElement("span");
    control.className = "wikiwise-hub-invitation-control";

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Create invite";

    const field = document.createElement("input");
    field.type = "text";
    field.readOnly = true;
    field.hidden = true;
    field.setAttribute("aria-label", "Invitation link");

    const status = document.createElement("span");
    status.className = "wikiwise-hub-invitation-status";

    button.addEventListener("click", async () => {
      button.disabled = true;
      status.textContent = "";
      const result = await fetchJson("/_wikiwise/admin/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });
      button.disabled = false;

      if (!result.ok) {
        field.hidden = true;
        status.className = "wikiwise-hub-error";
        status.textContent = result.error || "Unable to create invite.";
        return;
      }

      field.hidden = false;
      field.value = result.data.inviteUrl || "";
      field.focus();
      field.select();
      status.className = "wikiwise-hub-invitation-status";
      status.textContent = "Invite link ready";
    });

    control.append(button, field, status);
    return control;
  }

  function createOwnerMembersControl() {
    const control = document.createElement("span");
    control.className = "wikiwise-hub-members-control";

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Members";

    const panel = document.createElement("div");
    panel.className = "wikiwise-hub-members-panel";
    panel.hidden = true;

    button.addEventListener("click", async () => {
      panel.hidden = !panel.hidden;
      if (!panel.hidden) {
        await refreshOwnerMembers(panel);
      }
    });

    control.append(button, panel);
    return control;
  }

  async function refreshOwnerMembers(panel) {
    panel.replaceChildren();
    appendStatus(panel, "Loading members...", "wikiwise-hub-muted");
    const result = await fetchJson("/_wikiwise/admin/members");
    panel.replaceChildren();

    if (!result.ok) {
      appendStatus(panel, result.error || "Unable to load members.", "wikiwise-hub-error");
      return;
    }

    const members = result.data.members || [];
    if (!members.length) {
      appendStatus(panel, "No members yet.", "wikiwise-hub-muted");
      return;
    }

    for (const member of members) {
      panel.appendChild(renderOwnerMemberRow(member, panel));
    }
  }

  function renderOwnerMemberRow(member, panel) {
    const row = document.createElement("div");
    row.className = "wikiwise-hub-member-row";

    const details = document.createElement("span");
    const name = document.createElement("span");
    name.className = "wikiwise-hub-member-name";
    name.textContent = member.user && member.user.displayName ? member.user.displayName : "Unknown member";
    const role = document.createElement("span");
    role.className = "wikiwise-hub-member-role";
    role.textContent = member.role || "member";
    details.append(name, role);
    row.appendChild(details);

    if (member.role === "member" && member.user && member.user.id) {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "Remove";
      remove.addEventListener("click", async () => {
        remove.disabled = true;
        const result = await fetchJson("/_wikiwise/admin/members/" + encodeURIComponent(member.user.id), {
          method: "DELETE"
        });
        if (!result.ok) {
          remove.disabled = false;
          appendStatus(panel, result.error || "Unable to remove member.", "wikiwise-hub-error");
          return;
        }
        await refreshOwnerMembers(panel);
      });
      row.appendChild(remove);
    }

    return row;
  }

  async function renderCommentsSurface(root, profile) {
    root.replaceChildren();
    const title = document.createElement("h2");
    title.textContent = "Comments";
    root.appendChild(title);

    const pagePath = currentPagePath();
    const commentsResult = await fetchJson("/_wikiwise/comments?pagePath=" + encodeURIComponent(pagePath));
    if (!commentsResult.ok) {
      appendStatus(root, commentsResult.error || "Comments unavailable", "wikiwise-hub-error");
      return;
    }

    const data = commentsResult.data;
    const commentPolicy = data.commentPolicy;
    const comments = data.comments || [];
    const isOwner = Boolean(profile && profile.membership && profile.membership.role === "owner");
    if (!comments.length) {
      appendStatus(root, "No comments yet.", "wikiwise-hub-muted");
    }

    const depths = new Map();
    for (const comment of comments) {
      const depth = comment.parentCommentId ? (depths.get(comment.parentCommentId) || 0) + 1 : 0;
      depths.set(comment.id, depth);
      root.appendChild(renderComment(comment, depth, data.canComment, pagePath, root, profile, isOwner));
    }

    if (isOwner) {
      await renderHiddenComments(root, pagePath, profile);
    }

    if (data.canComment) {
      root.appendChild(renderComposer(pagePath, null, root, profile));
    } else {
      const message = commentPolicy === "disabled"
        ? "Comments are disabled."
        : data.commentMessage || "Sign in to comment.";
      appendStatus(root, message, "wikiwise-hub-muted");
    }
  }

  function renderComment(comment, depth, canReply, pagePath, commentsRoot, profile, isOwner) {
    const item = document.createElement("article");
    item.className = "wikiwise-hub-comment";
    item.style.marginLeft = Math.min(depth, 4) * 18 + "px";

    const meta = document.createElement("div");
    meta.className = "wikiwise-hub-comment-meta";
    const author = comment.author || {};
    if (author.avatarUrl) {
      const avatar = document.createElement("img");
      avatar.src = author.avatarUrl;
      avatar.alt = "";
      meta.appendChild(avatar);
    }
    const name = document.createElement("span");
    name.className = "wikiwise-hub-comment-author";
    name.textContent = author.displayName || author.id || "Unknown author";
    const time = document.createElement("span");
    time.textContent = "· " + new Date(comment.createdAt).toLocaleString();
    meta.append(name, time);

    const body = document.createElement("div");
    body.className = "wikiwise-hub-comment-body";
    body.textContent = comment.body;
    item.append(meta, body);

    if (isOwner && comment.status !== "hidden") {
      const actions = document.createElement("div");
      actions.className = "wikiwise-hub-comment-actions";
      const hide = document.createElement("button");
      hide.type = "button";
      hide.textContent = "Hide";
      hide.addEventListener("click", () => hideComment(comment.id, pagePath, commentsRoot, profile, hide));
      actions.appendChild(hide);
      item.appendChild(actions);
    }

    if (canReply) {
      const reply = document.createElement("button");
      reply.type = "button";
      reply.className = "wikiwise-hub-comment-reply";
      reply.textContent = "Reply";
      reply.addEventListener("click", () => {
        const existing = item.querySelector(".wikiwise-hub-comment-composer");
        if (existing) {
          existing.remove();
          return;
        }
        item.appendChild(renderComposer(pagePath, comment.id, commentsRoot, profile));
      });
      item.appendChild(reply);
    }

    return item;
  }

  async function renderHiddenComments(root, pagePath, profile) {
    const result = await fetchJson("/_wikiwise/admin/comments?pagePath=" + encodeURIComponent(pagePath));
    if (!result.ok) {
      appendStatus(root, result.error || "Unable to load hidden comments.", "wikiwise-hub-error");
      return;
    }

    const hidden = (result.data.comments || []).filter((comment) => comment.status === "hidden");
    if (!hidden.length) return;

    const section = document.createElement("section");
    section.className = "wikiwise-hub-hidden-comments";
    const title = document.createElement("h3");
    title.textContent = "Hidden comments";
    section.appendChild(title);

    for (const comment of hidden) {
      section.appendChild(renderHiddenComment(comment, pagePath, root, profile));
    }

    root.appendChild(section);
  }

  function renderHiddenComment(comment, pagePath, commentsRoot, profile) {
    const row = document.createElement("div");
    row.className = "wikiwise-hub-hidden-comment";

    const body = document.createElement("span");
    body.className = "wikiwise-hub-hidden-comment-body";
    body.textContent = comment.body;
    row.appendChild(body);

    const restore = document.createElement("button");
    restore.type = "button";
    restore.textContent = "Restore";
    restore.addEventListener("click", () => restoreComment(comment.id, pagePath, commentsRoot, profile, restore));
    row.appendChild(restore);

    return row;
  }

  async function hideComment(commentId, pagePath, commentsRoot, profile, button) {
    await updateCommentModeration(commentId, "hidden", pagePath, commentsRoot, profile, button);
  }

  async function restoreComment(commentId, pagePath, commentsRoot, profile, button) {
    await updateCommentModeration(commentId, "visible", pagePath, commentsRoot, profile, button);
  }

  async function updateCommentModeration(commentId, status, pagePath, commentsRoot, profile, button) {
    if (button) button.disabled = true;
    const result = await fetchJson("/_wikiwise/admin/comments/" + encodeURIComponent(commentId), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });
    if (!result.ok) {
      if (button) button.disabled = false;
      appendStatus(commentsRoot, result.error || "Unable to update comment.", "wikiwise-hub-error");
      return;
    }
    await renderCommentsSurface(commentsRoot, profile);
  }

  function renderComposer(pagePath, parentCommentId, commentsRoot, profile) {
    const form = document.createElement("form");
    form.className = "wikiwise-hub-comment-composer";

    const textarea = document.createElement("textarea");
    textarea.name = "body";
    textarea.required = true;
    textarea.placeholder = parentCommentId ? "Write a reply..." : "Write a comment...";

    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = parentCommentId ? "Post reply" : "Post comment";

    form.append(textarea, button);
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const body = textarea.value.trim();
      if (!body) return;

      button.disabled = true;
      const result = await fetchJson("/_wikiwise/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          pagePath,
          parentCommentId,
          body
        })
      });
      button.disabled = false;

      if (!result.ok) {
        appendStatus(form, result.error || "Unable to post comment.", "wikiwise-hub-error");
        return;
      }
      await renderCommentsSurface(commentsRoot, profile);
    });

    return form;
  }

  async function fetchJson(path, options) {
    const response = await fetch(path, {
      credentials: "same-origin",
      ...(options || {})
    });
    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      let error = errorText || response.statusText;
      try {
        const errorData = errorText ? JSON.parse(errorText) : null;
        error = errorData && errorData.error ? errorData.error : error;
      } catch {
        // Keep the plain response text.
      }
      return {
        ok: false,
        status: response.status,
        error
      };
    }
    if (response.status === 204) {
      return {
        ok: true,
        status: response.status,
        data: null
      };
    }
    return {
      ok: true,
      status: response.status,
      data: await response.json()
    };
  }

  function currentPagePath() {
    const path = decodeURIComponent(window.location.pathname.replace(/^\\/+/, ""));
    return path || "index.html";
  }

  function appendStatus(root, message, className) {
    const status = document.createElement("p");
    status.className = className;
    status.textContent = message;
    root.appendChild(status);
  }
})();
`.trim();
