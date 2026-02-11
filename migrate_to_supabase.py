#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Migrate all data from JSON to Supabase
Run this AFTER creating the tables in Supabase SQL Editor
"""

import json
from supabase import create_client
import pandas as pd

SUPABASE_URL = "https://xlwbwzrqytuxdyfyuqbi.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhsd2J3enJxeXR1eGR5Znl1cWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MTE3NzUsImV4cCI6MjA4NjM4Nzc3NX0.ByWTZOzw6UlNooGGhjsH62PHwqD3SWQ5e6W11o7Pyvo"

# Initialize Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def check_tables():
    """בדיקה אם הטבלאות קיימות"""
    print("🔍 בודק אם הטבלאות קיימות...\n")
    
    tables = ['developers', 'projects', 'contacts', 'tasks']
    all_exist = True
    
    for table in tables:
        try:
            result = supabase.table(table).select("id").limit(1).execute()
            print(f"✅ {table} - קיימת")
        except Exception as e:
            if "Could not find" in str(e):
                print(f"❌ {table} - לא קיימת!")
                all_exist = False
            else:
                print(f"⚠️  {table} - שגיאה: {str(e)[:50]}")
                all_exist = False
    
    return all_exist

def migrate_developers():
    """העברת מפתחים"""
    print("\n👨‍💻 מעביר מפתחים...")
    
    developers = [
        {"name": "סרגי", "email": "sergey@example.com"},
        {"name": "זאק", "email": "zak@example.com"},
        {"name": "ניקולה", "email": "nikolay@example.com"},
        {"name": "ולאד", "email": "vlad@example.com"}
    ]
    
    try:
        result = supabase.table('developers').insert(developers).execute()
        print(f"  ✅ הועברו {len(developers)} מפתחים")
        return True
    except Exception as e:
        if "duplicate" in str(e).lower():
            print(f"  ⚠️  מפתחים כבר קיימים")
            return True
        print(f"  ❌ שגיאה: {e}")
        return False

def migrate_contacts():
    """העברת אנשי קשר"""
    print("\n👥 מעביר אנשי קשר...")
    
    try:
        df = pd.read_excel('data.xlsx', sheet_name='אנשי קשר')
        contacts_list = []
        
        for _, row in df.iterrows():
            client = str(row.get('לקוח', '')).strip()
            name = str(row.get('שם', '')).strip()
            phone = str(row.get('טלפון', '')).strip()
            details = str(row.get('פירוט', '')).strip()
            
            if client in ['רם אדרת', 'נצרת', 'AITECH', 'מפעל הפיס'] and name and name != 'nan':
                contacts_list.append({
                    "client": client,
                    "name": name,
                    "phone": phone,
                    "role": details if details != 'nan' else '',
                })
        
        if contacts_list:
            result = supabase.table('contacts').insert(contacts_list).execute()
            print(f"  ✅ הועברו {len(contacts_list)} אנשי קשר")
            return True
    except Exception as e:
        if "duplicate" in str(e).lower():
            print(f"  ⚠️  חלק מאנשי הקשר כבר קיימים")
            return True
        print(f"  ❌ שגיאה: {e}")
        return False

def migrate_projects():
    """העברת פרויקטים"""
    print("\n🏢 מעביר פרויקטים...")
    
    try:
        df = pd.read_excel('data.xlsx', sheet_name='פרויקטים')
        clients = ['רם אדרת', 'נצרת', 'AITECH', 'מפעל הפיס']
        projects_list = []
        seen = set()
        
        for _, row in df.iterrows():
            row_str = ' '.join([str(val) for val in row.values if pd.notna(val)])
            
            for client in clients:
                if client in row_str:
                    project_name = str(row.iloc[0]) if pd.notna(row.iloc[0]) else ''
                    
                    if project_name and project_name != 'nan' and len(project_name) > 2:
                        key = f"{project_name}_{client}"
                        if key not in seen:
                            projects_list.append({
                                "name": project_name,
                                "client": client,
                            })
                            seen.add(key)
                        break
        
        if projects_list:
            result = supabase.table('projects').insert(projects_list).execute()
            print(f"  ✅ הועברו {len(projects_list)} פרויקטים")
            return True
    except Exception as e:
        if "duplicate" in str(e).lower():
            print(f"  ⚠️  חלק מהפרויקטים כבר קיימים")
            return True
        print(f"  ❌ שגיאה: {e}")
        return False

def migrate_tasks():
    """העברת משימות מה-JSON"""
    print("\n📋 מעביר משימות...")
    
    try:
        with open('projects_data.json', 'r', encoding='utf-8') as f:
            tasks = json.load(f)
        
        tasks_list = []
        for task in tasks:
            tasks_list.append({
                "title": task['title'],
                "project": task['project'],
                "developer": task['developer'],
                "contact": task['contact'],
                "status": task['status'],
                "description": task['description'],
                "created_at": task['createdAt'],
                "updated_at": task['updatedAt']
            })
        
        if tasks_list:
            result = supabase.table('tasks').insert(tasks_list).execute()
            print(f"  ✅ הועברו {len(tasks_list)} משימות")
            return True
    except Exception as e:
        if "duplicate" in str(e).lower():
            print(f"  ⚠️  חלק מהמשימות כבר קיימות")
            return True
        print(f"  ❌ שגיאה: {e}")
        return False

def main():
    print("=" * 70)
    print("🚀 TaskFlow Pro - העברת נתונים ל-Supabase")
    print("=" * 70)
    
    # Check if tables exist
    if not check_tables():
        print("\n❌ לא כל הטבלאות קיימות!")
        print("\n📝 אנא הרץ את ה-SQL הבא ב-Supabase SQL Editor:")
        print("   https://supabase.com/dashboard/project/xlwbwzrqytuxdyfyuqbi/sql/new")
        print("\nהעתק את התוכן מהקובץ: supabase_schema.sql")
        return
    
    print("\n" + "=" * 70)
    print("✅ כל הטבלאות קיימות! מתחיל העברה...\n")
    
    # Migrate all data
    migrate_developers()
    migrate_contacts()
    migrate_projects()
    migrate_tasks()
    
    print("\n" + "=" * 70)
    print("✅ ההעברה הושלמה!")
    print("\n🌐 כעת האפליקציה תעבוד עם Supabase!")
    print("   פתח: https://8000-ialq8l8jzfk4pf22d588o-ea026bf9.sandbox.novita.ai")
    print("\n💡 כל הערה חדשה תישמר אוטומטית במסד הנתונים!")

if __name__ == "__main__":
    main()
