#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Create Supabase tables using direct SQL execution via REST API
"""
import requests
import time

SUPABASE_URL = "https://xlwbwzrqytuxdyfyuqbi.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhsd2J3enJxeXR1eGR5Znl1cWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MTE3NzUsImV4cCI6MjA4NjM4Nzc3NX0.ByWTZOzw6UlNooGGhjsH62PHwqD3SWQ5e6W11o7Pyvo"

# Read the SQL file
with open('supabase_schema.sql', 'r', encoding='utf-8') as f:
    sql_content = f.read()

print("🚀 יוצר טבלאות ב-Supabase...\n")
print("⚠️  שים לב: צריך להריץ את ה-SQL ב-Supabase SQL Editor ידנית.")
print("📋 העתקתי את ה-SQL למטה - העתק והדבק ב:\n")
print("🔗 https://supabase.com/dashboard/project/xlwbwzrqytuxdyfyuqbi/sql/new\n")
print("="*70)
print(sql_content)
print("="*70)
print("\n✅ לאחר הרצת ה-SQL, הרץ: python3 setup_supabase.py")

