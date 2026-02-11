#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import requests

SUPABASE_URL = "https://xlwbwzrqytuxdyfyuqbi.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhsd2J3enJxeXR1eGR5Znl1cWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MTE3NzUsImV4cCI6MjA4NjM4Nzc3NX0.ByWTZOzw6UlNooGGhjsH62PHwqD3SWQ5e6W11o7Pyvo"

# SQL statements to create tables
sql_statements = [
    """
    CREATE TABLE IF NOT EXISTS developers (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        email TEXT,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS projects (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        client TEXT NOT NULL,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(name, client)
    );
    """,
    """
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
    """,
    """
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
    """,
    """
    CREATE TABLE IF NOT EXISTS notes (
        id BIGSERIAL PRIMARY KEY,
        task_id BIGINT REFERENCES tasks(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        author TEXT DEFAULT 'מנהל המערכת',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """
]

print("🚀 יוצר טבלאות ב-Supabase...\n")

headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json'
}

# Try using the RPC endpoint to execute SQL
for i, sql in enumerate(sql_statements, 1):
    print(f"📝 יוצר טבלה {i}/{len(sql_statements)}...")
    
    # Use supabase-py rpc method instead
    try:
        url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
        response = requests.post(
            url,
            headers=headers,
            json={'query': sql}
        )
        
        if response.status_code in [200, 201]:
            print(f"  ✅ הצלחה!")
        else:
            print(f"  ⚠️  Status: {response.status_code}")
            print(f"      Response: {response.text[:200]}")
    except Exception as e:
        print(f"  ❌ שגיאה: {e}")

print("\n" + "="*50)
print("💡 אם הטבלאות לא נוצרו, אנא הריץ את הפקודות ב-Supabase SQL Editor:")
print(f"   {SUPABASE_URL}/project/xlwbwzrqytuxdyfyuqbi/sql/new")
print("\nהעתק את הקובץ: supabase_schema.sql")
