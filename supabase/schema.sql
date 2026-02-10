-- ════════════════════════════════════════════════════
-- ZeroDay Classes — Supabase Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ════════════════════════════════════════════════════

-- 1. Job Posts Table
CREATE TABLE IF NOT EXISTS job_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  post_date TIMESTAMPTZ DEFAULT NOW(),
  last_date TIMESTAMPTZ NOT NULL,
  vacancies INTEGER,
  qualification TEXT,
  category TEXT NOT NULL DEFAULT 'OSSC',
  apply_link TEXT NOT NULL,
  notification_pdf TEXT,
  is_new BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Mock Tests Table
CREATE TABLE IF NOT EXISTS mock_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'full' CHECK (type IN ('full', 'subject', 'premium')),
  subject TEXT,
  time_limit INTEGER NOT NULL DEFAULT 120,
  negative_marking REAL NOT NULL DEFAULT 0.25,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Questions Table (linked to mock_tests)
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID NOT NULL REFERENCES mock_tests(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  correct INTEGER NOT NULL DEFAULT 0,
  explanation TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security
ALTER TABLE job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- 5. Policies: Anyone can read all data
CREATE POLICY "Public read job_posts" ON job_posts FOR SELECT USING (true);
CREATE POLICY "Public read mock_tests" ON mock_tests FOR SELECT USING (true);
CREATE POLICY "Public read questions" ON questions FOR SELECT USING (true);

-- 6. Policies: Anyone can insert/update/delete (admin auth handled in app)
-- For a simple setup, we allow all operations and rely on app-level auth
CREATE POLICY "Allow all insert job_posts" ON job_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update job_posts" ON job_posts FOR UPDATE USING (true);
CREATE POLICY "Allow all delete job_posts" ON job_posts FOR DELETE USING (true);

CREATE POLICY "Allow all insert mock_tests" ON mock_tests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update mock_tests" ON mock_tests FOR UPDATE USING (true);
CREATE POLICY "Allow all delete mock_tests" ON mock_tests FOR DELETE USING (true);

CREATE POLICY "Allow all insert questions" ON questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update questions" ON questions FOR UPDATE USING (true);
CREATE POLICY "Allow all delete questions" ON questions FOR DELETE USING (true);

-- 7. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_questions_test_id ON questions(test_id);
CREATE INDEX IF NOT EXISTS idx_job_posts_category ON job_posts(category);
CREATE INDEX IF NOT EXISTS idx_mock_tests_type ON mock_tests(type);
