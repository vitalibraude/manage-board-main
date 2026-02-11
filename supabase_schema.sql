-- TaskFlow Pro Database Schema
-- Run this in Supabase SQL Editor

-- 1. טבלת מפתחים (Developers)
CREATE TABLE IF NOT EXISTS developers (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    email TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. טבלת לקוחות/פרויקטים (Projects)
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    client TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, client)
);

-- 3. טבלת אנשי קשר (Contacts)
CREATE TABLE IF NOT EXISTS contacts (
    id BIGSERIAL PRIMARY KEY,
    client TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(client, name)
);

-- 4. טבלת משימות (Tasks)
CREATE TABLE IF NOT EXISTS tasks (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    project TEXT NOT NULL,
    developer TEXT NOT NULL,
    contact TEXT NOT NULL,
    status TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. טבלת הערות (Notes)
CREATE TABLE IF NOT EXISTS notes (
    id BIGSERIAL PRIMARY KEY,
    task_id BIGINT REFERENCES tasks(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    author TEXT DEFAULT 'מנהל המערכת',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project);
CREATE INDEX IF NOT EXISTS idx_tasks_developer ON tasks(developer);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_notes_task_id ON notes(task_id);
CREATE INDEX IF NOT EXISTS idx_contacts_client ON contacts(client);

-- Enable Row Level Security (RLS)
ALTER TABLE developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (adjust as needed for production)
CREATE POLICY "Enable all operations for developers" ON developers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for contacts" ON contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for notes" ON notes FOR ALL USING (true) WITH CHECK (true);

-- Insert initial developers
INSERT INTO developers (name, email) VALUES 
    ('סרגי', 'sergey@example.com'),
    ('זאק', 'zak@example.com'),
    ('ניקולה', 'nikolay@example.com'),
    ('ולאד', 'vlad@example.com')
ON CONFLICT (name) DO NOTHING;
