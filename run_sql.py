#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import requests
import json

SUPABASE_URL = "https://xlwbwzrqytuxdyfyuqbi.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3YndienJxeXR1eGR5Znl1cWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0OTc4NDMsImV4cCI6MjA1NTA3Mzg0M30.z1QJZqhPSrEXqgZ2VNnj3Zm8yzmKLzVx5uJEYYz_uYM"

# Read SQL file
with open('supabase_schema.sql', 'r', encoding='utf-8') as f:
    sql_content = f.read()

# Split by semicolons and execute each statement
statements = [s.strip() for s in sql_content.split(';') if s.strip() and not s.strip().startswith('--')]

print("🚀 מריץ SQL statements ב-Supabase...\n")

# We'll use the PostgREST API directly
headers = {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
    'Content-Type': 'application/json'
}

# First, let's just try to verify the connection and see what tables exist
url = f"{SUPABASE_URL}/rest/v1/"
response = requests.get(url, headers=headers)
print(f"📡 Connection test: {response.status_code}")

if response.status_code == 200:
    print("✅ חיבור ל-Supabase תקין!")
else:
    print(f"❌ בעיה בחיבור: {response.text}")

print("\n⚠️  לא יכול להריץ SQL ישירות דרך API.")
print("📝 אנא העתק את הקובץ supabase_schema.sql ל-Supabase SQL Editor:")
print(f"   {SUPABASE_URL.replace('.supabase.co', '.supabase.co')}/project/xlwbwzrqytuxdyfyuqbi/sql")
print("\nאו נסה דרך הפייתון client...")
