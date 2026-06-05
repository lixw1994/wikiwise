CREATE TABLE IF NOT EXISTS wiki_invitations (
  id TEXT PRIMARY KEY,
  wiki_slug TEXT NOT NULL REFERENCES wikis(slug) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  created_by_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'revoked')),
  expires_at TEXT NOT NULL,
  accepted_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  accepted_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_wiki_invitations_wiki_slug ON wiki_invitations(wiki_slug);
CREATE INDEX IF NOT EXISTS idx_wiki_invitations_token_hash ON wiki_invitations(token_hash);
