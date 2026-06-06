CREATE TABLE IF NOT EXISTS user_profile_overrides (
  identity_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wiki_slug TEXT REFERENCES wikis(slug) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_profile_overrides_user_id ON user_profile_overrides(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profile_overrides_wiki_slug ON user_profile_overrides(wiki_slug);
