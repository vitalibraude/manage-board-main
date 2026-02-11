#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Setup Supabase Database for TaskFlow Pro
Creates tables and loads data from Excel
"""

import os
import json
from supabase import create_client, Client
import pandas as pd
from datetime import datetime

# Supabase credentials
SUPABASE_URL = "https://xlwbwzrqytuxdyfyuqbi.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhsd2J3enJxeXR1eGR5Znl1cWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MTE3NzUsImV4cCI6MjA4NjM4Nzc3NX0.ByWTZOzw6UlNooGGhjsH62PHwqD3SWQ5e6W11o7Pyvo"

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# 12 סטטוסים לפי התהליך
STATUSES = [
    "אפיין",
    "החלנו אפיון",
    "סיימנו אפיון",
    "נשלח אפיון ללקוח",
    "הלקוח נתן תיקונים לאפיון",
    "הלקוח אישר אפיון",
    "אצל המתכנת",
    "המתכנת סיים",
    "QA: הQA נתן הערות",
    "QA: אישר",
    "הלקוח ראה פיתוח והוסיף הערות",
    "הלקוח אישר",
    "משימה גמורה"
]

# צבעים לסטטוסים
STATUS_COLORS = {
    "אפיין": "#9333EA",
    "החלנו אפיון": "#A855F7",
    "סיימנו אפיון": "#7C3AED",
    "נשלח אפיון ללקוח": "#6366F1",
    "הלקוח נתן תיקונים לאפיון": "#EF4444",
    "הלקוח אישר אפיון": "#10B981",
    "אצל המתכנת": "#F59E0B",
    "המתכנת סיים": "#3B82F6",
    "QA: הQA נתן הערות": "#F97316",
    "QA: אישר": "#14B8A6",
    "הלקוח ראה פיתוח והוסיף הערות": "#EC4899",
    "הלקוח אישר": "#22C55E",
    "משימה גמורה": "#059669"
}

def read_excel_data():
    """קריאת נתונים מהאקסל"""
    print("📖 קורא נתונים מהאקסל...")
    
    # קריאת פרויקטים
    df_projects = pd.read_excel('data.xlsx', sheet_name='פרויקטים')
    
    # קריאת אנשי קשר
    df_contacts = pd.read_excel('data.xlsx', sheet_name='אנשי קשר')
    
    # קריאת מפתחים
    df_developers = pd.read_excel('data.xlsx', sheet_name='מפתחים', skiprows=1)
    
    return df_projects, df_contacts, df_developers

def create_developers_table():
    """יצירת טבלת מפתחים"""
    print("\n👨‍💻 יוצר טבלת מפתחים...")
    
    developers = [
        {"name": "סרגי", "email": "sergey@example.com", "active": True},
        {"name": "זאק", "email": "zak@example.com", "active": True},
        {"name": "ניקולה", "email": "nikolay@example.com", "active": True},
        {"name": "ולאד", "email": "vlad@example.com", "active": True}
    ]
    
    try:
        # נסה להוסיף כל מפתח
        for dev in developers:
            try:
                result = supabase.table('developers').insert(dev).execute()
                print(f"  ✅ {dev['name']}")
            except Exception as e:
                if "duplicate" in str(e).lower():
                    print(f"  ⚠️  {dev['name']} - כבר קיים")
                else:
                    print(f"  ❌ {dev['name']}: {e}")
    except Exception as e:
        print(f"  ❌ שגיאה: {e}")

def create_contacts_table(df_contacts):
    """יצירת טבלת אנשי קשר"""
    print("\n👥 יוצר טבלת אנשי קשר...")
    
    contacts_list = []
    
    for _, row in df_contacts.iterrows():
        client = str(row.get('לקוח', '')).strip()
        name = str(row.get('שם', '')).strip()
        phone = str(row.get('טלפון', '')).strip()
        details = str(row.get('פירוט', '')).strip()
        
        # רק לקוחות רלוונטיים
        if client in ['רם אדרת', 'נצרת', 'AITECH', 'מפעל הפיס'] and name and name != 'nan':
            contacts_list.append({
                "client": client,
                "name": name,
                "phone": phone,
                "role": details if details != 'nan' else '',
            })
    
    try:
        # הכנסה קבוצתית
        if contacts_list:
            result = supabase.table('contacts').insert(contacts_list).execute()
            print(f"  ✅ הוכנסו {len(contacts_list)} אנשי קשר")
    except Exception as e:
        if "duplicate" in str(e).lower():
            print(f"  ⚠️  חלק מאנשי הקשר כבר קיימים")
        else:
            print(f"  ❌ שגיאה: {e}")

def create_projects_table(df_projects):
    """יצירת טבלת פרויקטים"""
    print("\n🏢 יוצר טבלת פרויקטים...")
    
    clients = ['רם אדרת', 'נצרת', 'AITECH', 'מפעל הפיס']
    projects_list = []
    
    for _, row in df_projects.iterrows():
        # בדיקה אם השורה מכילה לקוח רלוונטי
        row_str = ' '.join([str(val) for val in row.values if pd.notna(val)])
        
        for client in clients:
            if client in row_str:
                project_name = str(row.iloc[0]) if pd.notna(row.iloc[0]) else ''
                
                if project_name and project_name != 'nan' and len(project_name) > 2:
                    projects_list.append({
                        "name": project_name,
                        "client": client,
                        "active": True
                    })
                    break
    
    try:
        if projects_list:
            # הסרת כפילויות
            unique_projects = []
            seen = set()
            for p in projects_list:
                key = f"{p['name']}_{p['client']}"
                if key not in seen:
                    unique_projects.append(p)
                    seen.add(key)
            
            result = supabase.table('projects').insert(unique_projects).execute()
            print(f"  ✅ הוכנסו {len(unique_projects)} פרויקטים")
    except Exception as e:
        if "duplicate" in str(e).lower():
            print(f"  ⚠️  חלק מהפרויקטים כבר קיימים")
        else:
            print(f"  ❌ שגיאה: {e}")

def create_tasks_from_json():
    """יצירת משימות מקובץ ה-JSON"""
    print("\n📋 יוצר משימות מהנתונים...")
    
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
            print(f"  ✅ הוכנסו {len(tasks_list)} משימות")
            return True
    except Exception as e:
        if "duplicate" in str(e).lower():
            print(f"  ⚠️  חלק מהמשימות כבר קיימות")
        else:
            print(f"  ❌ שגיאה: {e}")
    
    return False

def main():
    """הרצה ראשית"""
    print("🚀 TaskFlow Pro - Supabase Setup")
    print("=" * 50)
    
    # קריאת נתונים
    df_projects, df_contacts, df_developers = read_excel_data()
    
    # יצירת טבלאות והכנסת נתונים
    create_developers_table()
    create_contacts_table(df_contacts)
    create_projects_table(df_projects)
    create_tasks_from_json()
    
    print("\n" + "=" * 50)
    print("✅ הגדרת Supabase הושלמה!")
    print(f"🌐 URL: {SUPABASE_URL}")
    print("📊 טבלאות: developers, contacts, projects, tasks, notes")
    print("\nהסטטוסים החדשים (12):")
    for i, status in enumerate(STATUSES, 1):
        print(f"  {i}. {status}")

if __name__ == "__main__":
    main()
