-- init.sql - Schema for Solo Sparks

-- Drop tables if they exist
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS quests CASCADE;
DROP TABLE IF EXISTS user_quests CASCADE;
DROP TABLE IF EXISTS reflections CASCADE;
DROP TABLE IF EXISTS points CASCADE;
DROP TABLE IF EXISTS rewards CASCADE;
DROP TABLE IF EXISTS redemptions CASCADE;

-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quests
CREATE TABLE quests (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[],
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly')) NOT NULL
);

-- Reflections linked to a quest by user
CREATE TABLE user_quests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  quest_id INTEGER REFERENCES quests(id) ON DELETE SET NULL,
  reflection_text TEXT,
  photo_url TEXT,
  audio_url TEXT,
  mood TEXT,
  emotional_needs TEXT[],
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Spark Points
CREATE TABLE points (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  points_earned INTEGER NOT NULL DEFAULT 0,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rewards
CREATE TABLE rewards (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cost INTEGER NOT NULL
);

-- Claimed Rewards
CREATE TABLE redemptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  reward_id INTEGER REFERENCES rewards(id) ON DELETE CASCADE,
  claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for quick lookup
CREATE INDEX idx_userquests_user ON user_quests(user_id);
CREATE INDEX idx_points_user ON points(user_id);
CREATE INDEX idx_redemptions_user ON redemptions(user_id);
