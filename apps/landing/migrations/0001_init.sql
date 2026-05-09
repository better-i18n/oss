-- Landing D1 schema: applications + comments
-- Run: wrangler d1 execute betteri18n-landing-db --file=migrations/0001_init.sql

CREATE TABLE IF NOT EXISTS applications (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  role       TEXT NOT NULL,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  linkedin   TEXT,
  message    TEXT,
  r2_key     TEXT,
  filename   TEXT,
  status     TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  ip         TEXT,
  country    TEXT
);

CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created ON applications(created_at DESC);

CREATE TABLE IF NOT EXISTS comments (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  post_slug  TEXT NOT NULL,
  name       TEXT NOT NULL,
  email      TEXT,
  body       TEXT NOT NULL,
  approved   INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  ip         TEXT,
  parent_id  INTEGER REFERENCES comments(id)
);

CREATE INDEX idx_comments_slug ON comments(post_slug, approved);
CREATE INDEX idx_comments_created ON comments(created_at DESC);
