CREATE TABLE IF NOT EXISTS feature_media (
  id BIGSERIAL PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('hostel', 'marketplace', 'story')),
  entity_id TEXT NOT NULL,
  secure_url TEXT NOT NULL,
  public_id TEXT,
  resource_type TEXT NOT NULL DEFAULT 'image' CHECK (resource_type IN ('image', 'video', 'raw')),
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feature_media_entity ON feature_media(entity_type, entity_id, position);

CREATE TABLE IF NOT EXISTS hostels (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  price NUMERIC(12, 2),
  phone TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  premium_user BOOLEAN NOT NULL DEFAULT FALSE,
  extra JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hostels_created_at ON hostels(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hostels_owner_id ON hostels(owner_id);
CREATE INDEX IF NOT EXISTS idx_hostels_location ON hostels(LOWER(location));
CREATE INDEX IF NOT EXISTS idx_hostels_price ON hostels(price);
CREATE INDEX IF NOT EXISTS idx_hostels_search ON hostels USING GIN (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(location, '') || ' ' || coalesce(description, '')));

CREATE TABLE IF NOT EXISTS marketplace_items (
  id TEXT PRIMARY KEY,
  seller_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(12, 2),
  phone TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  premium_user BOOLEAN NOT NULL DEFAULT FALSE,
  extra JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marketplace_created_at ON marketplace_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_seller_id ON marketplace_items(seller_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_category ON marketplace_items(LOWER(category));
CREATE INDEX IF NOT EXISTS idx_marketplace_price ON marketplace_items(price);
CREATE INDEX IF NOT EXISTS idx_marketplace_search ON marketplace_items USING GIN (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(category, '') || ' ' || coalesce(description, '')));

CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT 'A student',
  author_avatar TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  genre TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  cover_image TEXT NOT NULL DEFAULT '',
  cover_public_id TEXT,
  cover_resource_type TEXT NOT NULL DEFAULT 'image',
  status TEXT NOT NULL DEFAULT 'draft',
  views INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  bookmarks INTEGER NOT NULL DEFAULT 0,
  chapters_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  liked_by JSONB NOT NULL DEFAULT '{}'::jsonb,
  expires_at TIMESTAMPTZ,
  extra JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_author_id ON stories(author_id);
CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status);
CREATE INDEX IF NOT EXISTS idx_stories_expires_at ON stories(expires_at);
CREATE INDEX IF NOT EXISTS idx_stories_search ON stories USING GIN (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(author_name, '') || ' ' || coalesce(genre, '')));

CREATE TABLE IF NOT EXISTS story_comments (
  id TEXT PRIMARY KEY,
  story_id TEXT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT 'Anonymous',
  author_avatar TEXT NOT NULL DEFAULT '',
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_story_comments_story_created ON story_comments(story_id, created_at DESC);
